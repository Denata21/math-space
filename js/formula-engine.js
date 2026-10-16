/* ============================================================
   FORMULA ENGINE
   - Parser ekspresi aman (tanpa eval langsung)
   - Solve otomatis: hitung variabel kosong dari rumus
   - Generate langkah pengerjaan
   - Generate tabel pelunasan anuitas
   - Support custom calculator (statistika, pencacahan)
   ============================================================ */

const MATH_FUNCS = {
  pow:   Math.pow,
  log:   Math.log,
  log10: Math.log10,
  exp:   Math.exp,
  sqrt:  Math.sqrt,
  abs:   Math.abs,
  round: Math.round,
  floor: Math.floor,
  ceil:  Math.ceil,
  min:   Math.min,
  max:   Math.max,
  cariBungaAnuitas: cariBungaAnuitas
};

function evalFormula(expr, vars) {
  let e = expr;

  const varNames = Object.keys(vars).sort((a, b) => b.length - a.length);
  for (const name of varNames) {
    const safeName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('\\b' + safeName + '\\b', 'g');
    e = e.replace(re, `(${vars[name]})`);
  }

  for (const fn of Object.keys(MATH_FUNCS)) {
    const re = new RegExp('\\b' + fn + '\\s*\\(', 'g');
    e = e.replace(re, `MATH_FUNCS.${fn}(`);
  }

  if (!/^[0-9+\-*/().,\sA-Za-z_$]*$/.test(e)) {
    throw new Error('Ekspresi mengandung karakter tidak valid.');
  }

  // eslint-disable-next-line no-new-func
  return Function('MATH_FUNCS', '"use strict"; return (' + e + ')')(MATH_FUNCS);
}

function extractVars(expr, allVars) {
  const found = [];
  for (const v of allVars) {
    const safeName = v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('\\b' + safeName + '\\b');
    if (re.test(expr)) found.push(v);
  }
  return found;
}

