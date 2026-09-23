# Agent context — dollop-website

This repo has thinner docs than `dollop-loyalty`, so more of this is inferred
from the code than quoted from a README. Read it before shipping changes.

## What this is

The dollopgelato.com static site. Plain HTML/CSS/JS, **no framework, no
bundler, no build step.** `package.json` only carries `puppeteer`, used by
`screenshot.mjs` for generating social preview images — it is not a build
tool, and there is no `npm run build` this site depends on. Ship changes as
plain files, the way the rest of the repo is written.

Key files:
- `index.html`, `shop.html`, `product.html` — pages.
- `cart.js` — shared cart, `localStorage`-persisted (`dollop_cart` key).
- `shop.js` — the only page with a checkout modal. `product.js` deliberately
  has **no** checkout of its own; its "Order" actions route to `shop.html`,
  the single place checkout happens. Don't add a second checkout flow to
  `product.html` — route to `shop.html` instead, matching the existing
  pattern.
- `flavours.js` — flavour catalogue and pricing source of truth (`priceCup`
  etc.) — note `site-config.js`'s `DEFAULT_CONFIG.PRICE` is a legacy field
  the current site doesn't actually read for pricing; don't "fix" a price
  bug there without checking `flavours.js` first.
- `site-config.js` — fallback config + the `APPS_SCRIPT_URL` and
  `COMPANY_WHATSAPP` constants. Live config is fetched at runtime from the
  Apps Script backend (`?type=config`); `DEFAULT_CONFIG` here is only what
  renders if that fetch fails.
- `admin.html` — password-gated panel Megan (the client) uses to edit live
  config (price, promo, sold-out flag, announcements, combos, flavour
  order/overrides) without touching code.
- `google-apps-script.gs` — this site's own backend. **This is a different
  Apps Script project from `dollop-loyalty`'s `Code.gs`**, even though both
  are deployable under the same Google account (`general-pg@jump.com.my`).
  Writes to an `Orders` sheet, separate from `dollop-loyalty`'s
  `Members`/`Ledger`/`Config` sheet. Don't assume a `SHEET_ID` or Script
  Property from one applies to the other.

## No CI/CD here — don't assume merge-to-main is live

Unlike `dollop-loyalty`, this repo has **no GitHub Actions and no confirmed
auto-deploy on merge.** How the site actually gets from `main` to
dollopgelato.com (GitHub Pages, Netlify, manual upload — not yet
investigated) is an open question. Do not tell a reviewer "this is now live"
just because a PR merged here; if a request depends on the change being
live (not just merged), say explicitly that the deploy step still needs to
be confirmed/run, and flag it as a gap worth closing (setting up real CI,
matching `dollop-loyalty`'s pattern) rather than silently assuming it's
handled.

## Checkout flow — read this before touching cart/shop/checkout code

There is **no payment gateway.** The flow is:

1. Customer builds a cart in `shop.js`/`cart.js` (flavour + size + qty,
   `localStorage`).
2. Checkout modal collects name, phone, email, fulfilment method, location,
   notes.
3. `shop.js` generates a client-side order number (`DLP-XXXXX`,
   `Math.random()`-based — not guaranteed globally unique, just
   human-friendly).
4. Best-effort save: `fetch(APPS_SCRIPT_URL, {mode: 'no-cors', ...})` — fire
   and forget. `no-cors` means the code **cannot read the response or know
   if it failed**; this is intentional (don't add response-checking logic
   that assumes it can see success/failure here — it can't, and shouldn't
   block checkout on it).
5. Customer is redirected to a `wa.me/<COMPANY_WHATSAPP>?text=...` link with
   a pre-filled order summary.
6. Payment is coordinated **manually, over WhatsApp**, via bank
   transfer/DuitNow QR — staff, not the site, confirm and reconcile payment.

Never build a change that implies the site itself handles or confirms
payment (e.g. "mark order as paid," "show payment success"). If a request is
phrased that way, it almost certainly means "update the WhatsApp handoff
message" or "log it in the Orders sheet," not "process a real payment" —
flag the ambiguity rather than guessing a gateway integration was wanted.

## Orders sheet is positional — don't break the column contract

`google-apps-script.gs`'s `saveOrder()` does `sheet.appendRow([...])` with a
fixed column order: `Timestamp, Order No, Name, Phone, Flavour, Size, Qty,
Fulfilment, Location, Total, Notes`. If a checkout change adds/removes/
reorders a field in the `orderData` object `shop.js` sends, the Apps Script
side must be updated in the same change (or explicitly called out as a
follow-up in the other repo/file) — otherwise data lands in the wrong
columns silently, with no error either side will surface.

## Config is admin-editable — don't hardcode what `admin.html` controls

`PRICE`, `SOLD_OUT`, `PROMO_ACTIVE`/`PROMO_THRESHOLD`/`PROMO_FREE`,
`ANNOUNCEMENT_*`, `PRODUCTS`, `FLAVOUR_ORDER`/`FLAVOUR_HIDDEN`/
`FLAVOUR_OVERRIDES`, `COMBOS` are all writable from `admin.html` and stored
as a single-row `Config` sheet tab (array/object fields JSON-encoded per
cell). If a request wants a new toggle or tunable value, prefer adding it to
this Config mechanism over a hardcoded constant, matching the existing
pattern — that's what lets Megan (non-technical) change it later without a
code change.

## Nothing here is authenticated except `admin.html`

`admin.html` gates writes with a single shared `ADMIN_PASSWORD` Script
Property, checked server-side in `saveConfig()`. It is not per-user auth.
Don't extend this into anything handling real payment credentials or
customer PII beyond what's already collected (name/phone/email/order
details) without flagging that this auth model may not be sufficient for
the new use case.
