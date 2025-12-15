# Environment Variables Setup Guide

Complete guide for configuring environment variables for Med-Rank-Flow.

## Backend Environment Variables

**File:** `backend/.env` (create from `backend/.env.example`)

### Required Variables

```env
# MongoDB Connection (REQUIRED)
MONGODB_URL=mongodb://localhost:27017/med_rank_flow
# Or for MongoDB Atlas:
# MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/med_rank_flow

# Database Name
MONGODB_DB_NAME=med_rank_flow
```

### Optional Variables

```env
# CORS Origins (comma-separated, no spaces)
# Leave empty for localhost defaults
# Production example:
CORS_ORIGINS=https://admin.vercel.app,https://student.vercel.app

# Environment
ENVIRONMENT=development  # or production

# Port (auto-set by Render/Heroku via $PORT)
# For local development, defaults to 8000
```

### For Render Deployment

Set these in Render Dashboard → Environment Variables:

```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/med_rank_flow
MONGODB_DB_NAME=med_rank_flow
CORS_ORIGINS=https://your-admin-app.vercel.app,https://your-student-app.vercel.app
ENVIRONMENT=production
```

**Note:** `PORT` is automatically set by Render - don't set it manually.

## Frontend Environment Variables

### Admin App

**File:** `med-rank-flow-admin/.env` (create from `med-rank-flow-admin/.env.example`)

```env
# API URL (REQUIRED)
VITE_API_URL=http://localhost:8000

# For production:
# VITE_API_URL=https://your-backend.onrender.com
```

### Student App

**File:** `med-rank-flow-student/.env` (create from `med-rank-flow-student/.env.example`)

```env
# API URL (REQUIRED)
VITE_API_URL=http://localhost:8000

# For production:
# VITE_API_URL=https://your-backend.onrender.com
```

### For Vercel Deployment

Set in Vercel Dashboard → Settings → Environment Variables:

```env
VITE_API_URL=https://your-backend.onrender.com
```

**Important:** Vite requires `VITE_` prefix for environment variables to be exposed to the frontend.

## Quick Setup

### Local Development

1. **Backend:**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB URL
   ```

2. **Admin App:**
   ```bash
   cd med-rank-flow-admin
   cp .env.example .env
   # VITE_API_URL defaults to http://localhost:8000
   ```

3. **Student App:**
   ```bash
   cd med-rank-flow-student
   cp .env.example .env
   # VITE_API_URL defaults to http://localhost:8000
   ```

### Production Deployment

#### Render (Backend)

Set in Render Dashboard:
- `MONGODB_URL` - Your MongoDB Atlas connection string
- `MONGODB_DB_NAME` - Database name (default: `med_rank_flow`)
- `CORS_ORIGINS` - Comma-separated frontend URLs
- `ENVIRONMENT` - Set to `production`

#### Vercel (Frontend)

Set in Vercel Dashboard for each app:
- `VITE_API_URL` - Your Render backend URL

## Environment Variable Reference

### Backend Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URL` | ✅ Yes | `mongodb://localhost:27017/med_rank_flow` | MongoDB connection string |
| `MONGODB_DB_NAME` | ✅ Yes | `med_rank_flow` | Database name |
| `CORS_ORIGINS` | ❌ No | `localhost:5173,5174` | Comma-separated allowed origins |
| `ENVIRONMENT` | ❌ No | `development` | Environment type |
| `PORT` | ❌ No | `8000` | Server port (auto-set by Render) |

### Frontend Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_API_URL` | ✅ Yes | `http://localhost:8000` | Backend API URL |

## Important Notes

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Always use `.env.example`** as a template
3. **Vite prefix required** - Frontend env vars must start with `VITE_`
4. **CORS origins** - No spaces after commas, include `https://` protocol
5. **Render PORT** - Don't set manually, Render provides it automatically

## Troubleshooting

### Backend can't connect to MongoDB
- Verify `MONGODB_URL` is correct
- Check MongoDB is running (local) or cluster is active (Atlas)
- Verify IP whitelist (for Atlas)

### Frontend can't connect to backend
- Check `VITE_API_URL` is set correctly
- Verify backend is running
- Check CORS configuration includes frontend URL

### CORS errors in production
- Ensure `CORS_ORIGINS` includes exact frontend URLs
- Include `https://` protocol
- No trailing slashes
- Comma-separated, no spaces

## Example Configurations

### Local Development

**backend/.env:**
```env
MONGODB_URL=mongodb://localhost:27017/med_rank_flow
MONGODB_DB_NAME=med_rank_flow
# CORS_ORIGINS left empty (uses localhost defaults)
```

**med-rank-flow-admin/.env:**
```env
VITE_API_URL=http://localhost:8000
```

**med-rank-flow-student/.env:**
```env
VITE_API_URL=http://localhost:8000
```

### Production

**Render (Backend):**
```env
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/med_rank_flow
MONGODB_DB_NAME=med_rank_flow
CORS_ORIGINS=https://med-rank-flow-admin.vercel.app,https://med-rank-flow-student.vercel.app
ENVIRONMENT=production
```

**Vercel (Frontend):**
```env
VITE_API_URL=https://med-rank-flow-backend.onrender.com
```

