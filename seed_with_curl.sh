#!/bin/bash

# Seed MongoDB using curl API calls
# Make sure backend is running on http://localhost:8000

API_URL="http://localhost:8000"
BASE_URL="${API_URL}"

echo "==========================================="
echo "🌱 Seeding MongoDB via API (curl)"
echo "==========================================="
echo ""

# Check if backend is running
if ! curl -s "${BASE_URL}/health" > /dev/null 2>&1; then
    echo "❌ Backend is not running!"
    echo "   Start backend first: cd backend && source venv/bin/activate && uvicorn main:app --reload"
    exit 1
fi

echo "✅ Backend is running"
echo ""

# Step 1: Login as admin (if admin exists, otherwise we need to create it via seed script first)
echo "Step 1: Logging in as admin..."
ADMIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@institute.edu",
    "password": "admin123"
  }')

# Check if login was successful
if echo "$ADMIN_RESPONSE" | grep -q "access_token"; then
    TOKEN=$(echo "$ADMIN_RESPONSE" | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)
    echo "✅ Admin login successful"
    echo "   Token: ${TOKEN:0:20}..."
else
    echo "⚠️  Admin login failed - admin may not exist"
    echo "   Run: cd backend && source venv/bin/activate && python -m utils.seed"
    echo "   Then run this script again"
    exit 1
fi

echo ""

# Step 2: Get list of students (to assign tasks)
echo "Step 2: Getting students list..."
STUDENTS_RESPONSE=$(curl -s -X GET "${BASE_URL}/users/students" \
  -H "Authorization: Bearer ${TOKEN}")

echo "✅ Students retrieved"
STUDENT_COUNT=$(echo "$STUDENTS_RESPONSE" | grep -o '"id"' | wc -l)
echo "   Found ${STUDENT_COUNT} students"

if [ "$STUDENT_COUNT" -eq 0 ]; then
    echo "⚠️  No students found. Run seed script first:"
    echo "   cd backend && source venv/bin/activate && python -m utils.seed"
    exit 1
fi

echo ""

# Step 3: Create sample tasks
echo "Step 3: Creating sample tasks..."

# Get first student ID
FIRST_STUDENT_ID=$(echo "$STUDENTS_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$FIRST_STUDENT_ID" ]; then
    echo "❌ Could not get student ID"
    exit 1
fi

# Create 5 sample tasks
TASK_COUNT=0
for i in {1..5}; do
    TASK_RESPONSE=$(curl -s -X POST "${BASE_URL}/tasks" \
      -H "Authorization: Bearer ${TOKEN}" \
      -H "Content-Type: application/json" \
      -d "{
        \"title\": \"Sample Task ${i}\",
        \"description\": \"This is sample task number ${i} for testing purposes\",
        \"patient\": {
          \"name\": \"Patient ${i}\",
          \"age\": $((20 + i * 5)),
          \"primary_complaint\": \"Sample complaint ${i}\",
          \"notes\": \"Sample notes for task ${i}\"
        },
        \"assigned_student_id\": \"${FIRST_STUDENT_ID}\"
      }")
    
    if echo "$TASK_RESPONSE" | grep -q '"id"'; then
        TASK_COUNT=$((TASK_COUNT + 1))
        echo "  ✅ Created task ${i}"
    else
        echo "  ⚠️  Failed to create task ${i}"
        echo "     Response: $TASK_RESPONSE"
    fi
done

echo ""
echo "✅ Created ${TASK_COUNT} tasks"
echo ""

# Summary
echo "==========================================="
echo "🎉 Seeding Complete!"
echo "==========================================="
echo ""
echo "Summary:"
echo "  • Students: ${STUDENT_COUNT}"
echo "  • Tasks created: ${TASK_COUNT}"
echo ""
echo "You can now:"
echo "  • Login to admin portal: http://localhost:5173"
echo "  • Login to student portal: http://localhost:5174"
echo ""

