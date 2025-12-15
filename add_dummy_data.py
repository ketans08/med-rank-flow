#!/usr/bin/env python3
"""
Script to add dummy data to MongoDB via API using requests
Run: python3 add_dummy_data.py
"""

import requests
import random
import json
from typing import List, Dict

API_URL = "http://localhost:8000"
ADMIN_EMAIL = "admin@institute.edu"
ADMIN_PASSWORD = "admin123"

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
    "David Kim", "Ms. Jennifer Brown"
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

STUDENT_NAMES = [
    "John Smith", "Emma Wilson", "Mike Johnson", "Sarah Davis", "David Brown",
    "Lisa Anderson", "James Taylor", "Maria Garcia", "Robert Martinez", "Jennifer Lee",
    "William White", "Patricia Harris", "Michael Clark", "Linda Lewis", "Richard Walker"
]


def login() -> str:
    """Login and get access token"""
    print("🔐 Logging in as admin...")
    response = requests.post(
        f"{API_URL}/auth/login",
        json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
    )
    
    if response.status_code != 200:
        print(f"❌ Login failed: {response.text}")
        print("\n💡 Make sure:")
        print("   1. Backend is running on http://localhost:8000")
        print("   2. Admin user exists (run: python -m utils.seed)")
        return None
    
    token = response.json()["access_token"]
    print("✅ Logged in successfully\n")
    return token


def get_students(token: str) -> List[Dict]:
    """Get list of students"""
    print("📚 Fetching students...")
    response = requests.get(
        f"{API_URL}/users/students",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    if response.status_code != 200:
        print(f"⚠️  Could not fetch students: {response.text}")
        return []
    
    students = response.json()
    print(f"✅ Found {len(students)} students\n")
    return students


def create_task(token: str, student_id: str, status: str = "pending") -> Dict:
    """Create a task"""
    title = random.choice(TASK_TITLES)
    patient_name = random.choice(PATIENT_NAMES)
    complaint = random.choice(COMPLAINTS)
    age = random.randint(8, 85)
    
    task_data = {
        "title": title,
        "description": f"Comprehensive assessment and treatment plan for {complaint.lower()}",
        "patient": {
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
        "assigned_student_id": student_id,
        "status": status
    }
    
    response = requests.post(
        f"{API_URL}/tasks",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        },
        json=task_data
    )
    
    if response.status_code == 200 or response.status_code == 201:
        return response.json()
    return None


def score_task(token: str, task_id: str, score: float) -> bool:
    """Score a completed task"""
    response = requests.post(
        f"{API_URL}/tasks/{task_id}/score",
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        },
        json={"quality_score": score}
    )
    return response.status_code == 200


def accept_task(token: str, task_id: str) -> bool:
    """Accept a pending task"""
    response = requests.post(
        f"{API_URL}/tasks/{task_id}/accept",
        headers={"Authorization": f"Bearer {token}"}
    )
    return response.status_code == 200


def complete_task(token: str, task_id: str) -> bool:
    """Complete an accepted task"""
    response = requests.post(
        f"{API_URL}/tasks/{task_id}/complete",
        headers={"Authorization": f"Bearer {token}"}
    )
    return response.status_code == 200


def main():
    print("=" * 60)
    print("🌱 Adding Dummy Data via API")
    print("=" * 60)
    print()
    
    # Login
    token = login()
    if not token:
        return
    
    # Get students
    students = get_students(token)
    if not students:
        print("⚠️  No students found. Run seed script first:")
        print("   cd backend && source venv/bin/activate && python -m utils.seed")
        return
    
    # Create tasks
    print("📝 Creating tasks with marks...")
    print()
    
    task_count = 0
    completed_count = 0
    
    for student in students:
        student_id = student["id"]
        student_name = student.get("name", "Unknown")
        
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
            
            # Create task
            task = create_task(token, student_id, status)
            
            if task:
                # Handle different ID formats
                task_id = task.get("id") or task.get("_id") or (task.get("id") if isinstance(task.get("id"), str) else None)
                if not task_id and "_id" in task:
                    task_id = str(task["_id"])
                task_title = task.get("title", "Unknown")
                task_count += 1
                
                if status == "completed":
                    # Score the task
                    score = round(random.uniform(3.0, 5.0), 1)
                    if score_task(token, task_id, score):
                        completed_count += 1
                        print(f"  ✅ {student_name}: {task_title} (Score: {score})")
                    else:
                        print(f"  ⚠️  {student_name}: {task_title} (Created but scoring failed)")
                elif status == "accepted":
                    # First accept, then complete and score
                    if accept_task(token, task_id):
                        if complete_task(token, task_id):
                            score = round(random.uniform(3.0, 5.0), 1)
                            if score_task(token, task_id, score):
                                completed_count += 1
                                print(f"  ✅ {student_name}: {task_title} (Score: {score})")
                elif status == "pending":
                    print(f"  📋 {student_name}: {task_title} (Pending)")
                else:
                    print(f"  ❌ {student_name}: {task_title} (Rejected)")
    
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


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted by user")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()

