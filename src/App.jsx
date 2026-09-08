import { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Funnel from './components/Funnel';
import DepartmentBreakdown from './components/DepartmentBreakdown';
import Writeup from './components/Writeup';
import './App.css';

export default function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/data/results.json')
      .then(r => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Hiring Funnel Analytics</h1>
        <p className="subtitle">3,000 applicants across 10 departments — how efficient is the hiring process?</p>
      </header>
      <Hero data={data.companyWide} />
      <Funnel
        overall={data.funnelOverall}
        byDepartment={data.funnelByDepartment}
      />
      <DepartmentBreakdown departments={data.departmentBreakdown} />
      <Writeup />
      <footer className="footer">
        <p>Generated {new Date(data.generatedAt).toLocaleDateString()} &middot; Composite Hiring Efficiency Score: <strong>{data.companyWide.compositeScore}</strong></p>
      </footer>
    </div>
  );
}
