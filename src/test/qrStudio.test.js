import { describe, it, expect, beforeEach } from 'vitest';
import QRCode from 'qrcode';

import {
  escapeWifiField,
  buildUrlPayload,
  buildEmailPayload,
  buildPhonePayload,
  buildWifiPayload,
  buildPayload,
} from '../utils/qrPayload';

import {
  validateUrl,
  validateText,
  validateEmail,
  validatePhone,
  validateWifi,
  validateInput,
} from '../utils/validation';

import {
  hexToRgb,
  getRelativeLuminance,
  getContrastRatio,
  analyzeScanReliability,
} from '../utils/contrast';

import {
  loadHistory,
  saveHistory,
  addHistoryItem,
  removeHistoryItem,
  clearAllHistory,
} from '../utils/storage';

describe('1. QR Payload Builders & Normalization', () => {
  it('normalizes URLs correctly with and without explicit scheme', () => {
    expect(buildUrlPayload('example.com')).toBe('https://example.com');
    expect(buildUrlPayload('http://sub.domain.org/path?q=1')).toBe('http://sub.domain.org/path?q=1');
    expect(buildUrlPayload('https://gdg.community.dev')).toBe('https://gdg.community.dev');
    expect(buildUrlPayload('')).toBe('');
  });

  it('constructs mailto: payload with proper RFC 3986 encoding for spaces & special characters', () => {
    const payload = buildEmailPayload({
      address: 'recruitment@gdgsrm.org',
      subject: 'QR Studio Inquiry & Submission!',
      body: 'Hello GDG Team,\nHere is my recruitment test.',
    });
    expect(payload).toContain('mailto:recruitment@gdgsrm.org?');
    expect(payload).toContain('subject=QR%20Studio%20Inquiry%20%26%20Submission!');
    expect(payload).toContain('body=Hello%20GDG%20Team%2C%0AHere%20is%20my%20recruitment%20test.');
  });

  it('constructs minimal mailto: when subject and body are omitted', () => {
    expect(buildEmailPayload({ address: 'test@example.com' })).toBe('mailto:test@example.com');
  });

  it('normalizes telephone numbers into tel: format while preserving international prefix', () => {
    expect(buildPhonePayload('+91 (987) 654-3210')).toBe('tel:+919876543210');
    expect(buildPhonePayload('1-800-555-0199')).toBe('tel:18005550199');
    expect(buildPhonePayload('')).toBe('');
  });

  it('escapes special characters in Wi-Fi fields according to ZXing specification', () => {
    // Backslash, semicolon, comma, colon, double-quote
    const testString = 'My\\Net;Work,Name:With"Quotes';
    const escaped = escapeWifiField(testString);
    expect(escaped).toBe('My\\\\Net\\;Work\\,Name\\:With\\"Quotes');
  });

  it('generates standard WPA/WPA2 Wi-Fi payloads', () => {
    const wifi = buildWifiPayload({
      ssid: 'Campus_WiFi',
      password: 'Secret;Password',
      security: 'WPA',
      hidden: false,
    });
    expect(wifi).toBe('WIFI:S:Campus_WiFi;T:WPA;P:Secret\\;Password;;');
  });

  it('generates WEP Wi-Fi payloads', () => {
    const wifi = buildWifiPayload({
      ssid: 'Legacy_Net',
      password: 'wep12345',
      security: 'WEP',
      hidden: false,
    });
    expect(wifi).toBe('WIFI:S:Legacy_Net;T:WEP;P:wep12345;;');
  });

  it('omits password for open (nopass) Wi-Fi networks', () => {
    const wifi = buildWifiPayload({
      ssid: 'SRM_Public',
      password: 'IgnoredPassword',
      security: 'nopass',
      hidden: false,
    });
    expect(wifi).toBe('WIFI:S:SRM_Public;T:nopass;;');
    expect(wifi).not.toContain('P:');
  });

  it('handles hidden Wi-Fi networks', () => {
    const wifi = buildWifiPayload({
      ssid: 'SecretSSID',
      password: 'Pass',
      security: 'WPA',
      hidden: true,
    });
    expect(wifi).toBe('WIFI:S:SecretSSID;T:WPA;P:Pass;H:true;;');
  });

  it('master dispatcher builds payload for all types', () => {
    expect(buildPayload('url', { url: 'example.com' })).toBe('https://example.com');
    expect(buildPayload('text', { text: 'Hello 🌟 World' })).toBe('Hello 🌟 World');
    expect(buildPayload('email', { email: 'test@a.com' })).toBe('mailto:test@a.com');
    expect(buildPayload('phone', { phone: '123456789' })).toBe('tel:123456789');
    expect(buildPayload('wifi', { ssid: 'Net', security: 'nopass' })).toBe('WIFI:S:Net;T:nopass;;');
  });
});

