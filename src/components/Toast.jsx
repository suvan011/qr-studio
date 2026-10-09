import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const { message, type = 'info' } = toast;

  const icons = {
    success: <CheckCircle2 size={18} className="toast-icon text-mint" />,
    error: <AlertCircle size={18} className="toast-icon text-danger" />,
    warning: <AlertTriangle size={18} className="toast-icon text-warning" />,
    info: <Info size={18} className="toast-icon text-blue" />,
  };

  return (
    <div className={`toast-notification toast-${type}`} role="status" aria-live="polite">
      <div className="toast-content">
        {icons[type] || icons.info}
        <span className="toast-message">{message}</span>
      </div>
      <button
        type="button"
        className="toast-close-btn"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={15} />
      </button>
    </div>
  );
}
