# Fix Place Details API Failing

## Problem Identified

The debug info shows that Place Details API is failing (`"found": false`) for many restaurants, even though:
- ✅ Direct API tests work (e.g., Yonny returns rating 4.6, 99 reviews)
- ✅ Place IDs are correct in the mapping file
- ❌ But the code shows `"found": false, "fallback": "text_search"`

## Root Cause

The code was trying the **new Places API first**, which:
- Requires different authentication
- Might not be enabled in your Google Cloud project
- Fails silently and falls back to legacy API
- But the legacy API fallback might also be failing due to API key issues

## Solution Applied

I've updated the code to:
1. **Skip the new Places API** - Go straight to legacy Place Details API (which we know works)
2. **Better error logging** - More detailed error messages
3. **Improved error handling** - Better detection of API key issues

## What Changed

### Before:
- Tried new Places API first → Failed → Fallback to legacy → Also failed

### After:
- Go straight to legacy Place Details API (which works when tested directly)

## Next Steps

### Step 1: Deploy the Updated Code

```bash
git add functions/api/leaderboard.js
git commit -m "Fix Place Details API - use legacy API directly"
git push
```

### Step 2: Test After Deployment

Wait for Cloudflare Pages to rebuild, then test:
```
https://wheeleat-xp5.pages.dev/api/leaderboard?mall_id=sunway_square&nocache=1
```

### Step 3: Verify API Key

Make sure the API key in Cloudflare Pages is:
- ✅ Complete (~39 characters)
- ✅ Valid (not expired)
- ✅ Has "Places API" (legacy) enabled

## Expected Results

After deploying:
- ✅ Restaurants with place_ids should now show ratings
- ✅ Yonny should show rating 4.6, 99 reviews
- ✅ Other restaurants with place_ids should work

## Restaurants That Should Work Now

Based on your mapping file, these should now work:
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

## Restaurants That Won't Have Ratings

These restaurants have place_ids but the API returns no rating (they genuinely don't have ratings on Google Maps):
- CU Mart (found but no rating)
- Come Buy Yakiniku (found but no rating)
- Count (Flower Drum) (found but no rating)
- Luckin (found but no rating)

This is **expected behavior** - the place exists but doesn't have ratings yet.

## Restaurants Without Place IDs

These need place_ids added:
- Kanteen
- One Dish One Taste
- Sweetie
- Shabuyaki by Nippon Sushi
- Subway
- Tealive Plus
- Tang Gui Fei Tanghulu
- Zus Coffee

Use the methods in `HOW_TO_FIND_PLACE_ID.md` to find their place_ids.

