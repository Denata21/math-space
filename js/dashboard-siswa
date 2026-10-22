/* ============================================================
   DASHBOARD SISWA
   ============================================================ */

let siswaTab = 'ringkasan';

function renderDashboardSiswa() {
  if (typeof isSiswaLoggedIn !== 'function' || !isSiswaLoggedIn()) {
    navigate('home');
    return;
  }

  const app = document.getElementById('app');
  if (!app) return;

  const user = getCurrentUser();

  app.innerHTML = `
    <div class="hero" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <div style="display:flex;align-items:center;gap:14px;">
        <span class="user-avatar user-avatar-lg user-avatar-siswa">${renderAvatar(user.nama)}</span>
        <div>
          <h2 class="hero-title" style="margin-bottom:2px;">Halo, ${escapeHtml(user.nama)}! 👋</h2>
          <p style="margin:0;color:var(--text-muted);font-size:13px;">
            @${escapeHtml(user.username)} • ${escapeHtml(user.kelas || '-')}
          </p>
        </div>
      </div>
    </div>

    <div class="dashboard-tabs">
      <button class="tab-btn ${siswaTab === 'ringkasan' ? 'active' : ''}" onclick="switchSiswaTab('ringkasan')">📊 Ringkasan</button>
      <button class="tab-btn ${siswaTab === 'aktivitas' ? 'active' : ''}" onclick="switchSiswaTab('aktivitas')">📋 Riwayat Aktivitas</button>
      <button class="tab-btn ${siswaTab === 'latihan' ? 'active' : ''}" onclick="switchSiswaTab('latihan')">📝 Latihan</button>
    </div>

    <div id="siswaContent"></div>
  `;

  renderSiswaTabContent();
}

function switchSiswaTab(tab) {
  siswaTab = tab;
  renderDashboardSiswa();
}

function renderSiswaTabContent() {
  const content = document.getElementById('siswaContent');
  if (!content) return;

  if (siswaTab === 'ringkasan') renderSiswaRingkasan(content);
  else if (siswaTab === 'aktivitas') renderSiswaAktivitas(content);
  else renderSiswaLatihan(content);
}

/* ============================================================
   TAB 1: RINGKASAN
   ============================================================ */

function renderSiswaRingkasan(container) {
  const progress = getProgress();
  const materials = getMaterials();

  const materiSelesai = Object.keys(progress.materi || {}).length;
  const latihanArr = Object.values(progress.latihan || {});
  const rata = latihanArr.length
    ? Math.round(latihanArr.reduce((sum, l) => sum + (l.skor || 0), 0) / latihanArr.length)
    : 0;

  const explorerCount = Object.keys(progress.explorer || {}).length;
  const detectiveCount = Object.keys(progress.detective || {}).length;
  const challengeCount = Object.keys(progress.challenge || {}).length;

  let html = `
    <div class="calc-panel">
      <h3 style="font-size:15px;margin-bottom:16px;">📊 Ringkasan Belajar</h3>
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
          <div class="value">${rata}/100</div>
        </div>
        <div class="result-card">
          <div class="label">Explorer</div>
          <div class="value">${explorerCount}</div>
        </div>
        <div class="result-card">
          <div class="label">Detective</div>
          <div class="value">${detectiveCount}</div>
        </div>
        <div class="result-card">
          <div class="label">Tantangan</div>
          <div class="value">${challengeCount}</div>
        </div>
      </div>
    </div>

    <div class="calc-panel">
      <h3 style="font-size:15px;margin-bottom:16px;">📚 Progress per Materi</h3>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th class="left">Materi</th><th>Status Baca</th>
            <th>Skor Latihan</th><th>Terbaik</th><th>Aksi</th>
          </tr></thead>
          <tbody>
  `;

  materials.forEach(m => {
    const selesai = progress.materi?.[m.id]?.selesai;
    const latihan = progress.latihan?.[m.id];
    html += `<tr>
      <td class="left"><strong>${escapeHtml(m.judul)}</strong></td>
      <td>${selesai ? '✅' : '—'}</td>
      <td>${latihan ? latihan.skor + '/100' : '—'}</td>
      <td>${latihan ? (latihan.terbaik || 0) + '/100' : '—'}</td>
      <td><button class="btn btn-primary btn-sm" onclick="navigate('material-detail','${m.id}')">Buka</button></td>
    </tr>`;
  });

  html += `</tbody></table></div></div>

    <div style="margin-top:20px;display:flex;gap:10px;flex-wrap:wrap;">
      <button class="btn btn-primary" onclick="navigate('materials')">📚 Belajar Materi</button>
      <button class="btn btn-outline" onclick="navigate('exercise')">📝 Latihan Soal</button>
      <button class="btn btn-secondary" onclick="navigate('calculator')">🧮 Kalkulator</button>
      <button class="btn btn-danger" onclick="resetProgress()">🗑️ Reset Progress</button>
    </div>
  `;

  container.innerHTML = html;
}

/* ============================================================
   TAB 2: RIWAYAT AKTIVITAS
   ============================================================ */

