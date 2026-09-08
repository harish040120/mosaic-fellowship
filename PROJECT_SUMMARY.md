# Hiring Funnel Analytics — Project Summary

## Overview

An interactive dashboard analyzing **3,000 job applicants across 10 departments** to compute a **Composite Hiring Efficiency Score** and visualize the hiring funnel with per-department breakdowns.

- **Live URL:** https://effervescent-squirrel-574374.netlify.app/
- **GitHub:** https://github.com/harish040120/mosaic-fellowship
- **Composite Score:** 20.66 / 100

---

## Deliverables (4 Required)

| # | Deliverable | Status |
|---|---|---|
| 1 | Hiring funnel visualization by department | Done |
| 2 | Exact overall composite hiring efficiency score (20.66) | Done |
| 3 | Per-department breakdown showing efficiency differences | Done |
| 4 | Short write-up (≤500 words) on top 3 things to fix | Done |

---

## What Was Built

### Core Calculation Engine (`metrics.js`)

Pure functions with no dependencies, runs identically in Node and browser:

| Function | Purpose |
|---|---|
| `computeConversionRate()` | Joined ÷ total applicants × 100 |
| `computeTimeEfficiency()` | (1 − min(avg_days, 100)/100) × 100 for Joined only |
| `computeOfferAcceptanceRate()` | (Offer Accepted + Joined) ÷ (Extended + Accepted + Joined) × 100 |
| `computeReferralEfficiency()` | Referral applicants who Joined ÷ total referrals × 100 |
| `computeCompositeScore()` | Weighted sum of all 4 metrics |
| `computeFunnelCounts()` | Cumulative "reached at least this stage" per stage |
| `computeFunnelByDepartment()` | Funnel counts split by each of 10 departments |
| `computeDepartmentBreakdown()` | All 4 metrics + composite per department |

### Build Script (`process.js`)

Node.js entry point that:
- Reads `hr_applicants.json` (3,000 records)
- Validates array length
- Runs all metric computations
- Writes `public/data/results.json` (~9KB) for the frontend
- Prints composite score to console

### React Dashboard (`src/`)

Built with **React 19 + Vite 5 + Recharts**:

#### Design System & Styling
- **Dark theme** with CSS custom properties (`--bg`, `--card`, `--border`, `--text`, `--muted`, `--accent`)
- **Color palette:** Indigo/purple gradients for primary, green for best, red for worst, amber for warnings
- **Typography:** Inter font family, letter-spacing adjustments for headings
- **Responsive layout:** CSS Grid with `auto-fit` and `minmax()` for metric cards, single-column on mobile
- **No heavy UI libraries** — all styling is vanilla CSS with BEM-like naming

#### Hero Section (`Hero.jsx`)
- Large composite score card with gradient background (`linear-gradient(135deg, #312e81, #1e1b4b)`)
- Score displayed at 3.5rem font weight 800, centered
- 4 metric cards in a responsive grid (`repeat(auto-fit, minmax(200px, 1fr))`)
- Each card shows: label (uppercase, muted), value (1.75rem bold), weight percentage
- Cards have subtle border and background contrast against dark theme

#### Funnel Visualization (`Funnel.jsx`)
- **Horizontal bar chart** (pure CSS, no chart library needed)
- 8 stages with color-coded bars using a gradient palette from indigo → purple → pink → orange → green
- Each row: stage name (right-aligned, muted) + bar track + count value
- Bar width calculated as percentage of max count for visual proportion
- **Department selector** — `<select>` dropdown with all 10 departments + "All Departments" default
- `useState` for selected department, instant re-render on change
- Footer note explaining "reached at least this stage" cumulative semantics
- Smooth CSS transition on bar width changes (`transition: width 0.4s ease`)

#### Department Breakdown (`DepartmentBreakdown.jsx`)
- **Dual view mode** — toggle between Table and Chart via button group
- **Sortable table:**
  - Click any column header to sort ascending/descending
  - Active sort column highlighted with accent color
  - Sort indicator arrow (↑/↓) on active column
  - `useMemo` for sorted data to avoid unnecessary re-renders
  - Hover effect on rows (`rgba(99, 102, 241, 0.05)` background)
  - Best composite score in green (`var(--green)`), worst in red (`var(--red)`)
  - 7 columns: Department, Composite, Conv. Rate, Time Eff., Offer Accept, Referral Eff., Applicants
- **Bar chart view (Recharts):**
  - `ResponsiveContainer` for adaptive sizing
  - `BarChart` with angled X-axis labels (`angle={-35}`) for long department names
  - Custom tooltip with dark theme matching the dashboard
  - `Cell` components for unique colors per department (10 distinct colors)
  - Rounded bar corners (`radius={[4, 4, 0, 0]}`)
- `overflow-x: auto` wrapper for table on small screens

#### Write-up Section (`Writeup.jsx`)
- Static content panel with card styling (`background: var(--card)`, rounded corners)
- 3 numbered sections with accent-colored headings
- Bold highlights for key metrics (20.66, 81 days, 1.57%, etc.)
- Muted paragraph text for readability against dark background

#### Layout & Structure (`App.jsx`, `App.css`)
- Single-page app, no routing needed
- Container max-width 1200px, centered with auto margins
- Header with gradient text title (`-webkit-background-clip: text`)
- Sections separated by consistent `margin-bottom: 3rem`
- Footer with generation timestamp and composite score
- Loading state while `results.json` fetches
- Mobile breakpoint at 640px (`@media (min-width: 640px)`) for hero grid

