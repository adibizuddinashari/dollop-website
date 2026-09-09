// ─── DOLLOP FLAVOURS ────────────────────────────────────────────────────────
// All 4 flavours are available:true with real pricing (70g cup / 380g pint —
// Musang King RM12/RM70, the other 3 RM10/RM50).

const FLAVOURS = {

  'musang-king': {
    slug:         'musang-king',
    name:         'Musang King',
    fullName:     'Musang King Gelato',
    tagline:      'Bold, creamy, unmistakably Musang King — the real thing.',
    desc:         'Made in small batches using real Musang King durian pulp. No shortcuts, no filler, just the honest intensity of the King of Fruits. Lightly sweet and intensely durian-forward — alive with the legendary stink that true believers live for.',
    badge:        'Most Popular',
    available:    true,
    hasSweetness: true,
    sizeCup:      '70g',
    sizePint:     '380g',
    hasNutrition: true,
    hasImages:    true,
    cardImage:    'assets/images/Musang%20King.png',
    productImage: 'images/Dollop_cup_durian.png',
    cupImage:     'images/Dollop_cup_durian.png',
    pintImage:    'images/Dollop_pint_durian.png',
    cardBg:       'radial-gradient(ellipse at 40% 30%,#8FBF3A 0%,#4A7C24 40%,#2D5016 75%,#1A3A0A 100%)',
    priceCup:     15,
    pricePint:    70,
    stats: [
      { num: '133', unit: 'kcal per serving', label: 'Energy' },
      { num: '100%', unit: 'Musang King',     label: 'Real Durian' },
      { num: 'Zero', unit: '',                label: 'Preservatives' }
    ],
    features: [
      '100% Real Musang King',
      'No Artificial Flavours',
      'Freshly Made',
      'Small Batch',
      'Premium Grade D197'
    ],
    sweetness: {
      regular: { label: 'Regular Sweet', sugar: '16g', imgClass: '' },
      less:    { label: 'Less Sweet',    sugar: '9g',  imgClass: 'less-bg' }
    }
  },

  'cempedak': {
    slug:         'cempedak',
    name:         'Cempedak',
    fullName:     'Cempedak Gelato',
    tagline:      'Tropical. Fragrant. Wildly addictive.',
    desc:         'Cempedak is the unsung hero of Malaysian tropical fruits — sweeter than jackfruit, more fragrant than mango, with a custard-like richness that most people never discover. We turned it into gelato. Real Cempedak pulp, no flavouring, no shortcuts. This is Malaysia in a cup.',
    badge:        'New',
    available:    true,
    hasSweetness: false,
    sizeCup:      '70g',
    sizePint:     '380g',
    hasNutrition: false,
    hasImages:    true,
    cardImage:    'assets/images/Cempedak.png',
    productImage: 'images/Dollop_cup_cempedak.png',
    cupImage:     'images/Dollop_cup_cempedak.png',
    pintImage:    'images/Dollop_pint_cempedak.png',
    cardBg:       'radial-gradient(ellipse at 40% 30%,#E8A84A 0%,#C17B2A 40%,#8B5416 75%,#4A2C08 100%)',
    priceCup:     10,
    pricePint:    50,
    stats: [
      { num: '141', unit: 'kcal per serving', label: 'Energy' },
      { num: '100%', unit: 'Cempedak',        label: 'Real Fruit' },
      { num: 'Zero', unit: '',                label: 'Preservatives' }
    ],
    features: [
      '100% Real Cempedak',
      'No Artificial Flavours',
      'Freshly Made',
      'Small Batch',
      'Seasonal Malaysian Fruit'
    ],
    sweetness: null
  },

  // Now live — matches production flavours.js/staging draft copy.
  'soya-gula-melaka': {
    slug:         'soya-gula-melaka',
    name:         'Soya Gula Melaka',
    fullName:     'Soya Gula Melaka Gelato',
    tagline:      'Creamy soya, rich with real gula Melaka.',
    desc:         'A nostalgic Malaysian pairing turned into gelato — silky soya milk swirled with real gula Melaka for that deep caramel warmth in every scoop. Simple, comforting, unmistakably local.',
    badge:        'New',
    available:    true,
    hasSweetness: false,
    sizeCup:      '70g',
    sizePint:     '380g',
    hasNutrition: false,
    hasImages:    true,
    cardImage:    'assets/images/Soya%20With%20Gula%20Melaka.png',
    productImage: 'images/Dollop_cup_Soya w Gula Melaka.png',
    cupImage:     'images/Dollop_cup_Soya w Gula Melaka.png',
    pintImage:    'images/Dollop_pint_Soya w Gula Melaka.png',
    cardBg:       'radial-gradient(ellipse at 40% 30%,#D9B36B 0%,#A67C3D 40%,#6B4A1F 75%,#3B2A10 100%)',
    priceCup:     10,
    pricePint:    50,
    stats: [],
    features: [
      'Real Gula Melaka',
      'Creamy Soya Base',
      'No Artificial Flavours',
      'Freshly Made',
      'Small Batch'
    ],
    sweetness: null
  },

  // Now live — matches production flavours.js/staging draft copy.
  'pandan-coconut': {
    slug:         'pandan-coconut',
    name:         'Pandan Coconut',
    fullName:     'Pandan Coconut Gelato',
    tagline:      'Fragrant pandan, rich coconut, pure comfort.',
    desc:         "Two of Malaysia's most beloved flavours in one scoop — fragrant pandan leaf and rich coconut milk, creamy and lightly sweet. A tropical classic, reimagined as gelato.",
    badge:        'New',
    available:    true,
    hasSweetness: false,
    sizeCup:      '70g',
    sizePint:     '380g',
    hasNutrition: false,
    hasImages:    true,
    cardImage:    'assets/images/Pandan%20Coconut.png',
    productImage: 'images/Dollop_cup_Pandan Coconut.png',
    cupImage:     'images/Dollop_cup_Pandan Coconut.png',
    pintImage:    'images/Dollop_pint_Pandan Coconut.png',
    cardBg:       'radial-gradient(ellipse at 40% 30%,#A8D4A0 0%,#6FA85E 40%,#3D6B2F 75%,#1F3A16 100%)',
    priceCup:     10,
    pricePint:    50,
    stats: [],
    features: [
      'Real Pandan & Coconut',
      'No Artificial Flavours',
      'Freshly Made',
      'Small Batch',
      'Tropical Malaysian Classic'
    ],
    sweetness: null
  }

};

