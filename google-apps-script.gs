// ─── DOLLOP APPS SCRIPT ────────────────────────────────────────────────────
// SETUP INSTRUCTIONS:
//   1. Open your existing Apps Script project (Extensions > Apps Script)
//   2. REPLACE the entire contents with this file
//   3. Go to Project Settings > Script Properties
//   4. Add a property: Name = ADMIN_PASSWORD, Value = (choose a password for Megan)
//   5. In the Google Sheet, add a new tab named exactly: Config
//   6. In the Config tab, row 1 = headers, row 2 = values (will be auto-created on first Save)
//   7. Deploy > Manage deployments > create a new deployment (Web app, Anyone can access)
//   8. Copy the new Web App URL and update APPS_SCRIPT_URL in site-config.js

const ORDERS_SHEET = 'Orders'; // your existing orders sheet tab name — adjust if different
const CONFIG_SHEET = 'Config';

function doGet(e) {
  var type = e && e.parameter && e.parameter.type;

  if (type === 'config') {
    return getConfig();
  }

  // Default: return a simple status
  return ContentService
    .createTextOutput(JSON.stringify({status:'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var data;
  try { data = JSON.parse(e.postData.contents); } catch(err) {
    return jsonResponse({error: 'Invalid JSON'});
  }

  if (data.type === 'config') {
    return saveConfig(data);
  }

  // Default: treat as an order submission (existing behaviour)
  return saveOrder(data);
}

// ── Config read ─────────────────────────────────────────────────────────────
function getConfig() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_SHEET);
  if (!sheet || sheet.getLastRow() < 2) {
    // Return defaults if sheet not set up yet
    return jsonResponse(defaultConfig());
  }
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var values  = sheet.getRange(2, 1, 1, sheet.getLastColumn()).getValues()[0];
  var cfg = {};
  headers.forEach(function(h, i) { cfg[h] = values[i]; });
  // Coerce types
  cfg.SOLD_OUT            = cfg.SOLD_OUT === true || cfg.SOLD_OUT === 'TRUE' || cfg.SOLD_OUT === 'true';
  cfg.PROMO_ACTIVE        = cfg.PROMO_ACTIVE === true || cfg.PROMO_ACTIVE === 'TRUE' || cfg.PROMO_ACTIVE === 'true';
  cfg.ANNOUNCEMENT_ACTIVE = cfg.ANNOUNCEMENT_ACTIVE === true || cfg.ANNOUNCEMENT_ACTIVE === 'TRUE' || cfg.ANNOUNCEMENT_ACTIVE === 'true';
  cfg.PRICE               = Number(cfg.PRICE) || 18;
  cfg.ORIGINAL_PRICE      = Number(cfg.ORIGINAL_PRICE) || 0;
  cfg.MAX_QTY             = Number(cfg.MAX_QTY) || 24;
  cfg.PROMO_THRESHOLD     = Number(cfg.PROMO_THRESHOLD) || 5;
  cfg.PROMO_FREE          = Number(cfg.PROMO_FREE) || 1;
  // These are stored JSON-encoded, one per cell — parse a key only when its
  // column actually exists. Leaving a missing key absent (rather than forcing
  // it to []/{}) lets the site apply its own built-in default. This matters
  // for COMBOS: absent → show the bundled Merdeka combo; [] → the admin has
  // deliberately cleared every combo.
  if ('PRODUCTS'          in cfg) cfg.PRODUCTS          = parseJsonCell(cfg.PRODUCTS, []);
  if ('FLAVOUR_ORDER'     in cfg) cfg.FLAVOUR_ORDER     = parseJsonCell(cfg.FLAVOUR_ORDER, []);
  if ('FLAVOUR_HIDDEN'    in cfg) cfg.FLAVOUR_HIDDEN    = parseJsonCell(cfg.FLAVOUR_HIDDEN, []);
  if ('FLAVOUR_OVERRIDES' in cfg) cfg.FLAVOUR_OVERRIDES = parseJsonCell(cfg.FLAVOUR_OVERRIDES, {});
  if ('COMBOS'            in cfg) cfg.COMBOS            = parseJsonCell(cfg.COMBOS, []);
  return jsonResponse(cfg);
}

function parseJsonCell(raw, fallback) {
  try { return raw ? JSON.parse(raw) : fallback; }
  catch (err) { return fallback; }
}

// ── Config write ────────────────────────────────────────────────────────────
function saveConfig(data) {
  var props = PropertiesService.getScriptProperties();
  var password = props.getProperty('ADMIN_PASSWORD');
  if (!password || data.password !== password) {
    return jsonResponse({error: 'Wrong password'});
  }

  var cfg = data.data;
  if (!cfg) return jsonResponse({error: 'No data'});

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG_SHEET);
  if (!sheet) sheet = ss.insertSheet(CONFIG_SHEET);

  var keys = ['ORIGINAL_PRICE','PRICE','SOLD_OUT','MAX_QTY','PROMO_ACTIVE','PROMO_THRESHOLD','PROMO_FREE',
              'ANNOUNCEMENT_ACTIVE','ANNOUNCEMENT_IMAGE_URL','ANNOUNCEMENT_LINK',
              'PRODUCTS','FLAVOUR_OVERRIDES','FLAVOUR_ORDER','FLAVOUR_HIDDEN','COMBOS'];
  // These keys hold arrays/objects — store each JSON-encoded in one cell
  // (well under the ~50k char cell limit). FLAVOUR_OVERRIDES defaults to {}.
  var JSON_KEYS = { PRODUCTS: [], FLAVOUR_OVERRIDES: {}, FLAVOUR_ORDER: [], FLAVOUR_HIDDEN: [], COMBOS: [] };

  // Always rewrite headers to stay in sync with the keys list
  sheet.getRange(1, 1, 1, keys.length).setValues([keys]);
  // Write values to row 2.
  var row = keys.map(function(k) {
    if (JSON_KEYS.hasOwnProperty(k)) {
      return JSON.stringify(cfg[k] !== undefined && cfg[k] !== null ? cfg[k] : JSON_KEYS[k]);
    }
    return cfg[k] !== undefined ? cfg[k] : '';
  });
  sheet.getRange(2, 1, 1, keys.length).setValues([row]);

  return jsonResponse({success: true});
}

