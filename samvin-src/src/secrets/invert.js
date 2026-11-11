// secrets/invert.js — S08 ИЗНАНКА, the blueprint (SPEC §8.1 S08, §9.6; SPEC-ADDENDUM A1.3 §8.1 S08, A2.3, A6.5.4,
// A11.5 O34; ARCH §6.11 + X§5.3 WP10). OWNER: WP10.
// Trigger: 'key:flip' (WP1: the Key dragged vertically past 110°; in T0 the SVG Key's flip) or the Android bonus (phone
// upside down: |beta| > 150° for 1,000 ms, only where no motion permission is needed). Each flip toggles: the world
// rolls 180° over 1,400 ms (camera roll, added on top of whatever pose the director wrote this frame) while
// palette.setInverted(u) carries every token to the blueprint mix (R2's 45° ink hatching on solids follows U.uInvert);
// `invertRoll` sweeps 60 → 30 Hz, UI sounds drop a fourth (audio.setInverted), and the stereo image narrows to mono at
// 90° and opens again (audio.fx.width 1 → 0 → 1). Inverted: dimension lines on everything (dims, owner 'secrets'), the
// handwritten-style notes at their anchors (Geologica 300, slnt −8, --ink, 16 px: .t-note), «правила. их пишут делами.»
// on the back faces once ≥ 1 law is earned (O34), the scale figure (fx.scaleFigure.show('izn')). It persists
// (state.inverted) until flipped back the same way. Reduced motion: the roll is a 160 ms cut. T0: the palette only.
import { Vector3 } from 'three';
import { app } from '../core/store.js';
import { state } from '../core/state.js';
import { bus } from '../core/bus.js';
import { loop } from '../core/loop.js';
import { tween, after } from '../core/clock.js';
import { audio } from '../audio/engine.js';
import { palette } from '../render/palette.js';
import { rig } from '../render/cameraRig.js';
import { scaleEngine } from '../render/scale.js';
import { motion } from '../core/motion.js';
import { ROOMS } from '../world/rooms.js';
import { HALL } from '../core/tokens.js';
import { revealBody } from '../ui/text.js';
import { W, has, safe, reduced, isT0, isPhone, easeInOut, keyScreen } from './util.js';
import { layout } from '../core/layout.js';

const ROLL_MS = 1400, RM_MS = 160, ROLL_ORDER = 55;
const SIGNS = ['S', 'A', 'M', '•', 'V', 'I', 'N'];
const HALL_NOTE = {
  MEMBERS: 'колонны: держат крышу и друг друга',
  VOYAGES: 'люки. некоторые заперты. пока.',
  ARCHIVE: 'время. листать вниз.',
  SIGNAL: 'небо. можно рисовать.',
  INSIGNIA: 'трофеи. трогать можно.',
};
const LAW_NOTE = 'правила. их пишут делами.';

let ctx = null;
let roll = 0, written = NaN, lastAdded = 0, anim = null, u = 0;
const notes = [], dimsOn = [];
let navNote = null, notesRoom = null;
const _v = new Vector3(), _w = new Vector3(), _f = new Vector3(), _r = new Vector3(), _u = new Vector3();
const _bf = { F: new Vector3(), n: new Vector3() };
const _np = { x: 0, y: 0 };
const K = { x: 0, y: 0, r: 0 };

// ─── the roll: added after the director (order 20) and before the camera (60) ───────────────────────────────────
function rollFrame() {
  // the director rewrites the pose every idle/travel frame; when nobody did (boot), take our last addition back first
  if (rig.pose.roll === written) rig.pose.roll -= lastAdded;
  rig.pose.roll += roll;
  lastAdded = roll;
  written = rig.pose.roll;
}

// ─── anchors ────────────────────────────────────────────────────────────────────────────────────────────────────
const keyPt = (x, y, z) => (out) => scaleEngine.toRender(_v.set(x, y, z), out);
function nucleusPt(out) {
  const k = ctx.key;
  if (k && k.nucleusWorld) return out.copy(k.nucleusWorld);
  return scaleEngine.toRender(_v.set(0, 0, 0), out);
}
function rimPt(out) {
  const rim = ctx.rim;
  if (rim && has(rim, 'namePoint') && rig.camera) {
    rim.namePoint(0, _np);
    if (Number.isFinite(_np.x) && Number.isFinite(_np.y)) return rig.unproject(_np.x, _np.y + 18, HALL.coreRimR * scaleEngine.s, out);
  }
  return scaleEngine.toRender(_v.set(0, 24, -HALL.coreRimR), out);
}
function lawPt(out) {
  const k = ctx.key;
  const i = lawStratum();
  if (k && has(k, 'backFaceFrame') && i >= 0) { k.backFaceFrame(i, _bf); return out.copy(_bf.F); }
  return scaleEngine.toRender(_v.set(0, 0, -0.62), out);
}
/** A point in front of the hall's camera, upper left of the view (hall notes): camera + fwd·10 − right·2.6 + up·1.7. */
function hallPt(out) {
  const cam = rig.camera;
  if (!cam) return out.set(0, 0, 0);
  _f.set(0, 0, -1).transformDirection(cam.matrixWorld);
  _r.set(1, 0, 0).transformDirection(cam.matrixWorld);
  _u.set(0, 1, 0).transformDirection(cam.matrixWorld);
  const s = scaleEngine.s;
  return out.copy(cam.position).addScaledVector(_f, 10 * s).addScaledVector(_r, -2.6 * s).addScaledVector(_u, 1.7 * s);
}
function hallDeck(sign) {
  return (out) => {
    const a = (ROOMS[app.room] || ROOMS.CORE).anchor;
    return scaleEngine.toRender(_w.set(a.x + sign * HALL.deckR, a.y, a.z), out);
  };
}

