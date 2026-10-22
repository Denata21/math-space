/* ============================================================
   DETECTIVE — Math Detective (investigasi matematis)
   ============================================================ */

/* ============================================================
   HALAMAN DAFTAR DETECTIVE
   ============================================================ */

function renderDetectivePage(preselectedId) {
  const app = document.getElementById('app');
  if (!app) return;

  if (preselectedId) {
    renderDetectiveDetail(preselectedId);
    return;
  }

  const detectives = getDetectives();
  const materials = getMaterials();

  let html = `
    <div class="hero">
      <h2 class="hero-title">🕵️ Math Detective</h2>
      <p class="hero-subtitle">
        Periksa pernyataan matematis, temukan kesalahan, dan jelaskan alasan di balik jawabanmu.
        Setiap kasus dirancang untuk melatih penalaran, bukan sekadar menghitung.
      </p>
    </div>

    <div class="card-grid">
  `;

  detectives.forEach(d => {
    const m = materials.find(x => x.id === d.materi);
    const sudah = (typeof getHasilDetective === 'function') && getHasilDetective(d.id);
    html += `
      <div class="card">
        <span class="card-cat">${m ? escapeHtml(m.judul) : ''}</span>
        ${sudah ? '<span class="badge badge-mudah" style="align-self:flex-start;margin-bottom:6px;">✓ Sudah diinvestigasi</span>' : ''}
        <h3>${escapeHtml(d.judul)}</h3>
        <p>Periksa pernyataan dan temukan kesalahan atau kebenarannya.</p>
        <button class="btn btn-primary btn-sm" onclick="navigate('detective', '${d.id}')">Mulai Investigasi</button>
      </div>
    `;
  });

  html += `</div>`;
  app.innerHTML = html;
}

/* ============================================================
   HALAMAN DETAIL DETECTIVE
   ============================================================ */

function renderDetectiveDetail(detectiveId) {
  const app = document.getElementById('app');
  if (!app) return;

  const d = getDetectiveById(detectiveId);
  if (!d) {
    app.innerHTML = `
      <div class="hero">
        <h2 class="hero-title">Kasus tidak ditemukan</h2>
        <button class="btn btn-primary" onclick="navigate('detective')">Kembali</button>
      </div>
    `;
    return;
  }

  const materials = getMaterials();
  const m = materials.find(x => x.id === d.materi);

  // Cek apakah siswa sudah pernah submit
  const hasilLama = (typeof getHasilDetective === 'function') ? getHasilDetective(d.id) : null;
  const sudahSubmit = !!hasilLama;

  // Tentukan tipe jawaban: "Benar/Salah" atau angka
  const tipeJawaban = _detectiveTipeJawaban(d);

  let pertanyaanHtml = '';
  d.pertanyaanPemandu.forEach((q, i) => {
    pertanyaanHtml += `
      <li style="margin-bottom:10px;line-height:1.7;">
        <span style="display:inline-block;background:var(--teal-light);color:var(--teal-dark);
                     width:22px;height:22px;border-radius:50%;text-align:center;
                     font-size:12px;font-weight:700;line-height:22px;margin-right:8px;">
          ${i + 1}
        </span>
        ${escapeHtml(q)}
      </li>
    `;
  });

  // Input jawaban
  let inputJawabanHtml = '';
  if (tipeJawaban === 'benar-salah') {
    inputJawabanHtml = `
      <div class="form-group">
        <label>Jawabanmu</label>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <label class="option" style="flex:1;min-width:120px;cursor:pointer;">
            <input type="radio" name="detJawaban" value="Benar"
                   ${sudahSubmit && hasilLama.jawaban === 'Benar' ? 'checked' : ''}
                   ${sudahSubmit ? 'disabled' : ''}>
            <span><strong>Benar</strong></span>
          </label>
          <label class="option" style="flex:1;min-width:120px;cursor:pointer;">
            <input type="radio" name="detJawaban" value="Salah"
                   ${sudahSubmit && hasilLama.jawaban === 'Salah' ? 'checked' : ''}
                   ${sudahSubmit ? 'disabled' : ''}>
            <span><strong>Salah</strong></span>
          </label>
        </div>
      </div>
    `;
  } else {
    inputJawabanHtml = `
      <div class="form-group">
        <label>Jawaban Numerik</label>
        <input type="number" step="any" class="form-control" id="detJawabanNumerik"
               value="${sudahSubmit ? escapeHtml(hasilLama.jawaban) : ''}"
               placeholder="Masukkan jawaban numerik..."
               ${sudahSubmit ? 'disabled' : ''}>
        <span class="hint">Toleransi pembulatan akan diterapkan.</span>
      </div>
    `;
  }

  app.innerHTML = `
    <div class="material-detail">
      <button class="btn btn-secondary btn-sm" onclick="navigate('detective')" style="margin-bottom:16px;">← Kembali</button>
      <span class="card-cat">${m ? escapeHtml(m.judul) : ''}</span>
      <h2 style="margin-top:10px;">${escapeHtml(d.judul)}</h2>

      <h3>📋 Skenario</h3>
      <div class="example-box">
        <p style="white-space:pre-line;margin:0;line-height:1.8;">${escapeHtml(d.skenario)}</p>
      </div>

      <h3>❓ Pertanyaan Pemandu</h3>
      <div class="calc-panel">
        <ol style="list-style:none;padding:0;margin:0;">
          ${pertanyaanHtml}
        </ol>
      </div>

      <h3>✍️ Jawaban & Alasanmu</h3>
      <div class="calc-panel">
        ${inputJawabanHtml}

        <div class="form-group">
          <label>Alasan / Cara Berpikirmu <span style="color:var(--danger);">*</span></label>
          <textarea class="form-control" id="detAlasan"
                    placeholder="Jelaskan mengapa kamu memilih jawaban itu. Tunjukkan langkah perhitungan atau penalaranmu..."
                    style="min-height:140px;"
                    ${sudahSubmit ? 'disabled' : ''}>${sudahSubmit ? escapeHtml(hasilLama.alasan || '') : ''}</textarea>
          <span class="hint">Alasan ini akan ditinjau guru. Tulis dengan runtut.</span>
        </div>

        <p class="login-error" id="detError"></p>

        ${sudahSubmit
          ? `<div class="alert alert-success">✓ Kamu sudah mengirim jawaban. Guru dapat meninjau alasanmu.</div>`
          : `<button class="btn btn-primary" onclick="submitDetective('${detectiveId}')">🔍 Periksa Jawaban</button>`
        }
      </div>

      <div id="detFeedback"></div>
    </div>
  `;

  // Kalau sudah submit, langsung tampilkan feedback
  if (sudahSubmit) {
    tampilkanDetectiveFeedback(d, hasilLama.jawaban);
  }
}

