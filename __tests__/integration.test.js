import { describe, it, expect } from 'vitest';
import { readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  computeCompositeScore,
  computeFunnelCounts,
  computeFunnelByDepartment,
  computeDepartmentBreakdown,
} from '../metrics.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const applicants = JSON.parse(
  readFileSync(join(__dirname, '..', 'hr_applicants.json'), 'utf-8')
);

describe('Integration: real hr_applicants.json', () => {
  const result = computeCompositeScore(applicants);

  it('has exactly 3000 applicants', () => {
    expect(applicants.length).toBe(3000);
  });

  it('composite score equals 20.66', () => {
    expect(result.compositeScore).toBe(20.66);
  });

  it('conversion rate matches reference (2.87%)', () => {
    expect(result.conversionRate).toBe(2.87);
  });

  it('time efficiency matches reference (18.64)', () => {
    expect(result.timeEfficiency).toBe(18.64);
  });

  it('offer acceptance rate matches reference (69.48%)', () => {
    expect(result.offerAcceptRate).toBe(69.48);
  });

  it('referral efficiency matches reference (1.57%)', () => {
    expect(result.referralEfficiency).toBe(1.57);
  });

  it('funnel is non-increasing', () => {
    const funnel = computeFunnelCounts(applicants);
    expect(funnel).toHaveLength(8);
    expect(funnel[0].count).toBe(3000);
    for (let i = 1; i < funnel.length; i++) {
      expect(funnel[i].count).toBeLessThanOrEqual(funnel[i - 1].count);
    }
  });

  it('department breakdown sums to 3000', () => {
    const breakdown = computeDepartmentBreakdown(applicants);
    const total = breakdown.reduce((s, d) => s + d.totalApplicants, 0);
    expect(total).toBe(3000);
  });

  it('department breakdown has 10 departments', () => {
    const breakdown = computeDepartmentBreakdown(applicants);
    expect(breakdown.length).toBe(10);
  });

  it('funnel by department has 10 departments', () => {
    const funnelByDept = computeFunnelByDepartment(applicants);
    expect(Object.keys(funnelByDept).length).toBe(10);
  });
});

// ─── Step 2: results.json shape verification ────────────────────────────────
describe('Step 2: results.json output shape', () => {
  const resultsPath = join(__dirname, '..', 'public', 'data', 'results.json');
  const results = JSON.parse(readFileSync(resultsPath, 'utf-8'));

  it('file is under 50KB', () => {
    const size = statSync(resultsPath).size;
    expect(size).toBeLessThan(50000);
  });

  it('has required top-level keys', () => {
    expect(results).toHaveProperty('generatedAt');
    expect(results).toHaveProperty('totalApplicants');
    expect(results).toHaveProperty('companyWide');
    expect(results).toHaveProperty('funnelOverall');
    expect(results).toHaveProperty('funnelByDepartment');
    expect(results).toHaveProperty('departmentBreakdown');
  });

  it('companyWide has all 5 metrics', () => {
    const cw = results.companyWide;
    expect(cw).toHaveProperty('conversionRate');
    expect(cw).toHaveProperty('timeEfficiency');
    expect(cw).toHaveProperty('offerAcceptRate');
    expect(cw).toHaveProperty('referralEfficiency');
    expect(cw).toHaveProperty('compositeScore');
  });

  it('composite is 20.66', () => {
    expect(results.companyWide.compositeScore).toBe(20.66);
  });

  it('funnelOverall is array of 8 stages, non-increasing', () => {
    expect(results.funnelOverall).toHaveLength(8);
    expect(results.funnelOverall[0].count).toBe(3000);
    for (let i = 1; i < results.funnelOverall.length; i++) {
      expect(results.funnelOverall[i].count).toBeLessThanOrEqual(
        results.funnelOverall[i - 1].count
      );
    }
  });

  it('funnelByDepartment has 10 departments, each non-increasing', () => {
    const depts = Object.keys(results.funnelByDepartment);
    expect(depts.length).toBe(10);
    for (const dept of depts) {
      const funnel = results.funnelByDepartment[dept];
      expect(funnel).toHaveLength(8);
      for (let i = 1; i < funnel.length; i++) {
        expect(funnel[i].count).toBeLessThanOrEqual(funnel[i - 1].count);
      }
    }
  });

  it('departmentBreakdown sums to 3000 applicants', () => {
    const total = results.departmentBreakdown.reduce((s, d) => s + d.totalApplicants, 0);
    expect(total).toBe(3000);
  });

  it('departmentBreakdown has 10 entries with all required fields', () => {
    expect(results.departmentBreakdown).toHaveLength(10);
    for (const dept of results.departmentBreakdown) {
      expect(dept).toHaveProperty('department');
      expect(dept).toHaveProperty('totalApplicants');
      expect(dept).toHaveProperty('conversionRate');
      expect(dept).toHaveProperty('timeEfficiency');
      expect(dept).toHaveProperty('offerAcceptRate');
      expect(dept).toHaveProperty('referralEfficiency');
      expect(dept).toHaveProperty('compositeScore');
    }
  });
});
