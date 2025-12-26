# WheelEat Leaderboard Frontend

Simple HTML/CSS/JavaScript frontend for displaying restaurant leaderboard from Sunway Square Mall.

## Setup

1. **No build required!** This is a simple static HTML page.

2. **Make sure the backend is running:**
   - The backend should be running on `http://localhost:8001`
   - Update `API_BASE_URL` in `script.js` if your backend runs on a different port

3. **Open the page:**
   - Simply open `index.html` in your browser
   - Or use a simple HTTP server:
   ```bash
   # Using Python
   python -m http.server 8080
   
   # Using Node.js (if you have http-server installed)
   npx http-server -p 8080
   ```
   - Then open `http://localhost:8080` in your browser

## Features

- **Leaderboard Display**: Shows restaurants ranked by review score
- **Cuisine Filtering**: Filter restaurants by cuisine type (Chinese, Japanese, Western, etc.)
- **Restaurant Details**: Shows rank, photo, name, rating, review count, and review score
- **Responsive Design**: Works on desktop and mobile devices
- **Linear Design**: Clean, modern, linear layout

## Cuisine Filters

- All Restaurants
- Chinese
- Japanese
- Western
- Malaysian
- Korean
- Thai
- Indian
- Cafe
- Fast Food

## Files

- `index.html` - Main HTML structure
- `styles.css` - Styling and layout
- `script.js` - JavaScript logic for API calls and display

