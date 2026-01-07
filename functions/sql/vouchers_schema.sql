-- Demo Voucher Spin System (Far Coffee RM10) - Cloudflare D1 (SQLite)
--
-- Scenario:
-- - Merchant: Far Coffee
-- - Voucher value: RM10
-- - Total vouchers: 5
-- - Expiry: today 5:00 PM Malaysia Time (GMT+8) -> stored as UTC epoch millis
--
-- Notes:
-- - `vouchers.remaining_qty` is the current available stock.
-- - `user_vouchers.status` is one of: active / removed / expired
-- - Stock is decremented atomically when issuing an active user voucher.
-- - Stock is incremented when a voucher is removed or expires.

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS vouchers (
  id TEXT PRIMARY KEY,
  merchant_name TEXT NOT NULL,
  value_rm INTEGER NOT NULL CHECK (value_rm > 0),
  total_qty INTEGER NOT NULL CHECK (total_qty >= 0),
  remaining_qty INTEGER NOT NULL CHECK (remaining_qty >= 0),
  expires_at_ms INTEGER NOT NULL CHECK (expires_at_ms > 0),
  created_at_ms INTEGER NOT NULL,
  updated_at_ms INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_vouchers_expires_at ON vouchers (expires_at_ms);

CREATE TABLE IF NOT EXISTS user_vouchers (
  id TEXT PRIMARY KEY,                 -- user_voucher_id
  user_id TEXT NOT NULL,
  voucher_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'removed', 'expired')),
  issued_at_ms INTEGER NOT NULL,
  expired_at_ms INTEGER NOT NULL,
  removed_at_ms INTEGER,
  updated_at_ms INTEGER NOT NULL,
  FOREIGN KEY (voucher_id) REFERENCES vouchers(id)
);

CREATE INDEX IF NOT EXISTS idx_user_vouchers_user ON user_vouchers (user_id);
CREATE INDEX IF NOT EXISTS idx_user_vouchers_status ON user_vouchers (status);
CREATE INDEX IF NOT EXISTS idx_user_vouchers_expired_at ON user_vouchers (expired_at_ms);
CREATE INDEX IF NOT EXISTS idx_user_vouchers_voucher ON user_vouchers (voucher_id);


