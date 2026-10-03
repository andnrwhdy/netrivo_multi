const questionBank = [
  {
    topic: '',
    prompt: 'Perangkat yang berfungsi menghubungkan dua jaringan berbeda adalah...',
    options: ['Hub', 'Router', 'Access Point', 'Repeater'],
    answer: 1,
  },
  {
    topic: 'Pengantar Jaringan',
    prompt: 'Pada model OSI, alamat MAC ditambahkan dan diperiksa pada...',
    options: ['Physical Layer', 'Network Layer', 'Data Link Layer', 'Transport Layer'],
    answer: 2,
  },
  {
    prompt: 'Urutan enkapsulasi data yang benar dari aplikasi menuju media transmisi adalah...',
    options: ['Data, segment, packet, frame, bit', 'Data, frame, segment, packet, bit', 'Bit, frame, packet, segment, data', 'Packet, data, frame, segment, bit'],
    answer: 0,
  },
  {
    topic: 'Pengantar Jaringan',
    prompt: 'Topologi yang menghubungkan seluruh node ke satu perangkat pusat adalah...',
    options: ['Bus', 'Star', 'Ring', 'Mesh'],
    answer: 1,
  },
  {
    topic: 'Pengantar Jaringan',
    prompt: 'Berapa jumlah jalur pada topologi Full Mesh yang memiliki 8 node?',
    options: ['16 jalur', '24 jalur', '28 jalur', '56 jalur'],
    answer: 2,
  },
  {
    topic: 'Cisco Networking',
    prompt: 'Perintah Cisco IOS untuk berpindah dari User EXEC ke Privileged EXEC adalah...',
    options: ['exit', 'enable', 'configure terminal', 'write memory'],
    answer: 1,
  },
  {
    topic: 'Cisco Networking',
    prompt: 'Switch Layer 2 meneruskan frame berdasarkan informasi pada...',
    options: ['MAC address table', 'Routing table', 'DNS cache', 'ARP milik router lain'],
    answer: 0,
  },
  {
    topic: 'Cisco Networking',
    prompt: 'Perintah yang menempatkan sebuah access port ke VLAN 10 adalah...',
    options: ['switchport mode trunk', 'vlan access 10', 'switchport access vlan 10', 'interface vlan 10'],
    answer: 2,
  },
  {
    topic: 'Cisco Networking',
    prompt: 'Format perintah static route Cisco IOS yang benar adalah...',
    options: ['route [next-hop] [network] [mask]', 'static route [network/prefix] via [next-hop]', 'ip static-route [network] [interface]', 'ip route [network] [subnet-mask] [next-hop]'],
    answer: 3,
  },
  {
    topic: 'Cisco Networking',
    prompt: 'Protokol dynamic routing berbasis link state dan area adalah...',
    options: ['RIP', 'BGP', 'OSPF', 'ARP'],
    answer: 2,
  },
  {
    topic: 'MikroTik',
    prompt: 'Aplikasi grafis yang digunakan untuk mengonfigurasi MikroTik adalah...',
    options: ['Webex', 'Packet Tracer', 'Winbox', 'PuTTY'],
    answer: 2,
  },
  {
    topic: 'MikroTik',
    prompt: 'Port TCP bawaan yang digunakan Winbox adalah...',
    options: ['22', '8291', '80', '443'],
    answer: 1,
  },
  {
    topic: 'MikroTik',
    prompt: 'Pernyataan yang tepat mengenai RouterBOARD dan RouterOS adalah...',
    options: ['RouterBOARD adalah perangkat keras, sedangkan RouterOS adalah sistem operasinya', 'RouterBOARD adalah aplikasi konfigurasi, sedangkan RouterOS adalah kabel jaringan', 'Keduanya merupakan protokol routing', 'Keduanya hanya dapat digunakan melalui browser'],
    answer: 0,
  },
  {
    topic: 'MikroTik',
    prompt: 'Action NAT yang digunakan agar jaringan lokal dapat berbagi koneksi melalui interface internet adalah...',
    options: ['drop', 'accept', 'redirect', 'masquerade'],
    answer: 3,
  },
  {
    topic: 'MikroTik',
    prompt: 'Menu Winbox yang digunakan untuk mengubah nama perangkat adalah...',
    options: ['IP > Addresses', 'System > Identity', 'Interfaces > Ethernet', 'Tools > Profile'],
    answer: 1,
  },
];

