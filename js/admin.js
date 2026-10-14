/* ============================================================
   DASHBOARD GURU (gabungan Admin + Guru)
   - Kelola materi
   - Kelola soal
   - Panel siswa (rekap nilai, export CSV, kode kelas)
   - Backup & restore
   ============================================================ */

let adminTab = 'materi';
let editingMaterialId = null;
let editingQuestionId = null;

/* ===== RENDER DASHBOARD ===== */

function renderAdminDashboard() {
  // Guard: harus login guru
  if (typeof isGuruLoggedIn !== 'function' || !isGuruLoggedIn()) {
    navigate('home');
    return;
  }

  const app = document.getElementById('app');
  const namaGuru = getNamaGuru();
  const usernameGuru = getUsernameGuru();

  let html = `
    <div class="hero" style="padding:24px 28px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <div style="display:flex;align-items:center;gap:14px;">
        <span class="user-avatar user-avatar-lg user-avatar-guru">${renderAvatar(namaGuru)}</span>
        <div>
          <h2 style="margin-bottom:2px;">Dashboard Guru</h2>
          <p style="margin:0;color:var(--gray-text);font-size:13px;">
            <strong>${escapeHtml(namaGuru)}</strong> • @${escapeHtml(usernameGuru)}
          </p>
        </div>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-secondary btn-sm" onclick="navigate('home')">Preview Website</button>
        <button class="btn btn-danger btn-sm" onclick="logoutGuru()">Logout</button>
      </div>
    </div>

    <div class="dashboard-tabs">
      <button class="tab-btn ${adminTab === 'materi' ? 'active' : ''}" onclick="switchAdminTab('materi')">📚 Kelola Materi</button>
      <button class="tab-btn ${adminTab === 'soal' ? 'active' : ''}" onclick="switchAdminTab('soal')">📝 Kelola Latihan</button>
      <button class="tab-btn ${adminTab === 'siswa' ? 'active' : ''}" onclick="switchAdminTab('siswa')">🎓 Panel Siswa</button>
      <button class="tab-btn ${adminTab === 'backup' ? 'active' : ''}" onclick="switchAdminTab('backup')">💾 Backup & Restore</button>
    </div>

    <div id="adminContent"></div>
  `;

  app.innerHTML = html;
  renderAdminTabContent();
}

function switchAdminTab(tab) {
  adminTab = tab;
  renderAdminDashboard();
}

function renderAdminTabContent() {
  const content = document.getElementById('adminContent');
  if (adminTab === 'materi') renderAdminMateri(content);
  else if (adminTab === 'soal') renderAdminSoal(content);
  else if (adminTab === 'siswa') renderAdminSiswa(content);
  else renderAdminBackup(content);
}

/* ============================================================
   KELOLA MATERI
   ============================================================ */

