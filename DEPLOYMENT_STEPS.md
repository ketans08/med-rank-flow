# Complete Deployment Steps

Step-by-step guide to deploy Med-Rank-Flow to production.

## 📋 Prerequisites Checklist

- [ ] GitHub account
- [ ] Render account (free tier available)
- [ ] Vercel account (free tier available)
- [ ] MongoDB Atlas account (free tier available)
- [ ] Code pushed to GitHub repository

## 🗄️ Step 1: Setup MongoDB Atlas

### 1.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new organization (or use default)

### 1.2 Create Cluster
1. Click "Build a Database"
2. Choose **FREE** (M0) tier
3. Select cloud provider and region (closest to you)
4. Click "Create"

### 1.3 Create Database User
1. Go to "Database Access" → "Add New Database User"
2. Choose "Password" authentication
3. Username: `medrankflow` (or your choice)
4. Password: Generate secure password (save it!)
5. Database User Privileges: "Atlas admin" (or "Read and write to any database")
6. Click "Add User"

### 1.4 Configure Network Access
1. Go to "Network Access" → "Add IP Address"
2. Click "Allow Access from Anywhere" (for development)
   - Or add specific IPs for production
3. Click "Confirm"

### 1.5 Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<username>` and `<password>` with your database user credentials
5. Add database name at the end:
   ```
   mongodb+srv://medrankflow:yourpassword@cluster0.xxxxx.mongodb.net/med_rank_flow?retryWrites=true&w=majority
   ```
6. **Save this connection string** - you'll need it for Render!

---

## 🚀 Step 2: Deploy Backend to Render

### 2.1 Push Code to GitHub
```bash
# If not already pushed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2.2 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)
3. Authorize Render to access your repositories

### 2.3 Create Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Select the repository: `med-rank-flow` (or your repo name)

### 2.4 Configure Service Settings
Fill in the form:

- **Name:** `med-rank-flow-backend` (or your choice)
- **Region:** Choose closest to your users
- **Branch:** `main` (or your default branch)
- **Root Directory:** `backend` ⚠️ **IMPORTANT**
- **Runtime:** `Python 3`
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 2.5 Set Environment Variables
Click "Advanced" → "Add Environment Variable" and add:

```
MONGODB_URL=mongodb+srv://medrankflow:yourpassword@cluster0.xxxxx.mongodb.net/med_rank_flow?retryWrites=true&w=majority
```

```
MONGODB_DB_NAME=med_rank_flow
```

```
ENVIRONMENT=production
```

**Leave CORS_ORIGINS empty for now** - we'll add it after deploying frontend.

### 2.6 Deploy
1. Click "Create Web Service"
2. Wait for build to complete (2-5 minutes)
3. Your backend will be live at: `https://med-rank-flow-backend.onrender.com`
4. **Copy this URL** - you'll need it for frontend!

### 2.7 Verify Backend
1. Visit: `https://your-backend.onrender.com/health`
2. Should return: `{"status":"healthy"}`
3. Visit: `https://your-backend.onrender.com/docs`
4. Should show API documentation

### 2.8 Seed Database
1. Go to Render Dashboard → Your Service → "Shell"
2. Run:
   ```bash
   python -m utils.seed
   ```
3. Wait for completion
4. Verify: Try logging in at `/docs` with `admin@institute.edu` / `admin123`

---

## 🌐 Step 3: Deploy Admin App to Vercel

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your repositories

### 3.2 Create New Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository: `med-rank-flow`
3. Click "Import"

### 3.3 Configure Project
Fill in:

- **Project Name:** `med-rank-flow-admin`
- **Root Directory:** `med-rank-flow-admin` ⚠️ **IMPORTANT**
- **Framework Preset:** Vite (auto-detected)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### 3.4 Set Environment Variable
Click "Environment Variables" and add:

```
VITE_API_URL=https://your-backend.onrender.com
```
(Replace with your actual Render backend URL)

### 3.5 Deploy
1. Click "Deploy"
2. Wait for build (1-2 minutes)
3. Your admin app will be live at: `https://med-rank-flow-admin.vercel.app`
4. **Copy this URL** - you'll need it for backend CORS!

---

## 🎓 Step 4: Deploy Student App to Vercel

### 4.1 Create New Project
1. In Vercel Dashboard, click "Add New..." → "Project"
2. Import the same repository: `med-rank-flow`
3. Click "Import"

