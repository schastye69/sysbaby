// halls/insignia/vault.js — WP9: НАХОДКИ and the VAULT MELODY (SPEC §6.6, §8.1 order S01…S14, §8.2 shard lines).
// Shards: one slim obsidian sliver (0.4 m) with --white edges per FOUND secret, on the upper ring (r 10 m, y +5 m),
// 14° apart, centred in front at yaw 0, each turning slowly; its label = the Russian name (LABEL) + MICRO date; tapping
// the shard (or its label) shows its one-line memory (BODY, templates {p} {freq} {name}) and rings its note. Unfound
// secrets leave no trace.
// VAULT MELODY: every arrival, 600 ms after the lock, 14 steps of 280 ms in S01…S14 order: found = its note (`vaultNote`,
// planned on the cue clock, L4) + the shard's edges flash --white; unfound = a rest (muted: a 1 px ring pulse at the
// sphere centre). The flashes run whether or not a voice was created (muted parity).
import { Matrix4, Quaternion, Vector3 } from 'three';
import { buildShardGeometry } from './shapes.js';
import { SECRETS, secretById } from '../../secrets/registry.js';
import { SECRET_NOTE, hz } from '../../audio/notes.js';
import { fmtDate } from '../../core/ru.js';
import { WORLD } from '../../data/world.js';
import { after, cancelAfter } from '../../core/clock.js';

const R_SH = 10, Y_SH = 5, STEP_DEG = 14, MEL_MS = 280, MEL_DELAY = 600;
const Y = new Vector3(0, 1, 0);
const _m = new Matrix4(), _q = new Quaternion(), _p = new Vector3(), _s = new Vector3(1, 1, 1);
const _w = new Vector3(), _c = new Vector3();
const _pp = { x: 0, y: 0, depth: 0, visible: false };

/** The shard line of a found secret with its templates filled (SPEC §8.2, ARCH §3.14.1). */
export function shardLine(id, data) {
  const s = secretById(id);
  if (!s) return '';
  const vars = (data && data.foundVars && data.foundVars[id]) || {};
  const freq = Number(WORLD.clan.frequency);
  return s.line
    .replace('{p}', vars.p != null ? String(vars.p) : '')
    .replace('{freq}', Number.isFinite(freq) ? freq.toFixed(2) : String(WORLD.clan.frequency || ''))
    .replace('{name}', (WORLD.companion && WORLD.companion.name) || '');
}

function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

