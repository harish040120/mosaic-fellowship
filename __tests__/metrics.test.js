import { describe, it, expect } from 'vitest';
import {
  computeConversionRate,
  computeTimeEfficiency,
  computeOfferAcceptanceRate,
  computeReferralEfficiency,
  computeCompositeScore,
  computeFunnelCounts,
  computeFunnelByDepartment,
  computeDepartmentBreakdown,
  getStageIndex,
  STAGES,
} from '../metrics.js';

// ─── Synthetic fixtures ─────────────────────────────────────────────────────
// Covers: Joined, Rejected, Applied-only, referral who Joined, referral who didn't,
// Offer Extended but not accepted, Offer Accepted, Withdrew, various departments

function makeApplicant(overrides) {
  return {
    applicant_id: 'TEST-001',
    department: 'Engineering',
    role: 'Engineer',
    source: 'Direct Application',
    city: 'Remote',
    experience_level: '3-5 years',
    education: 'B.Tech',
    apply_date: '2025-01-01',
    current_stage: 'Applied',
    phone_screen_score: null,
    technical_score: null,
    culture_fit_score: null,
    hiring_manager_score: null,
    days_apply_to_phone: null,
    days_phone_to_tech: null,
    days_tech_to_culture: null,
    days_culture_to_hm: null,
    days_hm_to_offer: null,
    days_offer_to_accept: null,
    days_accept_to_join: null,
    total_process_days: null,
    expected_ctc: 1000000,
    offered_ctc: null,
    recruiter_notes: null,
    is_diversity_candidate: false,
    referral_employee_id: null,
    ...overrides,
  };
}

const fixture_joined = makeApplicant({
  applicant_id: 'J-001',
  current_stage: 'Joined',
  phone_screen_score: 8,
  technical_score: 9,
  culture_fit_score: 7,
  hiring_manager_score: 8,
  days_apply_to_phone: 5,
  days_phone_to_tech: 3,
  days_tech_to_culture: 2,
  days_culture_to_hm: 4,
  days_hm_to_offer: 3,
  days_offer_to_accept: 2,
  days_accept_to_join: 10,
  total_process_days: 29,
  offered_ctc: 1200000,
});

const fixture_rejected = makeApplicant({
  applicant_id: 'R-001',
  current_stage: 'Rejected',
  phone_screen_score: 5,
  technical_score: 6,
  culture_fit_score: 4,
  hiring_manager_score: null,
  days_apply_to_phone: 8,
  days_phone_to_tech: 5,
  days_tech_to_culture: 3,
  total_process_days: 16,
});

const fixture_applied = makeApplicant({
  applicant_id: 'A-001',
  current_stage: 'Applied',
});

const fixture_referral_joined = makeApplicant({
  applicant_id: 'RJ-001',
  department: 'Product',
  source: 'Employee Referral',
  current_stage: 'Joined',
  phone_screen_score: 7,
  technical_score: 8,
  culture_fit_score: 9,
  hiring_manager_score: 8,
  days_apply_to_phone: 4,
  days_phone_to_tech: 3,
  days_tech_to_culture: 2,
  days_culture_to_hm: 3,
  days_hm_to_offer: 2,
  days_offer_to_accept: 1,
  days_accept_to_join: 8,
  total_process_days: 23,
  offered_ctc: 1500000,
});

const fixture_referral_rejected = makeApplicant({
  applicant_id: 'RR-001',
  department: 'Product',
  source: 'Employee Referral',
  current_stage: 'Rejected',
  phone_screen_score: 6,
  technical_score: 5,
  culture_fit_score: 3,
  hiring_manager_score: null,
  days_apply_to_phone: 7,
  days_phone_to_tech: 4,
  days_tech_to_culture: 2,
  total_process_days: 13,
});

const fixture_offer_extended = makeApplicant({
  applicant_id: 'OE-001',
  current_stage: 'Offer Extended',
  phone_screen_score: 7,
  technical_score: 8,
  culture_fit_score: 7,
  hiring_manager_score: 9,
  days_apply_to_phone: 5,
  days_phone_to_tech: 3,
  days_tech_to_culture: 2,
  days_culture_to_hm: 3,
  days_hm_to_offer: 2,
  total_process_days: 15,
  offered_ctc: 1300000,
});

const fixture_offer_accepted = makeApplicant({
  applicant_id: 'OA-001',
  current_stage: 'Offer Accepted',
  phone_screen_score: 8,
  technical_score: 9,
  culture_fit_score: 8,
  hiring_manager_score: 9,
  days_apply_to_phone: 4,
  days_phone_to_tech: 3,
  days_tech_to_culture: 2,
  days_culture_to_hm: 3,
  days_hm_to_offer: 2,
  days_offer_to_accept: 1,
  total_process_days: 15,
  offered_ctc: 1400000,
});

