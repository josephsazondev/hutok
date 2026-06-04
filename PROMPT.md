# Hutok — Build Prompt for Claude Code

## App name
**Hutok** — a Filipino word for being weighed down by financial obligations. The app helps you track, manage, and eventually clear everything you owe.

---

## What to build

A mobile-first PWA called **Hutok** for personal transaction and installment tracking. Built with React 18 + Vite, styled with inline CSS-in-JS only (no external UI libraries), backed by Google Apps Script + Google Sheets, and deployed to GitHub Pages.

Follow the `TECH_TEMPLATE.md` file exactly for all architecture decisions, file structure, API patterns, and deployment config. Do not deviate from its conventions.

---

## Tech stack (from TECH_TEMPLATE.md)
- React 18 + Vite, single-file: `src/App.jsx`
- No external UI libraries — vanilla React + inline styles in a `const S = {}` object
- Google Apps Script backend (see `Code.gs` spec below)
- PWA: `public/manifest.json` + `public/sw.js`
- GitHub Actions deploy to `gh-pages` branch
- `localStorage` for settings and cache

---

## Design system

Use Inter font (load via Google Fonts in `index.html`). All styling in a `const C` (colors) and `const S` (styles) object inside `App.jsx`.

```js
const C = {
  bg:       '#f7f7fb',   // app background
  surface:  '#ffffff',   // card / sheet background
  navy:     '#1a1a2e',   // primary action, FAB, topbar text
  border:   '#e8e8f0',   // card borders
  muted:    '#aaaaaa',   // secondary labels
  hint:     '#cccccc',   // placeholder / upcoming cells
  divider:  '#f0f0f5',   // row dividers inside cards

  paid:     '#1aaa74',   // green — paid status
  paidBg:   '#e6f7f1',
  paidText: '#0f7a52',

  unpaid:   '#e05252',   // red — unpaid / overdue status
  unpaidBg: '#fde8e8',
  unpaidText:'#b83232',

  partial:  '#d48a1a',   // amber — partial payment
  partialBg:'#fef3e2',
  partialText:'#a06a10',

  accent:   '#6c63ff',   // purple — installment / amortization type badge, move button
  accentBg: '#eeecff',
  accentText:'#4a40cc',

  amortBg:  '#f5f4ff',   // light purple surface for amortization banners
};
```

Mobile-first layout. Max content width 390px, centered. Bottom navigation bar (48px tall, 4 tabs). All cards use `border-radius: 18px`, border `0.5px solid C.border`. Bottom sheets slide up for forms and context menus. FAB (+ Add entry) is navy, full-width, `border-radius: 16px`, `padding: 14px`.

---

## Data model

Four Google Sheets tabs. All rowIds use prefix + underscore + row number (e.g. `G_3`, `E_7`, `I_12`, `P_9`, `A_5`).

### Sheet 1 — Groups
Columns: `GroupId | Label | DateFrom | DateTo | CreatedAt`

A group is a time-period bucket (e.g. "Week of Jun 2–8"). Entries are assigned to groups. Groups have a computed total (sum of entry amounts) derived on the frontend — not stored.

### Sheet 2 — Entries
Columns: `EntryId | GroupId | Store | Item | Amount | Status | EntryType | LinkedId | CreatedAt | UpdatedAt`

- `Status`: `paid` | `unpaid` | `partial`
- `EntryType`: `transaction` | `installment_payment` | `amortization_payment`
- `LinkedId`: if EntryType is not `transaction`, this holds the rowId of the parent Installment or Amortization record. Empty for plain transactions.

### Sheet 3 — Installments
Columns: `InstallmentId | Name | Source | MonthlyAmount | TotalMonths | StartDate | CreatedAt`

- `Source`: the store or person (e.g. "Abenson", "Cousin Ana")
- `TotalMonths`: total number of monthly payments
- `StartDate`: ISO `YYYY-MM-DD` of the first payment month

### Sheet 4 — Payments
Columns: `PaymentId | ParentType | ParentId | Period | AmountPaid | ExpectedAmount | CreatedAt | UpdatedAt`

