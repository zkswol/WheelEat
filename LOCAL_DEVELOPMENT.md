# Local Development Guide

This guide explains how to run WheelEat locally for development.

## Prerequisites

- **Node.js 16 or higher** - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js)

---

## Quick Start (Recommended)

### Step 1: Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Step 2: Create Environment File

Create a `.env.local` file in the `frontend` directory:

```bash
# frontend/.env.local
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id-here
REACT_APP_API_BASE_URL=https://your-deployment-url.pages.dev
```

**Replace:**
- `your-google-client-id-here` - Your Google OAuth Client ID (get from [Google Cloud Console](https://console.cloud.google.com/))
- `your-deployment-url.pages.dev` - Your Cloudflare Pages deployment URL (e.g., `https://wheeleat-xp5.pages.dev`)

**Important:** 
- **NO trailing slash** in `REACT_APP_API_BASE_URL` (e.g., use `https://wheeleat-xp5.pages.dev` NOT `https://wheeleat-xp5.pages.dev/`)
- See `GOOGLE_OAUTH_SETUP.md` for Google OAuth setup instructions.

**Note:** The backend (API) runs on Cloudflare Pages, not locally. The frontend will call your production API when running locally.

### Step 3: Start Development Server

```bash
npm start
```

The app will automatically open at `http://localhost:3000`

---

## How It Works

When you run `npm start`:
- ✅ Frontend runs on `http://localhost:3000`
- ✅ API calls go to your production Cloudflare Pages (via `REACT_APP_API_BASE_URL`)
- ✅ Data saves to your production D1 database
- ✅ Hot reload works automatically (changes refresh in browser)

---

## Development Workflow

1. **Make changes** to files in `frontend/src/`
2. **Save the file** - Browser automatically refreshes
3. **Test your changes** in the browser
4. **Check browser console** for any errors
5. **Commit and push** when ready

---

## Environment Variables

### Required for Local Development

Create `frontend/.env.local`:

```bash
# Google OAuth (required for Google Sign-In)
REACT_APP_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com

# API Base URL (points to your production Cloudflare Pages)
REACT_APP_API_BASE_URL=https://your-deployment-url.pages.dev
```

### Optional

If you want to test without Google OAuth, you can skip `REACT_APP_GOOGLE_CLIENT_ID` and just use "Continue as Guest".

---

## Testing Google OAuth Locally

For Google OAuth to work on `localhost:3000`:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Add to **Authorized JavaScript origins**:
   - `http://localhost:3000`
5. Add to **Authorized redirect URIs**:
   - `http://localhost:3000`
6. Click **Save**
7. Restart your dev server (`npm start`)

---

## Troubleshooting

### Issue: API calls fail (404 or CORS errors)

**Solution:** Make sure `REACT_APP_API_BASE_URL` in `.env.local` points to your correct Cloudflare Pages URL.

### Issue: Google OAuth doesn't work

**Solution:**
1. Check that `REACT_APP_GOOGLE_CLIENT_ID` is set in `.env.local`
2. Verify `http://localhost:3000` is added to Google Cloud Console
3. Restart dev server after changing `.env.local`

### Issue: Changes don't appear

**Solution:**
- Make sure you saved the file
- Check browser console for errors
- Try hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Issue: `npm start` fails

**Solution:**
```bash
# Delete node_modules and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Issue: Port 3000 already in use

**Solution:**
- Close other applications using port 3000
- Or set a different port: `PORT=3001 npm start`

---

## Building for Production

When ready to deploy:

```bash
cd frontend
npm run build
```

This creates `frontend/build/` which Cloudflare Pages will automatically deploy.

---

## Summary

**To run locally:**

1. ```bash
   cd frontend
   npm install
   ```

2. Create `frontend/.env.local`:
   ```bash
   REACT_APP_GOOGLE_CLIENT_ID=your-client-id
   REACT_APP_API_BASE_URL=https://your-deployment.pages.dev
   ```

3. ```bash
   npm start
   ```

4. Open `http://localhost:3000` in your browser

**That's it!** 🎉

---

## Notes

- **Data saves to production:** When testing locally, data (spins, users) saves to your production D1 database
- **API uses production:** All API calls go to your production Cloudflare Pages Functions
- **Hot reload:** Changes automatically refresh in the browser
- **No backend needed:** You don't need to run any backend server locally
