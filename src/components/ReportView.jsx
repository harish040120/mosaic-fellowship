export default function ReportView({ data, funnelOverall, departmentBreakdown }) {
  return (
    <div className="report-view" id="report-view">
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>
          Sieve - a hiring funnel is literally a sieve
        </div>
        <div style={{ fontSize: 14, color: '#666', marginBottom: 4 }}>
          Generated {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div style={{ marginBottom: 32, textAlign: 'center', padding: '32px 0', borderBottom: '1px solid #e0e0e0' }}>
        <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888', marginBottom: 8 }}>
          Composite Hiring Efficiency Score
        </div>
        <div style={{ fontSize: 56, fontWeight: 700, color: '#1a1a18', fontVariantNumeric: 'tabular-nums' }}>
          {data.compositeScore}
        </div>
        <div style={{ fontSize: 13, color: '#888' }}>out of 100</div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 32, fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '2px solid #ddd', color: '#666', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Metric</th>
            <th style={{ textAlign: 'right', padding: '8px 12px', borderBottom: '2px solid #ddd', color: '#666', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Value</th>
            <th style={{ textAlign: 'right', padding: '8px 12px', borderBottom: '2px solid #ddd', color: '#666', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Weight</th>
          </tr>
        </thead>
        <tbody>
          {[
            ['Conversion Rate', `${data.conversionRate}%`, '30%'],
            ['Time Efficiency', `${data.timeEfficiency}`, '30%'],
            ['Offer Acceptance Rate', `${data.offerAcceptRate}%`, '20%'],
            ['Referral Efficiency', `${data.referralEfficiency}%`, '20%'],
          ].map(([label, value, weight]) => (
            <tr key={label}>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid #eee' }}>{label}</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid #eee', textAlign: 'right', fontWeight: 600 }}>{value}</td>
              <td style={{ padding: '8px 12px', borderBottom: '1px solid #eee', textAlign: 'right', color: '#888' }}>{weight}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>Hiring Funnel — All Departments</div>
        {funnelOverall.map((stage, i) => {
          const max = funnelOverall[0].count;
          const pct = (stage.count / max) * 100;
          return (
            <div key={stage.stage} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, fontSize: 12 }}>
              <span style={{ width: 120, textAlign: 'right', color: '#666' }}>{stage.stage}</span>
              <div style={{ flex: 1, height: 16, background: '#f0f0f0', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: '#1F5F4A', borderRadius: 4 }} />
              </div>
              <span style={{ width: 48, textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{stage.count.toLocaleString()}</span>
            </div>
          );
        })}
      </div>

      <div style={{ marginBottom: 32 }} id="dept-breakdown-table">
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>Department Breakdown</div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
          <thead>
            <tr>
              {['Department', 'Composite', 'Conv. Rate', 'Time Eff.', 'Offer Accept', 'Referral Eff.', 'Applicants'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '2px solid #ddd', color: '#666', fontWeight: 600, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {departmentBreakdown.map(d => (
              <tr key={d.department}>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #eee' }}>{d.department}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #eee', fontWeight: 600 }}>{d.compositeScore}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #eee' }}>{d.conversionRate}%</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #eee' }}>{d.timeEfficiency}</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #eee' }}>{d.offerAcceptRate}%</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #eee' }}>{d.referralEfficiency}%</td>
                <td style={{ padding: '6px 8px', borderBottom: '1px solid #eee' }}>{d.totalApplicants}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>Top 3 Things to Fix</div>
        {[
          { title: 'Shorten Time-to-Hire', text: 'Average time-to-hire is 81 days (Time Efficiency: 18.64/100). The 7-stage process accumulates delays at every handoff. Consolidate or parallelize stages and set SLAs for transitions.' },
          { title: 'Fix the Referral Pipeline', text: 'Employee referrals convert at just 1.57% (6 of 382 joined) vs. 2.87% overall. Audit referral quality, implement expedited processing, and review incentive structures.' },
          { title: 'Reduce Offer-to-Join Leakage', text: 'Of 1,524 who reached Offer Extended, only 86 joined (5.6%). Benchmark CTC, tighten the offer loop, and implement candidate follow-up sequences.' },
        ].map((fix, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 4 }}>{i + 1}. {fix.title}</div>
            <div style={{ fontSize: 11, color: '#555', lineHeight: 1.6 }}>{fix.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function generatePDF(data) {
  const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
    import('jspdf'),
    import('html2canvas'),
  ]);

  const el = document.getElementById('report-view');
  if (!el) throw new Error('Report view not found');

  el.style.position = 'fixed';
  el.style.left = '0';
  el.style.top = '0';
  el.style.zIndex = '-1';
  el.style.opacity = '1';
  el.style.pointerEvents = 'none';

  await new Promise(r => setTimeout(r, 200));

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 12;
    const contentW = pageW - margin * 2;

    const funnelEl = el.querySelector('[style*="Hiring Funnel"]')?.parentElement;
    const tableEl = document.getElementById('dept-breakdown-table');

    // Capture funnel chart as image
    let funnelImgData = null;
    if (funnelEl) {
      const funnelCanvas = await html2canvas(funnelEl, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      funnelImgData = funnelCanvas.toDataURL('image/png');
    }

    // PAGE 1: Title, Score, Metrics, Funnel
    let y = margin;

    // Title block
    pdf.setFontSize(10);
    pdf.setTextColor(136);
    pdf.text('Hiring Funnel Analytics Report', margin, y);
    y += 5;
    pdf.setFontSize(12);
    pdf.text(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), margin, y);
    y += 10;

    // Composite Score
    pdf.setFontSize(10);
    pdf.setTextColor(136);
    pdf.text('COMPOSITE HIRING EFFICIENCY SCORE', margin, y);
    y += 6;
    pdf.setFontSize(36);
    pdf.setTextColor(26, 26, 24);
    pdf.setFont('helvetica', 'bold');
    pdf.text(String(data.compositeScore), margin, y);
    y += 14;
    pdf.setFontSize(10);
    pdf.setTextColor(136);
    pdf.setFont('helvetica', 'normal');
    pdf.text('out of 100', margin, y);
    y += 10;

    // Progress bar
    const barW = contentW;
    const barH = 2;
    pdf.setDrawColor(224);
    pdf.setFillColor(224);
    pdf.rect(margin, y, barW, barH, 'FD');
    const fillW = (data.compositeScore / 100) * barW;
    pdf.setFillColor(31, 95, 74);
    pdf.rect(margin, y, fillW, barH, 'F');
    y += 10;

    // Metrics table
    pdf.setFontSize(11);
    pdf.setTextColor(102);
    pdf.setFont('helvetica', 'bold');
    const colWidths = [contentW * 0.5, contentW * 0.25, contentW * 0.25];
    const colX = [margin, margin + colWidths[0], margin + colWidths[0] + colWidths[1]];
    
    pdf.setFontSize(9);
    pdf.text('Metric', colX[0], y);
    pdf.text('Value', colX[1], y);
    pdf.text('Weight', colX[2], y);
    y += 5;
    pdf.setDrawColor(221);
    pdf.line(margin, y, pageW - margin, y);
    y += 6;

    const metrics = [
      ['Conversion Rate', `${data.conversionRate}%`, '30%'],
      ['Time Efficiency', `${data.timeEfficiency}`, '30%'],
      ['Offer Acceptance Rate', `${data.offerAcceptRate}%`, '20%'],
      ['Referral Efficiency', `${data.referralEfficiency}%`, '20%'],
    ];

    pdf.setFontSize(10);
    pdf.setTextColor(51);
    pdf.setFont('helvetica', 'normal');
    metrics.forEach(([label, value, weight], i) => {
      if (i % 2 === 0) {
        pdf.setFillColor(248);
        pdf.rect(margin, y - 1, contentW, 7, 'F');
      }
      pdf.text(label, colX[0], y + 5);
      pdf.text(value, colX[1], y + 5);
      pdf.text(weight, colX[2], y + 5);
      y += 7;
    });
    y += 6;

    // Funnel Chart
    pdf.setFontSize(11);
    pdf.setTextColor(51);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Hiring Funnel — All Departments', margin, y);
    y += 8;

    if (funnelImgData) {
      const imgProps = pdf.getImageProperties(funnelImgData);
      const imgW = contentW;
      const imgH = (imgProps.height * imgW) / imgProps.width;
      const maxH = 80;
      const finalH = Math.min(imgH, maxH);
      const finalW = (imgProps.width * finalH) / imgProps.height;
      
      pdf.addImage(funnelImgData, 'PNG', margin, y, finalW, finalH);
      y += finalH + 8;
    }

    // Footer page 1
    pdf.setFontSize(7);
    pdf.setTextColor(150);
    pdf.text('Page 1 of 3', pageW / 2, pageH - 6, { align: 'center' });
    pdf.text('https://effervescent-squirrel-574374.netlify.app/', margin, pageH - 6);

    // PAGE 2: Department Breakdown Table
    pdf.addPage();
    y = margin;

    pdf.setFontSize(11);
    pdf.setTextColor(51);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Department Breakdown', margin, y);
    y += 6;
    pdf.setDrawColor(221);
    pdf.line(margin, y, pageW - margin, y);
    y += 8;

    // Table headers
    const headers = ['Department', 'Composite', 'Conv. Rate', 'Time Eff.', 'Offer Accept', 'Referral Eff.', 'Applicants'];
    const tableColWidths = [contentW * 0.22, contentW * 0.13, contentW * 0.13, contentW * 0.13, contentW * 0.13, contentW * 0.13, contentW * 0.13];
    const tableColX = tableColWidths.reduce((acc, w) => [...acc, acc[acc.length - 1] + w], [margin]).slice(0, -1);

    pdf.setFontSize(8);
    pdf.setTextColor(102);
    pdf.setFont('helvetica', 'bold');
    headers.forEach((h, i) => {
      pdf.text(h, tableColX[i], y);
    });
    y += 4;
    pdf.setDrawColor(221);
    pdf.line(margin, y, pageW - margin, y);
    y += 5;

    // Table rows
    pdf.setFontSize(8);
    pdf.setTextColor(51);
    pdf.setFont('helvetica', 'normal');
    const sortedDepts = [...data.departmentBreakdown].sort((a, b) => b.compositeScore - a.compositeScore);
    
    sortedDepts.forEach((d, i) => {
      if (y > pageH - 30) {
        pdf.addPage();
        y = margin;
        // Repeat headers
        pdf.setFontSize(8);
        pdf.setTextColor(102);
        pdf.setFont('helvetica', 'bold');
        headers.forEach((h, j) => {
          pdf.text(h, tableColX[j], y);
        });
        y += 4;
        pdf.setDrawColor(221);
        pdf.line(margin, y, pageW - margin, y);
        y += 5;
        pdf.setFontSize(8);
        pdf.setTextColor(51);
        pdf.setFont('helvetica', 'normal');
      }

      if (i % 2 === 0) {
        pdf.setFillColor(248);
        pdf.rect(margin, y - 1, contentW, 6, 'F');
      }

      const values = [
        d.department,
        String(d.compositeScore),
        `${d.conversionRate}%`,
        String(d.timeEfficiency),
        `${d.offerAcceptRate}%`,
        `${d.referralEfficiency}%`,
        String(d.totalApplicants),
      ];
      values.forEach((v, j) => {
        pdf.text(v, tableColX[j], y + 5);
      });
      y += 6;
    });
    y += 10;

    // Top 3 Things to Fix
    pdf.setFontSize(11);
    pdf.setTextColor(51);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Top 3 Things to Fix', margin, y);
    y += 6;
    pdf.setDrawColor(221);
    pdf.line(margin, y, pageW - margin, y);
    y += 8;

    const fixes = [
      { 
        title: 'Shorten Time-to-Hire', 
        text: 'Average time-to-hire is 81 days (Time Efficiency: 18.64/100). The 7-stage process accumulates delays at every handoff. Consolidate or parallelize stages and set SLAs for transitions.' 
      },
      { 
        title: 'Fix the Referral Pipeline', 
        text: 'Employee referrals convert at just 1.57% (6 of 382 joined) vs. 2.87% overall. Audit referral quality, implement expedited processing, and review incentive structures.' 
      },
      { 
        title: 'Reduce Offer-to-Join Leakage', 
        text: 'Of 1,524 who reached Offer Extended, only 86 joined (5.6%). Benchmark CTC, tighten the offer loop, and implement candidate follow-up sequences.' 
      },
    ];

    pdf.setFontSize(10);
    pdf.setTextColor(51);
    pdf.setFont('helvetica', 'normal');
    
    fixes.forEach((fix, i) => {
      if (y > pageH - 30) {
        pdf.addPage();
        y = margin;
      }
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(10);
      pdf.text(`${i + 1}. ${fix.title}`, margin, y);
      y += 6;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      const splitText = pdf.splitTextToSize(fix.text, contentW);
      pdf.text(splitText, margin, y);
      y += splitText.length * 5 + 8;
    });

    // Footer for all pages
    const totalPages = pdf.internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      pdf.setPage(p);
      pdf.setFontSize(7);
      pdf.setTextColor(150);
      pdf.text(`Page ${p} of ${totalPages}`, pageW / 2, pageH - 6, { align: 'center' });
      pdf.text('https://effervescent-squirrel-574374.netlify.app/', margin, pageH - 6);
    }

    const today = new Date().toISOString().split('T')[0];
    pdf.save(`hiring-funnel-report-${today}.pdf`);
  } finally {
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    el.style.zIndex = '';
    el.style.opacity = '';
    el.style.pointerEvents = '';
  }
}