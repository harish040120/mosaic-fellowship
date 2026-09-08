# Hiring Funnel Analytics — Build Plan for opencode

## Source problem statement (verbatim reference — do not deviate from this)

> **#6 — HR & Talent Team — Hiring Funnel Analytics**
> 3,000 job applicants across 10 departments. How efficient is the hiring process — really?
>
> **The Problem**
> Hiring is like a funnel. Lots of people apply, fewer make it to a phone screen, even fewer pass
> the technical round, and only a small percentage end up joining the company. Understanding where
> the funnel "leaks" — where good candidates drop off — is crucial for improving hiring.
>
> We're giving you data on 3,000 applicants across 10 departments (Engineering, Product, Marketing,
> Sales, Operations, Customer Support, Finance, HR, Data Science, Design). For each applicant you
> can see: which stage they reached (Applied → Phone Screen → Technical → Culture Fit → Hiring
> Manager → Offer → Accepted → Joined), their scores at each stage, days between stages, source
> channel, rejected/withdrew/passed status, and expected/offered compensation.
>
> **Your job:** compute a single number, the company's overall **Composite Hiring Efficiency Score**,
> made of four weighted metrics:
>
> 1. **Conversion Rate (30%)** = (Joined ÷ total applicants) × 100
> 2. **Time Efficiency (30%)** = (1 − min(avg_days_to_hire, 100) ÷ 100) × 100, using `total_process_days`
>    for applicants whose `current_stage == "Joined"` only
> 3. **Offer Acceptance Rate (20%)** = (Offer Accepted + Joined) ÷ (Offer Extended + Offer Accepted + Joined) × 100
> 4. **Referral Efficiency (20%)** = (referral applicants who Joined ÷ total referral applicants) × 100
>    — referral = `source == "Employee Referral"`
>
> **Final score** = ConversionRate×0.3 + TimeEfficiency×0.3 + OfferAcceptRate×0.2 + ReferralRate×0.2
>
> **Rules:** Any AI tool allowed except Lovable/Emergent. Must be deployed live + public GitHub repo.
> Must process the *provided* dataset (`hr_applicants.json`, 3,000 records, 2.3MB) — no sample data.
> Final answer must be a specific number checked against an answer key. Hosting: no Streamlit, no
> Render — use Vercel/Netlify/Cloudflare Pages, must load instantly, no login/signup.
>
> **What to Submit (the four required deliverables):**
> 1. A working web app with a **hiring funnel visualization** — show where candidates drop off, **by department**
> 2. The **exact overall composite hiring efficiency score** (to 2 decimal places) — this is what's verified
> 3. A **per-department breakdown** showing which departments hire efficiently and which don't
> 4. A **short write-up (max 500 words)** on the **top 3 things you'd fix** in this hiring process

---

## Verified reference answer (computed against the real `hr_applicants.json`)

Use this to sanity-check your own pipeline before trusting it — if your script doesn't reproduce
these, something's wrong with the logic, not the data:

| Metric | Value |
|---|---|
| Total applicants | 3,000 |
| Joined | 86 |
| Conversion Rate | 2.87% |
| Avg days to hire (Joined only, via `total_process_days`) | 81.36 |
| Time Efficiency | 18.64 |
| Offer denom (Extended+Accepted+Joined) | 249 |
| Offer Acceptance Rate | 69.48% |
| Referral applicants | 382 |
| Referral Efficiency | 1.57% |
| **Composite Score** | **20.66** |

Data quality notes confirmed on the real file (no need to re-derive, just implement defensively anyway):
- `total_process_days` is present and internally consistent (sums of stage-gap days) for all 86 Joined records — safe to use directly.
- `referral_employee_id` presence and `source == "Employee Referral"` perfectly agree (382/382) — either field works for referral detection.
- `current_stage` values in the file: `Applied, Phone Screen, Technical Round, Culture Fit, Hiring Manager, Offer Extended, Offer Accepted, Joined, Rejected, Withdrew`.

---

## Chosen architecture

**Precompute-at-build + shared calculation module** (not a live backend):

```
metrics.js              <- single source of truth for all 4 formulas + funnel/department aggregation
   ├── used by process.js (Node, runs at BUILD TIME via Netlify build command)
   │      reads hr_applicants.json → writes results.json (baked-in, required answer)
   └── used by the React dashboard bundle (browser, runtime)
          fetches results.json on load — this is what visitors see, instantly, no compute needed
```

- No backend, no login, no server process at runtime — pure static files on Netlify.
- The **required composite score is precomputed and baked into `results.json`** at build time, so first load is instant and 100% deterministic.
- `metrics.js` is plain, dependency-free JS so it can run identically under Node and in the browser.

