// key/marks.js — WP1. His personal marks on the Key (SPEC §3.1 "Lit nodes", "Personal marks", §6.5 (c), §8.1 S06;
// SPEC-ADDENDUM A3.3 glyph → face 5).
//   lit nodes   1.5 px --ember dots on the • stratum's front faces 11, 0, 1, tracing the clan sigil; node k lights when
//               distinctDays ≥ k; at night 70 % warm windows
//   glyph       his МАСТЕРСКАЯ glyph engraved on stratum 3, face 5 (atlas glyph:back), on boot and on glyph:saved
//   satellites  up to 7 drawings from SIGNAL, each its stroke as a 0.10 m hairline figure orbiting at r 1.05 m, tilt 12°,
//               period 90 s, phase-spaced; facing the viewer; one ribbon draw call (one matrix per figure)
//   slots       SPEC §6.7 / §3.5: the 5 shard slot dots of the N stratum, a row of 3 px dots just under N's apex (moves and
//               shudders with stratum 6; extra points of the structure's vertex draw, built in key.js): filled opaque,
//               empty dim; the sealed-N click flashes all five bright for the shudder (240 ms)
import { Matrix4, Quaternion, Vector3 } from 'three';
import { createLines } from '../render/lines.js';
import { after } from '../core/clock.js';
import { identityStrata, onesStrata } from '../render/uniforms.js';
import { rig } from '../render/cameraRig.js';
import { createLitNodes } from './litNodes.js';
import { signs } from './signs.js';
import { bus } from '../core/bus.js';
import { app } from '../core/store.js';
import { state } from '../core/state.js';
import { loop } from '../core/loop.js';
import { SATELLITES, TIMING } from '../core/tokens.js';

const PTS = 64;
const TILT = (SATELLITES.tiltDeg * Math.PI) / 180;

export function createMarks(K) {
  // Lit nodes.
  const lit = createLitNodes({ scale: 1 });
  K.strata[3].add(lit.object);
  bus.on('night:change', ({ night }) => lit.setNight(night));
  if (app.night) lit.setNight(true);

  // Glyph on the back.
  const paintGlyph = () => signs.paintGlyph(state.data.glyph || []);
  bus.on('glyph:saved', ({ edges }) => signs.paintGlyph(edges || state.data.glyph || []));

  // Satellites: one ribbon batch, figure k uses matrix k.
  const cap = SATELLITES.max * (PTS - 1);
  const seg = new Float32Array(cap * 6), faces = new Float32Array(cap);
  const mats = identityStrata(), alphas = onesStrata();
  const lines = createLines({ segments: seg, faces, strata: mats, strataAlpha: alphas, color: 'silver', width: 1, alpha: 0.7, count: 0 });
  lines.mesh.name = 'satellites';
  lines.mesh.visible = false;
  K.group.add(lines.mesh);
  let n = 0;
  function rebuild() {
    const list = (state.data.drawings || []).slice(-SATELLITES.max);
    let c = 0;
    list.forEach((stroke, k) => {
      if (!Array.isArray(stroke)) return;
      const h = SATELLITES.size / 2;
      for (let j = 0; j + 1 < Math.min(PTS, stroke.length); j++) {
        const a = stroke[j], b = stroke[j + 1];
        if (!Array.isArray(a) || !Array.isArray(b)) continue;
        seg.set([a[0] * h, -a[1] * h, 0, b[0] * h, -b[1] * h, 0], c * 6);
        faces[c] = k * 16;
        c++;
      }
    });
    n = list.length;
    app.satellites = n;
    lines.setSegments(seg, c);
    lines.mesh.geometry.attributes.aFace.needsUpdate = true;
    lines.mesh.visible = c > 0;
  }
  bus.on('drawing:saved', rebuild);

  // N slot dots: 5 extra points in the structure's vertex draw (no extra draw call), stratum 6, under N's apex.
  // aAlpha is a multiplier of the vertices' 40 % (2.5 → opaque); aSize 1.5 → 3 px (navigator: 3 px).
  const X = K.structure.vertexExtra;
  const refreshSlots = () => {
    if (!X) return;
    const f = Math.min(5, state.data.nadirOpen ? 5 : state.data.shards | 0);
    for (let k = 0; k < 5; k++) { X.alphas[X.base + k] = k < f ? 2.5 : 0.7; X.sizes[X.base + k] = 1.5; }
    X.touch();
  };
  bus.on('shard:landed', refreshSlots);
  bus.on('nadir:open', refreshSlots);
  let flashOn = false;

  const _q = new Quaternion(), _gq = new Quaternion(), _p = new Vector3(), _s = new Vector3(1, 1, 1), _gi = new Matrix4();
  const marks = {
    lit,
    init() { paintGlyph(); rebuild(); lit.setCount(state.litNodes); refreshSlots(); },
    /** The sealed-N click: the slot dots flash white for the shudder (240 ms). */
    flashSlots() {
      if (flashOn || !X) return;
      flashOn = true;
      for (let k = 0; k < 5; k++) { X.alphas[X.base + k] = 2.5; X.sizes[X.base + k] = 2; }
      X.touch();
      after(TIMING.shudder, () => { flashOn = false; refreshSlots(); });
    },
    /** per frame: the figures orbit in the Key's parent frame (they do not yaw with the Key) and face the viewer */
    update(alpha) {
      lines.setAlpha(0.7 * alpha);
      if (!n || !rig.camera || !lines.mesh.visible) return;
      K.group.getWorldQuaternion(_gq).invert();
      _q.copy(rig.camera.quaternion).premultiply(_gq);
      _gi.makeRotationFromQuaternion(_gq);
      const ph = ((loop.worldNow / 1000) * Math.PI * 2) / SATELLITES.periodS;
      for (let k = 0; k < n; k++) {
        const a = ph + (Math.PI * 2 * k) / n;
        _p.set(Math.sin(a) * SATELLITES.r, -Math.cos(a) * SATELLITES.r * Math.sin(TILT), Math.cos(a) * SATELLITES.r * Math.cos(TILT));
        _p.applyMatrix4(_gi);
        mats.value[k].compose(_p, _q, _s);
      }
    },
    setLitCount(c) { lit.setCount(c); },
  };
  return marks;
}