/* ============================================================
   TENTUKAN TIPE JAWABAN
   ============================================================ */

function _detectiveTipeJawaban(d) {
  const j = String(d.jawabanBenar);
  if (j === 'Benar' || j === 'Salah' || j === 'A' || j === 'B') {
    return 'benar-salah';
  }
  return 'numerik';
}

/* ============================================================
   SUBMIT JAWABAN
   ============================================================ */

function submitDetective(detectiveId) {
  const d = getDetectiveById(detectiveId);
  if (!d) return;

  const errEl = document.getElementById('detError');
  errEl.textContent = '';

  const tipeJawaban = _detectiveTipeJawaban(d);
  let jawaban = '';

  if (tipeJawaban === 'benar-salah') {
    const checked = document.querySelector('input[name="detJawaban"]:checked');
    if (!checked) {
      errEl.textContent = 'Pilih Benar atau Salah terlebih dahulu.';
      return;
    }
    jawaban = checked.value;
  } else {
    const el = document.getElementById('detJawabanNumerik');
    jawaban = el ? el.value.trim() : '';
    if (!jawaban) {
      errEl.textContent = 'Masukkan jawaban numerik terlebih dahulu.';
      return;
    }
  }

  const alasan = document.getElementById('detAlasan').value.trim();
  if (alasan.length < 10) {
    errEl.textContent = 'Tulis alasanmu minimal 10 karakter agar guru dapat meninjau penalaranmu.';
    return;
  }

  // Simpan
  if (typeof simpanHasilDetective === 'function') {
    simpanHasilDetective(detectiveId, jawaban, alasan);
  }

  // Disable input
  document.querySelectorAll('input[name="detJawaban"]').forEach(el => el.disabled = true);
  const numEl = document.getElementById('detJawabanNumerik');
  if (numEl) numEl.disabled = true;
  document.getElementById('detAlasan').disabled = true;

  // Sembunyikan tombol submit
  const btnSubmit = errEl.nextElementSibling;
  if (btnSubmit && btnSubmit.tagName === 'BUTTON') {
    btnSubmit.remove();
  }

  // Tampilkan feedback
  tampilkanDetectiveFeedback(d, jawaban);
}

/* ============================================================
   FEEDBACK
   ============================================================ */

function tampilkanDetectiveFeedback(d, jawabanSiswa) {
  const area = document.getElementById('detFeedback');
  if (!area) return;

  const tipeJawaban = _detectiveTipeJawaban(d);
  let benar = false;

  if (tipeJawaban === 'benar-salah') {
    benar = String(jawabanSiswa).trim() === String(d.jawabanBenar).trim();
  } else {
    const a = parseFloat(jawabanSiswa);
    const b = parseFloat(d.jawabanBenar);
    const tol = d.toleransi || 0;
    benar = !isNaN(a) && !isNaN(b) && Math.abs(a - b) <= tol;
  }

  area.innerHTML = `
    <div class="calc-panel" style="margin-top:16px;">
      <h3 style="font-size:15px;margin-bottom:14px;color:var(--teal-dark);">📊 Umpan Balik</h3>

      <div class="feedback ${benar ? 'correct' : 'wrong'}" style="margin-top:0;">
        <strong>${benar ? '✓ Jawabanmu benar' : '✗ Jawabanmu belum tepat'}</strong>
        ${!benar ? `<p style="margin-top:8px;">Jawaban yang diharapkan: <strong>${escapeHtml(String(d.jawabanBenar))}</strong></p>` : ''}
      </div>

      <div class="example-box" style="margin-top:16px;">
        <strong>Pembahasan:</strong>
        <p style="white-space:pre-line;margin:8px 0 0;line-height:1.8;">${escapeHtml(d.jawabanDetail)}</p>
      </div>

      <div class="calc-hint" style="margin-top:16px;margin-bottom:0;">
        💡 <strong>Refleksi:</strong> Bandingkan alasanmu dengan pembahasan di atas.
        Apakah penalaranmu sudah tepat? Jika belum, di mana letak kekeliruannya?
      </div>

      <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn btn-secondary btn-sm" onclick="navigate('detective')">← Kembali ke Daftar</button>
        <button class="btn btn-outline btn-sm" onclick="navigate('materials')">📖 Buka Materi</button>
      </div>
    </div>
  `;
}