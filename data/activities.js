/* ============================================================
   DATA AKTIVITAS — Math Explorer & Math Detective
   Master prompt §4.C dan §4.D
   ============================================================ */

const DEFAULT_EXPLORERS = [
  {
    id: "exp-bunga-tunggal",
    materi: "bunga-tunggal",
    judul: "Menyelidiki Pertumbuhan Linear",
    konteks: "Kamu punya tabungan awal Rp10.000.000 dengan bunga tunggal. Bagaimana total tabunganmu berubah jika suku bunga dan lama menabung diubah?",
    variabel: [
      { kode: "M0", label: "Modal Awal (Rp)", min: 1000000, max: 50000000, step: 1000000, default: 10000000 },
      { kode: "i",  label: "Suku Bunga (%/tahun)", min: 1, max: 20, step: 0.5, default: 5 },
      { kode: "n",  label: "Lama (tahun)", min: 1, max: 20, step: 1, default: 5 }
    ],
    hitung: function(params) {
      const { M0, i, n } = params;
      const iDesimal = i / 100;
      const bunga = M0 * iDesimal * n;
      const Mn = M0 + bunga;
      return { bunga, Mn };
    },
    pertanyaan: [
      "Jika lama menabung digandakan (n → 2n), apakah total bunga juga digandakan? Mengapa?",
      "Apa yang terjadi pada modal akhir jika suku bunga dinaikkan 2×?",
      "Mengapa grafik modal akhir terhadap waktu berbentuk garis lurus, bukan melengkung?"
    ],
    catatan: "Amati: setiap kenaikan 1 tahun menambah bunga dengan jumlah yang SAMA. Inilah ciri pertumbuhan linear."
  },
  {
    id: "exp-bunga-majemuk",
    materi: "bunga-majemuk",
    judul: "Menyelidiki Kekuatan Compounding",
    konteks: "Kamu menabung Rp10.000.000 dengan bunga majemuk. Bandingkan hasilnya dengan bunga tunggal pada modal dan suku bunga yang sama.",
    variabel: [
      { kode: "M0", label: "Modal Awal (Rp)", min: 1000000, max: 50000000, step: 1000000, default: 10000000 },
      { kode: "i",  label: "Suku Bunga (%/tahun)", min: 1, max: 20, step: 0.5, default: 5 },
      { kode: "n",  label: "Lama (tahun)", min: 1, max: 30, step: 1, default: 10 }
    ],
    hitung: function(params) {
      const { M0, i, n } = params;
      const iDesimal = i / 100;
      const MnMajemuk = M0 * Math.pow(1 + iDesimal, n);
      const MnTunggal = M0 * (1 + iDesimal * n);
      const selisih = MnMajemuk - MnTunggal;
      return { MnMajemuk, MnTunggal, selisih };
    },
    pertanyaan: [
      "Pada tahun ke berapa selisih bunga majemuk vs tunggal mulai terlihat signifikan?",
      "Jika suku bunga dinaikkan dari 5% ke 10%, apakah selisihnya bertambah 2×, lebih, atau kurang?",
      "Mengapa grafik bunga majemuk melengkung ke atas (eksponensial), sedangkan bunga tunggal lurus?"
    ],
    catatan: "Perhatikan: di awal, keduanya hampir sama. Tapi semakin lama, jurang pemisahnya melebar dengan cepat."
  },
  {
    id: "exp-anuitas",
    materi: "anuitas",
    judul: "Menyelidiki Komposisi Anuitas",
    konteks: "Kamu meminjam uang dan melunasinya dengan anuitas. Amati bagaimana porsi bunga dan angsuran pokok berubah di setiap periode.",
    variabel: [
      { kode: "M0", label: "Pinjaman (Rp)", min: 5000000, max: 100000000, step: 5000000, default: 20000000 },
      { kode: "i",  label: "Suku Bunga (%/tahun)", min: 3, max: 18, step: 0.5, default: 10 },
      { kode: "n",  label: "Lama (tahun)", min: 1, max: 15, step: 1, default: 3 }
    ],
    hitung: function(params) {
      const { M0, i, n } = params;
      const iDesimal = i / 100;
      const A = M0 * iDesimal / (1 - Math.pow(1 + iDesimal, -n));

      const tabel = [];
      let sisa = M0;
      for (let k = 1; k <= n; k++) {
        const bunga = sisa * iDesimal;
        let pokok = A - bunga;
        let sisaAkhir = sisa - pokok;
        if (k === n || sisaAkhir < 0.01) {
          pokok = sisa;
          sisaAkhir = 0;
        }
        tabel.push({ periode: k, sisaAwal: sisa, bunga, pokok, sisaAkhir });
        sisa = sisaAkhir;
        if (sisa <= 0.01) break;
      }

      const totalBayar = A * n;
      const totalBunga = totalBayar - M0;
      return { A, tabel, totalBayar, totalBunga };
    },
    pertanyaan: [
      "Pada periode pertama, berapa persen dari pembayaran yang habis untuk bunga?",
      "Pada periode terakhir, berapa persen yang habis untuk bunga?",
      "Mengapa porsi bunga menurun seiring waktu, padahal pembayaran tetap?",
      "Jika suku bunga dinaikkan, apa yang terjadi pada total bunga? Apakah sebanding?"
    ],
    catatan: "Fokus pada perubahan komposisi, bukan hanya nilai A. Inilah esensi anuitas."
  }
];

