/* ============================================================
   UTILS — Fungsi bantu bersama
   ============================================================ */

/* ----- Escape HTML (anti-XSS) ----- */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ----- Format angka Indonesia ----- */
function formatAngka(angka, maksDesimal = 4) {
  if (angka === null || angka === undefined || !isFinite(angka)) return '—';
  if (typeof angka === 'string') return angka;
  const rounded = Math.round(angka * Math.pow(10, maksDesimal)) / Math.pow(10, maksDesimal);
  return rounded.toLocaleString('id-ID', { maximumFractionDigits: maksDesimal });
}

/* ----- Format rupiah ----- */
function formatRupiah(angka) {
  if (!isFinite(angka)) return '—';
  return 'Rp' + Math.round(angka).toLocaleString('id-ID');
}

/* ----- Format ribuan untuk input (misal: 1000000 → "1.000.000") ----- */
function formatRibuanInput(str) {
  const num = String(str).replace(/[^\d]/g, '');
  if (!num) return '';
  return parseInt(num, 10).toLocaleString('id-ID');
}

/* ----- Parse input ribuan kembali ke angka ("1.000.000" → "1000000") ----- */
function parseRibuanInput(str) {
  return String(str).replace(/\./g, '').replace(/,/g, '');
}

/* ----- Handle input rupiah real-time (dengan cursor position) ----- */
function handleRupiahInput(el) {
  const raw = el.value;
  if (!raw || raw.trim() === '') {
    el.value = '';
    return;
  }
  const cursorPos = el.selectionStart;
  const lengthBefore = raw.length;
  const formatted = formatRibuanInput(raw);
  el.value = formatted;
  const diff = formatted.length - lengthBefore;
  el.setSelectionRange(cursorPos + diff, cursorPos + diff);
}

/* ----- Format tanggal Indonesia ----- */
function formatTanggal(isoString) {
  try {
    return new Date(isoString).toLocaleString('id-ID', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  } catch (e) {
    return '-';
  }
}

/* ----- Debounce (untuk slider/input) ----- */
function debounce(fn, delay = 150) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ----- Avatar inisial dari nama ----- */
function renderAvatar(nama) {
  if (!nama) return '?';
  const clean = String(nama).trim();
  if (!clean) return '?';
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

/* ----- Cek apakah string adalah angka valid ----- */
function isNumeric(val) {
  if (val === null || val === undefined || val === '') return false;
  return !isNaN(parseFloat(val)) && isFinite(val);
}

/* ----- Toggle password visibility ----- */
function togglePasswordVisibility(inputId, btn) {
  const el = document.getElementById(inputId);
  if (!el) return;
  if (el.type === 'password') {
    el.type = 'text';
    if (btn) btn.textContent = '🙈';
  } else {
    el.type = 'password';
    if (btn) btn.textContent = '👁️';
  }
}