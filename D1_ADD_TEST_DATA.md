# Add Test Data to D1 Database

## Your `/api/users` Endpoint is Working! ✅

You got this response:
```json
{
  "success": true,
  "count": 0,
  "users": []
}
```

This means:
- ✅ D1 database binding is working
- ✅ The `users` table exists
- ❌ The table is just empty (no data yet)

---

## How to Add Test Data

### Method 1: Using D1 SQL Editor (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **D1**
3. Click on your database (`wheeleat-db`)
4. Go to **"SQL Editor"** tab
5. Click **"New query"**
6. Paste this SQL:

```sql
-- Insert test users
INSERT INTO users (id, name, email, created_at, updated_at) VALUES
  ('1', 'John Doe', 'john@example.com', (unixepoch()), (unixepoch())),
  ('2', 'Jane Smith', 'jane@example.com', (unixepoch()), (unixepoch())),
  ('3', 'Bob Johnson', 'bob@example.com', (unixepoch()), (unixepoch()));
```

7. Click **"Run"** (or press `Ctrl+Enter`)
8. You should see: **"Success. 3 rows inserted"**

### Method 2: Using D1 Data Tab (Visual)

1. Go to D1 dashboard → Your database
2. Click **"Data"** tab
3. Select **"users"** table
4. Click **"Insert row"** button
5. Fill in:
   - **id**: `1`
   - **name**: `John Doe`
   - **email**: `john@example.com`
   - **created_at**: `1735315200` (or leave empty)
   - **updated_at**: `1735315200` (or leave empty)
6. Click **"Save"**
7. Repeat for more users

---

## Verify Data Was Added

### Option 1: Test the API Again
Visit: `https://YOUR-URL.pages.dev/api/users`

You should now see:
```json
{
  "success": true,
  "count": 3,
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
    },
    {
      "id": "3",
      "name": "Bob Johnson",
      "email": "bob@example.com",
      "created_at": 1735315200,
      "updated_at": 1735315200
    }
  ]
}
```

### Option 2: View in D1 Dashboard
1. Go to D1 dashboard → Your database
2. Click **"Data"** tab
3. Select **"users"** table
4. You should see the 3 users you just added

---

## Add Test Spin Logs (Optional)

If you want to test the `spin_logs` table too:

```sql
-- Insert test spin logs
INSERT INTO spin_logs (
  id, restaurant_name, restaurant_unit, restaurant_floor,
  category, dietary_need, timestamp, mall_id, selected_categories, created_at
) VALUES
  (
    'spin-1',
    'KFC',
    'F-123',
    'Ground Floor',
    'Fast Food',
    'any',
    (unixepoch()),
    'sunway_square',
    '["Fast Food", "Western"]',
    (unixepoch())
  ),
  (
    'spin-2',
    'McDonald''s',
    'F-456',
    'First Floor',
    'Fast Food',
    'halal',
    (unixepoch()),
    'sunway_square',
    '["Fast Food"]',
    (unixepoch())
  );
```

---

## Quick SQL Reference

### Insert Single User:
```sql
INSERT INTO users (id, name, email, created_at, updated_at) 
VALUES ('4', 'Alice Brown', 'alice@example.com', (unixepoch()), (unixepoch()));
```

### View All Users:
```sql
SELECT * FROM users;
```

### Count Users:
```sql
SELECT COUNT(*) as total_users FROM users;
```

### Delete All Users (if needed):
```sql
DELETE FROM users;
```

---

## Next Steps

After adding test data:
1. ✅ Test `/api/users` again - should show users
2. ✅ Test `/api/spin` - should save new spin logs
3. ✅ View data in D1 dashboard
4. ✅ Your D1 integration is complete!

---

## Troubleshooting

### If SQL gives an error:
- Make sure table names match exactly: `users` (lowercase)
- Make sure column names match exactly
- Check that `id` values are unique (no duplicates)

### If data doesn't appear:
- Refresh the D1 dashboard
- Wait a few seconds (D1 may have slight delay)
- Check that you're querying the correct database

### If API still shows empty:
- Make sure you're testing the correct deployment URL
- Check that the D1 binding variable name is `DB`
- Verify the deployment completed successfully