const DEFAULT_DETECTIVES = [
  {
    id: "det-bunga-tunggal",
    materi: "bunga-tunggal",
    judul: "Investigasi: Bunga 2 Tahun = 2× Bunga 1 Tahun?",
    skenario: `Seorang siswa bernama Rina menabung Rp2.000.000 dengan bunga tunggal 8% per tahun. Ia berpendapat:

"Kalau menabung 1 tahun dapat bunga Rp160.000, maka menabung 2 tahun dapat bunga Rp320.000. Jadi menabung 4 tahun dapat bunga Rp640.000."

Pernyataan Rina: Benar atau salah? Periksa dengan perhitungan, lalu jelaskan alasannya.`,
    pertanyaanPemandu: [
      "Hitung bunga untuk n = 1, 2, dan 4 tahun menggunakan rumus bunga tunggal.",
      "Apakah hasilnya menunjukkan pola kelipatan yang sama?",
      "Mengapa hubungan ini berlaku untuk bunga tunggal, tapi TIDAK berlaku untuk bunga majemuk?"
    ],
    jawabanBenar: "Benar",
    jawabanDetail: "Benar, untuk bunga tunggal. Karena bunga selalu dihitung dari modal awal yang sama, maka b = M₀ × i × n. Jika n digandakan, b juga digandakan. Ini adalah ciri khas pertumbuhan linear. (Catatan: pada bunga majemuk, pernyataan ini SALAH, karena bunga berbunga.)",
    toleransi: 0
  },
  {
    id: "det-bunga-majemuk",
    materi: "bunga-majemuk",
    judul: "Investigasi: Kesalahan Menggunakan Rumus Tunggal",
    skenario: `Seorang siswa mengerjakan soal:

"Bu Ani menabung Rp5.000.000 dengan bunga MAJEMUK 10% per tahun selama 3 tahun. Berapa total tabungannya?"

Jawaban siswa:
Mn = 5.000.000 × (1 + 0,10 × 3)
Mn = 5.000.000 × 1,30
Mn = Rp6.500.000

Periksa: apakah jawaban ini benar? Jika salah, di mana letak kesalahannya, dan berapa jawaban yang seharusnya?`,
    pertanyaanPemandu: [
      "Rumus apa yang dipakai siswa? Apakah itu rumus bunga majemuk atau bunga tunggal?",
      "Hitung jawaban yang benar menggunakan rumus bunga majemuk.",
      "Berapa selisihnya? Mengapa selisih itu muncul?"
    ],
    jawabanBenar: "6500000",
    jawabanDetail: "Jawaban siswa SALAH. Ia memakai rumus bunga TUNGGAL, padahal soal menyebut bunga MAJEMUK. Jawaban benar: Mn = 5.000.000 × (1,10)³ = 5.000.000 × 1,331 = Rp6.655.000. Selisih Rp155.000 adalah bunga yang seharusnya diperoleh dari 'bunga yang berbunga' di tahun ke-2 dan ke-3.",
    toleransi: 1000
  },
  {
    id: "det-anuitas",
    materi: "anuitas",
    judul: "Investigasi: Mengapa Porsi Bunga Berubah?",
    skenario: `Dua siswa berdebat tentang anuitas:

Siswa A: "Karena anuitas itu pembayaran tetap, berarti setiap bulan kita bayar bunga yang sama dan pokok yang sama. Adil, kan?"

Siswa B: "Tidak. Porsinya berubah. Di awal kita banyak bayar bunga, di akhir banyak bayar pokok."

Siapa yang benar? Buktikan dengan tabel pelunasan pinjaman Rp12.000.000, bunga 12% per tahun, anuitas bulanan 12 bulan.`,
    pertanyaanPemandu: [
      "Hitung besar anuitas bulanan terlebih dahulu.",
      "Susun tabel: untuk bulan ke-1 dan ke-12, berapa porsi bunga dan pokok?",
      "Apakah porsi bunga di bulan ke-1 dan ke-12 sama? Mengapa?",
      "Apa yang menyebabkan perbedaan ini?"
    ],
    jawabanBenar: "B",
    jawabanDetail: "Siswa B benar. Porsi bunga dihitung dari SISA pinjaman. Karena sisa pinjaman menurun setiap bulan, bunga bulan berikutnya juga menurun. Karena total anuitas tetap, penurunan bunga berarti kenaikan porsi pokok. Inilah ciri khas anuitas: total tetap, komposisi berubah.",
    toleransi: 0
  }
];

function getExplorers() {
  const stored = localStorage.getItem('ms_explorers');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) { /* fallback */ }
  }
  return DEFAULT_EXPLORERS;
}

function getDetectives() {
  const stored = localStorage.getItem('ms_detectives');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) { /* fallback */ }
  }
  return DEFAULT_DETECTIVES;
}

function getExplorerById(id) {
  return getExplorers().find(e => e.id === id) || null;
}

function getDetectiveById(id) {
  return getDetectives().find(d => d.id === id) || null;
}