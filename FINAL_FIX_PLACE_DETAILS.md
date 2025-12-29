# Final Fix for Place Details API

## Current Status

✅ **43 restaurants** have ratings (65% success rate)
❌ **23 restaurants** still missing ratings

## Problem Identified

The debug info shows that Place Details API calls are **failing** (`"found": false`) for many restaurants with place_ids, even though:
- ✅ Direct API tests work (e.g., Yonny returns rating 4.6, 99 reviews)
- ✅ Place IDs are correct in the mapping file
- ❌ But code shows `"found": false, "fallback": "text_search"`

## Root Cause

The **API key in Cloudflare Pages** is likely:
1. **Invalid** - Not the same as the one you're testing with
2. **Truncated** - Cut off/incomplete
3. **Not set** - Missing from environment variables

## Solution

### Step 1: Verify API Key in Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your Pages project → **Settings** → **Environment Variables**
3. Find `GOOGLE_PLACES_API_KEY` or `GOOGLE_API_KEY`
4. **Check:**
   - Is it complete? (~39 characters)
   - Is it the same as the one you're testing with?
   - Does it have any extra spaces?

### Step 2: Update API Key (If Needed)

If the key is invalid or different:

1. **Get the correct API key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - APIs & Services → **Credentials**
   - Copy the full API key

2. **Update in Cloudflare Pages:**
   - Settings → Environment Variables
   - Update `GOOGLE_PLACES_API_KEY` with the **full** key
   - Make sure there are **no extra spaces**
   - Save

3. **Redeploy:**
   - Cloudflare Pages will auto-redeploy
   - Or trigger a manual redeploy

### Step 3: Verify Place Details API is Enabled

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → **Library**
3. Search for **"Places API"** (legacy, not "Places API (New)")
4. Make sure it's **Enabled**

### Step 4: Deploy Updated Code

The code has been updated to:
- ✅ Skip new Places API (go straight to legacy)
- ✅ Better error logging
- ✅ Updated Kanteen place_id

Deploy:
```bash
git add functions/api/lib/restaurant-places.js functions/api/leaderboard.js
git commit -m "Fix Place Details API and update Kanteen place_id"
git push
```

## Restaurants That Should Work After Fix

Once the API key is fixed, these restaurants should show ratings:

- Yonny (rating: 4.6, reviews: 99)
- Salad Atelier
- Super Matcha
- Stuff'D
- The Public House
- The Walking Hotpot Signature
- The Chicken Rice Shop
- Village Grocer
- Yellow Bento
- Yama by Hojichaya
- Yogurt Planet
- Zok Noodle House

## Restaurants That Won't Have Ratings (Expected)

These have place_ids but genuinely don't have ratings on Google Maps:
- CU Mart (found but no rating)
- Come Buy Yakiniku (found but no rating)
- Count (Flower Drum) (found but no rating)
- Luckin (found but no rating)

This is **normal** - the place exists but doesn't have ratings yet.

## Restaurants Still Needing Place IDs

These need place_ids added:
- One Dish One Taste
- Sweetie
- Shabuyaki by Nippon Sushi
- Subway
- Tealive Plus
- Tang Gui Fei Tanghulu
- Zus Coffee

## Testing After Fix

1. **Deploy the code** (if not already deployed)
2. **Update API key** in Cloudflare Pages (if needed)
3. **Wait for redeploy** (1-2 minutes)
4. **Test with cache bypass:**
   ```
   https://wheeleat-xp5.pages.dev/api/leaderboard?mall_id=sunway_square&nocache=1
   ```
5. **Check results:**
   - Yonny should show rating 4.6, reviews 99
   - Other restaurants with place_ids should work

## Most Important Step

**Fix the API key in Cloudflare Pages!** This is the root cause. The code is correct, but if the API key is invalid, the Place Details API will fail.

