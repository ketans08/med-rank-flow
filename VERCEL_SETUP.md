# Vercel Setup - Critical Configuration

## ⚠️ IMPORTANT: Root Directory Setting

The build error is most likely caused by **incorrect Root Directory** in Vercel settings.

### For Admin App

1. Go to Vercel Dashboard
2. Select your **Admin** project
3. Go to **Settings** → **General**
4. Scroll to **Root Directory**
5. Set to: `med-rank-flow-admin`
6. Click **Save**
7. **Redeploy** the project

### For Student App

1. Go to Vercel Dashboard
2. Select your **Student** project
3. Go to **Settings** → **General**
4. Scroll to **Root Directory**
5. Set to: `med-rank-flow-student`
6. Click **Save**
7. **Redeploy** the project

## Why This Matters

When Root Directory is not set:
- Vercel runs `npm install` and `npm run build` from repository root
- Path aliases (`@/lib/utils`) resolve incorrectly
- Vite can't find files because it's looking in the wrong directory

When Root Directory is set correctly:
- Vercel runs commands from the app directory
- Path aliases resolve correctly
- Build succeeds

## Verification

After setting Root Directory, check build logs:
- Should see: `Running "install" command: npm install` (from correct directory)
- Should see: `Running "build" command: npm run build` (from correct directory)
- Build should succeed

## Alternative: If Root Directory Doesn't Work

If setting Root Directory doesn't fix it, the issue might be Vite's path resolution. In that case, we may need to:

1. Update all imports to use `.ts` extension
2. Or use relative imports instead of aliases

But **99% of the time, Root Directory is the issue.**

## Current Status

✅ Code is correct
✅ vite.config.ts is properly configured
✅ Builds work locally
❌ Vercel needs Root Directory configured

**Next Step:** Set Root Directory in Vercel Dashboard for both projects!

