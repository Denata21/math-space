/* ============================================================
   CHALLENGE — Contextual Challenges (10-tahap)
   ============================================================ */

/* ============================================================
   HALAMAN DAFTAR CHALLENGE
   ============================================================ */

function renderChallengePage(preselectedMateri) {
  const app = document.getElementById('app');
  if (!app) return;

  const challenges = getChallenges();
  const materials = getMaterials();

  let filtered = challenges;
  if (preselectedMateri) {
    filtered = challenges.filter(c => c.materi === preselectedMateri);
  }

  let html = `
    <div class="hero">
      <h2 class="hero-title">🎯 Tantangan Kontekstual</h2>
      <p class="hero-subtitle">
        Selesaikan masalah nyata dengan alur: pahami masalah → prediksi → eksplorasi →
        hitung → jelaskan alasan → refleksi. Setiap langkah penting untuk membangun pemahaman.
      </p>
    </div>

    <div class="card-grid">
  `;

  if (filtered.length === 0) {
    html += `<div class="calc-panel"><p class="text-muted">Belum ada tantangan untuk materi ini.</p></div>`;
  }

  filtered.forEach(c => {
    const m = materials.find(x => x.id === c.materi);
    const sudah = (typeof getHasilChallenge === 'function') && getHasilChallenge(c.id);
    html += `
      <div class="card">
        <span class="card-cat">${m ? escapeHtml(m.judul) : ''}</span>
        ${sudah ? '<span class="badge badge-mudah" style="align-self:flex-start;margin-bottom:6px;">✓ Sudah diselesaikan</span>' : ''}
        <h3>${escapeHtml(c.judul)}</h3>
        <p>${escapeHtml(c.konteks.substring(0, 100))}...</p>
        <button class="btn btn-primary btn-sm" onclick="navigate('challenge', '${c.id}', 'detail')">Buka Tantangan</button>
      </div>
    `;
  });

  html += `</div>`;
  app.innerHTML = html;
}

/* ============================================================
   HALAMAN DETAIL CHALLENGE
   ============================================================ */

function renderChallengeDetail(challengeId) {
  const app = document.getElementById('app');
  if (!app) return;

  const c = getChallengeById(challengeId);
  if (!c) {
    app.innerHTML = `
      <div class="hero">
        <h2 class="hero-title">Tantangan tidak ditemukan</h2>
        <button class="btn btn-primary" onclick="navigate('challenge')">Kembali</button>
      </div>
    `;
    return;
  }

  const materials = getMaterials();
  const m = materials.find(x => x.id === c.materi);
  const hasil = (typeof getHasilChallenge === 'function') ? getHasilChallenge(c.id) : null;
  const sudah = !!hasil;

  let infoHtml = '';
  c.info.forEach(i => {
    infoHtml += `<li style="margin-bottom:6px;">${escapeHtml(i)}</li>`;
  });

  app.innerHTML = `
    <div class="material-detail">
      <button class="btn btn-secondary btn-sm" onclick="navigate('challenge')" style="margin-bottom:16px;">← Kembali</button>
      <span class="card-cat">${m ? escapeHtml(m.judul) : ''}</span>
      <h2 style="margin-top:10px;">${escapeHtml(c.judul)}</h2>

      <h3>📖 Konteks</h3>
      <p style="line-height:1.8;white-space:pre-line;">${escapeHtml(c.konteks)}</p>

      <h3>📋 Informasi yang Diketahui</h3>
      <ul style="margin-left:22px;">${infoHtml}</ul>

      <h3>🎯 Yang Perlu Ditentukan</h3>
      <p>${escapeHtml(c.yangDitentukan)}</p>

      <h3>1️⃣ Prediksi (sebelum menghitung)</h3>
      <div class="calc-panel">
        <p style="font-size:14px;margin-bottom:12px;">${escapeHtml(c.pertanyaanPrediksi)}</p>
        <div class="form-group">
          <textarea class="form-control" id="chPrediksi"
                    placeholder="${escapeHtml(c.prediksiPlaceholder)}"
                    style="min-height:90px;"
                    ${sudah ? 'disabled' : ''}>${sudah ? escapeHtml(hasil.prediksi || '') : ''}</textarea>
        </div>
      </div>

      <h3>2️⃣ Strategi Penyelesaian</h3>
      <div class="calc-panel">
        <p style="font-size:14px;margin-bottom:12px;">Tulis langkah-langkah yang akan kamu lakukan:</p>
        <div class="form-group">
          <textarea class="form-control" id="chStrategi"
                    placeholder="${escapeHtml(c.strategiPlaceholder)}"
                    style="min-height:110px;"
                    ${sudah ? 'disabled' : ''}>${sudah ? escapeHtml(hasil.strategi || '') : ''}</textarea>
        </div>
        <p style="font-size:13px;color:var(--text-muted);">
          💡 Kamu bisa membuka <a href="#" onclick="navigate('calculator'); return false;">Kalkulator</a>
          atau <a href="#" onclick="navigate('explorer'); return false;">Explorer</a> di tab lain untuk membantu.
        </p>
      </div>

      <h3>3️⃣ Jawaban Akhir</h3>
      <div class="calc-panel">
        <div class="form-group">
          <label>Jawaban Numerik</label>
          <input type="number" step="any" class="form-control" id="chJawaban"
                 value="${sudah ? escapeHtml(hasil.jawaban) : ''}"
                 placeholder="Masukkan jawaban numerik..."
                 ${sudah ? 'disabled' : ''}>
          <span class="hint">Untuk tantangan dengan pilihan (A/B), ketik 'A' atau 'B'.</span>
        </div>
      </div>

      <h3>4️⃣ Alasan Matematis</h3>
      <div class="calc-panel">
        <div class="form-group">
          <label>Jelaskan alasanmu <span style="color:var(--danger);">*</span></label>
          <textarea class="form-control" id="chAlasan"
                    placeholder="Tunjukkan perhitungan dan penalaranmu. Mengapa jawaban ini masuk akal?"
                    style="min-height:120px;"
                    ${sudah ? 'disabled' : ''}>${sudah ? escapeHtml(hasil.alasan || '') : ''}</textarea>
        </div>
      </div>

      <h3>5️⃣ Refleksi</h3>
      <div class="calc-panel">
        <p style="font-size:14px;margin-bottom:12px;">${escapeHtml(c.refleksiPrompt)}</p>
        <div class="form-group">
          <textarea class="form-control" id="chRefleksi"
                    placeholder="Tulis kesimpulan dan refleksimu..."
                    style="min-height:110px;"
                    ${sudah ? 'disabled' : ''}>${sudah ? escapeHtml(hasil.refleksi || '') : ''}</textarea>
        </div>

        <p class="login-error" id="chError"></p>

        ${sudah
          ? `<div class="alert alert-success">✓ Kamu sudah menyelesaikan tantangan ini. Guru dapat meninjau jawaban dan refleksimu.</div>`
          : `<button class="btn btn-primary" onclick="submitChallenge('${challengeId}')">✅ Kirim Jawaban</button>`
        }
      </div>

      <div id="chFeedback"></div>
    </div>
  `;

  if (sudah) {
    tampilkanChallengeFeedback(c, hasil.jawaban);
  }
}

