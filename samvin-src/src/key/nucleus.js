// key/nucleus.js — WP1. The nucleus inside the hollow of stratum 3 (SPEC §3.1 "Nucleus", §3.3 "Hot side", §8.1 S10,
// SPEC-ADDENDUM A2.9): an icosahedron r 0.035 (detail 1) with an emissive --ember shader + an additive glow sprite
// r 0.0528 drawn with depthTest off and the SPEC visibility rule v = max(apertureAlign, gapOpen, 0.25).
//   hot side   +40 % on the hemisphere facing g (Key-local, written by idle.js through a 220 → 90 ms delay line)
//   night      electrum at 55 % (U.uNight); a yawn re-ignites it ember for 1,200 ms
//   overrides  setNucleus(level) for СВЁРТКА (fold dot x², 100 % / 40 % blinks); pulse (birthday ×1.3)
//   flash      ignite: 1 frame --white then the colour; flashNucleus(token, ms)
// Also the 1 px --ember breathing ring (r 0.09) round the aperture on the • face.
import { Mesh, IcosahedronGeometry, ShaderMaterial, Vector3, Matrix4 } from 'three';
import { createEmitter } from '../render/glow.js';
import { createLines } from '../render/lines.js';
import { U } from '../render/uniforms.js';
import { rig } from '../render/cameraRig.js';
import { breath } from '../core/clock.js';
import { smoothstep } from '../core/ease.js';
import { NUCLEUS, NIGHT } from '../core/tokens.js';

