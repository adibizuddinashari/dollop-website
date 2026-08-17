// ─── DOLLOP PRODUCT PAGE (redesign draft) ──────────────────────────────────
// Ported from ../product.html: same flavour switcher / size / sweetness /
// nutrition-accordion behaviour, reading from flavours-draft.js instead of
// the live flavours.js so all 4 flavours (incl. the 2 "coming soon" ones)
// work here too. Deliberately has NO checkout modal of its own — "Order
// Now" adds the current selection to the shared cart (../cart.js) and
// sends the visitor to shop.html, which is the single place checkout
// happens across the whole redesign (see redesign/shop.js).

const params = new URLSearchParams(window.location.search);
let currentFlavour = params.get('flavour') || 'musang-king';
if (!FLAVOURS[currentFlavour]) currentFlavour = 'musang-king';
let currentSweet = 'regular';
let price = 18, cupSize = '80g';

function applyProduct() {
  var f = FLAVOURS[currentFlavour];
  if (!f) return;

  document.title = 'Dollop — ' + f.fullName;
  var bcEl = document.getElementById('bc-current');
  if (bcEl) bcEl.textContent = f.fullName;

  var nameEl = document.getElementById('ph-name'); if (nameEl) nameEl.textContent = f.fullName;
  var subEl = document.getElementById('ph-sub'); if (subEl) subEl.textContent = f.tagline;
  var badgeEl = document.getElementById('ph-badge'); if (badgeEl) badgeEl.textContent = f.badge;

  var imgEl = document.getElementById('ph-img');
  if (imgEl) { imgEl.src = f.productImage || f.cardImage; imgEl.style.padding = '24px'; imgEl.style.objectFit = 'contain'; }
  var wrap = document.getElementById('ph-img-wrap');
  if (wrap) wrap.className = 'ph-img-wrap';

  var statsEl = document.getElementById('phStats');
  if (statsEl) {
    if (f.stats.length) {
      statsEl.style.display = '';
      statsEl.innerHTML = f.stats.map(function (s, i) {
        return (i > 0 ? '<div class="ph-stat-div"></div>' : '')
          + '<div class="ph-stat"><span class="ph-stat-num">' + s.num + '</span>'
          + (s.unit ? '<span class="ph-stat-unit">' + s.unit + '</span>' : '')
          + '<span class="ph-stat-lbl">' + s.label + '</span></div>';
      }).join('');
    } else {
      statsEl.style.display = 'none';
    }
  }

  var priceTag = document.querySelector('.ph-price-tag');
  if (priceTag) priceTag.style.display = f.priceCup ? '' : 'none';
  var phPriceEl = document.getElementById('ph-price');
  var phPriceWasEl = document.getElementById('ph-price-was');
  if (phPriceEl && f.priceCup) phPriceEl.textContent = 'RM ' + f.priceCup;
  if (phPriceWasEl) {
    if (f.originalPriceCup) { phPriceWasEl.textContent = 'RM ' + f.originalPriceCup; phPriceWasEl.style.display = 'inline'; }
    else { phPriceWasEl.style.display = 'none'; }
  }

  var accNutr = document.getElementById('acc-nutrition-section');
  if (accNutr) accNutr.style.display = (f.hasNutrition === false) ? 'none' : '';

  var featEl = document.getElementById('phFeatures');
  if (featEl) {
    featEl.style.display = f.features.length ? '' : 'none';
    featEl.innerHTML = f.features.map(function (ft) { return '<div class="ph-feat-item">— ' + ft + '</div>'; }).join('');
  }

  var sweetEl = document.getElementById('phSweetness');
  if (sweetEl) sweetEl.style.display = f.hasSweetness ? 'block' : 'none';
  if (f.hasSweetness) { currentSweet = 'regular'; selSweet('regular'); }

  var szBtns = document.querySelectorAll('.ph-sz');
  var cupP = f.priceCup || 18, pintP = f.pricePint || 75;
  var cupSz = f.sizeCup || '80g', pintSz = f.sizePint || '410g';
  if (szBtns[0]) {
    szBtns[0].dataset.size = cupSz;
    szBtns[0].setAttribute('onclick', 'selSize(this,' + cupP + ')');
    szBtns[0].classList.add('active');
    var img0 = szBtns[0].querySelector('.ph-sz-img'); if (img0) img0.style.display = f.hasImages ? '' : 'none';
    var nm0 = szBtns[0].querySelector('.ph-sz-name'); if (nm0) nm0.textContent = cupSz + ' Cup';
    var pr0 = szBtns[0].querySelector('.ph-sz-price');
    if (pr0) pr0.innerHTML = f.originalPriceCup ? '<s style="opacity:0.38;font-size:0.8em;margin-right:3px;">RM ' + f.originalPriceCup + '</s>RM ' + cupP : 'RM ' + cupP;
  }
  if (szBtns[1]) {
    szBtns[1].dataset.size = pintSz;
    szBtns[1].setAttribute('onclick', 'selSize(this,' + pintP + ')');
    szBtns[1].classList.remove('active');
    var img1 = szBtns[1].querySelector('.ph-sz-img'); if (img1) img1.style.display = f.hasImages ? '' : 'none';
    var nm1 = szBtns[1].querySelector('.ph-sz-name'); if (nm1) nm1.textContent = pintSz + ' Pint';
    var pr1 = szBtns[1].querySelector('.ph-sz-price');
    if (pr1) pr1.innerHTML = f.originalPricePint ? '<s style="opacity:0.38;font-size:0.8em;margin-right:3px;">RM ' + f.originalPricePint + '</s>RM ' + pintP : 'RM ' + pintP;
  }
  price = cupP;
  cupSize = cupSz;

  renderFlvSwitcher();

  var orderBtn = document.getElementById('phOrderBtn');
  var soonBox = document.getElementById('phComingSoon');
  var szRow = document.querySelector('.ph-sz-row');
  if (!f.available) {
    if (orderBtn) orderBtn.style.display = 'none';
    if (soonBox) soonBox.style.display = 'block';
    if (szRow) szRow.style.display = 'none';
  } else {
    if (orderBtn) { orderBtn.style.display = ''; orderBtn.disabled = false; }
    if (soonBox) soonBox.style.display = 'none';
    if (szRow) szRow.style.display = '';
  }
}