### 4.2 Configure Project
Fill in:

- **Project Name:** `med-rank-flow-student`
- **Root Directory:** `med-rank-flow-student` ⚠️ **IMPORTANT**
- **Framework Preset:** Vite (auto-detected)
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `dist` (auto-detected)
- **Install Command:** `npm install` (auto-detected)

### 4.3 Set Environment Variable
Click "Environment Variables" and add:

```
VITE_API_URL=https://your-backend.onrender.com
```
(Same backend URL as admin app)

### 4.4 Deploy
1. Click "Deploy"
2. Wait for build (1-2 minutes)
3. Your student app will be live at: `https://med-rank-flow-student.vercel.app`
4. **Copy this URL** - you'll need it for backend CORS!

---

## 🔗 Step 5: Update Backend CORS

### 5.1 Update CORS Origins
1. Go to Render Dashboard → Your Backend Service
2. Go to "Environment" tab
3. Find `CORS_ORIGINS` variable (or add it if not exists)
4. Set value to:
   ```
   https://med-rank-flow-admin.vercel.app,https://med-rank-flow-student.vercel.app
   ```
   (Replace with your actual Vercel URLs)

### 5.2 Redeploy Backend
1. Click "Manual Deploy" → "Deploy latest commit"
2. Wait for deployment (1-2 minutes)
3. CORS is now configured!

---

## ✅ Step 6: Test Everything

### 6.1 Test Admin App
1. Visit: `https://med-rank-flow-admin.vercel.app`
2. Login with: `admin@institute.edu` / `admin123`
3. Verify:
   - [ ] Can see dashboard
   - [ ] Can view tasks
   - [ ] Can see analytics
   - [ ] Can see rankings

### 6.2 Test Student App
1. Visit: `https://med-rank-flow-student.vercel.app`
2. Login with: `student01@student.edu` / `student123`
3. Verify:
   - [ ] Can see dashboard
   - [ ] Can view assigned tasks
   - [ ] Can see analytics

### 6.3 Test API
1. Visit: `https://your-backend.onrender.com/docs`
2. Try login endpoint:
   - POST `/auth/login`
   - Body: `{"email":"admin@institute.edu","password":"admin123"}`
   - Should return access token

---

## 📝 Step 7: Update Environment Files (Optional)

If you want to update local `.env` files for reference:

### Backend `.env`
```env
MONGODB_URL=mongodb+srv://medrankflow:password@cluster0.xxxxx.mongodb.net/med_rank_flow
MONGODB_DB_NAME=med_rank_flow
CORS_ORIGINS=https://med-rank-flow-admin.vercel.app,https://med-rank-flow-student.vercel.app
ENVIRONMENT=production
```

### Admin `.env`
```env
VITE_API_URL=https://your-backend.onrender.com
```

### Student `.env`
```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🎯 Quick Reference

### Your Deployment URLs

- **Backend API:** `https://med-rank-flow-backend.onrender.com`
- **Admin App:** `https://med-rank-flow-admin.vercel.app`
- **Student App:** `https://med-rank-flow-student.vercel.app`
- **API Docs:** `https://med-rank-flow-backend.onrender.com/docs`

### Default Credentials

- **Admin:** `admin@institute.edu` / `admin123`
- **Students:** `student01@student.edu` to `student16@student.edu` / `student123`

---

## 🔧 Troubleshooting

### Backend won't start
- Check MongoDB connection string is correct
- Verify MongoDB Atlas cluster is running
- Check IP whitelist includes Render IPs

### Frontend can't connect
- Verify `VITE_API_URL` is set correctly
- Check backend CORS includes frontend URLs
- Ensure backend is running

### CORS errors
- Verify `CORS_ORIGINS` includes exact frontend URLs
- No trailing slashes
- Include `https://` protocol
- Redeploy backend after updating CORS

### Database empty
- Run seed script in Render Shell
- Check MongoDB connection
- Verify database name is correct

---

## 📚 Next Steps

1. ✅ Test all functionality
2. ✅ Set up custom domains (optional)
3. ✅ Configure monitoring (optional)
4. ✅ Set up automated backups
5. ✅ Add more students/tasks as needed

---

**🎉 Congratulations! Your Med-Rank-Flow is now live!**