function renderSiswaAktivitas(container) {
  const progress = getProgress();

  const explorer = progress.explorer || {};
  const detective = progress.detective || {};
  const challenge = progress.challenge || {};

  const totalExplorer = Object.keys(explorer).length;
  const totalDetective = Object.keys(detective).length;
  const totalChallenge = Object.keys(challenge).length;

  let html = `
    <div class="calc-panel">
      <h3 style="font-size:15px;margin-bottom:16px;">📋 Riwayat Aktivitas</h3>
      <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">
        Aktivitas berikut sudah kamu simpan. Guru dapat meninjau pengamatan, alasan, dan refleksimu.
      </p>
  `;

  if (totalExplorer === 0 && totalDetective === 0 && totalChallenge === 0) {
    html += `
      <div class="alert alert-info">
        Belum ada aktivitas. Mulai dari
        <a href="#" onclick="navigate('explorer'); return false;">Explorer</a>,
        <a href="#" onclick="navigate('detective'); return false;">Detective</a>, atau
        <a href="#" onclick="navigate('challenge'); return false;">Tantangan</a>.
      </div>
    `;
  }

  if (totalExplorer > 0) {
    html += `<h4 style="font-size:14px;margin:20px 0 10px;color:var(--teal-dark);">🔍 Math Explorer (${totalExplorer})</h4>`;
    html += `<div class="table-wrap"><table><thead><tr>
      <th class="left">Explorer</th><th class="left">Pengamatan</th><th>Waktu</th>
    </tr></thead><tbody>`;
    Object.entries(explorer).forEach(([id, val]) => {
      const e = getExplorerById(id);
      html += `<tr>
        <td class="left">${e ? escapeHtml(e.judul) : id}</td>
        <td class="left" style="max-width:400px;white-space:normal;font-size:12px;">${escapeHtml(val.pengamatan || '—')}</td>
        <td style="font-size:12px;">${formatTanggal(val.waktu)}</td>
      </tr>`;
    });
    html += `</tbody></table></div>`;
  }

  if (totalDetective > 0) {
    html += `<h4 style="font-size:14px;margin:24px 0 10px;color:var(--teal-dark);">🕵️ Math Detective (${totalDetective})</h4>`;
    html += `<div class="table-wrap"><table><thead><tr>
      <th class="left">Kasus</th><th class="left">Jawaban</th><th class="left">Alasan</th><th>Waktu</th>
    </tr></thead><tbody>`;
    Object.entries(detective).forEach(([id, val]) => {
      const d = getDetectiveById(id);
      html += `<tr>
        <td class="left">${d ? escapeHtml(d.judul) : id}</td>
        <td class="left">${escapeHtml(String(val.jawaban || '-'))}</td>
        <td class="left" style="max-width:300px;white-space:normal;font-size:12px;">${escapeHtml(val.alasan || '—')}</td>
        <td style="font-size:12px;">${formatTanggal(val.waktu)}</td>
      </tr>`;
    });
    html += `</tbody></table></div>`;
  }

  if (totalChallenge > 0) {
    html += `<h4 style="font-size:14px;margin:24px 0 10px;color:var(--teal-dark);">🎯 Tantangan Kontekstual (${totalChallenge})</h4>`;
    html += `<div class="table-wrap"><table><thead><tr>
      <th class="left">Tantangan</th><th class="left">Jawaban</th><th class="left">Refleksi</th><th>Waktu</th>
    </tr></thead><tbody>`;
    Object.entries(challenge).forEach(([id, val]) => {
      const c = getChallengeById(id);
      html += `<tr>
        <td class="left">${c ? escapeHtml(c.judul) : id}</td>
        <td class="left">${escapeHtml(String(val.jawaban || '-'))}</td>
        <td class="left" style="max-width:300px;white-space:normal;font-size:12px;">${escapeHtml(val.refleksi || '—')}</td>
        <td style="font-size:12px;">${formatTanggal(val.waktu)}</td>
      </tr>`;
    });
    html += `</tbody></table></div>`;
  }

  html += `</div>`;
  container.innerHTML = html;
}

/* ============================================================
   TAB 3: LATIHAN
   ============================================================ */

function renderSiswaLatihan(container) {
  const progress = getProgress();
  const materials = getMaterials();
  const latihan = progress.latihan || {};

  let html = `
    <div class="calc-panel">
      <h3 style="font-size:15px;margin-bottom:16px;">📝 Skor Latihan</h3>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th class="left">Materi</th><th>Skor Terakhir</th><th>Terbaik</th>
            <th>Benar/Total</th><th>Waktu</th><th>Aksi</th>
          </tr></thead>
          <tbody>
  `;

  materials.forEach(m => {
    const l = latihan[m.id];
    if (l) {
      html += `<tr>
        <td class="left"><strong>${escapeHtml(m.judul)}</strong></td>
        <td>${l.skor}/100</td>
        <td>${l.terbaik || 0}/100</td>
        <td>${l.benar || 0}/${l.total || 0}</td>
        <td style="font-size:12px;">${formatTanggal(l.waktu)}</td>
        <td><button class="btn btn-primary btn-sm" onclick="navigate('exercise','${m.id}')">Ulangi</button></td>
      </tr>`;
    } else {
      html += `<tr>
        <td class="left"><strong>${escapeHtml(m.judul)}</strong></td>
        <td colspan="4" style="color:var(--text-muted);">Belum dikerjakan</td>
        <td><button class="btn btn-outline btn-sm" onclick="navigate('exercise','${m.id}')">Mulai</button></td>
      </tr>`;
    }
  });

  html += `</tbody></table></div></div>`;
  container.innerHTML = html;
}

/* ============================================================
   HALAMAN PROGRESS (dipanggil resetProgress)
   ============================================================ */

function renderProgressPage() {
  navigate('dashboard-siswa');
}