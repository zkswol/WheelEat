# WheelEat Node.js Backend

Node.js/Express backend for WheelEat that uses Google Places API to fetch restaurant data from Sunway Square Mall.

## Setup

1. **Install dependencies:**
```bash
cd backend-node
npm install
```

2. **Configure Google API Key:**
   - Get your Google Places API key from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
   - Create a `.env` file in the `backend-node` directory:
   ```
   GOOGLE_API_KEY=your_api_key_here
   PORT=8001
   ```

3. **Start the server:**
```bash
npm start
```

The server will run on `http://localhost:8001`

## API Endpoints

### GET `/restaurants`
Returns all restaurants sorted by review_score (leaderboard)

**Response:**
```json
{
  "success": true,
  "count": 50,
  "restaurants": [
    {
      "name": "Restaurant Name",
      "rating": 4.5,
      "user_ratings_total": 123,
      "types": ["restaurant", "food", "point_of_interest"],
      "review_score": 9.32,
      "photo_reference": "photo_ref_here",
      "photo_url": "https://maps.googleapis.com/...",
      "place_id": "place_id_here"
    }
  ]
}
```

### GET `/restaurants/:cuisine`
Filter restaurants by cuisine keyword, then sort by review_score

**Examples:**
- `/restaurants/chinese` - Chinese restaurants
- `/restaurants/japanese` - Japanese restaurants
- `/restaurants/western` - Western restaurants

**Response:**
```json
{
  "success": true,
  "cuisine": "chinese",
  "count": 10,
  "restaurants": [...]
}
```

### GET `/health`
Health check endpoint

## Review Score Calculation

The review score is calculated using:
```
review_score = rating * log10(user_ratings_total + 1)
```

This formula gives higher scores to restaurants with both good ratings and many reviews.

## Notes

- Location: Sunway Square Mall (3.0722, 101.6073)
- Search radius: 500 meters
- Missing ratings/review counts are treated as 0
- Photos use Google Place Photo API with maxwidth=400

