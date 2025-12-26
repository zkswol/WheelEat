# 🔧 Fix 404 on All Endpoints

## ✅ What Was Done

Created all missing endpoints:
- ✅ `api/malls.js`
- ✅ `api/categories.js`
- ✅ `api/restaurants.js`
- ✅ `api/spin.js`
- ✅ `api/lib/restaurants.js` (shared data)

All files are committed and pushed to GitHub.

---

## 🔍 Troubleshooting Steps

### Step 1: Verify Vercel Deployment (CRITICAL)

1. Go to https://vercel.com/dashboard
2. Click on your backend project
3. Go to **"Deployments"** tab
4. Check the **latest deployment**:
   - ✅ Is it successful (green)?
   - ❌ Is it failed (red)?

**If deployment failed:**
- Click on the failed deployment
- Check **"View Function Logs"** or **"View Build Logs"**
- Look for errors

**If deployment succeeded:**
- The files should be deployed
- Continue to Step 2

---

### Step 2: Verify Root Directory Setting

1. Vercel Dashboard → Your Project → **Settings** → **General**
2. Check **"Root Directory"**
3. **Must be:** `.` (single dot) or **EMPTY**
4. **NOT:** `frontend` or anything else

**If wrong:**
- Change to `.`
- Save
- Redeploy

---

### Step 3: Check Deployment Logs

1. Go to **Deployments** tab
2. Click on latest deployment
3. Check logs for:
   - ✅ "Building Serverless Functions"
   - ✅ "api/malls.js", "api/categories.js", etc. mentioned
   - ❌ Any errors about missing files or syntax errors

---

### Step 4: Force Redeploy

Even if deployment shows success, try redeploying:

1. Go to **Deployments** tab
2. Click **"..."** on latest deployment
3. Click **"Redeploy"**
4. Wait 1-2 minutes
5. Test endpoints again

---

### Step 5: Test Endpoints Directly

Test these URLs in your browser:

1. **Health endpoint:**
   ```
   https://wheeleat-ml5qmrsel-ybtan6666s-projects.vercel.app/api/health
   ```
   Should return: `{"status":"ok",...}`

2. **Malls endpoint:**
   ```
   https://wheeleat-ml5qmrsel-ybtan6666s-projects.vercel.app/api/malls
   ```
   Should return: `{"malls":[{"id":"sunway_square",...}]}`

3. **Categories endpoint:**
   ```
   https://wheeleat-ml5qmrsel-ybtan6666s-projects.vercel.app/api/categories
   ```
   Should return: `{"categories":[...]}`

---

## 🔍 Common Issues

### Issue 1: Deployment Not Triggered

**Symptom:** Changes pushed but Vercel didn't deploy

**Solution:**
- Check if Vercel is connected to GitHub
- Check if auto-deploy is enabled
- Manually trigger redeploy

### Issue 2: Build Errors

**Symptom:** Deployment shows errors in logs

**Solution:**
- Check build logs for syntax errors
- Verify all files are present
- Check for import errors

### Issue 3: Root Directory Wrong

**Symptom:** Endpoints return 404

**Solution:**
- Set Root Directory to `.` or empty
- Redeploy

### Issue 4: Files Not Committed

**Symptom:** Files exist locally but not in GitHub

**Solution:**
- Verify files are pushed: `git log --oneline -5`
- Check GitHub repo to confirm files are there

---

## 📋 Verification Checklist

- [ ] Files are in GitHub repo (check ybtan6666/WheelEat on GitHub)
- [ ] Root Directory is `.` or empty in Vercel Settings
- [ ] Latest deployment is successful (green)
- [ ] Deployment logs show functions being built
- [ ] `/api/health` works (baseline test)
- [ ] Other endpoints work after health check passes

---

## 🆘 If Still 404

**Please check and share:**

1. **Deployment status:** Is it successful or failed?
2. **Root Directory:** What is it set to in Vercel?
3. **Build logs:** Any errors in the logs?
4. **GitHub:** Can you see the files in the repo at `api/malls.js`, etc.?

This will help identify the exact issue!

