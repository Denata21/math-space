/* ============================================================
   UTIL BERSAMA
   Fungsi bantu yang dipakai di banyak file
   ============================================================ */

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getMaterialName(id) {
  const m = getMaterials().find(x => x.id === id);
  return m ? m.judul : id;
}