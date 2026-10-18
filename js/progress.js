/* ============================================================
   PROGRESS TRACKING SISWA
   ============================================================ */

const PROGRESS_KEY = 'rm_progress';

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

function saveProgress(p) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

function isMateriSelesai(materialId) {
  const p = getProgress();
  return !!(p.materi && p.materi[materialId] && p.materi[materialId].selesai);
}

function simpanSkorLatihan(materiId, skor, benar, total) {
  const p = getProgress();
  if (!p.latihan) p.latihan = {};
  const prev = p.latihan[materiId];
  p.latihan[materiId] = {
    skor: skor,
    benar: benar,
    total: total,
    terbaik: prev ? Math.max(prev.terbaik || 0, skor) : skor,
    waktu: new Date().toISOString()
  };
  saveProgress(p);

  syncLatihanKeSupabase(materiId, skor, benar, total);
}

async function syncLatihanKeSupabase(materiId, skor, benar, total) {
  try {
    const user = getCurrentUser();
    if (!user || user.role !== 'siswa' || !user.userId) return;
    if (typeof supabaseClient === 'undefined') return;

    await supabaseClient.from('latihan').insert({
      user_id: user.userId,
      materi_id: materiId,
      skor: skor,
      benar: benar,
      total: total
    });
  } catch (e) {
    console.warn('[Progress] Gagal sync latihan:', e);
  }
}

function tandaiMateriSelesai(materialId) {
  const p = getProgress();
  if (!p.materi) p.materi = {};
  p.materi[materialId] = {
    selesai: true,
    waktu: new Date().toISOString()
  };
  saveProgress(p);

  syncProgressKeSupabase(materialId);
}

async function syncProgressKeSupabase(materialId) {
  try {
    const user = getCurrentUser();
    if (!user || user.role !== 'siswa' || !user.userId) return;
    if (typeof supabaseClient === 'undefined') return;

    await supabaseClient.from('progress').upsert({
      user_id: user.userId,
      materi_id: materialId,
      selesai: true
    }, { onConflict: 'user_id,materi_id' });
  } catch (e) {
    console.warn('[Progress] Gagal sync progress:', e);
  }
}

function getSkorLatihan(materiId) {
  const p = getProgress();
  return (p.latihan && p.latihan[materiId]) || null;
}

function hitungProgressKeseluruhan() {
  const materials = getMaterials();
  const p = getProgress();
  const totalMateri = materials.length;

  let materiSelesai = 0;
  materials.forEach(m => {
    if (p.materi && p.materi[m.id] && p.materi[m.id].selesai) materiSelesai++;
  });

  let totalLatihan = 0;
  let latihanSelesai = 0;
  materials.forEach(m => {
    totalLatihan++;
    if (p.latihan && p.latihan[m.id]) latihanSelesai++;
  });

  return {
    materiSelesai, totalMateri,
    persenMateri: totalMateri ? Math.round((materiSelesai / totalMateri) * 100) : 0,
    latihanSelesai, totalLatihan,
    persenLatihan: totalLatihan ? Math.round((latihanSelesai / totalLatihan) * 100) : 0
  };
}

function renderProgressPage() {
  const app = document.getElementById('app');
  const materials = getMaterials();
  const p = getProgress();
  const ringkasan = hitungProgressKeseluruhan();

  let html = `
    <div class="hero" style="padding:32px 28px;">
      <h2>Progress Belajar</h2>
      <p>Pantau materi yang sudah kamu pelajari dan skor latihanmu.</p>
    </div>

    <div class="calc-panel">
      <div class="result-grid">
        <div class="result-card">
          <div class="label">Materi Selesai</div>
          <div class="value">${ringkasan.materiSelesai}/${ringkasan.totalMateri}
            <span style="font-size:13px;color:var(--gray-text);">(${ringkasan.persenMateri}%)</span>
          </div>
        </div>
        <div class="result-card">
          <div class="label">Latihan Dikerjakan</div>
          <div class="value">${ringkasan.latihanSelesai}/${ringkasan.totalLatihan}
            <span style="font-size:13px;color:var(--gray-text);">(${ringkasan.persenLatihan}%)</span>
          </div>
        </div>
      </div>
    </div>

    <h3 class="section-title">Rincian per Materi</h3>
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
    const selesai = p.materi && p.materi[m.id] && p.materi[m.id].selesai;
    const latihan = p.latihan && p.latihan[m.id];

    html += `<tr>
      <td style="text-align:left;"><strong>${escapeHtml(m.judul)}</strong></td>
      <td>${selesai ? '✅ Selesai' : '—'}</td>
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

    <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-danger btn-sm" onclick="resetProgress()">Reset Progress</button>
    </div>
  `;

  app.innerHTML = html;
}

function resetProgress() {
  if (!confirm('Yakin ingin menghapus semua progress belajar?')) return;
  localStorage.removeItem(PROGRESS_KEY);
  renderProgressPage();
}