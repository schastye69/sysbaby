// halls/core/rings.js — WP4. The UNFOLD data rings and the orbiting member plates (SPEC §3.6; SPEC-ADDENDUM A3.1, A3.2,
// A5.1, A11.4, A11.6; tier table §12.2 "Ring-text textures").
// Rings: seven canvas-texture strips (Martian Mono, uppercase, cap 0.06 m; 0.12 m on the • ring) wrapping 300° on the
// inside of each scaled rim, the 60° opening toward the camera. ONE draw call: a merged strip mesh whose ring radius,
// height, y and brightness are uniforms (the vertex shader bends it), sampling ONE R8 atlas (a 2048×128 row per ring;
// T1 1024×64), the row repeated round the arc. ALL NUMBERS ARE LIVE (worldCounts(), state, ctx.host) — rewritten on
// every open. A visually hidden DOM list duplicates them (data-qa="rings-sr"), plus the clan description.
// Plates: the members' glyphs on 0.05 m plates orbiting the nucleus at r 0.16 m, period 24 s, his edged in --ember —
// ONE draw call (billboards; positions from uniforms in the vertex shader).
import { BufferGeometry, BufferAttribute, Mesh, ShaderMaterial, DataTexture, CanvasTexture, RedFormat, UnsignedByteType,
  LinearFilter, LinearMipmapLinearFilter, RepeatWrapping, ClampToEdgeWrapping, NormalBlending, DoubleSide, Vector3 } from 'three';
import { U, registerTexture, unregisterTexture } from '../../render/uniforms.js';
import { WORLD, worldCounts, operatorMember } from '../../data/world.js';
import { state } from '../../core/state.js';
import { plural } from '../../core/ru.js';
import { quality, TIER_PARAMS } from '../../core/quality.js';
import { drawGlyph } from '../../core/glyph.js';
import { STRATA_GEOM, KEY, FONT } from '../../core/tokens.js';
import { ROOMS } from '../../world/rooms.js';

const ARC = (KEY.unfold.ringArcDeg * Math.PI) / 180;
const SEG = 96;
const ROOM_OF = ['SIGNAL', 'ARCHIVE', 'MEMBERS', 'CORE', 'VOYAGES', 'INSIGNIA', 'NADIR'];

/** The seven ring lines (SPEC §3.6 + A3.1/A3.2/A5.1/A11.4/A11.6), live. */
export function ringTexts(ctx) {
  const c = worldCounts();
  const d = state.data || {};
  const lost = d.lost || {};
  let sbor = 0;
  try { const i = ctx && ctx.host && ctx.host.sbor && ctx.host.sbor.info(); sbor = i ? i.count | 0 : 0; } catch (e) { sbor = 0; }
  if (!sbor) sbor = (d.sbor && d.sbor.count) | 0;
  const saved = lost.saved | 0, pairs = lost.pairs | 0;
  const opName = String(WORLD.operator.name || '').toLocaleUpperCase('ru');
  const n = c.shards;
  return [
    `СВЯЗЬ · ПЕРЕДАЧ ${c.delivered} · НОВЫХ ${c.unread}`,
    `ЛЕТОПИСЬ · ЛЕГЕНД ${c.legends} · МОМЕНТОВ ${c.moments} · ШУТОК ${c.jokesFound}`,
    `КЛАН · УЧАСТНИКОВ ${c.members} · НА СВЯЗИ ${c.online}${sbor >= 1 ? ` · СБОРОВ ${sbor}` : ''}`,
    `SAM.VIN · ОСНОВАН ${c.founded} · ОСНОВАТЕЛЬ ${opName} · ДНЕЙ ${c.daysSinceFounded}${saved >= 1 ? ` · СПАСЕНО ${saved}` : ''}${pairs >= 1 ? ` · ДОГОВОРИЛИСЬ ${pairs}` : ''}`,
    `ВЫЛАЗКИ · ВСЕГО ${c.missions} · ЗАВЕРШЕНО ${c.done} · ЗОНДОВ В ПУТИ ${c.probesOut}${c.life >= 1 ? ` · В ЖИЗНИ ${c.life}` : ''}`,
    `ХРАНИЛИЩЕ · РЕЛИКВИЙ ${c.earned} / ${c.achievements} · НАЙДЕНО ${c.secrets}`,
    c.nadirOpen ? 'ИСТОК · ОТКРЫТО' : `ЗАПЕЧАТАНО · ОСКОЛКОВ ${n} / 5`,
  ];
}
export function togetherLine() {
  const n = worldCounts().daysSinceFounded;
  return `МЫ ВМЕСТЕ ${n} ${plural(n, 'ДЕНЬ', 'ДНЯ', 'ДНЕЙ')}`;
}

