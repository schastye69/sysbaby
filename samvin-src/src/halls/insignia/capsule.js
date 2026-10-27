// halls/insignia/capsule.js — WP9: КАПСУЛА, the time capsule (SPEC §6.6, §8.1 S12, §9.6 Capsule; SPEC-ADDENDUM A3.3
// `wait` via capsule:open). A sealed 0.8 m obsidian cylinder below the eye (y −8 m), seen when looking down.
//   sealed: LABEL `КАПСУЛА` + BODY «Откроется через {d} д {h} ч.», a live countdown to firstVisit + openAfterDays, rewritten
//           each minute (never a seconds display, L13);
//   due:    on the first arrival at or after that moment the hall runs open(): 5 --electrum fracture lines spread over
//           1,200 ms (crack k from 160·k ms, the `capsule` recipe's five cracks on the cue clock), the lid swings open
//           (480 ms), the electrum cools away (≤ 2,500 ms on screen, 600 ms fade), and capsuleModel.openCapsule()
//           persists it, says «капсула открыта.», finds S12 and emits capsule:open; the hall BEAM WRITES the text in LEAD;
//   opened: the lid stays open; LABEL `КАПСУЛА · ОТКРЫТА` + the parent's text as BODY.
import { Matrix4, Quaternion, Vector3 } from 'three';
import { buildCapsuleGeometry } from './shapes.js';
import { capsuleInfo } from './capsuleModel.js';
import { after, cancelAfter } from '../../core/clock.js';

export const CAPSULE_POS = Object.freeze([0, -8, -3.2]);
const CRACK_STEP = 160, CRACK_DRAW = 560, LID_MS = 480, HOLD_E = 1900, COOL_MS = 600;
const _m = new Matrix4(), _q = new Quaternion(), _p = new Vector3(), _s = new Vector3(1, 1, 1), _h = new Vector3(), _o = new Vector3();
const Z = new Vector3(0, 0, 1);

function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

