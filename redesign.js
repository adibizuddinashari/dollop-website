// ─── DOLLOP — HOMEPAGE REDESIGN DRAFT JS ───────────────────────────────────
// Vanilla JS, no libraries — consistent with the rest of the repo.

// ── Mobile nav drawer ───────────────────────────────────────────────────
function toggleMobMenu() {
  document.getElementById('mobDrawer').classList.toggle('open');
  document.getElementById('mobOverlay').classList.toggle('open');
}

// ── Smooth scroll — spec item 1 ─────────────────────────────────────────
// Swapped the earlier hand-rolled lerp for Lenis (studiofreight/lenis via
// CDN, loaded before this file) — the same library the Framer smooth-
// scroll resource is built on (https://lenis.studiofreight.com/), and a
// noticeably smoother/more premium feel than a manual rAF+lerp loop. The
// checkout modal and the embedded Google map opt out via
// data-lenis-prevent on their elements (in the HTML) so their own
// scrolling isn't hijacked.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof Lenis === 'undefined') return; // CDN failed to load — page still works, just without the eased scroll

  var lenis = new Lenis({
    duration: 1.1,
    easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
    smoothWheel: true
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Anchor links (nav, "See All Flavours", etc.) hand off to Lenis's own
  // eased scrollTo instead of the CSS scroll-behavior default, so in-page
  // jumps match the same easing as regular scrolling.
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var id = link.getAttribute('href').slice(1);
    var target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    lenis.scrollTo(target, { offset: -64 }); // clears the fixed 64px nav
  });
})();

// ── Flagship highlight video — mute toggle (starts muted so autoplay
// policies allow it; button lets the visitor opt into sound) ───────────
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var vid = document.getElementById('flagshipVideo');
    var btn = document.getElementById('flagshipMuteBtn');
    if (!vid || !btn) return;
    var iconMuted = btn.querySelector('.ico-muted');
    var iconUnmuted = btn.querySelector('.ico-unmuted');
    btn.addEventListener('click', function () {
      vid.muted = !vid.muted;
      iconMuted.style.display = vid.muted ? '' : 'none';
      iconUnmuted.style.display = vid.muted ? 'none' : '';
      btn.setAttribute('aria-label', vid.muted ? 'Unmute video' : 'Mute video');
    });
  });
})();

// ── Reveal-on-scroll (mirrors ../index.html's .reveal + IntersectionObserver pattern) ──
// observeReveal() is exposed globally (not wrapped in the usual IIFE) so
// renderFlvTease() below can call it again after it injects new .reveal
// cards via innerHTML — the initial DOMContentLoaded scan only ever finds
// .reveal elements that already exist in the static HTML at that moment,
// so dynamically-rendered cards need a second, explicit observe() call.
var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (e) {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });
function observeReveal(root) {
  // .reveal-clip (footer background wipe) and .reveal-logo (footer logo
  // entrance) use the same "add .visible on intersect" trigger as .reveal
  // — just with their own CSS for what "hidden → visible" looks like.
  (root || document).querySelectorAll('.reveal, .reveal-clip, .reveal-logo').forEach(function (el) { revealObserver.observe(el); });
}
document.addEventListener('DOMContentLoaded', function () { observeReveal(); });

// ── Nav scroll-spy (highlights the current section's nav link) ─────────
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var links = document.querySelectorAll('.sb-link');
    if (!links.length) return;
    var sObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id;
        links.forEach(function (l) {
          l.classList.toggle('active', l.getAttribute('href') === '#' + id);
        });
      });
    }, { threshold: 0.4 });
    document.querySelectorAll('section[id]').forEach(function (el) { sObs.observe(el); });
  });
})();

