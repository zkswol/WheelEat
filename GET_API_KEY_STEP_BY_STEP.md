# 🔑 Step-by-Step Guide: Getting Your Google API Key

**You need to do this yourself, but I'll guide you through every step!**

---

## ⏱️ Time Required: 5-10 minutes

---

## Step 1: Go to Google Cloud Console

1. **Open your web browser**
2. **Go to:** https://console.cloud.google.com/
3. **Sign in** with your Google account (Gmail account)

**Note:** If you don't have a Google account, create one at https://accounts.google.com/signup

---

## Step 2: Create or Select a Project

### Option A: Create New Project (Recommended)

1. Click the **project dropdown** at the top (it might say "Select a project" or show a project name)
2. Click **"NEW PROJECT"**
3. Enter a project name: `WheelEat` (or any name you like)
4. Click **"CREATE"**
5. Wait a few seconds for it to create
6. **Select the new project** from the dropdown

### Option B: Use Existing Project

1. Click the **project dropdown** at the top
2. Select an existing project from the list

---

## Step 3: Enable Required APIs

You need to enable 2 APIs:

### Enable Places API:

1. In the left menu, click **"APIs & Services"** → **"Library"**
   (If you don't see it, click the ☰ menu icon first)
2. In the search box, type: **"Places API"**
3. Click on **"Places API"** (from Google Maps Platform)
4. Click the blue **"ENABLE"** button
5. Wait for it to enable (few seconds)

### Enable Maps JavaScript API:

1. Still in the **"Library"** page
2. In the search box, type: **"Maps JavaScript API"**
3. Click on **"Maps JavaScript API"** (from Google Maps Platform)
4. Click the blue **"ENABLE"** button
5. Wait for it to enable

**✅ You should now see both APIs enabled!**

---

## Step 4: Create API Key

1. In the left menu, click **"APIs & Services"** → **"Credentials"**
   (Or click: https://console.cloud.google.com/apis/credentials)
2. Click the **"+ CREATE CREDENTIALS"** button at the top
3. Click **"API key"** from the dropdown
4. **Your API key will be created!** It will look like:
   ```
   AIzaSyC9dQ2XvH5jK8lM3nO4pQ5rS6tU7vW8xY9z
   ```
5. **Copy the API key** (click the copy button or select all and Ctrl+C)

**⚠️ Important:** Save this key somewhere safe - you'll need it!

---

## Step 5: (Optional) Restrict API Key (Recommended for Security)

**This step is optional but recommended:**

1. After creating the API key, you'll see a dialog
2. Click **"RESTRICT KEY"** button
3. Under **"API restrictions"**, select **"Restrict key"**
4. Check these APIs:
   - ✅ Places API
   - ✅ Maps JavaScript API
5. Click **"SAVE"**

**Or you can skip this for now** - you can always restrict it later.

---

## Step 6: Add API Key to Your Project

1. **Go back to your project folder**
2. **Open:** `backend-node\.env` file
   - You can open it with Notepad or any text editor
3. **Find this line:**
   ```
   GOOGLE_API_KEY=YOUR_API_KEY_HERE
   ```
4. **Replace** `YOUR_API_KEY_HERE` with your actual API key:
   ```
   GOOGLE_API_KEY=AIzaSyC9dQ2XvH5jK8lM3nO4pQ5rS6tU7vW8xY9z
   ```
   (Use YOUR actual key, not this example!)
5. **Save the file** (Ctrl+S)

---

## Step 7: Restart Backend Server

1. **Go to your backend PowerShell window** (where `npm start` is running)
2. **Press:** `Ctrl+C` to stop the server
3. **Run again:**
   ```powershell
   npm start
   ```
4. **Wait for:** "Server running on http://localhost:8001"

---

## Step 8: Test It!

1. **Open browser**
2. **Go to:** http://localhost:8001/restaurants
3. **You should see:** JSON data with restaurants! ✅
4. **Refresh your frontend** (F5)
5. **Leaderboard should now load!** 🎉

---

## 🆘 Troubleshooting

### "I can't find the APIs & Services menu"
- Click the **☰ (hamburger menu)** icon in the top left
- Look for **"APIs & Services"** in the menu

### "I don't have a Google account"
- Create one for free at: https://accounts.google.com/signup
- Use any email address

### "API key doesn't work"
- Make sure you **enabled** both APIs (Places API and Maps JavaScript API)
- Check that you copied the **entire** API key (it's long!)
- Make sure there are **no spaces** before or after the key in .env file
- Restart the backend server after adding the key

### "I see 'Billing required' error"
- Google gives you $200 free credit per month
- For testing purposes, this should be enough
- You may need to add a payment method (you won't be charged for testing)
- Or use a different Google account

### "I can't find the .env file"
- Make sure you're in the `backend-node` folder
- The file might be hidden - enable "Show hidden files" in Windows
- Or create it manually:
  1. Open Notepad
  2. Type:
     ```
     GOOGLE_API_KEY=your_key_here
     PORT=8001
     ```
  3. Save as: `.env` (make sure to select "All Files" in save dialog)

---

## ✅ Checklist

Before you start, make sure you have:
- [ ] A Google account (Gmail)
- [ ] A web browser (Chrome, Edge, Firefox, etc.)
- [ ] Your project folder open

After getting the API key:
- [ ] API key copied
- [ ] Added to `backend-node\.env` file
- [ ] Backend server restarted
- [ ] Tested: http://localhost:8001/restaurants works

---

## 📞 Need Help?

If you get stuck at any step:
1. Take a screenshot of where you are
2. Check the error message
3. Make sure you followed all steps in order
4. Try refreshing the Google Cloud Console page

---

## 🎯 Quick Summary

1. **Sign in** to https://console.cloud.google.com/
2. **Create/Select** a project
3. **Enable** Places API and Maps JavaScript API
4. **Create** an API key from Credentials
5. **Copy** the key
6. **Add** it to `backend-node\.env` file
7. **Restart** backend server
8. **Test** it!

**That's it! You can do this! 💪**

