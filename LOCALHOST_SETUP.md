# 🚀 Step-by-Step Localhost Setup Guide

Follow these steps exactly to run Med-Rank-Flow on your local machine.

## Prerequisites Check

First, verify you have everything installed:

```bash
# Check Python version (need 3.9+)
python3 --version

# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version
```

If any are missing, install them first.

---

## Step 1: Configure MongoDB Atlas

**You're using MongoDB Atlas (cloud) - great choice!**

1. Make sure you have your MongoDB Atlas connection string ready
2. It should look like:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/med_rank_flow
   ```
3. Verify your `backend/.env` file has the correct URL:
   ```bash
   cd backend
   cat .env | grep MONGODB_URL
   ```
4. Should show your Atlas connection string

**Important:** Make sure your Atlas cluster:
- ✅ Is running (not paused)
- ✅ Has IP whitelist set to `0.0.0.0/0` (allow all IPs) for development
- ✅ Database user has read/write permissions

**Note:** No need to install or start local MongoDB - you're using cloud!

---

## Step 2: Setup Backend

Open **Terminal 1**:

```bash
# Navigate to project directory
cd /home/ashut0sh/clones/med-rank-flow

# Go to backend directory
cd backend

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# You should see (venv) in your prompt now

# Install Python dependencies
pip install -r requirements.txt

# This will install:
# - FastAPI
# - MongoDB drivers
# - Password hashing
# - And other dependencies

# Verify .env file exists and has MongoDB Atlas URL
ls -la .env
cat .env | grep MONGODB_URL
# Should show your MongoDB Atlas connection string

# If .env doesn't exist, copy from example:
# cp .env.example .env
# Then edit .env and add your MongoDB Atlas URL

# Seed initial data (creates admin + 20-25 students with random tasks)
python -m utils.seed

# You should see:
# ✅ Created admin: admin@institute.edu / admin123
# ✅ Created student 1/25: student01@student.edu / student123
# ... (more students)
# ✅ Created X tasks with random marks

# Start backend server
uvicorn main:app --reload --port 8000
```

**Backend should now be running!**

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Keep this terminal open!**

Test backend:
- Open browser: http://localhost:8000/health
- Should show: `{"status": "healthy"}`
- API docs: http://localhost:8000/docs

---

## Step 3: Setup Admin App

Open **Terminal 2** (new terminal window):

```bash
# Navigate to project directory
cd /home/ashut0sh/clones/med-rank-flow

# Go to admin app directory
cd med-rank-flow-admin

# Install Node.js dependencies (first time only, takes 1-2 minutes)
npm install

# Verify .env file exists
ls -la .env
# Should show: .env file with VITE_API_URL=http://localhost:8000

# Start admin app
npm run dev
```

**Admin app should now be running!**

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Keep this terminal open!**

Open browser: http://localhost:5173

---

## Step 4: Setup Student App

Open **Terminal 3** (new terminal window):

```bash
# Navigate to project directory
cd /home/ashut0sh/clones/med-rank-flow

# Go to student app directory
cd med-rank-flow-student

# Install Node.js dependencies (first time only, takes 1-2 minutes)
npm install

# Verify .env file exists
ls -la .env
# Should show: .env file with VITE_API_URL=http://localhost:8000

# Start student app
npm run dev
```

**Student app should now be running!**

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
```

**Keep this terminal open!**

Open browser: http://localhost:5174

---

## Step 5: Test the Application

### Test Admin Portal

1. Open browser: **http://localhost:5173**
2. You should see login page
3. Login with:
   - **Email:** `admin@institute.edu`
   - **Password:** `admin123`
4. You should see admin dashboard
5. Try creating a task
6. Check analytics page

### Test Student Portal

1. Open browser: **http://localhost:5174**
2. You should see login page
3. Login with any student:
   - **Email:** `student01@student.edu` (or student02, student03, etc.)
   - **Password:** `student123`
4. You should see student dashboard
5. You should see assigned tasks with random marks
6. Try accepting/rejecting tasks
7. Check analytics page

---

## Quick Reference

### Ports Used:
- **8000** - Backend API
- **5173** - Admin App
- **5174** - Student App
- **MongoDB** - Cloud Atlas (no local port needed)

### Login Credentials:

**Admin:**
- Email: `admin@institute.edu`
- Password: `admin123`

**Students:**
- Email: `student01@student.edu` to `student25@student.edu`
- Password: `student123` (same for all)

### URLs:
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health
- Admin Portal: http://localhost:5173
- Student Portal: http://localhost:5174

---

## Troubleshooting

### Backend won't start?

**Error: Module not found**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Error: MongoDB connection failed**
```bash
# Check .env file has correct MongoDB Atlas URL
cat backend/.env | grep MONGODB_URL

# Should show: mongodb+srv://username:password@cluster.mongodb.net/med_rank_flow

# Common issues:
# 1. Wrong password in connection string
# 2. Cluster is paused (go to Atlas dashboard and resume)
# 3. IP not whitelisted (add 0.0.0.0/0 in Atlas Network Access)
# 4. Database name mismatch (should be med_rank_flow)
```

**Error: Port 8000 already in use**
```bash
# Find what's using port 8000
lsof -i :8000  # Mac/Linux
netstat -ano | findstr :8000  # Windows

# Kill the process or change port in backend/.env
```

### Frontend won't start?

**Error: npm install fails**
```bash
# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Error: Can't connect to backend**
```bash
# Check backend is running
curl http://localhost:8000/health

# Check .env file
cat med-rank-flow-admin/.env
# Should have: VITE_API_URL=http://localhost:8000
```

**Error: CORS errors in browser**
- Make sure backend is running
- Check backend/.env has: `CORS_ORIGINS=http://localhost:5173,http://localhost:5174`

### Can't login?

**Check:**
1. Backend is running on port 8000
2. MongoDB is running
3. Users are seeded: `python -m utils.seed`
4. Using correct email/password
5. Check browser console for errors

---

## Stopping the Application

To stop everything:

1. **Terminal 1 (Backend):** Press `Ctrl+C`
2. **Terminal 2 (Admin):** Press `Ctrl+C`
3. **Terminal 3 (Student):** Press `Ctrl+C`
4. **MongoDB Atlas:** Leave running (it's in the cloud, no need to stop)

---

## Next Steps After Setup

1. ✅ All 3 terminals running
2. ✅ MongoDB running
3. ✅ Can login to both portals
4. ✅ Can create tasks (admin)
5. ✅ Can see tasks (student)
6. ✅ Analytics working

**You're all set!** 🎉

---

## Quick Commands Cheat Sheet

```bash
# Verify MongoDB Atlas URL in .env
cd backend
cat .env | grep MONGODB_URL

# Start Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000

# Start Admin App
cd med-rank-flow-admin
npm run dev

# Start Student App
cd med-rank-flow-student
npm run dev

# Seed Data (first time)
cd backend
source venv/bin/activate
python -m utils.seed
```

