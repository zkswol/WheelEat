# Debug Analysis - Place Details API Failures

## Current Status

**42 out of 66 restaurants (64%) have ratings** ✅

**24 restaurants still don't have ratings:**
- 4 restaurants exist but have no ratings (expected)
- 12 restaurants have place_ids but Place Details API is failing
- 8 restaurants need place_ids added

## Problem Identified

Looking at the `_debug` section, I see a clear pattern:

### ✅ Restaurants That Work (Found but No Rating - Expected)
These restaurants are found but genuinely don't have ratings on Google Maps:
- CU Mart: `"found": true, "has_rating": false` ✅
- Come Buy Yakiniku: `"found": true, "has_rating": false` ✅
- Count (Flower Drum): `"found": true, "has_rating": false` ✅
- Luckin: `"found": true, "has_rating": false` ✅

### ❌ Restaurants Where Place Details API is Failing
These have valid place_ids but Place Details API returns `"found": false`:
- Salad Atelier: `"found": false, "fallback": "text_search"`
- Super Matcha: `"found": false, "fallback": "text_search"`
- Stuff'D: `"found": false, "fallback": "text_search"`
- The Public House: `"found": false, "fallback": "text_search"`
- The Walking Hotpot Signature: `"found": false, "fallback": "text_search"`
- The Chicken Rice Shop: `"found": false, "fallback": "text_search"`
- Village Grocer: `"found": false, "fallback": "text_search"`
- Yellow Bento: `"found": false, "fallback": "text_search"`
- Yonny: `"found": false, "fallback": "text_search"` ⚠️ **We tested this - it works!**
- Yama by Hojichaya: `"found": false, "fallback": "text_search"`
- Yogurt Planet: `"found": false, "fallback": "text_search"`
- Zok Noodle House: `"found": false, "fallback": "text_search"` ⚠️ **We tested this - it works!**

### ❌ Restaurants That Need Place IDs
These don't have place_ids in the mapping file:
- Kanteen
- One Dish One Taste
- Sweetie
- Shabuyaki by Nippon Sushi
- Subway
- Tealive Plus
- Tang Gui Fei Tanghulu
- Zus Coffee

## Root Cause Analysis

**The key issue:** Place Details API is failing for restaurants with valid place_ids, even though:
- ✅ Direct API tests work (Yonny: 4.6, 99 reviews)
- ✅ Place IDs are correct in the mapping file
- ✅ API key is set in Cloudflare Pages

**Possible causes:**
1. **API key not accessible in deployed environment** - Most likely
2. **Rate limiting** - Making 6 concurrent calls might hit limits
3. **Timeout issues** - API calls might be timing out
4. **Network restrictions** - Cloudflare Pages might have restrictions

## Solution: Enhanced Error Logging

I've added more detailed error logging to help diagnose the issue:

1. ✅ Log full API response when errors occur
2. ✅ Log API key presence and length (first 10 chars for security)
3. ✅ Log detailed error messages for each failure
4. ✅ Add API key info to debug output

## Next Steps

### Step 1: Deploy Updated Code

```bash
git add functions/api/leaderboard.js
git commit -m "Add enhanced error logging for Place Details API debugging"
git push
```

### Step 2: Check Cloudflare Real-time Logs

After deployment, check the Real-time Logs for:
- `apiKey present: true/false`
- `apiKey length: 39` (should be 39 characters)
- Full error messages from Place Details API
- `REQUEST_DENIED`, `INVALID_REQUEST`, or other error statuses

### Step 3: Test Again

Call the API:
```
https://wheeleat-xp5.pages.dev/api/leaderboard?mall_id=sunway_square&nocache=1
```

### Step 4: Check the Logs

Look for entries like:
- `❌ Place Details API error for ChIJvZ4-FgBNzDERI9PrDGjXUJk: REQUEST_DENIED - ...`
- `API Key used: AIzaSyDoxk...`
- `Full API response: {...}`

## Expected Findings

If the API key is not accessible, you'll see:
- `apiKey present: false`
- `apiKey length: 0`
- `REQUEST_DENIED` errors

If there's a rate limiting issue, you'll see:
- `OVER_QUERY_LIMIT` errors
- Timeout errors

If the place_ids are invalid, you'll see:
- `INVALID_REQUEST` or `NOT_FOUND` errors

## Summary

The debug output shows that Place Details API is failing for 12 restaurants with valid place_ids. The enhanced logging will help us identify the exact cause. Once we see the error messages in the Cloudflare logs, we can fix the issue.

**Most likely issue:** API key not accessible in the deployed environment, even though it's set in Cloudflare Pages settings.

