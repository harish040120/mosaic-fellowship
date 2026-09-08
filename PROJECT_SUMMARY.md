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

#### Hero Section
- Large composite score display (20.66 out of 100)
- 4 metric cards: Conversion Rate, Time Efficiency, Offer Acceptance, Referral Efficiency
- Each card shows value, and weight percentage
- Dark theme with gradient accent colors

#### Funnel Visualization
- Horizontal bar chart showing 8 hiring stages:
  - Applied → Phone Screen → Technical Round → Culture Fit → Hiring Manager → Offer Extended → Offer Accepted → Joined
- **Department selector dropdown** — switch between "All Departments" and any of the 10 departments
- Counts represent cumulative "reached at least this stage"
- Color-coded bars per stage
- Instant redraw on department change

#### Department Breakdown
- **Sortable table** — click any column header to sort ascending/descending
- Columns: Department, Composite, Conv. Rate, Time Eff., Offer Accept, Referral Eff., Applicants
- **Bar chart view** — toggle between table and Recharts bar chart
- Best (green) and worst (red) composite scores highlighted
- All 10 departments displayed: Engineering, Product, Marketing, Sales, Operations, Customer Support, Finance, HR, Data Science, Design

#### Write-up Section
- Top 3 things to fix in the hiring process:
  1. Shorten time-to-hire (81 days avg, weakest metric at 18.64)
  2. Fix referral pipeline (1.57% conversion vs 2.87% overall)
  3. Reduce process stages (7 stages causing massive dropout)

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
