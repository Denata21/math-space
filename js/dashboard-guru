/* ============================================================
   DASHBOARD GURU
   ============================================================ */

let guruTab = 'ringkasan';
let guruSelectedSiswa = null;
let editingMaterialId = null;
let editingQuestionId = null;

/* ============================================================
   RENDER UTAMA
   ============================================================ */

function renderDashboardGuru() {
  if (typeof isGuruLoggedIn !== 'function' || !isGuruLoggedIn()) {
    navigate('home');
    return;
  }

  const app = document.getElementById('app');
  if (!app) return;

  const user = getCurrentUser();

  app.innerHTML = `
    <div class="hero" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <div style="display:flex;align-items:center;gap:14px;">
        <span class="user-avatar user-avatar-lg user-avatar-guru">${renderAvatar(user.nama)}</span>
        <div>
          <h2 class="hero-title" style="margin-bottom:2px;">Dashboard Guru</h2>
          <p style="margin:0;color:var(--text-muted);font-size:13px;">
            <strong>${escapeHtml(user.nama)}</strong> • @${escapeHtml(user.username)}
          </p>
        </div>
      </div>
      <button class="btn btn-danger btn-sm" onclick="logoutUser()">Logout</button>
    </div>

    <div class="dashboard-tabs">
      <button class="tab-btn ${guruTab === 'ringkasan' ? 'active' : ''}" onclick="switchGuruTab('ringkasan')">📊 Ringkasan</button>
      <button class="tab-btn ${guruTab === 'siswa' ? 'active' : ''}" onclick="switchGuruTab('siswa')">🎓 Data Siswa</button>
      <button class="tab-btn ${guruTab === 'aktivitas' ? 'active' : ''}" onclick="switchGuruTab('aktivitas')">🔍 Aktivitas Siswa</button>
      <button class="tab-btn ${guruTab === 'kelola' ? 'active' : ''}" onclick="switchGuruTab('kelola')">⚙️ Kelola Materi & Soal</button>
    </div>

    <div id="guruContent"></div>
  `;

  renderGuruTabContent();
}

function switchGuruTab(tab) {
  guruTab = tab;
  guruSelectedSiswa = null;
  renderDashboardGuru();
}

function renderGuruTabContent() {
  const content = document.getElementById('guruContent');
  if (!content) return;

  if (guruTab === 'ringkasan') renderGuruRingkasan(content);
  else if (guruTab === 'siswa') renderGuruSiswa(content);
  else if (guruTab === 'aktivitas') renderGuruAktivitas(content);
  else renderGuruKelola(content);
}

/* ============================================================
   TAB 1: RINGKASAN
   ============================================================ */

async function renderGuruRingkasan(container) {
  container.innerHTML = '<div class="calc-panel"><p class="text-muted">Memuat data...</p></div>';

  try {
    const data = await getSiswaDataFromSupabase();
    const aktivitas = await getAktivitasSiswaFromSupabase();

    const totalSiswa = Object.keys(data).length;
    let totalLatihan = 0;
    let totalSkor = 0;
    let jumlahSkor = 0;

    Object.values(data).forEach(s => {
      const latihanArr = Object.values(s.progress?.latihan || {});
      totalLatihan += latihanArr.length;
      latihanArr.forEach(l => {
        totalSkor += l.skor || 0;
        jumlahSkor++;
      });
    });

    const rataSkor = jumlahSkor > 0 ? Math.round(totalSkor / jumlahSkor) : 0;
    const totalAktivitas = aktivitas.length;

    container.innerHTML = `
      <div class="calc-panel">
        <h3 style="font-size:15px;margin-bottom:16px;">📊 Ringkasan Kelas</h3>
        <div class="result-grid">
          <div class="result-card">
            <div class="label">Total Siswa</div>
            <div class="value">${totalSiswa}</div>
          </div>
          <div class="result-card">
            <div class="label">Total Latihan Dikerjakan</div>
            <div class="value">${totalLatihan}</div>
          </div>
          <div class="result-card">
            <div class="label">Rata-rata Skor</div>
            <div class="value">${rataSkor}/100</div>
          </div>
          <div class="result-card">
            <div class="label">Aktivitas (Explorer/Detective/Challenge)</div>
            <div class="value">${totalAktivitas}</div>
          </div>
        </div>
        <div style="margin-top:16px;display:flex;gap:10px;flex-wrap:wrap;">
          <button class="btn btn-primary btn-sm" onclick="exportHasilCSV()">⬇️ Export CSV</button>
          <button class="btn btn-secondary btn-sm" onclick="renderGuruRingkasan(document.getElementById('guruContent'))">🔄 Refresh</button>
        </div>
      </div>
    `;
  } catch (e) {
    container.innerHTML = `<div class="alert alert-danger">Gagal memuat: ${escapeHtml(e.message)}</div>`;
  }
}

