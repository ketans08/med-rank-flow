# MongoDB Atlas SSL Connection Fix

## Problem

SSL handshake error when connecting to MongoDB Atlas from Render:
```
pymongo.errors.ServerSelectionTimeoutError: SSL handshake failed
```

## Solution Applied

### 1. Updated Database Connection (`backend/core/database.py`)

Added explicit SSL/TLS configuration for MongoDB Atlas connections:

```python
# For MongoDB Atlas (mongodb+srv://)
if mongodb_url.startswith("mongodb+srv://"):
    db.client = AsyncIOMotorClient(
        mongodb_url,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=20000,
        socketTimeoutMS=20000,
        tls=True,
        tlsAllowInvalidCertificates=False,
    )
```

### 2. Updated Python Version (`backend/runtime.txt`)

Changed from Python 3.13.0 to Python 3.12.0 for better SSL/TLS compatibility.

## Additional Fixes to Try

### Option 1: Update Connection String Format

Ensure your MongoDB Atlas connection string includes SSL parameters:

```
mongodb+srv://username:password@cluster.mongodb.net/med_rank_flow?retryWrites=true&w=majority&tls=true
```

### Option 2: Check MongoDB Atlas Settings

1. **Network Access:**
   - Go to MongoDB Atlas → Network Access
   - Ensure Render IPs are whitelisted (or use `0.0.0.0/0` for development)

2. **Database User:**
   - Verify database user has correct permissions
   - Check username/password are correct

3. **Cluster Status:**
   - Ensure cluster is running (not paused)
   - Check cluster is accessible

### Option 3: Alternative Connection String

If SSL issues persist, try adding explicit SSL parameters:

```
mongodb+srv://username:password@cluster.mongodb.net/med_rank_flow?retryWrites=true&w=majority&ssl=true&ssl_cert_reqs=CERT_NONE
```

**Note:** `ssl_cert_reqs=CERT_NONE` is less secure but can help diagnose SSL issues.

## Verification Steps

1. **Test Connection Locally:**
   ```bash
   cd backend
   source venv/bin/activate
   python -c "from core.database import connect_to_mongo; import asyncio; asyncio.run(connect_to_mongo())"
   ```

2. **Check Render Logs:**
   - Go to Render Dashboard → Your Service → Logs
   - Look for "Connected to MongoDB successfully" message
   - Check for any SSL errors

3. **Verify Environment Variable:**
   - In Render Dashboard → Environment
   - Ensure `MONGODB_URL` is set correctly
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/med_rank_flow`

## Common Issues

### Issue: Connection String Format

**Wrong:**
```
mongodb+srv://user:pass@cluster.net
```

**Correct:**
```
mongodb+srv://user:pass@cluster.net/med_rank_flow?retryWrites=true&w=majority
```

### Issue: Special Characters in Password

If your password has special characters, URL encode them:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- etc.

### Issue: Python Version

Python 3.13 may have SSL compatibility issues. Using Python 3.12.0 is recommended.

## Testing

After deploying to Render:

1. Check health endpoint: `https://your-backend.onrender.com/health`
2. Check logs for MongoDB connection message
3. Try API endpoint: `https://your-backend.onrender.com/docs`

## Still Having Issues?

1. **Double-check connection string** - Copy directly from MongoDB Atlas
2. **Verify IP whitelist** - Add `0.0.0.0/0` temporarily for testing
3. **Check Render logs** - Look for specific error messages
4. **Test locally** - Ensure connection works locally first

