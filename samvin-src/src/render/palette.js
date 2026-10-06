// render/palette.js — the live palette (ARCH §3.5.1, SPEC §2.1).
//
// The colour uniforms in U (cVoid … cInk) hold the CURRENT palette. Night and ИЗНАНКА are palette swaps:
//   setNight(b)      tweens U.uNight 0 ↔ 1 over 1,200 ms (shaders mix the nucleus toward electrum 55 %) and sets
//                    <html data-night>.
//   setInverted(u)   lerps every c* uniform toward PALETTE_INVERT by u, writes the same mix into the CSS custom
//                    properties on :root (hex + -rgb triplet), and sets <html data-inverted> while u ≥ 0.5.
//                    Ember stays ember. WP10 animates u over its 1,400 ms roll.
import { Color } from 'three';
import { TOKEN_NAMES, PALETTE, CSS_VAR, paletteMix, NIGHT } from '../core/tokens.js';
import { U, colorKey } from './uniforms.js';
import { tween } from '../core/clock.js';

const _rgb = [0, 0, 0];
let nightTween = null;

function writeUniforms(u) {
  for (let i = 0; i < TOKEN_NAMES.length; i++) {
    const t = TOKEN_NAMES[i];
    paletteMix(t, u, _rgb);
    U[colorKey(t)].value.setRGB(_rgb[0], _rgb[1], _rgb[2]);
  }
}

function hexOf(rgb) {
  let s = '#';
  for (let i = 0; i < 3; i++) s += Math.round(rgb[i] * 255).toString(16).padStart(2, '0').toUpperCase();
  return s;
}

function writeCss(u) {
  if (typeof document === 'undefined') return;
  const st = document.documentElement.style;
  for (let i = 0; i < TOKEN_NAMES.length; i++) {
    const t = TOKEN_NAMES[i];
    if (u <= 0) { st.removeProperty(CSS_VAR[t]); st.removeProperty(CSS_VAR[t] + '-rgb'); continue; }
    paletteMix(t, u, _rgb);
    st.setProperty(CSS_VAR[t], hexOf(_rgb));
    st.setProperty(CSS_VAR[t] + '-rgb', `${Math.round(_rgb[0] * 255)},${Math.round(_rgb[1] * 255)},${Math.round(_rgb[2] * 255)}`);
  }
}

export const palette = {
  mode: { night: false, inverted: 0 },

  /** Writes the base palette into U (called once at module load; safe to call again). */
  init() { writeUniforms(palette.mode.inverted); },

  setNight(b) {
    const on = !!b;
    if (typeof document !== 'undefined') {
      if (on) document.documentElement.setAttribute('data-night', '');
      else document.documentElement.removeAttribute('data-night');
    }
    if (on === palette.mode.night && !nightTween) { U.uNight.value = on ? 1 : 0; return; }
    palette.mode.night = on;
    if (nightTween) nightTween.cancel();
    const from = U.uNight.value, to = on ? 1 : 0;
    nightTween = tween(NIGHT.mixMs, (k) => { U.uNight.value = from + (to - from) * k; });
    nightTween.done.then(() => { nightTween = null; });
  },

  setInverted(u) {
    const v = Math.max(0, Math.min(1, +u || 0));
    palette.mode.inverted = v;
    U.uInvert.value = v;
    writeUniforms(v);
    writeCss(v);
    if (typeof document !== 'undefined') {
      if (v >= 0.5) document.documentElement.setAttribute('data-inverted', '');
      else document.documentElement.removeAttribute('data-inverted');
    }
  },

  /** → the live Color uniform value of a token (swap-aware; do not mutate). */
  color(token) { return (U[colorKey(token)] || U.cSilver).value; },

  /** → '#RRGGBB' of the token as currently displayed. */
  hex(token) {
    if (!PALETTE[token]) return PALETTE.silver;
    return hexOf(paletteMix(token, palette.mode.inverted, _rgb));
  },
};

// The palette is valid from the first import (materials created before main runs still read correct colours).
writeUniforms(0);
void Color;
