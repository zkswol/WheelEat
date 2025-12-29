# Debug Place Details API for Zok Noodle House

## Issue
The API response shows:
- ✅ place_id: `ChIJPUl4EQBNzDERJmv9rI92FcM`
- ✅ rating: `2.7`
- ✅ user_ratings_total: `22`

But the leaderboard still shows `rating: null` and `reviews: null`.

## Possible Causes

### 1. Place Details API Not Enabled
The Place Details API might not be enabled in Google Cloud Console.

**Check:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Library
3. Search for "Places API" (legacy)
4. Make sure it's **Enabled**

### 2. API Key Restrictions
The API key might be restricted and not allow Place Details API.

**Check:**
1. APIs & Services → Credentials
2. Click your API key
3. Under "API restrictions", make sure "Places API" is allowed

### 3. Caching Issue
The leaderboard caches results for 5 minutes. The old result might be cached.

**Solution:**
- Wait 5 minutes for cache to expire
- Or add `?nocache=1` to the URL to bypass cache

### 4. Place Details API Failing Silently
The API might be returning an error that's not being logged.

**Check Cloudflare Logs:**
1. Go to Cloudflare Pages → Your project
2. Analytics & logs
3. Look for errors mentioning "Place Details API" or the place_id

## Testing

### Test Place Details API Directly

Test this URL in your browser (replace `YOUR_API_KEY`):

```
https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJPUl4EQBNzDERJmv9rI92FcM&fields=name,rating,user_ratings_total,place_id&key=YOUR_API_KEY
```

**Expected Response:**
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

**If you get an error:**
- `REQUEST_DENIED` → API not enabled or key restricted
- `INVALID_REQUEST` → place_id format issue
- `NOT_FOUND` → place_id doesn't exist

## Debug Steps

1. **Check the place_id is correct:**
   - ✅ Already verified: `ChIJPUl4EQBNzDERJmv9rI92FcM`

2. **Check Cloudflare Logs:**
   - Look for console.log messages about Place Details API
   - Check for error messages

3. **Test the API directly:**
   - Use the test URL above
   - Verify it returns the correct data

4. **Check cache:**
   - Add `?nocache=1` to leaderboard URL
   - Or wait 5 minutes for cache to expire

5. **Verify API is enabled:**
   - Check Google Cloud Console
   - Make sure Places API (legacy) is enabled

## Code Changes Made

I've added better error logging to help debug:
- Console logs when Place Details API is called
- Error messages if API fails
- Success messages with rating/review counts

After deploying, check Cloudflare logs to see what's happening.

