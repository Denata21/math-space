/* ============================================================
   AUTH — Login, logout, session
   ============================================================ */

const AUTH_KEY = 'ms_auth';

/* ----- State login (cache non-sensitif) ----- */
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

/* ============================================================
   CEK SESSION SAAT PAGE LOAD
   ============================================================ */

async function cekSessionSupabase() {
  try {
    if (typeof supabaseClient === 'undefined') return null;

    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error || !session) return null;

    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('username, nama_lengkap, role, kelas')
      .eq('id', session.user.id)
      .single();

    if (profileError || !profile) return null;

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
  if (typeof supabaseClient === 'undefined') {
    return { ok: false, error: 'Supabase client tidak termuat.' };
  }

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
   LOGOUT
   ============================================================ */

async function logoutUser() {
  if (!confirm('Logout dari akun ini?')) return;

  try {
    if (typeof supabaseClient !== 'undefined') {
      await supabaseClient.auth.signOut();
    }
  } catch (e) {
    console.warn('[Auth] Gagal signOut:', e);
  }

  localStorage.removeItem(AUTH_KEY);

  if (typeof renderUserArea === 'function') renderUserArea();
  if (typeof updateHeaderVisibility === 'function') updateHeaderVisibility();
  if (typeof renderLandingPage === 'function') renderLandingPage();
}

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
    navigate('dashboard-guru');
  } else {
    navigate('home');
  }
}

/* ============================================================
   DATA SISWA UNTUK GURU
   ============================================================ */

async function getSiswaDataFromSupabase() {
  try {
    if (typeof supabaseClient === 'undefined') return {};

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
        id: s.id,
        username: s.username,
        nama: s.nama_lengkap,
        kelas: s.kelas,
        progress: { materi: {}, latihan: {} }
      };

      progressSiswa.forEach(p => {
        if (p.selesai) {
          result[s.username].progress.materi[p.materi_id] = { selesai: true };
        }
      });

      const latihanByMateri = {};
      latihanSiswa.forEach(l => {
        if (!latihanByMateri[l.materi_id] || l.skor > latihanByMateri[l.materi_id].skor) {
          latihanByMateri[l.materi_id] = {
            skor: l.skor,
            benar: l.benar,
            total: l.total,
            terbaik: l.skor,
            waktu: l.waktu
          };
        }
      });
      result[s.username].progress.latihan = latihanByMateri;
    });

    return result;
  } catch (e) {
    console.error('[Auth] Error ambil data siswa:', e);
    return {};
  }
}

/* ============================================================
   DATA AKTIVITAS SISWA UNTUK GURU
   ============================================================ */

async function getAktivitasSiswaFromSupabase() {
  try {
    if (typeof supabaseClient === 'undefined') return [];

    const { data, error } = await supabaseClient
      .from('aktivitas_siswa')
      .select('*')
      .order('waktu', { ascending: false })
      .limit(200);

    if (error) throw error;
    return data || [];
  } catch (e) {
    console.warn('[Auth] Error ambil aktivitas:', e);
    return [];
  }
}