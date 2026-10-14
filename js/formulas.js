/* ============================================================
   DEFINISI RUMUS — SEMUA MATERI
   - Setiap tab: variabel, rumus, validasi konsistensi, teori
   - Rumus dievaluasi oleh formula-engine.js
   ============================================================ */

const FORMULAS = {

  /* ============================================================
     1. BUNGA TUNGGAL
     ============================================================ */
  "bunga-tunggal": {
    judul: "Bunga Tunggal",
    deskripsi: "Bunga dihitung dari modal awal saja (tidak berbunga lagi).",
    teori: `Bunga tunggal adalah bunga yang dihitung hanya berdasarkan modal awal (pokok), 
tidak berdasarkan saldo yang sudah bertambah.

Konsep kunci:
• Bunga (b) = M₀ × i × n
• Modal akhir (Mn) = M₀ + b = M₀ (1 + i·n)
• i = suku bunga per periode (desimal)
• n = jumlah periode`,
    variabel: [
      { kode: "M0", label: "Modal Awal",   satuan: "Rp" },
      { kode: "Mn", label: "Modal Akhir",  satuan: "Rp" },
      { kode: "i",  label: "Suku Bunga",   satuan: "%"  },
      { kode: "n",  label: "Lama Periode", satuan: "periode" },
      { kode: "b",  label: "Bunga",        satuan: "Rp" }
    ],
    rumus: [
      { target: "b",  ekspresi: "M0 * i * n" },
      { target: "Mn", ekspresi: "M0 + b" },
      { target: "i",  ekspresi: "b / (M0 * n)" },
      { target: "n",  ekspresi: "b / (M0 * i)" },
      { target: "b",  ekspresi: "Mn - M0" },
      { target: "M0", ekspresi: "Mn - b" },
      { target: "i",  ekspresi: "(Mn - M0) / (M0 * n)" },
      { target: "n",  ekspresi: "(Mn - M0) / (M0 * i)" },
      { target: "M0", ekspresi: "Mn / (1 + i * n)" }
    ],
    butuhTabel: false,
    validasi: function(input) {
      const err = [];
      const M0 = parseFloat(input.M0);
      const Mn = parseFloat(input.Mn);
      const iRaw = parseFloat(input.i);
      const i = (!isNaN(iRaw)) ? iRaw / 100 : NaN;
      const n = parseFloat(input.n);
      const b = parseFloat(input.b);

      // Cek b vs M0·i·n
      if (!isNaN(b) && !isNaN(i) && !isNaN(M0) && !isNaN(n)) {
        const seharusnya = M0 * i * n;
        const selisih = Math.abs(b - seharusnya);
        const toleransi = Math.max(seharusnya * 0.01, 1);
        if (selisih > toleransi) {
          err.push({
            pesan: 'Nilai <strong>b (Bunga)</strong> tidak konsisten dengan <strong>M0, i, n</strong>.',
            detail: `Menurut M0 × i × n = ${formatAngkaEngine(seharusnya)}, tapi b = ${formatAngkaEngine(b)}.`,
            saran: 'Hapus <strong>b</strong> agar dihitung otomatis, atau perbaiki <strong>M0/i/n</strong>.'
          });
        }
      }

      // Cek Mn vs M0+b
      if (!isNaN(Mn) && !isNaN(M0) && !isNaN(b)) {
        const seharusnya = M0 + b;
        const selisih = Math.abs(Mn - seharusnya);
        const toleransi = Math.max(seharusnya * 0.01, 1);
        if (selisih > toleransi) {
          err.push({
            pesan: 'Nilai <strong>Mn (Modal Akhir)</strong> tidak konsisten dengan <strong>M0 + b</strong>.',
            detail: `M0 + b = ${formatAngkaEngine(seharusnya)}, tapi Mn = ${formatAngkaEngine(Mn)}.`
          });
        }
      }

      // Cek Mn vs M0(1+i·n)
      if (!isNaN(Mn) && !isNaN(M0) && !isNaN(i) && !isNaN(n)) {
        const seharusnya = M0 * (1 + i * n);
        const selisih = Math.abs(Mn - seharusnya);
        const toleransi = Math.max(seharusnya * 0.01, 1);
        if (selisih > toleransi) {
          err.push({
            pesan: 'Nilai <strong>Mn</strong> tidak konsisten dengan <strong>M0 × (1 + i × n)</strong>.',
            detail: `M0 × (1 + i × n) = ${formatAngkaEngine(seharusnya)}, tapi Mn = ${formatAngkaEngine(Mn)}.`
          });
        }
      }

      if (!isNaN(M0) && M0 < 0) err.push({ pesan: 'Modal awal tidak boleh negatif.' });
      if (!isNaN(b)  && b  < 0) err.push({ pesan: 'Bunga tidak boleh negatif.' });
      if (!isNaN(n)  && n  <= 0) err.push({ pesan: 'Lama periode harus > 0.' });

      return err;
    }
  },

  /* ============================================================
     2. BUNGA MAJEMUK
     ============================================================ */
  "bunga-majemuk": {
    judul: "Bunga Majemuk",
    deskripsi: "Bunga berbunga tiap periode (compounding).",
    teori: `Bunga majemuk dihitung berdasarkan saldo terkini (modal + bunga yang sudah terakumulasi). 
Dasar sistem keuangan modern: tabungan, deposito, kredit, investasi.

Konsep kunci:
• Mn = M₀ (1 + i)ⁿ
• Bunga total = Mn − M₀
• Bunga tumbuh eksponensial
• i = suku bunga per periode, n = jumlah periode`,
    variabel: [
      { kode: "M0", label: "Modal Awal",   satuan: "Rp" },
      { kode: "Mn", label: "Modal Akhir",  satuan: "Rp" },
      { kode: "i",  label: "Suku Bunga",   satuan: "%"  },
      { kode: "n",  label: "Lama Periode", satuan: "periode" },
      { kode: "b",  label: "Bunga Total",  satuan: "Rp" }
    ],
    rumus: [
      { target: "Mn", ekspresi: "M0 * pow(1 + i, n)" },
      { target: "b",  ekspresi: "Mn - M0" },
      { target: "M0", ekspresi: "Mn / pow(1 + i, n)" },
      { target: "i",  ekspresi: "pow(Mn / M0, 1/n) - 1" },
      { target: "n",  ekspresi: "log(Mn / M0) / log(1 + i)" },
      { target: "Mn", ekspresi: "M0 + b" },
      { target: "M0", ekspresi: "Mn - b" },
      { target: "M0", ekspresi: "b / (pow(1 + i, n) - 1)" }
    ],
    butuhTabel: false,
    validasi: function(input) {
      const err = [];
      const M0 = parseFloat(input.M0);
      const Mn = parseFloat(input.Mn);
      const iRaw = parseFloat(input.i);
      const i = (!isNaN(iRaw)) ? iRaw / 100 : NaN;
      const n = parseFloat(input.n);
      const b = parseFloat(input.b);

      if (!isNaN(Mn) && !isNaN(M0) && !isNaN(i) && !isNaN(n)) {
        const seharusnya = M0 * Math.pow(1 + i, n);
        const selisih = Math.abs(Mn - seharusnya);
        const toleransi = Math.max(seharusnya * 0.01, 1);
        if (selisih > toleransi) {
          err.push({
            pesan: 'Nilai <strong>Mn</strong> tidak konsisten dengan <strong>M0 × (1 + i)ⁿ</strong>.',
            detail: `M0 × (1 + i)ⁿ = ${formatAngkaEngine(seharusnya)}, tapi Mn = ${formatAngkaEngine(Mn)}.`,
            saran: 'Hapus <strong>Mn</strong> agar dihitung otomatis, atau perbaiki <strong>M0/i/n</strong>.'
          });
        }
      }

      if (!isNaN(b) && !isNaN(Mn) && !isNaN(M0)) {
        const seharusnya = Mn - M0;
        const selisih = Math.abs(b - seharusnya);
        const toleransi = Math.max(seharusnya * 0.01, 1);
        if (selisih > toleransi) {
          err.push({
            pesan: 'Nilai <strong>b (Bunga)</strong> tidak konsisten dengan <strong>Mn − M0</strong>.',
            detail: `Mn − M0 = ${formatAngkaEngine(seharusnya)}, tapi b = ${formatAngkaEngine(b)}.`
          });
        }
      }

      if (!isNaN(M0) && M0 <= 0) err.push({ pesan: 'Modal awal harus > 0.' });
      if (!isNaN(n)  && n  <= 0) err.push({ pesan: 'Lama periode harus > 0.' });
      if (!isNaN(i)  && i  <= -1) err.push({ pesan: 'Suku bunga tidak valid.' });

      return err;
    }
  },

  /* ============================================================
     3. ANUITAS
     ============================================================ */
  "anuitas": {
    judul: "Anuitas",
    deskripsi: "Pembayaran berkala dengan jumlah tetap, terdiri atas bunga dan angsuran pokok.",
    teori: `Anuitas adalah pembayaran tetap setiap periode untuk melunasi pinjaman.
Setiap pembayaran terdiri atas:
• Bunga (dihitung dari sisa pinjaman)
• Angsuran pokok (mengurangi sisa pinjaman)

Konsep kunci:
• A = M₀ · i / (1 − (1+i)⁻ⁿ)
• Bunga periode ke-k = i × sisa awal
• Angsuran pokok = A − bunga
• Seiring waktu: porsi bunga ↓, porsi pokok ↑`,
    variabel: [
      { kode: "M0", label: "Pinjaman Awal", satuan: "Rp" },
      { kode: "A",  label: "Anuitas",       satuan: "Rp" },
      { kode: "i",  label: "Suku Bunga",    satuan: "%"  },
      { kode: "n",  label: "Lama Periode",  satuan: "periode" }
    ],
    rumus: [
      { target: "A",  ekspresi: "M0 * i / (1 - pow(1 + i, -n))" },
      { target: "M0", ekspresi: "A * (1 - pow(1 + i, -n)) / i" },
      { target: "n",  ekspresi: "-log(1 - M0 * i / A) / log(1 + i)" },
      { target: "i",  ekspresi: "cariBungaAnuitas(M0, A, n)" }
    ],
    butuhTabel: true,
    validasi: function(input) {
      const err = [];
      const M0 = parseFloat(input.M0);
      const A  = parseFloat(input.A);
      const iRaw = parseFloat(input.i);
      const i = (!isNaN(iRaw)) ? iRaw / 100 : NaN;
      const n = parseFloat(input.n);

      if (!isNaN(A) && !isNaN(M0) && !isNaN(i) && !isNaN(n) && i > 0) {
        const seharusnya = M0 * i / (1 - Math.pow(1 + i, -n));
        const selisih = Math.abs(A - seharusnya);
        const toleransi = Math.max(seharusnya * 0.01, 1);
        if (selisih > toleransi) {
          err.push({
            pesan: 'Nilai <strong>A (Anuitas)</strong> tidak konsisten dengan <strong>M0, i, n</strong>.',
            detail: `Menurut rumus A = ${formatAngkaEngine(seharusnya)}, tapi A = ${formatAngkaEngine(A)}.`,
            saran: 'Hapus <strong>A</strong> agar dihitung otomatis, atau perbaiki <strong>M0/i/n</strong>.'
          });
        }
      }

      if (!isNaN(A) && !isNaN(M0) && !isNaN(i) && A <= M0 * i) {
        err.push({
          pesan: '<strong>A (Anuitas)</strong> terlalu kecil.',
          detail: `Anuitas harus > M0 × i = ${formatAngkaEngine(M0 * i)} agar pinjaman bisa lunas.`,
          saran: 'Perbesar nilai A, atau kecilkan i.'
        });
      }

      if (!isNaN(M0) && M0 <= 0) err.push({ pesan: 'Pinjaman harus > 0.' });
      if (!isNaN(A)  && A  <= 0) err.push({ pesan: 'Anuitas harus > 0.' });
      if (!isNaN(n)  && n  <= 0) err.push({ pesan: 'Lama periode harus > 0.' });

      return err;
    }
  },

  /* ============================================================
     4. KESEBANGUNAN
     ============================================================ */
  "kesebangunan": {
    judul: "Kesebangunan",
    deskripsi: "Mencari sisi/tinggi yang belum diketahui pada dua bangun sebangun.",
    teori: `Dua bangun datar dikatakan sebangun jika:
1. Sudut-sudut yang bersesuaian sama besar
2. Sisi-sisi yang bersesuaian memiliki perbandingan yang sama

Konsep kunci (perbandingan senilai):
• a/b = c/d
• Jika a/b = c/d, maka a·d = b·c (perkalian silang)`,
    variabel: [
      { kode: "a", label: "Sisi a (bangun 1)", satuan: "satuan" },
      { kode: "b", label: "Sisi b (bangun 1)", satuan: "satuan" },
      { kode: "c", label: "Sisi c (bangun 2)", satuan: "satuan" },
      { kode: "d", label: "Sisi d (bangun 2)", satuan: "satuan" }
    ],
    rumus: [
      { target: "a", ekspresi: "b * c / d" },
      { target: "b", ekspresi: "a * d / c" },
      { target: "c", ekspresi: "a * d / b" },
      { target: "d", ekspresi: "b * c / a" }
    ],
    butuhTabel: false,
    validasi: function(input) {
      const err = [];
      const a = parseFloat(input.a);
      const b = parseFloat(input.b);
      const c = parseFloat(input.c);
      const d = parseFloat(input.d);

      if (!isNaN(a) && a <= 0) err.push({ pesan: 'Sisi a harus > 0.' });
      if (!isNaN(b) && b <= 0) err.push({ pesan: 'Sisi b harus > 0.' });
      if (!isNaN(c) && c <= 0) err.push({ pesan: 'Sisi c harus > 0.' });
      if (!isNaN(d) && d <= 0) err.push({ pesan: 'Sisi d harus > 0.' });

      if (!isNaN(a) && !isNaN(b) && !isNaN(c) && !isNaN(d)) {
        const rasio1 = a / b;
        const rasio2 = c / d;
        const selisih = Math.abs(rasio1 - rasio2);
        const toleransi = Math.max(rasio1 * 0.01, 0.001);

        if (selisih > toleransi) {
          err.push({
            pesan: 'Nilai <strong>a/b</strong> tidak sama dengan <strong>c/d</strong>.',
            detail: `a/b = ${formatAngkaEngine(rasio1)}, c/d = ${formatAngkaEngine(rasio2)}. Tidak sebangun.`,
            saran: 'Perbaiki salah satu nilai, atau kosongkan 1 nilai agar dicari otomatis.'
          });
        }
      }

      const filled = [a, b, c, d].filter(x => !isNaN(x)).length;
      if (filled < 3) {
        err.push({
          pesan: 'Isi minimal 3 nilai untuk bisa dihitung.',
          detail: 'Kosongkan tepat 1 nilai yang ingin dicari.'
        });
      }

      return err;
    }
  },

  /* ============================================================
     5. STATISTIKA (custom calculator)
     ============================================================ */
  "statistika": {
    judul: "Statistika",
    deskripsi: "Hitung mean, median, modus, kuartil, jangkauan dari data tunggal.",
    teori: `Statistika deskriptif meringkas data menjadi ukuran pemusatan & penyebaran.

Ukuran pemusatan:
• Mean (rata-rata) = jumlah data / banyak data
• Median = nilai tengah setelah diurutkan
• Modus = nilai yang paling sering muncul

Ukuran penyebaran:
• Jangkauan = data terbesar − data terkecil
• Q1, Q2, Q3 = kuartil`,
    variabel: [
      { kode: "data", label: "Data (pisahkan dengan koma)", satuan: "list", tipe: "list" },
      { kode: "mean",   label: "Mean (rata-rata)", satuan: "angka", readonly: true },
      { kode: "median", label: "Median",           satuan: "angka", readonly: true },
      { kode: "modus",  label: "Modus",            satuan: "angka", readonly: true },
      { kode: "q1",     label: "Kuartil 1 (Q1)",   satuan: "angka", readonly: true },
      { kode: "q3",     label: "Kuartil 3 (Q3)",   satuan: "angka", readonly: true }
    ],
    rumus: [],
    butuhTabel: false,
    custom: "statistika"
  },

  /* ============================================================
     6. PENCACAHAN (custom calculator)
     ============================================================ */
  "pencacahan": {
    judul: "Pencacahan",
    deskripsi: "Hitung faktorial, permutasi, dan kombinasi.",
    teori: `Pencacahan (counting) menghitung banyaknya kemungkinan susunan/pilihan.

Konsep kunci:
• Faktorial: n! = n × (n−1) × ... × 2 × 1, dengan 0! = 1
• Permutasi (urutan diperhatikan): nPr = n! / (n−r)!
• Kombinasi (urutan tidak diperhatikan): nCr = n! / (r! (n−r)!)`,
    variabel: [
      { kode: "mode", label: "Jenis Perhitungan", satuan: "pilihan", tipe: "select",
        opsi: [
          { value: "faktorial",  label: "Faktorial (n!)" },
          { value: "permutasi",  label: "Permutasi (nPr)" },
          { value: "kombinasi",  label: "Kombinasi (nCr)" }
        ] },
      { kode: "n", label: "Nilai n", satuan: "angka" },
      { kode: "r", label: "Nilai r (untuk permutasi/kombinasi)", satuan: "angka" },
      { kode: "hasil", label: "Hasil", satuan: "angka", readonly: true }
    ],
    rumus: [],
    butuhTabel: false,
    custom: "pencacahan"
  }
};

/* ============================================================
   FUNGSI BANTU KHUSUS ANUITAS
   Mencari i (suku bunga) secara iterasi
   ============================================================ */

function cariBungaAnuitas(M0, A, n) {
  if (M0 <= 0 || A <= 0 || n <= 0) {
    throw new Error('Nilai M0, A, n harus > 0.');
  }
  if (A <= M0 / n) {
    throw new Error('Anuitas terlalu kecil, tidak bisa melunasi pinjaman.');
  }

  let lo = 0.000001;
  let hi = 10;
  let iter = 0;
  const maxIter = 200;
  const tol = 1e-10;

  function f(i) {
    return M0 * i / (1 - Math.pow(1 + i, -n)) - A;
  }

  while (f(hi) < 0 && hi < 1000) {
    hi *= 2;
    iter++;
    if (iter > 50) break;
  }

  for (let k = 0; k < maxIter; k++) {
    const mid = (lo + hi) / 2;
    const fmid = f(mid);
    if (Math.abs(fmid) < tol) return mid;
    if (fmid > 0) hi = mid;
    else lo = mid;
  }

  return (lo + hi) / 2;
}