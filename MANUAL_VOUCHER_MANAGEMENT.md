# Manual Voucher Management Guide

## Overview
After removing `ensureFarCoffeeVoucherRow`, you'll need to manually create and manage vouchers in the database.

## Voucher Table Structure

```sql
CREATE TABLE vouchers (
  id TEXT PRIMARY KEY,
  merchant_name TEXT NOT NULL,
  value_rm INTEGER NOT NULL CHECK (value_rm > 0),
  total_qty INTEGER NOT NULL CHECK (total_qty >= 0),
  remaining_qty INTEGER NOT NULL CHECK (remaining_qty >= 0),
  expires_at_ms INTEGER NOT NULL CHECK (expires_at_ms > 0),
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);
```

## Common Voucher Operations

### 1. Create a New Voucher

```sql
INSERT INTO vouchers (
  id, merchant_name, value_rm, total_qty, remaining_qty, 
  expires_at_ms, created_at_ms, updated_at_ms
) VALUES (
  'voucher_id_here',           -- Unique voucher ID
  'Merchant Name',              -- e.g., 'Far Coffee'
  10,                           -- Value in RM
  5,                            -- Total quantity available
  5,                            -- Remaining quantity (start with total_qty)
  1736254800000,                -- Expiry timestamp (UTC milliseconds)
  1736242579000,                -- Created timestamp (UTC milliseconds)
  1736242579000                 -- Updated timestamp (UTC milliseconds)
);
```

### 2. Create Far Coffee RM10 Voucher (Example)

```sql
-- Calculate expiry: Today 5:00 PM Malaysia Time (GMT+8)
-- Malaysia time = UTC + 8, so 17:00 MYT == 09:00 UTC
-- Use this formula in your code or calculate manually

INSERT INTO vouchers (
  id, merchant_name, value_rm, total_qty, remaining_qty, 
  expires_at_ms, created_at_ms, updated_at_ms
) VALUES (
  'far_coffee_rm10_demo',
  'Far Coffee',
  10,
  5,
  5,
  1736254800000,  -- Replace with actual expiry timestamp
  1736242579000,  -- Replace with current timestamp
  1736242579000   -- Replace with current timestamp
);
```

### 3. Update Voucher Stock (Restock)

```sql
-- Reset remaining quantity to total quantity
UPDATE vouchers 
SET remaining_qty = total_qty,
    updated_at_ms = 1736242579000  -- Current timestamp
WHERE id = 'far_coffee_rm10_demo';
```

### 4. Update Voucher Expiry

```sql
-- Update expiry to new date/time
UPDATE vouchers 
SET expires_at_ms = 1736254800000,  -- New expiry timestamp
    updated_at_ms = 1736242579000    -- Current timestamp
WHERE id = 'far_coffee_rm10_demo';
```

### 5. Check Voucher Status

```sql
-- View all vouchers
SELECT 
  id,
  merchant_name,
  value_rm,
  total_qty,
  remaining_qty,
  expires_at_ms,
  datetime(expires_at_ms/1000, 'unixepoch') as expires_at_readable,
  datetime(created_at_ms/1000, 'unixepoch') as created_at_readable
FROM vouchers;

-- Check specific voucher
SELECT * FROM vouchers WHERE id = 'far_coffee_rm10_demo';

-- Check if voucher is expired
SELECT 
  id,
  merchant_name,
  remaining_qty,
  CASE 
    WHEN expires_at_ms > 1736242579000 THEN 'Active'
    ELSE 'Expired'
  END as status
FROM vouchers 
WHERE id = 'far_coffee_rm10_demo';
```

### 6. Delete a Voucher

```sql
-- Delete voucher (will also delete related user_vouchers due to foreign key)
DELETE FROM vouchers WHERE id = 'voucher_id_here';
```

### 7. View User Vouchers

```sql
-- View all user vouchers for a specific user
SELECT 
  uv.id,
  uv.user_id,
  uv.status,
  uv.issued_at_ms,
  uv.expired_at_ms,
  v.merchant_name,
  v.value_rm
FROM user_vouchers uv
JOIN vouchers v ON v.id = uv.voucher_id
WHERE uv.user_id = 'user_id_here'
ORDER BY uv.issued_at_ms DESC;
```

## Using Wrangler CLI

### Execute SQL Commands

```bash
# Local database
npx wrangler d1 execute wheeleat-db --local --command="YOUR_SQL_HERE"

# Production database
npx wrangler d1 execute wheeleat-db --remote --command="YOUR_SQL_HERE"
```

### Examples

```bash
# Create voucher in production
npx wrangler d1 execute wheeleat-db --remote --command="INSERT INTO vouchers (id, merchant_name, value_rm, total_qty, remaining_qty, expires_at_ms, created_at_ms, updated_at_ms) VALUES ('far_coffee_rm10_demo', 'Far Coffee', 10, 5, 5, 1736254800000, 1736242579000, 1736242579000);"

# Check voucher status
npx wrangler d1 execute wheeleat-db --remote --command="SELECT * FROM vouchers WHERE id='far_coffee_rm10_demo';"

# Restock voucher
npx wrangler d1 execute wheeleat-db --remote --command="UPDATE vouchers SET remaining_qty = total_qty, updated_at_ms = 1736242579000 WHERE id = 'far_coffee_rm10_demo';"
```

## Timestamp Calculation

### Calculate Expiry Timestamp (JavaScript)

```javascript
// Today 5:00 PM Malaysia Time (GMT+8) as UTC epoch milliseconds
function malaysiaToday5pmUtcMs(nowUtcMs = Date.now()) {
  const MY_OFFSET_MS = 8 * 60 * 60 * 1000; // +8 hours
  const myNow = new Date(nowUtcMs + MY_OFFSET_MS);
  const y = myNow.getUTCFullYear();
  const m = myNow.getUTCMonth();
  const d = myNow.getUTCDate();
  // 17:00 MYT -> 09:00 UTC
  return Date.UTC(y, m, d, 9, 0, 0, 0);
}

// Usage
const expiryMs = malaysiaToday5pmUtcMs();
const nowMs = Date.now();
```

### Calculate Timestamp (Online Tools)

- Use [Epoch Converter](https://www.epochconverter.com/)
- Convert your desired date/time to UTC
- Convert to milliseconds (multiply seconds by 1000)

## Daily Reset Workflow

If you want to reset vouchers daily:

```sql
-- Reset remaining quantity and update expiry for new day
UPDATE vouchers 
SET remaining_qty = total_qty,
    expires_at_ms = 1736254800000,  -- New expiry (today 5 PM MYT)
    updated_at_ms = 1736242579000   -- Current timestamp
WHERE id = 'far_coffee_rm10_demo';
```

## Best Practices

1. **Always set `remaining_qty = total_qty` when creating new vouchers**
2. **Use consistent timestamp format (UTC milliseconds)**
3. **Update `updated_at_ms` whenever modifying a voucher**
4. **Check expiry before issuing vouchers**
5. **Monitor `remaining_qty` to prevent over-issuance**

## Troubleshooting

### Voucher not showing up?
- Check if voucher exists: `SELECT * FROM vouchers WHERE id = 'your_voucher_id';`
- Check if expired: Compare `expires_at_ms` with current timestamp
- Check remaining quantity: `remaining_qty` should be > 0

### Vouchers not being issued?
- Check `remaining_qty > 0`
- Check `expires_at_ms > current_timestamp`
- Check database binding is configured in Cloudflare Pages

