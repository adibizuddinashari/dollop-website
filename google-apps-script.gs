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
  cfg.MAX_QTY             = Number(cfg.MAX_QTY) || 24;
  cfg.PROMO_THRESHOLD     = Number(cfg.PROMO_THRESHOLD) || 5;
  cfg.PROMO_FREE          = Number(cfg.PROMO_FREE) || 1;
  return jsonResponse(cfg);
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

  var keys = ['SOLD_OUT','MAX_QTY','PROMO_ACTIVE','PROMO_THRESHOLD','PROMO_FREE',
              'ANNOUNCEMENT_ACTIVE','ANNOUNCEMENT_IMAGE_URL','ANNOUNCEMENT_LINK'];

  // Write headers if missing
  if (sheet.getLastRow() < 1) {
    sheet.getRange(1, 1, 1, keys.length).setValues([keys]);
  }
  // Write values to row 2
  var row = keys.map(function(k) { return cfg[k] !== undefined ? cfg[k] : ''; });
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
    SOLD_OUT: true, MAX_QTY: 24,
    PROMO_ACTIVE: true, PROMO_THRESHOLD: 5, PROMO_FREE: 1,
    ANNOUNCEMENT_ACTIVE: false, ANNOUNCEMENT_IMAGE_URL: '', ANNOUNCEMENT_LINK: 'product.html'
  };
}
