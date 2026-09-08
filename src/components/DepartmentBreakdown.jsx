import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SORT_KEYS = [
  { key: 'compositeScore', label: 'Composite' },
  { key: 'conversionRate', label: 'Conv. Rate' },
  { key: 'timeEfficiency', label: 'Time Eff.' },
  { key: 'offerAcceptRate', label: 'Offer Accept' },
  { key: 'referralEfficiency', label: 'Referral Eff.' },
  { key: 'totalApplicants', label: 'Applicants' },
];

const CHART_COLORS = [
  '#1F5F4A', '#2E7D5B', '#3D9B6E', '#4FBF97', '#6ECFAD',
  '#8EDCBE', '#B5651D', '#A13D3D', '#5C5A54', '#8B8880',
];

function SortIcon({ active, asc }) {
  if (!active) return <ArrowUpDown size={12} />;
  return asc ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
}

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
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  };

  const chartData = sorted.map(d => ({ name: d.department, score: d.compositeScore }));

  return (
    <div className="section" id="breakdown">
      <div className="section-header">
        <div className="eyebrow">Performance Comparison</div>
        <h2 className="section-title">Department Breakdown</h2>
      </div>

      <div className="dept-controls">
        <button className={view === 'table' ? 'active' : ''} onClick={() => setView('table')}>Table</button>
        <button className={view === 'chart' ? 'active' : ''} onClick={() => setView('chart')}>Chart</button>
      </div>

      {view === 'table' ? (
        <>
          <div className="table-scroll-hint">Scroll horizontally to see all columns →</div>
          <div className="table-wrap">
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
                      {s.label}
                      <span className="sort-icon">
                        <SortIcon active={sortKey === s.key} asc={sortAsc} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map(d => {
                  const rowClass = d.compositeScore === best ? 'row-best' : d.compositeScore === worst ? 'row-worst' : '';
                  return (
                    <motion.tr
                      key={d.department}
                      className={rowClass}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td className="dept-name">{d.department}</td>
                      <td>{d.compositeScore}</td>
                      <td>{d.conversionRate}%</td>
                      <td>{d.timeEfficiency}</td>
                      <td>{d.offerAcceptRate}%</td>
                      <td>{d.referralEfficiency}%</td>
                      <td>{d.totalApplicants}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 20, bottom: 40, left: 0 }}>
              <XAxis
                dataKey="name"
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                angle={-35}
                textAnchor="end"
                height={80}
                axisLine={{ stroke: 'var(--border-subtle)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  color: 'var(--text-primary)',
                  fontSize: 13,
                }}
              />
              <Bar dataKey="score" name="Composite Score" radius={[6, 6, 0, 0]}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
