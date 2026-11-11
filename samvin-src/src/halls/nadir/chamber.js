// halls/nadir/chamber.js — WP9: the NADIR chamber (SPEC §6.7 Space, §7.4 «Корни»). Hall-local metres (deck y = 0).
//   edges   — the three corner edges of the N stratum, following VIN's own profile from the deck (r ≈ 76 m) down to the
//             apex 110 m below (1 px --silver), with survey triangles every 13 m (1 px --slate, fading with depth);
//   deck    — the triangular survey deck (rings every 4 m from the 18 m opening out to 60 m, --steel), drawn here because
//             the centre is open (the shell's deck is hidden);
//   roots   — the only lattice edges in the world that carry ember nodes: 1 px --ember dots every 13 m along the three
//             edges (arc length). «Корни»: they light from the centre outward (the apex first) — setRoots(u) is PURE.
//   keystone— the chamber's deck that carries his glyph: an obsidian triangle at y −64 spanning the funnel (its corners
//             sit on the three edges, so the roots run down into it), the glyph (or the clan sigil) engraved 12 m across
//             through the atlas region `deck`, plus its R3 line twin that burns --electrum for 2,500 ms on the first
//             entry and is --silver otherwise.
import { BufferGeometry, Float32BufferAttribute, Mesh, DoubleSide } from 'three';
import { createLines } from '../../render/lines.js';
import { createPoints } from '../../render/points.js';
import { createObsidian } from '../../render/obsidian.js';
import { radiusAt } from '../../core/tokens.js';
import { glyphSegments, drawGlyph, normalizeGlyph } from '../../core/glyph.js';

const ANCHOR = -1090;
export const KEY_Y = -64, GLYPH_M = 12;
const CORNER = [-Math.PI / 3, Math.PI / 3, Math.PI];          // the N stratum's n-gon corners (VIN convention)
/** VIN's circumradius (m) at hall-local height y. */
export const vinR = (y) => radiusAt((ANCHOR + y) / 1000) * 1000;
const APEX = -110;
const KEY_R = radiusAt((ANCHOR + KEY_Y) / 1000) * 1000 * 0.985;

function cornerAt(j, y, out, o) {
  const r = vinR(y) * 0.985;
  out[o] = Math.sin(CORNER[j]) * r; out[o + 1] = y; out[o + 2] = Math.cos(CORNER[j]) * r;
}
function tri(out, r, y) {
  for (let j = 0; j < 3; j++) {
    const a0 = CORNER[j], a1 = CORNER[(j + 1) % 3];
    out.push(Math.sin(a0) * r, y, Math.cos(a0) * r, Math.sin(a1) * r, y, Math.cos(a1) * r);
  }
}

/** The glyph (or sigil) the deck carries: state glyph → operator member glyph → clan sigil. */
export function nadirGlyph(hctx) {
  const d = hctx.state.data || {};
  const own = normalizeGlyph(d.glyph || []);
  if (own.length) return { edges: own, kind: 'glyph' };
  const op = hctx.world.members.find((m) => m.id === hctx.world.operator.id);
  const og = normalizeGlyph(op && op.glyph ? op.glyph : []);
  if (og.length) return { edges: og, kind: 'glyph' };
  return { edges: normalizeGlyph(hctx.world.clan.sigil || []), kind: 'sigil' };
}

