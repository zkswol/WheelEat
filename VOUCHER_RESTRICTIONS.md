# Voucher Restrictions Implementation

## Overview
Implemented two key restrictions for the voucher system:
1. **One voucher per restaurant per user** - Users can only have one active voucher per restaurant
2. **Google sign-in required to keep vouchers** - Guest users cannot save vouchers

## Changes Made

### Backend Changes (`functions/api/lib/farCoffeeVoucher.js`)

#### 1. Duplicate Voucher Prevention
Added a check in `spinFarCoffeeVoucher()` to prevent users from getting multiple vouchers for the same restaurant:

```javascript
// Check if user already has an active voucher for this restaurant
const existingVoucher = await db
  .prepare(
    `SELECT id FROM user_vouchers
     WHERE user_id = ? 
       AND voucher_id = ?
       AND status = 'active'`
  )
  .bind(String(userId), FAR_COFFEE_VOUCHER_ID)
  .first();

if (existingVoucher) {
  return {
    won: false,
    reason: 'already_has_voucher',
    remainingQty: 0,
    expiryMs,
    message: 'You already have an active voucher for this restaurant. Only one voucher per restaurant is allowed.',
  };
}
```

**Behavior:**
- If user already has an active voucher for Far Coffee, the spin will return `won: false` with `reason: 'already_has_voucher'`
- User must use or remove their existing voucher before getting a new one

### Frontend Changes

#### 1. Google Sign-In Requirement (`frontend/src/App.js`)

Updated `handleKeepVoucher()` to check if user is a guest:

```javascript
const handleKeepVoucher = async () => {
  // Check if user is a guest (not signed in with Google)
  const isGuest = !user || user.loginType === 'guest' || String(user?.id || '').startsWith('anon_');
  
  if (isGuest) {
    // Guest users must sign in with Google to keep vouchers
    setShowVoucherOffer(false);
    setPendingVoucher(null);
    // Show login modal
    onShowLogin();
    // Show message
    alert('Please sign in with Google to keep your voucher. Guest users cannot save vouchers.');
    return;
  }

  // User is signed in with Google - allow keeping voucher
  setShowVoucherOffer(false);
  setPendingVoucher(null);
  await refreshVouchers();
};
```

**Behavior:**
- Guest users: When clicking "Keep voucher", login modal appears with alert message
- Google users: Voucher is saved normally

#### 2. Voucher Offer Modal (`frontend/src/components/VoucherOfferModal.js`)

Added visual indicator for guest users:

```javascript
// Check if user is a guest
const isGuest = !user || user.loginType === 'guest' || String(user?.id || '').startsWith('anon_');

// Show warning notice for guests
{isGuest && (
  <div className="voucher-offer-guest-notice">
    ⚠️ Sign in with Google to keep this voucher. Guest users cannot save vouchers.
  </div>
)}

// Update button text
<button onClick={() => onAccept?.()}>
  {isGuest ? 'Sign in to Keep' : `Keep ${amountLabel}`}
</button>
```

**Visual Changes:**
- Yellow warning banner appears for guest users
- Button text changes from "Keep RM10" to "Sign in to Keep" for guests
- Clear indication that Google sign-in is required

## User Flow

### Scenario 1: Guest User Wins Voucher
1. User spins wheel and wins voucher
2. Voucher offer modal appears
3. **Warning banner shows**: "Sign in with Google to keep this voucher"
4. **Button shows**: "Sign in to Keep"
5. User clicks button → Login modal appears
6. User signs in with Google → Voucher is saved

### Scenario 2: Google User Wins Voucher
1. User spins wheel and wins voucher
2. Voucher offer modal appears
3. **No warning banner** (user is signed in)
4. **Button shows**: "Keep RM10"
5. User clicks button → Voucher is saved immediately

### Scenario 3: User Already Has Voucher
1. User spins wheel
2. Backend checks for existing active voucher
3. Returns `won: false` with `reason: 'already_has_voucher'`
4. No voucher offer modal appears
5. User must use or remove existing voucher first

## Testing

### Test Cases

1. **Guest user tries to keep voucher**
   - ✅ Should show warning banner
   - ✅ Should show "Sign in to Keep" button
   - ✅ Should open login modal when clicked
   - ✅ Should show alert message

2. **Google user tries to keep voucher**
   - ✅ Should not show warning banner
   - ✅ Should show "Keep RM10" button
   - ✅ Should save voucher immediately

3. **User with existing voucher tries to spin**
   - ✅ Should not receive new voucher
   - ✅ Should get `already_has_voucher` response

4. **User removes voucher then spins again**
   - ✅ Should be able to get new voucher

## Database Query

The duplicate check queries:
```sql
SELECT id FROM user_vouchers
WHERE user_id = ? 
  AND voucher_id = ?
  AND status = 'active'
```

This ensures:
- Only active vouchers count (expired/removed don't block)
- Per-user restriction (different users can each have one)
- Per-restaurant restriction (voucher_id = 'far_coffee_rm10_demo')

## Notes

- **Guest users** are identified by:
  - `user.loginType === 'guest'`
  - `user.id` starts with `'anon_'`
  - `!user` (no user object)

- **Google users** are identified by:
  - `user.loginType !== 'guest'`
  - `user.id` is a Google user ID (numeric string)

- The restriction applies to **active vouchers only**
  - Expired vouchers don't block new ones
  - Removed vouchers don't block new ones

