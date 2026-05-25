// ─── DOLLOP SITE CONFIG ────────────────────────────────────────────────────
// This file holds fallback defaults used if the remote config cannot be loaded.
// Edit PRICE/ORIGINAL_PRICE here as a fallback when the admin panel cannot reach the backend.

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwYbmE2awZ4NJXnflppZw4jSoWN3DxNKXZB5RkFBPUNGNALS2gtJQ2Bxfp0iGv9-VTB6Q/exec';
const COMPANY_WHATSAPP = '60142676333';

const DEFAULT_CONFIG = {
  ORIGINAL_PRICE:         0,   // strikethrough price (0 = hide strikethrough)
  PRICE:                  18,  // current selling price
  SOLD_OUT:               false,   // true = disable ordering, show "Sold Out"
  MAX_QTY:                24,     // maximum cups per order
};

// Applied once config is fetched (or falls back to DEFAULT_CONFIG)
window.SITE_CFG = Object.assign({}, DEFAULT_CONFIG);

function toDriveDirectUrl(url) {
  if (!url) return '';
  var m = url.match(/\/file\/d\/([^/?]+)/);
  return m ? 'https://drive.google.com/uc?export=view&id=' + m[1] : url;
}
