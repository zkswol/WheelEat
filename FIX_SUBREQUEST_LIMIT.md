# Fix: "Too many subrequests" Error

## Problem Identified

The logs show **"Too many subrequests"** errors. This is a **Cloudflare Pages Functions limit**, not an API issue.

### Root Cause

- ✅ API key is working (`apiKey present: true`, `apiKey length: 39`)
- ✅ Place Details API calls work (first ~40 restaurants succeed)
- ❌ **Cloudflare Pages Functions has a limit of ~50 subrequests per request**
- ❌ With 66 restaurants and concurrency of 6, we're making too many subrequests

### What Happens

1. First ~40 restaurants: ✅ Work fine (Place Details API calls succeed)
2. After ~40 restaurants: ❌ Hit Cloudflare's subrequest limit
3. Remaining restaurants: ❌ Fail with "Too many subrequests" error

## Solution Applied

### 1. Reduced Concurrency

**Changed:** `mapWithConcurrency(restaurants, 6, ...)`  
**To:** `mapWithConcurrency(restaurants, 2, ...)`

**Why:** 
- With concurrency of 2, we make ~66-132 subrequests (66 restaurants × 1-2 API calls each)
- This is still close to the limit but should work better
- Lower concurrency = fewer simultaneous subrequests = less likely to hit limit

### 2. Added Better Error Handling

- ✅ Catch "Too many subrequests" errors specifically
- ✅ Log clear error messages explaining it's a Cloudflare limit
- ✅ Add error info to debug output

## Expected Results

After this fix:
- ✅ More restaurants should get ratings (should process more before hitting limit)
- ⚠️ Some restaurants may still fail if we hit the limit
- ✅ Better error messages in logs

## Alternative Solutions (If Still Hitting Limit)

If reducing concurrency to 2 still doesn't work, we can:

### Option 1: Further Reduce Concurrency
```javascript
const enriched = await mapWithConcurrency(restaurants, 1, async (r) => {
```
- Process one restaurant at a time
- Slowest but most reliable

### Option 2: Batch Processing
- Split restaurants into batches
- Process each batch in separate requests
- Requires frontend changes to make multiple API calls

### Option 3: Use Caching More Aggressively
- Cache Place Details API responses longer
- Reduce number of API calls needed

### Option 4: Skip Text Search Fallback
- Only use Place Details API (no fallback)
- Reduces subrequests by ~50%

## Current Status

- ✅ Concurrency reduced from 6 to 2
- ✅ Better error handling added
- ⚠️ May still hit limit with 66 restaurants
- ✅ Should process more restaurants before failing

## Next Steps

1. **Deploy the fix:**
   ```bash
   git add functions/api/leaderboard.js
   git commit -m "Fix: Reduce concurrency to avoid Cloudflare subrequest limit"
   git push
   ```

2. **Test again:**
   ```
   https://wheeleat-xp5.pages.dev/api/leaderboard?mall_id=sunway_square&nocache=1
   ```

3. **Check results:**
   - Should see more restaurants with ratings
   - Check if "Too many subrequests" errors are reduced
   - If still hitting limit, consider Option 1 (concurrency = 1)

## Summary

The issue is **not** with the API key or Place Details API - it's a **Cloudflare Pages Functions limit**. By reducing concurrency from 6 to 2, we should be able to process more restaurants before hitting the limit.

