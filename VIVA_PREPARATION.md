# Viva Preparation - Med-Rank-Flow

## 📋 Project Overview

### What is Med-Rank-Flow?
- **Medical Institute ERP System** for managing patient-linked academic tasks
- Tracks student performance and generates analytics-based rankings
- Built for **AIIMS Raipur** to manage medical student assignments and evaluations

### Problem Statement
- Medical institutes need a system to assign patient-linked tasks to students
- Track student performance and completion rates
- Generate rankings based on quality scores and performance metrics
- Provide analytics dashboards for both admins and students

### Solution
- Three-tier architecture: Backend API + Admin Portal + Student Portal
- Real-time task management and performance tracking
- Automated ranking system based on multiple metrics
- Comprehensive analytics dashboards

---

## 🏗️ Architecture & Technology Stack

### Backend (FastAPI + MongoDB)
- **Framework:** FastAPI (Python)
- **Database:** MongoDB with Beanie ODM
- **Authentication:** Session-based (not JWT)
- **Server:** Uvicorn ASGI server
- **Deployment:** Render (https://med-rank-flow.onrender.com)

**Why FastAPI?**
- High performance (async/await support)
- Automatic API documentation (Swagger/OpenAPI)
- Type validation with Pydantic
- Easy to learn and maintain

**Why MongoDB?**
- Flexible schema (patient data varies)
- Good for document-based storage
- Easy to scale
- Works well with Python/Beanie

### Frontend (React + TypeScript)
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **UI Library:** Shadcn UI + Tailwind CSS
- **State Management:** React Query (TanStack Query)
- **Routing:** React Router
- **Deployment:** Vercel
  - Admin: https://med-rank-flow-4kuf.vercel.app/
  - Student: https://med-rank-flow-r4iq.vercel.app/

**Why React?**
- Component-based architecture
- Large ecosystem
- Good performance with virtual DOM
- TypeScript for type safety

**Why Vite?**
- Fast development server
- Quick hot module replacement
- Optimized production builds

---

## 🗄️ Database Design

### Collections

1. **users**
   - Fields: `_id`, `email`, `name`, `password_hash`, `role` (admin/student)
   - Indexes: `email` (unique)
   - Purpose: Store admin and student accounts

2. **patient_tasks**
   - Fields: `_id`, `title`, `description`, `patient` (object), `assigned_student_id`, `status` (pending/accepted/rejected/completed), `quality_score`, `created_at`, `completed_at`
   - Indexes: `assigned_student_id`, `status`
   - Purpose: Store all patient-linked tasks

3. **sessions**
   - Fields: `_id`, `user_id`, `token`, `created_at`, `expires_at`
   - Indexes: `token` (unique), `user_id`
   - Purpose: Manage user sessions for authentication

4. **task_responses**
   - Fields: `_id`, `task_id`, `student_id`, `action` (accepted/rejected/completed), `reason`, `created_at`
   - Purpose: Track all task actions (immutable audit log)

5. **analytics_logs**
   - Fields: `_id`, `user_id`, `action`, `metadata`, `timestamp`
   - Purpose: Immutable audit trail for analytics

### Relationships
- `patient_tasks.assigned_student_id` → `users._id`
- `sessions.user_id` → `users._id`
- `task_responses.task_id` → `patient_tasks._id`
- `task_responses.student_id` → `users._id`

---

## 🔐 Authentication & Security

### Authentication Flow
1. User submits email/password
2. Backend verifies credentials (bcrypt hash comparison)
3. Creates session token (random UUID)
4. Stores session in database with expiry (24 hours)
5. Returns token to frontend
6. Frontend stores token and sends in `Authorization: Bearer <token>` header
7. Backend validates token on each request

### Security Features
- **Password Hashing:** bcrypt with 12 rounds
- **Session Management:** Server-side sessions with expiry
- **Role-Based Access Control (RBAC):** Admin vs Student roles
- **CORS:** Configured for production domains
- **Input Validation:** Pydantic schemas for all inputs
- **Audit Logging:** Immutable logs for all actions

### Why Session-Based (Not JWT)?
- Can revoke sessions immediately
- Server controls expiry
- No token size limits
- Easier to implement logout

---

## 📡 API Endpoints

### Authentication
- `POST /auth/login` - Login (returns session token)
- `POST /auth/logout` - Logout (deletes session)

### Tasks (Admin)
- `POST /tasks` - Create new task
- `GET /tasks/admin` - Get all tasks (with filters)
- `POST /tasks/{id}/score` - Score completed task (0-5)

### Tasks (Student)
- `GET /tasks/student` - Get assigned tasks
- `POST /tasks/{id}/accept` - Accept pending task
- `POST /tasks/{id}/reject` - Reject task (with reason)
- `POST /tasks/{id}/complete` - Mark task as completed

### Analytics
- `GET /analytics/rankings` - Get student rankings (Admin only)
- `GET /analytics/admin` - Admin dashboard data
- `GET /analytics/student` - Current student analytics
- `GET /analytics/student/{id}` - Specific student analytics (Admin)

### Users
- `GET /users/students` - List all students (Admin)

**API Documentation:** https://med-rank-flow.onrender.com/docs

---

## 🎯 Key Features

### Admin Features
1. **Task Management**
   - Create patient-linked tasks
   - Assign to students
   - View all tasks and statuses
   - Score completed tasks (quality score 0-5)

2. **Analytics Dashboard**
   - Total students count
   - Average quality score
   - Tasks this month
   - Completion rate
   - Student performance charts
   - Monthly trends
   - Task distribution

3. **Student Rankings**
   - Ranked by average score (primary)
   - Secondary: tasks completed
   - Shows acceptance rate
   - Real-time updates

### Student Features
1. **Task Management**
   - View assigned tasks
   - Accept/reject with reason
   - Complete accepted tasks
   - View task history

2. **Personal Analytics**
   - Average score
   - Current rank and percentile
   - Performance history (last 7 tasks)
   - Weekly progress (6 weeks)
   - Task type performance
   - Upcoming tasks

---

## 📊 Ranking Algorithm

### How Rankings Work
1. **Primary Metric:** Average Quality Score
   - Calculated from all completed tasks with scores
   - Formula: `sum(quality_scores) / count(completed_tasks)`

2. **Secondary Metric:** Tasks Completed
   - Total number of completed tasks
   - Used for tie-breaking

3. **Tertiary Metric:** Acceptance Rate
   - Percentage of tasks accepted vs rejected
   - Formula: `(accepted / total_responses) * 100`

### Sorting Logic
```python
rankings.sort(key=lambda x: (
    x["average_score"],      # Primary: Higher is better
    x["tasks_completed"]     # Secondary: More is better
), reverse=True)
```

### Why This Algorithm?
- Rewards consistent high performance
- Encourages task completion
- Fair comparison across students

---

## 🚀 Deployment

### Backend (Render)
- **Platform:** Render (Free tier)
- **URL:** https://med-rank-flow.onrender.com
- **Process:**
  1. Connect GitHub repository
  2. Set environment variables (MONGODB_URL, CORS_ORIGINS)
  3. Auto-deploys on git push
  4. Uses `Procfile` for startup command

### Frontend (Vercel)
- **Platform:** Vercel (Free tier)
- **Admin:** https://med-rank-flow-4kuf.vercel.app/
- **Student:** https://med-rank-flow-r4iq.vercel.app/
- **Process:**
  1. Connect GitHub repository
  2. Set Root Directory (med-rank-flow-admin/student)
  3. Set environment variable (VITE_API_URL)
  4. Auto-deploys on git push

### Environment Variables

**Backend (Render):**
```
MONGODB_URL=mongodb+srv://...
CORS_ORIGINS=https://med-rank-flow-4kuf.vercel.app,https://med-rank-flow-r4iq.vercel.app
PORT=8000 (auto-set by Render)
```

**Frontend (Vercel):**
```
VITE_API_URL=https://med-rank-flow.onrender.com
```

---

## 🐛 Challenges & Solutions

### Challenge 1: CORS Errors
**Problem:** Frontend couldn't access backend API
**Solution:** 
- Custom CORS middleware in FastAPI
- Configured allowed origins via environment variable
- Handles preflight OPTIONS requests

### Challenge 2: Vercel Build Failures
**Problem:** Build failed due to missing `utils.ts` file
**Solution:**
- File existed locally but wasn't committed to git
- `.gitignore` had `lib/` pattern
- Force-added file with `git add -f`
- Fixed path aliases in `vite.config.ts`

### Challenge 3: MongoDB ObjectId Conversion
**Problem:** Student rankings not showing (ObjectId mismatch)
**Solution:**
- Converted string IDs to ObjectId in aggregation pipelines
- Used `bson.ObjectId` for proper type conversion

### Challenge 4: Session Management
**Problem:** Need secure, revocable authentication
**Solution:**
- Server-side sessions stored in MongoDB
- Token-based with expiry (24 hours)
- Can revoke immediately on logout

---

## 🔄 Data Flow

### Task Creation Flow
1. Admin creates task → `POST /tasks`
2. Backend validates input (Pydantic)
3. Creates `patient_task` with status "pending"
4. Assigns to student
5. Student sees task in dashboard

### Task Completion Flow
1. Student accepts task → `POST /tasks/{id}/accept`
2. Status changes to "accepted"
3. Student completes → `POST /tasks/{id}/complete`
4. Status changes to "completed"
5. Admin scores task → `POST /tasks/{id}/score`
6. Quality score saved
7. Rankings recalculated automatically

### Analytics Calculation
1. Aggregation pipeline groups tasks by student
2. Calculates average scores
3. Counts completed tasks
4. Calculates acceptance rates
5. Sorts and ranks students
6. Returns formatted data to frontend

---

## 📈 Performance Optimizations

1. **Database Indexes**
   - Email (unique index)
   - Student ID (for task queries)
   - Status (for filtering)
   - Token (for session lookup)

2. **Aggregation Pipelines**
   - Single query for rankings
   - Efficient grouping and calculations
   - Minimizes database round trips

3. **Frontend Optimizations**
   - React Query for caching
   - Lazy loading components
   - Optimized bundle size with Vite

4. **Caching**
   - React Query caches API responses
   - Reduces unnecessary API calls
   - Automatic refetching on focus

---

## 🔮 Future Improvements

1. **Real-time Updates**
   - WebSocket support for live task updates
   - Push notifications for new tasks

2. **Advanced Analytics**
   - Machine learning for performance prediction
   - Trend analysis and forecasting

3. **Mobile App**
   - React Native or Capacitor
   - Offline support
   - Push notifications

4. **Enhanced Features**
   - File uploads for task attachments
   - Comments/chat on tasks
   - Email notifications
   - Calendar integration

5. **Security Enhancements**
   - Rate limiting
   - IP whitelisting
   - Two-factor authentication
   - Audit trail improvements

---

## 💡 Important Points to Remember

### Architecture Decisions
- **Why three separate apps?** Separation of concerns, independent scaling
- **Why MongoDB?** Flexible schema for patient data
- **Why FastAPI?** High performance, async support, auto docs
- **Why React?** Component reusability, large ecosystem

### Security
- Passwords never stored in plain text (bcrypt)
- Sessions expire after 24 hours
- CORS configured for production domains only
- Input validation on all endpoints

### Scalability
- Database indexes for fast queries
- Aggregation pipelines for efficient calculations
- Stateless API (can scale horizontally)
- CDN for frontend assets (Vercel)

### Testing
- Manual testing with seed data
- Tested with multiple students and tasks
- Verified rankings algorithm
- Tested CORS with production URLs

---

## 🎤 Common Viva Questions

### Q: Why did you choose FastAPI over Django/Flask?
**A:** FastAPI offers async support, automatic API documentation, and type validation. It's faster and more modern for building REST APIs.

### Q: Why MongoDB instead of PostgreSQL?
**A:** Patient data has varying structures. MongoDB's flexible schema allows storing different patient information without rigid table structures.

### Q: How does the ranking algorithm work?
**A:** Students are ranked primarily by average quality score, then by number of tasks completed. Higher scores and more completions rank higher.

### Q: How do you handle authentication?
**A:** Session-based authentication. User logs in, receives a token, token is validated on each request. Sessions expire after 24 hours and can be revoked.

### Q: What if a student rejects all tasks?
**A:** Their acceptance rate decreases, affecting their ranking. They won't have completed tasks, so their average score remains 0.

### Q: How do you ensure data consistency?
**A:** MongoDB transactions for critical operations, validation at API level with Pydantic, and immutable audit logs for tracking changes.

### Q: What happens if the backend is down?
**A:** Frontend shows error messages. React Query handles retries. Sessions expire, requiring re-login when backend is back up.

### Q: How scalable is this system?
**A:** Backend can scale horizontally (stateless API). MongoDB can be sharded. Frontend is static files on CDN. Can handle thousands of concurrent users.

### Q: What security measures are implemented?
**A:** Password hashing (bcrypt), session management, CORS, input validation, role-based access control, and audit logging.

### Q: How do you handle errors?
**A:** Try-catch blocks, proper HTTP status codes, error messages in API responses, frontend error handling with React Query.

---

## 📝 Quick Reference

### Default Credentials
- **Admin:** admin@institute.edu / admin123
- **Student:** student01@student.edu / student123

### URLs
- **Backend:** https://med-rank-flow.onrender.com
- **Admin:** https://med-rank-flow-4kuf.vercel.app/
- **Student:** https://med-rank-flow-r4iq.vercel.app/
- **API Docs:** https://med-rank-flow.onrender.com/docs

### Tech Stack Summary
- **Backend:** Python, FastAPI, MongoDB, Beanie, Uvicorn
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Shadcn UI
- **Deployment:** Render (Backend), Vercel (Frontend)
- **Database:** MongoDB Atlas

### Key Metrics
- **Sessions:** 24-hour expiry
- **Quality Score:** 0-5 scale
- **Ranking Factors:** Average score, tasks completed, acceptance rate
- **Task Statuses:** pending → accepted/rejected → completed

---

**Good luck with your viva! 🎓**

