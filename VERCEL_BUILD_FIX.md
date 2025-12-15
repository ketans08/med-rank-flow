# Vercel Build Fix - Path Resolution Issue

## Problem

Vercel build fails with:
```
Could not load /vercel/path0/med-rank-flow-admin/src/lib/utils
ENOENT: no such file or directory
```

## Root Cause

Vite is resolving `@/lib/utils` alias but not adding the `.ts` extension automatically in Vercel's build environment.

## Solution

### Option 1: Ensure Root Directory is Set Correctly (Recommended)

In Vercel Dashboard for each project:

1. **Admin App:**
   - Go to Settings → General
   - Set **Root Directory:** `med-rank-flow-admin`
   - Save

2. **Student App:**
   - Go to Settings → General  
   - Set **Root Directory:** `med-rank-flow-student`
   - Save

This ensures Vercel runs commands from the correct directory.

### Option 2: Update Imports (If Option 1 doesn't work)

If the issue persists, we may need to update imports to include `.ts` extension:

Change:
```typescript
import { cn } from "@/lib/utils"
```

To:
```typescript
import { cn } from "@/lib/utils.ts"
```

But this requires updating all 44+ component files.

### Option 3: Use Relative Imports (Last Resort)

If alias resolution continues to fail, use relative imports:
```typescript
import { cn } from "../../lib/utils"
```

## Current Configuration

✅ `vite.config.ts` - Properly configured with:
- ES module `__dirname` using `fileURLToPath(import.meta.url)`
- Alias: `"@": path.resolve(__dirname, "src")`
- Extensions: `[".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"]`

✅ `tsconfig.app.json` - Configured with:
- `allowImportingTsExtensions: false`
- Path alias: `"@/*": ["./src/*"]`

✅ `vercel.json` - Basic configuration

## Verification Steps

1. **Check Vercel Root Directory:**
   - Admin: Settings → Root Directory = `med-rank-flow-admin`
   - Student: Settings → Root Directory = `med-rank-flow-student`

2. **Verify Build Locally:**
   ```bash
   cd med-rank-flow-admin
   npm run build
   # Should succeed
   ```

3. **Check Vercel Build Logs:**
   - Look for path resolution errors
   - Verify it's running from correct directory

## Most Likely Fix

**Set Root Directory in Vercel Dashboard** - This is the most common cause of this error. Vercel needs to know which subdirectory contains the app.

## If Still Failing

1. Check Vercel build logs for exact error path
2. Verify the file exists at that path
3. Try removing `vercel.json` and let Vercel auto-detect
4. Contact Vercel support with build logs

