// world/rim.js — the CORE horizon (ARCH §3.18.3, X§2.8.2; SPEC §4.1, §6.1; SPEC-ADDENDUM A2.0.4, A2.1, A3.1, A4.1). WP2.
//
// His name, uppercased, Geologica 700, on the inner face of VIN's stratum 3 that faces the default camera (r = 300 m,
// the face at −Z looking +Z), placed in the band between the Key's lower tip and the status line of the CORE rest view
// (letters ≈ 60 px on a 1440 × 900 desktop: a 12.5 m cap height at 296.5 m — SPEC's on-screen size, see LETTER_M).
// Under it the `ОСНОВАТЕЛЬ` subline (22 % of the letter height, --silver 70 %, A3.1). Beside it the rim lit-node
// emitters (1.2 m, ember, one draw call). Guests (A4.1) burn beside him in his row, alternately right and left, at one
// equal letter height h_g = min(H0, 0.9·W / (L_max·0.66)); further rows below; `ГОСТИ · {n}` MICRO under the last row.
//
// One canvas texture (1024 × 512) holds every line in white; a 16-slot uniform table colours it per name: a burn
// front that crosses each name at msPerLetter per letter, ember (his) or --white (guests) cooling to --silver over
// 1,200 ms; fades for the subline and the MICRO. The canvas is redrawn only on a relayout (once per burn), never per
// frame. FX_GLSL: ПРОСВЕТ whitens it and the wave brightens it like every line (A2.0.3, A2.0.4).
// sr-only duplicates: «СЭМ», «Основатель: Сэм», «Гости: Лёва, Кира.» (QA and screen readers).
// Test-hook field `rim` = rows().
import { Group, Mesh, PlaneGeometry, ShaderMaterial, CanvasTexture, LinearFilter, ClampToEdgeWrapping, Vector3, Vector4,
  PerspectiveCamera } from 'three';
import { rig } from '../render/cameraRig.js';
import { after } from '../core/clock.js';
import { loop, ORDER } from '../core/loop.js';
import { registerHookField } from '../core/testhook.js';
import { U, registerTexture } from '../render/uniforms.js';
import { FOG_GLSL } from '../render/fog.js';
import { FX_GLSL, fxUniforms } from '../render/fxChunk.js';
import { createEmitterBatch, createEmitter } from '../render/glow.js';
import { sigilNodes } from '../key/litNodes.js';
import { fontsReady } from '../core/fonts.js';
import { upper } from '../core/ru.js';
import { WORLD, operatorMember } from '../data/world.js';
import { state } from '../core/state.js';
import { layout } from '../core/layout.js';
import { bus } from '../core/bus.js';
import { CANVAS_FONT, HALL, LIT_NODES, CAMERA, TIMING, LAYOUT } from '../core/tokens.js';
import { keepout } from '../ui/keepout.js';
import { app } from '../core/store.js';

/** His letter (cap) height, canonical m. SPEC §4.1 states both «38 m at 300 m» and «≈ 60 px»; the two disagree at
 *  FOV 35° (38 m would be ≈ 186 px). The on-screen size is the one SPEC, A3.1 (subline ≈ 13 px) and ARCH 2-rim agree
 *  on, so the cap is sized for it; the A4.1 equal-height law uses this value as its H0. */
const LETTER_M = 12.5;
/** A portrait phone stacks Key tip → name → subline → status → band in ≈ 110 px: the cap is 14 % lower there (≈ 48 px),
 *  so the stack keeps its air; desktop and landscape keep SPEC's ≈ 60 px. */
const letterM = () => (layout.kind === 'desktop' || (layout.w || 0) > (layout.h || 1) ? LETTER_M : LETTER_M * 0.86);
const ROLE_FRAC = 0.22;               // A3.1
const ROLE_GAP = 0.2;                 // cap bottom → subline cap top (× h): name + subline read as one caption
const NODE_ROW = 12;                  // lit nodes per row of his ledger (on the subline)
/** px under the Key's lower tip down to the bottom of its `Ø 1.24 М` value (the line + half the 12 px MICRO box) */
const DIM_CLEAR = LAYOUT.dims.keyBelowPx + 6;
/** The caption hangs from the Ø value: its cap line sits CAP_AIR × cap height below it (min 12 px), so the Key, its
 *  dimension and his name read as one drawing, and the space left over opens up above the status line. */
