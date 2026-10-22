/* ============================================================
   LANDING — Login & Registrasi
   ============================================================ */

let activeAuthTab = 'login';

const KELAS_OPTIONS = [
  'XI IPA 1', 'XI IPA 2',
  'XI IPS 1', 'XI IPS 2',
  'XI Bahasa'
];

const EMAIL_DOMAIN = '@mathspace.id';

/* ============================================================
   RENDER LANDING
   ============================================================ */

function renderLandingPage() {
  const app = document.getElementById('app');
  if (!app) return;

  // Kalau sudah login → redirect
  if (typeof isLoggedIn === 'function' && isLoggedIn()) {
    if (typeof routeAfterLogin === 'function') {
      routeAfterLogin();
      return;
    }
  }

  // Sembunyikan nav saat landing
  if (typeof updateHeaderVisibility === 'function') updateHeaderVisibility();

  app.innerHTML = `
    <div class="landing-page">
      <div class="landing-hero">
        <div class="landing-hero-left">
          <h1 class="landing-title">
            Belajar Matematika<br>
            <span class="landing-title-accent">dengan Cara Berpikir</span>
          </h1>
          <p class="landing-subtitle">
            MathSpace bukan sekadar kalkulator. Di sini kamu memprediksi, mengeksplorasi,
            menyelidiki, menerapkan, dan merefleksikan hasil perhitungan matematis.
          </p>
          <ul class="landing-highlights">
            <li>✔ 3 materi inti: Bunga Tunggal, Bunga Majemuk, Anuitas</li>
            <li>✔ Kalkulator eksploratif dengan grafik real-time</li>
            <li>✔ Investigasi matematis untuk melatih penalaran</li>
            <li>✔ Tantangan kontekstual dengan refleksi</li>
          </ul>
        </div>

        <div class="landing-hero-right">
          <div class="login-card">
            <div class="auth-tabs">
              <button class="auth-tab ${activeAuthTab === 'login' ? 'active' : ''}"
                      onclick="switchAuthTab('login')">Login</button>
              <button class="auth-tab ${activeAuthTab === 'register' ? 'active' : ''}"
                      onclick="switchAuthTab('register')">Daftar</button>
            </div>
            <div class="login-card-body" id="authBody">
              ${activeAuthTab === 'login' ? renderFormLogin() : renderFormRegistrasi()}
            </div>
          </div>
        </div>
      </div>

      <div style="margin-top:40px;padding-top:40px;border-top:1px solid var(--border);">
        <h3 style="text-align:center;margin-bottom:24px;">✨ Fitur Utama</h3>
        <div class="card-grid">
          <div class="card">
            <span class="card-cat">Calculate</span>
            <h3>Kalkulator Eksploratif</h3>
            <p>Hitung dengan rumus yang benar, lihat langkah penyelesaian, dan pahami arti setiap variabel.</p>
          </div>
          <div class="card">
            <span class="card-cat">Explore</span>
            <h3>Math Explorer</h3>
            <p>Ubah parameter dan amati bagaimana hasilnya berubah. Bandingkan dua skenario secara langsung.</p>
          </div>
          <div class="card">
            <span class="card-cat">Investigate</span>
            <h3>Math Detective</h3>
            <p>Periksa pernyataan matematis, temukan kesalahan, dan jelaskan alasan di balik jawabanmu.</p>
          </div>
          <div class="card">
            <span class="card-cat">Apply</span>
            <h3>Tantangan Kontekstual</h3>
            <p>Selesaikan masalah nyata: KPR, tabungan pendidikan, pinjaman usaha, dan lainnya.</p>
          </div>
          <div class="card">
            <span class="card-cat">Reflect</span>
            <h3>Refleksi & Umpan Balik</h3>
            <p>Tulis kesimpulan dan alasan matematismu. Guru dapat meninjau proses berpikirmu.</p>
          </div>
          <div class="card">
            <span class="card-cat">Progress</span>
            <h3>Pantau Progres</h3>
            <p>Lihat materi yang sudah dipelajari, skor latihan, dan aktivitas yang sudah diselesaikan.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const el = activeAuthTab === 'login'
      ? document.getElementById('landingUsername')
      : document.getElementById('regNama');
    if (el) el.focus();
  }, 100);
}

/* ============================================================
   TAB SWITCH
   ============================================================ */

function switchAuthTab(tab) {
  activeAuthTab = tab;
  const body = document.getElementById('authBody');
  if (!body) return;

  body.innerHTML = tab === 'login' ? renderFormLogin() : renderFormRegistrasi();

  document.querySelectorAll('.auth-tab').forEach(btn => {
    btn.classList.toggle('active',
      (tab === 'login' && btn.textContent.trim() === 'Login') ||
      (tab === 'register' && btn.textContent.trim() === 'Daftar')
    );
  });

  setTimeout(() => {
    const el = tab === 'login'
      ? document.getElementById('landingUsername')
      : document.getElementById('regNama');
    if (el) el.focus();
  }, 50);
}

/* ============================================================
   FORM LOGIN
   ============================================================ */

function renderFormLogin() {
  return `
    <div class="login-form">
      <div class="form-group">
        <label>Username</label>
        <input type="text" class="form-control" id="landingUsername"
               placeholder="Contoh: andi11" autocomplete="username"
               onkeydown="if(event.key==='Enter') submitLandingLogin()">
      </div>

      <div class="form-group">
        <label>Password</label>
        <div style="position:relative;">
          <input type="password" class="form-control" id="landingPassword"
                 placeholder="••••••••" autocomplete="current-password"
                 onkeydown="if(event.key==='Enter') submitLandingLogin()">
          <button type="button" class="theme-toggle"
                  style="position:absolute;right:6px;top:50%;transform:translateY(-50%);border:none;background:transparent;"
                  onclick="togglePasswordVisibility('landingPassword', this)">👁️</button>
        </div>
      </div>

      <p class="login-error" id="landingError"></p>

      <button class="btn btn-primary btn-block btn-lg" id="loginSubmitBtn"
              onclick="submitLandingLogin()">
        Masuk →
      </button>

      <div style="background:var(--navy-light);border-radius:8px;padding:12px 14px;margin-top:18px;font-size:12px;">
        <div style="font-weight:700;color:var(--teal-dark);margin-bottom:6px;">💡 Akun Demo</div>
        <div style="display:flex;justify-content:space-between;padding:2px 0;color:var(--text-muted);">
          <span>👨‍🏫 Guru:</span>
          <code>dwikiyanata</code>
        </div>
        <div style="display:flex;justify-content:space-between;padding:2px 0;color:var(--text-muted);">
          <span>👦 Siswa:</span>
          <code>andi11</code>
        </div>
      </div>
    </div>
  `;
}

async function submitLandingLogin() {
  const username = document.getElementById('landingUsername').value.trim();
  const pass = document.getElementById('landingPassword').value;
  const errorEl = document.getElementById('landingError');
  const btn = document.getElementById('loginSubmitBtn');

  if (!username) { errorEl.textContent = 'Username tidak boleh kosong.'; return; }
  if (!pass) { errorEl.textContent = 'Password tidak boleh kosong.'; return; }

  if (typeof supabaseClient === 'undefined') {
    errorEl.textContent = 'Error: Supabase tidak termuat.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Memproses...';

  const hasil = await submitLogin(username, pass);

  if (!hasil.ok) {
    btn.disabled = false;
    btn.textContent = 'Masuk →';
    errorEl.textContent = hasil.error;
    return;
  }

  if (typeof renderUserArea === 'function') renderUserArea();
  if (typeof refreshNavAfterAuth === 'function') refreshNavAfterAuth();
  if (typeof routeAfterLogin === 'function') routeAfterLogin();
}

/* ============================================================
   FORM REGISTRASI
   ============================================================ */

function renderFormRegistrasi() {
  let kelasOptions = '<option value="">-- Pilih Kelas --</option>';
  KELAS_OPTIONS.forEach(k => {
    kelasOptions += `<option value="${k}">${k}</option>`;
  });

  return `
    <div class="register-form">
      <div class="form-group">
        <label>Nama Lengkap <span style="color:var(--danger);">*</span></label>
        <input type="text" class="form-control" id="regNama"
               placeholder="Contoh: Andi Pratama" autocomplete="name">
      </div>

      <div class="form-group">
        <label>Username <span style="color:var(--danger);">*</span></label>
        <input type="text" class="form-control" id="regUsername"
               placeholder="Contoh: andi11" autocomplete="username">
        <span class="hint">Min 3 karakter, huruf kecil, angka, titik, _ dan -</span>
      </div>

      <div class="form-group">
        <label>Password <span style="color:var(--danger);">*</span></label>
        <div style="position:relative;">
          <input type="password" class="form-control" id="regPassword"
                 placeholder="Minimal 6 karakter" autocomplete="new-password">
          <button type="button" class="theme-toggle"
                  style="position:absolute;right:6px;top:50%;transform:translateY(-50%);border:none;background:transparent;"
                  onclick="togglePasswordVisibility('regPassword', this)">👁️</button>
        </div>
      </div>

      <div class="form-group">
        <label>Konfirmasi Password <span style="color:var(--danger);">*</span></label>
        <input type="password" class="form-control" id="regPassword2"
               placeholder="Ulangi password" autocomplete="new-password">
      </div>

      <div class="form-group">
        <label>Kelas <span style="color:var(--danger);">*</span></label>
        <select class="form-control" id="regKelas">${kelasOptions}</select>
      </div>

      <p class="login-error" id="regError"></p>

      <button class="btn btn-primary btn-block btn-lg" id="regSubmitBtn"
              onclick="submitRegistrasi()">
        Daftar Sekarang →
      </button>

      <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--text-muted);">
        Sudah punya akun?
        <a href="#" onclick="switchAuthTab('login'); return false;">Login di sini</a>
      </p>
    </div>
  `;
}

function validasiRegistrasi(data) {
  const err = [];

  if (!data.nama || data.nama.trim().length < 2) {
    err.push('Nama lengkap minimal 2 karakter.');
  }
  if (!data.username) {
    err.push('Username wajib diisi.');
  } else if (data.username.length < 3) {
    err.push('Username minimal 3 karakter.');
  } else if (data.username.length > 30) {
    err.push('Username maksimal 30 karakter.');
  } else if (!/^[a-z0-9._-]+$/.test(data.username)) {
    err.push('Username hanya boleh huruf kecil, angka, titik, _ dan -.');
  }
  if (!data.kelas) {
    err.push('Pilih kelas terlebih dahulu.');
  }
  if (!data.password) {
    err.push('Password wajib diisi.');
  } else if (data.password.length < 6) {
    err.push('Password minimal 6 karakter.');
  }
  if (data.password !== data.password2) {
    err.push('Konfirmasi password tidak cocok.');
  }

  return err;
}

async function submitRegistrasi() {
  const errorEl = document.getElementById('regError');
  const btn = document.getElementById('regSubmitBtn');
  errorEl.textContent = '';

  const data = {
    nama: document.getElementById('regNama').value.trim(),
    username: document.getElementById('regUsername').value.trim().toLowerCase(),
    kelas: document.getElementById('regKelas').value,
    password: document.getElementById('regPassword').value,
    password2: document.getElementById('regPassword2').value
  };

  const err = validasiRegistrasi(data);
  if (err.length > 0) {
    errorEl.innerHTML = err.join('<br>');
    return;
  }

  if (typeof supabaseClient === 'undefined') {
    errorEl.textContent = 'Error: Supabase tidak termuat.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Mendaftar...';

  try {
    // Cek username
    const { data: existing, error: cekErr } = await supabaseClient
      .from('profiles')
      .select('username')
      .eq('username', data.username)
      .maybeSingle();

    if (cekErr) throw new Error('Gagal cek username: ' + cekErr.message);

    if (existing) {
      btn.disabled = false;
      btn.textContent = 'Daftar Sekarang →';
      errorEl.textContent = 'Username sudah dipakai. Coba yang lain.';
      return;
    }

    // Sign up
    const email = data.username + EMAIL_DOMAIN;
    const { data: authData, error: authError } = await supabaseClient.auth.signUp({
      email: email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          nama_lengkap: data.nama,
          role: 'siswa',
          kelas: data.kelas
        }
      }
    });

    if (authError) {
      btn.disabled = false;
      btn.textContent = 'Daftar Sekarang →';
      if (authError.message.includes('already')) {
        errorEl.textContent = 'Username atau email sudah terdaftar.';
      } else {
        errorEl.textContent = authError.message;
      }
      return;
    }

    if (!authData.user) {
      btn.disabled = false;
      btn.textContent = 'Daftar Sekarang →';
      errorEl.textContent = 'Gagal membuat akun. Coba lagi.';
      return;
    }

    // Simpan profile
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .insert({
        id: authData.user.id,
        username: data.username,
        nama_lengkap: data.nama,
        role: 'siswa',
        kelas: data.kelas
      });

    if (profileError) {
      btn.disabled = false;
      btn.textContent = 'Daftar Sekarang →';
      errorEl.textContent = 'Gagal menyimpan profil: ' + profileError.message;
      return;
    }

    errorEl.innerHTML = `
      <div class="alert alert-success" style="margin:0;">
        <strong>✓ Registrasi berhasil!</strong><br>
        Silakan login dengan username <strong>${escapeHtml(data.username)}</strong>.
      </div>
    `;
    btn.textContent = '✓ Terdaftar';
    btn.disabled = true;

    setTimeout(() => {
      switchAuthTab('login');
      setTimeout(() => {
        const u = document.getElementById('landingUsername');
        if (u) u.value = data.username;
        const p = document.getElementById('landingPassword');
        if (p) p.focus();
      }, 100);
    }, 1500);

  } catch (e) {
    btn.disabled = false;
    btn.textContent = 'Daftar Sekarang →';
    errorEl.textContent = 'Error: ' + e.message;
    console.error('[Registrasi] Error:', e);
  }
}