/* ============================================================
   HALAMAN LATIHAN SOAL
   ============================================================ */

let exerciseState = {
  materi: 'anuitas',
  tingkat: 'semua',
  questions: [],
  currentIndex: 0,
  answers: [],
  checked: false,
  finished: false
};

function renderExercisePage(preselectedMateri) {
  const materials = getMaterials();
  const app = document.getElementById('app');

  if (preselectedMateri) exerciseState.materi = preselectedMateri;

  let html = `
    <div class="hero" style="padding:32px 28px;">
      <h2>Latihan Soal</h2>
      <p>Pilih materi dan tingkat kesulitan, lalu kerjakan soal. Jawaban dan pembahasan akan muncul setelah kamu menjawab.</p>
    </div>

    <div class="calc-panel">
      <div class="calc-hint">Pilih jawaban yang menurut Anda benar, kemudian tekan Periksa Jawaban.</div>
      <div class="form-row">
        <div class="form-group">
          <label>Materi</label>
          <select class="form-control" id="exMateri">
  `;
  materials.forEach(m => {
    html += `<option value="${m.id}" ${m.id === exerciseState.materi ? 'selected' : ''}>${escapeHtml(m.judul)}</option>`;
  });
  html += `
          </select>
        </div>
        <div class="form-group">
          <label>Tingkat</label>
          <select class="form-control" id="exTingkat">
            <option value="semua">Semua</option>
            <option value="mudah">Mudah</option>
            <option value="sedang">Sedang</option>
            <option value="sulit">Sulit</option>
          </select>
        </div>
      </div>
      <button class="btn btn-primary" onclick="startExercise()">Mulai Latihan</button>
    </div>

    <div id="exerciseArea"></div>
  `;

  app.innerHTML = html;
}

function startExercise() {
  exerciseState.materi = document.getElementById('exMateri').value;
  exerciseState.tingkat = document.getElementById('exTingkat').value;
  exerciseState.currentIndex = 0;
  exerciseState.answers = [];
  exerciseState.checked = false;
  exerciseState.finished = false;

  const allQuestions = getQuestions();
  exerciseState.questions = allQuestions.filter(q => {
    const matchMateri = q.materi === exerciseState.materi;
    const matchTingkat = exerciseState.tingkat === 'semua' || q.tingkat === exerciseState.tingkat;
    return matchMateri && matchTingkat;
  });

  if (exerciseState.questions.length === 0) {
    document.getElementById('exerciseArea').innerHTML =
      '<div class="calc-panel"><p>Tidak ada soal untuk materi dan tingkat yang dipilih.</p></div>';
    return;
  }

  exerciseState.answers = new Array(exerciseState.questions.length).fill(null);
  renderQuestion();
}

