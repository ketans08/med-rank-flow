#!/usr/bin/env python3
"""
Add new data with Indian names to the database
Uses same email/password pattern as existing data
Run: python3 add_indian_data.py
"""

import asyncio
import random
import sys
from datetime import datetime, timedelta, timezone
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
from core.security import get_password_hash

# Indian student names
INDIAN_STUDENT_NAMES = [
    "Arjun Sharma", "Priya Patel", "Rahul Kumar", "Ananya Singh", "Vikram Reddy",
    "Kavya Nair", "Aditya Iyer", "Meera Desai", "Rohan Joshi", "Sneha Menon",
    "Karan Malhotra", "Divya Agarwal", "Aman Gupta", "Isha Kapoor", "Ravi Verma",
    "Neha Chaturvedi", "Siddharth Rao", "Pooja Shah", "Varun Mehta", "Shreya Jain",
    "Rishabh Tiwari", "Anjali Saxena", "Kunal Pandey", "Tanvi Mishra", "Harsh Dubey",
    "Aishwarya Reddy", "Abhishek Sinha", "Riya Agarwal", "Nikhil Trivedi", "Sakshi Kulkarni",
    "Vivek Nair", "Aditi Menon", "Rohit Iyer", "Swati Deshmukh", "Kartik Joshi"
]

# Indian patient names
INDIAN_PATIENT_NAMES = [
    "Mr. Rajesh Kumar", "Mrs. Sunita Devi", "Master Arjun Singh", "Mrs. Kamala Reddy",
    "Mr. Suresh Patel", "Ms. Priya Sharma", "Mr. Mohan Iyer", "Mrs. Lakshmi Nair",
    "Mr. Ramesh Joshi", "Mrs. Geeta Desai", "Master Rohit Verma", "Mrs. Meera Kapoor",
    "Mr. Anil Gupta", "Mrs. Radha Agarwal", "Mr. Prakash Rao", "Mrs. Uma Menon",
    "Mr. Venkatesh Reddy", "Mrs. Padma Iyer", "Master Karan Malhotra", "Mrs. Shanti Patel",
    "Mr. Gopal Chaturvedi", "Mrs. Leela Saxena", "Mr. Balaji Tiwari", "Mrs. Savitri Mishra"
]

# Task titles (same as existing)
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

# Complaints (same as existing)
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


