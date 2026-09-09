// ─── DOLLOP SHOP PAGE — "Create Your Own Pack" ─────────────────────────────
// Renders a flavour grid (FLAVOURS/FEATURED_FLAVOURS from flavours-draft.js)
// where each available flavour gets a size toggle + "Add to Pack" button
// that writes straight into the SAME shared cart (../cart.js, localStorage)
// used by ../index.html and ../product.html. The checkout modal below is
// ported near-verbatim from ../product.html — same steps, same
// site-config.js (Apps Script order log + SOLD_OUT flag) and the same
// WhatsApp/DuitNow QR payment handoff — so an order placed here lands in
// the exact same place an order from the live site would.

// ── Grid ─────────────────────────────────────────────────────────────────
var shopSelection = {}; // slug -> { sizeKey, sizeLabel, price }

function renderShopGrid() {
  var grid = document.getElementById('shopGrid');
  if (!grid || typeof FEATURED_FLAVOURS === 'undefined') return;

  var slugs = FEATURED_FLAVOURS.filter(function (s) { return FLAVOURS[s]; });
  if (typeof flvGridCols === 'function') grid.dataset.cols = flvGridCols(slugs.length);

  grid.innerHTML = slugs.map(function (slug) {
    var f = FLAVOURS[slug];
    if (!f) return '';
    var isSoon = !f.available;

    if (!isSoon) {
      var cupSz = f.sizeCup || '80g';
      shopSelection[slug] = { sizeKey: cupSz, sizeLabel: cupSz + ' Cup', price: f.priceCup };
    }

    // Cup image shows by default (matches the Cup size button being active
    // by default below); selectShopSize() swaps this to the pint photo
    // when the shopper picks the pint size instead.
    var imgHtml = (f.cupImage || f.cardImage)
      ? '<img src="' + (f.cupImage || f.cardImage) + '" alt="' + f.fullName + '" loading="lazy" class="flv-card-photo">'
      : '<div class="flv-card-wordmark">' + f.name + '</div>';

    var szHtml = '';
    if (!isSoon) {
      var cupSize  = f.sizeCup  || '80g';
      var pintSize = f.sizePint || '410g';
      szHtml = '<div class="shop-sz-row">'
        + '<button class="shop-sz active" data-slug="' + slug + '" data-sizetype="cup" data-size="' + cupSize + '" data-label="' + cupSize + ' Cup" data-price="' + f.priceCup + '" onclick="selectShopSize(this)">' + cupSize + ' Cup · RM' + f.priceCup + '</button>'
        + '<button class="shop-sz" data-slug="' + slug + '" data-sizetype="pint" data-size="' + pintSize + '" data-label="' + pintSize + ' Pint" data-price="' + f.pricePint + '" onclick="selectShopSize(this)">' + pintSize + ' Pint · RM' + f.pricePint + '</button>'
        + '</div>';
    }

    // Quick-add icon (cart+plus) sits over the card image instead of a
    // text "Add to Pack" button in the card body; still reads the size
    // currently selected in shop-sz-row via shopSelection[slug].
    var quickAddHtml = isSoon ? '' : (
      '<button class="shop-quickadd" data-slug="' + slug + '" onclick="event.stopPropagation();addFlavourToCart(\'' + slug + '\')" aria-label="Add ' + f.name + ' to your pack">'
      + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1.4"/><circle cx="16" cy="21" r="1.4"/><path d="M1 3h2.5l2.2 12.2a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L20 8H6"/><path d="M18 0v6M15 3h6"/></svg>'
      + '</button>'
    );

    var ctaHtml = isSoon
      ? '<a class="flv-card-cta flv-card-cta--soon" href="https://www.instagram.com/dollopgelato/" target="_blank" rel="noopener">Follow for updates →</a>'
      : '';

    var badgeCls = isSoon ? 'flv-badge--soon' : (f.badge === 'New' ? 'flv-badge--new' : '');

    return '<div class="flv-card shop-card' + (isSoon ? ' flv-card--soon' : '') + '">'
      + '<div class="flv-card-img" style="background:' + f.cardBg + '">'
      +   imgHtml
      +   '<div class="flv-card-img-overlay"></div>'
      +   '<span class="flv-badge ' + badgeCls + '">' + f.badge + '</span>'
      +   quickAddHtml
      + '</div>'
      + '<div class="flv-card-body">'
      +   '<div class="flv-card-name">' + f.name + '</div>'
      +   '<div class="flv-card-tagline">' + f.tagline + '</div>'
      +   szHtml
      +   ctaHtml
      + '</div>'
      + '</div>';
  }).join('');
}
document.addEventListener('DOMContentLoaded', renderShopGrid);

