import React from 'react';
import { Palette, Sliders, Shield, RotateCcw, Check } from 'lucide-react';

export const PRESETS = [
  {
    id: 'classic',
    name: 'Classic Slate',
    fgColor: '#0f172a',
    bgColor: '#ffffff',
    margin: 3,
    ecc: 'M',
    tag: 'Standard',
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    fgColor: '#1e3a8a',
    bgColor: '#f0f9ff',
    margin: 3,
    ecc: 'Q',
    tag: 'Vibrant',
  },
  {
    id: 'forest',
    name: 'Forest Mist',
    fgColor: '#064e3b',
    bgColor: '#f0fdf4',
    margin: 3,
    ecc: 'M',
    tag: 'Nature',
  },
  {
    id: 'violet',
    name: 'Royal Violet',
    fgColor: '#4c1d95',
    bgColor: '#faf5ff',
    margin: 3,
    ecc: 'Q',
    tag: 'Creative',
  },
  {
    id: 'midnight',
    name: 'Cyber Mint',
    fgColor: '#10b981',
    bgColor: '#0b0f17',
    margin: 3,
    ecc: 'H',
    tag: 'Dark Mode',
  },
];

export const ECC_DESCRIPTIONS = {
  L: { label: 'Low (~7%)', desc: 'Minimal data overhead. Best for simple URLs.' },
  M: { label: 'Medium (~15%)', desc: 'Balanced standard. Recommended for general use.' },
  Q: { label: 'Quartile (~25%)', desc: 'High resilience. Good for printed materials.' },
  H: { label: 'High (~30%)', desc: 'Maximum error recovery. Recommended for dense environments.' },
};

export function Customizer({
  settings,
  onChange,
  onReset,
  contrastInfo,
}) {
  const { fgColor, bgColor, size, margin, ecc, activePreset } = settings;

  const handleSetting = (key, value) => {
    // If user changes color, margin, or ecc, mark activePreset as 'custom'
    const newSettings = {
      ...settings,
      [key]: value,
      activePreset: 'custom',
    };
    onChange(newSettings);
  };

  const applyPreset = (preset) => {
    onChange({
      ...settings,
      fgColor: preset.fgColor,
      bgColor: preset.bgColor,
      margin: preset.margin,
      ecc: preset.ecc,
      activePreset: preset.id,
    });
  };

  return (
    <div className="customizer-section studio-card">
      <div className="section-header-row">
        <div>
          <h2 className="section-title">
            <Sliders size={18} className="title-icon" />
            <span>2. Design & Styling</span>
          </h2>
          <p className="section-desc">Personalize colors, geometry, quiet zone, and redundancy.</p>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-sm reset-btn"
          onClick={onReset}
          title="Reset styling to factory defaults"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

      {/* Presets Row */}
      <div className="presets-container">
        <label className="sub-label">Style Presets</label>
        <div className="presets-grid">
          {PRESETS.map((p) => {
            const isSelected = activePreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                className={`preset-card ${isSelected ? 'selected' : ''}`}
                onClick={() => applyPreset(p)}
                aria-pressed={isSelected}
              >
                <div className="preset-swatch-box" style={{ backgroundColor: p.bgColor }}>
                  <div className="preset-swatch-inner" style={{ backgroundColor: p.fgColor }} />
                </div>
                <div className="preset-info">
                  <span className="preset-name">{p.name}</span>
                  <span className="preset-tag">{p.tag}</span>
                </div>
                {isSelected && <Check size={14} className="preset-check" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Customization */}
      <div className="control-group">
        <label className="sub-label">
          <Palette size={14} />
          <span>Color Scheme</span>
        </label>
        <div className="color-pickers-row">
          {/* Foreground */}
          <div className="color-field">
            <span className="color-field-label">Foreground (Dots)</span>
            <div className="color-input-wrapper">
              <input
                type="color"
                className="native-color-picker"
                value={fgColor}
                onChange={(e) => handleSetting('fgColor', e.target.value)}
                aria-label="QR Code foreground color"
              />
              <input
                type="text"
                className="hex-input"
                value={fgColor.toUpperCase()}
                onChange={(e) => handleSetting('fgColor', e.target.value)}
                maxLength={7}
                spellCheck="false"
              />
            </div>
          </div>

          {/* Background */}
          <div className="color-field">
            <span className="color-field-label">Background</span>
            <div className="color-input-wrapper">
              <input
                type="color"
                className="native-color-picker"
                value={bgColor}
                onChange={(e) => handleSetting('bgColor', e.target.value)}
                aria-label="QR Code background color"
              />
              <input
                type="text"
                className="hex-input"
                value={bgColor.toUpperCase()}
                onChange={(e) => handleSetting('bgColor', e.target.value)}
                maxLength={7}
                spellCheck="false"
              />
            </div>
          </div>
        </div>

        {/* Contrast feedback badge */}
        {contrastInfo && (
          <div className={`contrast-badge-row contrast-${contrastInfo.level}`}>
            <span className="contrast-dot" />
            <span className="contrast-label">
              Contrast {contrastInfo.ratio}:1 — {contrastInfo.summary}
            </span>
          </div>
        )}
      </div>

      {/* Dimensions Slider */}
      <div className="control-group">
        <div className="slider-header">
          <label htmlFor="size-slider" className="sub-label">
            Export Dimensions
          </label>
          <span className="slider-val">{size} × {size} px</span>
        </div>
        <input
          id="size-slider"
          type="range"
          min="256"
          max="2048"
          step="64"
          value={size}
          onChange={(e) => handleSetting('size', Number(e.target.value))}
          className="studio-range"
        />
        <div className="slider-ticks">
          <span>256px</span>
          <span>512px (Default)</span>
          <span>1024px</span>
          <span>2048px (Ultra HD)</span>
        </div>
      </div>

      {/* Margin / Quiet Zone Slider */}
      <div className="control-group">
        <div className="slider-header">
          <label htmlFor="margin-slider" className="sub-label">
            Quiet Zone (Margin)
          </label>
          <span className="slider-val">{margin} {margin === 1 ? 'module' : 'modules'}</span>
        </div>
        <input
          id="margin-slider"
          type="range"
          min="0"
          max="8"
          step="1"
          value={margin}
          onChange={(e) => handleSetting('margin', Number(e.target.value))}
          className="studio-range"
        />
        <p className="control-helper">
          An adequate quiet zone (2–4 modules) ensures camera auto-focus distinguishes the code from background textures.
        </p>
      </div>

      {/* Error Correction Level */}
      <div className="control-group">
        <label className="sub-label">
          <Shield size={14} />
          <span>Error Correction Redundancy (ECC)</span>
        </label>
        <div className="ecc-button-group" role="radiogroup" aria-label="Error Correction Level">
          {['L', 'M', 'Q', 'H'].map((lvl) => {
            const isSelected = ecc === lvl;
            const meta = ECC_DESCRIPTIONS[lvl];
            return (
              <button
                key={lvl}
                type="button"
                className={`ecc-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => handleSetting('ecc', lvl)}
                role="radio"
                aria-checked={isSelected}
                title={meta.desc}
              >
                <span className="ecc-code">{lvl}</span>
                <span className="ecc-name">{meta.label}</span>
              </button>
            );
          })}
        </div>
        <p className="control-helper">
          {ECC_DESCRIPTIONS[ecc]?.desc}
        </p>
      </div>
    </div>
  );
}