const CAP_AIR = 0.2;
const MICRO_FRAC = 0.16;              // `ГОСТИ · {n}` (MICRO-sized rim text)
const GAP_FRAC = 0.3;                 // A4.1 gap between names in a row (× h_g)
const ROW_FRAC = 1.25;                // A4.1 row pitch (× h_g)
const CW = 1024, CH = 512;            // canvas
const SLOTS = 16;
const MAX_GUESTS = 8;
const COOL = TIMING.burnCoolMs;       // 1,200
const NEVER = 1e9;
const zFace = -HALL.coreRimR * Math.cos(Math.PI / 12) + 0.5;      // the inner face, a hair in front of it

const VERT = /* glsl */ `
${FX_GLSL}
varying vec2 vUv; varying float vDist; varying vec3 vWp;
void main() {
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWp = w.xyz;
  vec4 v = viewMatrix * w; vDist = length(v.xyz);
  gl_Position = projectionMatrix * v;
}`;
const FRAG = /* glsl */ `
${FOG_GLSL}
${FX_GLSL}
uniform sampler2D uTex; uniform vec3 cSilver; uniform vec3 cEmber; uniform vec3 cWhite;
uniform float uAlpha; uniform float uNow;
uniform vec4 uRect[${SLOTS}]; uniform vec4 uTim[${SLOTS}]; uniform vec4 uAux[${SLOTS}];
varying vec2 vUv; varying float vDist; varying vec3 vWp;
void main() {
  float a = texture2D(uTex, vUv).a;
  if (a <= 0.003) discard;
  vec3 col = cSilver; float al = 0.0;
  for (int k = 0; k < ${SLOTS}; k++) {
    vec4 r = uRect[k];
    if (vUv.x < r.x || vUv.x > r.z || vUv.y < r.y || vUv.y > r.w) continue;
    vec4 t = uTim[k]; vec4 x = uAux[k];             // t: start, dur, mode, dir · x: cool, alpha, hot, 0
    float u = clamp((vUv.x - r.x - x.w) / max(1e-5, r.z - r.x - 2.0 * x.w), 0.0, 1.0);
    if (t.w < 0.0) u = 1.0 - u;
    float age = uNow - (t.x + t.y * u);
    if (age < 0.0) { al = 0.0; break; }
    float c = clamp(age / x.x, 0.0, 1.0);
    if (t.z < 0.5) {                                 // his burn: ember (a hot white sliver at the front) → silver
      vec3 hot = mix(cWhite, cEmber, clamp(age / 70.0, 0.0, 1.0));
      col = mix(hot, cSilver, smoothstep(0.0, 1.0, c));
      al = x.y;
    } else if (t.z < 1.5) {                          // a guest: --white → --silver, never ember
      col = mix(cWhite, cSilver, smoothstep(0.0, 1.0, c));
      al = x.y;
    } else {                                         // a fade (subline, MICRO)
      col = cSilver; al = x.y * c;
    }
    break;
  }
  al *= a * uAlpha;
  if (al <= 0.003) discard;
  float fv = fogVis(vDist * 0.4);                    // the name reads through the hall air, not lost in it
  col = mix(cAbyss, col, fv);
  col = mix(col, cWhite, uImpact) * (1.0 + fxWaveBright(vWp));
  gl_FragColor = vec4(col, al);
}`;

/** Visible rim width W (m) and the screen y (CSS px) of a canonical point on the rim face, from the CORE rest pose. */
const _cam = new PerspectiveCamera(CAMERA.core.fov, 1, 0.1, 4000);
const _p = new Vector3();
function restCam() {
  const asp = Math.max(0.2, (layout.w || 1440) / Math.max(1, layout.h || 900));
  _cam.aspect = asp; _cam.fov = CAMERA.core.fov;
  _cam.position.set(...CAMERA.core.pos);
  _cam.lookAt(0, 0, 0);
  _cam.updateProjectionMatrix(); _cam.updateMatrixWorld(true);
  return _cam;
}
function screenY(y, z) {
  const h = layout.h || 900;
  _p.set(0, y, z).project(_cam);
  return (1 - _p.y) * 0.5 * h + (layout.kind === 'desktop' ? 0 : CAMERA.core.phoneOffsetY * h);
}
function worldYForScreen(sy) {          // on the rim face (bisection; monotonic)
  let lo = -400, hi = 400;
  for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (screenY(m, zFace) > sy) lo = m; else hi = m; }
  return (lo + hi) / 2;
}
/** CSS px y of the status line's top edge (a layout read, only on relayout). */
function statusTop(h) {
  const fb = layout.kind === 'desktop' ? h - 62 : h - 88 - (layout.safe ? layout.safe.b : 0) - 60;
  try {
    const el = document.getElementById('status');
    if (!el) return fb;
    const b = parseFloat(getComputedStyle(el).bottom);
    if (!Number.isFinite(b)) return fb;
    return h - b - Math.max(22, el.offsetHeight || 0);
  } catch (e) { return fb; }
}
function visibleWidth() {
  const d = Math.hypot(CAMERA.core.pos[1], CAMERA.core.pos[2] - zFace);
  const asp = Math.max(0.2, (layout.w || 1440) / Math.max(1, layout.h || 900));
  return 2 * d * Math.tan((CAMERA.core.fov * Math.PI) / 360) * asp;
}

