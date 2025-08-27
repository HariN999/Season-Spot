import os
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_caching import Cache
from pymongo import MongoClient
import google.generativeai as genai
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone

load_dotenv()

# --- App Initialization & Configuration ---
app = Flask(__name__)
# FIX: Add your live Vercel URL to the list of allowed origins
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "https://*.vercel.app"]}})


# Configure caching
app.config['CACHE_TYPE'] = 'SimpleCache'
app.config['CACHE_DEFAULT_TIMEOUT'] = 600 # 10 minutes
cache = Cache(app)

# --- MongoDB Connection ---
try:
    mongo_uri = os.environ.get("MONGO_URI")
    client = MongoClient(mongo_uri)
    db = client.seasonspot_db
    suggestions_collection = db.suggestions
    print("MongoDB connection successful.")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")
    suggestions_collection = None

# --- Configure the Google Gemini API ---
try:
    genai.configure(api_key=os.environ["GEMINI_API_KEY"])
    model = genai.GenerativeModel('gemini-1.5-flash')
    print("Gemini API configured.")
except Exception as e:
    print(f"Error configuring Gemini API: {e}")
    model = None

# --- API Endpoints ---

@app.route('/api/states', methods=['GET'])
@cache.cached(timeout=3600) # Cache this list for an hour
def get_states():
    """Returns a sorted list of Indian states."""
    states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat",
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
        "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
        "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ]
    return jsonify(sorted(states))

@app.route('/api/info', methods=['GET'])
def get_state_info():
    """Gets suggestions, automatically refreshing data if it's older than 30 days."""
    state = request.args.get('state')
    season = request.args.get('season')

    if not state or not season or suggestions_collection is None:
        return jsonify({"error": "Missing parameters or DB connection issue."}), 400

    cache_key = f"info_{state}_{season}"
    
    # 1. Check Cache
    if cached_data := cache.get(cache_key):
        return jsonify([cached_data])

    # 2. Check Database
    if db_suggestion := suggestions_collection.find_one({"state": state, "season": season}):
        is_stale = datetime.now(timezone.utc) - db_suggestion.get("last_updated", datetime.min.replace(tzinfo=timezone.utc)) > timedelta(days=30)
        
        if not is_stale:
            db_suggestion["_id"] = str(db_suggestion["_id"])
            cache.set(cache_key, db_suggestion)
            return jsonify([db_suggestion])
        else:
            suggestions_collection.delete_one({"_id": db_suggestion["_id"]})

    # 3. Call AI API
    if not model:
        return jsonify({"error": "AI model not configured"}), 500

    prompt = f"""
    Provide seasonal information for {state}, India, for the {season} season.
    List 3-4 popular seasonal food dishes and 3-4 popular travel locations.
    Return the response as a single, minified JSON object with no markdown.
    The JSON object must have two keys: "food" (an array of strings) and "locations" (an array of strings).
    Example: {{"food": ["Dish 1", "Dish 2"], "locations": ["Place 1", "Place 2"]}}
    """
    
    try:
        response = model.generate_content(prompt)
        ai_data = json.loads(response.text.strip().replace('```json', '').replace('```', ''))
        
        new_suggestion = {
            "state": state, "season": season,
            "food": ai_data.get("food", []),
            "locations": ai_data.get("locations", []),
            "last_updated": datetime.now(timezone.utc)
        }
        
        result = suggestions_collection.insert_one(new_suggestion)
        new_suggestion["_id"] = str(result.inserted_id)
        
        cache.set(cache_key, new_suggestion)
        return jsonify([new_suggestion])

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({"error": f"Failed to get AI suggestions for {state}."}), 500

# The '/api/like' endpoint has been removed as it is no longer used.

# --- Main Execution ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)
