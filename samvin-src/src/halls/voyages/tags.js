// halls/voyages/tags.js — WP6: the hatches' readable labels (SPEC §6.3 «Its labels are LABEL 004 and, under it, BODY
// 15 px with the title for every unlocked state», A11.6 `where` MICRO, A3.4 proposal LABEL `П-1`), drawn in the
// construction-drawing grammar of SPEC §2.3: a 7 px survey cross on the hatch rim, a 0.5 px --silver 70 % hairline
// leader (one 45° elbow when the block had to move) and the block on a radial --deep scrim. No box, no border.
//
// Desktop: every hatch has its tag (a real <button>, data-qa="hatch"). The polar floor is larger than the sheet, so
// a hatch whose rim leaves the drawing keeps its tag on the sheet border, with the leader running off the sheet and an
// open 6 px arrowhead toward it (the floor continues; the wheel rises over it). Tags never sit on the title, the verb,
// the chrome or each other (a greedy placement, recomputed only when the view moves by > 2 px; positions follow
// through the 120 ms one-pole low-pass of SPEC §2.3). No layout reads in the per-frame projection (sizes are measured
// once per text change).
// Phone: SPEC «the selected hatch gets the hover state and its label» — one tag, the selected hatch's; and the sheet
// peek holds the spiral rail: one tick per hatch in spiral order (the selection moves along it), each an <li
// data-qa="hatch"> carrying its label for screen readers.
import { Vector3 } from 'three';
import { whereLabel } from '../../data/world.js';
import { HATCH_R } from './layout.js';

const SVGNS = 'http://www.w3.org/2000/svg';
const LP_MS = 120;
const GAP = 22;                    // leader run from the rim cross to the block
const EDGE = 26;                   // tags keep this far inside the edge strings

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  return e;
}

/** Text of a hatch from its view: { code, line, title, where, note } */
export function tagText(v) {
  if (v.state === 'proposal') return { line: v.code, title: v.title, where: whereLabel(v.where) };
  const unlocked = v.state === 'done' || v.state === 'active' || v.state === 'new';
  return {
    line: `${v.numberShown} · ${v.label}`,
    title: unlocked ? v.title : null,
    where: unlocked ? whereLabel(v.mission.where) : null,
  };
}

function fillTag(b, v) {
  const t = tagText(v);
  b.dataset.code = v.code;
  b.dataset.state = v.state;
  b.textContent = '';
  const line = el('span', 't-label vy-tag-line', t.line);
  line.dataset.qa = 'hatch-label';
  b.appendChild(line);
  if (t.title) b.appendChild(el('span', 't-body vy-tag-title', t.title));
  if (t.where) { const w = el('span', 't-micro vy-where', t.where); w.dataset.qa = 'hatch-where'; b.appendChild(w); }
  const note = el('span', 't-body vy-tag-note');
  note.hidden = true;
  b.appendChild(note);
  b.setAttribute('aria-label', [t.line, t.title, t.where].filter(Boolean).join(' · '));
  return note;
}

