# Render Deployment Guide

Step-by-step guide to deploy Med-Rank-Flow backend on Render.

## Prerequisites

- Render account (free tier available)
- MongoDB Atlas account (or use Render's MongoDB service)
- GitHub repository (optional, but recommended)

## Step 1: Prepare MongoDB

### Option A: MongoDB Atlas (Recommended)

1. Create/use existing MongoDB Atlas cluster
2. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/med_rank_flow
   ```
3. Whitelist Render IPs (or use `0.0.0.0/0` for development)

### Option B: Render MongoDB (Paid)

1. Create MongoDB service in Render dashboard
2. Use provided connection string

## Step 2: Deploy Backend on Render

### Method 1: Deploy from GitHub (Recommended)

1. **Push code to GitHub** (if not already)
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Create New Web Service in Render**
   - Go to Render Dashboard
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure Service**
   - **Name:** `med-rank-flow-backend` (or your choice)
   - **Region:** Choose closest to your users
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables**
   Add these in Render dashboard:
   ```
   MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/med_rank_flow
   MONGODB_DB_NAME=med_rank_flow
   CORS_ORIGINS=https://your-admin-app.onrender.com,https://your-student-app.onrender.com
   ENVIRONMENT=production
   PORT=8000
   ```
   (Render will override PORT automatically)

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically
   - Wait for deployment to complete

### Method 2: Deploy from Local Code

1. **Install Render CLI** (optional)
   ```bash
   npm install -g render-cli
   ```

2. **Login to Render**
   ```bash
   render login
   ```

3. **Deploy**
   ```bash
   cd backend
   render deploy
   ```

## Step 3: Verify Deployment

1. **Check Health Endpoint**
   ```
   https://your-service.onrender.com/health
   ```
   Should return: `{"status":"healthy"}`

2. **Check API Docs**
   ```
   https://your-service.onrender.com/docs
   ```

3. **Test Login**
   ```bash
   curl -X POST https://your-service.onrender.com/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@institute.edu","password":"admin123"}'
   ```

## Step 4: Seed Initial Data

After deployment, you need to seed the database:

### Option A: Using Render Shell

1. Go to your service in Render dashboard
2. Click "Shell" tab
3. Run:
   ```bash
   python -m utils.seed
   ```

### Option B: Using Local Script

1. Update your local `.env` to point to production MongoDB
2. Run:
   ```bash
   cd backend
   source venv/bin/activate
   python -m utils.seed
   ```

## Step 5: Update Frontend Apps

Update your frontend apps to use the Render backend URL:

### Admin App (`med-rank-flow-admin/.env`)
```env
VITE_API_URL=https://your-backend-service.onrender.com
```

### Student App (`med-rank-flow-student/.env`)
```env
VITE_API_URL=https://your-backend-service.onrender.com
```

Rebuild and redeploy frontend apps.

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `MONGODB_DB_NAME` | Database name | `med_rank_flow` |
| `CORS_ORIGINS` | Comma-separated frontend URLs | `https://app1.com,https://app2.com` |
| `ENVIRONMENT` | Environment type | `production` |
| `PORT` | Server port (auto-set by Render) | `8000` |

## Render-Specific Configuration

### Auto-Deploy

Render automatically deploys on:
- Push to connected branch
- Manual deploy trigger

### Health Checks

Render uses `/health` endpoint for health checks (already configured).

### Scaling

- **Free Tier:** Single instance, spins down after 15 min inactivity
- **Paid Tier:** Always-on instances, auto-scaling available

### Logs

View logs in Render dashboard:
- Build logs
- Runtime logs
- Real-time streaming

## Troubleshooting

### Build Fails

- Check `requirements.txt` is correct
- Verify Python version in `runtime.txt`
- Check build logs in Render dashboard

### Service Won't Start

- Verify `Procfile` exists and is correct
- Check environment variables are set
- Review runtime logs

### Database Connection Errors

- Verify MongoDB URL is correct
- Check IP whitelist (for Atlas)
- Ensure database user has correct permissions

### CORS Errors

- Update `CORS_ORIGINS` environment variable
- Include exact frontend URLs (with https://)
- No trailing slashes

### Service Spins Down (Free Tier)

- First request after inactivity takes ~30 seconds
- Consider upgrading to paid tier for always-on

## Production Checklist

- [ ] MongoDB Atlas cluster is running
- [ ] Environment variables are set correctly
- [ ] CORS origins include production frontend URLs
- [ ] Database is seeded with initial data
- [ ] Health endpoint is working
- [ ] Frontend apps are updated with backend URL
- [ ] SSL/HTTPS is enabled (automatic on Render)
- [ ] Monitoring is set up (optional)

## Cost Estimation

### Free Tier
- **Web Service:** Free (spins down after inactivity)
- **MongoDB Atlas:** Free (512MB storage)
- **Total:** $0/month

### Paid Tier (Always-On)
- **Web Service:** $7/month (always-on)
- **MongoDB Atlas:** Free or paid
- **Total:** $7+/month

## Next Steps

1. Deploy frontend apps (can use Render Static Sites or Vercel/Netlify)
2. Set up custom domain (optional)
3. Configure monitoring and alerts
4. Set up automated backups

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

