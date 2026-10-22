/* ============================================================
   APP — Router utama & inisialisasi
   ============================================================ */

let currentPage = 'landing';
let currentParam = null;

/* ============================================================
   NAVIGATE
   ============================================================ */

function navigate(page, param) {
  // Guard: semua halaman kecuali landing butuh login
  if (page !== 'landing') {
    if (typeof isLoggedIn !== 'function' || !isLoggedIn()) {
      if (typeof renderLandingPage === 'function') renderLandingPage();
      return;
    }
  }

  // Guard: dashboard guru butuh role guru
  if (page === 'dashboard-guru') {
    if (typeof isGuruLoggedIn !== 'function' || !isGuruLoggedIn()) {
      navigate('home');
      return;
    }
  }

  // Guard: dashboard siswa butuh role siswa
  if (page === 'dashboard-siswa') {
    if (typeof isSiswaLoggedIn !== 'function' || !isSiswaLoggedIn()) {
      navigate('home');
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
    case 'landing':          renderLandingPage(); break;
    case 'home':             renderHome(); break;
    case 'materials':        renderMaterialsPage(); break;
    case 'material-detail':  renderMaterialDetail(param); break;
    case 'calculator':       renderCalculatorPage(); break;
    case 'explorer':         renderExplorerPage(param); break;
    case 'detective':        renderDetectivePage(param); break;
    case 'challenge':        renderChallengePage(param); break;
    case 'exercise':         renderExercisePage(param); break;
    case 'dashboard-guru':   renderDashboardGuru(); break;
    case 'dashboard-siswa':  renderDashboardSiswa(); break;
    default:                 renderLandingPage();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================
   HEADER VISIBILITY
   ============================================================ */

function updateHeaderVisibility() {
  const mainNav = document.getElementById('mainNav');
  const userArea = document.getElementById('userArea');
  const loggedIn = (typeof isLoggedIn === 'function') && isLoggedIn();

  if (mainNav) mainNav.style.display = loggedIn ? 'flex' : 'none';
  if (userArea) userArea.style.display = 'flex';
}

/* ============================================================
   NAV MENU DINAMIS
   Sesuaikan item nav berdasarkan role
   ============================================================ */

function updateNavMenu() {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;

  if (!user) {
    nav.innerHTML = '';
    return;
  }

  if (user.role === 'guru') {
    nav.innerHTML = `
      <a href="#" data-page="home" class="nav-link">Beranda</a>
      <a href="#" data-page="materials" class="nav-link">Materi</a>
      <a href="#" data-page="calculator" class="nav-link">Kalkulator</a>
      <a href="#" data-page="explorer" class="nav-link">Explorer</a>
      <a href="#" data-page="detective" class="nav-link">Detective</a>
      <a href="#" data-page="challenge" class="nav-link">Tantangan</a>
      <a href="#" data-page="dashboard-guru" class="nav-link">Dashboard</a>
    `;
  } else {
    nav.innerHTML = `
      <a href="#" data-page="home" class="nav-link">Beranda</a>
      <a href="#" data-page="materials" class="nav-link">Materi</a>
      <a href="#" data-page="calculator" class="nav-link">Kalkulator</a>
      <a href="#" data-page="explorer" class="nav-link">Explorer</a>
      <a href="#" data-page="detective" class="nav-link">Detective</a>
      <a href="#" data-page="challenge" class="nav-link">Tantangan</a>
      <a href="#" data-page="exercise" class="nav-link">Latihan</a>
      <a href="#" data-page="dashboard-siswa" class="nav-link">Progres</a>
    `;
  }

  // Re-bind klik
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigate(link.dataset.page);
    });
  });
}

/* ============================================================
   INISIALISASI
   ============================================================ */

document.addEventListener('DOMContentLoaded', async () => {
  // Theme
  if (typeof initTheme === 'function') initTheme();

  // Hamburger
  const hamburger = document.getElementById('hamburgerBtn');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const nav = document.getElementById('mainNav');
      if (nav) nav.classList.toggle('open');
    });
  }

  // Theme toggle
  const themeBtn = document.getElementById('themeToggleBtn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  // Cek session Supabase
  let user = null;
  if (typeof cekSessionSupabase === 'function') {
    user = await cekSessionSupabase();
  }

  // Render header & nav
  if (typeof renderUserArea === 'function') renderUserArea();
  if (typeof updateHeaderVisibility === 'function') updateHeaderVisibility();
  if (typeof updateNavMenu === 'function') updateNavMenu();

  // Routing awal
  if (user) {
    if (typeof routeAfterLogin === 'function') routeAfterLogin();
  } else {
    if (typeof renderLandingPage === 'function') renderLandingPage();
  }

  // PWA (kalau ada sw.js)
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});

/* ============================================================
   UPDATE NAV SETELAH LOGIN/LOGOUT
   Dipanggil dari auth.js
   ============================================================ */

function refreshNavAfterAuth() {
  if (typeof updateHeaderVisibility === 'function') updateHeaderVisibility();
  if (typeof updateNavMenu === 'function') updateNavMenu();
  if (typeof renderUserArea === 'function') renderUserArea();
}