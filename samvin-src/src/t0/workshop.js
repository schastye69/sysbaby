// t0/workshop.js — WP11. WORKSHOP «МАСТЕРСКАЯ» in T0 (SPEC §6.2.1, §12.5 "the workshop grid works"; S06 + favicon): the
// 7×7 node grid (4 px --silver nodes, DOM hit targets ≥ 44 px; phone grid ≥ 308 × 308), press on a node and drag
// through further nodes — each newly entered node adds an edge (1.5 px --white) and plays its note (column → G A B D E
// G A, row → octave, top highest); a tap on an existing edge removes it; ≤ 24 edges. BODY instruction, verbs
// ОЧИСТИТЬ / ВЫРЕЗАТЬ ЗНАК (disabled under 2 edges: BODY 15 px «Нужно хотя бы две линии.») / НАЗАД. Save
// «ОТПЕЧАТОК» (2,600 ms): the ember head traces each edge (40 ms, its note), the backing becomes the obsidian plate with
// the glyph cut into it and a ≤ 2,500 ms electrum edge, then the plate rises toward his capital (900 ms); commitGlyph →
// state.glyph, favicon, glyph:saved, «запомнил.», S06 (first save).
import { createGlyphEditor, commitGlyph } from '../halls/members/workshopModel.js';
import { state } from '../core/state.js';
import { layout } from '../core/layout.js';
import { after, tween } from '../core/clock.js';
import { svg, el, fmt, clear, block, reduced } from './dom.js';

const DEG = [196.0, 220.0, 246.94, 293.66, 329.63, 392.0, 440.0];
const noteOf = (i) => DEG[i % 7] * Math.pow(2, Math.round((6 - Math.floor(i / 7)) / 3));