const fixture_withdrew = makeApplicant({
  applicant_id: 'W-001',
  department: 'Sales',
  current_stage: 'Withdrew',
  phone_screen_score: 7,
  technical_score: 8,
  culture_fit_score: 6,
  hiring_manager_score: 7,
  days_apply_to_phone: 5,
  days_phone_to_tech: 4,
  days_tech_to_culture: 3,
  days_culture_to_hm: 2,
  days_hm_to_offer: 3,
  days_offer_to_accept: null,
  total_process_days: 17,
  offered_ctc: 1100000,
});

const fixtures = [
  fixture_joined,
  fixture_rejected,
  fixture_applied,
  fixture_referral_joined,
  fixture_referral_rejected,
  fixture_offer_extended,
  fixture_offer_accepted,
  fixture_withdrew,
];

// ─── Unit tests: Conversion Rate ────────────────────────────────────────────
describe('computeConversionRate', () => {
  it('calculates correctly with mixed applicants', () => {
    // 2 Joined out of 8 = 25%
    expect(computeConversionRate(fixtures)).toBeCloseTo(25, 2);
  });

  it('returns 0 when nobody joined', () => {
    const noJoin = fixtures.filter(a => a.current_stage !== 'Joined');
    expect(computeConversionRate(noJoin)).toBe(0);
  });

  it('returns 100 when everyone joined', () => {
    const allJoin = fixtures.filter(a => a.current_stage === 'Joined');
    expect(computeConversionRate(allJoin)).toBe(100);
  });
});

// ─── Unit tests: Time Efficiency ────────────────────────────────────────────
describe('computeTimeEfficiency', () => {
  it('calculates correctly using only Joined applicants', () => {
    // Joined: fixture_joined (29 days) + fixture_referral_joined (23 days)
    // avg = (29 + 23) / 2 = 26
    // (1 - min(26, 100)/100) * 100 = (1 - 0.26) * 100 = 74
    expect(computeTimeEfficiency(fixtures)).toBeCloseTo(74, 2);
  });

  it('caps at 100 when avg days >= 100', () => {
    const slowJoin = makeApplicant({
      current_stage: 'Joined',
      total_process_days: 150,
      phone_screen_score: 5,
      technical_score: 5,
      culture_fit_score: 5,
      hiring_manager_score: 5,
    });
    const fastJoin = makeApplicant({
      current_stage: 'Joined',
      total_process_days: 50,
      phone_screen_score: 5,
      technical_score: 5,
      culture_fit_score: 5,
      hiring_manager_score: 5,
    });
    // avg = (150 + 50) / 2 = 100, min(100,100) = 100
    // (1 - 100/100) * 100 = 0
    expect(computeTimeEfficiency([slowJoin, fastJoin])).toBeCloseTo(0, 2);
  });

  it('returns 100 when avg days is 0', () => {
    const instant = makeApplicant({
      current_stage: 'Joined',
      total_process_days: 0,
      phone_screen_score: 5,
      technical_score: 5,
      culture_fit_score: 5,
      hiring_manager_score: 5,
    });
    expect(computeTimeEfficiency([instant])).toBeCloseTo(100, 2);
  });
});

// ─── Unit tests: Offer Acceptance Rate ──────────────────────────────────────
describe('computeOfferAcceptanceRate', () => {
  it('calculates correctly with mixed stages', () => {
    // fixture_offer_extended (1) + fixture_offer_accepted (1) + fixture_joined (1) + fixture_referral_joined (1)
    // denom = 1 + 1 + 2 = 4
    // accepted + joined = 1 + 2 = 3
    // 3/4 * 100 = 75
    expect(computeOfferAcceptanceRate(fixtures)).toBeCloseTo(75, 2);
  });

  it('returns 0 when denominator is 0', () => {
    const noOffers = [fixture_applied, fixture_rejected];
    expect(computeOfferAcceptanceRate(noOffers)).toBe(0);
  });

  it('returns 100 when all offers are accepted', () => {
    expect(computeOfferAcceptanceRate([fixture_offer_accepted, fixture_joined])).toBe(100);
  });
});

// ─── Unit tests: Referral Efficiency ────────────────────────────────────────
describe('computeReferralEfficiency', () => {
  it('calculates correctly', () => {
    // 2 referrals total, 1 joined
    // 1/2 * 100 = 50
    expect(computeReferralEfficiency(fixtures)).toBeCloseTo(50, 2);
  });

  it('returns 0 when no referrals', () => {
    const noRef = fixtures.filter(a => a.source !== 'Employee Referral');
    expect(computeReferralEfficiency(noRef)).toBe(0);
  });

  it('returns 100 when all referrals joined', () => {
    expect(computeReferralEfficiency([fixture_referral_joined])).toBe(100);
  });
});

