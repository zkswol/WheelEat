# 🚀 Quick Start Guide - Leaderboard Setup

## ✅ What's Already Done

- ✅ Backend dependencies installed
- ✅ Frontend files ready
- ⚠️ **You need to add your Google API key**

## 📝 Step-by-Step Setup

### Step 1: Get Google API Key (5 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → Create a new project or select existing
3. Go to **APIs & Services** → **Library**
4. Search for "**Places API**" → Click → **Enable**
5. Search for "**Maps JavaScript API**" → Click → **Enable**
6. Go to **APIs & Services** → **Credentials**
7. Click **"Create Credentials"** → **"API Key"**
8. Copy your API key (it will look like: `AIzaSy...`)

### Step 2: Create .env File

**Option A: Use PowerShell Script (Easiest)**
```powershell
.\setup_env.ps1
```
Follow the prompts to enter your API key.

**Option B: Create Manually**

Create a file named `.env` in the `backend-node` folder with this content:
```
GOOGLE_API_KEY=AIzaSyYourActualApiKeyHere
PORT=8001
```

Replace `AIzaSyYourActualApiKeyHere` with your actual API key.

### Step 3: Start Backend Server

Open a terminal/PowerShell and run:
```powershell
cd backend-node
npm start
```

You should see:
```
========================================
WheelEat Node.js Backend Server
========================================
Server running on http://localhost:8001
Google API Key configured: Yes
========================================
```

**Keep this window open!** The server needs to keep running.

### Step 4: Open Frontend

**Option A: Direct Open (Simple)**
- Double-click `frontend-leaderboard/index.html`
- Or right-click → Open with → Your browser

**Option B: Using Local Server (Recommended)**

Open a **new terminal/PowerShell** window and run:
```powershell
cd frontend-leaderboard
python -m http.server 8080
```

Then open your browser and go to: `http://localhost:8080`

### Step 5: Test It!

1. The leaderboard should load automatically
2. Try clicking different cuisine filters (Chinese, Japanese, etc.)
3. You should see restaurants ranked by review score

## 🎯 Quick Commands

**Start Backend:**
```powershell
cd backend-node
npm start
```

**Test Backend (in browser):**
- http://localhost:8001/health
- http://localhost:8001/restaurants

**Open Frontend:**
- Double-click `frontend-leaderboard/index.html`

## ❌ Troubleshooting

### Backend won't start
- Make sure `.env` file exists in `backend-node` folder
- Check that `GOOGLE_API_KEY` is set correctly
- Make sure port 8001 is not already in use

### Frontend shows "Error: Failed to fetch restaurants"
- Make sure backend is running on http://localhost:8001
- Check browser console (F12) for detailed errors
- Verify your Google API key is correct

### No restaurants showing
- Check that Places API is enabled in Google Cloud Console
- Verify your API key has proper permissions
- Check backend terminal for error messages

### Photos not showing
- Some restaurants may not have photos
- Make sure Place Photo API is enabled (optional)

## 📁 Project Structure

```
WheelEat/
├── backend-node/          ← Node.js backend
│   ├── server.js         ← Main server file
│   ├── package.json      ← Dependencies
│   ├── .env             ← Your API key (create this!)
│   └── node_modules/    ← Dependencies (already installed)
│
└── frontend-leaderboard/ ← Simple HTML frontend
    ├── index.html       ← Main page
    ├── styles.css       ← Styling
    └── script.js        ← JavaScript logic
```

## 🎉 That's It!

Once you have your API key and the backend is running, everything should work!

For detailed documentation, see:
- `LEADERBOARD_SETUP.md` - Detailed setup guide
- `backend-node/README.md` - Backend API documentation
- `frontend-leaderboard/README.md` - Frontend documentation

