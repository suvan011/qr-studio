import React from 'react';
import { Sun, Moon, Info, ShieldCheck } from 'lucide-react';

export function Header({ theme, toggleTheme, onOpenAbout }) {
  return (
    <header className="site-header">
      <div className="app-container header-inner">
        {/* Brand Logo & Wordmark */}
        <div className="brand-group">
          <div className="brand-logo" aria-hidden="true">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="10" height="10" rx="2.5" stroke="currentColor" strokeWidth="2.5" />
              <rect x="5.5" y="5.5" width="3" height="3" fill="currentColor" />
              <rect x="16" y="2" width="10" height="10" rx="2.5" stroke="currentColor" strokeWidth="2.5" />
              <rect x="19.5" y="5.5" width="3" height="3" fill="currentColor" />
              <rect x="2" y="16" width="10" height="10" rx="2.5" stroke="currentColor" strokeWidth="2.5" />
              <rect x="5.5" y="19.5" width="3" height="3" fill="currentColor" />
              <rect x="16" y="16" width="4" height="4" rx="1" fill="#10b981" />
              <rect x="22" y="16" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="16" y="22" width="4" height="4" rx="1" fill="currentColor" />
              <rect x="22" y="22" width="4" height="4" rx="1" fill="#3b82f6" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">QR Studio</span>
            <span className="brand-badge">PRO</span>
          </div>
        </div>

        {/* Center / Privacy Indicator */}
        <div className="header-status">
          <div className="privacy-badge" title="No backend data transmission. All QR encoding and rendering happens entirely inside your browser.">
            <span className="privacy-dot" aria-hidden="true" />
            <ShieldCheck size={14} className="privacy-icon" />
            <span className="privacy-text">Client-Side Engine • 100% Private</span>
          </div>
        </div>

        {/* Right Actions: Theme Toggle & Info */}
        <div className="header-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            type="button"
            className="icon-btn"
            onClick={onOpenAbout}
            aria-label="About QR Studio and specification details"
            title="About QR Studio"
          >
            <Info size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
