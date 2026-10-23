// halls/insignia/relics.js — WP9: the relics (SPEC §6.6 Relics, Hover, Click; §2.7 relic hover; §7.6 extraction 600 ms;
// SPEC-ADDENDUM A11.6 `where`). One per achievement, 1.4 m, R2 obsidian with R3 edges, in the vault's CPU batches.
//   earned:   the equator ring r 12 m at eye height, evenly spaced; legendary: --white edges at 90 % + a slow glint sweep
//   unearned: dashed --pewter silhouettes (edges only) on the lower ring r 16 m, y −4 m, with their label always up:
//             LABEL «НЕ НАЙДЕНО», the title, the condition as BODY
//   hover:    turns 30° toward the lamp (medium spring), its edges take more glint, the leader block draws: HEADING title,
//             LABEL rarity, MICRO `dd.mm.yyyy · {where}` (undated: `{where}` alone), BODY «Кто: …»
//   held:     extraction 600 ms (medium spring) to 3 m in front of the eye; drag rotates with inertia, a flick spins it
//             (×0.96 per 16.7 ms frame); release springs it back to its place on the ring.
// The ring group (yaw) is the hall's; everything here is ring-local. No allocation in update().
import { Matrix4, Quaternion, Vector3, Euler } from 'three';
import { buildRelicGeometry } from './shapes.js';
import { Spring, SPRING } from '../../core/spring.js';
import { fmtDate, upper } from '../../core/ru.js';
import { whereLabel, memberById } from '../../data/world.js';
import { mulberry32 } from '../../core/rng.js';

export const RELIC = Object.freeze({ size: 1.4, rE: 12, yE: 1.7, rU: 16, yU: -4, holdDist: 3 });
const TURN = (30 * Math.PI) / 180;
const _m = new Matrix4(), _q = new Quaternion(), _q2 = new Quaternion(), _qy = new Quaternion(), _p = new Vector3();
const _s = new Vector3(1, 1, 1), _w = new Vector3(), _c = new Vector3();
const _pp = { x: 0, y: 0, depth: 0, visible: false };
const Y = new Vector3(0, 1, 0), X = new Vector3(1, 0, 0);

function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

/** Hover/label copy pieces (A11.6): MICRO `dd.mm.yyyy · В ЖИЗНИ`, undated → `В ЖИЗНИ` alone (null where → date alone). */
export function relicMicro(a) {
  const w = whereLabel(a.where);
  const d = a.date ? fmtDate(a.date) : '';
  return [d, w].filter(Boolean).join(' · ');
}
export function whoNames(a) { return (a.who || []).map((id) => { const m = memberById(id); return m ? m.name : null; }).filter(Boolean); }