const requiredLearningSteps = [
  'pengantar-konsep', 'pengantar-topologi', 'pengantar-latihan',
  'cisco-pengenalan', 'cisco-router', 'cisco-switch', 'cisco-routing', 'cisco-latihan',
  'mikrotik-pengenalan', 'mikrotik-winbox', 'mikrotik-routeros', 'mikrotik-latihan',
];
const lessonPages = {
  'pengantar-konsep': 'materi.html', 'pengantar-topologi': 'topologi.html',
  'pengantar-latihan': 'latihan-pengantar.html',
  'cisco-pengenalan': 'cisco.html', 'cisco-router': 'cisco-router.html',
  'cisco-switch': 'cisco-switch.html', 'cisco-routing': 'cisco-routing.html',
  'cisco-latihan': 'latihan-cisco.html',
  'mikrotik-pengenalan': 'mikrotik.html', 'mikrotik-winbox': 'mikrotik-winbox.html',
  'mikrotik-routeros': 'mikrotik-routeros.html',
  'mikrotik-latihan': 'latihan-mikrotik.html',
};
let savedLearningProgress = [];
try {
  savedLearningProgress = NetrivoSession.read('netrivoProgressV6', []);
  if (!Array.isArray(savedLearningProgress)) savedLearningProgress = [];
} catch {
  savedLearningProgress = [];
}
const unfinishedSteps = requiredLearningSteps.filter((step) => !savedLearningProgress.includes(step));
const completedRequiredSteps = requiredLearningSteps.length - unfinishedSteps.length;
const directEvaluation = new URLSearchParams(window.location.search).get('mode') === 'langsung';
const isEvaluationReady = directEvaluation || unfinishedSteps.length === 0;
const lockEl = document.querySelector('[data-quiz-lock]');
const quizContentEl = document.querySelector('[data-quiz-content]');
const evaluationStartEl = document.querySelector('[data-evaluation-start]');
const beginEvaluationButton = document.querySelector('[data-begin-evaluation]');
const evaluationTimerEl = document.querySelector('[data-evaluation-timer]');
const evaluationTimeEl = document.querySelector('[data-evaluation-time]');
const reviewMaterialLink = document.querySelector('[data-review-material]');
const stopEvaluationDialog = document.querySelector('[data-evaluation-stop-dialog]');
const cancelStopEvaluationButton = document.querySelector('[data-cancel-stop-evaluation]');
const confirmStopEvaluationButton = document.querySelector('[data-confirm-stop-evaluation]');
const requirementsEl = document.querySelector('[data-requirements]');
const resumeLink = document.querySelector('[data-resume-learning]');

if (lockEl && quizContentEl && !isEvaluationReady) {
  lockEl.hidden = false;
  quizContentEl.hidden = true;
  if (requirementsEl) {
    requirementsEl.innerHTML = `<strong>${completedRequiredSteps} dari ${requiredLearningSteps.length} langkah selesai</strong><span>${unfinishedSteps.length} langkah masih perlu diselesaikan</span>`;
  }
  if (resumeLink) resumeLink.href = lessonPages[unfinishedSteps[0]] || 'materi.html';
}

const questionEl = document.querySelector('[data-question]');
const answersEl = document.querySelector('[data-answers]');
const counterEl = document.querySelector('[data-counter]');
const progressEl = document.querySelector('[data-progress]');
const numberEl = document.querySelector('[data-question-number]');
const nextButton = document.querySelector('[data-next]');
const quizFeedbackEl = document.querySelector('[data-quiz-feedback]');

const quizVersion = 5;
const storedQuiz = NetrivoSession.read('netrivoQuiz', {});
const hasValidQuestionOrder = storedQuiz.version === quizVersion
  && Array.isArray(storedQuiz.questionOrder)
  && storedQuiz.questionOrder.length === questionBank.length
  && new Set(storedQuiz.questionOrder).size === questionBank.length
  && storedQuiz.questionOrder.every((index) => Number.isInteger(index) && index >= 0 && index < questionBank.length);
const savedQuiz = hasValidQuestionOrder ? storedQuiz : {};

function shuffleQuestionOrder(previousOrder = []) {
  const order = questionBank.map((_, index) => index);
  for (let index = order.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [order[index], order[target]] = [order[target], order[index]];
  }
  if (order.length > 1 && previousOrder.length === order.length && order.every((value, index) => value === previousOrder[index])) {
    order.push(order.shift());
  }
  return order;
}