// ─── Unit tests: Composite Score ────────────────────────────────────────────
describe('computeCompositeScore', () => {
  it('returns all sub-metrics and composite', () => {
    const result = computeCompositeScore(fixtures);
    expect(result).toHaveProperty('conversionRate');
    expect(result).toHaveProperty('timeEfficiency');
    expect(result).toHaveProperty('offerAcceptRate');
    expect(result).toHaveProperty('referralEfficiency');
    expect(result).toHaveProperty('compositeScore');

    // Verify composite = weighted sum
    const expected =
      result.conversionRate * 0.3 +
      result.timeEfficiency * 0.3 +
      result.offerAcceptRate * 0.2 +
      result.referralEfficiency * 0.2;
    expect(result.compositeScore).toBeCloseTo(expected, 2);
  });

  it('rounds values to 2 decimal places', () => {
    const result = computeCompositeScore(fixtures);
    expect(result.conversionRate).toBe(Math.round(result.conversionRate * 100) / 100);
    expect(result.compositeScore).toBe(Math.round(result.compositeScore * 100) / 100);
  });
});

// ─── Unit tests: Funnel Counts ──────────────────────────────────────────────
describe('computeFunnelCounts', () => {
  it('counts cumulative stage reaches', () => {
    const funnel = computeFunnelCounts(fixtures);
    expect(funnel).toHaveLength(8);
    // Everyone reached Applied
    expect(funnel[0].stage).toBe('Applied');
    expect(funnel[0].count).toBe(fixtures.length);

    // Counts should be non-increasing
    for (let i = 1; i < funnel.length; i++) {
      expect(funnel[i].count).toBeLessThanOrEqual(funnel[i - 1].count);
    }
  });

  it('counts Joined applicants at all stages', () => {
    const funnel = computeFunnelCounts([fixture_joined]);
    // Joined applicant reached all 8 stages
    expect(funnel.every(f => f.count === 1)).toBe(true);
  });

  it('counts Applied-only at just stage 0', () => {
    const funnel = computeFunnelCounts([fixture_applied]);
    expect(funnel[0].count).toBe(1);
    expect(funnel[1].count).toBe(0);
  });
});

// ─── Unit tests: getStageIndex ──────────────────────────────────────────────
describe('getStageIndex', () => {
  it('returns correct index for active stages', () => {
    expect(getStageIndex(fixture_joined)).toBe(7);
    expect(getStageIndex(fixture_offer_accepted)).toBe(6);
    expect(getStageIndex(fixture_offer_extended)).toBe(5);
    expect(getStageIndex(fixture_applied)).toBe(0);
  });

  it('infers stage for Rejected from populated fields', () => {
    // fixture_rejected has phone_screen, technical, culture_fit scores
    expect(getStageIndex(fixture_rejected)).toBe(3); // Culture Fit
  });

  it('infers stage for Withdrew from offered_ctc', () => {
    expect(getStageIndex(fixture_withdrew)).toBe(5); // Offer Extended
  });
});

// ─── Unit tests: Funnel by Department ───────────────────────────────────────
describe('computeFunnelByDepartment', () => {
  it('returns funnel per department', () => {
    const result = computeFunnelByDepartment(fixtures);
    expect(result).toHaveProperty('Engineering');
    expect(result).toHaveProperty('Product');
    expect(result).toHaveProperty('Sales');

    // Engineering: fixture_joined, fixture_rejected, fixture_applied, fixture_offer_extended, fixture_offer_accepted
    expect(result.Engineering).toHaveLength(8);
    expect(result.Engineering[0].count).toBe(5); // 5 in Engineering
  });

  it('each department funnel is non-increasing', () => {
    const result = computeFunnelByDepartment(fixtures);
    for (const dept of Object.values(result)) {
      for (let i = 1; i < dept.length; i++) {
        expect(dept[i].count).toBeLessThanOrEqual(dept[i - 1].count);
      }
    }
  });
});

// ─── Unit tests: Department Breakdown ───────────────────────────────────────
describe('computeDepartmentBreakdown', () => {
  it('returns breakdown per department with all metrics', () => {
    const result = computeDepartmentBreakdown(fixtures);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    for (const dept of result) {
      expect(dept).toHaveProperty('department');
      expect(dept).toHaveProperty('totalApplicants');
      expect(dept).toHaveProperty('conversionRate');
      expect(dept).toHaveProperty('timeEfficiency');
      expect(dept).toHaveProperty('offerAcceptRate');
      expect(dept).toHaveProperty('referralEfficiency');
      expect(dept).toHaveProperty('compositeScore');
    }
  });

  it('sums totalApplicants across departments to total', () => {
    const result = computeDepartmentBreakdown(fixtures);
    const total = result.reduce((s, d) => s + d.totalApplicants, 0);
    expect(total).toBe(fixtures.length);
  });
});