// ── Orders (existing behaviour) ─────────────────────────────────────────────
function saveOrder(data) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(ORDERS_SHEET) || ss.getSheets()[0];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp','Order No','Name','Phone','Flavour','Size','Qty','Fulfilment','Location','Total','Notes']);
    }
    sheet.appendRow([
      data.timestamp, data.orderNo, data.name, data.phone,
      data.flavour, data.size, data.qty, data.fulfilment,
      data.location, data.total, data.notes || ''
    ]);

    // Send email notification to all recipients
    var recipients = [
      "general-pg@jump.com.my",
      "bbgeneral@beyondbites.com.my",
      "bryantyz@beyondbites.com.my",
      "ngpm1016@beyondbites.com.my"
    ].join(",");

    var subject = "New Dollop Order: " + data.orderNo;
    var body = "New order received!\n\n"
      + "Order No: " + data.orderNo + "\n"
      + "Name: " + data.name + "\n"
      + "Phone: " + data.phone + "\n"
      + "Flavour: " + data.flavour + "\n"
      + "Size: " + data.size + "\n"
      + "Qty: " + data.qty + "\n"
      + "Fulfilment: " + data.fulfilment + "\n"
      + "Location: " + data.location + "\n"
      + "Total: " + data.total + "\n"
      + "Notes: " + (data.notes || "—");
    MailApp.sendEmail(recipients, subject, body);

    return jsonResponse({success: true});
  } catch(err) {
    return jsonResponse({error: err.toString()});
  }
}

// ── Helpers ─────────────────────────────────────────────────────────────────
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function defaultConfig() {
  return {
    ORIGINAL_PRICE: 18, PRICE: 15, SOLD_OUT: true, MAX_QTY: 24,
    PROMO_ACTIVE: true, PROMO_THRESHOLD: 5, PROMO_FREE: 1,
    ANNOUNCEMENT_ACTIVE: false, ANNOUNCEMENT_IMAGE_URL: '', ANNOUNCEMENT_LINK: 'product.html',
    PRODUCTS: [], FLAVOUR_OVERRIDES: {}, FLAVOUR_ORDER: [], FLAVOUR_HIDDEN: []
    // COMBOS intentionally omitted here so a brand-new sheet falls back to the
    // site's bundled Merdeka combo rather than rendering nothing.
  };
}