let questionOrder = hasValidQuestionOrder ? savedQuiz.questionOrder.slice() : shuffleQuestionOrder();
let questions = questionOrder.map((index) => questionBank[index]);
let currentQuestion = Number.isInteger(savedQuiz.currentQuestion) ? Math.max(0, Math.min(savedQuiz.currentQuestion, questions.length - 1)) : 0;
const answers = questions.map((question, index) => {
  const answer = savedQuiz.answers?.[index];
  return Number.isInteger(answer) && answer >= 0 && answer < question.options.length ? answer : undefined;
});
let quizStatus = savedQuiz.status || 'in-progress';
const evaluationDuration = 15 * 60 * 1000;
let evaluationDeadline = Number.isFinite(Number(savedQuiz.deadline)) ? Number(savedQuiz.deadline) : 0;
let evaluationTimerInterval = 0;
const saveQuiz = () => NetrivoSession.write('netrivoQuiz', {
  version: quizVersion,
  questionOrder,
  currentQuestion,
  answers,
  status: quizStatus,
  deadline: evaluationDeadline,
});

function stopEvaluationTimer(clearDeadline = false) {
  if (evaluationTimerInterval) window.clearInterval(evaluationTimerInterval);
  evaluationTimerInterval = 0;
  if (clearDeadline) evaluationDeadline = 0;
  if (evaluationTimerEl) {
    evaluationTimerEl.hidden = true;
    evaluationTimerEl.classList.remove('is-urgent');
  }
}

function saveEvaluationResult() {
  const correct = answers.filter((answer, index) => answer === questions[index].answer).length;
  const answered = answers.filter((answer) => Number.isInteger(answer)).length;
  const score = Math.round((correct / questions.length) * 100);
  const remainingTime = evaluationDeadline ? Math.max(0, evaluationDeadline - Date.now()) : 0;
  const durationUsed = Math.min(evaluationDuration, Math.max(0, evaluationDuration - remainingTime));

  NetrivoSession.write('netrivoScore', score);
  NetrivoSession.write('netrivoCorrect', correct);
  NetrivoSession.write('netrivoEvaluationStats', {
    score,
    correct,
    incorrect: Math.max(0, answered - correct),
    unanswered: Math.max(0, questions.length - answered),
    answered,
    total: questions.length,
    durationUsed,
  });

  return score;
}

function finishEvaluationBecauseTimeExpired() {
  if (quizStatus !== 'in-progress') return;
  saveEvaluationResult();
  quizStatus = 'completed';
  stopEvaluationTimer(true);
  saveQuiz();
  window.location.href = directEvaluation ? 'hasil.html?mode=langsung' : 'hasil.html';
}

