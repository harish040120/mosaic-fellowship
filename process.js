// process.js — Node entry point: reads hr_applicants.json, computes all metrics, writes results.json
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  computeCompositeScore,
  computeFunnelCounts,
  computeFunnelByDepartment,
  computeDepartmentBreakdown,
} from './metrics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read dataset
const dataPath = join(__dirname, 'hr_applicants.json');
const applicants = JSON.parse(readFileSync(dataPath, 'utf-8'));

// Validate
if (!Array.isArray(applicants)) {
  console.error('ERROR: hr_applicants.json is not an array');
  process.exit(1);
}
if (applicants.length !== 3000) {
  console.warn(`WARNING: Expected 3000 applicants, got ${applicants.length}`);
}

// Compute metrics
const companyWide = computeCompositeScore(applicants);
const funnelOverall = computeFunnelCounts(applicants);
const funnelByDepartment = computeFunnelByDepartment(applicants);
const departmentBreakdown = computeDepartmentBreakdown(applicants);

// Print to console
console.log('=== Hiring Funnel Analytics ===');
console.log(`Total applicants: ${applicants.length}`);
console.log(`Conversion Rate: ${companyWide.conversionRate}%`);
console.log(`Time Efficiency: ${companyWide.timeEfficiency}`);
console.log(`Offer Acceptance Rate: ${companyWide.offerAcceptRate}%`);
console.log(`Referral Efficiency: ${companyWide.referralEfficiency}%`);
console.log(`Composite Score: ${companyWide.compositeScore}`);

// Build results object
const results = {
  generatedAt: new Date().toISOString(),
  totalApplicants: applicants.length,
  companyWide,
  funnelOverall,
  funnelByDepartment,
  departmentBreakdown,
};

// Write to public/data/results.json (create dirs if needed)
const outDir = join(__dirname, 'public', 'data');
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'results.json');
writeFileSync(outPath, JSON.stringify(results, null, 2));
console.log(`\nResults written to ${outPath}`);
