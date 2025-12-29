# Why Ratings Are Still Null After Adding Place IDs

## Issues Found

### 1. ✅ Fixed: Duplicate Entries
I found duplicate entries in the mapping file:
- Hock Kee Kopitiam (appears twice)
- Han Bun Sik (appears twice)
- Happy Potato (appears twice)
- I'm Bagel (appears twice)
- I LIKE & Yogurt In A Can (appears twice)
- Kenangan Coffee (appears twice)

**Fixed:** Removed duplicates.

### 2. Code Not Deployed
The most common reason ratings don't update is that **the code hasn't been deployed yet**.

**Solution:**
```bash
git add functions/api/lib/restaurant-places.js
git commit -m "Add place_ids for restaurants and fix duplicates"
git push
```

Wait for Cloudflare Pages to rebuild (usually 1-2 minutes).

### 3. Cache Issue
The leaderboard caches results for **5 minutes**. Even after deploying, you might see old cached results.

**Solution:**
- Use `?nocache=1` parameter:
  ```
  https://wheeleat-xp5.pages.dev/api/leaderboard?mall_id=sunway_square&nocache=1
  ```
- Or wait 5 minutes for cache to expire

### 4. API Key Issue
Earlier we saw the API key was invalid. If the Place Details API is failing, ratings won't update.

**Check:**
1. Verify API key is correct in Cloudflare Pages
2. Make sure Place Details API is enabled in Google Cloud Console
3. Test the API directly:
   ```
   https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJS0y-JwBNzDERpMXxeov8oOY&fields=name,rating,user_ratings_total,place_id&key=YOUR_API_KEY
   ```

### 5. Place Details API Not Enabled
Even if text search works, Place Details API might not be enabled.

**Check:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Library
3. Search for "Places API" (legacy)
4. Make sure it's **Enabled**

## Step-by-Step Troubleshooting

### Step 1: Verify Code is Deployed
1. Check git status:
   ```bash
   git status
   ```
2. If changes aren't committed, commit and push:
   ```bash
   git add functions/api/lib/restaurant-places.js
   git commit -m "Add place_ids for restaurants"
   git push
   ```

### Step 2: Wait for Deployment
1. Go to Cloudflare Pages dashboard
2. Check if the latest deployment is complete
3. Wait 1-2 minutes for rebuild

### Step 3: Test with Cache Bypass
```
https://wheeleat-xp5.pages.dev/api/leaderboard?mall_id=sunway_square&nocache=1
```

### Step 4: Check Debug Info
Look at the `_debug.restaurants_without_ratings_debug` section in the API response. It will show:
- `has_place_id`: Should be `true` for restaurants with place_ids
- `debug.method`: Should be `"place_details"` if using Place Details API
- `debug.found`: Should be `true` if API call succeeded

### Step 5: Test Place Details API Directly
Test one of the place_ids directly (replace `YOUR_API_KEY`):
```
https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJS0y-JwBNzDERpMXxeov8oOY&fields=name,rating,user_ratings_total,place_id&key=YOUR_API_KEY
```

Should return:
```json
{
  "status": "OK",
  "result": {
    "rating": 4.2,
    "user_ratings_total": 15
  }
}
```

If this fails, the API key or Place Details API is the issue.

## Most Likely Cause

Based on the earlier API key error, the most likely issue is:
1. **API key is invalid/truncated** in Cloudflare Pages
2. **Place Details API not enabled** in Google Cloud Console

## Quick Fix Checklist

- [ ] Code committed and pushed
- [ ] Cloudflare Pages deployment complete
- [ ] Tested with `?nocache=1` parameter
- [ ] API key is correct in Cloudflare Pages
- [ ] Place Details API is enabled in Google Cloud Console
- [ ] Tested Place Details API directly (works)

## After Fixing

Once everything is fixed:
1. Deploy the code
2. Wait for deployment
3. Test with `?nocache=1`
4. Ratings should now appear for restaurants with place_ids

