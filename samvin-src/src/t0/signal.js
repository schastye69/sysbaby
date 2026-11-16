// t0/signal.js — WP11. SIGNAL «СВЯЗЬ» in T0 (SPEC §6.5, §12.5 "inbox, SVG sky pad (drawing, sound and storage all work),
// dial"; S11): 1 — ВХОДЯЩИЕ ([data-qa=inbox]): LABEL `ВХОДЯЩИЕ · {delivered}`, one row per delivered transmission (MICRO
// date · LABEL from · 6 px ember dot while unread · BODY first line ≤ 34ch), a click beam-writes it in LEAD and marks it
// read; at night the pinned «НОЧНАЯ ПЕРЕДАЧА» row (not counted). 2 — НЕБО ([data-qa=pad], data-cx/cy/r): the apex
// opening seen from below — the pad circle (desktop 46vh, phone 80vw) with MICRO `НЕБО`, the mast through it and its
// 6 px ember beacon (blinking 120 ms every 1,200 ms while anything is unread); a press inside draws a 2 px --white beam
// stroke with a 300 ms phosphor decay to ember; on release it is processed (8 px, Chaikin ×2, RDP 1.5, auto-close,
// ≤ 256), sounds (skyVoice: x → pitch, y → pan, 1,200 ms) while a beam dot retraces it, rises through the apex as a star
// (800 ms) and is remembered (saveDrawing → «запомнил.»). After 6,000 ms idle a ghost 5-point star draws and fades.
// 3 — ЧАСТОТА ([data-qa=dial], data-cx/cy/r/a0/a1/value): a 140° hairline arc (r 160 px; phone a half ring under the pad)
// whose scale turns under a fixed needle — 1 px of drag along the arc = 0.05 (Shift 0.01); static = needle jitter and the
// arc breaking into dashes, a hiss at static × −30 dB, a carrier within 0.5; held within ±0.05 for 600 ms it locks:
// beat-to-lock, LABEL `ТАЙНАЯ ЧАСТОТА 14.03` ([data-qa=dial-lock]), the secret beam-written in LEAD, S11.
import { WORLD, EMPTY_LINE } from '../data/world.js';
import { state } from '../core/state.js';
import { app } from '../core/store.js';
import { layout } from '../core/layout.js';
import { loop, ORDER } from '../core/loop.js';
import { after, tween } from '../core/clock.js';
import { fmtDate } from '../core/ru.js';
import { worldCounts } from '../data/world.js';
import { processStroke, normalizeStroke, playStroke, saveDrawing } from '../halls/signal/stroke.js';
import { dialStatic, createDialLock } from '../halls/signal/dial.js';
import { svg, el, fmt, clear, block, reduced } from './dom.js';

const DEG = Math.PI / 180;
const F = () => WORLD.clan.frequency;