export function createVault(hctx, ring, labels, section) {
  const shards = [];
  const flash = new Float32Array(14);
  let yaw = 0, lineTimer = 0, openK = -1;
  const timers = [];
  const plans = [];

  const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  pulse.setAttribute('class', 'ins-pulse');
  pulse.setAttribute('viewBox', '0 0 60 60');
  pulse.setAttribute('aria-hidden', 'true');
  const circ = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circ.setAttribute('cx', '30'); circ.setAttribute('cy', '30'); circ.setAttribute('r', '29');
  pulse.appendChild(circ);
  section.appendChild(pulse);

  function shardPos(i, n, out) {
    const th = ((i - (n - 1) / 2) * STEP_DEG * Math.PI) / 180;
    return out.set(Math.sin(th) * R_SH, Y_SH, -Math.cos(th) * R_SH);
  }

  function rebuild() {
    // (called at build: the found set is fixed for the visit of the hall; a new find lands in the I letter, and the
    //  hall is rebuilt on the next arrival)
    const found = hctx.secrets ? hctx.secrets.found() : [];
    const d = hctx.state.data || {};
    found.forEach((id, i) => {
      const g = buildShardGeometry(0x5a00 + SECRETS.findIndex((s) => s.id === id) * 977, 0.4);
      const S = { id, k: SECRETS.findIndex((s) => s.id === id), pos: shardPos(i, found.length, new Vector3()),
        solid: ring.solids.add(g.flat), edge: ring.white.add(g.edges, { alpha: 0.9, width: 1.2 }), spin: i * 1.7, label: null, line: null };
      const box = el('button', 'ins-shard');
      box.type = 'button';
      box.dataset.qa = 'shard';
      box.dataset.id = id;
      const s = secretById(id);
      box.append(el('span', 't-label ins-shard-name', s ? s.name : id));
      const iso = d.found && d.found[id];
      box.append(el('span', 't-micro ins-shard-date', iso ? fmtDate(iso) : ''));
      S.line = el('span', 't-body ins-shard-line');
      S.line.hidden = true;
      box.append(S.line);
      box.addEventListener('click', (e) => { e.stopPropagation(); api.open(shards.indexOf(S)); });
      S.label = labels.add({ el: box, get: (out) => out.copy(S.pos).applyAxisAngle(Y, yaw), side: 'right', len: 28, rise: 26 });
      S.label.show(true);
      shards.push(S);
    });
  }
  rebuild();

  function ringPulse() {
    // a 1 px ring from the centre, 6 → 30 px, fading over 280 ms (Web Animations: no layout read in the frame)
    if (typeof pulse.animate === 'function') {
      pulse.animate([{ transform: 'translate(-50%,-50%) scale(0.2)', opacity: 0.8 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 0 }],
        { duration: MEL_MS, easing: 'cubic-bezier(0.16,1,0.3,1)' });
    }
  }

  const api = {
    shards,
    setYaw(y) { yaw = y; },
    /** Show shard k's memory (6 s) and ring its note. */
    open(k) {
      const S = shards[k];
      if (!S) return;
      if (openK >= 0 && shards[openK]) { shards[openK].line.hidden = true; shards[openK].label.el.classList.remove('is-open'); }
      openK = k;
      S.line.textContent = shardLine(S.id, hctx.state.data);
      S.line.hidden = false;
      S.label.el.classList.add('is-open');
      flash[S.k] = 1;
      hctx.audio.play('vaultNote', { hz: hz(SECRET_NOTE[S.id]) });
      if (lineTimer) cancelAfter(lineTimer);
      lineTimer = after(6000, () => { lineTimer = 0; if (shards[k]) { shards[k].line.hidden = true; shards[k].label.el.classList.remove('is-open'); } if (openK === k) openK = -1; });
    },
    /** Screen pick of a shard → index or −1. */
    hit(x, y) {
      for (let k = 0; k < shards.length; k++) {
        const S = shards[k];
        _w.copy(S.pos).applyAxisAngle(Y, yaw);
        hctx.toCanonical(_w, _c);
        if (hctx.scale && hctx.scale.toRender) hctx.scale.toRender(_c, _c);
        hctx.rig.project(_c, _pp);
        if (_pp.visible && Math.hypot(_pp.x - x, _pp.y - y) < 36) return k;
      }
      return -1;
    },
    /** The melody, from now (the arrival lock). */
    play() {
      api.stop();
      const fx = hctx.fx;
      const t0 = performance.now() + MEL_DELAY;
      const found = new Set(hctx.secrets ? hctx.secrets.found() : []);
      const soundOn = !!hctx.app.soundOn;
      SECRETS.forEach((s, i) => {
        const V = t0 + i * MEL_MS;
        const has = found.has(s.id);
        const visual = () => { if (has) flash[i] = 1; else if (!soundOn || !hctx.app.soundOn) ringPulse(); };
        const audioFn = has ? (T) => { hctx.audio.play('vaultNote', { hz: hz(SECRET_NOTE[s.id]), when: T }); } : null;
        if (fx && fx.cue && typeof fx.cue.at === 'function') plans.push(fx.cue.at(V, { id: `vault:${s.id}`, audio: audioFn || undefined, visual }));
        else timers.push(after(V - performance.now(), () => { visual(); if (audioFn) hctx.audio.play('vaultNote', { hz: hz(SECRET_NOTE[s.id]) }); }));
      });
    },
    stop() {
      for (const p of plans) { try { p.cancel(); } catch (e) { /* gone */ } }
      plans.length = 0;
      for (const id of timers) cancelAfter(id);
      timers.length = 0;
      flash.fill(0);
    },
    update(dt) {
      const decay = Math.exp(-dt / 0.16);
      for (let k = 0; k < shards.length; k++) {
        const S = shards[k];
        S.spin += dt * 0.35;
        _q.setFromAxisAngle(Y, S.spin);
        _p.copy(S.pos); _p.y += Math.sin(S.spin * 1.3) * 0.05;
        _m.compose(_p, _q, _s);
        ring.solids.setMatrix(S.solid, _m);
        ring.white.setMatrix(S.edge, _m);
        const f = flash[S.k];
        ring.white.setWidth(S.edge, 1.2 + 2.2 * f);
        ring.white.setAlpha(S.edge, Math.min(1, 0.9 + 0.1 * f));
        S.label.el.classList.toggle('is-flash', f > 0.35);
      }
      for (let i = 0; i < 14; i++) flash[i] *= decay;
    },
    dispose() {
      api.stop();
      if (lineTimer) cancelAfter(lineTimer);
      for (const S of shards) S.label.remove();
      shards.length = 0;
      if (pulse.parentNode) pulse.parentNode.removeChild(pulse);
    },
  };
  return api;
}
