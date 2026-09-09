import { useState, useEffect } from 'react';
import { Download, Loader2 } from 'lucide-react';
import Hero from './components/Hero';
import Funnel from './components/Funnel';
import DepartmentBreakdown from './components/DepartmentBreakdown';
import Writeup from './components/Writeup';
import ThemeToggle from './components/ThemeToggle';
import ReportView from './components/ReportView';
import { ThemeProvider } from './context/ThemeContext';
import { generatePDF } from './components/ReportView';
import './App.css';

function AppInner() {
  const [data, setData] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/results.json')
      .then(r => r.json())
      .then(setData);
  }, []);

  const handleExport = async () => {
    setExporting(true);
    setError(null);
    try {
      await generatePDF(data);
    } catch (e) {
      setError('Export failed. Please try again.');
      console.error(e);
    } finally {
      setExporting(false);
    }
  };

  if (!data) return <div className="loading">Loading...</div>;

  return (
    <>
      <nav className="sticky-nav">
        <div className="container">
          <div className="sticky-nav-inner">
            <a href="#score">Score</a>
            <a href="#funnel">Funnel</a>
            <a href="#breakdown">Breakdown</a>
            <a href="#writeup">Write-up</a>
          </div>
        </div>
      </nav>

      <div className="container">
        <header className="header">
          <div className="header-top">
            <div>
              <div className="eyebrow">Sieve</div>
              <h1>Sieve - a hiring funnel is literally a sieve</h1>
              <p className="subtitle">3,000 applicants across 10 departments - how efficient is the hiring process?</p>
            </div>
            <div className="header-actions">
              <button
                className="export-btn"
                onClick={handleExport}
                disabled={exporting}
                aria-label="Export PDF report"
              >
                {exporting ? <Loader2 size={15} className="spin" /> : <Download size={15} />}
                {exporting ? 'Exporting…' : 'Export PDF'}
              </button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div id="score">
          <Hero data={data.companyWide} />
        </div>

        <Funnel
          overall={data.funnelOverall}
          byDepartment={data.funnelByDepartment}
        />

        <DepartmentBreakdown departments={data.departmentBreakdown} />

        <Writeup />

        <footer className="footer">
          <p>Generated {new Date(data.generatedAt).toLocaleDateString()} · Sieve — Composite Hiring Efficiency Score: <strong>{data.companyWide.compositeScore}</strong></p>
        </footer>
      </div>

      {error && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, background: 'var(--accent-critical)',
          color: '#fff', padding: '12px 20px', borderRadius: 10, fontSize: 14, zIndex: 9999,
        }}>
          {error}
        </div>
      )}
      <ReportView
        data={data.companyWide}
        funnelOverall={data.funnelOverall}
        departmentBreakdown={data.departmentBreakdown}
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
