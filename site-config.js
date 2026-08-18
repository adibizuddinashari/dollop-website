// ─── DOLLOP SITE CONFIG ────────────────────────────────────────────────────
// This file holds fallback defaults used if the remote config cannot be loaded.
// Edit these values as a fallback when the admin panel cannot reach the backend.

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwYbmE2awZ4NJXnflppZw4jSoWN3DxNKXZB5RkFBPUNGNALS2gtJQ2Bxfp0iGv9-VTB6Q/exec';
const COMPANY_WHATSAPP = '60142676333';

const DEFAULT_CONFIG = {
  ORIGINAL_PRICE:         0,       // strikethrough price (0 = hide strikethrough)
  PRICE:                  12,      // current selling price (Musang King, 70g cup)
  SOLD_OUT:               false,   // true = disable ordering, show "Sold Out"
  MAX_QTY:                24,      // maximum cups per order
  PROMO_ACTIVE:           false,   // true = show "Buy X Get Y Free" badge
  PROMO_THRESHOLD:        5,       // cups needed to trigger free cups
  PROMO_FREE:             1,       // number of free cups given
  ANNOUNCEMENT_ACTIVE:    false,   // true = show popup announcement on homepage
  ANNOUNCEMENT_IMAGE_URL: '',      // Google Drive share link for popup image
  ANNOUNCEMENT_LINK:      'https://www.dollopgelato.com/shop.html', // where clicking the popup goes
};

// Applied once config is fetched (or falls back to DEFAULT_CONFIG)
window.SITE_CFG = Object.assign({}, DEFAULT_CONFIG);

function toDriveDirectUrl(url) {
  if (!url) return '';
  url = url.trim();
  // Already a direct/thumbnail link — leave it as-is.
  if (/drive\.google\.com\/(uc|thumbnail)/.test(url)) return url;
  // Common share-link shapes:
  //   https://drive.google.com/file/d/<ID>/view?usp=sharing
  //   https://drive.google.com/open?id=<ID>
  //   https://drive.google.com/uc?id=<ID>
  //   https://drive.google.com/thumbnail?id=<ID>
  var m = url.match(/\/file\/d\/([^/?]+)/) || url.match(/[?&]id=([^&]+)/);
  if (!m) return url; // not a recognizable Drive link — return unchanged
  // Use the thumbnail endpoint: more reliable for hotlinking in <img> tags
  // than uc?export=view, which often serves an HTML interstitial instead
  // of raw image bytes for files that aren't shared "Anyone with the link".
  return 'https://drive.google.com/thumbnail?id=' + m[1] + '&sz=w1000';
}
