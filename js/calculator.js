/* ============================================================
   CALCULATOR — 3 modul: Bunga Tunggal, Bunga Majemuk, Anuitas
   ============================================================ */

let activeCalculator = 'bunga-tunggal';

/* ============================================================
   RENDER HALAMAN KALKULATOR
   ============================================================ */

function renderCalculatorPage() {
  const app = document.getElementById('app');
  if (!app) return;

  const daftar = [
    { key: 'bunga-tunggal', label: 'Bunga Tunggal', icon: '💰' },
    { key: 'bunga-majemuk', label: 'Bunga Majemuk', icon: '📈' },
    { key: 'anuitas',       label: 'Anuitas',       icon: '🏦' }
  ];

  let optionsHtml = '';
  daftar.forEach(c => {
    optionsHtml += `<option value="${c.key}">${c.icon} ${c.label}</option>`;
  });

  app.innerHTML = `
    <div class="hero">
      <h2 class="hero-title">🧮 Math Calculator</h2>
      <p class="hero-subtitle">
        Pilih materi, masukkan nilai yang diketahui, dan kosongkan variabel yang ingin ditanyakan.
        Kalkulator akan menampilkan langkah penyelesaian, bukan hanya jawaban akhir.
      </p>
    </div>

    <div class="calc-panel" style="padding:20px 24px;">
      <div class="form-group" style="margin-bottom:0;">
        <label style="font-size:14px;">Pilih Materi</label>
        <select class="form-control" id="calcMateri" style="font-size:15px;padding:12px;margin-top:6px;">
          ${optionsHtml}
        </select>
      </div>
    </div>

    <div id="calcArea"></div>
  `;

  const select = document.getElementById('calcMateri');
  if (select) {
    select.value = activeCalculator;
    select.onchange = function () {
      switchCalculator(this.value);
    };
  }

  renderCalculatorContent(activeCalculator);
}

function switchCalculator(key) {
  activeCalculator = key;
  renderCalculatorContent(key);
  const select = document.getElementById('calcMateri');
  if (select) select.value = key;
}

function renderCalculatorContent(key) {
  const area = document.getElementById('calcArea');
  if (!area) return;
  area.innerHTML = '';

  const select = document.getElementById('calcMateri');
  if (select && select.value !== key) select.value = key;

  const tab = FORMULAS[key];
  if (!tab) {
    area.innerHTML = `<div class="calc-panel"><p style="color:var(--danger);">Materi tidak ditemukan: ${key}</p></div>`;
    return;
  }

  renderFormulaCalculator(area, key);
}

/* ============================================================
   FORM KALKULATOR GENERIK
   ============================================================ */

function renderFormulaCalculator(area, key) {
  const tab = FORMULAS[key];

  let html = `
    <div class="calc-panel">
      <div class="calc-hint">
        <strong>${tab.judul}</strong> — ${tab.deskripsi}
      </div>
      <div class="form-row">
  `;

  tab.variabel.forEach(v => {
    const isRupiah = (v.satuan === 'Rp');
    const labelHtml = `
      <label>
        ${v.label} <code>${v.kode}</code>
        <span style="color:var(--text-muted);font-weight:400;">(${v.satuan})</span>
      </label>
    `;

    if (isRupiah) {
      html += `
        <div class="form-group">
          ${labelHtml}
          <input type="text" inputmode="numeric" class="form-control input-rupiah"
                 id="fv_${v.kode}" placeholder="kosongkan jika ditanya"
                 oninput="handleRupiahInput(this)">
          ${v.deskripsi ? `<span class="hint">${escapeHtml(v.deskripsi)}</span>` : ''}
        </div>
      `;
    } else {
      html += `
        <div class="form-group">
          ${labelHtml}
          <input type="number" step="any" class="form-control"
                 id="fv_${v.kode}" placeholder="kosongkan jika ditanya">
          ${v.deskripsi ? `<span class="hint">${escapeHtml(v.deskripsi)}</span>` : ''}
        </div>
      `;
    }
  });

  html += `
      </div>
      <div id="formulaError" class="login-error"></div>
      <div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="runFormula()">Hitung</button>
        <button class="btn btn-secondary" onclick="resetFormulaForm()">Reset</button>
        <button class="btn btn-outline" onclick="showFormulaTheory('${key}')">📖 Lihat Teori</button>
      </div>
    </div>

    <div id="formulaTheory" style="display:none;"></div>
    <div id="formulaResult"></div>
  `;

  area.innerHTML = html;
}

