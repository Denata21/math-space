/* ============================================================
   AUTENTIKASI — Berbasis Supabase Auth
   Password TIDAK LAGI disimpan di frontend!
   ============================================================ */

const AUTH_KEY = 'rm_auth';

/* ===== STATE LOGIN (hanya cache data non-sensitif) ===== */
function getAuthData() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || '{}');
  } catch (e) {
    return {};
  }
}

function saveAuthData(d) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(d));
}

function isLoggedIn() {
  const d = getAuthData();
  return !!(d.loggedIn && d.username && d.role);
}

function isGuruLoggedIn() {
  const d = getAuthData();
  return !!(d.loggedIn && d.role === 'guru');
}

function isSiswaLoggedIn() {
  const d = getAuthData();
  return !!(d.loggedIn && d.role === 'siswa');
}

function getCurrentUser() {
  const d = getAuthData();
  if (!d.loggedIn) return null;
  return {
    username: d.username,
    nama: d.nama || d.username,
    role: d.role,
    kelas: d.kelas || null,
    userId: d.userId || null
  };
}

function getUsernameGuru() {
  const u = getCurrentUser();
  return (u && u.role === 'guru') ? u.username : 'guru';
}

function getNamaGuru() {
  const u = getCurrentUser();
  return (u && u.role === 'guru') ? (u.nama || u.username) : 'Guru';
}

function getNamaSiswa() {
  const u = getCurrentUser();
  return (u && u.role === 'siswa') ? (u.nama || u.username) : 'Siswa';
}

function getKelasSiswa() {
  const u = getCurrentUser();
  return (u && u.role === 'siswa') ? (u.kelas || '-') : '-';
}

/* ============================================================
   CEK SESSION SAAT PAGE LOAD
   ============================================================ */
async function cekSessionSupabase() {
  try {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error || !session) {
      return null;
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('username, nama_lengkap, role, kelas')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    const d = getAuthData();
    d.username = profile.username;
    d.nama = profile.nama_lengkap || profile.username;
    d.role = profile.role;
    d.kelas = profile.kelas || null;
    d.loggedIn = true;
    d.userId = session.user.id;
    saveAuthData(d);

    return d;
  } catch (e) {
    console.error('[Auth] Error cek session:', e);
    return null;
  }
}

/* ============================================================
   LOGIN
   ============================================================ */
async function submitLogin(username, password) {
  const { data: profile, error: profileError } = await supabaseClient
    .from('profiles')
    .select('id, username, role, nama_lengkap, kelas')
    .eq('username', username.toLowerCase())
    .maybeSingle();

  if (profileError || !profile) {
    return { ok: false, error: 'Username tidak terdaftar.' };
  }

  const email = username.toLowerCase() + '@mathspace.id';

  const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (authError) {
    if (authError.message.includes('Invalid login')) {
      return { ok: false, error: 'Username atau password salah.' };
    }
    if (authError.message.includes('Email not confirmed')) {
      return { ok: false, error: 'Email belum diverifikasi.' };
    }
    return { ok: false, error: authError.message };
  }

  const d = getAuthData();
  d.username = profile.username;
  d.nama = profile.nama_lengkap || profile.username;
  d.role = profile.role;
  d.kelas = profile.kelas || null;
  d.loggedIn = true;
  d.loginAt = new Date().toISOString();
  d.userId = authData.user.id;
  saveAuthData(d);

  return { ok: true, user: d };
}

/* ============================================================
   LOGOUT (FIX ERROR)
   ============================================================ */
async function logoutUser() {
  if (!confirm('Logout dari akun ini?')) return;

  try {
    if (typeof supabaseClient !== 'undefined') {
      await supabaseClient.auth.signOut();
    }
  } catch (e) {
    console.warn('[Auth] Gagal signOut Supabase:', e);
  } finally {
    localStorage.removeItem(AUTH_KEY);
    if (typeof renderUserArea === 'function') renderUserArea();
    if (typeof updateHeaderVisibility === 'function') updateHeaderVisibility();
    if (typeof renderLandingPage === 'function') renderLandingPage();
  }
}

