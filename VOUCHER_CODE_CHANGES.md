# Voucher Code Changes - Removed `ensureFarCoffeeVoucherRow`

## What Changed

### Removed Function
- ❌ `ensureFarCoffeeVoucherRow()` - No longer automatically creates/updates vouchers

### New Function
- ✅ `getFarCoffeeVoucher()` - Reads voucher from database (returns null if not found)

### Updated Functions
- ✅ `spinFarCoffeeVoucher()` - Now checks if voucher exists before processing
- ✅ `listFarCoffeeUserVouchers()` - Returns empty list if voucher doesn't exist
- ✅ `expireFarCoffeeVouchers()` - Handles missing vouchers gracefully

## Behavior Changes

### Before
- Voucher was automatically created if it didn't exist
- Expiry was automatically updated to "today 5:00 PM MYT"

### After
- **Voucher must exist in database** - returns error if not found
- You control when vouchers are created/updated
- No automatic expiry updates

## How to Create/Manage Vouchers

See `MANUAL_VOUCHER_MANAGEMENT.md` for detailed instructions.

### Quick Start: Create Far Coffee Voucher

```sql
-- Calculate expiry: Today 5:00 PM Malaysia Time (GMT+8)
-- Current timestamp (replace with actual values)
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

### Using Wrangler CLI

```bash
# Create voucher in production
npx wrangler d1 execute wheeleat-db --remote --command="INSERT INTO vouchers (id, merchant_name, value_rm, total_qty, remaining_qty, expires_at_ms, created_at_ms, updated_at_ms) VALUES ('far_coffee_rm10_demo', 'Far Coffee', 10, 5, 5, 1736254800000, 1736242579000, 1736242579000);"
```

## Error Handling

### If Voucher Doesn't Exist

**`spinFarCoffeeVoucher()`** returns:
```json
{
  "won": false,
  "reason": "voucher_not_found",
  "remainingQty": 0,
  "expiryMs": 0,
  "message": "Voucher not found. Please create the voucher in the database first."
}
```

**`listFarCoffeeUserVouchers()`** returns:
```json
{
  "vouchers": [],
  "expiryMs": 0
}
```

## Daily Reset Workflow

Since vouchers are no longer auto-updated, you need to manually reset them daily:

```sql
-- Reset remaining quantity and update expiry for new day
UPDATE vouchers 
SET remaining_qty = total_qty,
    expires_at_ms = 1736254800000,  -- New expiry (today 5 PM MYT)
    updated_at_ms = 1736242579000   -- Current timestamp
WHERE id = 'far_coffee_rm10_demo';
```

You can automate this with:
- Cloudflare Cron Triggers
- External cron job
- Manual daily updates

## Benefits

✅ **Full Control** - You decide when vouchers are created/updated
✅ **No Auto-Updates** - Expiry won't change unless you update it
✅ **Explicit Management** - Clear visibility of voucher state
✅ **Flexible** - Easy to add new vouchers or modify existing ones

## Migration Notes

If you had vouchers created automatically before:
- They should still exist in the database
- No migration needed - just ensure vouchers exist before using
- Existing vouchers will continue to work

