# 📝 Add Dummy Data to MongoDB via API

This guide shows you how to add dummy students, tasks, and marks using curl commands or Python scripts.

## Prerequisites

- Backend API running on `http://localhost:8000`
- Admin user exists (run `python -m utils.seed` if not)
- Students exist (created by seed script)

## Quick Start

### Option 1: Python Script (Recommended)

```bash
# Install requests if needed
pip install requests

# Run the script
python3 add_dummy_data.py
```

This will:
- ✅ Login as admin
- ✅ Fetch all students
- ✅ Create 3-8 tasks per student
- ✅ Add random marks (3.0-5.0) for completed tasks

### Option 2: Bash Script (uses curl)

```bash
chmod +x add_dummy_data.sh
./add_dummy_data.sh
```

## Manual curl Commands

### Step 1: Login as Admin

```bash
TOKEN=$(curl -s -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@institute.edu", "password": "admin123"}' \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"
```

### Step 2: Get Students

```bash
curl -X GET "http://localhost:8000/users/students" \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -m json.tool
```

### Step 3: Create a Task

```bash
curl -X POST "http://localhost:8000/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Post-operative Physiotherapy Plan",
    "description": "Comprehensive assessment and treatment plan",
    "patient": {
      "name": "Mrs. Sarah Kumar",
      "age": 45,
      "primary_complaint": "Post-op knee replacement recovery",
      "notes": "Patient requires special attention"
    },
    "assigned_student_id": "STUDENT_ID_HERE",
    "status": "completed"
  }'
```

Replace `STUDENT_ID_HERE` with actual student ID from Step 2.

### Step 4: Score a Task

```bash
curl -X POST "http://localhost:8000/tasks/TASK_ID_HERE/score" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quality_score": 4.5
  }'
```

Replace `TASK_ID_HERE` with actual task ID from Step 3.

## Example: Complete Workflow

```bash
# 1. Login
TOKEN=$(curl -s -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@institute.edu", "password": "admin123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['access_token'])")

# 2. Get first student ID
STUDENT_ID=$(curl -s -X GET "http://localhost:8000/users/students" \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -c "import sys, json; print(json.load(sys.stdin)[0]['id'])")

# 3. Create task
TASK_RESPONSE=$(curl -s -X POST "http://localhost:8000/tasks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Cardiac Rehabilitation Assessment\",
    \"description\": \"Comprehensive assessment for post-MI patient\",
    \"patient\": {
      \"name\": \"Mr. James Wilson\",
      \"age\": 62,
      \"primary_complaint\": \"Post-MI cardiac rehabilitation\"
    },
    \"assigned_student_id\": \"$STUDENT_ID\",
    \"status\": \"completed\"
  }")

TASK_ID=$(echo $TASK_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['id'])")

# 4. Score task
curl -X POST "http://localhost:8000/tasks/$TASK_ID/score" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"quality_score": 4.2}'

echo "✅ Task created and scored!"
```

## What Gets Created

The scripts create:
- **Tasks**: 3-8 tasks per student
- **Status Distribution**:
  - 55% completed (with marks)
  - 25% accepted
  - 15% pending
  - 5% rejected
- **Marks**: Random scores between 3.0-5.0 for completed tasks
- **Patients**: Random patient data (names, ages, complaints)

## View Results

After running the script:
- **Admin Portal**: http://localhost:5173
  - View all tasks and rankings
- **Student Portal**: http://localhost:5174
  - Students can see their assigned tasks

## Troubleshooting

**Error: Login failed**
- Make sure backend is running
- Verify admin user exists: `python -m utils.seed`

**Error: No students found**
- Run seed script: `python -m utils.seed`
- This creates 20-25 students

**Error: Connection refused**
- Check backend is running on port 8000
- Verify: `curl http://localhost:8000/health`

