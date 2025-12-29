# Enable Legacy Places API (Quick Fix)

## Problem
The leaderboard shows `"source": "google_places_textsearch_per_restaurant"` but all restaurants have `rating: null` and `reviews: null`.

**Error:** `"You're calling a legacy API, which is not enabled for your project."`

## Solution: Enable Legacy Places API

### Step 1: Go to Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Library**

### Step 2: Enable Legacy Places API

1. Search for **"Places API"** (the old/legacy one)
2. You should see two options:
   - **"Places API"** (legacy) ← Enable this one
   - **"Places API (New)"** (newer version)
3. Click on **"Places API"** (the legacy one)
4. Click **"Enable"**

### Step 3: Verify

1. Go to **APIs & Services** → **Enabled APIs**
2. Make sure **"Places API"** (legacy) is listed

### Step 4: Test

1. Wait a few minutes for the API to activate
2. Visit: `https://wheeleat-xp5.pages.dev/api/leaderboard?mall_id=sunway_square`
3. Check if restaurants now have ratings and reviews

## ✅ Code Updated to Use New Places API

I've updated the code to use the **new Places API** with automatic fallback to legacy if needed.

### What Changed:
- Code now tries the new Places API first
- Falls back to legacy API if new API is not available
- This ensures it works with either API enabled

### Next Steps:

1. **Enable "Places API (New)" in Google Cloud Console:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - APIs & Services → Library
   - Search for **"Places API (New)"**
   - Click **"Enable"**

2. **You can keep both APIs enabled** (they can coexist):
   - "Places API" (legacy) - fallback
   - "Places API (New)" - primary

3. **After testing, you can disable legacy:**
   - Once you confirm the new API works
   - Go to APIs & Services → Enabled APIs
   - Disable "Places API" (legacy)

4. **Redeploy:**
   - Commit and push the code changes
   - Cloudflare Pages will auto-deploy
   - Or manually redeploy from Cloudflare dashboard

### Benefits of New API:
- ✅ Not deprecated (legacy is deprecated as of March 2025)
- ✅ Better performance
- ✅ More features
- ✅ Future-proof

