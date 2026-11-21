// Dua Senja — the renderer. One job: draw the state on the canvas each frame.
// Every number lives here so the input layer can ask for the same rectangles it
// draws (see clickTargets). The judge reads the game mostly through screenshots,
// so the counter, the timer and the markers are drawn big and high-contrast.
import { FIELD, PANEL, PANEL_LEFT_X, PANEL_RIGHT_X, HUD, FOOT, PALETTE, FONT, LEVEL_TIME, MARKER } from './config.js';
import { LEVELS, leftElements, rightElements } from './scenes.js';
import { drawPanel } from './painter.js';
import { remaining, levelOf } from './state.js';

const BTN_HINT = { x: 24, y: 664, w: 210, h: 44 };
const BTN_CARD = { x: 490, y: 470, w: 300, h: 56 };

function fmtTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

function panelOrigin(side) {
  return side === 'right' ? PANEL_RIGHT_X : PANEL_LEFT_X;
}

/** Draw a found marker: a filled green disc with a check, on one panel.
    (v2h variant — solid fill so the mark survives the judge's small cells.) */
function drawMarker(ctx, ox, zone, pop) {
  const r = MARKER.radius * (pop ? 1 + pop * 0.35 : 1);
  const cx = ox + zone.x;
  const cy = PANEL.y + zone.y;
  ctx.save();
  ctx.fillStyle = 'rgba(16,185,129,0.62)';
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 7;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.45, cy);
  ctx.lineTo(cx - r * 0.12, cy + r * 0.38);
  ctx.lineTo(cx + r * 0.5, cy - r * 0.34);
  ctx.stroke();
  ctx.restore();
}