for (const v of allVarCodes) {
  const val = normalized[v];

  // Skip kalau kosong
  if (val === '' || val === null || val === undefined) {
    targets.push(v);
    continue;
  }

  // Bersihkan string: hapus titik ribuan
  // Tapi hati-hati: kalau titiknya desimal (mis. "0.05"), jangan dihapus
  let cleaned = String(val).trim();

  if (cleaned.includes(',')) {
    // Format Indonesia: 1.000,5 → hapus titik, ganti koma jadi titik
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (cleaned.includes('.')) {
    // Kalau ada titik, cek: apakah desimal atau ribuan?
    const parts = cleaned.split('.');
    if (parts[1] && parts[1].length >= 3) {
      // Contoh: "100.000" → titik + 3 digit → ini ribuan
      cleaned = cleaned.replace(/\./g, '');
    }
    // Kalau parts[1].length < 3 (mis. "0.5"), biarkan (desimal)
  }

  const num = parseFloat(cleaned);

  if (isNaN(num)) {
    targets.push(v);
  } else {
    values[v] = num;
  }
}

/* ----- Custom solver untuk statistika & pencacahan ----- */
function solveCustom(tabKey, inputValues, tab) {
  if (tabKey === 'statistika') return solveStatistika(inputValues, tab);
  if (tabKey === 'pencacahan') return solvePencacahan(inputValues, tab);
  throw new Error('Custom calculator tidak dikenal: ' + tabKey);
}

function solveStatistika(input, tab) {
  const raw = (input.data || '').toString().trim();
  if (!raw) throw new Error('Isi data terlebih dahulu (pisahkan dengan koma).');

  const arr = raw.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
  if (arr.length === 0) throw new Error('Data tidak valid. Contoh: 7, 8, 6, 8, 9');

  const sorted = [...arr].sort((a, b) => a - b);
  const n = sorted.length;

  // Mean
  const mean = arr.reduce((s, x) => s + x, 0) / n;

  // Median
  let median;
  if (n % 2 === 1) median = sorted[(n - 1) / 2];
  else median = (sorted[n / 2 - 1] + sorted[n / 2]) / 2;

  // Modus
  const freq = {};
  arr.forEach(x => { freq[x] = (freq[x] || 0) + 1; });
  let maxFreq = 0;
  Object.values(freq).forEach(f => { if (f > maxFreq) maxFreq = f; });
  const modusArr = Object.keys(freq).filter(k => freq[k] === maxFreq).map(Number);
  const modus = maxFreq === 1 ? 'tidak ada' : modusArr.join(', ');

  // Kuartil (metode interpolasi sederhana)
  const q1 = hitungKuartil(sorted, 0.25);
  const q3 = hitungKuartil(sorted, 0.75);

  const values = { data: arr, mean, median, modus, q1, q3 };

  const steps = [
    { target: 'mean',   ekspresi: 'jumlah data / banyak data',
      needed: ['data'], values, result: mean },
    { target: 'median', ekspresi: 'nilai tengah setelah diurutkan',
      needed: ['data'], values, result: median },
    { target: 'modus',  ekspresi: 'nilai paling sering muncul',
      needed: ['data'], values, result: modus },
    { target: 'q1',     ekspresi: 'kuartil bawah (25%)',
      needed: ['data'], values, result: q1 },
    { target: 'q3',     ekspresi: 'kuartil atas (75%)',
      needed: ['data'], values, result: q3 }
  ];

  return {
    values,
    steps,
    targets: ['mean', 'median', 'modus', 'q1', 'q3'],
    unresolved: [],
    tab
  };
}

function hitungKuartil(sorted, p) {
  const n = sorted.length;
  const pos = (n - 1) * p;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

function faktorial(n) {
  if (n < 0) throw new Error('Faktorial tidak terdefinisi untuk bilangan negatif.');
  if (n > 170) throw new Error('Nilai terlalu besar (maks 170).');
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

function solvePencacahan(input, tab) {
  const mode = (input.mode || 'faktorial').toString();
  const n = parseFloat(input.n);
  const r = parseFloat(input.r);

  if (isNaN(n) || n < 0) throw new Error('Nilai n harus bilangan ≥ 0.');
  if (!Number.isInteger(n)) throw new Error('n harus bilangan bulat.');

  let hasil, rumusStr, langkah;

  if (mode === 'faktorial') {
    hasil = faktorial(n);
    rumusStr = `${n}!`;
    langkah = `Hitung ${n}! = ${n} × ${n-1} × ... × 1 = ${hasil}`;
  } else if (mode === 'permutasi') {
    if (isNaN(r) || r < 0) throw new Error('Nilai r harus bilangan ≥ 0.');
    if (!Number.isInteger(r)) throw new Error('r harus bilangan bulat.');
    if (r > n) throw new Error('r tidak boleh lebih besar dari n.');
    hasil = faktorial(n) / faktorial(n - r);
    rumusStr = `${n}P${r} = ${n}! / (${n}−${r})!`;
    langkah = `${n}P${r} = ${n}! / ${n - r}! = ${faktorial(n)} / ${faktorial(n - r)} = ${hasil}`;
  } else {
    if (isNaN(r) || r < 0) throw new Error('Nilai r harus bilangan ≥ 0.');
    if (!Number.isInteger(r)) throw new Error('r harus bilangan bulat.');
    if (r > n) throw new Error('r tidak boleh lebih besar dari n.');
    hasil = faktorial(n) / (faktorial(r) * faktorial(n - r));
    rumusStr = `${n}C${r} = ${n}! / (${r}! × (${n}−${r})!)`;
    langkah = `${n}C${r} = ${n}! / (${r}! × ${n - r}!) = ${faktorial(n)} / (${faktorial(r)} × ${faktorial(n - r)}) = ${hasil}`;
  }

  const values = { mode, n, r, hasil };

  const steps = [{
    target: 'hasil',
    ekspresi: rumusStr,
    needed: mode === 'faktorial' ? ['n'] : ['n', 'r'],
    values,
    result: hasil,
    detail: langkah
  }];

  return {
    values,
    steps,
    targets: ['hasil'],
    unresolved: [],
    tab
  };
}

/* ----- Generate tabel pelunasan anuitas ----- */
function generateAnuitasTable(M0, A, i, n) {
  const rows = [];
  let sisa = M0;
  const nInt = Math.round(n);

  for (let k = 1; k <= nInt; k++) {
    const sisaAwal = sisa;
    const bungaK = sisaAwal * i;
    let pokokK = A - bungaK;
    let sisaAkhir = sisaAwal - pokokK;

    if (k === nInt || sisaAkhir < 0.01) {
      pokokK = sisaAwal;
      sisaAkhir = 0;
    }

    rows.push({
      periode: k,
      sisaAwal,
      anuitas: A,
      bunga: bungaK,
      pokok: pokokK,
      sisaAkhir
    });

    sisa = sisaAkhir;
    if (sisa <= 0.01) break;
  }

  return rows;
}

/* ----- Format ----- */
function formatRupiahEngine(angka) {
  if (!isFinite(angka)) return '—';
  return 'Rp' + Math.round(angka).toLocaleString('id-ID');
}

function formatAngkaEngine(angka) {
  if (!isFinite(angka)) return '—';
  if (typeof angka === 'string') return angka;
  const rounded = Math.round(angka * 10000) / 10000;
  return rounded.toLocaleString('id-ID', { maximumFractionDigits: 4 });
}

/* ===== BARU: Format ribuan untuk input ===== */
function formatRibuanInput(str) {
  let num = String(str).replace(/[^\d]/g, '');
  if (!num) return '';
  return parseInt(num, 10).toLocaleString('id-ID');
}

function parseRibuanInput(str) {
  return String(str).replace(/\./g, '').replace(/,/g, '');
}