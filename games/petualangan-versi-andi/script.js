/* =========================================================
   PETUALANGAN JARINGAN - script.js
   Game platformer 2D sederhana, vanilla JavaScript + Canvas.
   Struktur kode dibagi jadi beberapa bagian agar mudah dibaca:
   1. Referensi elemen & state global
   2. Navigasi antar layar (menu, petunjuk, dll)
   3. Data level (platform, paket data, rintangan, tujuan)
   4. Fisika & loop game
   5. Tabrakan (collision)
   6. Render (gambar ke canvas)
   ========================================================= */

/* ---------- 1. Referensi elemen & state global ---------- */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const hudLives   = document.getElementById('hudLives');
const hudPackets = document.getElementById('hudPackets');
const hudTotal   = document.getElementById('hudTotal');
const hudTime    = document.getElementById('hudTime');
const hudLevel   = document.getElementById('hudLevel');
const hintBox    = document.getElementById('hint');

let soundOn = true;
let levelNumber = 1;          // hanya kosmetik, dipakai untuk label "Level 1-x"
let lives, packetsCollected, timeLeft;
let cameraX = 0;
let state = 'menu';           // menu | help | settings | playing | win | over
let loopId = null;
let timerId = null;

const GRAVITY = 0.6;
const MOVE_SPEED = 4;
const JUMP_FORCE = -12;
const START_X = 40, START_Y = 260;

const keys = { left: false, right: false, jump: false };

/* ---------- 2. Navigasi antar layar ---------- */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  reportEmbeddedHeight();
}

document.getElementById('btnStart').onclick = () => startGame();
document.getElementById('btnHelp').onclick = () => showScreen('helpScreen');
document.getElementById('btnSettings').onclick = () => showScreen('settingsScreen');
document.querySelectorAll('.backBtn').forEach(b => b.onclick = () => showScreen('menuScreen'));
document.querySelectorAll('.toMenuBtn').forEach(b => b.onclick = () => { stopGame(); showScreen('menuScreen'); });
document.getElementById('btnRetry').onclick = () => startGame();
document.getElementById('btnNext').onclick = () => { levelNumber++; startGame(); };

document.getElementById('toggleSound').onclick = (e) => {
  soundOn = !soundOn;
  e.target.textContent = soundOn ? 'ON' : 'OFF';
  e.target.classList.toggle('on', soundOn);
  e.target.classList.toggle('off', !soundOn);
};

/* Efek suara sederhana pakai WebAudio, tanpa file eksternal */
function beep(freq, duration) {
  if (!soundOn) return;
  try {
    const actx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = actx.createOscillator();
    const gain = actx.createGain();
    osc.frequency.value = freq;
    osc.connect(gain); gain.connect(actx.destination);
    gain.gain.setValueAtTime(0.08, actx.currentTime);
    osc.start();
    osc.stop(actx.currentTime + duration);
  } catch (e) { /* abaikan jika browser memblokir audio */ }
}

/* ---------- 3. Data level ---------- */
// Setiap objek berbentuk kotak {x, y, w, h}. Level bisa dikembangkan
// dengan menambah level baru pada array LEVELS.
function buildLevel() {
  return {
    width: 2600,
    ground: [
      { x: 0,    y: 380, w: 600,  h: 70 },   // segmen 1
      // celah / lubang di x 600-680
      { x: 680,  y: 380, w: 500,  h: 70 },   // segmen 2
      // celah / lubang di x 1180-1260
      { x: 1260, y: 380, w: 1340, h: 70 }    // segmen 3 s/d akhir
    ],
    platforms: [
      { x: 300,  y: 280, w: 140, h: 24 },
      { x: 760,  y: 250, w: 140, h: 24 },
      { x: 1450, y: 270, w: 160, h: 24 }
    ],
    packets: [
      { x: 150,  y: 330, collected: false },
      { x: 350,  y: 230, collected: false },
      { x: 820,  y: 200, collected: false },
      { x: 950,  y: 330, collected: false },
      { x: 1500, y: 220, collected: false },
      { x: 2100, y: 330, collected: false }
    ],
    fires: [
      { x: 500,  y: 350, w: 30, h: 30 },
      { x: 1050, y: 350, w: 30, h: 30 },
      { x: 1900, y: 350, w: 30, h: 30 }
    ],
    goal: { x: 2500, y: 250, w: 70, h: 130 }
  };
}
let level;
let player;

