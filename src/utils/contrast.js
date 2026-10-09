/**
 * QR Code Scanning Reliability and Contrast Heuristics
 * Calculates relative luminance, contrast ratio, and produces advisory warnings.
 */

/**
 * Converts a hex color (#rgb or #rrggbb) to RGB numbers.
 * @param {string} hex
 * @returns {{ r: number, g: number, b: number } | null}
 */
export function hexToRgb(hex) {
  if (!hex || typeof hex !== 'string') return null;
  let clean = hex.replace('#', '').trim();

  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }

  if (clean.length !== 6) return null;

  const num = parseInt(clean, 16);
  if (isNaN(num)) return null;

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Calculates WCAG relative luminance of an sRGB color.
 * @param {{ r: number, g: number, b: number }} rgb
 * @returns {number}
 */
export function getRelativeLuminance(rgb) {
  if (!rgb) return 0;
  const srgb = [rgb.r / 255, rgb.g / 255, rgb.b / 255];
  const linear = srgb.map(c => {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

/**
 * Calculates the contrast ratio between two hex colors (1:1 to 21:1).
 * @param {string} hex1
 * @param {string} hex2
 * @returns {number}
 */
export function getContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return 1;

  const lum1 = getRelativeLuminance(rgb1);
  const lum2 = getRelativeLuminance(rgb2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Evaluates scan reliability and generates advisory alerts.
 * @param {Object} options
 * @param {string} options.fgColor
 * @param {string} options.bgColor
 * @param {number} options.margin
 * @param {number} options.size
 * @param {number} options.payloadLength
 * @returns {{
 *   ratio: number,
 *   level: 'optimal' | 'acceptable' | 'warning' | 'danger',
 *   isInverted: boolean,
 *   warnings: string[],
 *   summary: string
 * }}
 */
export function analyzeScanReliability({ fgColor, bgColor, margin, size, payloadLength = 0 }) {
  const ratio = parseFloat(getContrastRatio(fgColor, bgColor).toFixed(2));
  const warnings = [];

  const rgbFg = hexToRgb(fgColor);
  const rgbBg = hexToRgb(bgColor);
  const lumFg = getRelativeLuminance(rgbFg);
  const lumBg = getRelativeLuminance(rgbBg);

  const isInverted = lumFg > lumBg;

  // 1. Contrast assessment
  let level = 'optimal';
  if (ratio >= 7.0) {
    level = 'optimal';
  } else if (ratio >= 4.0) {
    level = 'acceptable';
  } else if (ratio >= 2.5) {
    level = 'warning';
    warnings.push('Low color contrast (' + ratio + ':1). Most scanners require at least 4:1 contrast.');
  } else {
    level = 'danger';
    warnings.push('Critical low contrast (' + ratio + ':1). Camera sensors will likely fail to distinguish QR dots.');
  }

  // 2. Inverted scheme advisory
  if (isInverted) {
    warnings.push('Inverted colors detected (light foreground on dark background). While modern smartphones scan inverted codes, some legacy barcode scanners may struggle.');
  }

  // 3. Margin / quiet zone advisory
  if (margin === 0) {
    warnings.push('Quiet zone is set to 0. QR codes require surrounding margin to distinguish from adjacent content.');
    if (level === 'optimal') level = 'acceptable';
  } else if (margin === 1) {
    warnings.push('Quiet zone is minimal (1 module). A margin of 2-4 modules is recommended for physical print.');
  }

  // 4. Density vs output size
  if (payloadLength > 400 && size < 350) {
    warnings.push('High data density for selected export size (' + size + 'px). Tiny modules may blur when printed or resized.');
  }

  let summary = 'Optimal Scan Reliability';
  if (level === 'danger') {
    summary = 'Severe Scan Readability Risk';
  } else if (level === 'warning') {
    summary = 'Moderate Scan Readability Risk';
  } else if (level === 'acceptable') {
    summary = 'Acceptable Scan Reliability';
  }

  return {
    ratio,
    level,
    isInverted,
    warnings,
    summary,
  };
}
