import React, { useState, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ContentForm } from './components/ContentForm';
import { Customizer, PRESETS } from './components/Customizer';
import { PreviewCard } from './components/PreviewCard';
import { ActionButtons } from './components/ActionButtons';
import { HistoryList } from './components/HistoryList';
import { Toast } from './components/Toast';
import { AboutModal } from './components/AboutModal';
import { Footer } from './components/Footer';

import { buildPayload } from './utils/qrPayload';
import { validateInput } from './utils/validation';
import { analyzeScanReliability } from './utils/contrast';
import {
  loadHistory,
  addHistoryItem,
  removeHistoryItem,
  clearAllHistory,
} from './utils/storage';
import { useQRCode } from './hooks/useQRCode';
import { useTheme } from './hooks/useTheme';

const INITIAL_FORM_DATA = {
  url: { url: 'https://gdg.community.dev' },
  text: { text: '' },
  email: { email: '', subject: '', body: '' },
  phone: { phone: '' },
  wifi: { ssid: '', password: '', security: 'WPA', hidden: false },
};

const INITIAL_SETTINGS = {
  fgColor: '#0f172a',
  bgColor: '#ffffff',
  size: 512,
  margin: 3,
  ecc: 'M',
  activePreset: 'classic',
};

export function App() {
  const { theme, toggleTheme } = useTheme();
  const [activeType, setActiveType] = useState('url');
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [history, setHistory] = useState(() => loadHistory());
  const [toast, setToast] = useState(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const notify = useCallback((message, type = 'info') => {
    setToast({ message, type });
  }, []);

  // Current active form inputs
  const currentTypeData = formData[activeType] || {};

  // Validate current form
  const validationResult = useMemo(() => {
    return validateInput(activeType, currentTypeData);
  }, [activeType, currentTypeData]);

  // Construct current payload
  const payload = useMemo(() => {
    return buildPayload(activeType, currentTypeData);
  }, [activeType, currentTypeData]);

  // Has user entered any input in the active type?
  const hasInput = useMemo(() => {
    switch (activeType) {
      case 'url':
        return Boolean(currentTypeData.url && currentTypeData.url.trim());
      case 'text':
        return Boolean(currentTypeData.text && currentTypeData.text.trim());
      case 'email':
        return Boolean(currentTypeData.email && currentTypeData.email.trim());
      case 'phone':
        return Boolean(currentTypeData.phone && currentTypeData.phone.trim());
      case 'wifi':
        return Boolean(currentTypeData.ssid && currentTypeData.ssid.trim());
      default:
        return false;
    }
  }, [activeType, currentTypeData]);

  // Generate QR Code with safety against race conditions
  const { dataUrl, isLoading, generationError, byteSize } = useQRCode({
    payload,
    isValid: validationResult.isValid,
    fgColor: settings.fgColor,
    bgColor: settings.bgColor,
    margin: settings.margin,
    ecc: settings.ecc,
    size: settings.size,
  });

  // Calculate contrast and scan reliability heuristics
  const contrastInfo = useMemo(() => {
    return analyzeScanReliability({
      fgColor: settings.fgColor,
      bgColor: settings.bgColor,
      margin: settings.margin,
      size: settings.size,
      payloadLength: byteSize,
    });
  }, [settings.fgColor, settings.bgColor, settings.margin, settings.size, byteSize]);

  // Handle form data changes
  const handleFormChange = useCallback((type, updatedValues) => {
    setFormData((prev) => ({
      ...prev,
      [type]: updatedValues,
    }));
  }, []);

  // Reset customizer settings to classic default
  const handleResetSettings = useCallback(() => {
    setSettings(INITIAL_SETTINGS);
    notify('Design settings restored to defaults.', 'info');
  }, [notify]);

  // Save creation to persistent history
  const handleSaveToHistory = useCallback(() => {
    if (!validationResult.isValid || !payload || !dataUrl) return;

    let title = 'QR Code';
    switch (activeType) {
      case 'url':
        title = currentTypeData.url || 'Website';
        break;
      case 'text':
        title = (currentTypeData.text || '').slice(0, 32) + ((currentTypeData.text || '').length > 32 ? '...' : '');
        break;
      case 'email':
        title = currentTypeData.email || 'Email Draft';
        break;
      case 'phone':
        title = currentTypeData.phone || 'Phone Number';
        break;
      case 'wifi':
        title = `Wi-Fi: ${currentTypeData.ssid || 'Network'}`;
        break;
      default:
        title = 'QR Code';
    }

    const item = {
      type: activeType,
      title,
      payload,
      contentData: { ...currentTypeData },
      customization: { ...settings },
      thumbnailDataUrl: dataUrl,
    };

    const updated = addHistoryItem(item);
    setHistory(updated);
  }, [activeType, currentTypeData, validationResult.isValid, payload, dataUrl, settings]);

  // Restore creation from history
  const handleRestoreFromHistory = useCallback((item) => {
    if (!item) return;

    // Restore type
    setActiveType(item.type);

    // Restore content
    if (item.contentData) {
      setFormData((prev) => ({
        ...prev,
        [item.type]: { ...item.contentData },
      }));
    }

    // Restore styling
    if (item.customization) {
      setSettings({
        fgColor: item.customization.fgColor || '#0f172a',
        bgColor: item.customization.bgColor || '#ffffff',
        size: item.customization.size || 512,
        margin: item.customization.margin ?? 3,
        ecc: item.customization.ecc || 'M',
        activePreset: item.customization.preset || 'custom',
      });
    }

    notify(`Restored ${item.title} to workspace.`, 'success');
  }, [notify]);

  // Remove individual history item
  const handleRemoveHistoryItem = useCallback((id) => {
    const updated = removeHistoryItem(id);
    setHistory(updated);
    notify('Item removed from history.', 'info');
  }, [notify]);

  // Clear all history
  const handleClearAllHistory = useCallback(() => {
    const empty = clearAllHistory();
    setHistory(empty);
    notify('All recent creations cleared.', 'info');
  }, [notify]);

  return (
    <div className="app-root">
      {/* Top Navigation */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      <main className="main-content">
        <div className="app-container">
          {/* Hero Section */}
          <Hero />

          {/* Main 2-Column Workspace Grid */}
          <div className="workspace-grid">
            {/* Left Column: Input Forms & Customization */}
            <div className="workspace-left">
              <div className="input-card studio-card">
                <ContentForm
                  activeType={activeType}
                  onTypeChange={setActiveType}
                  formData={formData}
                  onFormChange={handleFormChange}
                  errors={validationResult.errors}
                />
              </div>

              <Customizer
                settings={settings}
                onChange={setSettings}
                onReset={handleResetSettings}
                contrastInfo={contrastInfo}
              />
            </div>

            {/* Right Column: Live Preview, Download & History */}
            <div className="workspace-right">
              <PreviewCard
                dataUrl={dataUrl}
                isLoading={isLoading}
                isValid={validationResult.isValid}
                hasInput={hasInput}
                generationError={generationError}
                activeType={activeType}
                settings={settings}
                byteSize={byteSize}
                contrastInfo={contrastInfo}
              />

              <ActionButtons
                dataUrl={dataUrl}
                payload={payload}
                isValid={validationResult.isValid}
                activeType={activeType}
                settings={settings}
                onNotify={notify}
                onSaveToHistory={handleSaveToHistory}
              />

              <HistoryList
                history={history}
                onRestore={handleRestoreFromHistory}
                onRemove={handleRemoveHistoryItem}
                onClearAll={handleClearAllHistory}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Toast Notification Container */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Specifications and About Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
export default App;
