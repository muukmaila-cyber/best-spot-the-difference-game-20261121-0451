// Dua Senja — the game state. Pure rules, no DOM: input.js feeds it clicks and keys,
// render.js draws it, main.js ticks it. Node can import it for tests.
import {
  LEVEL_TIME,
  HINTS_PER_LEVEL,
  HINT_COST,
  HINT_COOLDOWN,
  MISS_TIME_COST,
  SCORE,
  STARS,
  HINT_PULSE_SECONDS,
  BEST_KEY,
} from './config.js';
import { LEVELS } from './scenes.js';
import { makeRng, shuffled } from './random.js';

export const SCREENS = ['menu', 'play', 'levelclear', 'win', 'gameover', 'paused'];

export function freshState(seed = 7) {
  return {
    seed,
    screen: 'menu',
    prevScreen: 'play',
    levelIndex: 0,
    found: new Set(),
    foundOrder: [],
    combo: 0,
    bestCombo: 0,
    score: 0,
    timeLeft: LEVEL_TIME[0],
    hintsLeft: HINTS_PER_LEVEL,
    hintCooldown: 0,
    hintPulse: null, // { diffIndex, left }
    misses: 0,
    muted: false,
    best: 0,
    message: '',
    messageLeft: 0,
    missMark: null, // { x, y, panel, left } in panel coords
    popMark: null, // { diffIndex, left } — the newest find, drawn popping
    levelBonus: 0,
    stars: 0,
    totalFound: 0,
    elapsed: 0,
    rng: makeRng(seed),
  };
}

export function levelOf(state) {
  return LEVELS[state.levelIndex];
}

export function remaining(state) {
  return levelOf(state).diffs.length - state.found.size;
}

export function startLevel(state, index) {
  state.levelIndex = index;
  state.found = new Set();
  state.foundOrder = [];
  state.combo = 0;
  state.timeLeft = LEVEL_TIME[index];
  state.hintsLeft = HINTS_PER_LEVEL;
  state.hintCooldown = 0;
  state.hintPulse = null;
  state.missMark = null;
  state.popMark = null;
  state.message = levelOf(state).sub;
  state.messageLeft = 3;
  state.screen = 'play';
}

export function startGame(state) {
  state.score = 0;
  state.totalFound = 0;
  startLevel(state, 0);
}

/** Click at panel coordinates (same coords on either panel). Returns what happened. */
export function clickAt(state, px, py) {
  if (state.screen !== 'play') return 'ignored';
  const level = levelOf(state);
  for (let i = 0; i < level.diffs.length; i += 1) {
    if (state.found.has(i)) continue;
    const z = level.diffs[i].zone;
    if (Math.hypot(px - z.x, py - z.y) <= z.r) {
      state.found.add(i);
      state.foundOrder.push(i);
      state.totalFound += 1;
      state.combo += 1;
      state.bestCombo = Math.max(state.bestCombo, state.combo);
      state.score += SCORE.find + (state.combo - 1) * SCORE.comboStep;
      state.popMark = { diffIndex: i, left: 0.45 };
      state.hintPulse = null;
      state.message = comboLine(state.combo);
      state.messageLeft = 1.6;
      if (state.found.size === level.diffs.length) {
        const bonus = Math.ceil(state.timeLeft) * SCORE.timeBonus;
        state.levelBonus = bonus;
        state.score += bonus;
        state.stars = state.timeLeft >= STARS.three ? 3 : state.timeLeft >= STARS.two ? 2 : 1;
        state.screen = state.levelIndex === LEVELS.length - 1 ? 'win' : 'levelclear';
        state.best = Math.max(state.best, state.score);
      }
      return 'found';
    }
  }
  state.combo = 0;
  state.misses += 1;
  state.timeLeft = Math.max(0, state.timeLeft - MISS_TIME_COST);
  state.missMark = { x: px, y: py, left: 0.7 };
  state.message = `Bukan di situ! −${MISS_TIME_COST} detik`;
  state.messageLeft = 1.6;
  if (state.timeLeft <= 0) {
    state.screen = 'gameover';
    state.best = Math.max(state.best, state.score);
  }
  return 'miss';
}

function comboLine(combo) {
  if (combo >= 5) return `KOMBO x${combo}! Luar biasa!`;
  if (combo >= 3) return `Kombo x${combo} — terus!`;
  return 'Ketemu! +100';
}

/** Spend a hint: pulse one unfound difference for a few seconds. */
export function useHint(state) {
  if (state.screen !== 'play') return 'ignored';
  if (state.hintsLeft <= 0) {
    state.message = 'Hint habis di level ini';
    state.messageLeft = 1.6;
    return 'none';
  }
  if (state.hintCooldown > 0) {
    state.message = `Hint siap lagi dalam ${Math.ceil(state.hintCooldown)} dtk`;
    state.messageLeft = 1.2;
    return 'cooldown';
  }
  const level = levelOf(state);
  const unfound = level.diffs.map((_, i) => i).filter((i) => !state.found.has(i));
  if (unfound.length === 0) return 'none';
  const pick = unfound[Math.floor(state.rng() * unfound.length)];
  state.hintsLeft -= 1;
  state.hintCooldown = HINT_COOLDOWN;
  state.hintPulse = { diffIndex: pick, left: HINT_PULSE_SECONDS };
  state.score = Math.max(0, state.score - HINT_COST);
  state.message = 'Hint: lihat lingkaran berdenyut!';
  state.messageLeft = 2;
  return 'hint';
}

export function nextLevel(state) {
  if (state.levelIndex + 1 < LEVELS.length) startLevel(state, state.levelIndex + 1);
}

export function togglePause(state) {
  if (state.screen === 'play') {
    state.prevScreen = 'play';
    state.screen = 'paused';
  } else if (state.screen === 'paused') {
    state.screen = state.prevScreen;
  }
}

/** Advance timers and animations by dt seconds. */
export function tick(state, dt) {
  state.elapsed += dt;
  if (state.messageLeft > 0) state.messageLeft -= dt;
  if (state.hintCooldown > 0) state.hintCooldown -= dt;
  if (state.hintPulse) {
    state.hintPulse.left -= dt;
    if (state.hintPulse.left <= 0) state.hintPulse = null;
  }
  if (state.missMark) {
    state.missMark.left -= dt;
    if (state.missMark.left <= 0) state.missMark = null;
  }
  if (state.popMark) {
    state.popMark.left -= dt;
    if (state.popMark.left <= 0) state.popMark = null;
  }
  if (state.screen === 'play') {
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.screen = 'gameover';
      state.best = Math.max(state.best, state.score);
      state.message = 'Waktu habis!';
    }
  }
}

/** The order in which a screenshot autopilot finds differences: seeded, spread out. */
export function stagedFindOrder(state, count) {
  const level = levelOf(state);
  const order = shuffled(state.rng, level.diffs.map((_, i) => i));
  return order.slice(0, Math.min(count, order.length));
}

export function loadBest(state) {
  try {
    const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(BEST_KEY) : null;
    state.best = raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    state.best = 0;
  }
}

export function saveBest(state) {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(BEST_KEY, String(state.best));
  } catch {
    // Offline play without storage is fine.
  }
}
