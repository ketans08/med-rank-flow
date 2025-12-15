# 📡 MongoDB Seeding via curl

Use these curl commands to add data to MongoDB through the API.

## Prerequisites

1. Backend must be running: `http://localhost:8000`
2. Admin user must exist (run `python -m utils.seed` first)

## Quick Seed Script

```bash
# Run the automated seed script
./seed_with_curl.sh
```

## Manual curl Commands

### 1. Login as Admin

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@institute.edu",
    "password": "admin123"
  }'
```

**Response:**
```json
{
  "access_token": "your-token-here",
  "token_type": "bearer",
  "user": {
    "id": "...",
    "name": "Dr. Sarah Chen",
    "email": "admin@institute.edu",
    "role": "admin"
  }
}
```

**Save the token:**
```bash
TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@institute.edu","password":"admin123"}' \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"
```

---

### 2. Get All Students

```bash
curl -X GET http://localhost:8000/users/students \
  -H "Authorization: Bearer $TOKEN"
```

**Response:** List of all students with their IDs

---

### 3. Create a Task

```bash
curl -X POST http://localhost:8000/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Post-operative Physiotherapy Plan",
    "description": "Create comprehensive physiotherapy plan for post-op recovery",
    "patient": {
      "name": "Mr. John Doe",
      "age": 45,
      "primary_complaint": "Post-op knee replacement recovery",
      "notes": "Patient requires special attention"
    },
    "assigned_student_id": "STUDENT_ID_HERE"
  }'
```

**Replace `STUDENT_ID_HERE`** with actual student ID from step 2.

---

### 4. Create Multiple Tasks (Example)

```bash
# Get first student ID
STUDENT_ID=$(curl -s -X GET http://localhost:8000/users/students \
  -H "Authorization: Bearer $TOKEN" \
  | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

# Create task 1
curl -X POST http://localhost:8000/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Cardiac Rehabilitation Assessment\",
    \"description\": \"Assess patient for cardiac rehabilitation program\",
    \"patient\": {
      \"name\": \"Mrs. Jane Smith\",
      \"age\": 62,
      \"primary_complaint\": \"Post-MI cardiac rehabilitation\",
      \"notes\": \"Recent heart attack, needs careful monitoring\"
    },
    \"assigned_student_id\": \"$STUDENT_ID\"
  }"

# Create task 2
curl -X POST http://localhost:8000/tasks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Pediatric Development Evaluation\",
    \"description\": \"Evaluate child development milestones\",
    \"patient\": {
      \"name\": \"Tommy Chen\",
      \"age\": 8,
      \"primary_complaint\": \"Delayed motor development\",
      \"notes\": \"Parent concerns about walking delay\"
    },
    \"assigned_student_id\": \"$STUDENT_ID\"
  }"
```

---

### 5. Get All Tasks (Admin)

```bash
curl -X GET http://localhost:8000/tasks/admin \
  -H "Authorization: Bearer $TOKEN"
```

---

### 6. Score a Task (Admin)

```bash
# Get a completed task ID first
TASK_ID="TASK_ID_HERE"

curl -X POST http://localhost:8000/tasks/$TASK_ID/score \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quality_score": 4.5
  }'
```

---

## Complete Example Script

```bash
#!/bin/bash

API_URL="http://localhost:8000"

# Login
TOKEN=$(curl -s -X POST "${API_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@institute.edu","password":"admin123"}' \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

echo "Token: ${TOKEN:0:20}..."

# Get student ID
STUDENT_ID=$(curl -s -X GET "${API_URL}/users/students" \
  -H "Authorization: Bearer ${TOKEN}" \
  | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

echo "Student ID: $STUDENT_ID"

# Create task
curl -X POST "${API_URL}/tasks" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Sample Task\",
    \"description\": \"Test task\",
    \"patient\": {
      \"name\": \"Test Patient\",
      \"age\": 30,
      \"primary_complaint\": \"Test complaint\"
    },
    \"assigned_student_id\": \"${STUDENT_ID}\"
  }"
```

---

## Student Actions (via Student Login)

### Login as Student

```bash
STUDENT_TOKEN=$(curl -s -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student01@student.edu","password":"student123"}' \
  | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
```

### Get Student's Tasks

```bash
curl -X GET http://localhost:8000/tasks/student \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

### Accept a Task

```bash
TASK_ID="TASK_ID_HERE"

curl -X POST http://localhost:8000/tasks/$TASK_ID/accept \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

### Reject a Task

```bash
curl -X POST http://localhost:8000/tasks/$TASK_ID/reject \
  -H "Authorization: Bearer $STUDENT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reject_reason": "Too busy with other assignments"
  }'
```

### Complete a Task

```bash
curl -X POST http://localhost:8000/tasks/$TASK_ID/complete \
  -H "Authorization: Bearer $STUDENT_TOKEN"
```

---

## Notes

- All admin endpoints require admin token
- All student endpoints require student token
- Tasks can only be created by admin
- Tasks can only be scored by admin
- Students can only see their own tasks