function renderFlvSwitcher() {
  var sw = document.getElementById('phFlvSwitcher');
  if (!sw || typeof FLAVOURS === 'undefined') return;
  sw.innerHTML = Object.keys(FLAVOURS).map(function (slug) {
    var f = FLAVOURS[slug];
    var isCurrent = slug === currentFlavour;
    var isSoon = !f.available;
    return '<button class="ph-flv-btn' + (isCurrent ? ' active' : '') + (isSoon ? ' ph-flv-btn--soon' : '') + '"'
      + (!isSoon ? ' data-slug="' + slug + '" onclick="switchToFlavour(this.dataset.slug)"' : '')
      + '>' + f.name + (isSoon ? ' — Soon' : '') + '</button>';
  }).join('');
}

function switchToFlavour(slug) {
  if (slug === currentFlavour || !FLAVOURS[slug]) return;
  currentFlavour = slug;
  currentSweet = 'regular';
  applyProduct();
  var url = new URL(window.location.href);
  url.searchParams.set('flavour', slug);
  window.history.replaceState({}, '', url);
}

function toggleAcc(btn) {
  var body = btn.nextElementSibling;
  var icon = btn.querySelector('.ph-acc-icon');
  var open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  if (icon) icon.classList.toggle('open', !open);
}

function selSweet(t) {
  currentSweet = t;
  document.querySelectorAll('#sw-regular,#sw-less').forEach(function (b) { b.classList.remove('active'); });
  var btn = document.getElementById('sw-' + t); if (btn) btn.classList.add('active');
  var f = FLAVOURS[currentFlavour];
  if (f && f.sweetness && f.sweetness[t]) {
    var wrap = document.getElementById('ph-img-wrap');
    if (wrap) wrap.className = 'ph-img-wrap' + (f.sweetness[t].imgClass ? ' ' + f.sweetness[t].imgClass : '');
    var sugarEl = document.getElementById('nut-sugar');
    if (sugarEl) sugarEl.textContent = f.sweetness[t].sugar;
  }
}

function selSize(btn, p) {
  price = p;
  document.querySelectorAll('.ph-sz').forEach(function (b) { b.classList.remove('active'); });
  btn.classList.add('active');
  cupSize = btn.getAttribute('data-size');
  var priceEl = document.getElementById('ph-price');
  if (priceEl) priceEl.textContent = 'RM ' + p;
  var imgEl = document.getElementById('ph-img');
  var flv = FLAVOURS[currentFlavour];
  if (imgEl && flv && flv.pintImage) {
    var isPint = cupSize === (flv.sizePint || '410g');
    imgEl.src = isPint ? flv.pintImage : (flv.cupImage || flv.productImage);
    imgEl.style.padding = '24px';
    imgEl.style.objectFit = 'contain';
  }
}

// Adds the current flavour + size to the shared cart, then sends the
// visitor to shop.html — the one page where checkout actually happens.
function addCurrentToCart() {
  var f = FLAVOURS[currentFlavour];
  if (!f) return;
  var isPint = cupSize === (f.sizePint || '410g');
  addToCart({
    flavourSlug: currentFlavour,
    flavourName: f.fullName,
    sizeKey: cupSize,
    sizeLabel: cupSize + (isPint ? ' Pint' : ' Cup'),
    price: price,
    qty: 1
  });
  var btn = document.getElementById('phOrderBtn');
  if (btn) { btn.disabled = true; btn.textContent = 'Added — taking you to your pack...'; }
  setTimeout(function () { window.location.href = 'shop.html'; }, 550);
}

function showSoldOutToast() {
  var t = document.getElementById('soldout-toast');
  if (!t) return;
  t.classList.add('show');
  setTimeout(function () { t.classList.remove('show'); }, 3000);
}

function applyConfig(cfg) {
  window.SITE_CFG = Object.assign({}, DEFAULT_CONFIG, cfg);
  var c = window.SITE_CFG;
  var orderBtn = document.getElementById('phOrderBtn');
  if (!orderBtn) return;
  if (c.SOLD_OUT) {
    orderBtn.dataset.origText = orderBtn.dataset.origText || orderBtn.textContent;
    orderBtn.textContent = 'Sold Out';
    orderBtn.disabled = true;
  } else if (orderBtn.textContent === 'Sold Out') {
    orderBtn.textContent = orderBtn.dataset.origText || 'Order Now →';
    orderBtn.disabled = false;
  }
}

function loadAndApplyConfig() {
  var local = localStorage.getItem('dollop_config');
  if (local) { try { applyConfig(JSON.parse(local)); } catch (e) {} }
  fetch(APPS_SCRIPT_URL + '?type=config', { cache: 'no-cache' })
    .then(function (r) { return r.json(); })
    .then(function (cfg) { localStorage.setItem('dollop_config', JSON.stringify(cfg)); applyConfig(cfg); })
    .catch(function () { if (!local) applyConfig(DEFAULT_CONFIG); });
}

document.addEventListener('DOMContentLoaded', function () {
  applyProduct();
  loadAndApplyConfig();
});
