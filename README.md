# Med-Rank-Flow

**Production-ready medical institute ERP system** for managing patient-linked academic tasks, student performance, and analytics-based rankings.

## System Architecture

This project consists of **THREE SEPARATE APPLICATIONS**:

1. **Backend API** (FastAPI + MongoDB)
2. **Admin Web App** (React + TypeScript) - Port 5173
3. **Student Web App** (React + TypeScript) - Port 5174

## Quick Start

> ⚡ **Ready to Run!** All `.env` files are pre-configured for localhost. See [QUICK_START.md](./QUICK_START.md) for fastest setup.

### Prerequisites

- Python 3.9+
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file from example
cp .env.example .env
# Edit .env with your MongoDB URL and JWT secret

# Generate JWT secret (recommended)
openssl rand -hex 32

# Seed initial users
python -m utils.seed

# Run backend
uvicorn main:app --reload --port 8000
```

Backend will run on `http://localhost:8000`

**Important:** Update `.env` with:
- `MONGODB_URL` - Your MongoDB connection string
- `JWT_SECRET_KEY` - Generate with `openssl rand -hex 32`
- `CORS_ORIGINS` - Comma-separated list of allowed origins

### 2. Admin App Setup

```bash
cd med-rank-flow-admin
npm install

# Create .env file
cp .env.example .env
# Edit .env with your API URL (default: http://localhost:8000)

npm run dev
```

Admin app runs on `http://localhost:5173`

**Demo Credentials:**
- Email: `admin@institute.edu`
- Password: `admin123`

### 3. Student App Setup

```bash
cd med-rank-flow-student
npm install

# Create .env file
cp .env.example .env
# Edit .env with your API URL (default: http://localhost:8000)

npm run dev
```

Student app runs on `http://localhost:5174`

**Demo Credentials:**
- Any student: `student01@student.edu` to `student25@student.edu` / `student123`
- Example: `student05@student.edu` / `student123`

## Environment Configuration

All `.env` files are pre-configured for localhost development.

**Quick Reference:**
- Backend: `backend/.env` (already created)
- Admin App: `med-rank-flow-admin/.env` (already created)
- Student App: `med-rank-flow-student/.env` (already created)

See [QUICK_START.md](./QUICK_START.md) for setup instructions.

## Features

### Backend (FastAPI)
- Simple Session-Based Authentication (email/password)
- Role-Based Access Control (Admin/Student)
- MongoDB with Beanie ODM
- Immutable audit logging
- Analytics aggregation pipelines
- RESTful API endpoints

### Admin App
- Assign patient-linked tasks
- View all tasks and statuses
- Score completed tasks
- View student rankings
- Comprehensive analytics dashboard

### Student App
- View assigned tasks
- Accept/reject tasks (with reason for rejection)
- Complete accepted tasks
- View personal analytics
- Performance tracking

## API Endpoints

### Authentication
- `POST /auth/login` - Login with email/password (returns session token)
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
- `GET /analytics/rankings` - Get student rankings (Admin)
- `GET /analytics/admin` - Get admin analytics
- `GET /analytics/student` - Get student analytics
- `GET /analytics/student/{id}` - Get specific student analytics (Admin)

## Security Features

- ✅ Strict RBAC enforcement
- ✅ Immutable audit logs
- ✅ Patient data integrity
- ✅ No destructive operations
- ✅ Full action traceability
- ✅ Simple session-based authentication (email/password)
- ✅ Password hashing with bcrypt
- ✅ Session tokens stored in database

## Project Structure

```
med-rank-flow/
├── backend/                 # FastAPI backend
│   ├── core/               # Core configuration
│   ├── models/            # MongoDB models
│   ├── schemas/           # Pydantic schemas
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── utils/             # Utilities
├── med-rank-flow-admin/    # Admin React app
│   └── src/
│       ├── pages/         # Admin pages
│       ├── services/      # API services
│       └── contexts/      # React contexts
└── med-rank-flow-student/  # Student React app
    └── src/
        ├── pages/         # Student pages
        ├── services/      # API services
        └── contexts/      # React contexts
```

## Environment Variables

See [ENV_SETUP.md](./ENV_SETUP.md) for comprehensive environment variable documentation.

### Quick Setup

1. **Backend**: Copy `backend/.env.example` to `backend/.env` and configure:
   - MongoDB connection string
   - JWT secret key (generate with `openssl rand -hex 32`)
   - CORS origins

2. **Admin App**: Copy `med-rank-flow-admin/.env.example` to `med-rank-flow-admin/.env` and set:
   - `VITE_API_URL` (default: `http://localhost:8000`)

3. **Student App**: Copy `med-rank-flow-student/.env.example` to `med-rank-flow-student/.env` and set:
   - `VITE_API_URL` (default: `http://localhost:8000`)

**Important:** Never commit `.env` files to version control. They are already in `.gitignore`.

## Development

### Running All Services

1. Start MongoDB
2. Start backend: `cd backend && uvicorn main:app --reload`
3. Start admin app: `cd med-rank-flow-admin && npm run dev`
4. Start student app: `cd med-rank-flow-student && npm run dev`

### Testing

Backend includes seed script for initial data:
```bash
python -m utils.seed
```

## Production Deployment

**Quick Steps:**
1. Update `.env` files with production values:
   - MongoDB Atlas URL
   - Strong JWT secret (`openssl rand -hex 32`)
   - Production CORS origins
   - Production API URLs
2. Build frontend apps: `npm run build` in each app directory
3. Deploy backend: Use Gunicorn/Uvicorn with production settings
4. Set up reverse proxy (Nginx) with SSL certificates
5. Configure monitoring and backups

## License

Proprietary - Medical Institute ERP System
