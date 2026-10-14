/* ============================================================
   PROFIL USER DI NAVBAR
   - Belum login: tombol "Login Guru"
   - Sudah login: avatar + nama + dropdown
   - Session dicek dari Supabase saat page load
   ============================================================ */

function renderUserArea() {
  const area = document.getElementById('userArea');
  if (!area) {
    console.warn('[Profile] #userArea tidak ditemukan di DOM');
    return;
  }

  const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;

  // ===== Belum login =====
  if (!user) {
    area.innerHTML = `
      <button class="btn-admin-login" id="loginBtn" type="button">
        👤 Login
      </button>
    `;

    const btn = document.getElementById('loginBtn');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Ke landing page (form login)
        if (typeof renderLandingPage === 'function') {
          renderLandingPage();
        }
      });
    }
    return;
  }

  // ===== Sudah login =====
  const isGuru = user.role === 'guru';
  const avatarClass = isGuru ? 'user-avatar-guru' : 'user-avatar-siswa';
  const roleLabel = isGuru
    ? 'Guru / Admin'
    : `Siswa • ${escapeHtml(user.kelas || '-')}`;

  let dropdownItems = '';

  if (isGuru) {
    dropdownItems = `
      <a href="#" class="user-dropdown-item" data-action="dashboard">📊 Dashboard</a>
      <a href="#" class="user-dropdown-item" data-action="siswa">🎓 Panel Siswa</a>
      <a href="#" class="user-dropdown-item" data-action="preview">🏠 Preview Website</a>
    `;
  } else {
    dropdownItems = `
      <a href="#" class="user-dropdown-item" data-action="siswa-panel">👤 Profil Saya</a>
      <a href="#" class="user-dropdown-item" data-action="progress">📊 Progress Belajar</a>
      <a href="#" class="user-dropdown-item" data-action="preview">🏠 Beranda</a>
    `;
  }

  area.innerHTML = `
    <div class="user-profile" id="userProfile">
      <button class="user-profile-btn" id="userProfileBtn" type="button">
        <span class="user-avatar ${avatarClass}">${renderAvatar(user.nama)}</span>
        <span class="user-name">${escapeHtml(user.nama)}</span>
        <span class="user-caret">▾</span>
      </button>
      <div class="user-dropdown" id="userDropdown">
        <div class="user-dropdown-header">
          <span class="user-avatar user-avatar-lg ${avatarClass}">${renderAvatar(user.nama)}</span>
          <div>
            <div class="user-dropdown-name">${escapeHtml(user.nama)}</div>
            <div class="user-dropdown-sub">@${escapeHtml(user.username)}</div>
            <div class="user-dropdown-sub">${roleLabel}</div>
          </div>
        </div>
        ${dropdownItems}
        <div class="user-dropdown-divider"></div>
        <a href="#" class="user-dropdown-item user-dropdown-danger" data-action="logout">
          🚪 Logout
        </a>
      </div>
    </div>
  `;

  // Event: toggle dropdown
  const btn = document.getElementById('userProfileBtn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleUserDropdown();
    });
  }

  // Event: klik item dropdown
  document.querySelectorAll('#userDropdown .user-dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const action = item.dataset.action;
      closeUserDropdown();

      switch (action) {
        case 'dashboard':
          navigate('admin-dashboard');
          break;
        case 'siswa':
          if (typeof switchAdminTab === 'function') switchAdminTab('siswa');
          navigate('admin-dashboard');
          break;
        case 'siswa-panel':
          navigate('siswa-panel');
          break;
        case 'progress':
          navigate('progress');
          break;
        case 'preview':
          navigate('home');
          break;
        case 'logout':
          if (typeof logoutUser === 'function') logoutUser();
          break;
      }
    });
  });
}

/* ----- Avatar: inisial nama ----- */
function renderAvatar(nama) {
  if (!nama) return '?';
  const clean = String(nama).trim();
  if (!clean) return '?';
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) {
    const p = parts[0];
    if (p.length >= 2) return (p.charAt(0) + p.charAt(1)).toUpperCase();
    return p.charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/* ----- Toggle dropdown ----- */
function toggleUserDropdown() {
  const dd = document.getElementById('userDropdown');
  if (!dd) return;
  dd.classList.toggle('open');
}

function closeUserDropdown() {
  const dd = document.getElementById('userDropdown');
  if (dd) dd.classList.remove('open');
}

/* ----- Klik di luar → tutup dropdown ----- */
document.addEventListener('click', (e) => {
  const profile = document.getElementById('userProfile');
  if (profile && !profile.contains(e.target)) {
    closeUserDropdown();
  }
});

/* ============================================================
   AUTO-RENDER + CEK SESSION
   Dipanggil saat page load
   ============================================================ */

async function initAuthSession() {
  // Tunggu Supabase client siap
  if (typeof supabase === 'undefined') {
    console.warn('[Profile] Supabase belum dimuat, skip cek session');
    return;
  }

  // Cek session dari Supabase
  if (typeof cekSessionSupabase === 'function') {
    const userData = await cekSessionSupabase();

    if (userData) {
      console.log('[Profile] Session ditemukan:', userData.username);
    } else {
      console.log('[Profile] Tidak ada session');
    }
  }
}

/* ----- Render user area (dipanggil berkali-kali) ----- */
window.addEventListener('load', async () => {
  // 1. Cek session Supabase dulu
  await initAuthSession();

  // 2. Render user area
  setTimeout(() => {
    if (typeof renderUserArea === 'function') renderUserArea();
    if (typeof updateHeaderVisibility === 'function') updateHeaderVisibility();
  }, 100);
});

// Kalau DOM sudah siap, langsung jalankan
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof renderUserArea === 'function') renderUserArea();
  });
} else {
  if (typeof renderUserArea === 'function') renderUserArea();
}