function renderAdminMateri(container) {
  const materials = getMaterials();

  let html = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
      <h3 style="font-size:16px;">Daftar Materi (${materials.length})</h3>
      <button class="btn btn-primary btn-sm" onclick="showMaterialForm()">+ Tambah Materi</button>
    </div>
    <div id="materialFormArea"></div>
    <div class="table-wrap">
      <table class="admin-table">
        <thead>
          <tr><th>Judul</th><th>Kategori</th><th>Aksi</th></tr>
        </thead>
        <tbody>
  `;

  materials.forEach(m => {
    html += `
      <tr>
        <td>${escapeHtml(m.judul)}</td>
        <td>${escapeHtml(m.kategori)}</td>
        <td>
          <div class="actions">
            <button class="btn btn-secondary btn-sm" onclick="showMaterialForm('${m.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="hapusMateri('${m.id}')">Hapus</button>
          </div>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table></div>`;
  container.innerHTML = html;
}

function showMaterialForm(id) {
  editingMaterialId = id || null;
  const materials = getMaterials();
  const m = id ? materials.find(x => x.id === id) : null;

  const formHtml = `
    <div class="calc-panel" style="margin-bottom:20px;">
      <h3 style="font-size:15px;margin-bottom:16px;">${m ? 'Edit Materi' : 'Tambah Materi Baru'}</h3>
      <div class="form-group">
        <label>Judul Materi</label>
        <input class="form-control" id="mfJudul" value="${m ? escapeHtml(m.judul) : ''}">
      </div>
      <div class="form-group">
        <label>Kategori</label>
        <input class="form-control" id="mfKategori" value="${m ? escapeHtml(m.kategori) : ''}">
      </div>
      <div class="form-group">
        <label>Deskripsi Singkat</label>
        <textarea class="form-control" id="mfDeskripsi">${m ? escapeHtml(m.deskripsi) : ''}</textarea>
      </div>
      <div class="form-group">
        <label>Tujuan Pembelajaran (satu per baris)</label>
        <textarea class="form-control" id="mfTujuan" style="min-height:90px;">${m ? m.tujuan.join('\n') : ''}</textarea>
      </div>
      <div class="form-group">
        <label>Isi Materi (pisahkan paragraf dengan baris kosong)</label>
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
        <button class="btn btn-primary" onclick="simpanMateri()">Simpan Materi</button>
        <button class="btn btn-secondary" onclick="hideMaterialForm()">Batal</button>
      </div>
    </div>
  `;

  document.getElementById('materialFormArea').innerHTML = formHtml;
}

function hideMaterialForm() {
  document.getElementById('materialFormArea').innerHTML = '';
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
  renderAdminDashboard();
}

function hapusMateri(id) {
  if (!confirm('Yakin ingin menghapus materi ini?')) return;
  let materials = getMaterials().filter(m => m.id !== id);
  saveMaterials(materials);
  renderAdminDashboard();
}

/* ============================================================
   KELOLA SOAL
   ============================================================ */

function renderAdminSoal(container) {
  const questions = getQuestions();

  let html = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:10px;">
      <h3 style="font-size:16px;">Daftar Soal (${questions.length})</h3>
      <button class="btn btn-primary btn-sm" onclick="showQuestionForm()">+ Tambah Soal</button>
    </div>
    <div id="questionFormArea"></div>
    <div class="table-wrap">
      <table class="admin-table">
        <thead>
          <tr><th>Materi</th><th>Tingkat</th><th>Tipe</th><th>Pertanyaan</th><th>Aksi</th></tr>
        </thead>
        <tbody>
  `;

  questions.forEach(q => {
    const pertanyaanShort = q.pertanyaan.length > 50
      ? q.pertanyaan.substring(0, 50) + '...'
      : q.pertanyaan;

    html += `
      <tr>
        <td>${escapeHtml(getMaterialName(q.materi))}</td>
        <td>${escapeHtml(q.tingkat)}</td>
        <td>${q.tipe === 'pg' ? 'Pilihan Ganda' : 'Jawaban Angka'}</td>
        <td>${escapeHtml(pertanyaanShort)}</td>
        <td>
          <div class="actions">
            <button class="btn btn-secondary btn-sm" onclick="showQuestionForm('${q.id}')">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="hapusSoal('${q.id}')">Hapus</button>
          </div>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table></div>`;
  container.innerHTML = html;
}

function showQuestionForm(id) {
  editingQuestionId = id || null;
  const questions = getQuestions();
  const q = id ? questions.find(x => x.id === id) : null;
  const materials = getMaterials();

  let materiOpts = materials.map(m =>
    `<option value="${m.id}" ${q && q.materi === m.id ? 'selected' : ''}>${escapeHtml(m.judul)}</option>`
  ).join('');

  const formHtml = `
    <div class="calc-panel" style="margin-bottom:20px;">
      <h3 style="font-size:15px;margin-bottom:16px;">${q ? 'Edit Soal' : 'Tambah Soal Baru'}</h3>
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
        <label>Tipe Soal</label>
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
        <div class="form-group">
          <label>Pilihan A</label>
          <input class="form-control qf-opt" id="qfOptA" value="${q && q.pilihan ? escapeHtml(q.pilihan[0]) : ''}">
        </div>
        <div class="form-group">
          <label>Pilihan B</label>
          <input class="form-control qf-opt" id="qfOptB" value="${q && q.pilihan ? escapeHtml(q.pilihan[1]) : ''}">
        </div>
        <div class="form-group">
          <label>Pilihan C</label>
          <input class="form-control qf-opt" id="qfOptC" value="${q && q.pilihan ? escapeHtml(q.pilihan[2]) : ''}">
        </div>
        <div class="form-group">
          <label>Pilihan D</label>
          <input class="form-control qf-opt" id="qfOptD" value="${q && q.pilihan ? escapeHtml(q.pilihan[3]) : ''}">
        </div>
      </div>
      <div class="form-group">
        <label>Jawaban Benar ${q && q.tipe === 'pg' ? '(A/B/C/D)' : ''}</label>
        <input class="form-control" id="qfJawaban" value="${q ? escapeHtml(q.jawaban) : ''}">
      </div>
      <div class="form-group">
        <label>Pembahasan</label>
        <textarea class="form-control" id="qfPembahasan" style="min-height:70px;">${q ? escapeHtml(q.pembahasan) : ''}</textarea>
      </div>
      <div style="display:flex;gap:10px;">
        <button class="btn btn-primary" onclick="simpanSoal()">Simpan Soal</button>
        <button class="btn btn-secondary" onclick="hideQuestionForm()">Batal</button>
      </div>
    </div>
  `;

  document.getElementById('questionFormArea').innerHTML = formHtml;
}

function toggleQuestionType() {
  const tipe = document.getElementById('qfTipe').value;
  document.getElementById('pgOptions').style.display = tipe === 'pg' ? 'block' : 'none';
}

function hideQuestionForm() {
  document.getElementById('questionFormArea').innerHTML = '';
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
    pilihan = [
      document.getElementById('qfOptA').value.trim(),
      document.getElementById('qfOptB').value.trim(),
      document.getElementById('qfOptC').value.trim(),
      document.getElementById('qfOptD').value.trim()
    ];
    if (pilihan.some(p => !p)) { alert('Semua pilihan jawaban harus diisi.'); return; }
  }

  let questions = getQuestions();

  if (editingQuestionId) {
    const idx = questions.findIndex(x => x.id === editingQuestionId);
    if (idx >= 0) {
      questions[idx] = { ...questions[idx], materi, tingkat, tipe, pertanyaan, pilihan, jawaban, pembahasan };
    }
  } else {
    const id = 'q-' + Date.now();
    questions.push({ id, materi, tingkat, tipe, pertanyaan, pilihan, jawaban, pembahasan });
  }

  saveQuestions(questions);
  hideQuestionForm();
  renderAdminDashboard();
}

function hapusSoal(id) {
  if (!confirm('Yakin ingin menghapus soal ini?')) return;
  let questions = getQuestions().filter(q => q.id !== id);
  saveQuestions(questions);
  renderAdminDashboard();
}

/* ============================================================
   PANEL SISWA (gabungan fitur Guru lama)
   ============================================================ */
async function renderAdminSiswa(container) {
  container.innerHTML = '<div class="calc-panel"><p>Memuat data siswa...</p></div>';

  try {
    // Ambil dari Supabase
    const data = await getSiswaDataFromSupabase();

    const totalSiswa = Object.keys(data).length;
    let totalLatihan = 0;
    Object.values(data).forEach(s => {
      totalLatihan += Object.keys((s.progress && s.progress.latihan) || {}).length;
    });

    container.innerHTML = `
      <div class="calc-panel" style="margin-bottom:16px;">
        <h3 style="font-size:15px;margin-bottom:12px;">📊 Rekap Hasil</h3>
        <div class="result-grid">
          <div class="result-card">
            <div class="label">Siswa Terdaftar</div>
            <div class="value">${totalSiswa}</div>
          </div>
          <div class="result-card">
            <div class="label">Total Latihan</div>
            <div class="value">${totalLatihan}</div>
          </div>
        </div>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;">
          <button class="btn btn-primary" onclick="exportHasilCSV()">⬇️ Export CSV</button>
          <button class="btn btn-secondary" onclick="renderAdminSiswa(document.getElementById('adminContent'))">
            🔄 Refresh
          </button>
        </div>
      </div>

      <div class="calc-panel">
        <h3 style="font-size:15px;margin-bottom:12px;">📋 Daftar Siswa</h3>
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th style="text-align:left;">Username</th>
                <th style="text-align:left;">Nama</th>
                <th>Kelas</th>
                <th>Materi</th>
                <th>Latihan</th>
                <th>Rata-rata</th>
              </tr>
            </thead>
            <tbody>
              ${renderTabelSiswaFromData(data)}
            </tbody>
          </table>
        </div>
      </div>
    `;
  } catch (e) {
    container.innerHTML = `<div class="calc-panel"><p style="color:red;">Error: ${e.message}</p></div>`;
  }
}

function renderTabelSiswaFromData(data) {
  const keys = Object.keys(data);
  if (keys.length === 0) {
    return `<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--gray-text);">
      Belum ada siswa terdaftar.</td></tr>`;
  }

  return keys.map(uname => {
    const s = data[uname];
    const p = s.progress || {};
    const materiSelesai = Object.keys(p.materi || {}).length;
    const latihanArr = Object.values(p.latihan || {});
    const rata = latihanArr.length
      ? Math.round(latihanArr.reduce((sum, l) => sum + (l.skor || 0), 0) / latihanArr.length)
      : 0;

    return `<tr>
      <td style="text-align:left;">@${escapeHtml(uname)}</td>
      <td style="text-align:left;"><strong>${escapeHtml(s.nama || '-')}</strong></td>
      <td>${escapeHtml(s.kelas || '-')}</td>
      <td>${materiSelesai}</td>
      <td>${latihanArr.length}</td>
      <td>${rata}/100</td>
    </tr>`;
  }).join('');
}

/* ============================================================
   BACKUP & RESTORE
   ============================================================ */

function renderAdminBackup(container) {
  const materials = getMaterials();
  const questions = getQuestions();
  const progress = getProgress();

  container.innerHTML = `
    <div class="calc-panel">
      <h3 style="font-size:15px;margin-bottom:12px;">💾 Backup & Restore Data</h3>
      <p style="color:var(--gray-text);font-size:14px;margin-bottom:16px;">
        Export data materi, soal, progress, dan riwayat perhitungan ke file JSON.
        File tersebut bisa di-import kembali kapan saja.
      </p>

      <div class="result-grid" style="margin-bottom:20px;">
        <div class="result-card">
          <div class="label">Total Materi</div>
          <div class="value">${materials.length}</div>
        </div>
        <div class="result-card">
          <div class="label">Total Soal</div>
          <div class="value">${questions.length}</div>
        </div>
        <div class="result-card">
          <div class="label">Progress Tersimpan</div>
          <div class="value">${Object.keys(progress.materi || {}).length + Object.keys(progress.latihan || {}).length}</div>
        </div>
      </div>

      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="exportData()">⬇️ Export ke JSON</button>
        <button class="btn btn-outline" onclick="importData()">⬆️ Import dari JSON</button>
        <button class="btn btn-danger" onclick="resetSemuaData()">🗑️ Reset Semua Data</button>
      </div>

      <p style="color:var(--gray-text);font-size:12px;margin-top:16px;">
        <strong>Catatan:</strong> Data disimpan di <code>localStorage</code> browser.
        Backup rutin disarankan sebelum mengganti perangkat atau browser.
      </p>
    </div>
  `;
}

/* ============================================================
   UTIL
   ============================================================ */

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getMaterialName(id) {
  const m = getMaterials().find(x => x.id === id);
  return m ? m.judul : id;
}

