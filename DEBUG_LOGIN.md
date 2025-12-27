# Debug Login & Sign-Up System

## Quick Fix: Create .env File

### Step 1: Create the .env file

1. Navigate to the `frontend` folder
2. Create a new file named `.env` (no extension, just `.env`)
3. Add this line:
   ```
   REACT_APP_GOOGLE_CLIENT_ID=your-client-id-here
   ```
   Replace `your-client-id-here` with your actual Google Client ID

### Step 2: Get Your Google Client ID

If you don't have one yet:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/Select a project
3. Enable Google+ API or People API
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Copy the Client ID (looks like: `123456789-abc...apps.googleusercontent.com`)

### Step 3: Restart Your Development Server

**IMPORTANT:** After creating/updating `.env`, you MUST restart:
```bash
# Stop the server (Ctrl+C)
# Then restart:
cd frontend
npm start
```

React only reads `.env` files when it starts!

## Debugging with Console

I've added console logging to help debug. Open your browser's Developer Console (F12) and you'll see:

### What to Look For:

1. **On Page Load:**
   ```
   === App Component - Auth Check ===
   resetAuth: false forceLogin: false
   Saved user from localStorage: Found/Not found
   ```

2. **When Login Component Loads:**
   ```
   === Login Component Debug ===
   REACT_APP_GOOGLE_CLIENT_ID: [your-id or undefined]
   process.env keys: [...]
   All REACT_APP_ env vars: [...]
   ```

3. **When Clicking "Continue as Guest":**
   ```
   Guest login clicked
   Saving guest user to localStorage: {...}
   Calling onLogin callback for guest
   === handleLogin called ===
   User data received: {...}
   ```

4. **When Clicking "Sign in with Google":**
   ```
   GoogleLoginButton: Initializing Google OAuth login
   Google OAuth Success - Token received: {...}
   Fetching user info from Google API...
   User info received: {...}
   Saving user to localStorage: {...}
   ```

## Common Issues & Solutions

### Issue 1: "Google Client ID not found"

**Symptoms:**
- Console shows: `REACT_APP_GOOGLE_CLIENT_ID: undefined`
- Login page shows error message

**Solutions:**
1. ✅ Create `frontend/.env` file (not in root!)
2. ✅ Add: `REACT_APP_GOOGLE_CLIENT_ID=your-actual-id`
3. ✅ Restart React dev server
4. ✅ Check file name is exactly `.env` (not `.env.txt`)

### Issue 2: Guest Login Works, Google Doesn't

**Symptoms:**
- Guest login works fine
- Google login shows error or doesn't work

**Solutions:**
1. Check console for OAuth errors
2. Verify Google Client ID is correct (no extra spaces)
3. Check Google Cloud Console:
   - Authorized JavaScript origins include your domain
   - Authorized redirect URIs include your domain
4. Check browser console for CORS or OAuth errors

### Issue 3: Login Works But User Not Saved

**Symptoms:**
- Login succeeds but user disappears on refresh

**Solutions:**
1. Check console for localStorage errors
2. Check browser settings (some browsers block localStorage)
3. Try in incognito/private mode
4. Check if localStorage is being cleared

### Issue 4: For Cloudflare Pages (Production)

**Symptoms:**
- Works locally but not in production

**Solutions:**
1. Go to Cloudflare Pages Dashboard
2. Settings → Environment Variables
3. Add: `REACT_APP_GOOGLE_CLIENT_ID` = `your-client-id`
4. Redeploy

## Testing Helpers

You can use these URL parameters to test:

- `/?resetAuth=1` - Clears saved user and shows login
- `/?forceLogin=1` - Shows login without clearing saved user

## Console Commands for Testing

Open browser console (F12) and try:

```javascript
// Check if user is saved
localStorage.getItem('wheeleat_user')

// Clear saved user
localStorage.removeItem('wheeleat_user')

// Check environment variables (in console)
Object.keys(process.env).filter(k => k.includes('GOOGLE'))

// Force reload
window.location.reload()
```


