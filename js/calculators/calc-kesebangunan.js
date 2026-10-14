/* ============================================================
   KALKULATOR KESEBANGUNGAN
   3 mode:
   - Perbandingan Sisi (a/b = c/d)
   - Skala Peta
   - Tinggi Objek via Bayangan
   ============================================================ */

function renderCalcKesebangunan(container) {
  container.innerHTML = `
    <div class="calc-panel">
      <div class="calc-hint">
        Pilih mode perhitungan kesebangunan yang kamu butuhkan.
      </div>

      <div class="form-group">
        <label>Mode Perhitungan</label>
        <select class="form-control" id="ksMode" onchange="switchKsMode()">
          <option value="sisi">📐 Perbandingan Sisi (a/b = c/d)</option>
          <option value="skala">🗺️ Skala Peta / Denah</option>
          <option value="bayangan">🌳 Tinggi Objek via Bayangan</option>
        </select>
      </div>

      <div id="ksFormArea"></div>
    </div>
    <div id="ksHasil"></div>
  `;

  switchKsMode();
}

function switchKsMode() {
  const mode = document.getElementById('ksMode').value;
  const area = document.getElementById('ksFormArea');
  const hasil = document.getElementById('ksHasil');
  if (hasil) hasil.innerHTML = '';

  if (mode === 'sisi') {
    area.innerHTML = `
      <p style="font-size:13px;color:var(--gray-text);margin-bottom:12px;">
        Isi 3 nilai, kosongkan 1 nilai yang ingin dicari. Rumus: <code>a/b = c/d</code>
      </p>
      <div class="form-row">
        <div class="form-group">
          <label>Sisi a (bangun 1)</label>
          <input type="number" step="any" class="form-control" id="ks_a" placeholder="kosongkan jika ditanya">
        </div>
        <div class="form-group">
          <label>Sisi b (bangun 1)</label>
          <input type="number" step="any" class="form-control" id="ks_b" placeholder="kosongkan jika ditanya">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Sisi c (bangun 2)</label>
          <input type="number" step="any" class="form-control" id="ks_c" placeholder="kosongkan jika ditanya">
        </div>
        <div class="form-group">
          <label>Sisi d (bangun 2)</label>
          <input type="number" step="any" class="form-control" id="ks_d" placeholder="kosongkan jika ditanya">
        </div>
      </div>
      <p class="login-error" id="ksError"></p>
      <div style="display:flex;gap:10px;margin-top:8px;">
        <button class="btn btn-primary" onclick="hitungKsSisi()">Hitung</button>
        <button class="btn btn-secondary" onclick="switchKsMode()">Reset</button>
      </div>
    `;
  } else if (mode === 'skala') {
    area.innerHTML = `
      <p style="font-size:13px;color:var(--gray-text);margin-bottom:12px;">
        Rumus: <code>Jarak Sebenarnya = Jarak Peta × Skala</code>
      </p>
      <div class="form-row">
        <div class="form-group">
          <label>Jarak Peta (cm)</label>
          <input type="number" step="any" class="form-control" id="sk_peta" placeholder="contoh: 5">
        </div>
        <div class="form-group">
          <label>Skala (1 : ...)</label>
          <input type="number" step="any" class="form-control" id="sk_skala" placeholder="contoh: 100000">
        </div>
      </div>
      <div class="form-group">
        <label>Jarak Sebenarnya (km) — <em>kosongkan jika ingin dicari</em></label>
        <input type="number" step="any" class="form-control" id="sk_asli" placeholder="kosongkan jika ditanya">
      </div>
      <p class="login-error" id="ksError"></p>
      <div style="display:flex;gap:10px;margin-top:8px;">
        <button class="btn btn-primary" onclick="hitungKsSkala()">Hitung</button>
        <button class="btn btn-secondary" onclick="switchKsMode()">Reset</button>
      </div>
    `;
  } else {
    area.innerHTML = `
      <p style="font-size:13px;color:var(--gray-text);margin-bottom:12px;">
        Rumus: <code>tinggi objek / bayangan objek = tinggi acuan / bayangan acuan</code>
      </p>
      <div class="form-row">
        <div class="form-group">
          <label>Tinggi Acuan (m)</label>
          <input type="number" step="any" class="form-control" id="by_ta" placeholder="contoh: 2">
        </div>
        <div class="form-group">
          <label>Bayangan Acuan (m)</label>
          <input type="number" step="any" class="form-control" id="by_ba" placeholder="contoh: 3">
        </div>
      </div>
      <div class="form-group">
        <label>Bayangan Objek (m)</label>
        <input type="number" step="any" class="form-control" id="by_bo" placeholder="contoh: 12">
      </div>
      <p class="login-error" id="ksError"></p>
      <div style="display:flex;gap:10px;margin-top:8px;">
        <button class="btn btn-primary" onclick="hitungKsBayangan()">Hitung</button>
        <button class="btn btn-secondary" onclick="switchKsMode()">Reset</button>
      </div>
    `;
  }
}

