/* ============================================================
   DATA CONTEXTUAL CHALLENGES
   2 tantangan per materi: Bunga Tunggal, Bunga Majemuk, Anuitas
   ============================================================ */

const DEFAULT_CHALLENGES = [
  /* ===== BUNGA TUNGGAL ===== */
  {
    id: "ch-bt-1",
    materi: "bunga-tunggal",
    judul: "Koperasi Sekolah",
    konteks: `Koperasi sekolahmu menawarkan pinjaman untuk siswa dengan bunga tunggal 1,5% per bulan. Rina ingin meminjam Rp1.200.000 untuk membeli laptop bekas dan berencana melunasi dalam 8 bulan.`,
    info: [
      "Pinjaman (M₀) = Rp1.200.000",
      "Bunga tunggal = 1,5% per bulan",
      "Lama pelunasan = 8 bulan"
    ],
    yangDitentukan: "Total bunga dan total yang harus dibayar Rina.",
    pertanyaanPrediksi: "Menurutmu, apakah total yang harus Rina bayar akan lebih besar atau lebih kecil dari Rp1.400.000? Berapa perkiraanmu?",
    prediksiPlaceholder: "Contoh: Saya perkirakan sekitar Rp1.350.000, karena 1,5% × 8 = 12% dari Rp1.200.000 ≈ Rp144.000.",
    strategiPlaceholder: "Tulis langkah-langkah yang akan kamu lakukan untuk menyelesaikan masalah ini...",
    jawabanBenar: "1344000",
    toleransi: 1000,
    alasanBenar: "Bunga = M₀ × i × n = 1.200.000 × 0,015 × 8 = Rp144.000. Total = 1.200.000 + 144.000 = Rp1.344.000.",
    refleksiPrompt: "Apa yang akan terjadi pada total bunga jika Rina memperpanjang pinjaman menjadi 12 bulan? Apakah total bayar akan naik 1,5× lipat atau lebih? Mengapa?"
  },
  {
    id: "ch-bt-2",
    materi: "bunga-tunggal",
    judul: "Tabungan Lebaran",
    konteks: `Bu Ani menabung di bank dengan bunga tunggal 4% per tahun. Setelah 2,5 tahun, tabungannya menjadi Rp5.500.000. Ia ingin tahu berapa tabungan awalnya.`,
    info: [
      "Bunga tunggal = 4% per tahun",
      "Lama menabung = 2,5 tahun",
      "Tabungan akhir (Mn) = Rp5.500.000"
    ],
    yangDitentukan: "Tabungan awal (M₀) Bu Ani.",
    pertanyaanPrediksi: "Apakah tabungan awalnya lebih besar atau lebih kecil dari Rp5.000.000? Mengapa?",
    prediksiPlaceholder: "Contoh: Saya perkirakan sekitar Rp5.000.000, karena bunga 4% × 2,5 = 10% dari Rp5.000.000 = Rp500.000.",
    strategiPlaceholder: "Tulis cara berpikirmu...",
    jawabanBenar: "5000000",
    toleransi: 1000,
    alasanBenar: "Mn = M₀(1 + i·n) → 5.500.000 = M₀(1 + 0,04 × 2,5) = M₀ × 1,1 → M₀ = Rp5.000.000.",
    refleksiPrompt: "Jika Bu Ani menabung selama 5 tahun (bukan 2,5 tahun) dengan tabungan akhir yang sama, apakah tabungan awalnya lebih besar atau lebih kecil? Mengapa?"
  },

  /* ===== BUNGA MAJEMUK ===== */
  {
    id: "ch-bm-1",
    materi: "bunga-majemuk",
    judul: "Dana Pendidikan Anak",
    konteks: `Pak Dedi ingin menyiapkan dana pendidikan anaknya. Ia menabung Rp10.000.000 di deposito dengan bunga majemuk 8% per tahun. Ia berencana mengambil tabungan setelah 5 tahun.`,
    info: [
      "Modal awal (M₀) = Rp10.000.000",
      "Bunga majemuk = 8% per tahun",
      "Lama = 5 tahun"
    ],
    yangDitentukan: "Total tabungan Pak Dedi setelah 5 tahun dan besar bunganya.",
    pertanyaanPrediksi: "Menurutmu, apakah hasilnya akan lebih dari Rp14.000.000? Berapa perkiraanmu?",
    prediksiPlaceholder: "Contoh: Saya perkirakan sekitar Rp14.700.000, karena 8% × 5 = 40% dari Rp10.000.000 = Rp4.000.000, plus efek bunga berbunga.",
    strategiPlaceholder: "Tulis langkah perhitungan yang akan kamu lakukan...",
    jawabanBenar: "14693280",
    toleransi: 10000,
    alasanBenar: "Mn = M₀(1 + i)ⁿ = 10.000.000 × (1,08)⁵ = 10.000.000 × 1,469328 = Rp14.693.280. Bunga = Rp4.693.280.",
    refleksiPrompt: "Bandingkan dengan bunga tunggal 8% selama 5 tahun. Berapa selisihnya? Mengapa selisih itu muncul? Apa peran 'waktu' dalam compounding?"
  },
  {
    id: "ch-bm-2",
    materi: "bunga-majemuk",
    judul: "Investasi Saham",
    konteks: `Bu Sari berinvestasi Rp2.000.000 di reksa dana dengan return rata-rata 12% per tahun (diasumsikan berbunga majemuk). Ia ingin tahu berapa lama waktu yang dibutuhkan agar investasinya menjadi Rp4.000.000 (dua kali lipat).`,
    info: [
      "Modal awal = Rp2.000.000",
      "Return = 12% per tahun (majemuk)",
      "Target = Rp4.000.000"
    ],
    yangDitentukan: "Berapa tahun yang dibutuhkan agar investasi menjadi 2× lipat.",
    pertanyaanPrediksi: "Menurutmu, butuh berapa tahun? 5 tahun? 10 tahun? Lebih?",
    prediksiPlaceholder: "Contoh: Saya perkirakan sekitar 6 tahun, karena 12% × 6 = 72% dari modal awal, tapi dengan bunga berbunga mungkin lebih cepat.",
    strategiPlaceholder: "Tulis langkah penyelesaianmu. Gunakan rumus n = log(Mn/M₀) / log(1+i)...",
    jawabanBenar: "6.12",
    toleransi: 0.2,
    alasanBenar: "4.000.000 = 2.000.000 × (1,12)ⁿ → 2 = (1,12)ⁿ → n = log(2)/log(1,12) ≈ 6,12 tahun. Jadi sekitar 6 tahun 1-2 bulan.",
    refleksiPrompt: "Mengapa jawabannya bukan 8,33 tahun (yang merupakan 100%/12%)? Apa perbedaan antara 'bunga sederhana' dan 'bunga berbunga' yang membuat waktu lebih singkat?"
  },

  /* ===== ANUITAS ===== */
  {
    id: "ch-an-1",
    materi: "anuitas",
    judul: "KPR Rumah Impian",
    konteks: `Pak Andi ingin membeli rumah seharga Rp350.000.000 dengan KPR. Bank menetapkan bunga 9% per tahun dan tenor 15 tahun. Pak Andi ingin tahu berapa cicilan bulanannya dan total yang ia bayarkan.`,
    info: [
      "Pinjaman (M₀) = Rp350.000.000",
      "Bunga = 9% per tahun = 0,75% per bulan",
      "Tenor = 15 tahun = 180 bulan"
    ],
    yangDitentukan: "Cicilan bulanan (anuitas) dan total pembayaran Pak Andi.",
    pertanyaanPrediksi: "Menurutmu, berapa cicilan bulanan Pak Andi? Lebih dari Rp3.000.000 atau kurang?",
    prediksiPlaceholder: "Contoh: Saya perkirakan sekitar Rp3.500.000, karena Rp350.000.000 / 180 ≈ Rp1.944.444 (pokok), plus bunga mungkin jadi Rp3.500.000.",
    strategiPlaceholder: "Tulis langkah perhitungan menggunakan rumus anuitas...",
    jawabanBenar: "3550400",
    toleransi: 50000,
    alasanBenar: "i = 0,75% = 0,0075. n = 180. A = 350.000.000 × [0,0075 / (1 − (1,0075)⁻¹⁸⁰)] ≈ Rp3.550.400. Total bayar = 3.550.400 × 180 ≈ Rp639.072.000.",
    refleksiPrompt: "Total yang dibayar Pak Andi hampir 2× harga rumah. Mengapa? Apakah ini berarti bank 'curang'? Jelaskan dengan konsep bunga dan waktu."
  },
  {
    id: "ch-an-2",
    materi: "anuitas",
    judul: "Kredit Motor",
    konteks: `Bu Rina ingin membeli motor seharga Rp24.000.000 secara kredit. Dealer menawarkan dua opsi:

Opsi A: DP Rp4.000.000, sisa Rp20.000.000 dengan bunga 12% per tahun, tenor 3 tahun.
Opsi B: DP Rp8.000.000, sisa Rp16.000.000 dengan bunga 10% per tahun, tenor 3 tahun.

Bantu Bu Rina memilih opsi yang lebih menguntungkan.`,
    info: [
      "Opsi A: M₀ = Rp20.000.000, i = 12%/tahun, n = 3 tahun",
      "Opsi B: M₀ = Rp16.000.000, i = 10%/tahun, n = 3 tahun"
    ],
    yangDitentukan: "Total pembayaran (DP + total cicilan) untuk masing-masing opsi, dan opsi mana yang lebih murah.",
    pertanyaanPrediksi: "Menurutmu, opsi mana yang lebih murah? Opsi dengan DP lebih besar atau lebih kecil? Mengapa?",
    prediksiPlaceholder: "Contoh: Saya perkirakan Opsi B lebih murah, karena meskipun DP-nya lebih besar, bunganya lebih rendah dan pinjamannya lebih kecil.",
    strategiPlaceholder: "Hitung anuitas tahunan untuk masing-masing opsi, lalu total keseluruhan...",
    jawabanBenar: "A",
    toleransi: 0,
    alasanBenar: "Opsi A: A = 20.000.000 × [0,12/(1−(1,12)⁻³)] ≈ Rp8.326.000/tahun. Total = 4.000.000 + 3×8.326.000 = Rp28.978.000. Opsi B: A = 16.000.000 × [0,10/(1−(1,10)⁻³)] ≈ Rp6.434.000/tahun. Total = 8.000.000 + 3×6.434.000 = Rp27.302.000. Opsi B lebih murah sekitar Rp1.676.000.",
    refleksiPrompt: "Jika Bu Rina hanya punya DP Rp4.000.000, apakah Opsi A tetap pilihan terbaik? Faktor apa saja yang perlu dipertimbangkan selain total pembayaran?"
  }
];

function getChallenges() {
  const stored = localStorage.getItem('ms_challenges');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) { /* fallback */ }
  }
  return DEFAULT_CHALLENGES;
}

function getChallengeById(id) {
  return getChallenges().find(c => c.id === id) || null;
}