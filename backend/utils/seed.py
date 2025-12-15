"""
Seed script to create initial admin, random students, and sample tasks with marks
Run with: python -m utils.seed
"""
import asyncio
import random
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from models.user import User
from models.patient_task import PatientTask
from models.task_response import TaskResponse
from models.analytics_log import AnalyticsLog
from core.config import settings
from core.security import get_password_hash

# Random student names
STUDENT_NAMES = [
    "John Smith", "Emma Wilson", "Mike Johnson", "Sarah Davis", "David Brown",
    "Lisa Anderson", "James Taylor", "Maria Garcia", "Robert Martinez", "Jennifer Lee",
    "William White", "Patricia Harris", "Michael Clark", "Linda Lewis", "Richard Walker",
    "Barbara Hall", "Joseph Allen", "Elizabeth Young", "Thomas King", "Susan Wright",
    "Charles Lopez", "Jessica Hill", "Christopher Scott", "Amanda Green", "Daniel Adams",
    "Melissa Baker", "Matthew Nelson", "Deborah Carter", "Anthony Mitchell", "Stephanie Perez"
]

# Task titles
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

# Patient names
PATIENT_NAMES = [
    "Mrs. Sarah Kumar", "Mr. James Wilson", "Tommy Chen", "Mrs. Dorothy Evans",
    "Alex Rodriguez", "Ms. Priya Patel", "Mr. Robert Thompson", "Mrs. Linda Martinez",
    "David Kim", "Ms. Jennifer Brown", "Mr. Michael Davis", "Mrs. Patricia Johnson"
]

# Complaints
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


async def seed_data():
    """Create initial users, random students, and sample tasks with marks"""
    client = AsyncIOMotorClient(settings.mongodb_url)
    await init_beanie(
        database=client[settings.mongodb_db_name],
        document_models=[User, PatientTask, TaskResponse, AnalyticsLog]
    )
    
    # Check if already seeded
    existing_admin = await User.find_one(User.email == "admin@institute.edu")
    if existing_admin:
        print("⚠️  Data already seeded. Delete existing data to re-seed.")
        return
    
    print("🌱 Starting seed process...")
    
    # Create admin user
    admin = User(
        name="Dr. Sarah Chen",
        email="admin@institute.edu",
        password_hash=get_password_hash("admin123"),
        role="admin"
    )
    await admin.insert()
    print(f"✅ Created admin: {admin.email} / admin123")
    
    # Create random students (20-25 students)
    num_students = random.randint(20, 25)
    selected_names = random.sample(STUDENT_NAMES, num_students)
    student_users = []
    
    for i, name in enumerate(selected_names, 1):
        email = f"student{i:02d}@student.edu"
        student = User(
            name=name,
            email=email,
            password_hash=get_password_hash("student123"),
            role="student"
        )
        await student.insert()
        student_users.append(student)
        print(f"✅ Created student {i}/{num_students}: {email} / student123")
    
    print(f"\n📚 Created {len(student_users)} students")
    
    # Create sample tasks with random assignments and marks
    print("\n📝 Creating sample tasks with random marks...")
    admin_id = str(admin.id)
    tasks_created = 0
    
    # Create tasks for each student (3-8 tasks per student)
    for student in student_users:
        num_tasks = random.randint(3, 8)
        student_id = str(student.id)
        
        for _ in range(num_tasks):
            # Random task details
            task_title = random.choice(TASK_TITLES)
            patient_name = random.choice(PATIENT_NAMES)
            patient_age = random.randint(8, 85)
            complaint = random.choice(COMPLAINTS)
            
            # Random status distribution (more completed tasks for better analytics)
            status_weights = [0.15, 0.25, 0.55, 0.05]  # pending, accepted, completed, rejected
            status = random.choices(
                ["pending", "accepted", "completed", "rejected"],
                weights=status_weights
            )[0]
            
            # Create task with random date in last 90 days
            days_ago = random.randint(1, 90)
            created_date = datetime.utcnow() - timedelta(days=days_ago)
            
            task = PatientTask(
                title=task_title,
                description=f"Comprehensive assessment and treatment plan for {complaint.lower()}",
                patient={
                    "name": patient_name,
                    "age": patient_age,
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
            
            # Add quality score if completed (random between 3.0-5.0)
            if status == "completed":
                quality_score = round(random.uniform(3.0, 5.0), 1)
                task.quality_score = quality_score
                # Completed 1-7 days after creation
                task.completed_at = created_date + timedelta(days=random.randint(1, 7))
            
            await task.insert()
            tasks_created += 1
            
            # Create task response
            if status != "pending":
                action = status
                response_time = created_date + timedelta(hours=random.randint(1, 48))
                await TaskResponse(
                    task_id=str(task.id),
                    student_id=student_id,
                    action=action,
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
                metadata={"title": task_title, "score": task.quality_score} if status == "completed" else {}
            ).insert()
    
    print(f"✅ Created {tasks_created} tasks with random marks")
    
    # Summary
    print("\n" + "="*60)
    print("🎉 Seeding Complete!")
    print("="*60)
    print(f"\n📊 Summary:")
    print(f"   • Admin users: 1")
    print(f"   • Student users: {len(student_users)}")
    print(f"   • Tasks created: {tasks_created}")
    print(f"\n🔑 Login Credentials:")
    print(f"   Admin: admin@institute.edu / admin123")
    print(f"   Students: student01@student.edu to student{num_students:02d}@student.edu / student123")
    print(f"\n💡 All students have random tasks with random marks (3.0-5.0)")


if __name__ == "__main__":
    asyncio.run(seed_data())

