import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Download, Loader2 } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const step = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(eased * value);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);

  return <span ref={ref}>{display.toFixed(2)}</span>;
}

const metricMeta = [
  { key: 'conversionRate', label: 'Conversion Rate', weight: '30%', suffix: '%', status: 'critical' },
  { key: 'timeEfficiency', label: 'Time Efficiency', weight: '30%', suffix: '', status: 'critical' },
  { key: 'offerAcceptRate', label: 'Offer Acceptance', weight: '20%', suffix: '%', status: 'good' },
  { key: 'referralEfficiency', label: 'Referral Efficiency', weight: '20%', suffix: '%', status: 'critical' },
];

export default function Hero({ data, onExport, exporting }) {
  return (
    <div className="hero-grid">
      <motion.div
        className="hero-score"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="score-label">Composite Hiring Efficiency Score</div>
        <div className="score-value">
          <AnimatedNumber value={data.compositeScore} />
        </div>
        <div className="score-of">out of 100</div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${data.compositeScore}%` }} />
        </div>
      </motion.div>

      <div className="metric-cards">
        {metricMeta.map((m, i) => (
          <motion.div
            className={`metric-card ${m.status}`}
            key={m.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
          >
            <div className="mc-label">{m.label}</div>
            <div className="mc-value">{data[m.key]}{m.suffix}</div>
            <div className="mc-weight">Weight: {m.weight}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export { ThemeToggle };
