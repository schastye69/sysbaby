// deeds/sbor.js — «СБОР»: the founder calls, the team gathers (SPEC-ADDENDUM A3.2, A11.1, A11.3 / O14; ARCH-ADDENDUM
// X§2.6.3). OWNER: WP13. WP5 owns the gesture and every column picture through the SborAdapter; WP13 owns the timeline,
// the sound (cue clock), the pulse, the GATHERED readout, the data, the deed and the bus.
//   hold   ≥ 150 ms: the 2 px ember ring fills (adapter.ring) with probeHold; release early → it unwinds 240 ms, no deny
//   t = 0  CALL: his capital flashes white, a 1 px silver deck ring leaves his base at 60 m/s (alpha 0.8 → 0), sborCall
//          (his note as an FM bell + its fifth, panned to his column), vibrate([10,30,10])
//   t_k = 1000·dist_k / 60   the ring strikes column k (nearest first): sway away from him + re-index + tick; the answer by
//          real status (overridden to «на связи» for guests / ЗДЕСЬ): на связи — climb 320, white flash, sborAnswer on,
//          thread at t_k+320 (480 ms); в пути — 600 ms later, slow climb 900, breathing ring, thread at t_k+1,500 (960);
//          отдыхает — capital silver 40 % 1,200 ms, tick + note an octave down. Nothing is dimmed, nobody shrinks.
//   first answer → subPulse 4 beats × 900 ms (−34 dB) with its uPulse twin
//   last answer + 200 → GATHERED: LABEL `СБОР · dd.mm` · LEAD «Команда в сборе.» · LABEL `ОТКЛИКНУЛИСЬ ВСЕ · nn` (60 ms per
//          row) at his capital; status «клан откликнулся.» (P1); first-ever СБОР → deed `call`; sbor:done {day, count}
//   GATHERED + 2,000 → the threads release from their far ends toward him (600 ms); dust (Phase C) settles 2,400 ms
//   12 s ЗДЕСЬ window: toggleHere(id) marks / unmarks (survey + and LABEL via the adapter, the member's note); commit on
//          the window's close or Esc → sbor.here (today's entry; ≤ 30 kept). Guests are pre-marked.
// Reduced motion: the ring at full radius fading 480 ms; answers within 300 ms (60 ms stagger), no climbs or sway;
// threads complete with a 160 ms fade; the readout fades 160 ms. Columns never change height (L10); no bow.
import { Vector3 } from 'three';
import { app } from '../core/store.js';
import { bus } from '../core/bus.js';
import { state } from '../core/state.js';
import { after, cancelAfter, tween } from '../core/clock.js';
import { keyboard } from '../nav/keyboard.js';
import { vibrate } from '../ui/tactile.js';
import { WORLD } from '../data/world.js';
import { hz } from '../audio/notes.js';
import { el, dm, two, panOf, reduced, fade } from '../host/dom.js';

const SPEED = 60;            // m/s, the call ring
const RING_TO = 60;          // m
const _a = new Vector3(), _b = new Vector3(), _up = new Vector3(0, 1, 0);

