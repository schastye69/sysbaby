// halls/signal/dial.js — WP8: «ЧАСТОТА», the frequency dial and S11 (SPEC §6.5 part 3, §8.1 S11, §8.3 motion hint).
//
// Shared models (ARCH §3.19; T0 imports them): dialStatic(f), createDialLock(onLock).
// createDial(hctx, host) — the SVG dial in the hall section:
//   desktop: a 140° hairline arc (r 160 px) on the right side, a tick every 1.00, MICRO numbers every 10.00, the needle
//            from the hub, LABEL `ЧАСТОТА` + DATA 48 px `{ff.ff}` left of the arc;
//   phone:   a half-ring concentric with the pad, under it; the needle is a short radial cut across the ring; the
//            readout sits under the ring.
//   Tuning: 1 px of tangential travel = 0.05 (desktop Shift 0.01), 00.00…99.99, 00.00 on every arrival.
//   Hot/cold: static = clamp(|f − F| / 8, 0, 1) → needle jitter 0–3 px, the arc hairline breaks into dashes ∝ static,
//   hiss `dialStatic` at static × −30 dB (no extra grain). Within 0.5 of F the carrier rises (`dialCarrier`), with its
//   visual twin: the arc brightens round the needle. Holding within ±0.05 for 600 ms locks: `beatLock`, two converging
//   sines on the needle (its twin), LABEL `ТАЙНАЯ ЧАСТОТА 14.03`, `signal.secret` BEAM WRITE in LEAD, S11.
//   Motion hint S11: the needle twitches toward 14 and back (no text).
// DOM contract (ARCH §6.9): [data-qa="dial"] with data-cx/cy/r (CSS px), data-a0/a1 (deg, 0° = +x, clockwise),
// data-value (two decimals); [data-qa="dial-lock"].
import { WORLD } from '../../data/world.js';
import { EASE, clamp01 } from '../../core/ease.js';

/** Static amount of the frequency dial: clamp(|f − F| / 8, 0, 1), F = WORLD.clan.frequency. */
export function dialStatic(f) {
  const F = WORLD.clan.frequency;
  return Math.max(0, Math.min(1, Math.abs(f - F) / 8));
}

/** → { feed(f, dtMs) } — fires onLock once per hold when f stays within ±0.05 of F for 600 ms; re-arms after
 *  leaving the ±0.05 window. */
export function createDialLock(onLock) {
  let held = 0, fired = false;
  return {
    feed(f, dtMs) {
      const inside = Math.abs(f - WORLD.clan.frequency) <= 0.05 + 1e-9;
      if (!inside) { held = 0; fired = false; return false; }
      held += Math.max(0, dtMs || 0);
      if (!fired && held >= 600) { fired = true; if (typeof onLock === 'function') onLock(f); return true; }
      return false;
    },
    reset() { held = 0; fired = false; },
  };
}