**Stack:**
- Processing: Node.js (`metrics.js` + `process.js`)
- Frontend: React + Vite
- Charts: Recharts (funnel + department bar charts)
- Tests: Vitest (unit tests on the 4 formulas + aggregation logic), one integration test against the real dataset asserting composite == 20.66
- Hosting: Netlify (static site, build command runs `process.js` before `vite build`)

**Deferred bonus (not in the PS's "what to submit" list — build only if Steps 1–4 are done, tested, and deployed):**
- "Upload a JSON file" button that re-runs `metrics.js` client-side via `FileReader` on a user-supplied file with the same schema, re-rendering the dashboard without a server round-trip. This is Step 5 / optional — do not let it block or dilute the four required deliverables above.

---

## Step 1 — Core calculation engine (`metrics.js`) + Node processing script + unit tests

**Goal:** a correct, tested, standalone program that processes all 3,000 applicants. This is the
literal "write a program that processes the dataset" requirement — it must be runnable on its own,
independent of any UI.

**Build:**
1. `metrics.js` — pure functions, no I/O, no dependencies:
   - `computeConversionRate(applicants)`
   - `computeTimeEfficiency(applicants)` (filter `current_stage === "Joined"`, average `total_process_days`, apply the min(x,100) formula)
   - `computeOfferAcceptanceRate(applicants)`
   - `computeReferralEfficiency(applicants)`
   - `computeCompositeScore(applicants)` → returns `{ conversionRate, timeEfficiency, offerAcceptRate, referralEfficiency, compositeScore }`, each rounded to 2 decimals only at the final output step (keep full precision internally, round once at the end)
   - `computeFunnelByDepartment(applicants)` → for each of the 10 departments, counts of applicants at/past each of the 8 stages, to power the funnel chart later
   - `computeDepartmentBreakdown(applicants)` → for each department, run all 4 metrics + that department's own composite score (using the *same* formulas, scoped to that department's applicants)
