# Setup Guide

Complete step-by-step setup instructions for Med-Rank-Flow.

## Prerequisites

Before starting, ensure you have:

- **Python 3.9+** installed
- **Node.js 18+** installed
- **MongoDB** (local or Atlas account)
- **Git** (for cloning the repository)

## Step 1: MongoDB Setup

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with username and password
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/med_rank_flow
   ```

### Option B: Local MongoDB

1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string:
   ```
   mongodb://localhost:27017/med_rank_flow
   ```

## Step 2: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   ```

3. **Activate virtual environment**
   ```bash
   # Linux/Mac
   source venv/bin/activate
   
   # Windows
   venv\Scripts\activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure environment**
   ```bash
   # Create .env file if it doesn't exist
   # Add your MongoDB connection string:
   echo "MONGODB_URL=your_connection_string_here" > .env
   ```

6. **Seed initial data**
   ```bash
   python -m utils.seed
   ```
   This creates:
   - Admin user: `admin@institute.edu` / `admin123`
   - 20-25 students: `student01@student.edu` to `student25@student.edu` / `student123`

7. **Start backend server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

Backend will be available at: `http://localhost:8000`

## Step 3: Admin App Setup

1. **Navigate to admin app directory**
   ```bash
   cd med-rank-flow-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (optional)
   ```bash
   # Create .env file if needed
   echo "VITE_API_URL=http://localhost:8000" > .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

Admin app will be available at: `http://localhost:5173`

## Step 4: Student App Setup

1. **Navigate to student app directory**
   ```bash
   cd med-rank-flow-student
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment** (optional)
   ```bash
   # Create .env file if needed
   echo "VITE_API_URL=http://localhost:8000" > .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

Student app will be available at: `http://localhost:5174`

## Step 5: Verify Installation

1. **Check Backend**
   - Visit: http://localhost:8000/health
   - Should return: `{"status":"healthy"}`
   - Visit: http://localhost:8000/docs for API documentation

2. **Check Admin App**
   - Visit: http://localhost:5173
   - Login with: `admin@institute.edu` / `admin123`

3. **Check Student App**
   - Visit: http://localhost:5174
   - Login with: `student01@student.edu` / `student123`

## Using Startup Scripts

For convenience, use the provided startup scripts:

```bash
# Make scripts executable
chmod +x start_*.sh

# Terminal 1 - Backend
./start_backend.sh

# Terminal 2 - Admin
./start_admin.sh

# Terminal 3 - Student
./start_student.sh
```

## Adding More Data

To add more students and tasks with Indian names:

```bash
python3 add_indian_data.py
```

This script:
- Adds 5-10 new students with Indian names
- Creates tasks with Indian patient names
- Maintains the same email/password pattern

## Troubleshooting

### Backend won't start
- Check if MongoDB is running/accessible
- Verify connection string in `backend/.env`
- Check if port 8000 is available

### Frontend won't connect to backend
- Ensure backend is running on port 8000
- Check `VITE_API_URL` in frontend `.env` files
- Verify CORS is configured correctly

### Port already in use
```bash
# Kill process on specific port
lsof -ti:8000 | xargs kill -9  # Backend
lsof -ti:5173 | xargs kill -9  # Admin
lsof -ti:5174 | xargs kill -9  # Student
```

### MongoDB connection errors
- Verify MongoDB is running
- Check connection string format
- Ensure IP is whitelisted (for Atlas)
- Check database user credentials

## Next Steps

Once setup is complete:
1. Log in to Admin portal and explore features
2. Log in to Student portal and view assigned tasks
3. Check Analytics dashboard for rankings
4. Review API documentation at http://localhost:8000/docs

