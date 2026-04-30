# Handoff: Dealership Desking Tool

## Overview
A dense, data-rich dealership F&I desking tool used by sales associates to structure vehicle deals. It allows a sales associate to configure customer info, vehicle selection, pricing, trades, and multiple deal structures (Finance / Lease / Cash) side-by-side for comparison and presentation to the customer.

## About the Design Files
The file `Desking Tool.html` in this bundle is a **high-fidelity interactive prototype** built in React + Babel, running entirely in the browser. It is a **design reference** — not production code. The task for the developer is to **recreate this UI in the target codebase's existing environment** (e.g., React, Next.js, Vue, etc.) using its established patterns, component libraries, and routing conventions. Do not ship the HTML file directly.

## Fidelity
**High-fidelity.** This prototype has final colors, typography, spacing, layout, interaction states, and modal flows. The developer should implement this pixel-accurately using the codebase's existing tooling.

---

## Visual Hierarchy Rule
> **RED = interactable.** All red elements (#C8102E) are buttons or clickable controls. This rule is strict and must be maintained throughout the implementation.

---

## Layout
The tool is a **full-viewport, non-scrolling shell** with three zones:

```
┌─────────────────────────────────────────────────────┐
│  TOP BAR (50px, black #111111)                      │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│  LEFT PANEL  │  DEAL CARDS AREA (horizontally       │
│  (220px,     │  scrollable, cards are 246px wide,   │
│  fixed)      │  full height)                        │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

- Page background: `#c5c5c5`
- Content area padding: `7px`, gap between left panel and cards: `7px`

---

## Design Tokens

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| Red / Interactive | `#C8102E` | All buttons, carets, active states, selected payment |
| Red Hover | `#a80d26` | Hover state for red buttons |
| Black / Top bar | `#111111` | Top bar background |
| Green / Selected | `#1d6b1d` | Selected deal card header |
| Gray / Unselected | `#e0e0e0` | Unselected deal card header |
| Card background | `#ffffff` | All cards |
| Card border | `#c8c8c8` | 1px solid |
| Page background | `#c5c5c5` | App background |
| Text primary | `#1a1a1a` | Body text |
| Text secondary | `#666666` | Labels, subtitles |
| Text muted | `#888888` | Sublabels |
| VIN badge bg | `#dceef5` | Vehicle stock badge background |
| VIN badge text | `#1e6e94` | Vehicle stock badge text |

### Typography
- Font family: `'Helvetica Neue', Helvetica, Arial, sans-serif`
- Base size: `12px`
- Entity names: `13px / 700`
- Section labels: `11px / 700 / uppercase / #888`
- MSRP value: `16px / 700`
- Down payment amount (active): `22px / 700 / #C8102E`
- Down payment amount (inactive): `19px / 700 / #222`
- Cash deal price: `34px / 800 / #C8102E`
- Footer value: `17px / 800`

### Spacing & Sizing
- Card border-radius: `5px`
- Card padding: `8px 9px`
- Deal card width: `246px` (fixed, flex-shrink: 0)
- Left panel width: `220px`
- Top bar height: `50px`
- Gap between cards: `7px`
- Button border-radius: `4px`

### Shadows
- Modal box-shadow: `0 10px 40px rgba(0,0,0,0.28)`

---

## Screens / Views

### 1. Top Bar
Full-width black bar, height 50px. Three zones:

**Left:** `Back` button — red (`#C8102E`), large variant (`font-size: 13px`, `padding: 7px 14px`), left-pointing arrow icon + "Back" text.

**Center:** Two-line text block, centered:
- Line 1: "Sales Associate:" — `10px / #999`
- Line 2: Associate name — `14px / 700 / white`

**Right (left to right):** `Send` button (red-lg), `Print` button (red-lg), circular avatar (`34px`, `background: #e0e0e0`, `color: #111`, `font-size: 12px / 800`, initials text).

---

### 2. Left Panel
Fixed `220px` width, full height, vertically stacked cards with `6px` gap, scrollable if content overflows.

#### 2a. Customer Card
White card. Single row: red circle icon (36px, person SVG icon) — **clicking the icon opens the Customer modal**. To the right: customer full name (`13px / 700`) and address (`11px / #666`, two lines). No separate edit button.

#### 2b. Vehicle Card
White card. Same layout as Customer Card but with car SVG icon. Below the name: VIN number in tiny text (`10px`), followed by stock number in a pill badge (`background: #dceef5`, `color: #1e6e94`, `9px / 800`). **Clicking the red icon opens the Vehicle Inventory modal.**

#### 2c. Price Card
White card with three sections:

**MSRP row** (bottom-bordered separator):
- Label: "MSRP" (`12px / 500 / #666`)
- Value: `16px / 700` (pulled from selected vehicle)

**Sale Price row:**
- Left: downward red caret (CSS triangle, toggles expand) + red "Sale Price" button (opens Sale Price modal)
- Right: **inline editable number input** (`font-size: 13px / 700`, no border except bottom border on focus, `text-align: right`, `width: 72px`)
- Expanded: shows itemized discount lines indented (`11px / #666`), format: `Label` / `-$amount`

**Taxes row:**
- Left: downward red caret (toggles expand) + red "Taxes" button (opens Tax modal)
- Right: formatted dollar value (`13px / 700`)
- Expanded: shows itemized tax lines indented (`11px / #666`)

#### 2d. Trades Card
White card, flex: 1 (takes remaining vertical space), internally scrollable to `170px` max.

**Header:** Red circular icon (30px, refresh/cycle SVG) — **clicking opens Trade modal**. "Trades" label (`13px / 700`). No separate edit button.

**Trade entries** (separated by bottom border):
- Trade name: `"{year} {make} {model}"` — `12px / 600`
- Three columns: Allowance / Payoff / ACV
  - Each is an **inline editable number input** (`12px / 700 / center-aligned`, no border except `border-bottom: 1px solid #ddd` on focus)
  - Label below each: `10px / #888`

---

### 3. Deal Cards Area
Horizontally scrollable flex row. Each deal card is `246px` wide, full height of the content area.

#### Deal Card Anatomy

**Header (selected state) — green `#1d6b1d`, white text:**
- Filled green checkbox with white checkmark (`13px × 13px`, `border-radius: 2px`) — **clicking toggles to unselected**
- "Selected" text — clicking also toggles
- Spacer
- "Roll" button (ghost, white border)
- Copy icon button
- Trash icon button
- ⋮ More icon button

**Header (unselected state) — gray `#e0e0e0`, `#555` text:**
- Empty checkbox — **clicking toggles to selected**
- "Not Selected" text — clicking also toggles
- Spacer
- "Roll" button (ghost, gray border)
- Copy / Trash / ⋮ icon buttons (dark)

**Body (scrollable):**

1. **Type tabs** — three outline buttons: Finance / Lease / Cash. Active tab: red fill. Switching tab changes the card's field layout.

2. **Finance fields:** Term (number input) + Rate (number input) — both `14px / 700`, no border except bottom, centered, labeled below in `10px / #888`

3. **Lease fields:** Term + MF + Miles + Residual (same style). Residual label and value in red (`#C8102E`).

4. **Down payment rows** (finance & lease only, 1–3 rows):
   - Radio circle (`13px`, border `2px solid #b0b0b0`; active: filled red)
   - Clicking radio activates that row
   - Placeholder text input for down payment amount (`12px / #999`)
   - Right-aligned payment amount: inactive `19px / 700 / #222`, active `22px / 700 / #C8102E`
   - Trash icon to remove row (hidden if only 1 row)
   - "+ Add" link-button (red, `11px / 700`) below rows when < 3 rows

5. **Cash layout:** Single large red price (`34px / 800 / #C8102E`) centered in the body.

6. **Separator line** (`border-top: 1px solid #ebebeb`)

7. **Fees / Addons / Rebates sections** (each identical structure):
   - Left: CSS triangle caret (red, down=expanded, right=collapsed) — clicking toggles
   - Red button with section name (opens modal)
   - Right: total value (`13px / 600`) or placeholder italic text if empty
   - When expanded: indented item list, `max-height: 80px`, scrollable if overflow. Each row: `label` left, `$amount` right, `11px / #555`

**Footer** (pinned to bottom, `border-top: 1.5px solid #e0e0e0`, `padding: 6px 8px`):
- Label: "Amt. Financed" (finance) / "Cap Cost" (lease) / "OTD Price" (cash) — `11px / #666`
- Value: `17px / 800`

**Add Deal button:** Dashed red border (`2.5px dashed #C8102E`), same width as a card (`246px`), full height, large `+` centered at top. Adds a blank Finance deal card.

---

## Modals

All modals: centered overlay (`rgba(0,0,0,0.52)` backdrop), `background: white`, `border-radius: 6px`, `padding: 20px 22px`, `box-shadow: 0 10px 40px rgba(0,0,0,0.28)`. Close via X button or clicking backdrop. All input fields: `background: white; color: #1a1a1a`.

### Customer Modal
Fields: First Name, Last Name (row) / Address / City, State, ZIP (row) / Phone, Email (row).
Actions: Cancel (outline) / Save Customer (red).

### Vehicle Inventory Modal (lg)
Search input at top. Scrollable list of inventory rows. Each row: year/make/model/trim (left), VIN + stock + color (below, `11px / #888`), MSRP (right, `14px / 700`). Selected row has red border + `#fff5f7` background.
Actions: Cancel / Load Vehicle (red, disabled if none selected).

### Sale Price Modal
Shows MSRP as reference. Editable line items (description + amount). Add Item button. Live sale price total at bottom.
Actions: Cancel / Apply (red).

### Tax Modal
Fields: County, State Tax %, County Tax %, Out of State %, Vehicle Tax Credit. Live breakdown table below showing computed amounts.
Actions: Cancel / Apply (red).

### Trade-In Manager Modal (lg)
One accordion block per trade. Each: Year, Make, Model (row) / VIN / Allowance, Payoff, ACV (row). Delete button per trade. Add Trade button.
Actions: Cancel / Save Trades (red).

### Roll Payment Modal
Inputs: Desired Payment, Down Payment, Rate %, Term. Result block shows computed payment in large red (`36px / 800`).
Actions: Close.

### Fees / Add-Ons / Rebates Modal (generic)
Editable list of description + amount pairs. Add Item button. Total at bottom.
Actions: Cancel / Apply (red).

### Deal Menu Modal
Options list: Duplicate Deal Card, Switch to Finance, Switch to Lease, Switch to Cash, Delete Deal (red text).
Actions: Close.

---

## State Management

### Global state shape
```ts
customer: {
  firstName, lastName, address, city, state, zip, phone, email
}

vehicle: {
  id, year, make, model, trim, vin, stock, msrp, color
}

pricing: {
  msrp: number,
  salePrice: number,
  discount: number,
  discountItems: { label: string, amount: number }[],
  taxes: number,
  taxItems: { label: string, amount: number }[]
}

trades: {
  id, year, make, model, vin,
  allowance: number, payoff: number, acv: number
}[]

deals: {
  id: number,
  type: 'finance' | 'lease' | 'cash',
  selected: boolean,
  // finance
  term?: number, rate?: number,
  // lease
  mf?: string, miles?: number, residual?: number,
  // cash
  cashPrice?: number,
  downPayments: { amount: number | null, payment: number | null }[],
  activeDP: number,
  fees: { items: { label: string, amount: number }[] },
  addons: { items: { label: string, amount: number }[] },
  rebates: { items: { label: string, amount: number }[] },
  amtFinanced?: number,
  capCost?: number,
  otdPrice?: number
}[]

modal: null | string | { type: string, dealId: number }
```

### Key behaviors
- `selected` on a deal card is a **toggle** — clicking the checkbox on a selected card deselects it
- Trades allowance/payoff/acv are editable inline (no modal required for simple edits)
- Sale price is editable inline in the price card
- Down payments: max 3 per deal card; minimum 1 (no delete when only 1 remains)
- Copying a deal duplicates all fields with `selected: false`
- Adding a new deal creates a blank Finance card with one empty down payment row

---

## Assets / Icons
All icons in the prototype are custom inline SVG paths (no external icon library dependency). The following icons are used:
- Arrow Left (Back button)
- Send (paper plane)
- Printer
- User (person silhouette)
- Car
- Pencil (edit)
- Refresh/cycle (trades)
- Copy (duplicate)
- Trash
- More (vertical dots)
- Plus
- Check
- X (close)
- File
- Dollar sign
- Percent
- Calculator

Recommend using [Lucide Icons](https://lucide.dev/) in the production implementation — all of the above are available there.

---

## Files in This Package
| File | Description |
|------|-------------|
| `Desking Tool.html` | Full hi-fi interactive prototype (React/Babel, single file). Open in any browser to interact. |
| `README.md` | This document. |

---

## Notes for Developer
- Payment calculations (monthly payment from term/rate/amount financed, lease cap cost, cash OTD) are **not implemented** in the prototype — placeholder values are hardcoded. These need to be connected to real calculation logic.
- The inventory feed is mocked with 5 static Honda vehicles. Connect to your actual DMS/inventory API.
- No persistence layer — all state is in-memory React state. Connect to your backend/store as appropriate.
- The prototype assumes a landscape desktop viewport (~1280px+). No mobile breakpoints defined.
