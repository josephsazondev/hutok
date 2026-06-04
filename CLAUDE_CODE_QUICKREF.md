# Hutok — Claude Code quick reference

Hand this to Claude Code at the start of your session along with PROMPT.md, DATA_MODEL.md, Code.gs, and TECH_TEMPLATE.md.

---

## App name & tagline
**Hutok** — track what you owe

---

## Files to give Claude Code
| File | Purpose |
|------|---------|
| `PROMPT.md` | Full build instructions — read this first |
| `DATA_MODEL.md` | Sheet columns, computed functions, status rules |
| `Code.gs` | Pre-written Apps Script backend — use as-is |
| `SETUP.md` | Setup guide — generate this as a file in the project |
| `TECH_TEMPLATE.md` | Architecture conventions — follow strictly |

---

## Starting message for Claude Code

> Read all five files in this folder, then build the full Hutok app following PROMPT.md exactly. Use TECH_TEMPLATE.md for all architecture decisions. Use Code.gs as the backend (do not rewrite it). Use DATA_MODEL.md for the data model and computed function signatures. Generate all frontend code in `src/App.jsx` as a single file. Do not use any external UI libraries.

---

## Key decisions at a glance

| Topic | Decision |
|-------|----------|
| Font | Inter (Google Fonts) |
| Primary color | `#1a1a2e` navy |
| Accent | `#6c63ff` purple |
| Cards | `border-radius: 18px`, `border: 0.5px solid #e8e8f0` |
| App background | `#f7f7fb` |
| Paid | `#1aaa74` green |
| Unpaid / overdue | `#e05252` red |
| Partial | `#d48a1a` amber |
| Nav | Bottom, 4 tabs |
| Forms | Bottom sheets (slide up over dark overlay) |
| Backend | Google Apps Script + Sheets |
| Deployment | GitHub Pages via Actions |
| Offline | Service worker (PWA) |

---

## Screens to build (in order)

1. Groups (home) — default tab
2. Installments — short-term monthly trackers
3. Amortization — long-term yearly loan trackers
4. Summary — read-only stats
5. Add entry bottom sheet (Transaction / Installment payment / Amortization payment)
6. Add installment bottom sheet
7. Add amortization bottom sheet
8. Edit / Move bottom sheet (edit, move to group, delete)
9. Settings screen

---

## Things to NOT do
- No Tailwind, Bootstrap, MUI, Shadcn, or any UI library
- No separate component files — everything in `src/App.jsx`
- No derived state — compute everything from `data` on-the-fly
- No hardcoded spreadsheet ID in `Code.gs`
- No timestamps — use ISO `YYYY-MM-DD` for dates, `YYYY-MM` for periods
