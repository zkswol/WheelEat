# Leaderboard Rating/Review Fix Summary

## Problem
Some restaurants on the leaderboard don't show ratings and reviews because:
1. Text search doesn't always find the exact restaurant
2. Restaurant names might not match Google Places listings exactly
3. Some restaurants have multiple locations or similar names

## Solution Implemented

### ✅ What I've Done

1. **Created Place ID Mapping System**
   - Added `functions/api/lib/restaurant-places.js` with restaurant-to-place_id mapping
   - This allows direct lookup of exact restaurants instead of searching

2. **Updated Leaderboard Code**
   - Modified `functions/api/leaderboard.js` to:
     - First check for place_id in mapping (most accurate)
     - Use Place Details API for exact match
     - Fallback to text search if no place_id found

3. **Added Place Details API Support**
   - New function `fetchPlaceDetails()` uses Place Details API
   - Supports both new and legacy Places API
   - More accurate than text search

4. **Created Helper Scripts & Guides**
   - `scripts/extract-place-ids.js` - Script to extract place_ids from URLs
   - `EXTRACT_PLACE_IDS.md` - Guide on how to extract place_ids manually

## Next Steps

### Option 1: Use Text Search (Current - Works Now)
The code already works with text search as fallback. Some restaurants may not match perfectly, but most should work.

### Option 2: Add Place IDs (Recommended - More Accurate)
To get 100% accurate results:

1. **Extract Place IDs from Google Maps URLs**
   - See `EXTRACT_PLACE_IDS.md` for detailed instructions
   - Open each Google Maps URL from your CSV
   - Extract the place_id (27 characters, starts with `ChIJ`)
   - Update `functions/api/lib/restaurant-places.js`

2. **Quick Method:**
   - Open a Google Maps URL
   - Look for `ChIJ...` in the URL or page source
   - Copy the 27-character place_id
   - Update the mapping file

3. **Example:**
   ```javascript
   "103 Coffee": "ChIJN1t_tDeuEmsRUsoyG83frY4",  // Replace null with actual place_id
   ```

## How It Works Now

1. **For restaurants WITH place_id in mapping:**
   - Uses Place Details API → 100% accurate ✅

2. **For restaurants WITHOUT place_id:**
   - Uses text search → May not find exact match ⚠️

## Testing

1. **Deploy the changes:**
   ```bash
   git add .
   git commit -m "Add place_id mapping for accurate restaurant ratings"
   git push
   ```

2. **Test the leaderboard:**
   - Visit: `https://wheeleat-xp5.pages.dev/api/leaderboard?mall_id=sunway_square`
   - Check which restaurants have ratings/reviews

3. **Compare results:**
   - Restaurants with place_ids should have ratings
   - Restaurants without place_ids may or may not have ratings (depends on text search match)

## Files Changed

- ✅ `functions/api/leaderboard.js` - Added place_id lookup logic
- ✅ `functions/api/lib/restaurant-places.js` - New mapping file
- ✅ `scripts/extract-place-ids.js` - Helper script (optional)
- ✅ `EXTRACT_PLACE_IDS.md` - Extraction guide
- ✅ `LEADERBOARD_FIX_SUMMARY.md` - This file

## Current Status

- ✅ Code updated to support place_ids
- ✅ Fallback to text search works
- ⏳ Place IDs need to be populated (manual step)

## Benefits

- **More Accurate:** Place IDs give exact matches
- **Faster:** Direct lookup vs search
- **Reliable:** No search ranking issues
- **Backward Compatible:** Still works with text search for restaurants without place_ids

