// halls/members/workshop.js — WORKSHOP «МАСТЕРСКАЯ», #/members/workshop, ▽ +484.00, hidden (SPEC §6.2.1, §7.5, §8.1 S06).
//
// Entry (1,200 ms from MEMBERS): the camera rises to his capital, its n-gon plate opens as an iris (segments turn 50°
// outward, 480 ms), the camera passes inside, the plates close behind. A dark chamber 4.4 m across; a 7×7 node grid
// (2.4 m, nodes 0.4 m apart, 4 px --silver dots) floats facing the camera; DOM hit targets ≥ 44 px (phone grid ≥ 308 px).
// Press a node and drag through others: each newly entered node adds an edge (1.5 px --white) and plays its note; tap
// an edge to remove it; max 24. ВЫРЕЗАТЬ ЗНАК (disabled under 2 edges, «Нужно хотя бы две линии.») runs ОТПЕЧАТОК
// (2,600 ms): the ember beam traces each edge (40 ms, its note), at ≈ +1,000 the backing turns into a solid obsidian
// plate with the glyph cut into it (R4) under one fast lamp sweep and a ≤ 2,500 ms electrum edge flash; the final
// 900 ms the plate flies up to his capital. Saving: status «запомнил.», favicon, Key back face + РЕЗОНАНС glyph
// (glyph:saved), S06 on the first save. Exit: Esc, back or НАЗАД → his column focus.
import { Vector3 } from 'three';
import { createWorkshopScene, nodePos, WS } from './wsScene.js';
import { createGlyphEditor, commitGlyph, nodeHz } from './workshopModel.js';
import { link } from './link.js';
import { restPose as membersRest } from './arc.js';
import { glyphNotes, normalizeGlyph } from '../../core/glyph.js';
import { curvePath, concatPaths, buildLift } from '../../nav/paths.js';
import { ROOMS } from '../../world/rooms.js';
import { ENV } from '../../core/env.js';
import { EASE, clamp01 } from '../../core/ease.js';
import { vibrate } from '../../ui/tactile.js';
import { CAMERA } from '../../core/tokens.js';

const SAVE = Object.freeze({ perEdge: 40, cutAt: 1000, flyFrom: 1700, total: 2600, flashMs: 2400 });
const COPY = Object.freeze({
  body: 'Соедини точки. Это будет твой знак: на колонне, на ключе и на вкладке браузера.',
  need: 'Нужно хотя бы две линии.',
});