async def add_indian_data():
    """Add new data with Indian names to MongoDB"""
    print("=" * 60)
    print("🌱 Adding New Data with Indian Names")
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
        print("\n💡 Check your MongoDB URL in backend/.env")
        return
    
    # Get or create admin user
    admin = await User.find_one(User.email == "admin@institute.edu")
    if not admin:
        print("📝 Creating admin user...")
        admin = User(
            name="Dr. Rajesh Kumar",
            email="admin@institute.edu",
            password_hash=get_password_hash("admin123"),
            role="admin"
        )
        await admin.insert()
        print(f"✅ Created admin: {admin.email} / admin123\n")
    else:
        print(f"✅ Found admin: {admin.email}\n")
    
    admin_id = str(admin.id)
    
    # Get existing students to determine next student number
    existing_students = await User.find(User.role == "student").to_list()
    existing_count = len(existing_students)
    
    # Determine how many new students to add (5-10 new students)
    num_new_students = random.randint(5, 10)
    print(f"📚 Found {existing_count} existing students")
    print(f"📝 Adding {num_new_students} new students with Indian names...\n")
    
    # Select random Indian names
    selected_names = random.sample(INDIAN_STUDENT_NAMES, num_new_students)
    new_students = []
    
    for i, name in enumerate(selected_names, 1):
        student_num = existing_count + i
        email = f"student{student_num:02d}@student.edu"
        
        # Check if email already exists
        existing = await User.find_one(User.email == email)
        if existing:
            print(f"  ⚠️  Student {email} already exists, skipping...")
            continue
        
        student = User(
            name=name,
            email=email,
            password_hash=get_password_hash("student123"),
            role="student"
        )
        await student.insert()
        new_students.append(student)
        print(f"  ✅ Created student {i}/{num_new_students}: {email} ({name})")
    
    print(f"\n✅ Created {len(new_students)} new students\n")
    
    # Ensure all students have at least some completed tasks for rankings
    print("📊 Ensuring all students have completed tasks for rankings...")
    all_students = existing_students + new_students
    
    # Add additional completed tasks to ensure rankings work
    for student in all_students:
        student_id = str(student.id)
        # Check how many completed tasks this student has
        completed_count = await PatientTask.find(
            PatientTask.assigned_student_id == student_id,
            PatientTask.status == "completed",
            PatientTask.quality_score != None
        ).count()
        
        # If student has less than 3 completed tasks, add more
        if completed_count < 3:
            needed = 3 - completed_count
            for _ in range(needed):
                title = random.choice(TASK_TITLES)
                patient_name = random.choice(INDIAN_PATIENT_NAMES)
                complaint = random.choice(COMPLAINTS)
                age = random.randint(8, 85)
                days_ago = random.randint(1, 90)
                created_date = datetime.now(timezone.utc) - timedelta(days=days_ago)
                
                quality_score = round(random.uniform(3.0, 5.0), 1)
                task = PatientTask(
                    title=title,
                    description=f"Comprehensive assessment and treatment plan for {complaint.lower()}",
                    patient={
                        "name": patient_name,
                        "age": age,
                        "primary_complaint": complaint,
                        "notes": random.choice([None, "Follow-up needed", "Patient requires special attention"])
                    },
                    assigned_student_id=student_id,
                    status="completed",
                    quality_score=quality_score,
                    created_at=created_date,
                    completed_at=created_date + timedelta(days=random.randint(1, 7))
                )
                await task.insert()
                
                # Create task responses (accepted then completed)
                accept_time = created_date + timedelta(hours=random.randint(1, 24))
                await TaskResponse(
                    task_id=str(task.id),
                    student_id=student_id,
                    action="accepted",
                    reject_reason=None,
                    timestamp=accept_time
                ).insert()
                
                complete_time = created_date + timedelta(days=random.randint(1, 7))
                await TaskResponse(
                    task_id=str(task.id),
                    student_id=student_id,
                    action="completed",
                    reject_reason=None,
                    timestamp=complete_time
                ).insert()
                
                # Log analytics
                await AnalyticsLog(
                    user_id=admin_id,
                    task_id=str(task.id),
                    role="admin",
                    action="task_completed",
                    timestamp=complete_time,
                    metadata={"title": title, "score": quality_score}
                ).insert()
    
    print(f"✅ Ensured all students have completed tasks\n")
    
    if not all_students:
        print("⚠️  No students found. Cannot create tasks.")
        return
    
    print("📝 Creating tasks with Indian patient names...")
    print()
    
    task_count = 0
    completed_count = 0
    
    for student in all_students:
        student_id = str(student.id)
        student_name = student.name
        
        # Create 3-8 tasks per student
        num_tasks = random.randint(3, 8)
        
        for i in range(num_tasks):
            # Random status distribution - ensure more completed tasks for rankings
            status_rand = random.random()
            if status_rand < 0.70:  # 70% completed (increased for better rankings)
                status = "completed"
            elif status_rand < 0.85:  # 15% accepted
                status = "accepted"
            elif status_rand < 0.95:  # 10% pending
                status = "pending"
            else:  # 5% rejected
                status = "rejected"
            
            # Random task details with Indian patient names
            title = random.choice(TASK_TITLES)
            patient_name = random.choice(INDIAN_PATIENT_NAMES)
            complaint = random.choice(COMPLAINTS)
            age = random.randint(8, 85)
            
            # Create task with random date in last 90 days
            days_ago = random.randint(1, 90)
            created_date = datetime.now(timezone.utc) - timedelta(days=days_ago)
            
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
                        "Family history of similar conditions",
                        "Previous treatment history available"
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
            
            # Create task response for all non-pending tasks (required for acceptance rate calculation)
            if status != "pending":
                response_time = created_date + timedelta(hours=random.randint(1, 48))
                
                # For completed tasks, also create an "accepted" response first (workflow)
                if status == "completed":
                    # First accept the task
                    accept_time = created_date + timedelta(hours=random.randint(1, 24))
                    await TaskResponse(
                        task_id=str(task.id),
                        student_id=student_id,
                        action="accepted",
                        reject_reason=None,
                        timestamp=accept_time
                    ).insert()
                    # Then complete it
                    await TaskResponse(
                        task_id=str(task.id),
                        student_id=student_id,
                        action="completed",
                        reject_reason=None,
                        timestamp=response_time
                    ).insert()
                else:
                    # For accepted/rejected, create single response
                    await TaskResponse(
                        task_id=str(task.id),
                        student_id=student_id,
                        action=status,
                        reject_reason=random.choice([
                            "Too busy with other assignments",
                            "Not my area of specialization",
                            "Schedule conflict",
                            "Need more time to prepare"
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
                print(f"  ✅ {student_name}: {title} - {patient_name} (Score: {task.quality_score})")
            elif status == "pending":
                print(f"  📋 {student_name}: {title} - {patient_name} (Pending)")
            else:
                print(f"  📝 {student_name}: {title} - {patient_name} (Status: {status})")
    
    print()
    print("=" * 60)
    print("✅ New Data Added Successfully!")
    print("=" * 60)
    print()
    print(f"Summary:")
    print(f"  • New students added: {len(new_students)}")
    print(f"  • Tasks created: {task_count}")
    print(f"  • Tasks with marks: {completed_count}")
    print()
    print("🔑 Login Credentials (same as before):")
    print(f"   Admin: admin@institute.edu / admin123")
    if new_students:
        first_num = existing_count + 1
        last_num = existing_count + len(new_students)
        print(f"   New Students: student{first_num:02d}@student.edu to student{last_num:02d}@student.edu / student123")
    print()
    print("You can now view the data in:")
    print("  • Admin Portal: http://localhost:5173")
    print("  • Student Portal: http://localhost:5174")
    print()
    
    client.close()


if __name__ == "__main__":
    try:
        asyncio.run(add_indian_data())
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

