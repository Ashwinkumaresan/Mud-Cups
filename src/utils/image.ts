export const PLACEHOLDER_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" role="img" aria-label="Food placeholder">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1B4D3E"/>
        <stop offset="100%" stop-color="#2F7D5B"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" rx="28" fill="url(#bg)"/>
    <circle cx="300" cy="180" r="110" fill="rgba(255,255,255,0.10)"/>
    <ellipse cx="300" cy="210" rx="125" ry="88" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="10"/>
    <path d="M210 220h180" stroke="rgba(255,255,255,0.9)" stroke-width="10" stroke-linecap="round"/>
    <path d="M240 150v90M255 150v90M270 150v90M285 150v90" stroke="rgba(255,255,255,0.9)" stroke-width="8" stroke-linecap="round"/>
    <path d="M335 145c20 20 30 45 30 75 0 18-6 33-18 45" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="10" stroke-linecap="round"/>
    <path d="M360 150c30 5 50 30 50 65 0 30-20 55-50 60" fill="none" stroke="rgba(255,255,255,0.9)" stroke-width="9" stroke-linecap="round"/>
    <path d="M170 120c25-10 55-10 80 5" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="10" stroke-linecap="round"/>
    <path d="M175 150c18-8 40-8 58 2" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="10" stroke-linecap="round"/>
  </svg>
`)}`;

export const withFallbackImage = (image?: string | null): string => {
  if (typeof image !== 'string') return PLACEHOLDER_IMAGE;
  const cleanImage = image.trim();
  return cleanImage || PLACEHOLDER_IMAGE;
};
