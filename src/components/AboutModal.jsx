import React, { useEffect } from 'react';
import { X, ShieldCheck, Cpu, Code2, QrCode } from 'lucide-react';

export function AboutModal({ isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="about-modal-title">
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <QrCode size={20} className="modal-title-icon" />
            <h2 id="about-modal-title" className="modal-title">About QR Studio</h2>
          </div>
          <button
            type="button"
            className="icon-btn-sm"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="about-hero-badge">
            <ShieldCheck size={16} />
            <span>GDG on Campus SRM — Recruitment 2026–27 Submission</span>
          </div>

          <p className="modal-intro">
            <strong>QR Studio</strong> is a production-grade QR code engineering workspace designed for speed, privacy, and flawless real-world scanning reliability.
          </p>

          <div className="modal-feature-list">
            <div className="modal-feature-item">
              <Cpu size={18} className="feat-icon" />
              <div>
                <h4>Zero-Latency Client Engine</h4>
                <p>QR matrix encoding and rasterization execute 100% within your local browser runtime via HTML5 Canvas. No server roundtrips, no API keys, and zero telemetry.</p>
              </div>
            </div>

            <div className="modal-feature-item">
              <ShieldCheck size={18} className="feat-icon" />
              <div>
                <h4>Strict Privacy & Sanitization</h4>
                <p>Wi-Fi network credentials and personal phone numbers are never stored in plain text or transmitted. Sensitive Wi-Fi passwords are intentionally excluded from localStorage history.</p>
              </div>
            </div>

            <div className="modal-feature-item">
              <Code2 size={18} className="feat-icon" />
              <div>
                <h4>Standards Compliance</h4>
                <p>Fully compliant with ISO/IEC 18004 (QR Code specifications), RFC 3986 (URI percent-encoding), and ZXing MECARD Wi-Fi syntax with rigorous character escaping.</p>
              </div>
            </div>
          </div>

          <div className="modal-footer-spec">
            <span>Stack: React 18 • Vite • Modern CSS Tokens • Lucide</span>
          </div>
        </div>
      </div>
    </div>
  );
}
