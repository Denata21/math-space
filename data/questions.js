/* ============================================================
   DATA SOAL LATIHAN
   Struktur: id, materi, tingkat, tipe, pertanyaan,
             pilihan[], jawaban, pembahasan
   tipe: "pg" (pilihan ganda) | "angka" (jawaban angka)
   ============================================================ */

const DEFAULT_QUESTIONS = [
  // ===== ANUITAS =====
  {
    id: "an-1",
    materi: "anuitas",
    tingkat: "mudah",
    tipe: "pg",
    pertanyaan: "Anuitas adalah pembayaran yang besarnya ... setiap periode.",
    pilihan: ["Berubah-ubah", "Sama", "Semakin kecil", "Semakin besar"],
    jawaban: "B",
    pembahasan: "Anuitas adalah pembayaran dengan jumlah yang sama besar setiap periode."
  },
  {
    id: "an-2",
    materi: "anuitas",
    tingkat: "mudah",
    tipe: "pg",
    pertanyaan: "Komponen pembayaran anuitas terdiri atas ...",
    pilihan: [
      "Bunga dan pajak",
      "Angsuran pokok dan bunga",
      "Angsuran pokok dan administrasi",
      "Bunga dan denda"
    ],
    jawaban: "B",
    pembahasan: "Setiap pembayaran anuitas terdiri atas angsuran pokok dan bunga."
  },
  {
    id: "an-3",
    materi: "anuitas",
    tingkat: "sedang",
    tipe: "pg",
    pertanyaan: "Pinjaman Rp10.000.000 akan dilunasi dengan anuitas tahunan selama 2 tahun. Jika bunga 10% per tahun, besar anuitasnya adalah ...",
    pilihan: ["Rp5.761.900", "Rp5.500.000", "Rp6.000.000", "Rp5.000.000"],
    jawaban: "A",
    pembahasan: "A = 10.000.000 × [0,10 / (1 − (1,10)^(−2))] = 10.000.000 × 0,576190 ≈ Rp5.761.900."
  },
  {
    id: "an-4",
    materi: "anuitas",
    tingkat: "sedang",
    tipe: "angka",
    pertanyaan: "Pinjaman Rp20.000.000, bunga 10% per tahun, anuitas tahunan selama 3 tahun. Berapa besar anuitasnya? (tulis dalam rupiah tanpa titik, contoh: 8042300)",
    jawaban: "8042300",
    pembahasan: "A = 20.000.000 × [0,10/(1−(1,10)^−3)] ≈ Rp8.042.300."
  },
  {
    id: "an-5",
    materi: "anuitas",
    tingkat: "sulit",
    tipe: "pg",
    pertanyaan: "Pada anuitas pinjaman, seiring bertambahnya periode, maka ...",
    pilihan: [
      "Porsi bunga semakin besar, angsuran pokok semakin kecil",
      "Porsi bunga semakin kecil, angsuran pokok semakin besar",
      "Bunga dan angsuran pokok tetap",
      "Bunga tetap, angsuran pokok berubah"
    ],
    jawaban: "B",
    pembahasan: "Karena sisa pinjaman menurun, bunga yang dihitung dari sisa pinjaman juga menurun, sedangkan angsuran pokok meningkat."
  },
  {
    id: "an-6",
    materi: "anuitas",
    tingkat: "sulit",
    tipe: "angka",
    pertanyaan: "Pinjaman Rp12.000.000 dilunasi dengan anuitas bulanan selama 1 tahun (12 bulan), bunga 1% per bulan. Berapa besar anuitas bulanannya? (bulatkan ke rupiah terdekat, tanpa titik)",
    jawaban: "1066185",
    pembahasan: "A = 12.000.000 × [0,01/(1−(1,01)^−12)] ≈ Rp1.066.185."
  },

  // ===== KESEBANGUNAN =====
  {
    id: "ks-1",
    materi: "kesebangunan",
    tingkat: "mudah",
    tipe: "pg",
    pertanyaan: "Dua bangun dikatakan sebangun jika ...",
    pilihan: [
      "Bentuknya sama dan ukurannya sama",
      "Sudut bersesuaian sama dan sisi bersesuaian sebanding",
      "Luasnya sama",
      "Kelilingnya sama"
    ],
    jawaban: "B",
    pembahasan: "Syarat sebangun: sudut bersesuaian sama besar dan sisi bersesuaian sebanding."
  },
  {
    id: "ks-2",
    materi: "kesebangunan",
    tingkat: "sedang",
    tipe: "angka",
    pertanyaan: "Tiang 2 m memiliki bayangan 3 m. Pada saat yang sama pohon memiliki bayangan 12 m. Berapa tinggi pohon (dalam meter)?",
    jawaban: "8",
    pembahasan: "2/3 = t/12 → t = 24/3 = 8 meter."
  },

  // ===== STATISTIKA =====
  {
    id: "st-1",
    materi: "statistika",
    tingkat: "mudah",
    tipe: "pg",
    pertanyaan: "Nilai yang paling sering muncul dalam data disebut ...",
    pilihan: ["Mean", "Median", "Modus", "Kuartil"],
    jawaban: "C",
    pembahasan: "Modus adalah nilai yang paling sering muncul."
  },
  {
    id: "st-2",
    materi: "statistika",
    tingkat: "sedang",
    tipe: "angka",
    pertanyaan: "Diberikan data: 4, 6, 7, 7, 8, 8. Berapa mean-nya?",
    jawaban: "6.67",
    pembahasan: "Mean = (4+6+7+7+8+8)/6 = 40/6 ≈ 6,67."
  },

  // ===== PENCACAHAN =====
  {
    id: "pc-1",
    materi: "pencacahan",
    tingkat: "mudah",
    tipe: "pg",
    pertanyaan: "Banyak cara menyusun 3 huruf berbeda dari huruf A, B, C, D adalah ...",
    pilihan: ["12", "24", "6", "4"],
    jawaban: "B",
    pembahasan: "4P3 = 4!/(4−3)! = 24."
  },
  {
    id: "pc-2",
    materi: "pencacahan",
    tingkat: "sedang",
    tipe: "angka",
    pertanyaan: "Dari 5 siswa dipilih 3 untuk jabatan ketua, sekretaris, bendahara. Berapa banyak susunan?",
    jawaban: "60",
    pembahasan: "5P3 = 5!/2! = 120/2 = 60."
  }
];

function getQuestions() {
  const stored = localStorage.getItem('rm_questions');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { return DEFAULT_QUESTIONS; }
  }
  return DEFAULT_QUESTIONS;
}

function saveQuestions(questions) {
  localStorage.setItem('rm_questions', JSON.stringify(questions));
}