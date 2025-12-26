# 🔐 Login System Setup Guide - WheelEat (Google + Guest Only)

Complete step-by-step guide to implement Google OAuth and Guest login.

---

## 📋 Overview

This guide will help you implement two login options:
1. **Sign in with Google** (OAuth)
2. **Guest login** (Anonymous, no setup required)

---

## Step 1: Install Required Package

Open terminal in `frontend` folder and run:

```bash
cd frontend
npm install @react-oauth/google --legacy-peer-deps
```

**Note:** The `--legacy-peer-deps` flag handles any minor dependency warnings.

---

## Step 2: Get Google OAuth Credentials

### 🔵 Google OAuth Setup

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create/Select Project:**
   - Click project dropdown → "NEW PROJECT"
   - Name: `WheelEat` → Click "CREATE"
   - Wait for project creation, then select it

3. **Enable Google+ API:**
   - Go to: "APIs & Services" → "Library"
   - Search: "Google+ API" → Click "ENABLE"
   - Wait for it to enable

4. **Configure OAuth Consent Screen:**
   - Go to: "APIs & Services" → "OAuth consent screen"
   - User Type: **External** (unless you have Google Workspace)
   - Click "CREATE"
   
   **Fill required fields:**
   - App name: `WheelEat`
   - User support email: Your email
   - Developer contact: Your email
   - Click "SAVE AND CONTINUE"
   
   **Scopes:**
   - Click "ADD OR REMOVE SCOPES"
   - Check: `email`, `profile`, `openid`
   - Click "UPDATE" → "SAVE AND CONTINUE"
   
   **Test users (optional for testing):**
   - Add your email if you want to test
   - Click "SAVE AND CONTINUE"
   - Click "BACK TO DASHBOARD"

5. **Create OAuth 2.0 Credentials:**
   - Go to: "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: **Web application**
   - Name: `WheelEat Web Client`
   
   **Authorized JavaScript origins:**
   - Add: `http://localhost:3000`
   
   **Authorized redirect URIs:**
   - Add: `http://localhost:3000`
   
   - Click "CREATE"
   - **Copy the Client ID** (looks like: `123456789-abc.apps.googleusercontent.com`)

6. **Save Google Client ID:**
   - You'll use this in the next step!

---

## Step 3: Configure Environment Variables

Create/Edit `frontend/.env` file:

```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_API_URL=http://localhost:8000
```

**Replace:**
- `your_google_client_id_here` with your actual Google Client ID (from Step 2)

**Important:** 
- The `.env` file should be in the `frontend` folder
- After creating/editing `.env`, **restart your dev server** (stop and run `npm start` again)

---

## Step 4: Start the App

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
     - ✅ Google login (requires OAuth setup)
     - ✅ Guest login (works immediately, no setup)

---

## Step 5: How It Works

### Google Login Flow:
1. User clicks "Sign in with Google"
2. Google OAuth popup opens
3. User signs in with Google
4. Google returns user info (name, email, picture)
5. App saves user session
6. Navigates to main app

### Guest Login Flow:
1. User clicks "Continue as Guest"
2. App generates temporary user ID
3. Saves to localStorage
4. Navigates to main app immediately
5. **No setup required!**

---

## Step 6: User Session Management

After login, user info is stored in:
- `localStorage` (persists after browser close)
- User object contains:
  - `id` - User ID
  - `name` - User name
  - `email` - User email (if available)
  - `picture` - Profile picture URL
  - `loginType` - "google" or "guest"

---

## 🆘 Troubleshooting

### Google Login Issues:

**"Error 400: redirect_uri_mismatch"**
- Make sure `http://localhost:3000` is added to Authorized JavaScript origins in Google Cloud Console
- Check that you're using the correct Client ID

**"Error: popup_closed_by_user"**
- User closed the popup - this is normal, just try again

**"Invalid client"**
- Check that `REACT_APP_GOOGLE_CLIENT_ID` in `.env` is correct
- Make sure there are no extra spaces
- Restart dev server after changing `.env`

**"OAuth consent screen not configured"**
- Go back to Step 2, Step 4 and complete OAuth consent screen setup

### General Issues:

**Login not working:**
- Make sure `.env` file is in `frontend` folder
- Restart dev server after changing `.env`
- Check browser console for errors (F12)

**After login, still on login page:**
- Check `localStorage` in browser (F12 → Application → Local Storage)
- Should see `wheeleat_user` key

**Guest login not working:**
- This should always work - if it doesn't, check browser console for errors

---

## ✅ Checklist

Before testing:
- [ ] Package installed (`@react-oauth/google`)
- [ ] Google OAuth credentials created
- [ ] `.env` file created with Google Client ID
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
# Install package
cd frontend
npm install @react-oauth/google --legacy-peer-deps

# Create .env file (in frontend folder)
# Add: REACT_APP_GOOGLE_CLIENT_ID=your_id_here

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

## 🎉 You're All Set!

Follow the steps above and you'll have a working login system with Google and Guest options!

**Need help?** Check the troubleshooting section or browser console (F12) for error messages.

