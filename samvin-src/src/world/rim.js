// world/rim.js — the CORE horizon, WP0 SEED (ARCH §3.18.3, §6.1.5; SPEC §6.1). Owner after the gate: WP2.
//
// createRim(ctx) → Rim: his name (WORLD.operator.name, uppercased, Geologica 700 on a canvas texture drawn after
// fontsReady) on the inner face of VIN's stratum 3 that faces the default camera (r = 300 m, the face at −Z looking +Z),
// letters 38 m tall, --silver, fogged like the rim lattice; plus the rim lit-node emitters (1.2 m, ember, one draw call)
// beside it; an sr-only DOM duplicate of the name. Child of scaleEngine.root (canonical). The rim LATTICE is nest level 1.
// burn() = showName() then resolve (WP2 adds the ember → silver burn).
import { Group, Mesh, PlaneGeometry, ShaderMaterial, CanvasTexture, LinearFilter, ClampToEdgeWrapping } from 'three';
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
  function paint() {
    const c = canvas.getContext('2d');
    c.clearRect(0, 0, W, H);
    c.fillStyle = '#fff';
    c.font = CANVAS_FONT.burn.replace('{px}', String(Math.round(H * 0.78)));
    c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText(name, W / 2, H / 2 + H * 0.04);
    textW = Math.min(1, c.measureText(name).width / W);
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

  let alpha = 1;
  const rim = {
    group,
    burn(opts) { void opts; rim.showName(); return Promise.resolve(); },
    showName() { plane.visible = alpha > 0; },
    setLitNodes(n) { lit = Math.max(0, Math.min(cap, n | 0)); nodes.setCount(lit); },
    setAlpha(a) {
      alpha = Math.max(0, Math.min(1, a));
      mat.uniforms.uAlpha.value = alpha;
      group.visible = alpha > 0;
      nodes.setIntensity(alpha);
    },
  };
  rim.setLitNodes(state.litNodes);
  return rim;
}
