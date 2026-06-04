# Hutok — Data model reference

## Sheet columns (exact order matters for FIELDS index mapping)

### Groups
| # | Column | Type | Notes |
|---|--------|------|-------|
| 0 | GroupId | string | e.g. `G_3` |
| 1 | Label | string | e.g. "Week of Jun 2–8" |
| 2 | DateFrom | YYYY-MM-DD | start of period |
| 3 | DateTo | YYYY-MM-DD | end of period |
| 4 | CreatedAt | YYYY-MM-DD | |

### Entries
| # | Column | Type | Notes |
|---|--------|------|-------|
| 0 | EntryId | string | e.g. `E_7` |
| 1 | GroupId | string | foreign key → Groups |
| 2 | Store | string | store name or person |
| 3 | Item | string | item or description |
| 4 | Amount | number | amount in ₱ |
| 5 | Status | string | `paid` \| `unpaid` \| `partial` |
| 6 | EntryType | string | `transaction` \| `installment_payment` \| `amortization_payment` |
| 7 | LinkedId | string | rowId of parent Installment or Amortization. Empty if EntryType = transaction |
| 8 | CreatedAt | YYYY-MM-DD | |
| 9 | UpdatedAt | YYYY-MM-DD | |

### Installments
| # | Column | Type | Notes |
|---|--------|------|-------|
| 0 | InstallmentId | string | e.g. `I_5` |
| 1 | Name | string | e.g. "Aircon 1.5hp" |
| 2 | Source | string | e.g. "Abenson" |
| 3 | MonthlyAmount | number | regular monthly payment |
| 4 | TotalMonths | number | total number of payments |
| 5 | StartDate | YYYY-MM-DD | date of first payment |
| 6 | CreatedAt | YYYY-MM-DD | |

### Payments
| # | Column | Type | Notes |
|---|--------|------|-------|
| 0 | PaymentId | string | e.g. `P_9` |
| 1 | ParentType | string | `installment` \| `amortization` |
| 2 | ParentId | string | rowId of parent |
| 3 | Period | YYYY-MM | e.g. `2025-06` |
| 4 | AmountPaid | number | actual amount paid (may be less than expected for partial) |
| 5 | ExpectedAmount | number | the regular monthly amount for that period |
| 6 | CreatedAt | YYYY-MM-DD | |
| 7 | UpdatedAt | YYYY-MM-DD | |

### Amortizations
| # | Column | Type | Notes |
|---|--------|------|-------|
| 0 | AmortizationId | string | e.g. `A_2` |
| 1 | Name | string | e.g. "House & lot" |
| 2 | Lender | string | e.g. "Pag-IBIG" |
| 3 | MonthlyAmount | number | |
| 4 | TotalYears | number | loan term |
| 5 | StartDate | YYYY-MM-DD | first payment date |
| 6 | PrincipalAmount | number | total loan amount |
| 7 | CreatedAt | YYYY-MM-DD | |

### Config
| # | Column | Notes |
|---|--------|-------|
| 0 | Key | e.g. `api_key` |
| 1 | Value | |
| 2 | Description | human-readable note |

---

## Status derivation rules (frontend computed)

### Entry status
- Set directly by the user when adding a plain `transaction`
- For `installment_payment` and `amortization_payment`: auto-derived from the linked Payment record:
  - `amountPaid >= expectedAmount` → `paid`
  - `amountPaid > 0 && amountPaid < expectedAmount` → `partial`
  - `amountPaid === 0` → `unpaid`

### Month cell status (in installment / amortization grids)
Given a `parentId` and a `period` (YYYY-MM):
1. Find the Payment record with matching `parentId` + `period`
2. If found:
   - `amountPaid >= expectedAmount` → **full** (green)
   - `0 < amountPaid < expectedAmount` → **partial** (amber), show actual paid amount
3. If not found:
   - `period < currentMonth` → **overdue** (red), show "O/D"
   - `period >= currentMonth` → **upcoming** (gray), show "—"

### Amortization year cell status
For a given year:
- All 12 months in that year have Payment records with `amountPaid >= expectedAmount` → **done** (green)
- Current calendar year → **active** (purple)
- Future year → **upcoming** (gray)

---

## Computed frontend functions (signatures)

```js
// Sum of entry amounts in a group
groupTotal(groupId, entries) → number

// True if every entry in the group has status 'paid'
isGroupFullyPaid(groupId, entries) → boolean

// Month cell status for installment or amortization
getMonthStatus(parentId, period, payments) → 'full' | 'partial' | 'overdue' | 'upcoming'

// Amount shown in a month cell
getMonthPaid(parentId, period, payments) → number | null

// Overall progress for an installment
installmentProgress(installmentId, installments, payments) → {
  paid: number,      // total ₱ paid so far
  total: number,     // total ₱ = monthlyAmount * totalMonths
  paidMonths: number,
  totalMonths: number,
  pct: number        // 0–100
}

// Overall progress for an amortization
amortizationProgress(amortizationId, amortizations, payments) → {
  paidAmount: number,
  remaining: number,
  paidYears: number,
  totalYears: number,
  currentYear: string,  // e.g. "2025"
  pct: number
}

// Summary stats across all data
summaryStats(data) → {
  outstanding: number,       // sum of unpaid + partial entry amounts
  paidThisMonth: number,     // sum of paid entries in current calendar month
  overdueCount: number,      // months past due across all installments + amortizations
  byType: {
    transactions: number,
    installmentPayments: number,
    amortizationPayments: number,
  }
}
```

---

## Group assignment for installment / amortization payments

A payment period can be linked to at most one Group via an Entry of type `installment_payment` or `amortization_payment`.

When the user taps "Move to group" on an installment or amortization card:
1. Find the Entry record where `entryType = installment_payment` (or `amortization_payment`) and `linkedId = that installment/amortization rowId` and the period matches the selected month
2. If found: call `move_entry` to update its `GroupId`
3. If not found: call `append_entry` to create a new Entry in the target group with the linked payment's amount and status derived from the Payment record

This means a payment month can be "unassigned" (no Entry exists yet) or "assigned" (an Entry exists pointing to a Group).