/* ============================================================
   TAB 2: DATA SISWA
   ============================================================ */

async function renderGuruSiswa(container) {
  container.innerHTML = '<div class="calc-panel"><p class="text-muted">Memuat data siswa...</p></div>';

  try {
    const data = await getSiswaDataFromSupabase();
    const keys = Object.keys(data);

    if (guruSelectedSiswa && data[guruSelectedSiswa]) {
      renderGuruSiswaDetail(container, data[guruSelectedSiswa]);
      return;
    }

    if (keys.length === 0) {
      container.innerHTML = '<div class="calc-panel"><p class="text-muted">Belum ada siswa terdaftar.</p></div>';
      return;
    }

    let rowsHtml = '';
    keys.forEach(uname => {
      const s = data[uname];
      const latihanArr = Object.values(s.progress?.latihan || {});
      const materiSelesai = Object.keys(s.progress?.materi || {}).length;
      const rata = latihanArr.length
        ? Math.round(latihanArr.reduce((sum, l) => sum + (l.skor || 0), 0) / latihanArr.length)
        : 0;

      rowsHtml += `
        <tr>
          <td class="left">@${escapeHtml(uname)}</td>
          <td class="left"><strong>${escapeHtml(s.nama || '-')}</strong></td>
          <td>${escapeHtml(s.kelas || '-')}</td>
          <td>${materiSelesai}</td>
          <td>${latihanArr.length}</td>
          <td>${rata}/100</td>
          <td>
            <button class="btn btn-primary btn-sm" onclick="lihatDetailSiswa('${escapeHtml(uname)}')">Detail</button>
          </td>
        </tr>
      `;
    });

    container.innerHTML = `
      <div class="calc-panel">
        <h3 style="font-size:15px;margin-bottom:16px;">🎓 Data Siswa (${keys.length})</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th class="left">Username</th>
                <th class="left">Nama</th>
                <th>Kelas</th>
                <th>Materi</th>
                <th>Latihan</th>
                <th>Rata-rata</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>
      </div>
    `;
  } catch (e) {
    container.innerHTML = `<div class="alert alert-danger">Gagal memuat: ${escapeHtml(e.message)}</div>`;
  }
}

function lihatDetailSiswa(uname) {
  guruSelectedSiswa = uname;
  renderGuruTabContent();
}

