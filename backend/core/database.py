from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from core.config import settings
from models.user import User
from models.patient_task import PatientTask
from models.task_response import TaskResponse
from models.analytics_log import AnalyticsLog
from models.session import Session
import ssl


class Database:
    client: AsyncIOMotorClient = None


db = Database()


async def connect_to_mongo():
    """Create database connection with SSL/TLS support for MongoDB Atlas"""
    mongodb_url = settings.mongodb_url
    
    # Check if using MongoDB Atlas (mongodb+srv://)
    if mongodb_url.startswith("mongodb+srv://"):
        # For MongoDB Atlas, Motor handles SSL automatically
        # Add connection parameters for better reliability
        db.client = AsyncIOMotorClient(
            mongodb_url,
            serverSelectionTimeoutMS=30000,  # Increased timeout
            connectTimeoutMS=30000,
            socketTimeoutMS=30000,
            # Let Motor handle SSL automatically for mongodb+srv://
        )
    else:
        # For local MongoDB, no SSL needed
        db.client = AsyncIOMotorClient(
            mongodb_url,
            serverSelectionTimeoutMS=5000,
        )
    
    # Test connection
    try:
        await db.client.admin.command('ping')
        print("✅ MongoDB connection test successful")
    except Exception as e:
        print(f"❌ MongoDB connection test failed: {e}")
        print(f"   Connection URL: {mongodb_url[:50]}...")
        raise
    
    await init_beanie(
        database=db.client[settings.mongodb_db_name],
        document_models=[User, PatientTask, TaskResponse, AnalyticsLog, Session]
    )
    print(f"✅ Connected to MongoDB database: {settings.mongodb_db_name}")


async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()

