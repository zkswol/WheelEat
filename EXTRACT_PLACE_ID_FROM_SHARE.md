# Extract Place ID from Google Maps Share Link

## Your Share Link
The link `https://share.google/xeh5nsxPJsxoGcNY1` redirected to a Google Search page, not directly to Google Maps.

## Method 1: Open in Browser and Get Place ID

1. **Open the share link in your browser:**
   ```
   https://share.google/xeh5nsxPJsxoGcNY1
   ```

2. **Click on the Google Maps link** (if shown in the search results)

3. **Once on the Google Maps page**, look at the address bar for:
   - `ChIJ...` (27 characters starting with ChIJ)
   - Or in the URL path like: `/place/.../ChIJ.../...`

4. **Or use Share button:**
   - Click the "Share" button on Google Maps
   - Copy the link
   - The link will contain the place_id

## Method 2: Use Places API Text Search

Since we know it's "JP & Co @ Sunway Square Mall", try these searches:

### Search 1: URL-encoded "&"
```
https://maps.googleapis.com/maps/api/place/textsearch/json?query=JP+%26+Co+Sunway+Square+Mall&key=YOUR_API_KEY
```

### Search 2: With "@" symbol
```
https://maps.googleapis.com/maps/api/place/textsearch/json?query=JP+%26+Co+%40+Sunway+Square+Mall&key=YOUR_API_KEY
```

### Search 3: Just "JP Co"
```
https://maps.googleapis.com/maps/api/place/textsearch/json?query=JP+Co+Sunway+Square+Mall&key=YOUR_API_KEY
```

## Method 3: From the Share Link Directly

The share link contains `kgmid=/g/11ysh0nmps`. This is a Google Knowledge Graph ID, not a place_id.

To convert it:
1. Open the share link
2. Click through to the actual Google Maps page
3. Extract the place_id from there

## Quick Steps

1. **Open:** https://share.google/xeh5nsxPJsxoGcNY1
2. **Click** on the Google Maps result/link
3. **Look** at the URL for `ChIJ...`
4. **Or** click "Share" → Copy link → Extract place_id from the new link

## Alternative: Test with Places API

If you have the API key, test this query:
```
https://maps.googleapis.com/maps/api/place/textsearch/json?query=JP+%26+Co+Sunway+Square+Mall&key=YOUR_API_KEY
```

The response should contain the `place_id` in the results.

