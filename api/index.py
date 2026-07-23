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

    if not api_key:
        return jsonify({
            "status": "success",
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
            "travelTips": ["Carry lightweight cotton clothing and comfortable walking shoes", "Sample street food from recommended local vendors"]
        })

    try:
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
        response = model.generate_content(prompt)
        clean_text = response.text.strip().replace('```json', '').replace('```', '')
        parsed = json.loads(clean_text)
        return jsonify({"status": "success", **parsed})
    except Exception as e:
        logging.error(f"Error fetching state info: {e}")
        return jsonify({
            "status": "fallback",
            "vibe": "Heritage & Nature",
            "suitabilityScore": 8.0,
            "tempRange": "20°C - 30°C",
            "weatherDesc": f"Pleasant climate in {state} during {season}.",
            "food": [],
            "locations": [],
            "travelTips": []
        })

if __name__ == '__main__':
    app.run(port=5000)
