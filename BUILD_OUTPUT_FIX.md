# Fix: Build Output Directory Not Found

## Problem

Cloudflare Pages is looking for the build output directory `frontend/build` but it doesn't exist:

```
Error: Output directory "frontend/build" not found.
```

## Solution

Update your build command in Cloudflare Pages to also build the frontend:

### Step 1: Update Build Command

In Cloudflare Pages dashboard → Settings → Builds & deployments:

**Change Build command from:**
```bash
cd functions && npm install
```

**To:**
```bash
cd functions && npm install && cd ../frontend && npm install && npm run build
```

This command:
1. Installs Functions dependencies (`cd functions && npm install`)
2. Installs frontend dependencies (`cd ../frontend && npm install`)
3. Builds the frontend (`npm run build`)

### Step 2: Verify Build Output Directory

Make sure **Build output directory** is set to:
```
frontend/build
```

### Step 3: Save and Redeploy

1. Click **Save**
2. Cloudflare will automatically trigger a new deployment
3. The build should now succeed

## What This Does

The updated build command:
- ✅ Installs Functions dependencies (needed for API endpoints)
- ✅ Installs frontend dependencies (needed for React build)
- ✅ Builds the React frontend (creates `frontend/build` directory)
- ✅ Cloudflare serves the built files from `frontend/build`

## Alternative: Pre-build and Commit (Not Recommended)

You could build the frontend locally and commit `frontend/build`:
```bash
cd frontend
npm install
npm run build
git add frontend/build
git commit -m "Add frontend build"
git push
```

However, this is not recommended because:
- ❌ Build files shouldn't be in version control
- ❌ You have to rebuild and commit every time you change the frontend
- ✅ Building during deployment is cleaner and more maintainable

## Verification

After deploying, check the build logs. You should see:
- ✅ "Installing dependencies in functions directory"
- ✅ "Installing dependencies in frontend directory"
- ✅ "Building frontend"
- ✅ "Validating asset output directory" (should find `frontend/build`)
- ✅ Deployment successful

