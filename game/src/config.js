// Dua Senja — spot the difference. Every tuning number and colour in one place.
// The playfield is a fixed 1280x720 logical area; the renderer scales it to the
// window, so no rule below depends on the screen size.

export const FIELD = { width: 1280, height: 720 };

/** The two picture panels, in logical coordinates. */
export const PANEL = { width: 592, height: 576, y: 72 };
export const PANEL_LEFT_X = 24;
export const PANEL_RIGHT_X = 664;

/** Top HUD bar and bottom bar, in logical coordinates. */
export const HUD = { height: 64 };
export const FOOT = { y: 656, height: 64 };

/** The simulation's fixed step, in seconds. */
export const STEP = 1 / 60;

/** How long each level gives the player, in seconds. */
export const LEVEL_TIME = [180, 150, 120];

/** How many differences each level hides. */
export const LEVEL_DIFFS = [10, 12, 12];

/** Hints per level, and what one costs. */
export const HINTS_PER_LEVEL = 3;
export const HINT_COST = 50;
export const HINT_COOLDOWN = 8;

/** A wrong click costs this many seconds and resets the combo. */
export const MISS_TIME_COST = 5;

/** Points: a find, the combo step, and each second left at a level clear. */
export const SCORE = { find: 100, comboStep: 10, timeBonus: 5 };

/** Stars on a level clear: time left + hints left decide. */
export const STARS = { three: 60, two: 30 };

/** Marker and pulse styling. */
export const MARKER = { radius: 26, width: 5 };
export const HINT_PULSE_SECONDS = 3;

export const PALETTE = {
  backdrop: '#171224',
  hud: '#241c38',
  hudLine: '#3d2f5e',
  text: '#fff7e8',
  muted: '#c9b8e8',
  accent: '#ffb347',
  accent2: '#ff5d73',
  good: '#7be495',
  bad: '#ff5d73',
  panelFrame: '#fff7e8',
  timerFull: '#7be495',
  timerLow: '#ff5d73',
  button: '#ffb347',
  buttonText: '#241423',
};

export const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

/** Where the best score is kept between visits (this browser only). */
export const BEST_KEY = 'dua-senja.best';
