/* ============================================================
   KALKULATOR STATISTIKA
   Form input data → hitung mean, median, modus, kuartil
   + tampilkan grafik (dari grafik-statistika.js)
   ============================================================ */

function renderCalcStatistika(container) {
  container.innerHTML = `
    <div class="calc-panel">
      <div class="calc-hint">
        Masukkan data tunggal, pisahkan dengan koma. Contoh: 7, 8, 6, 8, 9, 7, 8
      </div>
      <div class="form-group">
        <label>Data</label>
        <textarea class="form-control" id="statData" placeholder="7, 8, 6, 8, 9, 7, 8"
                  style="min-height:70px;"></textarea>
      </div>
      <p class="login-error" id="statError"></p>
      <div style="display:flex;gap:10px;margin-top:8px;">
        <button class="btn btn-primary" onclick="hitungStatistika()">Hitung</button>
        <button class="btn btn-secondary" onclick="resetStatistika()">Reset</button>
      </div>
    </div>
    <div id="statHasil"></div>
  `;
}

function resetStatistika() {
  document.getElementById('statData').value = '';
  document.getElementById('statHasil').innerHTML = '';
  document.getElementById('statError').textContent = '';
}

function hitungStatistika() {
  const raw = document.getElementById('statData').value.trim();
  const errEl = document.getElementById('statError');
  errEl.textContent = '';

  if (!raw) {
    errEl.textContent = 'Isi data terlebih dahulu.';
    return;
  }

  const arr = raw.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
  if (arr.length === 0) {
    errEl.textContent = 'Data tidak valid. Contoh: 7, 8, 6, 8, 9';
    return;
  }

  const sorted = [...arr].sort((a, b) => a - b);
  const n = sorted.length;
  const sum = arr.reduce((s, x) => s + x, 0);
  const mean = sum / n;

  let median;
  if (n % 2 === 1) median = sorted[(n - 1) / 2];
  else median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

  const freq = {};
  arr.forEach(x => { freq[x] = (freq[x] || 0) + 1; });
  let maxFreq = 0;
  Object.values(freq).forEach(f => { if (f > maxFreq) maxFreq = f; });
  const modusArr = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
  const modus = maxFreq === 1 ? 'tidak ada' : modusArr.join(', ');

  const q1 = hitungKuartil(sorted, 0.25);
  const q3 = hitungKuartil(sorted, 0.75);
  const jangkauan = sorted[n - 1] - sorted[0];

  document.getElementById('statHasil').innerHTML = `
    <div class="calc-panel">
      <h3 style="font-size:15px;margin-bottom:14px;color:var(--blue-dark);">
        Hasil & Langkah Penyelesaian
      </h3>

      <div style="margin-bottom:12px;">
        <strong>Data terurut:</strong> ${sorted.join(', ')}
      </div>

      <div class="result-grid">
        <div class="result-card"><div class="label">Mean</div><div class="value">${formatAngkaEngine(mean)}</div></div>
        <div class="result-card"><div class="label">Median</div><div class="value">${formatAngkaEngine(median)}</div></div>
        <div class="result-card"><div class="label">Modus</div><div class="value">${modus}</div></div>
        <div class="result-card"><div class="label">Q1</div><div class="value">${formatAngkaEngine(q1)}</div></div>
        <div class="result-card"><div class="label">Q3</div><div class="value">${formatAngkaEngine(q3)}</div></div>
        <div class="result-card"><div class="label">Jangkauan</div><div class="value">${formatAngkaEngine(jangkauan)}</div></div>
      </div>

      <h4 style="font-size:14px;margin:16px 0 8px;">Langkah Penyelesaian</h4>
      <ol style="margin-left:20px;font-size:14px;line-height:1.9;">
        <li>
          <div><strong>Mean</strong> = jumlah data / banyak data</div>
          <div style="color:var(--gray-text);font-size:13px;">
            = (${arr.join(' + ')}) / ${n} = ${sum} / ${n} = ${formatAngkaEngine(mean)}
          </div>
        </li>
        <li>
          <div><strong>Median</strong> = ${n % 2 === 1 ? 'nilai tengah' : 'rata-rata dua nilai tengah'}</div>
          <div style="color:var(--gray-text);font-size:13px;">
            = ${n % 2 === 1
              ? `data ke-${(n+1)/2} dari ${sorted.join(', ')}`
              : `(data ke-${n/2} + data ke-${n/2+1}) / 2`} = ${formatAngkaEngine(median)}
          </div>
        </li>
        <li>
          <div><strong>Modus</strong> = nilai paling sering muncul</div>
          <div style="color:var(--gray-text);font-size:13px;">
            ${maxFreq === 1 ? 'Semua nilai muncul 1 kali → tidak ada modus' : `${modus} (muncul ${maxFreq} kali)`}
          </div>
        </li>
        <li>
          <div><strong>Q1</strong> = kuartil bawah = ${formatAngkaEngine(q1)}</div>
        </li>
        <li>
          <div><strong>Q3</strong> = kuartil atas = ${formatAngkaEngine(q3)}</div>
        </li>
        <li>
          <div><strong>Jangkauan</strong> = data terbesar − data terkecil</div>
          <div style="color:var(--gray-text);font-size:13px;">
            = ${sorted[n-1]} − ${sorted[0]} = ${formatAngkaEngine(jangkauan)}
          </div>
        </li>
      </ol>
    </div>

    <div id="statGrafik"></div>
  `;

  // Render grafik (jika fungsi tersedia)
  if (typeof renderGrafikStatistika === 'function') {
    renderGrafikStatistika(document.getElementById('statGrafik'), arr);
  }
}