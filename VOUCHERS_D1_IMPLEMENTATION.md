# Vouchers D1 Database Implementation Plan

## Schema Review

### ✅ Schema Quality Assessment

The `functions/sql/vouchers_schema.sql` file is **well-designed** and production-ready:

1. **Table Structure:**
   - `vouchers` table: Stores voucher definitions (merchant, value, quantity, expiry)
   - `user_vouchers` table: Tracks individual vouchers issued to users
   - Proper foreign key relationship between tables

2. **Data Integrity:**
   - ✅ Foreign keys enabled (`PRAGMA foreign_keys = ON`)
   - ✅ CHECK constraints on critical fields (value_rm > 0, status enum)
   - ✅ Proper indexes for query performance
   - ✅ Timestamps stored as UTC epoch milliseconds (consistent with codebase)

3. **Indexes:**
   - ✅ `idx_vouchers_expires_at` - For expiry queries
   - ✅ `idx_user_vouchers_user` - For user voucher lookups
   - ✅ `idx_user_vouchers_status` - For filtering by status
   - ✅ `idx_user_vouchers_expired_at` - For expiry checks
   - ✅ `idx_user_vouchers_voucher` - For voucher joins

4. **Compatibility:**
   - ✅ Uses `CREATE TABLE IF NOT EXISTS` (safe for re-runs)
   - ✅ Uses `CREATE INDEX IF NOT EXISTS` (idempotent)
   - ✅ Compatible with existing code in `farCoffeeVoucher.js`

---

## Implementation Steps

### Step 1: Create D1 Database (if not exists)

```bash
# Create production D1 database
npx wrangler d1 create wheeleat-db

# This will output:
# ✅ Successfully created DB 'wheeleat-db'!
# Created your database using D1's new storage backend. The new storage backend is not yet recommended for production workloads, but backs up your data via snapshots to R2.
# [[d1_databases]]
# binding = "DB"
# database_name = "wheeleat-db"
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**Note:** Save the `database_id` - you'll need it for local development.

---

### Step 2: Update `wrangler.toml`

Add the D1 database binding to `wrangler.toml`:

```toml
name = "wheeleat"
compatibility_date = "2024-01-01"

# D1 Database binding
[[d1_databases]]
binding = "DB"
database_name = "wheeleat-db"
database_id = "your-database-id-here"  # Replace with actual ID from Step 1

[env.production]
name = "wheeleat"

[env.production.vars]
# Environment variables should be set in Cloudflare Pages dashboard
# SUPABASE_URL = "your-supabase-url"
# SUPABASE_ANON_KEY = "your-supabase-anon-key"
```

---

### Step 3: Initialize Local D1 Database

```bash
# Navigate to project root
cd "C:\Users\user\OneDrive\Documents\3143(2)\WheelEat"

# Initialize local D1 database with schema
npx wrangler d1 execute wheeleat-db --local --file=./functions/sql/vouchers_schema.sql
```

**Expected Output:**
```
✅ Successfully executed SQL file
```

---

### Step 4: Test Local Database

```bash
# Verify tables were created
npx wrangler d1 execute wheeleat-db --local --command="SELECT name FROM sqlite_master WHERE type='table';"

# Expected output:
# vouchers
# user_vouchers

# Verify indexes
npx wrangler d1 execute wheeleat-db --local --command="SELECT name FROM sqlite_master WHERE type='index';"

