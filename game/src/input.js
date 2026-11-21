// Dua Senja — input. Mouse clicks and keyboard, translated into logical coordinates
// and game actions. The canvas is scaled to the window; this undoes that scale.
import { FIELD, PANEL, PANEL_LEFT_X, PANEL_RIGHT_X } from './config.js';
import { clickAt, useHint, startGame, startLevel, nextLevel, togglePause } from './state.js';
import { clickTargets } from './render.js';
import { playFound, playMiss, playHint, playWin, setMuted } from './audio.js';

function toLogical(canvas, clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) / rect.width) * FIELD.width,
    y: ((clientY - rect.top) / rect.height) * FIELD.height,
  };
}

function panelHit(p) {
  if (p.y >= PANEL.y && p.y < PANEL.y + PANEL.height) {
    if (p.x >= PANEL_LEFT_X && p.x < PANEL_LEFT_X + PANEL.width) return { side: 'left', x: p.x - PANEL_LEFT_X, y: p.y - PANEL.y };
    if (p.x >= PANEL_RIGHT_X && p.x < PANEL_RIGHT_X + PANEL.width) return { side: 'right', x: p.x - PANEL_RIGHT_X, y: p.y - PANEL.y };
  }
  return null;
}

function hitTarget(targets, p) {
  return targets.find((t) => p.x >= t.x && p.x < t.x + t.w && p.y >= t.y && p.y < t.y + t.h) || null;
}

export function attachInput(canvas, state) {
  canvas.addEventListener('pointerdown', (event) => {
    const p = toLogical(canvas, event.clientX, event.clientY);
    const target = hitTarget(clickTargets(state), p);
    if (target) {
      handleTarget(state, target.id);
      return;
    }
    if (state.screen !== 'play') return;
    const hit = panelHit(p);
    if (!hit) return;
    const before = state.screen;
    const result = clickAt(state, hit.x, hit.y);
    if (result === 'found') {
      playFound();
      if (state.screen === 'levelclear' || state.screen === 'win') playWin();
    } else if (result === 'miss') {
      if (state.missMark) state.missMark.panel = hit.side;
      playMiss();
    }
    void before;
  });

  window.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'h') {
      if (useHint(state) === 'hint') playHint();
    } else if (key === 'r') {
      if (state.screen === 'play' || state.screen === 'gameover') startLevel(state, state.levelIndex);
    } else if (key === 'escape') {
      togglePause(state);
    } else if (key === 'm') {
      state.muted = !state.muted;
      setMuted(state.muted);
    } else if (key === 'enter') {
      handleTarget(state, primaryAction(state));
    } else if (key >= '1' && key <= '3' && state.screen === 'menu') {
      startLevel(state, Number(key) - 1);
    }
  });
}

function primaryAction(state) {
  if (state.screen === 'menu') return 'start';
  if (state.screen === 'levelclear') return 'next';
  if (state.screen === 'win' || state.screen === 'gameover') return 'restart';
  if (state.screen === 'paused') return 'resume';
  return null;
}

function handleTarget(state, id) {
  if (id === 'start') startGame(state);
  else if (id === 'hint') {
    if (useHint(state) === 'hint') playHint();
  } else if (id === 'next') nextLevel(state);
  else if (id === 'restart') startGame(state);
  else if (id === 'resume') togglePause(state);
  else if (id && id.startsWith('level-')) startLevel(state, Number(id.slice(6)));
}
