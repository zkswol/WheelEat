# Cloudflare D1 Database Setup Guide

## What is Cloudflare D1?

**Cloudflare D1** is Cloudflare's serverless SQL database (built on SQLite). It's integrated directly into Cloudflare's platform, so you don't need external services like Supabase.

## D1 vs Supabase Comparison

### Cloudflare D1 (SQLite)
✅ **Pros:**
- **Native integration** - Built into Cloudflare, no external service
- **No separate account needed** - Everything in one place
- **Free tier available** - Good for small projects
- **Fast** - Data stored on Cloudflare's edge network
- **Simple setup** - No external credentials to manage

❌ **Cons:**
- **SQLite limitations** - Not as powerful as PostgreSQL
- **Read-heavy** - Better for reads than writes
- **No built-in admin UI** - Need to use Cloudflare dashboard or CLI
- **Newer service** - Less mature than Supabase

### Supabase (PostgreSQL)
✅ **Pros:**
- **PostgreSQL** - Full-featured, powerful database
- **Great admin UI** - Easy to view/edit data
- **More features** - Auth, storage, real-time subscriptions
- **Mature** - Well-established service
- **Better for complex queries** - More SQL features

❌ **Cons:**
- **External service** - Separate account and credentials
- **Additional setup** - Need to configure environment variables
- **Free tier limits** - May have usage limits

## Should You Switch?

### Use D1 if:
- ✅ You want everything in Cloudflare (simpler setup)
- ✅ Your app is read-heavy (viewing spin history)
- ✅ You don't need complex database features
- ✅ You want to reduce external dependencies

### Keep Supabase if:
- ✅ You need PostgreSQL features
- ✅ You want a nice admin UI to view data
- ✅ You might need auth/storage features later
- ✅ You're already set up with Supabase

## How to Set Up Cloudflare D1

### Step 1: Create D1 Database

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **D1**
3. Click **"Create database"**
4. Fill in:
   - **Database name**: `wheeleat-db`
   - **Region**: Choose closest to you
5. Click **"Create"**

### Step 2: Create Tables

1. In D1 dashboard, click on your database
2. Go to **"SQL Editor"** tab
3. Run this SQL (adapted from your schema):

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  created_at INTEGER DEFAULT (unixepoch()),
  updated_at INTEGER DEFAULT (unixepoch())
);

-- Create spin_logs table
CREATE TABLE IF NOT EXISTS spin_logs (
  id TEXT PRIMARY KEY,
  restaurant_name TEXT NOT NULL,
  restaurant_unit TEXT,
  restaurant_floor TEXT,
  category TEXT NOT NULL,
  dietary_need TEXT NOT NULL,
  timestamp INTEGER DEFAULT (unixepoch()),
  mall_id TEXT,
  selected_categories TEXT,  -- JSON stored as TEXT in SQLite
  created_at INTEGER DEFAULT (unixepoch())
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_spin_logs_timestamp ON spin_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_spin_logs_category ON spin_logs(category);
CREATE INDEX IF NOT EXISTS idx_spin_logs_mall_id ON spin_logs(mall_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert example data
INSERT INTO users (id, name, email) VALUES
  ('1', 'John Doe', 'john@example.com'),
  ('2', 'Jane Smith', 'jane@example.com');
```

### Step 3: Bind D1 to Your Pages Project

1. Go to **Workers & Pages** → Your project (`wheeleat`)
2. Click **Settings** → **Functions**
3. Scroll to **D1 Database bindings**
4. Click **"Add binding"**
5. Fill in:
   - **Variable name**: `DB` (or `DATABASE`)
   - **D1 database**: Select your `wheeleat-db`
6. Click **"Save"**

### Step 4: Update Your Functions Code

You'll need to update your API functions to use D1 instead of Supabase. For example:

```javascript
// functions/api/users.js
export async function onRequest(context) {
  const { request, env } = context;
  const db = env.DB; // D1 database binding

  const result = await db.prepare('SELECT * FROM users LIMIT 10').all();
  
  return jsonResponse({
    success: true,
    count: result.results.length,
    users: result.results
  });
}
```

## Recommendation

**For your WheelEat project:**

Since you're already set up with Supabase and it's working, I'd recommend:
- **Keep Supabase** for now (it's working and has better features)
- **Consider D1** if you want to simplify and reduce external dependencies

Both work well! Supabase gives you more features, D1 keeps everything in Cloudflare.

