/* ============================================================
   PROFILE — Avatar & dropdown di navbar
   ============================================================ */

function renderUserArea() {
  const area = document.getElementById('userArea');
  if (!area) return;

  const user = (typeof getCurrentUser === 'function') ? getCurrentUser() : null;

  // ===== Belum login =====
  if (!user) {
    area.innerHTML = `
      <button class="btn btn-secondary btn-sm" id="loginBtn" type="button">
        👤 Login
      </button>
    `;

    const btn = document.getElementById('loginBtn');
    if (btn) {
      btn.addEventListener('click', () => {
        if (typeof renderLandingPage === 'function') renderLandingPage();
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

  const dashboardPage = isGuru ? 'dashboard-guru' : 'dashboard-siswa';

  let dropdownItems = '';

  if (isGuru) {
    dropdownItems = `
      <a href="#" class="user-dropdown-item" data-action="dashboard">📊 Dashboard Guru</a>
      <a href="#" class="user-dropdown-item" data-action="preview">🏠 Lihat Sebagai Siswa</a>
    `;
  } else {
    dropdownItems = `
      <a href="#" class="user-dropdown-item" data-action="dashboard">📊 Dashboard Saya</a>
      <a href="#" class="user-dropdown-item" data-action="progress">📈 Progress Belajar</a>
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

  const btn = document.getElementById('userProfileBtn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleUserDropdown();
    });
  }

  document.querySelectorAll('#userDropdown .user-dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const action = item.dataset.action;
      closeUserDropdown();

      switch (action) {
        case 'dashboard':
          navigate(dashboardPage);
          break;
        case 'progress':
          navigate('dashboard-siswa');
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

function toggleUserDropdown() {
  const dd = document.getElementById('userDropdown');
  if (dd) dd.classList.toggle('open');
}

function closeUserDropdown() {
  const dd = document.getElementById('userDropdown');
  if (dd) dd.classList.remove('open');
}

document.addEventListener('click', (e) => {
  const profile = document.getElementById('userProfile');
  if (profile && !profile.contains(e.target)) {
    closeUserDropdown();
  }
});