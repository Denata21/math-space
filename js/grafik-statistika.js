/* ============================================================
   GRAFIK STATISTIKA (SVG, tanpa library eksternal)
   - Histogram (diagram batang)
   - Diagram lingkaran (pie chart)
   - Diagram batang horizontal
   ============================================================ */

function renderGrafikStatistika(container, arr) {
  if (!arr || arr.length === 0) {
    container.innerHTML = '';
    return;
  }

  const sorted = [...arr].sort((a, b) => a - b);
  const freq = {};
  arr.forEach(x => { freq[x] = (freq[x] || 0) + 1; });
  const labels = Object.keys(freq).map(Number).sort((a, b) => a - b);
  const values = labels.map(k => freq[k]);

  container.innerHTML = `
    <div class="calc-panel" style="margin-top:16px;">
      <h3 style="font-size:15px;margin-bottom:16px;color:var(--blue-dark);">
        📊 Visualisasi Data
      </h3>

      <div class="chart-grid">
        <div class="chart-card">
          <h4 style="font-size:13px;margin-bottom:10px;color:var(--gray-text);text-align:center;">
            Histogram (Frekuensi)
          </h4>
          ${buildHistogramSVG(labels, values)}
        </div>

        <div class="chart-card">
          <h4 style="font-size:13px;margin-bottom:10px;color:var(--gray-text);text-align:center;">
            Diagram Lingkaran
          </h4>
          ${buildPieSVG(labels, values)}
        </div>
      </div>

      <div style="margin-top:16px;">
        <h4 style="font-size:13px;margin-bottom:10px;color:var(--gray-text);">
          Diagram Batang Horizontal
        </h4>
        ${buildHorizontalBarSVG(labels, values)}
      </div>
    </div>
  `;
}

/* ----- Histogram (vertical bars) ----- */
function buildHistogramSVG(labels, values) {
  const width = 400;
  const height = 240;
  const padTop = 20, padBot = 40, padLeft = 40, padRight = 20;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBot;
  const maxV = Math.max(...values, 1);

  const barW = chartW / labels.length * 0.7;
  const gap = chartW / labels.length * 0.3;

  let svg = `<svg viewBox="0 0 ${width} ${height}" style="width:100%;max-width:${width}px;height:auto;display:block;margin:0 auto;">`;

  svg += `<line x1="${padLeft}" y1="${padTop}" x2="${padLeft}" y2="${padTop + chartH}" stroke="#cbd5e1" stroke-width="1"/>`;
  svg += `<line x1="${padLeft}" y1="${padTop + chartH}" x2="${padLeft + chartW}" y2="${padTop + chartH}" stroke="#cbd5e1" stroke-width="1"/>`;

  for (let i = 0; i <= 4; i++) {
    const y = padTop + chartH - (chartH * i / 4);
    const v = Math.round(maxV * i / 4);
    svg += `<line x1="${padLeft}" y1="${y}" x2="${padLeft + chartW}" y2="${y}" stroke="#e2e8f0" stroke-width="0.5" stroke-dasharray="3,3"/>`;
    svg += `<text x="${padLeft - 6}" y="${y + 4}" text-anchor="end" font-size="10" fill="#64748b">${v}</text>`;
  }

  labels.forEach((label, i) => {
    const x = padLeft + i * (barW + gap) + gap / 2;
    const h = (values[i] / maxV) * chartH;
    const y = padTop + chartH - h;

    svg += `<rect x="${x}" y="${y}" width="${barW}" height="${h}" fill="url(#gradBar)" rx="3"/>`;
    svg += `<text x="${x + barW / 2}" y="${y - 4}" text-anchor="middle" font-size="11" font-weight="600" fill="#1d4ed8">${values[i]}</text>`;
    svg += `<text x="${x + barW / 2}" y="${padTop + chartH + 15}" text-anchor="middle" font-size="11" fill="#334155">${label}</text>`;
  });

  svg += `
    <defs>
      <linearGradient id="gradBar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3b82f6"/>
        <stop offset="100%" stop-color="#1d4ed8"/>
      </linearGradient>
    </defs>
  `;

  svg += `</svg>`;
  return svg;
}

/* ----- Pie chart ----- */
function buildPieSVG(labels, values) {
  const size = 240;
  const cx = size / 2, cy = size / 2, r = 90;
  const total = values.reduce((s, v) => s + v, 0);

  const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626',
                  '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16',
                  '#f97316', '#0ea5e9'];

  let svg = `<svg viewBox="0 0 ${size} ${size}" style="width:100%;max-width:${size}px;height:auto;display:block;margin:0 auto;">`;

  let startAngle = -Math.PI / 2;
  labels.forEach((label, i) => {
    const frac = values[i] / total;
    const angle = frac * 2 * Math.PI;
    const endAngle = startAngle + angle;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = angle > Math.PI ? 1 : 0;
    const color = COLORS[i % COLORS.length];

    svg += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z"
              fill="${color}" stroke="white" stroke-width="2"/>`;

    const midAngle = startAngle + angle / 2;
    const tx = cx + (r * 0.65) * Math.cos(midAngle);
    const ty = cy + (r * 0.65) * Math.sin(midAngle);
    const pct = Math.round(frac * 100);
    if (pct >= 5) {
      svg += `<text x="${tx}" y="${ty + 4}" text-anchor="middle" font-size="11"
                font-weight="700" fill="white">${pct}%</text>`;
    }

    startAngle = endAngle;
  });

  svg += `</svg>`;

  let legend = '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:12px;">';
  labels.forEach((label, i) => {
    const color = COLORS[i % COLORS.length];
    const pct = Math.round(values[i] / total * 100);
    legend += `<span style="font-size:11px;display:inline-flex;align-items:center;gap:4px;">
      <span style="width:12px;height:12px;background:${color};border-radius:2px;display:inline-block;"></span>
      ${label} (${pct}%)
    </span>`;
  });
  legend += '</div>';

  return svg + legend;
}

/* ----- Horizontal bar ----- */
function buildHorizontalBarSVG(labels, values) {
  const width = 400;
  const rowH = 26;
  const height = labels.length * rowH + 20;
  const padLeft = 40, padRight = 40;
  const maxV = Math.max(...values, 1);
  const chartW = width - padLeft - padRight;

  let svg = `<svg viewBox="0 0 ${width} ${height}" style="width:100%;max-width:${width}px;height:auto;display:block;margin:0 auto;">`;

  labels.forEach((label, i) => {
    const y = 10 + i * rowH;
    const barW = (values[i] / maxV) * chartW;

    svg += `<text x="${padLeft - 6}" y="${y + 14}" text-anchor="end" font-size="11" fill="#334155">${label}</text>`;
    svg += `<rect x="${padLeft}" y="${y + 4}" width="${barW}" height="16" fill="#2563eb" rx="3"/>`;
    svg += `<text x="${padLeft + barW + 6}" y="${y + 16}" font-size="11" font-weight="600" fill="#1d4ed8">${values[i]}</text>`;
  });

  svg += `</svg>`;
  return svg;
}