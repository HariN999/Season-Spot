import os
import json
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_caching import Cache
from pymongo import MongoClient
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime, timezone
import time

# --- Load environment variables ---
dotenv_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path)

# --- Logging ---
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# --- Flask App Initialization ---
app = Flask(__name__)

# --- CORS Setup ---
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "https://season-spot.vercel.app"]}})

# --- Cache Configuration ---
app.config['CACHE_TYPE'] = 'SimpleCache'
app.config['CACHE_DEFAULT_TIMEOUT'] = 600
cache = Cache(app)

# --- MongoDB Connection ---
try:
    mongo_uri = os.environ.get("MONGO_URI")
    client = MongoClient(mongo_uri)
    db = client.seasonspot_db
    suggestions_collection = db.suggestions
    logging.info("MongoDB connection successful.")
except Exception as e:
    logging.error(f"Error connecting to MongoDB: {e}")
    suggestions_collection = None

# --- Gemini AI Configuration ---
try:
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables.")
    genai.configure(api_key=api_key)
    logging.info("Gemini API key configured.")
except Exception as e:
    logging.error(f"Error configuring Gemini API key: {e}")

# --- Root Route ---
@app.route('/')
def index():
    return jsonify({"status": "ok", "message": "Season Spot Backend Running!"})

# --- API Endpoints ---
@app.route('/api/states', methods=['GET'])
@cache.cached(timeout=3600)
def get_states():
    states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chattisgarh", "Goa", "Gujarat",
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
        "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
        "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ]
    return jsonify(sorted(states))

