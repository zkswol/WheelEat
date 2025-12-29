# How to Find Place ID for Restaurants

## Method 1: Using Places API Text Search (Easiest)

### Step 1: Test the Search Query

Open this URL in your browser (replace `YOUR_API_KEY` with your actual API key):

```
https://maps.googleapis.com/maps/api/place/textsearch/json?query=Manjoe+Taiwanese+Dumplings+Sunway+Square+Mall&key=YOUR_API_KEY
```

### Step 2: Extract the place_id

The response will look like:
```json
{
  "status": "OK",
  "results": [
    {
      "name": "Manjoe Taiwanese Dumplings - Sunway Square Mall",
      "place_id": "ChIJ...",  // ← This is what you need!
      "rating": 4.2,
      "user_ratings_total": 15
    }
  ]
}
```

Copy the `place_id` value.

### Step 3: Add to Mapping File

Update `functions/api/lib/restaurant-places.js`:

```javascript
"Manjoe": "ChIJ...",  // Replace with the actual place_id
```

## Method 2: From Google Maps URL

### Step 1: Get Google Maps URL

If you have a Google Maps URL for the restaurant (like from your CSV):
```
https://maps.app.goo.gl/xxxxx
```

### Step 2: Open in Browser

1. Open the URL in your browser
2. Wait for it to redirect to the full Google Maps page
3. Look at the address bar

### Step 3: Extract place_id

The place_id might appear in the URL in different formats:

**Format 1: In the URL path**
```
https://www.google.com/maps/place/.../ChIJ.../...
```
Look for `ChIJ...` (27 characters)

**Format 2: In data parameter**
```
https://www.google.com/maps/.../data=!4m...!1sChIJ...
```
Look for `!1sChIJ...` (the place_id is after `!1s`)

**Format 3: Query parameter**
```
https://www.google.com/maps/...?place_id=ChIJ...
```

### Step 4: Use Browser Developer Tools

If you can't find it in the URL:

1. Open the Google Maps page
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Type: `ChIJ` and press Enter
5. Or search the page source (Ctrl+F) for `ChIJ`
6. Look for a 27-character string starting with `ChIJ`

## Method 3: Using Places API Programmatically

### For Multiple Restaurants

You can create a script to search for all restaurants at once:

```javascript
// Example: Search for Manjoe
const query = "Manjoe Taiwanese Dumplings Sunway Square Mall";
const apiKey = "YOUR_API_KEY";
const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;

fetch(url)
  .then(res => res.json())
  .then(data => {
    if (data.status === 'OK' && data.results.length > 0) {
      console.log('Place ID:', data.results[0].place_id);
      console.log('Name:', data.results[0].name);
      console.log('Rating:', data.results[0].rating);
    }
  });
```

## Method 4: Batch Search Script

I can create a script to search for all restaurants without place_ids. Would you like me to create that?

## Quick Reference: Restaurants Needing place_ids

From your current mapping, these restaurants need place_ids:

- Manjoe
- JP & CO
- Kanteen
- Kedai Kopi Malaya
- Kha Coffee Roaster
- LLAO LLAO
- Luckin (has place_id but no rating - might need different one)
- Mix.Store
- Missy Sushi
- Nasi Lemak Shop
- Nine Dragon Char Chan Teng (Kowloon Cafe)
- Nippon Sushi
- Odon Beyond
- One Dish One Taste
- Pak Curry
- Ramen Mob
- Richeese Factory
- Sweetie
- Salad Atelier
- Super Matcha
- Shabuyaki by Nippon Sushi
- Stuff'D
- Subway
- The Public House
- Tealive Plus
- Tang Gui Fei Tanghulu
- The Walking Hotpot Signature
- The Chicken Rice Shop
- Village Grocer
- Yellow Bento
- Yonny
- Yama by Hojichaya
- Yogurt Planet
- Zus Coffee

## Tips for Better Search Results

### Use Specific Search Queries

For better results, include:
- Restaurant name
- Mall name
- Location

Examples:
- ✅ `"Manjoe Taiwanese Dumplings Sunway Square Mall"`
- ✅ `"Manjoe Sunway Square"`
- ❌ `"Manjoe"` (too generic)

### Handle Multiple Results

Sometimes the search returns multiple results. Choose the one that:
- Matches the exact restaurant name
- Is located at Sunway Square Mall
- Has the most reviews (usually the correct one)

## Example: Finding Manjoe's place_id

1. **Search URL:**
   ```
   https://maps.googleapis.com/maps/api/place/textsearch/json?query=Manjoe+Taiwanese+Dumplings+Sunway+Square+Mall&key=YOUR_API_KEY
   ```

2. **Response:**
   ```json
   {
     "results": [
       {
         "place_id": "ChIJ...",
         "name": "Manjoe Taiwanese Dumplings - Sunway Square Mall"
       }
     ]
   }
   ```

3. **Update mapping:**
   ```javascript
   "Manjoe": "ChIJ...",
   ```

## After Adding place_ids

1. **Deploy the code:**
   ```bash
   git add functions/api/lib/restaurant-places.js
   git commit -m "Add place_ids for restaurants"
   git push
   ```

2. **Test the leaderboard:**
   ```
   https://wheeleat-xp5.pages.dev/api/leaderboard?mall_id=sunway_square&nocache=1
   ```

3. **Verify ratings appear** for restaurants with place_ids

