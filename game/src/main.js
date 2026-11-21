// Dua Senja — boot. Fixed-step simulation (60 Hz) with a render every animation
// frame; the canvas scales to the window while the game always thinks in 1280x720.
import { FIELD, STEP } from './config.js';
import { freshState, startGame, tick, loadBest, saveBest } from './state.js';
import { render } from './render.js';
import { attachInput } from './input.js';
import { stageShot } from './shots.js';
import { playTick } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

function fitCanvas() {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = FIELD.width * dpr;
  canvas.height = FIELD.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

fitCanvas();
window.addEventListener('resize', fitCanvas);

const params = new URLSearchParams(window.location.search);
const seed = Number(params.get('seed') || 7);
let state;
let staged = false;
if (params.has('shot')) {
  state = stageShot(params);
  staged = true;
} else {
  state = freshState(seed);
  loadBest(state);
}
attachInput(canvas, state);

let last = performance.now();
let acc = 0;
let lastWholeSecond = Math.ceil(state.timeLeft);

function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  acc += dt;
  while (acc >= STEP) {
    tick(state, STEP);
    acc -= STEP;
    const whole = Math.ceil(state.timeLeft);
    if (state.screen === 'play' && whole !== lastWholeSecond) {
      lastWholeSecond = whole;
      if (whole <= 10 && whole > 0) playTick();
    }
  }
  render(ctx, state);
  if (state.screen === 'win' || state.screen === 'gameover') saveBest(state);
  requestAnimationFrame(frame);
}

// A staged screenshot must not keep ticking the timer away before the capture.
if (staged) {
  render(ctx, state);
} else {
  document.getElementById('status').textContent =
    'Dua Senja: cari selisih di dua gambar. Klik untuk mulai.';
  requestAnimationFrame(frame);
}

// Expose the state for play-testing from the console.
window.__duaSenja = state;