const NS = 'http://www.w3.org/2000/svg';
const DEG = Math.PI / 180;
const fmt = (v) => (v < 10 ? '0' : '') + v.toFixed(2);
function svg(tag, attrs, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
function el(tag, cls, parent, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  if (parent) parent.appendChild(e);
  return e;
}

/** @returns {{ root, layout(g), hit(x, y), begin(g), move(g), end(), update(dtMs, tMs, reduced), value, locked, hint(),
 *  setVisible(a), arrive(), depart(), dispose() }} */
export function createDial(hctx, host) {
  const F = WORLD.clan.frequency;
  const root = el('div', 'sg-dial', host);
  root.dataset.qa = 'dial';
  root.setAttribute('role', 'slider');
  root.setAttribute('tabindex', '0');
  root.setAttribute('aria-label', 'частота');
  root.setAttribute('aria-valuemin', '0');
  root.setAttribute('aria-valuemax', '99.99');
  const art = svg('svg', { class: 'sg-dial__svg', 'aria-hidden': 'true' }, root);
  const arc = svg('path', { class: 'sg-dial__arc' }, art);
  const glow = svg('path', { class: 'sg-dial__hot' }, art);
  const ticks = svg('path', { class: 'sg-dial__ticks' }, art);
  const majors = svg('path', { class: 'sg-dial__majors' }, art);
  const hub = svg('path', { class: 'sg-dial__hub' }, art);
  const needle = svg('line', { class: 'sg-dial__needle' }, art);
  const twinA = svg('path', { class: 'sg-dial__twin' }, art);
  const twinB = svg('path', { class: 'sg-dial__twin' }, art);
  const nums = el('div', 'sg-dial__nums', root);
  const numEls = [];
  for (let k = 0; k <= 9; k++) numEls.push(el('span', 't-micro', nums, String(k * 10).padStart(2, '0')));
  const read = el('div', 'sg-dial__read', root);
  const label = el('p', 't-label sg-dial__label', read, 'ЧАСТОТА');
  const data = el('p', 't-data t-data--48 sg-dial__value', read, '00.00');
  const lockEl = el('p', 't-label sg-dial__lock', read, `ТАЙНАЯ ЧАСТОТА ${fmt(F)}`);
  lockEl.dataset.qa = 'dial-lock';
  lockEl.hidden = true;

  const st = {
    g: null, value: 0, shown: -1, engaged: false, lastTouch: -1e9, locked: false, lockT: -1, jitter: 0,
    hintT: -1, hintFrom: 0, dragging: false, alive: false, drawnV: -1, idleFrames: 0,
    voices: { hiss: null, carrier: null }, staticU: 1, carrierU: 0, dashKey: '',
  };
  const lock = createDialLock(() => onLock());

  // ── geometry ─────────────────────────────────────────────────────────────────────────────────────────────
  const angleOf = (v) => {
    const g = st.g; return (g.a0 + (g.a1 - g.a0) * (v / 100)) * DEG;
  };
  function arcPath(r, a0, a1) {
    const g = st.g, x0 = g.cx + Math.cos(a0) * r, y0 = g.cy + Math.sin(a0) * r, x1 = g.cx + Math.cos(a1) * r, y1 = g.cy + Math.sin(a1) * r;
    const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0, sweep = a1 > a0 ? 1 : 0;
    return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${large} ${sweep} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  function layout(g) {
    st.g = g;
    root.dataset.cx = g.cx.toFixed(1); root.dataset.cy = g.cy.toFixed(1); root.dataset.r = String(g.r);
    root.dataset.a0 = String(g.a0); root.dataset.a1 = String(g.a1);
    root.classList.toggle('sg-dial--half', g.kind === 'half');
    // The SVG covers only the dial's own box (a full-viewport layer would repaint whole on every needle move).
    const pad = g.r + 40, bx = Math.floor(g.cx - pad), by = Math.floor(g.cy - pad);
    const bw = Math.ceil(2 * pad), bh = Math.ceil(2 * pad);
    art.setAttribute('viewBox', `${bx} ${by} ${bw} ${bh}`);
    art.style.left = `${bx}px`; art.style.top = `${by}px`; art.style.width = `${bw}px`; art.style.height = `${bh}px`;
    arc.setAttribute('d', arcPath(g.r, g.a0 * DEG, g.a1 * DEG));
    // Ticks every 1.00 inward (6 px; every 5.00 9 px), majors every 10.00 (13 px).
    let t = '', m = '';
    const inward = g.kind === 'half' ? 1 : -1;                       // phone: outward, away from the pad
    for (let k = 0; k <= 100; k++) {
      const a = angleOf(Math.min(k, 99.99)), c = Math.cos(a), s = Math.sin(a);
      const len = k % 10 === 0 ? 13 : k % 5 === 0 ? 9 : 6;
      const r0 = g.r, r1 = g.r + inward * len;
      const seg = `M${(g.cx + c * r0).toFixed(1)} ${(g.cy + s * r0).toFixed(1)}L${(g.cx + c * r1).toFixed(1)} ${(g.cy + s * r1).toFixed(1)}`;
      if (k % 10 === 0) m += seg; else t += seg;
    }
    ticks.setAttribute('d', t); majors.setAttribute('d', m);
    // MICRO numbers every 10.00 just inside the majors.
    for (let k = 0; k <= 9; k++) {
      const a = angleOf(k * 10), rr = g.kind === 'half' ? g.r - 12 : g.r - 26;
      numEls[k].style.transform = `translate(${(g.cx + Math.cos(a) * rr).toFixed(1)}px,${(g.cy + Math.sin(a) * rr).toFixed(1)}px) translate(-50%,-50%)`;
    }
    // Hub cross (desktop only).
    hub.setAttribute('d', g.kind === 'half' ? '' : `M${g.cx - 4} ${g.cy}H${g.cx + 4}M${g.cx} ${g.cy - 4}V${g.cy + 4}`);
    // Readout: desktop left of the arc's middle (right-aligned), phone under the ring.
    if (g.kind === 'half') {
      read.style.transform = `translate(${g.cx.toFixed(1)}px,${(g.cy + g.r + 16).toFixed(1)}px) translate(-50%,0)`;
      read.classList.add('sg-dial__read--centre');
    } else {
      // Under the arc's lower end, right-aligned on the hub: clear of the centred LEAD and of the pad.
      const xr = g.cx + 6, yt = g.cy + Math.sin(g.a0 * DEG) * g.r + 34;
      read.style.transform = `translate(${xr.toFixed(1)}px,${yt.toFixed(1)}px) translate(-100%,0)`;
      read.classList.remove('sg-dial__read--centre');
    }
    st.shown = -1; st.dashKey = '';
    draw(0, 0);
  }

  // ── input ─────────────────────────────────────────────────────────────────────────────────────────────────
  /** Is (x, y) on the dial (the arc band, its ticks and the readout)? */
  function hit(x, y) {
    const g = st.g; if (!g) return false;
    const dx = x - g.cx, dy = y - g.cy, d = Math.hypot(dx, dy);
    if (d < g.r - 44 || d > g.r + 30) return false;
    let a = Math.atan2(dy, dx) / DEG; if (a < 0) a += 360;
    const lo = Math.min(g.a0, g.a1) - 8, hi = Math.max(g.a0, g.a1) + 8;
    return a >= lo && a <= hi;
  }
  function begin() { st.dragging = true; engage(); }
  /** One pointer move: tangential travel (px) × 0.05 (Shift 0.01). */
  function move(g) {
    const G = st.g; if (!G) return;
    const px = g.x - g.dx * 0.5 - G.cx, py = g.y - g.dy * 0.5 - G.cy;
    const r = Math.hypot(px, py) || 1;
    const dir = Math.sign(G.a1 - G.a0) || 1;
    // Unit tangent in the direction of increasing value: dir · (−sin θ, cos θ).
    const tx = dir * (-py / r), ty = dir * (px / r);
    const travel = g.dx * tx + g.dy * ty;
    setValue(st.value + travel * (g.shift && !hctx.layout.isPhone ? 0.01 : 0.05));
    engage();
  }
  function end() { st.dragging = false; st.lastTouch = hctx.loop.now; }
  function setValue(v) {
    st.value = Math.max(0, Math.min(99.99, Math.round(v * 1e4) / 1e4));
    root.dataset.value = st.value.toFixed(2);
    root.setAttribute('aria-valuenow', st.value.toFixed(2));
  }
  /** Keyboard: ←/↓ −, →/↑ + (0.05; Shift 0.01; PageUp/PageDown 1.00). → consumed */
  function key(e) {
    const k = e.key;
    let d = 0;
    if (k === 'ArrowRight' || k === 'ArrowUp') d = 1; else if (k === 'ArrowLeft' || k === 'ArrowDown') d = -1;
    else if (k === 'PageUp') d = 20; else if (k === 'PageDown') d = -20;
    if (!d) return false;
    setValue(st.value + d * (e.shiftKey ? 0.01 : 0.05));
    engage(); st.lastTouch = hctx.loop.now;
    return true;
  }

  // ── sound (live voices while the dial is in use; they stop 2.4 s after the last touch) ─────────────────────
  function engage() {
    st.lastTouch = hctx.loop.now;
    if (!st.engaged) {
      st.engaged = true;
      startVoices();
    }
  }
  function startVoices() {
    stopVoices(0);
    if (!hctx.audio) return;
    st.voices.hiss = hctx.audio.start('dialStatic', { amount: dialStatic(st.value) });
    st.voices.carrier = hctx.audio.start('dialCarrier', { amount: 0 });
  }
  function stopVoices(ms = 400) {
    if (st.voices.hiss) { st.voices.hiss.stop(ms); st.voices.hiss = null; }
    if (st.voices.carrier) { st.voices.carrier.stop(ms); st.voices.carrier = null; }
  }
  const hissP = { amount: 0 }, carP = { amount: 0 };

  // ── lock ───────────────────────────────────────────────────────────────────────────────────────────────────
  function onLock() {
    st.locked = true; st.lockT = hctx.loop.now;
    setValue(F);                                       // the needle settles exactly on the clan's frequency
    lockEl.hidden = false;
    root.classList.add('is-locked');
    if (hctx.audio) hctx.audio.play('beatLock', { lo: 196.0, hi: 293.66 });
    if (st.voices.carrier) { st.voices.carrier.stop(900); st.voices.carrier = null; }
    if (st.voices.hiss) { st.voices.hiss.stop(300); st.voices.hiss = null; }
    st.engaged = false;
    if (hctx.lead) hctx.lead.show(WORLD.signal.secret, { beam: true, ms: 6000, micro: `ТАЙНАЯ ЧАСТОТА ${fmt(F)}` });
    let anchor = null;
    const g = st.g;
    if (g) { const a = angleOf(st.value); anchor = { x: g.cx + Math.cos(a) * g.r, y: g.cy + Math.sin(a) * g.r }; }
    if (hctx.secrets) hctx.secrets.discover('S11', { anchor, vars: { freq: fmt(st.value) } });
  }
  function unlock() {
    if (!st.locked) return;
    st.locked = false;
    lockEl.hidden = true;
    root.classList.remove('is-locked');
  }

  // ── frame ──────────────────────────────────────────────────────────────────────────────────────────────────
  function draw(tMs, reduced) {
    const g = st.g; if (!g) return;
    let v = st.value;
    // Motion hint S11: toward 14 (280 ms), hold 480 ms, back (520 ms).
    if (st.hintT >= 0) {
      const t = tMs - st.hintT;
      const target = 14;
      let k = 0;
      if (t < 280) k = EASE.reveal(t / 280); else if (t < 760) k = 1; else if (t < 1280) k = 1 - EASE.camera((t - 760) / 520); else { st.hintT = -1; }
      if (reduced) k = t < 1100 ? 1 : 0;
      v = v + (target - v) * 0.92 * k;
    }
    const s = dialStatic(v);
    const a = angleOf(v), c = Math.cos(a), sn = Math.sin(a);
    // Jitter 0–3 px perpendicular to the needle, ∝ static (none under reduced motion, none once locked).
    const j = reduced || st.locked || !st.engaged ? 0 : s * 3 * (Math.sin(tMs * 0.091) * 0.6 + Math.sin(tMs * 0.233 + 1.7) * 0.4);
    const px = -sn * j, py = c * j;
    let x0, y0, x1, y1;
    if (g.kind === 'half') { x0 = g.cx + c * (g.r - 4); y0 = g.cy + sn * (g.r - 4); x1 = g.cx + c * (g.r + 22); y1 = g.cy + sn * (g.r + 22); }
    else { x0 = g.cx + c * 34; y0 = g.cy + sn * 34; x1 = g.cx + c * (g.r + 16); y1 = g.cy + sn * (g.r + 16); }
    needle.setAttribute('x1', (x0 + px * 0.3).toFixed(1)); needle.setAttribute('y1', (y0 + py * 0.3).toFixed(1));
    needle.setAttribute('x2', (x1 + px).toFixed(1)); needle.setAttribute('y2', (y1 + py).toFixed(1));
    // Arc dashes ∝ static (quantised so the attribute changes rarely).
    const q = Math.round(s * 12) / 12;
    const key = st.locked ? 'L' : String(q);
    if (key !== st.dashKey) {
      st.dashKey = key;
      if (st.locked || q === 0) arc.removeAttribute('stroke-dasharray');
      else arc.setAttribute('stroke-dasharray', `${(1 + 26 * (1 - q) * (1 - q)).toFixed(1)} ${(1 + 4 * q).toFixed(1)}`);
    }
    // Carrier twin: within 0.5 of F the arc round the needle brightens (± 8°).
    const near = clamp01(1 - Math.abs(v - F) / 0.5);
    st.carrierU = near;
    if (near > 0.01 || st.locked) {
      glow.setAttribute('d', arcPath(g.r, a - 8 * DEG * Math.sign(g.a1 - g.a0), a + 8 * DEG * Math.sign(g.a1 - g.a0)));
      glow.style.opacity = String(st.locked ? 1 : near);
    } else glow.style.opacity = '0';
    // Lock twin: two 1 px sines along the needle converge over 600 ms after the lock (beat 14 Hz → 0).
    if (st.lockT >= 0 && tMs - st.lockT < 1500) {
      const u = clamp01((tMs - st.lockT) / 600), amp = 4 * (1 - EASE.reveal(u)), ph = (tMs - st.lockT) * 0.014 * (1 - u);
      let dA = '', dB = '';
      for (let i = 0; i <= 16; i++) {
        const f = i / 16, bx = x0 + (x1 - x0) * f, by = y0 + (y1 - y0) * f, w = Math.sin(f * 9.42 + ph) * amp;
        dA += (i ? 'L' : 'M') + (bx - sn * w).toFixed(1) + ' ' + (by + c * w).toFixed(1);
        dB += (i ? 'L' : 'M') + (bx + sn * w).toFixed(1) + ' ' + (by - c * w).toFixed(1);
      }
      twinA.setAttribute('d', dA); twinB.setAttribute('d', dB);
      const o = String(1 - clamp01((tMs - st.lockT - 900) / 600));
      twinA.style.opacity = o; twinB.style.opacity = o;
    } else if (twinA.getAttribute('d')) { twinA.setAttribute('d', ''); twinB.setAttribute('d', ''); }
    // Readout (only when the shown value changes).
    const shown = Math.round(v * 100);
    if (shown !== st.shown) { st.shown = shown; data.textContent = fmt(shown / 100); }
    st.staticU = s;
  }

  function update(dtMs, tMs, reduced) {
    if (!st.alive) return;
    lock.feed(st.value, dtMs);
    if (st.locked && Math.abs(st.value - F) > 0.05 + 1e-9) unlock();
    // Redraw only while something moves: tuning, its 2.4 s tail, the hint twitch, the lock twin, a value change.
    const busy = st.engaged || st.hintT >= 0 || (st.lockT >= 0 && tMs - st.lockT < 1600) || st.value !== st.drawnV;
    if (busy || st.idleFrames < 2) { st.drawnV = st.value; st.idleFrames = busy ? 0 : st.idleFrames + 1; draw(tMs, reduced); }
    if (st.engaged) {
      if (!st.dragging && tMs - st.lastTouch > 2400) { st.engaged = false; stopVoices(600); }
      else {
        hissP.amount = st.staticU; carP.amount = st.carrierU;
        if (st.voices.hiss) st.voices.hiss.set(hissP);
        if (st.voices.carrier) st.voices.carrier.set(carP);
      }
    }
  }

  return {
    root, layout, hit, begin, move, end, key, update,
    get value() { return st.value; },
    get locked() { return st.locked; },
    get g() { return st.g; },
    /** S11 motion hint (SPEC §8.3): the needle twitches toward 14 and back. */
    hint() { st.hintT = hctx.loop.now; },
    setAlpha(a) { root.style.opacity = String(a); },
    /** Every arrival starts at 00.00. */
    arrive() { st.alive = true; setValue(0); unlock(); lock.reset(); st.lockT = -1; st.hintT = -1; st.engaged = false; draw(hctx.loop.now, false); },
    depart() { st.alive = false; st.engaged = false; st.dragging = false; stopVoices(200); },
    /** sound:change on → restart live voices if the dial is still in use; hidden → stop them. */
    soundChanged(on) { if (on && st.engaged) startVoices(); if (!on) stopVoices(0); },
    visibility(hidden) { if (hidden) { stopVoices(0); st.engaged = false; } },
    dispose() { stopVoices(0); if (root.parentNode) root.parentNode.removeChild(root); },
  };
}
