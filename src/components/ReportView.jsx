import { useRef } from 'react';

export default function ReportView({ data, funnelOverall, departmentBreakdown }) {
  return (
    <div className="report-view" id="report-view">
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888', marginBottom: 8 }}>
          Sieve
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
        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8 }}>Hiring Funnel - All Departments</div>
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

  // Show element for rendering
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

    // Single-canvas approach: capture entire report as one image
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: 800,
      windowWidth: 800,
    });

    const imgData = canvas.toDataURL('image/png');
    const imgW = contentW;
    const imgH = (canvas.height * imgW) / canvas.width;

    // Add to PDF with auto-pagination
    let yPos = 0;
    let page = 1;
    const maxPageHeight = pageH - margin * 2 - 10; // leave footer space
    const totalPages = Math.ceil(imgH / maxPageHeight);

    while (yPos < imgH) {
      if (page > 1) pdf.addPage();

      const srcY = yPos * (canvas.height / imgH);
      const srcH = Math.min(maxPageHeight * (canvas.height / imgH), canvas.height - srcY);
      const srcW = canvas.width;

      // Create a slice canvas for this page
      const sliceCanvas = document.createElement('canvas');
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = srcH;
      const ctx = sliceCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, srcY, srcW, srcH, 0, 0, srcW, srcH);

      const sliceData = sliceCanvas.toDataURL('image/png');
      const finalH = (srcH * contentW) / srcW;

      pdf.addImage(sliceData, 'PNG', margin, margin, contentW, finalH);

      // Footer on every page
      pdf.setFontSize(7);
      pdf.setTextColor(150);
      pdf.text(`Page ${page} of ${totalPages}`, pageW / 2, pageH - 6, { align: 'center' });
      pdf.text('https://effervescent-squirrel-574374.netlify.app/', margin, pageH - 6);

      yPos += maxPageHeight;
      page++;
    }

    const today = new Date().toISOString().split('T')[0];
    pdf.save(`hiring-funnel-report-${today}.pdf`);
  } catch (e) {
    // Re-throw so App.jsx can show the error
    throw new Error('PDF export failed: ' + e.message);
  } finally {
    // Always hide the element
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    el.style.zIndex = '';
    el.style.opacity = '';
    el.style.pointerEvents = '';
  }
}
