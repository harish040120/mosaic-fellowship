import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SORT_KEYS = [
  { key: 'compositeScore', label: 'Composite' },
  { key: 'conversionRate', label: 'Conv. Rate' },
  { key: 'timeEfficiency', label: 'Time Eff.' },
  { key: 'offerAcceptRate', label: 'Offer Accept' },
  { key: 'referralEfficiency', label: 'Referral Eff.' },
  { key: 'totalApplicants', label: 'Applicants' },
];

const COLORS = [
  '#6366f1', '#818cf8', '#a78bfa', '#c084fc', '#e879f9',
  '#f472b6', '#fb923c', '#22c55e', '#38bdf8', '#facc15',
];

export default function DepartmentBreakdown({ departments }) {
  const [sortKey, setSortKey] = useState('compositeScore');
  const [sortAsc, setSortAsc] = useState(false);
  const [view, setView] = useState('table');

  const sorted = useMemo(() => {
    return [...departments].sort((a, b) =>
      sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
    );
  }, [departments, sortKey, sortAsc]);

  const best = Math.max(...departments.map(d => d.compositeScore));
  const worst = Math.min(...departments.map(d => d.compositeScore));

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const chartData = sorted.map(d => ({
    name: d.department,
    score: d.compositeScore,
  }));

  return (
    <div className="section">
      <h2 className="section-title">Department Breakdown</h2>

      <div className="dept-controls">
        <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>Table</button>
        <button className={view === 'chart' ? 'active' : ''} onClick={() => setView('chart')}>Chart</button>
      </div>

      {view === 'table' ? (
        <div style={{ overflowX: 'auto' }}>
          <table className="dept-table">
            <thead>
              <tr>
                <th>Department</th>
                {SORT_KEYS.map(s => (
                  <th
                    key={s.key}
                    className={sortKey === s.key ? 'sorted' : ''}
                    onClick={() => handleSort(s.key)}
                  >
                    {s.label} {sortKey === s.key ? (sortAsc ? '↑' : '↓') : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map(d => (
                <tr key={d.department}>
                  <td>{d.department}</td>
                  <td className={d.compositeScore === best ? 'best' : d.compositeScore === worst ? 'worst' : ''}>
                    {d.compositeScore}
                  </td>
                  <td>{d.conversionRate}%</td>
                  <td>{d.timeEfficiency}</td>
                  <td>{d.offerAcceptRate}%</td>
                  <td>{d.referralEfficiency}%</td>
                  <td>{d.totalApplicants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 40, left: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                angle={-35}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  background: '#1a1d27',
                  border: '1px solid #2a2d3a',
                  borderRadius: 8,
                  color: '#e4e4e7',
                }}
              />
              <Bar dataKey="score" name="Composite Score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <p style={{ color: 'var(--muted)', fontSize: '0.75rem', marginTop: '0.75rem' }}>
        <span style={{ color: 'var(--green)' }}>Green</span> = highest composite &middot;
        {' '}<span style={{ color: 'var(--red)' }}>Red</span> = lowest composite
      </p>
    </div>
  );
}
