# 📖 Complete User Guide - Med-Rank-Flow

## 🚀 Quick Access

### URLs
- **Admin Portal**: http://localhost:5173
- **Student Portal**: http://localhost:5174
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

---

## 🔑 Login Credentials

### Admin Account
- **Email**: `admin@institute.edu`
- **Password**: `admin123`
- **Access**: Full admin dashboard, task management, analytics, rankings

### Student Accounts (20 students available)
- **Email Format**: `student01@student.edu` to `student20@student.edu`
- **Password**: `student123` (same for all)
- **Examples**:
  - `student01@student.edu` / `student123`
  - `student02@student.edu` / `student123`
  - `student05@student.edu` / `student123`
  - `student10@student.edu` / `student123`
  - `student20@student.edu` / `student123`

---

## 👨‍💼 Admin Portal Guide

### Access
1. Open: http://localhost:5173
2. Login with: `admin@institute.edu` / `admin123`

### Features

#### Dashboard
- **View All Tasks**: See all tasks assigned to students
- **Task Status**: View pending, accepted, completed, rejected tasks
- **Quick Stats**: Overview of task distribution and completion rates

#### Create Tasks
1. Click "Create Task" or navigate to task creation
2. Fill in:
   - **Title**: Task name (e.g., "Post-operative Physiotherapy Plan")
   - **Description**: Detailed task description
   - **Patient Info**:
     - Name
     - Age
     - Primary Complaint
     - Notes (optional)
   - **Assign to**: Select student from dropdown
3. Click "Create" - Task is created with "pending" status

#### Score Tasks
1. Find completed tasks in the dashboard
2. Click on a completed task
3. Assign quality score (0.0 - 5.0)
4. Save score - Updates student rankings

#### Analytics Dashboard
- **Student Rankings**: See all students ranked by:
  - Tasks completed
  - Average score
  - Acceptance rate
- **Completion Trends**: Weekly/monthly completion charts
- **Task Distribution**: Breakdown by type and status
- **Top Performers**: Best performing students

#### View Rankings
- Real-time student rankings
- Sort by score, completion rate, or total tasks
- Click on student to see detailed analytics

---

## 👨‍🎓 Student Portal Guide

### Access
1. Open: http://localhost:5174
2. Login with any student account (e.g., `student01@student.edu` / `student123`)

### Features

#### Dashboard
- **My Tasks**: View all tasks assigned to you
- **Task Status**: See pending, accepted, completed, rejected tasks
- **Quick Overview**: Your completion stats

#### Accept/Reject Tasks
1. Find tasks with "Pending" status
2. **To Accept**:
   - Click "Accept" button
   - Task status changes to "Accepted"
   - You can now complete it
3. **To Reject**:
   - Click "Reject" button
   - Enter rejection reason (required)
   - Task status changes to "Rejected"
   - Task cannot be completed after rejection

#### Complete Tasks
1. Find tasks with "Accepted" status
2. Click "Complete" button
3. Task status changes to "Completed"
4. Wait for admin to score your work
5. Once scored, you'll see your quality score (0.0 - 5.0)

#### Personal Analytics
- **My Performance**: Your completion rate and average score
- **Task History**: Timeline of all your tasks
- **Score Trends**: See how your scores improve over time
- **Completion Stats**: Number of tasks by status

---

## 📊 Current Data Status

### What's Already in the Database

✅ **1 Admin User**
- `admin@institute.edu`

✅ **20 Students**
- `student01@student.edu` through `student20@student.edu`

✅ **110 Tasks Created**
- Distributed across all students
- Various statuses: pending, accepted, completed, rejected

✅ **67 Tasks with Marks**
- Scores range from 3.0 to 5.0
- Ready for analytics and rankings

---

## 🎯 How to Use - Step by Step

### For Admins

1. **Login** → http://localhost:5173
   - Use: `admin@institute.edu` / `admin123`

2. **Create a Task**
   - Click "Create Task"
   - Fill in patient details
   - Assign to a student
   - Save

3. **Score Completed Tasks**
   - Find completed tasks
   - Assign quality score (0.0 - 5.0)
   - This updates rankings

4. **View Analytics**
   - Check student rankings
   - View completion trends
   - Analyze performance data

### For Students

1. **Login** → http://localhost:5174
   - Use: `student01@student.edu` / `student123` (or any student02-20)

2. **View Assigned Tasks**
   - See all tasks assigned to you
   - Check status: pending, accepted, completed

3. **Accept or Reject**
   - Accept tasks you want to work on
   - Reject with a reason if you can't take it

4. **Complete Tasks**
   - After accepting, complete the task
   - Wait for admin to score
   - View your score once assigned

5. **Check Your Analytics**
   - See your performance metrics
   - Track your progress
   - View your ranking (if admin shares)

---

## 🔧 Troubleshooting

### Can't Login?
- ✅ Check backend is running: http://localhost:8000/health
- ✅ Verify credentials are correct
- ✅ Check browser console for errors

### Tasks Not Showing?
- ✅ Make sure you're logged in with correct account
- ✅ Check task status filters
- ✅ Verify backend is connected to MongoDB

### Scores Not Updating?
- ✅ Only admins can score tasks
- ✅ Task must be "completed" status
- ✅ Check admin portal for scoring options

### Backend Not Running?
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000
```

### Frontend Not Loading?
```bash
# Admin App
cd med-rank-flow-admin
npm run dev

# Student App
cd med-rank-flow-student
npm run dev
```

---

## 📱 Quick Reference

### Ports
- **8000**: Backend API
- **5173**: Admin Portal
- **5174**: Student Portal

### Task Statuses
- **Pending**: Newly created, waiting for student action
- **Accepted**: Student accepted, can be completed
- **Completed**: Student finished, waiting for admin score
- **Rejected**: Student declined with reason

### Score Range
- **0.0 - 5.0**: Quality score for completed tasks
- Only admins can assign scores
- Scores affect student rankings

---

## 🎉 You're All Set!

Everything is running and ready to use. Start with the admin portal to create tasks, or login as a student to see assigned tasks.

**Happy managing!** 🚀

