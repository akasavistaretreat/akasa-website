/**
 * AKASA Valley Retreat — enquiry capture
 *
 * Paste this into a Google Apps Script project bound to a Google Sheet, deploy
 * it as a web app, and put the resulting /exec URL in VITE_LEAD_ENDPOINT.
 * Full steps are in lead-capture/README.md.
 *
 * Design notes:
 *  · The browser posts text/plain, not application/json. That's deliberate — it
 *    keeps the request a CORS "simple request" so no preflight is needed, which
 *    Apps Script cannot answer (it doesn't serve OPTIONS). We parse the body as
 *    JSON ourselves below.
 *  · Every write is wrapped in a LockService mutex. Two enquiries landing in the
 *    same second would otherwise race on getLastRow and overwrite each other.
 *  · Header row is created on first run, so a blank sheet works out of the box.
 */

var SHEET_NAME = 'Enquiries';

// Leave '' when this script is bound to a sheet (Extensions → Apps Script).
// If you instead created a standalone script at script.new — the workaround
// when Drive refuses to open the bound editor — paste the sheet's ID here.
// It's the long string in the sheet URL between /d/ and /edit:
//   docs.google.com/spreadsheets/d/THIS_PART/edit
var SPREADSHEET_ID = '';

// Set to an address to get an email on every enquiry. Leave '' for none.
var NOTIFY_EMAIL = '';

var HEADERS = [
  'Received',
  'Name',
  'Phone',
  'Email',
  'City',
  'Interested In',
  'Preferred Visit Date',
  'Message',
  'Source',
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
  } catch (err) {
    return json({ ok: false, error: 'busy' });
  }

  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      payload = JSON.parse(e.postData.contents);
    }

    if (!payload.name || !payload.phone) {
      return json({ ok: false, error: 'name and phone are required' });
    }

    var sheet = getSheet();
    sheet.appendRow([
      new Date(),
      payload.name || '',
      payload.phone || '',
      payload.email || '',
      payload.city || '',
      payload.interest || '',
      payload.visitDate || '',
      payload.message || '',
      payload.source || 'website',
    ]);

    if (NOTIFY_EMAIL) {
      notify_(payload);
    }

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Lets you confirm the deployment is live by opening the /exec URL. */
function doGet() {
  return json({ ok: true, service: 'akasa-lead-capture' });
}

function getSheet() {
  var ss = SPREADSHEET_ID
    ? SpreadsheetApp.openById(SPREADSHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function notify_(p) {
  var lines = [
    'Name: ' + (p.name || '—'),
    'Phone: ' + (p.phone || '—'),
    'Email: ' + (p.email || '—'),
    'City: ' + (p.city || '—'),
    'Interested in: ' + (p.interest || '—'),
    'Preferred visit date: ' + (p.visitDate || '—'),
    '',
    'Message:',
    p.message || '—',
  ];

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'AKASA enquiry — ' + (p.name || 'new lead'),
    body: lines.join('\n'),
  });
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
