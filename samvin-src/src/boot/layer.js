// boot/layer.js — the boot's own DOM layer (WP2), #boot-layer between #gl (10) and #leaders (20), pointer-events none.
//   scan   THE LINE on screen (SPEC §4.1): a 2 px --ember line across the full viewport width at the projected scan
//          plane, with a 120 ms phosphor tail behind it (--ember-deep → transparent, the length the line travels in
//          120 ms). Only during 2,600–3,400 (ember window ≤ 6 %).
//   trace  his last drawing (SPEC §4.3): a 2 px --ember SVG figure 0.9 m tall over the Key, drawn in 800 ms.
//   start  the phone start screen (SPEC §4.2): top-centre MICRO `VIN / КЛЮЧ / СПИТ`, the BODY hint 48 px above the
//          safe-area bottom ([data-qa="start-hint"]), the 4 px --silver 60 % ghost dot travelling the axis, and the
//          finger's 2 px ember trail (a canvas, fading over 600 ms).
// Positions are written as transforms only (no layout reads per frame).
import { loop } from '../core/loop.js';
import { layout } from '../core/layout.js';

const SVG = 'http://www.w3.org/2000/svg';
const TRAIL_MS = 600;
const TRAIL_MAX = 160;

let root = null, scanEl = null, traceSvg = null, tracePath = null, topEl = null, hintEl = null, ghostEl = null;
let trailCv = null, trailG = null, trailFrame = 0;
const trail = new Float32Array(TRAIL_MAX * 3);   // x, y, t
let trailN = 0, trailHead = 0;

function mk(tag, cls, parent) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (parent) parent.appendChild(n);
  return n;
}

export const layer = {
  mount() {
    if (root) return layer;
    root = mk('div', 'boot-layer');
    root.id = 'boot-layer';
    root.setAttribute('aria-hidden', 'true');
    const gl = document.getElementById('gl');
    if (gl && gl.parentNode) gl.parentNode.insertBefore(root, gl.nextSibling); else document.body.appendChild(root);
    return layer;
  },
  unmount() {
    layer.stopTrail();
    if (root && root.parentNode) root.parentNode.removeChild(root);
    root = scanEl = traceSvg = tracePath = topEl = hintEl = ghostEl = trailCv = trailG = null;
  },

  // ── THE LINE ──
  /** y: CSS px of the line, null hides; tailPx: the 120 ms phosphor tail (above the line while it moves down) */
  scan(y, tailPx = 60, dir = 1) {
    if (!root) return;
    if (y == null) { if (scanEl) scanEl.style.opacity = '0'; return; }
    if (!scanEl) { scanEl = mk('div', 'boot-scan', root); }
    const t = Math.max(8, Math.min(240, tailPx));
    scanEl.style.height = `${t + 2}px`;
    scanEl.classList.toggle('is-up', dir < 0);
    scanEl.style.transform = dir < 0 ? `translate3d(0,${(y - 1).toFixed(1)}px,0)` : `translate3d(0,${(y - t - 1).toFixed(1)}px,0)`;
    scanEl.style.opacity = '1';
  },

  // ── his drawing, traced ──
  /** pts: [[x, y] …] normalised (−1…1, y down); cx, cy, hPx: screen centre and figure height. → handle */
  trace(pts, cx, cy, hPx) {
    if (!root || !pts || pts.length < 2) return { set() {}, remove() {} };
    if (!traceSvg) {
      traceSvg = document.createElementNS(SVG, 'svg');
      traceSvg.setAttribute('class', 'boot-trace');
      tracePath = document.createElementNS(SVG, 'path');
      tracePath.setAttribute('pathLength', '1');
      traceSvg.appendChild(tracePath);
      root.appendChild(traceSvg);
    }
    let minY = Infinity, maxY = -Infinity;
    for (const p of pts) { minY = Math.min(minY, +p[1] || 0); maxY = Math.max(maxY, +p[1] || 0); }
    const k = hPx / Math.max(0.2, maxY - minY), my = (minY + maxY) / 2;
    let d = '';
    pts.forEach((p, i) => { d += `${i ? 'L' : 'M'}${(cx + (+p[0] || 0) * k).toFixed(1)} ${(cy + ((+p[1] || 0) - my) * k).toFixed(1)}`; });
    tracePath.setAttribute('d', d);
    tracePath.style.strokeDasharray = '1';
    tracePath.style.strokeDashoffset = '1';
    traceSvg.style.opacity = '1';
    return {
      set(u, a = 1) { if (tracePath) { tracePath.style.strokeDashoffset = String(1 - Math.max(0, Math.min(1, u))); traceSvg.style.opacity = String(a); } },
      remove() { if (traceSvg) traceSvg.style.opacity = '0'; },
    };
  },

  // ── phone start screen ──
  start(on) {
    if (!root) return;
    if (on) {
      if (!topEl) { topEl = mk('p', 'boot-top t-micro', root); topEl.textContent = 'VIN / КЛЮЧ / СПИТ'; }
      topEl.classList.add('is-in');
    } else {
      if (topEl) topEl.classList.remove('is-in');
      layer.hint(null);
      layer.ghost(null);
    }
  },
  hint(text) {
    if (!root) return;
    if (text == null) { if (hintEl) { hintEl.classList.remove('is-in'); } return; }
    if (!hintEl) {
      hintEl = mk('p', 'boot-hint t-body', root);
      hintEl.setAttribute('data-qa', 'start-hint');
    }
    if (hintEl.textContent !== text) hintEl.textContent = text;
    hintEl.classList.add('is-in');
  },
  hintText() { return hintEl && hintEl.classList.contains('is-in') ? hintEl.textContent : ''; },
  /** the ghost dot at (x, y) with alpha a; null hides */
  ghost(p, a = 1) {
    if (!root) return;
    if (!p) { if (ghostEl) ghostEl.style.opacity = '0'; return; }
    if (!ghostEl) ghostEl = mk('i', 'boot-ghost', root);
    ghostEl.style.transform = `translate3d(${(p.x - 2).toFixed(1)}px,${(p.y - 2).toFixed(1)}px,0)`;
    ghostEl.style.opacity = String(a);
  },

  // ── the finger's ember trail ──
  trailAdd(x, y) {
    if (!root) return;
    if (!trailCv) {
      trailCv = mk('canvas', 'boot-trail', root);
      trailG = trailCv.getContext('2d');
      sizeTrail();
    }
    const i = (trailHead % TRAIL_MAX) * 3;
    trail[i] = x; trail[i + 1] = y; trail[i + 2] = loop.now;
    trailHead++; trailN = Math.min(TRAIL_MAX, trailN + 1);
    if (!trailFrame) trailFrame = loop.add(drawTrail, 91);
  },
  trailBreak() {   // a new touch starts a new polyline
    const i = (trailHead % TRAIL_MAX) * 3;
    trail[i] = NaN; trail[i + 1] = NaN; trail[i + 2] = loop.now;
    trailHead++; trailN = Math.min(TRAIL_MAX, trailN + 1);
  },
  stopTrail() {
    if (trailFrame) { loop.remove(trailFrame); trailFrame = 0; }
    if (trailG && trailCv) trailG.clearRect(0, 0, trailCv.width, trailCv.height);
    trailN = 0;
  },
  resize() { if (trailCv) sizeTrail(); },
};

