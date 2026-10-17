// ui/keepout.js — screen-space keep-out boxes (CSS px) for the construction-drawing layout pass.
// Every piece of text that sits over the world registers the box it occupies (dimension values, the rim name block,
// the status line, the scale figure, the Key's label column); the drawing's lines and the movable MICRO text read them:
//   • a line that would run through text breaks behind it (the Key axis, like a dimension line behind its value);
//   • a live coordinate picks the side of its survey cross that collides with nothing (key/hover.js).
// Writers call set() every frame they are shown (or on change) and off() when they leave; readers see last frame's
// boxes (one frame of lag is invisible at these speeds). Nothing here allocates per frame or reads layout.

const boxes = [];          // { id, x0, y0, x1, y1, on }
const byId = new Map();

function slot(id) {
  let b = byId.get(id);
  if (!b) { b = { id, x0: 0, y0: 0, x1: 0, y1: 0, on: false }; boxes.push(b); byId.set(id, b); }
  return b;
}

export const keepout = {
  boxes,
  /** Registers / moves the box `id` (x0 < x1, y0 < y1, CSS px). */
  set(id, x0, y0, x1, y1) {
    const b = slot(id);
    b.x0 = x0; b.y0 = y0; b.x1 = x1; b.y1 = y1; b.on = x1 > x0 && y1 > y0;
    return b;
  },
  off(id) { const b = byId.get(id); if (b) b.on = false; },
  get(id) { const b = byId.get(id); return b && b.on ? b : null; },
  /** Overlap area (px²) of the rectangle with every live box whose id does not start with `skip` (prefix). */
  overlap(x0, y0, x1, y1, skip) {
    let s = 0;
    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i];
      if (!b.on || (skip && b.id.startsWith(skip))) continue;
      const w = Math.min(x1, b.x1) - Math.max(x0, b.x0), h = Math.min(y1, b.y1) - Math.max(y0, b.y0);
      if (w > 0 && h > 0) s += w * h;
    }
    return s;
  },
  /** The y-intervals (merged, padded by `pad`) where a vertical line at x (± halfW) between y0 and y1 runs through a
   *  live box; two breaks closer than `join` px become one (no stub of line between two texts).
   *  Writes pairs into `out` (Float32Array), returns the pair count (≤ out.length / 2). */
  verticalBreaks(x, halfW, y0, y1, pad, out, join = 0) {
    let n = 0;
    const max = out.length >> 1;
    for (let i = 0; i < boxes.length; i++) {
      const b = boxes[i];
      if (!b.on || x + halfW < b.x0 || x - halfW > b.x1) continue;
      const a = Math.max(y0, b.y0 - pad), c = Math.min(y1, b.y1 + pad);
      if (c <= a) continue;
      // insert sorted by start, then merge
      let k = n;
      if (n < max) n++;
      else if (a >= out[(max - 1) * 2]) continue;
      while (k > 0 && out[(k - 1) * 2] > a) { out[k * 2] = out[(k - 1) * 2]; out[k * 2 + 1] = out[(k - 1) * 2 + 1]; k--; }
      out[k * 2] = a; out[k * 2 + 1] = c;
    }
    let m = 0;
    for (let k = 0; k < n; k++) {
      if (m > 0 && out[k * 2] <= out[(m - 1) * 2 + 1] + join) { out[(m - 1) * 2 + 1] = Math.max(out[(m - 1) * 2 + 1], out[k * 2 + 1]); continue; }
      out[m * 2] = out[k * 2]; out[m * 2 + 1] = out[k * 2 + 1]; m++;
    }
    return m;
  },
};