// All 4 flavours, in display order for the homepage flavour-tease grid.
const FEATURED_FLAVOURS = ['musang-king', 'cempedak', 'soya-gula-melaka', 'pandan-coconut'];

// Slugs of the built-in flavours above — a remote product is never allowed to
// overwrite one of these.
const CORE_FLAVOUR_SLUGS = FEATURED_FLAVOURS.slice();

// ─── Combo deals ──────────────────────────────────────────────────────────
// shop.html renders up to 2 combo deals from cfg.COMBOS (managed in admin.html).
// When cfg has no COMBOS key at all (never saved), the shop falls back to this
// so the Merdeka Combo keeps showing until an admin takes it over. An explicit
// empty array from the admin means "no combos" and hides the section.
const COMBO_MAX = 2;
const DEFAULT_COMBOS = [{
  slug:      'merdeka-combo',
  active:    true,
  badge:     '🇲🇾 Merdeka Special',
  title:     'The Merdeka Combo',
  desc:      'Four proudly Malaysian flavours, one combo — buy all 4, get a 5th free. One of Musang King, Cempedak, Soya Gula Melaka & Pandan Coconut, plus a free extra random flavour on us.',
  pills:     ['Musang King', 'Cempedak', 'Soya Gula Melaka', 'Pandan Coconut', '+ 1 Free Random Flavour'],
  imageUrl:  '',   // empty → shop.js uses the bundled brand asset
  cupPrice:  45,
  cupNote:   '5 × 70g cups · Buy 4 Get 1 Free',
  pintPrice: 220,
  pintNote:  '5 × 380g pints · Buy 4 Get 1 Free'
}];

// Desktop column count for the flavour grid, chosen so the last row is never a
// single stranded card once admin-added products grow the grid past 4. The
// renderers put the result on the grid's data-cols attribute; redesign.css
// only acts on it above 1025px (tablet/mobile keep their own 2-up / 1-up).
//   4 → default        5 → 3+2        6 → 3+3        7 → 4+3        9 → 3+3+3
function flvGridCols(n) {
  if (n <= 4) return 4;
  if (n === 5 || n === 6) return 3;
  if (n % 4 === 1) return (n % 3 === 1) ? 5 : 3;  // a plain 4-up row would strand one card
  return 4;
}

// ─── Admin-managed flavour config ─────────────────────────────────────────
// The admin panel (admin.html) drives the whole flavour line-up through four
// keys in the site-config blob it saves to the Apps Script:
//
//   PRODUCTS          — array of admin-created products (full record each)
//   FLAVOUR_OVERRIDES — { slug: { field: value } } edits layered onto ANY
//                       flavour, including the 4 built-ins
//   FLAVOUR_ORDER     — array of slugs giving the display order of everything
//   FLAVOUR_HIDDEN    — array of slugs to drop from the grids / switcher
//
// mergeRemoteProducts(cfg) rebuilds FLAVOURS + FEATURED_FLAVOURS from the
// pristine built-in base plus those four keys, so nothing here is destructive
// and every call is idempotent. Consumers (redesign.js / shop.js / product.js)
// call it once their remote config resolves, then re-render. Returns true only
// when the result actually changed, so a default config is a no-op.
//
// A hidden flavour still exists in FLAVOURS (its product.html?flavour=<slug>
// page keeps working via a direct link) — it's just absent from the grids.
// Fields the admin panel may override on any flavour. `available` and
// `imageUrl` are handled specially in _applyOverride().
var OVERRIDABLE_FIELDS = ['name', 'fullName', 'tagline', 'badge', 'priceCup',
  'sizeCup', 'pricePint', 'sizePint', 'cardBg', 'cardColor',
  'originalPriceCup', 'originalPricePint'];

