import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';

/**
 * Custom hook to generate QR codes safely and responsively.
 * Handles:
 * - Asynchronous race conditions (discarding superseded requests)
 * - Error handling for capacity overflow
 * - Debouncing rapid keyboard events
 * - Output format generation for preview and export
 *
 * @param {Object} params
 * @param {string} params.payload - Formatted QR string
 * @param {boolean} params.isValid - Whether input passed validation
 * @param {string} params.fgColor - Hex foreground color
 * @param {string} params.bgColor - Hex background color
 * @param {number} params.margin - Margin modules (0 - 8)
 * @param {'L'|'M'|'Q'|'H'} params.ecc - Error correction level
 * @param {number} params.size - Target pixel size (e.g. 512)
 * @param {number} [params.debounceMs=100] - Debounce delay in ms
 */
export function useQRCode({
  payload,
  isValid,
  fgColor = '#000000',
  bgColor = '#ffffff',
  margin = 3,
  ecc = 'M',
  size = 512,
  debounceMs = 120,
}) {
  const [dataUrl, setDataUrl] = useState('');
  const [svgString, setSvgString] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [byteSize, setByteSize] = useState(0);

  // Counter to discard out-of-order async resolutions
  const requestTokenRef = useRef(0);

  useEffect(() => {
    // If invalid or empty, clear QR and error immediately
    if (!isValid || !payload || !payload.trim()) {
      setDataUrl('');
      setSvgString('');
      setIsLoading(false);
      setGenerationError(null);
      setByteSize(0);
      return;
    }

    const currentToken = ++requestTokenRef.current;
    setIsLoading(true);
    setGenerationError(null);

    const encoder = new TextEncoder();
    setByteSize(encoder.encode(payload).length);

    const timer = setTimeout(async () => {
      try {
        const options = {
          errorCorrectionLevel: ecc,
          margin: Number(margin),
          width: Number(size),
          color: {
            dark: fgColor,
            light: bgColor,
          },
        };

        // Generate data URL for high-res preview and PNG download
        const generatedDataUrl = await QRCode.toDataURL(payload, options);

        // Also generate SVG for sharp vector scaling in preview if desired
        const generatedSvg = await QRCode.toString(payload, {
          ...options,
          type: 'svg',
        });

        // Only commit if this request is still the newest one
        if (currentToken === requestTokenRef.current) {
          setDataUrl(generatedDataUrl);
          setSvgString(generatedSvg);
          setIsLoading(false);
          setGenerationError(null);
        }
      } catch (err) {
        if (currentToken === requestTokenRef.current) {
          setDataUrl('');
          setSvgString('');
          setIsLoading(false);
          const msg = err && err.message ? err.message : 'QR Generation failed.';
          if (msg.includes('amount of data') || msg.includes('too big') || msg.includes('overflow')) {
            setGenerationError('Content exceeds QR capacity for the selected Error Correction level. Try reducing text or choosing Low (L) error correction.');
          } else {
            setGenerationError(`Generation error: ${msg}`);
          }
        }
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [payload, isValid, fgColor, bgColor, margin, ecc, size, debounceMs]);

  return {
    dataUrl,
    svgString,
    isLoading,
    generationError,
    byteSize,
  };
}
