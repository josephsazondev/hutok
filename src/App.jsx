import React, { useState, useEffect } from 'react';

const C = {
  bg: '#f7f7fb', surface: '#ffffff', navy: '#1a1a2e', navy2: '#2d2d4d',
  border: '#e8e8f0', divider: '#f0f0f5',
  ink: '#1a1a2e', sub: '#6e6e80', muted: '#9a9aab', hint: '#c4c4d0',
  paid: '#1aaa74', paidBg: '#e6f7f1', paidText: '#0f7a52',
  unpaid: '#e05252', unpaidBg: '#fde8e8', unpaidText: '#b83232',
  partial: '#d48a1a', partialBg: '#fef3e2', partialText: '#a06a10',
  accent: '#6c63ff', accentBg: '#eeecff', accentText: '#4a40cc',
  amortBg: '#f5f4ff',
};

const SH = {
  card: '0 1px 2px rgba(26,26,46,0.04), 0 6px 18px rgba(26,26,46,0.05)',
  sheet: '0 -10px 50px rgba(26,26,46,0.22)',
  nav: '0 -1px 24px rgba(26,26,46,0.07)',
  fab: '0 8px 22px rgba(26,26,46,0.32)',
  pop: '0 10px 34px rgba(26,26,46,0.14)',
};

// ── Icons (inline SVG, stroke-based) ─────────────────────────────────────────

const ICONS = {
  search:   <><circle cx="11" cy="11" r="7.5" /><path d="m21 21-4.3-4.3" /></>,
  plus:     <path d="M12 5v14M5 12h14" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
  wallet:   <><path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v0H5a2 2 0 0 0-2 2" /><path d="M3 7v10a2 2 0 0 0 2 2h13a2 2 0 0 0 2-2v-3" /><path d="M21 11h-4a2 2 0 0 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1z" /></>,
  list:     <><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" /></>,
  calendar: <><path d="M8 2v4M16 2v4M3 10h18" /><rect x="3" y="4" width="18" height="18" rx="2.5" /></>,
  receipt:  <><path d="M5 3v18l2-1.2L9 21l2-1.2L13 21l2-1.2L17 21l2-1.2V3l-2 1.2L15 3l-2 1.2L11 3 9 4.2 7 3z" /><path d="M9 8h6M9 12h6" /></>,
  repeat:   <><path d="m17 2 4 4-4 4" /><path d="M3 11v-1a4 4 0 0 1 4-4h14" /><path d="m7 22-4-4 4-4" /><path d="M21 13v1a4 4 0 0 1-4 4H3" /></>,
  bank:     <><path d="M3 21h18M4 10h16M5 10 12 4l7 6" /><path d="M6 10v8M10 10v8M14 10v8M18 10v8" /></>,
  chart:    <><path d="M3 3v17a1 1 0 0 0 1 1h17" /><path d="M7 15v-3M12 15V8M17 15v-5" /></>,
  edit:     <><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" /></>,
  move:     <><path d="M5 9 2 12l3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20" /></>,
  trash:    <><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M10 11v6M14 11v6" /></>,
  check:    <path d="M20 6 9 17l-5-5" />,
  close:    <path d="M18 6 6 18M6 6l12 12" />,
  chevron:  <path d="m9 18 6-6-6-6" />,
  sparkle:  <><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m6.3 6.3 2.4 2.4M15.3 15.3l2.4 2.4M17.7 6.3l-2.4 2.4M8.7 15.3l-2.4 2.4" /></>,
};

function Icon({ name, size = 20, color = 'currentColor', stroke = 1.9, fill = 'none', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={color}
      strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', flexShrink: 0, ...style }}>
      {ICONS[name]}
    </svg>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n) {
  return '₱' + Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function fmtCompact(n) {
  const v = Number(n || 0);
  if (v >= 1000) return '₱' + (v / 1000).toLocaleString('en-PH', { maximumFractionDigits: 1 }) + 'k';
  return '₱' + Math.round(v);
}
function todayStr() { return new Date().toISOString().slice(0, 10); }
function currentMonthStr() { return new Date().toISOString().slice(0, 7); }
function dateToMonth(s) { return s ? String(s).slice(0, 7) : ''; }
function addMonths(yyyymm, n) {
  const [y, m] = yyyymm.split('-').map(Number);
  const d = new Date(y, m - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}
function monthLabel(yyyymm) {
  const [y, m] = yyyymm.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-PH', { month: 'short', year: '2-digit' });
}
function periodLabel(yyyymm) {
  const [y, m] = yyyymm.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString('en-PH', { month: 'long', year: 'numeric' });
}
function fmtDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = String(iso).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
}
// Normalize a possibly date-coerced value back to a YYYY-MM period string.
function toPeriod(v) {
  if (!v) return '';
  return String(v).slice(0, 7);
}
// Per-year monthly rate overrides for amortizations (bank fixing periods).
function getRates(amort) {
  try { return amort && amort.ratesJson ? JSON.parse(amort.ratesJson) : {}; } catch { return {}; }
}
function rateForYear(amort, year) {
  const v = getRates(amort)[String(year)];
  return (v != null && v !== '') ? Number(v) : Number(amort.monthlyAmount || 0);
}
// Display title/subtitle for an entry — transactions show store/item;
// installment & amortization payments show the plan name + formatted month.
function entryTitle(e) {
  return e.entryType === 'transaction' ? e.store : (e.item || '');
}
function entrySubtitle(e) {
  if (e.entryType === 'transaction') return e.item || '';
  const p = toPeriod(e.store);
  return p ? periodLabel(p) : '';
}
function generateMonths(startDate, totalMonths) {
  const start = dateToMonth(startDate);
  if (!start) return [];
  return Array.from({ length: Number(totalMonths) }, (_, i) => addMonths(start, i));
}
function monthBounds(cm) {
  const [y, m] = cm.split('-').map(Number);
  const from = `${cm}-01`;
  const to = `${cm}-${String(new Date(y, m, 0).getDate()).padStart(2, '0')}`;
  return { from, to };
}
// Auto group label: "YYYY-MM #N" — N increments per month, unique across years.
function nextGroupLabel(groups) {
  const prefix = currentMonthStr();
  let max = 0;
  const re = new RegExp('^' + prefix + ' #(\\d+)');
  groups.forEach(g => {
    const m = String(g.label || '').match(re);
    if (m) max = Math.max(max, Number(m[1]));
  });
  return `${prefix} #${max + 1}`;
}

// ── API ───────────────────────────────────────────────────────────────────────

const SETTINGS_KEY = 'hutok_settings';
function getSettings() { try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); } catch { return {}; } }
function saveSettings(s) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); }

