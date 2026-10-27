// t0/t0.js — WP11. «ЧЕРТЁЖ»: the same world, drawn instead of rendered (ARCH §3.15.4, §6.12; ARCH-ADDENDUM X§2.8.3;
// SPEC §12.5, §12.6, §12.4, §10.2; SPEC-ADDENDUM A9.1 T0 column). mountT0(ctx) → T0:
//   root      #t0 (layers: the hall sections, the SVG Key, the DOM rim, the boot layer, the fx twins, the КОДЕКС laws)
//   boot      the SVG Key's side of every boot (t0/boot.js)
//   show      the room's T0 section, 160 ms crossfade (the director calls it at the slice's 140 ms and on arrival)
//   keyScreen the SVG Key's centre + screen radius (S03 circling, WP10)
//   showLost / hideLost   WebGL context loss: T0 CORE over the frozen canvas (on a --void veil) until restored
//   rim       the DOM rim with the full Rim API (t0/rim.js); main.js uses it as ctx.rim in T0
//   twin      the CSS/SVG picture twins createFxT0 (WP12) drives: pause, prosvet, wave, ears, nucleus, close, lockFlash,
//             scaleLabel
// Views installed on app:ready (after initHost): ctx.deeds.setView (КОДЕКС back elevation), ctx.host.lost.setView (the
// SVG mini-Key(s)); the T0 СБОР adapter is attached while the MEMBERS section is shown. In T0 the page keeps
// <html data-night> / <html data-inverted> itself (the WebGL palette module is not running).
import { ROOMS } from '../world/rooms.js';
import { layout } from '../core/layout.js';
import { after, cancelAfter } from '../core/clock.js';
import { state } from '../core/state.js';
import { logOnce } from '../core/env.js';
import { keyboard } from '../nav/keyboard.js';
import { el } from './dom.js';
import { createKeyLive } from './keyLive.js';
import { createDomRim } from './rim.js';
import { createT0Boot } from './boot.js';
import { createCore } from './core.js';
import { HALL_FACTORIES } from './halls.js';
import { createLostView } from './lostView.js';
import { installT0Secrets } from './secrets.js';

