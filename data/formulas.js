/* ============================================================
   DEFINISI RUMUS — 3 MATERI INTI
   Bunga Tunggal, Bunga Majemuk, Anuitas
   ============================================================ */

const FORMULAS = {

  "bunga-tunggal": {
    judul: "Bunga Tunggal",
    deskripsi: "Bunga dihitung dari modal awal saja (tidak berbunga lagi).",
    teori: `Bunga tunggal adalah bunga yang dihitung hanya berdasarkan modal awal (pokok), tidak berdasarkan saldo yang sudah bertambah.

Konsep kunci:
• Bunga (b) = M₀ × i × n
• Modal akhir (Mn) = M₀ + b = M₀ (1 + i·n)
• i = suku bunga per periode (desimal)
• n = jumlah periode
• Pertumbuhan bersifat LINEAR`,
    variabel: [
      { kode: "M0", label: "Modal Awal",   satuan: "Rp",      deskripsi: "Uang yang dipinjamkan/ditabung mula-mula" },
      { kode: "Mn", label: "Modal Akhir",  satuan: "Rp",      deskripsi: "Total uang setelah periode berakhir" },
      { kode: "i",  label: "Suku Bunga",   satuan: "%",       deskripsi: "Persentase bunga per periode" },
      { kode: "n",  label: "Lama Periode", satuan: "periode", deskripsi: "Berapa kali bunga dihitung" },
      { kode: "b",  label: "Bunga",        satuan: "Rp",      deskripsi: "Total bunga yang diperoleh" }
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

  "bunga-majemuk": {
    judul: "Bunga Majemuk",
    deskripsi: "Bunga berbunga tiap periode (compounding).",
    teori: `Bunga majemuk dihitung berdasarkan saldo terkini (modal + bunga yang sudah terakumulasi). Dasar sistem keuangan modern: tabungan, deposito, kredit, investasi.

Konsep kunci:
• Mn = M₀ (1 + i)ⁿ
• Bunga total = Mn − M₀
• Pertumbuhan bersifat EKSPONENSIAL
• i = suku bunga per periode, n = jumlah periode`,
    variabel: [
      { kode: "M0", label: "Modal Awal",   satuan: "Rp",      deskripsi: "Uang mula-mula" },
      { kode: "Mn", label: "Modal Akhir",  satuan: "Rp",      deskripsi: "Total uang setelah periode" },
      { kode: "i",  label: "Suku Bunga",   satuan: "%",       deskripsi: "Persentase bunga per periode" },
      { kode: "n",  label: "Lama Periode", satuan: "periode", deskripsi: "Jumlah periode compounding" },
      { kode: "b",  label: "Bunga Total",  satuan: "Rp",      deskripsi: "Total bunga (Mn − M₀)" }
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

  "anuitas": {
    judul: "Anuitas",
    deskripsi: "Pembayaran berkala dengan jumlah tetap, terdiri atas bunga dan angsuran pokok.",
    teori: `Anuitas adalah pembayaran tetap setiap periode untuk melunasi pinjaman. Setiap pembayaran terdiri atas:
• Bunga (dihitung dari sisa pinjaman)
• Angsuran pokok (mengurangi sisa pinjaman)

Konsep kunci:
• A = M₀ · i / (1 − (1+i)⁻ⁿ)
• Bunga periode ke-k = i × sisa awal
• Angsuran pokok = A − bunga
• Seiring waktu: porsi bunga ↓, porsi pokok ↑`,
    variabel: [
      { kode: "M0", label: "Pinjaman Awal", satuan: "Rp",      deskripsi: "Jumlah pinjaman mula-mula" },
      { kode: "A",  label: "Anuitas",       satuan: "Rp",      deskripsi: "Pembayaran tetap per periode" },
      { kode: "i",  label: "Suku Bunga",    satuan: "%",       deskripsi: "Bunga per periode" },
      { kode: "n",  label: "Lama Periode",  satuan: "periode", deskripsi: "Jumlah pembayaran" }
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
  }
};

function cariBungaAnuitas(M0, A, n) {
  if (M0 <= 0 || A <= 0 || n <= 0) throw new Error('Nilai M0, A, n harus > 0.');
  if (A <= M0 / n) throw new Error('Anuitas terlalu kecil, tidak bisa melunasi pinjaman.');

  let lo = 0.000001, hi = 10, iter = 0;
  const maxIter = 200, tol = 1e-10;
  const f = (i) => M0 * i / (1 - Math.pow(1 + i, -n)) - A;

  while (f(hi) < 0 && hi < 1000) {
    hi *= 2;
    if (++iter > 50) break;
  }

  for (let k = 0; k < maxIter; k++) {
    const mid = (lo + hi) / 2;
    const fmid = f(mid);
    if (Math.abs(fmid) < tol) return mid;
    if (fmid > 0) hi = mid; else lo = mid;
  }
  return (lo + hi) / 2;
}