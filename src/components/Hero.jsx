import React from 'react';
import { Zap, ShieldCheck, Download, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="hero-section" aria-label="Product introduction">
      <div className="hero-content">
        <div className="hero-pill">
          <Sparkles size={13} className="hero-pill-icon" />
          <span>Next-Gen QR Creation Engine</span>
        </div>
        <h1 className="hero-title">
          Your link, <span className="gradient-text">reimagined.</span>
        </h1>
        <p className="hero-subtitle">
          Design, customize, and export crisp, high-resolution QR codes in seconds. Engineered with client-side privacy, live error-correction modeling, and zero tracking.
        </p>
        
        {/* Feature indicators */}
        <div className="hero-features">
          <div className="feature-item">
            <Zap size={15} className="feature-icon feature-blue" />
            <span>Instant Real-Time Preview</span>
          </div>
          <div className="feature-divider" aria-hidden="true" />
          <div className="feature-item">
            <ShieldCheck size={15} className="feature-icon feature-mint" />
            <span>100% Offline Client Privacy</span>
          </div>
          <div className="feature-divider" aria-hidden="true" />
          <div className="feature-item">
            <Download size={15} className="feature-icon feature-blue" />
            <span>Lossless PNG Export</span>
          </div>
        </div>
      </div>
    </section>
  );
}
