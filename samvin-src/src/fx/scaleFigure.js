// fx/scaleFigure.js — «ТЫ», the scale figure (SPEC-ADDENDUM A2.3; ARCH-ADDENDUM X§2.5.7). OWNER: WP12.
// An architectural scale figure at his real height (operator.heightM, default 1.30 m; «ПАПА» beside it when
// papaHeightM is set): head circle, one closed mirror-symmetric body outline (26 vertices, arms down, no face, no
// hands, no gear) and a 0.60 m ground line — three hairline R3 polylines, 0.5 px --silver at 70 %, never filled, never
// animated. It stands on nest level 0 (not in the Key's yawing group) left of the Key, ground at y −1.20. Each figure
// carries a vertical dimension line 0.10 m left of its outline (`↕ 1.30 М`) and its LABEL 8 px above the head. Below
// 4 px tall the figure becomes a 2 px --white point and the label's leader keeps pointing at it; in the PULL, from
// 3,600 m out, `↕ 2 400 М` draws along VIN. Contexts: 'hover' (CORE explode), 'pull', 'izn' (ИЗНАНКА).
import { Vector3 } from 'three';
import { createLines } from '../render/lines.js';
import { createPoints } from '../render/points.js';
import { scaleEngine } from '../render/scale.js';
import { rig } from '../render/cameraRig.js';
import { WORLD } from '../data/world.js';
import { thin } from '../core/ru.js';
import { keepout } from '../ui/keepout.js';

const BODY = [0.030, 0.860, 0.105, 0.830, 0.135, 0.790, 0.140, 0.640, 0.130, 0.470, 0.108, 0.465, 0.102, 0.640, 0.092, 0.735,
  0.088, 0.500, 0.078, 0.020, 0.080, 0.000, 0.018, 0.000, 0.012, 0.455];
const Y0 = -1.20;

function outline(h, x0, seg, n) {
  const put = (ax, ay, bx, by) => { seg.set([x0 + ax, Y0 + ay, 0, x0 + bx, Y0 + by, 0], n * 6); n++; };
  for (let k = 0; k < 24; k++) {
    const a = (k / 24) * Math.PI * 2, b = ((k + 1) / 24) * Math.PI * 2, r = 0.065 * h, c = 0.935 * h;
    put(Math.cos(a) * r, c + Math.sin(a) * r, Math.cos(b) * r, c + Math.sin(b) * r);
  }
  const P = [];
  for (let i = 0; i < 26; i += 2) P.push([BODY[i] * h, BODY[i + 1] * h]);
  for (let i = 24; i >= 0; i -= 2) P.push([-BODY[i] * h, BODY[i + 1] * h]);
  for (let i = 0; i < P.length; i++) { const p = P[i], q = P[(i + 1) % P.length]; put(p[0], p[1], q[0], q[1]); }
  put(-0.30, 0, 0.30, 0);
  return n;
}