/* ============================================================
   TEORI
   ============================================================ */

function showFormulaTheory(key) {
  const tab = FORMULAS[key];
  const el = document.getElementById('formulaTheory');
  if (!el) return;

  if (el.style.display === 'none') {
    el.style.display = 'block';
    el.innerHTML = `
      <div class="calc-panel" style="background:var(--navy-light);border-color:var(--teal);">
        <h3 style="font-size:15px;margin-bottom:10px;color:var(--teal-dark);">📖 Teori: ${tab.judul}</h3>
        <p style="font-size:14px;white-space:pre-line;line-height:1.8;margin:0;">${tab.teori || tab.deskripsi}</p>
      </div>
    `;
  } else {
    el.style.display = 'none';
    el.innerHTML = '';
  }
}

/* ============================================================
   RESET
   ============================================================ */

function resetFormulaForm() {
  const key = document.getElementById('calcMateri').value;
  const tab = FORMULAS[key];
  if (!tab) return;

  tab.variabel.forEach(v => {
    const el = document.getElementById('fv_' + v.kode);
    if (el) el.value = '';
  });
  const errEl = document.getElementById('formulaError');
  if (errEl) errEl.innerHTML = '';
  const resEl = document.getElementById('formulaResult');
  if (resEl) resEl.innerHTML = '';
}

/* ============================================================
   HITUNG
   ============================================================ */

function runFormula() {
  const selectEl = document.getElementById('calcMateri');
  if (!selectEl) return;

  const key = selectEl.value;
  const tab = FORMULAS[key];
  if (!tab) return;

  const errEl = document.getElementById('formulaError');
  errEl.textContent = '';
  errEl.innerHTML = '';

  const input = {};
  tab.variabel.forEach(v => {
    const el = document.getElementById('fv_' + v.kode);
    if (!el) return;
    const val = el.value.trim();
    if (val !== '') {
      if (v.satuan === 'Rp') {
        input[v.kode] = parseRibuanInput(val);
      } else {
        input[v.kode] = val;
      }
    }
  });

  let result;
  try {
    result = solveFormulas(key, input);
  } catch (e) {
    if (e.message === 'INPUT_TIDAK_KONSISTEN' && e.detail) {
      let html = `<div class="warning-box" style="margin-top:12px;">`;
      html += `<div class="warning-title">⚠️ Nilai tidak konsisten</div>`;
      e.detail.forEach(item => {
        html += `<div class="warning-item">`;
        html += `<div><strong>${item.pesan}</strong></div>`;
        if (item.detail) html += `<div style="font-size:13px;color:var(--text-muted);margin-top:4px;">${item.detail}</div>`;
        if (item.saran) html += `<div style="font-size:13px;margin-top:6px;">💡 ${item.saran}</div>`;
        html += `</div>`;
      });
      html += `<div style="margin-top:12px;font-size:13px;color:var(--text-muted);">
        Perbaiki nilai yang diisi terlebih dahulu, lalu tekan <strong>Hitung</strong> lagi.
      </div>`;
      html += `</div>`;
      errEl.innerHTML = html;
      return;
    }
    errEl.textContent = e.message;
    return;
  }

  if (result.unresolved.length > 0) {
    errEl.textContent = 'Variabel berikut belum bisa dihitung: '
      + result.unresolved.join(', ')
      + '. Coba isi lebih banyak variabel.';
    return;
  }

  renderFormulaResult(result);
}