/* ----- Mode 1: Perbandingan sisi ----- */
function hitungKsSisi() {
  const a = parseFloat(document.getElementById('ks_a').value);
  const b = parseFloat(document.getElementById('ks_b').value);
  const c = parseFloat(document.getElementById('ks_c').value);
  const d = parseFloat(document.getElementById('ks_d').value);
  const err = document.getElementById('ksError');
  err.textContent = '';

  const filled = [a, b, c, d].filter(x => !isNaN(x)).length;
  if (filled < 3) {
    err.textContent = 'Isi minimal 3 nilai, kosongkan 1 untuk dicari.';
    return;
  }
  if (filled > 3) {
    err.textContent = 'Kosongkan tepat 1 nilai untuk dicari.';
    return;
  }

  let target, hasil, rumus, substitusi;
  if (isNaN(a)) {
    target = 'a'; hasil = b * c / d;
    rumus = 'a = b × c / d';
    substitusi = `a = ${b} × ${c} / ${d}`;
  } else if (isNaN(b)) {
    target = 'b'; hasil = a * d / c;
    rumus = 'b = a × d / c';
    substitusi = `b = ${a} × ${d} / ${c}`;
  } else if (isNaN(c)) {
    target = 'c'; hasil = a * d / b;
    rumus = 'c = a × d / b';
    substitusi = `c = ${a} × ${d} / ${b}`;
  } else {
    target = 'd'; hasil = b * c / a;
    rumus = 'd = b × c / a';
    substitusi = `d = ${b} × ${c} / ${a}`;
  }

  if (!isFinite(hasil)) {
    err.textContent = 'Perhitungan gagal (pembagian nol?).';
    return;
  }

  document.getElementById('ksHasil').innerHTML = `
    <div class="calc-panel">
      <h3 style="font-size:15px;margin-bottom:14px;color:var(--blue-dark);">
        Hasil & Langkah Penyelesaian
      </h3>

      <div style="margin-bottom:12px;">
        <strong>Diketahui:</strong>
        <ul style="margin:6px 0 0 20px;">
          ${!isNaN(a) ? `<li>a = ${a}</li>` : ''}
          ${!isNaN(b) ? `<li>b = ${b}</li>` : ''}
          ${!isNaN(c) ? `<li>c = ${c}</li>` : ''}
          ${!isNaN(d) ? `<li>d = ${d}</li>` : ''}
        </ul>
      </div>

      <div style="margin-bottom:16px;">
        <strong>Ditanya:</strong> ${target}
      </div>

      <h4 style="font-size:14px;margin-bottom:8px;">Langkah Penyelesaian</h4>
      <ol style="margin-left:20px;font-size:14px;line-height:1.9;">
        <li>Karena bangun sebangun, gunakan perbandingan senilai:
          <code>a/b = c/d</code></li>
        <li>Rumus untuk mencari <strong>${target}</strong>:
          <code>${rumus}</code></li>
        <li>Substitusi: ${substitusi} = <strong>${formatAngkaEngine(hasil)}</strong></li>
      </ol>

      <div class="example-box" style="margin-top:14px;">
        <strong>Jawaban Akhir:</strong> ${target} = ${formatAngkaEngine(hasil)}
      </div>
    </div>
  `;
}