@app.route('/api/info', methods=['GET'])
def get_state_info():
    state = request.args.get('state')
    season = request.args.get('season')

    if not state or not season or suggestions_collection is None:
        return jsonify({"error": "Missing parameters or DB connection issue."}), 400

    cache_key = f"info_{state}_{season}"

    try:
        # --- Check cache ---
        if cached_data := cache.get(cache_key):
            return jsonify([cached_data])

        # --- Check DB ---
        if db_suggestion := suggestions_collection.find_one({"state": state, "season": season}):
            db_suggestion["_id"] = str(db_suggestion["_id"])
            cache.set(cache_key, db_suggestion)
            return jsonify([db_suggestion])

        # --- Call AI API with retry ---
        if not api_key:
            fallback = {
                "state": state,
                "season": season,
                "vibe": "Heritage & Nature",
                "suitabilityScore": 8.5,
                "tempRange": "20°C - 30°C",
                "weatherDesc": f"Pleasant weather in {state} during {season}, ideal for exploring cultural landmarks and sampling local cuisine.",
                "food": [
                    {"name": f"{state} Regional Thali", "desc": "Authentic platter featuring seasonal vegetable curries, local grains & homemade pickles.", "tag": "Traditional"},
                    {"name": "Seasonal Sweet Delicacy", "desc": "Traditional regional dessert made with milk, nuts, and natural cane sugar.", "tag": "Dessert"}
                ],
                "locations": [
                    {"name": f"{state} Capital & Old Town", "highlight": "Historic architecture, bustling local bazaars & cultural centers.", "bestTime": "Morning"},
                    {"name": "Scenic Nature Sanctuary", "highlight": "Lush green parklands and scenic sunrise points.", "bestTime": "Sunset"}
                ],
                "travelTips": ["Carry lightweight cotton clothing and comfortable walking shoes", "Sample street food from recommended local vendors"],
                "last_updated": datetime.now(timezone.utc)
            }
            return jsonify([fallback]), 200

        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""
        Provide comprehensive seasonal travel and culinary information for {state}, India, for the {season} season.
        Return ONLY valid minified JSON format matching exactly this structure:
        {{
          "vibe": "e.g. Heritage, Beach, Wildlife, or Hill Station",
          "suitabilityScore": 8.8,
          "tempRange": "e.g. 24°C - 30°C",
          "weatherDesc": "A descriptive overview of the climate and scenery during this season.",
          "food": [
            {{"name": "Dish Name", "desc": "Short appetizing description", "tag": "e.g. Street Food, Traditional, or Dessert"}}
          ],
          "locations": [
            {{"name": "Location Name", "highlight": "What makes it special in this season", "bestTime": "e.g. Morning, Evening, or Full Day"}}
          ],
          "travelTips": [
            "Insider travel tip 1",
            "Insider travel tip 2"
          ]
        }}
        """
        ai_data = {}
        for attempt in range(3):
            try:
                response = model.generate_content(prompt)
                ai_data = json.loads(response.text.strip().replace('```json', '').replace('```', ''))
                break
            except Exception as e:
                logging.warning(f"AI call failed on attempt {attempt+1}: {e}")
                time.sleep(1)
                continue

        new_suggestion = {
            "state": state,
            "season": season,
            "vibe": ai_data.get("vibe", "Heritage & Nature"),
            "suitabilityScore": ai_data.get("suitabilityScore", 8.5),
            "tempRange": ai_data.get("tempRange", "20°C - 30°C"),
            "weatherDesc": ai_data.get("weatherDesc", f"Pleasant weather in {state} during {season}."),
            "food": ai_data.get("food", []),
            "locations": ai_data.get("locations", []),
            "travelTips": ai_data.get("travelTips", []),
            "last_updated": datetime.now(timezone.utc)
        }

        # --- Save to DB ---
        try:
            result = suggestions_collection.insert_one(new_suggestion)
            new_suggestion["_id"] = str(result.inserted_id)
        except Exception as e:
            logging.warning(f"DB insert failed: {e}")
            new_suggestion["_id"] = None

        cache.set(cache_key, new_suggestion)
        return jsonify([new_suggestion])

    except Exception as e:
        logging.error(f"Unexpected error: {e}")
        fallback = {
            "state": state,
            "season": season,
            "vibe": "Heritage & Nature",
            "suitabilityScore": 8.0,
            "tempRange": "20°C - 30°C",
            "weatherDesc": f"Pleasant climate in {state} during {season}.",
            "food": [],
            "locations": [],
            "travelTips": [],
            "last_updated": datetime.now(timezone.utc)
        }
        return jsonify([fallback]), 200

@app.route('/api/itinerary', methods=['POST'])
def generate_itinerary():
    data = request.get_json() or {}
    state = data.get('state', 'Goa')
    season = data.get('season', 'Winter')
    trip_type = data.get('tripType', 'Foodie & Cultural')
    budget = data.get('budget', 'Moderate')
    duration_str = data.get('duration', '3 Days')
    try:
        days = int(duration_str.split()[0])
    except Exception:
        days = 3

    if not api_key:
        fallback_plan = {}
        for d in range(1, days + 1):
            if d == 1:
                fallback_plan[f"day{d}"] = f"Arrival in {state} during {season}. Take a relaxing stroll through local heritage streets, sample iconic local snacks, and visit the main cultural museum."
            elif d == days:
                fallback_plan[f"day{d}"] = f"Cultural immersion and souvenir shopping in {state}'s vibrant artisanal bazaars. Farewell dinner featuring famous regional desserts."
            else:
                fallback_plan[f"day{d}"] = f"Day {d} exploration of top scenic highlights, local culinary spots, and heritage landmarks in {state}."
        return jsonify({
            "status": "success",
            "plan": fallback_plan
        })

    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        json_keys = ", ".join([f'"day{d}": "activities and food spots for day {d}"' for d in range(1, days + 1)])
        prompt = f"""
        Create a {days}-day travel itinerary for a trip to {state}, India during {season}.
        Style: {trip_type}, Budget: {budget}.
        Return ONLY minified valid JSON format matching exactly this structure:
        {{
          {json_keys}
        }}
        """
        response = model.generate_content(prompt)
        clean_text = response.text.strip().replace('```json', '').replace('```', '')
        parsed = json.loads(clean_text)
        return jsonify({"status": "success", "plan": parsed})
    except Exception as e:
        logging.error(f"Gemini itinerary generation error: {e}")
        fallback_plan = {}
        for d in range(1, days + 1):
            if d == 1:
                fallback_plan[f"day{d}"] = f"Arrival in {state} during {season}. Explore central landmarks and local food joints."
            elif d == days:
                fallback_plan[f"day{d}"] = f"Explore traditional handicrafts markets and enjoy a relaxing farewell evening."
            else:
                fallback_plan[f"day{d}"] = f"Day {d} of visiting top scenic destinations across {state} and enjoying regional specialties."
        return jsonify({
            "status": "fallback",
            "plan": fallback_plan
        })

# --- Main Execution ---
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