/* ============================================================
   RENDER HASIL + LANGKAH
   ============================================================ */

function renderFormulaResult(result) {
  const tab = result.tab;
  const area = document.getElementById('formulaResult');
  if (!area) return;

  let html = `<div class="calc-panel" style="margin-top:16px;">`;
  html += `<h3 style="font-size:15px;margin-bottom:14px;color:var(--teal-dark);">📋 Hasil dan Langkah Penyelesaian</h3>`;

  // Diketahui
  const known = tab.variabel.filter(v =>
    result.values[v.kode] !== undefined && result.targets.indexOf(v.kode) === -1
  );
  if (known.length > 0) {
    html += `<div style="margin-bottom:14px;"><strong>Diketahui:</strong><ul style="margin:8px 0 0 22px;">`;
    known.forEach(v => {
      let val = result.values[v.kode];
      if (v.kode === 'i') val = formatAngkaEngine(val * 100) + '%';
      else if (v.satuan === 'Rp') val = formatRupiahEngine(val);
      else val = formatAngkaEngine(val);
      html += `<li><code>${v.kode}</code> = ${val}</li>`;
    });
    html += `</ul></div>`;
  }

  // Ditanya
  html += `<div style="margin-bottom:16px;"><strong>Ditanya:</strong> ${result.targets.join(', ')}</div>`;

  // Langkah
  html += `<h4 style="font-size:14px;margin-bottom:10px;">Langkah Penyelesaian</h4>`;
  html += `<ol style="margin-left:22px;font-size:14px;line-height:1.9;">`;

  result.steps.forEach(s => {
    const varInfo = tab.variabel.find(v => v.kode === s.target) || {};
    let hasilFmt;
    if (s.target === 'i') hasilFmt = formatAngkaEngine(s.result * 100) + '%';
    else if (varInfo.satuan === 'Rp') hasilFmt = formatRupiahEngine(s.result);
    else if (typeof s.result === 'string') hasilFmt = s.result;
    else hasilFmt = formatAngkaEngine(s.result);

    html += `<li>`;
    html += `<div><strong>${s.target}</strong> = <code>${s.ekspresi}</code></div>`;
    html += `<div style="color:var(--teal-dark);font-size:13px;margin-top:2px;">= <strong>${hasilFmt}</strong></div>`;
    html += `</li>`;
  });

  html += `</ol>`;

  // Jawaban akhir
  html += `<div class="example-box" style="margin-top:16px;">`;
  html += `<strong>Jawaban Akhir:</strong><ul style="margin:8px 0 0 22px;">`;
  result.targets.forEach(t => {
    const info = tab.variabel.find(v => v.kode === t) || {};
    const val = result.values[t];
    let valFmt;
    if (t === 'i') valFmt = formatAngkaEngine(val * 100) + '%';
    else if (info.satuan === 'Rp') valFmt = formatRupiahEngine(val);
    else if (typeof val === 'string') valFmt = val;
    else valFmt = formatAngkaEngine(val);
    html += `<li>${info.label || t} (${t}) = <strong>${valFmt}</strong></li>`;
  });
  html += `</ul></div></div>`;

  // Tabel pelunasan (anuitas)
  if (tab.butuhTabel
      && result.values.M0 !== undefined
      && result.values.A !== undefined
      && result.values.i !== undefined
      && result.values.n !== undefined) {
    const rows = generateAnuitasTable(result.values.M0, result.values.A, result.values.i, result.values.n);
    html += `<div class="calc-panel" style="margin-top:16px;">`;
    html += `<h3 style="font-size:15px;margin-bottom:12px;color:var(--teal-dark);">📊 Tabel Pelunasan</h3>`;
    html += `<div class="table-wrap"><table><thead><tr>`;
    html += `<th>Periode</th><th>Sisa Awal</th><th>Anuitas</th><th>Bunga</th><th>Angsuran Pokok</th><th>Sisa Akhir</th>`;
    html += `</tr></thead><tbody>`;
    rows.forEach(r => {
      html += `<tr><td>${r.periode}</td>`;
      html += `<td>${formatRupiahEngine(r.sisaAwal)}</td>`;
      html += `<td>${formatRupiahEngine(r.anuitas)}</td>`;
      html += `<td>${formatRupiahEngine(r.bunga)}</td>`;
      html += `<td>${formatRupiahEngine(r.pokok)}</td>`;
      html += `<td>${formatRupiahEngine(r.sisaAkhir)}</td></tr>`;
    });
    html += `</tbody></table></div>`;
    html += `<p style="font-size:13px;color:var(--text-muted);margin-top:10px;">
      Perhatikan: porsi bunga menurun, porsi angsuran pokok meningkat setiap periode. Total anuitas tetap.
    </p>`;
    html += `</div>`;
  }

  area.innerHTML = html;
}