// ── Hero slideshow (same rotation pattern as ../index.html) ────────────
// Headline word swaps in sync with each slide (FLAVOUR/JOY/LOVE/MESS/DOLLOP,
// matching the "Dollop Pure ___.png" image order) via a quick crossfade.
(function () {
  var SWAP_WORDS = ['FLAVOUR', 'JOY', 'LOVE', 'MESS', 'DOLLOP'];

  document.addEventListener('DOMContentLoaded', function () {
    var slides = document.querySelectorAll('.hero-slide');
    var dots = document.querySelectorAll('.hero-dot');
    if (slides.length <= 1) return; // single static hero image — nothing to rotate
    var swapWord = document.getElementById('heroSwapWord');
    var cur = 0, timer;
    function goTo(n) {
      slides[cur].classList.remove('active');
      if (dots[cur]) dots[cur].classList.remove('active');
      cur = (n + slides.length) % slides.length;
      slides[cur].classList.add('active');
      if (dots[cur]) dots[cur].classList.add('active');
      if (swapWord && SWAP_WORDS[cur]) {
        swapWord.style.opacity = 0;
        setTimeout(function () {
          swapWord.textContent = SWAP_WORDS[cur];
          swapWord.style.opacity = 1;
        }, 250);
      }
    }
    function next() { goTo(cur + 1); }
    function startAuto() { timer = setInterval(next, 5000); }
    function resetAuto() { clearInterval(timer); startAuto(); }
    dots.forEach(function (d, i) { d.addEventListener('click', function () { goTo(i); resetAuto(); }); });
    var prevBtn = document.getElementById('heroPrev');
    var nextBtn = document.getElementById('heroNext');
    if (prevBtn) prevBtn.addEventListener('click', function () { goTo(cur - 1); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { goTo(cur + 1); resetAuto(); });
    startAuto();
  });
})();

// ── Flavour tease grid — spec item 2 ────────────────────────────────────
// Revives ../index.html's dormant renderFlvGrid()/#flvGrid pattern, extended
// to show all 4 flavours (not capped at 3) and to render a gradient-only
// "Coming Soon" wordmark card (no placehold.co stub) for flavours with no
// photography yet — see redesign/flavours-draft.js for the data + notes.
function renderFlvTease() {
  var grid = document.getElementById('flvGrid');
  if (!grid || typeof FEATURED_FLAVOURS === 'undefined') return;

  grid.innerHTML = FEATURED_FLAVOURS.map(function (slug, i) {
    var f = FLAVOURS[slug];
    if (!f) return '';
    var isSoon = !f.available;
    var href = 'shop.html'; // single ordering destination — see redesign/shop.html
    var delay = (i * 0.1).toFixed(2); // staggers each card in one by one instead of all at once

    // Cup photo shows by default; hovering the card fades in the pint photo
    // on top (pure CSS — see .flv-card-photo--pint in redesign.css). Falls
    // back to a single cardImage/wordmark when there's no dedicated pair.
    var imgHtml;
    if (f.cupImage && f.pintImage) {
      imgHtml = '<img src="' + f.cupImage + '" alt="' + f.fullName + '" loading="lazy" class="flv-card-photo flv-card-photo--cup">'
        + '<img src="' + f.pintImage + '" alt="' + f.fullName + ' (pint)" loading="lazy" class="flv-card-photo flv-card-photo--pint">';
    } else if (f.cardImage) {
      imgHtml = '<img src="' + f.cardImage + '" alt="' + f.fullName + '" loading="lazy">';
    } else {
      imgHtml = '<div class="flv-card-wordmark">' + f.name + '</div>';
    }

    var priceHtml = f.priceCup
      ? '<div><div class="flv-card-price">RM ' + f.priceCup + '</div><div class="flv-card-price-sub">per ' + f.sizeCup + ' cup</div></div>'
      : '<div></div>';

    var ctaHtml = isSoon
      ? '<a class="flv-card-cta flv-card-cta--soon" href="https://www.instagram.com/dollopgelato/" target="_blank" rel="noopener">Follow for updates →</a>'
      : '<a class="flv-card-cta" href="' + href + '">Order Now</a>';

    var badgeCls = isSoon ? 'flv-badge--soon' : (f.badge === 'New' ? 'flv-badge--new' : '');

    return '<div class="flv-card reveal' + (isSoon ? ' flv-card--soon' : '') + '" style="transition-delay:' + delay + 's">'
      + '<div class="flv-card-img" style="background:' + f.cardBg + '">'
      +   imgHtml
      +   '<div class="flv-card-img-overlay"></div>'
      +   '<span class="flv-badge ' + badgeCls + '">' + f.badge + '</span>'
      + '</div>'
      + '<div class="flv-card-body">'
      +   '<div class="flv-card-name">' + f.name + '</div>'
      +   '<div class="flv-card-tagline">' + f.tagline + '</div>'
      +   '<div class="flv-card-footer">' + priceHtml + ctaHtml + '</div>'
      + '</div>'
      + '</div>';
  }).join('');

  observeReveal(grid); // cards were just injected — pick up their new .reveal elements
}
document.addEventListener('DOMContentLoaded', renderFlvTease);

// ── Promo ticker — between Hero and Our Flavours ────────────────────────
// Same fix as the "Pure ___" marquee below: two copies isn't reliably
// enough content to span a wide viewport, so at the loop point (-50%)
// there'd be visible blank space before the repeat catches up. Repeating
// the pattern many times per half guarantees each half alone is already
// wider than any real viewport, so the -50%-reset loop is always seamless.
// animation-duration is set from the ACTUAL rendered width (not a fixed
// value) so the scroll speed (px/s) stays constant regardless of how many
// repeats that took, or how wide the phrases render at a given font size.
function renderTicker() {
  var track = document.getElementById('tickerTrack');
  if (!track) return;
  var ITEMS = [
    { text: 'BUY 4 FREE 1 !', cls: 'ticker-blue' },
    { text: 'MERDEKA COMBO DEAL', cls: 'ticker-red' },
    { text: 'FREE GELATO CUP', cls: 'ticker-yellow' }
  ];
  var REPEATS = 8; // per half — comfortably wider than any real viewport
  var PX_PER_SEC = 70; // ticker scroll speed, tuned by eye

  function half() {
    var html = '';
    for (var r = 0; r < REPEATS; r++) {
      ITEMS.forEach(function (item) {
        html += '<span class="ticker-item ' + item.cls + '">' + item.text + '</span><span class="ticker-sep">✦</span>';
      });
    }
    return html;
  }
  var h = half();
  track.innerHTML = h + h;

  // Track now holds 2 identical halves; the keyframe travels 0 → -50%,
  // i.e. exactly one half's width — measure that and derive duration.
  var halfWidth = track.scrollWidth / 2;
  track.style.animationDuration = (halfWidth / PX_PER_SEC) + 's';
}
document.addEventListener('DOMContentLoaded', renderTicker);
window.addEventListener('resize', function () {
  clearTimeout(window._tickerResizeT);
  window._tickerResizeT = setTimeout(renderTicker, 200);
});

// ── "Pure ___" marquee — Figma node 45:4298 ──────────────────────────────
// Fills the text/circle tracks declared empty in index.html (#hpyText1-3,
// #hpyCircles1-2) with content duplicated several times over so each
// track stays far wider than the viewport at max scroll-driven travel
// distance (see the scroll-linked block below) in either direction.
// ROW_WORDS follows the Figma file's 3-word-per-row cycle (row 2's middle
// "Pure Flavour" is set in the heavier Black weight there, kept here via
// the `em` flag), extended so every "Pure ___" tagline used elsewhere on
// the site shows up somewhere in the cycle too — SWAP_WORDS in the hero
// slideshow above is FLAVOUR/JOY/LOVE/MESS/DOLLOP; "Fun" is Figma-only.
// "Bliss"/"Stink"/"Good" are new on-brand additions ("Stink" nods to the
// live site's own "STINKY GOOD" marquee copy — durian's smell played for
// laughs, not hidden). Circle images alternate between the two real
// top-view photos shot so far, standing in for the single stock photo
// the Figma file repeats — swap/extend CIRCLE_PHOTOS below the moment
// more flavours are photographed.
function renderHappinessMarquee() {
  var ROW_WORDS = [
    ['Pure Flavour', 'Pure Joy', 'Pure Fun', 'Pure Bliss', 'Choose Your Pureness'],
    ['Pure Mess', { text: 'Pure Flavour', em: true }, 'Pure Dollop', 'Pure Stink', 'Choose Your Pureness'],
    ['Pure Flavour', 'Pure Love', 'Pure Flavour', 'Pure Good', 'Choose Your Pureness']
  ];
  var GROUP_REPEATS = 16; // repeats of the word pattern per half — long enough that no empty space shows even scrolling all the way through the section's full in-view + pinned + scroll-out range
  function wordSpan(item) {
    var em = typeof item === 'object' && item.em;
    var text = typeof item === 'object' ? item.text : item;
    return '<span class="hpy-word' + (em ? ' hpy-word--em' : '') + '">' + text + '</span>';
  }
  function wordHalf(pattern) {
    var html = '';
    for (var r = 0; r < GROUP_REPEATS; r++) pattern.forEach(function (item) { html += wordSpan(item); });
    return html;
  }
  ['hpyText1', 'hpyText2', 'hpyText3'].forEach(function (id, i) {
    var el = document.getElementById(id);
    if (el) { var half = wordHalf(ROW_WORDS[i]); el.innerHTML = half + half; }
  });

  var CIRCLE_PHOTOS = [
    { src: 'assets/images/dollop%20top%20view%20cempedak.png', alt: 'Cempedak Gelato, top view' },
    { src: 'assets/images/dollop%20top%20view%20soya.png',     alt: 'Soya Gula Melaka Gelato, top view' }
  ];
  var CIRCLES_PER_HALF = 48; // long enough that no empty space shows even scrolling all the way through the section's full in-view + pinned + scroll-out range
  function circleHalf() {
    var html = '';
    for (var i = 0; i < CIRCLES_PER_HALF; i++) {
      var photo = CIRCLE_PHOTOS[i % CIRCLE_PHOTOS.length];
      html += '<div class="hpy-circle"><img src="' + photo.src + '" alt="' + photo.alt + '" loading="lazy"></div>';
    }
    return html;
  }
  ['hpyCircles1', 'hpyCircles2'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) { var half = circleHalf(); el.innerHTML = half + half; }
  });
}
document.addEventListener('DOMContentLoaded', renderHappinessMarquee);