function sizeTrail() {
  const dpr = Math.min(2, layout.dpr || window.devicePixelRatio || 1);
  trailCv.width = Math.round((layout.w || window.innerWidth) * dpr);
  trailCv.height = Math.round((layout.h || window.innerHeight) * dpr);
  trailG.setTransform(dpr, 0, 0, dpr, 0, 0);
}

let emberStroke = '';
function drawTrail() {
  if (!trailG) return;
  const now = loop.now;
  trailG.clearRect(0, 0, trailCv.width, trailCv.height);
  if (!emberStroke) emberStroke = `rgb(${getComputedStyle(document.documentElement).getPropertyValue('--ember-rgb').trim() || '255,106,43'})`;
  trailG.lineWidth = 2; trailG.lineCap = 'round'; trailG.lineJoin = 'round';
  trailG.strokeStyle = emberStroke;
  let alive = 0;
  const n = trailN, start = trailHead - n;
  for (let k = start + 1; k < trailHead; k++) {
    const a = ((k - 1) % TRAIL_MAX) * 3, b = (k % TRAIL_MAX) * 3;
    const age = now - trail[b + 2];
    if (age > TRAIL_MS || Number.isNaN(trail[a]) || Number.isNaN(trail[b])) continue;
    alive++;
    trailG.globalAlpha = 1 - age / TRAIL_MS;
    trailG.beginPath(); trailG.moveTo(trail[a], trail[a + 1]); trailG.lineTo(trail[b], trail[b + 1]); trailG.stroke();
  }
  trailG.globalAlpha = 1;
  if (!alive) { loop.remove(trailFrame); trailFrame = 0; trailN = 0; }
}
