import React, { useState } from 'react';
import { History, Trash2, Clock, RotateCcw, AlertCircle, Shield } from 'lucide-react';

export function HistoryList({
  history,
  onRestore,
  onRemove,
  onClearAll,
}) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffSec = Math.floor((now - date) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="history-section studio-card">
      <div className="section-header-row">
        <div>
          <h2 className="section-title">
            <History size={18} className="title-icon" />
            <span>Recent Creations</span>
          </h2>
          <p className="section-desc">Stored privately in your browser's localStorage (max 8).</p>
        </div>

        {history.length > 0 && !showClearConfirm && (
          <button
            type="button"
            className="btn btn-ghost btn-sm text-danger-btn"
            onClick={() => setShowClearConfirm(true)}
            title="Clear all saved history"
          >
            <Trash2 size={14} />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Confirmation modal/strip */}
      {showClearConfirm && (
        <div className="clear-confirm-banner" role="alert">
          <span>Delete all {history.length} saved creations?</span>
          <div className="confirm-actions">
            <button
              type="button"
              className="btn btn-danger btn-xs"
              onClick={() => {
                onClearAll();
                setShowClearConfirm(false);
              }}
            >
              Confirm Clear
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-xs"
              onClick={() => setShowClearConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Privacy note */}
      <div className="history-privacy-banner">
        <Shield size={13} />
        <span>For security, Wi-Fi passwords are automatically stripped before saving to history.</span>
      </div>

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="history-empty">
          <Clock size={28} className="empty-icon" />
          <p>No recent QR creations yet. Generated codes will appear here for one-click restoration.</p>
        </div>
      ) : (
        <div className="history-grid" role="list">
          {history.map((item) => (
            <div key={item.id} className="history-item-card" role="listitem">
              {/* Thumbnail */}
              <div
                className="history-thumb-wrapper"
                style={{ backgroundColor: item.customization?.bgColor || '#ffffff' }}
                onClick={() => onRestore(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onRestore(item);
                  }
                }}
                aria-label={`Restore QR code for ${item.title}`}
                title="Click to restore this QR code"
              >
                {item.thumbnailDataUrl ? (
                  <img src={item.thumbnailDataUrl} alt="" className="history-thumb-img" />
                ) : (
                  <div className="thumb-fallback">QR</div>
                )}
              </div>

              {/* Item Info */}
              <div className="history-info" onClick={() => onRestore(item)}>
                <div className="history-badge-row">
                  <span className="badge badge-blue">{item.type.toUpperCase()}</span>
                  <span className="history-time">{formatTimestamp(item.createdAt)}</span>
                </div>
                <div className="history-title" title={item.payload}>
                  {item.title}
                </div>
                <div className="history-details">
                  {item.customization?.size}px • {item.customization?.fgColor}
                </div>
              </div>

              {/* Actions: Restore & Delete */}
              <div className="history-item-actions">
                <button
                  type="button"
                  className="icon-btn-sm"
                  onClick={() => onRestore(item)}
                  title="Restore configuration"
                  aria-label="Restore configuration"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  type="button"
                  className="icon-btn-sm delete-btn"
                  onClick={() => onRemove(item.id)}
                  title="Remove from history"
                  aria-label="Remove from history"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