export function createCapsule(hctx, stat, labels) {
  const g = buildCapsuleGeometry();
  const body = { s: stat.solids.add(g.body.flat), e: stat.silver.add(g.body.edges, { alpha: 0.7 }) };
  const lid = { s: stat.solids.add(g.lid.flat), e: stat.silver.add(g.lid.edges, { alpha: 0.7 }) };
  const nCrack = g.seam.length / 6 / 5;
  const cracks = [];
  for (let k = 0; k < 5; k++) cracks.push(stat.electrum.add(g.seam.subarray(k * nCrack * 6, (k + 1) * nCrack * 6), { alpha: 1, width: 1.5 }));
  const pos = new Vector3().fromArray(CAPSULE_POS);
  const tilt = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), 0.5);

  const box = el('div', 'ins-capsule');
  box.dataset.qa = 'capsule';
  const head = el('p', 't-label ins-cap-head', 'КАПСУЛА');
  const line = el('p', 't-body ins-cap-line');
  box.append(head, line);
  const label = labels.add({ el: box, get: (out) => out.copy(pos), side: 'right', len: 44, rise: -26 });
  // the same countdown in the readable column (desktop: under the relic index; phone: the sheet peek)
  const col = el('button', 'ins-cap-col');
  col.type = 'button';
  col.dataset.qa = 'capsule';
  const colHead = el('span', 't-label', 'КАПСУЛА');
  const colLine = el('span', 't-body');
  col.append(colHead, colLine);
  label.show(true);

  let lidOpen = 0, crackT = -1, electrum = 0, minuteTimer = 0, opened = false;

  function place() {
    _m.compose(pos, tilt, _s);
    stat.solids.setMatrix(body.s, _m);
    stat.silver.setMatrix(body.e, _m);
    for (const c of cracks) stat.electrum.setMatrix(c, _m);
    // the lid hinges on the seam's top edge (x 0, y +0.17) and swings up to 110°
    const u = lidOpen * lidOpen * (3 - 2 * lidOpen);
    _q.setFromAxisAngle(Z, u * (110 * Math.PI) / 180);
    _h.set(0, 0.17, 0).applyQuaternion(tilt).add(pos);
    _o.set(0, -0.17, 0).applyQuaternion(_q).applyQuaternion(tilt);
    _q.premultiply(tilt);
    _m.compose(_h.add(_o), _q, _s);
    stat.solids.setMatrix(lid.s, _m);
    stat.silver.setMatrix(lid.e, _m);
  }

  function writeLine() {
    label.remeasure();
    const info = capsuleInfo();
    if (info.opened || opened) {
      // the 3D label only names it; the parent's words are read once, in the column (and the LEAD that wrote them)
      head.textContent = 'КАПСУЛА · ОТКРЫТА';
      line.textContent = '';
      line.hidden = true;
      colHead.textContent = 'КАПСУЛА · ОТКРЫТА';
      colLine.textContent = hctx.world.capsule.text || '';
      return;
    }
    head.textContent = 'КАПСУЛА';
    line.hidden = false;
    line.textContent = info.open ? 'Открывается.' : `Откроется через ${info.d} д ${info.h} ч.`;
    colHead.textContent = 'КАПСУЛА';
    colLine.textContent = line.textContent;
  }
  function tick() {
    writeLine();
    minuteTimer = after(60000, tick);
  }

  const api = {
    get busy() { return crackT >= 0; },
    get debug() { return { crackT, opened, lidOpen }; },
    col,
    /** Initial state from the model (called at build and on arrival). */
    sync() {
      opened = !!capsuleInfo().opened;
      lidOpen = opened ? 1 : 0;
      crackT = -1; electrum = 0;
      for (const c of cracks) stat.electrum.setDraw(c, 0);
      stat.electrum.lines.setColor('electrum');
      stat.electrum.lines.setAlpha(0);                 // the crack lines exist only while the capsule cracks
      place();
      writeLine();
      if (minuteTimer) cancelAfter(minuteTimer);
      minuteTimer = after(60000 - (Date.now() % 60000), tick);
    },
    /** True when the capsule is due and still sealed. */
    due() { const i = capsuleInfo(); return i.open && !i.opened && !opened; },
    /** The opening choreography; resolves at the open moment (lid moving). reduced = the 160 ms form. */
    open(reduced) {
      crackT = 0;
      electrum = 1;
      stat.electrum.lines.setColor('electrum');
      stat.electrum.lines.setAlpha(1);
      const fx = hctx.fx, V = performance.now();
      const audioFn = (T) => hctx.audio.play('capsule', { when: T });
      if (fx && fx.cue && fx.cue.at) fx.cue.at(V + 30, { id: 'capsule', audio: audioFn });
      else hctx.audio.play('capsule', {});
      return new Promise((res) => { api._res = res; api._rm = !!reduced; });
    },
    pos,
    update(dt) {
      if (crackT < 0) return;
      crackT += dt * 1000;
      const rm = api._rm;
      const crackEnd = rm ? 160 : CRACK_STEP * 4 + CRACK_DRAW;
      for (let k = 0; k < 5; k++) {
        const f = rm ? crackT / 160 : (crackT - CRACK_STEP * k) / CRACK_DRAW;
        stat.electrum.setDraw(cracks[k], f);
      }
      if (crackT >= crackEnd && !opened) {
        opened = true;
        writeLine();
        if (api._res) { const r = api._res; api._res = null; r(); }
      }
      if (opened) lidOpen = Math.max(0, Math.min(1, rm ? 1 : (crackT - crackEnd) / LID_MS));
      place();
      // electrum ≤ 2,500 ms on screen (from the first crack), then cools to silver over 600 ms
      const coolAt = HOLD_E;
      if (crackT > coolAt) {
        electrum = Math.max(0, 1 - (crackT - coolAt) / COOL_MS);
        stat.electrum.lines.setAlpha(electrum);
        if (electrum <= 0) { stat.electrum.lines.setAlpha(0); crackT = -1; }
      }
    },
    dispose() {
      if (minuteTimer) cancelAfter(minuteTimer);
      minuteTimer = 0;
      label.remove();
    },
  };
  api.sync();
  return api;
}
