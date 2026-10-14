/* ============================================================
   REGISTRASI SISWA MANDIRI via Supabase Auth
   ============================================================ */

const KELAS_OPTIONS = [
  'XI IPA 1', 'XI IPA 2',
  'XI IPS 1', 'XI IPS 2',
  'XI Bahasa'
];

const EMAIL_DOMAIN = '@mathspace.id';   // domain fiktif untuk internal

function renderFormRegistrasi() {
  let kelasOptions = '<option value="">-- Pilih Kelas --</option>';
  KELAS_OPTIONS.forEach(k => {
    kelasOptions += `<option value="${k}">${k}</option>`;
  });

  return `
    <div class="register-form">
      <div class="form-group">
        <label>Nama Lengkap <span style="color:var(--red);">*</span></label>
        <input type="text" class="form-control" id="regNama"
               placeholder="Contoh: Andi Pratama" autocomplete="name">
      </div>

      <div class="form-group">
        <label>Username <span style="color:var(--red);">*</span></label>
        <input type="text" class="form-control" id="regUsername"
               placeholder="Contoh: andi11" autocomplete="username">
        <small style="color:var(--gray-text);font-size:12px;display:block;margin-top:4px;">
          Min 3 karakter, huruf kecil, angka, titik, _ dan -
        </small>
      </div>

      <div class="form-group">
        <label>Password <span style="color:var(--red);">*</span></label>
        <div style="position:relative;">
          <input type="password" class="form-control" id="regPassword"
                 placeholder="Minimal 6 karakter" autocomplete="new-password">
          <button type="button" class="password-toggle"
                  onclick="togglePasswordVisibility('regPassword', this)">👁️</button>
        </div>
      </div>

      <div class="form-group">
        <label>Konfirmasi Password <span style="color:var(--red);">*</span></label>
        <div style="position:relative;">
          <input type="password" class="form-control" id="regPassword2"
                 placeholder="Ulangi password" autocomplete="new-password">
          <button type="button" class="password-toggle"
                  onclick="togglePasswordVisibility('regPassword2', this)">👁️</button>
        </div>
      </div>

      <div class="form-group">
        <label>Kelas <span style="color:var(--red);">*</span></label>
        <select class="form-control" id="regKelas">${kelasOptions}</select>
      </div>

      <p class="login-error" id="regError"></p>

      <button class="btn btn-primary landing-btn-login" id="regSubmitBtn"
              onclick="submitRegistrasi()">
        Daftar Sekarang →
      </button>

      <p style="text-align:center;margin-top:16px;font-size:13px;color:var(--gray-text);">
        Sudah punya akun?
        <a href="#" onclick="switchAuthTab('login'); return false;"
           style="color:var(--blue);font-weight:600;">Login di sini</a>
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

  // Validasi
  const err = validasiRegistrasi(data);
  if (err.length > 0) {
    errorEl.innerHTML = err.join('<br>');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Mendaftar...';

  try {
    // 1. Cek username sudah dipakai?
    const { data: existing } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', data.username)
      .maybeSingle();

    if (existing) {
      btn.disabled = false;
      btn.textContent = 'Daftar Sekarang →';
      errorEl.textContent = 'Username sudah dipakai. Coba yang lain.';
      return;
    }

    // 2. Sign up ke Supabase Auth
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

    // 3. Simpan ke tabel profiles
    if (authData.user) {
      const { error: profileError } = await supabase
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
    }

    // 4. Berhasil
    errorEl.innerHTML = `
      <div style="background:#dcfce7;color:#15803d;padding:14px;border-radius:8px;
                  border:1px solid #86efac;font-size:14px;">
        <strong>✓ Registrasi berhasil!</strong><br>
        Silakan login dengan username <strong>${escapeHtml(data.username)}</strong>.
      </div>
    `;
    btn.textContent = '✓ Terdaftar';
    btn.disabled = true;

    // Auto-fill login form
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
  }
}