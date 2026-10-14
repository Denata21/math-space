/* ============================================================
   EXPORT / IMPORT DATA (JSON)
   Untuk backup & restore materi, soal, dan progress
   ============================================================ */

function exportData() {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    materials: getMaterials(),
    questions: getQuestions(),
    progress: getProgress(),
    history: (() => {
      try { return JSON.parse(localStorage.getItem('rm_calc_history') || '[]'); }
      catch (e) { return []; }
    })()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const tgl = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `math-space-backup-${tgl}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json,.json';

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);

        if (!data || typeof data !== 'object') {
          alert('File tidak valid.');
          return;
        }

        if (!confirm('Import akan menimpa data materi & soal saat ini. Lanjutkan?')) return;

        if (Array.isArray(data.materials)) saveMaterials(data.materials);
        if (Array.isArray(data.questions)) saveQuestions(data.questions);
        if (data.progress && typeof data.progress === 'object') {
          localStorage.setItem('rm_progress', JSON.stringify(data.progress));
        }
        if (Array.isArray(data.history)) {
          localStorage.setItem('rm_calc_history', JSON.stringify(data.history));
        }

        alert('Import berhasil! Halaman akan dimuat ulang.');
        location.reload();

      } catch (err) {
        alert('Gagal membaca file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  input.click();
}

function resetSemuaData() {
  if (!confirm('⚠️ Ini akan menghapus SEMUA data (materi, soal, progress, riwayat) dan kembali ke default. Lanjutkan?')) return;
  if (!confirm('Yakin? Tindakan ini tidak bisa dibatalkan.')) return;

  localStorage.removeItem('rm_materials');
  localStorage.removeItem('rm_questions');
  localStorage.removeItem('rm_progress');
  localStorage.removeItem('rm_calc_history');

  alert('Semua data telah direset. Halaman akan dimuat ulang.');
  location.reload();
}