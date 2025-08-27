import os
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from dotenv import load_dotenv

# Load environment variables from your .env file
load_dotenv()

def test_mongo_connection():
    """Tests the connection to MongoDB Atlas and prints a detailed status."""
    
    mongo_uri = os.environ.get("MONGO_URI")

    if not mongo_uri:
        print("❌ ERROR: MONGO_URI not found in your .env file.")
        return

    print("--- MongoDB Connection Test ---")
    print(f"Attempting to connect to your cluster...")

    try:
        # Create a new client and connect to the server
        client = MongoClient(mongo_uri)

        # The ping command is sent to confirm a successful connection.
        client.admin.command('ping')
        
        print("\n✅ SUCCESS: MongoDB connection established successfully!")
        print("Your connection string and firewall settings are correct.")

    except ConnectionFailure as e:
        print("\n❌ FAILED: Could not connect to MongoDB.")
        print("\n--- Error Details ---")
        print(e)
        print("\n--- Troubleshooting ---")
        print("1. Double-check the password in your .env file's MONGO_URI.")
        print("2. Verify that Network Access in Atlas is set to '0.0.0.0/0' (Allow Access from Anywhere).")
        print("3. Ensure you have run: pip install \"pymongo[srv]\"")

    except Exception as e:
        print(f"\n❌ FAILED: An unexpected error occurred: {e}")

if __name__ == "__main__":
    test_mongo_connection()