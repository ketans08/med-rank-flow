# API Documentation

Complete API reference for Med-Rank-Flow backend.

**Base URL:** `http://localhost:8000`

**API Documentation:** http://localhost:8000/docs (Swagger UI)

## Authentication

All endpoints (except login) require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <session_token>
```

### POST /auth/login

Login with email and password.

**Request:**
```json
{
  "email": "admin@institute.edu",
  "password": "admin123"
}
```

**Response:**
```json
{
  "access_token": "session_token_here",
  "token_type": "bearer",
  "user": {
    "id": "user_id",
    "name": "Dr. Rajesh Kumar",
    "email": "admin@institute.edu",
    "role": "admin"
  }
}
```

### POST /auth/logout

Logout and delete current session.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## Tasks

### POST /tasks (Admin Only)

Create a new patient-linked task.

**Request:**
```json
{
  "title": "Post-operative Physiotherapy Plan",
  "description": "Comprehensive assessment and treatment plan",
  "patient": {
    "name": "Mr. Rajesh Kumar",
    "age": 45,
    "primary_complaint": "Post-op knee replacement recovery",
    "notes": "Patient requires special attention"
  },
  "assigned_student_id": "student_id_here",
  "status": "pending"
}
```

**Response:**
```json
{
  "id": "task_id",
  "title": "Post-operative Physiotherapy Plan",
  "description": "...",
  "patient": {...},
  "assigned_student_id": "student_id",
  "assigned_student_name": "Student Name",
  "status": "pending",
  "quality_score": null,
  "created_at": "2024-01-01T00:00:00",
  "completed_at": null
}
```

### GET /tasks/admin (Admin Only)

Get all tasks in the system.

**Response:**
```json
[
  {
    "id": "task_id",
    "title": "Task Title",
    "description": "...",
    "patient": {...},
    "assigned_student_id": "student_id",
    "assigned_student_name": "Student Name",
    "status": "completed",
    "quality_score": 4.5,
    "created_at": "2024-01-01T00:00:00",
    "completed_at": "2024-01-05T00:00:00"
  }
]
```

### GET /tasks/student (Student Only)

Get tasks assigned to the current student.

**Response:**
```json
[
  {
    "id": "task_id",
    "title": "Task Title",
    "description": "...",
    "patient": {...},
    "assigned_student_id": "student_id",
    "status": "pending",
    "quality_score": null,
    "created_at": "2024-01-01T00:00:00",
    "completed_at": null
  }
]
```

### POST /tasks/{task_id}/accept (Student Only)

Accept a pending task.

**Response:**
```json
{
  "id": "task_id",
  "status": "accepted",
  ...
}
```

### POST /tasks/{task_id}/reject (Student Only)

Reject a pending task with reason.

**Request:**
```json
{
  "reject_reason": "Too busy with other assignments"
}
```

**Response:**
```json
{
  "id": "task_id",
  "status": "rejected",
  ...
}
```

### POST /tasks/{task_id}/complete (Student Only)

Mark an accepted task as completed.

**Response:**
```json
{
  "id": "task_id",
  "status": "completed",
  "completed_at": "2024-01-05T00:00:00",
  ...
}
```

### POST /tasks/{task_id}/score (Admin Only)

Assign quality score to a completed task.

**Request:**
```json
{
  "quality_score": 4.5
}
```

**Response:**
```json
{
  "id": "task_id",
  "quality_score": 4.5,
  ...
}
```

## Analytics

### GET /analytics/rankings (Admin Only)

Get student rankings sorted by average score.

**Response:**
```json
[
  {
    "student_id": "student_id",
    "student_name": "Rahul Kumar",
    "rank": 1,
    "tasks_completed": 10,
    "average_score": 4.5,
    "acceptance_rate": 85.5
  }
]
```

### GET /analytics/admin (Admin Only)

Get comprehensive admin analytics.

**Response:**
```json
{
  "total_students": 16,
  "average_score": 4.2,
  "tasks_this_month": 50,
  "completion_rate": 75,
  "student_performance": [...],
  "monthly_trends": [...],
  "task_distribution": [...],
  "top_performers": [...]
}
```

### GET /analytics/student (Student Only)

Get analytics for the current student.

**Response:**
```json
{
  "student_info": {
    "name": "Student Name",
    "id": "student_id",
    "avgScore": 4.3,
    "rank": 5,
    "totalStudents": 16,
    "percentile": 75
  },
  "performance_history": [...],
  "weekly_progress": [...],
  "task_type_performance": [...],
  "upcoming_tasks": [...]
}
```

### GET /analytics/student/{student_id} (Admin Only)

Get analytics for a specific student.

**Response:** Same as `/analytics/student`

## Users

### GET /users/students (Admin Only)

Get all student users.

**Response:**
```json
[
  {
    "id": "student_id",
    "name": "Student Name",
    "email": "student01@student.edu",
    "role": "student"
  }
]
```

## Task Statuses

- `pending` - Task assigned but not yet accepted/rejected
- `accepted` - Student accepted the task
- `rejected` - Student rejected the task (with reason)
- `completed` - Task completed by student (awaiting score)

## Quality Scores

Quality scores range from **0.0 to 5.0**:
- **5.0** - Excellent
- **4.0-4.9** - Very Good
- **3.0-3.9** - Good
- **2.0-2.9** - Fair
- **1.0-1.9** - Poor
- **0.0-0.9** - Very Poor

## Error Responses

All errors follow this format:

```json
{
  "detail": "Error message here"
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

Currently no rate limiting is implemented. For production, consider adding rate limiting middleware.

## CORS

CORS is configured to allow requests from:
- `http://localhost:5173` (Admin app)
- `http://localhost:5174` (Student app)

For production, update CORS origins in `backend/main.py`.

