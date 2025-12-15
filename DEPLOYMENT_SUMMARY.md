# Deployment Summary

Quick reference for deploying Med-Rank-Flow.

## ✅ Backend CORS Status

**Backend CORS is production-ready!**

- ✅ Configurable via `CORS_ORIGINS` environment variable
- ✅ Supports multiple origins (comma-separated)
- ✅ Falls back to localhost for development
- ✅ Handles preflight OPTIONS requests
- ✅ Includes credentials support

**To configure for production:**
```
CORS_ORIGINS=https://admin.vercel.app,https://student.vercel.app
```

## Deployment Options

### 1. Web Deployment (Recommended)

**Backend:** Render (Web Service)
- ✅ Already configured
- ✅ Procfile ready
- ✅ Port configuration done
- ✅ CORS configurable

**Frontend:** Vercel (Static Sites)
- ✅ Free hosting
- ✅ Automatic deployments
- ✅ Custom domains
- ✅ SSL included

**See:** `VERCEL_DEPLOYMENT.md`

### 2. Mobile App (APK)

**Option A: Capacitor (Easier)**
- Wrap web app in native container
- Build APK in 1-2 days
- Reuses existing code

**Option B: React Native (Advanced)**
- Complete rewrite required
- Better performance
- 2-4 weeks development

**See:** `MOBILE_APP.md`

## Quick Deployment Checklist

### Backend (Render)

- [ ] Push code to GitHub
- [ ] Create Render Web Service
- [ ] Set Root Directory: `backend`
- [ ] Add environment variables:
  - `MONGODB_URL`
  - `CORS_ORIGINS` (add after frontend deployment)
  - `MONGODB_DB_NAME`
- [ ] Deploy
- [ ] Seed database
- [ ] Test health endpoint

### Frontend (Vercel)

- [ ] Deploy Admin app
  - Root: `med-rank-flow-admin`
  - Env: `VITE_API_URL=https://your-backend.onrender.com`
- [ ] Deploy Student app
  - Root: `med-rank-flow-student`
  - Env: `VITE_API_URL=https://your-backend.onrender.com`
- [ ] Update backend CORS with Vercel URLs
- [ ] Test both apps

### Mobile (Capacitor - Optional)

- [ ] Install Capacitor
- [ ] Build web apps
- [ ] Add Android platform
- [ ] Configure Capacitor
- [ ] Build APK in Android Studio
- [ ] Test on device

## Recommended Path

1. **Deploy Backend to Render** (30 minutes)
2. **Deploy Frontend to Vercel** (20 minutes)
3. **Test Everything** (15 minutes)
4. **Add Mobile Later** (if needed)

**Total Time:** ~1 hour for web deployment

## Cost Comparison

### Web Deployment
- **Render Backend:** Free (or $7/month for always-on)
- **Vercel Frontend:** Free
- **MongoDB Atlas:** Free tier
- **Total:** $0-7/month

### Mobile Deployment
- **Play Store:** $25 one-time
- **App Store:** $99/year
- **Development:** Free (Capacitor) or time investment (React Native)

## Environment Variables Reference

### Backend (Render)
```
MONGODB_URL=mongodb+srv://...
MONGODB_DB_NAME=med_rank_flow
CORS_ORIGINS=https://admin.vercel.app,https://student.vercel.app
ENVIRONMENT=production
```

### Frontend (Vercel)
```
VITE_API_URL=https://your-backend.onrender.com
```

## Support Documents

- `RENDER_DEPLOYMENT.md` - Backend deployment
- `VERCEL_DEPLOYMENT.md` - Frontend deployment
- `MOBILE_APP.md` - Mobile app guide
- `API.md` - API documentation

---

**Ready to deploy?** Start with `RENDER_DEPLOYMENT.md` for backend, then `VERCEL_DEPLOYMENT.md` for frontend!

