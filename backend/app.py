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
load_dotenv()

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
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = f"""
        Provide seasonal information for {state}, India, for the {season} season.
        List 3-4 popular seasonal food dishes and 3-4 popular travel locations.
        Return as minified JSON: {{"food": ["Dish1", "Dish2"], "locations": ["Place1", "Place2"]}}.
        """
        ai_data = {"food": [], "locations": []}
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
            "food": ai_data.get("food", []),
            "locations": ai_data.get("locations", []),
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
            "food": [],
            "locations": [],
            "last_updated": datetime.now(timezone.utc)
        }
        return jsonify([fallback]), 200  # Always return 200 so frontend receives valid JSON

# --- Main Execution ---
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
