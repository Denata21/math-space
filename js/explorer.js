/* ============================================================
   EXPLORER — Math Explorer
   Slider real-time, grafik, pertanyaan pemandu, ruang pengamatan
   ============================================================ */

/* ============================================================
   HALAMAN DAFTAR EXPLORER
   ============================================================ */

function renderExplorerPage(preselectedId) {
  const app = document.getElementById('app');
  if (!app) return;

  // Kalau ada param, langsung buka detail
  if (preselectedId) {
    renderExplorerDetail(preselectedId);
    return;
  }

  const explorers = getExplorers();
  const materials = getMaterials();

  let html = `
    <div class="hero">
      <h2 class="hero-title">🔍 Math Explorer</h2>
      <p class="hero-subtitle">
        Ubah parameter, amati bagaimana hasilnya berubah, dan bangun intuisi matematismu.
        Setiap eksplorasi disertai pertanyaan pemandu dan ruang untuk mencatat pengamatan.
      </p>
    </div>

    <div class="card-grid">
  `;

  explorers.forEach(e => {
    const m = materials.find(x => x.id === e.materi);
    const sudah = (typeof getHasilExplorer === 'function') && getHasilExplorer(e.id);
    html += `
      <div class="card">
        <span class="card-cat">${m ? escapeHtml(m.judul) : ''}</span>
        ${sudah ? '<span class="badge badge-mudah" style="align-self:flex-start;margin-bottom:6px;">✓ Sudah dieksplorasi</span>' : ''}
        <h3>${escapeHtml(e.judul)}</h3>
        <p>${escapeHtml(e.konteks)}</p>
        <button class="btn btn-primary btn-sm" onclick="navigate('explorer', '${e.id}')">Mulai Eksplorasi</button>
      </div>
    `;
  });

  html += `</div>`;
  app.innerHTML = html;
}

/* ============================================================
   HALAMAN DETAIL EXPLORER
   ============================================================ */

function renderExplorerDetail(explorerId) {
  const app = document.getElementById('app');
  if (!app) return;

  const e = getExplorerById(explorerId);
  if (!e) {
    app.innerHTML = `
      <div class="hero">
        <h2 class="hero-title">Explorer tidak ditemukan</h2>
        <button class="btn btn-primary" onclick="navigate('explorer')">Kembali</button>
      </div>
    `;
    return;
  }

  const materials = getMaterials();
  const m = materials.find(x => x.id === e.materi);
  const hasilLama = (typeof getHasilExplorer === 'function') ? getHasilExplorer(e.id) : null;

  let sliderHtml = '';
  e.variabel.forEach(v => {
    sliderHtml += `
      <div class="form-group" style="margin-bottom:22px;">
        <label style="display:flex;justify-content:space-between;align-items:center;">
          <span>${escapeHtml(v.label)}</span>
          <span id="lbl_${v.kode}" style="color:var(--teal);font-weight:700;font-size:15px;">
            ${v.default}
          </span>
        </label>
        <input type="range" class="custom-slider"
               id="exp_${v.kode}"
               min="${v.min}" max="${v.max}" step="${v.step}" value="${v.default}"
               oninput="onExplorerSliderChange('${explorerId}')">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:4px;">
          <span>${formatAngka(v.min)}</span>
          <span>${formatAngka(v.max)}</span>
        </div>
      </div>
    `;
  });

  let pertanyaanHtml = '';
  e.pertanyaan.forEach((q, i) => {
    pertanyaanHtml += `
      <li style="margin-bottom:10px;line-height:1.7;">
        <span style="display:inline-block;background:var(--teal-light);color:var(--teal-dark);
                     width:22px;height:22px;border-radius:50%;text-align:center;
                     font-size:12px;font-weight:700;line-height:22px;margin-right:8px;">
          ${i + 1}
        </span>
        ${escapeHtml(q)}
      </li>
    `;
  });

  app.innerHTML = `
    <div class="material-detail">
      <button class="btn btn-secondary btn-sm" onclick="navigate('explorer')" style="margin-bottom:16px;">← Kembali</button>
      <span class="card-cat">${m ? escapeHtml(m.judul) : ''}</span>
      <h2 style="margin-top:10px;">${escapeHtml(e.judul)}</h2>
      <p style="font-size:15px;line-height:1.8;color:var(--text-muted);">${escapeHtml(e.konteks)}</p>

      <h3>🎛️ Atur Parameter</h3>
      <div class="calc-panel">
        ${sliderHtml}
        <div id="expResult"></div>
      </div>

      <h3>❓ Pertanyaan Pemandu</h3>
      <div class="calc-panel">
        <ol style="list-style:none;padding:0;margin:0;">
          ${pertanyaanHtml}
        </ol>
        ${e.catatan ? `
          <div class="calc-hint" style="margin-top:16px;margin-bottom:0;">
            💡 <strong>Petunjuk:</strong> ${escapeHtml(e.catatan)}
          </div>
        ` : ''}
      </div>

      <h3>📝 Catatan Pengamatan</h3>
      <div class="calc-panel">
        <div class="form-group">
          <label>Tulis pengamatan atau kesimpulanmu</label>
          <textarea class="form-control" id="expPengamatan"
                    placeholder="Contoh: Ketika n digandakan, bunga juga ikut menjadi 2× lipat. Ini menunjukkan hubungan linear..."
                    style="min-height:120px;">${hasilLama ? escapeHtml(hasilLama.pengamatan || '') : ''}</textarea>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="simpanExplorer('${explorerId}')">💾 Simpan Pengamatan</button>
          <button class="btn btn-secondary" onclick="resetExplorer('${explorerId}')">🔄 Reset Slider</button>
        </div>
        <p id="expSaveMsg" style="font-size:13px;margin-top:10px;color:var(--success);min-height:18px;"></p>
      </div>
    </div>
  `;

  // Render hasil awal
  updateExplorerResult(explorerId);
}

