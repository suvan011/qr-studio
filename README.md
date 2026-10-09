# QR Studio

> **Production-Quality QR Code Generator & Designer**  
> Developed for **Google Developer Groups (GDG) on Campus — SRM Institute of Science and Technology**  
> Technical Recruitment 2026–2027

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF.svg)](https://vitejs.dev/)
[![Tests](https://img.shields.io/badge/Tests-25%20Passed-10b981.svg)](https://vitest.dev/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#license)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Client--Side-emerald.svg)](#privacy-guarantee)

---

## 1. Overview

**QR Studio** is a browser-based QR code creation and styling suite built to bridge design aesthetics with production engineering standards. Designed like a modern developer tool, QR Studio generates high-resolution, standards-compliant QR codes in real time with **zero backend dependencies, zero telemetry, and zero latency**.

Every configuration change—color palettes, dimensions, margins, and error correction—synchronizes immediately with an interactive canvas preview and can be exported as a lossless, publication-ready PNG.

---

## 2. Key Features

- **5 Content Protocols**:
  - **Website URL**: Automatic HTTPS normalization, domain validation, and malicious protocol rejection (`javascript:`, `data:`).
  - **Plain Text & Markdown**: Unicode, multiline notes, emoji encoding, and real-time UTF-8 byte counter.
  - **Email (Draft)**: RFC 5322 address validation with percent-encoded `mailto:` subject and message body.
  - **Telephone (`tel:`)**: International E.123 format validation preserving leading `+` country codes.
  - **Wi-Fi Network**: Full ZXing MECARD protocol supporting WPA/WPA2/WPA3, WEP, and Open networks, with password visibility toggling, hidden SSID support, and strict character escaping.
- **Real-Time Visual Customization**:
  - Foreground (matrix dots) and Background color pickers with real-time HEX input.
  - 5 Curated presets (*Classic Slate, Deep Ocean, Forest Mist, Royal Violet, Cyber Mint*) with custom-state detection.
  - Output dimension scaling slider from **256 × 256 px** up to **2048 × 2048 px (Ultra HD)**.
  - Quiet zone (margin) control (0 to 8 modules).
  - Reed-Solomon Error Correction Level selector (L ~7%, M ~15%, Q ~25%, H ~30%).
- **Scanning Reliability & Contrast Engine**:
  - Computes real-time WCAG relative luminance and color contrast ratio.
  - Heuristic warnings for low contrast (<4:1), inverted schemes (light on dark), zero quiet zones, and high-density payloads.
- **Export & Clipboard Integration**:
  - One-click lossless **PNG download** derived directly from live raster configuration with descriptive timestamped filenames.
  - One-click **Copy Payload** string to system clipboard.
  - One-click **Copy PNG Image** directly into clipboard (via modern `ClipboardItem` API).
- **Persistent Local History**:
  - Stores up to 8 recent creations in browser `localStorage`.
  - Restores full form data and styling preferences on click.
  - Automatic deduplication and single-item removal / clear-all confirmation.
  - **Security policy**: Wi-Fi passwords are intentionally stripped before persistence.
- **Theme & Accessibility**:
  - Dark Navy & Graphite palette with Electric Blue and Mint accents.
  - Light theme toggle with automatic OS preference detection and persistence.
  - Fully responsive from **320px mobile viewports up to 1440px+ ultra-wide monitors**.
  - Visible focus indicators, ARIA attributes, semantic HTML, and `prefers-reduced-motion` compliance.

---

## 3. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | React 18 (`18.3.1`) | Component architecture, custom hooks, and reactive UI state |
| **Bundler & Tooling** | Vite 6 (`6.1.0`) | Ultra-fast HMR and optimized production build bundling |
| **QR Generation Engine** | `qrcode` (`1.5.4`) | In-browser canvas rasterization and SVG generation |
| **Iconography** | `lucide-react` (`0.475.0`) | Clean, accessible vector icons |
| **Styling** | Modern CSS Variables & Tokens | Dark navy / graphite palette, fluid grid, and zero external CSS bloat |
| **Unit Testing** | Vitest (`2.1.8`) | Unit testing for payload builders, validators, and contrast algorithms |
| **Storage** | Browser `localStorage` | Client-side recent creations and user theme preferences |

---

## 4. Architecture & Project Structure

```
gdg/
├── public/
│   └── favicon.svg             # Geometric QR Studio SVG favicon
├── src/
│   ├── components/
│   │   ├── forms/
│   │   │   ├── UrlForm.jsx     # Website URL input & validation
│   │   │   ├── TextForm.jsx    # Plain text & multiline byte counter
│   │   │   ├── EmailForm.jsx   # Email, subject & body fields
│   │   │   ├── PhoneForm.jsx   # Telephone input & international format
│   │   │   └── WifiForm.jsx    # Wi-Fi SSID, password toggle & security
│   │   ├── AboutModal.jsx      # Architecture & GDG recruitment specs modal
│   │   ├── ActionButtons.jsx   # PNG export, copy payload & copy image
│   │   ├── ContentForm.jsx     # Master content tabs & switchboard
│   │   ├── Customizer.jsx      # Presets, color pickers, dimensions & ECC
│   │   ├── Footer.jsx          # Attribution and security status
│   │   ├── Header.jsx          # Wordmark, privacy badge, theme toggle & info
│   │   ├── Hero.jsx            # Product hero banner & feature pills
│   │   ├── HistoryList.jsx     # Recent creations list & restore controls
│   │   ├── PreviewCard.jsx     # Live canvas preview & contrast advisor
│   │   └── Toast.jsx           # Accessible toast notification system
│   ├── hooks/
│   │   ├── useQRCode.js        # Debounced, race-condition safe QR generator
│   │   └── useTheme.js         # Dark/Light theme manager with storage sync
│   ├── test/
│   │   └── qrStudio.test.js    # Vitest automated test suite (25 tests)
│   ├── utils/
│   │   ├── contrast.js         # WCAG relative luminance & contrast heuristics
│   │   ├── qrPayload.js        # RFC 3986 & ZXing Wi-Fi payload builders
│   │   ├── storage.js          # Safe localStorage manager with sanitization
│   │   └── validation.js       # Field-level validators and sanitizers
│   ├── App.jsx                 # Main application state orchestration
│   ├── index.css               # Design tokens, responsive grid & animations
│   └── main.jsx                # Application root mount
├── index.html                  # HTML entry point with meta tags & preconnect fonts
├── package.json                # Project dependencies and script commands
├── vite.config.js              # Vite and Vitest configuration
└── README.md                   # Technical documentation and evaluation guide
```

---

## 5. Supported QR Formats & Specifications

### 1. Website URL
- **Format**: `https://<domain>/<path>`
- **Normalization**: User inputs such as `github.com` automatically receive `https://` prefix.
- **Safety**: Inputs starting with `javascript:`, `data:`, or unsupported protocols are rejected with field-level alerts.

### 2. Plain Text
- **Format**: Raw UTF-8 string.
- **Capabilities**: Supports ASCII, multiline text, symbols, and Unicode/emojis.
- **Safety**: A dynamic byte-counter warns if payload exceeds standard 2,000-byte QR capacity limits.

### 3. Email Draft
- **Format**: `mailto:<address>?subject=<encoded_subject>&body=<encoded_body>`
- **Compliance**: Adheres to RFC 5322 address syntax and RFC 3986 URI component percent-encoding (`encodeURIComponent`), properly handling spaces, punctuation, and line breaks.

### 4. Telephone
- **Format**: `tel:<normalized_digits>`
- **Compliance**: Preserves leading `+` for international dialing codes while stripping dashes, spaces, and brackets.

### 5. Wi-Fi Configuration
- **Format**: `WIFI:S:<SSID>;T:<SECURITY>;P:<PASSWORD>;H:<HIDDEN>;;`
- **Escaping Engine**: Compliant with ZXing MECARD standard. Special characters:
  ```
  \ (backslash)  -> \\
  ; (semicolon)  -> \;
  , (comma)      -> \,
  : (colon)      -> \:
  " (quote)      -> \"
  ```
- **Open Networks**: When `nopass` is selected, the `P:` password parameter is omitted entirely.

---

## 6. Contrast & Scanning Reliability Decisions

Camera sensors and barcode scanners require sufficient contrast and edge demarcation to decode 2D matrix patterns:

1. **Relative Luminance Calculation**:
   Calculates color luminance according to WCAG 2.1 formulas:
   $$L = 0.2126 \cdot R_{lin} + 0.7152 \cdot G_{lin} + 0.0722 \cdot B_{lin}$$
   $$\text{Contrast Ratio} = \frac{L_{brightest} + 0.05}{L_{darkest} + 0.05}$$

2. **Heuristic Levels**:
   - **$\ge 7.0:1$ (Optimal)**: Clean, rapid scanning across virtually all smartphone sensors.
   - **$4.0:1 - 6.9:1$ (Acceptable)**: Standard readability under normal lighting.
   - **$2.5:1 - 3.9:1$ (Moderate Risk)**: Advisory alert warns of potential scanner difficulty.
   - **$< 2.5:1$ (Severe Risk)**: Critical low-contrast warning.

3. **Quiet Zone (Margin)**:
   A quiet zone of at least 2–4 modules is recommended. If a user sets the margin to `0`, QR Studio issues an advisory warning that cameras without edge contrast may fail to locate finder patterns.

4. **Inverted Scheme Advisory**:
   While modern iOS and Android cameras read light-on-dark QR codes, legacy dedicated hardware scanners often require dark codes on light backgrounds. QR Studio flags inverted schemes to ensure users are informed prior to printing.

---

## 7. Privacy & Local Storage Architecture

- **100% Client-Side Execution**: All QR matrix math, canvas rasterization, and PNG blobs are generated in-memory inside the browser tab.
- **No Backend Telemetry**: Zero requests are made to third-party QR generation APIs.
- **Wi-Fi Credential Sanitization**:
  When saving creations to recent history, Wi-Fi passwords are **automatically stripped** (`password: ''`, `wifiPasswordOmitted: true`). Only the network SSID and security type are retained.
- **Storage Fault-Tolerance**:
  The storage utility defends against:
  - Private browsing storage blocks (`quotaExceeded`).
  - Corrupted or invalid JSON data in `localStorage`.
  - In all failure scenarios, the application degrades gracefully to in-memory state without crashing.

---

## 8. Verification & Test Suite

QR Studio includes automated unit tests implemented with **Vitest**:

```bash
npm run test
```

### Actual Test Results
```text
 ✓ src/test/qrStudio.test.js (25 tests) 82ms

 Test Files  1 passed (1)
      Tests  25 passed (25)
   Duration  5.75s
```

#### Test Coverage Summary:
1. **URL Normalization**: Verified with and without `https://`, tested malformed protocols and dangerous schemes.
2. **Email Encoding**: Verified `mailto:` URI construction with special characters, spaces, and multiline body text.
3. **Phone Formatting**: Verified `tel:` payload generation and international `+` preservation.
4. **Wi-Fi Escaping**: Verified ZXing character escaping for `\`, `;`, `,`, `:`, and `"`.
5. **Wi-Fi Types**: Verified WPA, WEP, Open (omitting password), and hidden SSID flags.
6. **Validation Engine**: Tested edge cases for URL, Text, Email, Phone, and Wi-Fi forms.
7. **Contrast Heuristics**: Tested luminance calculation, 21:1 black/white ratio, inverted scheme detection, and quiet zone warnings.
8. **Persistence & Privacy**: Tested Wi-Fi password stripping on save, corrupted JSON recovery, and deletion.
9. **QR Generation Engine**: Verified high-resolution PNG data URL creation and oversized payload capacity handling.

---

## 9. Local Setup & Execution Instructions

### Prerequisites
- **Node.js**: v18.0.0 or later (Tested on Node v24.19.0)
- **npm**: v9.0.0 or later (Tested on npm 11.17.0)

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone <your-repo-url>
cd gdg
npm install
```

### 2. Development Server
Start the local Vite development server:
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Automated Tests
Run the test suite:
```bash
npm run test
```

### 4. Production Build
Compile and bundle the production release:
```bash
npm run build
```
Production assets will be output to the `dist/` directory.

### 5. Production Preview
Test the production build locally:
```bash
npm run preview
```
Open your browser at `http://localhost:4173`.

---

## 10. Deployment Instructions

### Deploy to Vercel
1. Push your repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **Deploy**.

### Deploy to Netlify
1. Log in to [Netlify](https://netlify.com) and click **"Add new site" > "Import an existing project"**.
2. Select your repository.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click **Deploy site**.

---

## 11. Known Limitations

- **Clipboard Image Copying**: The "Copy PNG Image" feature utilizes the modern `navigator.clipboard.write([new ClipboardItem(...)])` API. While supported on Chrome, Edge, and Safari, some older browsers restrict programmatic image writing to the clipboard. The "Download High-Res PNG" button is universal and always works.
- **Maximum QR Capacity**: QR Code Version 40 with Low (L) error correction holds approximately 2,953 alphanumeric characters or 1,200–2,000 binary bytes. Entering oversized payloads will trigger an explanatory advisory to reduce text or lower the redundancy level.

---

## 12. Author & Attribution

- **Developer**: Suvan Gupta
- **Institution**: SRM Institute of Science and Technology
- **Organization**: Google Developer Groups (GDG) on Campus SRM
- **Recruitment Cohort**: 2026–2027 Technical Recruitment Task
