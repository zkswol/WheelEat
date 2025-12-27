# Fix: Cloudflare Pages Functions Cannot Resolve @supabase/supabase-js

## Problem

Cloudflare Pages Functions is trying to bundle your code but can't find the `@supabase/supabase-js` dependency:

```
✘ [ERROR] Could not resolve "@supabase/supabase-js"
```

## Root Cause

Cloudflare Pages Functions **does not automatically install npm dependencies** from `functions/package.json`. You need to add a build command to install them.

## Solution

Add a minimal build command in Cloudflare Pages dashboard:

### Step 1: Go to Cloudflare Pages Dashboard

1. Navigate to your project in Cloudflare Pages
2. Go to **Settings** → **Builds & deployments**

### Step 2: Add Build Command

Set the **Build command** to:
```bash
cd functions && npm install && cd ../frontend && npm install && npm run build
```

This command:
- Installs Functions dependencies (`cd functions && npm install`)
- Installs frontend dependencies (`cd ../frontend && npm install`)
- Builds the React frontend (`npm run build`)
- Creates the `frontend/build` directory that Cloudflare needs

### Step 3: Configure Build Output Directory

Set **Build output directory** to:
```
frontend/build
```

This tells Cloudflare where the built frontend files are located.

### Step 4: Save and Redeploy

1. Click **Save**
2. Cloudflare will automatically trigger a new deployment
3. The build should now succeed

## Why This Is Needed

Cloudflare Pages Functions requires:
1. **Functions dependencies** to be installed (for API endpoints)
2. **Frontend to be built** (React needs to be compiled to static files)

The build command handles both requirements, creating the necessary files for deployment.

## Alternative: Pre-commit node_modules (Not Recommended)

You could commit `functions/node_modules` to the repository, but this is:
- ❌ Not recommended (large files, version control issues)
- ❌ Slows down git operations
- ✅ The build command approach is cleaner

## Verification

After deploying, check the build logs. You should see:
- ✅ "Installing dependencies in functions directory"
- ✅ "Building Pages Functions"
- ✅ No "Could not resolve" errors