function renderGuruSiswaDetail(container, s) {
  const materials = getMaterials();
  const latihanArr = Object.values(s.progress?.latihan || {});
  const rata = latihanArr.length
    ? Math.round(latihanArr.reduce((sum, l) => sum + (l.skor || 0), 0) / latihanArr.length)
    : 0;

  let materiRows = '';
  materials.forEach(m => {
    const selesai = s.progress?.materi?.[m.id]?.selesai;
    const latihan = s.progress?.latihan?.[m.id];
    materiRows += `
      <tr>
        <td class="left"><strong>${escapeHtml(m.judul)}</strong></td>
        <td>${selesai ? '✅' : '—'}</td>
        <td>${latihan ? latihan.skor + '/100' : '—'}</td>
        <td>${latihan ? (latihan.terbaik || 0) + '/100' : '—'}</td>
      </tr>
    `;
  });

  container.innerHTML = `
    <div class="calc-panel">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
        <div>
          <h3 style="font-size:16px;margin-bottom:4px;">${escapeHtml(s.nama)}</h3>
          <p style="color:var(--text-muted);font-size:13px;margin:0;">
            @${escapeHtml(s.username)} • ${escapeHtml(s.kelas || '-')} • Rata-rata ${rata}/100
          </p>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="guruSelectedSiswa=null; renderGuruTabContent();">← Kembali</button>
      </div>

      <h4 style="font-size:14px;margin:16px 0 10px;">Progress per Materi</h4>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th class="left">Materi</th>
              <th>Status Baca</th>
              <th>Skor Latihan</th>
              <th>Terbaik</th>
            </tr>
          </thead>
          <tbody>${materiRows}</tbody>
        </table>
      </div>
    </div>
  `;
}

/* ============================================================
   TAB 3: AKTIVITAS SISWA
   Review alasan/refleksi dari Explorer, Detective, Challenge
   ============================================================ */

async function renderGuruAktivitas(container) {
  container.innerHTML = '<div class="calc-panel"><p class="text-muted">Memuat aktivitas siswa...</p></div>';

  try {
    const aktivitas = await getAktivitasSiswaFromSupabase();
    const dataSiswa = await getSiswaDataFromSupabase();

    if (aktivitas.length === 0) {
      container.innerHTML = '<div class="calc-panel"><p class="text-muted">Belum ada aktivitas siswa.</p></div>';
      return;
    }

    // Kelompokkan per tipe
    const perTipe = { explorer: [], detective: [], challenge: [] };
    aktivitas.forEach(a => {
      if (perTipe[a.tipe]) perTipe[a.tipe].push(a);
    });

    let html = `
      <div class="calc-panel">
        <h3 style="font-size:15px;margin-bottom:16px;">🔍 Aktivitas Siswa (Total: ${aktivitas.length})</h3>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">
          Tinjau alasan, pengamatan, dan refleksi siswa untuk menilai pemahaman konseptual, bukan hanya jawaban numerik.
        </p>
    `;

    if (perTipe.detective.length > 0) {
      html += `<h4 style="font-size:14px;margin:20px 0 10px;color:var(--teal-dark);">🕵️ Math Detective (${perTipe.detective.length})</h4>`;
      html += `<div class="table-wrap"><table><thead><tr>
        <th class="left">Siswa</th><th class="left">Kasus</th>
        <th class="left">Jawaban</th><th class="left">Alasan</th><th>Waktu</th>
      </tr></thead><tbody>`;
      perTipe.detective.forEach(a => {
        const siswa = dataSiswa[a.user_id] || {};
        const d = getDetectiveById(a.aktivitas_id);
        html += `<tr>
          <td class="left">${escapeHtml(siswa.nama || a.user_id)}</td>
          <td class="left">${d ? escapeHtml(d.judul) : a.aktivitas_id}</td>
          <td class="left">${escapeHtml(String(a.jawaban_numerik || '-'))}</td>
          <td class="left" style="max-width:300px;white-space:normal;font-size:12px;">${escapeHtml(a.alasan || '-')}</td>
          <td style="font-size:12px;">${formatTanggal(a.waktu)}</td>
        </tr>`;
      });
      html += `</tbody></table></div>`;
    }

    if (perTipe.challenge.length > 0) {
      html += `<h4 style="font-size:14px;margin:24px 0 10px;color:var(--teal-dark);">🎯 Contextual Challenge (${perTipe.challenge.length})</h4>`;
      html += `<div class="table-wrap"><table><thead><tr>
        <th class="left">Siswa</th><th class="left">Tantangan</th>
        <th class="left">Jawaban</th><th class="left">Alasan</th><th>Waktu</th>
      </tr></thead><tbody>`;
      perTipe.challenge.forEach(a => {
        const siswa = dataSiswa[a.user_id] || {};
        const c = getChallengeById(a.aktivitas_id);
        html += `<tr>
          <td class="left">${escapeHtml(siswa.nama || a.user_id)}</td>
          <td class="left">${c ? escapeHtml(c.judul) : a.aktivitas_id}</td>
          <td class="left">${escapeHtml(String(a.jawaban_numerik || '-'))}</td>
          <td class="left" style="max-width:300px;white-space:normal;font-size:12px;">${escapeHtml(a.alasan || '-')}</td>
          <td style="font-size:12px;">${formatTanggal(a.waktu)}</td>
        </tr>`;
      });
      html += `</tbody></table></div>`;
    }

    if (perTipe.explorer.length > 0) {
      html += `<h4 style="font-size:14px;margin:24px 0 10px;color:var(--teal-dark);">🔍 Math Explorer (${perTipe.explorer.length})</h4>`;
      html += `<div class="table-wrap"><table><thead><tr>
        <th class="left">Siswa</th><th class="left">Explorer</th>
        <th class="left">Pengamatan</th><th>Waktu</th>
      </tr></thead><tbody>`;
      perTipe.explorer.forEach(a => {
        const siswa = dataSiswa[a.user_id] || {};
        const e = getExplorerById(a.aktivitas_id);
        html += `<tr>
          <td class="left">${escapeHtml(siswa.nama || a.user_id)}</td>
          <td class="left">${e ? escapeHtml(e.judul) : a.aktivitas_id}</td>
          <td class="left" style="max-width:400px;white-space:normal;font-size:12px;">${escapeHtml(a.alasan || '-')}</td>
          <td style="font-size:12px;">${formatTanggal(a.waktu)}</td>
        </tr>`;
      });
      html += `</tbody></table></div>`;
    }

    html += `
        <div style="margin-top:20px;">
          <button class="btn btn-secondary btn-sm" onclick="renderGuruAktivitas(document.getElementById('guruContent'))">🔄 Refresh</button>
        </div>
      </div>
    `;

    container.innerHTML = html;
  } catch (e) {
    container.innerHTML = `<div class="alert alert-danger">Gagal memuat: ${escapeHtml(e.message)}</div>`;
  }
}