#### Files Created

| File | Lines | Purpose |
|---|---|---|
| `vite.config.js` | 6 | Vite + React plugin config |
| `index.html` | 12 | HTML shell with root div |
| `src/main.jsx` | 10 | React root render with StrictMode |
| `src/App.jsx` | 42 | Main component, fetches data, renders sections |
| `src/App.css` | 180 | All component styles, responsive grid, dark theme |
| `src/index.css` | 25 | CSS reset, variables, base typography |
| `src/components/Hero.jsx` | 32 | Score display + 4 metric cards |
| `src/components/Funnel.jsx` | 58 | Funnel bars + department dropdown |
| `src/components/DepartmentBreakdown.jsx` | 120 | Sortable table + Recharts bar chart |
| `src/components/Writeup.jsx` | 46 | Top 3 fixes write-up |

---

## Test Suite (Vitest)

### Unit Tests (24 tests)
| Test File | Tests |
|---|---|
| `computeConversionRate` | 3 tests (mixed, zero, all joined) |
| `computeTimeEfficiency` | 3 tests (mixed, cap at 100, zero days) |
| `computeOfferAcceptanceRate` | 3 tests (mixed, zero denom, all accepted) |
| `computeReferralEfficiency` | 3 tests (mixed, no referrals, all joined) |
| `computeCompositeScore` | 2 tests (weighted sum, rounding) |
| `computeFunnelCounts` | 3 tests (non-increasing, joined=all stages, applied=stage 0) |
| `getStageIndex` | 3 tests (active stages, rejected inference, withdrew inference) |
| `computeFunnelByDepartment` | 2 tests (per-dept funnel, non-increasing) |
| `computeDepartmentBreakdown` | 2 tests (all fields present, sums to total) |

### Integration Tests (18 tests)
- Real dataset: 3,000 applicants
- All 4 metrics match reference table exactly
- Funnel non-increasing overall and per department
- Department breakdown sums to 3,000
- `results.json` shape validation (schema, file size < 50KB)

---

## Reference Values (Verified)

| Metric | Value |
|---|---|
| Total applicants | 3,000 |
| Joined | 86 |
| Conversion Rate | 2.87% |
| Avg days to hire (Joined only) | 81.36 |
| Time Efficiency | 18.64 |
| Offer denom (Extended+Accepted+Joined) | 249 |
| Offer Acceptance Rate | 69.48% |
| Referral applicants | 382 |
| Referral Efficiency | 1.57% |
| **Composite Score** | **20.66** |

---

## Architecture

```
hr_applicants.json (3,000 records)
        │
        ▼
   process.js (Node, build time)
        │
        ▼
   metrics.js (pure functions)
        │
        ▼
   public/data/results.json (9KB, precomputed)
        │
        ▼
   React Dashboard (browser, runtime)
   ├── Hero (composite score + 4 cards)
   ├── Funnel (bar chart + dept selector)
   ├── Department Breakdown (table + chart)
   └── Writeup (top 3 fixes)
```

- **No backend** — pure static files on Netlify
- **No runtime computation** — all metrics precomputed at build time
- **Instant loading** — frontend only fetches a 9KB JSON file
- **Shared logic** — `metrics.js` used by both Node script and React bundle

---

## Tech Stack

| Layer | Technology |
|---|---|
| Processing | Node.js (`metrics.js` + `process.js`) |
| Frontend | React 19 + Vite 5 |
| Charts | Recharts |
| Testing | Vitest (42 tests) |
| Hosting | Netlify (static) |

---

## File Structure

```
├── metrics.js              # Pure calculation functions
├── process.js              # Node build script
├── hr_applicants.json      # Raw dataset (3,000 records)
├── package.json            # Dependencies + scripts
├── index.html              # HTML entry point
├── vite.config.js          # Vite config
├── netlify.toml            # Netlify build config
├── README.md               # Setup instructions + answer
├── WRITEUP.md              # Top 3 fixes analysis
├── public/
│   └── data/
│       └── results.json    # Precomputed metrics output
├── src/
│   ├── main.jsx            # React entry point
│   ├── App.jsx             # Main app component
│   ├── App.css             # Global styles
│   ├── index.css           # Reset + CSS variables
│   └── components/
│       ├── Hero.jsx         # Composite score + metric cards
│       ├── Funnel.jsx       # Funnel bars + dept selector
│       ├── DepartmentBreakdown.jsx  # Sortable table + chart
│       └── Writeup.jsx      # Top 3 fixes write-up
└── __tests__/
    ├── metrics.test.js      # 24 unit tests
    └── integration.test.js  # 18 integration tests
```

---

## How to Run

```bash
npm install              # Install dependencies
node process.js          # Process dataset → results.json
npm run dev              # Start dev server (http://localhost:3000)
npm test                 # Run 42 tests
npm run build            # Production build to dist/
```

---

## Deployment

1. Push to GitHub: https://github.com/harish040120/mosaic-fellowship
2. Connect to Netlify → auto-detects `netlify.toml`
3. Build command: `node process.js && npm run build`
4. Publish directory: `dist`
5. Live at: https://effervescent-squirrel-574374.netlify.app/
