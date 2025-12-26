# ⚡ Deploy Backend to Vercel (Free + Easy!)

Great news! I've configured your backend to work on Vercel as serverless functions. This is **100% free** and works perfectly with your frontend!

---

## ✅ What I've Done

- ✅ Created `api/index.py` - Vercel serverless function wrapper
- ✅ Updated database to use `/tmp` directory (Vercel-compatible)
- ✅ Updated CORS settings for Vercel
- ✅ Updated `vercel.json` to route API calls
- ✅ Added `mangum` for FastAPI → Vercel compatibility

---

## 🚀 Deployment Steps

### Step 1: Install Mangum Dependency

The backend needs `mangum` to work with Vercel. I've already added it, but make sure it's installed locally:

```powershell
cd backend
pip install mangum==0.17.0
```

---

### Step 2: Commit and Push Changes

```powershell
# Make sure you're in the WheelEat root
cd C:\Users\User\Documents\SpinWheel\WheelEat

# Add new files
git add api/ vercel.json backend/main.py backend/database.py backend/requirements.txt

# Commit
git commit -m "Add Vercel serverless backend support"

# Push to GitHub
git push origin host
```

---

### Step 3: Update Vercel Settings

Since you already have Vercel connected to your repo, it should auto-deploy. But we need to update settings:

1. **Go to Vercel Dashboard:**
   - https://vercel.com/ybtan6666s-projects/wheeleat/settings

2. **Update Build Settings:**
   - Go to **"General"** tab
   - Scroll to **"Build & Development Settings"**
   - **Root Directory:** Should be empty (root of repo) or `frontend` (for frontend only)
   - Since we have both frontend and backend, we'll keep it at root

3. **Add Environment Variables:**
   - Go to **"Environment Variables"** tab
   - Add:
     - Name: `FRONTEND_URL`
     - Value: `https://wheeleat.vercel.app`
     - Environment: Production, Preview, Development

---

### Step 4: Deploy or Redeploy

**Option A: Auto-Deploy (if connected to GitHub)**
- Just push to GitHub, Vercel will auto-deploy!

**Option B: Manual Deploy**
```powershell
cd C:\Users\User\Documents\SpinWheel\WheelEat
vercel --prod
```

---

### Step 5: Update Frontend API URL

1. **In Vercel Dashboard:**
   - Go to: https://vercel.com/ybtan6666s-projects/wheeleat/settings
   - **Environment Variables** tab
   - Add:
     - Name: `REACT_APP_API_URL`
     - Value: `https://wheeleat.vercel.app` (same as frontend!)
     - Environment: Production, Preview, Development

2. **Redeploy Frontend:**
   - Go to **"Deployments"** tab
   - Click **"⋯"** → **"Redeploy"**

---

## 🎯 How It Works

- **Frontend:** Served from `frontend/build` folder
- **Backend API:** Routes like `/api/malls`, `/api/restaurants`, etc. go to `api/index.py`
- **All on one domain:** `https://wheeleat.vercel.app`
- **API endpoints:** `https://wheeleat.vercel.app/api/*`

---

## ✅ Test Your Deployment

1. **Test Backend:**
   - Visit: `https://wheeleat.vercel.app/api/malls`
   - Should return JSON with malls data

2. **Test Root API:**
   - Visit: `https://wheeleat.vercel.app/api/`
   - Should return: `{"message":"WheelEat API is running","status":"ok"}`

3. **Test Frontend:**
   - Visit: `https://wheeleat.vercel.app`
   - Try spinning the wheel - it should work!

---

## 📝 File Structure

```
WheelEat/
├── api/
│   ├── index.py          ← Vercel serverless function (NEW!)
│   └── requirements.txt  ← Python deps for Vercel (NEW!)
├── backend/
│   ├── main.py           ← Your FastAPI app
│   ├── database.py       ← Database setup (updated for Vercel)
│   └── requirements.txt  ← Full dependencies
├── frontend/
│   └── ...               ← React frontend
└── vercel.json           ← Updated config
```

---

## ⚠️ Important Notes

### Database (SQLite)

- SQLite database is stored in `/tmp` directory in Vercel
- **Note:** Each serverless function invocation is stateless
- Database persists during a function's lifetime but may reset between cold starts
- For production with persistent data, consider:
  - **Free option:** Use a free PostgreSQL database (Supabase, Neon, etc.)
  - **Current:** Works fine for testing and moderate usage

### CORS

- Already configured to allow your Vercel frontend
- Should work automatically

---

## 🔧 Troubleshooting

### API returns 500 error
- Check Vercel function logs: Dashboard → Deployments → Click deployment → Functions → `api/index.py` → Logs

### Database errors
- SQLite in `/tmp` should work, but check logs if issues persist
- Consider switching to a cloud database if you need persistence

### CORS errors
- Verify `FRONTEND_URL` environment variable is set correctly
- Check browser console for specific CORS error messages

---

## 🎉 Benefits of Vercel Backend

- ✅ **100% Free** (generous free tier)
- ✅ **Same domain** as frontend (no CORS issues)
- ✅ **Auto-scales** with traffic
- ✅ **Fast** - serverless functions are quick
- ✅ **Easy** - deploy everything together

---

## 📋 Quick Checklist

- [ ] Install mangum: `pip install mangum==0.17.0`
- [ ] Commit and push changes to GitHub
- [ ] Add `FRONTEND_URL` environment variable in Vercel
- [ ] Add `REACT_APP_API_URL` environment variable in Vercel (same as frontend URL)
- [ ] Deploy/Redeploy
- [ ] Test API endpoints
- [ ] Test frontend connection

---

**Ready to deploy?** Just commit, push, and Vercel will handle the rest! 🚀