export function createSbor(ctx, deps) {
  let adapter = null, holdVoice = null, ringTw = null, ringFill = 0, running = null, hereWin = null;
  const curveScratch = [];

  const members = () => WORLD.members;
  const opId = () => WORLD.operator.id;
  const indexOf = (id) => (adapter && Array.isArray(adapter.ids) ? adapter.ids.indexOf(id) : members().findIndex((m) => m.id === id));
  const idAt = (k) => (adapter && Array.isArray(adapter.ids) ? adapter.ids[k] : (members()[k] || {}).id);
  const memberAt = (k) => members().find((m) => m.id === idAt(k)) || null;
  const opIndex = () => (adapter && Number.isInteger(adapter.operatorIndex) ? adapter.operatorIndex : indexOf(opId()));
  const call = (name, ...a) => { if (!adapter || typeof adapter[name] !== 'function') return undefined; try { return adapter[name](...a); } catch (e) { return undefined; } };
  const pan = (k) => { const x = call('screenX', k); return Number.isFinite(x) ? panOf(x) : 0; };
  const dist = (k) => { const d = call('baseDistM', k); return Number.isFinite(d) ? d : 8 * Math.abs(k - opIndex()); };

  const kindOf = (m) => {
    if (deps.guests && deps.guests.isHere(m.id)) return 'on';
    const s = m.status;
    return s === 'в пути' ? 'way' : s === 'отдыхает' ? 'rest' : 'on';
  };

  /** the GATHERED readout (overlay owner 'sbor', anchored at his capital) */
  function readout(n, rm) {
    const b = el('div', 'sbor-readout', null, null, { qa: 'sbor-readout' });
    const rows = [
      el('p', 't-label', `СБОР · ${dm(state.today)}`, b),
      el('p', 't-lead sbor-readout__lead', 'Команда в сборе.', b),
      el('p', 't-label sbor-readout__n', `ОТКЛИКНУЛИСЬ ВСЕ · ${two(n)}`, b),
    ];
    rows.forEach((r) => { r.style.opacity = '0'; });
    let anchor = null;
    if (adapter && ctx.overlay) {
      const op = opIndex();
      anchor = ctx.overlay.add({ owner: 'sbor', id: 'readout', el: b, get(out) { return call('capital', op, out) || out.set(0, 0, 0); },
        leader: { side: 'right', len: 56, rise: 64 }, cross: true, priority: 60, hideBehind: false });
      if (!rm) anchor.drawIn(240);
      b.classList.remove('is-pending');
    } else {
      const host = document.getElementById('hoststrip') || document.body;
      b.classList.add('sbor-readout--free');
      host.appendChild(b);
    }
    b.classList.add('is-in');
    rows.forEach((r, k) => after(rm ? 0 : k * 60, () => fade(r, 1, rm ? 160 : 240)));     // 60 ms per row
    return { remove(ms = 240) { fade(b, 0, ms); after(ms, () => { if (anchor) anchor.remove(); else b.remove(); }); } };
  }

  /** The A3.2 timeline. → Promise (resolves after GATHERED) */
  function timeline() {
    return new Promise((resolve) => {
      const rm = reduced();
      const cue = ctx.fx.cue;
      const t0 = performance.now() + 16;
      const op = opIndex();
      const opM = memberAt(op) || members().find((m) => m.id === opId());
      const opPan = pan(op);
      const threads = [];
      const curves = [];
      const others = [];
      const n = members().length;
      for (let k = 0; k < n; k++) if (k !== op && idAt(k)) others.push(k);
      others.sort((a, b) => dist(a) - dist(b));
      // CALL
      cue.at(t0, {
        id: 'sborCall',
        audio: (T) => ctx.audio.play('sborCall', { hz: hz(opM ? opM.note : 'D4'), when: T, pan: opPan }),
        visual: () => {
          call('flashCapital', op, 'white');
          vibrate([10, 30, 10]);
          if (rm) { call('callRing', RING_TO, 0.8); tween(480, (x) => call('callRing', RING_TO, 0.8 * (1 - x))); }
          else tween(1000, (x) => call('callRing', RING_TO * x, 0.8 * (1 - x)));
        },
      });
      let lastAnswer = 0, firstAnswer = Infinity;
      others.forEach((k, rank) => {
        const m = memberAt(k);
        if (!m) return;
        const kind = kindOf(m);
        const tk = rm ? rank * 60 : (1000 * dist(k)) / SPEED;
        const ta = kind === 'way' && !rm ? tk + 600 : tk;
        firstAnswer = Math.min(firstAnswer, ta);
        lastAnswer = Math.max(lastAnswer, ta);
        const p = pan(k);
        if (!rm) cue.at(t0 + tk, { id: 'sborStrike', visual: () => call('strike', k) });
        cue.at(t0 + ta, {
          id: 'sborAnswer',
          audio: (T) => ctx.audio.play('sborAnswer', { hz: hz(m.note), kind: kind === 'on' ? 'on' : kind, when: T, pan: p }),
          visual: () => {
            if (kind === 'on') { call('climb', k, rm ? 0 : 320); call('flashCapital', k, 'white'); }
            else if (kind === 'way') { call('climb', k, rm ? 0 : 900); call('breatheRing', k, true); }
            else call('flashCapital', k, 'silver40', 1200);
          },
        });
        if (kind === 'rest') return;
        const tt = rm ? tk : kind === 'way' ? tk + 1500 : tk + 320;
        const ms = rm ? 160 : kind === 'way' ? 960 : 480;
        cue.at(t0 + tt, {
          id: 'bondThread',
          audio: (T) => ctx.audio.play('bondThread', { ms, when: T, panFrom: p, panTo: opPan }),
          visual: () => {
            const h = call('thread', k, ms);
            if (h) threads.push(h);
            if (call('capital', k, _a) && call('capital', op, _b)) {
              const s = ctx.scale ? ctx.scale.s || 1 : 1;
              const c = curveScratch[curves.length] || (curveScratch[curves.length] = [new Vector3(), new Vector3(), new Vector3(), new Vector3()]);
              c[0].copy(_a); c[3].copy(_b);
              c[1].lerpVectors(_a, _b, 1 / 3).addScaledVector(_up, 6 * s);
              c[2].lerpVectors(_a, _b, 2 / 3).addScaledVector(_up, 6 * s);
              curves.push(c);
            }
          },
        });
      });
      // the hidden pulse joins under the first answer
      const pulse = Number.isFinite(firstAnswer) ? ctx.fx.pulse.run({ periodMs: 900, beats: 4, level01: 0.75, t0: t0 + firstAnswer }) : null;
      // GATHERED
      const tg = lastAnswer + 200 + (rm ? 160 : 0);
      cue.at(t0 + tg, {
        id: 'sborGathered',
        visual: () => {
          const count = others.length;
          const ro = readout(count, rm);
          const sb = state.data.sbor || { count: 0, last: null, here: [] };
          const nNext = (sb.count | 0) + 1;
          state.patch((d) => { if (!d.sbor || typeof d.sbor !== 'object') d.sbor = { count: 0, last: null, here: [] }; d.sbor.count = nNext; d.sbor.last = state.today; });
          if (ctx.status) ctx.status.say('sbor.done');
          if (deps.deeds) deps.deeds.done('call');
          bus.emit('sbor:done', { day: state.today, count: nNext });
          // Phase C: dust both ways along the threads (one emitter for all of them)
          let dust = null;
          if (curves.length && ctx.fx.dust) dust = ctx.fx.dust.emitter('threads', { curves: curves.slice(0, 6), perThread: 60 });
          openHere();
          after(2000, () => {
            for (const h of threads) { try { h.release(rm ? 160 : 600); } catch (e) { /* gone */ } }
            if (dust) dust.release(2400);
            if (pulse) pulse.stop();
          });
          after(rm ? 4000 : 6000, () => ro.remove(rm ? 160 : 240));
          resolve();
        },
      });
    });
  }

  /** ЗДЕСЬ: 12 s after GATHERED; guests pre-marked. Commit on close or Esc. */
  function openHere() {
    closeHere(false);
    const ids = new Set();
    if (deps.guests) for (const id of deps.guests.rosterIds()) ids.add(id);
    const sb = state.data && state.data.sbor;
    const today = sb && Array.isArray(sb.here) ? sb.here.find((h) => h && h.day === state.today) : null;
    if (today) for (const id of today.ids) ids.add(id);
    for (const id of ids) { const k = indexOf(id); if (k >= 0) call('markHere', k, true); }
    const timer = after(12000, () => closeHere(true));
    const pop = keyboard.pushHandler((e) => { if (e.key === 'Escape') { closeHere(true); return true; } return false; });
    const offT = bus.on('travel:start', () => closeHere(true));
    hereWin = { ids, timer, pop, offT };
  }
  function closeHere(commit) {
    const w = hereWin;
    if (!w) return;
    hereWin = null;
    cancelAfter(w.timer); w.pop(); w.offT();
    if (!commit) return;
    const valid = [...w.ids].filter((id) => members().some((m) => m.id === id) && id !== opId());
    state.patch((d) => {
      if (!d.sbor || typeof d.sbor !== 'object') d.sbor = { count: 0, last: null, here: [] };
      if (!Array.isArray(d.sbor.here)) d.sbor.here = [];
      d.sbor.here = d.sbor.here.filter((h) => h && h.day !== state.today);
      if (valid.length) d.sbor.here.push({ day: state.today, ids: valid });
      while (d.sbor.here.length > 30) d.sbor.here.shift();
    });
  }

  const api = {
    attach(a) { adapter = a || null; },
    /** the attached adapter (WP5's, WP11's T0 one, or the dev one) */
    get adapter() { return adapter; },
    holdProgress(ms) {
      if (running) return;
      if (ms >= 150 && !holdVoice) holdVoice = ctx.audio.start('probeHold', {});
      if (ringTw) { ringTw.cancel(); ringTw = null; }
      ringFill = ms < 150 ? 0 : Math.min(1, (ms - 150) / 1050);
      call('ring', ringFill);
    },
    holdCancel() {
      if (holdVoice) { try { holdVoice.stop(60); } catch (e) { /* gone */ } holdVoice = null; }
      const from = ringFill;
      ringFill = 0;
      if (ringTw) ringTw.cancel();
      ringTw = tween(240, (x) => call('ring', from * (1 - x)));
    },
    holdComplete() {
      if (holdVoice) { try { holdVoice.stop(40); } catch (e) { /* gone */ } holdVoice = null; }
      if (ringTw) { ringTw.cancel(); ringTw = null; }
      call('ring', 0); ringFill = 0;
      if (running) return running;
      running = new Promise((res) => {
        ctx.fx.stage.run('sbor', () => timeline()).then(res, res);
      }).then(() => { running = null; });
      return running;
    },
    toggleHere(id) {
      if (!hereWin || id === opId()) return;
      const k = indexOf(id);
      const on = !hereWin.ids.has(id);
      if (on) hereWin.ids.add(id); else hereWin.ids.delete(id);
      if (k >= 0) call('markHere', k, on);
      const m = members().find((x) => x.id === id);
      if (m && on) ctx.fx.cue.at(performance.now(), { id: 'memberNote', audio: (T) => ctx.audio.play('memberNote', { hz: hz(m.note), when: T, pan: pan(k) }) });
    },
    info() {
      const sb = (state.data && state.data.sbor) || {};
      const count = sb.count | 0;
      return { count, last: typeof sb.last === 'string' ? sb.last : null, hint: count === 0 };
    },
    get running() { return !!running; },
    get hereOpen() { return !!hereWin; },
  };
  void app;
  return api;
}