function selectShopSize(btn) {
  var slug = btn.dataset.slug;
  var row = btn.parentElement;
  row.querySelectorAll('.shop-sz').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  shopSelection[slug] = { sizeKey: btn.dataset.size, sizeLabel: btn.dataset.label, price: parseFloat(btn.dataset.price) };

  var f = FLAVOURS[slug];
  var card = btn.closest('.flv-card');
  var img = card && card.querySelector('.flv-card-photo');
  if (f && img) img.src = (btn.dataset.sizetype === 'pint' ? f.pintImage : f.cupImage) || f.cardImage;
}

function addFlavourToCart(slug) {
  var f = FLAVOURS[slug];
  var sel = shopSelection[slug];
  if (!f || !sel) return;
  addToCart({
    flavourSlug: slug,
    flavourName: f.fullName,
    sizeKey: sel.sizeKey,
    sizeLabel: sel.sizeLabel,
    price: sel.price,
    qty: 1
  });
  showCartToast('Added ' + f.name + ' (' + sel.sizeLabel + ') to your pack');
  renderShopCartBar();
}

// cart.js's renderCartBadge() already keeps any .cart-badge element (incl.
// the one inside #shopCartBar) in sync on every cart change — this just
// handles the bits it doesn't know about: showing/hiding the whole bar and
// the running subtotal.
function renderShopCartBar() {
  var bar = document.getElementById('shopCartBar');
  var totalEl = document.getElementById('shopCartTotal');
  var count = cartCount();
  if (totalEl) totalEl.textContent = 'RM ' + cartTotal().toFixed(2);
  if (bar) bar.classList.toggle('show', count > 0);
}
document.addEventListener('DOMContentLoaded', renderShopCartBar);

// ── Combo deals ────────────────────────────────────────────────────────────
// Up to 2 combos from cfg.COMBOS (managed in admin.html). One combo renders as
// the image-left / details-right card. Two render as side-by-side square tiles;
// clicking one cross-fades to its full card with a "‹ Back" button that returns
// to the two tiles. Each combo has its own Cup Deal / Pint Deal price toggle.
var comboList = [];       // active combos, capped at COMBO_MAX
var comboDeal = 'cup';    // 'cup' | 'pint' for the combo currently on screen
var comboExpanded = -1;   // index into comboList when a tile is expanded, else -1
var _comboSig = '';       // set-of-combos signature, to reset the expanded view when it changes

function slugifyCombo(s) {
  return (s || 'combo').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'combo';
}
function comboImg(c) {
  return c.imageUrl ? toDriveDirectUrl(c.imageUrl) : 'brand assets/Dollop Merdeka Flavour_Web.jpg';
}
function currentCombo() {
  return comboList[comboExpanded > -1 ? comboExpanded : 0] || null;
}

function renderCombos(rawList) {
  var section = document.getElementById('merdekaCombo');
  var wrap = document.getElementById('comboWrap');
  if (!section || !wrap) return;

  comboList = (Array.isArray(rawList) ? rawList : [])
    .filter(function (c) { return c && c.active !== false && c.title; })
    .slice(0, (typeof COMBO_MAX === 'number' ? COMBO_MAX : 2));

  if (!comboList.length) { section.style.display = 'none'; wrap.innerHTML = ''; return; }
  section.style.display = '';
  comboDeal = 'cup';

  // Reset the expanded view whenever the set of combos changes (e.g. the
  // localStorage cache and the server payload differ on first load).
  var sig = JSON.stringify(comboList.map(function (c) { return (c.slug || c.title) + '|' + c.active; }));
  if (sig !== _comboSig) { _comboSig = sig; comboExpanded = -1; }
  if (comboExpanded >= comboList.length) comboExpanded = -1;

  if (comboList.length === 1) {
    comboExpanded = -1;
    wrap.innerHTML = comboCardHtml(comboList[0]);
  } else if (comboExpanded > -1) {
    wrap.innerHTML =
      '<div class="combo-back-wrap"><button class="combo-back" onclick="collapseCombo()">‹ Back to deals</button></div>'
      + comboCardHtml(comboList[comboExpanded]);
  } else {
    wrap.innerHTML = '<div class="combo-dual">' + comboList.map(function (c, i) {
      return '<button type="button" class="combo-tile" onclick="expandCombo(' + i + ')" aria-label="' + (c.title || 'Combo deal') + '">'
        + '<img src="' + comboImg(c) + '" alt="' + (c.title || 'Combo deal') + '">'
        + '</button>';
    }).join('') + '</div>';
  }

  // Re-apply the sold-out lock to any button just injected.
  if (window.SITE_CFG && window.SITE_CFG.SOLD_OUT) {
    wrap.querySelectorAll('.combo-order-btn').forEach(function (b) { b.disabled = true; });
  }
}