export function createSignal(ctx, T) {
  const sec = T.section('SIGNAL');
  const sky = svg('svg', { class: 't0-sky', 'aria-hidden': 'true' }, sec);
  const padEl = el('div', 't0-pad', null, sec, { qa: 'pad', attrs: { 'aria-label': 'небо', role: 'img' } });
  const padLabel = el('p', 't-micro t0-pad__l', 'НЕБО', sec);
  const inbox = block(sec, 't0-inbox', { qa: 'inbox' });
  const dialEl = el('div', 't0-dial', null, sec, { qa: 'dial', attrs: { role: 'slider', 'aria-label': 'частота', tabindex: '0' } });
  const dialSvg = svg('svg', { class: 't0-dial__svg', 'aria-hidden': 'true' }, dialEl);
  const dialRead = el('div', 't0-dial__read', null, sec);
  el('p', 't-label', 'ЧАСТОТА', dialRead);
  const dialVal = el('p', 't-data t0-dial__v', '00.00', dialRead);
  const dialLock = el('p', 't-label t0-dial__lock', null, dialRead, { qa: 'dial-lock' });
  const S = { cx: 0, cy: 0, r: 0, beaconOn: false, idleT: 0, ghost: false, drawing: null, f: 0, dial: null, lastF: 0, hiss: null, carrier: null, locked: false };

  // ── geometry ─────────────────────────────────────────────────────────────────────────────────────────────────
  function geom() {
    const w = layout.w, h = layout.h;
    if (layout.isPhone) {
      // the pad under the datum, the dial below it: a shallow upper arc (210°–330°) with the readout inside its chord
      const r = Math.min(0.34 * w, 0.16 * h), top = 168 + layout.safe.t, dr = Math.min(150, 0.38 * w);
      return { cx: w / 2, cy: top + r, r, dcx: w / 2, dcy: top + 2 * r + 16 + dr, dr, a0: 210, a1: 330 };
    }
    const r = 0.23 * h;
    return { cx: 0.5 * w + 30, cy: 0.33 * h, r, dcx: w - 190, dcy: 0.37 * h, dr: 160, a0: 110, a1: 250 };
  }
  function draw() {
    const g = geom();
    Object.assign(S, g);
    clear(sky);
    sky.setAttribute('viewBox', `0 0 ${layout.w} ${layout.h}`);
    // the apex: the three converging generators of the triangular hall, faint, meeting the opening
    let d = '';
    for (let j = 0; j < 3; j++) {
      const a = -Math.PI / 2 + (j * 2 * Math.PI) / 3 + Math.PI / 3;
      for (let q = -6; q <= 6; q++) {
        const b = a + q * 0.035;
        d += `M${fmt(g.cx + Math.cos(b) * g.r * 1.02)} ${fmt(g.cy + Math.sin(b) * g.r * 1.02)}L${fmt(g.cx + Math.cos(b) * g.r * 3.2)} ${fmt(g.cy + Math.sin(b) * g.r * 3.2)}`;
      }
    }
    svg('path', { d, class: 't0-sky__gen' }, sky);
    svg('circle', { cx: g.cx, cy: g.cy, r: g.r, class: 't0-sky__pad' }, sky);
    svg('circle', { cx: g.cx, cy: g.cy, r: g.r * 1.08, class: 't0-sky__ring' }, sky);
    svg('path', { d: `M${fmt(g.cx)} ${fmt(g.cy + g.r * 0.92)}V${fmt(g.cy - g.r * 0.62)}`, class: 't0-sky__mast' }, sky);
    S.beacon = svg('circle', { cx: g.cx, cy: g.cy - g.r * 0.62, r: 3, class: 't0-sky__beacon' }, sky);
    // his saved drawings, as small stars in the opening
    (state.data && state.data.drawings || []).forEach((dr, k) => {
      const a = (k * 2.4) % 6.28, rr = g.r * (0.35 + 0.08 * k);
      svg('circle', { cx: g.cx + Math.cos(a) * rr, cy: g.cy + Math.sin(a) * rr, r: 1, class: 't0-sky__star' }, sky);
    });
    S.stroke = svg('path', { class: 't0-sky__stroke' }, sky);
    S.hot = svg('path', { class: 't0-sky__hot' }, sky);
    S.dot = svg('circle', { r: 2, class: 't0-beam' }, sky);
    S.ghostP = svg('path', { class: 't0-sky__ghost' }, sky);
    Object.assign(padEl.style, { left: `${fmt(g.cx - g.r)}px`, top: `${fmt(g.cy - g.r)}px`, width: `${fmt(2 * g.r)}px`, height: `${fmt(2 * g.r)}px` });
    padEl.dataset.cx = fmt(g.cx); padEl.dataset.cy = fmt(g.cy); padEl.dataset.r = fmt(g.r);
    padLabel.style.transform = `translate(${fmt(g.cx - g.r * 0.72 - 44)}px,${fmt(g.cy + g.r * 0.72 + 6)}px)`;
    drawDial();
  }

  // ── inbox ────────────────────────────────────────────────────────────────────────────────────────────────────
  function fillInbox() {
    clear(inbox);
    el('i', 't0-tick', null, inbox, { attrs: { 'aria-hidden': 'true' } });
    const c = worldCounts();
    el('p', 't-label t0-inbox__h', `ВХОДЯЩИЕ · ${c.delivered}`, inbox);
    const ul = el('ul', 't0-inbox__l', null, inbox);
    if (app.night && WORLD.night && WORLD.night.story) {
      const li = el('li', null, null, ul);
      const b = el('button', 't0-inrow', null, li, { attrs: { type: 'button' } });
      el('p', 't-label', 'НОЧНАЯ ПЕРЕДАЧА', b);
      b.addEventListener('click', () => { if (ctx.lead) ctx.lead.show(WORLD.night.story); });
    }
    if (!c.delivered) el('p', 't-body', EMPTY_LINE.transmissions, inbox);
    const days = (state.data && state.data.days) || [];
    const read = (state.data && state.data.transmissions && state.data.transmissions.read) || [];
    for (let i = c.delivered - 1; i >= 0; i--) {
      const t = WORLD.transmissions[i];
      const li = el('li', null, null, ul);
      const b = el('button', `t0-inrow${read.includes(i) ? '' : ' is-new'}`, null, li, { attrs: { type: 'button' }, data: { i: String(i) } });
      const head = el('p', 't-micro t0-inrow__h', `${fmtDate(days[i] || state.today, 'dd.mm')}  `, b);
      el('span', 't-label', t.from || 'VIN', head);
      if (!read.includes(i)) el('i', 't0-dot t0-dot--ember', null, head);
      el('p', 't-body t0-inrow__t', t.text.length > 34 ? `${t.text.slice(0, 33)}…` : t.text, b);
      b.addEventListener('click', () => {
        if (ctx.lead) ctx.lead.show(t.text);
        state.markRead(i);
        fillInbox();
      });
    }
    S.beaconOn = c.unread > 0;
    if (layout.isPhone && ctx.sheet && S.shown) {
      const peek = el('div');
      el('p', 't-label', `ВХОДЯЩИЕ · ${c.delivered}`, peek);
      const last = c.delivered > 0 ? WORLD.transmissions[c.delivered - 1] : null;
      if (last) el('p', 't-body', last.text.length > 34 ? `${last.text.slice(0, 33)}…` : last.text, peek);
      ctx.sheet.set(inbox, { peek, state: 'peek' });
    }
  }

  // ── the pad ──────────────────────────────────────────────────────────────────────────────────────────────────
  let pts = [], hot = [];
  padEl.addEventListener('pointerdown', (e) => {
    if (Math.hypot(e.clientX - S.cx, e.clientY - S.cy) > S.r || S.drawing) return;
    e.preventDefault();
    try { padEl.setPointerCapture(e.pointerId); } catch (err) { /* synthetic */ }
    pts = [{ x: e.clientX, y: e.clientY }]; hot = [[e.clientX, e.clientY, performance.now()]];
    S.drawing = 'down'; S.idleT = 0;
    S.stroke.setAttribute('d', ''); S.stroke.classList.remove('is-rise'); S.stroke.style.transform = '';
  });
  padEl.addEventListener('pointermove', (e) => {
    if (S.drawing !== 'down') return;
    pts.push({ x: e.clientX, y: e.clientY }); hot.push([e.clientX, e.clientY, performance.now()]);
    S.stroke.setAttribute('d', pts.map((p, i) => `${i ? 'L' : 'M'}${fmt(p.x)} ${fmt(p.y)}`).join(''));
  });
  const release = () => {
    if (S.drawing !== 'down') return;
    S.drawing = 'play';
    const proc = processStroke(pts);
    const norm = normalizeStroke(proc);
    if (proc.length < 2 || norm.length < 2) { S.drawing = null; S.stroke.setAttribute('d', ''); return; }
    S.stroke.setAttribute('d', proc.map((p, i) => `${i ? 'L' : 'M'}${fmt(p.x)} ${fmt(p.y)}`).join(''));
    playStroke(norm, 1200);
    // the visual twin: a beam dot retraces the stroke over 1,200 ms
    S.dot.classList.add('is-on');
    tween(reduced() ? 0 : 1200, (u) => { const q = proc[Math.min(proc.length - 1, Math.floor(u * (proc.length - 1)))]; S.dot.setAttribute('cx', fmt(q.x)); S.dot.setAttribute('cy', fmt(q.y)); }).done.then(() => {
      S.dot.classList.remove('is-on');
      // it transmits: shrinks and rises through the apex as a star (800 ms)
      S.stroke.style.transformOrigin = `${fmt(S.cx)}px ${fmt(S.cy - S.r * 0.62)}px`;
      S.stroke.classList.add('is-rise');
      saveDrawing(norm);
      after(reduced() ? 160 : 820, () => { S.drawing = null; S.stroke.setAttribute('d', ''); S.stroke.classList.remove('is-rise'); draw(); });
    });
  };
  padEl.addEventListener('pointerup', release);
  padEl.addEventListener('pointercancel', release);

  // ── the dial ─────────────────────────────────────────────────────────────────────────────────────────────────
  function drawDial() {
    const { dcx, dcy, dr, a0, a1 } = S;
    const pad = 40;
    const x0 = dcx - dr - pad, y0 = dcy - dr - pad, W = 2 * (dr + pad);
    Object.assign(dialEl.style, { left: `${fmt(x0)}px`, top: `${fmt(y0)}px`, width: `${fmt(W)}px`, height: `${fmt(W)}px` });
    dialSvg.setAttribute('viewBox', `${fmt(x0)} ${fmt(y0)} ${fmt(W)} ${fmt(W)}`);
    dialEl.dataset.cx = fmt(dcx); dialEl.dataset.cy = fmt(dcy); dialEl.dataset.r = fmt(dr); dialEl.dataset.a0 = String(a0); dialEl.dataset.a1 = String(a1);
    clear(dialSvg);
    S.arc = svg('path', { class: 't0-dial__arc' }, dialSvg);
    S.ticks = svg('path', { class: 't0-dial__ticks' }, dialSvg);
    S.nums = svg('g', { class: 't0-dial__nums' }, dialSvg);
    S.needle = svg('path', { class: 't0-dial__needle' }, dialSvg);
    dialRead.style.transform = layout.isPhone ? `translate(${fmt(dcx - 66)}px,${fmt(dcy - dr * 0.44)}px)` : `translate(${fmt(dcx - dr - 40)}px,${fmt(dcy + dr + 26)}px)`;
    renderDial();
  }
  function arcPt(a, r) { return [S.dcx + Math.cos(a * DEG) * r, S.dcy + Math.sin(a * DEG) * r]; }
  function renderDial() {
    const { dr, a0, a1 } = S;
    const st = dialStatic(S.f);
    // the arc breaks into dashes in proportion to the static
    const pa = arcPt(a0, dr), pb = arcPt(a1, dr);
    S.arc.setAttribute('d', `M${fmt(pa[0])} ${fmt(pa[1])}A${dr} ${dr} 0 0 1 ${fmt(pb[0])} ${fmt(pb[1])}`);
    S.arc.style.strokeDasharray = st > 0.02 ? `${fmt(18 * (1 - st) + 2)} ${fmt(10 * st + 1)}` : 'none';
    // the scale turns: the needle sits at the middle angle; 1 px of arc = 0.05
    const mid = (a0 + a1) / 2, pxPerUnit = 20;
    let d = '';
    clear(S.nums);
    const span = ((a1 - a0) * DEG * dr) / pxPerUnit / 2;
    for (let v = Math.ceil(S.f - span); v <= S.f + span; v++) {
      if (v < 0 || v > 99) continue;
      const a = mid + ((v - S.f) * pxPerUnit) / dr / DEG;
      const big = v % 10 === 0, p = arcPt(a, dr), q = arcPt(a, dr - (big ? 12 : 6));
      d += `M${fmt(p[0])} ${fmt(p[1])}L${fmt(q[0])} ${fmt(q[1])}`;
      if (big) { const t = svg('text', { x: arcPt(a, dr - 26)[0], y: arcPt(a, dr - 26)[1], class: 't-micro', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, S.nums); t.textContent = String(v).padStart(2, '0'); }
    }
    S.ticks.setAttribute('d', d);
    const j = reduced() ? 0 : st * 3 * (Math.random() * 2 - 1);
    const n0 = arcPt(mid, dr + 14), n1 = arcPt(mid, dr - 18);
    S.needle.setAttribute('d', `M${fmt(n0[0] + j)} ${fmt(n0[1])}L${fmt(n1[0] + j)} ${fmt(n1[1])}`);
    dialVal.textContent = S.f.toFixed(2).padStart(5, '0');
    dialEl.dataset.value = S.f.toFixed(2);
    dialEl.setAttribute('aria-valuenow', S.f.toFixed(2));
  }
  let dd = null;
  dialEl.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    try { dialEl.setPointerCapture(e.pointerId); } catch (err) { /* synthetic */ }
    dd = { a: Math.atan2(e.clientY - S.dcy, e.clientX - S.dcx) };
    if (ctx.audio && !S.hiss) { S.hiss = ctx.audio.start('dialStatic', { amount: dialStatic(S.f) }); S.carrier = ctx.audio.start('dialCarrier', { amount: 0 }); }
  });
  dialEl.addEventListener('pointermove', (e) => {
    if (!dd) return;
    const a = Math.atan2(e.clientY - S.dcy, e.clientX - S.dcx);
    let da = a - dd.a;
    if (da > Math.PI) da -= 2 * Math.PI; else if (da < -Math.PI) da += 2 * Math.PI;
    dd.a = a;
    const dir = Math.sign(S.a1 - S.a0);
    const px = da * S.dr * dir;
    S.f = Math.max(0, Math.min(99.99, S.f + px * (e.shiftKey ? 0.01 : 0.05)));
  });
  const dup = () => { dd = null; };
  dialEl.addEventListener('pointerup', dup); dialEl.addEventListener('pointercancel', dup);
  dialEl.addEventListener('keydown', (e) => {
    const s = e.shiftKey ? 0.01 : 0.05;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { S.f = Math.min(99.99, Math.round((S.f + s) * 100) / 100); e.preventDefault(); }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { S.f = Math.max(0, Math.round((S.f - s) * 100) / 100); e.preventDefault(); }
  });
  S.dial = createDialLock((f) => {
    S.locked = true;
    if (ctx.audio) ctx.audio.play('beatLock', { lo: 220, hi: 220 * (1 + F() / 100) });
    dialLock.textContent = `ТАЙНАЯ ЧАСТОТА ${F().toFixed(2)}`;
    dialLock.classList.add('is-in');
    if (ctx.lead) ctx.lead.show(WORLD.signal.secret);
    if (ctx.secrets) ctx.secrets.discover('S11', { vars: { freq: F().toFixed(2) }, anchor: { x: S.dcx, y: S.dcy } });
    void f;
  });

  // per frame (only while SIGNAL is shown): the dial, the beacon, the idle ghost
  loop.add((dt) => {
    if (app.room !== 'SIGNAL' || T.lostMode || !S.shown) return;
    if (S.f !== S.lastF || S.locked) { renderDial(); S.lastF = S.f; }
    else if (dialStatic(S.f) > 0.02 && loop.frame % 4 === 0) renderDial();
    S.dial.feed(S.f, dt * 1000);
    if (Math.abs(S.f - F()) > 0.05) { S.locked = false; dialLock.classList.remove('is-in'); }
    if (S.hiss && S.hiss.set) S.hiss.set({ amount: dialStatic(S.f) });
    if (S.carrier && S.carrier.set) S.carrier.set({ amount: Math.max(0, 1 - Math.abs(S.f - F()) / 0.5) });
    if (S.beacon) S.beacon.style.opacity = S.beaconOn ? (loop.now % 1200 < 120 ? '1' : '0.25') : '1';
    if (!S.drawing && !S.ghost) {
      S.idleT += dt * 1000;
      if (S.idleT > 6000) ghostStar();
    }
  }, ORDER.UI);
  function ghostStar() {
    S.ghost = true;
    let d = '';
    for (let k = 0; k <= 5; k++) { const a = -Math.PI / 2 + (k * 4 * Math.PI) / 5; d += `${k ? 'L' : 'M'}${fmt(S.cx + Math.cos(a) * S.r * 0.32)} ${fmt(S.cy + Math.sin(a) * S.r * 0.32)}`; }
    S.ghostP.setAttribute('d', d);
    S.ghostP.classList.remove('is-on'); requestAnimationFrame(() => S.ghostP.classList.add('is-on'));
    after(2600, () => S.ghostP.classList.remove('is-on'));
  }

  const hall = {
    id: 'SIGNAL',
    section: sec,
    show() { S.shown = true; draw(); fillInbox(); S.idleT = 0; S.ghost = false; },
    hide() {
      S.shown = false;
      if (S.hiss && S.hiss.stop) { try { S.hiss.stop(200); } catch (e) { /* voice */ } }
      if (S.carrier && S.carrier.stop) { try { S.carrier.stop(200); } catch (e) { /* voice */ } }
      S.hiss = S.carrier = null;
      if (layout.isPhone && ctx.sheet) { sec.appendChild(inbox); ctx.sheet.set(null); }
    },
    relayout() { draw(); },
    hint(secret) { if (secret === 'S11') { const f0 = S.f; tween(1200, (u) => { S.f = Math.max(0, f0 + Math.sin(u * Math.PI) * 1.2); }).done.then(() => { S.f = f0; }); } },
  };
  ctx.bus.on('night:change', () => { if (app.room === 'SIGNAL' && S.shown) fillInbox(); });
  return hall;
}
