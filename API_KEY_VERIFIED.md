# ✅ API Key Verified - Next Steps

## Test Result

Your API key `AIzaSyDoxkw5hTYNxHNrP4-R4V5-oY1dQfEhVdQ` is **VALID** and working!

**Test with Yonny:**
- ✅ Status: OK
- ✅ Rating: 4.6
- ✅ Reviews: 99

## The Problem

The API key works in direct tests, but Place Details API calls in Cloudflare Pages are failing. This means:

1. ✅ **API key is correct** (verified)
2. ✅ **Place Details API is enabled** (verified)
3. ❌ **API key not set correctly in Cloudflare Pages** (most likely)

## Solution: Set API Key in Cloudflare Pages

### Step 1: Go to Cloudflare Pages Settings

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your Pages project: **wheeleat-xp5**
3. Click **Settings** → **Environment Variables**

### Step 2: Add/Update the Variable

**Variable name (exact):** `GOOGLE_PLACES_API_KEY`

**Value:** `AIzaSyDoxkw5hTYNxHNrP4-R4V5-oY1dQfEhVdQ`

**Important:**
- ✅ Variable name must be exactly `GOOGLE_PLACES_API_KEY` (case-sensitive)
- ✅ No extra spaces before or after the value
- ✅ Type: **Plain text** (not secret)
- ✅ Apply to: **Production** and **Preview**

### Step 3: Save and Redeploy

1. Click **Save**
2. Cloudflare will automatically redeploy
3. Wait 1-2 minutes for deployment to complete

### Step 4: Test After Deployment

Test the leaderboard:
```
https://wheeleat-xp5.pages.dev/api/leaderboard?mall_id=sunway_square&nocache=1
```

**Expected results:**
- ✅ Yonny: `rating: 4.6, reviews: 99`
- ✅ Zok Noodle House: Should show ratings
- ✅ Manjoe: Should show ratings
- ✅ Other restaurants with place_ids: Should work

## Verify It's Set Correctly

After setting the variable, you can verify by checking the deployment logs:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Check the logs for any errors about `GOOGLE_PLACES_API_KEY`

If you see:
- ✅ No errors → API key is set correctly
- ❌ "GOOGLE_PLACES_API_KEY not found" → Variable name is wrong or not saved

## Alternative Variable Name

The code also checks for `GOOGLE_API_KEY` as a fallback. If you prefer, you can use that name instead, but `GOOGLE_PLACES_API_KEY` is recommended.

## Summary

1. ✅ API key is valid (tested and confirmed)
2. ⚠️ Set `GOOGLE_PLACES_API_KEY` in Cloudflare Pages environment variables
3. ⚠️ Redeploy (automatic after saving)
4. ⚠️ Test the leaderboard endpoint

Once the API key is set in Cloudflare Pages, all restaurants with place_ids should show ratings!

