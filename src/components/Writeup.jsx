export default function Writeup() {
  return (
    <div className="section">
      <div className="writeup">
        <h2>Top 3 Things to Fix</h2>

        <p>
          The company's composite hiring efficiency score of <strong>20.66/100</strong> reveals
          significant room for improvement. Below are the three highest-leverage changes
          based on the data analysis.
        </p>

        <h3>1. Shorten Time-to-Hire (biggest drag at 18.64/100)</h3>
        <p>
          With an average of <strong>81 days</strong> from application to join, time efficiency
          is the weakest metric. The process spans 7 stages — each adding days. The steepest
          drop-offs occur between Offer Extended and Offer Accepted (1,524 → 173), suggesting
          slow or uncompetitive offer cycles. Reducing average time-to-hire by even 20 days
          would raise the time efficiency score by ~20 points, the single largest possible
          improvement to the composite.
        </p>

        <h3>2. Investigate Referral Channel Underperformance (1.57%)</h3>
        <p>
          Employee referrals — typically the highest-converting channel — yield only a
          <strong>1.57% join rate</strong> across 382 referral applicants. This is dramatically
          worse than the overall conversion rate of 2.87%. Either the referral pipeline is
          attracting low-fit candidates, or the process is losing strong referral candidates
          at later stages. Auditing referral quality vs. other sources and ensuring referred
          candidates get priority processing could substantially lift the composite score.
        </p>

        <h3>3. Fix the Offer-to-Join Leak</h3>
        <p>
          Of 1,524 applicants who reached Offer Extended, only 86 ultimately joined — a
          <strong>5.6% offer-to-join conversion</strong>. The Offer Acceptance Rate itself is
          69.48% (173 accepted + 86 joined out of 249 in the offer funnel), but the real leak
          is the 1,351 candidates who received offers and neither accepted nor joined. This
          points to uncompetitive compensation, slow offer turnaround, or candidate experience
          issues during the final stages. Tightening the offer loop and benchmarking CTC against
          market rates would directly improve both conversion and time efficiency.
        </p>
      </div>
    </div>
  );
}
