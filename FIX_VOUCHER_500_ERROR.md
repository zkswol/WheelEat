# Fix Voucher 500 Error

## Problem
You're getting 500 errors from:
- `/api/vouchers/spin`
- `/api/vouchers?user_id=...`
- `/api/page-views`

## Root Cause
The D1 database binding (`DB`) is **not configured** in Cloudflare Pages production environment.

## Solution: Configure D1 Database Binding

### Step 1: Go to Cloudflare Dashboard
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **Pages**
3. Click on your project: **wheeleat-xp5** (or your project name)

### Step 2: Configure D1 Binding
1. Go to **Settings** tab
2. Scroll down to **Functions** section
3. Find **D1 Database bindings**
4. Click **Add binding** (or edit existing if there's one)

### Step 3: Configure the Binding
- **Variable name:** `DB` (must be exactly `DB` - case sensitive)
- **D1 Database:** Select `wheeleat-db` from the dropdown
- Click **Save**

### Step 4: Redeploy
After saving, you need to trigger a new deployment:
1. Go to **Deployments** tab
2. Click **Retry deployment** on the latest deployment, OR
3. Push a new commit to trigger a new deployment

## Verification

After redeploying, the endpoints should work. The error messages have been improved to show:
- Clear error message if DB binding is missing
- Helpful hints on how to fix it

## Expected Behavior After Fix

✅ `/api/vouchers/spin` - Should return voucher data or `{ won: false, reason: 'sold_out' }`
✅ `/api/vouchers?user_id=...` - Should return list of user vouchers
✅ Vouchers should appear in the UI after spinning

## If Still Getting Errors

1. **Check Cloudflare Pages Logs:**
   - Go to **Deployments** → Click on latest deployment → **View logs**
   - Look for error messages

2. **Verify Database Binding:**
   - Go to **Settings** → **Functions** → **D1 Database bindings**
   - Confirm `DB` → `wheeleat-db` is configured

3. **Check Database:**
   ```bash
   npx wrangler d1 execute wheeleat-db --remote --command="SELECT * FROM vouchers WHERE id='far_coffee_rm10_demo';"
   ```

## Note
The code now includes better error handling that will show you exactly what's wrong if the binding is missing.

