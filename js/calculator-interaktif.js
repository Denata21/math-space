/* ============================================================
   KALKULATOR ANUITAS INTERAKTIF (Slider & Grafik Real-Time)
   ============================================================ */

function renderKalkulatorInteraktif(container) {
  container.innerHTML = `
    <div class="calc-panel">
      <div class="calc-hint">
        <strong>🎮 Mode Eksplorasi:</strong> Geser slider di bawah ini untuk melihat bagaimana perubahan bunga dan waktu mempengaruhi total pinjamanmu secara <i>real-time</i>.
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Pinjaman Awal (M0)</label>
          <input type="text" id="int_M0" class="form-control input-rupiah" value="20.000.000" oninput="handleRupiahInput(this); updateKalkulatorInteraktif();">
        </div>
        <div class="form-group">
          <label>Frekuensi Bayar</label>
          <select id="int_freq" class="form-control" onchange="updateKalkulatorInteraktif()">
            <option value="12">Bulanan (12x/tahun)</option>
            <option value="4">Kuartalan (4x/tahun)</option>
            <option value="1">Tahunan (1x/tahun)</option>
          </select>
        </div>
      </div>

      <div class="form-group" style="margin-top: 10px;">
        <label>Suku Bunga per Tahun (i): <span id="lbl_i" style="color:var(--blue); font-weight:bold; font-size:16px;">10%</span></label>
        <input type="range" id="int_i" class="custom-slider" min="1" max="20" step="0.5" value="10" 
               oninput="document.getElementById('lbl_i').innerText = this.value + '%'; updateKalkulatorInteraktif();">
      </div>

      <div class="form-group" style="margin-top: 20px;">
        <label>Lama Pinjaman (n): <span id="lbl_n" style="color:var(--blue); font-weight:bold; font-size:16px;">3 Tahun</span></label>
        <input type="range" id="int_n" class="custom-slider" min="1" max="10" step="1" value="3" 
               oninput="document.getElementById('lbl_n').innerText = this.value + ' Tahun'; updateKalkulatorInteraktif();">
      </div>

      <div id="int_result" style="margin-top:20px; padding-top:20px; border-top:2px dashed var(--gray-border);"></div>
    </div>
  `;
  updateKalkulatorInteraktif();
}

function updateKalkulatorInteraktif() {
  const rawM0 = document.getElementById('int_M0').value;
  const M0 = parseFloat(parseRibuanInput(rawM0));
  const iTahunan = parseFloat(document.getElementById('int_i').value);
  const nTahun = parseFloat(document.getElementById('int_n').value);
  const freq = parseFloat(document.getElementById('int_freq').value);

  if (isNaN(M0) || M0 <= 0) return;

  // Hitung Anuitas
  const i = (iTahunan / 100) / freq;
  const n = nTahun * freq;
  const A = M0 * i / (1 - Math.pow(1 + i, -n));
  
  const totalBayar = A * n;
  const totalBunga = totalBayar - M0;

  // Format
  const fmtA = formatRupiahEngine(A);
  const fmtTotal = formatRupiahEngine(totalBayar);
  const fmtBunga = formatRupiahEngine(totalBunga);

  // Render HTML Hasil & Grafik SVG
  document.getElementById('int_result').innerHTML = `
    <div class="result-grid">
      <div class="result-card" style="background:#e0f2fe; border-color:#7dd3fc;">
        <div class="label">Angsuran per ${freq === 12 ? 'Bulan' : freq === 4 ? 'Kuartal' : 'Tahun'}</div>
        <div class="value" style="font-size:22px; color:#0369a1;">${fmtA}</div>
      </div>
      <div class="result-card">
        <div class="label">Total yang Dibayarkan</div>
        <div class="value">${fmtTotal}</div>
      </div>
      <div class="result-card">
        <div class="label">Total Bunga (Biaya)</div>
        <div class="value" style="color:var(--red);">${fmtBunga}</div>
      </div>
    </div>

    <div style="margin-top:30px;">
      <h4 style="font-size:14px; margin-bottom:15px; text-align:center;">📊 Grafik Real-Time: Proporsi Pokok vs Bunga</h4>
      ${buildGrafikBatangAnuitas(M0, totalBunga)}
    </div>
  `;
}

/* ============================================================
   FUNGSI GRAFIK BATANG SVG
   ============================================================ */
function buildGrafikBatangAnuitas(pokok, bunga) {
  const total = pokok + bunga;
  const pctPokok = (pokok / total) * 100;
  const pctBunga = (bunga / total) * 100;

  // Dimensi SVG
  const width = 400;
  const height = 200;
  const barWidth = 80;
  const maxBarHeight = 150;
  
  // Skala tinggi
  const hPokok = (pokok / total) * maxBarHeight;
  const hBunga = (bunga / total) * maxBarHeight;

  return `
    <div style="background:var(--gray-bg); padding:20px; border-radius:12px; border:1px solid var(--gray-border);">
      <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:auto; display:block; margin:0 auto;">
        
        <!-- Batang Pokok -->
        <rect x="${(width/2) - barWidth - 10}" y="${height - 30 - hPokok}" width="${barWidth}" height="${hPokok}" fill="#3b82f6" rx="4" />
        <!-- Teks Pokok -->
        <text x="${(width/2) - (barWidth/2) - 10}" y="${height - 35 - hPokok}" text-anchor="middle" font-size="12" font-weight="bold" fill="#1d4ed8">
          ${Math.round(pctPokok)}%
        </text>
        <text x="${(width/2) - (barWidth/2) - 10}" y="${height - 10}" text-anchor="middle" font-size="13" font-weight="bold" fill="#334155">
          Pokok
        </text>

        <!-- Batang Bunga -->
        <rect x="${(width/2) + 10}" y="${height - 30 - hBunga}" width="${barWidth}" height="${hBunga}" fill="#ef4444" rx="4" />
        <!-- Teks Bunga -->
        <text x="${(width/2) + (barWidth/2) + 10}" y="${height - 35 - hBunga}" text-anchor="middle" font-size="12" font-weight="bold" fill="#b91c1c">
          ${Math.round(pctBunga)}%
        </text>
        <text x="${(width/2) + (barWidth/2) + 10}" y="${height - 10}" text-anchor="middle" font-size="13" font-weight="bold" fill="#334155">
          Bunga
        </text>

        <!-- Garis Dasar -->
        <line x1="50" y1="${height - 30}" x2="${width - 50}" y2="${height - 30}" stroke="#cbd5e1" stroke-width="2" />
      </svg>
      
      <div style="display:flex; justify-content:space-between; margin-top:10px; font-size:12px; color:var(--gray-text); border-top:1px solid var(--gray-border); padding-top:10px;">
        <span>🟦 Pokok: <strong>${formatRupiahEngine(pokok)}</strong></span>
        <span>🟥 Bunga: <strong>${formatRupiahEngine(bunga)}</strong></span>
      </div>
    </div>
  `;
}