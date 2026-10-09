/**
 * Input Validation Utilities for QR Studio
 * Provides field-level validation and error messaging.
 */

// Email regex adhering to common production standard
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validates Website URL
 * @param {string} rawUrl
 * @returns {{ isValid: boolean, error?: string, normalizedUrl?: string }}
 */
export function validateUrl(rawUrl) {
  const trimmed = (rawUrl || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Please enter a website URL.' };
  }

  // Reject dangerous protocols
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) {
    return { isValid: false, error: 'Unsupported or unsafe URL protocol.' };
  }

  let testUrl = trimmed;
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(testUrl)) {
    testUrl = `https://${testUrl}`;
  }

  try {
    const parsed = new URL(testUrl);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { isValid: false, error: 'Only HTTP and HTTPS web URLs are supported.' };
    }
    // Must contain a valid host with at least one dot or localhost
    if (!parsed.hostname || (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost')) {
      return { isValid: false, error: 'Please enter a valid domain name (e.g. example.com).' };
    }
    return { isValid: true, normalizedUrl: testUrl };
  } catch {
    return { isValid: false, error: 'Invalid URL format. Please check for typos.' };
  }
}

/**
 * Validates Plain Text
 * @param {string} text
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validateText(text) {
  if (!text || !text.trim()) {
    return { isValid: false, error: 'Please enter some text.' };
  }

  // UTF-8 byte length estimation
  const byteLength = new TextEncoder().encode(text).length;
  if (byteLength > 2500) {
    return { isValid: false, error: `Payload too large (${byteLength} bytes). Standard QR codes reliably support up to ~2,000 bytes.` };
  }

  return { isValid: true };
}

/**
 * Validates Email input
 * @param {Object} data
 * @param {string} data.email
 * @param {string} [data.subject]
 * @param {string} [data.body]
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateEmail({ email = '', subject = '', body = '' }) {
  const errors = {};
  const cleanEmail = email.trim();

  if (!cleanEmail) {
    errors.email = 'Please enter an email address.';
  } else if (!EMAIL_REGEX.test(cleanEmail)) {
    errors.email = 'Please enter a valid email address (e.g. name@example.com).';
  }

  if (subject && subject.length > 200) {
    errors.subject = 'Subject is too long (maximum 200 characters).';
  }

  if (body && body.length > 1000) {
    errors.body = 'Message body is too long (maximum 1,000 characters).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates Phone number
 * @param {string} phone
 * @returns {{ isValid: boolean, error?: string }}
 */
export function validatePhone(phone) {
  const trimmed = (phone || '').trim();
  if (!trimmed) {
    return { isValid: false, error: 'Please enter a phone number.' };
  }

  // Must only contain valid phone characters: digits, spaces, parentheses, hyphens, and leading +
  if (!/^\+?[\d\s\-()]+$/.test(trimmed)) {
    return { isValid: false, error: 'Phone number contains invalid characters.' };
  }

  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 3) {
    return { isValid: false, error: 'Phone number is too short (at least 3 digits required).' };
  }

  if (digits.length > 16) {
    return { isValid: false, error: 'Phone number is too long (maximum 16 digits).' };
  }

  return { isValid: true };
}

/**
 * Validates Wi-Fi configuration
 * @param {Object} data
 * @param {string} data.ssid
 * @param {string} data.password
 * @param {'WPA'|'WEP'|'nopass'} data.security
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateWifi({ ssid = '', password = '', security = 'WPA' }) {
  const errors = {};
  const cleanSsid = ssid.trim();

  if (!cleanSsid) {
    errors.ssid = 'Network name (SSID) is required.';
  } else if (cleanSsid.length > 32) {
    errors.ssid = 'SSID cannot exceed 32 characters.';
  }

  if (security === 'WPA') {
    if (!password) {
      errors.password = 'Password is required for WPA/WPA2 networks.';
    } else if (password.length < 8) {
      errors.password = 'WPA/WPA2 passwords must be at least 8 characters long.';
    } else if (password.length > 63) {
      errors.password = 'WPA/WPA2 passwords cannot exceed 63 characters.';
    }
  } else if (security === 'WEP') {
    if (!password) {
      errors.password = 'Password is required for WEP networks.';
    } else if (password.length < 5) {
      errors.password = 'WEP passwords must be at least 5 characters.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates input for given type
 * @param {string} type
 * @param {Object} data
 * @returns {{ isValid: boolean, errors: Record<string, string> }}
 */
export function validateInput(type, data) {
  if (!data) return { isValid: false, errors: { form: 'No data provided.' } };

  switch (type) {
    case 'url': {
      const res = validateUrl(data.url);
      return { isValid: res.isValid, errors: res.error ? { url: res.error } : {} };
    }
    case 'text': {
      const res = validateText(data.text);
      return { isValid: res.isValid, errors: res.error ? { text: res.error } : {} };
    }
    case 'email': {
      return validateEmail({
        email: data.email,
        subject: data.subject,
        body: data.body,
      });
    }
    case 'phone': {
      const res = validatePhone(data.phone);
      return { isValid: res.isValid, errors: res.error ? { phone: res.error } : {} };
    }
    case 'wifi': {
      return validateWifi({
        ssid: data.ssid,
        password: data.password,
        security: data.security,
      });
    }
    default:
      return { isValid: false, errors: { form: 'Unknown content type.' } };
  }
}
