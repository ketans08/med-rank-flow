#!/usr/bin/env python3
"""
Add dummy data directly to MongoDB (bypasses API)
Use this if backend API is not running
"""

import asyncio
import random
import sys
from datetime import datetime, timedelta
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent / "backend"
sys.path.insert(0, str(backend_path))

# Change to backend directory to load .env
import os
os.chdir(backend_path)

from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from models.user import User
from models.patient_task import PatientTask
from models.task_response import TaskResponse
from models.analytics_log import AnalyticsLog
from core.config import settings
import bcrypt

def hash_password(password: str) -> str:
    """Hash password using bcrypt directly"""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

# Dummy data
TASK_TITLES = [
    "Post-operative Physiotherapy Plan",
    "Cardiac Rehabilitation Assessment",
    "Pediatric Development Evaluation",
    "Geriatric Balance Assessment",
    "Sports Injury Rehabilitation",
    "Neurological Assessment Protocol",
    "Respiratory Care Plan",
    "Orthopedic Treatment Plan",
    "Mental Health Evaluation",
    "Chronic Pain Management"
]

PATIENT_NAMES = [
    "Mrs. Sarah Kumar", "Mr. James Wilson", "Tommy Chen", "Mrs. Dorothy Evans",
    "Alex Rodriguez", "Ms. Priya Patel", "Mr. Robert Thompson", "Mrs. Linda Martinez",
    "David Kim", "Ms. Jennifer Brown", "Mr. Michael Davis", "Mrs. Patricia Johnson"
]

COMPLAINTS = [
    "Post-op knee replacement recovery",
    "Post-MI cardiac rehabilitation",
    "Delayed motor development",
    "Recent falls, balance issues",
    "ACL reconstruction recovery",
    "Stroke rehabilitation",
    "Chronic obstructive pulmonary disease",
    "Hip fracture recovery",
    "Anxiety and depression",
    "Lower back pain management"
]