/** @param hctx HallCtx  @param opts { onActivate(k), onHover(k, on), isPhone } */
export function createTags(hctx, opts) {
  const root = el('div', 'vy-field');
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('class', 'vy-leaders');
  svg.setAttribute('aria-hidden', 'true');
  root.appendChild(svg);
  const rail = el('ol', 'vy-rail');
  rail.setAttribute('aria-label', 'Вылазки');
  const T = [];                      // { b, note, path, cross, li, x, y, w, h, sx, sy, side, dy, pinned, ax, ay, ok, noteUntil }
  const _c = new Vector3(), _r = new Vector3(), _w = new Vector3();
  const pc = { x: 0, y: 0, depth: 0, visible: false }, pr = { x: 0, y: 0, depth: 0, visible: false };
  const ctr = { x: 0, y: 0, depth: 0, visible: false };
  let n = 0, alpha = 0, dirty = true, measured = false, phone = !!opts.isPhone, sel = 0;
  let lastKey = '';
  const zones = [];                  // forbidden rects [x0, y0, x1, y1] (desktop)

  function project(x, y, z, out) {
    _w.set(x, y, z);
    hctx.toCanonical(_w, _c);
    hctx.scale.toRender(_c, _r);
    hctx.rig.project(_r, out);
    return out;
  }

  function setViews(views /* MissionView-like, spiral order */) {
    for (const t of T) { t.b.remove(); t.path.remove(); t.cross.remove(); t.li.remove(); }
    T.length = 0;
    n = views.length;
    for (let k = 0; k < n; k++) {
      const v = views[k];
      const b = el('button', 'vy-tag');
      b.dataset.k = String(k);
      b.type = 'button';
      const note = fillTag(b, v);
      b.addEventListener('click', () => opts.onActivate(k));
      b.addEventListener('pointerenter', () => opts.onHover(k, true));
      b.addEventListener('pointerleave', () => opts.onHover(k, false));
      b.addEventListener('focus', () => opts.onHover(k, true));
      b.addEventListener('blur', () => opts.onHover(k, false));
      const path = document.createElementNS(SVGNS, 'path');
      path.setAttribute('class', 'vy-leader');
      const cross = document.createElementNS(SVGNS, 'path');
      cross.setAttribute('class', 'vy-cross');
      cross.setAttribute('d', 'M-3.5 0H3.5M0 -3.5V3.5');
      svg.append(path, cross);
      const li = el('li', 'vy-tick');
      li.dataset.code = v.code; li.dataset.state = v.state; li.dataset.k = String(k);
      const t = tagText(v);
      li.appendChild(el('span', 'sr-only', `${t.line}${t.title ? ' · ' + t.title : ''}`));
      if (t.where) { const w = el('span', 'sr-only t-micro vy-where', t.where); w.dataset.qa = 'hatch-where'; li.appendChild(w); }
      li.appendChild(el('i', 'vy-tick-mark'));
      const code = el('span', 't-micro vy-tick-code', v.code);
      code.setAttribute('aria-hidden', 'true');
      li.appendChild(code);
      rail.appendChild(li);
      root.appendChild(b);
      T.push({ b, note, path, cross, li, x: 0, y: 0, w: 160, h: 46, sx: NaN, sy: NaN, side: 1, dy: 0, pinned: false,
        ax: 0, ay: 0, ok: false, noteUntil: 0, ex: 0, ey: 0 });
    }
    applyDevice();
    dirty = true; measured = false;
  }

  function applyDevice() {
    for (let k = 0; k < T.length; k++) {
      const t = T[k];
      if (phone) { t.b.removeAttribute('data-qa'); t.li.dataset.qa = 'hatch'; } else { t.b.dataset.qa = 'hatch'; t.li.removeAttribute('data-qa'); }
      t.li.toggleAttribute('data-selected', phone && k === sel);
      t.b.toggleAttribute('data-selected', phone && k === sel);
    }
  }

  function measure() {
    for (const t of T) { const r = t.b.getBoundingClientRect(); if (r.width > 0) { t.w = r.width; t.h = r.height; } }
    measured = true;
  }

  function overlaps(x0, y0, x1, y1, upto) {
    let a = 0;
    for (const z of zones) a += Math.max(0, Math.min(x1, z[2]) - Math.max(x0, z[0])) * Math.max(0, Math.min(y1, z[3]) - Math.max(y0, z[1]));
    for (let q = 0; q < upto; q++) {
      const o = T[q];
      if (!o.ok) continue;
      a += Math.max(0, Math.min(x1, o.x + o.w + 4) - Math.max(x0, o.x - 4)) * Math.max(0, Math.min(y1, o.y + o.h + 4) - Math.max(y0, o.y - 4));
    }
    return a;
  }

  /** Greedy placement (desktop), from projected anchors. */
  function place(W, H) {
    const dY = hctx.datum && hctx.datum.yPx ? hctx.datum.yPx() : H * 0.62;
    zones.length = 0;
    zones.push([0, dY - 150, 660, dY + 30], [0, dY + 30, 380, dY + 104], [0, 0, 300, 76], [W - 260, 0, W, 76],
      [W - 112, 0, W, H], [0, H - 64, 300, H], [W - 300, H - 64, W, H], [W / 2 - 260, H - 84, W / 2 + 260, H]);
    const L = phone ? 16 : EDGE, Tp = phone ? 150 : 64, R = phone ? W - 16 : W - 120, B = phone ? H - 236 : H - 88;
    if (phone) zones.length = 0;
    for (let k = 0; k < n; k++) {
      const t = T[k];
      t.ok = false;
      if (!t.vis) continue;
      if (!t.pinned) {
        let best = null;
        const ry = Math.max(8, ((t.rx - t.lx) / 2) * (t.squash || 0.8));
        for (const side of phone ? [0, 1, -1] : [1, -1]) {
          for (const dy of side === 0 ? [0] : [0, -1, 1, -2, 2, -3, 3]) {
            let ax, ay, x, y;
            if (side === 0) { ax = t.cx; ay = t.cy + ry; x = ax - t.w / 2; y = ay + GAP; }
            else {
              ax = side > 0 ? t.rx : t.lx; ay = t.cy;
              y = ay - 7 + dy * (t.h * 0.5 + 6);
              x = side > 0 ? ax + GAP + Math.abs(dy) * 6 : ax - GAP - Math.abs(dy) * 6 - t.w;
            }
            const clip = (x < L || x + t.w > R || y < Tp || y + t.h > B) ? 1e7 : 0;
            const cost = overlaps(x, y, x + t.w, y + t.h, k) + clip + Math.abs(dy) * 40 + (side < 0 ? 30 : 0);
            if (!best || cost < best.cost) best = { cost, x, y, side, dy, ax, ay };
            if (cost < 50) break;
          }
          if (best && best.cost < 50) break;
        }
        t.x = best.x; t.y = best.y; t.side = best.side; t.dy = best.dy; t.ax = best.ax; t.ay = best.ay;
      } else {
        // pinned on the sheet border, along the ray from the field centre toward the hatch
        const dx = t.cx - ctr.x, dy = t.cy - ctr.y;
        let s = 1;
        if (dx > 0) s = Math.min(s, (R - ctr.x) / dx); else if (dx < 0) s = Math.min(s, (L - ctr.x) / dx);
        if (dy > 0) s = Math.min(s, (B - ctr.y) / dy); else if (dy < 0) s = Math.min(s, (Tp - ctr.y) / dy);
        const bx = ctr.x + dx * s, by = ctr.y + dy * s;
        t.ex = bx; t.ey = by;
        let x = Math.min(R - t.w, Math.max(L, bx - t.w / 2)), y = Math.min(B - t.h, Math.max(Tp, by - t.h / 2));
        for (let tries = 0; tries < 8 && overlaps(x, y, x + t.w, y + t.h, k) > 0; tries++) {
          if (Math.abs(dy) > Math.abs(dx)) x = Math.min(R - t.w, Math.max(L, x + (tries % 2 ? -1 : 1) * (tries + 1) * (t.w * 0.6)));
          else y = Math.min(B - t.h, Math.max(Tp, y + (tries % 2 ? -1 : 1) * (tries + 1) * (t.h + 6)));
        }
        t.x = x; t.y = y; t.ax = bx; t.ay = by;
      }
      t.ok = true;
    }
  }

  const tags = {
    root, rail,
    setViews,
    /** Re-labels one hatch in place (decode, state change) and returns its title span (beam write target). */
    relabel(k, v) {
      const t = T[k];
      if (!t) return null;
      t.note = fillTag(t.b, v);
      const st = tagText(v);
      t.li.dataset.state = v.state;
      t.li.firstChild.textContent = `${st.line}${st.title ? ' · ' + st.title : ''}`;
      const ow = t.li.querySelector('.vy-where');
      if (ow) ow.remove();
      if (st.where) { const w = el('span', 'sr-only t-micro vy-where', st.where); w.dataset.qa = 'hatch-where'; t.li.insertBefore(w, t.li.children[1]); }
      measured = false; dirty = true;
      return t.b;
    },
    /** BODY copy under a hatch (locked / sealed click), held ms. */
    note(k, text, ms, now) {
      const t = T[k];
      if (!t) return;
      t.note.textContent = text; t.note.hidden = false;
      t.noteUntil = now + ms;
      if (phone) { sel = k; applyDevice(); }
      measured = false; dirty = true;
    },
    setPhone(b) { phone = b; applyDevice(); dirty = true; },
    select(k) { sel = Math.max(0, Math.min(n - 1, k)); applyDevice(); dirty = true; },
    get selected() { return sel; },
    tagEl(k) { return T[k] ? T[k].b : null; },
    setAlpha(a) {
      if (alpha <= 0.01 && a > 0.01) for (const t of T) t.sx = NaN;   // re-appearing tags start where they belong
      alpha = a;
      root.style.opacity = String(a);
      root.style.visibility = a > 0.01 ? 'visible' : 'hidden';
      for (const t of T) t.b.tabIndex = a >= 0.7 ? 0 : -1;
    },
    /** Hatch hit test in CSS px (canvas hover / tap): → k or −1 */
    hit(x, y) {
      let best = -1, bd = 1.25;
      for (let k = 0; k < n; k++) {
        const t = T[k];
        if (!t.vis || t.pinned) continue;
        const rx = Math.max(22, (t.rx - t.lx) / 2), ry = Math.max(22, rx * t.squash);
        const d = ((x - t.cx) / rx) ** 2 + ((y - t.cy) / ry) ** 2;
        if (d < bd) { bd = d; best = k; }
      }
      return best;
    },
    /** Screen centre of hatch k (pan for sounds). */
    screenX(k) { return T[k] ? T[k].cx : 0; },
    /** Per frame: hatches = field.hatches (x, z), dt s, now ms */
    update(hatches, dt, now, msLoop) {
      if (!n || alpha <= 0.01) return;
      const W = hctx.layout.w, H = hctx.layout.h;
      if (!measured) measure();
      project(0, 0, 0, ctr);
      let key = 0;
      for (let k = 0; k < n; k++) {
        const t = T[k], h = hatches[k];
        if (!h) continue;
        project(h.x, 0, h.z, pc);
        t.cx = pc.x; t.cy = pc.y;
        project(h.x + HATCH_R, 0, h.z, pr); t.rx = pr.x;
        project(h.x - HATCH_R, 0, h.z, pr); t.lx = pr.x;
        project(h.x, 0, h.z - HATCH_R, pr);
        t.squash = Math.min(1, Math.abs(pc.y - pr.y) / Math.max(1, (t.rx - t.lx) / 2));
        t.pinned = !(pc.depth > 0) || pc.x < 40 || pc.x > W - 130 || pc.y < 70 || pc.y > H - 92;
        t.vis = phone ? k === sel && pc.depth > 0 : true;
        key += Math.round(pc.x / 3) * 7 + Math.round(pc.y / 3) * 13 + (t.vis ? 1 : 0);
        if (t.noteUntil && now > t.noteUntil) { t.noteUntil = 0; t.note.hidden = true; measured = false; dirty = true; }
      }
      if (dirty || String(key) !== lastKey) { lastKey = String(key); dirty = false; place(W, H); }
      const kk = 1 - Math.exp(-(msLoop != null ? msLoop : dt * 1000) / LP_MS);   // loop time: a slow frame still converges
      for (let k = 0; k < n; k++) {
        const t = T[k];
        const show = t.ok && t.vis;
        t.b.style.visibility = show ? '' : 'hidden';
        t.path.style.display = show ? '' : 'none';
        t.cross.style.display = show && !t.pinned ? '' : 'none';
        if (!show) { t.sx = NaN; t.wx = NaN; continue; }
        if (!(t.sx === t.sx)) { t.sx = t.x; t.sy = t.y; } else { t.sx += (t.x - t.sx) * kk; t.sy += (t.y - t.sy) * kk; }
        // write the DOM only when the block moved ≥ 0.1 px or its anchor moved (a still view costs no style work)
        const wx = Math.round(t.sx * 10), wy = Math.round(t.sy * 10), wa = Math.round(t.ax * 10) * 7 + Math.round(t.ay * 10);
        if (wx === t.wx && wy === t.wy && wa === t.wa && t.wp === t.pinned) continue;
        t.wx = wx; t.wy = wy; t.wa = wa; t.wp = t.pinned;
        t.b.style.transform = `translate3d(${t.sx.toFixed(1)}px,${t.sy.toFixed(1)}px,0)`;
        const by = t.sy + 7;                                   // leader meets the code line
        if (!t.pinned && t.side === 0) {
          t.path.setAttribute('d', `M${t.ax.toFixed(1)} ${t.ay.toFixed(1)}L${t.ax.toFixed(1)} ${(t.sy - 3).toFixed(1)}`);
          t.cross.setAttribute('transform', `translate(${t.ax.toFixed(1)} ${t.ay.toFixed(1)})`);
        } else if (!t.pinned) {
          const bx = t.side > 0 ? t.sx - 4 : t.sx + t.w + 4;
          const ex = t.ax + Math.sign(bx - t.ax) * Math.min(Math.abs(by - t.ay), Math.abs(bx - t.ax) - 6);
          t.path.setAttribute('d', `M${t.ax.toFixed(1)} ${t.ay.toFixed(1)}L${ex.toFixed(1)} ${by.toFixed(1)}L${bx.toFixed(1)} ${by.toFixed(1)}`);
          t.cross.setAttribute('transform', `translate(${t.ax.toFixed(1)} ${t.ay.toFixed(1)})`);
        } else {
          // off the sheet: hairline from the block toward the hatch, ending in an open arrowhead at the border
          const sx = t.sx + t.w / 2, sy = t.ey < t.sy ? t.sy - 4 : t.ey > t.sy + t.h ? t.sy + t.h + 4 : by;
          const vx = t.cx - sx, vy = t.cy - sy, vl = Math.hypot(vx, vy) || 1, ux = vx / vl, uy = vy / vl;
          const ex = sx + ux * 26, ey = sy + uy * 26;
          const a1x = ex - ux * 6 - uy * 3.5, a1y = ey - uy * 6 + ux * 3.5, a2x = ex - ux * 6 + uy * 3.5, a2y = ey - uy * 6 - ux * 3.5;
          t.path.setAttribute('d', `M${sx.toFixed(1)} ${sy.toFixed(1)}L${ex.toFixed(1)} ${ey.toFixed(1)}M${a1x.toFixed(1)} ${a1y.toFixed(1)}L${ex.toFixed(1)} ${ey.toFixed(1)}L${a2x.toFixed(1)} ${a2y.toFixed(1)}`);
        }
      }
    },
    resize() { measured = false; dirty = true; },
    dispose() { root.remove(); rail.remove(); T.length = 0; },
  };
  return tags;
}
