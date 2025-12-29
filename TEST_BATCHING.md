# Testing Client-Side Batching Implementation

## Quick Test Guide

### 1. **Start the Development Server**

```bash
cd frontend
npm start
```

The app should open at `http://localhost:3000` (or similar).

### 2. **Open Browser Console**

Open Developer Tools (F12) and go to the Console tab. You'll see batch fetching progress logs.

### 3. **Navigate to Leaderboard**

Click on the "Leaderboard" tab in the app.

### 4. **What to Look For**

#### In Browser Console:
You should see logs like:
```
Fetching leaderboard in batches (batch size: 25)...
Fetching batch 1...
Batch 1 complete, 25 restaurants. More batches available.
Fetching batch 2...
Batch 2 complete, 25 restaurants. More batches available.
Fetching batch 3...
Batch 3 complete, 16 restaurants. All batches fetched.
✅ Leaderboard loaded: 43/66 restaurants with ratings (3 batches)
```

#### Expected Results:
- **Total restaurants**: 66
- **Restaurants with ratings**: ~43-50 (depending on Google Places data)
- **Batches fetched**: 3 (25 + 25 + 16)
- **No "Too many subrequests" errors**

### 5. **Verify in UI**

- All 66 restaurants should appear in the leaderboard
- Restaurants with ratings should show star ratings and review counts
- Restaurants without ratings should show "—" for rating and "— reviews"

### 6. **Check Network Tab**

In Developer Tools → Network tab:
- Look for requests to `/api/leaderboard?batch=1&batch_size=25&...`
- Look for requests to `/api/leaderboard?batch=2&batch_size=25&...`
- Look for requests to `/api/leaderboard?batch=3&batch_size=25&...`
- Each request should return a subset of restaurants

## Troubleshooting

### Issue: Still seeing "Too many subrequests" errors

**Solution**: The batch size might be too large. Try reducing it:
- Edit `frontend/src/components/Leaderboard.js`
- Change `fetchLeaderboardBatched(mallId, 25)` to `fetchLeaderboardBatched(mallId, 15)`

### Issue: Only seeing first batch

**Check**:
1. Browser console for errors
2. Network tab - are all 3 batch requests being made?
3. Check if `has_more` is being returned correctly in the API response

### Issue: Restaurants are out of order

**Check**: The backend should maintain original order. If not, verify the batch combining logic in `frontend/src/services/api.js`.

## Testing on Production (Cloudflare Pages)

1. Push the branch to GitHub:
   ```bash
   git push origin implement-batching-option2
   ```

2. Deploy the branch on Cloudflare Pages (or it will auto-deploy if connected to GitHub)

3. Test on the production URL

4. Check Cloudflare Pages Functions logs for batch processing logs

## Expected Performance

- **Batch 1**: ~2-3 seconds (25 restaurants with place_ids prioritized)
- **Batch 2**: ~2-3 seconds (25 restaurants)
- **Batch 3**: ~1-2 seconds (16 restaurants)
- **Total**: ~5-8 seconds for all 66 restaurants

This is slower than a single request, but ensures 100% coverage.

## Success Criteria

✅ All 66 restaurants appear in leaderboard  
✅ No "Too many subrequests" errors in console  
✅ 3 batch requests visible in Network tab  
✅ ~43-50 restaurants show ratings (those with Google Places data)  
✅ Loading indicator shows progress  

