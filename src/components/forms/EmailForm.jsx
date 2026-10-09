import React from 'react';
import { Mail, AlertCircle } from 'lucide-react';

export function EmailForm({ values, onChange, errors }) {
  const handleField = (field, val) => {
    onChange({ ...values, [field]: val });
  };

  return (
    <div className="form-type-content">
      {/* Email Address */}
      <div className="form-group">
        <label htmlFor="email-input" className="form-label">
          <span>Recipient Email Address</span>
          <span className="label-badge">Required</span>
        </label>
        <div className="input-with-icon">
          <Mail size={18} className="input-icon" />
          <input
            id="email-input"
            type="email"
            className={`form-input pl-input ${errors.email ? 'has-error' : ''}`}
            placeholder="recipient@example.com"
            value={values.email || ''}
            onChange={(e) => handleField('email', e.target.value)}
            autoComplete="email"
            spellCheck="false"
          />
        </div>
        {errors.email && (
          <div className="field-error" role="alert">
            <AlertCircle size={14} />
            <span>{errors.email}</span>
          </div>
        )}
      </div>

      {/* Subject */}
      <div className="form-group">
        <label htmlFor="subject-input" className="form-label">
          <span>Subject Line</span>
          <span className="label-badge optional">Optional</span>
        </label>
        <input
          id="subject-input"
          type="text"
          className={`form-input ${errors.subject ? 'has-error' : ''}`}
          placeholder="e.g. Project Inquiry / GDG SRM 2026"
          value={values.subject || ''}
          onChange={(e) => handleField('subject', e.target.value)}
        />
        {errors.subject && (
          <div className="field-error" role="alert">
            <AlertCircle size={14} />
            <span>{errors.subject}</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="form-group">
        <label htmlFor="body-input" className="form-label">
          <span>Message Body</span>
          <span className="label-badge optional">Optional</span>
        </label>
        <textarea
          id="body-input"
          rows={3}
          className={`form-textarea ${errors.body ? 'has-error' : ''}`}
          placeholder="Pre-populate email draft message here..."
          value={values.body || ''}
          onChange={(e) => handleField('body', e.target.value)}
        />
        {errors.body && (
          <div className="field-error" role="alert">
            <AlertCircle size={14} />
            <span>{errors.body}</span>
          </div>
        )}
      </div>
    </div>
  );
}
