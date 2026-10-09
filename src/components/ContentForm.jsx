import React from 'react';
import { Globe, FileText, Mail, Phone, Wifi } from 'lucide-react';
import { UrlForm } from './forms/UrlForm';
import { TextForm } from './forms/TextForm';
import { EmailForm } from './forms/EmailForm';
import { PhoneForm } from './forms/PhoneForm';
import { WifiForm } from './forms/WifiForm';

const CONTENT_TYPES = [
  { id: 'url', label: 'URL', icon: Globe, description: 'Website or web destination' },
  { id: 'text', label: 'Text', icon: FileText, description: 'Plain text or notes' },
  { id: 'email', label: 'Email', icon: Mail, description: 'Pre-filled email draft' },
  { id: 'phone', label: 'Phone', icon: Phone, description: 'Direct dial number' },
  { id: 'wifi', label: 'Wi-Fi', icon: Wifi, description: 'Wireless network login' },
];

export function ContentForm({ activeType, onTypeChange, formData, onFormChange, errors }) {
  return (
    <div className="content-form-section">
      <div className="section-header">
        <h2 className="section-title">
          <span>1. QR Content & Payload</span>
        </h2>
        <p className="section-desc">Select the type of QR code you want to generate.</p>
      </div>

      {/* Type Selector Navigation */}
      <nav className="type-selector-tabs" aria-label="QR Code Content Types">
        {CONTENT_TYPES.map((type) => {
          const Icon = type.icon;
          const isActive = activeType === type.id;
          return (
            <button
              key={type.id}
              type="button"
              className={`type-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => onTypeChange(type.id)}
              aria-selected={isActive}
              role="tab"
              title={type.description}
            >
              <Icon size={16} className="type-tab-icon" />
              <span className="type-tab-label">{type.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Dynamic Form for Selected Type */}
      <div className="active-form-wrapper" role="tabpanel">
        {activeType === 'url' && (
          <UrlForm values={formData.url || {}} onChange={(v) => onFormChange('url', v)} errors={errors} />
        )}
        {activeType === 'text' && (
          <TextForm values={formData.text || {}} onChange={(v) => onFormChange('text', v)} errors={errors} />
        )}
        {activeType === 'email' && (
          <EmailForm values={formData.email || {}} onChange={(v) => onFormChange('email', v)} errors={errors} />
        )}
        {activeType === 'phone' && (
          <PhoneForm values={formData.phone || {}} onChange={(v) => onFormChange('phone', v)} errors={errors} />
        )}
        {activeType === 'wifi' && (
          <WifiForm values={formData.wifi || {}} onChange={(v) => onFormChange('wifi', v)} errors={errors} />
        )}
      </div>
    </div>
  );
}
