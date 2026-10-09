import React, { useState } from 'react';
import { Download, Copy, Image, Check, AlertCircle } from 'lucide-react';

export function ActionButtons({
  dataUrl,
  payload,
  isValid,
  activeType,
  settings,
  onNotify,
  onSaveToHistory,
}) {
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // 1. Download PNG
  const handleDownload = () => {
    if (!isValid || !dataUrl) {
      onNotify('Cannot download: QR code has invalid or empty input.', 'error');
      return;
    }

    try {
      setIsExporting(true);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
      const filename = `qr-studio-${activeType}-${settings.size}x${settings.size}-${timestamp}.png`;

      // Create download anchor
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Save to recent creations
      if (onSaveToHistory) {
        onSaveToHistory();
      }

      onNotify(`Downloaded ${filename} (${settings.size}×${settings.size}px)`, 'success');
    } catch (err) {
      onNotify('Failed to initiate PNG download. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // 2. Copy Raw Payload
  const handleCopyPayload = async () => {
    if (!payload || !payload.trim()) {
      onNotify('No QR payload to copy.', 'error');
      return;
    }

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(payload);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = payload;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
      onNotify('QR payload copied to clipboard!', 'success');
    } catch (err) {
      onNotify('Clipboard access denied. Please copy manually.', 'error');
    }
  };

  // 3. Copy QR Image to Clipboard
  const handleCopyImage = async () => {
    if (!isValid || !dataUrl) {
      onNotify('Cannot copy image: QR code is not ready.', 'error');
      return;
    }

    try {
      // Check if ClipboardItem is supported
      if (navigator.clipboard && window.ClipboardItem) {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);

        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2000);
        onNotify('QR Image copied to clipboard as PNG!', 'success');
      } else {
        onNotify('Image copying not supported in this browser. Use Download instead.', 'warning');
      }
    } catch (err) {
      onNotify('Could not copy image to clipboard. Downloading is recommended.', 'warning');
    }
  };

  const isActionDisabled = !isValid || !dataUrl;

  return (
    <div className="action-buttons-container">
      {/* Primary Download Button */}
      <button
        type="button"
        className="btn btn-primary btn-large download-btn"
        onClick={handleDownload}
        disabled={isActionDisabled || isExporting}
        aria-label="Download QR Code as High Resolution PNG"
      >
        <Download size={18} />
        <span>{isExporting ? 'Exporting PNG...' : `Download High-Res PNG (${settings.size}px)`}</span>
      </button>

      {/* Secondary Clipboard Actions */}
      <div className="action-grid">
        <button
          type="button"
          className="btn btn-secondary action-grid-btn"
          onClick={handleCopyPayload}
          disabled={!payload}
          title="Copy the encoded raw QR string"
        >
          {copiedPayload ? <Check size={16} className="text-mint" /> : <Copy size={16} />}
          <span>{copiedPayload ? 'Payload Copied!' : 'Copy Payload'}</span>
        </button>

        <button
          type="button"
          className="btn btn-secondary action-grid-btn"
          onClick={handleCopyImage}
          disabled={isActionDisabled}
          title="Copy the rendered PNG directly to clipboard"
        >
          {copiedImage ? <Check size={16} className="text-mint" /> : <Image size={16} />}
          <span>{copiedImage ? 'Image Copied!' : 'Copy PNG Image'}</span>
        </button>
      </div>
    </div>
  );
}