- `ParentType`: `installment` | `amortization`
- `ParentId`: rowId of the parent Installment or Amortization
- `Period`: ISO `YYYY-MM` (e.g. `2025-06`)
- `AmountPaid`: what was actually paid that month (can be less than ExpectedAmount for partial)
- `ExpectedAmount`: the regular monthly amount due

### Sheet 5 — Amortizations
Columns: `AmortizationId | Name | Lender | MonthlyAmount | TotalYears | StartDate | PrincipalAmount | CreatedAt`

- Long-term (years), e.g. Pag-IBIG housing loan
- `TotalYears`: loan term in years
- `PrincipalAmount`: total loan amount

### Sheet 6 — Config
Columns: `Key | Value | Description`

Standard config sheet for `api_key` and other settings.

---

## Frontend — screen breakdown

### Bottom navigation (always visible)
Four tabs: Groups | Installments | Amortization | Summary

Active tab uses `C.navy` color, inactive uses `C.muted`.

---

### Screen 1 — Groups (default tab)

**Top bar:** "My ledger" title left, search icon + navy `+` icon button right.

**Stats row (2 columns):**
- Outstanding (sum of all unpaid + partial entry amounts) — red
- Paid this month (sum of paid entries in current calendar month) — green

**Group cards**, sorted by most recent first. Each card:
- Header row: colored icon (calendar-week icon, alternating purple/green tint), group name (e.g. "Week of Jun 2"), sub label "N entries", right side shows total amount and status note ("all paid" in green if every entry is paid, otherwise plain)
- Entry rows inside the card: left dot (color-coded by status), entry name + sub label (item name), right side: amount + status badge
  - Badge colors: Paid (green), Unpaid (red), Partial (amber), Installment payment (purple), Amortization payment (purple)
- Tapping an entry row opens the **Edit/Move bottom sheet**

**FAB:** "+ Add entry" full-width navy button at the bottom of the scroll area (above the bottom nav).

---

### Screen 2 — Installments

**Top bar:** "Installments" title, navy `+` button right.

**Installment cards**, one per installment:
- Header: name left, source + monthly amount + total months sub-label; paid-so-far amount right (green if any paid, red if zero), "of ₱X total" sub-label
- Progress bar (4px, green fill)
- Monthly grid (6 columns, showing the most recent 6 months or from start):
  - Full (green bg): paid = expected
  - Partial (amber bg): 0 < paid < expected, shows actual paid amount
  - Overdue (red bg): period has passed, paid = 0, shows "O/D"
  - Upcoming (gray bg): future months, shows "—"
- **Move row** at bottom of card: "Group: [group name]" label left, purple "Move to group" pill button right. If no group assigned, show "Unassigned" in red.
- Legend: Full · Partial · Overdue · Upcoming

---

### Screen 3 — Amortization

**Top bar:** "Amortization" title, navy `+` button right.

**Amortization cards**, one per loan:
- Header: name + lender sub-label left; total paid right (purple), "of ₱X" sub-label
- Progress bar (purple fill)
- Purple banner (2-column grid): "Progress" (Year N of Y · X%) | "Remaining" (₱X)
- Year grid (5 columns): Done (green), Active (purple), Upcoming (gray)
- Monthly breakdown header for the active year
- Monthly grid (same 6-column pattern as installments)
- **Move row**: same as installments — shows which group the current month's payment is assigned to, with "Move to group" button
- Legend

---

### Screen 4 — Summary

Simple read-only summary view:
- Total outstanding across all unpaid/partial entries
- Total paid all-time
- Breakdown by type: plain transactions vs installment payments vs amortization payments
- Overdue count (months past due across all installments + amortizations)
- List of top 5 unpaid items by amount

---

### Add entry bottom sheet

Triggered by the `+` FAB or the top-right `+` button. Slides up over a dark overlay.

**Step 1 — Type selector (3 options in a row):**
- Transaction (receipt icon)
- Installment payment (calendar-repeat icon)
- Amortization payment (building-bank icon)

Selected type gets purple border + light purple background.

**Step 2 — Form fields (change based on type):**

