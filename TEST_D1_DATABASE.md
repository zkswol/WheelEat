# Testing D1 Database Integration

## How to Test Your D1 Database

After deploying to Cloudflare Pages, you can test your D1 database in several ways:

---

## Method 1: Test via Browser (Easiest)

### Step 1: Get Your Deployment URL

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → Your project (`wheeleat`)
3. Click on **"Deployments"** tab
4. Find your latest deployment
5. Click on the deployment URL (looks like: `https://wheeleat-xxxxx.pages.dev` or your custom domain)

### Step 2: Test the `/api/users` Endpoint

**Option A: Direct URL**
- Open your browser
- Go to: `https://YOUR-DEPLOYMENT-URL.pages.dev/api/users`
- Replace `YOUR-DEPLOYMENT-URL` with your actual deployment URL

**Expected Response:**
```json
{
  "success": true,
  "count": 2,
  "users": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": 1735315200,
      "updated_at": 1735315200
    },
    {
      "id": "2",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "created_at": 1735315200,
      "updated_at": 1735315200
    }
  ]
}
```

**If it works:** ✅ You'll see JSON data with users
**If it fails:** ❌ You'll see an error message

---

## Method 2: Test via Browser Developer Tools

1. Open your deployment URL in browser
2. Press `F12` (or right-click → Inspect) to open Developer Tools
3. Go to **Console** tab
4. Type this command and press Enter:

```javascript
fetch('/api/users')
  .then(res => res.json())
  .then(data => console.log('Users:', data))
  .catch(err => console.error('Error:', err));
```

You should see the users data logged in the console.

---

## Method 3: Test via Command Line (curl)

### Windows PowerShell:
```powershell
# Replace YOUR-URL with your actual deployment URL
Invoke-WebRequest -Uri "https://YOUR-URL.pages.dev/api/users" | Select-Object -ExpandProperty Content
```

### Windows CMD:
```cmd
curl https://YOUR-URL.pages.dev/api/users
```

### Mac/Linux:
```bash
curl https://YOUR-URL.pages.dev/api/users
```

---

## Method 4: Test the Spin Endpoint (POST)

The spin endpoint saves data to D1. Test it with:

### Browser Console:
```javascript
fetch('/api/spin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    selected_categories: ['Chinese', 'Fast Food'],
    mall_id: 'sunway_square',
    dietary_need: 'any'
  })
})
  .then(res => res.json())
  .then(data => console.log('Spin result:', data))
  .catch(err => console.error('Error:', err));
```

### PowerShell:
```powershell
$body = @{
  selected_categories = @('Chinese', 'Fast Food')
  mall_id = 'sunway_square'
  dietary_need = 'any'
} | ConvertTo-Json

Invoke-WebRequest -Uri "https://YOUR-URL.pages.dev/api/spin" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

---

## Method 5: View Data in D1 Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **D1**
3. Click on your database (`wheeleat-db`)
4. Go to **"Data"** tab
5. Select the `spin_logs` or `users` table
6. You should see all the data stored in D1

---

## Common Issues & Solutions

### Issue 1: "Missing D1 database binding"
**Error:** `Missing D1 database binding`

**Solution:**
1. Go to Cloudflare Pages → Settings → Functions
2. Check that D1 binding is configured with variable name `DB`
3. Make sure you saved the binding
4. Redeploy your project

### Issue 2: "Table not found"
**Error:** `no such table: users`

**Solution:**
1. Go to D1 dashboard
2. Check that tables `users` and `spin_logs` exist
3. If missing, create them using the SQL Editor (see `D1_TABLE_SETUP.md`)

### Issue 3: Empty response or no users
**Response:** `{"success": true, "count": 0, "users": []}`

**Solution:**
- This is normal if you haven't inserted any users yet
- Add test data using D1 SQL Editor:
  ```sql
  INSERT INTO users (id, name, email, created_at) VALUES
    ('1', 'John Doe', 'john@example.com', (unixepoch())),
    ('2', 'Jane Smith', 'jane@example.com', (unixepoch()));
  ```

### Issue 4: CORS errors
**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
- Check that your Functions have CORS headers
- The `createCORSResponse` function should handle this
- Make sure you're testing from the same domain (not localhost)

---

## Quick Test Checklist

- [ ] D1 database binding is configured (`DB` variable)
- [ ] Tables `users` and `spin_logs` exist in D1
- [ ] At least 2 test users exist in `users` table
- [ ] Deployment is successful
- [ ] `/api/users` returns JSON with users
- [ ] `/api/spin` saves data to `spin_logs` table
- [ ] Data appears in D1 dashboard

---

## Expected Test Results

### ✅ Success Indicators:
- `/api/users` returns `{"success": true, "count": 2, "users": [...]}`
- `/api/spin` returns restaurant data with `spin_id`
- New rows appear in `spin_logs` table after spinning
- No errors in browser console or network tab

### ❌ Failure Indicators:
- Error messages about missing binding
- Error messages about table not found
- Empty responses or 500 errors
- CORS errors in browser console

---

## Need Help?

If you encounter issues:
1. Check Cloudflare Pages deployment logs
2. Check browser console for errors
3. Verify D1 binding in Cloudflare dashboard
4. Verify tables exist in D1 dashboard
5. Check that you're using the correct deployment URL