// Outer #parallax is a tall scroll-spacer with a position:sticky inner
// wrapper (redesign.css), so scrolling visually "pauses" on this section
// for a beat once pinned. Row motion isn't tied to that pin window though
// — it starts the instant ANY part of the section enters the viewport and
// keeps going, tracking scroll 1:1, for as long as any part of it remains
// visible (through the pinned dwell AND the unpinned scroll-out at the
// end) — not clamped to a fixed distance that finishes early. Each row's
// translateX is set directly from how far the section's top has traveled
// from the viewport's bottom edge (SCROLL-LINKED, not autoplaying CSS) —
// .hpy-dir-left rows travel toward negative X, .hpy-dir-right rows
// travel toward positive X, so alternating rows read as moving opposite
// directions as the user scrolls, and stay put the instant they stop.
(function () {
  var HPY_SPEED = 0.28; // px each row shifts per px of scroll travel while any part of the section is visible

  document.addEventListener('DOMContentLoaded', function () {
    var section = document.getElementById('parallax');
    if (!section) return;
    var leftRows = section.querySelectorAll('.hpy-dir-left');
    var rightRows = section.querySelectorAll('.hpy-dir-right');

    function applyShift(traveled) {
      var leftX = -traveled * HPY_SPEED;
      var rightX = traveled * HPY_SPEED;
      leftRows.forEach(function (el) { el.style.transform = 'translateX(' + leftX + 'px)'; });
      rightRows.forEach(function (el) { el.style.transform = 'translateX(' + rightX + 'px)'; });
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      applyShift(0);
      return;
    }

    var active = null, ticking = false;
    new IntersectionObserver(function (entries) {
      active = entries[0].isIntersecting ? section : null;
    }, { threshold: 0 }).observe(section);

    window.addEventListener('scroll', function () {
      if (!active || ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var r = active.getBoundingClientRect();
        var traveled = Math.max(0, window.innerHeight - r.top); // 0 the instant the section's top touches the viewport's bottom edge, keeps growing until the section is fully scrolled past
        applyShift(traveled);
        ticking = false;
      });
    }, { passive: true });
  });
})();

