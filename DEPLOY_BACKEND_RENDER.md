# 🎨 Deploy Backend to Render (Alternative)

Render is another great free option for FastAPI apps.

---

## 🎯 Quick Steps

### Step 1: Create Render Account

1. Go to: **https://render.com**
2. Click **"Get Started for Free"**
3. Sign up with GitHub

---

### Step 2: Create New Web Service

1. **In Render Dashboard:**
   - Click **"New +"** → **"Web Service"**
   - Connect your GitHub repository: `zkswol/WheelEat`

2. **Configure Service:**
   - **Name:** `wheeleat-backend` (or any name)
   - **Region:** Choose closest to you
   - **Branch:** `host` (or your branch)
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Add Environment Variables:**
   - `FRONTEND_URL` = `https://wheeleat.vercel.app`
   - `PYTHON_VERSION` = `3.12.0`

4. **Click "Create Web Service"**

---

### Step 3: Get Backend URL

- Render gives you a URL like: `https://wheeleat-backend.onrender.com`
- **Copy this URL!**

---

### Step 4: Update Frontend

1. **In Vercel Dashboard:**
   - Go to: https://vercel.com/ybtan6666s-projects/wheeleat/settings
   - **Environment Variables** → Add:
     - Name: `REACT_APP_API_URL`
     - Value: `https://your-backend-url.onrender.com`
     - Environment: Production, Preview, Development

2. **Redeploy Frontend**

---

## ✅ Verify

- Backend: `https://your-backend-url.onrender.com/` should return JSON
- Frontend: Should connect to backend successfully

---

## 💰 Pricing

- **Free Tier:** 750 hours/month (enough for 24/7 small app)
- **Sleeps after 15 min inactivity** (free tier)

---

**Recommended:** Use Railway if possible (better for always-on apps)