const VERT = /* glsl */ `
varying vec3 vN;
void main() { vN = normal; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const FRAG = /* glsl */ `
uniform vec3 uColor, cElectrum, cWhite, uHot; uniform float uNight, uNightMix, uI, uFlash, uEmissivePass, uGlowVis;
varying vec3 vN;
void main() {
  vec3 c = mix(uColor, cElectrum, uNight * uNightMix);
  float k = uI * mix(1.0, ${NIGHT.nucleusIntensity.toFixed(2)}, uNight * uNightMix);
  k *= 1.0 + ${NUCLEUS.hotGain.toFixed(2)} * smoothstep(-0.15, 0.55, dot(normalize(vN), uHot));   // the hot side
  k *= mix(1.0, uGlowVis, uEmissivePass);   // the T3 bloom source obeys the visibility rule like the sprite
  gl_FragColor = vec4(mix(c * k, cWhite, uFlash), 1.0);
}`;

const COS35 = Math.cos((NUCLEUS.apertureAlignDeg[0] * Math.PI) / 180), COS10 = Math.cos((NUCLEUS.apertureAlignDeg[1] * Math.PI) / 180);
const _v = new Vector3(), _n = new Vector3(), _c = new Vector3(), _a = new Vector3(), _m = new Matrix4();

/** parent: the Key group · ring parent: stratum 3 · faceZ: the • face plane (stratum-local z) */
export function createNucleus(group, stratum3, faceZ) {
  const u = {
    uColor: { value: U.cEmber.value }, cElectrum: U.cElectrum, cWhite: U.cWhite, uNight: U.uNight, uNightMix: { value: 1 },
    uI: { value: 1 }, uFlash: { value: 0 }, uEmissivePass: U.uEmissivePass, uGlowVis: { value: 1 }, uHot: { value: new Vector3(0, 0, 1) },
  };
  const mesh = new Mesh(new IcosahedronGeometry(NUCLEUS.r, NUCLEUS.detail), new ShaderMaterial({ uniforms: u, vertexShader: VERT, fragmentShader: FRAG }));
  mesh.name = 'nucleus';
  mesh.userData.stratum = 3;
  const glow = createEmitter({ color: 'ember', radius: NUCLEUS.glowR, intensity: 1, core: mesh, depthTest: false,
    night: true, nightIntensity: NIGHT.nucleusIntensity, fog: false, renderOrder: 6 });
  group.add(glow.object);

  // Breathing ring.
  const RN = 48, seg = new Float32Array(RN * 6), R = NUCLEUS.breathRingR;
  for (let k = 0; k < RN; k++) {
    const a0 = (k / RN) * Math.PI * 2, a1 = ((k + 1) / RN) * Math.PI * 2;
    seg.set([Math.cos(a0) * R, Math.sin(a0) * R, faceZ, Math.cos(a1) * R, Math.sin(a1) * R, faceZ], k * 6);
  }
  const ring = createLines({ segments: seg, color: 'ember', width: 1, alpha: 0.8, glint: 0 });
  ring.mesh.visible = false;
  stratum3.add(ring.mesh);

  const n = {
    mesh, glow, ring,
    on: true, ringOn: false, pulse: 1, morph: 1, level: null, reveal: 1,
    flashFrames: 0, tokenUntil: 0, yawnUntil: 0,
    /** colour token for the next frames: 'ember' | 'electrum' | 'white' */
    setToken(token) {
      u.uColor.value = token === 'white' ? U.cWhite.value : token === 'electrum' ? U.cElectrum.value : U.cEmber.value;
      glow.setColor(token === 'white' ? 'white' : token === 'electrum' ? 'electrum' : 'ember');
    },
    ignite(color, flash) { n.on = true; n.flashFrames = flash === false ? 0 : 1; n.tokenUntil = 0; n.setToken(color === 'electrum' ? 'electrum' : 'ember'); },
    flash(token, ms, now) { n.setToken(token === 'white' ? 'white' : 'electrum'); n.tokenUntil = now + Math.max(16, ms || 0); },
    yawn(now) { n.yawnUntil = now + NIGHT.yawnMs; },
    /** idle: breath on · now: loop ms · gap: current strata gap · nucleusWorld: render-space centre · stratum3 world matrix */
    update(idle, now, gap, nucleusWorld, s3) {
      if (n.tokenUntil && now > n.tokenUntil) { n.tokenUntil = 0; n.setToken('ember'); }
      const yawning = now < n.yawnUntil;
      u.uNightMix.value = yawning ? 0 : 1;              // the yawn: ember for 1,200 ms, even asleep
      glow.uniforms.uNightMix.value = yawning ? 0 : 1;
      let k = n.on ? (idle ? breath.mix(NUCLEUS.intensity[0], NUCLEUS.intensity[1]) : 1) * n.pulse * n.morph : 0;
      if (n.level != null) k = n.level;
      u.uI.value = k;
      u.uFlash.value = n.flashFrames > 0 ? 1 : 0;
      glow.setFlash(u.uFlash.value);
      if (n.flashFrames > 0) n.flashFrames--;
      let vis = NUCLEUS.minVisibility, d = 7.2, align = 0, open = 0;
      const cam = rig.camera;
      if (cam) {
        _n.set(0, 0, 1).transformDirection(s3);
        _v.copy(cam.position).sub(nucleusWorld);
        const e = s3.elements;
        d = _v.length() / Math.max(1e-9, Math.hypot(e[0], e[1], e[2]));
        align = smoothstep(COS35, COS10, _v.normalize().dot(_n));
        open = smoothstep(NUCLEUS.gapOpen[0], NUCLEUS.gapOpen[1], gap);
        vis = Math.max(vis, align, open);
      }
      // Seen through the window: the aperture is a 0.09 m hole in a 0.24 m wall, so from the raised rest camera most of
      // the nucleus hides behind the face above the hole; only its rim facing the sight line shows through it. The halo
      // (depth-test off) moves toward that visible rim — along the line of sight through the aperture centre at the
      // nucleus depth (stratum-local z = 0), but never past 0.75 r — so it lies on the lit body (never on the ember axis
      // beneath it, which would turn the night electrum orange) and the • reads as the lit window. It slides back to the
      // true centre as the gaps open, the view turns off-axis, or the camera comes close (DIVE, PULL).
      let w = 0;
      if (cam && align > 0) {
        _m.copy(s3).invert();
        _c.copy(cam.position).applyMatrix4(_m);              // camera, stratum-3 local
        if (_c.z > faceZ + 0.05) {
          const t = faceZ / (_c.z - faceZ);
          _a.set(-_c.x * t, -_c.y * t, 0);                  // A + t(A − C), A = (0, 0, faceZ) → z = 0
          // The further the sight line misses the nucleus (the Key turned off-axis), the closer to its true centre.
          w = align * (1 - open) * smoothstep(1.6, 3.2, d) * (1 - smoothstep(0.07, 0.15, _a.length()));
          const L = _a.length(), cap = NUCLEUS.r * 0.75;
          if (L > cap) _a.multiplyScalar(cap / L);
          if (w > 0) _a.multiplyScalar(w).applyMatrix4(s3);
        }
      }
      if (w > 0) group.worldToLocal(glow.sprite.position.copy(_a));
      else glow.sprite.position.set(0, 0, 0);
      // Close range (zoom, the PULL inward): the halo never grows past ≈ 26 CSS px; the core reads as a faceted ember body.
      const ppu = U.uPxPerUnit.value > 1 ? U.uPxPerUnit.value : 1427;
      glow.setRadius(Math.min(NUCLEUS.glowR, (26 * d) / ppu));
      // Lying on the visible body (w), the halo only blooms round it: the two never add up past the palette colour, so the
      // window shows ember by day and true electrum (not a clipped yellow-white) at night.
      glow.setIntensity(k * vis * n.reveal * (1 - 0.45 * w));
      u.uGlowVis.value = vis * n.reveal;
      if (ring.mesh.visible) {
        const b = breath.mix(0, 1);
        ring.mesh.scale.setScalar(1 + 0.04 * b);
        ring.setAlpha((0.55 + 0.35 * b) * n.reveal);
      }
    },
    setHot(x, y, z) { u.uHot.value.set(x, y, z); },
    setRing(b) { n.ringOn = !!b; ring.mesh.visible = n.ringOn && n.reveal > 0; },
  };
  return n;
}