/* ---------- 4. Fisika & loop game ---------- */
function startGame() {
  lives = parseInt(document.getElementById('livesSelect').value, 10);
  packetsCollected = 0;
  timeLeft = 150; // 02:30
  level = buildLevel();
  player = { x: START_X, y: START_Y, w: 34, h: 46, vx: 0, vy: 0, onGround: false, facing: 1, invuln: 0 };

  hudTotal.textContent = level.packets.length;
  hudLevel.textContent = '1-' + levelNumber;
  updateHud();
  hideHint();

  state = 'playing';
  showScreen('gameScreen');

  clearInterval(timerId);
  timerId = setInterval(() => {
    if (state !== 'playing') return;
    timeLeft--;
    if (timeLeft <= 0) { gameOver('Waktu habis! Coba lagi.'); }
    updateHud();
  }, 1000);

  cancelAnimationFrame(loopId);
  loopId = requestAnimationFrame(gameLoop);
}

function stopGame() {
  state = 'menu';
  clearInterval(timerId);
  cancelAnimationFrame(loopId);
}

function gameLoop() {
  if (state === 'playing') {
    update();
    render();
    loopId = requestAnimationFrame(gameLoop);
  }
}

function update() {
  // Input gerak
  if (keys.left)  { player.vx = -MOVE_SPEED; player.facing = -1; }
  else if (keys.right) { player.vx = MOVE_SPEED; player.facing = 1; }
  else { player.vx = 0; }

  if (keys.jump && player.onGround) {
    player.vy = JUMP_FORCE;
    player.onGround = false;
    beep(500, 0.08);
  }

  player.vy += GRAVITY;
  moveAndCollide();

  if (player.invuln > 0) player.invuln--;

  checkPackets();
  checkFires();
  checkFall();
  checkGoal();

  // Kamera mengikuti pemain secara horizontal
  cameraX = Math.max(0, Math.min(player.x - canvas.width / 2, level.width - canvas.width));
}

/* ---------- 5. Tabrakan ---------- */
function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function moveAndCollide() {
  const solids = level.ground.concat(level.platforms);

  // Gerak horizontal lalu selesaikan tabrakan sumbu X
  player.x += player.vx;
  solids.forEach(s => {
    if (rectsOverlap(player, s)) {
      if (player.vx > 0) player.x = s.x - player.w;
      else if (player.vx < 0) player.x = s.x + s.w;
    }
  });
  player.x = Math.max(0, Math.min(player.x, level.width - player.w));

  // Gerak vertikal lalu selesaikan tabrakan sumbu Y
  player.y += player.vy;
  player.onGround = false;
  solids.forEach(s => {
    if (rectsOverlap(player, s)) {
      if (player.vy > 0) { player.y = s.y - player.h; player.vy = 0; player.onGround = true; }
      else if (player.vy < 0) { player.y = s.y + s.h; player.vy = 0; }
    }
  });
}

function checkPackets() {
  level.packets.forEach(p => {
    if (!p.collected && rectsOverlap(player, { x: p.x, y: p.y, w: 22, h: 22 })) {
      p.collected = true;
      packetsCollected++;
      beep(800, 0.1);
      updateHud();
    }
  });
}

function checkFires() {
  if (player.invuln > 0) return;
  level.fires.forEach(f => {
    if (rectsOverlap(player, f)) loseLife('Tersambar firewall! Coba lagi.');
  });
}

function checkFall() {
  if (player.y > canvas.height + 80) loseLife('Jatuh ke lubang jaringan!');
}

function checkGoal() {
  if (rectsOverlap(player, level.goal)) {
    if (packetsCollected >= level.packets.length) {
      winLevel();
    } else {
      showHint('Kumpulkan semua data dulu! 📄');
    }
  }
}

function loseLife(reason) {
  lives--;
  updateHud();
  beep(150, 0.2);
  if (lives <= 0) {
    gameOver(reason);
  } else {
    player.x = START_X; player.y = START_Y; player.vx = 0; player.vy = 0;
    player.invuln = 60; // sekitar 1 detik kebal setelah respawn
  }
}

function winLevel() {
  state = 'win';
  clearInterval(timerId);
  cancelAnimationFrame(loopId);
  showScreen('winScreen');
}

