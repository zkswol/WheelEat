# Fix API Key Issue

## Problem Found

The Place Details API is returning:
```json
{
  "error_message": "The provided API key is invalid.",
  "status": "REQUEST_DENIED"
}
```

## Issues Identified

### 1. API Key Invalid/Truncated
The API key in your test URL appears to be truncated: `AIzaSyDoxkw5hTYNxHNrP4`

A complete Google API key should be ~39 characters long and look like:
```
AIzaSyDoxkw5hTYNxHNrP4-R4V5-oY1dQfEhVdQ
```

### 2. Place ID Typo (in your test URL)
Your test URL has: `ChIJPUI4EQBNzDERJmv9rl92FcM`
Should be: `ChIJPUl4EQBNzDERJmv9rI92FcM`

Note: The "I" and "l" are swapped, and there's a lowercase "l" instead of uppercase "I".

## Solutions

### Step 1: Verify API Key in Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your Pages project
3. Go to **Settings** → **Environment Variables**
4. Find `GOOGLE_PLACES_API_KEY` or `GOOGLE_API_KEY`
5. **Check if the key is complete** (should be ~39 characters)
6. If it's truncated, update it with the full key

### Step 2: Regenerate API Key (If Needed)

If the key is invalid:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → **Credentials**
3. Find your API key
4. Click **Edit** (pencil icon)
5. Either:
   - **Regenerate** the key (recommended if it was exposed)
   - Or **Copy** the full key if it's valid

6. **Update in Cloudflare Pages:**
   - Go to Cloudflare Pages → Settings → Environment Variables
   - Update `GOOGLE_PLACES_API_KEY` with the full key
   - Make sure there are no extra spaces

### Step 3: Verify Place ID is Correct

The place_id in the mapping file is correct: `ChIJPUl4EQBNzDERJmv9rI92FcM`

Make sure you're using the correct one (not the typo version).

### Step 4: Test Place Details API

Use the **correct** place_id and **full** API key:

```
https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJPUl4EQBNzDERJmv9rI92FcM&fields=name,rating,user_ratings_total,place_id&key=YOUR_FULL_API_KEY
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

## Common API Key Issues

### Issue: Key Restrictions
If the key has restrictions, make sure:
- **API restrictions**: "Places API" is allowed
- **Application restrictions**: Not blocking Cloudflare Pages domain

### Issue: Key Not Set in Cloudflare
Make sure the environment variable is set:
- Variable name: `GOOGLE_PLACES_API_KEY` or `GOOGLE_API_KEY`
- Value: Your complete API key (~39 characters)
- Environment: **Production** (and Preview if needed)

### Issue: Key Exposed/Compromised
If the key was exposed (like in the test file we deleted earlier):
1. **Regenerate** the key in Google Cloud Console
2. **Update** it in Cloudflare Pages
3. **Restrict** the key to only allow:
   - Places API
   - Your Cloudflare Pages domain

## After Fixing

1. **Redeploy** your Cloudflare Pages (or wait for auto-deploy)
2. **Test** the leaderboard:
   ```
   https://wheeleat-xp5.pages.dev/api/leaderboard?mall_id=sunway_square&nocache=1
   ```
3. **Check** if Zok Noodle House now has ratings

## Security Note

⚠️ **Never expose your API key in:**
- Git commits
- Public URLs
- Screenshots
- Documentation files

If exposed, regenerate it immediately!