/* ============================================================
   SUBMIT
   ============================================================ */

function submitChallenge(challengeId) {
  const c = getChallengeById(challengeId);
  if (!c) return;

  const errEl = document.getElementById('chError');
  errEl.textContent = '';

  const prediksi = document.getElementById('chPrediksi').value.trim();
  const strategi = document.getElementById('chStrategi').value.trim();
  const jawaban = document.getElementById('chJawaban').value.trim();
  const alasan = document.getElementById('chAlasan').value.trim();
  const refleksi = document.getElementById('chRefleksi').value.trim();

  const errs = [];
  if (!prediksi) errs.push('Isi prediksimu terlebih dahulu.');
  if (!strategi) errs.push('Tulis strategi penyelesaianmu.');
  if (!jawaban) errs.push('Isi jawaban akhir.');
  if (alasan.length < 15) errs.push('Tulis alasan matematismu minimal 15 karakter.');
  if (refleksi.length < 15) errs.push('Tulis refleksimu minimal 15 karakter.');

  if (errs.length > 0) {
    errEl.innerHTML = errs.join('<br>');
    return;
  }

  if (typeof simpanHasilChallenge === 'function') {
    simpanHasilChallenge(challengeId, { prediksi, strategi, jawaban, alasan, refleksi });
  }

  // Disable semua input
  ['chPrediksi', 'chStrategi', 'chJawaban', 'chAlasan', 'chRefleksi'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = true;
  });
  const btn = errEl.nextElementSibling;
  if (btn && btn.tagName === 'BUTTON') btn.remove();

  tampilkanChallengeFeedback(c, jawaban);
}

/* ============================================================
   FEEDBACK
   ============================================================ */

function tampilkanChallengeFeedback(c, jawabanSiswa) {
  const area = document.getElementById('chFeedback');
  if (!area) return;

  // Cek benar (numerik atau A/B)
  let benar = false;
  const jb = String(c.jawabanBenar).trim();
  const js = String(jawabanSiswa).trim();

  if (js.length <= 2 && (js.toUpperCase() === 'A' || js.toUpperCase() === 'B')) {
    benar = js.toUpperCase() === jb.toUpperCase();
  } else {
    const a = parseFloat(js);
    const b = parseFloat(jb);
    const tol = c.toleransi || 0;
    benar = !isNaN(a) && !isNaN(b) && Math.abs(a - b) <= tol;
  }

  area.innerHTML = `
    <div class="calc-panel" style="margin-top:16px;background:var(--teal-light);border-color:var(--teal);">
      <h3 style="font-size:15px;margin-bottom:14px;color:var(--teal-dark);">📊 Umpan Balik</h3>

      <div class="feedback ${benar ? 'correct' : 'wrong'}" style="margin-top:0;">
        <strong>${benar ? '✓ Jawabanmu benar!' : '✗ Jawabanmu belum tepat'}</strong>
        ${!benar ? `<p style="margin-top:8px;">Jawaban yang diharapkan: <strong>${escapeHtml(jb)}</strong></p>` : ''}
      </div>

      <div class="example-box" style="margin-top:16px;">
        <strong>Pembahasan:</strong>
        <p style="white-space:pre-line;margin:8px 0 0;line-height:1.8;">${escapeHtml(c.alasanBenar)}</p>
      </div>

      <div class="calc-hint" style="margin-top:16px;margin-bottom:0;">
        💡 <strong>Refleksi Lanjutan:</strong> Bandingkan prediksimu di awal dengan hasil sebenarnya.
        Apakah prediksimu akurat? Apa yang bisa kamu perbaiki dalam cara memprediksi?
      </div>

      <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn btn-secondary btn-sm" onclick="navigate('challenge')">← Kembali ke Daftar</button>
        <button class="btn btn-outline btn-sm" onclick="navigate('materials')">📖 Buka Materi</button>
      </div>
    </div>
  `;
}