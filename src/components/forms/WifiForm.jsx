import React, { useState } from 'react';
import { Wifi, Eye, EyeOff, ShieldAlert, AlertCircle } from 'lucide-react';

export function WifiForm({ values, onChange, errors }) {
  const [showPassword, setShowPassword] = useState(false);

  const handleField = (field, val) => {
    onChange({ ...values, [field]: val });
  };

  const security = values.security || 'WPA';
  const isOpen = security === 'nopass';

  return (
    <div className="form-type-content">
      {/* SSID */}
      <div className="form-group">
        <label htmlFor="wifi-ssid" className="form-label">
          <span>Network Name (SSID)</span>
          <span className="label-badge">Required</span>
        </label>
        <div className="input-with-icon">
          <Wifi size={18} className="input-icon" />
          <input
            id="wifi-ssid"
            type="text"
            className={`form-input pl-input ${errors.ssid ? 'has-error' : ''}`}
            placeholder="e.g. SRM-Camp-Wi-Fi or Home_5G"
            value={values.ssid || ''}
            onChange={(e) => handleField('ssid', e.target.value)}
          />
        </div>
        {errors.ssid && (
          <div className="field-error" role="alert">
            <AlertCircle size={14} />
            <span>{errors.ssid}</span>
          </div>
        )}
      </div>

      {/* Security Type */}
      <div className="form-group">
        <label htmlFor="wifi-security" className="form-label">
          <span>Encryption / Security Type</span>
        </label>
        <select
          id="wifi-security"
          className="form-select"
          value={security}
          onChange={(e) => handleField('security', e.target.value)}
        >
          <option value="WPA">WPA / WPA2 / WPA3 (Standard)</option>
          <option value="WEP">WEP (Legacy)</option>
          <option value="nopass">None / Open Network (No Password)</option>
        </select>
      </div>

      {/* Password (if not Open) */}
      {!isOpen && (
        <div className="form-group">
          <label htmlFor="wifi-password" className="form-label">
            <span>Network Password</span>
            <span className="label-badge">Required</span>
          </label>
          <div className="input-with-action">
            <input
              id="wifi-password"
              type={showPassword ? 'text' : 'password'}
              className={`form-input pr-input ${errors.password ? 'has-error' : ''}`}
              placeholder="Enter Wi-Fi security key"
              value={values.password || ''}
              onChange={(e) => handleField('password', e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="input-action-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <div className="field-error" role="alert">
              <AlertCircle size={14} />
              <span>{errors.password}</span>
            </div>
          )}
        </div>
      )}

      {/* Hidden network checkbox */}
      <div className="form-checkbox-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={!!values.hidden}
            onChange={(e) => handleField('hidden', e.target.checked)}
          />
          <span>Hidden Network (SSID is not broadcasted)</span>
        </label>
      </div>

      {/* Privacy note */}
      <div className="wifi-privacy-notice">
        <ShieldAlert size={15} className="notice-icon" />
        <span>
          <strong>Privacy Guarantee:</strong> Network credentials are encoded entirely within your browser's memory and are never saved to history or transmitted over the internet.
        </span>
      </div>
    </div>
  );
}
