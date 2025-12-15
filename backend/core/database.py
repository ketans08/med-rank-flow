from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from core.config import settings
from models.user import User
from models.patient_task import PatientTask
from models.task_response import TaskResponse
from models.analytics_log import AnalyticsLog
from models.session import Session


class Database:
    client: AsyncIOMotorClient = None


db = Database()


async def connect_to_mongo():
    """Create database connection"""
    db.client = AsyncIOMotorClient(settings.mongodb_url)
    await init_beanie(
        database=db.client[settings.mongodb_db_name],
        document_models=[User, PatientTask, TaskResponse, AnalyticsLog, Session]
    )


async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()

