// Dua Senja — the three scenes. One scene is a list of drawable elements plus the
// differences hidden in it. The left panel draws the elements as listed; the right
// panel draws them with the differences applied. A difference is fair when its zone
// is big enough to click and its change is visible on a careful look.
//
// Element: { t, x, y, s, c, c2, n, rightOnly }
//   t  — painter type (see painter.js)
//   x,y — centre in panel coordinates (panel is 592 x 576)
//   s  — size scale, c — main colour, c2 — second colour, n — count
//   rightOnly — drawn only in the right panel (an "extra" difference)
// Difference: { el, kind, value, zone: { x, y, r } }
//   kind: missing | color | color2 | size | move | count | tail | extra
//   value: the new colour / scale / {dx,dy} / count for the kind

export const LEVELS = [
  {
    id: 1,
    name: 'Warung Kopi Senja',
    sub: 'Level 1 · 10 selisih · 180 detik',
    bg: { skyTop: '#3d2f5e', skyBot: '#ff9a56', ground: '#3a2b45', groundY: 470 },
    elements: [
      { t: 'sun', x: 492, y: 86, s: 34, c: '#ffd166' },
      { t: 'cloud', x: 120, y: 66, s: 1, c: '#ffe3c2' },
      { t: 'cloud', x: 310, y: 48, s: 0.8, c: '#ffe3c2' },
      { t: 'bird', x: 180, y: 120, s: 1, c: '#2c1f3d' },
      { t: 'bird', x: 238, y: 98, s: 1, c: '#2c1f3d' },
      { t: 'bird', x: 300, y: 128, s: 0.9, c: '#2c1f3d' },
      { t: 'bunting', x: 296, y: 150, s: 1, c: '#ff5d73', c2: '#ffe066', n: 7 },
      { t: 'stall', x: 296, y: 330, s: 1, c: '#e2583e', c2: '#fff7e8' },
      { t: 'sign', x: 296, y: 238, s: 1, c: '#241423' },
      { t: 'pot', x: 232, y: 392, s: 1, c: '#3d2f5e' },
      { t: 'steam', x: 232, y: 360, s: 1, c: '#ffffff' },
      { t: 'cup', x: 352, y: 396, s: 1, c: '#ffb347' },
      { t: 'lantern', x: 96, y: 262, s: 1, c: '#ff5d5d' },
      { t: 'lantern', x: 496, y: 262, s: 1, c: '#ff5d5d' },
      { t: 'tree', x: 64, y: 470, s: 1, c: '#2f7a4d' },
      { t: 'cat', x: 512, y: 520, s: 1, c: '#241423' },
      { t: 'flowers', x: 120, y: 520, s: 1, c: '#ff7bac', n: 4 },
      { t: 'stool', x: 420, y: 470, s: 1, c: '#8a5a2b' },
      { t: 'menu', x: 150, y: 440, s: 1, c: '#fff7e8' },
      { t: 'butterfly', x: 430, y: 180, s: 1, c: '#7be495', rightOnly: true },
    ],
    diffs: [
      { el: 12, kind: 'missing', zone: { x: 96, y: 262, r: 26 } },
      { el: 13, kind: 'color', value: '#2ec4b6', zone: { x: 496, y: 262, r: 26 } },
      { el: 0, kind: 'size', value: 0.65, zone: { x: 492, y: 86, r: 34 } },
      { el: 4, kind: 'missing', zone: { x: 238, y: 98, r: 22 } },
      { el: 11, kind: 'missing', zone: { x: 352, y: 396, r: 24 } },
      { el: 15, kind: 'missing', zone: { x: 512, y: 520, r: 28 } },
      { el: 16, kind: 'color', value: '#4fc3f7', zone: { x: 120, y: 520, r: 26 } },
      { el: 6, kind: 'count', value: 6, zone: { x: 400, y: 150, r: 22 } },
      { el: 10, kind: 'missing', zone: { x: 232, y: 360, r: 24 } },
      { el: 19, kind: 'extra', zone: { x: 430, y: 180, r: 24 } },
    ],
  },
  {
    id: 2,
    name: 'Dermaga Nelayan',
    sub: 'Level 2 · 12 selisih · 150 detik',
    bg: { skyTop: '#22315e', skyBot: '#ff8c5a', ground: '#274b7a', groundY: 380, sea: true },
    elements: [
      { t: 'moon', x: 480, y: 80, s: 30, c: '#fff3c4' },
      { t: 'stars', x: 296, y: 120, s: 1, c: '#ffffff', n: 14 },
      { t: 'cloud', x: 140, y: 70, s: 0.9, c: '#ffd9b0' },
      { t: 'bird', x: 180, y: 150, s: 1.1, c: '#1d2b53' },
      { t: 'bird', x: 250, y: 120, s: 1, c: '#1d2b53' },
      { t: 'bird', x: 330, y: 160, s: 0.9, c: '#1d2b53' },
      { t: 'boat', x: 140, y: 392, s: 1, c: '#e2583e', c2: '#fff7e8' },
      { t: 'boat', x: 420, y: 372, s: 0.8, c: '#2ec4b6', c2: '#ffe066' },
      { t: 'pier', x: 296, y: 480, s: 1, c: '#8a5a2b' },
      { t: 'lamppost', x: 90, y: 430, s: 1, c: '#2c1f3d' },
      { t: 'fisher', x: 360, y: 440, s: 1, c: '#ffb347', c2: '#2ec4b6' },
      { t: 'bucket', x: 440, y: 500, s: 1, c: '#ff5d73' },
      { t: 'buoy', x: 240, y: 418, s: 1, c: '#ff5d5d' },
      { t: 'buoy', x: 520, y: 410, s: 1, c: '#ff9f1c' },
      { t: 'crates', x: 520, y: 500, s: 1, c: '#c98f4e', n: 3 },
      { t: 'net', x: 150, y: 500, s: 1, c: '#d9c9a3' },
      { t: 'fish', x: 300, y: 400, s: 1, c: '#c0d6ff', rightOnly: true },
      { t: 'rope', x: 250, y: 500, s: 1, c: '#d9c9a3' },
      // Decorative only — appended after every diff element, so no diff moves.
      { t: 'cloud', x: 330, y: 210, s: 0.7, c: '#ffd9b0' },
      { t: 'boat', x: 250, y: 372, s: 0.5, c: '#8a5a2b', c2: '#fff7e8' },
      { t: 'lighthouse', x: 560, y: 330, s: 1, c: '#ff5d73' },
    ],
    diffs: [
      { el: 12, kind: 'color', value: '#2ec4b6', zone: { x: 240, y: 418, r: 24 } },
      { el: 4, kind: 'missing', zone: { x: 250, y: 120, r: 22 } },
      { el: 10, kind: 'color', value: '#ff5d73', zone: { x: 360, y: 420, r: 26 } },
      { el: 11, kind: 'missing', zone: { x: 440, y: 500, r: 24 } },
      { el: 14, kind: 'count', value: 2, zone: { x: 520, y: 500, r: 26 } },
      { el: 1, kind: 'count', value: 9, zone: { x: 420, y: 90, r: 28 } },
      { el: 9, kind: 'missing', zone: { x: 90, y: 430, r: 26 } },
      { el: 7, kind: 'color2', value: '#ff5d73', zone: { x: 420, y: 350, r: 28 } },
      { el: 17, kind: 'missing', zone: { x: 250, y: 500, r: 24 } },
      { el: 16, kind: 'extra', zone: { x: 300, y: 400, r: 26 } },
      { el: 0, kind: 'size', value: 0.65, zone: { x: 480, y: 80, r: 30 } },
      { el: 6, kind: 'move', value: { dx: 36, dy: 0 }, zone: { x: 158, y: 392, r: 36 } },
    ],
  },
  {
    id: 3,
    name: 'Lapangan Layang-Layang',
    sub: 'Level 3 · 12 selisih · 120 detik',
    bg: { skyTop: '#7ec8f7', skyBot: '#fff3c4', ground: '#5da24a', groundY: 400, hills: true },
    elements: [
      { t: 'sun', x: 90, y: 80, s: 36, c: '#ffd166', n: 8 },
      { t: 'cloud', x: 250, y: 70, s: 1, c: '#ffffff' },
      { t: 'cloud', x: 450, y: 110, s: 0.8, c: '#ffffff' },
      { t: 'kite', x: 180, y: 180, s: 1, c: '#ff5d73', c2: '#ffe066' },
      { t: 'kite', x: 330, y: 140, s: 0.9, c: '#2ec4b6', c2: '#ff5d73' },
      { t: 'kite', x: 470, y: 200, s: 1.1, c: '#ffb347', c2: '#2ec4b6' },
      { t: 'tree', x: 70, y: 400, s: 1.1, c: '#2f7a4d' },
      { t: 'tree', x: 530, y: 410, s: 0.9, c: '#3d9b57' },
      { t: 'blanket', x: 296, y: 480, s: 1, c: '#ff5d73', c2: '#fff7e8' },
      { t: 'ball', x: 200, y: 520, s: 1, c: '#ff5d73', c2: '#ffffff' },
      { t: 'flowers', x: 420, y: 530, s: 1, c: '#ff7bac', n: 5 },
      { t: 'bird', x: 260, y: 90, s: 1, c: '#2c1f3d' },
      { t: 'bird', x: 380, y: 70, s: 0.9, c: '#2c1f3d' },
      { t: 'fence', x: 296, y: 420, s: 1, c: '#8a5a2b', n: 7 },
      { t: 'butterfly', x: 150, y: 300, s: 1, c: '#b388ff', rightOnly: true },
      { t: 'child', x: 360, y: 460, s: 1, c: '#e2583e' },
    ],
    diffs: [
      { el: 3, kind: 'color', value: '#4fc3f7', zone: { x: 180, y: 180, r: 30 } },
      { el: 4, kind: 'tail', zone: { x: 330, y: 180, r: 26 } },
      { el: 6, kind: 'missing', zone: { x: 70, y: 400, r: 30 } },
      { el: 9, kind: 'missing', zone: { x: 200, y: 520, r: 26 } },
      { el: 10, kind: 'count', value: 3, zone: { x: 420, y: 530, r: 28 } },
      { el: 8, kind: 'color2', value: '#2ec4b6', zone: { x: 296, y: 480, r: 30 } },
      { el: 11, kind: 'missing', zone: { x: 260, y: 90, r: 22 } },
      { el: 0, kind: 'count', value: 5, zone: { x: 90, y: 80, r: 36 } },
      { el: 2, kind: 'missing', zone: { x: 450, y: 110, r: 26 } },
      { el: 13, kind: 'count', value: 5, zone: { x: 296, y: 420, r: 28 } },
      { el: 14, kind: 'extra', zone: { x: 150, y: 300, r: 24 } },
      { el: 5, kind: 'move', value: { dx: 0, dy: 30 }, zone: { x: 470, y: 215, r: 34 } },
    ],
  },
];

