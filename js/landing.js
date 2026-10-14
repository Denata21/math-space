/* ============================================================
   LANDING PAGE — Login & Registrasi
   ============================================================ */

let activeAuthTab = 'login';

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

  app.innerHTML = `
    <div class="landing-page">
      <div class="landing-hero">
        <div class="landing-hero-left">
          <h1 class="landing-title">
            Belajar Matematika<br>
            <span class="landing-title-accent">Lebih Mudah & Menyenangkan</span>
          </h1>
          <p class="landing-subtitle">
            Materi lengkap, latihan interaktif, kalkulator cerdas, dan progress tracking
            dalam satu platform untuk siswa SMA/SMK kelas 11.
          </p>
          <ul class="landing-highlights">
            <li>✔ Materi Anuitas, Statistika, Kesebangunan, Pencacahan</li>
            <li>✔ 6 Kalkulator dengan langkah penyelesaian</li>
            <li>✔ Latihan soal PG & jawaban angka</li>
            <li>✔ Progress belajar tersimpan otomatis</li>
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

      <div class="landing-features">
        <h3 class="landing-features-title">✨ Fitur Unggulan</h3>
        <div class="landing-features-grid">
          <div class="landing-feature-card">
            <div class="landing-feature-icon">📚</div>
            <h4>Materi Lengkap</h4>
            <p>Anuitas, Statistika, Kesebangunan, dan Pencacahan dengan penjelasan bertahap.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon">📝</div>
            <h4>Latihan Soal</h4>
            <p>Soal pilihan ganda & jawaban angka dengan pembahasan otomatis.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon">🧮</div>
            <h4>6 Kalkulator</h4>
            <p>Bunga Tunggal, Bunga Majemuk, Anuitas, Kesebangunan, Statistika, Pencacahan.</p>
          </div>
          <div class="landing-feature-card">
            <div class="landing-feature-icon">📊</div>
            <h4>Progress Tracking</h4>
            <p>Pantau materi yang sudah dipelajari dan skor latihan secara otomatis.</p>
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
          <button type="button" class="password-toggle"
                  onclick="togglePasswordVisibility('landingPassword', this)">👁️</button>
        </div>
      </div>

      <p class="login-error" id="landingError"></p>

      <button class="btn btn-primary landing-btn-login" id="loginSubmitBtn"
              onclick="submitLandingLogin()">
        Masuk →
      </button>

      <div class="landing-demo">
        <div class="landing-demo-title">💡 Akun Demo</div>
        <div class="landing-demo-row">
          <span>👨‍🏫 Guru:</span>
          <code>dwikiyanata</code> / <code>guru123</code>
        </div>
        <div class="landing-demo-row">
          <span>👦 Siswa:</span>
          <code>andi11</code> / <code>siswa123</code>
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

  // Berhasil
  if (typeof renderUserArea === 'function') renderUserArea();
  if (typeof routeAfterLogin === 'function') routeAfterLogin();
}