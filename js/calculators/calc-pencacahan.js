/* ============================================================
   KALKULATOR PENCACAHAN (faktorial, permutasi, kombinasi)
   ============================================================ */

function renderCalcPencacahan(container) {
  container.innerHTML = `
    <div class="calc-panel">
      <div class="calc-hint">
        Pilih jenis perhitungan, lalu isi nilai n (dan r jika perlu).
      </div>

      <div class="form-group">
        <label>Jenis Perhitungan</label>
        <select class="form-control" id="pcMode" onchange="togglePencacahanR()">
          <option value="faktorial">Faktorial (n!)</option>
          <option value="permutasi">Permutasi (nPr)</option>
          <option value="kombinasi">Kombinasi (nCr)</option>
        </select>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Nilai n</label>
          <input type="number" class="form-control" id="pcN" placeholder="5">
        </div>
        <div class="form-group" id="pcRGroup" style="display:none;">
          <label>Nilai r</label>
          <input type="number" class="form-control" id="pcR" placeholder="3">
        </div>
      </div>

      <p class="login-error" id="pcError"></p>
      <div style="display:flex;gap:10px;margin-top:8px;">
        <button class="btn btn-primary" onclick="hitungPencacahan()">Hitung</button>
        <button class="btn btn-secondary" onclick="resetPencacahan()">Reset</button>
      </div>
    </div>
    <div id="pcHasil"></div>
  `;
}

function togglePencacahanR() {
  const mode = document.getElementById('pcMode').value;
  document.getElementById('pcRGroup').style.display = mode === 'faktorial' ? 'none' : 'block';
}

function resetPencacahan() {
  document.getElementById('pcN').value = '';
  document.getElementById('pcR').value = '';
  document.getElementById('pcError').textContent = '';
  document.getElementById('pcHasil').innerHTML = '';
}

function hitungPencacahan() {
  const mode = document.getElementById('pcMode').value;
  const n = parseFloat(document.getElementById('pcN').value);
  const r = parseFloat(document.getElementById('pcR').value);
  const errEl = document.getElementById('pcError');
  errEl.textContent = '';

  if (isNaN(n) || n < 0 || !Number.isInteger(n)) {
    errEl.textContent = 'Nilai n harus bilangan bulat ≥ 0.';
    return;
  }

  let hasil, rumusStr, langkah, judul;

  try {
    if (mode === 'faktorial') {
      hasil = faktorial(n);
      rumusStr = `${n}!`;
      judul = 'Faktorial';
      const deret = n <= 10
        ? Array.from({ length: n }, (_, i) => n - i).join(' × ') || '1'
        : `${n} × ${n - 1} × ... × 2 × 1`;
      langkah = `${n}! = ${deret} = ${hasil.toLocaleString('id-ID')}`;

    } else if (mode === 'permutasi') {
      if (isNaN(r) || r < 0 || !Number.isInteger(r)) {
        errEl.textContent = 'Nilai r harus bilangan bulat ≥ 0.';
        return;
      }
      if (r > n) {
        errEl.textContent = 'Nilai r tidak boleh lebih besar dari n.';
        return;
      }
      hasil = faktorial(n) / faktorial(n - r);
      rumusStr = `nPr = n! / (n−r)!`;
      judul = 'Permutasi';
      langkah = `${n}P${r} = ${n}! / (${n}−${r})! = ${faktorial(n).toLocaleString('id-ID')} / ${faktorial(n - r).toLocaleString('id-ID')} = ${hasil.toLocaleString('id-ID')}`;

    } else {
      if (isNaN(r) || r < 0 || !Number.isInteger(r)) {
        errEl.textContent = 'Nilai r harus bilangan bulat ≥ 0.';
        return;
      }
      if (r > n) {
        errEl.textContent = 'Nilai r tidak boleh lebih besar dari n.';
        return;
      }
      hasil = faktorial(n) / (faktorial(r) * faktorial(n - r));
      rumusStr = `nCr = n! / (r! × (n−r)!)`;
      judul = 'Kombinasi';
      langkah = `${n}C${r} = ${n}! / (${r}! × ${n - r}!) = ${faktorial(n).toLocaleString('id-ID')} / (${faktorial(r).toLocaleString('id-ID')} × ${faktorial(n - r).toLocaleString('id-ID')}) = ${hasil.toLocaleString('id-ID')}`;
    }
  } catch (e) {
    errEl.textContent = e.message;
    return;
  }

  document.getElementById('pcHasil').innerHTML = `
    <div class="calc-panel">
      <h3 style="font-size:15px;margin-bottom:14px;color:var(--blue-dark);">
        Hasil & Langkah Penyelesaian
      </h3>

      <div class="result-grid">
        <div class="result-card">
          <div class="label">${judul}</div>
          <div class="value">${hasil.toLocaleString('id-ID')}</div>
        </div>
      </div>

      <h4 style="font-size:14px;margin:16px 0 8px;">Langkah Penyelesaian</h4>
      <ol style="margin-left:20px;font-size:14px;line-height:1.9;">
        <li>
          <div><strong>Rumus:</strong> <code>${rumusStr}</code></div>
        </li>
        <li>
          <div><strong>Substitusi & hitung:</strong></div>
          <div style="color:var(--gray-text);font-size:13px;">${langkah}</div>
        </li>
      </ol>

      <div class="example-box" style="margin-top:14px;">
        <strong>Jawaban Akhir:</strong> ${hasil.toLocaleString('id-ID')}
      </div>
    </div>
  `;
}

/* faktorial() didefinisikan di formula-engine.js */