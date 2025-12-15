# Med-Rank-Flow

**Medical Institute ERP System** - Patient-linked task management system with student performance analytics and rankings.

A comprehensive web application for managing patient-linked academic tasks, tracking student performance, and generating analytics-based rankings for medical institutes.

## 🌐 Live Applications

- **Backend API:** https://med-rank-flow.onrender.com
- **Admin Portal:** https://med-rank-flow-4kuf.vercel.app/
- **Student Portal:** https://med-rank-flow-r4iq.vercel.app/

## 🚀 Quick Start

### Prerequisites

- **Python 3.9+**
- **Node.js 18+**
- **MongoDB** (Atlas cloud recommended or local MongoDB)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd med-rank-flow
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   
   # Configure MongoDB in .env file
   # Set MONGODB_URL to your MongoDB connection string
   
   # Seed initial data (creates admin + students with tasks)
   python -m utils.seed
   
   # Start backend server
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Admin App Setup**
   ```bash
   cd med-rank-flow-admin
   npm install
   npm run dev
   ```
   Admin app runs on `http://localhost:5173`

4. **Student App Setup**
   ```bash
   cd med-rank-flow-student
   npm install
   npm run dev
   ```
   Student app runs on `http://localhost:5174`

### Using Startup Scripts

Alternatively, use the provided startup scripts:

```bash
# Terminal 1 - Backend
./start_backend.sh

# Terminal 2 - Admin App
./start_admin.sh

# Terminal 3 - Student App
./start_student.sh
```

## 📋 Default Credentials

### Admin Portal
- **Email:** `admin@institute.edu`
- **Password:** `admin123`
- **Live URL:** https://med-rank-flow-4kuf.vercel.app/
- **Local URL:** http://localhost:5173

### Student Portal
- **Email:** `student01@student.edu` to `student16@student.edu`
- **Password:** `student123`
- **Live URL:** https://med-rank-flow-r4iq.vercel.app/
- **Local URL:** http://localhost:5174

Example: `student01@student.edu` / `student123`

## 🏗️ Architecture

This project consists of **three separate applications**:

1. **Backend API** (FastAPI + MongoDB)
   - RESTful API with session-based authentication
   - MongoDB database with Beanie ODM
   - Analytics and ranking calculations
   - Port: `8000`
   - **Live:** https://med-rank-flow.onrender.com

2. **Admin Web App** (React + TypeScript)
   - Task management and assignment
   - Student performance analytics
   - Rankings and scoring
   - Port: `5173`
   - **Live:** https://med-rank-flow-4kuf.vercel.app/

3. **Student Web App** (React + TypeScript)
   - View assigned tasks
   - Accept/reject tasks
   - Complete tasks
   - Personal analytics dashboard
   - Port: `5174`
   - **Live:** https://med-rank-flow-r4iq.vercel.app/

## ✨ Features

### Admin Features
- ✅ Create and assign patient-linked tasks
- ✅ View all tasks and their statuses
- ✅ Score completed tasks (quality score 0-5)
- ✅ View student rankings based on performance
- ✅ Comprehensive analytics dashboard
- ✅ Task distribution and completion tracking

### Student Features
- ✅ View assigned tasks
- ✅ Accept or reject tasks (with rejection reason)
- ✅ Complete accepted tasks
- ✅ View personal performance analytics
- ✅ Track ranking and percentile
- ✅ Performance history and trends

### System Features
- ✅ Role-based access control (Admin/Student)
- ✅ Session-based authentication
- ✅ Real-time analytics and rankings
- ✅ Patient data management
- ✅ Immutable audit logging
- ✅ CORS configured for production deployments

## 📁 Project Structure

```
med-rank-flow/
├── backend/                    # FastAPI backend
│   ├── core/                  # Core configuration
│   ├── models/               # MongoDB models (Beanie)
│   ├── routes/               # API routes
│   ├── schemas/              # Pydantic schemas
│   ├── services/             # Business logic
│   ├── utils/                # Utilities
│   ├── main.py               # FastAPI application
│   └── requirements.txt      # Python dependencies
│
├── med-rank-flow-admin/       # Admin React app
│   ├── src/
│   │   ├── pages/           # Admin pages
│   │   ├── services/        # API services
│   │   ├── contexts/        # React contexts
│   │   └── components/      # UI components
│   └── package.json
│
├── med-rank-flow-student/     # Student React app
│   ├── src/
│   │   ├── pages/           # Student pages
│   │   ├── services/        # API services
│   │   ├── contexts/        # React contexts
│   │   └── components/      # UI components
│   └── package.json
│
├── add_indian_data.py         # Script to add data with Indian names
├── start_backend.sh          # Backend startup script
├── start_admin.sh            # Admin app startup script
└── start_student.sh          # Student app startup script
```

## 🔧 Configuration

### Environment Variables

