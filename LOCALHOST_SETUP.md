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

# Check MongoDB (if using local)
mongosh --version
# OR
mongo --version
```

If any are missing, install them first.

---

## Step 1: Start MongoDB

### Option A: Local MongoDB

**Linux:**
```bash
# Start MongoDB service
sudo systemctl start mongod

# Verify it's running
sudo systemctl status mongod

# Test connection
mongosh
# Type: exit (to leave)
```

**macOS:**
```bash
# Start MongoDB
brew services start mongodb-community

# Or run directly
mongod

# Test connection (in new terminal)
mongosh
```

**Windows:**
```bash
# Start MongoDB service from Services panel
# OR run:
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

### Option B: MongoDB Atlas (Cloud - Easier)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `backend/.env`:
   ```
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/med_rank_flow
   ```

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

# Verify .env file exists
ls -la .env
# Should show: .env file

# If .env doesn't exist, copy from example:
cp .env.example .env

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
- **27017** - MongoDB (default)

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
# Check MongoDB is running
sudo systemctl status mongod  # Linux
brew services list | grep mongodb  # Mac

# Test connection
mongosh

# Check .env file has correct MONGODB_URL
cat backend/.env | grep MONGODB_URL
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
4. **MongoDB:** Leave running (or stop with `sudo systemctl stop mongod`)

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
# Start MongoDB (Linux)
sudo systemctl start mongod

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