export function createRim(ctx) {
  void ctx;
  const group = new Group();
  group.name = 'rim';
  const nameText = upper(WORLD.operator.name || '');
  const nameCap = WORLD.operator.name || '';
  const om = operatorMember();
  let roleText = upper((om && om.role) || 'основатель');

  // ── canvas + texture ──
  const canvas = document.createElement('canvas');
  canvas.width = CW; canvas.height = CH;
  const c2 = canvas.getContext('2d');
  const tex = new CanvasTexture(canvas);
  tex.minFilter = LinearFilter; tex.magFilter = LinearFilter; tex.generateMipmaps = false;
  tex.wrapS = tex.wrapT = ClampToEdgeWrapping;
  registerTexture(tex, CW * CH * 4);

  const rects = [], tims = [], auxs = [];
  for (let k = 0; k < SLOTS; k++) { rects.push(new Vector4(2, 2, 2, 2)); tims.push(new Vector4(NEVER, 1, 2, 1)); auxs.push(new Vector4(COOL, 1, 0, 0)); }
  const mat = new ShaderMaterial({
    uniforms: {
      uTex: { value: tex }, cSilver: U.cSilver, cEmber: U.cEmber, cWhite: U.cWhite, cAbyss: U.cAbyss, uFogDensity: U.uFogDensity,
      uAlpha: { value: 1 }, uNow: { value: 0 }, uRect: { value: rects }, uTim: { value: tims }, uAux: { value: auxs },
      ...fxUniforms(),
    },
    vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false,
  });
  const plane = new Mesh(new PlaneGeometry(1, 1), mat);
  plane.name = 'rimName';
  plane.frustumCulled = false;
  plane.visible = false;
  group.add(plane);

  // ── lit-node emitters beside his name (sigil order, a 3-high grid) + the new-node electrum flash ──
  const cap = Math.max(1, sigilNodes(WORLD.clan.sigil).length);
  const pos = new Float32Array(cap * 3);
  const nodes = createEmitterBatch({ positions: pos, count: 0, color: 'ember', radius: LIT_NODES.emitterM, intensity: 1, night: true, fog: false });
  group.add(nodes.object);
  const flash = createEmitter({ color: 'electrum', radius: LIT_NODES.emitterM * 1.6, intensity: 0, fog: true });
  flash.object.visible = false;
  group.add(flash.object);
  let lit = 0, flashFrames = 0;

  // ── layout state ──
  const T0 = performance.now();
  const now = () => performance.now() - T0;
  let guests = [];                 // uppercased names (session only, never persisted)
  let hName = letterM();          // his current letter height (m)
  let hGuest = hName;
  let items = [];                  // { text, kind:'name'|'guest'|'role'|'micro', h, x, y (centre, m), w (m), row, slot }
  let pxPerM = 10, nameY = -100, lastAvail = 1e9, lastBlockH = 0;   // canvas px per metre; world y of his row (block y = 0)
  let capRatio = 0.7;              // cap height / font px (measured)
  const fontFor = (px, kind) => (kind === 'role' || kind === 'micro'
    ? `500 ${px}px "Geologica"` : CANVAS_FONT.burn.replace('{px}', String(px)));

  function measureCap() {
    c2.font = fontFor(200, 'name');
    const m = c2.measureText('НЭМ');
    if (m.actualBoundingBoxAscent > 20) capRatio = m.actualBoundingBoxAscent / 200;
  }
  function textWidthM(text, h, kind) {
    c2.font = fontFor(200, kind);
    return (c2.measureText(text).width / (200 * capRatio)) * h;
  }

  /** Lays every line out in metres (A4.1), fits the canvas to it, redraws, rewrites the slot rects. */
  function relayout() {
    restCam();
    measureCap();
    const W = visibleWidth(), maxRow = 0.9 * W;
    items = [];
    const nameW = textWidthM(nameText, hName, 'name');
    items.push({ text: nameText, kind: 'name', h: hName, x: 0, y: 0, w: nameW, row: 0, slot: 0 });
    // row 0: his name, guests alternately right / left while the row fits 0.9·W
    let left = -nameW / 2, right = nameW / 2, gi = 0, side = 1;
    const gap = GAP_FRAC * hGuest;
    while (gi < guests.length) {
      const w = textWidthM(guests[gi], hGuest, 'guest');
      const nl = side > 0 ? left : left - gap - w, nr = side > 0 ? right + gap + w : right;
      if (Math.max(-nl, nr) > maxRow / 2) break;
      items.push({ text: guests[gi], kind: 'guest', h: hGuest, x: side > 0 ? right + gap + w / 2 : left - gap - w / 2, y: 0, w, row: 0, slot: 0 });
      left = nl; right = nr; side = -side; gi++;
    }
    const roleH = ROLE_FRAC * hName;
    const roleY = -(hName / 2 + ROLE_GAP * hName + roleH / 2);
    items.push({ text: roleText, kind: 'role', h: roleH, x: 0, y: roleY, w: roleText ? textWidthM(roleText, roleH, 'role') : 0, row: 0, slot: 1 });
    // further rows: centred, alternating right / left of the row centre
    let rowY = roleY - roleH / 2 - ROW_FRAC * hGuest + hGuest / 2, row = 1, lastY = roleY - roleH / 2;
    while (gi < guests.length) {
      const rowItems = [];
      let l = 0, r = 0, s = 1;
      while (gi < guests.length) {
        const w = textWidthM(guests[gi], hGuest, 'guest');
        if (!rowItems.length) { rowItems.push({ w, x: 0 }); l = -w / 2; r = w / 2; gi++; continue; }
        const nl = s > 0 ? l : l - gap - w, nr = s > 0 ? r + gap + w : r;
        if (nr - nl > maxRow) break;
        rowItems.push({ w, x: s > 0 ? r + gap + w / 2 : l - gap - w / 2 });
        l = nl; r = nr; s = -s; gi++;
      }
      const shift = -(l + r) / 2;
      let k = gi - rowItems.length;
      for (const it of rowItems) { items.push({ text: guests[k++], kind: 'guest', h: hGuest, x: it.x + shift, y: rowY, w: it.w, row, slot: 0 }); }
      lastY = rowY - hGuest / 2;
      rowY -= ROW_FRAC * hGuest; row++;
    }
    if (guests.length) {
      const mh = MICRO_FRAC * hGuest, t = `ГОСТИ · ${guests.length}`;
      items.push({ text: t, kind: 'micro', h: mh, x: 0, y: lastY - 0.6 * hGuest - mh / 2, w: textWidthM(t, mh, 'micro'), row, slot: 0 });
    }
    // bounding box (m), with a margin for glyph overhang
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const it of items) {
      x0 = Math.min(x0, it.x - it.w / 2 - it.h * 0.3); x1 = Math.max(x1, it.x + it.w / 2 + it.h * 0.3);
      y0 = Math.min(y0, it.y - it.h * 0.75); y1 = Math.max(y1, it.y + it.h * 0.75);
    }
    const bw = x1 - x0, bh = y1 - y0;
    pxPerM = Math.min(CW / bw, CH / bh);
    const pw = CW / pxPerM, ph = CH / pxPerM;
    // vertical placement: his row in the band between the Key's lower tip and the bottom chrome; the block rises
    // (behind the Key) only when guest rows would otherwise fall below that chrome.
    const h = layout.h || 900;
    const keyBottom = screenY(-1.2, 0);
    // above the status line: its real box (desktop ≈ h − 62; phone: band 88 + safe + 12 + 26 + the line), 10 px air
    const limit = statusTop(h) - 10;
    // under the Key's `Ø 1.24 М` value (WP1, A14), the cap line CAP_AIR × cap height lower (≥ 12 px); the caption is
    // hung from there, not centred, so the air collects above the status line (grouping: Key + Ø · name + subline ·
    // status). Cap-accurate extents: the name's cap top is +h/2 above its row; the lowest line's baseline is −h/2.
    let cTop = -Infinity, cBot = Infinity;
    for (const it of items) { if (it.kind === 'role' && !roleText) continue; cTop = Math.max(cTop, it.y + it.h / 2); cBot = Math.min(cBot, it.y - it.h / 2); }
    const capPx = Math.max(1, screenY(0, zFace) - screenY(hName, zFace));
    const topY = worldYForScreen(keyBottom + DIM_CLEAR + Math.max(10, CAP_AIR * capPx)), bottomY = worldYForScreen(limit);
    lastAvail = topY - bottomY;
    lastBlockH = cTop - cBot;
    nameY = topY - cTop;
    if (nameY + cBot < bottomY) nameY += bottomY - (nameY + cBot);   // never under the status line
    plane.scale.set(pw, ph, 1);
    plane.position.set((x0 + x1) / 2, nameY + (y0 + y1) / 2, zFace);
    // draw (block → canvas: x about the box centre, y flipped)
    c2.clearRect(0, 0, CW, CH);
    c2.fillStyle = '#fff';
    c2.textAlign = 'center'; c2.textBaseline = 'alphabetic';
    let gslot = 2;
    for (const it of items) {
      if (it.kind === 'role' && !roleText) { it.slot = -1; continue; }
      const px = Math.max(6, Math.round((it.h * pxPerM) / capRatio));
      c2.font = fontFor(px, it.kind);
      const cxp = CW / 2 + (it.x - (x0 + x1) / 2) * pxPerM;
      const cyp = CH / 2 - (it.y - (y0 + y1) / 2) * pxPerM;
      c2.fillText(it.text, cxp, cyp + (it.h * pxPerM) / 2);
      if (it.kind === 'guest' || it.kind === 'micro') it.slot = gslot < SLOTS ? gslot++ : -1;
      if (it.slot >= 0) {
        const pad = it.h * 0.3 * pxPerM;
        const u0 = (cxp - (it.w * pxPerM) / 2 - pad) / CW, u1 = (cxp + (it.w * pxPerM) / 2 + pad) / CW;
        const vt = 1 - (cyp - it.h * 0.75 * pxPerM) / CH, vb = 1 - (cyp + it.h * 0.75 * pxPerM) / CH;
        rects[it.slot].set(u0, vb, u1, vt);
        auxs[it.slot].w = pad / CW;
      }
    }
    for (let k = gslot; k < SLOTS; k++) rects[k].set(2, 2, 2, 2);
    // the caption's cap-accurate box (m, group space) — the keep-out the Key's axis breaks behind
    let cx0 = Infinity, cx1 = -Infinity, cy0 = Infinity, cy1 = -Infinity;
    for (const it of items) {
      if (it.kind === 'role' && !roleText) continue;
      cx0 = Math.min(cx0, it.x - it.w / 2); cx1 = Math.max(cx1, it.x + it.w / 2);
      cy0 = Math.min(cy0, it.y - it.h / 2); cy1 = Math.max(cy1, it.y + it.h / 2);
    }
    cap4.set(cx0, nameY + cy0, cx1, nameY + cy1);
    tex.needsUpdate = true;
    placeNodes();
    writeSr();
    // his name alone must also fit between the Ø line and the status line (a portrait phone): one smaller height
    if (!guests.length && !fitting && lastBlockH > lastAvail * 1.02 && lastAvail > 1) {
      fitting = true;
      for (let it = 0; it < 3 && lastBlockH > lastAvail * 1.02; it++) { hName = hGuest = hName * Math.max(0.5, lastAvail / lastBlockH) * 0.98; relayout(); }
      fitting = false;
    }
  }
  let fitting = false;
  const cap4 = new Vector4();

  let nodeX1 = 0;                  // the ledger's right edge (group m), for the keep-out
  function placeNodes() {
    const it = items[0];
    if (!it) return;
    const role = roleText ? items.find((q) => q.kind === 'role') : null;
    if (role && role.w > 0) {
      // The founder's lamp: the ledger is set on his ОСНОВАТЕЛЬ line — one letter-space after the word, on the line's
      // centre — so node 1 reads as the light of his role (a lit window), never as a spark beside the big letters; the
      // next nodes follow it along the line like windows, NODE_ROW to a row, further rows a line-pitch lower.
      const step = role.h * 1.5, x0 = role.x + role.w / 2 + role.h * 1.3, yc = nameY + role.y;
      for (let k = 0; k < cap; k++) {
        const col = k % NODE_ROW, row = Math.floor(k / NODE_ROW);
        pos[k * 3] = x0 + col * step; pos[k * 3 + 1] = yc - row * step; pos[k * 3 + 2] = zFace + 0.6;
      }
      nodeX1 = x0 + (Math.min(Math.max(lit, 1), NODE_ROW) - 1) * step + role.h * 0.5;
    } else {
      // no role line: node 1 sits on the name's baseline after the last letter, the next ones climb the cap height
      const step = it.h * 0.42, x0 = it.x + it.w / 2 + it.h * 0.3, yb = nameY + it.y - it.h / 2 + it.h * 0.08;
      for (let k = 0; k < cap; k++) {
        const col = Math.floor(k / 3), row = k % 3;
        pos[k * 3] = x0 + col * step; pos[k * 3 + 1] = yb + row * step; pos[k * 3 + 2] = zFace + 0.6;
      }
      nodeX1 = x0 + Math.ceil(Math.max(lit, 1) / 3) * step;
    }
    nodes.setPositions(pos, cap);
    nodes.setCount(lit);
  }

  // ── sr-only duplicates ──
  const sr = [];
  function mkSr(text) {
    try {
      const el = document.createElement('span');
      el.className = 'sr-only';
      el.textContent = text;
      (document.getElementById('overlay') || document.body).appendChild(el);
      return el;
    } catch (e) { return null; }
  }
  sr.push(mkSr(nameText));
  const roleLine = (t) => (t ? `${t.charAt(0)}${t.slice(1).toLowerCase()}: ${nameCap}` : '');
  sr.push(mkSr(roleLine(roleText)));
  sr.push(mkSr(''));
  let guestCaps = [];
  function writeSr() { if (sr[2]) sr[2].textContent = guestCaps.length ? `Гости: ${guestCaps.join(', ')}.` : ''; }

  // ── slot timing ──
  function setSlot(slot, start, dur, mode, dir, alpha) {
    if (slot < 0 || slot >= SLOTS) return;
    tims[slot].set(start, Math.max(1, dur), mode, dir);
    auxs[slot].x = COOL; auxs[slot].y = alpha;
  }
  let activeUntil = 0;
  function keepAlive(ms) { activeUntil = Math.max(activeUntil, now() + ms + 100); }
  const _k0 = new Vector3(), _k1 = new Vector3();
  const _q0 = { x: 0, y: 0, depth: 0, visible: false }, _q1 = { x: 0, y: 0, depth: 0, visible: false };
  // A Key standing open — UNFOLD (#/core/open, gaps 0.42) or RECALL's landing while its gaps still close — reaches down
  // over his name, hung just under the rest tip (A12's low camera): the name, its subline and the lit nodes yield while
  // the strata stand apart (gap > 0.11 m; the hover explode, 0.09, keeps them) and return as they close (240 ms).
  let yieldK = 1;
  function applyAlpha() {
    const a = alpha * yieldK;
    mat.uniforms.uAlpha.value = a;
    group.visible = a > 0;
    plane.visible = a > 0 && shown;
    nodes.setIntensity(a);
  }
  loop.add((dt) => {
    const yT = app.unfolded || U.uGap.value > 0.11 ? 0 : 1;
    if (yieldK !== yT) {
      const st = Math.min(1, dt / 0.24);
      yieldK = yT > yieldK ? Math.min(yT, yieldK + st) : Math.max(yT, yieldK - st);
      applyAlpha();
    }
    // keep-out: the caption's screen box while it is on (the axis and the coordinates stay clear of his name)
    if (shown && alpha * yieldK > 0.05 && plane.visible && group.visible && rig.camera) {
      _k0.set(cap4.x, cap4.w, zFace); _k1.set(lit > 0 ? Math.max(cap4.z, nodeX1) : cap4.z, cap4.y, zFace);
      group.localToWorld(_k0); group.localToWorld(_k1);
      rig.project(_k0, _q0); rig.project(_k1, _q1);
      if (_q0.depth > 0 && _q1.depth > 0) keepout.set('rim', Math.min(_q0.x, _q1.x), Math.min(_q0.y, _q1.y), Math.max(_q0.x, _q1.x), Math.max(_q0.y, _q1.y));
      else keepout.off('rim');
    } else keepout.off('rim');
    if (flashFrames > 0) { flashFrames--; if (!flashFrames) { flash.object.visible = false; flash.setIntensity(0); } }
    const t = now();
    if (t <= activeUntil) mat.uniforms.uNow.value = t;
    else if (mat.uniforms.uNow.value < activeUntil) mat.uniforms.uNow.value = activeUntil;
  }, ORDER.FX + 5);

  let alpha = 1, roleShown = false, shown = false;
  const roleTimers = [];
  function showRoleAt(tRel) {
    roleShown = true;
    setSlot(1, tRel, 1, 2, 1, 0.7);
    auxs[1].x = 480;
    keepAlive(Math.max(0, tRel - now()) + 500);
  }

  const _np = new Vector3();
  const _pp = { x: 0, y: 0, depth: 0, visible: false };

  const rim = {
    group,
    /** opts: { dir: 'ltr'|'rtl', msPerLetter = 70, height?: m, at?: perf ms (start exactly then), role = true, lit = true }
     *  → Promise (resolves when the last letter has cooled). The `ОСНОВАТЕЛЬ` subline fades in 300 ms after that; the
     *  lit nodes appear as the last letter starts to cool. */
    burn(opts = {}) {
      if (opts.height > 0 && Math.abs(opts.height - hName) > 1e-3) { hName = opts.height; relayout(); }
      const ms = opts.msPerLetter > 0 ? opts.msPerLetter : TIMING.burnMsPerLetter;
      const startPerf = Number.isFinite(opts.at) ? opts.at : performance.now();
      const start = startPerf - T0;
      const n = Math.max(1, nameText.length);
      plane.visible = alpha * yieldK > 0; shown = true;
      setSlot(0, start, n * ms, 0, opts.dir === 'rtl' ? -1 : 1, 1);
      if (opts.role !== false && !roleShown) showRoleAt(start + n * ms + COOL + 300);
      keepAlive(Math.max(0, start - now()) + n * ms + COOL + 900);
      const lastStart = Math.max(0, start + (n - 1) * ms - now());
      if (opts.lit !== false) roleTimers.push(after(lastStart + ms, () => rim.setLitNodes(Math.max(lit, state.litNodes))));
      return new Promise((res) => after(Math.max(0, start + n * ms + COOL - now()), res));
    },
    /** Instant (reduced motion, returning same-day, skips): name, subline and lit nodes at rest. */
    showName() {
      plane.visible = alpha * yieldK > 0; shown = true;
      setSlot(0, -NEVER, 1, 0, 1, 1);
      if (!roleShown) { roleShown = true; setSlot(1, -NEVER, 1, 2, 1, 0.7); auxs[1].x = 1; }
      rim.setLitNodes(Math.max(lit, state.litNodes));
      keepAlive(0);
    },
    /** WP2 internal: a fade-in of the name without a burn (reduced motion: 160 ms), then the subline. */
    fadeName(ms = 160) {
      plane.visible = alpha * yieldK > 0; shown = true;
      const t = now();
      setSlot(0, t, 1, 2, 1, 1); auxs[0].x = Math.max(1, ms);
      if (!roleShown) { showRoleAt(t + ms + 300); auxs[1].x = Math.max(1, ms); }   // A3.1: 300 ms after the name is in
      rim.setLitNodes(Math.max(lit, state.litNodes));
      keepAlive(ms + 200);
    },
    /** WP2 internal: hide the name (СВЁРТКА → the wake re-burns it). */
    hideName() {
      shown = false; roleShown = false;
      setSlot(0, NEVER, 1, 0, 1, 1); setSlot(1, NEVER, 1, 2, 1, 0.7);
      for (let k = 2; k < SLOTS; k++) tims[k].x = NEVER;
      mat.uniforms.uNow.value = now();
    },
    get shown() { return shown; },
    /** A4.1: guest names beside his at one equal height, then rows; --white → --silver, 70 ms per letter, 240 ms apart.
     *  If h_g is below his current height his name re-burns first at h_g. → Promise (last guest cooled) */
    burnGuests(names, opts = {}) {
      const list = (Array.isArray(names) ? names : []).map((s) => String(s || '').trim()).filter(Boolean).slice(0, MAX_GUESTS);
      guestCaps = list.slice();
      guests = list.map((s) => upper(s));
      const W = visibleWidth();
      const lmax = Math.max(nameText.length, ...guests.map((g) => g.length), 1);
      let h = Math.min(letterM(), (0.9 * W) / (lmax * 0.66));
      if (opts && opts.height > 0) h = Math.min(h, opts.height);
      const h0 = hName;
      hGuest = h;
      if (h < hName) hName = h;
      relayout();
      // the rows also have to fit between the Key's lower tip and the status line: one equal height for every name
      for (let it = 0; it < 3 && lastBlockH > lastAvail && lastAvail > 1; it++) {
        h *= Math.max(0.3, lastAvail / lastBlockH) * 0.98;
        hGuest = h; hName = h;
        relayout();
      }
      const reburn = hName < h0 - 1e-3;
      const ms = opts && opts.msPerLetter > 0 ? opts.msPerLetter : TIMING.burnMsPerLetter;
      const gapMs = opts && opts.gapMs != null ? opts.gapMs : 240;
      let t = now();
      plane.visible = alpha * yieldK > 0; shown = true;
      if (reburn) { setSlot(0, t, nameText.length * ms, 0, 1, 1); t += nameText.length * ms + gapMs; }
      else setSlot(0, -NEVER, 1, 0, 1, 1);
      if (!roleShown) { roleShown = true; setSlot(1, -NEVER, 1, 2, 1, 0.7); auxs[1].x = 1; }
      for (const it of items) {
        if (it.kind !== 'guest' || it.slot < 0) continue;
        setSlot(it.slot, t, it.text.length * ms, 1, 1, 1);
        t += it.text.length * ms + gapMs;
      }
      for (const it of items) if (it.kind === 'micro' && it.slot >= 0) { setSlot(it.slot, t, 1, 2, 1, 0.7); auxs[it.slot].x = 480; }
      keepAlive(t - now() + COOL + 600);
      return new Promise((res) => after(Math.max(0, t - now() + COOL), res));
    },
    /** WP2 internal (ПОКАЗ wake): the session's guests burn again after his name. */
    reburnGuests() { return guestCaps.length ? rim.burnGuests(guestCaps.slice()) : Promise.resolve(); },
    clearGuests() {
      if (!guests.length && hName === letterM()) return;
      guests = []; guestCaps = []; hName = hGuest = letterM();
      relayout();
      if (shown) setSlot(0, -NEVER, 1, 0, 1, 1);
    },
    /** every name on the rim (test hook `rim`) */
    rows() {
      const out = [];
      for (const it of items) if (it.kind === 'name' || it.kind === 'guest') out.push({ text: it.text, heightM: Math.round(it.h * 1000) / 1000, row: it.row });
      return out;
    },
    /** The subline under his name (A3.1; default his roster role, empty = «основатель»); null/'' hides it. */
    setRole(text) {
      const t = text ? upper(String(text)) : '';
      if (t === roleText) return;
      roleText = t;
      relayout();
      if (!t) { roleShown = false; setSlot(1, NEVER, 1, 2, 1, 0.7); }
      if (sr[1]) sr[1].textContent = roleLine(t);
    },
    /** screen point (CSS px) of rim name i (0 = his) */
    namePoint(i, out) {
      const o = out || { x: 0, y: 0 };
      const names = items.filter((x) => x.kind === 'name' || x.kind === 'guest');
      const it = names[Math.max(0, Math.min(names.length - 1, i | 0))];
      if (!it) { o.x = 0; o.y = 0; return o; }
      _np.set(it.x, nameY + it.y, zFace);
      group.updateWorldMatrix(true, false);
      group.localToWorld(_np);
      if (rig.camera) { rig.project(_np, _pp); o.x = _pp.x; o.y = _pp.y; } else { o.x = 0; o.y = 0; }
      return o;
    },
    letterHeightM() { return hName; },
    setLitNodes(n) {
      const v = Math.max(0, Math.min(cap, n | 0));
      lit = v;
      placeNodes();
    },
    /** WP2 internal: the new day's node appears with a 1-frame electrum flash (SPEC §4.3). */
    flashNewNode() {
      const k = Math.max(0, Math.min(cap, state.litNodes) - 1);
      rim.setLitNodes(Math.max(lit, k + 1));
      flash.object.position.set(pos[k * 3], pos[k * 3 + 1], pos[k * 3 + 2] + 0.1);
      flash.object.visible = true; flash.setIntensity(1);
      flashFrames = 2;
    },
    setAlpha(a) {
      alpha = Math.max(0, Math.min(1, a));
      applyAlpha();
    },
  };
  relayout();
  fontsReady().then(relayout);
  bus.on('layout:change', () => { if (!guests.length) hName = hGuest = letterM(); relayout(); });
  // visible at creation so main's warmPrograms compiles the emitter program before the boot (the boot sets the count)
  rim.setLitNodes(Math.max(1, state.litNodes));
  registerHookField('rim', () => rim.rows());
  return rim;
}
