import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Funnel({ overall, byDepartment }) {
  const [selected, setSelected] = useState('__overall__');
  const departments = Object.keys(byDepartment).sort();
  const funnelData = selected === '__overall__' ? overall : byDepartment[selected];
  const maxCount = funnelData[0]?.count || 1;

  return (
    <div className="section" id="funnel">
      <div className="section-header">
        <div className="eyebrow">Funnel Analysis</div>
        <h2 className="section-title">Hiring Funnel</h2>
      </div>

      <div className="funnel-controls">
        <label htmlFor="dept-select">Department</label>
        <select
          id="dept-select"
          className="funnel-select"
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
          const prevCount = i > 0 ? funnelData[i - 1].count : stage.count;
          const dropPct = i > 0 && prevCount > 0
            ? (((prevCount - stage.count) / prevCount) * 100).toFixed(1)
            : null;
          const dropped = dropPct !== null && parseFloat(dropPct) > 0;

          return (
            <motion.div
              className="funnel-row"
              key={stage.stage}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <span className="stage-name">{stage.stage}</span>
              <div className="bar-track">
                <motion.div
                  className="bar-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.04, ease: [0.4, 0, 0.2, 1] }}
                />
              </div>
              <span className="bar-count">{stage.count.toLocaleString()}</span>
              <span className={`bar-drop ${!dropped ? 'none' : ''}`}>
                {dropped ? `-${dropPct}%` : '—'}
              </span>
            </motion.div>
          );
        })}
      </div>

      <p className="funnel-note">
        Counts show applicants who reached at least each stage (cumulative). Drop % shows loss from previous stage.
      </p>
    </div>
  );
}
