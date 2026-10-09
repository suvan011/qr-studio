import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';

export function TextForm({ values, onChange, errors }) {
  const handleChange = (e) => {
    onChange({ ...values, text: e.target.value });
  };

  const textVal = values.text || '';
  const byteCount = new TextEncoder().encode(textVal).length;

  return (
    <div className="form-type-content">
      <div className="form-group">
        <label htmlFor="text-input" className="form-label">
          <span>Plain Text / Markdown / Notes</span>
          <span className="char-counter">
            {textVal.length} chars • {byteCount} bytes
          </span>
        </label>
        <div className="textarea-container">
          <textarea
            id="text-input"
            rows={5}
            className={`form-textarea ${errors.text ? 'has-error' : ''}`}
            placeholder="Type or paste any multiline text, notes, or Unicode / emoji characters..."
            value={textVal}
            onChange={handleChange}
          />
        </div>
        {errors.text ? (
          <div className="field-error" role="alert">
            <AlertCircle size={14} />
            <span>{errors.text}</span>
          </div>
        ) : (
          <div className="field-helper">
            Fully supports Unicode characters, symbols, emojis, and multiline formatting.
          </div>
        )}
      </div>
    </div>
  );
}