// Admin-controlled announcement popup (promo image + link, e.g. seasonal
// campaigns). Only index.html carries the #annOverlay markup, so this
// no-ops on shop.html/product.html — matches the live site's current
// behaviour of only showing it on the homepage.
(function () {
  var annOverlay = document.getElementById('annOverlay');
  if (!annOverlay) return;

  // Config is applied twice on a normal load (once from the localStorage
  // cache for an instant paint, once again when the fresh fetch resolves),
  // so a naive "open on load" would pop the announcement a second time —
  // e.g. right as the fetch resolves after the user already closed it.
  // These flags make the open a one-shot action per page view.
  var opened = false;
  var dismissed = false;

  function openAnn() {
    if (opened || dismissed) return;
    opened = true;
    annOverlay.classList.add('open');
  }

  function applyAnnouncementConfig(cfg) {
    var c = Object.assign({}, DEFAULT_CONFIG, cfg);
    if (opened || dismissed) return;
    if (!c.ANNOUNCEMENT_ACTIVE || !c.ANNOUNCEMENT_IMAGE_URL) return;
    var annImg = document.getElementById('annImg');
    var annLink = document.getElementById('annLink');
    if (annLink) annLink.href = c.ANNOUNCEMENT_LINK || 'shop.html';
    if (annImg) {
      annImg.onerror = function () { annOverlay.classList.remove('open'); };
      annImg.onload = function () { setTimeout(openAnn, 600); };
      annImg.src = toDriveDirectUrl(c.ANNOUNCEMENT_IMAGE_URL);
    } else {
      setTimeout(openAnn, 600);
    }
  }

  var local = localStorage.getItem('dollop_config');
  if (local) { try { applyAnnouncementConfig(JSON.parse(local)); } catch (e) {} }
  fetch(APPS_SCRIPT_URL + '?type=config', { cache: 'no-cache' })
    .then(function (r) { return r.json(); })
    .then(function (cfg) { localStorage.setItem('dollop_config', JSON.stringify(cfg)); applyAnnouncementConfig(cfg); })
    .catch(function () { if (!local) applyAnnouncementConfig(DEFAULT_CONFIG); });

  var card = document.getElementById('annCard');
  var closeBtn = document.getElementById('annClose');
  if (card && closeBtn) {
    function closeAnn() { dismissed = true; annOverlay.classList.remove('open'); }
    closeBtn.addEventListener('click', closeAnn);
    annOverlay.addEventListener('click', function (e) { if (!card.contains(e.target)) closeAnn(); });
  }
})();