function comboCardHtml(c) {
  var pills = (Array.isArray(c.pills) ? c.pills : [])
    .filter(Boolean)
    .map(function (p) { return '<span class="combo-flavour-pill">' + p + '</span>'; }).join('');
  return '<div class="combo-card">'
    + '<img class="combo-img" src="' + comboImg(c) + '" alt="' + (c.title || 'Combo deal') + '">'
    + '<div class="combo-body">'
    +   (c.badge ? '<div class="combo-badge">' + c.badge + '</div>' : '')
    +   '<div class="combo-title">' + (c.title || '') + '</div>'
    +   (c.desc ? '<p class="combo-desc">' + c.desc + '</p>' : '')
    +   (pills ? '<div class="combo-flavours">' + pills + '</div>' : '')
    +   '<div class="shop-sz-row" id="comboSzRow">'
    +     '<button class="shop-sz active" data-deal="cup" onclick="selectComboDeal(this)">Cup Deal · RM' + (Number(c.cupPrice) || 0) + '</button>'
    +     '<button class="shop-sz" data-deal="pint" onclick="selectComboDeal(this)">Pint Deal · RM' + (Number(c.pintPrice) || 0) + '</button>'
    +   '</div>'
    +   '<div class="combo-price-row">'
    +     '<span class="combo-price" id="comboPrice">RM ' + (Number(c.cupPrice) || 0) + '</span>'
    +     '<span class="combo-price-note" id="comboPriceNote">' + (c.cupNote || '') + '</span>'
    +   '</div>'
    +   '<button class="combo-order-btn" onclick="addComboToCart()">Add Combo to Order</button>'
    + '</div>'
    + '</div>';
}

function _comboFadeSwap() {
  var wrap = document.getElementById('comboWrap');
  if (!wrap) return;
  wrap.classList.add('combo-fade');
  setTimeout(function () {
    renderCombos(comboList);
    requestAnimationFrame(function () { wrap.classList.remove('combo-fade'); });
  }, 280);
}
function expandCombo(i) { comboExpanded = i; _comboFadeSwap(); }
function collapseCombo() { comboExpanded = -1; _comboFadeSwap(); }

function selectComboDeal(btn) {
  var c = currentCombo();
  if (!c) return;
  var row = document.getElementById('comboSzRow');
  if (row) row.querySelectorAll('.shop-sz').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  comboDeal = btn.dataset.deal;
  var isPint = comboDeal === 'pint';
  var priceEl = document.getElementById('comboPrice');
  var noteEl = document.getElementById('comboPriceNote');
  if (priceEl) priceEl.textContent = 'RM ' + (isPint ? (Number(c.pintPrice) || 0) : (Number(c.cupPrice) || 0));
  if (noteEl) noteEl.textContent = isPint ? (c.pintNote || '') : (c.cupNote || '');
}

function addComboToCart() {
  var c = currentCombo();
  if (!c) return;
  var isPint = comboDeal === 'pint';
  var slug = c.slug || slugifyCombo(c.title);
  var dealName = c.title + ' (' + (isPint ? 'Pint' : 'Cup') + ' Deal)';
  var note = isPint ? (c.pintNote || '') : (c.cupNote || '');
  var pills = Array.isArray(c.pills) ? c.pills.filter(Boolean).join(', ') : '';
  addToCart({
    flavourSlug: 'combo-' + slug,
    flavourName: dealName,
    sizeKey: 'combo-' + slug + (isPint ? '-pint' : '-cup'),
    sizeLabel: note + (pills ? ' — ' + pills : ''),
    price: isPint ? (Number(c.pintPrice) || 0) : (Number(c.cupPrice) || 0),
    qty: 1
  });
  showCartToast('Added ' + dealName + ' to your order');
  renderShopCartBar();
}

