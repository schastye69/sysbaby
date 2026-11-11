// secrets/util.js — small shared helpers of WP10's living-world modules (no state of their own beyond the ctx ref).
import { WORLD } from '../data/world.js';
import { app } from '../core/store.js';
import { ENV } from '../core/env.js';
import { layout } from '../core/layout.js';
import { logOnce } from '../core/env.js';

export const W = { ctx: null };
export const has = (o, m) => !!o && typeof o[m] === 'function';
export const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const easeOut = (t) => 1 - (1 - t) * (1 - t) * (1 - t);
export const reduced = () => !!ENV.reducedMotion;
export const isT0 = () => app.tier === 'T0' || !(W.ctx && W.ctx.renderer);
export const isPhone = () => !!layout.isPhone;

/** {name} = WORLD.operator.name as written («Сэм»); status copy is lowercase except the name (SPEC §2.2 STATUS). */
export const nameVars = () => ({ name: WORLD.operator.name });
export const NAME = () => WORLD.operator.name;

export function say(key, vars, opts) {
  const s = W.ctx && W.ctx.status;
  if (has(s, 'say')) { try { s.say(key, vars || {}, opts || {}); } catch (e) { logOnce('secrets:say', e); } }
}

/** Guarded call into another module: never lets a cosmetic failure take a secret down. */
export function safe(tag, fn) {
  try { return fn(); } catch (e) { logOnce(`secrets:${tag}`, e); return undefined; }
}

/** The element WP10 draws its DOM motes into (#fx: fixed, pointer-events none, z 80). */
export function fxRoot() { return document.getElementById('fx'); }
export function overlayRoot() { return document.getElementById('overlay'); }

/** Key centre + its screen radius in CSS px — the BODY's horizontal radius (0.62 m projected: key.screenInfo().rx; T0:
 *  the SVG Key's half-height × 0.62/1.2), i.e. the radius a hand circles round — on WebGL and in T0. Writes out. */
const _si = { x: 0, y: 0, r: 0, rx: 0, ry: 0 };
export function keyScreen(out) {
  const ctx = W.ctx;
  if (ctx && ctx.key && has(ctx.key, 'screenInfo') && ctx.renderer) {
    ctx.key.screenInfo(_si);
    out.x = _si.x; out.y = _si.y; out.r = _si.rx;
    return out;
  }
  if (ctx && ctx.t0 && has(ctx.t0, 'keyScreen')) {
    const k = ctx.t0.keyScreen();
    out.x = k.x; out.y = k.y; out.r = k.r * (0.62 / 1.2);
    return out;
  }
  out.x = layout.w / 2; out.y = layout.h / 2; out.r = Math.min(layout.w, layout.h) * 0.15;
  return out;
}
