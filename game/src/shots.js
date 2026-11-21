// Dua Senja — screenshot staging. A shot plays the real rules forward from a fresh
// level for a fixed script: find N differences in a seeded order, then freeze the
// frame. The screenshots are real renders of the game's own code, and the same seed
// always gives the same frame.
//
//   ?shot=play&level=1&found=4&seed=7   mid-play, 4 found
//   ?shot=hint&level=3&found=7&seed=7   hint pulsing on one unfound difference
//   ?shot=clear&level=1&seed=7         level-clear screen after finding them all
//   ?shot=menu&seed=7                  title screen
import { freshState, startLevel, clickAt, useHint, levelOf } from './state.js';
import { LEVEL_TIME } from './config.js';

function applyFinds(state, count) {
  const level = levelOf(state);
  // Seeded order, spread across the panel — not the definition order.
  const order = [];
  const seen = new Set();
  let guard = 0;
  while (order.length < count && guard < 500) {
    guard += 1;
    const i = Math.floor(state.rng() * level.diffs.length);
    if (seen.has(i)) continue;
    seen.add(i);
    order.push(i);
  }
  for (const i of order) {
    const z = level.diffs[i].zone;
    clickAt(state, z.x, z.y);
  }
  return order;
}

/**
 * Stage a named shot on a fresh state and return it. `query` is a URLSearchParams.
 * Any unknown shot name falls back to the title screen.
 */
export function stageShot(query) {
  const seed = Number(query.get('seed') || 7);
  const shot = query.get('shot') || 'play';
  const levelIndex = Math.min(2, Math.max(0, Number(query.get('level') || 1) - 1));
  const state = freshState(seed);
  state.screen = 'menu';

  if (shot === 'menu') return state;

  startLevel(state, levelIndex);
  const level = levelOf(state);
  if (shot === 'clear') {
    applyFinds(state, level.diffs.length);
    return state;
  }
  const found = Math.min(level.diffs.length - 1, Number(query.get('found') || 4));
  applyFinds(state, found);
  // Freeze the timer where the shot wants it: mid-play still has time to feel.
  const want = Number(query.get('time'));
  state.timeLeft = Number.isFinite(want) && want > 0 ? want : LEVEL_TIME[levelIndex] * 0.6;
  if (shot === 'hint') {
    useHint(state);
    state.timeLeft = 38;
  }
  return state;
}
