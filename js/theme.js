/* ============================================================
   THEME — Dark / Light Mode
   ============================================================ */

const THEME_KEY = 'ms_theme';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(saved);
  updateThemeButton();
}

function toggleTheme() {
  const current = localStorage.getItem(THEME_KEY) || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  localStorage.setItem(THEME_KEY, next);
  applyTheme(next);
  updateThemeButton();
}

function applyTheme(mode) {
  document.documentElement.setAttribute('data-theme', mode);
}

function updateThemeButton() {
  const btn = document.getElementById('themeToggleBtn');
  if (!btn) return;
  const current = localStorage.getItem(THEME_KEY) || 'light';
  btn.textContent = current === 'light' ? '🌙' : '☀️';
  btn.title = current === 'light' ? 'Aktifkan mode gelap' : 'Aktifkan mode terang';
}