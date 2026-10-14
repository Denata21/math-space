/* ============================================================
   APLIKASI UTAMA — Navigasi & Routing
   - Landing page: untuk yang belum login
   - Home: untuk yang sudah login
   - Guard: semua halaman kecuali landing butuh login
   ============================================================ */

let currentPage = 'landing';
let currentParam = null;

// Halaman yang boleh diakses tanpa login
const PUBLIC_PAGES = ['landing'];

function navigate(page, param) {
  // Guard: semua halaman kecuali landing butuh login
  if (page !== 'landing') {
    if (typeof isLoggedIn !== 'function' || !isLoggedIn()) {
      if (typeof renderLandingPage === 'function') renderLandingPage();
      return;
    }
  }

  // Guard: halaman guru butuh role guru
  if (page === 'admin-dashboard') {
    if (typeof isGuruLoggedIn !== 'function' || !isGuruLoggedIn()) {
      if (typeof isLoggedIn === 'function' && isLoggedIn()) {
        navigate('home');
      } else {
        renderLandingPage();
      }
      return;
    }
  }

  // Guard: halaman siswa butuh role siswa
  if (page === 'siswa-panel') {
    if (typeof isSiswaLoggedIn !== 'function' || !isSiswaLoggedIn()) {
      if (typeof isLoggedIn === 'function' && isLoggedIn()) {
        navigate('home');
      } else {
        renderLandingPage();
      }
      return;
    }
  }

  currentPage = page;
  currentParam = param || null;

  // Update active nav
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });

  const nav = document.getElementById('mainNav');
  if (nav) nav.classList.remove('open');

  // Render
  switch (page) {
    case 'landing':           renderLandingPage(); break;
    case 'home':              renderHome(); break;
    case 'materials':         renderMaterialsPage(); break;
    case 'material-detail':   renderMaterialDetail(param); break;
    case 'calculator':        renderCalculatorPage(); break;
    case 'exercise':          renderExercisePage(param); break;
    case 'progress':          renderProgressPage(); break;
    case 'siswa-panel':       renderSiswaPanel(); break;
    case 'admin-dashboard':   renderAdminDashboard(); break;
    default:                  renderLandingPage();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================
   HEADER: tampil/sembunyikan navbar
   - Landing: header disembunyikan (kecuali brand + theme)
   - Sudah login: header lengkap dengan nav
   ============================================================ */

function updateHeaderVisibility() {
  const mainNav = document.getElementById('mainNav');
  const userArea = document.getElementById('userArea');
  const loggedIn = (typeof isLoggedIn === 'function') && isLoggedIn();

  if (mainNav) {
    mainNav.style.display = loggedIn ? 'flex' : 'none';
  }
  if (userArea) {
    userArea.style.display = loggedIn ? 'flex' : 'none';
  }
}

/* ============================================================
   HOMEPAGE (setelah login)
   ============================================================ */

function renderHome() {
  const app = document.getElementById('app');
  const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;

  let greeting = '';
  if (user) {
    const isGuru = user.role === 'guru';
    greeting = `
      <div class="calc-panel" style="margin-bottom:20px;background:var(--blue-light);border-color:var(--blue);">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <div>
            <strong>👋 Halo, ${escapeHtml(user.nama)}!</strong>
            <p style="color:var(--gray-text);font-size:13px;margin-top:4px;">
              ${isGuru ? 'Guru / Admin' : 'Siswa • ' + escapeHtml(user.kelas || '-')}
              • Selamat ${isGuru ? 'mengajar' : 'belajar'}!
            </p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="navigate('${isGuru ? 'admin-dashboard' : 'siswa-panel'}')">
            ${isGuru ? '📊 Dashboard' : '👤 Panel Saya'}
          </button>
        </div>
      </div>
    `;
  }

  let progressHtml = '';
  const ringkasan = (typeof hitungProgressKeseluruhan === 'function')
    ? hitungProgressKeseluruhan() : null;
  if (ringkasan && (ringkasan.materiSelesai > 0 || ringkasan.latihanSelesai > 0)) {
    progressHtml = `
      <div class="calc-panel" style="margin-bottom:24px;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
          <div>
            <strong>📊 Progress Belajar</strong>
            <p style="color:var(--gray-text);font-size:13px;margin-top:4px;">
              Materi: ${ringkasan.materiSelesai}/${ringkasan.totalMateri} •
              Latihan: ${ringkasan.latihanSelesai}/${ringkasan.totalLatihan}
            </p>
          </div>
          <button class="btn btn-secondary btn-sm"
                  onclick="navigate('${user && user.role === 'siswa' ? 'siswa-panel' : 'progress'}')">
            Detail
          </button>
        </div>
      </div>
    `;
  }

  app.innerHTML = `
    <div class="hero">
      <h2>Selamat Datang di Math Space</h2>
      <p>Pelajari konsep matematika, berlatih menyelesaikan soal, dan gunakan kalkulator cerdas untuk memahami matematika dengan lebih mudah.</p>
      <div class="hero-actions">
        <button class="btn btn-primary" onclick="navigate('materials')">Mulai Belajar</button>
        <button class="btn btn-outline" onclick="navigate('exercise')">Latihan Soal</button>
        <button class="btn btn-secondary" onclick="navigate('calculator')">Kalkulator</button>
      </div>
    </div>

    ${greeting}
    ${progressHtml}

    <h3 class="section-title">Materi Tersedia</h3>
    <div class="card-grid" id="homeMaterialGrid"></div>
  `;

  const grid = document.getElementById('homeMaterialGrid');
  if (!grid) return;
  getMaterials().forEach(m => {
    const selesai = (typeof isMateriSelesai === 'function') && isMateriSelesai(m.id);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <span class="card-cat">${escapeHtml(m.kategori)}</span>
      ${selesai ? '<span class="badge badge-mudah" style="align-self:flex-start;margin-bottom:6px;">✓ Sudah dipelajari</span>' : ''}
      <h3>${escapeHtml(m.judul)}</h3>
      <p>${escapeHtml(m.deskripsi)}</p>
      <button class="btn btn-primary btn-sm" onclick="navigate('material-detail', '${m.id}')">Pelajari</button>
    `;
    grid.appendChild(card);
  });
}

/* ============================================================
   INISIALISASI
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  // Theme
  if (typeof initTheme === 'function') initTheme();

  // Hamburger menu
  const hamburger = document.getElementById('hamburgerBtn');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      document.getElementById('mainNav').classList.toggle('open');
    });
  }

  // Nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(link.dataset.page);
    });
  });

  // Theme toggle
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // === CEK SESSION SUPABASE DULU ===
  let user = null;
  if (typeof cekSessionSupabase === 'function') {
    user = await cekSessionSupabase();
  }

  // Render user area
  if (typeof renderUserArea === 'function') renderUserArea();
  if (typeof updateHeaderVisibility === 'function') updateHeaderVisibility();

  // PWA service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  // Routing awal
  if (user) {
    if (typeof routeAfterLogin === 'function') routeAfterLogin();
  } else {
    if (typeof renderLandingPage === 'function') renderLandingPage();
  }
});