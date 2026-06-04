// Hutok — Google Apps Script backend
// Paste this entire file into Extensions → Apps Script in your Google Sheet
// Then deploy as Web App: Execute as Me, Anyone can access

var SHEETS = {
  groups:        'Groups',
  entries:       'Entries',
  installments:  'Installments',
  payments:      'Payments',
  amortizations: 'Amortizations',
  config:        'Config',
};

var HEADERS = {
  groups:        ['GroupId','Label','DateFrom','DateTo','CreatedAt'],
  entries:       ['EntryId','GroupId','Store','Item','Amount','Status','EntryType','LinkedId','CreatedAt','AmountPaid'],
  installments:  ['InstallmentId','Name','Source','MonthlyAmount','TotalMonths','StartDate','CreatedAt'],
  payments:      ['PaymentId','ParentType','ParentId','Period','AmountPaid','ExpectedAmount','CreatedAt','UpdatedAt'],
  amortizations: ['AmortizationId','Name','Lender','MonthlyAmount','TotalYears','StartDate','PrincipalAmount','CreatedAt'],
  config:        ['Key','Value','Description'],
};

var FIELDS = {
  groups:        { groupId:0, label:1, dateFrom:2, dateTo:3, createdAt:4 },
  entries:       { entryId:0, groupId:1, store:2, item:3, amount:4, status:5, entryType:6, linkedId:7, createdAt:8, amountPaid:9 },
  installments:  { installmentId:0, name:1, source:2, monthlyAmount:3, totalMonths:4, startDate:5, createdAt:6 },
  payments:      { paymentId:0, parentType:1, parentId:2, period:3, amountPaid:4, expectedAmount:5, createdAt:6, updatedAt:7 },
  amortizations: { amortizationId:0, name:1, lender:2, monthlyAmount:3, totalYears:4, startDate:5, principalAmount:6, createdAt:7 },
};

// ─── HTTP handlers ─────────────────────────────────────────────────────────

function doGet(e) {
  try {
    if (!authorized(e.parameter)) return out({ error: 'Unauthorized' });
    var type = e.parameter.type || 'all';
    if (type === 'ping') return out({ ok: true });
    if (type === 'all') return out({
      groups:        readEntries('groups'),
      entries:       readEntries('entries'),
      installments:  readEntries('installments'),
      payments:      readEntries('payments'),
      amortizations: readEntries('amortizations'),
    });
    return out({ error: 'Unknown type: ' + type });
  } catch (err) {
    return out({ error: String(err && err.message ? err.message : err) });
  }
}

function doPost(e) {
  try {
    if (!authorized(e.parameter || {})) return out({ error: 'Unauthorized' });
    var d = JSON.parse(e.postData.contents);
    var today = new Date().toISOString().slice(0, 10);

    if (d.type === 'append_group')         { d.createdAt = today; appendEntry('groups', d); }
    else if (d.type === 'append_entry')    { d.createdAt = today; appendEntry('entries', d); }
    else if (d.type === 'append_installment') { d.createdAt = today; appendEntry('installments', d); }
    else if (d.type === 'append_payment')  { d.createdAt = today; d.updatedAt = today; appendEntry('payments', d); }
    else if (d.type === 'append_amortization') { d.createdAt = today; appendEntry('amortizations', d); }
    else if (d.type === 'update_entry')    { updateEntry('entries', d.rowId, d); }
    else if (d.type === 'update_payment')  { d.updatedAt = today; updateEntry('payments', d.rowId, d); }
    else if (d.type === 'update_installment')  { updateEntry('installments', d.rowId, d); }
    else if (d.type === 'update_amortization') { updateEntry('amortizations', d.rowId, d); }
    else if (d.type === 'delete_entry')    { deleteEntry('entries', d.rowId); }
    else if (d.type === 'delete_payment')  { deleteEntry('payments', d.rowId); }
    else if (d.type === 'move_entry')      { moveEntry(d.rowId, d.groupId); }
    else if (d.type === 'update_group')    { updateGroupRow(d.groupId, d); }
    else if (d.type === 'delete_group')    { deleteGroupCascade(d.groupId); }
    else return out({ error: 'Unknown type: ' + d.type });

    return out({ ok: true });
  } catch (err) {
    return out({ error: String(err && err.message ? err.message : err) });
  }
}

function out(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── Move entry (update GroupId + UpdatedAt only) ───────────────────────────

function moveEntry(rowId, newGroupId) {
  var rowNum = parseInt(String(rowId).split('_')[1], 10);
  var sheet = getSheet('entries');
  if (rowNum < 2 || rowNum > sheet.getLastRow()) throw new Error('Row not found: ' + rowId);
  // GroupId is column 2 (index 1) — 1-indexed for setValues
  sheet.getRange(rowNum, 2).setValue(newGroupId);
}

// ─── Group edit / delete (matched by GroupId value, not row number) ──────────
// Entries reference a group by its GroupId column value, so we match on that —
// this is robust even if the stored id differs from the spreadsheet row number.

function findRowNumByValue(key, fieldKey, value) {
  var col = FIELDS[key][fieldKey];
  var rows = getRows(key);
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i].row[col]) === String(value)) return rows[i].rowNum;
  }
  return -1;
}

