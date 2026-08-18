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

  grid.innerHTML = FEATURED_FLAVOURS.map(function (slug) {
    var f = FLAVOURS[slug];
    if (!f) return '';
    var isSoon = !f.available;

    if (!isSoon) {
      var cupSz = f.sizeCup || '80g';
      shopSelection[slug] = { sizeKey: cupSz, sizeLabel: cupSz + ' Cup', price: f.priceCup };
    }

    var imgHtml = f.cardImage
      ? '<img src="' + f.cardImage + '" alt="' + f.fullName + '" loading="lazy">'
      : '<div class="flv-card-wordmark">' + f.name + '</div>';

    var szHtml = '';
    if (!isSoon) {
      var cupSize  = f.sizeCup  || '80g';
      var pintSize = f.sizePint || '410g';
      szHtml = '<div class="shop-sz-row">'
        + '<button class="shop-sz active" data-slug="' + slug + '" data-size="' + cupSize + '" data-label="' + cupSize + ' Cup" data-price="' + f.priceCup + '" onclick="selectShopSize(this)">' + cupSize + ' Cup · RM' + f.priceCup + '</button>'
        + '<button class="shop-sz" data-slug="' + slug + '" data-size="' + pintSize + '" data-label="' + pintSize + ' Pint" data-price="' + f.pricePint + '" onclick="selectShopSize(this)">' + pintSize + ' Pint · RM' + f.pricePint + '</button>'
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

    return '<div class="flv-card shop-card' + (isSoon ? ' flv-card--soon' : '') + '" id="flavour-' + slug + '">'
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

// The Merdeka Combo — a single fixed-price cart line, same offer as the
// one live on staging's product.html (reuses the same shared cart).
function addComboToCart() {
  addToCart({
    flavourSlug: 'merdeka-combo',
    flavourName: 'The Merdeka Combo',
    sizeKey: 'combo-5cup',
    sizeLabel: '5 × 70g cups — Musang King, Cempedak, Soya Gula Melaka, Pandan Coconut + free Cempedak',
    price: 45,
    qty: 1
  });
  showCartToast('Added The Merdeka Combo to your order');
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
