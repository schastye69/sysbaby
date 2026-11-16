// host/devAdapter.js — __DEV__ ONLY (main.js/host/index.js call it inside `if (__DEV__)`; the production bundle drops it).
// ARCH-ADDENDUM X§5.2: (1) a SborAdapter for the WP0 placeholder MEMBERS hall, so 13-sbor / 13-t0 run before WP5 lands:
// seven hairline columns (24 m) on a 48 m arc ±25° in front of the rest camera, the deck call ring and the bond threads in
// one R3 batch; it never attaches when a real adapter (WP5) is already attached. (2) copyDump(): every player-visible
// string WP13 writes (status keys, LEADs, labels, aria-labels, band copy) for the 13-copy case.
import { Vector3 } from 'three';
import { hallHost } from '../halls/host.js';
import { createLines } from '../render/lines.js';
import { STATUS_COPY } from '../ui/statusCopy.js';
import { WORLD } from '../data/world.js';
import { deedBands, DEED_NAME } from '../deeds/deedsModel.js';
import { layout } from '../core/layout.js';

const KEYS = ['guests.in', 'guests.none', 'sbor.done', 'code.new', 'lost.here', 'lost.saved', 'lost.gentle', 'pair.here',
  'pair.done', 'pair.fact', 'proposal.saved', 'proposal.real', 'show.dark'];
const STATIC = ['Добро пожаловать в SAM.VIN.', 'Команда в сборе.', 'SAM.VIN. Основатель — {Имя}.', 'Кто сегодня с тобой?',
  'Что ты предлагаешь команде?', 'ГОСТИ', '+ ГОСТЬ', 'Имя гостя', 'ГОТОВО', 'НАЧАТЬ ПОКАЗ', 'ДАЛЬШЕ →', 'ВЫЙТИ',
  'ВЕРНУТЬСЯ К ПОКАЗУ', 'СНОВА', 'ПРЕДЛОЖЕНИЕ', 'Название', 'Что нужно сделать?', 'В ИГРЕ', 'В ЖИЗНИ', 'ЗАПИСАТЬ', 'ОТМЕНА',
  'СБОР · {dd.mm}', 'ОТКЛИКНУЛИСЬ ВСЕ · {nn}', 'КОДЕКС · 0{i}', 'ПРАВИЛО КЛАНА · {ДЕЛО} · {dd.mm.yyyy}',
  'КОДЕКС · ВЫСОТА БУКВ {h} М', 'ПОКАЗ · ВЕДЁТ {ИМЯ}', 'ТЕМНОТА', 'ПРОБУЖДЕНИЕ', 'КЛАН', 'ИМЕНА', 'МАСШТАБ', 'СНАРУЖИ',
  'ФИНАЛ', 'ДОГОВОРИЛИСЬ', 'маленький ключ', 'два маленьких ключа', 'Не прошёл мимо', 'Договорились', 'Сборы клана',
  'Сбор клана', 'Показ для гостей', 'Маленький ключ потерялся. Зал: {hall}. Ты привёл его домой.',
  'Двое не слышали друг друга. Зал: {hall}. Ты помог им договориться.', 'Сборов: {n}. Последний — {dd.mm.yyyy}.',
  'Здесь были: {names}.', 'Гостей: {n}. Вёл {Имя}.'];

/** Every WP13 string (13-copy). */
export function copyDump() {
  const out = new Set();
  for (const k of KEYS) if (STATUS_COPY[k]) out.add(STATUS_COPY[k].text);
  for (const s of STATIC) out.add(s);
  for (const k of Object.keys(DEED_NAME)) out.add(DEED_NAME[k]);
  for (const b of deedBands()) { out.add(b.label); out.add(b.title); out.add(b.text); }
  for (const sel of ['#sheet-guests', '#sheet-proposal', '#hoststrip', '[data-owner="lost"]', '[data-owner="sbor"]', '[data-owner="codex"]']) {
    for (const n of document.querySelectorAll(sel)) {
      const walk = [n, ...n.querySelectorAll('*')];
      for (const e of walk) {
        if (e.childNodes.length === 1 && e.firstChild.nodeType === 3 && e.textContent.trim()) out.add(e.textContent.trim());
        for (const a of ['aria-label', 'placeholder']) if (e.getAttribute && e.getAttribute(a)) out.add(e.getAttribute(a));
      }
    }
  }
  return [...out];
}

