# 🚂 Deploy Backend to Railway (Easiest - Recommended)

Railway is perfect for FastAPI apps with databases. Free tier available!

---

## 🎯 Quick Steps

### Step 1: Create Railway Account

1. Go to: **https://railway.app**
2. Click **"Start a New Project"**
3. Sign up with GitHub (easiest)

---

### Step 2: Deploy Backend

#### Option A: Deploy from GitHub (Recommended)

1. **Push backend to GitHub** (if not already):
   ```powershell
   git add backend/
   git commit -m "Add backend for deployment"
   git push origin host
   ```

2. **In Railway Dashboard:**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose your repository: `zkswol/WheelEat`
   - Railway will auto-detect it's Python

3. **Configure Settings:**
   - **Root Directory:** Set to `backend`
   - **Build Command:** Leave default (auto-detects)
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Add Environment Variable:**
   - Click on your service
   - Go to **"Variables"** tab
   - Add: `FRONTEND_URL` = `https://wheeleat.vercel.app`

5. **Get Your Backend URL:**
   - Go to **"Settings"** tab
   - Scroll to **"Domains"**
   - Railway gives you a URL like: `https://your-app.railway.app`
   - **Copy this URL!**

---

#### Option B: Deploy via Railway CLI

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Deploy
railway up

# Set environment variable
railway variables set FRONTEND_URL=https://wheeleat.vercel.app
```

---

### Step 3: Update Frontend to Use Backend URL

1. **In Vercel Dashboard:**
   - Go to your frontend project: https://vercel.com/ybtan6666s-projects/wheeleat/settings
   - Click **"Environment Variables"**
   - Add:
     - Name: `REACT_APP_API_URL`
     - Value: `https://your-backend-url.railway.app` (from Step 2)
     - Environment: Production, Preview, Development

2. **Redeploy Frontend:**
   - Go to **"Deployments"** tab
   - Click **"⋯"** → **"Redeploy"**

---

## ✅ Verify Deployment

1. **Test Backend:**
   - Visit: `https://your-backend-url.railway.app/`
   - Should see: `{"message":"WheelEat API is running","status":"ok"}`

2. **Test Frontend:**
   - Visit: https://wheeleat.vercel.app
   - Try spinning the wheel - it should work!

---

## 🗄️ Database (SQLite)

SQLite file is stored in Railway's filesystem. For production, you might want to:
- Upgrade to PostgreSQL (Railway supports this)
- Or keep SQLite (works fine for moderate usage)

---

## 💰 Pricing

- **Free Tier:** $5 credit/month (enough for small apps)
- **Paid:** Pay-as-you-go after free credit

---

## 🔍 Troubleshooting

**Backend not starting?**
- Check Railway logs: Click on your service → "Logs"
- Verify `Procfile` exists in `backend/` folder
- Check Python version matches `runtime.txt`

**CORS errors?**
- Make sure `FRONTEND_URL` environment variable is set correctly
- Verify frontend URL in CORS settings matches your Vercel URL

**Database errors?**
- SQLite file should be created automatically
- If issues, check Railway logs for database errors

---

## 📝 Summary

1. ✅ Create Railway account
2. ✅ Deploy backend from GitHub
3. ✅ Set Root Directory to `backend`
4. ✅ Add `FRONTEND_URL` environment variable
5. ✅ Get backend URL from Railway
6. ✅ Add `REACT_APP_API_URL` to Vercel environment variables
7. ✅ Redeploy frontend
8. ✅ Test everything works!

---

**Need help?** Check Railway logs or Vercel deployment logs for errors.

