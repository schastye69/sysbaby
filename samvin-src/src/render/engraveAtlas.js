// render/engraveAtlas.js — R4: the raking engraving atlas (ARCH §3.5.5, SPEC §2.4 R4).
//
// One RGBA8 CanvasTexture (1024² on T2/T3, 512² on T1; fixed at boot):
//   R = height: 255 at the surface → 0 at the engraved bottom (0.004 m), after a 1 px blur
//   G = inlay mask: 1 px outlines, always drawn at 45 % --silver by R2 (the signs stay readable without the lamp)
// Every region of the table exists (cleared) from boot; owners draw into theirs with draw(key, {height, inlay}).
// Painters paint WHITE on transparent, in region-local px of the CURRENT atlas size (w × h passed in).
// The texture is uploaded with flipY = false: v = 0 is the canvas top (shaders map face-top → region-top).
import { CanvasTexture, Vector4, LinearFilter, ClampToEdgeWrapping } from 'three';
import { registerTexture } from './uniforms.js';
import { logOnce } from '../core/env.js';

/** Regions at 1024² (x, y, w, h in px). Scaled by size/1024 at runtime. */
const R = {};
for (let i = 0; i < 7; i++) R[`sign:${i}`] = [128 * i, 0, 128, 128];
R['glyph:back'] = [896, 0, 128, 128];
R.frieze = [0, 128, 1024, 32];
R.ticks = [0, 160, 1024, 32];
for (let k = 0; k < 16; k++) R[`capital:${k}`] = [128 * (k % 8), 192 + 128 * Math.floor(k / 8), 128, 128];
R.deck = [0, 448, 256, 256];
for (let m = 0; m < 7; m++) R[`free:${m}`] = m < 3 ? [256 * (m + 1), 448, 256, 256] : [256 * (m - 3), 704, 256, 256];
// H7 (X§2.2.6): the КОДЕКС law strips, drawn by WP1 key.setLaw. code:2/3 sit inside capital:12…15 (never drawn: members
// ≤ 12), code:4…6 inside the WITHDRAWN free:3 + free:4 (WP7/WP8 must not draw them). (0, 896, 512 × 64) stays free.
R['code:0'] = [0, 960, 512, 64];
R['code:1'] = [512, 960, 512, 64];
R['code:2'] = [512, 320, 512, 64];
R['code:3'] = [512, 384, 512, 64];
R['code:4'] = [0, 704, 512, 64];
R['code:5'] = [0, 768, 512, 64];
R['code:6'] = [0, 832, 512, 64];
const RESERVED = /^(free:[34]|capital:1[2-5])$/;

let canvas = null, ctx2d = null;
let scratchH = null, scratchI = null;

function scratch(w, h) {
  const mk = () => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  if (!scratchH || scratchH.width < w || scratchH.height < h) { scratchH = mk(); scratchI = mk(); }
  const hc = scratchH.getContext('2d', { willReadFrequently: true });
  const ic = scratchI.getContext('2d', { willReadFrequently: true });
  hc.setTransform(1, 0, 0, 1, 0, 0); ic.setTransform(1, 0, 0, 1, 0, 0);
  hc.clearRect(0, 0, scratchH.width, scratchH.height); ic.clearRect(0, 0, scratchI.width, scratchI.height);
  return [hc, ic];
}

/** 3×3 box blur of an alpha channel (1 px), in place into dst. */
function blurAlpha(src, w, h, dst) {
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let s = 0, n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const yy = y + dy; if (yy < 0 || yy >= h) continue;
        for (let dx = -1; dx <= 1; dx++) {
          const xx = x + dx; if (xx < 0 || xx >= w) continue;
          s += src[(yy * w + xx) * 4 + 3]; n++;
        }
      }
      dst[y * w + x] = s / n;
    }
  }
}

export const atlas = {
  texture: null,
  size: 1024,
  REGIONS: R,

  /** Allocates the canvas + texture for the tier (T1 → 512) and clears every region. Idempotent. */
  init(tier) {
    if (atlas.texture) return atlas;
    atlas.size = tier === 'T1' ? 512 : 1024;
    canvas = document.createElement('canvas');
    canvas.width = canvas.height = atlas.size;
    ctx2d = canvas.getContext('2d', { willReadFrequently: true });
    // Surface everywhere: R = 255 (not engraved), G = 0 (no inlay), A = 255.
    ctx2d.fillStyle = 'rgb(255,0,0)';
    ctx2d.fillRect(0, 0, atlas.size, atlas.size);
    const tex = new CanvasTexture(canvas);
    tex.flipY = false;
    tex.generateMipmaps = false;
    tex.minFilter = LinearFilter; tex.magFilter = LinearFilter;
    tex.wrapS = tex.wrapT = ClampToEdgeWrapping;
    tex.premultiplyAlpha = false;
    atlas.texture = tex;
    registerTexture(tex, atlas.size * atlas.size * 4);
    return atlas;
  },

  /** → { x, y, w, h (px at the current size), rect: Vector4(u0, v0, u1, v1) } */
  region(key) {
    const r = R[key];
    if (!r) return null;
    const k = atlas.size / 1024;
    const x = r[0] * k, y = r[1] * k, w = r[2] * k, h = r[3] * k;
    return { x, y, w, h, rect: new Vector4(r[0] / 1024, r[1] / 1024, (r[0] + r[2]) / 1024, (r[1] + r[3]) / 1024) };
  },

  /** Clears the region and paints it: painters.height / painters.inlay get (ctx2d, w, h) in region-local px. */
  draw(key, painters = {}) {
    if (__DEV__ && RESERVED.test(key)) logOnce('atlas:reserved', key);
    if (!atlas.texture) return false;
    const reg = atlas.region(key);
    if (!reg) return false;
    const w = Math.round(reg.w), h = Math.round(reg.h);
    const [hc, ic] = scratch(w, h);
    try { if (painters.height) painters.height(hc, w, h); } catch (e) { /* a painter failure leaves the region flat */ }
    try { if (painters.inlay) painters.inlay(ic, w, h); } catch (e) { /* ditto */ }
    const hd = hc.getImageData(0, 0, w, h).data;
    const id = ic.getImageData(0, 0, w, h).data;
    const blurred = new Float32Array(w * h);
    blurAlpha(hd, w, h, blurred);
    const out = ctx2d.createImageData(w, h);
    const o = out.data;
    for (let p = 0, q = 0; q < w * h; q++, p += 4) {
      o[p] = 255 - Math.round(blurred[q]);
      o[p + 1] = id[p + 3];
      o[p + 2] = 0;
      o[p + 3] = 255;
    }
    ctx2d.putImageData(out, Math.round(reg.x), Math.round(reg.y));
    atlas.texture.needsUpdate = true;
    return true;
  },
};