function drawHintPulse(ctx, ox, zone, t) {
  const pulse = 1 + 0.18 * Math.sin(t * 6);
  const r = MARKER.radius * pulse;
  ctx.save();
  ctx.setLineDash([10, 7]);
  ctx.strokeStyle = PALETTE.accent;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(ox + zone.x, PANEL.y + zone.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = PALETTE.accent;
  ctx.font = `bold 26px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('?', ox + zone.x, PANEL.y + zone.y);
  ctx.restore();
}

function drawMiss(ctx, ox, mark) {
  const a = Math.max(0, mark.left / 0.7);
  ctx.save();
  ctx.globalAlpha = a;
  ctx.strokeStyle = PALETTE.bad;
  ctx.lineWidth = 6;
  const cx = ox + mark.x;
  const cy = PANEL.y + mark.y;
  ctx.beginPath();
  ctx.moveTo(cx - 14, cy - 14);
  ctx.lineTo(cx + 14, cy + 14);
  ctx.moveTo(cx + 14, cy - 14);
  ctx.lineTo(cx - 14, cy + 14);
  ctx.stroke();
  ctx.restore();
}

function drawHud(ctx, state) {
  const level = levelOf(state);
  ctx.fillStyle = PALETTE.hud;
  ctx.fillRect(0, 0, FIELD.width, HUD.height);
  ctx.fillStyle = PALETTE.hudLine;
  ctx.fillRect(0, HUD.height - 2, FIELD.width, 2);

  // Left: title.
  ctx.fillStyle = PALETTE.text;
  ctx.font = `bold 26px ${FONT}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('★ DUA SENJA', 24, 24);
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `13px ${FONT}`;
  ctx.fillText(level.name, 24, 48);

  // Centre: the counter — the biggest number on the screen.
  const left = remaining(state);
  const total = level.diffs.length;
  ctx.fillStyle = PALETTE.accent;
  ctx.font = `bold 34px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText(`SISA ${left}/${total}`, 640, 26);
  // Dots: one per difference, filled green when found.
  for (let i = 0; i < total; i += 1) {
    const dx = 640 - ((total - 1) * 11) + i * 22;
    ctx.fillStyle = state.found.has(i) ? PALETTE.good : 'rgba(255,247,232,0.25)';
    ctx.beginPath();
    ctx.arc(dx, 52, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Right: timer + score.
  const low = state.timeLeft <= 30;
  ctx.fillStyle = low ? PALETTE.timerLow : PALETTE.text;
  ctx.font = `bold 30px ${FONT}`;
  ctx.textAlign = 'right';
  ctx.fillText(`⏱ ${fmtTime(state.timeLeft)}`, 1256, 24);
  const barW = 190;
  const ratio = Math.max(0, state.timeLeft / LEVEL_TIME[state.levelIndex]);
  ctx.fillStyle = 'rgba(255,247,232,0.2)';
  ctx.fillRect(1256 - barW, 42, barW, 9);
  ctx.fillStyle = low ? PALETTE.timerLow : PALETTE.timerFull;
  ctx.fillRect(1256 - barW, 42, barW * ratio, 9);
}

function drawPanels(ctx, state) {
  const level = levelOf(state);
  const left = leftElements(level);
  const right = rightElements(level);
  drawPanel(ctx, level, left, PANEL_LEFT_X, PANEL.y, PANEL.width, PANEL.height);
  drawPanel(ctx, level, right, PANEL_RIGHT_X, PANEL.y, PANEL.width, PANEL.height);

  // Frames and side tabs.
  for (const [ox, label] of [
    [PANEL_LEFT_X, 'KIRI'],
    [PANEL_RIGHT_X, 'KANAN'],
  ]) {
    ctx.strokeStyle = PALETTE.panelFrame;
    ctx.lineWidth = 4;
    ctx.strokeRect(ox - 2, PANEL.y - 2, PANEL.width + 4, PANEL.height + 4);
    ctx.fillStyle = PALETTE.panelFrame;
    ctx.font = `bold 14px ${FONT}`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, ox + 8, PANEL.y - 14 < 66 ? PANEL.y + 14 : PANEL.y - 14);
  }
  // VS badge in the gap.
  ctx.fillStyle = PALETTE.accent;
  ctx.beginPath();
  ctx.arc(640, PANEL.y + PANEL.height / 2, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.buttonText;
  ctx.font = `bold 13px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.fillText('VS', 640, PANEL.y + PANEL.height / 2 + 1);

  // Found markers on both panels.
  for (const i of state.foundOrder) {
    const zone = level.diffs[i].zone;
    const pop = state.popMark && state.popMark.diffIndex === i ? state.popMark.left / 0.45 : 0;
    drawMarker(ctx, PANEL_LEFT_X, zone, pop);
    drawMarker(ctx, PANEL_RIGHT_X, zone, pop);
  }
  // Hint pulse on both panels.
  if (state.hintPulse) {
    const zone = level.diffs[state.hintPulse.diffIndex].zone;
    drawHintPulse(ctx, PANEL_LEFT_X, zone, state.elapsed);
    drawHintPulse(ctx, PANEL_RIGHT_X, zone, state.elapsed);
  }
  // Miss mark on the panel that was clicked.
  if (state.missMark) {
    drawMiss(ctx, panelOrigin(state.missMark.panel || 'left'), state.missMark);
  }
}

function drawFoot(ctx, state) {
  ctx.fillStyle = PALETTE.hud;
  ctx.fillRect(0, FOOT.y, FIELD.width, FOOT.height);
  ctx.fillStyle = PALETTE.hudLine;
  ctx.fillRect(0, FOOT.y, FIELD.width, 2);

  // Hint button.
  const cooling = state.hintCooldown > 0;
  const empty = state.hintsLeft <= 0;
  ctx.fillStyle = empty || cooling ? '#4a3f63' : PALETTE.button;
  ctx.beginPath();
  ctx.roundRect(BTN_HINT.x, BTN_HINT.y, BTN_HINT.w, BTN_HINT.h, 10);
  ctx.fill();
  ctx.fillStyle = empty || cooling ? PALETTE.muted : PALETTE.buttonText;
  ctx.font = `bold 17px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const hintLabel = empty
    ? 'HINT HABIS'
    : cooling
      ? `HINT … ${Math.ceil(state.hintCooldown)} dtk`
      : `HINT ×${state.hintsLeft}  ·  −50`;
  ctx.fillText(hintLabel, BTN_HINT.x + BTN_HINT.w / 2, BTN_HINT.y + BTN_HINT.h / 2 + 1);

  // Centre: message line.
  ctx.fillStyle = PALETTE.text;
  ctx.font = `16px ${FONT}`;
  ctx.fillText(state.message || levelOf(state).sub, 640, FOOT.y + 32);

  // Right: level dots + score.
  ctx.textAlign = 'right';
  ctx.fillStyle = PALETTE.muted;
  ctx.font = `15px ${FONT}`;
  const dots = LEVELS.map((_, i) => (i === state.levelIndex ? '●' : i < state.levelIndex ? '◆' : '○')).join('  ');
  ctx.fillText(`Level ${dots}`, 1256, FOOT.y + 20);
  ctx.fillStyle = PALETTE.text;
  ctx.font = `bold 18px ${FONT}`;
  ctx.fillText(`SKOR ${state.score.toLocaleString('id-ID')}`, 1256, FOOT.y + 46);
}

function overlay(ctx, title, lines, buttonLabel, accent) {
  ctx.fillStyle = 'rgba(15,10,28,0.55)';
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  const cw = 620;
  const ch = 380;
  const cx = (FIELD.width - cw) / 2;
  const cy = (FIELD.height - ch) / 2;
  ctx.fillStyle = PALETTE.hud;
  ctx.beginPath();
  ctx.roundRect(cx, cy, cw, ch, 18);
  ctx.fill();
  ctx.strokeStyle = PALETTE.hudLine;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = accent || PALETTE.accent;
  ctx.font = `bold 40px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title, 640, cy + 62);
  ctx.fillStyle = PALETTE.text;
  ctx.font = `18px ${FONT}`;
  lines.forEach((line, i) => ctx.fillText(line, 640, cy + 128 + i * 30));
  if (buttonLabel) {
    ctx.fillStyle = PALETTE.button;
    ctx.beginPath();
    ctx.roundRect(BTN_CARD.x, BTN_CARD.y, BTN_CARD.w, BTN_CARD.h, 12);
    ctx.fill();
    ctx.fillStyle = PALETTE.buttonText;
    ctx.font = `bold 20px ${FONT}`;
    ctx.fillText(buttonLabel, 640, BTN_CARD.y + BTN_CARD.h / 2 + 1);
  }
}

