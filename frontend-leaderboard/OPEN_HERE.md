# 📍 Frontend Location

**The frontend is in this folder: `frontend-leaderboard`**

## Files in this folder:
- `index.html` - The main page (OPEN THIS!)
- `styles.css` - Styling
- `script.js` - JavaScript code
- `README.md` - Documentation

## How to Open:

### Method 1: Double-click (Easiest)
1. Find `index.html` in this folder
2. Double-click it
3. It will open in your browser

### Method 2: Right-click
1. Right-click on `index.html`
2. Select "Open with" → Your browser (Chrome, Firefox, Edge, etc.)

### Method 3: Using Local Server (Recommended)
Open PowerShell/Command Prompt and run:
```powershell
cd C:\Users\User\Documents\SpinWheel\WheelEat\frontend-leaderboard
python -m http.server 8080
```
Then open: http://localhost:8080

## ⚠️ Important: Backend Must Be Running First!

Before opening the frontend:
1. Go to `backend-node` folder
2. Make sure `.env` file has your Google API key
3. Run: `npm start`
4. Wait until you see: "Server running on http://localhost:8001"
5. THEN open the frontend

## Troubleshooting

### "Failed to fetch restaurants"
- Make sure backend is running on port 8001
- Check: http://localhost:8001/health in browser

### "Cannot connect to backend"
- Backend server not running
- Check firewall settings
- Make sure port 8001 is not blocked