var _BASE_FLAVOURS = JSON.parse(JSON.stringify(FLAVOURS));   // pure data — safe to clone
var _BASE_ORDER    = FEATURED_FLAVOURS.slice();
var _remoteSig     = JSON.stringify([[], {}, [], []]);        // baseline = untouched config

function _makeCustomFlavour(p) {
  var img = (typeof toDriveDirectUrl === 'function')
    ? toDriveDirectUrl(p.imageUrl || '')
    : (p.imageUrl || '');
  return {
    slug:         p.slug,
    name:         p.name,
    fullName:     p.fullName || (p.name + ' Gelato'),
    tagline:      p.tagline || '',
    desc:         p.desc || '',
    badge:        p.badge || 'New',
    available:    p.available !== false,
    hasSweetness: false,
    sizeCup:      p.sizeCup || '70g',
    sizePint:     p.sizePint || '380g',
    hasNutrition: false,
    hasImages:    !!img,
    cardImage:    img,
    productImage: img,
    cupImage:     img,
    pintImage:    img,
    cardBg:       p.cardBg || 'radial-gradient(ellipse at 40% 30%,#C9A96A 0%,#93753F 40%,#5B4826 75%,#2D2413 100%)',
    priceCup:     Number(p.priceCup) || 0,
    pricePint:    Number(p.pricePint) || 0,
    stats:        [],
    features:     Array.isArray(p.features) ? p.features : [],
    sweetness:    null,
    _remote:      true
  };
}

function _applyOverride(f, o) {
  // The admin panel already diffs against the coded defaults, so any key
  // present here is a deliberate change — apply it even if it's an empty
  // string (e.g. clearing a badge).
  OVERRIDABLE_FIELDS.forEach(function (k) {
    if (Object.prototype.hasOwnProperty.call(o, k) && o[k] !== undefined && o[k] !== null) f[k] = o[k];
  });
  if (o.available !== undefined) f.available = o.available !== false;
  // Image override only when a link was actually supplied — otherwise the
  // built-in artwork path stays untouched.
  if (o.imageUrl) {
    var img = (typeof toDriveDirectUrl === 'function') ? toDriveDirectUrl(o.imageUrl) : o.imageUrl;
    f.imageUrl = o.imageUrl;
    f.cardImage = f.productImage = f.cupImage = f.pintImage = img;
    f.hasImages = !!img;
  }
}

function mergeRemoteProducts(cfg) {
  cfg = cfg || {};
  var products  = Array.isArray(cfg.PRODUCTS) ? cfg.PRODUCTS : [];
  var overrides = (cfg.FLAVOUR_OVERRIDES && typeof cfg.FLAVOUR_OVERRIDES === 'object') ? cfg.FLAVOUR_OVERRIDES : {};
  var orderCfg  = Array.isArray(cfg.FLAVOUR_ORDER) ? cfg.FLAVOUR_ORDER : [];
  var hidden    = Array.isArray(cfg.FLAVOUR_HIDDEN) ? cfg.FLAVOUR_HIDDEN : [];

  var sig = JSON.stringify([products, overrides, orderCfg, hidden]);
  if (sig === _remoteSig) return false;
  _remoteSig = sig;

  // 1. Reset FLAVOURS to the pristine built-in base.
  Object.keys(FLAVOURS).forEach(function (k) { delete FLAVOURS[k]; });
  Object.keys(_BASE_FLAVOURS).forEach(function (k) {
    FLAVOURS[k] = JSON.parse(JSON.stringify(_BASE_FLAVOURS[k]));
  });

  // 2. Add admin-created products (never clobbering a built-in slug).
  products.forEach(function (p) {
    if (!p || !p.slug || !p.name) return;
    if (_BASE_FLAVOURS[p.slug]) return;
    FLAVOURS[p.slug] = _makeCustomFlavour(p);
  });

  // 3. Layer per-flavour overrides onto whatever now exists.
  Object.keys(overrides).forEach(function (slug) {
    if (FLAVOURS[slug] && overrides[slug] && typeof overrides[slug] === 'object') {
      _applyOverride(FLAVOURS[slug], overrides[slug]);
    }
  });

  // 4. Build display order: configured order first (valid slugs only), then
  //    any known flavour not yet listed (base flavours in their original
  //    order, then leftover custom ones).
  var seen = {}, order = [];
  orderCfg.forEach(function (s) {
    if (FLAVOURS[s] && !seen[s]) { seen[s] = 1; order.push(s); }
  });
  _BASE_ORDER.concat(Object.keys(FLAVOURS)).forEach(function (s) {
    if (FLAVOURS[s] && !seen[s]) { seen[s] = 1; order.push(s); }
  });

  // 5. Drop hidden slugs, then write FEATURED_FLAVOURS in place.
  order = order.filter(function (s) { return hidden.indexOf(s) === -1; });
  FEATURED_FLAVOURS.length = 0;
  order.forEach(function (s) { FEATURED_FLAVOURS.push(s); });

  return true;
}
