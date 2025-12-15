# 🚀 Start Here - Localhost Setup with MongoDB Atlas

## Quick Setup (3 Steps)

### Step 1: Verify MongoDB Atlas Configuration

Your MongoDB Atlas URL is already in `backend/.env`. Just verify:

```bash
cd backend
cat .env | grep MONGODB_URL
```

Should show your Atlas connection string like:
```
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/med_rank_flow
```

**Make sure:**
- ✅ Atlas cluster is running (not paused)
- ✅ IP whitelist includes `0.0.0.0/0` in Atlas dashboard

---

### Step 2: Start Backend (Terminal 1)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m utils.seed
uvicorn main:app --reload --port 8000
```

**Keep this terminal open!**

---

### Step 3: Start Frontend Apps

**Terminal 2 - Admin:**
```bash
cd med-rank-flow-admin
npm install
npm run dev
```

**Terminal 3 - Student:**
```bash
cd med-rank-flow-student
npm install
npm run dev
```

---

## Access Applications

- **Admin**: http://localhost:5173
  - Login: `admin@institute.edu` / `admin123`

- **Student**: http://localhost:5174
  - Login: `student01@student.edu` / `student123`

- **Backend API**: http://localhost:8000
  - Docs: http://localhost:8000/docs

---

## That's It! 🎉

You're using MongoDB Atlas, so no local MongoDB setup needed!

For detailed troubleshooting, see [LOCALHOST_SETUP.md](./LOCALHOST_SETUP.md)
