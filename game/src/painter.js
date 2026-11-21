// Dua Senja — the painter. One job: draw a scene into a panel. It draws the sky and
// ground from the level's background, then each element in order. Nothing here knows
// about the game state; state.js decides what to draw, render.js decides where.

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

/** Deterministic scatter positions for stars: a hash of the index, no rng needed. */
function starPos(i) {
  const a = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  const b = Math.sin(i * 269.5 + 183.3) * 28001.8384;
  return { x: 40 + (a - Math.floor(a)) * 512, y: 24 + (b - Math.floor(b)) * 150 };
}

function drawStar(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const ang = (i * Math.PI) / 4;
    const rr = i % 2 === 0 ? r : r * 0.4;
    const px = x + Math.cos(ang) * rr;
    const py = y + Math.sin(ang) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

/** Draw one element at panel coordinates. `el` is a copy; mutations already applied. */
export function drawElement(ctx, el) {
  if (el.hidden || el.rightOnly) return;
  const { x, y, s, c, c2 } = el;
  ctx.save();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  switch (el.t) {
    case 'sun': {
      ctx.strokeStyle = c;
      ctx.lineWidth = 4;
      const rays = el.n || 8;
      for (let i = 0; i < rays; i += 1) {
        const a = (i / rays) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(x + Math.cos(a) * (s + 8), y + Math.sin(a) * (s + 8));
        ctx.lineTo(x + Math.cos(a) * (s + 20), y + Math.sin(a) * (s + 20));
        ctx.stroke();
      }
      circle(ctx, x, y, s, c);
      break;
    }
    case 'moon': {
      circle(ctx, x, y, s, c);
      circle(ctx, x - s * 0.35, y - s * 0.2, s * 0.18, '#e8d9a0');
      circle(ctx, x + s * 0.3, y + s * 0.3, s * 0.14, '#e8d9a0');
      break;
    }
    case 'cloud': {
      ellipse(ctx, x, y, 42 * s, 16 * s, c);
      ellipse(ctx, x - 26 * s, y + 6 * s, 26 * s, 12 * s, c);
      ellipse(ctx, x + 28 * s, y + 6 * s, 28 * s, 13 * s, c);
      break;
    }
    case 'stars': {
      for (let i = 0; i < (el.n || 10); i += 1) {
        const p = starPos(i);
        drawStar(ctx, p.x, p.y, 5, c);
      }
      break;
    }
    case 'bird': {
      ctx.strokeStyle = c;
      ctx.lineWidth = 3 * s;
      ctx.beginPath();
      ctx.moveTo(x - 12 * s, y);
      ctx.quadraticCurveTo(x - 5 * s, y - 8 * s, x, y);
      ctx.quadraticCurveTo(x + 5 * s, y - 8 * s, x + 12 * s, y);
      ctx.stroke();
      break;
    }
    case 'bunting': {
      ctx.strokeStyle = '#241423';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 260, y - 14);
      ctx.quadraticCurveTo(x, y + 26, x + 260, y - 14);
      ctx.stroke();
      const n = el.n || 7;
      for (let i = 0; i < n; i += 1) {
        const fx = x - 240 + (i * 480) / (n - 1 || 1);
        const t = (fx - (x - 260)) / 520;
        const fy = y - 14 + 40 * 4 * t * (1 - t) * 0.9;
        ctx.fillStyle = i % 2 === 0 ? c : c2;
        ctx.beginPath();
        ctx.moveTo(fx - 13, fy);
        ctx.lineTo(fx + 13, fy);
        ctx.lineTo(fx, fy + 24);
        ctx.closePath();
        ctx.fill();
      }
      break;
    }
    case 'stall': {
      // Striped awning.
      for (let i = 0; i < 8; i += 1) {
        rect(ctx, x - 130 + i * 32.5, y - 62, 32.5, 34, i % 2 === 0 ? c : c2);
      }
      ctx.fillStyle = c;
      for (let i = 0; i < 8; i += 1) {
        ctx.beginPath();
        ctx.arc(x - 130 + i * 32.5 + 16, y - 28, 16, 0, Math.PI);
        ctx.fill();
      }
      // Posts and counter.
      rect(ctx, x - 126, y - 28, 10, 128, '#5a3a22');
      rect(ctx, x + 116, y - 28, 10, 128, '#5a3a22');
      rect(ctx, x - 130, y + 60, 260, 44, '#8a5a2b');
      rect(ctx, x - 130, y + 60, 260, 10, '#a9713d');
      // Goods on the counter: cups and a jar.
      circle(ctx, x - 90, y + 48, 9, '#fff7e8');
      circle(ctx, x - 60, y + 48, 9, '#ffb347');
      circle(ctx, x + 70, y + 48, 9, '#7be495');
      rect(ctx, x + 92, y + 30, 26, 22, '#d9c9a3');
      break;
    }
    case 'sign': {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.roundRect(x - 78, y - 26, 156, 52, 10);
      ctx.fill();
      ctx.fillStyle = '#ffb347';
      ctx.font = 'bold 24px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('KOPI SENJA', x, y + 1);
      break;
    }
    case 'pot': {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(x - 22, y - 18);
      ctx.lineTo(x + 22, y - 18);
      ctx.lineTo(x + 16, y + 20);
      ctx.lineTo(x - 16, y + 20);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = c;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x + 22, y - 8);
      ctx.quadraticCurveTo(x + 38, y - 2, x + 30, y + 12);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 22, y - 10);
      ctx.lineTo(x - 34, y - 18);
      ctx.stroke();
      break;
    }
    case 'steam': {
      ctx.strokeStyle = c;
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 3;
      for (let i = -1; i <= 1; i += 1) {
        ctx.beginPath();
        ctx.moveTo(x + i * 12, y + 12);
        ctx.bezierCurveTo(x + i * 12 - 8, y, x + i * 12 + 8, y - 10, x + i * 12, y - 22);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      break;
    }
    case 'cup': {
      rect(ctx, x - 12, y - 10, 24, 20, c);
      ctx.strokeStyle = c;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x + 13, y, 7, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
      break;
    }
    case 'lantern': {
      ctx.strokeStyle = '#241423';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y - 44);
      ctx.lineTo(x, y - 18);
      ctx.stroke();
      const glow = ctx.createRadialGradient(x, y, 4, x, y, 34);
      glow.addColorStop(0, c);
      glow.addColorStop(1, 'rgba(255,93,93,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, 34, 0, Math.PI * 2);
      ctx.fill();
      circle(ctx, x, y, 16, c);
      rect(ctx, x - 7, y - 22, 14, 6, '#ffb347');
      rect(ctx, x - 7, y + 16, 14, 6, '#ffb347');
      break;
    }
    case 'tree': {
      rect(ctx, x - 6, y + 10, 12, 46, '#5a3a22');
      circle(ctx, x, y - 6, 34 * s, c);
      circle(ctx, x - 26 * s, y + 8, 22 * s, c);
      circle(ctx, x + 26 * s, y + 8, 22 * s, c);
      break;
    }
    case 'cat': {
      ellipse(ctx, x, y + 8, 20, 15, c);
      circle(ctx, x + 12, y - 12, 11, c);
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(x + 4, y - 20);
      ctx.lineTo(x + 7, y - 30);
      ctx.lineTo(x + 11, y - 20);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 14, y - 22);
      ctx.lineTo(x + 18, y - 31);
      ctx.lineTo(x + 21, y - 20);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = c;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x - 18, y + 14);
      ctx.quadraticCurveTo(x - 34, y + 6, x - 28, y - 10);
      ctx.stroke();
      break;
    }
    case 'flowers': {
      for (let i = 0; i < (el.n || 4); i += 1) {
        const fx = x - ((el.n || 4) - 1) * 16 + i * 32;
        ctx.strokeStyle = '#2f7a4d';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(fx, y + 14);
        ctx.lineTo(fx, y - 6);
        ctx.stroke();
        for (let p = 0; p < 5; p += 1) {
          const a = (p / 5) * Math.PI * 2;
          circle(ctx, fx + Math.cos(a) * 7, y - 10 + Math.sin(a) * 7, 5, c);
        }
        circle(ctx, fx, y - 10, 5, '#ffe066');
      }
      break;
    }
    case 'stool': {
      rect(ctx, x - 22, y - 8, 44, 8, c);
      rect(ctx, x - 18, y, 5, 26, '#5a3a22');
      rect(ctx, x + 13, y, 5, 26, '#5a3a22');
      break;
    }
    case 'menu': {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-0.08);
      rect(ctx, -24, -34, 48, 68, c);
      ctx.strokeStyle = '#241423';
      ctx.lineWidth = 2;
      ctx.strokeRect(-24, -34, 48, 68);
      ctx.fillStyle = '#241423';
      for (let i = 0; i < 3; i += 1) ctx.fillRect(-16, -20 + i * 14, 32, 4);
      ctx.restore();
      break;
    }
    case 'lighthouse': {
      // Tower on a rock at the waterline, with a sweeping beam.
      ctx.fillStyle = '#5a4a6e';
      ctx.beginPath();
      ctx.ellipse(x, y + 34, 30, 10, 0, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#e8e0f0';
      ctx.beginPath();
      ctx.moveTo(x - 12, y + 32);
      ctx.lineTo(x - 7, y - 58);
      ctx.lineTo(x + 7, y - 58);
      ctx.lineTo(x + 12, y + 32);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = c;
      ctx.fillRect(x - 9, y - 30, 18, 14);
      ctx.fillStyle = '#ffe066';
      ctx.fillRect(x - 8, y - 66, 16, 10);
      ctx.fillStyle = 'rgba(255,224,102,0.20)';
      ctx.beginPath();
      ctx.moveTo(x, y - 60);
      ctx.lineTo(x - 78, y - 84);
      ctx.lineTo(x - 78, y - 40);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'boat': {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(x - 46 * s, y);
      ctx.lineTo(x + 46 * s, y);
      ctx.lineTo(x + 32 * s, y + 18 * s);
      ctx.lineTo(x - 32 * s, y + 18 * s);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#5a3a22';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - 52 * s);
      ctx.stroke();
      ctx.fillStyle = c2;
      ctx.beginPath();
      ctx.moveTo(x, y - 52 * s);
      ctx.lineTo(x, y - 4 * s);
      ctx.lineTo(x + 34 * s, y - 4 * s);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'pier': {
      rect(ctx, x - 280, y - 8, 560, 16, c);
      ctx.fillStyle = '#6e4520';
      for (let i = 0; i < 9; i += 1) ctx.fillRect(x - 260 + i * 64, y - 8, 3, 16);
      rect(ctx, x - 240, y + 8, 12, 46, '#5a3a22');
      rect(ctx, x + 228, y + 8, 12, 46, '#5a3a22');
      break;
    }
    case 'lamppost': {
      rect(ctx, x - 3, y - 60, 6, 60, '#2c1f3d');
      const glow = ctx.createRadialGradient(x, y - 66, 2, x, y - 66, 26);
      glow.addColorStop(0, '#ffe066');
      glow.addColorStop(1, 'rgba(255,224,102,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y - 66, 26, 0, Math.PI * 2);
      ctx.fill();
      circle(ctx, x, y - 66, 9, '#ffe066');
      break;
    }
    case 'fisher': {
      // Fishing rod.
      ctx.strokeStyle = '#5a3a22';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + 8, y - 6);
      ctx.lineTo(x + 64, y - 52);
      ctx.stroke();
      ctx.strokeStyle = '#d9c9a3';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x + 64, y - 52);
      ctx.lineTo(x + 64, y + 6);
      ctx.stroke();
      // Body, head, hat.
      ctx.fillStyle = c2;
      rect(ctx, x - 10, y - 22, 20, 34, c2);
      circle(ctx, x, y - 30, 10, '#f2c094');
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(x, y - 36, 12, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(x - 16, y - 38, 32, 4);
      // Legs.
      ctx.strokeStyle = '#2c1f3d';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x - 4, y + 12);
      ctx.lineTo(x - 6, y + 34);
      ctx.moveTo(x + 4, y + 12);
      ctx.lineTo(x + 8, y + 34);
      ctx.stroke();
      break;
    }
    case 'bucket': {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(x - 14, y - 12);
      ctx.lineTo(x + 14, y - 12);
      ctx.lineTo(x + 10, y + 12);
      ctx.lineTo(x - 10, y + 12);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#5a3a22';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y - 12, 12, Math.PI, 0);
      ctx.stroke();
      break;
    }
    case 'buoy': {
      circle(ctx, x, y, 15, c);
      ctx.fillStyle = '#fff7e8';
      ctx.fillRect(x - 15, y - 4, 30, 8);
      circle(ctx, x, y - 18, 5, c);
      break;
    }
    case 'crates': {
      const n = el.n || 3;
      for (let i = 0; i < n; i += 1) {
        const cx = x - (n - 1) * 20 + i * 40;
        const cy = y - (i % 2) * 8;
        rect(ctx, cx - 18, cy - 18, 36, 36, c);
        ctx.strokeStyle = '#6e4520';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - 18, cy - 18, 36, 36);
        ctx.beginPath();
        ctx.moveTo(cx - 18, cy - 18);
        ctx.lineTo(cx + 18, cy + 18);
        ctx.moveTo(cx + 18, cy - 18);
        ctx.lineTo(cx - 18, cy + 18);
        ctx.stroke();
      }
      break;
    }
    case 'net': {
      ctx.strokeStyle = c;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 40, y + 10);
      ctx.quadraticCurveTo(x, y - 26, x + 40, y + 10);
      ctx.stroke();
      for (let i = -2; i <= 2; i += 1) {
        ctx.beginPath();
        ctx.moveTo(x + i * 16, y - 8 - Math.abs(i) * -2);
        ctx.lineTo(x + i * 16, y + 10);
        ctx.stroke();
      }
      break;
    }
    case 'fish': {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(-0.5);
      ellipse(ctx, 0, 0, 20, 9, c);
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(-18, 0);
      ctx.lineTo(-30, -9);
      ctx.lineTo(-30, 9);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      // Splash drops.
      circle(ctx, x - 26, y - 18, 3, '#c0d6ff');
      circle(ctx, x + 22, y - 22, 2.5, '#c0d6ff');
      break;
    }
    case 'rope': {
      ctx.strokeStyle = c;
      ctx.lineWidth = 4;
      for (let r = 16; r >= 6; r -= 5) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    }
    case 'kite': {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(x, y - 34 * s);
      ctx.lineTo(x + 26 * s, y);
      ctx.lineTo(x, y + 34 * s);
      ctx.lineTo(x - 26 * s, y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fff7e8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x - 26 * s, y);
      ctx.lineTo(x + 26 * s, y);
      ctx.moveTo(x, y - 34 * s);
      ctx.lineTo(x, y + 34 * s);
      ctx.stroke();
      if (!el.noTail) {
        ctx.strokeStyle = c2;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x, y + 34 * s);
        ctx.quadraticCurveTo(x + 10, y + 70 * s, x - 4, y + 96 * s);
        ctx.stroke();
        for (let i = 0; i < 3; i += 1) {
          const ty = y + (52 + i * 22) * s;
          ctx.fillStyle = c2;
          ctx.beginPath();
          ctx.moveTo(x - 4 + i * 2, ty - 5);
          ctx.lineTo(x + 8 + i * 2, ty);
          ctx.lineTo(x - 4 + i * 2, ty + 5);
          ctx.closePath();
          ctx.fill();
        }
      }
      break;
    }
    case 'blanket': {
      for (let r = 0; r < 3; r += 1) {
        for (let col = 0; col < 4; col += 1) {
          rect(ctx, x - 64 + col * 32, y - 24 + r * 16, 32, 16, (r + col) % 2 === 0 ? c : c2);
        }
      }
      ctx.strokeStyle = '#241423';
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 64, y - 24, 128, 48);
      break;
    }
    case 'ball': {
      circle(ctx, x, y, 20, c);
      ctx.strokeStyle = c2;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(x, y, 14, -0.6, 1.2);
      ctx.stroke();
      circle(ctx, x - 6, y - 6, 4, c2);
      break;
    }
    case 'fence': {
      const n = el.n || 7;
      ctx.fillStyle = c;
      ctx.fillRect(x - 150, y - 6, 300, 6);
      ctx.fillRect(x - 150, y + 10, 300, 6);
      for (let i = 0; i < n; i += 1) {
        const fx = x - 140 + (i * 280) / (n - 1 || 1);
        ctx.fillRect(fx - 4, y - 16, 8, 44);
      }
      break;
    }
    case 'butterfly': {
      ctx.fillStyle = c;
      ellipse(ctx, x - 10, y - 4, 11, 8, c);
      ellipse(ctx, x + 10, y - 4, 11, 8, c);
      ellipse(ctx, x - 8, y + 8, 8, 6, c);
      ellipse(ctx, x + 8, y + 8, 8, 6, c);
      ctx.fillStyle = '#241423';
      ellipse(ctx, x, y, 3, 9, '#241423');
      break;
    }
    case 'child': {
      circle(ctx, x, y - 34, 11, '#f2c094');
      ctx.fillStyle = c;
      rect(ctx, x - 10, y - 22, 20, 30, c);
      // Arms raised toward the kite.
      ctx.strokeStyle = '#f2c094';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x - 8, y - 16);
      ctx.lineTo(x - 22, y - 38);
      ctx.moveTo(x + 8, y - 16);
      ctx.lineTo(x + 22, y - 38);
      ctx.stroke();
      // Legs.
      ctx.strokeStyle = '#2c1f3d';
      ctx.beginPath();
      ctx.moveTo(x - 4, y + 8);
      ctx.lineTo(x - 6, y + 30);
      ctx.moveTo(x + 4, y + 8);
      ctx.lineTo(x + 8, y + 30);
      ctx.stroke();
      break;
    }
    default:
      break;
  }
  ctx.restore();
}

