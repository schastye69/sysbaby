/* sys.baby OS — core/tainik.js
 * ТАЙНИК (бывшее Тепло, ключ studio) — ПОЛЕ ВИТРИНЫ «МАГИЯ» · решение D-1229 (основатель 13.11.2026, 19:40:
 * «Тепло становится точно как витрина… всё точно так же, как в витрине. Единственное отличие: пыль летит в
 * разные стороны, а не вверх»; показ vitrina-dom-demo.html — «это гениально, это победа»).
 * Перенесено из утверждённого показа (а он — из витрины, scratchpad/vitrina-magiya/src/page.html, блоки
 * «ХОЛСТЫ», «печать», «фон», «ПЫЛЬ», frame()/draw() вольной пыли и фонаря) без изменений рисунка и чисел:
 *   почти чёрное поле, поле печатей 4×4 (шаг 22 px) приглушено до .22 (сцена «здесь ничего нет», CSS в
 *   themes.css), пыль 300 пылинок; касание/мышь — фонарь R 150 px: печати под пальцем проявляются
 *   (1 − d²/R²)·.42, пыль закручивается вихрем; сила фонаря идёт к цели с постоянной 4/с.
 * Отличие от витрины — одно: у вольной пыли снят подъём «− 2.5» (летит в разные стороны). Сумрак пола —
 * гладкая кривая (24 остановки smoothstep) вместо линейной с изломами (без прямой черты при контрасте).
 * Ступень качества сама снижается, если кадр тяжелее 21 мс (как в витрине). «Меньше движения» — один
 * неподвижный кадр, пыли нет, фонарь не светит. Под окном во весь стол, у ворот и в скрытой вкладке — ни
 * кадра. Холсты #sbTainikBg/#sbTainikFx — в .wp-layer; в прочих темах скрыты (themes.css).
 * Охраняется tools/tainik-field-check.mjs. */
