const metrics = [
  { key: 'conversionRate', label: 'Conversion Rate', weight: '30%', suffix: '%' },
  { key: 'timeEfficiency', label: 'Time Efficiency', weight: '30%', suffix: '' },
  { key: 'offerAcceptRate', label: 'Offer Acceptance', weight: '20%', suffix: '%' },
  { key: 'referralEfficiency', label: 'Referral Efficiency', weight: '20%', suffix: '%' },
];

export default function Hero({ data }) {
  return (
    <div className="hero-grid">
      <div className="hero-score">
        <div className="label">Composite Hiring Efficiency Score</div>
        <div className="value">{data.compositeScore}</div>
        <div className="out-of">out of 100</div>
      </div>
      <div className="metric-cards">
        {metrics.map(m => (
          <div className="metric-card" key={m.key}>
            <div className="mc-label">{m.label}</div>
            <div className="mc-value">
              {data[m.key]}{m.suffix}
            </div>
            <div className="mc-weight">Weight: {m.weight}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
