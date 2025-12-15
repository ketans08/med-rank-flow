"""
Seed script to create initial admin and student users
Run with: python -m utils.seed
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from models.user import User
from core.config import settings
from core.security import get_password_hash


async def seed_users():
    """Create initial users"""
    client = AsyncIOMotorClient(settings.mongodb_url)
    await init_beanie(
        database=client[settings.mongodb_db_name],
        document_models=[User]
    )
    
    # Check if users already exist
    existing_admin = await User.find_one(User.email == "admin@institute.edu")
    if existing_admin:
        print("Users already seeded")
        return
    
    # Create admin user
    admin = User(
        name="Dr. Sarah Chen",
        email="admin@institute.edu",
        password_hash=get_password_hash("admin123"),
        role="admin"
    )
    await admin.insert()
    print(f"Created admin user: {admin.email}")
    
    # Create student users
    students = [
        User(
            name="John Smith",
            email="john@student.edu",
            password_hash=get_password_hash("student123"),
            role="student"
        ),
        User(
            name="Emma Wilson",
            email="emma@student.edu",
            password_hash=get_password_hash("student123"),
            role="student"
        ),
        User(
            name="Mike Johnson",
            email="mike@student.edu",
            password_hash=get_password_hash("student123"),
            role="student"
        ),
    ]
    
    for student in students:
        await student.insert()
        print(f"Created student user: {student.email}")
    
    print("\nSeeding complete!")
    print("\nDemo credentials:")
    print("Admin: admin@institute.edu / admin123")
    print("Students: john@student.edu / student123")


if __name__ == "__main__":
    asyncio.run(seed_users())

