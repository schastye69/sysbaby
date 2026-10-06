// render/fog.js — R8: exp² fog to --abyss (ARCH §3.5.2, SPEC §2.4 R8).
//
// Density is in RENDER units (the director passes PoseOut.fog per frame; halls may call fog.set while current).
// Fog tints geometry toward --abyss; it never paints empty pixels (the canvas is transparent). Objects whose material
// is created with fog:false (LAYER.NOFOG: stars, beacon) use fogVis = 1.
import { U } from './uniforms.js';
import { tween } from '../core/clock.js';
import { EASE } from '../core/ease.js';

export const FOG_GLSL = /* glsl */ `
uniform float uFogDensity; uniform vec3 cAbyss;
float fogVis(float dist) { float f = uFogDensity * dist; return exp(-f * f); }
vec3 applyFog(vec3 col, float dist) { return mix(cAbyss, col, fogVis(dist)); }`;

let active = null;

export const fog = {
  density: U.uFogDensity.value,
  /** Immediate (cancels a running fog.to). */
  set(d) {
    if (active) { active.cancel(); active = null; }
    fog.density = d;
    U.uFogDensity.value = d;
  },
  /** Tween to d over ms on loop time. → Promise */
  to(d, ms, ease = EASE.camera) {
    if (active) { active.cancel(); active = null; }
    const from = fog.density;
    const tw = tween(ms, (k) => { fog.density = from + (d - from) * k; U.uFogDensity.value = fog.density; }, ease);
    active = tw;
    return tw.done.then(() => { if (active === tw) active = null; });
  },
};
