import os
import json
import logging
from flask import Flask, jsonify, request
from flask_cors import CORS
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# Configure Gemini AI if key exists
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    try:
        genai.configure(api_key=api_key)
    except Exception as e:
        logging.warning(f"Failed to configure Gemini API: {e}")

@app.route('/api/states', methods=['GET'])
def get_states():
    states = [
        "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chattisgarh", "Goa", "Gujarat",
        "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra",
        "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
        "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
    ]
    return jsonify(sorted(states))

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
        # Smart fallback if API key is not configured in Vercel env yet
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

@app.route('/api/info', methods=['GET'])
def get_info():
    state = request.args.get('state', 'Telangana')
    season = request.args.get('season', 'Monsoon')
    return jsonify([{
        "state": state,
        "season": season,
        "message": "Use instant frontend dataset for <50ms response"
    }])

if __name__ == '__main__':
    app.run(port=5000)
