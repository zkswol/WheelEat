# Google Login Database Integration

## Current Behavior

**Before this update:**
- ❌ Google sign-in only saved user data to `localStorage`
- ❌ User data was NOT saved to the D1 database
- ❌ Users table remained empty after Google login

**After this update:**
- ✅ Google sign-in saves user data to both `localStorage` AND D1 database
- ✅ New users are automatically created in the database
- ✅ Existing users are automatically updated (if they sign in again)
- ✅ User data persists across sessions

---

## How It Works

### 1. User Signs In with Google

When a user clicks "Sign in with Google":
1. Google OAuth flow completes
2. User profile is fetched from Google API
3. User data is saved to `localStorage` (for immediate UI update)
4. **NEW:** User data is also saved to D1 database via `/api/users` POST endpoint

### 2. Database Upsert Logic

The `/api/users` POST endpoint:
- **Checks if user exists** (by `id` or `email`)
- **If exists:** Updates the user's name and `updated_at` timestamp
- **If new:** Creates a new user record with `id`, `name`, `email`, `created_at`, `updated_at`

### 3. Data Flow

```
Google OAuth → User Profile → localStorage (immediate)
                          ↓
                    POST /api/users
                          ↓
                    D1 Database (persistent)
```

---

## API Endpoint

### POST `/api/users`

**Purpose:** Create or update a user in the database

**Request Body:**
```json
{
  "id": "google_user_id_123",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response (New User):**
```json
{
  "success": true,
  "action": "created",
  "user": {
    "id": "google_user_id_123",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": 1735315200,
    "updated_at": 1735315200
  }
}
```

**Response (Existing User):**
```json
{
  "success": true,
  "action": "updated",
  "user": {
    "id": "google_user_id_123",
    "name": "John Doe Updated",
    "email": "john@example.com",
    "created_at": 1735315200,
    "updated_at": 1735315300
  }
}
```

---

## Testing

### Test Google Login

1. Sign in with Google
2. Check browser console - should see: `"User saved to database: {success: true, action: 'created'}"`
3. Check D1 dashboard:
   - Go to **Workers & Pages** → **D1** → Your database
   - Click **"Data"** tab
   - Select **"users"** table
   - You should see your Google account user

### Test User Update

1. Sign in with Google (first time) - creates user
2. Sign out
3. Sign in with Google again (same account) - updates user
4. Check D1 - `updated_at` timestamp should be newer

### Test API Directly

```javascript
// In browser console
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id: 'test-123',
    name: 'Test User',
    email: 'test@example.com'
  })
})
  .then(res => res.json())
  .then(data => console.log('Result:', data));
```

---

## Database Schema

The `users` table in D1 should have:
- `id` (TEXT, PRIMARY KEY) - Google user ID (`userInfo.sub`)
- `name` (TEXT) - User's display name
- `email` (TEXT, UNIQUE) - User's email address
- `created_at` (INTEGER) - Unix timestamp when user first signed in
- `updated_at` (INTEGER) - Unix timestamp when user last signed in

---

## Error Handling

The login flow is **resilient**:
- If database save fails, user is still logged in (via localStorage)
- Errors are logged to console but don't block the login process
- User can still use the app even if database is temporarily unavailable

---

## Benefits

1. **Persistent User Data:** User information is stored in the database, not just browser storage
2. **Analytics:** You can track how many users have signed in
3. **User History:** You can link spin logs to specific users (future feature)
4. **Cross-Device:** User data persists across devices (if you add user lookup by email)
5. **Automatic Updates:** User profile changes (name) are automatically synced

---

## Future Enhancements

Possible improvements:
- Link `spin_logs` to `user_id` to track user's spin history
- Add user preferences (favorite malls, dietary restrictions)
- Add user statistics (total spins, favorite categories)
- Add user profile page showing their spin history

---

## Troubleshooting

### User not appearing in database

1. Check browser console for errors
2. Verify `/api/users` endpoint is working: `GET /api/users`
3. Check D1 binding is configured correctly
4. Verify `users` table exists in D1

### Database errors

- Check Cloudflare Pages deployment logs
- Verify D1 database binding variable name is `DB`
- Check that `users` table has correct schema

### Duplicate users

- The upsert logic prevents duplicates by checking both `id` and `email`
- If you see duplicates, check that the `id` field matches Google's `sub` value