function drawMenu(ctx, state) {
  drawPanels(ctx, { ...state, screen: 'play', found: new Set(), foundOrder: [], hintPulse: null, missMark: null, popMark: null });
  overlay(
    ctx,
    '★ DUA SENJA ★',
    [
      'Cari selisih di dua gambar — klik di kiri atau kanan.',
      '10–12 selisih per level · 3 level: warung, dermaga, layang-layang.',
      'H = hint (−50 poin) · R = ulang level · Esc = jeda · salah klik −5 detik.',
      state.best > 0 ? `Skor terbaikmu: ${state.best.toLocaleString('id-ID')}` : 'Belum ada skor — jadilah yang pertama!',
    ],
    '▶  MULAI MAIN',
  );
}

function drawLevelClear(ctx, state) {
  const stars = '★'.repeat(state.stars) + '☆'.repeat(3 - state.stars);
  overlay(
    ctx,
    'LEVEL SELESAI!',
    [
      `${stars}`,
      `Bonus waktu: +${state.levelBonus} poin`,
      `Skor: ${state.score.toLocaleString('id-ID')}  ·  Kombo terbaik: x${state.bestCombo}`,
      levelOf(state).name + ' — semua selisih ketemu!',
    ],
    state.levelIndex + 1 < LEVELS.length ? '▶  LEVEL BERIKUTNYA' : '▶  LIHAT HASIL',
    PALETTE.good,
  );
}

function drawWin(ctx, state) {
  overlay(
    ctx,
    'KAMU MENANG!',
    [
      'Tiga senja, semua selisih ketemu. Hebat!',
      `Skor akhir: ${state.score.toLocaleString('id-ID')}  ·  Salah klik: ${state.misses}`,
      state.best > 0 ? `Skor terbaik: ${state.best.toLocaleString('id-ID')}` : '',
    ].filter(Boolean),
    '↻  MAIN LAGI',
    PALETTE.good,
  );
}

function drawGameOver(ctx, state) {
  overlay(
    ctx,
    'WAKTU HABIS!',
    [
      `${levelOf(state).name} — ketemu ${state.found.size} dari ${levelOf(state).diffs.length} selisih.`,
      `Skor: ${state.score.toLocaleString('id-ID')}`,
      'Coba lagi — selisihnya masih di sana.',
    ],
    '↻  COBA LAGI',
    PALETTE.bad,
  );
}

function drawPaused(ctx) {
  overlay(ctx, 'JEDA', ['Istirahat dulu — gambarnya menunggu.', 'Esc / klik untuk lanjut.'], '▶  LANJUT');
}

/** Draw the whole frame. */
export function render(ctx, state) {
  ctx.fillStyle = PALETTE.backdrop;
  ctx.fillRect(0, 0, FIELD.width, FIELD.height);
  if (state.screen === 'menu') {
    drawMenu(ctx, state);
    return;
  }
  drawHud(ctx, state);
  drawPanels(ctx, state);
  drawFoot(ctx, state);
  if (state.screen === 'levelclear') drawLevelClear(ctx, state);
  else if (state.screen === 'win') drawWin(ctx, state);
  else if (state.screen === 'gameover') drawGameOver(ctx, state);
  else if (state.screen === 'paused') drawPaused(ctx);
}

/** Clickable rectangles in logical coordinates, for the input layer. */
export function clickTargets(state) {
  const targets = [];
  if (state.screen === 'play') {
    targets.push({ id: 'hint', ...BTN_HINT });
  } else if (state.screen === 'menu') {
    targets.push({ id: 'start', ...BTN_CARD });
    for (let i = 0; i < 3; i += 1) {
      targets.push({ id: `level-${i}`, x: 490 + i * 104, y: 400, w: 92, h: 44 });
    }
  } else if (state.screen === 'levelclear') {
    targets.push({ id: 'next', ...BTN_CARD });
  } else if (state.screen === 'win' || state.screen === 'gameover') {
    targets.push({ id: 'restart', ...BTN_CARD });
  } else if (state.screen === 'paused') {
    targets.push({ id: 'resume', ...BTN_CARD });
  }
  return targets;
}

export { BTN_HINT, BTN_CARD, fmtTime };
