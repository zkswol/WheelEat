# 🚀 Complete Cloudflare Pages + Supabase Database Setup Guide

**This guide will get your database working on Cloudflare Pages with Supabase.**

---

## 📋 Overview

✅ **What happens automatically:**
- Cloudflare Pages Functions can connect to Supabase
- Database queries work through the API endpoints
- Environment variables are loaded automatically

🟡 **What you must do manually:**
- Create Supabase account and project
- Run SQL to create tables
- Copy environment variables to Cloudflare Pages
- Redeploy

---

## 🟡 STEP 1: Create Supabase Account & Project

### 1.1 Sign up for Supabase

1. Go to https://supabase.com
2. Click **"Start your project"** or **"Sign up"**
3. Sign up with GitHub (easiest) or email
4. Verify your email if needed

### 1.2 Create a New Project

1. Click **"New Project"** button
2. Fill in:
   - **Name**: `wheeleat` (or any name you like)
   - **Database Password**: Create a strong password (SAVE THIS - you'll need it)
   - **Region**: Choose closest to you (e.g., "Southeast Asia (Singapore)")
3. Click **"Create new project"**
4. ⏳ Wait 2-3 minutes for project to be created

### 1.3 Get Your Supabase Credentials

1. Once project is ready, click on **"Project Settings"** (gear icon in left sidebar)
2. Click **"API"** in the settings menu
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
4. **COPY BOTH VALUES** - you'll need them in Step 3

---

## 🟡 STEP 2: Create Database Tables

### 2.1 Open SQL Editor

1. In your Supabase project dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button

### 2.2 Run the SQL Script

1. Open the file `supabase-schema.sql` in this project
2. **Copy the ENTIRE contents** of that file
3. **Paste it** into the SQL Editor in Supabase
4. Click **"Run"** button (or press `Ctrl+Enter`)
5. ✅ You should see: **"Success. No rows returned"** or a success message

### 2.3 Verify Tables Were Created

1. In Supabase, click **"Table Editor"** in the left sidebar
2. You should see two tables:
   - ✅ `users` - Example user table
   - ✅ `spin_logs` - Stores wheel spin results
3. Click on `users` table - you should see 2 example rows

**✅ Step 2 Complete!**

---

## 🟡 STEP 3: Add Environment Variables to Cloudflare Pages

### 3.1 Go to Cloudflare Pages Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → Your project (`wheeleat`)
3. Click on **Settings** tab (top menu)
4. Scroll down to **Environment Variables** section

### 3.2 Add Supabase Environment Variables

Add **Variable 1:**
1. Click **"Add variable"**
2. Fill in:
   - **Variable name**: `SUPABASE_URL`
   - **Value**: Paste your Supabase Project URL (from Step 1.3)
   - **Type**: Select **"Plain text"** (txt)
   - **Environment**: Select **Production** (or **All environments**)
3. Click **"Save"**

Add **Variable 2:**
1. Click **"Add variable"** again
2. Fill in:
   - **Variable name**: `SUPABASE_ANON_KEY`
   - **Value**: Paste your Supabase anon public key (from Step 1.3)
   - **Type**: Select **"Plain text"** (txt)
   - **Environment**: Select **Production** (or **All environments**)
3. Click **"Save"**

### 3.3 Verify Variables Are Added

You should now see both variables listed:
- ✅ `SUPABASE_URL`
- ✅ `SUPABASE_ANON_KEY`

**✅ Step 3 Complete!**

---

## 🟡 STEP 4: Redeploy

After adding environment variables, you MUST redeploy:

1. Go to **Deployments** tab (top menu)
2. Find the latest deployment
3. Click the **"..."** menu (three dots)
4. Click **"Retry deployment"** or **"Redeploy"**
5. ⏳ Wait 2-3 minutes for deployment to complete

**✅ Step 4 Complete!**

---

## 🟡 STEP 5: Test Your Database Connection

### 5.1 Test Health Endpoint

Visit in your browser:
```
https://wheeleat-xp5.pages.dev/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "WheelEat API is running",
  "timestamp": "..."
}
```

### 5.2 Test Users Endpoint (Database Query)

Visit in your browser:
```
https://wheeleat-xp5.pages.dev/api/users
```

You should see:
```json
{
  "success": true,
  "count": 2,
  "users": [
    {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      ...
    },
    {
      "id": "...",
      "name": "Jane Smith",
      "email": "jane@example.com",
      ...
    }
  ]
}
```

If you see the users data, your database is working! ✅

### 5.3 Test Spin Endpoint (Database Write)

The `/api/spin` endpoint will automatically save spin results to the `spin_logs` table when you use the app.

---

## 📊 Database Tables

Your database has two tables:

### 1. `users` Table
- Stores example user data
- Used for testing database connection
- You can add more fields as needed

### 2. `spin_logs` Table
- Stores wheel spin results
- Fields:
  - `restaurant_name` - Name of selected restaurant
  - `restaurant_unit` - Unit number
  - `restaurant_floor` - Floor number
  - `category` - Restaurant category
  - `dietary_need` - Dietary preference
  - `mall_id` - Shopping mall ID
  - `selected_categories` - JSON array of selected categories
  - `timestamp` - When the spin occurred

---

## 🔍 Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:**
1. Check Cloudflare Pages → Settings → Environment Variables
2. Make sure both `SUPABASE_URL` and `SUPABASE_ANON_KEY` are added
3. Make sure they're set for **Production** environment
4. Redeploy after adding variables

### Issue: "Database error" or "Failed to fetch users"

**Solution:**
1. Verify tables exist in Supabase → Table Editor
2. Check Supabase credentials are correct (no extra spaces)
3. Check Supabase project is active (not paused)
4. Check browser console for detailed error messages

### Issue: Tables don't exist

**Solution:**
1. Go to Supabase → SQL Editor
2. Run the `supabase-schema.sql` script again
3. Verify in Table Editor that tables were created

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] SQL schema executed successfully
- [ ] Tables visible in Supabase Table Editor
- [ ] `SUPABASE_URL` added to Cloudflare Pages
- [ ] `SUPABASE_ANON_KEY` added to Cloudflare Pages
- [ ] Site redeployed after adding variables
- [ ] `/api/health` returns success
- [ ] `/api/users` returns user data

---

## 🎯 Next Steps

Once your database is set up:
- ✅ Spin wheel results will be automatically saved to `spin_logs` table
- ✅ You can query spin history through Supabase dashboard
- ✅ You can add more tables/fields as needed
- ✅ All API endpoints can now use the database

**Your database is now connected and working!** 🎉