function renderQuestion() {
  const area = document.getElementById('exerciseArea');
  const q = exerciseState.questions[exerciseState.currentIndex];
  const total = exerciseState.questions.length;
  const idx = exerciseState.currentIndex;
  const answered = exerciseState.answers[idx];
  const isLast = idx === total - 1;
  const isChecked = exerciseState.checked;

  let html = `
    <div class="question-box">
      <div class="q-meta">
        <span class="badge badge-materi">${escapeHtml(getMaterialName(q.materi))}</span>
        <span class="badge badge-${q.tingkat}">${q.tingkat.charAt(0).toUpperCase() + q.tingkat.slice(1)}</span>
        <span style="font-size:12px;color:var(--gray-text);">Soal ${idx+1} dari ${total}</span>
      </div>
      <p class="question-text">${escapeHtml(q.pertanyaan).replace(/\n/g, '<br>')}</p>
  `;

  if (q.tipe === 'pg') {
    html += '<div class="options">';
    q.pilihan.forEach((p, i) => {
      const letter = String.fromCharCode(65 + i);
      let cls = 'option';
      if (answered === letter) cls += ' selected';

      if (isChecked) {
        if (letter === q.jawaban) cls += ' correct';
        else if (answered === letter) cls += ' wrong';
      }

      html += `
        <label class="${cls}">
          <input type="radio" name="opt_${idx}" value="${letter}" ${answered === letter ? 'checked' : ''}
                 ${isChecked ? 'disabled' : ''}
                 onchange="selectAnswer(${idx}, '${letter}')">
          <strong>${letter}.</strong> ${escapeHtml(p)}
        </label>
      `;
    });
    html += '</div>';
  } else {
    html += `
      <div class="answer-input">
        <input type="number" step="any" class="form-control" id="ansInput_${idx}"
               value="${answered !== null ? answered : ''}" placeholder="Masukkan jawaban..."
               ${isChecked ? 'disabled' : ''}
               oninput="selectAnswer(${idx}, this.value)">
      </div>
    `;
  }

  if (isChecked && answered !== null && answered !== '') {
    const isCorrect = checkAnswer(q, answered);
    html += `
      <div class="feedback ${isCorrect ? 'correct' : 'wrong'}">
        <strong>${isCorrect ? '✓ Jawaban benar' : '✗ Jawaban belum tepat'}</strong>
        ${!isCorrect ? `<p>Jawaban yang benar: <strong>${escapeHtml(q.jawaban)}</strong></p>` : ''}
        <div class="explain"><strong>Pembahasan:</strong> ${escapeHtml(q.pembahasan)}</div>
      </div>
    `;
  }

  html += `<div class="nav-actions">`;
  if (idx > 0) {
    html += `<button class="btn btn-secondary" onclick="prevQuestion()">← Sebelumnya</button>`;
  }

  if (!isChecked) {
    const disabled = (answered === null || answered === '') ? 'disabled' : '';
    html += `<button class="btn btn-primary" id="checkAnswerBtn" onclick="checkCurrentAnswer()" ${disabled}>Periksa Jawaban</button>`;
  } else {
    if (!isLast) {
      html += `<button class="btn btn-primary" onclick="nextQuestion()">Selanjutnya →</button>`;
    } else {
      html += `<button class="btn btn-primary" onclick="finishExercise()">Lihat Skor Akhir</button>`;
    }
  }

  html += `</div>`;
  html += `</div>`;
  area.innerHTML = html;
}

function selectAnswer(idx, value) {
  exerciseState.answers[idx] = value;

  const checkBtn = document.getElementById('checkAnswerBtn');
  if (checkBtn) {
    checkBtn.disabled = (value === null || value === '');
  }
}

function checkCurrentAnswer() {
  exerciseState.checked = true;
  renderQuestion();
}

function prevQuestion() {
  exerciseState.currentIndex--;
  exerciseState.checked = false;
  renderQuestion();
}

function nextQuestion() {
  exerciseState.currentIndex++;
  exerciseState.checked = false;
  renderQuestion();
}

function checkAnswer(q, userAnswer) {
  if (q.tipe === 'pg') {
    return userAnswer === q.jawaban;
  } else {
    const ua = parseFloat(userAnswer);
    const correct = parseFloat(q.jawaban);
    if (isNaN(ua)) return false;
    return Math.abs(ua - correct) < 0.01;
  }
}

function finishExercise() {
  let correct = 0;
  let unanswered = 0;
  exerciseState.questions.forEach((q, i) => {
    const ans = exerciseState.answers[i];
    if (ans === null || ans === '') {
      unanswered++;
    } else if (checkAnswer(q, ans)) {
      correct++;
    }
  });
  const total = exerciseState.questions.length;
  const score = Math.round((correct / total) * 100);

  if (typeof simpanSkorLatihan === 'function') {
    simpanSkorLatihan(exerciseState.materi, score, correct, total);
  }
    // BARU: sync ke data guru (kalau yang login siswa)
  if (typeof syncProgressSiswaKeGuru === 'function') {
    syncProgressSiswaKeGuru();
  }

  let subText = `Jawaban benar: ${correct} dari ${total} soal`;
  if (unanswered > 0) subText += ` • Tidak dijawab: ${unanswered}`;

  document.getElementById('exerciseArea').innerHTML = `
    <div class="score-box">
      <div class="score-num">${score}/100</div>
      <div class="score-sub">${subText}</div>
      <div style="margin-top:24px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
        <button class="btn btn-primary" onclick="startExercise()">Coba Lagi</button>
        <button class="btn btn-outline" onclick="navigate('progress')">Lihat Progress</button>
        <button class="btn btn-outline" onclick="navigate('materials')">Kembali ke Materi</button>
      </div>
    </div>
  `;
}

function getMaterialName(id) {
  const m = getMaterials().find(x => x.id === id);
  return m ? m.judul : id;
}