describe('2. Validation Engine', () => {
  it('validates URLs and catches malformed or dangerous protocols', () => {
    expect(validateUrl('https://example.com').isValid).toBe(true);
    expect(validateUrl('google.com/search?q=qr').isValid).toBe(true);
    expect(validateUrl('javascript:alert(1)').isValid).toBe(false);
    expect(validateUrl('javascript:alert(1)').error).toContain('Unsupported or unsafe');
    expect(validateUrl('not-a-valid-url').isValid).toBe(false);
    expect(validateUrl('').isValid).toBe(false);
  });

  it('validates plain text and checks capacity limits', () => {
    expect(validateText('Valid text with emojis 🎉').isValid).toBe(true);
    expect(validateText('').isValid).toBe(false);
    const oversized = 'A'.repeat(3000);
    expect(validateText(oversized).isValid).toBe(false);
    expect(validateText(oversized).error).toContain('Payload too large');
  });

  it('validates email addresses strictly', () => {
    expect(validateEmail({ email: 'user@domain.com' }).isValid).toBe(true);
    expect(validateEmail({ email: 'invalid-email' }).isValid).toBe(false);
    expect(validateEmail({ email: '' }).isValid).toBe(false);
  });

  it('validates phone numbers', () => {
    expect(validatePhone('+1 (555) 012-3456').isValid).toBe(true);
    expect(validatePhone('9876543210').isValid).toBe(true);
    expect(validatePhone('abc123').isValid).toBe(false);
    expect(validatePhone('12').isValid).toBe(false); // too short
  });

  it('validates Wi-Fi network credentials based on security type', () => {
    // Missing SSID
    expect(validateWifi({ ssid: '', security: 'WPA', password: 'password123' }).isValid).toBe(false);
    // WPA requires min 8 chars password
    expect(validateWifi({ ssid: 'Home', security: 'WPA', password: 'short' }).isValid).toBe(false);
    expect(validateWifi({ ssid: 'Home', security: 'WPA', password: 'validpassword' }).isValid).toBe(true);
    // Open Wi-Fi requires no password
    expect(validateWifi({ ssid: 'Cafe_Open', security: 'nopass' }).isValid).toBe(true);
  });
});

describe('3. Contrast & Scanning Reliability Heuristics', () => {
  it('converts hex to RGB correctly', () => {
    expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#3b82f6')).toEqual({ r: 59, g: 130, b: 246 });
  });

  it('computes relative luminance and contrast ratio', () => {
    const ratio = getContrastRatio('#000000', '#ffffff');
    expect(ratio).toBeCloseTo(21, 0); // Black on white is 21:1
  });

  it('detects optimal contrast and zero quiet zone warnings', () => {
    const optimal = analyzeScanReliability({
      fgColor: '#000000',
      bgColor: '#ffffff',
      margin: 4,
      size: 512,
    });
    expect(optimal.level).toBe('optimal');
    expect(optimal.warnings.length).toBe(0);

    const zeroMargin = analyzeScanReliability({
      fgColor: '#000000',
      bgColor: '#ffffff',
      margin: 0,
      size: 512,
    });
    expect(zeroMargin.warnings.some(w => w.includes('Quiet zone'))).toBe(true);

    const lowContrast = analyzeScanReliability({
      fgColor: '#888888',
      bgColor: '#999999',
      margin: 3,
      size: 512,
    });
    expect(lowContrast.level).toBe('danger');
    expect(lowContrast.warnings.some(w => w.includes('contrast'))).toBe(true);
  });

  it('detects inverted color scheme', () => {
    const inverted = analyzeScanReliability({
      fgColor: '#ffffff',
      bgColor: '#000000',
      margin: 3,
      size: 512,
    });
    expect(inverted.isInverted).toBe(true);
    expect(inverted.warnings.some(w => w.includes('Inverted'))).toBe(true);
  });
});

describe('4. Storage & Privacy Persistence', () => {
  beforeEach(() => {
    // Mock localStorage
    const store = {};
    global.window = {
      localStorage: {
        getItem: (k) => store[k] || null,
        setItem: (k, v) => { store[k] = String(v); },
        removeItem: (k) => { delete store[k]; },
        clear: () => { Object.keys(store).forEach(k => delete store[k]); },
      },
    };
  });

  it('strips Wi-Fi password when storing in history for privacy', () => {
    const item = {
      type: 'wifi',
      title: 'Secret Network',
      payload: 'WIFI:S:Secret;T:WPA;P:SuperSecretPassword;;',
      contentData: { ssid: 'Secret', password: 'SuperSecretPassword', security: 'WPA' },
      customization: { fgColor: '#000', bgColor: '#fff', size: 512, margin: 3, ecc: 'M' },
    };

    const updated = addHistoryItem(item);
    expect(updated.length).toBe(1);
    expect(updated[0].contentData.password).toBe('');
    expect(updated[0].wifiPasswordOmitted).toBe(true);
  });

  it('handles corrupted localStorage data without crashing', () => {
    window.localStorage.setItem('qr_studio_history_v1', 'corrupted-json{{{[invalid');
    const result = loadHistory();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('removes item and clears history safely', () => {
    const item1 = { id: 'item_1', type: 'url', payload: 'https://test1.com', contentData: { url: 'https://test1.com' } };
    const item2 = { id: 'item_2', type: 'url', payload: 'https://test2.com', contentData: { url: 'https://test2.com' } };
    addHistoryItem(item1);
    addHistoryItem(item2);

    expect(loadHistory().length).toBe(2);
    removeHistoryItem('item_1');
    expect(loadHistory().length).toBe(1);

    clearAllHistory();
    expect(loadHistory().length).toBe(0);
  });
});

describe('5. Real QR Matrix Generation Engine', () => {
  it('generates a valid high-resolution PNG Data URL for a website URL', async () => {
    const dataUrl = await QRCode.toDataURL('https://gdg.community.dev', {
      width: 512,
      margin: 3,
      color: { dark: '#0f172a', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    });

    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
    expect(dataUrl.length).toBeGreaterThan(100);
  });

  it('generates valid QR code with high error correction (H)', async () => {
    const dataUrl = await QRCode.toDataURL('https://example.com/test', {
      errorCorrectionLevel: 'H',
    });
    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
  });

  it('throws an error gracefully when payload exceeds capacity', async () => {
    const giantPayload = 'Z'.repeat(4000);
    await expect(QRCode.toDataURL(giantPayload, { errorCorrectionLevel: 'H' }))
      .rejects.toThrow();
  });
});
