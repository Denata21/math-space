/* ============================================================
   DATA MATERI — 3 MATERI INTI
   Bunga Tunggal, Bunga Majemuk, Anuitas
   ============================================================ */

const DEFAULT_MATERIALS = [
  {
    id: "bunga-tunggal",
    judul: "Bunga Tunggal",
    kategori: "Matematika Keuangan",
    deskripsi: "Bunga yang dihitung hanya dari modal awal, tidak berbunga lagi. Fondasi untuk memahami bunga majemuk.",
    tujuan: [
      "Menjelaskan konsep bunga tunggal dan membedakannya dari bunga majemuk.",
      "Menghitung bunga dan modal akhir dengan rumus bunga tunggal.",
      "Menginvestigasi hubungan antara suku bunga, waktu, dan besar bunga.",
      "Menyelesaikan masalah kontekstual terkait pinjaman/tabungan bunga tunggal."
    ],
    isi: `Bunga tunggal adalah bunga yang dihitung hanya berdasarkan modal awal (pokok), tidak berdasarkan saldo yang sudah bertambah.

Artinya, besar bunga setiap periode selalu sama, karena dasar perhitungannya tidak berubah. Jika kamu menabung Rp1.000.000 dengan bunga tunggal 10% per tahun, maka setiap tahun kamu mendapat bunga Rp100.000 — tidak pernah bertambah.

Konsep ini menjadi fondasi penting sebelum mempelajari bunga majemuk, karena perbedaan keduanya terletak pada "apa yang menjadi dasar perhitungan bunga". Pada bunga tunggal, dasarnya tetap modal awal. Pada bunga majemuk, dasarnya adalah saldo terkini.`,
    rumus: [
      "Bunga: b = M₀ × i × n",
      "Modal akhir: Mn = M₀ + b = M₀ (1 + i·n)",
      "Suku bunga: i = b / (M₀ × n)",
      "Lama periode: n = b / (M₀ × i)"
    ],
    contoh: `Pak Ahmad menabung Rp5.000.000 di bank dengan bunga tunggal 6% per tahun. Berapa total tabungannya setelah 4 tahun?`,
    pembahasan: `Diketahui:
M₀ = Rp5.000.000
i = 6% = 0,06 per tahun
n = 4 tahun

Bunga:
b = M₀ × i × n
b = 5.000.000 × 0,06 × 4
b = Rp1.200.000

Modal akhir:
Mn = M₀ + b = 5.000.000 + 1.200.000 = Rp6.200.000

Jadi, total tabungan Pak Ahmad setelah 4 tahun adalah Rp6.200.000.`,
    explorerId: "exp-bunga-tunggal",
    detectiveId: "det-bunga-tunggal",
    challengeIds: ["ch-bt-1", "ch-bt-2"]
  },
  {
    id: "bunga-majemuk",
    judul: "Bunga Majemuk",
    kategori: "Matematika Keuangan",
    deskripsi: "Bunga berbunga: bunga dihitung dari saldo terkini, sehingga pertumbuhan bersifat eksponensial.",
    tujuan: [
      "Menjelaskan konsep compounding (bunga berbunga).",
      "Menghitung modal akhir dengan rumus bunga majemuk.",
      "Membandingkan pertumbuhan bunga tunggal vs bunga majemuk.",
      "Menyelesaikan masalah kontekstual terkait investasi/tabungan jangka panjang."
    ],
    isi: `Bunga majemuk dihitung berdasarkan saldo terkini (modal + bunga yang sudah terakumulasi). Inilah dasar sistem keuangan modern: tabungan, deposito, kredit, dan investasi.

Perbedaannya dengan bunga tunggal sangat penting: pada bunga tunggal, bunga tidak pernah "berbunga". Pada bunga majemuk, bunga yang diperoleh ikut menghasilkan bunga pada periode berikutnya. Efeknya, pertumbuhan saldo bersifat eksponensial, bukan linear.

Semakin lama periode dan semakin besar suku bunga, semakin dramatis perbedaan antara bunga tunggal dan bunga majemuk. Inilah sebabnya waktu menjadi faktor krusial dalam investasi.`,
    rumus: [
      "Modal akhir: Mn = M₀ (1 + i)ⁿ",
      "Bunga total: b = Mn − M₀",
      "Modal awal: M₀ = Mn / (1 + i)ⁿ",
      "Suku bunga: i = (Mn/M₀)^(1/n) − 1",
      "Lama periode: n = log(Mn/M₀) / log(1 + i)"
    ],
    contoh: `Bu Sari menabung Rp5.000.000 dengan bunga majemuk 6% per tahun. Berapa total tabungannya setelah 4 tahun?`,
    pembahasan: `Diketahui:
M₀ = Rp5.000.000
i = 6% = 0,06 per tahun
n = 4 tahun

Modal akhir:
Mn = M₀ (1 + i)ⁿ
Mn = 5.000.000 × (1 + 0,06)⁴
Mn = 5.000.000 × (1,06)⁴
Mn = 5.000.000 × 1,262477
Mn ≈ Rp6.312.385

Jadi, total tabungan Bu Sari setelah 4 tahun sekitar Rp6.312.385.

Bandingkan dengan bunga tunggal pada soal sebelumnya: Rp6.200.000. Selisih Rp112.385 adalah efek "bunga berbunga".`,
    explorerId: "exp-bunga-majemuk",
    detectiveId: "det-bunga-majemuk",
    challengeIds: ["ch-bm-1", "ch-bm-2"]
  },
  {
    id: "anuitas",
    judul: "Anuitas",
    kategori: "Matematika Keuangan",
    deskripsi: "Pembayaran berkala dengan jumlah tetap untuk melunasi pinjaman. Terdiri atas bunga dan angsuran pokok.",
    tujuan: [
      "Menjelaskan konsep anuitas dan komponennya (bunga + angsuran pokok).",
      "Menghitung besar anuitas dari pinjaman, suku bunga, dan lama periode.",
      "Menyusun tabel pelunasan pinjaman.",
      "Menginvestigasi mengapa porsi bunga menurun dan porsi pokok meningkat tiap periode.",
      "Menyelesaikan masalah kontekstual terkait KPR, kredit motor, atau pinjaman usaha."
    ],
    isi: `Anuitas adalah pembayaran tetap setiap periode untuk melunasi pinjaman. Setiap pembayaran terdiri atas dua komponen: bunga (dihitung dari sisa pinjaman) dan angsuran pokok (mengurangi sisa pinjaman).

Yang membuat anuitas menarik secara matematis: total pembayaran selalu sama, tetapi komposisinya berubah. Di awal, sebagian besar pembayaran habis untuk bunga karena sisa pinjaman masih besar. Seiring waktu, porsi bunga mengecil dan porsi angsuran pokok membesar.

Inilah sebabnya anuitas menjadi sistem standar untuk KPR, kredit kendaraan, dan pinjaman usaha: pembayaran tetap memudahkan perencanaan keuangan, sementara komposisi internalnya menyesuaikan sisa pinjaman.`,
    rumus: [
      "Anuitas: A = M₀ · i / (1 − (1+i)⁻ⁿ)",
      "Bunga periode ke-k: Bk = i × sisa awal periode ke-k",
      "Angsuran pokok ke-k: Pk = A − Bk",
      "Sisa akhir periode ke-k: Sisa_k = Sisa_{k-1} − Pk",
      "Pinjaman awal: M₀ = A (1 − (1+i)⁻ⁿ) / i"
    ],
    contoh: `Pak Budi meminjam Rp20.000.000 dengan suku bunga 10% per tahun, dilunasi dengan anuitas tahunan selama 3 tahun. Tentukan besar anuitasnya.`,
    pembahasan: `Diketahui:
M₀ = Rp20.000.000
i = 10% = 0,10 per tahun
n = 3 tahun

A = M₀ × [i / (1 − (1+i)⁻ⁿ)]
A = 20.000.000 × [0,10 / (1 − (1,10)⁻³)]
A = 20.000.000 × [0,10 / (1 − 0,751315)]
A = 20.000.000 × [0,10 / 0,248685]
A = 20.000.000 × 0,402115
A ≈ Rp8.042.300

Jadi, besar anuitas tahunan Pak Budi sekitar Rp8.042.300.`,
    explorerId: "exp-anuitas",
    detectiveId: "det-anuitas",
    challengeIds: ["ch-an-1", "ch-an-2"]
  }
];

function getMaterials() {
  const stored = localStorage.getItem('ms_materials');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) { /* fallback */ }
  }
  return DEFAULT_MATERIALS;
}

function saveMaterials(materials) {
  localStorage.setItem('ms_materials', JSON.stringify(materials));
}

function getMaterialById(id) {
  return getMaterials().find(m => m.id === id) || null;
}