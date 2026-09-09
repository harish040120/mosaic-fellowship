import { motion } from 'framer-motion';

const fixes = [
  {
    title: 'Shorten Time-to-Hire',
    problem: 'Average time-to-hire is 81 days (Time Efficiency score: 18.64/100). The 7-stage process accumulates delays at every handoff.',
    why: 'Time efficiency is the single largest drag on the composite score. A 20-day reduction would add ~20 points to this metric alone  -  the biggest possible improvement.',
    next: 'Consolidate or parallelize stages (e.g., combine Culture Fit + Hiring Manager rounds). Set SLAs for each stage transition and track average cycle times per department.',
  },
  {
    title: 'Fix the Referral Pipeline',
    problem: 'Employee referrals convert at just 1.57% (6 of 382 joined), dramatically below the overall 2.87% conversion rate.',
    why: 'Referred candidates should be the highest-quality, fastest-to-hire channel. This underperformance suggests referrals are either not being prioritized or are filtering out at later stages.',
    next: 'Audit referral quality vs. other sources. Implement expedited processing for referred candidates. Review the referral incentive structure to ensure it motivates strong referrals.',
  },
  {
    title: 'Reduce Offer-to-Join Leakage',
    problem: 'Of 1,524 applicants who reached Offer Extended, only 86 joined  -  a 5.6% offer-to-join conversion. The Offer Acceptance Rate is 69.48%, but 1,351 candidates received offers and neither accepted nor joined.',
    why: 'This massive leak at the final stage wastes all the time and resources invested in earlier rounds. It points to uncompetitive compensation, slow offer turnaround, or poor candidate experience.',
    next: 'Benchmark CTC against market rates. Tighten the offer loop with faster turnaround. Implement candidate follow-up sequences for pending offers.',
  },
];

export default function Writeup() {
  return (
    <div className="section" id="writeup">
      <div className="section-header">
        <div className="eyebrow">Analysis</div>
        <h2 className="section-title">Top 3 Things to Fix</h2>
      </div>

      <div className="writeup">
        <p className="writeup-intro">
          The company's composite hiring efficiency score of <strong>20.66/100</strong> reveals
          significant room for improvement. Below are the three highest-leverage changes,
          structured as data-driven diagnosis and actionable next steps.
        </p>

        {fixes.map((fix, i) => (
          <motion.div
            className="writeup-item"
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <h3>{i + 1}. {fix.title}</h3>
            <div className="writeup-label">Problem</div>
            <p className="writeup-text">{fix.problem}</p>
            <div className="writeup-label">Why It Matters</div>
            <p className="writeup-text">{fix.why}</p>
            <div className="writeup-label">Suggested Next Step</div>
            <p className="writeup-text">{fix.next}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