/** The right panel's element list: the base elements with this level's diffs applied. */
export function rightElements(level) {
  const out = level.elements.map((el) => ({ ...el }));
  for (const diff of level.diffs) {
    const el = out[diff.el];
    if (!el) continue;
    if (diff.kind === 'missing') el.hidden = true;
    else if (diff.kind === 'color') el.c = diff.value;
    else if (diff.kind === 'color2') el.c2 = diff.value;
    else if (diff.kind === 'size') el.s *= diff.value;
    else if (diff.kind === 'move') {
      el.x += diff.value.dx;
      el.y += diff.value.dy;
    } else if (diff.kind === 'count') el.n = diff.value;
    else if (diff.kind === 'tail') el.noTail = true;
    else if (diff.kind === 'extra') el.rightOnly = false;
  }
  return out;
}

/** The left panel's element list: base elements, right-only ones left out. */
export function leftElements(level) {
  return level.elements.map((el) => ({ ...el }));
}

/** Check a scene definition for the mistakes that make a level unfair or broken. */
export function validateLevel(level) {
  const problems = [];
  if (!level.diffs || level.diffs.length === 0) problems.push('no diffs');
  const seen = new Set();
  for (const diff of level.diffs || []) {
    if (diff.el < 0 || diff.el >= level.elements.length) problems.push(`diff el ${diff.el} out of range`);
    if (seen.has(diff.el)) problems.push(`diff el ${diff.el} used twice`);
    seen.add(diff.el);
    if (!diff.zone || diff.zone.r < 18) problems.push(`diff el ${diff.el} zone too small`);
    if (diff.zone && (diff.zone.x < 0 || diff.zone.x > 592 || diff.zone.y < 0 || diff.zone.y > 576)) {
      problems.push(`diff el ${diff.el} zone outside panel`);
    }
  }
  // Zones must not overlap so much that one click finds two differences.
  const zs = (level.diffs || []).map((d) => d.zone);
  for (let i = 0; i < zs.length; i += 1) {
    for (let j = i + 1; j < zs.length; j += 1) {
      const dx = zs[i].x - zs[j].x;
      const dy = zs[i].y - zs[j].y;
      if (Math.hypot(dx, dy) < zs[i].r + zs[j].r - 8) problems.push(`zones ${i} and ${j} overlap`);
    }
  }
  return problems;
}