const api = {
  async get(type) {
    const { apiUrl, apiKey } = getSettings();
    if (!apiUrl) return null;
    const url = new URL(apiUrl);
    url.searchParams.set('type', type);
    url.searchParams.set('_t', Date.now());
    if (apiKey) url.searchParams.set('key', apiKey);
    const res = await fetch(url);
    const json = await res.json();
    if (json?.error) throw new Error(json.error);
    return json;
  },
  post(body) {
    const { apiUrl, apiKey } = getSettings();
    if (!apiUrl) return;
    const url = new URL(apiUrl);
    if (apiKey) url.searchParams.set('key', apiKey);
    fetch(url.toString(), { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => {});
  },
};

// Normalize server data so periods are always YYYY-MM and dates YYYY-MM-DD,
// even if Google Sheets coerced them into Date objects (returned as timestamps).
// This keeps payment-period matching reliable.
function normalizeData(d) {
  if (!d) return d;
  const dt = v => (v == null || v === '') ? v : String(v).slice(0, 10);
  return {
    groups: (d.groups || []).map(g => ({ ...g, dateFrom: dt(g.dateFrom), dateTo: dt(g.dateTo), createdAt: dt(g.createdAt) })),
    entries: (d.entries || []).map(e => ({ ...e, store: e.entryType !== 'transaction' ? toPeriod(e.store) : e.store, createdAt: dt(e.createdAt) })),
    installments: (d.installments || []).map(i => ({ ...i, startDate: dt(i.startDate), createdAt: dt(i.createdAt) })),
    payments: (d.payments || []).map(p => ({ ...p, period: toPeriod(p.period), createdAt: dt(p.createdAt), updatedAt: dt(p.updatedAt) })),
    amortizations: (d.amortizations || []).map(a => ({ ...a, startDate: dt(a.startDate), createdAt: dt(a.createdAt) })),
  };
}
function syncData(setData) {
  api.get('all').then(r => { if (r && !r.error) setData(normalizeData(r)); }).catch(() => {});
}

// ── Mock data (used when no API URL is configured) ───────────────────────────

const MOCK = {
  groups: [
    { groupId: 'G_2', label: '2026-06 #1', dateFrom: '2026-06-01', dateTo: '2026-06-30', createdAt: '2026-06-02' },
    { groupId: 'G_3', label: '2026-05 #2', dateFrom: '2026-05-01', dateTo: '2026-05-31', createdAt: '2026-05-26' },
    { groupId: 'G_4', label: '2026-05 #1', dateFrom: '2026-05-01', dateTo: '2026-05-31', createdAt: '2026-05-19' },
  ],
  entries: [
    { entryId: 'E_2',  groupId: 'G_2', store: 'SM Supermarket',  item: 'Groceries',         amount: 1850,  status: 'unpaid',  entryType: 'transaction',           linkedId: '', amountPaid: 0,    createdAt: '2026-06-03' },
    { entryId: 'E_3',  groupId: 'G_2', store: 'Meralco',         item: 'Electric bill',      amount: 3200,  status: 'paid',    entryType: 'transaction',           linkedId: '', amountPaid: 3200, createdAt: '2026-06-03' },
    { entryId: 'E_4',  groupId: 'G_2', store: '2026-06',         item: 'Aircon 1.5hp',       amount: 2500,  status: 'paid',    entryType: 'installment_payment',   linkedId: 'I_2', createdAt: '2026-06-04' },
    { entryId: 'E_5',  groupId: 'G_2', store: '2026-06',         item: 'House & lot',        amount: 8500,  status: 'paid',    entryType: 'amortization_payment',  linkedId: 'A_2', createdAt: '2026-06-04' },
    { entryId: 'E_6',  groupId: 'G_3', store: 'Jollibee',        item: 'Team lunch',         amount: 640,   status: 'paid',    entryType: 'transaction',           linkedId: '', amountPaid: 640,  createdAt: '2026-05-28' },
    { entryId: 'E_7',  groupId: 'G_3', store: 'Grab',            item: 'Rides',              amount: 420,   status: 'partial', entryType: 'transaction',           linkedId: '', amountPaid: 200,  createdAt: '2026-05-30' },
    { entryId: 'E_8',  groupId: 'G_3', store: '2026-05',         item: 'Aircon 1.5hp',       amount: 2500,  status: 'paid',    entryType: 'installment_payment',   linkedId: 'I_2', createdAt: '2026-05-29' },
    { entryId: 'E_9',  groupId: 'G_4', store: 'PLDT',            item: 'Internet bill',      amount: 1599,  status: 'paid',    entryType: 'transaction',           linkedId: '', amountPaid: 1599, createdAt: '2026-05-20' },
    { entryId: 'E_10', groupId: 'G_4', store: 'Cousin Ana',      item: 'Loan repayment',     amount: 5000,  status: 'unpaid',  entryType: 'transaction',           linkedId: '', amountPaid: 0,    createdAt: '2026-05-21' },
    { entryId: 'E_11', groupId: 'G_4', store: '2026-04',         item: 'Aircon 1.5hp',       amount: 1200,  status: 'partial', entryType: 'installment_payment',   linkedId: 'I_2', createdAt: '2026-05-22' },
  ],
  installments: [
    { installmentId: 'I_2', name: 'Aircon 1.5hp',    source: 'Abenson',         monthlyAmount: 2500, totalMonths: 12, startDate: '2026-01-01', createdAt: '2026-01-01' },
    { installmentId: 'I_3', name: 'Samsung Galaxy',  source: 'Samsung Store',   monthlyAmount: 1800, totalMonths: 6,  startDate: '2026-03-01', createdAt: '2026-03-01' },
  ],
  payments: [
    // Aircon — Jan–May paid, Apr partial, Jun paid
    { paymentId: 'P_2',  parentType: 'installment', parentId: 'I_2', period: '2026-01', amountPaid: 2500, expectedAmount: 2500, createdAt: '2026-01-15', updatedAt: '2026-01-15' },
    { paymentId: 'P_3',  parentType: 'installment', parentId: 'I_2', period: '2026-02', amountPaid: 2500, expectedAmount: 2500, createdAt: '2026-02-14', updatedAt: '2026-02-14' },
    { paymentId: 'P_4',  parentType: 'installment', parentId: 'I_2', period: '2026-03', amountPaid: 2500, expectedAmount: 2500, createdAt: '2026-03-10', updatedAt: '2026-03-10' },
    { paymentId: 'P_5',  parentType: 'installment', parentId: 'I_2', period: '2026-04', amountPaid: 1200, expectedAmount: 2500, createdAt: '2026-04-18', updatedAt: '2026-04-18' },
    { paymentId: 'P_6',  parentType: 'installment', parentId: 'I_2', period: '2026-05', amountPaid: 2500, expectedAmount: 2500, createdAt: '2026-05-12', updatedAt: '2026-05-12' },
    { paymentId: 'P_7',  parentType: 'installment', parentId: 'I_2', period: '2026-06', amountPaid: 2500, expectedAmount: 2500, createdAt: '2026-06-04', updatedAt: '2026-06-04' },
    // Samsung — Mar–Apr paid, May partial
    { paymentId: 'P_8',  parentType: 'installment', parentId: 'I_3', period: '2026-03', amountPaid: 1800, expectedAmount: 1800, createdAt: '2026-03-05', updatedAt: '2026-03-05' },
    { paymentId: 'P_9',  parentType: 'installment', parentId: 'I_3', period: '2026-04', amountPaid: 1800, expectedAmount: 1800, createdAt: '2026-04-05', updatedAt: '2026-04-05' },
    { paymentId: 'P_10', parentType: 'installment', parentId: 'I_3', period: '2026-05', amountPaid: 900,  expectedAmount: 1800, createdAt: '2026-05-06', updatedAt: '2026-05-06' },
    // Amortization — 2024 full, 2025 full, 2026 monthly
    { paymentId: 'P_11', parentType: 'amortization', parentId: 'A_2', period: '2024-01', amountPaid: 8500, expectedAmount: 8500, createdAt: '2024-01-10', updatedAt: '2024-01-10' },
    { paymentId: 'P_12', parentType: 'amortization', parentId: 'A_2', period: '2024-02', amountPaid: 8500, expectedAmount: 8500, createdAt: '2024-02-10', updatedAt: '2024-02-10' },
    { paymentId: 'P_13', parentType: 'amortization', parentId: 'A_2', period: '2024-03', amountPaid: 8500, expectedAmount: 8500, createdAt: '2024-03-10', updatedAt: '2024-03-10' },
    { paymentId: 'P_14', parentType: 'amortization', parentId: 'A_2', period: '2024-04', amountPaid: 8500, expectedAmount: 8500, createdAt: '2024-04-10', updatedAt: '2024-04-10' },
    { paymentId: 'P_15', parentType: 'amortization', parentId: 'A_2', period: '2024-05', amountPaid: 8500, expectedAmount: 8500, createdAt: '2024-05-10', updatedAt: '2024-05-10' },
    { paymentId: 'P_16', parentType: 'amortization', parentId: 'A_2', period: '2024-06', amountPaid: 8500, expectedAmount: 8500, createdAt: '2024-06-10', updatedAt: '2024-06-10' },
    { paymentId: 'P_17', parentType: 'amortization', parentId: 'A_2', period: '2024-07', amountPaid: 8500, expectedAmount: 8500, createdAt: '2024-07-10', updatedAt: '2024-07-10' },
    { paymentId: 'P_18', parentType: 'amortization', parentId: 'A_2', period: '2024-08', amountPaid: 8500, expectedAmount: 8500, createdAt: '2024-08-10', updatedAt: '2024-08-10' },
    { paymentId: 'P_19', parentType: 'amortization', parentId: 'A_2', period: '2024-09', amountPaid: 8500, expectedAmount: 8500, createdAt: '2024-09-10', updatedAt: '2024-09-10' },
    { paymentId: 'P_20', parentType: 'amortization', parentId: 'A_2', period: '2024-10', amountPaid: 8500, expectedAmount: 8500, createdAt: '2024-10-10', updatedAt: '2024-10-10' },
    { paymentId: 'P_21', parentType: 'amortization', parentId: 'A_2', period: '2024-11', amountPaid: 8500, expectedAmount: 8500, createdAt: '2024-11-10', updatedAt: '2024-11-10' },
    { paymentId: 'P_22', parentType: 'amortization', parentId: 'A_2', period: '2024-12', amountPaid: 8500, expectedAmount: 8500, createdAt: '2024-12-10', updatedAt: '2024-12-10' },
    { paymentId: 'P_23', parentType: 'amortization', parentId: 'A_2', period: '2025-01', amountPaid: 8500, expectedAmount: 8500, createdAt: '2025-01-10', updatedAt: '2025-01-10' },
    { paymentId: 'P_24', parentType: 'amortization', parentId: 'A_2', period: '2025-02', amountPaid: 8500, expectedAmount: 8500, createdAt: '2025-02-10', updatedAt: '2025-02-10' },
    { paymentId: 'P_25', parentType: 'amortization', parentId: 'A_2', period: '2025-03', amountPaid: 8500, expectedAmount: 8500, createdAt: '2025-03-10', updatedAt: '2025-03-10' },
    { paymentId: 'P_26', parentType: 'amortization', parentId: 'A_2', period: '2025-04', amountPaid: 8500, expectedAmount: 8500, createdAt: '2025-04-10', updatedAt: '2025-04-10' },
    { paymentId: 'P_27', parentType: 'amortization', parentId: 'A_2', period: '2025-05', amountPaid: 8500, expectedAmount: 8500, createdAt: '2025-05-10', updatedAt: '2025-05-10' },
    { paymentId: 'P_28', parentType: 'amortization', parentId: 'A_2', period: '2025-06', amountPaid: 8500, expectedAmount: 8500, createdAt: '2025-06-10', updatedAt: '2025-06-10' },
    { paymentId: 'P_29', parentType: 'amortization', parentId: 'A_2', period: '2025-07', amountPaid: 8500, expectedAmount: 8500, createdAt: '2025-07-10', updatedAt: '2025-07-10' },
    { paymentId: 'P_30', parentType: 'amortization', parentId: 'A_2', period: '2025-08', amountPaid: 8500, expectedAmount: 8500, createdAt: '2025-08-10', updatedAt: '2025-08-10' },
    { paymentId: 'P_31', parentType: 'amortization', parentId: 'A_2', period: '2025-09', amountPaid: 8500, expectedAmount: 8500, createdAt: '2025-09-10', updatedAt: '2025-09-10' },
    { paymentId: 'P_32', parentType: 'amortization', parentId: 'A_2', period: '2025-10', amountPaid: 8500, expectedAmount: 8500, createdAt: '2025-10-10', updatedAt: '2025-10-10' },
    { paymentId: 'P_33', parentType: 'amortization', parentId: 'A_2', period: '2025-11', amountPaid: 8500, expectedAmount: 8500, createdAt: '2025-11-10', updatedAt: '2025-11-10' },
    { paymentId: 'P_34', parentType: 'amortization', parentId: 'A_2', period: '2025-12', amountPaid: 8500, expectedAmount: 8500, createdAt: '2025-12-10', updatedAt: '2025-12-10' },
    { paymentId: 'P_35', parentType: 'amortization', parentId: 'A_2', period: '2026-01', amountPaid: 8500, expectedAmount: 8500, createdAt: '2026-01-10', updatedAt: '2026-01-10' },
    { paymentId: 'P_36', parentType: 'amortization', parentId: 'A_2', period: '2026-02', amountPaid: 8500, expectedAmount: 8500, createdAt: '2026-02-10', updatedAt: '2026-02-10' },
    { paymentId: 'P_37', parentType: 'amortization', parentId: 'A_2', period: '2026-03', amountPaid: 8500, expectedAmount: 8500, createdAt: '2026-03-10', updatedAt: '2026-03-10' },
    { paymentId: 'P_38', parentType: 'amortization', parentId: 'A_2', period: '2026-04', amountPaid: 8500, expectedAmount: 8500, createdAt: '2026-04-10', updatedAt: '2026-04-10' },
    { paymentId: 'P_39', parentType: 'amortization', parentId: 'A_2', period: '2026-05', amountPaid: 8500, expectedAmount: 8500, createdAt: '2026-05-10', updatedAt: '2026-05-10' },
    { paymentId: 'P_40', parentType: 'amortization', parentId: 'A_2', period: '2026-06', amountPaid: 8500, expectedAmount: 8500, createdAt: '2026-06-04', updatedAt: '2026-06-04' },
  ],
  amortizations: [
    { amortizationId: 'A_2', name: 'House & lot', lender: 'Pag-IBIG', monthlyAmount: 8500, totalYears: 20, startDate: '2024-01-01', principalAmount: 2040000, createdAt: '2024-01-01', ratesJson: '{"2027":9800,"2028":9800}' },
  ],
};

// ── Computed functions ────────────────────────────────────────────────────────

function groupTotal(groupId, entries) {
  return entries.filter(e => e.groupId === groupId).reduce((s, e) => s + Number(e.amount || 0), 0);
}
function isGroupFullyPaid(groupId, entries) {
  const g = entries.filter(e => e.groupId === groupId);
  return g.length > 0 && g.every(e => e.status === 'paid');
}
function getMonthStatus(parentId, period, payments) {
  const p = payments.find(p => p.parentId === parentId && p.period === period);
  if (p) {
    const paid = Number(p.amountPaid || 0), exp = Number(p.expectedAmount || 0);
    if (exp > 0 && paid >= exp) return 'full';
    if (paid > 0) return 'partial';
  }
  return period < currentMonthStr() ? 'overdue' : 'upcoming';
}
function getMonthPaid(parentId, period, payments) {
  const p = payments.find(p => p.parentId === parentId && p.period === period);
  return p ? Number(p.amountPaid || 0) : null;
}
function installmentProgress(inst, payments) {
  if (!inst) return { paid: 0, total: 0, paidMonths: 0, totalMonths: 0, pct: 0 };
  const rel = payments.filter(p => p.parentId === inst.installmentId && p.parentType === 'installment');
  const paid = rel.reduce((s, p) => s + Number(p.amountPaid || 0), 0);
  const total = Number(inst.monthlyAmount) * Number(inst.totalMonths);
  const paidMonths = rel.filter(p => Number(p.amountPaid) >= Number(p.expectedAmount) && Number(p.expectedAmount) > 0).length;
  return { paid, total, paidMonths, totalMonths: Number(inst.totalMonths), pct: total > 0 ? Math.min(100, (paid / total) * 100) : 0 };
}
function amortizationProgress(amort, payments) {
  if (!amort) return { paidAmount: 0, remaining: 0, paidYears: 0, totalYears: 0, pct: 0 };
  const rel = payments.filter(p => p.parentId === amort.amortizationId && p.parentType === 'amortization');
  const paidAmount = rel.reduce((s, p) => s + Number(p.amountPaid || 0), 0);
  const principal = Number(amort.principalAmount || 0);
  const remaining = Math.max(0, principal - paidAmount);
  const totalYears = Number(amort.totalYears);
  const startYear = Number((amort.startDate || '').slice(0, 4));
  let paidYears = 0;
  for (let y = 0; y < totalYears; y++) {
    const yr = startYear + y;
    const allDone = Array.from({ length: 12 }, (_, m) => `${yr}-${String(m + 1).padStart(2, '0')}`).every(period => {
      const p = rel.find(p => p.period === period);
      return p && Number(p.amountPaid) >= Number(p.expectedAmount) && Number(p.expectedAmount) > 0;
    });
    if (allDone) paidYears++;
  }
  return { paidAmount, remaining, paidYears, totalYears, pct: principal > 0 ? Math.min(100, (paidAmount / principal) * 100) : 0 };
}
function summaryStats(data) {
  const { entries, payments, installments, amortizations } = data;
  const cm = currentMonthStr();
  const outstanding = entries.filter(e => e.status === 'unpaid' || e.status === 'partial').reduce((s, e) => {
    const paid = (e.amountPaid === '' || e.amountPaid == null) ? 0 : Number(e.amountPaid);
    return s + Math.max(0, Number(e.amount || 0) - paid);
  }, 0);
  const paidThisMonth = entries.filter(e => e.status === 'paid' && String(e.createdAt || '').slice(0, 7) === cm).reduce((s, e) => s + Number(e.amount || 0), 0);
  const byType = {
    transactions: entries.filter(e => e.entryType === 'transaction').reduce((s, e) => s + Number(e.amount || 0), 0),
    installmentPayments: entries.filter(e => e.entryType === 'installment_payment').reduce((s, e) => s + Number(e.amount || 0), 0),
    amortizationPayments: entries.filter(e => e.entryType === 'amortization_payment').reduce((s, e) => s + Number(e.amount || 0), 0),
  };
  let overdueCount = 0;
  installments.forEach(inst => {
    generateMonths(inst.startDate, Number(inst.totalMonths)).forEach(period => {
      if (period < cm && getMonthStatus(inst.installmentId, period, payments) === 'overdue') overdueCount++;
    });
  });
  amortizations.forEach(amort => {
    generateMonths(amort.startDate, Number(amort.totalYears) * 12).forEach(period => {
      if (period < cm && getMonthStatus(amort.amortizationId, period, payments) === 'overdue') overdueCount++;
    });
  });
  return { outstanding, paidThisMonth, overdueCount, byType };
}

function getPaymentGroup(linkedId, period, entries, groups) {
  const e = entries.find(e => e.linkedId === linkedId && e.store === period);
  if (!e || !e.groupId) return null;
  return groups.find(g => g.groupId === e.groupId) || null;
}

// ── UI primitives ─────────────────────────────────────────────────────────────

function Badge({ status, type }) {
  if (type === 'installment_payment' || type === 'amortization_payment') {
    return <span style={badgeStyle(C.accentText, C.accentBg)}>
      {type === 'installment_payment' ? 'Installment' : 'Amortization'}
    </span>;
  }
  const map = { paid: [C.paidText, C.paidBg, 'Paid'], unpaid: [C.unpaidText, C.unpaidBg, 'Unpaid'], partial: [C.partialText, C.partialBg, 'Partial'] };
  const [color, bg, label] = map[status] || [C.muted, C.divider, status || ''];
  return <span style={badgeStyle(color, bg)}>{label}</span>;
}
function badgeStyle(color, bg) {
  return { display: 'inline-block', fontSize: 10, fontWeight: 700, color, background: bg, borderRadius: 7, padding: '3px 7px', letterSpacing: 0.2, lineHeight: 1.2 };
}

function IconTile({ name, fg, bg, size = 40, iconSize = 19 }) {
  return (
    <span style={{ width: size, height: size, borderRadius: 13, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon name={name} size={iconSize} color={fg} />
    </span>
  );
}

function IconButton({ name, onClick, solid }) {
  return (
    <button onClick={onClick} className="pressable" style={{
      width: 38, height: 38, borderRadius: 12, cursor: 'pointer',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: solid ? 'none' : `1px solid ${C.border}`,
      background: solid ? `linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 100%)` : C.surface,
      color: solid ? '#fff' : C.navy,
      boxShadow: solid ? SH.fab : SH.card,
    }}>
      <Icon name={name} size={20} stroke={2} />
    </button>
  );
}

function Header({ title, subtitle, onSearch, onAdd, onSettings }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 18px 12px' }}>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 23, fontWeight: 800, color: C.ink, letterSpacing: -0.5 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12.5, color: C.muted, marginTop: 1 }}>{subtitle}</div>}
      </div>
      <div style={{ display: 'flex', gap: 9, alignItems: 'center', flexShrink: 0 }}>
        {onSearch && <IconButton name="search" onClick={onSearch} />}
        {onSettings && <IconButton name="settings" onClick={onSettings} />}
        {onAdd && <IconButton name="plus" onClick={onAdd} solid />}
      </div>
    </div>
  );
}

function Sheet({ onClose, children, title }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} className="sheet-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(20,20,40,0.5)', backdropFilter: 'blur(2px)' }} />
      <div className="sheet-panel" style={{ position: 'relative', background: C.surface, borderRadius: '26px 26px 0 0', maxHeight: '92vh', overflowY: 'auto', paddingBottom: 'calc(28px + env(safe-area-inset-bottom))', boxShadow: SH.sheet, width: '100%', maxWidth: 390, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
          <div style={{ width: 38, height: 4.5, borderRadius: 99, background: C.border }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px 14px' }}>
          <span style={{ fontWeight: 800, fontSize: 18, color: C.ink, letterSpacing: -0.3 }}>{title}</span>
          <button onClick={onClose} className="pressable" style={{ background: C.divider, border: 'none', borderRadius: 10, width: 30, height: 30, color: C.sub, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="close" size={17} stroke={2.2} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ padding: '0 20px 14px' }}>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.sub, marginBottom: 7, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</label>
      {children}
    </div>
  );
}

const inp = { width: '100%', border: `1.5px solid ${C.border}`, borderRadius: 12, padding: '12px 14px', fontSize: 15, color: C.ink, background: '#fbfbfe', outline: 'none', fontFamily: 'Inter,sans-serif', appearance: 'none', transition: 'border-color .15s, box-shadow .15s' };
const btnNavy = { width: '100%', background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 100%)`, color: '#fff', border: 'none', borderRadius: 15, padding: 15, fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif', boxShadow: SH.fab, letterSpacing: -0.2 };
const btnGhost = { width: '100%', background: C.surface, color: C.sub, border: `1.5px solid ${C.border}`, borderRadius: 15, padding: 14, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 10, fontFamily: 'Inter,sans-serif' };
const cardStyle = { background: C.surface, borderRadius: 20, border: `1px solid ${C.border}`, boxShadow: SH.card, margin: '0 16px 14px', overflow: 'hidden' };
const editIconBtn = { width: 32, height: 32, borderRadius: 10, background: C.bg, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 };

function MoveButton({ onClick }) {
  return (
    <button onClick={onClick} className="pressable" style={{ display: 'flex', alignItems: 'center', gap: 5, background: C.accentBg, color: C.accentText, border: 'none', borderRadius: 99, padding: '6px 12px', fontSize: 11.5, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
      <Icon name="move" size={13} stroke={2.2} /> Move
    </button>
  );
}

function MonthCell({ parentId, period, payments }) {
  const status = getMonthStatus(parentId, period, payments);
  const paid = getMonthPaid(parentId, period, payments);
  const cfg = {
    full:     { bg: C.paidBg,    color: C.paidText,    icon: 'check', text: null },
    partial:  { bg: C.partialBg, color: C.partialText, icon: null, text: paid != null ? fmtCompact(paid) : '~' },
    overdue:  { bg: C.unpaidBg,  color: C.unpaidText,  icon: null, text: 'O/D' },
    upcoming: { bg: '#f4f4f9',   color: C.hint,        icon: null, text: '—' },
  }[status];
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 9, color: C.muted, marginBottom: 4, fontWeight: 600 }}>{monthLabel(period)}</div>
      <div style={{ background: cfg.bg, color: cfg.color, borderRadius: 9, padding: '6px 1px', fontSize: 10, fontWeight: 700, minHeight: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {cfg.icon ? <Icon name={cfg.icon} size={14} stroke={2.6} /> : cfg.text}
      </div>
    </div>
  );
}

const Legend = () => (
  <div style={{ display: 'flex', gap: 12, padding: '0 16px 14px', flexWrap: 'wrap' }}>
    {[['Full', C.paid], ['Partial', C.partial], ['Overdue', C.unpaid], ['Upcoming', C.hint]].map(([l, col]) => (
      <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: C.muted, fontWeight: 600 }}>
        <span style={{ width: 7, height: 7, borderRadius: 99, background: col }} /> {l}
      </span>
    ))}
  </div>
);

function ProgressBar({ pct, color }) {
  return (
    <div style={{ margin: '0 16px 12px', height: 6, background: C.divider, borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ width: pct + '%', height: '100%', background: color, borderRadius: 99, transition: 'width .4s ease' }} />
    </div>
  );
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div style={{ textAlign: 'center', padding: '56px 24px', animation: 'popIn .3s ease' }}>
      <div style={{ width: 72, height: 72, borderRadius: 22, background: C.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <Icon name={icon} size={32} color={C.accent} stroke={1.8} />
      </div>
      <div style={{ fontWeight: 700, fontSize: 16, color: C.ink }}>{title}</div>
      <div style={{ fontSize: 13.5, marginTop: 5, color: C.muted }}>{subtitle}</div>
    </div>
  );
}

function MoveGroupPicker({ groups, onPick }) {
  return (
    <div style={{ padding: '4px 16px 12px', borderTop: `1px solid ${C.divider}`, animation: 'popIn .2s ease' }}>
      {groups.length === 0 && <div style={{ fontSize: 12.5, color: C.muted, padding: '8px 0' }}>No groups yet.</div>}
      {groups.map(g => (
        <button key={g.groupId} onClick={() => onPick(g.groupId)} className="pressable" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', textAlign: 'left', padding: '11px 14px', marginTop: 7, borderRadius: 12, border: `1px solid ${C.border}`, background: '#fbfbfe', fontSize: 14, fontWeight: 600, color: C.ink, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
          {g.label} <Icon name="chevron" size={16} color={C.hint} />
        </button>
      ))}
    </div>
  );
}

// ── Add Entry Sheet ───────────────────────────────────────────────────────────

function AddEntrySheet({ data, setData, onClose, initEntry, prefill }) {
  const [type, setType] = useState(initEntry?.entryType || prefill?.entryType || 'transaction');
  const [store, setStore] = useState(initEntry?.entryType === 'transaction' ? (initEntry?.store || '') : '');
  const [item, setItem] = useState(initEntry?.entryType === 'transaction' ? (initEntry?.item || '') : '');
  const [amount, setAmount] = useState(initEntry ? String(initEntry.amount) : (prefill?.amount != null ? String(prefill.amount) : ''));
  const [status, setStatus] = useState(initEntry?.status || 'unpaid');
  const [txPaid, setTxPaid] = useState(initEntry?.entryType === 'transaction' && initEntry?.status === 'partial' ? String(initEntry?.amountPaid ?? '') : '');
  const [groupId, setGroupId] = useState(initEntry?.groupId || '');
  const [linkedId, setLinkedId] = useState(initEntry?.linkedId || prefill?.linkedId || '');
  const [period, setPeriod] = useState(
    initEntry && initEntry.entryType !== 'transaction' ? (toPeriod(initEntry.store) || currentMonthStr())
      : (prefill?.period || currentMonthStr())
  );
  const [newGroup, setNewGroup] = useState(false);
  const [newLabel, setNewLabel] = useState(() => nextGroupLabel(data.groups));

  // Prefill the amount with the plan's monthly amount when the user picks one.
  // (Done on select — not via effect — so editing an existing entry keeps its
  // actual amount, e.g. a partial payment, instead of being overwritten.)
  function changeLinked(id) {
    setLinkedId(id);
    if (!id) return;
    if (type === 'installment_payment') {
      const inst = data.installments.find(i => i.installmentId === id);
      if (inst) setAmount(String(inst.monthlyAmount));
    } else if (type === 'amortization_payment') {
      const amort = data.amortizations.find(a => a.amortizationId === id);
      if (amort) setAmount(String(rateForYear(amort, period.slice(0, 4))));
    }
  }

  function handleGroupChange(val) {
    if (val === '__new__') { setGroupId(''); setNewGroup(true); }
    else { setGroupId(val); setNewGroup(false); }
  }

  // Transaction amount/status — keep paid amount in sync with the total.
  function changeAmount(v) { setAmount(v); if (status === 'paid') setTxPaid(v); }
  function changeStatus(v) {
    setStatus(v);
    if (v === 'paid') setTxPaid(amount);
    else if (v === 'unpaid') setTxPaid('0');
  }

  function handleSave() {
    const today = todayStr();
    let finalGroupId = groupId;

    if (newGroup && newLabel) {
      const tempId = 'G_tmp_' + Date.now();
      const mb = monthBounds(currentMonthStr());
      const grp = { groupId: tempId, label: newLabel, dateFrom: mb.from, dateTo: mb.to, createdAt: today };
      setData(d => ({ ...d, groups: [grp, ...d.groups] }));
      api.post({ type: 'append_group', ...grp });
      finalGroupId = tempId;
    }

    if (type === 'transaction') {
      const total = Number(amount);
      const paid = status === 'paid' ? total : status === 'unpaid' ? 0 : Number(txPaid || 0);
      const entry = {
        entryId: initEntry ? initEntry.entryId : 'E_tmp_' + Date.now(),
        groupId: finalGroupId, store, item, amount: total, status, amountPaid: paid,
        entryType: 'transaction', linkedId: '', createdAt: initEntry ? initEntry.createdAt : today,
      };
      if (initEntry) {
        setData(d => ({ ...d, entries: d.entries.map(e => e.entryId === initEntry.entryId ? { ...e, ...entry } : e) }));
        api.post({ type: 'update_entry', rowId: initEntry.rowId || initEntry.entryId, ...entry });
      } else {
        setData(d => ({ ...d, entries: [entry, ...d.entries] }));
        api.post({ type: 'append_entry', ...entry });
      }
    } else {
      const parentType = type === 'installment_payment' ? 'installment' : 'amortization';
      const amtPaid = Number(amount);
      const parent = type === 'installment_payment'
        ? data.installments.find(i => i.installmentId === linkedId)
        : data.amortizations.find(a => a.amortizationId === linkedId);
      const expected = parent
        ? (type === 'amortization_payment' ? rateForYear(parent, period.slice(0, 4)) : Number(parent.monthlyAmount))
        : amtPaid;
      const derivedStatus = amtPaid >= expected && expected > 0 ? 'paid' : amtPaid > 0 ? 'partial' : 'unpaid';
      const parentName = parent ? parent.name : '';

      // Enforce a single record per (plan, period): keep the first match,
      // update it, and remove any duplicates left over from earlier bugs.
      const matchPmts = data.payments.filter(p => p.parentId === linkedId && toPeriod(p.period) === period);
      const existingPmt = matchPmts[0];
      const dupePmts = matchPmts.slice(1);
      const pmt = {
        paymentId: existingPmt ? existingPmt.paymentId : 'P_tmp_' + Date.now(),
        parentType, parentId: linkedId, period, amountPaid: amtPaid,
        expectedAmount: expected, createdAt: existingPmt ? existingPmt.createdAt : today, updatedAt: today,
      };
      if (existingPmt) api.post({ type: 'update_payment', rowId: existingPmt.rowId || existingPmt.paymentId, ...pmt });
      else api.post({ type: 'append_payment', ...pmt });
      dupePmts.forEach(p => api.post({ type: 'delete_payment', rowId: p.rowId || p.paymentId }));

      const matchEntries = data.entries.filter(e => e.linkedId === linkedId && toPeriod(e.store) === period && e.entryType === type);
      const existingEntry = matchEntries[0];
      const dupeEntries = matchEntries.slice(1);
      const entry = {
        entryId: existingEntry ? existingEntry.entryId : 'E_tmp_' + Date.now(),
        groupId: existingEntry ? (finalGroupId || existingEntry.groupId) : finalGroupId,
        store: period, item: parentName,
        amount: amtPaid, status: derivedStatus, entryType: type, linkedId,
        createdAt: existingEntry ? existingEntry.createdAt : today,
      };
      if (existingEntry) api.post({ type: 'update_entry', rowId: existingEntry.rowId || existingEntry.entryId, ...entry });
      else api.post({ type: 'append_entry', ...entry });
      dupeEntries.forEach(e => api.post({ type: 'delete_entry', rowId: e.rowId || e.entryId }));

      // Optimistic state update (dedupe locally too).
      setData(d => {
        const dropPmt = new Set(dupePmts.map(p => p.paymentId));
        let payments = d.payments.filter(p => !dropPmt.has(p.paymentId));
        payments = existingPmt
          ? payments.map(p => p.paymentId === existingPmt.paymentId ? { ...p, ...pmt } : p)
          : [...payments, pmt];
        const dropEntry = new Set(dupeEntries.map(e => e.entryId));
        let entries = d.entries.filter(e => !dropEntry.has(e.entryId));
        entries = existingEntry
          ? entries.map(e => e.entryId === existingEntry.entryId ? { ...e, ...entry } : e)
          : [...entries, entry];
        return { ...d, payments, entries };
      });
    }
    setTimeout(() => syncData(setData), 1500);
    onClose();
  }

  const types = [
    { key: 'transaction', label: 'Transaction', icon: 'receipt' },
    { key: 'installment_payment', label: 'Installment', icon: 'repeat' },
    { key: 'amortization_payment', label: 'Amortization', icon: 'bank' },
  ];

  return (
    <Sheet onClose={onClose} title={initEntry ? 'Edit entry' : 'Add entry'}>
      <div style={{ display: 'flex', gap: 9, padding: '0 20px 18px' }}>
        {types.map(o => {
          const active = type === o.key;
          return (
            <button key={o.key} onClick={() => setType(o.key)} className="pressable" style={{
              flex: 1, padding: '13px 4px 11px', borderRadius: 14, cursor: 'pointer', fontFamily: 'Inter,sans-serif',
              fontSize: 11, fontWeight: 700, textAlign: 'center',
              border: active ? `2px solid ${C.accent}` : `1.5px solid ${C.border}`,
              background: active ? C.accentBg : '#fbfbfe',
              color: active ? C.accentText : C.sub,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
            }}>
              <Icon name={o.icon} size={22} stroke={1.9} />{o.label}
            </button>
          );
        })}
      </div>

      {type === 'transaction' && <>
        <Field label="Store or person"><input style={inp} value={store} onChange={e => setStore(e.target.value)} placeholder="e.g. SM Supermarket" /></Field>
        <Field label="Item or description"><input style={inp} value={item} onChange={e => setItem(e.target.value)} placeholder="e.g. Groceries" /></Field>
        <Field label="Amount ₱"><input style={inp} type="number" value={amount} onChange={e => changeAmount(e.target.value)} placeholder="0.00" /></Field>
        <Field label="Status">
          <select style={inp} value={status} onChange={e => changeStatus(e.target.value)}>
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
          </select>
        </Field>
        {status === 'partial' && (
          <Field label="Amount paid ₱">
            <input style={inp} type="number" value={txPaid} onChange={e => setTxPaid(e.target.value)} placeholder="0.00" />
            {amount && txPaid !== '' && (
              <div style={{ fontSize: 11.5, color: C.muted, marginTop: 6 }}>Remaining: <span style={{ fontWeight: 700, color: C.unpaidText }}>{fmt(Math.max(0, Number(amount) - Number(txPaid)))}</span></div>
            )}
          </Field>
        )}
      </>}

      {type === 'installment_payment' && <>
        <Field label="Select installment">
          <select style={inp} value={linkedId} onChange={e => changeLinked(e.target.value)}>
            <option value="">— Choose —</option>
            {data.installments.map(i => <option key={i.installmentId} value={i.installmentId}>{i.name}</option>)}
          </select>
        </Field>
        <Field label="Month"><input style={inp} type="month" value={period} onChange={e => setPeriod(e.target.value)} /></Field>
        <Field label="Amount paid ₱"><input style={inp} type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" /></Field>
      </>}

      {type === 'amortization_payment' && <>
        <Field label="Select amortization">
          <select style={inp} value={linkedId} onChange={e => changeLinked(e.target.value)}>
            <option value="">— Choose —</option>
            {data.amortizations.map(a => <option key={a.amortizationId} value={a.amortizationId}>{a.name}</option>)}
          </select>
        </Field>
        <Field label="Month"><input style={inp} type="month" value={period} onChange={e => setPeriod(e.target.value)} /></Field>
        <Field label="Amount paid ₱"><input style={inp} type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" /></Field>
      </>}

      <Field label="Add to group">
        <select style={inp} value={newGroup ? '__new__' : groupId} onChange={e => handleGroupChange(e.target.value)}>
          <option value="">— No group —</option>
          {data.groups.map(g => <option key={g.groupId} value={g.groupId}>{g.label}</option>)}
          <option value="__new__">+ New group</option>
        </select>
      </Field>
      {newGroup && (
        <Field label="Group label"><input style={inp} value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="e.g. 2026-06 #1" /></Field>
      )}

      <div style={{ padding: '6px 20px 0' }}>
        <button style={btnNavy} className="pressable" onClick={handleSave}>{initEntry ? 'Save changes' : 'Save entry'}</button>
        <button style={btnGhost} className="pressable" onClick={onClose}>Cancel</button>
      </div>
    </Sheet>
  );
}

// ── Add Installment Sheet ─────────────────────────────────────────────────────

function AddInstallmentSheet({ data, setData, onClose, init }) {
  const [name, setName] = useState(init?.name || '');
  const [source, setSource] = useState(init?.source || '');
  const [monthlyAmount, setMonthlyAmount] = useState(init ? String(init.monthlyAmount) : '');
  const [totalMonths, setTotalMonths] = useState(init ? String(init.totalMonths) : '');
  const [startDate, setStartDate] = useState(init?.startDate || todayStr());

  function handleSave() {
    if (init) {
      const inst = { installmentId: init.installmentId, name, source, monthlyAmount: Number(monthlyAmount), totalMonths: Number(totalMonths), startDate, createdAt: init.createdAt };
      setData(d => ({ ...d, installments: d.installments.map(i => i.installmentId === init.installmentId ? { ...i, ...inst } : i) }));
      api.post({ type: 'update_installment', rowId: init.rowId || init.installmentId, ...inst });
    } else {
      const inst = { installmentId: 'I_tmp_' + Date.now(), name, source, monthlyAmount: Number(monthlyAmount), totalMonths: Number(totalMonths), startDate, createdAt: todayStr() };
      setData(d => ({ ...d, installments: [...d.installments, inst] }));
      api.post({ type: 'append_installment', ...inst });
    }
    setTimeout(() => syncData(setData), 1500);
    onClose();
  }

  return (
    <Sheet onClose={onClose} title={init ? 'Edit installment' : 'Add installment'}>
      <Field label="Name"><input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Aircon 1.5hp" /></Field>
      <Field label="Source / store"><input style={inp} value={source} onChange={e => setSource(e.target.value)} placeholder="e.g. Abenson" /></Field>
      <Field label="Monthly amount ₱"><input style={inp} type="number" value={monthlyAmount} onChange={e => setMonthlyAmount(e.target.value)} placeholder="0.00" /></Field>
      <Field label="Total months"><input style={inp} type="number" value={totalMonths} onChange={e => setTotalMonths(e.target.value)} placeholder="e.g. 12" /></Field>
      <Field label="Start date"><input style={inp} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></Field>
      <div style={{ padding: '6px 20px 0' }}>
        <button style={btnNavy} className="pressable" onClick={handleSave}>{init ? 'Save changes' : 'Add installment'}</button>
        <button style={btnGhost} className="pressable" onClick={onClose}>Cancel</button>
      </div>
    </Sheet>
  );
}

// ── Add Amortization Sheet ────────────────────────────────────────────────────

function AddAmortizationSheet({ data, setData, onClose, init }) {
  const [name, setName] = useState(init?.name || '');
  const [lender, setLender] = useState(init?.lender || '');
  const [monthlyAmount, setMonthlyAmount] = useState(init ? String(init.monthlyAmount) : '');
  const [totalYears, setTotalYears] = useState(init ? String(init.totalYears) : '');
  const [startDate, setStartDate] = useState(init?.startDate || todayStr());
  const [principalAmount, setPrincipalAmount] = useState(init ? String(init.principalAmount) : '');
  // Per-year monthly rate overrides, keyed by year string.
  const [rates, setRates] = useState(() => {
    const r = init ? getRates(init) : {};
    const o = {};
    Object.keys(r).forEach(k => { o[k] = String(r[k]); });
    return o;
  });

  const startYear = Number((startDate || '').slice(0, 4));
  const years = (startYear && Number(totalYears) > 0)
    ? Array.from({ length: Number(totalYears) }, (_, i) => String(startYear + i))
    : [];

  function setRate(yr, v) { setRates(s => ({ ...s, [yr]: v })); }

  function handleSave() {
    const ratesObj = {};
    Object.keys(rates).forEach(yr => {
      const v = rates[yr];
      if (v !== '' && v != null && !isNaN(Number(v))) ratesObj[yr] = Number(v);
    });
    const ratesJson = Object.keys(ratesObj).length ? JSON.stringify(ratesObj) : '';
    if (init) {
      const amort = { amortizationId: init.amortizationId, name, lender, monthlyAmount: Number(monthlyAmount), totalYears: Number(totalYears), startDate, principalAmount: Number(principalAmount), createdAt: init.createdAt, ratesJson };
      setData(d => ({ ...d, amortizations: d.amortizations.map(a => a.amortizationId === init.amortizationId ? { ...a, ...amort } : a) }));
      api.post({ type: 'update_amortization', rowId: init.rowId || init.amortizationId, ...amort });
    } else {
      const amort = { amortizationId: 'A_tmp_' + Date.now(), name, lender, monthlyAmount: Number(monthlyAmount), totalYears: Number(totalYears), startDate, principalAmount: Number(principalAmount), createdAt: todayStr(), ratesJson };
      setData(d => ({ ...d, amortizations: [...d.amortizations, amort] }));
      api.post({ type: 'append_amortization', ...amort });
    }
    setTimeout(() => syncData(setData), 1500);
    onClose();
  }

  return (
    <Sheet onClose={onClose} title={init ? 'Edit amortization' : 'Add amortization'}>
      <Field label="Name"><input style={inp} value={name} onChange={e => setName(e.target.value)} placeholder="e.g. House & lot" /></Field>
      <Field label="Lender"><input style={inp} value={lender} onChange={e => setLender(e.target.value)} placeholder="e.g. Pag-IBIG" /></Field>
      <Field label="Monthly amount ₱"><input style={inp} type="number" value={monthlyAmount} onChange={e => setMonthlyAmount(e.target.value)} placeholder="0.00" /></Field>
      <Field label="Total years"><input style={inp} type="number" value={totalYears} onChange={e => setTotalYears(e.target.value)} placeholder="e.g. 20" /></Field>
      <Field label="Start date"><input style={inp} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} /></Field>
      <Field label="Principal amount ₱"><input style={inp} type="number" value={principalAmount} onChange={e => setPrincipalAmount(e.target.value)} placeholder="0.00" /></Field>

      {years.length > 0 && (
        <div style={{ padding: '0 20px 14px' }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: C.sub, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Monthly rate per year</label>
          <div style={{ fontSize: 11.5, color: C.muted, marginBottom: 9 }}>Leave blank to use the base monthly amount. Override years where the rate changed.</div>
          <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
            {years.map((yr, i) => (
              <div key={yr} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderBottom: i === years.length - 1 ? 'none' : `1px solid ${C.divider}` }}>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, width: 48 }}>{yr}</span>
                <input style={{ ...inp, padding: '8px 12px' }} type="number" value={rates[yr] ?? ''} onChange={e => setRate(yr, e.target.value)} placeholder={monthlyAmount ? `${monthlyAmount} (base)` : '0.00'} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: '6px 20px 0' }}>
        <button style={btnNavy} className="pressable" onClick={handleSave}>{init ? 'Save changes' : 'Add amortization'}</button>
        <button style={btnGhost} className="pressable" onClick={onClose}>Cancel</button>
      </div>
    </Sheet>
  );
}

// ── Edit/Move Sheet ───────────────────────────────────────────────────────────

function EditMoveSheet({ entry, data, setData, onClose, onEdit }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showMove, setShowMove] = useState(false);
  const group = data.groups.find(g => g.groupId === entry.groupId);

  function handleMove(newGroupId) {
    const updated = { ...entry, groupId: newGroupId };
    setData(d => ({ ...d, entries: d.entries.map(e => e.entryId === entry.entryId ? updated : e) }));
    api.post({ type: 'move_entry', rowId: entry.rowId || entry.entryId, groupId: newGroupId });
    setTimeout(() => syncData(setData), 1500);
    onClose();
  }

  function handleDelete() {
    setData(d => ({ ...d, entries: d.entries.filter(e => e.entryId !== entry.entryId) }));
    api.post({ type: 'delete_entry', rowId: entry.rowId || entry.entryId });
    setTimeout(() => syncData(setData), 1500);
    onClose();
  }

  const row = (icon, label, fg, bg, onClick, danger) => (
    <button onClick={onClick} className="pressable" style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '11px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter,sans-serif' }}>
      <IconTile name={icon} fg={fg} bg={bg} size={40} iconSize={19} />
      <span style={{ fontSize: 15, fontWeight: 600, color: danger ? C.unpaid : C.ink }}>{label}</span>
    </button>
  );

  return (
    <Sheet onClose={onClose} title="Entry actions">
      <div style={{ margin: '0 20px 14px', padding: '14px 16px', background: C.bg, borderRadius: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 16, color: C.ink }}>{entryTitle(entry)}{entrySubtitle(entry) ? ` · ${entrySubtitle(entry)}` : ''}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{fmt(entry.amount)}</span>
          <Badge status={entry.status} type={entry.entryType} />
          <span style={{ fontSize: 12, color: C.muted, marginLeft: 'auto' }}>{group ? group.label : 'No group'}</span>
        </div>
      </div>

      {row('edit', 'Edit entry', C.accentText, C.accentBg, () => onEdit(entry))}
      {!showMove && row('move', 'Move to another group', C.paidText, C.paidBg, () => setShowMove(true))}
      {showMove && <MoveGroupPicker groups={data.groups} onPick={handleMove} />}
      {!confirmDelete && row('trash', 'Delete entry', C.unpaidText, C.unpaidBg, () => setConfirmDelete(true), true)}
      {confirmDelete && (
        <div style={{ padding: '4px 20px 8px' }}>
          <div style={{ fontSize: 14, color: C.unpaidText, fontWeight: 600, marginBottom: 12, padding: '10px 14px', background: C.unpaidBg, borderRadius: 12 }}>Delete this entry? This cannot be undone.</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleDelete} className="pressable" style={{ flex: 1, background: C.unpaid, color: '#fff', border: 'none', borderRadius: 12, padding: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Delete</button>
            <button onClick={() => setConfirmDelete(false)} className="pressable" style={{ flex: 1, background: C.divider, color: C.ink, border: 'none', borderRadius: 12, padding: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}
    </Sheet>
  );
}

// ── Group Actions Sheet (edit / delete) ───────────────────────────────────────

function GroupSheet({ group, data, setData, onClose }) {
  const [mode, setMode] = useState('menu'); // 'menu' | 'edit' | 'confirmDelete'
  const [label, setLabel] = useState(group.label || '');
  const entries = data.entries.filter(e => e.groupId === group.groupId);
  const total = groupTotal(group.groupId, data.entries);

  function handleSave() {
    const updated = { ...group, label };
    setData(d => ({ ...d, groups: d.groups.map(g => g.groupId === group.groupId ? updated : g) }));
    api.post({ type: 'update_group', rowId: group.groupId, groupId: group.groupId, label, dateFrom: group.dateFrom, dateTo: group.dateTo, createdAt: group.createdAt });
    setTimeout(() => syncData(setData), 1500);
    onClose();
  }

  function handleDelete() {
    setData(d => ({
      ...d,
      groups: d.groups.filter(g => g.groupId !== group.groupId),
      entries: d.entries.filter(e => e.groupId !== group.groupId),
    }));
    api.post({ type: 'delete_group', groupId: group.groupId });
    setTimeout(() => syncData(setData), 1500);
    onClose();
  }

  const row = (icon, lbl, fg, bg, onClick, danger) => (
    <button onClick={onClick} className="pressable" style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '11px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter,sans-serif' }}>
      <IconTile name={icon} fg={fg} bg={bg} size={40} iconSize={19} />
      <span style={{ fontSize: 15, fontWeight: 600, color: danger ? C.unpaid : C.ink }}>{lbl}</span>
    </button>
  );

  return (
    <Sheet onClose={onClose} title={mode === 'edit' ? 'Rename group' : 'Group actions'}>
      {mode !== 'edit' && (
        <div style={{ margin: '0 20px 14px', padding: '14px 16px', background: C.bg, borderRadius: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: C.ink }}>{group.label}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
            <span style={{ fontSize: 15, fontWeight: 800, color: C.ink }}>{fmt(total)}</span>
            <span style={{ fontSize: 12, color: C.muted }}>· {entries.length} {entries.length === 1 ? 'entry' : 'entries'}</span>
          </div>
        </div>
      )}

      {mode === 'menu' && <>
        {row('edit', 'Rename group', C.accentText, C.accentBg, () => setMode('edit'))}
        {row('trash', 'Delete group', C.unpaidText, C.unpaidBg, () => setMode('confirmDelete'), true)}
      </>}

      {mode === 'edit' && <>
        <Field label="Group label"><input style={inp} value={label} onChange={e => setLabel(e.target.value)} autoFocus /></Field>
        <div style={{ padding: '6px 20px 0' }}>
          <button style={btnNavy} className="pressable" onClick={handleSave}>Save changes</button>
          <button style={btnGhost} className="pressable" onClick={() => setMode('menu')}>Cancel</button>
        </div>
      </>}

      {mode === 'confirmDelete' && (
        <div style={{ padding: '4px 20px 8px' }}>
          <div style={{ fontSize: 14, color: C.unpaidText, fontWeight: 600, marginBottom: 12, padding: '12px 14px', background: C.unpaidBg, borderRadius: 12 }}>
            {entries.length > 0
              ? `Delete "${group.label}" and its ${entries.length} ${entries.length === 1 ? 'entry' : 'entries'}? This cannot be undone.`
              : `Delete "${group.label}"? This cannot be undone.`}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleDelete} className="pressable" style={{ flex: 1, background: C.unpaid, color: '#fff', border: 'none', borderRadius: 12, padding: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Delete</button>
            <button onClick={() => setMode('menu')} className="pressable" style={{ flex: 1, background: C.divider, color: C.ink, border: 'none', borderRadius: 12, padding: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>Cancel</button>
          </div>
        </div>
      )}
    </Sheet>
  );
}

// ── Settings Sheet ────────────────────────────────────────────────────────────

function SettingsSheet({ onClose }) {
  const [s, setS] = useState(getSettings);
  const [testResult, setTestResult] = useState(null);
  const [testing, setTesting] = useState(false);

  function upd(k, v) { const next = { ...s, [k]: v }; setS(next); saveSettings(next); }

  async function testConn() {
    setTesting(true); setTestResult(null);
    if (!s.apiUrl) { setTestResult({ ok: false, msg: 'No API URL configured' }); setTesting(false); return; }
    try {
      const url = s.apiUrl + (s.apiUrl.includes('?') ? '&' : '?') + 'type=ping' + (s.apiKey ? `&key=${encodeURIComponent(s.apiKey)}` : '');
      const r = await fetch(url);
      const j = await r.json();
      setTestResult(j.ok ? { ok: true, msg: 'Connected' } : { ok: false, msg: j.error || 'Unknown error' });
    } catch (e) {
      setTestResult({ ok: false, msg: 'Network error — ' + e.message });
    }
    setTesting(false);
  }

  return (
    <Sheet onClose={onClose} title="Settings">
      <Field label="API URL">
        <input style={inp} value={s.apiUrl || ''} onChange={e => upd('apiUrl', e.target.value)} placeholder="https://script.google.com/macros/s/…/exec" />
      </Field>
      <Field label="API Key (optional)">
        <input style={inp} value={s.apiKey || ''} onChange={e => upd('apiKey', e.target.value)} placeholder="Leave blank if not set" />
      </Field>
      <div style={{ padding: '6px 20px 16px' }}>
        <button style={{ ...btnNavy, opacity: testing ? 0.6 : 1 }} className="pressable" onClick={testConn} disabled={testing}>
          {testing ? 'Testing…' : 'Test connection'}
        </button>
        {testResult && (
          <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 9, background: testResult.ok ? C.paidBg : C.unpaidBg, color: testResult.ok ? C.paidText : C.unpaidText, fontSize: 14, fontWeight: 600 }}>
            <Icon name={testResult.ok ? 'check' : 'close'} size={17} stroke={2.4} /> {testResult.msg}
          </div>
        )}
      </div>
      <div style={{ textAlign: 'center', fontSize: 12, color: C.hint, padding: '0 20px', fontWeight: 600 }}>Hutok v1.0.0</div>
    </Sheet>
  );
}

// ── Groups Screen ─────────────────────────────────────────────────────────────

function GroupsScreen({ data, setData, openAddEntry, openEditEntry, openGroupActions, openSettings }) {
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');
  const [collapsed, setCollapsed] = useState(() => new Set());
  const toggleCollapse = id => setCollapsed(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const stats = summaryStats(data);
  const sorted = [...data.groups].sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')));
  const filtered = search ? sorted.filter(g => g.label.toLowerCase().includes(search.toLowerCase())) : sorted;

  return (
    <div className="screen">
      <Header title="My ledger" subtitle="Track what you owe" onSearch={() => setShowSearch(v => !v)} onSettings={openSettings} onAdd={openAddEntry} />

      {showSearch && (
        <div style={{ padding: '0 18px 12px' }}>
          <input style={inp} placeholder="Search groups…" value={search} onChange={e => setSearch(e.target.value)} autoFocus />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '0 16px 16px' }}>
        {[
          { l: 'Outstanding', v: fmt(stats.outstanding), col: C.unpaid, bg: C.unpaidBg, icon: 'wallet' },
          { l: 'Paid this month', v: fmt(stats.paidThisMonth), col: C.paid, bg: C.paidBg, icon: 'check' },
        ].map(s => (
          <div key={s.l} style={{ background: C.surface, borderRadius: 18, padding: '15px 16px', border: `1px solid ${C.border}`, boxShadow: SH.card }}>
            <span style={{ width: 32, height: 32, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Icon name={s.icon} size={17} color={s.col} stroke={2.1} />
            </span>
            <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 3 }}>{s.l}</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: s.col, letterSpacing: -0.3 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {filtered.map((group, gi) => {
        const entries = data.entries.filter(e => e.groupId === group.groupId);
        const total = groupTotal(group.groupId, data.entries);
        const allPaid = isGroupFullyPaid(group.groupId, data.entries);
        const tint = gi % 2 === 0 ? [C.accent, C.accentBg] : [C.paid, C.paidBg];
        return (
          <div key={group.groupId} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px 12px', gap: 12 }}>
              <button onClick={() => toggleCollapse(group.groupId)} className="pressable" style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter,sans-serif' }}>
                <IconTile name="calendar" fg={tint[0]} bg={tint[1]} size={42} iconSize={20} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 14.5, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{group.label}</div>
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{entries.length} {entries.length === 1 ? 'entry' : 'entries'}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: C.ink, letterSpacing: -0.3 }}>{fmt(total)}</div>
                  {allPaid && <div style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, color: C.paidText, fontWeight: 700, marginTop: 2 }}><Icon name="check" size={11} stroke={2.6} /> all paid</div>}
                </div>
                <Icon name="chevron" size={18} color={C.hint} style={{ flexShrink: 0, transform: collapsed.has(group.groupId) ? 'none' : 'rotate(90deg)', transition: 'transform .2s' }} />
              </button>
              <button onClick={() => openGroupActions(group)} className="pressable" style={editIconBtn}><Icon name="edit" size={16} color={C.muted} /></button>
            </div>
            {!collapsed.has(group.groupId) && entries.map(entry => {
              const dot = entry.status === 'paid' ? C.paid : entry.status === 'partial' ? C.partial : C.unpaid;
              return (
                <button key={entry.entryId} onClick={() => openEditEntry(entry)} className="pressable" style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '11px 16px', borderTop: `1px solid ${C.divider}`, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter,sans-serif' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', flexShrink: 0, marginRight: 12, background: dot, boxShadow: `0 0 0 3px ${dot}1f` }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entryTitle(entry)}</div>
                    <div style={{ fontSize: 11.5, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entrySubtitle(entry)}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700, color: C.ink }}>{fmt(entry.amount)}</div>
                    <div style={{ marginTop: 3 }}><Badge status={entry.status} type={entry.entryType} /></div>
                  </div>
                  <Icon name="chevron" size={16} color={C.hint} style={{ marginLeft: 8 }} />
                </button>
              );
            })}
            {!collapsed.has(group.groupId) && entries.length === 0 && <div style={{ padding: '14px 16px', borderTop: `1px solid ${C.divider}`, fontSize: 12.5, color: C.muted, textAlign: 'center' }}>No entries yet</div>}
          </div>
        );
      })}

      {filtered.length === 0 && <EmptyState icon="list" title="No groups yet" subtitle="Add your first entry to get started" />}

      <div style={{ padding: '6px 16px 16px' }}>
        <button style={{ ...btnNavy, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} className="pressable" onClick={openAddEntry}>
          <Icon name="plus" size={20} stroke={2.4} /> Add entry
        </button>
      </div>
    </div>
  );
}

// ── Detail sheet primitives ───────────────────────────────────────────────────

function DetailRow({ label, value, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: last ? 'none' : `1px solid ${C.divider}` }}>
      <span style={{ fontSize: 13, color: C.sub }}>{label}</span>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: C.ink, textAlign: 'right' }}>{value}</span>
    </div>
  );
}
function SectionLabel({ children }) {
  return <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.4, margin: '2px 20px 9px' }}>{children}</div>;
}
const detailCard = { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, margin: '0 16px 18px', overflow: 'hidden' };

function DetailHeader({ icon, fg, bg, title, sub, amount, amountColor, amountSub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, margin: '0 16px 16px', padding: '14px 16px', background: C.bg, borderRadius: 16 }}>
      <IconTile name={icon} fg={fg} bg={bg} size={46} iconSize={22} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 17, color: C.ink, letterSpacing: -0.3 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: C.muted, marginTop: 1 }}>{sub}</div>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 16, color: amountColor }}>{amount}</div>
        <div style={{ fontSize: 10.5, color: C.muted }}>{amountSub}</div>
      </div>
    </div>
  );
}

function ScheduleRow({ period, status, paid, expected, last, onClick }) {
  const cfg = {
    full:     ['Paid', C.paidText, C.paidBg],
    partial:  ['Partial', C.partialText, C.partialBg],
    overdue:  ['Overdue', C.unpaidText, C.unpaidBg],
    upcoming: ['Upcoming', C.hint, '#f4f4f9'],
  }[status];
  const shownPaid = (status === 'full' || status === 'partial') && paid != null;
  const inner = <>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>{period}</div>
      <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{shownPaid ? `${fmt(paid)} of ${fmt(expected)}` : `${fmt(expected)} due`}</div>
    </div>
    <span style={badgeStyle(cfg[1], cfg[2])}>{cfg[0]}</span>
    {onClick && <Icon name="chevron" size={15} color={C.hint} style={{ marginLeft: 8 }} />}
  </>;
  const base = { display: 'flex', alignItems: 'center', padding: '11px 16px', borderBottom: last ? 'none' : `1px solid ${C.divider}` };
  if (onClick) {
    return <button onClick={onClick} className="pressable" style={{ ...base, width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter,sans-serif' }}>{inner}</button>;
  }
  return <div style={base}>{inner}</div>;
}

// ── Installment Detail Sheet ──────────────────────────────────────────────────

function InstallmentDetailSheet({ inst, data, onClose, onEdit, onAddPayment }) {
  const prog = installmentProgress(inst, data.payments);
  const months = generateMonths(inst.startDate, Number(inst.totalMonths));
  const expected = Number(inst.monthlyAmount);
  return (
    <Sheet onClose={onClose} title="Installment details">
      <DetailHeader icon="repeat" fg={C.paid} bg={C.paidBg} title={inst.name} sub={inst.source}
        amount={fmt(prog.paid)} amountColor={prog.paid > 0 ? C.paid : C.unpaid} amountSub={`of ${fmt(prog.total)}`} />

      <div style={{ margin: '0 16px 6px' }}>
        <div style={{ height: 7, background: C.divider, borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ width: prog.pct + '%', height: '100%', background: C.paid, borderRadius: 99 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '7px 2px 16px', fontSize: 11.5, color: C.muted, fontWeight: 600 }}>
          <span>{prog.paidMonths} of {prog.totalMonths} months paid</span>
          <span>{Math.round(prog.pct)}%</span>
        </div>
      </div>

      <SectionLabel>Details</SectionLabel>
      <div style={detailCard}>
        <DetailRow label="Source / store" value={inst.source} />
        <DetailRow label="Monthly amount" value={fmt(inst.monthlyAmount)} />
        <DetailRow label="Total months" value={inst.totalMonths} />
        <DetailRow label="Total amount" value={fmt(prog.total)} />
        <DetailRow label="Remaining" value={fmt(Math.max(0, prog.total - prog.paid))} />
        <DetailRow label="Start date" value={fmtDate(inst.startDate)} />
        <DetailRow label="Added" value={fmtDate(inst.createdAt)} last />
      </div>

      <SectionLabel>Payment schedule · tap to record</SectionLabel>
      <div style={detailCard}>
        {months.map((period, i) => {
          const paid = getMonthPaid(inst.installmentId, period, data.payments);
          return (
            <ScheduleRow key={period} period={periodLabel(period)} status={getMonthStatus(inst.installmentId, period, data.payments)}
              paid={paid} expected={expected} last={i === months.length - 1}
              onClick={() => onAddPayment({ entryType: 'installment_payment', linkedId: inst.installmentId, period, amount: paid != null ? paid : expected })} />
          );
        })}
      </div>

      <div style={{ padding: '0 20px 0' }}>
        <button style={{ ...btnNavy, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} className="pressable" onClick={() => onEdit(inst)}>
          <Icon name="edit" size={18} stroke={2.2} /> Edit installment
        </button>
      </div>
    </Sheet>
  );
}

// ── Amortization Detail Sheet ─────────────────────────────────────────────────

function AmortizationDetailSheet({ amort, data, onClose, onEdit, onAddPayment }) {
  const prog = amortizationProgress(amort, data.payments);
  const curYear = String(new Date().getFullYear());
  const startYear = Number((amort.startDate || '').slice(0, 4));
  const years = Array.from({ length: Number(amort.totalYears) }, (_, i) => String(startYear + i));
  const [selectedYear, setSelectedYear] = useState(years.includes(curYear) ? curYear : years[years.length - 1]);
  const selectedMonths = Array.from({ length: 12 }, (_, m) => `${selectedYear}-${String(m + 1).padStart(2, '0')}`);
  const monthlyExpected = rateForYear(amort, selectedYear);

  function yearInfo(yr) {
    const rel = data.payments.filter(p => p.parentId === amort.amortizationId && String(p.period).slice(0, 4) === yr);
    const paid = rel.reduce((s, p) => s + Number(p.amountPaid || 0), 0);
    const fullMonths = rel.filter(p => Number(p.amountPaid) >= Number(p.expectedAmount) && Number(p.expectedAmount) > 0).length;
    let status;
    if (Number(yr) < Number(curYear)) status = fullMonths === 12 ? 'done' : 'past';
    else status = yr === curYear ? 'active' : 'upcoming';
    return { paid, status };
  }

  const sc = { done: ['Done', C.paidText, C.paidBg], active: ['Active', C.accentText, C.accentBg], upcoming: ['Upcoming', C.hint, '#f4f4f9'], past: ['Behind', C.unpaidText, C.unpaidBg] };

  return (
    <Sheet onClose={onClose} title="Loan details">
      <DetailHeader icon="bank" fg={C.accent} bg={C.accentBg} title={amort.name} sub={amort.lender}
        amount={fmt(prog.paidAmount)} amountColor={C.accent} amountSub={`of ${fmt(amort.principalAmount)}`} />

      <div style={{ margin: '0 16px 6px' }}>
        <div style={{ height: 7, background: C.divider, borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ width: prog.pct + '%', height: '100%', background: C.accent, borderRadius: 99 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '7px 2px 16px', fontSize: 11.5, color: C.muted, fontWeight: 600 }}>
          <span>Year {prog.paidYears + 1} of {prog.totalYears}</span>
          <span>{Math.round(prog.pct)}%</span>
        </div>
      </div>

      <SectionLabel>Details</SectionLabel>
      <div style={detailCard}>
        <DetailRow label="Lender" value={amort.lender} />
        <DetailRow label="Monthly amount" value={Object.keys(getRates(amort)).length ? `${fmt(amort.monthlyAmount)} · varies by year` : fmt(amort.monthlyAmount)} />
        <DetailRow label="Term" value={`${amort.totalYears} years`} />
        <DetailRow label="Principal" value={fmt(amort.principalAmount)} />
        <DetailRow label="Paid to date" value={fmt(prog.paidAmount)} />
        <DetailRow label="Remaining" value={fmt(prog.remaining)} />
        <DetailRow label="Start date" value={fmtDate(amort.startDate)} last />
      </div>

      <SectionLabel>Yearly breakdown · tap a year</SectionLabel>
      <div style={detailCard}>
        {years.map((yr, i) => {
          const info = yearInfo(yr);
          const c = sc[info.status];
          const active = yr === selectedYear;
          return (
            <button key={yr} onClick={() => setSelectedYear(yr)} className="pressable" style={{ display: 'flex', alignItems: 'center', width: '100%', padding: '11px 16px', borderBottom: i === years.length - 1 ? 'none' : `1px solid ${C.divider}`, background: active ? C.accentBg : 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter,sans-serif' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: active ? C.accentText : C.ink }}>{yr}</div>
                <div style={{ fontSize: 11, color: C.muted, marginTop: 1 }}>{fmt(info.paid)} of {fmt(rateForYear(amort, yr) * 12)}</div>
              </div>
              <span style={badgeStyle(c[1], c[2])}>{c[0]}</span>
              <Icon name="chevron" size={15} color={active ? C.accentText : C.hint} style={{ marginLeft: 8, transform: active ? 'rotate(90deg)' : 'none', transition: 'transform .15s' }} />
            </button>
          );
        })}
      </div>

      <SectionLabel>Monthly · {selectedYear} · tap to record</SectionLabel>
      <div style={detailCard}>
        {selectedMonths.map((period, i) => {
          const paid = getMonthPaid(amort.amortizationId, period, data.payments);
          return (
            <ScheduleRow key={period} period={periodLabel(period)} status={getMonthStatus(amort.amortizationId, period, data.payments)}
              paid={paid} expected={monthlyExpected} last={i === 11}
              onClick={() => onAddPayment({ entryType: 'amortization_payment', linkedId: amort.amortizationId, period, amount: paid != null ? paid : monthlyExpected })} />
          );
        })}
      </div>

      <div style={{ padding: '0 20px 0' }}>
        <button style={{ ...btnNavy, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} className="pressable" onClick={() => onEdit(amort)}>
          <Icon name="edit" size={18} stroke={2.2} /> Edit loan
        </button>
      </div>
    </Sheet>
  );
}

// ── Installment Card ──────────────────────────────────────────────────────────

function InstallmentCard({ inst, data, setData, onEdit, onOpen }) {
  const [showMove, setShowMove] = useState(false);
  const cm = currentMonthStr();
  const months = generateMonths(inst.startDate, Number(inst.totalMonths));
  const visibleMonths = months.filter(m => m <= addMonths(cm, 2)).slice(-6);
  const prog = installmentProgress(inst, data.payments);
  const assignedGroup = getPaymentGroup(inst.installmentId, cm, data.entries, data.groups);

  function handleMove(newGroupId) {
    const today = todayStr();
    const existingEntry = data.entries.find(e => e.linkedId === inst.installmentId && e.store === cm && e.entryType === 'installment_payment');
    const payment = data.payments.find(p => p.parentId === inst.installmentId && p.period === cm);
    const amtPaid = payment ? Number(payment.amountPaid) : 0;
    const expected = Number(inst.monthlyAmount);
    const derivedStatus = amtPaid >= expected && expected > 0 ? 'paid' : amtPaid > 0 ? 'partial' : 'unpaid';
    if (existingEntry) {
      const updated = { ...existingEntry, groupId: newGroupId };
      setData(d => ({ ...d, entries: d.entries.map(e => e.entryId === existingEntry.entryId ? updated : e) }));
      api.post({ type: 'move_entry', rowId: existingEntry.rowId || existingEntry.entryId, groupId: newGroupId });
    } else {
      const entry = { entryId: 'E_tmp_' + Date.now(), groupId: newGroupId, store: cm, item: inst.name, amount: amtPaid || expected, status: derivedStatus, entryType: 'installment_payment', linkedId: inst.installmentId, createdAt: today };
      setData(d => ({ ...d, entries: [...d.entries, entry] }));
      api.post({ type: 'append_entry', ...entry });
    }
    setTimeout(() => syncData(setData), 1500);
    setShowMove(false);
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px 12px', gap: 12 }}>
        <button onClick={() => onOpen(inst)} className="pressable" style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter,sans-serif' }}>
          <IconTile name="repeat" fg={C.paid} bg={C.paidBg} size={42} iconSize={20} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>{inst.name}</div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{inst.source} · {fmt(inst.monthlyAmount)}/mo · {inst.totalMonths} mo</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 14.5, color: prog.paid > 0 ? C.paid : C.unpaid }}>{fmt(prog.paid)}</div>
            <div style={{ fontSize: 10.5, color: C.muted }}>of {fmt(prog.total)}</div>
          </div>
        </button>
        <button onClick={() => onEdit(inst)} className="pressable" style={editIconBtn}><Icon name="edit" size={16} color={C.muted} /></button>
      </div>
      <ProgressBar pct={prog.pct} color={C.paid} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6, padding: '0 16px 12px' }}>
        {visibleMonths.map(period => <MonthCell key={period} parentId={inst.installmentId} period={period} payments={data.payments} />)}
      </div>
      <div style={{ borderTop: `1px solid ${C.divider}`, padding: '11px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12.5, color: assignedGroup ? C.sub : C.unpaidText, fontWeight: 600 }}>
          {assignedGroup ? assignedGroup.label : 'Unassigned'}
        </span>
        <MoveButton onClick={() => setShowMove(v => !v)} />
      </div>
      {showMove && <MoveGroupPicker groups={data.groups} onPick={handleMove} />}
      <Legend />
    </div>
  );
}

function InstallmentsScreen({ data, setData, openAddInstallment, openEditInstallment, openInstallmentDetail, openSettings }) {
  return (
    <div className="screen">
      <Header title="Installments" subtitle="Short-term monthly plans" onSettings={openSettings} onAdd={openAddInstallment} />
      {data.installments.map(inst => <InstallmentCard key={inst.installmentId} inst={inst} data={data} setData={setData} onEdit={openEditInstallment} onOpen={openInstallmentDetail} />)}
      {data.installments.length === 0 && <EmptyState icon="repeat" title="No installments yet" subtitle="Tap + to add one" />}
    </div>
  );
}

// ── Amortization Card ─────────────────────────────────────────────────────────

function AmortizationCard({ amort, data, setData, onEdit, onOpen }) {
  const [showMove, setShowMove] = useState(false);
  const cm = currentMonthStr();
  const curYear = String(new Date().getFullYear());
  const prog = amortizationProgress(amort, data.payments);
  const startYear = Number((amort.startDate || '').slice(0, 4));
  const allYears = Array.from({ length: Number(amort.totalYears) }, (_, i) => String(startYear + i));
  const curIdx = allYears.indexOf(curYear);
  const si = Math.max(0, Math.min(curIdx - 2, allYears.length - 5));
  const visibleYears = allYears.slice(si, si + 5);
  const activeMonths = Array.from({ length: 12 }, (_, m) => `${curYear}-${String(m + 1).padStart(2, '0')}`);
  const cmIdx = activeMonths.indexOf(cm);
  const visibleMonths = activeMonths.slice(Math.max(0, cmIdx - 3), cmIdx + 3 || 6);
  const assignedGroup = getPaymentGroup(amort.amortizationId, cm, data.entries, data.groups);

  function getYearStatus(yr) {
    if (Number(yr) < Number(curYear)) {
      const ok = Array.from({ length: 12 }, (_, m) => `${yr}-${String(m + 1).padStart(2, '0')}`).every(period => {
        const p = data.payments.find(p => p.parentId === amort.amortizationId && p.period === period);
        return p && Number(p.amountPaid) >= Number(p.expectedAmount) && Number(p.expectedAmount) > 0;
      });
      return ok ? 'done' : 'past';
    }
    return yr === curYear ? 'active' : 'upcoming';
  }

  function handleMove(newGroupId) {
    const today = todayStr();
    const existingEntry = data.entries.find(e => e.linkedId === amort.amortizationId && e.store === cm && e.entryType === 'amortization_payment');
    const payment = data.payments.find(p => p.parentId === amort.amortizationId && p.period === cm);
    const amtPaid = payment ? Number(payment.amountPaid) : 0;
    const expected = rateForYear(amort, cm.slice(0, 4));
    const derivedStatus = amtPaid >= expected && expected > 0 ? 'paid' : amtPaid > 0 ? 'partial' : 'unpaid';
    if (existingEntry) {
      const updated = { ...existingEntry, groupId: newGroupId };
      setData(d => ({ ...d, entries: d.entries.map(e => e.entryId === existingEntry.entryId ? updated : e) }));
      api.post({ type: 'move_entry', rowId: existingEntry.rowId || existingEntry.entryId, groupId: newGroupId });
    } else {
      const entry = { entryId: 'E_tmp_' + Date.now(), groupId: newGroupId, store: cm, item: amort.name, amount: amtPaid || expected, status: derivedStatus, entryType: 'amortization_payment', linkedId: amort.amortizationId, createdAt: today };
      setData(d => ({ ...d, entries: [...d.entries, entry] }));
      api.post({ type: 'append_entry', ...entry });
    }
    setTimeout(() => syncData(setData), 1500);
    setShowMove(false);
  }

  return (
    <div style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px 12px', gap: 12 }}>
        <button onClick={() => onOpen(amort)} className="pressable" style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0, background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left', fontFamily: 'Inter,sans-serif' }}>
          <IconTile name="bank" fg={C.accent} bg={C.accentBg} size={42} iconSize={20} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.ink }}>{amort.name}</div>
            <div style={{ fontSize: 11.5, color: C.muted, marginTop: 1 }}>{amort.lender}</div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 14.5, color: C.accent }}>{fmt(prog.paidAmount)}</div>
            <div style={{ fontSize: 10.5, color: C.muted }}>of {fmt(amort.principalAmount)}</div>
          </div>
        </button>
        <button onClick={() => onEdit(amort)} className="pressable" style={editIconBtn}><Icon name="edit" size={16} color={C.muted} /></button>
      </div>
      <ProgressBar pct={prog.pct} color={C.accent} />
      <div style={{ background: C.amortBg, margin: '0 16px 12px', borderRadius: 14, padding: '12px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <div>
          <div style={{ fontSize: 9.5, color: C.accentText, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 3 }}>Progress</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>Year {prog.paidYears + 1} of {prog.totalYears} · {Math.round(prog.pct)}%</div>
        </div>
        <div>
          <div style={{ fontSize: 9.5, color: C.accentText, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 3 }}>Remaining</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{fmt(prog.remaining)}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 6, padding: '0 16px 12px' }}>
        {visibleYears.map(yr => {
          const ys = getYearStatus(yr);
          const sc = { done: [C.paidBg, C.paidText], active: [C.accentBg, C.accentText], upcoming: ['#f4f4f9', C.hint], past: [C.unpaidBg, C.unpaidText] }[ys];
          return (
            <div key={yr} style={{ textAlign: 'center', background: sc[0], borderRadius: 9, padding: '7px 2px', fontSize: 11.5, fontWeight: 700, color: sc[1] }}>
              {yr.slice(2)}
            </div>
          );
        })}
      </div>
      <div style={{ padding: '0 16px 4px' }}>
        <div style={{ fontSize: 10, color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>Monthly · {curYear}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6, marginBottom: 12 }}>
          {visibleMonths.map(period => <MonthCell key={period} parentId={amort.amortizationId} period={period} payments={data.payments} />)}
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${C.divider}`, padding: '11px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 12.5, color: assignedGroup ? C.sub : C.unpaidText, fontWeight: 600 }}>
          {assignedGroup ? assignedGroup.label : 'Unassigned'}
        </span>
        <MoveButton onClick={() => setShowMove(v => !v)} />
      </div>
      {showMove && <MoveGroupPicker groups={data.groups} onPick={handleMove} />}
      <Legend />
    </div>
  );
}

function AmortizationScreen({ data, setData, openAddAmortization, openEditAmortization, openAmortizationDetail, openSettings }) {
  return (
    <div className="screen">
      <Header title="Amortization" subtitle="Long-term yearly loans" onSettings={openSettings} onAdd={openAddAmortization} />
      {data.amortizations.map(amort => <AmortizationCard key={amort.amortizationId} amort={amort} data={data} setData={setData} onEdit={openEditAmortization} onOpen={openAmortizationDetail} />)}
      {data.amortizations.length === 0 && <EmptyState icon="bank" title="No amortizations yet" subtitle="Tap + to add one" />}
    </div>
  );
}

// ── Summary Screen ────────────────────────────────────────────────────────────

function SummaryScreen({ data, openSettings }) {
  const stats = summaryStats(data);
  const topUnpaid = [...data.entries].filter(e => e.status === 'unpaid' || e.status === 'partial').sort((a, b) => Number(b.amount) - Number(a.amount)).slice(0, 5);
  return (
    <div className="screen">
      <Header title="Summary" subtitle="Your money at a glance" onSettings={openSettings} />
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
          {[
            { l: 'Outstanding', v: fmt(stats.outstanding), col: C.unpaid, bg: C.unpaidBg, icon: 'wallet' },
            { l: 'Paid this month', v: fmt(stats.paidThisMonth), col: C.paid, bg: C.paidBg, icon: 'check' },
          ].map(s => (
            <div key={s.l} style={{ background: C.surface, borderRadius: 18, padding: '15px 16px', border: `1px solid ${C.border}`, boxShadow: SH.card }}>
              <span style={{ width: 32, height: 32, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Icon name={s.icon} size={17} color={s.col} stroke={2.1} />
              </span>
              <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 3 }}>{s.l}</div>
              <div style={{ fontSize: 16.5, fontWeight: 800, color: s.col, letterSpacing: -0.3 }}>{s.v}</div>
            </div>
          ))}
        </div>

        <div style={{ background: C.surface, borderRadius: 18, padding: '15px 16px', border: `1px solid ${C.border}`, boxShadow: SH.card, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 13 }}>
          <span style={{ width: 38, height: 38, borderRadius: 12, background: stats.overdueCount ? C.unpaidBg : C.paidBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="calendar" size={19} color={stats.overdueCount ? C.unpaid : C.paid} stroke={2} />
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink }}>Overdue months</div>
            <div style={{ fontSize: 11.5, color: C.muted }}>across installments & loans</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: stats.overdueCount ? C.unpaid : C.paid }}>{stats.overdueCount}</div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.4, margin: '0 4px 10px' }}>By type</div>
        <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.border}`, boxShadow: SH.card, overflow: 'hidden', marginBottom: 20 }}>
          {[
            { l: 'Transactions', v: stats.byType.transactions, icon: 'receipt', col: C.sub },
            { l: 'Installment payments', v: stats.byType.installmentPayments, icon: 'repeat', col: C.accent },
            { l: 'Amortization payments', v: stats.byType.amortizationPayments, icon: 'bank', col: C.accent },
          ].map((r, i, arr) => (
            <div key={r.l} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', borderBottom: i < arr.length - 1 ? `1px solid ${C.divider}` : 'none' }}>
              <Icon name={r.icon} size={18} color={r.col} stroke={1.9} />
              <span style={{ fontSize: 14, color: C.ink, flex: 1 }}>{r.l}</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: C.ink }}>{fmt(r.v)}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.4, margin: '0 4px 10px' }}>Top unpaid items</div>
        {topUnpaid.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 14, color: C.paidText, fontWeight: 700, padding: '14px 16px', background: C.paidBg, borderRadius: 16 }}>
            <Icon name="sparkle" size={18} stroke={2} /> Nothing outstanding
          </div>
        ) : (
          <div style={{ background: C.surface, borderRadius: 18, border: `1px solid ${C.border}`, boxShadow: SH.card, overflow: 'hidden' }}>
            {topUnpaid.map((entry, i) => (
              <div key={entry.entryId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', borderBottom: i < topUnpaid.length - 1 ? `1px solid ${C.divider}` : 'none' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entryTitle(entry)}</div>
                  <div style={{ fontSize: 11.5, color: C.muted }}>{entrySubtitle(entry)}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 8 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 800, color: C.unpaid }}>{fmt(entry.amount)}</div>
                  <div style={{ marginTop: 3 }}><Badge status={entry.status} type={entry.entryType} /></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Bottom Nav ────────────────────────────────────────────────────────────────

function BottomNav({ tab, setTab }) {
  const tabs = [
    { key: 'groups', label: 'Groups', icon: 'list' },
    { key: 'installments', label: 'Payments', icon: 'repeat' },
    { key: 'amortization', label: 'Loans', icon: 'bank' },
    { key: 'summary', label: 'Summary', icon: 'chart' },
  ];
  return (
    <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 390, background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderTop: `1px solid ${C.border}`, display: 'flex', zIndex: 50, boxShadow: SH.nav, paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {tabs.map(t => {
        const active = tab === t.key;
        return (
          <button key={t.key} onClick={() => setTab(t.key)} style={{ flex: 1, padding: '9px 4px 9px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontFamily: 'Inter,sans-serif' }}>
            <span className="pressable" style={{ width: 44, height: 30, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? C.accentBg : 'transparent' }}>
              <Icon name={t.icon} size={21} color={active ? C.accentText : C.muted} stroke={active ? 2.2 : 1.9} />
            </span>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? C.ink : C.muted }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState('groups');
  const [data, setData] = useState({ groups: [], entries: [], installments: [], payments: [], amortizations: [] });
  const [loading, setLoading] = useState(true);
  const [sheet, setSheet] = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [groupTarget, setGroupTarget] = useState(null);
  const [prefill, setPrefill] = useState(null);

  useEffect(() => {
    const s = getSettings();
    if (!s.apiUrl) {
      setData(MOCK);
      setLoading(false);
      return;
    }
    api.get('all').then(r => { if (r && !r.error) setData(normalizeData(r)); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  function openEditEntry(entry) { setEditEntry(entry); setPrefill(null); setSheet('editEntry'); }
  function openAddEntry() { setEditEntry(null); setPrefill(null); setSheet('addEntry'); }
  function openEditInstallment(inst) { setEditItem(inst); setSheet('editInstallment'); }
  function openEditAmortization(amort) { setEditItem(amort); setSheet('editAmortization'); }
  function openInstallmentDetail(inst) { setEditItem(inst); setSheet('installmentDetail'); }
  function openAmortizationDetail(amort) { setEditItem(amort); setSheet('amortizationDetail'); }
  function openAddPayment(pf) { setEditEntry(null); setPrefill(pf); setSheet('addEntry'); }
  function openGroupActions(group) { setGroupTarget(group); setSheet('group'); }
  function openSettings() { setSheet('settings'); }
  function closeSheet() { setSheet(null); setEditEntry(null); setEditItem(null); setGroupTarget(null); setPrefill(null); }

  return (
    <div style={{ background: C.bg, minHeight: '100dvh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 390, minHeight: '100dvh', background: C.bg, position: 'relative', paddingBottom: 78 }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80dvh', gap: 18 }}>
            <span style={{ width: 60, height: 60, borderRadius: 19, background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navy2} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: SH.fab }}>
              <Icon name="wallet" size={30} color="#fff" stroke={1.9} />
            </span>
            <span className="spin" style={{ width: 22, height: 22, borderRadius: 99, border: `2.5px solid ${C.border}`, borderTopColor: C.accent }} />
          </div>
        ) : (
          <div style={{ overflowY: 'auto', paddingBottom: 20 }}>
            {tab === 'groups' && <GroupsScreen data={data} setData={setData} openAddEntry={openAddEntry} openEditEntry={openEditEntry} openGroupActions={openGroupActions} openSettings={openSettings} />}
            {tab === 'installments' && <InstallmentsScreen data={data} setData={setData} openAddInstallment={() => setSheet('addInstallment')} openEditInstallment={openEditInstallment} openInstallmentDetail={openInstallmentDetail} openSettings={openSettings} />}
            {tab === 'amortization' && <AmortizationScreen data={data} setData={setData} openAddAmortization={() => setSheet('addAmortization')} openEditAmortization={openEditAmortization} openAmortizationDetail={openAmortizationDetail} openSettings={openSettings} />}
            {tab === 'summary' && <SummaryScreen data={data} openSettings={openSettings} />}
          </div>
        )}

        <BottomNav tab={tab} setTab={setTab} />

        {(sheet === 'addEntry') && <AddEntrySheet data={data} setData={setData} initEntry={editEntry} prefill={prefill} onClose={closeSheet} />}
        {sheet === 'editEntry' && editEntry && <EditMoveSheet entry={editEntry} data={data} setData={setData} onClose={closeSheet} onEdit={entry => { setEditEntry(entry); setPrefill(null); setSheet('addEntry'); }} />}
        {sheet === 'addInstallment' && <AddInstallmentSheet data={data} setData={setData} onClose={closeSheet} />}
        {sheet === 'editInstallment' && editItem && <AddInstallmentSheet data={data} setData={setData} init={editItem} onClose={closeSheet} />}
        {sheet === 'installmentDetail' && editItem && <InstallmentDetailSheet inst={editItem} data={data} onClose={closeSheet} onEdit={() => setSheet('editInstallment')} onAddPayment={openAddPayment} />}
        {sheet === 'addAmortization' && <AddAmortizationSheet data={data} setData={setData} onClose={closeSheet} />}
        {sheet === 'editAmortization' && editItem && <AddAmortizationSheet data={data} setData={setData} init={editItem} onClose={closeSheet} />}
        {sheet === 'amortizationDetail' && editItem && <AmortizationDetailSheet amort={editItem} data={data} onClose={closeSheet} onEdit={() => setSheet('editAmortization')} onAddPayment={openAddPayment} />}
        {sheet === 'group' && groupTarget && <GroupSheet group={groupTarget} data={data} setData={setData} onClose={closeSheet} />}
        {sheet === 'settings' && <SettingsSheet onClose={closeSheet} />}
      </div>
    </div>
  );
}
