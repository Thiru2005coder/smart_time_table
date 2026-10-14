"""
SmartTimetable — Configuration and Database Connection
Connects to MongoDB Atlas, Supabase, and Gemini AI
"""

import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import google.generativeai as genai

# Load environment variables
load_dotenv()

# ========================
# MongoDB Configuration
# ========================
MONGODB_URI = os.getenv("MONGODB_URI")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "smarttimetable")

uri = MONGODB_URI if (MONGODB_URI and "YOUR_PASSWORD" not in MONGODB_URI and "xxxxx" not in MONGODB_URI) else "mongodb://localhost:27017"
try:
    mongo_client = AsyncIOMotorClient(uri, serverSelectionTimeoutMS=2000)
    db = mongo_client[MONGODB_DB_NAME]
except Exception as e:
    print(f"MongoDB client initialization notice: {e}")
    mongo_client = None
    db = None

# ========================
# Supabase Configuration
# ========================
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

# ========================
# Gemini AI Configuration
# ========================
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY not set. AI features will be disabled.")
    gemini_model = None
else:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel("gemini-1.5-flash")

# ========================
# Application Configuration
# ========================
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-key")
APP_ENV = os.getenv("APP_ENV", "development")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5500").split(",")
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))


async def check_db_connection():
    """Verify MongoDB connection is alive"""
    try:
        await mongo_client.admin.command("ping")
        print("MongoDB connection successful")
        return True
    except Exception as e:
        print(f"MongoDB connection failed: {e}")
        return False


async def get_db():
    """Dependency injection for database"""
    return db