/* ============================================================
   TAB KALKULATOR DI HALAMAN MATERI ANUITAS
   (dipanggil dari home.js saat detail materi anuitas dibuka)
   ============================================================ */

let activeTabKey = 'bunga-tunggal';

function renderFormulaTabs(container) {
  const tabKeys = Object.keys(FORMULAS);

  let html = `
    <h3 style="font-size:17px;margin:24px 0 12px;color:var(--teal-dark);
               border-left:3px solid var(--teal);padding-left:12px;">
      Latihan Berpola — Hitung Otomatis
    </h3>
    <p style="color:var(--text-muted);font-size:14px;margin-bottom:14px;">
      Isi variabel yang diketahui. Kosongkan variabel yang ingin ditanyakan.
      Klik <strong>Hitung</strong> untuk melihat langkah penyelesaian.
    </p>

    <div class="formula-tabs" id="formulaTabs">
  `;

  tabKeys.forEach(key => {
    const t = FORMULAS[key];
    html += `
      <button class="formula-tab ${key === activeTabKey ? 'active' : ''}"
              data-key="${key}"
              onclick="switchFormulaTab('${key}')">${t.judul}</button>
    `;
  });

  html += `</div><div id="formulaArea"></div>`;

  container.innerHTML = html;
  renderFormulaFormInMateri();
}

function switchFormulaTab(key) {
  if (!FORMULAS[key]) return;
  activeTabKey = key;

  document.querySelectorAll('#formulaTabs .formula-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.key === key);
  });

  renderFormulaFormInMateri();
}

function renderFormulaFormInMateri() {
  const tab = FORMULAS[activeTabKey];
  const area = document.getElementById('formulaArea');
  if (!area) return;

  let html = `
    <div class="calc-panel" style="margin-top:14px;">
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">${tab.deskripsi}</p>
      <div class="form-row">
  `;

  tab.variabel.forEach(v => {
    const isRupiah = v.satuan === 'Rp';
    html += `
      <div class="form-group">
        <label>${v.label} <code>${v.kode}</code>
          <span style="color:var(--text-muted);font-weight:400;">(${v.satuan})</span>
        </label>
        <input type="${isRupiah ? 'text' : 'number'}" step="any" class="form-control ${isRupiah ? 'input-rupiah' : ''}"
               id="fv_${v.kode}" placeholder="kosongkan jika ditanya"
               ${isRupiah ? 'oninput="handleRupiahInput(this)" inputmode="numeric"' : ''}>
      </div>
    `;
  });

  html += `
      </div>
      <p class="login-error" id="formulaError"></p>
      <div style="display:flex;gap:10px;margin-top:8px;flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="runFormula()">Hitung</button>
        <button class="btn btn-secondary" onclick="resetFormulaForm()">Reset</button>
      </div>
    </div>
    <div id="formulaResult"></div>
  `;

  area.innerHTML = html;
}