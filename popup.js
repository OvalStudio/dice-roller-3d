// ---- Dice Roller 3D ----
const cube       = document.getElementById('cube');
const poly       = document.getElementById('poly');
const polyNum    = document.getElementById('polyNum');
const dieWrap    = document.getElementById('dieWrap');
const stage      = document.querySelector('.stage');
const resultNum  = document.getElementById('resultNum');
const rollBtn    = document.getElementById('rollBtn');
const muteBtn    = document.getElementById('muteBtn');
const chips      = [...document.querySelectorAll('.chip')];
const historyEl  = document.getElementById('historyList');

let sides = 6;
let rolling = false;
let muted = false;
let history = [];

// ---- pip layouts for d6 faces (grid cell indices 1..9) ----
const PIP_MAP = {
  1: [5],
  2: [1, 9],
  3: [1, 5, 9],
  4: [1, 3, 7, 9],
  5: [1, 3, 5, 7, 9],
  6: [1, 3, 4, 6, 7, 9],
};

function renderFace(faceEl, value) {
  const cells = PIP_MAP[value] || [];
  let html = '';
  for (let i = 1; i <= 9; i++) {
    html += cells.includes(i) ? '<span class="dot"></span>' : '<span></span>';
  }
  faceEl.innerHTML = html;
}

// Pre-fill all 6 cube faces with their canonical values so the tumble looks real
function initCubeFaces() {
  const order = { front: 1, back: 6, right: 3, left: 4, top: 2, bottom: 5 };
  for (const [cls, val] of Object.entries(order)) {
    renderFace(document.querySelector('.face.' + cls + ' .pips'), val);
  }
}

// ---- WebAudio dice clatter ----
let audioCtx;
function playRollSound() {
  if (muted) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    // a few short noise bursts = clattering
    for (let i = 0; i < 5; i++) {
      const t = now + i * 0.12 + Math.random() * 0.04;
      const buffer = audioCtx.createBuffer(1, 1024, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let j = 0; j < data.length; j++) data[j] = (Math.random() * 2 - 1) * 0.6;
      const src = audioCtx.createBufferSource();
      src.buffer = buffer;
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0.0, t);
      g.gain.linearRampToValueAtTime(0.35, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      const f = audioCtx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = 1200 + Math.random() * 1800;
      src.connect(f); f.connect(g); g.connect(audioCtx.destination);
      src.start(t); src.stop(t + 0.1);
    }
  } catch (e) { /* no audio available */ }
}

function playDingSound() {
  if (muted) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.12);
    g.gain.setValueAtTime(0.0, now);
    g.gain.linearRampToValueAtTime(0.25, now + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.connect(g); g.connect(audioCtx.destination);
    osc.start(now); osc.stop(now + 0.4);
  } catch (e) {}
}

// ---- selector ----
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    if (rolling) return;
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    sides = parseInt(chip.dataset.sides, 10);
    swapDie();
    resultNum.textContent = '—';
  });
});

function swapDie() {
  if (sides === 6) {
    cube.classList.remove('hidden');
    poly.classList.add('hidden');
  } else {
    cube.classList.add('hidden');
    poly.classList.remove('hidden');
    poly.classList.toggle('is-d12', sides === 12);
    poly.classList.toggle('is-d20', sides === 20);
    polyNum.textContent = sides;
  }
}

// ---- roll ----
function roll() {
  if (rolling) return;
  rolling = true;
  rollBtn.disabled = true;
  resultNum.textContent = '…';

  const value = Math.floor(Math.random() * sides) + 1;
  playRollSound();

  dieWrap.classList.add('rolling');

  // flicker numbers on poly dice while spinning for extra realism
  let flicker;
  if (sides !== 6) {
    flicker = setInterval(() => {
      polyNum.textContent = Math.floor(Math.random() * sides) + 1;
    }, 70);
  }

  setTimeout(() => {
    dieWrap.classList.remove('rolling');
    if (flicker) clearInterval(flicker);

    if (sides === 6) {
      // show the rolled value on the front face and face it forward
      renderFace(document.querySelector('.face.front .pips'), value);
      cube.style.transform = 'rotateX(0deg) rotateY(0deg)';
    } else {
      polyNum.textContent = value;
    }

    resultNum.textContent = value;
    resultNum.classList.remove('bounce'); void resultNum.offsetWidth;
    resultNum.classList.add('bounce');
    playDingSound();

    addHistory(value);
    rolling = false;
    rollBtn.disabled = false;
  }, 900);
}

function addHistory(v) {
  history.unshift('d' + sides + ': ' + v);
  history = history.slice(0, 6);
  historyEl.innerHTML = history.map(h => '<span class="pill">' + h + '</span>').join('');
}

// ---- mute (persisted) ----
function loadMute() {
  try {
    const saved = localStorage.getItem('dice_muted');
    muted = saved === '1';
  } catch (e) {}
  muteBtn.textContent = muted ? '🔇' : '🔊';
}
muteBtn.addEventListener('click', () => {
  muted = !muted;
  muteBtn.textContent = muted ? '🔇' : '🔊';
  try { localStorage.setItem('dice_muted', muted ? '1' : '0'); } catch (e) {}
});

rollBtn.addEventListener('click', roll);
// keyboard: space / enter to roll
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); roll(); }
});

// ---- init ----
initCubeFaces();
swapDie();
loadMute();

// auto-roll a beat after popup opens, so the user is greeted with motion
window.addEventListener('load', () => {
  setTimeout(roll, 250);
});