const RING_VERT = /* glsl */ `
attribute vec3 aR;                          // ring index, u (0..1 along the arc), v (0..1 bottom → top)
uniform float uRad[7]; uniform float uY[7]; uniform float uH[7]; uniform float uA[7]; uniform float uRep[7];
uniform float uArc;
varying vec2 vUv; varying float vA; varying float vRow; varying float vRep;
void main() {
  int i = int(aR.x + 0.5);
  float th = 3.14159265 - 0.5 * uArc + aR.y * uArc;          // the arc centred on the back (−Z), open toward +Z
  vec3 p = vec3(sin(th) * uRad[i], uY[i] + (aR.z - 0.5) * uH[i], cos(th) * uRad[i]);
  vUv = vec2(aR.y, aR.z); vA = uA[i]; vRow = aR.x; vRep = uRep[i];
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;
const RING_FRAG = /* glsl */ `
uniform sampler2D uTex; uniform float uRows; uniform vec3 cSilver; uniform vec3 cWhite; uniform float uHot;
varying vec2 vUv; varying float vA; varying float vRow; varying float vRep;
void main() {
  float u = fract(vUv.x * vRep);
  float v = (vRow + 1.0 - vUv.y) / uRows;
  float t = smoothstep(0.18, 0.62, texture2D(uTex, vec2(1.0 - u, v)).r);   // crisp edges, no halo
  // the arc's two ends fade over 6 % (the text runs out into the drawing, it is not cut)
  float e = smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x);
  float hot = step(abs(vRow - uHot), 0.1);
  vec3 col = mix(cSilver, cWhite, 0.25 + 0.75 * hot);
  float a = t * vA * e * 0.78 * (1.0 + 0.25 * hot);
  if (a <= 0.004) discard;
  gl_FragColor = vec4(col, min(1.0, a));
}`;

const PLATE_VERT = /* glsl */ `
attribute vec3 aP;                          // plate index, corner x, corner y (−0.5..0.5)
uniform float uAng; uniform float uN; uniform float uR; uniform float uS; uniform float uOp; uniform float uTilt;
varying vec2 vUv; varying float vIdx; varying float vEdge; varying float vNear;
void main() {
  float th = uAng + 6.2831853 * aP.x / max(1.0, uN);
  vec3 c = vec3(sin(th) * uR, 0.0, cos(th) * uR);
  c = vec3(c.x, c.z * sin(uTilt), c.z * cos(uTilt));          // the orbit plane tips toward the camera: an ellipse, not a row
  // ART-9: the far half of the orbit recedes (smaller, fainter), so two plates passing at the ellipse's ends read as one
  // in front of the other, not as two tiles stacked on each other
  vNear = 0.5 + 0.5 * cos(th);
  vec4 mv = modelViewMatrix * vec4(c, 1.0);
  mv.xy += vec2(aP.y, aP.z) * uS * mix(0.78, 1.0, vNear);   // a billboard: always square to the camera
  vUv = vec2(aP.y, aP.z) + 0.5; vIdx = aP.x; vEdge = step(abs(aP.x - uOp), 0.1);
  gl_Position = projectionMatrix * mv;
}`;
const PLATE_FRAG = /* glsl */ `
uniform sampler2D uTex; uniform float uCells; uniform float uA; uniform vec3 cDeep; uniform vec3 cSilver; uniform vec3 cEmber;
varying vec2 vUv; varying float vIdx; varying float vEdge; varying float vNear;
void main() {
  vec4 g = texture2D(uTex, vec2((vIdx + vUv.x) / uCells, vUv.y));
  float m = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  float edge = 1.0 - smoothstep(0.03, 0.055, m);
  // a cast plate, not a tile: the others carry only a faint chamfer line; his plate alone is edged in --ember
  float eOp = edge * vEdge, eAll = edge * (1.0 - vEdge) * 0.3;
  vec3 col = mix(cDeep, cSilver, g.r);
  col = mix(col, cSilver, eAll);
  col = mix(col, cEmber, eOp);
  float a = uA * mix(0.5, 1.0, max(g.r, max(eOp, eAll))) * mix(0.3, 1.0, smoothstep(0.15, 0.6, vNear));
  gl_FragColor = vec4(col, a);
}`;

export function createRings(hctx) {
  const tierP = () => (quality.params || TIER_PARAMS[hctx.app.tier] || TIER_PARAMS.T2);
  const group = hctx.group;
  const cap = ROOM_OF.length;
  // ── ring geometry: 7 × (SEG + 1) × 2 vertices ──
  const pos = new Float32Array(cap * (SEG + 1) * 2 * 3), aR = new Float32Array(cap * (SEG + 1) * 2 * 3);
  const idx = [];
  let v = 0;
  for (let i = 0; i < cap; i++) {
    for (let s = 0; s <= SEG; s++) for (let k = 0; k < 2; k++) { aR[v * 3] = i; aR[v * 3 + 1] = s / SEG; aR[v * 3 + 2] = k; v++; }
    const b = i * (SEG + 1) * 2;
    for (let s = 0; s < SEG; s++) { const a0 = b + s * 2; idx.push(a0, a0 + 2, a0 + 1, a0 + 1, a0 + 2, a0 + 3); }
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('aR', new BufferAttribute(aR, 3));
  geo.setIndex(idx);
  const ru = {
    uRad: { value: new Array(7).fill(1.3) }, uY: { value: new Array(7).fill(0) }, uH: { value: new Array(7).fill(0.1) },
    uA: { value: new Array(7).fill(0) }, uRep: { value: new Array(7).fill(3) }, uArc: { value: ARC },
    uTex: { value: null }, uRows: { value: 8 }, uHot: { value: -1 }, cSilver: U.cSilver, cWhite: U.cWhite,
  };
  const mat = new ShaderMaterial({ uniforms: ru, vertexShader: RING_VERT, fragmentShader: RING_FRAG, transparent: true,
    depthWrite: false, depthTest: false, side: DoubleSide, blending: NormalBlending });
  const mesh = new Mesh(geo, mat);
  mesh.name = 'coreRings'; mesh.frustumCulled = false; mesh.visible = false; mesh.renderOrder = 6;
  group.add(mesh);

  // ── plates ──
  const members = WORLD.members.slice(0, 12);
  const np = Math.max(1, members.length);
  const pp = new Float32Array(np * 4 * 3), pa = new Float32Array(np * 4 * 3), pidx = [];
  for (let i = 0; i < np; i++) {
    [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]].forEach(([x, y], k) => { pa.set([i, x, y], (i * 4 + k) * 3); });
    const b = i * 4; pidx.push(b, b + 1, b + 2, b, b + 2, b + 3);
  }
  const pgeo = new BufferGeometry();
  pgeo.setAttribute('position', new BufferAttribute(pp, 3));
  pgeo.setAttribute('aP', new BufferAttribute(pa, 3));
  pgeo.setIndex(pidx);
  const opIdx = Math.max(0, members.findIndex((m) => m.id === WORLD.operator.id));
  const pu = { uTilt: { value: 0.30 }, uAng: { value: 0 }, uN: { value: np }, uR: { value: KEY.unfold.platesR }, uS: { value: KEY.unfold.plateSize },
    uOp: { value: opIdx }, uTex: { value: null }, uCells: { value: np }, uA: { value: 0 }, cDeep: U.cDeep || U.cAbyss, cSilver: U.cSilver, cEmber: U.cEmber };
  const pmat = new ShaderMaterial({ uniforms: pu, vertexShader: PLATE_VERT, fragmentShader: PLATE_FRAG, transparent: true, depthWrite: false });
  const plates = new Mesh(pgeo, pmat);
  plates.name = 'corePlates'; plates.frustumCulled = false; plates.visible = false; plates.renderOrder = 7;
  group.add(plates);

  let tex = null, texBytes = 0, ptex = null, texts = [], rowW = 2048, rowH = 128;
  function paintRings() {
    texts = ringTexts(hctx);
    const [W, H] = tierP().ringTex || [2048, 128];
    rowW = W; rowH = H;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H * 8;
    const g = cv.getContext('2d', { willReadFrequently: true });
    g.fillStyle = '#000'; g.fillRect(0, 0, W, H * 8);
    g.fillStyle = '#fff'; g.textBaseline = 'middle';
    for (let i = 0; i < cap; i++) {
      const text = `${texts[i]} · `;
      // fit the line to the row width at a cap height ≤ 46 % of the row; the ring repeats the row round its arc
      let px = Math.floor(H * 0.62);
      g.font = `400 ${px}px ${FONT.mono}`;
      let w = g.measureText(text).width;
      const sc = Math.min(1, (W * 0.98) / w);
      px = Math.max(8, Math.floor(px * sc)); g.font = `400 ${px}px ${FONT.mono}`;
      w = g.measureText(text).width;
      const mH = g.measureText('НЕ0');
      const capPx = mH.actualBoundingBoxAscent > 0 ? mH.actualBoundingBoxAscent + (mH.actualBoundingBoxDescent || 0) * 0 : px * 0.72;
      // stretch the advance to exactly one row so the repeat is seamless
      g.textBaseline = 'alphabetic';
      g.save(); g.translate(0, H * i + H * 0.5 + capPx / 2); g.scale(W / w, 1); g.fillText(text, 0, 0); g.restore();
      // ring geometry: the strip's height carries the cap height (0.06 m; 0.12 m on •)
      const capM = (i === 3 ? KEY.unfold.coreRingCap : KEY.unfold.ringCap) * (hctx.layout && hctx.layout.kind === 'phone' ? 0.6 : 1);
      ru.uH.value[i] = (capM * H) / capPx;
      const lenM = ((W / H) * ru.uH.value[i]);                 // metres of one row at that height (× the stretch)
      ru.uRep.value[i] = Math.max(1, Math.round((ARC * ringRadius(i)) / lenM));
    }
    const img = g.getImageData(0, 0, W, H * 8).data;
    const r8 = new Uint8Array(W * H * 8);
    for (let k = 0; k < r8.length; k++) r8[k] = img[k * 4];
    if (tex) { unregisterTexture(tex); tex.dispose(); }
    tex = new DataTexture(r8, W, H * 8, RedFormat, UnsignedByteType);
    tex.wrapS = RepeatWrapping; tex.wrapT = ClampToEdgeWrapping;
    tex.minFilter = LinearMipmapLinearFilter; tex.magFilter = LinearFilter; tex.generateMipmaps = true; tex.anisotropy = 4;
    tex.flipY = false; tex.needsUpdate = true;
    texBytes = Math.round(W * H * 8 * 1.34);
    registerTexture(tex, texBytes);
    ru.uTex.value = tex; ru.uRows.value = 8;
  }
  function paintPlates() {
    const S = 64;
    const cv = document.createElement('canvas');
    cv.width = S * np; cv.height = S;
    const g = cv.getContext('2d');
    g.fillStyle = '#000'; g.fillRect(0, 0, S * np, S);
    const sigil = WORLD.clan.sigil;
    members.forEach((m, i) => {
      let edges = m.glyph && m.glyph.length ? m.glyph : sigil;
      if (m.id === WORLD.operator.id) { const own = state.data && state.data.glyph; if (own && own.length) edges = own; else if (!(m.glyph && m.glyph.length)) edges = (operatorMember() && operatorMember().glyph) || sigil; }
      drawGlyph(g, edges, { x: i * S + 12, y: 12, size: S - 24, lineWidth: 3, color: '#fff', dots: false });
    });
    if (ptex) { unregisterTexture(ptex); ptex.dispose(); }
    ptex = new CanvasTexture(cv);
    ptex.minFilter = LinearFilter; ptex.generateMipmaps = false;
    registerTexture(ptex, S * np * S * 4);
    pu.uTex.value = ptex;
  }
  function ringRadius(i) {
    const st = STRATA_GEOM[i];
    return Math.max(0.12, st.rMax * KEY.unfold.ringScale * 0.97);
  }

  // ── DOM: the hidden list + one proxy per ring (Tab / Enter, and the ≥ 44 px targets on phones) ──
  const sr = document.createElement('ul');
  sr.className = 'sr-only core-sr';
  sr.dataset.qa = 'rings-sr';
  hctx.section.appendChild(sr);
  const anchors = [];
    return {
    mesh, plates, ROOM_OF,
    radius: ringRadius,
    /** repaint every number (live) — call on each open */
    refresh(about) {
      paintRings();
      if (!ptex) paintPlates();
      sr.textContent = '';
      for (const t of texts) { const li = document.createElement('li'); li.textContent = t; sr.appendChild(li); }
      const li = document.createElement('li'); li.textContent = togetherLine(); sr.appendChild(li);
      if (about) { const a = document.createElement('li'); a.textContent = about; sr.appendChild(a); }
    },
    texts: () => texts.slice(),
    /** per frame: k 0..1 ring reveal, yOf(i) → ring centre y (hall-local), plates alpha, orbit angle */
    frame(k, yOf, plateA, ang, hot) {
      mesh.visible = k > 0.002;
      plates.visible = plateA > 0.002;
      for (let i = 0; i < cap; i++) {
        ru.uY.value[i] = yOf(i) + (i === 3 ? 0.17 : 0);            // the • band clears the nucleus and its plates
        ru.uRad.value[i] = ringRadius(i) * (0.42 + 0.58 * k);
        ru.uA.value[i] = k;
      }
      ru.uHot.value = hot;
      pu.uA.value = plateA; pu.uAng.value = ang;
    },
    /** ray (hall-local origin o, unit d) → ring index under it (−1 none): the nearest hit of a 300° band */
    pick(o, d) {
      let best = -1, bestT = Infinity;
      for (let i = 0; i < cap; i++) {
        const R = ru.uRad.value[i], y0 = ru.uY.value[i], h = Math.max(ru.uH.value[i], 0.09);
        const a = d.x * d.x + d.z * d.z, b = 2 * (o.x * d.x + o.z * d.z), c = o.x * o.x + o.z * o.z - R * R;
        const disc = b * b - 4 * a * c;
        if (a < 1e-9 || disc < 0) continue;
        for (let q = 0; q < 2; q++) {
          const t = (-b + (q ? -1 : 1) * Math.sqrt(disc)) / (2 * a);
          if (t <= 0 || t >= bestT) continue;
          const x = o.x + d.x * t, y = o.y + d.y * t, z = o.z + d.z * t;
          if (Math.abs(y - y0) > h * 0.9) continue;
          let th = Math.atan2(x, z); if (th < 0) th += 2 * Math.PI;
          if (Math.abs(th - Math.PI) > ARC / 2) continue;
          best = i; bestT = t;
        }
      }
      return best;
    },
    /** the ring's back-centre point (hall-local) — where its label and proxy sit */
    backPoint(i, out) { return out.set(0, ru.uY.value[i], -ru.uRad.value[i]); },
    addProxies(onActivate, labelOf, onHot) {
      for (let i = 0; i < cap; i++) {
        if (i === 3) continue;
        const a = hctx.overlay.add({
          owner: 'core-rings', priority: 2, lowpass: 0,
          get: (out) => this.backPoint(i, out),
          button: { label: labelOf(i), onActivate: () => onActivate(i), size: 44, onFocus: () => onHot(i), onBlur: () => onHot(-1) },
        });
        if (a.button) {
          a.button.dataset.qa = 'ring'; a.button.dataset.room = ROOM_OF[i];
          // the proxy sits on the ring's back: pointing at it is pointing at the ring
          a.button.addEventListener('pointerenter', () => onHot(i));
          a.button.addEventListener('pointerleave', () => onHot(-1));
        }
        anchors.push(a);
      }
    },
    clearProxies() { while (anchors.length) anchors.pop().remove(); },
    dispose() {
      this.clearProxies();
      if (tex) { unregisterTexture(tex); tex.dispose(); tex = null; }
      if (ptex) { unregisterTexture(ptex); ptex.dispose(); ptex = null; }
      geo.dispose(); mat.dispose(); pgeo.dispose(); pmat.dispose();
      if (mesh.parent) mesh.parent.remove(mesh);
      if (plates.parent) plates.parent.remove(plates);
      if (sr.parentNode) sr.parentNode.removeChild(sr);
    },
    roomName: (i) => { const r = ROOMS[ROOM_OF[i]]; if (!r) return ''; return r.nameOpen && state.data && state.data.nadirOpen ? r.nameOpen : r.name; },
    get rowW() { return rowW; },
  };
}
