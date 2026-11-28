// t0/keySvg.js — WP11. The SVG elevation of the Key (SPEC §12.5, §3.1; SPEC-ADDENDUM A12 kept as intent: one warm
// accent, one light, S·A·M·•·V·I·N always readable). Seven lofted n-gon strata in front elevation: the visible vertex
// generators (silver), the hidden ones dashed (construction-drawing hidden lines), the silhouette, the ring lines, 12 ticks
// per face, the frieze, the signs on face 0 as a sliding strip clipped to the band (the cryptex), the • aperture rings round
// the ember nucleus, the idle grain rings edge-on and the lit nodes of the sigil. Geometry is written in CSS px (no scaled
// group, no non-scaling strokes: both are pathological for GPU raster on software GL), rebuilt by place(); the white copy
// of the edges for the lamp lives in its own <svg> layer under a CSS radial mask (moving the mask repaints the mask only).
import { STRATA_GEOM, radiusAt, KEY, NUCLEUS, GRAINS } from '../core/tokens.js';
import { normalizeGlyph, nodeXY } from '../core/glyph.js';
import { svg, el, fmt, rand, clear } from './dom.js';

const TAU = Math.PI * 2;
let uid = 0;

function vertexAngles(n) { const a = []; for (let j = 0; j < n; j++) a.push(((2 * j + 1) * Math.PI) / n); return a; }
function ringsOf(st) {
  const ys = [st.top, st.top + (st.bot - st.top) / 3, st.top + (2 * (st.bot - st.top)) / 3, st.bot];
  if (st.top > 0 && st.bot < 0) ys.splice(2, 0, 0);
  return ys.sort((a, b) => b - a);
}

