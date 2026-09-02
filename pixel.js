// ─── DOLLOP META PIXEL ─────────────────────────────────────────────────────
// Base pixel, ID 2040554866886258 — the same pixel the pre-redesign site
// used (added in commit d0ae988, dropped when the redesign shipped in
// 9a3ec67, restored 2026-09-02). Loading this file on a page fires a
// PageView. The <noscript> fallback pixel lives inline in each page's
// <head>, right after the tag that loads this file.
//
// Conversion events are fired elsewhere, each guarded with `typeof fbq`:
//   shop.js  — InitiateCheckout, Lead, Purchase
//   product.js — ViewContent (per flavour)
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '2040554866886258');
fbq('track', 'PageView');
