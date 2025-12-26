# WheelEat Leaderboard Setup Guide

This guide will help you set up the new Node.js backend with Google Places API and the leaderboard frontend.

## Prerequisites

1. **Node.js and npm** - [Download Node.js](https://nodejs.org/)
2. **Google Places API Key** - Get from [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)

## Step 1: Get Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable "Places API" and "Maps JavaScript API"
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy your API key

## Step 2: Setup Backend

1. **Navigate to backend directory:**
   ```bash
   cd backend-node
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   Create a file named `.env` in the `backend-node` directory with:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   PORT=8001
   ```
   Replace `your_google_api_key_here` with your actual API key.

4. **Start the backend server:**
   ```bash
   npm start
   ```
   
   Or on Windows:
   ```bash
   start.bat
   ```

   The server will run on `http://localhost:8001`

5. **Test the backend:**
   Open your browser and go to:
   - `http://localhost:8001/health` - Should show server status
   - `http://localhost:8001/restaurants` - Should show restaurant data (JSON)

## Step 3: Setup Frontend

1. **Option 1: Open directly in browser**
   - Simply double-click `frontend-leaderboard/index.html`
   - Or right-click → Open with → Your browser

2. **Option 2: Use a local server (recommended)**
   
   **Using Python:**
   ```bash
   cd frontend-leaderboard
   python -m http.server 8080
   ```
   Then open `http://localhost:8080` in your browser.

   **Using Node.js http-server:**
   ```bash
   cd frontend-leaderboard
   npx http-server -p 8080
   ```
   Then open `http://localhost:8080` in your browser.

## Features

### Backend (`backend-node`)
- ✅ Fetches restaurants from Google Places API (Sunway Square Mall)
- ✅ Calculates review score: `rating * log10(user_ratings_total + 1)`
- ✅ GET `/restaurants` - All restaurants sorted by review score
- ✅ GET `/restaurants/:cuisine` - Filter by cuisine (chinese, japanese, etc.)
- ✅ Generates photo URLs using Google Place Photo API

### Frontend (`frontend-leaderboard`)
- ✅ Simple HTML/CSS/JavaScript (no frameworks)
- ✅ Leaderboard display with rankings
- ✅ Cuisine filter buttons (similar to original category selector)
- ✅ Shows: Rank, Photo, Name, Rating, Review Count, Review Score
- ✅ Linear, modern design
- ✅ Responsive (works on mobile)

## API Endpoints

### GET `/restaurants`
Returns all restaurants sorted by review_score (leaderboard)

**Example Response:**
```json
{
  "success": true,
  "count": 50,
  "restaurants": [
    {
      "name": "Restaurant Name",
      "rating": 4.5,
      "user_ratings_total": 123,
      "types": ["restaurant", "food"],
      "review_score": 9.32,
      "photo_url": "https://maps.googleapis.com/...",
      "place_id": "ChIJ..."
    }
  ]
}
```

### GET `/restaurants/:cuisine`
Filter restaurants by cuisine keyword

**Examples:**
- `/restaurants/chinese`
- `/restaurants/japanese`
- `/restaurants/western`

## Troubleshooting

### Backend Issues

**Error: "Google API key not configured"**
- Make sure you created a `.env` file in `backend-node` directory
- Check that `GOOGLE_API_KEY` is set correctly
- Restart the server after creating/updating `.env`

**Error: "Failed to fetch restaurants"**
- Check your Google API key is valid
- Make sure Places API is enabled in Google Cloud Console
- Check your API key has proper permissions

### Frontend Issues

**Error: "Failed to fetch restaurants"**
- Make sure the backend server is running on `http://localhost:8001`
- Check browser console for detailed error messages
- Verify CORS is enabled (already configured in backend)

**Photos not showing:**
- Check that Google Place Photo API is enabled in your Google Cloud project
- Some restaurants may not have photos

## Notes

- The backend runs on port **8001** (different from the Python backend on 8000)
- Review score formula: `rating * log10(user_ratings_total + 1)`
- Location: Sunway Square Mall (3.0722, 101.6073)
- Search radius: 500 meters

