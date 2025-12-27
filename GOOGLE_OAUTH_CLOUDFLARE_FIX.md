# Fix: Google OAuth redirect_uri_mismatch Error on Cloudflare Pages

## Problem

You're seeing this error:
```
Error 400: redirect_uri_mismatch
origin=https://003f3ebd.wheeleat-xp5.pages.dev
```

This happens because the preview deployment URL isn't registered in Google Cloud Console.

## Solution: Add All Cloudflare Pages URLs

### Step 1: Go to Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to **APIs & Services** → **Credentials**
4. Find your OAuth 2.0 Client ID
5. Click the **pencil icon** (Edit) to edit it

### Step 2: Add Authorized JavaScript Origins

In the **Authorized JavaScript origins** section, add these URLs:

1. **Production URL:**
   ```
   https://wheeleat-xp5.pages.dev
   ```

2. **Preview Deployment URL (from error):**
   ```
   https://003f3ebd.wheeleat-xp5.pages.dev
   ```

3. **Local Development:**
   ```
   http://localhost:3000
   ```

### Step 3: Add Authorized Redirect URIs

In the **Authorized redirect URIs** section, add the same URLs:

1. **Production URL:**
   ```
   https://wheeleat-xp5.pages.dev
   ```

2. **Preview Deployment URL:**
   ```
   https://003f3ebd.wheeleat-xp5.pages.dev
   ```

3. **Local Development:**
   ```
   http://localhost:3000
   ```

### Step 4: Save

Click **"Save"** at the bottom of the page.

## Important Notes

### About Preview Deployments

- Cloudflare Pages creates a **unique preview URL** for each deployment
- The URL format is: `https://[hash].wheeleat-xp5.pages.dev`
- Each preview deployment has a different hash (like `003f3ebd`)

### Options for Preview Deployments

**Option 1: Add Each Preview URL (Manual)**
- When you get a new preview deployment, add its URL to Google Cloud Console
- This works but requires manual updates

**Option 2: Use Production URL Only (Recommended)**
- Only add the production URL: `https://wheeleat-xp5.pages.dev`
- Test preview deployments by merging to main (which deploys to production)
- Or use guest login for testing preview deployments

**Option 3: Use Custom Domain**
- Set up a custom domain in Cloudflare Pages
- Add that domain to Google Cloud Console
- All deployments (including previews) will use the same domain

## Quick Fix for Current Error

Right now, add these URLs to fix the immediate error:

**Authorized JavaScript origins:**
- `https://wheeleat-xp5.pages.dev`
- `https://003f3ebd.wheeleat-xp5.pages.dev`
- `http://localhost:3000`

**Authorized redirect URIs:**
- `https://wheeleat-xp5.pages.dev`
- `https://003f3ebd.wheeleat-xp5.pages.dev`
- `http://localhost:3000`

After saving, wait a few minutes for Google to update, then try signing in again.

## Verification

After adding the URLs:
1. Wait 2-3 minutes for Google to update
2. Try signing in with Google again
3. The error should be gone

If you still get errors, check:
- The URL in the error message matches what you added
- You saved the changes in Google Cloud Console
- You waited a few minutes for propagation


