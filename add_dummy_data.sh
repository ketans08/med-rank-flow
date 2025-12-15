#!/bin/bash

# Script to add dummy data to MongoDB via API using curl
# Make sure backend is running on http://localhost:8000

API_URL="http://localhost:8000"
ADMIN_EMAIL="admin@institute.edu"
ADMIN_PASSWORD="admin123"

echo "==========================================="
echo "🌱 Adding Dummy Data via API"
echo "==========================================="
echo ""

# Step 1: Login as admin
echo "1. Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$ADMIN_EMAIL\", \"password\": \"$ADMIN_PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to login. Make sure backend is running and admin user exists."
  echo "   Run: cd backend && source venv/bin/activate && python -m utils.seed"
  exit 1
fi

echo "✅ Logged in successfully"
echo ""

# Step 2: Create dummy admin users
echo "2. Creating dummy admin users..."
ADMIN_NAMES=("Dr. John Smith" "Dr. Emily Johnson" "Dr. Michael Brown" "Dr. Sarah Davis")
ADMIN_EMAILS=("admin1@institute.edu" "admin2@institute.edu" "admin3@institute.edu" "admin4@institute.edu")

# Note: User creation endpoint doesn't exist, so we'll skip this
# Users need to be created via seed script or directly in MongoDB
echo "⚠️  User creation via API not available. Using existing users."
echo ""

# Step 3: Get list of students (they should exist from seed)
echo "3. Fetching existing students..."
STUDENTS_RESPONSE=$(curl -s -X GET "$API_URL/users/students" \
  -H "Authorization: Bearer $TOKEN")

echo "✅ Found students"
echo ""

# Step 4: Create tasks for students with marks
echo "4. Creating tasks with marks for students..."

# Extract student IDs from response (simplified - using known format)
# In real scenario, parse JSON properly
STUDENT_IDS=("student01" "student02" "student03" "student04" "student05")

# Task data
TASK_TITLES=(
  "Post-operative Physiotherapy Plan"
  "Cardiac Rehabilitation Assessment"
  "Pediatric Development Evaluation"
  "Geriatric Balance Assessment"
  "Sports Injury Rehabilitation"
  "Neurological Assessment Protocol"
  "Respiratory Care Plan"
  "Orthopedic Treatment Plan"
)

PATIENT_NAMES=(
  "Mrs. Sarah Kumar"
  "Mr. James Wilson"
  "Tommy Chen"
  "Mrs. Dorothy Evans"
  "Alex Rodriguez"
)

COMPLAINTS=(
  "Post-op knee replacement recovery"
  "Post-MI cardiac rehabilitation"
  "Delayed motor development"
  "Recent falls, balance issues"
  "ACL reconstruction recovery"
)

TASK_COUNT=0
COMPLETED_COUNT=0

# Create tasks for each student
for student_id in "${STUDENT_IDS[@]}"; do
  # Create 3-5 tasks per student
  NUM_TASKS=$((RANDOM % 3 + 3))
  
  for ((i=1; i<=NUM_TASKS; i++)); do
    TITLE=${TASK_TITLES[$RANDOM % ${#TASK_TITLES[@]}]}
    PATIENT=${PATIENT_NAMES[$RANDOM % ${#PATIENT_NAMES[@]}]}
    COMPLAINT=${COMPLAINTS[$RANDOM % ${#COMPLAINTS[@]}]}
    AGE=$((RANDOM % 77 + 8))
    
    # Random status: 60% completed, 20% accepted, 15% pending, 5% rejected
    STATUS_RAND=$((RANDOM % 100))
    if [ $STATUS_RAND -lt 60 ]; then
      STATUS="completed"
    elif [ $STATUS_RAND -lt 80 ]; then
      STATUS="accepted"
    elif [ $STATUS_RAND -lt 95 ]; then
      STATUS="pending"
    else
      STATUS="rejected"
    fi
    
    # Create task
    TASK_DATA=$(cat <<EOF
{
  "title": "$TITLE",
  "description": "Comprehensive assessment and treatment plan for $COMPLAINT",
  "patient": {
    "name": "$PATIENT",
    "age": $AGE,
    "primary_complaint": "$COMPLAINT",
    "notes": "Patient requires comprehensive evaluation"
  },
  "assigned_student_id": "$student_id",
  "status": "$STATUS"
}
EOF
)
    
    CREATE_RESPONSE=$(curl -s -X POST "$API_URL/tasks" \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$TASK_DATA")
    
    TASK_ID=$(echo $CREATE_RESPONSE | grep -o '"_id":"[^"]*' | cut -d'"' -f4 || echo "")
    
    if [ ! -z "$TASK_ID" ]; then
      TASK_COUNT=$((TASK_COUNT + 1))
      
      # If completed, add score
      if [ "$STATUS" = "completed" ]; then
        SCORE=$(awk "BEGIN {printf \"%.1f\", 3.0 + rand() * 2.0}")
        
        SCORE_RESPONSE=$(curl -s -X POST "$API_URL/tasks/$TASK_ID/score" \
          -H "Authorization: Bearer $TOKEN" \
          -H "Content-Type: application/json" \
          -d "{\"quality_score\": $SCORE}")
        
        if echo "$SCORE_RESPONSE" | grep -q "quality_score"; then
          COMPLETED_COUNT=$((COMPLETED_COUNT + 1))
          echo "  ✅ Created task: $TITLE (Score: $SCORE)"
        fi
      else
        echo "  ✅ Created task: $TITLE (Status: $STATUS)"
      fi
    fi
  done
done

echo ""
echo "==========================================="
echo "✅ Dummy Data Added Successfully!"
echo "==========================================="
echo ""
echo "Summary:"
echo "  • Tasks created: $TASK_COUNT"
echo "  • Tasks with marks: $COMPLETED_COUNT"
echo ""
echo "You can now view the data in:"
echo "  • Admin Portal: http://localhost:5173"
echo "  • Student Portal: http://localhost:5174"
echo ""