export function createChamber(hctx) {
  // ── edges along the profile (sampled every 2 m) + survey triangles every 13 m ──
  const edge = [], survey = [];
  const prev = new Float32Array(3), cur = new Float32Array(3);
  for (let j = 0; j < 3; j++) {
    cornerAt(j, 0, prev, 0);
    for (let y = -2; y >= APEX; y -= 2) {
      cornerAt(j, y, cur, 0);
      edge.push(prev[0], prev[1], prev[2], cur[0], cur[1], cur[2]);
      prev.set(cur);
    }
  }
  for (let y = -13; y > APEX + 2; y -= 13) tri(survey, vinR(y) * 0.985, y);
  // ── the deck around the opening ──
  const deck = [];
  for (let r = 18; r <= 66; r += 8) tri(deck, r, 0);
  for (let j = 0; j < 3; j++) {                                  // the three radial ribs from the opening to the walls
    const a = CORNER[j];
    deck.push(Math.sin(a) * 18, 0, Math.cos(a) * 18, Math.sin(a) * 60, 0, Math.cos(a) * 60);
  }
  const keyEdge = [];
  tri(keyEdge, KEY_R, KEY_Y + 0.02);
  tri(keyEdge, KEY_R * 0.86, KEY_Y + 0.03);                     // a machined border: the plate reads as a cut slab
  // ONE line draw for the chamber: the edges (--silver 55 %), the survey triangles and the deck at slate / steel weight
  // (silver at low alpha), the keystone's outline.
  const all = edge.concat(survey, deck, keyEdge);
  const al = new Float32Array(all.length / 6);
  let o = 0;
  for (const [n, a] of [[edge.length / 6, 0.55], [survey.length / 6, 0.2], [deck.length / 6, 0.13], [keyEdge.length / 6, 0.6]]) { al.fill(a, o, o + n); o += n; }
  const lines = createLines({ segments: Float32Array.from(all), alpha: al, color: 'silver', width: 1, far: 260 });
  lines.mesh.name = 'nadir:chamber';

  // ── roots: ember dots every 13 m of arc along the three edges, ordered by distance from the axis ──
  const pts = [], order = [];
  for (let j = 0; j < 3; j++) {
    let acc = 0;
    cornerAt(j, KEY_Y, prev, 0);
    pts.push(prev[0], prev[1] + 0.3, prev[2]); order.push(Math.hypot(prev[0], prev[2]));
    for (let y = KEY_Y + 0.5; y <= 0; y += 0.5) {
      cornerAt(j, y, cur, 0);
      acc += Math.hypot(cur[0] - prev[0], cur[1] - prev[1], cur[2] - prev[2]);
      prev.set(cur);
      if (acc >= 13) { acc -= 13; pts.push(cur[0], cur[1], cur[2]); order.push(Math.hypot(cur[0], cur[2])); }
    }
  }
  const nRoot = order.length;
  const minR = Math.min(...order), maxR = Math.max(...order);
  const rank = order.map((r) => (r - minR) / Math.max(1e-6, maxR - minR));   // 0 = down at the keystone … 1 = the deck
  const rootPos = Float32Array.from(pts);
  const alphas = new Float32Array(nRoot).fill(0);
  const roots = createPoints({ positions: rootPos, sizePx: 3, color: 'ember', alpha: 1, alphas, fog: false });
  roots.object.name = 'nadir:roots';
  const alphaAttr = roots.object.geometry.attributes.aAlpha;

  // ── the keystone deck with the engraved glyph ──
  const g = nadirGlyph(hctx);
  let mat = null, key = null, glyphL = null;
  try {
    hctx.atlas.draw('deck', {
      height(c, w, h) { drawGlyph(c, g.edges, { x: w * 0.12, y: h * 0.12, size: w * 0.76, lineWidth: Math.max(2, w / 48), color: '#fff' }); },
      inlay(c, w, h) { drawGlyph(c, g.edges, { x: w * 0.12, y: h * 0.12, size: w * 0.76, lineWidth: 1, color: '#fff' }); },
    });
  } catch (e) { /* the engraving is decoration; the line twin still carries the glyph */ }
  {
    // the triangle tile with uv over its bounding square (the glyph square is centred on the tile's incircle)
    const v = [], uv = [];
    const span = (GLYPH_M / 0.76);                             // the region square in metres (glyph = 76 % of it)
    for (let j = 0; j < 3; j++) {
      const a = CORNER[j];
      const x = Math.sin(a) * KEY_R, z = Math.cos(a) * KEY_R;
      v.push(x, 0, z);
      uv.push(0.5 + x / span, 0.5 + z / span);
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(v, 3));
    geo.setAttribute('normal', new Float32BufferAttribute([0, 1, 0, 0, 1, 0, 0, 1, 0], 3));
    geo.setAttribute('uv', new Float32BufferAttribute(uv, 2));
    mat = createObsidian({ engrave: 'deck', r1: false, side: DoubleSide });
    key = new Mesh(geo, mat);
    key.position.y = KEY_Y;
    key.name = 'nadir:keystone';
    const gs = glyphSegments(g.edges, GLYPH_M);                // xy plane, y up → lay it on the deck: up = far (−z)
    for (let i = 0; i < gs.length; i += 3) { const y = gs[i + 1]; gs[i + 1] = KEY_Y + 0.08; gs[i + 2] = -y; }
    glyphL = createLines({ segments: gs, color: 'silver', alpha: 0.7, width: 1.5, far: 260, glint: 1.0 });
    glyphL.mesh.name = 'nadir:glyph';
  }

  let burnT = -1, rootsU = -1;
  const api = {
    objects: [lines.mesh, roots.object, key, glyphL.mesh],
    glyphKind: g.kind,
    /** «Корни»: 0 = dark … 1 = every root lit (the apex first). PURE in u. */
    setRoots(u) {
      if (u === rootsU) return;
      rootsU = u;
      for (let k = 0; k < nRoot; k++) {
        const a = Math.max(0, Math.min(1, (u - rank[k] * 0.8) / 0.2));
        alphas[k] = a;
      }
      alphaAttr.needsUpdate = true;
      roots.setAlpha(u > 0 ? 1 : 0);
    },
    /** The electrum burn of the glyph (first entry): 2,500 ms, then 600 ms cooling to silver. */
    burn() { burnT = 0; glyphL.setColor('electrum'); glyphL.setAlpha(1); },
    setAlpha(a) {
      lines.setAlpha(a);
      mat.uniforms.uAlpha.value = a;
      key.visible = a > 0;
      if (burnT < 0) glyphL.setAlpha(0.7 * a);
    },
    update(ms) {
      if (burnT < 0) return;
      burnT += ms;
      if (burnT > 2500) {
        const c = Math.min(1, (burnT - 2500) / 600);
        glyphL.setAlpha(1 - 0.3 * c);
        if (c >= 1) { glyphL.setColor('silver'); glyphL.setAlpha(0.7); burnT = -1; }
      }
    },
    /** Hall-local centre of the keystone (the rest view's aim). */
    keyY: KEY_Y,
    dispose() {
      lines.dispose(); roots.dispose(); glyphL.dispose();
      key.geometry.dispose(); mat.dispose();
      if (key.parent) key.parent.remove(key);
    },
  };
  api.setRoots(0);
  return api;
}
