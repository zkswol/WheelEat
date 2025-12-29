# Test Google Places API Key

## Quick Test

Test your API key directly to see if it's working:

### Option 1: Browser Test

Open this URL in your browser (replace `YOUR_API_KEY` with your actual key):

```
https://maps.googleapis.com/maps/api/place/textsearch/json?query=Subway+Sunway+Square+Mall&key=AIzaSyDoxkw5hTYNxHNrP4-R4V5-oY1dQfEhVdQ
```

**Expected responses:**

✅ **Working:**
```json
{
  "status": "OK",
  "results": [
    {
      "name": "Subway",
      "rating": 4.2,
      "user_ratings_total": 150,
      ...
    }
  ]
}
```

❌ **API Key Error:**
```json
{
  "status": "REQUEST_DENIED",
  "error_message": "This API project is not authorized to use this API."
}
```

❌ **Quota Exceeded:**
```json
{
  "status": "OVER_QUERY_LIMIT",
  "error_message": "You have exceeded your daily request quota for this API."
}
```

❌ **Invalid Key:**
```json
{
  "status": "INVALID_REQUEST",
  "error_message": "The provided API key is invalid."
}
```

### Option 2: Command Line Test

```bash
curl "https://maps.googleapis.com/maps/api/place/textsearch/json?query=Subway+Sunway+Square+Mall&key=AIzaSyDoxkw5hTYNxHNrP4-R4V5-oY1dQfEhVdQ"
```

## Common Issues

### Issue: "REQUEST_DENIED"

**Cause:** Places API not enabled or API key restrictions

**Solution:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Library
3. Search for "Places API"
4. Make sure it's **Enabled**
5. Check API key restrictions:
   - APIs & Services → Credentials
   - Click your API key
   - Under "API restrictions", make sure "Places API" is allowed

### Issue: "OVER_QUERY_LIMIT"

**Cause:** You've exceeded the free tier quota

**Solution:**
- Wait 24 hours for quota to reset
- Or upgrade your Google Cloud billing plan
- Free tier: $200/month credit (~6,250 requests)

### Issue: "INVALID_REQUEST"

**Cause:** API key is incorrect or has wrong format

**Solution:**
- Double-check the API key in Cloudflare Pages
- Make sure there are no extra spaces
- Regenerate the API key if needed

## Next Steps

After testing, check Cloudflare Pages logs:

1. Go to Cloudflare Pages → **Analytics & logs**
2. Look for errors mentioning "Google Places" or "REQUEST_DENIED"
3. Share the error messages you see