/* ============================================================
   UPDATE HASIL SAAT SLIDER BERGERAK
   ============================================================ */

function onExplorerSliderChange(explorerId) {
  const e = getExplorerById(explorerId);
  if (!e) return;

  // Update label nilai
  e.variabel.forEach(v => {
    const el = document.getElementById('exp_' + v.kode);
    const lbl = document.getElementById('lbl_' + v.kode);
    if (el && lbl) lbl.textContent = formatAngka(parseFloat(el.value));
  });

  updateExplorerResult(explorerId);
}

function updateExplorerResult(explorerId) {
  const e = getExplorerById(explorerId);
  if (!e) return;

  const params = {};
  e.variabel.forEach(v => {
    const el = document.getElementById('exp_' + v.kode);
    if (el) params[v.kode] = parseFloat(el.value);
  });

  const result = e.hitung(params);
  const resultEl = document.getElementById('expResult');
  if (!resultEl) return;

  // Render per materi
  if (explorerId === 'exp-bunga-tunggal') {
    resultEl.innerHTML = `
      <div class="result-grid" style="margin-top:8px;">
        <div class="result-card">
          <div class="label">Bunga (b)</div>
          <div class="value">${formatRupiah(result.bunga)}</div>
        </div>
        <div class="result-card">
          <div class="label">Modal Akhir (Mn)</div>
          <div class="value">${formatRupiah(result.Mn)}</div>
        </div>
      </div>
      ${buildGrafikLinear(params.M0, params.i, params.n)}
    `;
  } else if (explorerId === 'exp-bunga-majemuk') {
    resultEl.innerHTML = `
      <div class="result-grid" style="margin-top:8px;">
        <div class="result-card">
          <div class="label">Modal Akhir (Majemuk)</div>
          <div class="value">${formatRupiah(result.MnMajemuk)}</div>
        </div>
        <div class="result-card">
          <div class="label">Modal Akhir (Tunggal)</div>
          <div class="value">${formatRupiah(result.MnTunggal)}</div>
        </div>
        <div class="result-card" style="background:var(--teal-light);">
          <div class="label">Selisih</div>
          <div class="value" style="color:var(--teal-dark);">${formatRupiah(result.selisih)}</div>
        </div>
      </div>
      ${buildGrafikPerbandingan(params.M0, params.i, params.n)}
    `;
  } else if (explorerId === 'exp-anuitas') {
    resultEl.innerHTML = `
      <div class="result-grid" style="margin-top:8px;">
        <div class="result-card">
          <div class="label">Anuitas per Tahun (A)</div>
          <div class="value">${formatRupiah(result.A)}</div>
        </div>
        <div class="result-card">
          <div class="label">Total Bayar</div>
          <div class="value">${formatRupiah(result.totalBayar)}</div>
        </div>
        <div class="result-card">
          <div class="label">Total Bunga</div>
          <div class="value" style="color:var(--danger);">${formatRupiah(result.totalBunga)}</div>
        </div>
      </div>
      ${buildTabelAnuitas(result.tabel)}
    `;
  }
}

/* ============================================================
   GRAFIK: LINEAR (bunga tunggal)
   ============================================================ */

