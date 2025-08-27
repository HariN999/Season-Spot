import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load the .env file to get your API key
load_dotenv()

def test_gemini_api_key():
    """Tests the Gemini API key and prints a detailed status."""
    print("--- Gemini API Key Test ---")
    try:
        # 1. Check if the key is loaded
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            print("❌ ERROR: GEMINI_API_KEY not found in your .env file.")
            return

        print("API Key loaded. Configuring client...")

        # 2. Configure the client
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')

        print("Client configured. Sending a test prompt...")

        # 3. Send a simple test prompt
        response = model.generate_content("hello")

        # 4. Check the response
        if response.text:
            print("\n✅ SUCCESS: Your API key is working correctly!")
            print(f"AI Response: {response.text}")

    except Exception as e:
        # This will print the exact error from Google's server
        print("\n❌ FAILED: The API call failed.")
        print("\n--- Detailed Error from Google ---")
        print(e)
        print("\n--- Common Causes ---")
        print("1. The API key in your .env file might be incorrect or have a typo.")
        print("2. The Google Cloud project linked to your key might have billing disabled or an API disabled.")

if __name__ == "__main__":
    test_gemini_api_key()