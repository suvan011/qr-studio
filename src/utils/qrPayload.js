/**
 * QR Payload Construction and Escaping Utilities
 * Implements strict format specifications for URL, Text, Email, Phone, and Wi-Fi.
 */

/**
 * Escapes characters for MECARD / ZXing Wi-Fi format:
 * Backslash, semicolon, comma, colon, and double-quote must be escaped with a leading backslash.
 * @param {string} str
 * @returns {string}
 */
export function escapeWifiField(str = '') {
  if (typeof str !== 'string') return '';
  return str.replace(/([\\;,:"'])/g, '\\$1');
}

/**
 * Normalizes and builds a URL payload.
 * Adds https:// scheme if omitted, provided it has a plausible host structure.
 * @param {string} rawUrl
 * @returns {string}
 */
export function buildUrlPayload(rawUrl) {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) return '';

  // Check if protocol already present
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)) {
    return trimmed;
  }

  // Prepend https://
  return `https://${trimmed}`;
}

/**
 * Builds an Email (mailto:) payload with proper percent-encoding.
 * @param {Object} params
 * @param {string} params.address - Target email address
 * @param {string} [params.subject] - Optional subject
 * @param {string} [params.body] - Optional message body
 * @returns {string}
 */
export function buildEmailPayload({ address = '', subject = '', body = '' }) {
  const cleanAddress = address.trim();
  if (!cleanAddress) return '';

  const queryParts = [];
  if (subject && subject.trim()) {
    queryParts.push(`subject=${encodeURIComponent(subject.trim())}`);
  }
  if (body && body.trim()) {
    queryParts.push(`body=${encodeURIComponent(body.trim())}`);
  }

  const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  return `mailto:${cleanAddress}${query}`;
}

/**
 * Normalizes and builds a Phone (tel:) payload.
 * Preserves leading '+' for international format, strips spaces, brackets, hyphens.
 * @param {string} phone
 * @returns {string}
 */
export function buildPhonePayload(phone = '') {
  const trimmed = (phone || '').trim();
  if (!trimmed) return '';

  const hasLeadingPlus = trimmed.startsWith('+');
  const digitsOnly = trimmed.replace(/\D/g, '');

  if (!digitsOnly) return '';

  return `tel:${hasLeadingPlus ? '+' : ''}${digitsOnly}`;
}

/**
 * Builds a standard ZXing Wi-Fi configuration string.
 * Format: WIFI:S:<ssid>;T:<WPA|WEP|nopass>;P:<password>;H:<true|false>;;
 * @param {Object} params
 * @param {string} params.ssid - Wi-Fi Network Name
 * @param {string} [params.password] - Network Password
 * @param {'WPA'|'WEP'|'nopass'} [params.security] - Security type
 * @param {boolean} [params.hidden] - Whether SSID is hidden
 * @returns {string}
 */
export function buildWifiPayload({ ssid = '', password = '', security = 'WPA', hidden = false }) {
  const cleanSsid = (ssid || '').trim();
  if (!cleanSsid) return '';

  const escapedSsid = escapeWifiField(cleanSsid);
  const secType = ['WPA', 'WEP', 'nopass'].includes(security) ? security : 'WPA';

  let payload = `WIFI:S:${escapedSsid};T:${secType};`;

  if (secType !== 'nopass' && password) {
    payload += `P:${escapeWifiField(password)};`;
  }

  if (hidden) {
    payload += `H:true;`;
  }

  payload += ';';
  return payload;
}

/**
 * Master payload builder dispatcher.
 * @param {string} type - 'url' | 'text' | 'email' | 'phone' | 'wifi'
 * @param {Object} data - Type-specific data values
 * @returns {string}
 */
export function buildPayload(type, data) {
  if (!data) return '';

  switch (type) {
    case 'url':
      return buildUrlPayload(data.url);
    case 'text':
      return data.text || '';
    case 'email':
      return buildEmailPayload({
        address: data.email,
        subject: data.subject,
        body: data.body,
      });
    case 'phone':
      return buildPhonePayload(data.phone);
    case 'wifi':
      return buildWifiPayload({
        ssid: data.ssid,
        password: data.password,
        security: data.security,
        hidden: data.hidden,
      });
    default:
      return '';
  }
}
