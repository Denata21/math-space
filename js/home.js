/* ============================================================
   HOME — Beranda setelah login
   ============================================================ */

function renderHome() {
  const app = document.getElementById('app');
  if (!app) return;

  const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;
  const isGuru = user && user.role === 'guru';

  let greeting = '';
  if (user) {
    greeting = `
      <div class="calc-panel" style="margin-bottom:20px;background:var(--teal-light);border-color:var(--teal);">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <div>
            <strong style="font-size:16px;">👋 Halo, ${escapeHtml(user.nama)}!</strong>
            <p style="color:var(--text-muted);font-size:13px;margin-top:4px;">
              ${isGuru ? 'Guru / Admin' : 'Siswa • ' + escapeHtml(user.kelas || '-')}
              • Selamat ${isGuru ? 'mengajar' : 'belajar'}!
            </p>
          </div>
          <button class="btn btn-primary btn-sm"
                  onclick="navigate('${isGuru ? 'dashboard-guru' : 'dashboard-siswa'}')">
            ${isGuru ? '📊 Dashboard' : '📊 Progres Saya'}
          </button>
        </div>
      </div>
    `;
  }

  // Ringkasan progress (untuk siswa)
  let progressHtml = '';
  if (!isGuru && typeof hitungProgressKeseluruhan === 'function') {
    const r = hitungProgressKeseluruhan();
    if (r.materiSelesai > 0 || r.latihanSelesai > 0 || r.explorerSelesai > 0) {
      progressHtml = `
        <div class="calc-panel" style="margin-bottom:24px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:12px;">
            <strong>📊 Ringkasan Belajar</strong>
            <button class="btn btn-secondary btn-sm" onclick="navigate('dashboard-siswa')">Detail</button>
          </div>
          <div class="result-grid" style="margin:0;">
            <div class="result-card">
              <div class="label">Materi Dipelajari</div>
              <div class="value">${r.materiSelesai}/${r.totalMateri}</div>
            </div>
            <div class="result-card">
              <div class="label">Latihan Dikerjakan</div>
              <div class="value">${r.latihanSelesai}</div>
            </div>
            <div class="result-card">
              <div class="label">Explorer Selesai</div>
              <div class="value">${r.explorerSelesai}</div>
            </div>
            <div class="result-card">
              <div class="label">Detective Selesai</div>
              <div class="value">${r.detectiveSelesai}</div>
            </div>
          </div>
        </div>
      `;
    }
  }

  app.innerHTML = `
    <div class="hero">
      <h2 class="hero-title">Selamat Datang di MathSpace</h2>
      <p class="hero-subtitle">
        MathSpace membantumu memahami matematika melalui lima tahap:
        <strong>Calculate → Explore → Investigate → Apply → Reflect</strong>.
        Bukan sekadar mendapatkan jawaban, tetapi menguji pemikiran dan mempertanggungjawabkan kesimpulan.
      </p>
      <div class="hero-actions">
        <button class="btn btn-primary" onclick="navigate('materials')">📚 Mulai Belajar</button>
        <button class="btn btn-outline" onclick="navigate('calculator')">🧮 Kalkulator</button>
        <button class="btn btn-secondary" onclick="navigate('explorer')">🔍 Explorer</button>
      </div>
    </div>

    ${greeting}
    ${progressHtml}

    <h3 class="section-title">🎯 Lima Tahap Belajar</h3>
    <div class="card-grid">
      <div class="card">
        <span class="card-cat">1. Calculate</span>
        <h3>Kalkulator</h3>
        <p>Hitung dengan rumus yang benar. Lihat langkah penyelesaian dan arti setiap variabel.</p>
        <button class="btn btn-primary btn-sm" onclick="navigate('calculator')">Buka Kalkulator</button>
      </div>
      <div class="card">
        <span class="card-cat">2. Explore</span>
        <h3>Math Explorer</h3>
        <p>Ubah parameter, amati perubahan hasil, dan bandingkan skenario. Bangun intuisi matematismu.</p>
        <button class="btn btn-primary btn-sm" onclick="navigate('explorer')">Mulai Eksplorasi</button>
      </div>
      <div class="card">
        <span class="card-cat">3. Investigate</span>
        <h3>Math Detective</h3>
        <p>Periksa pernyataan, temukan kesalahan, dan jelaskan alasan matematismu.</p>
        <button class="btn btn-primary btn-sm" onclick="navigate('detective')">Mulai Investigasi</button>
      </div>
      <div class="card">
        <span class="card-cat">4. Apply</span>
        <h3>Tantangan Kontekstual</h3>
        <p>Selesaikan masalah nyata dengan konteks keuangan, tabungan, dan pinjaman.</p>
        <button class="btn btn-primary btn-sm" onclick="navigate('challenge')">Lihat Tantangan</button>
      </div>
      <div class="card">
        <span class="card-cat">5. Reflect</span>
        <h3>Refleksi & Umpan Balik</h3>
        <p>Tulis kesimpulan, bandingkan strategi, dan tinjau kembali proses berpikirmu.</p>
        <button class="btn btn-secondary btn-sm" onclick="navigate('${isGuru ? 'dashboard-guru' : 'dashboard-siswa'}')">
          Lihat Refleksi
        </button>
      </div>
    </div>

    <h3 class="section-title">📖 Materi Tersedia</h3>
    <div class="card-grid" id="homeMaterialGrid"></div>
  `;

  // Render kartu materi
  const grid = document.getElementById('homeMaterialGrid');
  if (!grid) return;
  const materials = (typeof getMaterials === 'function') ? getMaterials() : [];
  materials.forEach(m => {
    const selesai = (typeof isMateriSelesai === 'function') && isMateriSelesai(m.id);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <span class="card-cat">${escapeHtml(m.kategori)}</span>
      ${selesai ? '<span class="badge badge-mudah" style="align-self:flex-start;margin-bottom:6px;">✓ Sudah dipelajari</span>' : ''}
      <h3>${escapeHtml(m.judul)}</h3>
      <p>${escapeHtml(m.deskripsi)}</p>
      <button class="btn btn-primary btn-sm" onclick="navigate('material-detail', '${m.id}')">Pelajari</button>
    `;
    grid.appendChild(card);
  });
}

/* ============================================================
   HALAMAN DAFTAR MATERI
   ============================================================ */

function renderMaterialsPage() {
  const app = document.getElementById('app');
  if (!app) return;

  const materials = (typeof getMaterials === 'function') ? getMaterials() : [];

  let html = `
    <div class="hero">
      <h2 class="hero-title">Materi Pembelajaran</h2>
      <p class="hero-subtitle">
        Pilih materi yang ingin kamu pelajari. Setiap materi dilengkapi tujuan,
        konsep, rumus, contoh soal, kalkulator, explorer, detective, dan tantangan kontekstual.
      </p>
    </div>
    <div class="card-grid">
  `;

  materials.forEach(m => {
    const selesai = (typeof isMateriSelesai === 'function') && isMateriSelesai(m.id);
    html += `
      <div class="card">
        <span class="card-cat">${escapeHtml(m.kategori)}</span>
        ${selesai ? '<span class="badge badge-mudah" style="align-self:flex-start;margin-bottom:6px;">✓ Sudah dipelajari</span>' : ''}
        <h3>${escapeHtml(m.judul)}</h3>
        <p>${escapeHtml(m.deskripsi)}</p>
        <button class="btn btn-primary btn-sm" onclick="navigate('material-detail', '${m.id}')">Pelajari</button>
      </div>
    `;
  });

  html += '</div>';
  app.innerHTML = html;
}

/* ============================================================
   HALAMAN DETAIL MATERI
   ============================================================ */

function renderMaterialDetail(materialId) {
  const app = document.getElementById('app');
  if (!app) return;

  const m = (typeof getMaterialById === 'function') ? getMaterialById(materialId) : null;
  if (!m) {
    app.innerHTML = `
      <div class="hero">
        <h2 class="hero-title">Materi tidak ditemukan</h2>
        <p class="hero-subtitle">Materi yang Anda cari tidak tersedia.</p>
        <button class="btn btn-primary" onclick="navigate('materials')">Kembali ke Materi</button>
      </div>
    `;
    return;
  }

  const selesai = (typeof isMateriSelesai === 'function') && isMateriSelesai(m.id);

  let html = `
    <div class="material-detail">
      <button class="btn btn-secondary btn-sm" onclick="navigate('materials')" style="margin-bottom:16px;">← Kembali ke Materi</button>
      <h2>${escapeHtml(m.judul)}</h2>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">
        <span class="card-cat" style="margin:0;">${escapeHtml(m.kategori)}</span>
        ${selesai ? '<span class="badge badge-mudah">✓ Sudah dipelajari</span>' : ''}
      </div>

      <h3>🎯 Tujuan Pembelajaran</h3>
      <p>Setelah mempelajari materi ini, siswa dapat:</p>
      <ul>
  `;
  m.tujuan.forEach(t => { html += `<li>${escapeHtml(t)}</li>`; });
  html += `</ul>

      <h3>📖 Pengantar</h3>
      <p style="white-space:pre-line;">${escapeHtml(m.isi)}</p>

      <h3>📐 Rumus</h3>
  `;
  m.rumus.forEach(r => { html += `<div class="formula">${escapeHtml(r)}</div>`; });

  html += `
      <h3>✏️ Contoh Soal</h3>
      <div class="example-box"><p style="white-space:pre-line;margin:0;">${escapeHtml(m.contoh)}</p></div>

      <h3>💡 Pembahasan</h3>
      <div class="example-box"><p style="white-space:pre-line;margin:0;">${escapeHtml(m.pembahasan)}</p></div>

      <h3>🔗 Aktivitas Terkait</h3>
      <div class="card-grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));">
  `;

  // Tombol ke Explorer, Detective, Challenge
  if (m.explorerId) {
    html += `
      <div class="card" style="padding:16px;">
        <span class="card-cat">Explore</span>
        <h3 style="font-size:15px;">Math Explorer</h3>
        <p style="font-size:13px;margin-bottom:12px;">Eksplorasi parameter dan bangun intuisi.</p>
        <button class="btn btn-primary btn-sm" onclick="navigate('explorer', '${m.explorerId}')">Buka Explorer</button>
      </div>
    `;
  }
  if (m.detectiveId) {
    html += `
      <div class="card" style="padding:16px;">
        <span class="card-cat">Investigate</span>
        <h3 style="font-size:15px;">Math Detective</h3>
        <p style="font-size:13px;margin-bottom:12px;">Periksa pernyataan dan temukan kesalahan.</p>
        <button class="btn btn-primary btn-sm" onclick="navigate('detective', '${m.detectiveId}')">Buka Detective</button>
      </div>
    `;
  }
  if (m.challengeIds && m.challengeIds.length > 0) {
    html += `
      <div class="card" style="padding:16px;">
        <span class="card-cat">Apply</span>
        <h3 style="font-size:15px;">Tantangan Kontekstual</h3>
        <p style="font-size:13px;margin-bottom:12px;">Selesaikan masalah nyata.</p>
        <button class="btn btn-primary btn-sm" onclick="navigate('challenge', '${m.id}')">Lihat Tantangan</button>
      </div>
    `;
  }

  html += `</div>

      <div class="detail-actions">
  `;

  if (!selesai) {
    html += `
      <button class="btn btn-primary" onclick="tandaiMateriSelesai('${m.id}'); navigate('material-detail','${m.id}');">
        ✓ Tandai Sudah Dipelajari
      </button>
    `;
  } else {
    html += `<button class="btn btn-secondary" disabled>✓ Sudah Dipelajari</button>`;
  }

  html += `
        <button class="btn btn-outline" onclick="navigate('calculator')">🧮 Buka Kalkulator</button>
        <button class="btn btn-outline" onclick="navigate('exercise', '${m.id}')">📝 Kerjakan Latihan</button>
      </div>
    </div>
  `;

  app.innerHTML = html;

  // Render formula tabs khusus anuitas
  if (m.id === 'anuitas' && typeof renderFormulaTabs === 'function') {
    const container = document.createElement('div');
    container.id = 'formulaTabContainer';
    html = app.innerHTML;
    // Sisipkan di akhir
    const detail = app.querySelector('.material-detail');
    if (detail) {
      detail.insertAdjacentElement('beforeend', container);
      renderFormulaTabs(container);
    }
  }
}