/* ============================================================
   FORMULA ENGINE — Evaluasi rumus matematika
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

/* ----- Evaluasi ekspresi dengan substitusi variabel ----- */
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

/* ----- Ekstrak variabel dari ekspresi ----- */
function extractVars(expr, allVars) {
  const found = [];
  for (const v of allVars) {
    const safeName = v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp('\\b' + safeName + '\\b');
    if (re.test(expr)) found.push(v);
  }
  return found;
}

/* ----- Solve: cari variabel yang belum diketahui ----- */
function solveFormulas(tabKey, inputValues) {
  const tab = FORMULAS[tabKey];
  if (!tab) throw new Error('Materi tidak ditemukan: ' + tabKey);

  if (typeof tab.validasi === 'function') {
    const errorValidasi = tab.validasi(inputValues);
    if (errorValidasi && errorValidasi.length > 0) {
      const err = new Error('INPUT_TIDAK_KONSISTEN');
      err.detail = errorValidasi;
      throw err;
    }
  }

  const values = {};
  const targets = [];
  const allVarCodes = tab.variabel.map(v => v.kode);

  const normalized = { ...inputValues };
  if (normalized.i !== undefined && normalized.i !== '' && normalized.i !== null) {
    normalized.i = parseFloat(normalized.i) / 100;
  }

  for (const v of allVarCodes) {
    const val = normalized[v];

    if (val === '' || val === null || val === undefined) {
      targets.push(v);
      continue;
    }

    let cleaned = String(val).trim();

    if (cleaned.includes(',')) {
      cleaned = cleaned.replace(/\./g, '').replace(',', '.');
    } else if (cleaned.includes('.')) {
      const parts = cleaned.split('.');
      if (parts[1] && parts[1].length >= 3) {
        cleaned = cleaned.replace(/\./g, '');
      }
    }

    const num = parseFloat(cleaned);

    if (isNaN(num)) {
      targets.push(v);
    } else {
      values[v] = num;
    }
  }

  if (targets.length === 0) {
    throw new Error('Semua variabel sudah terisi. Kosongkan minimal satu untuk ditanya.');
  }
  if (Object.keys(values).length === 0) {
    throw new Error('Isi minimal satu variabel yang diketahui.');
  }

  const steps = [];
  let remaining = [...targets];
  let maxIter = 30;

  while (remaining.length > 0 && maxIter-- > 0) {
    let progress = false;

    for (const rule of tab.rumus) {
      if (!remaining.includes(rule.target)) continue;

      const needed = extractVars(rule.ekspresi, allVarCodes);
      const canCompute = needed.every(v => values[v] !== undefined);
      if (!canCompute) continue;

      let result;
      try {
        result = evalFormula(rule.ekspresi, values);
      } catch (e) {
        continue;
      }
      if (!isFinite(result)) continue;

      values[rule.target] = result;
      remaining = remaining.filter(t => t !== rule.target);
      progress = true;

      steps.push({
        target: rule.target,
        ekspresi: rule.ekspresi,
        needed: needed.slice(),
        values: { ...values },
        result: result
      });
    }

    if (!progress) break;
  }

  return {
    values,
    steps,
    targets,
    unresolved: remaining,
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

/* ----- Format angka (dipakai di formulas.js validasi) ----- */
function formatAngkaEngine(angka) {
  if (!isFinite(angka)) return '—';
  if (typeof angka === 'string') return angka;
  const rounded = Math.round(angka * 10000) / 10000;
  return rounded.toLocaleString('id-ID', { maximumFractionDigits: 4 });
}

/* ----- Format rupiah (dipakai di formulas.js validasi) ----- */
function formatRupiahEngine(angka) {
  if (!isFinite(angka)) return '—';
  return 'Rp' + Math.round(angka).toLocaleString('id-ID');
}