export function createWorkshop(ctx, T) {
  const sec = T.section('WORKSHOP');
  const grid = el('div', 't0-ws', null, sec, { qa: 'ws-grid', attrs: { role: 'group', 'aria-label': 'сетка знака 7 × 7' } });
  const art = svg('svg', { class: 't0-ws__svg', 'aria-hidden': 'true' }, grid);
  const plate = svg('rect', { class: 't0-ws__plate' }, art);
  const lines = svg('path', { class: 't0-ws__l' }, art);
  const head = svg('circle', { r: 1.5, class: 't0-ws__head' }, art);
  const nodes = [];
  for (let i = 0; i < 49; i++) {
    const b = el('button', 't0-ws__n', null, grid, { qa: 'ws-node', data: { i: String(i) }, attrs: { type: 'button', 'aria-label': `узел ${Math.floor(i / 7) + 1}·${(i % 7) + 1}` } });
    el('i', null, null, b);
    nodes.push(b);
  }
  const side = block(sec, 't0-ws__side');
  el('p', 't-body', 'Соедини точки. Это будет твой знак: на колонне, на ключе и на вкладке браузера.', side);
  const verbs = el('div', 't0-verbs', null, side);
  const clearB = el('button', 'verb t-label', 'ОЧИСТИТЬ', verbs, { qa: 'ws-clear', attrs: { type: 'button' } });
  const saveB = el('button', 'verb t-label', 'ВЫРЕЗАТЬ ЗНАК', verbs, { qa: 'ws-save', attrs: { type: 'button' } });
  const backB = el('button', 'verb t-label', 'НАЗАД', verbs, { qa: 'ws-back', attrs: { type: 'button' } });
  const need = el('p', 't-body t0-ws__need', 'Нужно хотя бы две линии.', side);
  need.hidden = true;
  const W = { cell: 52, size: 0, editor: null, down: false, saving: false };

  function geom() {
    const cell = layout.isPhone ? Math.max(44, Math.min(52, (layout.w - 32) / 7)) : 56;
    W.cell = cell; W.size = cell * 7;
    const x = layout.isPhone ? (layout.w - W.size) / 2 : (layout.w - W.size) / 2 + 40;
    const y = layout.isPhone ? 166 + layout.safe.t : Math.max(84, layout.h * 0.62 - W.size - 70);
    Object.assign(grid.style, { left: `${fmt(x)}px`, top: `${fmt(y)}px`, width: `${fmt(W.size)}px`, height: `${fmt(W.size)}px` });
    art.setAttribute('viewBox', `0 0 ${fmt(W.size)} ${fmt(W.size)}`);
    plate.setAttribute('x', '2'); plate.setAttribute('y', '2'); plate.setAttribute('width', fmt(W.size - 4)); plate.setAttribute('height', fmt(W.size - 4));
    nodes.forEach((b, i) => Object.assign(b.style, { left: `${fmt((i % 7) * cell)}px`, top: `${fmt(Math.floor(i / 7) * cell)}px`, width: `${fmt(cell)}px`, height: `${fmt(cell)}px` }));
    if (layout.isPhone) side.style.transform = `translate(0px,${fmt(y + W.size + 18)}px)`;
  }
  const P = (i) => [((i % 7) + 0.5) * W.cell, (Math.floor(i / 7) + 0.5) * W.cell];
  function draw() {
    let d = '';
    for (const [a, b] of W.editor.edges) { const p = P(a), q = P(b); d += `M${fmt(p[0])} ${fmt(p[1])}L${fmt(q[0])} ${fmt(q[1])}`; }
    lines.setAttribute('d', d);
    const ok = W.editor.canSave();
    saveB.classList.toggle('is-disabled', !ok);
    saveB.setAttribute('aria-disabled', ok ? 'false' : 'true');
    if (ok) need.hidden = true;
  }
  function fresh(initial) {
    W.editor = createGlyphEditor({
      maxEdges: 24, edges: initial || [],
      onNode(i) { nodes[i].classList.add('is-hit'); after(160, () => nodes[i].classList.remove('is-hit')); if (ctx.audio) ctx.audio.play('workshopNode', { hz: noteOf(i) }); },
      onChange() { draw(); },
    });
    draw();
  }
  const nodeAt = (x, y) => {
    const r = grid.getBoundingClientRect();
    const cx = (x - r.left) / W.cell, cy = (y - r.top) / W.cell;
    const c = Math.floor(cx), rr = Math.floor(cy);
    if (c < 0 || c > 6 || rr < 0 || rr > 6) return -1;
    return Math.hypot(cx - c - 0.5, cy - rr - 0.5) < 0.42 ? rr * 7 + c : -1;
  };
  const edgeAt = (x, y) => {
    const r = grid.getBoundingClientRect();
    const px = x - r.left, py = y - r.top;
    for (const [a, b] of W.editor.edges) {
      const p = P(a), q = P(b), dx = q[0] - p[0], dy = q[1] - p[1];
      const t = Math.max(0, Math.min(1, ((px - p[0]) * dx + (py - p[1]) * dy) / (dx * dx + dy * dy || 1)));
      if (Math.hypot(p[0] + dx * t - px, p[1] + dy * t - py) < 8) return [a, b];
    }
    return null;
  };
  let downAt = null;
  grid.addEventListener('pointerdown', (e) => {
    if (W.saving) return;
    e.preventDefault();
    const n = nodeAt(e.clientX, e.clientY);
    downAt = { x: e.clientX, y: e.clientY, n };
    W.down = true;
    try { grid.setPointerCapture(e.pointerId); } catch (err) { /* synthetic */ }
    if (n >= 0) W.editor.enter(n);
  });
  grid.addEventListener('pointermove', (e) => {
    if (!W.down || W.saving) return;
    const n = nodeAt(e.clientX, e.clientY);
    if (n >= 0) W.editor.enter(n);
  });
  const up = (e) => {
    if (!W.down) return;
    W.down = false;
    W.editor.lift();
    if (downAt && downAt.n < 0 && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) < 8) {
      const ed = edgeAt(e.clientX, e.clientY);
      if (ed) { W.editor.removeEdge(ed[0], ed[1]); if (ctx.audio) ctx.audio.play('tick', {}); }
    }
    downAt = null;
  };
  grid.addEventListener('pointerup', up);
  grid.addEventListener('pointercancel', up);
  // keyboard: Enter on a node enters it; Escape lifts
  nodes.forEach((b, i) => b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); W.editor.enter(i); } }));
  clearB.addEventListener('click', () => { if (!W.saving) { W.editor.clear(); W.editor.lift(); } });
  saveB.addEventListener('click', () => {
    if (W.saving) return;
    if (!W.editor.canSave()) { need.hidden = false; revealNeed(); return; }
    save();
  });
  saveB.addEventListener('pointerenter', () => { if (!W.editor.canSave()) need.hidden = false; });
  saveB.addEventListener('pointerleave', () => { need.hidden = true; });
  backB.addEventListener('click', () => ctx.director.go(`#/members/${ctx.world.operator.id}`, { source: 'hall' }));
  function revealNeed() { after(2400, () => { need.hidden = true; }); }

  /** «ОТПЕЧАТОК», 2,600 ms */
  function save() {
    W.saving = true;
    const edges = W.editor.edges.map((e) => e.slice());
    const per = reduced() ? 0 : 40;
    edges.forEach((e, k) => after(k * per, () => {
      const q = P(e[1]);
      head.setAttribute('cx', fmt(q[0])); head.setAttribute('cy', fmt(q[1]));
      head.classList.add('is-on');
      if (ctx.audio) ctx.audio.play('workshopNode', { hz: noteOf(e[1]) });
    }));
    after(edges.length * per + 120, () => head.classList.remove('is-on'));
    after(reduced() ? 160 : 1000, () => {
      grid.classList.add('is-cut');
      after(1200, () => grid.classList.add('is-cool'));
      const r = grid.getBoundingClientRect();
      commitGlyph(edges, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    });
    after(reduced() ? 400 : 1700, () => grid.classList.add('is-dock'));
    after(reduced() ? 600 : 2600, () => {
      W.saving = false;
      grid.classList.remove('is-cut', 'is-cool', 'is-dock');
    });
  }

  const hall = {
    id: 'WORKSHOP',
    section: sec,
    show() {
      geom();
      W.saving = false;
      grid.classList.remove('is-cut', 'is-cool', 'is-dock');
      fresh(state.data && state.data.glyph);
      if (layout.isPhone && ctx.sheet) ctx.sheet.set(null);
    },
    hide() { W.down = false; },
    relayout() { geom(); draw(); },
    onKey(e) { if (e.key === 'Escape') { ctx.director.go(`#/members/${ctx.world.operator.id}`, { source: 'kbd' }); return true; } return false; },
  };
  void tween; void clear;
  return hall;
}
