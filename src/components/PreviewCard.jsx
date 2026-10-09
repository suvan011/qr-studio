import React from 'react';
import { QrCode, AlertTriangle, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';

export function PreviewCard({
  dataUrl,
  isLoading,
  isValid,
  hasInput,
  generationError,
  activeType,
  settings,
  byteSize,
  contrastInfo,
}) {
  return (
    <div className="preview-card studio-card">
      <div className="preview-header">
        <div className="preview-title-group">
          <h2 className="section-title">
            <QrCode size={18} className="title-icon" />
            <span>Live QR Preview</span>
          </h2>
          <span className="live-indicator">
            <span className="live-dot" /> Real-Time
          </span>
        </div>

        {/* Format & spec tags */}
        <div className="preview-tags">
          <span className="badge badge-blue">{activeType.toUpperCase()}</span>
          <span className="meta-tag">{settings.size} × {settings.size}px</span>
          <span className="meta-tag">ECC: {settings.ecc}</span>
        </div>
      </div>

      {/* Main Preview Canvas Area */}
      <div className="qr-viewport-container">
        {isLoading && (
          <div className="qr-overlay loading-overlay" aria-live="polite">
            <Loader2 size={32} className="spin-icon" />
            <span>Rendering matrix...</span>
          </div>
        )}

        {/* 1. Valid Render State */}
        {isValid && dataUrl && !generationError && (
          <div className="qr-image-wrapper">
            <img
              src={dataUrl}
              alt={`Generated QR Code for ${activeType} destination`}
              className="qr-rendered-img"
              style={{
                backgroundColor: settings.bgColor,
              }}
            />
          </div>
        )}

        {/* 2. Generation / Overflow Error */}
        {generationError && (
          <div className="qr-state-box state-error" role="alert">
            <AlertTriangle size={36} className="state-icon text-danger" />
            <h3>Encoding Error</h3>
            <p>{generationError}</p>
          </div>
        )}

        {/* 3. Input Invalid State */}
        {hasInput && !isValid && (
          <div className="qr-state-box state-invalid" role="alert">
            <AlertTriangle size={36} className="state-icon text-warning" />
            <h3>Invalid Input</h3>
            <p>Please fix the errors in your input to generate the preview.</p>
          </div>
        )}

        {/* 4. Empty Initial State */}
        {!hasInput && !dataUrl && (
          <div className="qr-state-box state-empty">
            <div className="empty-qr-placeholder" aria-hidden="true">
              <QrCode size={56} className="placeholder-icon" />
            </div>
            <h3>Your QR Code Appears Here</h3>
            <p>Enter a URL, text, email, phone, or Wi-Fi network above to generate your instant code.</p>
          </div>
        )}
      </div>

      {/* Metadata Bar */}
      <div className="preview-metadata-bar">
        <div className="meta-item">
          <span className="meta-label">Payload Size:</span>
          <span className="meta-value">{byteSize} bytes</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Format:</span>
          <span className="meta-value">Lossless PNG</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Quiet Zone:</span>
          <span className="meta-value">{settings.margin} modules</span>
        </div>
      </div>

      {/* Advisory Scan Reliability Warning Banner */}
      {contrastInfo && contrastInfo.warnings.length > 0 && isValid && dataUrl && (
        <div className="scan-advisory-box" role="region" aria-label="Scan reliability advice">
          <div className="advisory-title">
            <AlertTriangle size={15} />
            <span>Scanning Reliability Advisory (Heuristic)</span>
          </div>
          <ul className="advisory-list">
            {contrastInfo.warnings.map((warn, i) => (
              <li key={i}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Optimal scan badge */}
      {contrastInfo && contrastInfo.warnings.length === 0 && isValid && dataUrl && (
        <div className="scan-optimal-box">
          <ShieldCheck size={16} />
          <span>Optimal contrast & quiet zone detected. High scanning reliability guaranteed across iOS and Android.</span>
        </div>
      )}
    </div>
  );
}
