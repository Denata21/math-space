/* ============================================================
   KALKULATOR ANUITAS INTERAKTIF (Slider & Grafik)
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
          <label>Suku Bunga per Tahun (i): <span id="lbl_i" style="color:var(--blue); font-weight:bold;">10%</span></label>
          <input type="range" id="int_i" min="1" max="20" step="0.5" value="10" 
                 oninput="document.getElementById('lbl_i').innerText = this.value + '%'; updateKalkulatorInteraktif();"
                 style="width:100%; cursor:pointer;">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Lama Pinjaman (n): <span id="lbl_n" style="color:var(--blue); font-weight:bold;">3 Tahun</span></label>
          <input type="range" id="int_n" min="1" max="10" step="1" value="3" 
                 oninput="document.getElementById('lbl_n').innerText = this.value + ' Tahun'; updateKalkulatorInteraktif();"
                 style="width:100%; cursor:pointer;">
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

    <div style="margin-top:20px;">
      <h4 style="font-size:14px; margin-bottom:10px;">📊 Visualisasi Proporsi: Pokok vs Bunga</h4>
      ${buildGrafikAnuitasSVG(M0, totalBunga)}
    </div>
  `;
}

function buildGrafikAnuitasSVG(pokok, bunga) {
  const width = 400;
  const height = 60;
  const total = pokok + bunga;
  
  const pctPokok = (pokok / total) * 100;
  const pctBunga = (bunga / total) * 100;
  
  const wPokok = (pctPokok / 100) * width;
  const wBunga = (pctBunga / 100) * width;

  return `
    <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:auto; border-radius:8px; overflow:hidden; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
      <!-- Batang Pokok (Biru) -->
      <rect x="0" y="0" width="${wPokok}" height="${height}" fill="#3b82f6" />
      <!-- Batang Bunga (Merah) -->
      <rect x="${wPokok}" y="0" width="${wBunga}" height="${height}" fill="#ef4444" />
      
      <!-- Teks Pokok -->
      <text x="${wPokok/2}" y="${height/2 + 5}" text-anchor="middle" fill="white" font-size="12" font-weight="bold">
        ${Math.round(pctPokok)}%
      </text>
      
      <!-- Teks Bunga (hanya muncul jika cukup lebar) -->
      ${pctBunga > 15 ? `
      <text x="${wPokok + wBunga/2}" y="${height/2 + 5}" text-anchor="middle" fill="white" font-size="12" font-weight="bold">
        ${Math.round(pctBunga)}%
      </text>
      ` : ''}
    </svg>
    <div style="display:flex; justify-content:space-between; margin-top:6px; font-size:12px; color:var(--gray-text);">
      <span>🟦 Pokok Pinjaman</span>
      <span>🟥 Bunga</span>
    </div>
  `;
}