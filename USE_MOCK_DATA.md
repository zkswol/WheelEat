# 🎯 Alternative: Use Mock Data (No API Key Needed)

**If you cannot enable Places API, use this version with test data!**

This version doesn't need Google API - it uses test/mock data so you can test the frontend.

---

## How to Switch to Mock Version

### Step 1: Backup Original Server

```powershell
cd backend-node
copy server.js server-original.js
```

### Step 2: Use Mock Server

```powershell
copy server-mock.js server.js
```

### Step 3: Restart Server

```powershell
# Stop current server (Ctrl+C)
npm start
```

**That's it!** The server will now use test data instead of Google API.

---

## What You'll Get

- ✅ Server runs without API key
- ✅ Test restaurants data
- ✅ Leaderboard works
- ✅ Cuisine filters work
- ✅ All features work (just with test data)

**Note:** Restaurants shown are examples, not real data from Google.

---

## Switch Back to Real API

When you get your API key working:

```powershell
cd backend-node
copy server-original.js server.js
# Add your API key to .env
npm start
```

---

## Quick Command

**To use mock version right now:**

```powershell
cd backend-node
copy server-mock.js server.js
npm start
```

Then refresh your frontend - it should work!

