# D1 Database Setup Instructions

## Step 1: Authenticate with Cloudflare

You need to authenticate wrangler with Cloudflare. Choose one method:

### Option A: Login via Browser (Recommended)
```bash
npx wrangler login
```
This will open a browser window for you to log in with your Cloudflare account.

### Option B: Use API Token
1. Go to https://developers.cloudflare.com/fundamentals/api/get-started/create-token/
2. Create a token with **D1:Edit** permissions
3. Set it as an environment variable:
   ```powershell
   $env:CLOUDFLARE_API_TOKEN = "your-token-here"
   ```

---

## Step 2: Create D1 Database

After authentication, run:
```bash
npx wrangler d1 create vouchers_schema
```

**Expected Output:**
```
✅ Successfully created DB 'vouchers_schema'!
Created your database using D1's new storage backend...

[[d1_databases]]
binding = "DB"
database_name = "vouchers_schema"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**⚠️ IMPORTANT:** Copy the `database_id` from the output!

---

## Step 3: Update wrangler.toml

Open `wrangler.toml` and replace the empty `database_id` with the ID from Step 2:

```toml
[[d1_databases]]
binding = "DB"
database_name = "vouchers_schema"
database_id = "your-actual-database-id-here"  # Paste the ID here
```

---

## Step 4: Initialize Local Database

```bash
npx wrangler d1 execute vouchers_schema --local --file=./functions/sql/vouchers_schema.sql
```

**Expected Output:**
```
✅ Successfully executed SQL file
```

---

## Step 5: Test Local Database

```bash
# Verify tables
npx wrangler d1 execute vouchers_schema --local --command="SELECT name FROM sqlite_master WHERE type='table';"

# Verify indexes
npx wrangler d1 execute vouchers_schema --local --command="SELECT name FROM sqlite_master WHERE type='index';"
```

---

## Step 6: Deploy Schema to Production

```bash
npx wrangler d1 execute vouchers_schema --remote --file=./functions/sql/vouchers_schema.sql
```

**⚠️ Warning:** This creates tables in production. Make sure you're ready!

---

## Step 7: Configure Cloudflare Pages Binding

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to your Pages project (`wheeleat-xp5` or your project name)
3. Go to **Settings** → **Functions**
4. Scroll to **D1 Database bindings**
5. Click **Add binding**
6. Configure:
   - **Variable name:** `DB` (must match `binding` in wrangler.toml)
   - **D1 Database:** Select `vouchers_schema`
   - Click **Save**

---

## Step 8: Test Production Database

```bash
npx wrangler d1 execute vouchers_schema --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
```

---

## Troubleshooting

### "CLOUDFLARE_API_TOKEN environment variable" error
- Run `npx wrangler login` to authenticate via browser
- Or set the API token as shown in Option B above

### "database_id" not found
- Make sure you copied the `database_id` from Step 2
- Update `wrangler.toml` with the correct ID

### "Binding not found" in Cloudflare Pages
- Make sure you added the D1 binding in Step 7
- Variable name must be exactly `DB` (case-sensitive)

