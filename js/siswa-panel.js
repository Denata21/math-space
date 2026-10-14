/* ============================================================
   PANEL SISWA — Profil & progress siswa yang login
   ============================================================ */

function renderSiswaPanel() {
  const user = getCurrentUser();
  if (!user || user.role !== 'siswa') {
    navigate('home');
    return;
  }

  const app = document.getElementById('app');
  const progress = getProgress();
  const materials = getMaterials();

  // Hitung ringkasan
  const materiSelesai = Object.keys(progress.materi || {}).length;
  const latihanArr = Object.values(progress.latihan || {});
  const rataSkor = latihanArr.length
    ? Math.round(latihanArr.reduce((sum, l) => sum + (l.skor || 0), 0) / latihanArr.length)
    : 0;

  let html = `
    <div class="hero" style="padding:32px 28px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;">
      <span class="user-avatar user-avatar-siswa" style="width:72px;height:72px;font-size:26px;">
        ${renderAvatar(user.nama)}
      </span>
      <div style="flex:1;min-width:200px;">
        <h2 style="margin-bottom:4px;">Halo, ${escapeHtml(user.nama)}! 👋</h2>
        <p style="color:var(--gray-text);font-size:14px;margin:0;">
          @${escapeHtml(user.username)} • Kelas ${escapeHtml(user.kelas || '-')}
        </p>
      </div>
    </div>

    <h3 class="section-title">📊 Ringkasan Belajar</h3>
    <div class="result-grid">
      <div class="result-card">
        <div class="label">Materi Dipelajari</div>
        <div class="value">${materiSelesai}/${materials.length}</div>
      </div>
      <div class="result-card">
        <div class="label">Latihan Dikerjakan</div>
        <div class="value">${latihanArr.length}</div>
      </div>
      <div class="result-card">
        <div class="label">Rata-rata Skor</div>
        <div class="value">${rataSkor}/100</div>
      </div>
    </div>

    <h3 class="section-title">📚 Progress per Materi</h3>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="text-align:left;">Materi</th>
            <th>Status Baca</th>
            <th>Skor Latihan</th>
            <th>Skor Terbaik</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
  `;

  materials.forEach(m => {
    const selesai = progress.materi && progress.materi[m.id] && progress.materi[m.id].selesai;
    const latihan = progress.latihan && progress.latihan[m.id];

    html += `<tr>
      <td style="text-align:left;"><strong>${escapeHtml(m.judul)}</strong></td>
      <td>${selesai ? '✅' : '—'}</td>
      <td>${latihan ? latihan.skor + '/100' : '—'}</td>
      <td>${latihan ? (latihan.terbaik || 0) + '/100' : '—'}</td>
      <td style="text-align:center;">
        <button class="btn btn-primary btn-sm" onclick="navigate('material-detail','${m.id}')">Buka</button>
      </td>
    </tr>`;
  });

  html += `
        </tbody>
      </table>
    </div>

    <div style="margin-top:24px;display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-primary" onclick="navigate('materials')">📚 Belajar Materi</button>
      <button class="btn btn-outline" onclick="navigate('exercise')">📝 Latihan Soal</button>
      <button class="btn btn-secondary" onclick="navigate('calculator')">🧮 Kalkulator</button>
    </div>
  `;

  app.innerHTML = html;
}