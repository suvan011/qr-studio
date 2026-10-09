/**
 * LocalStorage Safe Wrapper and History Manager for QR Studio
 * Handles quota limits, corrupted JSON, private browsing restrictions,
 * and security sanitization (Wi-Fi passwords stripped).
 */

const STORAGE_KEY = 'qr_studio_history_v1';
const PREFS_KEY = 'qr_studio_preferences_v1';
const MAX_HISTORY_ITEMS = 8;

/**
 * Checks if localStorage is available and writable.
 */
function isStorageAvailable() {
  try {
    const testKey = '__qr_test_storage__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads recent history entries safely.
 * @returns {Array<Object>}
 */
export function loadHistory() {
  if (!isStorageAvailable()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    // Filter and sanitize entries
    return parsed.filter(item => item && typeof item === 'object' && item.id && item.type);
  } catch (err) {
    console.warn('QR Studio: Failed to parse stored history. Initializing empty history.', err);
    return [];
  }
}

/**
 * Saves history array safely.
 * @param {Array<Object>} history
 * @returns {boolean}
 */
export function saveHistory(history) {
  if (!isStorageAvailable()) return false;

  try {
    const trimmed = (history || []).slice(0, MAX_HISTORY_ITEMS);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return true;
  } catch (err) {
    console.warn('QR Studio: Failed to save history to localStorage.', err);
    return false;
  }
}

/**
 * Adds or updates a QR item in history.
 * Strips Wi-Fi password for privacy before persistence.
 * @param {Object} item
 * @returns {Array<Object>} Updated history array
 */
export function addHistoryItem(item) {
  const current = loadHistory();

  // Create sanitized item copy
  const sanitizedItem = {
    id: item.id || `qr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type: item.type,
    title: item.title || item.type.toUpperCase(),
    subtitle: item.subtitle || '',
    payload: item.payload,
    // Store content configuration
    contentData: { ...item.contentData },
    // Customization settings
    customization: {
      fgColor: item.customization?.fgColor || '#000000',
      bgColor: item.customization?.bgColor || '#ffffff',
      size: item.customization?.size || 512,
      margin: item.customization?.margin ?? 3,
      ecc: item.customization?.ecc || 'M',
      preset: item.customization?.preset || 'custom',
    },
    thumbnailDataUrl: item.thumbnailDataUrl || '',
    createdAt: Date.now(),
  };

  // Strip Wi-Fi password from persistent storage
  if (sanitizedItem.type === 'wifi' && sanitizedItem.contentData) {
    if (sanitizedItem.contentData.password) {
      sanitizedItem.contentData.password = '';
      sanitizedItem.wifiPasswordOmitted = true;
    }
  }

  // Deduplicate: If same payload already exists, remove older duplicate and bump to top
  const filtered = current.filter(existing => existing.payload !== sanitizedItem.payload);

  const updated = [sanitizedItem, ...filtered].slice(0, MAX_HISTORY_ITEMS);
  saveHistory(updated);
  return updated;
}

/**
 * Removes a single history item by ID.
 * @param {string} id
 * @returns {Array<Object>}
 */
export function removeHistoryItem(id) {
  const current = loadHistory();
  const updated = current.filter(item => item.id !== id);
  saveHistory(updated);
  return updated;
}

/**
 * Clears all history items.
 * @returns {Array<Object>} Empty array
 */
export function clearAllHistory() {
  if (isStorageAvailable()) {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('QR Studio: Failed to clear history.', err);
    }
  }
  return [];
}

/**
 * Loads user theme preference.
 * @returns {'dark'|'light'|null}
 */
export function loadThemePreference() {
  if (!isStorageAvailable()) return null;
  try {
    return window.localStorage.getItem('qr_studio_theme') || null;
  } catch {
    return null;
  }
}

/**
 * Saves user theme preference.
 * @param {'dark'|'light'} theme
 */
export function saveThemePreference(theme) {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.setItem('qr_studio_theme', theme);
  } catch {
    // Ignore storage failure
  }
}
