# Troubleshoot Place Details API Not Working

## Current Issue
- ✅ Place Details API returns correct data when tested directly
- ❌ Website still shows `rating: null` and `reviews: null` for Zok Noodle House and Manjoe
- ❌ API response shows `"google": null` for both restaurants

## Root Cause Analysis

### Issue 1: Code Not Deployed
The place_id for Zok Noodle House (`ChIJPUl4EQBNzDERJmv9rI92FcM`) was added to the mapping file, but if the code hasn't been deployed, it won't be used.

**Solution:**
1. Verify the code is committed:
   ```bash
   git status
   git log --oneline -5
   ```

2. Deploy the code:
   ```bash
   git add functions/api/lib/restaurant-places.js
   git commit -m "Add place_id for Zok Noodle House"
   git push
   ```

3. Wait for Cloudflare Pages to rebuild (usually 1-2 minutes)

### Issue 2: Place Details API Failing
The API might be failing silently. I've added debug information to help diagnose.

**Check the API response:**
After deploying, visit:
```
https://wheeleat-xp5.pages.dev/api/leaderboard?mall_id=sunway_square&nocache=1
```

Look at the `_debug.restaurants_without_ratings_debug` section. It will show:
- `has_place_id`: Whether a place_id exists in the mapping
- `place_id`: The actual place_id being used
- `debug.method`: Which method was used (place_details or text_search)
- `debug.found`: Whether the API call succeeded

### Issue 3: Place Details API Not Enabled
Even though text search works, Place Details API might not be enabled.

**Check:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Library
3. Search for "Places API" (legacy)
4. Make sure it's **Enabled**

### Issue 4: API Key Restrictions
The API key might be restricted and not allow Place Details API.

**Check:**
1. APIs & Services → Credentials
2. Click your API key
3. Under "API restrictions", make sure "Places API" is allowed

## Testing Steps

### Step 1: Verify Place ID is Correct
Test the place_id directly (replace `YOUR_API_KEY`):
```
https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJPUl4EQBNzDERJmv9rI92FcM&fields=name,rating,user_ratings_total,place_id&key=YOUR_API_KEY
```

Should return:
```json
{
  "status": "OK",
  "result": {
    "name": "Zok Noodle House 竹面馆 - Sunway Square Mall",
    "rating": 2.7,
    "user_ratings_total": 22,
    "place_id": "ChIJPUl4EQBNzDERJmv9rI92FcM"
  }
}
```

### Step 2: Check Debug Info
After deploying the updated code, check the API response:
```
https://wheeleat-xp5.pages.dev/api/leaderboard?mall_id=sunway_square&nocache=1
```

Look for Zok Noodle House in `_debug.restaurants_without_ratings_debug`:
```json
{
  "name": "Zok Noodle House",
  "has_place_id": true,
  "place_id": "ChIJPUl4EQBNzDERJmv9rI92FcM",
  "debug": {
    "method": "place_details",
    "place_id": "ChIJPUl4EQBNzDERJmv9rI92FcM",
    "found": false  // This tells us if Place Details API succeeded
  }
}
```

### Step 3: For Manjoe
Manjoe doesn't have a place_id yet. To fix:

1. **Get Manjoe's place_id:**
   Test this URL (replace `YOUR_API_KEY`):
   ```
   https://maps.googleapis.com/maps/api/place/textsearch/json?query=Manjoe+Taiwanese+Dumplings+Sunway+Square+Mall&key=YOUR_API_KEY
   ```

2. **Add to mapping file:**
   Update `functions/api/lib/restaurant-places.js`:
   ```javascript
   "Manjoe": "ChIJ...",  // Replace with actual place_id from search
   ```

## Code Changes Made

1. ✅ Added debug information to API response
2. ✅ Enhanced error handling
3. ✅ Added cache bypass (`?nocache=1`)

## Next Steps

1. **Deploy the updated code** (with debug info)
2. **Test with `?nocache=1`** parameter
3. **Check the `_debug` section** in the API response
4. **Share the debug info** so we can see what's happening

The debug information will help us diagnose the issue without needing Cloudflare logs!

