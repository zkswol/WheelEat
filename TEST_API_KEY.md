# Test Your Google Places API Key

## Your API Key
```
AIzaSyDoxkw5hTYNxHNrP4-R4V5-oY1dQfEhVdQ
```

✅ **Format**: Correct (39 characters)

## Step 1: Set in Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your Pages project: **wheeleat-xp5**
3. Go to **Settings** → **Environment Variables**
4. Add/Update:
   - **Variable name**: `GOOGLE_PLACES_API_KEY`
   - **Value**: `AIzaSyDoxkw5hTYNxHNrP4-R4V5-oY1dQfEhVdQ`
   - **Type**: Plain text (not secret)
5. **Save**

## Step 2: Test the API Key Directly

Test with Yonny (should return rating 4.6, 99 reviews):

```
https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJvZ4-FgBNzDERI9PrDGjXUJk&key=AIzaSyDoxkw5hTYNxHNrP4-R4V5-oY1dQfEhVdQ&fields=name,rating,user_ratings_total,place_id
```

**Expected response:**
```json
{
  "status": "OK",
  "result": {
    "name": "Yonny",
    "rating": 4.6,
    "user_ratings_total": 99,
    "place_id": "ChIJvZ4-FgBNzDERI9PrDGjXUJk"
  }
}
```

## Step 3: Test Zok Noodle House

```
https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJPUl4EQBNzDERJmv9rI92FcM&key=AIzaSyDoxkw5hTYNxHNrP4-R4V5-oY1dQfEhVdQ&fields=name,rating,user_ratings_total,place_id
```

## Step 4: Test Manjoe

```
https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJhYqJgABNzDERqJqJgABNzDE&key=AIzaSyDoxkw5hTYNxHNrP4-R4V5-oY1dQfEhVdQ&fields=name,rating,user_ratings_total,place_id
```

## Step 5: Verify in Cloudflare Pages

After setting the environment variable:

1. **Redeploy** (or wait for auto-redeploy)
2. **Test the leaderboard:**
   ```
   https://wheeleat-xp5.pages.dev/api/leaderboard?mall_id=sunway_square&nocache=1
   ```
3. **Check the response:**
   - Yonny should show `rating: 4.6, reviews: 99`
   - Zok Noodle House should show ratings
   - Manjoe should show ratings

## Common Issues

### Issue 1: "REQUEST_DENIED"
- **Cause**: API key is invalid or Place Details API not enabled
- **Fix**: 
  1. Verify key in Google Cloud Console
  2. Enable "Places API" (legacy) in Google Cloud Console

### Issue 2: "INVALID_REQUEST"
- **Cause**: place_id is invalid
- **Fix**: Check the place_id in `restaurant-places.js`

### Issue 3: Still showing `null` ratings
- **Cause**: API key not set in Cloudflare Pages or wrong variable name
- **Fix**: 
  1. Check variable name is exactly `GOOGLE_PLACES_API_KEY`
  2. Check value has no extra spaces
  3. Redeploy after setting

## Security Note

⚠️ **DO NOT commit this API key to git!**

The key is shown here for testing only. Make sure:
- ✅ It's set in Cloudflare Pages environment variables
- ✅ It's NOT in any `.env` files that are committed
- ✅ It's NOT in any code files

## Next Steps

1. ✅ Set `GOOGLE_PLACES_API_KEY` in Cloudflare Pages
2. ✅ Test the direct API calls above
3. ✅ Redeploy your Pages project
4. ✅ Test the leaderboard endpoint
5. ✅ Verify ratings appear for Yonny, Zok, Manjoe, etc.

