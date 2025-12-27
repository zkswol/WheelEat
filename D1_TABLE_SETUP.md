# Cloudflare D1 Table Setup Guide

## Creating Tables in Cloudflare D1

You need to create **2 tables** for WheelEat. The D1 UI only lets you create one table at a time, so we'll do them separately.

---

## Table 1: `spin_logs` (Most Important)

This table stores all wheel spin results.

### Step 1: Create the Table

1. **Table Name**: `spin_logs`

2. **Add these columns** (click "Add column" for each):

   **Column 1:**
   - Column Name: `id`
   - Type: `text`
   - Primary Key: ✅ Check this box
   - Default Value: (leave empty)

   **Column 2:**
   - Column Name: `restaurant_name`
   - Type: `text`
   - Primary Key: ❌ Unchecked
   - Default Value: (leave empty)

   **Column 3:**
   - Column Name: `restaurant_unit`
   - Type: `text`
   - Primary Key: ❌ Unchecked
   - Default Value: (leave empty)

   **Column 4:**
   - Column Name: `restaurant_floor`
   - Type: `text`
   - Primary Key: ❌ Unchecked
   - Default Value: (leave empty)

   **Column 5:**
   - Column Name: `category`
   - Type: `text`
   - Primary Key: ❌ Unchecked
   - Default Value: (leave empty)

   **Column 6:**
   - Column Name: `dietary_need`
   - Type: `text`
   - Primary Key: ❌ Unchecked
   - Default Value: `any`

   **Column 7:**
   - Column Name: `timestamp`
   - Type: `integer`
   - Primary Key: ❌ Unchecked
   - Default Value: (leave empty)

   **Column 8:**
   - Column Name: `mall_id`
   - Type: `text`
   - Primary Key: ❌ Unchecked
   - Default Value: (leave empty)

   **Column 9:**
   - Column Name: `selected_categories`
   - Type: `text`
   - Primary Key: ❌ Unchecked
   - Default Value: (leave empty)
   - Note: This stores JSON as text

   **Column 10:**
   - Column Name: `created_at`
   - Type: `integer`
   - Primary Key: ❌ Unchecked
   - Default Value: (leave empty)

3. Click **"Create"**

---

## Table 2: `users` (Optional - for testing)

This table is just for testing the database connection.

### Step 2: Create the Users Table

1. Click **"Create table"** again
2. **Table Name**: `users`

3. **Add these columns**:

   **Column 1:**
   - Column Name: `id`
   - Type: `text`
   - Primary Key: ✅ Check this box
   - Default Value: (leave empty)

   **Column 2:**
   - Column Name: `name`
   - Type: `text`
   - Primary Key: ❌ Unchecked
   - Default Value: (leave empty)

   **Column 3:**
   - Column Name: `email`
   - Type: `text`
   - Primary Key: ❌ Unchecked
   - Default Value: (leave empty)

   **Column 4:**
   - Column Name: `created_at`
   - Type: `integer`
   - Primary Key: ❌ Unchecked
   - Default Value: (leave empty)

   **Column 5:**
   - Column Name: `updated_at`
   - Type: `integer`
   - Primary Key: ❌ Unchecked
   - Default Value: (leave empty)

4. Click **"Create"**

---

## Alternative: Use SQL Editor (Easier!)

Instead of using the UI form, you can use the SQL Editor which is much faster:

1. In D1 dashboard, click on your database
2. Go to **"SQL Editor"** tab
3. Paste this SQL and click **"Run"**:

```sql
-- Create spin_logs table
CREATE TABLE IF NOT EXISTS spin_logs (
  id TEXT PRIMARY KEY,
  restaurant_name TEXT NOT NULL,
  restaurant_unit TEXT,
  restaurant_floor TEXT,
  category TEXT NOT NULL,
  dietary_need TEXT NOT NULL DEFAULT 'any',
  timestamp INTEGER,
  mall_id TEXT,
  selected_categories TEXT,
  created_at INTEGER
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at INTEGER,
  updated_at INTEGER
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_spin_logs_timestamp ON spin_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_spin_logs_category ON spin_logs(category);
CREATE INDEX IF NOT EXISTS idx_spin_logs_mall_id ON spin_logs(mall_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert example data
INSERT INTO users (id, name, email, created_at) VALUES
  ('1', 'John Doe', 'john@example.com', (unixepoch())),
  ('2', 'Jane Smith', 'jane@example.com', (unixepoch()));
```

This creates both tables at once! Much easier than the form.

---

## Quick Reference: Column Types in D1

- **Text/String**: Use `text`
- **Numbers**: Use `integer` or `real` (for decimals)
- **Timestamps**: Use `integer` (store as Unix timestamp)
- **JSON**: Use `text` (store JSON as string)

---

## After Creating Tables

1. Verify tables exist in the D1 dashboard
2. Bind the D1 database to your Pages project (Settings → Functions → D1 bindings)
3. Update your Functions code to use D1 instead of Supabase

