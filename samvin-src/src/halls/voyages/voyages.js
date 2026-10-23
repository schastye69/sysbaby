// halls/voyages/voyages.js — WP6: VOYAGES «ВЫЛАЗКИ», ▽ −460.00 (SPEC §6.3, §7.4 «Капля», §7.6 «ШЛЮЗ», §2.7, §4.5,
// §8.3, §12.2, §12.4; SPEC-ADDENDUM A3.3, A3.4, A11.6; ARCH §6.7 + ARCH-ADDENDUM X§5.3 WP6).
//
// Modes: 'field' (the polar survey floor with its hatches; desktop wheel altitude 60–140 m; phone: a horizontal swipe
// moves the selection along the spiral and the camera follows it) → 'in' (ШЛЮЗ, 1,400 ms) → 'chamber' (terrain,
// orbit, readable block, probe) → 'out' (900 ms) → 'field'. Reduced motion: a 160 ms crossfade with a camera cut.
// Mission chambers are routes (#/voyages/<code>); proposal chambers (A3.4) never enter a URL and close with Esc, a
// tap on the canvas or the sheet swipe.
import { Vector3 } from 'three';
import { createHatchField } from './hatches.js';
import { createTags } from './tags.js';
import { createShaft, SHLUZ_MS, BACK_MS } from './shaft.js';
import { createChamberCtl, CHAMBER_FOG } from './chamberCtl.js';
import { missionView, collectReturnedProbes, collectDecoded, takeFreshReturns } from './missionModel.js';
import { fieldPose, slotPoint, chamberPose, chamberAt, inFrame, CHAMBER_AIM, ORBIT } from './layout.js';
import { EMPTY_LINE } from '../../data/world.js';
import { CAMERA } from '../../core/tokens.js';
import { ENV } from '../../core/env.js';
import { clamp01 } from '../../core/ease.js';
import { beamWrite } from '../../ui/text.js';
import { vibrate, VIBE } from '../../ui/tactile.js';

const RM_MS = 160, CUT_MS = 80;
const ALT = CAMERA.voyages.altRange;
const smooth = (x) => { const t = clamp01(x); return t * t * (3 - 2 * t); };