function lawStratum() {
  const code = state.data && state.data.code;
  if (!code) return -1;
  for (let i = 0; i < 7; i++) if (code[SIGNS[i]]) return i;
  return -1;
}

const _np2 = { x: 0, y: 0, depth: 0, visible: false };
/** On a phone the Key fills the width: each note takes the side that keeps it on screen (an anchor right of centre
 *  leads left, and the reverse) and may wrap to two lines (.sec-note--phone). */
function fitLeader(get, leader, el) {
  if (!isPhone() || !rig.camera) return leader;
  get(_w); rig.project(_w, _np2);
  const side = _np2.x > layout.w * 0.42 ? 'left' : 'right';
  const len = Math.min(leader.len, 28);
  // the block starts 6 px past the run's end; it may use what is left of the screen (16 px gutter), wrapping
  const endX = _np2.x + (side === 'left' ? -1 : 1) * (Math.abs(leader.rise || 0) + len + 6);
  const room = side === 'left' ? endX - 16 : layout.w - 16 - endX;
  el.style.maxWidth = `${Math.max(96, Math.min(176, Math.round(room)))}px`;
  return { side, len, rise: leader.rise };
}
function addNote(id, text, get, leader) {
  const el = document.createElement('p');
  el.className = 't-note sec-note' + (isPhone() ? ' sec-note--phone' : '');
  el.textContent = text;
  const a = ctx.overlay.add({ owner: 'secrets', id: `izn-${id}`, el, get, leader: fitLeader(get, leader, el), scrim: false, priority: 4 });
  notes.push(a);
  safe('izn:draw', () => a.drawIn(420));
  revealBody(el);
}
function addDim(a, b, label, side, offset) {
  const d = ctx.dims.add({ owner: 'secrets', a, b, label, side, offset });
  dimsOn.push(d);
  safe('izn:dim', () => d.drawIn(360));
}

/** The navigator's note is DOM (the navigator is DOM): beside the • row on desktop, above the band on phones. */
function showNavNote() {
  const root = document.getElementById('fx');
  if (!root || !ctx.keyNav || !has(ctx.keyNav, 'letterPoint')) return;
  if (!navNote) {
    navNote = document.createElement('p');
    navNote.className = 't-note sec-note sec-note--nav';
    navNote.textContent = 'лифт. кнопок нет.';
  }
  const p = ctx.keyNav.letterPoint('•');
  const phone = isPhone();
  navNote.classList.toggle('is-phone', phone);
  navNote.style.transform = phone
    ? `translate3d(${(layout.w - 16).toFixed(1)}px,${(p.y - 58).toFixed(1)}px,0) translate(-100%,-50%)`
    : `translate3d(${(p.x - 40).toFixed(1)}px,${(p.y - 64).toFixed(1)}px,0) translate(-100%,-50%)`;
  if (navNote.parentNode !== root) root.appendChild(navNote);
  revealBody(navNote);
}

function clearDecor() {
  for (const a of notes) safe('izn:rm', () => a.remove());
  notes.length = 0;
  for (const d of dimsOn) safe('izn:rmd', () => d.remove());
  dimsOn.length = 0;
  if (navNote && navNote.parentNode) navNote.parentNode.removeChild(navNote);
  notesRoom = null;
}

