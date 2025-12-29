# How to Extract Place IDs from Google Maps URLs

This guide helps you populate the `restaurant-places.js` mapping file with place_ids for accurate rating/review fetching.

## Why Place IDs?

Using place_ids is more accurate than text search because:
- ✅ Exact match (no confusion with similar restaurant names)
- ✅ Faster (direct lookup vs search)
- ✅ More reliable (no search ranking issues)

## Method 1: Manual Extraction (Recommended)

### Step 1: Open Each Google Maps URL

1. Open the CSV file with restaurant URLs
2. For each restaurant, click the Google Maps URL
3. The URL will redirect to the full Google Maps page

### Step 2: Extract Place ID from URL

Once on the Google Maps page, look at the URL. The place_id is usually in one of these formats:

**Format 1: Query Parameter**
```
https://www.google.com/maps/place/Restaurant+Name/@lat,lng,zoom/data=!3m1!4b1!4m5!3m4!1sChIJ...!8m2!3d...!4d...?entry=ttu
```
Look for `!1s` followed by a 27-character code starting with `ChIJ` (e.g., `ChIJN1t_tDeuEmsRUsoyG83frY4`)

**Format 2: Direct Place ID**
```
https://www.google.com/maps/place/?q=place_id:ChIJN1t_tDeuEmsRUsoyG83frY4
```
The place_id is after `place_id:`

### Step 3: Update restaurant-places.js

1. Open `functions/api/lib/restaurant-places.js`
2. Find the restaurant name in the `sunway_square` object
3. Replace `null` with the place_id in quotes:

```javascript
"103 Coffee": "ChIJN1t_tDeuEmsRUsoyG83frY4",
```

## Method 2: Using Browser Console (Faster)

1. Open a Google Maps URL in your browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Run this JavaScript:

```javascript
// Extract place_id from current page
const scripts = Array.from(document.querySelectorAll('script'));
const placeIdScript = scripts.find(s => s.textContent.includes('ChIJ'));
if (placeIdScript) {
  const match = placeIdScript.textContent.match(/ChIJ[A-Za-z0-9_-]{27}/);
  if (match) {
    console.log('Place ID:', match[0]);
    // Copy this value
  }
}
```

## Method 3: Using Google Places API (Automatic)

If you have the Google Places API enabled, you can use the Place ID Lookup:

1. For each restaurant, search: `"Restaurant Name" Sunway Square Mall`
2. Use the Place Search API to get place_id
3. Update the mapping file

## Current Status

The code will:
1. ✅ Check for place_id in mapping first (most accurate)
2. ✅ Fallback to text search if no place_id (still works, but less accurate)

## Testing

After adding place_ids:

1. Deploy to Cloudflare Pages
2. Visit: `https://your-site.pages.dev/api/leaderboard?mall_id=sunway_square`
3. Check if restaurants with place_ids now show ratings/reviews

## Example Mapping

```javascript
export const RESTAURANT_PLACE_IDS = {
  sunway_square: {
    "103 Coffee": "ChIJ...",  // Replace with actual place_id
    "A'Decade": "ChIJ...",
    // ... etc
  },
};
```

## Notes

- Place IDs are 27 characters long and start with `ChIJ`
- Some restaurants may not have Google Maps listings (keep as `null`)
- The code will automatically fallback to text search for restaurants without place_ids

