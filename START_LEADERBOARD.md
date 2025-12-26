# 🚀 How to Start the Leaderboard

## Ports to Open/Use

### **Backend Server: PORT 8001**
- **URL:** http://localhost:8001
- **Health Check:** http://localhost:8001/health
- **All Restaurants:** http://localhost:8001/restaurants
- **Filtered:** http://localhost:8001/restaurants/chinese

### **Frontend: No Port (or PORT 8080 if using server)**
- **Direct:** Open `frontend-leaderboard\index.html` in browser
- **With Server:** http://localhost:8080 (optional)

---

## Quick Start Guide

### Step 1: Add Your Google API Key

**Option A: Run the helper script**
```bash
.\create_env.bat
```

**Option B: Create manually**
1. Open `backend-node` folder
2. Create a file named `.env`
3. Add this content:
```
GOOGLE_API_KEY=your_actual_api_key_here
PORT=8001
```

**Get API Key:**
- Visit: https://console.cloud.google.com/google/maps-apis
- Enable "Places API" and "Maps JavaScript API"
- Create API key from Credentials section

### Step 2: Start Backend Server

Open a terminal/PowerShell and run:
```powershell
cd backend-node
npm start
```

**You should see:**
```
========================================
WheelEat Node.js Backend Server
========================================
Server running on http://localhost:8001
Google API Key configured: Yes
========================================
```

**Keep this window open!** The server needs to keep running.

### Step 3: Open Frontend

**Method 1: Direct Open (Easiest)**
- Navigate to `frontend-leaderboard` folder
- Double-click `index.html`
- It will open in your default browser

**Method 2: Using Local Server (Recommended)**
Open a **NEW** terminal/PowerShell window:
```powershell
cd frontend-leaderboard
python -m http.server 8080
```
Then open: http://localhost:8080

---

## What You'll See

### In Browser (Frontend):
- **Leaderboard** showing restaurants ranked by review score
- **Filter buttons** for different cuisines (Chinese, Japanese, etc.)
- Each restaurant shows:
  - Rank (#1, #2, etc.)
  - Photo
  - Name
  - Rating (stars)
  - Review Count
  - Review Score

### In Terminal (Backend):
- Server logs
- API request logs
- Any errors (if they occur)

---

## Testing

### Test Backend API:
1. Open browser
2. Go to: http://localhost:8001/health
3. Should see: `{"status":"ok","message":"WheelEat Node.js Backend is running",...}`

### Test Restaurants:
1. Go to: http://localhost:8001/restaurants
2. Should see JSON with restaurant data

### Test Frontend:
1. Open the HTML file
2. Should see leaderboard loading
3. Click cuisine filters to test

---

## Troubleshooting

### "Google API key not configured"
- Make sure `.env` file exists in `backend-node` folder
- Check that `GOOGLE_API_KEY=your_key` is set correctly
- Restart the backend server

### "Cannot connect to backend"
- Make sure backend is running on port 8001
- Check that no firewall is blocking it
- Verify: http://localhost:8001/health works

### "Failed to fetch restaurants"
- Check your Google API key is valid
- Make sure Places API is enabled in Google Cloud Console
- Check backend terminal for error messages

---

## Summary

**To Run Everything:**

1. **Add API key** → Edit `backend-node\.env`
2. **Start backend** → `cd backend-node && npm start` (PORT 8001)
3. **Open frontend** → Double-click `frontend-leaderboard\index.html`

**That's it!** 🎉