#### Backend (`backend/.env`)
```env
MONGODB_URL=mongodb://localhost:27017/med_rank_flow
# Or MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/med_rank_flow
CORS_ORIGINS=https://med-rank-flow-4kuf.vercel.app,https://med-rank-flow-r4iq.vercel.app
```

#### Admin App (`med-rank-flow-admin/.env`)
```env
VITE_API_URL=http://localhost:8000
# Production: VITE_API_URL=https://med-rank-flow.onrender.com
```

#### Student App (`med-rank-flow-student/.env`)
```env
VITE_API_URL=http://localhost:8000
# Production: VITE_API_URL=https://med-rank-flow.onrender.com
```

## 📡 API Endpoints

### Authentication
- `POST /auth/login` - Login with email/password
- `POST /auth/logout` - Logout and delete session

### Tasks (Admin)
- `POST /tasks` - Create new task
- `GET /tasks/admin` - Get all tasks
- `POST /tasks/{id}/score` - Score completed task

### Tasks (Student)
- `GET /tasks/student` - Get assigned tasks
- `POST /tasks/{id}/accept` - Accept pending task
- `POST /tasks/{id}/reject` - Reject pending task
- `POST /tasks/{id}/complete` - Complete accepted task

### Analytics
- `GET /analytics/rankings` - Get student rankings (Admin only)
- `GET /analytics/admin` - Get admin analytics dashboard
- `GET /analytics/student` - Get current student analytics
- `GET /analytics/student/{id}` - Get specific student analytics (Admin)

### Users
- `GET /users/students` - Get all students (Admin)

**API Documentation:** https://med-rank-flow.onrender.com/docs

## 🗄️ Database

### Collections

- **users** - Admin and student accounts
- **patient_tasks** - Patient-linked tasks
- **sessions** - Active user sessions
- **task_responses** - Task accept/reject/complete actions
- **analytics_logs** - Immutable audit logs

### Seeding Data

```bash
cd backend
source venv/bin/activate
python -m utils.seed
```

This creates:
- 1 admin user (`admin@institute.edu` / `admin123`)
- 20-25 student users (`student01@student.edu` to `student25@student.edu` / `student123`)
- Random tasks with various statuses and scores

### Adding More Data

Use the `add_indian_data.py` script to add more students and tasks with Indian names:

```bash
python3 add_indian_data.py
```

## 🛠️ Development

### Running in Development Mode

All three services support hot-reload:

- **Backend:** Uses `--reload` flag with uvicorn
- **Admin App:** Vite dev server with HMR
- **Student App:** Vite dev server with HMR

### API Documentation

Once the backend is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **Production:** https://med-rank-flow.onrender.com/docs

## 🔒 Security

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Session-based authentication
- ✅ Role-based access control (RBAC)
- ✅ CORS configured for production
- ✅ Input validation with Pydantic
- ✅ Immutable audit logging

## 📊 Analytics & Rankings

### Ranking Algorithm

Students are ranked based on:
1. **Average Quality Score** (primary) - Average of all completed task scores
2. **Tasks Completed** (secondary) - Total number of completed tasks
3. **Acceptance Rate** - Percentage of tasks accepted vs rejected

### Analytics Metrics

- Task completion rates
- Average quality scores
- Student performance trends
- Task distribution by type
- Monthly trends and patterns

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Verify MongoDB is running (local) or Atlas cluster is active
- Check connection string in `backend/.env`
- Ensure IP whitelist includes your IP (for Atlas)

**Port Already in Use:**
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

### Frontend Issues

**CORS Errors:**
- Ensure backend is running on port 8000
- Check CORS configuration in `backend/main.py`
- Verify `VITE_API_URL` in frontend `.env` files
- For production, ensure `CORS_ORIGINS` includes your Vercel URLs

**Port Conflicts:**
```bash
# Kill processes on ports 5173 or 5174
lsof -ti:5173 | xargs kill -9
lsof -ti:5174 | xargs kill -9
```

## 📝 Scripts

### Database Seeding
```bash
# Seed initial data
cd backend && source venv/bin/activate
python -m utils.seed

# Add more data with Indian names
cd .. && python3 add_indian_data.py
```

### Startup Scripts
```bash
# Make scripts executable
chmod +x start_*.sh

# Run services
./start_backend.sh
./start_admin.sh
./start_student.sh
```

## 🚀 Production Deployment

### Backend (Render)
- Deployed at: https://med-rank-flow.onrender.com
- Environment variables configured in Render dashboard
- Auto-deploys on git push

### Frontend (Vercel)
- **Admin:** https://med-rank-flow-4kuf.vercel.app/
- **Student:** https://med-rank-flow-r4iq.vercel.app/
- Auto-deploys on git push
- Environment variables configured in Vercel dashboard

## 📄 License

Proprietary - Medical Institute ERP System

## 👥 Support

For issues or questions, please contact the development team.

---

**Built for AIIMS Raipur** 🏥
