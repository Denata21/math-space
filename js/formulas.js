/* ============================================================
   HALAMAN KALKULATOR — Router dengan Dropdown Materi
   ============================================================ */

let activeCalculator = 'bunga-tunggal';

function renderCalculatorPage() {
  const app = document.getElementById('app');
  if (!app) return;

  const daftar = [
    { key: 'bunga-tunggal',  label: 'Bunga Tunggal',  icon: '💰' },
    { key: 'bunga-majemuk',  label: 'Bunga Majemuk',  icon: '📈' },
    { key: 'anuitas',        label: 'Anuitas',        icon: '🏦' },
    { key: 'kesebangunan',   label: 'Kesebangunan',   icon: '📐' },
    { key: 'statistika',     label: 'Statistika',     icon: '📊' },
    { key: 'pencacahan',     label: 'Pencacahan',     icon: '🎲' }
  ];

  let optionsHtml = '';
  daftar.forEach(function(c) {
    optionsHtml += `<option value="${c.key}">${c.icon} - ${c.label}</option>`;
  });

  app.innerHTML = `
    <div class="hero" style="padding:32px 28px;">
      <h2>Kalkulator Matematika</h2>
      <p>Pilih materi, masukkan nilai yang diketahui, dan kosongkan variabel yang ingin ditanyakan.</p>
    </div>

    <div class="calc-panel" style="padding:20px 24px;">
      <div class="form-group" style="margin-bottom:0;">
        <label style="font-size:14px;font-weight:600;">Pilih Materi</label>
        <select class="form-control" id="calcMateri" style="font-size:15px;padding:12px;margin-top:6px;">
          ${optionsHtml}
        </select>
      </div>
    </div>

    <div id="calcArea"></div>
    <div id="calcHistoryArea"></div>
  `;

  const select = document.getElementById('calcMateri');
  if (select) {
    select.value = activeCalculator;
    select.onchange = function() { 
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

  if (key === 'statistika' && typeof renderCalcStatistika === 'function') {
    renderCalcStatistika(area);
    renderCalcHistory('statistika');
    return;
  }

  if (key === 'pencacahan' && typeof renderCalcPencacahan === 'function') {
    renderCalcPencacahan(area);
    renderCalcHistory('pencacahan');
    return;
  }

  if (key === 'kesebangunan' && typeof renderCalcKesebangunan === 'function') {
    renderCalcKesebangunan(area);
    return;
  }

  const tab = FORMULAS[key];
  if (!tab) {
    area.innerHTML = `<div class="calc-panel"><p style="color:red;">Materi tidak ditemukan: ${key}</p></div>`;
    return;
  }

  renderFormulaCalculator(area, key);
  renderCalcHistory(key);
}

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
    if (v.readonly) return;

    const isRupiah = (v.satuan === 'Rp');

    if (v.tipe === 'select' && v.opsi) {
      let optionsHtml = '';
      v.opsi.forEach(o => {
        optionsHtml += `<option value="${o.value}">${o.label}</option>`;
      });
      html += `
        <div class="form-group">
          <label>${v.label}</label>
          <select class="form-control" id="fv_${v.kode}">${optionsHtml}</select>
        </div>
      `;
      return;
    }

    if (isRupiah) {
      html += `
        <div class="form-group">
          <label>
            ${v.label} <code>${v.kode}</code>
            <span style="color:var(--gray-text);font-weight:400;">(${v.satuan})</span>
          </label>
          <input type="text" inputmode="numeric" class="form-control input-rupiah"
                 id="fv_${v.kode}" placeholder="kosongkan jika ditanya"
                 oninput="handleRupiahInput(this)">
        </div>
      `;
      return;
    }

    html += `
      <div class="form-group">
        <label>
          ${v.label} <code>${v.kode}</code>
          <span style="color:var(--gray-text);font-weight:400;">(${v.satuan})</span>
        </label>
        <input type="number" step="any" class="form-control"
               id="fv_${v.kode}" placeholder="kosongkan jika ditanya">
      </div>
    `;
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

function handleRupiahInput(el) {
  const raw = el.value;
  if (!raw || raw.trim() === '') {
    el.value = '';
    return;
  }
  const cursorPos = el.selectionStart;
  const lengthBefore = raw.length;
  const formatted = formatRibuanInput(raw);
  el.value = formatted;
  const lengthAfter = formatted.length;
  const diff = lengthAfter - lengthBefore;
  el.setSelectionRange(cursorPos + diff, cursorPos + diff);
}

function showFormulaTheory(key) {
  const tab = FORMULAS[key];
  const el = document.getElementById('formulaTheory');
  if (!el) return;

  if (el.style.display === 'none') {
    el.style.display = 'block';
    el.innerHTML = `
      <div class="calc-panel" style="background:#f0f7ff;border-color:var(--blue);">
        <h3 style="font-size:15px;margin-bottom:10px;color:var(--blue-dark);">Teori: ${tab.judul}</h3>
        <p style="font-size:14px;white-space:pre-line;line-height:1.8;">${tab.teori || tab.deskripsi}</p>
      </div>
    `;
  } else {
    el.style.display = 'none';
    el.innerHTML = '';
  }
}

function resetFormulaForm() {
  const key = document.getElementById('calcMateri').value;
  const tab = FORMULAS[key];
  if (!tab) return;
  
  tab.variabel.forEach(function(v) {
    const el = document.getElementById('fv_' + v.kode);
    if (el) el.value = '';
  });
  const errEl = document.getElementById('formulaError');
  if (errEl) errEl.innerHTML = '';
  const resEl = document.getElementById('formulaResult');
  if (resEl) resEl.innerHTML = '';
}

function runFormula() {
  // PAKSA BACA DARI DROPDOWN
  const selectEl = document.getElementById('calcMateri');
  if (!selectEl) return;
  
  const key = selectEl.value;
  console.log("Menghitung materi:", key); // Debugging log
  
  const tab = FORMULAS[key];
  if (!tab) return;

  const errEl = document.getElementById('formulaError');
  errEl.textContent = '';
  errEl.innerHTML = '';

  const input = {};
  tab.variabel.forEach(v => {
    if (v.readonly) return;
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
    result = solveFormulas(key, input); // Pakai 'key' dari dropdown
  } catch (e) {
    if (e.message === 'INPUT_TIDAK_KONSISTEN' && e.detail) {
      let html = `<div class="warning-box" style="margin-top:12px;">`;
      html += `<div class="warning-title">⚠️ Nilai tidak konsisten</div>`;
      e.detail.forEach(item => {
        html += `<div class="warning-item">`;
        html += `<div><strong>${item.pesan}</strong></div>`;
        if (item.detail) html += `<div style="font-size:13px;color:var(--gray-text);margin-top:4px;">${item.detail}</div>`;
        if (item.saran) html += `<div style="font-size:13px;margin-top:6px;">💡 ${item.saran}</div>`;
        html += `</div>`;
      });
      html += `<div style="margin-top:12px;font-size:13px;color:var(--gray-text);">
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
  simpanRiwayat(key, input, result);
}

function renderFormulaResult(result) {
  const tab = result.tab;
  const area = document.getElementById('formulaResult');
  if (!area) return;

  let html = `<div class="calc-panel" style="margin-top:16px;">`;
  html += `<h3 style="font-size:15px;margin-bottom:12px;color:var(--blue-dark);">Hasil dan Langkah Penyelesaian</h3>`;

  const known = tab.variabel.filter(function(v) {
    return result.values[v.kode] !== undefined && result.targets.indexOf(v.kode) === -1;
  });
  if (known.length > 0) {
    html += `<div style="margin-bottom:12px;"><strong>Diketahui:</strong><ul style="margin:6px 0 0 20px;">`;
    known.forEach(function(v) {
      let val = result.values[v.kode];
      if (v.kode === 'i') val = formatAngkaEngine(val * 100) + '%';
      else if (v.satuan === 'Rp') val = formatRupiahEngine(val);
      else val = formatAngkaEngine(val);
      html += `<li>${v.kode} = ${val}</li>`;
    });
    html += `</ul></div>`;
  }

  html += `<div style="margin-bottom:16px;"><strong>Ditanya:</strong> ${result.targets.join(', ')}</div>`;
  html += `<h4 style="font-size:14px;margin-bottom:8px;">Langkah Penyelesaian</h4>`;
  html += `<ol style="margin-left:20px;font-size:14px;line-height:1.9;">`;

  result.steps.forEach(function(s) {
    const varInfo = tab.variabel.find(function(v) { return v.kode === s.target; }) || {};
    let hasilFmt;
    if (s.target === 'i') hasilFmt = formatAngkaEngine(s.result * 100) + '%';
    else if (varInfo.satuan === 'Rp') hasilFmt = formatRupiahEngine(s.result);
    else if (typeof s.result === 'string') hasilFmt = s.result;
    else hasilFmt = formatAngkaEngine(s.result);

    html += `<li>`;
    html += `<div><strong>${s.target}</strong> = <code>${s.ekspresi}</code></div>`;
    html += `<div>= <strong>${hasilFmt}</strong></div>`;
    html += `</li>`;
  });

  html += `</ol>`;

  html += `<div class="example-box" style="margin-top:14px;">`;
  html += `<strong>Jawaban Akhir:</strong><ul style="margin:6px 0 0 20px;">`;
  result.targets.forEach(function(t) {
    const info = tab.variabel.find(function(v) { return v.kode === t; }) || {};
    const val = result.values[t];
    let valFmt;
    if (t === 'i') valFmt = formatAngkaEngine(val * 100) + '%';
    else if (info.satuan === 'Rp') valFmt = formatRupiahEngine(val);
    else if (typeof val === 'string') valFmt = val;
    else valFmt = formatAngkaEngine(val);
    html += `<li>${info.label || t} (${t}) = <strong>${valFmt}</strong></li>`;
  });
  html += `</ul></div></div>`;

  if (tab.butuhTabel && result.values.M0 !== undefined && result.values.A !== undefined
      && result.values.i !== undefined && result.values.n !== undefined) {
    const rows = generateAnuitasTable(result.values.M0, result.values.A, result.values.i, result.values.n);
    html += `<div class="calc-panel" style="margin-top:16px;">`;
    html += `<h3 style="font-size:15px;margin-bottom:12px;color:var(--blue-dark);">Tabel Pelunasan</h3>`;
    html += `<div class="table-wrap"><table><thead><tr>`;
    html += `<th>Periode</th><th>Sisa Awal</th><th>Anuitas</th><th>Bunga</th><th>Angsuran Pokok</th><th>Sisa Akhir</th>`;
    html += `</tr></thead><tbody>`;
    rows.forEach(function(r) {
      html += `<tr><td>${r.periode}</td>`;
      html += `<td>${formatRupiahEngine(r.sisaAwal)}</td>`;
      html += `<td>${formatRupiahEngine(r.anuitas)}</td>`;
      html += `<td>${formatRupiahEngine(r.bunga)}</td>`;
      html += `<td>${formatRupiahEngine(r.pokok)}</td>`;
      html += `<td>${formatRupiahEngine(r.sisaAkhir)}</td></tr>`;
    });
    html += `</tbody></table></div></div>`;
  }

  area.innerHTML = html;
}

var RIWAYAT_KEY = 'rm_calc_history';
var MAX_RIWAYAT = 10;

function simpanRiwayat(materi, input, result) {
  try {
    var list = JSON.parse(localStorage.getItem(RIWAYAT_KEY) || '[]');
    var ringkas = {};
    result.targets.forEach(function(t) {
      var v = result.values[t];
      ringkas[t] = (typeof v === 'number') ? Math.round(v * 10000) / 10000 : v;
    });
    list.unshift({ materi: materi, input: input, waktu: new Date().toISOString(), ringkas: ringkas });
    localStorage.setItem(RIWAYAT_KEY, JSON.stringify(list.slice(0, MAX_RIWAYAT)));
    renderCalcHistory(materi);
  } catch (e) {}
}

function renderCalcHistory(materi) {
  var area = document.getElementById('calcHistoryArea');
  if (!area) return;

  var list = [];
  try { list = JSON.parse(localStorage.getItem(RIWAYAT_KEY) || '[]'); } catch (e) { list = []; }
  var filtered = list.filter(function(r) { return r.materi === materi; });
  if (filtered.length === 0) { area.innerHTML = ''; return; }

  var html = '<div class="calc-panel" style="margin-top:16px;">';
  html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">';
  html += '<h3 style="font-size:15px;color:var(--blue-dark);">Riwayat Perhitungan (' + filtered.length + ')</h3>';
  html += '<button class="btn btn-secondary btn-sm" onclick="hapusRiwayat()">Hapus Semua</button></div>';
  html += '<div class="table-wrap"><table><thead><tr><th>Waktu</th><th>Input</th><th>Hasil</th></tr></thead><tbody>';

  filtered.forEach(function(r) {
    var waktu = new Date(r.waktu).toLocaleString('id-ID');
    var inputStr = Object.entries(r.input).map(function(e) { return e[0] + '=' + e[1]; }).join(', ');
    var hasilStr = Object.entries(r.ringkas).map(function(e) {
      return e[0] + '=' + (typeof e[1] === 'number' ? e[1].toLocaleString('id-ID') : e[1]);
    }).join(', ');
    html += '<tr><td style="text-align:left;">' + waktu + '</td>';
    html += '<td style="text-align:left;font-size:12px;">' + escapeHtml(inputStr) + '</td>';
    html += '<td style="text-align:left;font-size:12px;font-weight:600;">' + escapeHtml(hasilStr) + '</td></tr>';
  });

  html += '</tbody></table></div></div>';
  area.innerHTML = html;
}

function hapusRiwayat() {
  if (!confirm('Hapus semua riwayat perhitungan?')) return;
  localStorage.removeItem(RIWAYAT_KEY);
  const key = document.getElementById('calcMateri') ? document.getElementById('calcMateri').value : 'bunga-tunggal';
  renderCalcHistory(key);
}

function formatRupiah(angka) {
  if (isNaN(angka) || !isFinite(angka)) return 'Rp0';
  return 'Rp' + Math.round(angka).toLocaleString('id-ID');
}