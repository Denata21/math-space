/* ============================================================
   HALAMAN MATERI & DETAIL MATERI
   ============================================================ */

function renderMaterialsPage() {
  const materials = getMaterials();
  const app = document.getElementById('app');

  let html = `
    <div class="hero" style="padding:32px 28px;">
      <h2>Materi Pembelajaran</h2>
      <p>Pilih materi yang ingin kamu pelajari. Setiap materi dilengkapi tujuan, konsep, rumus, contoh soal, dan latihan.</p>
    </div>
    <div class="card-grid">
  `;

  materials.forEach(m => {
    html += `
      <div class="card">
        <span class="card-cat">${escapeHtml(m.kategori)}</span>
        <h3>${escapeHtml(m.judul)}</h3>
        <p>${escapeHtml(m.deskripsi)}</p>
        <button class="btn btn-primary btn-sm" onclick="navigate('material-detail', '${m.id}')">Pelajari</button>
      </div>
    `;
  });

  html += '</div>';
  app.innerHTML = html;
}

function renderMaterialDetail(materialId) {
  const materials = getMaterials();
  const m = materials.find(x => x.id === materialId);
  const app = document.getElementById('app');

  if (!m) {
    app.innerHTML = `<div class="hero"><h2>Materi tidak ditemukan</h2>
      <p>Materi yang Anda cari tidak tersedia.</p>
      <button class="btn btn-primary" onclick="navigate('materials')">Kembali</button></div>`;
    return;
  }

  const selesai = (typeof isMateriSelesai === 'function') && isMateriSelesai(m.id);

  let html = `
    <div class="material-detail">
      <button class="btn btn-secondary btn-sm" onclick="navigate('materials')" style="margin-bottom:16px;">← Kembali ke Materi</button>
      <h2>${escapeHtml(m.judul)}</h2>
      <span class="card-cat">${escapeHtml(m.kategori)}</span>
      ${selesai ? '<span class="badge badge-mudah" style="margin-left:8px;">✓ Sudah dipelajari</span>' : ''}

      <h3>Tujuan Pembelajaran</h3>
      <p>Setelah mempelajari materi ini, siswa dapat:</p>
      <ul>
  `;
  m.tujuan.forEach(t => { html += `<li>${escapeHtml(t)}</li>`; });
  html += `</ul>

      <h3>Pengantar</h3>
      <p>${escapeHtml(m.isi.split('\n\n')[0])}</p>

      <h3>Konsep Utama</h3>
      <p>${m.isi.split('\n\n').slice(1).map(p => escapeHtml(p)).join('</p><p>')}</p>

      <h3>Rumus</h3>
  `;
  m.rumus.forEach(r => { html += `<div class="formula">${escapeHtml(r)}</div>`; });

  html += `
      <h3>Contoh Soal</h3>
      <div class="example-box"><p>${escapeHtml(m.contoh).replace(/\n/g, '<br>')}</p></div>

      <h3>Langkah Penyelesaian</h3>
      <div class="example-box"><p>${escapeHtml(m.pembahasan).replace(/\n/g, '<br>')}</p></div>

      <h3>Latihan Soal</h3>
      <p>Uji pemahamanmu dengan mengerjakan latihan soal pada materi ini.</p>
  `;

  if (m.id === 'anuitas') {
    html += `<div id="formulaTabContainer"></div>`;
  }

  html += `<div class="detail-actions">`;

  if (!selesai) {
    html += `<button class="btn btn-primary" onclick="tandaiMateriSelesai('${m.id}'); if(typeof syncProgressSiswaKeGuru==='function') syncProgressSiswaKeGuru(); navigate('material-detail','${m.id}');">
    ✓ Tandai Sudah Dipelajari</button>`;
  } else {
    html += `<button class="btn btn-secondary" disabled>✓ Sudah Dipelajari</button>`;
  }

  html += `<button class="btn btn-outline" onclick="navigate('exercise', '${m.id}')">Kerjakan Latihan</button>`;
  html += `<button class="btn btn-outline" onclick="navigate('calculator')">Buka Kalkulator</button>`;
  html += `</div></div>`;

  app.innerHTML = html;

  if (m.id === 'anuitas') {
    const container = document.getElementById('formulaTabContainer');
    if (container && typeof renderFormulaTabs === 'function') {
      renderFormulaTabs(container);
    }
  }
}