// Dua Senja — sounds. Tiny WebAudio chimes, no audio files, nothing over the network.
// Every call is safe when there is no audio device (headless screenshots).

let ctx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}

function audio() {
  if (muted) return null;
  try {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function tone(freq, at, dur, type = 'sine', gain = 0.12) {
  const ac = audio();
  if (!ac) return;
  try {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, ac.currentTime + at);
    g.gain.linearRampToValueAtTime(gain, ac.currentTime + at + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + at + dur);
    osc.connect(g);
    g.connect(ac.destination);
    osc.start(ac.currentTime + at);
    osc.stop(ac.currentTime + at + dur + 0.05);
  } catch {
    // Sound is garnish; a failure never breaks the game.
  }
}

/** Two-note chime on a find: the satisfying mark. */
export function playFound() {
  tone(660, 0, 0.14);
  tone(990, 0.09, 0.22);
}

/** Low buzz on a miss. */
export function playMiss() {
  tone(160, 0, 0.18, 'sawtooth', 0.06);
}

/** Soft ping when a hint fires. */
export function playHint() {
  tone(880, 0, 0.12, 'triangle');
  tone(1174, 0.08, 0.16, 'triangle');
}

/** Little arpeggio on a level clear. */
export function playWin() {
  [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.11, 0.24));
}

/** Tick when the timer drops under ten seconds. */
export function playTick() {
  tone(1200, 0, 0.06, 'square', 0.04);
}