function logoutGuru() { logoutUser(); }
function loginGuru() { loginUser(); }
function loginUser() { if (typeof loginGuru === 'function') loginGuru(); }

/* ============================================================
   ROUTING SETELAH LOGIN
   ============================================================ */
function routeAfterLogin() {
  const u = getCurrentUser();
  if (!u) {
    if (typeof renderLandingPage === 'function') renderLandingPage();
    return;
  }

  if (typeof updateHeaderVisibility === 'function') updateHeaderVisibility();

  if (u.role === 'guru') {
    navigate('admin-dashboard');
  } else {
    navigate('home');
  }
}

/* ============================================================
   DATA SISWA (Untuk Panel Guru)
   ============================================================ */
async function getSiswaDataFromSupabase() {
  try {
    const { data: siswaList, error: err1 } = await supabaseClient
      .from('profiles')
      .select('id, username, nama_lengkap, kelas')
      .eq('role', 'siswa')
      .order('nama_lengkap');

    if (err1) throw err1;

    const { data: progressList, error: err2 } = await supabaseClient
      .from('progress')
      .select('user_id, materi_id, selesai');

    if (err2) throw err2;

    const { data: latihanList, error: err3 } = await supabaseClient
      .from('latihan')
      .select('user_id, materi_id, skor, benar, total, waktu')
      .order('waktu', { ascending: false });

    if (err3) throw err3;

    const result = {};
    siswaList.forEach(s => {
      const progressSiswa = progressList.filter(p => p.user_id === s.id);
      const latihanSiswa = latihanList.filter(l => l.user_id === s.id);

      result[s.username] = {
        username: s.username,
        nama: s.nama_lengkap,
        kelas: s.kelas,
        progress: { materi: {}, latihan: {} }
      };

      progressSiswa.forEach(p => {
        if (p.selesai) result[s.username].progress.materi[p.materi_id] = { selesai: true };
      });

      const latihanByMateri = {};
      latihanSiswa.forEach(l => {
        if (!latihanByMateri[l.materi_id] || l.skor > latihanByMateri[l.materi_id].skor) {
          latihanByMateri[l.materi_id] = {
            skor: l.skor, benar: l.benar, total: l.total, terbaik: l.skor, waktu: l.waktu
          };
        }
      });
      result[s.username].progress.latihan = latihanByMateri;
    });

    return result;
  } catch (e) {
    console.error('[Supabase] Error ambil data siswa:', e);
    return {};
  }
}

function getSiswaData() { return {}; }
function saveSiswaData(d) {}

async function syncProgressSiswaKeGuru() {
  const u = getCurrentUser();
  if (!u || u.role !== 'siswa') return;

  const progress = getProgress();

  for (const materiId of Object.keys(progress.materi || {})) {
    if (progress.materi[materiId].selesai) {
      await supabaseClient.from('progress').upsert({
        user_id: u.userId,
        materi_id: materiId,
        selesai: true
      }, { onConflict: 'user_id,materi_id' });
    }
  }

  for (const materiId of Object.keys(progress.latihan || {})) {
    const l = progress.latihan[materiId];
    await supabaseClient.from('latihan').insert({
      user_id: u.userId,
      materi_id: materiId,
      skor: l.skor,
      benar: l.benar || 0,
      total: l.total || 0
    });
  }
}

/* ============================================================
   KOMPATIBILITAS
   ============================================================ */
function getGuruData() { return getAuthData(); }
function saveGuruData(d) { saveAuthData(d); }
function ubahUsernameGuru() { alert('Username tidak bisa diubah dari UI.'); }
function ubahNamaGuru() { return ubahUsernameGuru(); }
function hitungTotalLatihan() { return 0; }
function buatKodeKelas() { alert('Fitur kode kelas tidak dipakai.'); }
function getKodeKelas() { return null; }