(function () {
"use strict";

const root = document.documentElement;
const RMQ = matchMedia("(prefers-reduced-motion: reduce)");
let RM = RMQ.matches;
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const eo3 = (v) => 1 - Math.pow(1 - clamp(v, 0, 1), 3);
const eio = (v) => { v = clamp(v, 0, 1); return v < .5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2; };
let seed = 0x9e3779b9;
const rnd = () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return ((seed >>> 0) % 1e6) / 1e6; };
const layer = document.querySelector(".wp-layer"); if (!layer) return;
const mk = (id) => { const c = document.createElement("canvas"); c.id = id; c.setAttribute("aria-hidden", "true"); layer.appendChild(c); return c; };
const bgc = mk("sbTainikBg"), fx = mk("sbTainikFx"), bg = bgc.getContext("2d", { alpha: false }), g = fx.getContext("2d");
let W = 0, H = 0, DPR = 1, Q = 2; // Q — качество: 2 полное, 1 бережное, 0 тихое
const isTouch = matchMedia("(pointer: coarse)").matches;
const lowEnd = (navigator.hardwareConcurrency || 4) <= 4 || (navigator.deviceMemory || 4) <= 3;
if (lowEnd || (isTouch && Math.max(screen.width, screen.height) * (window.devicePixelRatio || 1) > 2000)) Q = 1;
let COL = [], EMR = "241,154,85";
function readColors() {
  const cs = getComputedStyle(root); EMR = cs.getPropertyValue("--tainik-em-rgb").trim() || "241,154,85";
  const [r, gg, b] = EMR.split(",").map(Number);
  COL = ["rgb(255,240,224)", "rgb(" + EMR + ")", "rgb(" + Math.round(lerp(r, 255, .5)) + "," + Math.round(lerp(gg, 255, .5)) + "," + Math.round(lerp(b, 255, .5)) + ")", "rgb(150,136,120)"];
}
function sizeCanvases() {
  W = innerWidth; H = innerHeight;
  const area = W * H, dpr = window.devicePixelRatio || 1;
  DPR = Math.min(dpr, Q === 2 ? (area > 1.1e6 ? 1.25 : area > 6e5 ? 1.5 : 2) : Q === 1 ? 1.15 : 1);
  for (const c of [bgc, fx]) { c.width = Math.round(W * DPR); c.height = Math.round(H * DPR); }
}
const bit = (v, b) => (v >> (15 - b)) & 1;
function randSeal() { let v; do { v = (rnd() * 65536) | 0; } while (popc(v) < 5 || popc(v) > 11); return v; }
function popc(v) { let n = 0; while (v) { n += v & 1; v >>>= 1; } return n; }

/* фон: поле тусклых печатей и пол, рисуется раз */
let BGP = []; // точки фона для «фонаря»
function drawBG() {
  const c = bg; c.setTransform(DPR, 0, 0, DPR, 0, 0);
  c.fillStyle = "#110801"; /* тьма — угольный Мандарин Тепла (D-824), почти чёрная, как в витрине */ c.fillRect(0, 0, W, H);
  const gr = c.createRadialGradient(W / 2, H * .36, 0, W / 2, H * .36, Math.max(W, H) * .75);
  gr.addColorStop(0, "rgba(" + EMR + ",0.10)"); gr.addColorStop(.45, "rgba(46,24,6,0.35)" /* та же светлота, хрома Мандарина (D-824) — не бурая */); gr.addColorStop(1, "rgba(0,0,0,0)");
  c.fillStyle = gr; c.fillRect(0, 0, W, H);
  BGP = [];
  const cell = 2, step = 22, s0 = seed; seed = 12345;
  const tints = ["255,236,214", EMR, "170,190,230", "190,230,200", "230,190,220"];
  for (let y = 6; y < H; y += step) for (let x = 6 + ((y / step) % 2) * 11; x < W; x += step) {
    if (rnd() < .38) continue;
    const v = randSeal(), d = Math.hypot(x - W / 2, y - H * .4) / Math.max(W, H);
    const a = (.05 + rnd() * .09) * (1 - d * .7), tint = rnd() < .82 ? 0 : 1 + ((rnd() * 4) | 0);
    c.fillStyle = "rgba(" + tints[tint] + "," + a.toFixed(3) + ")";
    for (let b = 0; b < 16; b++) if (bit(v, b)) { const px = x + (b & 3) * (cell + 1), py = y + (b >> 2) * (cell + 1); c.fillRect(px, py, cell, cell); BGP.push(px, py); }
  }
  seed = s0;
  // пол: тонкие линии к горизонту
  c.strokeStyle = "rgba(255,226,196,0.018)"; c.lineWidth = 1; const hy = H * .62;
  for (let i = -14; i <= 14; i++) { c.beginPath(); c.moveTo(W / 2 + i * 8, hy); c.lineTo(W / 2 + i * W * .16, H + 20); c.stroke(); }
  /* сумрак пола: в витрине — линейный градиент 0 → .5 (на линии горизонта) → .15 с изломами на hy − 160 и hy: при
     усиленном контрасте они читались прямой горизонтальной чертой через весь экран. Здесь та же кривая, но гладкая:
     24 остановки по smoothstep, наклон в начале и на вершине — ноль. Сила и место те же. */
  const v = c.createLinearGradient(0, hy - 160, 0, H), span = H - hy + 160, k0 = 160 / span, sm = (x) => x * x * (3 - 2 * x);
  for (let s = 0; s <= 24; s++) { const u = s / 24, y = hy - 160 + u * span, a = y < hy ? .5 * sm((y - (hy - 160)) / 160) : .15 + .35 * (1 - sm((y - hy) / Math.max(1, H - hy))); v.addColorStop(u, "rgba(17,8,1," + a.toFixed(4) + ")"); }
  if (!(k0 > 0)) v.addColorStop(0, "rgba(17,8,1,0)");
  c.fillStyle = v; c.fillRect(0, hy - 160, W, span);
  buildLampGrid();
}
let LG = null, LGc = 0, LGr = 0; const LGS = 64;
function buildLampGrid() {
  LGc = Math.ceil(W / LGS) + 1; LGr = Math.ceil(H / LGS) + 1; LG = Array.from({ length: LGc * LGr }, () => []);
  for (let i = 0; i < BGP.length; i += 2) { const k = ((BGP[i + 1] / LGS) | 0) * LGc + ((BGP[i] / LGS) | 0); if (LG[k]) LG[k].push(i); }
}
const PMAX = 5600;
const px = new Float32Array(PMAX), py = new Float32Array(PMAX), vx = new Float32Array(PMAX), vy = new Float32Array(PMAX),
  tx = new Float32Array(PMAX), ty = new Float32Array(PMAX), sz = new Float32Array(PMAX), al = new Float32Array(PMAX), aT = new Float32Array(PMAX),
  t0 = new Float32Array(PMAX), life = new Float32Array(PMAX), kk = new Float32Array(PMAX);
const mode = new Uint8Array(PMAX), col = new Uint8Array(PMAX), alive = new Uint8Array(PMAX), bind = new Int32Array(PMAX).fill(-1);
// mode: 0 вольная пыль · 1 точка печати (slot) · 2 точка буквы (tx,ty) · 3 вихрь · 4 угасает
const owner = new Int32Array(PMAX), fused = new Uint8Array(PMAX), pbin = new Int16Array(PMAX), statT = new Float32Array(PMAX);
let STATMAX = 0; // чья это пылинка: номер строки, к которой она летит
const freeStack = []; for (let i = PMAX - 1; i >= 0; i--) freeStack.push(i);
let NOW = 0;
function spawn(x, y, o = {}) {
  if (!freeStack.length) return -1; const i = freeStack.pop(); alive[i] = 1;
  px[i] = x; py[i] = y; vx[i] = o.vx || 0; vy[i] = o.vy || 0; sz[i] = o.sz || (1 + rnd() * 1.2); col[i] = o.col == null ? (rnd() < .7 ? 0 : 2) : o.col;
  owner[i] = 0; fused[i] = 0; statT[i] = 0; al[i] = o.al == null ? 0 : o.al; aT[i] = o.a == null ? .5 : o.a; mode[i] = o.mode || 0; t0[i] = NOW + (o.delay || 0); life[i] = o.life || 0; bind[i] = -1; kk[i] = o.k || 34;
  return i;
}
function kill(i) { if (!alive[i]) return; alive[i] = 0; if (bind[i] >= 0 && slotP[bind[i]] === i) slotP[bind[i]] = -1; bind[i] = -1; freeStack.push(i); }
let AMB = 300; let ambN = 0;
const slotP = new Int32Array(1).fill(-1);   /* в этой сцене пылинки не привязаны к печатям (bind всегда −1) */
const S = { lamp: { x: -999, y: -999, a: 0, aT: 0 } };
let NOWv = 0;

/* ═════════════════════════ КАДР (витрина: frame(), ветка вольной пыли) ═════════════════════════ */
let last = 0, fAvg = 16.7, fN = 0, running = true;
const BK = 4 * 6; const bucket = Array.from({ length: BK }, () => new Int32Array(PMAX)); const bn = new Int32Array(BK);
/* живёт только в тёмном Тайнике (бывшее Тепло, ключ studio), не под окном во весь стол, не у ворот, не в скрытой вкладке */
function on() { return !root.getAttribute("data-wp-mood") && root.getAttribute("data-theme") !== "light"; }
/* окно на столе — пыль уходит под стекло (window-one-glass-check). Тайник следит за окнами сам: класс wp-parked
   ставит поле системы, а в Тайнике оно молчит — пылинка под стеклом окна выглядела бы ступенькой яркости. */
const cover = () => root.classList.toggle("tn-covered", !!document.querySelector(".window"));
try { new MutationObserver(cover).observe(document.documentElement, { childList: true, subtree: true }); } catch (e) { /* без наблюдателя — опрос ниже */ }
setInterval(cover, 250); cover();
function parked() { return root.classList.contains("wp-parked") || root.classList.contains("tn-covered") || !!document.getElementById("sbVaultGate") || document.hidden; }
let loopOn = false, drawn = false;
function kick() { if (loopOn || !on()) return; loopOn = true; last = performance.now(); requestAnimationFrame(frame); }
function frame(ts) {
  loopOn = false;
  if (!running || !on()) return;
  /* пауза на время смены стола на слабом устройстве (core/desks.js, ~0,2 с): кадр не рисуется, вид — тот же */
  const hold = window.sbFramesHeld ? window.sbFramesHeld() : 0; if (hold > 0) { setTimeout(kick, hold + 1); return; }
  if (!drawn) { readColors(); sizeCanvases(); drawBG(); drawn = true; }
  if (parked()) { setTimeout(kick, 1000); return; }
  if (!RM) { loopOn = true; requestAnimationFrame(frame); }
  let dt = (ts - last) / 1000; last = ts; if (!(dt > 0)) dt = 1 / 60; dt = Math.min(dt, 1 / 24);
  NOW += dt;
  fAvg = fAvg * .9 + dt * 1000 * .1; fN++;
  if (fN > 40 && fAvg > 21 && Q > 0) { Q--; fN = 0; AMB = Math.round(AMB * .6); sizeCanvases(); drawBG(); }
  const ph = NOW * .2, mx = S.lamp.x, my = S.lamp.y, lampOn = S.lamp.a > .05;
  ambN = 0;
  for (let i = 0; i < PMAX; i++) {
    if (!alive[i]) continue;
    const m = mode[i];
    if (m === 4 && NOW > life[i]) { kill(i); continue; }
    if (m === 0 || m === 4) {
      if (m === 0) ambN++;
      const a = Math.sin(px[i] * .0042 + ph) + Math.cos(py[i] * .0051 - ph * .8);
      /* витрина: vy += (Math.sin(a * 2.2) * 9 - 2.5) * dt — пыль поднималась; здесь без «− 2.5»: в разные стороны */
      vx[i] += Math.cos(a * 2.2) * 9 * dt; vy[i] += Math.sin(a * 2.2) * 9 * dt;
      if (lampOn) { const dx = px[i] - mx, dy = py[i] - my, d2 = dx * dx + dy * dy; if (d2 < 16000) { const f = (1 - d2 / 16000) * 160 * dt; vx[i] += (-dy * .02 + dx * .006) * f; vy[i] += (dx * .02 + dy * .006) * f; } }
      const damp = Math.exp(-dt * 1.4); vx[i] *= damp; vy[i] *= damp; px[i] += vx[i] * dt; py[i] += vy[i] * dt;
      if (m === 0) { if (px[i] < -20) px[i] = W + 20; else if (px[i] > W + 20) px[i] = -20; if (py[i] < -20) py[i] = H + 20; else if (py[i] > H + 20) py[i] = -20; }
      if (m === 4) aT[i] = 0;
    }
    al[i] += (aT[i] - al[i]) * (1 - Math.exp(-dt * 5));
  }
  if (!RM) { let need = AMB - ambN; while (need-- > 0 && freeStack.length > 200) { spawn(rnd() * W, rnd() * H, { a: .15 + rnd() * .35, sz: .8 + rnd() * 1.1 }); ambN++; } }
  draw(dt);
}
let frames = 0;
function draw(dt) {
  frames++;
  g.setTransform(DPR, 0, 0, DPR, 0, 0); g.clearRect(0, 0, W, H);
  // фонарь: поле печатей светлеет под пальцем
  const L = S.lamp; L.a += (L.aT - L.a) * (1 - Math.exp(-dt * 4));
  if (L.a > .02 && LG && !RM) {
    g.fillStyle = "rgb(255,236,214)"; const R2 = 150 * 150, c0 = Math.max(0, ((L.x - 150) / LGS) | 0), c1 = Math.min(LGc - 1, ((L.x + 150) / LGS) | 0), r0 = Math.max(0, ((L.y - 150) / LGS) | 0), r1 = Math.min(LGr - 1, ((L.y + 150) / LGS) | 0);
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) { const arr = LG[r * LGc + c]; for (let q = 0; q < arr.length; q++) { const j = arr[q], X = BGP[j], Y = BGP[j + 1], d2 = (X - L.x) ** 2 + (Y - L.y) ** 2; if (d2 < R2) { g.globalAlpha = (1 - d2 / R2) * .42 * L.a; g.fillRect(X, Y, 2, 2); } } }
    g.globalAlpha = 1;
  }
  // пыль по корзинам: 4 цвета × 6 ступеней яркости
  bn.fill(0);
  for (let i = 0; i < PMAX; i++) { if (!alive[i]) continue; const a = al[i]; if (a < .02) continue; const b = col[i] * 6 + Math.min(5, (a * 6) | 0); bucket[b][bn[b]++] = i; }
  g.globalCompositeOperation = "source-over"; /* не «lighter»: сложение тёплых пылинок упиралось в 255 и желтело (teplo-warm-check, тон 105°) */
  for (let c = 0; c < 4; c++) { g.fillStyle = COL[c]; for (let l = 0; l < 6; l++) { const b = c * 6 + l, n = bn[b]; if (!n) continue; g.globalAlpha = (l + .5) / 6; const arr = bucket[b]; for (let q = 0; q < n; q++) { const i = arr[q], s = sz[i]; g.fillRect(px[i] - s / 2, py[i] - s / 2, s, s); } } }
  g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
}
/* фонарь: касание и мышь освещают поле печатей и закручивают пыль (витрина, без изменений) */
/* лампа светит только над полем: рука над окном не просвечивает его стекло (window-one-glass-check) */
const lampMove = (e) => { if (e.target && e.target.closest && e.target.closest(".window")) { S.lamp.aT = 0; return; } S.lamp.x = e.clientX; S.lamp.y = e.clientY; S.lamp.aT = 1; if (RM) return; };
addEventListener("pointermove", (e) => { if (e.pointerType === "mouse" || e.buttons) lampMove(e); }, { passive: true });
addEventListener("pointerdown", lampMove, { passive: true });
addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") S.lamp.aT = 0; }, { passive: true });
document.addEventListener("mouseleave", () => { S.lamp.aT = 0; });
let rzT = 0;
addEventListener("resize", () => { clearTimeout(rzT); rzT = setTimeout(() => { if (!on()) { drawn = false; return; } sizeCanvases(); drawBG(); if (RM) frame(performance.now()); }, 120); });
document.addEventListener("visibilitychange", () => { if (document.hidden) { running = false; } else if (!running) { running = true; kick(); } });
const syncRM = () => { const was = RM; RM = RMQ.matches || root.getAttribute("data-motion") === "reduced"; if (was && !RM) kick(); else if (RM && on()) { S.lamp.aT = 0; S.lamp.a = 0; frame(performance.now()); } };
RMQ.addEventListener && RMQ.addEventListener("change", syncRM);
new MutationObserver(syncRM).observe(root, { attributes: true, attributeFilter: ["data-motion"] });
/* тема, Светлица, инкогнито, окно во весь стол — по атрибутам корня */
new MutationObserver(() => { if (!on()) { drawn = false; return; } if (RM) { if (!drawn) frame(performance.now()); } else kick(); }).observe(root, { attributes: true, attributeFilter: ["data-wp-mood", "data-theme", "class"] });
RM = RM || root.getAttribute("data-motion") === "reduced";
/* наружу — для законов: пыль, сила фонаря, ступень качества, нарисованных кадров */
window.sbTainik = { on: on, get dust() { return ambN; }, get lamp() { return S.lamp.a; }, get Q() { return Q; }, get frames() { return frames; } };
if (RM) { if (on()) frame(performance.now()); } else kick();
})();
