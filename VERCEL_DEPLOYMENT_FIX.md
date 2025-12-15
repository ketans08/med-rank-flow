# Vercel Deployment Fix - Build Succeeds But Not Deployed

## ✅ What I Fixed

1. **Simplified `vercel.json`** - Removed explicit build settings since Vercel auto-detects Vite
2. **Kept only rewrites** - For SPA routing support

## 🔍 Common Causes When Build Succeeds But Deployment Fails

### 1. **Vercel Dashboard Settings**

Check these in Vercel Dashboard → Your Project → Settings → General:

- ✅ **Root Directory:** Must be `med-rank-flow-admin` (or `med-rank-flow-student`)
- ✅ **Build Command:** Should be `npm run build` (auto-detected)
- ✅ **Output Directory:** Should be `dist` (auto-detected)
- ✅ **Install Command:** Should be `npm install` (auto-detected)
- ✅ **Framework Preset:** Should be `Vite` (auto-detected)

### 2. **Environment Variables**

Go to Settings → Environment Variables and ensure:
- `VITE_API_URL` is set for **Production**, **Preview**, and **Development**

### 3. **Deployment Logs**

Check the deployment logs in Vercel Dashboard:
1. Go to your project
2. Click on the failed deployment
3. Check the **Build Logs** tab
4. Look for errors after "Build completed successfully"

Common post-build errors:
- Missing `index.html` in output
- Output directory not found
- Framework detection issues

### 4. **Git Integration**

If deployment isn't triggering:
- Check Git integration in Settings → Git
- Ensure repository is connected
- Check branch settings (should deploy from `main`)

## 🛠️ Step-by-Step Fix

### Step 1: Verify Root Directory

1. Go to Vercel Dashboard
2. Select your project (Admin or Student)
3. Settings → General
4. Scroll to **Root Directory**
5. Ensure it's set to:
   - Admin: `med-rank-flow-admin`
   - Student: `med-rank-flow-student`
6. Click **Save**

### Step 2: Clear Build Cache

1. Go to Settings → General
2. Scroll to **Build & Development Settings**
3. Click **Clear Build Cache**
4. Redeploy

### Step 3: Manual Redeploy

1. Go to Deployments tab
2. Click the three dots (⋯) on latest deployment
3. Click **Redeploy**
4. Or push a new commit to trigger deployment

### Step 4: Check Build Output

In the build logs, verify:
```
✓ built in X.XXs
```

Then check if it says:
```
Uploading build outputs...
```

If upload fails, there might be an output directory issue.

## 🔧 Alternative: Explicit Configuration

If auto-detection isn't working, you can explicitly set build settings in Vercel Dashboard:

1. Settings → General → Build & Development Settings
2. Override settings:
   - **Build Command:** `cd med-rank-flow-admin && npm run build`
   - **Output Directory:** `med-rank-flow-admin/dist`
   - **Install Command:** `cd med-rank-flow-admin && npm install`

(But Root Directory should make this unnecessary)

## 📋 Checklist

Before redeploying, verify:

- [ ] Root Directory is set correctly in Vercel Dashboard
- [ ] `vercel.json` only contains rewrites (no build settings)
- [ ] `VITE_API_URL` environment variable is set
- [ ] Build succeeds locally (`npm run build`)
- [ ] `dist/` folder is created after build
- [ ] `dist/index.html` exists
- [ ] Git repository is connected
- [ ] Branch is set to `main` (or your default branch)

## 🚨 If Still Not Working

1. **Check Deployment Logs** - Look for errors after "Build completed"
2. **Try Vercel CLI**:
   ```bash
   cd med-rank-flow-admin
   npm install -g vercel
   vercel login
   vercel --prod
   ```
3. **Contact Vercel Support** - They can check server-side logs

## 📝 Current Configuration

**vercel.json** (simplified):
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This lets Vercel auto-detect everything else (Vite framework, build command, output directory).

## ✅ Expected Behavior

After fixing:
1. Build completes successfully
2. Output is uploaded
3. Deployment status changes to "Ready"
4. You get a deployment URL
5. Site is accessible

If build succeeds but status stays "Building" or "Error", check the deployment logs for post-build errors.