export function mountT0(ctx) {
  const root = document.getElementById('t0');
  if (!root) throw new Error('#t0 missing');
  root.textContent = '';
  root.classList.add('t0');
  const owner = ctx.app.tier === 'T0';
  const hallsLayer = el('div', 't0-halls', null, root);
  const sections = {};
  const OWN_POINTER = 'button:not(.t0-colproxy),a,input,[data-qa="pad"],[data-qa="dial"],[data-qa="ws-grid"],.t0-held__stage';
  const T = {
    root, ctx, lostMode: false,
    section(id) {
      if (sections[id]) return sections[id];
      const s = el('section', 't0-hall', null, hallsLayer, { qa: 't0-hall', data: { room: id } });
      s.hidden = true;
      // WP0's surface handler captures every press inside #t0 (setPointerCapture on #t0), which would retarget the
      // click of a DOM control to #t0 and steal the moves of the pad / dial / grid; their own presses stop here.
      s.addEventListener('pointerdown', (e) => { if (e.target && e.target.closest && e.target.closest(OWN_POINTER)) e.stopPropagation(); });
      sections[id] = s;
      return s;
    },
  };
  const L = createKeyLive(ctx, root);
  T.key = L;
  const rim = createDomRim(root, { anchorY: () => (L.annotY || layout.h * 0.8) + 16, owner });
  T.rim = rim;
  L.onAnnotate = () => rim.place();
  const bootT = createT0Boot(ctx, L, root);
  const halls = { CORE: createCore(ctx, T) };
  T.halls = halls;
  const fxLayer = el('div', 't0-fx', null, root, { attrs: { 'aria-hidden': 'true' } });
  const scaleL = el('p', 't-label t0-scalelabel', '×1 000', fxLayer);
  const lostView = createLostView(ctx, T);
  let current = null, currentHash = '', fadeTimer = 0, earsTimer = 0;

  function hallOf(id) {
    if (halls[id]) return halls[id];
    const f = HALL_FACTORIES[id];
    if (!f) return null;
    try { halls[id] = f(ctx, T); } catch (e) { logOnce(`t0:${id}`, `T0 hall ${id} failed`, e); halls[id] = null; }
    return halls[id];
  }
  function call(h, m, a) { if (!h || typeof h[m] !== 'function') return undefined; try { return h[m](a); } catch (e) { logOnce(`t0:${h.id}:${m}`, e); return undefined; } }

  /** Renders that room's section (160 ms crossfade); the same route twice is a no-op. */
  function show(route, force) {
    const id = route && ROOMS[route.room] ? route.room : 'CORE';
    const hash = route && route.hash ? route.hash : `#/${ROOMS[id].slug}${route && route.sub ? `/${route.sub}` : ''}`;
    if (!force && hash === currentHash && current === id) return;
    const prev = current;
    currentHash = hash;
    const h = hallOf(id);
    if (prev !== id) {
      if (prev) {
        const ph = halls[prev];
        call(ph, 'hide');
        const ps = sections[prev];
        if (ps) {
          ps.classList.remove('is-in');
          cancelAfter(fadeTimer);
          fadeTimer = after(160, () => { if (current !== prev) ps.hidden = true; });
        }
      }
      current = id;
      const s = (h && h.section) || T.section(id);
      s.hidden = false;
      (void s.offsetWidth, s.classList.add('is-in'));
      root.dataset.room = id;
      rim.setAlpha(id === 'CORE' ? 1 : 0);
    }
    call(h, 'show', route || { room: id, sub: null, hash });
  }

  const t0 = {
    root,
    rim,
    boot(opts) { return bootT.boot(opts || {}); },
    show(route) { if (T.lostMode) { T.pendingRoute = route; return; } show(route, false); },
    keyScreen() { return L.screen(); },
    showLost() {
      if (T.lostMode) return;
      T.pendingRoute = ctx.app.route;
      T.lostMode = true;
      root.hidden = false;
      root.classList.add('is-lost');
      show({ room: 'CORE', sub: null, hash: '#/core' }, true);
      if (!L.lit) L.ignite(false);
      rim.showName();
      L.setRing(true);
      L.px.classList.add('is-drawn');
    },
    hideLost() {
      if (!T.lostMode) return;
      T.lostMode = false;
      root.classList.remove('is-lost');
      if (ctx.app.tier !== 'T0') { root.hidden = true; if (current) { call(halls[current], 'hide'); if (sections[current]) sections[current].hidden = true; } current = null; currentHash = ''; }
      else show(T.pendingRoute || ctx.app.route, true);
    },
    /** X§2.8.3 picture twins (createFxT0, WP12). */
    twin(kind, opts = {}) {
      switch (kind) {
        case 'pause': L.pause(!!opts.on); root.classList.toggle('is-paused', !!opts.on); break;
        case 'prosvet': L.prosvet(); break;
        case 'wave': L.wave(opts.ms || 875); break;
        case 'ears': {
          const px = Math.max(0, +opts.blurPx || 0), ms = Math.max(0, +opts.ms || 0);
          root.style.transition = 'none';
          root.style.filter = px > 0 ? `blur(${px}px)` : '';
          cancelAfter(earsTimer);
          earsTimer = after(16, () => { root.style.transition = `filter ${ms}ms linear`; root.style.filter = 'blur(0px)'; earsTimer = after(ms + 20, () => { root.style.filter = ''; root.style.transition = ''; }); });
          break;
        }
        case 'nucleus': L.nucleus(opts.level); if (opts.level >= 1) L.nucleusFlash(); break;
        case 'close': L.close(opts.phase, opts.t01); if (opts.phase === 'asleep' || opts.phase === 'zero') root.classList.add('is-asleep'); break;
        case 'lockFlash': L.lockFlash(opts.i | 0); break;
        case 'scaleLabel': if (!document.querySelector('#fx .fx-rm')) { scaleL.classList.add('is-on'); after(1200, () => scaleL.classList.remove('is-on')); } break;
        default: break;
      }
    },
  };

  // ── bus ─────────────────────────────────────────────────────────────────────────────────────────────────────
  const html = document.documentElement;
  const syncNight = () => { if (ctx.app.tier !== 'T0') return; if (ctx.app.night) html.setAttribute('data-night', ''); else html.removeAttribute('data-night'); };
  const syncInvert = () => { if (ctx.app.tier !== 'T0') return; if (ctx.app.inverted) html.setAttribute('data-inverted', ''); else html.removeAttribute('data-inverted'); };
  syncNight(); syncInvert();
  ctx.bus.on('night:change', syncNight);
  ctx.bus.on('invert:change', (e) => { if (e && typeof e.inverted === 'boolean') ctx.app.inverted = e.inverted; syncInvert(); });
  ctx.bus.on('layout:change', () => {
    L.relayout(); rim.place();
    for (const id in halls) call(halls[id], 'relayout');
  });
  ctx.bus.on('nadir:open', () => L.crackN());
  ctx.bus.on('boot:ignite', () => { root.classList.remove('is-asleep'); L.setLit(state.litNodes); });
  ctx.bus.on('boot:done', () => { if (!current) show({ room: ctx.app.room, sub: ctx.app.route.sub, hash: ctx.app.route.hash }, true); });
  ctx.bus.on('app:ready', () => {
    try { if (ctx.deeds && ctx.deeds.setView && owner) ctx.deeds.setView(halls.CORE.codexView); } catch (e) { logOnce('t0:codex', e); }
    try { if (ctx.host && ctx.host.lost && ctx.host.lost.setView && owner) ctx.host.lost.setView(lostView); } catch (e) { logOnce('t0:lost', e); }
  });
  installT0Secrets(ctx, T);
  // keys for the current T0 hall (Escape out of a focus, …) — offered by nav/keyboard.js through the input stack
  keyboard.pushHandler((e) => {
    if (ctx.app.tier !== 'T0' || T.lostMode || !current || ctx.app.booting || (ctx.director && ctx.director.busy())) return false;
    const t = e.target;
    if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName || '')) return false;
    if (current === 'CORE') return !!halls.CORE.onKey(e);
    return !!call(halls[current], 'onKey', e);
  });

  L.setLit(state.litNodes);
  root.hidden = !owner;
  if (owner) show({ room: 'CORE', sub: null, hash: '#/core' }, true);
  else L.show(false);
  return t0;
}
