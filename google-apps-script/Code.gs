/**
 * 記帳後端 — 秋の名古屋と最高イルマ 2026
 *
 * 安裝方式：在試算表裡「擴充功能 → Apps Script」開啟（這樣才是容器繫結指令碼，
 * SpreadsheetApp.getActiveSpreadsheet() 才抓得到這份檔案），把本檔內容整份貼進去，
 * 再「部署 → 新增部署作業 → 網頁應用程式」：
 *   執行身分：我
 *   誰可以存取：所有人
 * 部署後拿到的 /exec 網址填進 App 的 .env（VITE_GOOGLE_SCRIPT_URL）。
 *
 * ── 前端契約（views/CostView.tsx、App.tsx）──
 * GET  ?sheetName=<分頁名>            → { data: [ {rowIndex, date, item, payer, twd, jpy,
 *                                        note, splitType, splitXiang*, splitQian*} ] }
 * GET  ?sheetName=<分頁名>&action=inspect → 回傳前 3 列原始內容，用來核對欄位順序
 * POST { action:'add'|'edit'|'delete', ... } → { result:'success' }
 *
 * 前端只收 rowIndex >= 3 的列，所以第 1 列是標題、第 2 列是欄位名、第 3 列起是資料。
 */

/** 欄位對應，已對照 2026名古屋 分頁第 2 列的實際表頭（1 = A 欄）。 */
var COL = {
  date: 1,             // A 時間
  item: 2,             // B 項目
  payer: 3,            // C 付款者（想想 / Yian）
  twd: 4,              // D 台幣
  jpy: 5,              // E 日幣
  splitXiangTwd: 6,    // F 想想（台）
  splitXiangJpy: 7,    // G 想想（日）
  splitQianTwd: 8,     // H Yian（台）
  splitQianJpy: 9,     // I Yian（日）
  note: 10,            // J 備註
  splitType: 11,       // K 分帳方式 — 原本沒有這欄，寫入時自動補表頭
};

var SPLIT_TYPE_HEADER = '分帳方式';
var HEADER_ROW = 2;

var FIRST_DATA_ROW = 3;
var LAST_COL = 11;

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = name ? ss.getSheetByName(name) : ss.getSheets()[0];
  if (!sheet) {
    var names = ss.getSheets().map(function (s) { return s.getName(); });
    throw new Error('找不到分頁「' + name + '」。這份試算表現有的分頁：' + names.join('、'));
  }
  return sheet;
}

function num_(v) {
  if (v === '' || v === null || v === undefined) return 0;
  var n = Number(String(v).replace(/[^0-9.\-]/g, ''));
  return isNaN(n) ? 0 : n;
}

/** 日期一律輸出成 YYYY/MM/DD，前端用 new Date() 解析後排序 */
function dateOut_(v) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy/MM/dd');
  }
  return String(v || '');
}

function doGet(e) {
  try {
    var params = (e && e.parameter) || {};
    var sheet = getSheet_(params.sheetName);

    if (params.action === 'inspect') {
      var peek = sheet.getRange(1, 1, Math.min(3, sheet.getLastRow() || 1), LAST_COL).getDisplayValues();
      return json_({
        sheetName: sheet.getName(),
        allSheets: SpreadsheetApp.getActiveSpreadsheet().getSheets().map(function (s) { return s.getName(); }),
        lastRow: sheet.getLastRow(),
        firstRows: peek,
      });
    }

    var lastRow = sheet.getLastRow();
    if (lastRow < FIRST_DATA_ROW) return json_({ data: [] });

    var values = sheet
      .getRange(FIRST_DATA_ROW, 1, lastRow - FIRST_DATA_ROW + 1, LAST_COL)
      .getValues();

    var data = [];
    for (var i = 0; i < values.length; i++) {
      var row = values[i];
      // 整列空白就跳過（中間被刪掉的列）
      if (!row[COL.date - 1] && !row[COL.item - 1]) continue;
      data.push({
        rowIndex: FIRST_DATA_ROW + i,
        date: dateOut_(row[COL.date - 1]),
        item: String(row[COL.item - 1] || ''),
        payer: String(row[COL.payer - 1] || ''),
        twd: num_(row[COL.twd - 1]),
        jpy: num_(row[COL.jpy - 1]),
        note: String(row[COL.note - 1] || ''),
        splitType: String(row[COL.splitType - 1] || ''),
        splitXiangTwd: num_(row[COL.splitXiangTwd - 1]),
        splitXiangJpy: num_(row[COL.splitXiangJpy - 1]),
        splitQianTwd: num_(row[COL.splitQianTwd - 1]),
        splitQianJpy: num_(row[COL.splitQianJpy - 1]),
      });
    }
    return json_({ data: data });
  } catch (err) {
    return json_({ status: 'error', message: String(err && err.message ? err.message : err) });
  }
}

/** K 欄原本不存在，第一次寫入時把表頭補上，避免試算表出現無標題欄位 */
function ensureSplitTypeHeader_(sheet) {
  var cell = sheet.getRange(HEADER_ROW, COL.splitType);
  if (!String(cell.getValue()).trim()) cell.setValue(SPLIT_TYPE_HEADER);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var body = JSON.parse(e.postData.contents);
    var sheet = getSheet_(body.sheetName);

    if (body.action === 'delete') {
      var target = Number(body.rowIndex);
      if (!(target >= FIRST_DATA_ROW)) throw new Error('rowIndex 不合法：' + body.rowIndex);
      sheet.deleteRow(target);
      return json_({ result: 'success' });
    }

    var values = [];
    values[COL.date - 1] = body.date || '';
    values[COL.item - 1] = body.item || '';
    values[COL.payer - 1] = body.payer || '';
    values[COL.twd - 1] = num_(body.amountTwd);
    values[COL.jpy - 1] = num_(body.amountJpy);
    values[COL.note - 1] = body.note || '';
    values[COL.splitType - 1] = body.splitType || 'equal';
    values[COL.splitXiangTwd - 1] = num_(body.splitXiangTwd);
    values[COL.splitXiangJpy - 1] = num_(body.splitXiangJpy);
    values[COL.splitQianTwd - 1] = num_(body.splitQianTwd);
    values[COL.splitQianJpy - 1] = num_(body.splitQianJpy);
    for (var c = 0; c < LAST_COL; c++) if (values[c] === undefined) values[c] = '';

    ensureSplitTypeHeader_(sheet);

    if (body.action === 'edit') {
      var editRow = Number(body.rowIndex);
      if (!(editRow >= FIRST_DATA_ROW)) throw new Error('rowIndex 不合法：' + body.rowIndex);
      sheet.getRange(editRow, 1, 1, LAST_COL).setValues([values]);
      return json_({ result: 'success' });
    }

    // add：附加在最後一列之後，但至少從 FIRST_DATA_ROW 開始
    var appendRow = Math.max(sheet.getLastRow() + 1, FIRST_DATA_ROW);
    sheet.getRange(appendRow, 1, 1, LAST_COL).setValues([values]);
    return json_({ result: 'success', rowIndex: appendRow });
  } catch (err) {
    return json_({ result: 'error', status: 'error', message: String(err && err.message ? err.message : err) });
  } finally {
    lock.releaseLock();
  }
}