/* ----- Mode 2: Skala ----- */
function hitungKsSkala() {
  const peta = parseFloat(document.getElementById('sk_peta').value);
  const skala = parseFloat(document.getElementById('sk_skala').value);
  const asli = parseFloat(document.getElementById('sk_asli').value);
  const err = document.getElementById('ksError');
  err.textContent = '';

  if (!isNaN(peta) && !isNaN(skala) && isNaN(asli)) {
    // Cari jarak sebenarnya
    const hasilCm = peta * skala;
    const hasilKm = hasilCm / 100000;
    document.getElementById('ksHasil').innerHTML = `
      <div class="calc-panel">
        <h3 style="font-size:15px;margin-bottom:14px;color:var(--blue-dark);">
          Hasil & Langkah Penyelesaian
        </h3>
        <ol style="margin-left:20px;font-size:14px;line-height:1.9;">
          <li>Rumus: <code>jarak sebenarnya = jarak peta × skala</code></li>
          <li>Substitusi: ${peta} cm × ${skala.toLocaleString('id-ID')}</li>
          <li>= ${hasilCm.toLocaleString('id-ID')} cm = <strong>${hasilKm.toLocaleString('id-ID', { maximumFractionDigits: 3 })} km</strong></li>
        </ol>
        <div class="result-grid" style="margin-top:16px;">
          <div class="result-card">
            <div class="label">Jarak (cm)</div>
            <div class="value">${hasilCm.toLocaleString('id-ID')} cm</div>
          </div>
          <div class="result-card">
            <div class="label">Jarak (km)</div>
            <div class="value">${hasilKm.toLocaleString('id-ID', { maximumFractionDigits: 3 })} km</div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  if (!isNaN(asli) && !isNaN(skala) && isNaN(peta)) {
    // Cari jarak peta
    const hasilCm = (asli * 100000) / skala;
    document.getElementById('ksHasil').innerHTML = `
      <div class="calc-panel">
        <h3 style="font-size:15px;margin-bottom:14px;color:var(--blue-dark);">
          Hasil & Langkah Penyelesaian
        </h3>
        <ol style="margin-left:20px;font-size:14px;line-height:1.9;">
          <li>Rumus: <code>jarak peta = (jarak sebenarnya × 100.000) / skala</code></li>
          <li>Substitusi: (${asli} × 100.000) / ${skala.toLocaleString('id-ID')}</li>
          <li>= <strong>${hasilCm.toLocaleString('id-ID', { maximumFractionDigits: 3 })} cm</strong></li>
        </ol>
      </div>
    `;
    return;
  }

  err.textContent = 'Isi 2 nilai (jarak peta & skala, atau jarak sebenarnya & skala), kosongkan 1 untuk dicari.';
}

/* ----- Mode 3: Bayangan ----- */
function hitungKsBayangan() {
  const ta = parseFloat(document.getElementById('by_ta').value);
  const ba = parseFloat(document.getElementById('by_ba').value);
  const bo = parseFloat(document.getElementById('by_bo').value);
  const err = document.getElementById('ksError');
  err.textContent = '';

  if (isNaN(ta) || isNaN(ba) || isNaN(bo)) {
    err.textContent = 'Isi semua nilai (tinggi acuan, bayangan acuan, bayangan objek).';
    return;
  }
  if (ba === 0) {
    err.textContent = 'Bayangan acuan tidak boleh nol.';
    return;
  }

  const to = (ta * bo) / ba;

  document.getElementById('ksHasil').innerHTML = `
    <div class="calc-panel">
      <h3 style="font-size:15px;margin-bottom:14px;color:var(--blue-dark);">
        Hasil & Langkah Penyelesaian
      </h3>
      <div style="margin-bottom:12px;">
        <strong>Diketahui:</strong>
        <ul style="margin:6px 0 0 20px;">
          <li>Tinggi acuan (ta) = ${ta} m</li>
          <li>Bayangan acuan (ba) = ${ba} m</li>
          <li>Bayangan objek (bo) = ${bo} m</li>
        </ul>
      </div>
      <div style="margin-bottom:16px;">
        <strong>Ditanya:</strong> Tinggi objek (to)
      </div>
      <ol style="margin-left:20px;font-size:14px;line-height:1.9;">
        <li>Karena sebangun: <code>ta/ba = to/bo</code></li>
        <li>Rumus: <code>to = (ta × bo) / ba</code></li>
        <li>Substitusi: to = (${ta} × ${bo}) / ${ba} = <strong>${formatAngkaEngine(to)} m</strong></li>
      </ol>
      <div class="example-box" style="margin-top:14px;">
        <strong>Jawaban Akhir:</strong> Tinggi objek = ${formatAngkaEngine(to)} meter
      </div>
    </div>
  `;
}