function buildGrafikLinear(M0, iPersen, nMax) {
  const iDes = iPersen / 100;
  const width = 500, height = 260;
  const padL = 70, padR = 20, padT = 20, padB = 40;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const points = [];
  for (let n = 0; n <= nMax; n++) {
    points.push({ n, Mn: M0 * (1 + iDes * n) });
  }
  const maxMn = Math.max(...points.map(p => p.Mn));

  const xScale = n => padL + (n / nMax) * chartW;
  const yScale = v => padT + chartH - (v / maxMn) * chartH;

  let path = '';
  points.forEach((p, idx) => {
    path += (idx === 0 ? 'M' : 'L') + ` ${xScale(p.n)} ${yScale(p.Mn)} `;
  });

  let svg = `<svg viewBox="0 0 ${width} ${height}" style="width:100%;max-width:${width}px;height:auto;display:block;margin:16px auto 0;">`;

  // Grid
  for (let k = 0; k <= 4; k++) {
    const y = padT + (chartH * k / 4);
    const val = maxMn * (1 - k / 4);
    svg += `<line x1="${padL}" y1="${y}" x2="${padL + chartW}" y2="${y}" stroke="var(--border)" stroke-dasharray="3,3"/>`;
    svg += `<text x="${padL - 6}" y="${y + 4}" text-anchor="end" font-size="10" fill="var(--text-muted)">${formatRupiahShort(val)}</text>`;
  }

  // Sumbu
  svg += `<line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + chartH}" stroke="var(--border-strong)"/>`;
  svg += `<line x1="${padL}" y1="${padT + chartH}" x2="${padL + chartW}" y2="${padT + chartH}" stroke="var(--border-strong)"/>`;

  // Label X
  const step = Math.max(1, Math.round(nMax / 5));
  for (let n = 0; n <= nMax; n += step) {
    svg += `<text x="${xScale(n)}" y="${padT + chartH + 18}" text-anchor="middle" font-size="10" fill="var(--text-muted)">${n}</text>`;
  }

  // Line
  svg += `<path d="${path}" fill="none" stroke="var(--teal)" stroke-width="2.5"/>`;

  // Titik di setiap n
  points.forEach(p => {
    svg += `<circle cx="${xScale(p.n)}" cy="${yScale(p.Mn)}" r="3" fill="var(--teal)"/>`;
  });

  // Label sumbu
  svg += `<text x="${padL + chartW / 2}" y="${height - 4}" text-anchor="middle" font-size="11" fill="var(--text-muted)">Tahun (n)</text>`;
  svg += `<text x="10" y="${padT + chartH / 2}" text-anchor="middle" font-size="11" fill="var(--text-muted)" transform="rotate(-90 10 ${padT + chartH / 2})">Modal Akhir</text>`;

  svg += `</svg>`;
  return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px;margin-top:16px;">${svg}</div>`;
}

/* ============================================================
   GRAFIK: PERBANDINGAN (bunga majemuk vs tunggal)
   ============================================================ */

