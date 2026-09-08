// metrics.js — pure functions, no I/O, no dependencies
// Single source of truth for all 4 formulas + funnel/department aggregation

const STAGES = [
  'Applied',
  'Phone Screen',
  'Technical Round',
  'Culture Fit',
  'Hiring Manager',
  'Offer Extended',
  'Offer Accepted',
  'Joined',
];

const STAGE_INDEX = Object.fromEntries(STAGES.map((s, i) => [s, i]));

/**
 * Determine the highest stage index an applicant reached.
 * For Joined/Offer Accepted/Offer Extended (active stages), use current_stage directly.
 * For Rejected/Withdrew, infer from which fields are populated.
 */
function getStageIndex(applicant) {
  const { current_stage } = applicant;

  // Active terminal stages — trust current_stage
  if (current_stage === 'Joined') return 7;
  if (current_stage === 'Offer Accepted') return 6;
  if (STAGE_INDEX[current_stage] !== undefined) {
    return STAGE_INDEX[current_stage];
  }

  // Rejected / Withdrew — infer from populated fields (highest first)
  if (applicant.offered_ctc != null) return 5; // Offer Extended
  if (applicant.hiring_manager_score != null) return 4;
  if (applicant.culture_fit_score != null) return 3;
  if (applicant.technical_score != null) return 2;
  if (applicant.phone_screen_score != null) return 1;
  return 0; // Applied only
}

// ─── Metric 1: Conversion Rate ──────────────────────────────────────────────
// (Joined ÷ total applicants) × 100
function computeConversionRate(applicants) {
  const joined = applicants.filter(a => a.current_stage === 'Joined').length;
  return (joined / applicants.length) * 100;
}

// ─── Metric 2: Time Efficiency ──────────────────────────────────────────────
// (1 − min(avg_days_to_hire, 100) ÷ 100) × 100
// Only for applicants whose current_stage === "Joined"
function computeTimeEfficiency(applicants) {
  const joined = applicants.filter(a => a.current_stage === 'Joined');
  if (joined.length === 0) return 100; // edge case: no hires = perfect time?
  const avgDays = joined.reduce((sum, a) => sum + (a.total_process_days || 0), 0) / joined.length;
  return (1 - Math.min(avgDays, 100) / 100) * 100;
}

// ─── Metric 3: Offer Acceptance Rate ────────────────────────────────────────
// (Offer Accepted + Joined) ÷ (Offer Extended + Offer Accepted + Joined) × 100
function computeOfferAcceptanceRate(applicants) {
  const offerExtended = applicants.filter(a => a.current_stage === 'Offer Extended').length;
  const offerAccepted = applicants.filter(a => a.current_stage === 'Offer Accepted').length;
  const joined = applicants.filter(a => a.current_stage === 'Joined').length;
  const denom = offerExtended + offerAccepted + joined;
  if (denom === 0) return 0;
  return ((offerAccepted + joined) / denom) * 100;
}

// ─── Metric 4: Referral Efficiency ──────────────────────────────────────────
// (referral applicants who Joined ÷ total referral applicants) × 100
// referral = source === "Employee Referral"
function computeReferralEfficiency(applicants) {
  const referrals = applicants.filter(a => a.source === 'Employee Referral');
  if (referrals.length === 0) return 0;
  const joinedReferrals = referrals.filter(a => a.current_stage === 'Joined').length;
  return (joinedReferrals / referrals.length) * 100;
}

// ─── Composite Score ────────────────────────────────────────────────────────
function computeCompositeScore(applicants) {
  const conversionRate = computeConversionRate(applicants);
  const timeEfficiency = computeTimeEfficiency(applicants);
  const offerAcceptRate = computeOfferAcceptanceRate(applicants);
  const referralEfficiency = computeReferralEfficiency(applicants);

  const compositeScore =
    conversionRate * 0.3 +
    timeEfficiency * 0.3 +
    offerAcceptRate * 0.2 +
    referralEfficiency * 0.2;

  return {
    conversionRate: Math.round(conversionRate * 100) / 100,
    timeEfficiency: Math.round(timeEfficiency * 100) / 100,
    offerAcceptRate: Math.round(offerAcceptRate * 100) / 100,
    referralEfficiency: Math.round(referralEfficiency * 100) / 100,
    compositeScore: Math.round(compositeScore * 100) / 100,
  };
}

// ─── Funnel: cumulative "reached at least this stage" counts ────────────────
// Returns an array of { stage, count } for the 8 stages, where count is the
// number of applicants who reached AT LEAST that stage.
function computeFunnelCounts(applicants) {
  const counts = new Array(STAGES.length).fill(0);
  for (const a of applicants) {
    const idx = getStageIndex(a);
    // This applicant reached stage idx, so they reached all stages 0..idx
    for (let i = 0; i <= idx; i++) {
      counts[i]++;
    }
  }
  return STAGES.map((stage, i) => ({ stage, count: counts[i] }));
}

// ─── Funnel by department ───────────────────────────────────────────────────
function computeFunnelByDepartment(applicants) {
  const byDept = {};
  for (const a of applicants) {
    if (!byDept[a.department]) byDept[a.department] = [];
    byDept[a.department].push(a);
  }
  const result = {};
  for (const [dept, deptApplicants] of Object.entries(byDept)) {
    result[dept] = computeFunnelCounts(deptApplicants);
  }
  return result;
}

// ─── Department Breakdown ───────────────────────────────────────────────────
// For each department, run all 4 metrics + composite score
function computeDepartmentBreakdown(applicants) {
  const byDept = {};
  for (const a of applicants) {
    if (!byDept[a.department]) byDept[a.department] = [];
    byDept[a.department].push(a);
  }
  return Object.entries(byDept).map(([department, deptApplicants]) => ({
    department,
    totalApplicants: deptApplicants.length,
    ...computeCompositeScore(deptApplicants),
  }));
}

export {
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
};
