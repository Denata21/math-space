/* ============================================================
   DAFTAR AKUN (GURU + SISWA)
   ============================================================ */

const DAFTAR_AKUN = [
  // ============ GURU ============
  {
    username: 'dwikiyanata',
    password: 'guru123',
    nama: 'Dwiki Dzakwan Yanata, S.Si',
    role: 'guru',
    kelas: null
  },

  // ============ SISWA ============
  {
    username: 'andi11',
    password: 'siswa123',
    nama: 'Andi Pratama',
    role: 'siswa',
    kelas: 'XI IPA 1'
  },
  {
    username: 'siti11',
    password: 'siswa123',
    nama: 'Siti Nurhaliza',
    role: 'siswa',
    kelas: 'XI IPA 1'
  },
  {
    username: 'budi11',
    password: 'siswa123',
    nama: 'Budi Santoso',
    role: 'siswa',
    kelas: 'XI IPA 2'
  },
  {
    username: 'dewi11',
    password: 'siswa123',
    nama: 'Dewi Lestari',
    role: 'siswa',
    kelas: 'XI IPA 2'
  }
];

/* ----- Cari akun berdasarkan username ----- */
function cariAkun(username) {
  if (!username) return null;
  const clean = String(username).trim().toLowerCase();
  return DAFTAR_AKUN.find(a => a.username.toLowerCase() === clean) || null;
}

/* ----- Verifikasi login ----- */
function verifikasiLogin(username, password) {
  const akun = cariAkun(username);
  if (!akun) {
    return { ok: false, error: 'Username tidak terdaftar.' };
  }
  if (akun.password !== password) {
    return { ok: false, error: 'Password salah.' };
  }
  return { ok: true, akun: akun };
}

/* ----- Ambil daftar akun siswa (untuk guru) ----- */
function getDaftarAkunSiswa() {
  return DAFTAR_AKUN.filter(a => a.role === 'siswa');
}

/* ----- Ambil daftar kelas (unik) ----- */
function getDaftarKelas() {
  const kelas = new Set();
  DAFTAR_AKUN.forEach(a => {
    if (a.kelas) kelas.add(a.kelas);
  });
  return Array.from(kelas).sort();
}