/** The placeholder MEMBERS SborAdapter (columns, ring, threads; visuals minimal — the real ones are WP5's). */
function buildAdapter(ctx, hctx) {
  const ids = WORLD.members.map((m) => m.id);
  const n = ids.length;
  const pose = { pos: new Vector3(), target: new Vector3(), fov: 35, offsetY: 0, roll: 0 };
  hallHost.restPose('MEMBERS', null, pose);
  const cam = new Vector3().copy(pose.pos).sub(hctx.meta.anchor);
  const tgt = new Vector3().copy(pose.target).sub(hctx.meta.anchor);
  const fwd = new Vector3().copy(tgt).sub(cam).setY(0).normalize();
  const base = [];
  const opI = Math.max(0, ids.indexOf(WORLD.operator.id));
  const order = [...Array(n).keys()];
  // his column in the middle of the arc, the others alternating outward in roster order
  const slots = [];
  let l = Math.floor((n - 1) / 2) - 1, r = Math.floor((n - 1) / 2) + 1;
  slots[opI] = Math.floor((n - 1) / 2);
  order.filter((k) => k !== opI).forEach((k, j) => { slots[k] = j % 2 === 0 ? r++ : l--; });
  for (let k = 0; k < n; k++) {
    const a = ((-25 + (50 * slots[k]) / Math.max(1, n - 1)) * Math.PI) / 180;
    const dir = new Vector3(fwd.x * Math.cos(a) - fwd.z * Math.sin(a), 0, fwd.x * Math.sin(a) + fwd.z * Math.cos(a));
    base.push(new Vector3(cam.x, 0, cam.z).addScaledVector(dir, 48));
  }
  const CAP = n + 64 + 6 * 17;
  const seg = new Float32Array(CAP * 6), alp = new Float32Array(CAP).fill(1);
  const lines = createLines({ segments: seg, count: 0, alpha: alp, color: 'silver', width: 1, far: 200 });
  lines.uniforms.uAlpha.value = 0.7;
  hctx.group.add(lines.mesh);
  let ring = { r: 0, a: 0 };
  const threads = [];
  const _p = { x: 0, y: 0, depth: 0, visible: false };
  const _w = new Vector3();
  function rebuild() {
    let q = 0;
    const put = (a, b, al) => { seg.set([a.x, a.y, a.z, b.x, b.y, b.z], q * 6); alp[q] = al; q++; };
    for (const b of base) put(b, _w.copy(b).setY(24), 0.8);
    if (ring.a > 0.001) {
      const c = base[opI];
      for (let s = 0; s < 64; s++) {
        const a0 = (s / 64) * Math.PI * 2, a1 = ((s + 1) / 64) * Math.PI * 2;
        put(new Vector3(c.x + Math.sin(a0) * ring.r, 0.02, c.z + Math.cos(a0) * ring.r), new Vector3(c.x + Math.sin(a1) * ring.r, 0.02, c.z + Math.cos(a1) * ring.r), ring.a);
      }
    }
    for (const t of threads) {
      const A = new Vector3().copy(base[t.k]).setY(24), B = new Vector3().copy(base[opI]).setY(24);
      const g = Math.max(0, Math.min(1, t.g));
      for (let s = 0; s < 16; s++) {
        const u0 = (s / 16) * g, u1 = ((s + 1) / 16) * g;
        const P0 = new Vector3().lerpVectors(A, B, u0); P0.y += Math.sin(Math.PI * u0) * 6;
        const P1 = new Vector3().lerpVectors(A, B, u1); P1.y += Math.sin(Math.PI * u1) * 6;
        put(P0, P1, t.a);
      }
    }
    lines.setSegments(seg, q);
    const ga = lines.mesh.geometry.attributes;
    if (ga.aAl) ga.aAl.needsUpdate = true;
  }
  rebuild();
  const anim = (ms, fn, done) => {
    const t0 = performance.now();
    const step = () => { const x = Math.min(1, (performance.now() - t0) / Math.max(1, ms)); fn(x); rebuild(); if (x < 1) requestAnimationFrame(step); else if (done) done(); };
    requestAnimationFrame(step);
  };
  return {
    ids, operatorIndex: opI,
    baseDistM: (k) => base[k].distanceTo(base[opI]),
    capital: (k, out) => hctx.group.localToWorld(out.copy(base[k]).setY(24)),
    screenX: (k) => { if (!ctx.rig) return layout.w / 2; ctx.rig.project(hctx.group.localToWorld(_w.copy(base[k]).setY(24)), _p); return _p.x; },
    ring() {}, flashCapital() {}, strike() {}, climb() {}, breatheRing() {}, markHere() {},
    callRing(r, a) { ring = { r, a }; rebuild(); },
    thread(k, ms) {
      const t = { k, g: 0, a: 1 };
      threads.push(t);
      anim(ms, (x) => { t.g = x; });
      return { release(ms2) { anim(ms2, (x) => { t.a = 1 - x; }, () => { const i = threads.indexOf(t); if (i >= 0) threads.splice(i, 1); rebuild(); }); } };
    },
    dispose() { lines.dispose(); },
  };
}

export function installDevAdapter(ctx) {
  let mine = null;
  hallHost.addExtension({
    name: 'devSbor',
    arrive(hctx) {
      if (hctx.id !== 'MEMBERS' || !ctx.host || !ctx.host.sbor || app0(ctx)) return;
      if (ctx.host.sbor.adapter && ctx.host.sbor.adapter !== mine) return;          // WP5's real adapter is attached
      if (!mine) mine = hctx.group ? buildAdapter(ctx, hctx) : { ids: WORLD.members.map((m) => m.id), operatorIndex: WORLD.members.findIndex((m) => m.id === WORLD.operator.id) };
      ctx.host.sbor.attach(mine);
    },
    dispose(hctx) {
      if (hctx.id !== 'MEMBERS' || !mine) return;
      if (ctx.host.sbor.adapter === mine) ctx.host.sbor.attach(null);
      if (mine.dispose) mine.dispose();
      mine = null;
    },
  });
  if (ctx.host) ctx.host.copyDump = copyDump;
}
const app0 = (ctx) => !ctx.host;
