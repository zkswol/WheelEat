# 🔧 Fix: Frontend Cannot Load

## Problem
- Frontend cannot load/fails to open
- Backend server is not running
- Missing .env file with API key

## Solution

### Step 1: Create .env File

**Create this file:** `backend-node\.env`

**Content:**
```
GOOGLE_API_KEY=your_google_api_key_here
PORT=8001
```

**To get API key:**
1. Visit: https://console.cloud.google.com/google/maps-apis
2. Enable "Places API" and "Maps JavaScript API"
3. Create API key from Credentials section
4. Replace `your_google_api_key_here` with your actual key

### Step 2: Start Backend

Open PowerShell and run:
```powershell
cd C:\Users\User\Documents\SpinWheel\WheelEat\backend-node
npm start
```

**Wait for this message:**
```
Server running on http://localhost:8001
Google API Key configured: Yes
```

**Keep this window open!**

### Step 3: Open Frontend

**Option A: Use the helper script**
```powershell
.\START_EVERYTHING.bat
```

**Option B: Manual**
1. Navigate to: `frontend-leaderboard` folder
2. Double-click: `index.html`
3. It will open in your browser

**Full path:**
```
C:\Users\User\Documents\SpinWheel\WheelEat\frontend-leaderboard\index.html
```

### Step 4: Test

1. **Test backend:** Open http://localhost:8001/health in browser
2. **Test frontend:** Should show leaderboard with restaurants

## Quick Fix Commands

**In PowerShell:**
```powershell
# 1. Go to project folder
cd C:\Users\User\Documents\SpinWheel\WheelEat

# 2. Start backend (in new window)
cd backend-node
npm start

# 3. In another window, open frontend
start frontend-leaderboard\index.html
```

## Files Location

- **Frontend:** `C:\Users\User\Documents\SpinWheel\WheelEat\frontend-leaderboard\index.html`
- **Backend:** `C:\Users\User\Documents\SpinWheel\WheelEat\backend-node\`
- **.env file:** `C:\Users\User\Documents\SpinWheel\WheelEat\backend-node\.env` (CREATE THIS!)

## Troubleshooting

### "Failed to fetch restaurants"
- ✅ Backend must be running on port 8001
- ✅ Check: http://localhost:8001/health works
- ✅ Make sure .env has valid API key

### "Cannot open index.html"
- ✅ Right-click → Open with → Browser
- ✅ Or use: `start frontend-leaderboard\index.html`

### "Port 8001 already in use"
- ✅ Close other programs using port 8001
- ✅ Or change PORT in .env file to 8002

