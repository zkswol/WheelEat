# Google OAuth Setup Guide for WheelEat

## Problem
If you're seeing an error about "Google ID has problem" or "Google Client ID not found", you need to set up Google OAuth credentials.

## Quick Solution

### Option 1: Use Guest Login (Recommended for Testing)
Just click "Continue as Guest" - you don't need Google OAuth for this!

### Option 2: Set Up Google OAuth (Required for Google Sign-In)

## Step-by-Step Instructions

### Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click "Select a project" → "New Project"
   - Project name: `WheelEat` (or any name)
   - Click "Create"
4. Wait for project to be created, then select it

### Step 2: Enable Google+ API

1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"People API"**
3. Click on it and click **"Enable"**

### Step 3: Create OAuth 2.0 Client ID

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. If prompted, configure the OAuth consent screen:
   - User Type: **"External"** → **"Create"**
   - App name: `WheelEat`
   - User support email: Your email
   - Developer contact: Your email
   - Click **"Save and Continue"**
   - Click **"Save and Continue"** again (skip scopes)
   - Click **"Save and Continue"** (skip test users)
   - Click **"Back to Dashboard"**
4. Now create the OAuth Client ID:
   - Application type: **"Web application"**
   - Name: `WheelEat Web Client`
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (for local development)
     - `https://wheeleat.vercel.app` (for production - replace with your actual URL)
   - **Authorized redirect URIs:**
     - `http://localhost:3000` (for local development)
     - `https://wheeleat.vercel.app` (for production)
   - Click **"Create"**
5. **COPY THE CLIENT ID** - it looks like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`

### Step 4: Add Client ID to Your Project

1. In your project, go to `frontend` folder
2. Create a file named `.env` (or `.env.local`)
3. Add this line:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
   ```
   Replace `YOUR_CLIENT_ID_HERE` with the Client ID you copied

   Example:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
   ```

### Step 5: Restart Your React App

1. Stop your React app (Ctrl+C)
2. Start it again:
   ```bash
   cd frontend
   npm start
   ```

### Step 6: For Production (Vercel Deployment)

1. Go to your Vercel project dashboard
2. Go to **Settings** → **Environment Variables**
3. Add:
   - Name: `REACT_APP_GOOGLE_CLIENT_ID`
   - Value: Your Client ID (the same one)
4. Click **"Save"**
5. Redeploy your project

## Troubleshooting

### "Google Client ID not found"
- Make sure the `.env` file is in the `frontend` folder (not root)
- Make sure the variable name is exactly: `REACT_APP_GOOGLE_CLIENT_ID`
- Restart your React app after creating/updating `.env`

### "Google ID has problem" or OAuth errors
- Check that the Client ID is correct (no extra spaces)
- Make sure you enabled Google+ API or People API
- Make sure your domain is added to "Authorized JavaScript origins" in Google Cloud Console
- For production, use your actual Vercel URL in Google Cloud Console settings

### Still not working?
Just use "Continue as Guest" - it works perfectly fine for testing!

## Notes

- The `.env` file should NOT be committed to Git (it's already in `.gitignore`)
- For production, you MUST add the environment variable in Vercel dashboard
- The Client ID is safe to use in frontend code (it's public)

