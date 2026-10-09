import React from 'react';
import { Phone, AlertCircle } from 'lucide-react';

export function PhoneForm({ values, onChange, errors }) {
  const handleChange = (e) => {
    onChange({ ...values, phone: e.target.value });
  };

  return (
    <div className="form-type-content">
      <div className="form-group">
        <label htmlFor="phone-input" className="form-label">
          <span>Phone Number</span>
          <span className="label-badge">Required</span>
        </label>
        <div className="input-with-icon">
          <Phone size={18} className="input-icon" />
          <input
            id="phone-input"
            type="tel"
            className={`form-input pl-input ${errors.phone ? 'has-error' : ''}`}
            placeholder="+91 98765 43210 or +1 (555) 234-5678"
            value={values.phone || ''}
            onChange={handleChange}
            autoComplete="tel"
          />
        </div>
        {errors.phone ? (
          <div className="field-error" role="alert">
            <AlertCircle size={14} />
            <span>{errors.phone}</span>
          </div>
        ) : (
          <div className="field-helper">
            International format starting with <code>+</code> is recommended for global compatibility.
          </div>
        )}
      </div>
    </div>
  );
}
