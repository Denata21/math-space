/* ============================================================
   DATA MATERI
   Struktur: id, judul, kategori, deskripsi, tujuan, isi,
             rumus[], contoh, pembahasan
   ============================================================ */

const DEFAULT_MATERIALS = [
  {
    id: "anuitas",
    judul: "Anuitas",
    kategori: "Matematika Keuangan",
    deskripsi: "Pelajari konsep anuitas, pembayaran berkala, bunga, angsuran pokok, dan tabel pelunasan.",
    tujuan: [
      "Menjelaskan konsep anuitas dan penerapannya dalam pinjaman.",
      "Menghitung besar pembayaran (angsuran) berkala.",
      "Menentukan besar bunga pada setiap periode.",
      "Menentukan besar angsuran pokok pada setiap periode.",
      "Menyusun tabel pelunasan pinjaman."
    ],
    isi: `Anuitas adalah sejumlah pembayaran yang sama besarnya, yang dibayarkan setiap akhir periode (bulan/tahun) secara berturut-turut. Pembayaran anuitas terdiri atas dua komponen: angsuran pokok dan bunga.

Pada sistem pinjaman dengan anuitas, besar total pembayaran setiap periode selalu sama, tetapi komposisi bunga dan angsuran pokoknya berubah. Semakin lama, porsi bunga semakin kecil dan porsi angsuran pokok semakin besar.

Rumus dasar anuitas untuk pinjaman sebesar M dengan suku bunga per periode i dan jumlah periode n adalah sebagai berikut.`,
    rumus: [
      "A = M × [ i / (1 − (1+i)^(−n)) ]",
      "Bunga periode ke-k = i × Sisa pinjaman awal periode ke-k",
      "Angsuran Pokok ke-k = A − Bunga ke-k",
      "Sisa pinjaman akhir = Sisa awal − Angsuran pokok"
    ],
    contoh: `Pak Budi meminjam uang sebesar Rp20.000.000 dengan suku bunga 10% per tahun dan akan dilunasi dengan anuitas tahunan selama 3 tahun. Tentukan besar anuitasnya.

Diketahui:
M = Rp20.000.000
i = 10% = 0,10 per tahun
n = 3 tahun`,
    pembahasan: `A = M × [ i / (1 − (1+i)^(−n)) ]
A = 20.000.000 × [ 0,10 / (1 − (1,10)^(−3)) ]
A = 20.000.000 × [ 0,10 / (1 − 0,751315) ]
A = 20.000.000 × [ 0,10 / 0,248685 ]
A = 20.000.000 × 0,402115
A ≈ Rp8.042.300

Jadi, besar anuitas tahunan Pak Budi adalah sekitar Rp8.042.300.`
  },
  {
    id: "kesebangunan",
    judul: "Kesebangunan",
    kategori: "Geometri",
    deskripsi: "Pelajari konsep kesebangunan dan penerapannya.",
    tujuan: [
      "Menjelaskan syarat dua bangun sebangun.",
      "Menentukan panjang sisi yang belum diketahui pada bangun sebangun.",
      "Menerapkan konsep kesebangunan pada masalah nyata."
    ],
    isi: `Dua bangun datar dikatakan sebangun jika memenuhi dua syarat: (1) sudut-sudut yang bersesuaian sama besar, dan (2) sisi-sisi yang bersesuaian memiliki perbandingan yang sama (senilai).

Konsep kesebangunan banyak digunakan dalam pengukuran tidak langsung, seperti mengukur tinggi pohon, lebar sungai, atau tinggi gedung dengan bantuan bayangan.`,
    rumus: [
      "Sisi bersesuaian: AB/PQ = BC/QR = AC/PR",
      "Sudut bersesuaian: ∠A = ∠P, ∠B = ∠Q, ∠C = ∠R"
    ],
    contoh: `Sebuah tiang setinggi 2 m memiliki bayangan 3 m. Pada saat yang sama, sebuah pohon memiliki bayangan 12 m. Berapa tinggi pohon tersebut?`,
    pembahasan: `Karena segitiga yang terbentuk sebangun, maka:
tinggi tiang / bayangan tiang = tinggi pohon / bayangan pohon
2 / 3 = t / 12
t = (2 × 12) / 3 = 8

Jadi, tinggi pohon tersebut adalah 8 meter.`
  },
  {
    id: "statistika",
    judul: "Statistika",
    kategori: "Statistika",
    deskripsi: "Pelajari mean, median, modus, kuartil, dan penyajian data.",
    tujuan: [
      "Menghitung mean, median, dan modus data tunggal maupun berkelompok.",
      "Menentukan kuartil dan jangkauan data.",
      "Menyajikan data dalam tabel dan diagram."
    ],
    isi: `Statistika adalah ilmu yang mempelajari cara mengumpulkan, menyajikan, menganalisis, dan menafsirkan data. Ukuran pemusatan data yang utama adalah mean (rata-rata), median (nilai tengah), dan modus (nilai yang paling sering muncul).

Ukuran penyebaran data meliputi jangkauan, kuartil, dan simpangan. Penyajian data dapat dilakukan melalui tabel, diagram batang, diagram garis, atau diagram lingkaran.`,
    rumus: [
      "Mean = (jumlah semua data) / (banyak data)",
      "Median = nilai tengah setelah data diurutkan",
      "Modus = nilai yang paling sering muncul",
      "Q1, Q2, Q3 = kuartil pertama, kedua, ketiga"
    ],
    contoh: `Diberikan data nilai ulangan: 7, 8, 6, 8, 9, 7, 8, 5. Tentukan mean, median, dan modusnya.`,
    pembahasan: `Urutkan data: 5, 6, 7, 7, 8, 8, 8, 9
Mean = (5+6+7+7+8+8+8+9) / 8 = 58 / 8 = 7,25
Median = (7 + 8) / 2 = 7,5
Modus = 8 (muncul 3 kali)

Jadi, mean = 7,25; median = 7,5; modus = 8.`
  },
  {
    id: "pencacahan",
    judul: "Pencacahan",
    kategori: "Kombinatorika",
    deskripsi: "Pelajari permutasi, kombinasi, dan berbagai prinsip pencacahan.",
    tujuan: [
      "Menjelaskan aturan perkalian dan penjumlahan.",
      "Menghitung permutasi dan kombinasi.",
      "Menerapkan prinsip pencacahan pada masalah nyata."
    ],
    isi: `Pencacahan (counting) adalah cara menghitung banyaknya kemungkinan susunan atau pilihan yang dapat terjadi. Prinsip dasar yang digunakan adalah aturan perkalian dan aturan penjumlahan.

Permutasi memperhatikan urutan, sedangkan kombinasi tidak memperhatikan urutan. Notasi faktorial (n!) sangat membantu dalam perhitungan permutasi dan kombinasi.`,
    rumus: [
      "Aturan perkalian: jika ada m cara dan n cara, total = m × n",
      "Permutasi: nPr = n! / (n−r)!",
      "Kombinasi: nCr = n! / (r! (n−r)!)",
      "Permutasi unsur sama: n! / (n1! n2! ...)"
    ],
    contoh: `Dari 5 siswa akan dipilih 3 siswa untuk menjadi ketua, sekretaris, dan bendahara. Berapa banyak susunan yang mungkin?`,
    pembahasan: `Karena urutan jabatan diperhatikan, gunakan permutasi:
5P3 = 5! / (5−3)! = 5! / 2! = (5×4×3×2×1) / (2×1) = 60

Jadi, ada 60 susunan yang mungkin.`
  }
];

/* Ambil materi dari localStorage jika ada, jika tidak gunakan default */
function getMaterials() {
  const stored = localStorage.getItem('rm_materials');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { return DEFAULT_MATERIALS; }
  }
  return DEFAULT_MATERIALS;
}

function saveMaterials(materials) {
  localStorage.setItem('rm_materials', JSON.stringify(materials));
}