# Fix Place Details API Not Working

## Problem
- ✅ Place Details API returns correct data (rating: 2.7, reviews: 22)
- ❌ Website still shows `rating: null` and `reviews: null`

## Root Cause Analysis

### Possible Issues:

1. **Caching (Most Likely)**
   - Leaderboard caches for 5 minutes
   - Old cached response might not have the place_id
   - Solution: Wait 5 minutes or use `?nocache=1`

2. **Code Not Using Place Details API**
   - Code might be falling back to text search
   - Place Details API might be failing silently
   - Solution: Check Cloudflare logs

3. **Response Format Mismatch**
   - New Places API vs Legacy API format difference
   - Solution: Verify response handling

## Solutions Applied

### 1. Added Cache Bypass
Added `?nocache=1` parameter to bypass cache for testing:
```
https://wheeleat-xp5.pages.dev/api/leaderboard?mall_id=sunway_square&nocache=1
```

### 2. Enhanced Logging
Added detailed console logs to track:
- When Place Details API is called
- API response status
- Rating and review counts
- Any errors

### 3. Verify Place ID Mapping
Confirmed place_id is in mapping file:
- ✅ Zok Noodle House: `ChIJPUl4EQBNzDERJmv9rI92FcM`

## Testing Steps

### Step 1: Test with Cache Bypass
```
https://wheeleat-xp5.pages.dev/api/leaderboard?mall_id=sunway_square&nocache=1
```

### Step 2: Check Cloudflare Logs
1. Go to Cloudflare Pages → Your project
2. Analytics & logs
3. Look for:
   - `Looking up place_id for "Zok Noodle House": ChIJPUl4EQBNzDERJmv9rI92FcM`
   - `Place Details API success for ChIJPUl4EQBNzDERJmv9rI92FcM: rating=2.7, reviews=22`
   - Or any error messages

### Step 3: Verify Place Details API Directly
Test this URL (replace YOUR_API_KEY):
```
https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJPUl4EQBNzDERJmv9rI92FcM&fields=name,rating,user_ratings_total,place_id&key=YOUR_API_KEY
```

Should return:
```json
{
  "status": "OK",
  "result": {
    "rating": 2.7,
    "user_ratings_total": 22
  }
}
```

## If Still Not Working

### Check 1: Place Details API Enabled?
1. Google Cloud Console → APIs & Services → Library
2. Search for "Places API" (legacy)
3. Make sure it's **Enabled**

### Check 2: API Key Restrictions
1. APIs & Services → Credentials
2. Click your API key
3. Under "API restrictions", make sure "Places API" is allowed

### Check 3: Code Deployment
Make sure the latest code with place_id mapping is deployed:
```bash
git status
git add functions/api/lib/restaurant-places.js
git commit -m "Add place_id for Zok Noodle House"
git push
```

### Check 4: Wait for Cache to Expire
The cache lasts 5 minutes. If you just added the place_id:
- Wait 5 minutes
- Or use `?nocache=1` parameter

## For Manjoe

The user also mentioned Manjoe doesn't work. To fix:

1. **Get Manjoe's place_id:**
   - Search for "Manjoe Taiwanese Dumplings Sunway Square Mall" using Places API
   - Or extract from Google Maps URL

2. **Add to mapping file:**
   ```javascript
   "Manjoe": "ChIJ...",  // Replace with actual place_id
   ```

3. **Test again with `?nocache=1`**

