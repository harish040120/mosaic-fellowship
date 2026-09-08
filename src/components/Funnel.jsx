import { useState } from 'react';

const STAGE_COLORS = [
  '#6366f1', // Applied
  '#818cf8', // Phone Screen
  '#a78bfa', // Technical Round
  '#c084fc', // Culture Fit
  '#e879f9', // Hiring Manager
  '#f472b6', // Offer Extended
  '#fb923c', // Offer Accepted
  '#22c55e', // Joined
];

export default function Funnel({ overall, byDepartment }) {
  const [selected, setSelected] = useState('__overall__');
  const departments = Object.keys(byDepartment).sort();
  const funnelData = selected === '__overall__' ? overall : byDepartment[selected];
  const maxCount = funnelData[0]?.count || 1;

  return (
    <div className="section">
      <h2 className="section-title">Hiring Funnel</h2>
      <div className="funnel-controls">
        <label htmlFor="dept-select">Department:</label>
        <select
          id="dept-select"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option value="__overall__">All Departments</option>
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>
      <div className="funnel-bar-container">
        {funnelData.map((stage, i) => {
          const pct = (stage.count / maxCount) * 100;
          return (
            <div className="funnel-row" key={stage.stage}>
              <span className="stage-name">{stage.stage}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${pct}%`,
                    background: STAGE_COLORS[i],
                  }}
                />
              </div>
              <span className="bar-count">{stage.count.toLocaleString()}</span>
            </div>
          );
        })}
      </div>
      <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '0.75rem' }}>
        Counts show applicants who <strong>reached at least</strong> each stage (cumulative).
      </p>
    </div>
  );
}