/** Draw a whole panel: background, then every element. */
export function drawPanel(ctx, level, elements, ox, oy, w, h) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(ox, oy, w, h);
  ctx.clip();
  const bg = level.bg;
  const grad = ctx.createLinearGradient(0, oy, 0, oy + h);
  grad.addColorStop(0, bg.skyTop);
  grad.addColorStop(1, bg.skyBot);
  ctx.fillStyle = grad;
  ctx.fillRect(ox, oy, w, h);
  // Ground / sea band.
  ctx.fillStyle = bg.ground;
  ctx.fillRect(ox, oy + bg.groundY, w, h - bg.groundY);
  if (bg.sea) {
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 4; i += 1) {
      const wy = oy + bg.groundY + 24 + i * 36;
      ctx.beginPath();
      for (let px = 0; px <= w; px += 24) {
        const py = wy + Math.sin((px / w) * Math.PI * 3 + i * 2) * 4;
        if (px === 0) ctx.moveTo(ox + px, py);
        else ctx.lineTo(ox + px, py);
      }
      ctx.stroke();
    }
  }
  if (bg.hills) {
    ctx.fillStyle = '#4c8a3f';
    ctx.beginPath();
    ctx.ellipse(ox + w * 0.2, oy + bg.groundY + 6, w * 0.32, 44, 0, Math.PI, 0);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(ox + w * 0.8, oy + bg.groundY + 6, w * 0.36, 52, 0, Math.PI, 0);
    ctx.fill();
  }
  ctx.translate(ox, oy);
  for (const el of elements) drawElement(ctx, el);
  ctx.restore();
}