function updateGroupRow(groupId, d) {
  var rowNum = findRowNumByValue('groups', 'groupId', groupId);
  if (rowNum < 2) throw new Error('Group not found: ' + groupId);
  writeRowAsText(getSheet('groups'), rowNum, 'groups', d);
}

function deleteGroupCascade(groupId) {
  // Delete all entries belonging to this group (bottom-up to avoid row shifts).
  var entriesSheet = getSheet('entries');
  var entryRows = getRows('entries')
    .filter(function(e) { return String(e.row[FIELDS.entries.groupId]) === String(groupId); })
    .map(function(e) { return e.rowNum; })
    .sort(function(a, b) { return b - a; });
  entryRows.forEach(function(rn) { entriesSheet.deleteRow(rn); });

  // Then delete the group row itself.
  var rowNum = findRowNumByValue('groups', 'groupId', groupId);
  if (rowNum >= 2) getSheet('groups').deleteRow(rowNum);
}

// ─── Generic helpers (from TECH_TEMPLATE) ──────────────────────────────────

function getSpreadsheet() {
  var bound = SpreadsheetApp.getActiveSpreadsheet();
  if (bound) return bound;
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new Error('No bound spreadsheet and no SHEET_ID property');
  return SpreadsheetApp.openById(id);
}

function getSheet(key) {
  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName(SHEETS[key]);
  if (!sheet) {
    sheet = ss.insertSheet(SHEETS[key]);
    sheet.appendRow(HEADERS[key]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function getRows(key) {
  var sheet = getSheet(key);
  if (sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn())
    .getValues()
    .map(function(row, i) { return { row: row, rowNum: i + 2 }; })
    .filter(function(e) { return e.row[0] !== '' && e.row[0] != null; });
}

function readEntries(key) {
  var map = FIELDS[key];
  var tz = getSpreadsheet().getSpreadsheetTimeZone();
  return getRows(key).map(function(e) {
    var o = { rowId: key.charAt(0).toUpperCase() + '_' + e.rowNum };
    Object.keys(map).forEach(function(f) {
      var v = e.row[map[f]];
      // If Sheets coerced a date/period into a Date, return a clean string in
      // the sheet's timezone (no UTC shift, no timestamp).
      if (Object.prototype.toString.call(v) === '[object Date]') {
        v = Utilities.formatDate(v, tz, 'yyyy-MM-dd');
      }
      o[f] = v;
    });
    return o;
  });
}

// Writes a row as PLAIN TEXT so Google Sheets never coerces values like
// "2026-06" (period) or "2026-06-01" (dates) into Date objects — which would
// otherwise come back as full ISO timestamps and break period matching.
function writeRowAsText(sheet, rowNum, key, d) {
  var map = FIELDS[key];
  var width = HEADERS[key].length;
  var row = Array(width).fill('');
  Object.keys(map).forEach(function(f) {
    if (f in d && d[f] != null) row[map[f]] = String(d[f]);
  });
  var range = sheet.getRange(rowNum, 1, 1, width);
  range.setNumberFormat('@'); // plain text
  range.setValues([row]);
}

function appendEntry(key, d) {
  var sheet = getSheet(key);
  writeRowAsText(sheet, sheet.getLastRow() + 1, key, d);
}

function updateEntry(key, rowId, d) {
  var rowNum = parseInt(String(rowId).split('_')[1], 10);
  var sheet = getSheet(key);
  if (rowNum < 2 || rowNum > sheet.getLastRow()) throw new Error('Row not found: ' + rowId);
  writeRowAsText(sheet, rowNum, key, d);
}

function deleteEntry(key, rowId) {
  var rowNum = parseInt(String(rowId).split('_')[1], 10);
  var sheet = getSheet(key);
  if (rowNum >= 2 && rowNum <= sheet.getLastRow()) sheet.deleteRow(rowNum);
}

function authorized(params) {
  var key = (getConfig().api_key || '').trim();
  return !key || (params.key || '') === key;
}

function getConfig() {
  try {
    var cache = CacheService.getScriptCache();
    var hit = cache.get('hutok_config');
    if (hit) return JSON.parse(hit);
    var sheet = getSheet('config');
    var config = {};
    if (sheet.getLastRow() > 1) {
      sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues().forEach(function(r) {
        if (r[0]) config[String(r[0]).trim()] = String(r[1]).trim();
      });
    }
    cache.put('hutok_config', JSON.stringify(config), 300);
    return config;
  } catch (e) {
    return {};
  }
}
