/* ============================================================
   FORMULA UI — Tab di materi anuitas
   Render: tab switcher, form input, langkah, tabel pelunasan
   ============================================================ */

let activeTabKey = 'bunga-tunggal';

function renderFormulaTabs(container) {
  const tabKeys = Object.keys(FORMULAS);

  let html = `
    <h3 style="font-size:17px;margin:24px 0 12px;color:var(--blue-dark);
               border-left:3px solid var(--blue);padding-left:10px;">
      Latihan Berpola — Hitung Otomatis
    </h3>
    <p style="color:var(--gray-text);font-size:14px;margin-bottom:14px;">
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

  html += `</div>
    <div id="formulaArea"></div>
  `;

  container.innerHTML = html;
  renderFormulaForm();
}

function switchFormulaTab(key) {
  if (!FORMULAS[key]) return;
  activeTabKey = key;

  // Update active state pakai data-key (bukan textContent)
  document.querySelectorAll('#formulaTabs .formula-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.key === key);
  });

  renderFormulaForm();
}

function renderFormulaForm() {
  const tab = FORMULAS[activeTabKey];
  const area = document.getElementById('formulaArea');
  if (!area) return;

  let html = `
    <div class="calc-panel" style="margin-top:14px;">
      <p style="font-size:13px;color:var(--gray-text);margin-bottom:16px;">${tab.deskripsi}</p>
      <div class="form-row">
  `;

  tab.variabel.forEach(v => {
    html += `
      <div class="form-group">
        <label>${v.label} <code>${v.kode}</code> <span style="color:var(--gray-text);font-weight:400;">(${v.satuan})</span></label>
        <input type="number" step="any" class="form-control"
               id="fv_${v.kode}" placeholder="kosongkan jika ditanya">
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

function resetFormulaForm() {
  const tab = FORMULAS[activeTabKey];
  tab.variabel.forEach(v => {
    const el = document.getElementById('fv_' + v.kode);
    if (el) el.value = '';
  });
  const errEl = document.getElementById('formulaError');
  if (errEl) errEl.textContent = '';
  const resEl = document.getElementById('formulaResult');
  if (resEl) resEl.innerHTML = '';
}

function runFormula() {
  const tab = FORMULAS[activeTabKey];
  const errEl = document.getElementById('formulaError');
  errEl.textContent = '';

  // Baca input
  const input = {};
  tab.variabel.forEach(v => {
    const val = document.getElementById('fv_' + v.kode).value.trim();
    if (val !== '') input[v.kode] = val;
  });

  let result;
  try {
    result = solveFormulas(activeTabKey, input);
  } catch (e) {
    errEl.textContent = e.message;
    return;
  }

  if (result.unresolved.length > 0) {
    errEl.textContent = 'Variabel berikut belum bisa dihitung dengan data yang ada: '
      + result.unresolved.join(', ')
      + '. Coba isi lebih banyak variabel.';
    return;
  }

  renderFormulaResult(result);
}

function renderFormulaResult(result) {
  const tab = result.tab;
  const area = document.getElementById('formulaResult');

  let html = `<div class="calc-panel" style="margin-top:16px;">`;
  html += `<h3 style="font-size:15px;margin-bottom:12px;color:var(--blue-dark);">Hasil & Langkah Penyelesaian</h3>`;

  // Diketahui
  const known = tab.variabel.filter(v =>
    result.values[v.kode] !== undefined && !result.targets.includes(v.kode));
  if (known.length > 0) {
    html += `<div style="margin-bottom:12px;"><strong>Diketahui:</strong><ul style="margin:6px 0 0 20px;">`;
    known.forEach(v => {
      let val = result.values[v.kode];
      if (v.kode === 'i') val = formatAngkaEngine(val * 100) + '%';
      else if (v.satuan === 'Rp') val = formatRupiahEngine(val);
      else val = formatAngkaEngine(val);
      html += `<li>${v.kode} = ${val}</li>`;
    });
    html += `</ul></div>`;
  }

  // Ditanya
  html += `<div style="margin-bottom:16px;"><strong>Ditanya:</strong> ${result.targets.join(', ')}</div>`;

  // Langkah
  html += `<h4 style="font-size:14px;margin-bottom:8px;">Langkah Penyelesaian</h4>`;
  html += `<ol style="margin-left:20px;font-size:14px;line-height:1.9;">`;

  result.steps.forEach((s) => {
    const varInfo = tab.variabel.find(v => v.kode === s.target);
    let hasilFmt = varInfo.satuan === 'Rp' ? formatRupiahEngine(s.result)
                 : s.target === 'i' ? formatAngkaEngine(s.result * 100) + '%'
                 : formatAngkaEngine(s.result);

    html += `<li>`;
    html += `<div><strong>${s.target}</strong> = <code>${s.ekspresi}</code></div>`;
    html += `<div style="color:var(--gray-text);font-size:13px;">`;
    html += `Substitusi: `;
    s.needed.forEach(n => {
      const nv = s.values[n];
      const nInfo = tab.variabel.find(v => v.kode === n);
      let nFmt = nInfo.satuan === 'Rp' ? formatRupiahEngine(nv)
               : n === 'i' ? formatAngkaEngine(nv * 100) + '%'
               : formatAngkaEngine(nv);
      html += `${n} = ${nFmt} `;
    });
    html += `</div>`;
    html += `<div>= <strong>${hasilFmt}</strong></div>`;
    html += `</li>`;
  });

  html += `</ol>`;

  // Jawaban akhir
  html += `<div class="example-box" style="margin-top:14px;">`;
  html += `<strong>Jawaban Akhir:</strong><ul style="margin:6px 0 0 20px;">`;
  result.targets.forEach(t => {
    const info = tab.variabel.find(v => v.kode === t);
    const val = result.values[t];
    let valFmt = info.satuan === 'Rp' ? formatRupiahEngine(val)
                : t === 'i' ? formatAngkaEngine(val * 100) + '%'
                : formatAngkaEngine(val);
    html += `<li>${info.label} (${t}) = <strong>${valFmt}</strong></li>`;
  });
  html += `</ul></div>`;

  html += `</div>`;

  // Tabel pelunasan (khusus anuitas)
  if (tab.butuhTabel && result.values.M0 !== undefined
      && result.values.A !== undefined
      && result.values.i !== undefined
      && result.values.n !== undefined) {

    const rows = generateAnuitasTable(
      result.values.M0,
      result.values.A,
      result.values.i,
      result.values.n
    );

    html += `
      <div class="calc-panel" style="margin-top:16px;">
        <h3 style="font-size:15px;margin-bottom:12px;color:var(--blue-dark);">Tabel Pelunasan</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Periode</th>
                <th>Sisa Awal</th>
                <th>Anuitas</th>
                <th>Bunga</th>
                <th>Angsuran Pokok</th>
                <th>Sisa Akhir</th>
              </tr>
            </thead>
            <tbody>
    `;

    rows.forEach(r => {
      html += `<tr>
        <td>${r.periode}</td>
        <td>${formatRupiahEngine(r.sisaAwal)}</td>
        <td>${formatRupiahEngine(r.anuitas)}</td>
        <td>${formatRupiahEngine(r.bunga)}</td>
        <td>${formatRupiahEngine(r.pokok)}</td>
        <td>${formatRupiahEngine(r.sisaAkhir)}</td>
      </tr>`;
    });

    html += `</tbody></table></div></div>`;
  }

  area.innerHTML = html;
}