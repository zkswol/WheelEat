# 🔧 URGENT FIX: Add Your Google API Key

## The Problem
- Backend is running ✅
- But API key is invalid ❌
- Error: "REQUEST_DENIED" or "Failed to fetch restaurants"

## The Solution

### Step 1: Get Your Google API Key (5 minutes)

1. **Visit:** https://console.cloud.google.com/
2. **Create or select a project**
3. **Enable APIs:**
   - Go to "APIs & Services" → "Library"
   - Search for "**Places API**" → Click → **Enable**
   - Search for "**Maps JavaScript API**" → Click → **Enable**
4. **Create API Key:**
   - Go to "APIs & Services" → "Credentials"
   - Click "**Create Credentials**" → "**API Key**"
   - **Copy the key** (it looks like: `AIzaSy...`)

### Step 2: Add API Key to .env File

1. **Open:** `backend-node\.env`
2. **Find this line:**
   ```
   GOOGLE_API_KEY=YOUR_API_KEY_HERE
   ```
3. **Replace with your actual key:**
   ```
   GOOGLE_API_KEY=AIzaSyYourActualKeyHere
   ```
4. **Save the file**

### Step 3: Restart Backend Server

1. **Go to the backend PowerShell window** (where npm start is running)
2. **Press:** `Ctrl+C` to stop the server
3. **Run again:**
   ```powershell
   npm start
   ```
4. **Wait for:** `Server running on http://localhost:8001`

### Step 4: Refresh Frontend

1. **Refresh your browser** (F5 or Ctrl+R)
2. **The leaderboard should now load!**

## Quick Commands

```powershell
# 1. Edit .env file
notepad backend-node\.env

# 2. After adding API key, restart:
cd backend-node
npm start
```

## Verification

**Test if API key works:**
- Open: http://localhost:8001/restaurants
- Should see restaurant data (JSON)
- If you see error, API key is still invalid

## Common Issues

### "REQUEST_DENIED"
- ✅ API key is invalid or not set correctly
- ✅ Places API might not be enabled
- **Fix:** Check API key and enable Places API

### "OVER_QUERY_LIMIT"
- ✅ You've exceeded free quota
- **Fix:** Check Google Cloud billing/quota

### "Failed to fetch"
- ✅ Backend not running
- ✅ Wrong port
- **Fix:** Make sure backend is running on port 8001

## Need Help?

1. Check backend terminal for error messages
2. Open browser console (F12) for frontend errors
3. Test: http://localhost:8001/health (should work)
4. Test: http://localhost:8001/restaurants (needs valid API key)

