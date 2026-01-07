import React from 'react';
import './VoucherOfferModal.css';

function formatRm(value) {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) return 'RM10';
  return `RM${n.toFixed(0)}`;
}

function formatMytExpiry(ms) {
  if (!ms) return 'Today 5:00 PM (MYT)';
  try {
    // Malaysia Time (GMT+8)
    const d = new Date(Number(ms));
    return d.toLocaleString('en-MY', {
      timeZone: 'Asia/Kuala_Lumpur',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return 'Today 5:00 PM (MYT)';
  }
}

export default function VoucherOfferModal({ voucher, onAccept, onDecline }) {
  if (!voucher) return null;

  const merchantName = voucher.merchant_name || 'Far Coffee';
  const logoPath = voucher.logo ? `/${voucher.logo}` : null;
  const amountLabel = formatRm(voucher.value_rm ?? 10);

  const code = String(voucher.id || '').slice(-6).toUpperCase();
  const voucherPreview = code ? `WE-${code}` : 'WE-XXXXXX';
  const expiryLabel = formatMytExpiry(voucher.expired_at_ms);

  return (
    <div className="voucher-offer-overlay" onClick={onDecline}>
      <div className="voucher-offer" onClick={(e) => e.stopPropagation()}>
        <button className="voucher-offer-close" onClick={onDecline} aria-label="Close voucher">
          ×
        </button>

        <div className="voucher-offer-badge" aria-hidden="true">
          {amountLabel}
        </div>

        <div className="voucher-offer-header">
          <div className="voucher-offer-title">Limited-time voucher</div>
          <div className="voucher-offer-subtitle">Use it at {merchantName}</div>
        </div>

        <div className="voucher-offer-card">
          {logoPath ? (
            <div className="voucher-offer-logoWrap">
              <img
                src={logoPath}
                alt={merchantName}
                className="voucher-offer-logo"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ) : null}

          <div className="voucher-offer-restaurantName">{merchantName}</div>
          <div className="voucher-offer-code" aria-label="Voucher code preview">
            {voucherPreview}
          </div>
          <div className="voucher-offer-terms">
            {amountLabel} off. Expires: {expiryLabel} (MYT).
          </div>
        </div>

        <div className="voucher-offer-actions">
          <button
            type="button"
            className="voucher-offer-primary"
            onClick={() => onAccept?.()}
          >
            Keep {amountLabel}
          </button>
          <button type="button" className="voucher-offer-secondary" onClick={onDecline}>
            Remove voucher
          </button>
        </div>
      </div>
    </div>
  );
}


