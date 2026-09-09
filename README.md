# Sieve  -  a hiring funnel is literally a sieve

**Composite Hiring Efficiency Score: 20.66 / 100**

Interactive dashboard analyzing 3,000 job applicants across 10 departments, built with React + Vite + Recharts. Data is precomputed at build time for instant loading.

## Live Demo

[View Live Dashboard](https://effervescent-squirrel-574374.netlify.app/)

## Setup

```bash
# Install dependencies
npm install

# Process the dataset (reads hr_applicants.json → writes public/data/results.json)
node process.js

# Start dev server
npm run dev

# Run tests
npm test

# Production build
npm run build
```

## Answer

The company's overall **Composite Hiring Efficiency Score is 20.66**.

| Metric | Value |
|---|---|
| Conversion Rate (30%) | 2.87% |
| Time Efficiency (30%) | 18.64 |
| Offer Acceptance Rate (20%) | 69.48% |
| Referral Efficiency (20%) | 1.57% |
| **Composite Score** | **20.66** |

## Architecture

- **`metrics.js`**  -  Pure calculation functions (no dependencies), shared between Node build script and browser bundle
- **`process.js`**  -  Node entry point, reads `hr_applicants.json`, writes `public/data/results.json`
- **`src/`**  -  React dashboard (Vite + Recharts), reads only from `results.json`
- **Tests**  -  Vitest: 24 unit tests + 18 integration tests (42 total)

## Tech Stack

- React 19 + Vite 5
- Recharts (bar charts)
- Framer Motion (animations)
- Lucide React (icons)
- jsPDF + html2canvas (PDF export)
- Vitest (testing)
- Netlify (hosting)

## Report Export

Click **Export PDF** in the top-right to download a clean, print-quality PDF report containing the composite score, funnel visualization, department breakdown table, and write-up  -  suitable for sharing with non-technical stakeholders.

## Dataset

3,000 applicant records across 10 departments (Engineering, Product, Marketing, Sales, Operations, Customer Support, Finance, HR, Data Science, Design) with stage scores, days between stages, source channels, and compensation data.
