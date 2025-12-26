# ⚡ Deploy Backend to Vercel - Complete Setup

## ✅ Configuration Complete!

I've set up your backend to work on Vercel as **serverless functions** - 100% FREE!

---

## 🚀 Quick Deployment Steps

### Step 1: Install Mangum (Local - Optional)

```powershell
cd backend
pip install mangum==0.17.0
```

---

### Step 2: Commit and Push

```powershell
# Make sure you're in WheelEat root
cd C:\Users\User\Documents\SpinWheel\WheelEat

# Add all changes
git add .

# Commit
git commit -m "Add Vercel serverless backend support"

# Push to GitHub
git push origin host
```

---

### Step 3: Update Vercel Environment Variables

1. **Go to Vercel Dashboard:**
   - https://vercel.com/ybtan6666s-projects/wheeleat/settings

2. **Add Environment Variables:**
   - Click **"Environment Variables"** tab
   - Add these two:

   **Variable 1:**
   - Name: `FRONTEND_URL`
   - Value: `https://wheeleat.vercel.app`
   - Environment: ✅ Production ✅ Preview ✅ Development

   **Variable 2:**
   - Name: `REACT_APP_API_URL`
   - Value: `https://wheeleat.vercel.app` (same as frontend!)
   - Environment: ✅ Production ✅ Preview ✅ Development

3. **Click "Save"**

---

### Step 4: Deploy

**Option A: Auto-Deploy (if GitHub connected)**
- Vercel will automatically deploy when you push to GitHub!

**Option B: Manual Deploy**
```powershell
vercel --prod
```

---

## ✅ Test After Deployment

1. **Test API Root:**
   - Visit: `https://wheeleat.vercel.app/api/`
   - Should see: `{"message":"WheelEat API is running","status":"ok"}`

2. **Test Malls Endpoint:**
   - Visit: `https://wheeleat.vercel.app/api/malls`
   - Should return JSON with malls

3. **Test Frontend:**
   - Visit: `https://wheeleat.vercel.app`
   - Try spinning the wheel - should work!

---

## 📁 Files Created/Updated

- ✅ `api/index.py` - Vercel serverless function wrapper
- ✅ `api/requirements.txt` - Python dependencies for Vercel
- ✅ `vercel.json` - Updated with API routing
- ✅ `backend/main.py` - Updated CORS settings
- ✅ `backend/database.py` - Updated for Vercel /tmp directory
- ✅ `backend/requirements.txt` - Added mangum

---

## 🎯 How It Works

- **Frontend:** `https://wheeleat.vercel.app` → Serves React app
- **Backend API:** `https://wheeleat.vercel.app/api/*` → Routes to FastAPI
- **Same domain** = No CORS issues!
- **100% Free** = Vercel's generous free tier

---

## ⚠️ Important Notes

### Database (SQLite)

- Database stored in `/tmp` directory in Vercel serverless functions
- **Note:** Each function invocation is stateless
- Database may reset between cold starts (serverless limitation)
- **For persistent data:** Consider upgrading to a cloud database later
- **For now:** Works great for testing and moderate usage!

### Cold Starts

- First request after inactivity may be slower (2-3 seconds)
- Subsequent requests are fast
- This is normal for serverless functions

---

## 🔧 Troubleshooting

### 500 Error on API calls

1. **Check Vercel Logs:**
   - Dashboard → Deployments → Latest deployment
   - Click "Functions" → `api/index.py` → "Logs"
   - Look for Python errors

2. **Common Issues:**
   - Missing dependencies: Check `api/requirements.txt`
   - Import errors: Check Python path in `api/index.py`

### Database errors

- SQLite in `/tmp` should work
- If issues persist, consider using a cloud database

---

## 🎉 Benefits

- ✅ **100% Free** - Vercel's free tier is very generous
- ✅ **Same domain** - Frontend and backend on one URL
- ✅ **Auto-scales** - Handles traffic automatically
- ✅ **Fast** - Serverless functions are quick after cold start
- ✅ **Easy** - Everything in one deployment

---

## 📋 Checklist

- [ ] Install mangum: `pip install mangum==0.17.0`
- [ ] Commit and push changes to GitHub
- [ ] Add `FRONTEND_URL` environment variable in Vercel
- [ ] Add `REACT_APP_API_URL` environment variable in Vercel
- [ ] Deploy (auto or manual)
- [ ] Test API endpoints
- [ ] Test frontend connection
- [ ] Spin the wheel! 🎰

---

**Ready?** Just commit, push, and Vercel will deploy automatically! 🚀

