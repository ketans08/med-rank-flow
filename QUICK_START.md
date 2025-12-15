# ⚡ Quick Start - Ready to Run!

> 📖 **For detailed step-by-step instructions, see [LOCALHOST_SETUP.md](./LOCALHOST_SETUP.md)**

All environment files are configured for **localhost development**. You're ready to start!

## 🎯 One-Command Start (Recommended)

### Option 1: Use Startup Scripts

**Terminal 1 - Backend:**
```bash
./start_backend.sh
```

**Terminal 2 - Admin App:**
```bash
./start_admin.sh
```

**Terminal 3 - Student App:**
```bash
./start_student.sh
```

### Option 2: Manual Start

**1. Start Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m utils.seed  # First time only
uvicorn main:app --reload --port 8000
```

**2. Start Admin App:**
```bash
cd med-rank-flow-admin
npm install  # First time only
npm run dev
```

**3. Start Student App:**
```bash
cd med-rank-flow-student
npm install  # First time only
npm run dev
```

## ✅ Pre-Configured Environment Files

All `.env` files are **already created** and configured for localhost:

- ✅ `backend/.env` - MongoDB: `mongodb://localhost:27017/med_rank_flow`
- ✅ `med-rank-flow-admin/.env` - API: `http://localhost:8000`
- ✅ `med-rank-flow-student/.env` - API: `http://localhost:8000`

## 🔧 Before First Run

### 1. Start MongoDB

**Local MongoDB:**
```bash
# Linux
sudo systemctl start mongod

# Mac
brew services start mongodb-community

# Or run directly
mongod
```

**MongoDB Atlas:**
- Update `backend/.env`:
```
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/med_rank_flow
```

### 2. Seed Initial Users (First Time Only)

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python -m utils.seed
```

This creates:
- **Admin**: `admin@institute.edu` / `admin123`
- **Students**: `john@student.edu`, `emma@student.edu`, `mike@student.edu` / `student123`

## 🌐 Access Applications

Once all services are running:

- **Backend API**: http://localhost:8000
  - API Docs: http://localhost:8000/docs
  - Health Check: http://localhost:8000/health

- **Admin Portal**: http://localhost:5173
  - Login: `admin@institute.edu` / `admin123`

- **Student Portal**: http://localhost:5174
  - Login: `john@student.edu` / `student123`

## 🔍 Verify Setup

Run the verification script:
```bash
python3 verify_setup.py
```

## 📝 Environment Variables Summary

### Backend (`backend/.env`)
- `MONGODB_URL` - MongoDB connection (default: `mongodb://localhost:27017/med_rank_flow`)
- `JWT_SECRET_KEY` - JWT signing key (dev key set, change for production)
- `CORS_ORIGINS` - Allowed frontend origins (localhost ports configured)

### Frontend Apps
- `VITE_API_URL` - Backend API URL (default: `http://localhost:8000`)

## 🚨 Troubleshooting

### Backend won't start
- ✅ Check MongoDB is running: `mongosh` or `mongo`
- ✅ Verify `backend/.env` exists
- ✅ Install dependencies: `pip install -r requirements.txt`

### Frontend can't connect
- ✅ Verify backend is running on port 8000
- ✅ Check `VITE_API_URL` in frontend `.env` files
- ✅ Check browser console for CORS errors

### MongoDB connection error
- ✅ Verify MongoDB is running
- ✅ Check `MONGODB_URL` in `backend/.env`
- ✅ For Atlas: Check IP whitelist and credentials

## 🎉 You're All Set!

Everything is configured and ready to run. Just start MongoDB and run the startup scripts!

For production deployment, see `DEPLOYMENT.md` and update `.env` files with production values.

