/* ============================================================
   PROGRESS — Tracking belajar siswa (lokal + Supabase)
   ============================================================ */

const PROGRESS_KEY = 'ms_progress';

/* ============================================================
   STATE LOKAL
   ============================================================ */

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

/* ============================================================
   MATERI
   ============================================================ */

function isMateriSelesai(materialId) {
  const p = getProgress();
  return !!(p.materi && p.materi[materialId] && p.materi[materialId].selesai);
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

/* ============================================================
   LATIHAN
   ============================================================ */

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

function getSkorLatihan(materiId) {
  const p = getProgress();
  return (p.latihan && p.latihan[materiId]) || null;
}

/* ============================================================
   AKTIVITAS: EXPLORER
   Simpan parameter terakhir + pengamatan siswa
   ============================================================ */

function simpanHasilExplorer(explorerId, params, pengamatan) {
  const p = getProgress();
  if (!p.explorer) p.explorer = {};
  p.explorer[explorerId] = {
    params,
    pengamatan: pengamatan || '',
    waktu: new Date().toISOString()
  };
  saveProgress(p);
  syncAktivitasKeSupabase('explorer', explorerId, {
    params,
    pengamatan: pengamatan || '',
    jawaban_numerik: null,
    alasan: pengamatan || ''
  });
}

function getHasilExplorer(explorerId) {
  const p = getProgress();
  return (p.explorer && p.explorer[explorerId]) || null;
}

/* ============================================================
   AKTIVITAS: DETECTIVE
   Simpan jawaban + alasan siswa
   ============================================================ */

function simpanHasilDetective(detectiveId, jawabanSiswa, alasan) {
  const p = getProgress();
  if (!p.detective) p.detective = {};
  p.detective[detectiveId] = {
    jawaban: jawabanSiswa,
    alasan: alasan || '',
    waktu: new Date().toISOString()
  };
  saveProgress(p);
  syncAktivitasKeSupabase('detective', detectiveId, {
    params: null,
    pengamatan: '',
    jawaban_numerik: jawabanSiswa,
    alasan: alasan || ''
  });
}

function getHasilDetective(detectiveId) {
  const p = getProgress();
  return (p.detective && p.detective[detectiveId]) || null;
}

/* ============================================================
   AKTIVITAS: CHALLENGE
   Simpan strategi, jawaban, dan refleksi
   ============================================================ */

function simpanHasilChallenge(challengeId, data) {
  const p = getProgress();
  if (!p.challenge) p.challenge = {};
  p.challenge[challengeId] = {
    prediksi: data.prediksi || '',
    strategi: data.strategi || '',
    jawaban: data.jawaban || '',
    alasan: data.alasan || '',
    refleksi: data.refleksi || '',
    waktu: new Date().toISOString()
  };
  saveProgress(p);
  syncAktivitasKeSupabase('challenge', challengeId, {
    params: null,
    pengamatan: data.refleksi || '',
    jawaban_numerik: data.jawaban || null,
    alasan: data.alasan || ''
  });
}

function getHasilChallenge(challengeId) {
  const p = getProgress();
  return (p.challenge && p.challenge[challengeId]) || null;
}

/* ============================================================
   SYNC AKTIVITAS KE SUPABASE
   Semua aktivitas (explorer/detective/challenge) masuk ke tabel
   yang sama: aktivitas_siswa
   ============================================================ */

async function syncAktivitasKeSupabase(tipe, aktivitasId, data) {
  try {
    const user = getCurrentUser();
    if (!user || user.role !== 'siswa' || !user.userId) return;
    if (typeof supabaseClient === 'undefined') return;

    await supabaseClient.from('aktivitas_siswa').insert({
      user_id: user.userId,
      tipe: tipe,
      aktivitas_id: aktivitasId,
      params: data.params,
      pengamatan: data.pengamatan,
      jawaban_numerik: data.jawaban_numerik,
      alasan: data.alasan,
      waktu: new Date().toISOString()
    });
  } catch (e) {
    console.warn('[Progress] Gagal sync aktivitas:', e);
  }
}

/* ============================================================
   RINGKASAN
   ============================================================ */

function hitungProgressKeseluruhan() {
  const materials = getMaterials();
  const p = getProgress();

  let materiSelesai = 0;
  materials.forEach(m => {
    if (p.materi && p.materi[m.id] && p.materi[m.id].selesai) materiSelesai++;
  });

  const latihanSelesai = Object.keys(p.latihan || {}).length;
  const explorerSelesai = Object.keys(p.explorer || {}).length;
  const detectiveSelesai = Object.keys(p.detective || {}).length;
  const challengeSelesai = Object.keys(p.challenge || {}).length;

  return {
    materiSelesai,
    totalMateri: materials.length,
    persenMateri: materials.length ? Math.round((materiSelesai / materials.length) * 100) : 0,
    latihanSelesai,
    totalLatihan: materials.length,
    persenLatihan: materials.length ? Math.round((latihanSelesai / materials.length) * 100) : 0,
    explorerSelesai,
    detectiveSelesai,
    challengeSelesai
  };
}

function resetProgress() {
  if (!confirm('Yakin ingin menghapus semua progress belajar? Tindakan ini tidak bisa dibatalkan.')) return;
  localStorage.removeItem(PROGRESS_KEY);
  if (typeof renderProgressPage === 'function') {
    renderProgressPage();
  }
}