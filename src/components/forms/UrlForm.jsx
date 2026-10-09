import React from 'react';
import { Globe, AlertCircle } from 'lucide-react';

export function UrlForm({ values, onChange, errors }) {
  const handleChange = (e) => {
    onChange({ ...values, url: e.target.value });
  };

  return (
    <div className="form-type-content">
      <div className="form-group">
        <label htmlFor="url-input" className="form-label">
          <span>Website URL</span>
          <span className="label-badge">Required</span>
        </label>
        <div className="input-with-icon">
          <Globe size={18} className="input-icon" />
          <input
            id="url-input"
            type="text"
            className={`form-input pl-input ${errors.url ? 'has-error' : ''}`}
            placeholder="example.com or https://yourdomain.com"
            value={values.url || ''}
            onChange={handleChange}
            autoComplete="url"
            spellCheck="false"
          />
        </div>
        {errors.url ? (
          <div className="field-error" role="alert">
            <AlertCircle size={14} />
            <span>{errors.url}</span>
          </div>
        ) : (
          <div className="field-helper">
            If omitted, standard <code>https://</code> will automatically be prepended upon scanning.
          </div>
        )}
      </div>
    </div>
  );
}
