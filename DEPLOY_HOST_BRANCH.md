# 🚀 Deploy WheelEat 'host' Branch to Vercel

## Current Situation
- You're stuck at Vercel CLI asking to "Link to existing project?"
- You want to deploy the **WheelEat 'host' branch** (not crud-app)

---

## ✅ Solution: Deploy WheelEat Host Branch

### Step 1: Exit Current Vercel Process

Press `Ctrl + C` in your terminal to cancel the current Vercel process.

### Step 2: Navigate to WheelEat Root

```powershell
cd C:\Users\User\Documents\SpinWheel\WheelEat
```

### Step 3: Switch to Host Branch

```powershell
git checkout host
```

### Step 4: Verify You're on Host Branch

```powershell
git branch
```

You should see `* host` selected.

### Step 5: Deploy to Vercel

```powershell
vercel
```

When prompted:
- **Set up and deploy?** → Type `yes`
- **Which scope?** → Select your scope
- **Link to existing project?** → Type `no` (create NEW project)
- **Project name?** → Type something like `wheeleat` or `wheeleat-host`
- **Directory?** → Press Enter (use current directory)
- **Override settings?** → Type `no`

---

## ⚠️ Important: WheelEat Structure

WheelEat has:
- **Frontend**: React app in `frontend/` folder
- **Backend**: FastAPI (Python) in `backend/` folder

### Option A: Deploy Frontend Only (Recommended for Vercel)

Vercel is great for React frontends. For the backend, you might need:
- Railway
- Render
- Or keep backend separate

**Deploy frontend:**
```powershell
cd frontend
vercel
```

### Option B: Create vercel.json for Full Project

If you want to deploy both, you'll need to configure Vercel differently.

---

## 📝 Quick Commands

```powershell
# 1. Exit current process (Ctrl+C)
# 2. Go to WheelEat root
cd C:\Users\User\Documents\SpinWheel\WheelEat

# 3. Switch to host branch
git checkout host

# 4. Deploy frontend
cd frontend
vercel

# When asked "Link to existing project?" → Type: no
```

---

## 🎯 What to Answer in Vercel CLI

| Question | Answer |
|----------|--------|
| Set up and deploy? | `yes` |
| Which scope? | Select your scope |
| **Link to existing project?** | **`no`** ⬅️ This is key! |
| What's your project's name? | `wheeleat` or any name |
| In which directory is your code located? | **Just press Enter** (or type `./`) ⬅️ Uses current directory |

---

## 🔧 If You Already Have a Vercel Project

If you want to link to an existing project instead:

1. First, go to vercel.com dashboard
2. Note your project name
3. When asked "Link to existing project?", type `yes`
4. Select your project from the list

---

## 📚 Next Steps After Deployment

1. Add environment variables in Vercel dashboard
2. Configure build settings if needed
3. Set up backend separately (if needed)

---

**Need help?** Let me know what happens after you follow these steps!

