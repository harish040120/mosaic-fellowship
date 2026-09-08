# Hiring Funnel Analytics — Write-Up

## Approach

This dashboard uses a **precompute-at-build** architecture: `process.js` runs at build time, reads the raw 3,000-record `hr_applicants.json` dataset, computes all metrics via a shared `metrics.js` module, and writes a lightweight `results.json` (~9KB). The React frontend fetches only this pre-aggregated file, so the page loads instantly with zero runtime computation — pure static files on Netlify.

## Key Patterns Found in the Data

- **Only 86 of 3,000 applicants ever joined** (2.87% conversion). The funnel leaks massively at every stage, with the steepest single drop between Offer Extended (1,524) and Offer Accepted (173) — a 89% loss.
- **Referral efficiency is abysmal at 1.57%** — only 6 of 382 employee-referred applicants joined. This is far below the already-low overall conversion rate, suggesting referrals are either not being prioritized or are filtering out at later stages.
- **Average time-to-hire is 81 days**, making time efficiency the weakest metric at 18.64/100. The 7-stage process accumulates delays at every handoff.

## Top 3 Things to Fix

1. **Shorten time-to-hire.** At 81 days average, this is the single biggest drag on the composite score. The offer stage is the worst bottleneck — 1,524 candidates received offers but only 173 accepted. Tightening the offer loop (faster turnaround, competitive benchmarking, dedicated offer management) would simultaneously improve time efficiency and conversion rate.

2. **Fix the referral pipeline.** Employee referrals convert at just 1.57% vs. 2.87% overall. Referred candidates should be the highest-quality, fastest-to-hire channel. Audit whether referred candidates are getting expedited processing, whether referral quality screening is happening upstream, and whether the referral incentive structure is actually motivating employees to refer strong candidates.

3. **Reduce process stages.** Seven stages (Applied → Phone Screen → Technical → Culture Fit → Hiring Manager → Offer Extended → Offer Accepted → Joined) is excessive. Each stage introduces delay and dropout. Consolidating or parallelizing stages — e.g., combining Culture Fit and Hiring Manager rounds, or running technical and culture assessments concurrently — would cut both time-to-hire and stage-by-stage attrition.