/** @returns {Hall} */
export function createVoyagesHall(hctx) {
  const meta = hctx.meta;
  let field = null, tags = null, shaft = null, chamber = null;
  let views = [], built = false, current = false;
  let mode = 'field', shT = 0, outFrom = SHLUZ_MS, outMs = BACK_MS, cutT = -1, cutTo = null;
  let alt = CAMERA.voyages.pos[1], altS = alt, sel = 0, hovered = -1, ringTick = 0, irisStep = 0, startAp = 0;
  let incoming = null;                     // sub of the travel now arriving (deep link into a chamber)
  const returnsQ = [], decodeQ = [];
  let retT = 0, decT = -1, drop = null, now = 0, lastT = -1, lastLive = -1, mism = 0;
  const selP = { x: 0, z: 0 }, selS = { x: 0, z: 0 }, _pt = { x: 0, z: 0 }, cc0 = { x: 0, z: 0, ux: 0, uz: -1 };
  const live = { pos: new Vector3(), target: new Vector3(), fov: CAMERA.fov, offsetY: 0, roll: 0 };
  const snap = { pos: new Vector3(), target: new Vector3(), fov: CAMERA.fov, offsetY: 0, roll: 0 };
  const poseOut = { pos: new Vector3(), target: new Vector3(), fov: CAMERA.fov, offsetY: 0, roll: 0 };
  const offs = [];
  const gestLog = [];
  let swiped = false, stale = false;
  const phone = () => hctx.layout.kind === 'phone';

  // ── DOM: the verb (A3.4), the calm empty line (§4.5), the phone peek (rail + verb) ──
  const left = document.createElement('div');
  left.className = 'vy-left';
  const empty = document.createElement('p');
  empty.className = 't-body vy-empty scrim';
  empty.textContent = EMPTY_LINE.missions;
  const verbBox = document.createElement('div');
  verbBox.className = 'vy-verbs';
  const peek = document.createElement('div');
  peek.className = 'vy-peek';

  let selfSheet = false;
  /** The hall's own sheet writes (their 'closed' is never read as the visitor's swipe-down). */
  function sheetSet(c, o) { selfSheet = true; try { hctx.sheet.set(c, o); } finally { selfSheet = false; } }

  /** The datum title steps aside while the dive and the chamber's block hold the screen (voyages.css). */
  function datumAside(on) { try { document.body.classList.toggle('vy-chamber', on); } catch (e) { /* no DOM */ } }

  /** Index of mission `code` in display order (−1 if none) — a plain loop: pose() and enter() are hot paths (G9). */
  function missionIndex(code) {
    if (code == null) return -1;
    const ms = hctx.world.missions;
    for (let i = 0; i < ms.length; i++) if (ms[i].code === code) return i;
    return -1;
  }

  function proposals() { const p = hctx.host && hctx.host.proposals; return p ? p.list() : []; }

  function computeViews() {
    const out = [];
    for (const m of hctx.world.missions) {
      const v = missionView(m);
      if (v.decodeReady) out.push({ ...v, state: 'locked', label: 'СИГНАЛ ЗАШИФРОВАН 100%', numberShown: '0??', pending: true });
      else out.push(v);
    }
    for (const p of proposals()) out.push({ code: p.id, state: 'proposal', title: p.title, where: p.where, proposal: p });
    return out;
  }

  // The verb (A3.4) and its MICRO: two persistent nodes (never re-created, so a click can never land on a stale one).
  const verb = document.createElement('button');
  verb.type = 'button';
  verb.className = 'verb t-label vy-verb';
  verb.dataset.qa = 'proposal-verb';
  verb.textContent = 'ПРЕДЛОЖИТЬ ВЫЛАЗКУ →';
  verb.addEventListener('click', () => { if (hctx.host && hctx.host.proposals) hctx.host.proposals.openSheet(); });
  const full = document.createElement('p');
  full.className = 't-micro vy-full';
  full.dataset.qa = 'proposal-full';
  full.textContent = 'ПРЕДЛОЖЕНИЙ 3 · ЖДУТ ПАПУ';
  verbBox.append(verb, full);
  function renderVerb() {
    const many = proposals().length >= 3;
    verb.hidden = many;
    full.hidden = !many;
  }

  function placeDom() {
    empty.hidden = hctx.world.missions.length > 0;
    if (phone()) {
      peek.textContent = '';
      peek.append(tags.rail, empty, verbBox);
      if (left.parentNode) left.remove();
      if (current && mode === 'field') sheetSet(null, { peek, state: 'peek' });
    } else {
      left.append(empty, verbBox);
      if (left.parentNode !== hctx.section) hctx.section.appendChild(left);
    }
    tags.setPhone(phone());
  }

  function refresh() {
    views = computeViews();
    field.setHatches(views.map((v) => ({ code: v.code, state: v.state })));
    tags.setViews(views);
    sel = Math.min(sel, Math.max(0, views.length - 1));
    tags.select(sel);
    renderVerb();
  }

  function setHover(k) {
    if (k === hovered) return;
    if (hovered >= 0) field.hover(hovered, false);
    hovered = k;
    if (k >= 0) { field.hover(k, true); hctx.audio.play('hoverTick', { x: tags.screenX(k) }); }
    if (phone() && sel >= 0) field.hover(sel, true);
  }

  function select(k) {
    if (!views.length) return;
    const n = Math.max(0, Math.min(views.length - 1, k));
    if (n === sel) return;
    field.hover(sel, false);
    sel = n;
    tags.select(sel);
    field.hover(sel, true);
    hctx.audio.play('tick', {});
    vibrate(VIBE.tick);
  }

  function activate(k) {
    const v = views[k];
    if (!v || mode !== 'field') return;
    if (v.state === 'locked' || v.state === 'sealed') {
      field.shudder(k);
      hctx.audio.play('lockedThud', {});
      vibrate(VIBE.locked);
      const m = hctx.world.missions.find((x) => x.code === v.code);
      const text = v.pending ? 'Расшифровка идёт. Возвращайся завтра — будет больше.' : (missionView(m).lockedText || '');
      tags.note(k, text, 4000, now);
      return;
    }
    hctx.audio.play('select', {});
    if (v.state === 'proposal') { openProposal(k); return; }
    hctx.director.go(`#/voyages/${v.code}`, { source: 'hall' });
  }

  // ── ШЛЮЗ in / out ──
  function startIn(k) {
    slotPoint(k, _pt);
    shaft.start(live, k, _pt.x, _pt.z, chamber.terrain);
    mode = 'in'; shT = 0; ringTick = 0; irisStep = 0;
    startAp = field.hatches[k] ? field.hatches[k].ap : 0;
    tags.setAlpha(0); left.style.opacity = '0';
    datumAside(true);
    if (phone()) sheetSet(null);
  }
  function enterChamberNow() {
    mode = 'chamber';
    datumAside(true);
    const k = chamber.index;
    field.setFieldAlpha(0);
    field.setOpenOverride(k, -1);
    for (let q = 0; q < views.length; q++) field.setHatchAlpha(q, 1);
    tags.setAlpha(0); left.style.opacity = '0';
    shaft.hide();
    if (chamber.terrain) chamber.terrain.setAlpha(1);
    hctx.fog.set(CHAMBER_FOG);
    chamber.showBlock(false);
  }
  function startOut(ms) {
    chamber.hideBlock();
    if (mode === 'chamber') { chamber.pose(snap); outFrom = SHLUZ_MS; } else { snap.pos.copy(live.pos); snap.target.copy(live.target); outFrom = shT; }
    fieldPose(hctx.layout.kind, altS, selS, poseOut);
    slotPoint(chamber.index, _pt);
    shaft.start(poseOut, chamber.index, _pt.x, _pt.z, chamber.terrain);
    mode = 'out'; shT = 0; outMs = ms * (outFrom / SHLUZ_MS);
    field.setFieldAlpha(1);
  }
  function backToField() {
    mode = 'field';
    shaft.hide();
    field.setFieldAlpha(1);
    for (let q = 0; q < views.length; q++) { field.setHatchAlpha(q, 1); field.setOpenOverride(q, -1); }
    chamber.release();
    if (stale) { stale = false; refresh(); }
    tags.setAlpha(1); left.style.opacity = '';
    datumAside(false);
    hctx.fog.set(meta.fog);
    if (phone()) sheetSet(null, { peek, state: 'peek' });
  }
  function openProposal(k) {
    const v = views[k];
    chamber.prepare(v.code, k, v.proposal);
    if (ENV.reducedMotion) { cutT = 0; cutTo = 'chamber'; mode = 'cut'; tags.setAlpha(0); left.style.opacity = '0'; return; }
    startIn(k);
  }
  function closeProposal() {
    if (ENV.reducedMotion) { chamber.hideBlock(); cutT = 0; cutTo = 'field'; mode = 'cut'; return; }
    startOut(BACK_MS);
  }

  function playDecode(code) {
    const k = views.findIndex((v) => v.code === code);
    const m = hctx.world.missions.find((x) => x.code === code);
    if (k < 0 || !m) return;
    const v = missionView(m);
    views[k] = v;
    field.setHatches(views.map((x) => ({ code: x.code, state: x.state })));
    field.decodeOpen(k);
    const b = tags.relabel(k, v);
    if (b) {                                       // one beam head at a time: the number, then the title (§2.2 BEAM WRITE)
      const spans = Array.from(b.querySelectorAll('.vy-tag-line, .vy-tag-title'));
      const texts = spans.map((x) => x.textContent);
      for (const x of spans) x.style.visibility = 'hidden';           // the words are there (screen readers), unlit
      spans.reduce((p, x, i) => p.then(() => { x.style.visibility = ''; return beamWrite(x, texts[i], { cps: 22 }); }), Promise.resolve());
    }
    hctx.status.say('mission.decoded', { code }, { force: true });   // the line answers the decode he is watching
    decT = 1200;
    decodeQ.unshift({ settle: k });
  }

  const hall = {
    id: hctx.id,
    build() {
      if (hctx.shell) hctx.shell.setDeckVisible(false);
      const cap = hctx.world.missions.length + 3;
      field = createHatchField(cap);
      shaft = createShaft();
      if (hctx.group) hctx.group.add(field.lines.mesh, field.bead.object, shaft.lines.mesh);
      tags = createTags(hctx, { onActivate: activate, onHover: (k, on) => setHover(on ? k : -1), isPhone: phone() });
      hctx.section.appendChild(tags.root);
      chamber = createChamberCtl(hctx);
      chamber.onRemoved = () => { stale = true; closeProposal(); };
      refresh();
      placeDom();
      tags.setAlpha(0);
      offs.push(hctx.bus.on('proposal:saved', ({ id }) => {
        refresh();
        const k = views.findIndex((v) => v.code === id);
        if (k >= 0 && field.hatches[k]) {
          field.hatches[k].build = 0;
          // the new hatch lands where he can see it: desktop rises (wheel altitude) until its slot is on the sheet,
          // phone selects it (the camera follows); the bead waits for the camera
          let wait = 0;
          if (phone()) { select(k); wait = 500; } else {
            slotPoint(k, _pt);
            let a = alt;
            while (a < ALT[1] && !inFrame(_pt.x, _pt.z, a, hctx.layout.w, hctx.layout.h)) a = Math.min(ALT[1], a + 5);
            if (a !== alt && inFrame(_pt.x, _pt.z, a, hctx.layout.w, hctx.layout.h)) { alt = a; wait = 600; }
          }
          drop = { k, t: -wait };
        }
      }));
      offs.push(hctx.bus.on('travel:start', ({ to }) => { incoming = to && to.room === hctx.id ? to.sub : null; }));
      offs.push(hctx.bus.on('visibility', ({ hidden }) => { if (hidden) chamber.cancelHolds(); }));
      offs.push(hctx.sheet.onChange((s) => {
        if (!current || s !== 'closed' || !phone() || selfSheet || chamber.sheetBusy) return;
        if (mode === 'chamber' && chamber.kind === 'proposal') closeProposal();
        else if (mode === 'chamber') hctx.director.go('#/voyages', { source: 'hall' });
      }));
      hctx.section.__qa = () => ({ mode, sel, alt: altS, decT, decQ: decodeQ.length, lastT, gest: gestLog.slice(), chamber: chamber.debug(), views: views.map((v) => `${v.code}:${v.state}`) });
      built = true;
    },
    pose(sub) {
      const k = missionIndex(sub);
      if (k >= 0) { chamberAt(k, cc0); return chamberPose(cc0.x, CHAMBER_AIM, cc0.z, 0, ORBIT.pitch, poseOut, cc0.ux, cc0.uz); }
      return fieldPose(hctx.layout.kind, CAMERA.voyages.pos[1], null, poseOut);
    },
    livePose(out, dt) {
      if (!built) return false;
      if (mode === 'field' || (mode === 'cut' && cutTo === 'chamber')) {
        // the follow eases on loop time (a slow frame still settles in ≈ 700 ms, ω 6 as SPEC's heavy spring)
        const ln = hctx.loop.now, real = lastLive < 0 ? dt : Math.min(0.25, Math.max(0, (ln - lastLive) / 1000));
        lastLive = ln;
        const k = 1 - Math.exp(-real * 6);
        altS += (alt - altS) * k;
        if (views.length) slotPoint(sel, selP); else { selP.x = 0; selP.z = 0; }
        selS.x += (selP.x - selS.x) * k; selS.z += (selP.z - selS.z) * k;
        fieldPose(hctx.layout.kind, altS, selS, out);
      } else if (mode === 'in') shaft.pose(shT, out);
      else if (mode === 'out') {
        shaft.pose(outFrom * (1 - clamp01(shT / Math.max(1, outMs))), out);
        const b = smooth(shT / 200);
        if (b < 1) { out.pos.lerpVectors(snap.pos, out.pos, b); out.target.lerpVectors(snap.target, out.target, b); }
      } else chamber.pose(out);
      live.pos.copy(out.pos); live.target.copy(out.target);
      return true;
    },
    enter(u) {
      if (!built) return;
      const ki = missionIndex(incoming);
      if (ki >= 0) {
        chamber.prepare(incoming, ki);
        field.setFieldAlpha(0);
        if (chamber.terrain) chamber.terrain.setAlpha(clamp01(u));
        tags.setAlpha(0);
        return;
      }
      field.setFieldAlpha(1);
      field.build(u);
      const a = u >= 0.7 ? (u - 0.7) / 0.3 : 0;
      tags.setAlpha(a); left.style.opacity = String(a);
    },
    exit(u) {
      if (!built) return;
      const a = clamp01(1 - 2 * u);
      if (mode === 'field') tags.setAlpha(a);
      left.style.opacity = String(a);
      chamber.setBlockAlpha(a);
      field.setFieldAlpha(mode === 'field' ? 1 - u : 0);
      if (chamber.terrain) chamber.terrain.setAlpha(1 - u);
    },
    arrive(info) {
      current = true;
      if (mode !== 'field') { chamber.hideBlock(); backToField(); }   // back within the 300 ms release window
      mode = 'field';
      const deep = !!(incoming && info.sub);
      incoming = null;
      if (deep) { field.built(); } else { field.build(1); tags.setAlpha(1); left.style.opacity = ''; }
      placeDom();
      for (const code of collectReturnedProbes()) { hctx.status.say('probe.back', { code }); hctx.bus.emit('probe:back', { code }); }
      for (const code of takeFreshReturns()) { const k = views.findIndex((v) => v.code === code); if (k >= 0) returnsQ.push(k); }
      retT = 0;
      for (const code of collectDecoded()) decodeQ.push(code);
      if (decodeQ.length) decT = 600;
      if (!deep) hctx.fog.set(meta.fog);
    },
    depart() {
      current = false;
      datumAside(false);
      chamber.cancelHolds();
      if (phone()) sheetSet(null);
      hctx.datum.setGiant(null);
      setHover(-1);
      returnsQ.length = 0;
      field.returnDot(-1, 1);
    },
    setSub(s, o = {}) {
      if (!built) return 0;
      const rm = ENV.reducedMotion;
      if (s == null) {
        if (mode === 'field') return 0;
        if (o.instant) { chamber.hideBlock(); backToField(); return 0; }
        if (rm) { chamber.hideBlock(); cutT = 0; cutTo = 'field'; mode = 'cut'; return RM_MS; }
        startOut(BACK_MS);
        return BACK_MS;
      }
      const k = missionIndex(s);
      if (k < 0) return false;
      if ((mode === 'chamber' || mode === 'in') && chamber.code === s) return 0;
      if (mode === 'chamber') chamber.hideBlock();
      chamber.prepare(s, k);
      if (o.instant) { enterChamberNow(); return 0; }
      if (rm || mode !== 'field') { cutT = 0; cutTo = 'chamber'; mode = 'cut'; tags.setAlpha(0); left.style.opacity = '0'; return RM_MS; }
      if (phone()) select(k);
      startIn(k);
      return SHLUZ_MS;
    },
    update(dt, t) {
      if (!built) return;
      // Timelines run on loop time (ARCH §6.1.6 A8: wall-clock exact on a slow GPU); dt (≤ 0.05 s) only for easing.
      const ms = lastT < 0 ? 0 : Math.max(0, Math.min(250, t - lastT));
      lastT = t;
      now = t;
      if (mode === 'in') {
        shT += ms;
        const k = chamber.index;
        const step = Math.round(shaft.irisOpen(shT) * 8);
        if (step > irisStep) { irisStep = step; hctx.audio.play('tick', { n: step }); }
        field.setOpenOverride(k, Math.max(startAp, shaft.irisOpen(shT)));
        const fade = 1 - smooth((shT - 600) / 500);
        for (let q = 0; q < views.length; q++) field.setHatchAlpha(q, q === k ? 1 - smooth((shT - 1000) / 250) : fade);
        const rp = shaft.ringPassed(shT);
        if (rp > ringTick) { ringTick = rp; hctx.audio.play('strutTick', {}); }
        shaft.rings(shT);
        if (chamber.terrain) chamber.terrain.setAlpha(smooth((shT - 1150) / 250));
        hctx.fog.set(meta.fog + (CHAMBER_FOG - meta.fog) * smooth((shT - 900) / 500));
        if (shT >= SHLUZ_MS) enterChamberNow();
      } else if (mode === 'out') {
        shT += ms;
        const tt = outFrom * (1 - clamp01(shT / Math.max(1, outMs)));
        const k = chamber.index;
        field.setOpenOverride(k, shaft.irisOpen(tt));
        const fade = 1 - smooth((tt - 600) / 500);
        for (let q = 0; q < views.length; q++) field.setHatchAlpha(q, q === k ? 1 - smooth((tt - 1000) / 250) : fade);
        shaft.rings(tt);
        if (chamber.terrain) chamber.terrain.setAlpha(smooth((tt - 1150) / 250));
        hctx.fog.set(meta.fog + (CHAMBER_FOG - meta.fog) * smooth((tt - 900) / 500));
        if (shT >= outMs) backToField();
      } else if (mode === 'cut') {
        cutT += ms;
        if (cutT >= CUT_MS) { if (cutTo === 'chamber') enterChamberNow(); else backToField(); }
      }
      if (decT >= 0 && mode === 'field') {
        decT -= ms;
        if (decT < 0) {
          const next = decodeQ.shift();
          if (next && typeof next === 'object') { field.decodeSettle(next.settle); decT = decodeQ.length ? 200 : -1; }
          else if (next) playDecode(next);
        }
      }
      if (returnsQ.length && mode === 'field') {
        retT += ms;
        field.returnDot(returnsQ[0], retT / 1000);
        if (retT >= 1000) { hctx.audio.play('probeReturn', {}); returnsQ.shift(); retT = 0; field.returnDot(-1, 1); }
      }
      if (drop) {
        drop.t += ms;
        const s = clamp01(drop.t / (ENV.reducedMotion ? RM_MS : 600));
        const h = field.hatches[drop.k];
        if (h) {
          h.build = ENV.reducedMotion ? s : clamp01((drop.t - 420) / 180);
          if (!ENV.reducedMotion) {
            field.bead.setColor('silver');
            field.bead.object.position.set(h.x * Math.min(1, s / 0.7), 10 * (1 - s * s), h.z * Math.min(1, s / 0.7));
            field.bead.setIntensity(s < 0.7 ? 0.8 : 0.8 * (1 - (s - 0.7) / 0.3));
          }
        }
        if (s >= 1) {
          field.bead.setIntensity(0); field.bead.setColor('ember');
          const pan = Math.max(-1, Math.min(1, (tags.screenX(drop.k) / Math.max(1, hctx.layout.w)) * 2 - 1));
          hctx.audio.play('latch', { gen: 2, pan });
          drop = null;
        }
      }
      // Reconcile with the route: a focus the director cancelled (the same hash asked for again mid-ШЛЮЗ) never calls
      // setSub, so a mismatch that outlives 300 ms snaps the hall to the route the address bar shows.
      if (current && (mode === 'field' || mode === 'chamber') && chamber.kind !== 'proposal' && hctx.app.phase === 'idle') {
        const cur = hctx.director.current;
        const want = cur && cur.room === hctx.id && missionIndex(cur.sub) >= 0 ? cur.sub : null;
        const have = mode === 'chamber' ? chamber.code : null;
        if (want !== have) { mism += ms; if (mism > 300) { mism = 0; hall.setSub(want, { instant: true }); } } else mism = 0;
      } else mism = 0;
      field.update(dt, t);
      chamber.update(dt, ms);
      if (mode === 'field') tags.update(field.hatches, dt, t, ms);
    },
    onGesture(g) {
      if (__DEV__) { gestLog.push(`${g.type}:${g.dir || ''}:${mode}:${current}`); if (gestLog.length > 24) gestLog.shift(); }
      if (!current || !built) return false;
      if (mode === 'chamber') {
        if (g.type === 'tap' && chamber.kind === 'proposal') { closeProposal(); return true; }
        return chamber.drag(g) || g.type === 'wheel';
      }
      if (mode !== 'field') return g.type === 'tap' || g.type === 'wheel';
      switch (g.type) {
        case 'wheel':
          if (phone()) return false;
          alt = Math.max(ALT[0], Math.min(ALT[1], alt + g.deltaY * 0.08));
          return true;
        case 'hover': if (!phone()) setHover(tags.hit(g.x, g.y)); return false;
        case 'leave': setHover(-1); return false;
        case 'tap': {
          const k = tags.hit(g.x, g.y);
          if (k < 0) return false;
          if (phone() && k !== sel) { select(k); return true; }
          activate(k);
          return true;
        }
        case 'dragend':
          // a horizontal stroke (≥ 40 px, mostly sideways) is the swipe along the spiral, however slowly it ends
          if (!phone() || Math.abs(g.tx) < 40 || Math.abs(g.tx) < Math.abs(g.ty) * 1.2) return false;
          select(sel + (g.tx < 0 ? 1 : -1));
          swiped = true;
          return true;
        case 'swipe':
          if (swiped) { swiped = false; return true; }
          if (!phone() || (g.dir !== 'left' && g.dir !== 'right')) return false;
          select(sel + (g.dir === 'left' ? 1 : -1));
          return true;
        case 'down': swiped = false; return false;
        default: return false;
      }
    },
    onKey(e) {
      if (!current || !built) return false;
      if (e.key === 'Escape') {
        if (mode === 'field') return false;
        if (chamber.kind === 'proposal') closeProposal();
        else hctx.director.go('#/voyages', { source: 'kbd' });
        return true;
      }
      if (mode !== 'field' || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return false;
      const d = e.key === 'ArrowRight' ? 1 : -1;
      if (phone()) { select(sel + d); return true; }
      const at = document.activeElement && document.activeElement.closest ? document.activeElement.closest('.vy-tag') : null;
      let k = -1;
      for (let q = 0; q < views.length; q++) if (tags.tagEl(q) === at) k = q;
      const nk = k < 0 ? 0 : Math.max(0, Math.min(views.length - 1, k + d));
      const b = tags.tagEl(nk);
      if (b) b.focus();
      return true;
    },
    resize() { if (!built) return; tags.resize(); placeDom(); },
    lostSpots() {
      // A5.1 / X§2.4.5: 6 points 9–14 m in front of the rest camera, inside the central 60 % of the rest view, in its
      // right part (the left column holds the readable blocks; the phone peek sits at the bottom). PURE.
      const p = hall.pose(null);
      const f = new Vector3().subVectors(p.target, p.pos).normalize();
      const r = new Vector3(-f.z, 0, f.x).normalize();
      const u = new Vector3().crossVectors(r, f).normalize();
      const asp = hctx.layout.w / Math.max(1, hctx.layout.h);
      const tv = Math.tan((p.fov * Math.PI) / 360), th = tv * asp;
      const spots = phone()
        ? [[9.5, -0.25, 0.30], [11, 0.2, 0.42], [12.5, -0.1, 0.12], [10, 0.28, 0.18], [13.5, 0.05, 0.36], [11.8, -0.3, 0.05]]
        : [[9.5, 0.15, 0.30], [11, 0.45, 0.20], [12.5, 0.30, -0.10], [10, 0.55, 0.40], [13.5, 0.08, 0.05], [11.8, 0.40, -0.25]];
      return spots.map(([d, nx, ny]) => new Vector3().copy(p.pos).addScaledVector(f, d)
        .addScaledVector(r, nx * d * th).addScaledVector(u, ny * d * tv));
    },
    dispose() {
      for (const off of offs) { try { off(); } catch (e) { /* already gone */ } }
      offs.length = 0;
      if (chamber) chamber.dispose();
      if (tags) tags.dispose();
      if (field) field.dispose();
      if (shaft) shaft.dispose();
      left.remove(); peek.remove();
      if (current && phone()) sheetSet(null);
      if (hctx.shell) hctx.shell.setDeckVisible(true);
      if (current) datumAside(false);
      current = false; built = false;
    },
  };
  return hall;
}