export function createRelics(hctx, ring, labels) {
  const achs = hctx.world.achievements;
  const earned = achs.filter((a) => a.earned), open = achs.filter((a) => !a.earned);
  const rnd = mulberry32(0x1d5);
  const list = [];
  const geoCache = new Map();
  const geoOf = (shape) => { if (!geoCache.has(shape)) geoCache.set(shape, buildRelicGeometry(shape, RELIC.size)); return geoCache.get(shape); };

  achs.forEach((a) => {
    const isE = !!a.earned;
    const k = isE ? earned.indexOf(a) : open.indexOf(a);
    const n = isE ? earned.length : open.length;
    // both rings start at the same place: the first goal hangs right under the first trophy (the facing pair)
    const th = (Math.PI * 2 * k) / Math.max(1, n);
    const r = isE ? RELIC.rE : RELIC.rU, y = isE ? RELIC.yE : RELIC.yU;
    const g = geoOf(a.shape);
    const legendary = isE && /легенд/i.test(a.rarity || '');
    const base = new Quaternion().setFromEuler(new Euler((rnd() - 0.5) * 0.5, -th + (rnd() - 0.5) * 0.6, (rnd() - 0.5) * 0.4));
    const R = { a, id: a.id, earned: isE, legendary, th, pos: new Vector3(Math.sin(th) * r, y, -Math.cos(th) * r), base,
      solid: -1, edge: -1, batch: null, hover: Spring.from(SPRING.medium, 0), hoverSign: 1,
      sx: 0, sy: 0, on: false, dirty: true, label: null, hNorm: null };
    if (isE) {
      R.solid = ring.solids.add(g.flat);
      R.batch = legendary ? ring.white : ring.silver;
      R.edge = R.batch.add(g.edges, { alpha: legendary ? 0.9 : 0.6, width: legendary ? 1.25 : 1 });
      if (legendary) {
        R.hNorm = new Float32Array(g.edges.length / 6);
        for (let s = 0; s < R.hNorm.length; s++) R.hNorm[s] = 0.5 + (g.edges[s * 6 + 1] + g.edges[s * 6 + 4]) / (2 * RELIC.size);
      }
    } else {
      R.batch = ring.pewter;
      R.edge = ring.pewter.add(g.edges, { alpha: 0.85, width: 1 });
    }
    // the label block (section DOM)
    const box = el('div', `ins-lbl ${isE ? 'ins-lbl--earned' : 'ins-lbl--open'}`);
    box.dataset.id = a.id;
    if (isE) {
      box.append(el('p', 't-heading ins-lbl-title', a.title), el('p', 't-label ins-lbl-rarity', upper(a.rarity || '')),
        el('p', 't-micro ins-lbl-date', relicMicro(a)));
      const who = whoNames(a);
      if (who.length) box.append(el('p', 't-body ins-lbl-who', `Кто: ${who.join(', ')}`));
    } else {
      box.append(el('p', 't-label ins-lbl-nf', 'НЕ НАЙДЕНО'), el('p', 't-body ins-lbl-name', a.title),
        el('p', 't-body ins-lbl-cond', a.text || ''));
      const more = el('div', 'ins-lbl-more');
      more.append(el('p', 't-label ins-lbl-rarity', upper(a.rarity || '')));
      const w = relicMicro(a);
      if (w) more.append(el('p', 't-micro ins-lbl-date', w));
      box.append(more);
    }
    const side = Math.sin(th) < -0.05 ? 'right' : 'left';
    R.label = labels.add({ el: box, get: (out) => worldPos(R, out), side, len: isE ? 40 : 32, rise: isE ? -28 : -24 });
    R.label.show(!isE);
    list.push(R);
  });

  let yaw = 0, hovered = -1, heldK = -1;
  const held = { x: Spring.from(SPRING.medium, 0), q: new Quaternion(), vx: 0, vy: 0, dragging: false, k: -1, rm: false, rmT: 0 };
  const holdPos = new Vector3();

  /** Hall-local position of relic R (ring yaw applied; the held one at its spring point). */
  function worldPos(R, out) {
    out.copy(R.pos).applyAxisAngle(Y, yaw);
    if (R === list[held.k] && held.x.x > 0) out.lerp(holdPos, held.x.x);
    return out;
  }

  function compose(R) {
    // orientation: base · hover turn (about world-ish y) · held spin
    _qy.setFromAxisAngle(Y, R.hover.x * TURN * R.hoverSign);
    _q.copy(_qy).multiply(R.base);
    _p.copy(R.pos);
    if (list[held.k] === R && held.x.x > 0) {
      const u = held.x.x;
      // the hold point, ring-local: rotate the eye-frame point by −yaw
      _w.copy(holdPos).applyAxisAngle(Y, -yaw);
      _p.lerp(_w, u);
      _qy.setFromAxisAngle(Y, -yaw);
      _q2.copy(_qy).multiply(held.q);
      _q.slerp(_q2, u);
    }
    _m.compose(_p, _q, _s);
    if (R.solid >= 0) ring.solids.setMatrix(R.solid, _m);
    R.batch.setMatrix(R.edge, _m);
  }

  const api = {
    list,
    get hovered() { return hovered; },
    get heldIndex() { return held.k; },
    get heldU() { return held.x.x; },
    setYaw(y) { yaw = y; },
    index(id) { for (let k = 0; k < list.length; k++) if (list[k].id === id) return k; return -1; },
    worldPos(k, out) { return worldPos(list[k], out); },
    setHover(k) {
      if (k === hovered) return;
      if (hovered >= 0) { const R = list[hovered]; R.hover.target = 0; if (R.earned) R.label.show(false); else R.label.el.classList.remove('is-hover'); }
      hovered = k;
      if (k >= 0) {
        const R = list[k];
        R.hover.target = 1;
        if (R.earned) R.label.show(true); else R.label.el.classList.add('is-hover');
      }
    },
    /** Screen pick (CSS px) → relic index or −1: the nearest projected centre within ~0.7 m of screen radius. */
    hit(x, y) {
      let best = -1, bd = Infinity;
      for (let k = 0; k < list.length; k++) {
        const R = list[k];
        if (!R.on) continue;
        const d = Math.hypot(R.sx - x, R.sy - y);
        if (d < R.rad && d < bd) { bd = d; best = k; }
      }
      return best;
    },
    /** Extract relic k to the hold point (eye-frame hall-local point), or release (k = −1). */
    hold(k, point, rm) {
      if (point) holdPos.copy(point);
      held.rm = !!rm;
      if (k >= 0) {
        if (held.k !== k && held.k >= 0) { held.x.snap(0); list[held.k].dirty = true; }
        held.k = k; held.x.target = 1; held.vx = 0; held.vy = 0;
        // start the held spin from the relic's own orientation, as seen in the eye frame
        _qy.setFromAxisAngle(Y, yaw);
        held.q.copy(_qy).multiply(list[k].base);
        if (rm) held.x.snap(1);
      } else if (held.k >= 0) {
        held.x.target = 0;
        if (rm) { held.x.snap(0); list[held.k].dirty = true; held.k = -1; }
      }
    },
    /** Drag on the held relic (px deltas) and release velocity (px/ms). */
    spin(dx, dy) {
      _q2.setFromAxisAngle(Y, dx * 0.012); held.q.premultiply(_q2);
      _q2.setFromAxisAngle(X, dy * 0.012); held.q.premultiply(_q2);
      held.vx = dx; held.vy = dy;
    },
    fling(vx, vy) { held.vx = vx * 16.7; held.vy = vy * 16.7; held.dragging = false; },
    grab() { held.dragging = true; held.vx = 0; held.vy = 0; },
    setAlpha(a) { ring.solids.mesh.material.uniforms.uAlpha.value = a; },
    update(dt, t) {
      const ms = dt * 1000;
      // the held relic: extraction spring, inertia ×0.96 per 16.7 ms frame
      if (held.k >= 0) {
        const R = list[held.k];
        held.x.step(dt);
        if (!held.dragging && (Math.abs(held.vx) > 0.01 || Math.abs(held.vy) > 0.01)) {
          const f = Math.pow(0.96, ms / 16.7);
          held.vx *= f; held.vy *= f;
          _q2.setFromAxisAngle(Y, held.vx * 0.012 * (ms / 16.7)); held.q.premultiply(_q2);
          _q2.setFromAxisAngle(X, held.vy * 0.012 * (ms / 16.7)); held.q.premultiply(_q2);
        }
        R.dirty = true;
        if (held.x.target === 0 && held.x.x < 0.002) { held.x.snap(0); held.k = -1; R.dirty = true; }
      }
      const lamp = hctx.U && hctx.U.uLamp ? hctx.U.uLamp.value : null;
      for (let k = 0; k < list.length; k++) {
        const R = list[k];
        // turn toward the lamp: the sign follows the lamp's side of the relic, seen from the eye
        if (R.hover.target > 0 && lamp) {
          worldPos(R, _w);
          hctx.toCanonical(_w, _c);
          const side = (lamp.x - _c.x) * Math.cos(R.th - yaw) + (lamp.z - _c.z) * Math.sin(R.th - yaw);
          R.hoverSign = side >= 0 ? 1 : -1;
        }
        if (!R.hover.settled(1e-4)) { R.hover.step(dt); R.dirty = true; }
        if (R.dirty || k === held.k) { R.dirty = false; compose(R); }
        // projected centre for picking
        worldPos(R, _w);
        hctx.toCanonical(_w, _c);
        if (hctx.scale && hctx.scale.toRender) hctx.scale.toRender(_c, _c);
        hctx.rig.project(_c, _pp);
        R.on = _pp.visible;
        R.sx = _pp.x; R.sy = _pp.y;
        R.rad = Math.max(30, Math.min(220, (0.75 * hctx.layout.h) / Math.max(0.5, _pp.depth) / (2 * Math.tan((hctx.rig.camera ? hctx.rig.camera.fov : 40) * Math.PI / 360))));
        // legendary glint sweep: a slow bright band climbing the edges every 7 s (staggered per relic)
        if (R.legendary) {
          const rg = R.batch.range(R.edge);
          const ph = ((t / 1000 + k * 2.3) % 7) / 1.6 - 0.2;
          const hv = R.hover.x;
          for (let s = 0; s < rg.n; s++) {
            const d = (R.hNorm[s] - ph) / 0.14, b = ph < 1.2 ? Math.exp(-d * d) : 0;
            R.batch.width[rg.off + s] = 1.25 + 1.4 * b + 0.5 * hv;
            R.batch.alpha[rg.off + s] = Math.min(1, 0.9 + 0.1 * b + 0.1 * hv);
          }
          R.batch.touch();
        } else if (R.earned) {
          R.batch.setAlpha(R.edge, 0.6 + 0.35 * R.hover.x);
          R.batch.setWidth(R.edge, 1 + 0.5 * R.hover.x);
        } else {
          R.batch.setAlpha(R.edge, 0.85 + 0.15 * R.hover.x);
        }
      }
    },
    dispose() {
      for (const R of list) if (R.label) R.label.remove();
      for (const g of geoCache.values()) g.solid.dispose();
      geoCache.clear();
    },
  };
  return api;
}