/** Notes and dimension lines for the room he is in (only while inverted and at rest in it). */
function showDecor() {
  clearDecor();
  if (!app.inverted) return;
  showNavNote();
  notesRoom = app.room;
  if (isT0() || !ctx.overlay || !ctx.dims || !rig.camera) return;
  if (app.room === 'CORE') {
    addNote('key', 'рост: 2,40 м — выше папы', keyPt(-0.42, 1.02, 0), { side: 'left', len: 64, rise: -34 });
    addNote('nucleus', 'ядро. горячее. не лизать.', nucleusPt, { side: 'right', len: 72, rise: -26 });
    // (phone: the rim and the axis tip lie under the corner chrome — those two notes are desktop-only, SPEC §10.4)
    if (!isPhone()) addNote('axis', 'ось. держит всё.', keyPt(0, -1.72, 0), { side: 'right', len: 52, rise: 30 });
    if (!isPhone()) addNote('rim', 'здесь написано твоё имя', rimPt, { side: 'left', len: 44, rise: -22 });
    addNote('grains', 'песок (умный)', isPhone() ? keyPt(0.55, -0.02, 1.12) : keyPt(1.55, -0.05, 0.55), { side: 'right', len: 48, rise: 30 });
    if (lawStratum() >= 0) addNote('law', LAW_NOTE, lawPt, { side: 'left', len: 60, rise: 34 });
    // the Key's own hover dimensions (↕ 2.40 М left, Ø 1.24 М) are WP1's; ИЗНАНКА adds the ones a blueprint needs
    // beside them: the height on the other side, the • stratum (the core's own band) and the grain ring's span
    if (!isPhone()) {                                 // (phone: the Key's own dimensions already fill the width)
      addDim(keyPt(0.64, -0.26, 0), keyPt(0.64, 0.26, 0), '↕ 0.52 М', 'right', 22);
      addDim(keyPt(0.66, -1.2, 0), keyPt(0.66, 1.2, 0), '↕ 2.40 М', 'right', 64);
      addDim(keyPt(-1.9, -1.3, 0), keyPt(1.9, -1.3, 0), 'Ø 3.80 М', 'below', 30);
    }
  } else if (HALL_NOTE[app.room]) {
    addNote('hall', HALL_NOTE[app.room], hallPt, { side: 'right', len: 40, rise: 26 });
    addDim(hallDeck(-1), hallDeck(1), `↔ ${2 * HALL.deckR} М`, 'below', 18);
  }
}

// ─── the toggle ─────────────────────────────────────────────────────────────────────────────────────────────────
function setFigure(on) {
  const f = ctx.fx && ctx.fx.scaleFigure;
  if (!f) return;
  if (on && has(f, 'show')) safe('izn:fig', () => f.show('izn'));
  else if (!on && has(f, 'hide')) safe('izn:fig', () => f.hide(240));
}

function toggle() {
  if (anim) return;
  const to = !app.inverted;
  app.inverted = to;
  state.set('inverted', to);
  bus.emit('invert:change', { inverted: to });
  audio.setInverted(to);
  audio.play('invertRoll', {});
  const rm = reduced();
  if (!rm && audio.fx) {
    safe('izn:width', () => audio.fx.width(0, 700));
    after(700, () => safe('izn:width', () => audio.fx.width(1, 700)));
  }
  if (!to) { clearDecor(); setFigure(false); }
  const u0 = u, u1 = to ? 1 : 0;
  const r0 = roll, r1 = to ? Math.PI : 0;
  const t0 = !isT0() && rig.camera;
  if (rm) {
    if (t0) roll = r1;                                            // the cut
    anim = tween(RM_MS, (k) => { u = u0 + (u1 - u0) * k; palette.setInverted(u); });
  } else {
    anim = tween(ROLL_MS, (k) => {
      const e = easeInOut(k);
      u = u0 + (u1 - u0) * e;
      palette.setInverted(u);
      if (t0) roll = r0 + (r1 - r0) * e;
    });
  }
  anim.done.then(() => {
    anim = null;
    u = u1; palette.setInverted(u);
    if (t0) roll = r1;
    if (to) {
      showDecor();
      setFigure(true);
      keyScreen(K);
      if (ctx.secrets) safe('izn:discover', () => ctx.secrets.discover('S08', { anchor: { x: K.x, y: K.y } }));
    }
  });
}

// Android bonus: the phone held upside down (|beta| > 150°) for 1,000 ms.
let upsideSince = -1, upsideFired = false;
function onMotion(m) {
  const up = Math.abs(m.beta) > 150;
  if (!up) { upsideSince = -1; upsideFired = false; return; }
  if (upsideSince < 0) upsideSince = m.t;
  if (!upsideFired && m.t - upsideSince >= 1000 && !app.booting && app.phase === 'idle') { upsideFired = true; toggle(); }
}

export function initInvert(c) {
  ctx = c;
  bus.on('key:flip', () => { if (!app.booting) toggle(); });
  if (motion.available) motion.on(onMotion);
  loop.add(rollFrame, ROLL_ORDER);
  // a persisted ИЗНАНКА: the world is a blueprint from the first frame
  if (app.inverted) {
    u = 1; palette.setInverted(1);
    if (!isT0()) roll = Math.PI;
    audio.setInverted(true);
    bus.on('boot:done', () => { showDecor(); setFigure(true); });
  }
  bus.on('travel:start', () => { if (notes.length || dimsOn.length || navNote) clearDecor(); });
  bus.on('room:arrive', () => { if (app.inverted && !anim) showDecor(); });
  bus.on('layout:change', () => { if (app.inverted && !anim && notesRoom) showNavNote(); });
  bus.on('code:earned', () => { if (app.inverted && app.room === 'CORE' && !anim) showDecor(); });
}