# Expected output:
# idx_vouchers_expires_at
# idx_user_vouchers_user
# idx_user_vouchers_status
# idx_user_vouchers_expired_at
# idx_user_vouchers_voucher
```

---

### Step 5: Deploy Schema to Production D1

```bash
# Deploy schema to production D1 database
npx wrangler d1 execute wheeleat-db --remote --file=./functions/sql/vouchers_schema.sql
```

**⚠️ Important:** This will create the tables in production. Make sure you're ready before running this.

---

### Step 6: Configure Cloudflare Pages

1. **Go to Cloudflare Dashboard:**
   - Navigate to your Pages project: `wheeleat-xp5` (or your project name)
   - Go to **Settings** → **Functions**

2. **Bind D1 Database:**
   - Under **D1 Database bindings**, click **Add binding**
   - **Variable name:** `DB` (must match `binding` in wrangler.toml)
   - **D1 Database:** Select `wheeleat-db`
   - Click **Save**

3. **Verify Environment:**
   - The `DB` binding will be available in your Functions via `env.DB`
   - This matches what `getD1Database(env)` expects

---

### Step 7: Test Production Database

```bash
# Test production database
npx wrangler d1 execute wheeleat-db --remote --command="SELECT name FROM sqlite_master WHERE type='table';"
```

---

## Is D1 Real-Time?

### ❌ **No, D1 is NOT real-time** in the traditional sense

**D1 Characteristics:**

1. **Eventual Consistency:**
   - D1 uses Cloudflare's distributed SQLite
   - Writes are eventually consistent (typically < 1 second)
   - Reads may see slightly stale data immediately after writes

2. **No WebSocket/SSE:**
   - D1 doesn't support real-time subscriptions
   - No built-in change streams or triggers
   - You must poll or use request/response pattern

3. **Best Practices for "Near Real-Time":**
   - ✅ Use atomic transactions (`db.batch()`) for consistency
   - ✅ Poll endpoints periodically (e.g., every 5-10 seconds)
   - ✅ Use optimistic UI updates in frontend
   - ✅ Implement retry logic for failed operations

### ✅ **Your Current Implementation is Correct:**

Your `farCoffeeVoucher.js` already handles this properly:

1. **Atomic Operations:**
   ```javascript
   await db.batch([...])  // Ensures atomicity
   ```

2. **Stock Management:**
   - Uses `changes()` to verify updates
   - Prevents race conditions with WHERE clauses
   - Properly handles concurrent requests

3. **Frontend Polling:**
   - Frontend can poll `/api/vouchers?user_id=...` periodically
   - Or refresh after user actions (spin, remove)

---

## Current Code Status

### ✅ Already Implemented:

1. **Backend Functions:**
   - `functions/api/vouchers/spin.js` - Issue vouchers
   - `functions/api/vouchers/remove.js` - Remove vouchers
   - `functions/api/vouchers.js` - List user vouchers
   - `functions/api/lib/farCoffeeVoucher.js` - Core logic

2. **Frontend Components:**
   - `VoucherOfferModal.js` - Shows voucher when won
   - `VoucherWalletModal.js` - Displays user's vouchers
   - API functions in `services/api.js`

3. **Database Utilities:**
   - `functions/api/lib/d1.js` - D1 connection helper

### ⚠️ Missing:

1. **D1 Database Setup:**
   - Database not created yet
   - Schema not deployed
   - Binding not configured in Cloudflare Pages

---

## Testing Checklist

After deployment, test:

- [ ] Schema deployed successfully
- [ ] Tables exist: `vouchers`, `user_vouchers`
- [ ] Indexes created
- [ ] Foreign keys working
- [ ] Can issue voucher via `/api/vouchers/spin`
- [ ] Stock decrements correctly
- [ ] Can list vouchers via `/api/vouchers?user_id=...`
- [ ] Can remove voucher via `/api/vouchers/remove`
- [ ] Stock increments on remove
- [ ] Expired vouchers auto-expire and restock
- [ ] Concurrent requests handled correctly

---

## Summary

**Schema Quality:** ✅ Excellent - Production ready

**Implementation Status:** 
- ✅ Code: Complete
- ⚠️ Database: Needs setup

**Real-Time:** ❌ No - D1 is eventually consistent (typically < 1s delay)

**Next Steps:**
1. Create D1 database
2. Deploy schema
3. Configure Cloudflare Pages binding
4. Test end-to-end

The schema matches your existing code perfectly - you just need to deploy it to D1!