async def add_dummy_data():
    """Add dummy data directly to MongoDB"""
    print("=" * 60)
    print("🌱 Adding Dummy Data Directly to MongoDB")
    print("=" * 60)
    print()
    
    # Connect to MongoDB
    print("🔌 Connecting to MongoDB...")
    try:
        client = AsyncIOMotorClient(settings.mongodb_url)
        await init_beanie(
            database=client[settings.mongodb_db_name],
            document_models=[User, PatientTask, TaskResponse, AnalyticsLog]
        )
        print("✅ Connected to MongoDB\n")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        print("\n💡 Check your MongoDB Atlas URL in backend/.env")
        return
    
    # Get or create admin user
    admin = await User.find_one(User.email == "admin@institute.edu")
    if not admin:
        print("📝 Creating admin user...")
        admin = User(
            name="Dr. Sarah Chen",
            email="admin@institute.edu",
            password_hash=hash_password("admin123"),
            role="admin"
        )
        await admin.insert()
        print(f"✅ Created admin: {admin.email} / admin123\n")
    else:
        print(f"✅ Found admin: {admin.email}\n")
    
    admin_id = str(admin.id)
    
    # Get or create students
    students = await User.find(User.role == "student").to_list()
    
    if not students:
        print("📝 Creating students...")
        STUDENT_NAMES = [
            "John Smith", "Emma Wilson", "Mike Johnson", "Sarah Davis", "David Brown",
            "Lisa Anderson", "James Taylor", "Maria Garcia", "Robert Martinez", "Jennifer Lee",
            "William White", "Patricia Harris", "Michael Clark", "Linda Lewis", "Richard Walker",
            "Barbara Hall", "Joseph Allen", "Elizabeth Young", "Thomas King", "Susan Wright",
            "Charles Lopez", "Jessica Hill", "Christopher Scott", "Amanda Green", "Daniel Adams"
        ]
        
        num_students = random.randint(20, 25)
        selected_names = random.sample(STUDENT_NAMES, num_students)
        
        for i, name in enumerate(selected_names, 1):
            email = f"student{i:02d}@student.edu"
            student = User(
                name=name,
                email=email,
                password_hash=hash_password("student123"),
                role="student"
            )
            await student.insert()
            students.append(student)
            print(f"  ✅ Created student {i}/{num_students}: {email}")
        
        print(f"\n✅ Created {len(students)} students\n")
    else:
        print(f"✅ Found {len(students)} existing students\n")
    
    # Create tasks
    print("📝 Creating tasks with marks...")
    print()
    
    task_count = 0
    completed_count = 0
    
    for student in students:
        student_id = str(student.id)
        student_name = student.name
        
        # Create 3-8 tasks per student
        num_tasks = random.randint(3, 8)
        
        for i in range(num_tasks):
            # Random status distribution
            status_rand = random.random()
            if status_rand < 0.55:  # 55% completed
                status = "completed"
            elif status_rand < 0.80:  # 25% accepted
                status = "accepted"
            elif status_rand < 0.95:  # 15% pending
                status = "pending"
            else:  # 5% rejected
                status = "rejected"
            
            # Random task details
            title = random.choice(TASK_TITLES)
            patient_name = random.choice(PATIENT_NAMES)
            complaint = random.choice(COMPLAINTS)
            age = random.randint(8, 85)
            
            # Create task with random date
            days_ago = random.randint(1, 90)
            created_date = datetime.utcnow() - timedelta(days=days_ago)
            
            task = PatientTask(
                title=title,
                description=f"Comprehensive assessment and treatment plan for {complaint.lower()}",
                patient={
                    "name": patient_name,
                    "age": age,
                    "primary_complaint": complaint,
                    "notes": random.choice([
                        None,
                        "Patient requires special attention",
                        "Follow-up needed",
                        "Family history of similar conditions"
                    ])
                },
                assigned_student_id=student_id,
                status=status,
                created_at=created_date
            )
            
            # Add quality score if completed
            if status == "completed":
                quality_score = round(random.uniform(3.0, 5.0), 1)
                task.quality_score = quality_score
                task.completed_at = created_date + timedelta(days=random.randint(1, 7))
            
            await task.insert()
            task_count += 1
            
            # Create task response
            if status != "pending":
                response_time = created_date + timedelta(hours=random.randint(1, 48))
                await TaskResponse(
                    task_id=str(task.id),
                    student_id=student_id,
                    action=status,
                    reject_reason=random.choice([
                        "Too busy with other assignments",
                        "Not my area of specialization",
                        "Schedule conflict"
                    ]) if status == "rejected" else None,
                    timestamp=response_time
                ).insert()
            
            # Log analytics
            log_time = created_date
            if status == "completed":
                log_time = task.completed_at or created_date
            
            await AnalyticsLog(
                user_id=admin_id if status == "completed" else student_id,
                task_id=str(task.id),
                role="admin" if status == "completed" else "student",
                action=f"task_{status}",
                timestamp=log_time,
                metadata={"title": title, "score": task.quality_score} if status == "completed" else {}
            ).insert()
            
            if status == "completed":
                completed_count += 1
                print(f"  ✅ {student_name}: {title} (Score: {task.quality_score})")
            elif status == "pending":
                print(f"  📋 {student_name}: {title} (Pending)")
            else:
                print(f"  📝 {student_name}: {title} (Status: {status})")
    
    print()
    print("=" * 60)
    print("✅ Dummy Data Added Successfully!")
    print("=" * 60)
    print()
    print(f"Summary:")
    print(f"  • Tasks created: {task_count}")
    print(f"  • Tasks with marks: {completed_count}")
    print()
    print("You can now view the data in:")
    print("  • Admin Portal: http://localhost:5173")
    print("  • Student Portal: http://localhost:5174")
    print()
    
    client.close()


if __name__ == "__main__":
    try:
        asyncio.run(add_dummy_data())
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

