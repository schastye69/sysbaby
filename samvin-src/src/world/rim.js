// world/rim.js — the CORE horizon, WP0 SEED (ARCH §3.18.3, §6.1.5; SPEC §6.1). Owner after the gate: WP2.
//
// createRim(ctx) → Rim: his name (WORLD.operator.name, uppercased, Geologica 700 on a canvas texture drawn after
// fontsReady) on the inner face of VIN's stratum 3 that faces the default camera (r = 300 m, the face at −Z looking +Z),
// letters 38 m tall, --silver, fogged like the rim lattice; plus the rim lit-node emitters (1.2 m, ember, one draw call)
// beside it; an sr-only DOM duplicate of the name. Child of scaleEngine.root (canonical). The rim LATTICE is nest level 1.
// burn() = showName() then resolve (WP2 adds the ember → silver burn).
// Hooks pass (ARCH-ADDENDUM X§2.8.2, H28d): burn({at}) honours `at` by delay; burnGuests(names) draws them instantly in
// one row with his name on the same canvas; clearGuests; rows(); setRole(text) draws the subline (own small canvas,
// created on first use); namePoint(i, out); letterHeightM().
import { Group, Mesh, PlaneGeometry, ShaderMaterial, CanvasTexture, LinearFilter, ClampToEdgeWrapping, Vector3 } from 'three';
import { rig } from '../render/cameraRig.js';
import { after } from '../core/clock.js';
import { registerHookField } from '../core/testhook.js';
import { U, registerTexture } from '../render/uniforms.js';
import { FOG_GLSL } from '../render/fog.js';
import { createEmitterBatch } from '../render/glow.js';
import { sigilNodes } from '../key/litNodes.js';
import { fontsReady } from '../core/fonts.js';
import { upper } from '../core/ru.js';
import { WORLD } from '../data/world.js';
import { state } from '../core/state.js';
import { CANVAS_FONT, HALL, LIT_NODES } from '../core/tokens.js';

const LETTER_M = 38;              // letter height (m)
const NAME_Y = -100;              // canonical y: below the Key in the CORE rest view
const W = 1024, H = 256;

const VERT = /* glsl */ `
varying vec2 vUv; varying float vDist;
void main() { vUv = uv; vec4 v = modelViewMatrix * vec4(position, 1.0); vDist = length(v.xyz); gl_Position = projectionMatrix * v; }`;
const FRAG = /* glsl */ `
${FOG_GLSL}
uniform sampler2D uTex; uniform vec3 cSilver; uniform float uAlpha;
varying vec2 vUv; varying float vDist;
void main() {
  float a = texture2D(uTex, vUv).a * uAlpha;
  if (a <= 0.003) discard;
  gl_FragColor = vec4(applyFog(cSilver, vDist), a);
}`;