function gameOver(reason) {
  state = 'over';
  clearInterval(timerId);
  cancelAnimationFrame(loopId);
  document.getElementById('overReason').textContent = reason;
  showScreen('overScreen');
}

function showHint(text) { hintBox.textContent = text; hintBox.style.display = 'block'; }
function hideHint() { hintBox.style.display = 'none'; }

function updateHud() {
  hudLives.textContent = lives;
  hudPackets.textContent = packetsCollected;
  const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const s = String(timeLeft % 60).padStart(2, '0');
  hudTime.textContent = m + ':' + s;
}

/* ---------- Kontrol keyboard ---------- */
window.addEventListener('keydown', (e) => {
  if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.left = true;
  if (['ArrowRight', 'KeyD'].includes(e.code)) keys.right = true;
  if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) { keys.jump = true; e.preventDefault(); }
});
window.addEventListener('keyup', (e) => {
  if (['ArrowLeft', 'KeyA'].includes(e.code)) keys.left = false;
  if (['ArrowRight', 'KeyD'].includes(e.code)) keys.right = false;
  if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) keys.jump = false;
});

/* ---------- 6. Render ---------- */
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Langit
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, '#7EC8F2'); sky.addColorStop(1, '#CDEBFF');
  ctx.fillStyle = sky; ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Awan (parallax ringan)
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  [120, 420, 700].forEach((cx, i) => drawCloud(cx - cameraX * 0.3, 60 + i * 20));

  ctx.save();
  ctx.translate(-cameraX, 0);

  // Tanah
  level.ground.forEach(g => drawGround(g));
  level.platforms.forEach(p => drawGround(p));

  // Rintangan api / firewall
  level.fires.forEach(f => { ctx.font = '28px sans-serif'; ctx.fillText('🔥', f.x - 2, f.y + 26); });

  // Paket data
  level.packets.forEach(p => {
    if (!p.collected) { ctx.font = '24px sans-serif'; ctx.fillText('📄', p.x, p.y + 20); }
  });

  // Server tujuan
  drawGoal(level.goal);

  // Pemain
  drawPlayer();

  ctx.restore();
}

function drawCloud(x, y) {
  ctx.beginPath();
  ctx.ellipse(x, y, 30, 16, 0, 0, Math.PI * 2);
  ctx.ellipse(x + 26, y + 4, 22, 14, 0, 0, Math.PI * 2);
  ctx.ellipse(x - 24, y + 6, 20, 12, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawGround(g) {
  ctx.fillStyle = '#8B5A2B';
  ctx.fillRect(g.x, g.y, g.w, g.h);
  ctx.fillStyle = '#4CAF50';
  ctx.fillRect(g.x, g.y, g.w, 10);
}

function drawGoal(goal) {
  ctx.fillStyle = '#34495E';
  ctx.fillRect(goal.x, goal.y, goal.w, goal.h);
  ctx.fillStyle = '#5DADE2';
  for (let i = 0; i < 4; i++) ctx.fillRect(goal.x + 8, goal.y + 12 + i * 26, goal.w - 16, 14);
  ctx.font = '22px sans-serif';
  ctx.fillText('📶', goal.x + goal.w / 2 - 12, goal.y - 8);
  ctx.fillStyle = '#16406B';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('SERVER', goal.x - 6, goal.y + goal.h + 14);
}

function drawPlayer() {
  ctx.save();
  const cx = player.x + player.w / 2, cy = player.y + player.h / 2;
  ctx.translate(cx, cy);
  ctx.scale(player.facing, 1);
  ctx.font = '38px sans-serif';
  ctx.globalAlpha = (player.invuln > 0 && player.invuln % 10 < 5) ? 0.4 : 1;
  ctx.fillText('🏃', -19, 14);
  ctx.restore();
}

function reportEmbeddedHeight() {
  requestAnimationFrame(() => {
    const height = Math.ceil(document.getElementById('app').getBoundingClientRect().height + 24);
    window.parent.postMessage({ type: 'petualangan-andi-height', height }, '*');
  });
}

if ('ResizeObserver' in window) {
  new ResizeObserver(reportEmbeddedHeight).observe(document.getElementById('app'));
}
window.addEventListener('load', reportEmbeddedHeight);
window.addEventListener('resize', reportEmbeddedHeight);
