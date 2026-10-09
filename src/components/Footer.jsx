import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="app-container footer-inner">
        <div className="footer-left">
          <p className="footer-brand">
            <strong>QR Studio</strong> — Production-Quality QR Designer & Generator
          </p>
          <p className="footer-meta">
            Developed for Google Developer Groups on Campus • SRM Institute of Science and Technology (Recruitment 2026–27)
          </p>
        </div>

        <div className="footer-right">
          <div className="footer-security-note">
            <ShieldCheck size={14} className="text-mint" />
            <span>Zero Server Footprint • 100% In-Browser Execution</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