function showCartToast(msg) {
  var t = document.getElementById('cartToast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._hideTimer);
  t._hideTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
}

// ── Checkout modal (ported from ../product.html) ───────────────────────────
let pickupLoc = 'sa', fulfilment = 'pickup', deliveryAddr = '';
const locLabels = { sa: '1282, Jalan Bukit Kemuning, 40640 Shah Alam, Selangor' };

function renderCartStep() {
  var cart = getCart();
  var listEl = document.getElementById('cartList');
  var emptyEl = document.getElementById('cartEmpty');
  var contBtn = document.getElementById('cartContinueBtn');
  if (!listEl) return;
  if (cart.length === 0) {
    listEl.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    if (contBtn) contBtn.disabled = true;
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';
  if (contBtn) contBtn.disabled = false;
  listEl.innerHTML = cart.map(function (item, i) {
    return '<div class="cart-line">'
      + '<div class="cart-line-info"><div class="cart-line-name">' + item.flavourName + '</div><div class="cart-line-size">' + item.sizeLabel + '</div></div>'
      + '<div class="cart-line-qty"><button onclick="updateCartQty(' + i + ',-1);renderCartStep();">−</button><span>' + item.qty + '</span><button onclick="updateCartQty(' + i + ',1);renderCartStep();">+</button></div>'
      + '<div class="cart-line-price">RM ' + (item.price * item.qty).toFixed(2) + '</div>'
      + '<button class="cart-line-remove" onclick="removeFromCart(' + i + ');renderCartStep();" aria-label="Remove">✕</button>'
      + '</div>';
  }).join('') + '<div class="cart-subtotal"><span>Subtotal</span><span>RM ' + cartTotal().toFixed(2) + '</span></div>';
  renderShopCartBar();
}

function showSoldOutToast() {
  var t = document.getElementById('soldout-toast');
  if (!t) return;
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 3000);
}

// Only the SOLD_OUT flag matters on this page (shop cards read live pricing
// straight from flavours-draft.js, not the admin-editable single-product
// price used on ../product.html).
function applyConfig(cfg) {
  window.SITE_CFG = Object.assign({}, DEFAULT_CONFIG, cfg);

  // Fold any admin-added products into the flavour grid; re-render only if
  // the set actually changed.
  if (typeof mergeRemoteProducts === 'function' && mergeRemoteProducts(cfg)) {
    renderShopGrid();
  }

  // Combo deals: a non-empty cfg.COMBOS wins; empty or missing falls back to
  // the bundled default so the Merdeka combo never silently disappears. To run
  // no deals, an admin keeps a combo toggled inactive (renderCombos filters it).
  var combos = (cfg && Array.isArray(cfg.COMBOS) && cfg.COMBOS.length)
    ? cfg.COMBOS
    : (typeof DEFAULT_COMBOS !== 'undefined' ? DEFAULT_COMBOS : []);
  renderCombos(combos);

  var c = window.SITE_CFG;
  document.querySelectorAll('.shop-quickadd,.combo-order-btn').forEach(function (b) {
    b.disabled = !!c.SOLD_OUT;
  });
}

function loadAndApplyConfig() {
  var local = localStorage.getItem('dollop_config');
  if (local) { try { applyConfig(JSON.parse(local)); } catch (e) {} }
  fetch(APPS_SCRIPT_URL + '?type=config', { cache: 'no-cache' })
    .then(function (r) { return r.json(); })
    .then(function (cfg) { localStorage.setItem('dollop_config', JSON.stringify(cfg)); applyConfig(cfg); })
    .catch(function () { if (!local) applyConfig(DEFAULT_CONFIG); });
}
document.addEventListener('DOMContentLoaded', loadAndApplyConfig);

function openModal() {
  if (window.SITE_CFG && window.SITE_CFG.SOLD_OUT) { showSoldOutToast(); return; }
  renderCartStep();
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  if (typeof fbq !== 'undefined') fbq('track', 'InitiateCheckout');
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(function () {
    goStep(1);
    ['fn', 'fp', 'fe', 'fnotes'].forEach(function (id) { var el = document.getElementById(id); if (el) el.value = ''; });
    var btn = document.getElementById('confirmOrderBtn'); if (btn) { btn.disabled = false; btn.textContent = 'Confirm Order'; }
  }, 350);
}
function handleOverlayClick(e) { if (e.target === document.getElementById('modalOverlay')) closeModal(); }

function selFulfilment(type) {
  fulfilment = type;
  document.getElementById('ft-pickup').classList.toggle('active', type === 'pickup');
  document.getElementById('ft-delivery').classList.toggle('active', type === 'delivery');
  document.getElementById('pickup-fields').classList.toggle('hide', type === 'delivery');
  document.getElementById('delivery-fields').classList.toggle('show', type === 'delivery');
  pickupLoc = type === 'delivery' ? 'delivery' : 'sa';
}
function selLocation(loc) {
  pickupLoc = loc;
  document.querySelectorAll('.m-card').forEach(function (c) { c.classList.remove('selected'); });
  document.getElementById('loc-' + loc).classList.add('selected');
}

function goStep(n) {
  if (n === 2) {
    if (getCart().length === 0) { alert('Please add at least one item to your pack.'); return; }
    if (fulfilment === 'pickup' && !pickupLoc) { alert('Please select a pickup location.'); return; }
    if (fulfilment === 'delivery') {
      deliveryAddr = document.getElementById('del-addr').value.trim();
      if (!deliveryAddr) { alert('Please enter your delivery address.'); return; }
    }
    var pi = document.getElementById('step2-pickup-info');
    var di = document.getElementById('step2-delivery-info');
    if (fulfilment === 'pickup') {
      pi.style.display = 'block'; di.style.display = 'none';
      document.getElementById('locName').innerHTML = '<a href="https://www.google.com/maps/search/?api=1&query=1282+Jalan+Bukit+Kemuning+40640+Shah+Alam+Selangor" target="_blank" rel="noopener" style="color:var(--green);text-decoration:underline;font-weight:500;">1282, Jalan Bukit Kemuning, 40640 Shah Alam, Selangor ↗</a>';
    } else {
      pi.style.display = 'none'; di.style.display = 'block';
      document.getElementById('delAddrDisplay').textContent = deliveryAddr;
    }
  }
  if (n === 3) {
    var name = document.getElementById('fn').value.trim();
    var phone = document.getElementById('fp').value.trim();
    if (!name || !phone) { alert('Please fill in your name and WhatsApp number.'); return; }
    if (typeof fbq !== 'undefined') fbq('track', 'Lead');
    document.getElementById('sName').textContent = name;
    document.getElementById('sPhone').textContent = phone;
    var email = document.getElementById('fe').value.trim();
    document.getElementById('sEmail').textContent = email || '—';
    document.getElementById('sEmailRow').style.display = email ? '' : 'none';
    var cart = getCart();
    var reviewEl = document.getElementById('reviewItems');
    if (reviewEl) {
      reviewEl.innerHTML = cart.map(function (item) {
        return '<div class="or"><span>' + item.flavourName + ' — ' + item.sizeLabel + ' × ' + item.qty + '</span><span>RM ' + (item.price * item.qty).toFixed(2) + '</span></div>';
      }).join('');
    }
    var total = cartTotal().toFixed(2);
    document.getElementById('sFulfilment').textContent = fulfilment === 'delivery' ? 'Delivery' : 'Pickup';
    if (fulfilment === 'pickup') {
      document.getElementById('sLocRow').style.display = '';
      document.getElementById('sAddrRow').style.display = 'none';
      document.getElementById('sPickupFeeRow').style.display = '';
      document.getElementById('sDeliveryFeeRow').style.display = 'none';
      document.getElementById('sLoc').innerHTML = '<a href="https://www.google.com/maps/search/?api=1&query=1282+Jalan+Bukit+Kemuning+40640+Shah+Alam+Selangor" target="_blank" rel="noopener" style="color:var(--green);text-decoration:underline;font-size:0.8rem;">1282, Jalan Bukit Kemuning, 40640 Shah Alam, Selangor ↗</a>';
    } else {
      document.getElementById('sLocRow').style.display = 'none';
      document.getElementById('sAddrRow').style.display = '';
      document.getElementById('sPickupFeeRow').style.display = 'none';
      document.getElementById('sDeliveryFeeRow').style.display = '';
      document.getElementById('sAddr').textContent = deliveryAddr;
    }
    document.getElementById('st').textContent = 'RM ' + total + (fulfilment === 'delivery' ? ' + delivery fee' : '');
  }
  document.querySelectorAll('.m-step').forEach(function (s) { s.classList.remove('active'); });
  document.getElementById('step' + n).classList.add('active');
}

async function placeOrder() {
  var btn = document.getElementById('confirmOrderBtn');
  var name = document.getElementById('fn').value.trim();
  var phone = document.getElementById('fp').value.trim();
  var notes = document.getElementById('fnotes').value.trim();
  var email = document.getElementById('fe').value.trim();
  var cart = getCart();
  if (cart.length === 0) { alert('Your pack is empty.'); goStep(1); return; }
  var itemsSummary = cart.map(function (i) { return i.flavourName + ' (' + i.sizeLabel + ') x' + i.qty; }).join(', ');
  var totalQty = cart.reduce(function (s, i) { return s + i.qty; }, 0);
  var subtotal = cartTotal();
  var total = 'RM ' + subtotal.toFixed(2) + (fulfilment === 'delivery' ? ' + delivery fee' : '');
  var location = fulfilment === 'delivery' ? (deliveryAddr || '—') : (locLabels[pickupLoc] || '—');
  var orderNo = 'DLP-' + String(Math.floor(Math.random() * 90000) + 10000);
  var timestamp = new Date().toLocaleString('en-MY', { timeZone: 'Asia/Kuala_Lumpur' });
  if (!name || !phone) { alert('Please fill in your name and WhatsApp number.'); goStep(2); return; }
  btn.disabled = true;
  btn.textContent = 'Sending order...';
  var orderData = { timestamp: timestamp, orderNo: orderNo, name: name, phone: phone, email: email, flavour: itemsSummary, size: 'Mixed', qty: totalQty, fulfilment: fulfilment, location: location, total: total, notes: notes };
  var sheetPromise = (async function () {
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE') return;
    try {
      await fetch(APPS_SCRIPT_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(orderData) });
    } catch (err) { console.warn('Sheet submission failed:', err); }
  })();
  var itemLines = cart.map(function (i) { return '  • ' + i.flavourName + ' (' + i.sizeLabel + ') × ' + i.qty + ' — RM ' + (i.price * i.qty).toFixed(2); }).join('\n');
  var waMsg = [
    '🍦 *NEW DOLLOP ORDER*',
    '━━━━━━━━━━━━━━━━━━━━',
    '📋 Order No: *' + orderNo + '*',
    '👤 Name: ' + name,
    '📱 WhatsApp: ' + phone,
    email ? '📧 Email: ' + email : '',
    '',
    '🧁 Items:',
    itemLines,
    '',
    '🚚 Fulfilment: ' + (fulfilment === 'delivery' ? 'Delivery' : 'Pickup'),
    '📍 Location: ' + location,
    '💰 Total: ' + total,
    notes ? '📝 Notes: ' + notes : '',
    '',
    '⏰ ' + timestamp,
    '━━━━━━━━━━━━━━━━━━━━',
    '(Saya akan lampirkan bukti pembayaran selepas transfer.) / (I will attach my proof of payment once transferred.)'
  ].filter(Boolean).join('\n');
  await Promise.race([sheetPromise, new Promise(function (r) { setTimeout(r, 3000); })]);
  document.getElementById('orderNo').textContent = 'ORDER #' + orderNo;
  document.getElementById('confirmPhone').textContent = phone;
  btn.disabled = false;
  btn.textContent = 'Confirm Order →';
  clearCart();
  goStep(4);
  if (typeof fbq !== 'undefined') fbq('track', 'Purchase', { value: subtotal.toFixed(2), currency: 'MYR' });
  var waUrl = 'https://wa.me/' + COMPANY_WHATSAPP + '?text=' + encodeURIComponent(waMsg);
  setTimeout(function () { window.open(waUrl, '_blank'); }, 400);
}