For `transaction`:
- Store or person (text)
- Item or description (text)
- Amount ₱ (number)
- Status (select: Paid / Unpaid)
- Add to group (select: list of existing groups + "+ New group" option)

For `installment_payment`:
- Select installment (select: list of installment names)
- Month (month picker, YYYY-MM)
- Amount paid ₱ (number, pre-filled with that installment's monthly amount)
- Add to group (same select)

For `amortization_payment`:
- Select amortization (select: list of amortization names)
- Month (month picker, YYYY-MM)
- Amount paid ₱ (number, pre-filled with that loan's monthly amount)
- Add to group (same select)

**Buttons:** "Save entry" (navy, full-width), "Cancel" (ghost, full-width below).

When "+ New group" is selected in the group picker, show two extra fields inline: Group label (text, e.g. "Week of Jun 9") and date range (two date inputs: from / to).

---

### Edit / Move bottom sheet

Triggered by tapping any entry row in a group card. Shows a context sheet with:

**Header:** entry name + amount + status + group label (small muted text)

**Three action rows:**
1. Edit entry — purple icon bg, `ti-edit` icon. Opens the Add entry sheet pre-filled with this entry's data, with a "Save changes" button instead of "Save entry".
2. Move to another group — green icon bg, `ti-arrows-move` icon. Opens a group picker sheet showing all groups. Selecting one immediately moves the entry.
3. Delete entry — red icon bg, `ti-trash` icon, label in red. Shows a confirmation row ("Are you sure?" with Confirm + Cancel) inline before deleting.

---

### Add installment sheet (from Installments `+` button)

Fields:
- Name (text, e.g. "Aircon 1.5hp")
- Source / store (text, e.g. "Abenson")
- Monthly amount ₱ (number)
- Total months (number)
- Start date (date, first payment month)

Save button: "Add installment"

---

### Add amortization sheet (from Amortization `+` button)

Fields:
- Name (text, e.g. "House & lot")
- Lender (text, e.g. "Pag-IBIG")
- Monthly amount ₱ (number)
- Total years (number)
- Start date (date)
- Principal amount ₱ (number, total loan)

Save button: "Add amortization"

---

### Settings screen (accessible via icon in top bar or a settings tab)

- API URL (text input)
- API Key (text input, optional)
- Test connection button
- App version label

---

## Backend — Google Apps Script (`Code.gs`)

Six sheets: `Groups`, `Entries`, `Installments`, `Payments`, `Amortizations`, `Config`.

```js
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
  entries:       ['EntryId','GroupId','Store','Item','Amount','Status','EntryType','LinkedId','CreatedAt','UpdatedAt'],
  installments:  ['InstallmentId','Name','Source','MonthlyAmount','TotalMonths','StartDate','CreatedAt'],
  payments:      ['PaymentId','ParentType','ParentId','Period','AmountPaid','ExpectedAmount','CreatedAt','UpdatedAt'],
  amortizations: ['AmortizationId','Name','Lender','MonthlyAmount','TotalYears','StartDate','PrincipalAmount','CreatedAt'],
  config:        ['Key','Value','Description'],
};

var FIELDS = {
  groups:        { groupId:0, label:1, dateFrom:2, dateTo:3, createdAt:4 },
  entries:       { entryId:0, groupId:1, store:2, item:3, amount:4, status:5, entryType:6, linkedId:7, createdAt:8, updatedAt:9 },
  installments:  { installmentId:0, name:1, source:2, monthlyAmount:3, totalMonths:4, startDate:5, createdAt:6 },
  payments:      { paymentId:0, parentType:1, parentId:2, period:3, amountPaid:4, expectedAmount:5, createdAt:6, updatedAt:7 },
  amortizations: { amortizationId:0, name:1, lender:2, monthlyAmount:3, totalYears:4, startDate:5, principalAmount:6, createdAt:7 },
};
```

**`doGet` supported types:**
- `ping` → `{ ok: true }`
- `all` → returns all six tables in one response: `{ groups, entries, installments, payments, amortizations }`

**`doPost` supported operations:**
- `append_group`, `append_entry`, `append_installment`, `append_payment`, `append_amortization`
- `update_entry` (rowId + updated fields)
- `update_payment` (rowId + updated fields)
- `delete_entry` (rowId)
- `move_entry` (rowId + new groupId) — updates only the `GroupId` and `UpdatedAt` columns of an entry row

For `move_entry`, implement a dedicated function that reads only the target row, updates columns 2 (GroupId) and 10 (UpdatedAt) without rewriting the whole row.

Use the `getSpreadsheet()`, `getSheet(key)`, `getRows(key)`, `readEntries(key)`, `appendEntry(key, d)`, `updateEntry(rowId, d)`, `deleteEntry(rowId)`, `authorized(params)`, and `getConfig()` helper pattern from `TECH_TEMPLATE.md` verbatim.

---

## Frontend data flow

On mount, call `api.get('all')` once. Store in state:
```js
const [data, setData] = useState({
  groups: [], entries: [], installments: [], payments: [], amortizations: []
});
```

All derived values (group totals, payment status per month, progress percentages, outstanding totals) are computed on-the-fly from this flat state — never stored as derived state.

Key computed functions to implement:
- `groupTotal(groupId)` — sum of entries in that group
- `isGroupFullyPaid(groupId)` — true if all entries have status `paid`
- `getMonthStatus(parentId, period)` — returns `full` | `partial` | `overdue` | `upcoming` based on payments + current date
- `installmentProgress(installmentId)` — `{ paid, total, pct }`
- `amortizationProgress(amortizationId)` — `{ paidYears, totalYears, paidAmount, remaining, pct }`
- `summaryStats()` — outstanding, paid this month, overdue count, breakdown by type

Optimistic updates: update `data` state immediately, POST in background via `api.post(...)` with `mode: 'no-cors'`, then call `api.get('all')` after 1.5s to reconcile.

---

## PWA

`public/manifest.json`:
```json
{
  "name": "Hutok",
  "short_name": "Hutok",
  "description": "Track what you owe — transactions, installments, and long-term loans in one place.",
  "start_url": ".",
  "scope": ".",
  "display": "standalone",
  "background_color": "#f7f7fb",
  "theme_color": "#1a1a2e",
  "orientation": "portrait",
  "icons": [{ "src": "favicon.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "any maskable" }]
}
```

Use `public/sw.js` from `TECH_TEMPLATE.md` verbatim.

---

## Vite config

Use `vite.config.js` from `TECH_TEMPLATE.md` verbatim (`base: './'`).

---

## GitHub Actions

Use `.github/workflows/deploy.yml` from `TECH_TEMPLATE.md` verbatim.

---

## File structure to produce

```
hutok/
├── index.html
├── vite.config.js
├── package.json
├── .gitignore
├── public/
│   ├── manifest.json
│   ├── sw.js
│   └── favicon.svg
├── src/
│   ├── main.jsx
│   └── App.jsx          ← ALL frontend logic and UI here
├── Code.gs              ← Apps Script backend (gitignored, for manual copy-paste)
├── SETUP.md             ← Setup instructions (gitignored)
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## SETUP.md content to generate

Include step-by-step instructions for:
1. Creating the Google Sheet (6 tabs)
2. Pasting `Code.gs` into Apps Script
3. Deploying as Web App (Execute as Me, Anyone)
4. Cloning the repo, running `npm install`, `npm run dev`
5. Opening Settings in the app and pasting the Apps Script URL
6. Testing connection (ping)
7. Pushing to GitHub and configuring GitHub Pages to use `gh-pages` branch

---

## Conventions (from TECH_TEMPLATE.md — no exceptions)

1. Everything in `src/App.jsx` — no component files, no hooks folder
2. No external UI libraries
3. Flat data model — compute everything on-the-fly
4. Dates as ISO `YYYY-MM-DD`, periods as `YYYY-MM`
5. rowId format: prefix + underscore + row number (`G_3`, `E_7`, etc.)
6. POST is `mode: 'no-cors'` fire-and-forget
7. Optimistic updates — instant UI, background POST, reconcile via GET
8. Deploy to `gh-pages` branch only