/* ============================================================
   TAB 4: KELOLA MATERI & SOAL
   ============================================================ */

function renderGuruKelola(container) {
  let html = `
    <div class="calc-panel">
      <h3 style="font-size:15px;margin-bottom:16px;">⚙️ Kelola Materi & Soal</h3>

      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px;">
        <button class="btn btn-primary btn-sm" onclick="showMaterialForm()">+ Tambah Materi</button>
        <button class="btn btn-primary btn-sm" onclick="showQuestionForm()">+ Tambah Soal</button>
      </div>

      <div id="materialFormArea"></div>
      <div id="questionFormArea"></div>

      <h4 style="font-size:14px;margin:16px 0 10px;">📚 Daftar Materi</h4>
      <div class="table-wrap">
        <table>
          <thead><tr><th class="left">Judul</th><th class="left">Kategori</th><th>Aksi</th></tr></thead>
          <tbody>${renderTabelMateri()}</tbody>
        </table>
      </div>

      <h4 style="font-size:14px;margin:24px 0 10px;">📝 Daftar Soal</h4>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th class="left">Materi</th><th>Tingkat</th><th>Tipe</th>
            <th class="left">Pertanyaan</th><th>Aksi</th>
          </tr></thead>
          <tbody>${renderTabelSoal()}</tbody>
        </table>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

function renderTabelMateri() {
  const materials = getMaterials();
  let html = '';
  materials.forEach(m => {
    html += `<tr>
      <td class="left">${escapeHtml(m.judul)}</td>
      <td class="left">${escapeHtml(m.kategori)}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="showMaterialForm('${m.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="hapusMateri('${m.id}')">Hapus</button>
      </td>
    </tr>`;
  });
  return html;
}

function renderTabelSoal() {
  const questions = getQuestions();
  let html = '';
  questions.forEach(q => {
    const short = q.pertanyaan.length > 50 ? q.pertanyaan.substring(0, 50) + '...' : q.pertanyaan;
    html += `<tr>
      <td class="left">${escapeHtml(getMaterialName(q.materi))}</td>
      <td>${escapeHtml(q.tingkat)}</td>
      <td>${q.tipe === 'pg' ? 'PG' : 'Angka'}</td>
      <td class="left">${escapeHtml(short)}</td>
      <td>
        <button class="btn btn-secondary btn-sm" onclick="showQuestionForm('${q.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="hapusSoal('${q.id}')">Hapus</button>
      </td>
    </tr>`;
  });
  return html;
}

/* ===== Form Materi ===== */

function showMaterialForm(id) {
  editingMaterialId = id || null;
  const materials = getMaterials();
  const m = id ? materials.find(x => x.id === id) : null;

  document.getElementById('materialFormArea').innerHTML = `
    <div class="calc-panel" style="background:var(--navy-light);">
      <h4 style="font-size:14px;margin-bottom:14px;">${m ? 'Edit Materi' : 'Tambah Materi'}</h4>
      <div class="form-group">
        <label>Judul</label>
        <input class="form-control" id="mfJudul" value="${m ? escapeHtml(m.judul) : ''}">
      </div>
      <div class="form-group">
        <label>Kategori</label>
        <input class="form-control" id="mfKategori" value="${m ? escapeHtml(m.kategori) : ''}">
      </div>
      <div class="form-group">
        <label>Deskripsi</label>
        <textarea class="form-control" id="mfDeskripsi">${m ? escapeHtml(m.deskripsi) : ''}</textarea>
      </div>
      <div class="form-group">
        <label>Tujuan (satu per baris)</label>
        <textarea class="form-control" id="mfTujuan" style="min-height:80px;">${m ? m.tujuan.join('\n') : ''}</textarea>
      </div>
      <div class="form-group">
        <label>Isi Materi</label>
        <textarea class="form-control" id="mfIsi" style="min-height:120px;">${m ? escapeHtml(m.isi) : ''}</textarea>
      </div>
      <div class="form-group">
        <label>Rumus (satu per baris)</label>
        <textarea class="form-control" id="mfRumus" style="min-height:70px;">${m ? m.rumus.join('\n') : ''}</textarea>
      </div>
      <div class="form-group">
        <label>Contoh Soal</label>
        <textarea class="form-control" id="mfContoh" style="min-height:80px;">${m ? escapeHtml(m.contoh) : ''}</textarea>
      </div>
      <div class="form-group">
        <label>Pembahasan</label>
        <textarea class="form-control" id="mfPembahasan" style="min-height:80px;">${m ? escapeHtml(m.pembahasan) : ''}</textarea>
      </div>
      <div style="display:flex;gap:10px;">
        <button class="btn btn-primary" onclick="simpanMateri()">Simpan</button>
        <button class="btn btn-secondary" onclick="hideMaterialForm()">Batal</button>
      </div>
    </div>
  `;
}

function hideMaterialForm() {
  const el = document.getElementById('materialFormArea');
  if (el) el.innerHTML = '';
  editingMaterialId = null;
}

function simpanMateri() {
  const judul = document.getElementById('mfJudul').value.trim();
  const kategori = document.getElementById('mfKategori').value.trim();
  const deskripsi = document.getElementById('mfDeskripsi').value.trim();
  const tujuan = document.getElementById('mfTujuan').value.split('\n').filter(s => s.trim());
  const isi = document.getElementById('mfIsi').value.trim();
  const rumus = document.getElementById('mfRumus').value.split('\n').filter(s => s.trim());
  const contoh = document.getElementById('mfContoh').value.trim();
  const pembahasan = document.getElementById('mfPembahasan').value.trim();

  if (!judul || !kategori) { alert('Judul dan kategori wajib diisi.'); return; }

  let materials = getMaterials();

  if (editingMaterialId) {
    const idx = materials.findIndex(x => x.id === editingMaterialId);
    if (idx >= 0) {
      materials[idx] = { ...materials[idx], judul, kategori, deskripsi, tujuan, isi, rumus, contoh, pembahasan };
    }
  } else {
    const id = judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();
    materials.push({ id, judul, kategori, deskripsi, tujuan, isi, rumus, contoh, pembahasan });
  }

  saveMaterials(materials);
  hideMaterialForm();
  renderGuruKelola(document.getElementById('guruContent'));
}

function hapusMateri(id) {
  if (!confirm('Yakin ingin menghapus materi ini?')) return;
  const materials = getMaterials().filter(m => m.id !== id);
  saveMaterials(materials);
  renderGuruKelola(document.getElementById('guruContent'));
}

/* ===== Form Soal ===== */

function showQuestionForm(id) {
  editingQuestionId = id || null;
  const questions = getQuestions();
  const q = id ? questions.find(x => x.id === id) : null;
  const materials = getMaterials();

  let materiOpts = materials.map(m =>
    `<option value="${m.id}" ${q && q.materi === m.id ? 'selected' : ''}>${escapeHtml(m.judul)}</option>`
  ).join('');

  document.getElementById('questionFormArea').innerHTML = `
    <div class="calc-panel" style="background:var(--navy-light);">
      <h4 style="font-size:14px;margin-bottom:14px;">${q ? 'Edit Soal' : 'Tambah Soal'}</h4>
      <div class="form-row">
        <div class="form-group">
          <label>Materi</label>
          <select class="form-control" id="qfMateri">${materiOpts}</select>
        </div>
        <div class="form-group">
          <label>Tingkat</label>
          <select class="form-control" id="qfTingkat">
            <option value="mudah" ${q && q.tingkat === 'mudah' ? 'selected' : ''}>Mudah</option>
            <option value="sedang" ${q && q.tingkat === 'sedang' ? 'selected' : ''}>Sedang</option>
            <option value="sulit" ${q && q.tingkat === 'sulit' ? 'selected' : ''}>Sulit</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Tipe</label>
        <select class="form-control" id="qfTipe" onchange="toggleQuestionType()">
          <option value="pg" ${q && q.tipe === 'pg' ? 'selected' : ''}>Pilihan Ganda</option>
          <option value="angka" ${q && q.tipe === 'angka' ? 'selected' : ''}>Jawaban Angka</option>
        </select>
      </div>
      <div class="form-group">
        <label>Pertanyaan</label>
        <textarea class="form-control" id="qfPertanyaan">${q ? escapeHtml(q.pertanyaan) : ''}</textarea>
      </div>
      <div id="pgOptions" style="${q && q.tipe === 'angka' ? 'display:none;' : ''}">
        <div class="form-group"><label>A</label><input class="form-control" id="qfOptA" value="${q && q.pilihan ? escapeHtml(q.pilihan[0]) : ''}"></div>
        <div class="form-group"><label>B</label><input class="form-control" id="qfOptB" value="${q && q.pilihan ? escapeHtml(q.pilihan[1]) : ''}"></div>
        <div class="form-group"><label>C</label><input class="form-control" id="qfOptC" value="${q && q.pilihan ? escapeHtml(q.pilihan[2]) : ''}"></div>
        <div class="form-group"><label>D</label><input class="form-control" id="qfOptD" value="${q && q.pilihan ? escapeHtml(q.pilihan[3]) : ''}"></div>
      </div>
      <div class="form-group">
        <label>Jawaban Benar ${q && q.tipe === 'pg' ? '(A/B/C/D)' : ''}</label>
        <input class="form-control" id="qfJawaban" value="${q ? escapeHtml(q.jawaban) : ''}">
      </div>
      <div class="form-group">
        <label>Pembahasan</label>
        <textarea class="form-control" id="qfPembahasan">${q ? escapeHtml(q.pembahasan) : ''}</textarea>
      </div>
      <div style="display:flex;gap:10px;">
        <button class="btn btn-primary" onclick="simpanSoal()">Simpan</button>
        <button class="btn btn-secondary" onclick="hideQuestionForm()">Batal</button>
      </div>
    </div>
  `;
}

function toggleQuestionType() {
  const tipe = document.getElementById('qfTipe').value;
  const el = document.getElementById('pgOptions');
  if (el) el.style.display = tipe === 'pg' ? 'block' : 'none';
}

function hideQuestionForm() {
  const el = document.getElementById('questionFormArea');
  if (el) el.innerHTML = '';
  editingQuestionId = null;
}

function simpanSoal() {
  const materi = document.getElementById('qfMateri').value;
  const tingkat = document.getElementById('qfTingkat').value;
  const tipe = document.getElementById('qfTipe').value;
  const pertanyaan = document.getElementById('qfPertanyaan').value.trim();
  const jawaban = document.getElementById('qfJawaban').value.trim();
  const pembahasan = document.getElementById('qfPembahasan').value.trim();

  if (!pertanyaan || !jawaban) { alert('Pertanyaan dan jawaban wajib diisi.'); return; }

  let pilihan = null;
  if (tipe === 'pg') {
    pilihan = ['A', 'B', 'C', 'D'].map(k => document.getElementById('qfOpt' + k).value.trim());
    if (pilihan.some(p => !p)) { alert('Semua pilihan harus diisi.'); return; }
  }

  let questions = getQuestions();

  if (editingQuestionId) {
    const idx = questions.findIndex(x => x.id === editingQuestionId);
    if (idx >= 0) {
      questions[idx] = { ...questions[idx], materi, tingkat, tipe, pertanyaan, pilihan, jawaban, pembahasan };
    }
  } else {
    questions.push({ id: 'q-' + Date.now(), materi, tingkat, tipe, pertanyaan, pilihan, jawaban, pembahasan });
  }

  saveQuestions(questions);
  hideQuestionForm();
  renderGuruKelola(document.getElementById('guruContent'));
}

function hapusSoal(id) {
  if (!confirm('Yakin ingin menghapus soal ini?')) return;
  const questions = getQuestions().filter(q => q.id !== id);
  saveQuestions(questions);
  renderGuruKelola(document.getElementById('guruContent'));
}

/* ============================================================
   EXPORT CSV
   ============================================================ */

async function exportHasilCSV() {
  try {
    const data = await getSiswaDataFromSupabase();
    const keys = Object.keys(data);

    if (keys.length === 0) { alert('Belum ada data siswa.'); return; }

    let csv = 'Username,Nama,Kelas,Materi Selesai,Latihan Dikerjakan,Rata-rata Skor\n';
    keys.forEach(uname => {
      const s = data[uname];
      const latihanArr = Object.values(s.progress?.latihan || {});
      const materiSelesai = Object.keys(s.progress?.materi || {}).length;
      const rata = latihanArr.length
        ? Math.round(latihanArr.reduce((sum, l) => sum + (l.skor || 0), 0) / latihanArr.length)
        : 0;
      csv += `"${uname}","${s.nama || ''}","${s.kelas || ''}",${materiSelesai},${latihanArr.length},${rata}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mathspace-hasil-siswa-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (e) {
    alert('Gagal export: ' + e.message);
  }
}