function updateEvaluationTimer() {
  if (!evaluationTimeEl || !evaluationDeadline) return;
  const remaining = Math.max(0, evaluationDeadline - Date.now());
  const totalSeconds = Math.ceil(remaining / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  evaluationTimeEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  evaluationTimerEl?.classList.toggle('is-urgent', remaining > 0 && remaining <= 60_000);
  if (remaining <= 0) finishEvaluationBecauseTimeExpired();
}

function startEvaluationTimer() {
  if (!evaluationDeadline || !evaluationTimerEl) return;
  evaluationTimerEl.hidden = false;
  updateEvaluationTimer();
  if (!evaluationTimerInterval) evaluationTimerInterval = window.setInterval(updateEvaluationTimer, 1000);
}

function showEvaluationQuestions() {
  if (evaluationStartEl) evaluationStartEl.hidden = true;
  if (quizContentEl) quizContentEl.hidden = false;
}

function showEvaluationPreparation() {
  stopEvaluationTimer();
  if (evaluationStartEl) evaluationStartEl.hidden = false;
  if (quizContentEl) quizContentEl.hidden = true;
}

function isEvaluationRunning() {
  return quizStatus === 'in-progress'
    && evaluationDeadline > Date.now()
    && Boolean(quizContentEl && !quizContentEl.hidden);
}

function resetEvaluationProgress() {
  stopEvaluationTimer(true);
  answers.length = 0;
  currentQuestion = 0;
  quizStatus = 'in-progress';
  if (nextButton) nextButton.dataset.mode = '';
  saveQuiz();
}

function renderQuestion() {
  if (!isEvaluationReady || !questionEl || !answersEl || !counterEl || !progressEl || !numberEl || !nextButton) return;

  const question = questions[currentQuestion];
  questionEl.textContent = question.prompt;
  counterEl.textContent = `${String(currentQuestion + 1).padStart(2, '0')} / ${String(questions.length).padStart(2, '0')}`;
  numberEl.textContent = `Pertanyaan ${String(currentQuestion + 1).padStart(2, '0')}`;
  progressEl.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  nextButton.textContent = currentQuestion === questions.length - 1 ? 'Lihat hasil' : 'Pertanyaan berikutnya';
  nextButton.disabled = answers[currentQuestion] === undefined;
  if (quizStatus === 'retry') {
    nextButton.dataset.mode = 'retry';
    nextButton.textContent = 'Ulangi kuis';
    nextButton.disabled = false;
    const correct = answers.filter((answer, index) => answer === questions[index].answer).length;
    if (quizFeedbackEl) quizFeedbackEl.textContent = `${correct} dari ${questions.length} jawaban benar. Kamu perlu mengulangi kuis.`;
  } else if (answers[currentQuestion] !== undefined && quizFeedbackEl) {
    quizFeedbackEl.textContent = 'Jawaban sudah dipilih dan tidak dapat diubah.';
  }

  answersEl.innerHTML = '';
  question.options.forEach((option, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
    if (answers[currentQuestion] === index) button.classList.add('selected');
    button.disabled = answers[currentQuestion] !== undefined;
    button.addEventListener('click', () => {
      if (answers[currentQuestion] !== undefined) return;
      answers[currentQuestion] = index;
      saveQuiz();
      if (quizFeedbackEl) quizFeedbackEl.textContent = 'Jawaban sudah dipilih dan tidak dapat diubah.';
      renderQuestion();
    });
    answersEl.appendChild(button);
  });
}

if (quizContentEl && evaluationStartEl) {
  if (!isEvaluationReady) {
    evaluationStartEl.hidden = true;
    quizContentEl.hidden = true;
  } else if (quizStatus === 'in-progress' && evaluationDeadline > 0) {
    showEvaluationQuestions();
    if (evaluationDeadline <= Date.now()) finishEvaluationBecauseTimeExpired();
    else startEvaluationTimer();
  } else if (quizStatus === 'retry') {
    showEvaluationQuestions();
  } else {
    showEvaluationPreparation();
  }
}

beginEvaluationButton?.addEventListener('click', () => {
  questionOrder = shuffleQuestionOrder(questionOrder);
  questions = questionOrder.map((index) => questionBank[index]);
  answers.length = 0;
  currentQuestion = 0;
  quizStatus = 'in-progress';
  evaluationDeadline = Date.now() + evaluationDuration;
  if (nextButton) nextButton.dataset.mode = '';
  if (quizFeedbackEl) quizFeedbackEl.textContent = 'Pilih satu jawaban untuk setiap pertanyaan.';
  saveQuiz();
  showEvaluationQuestions();
  renderQuestion();
  startEvaluationTimer();
});

reviewMaterialLink?.addEventListener('click', (event) => {
  if (!isEvaluationRunning() || !stopEvaluationDialog) return;

  event.preventDefault();
  if (!stopEvaluationDialog.open) stopEvaluationDialog.showModal();
  cancelStopEvaluationButton?.focus();
});

cancelStopEvaluationButton?.addEventListener('click', () => {
  stopEvaluationDialog?.close();
});

stopEvaluationDialog?.addEventListener('cancel', (event) => {
  event.preventDefault();
  stopEvaluationDialog.close();
});

stopEvaluationDialog?.addEventListener('click', (event) => {
  if (event.target === stopEvaluationDialog) stopEvaluationDialog.close();
});

confirmStopEvaluationButton?.addEventListener('click', () => {
  const materialUrl = reviewMaterialLink?.href || 'materi.html';
  resetEvaluationProgress();
  stopEvaluationDialog?.close();
  window.location.href = materialUrl;
});

if (nextButton && isEvaluationReady) {
  nextButton.addEventListener('click', () => {
    if (nextButton.dataset.mode === 'retry') {
      questionOrder = shuffleQuestionOrder(questionOrder);
      questions = questionOrder.map((index) => questionBank[index]);
      answers.length = 0;
      currentQuestion = 0;
      quizStatus = 'in-progress';
      evaluationDeadline = Date.now() + evaluationDuration;
      saveQuiz();
      nextButton.dataset.mode = '';
      if (quizFeedbackEl) quizFeedbackEl.textContent = 'Pilih satu jawaban untuk setiap pertanyaan.';
      renderQuestion();
      startEvaluationTimer();
      return;
    }
    if (answers[currentQuestion] === undefined) return;
    if (currentQuestion < questions.length - 1) {
      currentQuestion += 1;
      saveQuiz();
      if (quizFeedbackEl) quizFeedbackEl.textContent = 'Pilih satu jawaban untuk pertanyaan ini.';
      renderQuestion();
      return;
    }

    saveEvaluationResult();
    quizStatus = 'completed';
    stopEvaluationTimer(true);
    saveQuiz();
    window.location.href = directEvaluation ? 'hasil.html?mode=langsung' : 'hasil.html';
  });
}

renderQuestion();

const scoreEl = document.querySelector('[data-score]');
if (scoreEl) {
  const score = Number(NetrivoSession.read('netrivoScore', 0));
  const correct = Number(NetrivoSession.read('netrivoCorrect', 0));
  const savedStats = NetrivoSession.read('netrivoEvaluationStats', {});
  const total = Number(savedStats.total) || questions.length;
  const answered = Number.isFinite(Number(savedStats.answered)) ? Number(savedStats.answered) : total;
  const incorrect = Number.isFinite(Number(savedStats.incorrect)) ? Number(savedStats.incorrect) : Math.max(0, answered - correct);
  const unanswered = Number.isFinite(Number(savedStats.unanswered)) ? Number(savedStats.unanswered) : Math.max(0, total - answered);
  const durationUsed = Number(savedStats.durationUsed) || 0;
  const passed = score >= 75;
  const title = document.querySelector('[data-result-title]');
  const message = document.querySelector('[data-result-message]');
  const scoreTitle = document.querySelector('[data-score-title]');
  const detail = document.querySelector('[data-score-detail]');
  const icon = document.querySelector('[data-result-icon]');
  const correctEl = document.querySelector('[data-stat-correct]');
  const incorrectEl = document.querySelector('[data-stat-incorrect]');
  const unansweredEl = document.querySelector('[data-stat-unanswered]');
  const durationEl = document.querySelector('[data-stat-duration]');
  const achievementEl = document.querySelector('[data-achievement-progress]');
  const achievementTextEl = document.querySelector('[data-achievement-text]');
  const recommendationEl = document.querySelector('[data-result-recommendation]');
  const scoreRingEl = document.querySelector('.evaluation-score-ring');
  const passRetryEl = document.querySelector('[data-pass-retry]');

  scoreEl.textContent = String(score);
  if (!passed) document.body.classList.add('failed');
  if (icon) icon.textContent = passed ? 'Tercapai' : 'Perlu ditingkatkan';
  if (title) title.textContent = passed ? 'Evaluasi berhasil diselesaikan' : 'Nilai minimum belum tercapai';
  if (message) message.textContent = passed ? 'Pemahamanmu sudah mencapai standar kelulusan evaluasi.' : 'Pelajari kembali bagian materi yang belum dikuasai, kemudian ulangi evaluasi dari awal.';
  if (scoreTitle) scoreTitle.textContent = passed ? 'Standar kelulusan tercapai' : 'Belum mencapai nilai minimum 75';
  if (detail) detail.textContent = `${correct} dari ${total} pertanyaan dijawab dengan benar.`;
  if (correctEl) correctEl.textContent = `${correct} / ${total}`;
  if (incorrectEl) incorrectEl.textContent = String(incorrect);
  if (unansweredEl) unansweredEl.textContent = String(unanswered);
  if (durationEl) {
    const totalSeconds = Math.round(durationUsed / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    durationEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  if (achievementEl) achievementEl.style.width = `${Math.max(0, Math.min(100, score))}%`;
  if (achievementTextEl) achievementTextEl.textContent = `${score}% dari target minimum 75%`;
  if (scoreRingEl) scoreRingEl.style.setProperty('--score', String(Math.max(0, Math.min(100, score))));
  if (recommendationEl) recommendationEl.hidden = passed;
  if (passRetryEl) passRetryEl.hidden = !passed;
}

const retryQuizLinks = document.querySelectorAll('[data-retry-quiz]');
retryQuizLinks.forEach((retryQuizLink) => {
  if (directEvaluation) retryQuizLink.href = 'quiz.html?mode=langsung';
  retryQuizLink.addEventListener('click', () => {
    NetrivoSession.write('netrivoQuiz', { version: quizVersion, currentQuestion: 0, answers: [], status: 'in-progress', deadline: 0 });
  });
});
