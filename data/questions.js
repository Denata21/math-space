/* ============================================================
   DATA SOAL LATIHAN — 3 MATERI
   tipe: "pg" | "angka"
   ============================================================ */

const DEFAULT_QUESTIONS = [
  // ===== BUNGA TUNGGAL =====
  {
    id: "bt-1", materi: "bunga-tunggal", tingkat: "mudah", tipe: "pg",
    pertanyaan: "Bunga tunggal dihitung berdasarkan ...",
    pilihan: ["Saldo terkini", "Modal awal", "Bunga periode sebelumnya", "Total bunga"],
    jawaban: "B",
    pembahasan: "Bunga tunggal selalu dihitung dari modal awal, tidak dari saldo yang sudah bertambah."
  },
  {
    id: "bt-2", materi: "bunga-tunggal", tingkat: "mudah", tipe: "angka",
    pertanyaan: "Modal Rp4.000.000, bunga tunggal 5% per tahun, lama 3 tahun. Berapa besar bunganya? (tulis angka tanpa titik, contoh: 600000)",
    jawaban: "600000",
    pembahasan: "b = M₀ × i × n = 4.000.000 × 0,05 × 3 = Rp600.000."
  },
  {
    id: "bt-3", materi: "bunga-tunggal", tingkat: "sedang", tipe: "angka",
    pertanyaan: "Modal Rp10.000.000, bunga tunggal 6% per tahun. Setelah berapa tahun modal menjadi Rp11.800.000? (tulis angka tahun)",
    jawaban: "3",
    pembahasan: "Mn = M₀(1 + i·n) → 11.800.000 = 10.000.000(1 + 0,06n) → 1,18 = 1 + 0,06n → n = 3 tahun."
  },
  {
    id: "bt-4", materi: "bunga-tunggal", tingkat: "sulit", tipe: "angka",
    pertanyaan: "Setelah 4 tahun, tabungan menjadi Rp7.200.000. Jika bunga tunggal 5% per tahun, berapa modal awalnya? (tanpa titik)",
    jawaban: "6000000",
    pembahasan: "Mn = M₀(1 + i·n) → 7.200.000 = M₀(1 + 0,05×4) = M₀ × 1,2 → M₀ = Rp6.000.000."
  },

  // ===== BUNGA MAJEMUK =====
  {
    id: "bm-1", materi: "bunga-majemuk", tingkat: "mudah", tipe: "pg",
    pertanyaan: "Ciri utama bunga majemuk adalah ...",
    pilihan: ["Bunga konstan tiap periode", "Bunga dihitung dari saldo terkini", "Tidak ada bunga", "Bunga hanya sekali"],
    jawaban: "B",
    pembahasan: "Bunga majemuk dihitung dari saldo terkini (modal + bunga yang sudah terakumulasi), sehingga bunga berbunga."
  },
  {
    id: "bm-2", materi: "bunga-majemuk", tingkat: "sedang", tipe: "angka",
    pertanyaan: "Modal Rp2.000.000, bunga majemuk 10% per tahun, lama 2 tahun. Berapa modal akhirnya? (tanpa titik)",
    jawaban: "2420000",
    pembahasan: "Mn = 2.000.000 × (1,10)² = 2.000.000 × 1,21 = Rp2.420.000."
  },
  {
    id: "bm-3", materi: "bunga-majemuk", tingkat: "sedang", tipe: "angka",
    pertanyaan: "Modal Rp5.000.000 menjadi Rp6.655.000 setelah 3 tahun dengan bunga majemuk. Berapa suku bunga per tahun? (tulis persen, contoh: 10)",
    jawaban: "10",
    pembahasan: "6.655.000/5.000.000 = 1,331 = (1+i)³ → 1+i = 1,10 → i = 10%."
  },
  {
    id: "bm-4", materi: "bunga-majemuk", tingkat: "sulit", tipe: "angka",
    pertanyaan: "Modal Rp10.000.000, bunga majemuk 8% per tahun. Setelah berapa tahun modal menjadi sekitar Rp14.693.000? (tulis angka tahun, bulatkan)",
    jawaban: "5",
    pembahasan: "14.693.000/10.000.000 = 1,4693. log(1,4693)/log(1,08) ≈ 5 tahun."
  },

  // ===== ANUITAS =====
  {
    id: "an-1", materi: "anuitas", tingkat: "mudah", tipe: "pg",
    pertanyaan: "Komponen pembayaran anuitas terdiri atas ...",
    pilihan: ["Bunga dan pajak", "Angsuran pokok dan bunga", "Pokok dan administrasi", "Bunga dan denda"],
    jawaban: "B",
    pembahasan: "Setiap pembayaran anuitas terdiri atas angsuran pokok dan bunga."
  },
  {
    id: "an-2", materi: "anuitas", tingkat: "sedang", tipe: "angka",
    pertanyaan: "Pinjaman Rp10.000.000, bunga 10% per tahun, anuitas tahunan 2 tahun. Berapa besar anuitasnya? (bulatkan ke rupiah, tanpa titik)",
    jawaban: "5761905",
    pembahasan: "A = 10.000.000 × [0,10/(1−(1,10)⁻²)] ≈ Rp5.761.905."
  },
  {
    id: "an-3", materi: "anuitas", tingkat: "sedang", tipe: "angka",
    pertanyaan: "Pinjaman Rp12.000.000, bunga 1% per bulan, anuitas bulanan 12 bulan. Berapa besar anuitas per bulan? (tanpa titik)",
    jawaban: "1066185",
    pembahasan: "A = 12.000.000 × [0,01/(1−(1,01)⁻¹²)] ≈ Rp1.066.185."
  },
  {
    id: "an-4", materi: "anuitas", tingkat: "sulit", tipe: "pg",
    pertanyaan: "Pada anuitas, seiring bertambahnya periode, maka ...",
    pilihan: [
      "Porsi bunga naik, porsi pokok turun",
      "Porsi bunga turun, porsi pokok naik",
      "Keduanya tetap",
      "Keduanya turun"
    ],
    jawaban: "B",
    pembahasan: "Sisa pinjaman menurun → bunga menurun. Karena total anuitas tetap, porsi pokok meningkat."
  }
];

function getQuestions() {
  const stored = localStorage.getItem('ms_questions');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) { /* fallback */ }
  }
  return DEFAULT_QUESTIONS;
}

function saveQuestions(questions) {
  localStorage.setItem('ms_questions', JSON.stringify(questions));
}