/** Points of the clan sigil on the • stratum's front faces (x ∈ ±0.40 m, y ∈ ±0.20 m), skipping the aperture. */
function sigilPoints(sigil) {
  const out = [];
  const seen = new Set();
  for (const [a, b] of normalizeGlyph(sigil || [])) {
    const A = nodeXY(a), B = nodeXY(b);
    const steps = Math.max(1, Math.round(Math.hypot(B.x - A.x, B.y - A.y) * 6));
    for (let q = 0; q <= steps; q++) {
      const u = q / steps;
      const gx = Math.round((A.x + (B.x - A.x) * u) * 12), gy = Math.round((A.y + (B.y - A.y) * u) * 12);
      const key = `${gx},${gy}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const x = (gx / 12 - 0.5) * 0.80, y = (0.5 - gy / 12) * 0.40;
      if (Math.hypot(x, y) < 0.06) continue;
      out.push([x, y]);
    }
  }
  return out;
}

/** → KeyDrawing. opts: { sigil } */
export function createKeySvg(opts = {}) {
  const id = `t0k${++uid}`;
  // the box: the static base drawing, the cryptex windows (each band's strip slides on the compositor inside a CSS
  // clip of the band outline) and the nucleus layers — a band turning never re-rasters the drawing
  const root = el('div', 't0-keybox', null, null, { qa: 't0-key', attrs: { 'aria-hidden': 'true' } });
  const base = svg('svg', { class: 't0-key', 'aria-hidden': 'true' }, root);
  const defs = svg('defs', null, base);
  const hatch = svg('pattern', { id: 't0-hatch', patternUnits: 'userSpaceOnUse', width: '6', height: '6', patternTransform: 'rotate(45)' }, defs);
  svg('path', { d: 'M0 0V6', class: 't0-hatch' }, hatch);
  const G = svg('g', { class: 't0k' }, base);
  const grains = svg('g', { class: 't0k-grains' }, G);
  const grainA = svg('path', { class: 't0k-grain' }, grains);
  const grainB = svg('path', { class: 't0k-grain t0k-grain--b' }, grains);
  const strataG = svg('g', { class: 't0k-strata' }, G);
  const nucG = svg('g', { class: 't0k-nuc' }, G);
  const nucBed = svg('circle', { class: 't0k-nucbed' }, nucG);
  const litG = svg('g', { class: 't0k-lit' }, G);
  const winsBox = el('div', 't0k-wins', null, root);
  const nucSvg = svg('svg', { class: 't0k-nucsvg t0k-nuc', 'aria-hidden': 'true' }, root);
  const nuc = svg('circle', { class: 't0k-nucleus' }, nucSvg);
  const ringSvg = svg('svg', { class: 't0k-nucsvg t0k-ringsvg', 'aria-hidden': 'true' }, root);
  const ring = svg('circle', { class: 't0k-bring' }, ringSvg);
  const cracks = svg('g', { class: 't0k-cracks' }, G);
  // the lamp's white copy: a separate layer (the CSS mask follows the lamp)
  const brightSvg = svg('svg', { class: 't0-key t0-key--bright', 'aria-hidden': 'true' });
  const bright = svg('g', { class: 't0k-bright' }, brightSvg);

  const S = STRATA_GEOM.map((st) => {
    const g = svg('g', { class: 't0k-st', 'data-i': String(st.i) }, strataG);
    const s = {
      st, g, dy: 0, rot: 0, faceW: 0, period: 0, offPx: 0,
      solid: svg('path', { class: 't0k-solid' }, g),
      hid: svg('path', { class: 't0k-hid' }, g),
      ring: svg('path', { class: 't0k-ring', pathLength: '1' }, g),
      tick: svg('path', { class: 't0k-tick', pathLength: '1' }, g),
      edges: svg('path', { class: 't0k-edge', pathLength: '1' }, g),
      out: svg('path', { class: 't0k-out', pathLength: '1' }, g),
      win: el('div', 't0k-win', null, winsBox, { data: { i: String(st.i) } }),
      strip: null, bright: svg('path', { class: 't0k-glint' }, bright),
    };
    s.stripSvg = svg('svg', { class: 't0k-stripsvg', 'aria-hidden': 'true' }, s.win);
    s.strip = svg('g', { class: 't0k-strip' }, s.stripSvg);
    return s;
  });
  const sig = sigilPoints(opts.sigil);
  const nodes = sig.map(() => svg('circle', { r: 1, class: 't0k-node' }, litG));

  /** Rebuilds every path in px for centre (cx, cy) and k px per metre. */
  function geometry(cx, cy, k) {
    const P = (x, y) => `${fmt(cx + x * k)} ${fmt(cy - y * k)}`;
    // grains: 7 planes, the annulus edge-on either side
    const planes = [0];
    for (let i = 0; i < 6; i++) planes.push((STRATA_GEOM[i].bot + STRATA_GEOM[i + 1].top) / 2);
    let gd = '';
    for (const y of planes) {
      const rp = Math.max(0.12, radiusAt(y));
      const a = GRAINS.annulus[0] * rp, b = GRAINS.annulus[1] * rp;
      gd += `M${P(-b, y)}L${P(-a, y)}M${P(a, y)}L${P(b, y)}`;
    }
    grainA.setAttribute('d', gd); grainB.setAttribute('d', gd);
    for (const s of S) {
      const st = s.st, ys = ringsOf(st), ang = vertexAngles(st.n), rr = ys.map((y) => radiusAt(y));
      const smax = Math.max(...ang.map((a) => Math.abs(Math.sin(a))));
      let outline = '';
      ys.forEach((y, j) => { outline += `${j ? 'L' : 'M'}${P(rr[j] * smax, y)}`; });
      for (let j = ys.length - 1; j >= 0; j--) outline += `L${P(-rr[j] * smax, ys[j])}`;
      outline += 'Z';
      let vis = '', hid = '';
      for (const a of ang) {
        const sx = Math.sin(a);
        if (Math.abs(Math.abs(sx) - smax) < 1e-6) continue;
        let d = '';
        ys.forEach((y, j) => { d += `${j ? 'L' : 'M'}${P(rr[j] * sx, y)}`; });
        if (Math.cos(a) > 1e-6) vis += d; else hid += d;
      }
      let rings = '', ticks = '';
      ys.forEach((y, j) => { if (j > 0 && j < ys.length - 1) rings += `M${P(-rr[j] * smax, y)}L${P(rr[j] * smax, y)}`; });
      if (rr[0] > 0.02) {
        for (let j = 0; j < st.n; j++) {
          const a0 = ang[(j + st.n - 1) % st.n] - (j === 0 ? TAU : 0), a1 = ang[j];
          for (let t = 1; t <= KEY.ticksPerFace; t++) {
            const a = a0 + ((a1 - a0) * t) / (KEY.ticksPerFace + 1);
            if (Math.cos(a) <= 0.05) continue;
            ticks += `M${P(rr[0] * Math.sin(a), ys[0])}L${P(rr[0] * Math.sin(a), ys[0] - KEY.tickLen)}`;
          }
        }
      }
      if (st.height > 0.1) {
        const t0 = ys[0] - 0.045, b0 = ys[ys.length - 1] + 0.012, rt = radiusAt(t0) * smax * 0.92, rb = radiusAt(b0) * smax * 0.92;
        rings += `M${P(-rt, t0)}L${P(rt, t0)}M${P(-rb, b0)}L${P(rb, b0)}`;
      }
      s.solid.setAttribute('d', outline); s.hid.setAttribute('d', hid); s.ring.setAttribute('d', rings);
      s.tick.setAttribute('d', ticks); s.edges.setAttribute('d', vis); s.out.setAttribute('d', outline);
      s.bright.setAttribute('d', vis + outline);
      // the window: the band's bounding box, clipped to its outline (CSS polygon, px relative to the window)
      const bx = cx - st.rMax * k - 2, by = cy - st.top * k - 2, bw = 2 * st.rMax * k + 4, bh = st.height * k + 4;
      const poly = [];
      ys.forEach((y, j) => poly.push(`${fmt(cx + rr[j] * smax * k - bx)}px ${fmt(cy - y * k - by)}px`));
      for (let j = ys.length - 1; j >= 0; j--) poly.push(`${fmt(cx - rr[j] * smax * k - bx)}px ${fmt(cy - ys[j] * k - by)}px`);
      Object.assign(s.win.style, { left: `${fmt(bx)}px`, top: `${fmt(by)}px`, width: `${fmt(bw)}px`, height: `${fmt(bh)}px`, clipPath: `polygon(${poly.join(',')})` });
      s.wx = bx; s.wy = by;
      // the cryptex strip: n panels of the face width at mid-height, three periods wide
      const rm = Math.max(0.04, radiusAt(st.mid));
      s.faceW = Math.max(0.05, 2 * rm * Math.sin(Math.PI / st.n)) * k;
      s.period = st.n * s.faceW;
      const capH = Math.min(st.height * KEY.sign.heightFrac * k, s.faceW * 0.95);
      const my = cy - st.mid * k;
      clear(s.strip);
      s.stripSvg.setAttribute('width', fmt(bw)); s.stripSvg.setAttribute('height', fmt(bh));
      s.stripSvg.setAttribute('viewBox', `${fmt(bx)} ${fmt(by)} ${fmt(bw)} ${fmt(bh)}`);
      for (let rep = -1; rep <= 1; rep++) {
        for (let j = 0; j < st.n; j++) {
          const x = cx + (rep * st.n + j) * s.faceW;
          if (j === 0) {
            if (st.sign === '•') {
              svg('circle', { cx: x, cy: my, r: (KEY.apertureD / 2) * k, class: 't0k-ap' }, s.strip);
              svg('circle', { cx: x, cy: my, r: (KEY.apertureD / 2 + 0.014) * k, class: 't0k-ap t0k-ap--o' }, s.strip);
            } else {
              const t = svg('text', { x, y: my, class: 't0k-sign', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, s.strip);
              t.style.fontSize = `${fmt(capH / 0.72)}px`;
              t.textContent = st.sign;
            }
          } else {
            const r = rand(st.i * 31 + j), sz = capH * 0.55;
            const pt = (q) => (q === 7 ? [x, my] : [x + 0.5 * sz * Math.sin((q * TAU) / 7), my - 0.5 * sz * Math.cos((q * TAU) / 7)]);
            let d = '', a = Math.floor(r() * 8);
            const n = 3 + Math.floor(r() * 3);
            for (let q = 0; q < n; q++) { let b = Math.floor(r() * 8); if (b === a) b = (b + 3) % 8; const p = pt(a), qq = pt(b); d += `M${fmt(p[0])} ${fmt(p[1])}L${fmt(qq[0])} ${fmt(qq[1])}`; a = b; }
            svg('path', { d, class: 't0k-cipher' }, s.strip);
          }
          svg('path', { d: `M${fmt(x - s.faceW / 2)} ${fmt(my - st.height * 0.32 * k)}V${fmt(my + st.height * 0.32 * k)}`, class: 't0k-seam' }, s.strip);
        }
      }
      K.setRot(st.i, s.rot);
    }
    nucBed.setAttribute('cx', fmt(cx)); nucBed.setAttribute('cy', fmt(cy)); nucBed.setAttribute('r', fmt((KEY.apertureD / 2 + 0.02) * k));
    const R2 = NUCLEUS.breathRingR * k + 4;
    for (const sv of [nucSvg, ringSvg]) {
      sv.setAttribute('width', fmt(2 * R2)); sv.setAttribute('height', fmt(2 * R2));
      sv.setAttribute('viewBox', `${fmt(-R2)} ${fmt(-R2)} ${fmt(2 * R2)} ${fmt(2 * R2)}`);
      Object.assign(sv.style, { left: `${fmt(cx - R2)}px`, top: `${fmt(cy - R2)}px` });
    }
    nuc.setAttribute('cx', '0'); nuc.setAttribute('cy', '0'); nuc.setAttribute('r', fmt(NUCLEUS.r * k));
    ring.setAttribute('cx', '0'); ring.setAttribute('cy', '0'); ring.setAttribute('r', fmt(NUCLEUS.breathRingR * k));
    nodes.forEach((c, j) => { c.setAttribute('cx', fmt(cx + sig[j][0] * k)); c.setAttribute('cy', fmt(cy - sig[j][1] * k)); });
  }

  const K = {
    id, root, base, brightSvg, group: G, strata: S, nucleus: nuc, nucleusEl: nucSvg, ring, ringEl: ringSvg, nodes, cracks, cx: 0, cy: 0, k: 200,
    /** toggles a class on stratum i's drawing and its cryptex window */
    stratumClass(i, cls, on) { const s = S[i]; if (s) { s.g.classList.toggle(cls, !!on); s.win.classList.toggle(cls, !!on); } },
    /** Places the drawing: centre (px) and scale (px per metre) — rebuilds the paths. */
    place(cx, cy, k) { K.cx = cx; K.cy = cy; K.k = k; geometry(cx, cy, k); K.setGap(K.gap || 0.020); },
    toScreen(xm, ym, out) { const o = out || { x: 0, y: 0 }; o.x = K.cx + xm * K.k; o.y = K.cy - ym * K.k; return o; },
    toMetres(px, py, out) { const o = out || { x: 0, y: 0 }; o.x = (px - K.cx) / K.k; o.y = (K.cy - py) / K.k; return o; },
    /** Band under a screen point: stratum index, 3 for the nucleus, −1 off the Key (a 6 px tolerance). */
    pick(px, py) {
      const x = (px - K.cx) / K.k, y = (K.cy - py) / K.k, tol = 6 / K.k;
      if (Math.hypot(x, y) < KEY.apertureD) return 3;
      for (const s of S) {
        const yy = y - s.dy;
        if (yy <= s.st.top + tol + 0.01 && yy >= s.st.bot - tol - 0.01 && Math.abs(x) <= radiusAt(Math.max(-1.2, Math.min(1.2, yy))) + tol) return s.st.i;
      }
      return -1;
    },
    /** Cryptex: stratum i turned by `rad` (0 = aligned); the strip slides by the face widths. */
    setRot(i, rad) {
      const s = S[i];
      if (!s || !s.period) { if (s) s.rot = rad; return; }
      s.rot = rad;
      let off = -(rad / (TAU / s.st.n)) * s.faceW;
      off = ((off % s.period) + s.period * 1.5) % s.period - s.period / 2;
      if (Math.abs(off - s.offPx) < 0.05) return;
      s.offPx = off;
      s.stripSvg.style.transform = `translate3d(${fmt(off)}px,0,0)`;
    },
    /** Vertical spread: gap g (m) → Δy_i = (3 − i)·(g − 0.020) (ARCH §3.3.3). */
    setGap(g) {
      K.gap = g;
      for (const s of S) {
        s.dy = (3 - s.st.i) * (g - 0.020);
        const t = Math.abs(s.dy) < 1e-5 ? null : `translate(0 ${fmt(-s.dy * K.k)})`;
        if (t) { s.g.setAttribute('transform', t); s.bright.setAttribute('transform', t); } else { s.g.removeAttribute('transform'); s.bright.removeAttribute('transform'); }
        s.win.style.transform = t ? `translate3d(0,${fmt(-s.dy * K.k)}px,0)` : '';
      }
    },
    setLit(n) { nodes.forEach((c, j) => c.classList.toggle('is-lit', j < n)); },
    /** The lamp at a screen point with strength 0..1 (the bright layer's mask). */
    lamp() {},
    /** n-frame flash of stratum i's strokes ('white' | 'electrum'). */
    flash(i, token = 'white', frames = 1) {
      const s = S[i];
      if (!s) return;
      const cls = token === 'electrum' ? 'is-electrum' : 'is-white';
      s.g.classList.add(cls);
      let n = Math.max(1, frames) + 1;
      const step = () => { if (--n <= 0) s.g.classList.remove(cls); else requestAnimationFrame(step); };
      requestAnimationFrame(step);
    },
    band(i) {
      const s = S[i];
      if (!s) return null;
      const y0 = K.cy - (s.st.top + s.dy) * K.k, y1 = K.cy - (s.st.bot + s.dy) * K.k;
      return { x: K.cx - s.st.rMax * K.k, y: y0, w: 2 * s.st.rMax * K.k, h: y1 - y0, cx: K.cx, cy: (y0 + y1) / 2 };
    },
  };
  return K;
}