function buildGrafikPerbandingan(M0, iPersen, nMax) {
  const iDes = iPersen / 100;
  const width = 500, height = 260;
  const padL = 70, padR = 20, padT = 20, padB = 40;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const points = [];
  for (let n = 0; n <= nMax; n++) {
    points.push({
      n,
      majemuk: M0 * Math.pow(1 + iDes, n),
      tunggal: M0 * (1 + iDes * n)
    });
  }
  const maxMn = Math.max(...points.map(p => p.majemuk));

  const xScale = n => padL + (n / nMax) * chartW;
  const yScale = v => padT + chartH - (v / maxMn) * chartH;

  let pathM = '', pathT = '';
  points.forEach((p, idx) => {
    pathM += (idx === 0 ? 'M' : 'L') + ` ${xScale(p.n)} ${yScale(p.majemuk)} `;
    pathT += (idx === 0 ? 'M' : 'L') + ` ${xScale(p.n)} ${yScale(p.tunggal)} `;
  });

  let svg = `<svg viewBox="0 0 ${width} ${height}" style="width:100%;max-width:${width}px;height:auto;display:block;margin:16px auto 0;">`;

  for (let k = 0; k <= 4; k++) {
    const y = padT + (chartH * k / 4);
    const val = maxMn * (1 - k / 4);
    svg += `<line x1="${padL}" y1="${y}" x2="${padL + chartW}" y2="${y}" stroke="var(--border)" stroke-dasharray="3,3"/>`;
    svg += `<text x="${padL - 6}" y="${y + 4}" text-anchor="end" font-size="10" fill="var(--text-muted)">${formatRupiahShort(val)}</text>`;
  }

  svg += `<line x1="${padL}" y1="${padT}" x2="${padL}" y2="${padT + chartH}" stroke="var(--border-strong)"/>`;
  svg += `<line x1="${padL}" y1="${padT + chartH}" x2="${padL + chartW}" y2="${padT + chartH}" stroke="var(--border-strong)"/>`;

  const step = Math.max(1, Math.round(nMax / 5));
  for (let n = 0; n <= nMax; n += step) {
    svg += `<text x="${xScale(n)}" y="${padT + chartH + 18}" text-anchor="middle" font-size="10" fill="var(--text-muted)">${n}</text>`;
  }

  // Tunggal (garis putus)
  svg += `<path d="${pathT}" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-dasharray="6,4"/>`;
  // Majemuk
  svg += `<path d="${pathM}" fill="none" stroke="var(--teal)" stroke-width="2.5"/>`;

  // Legend
  svg += `<line x1="${padL + 10}" y1="${padT + 10}" x2="${padL + 30}" y2="${padT + 10}" stroke="var(--teal)" stroke-width="2.5"/>`;
  svg += `<text x="${padL + 36}" y="${padT + 14}" font-size="11" fill="var(--text)">Majemuk</text>`;
  svg += `<line x1="${padL + 110}" y1="${padT + 10}" x2="${padL + 130}" y2="${padT + 10}" stroke="var(--text-muted)" stroke-width="2" stroke-dasharray="6,4"/>`;
  svg += `<text x="${padL + 136}" y="${padT + 14}" font-size="11" fill="var(--text)">Tunggal</text>`;

  svg += `<text x="${padL + chartW / 2}" y="${height - 4}" text-anchor="middle" font-size="11" fill="var(--text-muted)">Tahun (n)</text>`;

  svg += `</svg>`;
  return `<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px;margin-top:16px;">${svg}</div>`;
}

/* ============================================================
   TABEL ANUITAS (untuk explorer)
   ============================================================ */

function buildTabelAnuitas(tabel) {
  let html = `<div class="table-wrap" style="margin-top:16px;"><table><thead><tr>`;
  html += `<th>Periode</th><th>Sisa Awal</th><th>Bunga</th><th>Pokok</th><th>Sisa Akhir</th>`;
  html += `</tr></thead><tbody>`;
  tabel.forEach(r => {
    html += `<tr>
      <td>${r.periode}</td>
      <td>${formatRupiah(r.sisaAwal)}</td>
      <td style="color:var(--danger);">${formatRupiah(r.bunga)}</td>
      <td style="color:var(--teal-dark);">${formatRupiah(r.pokok)}</td>
      <td>${formatRupiah(r.sisaAkhir)}</td>
    </tr>`;
  });
  html += `</tbody></table></div>`;
  html += `<p style="font-size:13px;color:var(--text-muted);margin-top:10px;">
    🟥 Bunga menurun seiring waktu. 🟩 Pokok meningkat. Total anuitas tetap.
  </p>`;
  return html;
}

/* ============================================================
   FORMAT RUPIAH RINGKAS (untuk sumbu grafik)
   ============================================================ */

function formatRupiahShort(angka) {
  if (angka >= 1e9) return (angka / 1e9).toFixed(1) + 'M';
  if (angka >= 1e6) return (angka / 1e6).toFixed(1) + 'jt';
  if (angka >= 1e3) return (angka / 1e3).toFixed(0) + 'rb';
  return Math.round(angka).toString();
}

/* ============================================================
   SIMPAN & RESET
   ============================================================ */

function simpanExplorer(explorerId) {
  const e = getExplorerById(explorerId);
  if (!e) return;

  const params = {};
  e.variabel.forEach(v => {
    const el = document.getElementById('exp_' + v.kode);
    if (el) params[v.kode] = parseFloat(el.value);
  });

  const pengamatan = document.getElementById('expPengamatan').value.trim();

  if (typeof simpanHasilExplorer === 'function') {
    simpanHasilExplorer(explorerId, params, pengamatan);
  }

  const msg = document.getElementById('expSaveMsg');
  if (msg) {
    msg.textContent = '✓ Pengamatan tersimpan!';
    setTimeout(() => { msg.textContent = ''; }, 3000);
  }
}

function resetExplorer(explorerId) {
  const e = getExplorerById(explorerId);
  if (!e) return;

  e.variabel.forEach(v => {
    const el = document.getElementById('exp_' + v.kode);
    if (el) {
      el.value = v.default;
      const lbl = document.getElementById('lbl_' + v.kode);
      if (lbl) lbl.textContent = formatAngka(v.default);
    }
  });

  updateExplorerResult(explorerId);
}