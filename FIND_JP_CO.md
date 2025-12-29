# Finding Place ID for JP & CO

## Issue
The search query `JP&Co+@+Sunway+Square+Mall` is not finding the restaurant.

## Try Different Search Queries

### Query 1: Without special characters
```
https://maps.googleapis.com/maps/api/place/textsearch/json?query=JP+CO+Sunway+Square+Mall&key=YOUR_API_KEY
```

### Query 2: With "and" instead of "&"
```
https://maps.googleapis.com/maps/api/place/textsearch/json?query=JP+and+CO+Sunway+Square+Mall&key=YOUR_API_KEY
```

### Query 3: Just the name and mall
```
https://maps.googleapis.com/maps/api/place/textsearch/json?query=JP+CO+Sunway+Square&key=YOUR_API_KEY
```

### Query 4: Try different variations
```
https://maps.googleapis.com/maps/api/place/textsearch/json?query=JP+%26+CO+Sunway+Square+Mall&key=YOUR_API_KEY
```

### Query 5: Search without "JP"
```
https://maps.googleapis.com/maps/api/place/textsearch/json?query=CO+Sunway+Square+Mall&key=YOUR_API_KEY
```

## Alternative: Check if Restaurant Exists on Google Maps

1. **Search manually on Google Maps:**
   - Go to [Google Maps](https://www.google.com/maps)
   - Search for "JP & CO Sunway Square Mall"
   - Or "JP and CO Sunway Square"

2. **If found:**
   - Open the restaurant page
   - Look for the place_id in the URL or page source
   - Or use the "Share" button to get a link with place_id

3. **If not found:**
   - The restaurant might not be listed on Google Maps
   - It might be too new or very small
   - It might have a different name on Google Maps

## Check Restaurant Name Variations

The restaurant might be listed with a different name:
- "JP & Co"
- "JP and Co"
- "JP & Company"
- "JP Co Restaurant"
- "JP & CO Cafe"

## Manual Search on Google Maps

1. Open Google Maps
2. Search for: `JP & CO Sunway Square`
3. If you find it:
   - Click on it
   - Look at the URL - it should contain the place_id
   - Or right-click → "Share" → Copy link
   - The link will contain the place_id

## If Still Not Found

The restaurant might:
- Not be listed on Google Maps yet
- Have a completely different name
- Be too new to have a listing
- Be a very small/local restaurant without a Google Maps listing

In this case, you can:
- Leave it as `null` in the mapping file
- It will use text search as fallback (which also won't find it)
- The leaderboard will show `rating: null` and `reviews: null`