/** @returns {Hall} */
export function createWorkshopHall(hctx) {
  const world = hctx.world;
  const opId = world.operator && world.operator.id;
  const op = world.members.find((m) => m.id === opId) || null;
  const nSides = 5 + ((op ? Math.abs(op.seed | 0) : 3) % 4);
  const now = () => hctx.loop.now;
  const phone = () => hctx.layout.kind === 'phone';
  const reduced = () => !!ENV.reducedMotion;

  let scene = null, ui = null, gridEl = null, nodes = [], bodyEl = null, saveBtn = null, needEl = null;
  let current = false, enterU = 0, exitU = 0;
  let editor = null, drawing = false, downNode = -1, downX = 0, downY = 0, moved = false, rubber = null;
  let rect = { x: 0, y: 0, step: 0, btn: 44 };
  let saving = null;   // { t0, list, notes, idx, cut, done }
  const _v = new Vector3(), _w = new Vector3(), _r = new Vector3();
  const _p = { x: 0, y: 0, depth: 0, visible: false };
  const poseOut = { pos: new Vector3(), target: new Vector3(), fov: CAMERA.fov, offsetY: 0, roll: 0 };

  function toRender(local, out) { hctx.toCanonical(local, out); return hctx.scale ? hctx.scale.toRender(out, out) : out; }

  /** Rest pose (hall-local): desktop — the grid ≈ 450 px tall centred at 75 % of the width (the long title owns the left);
   *  phone — the grid 330 px wide, its centre ≈ 27 px above the screen centre (title, datum and BODY above it). */
  function restPose(out) {
    const gy = WS.gridY;
    if (phone()) {
      const d = 9.73;
      out.pos.set(WS.cx, gy - 0.2, d); out.target.set(WS.cx, gy - 0.2, 0);
    } else {
      const d = 7.6;
      out.pos.set(WS.cx - 1.95, gy, d); out.target.set(WS.cx - 1.95, gy, 0);
    }
    out.fov = CAMERA.fov; out.offsetY = 0; out.roll = 0;
    return out;
  }

  // ─── DOM ──────────────────────────────────────────────────────────────────────────────────────────────────────
  function mk(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function buildUi() {
    ui = mk('div', 'ws-ui');
    bodyEl = mk('p', 't-body ws-body scrim', COPY.body);
    gridEl = mk('div', 'ws-grid');
    gridEl.dataset.qa = 'ws-grid';
    for (let i = 0; i < 49; i++) {
      const b = mk('button', 'ws-node');
      b.type = 'button';
      b.dataset.qa = 'ws-node';
      b.dataset.i = String(i);
      b.setAttribute('aria-label', `точка ${Math.floor(i / 7) + 1}-${(i % 7) + 1}`);
      b.addEventListener('keydown', (e) => onNodeKey(e, i));
      gridEl.appendChild(b);
      nodes.push(b);
    }
    gridEl.addEventListener('pointerdown', onDown);
    gridEl.addEventListener('pointermove', onMove);
    gridEl.addEventListener('pointerup', onUp);
    gridEl.addEventListener('pointercancel', onCancel);
    const verbs = mk('div', 'ws-verbs');
    const clear = mk('button', 'verb', 'ОЧИСТИТЬ');
    clear.type = 'button'; clear.dataset.qa = 'ws-clear';
    clear.addEventListener('click', () => { if (saving) return; editor.clear(); editor.lift(); refresh(); });
    saveBtn = mk('button', 'verb ws-save', 'ВЫРЕЗАТЬ ЗНАК');
    saveBtn.type = 'button'; saveBtn.dataset.qa = 'ws-save';
    saveBtn.addEventListener('click', onSave);
    saveBtn.addEventListener('pointerenter', () => { if (!editor.canSave()) needEl.hidden = false; });
    saveBtn.addEventListener('pointerleave', () => { needEl.hidden = true; });
    const back = mk('button', 'verb', 'НАЗАД');
    back.type = 'button'; back.dataset.qa = 'ws-back';
    back.addEventListener('click', goBack);
    verbs.append(clear, saveBtn, back);
    needEl = mk('p', 't-body t-body--15 ws-need', COPY.need);
    needEl.hidden = true;
    ui.append(bodyEl, gridEl, verbs, needEl);
    hctx.section.appendChild(ui);
  }
  function refresh() {
    if (!scene) return;
    scene.setEdges(editor.edges, drawing && rubber ? editor._prev : -1, drawing ? rubber : null);
    const ok = editor.canSave();
    saveBtn.setAttribute('aria-disabled', ok ? 'false' : 'true');
    if (ok) needEl.hidden = true;
    for (let i = 0; i < 49; i++) nodes[i].classList.toggle('is-on', editor.edges.some((e) => e[0] === i || e[1] === i));
  }
  /** Projects the grid corners and lays the 49 hit targets over the nodes (on arrive / resize; the camera rests). */
  function layoutGrid() {
    if (!gridEl || !hctx.rig || !hctx.rig.camera) return;
    nodePos(0, _v); toRender(_v, _r); hctx.rig.project(_r, _p); const x0 = _p.x, y0 = _p.y;
    nodePos(48, _v); toRender(_v, _r); hctx.rig.project(_r, _p); const x1 = _p.x, y1 = _p.y;
    const step = (x1 - x0) / 6;
    const btn = Math.max(44, Math.min(64, step * 0.82));
    rect = { x: x0 - btn / 2, y: y0 - btn / 2, step, btn };
    const s = gridEl.style;
    s.transform = `translate3d(${rect.x.toFixed(1)}px,${rect.y.toFixed(1)}px,0)`;
    s.width = `${(x1 - x0 + btn).toFixed(1)}px`; s.height = `${(y1 - y0 + btn).toFixed(1)}px`;
    for (let i = 0; i < 49; i++) {
      const b = nodes[i].style;
      b.width = b.height = `${btn.toFixed(1)}px`;
      b.transform = `translate3d(${((i % 7) * step).toFixed(1)}px,${(Math.floor(i / 7) * step).toFixed(1)}px,0)`;
    }
    ui.style.setProperty('--ws-grid-bottom', `${(y1 + btn / 2).toFixed(0)}px`);
    ui.style.setProperty('--ws-grid-left', `${(x0 - btn / 2).toFixed(0)}px`);
    ui.style.setProperty('--ws-grid-top', `${(y0 - btn / 2).toFixed(0)}px`);
  }

  // ─── drawing ────────────────────────────────────────────────────────────────────────────────────────────────
  let gx = 0, gy = 0;   // the grid element's client origin (measured on down)
  function nodeAt(cx, cy, radius) {
    const lx = cx - gx - rect.btn / 2, ly = cy - gy - rect.btn / 2;
    const c = Math.round(lx / rect.step), r = Math.round(ly / rect.step);
    if (c < 0 || c > 6 || r < 0 || r > 6) return -1;
    const dx = lx - c * rect.step, dy = ly - r * rect.step;
    return Math.hypot(dx, dy) <= radius ? r * 7 + c : -1;
  }
  function gridPoint(cx, cy, out) {   // client px → hall-local point on the grid plane (affine: the plane faces the camera)
    const lx = (cx - gx - rect.btn / 2) / rect.step, ly = (cy - gy - rect.btn / 2) / rect.step;
    return out.set(WS.cx + (lx - 3) * WS.step, WS.gridY + (3 - ly) * WS.step, 0);
  }
  function playNode(i) {
    if (hctx.audio) hctx.audio.play('workshopNode', { hz: nodeHz(i) });
    pulseNode(i);   // muted parity: the entered node swells (4 → 7 px, 160 ms)
  }
  const pulse = new Float32Array(49);
  function pulseNode(i) { pulse[i] = 1; }
  function onDown(e) {
    if (!current || saving || enterU < 1) return;
    const r = gridEl.getBoundingClientRect();
    gx = r.left; gy = r.top;
    downX = e.clientX; downY = e.clientY; moved = false;
    downNode = nodeAt(e.clientX, e.clientY, rect.step * 0.42);
    try { gridEl.setPointerCapture(e.pointerId); } catch (er) { /* none */ }
    if (downNode >= 0) { drawing = true; editor.enter(downNode); rubber = null; }
    e.preventDefault();
  }
  function onMove(e) {
    if (!drawing) return;
    if (Math.hypot(e.clientX - downX, e.clientY - downY) > 6) moved = true;
    const k = nodeAt(e.clientX, e.clientY, rect.step * 0.36);
    if (k >= 0) editor.enter(k);
    rubber = gridPoint(e.clientX, e.clientY, _w);
    refresh();
  }
  function onUp(e) {
    const wasDrawing = drawing;
    drawing = false; rubber = null;
    editor.lift();
    if (!wasDrawing && !moved && downNode < 0 && e) removeEdgeAt(e.clientX, e.clientY);
    downNode = -1;
    refresh();
  }
  function onCancel() { drawing = false; rubber = null; editor.lift(); downNode = -1; refresh(); }
  /** Tap an existing edge to remove it (within 12 px of the segment). */
  function removeEdgeAt(cx, cy) {
    const lx = (cx - gx - rect.btn / 2) / rect.step, ly = (cy - gy - rect.btn / 2) / rect.step;
    let best = -1, bd = 12 / Math.max(1, rect.step);
    editor.edges.forEach((ed, k) => {
      const ax = ed[0] % 7, ay = Math.floor(ed[0] / 7), bx = ed[1] % 7, by = Math.floor(ed[1] / 7);
      const vx = bx - ax, vy = by - ay, L2 = vx * vx + vy * vy || 1;
      const t = clamp01(((lx - ax) * vx + (ly - ay) * vy) / L2);
      const d = Math.hypot(lx - (ax + vx * t), ly - (ay + vy * t));
      if (d < bd) { bd = d; best = k; }
    });
    if (best >= 0) {
      const [a, b] = editor.edges[best];
      editor.removeEdge(a, b);
      if (hctx.audio) hctx.audio.play('tick', {});
      vibrate(6);
    }
  }
  function onNodeKey(e, i) {
    if (saving) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); editor.enter(i); refresh(); return; }
    const d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    if (d) {
      e.preventDefault(); e.stopPropagation();
      const j = i + d;
      if (j >= 0 && j < 49 && !(d === -1 && i % 7 === 0) && !(d === 1 && i % 7 === 6)) nodes[j].focus();
    }
  }
  function goBack() { if (opId) hctx.director.go(`#/members/${opId}`, { source: 'hall' }); }

  // ─── ОТПЕЧАТОК ──────────────────────────────────────────────────────────────────────────────────────────────
  function onSave() {
    if (saving || !editor) return;
    if (!editor.canSave()) { needEl.hidden = false; return; }
    const list = normalizeGlyph(editor.edges);
    saving = { t0: now(), list, notes: glyphNotes(list), idx: -1, cut: false, done: false };
    ui.classList.add('is-saving');
    if (reduced()) { saving.t0 -= SAVE.cutAt; }
  }
  function updateSave(t) {
    const S = saving;
    const e = t - S.t0;
    const E = S.list.length;
    const traceEnd = SAVE.perEdge * E;
    if (!S.cut) {
      const f = e / SAVE.perEdge, i = Math.min(E - 1, Math.floor(f));
      if (i > S.idx && e < traceEnd) {
        for (let j = S.idx + 1; j <= i; j++) if (hctx.audio) hctx.audio.play('workshopNode', { hz: S.notes[j] });
        S.idx = i;
      }
      scene.setTrace(S.list, Math.min(E - 1, i), e >= traceEnd ? 1 : f - i);
    }
    if (!S.cut && e >= Math.max(SAVE.cutAt, traceEnd + 120)) {
      S.cut = true;
      scene.clearTrace();
      scene.engrave(S.list);
      scene.plate.visible = true;
      scene.flash.setAlpha(1);
      scene.edges.mesh.visible = false;
      if (hctx.lamp) hctx.lamp.sweepOnce(900);
      if (hctx.audio) hctx.audio.play('chisel', {});
      nodePos(24, _v); toRender(_v, _r); hctx.rig.project(_r, _p);
      commitGlyph(S.list, { x: _p.x, y: _p.y });
    }
    if (S.cut) {
      const c = e - Math.max(SAVE.cutAt, traceEnd + 120);
      scene.plateMat.uniforms.uAlpha.value = reduced() ? 1 : clamp01(c / 240);
      scene.flash.setAlpha(Math.max(0, 1 - c / SAVE.flashMs));
      const fly = clamp01((e - SAVE.flyFrom) / (SAVE.total - SAVE.flyFrom));
      if (!reduced()) {
        // heavy spring feel: an eased rise of 7 m toward his capital overhead, the grid dims as the plate leaves
        const k = EASE.camera(fly);
        scene.plate.position.y = WS.gridY + 7 * k;
        scene.plate.position.z = -0.25 + 1.2 * Math.sin(Math.PI * k);
      }
      scene.grid.setAlpha(0.9 * (1 - 0.7 * Math.sin(Math.PI * fly)));
      if (e >= SAVE.total) {
        scene.plate.visible = false;
        scene.plate.position.set(WS.cx, WS.gridY, -0.25);
        scene.flash.setAlpha(0);
        scene.edges.mesh.visible = true;
        scene.grid.setAlpha(0.9);
        ui.classList.remove('is-saving');
        saving = null;
        refresh();
      }
    }
  }

  // ─── hall ───────────────────────────────────────────────────────────────────────────────────────────────────
  const hall = {
    id: hctx.id,
    build() {
      const saved = normalizeGlyph(hctx.state.data && hctx.state.data.glyph);
      editor = createGlyphEditor({ edges: saved, onNode: playNode });
      const enter0 = editor.enter.bind(editor);
      editor.enter = (n) => { editor._prev = n; return enter0(n); };
      editor._prev = -1;
      if (hctx.group) {
        scene = createWorkshopScene(hctx.group, nSides);
        scene.setAlpha(0);
      }
      buildUi();
      ui.style.opacity = '0';
      refresh();
    },
    pose() { return restPose(poseOut); },
    enter(u) {
      enterU = u;
      if (u > 0) exitU = 0;
      if (scene) scene.setAlpha(clamp01(u * 1.6));
      if (ui) { ui.style.opacity = String(clamp01((u - 0.6) / 0.4)); ui.classList.toggle('is-live', u >= 0.7); }
    },
    exit(u) {
      exitU = u;
      if (ui) ui.style.opacity = String(clamp01(1 - u * 2));
      if (scene) scene.setAlpha(1 - clamp01(u));
    },
    arrive() {
      current = true; enterU = 1;
      hall.enter(1);
      layoutGrid();
      if (hctx.lamp) { nodePos(24, _v); toRender(_v, _r); hctx.lamp.setFocus(_r, 1.4); }
      if (phone()) hctx.sheet.set(null);
    },
    depart() {
      current = false;
      onCancel();
      if (hctx.lamp) hctx.lamp.hold(null);
    },
    setSub() { return 0; },
    update(dt, t) {
      if (!scene) return;
      // the generic shell (rings, a 60 m deck, irises) does not belong in the chamber
      if (hctx.shell) { hctx.shell.setAlpha(0); }
      if (saving) updateSave(t);
      // node pulses (4 → 7 px for 160 ms when entered)
      const sz = scene.grid.object.geometry.attributes.aSize;
      if (sz) {
        let any = false;
        for (let i = 0; i < 49; i++) {
          if (pulse[i] <= 0) { if (sz.array[i] !== 1) { sz.array[i] = 1; any = true; } continue; }
          pulse[i] = Math.max(0, pulse[i] - dt / 0.16);
          sz.array[i] = 1 + 0.75 * pulse[i]; any = true;
        }
        if (any) sz.needsUpdate = true;
      }
      if (scene.paletteChanged()) refresh();
      void _w;
    },
    onGesture(g) {
      if (!current) return false;
      return g.type === 'tap' || g.type === 'down';   // the chamber has nothing else to touch; no elevator in here
    },
    onKey(e) {
      if (e.key === 'Escape') {
        if (drawing) { onCancel(); return true; }
        goBack();
        return true;
      }
      return false;
    },
    resize() { if (current) layoutGrid(); },

    /** MEMBERS → WORKSHOP: rise to his capital, through its opening iris, into the chamber (1,200 ms); from elsewhere a
     *  LIFT to MEMBERS first. */
    entryPath(from, start) {
      if (reduced()) return null;
      const rest = restPose({ pos: new Vector3(), target: new Vector3(), fov: 35, offsetY: 0, roll: 0 });
      const cap = new Vector3();
      if (!(from === 'MEMBERS' && link.capital && link.capital(cap))) {
        // his capital, canonical: the operator stands at the arc's middle (0, +460 + 25, 0)
        cap.set(0, ROOMS.MEMBERS.alt + 25, 0);
        if (hctx.scale) hctx.scale.toRender(cap, cap);
      }
      const R = (x, y, z) => toRender(new Vector3(x, y, z), new Vector3());
      const a = ROOMS.WORKSHOP.anchor;
      const capL = new Vector3().copy(cap);
      if (hctx.scale) hctx.scale.toCanonical(capL, capL);
      capL.sub(a);   // hall-local (WORKSHOP)
      const cur = (p0, t0) => curvePath({
        from: 'MEMBERS', to: 'WORKSHOP', duration: 1200,
        points: [p0, R(capL.x, capL.y - 9, capL.z + 8), R(capL.x, capL.y - 2.6, capL.z + 0.5), R(capL.x, capL.y + 1.0, capL.z + 0.05),
          R(WS.cx * 0.55, WS.gridY + 0.4, 3.2), R(rest.pos.x, rest.pos.y, rest.pos.z)],
        targets: [t0, R(capL.x, capL.y + 6, capL.z - 2), R(capL.x + 2, capL.y + 12, capL.z - 3), R(WS.cx, WS.gridY + 2, -2), R(rest.target.x, rest.target.y, rest.target.z)],
        fov: [35, 35], fog: [ROOMS.MEMBERS.fog, ROOMS.WORKSHOP.fog],
        cues(u) {
          // the plate opens as an iris (480 ms ≈ u 0.30 → 0.70) and closes behind the camera (u 0.78 → 0.98)
          if (link.iris) link.iris(u < 0.3 ? 0 : u < 0.7 ? EASE.reveal((u - 0.3) / 0.4) : u < 0.78 ? 1 : Math.max(0, 1 - (u - 0.78) / 0.2));
        },
      });
      if (from === 'MEMBERS' || from === 'WORKSHOP') return cur(start.cam.pos.clone(), start.cam.target.clone());
      const lift = buildLift(start, from, 'MEMBERS', { sub: null });
      const mr = membersRest(phone() ? 'phone' : 'desktop', { pos: new Vector3(), target: new Vector3(), fov: 35, offsetY: 0, roll: 0 });
      const ma = ROOMS.MEMBERS.anchor;
      const p0 = toRender(new Vector3().copy(mr.pos).add(ma).sub(a), new Vector3());
      const t0 = toRender(new Vector3().copy(mr.target).add(ma).sub(a), new Vector3());
      return concatPaths(lift, cur(p0, t0));
    },
    lostSpots() { return []; },
    dispose() {
      if (scene) { scene.dispose(); scene = null; }
      if (ui && ui.parentNode) ui.parentNode.removeChild(ui);
      ui = null; nodes = [];
      current = false;
    },
  };
  return hall;
}