export function createScaleFigure(F) {
  const { ctx } = F;
  const op = (WORLD && WORLD.operator) || {};
  const hTy = +op.heightM > 0 ? +op.heightM : 1.30;
  const hPa = +op.papaHeightM > 0 ? +op.papaHeightM : 0;
  // close in at the Key's narrowing lower half (still left of it, A2.3): the figure, its ↕ value and its LABEL stand
  // clear of the room title's last letter instead of against it
  const figs = hPa ? [{ id: 'ty', name: 'ТЫ', h: hTy, x: -0.92 }, { id: 'papa', name: 'ПАПА', h: hPa, x: -1.40 }] : [{ id: 'ty', name: 'ТЫ', h: hTy, x: -0.98 }];
  for (const f of figs) f.kid = `fig:${f.id}`;
  const seg = new Float32Array(figs.length * 51 * 6);
  let n = 0;
  for (const f of figs) n = outline(f.h, f.x, seg, n);
  const lines = createLines({ segments: seg, count: n, width: 0.5, alpha: 0.7, color: 'silver', far: 1e9, glint: 0.5 });
  const dotPos = new Float32Array(figs.length * 3);
  figs.forEach((f, i) => dotPos.set([f.x, Y0 + f.h * 0.5, 0], i * 3));
  const dot = createPoints({ positions: dotPos, sizePx: 2, color: 'white', alpha: 1, fog: false });
  const lvl = ctx.nest && ctx.nest.level(0);
  if (lvl) { lvl.add(lines.mesh); lvl.add(dot.object); }
  lines.setAlpha(0); dot.setAlpha(0);

  const _a = new Vector3(), _b = new Vector3();
  const pa = { x: 0, y: 0, depth: 0, visible: false }, pb = { x: 0, y: 0, depth: 0, visible: false };
  let ctxName = null, vis = false, tiny = false, hPx = 0, alpha = 0, a0 = 0, a1 = 0, t0 = 0, tms = 1, anchors = [], dimsList = [], vinDim = null;
  const toR = (x, y, out) => (lvl ? lvl.localToWorld(out.set(x, Y0 + y, 0)) : scaleEngine.toRender(out.set(x, Y0 + y, 0), out));

  function tag(qa) { const ov = document.getElementById('overlay'); const l = ov && ov.lastElementChild; if (l) { l.dataset.qa = qa; } }
  function clearDom() {
    for (const a of anchors) a.remove();
    for (const d of dimsList) d.remove();
    if (vinDim) vinDim.remove();
    anchors = []; dimsList = []; vinDim = null;
  }
  function fade(to, ms) { a0 = alpha; a1 = to; t0 = performance.now(); tms = Math.max(1, ms); }

  const fig = {
    /** context 'hover' | 'pull' | 'izn' */
    show(context) {
      if (!ctx.overlay || !ctx.dims) return;
      ctxName = context || 'hover';
      if (vis) return;
      vis = true; tiny = false;
      fade(1, 240);
      lines.setDrawRange01(0, 1);
      for (const f of figs) {
        const el = document.createElement('span');
        el.className = 't-label fx-fl';
        el.dataset.qa = 'figure-label';
        const inner = document.createElement('span');
        inner.textContent = f.name;
        el.append(inner);
        const top = f.h + 0.02;
        anchors.push(ctx.overlay.add({ owner: 'fx', id: f.id, el, scrim: false, lowpass: 0, priority: 5, hideBehind: false,
          get: (out) => (tiny ? toR(f.x, f.h * 0.5, out) : toR(f.x, top, out)) }));
        const lx = f.x - 0.14 * f.h - 0.10;
        const d = ctx.dims.add({ owner: 'fx', side: 'left', offset: 4, label: `↕ ${f.h.toFixed(2)} М`,
          a: (out) => toR(lx, 0, out), b: (out) => toR(lx, f.h, out) });
        tag('figure-dim');
        d.drawIn(240);
        dimsList.push(d);
      }
    },
    hide(ms = 240) {
      if (!vis) return;
      vis = false; ctxName = null;
      for (const f of figs) keepout.off(f.kid);
      fade(0, ms);
      clearDom();
    },
    state() { return { visible: vis, heightPx: Math.round(hPx * 100) / 100 }; },
    frame() {
      if (alpha !== a1) {
        const x = Math.min(1, (performance.now() - t0) / tms);
        alpha = a0 + (a1 - a0) * x;
      }
      if (!vis && alpha <= 0) { if (lines.mesh.visible) { lines.setAlpha(0); dot.setAlpha(0); } return; }
      if (!rig.camera) return;
      const f = figs[0];
      rig.project(toR(f.x, 0, _a), pa); rig.project(toR(f.x, f.h, _b), pb);
      hPx = pa.depth > 0 && pb.depth > 0 ? Math.hypot(pb.x - pa.x, pb.y - pa.y) : 0;
      const t = hPx < 4;
      if (t !== tiny) {
        tiny = t;
        for (const an of anchors) an.update({ leader: t ? { side: 'left', len: 48, rise: -32 } : null, cross: false });
        for (const d of dimsList) d.setVisible(!t);
      }
      // The figure's screen box (outline + label above the head) is a keep-out for the drawing's own text and lines.
      for (const g of figs) {
        if (!vis || tiny) { keepout.off(g.kid); continue; }
        rig.project(toR(g.x - 0.15 * g.h, 0, _a), pa); rig.project(toR(g.x + 0.15 * g.h, g.h, _b), pb);
        if (pa.depth > 0 && pb.depth > 0) {
          keepout.set(g.kid, Math.min(pa.x, pb.x), Math.min(pa.y, pb.y) - 22, Math.max(pa.x, pb.x), Math.max(pa.y, pb.y));
        } else keepout.off(g.kid);
      }
      lines.setAlpha(0.7 * alpha * (tiny ? 0 : 1));
      dot.setAlpha(tiny ? alpha : 0);
      if (ctxName === 'pull') {
        const dist = scaleEngine.toCanonical(rig.camera.position, _a).length();
        if (dist >= 3600 && !vinDim) {
          vinDim = ctx.dims.add({ owner: 'fx', side: 'left', offset: 24, label: `↕ ${thin(2400)} М`,
            a: (out) => scaleEngine.toRender(out.set(-700, -1200, 0), out), b: (out) => scaleEngine.toRender(out.set(-700, 1200, 0), out) });
          tag('vin-dim');
          vinDim.drawIn(240);
        }
      }
    },
  };
  return fig;
}
