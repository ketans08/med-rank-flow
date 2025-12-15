# Vercel Deployment Guide

Deploy Admin and Student React apps to Vercel (Free Static Site Hosting).

## Prerequisites

- Vercel account (free tier available)
- GitHub repository
- Backend deployed (Render or other)

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Admin App Deployment

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com
   - Sign in with GitHub

2. **Create New Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository

3. **Configure Project**
   - **Project Name:** `med-rank-flow-admin` (or your choice)
   - **Root Directory:** `med-rank-flow-admin`
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Environment Variables**
   Add:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
   (Replace with your actual backend URL)

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at: `https://your-app.vercel.app`

### Student App Deployment

Repeat the same steps but:
- **Root Directory:** `med-rank-flow-student`
- **Project Name:** `med-rank-flow-student`
- Same environment variable: `VITE_API_URL`

## Option 2: Deploy via Vercel CLI

### Install Vercel CLI

```bash
npm install -g vercel
```

### Deploy Admin App

```bash
cd med-rank-flow-admin

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_URL
# Enter: https://your-backend.onrender.com

# Deploy to production
vercel --prod
```

### Deploy Student App

```bash
cd med-rank-flow-student

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_URL
# Enter: https://your-backend.onrender.com

# Deploy to production
vercel --prod
```

## Update Backend CORS

After deploying frontend apps, update backend CORS origins:

**In Render Dashboard → Environment Variables:**
```
CORS_ORIGINS=https://your-admin-app.vercel.app,https://your-student-app.vercel.app
```

Or if using multiple domains:
```
CORS_ORIGINS=https://admin.vercel.app,https://student.vercel.app,https://admin.yourdomain.com,https://student.yourdomain.com
```

## Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update CORS origins in backend

## Automatic Deployments

Vercel automatically deploys on:
- Push to main branch (production)
- Push to other branches (preview deployments)
- Pull requests (preview deployments)

## Build Configuration

Vercel automatically detects Vite projects. If needed, create `vercel.json`:

### Admin App (`med-rank-flow-admin/vercel.json`)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Student App (`med-rank-flow-student/vercel.json`)
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Environment Variables

Set in Vercel Dashboard → Settings → Environment Variables:

- **Production:** `VITE_API_URL=https://your-backend.onrender.com`
- **Preview:** Same (or different for testing)
- **Development:** `VITE_API_URL=http://localhost:8000`

## Troubleshooting

### Build Fails

- Check Node.js version (Vercel uses Node 18+ by default)
- Verify `package.json` has correct build script
- Check build logs in Vercel dashboard

### API Calls Fail

- Verify `VITE_API_URL` is set correctly
- Check backend CORS includes Vercel domain
- Ensure backend is running and accessible

### Routing Issues

- Add `vercel.json` with rewrites (see above)
- Ensure React Router is configured correctly

## Cost

**Free Tier Includes:**
- Unlimited deployments
- 100GB bandwidth/month
- Custom domains
- SSL certificates
- Preview deployments

**Paid Plans:**
- Team collaboration
- More bandwidth
- Advanced analytics

## Next Steps

1. Deploy both apps to Vercel
2. Update backend CORS with Vercel URLs
3. Test all functionality
4. Set up custom domains (optional)
5. Configure monitoring (optional)

## Quick Deploy Commands

```bash
# Admin App
cd med-rank-flow-admin
vercel --prod

# Student App
cd med-rank-flow-student
vercel --prod
```

---

**Your apps will be live at:**
- Admin: `https://med-rank-flow-admin.vercel.app`
- Student: `https://med-rank-flow-student.vercel.app`