export function createRim(ctx) {
  void ctx;
  const group = new Group();
  group.name = 'rim';
  const name = upper(WORLD.operator.name || '');
  const zFace = -HALL.coreRimR * Math.cos(Math.PI / 12) + 0.5;     // the inner face, a hair in front of it

  const canvas = document.createElement('canvas');
  canvas.width = W; canvas.height = H;
  const tex = new CanvasTexture(canvas);
  tex.minFilter = LinearFilter; tex.magFilter = LinearFilter; tex.generateMipmaps = false;
  tex.wrapS = tex.wrapT = ClampToEdgeWrapping;
  registerTexture(tex, W * H * 4);
  let textW = 0.5;                                                 // name width as a fraction of the canvas
  let guests = [];                                                 // H28d: guest names (uppercased), one row with his
  let fontScale = 1;                                               // < 1 when the row had to shrink to fit
  const nameX = [0.5];                                             // centre x of each name (canvas fraction)
  const GAP = '   ';
  function paint() {
    const c = canvas.getContext('2d');
    c.clearRect(0, 0, W, H);
    c.fillStyle = '#fff';
    c.textAlign = 'center'; c.textBaseline = 'middle';
    if (!guests.length) {
      fontScale = 1;
      c.font = CANVAS_FONT.burn.replace('{px}', String(Math.round(H * 0.78)));
      c.fillText(name, W / 2, H / 2 + H * 0.04);
      textW = Math.min(1, c.measureText(name).width / W);
      nameX.length = 1; nameX[0] = 0.5;
    } else {
      const all = [name].concat(guests);
      const line = all.join(GAP);
      c.font = CANVAS_FONT.burn.replace('{px}', String(Math.round(H * 0.78)));
      const w0 = c.measureText(line).width;
      fontScale = Math.min(1, (W * 0.98) / Math.max(1, w0));
      c.font = CANVAS_FONT.burn.replace('{px}', String(Math.max(8, Math.round(H * 0.78 * fontScale))));
      const w = c.measureText(line).width, gw = c.measureText(GAP).width;
      let x = W / 2 - w / 2;
      c.textAlign = 'left';
      nameX.length = 0;
      for (const n of all) {
        const nw = c.measureText(n).width;
        c.fillText(n, x, H / 2 + H * 0.04);
        nameX.push((x + nw / 2) / W);
        x += nw + gw;
      }
      textW = Math.min(1, w / W);
    }
    tex.needsUpdate = true;
    placeNodes();
  }

  const mat = new ShaderMaterial({
    uniforms: { uTex: { value: tex }, cSilver: U.cSilver, uAlpha: { value: 1 }, cAbyss: U.cAbyss, uFogDensity: U.uFogDensity },
    vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false,
  });
  const planeH = LETTER_M / 0.6;                                   // the canvas line box is taller than the cap height
  const plane = new Mesh(new PlaneGeometry(planeH * (W / H), planeH), mat);
  plane.position.set(0, NAME_Y, zFace);
  plane.visible = false;
  plane.name = 'rimName';
  group.add(plane);

  // Lit-node emitters beside the name: a small grid to its right, filled in sigil order.
  const cap = Math.max(1, sigilNodes(WORLD.clan.sigil).length);
  const pos = new Float32Array(cap * 3);
  const nodes = createEmitterBatch({ positions: pos, count: 0, color: 'ember', radius: LIT_NODES.emitterM, intensity: 1 });
  group.add(nodes.object);
  let lit = 0;
  function placeNodes() {
    const x0 = (planeH * (W / H) * textW) / 2 + 12;
    for (let k = 0; k < cap; k++) {
      const col = Math.floor(k / 3), row = k % 3;
      pos[k * 3] = x0 + col * 6; pos[k * 3 + 1] = NAME_Y + (1 - row) * 7; pos[k * 3 + 2] = zFace + 0.5;
    }
    nodes.setPositions(pos, cap);
    nodes.setCount(lit);
  }
  paint();
  fontsReady().then(paint);

  // sr-only duplicate of the name (screen readers; QA reads it).
  let sr = null;
  try {
    sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = name;
    (document.getElementById('overlay') || document.body).appendChild(sr);
  } catch (e) { sr = null; }

  // H28d: the ОСНОВАТЕЛЬ subline (22 % letter height, 70 %), its own small canvas, created on first setRole(text).
  let role = null, roleMesh = null, roleCanvas = null, roleTex = null;
  function paintRole() {
    if (!roleCanvas) {
      roleCanvas = document.createElement('canvas');
      roleCanvas.width = W; roleCanvas.height = 64;
      roleTex = new CanvasTexture(roleCanvas);
      roleTex.minFilter = LinearFilter; roleTex.magFilter = LinearFilter; roleTex.generateMipmaps = false;
      registerTexture(roleTex, W * 64 * 4);
      const rmat = new ShaderMaterial({
        uniforms: { uTex: { value: roleTex }, cSilver: U.cSilver, uAlpha: { value: 0.7 * alpha }, cAbyss: U.cAbyss, uFogDensity: U.uFogDensity },
        vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false,
      });
      const rh = (LETTER_M * 0.22) / 0.6;
      roleMesh = new Mesh(new PlaneGeometry(rh * (W / 64), rh), rmat);
      roleMesh.position.set(0, NAME_Y - planeH * 0.5 - rh * 0.2, zFace);
      roleMesh.name = 'rimRole';
      group.add(roleMesh);
    }
    const c = roleCanvas.getContext('2d');
    c.clearRect(0, 0, W, 64);
    c.fillStyle = '#fff';
    c.font = CANVAS_FONT.burn.replace('{px}', String(Math.round(64 * 0.78)));
    c.textAlign = 'center'; c.textBaseline = 'middle';
    if (role) c.fillText(role, W / 2, 32 + 2);
    roleTex.needsUpdate = true;
    roleMesh.visible = !!role && plane.visible;
  }
  const _np = new Vector3();
  const _pp = { x: 0, y: 0, depth: 0, visible: false };

  let alpha = 1;
  const rim = {
    group,
    /** opts: { dir, msPerLetter, height?, at? (perf ms: start exactly then) } — the seed shows the name (at `at`). */
    burn(opts) {
      const at = opts && Number.isFinite(opts.at) ? opts.at : null;
      const wait = at != null ? Math.max(0, at - performance.now()) : 0;
      if (wait <= 0) { rim.showName(); return Promise.resolve(); }
      return new Promise((res) => after(wait, () => { rim.showName(); res(); }));
    },
    showName() { plane.visible = alpha > 0; if (roleMesh) roleMesh.visible = !!role && plane.visible; },
    /** H28d seed: guest names drawn at once in one row with his (--white → --silver burn is WP2's). */
    burnGuests(names, opts) {
      void opts;
      guests = (Array.isArray(names) ? names : []).map((n) => upper(String(n || ''))).filter(Boolean);
      paint();
      rim.showName();
      return Promise.resolve();
    },
    clearGuests() { if (guests.length) { guests = []; paint(); } },
    /** every name on the rim (test hook `rim`) */
    rows() {
      const h = LETTER_M * fontScale;
      return [name].concat(guests).map((text) => ({ text, heightM: h, row: 0 }));
    },
    setRole(text) { role = text ? upper(String(text)) : null; if (role || roleMesh) paintRole(); },
    /** screen point (CSS px) of rim name i (0 = his) */
    namePoint(i, out) {
      const o = out || { x: 0, y: 0 };
      const fx = nameX[Math.max(0, Math.min(nameX.length - 1, i | 0))] != null ? nameX[Math.max(0, Math.min(nameX.length - 1, i | 0))] : 0.5;
      _np.set((fx - 0.5) * planeH * (W / H), 0, 0);
      plane.updateWorldMatrix(true, false);
      plane.localToWorld(_np);
      if (rig.camera) { rig.project(_np, _pp); o.x = _pp.x; o.y = _pp.y; } else { o.x = 0; o.y = 0; }
      return o;
    },
    letterHeightM() { return LETTER_M; },
    setLitNodes(n) { lit = Math.max(0, Math.min(cap, n | 0)); nodes.setCount(lit); },
    setAlpha(a) {
      alpha = Math.max(0, Math.min(1, a));
      mat.uniforms.uAlpha.value = alpha;
      if (roleMesh) roleMesh.material.uniforms.uAlpha.value = 0.7 * alpha;
      group.visible = alpha > 0;
      nodes.setIntensity(alpha);
    },
  };
  rim.setLitNodes(state.litNodes);
  registerHookField('rim', () => rim.rows());   // H28d seed (WP2 owns the field)
  return rim;
}
