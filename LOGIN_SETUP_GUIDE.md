# 🔐 Login System Setup Guide - WheelEat (Google + Guest Only)

**Note:** This guide is for Google and Guest login only. Facebook login has been removed.

For the simplified guide, see: **`LOGIN_SETUP_GUIDE_SIMPLE.md`**

---

## 📋 Overview

This guide will help you implement two login options:
1. **Sign in with Google** (OAuth)
2. **Guest login** (Anonymous, no setup required)

---

## Step 1: Install Required Packages

Open terminal in `frontend` folder and run:

```bash
cd frontend
npm install @react-oauth/google --legacy-peer-deps
```

**Note:** We're using Facebook SDK directly (no extra package needed) for React 18 compatibility. The `--legacy-peer-deps` flag handles any minor dependency warnings.

---

## Step 2: Get OAuth Credentials

### 🔵 Google OAuth Setup

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create/Select Project:**
   - Click project dropdown → "NEW PROJECT"
   - Name: `WheelEat` → Click "CREATE"

3. **Enable Google+ API:**
   - Go to: "APIs & Services" → "Library"
   - Search: "Google+ API" → Click "ENABLE"

4. **Configure OAuth Consent Screen:**
   - Go to: "APIs & Services" → "OAuth consent screen"
   - User Type: **External** (unless you have Google Workspace)
   - Click "CREATE"
   - Fill required fields:
     - App name: `WheelEat`
     - User support email: Your email
     - Developer contact: Your email
   - Click "SAVE AND CONTINUE"
   - Scopes: Click "ADD OR REMOVE SCOPES"
     - Check: `email`, `profile`, `openid`
     - Click "UPDATE" → "SAVE AND CONTINUE"
   - Test users: Add your email (optional for testing)
   - Click "BACK TO DASHBOARD"

5. **Create OAuth 2.0 Credentials:**
   - Go to: "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: **Web application**
   - Name: `WheelEat Web Client`
   - Authorized JavaScript origins:
     - Add: `http://localhost:3000`
     - Add: `http://localhost:3000/` (if needed)
   - Authorized redirect URIs:
     - Add: `http://localhost:3000`
     - Add: `http://localhost:3000/oauth/callback` (if needed)
   - Click "CREATE"
   - **Copy the Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)

6. **Save Google Client ID:**
   - You'll use this in the next step!

---

### 🔵 Facebook OAuth Setup

1. **Go to Facebook Developers:**
   - Visit: https://developers.facebook.com/
   - Sign in with your Facebook account

2. **Create App:**
   - Click "My Apps" → "Create App"
   - App type: **Consumer**
   - Fill in:
     - App name: `WheelEat`
     - App contact email: Your email
     - Business account: (optional, skip if none)
   - Click "Create App"

3. **Add Facebook Login Product:**
   - In your app dashboard, find "Add Products"
   - Click "+" next to "Facebook Login"
   - Click "Set Up"

4. **Configure Facebook Login:**
   - Go to: "Facebook Login" → "Settings"
   - Valid OAuth Redirect URIs:
     - Add: `http://localhost:3000`
     - Add: `http://localhost:3000/auth/facebook/callback`
   - Click "Save Changes"

5. **Get App ID and App Secret:**
   - Go to: "Settings" → "Basic"
   - **Copy App ID** (looks like: `123456789012345`)
   - **Copy App Secret** (click "Show" to reveal)

6. **Save Facebook Credentials:**
   - App ID: You'll use this in frontend
   - App Secret: Keep this secret (for backend if needed)

---

## Step 3: Configure Environment Variables

Create/Edit `frontend/.env` file:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_FACEBOOK_APP_ID=your_facebook_app_id_here
REACT_APP_API_URL=http://localhost:8000
```

**Replace:**
- `your_google_client_id_here` with your Google Client ID
- `your_facebook_app_id_here` with your Facebook App ID

---

## Step 4: Implementation Files

I've created these files for you:
- `src/components/Login.js` - Login component with 3 buttons
- `src/components/Login.css` - Styling for login page
- Updated `src/App.js` - Navigation logic

---

## Step 5: Start the App

1. **Make sure backend is running:**
   ```bash
   cd backend
   npm start  # or your backend start command
   ```

2. **Start frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Test login:**
   - App will show login page first
   - Try each login option:
     - ✅ Google login
     - ✅ Facebook login
     - ✅ Guest login

---

## Step 6: How It Works

### Google Login Flow:
1. User clicks "Sign in with Google"
2. Google OAuth popup opens
3. User signs in with Google
4. Google returns user info (name, email, picture)
5. App saves user session
6. Navigates to main app

### Facebook Login Flow:
1. User clicks "Sign in with Facebook"
2. Facebook OAuth popup opens
3. User signs in with Facebook
4. Facebook returns user info (name, email, picture)
5. App saves user session
6. Navigates to main app

### Guest Login Flow:
1. User clicks "Continue as Guest"
2. App generates temporary user ID
3. Saves to localStorage
4. Navigates to main app immediately

---

## Step 7: User Session Management

After login, user info is stored in:
- `localStorage` (persists after browser close)
- User object contains:
  - `id` - User ID
  - `name` - User name
  - `email` - User email (if available)
  - `picture` - Profile picture URL
  - `loginType` - "google", "facebook", or "guest"

---

## 🆘 Troubleshooting

### Google Login Issues:
- **"Error 400: redirect_uri_mismatch"**
  - Make sure `http://localhost:3000` is added to Authorized JavaScript origins
  
- **"Error: popup_closed_by_user"**
  - User closed the popup - this is normal, just try again

### Facebook Login Issues:
- **"Invalid App ID"**
  - Check that `REACT_APP_FACEBOOK_APP_ID` is correct in `.env`
  - Restart dev server after changing `.env`

- **"Redirect URI mismatch"**
  - Make sure redirect URI matches in Facebook app settings

### General Issues:
- **Login not working:**
  - Make sure `.env` file is in `frontend` folder
  - Restart dev server after changing `.env`
  - Check browser console for errors (F12)

- **After login, still on login page:**
  - Check `localStorage` in browser (F12 → Application → Local Storage)
  - Should see `wheeleat_user` key

---

## ✅ Checklist

Before testing:
- [ ] Google OAuth credentials created
- [ ] Facebook OAuth credentials created
- [ ] `.env` file created with both IDs
- [ ] Packages installed (`npm install`)
- [ ] Dev server restarted after `.env` changes
- [ ] Backend is running

---

## 📝 Notes

- **OAuth is FREE** - No paid APIs required
- **Guest login** works immediately (no setup needed)
- User data is stored locally (in browser)
- For production, you'll need to:
  - Update redirect URIs to your production domain
  - Add your production URL to authorized domains

---

## 🎯 Quick Start Commands

```bash
# Install packages
cd frontend
npm install @react-oauth/google react-facebook-login

# Add to .env file
echo REACT_APP_GOOGLE_CLIENT_ID=your_id_here > .env
echo REACT_APP_FACEBOOK_APP_ID=your_id_here >> .env

# Start app
npm start
```

---

## 📚 Next Steps

After login is working:
1. Customize login page styling
2. Add error handling messages
3. Add logout functionality
4. Store user preferences
5. Sync with backend API (optional)

---

**You're all set! Follow the steps above and you'll have a working login system! 🎉**