2. `process.js` — Node entry point:
   - `require`/`import` `hr_applicants.json` from repo root (or a `/data` folder)
   - Validate: array of 3000 objects, warn (don't crash) if count differs
   - Call `computeCompositeScore`, `computeFunnelByDepartment`, `computeDepartmentBreakdown`
   - Print the composite score and all sub-metrics to console
   - Write `results.json` (containing all of the above) to the frontend's public/data folder
3. Unit tests (Vitest), using small hand-built fixture arrays (5–10 synthetic applicants covering: someone who Joined, someone Rejected, someone still Applied, a referral who Joined, a referral who didn't, an Offer Extended but not accepted) to assert each formula in isolation against hand-calculated expected values.
4. One integration test: run the real pipeline against `hr_applicants.json` and assert `compositeScore === 20.66` (and the four sub-metrics match the reference table above, to 2 decimals).

**Test/verify before moving on:**
- `node process.js` prints composite = **20.66** and matches the reference table exactly
- `npm test` (Vitest) — all unit tests green, integration test confirms 20.66
- Commit `metrics.js`, `process.js`, tests, and the generated `results.json` to the repo

---

## Step 2 — Data layer for the dashboard (funnel + per-department shape)

**Goal:** shape `results.json` so the frontend never needs to touch raw applicant records — it only renders pre-aggregated numbers. This step is about the *shape* of the output, since Step 1 already computes the values.

**Build:**
1. Finalize `results.json` schema, e.g.:
   ```json
   {
     "generatedAt": "...",
     "totalApplicants": 3000,
     "companyWide": {
       "conversionRate": 2.87,
       "timeEfficiency": 18.64,
       "offerAcceptRate": 69.48,
       "referralEfficiency": 1.57,
       "compositeScore": 20.66
     },
     "funnelOverall": [ { "stage": "Applied", "count": 3000 }, { "stage": "Phone Screen", "count": ... }, ... ],
     "funnelByDepartment": {
       "Engineering": [ { "stage": "Applied", "count": ... }, ... ],
       "Product": [ ... ],
       ...
     },
     "departmentBreakdown": [
       { "department": "Engineering", "totalApplicants": 304, "conversionRate": ..., "timeEfficiency": ..., "offerAcceptRate": ..., "referralEfficiency": ..., "compositeScore": ... },
       ...
     ]
   }
   ```
2. Decide funnel semantics explicitly and document it in code comments: funnel counts should represent "reached at least this stage" (cumulative down the funnel), not just `current_stage == X`, since a Joined applicant obviously also passed Phone Screen. Compute cumulative-reached counts using the known stage order:
   `Applied → Phone Screen → Technical Round → Culture Fit → Hiring Manager → Offer Extended → Offer Accepted → Joined`
   (Rejected/Withdrew applicants count toward every stage up to wherever they dropped off — infer their last-reached stage from which score/day fields are populated, or add a simple stage-order lookup table.)
3. Re-run `process.js`, confirm `results.json` validates against a JSON schema check (simple manual assertion is fine) and file size stays small (a few KB, not MB).

**Test/verify before moving on:**
- `results.json` is under ~50KB
- Funnel counts strictly decrease (or stay flat) moving down the funnel, for both `funnelOverall` and every department in `funnelByDepartment`
- Sum of all `departmentBreakdown[].totalApplicants` equals 3000
- Company-wide composite in `results.json` still matches 20.66

---

## Step 3 — React dashboard UI

**Goal:** implement the four required "what to submit" items visually, reading only from `results.json`.

**Build (React + Vite + Recharts):**
1. **Hero section** — big composite score (20.66) with the 4 sub-metric mini-cards underneath (Conversion, Time Efficiency, Offer Acceptance, Referral Efficiency), each showing its value and weight.
2. **Funnel visualization by department** (required deliverable #1) — a funnel/stage chart with a department selector (dropdown or tabs) that redraws the funnel for the selected department, plus an "All departments" / overall view as default. Use `funnelByDepartment` / `funnelOverall` from `results.json`.
3. **Per-department breakdown table/chart** (required deliverable #3) — a sortable table or bar chart comparing all 10 departments' composite scores side by side, so it's visually obvious which departments hire efficiently and which don't (highest vs lowest composite score departments called out).
4. **Write-up section** (required deliverable #4) — a static markdown-rendered panel on the page (or a linked `WRITEUP.md` in the repo, plus inlined on the page) with the "top 3 things to fix" analysis (see Step 4).
5. Keep the design clean and fast: no heavy component libraries beyond Recharts, mobile-responsive, single-page (no routing needed).

**Test/verify before moving on:**
- `npm run dev` — dashboard loads locally, all four sections render correctly from `results.json`
- Composite score displayed on page reads exactly **20.66**
- Department dropdown correctly changes the funnel chart
- Department breakdown table/chart sorts and displays all 10 departments with distinct composite scores
- No console errors, Lighthouse performance check reasonably fast (dashboard is tiny, should be near-instant)

---

## Step 4 — Testing, deployment, write-up, and repo finalization

**Goal:** ship a live, publicly readable, instantly-loading deployment with all four required deliverables, plus the write-up.

**Build:**
1. Finalize `WRITEUP.md` (max 500 words) covering: approach (precompute + static dashboard architecture and why), 2–3 concrete patterns found in the data (e.g. only 86 of 3,000 ever Joined; referral efficiency at 1.57% badly underperforms offer acceptance at 69.48%; average 81+ days to hire is the biggest single drag on the score), and the **top 3 things you'd fix** in the hiring process (e.g. shorten time-to-hire since it's the weakest lever at 18.64/100, investigate why referrals convert so poorly despite being a typically strong channel, address wherever the funnel shows the steepest single-stage drop-off).
2. `README.md` in the repo: setup instructions (`npm install`, `node process.js`, `npm run dev`, `npm run build`), the answer (20.66) stated plainly, and a link to the live URL.
3. `netlify.toml`:
   ```toml
   [build]
     command = "node process.js && npm run build"
     publish = "dist"
   ```
4. Push to a **public** GitHub repo.
5. Connect repo to Netlify (or `netlify deploy --prod` via CLI), confirm build command runs `process.js` before the Vite build, confirm no login/auth is required to view the live URL.
6. Final live smoke test: open the deployed URL in an incognito window, confirm the composite score, funnel, and department breakdown all render correctly with no sign-in prompt.

**Test/verify (final acceptance checklist):**
- [ ] Live URL loads instantly, no login/signup wall
- [ ] Composite score displayed = **20.66**, matches `node process.js` console output exactly
- [ ] Funnel visualization by department is visible and interactive
- [ ] Per-department breakdown is visible, all 10 departments shown
- [ ] Write-up (≤500 words, top 3 fixes) is present on the site and/or in the repo
- [ ] GitHub repo is public, contains `metrics.js`, `process.js`, tests, `results.json`, dashboard source, `README.md`, `WRITEUP.md`
- [ ] `npm test` passes in CI or locally before final push

---

## Step 5 — OPTIONAL bonus (not required by the PS — build only after Step 4 is fully done and verified)

"Upload your own JSON" tester:
- Add a file-upload control to the dashboard that reads a user-selected `.json` file via `FileReader`, validates it loosely matches the expected schema (array of applicant objects with the known field names), and re-runs the **same** `metrics.js` functions client-side (already dependency-free, so it drops straight into the browser bundle) to recompute and re-render all four dashboard sections for that file — no server round-trip, no page reload.
- On schema mismatch, show a clear inline error ("couldn't find expected fields") rather than crashing.
- Explicitly label this as a bonus/demo feature in the UI (e.g. "Test with your own dataset") so it's clear it's separate from the official required answer, which always stays visible as the default view.
