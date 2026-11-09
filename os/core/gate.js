/* sys.baby — ВОРОТА: части страницы, утверждённые основателем 04.11.2026 (финальное демо final/stol-vorota-final.html).
 * D-603 — какая дверь открыта (тон поля), касание двери (смена с первого касания), поле и кнопка «Инверсия»
 *         (Шифр — «Живой огонь · Дальше», #EC8A5F; Собор и Свет — «Перетекание»);
 * D-606 — вход «Затмение и рассвет»: чистый знак ровно на месте знака Шифра; полный раз в день, иначе короткий;
 *         касание или клавиша сразу заканчивают; «уменьшить движение» — спокойная смена; ввод не ждёт.
 * Стерегут tools/gate-look-check.mjs, tools/entry-check.mjs, tools/marks-still-check.mjs. */
/* ── D-603: дверь на <html data-sb-door> ── */
/* D-603: какая дверь открыта — на <html data-sb-door>, для тона поля слова по двери */
(function () {
  function up() { var sc = document.getElementById("sbVaultScene"), d = sc && sc.getAttribute("data-door"); if (d && document.documentElement.getAttribute("data-sb-door") !== d) document.documentElement.setAttribute("data-sb-door", d); }
  try { new MutationObserver(up).observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ["data-door"], childList: true }); } catch (e) {}
  up();
})();
/* ── D-603: дверь — с первого касания ── */
(function () {
  "use strict";
  /* Дверь переключается на pointerdown — до того, как касание уберёт фокус с поля и клавиатура, закрываясь, сдвинет
     ряд из-под пальца (тогда click не наступает вовсе); следующий за ним настоящий click гасится, чтобы сцена не
     строилась дважды. Клавиатура (Enter/Space) идёт прежним click. */
  /* Основатель: «переключение очень плохо работает». Касание двери: (1) нажатая дверь загорается сразу (<1 кадра);
     (2) сама смена — в следующей задаче после кадра, и побеждает последнее касание: касания, пришедшие пока строилась
     прежняя сцена, только меняют «куда», промежуточные сцены не строятся; (3) один обработчик: родной click касания
     гасится (клавиатурный click, detail 0, — проходит). */
  var want = "", sched = 0, via = false;
  function cur() { var s = document.getElementById("sbVaultScene"); return s ? s.getAttribute("data-door") : ""; }
  function light(n) { [].forEach.call(document.querySelectorAll("#sbVaultGate [data-gate-door]"), function (x) { var on = x.getAttribute("data-gate-door") === n; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on ? "true" : "false"); }); }
  function run() { sched = 0; var n = want; want = ""; if (!n || n === cur()) { light(cur()); return; } var b = document.querySelector('#sbVaultGate [data-gate-door="' + n + '"]'); if (!b) return; via = true; try { b.click(); } finally { via = false; } }
  document.addEventListener("pointerdown", function (e) {
    if (e.button > 0 || !e.isPrimary) return;
    var b = e.target && e.target.closest ? e.target.closest("#sbVaultGate [data-gate-door]") : null;
    if (!b) return;
    want = b.getAttribute("data-gate-door"); light(want);
    /* the switch: after the lit door is painted (rAF), or after 34 ms if frames are slow to come — the build that
       follows is stepped (pol/mount-steps.js), so it no longer has to wait for a frame */
    if (!sched) { sched = 1; var go = function () { if (sched !== 1) return; sched = 2; setTimeout(run, 0); }; requestAnimationFrame(go); setTimeout(go, 34); }
  }, true);
  document.addEventListener("click", function (e) {
    if (via || !e.isTrusted || e.detail === 0) return;
    var b = e.target && e.target.closest ? e.target.closest("#sbVaultGate [data-gate-door]") : null;
    if (b) { e.stopPropagation(); e.preventDefault(); }
  }, true);
})();
/* ── D-603: «Инверсия» ── */
/* D-603: поле и кнопка «Инверсия», движение «Перетекание» (утверждено: inversiya/peretekanie.html = src.html,
   VARIANTS[4] с общим кодом Panel/контура). Поле — открытая сверху черта с приподнятыми концами под настоящим
   полем #sbVaultPass, кнопка — та же черта, перевёрнутая, над настоящей #sbVaultOpen. Поле и кнопка — одна линия
   общей длины: фокус стягивает её в концы поля, каждая буква переливает немного в концы кнопки, нажатие забирает
   почти всю — поле сжимается в чёрточку под словом, кнопка смыкается в пилюлю. Ошибка опускает и холодит обе.
   Знаки слова — настоящие знаки двери (холст signs оболочки), их никто не трогает. Цвета — свои у каждой двери.
   Рисуется только когда что-то меняется (никакого постоянного цикла кадров). При «уменьшить движение» —
   состояния сменяются без перемещений. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  root.classList.add("sb-inv");
  var RMQ = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var RM = false;
  function rmNow() { var r = doc.querySelector("#sbVaultScene > .ds.rm"); return !!(RMQ.matches || r); }

  /* ── the approved code (src.html), unchanged in substance ── */
  var cl = function (x, a, b) { a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return x < a ? a : x > b ? b : x; };
  var lerp = function (a, b, k) { return a + (b - a) * k; };
  var eio = function (k) { return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
  var eo = function (k) { return 1 - Math.pow(1 - k, 3); };
  var ss = function (a, b, x) { var k = cl((x - a) / (b - a)); return k * k * (3 - 2 * k); };
  var mix = function (p, q, k) { return [lerp(p[0], q[0], k), lerp(p[1], q[1], k), lerp(p[2], q[2], k)]; };
  var prog = function (tau, d) { return RM ? (tau >= 0 ? 1 : 0) : cl(tau / d); };
  var errE = function (tau) { if (tau < 0 || tau > 1600) return 0; if (RM) return tau < 1300 ? 1 : 0; return tau < 180 ? eo(tau / 180) : tau < 1000 ? 1 : 1 - eio((tau - 1000) / 600); };
  function Tw(v) { this.a = v; this.b = v; this.t0 = -1e9; this.d = 0; this.e = eio; }
  Tw.prototype.to = function (b, d, e, t) { this.a = this.val(t); this.b = b; this.t0 = t; this.d = RM ? 0 : d; this.e = e || eio; };
  Tw.prototype.set = function (v) { this.a = this.b = v; this.d = 0; };
  Tw.prototype.val = function (t) { var k = this.d <= 0 ? 1 : cl((t - this.t0) / this.d); return this.a + (this.b - this.a) * this.e(k); };

  function q4(a, b) { a = Math.abs(a); b = Math.abs(b); if (b < 1e-3 || a < 1e-3) return a + b; return (Math.PI / 4) * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b))); }
  function lens(o) { var L1 = o.hw - o.rx, q = q4(o.rx, o.ry), V = Math.max(0, o.D - 2 * o.ry); return { L1: L1, L2: L1 + q, L3: L1 + q + V, L4: L1 + 2 * q + V, L5: 2 * L1 + 2 * q + V }; }
  function halfPts(o, h, out) {
    var a = o.hw - o.rx, rx = o.rx, ry = o.ry, V = Math.max(0, o.D - 2 * ry), s = 0, pu = 0, pv = 0, i, th;
    out.push(0, 0, 0);
    if (h <= 0) return out;
    function seg(u, v) { var d = Math.hypot(u - pu, v - pv); if (d < 1e-6) return false; if (s + d >= h) { var k = (h - s) / d; out.push(pu + (u - pu) * k, pv + (v - pv) * k, h); s = h; return true; } s += d; pu = u; pv = v; out.push(u, v, s); return false; }
    var ns = Math.max(1, Math.ceil(a / 2.5)), NA = 16;
    for (i = 1; i <= ns; i++) if (seg((a * i) / ns, 0)) return out;
    for (i = 1; i <= NA; i++) { th = (i / NA) * Math.PI / 2; if (seg(a + rx * Math.sin(th), ry * (1 - Math.cos(th)))) return out; }
    if (V > 0) { var nv = Math.max(1, Math.ceil(V / 2.5)); for (i = 1; i <= nv; i++) if (seg(o.hw, ry + (V * i) / nv)) return out; }
    for (i = 1; i <= NA; i++) { th = (i / NA) * Math.PI / 2; if (seg(a + rx * Math.cos(th), ry + V + ry * Math.sin(th))) return out; }
    for (i = 1; i <= ns; i++) if (seg(a - (a * i) / ns, o.D)) return out;
    return out;
  }
  function trace(cx, yA, dir, oL, hL, oR, hR) {
    var A = [], B = [], i; halfPts(oL, hL, A); halfPts(oR, hR, B);
    var nA = A.length / 3, nB = B.length / 3, n = nA - 1 + nB, X = new Float32Array(n), Y = new Float32Array(n), S = new Float32Array(n), j = 0;
    for (i = nA - 1; i >= 1; i--) { X[j] = cx - A[i * 3]; Y[j] = yA - dir * A[i * 3 + 1]; S[j] = -A[i * 3 + 2]; j++; }
    for (i = 0; i < nB; i++) { X[j] = cx + B[i * 3]; Y[j] = yA - dir * B[i * 3 + 1]; S[j] = B[i * 3 + 2]; j++; }
    var closed = hL >= lens(oL).L5 - 0.05 && hR >= lens(oR).L5 - 0.05;
    return { X: X, Y: Y, S: S, n: n, dir: dir, closed: closed, hL: hL, hR: hR };
  }
  var NX = new Float32Array(1024), NY = new Float32Array(1024), PX = new Float32Array(1024), PY = new Float32Array(1024), W = new Float32Array(1024), AL = new Float32Array(1024);
  function strip(ctx, n, Wd, Al, col, extra, scaleA, caps) {
    var bk = new Map(), i;
    function get(al) { var q = Math.min(64, Math.round(al * scaleA * 64)); if (q <= 0) return null; var p = bk.get(q); if (!p) { p = new Path2D(); bk.set(q, p); } return p; }
    for (i = 0; i < n - 1; i++) {
      var p = get((Al[i] + Al[i + 1]) * 0.5); if (!p) continue;
      var w0 = (Wd[i] + extra) / 2, w1 = (Wd[i + 1] + extra) / 2;
      p.moveTo(PX[i] + NX[i] * w0, PY[i] + NY[i] * w0); p.lineTo(PX[i + 1] + NX[i + 1] * w1, PY[i + 1] + NY[i + 1] * w1);
      p.lineTo(PX[i + 1] - NX[i + 1] * w1, PY[i + 1] - NY[i + 1] * w1); p.lineTo(PX[i] - NX[i] * w0, PY[i] - NY[i] * w0); p.closePath();
    }
    if (caps && n > 1) [[0, 1], [n - 1, n - 2]].forEach(function (ik) {
      var i2 = ik[0], k = ik[1], p2 = get(Al[i2]); if (!p2) return;
      var tx = PX[i2] - PX[k], ty = PY[i2] - PY[k], l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
      var r = (Wd[i2] + extra) / 2, nx = NX[i2], ny = NY[i2];
      p2.moveTo(PX[i2] + nx * r, PY[i2] + ny * r);
      for (var j = 1; j < 8; j++) { var f = (j / 8) * Math.PI, c = Math.cos(f), s = Math.sin(f); p2.lineTo(PX[i2] + (nx * c + tx * s) * r, PY[i2] + (ny * c + ty * s) * r); }
      p2.lineTo(PX[i2] - nx * r, PY[i2] - ny * r); p2.closePath();
    });
    bk.forEach(function (p, q) { ctx.fillStyle = "rgba(" + col + "," + q / 64 + ")"; ctx.fill(p); });
  }
  var cs = function (c) { return Math.round(c[0]) + "," + Math.round(c[1]) + "," + Math.round(c[2]); };
  function drawLine(ctx, L, o) {
    var n = L.n, X = L.X, Y = L.Y, S = L.S;
    for (var i = 0; i < n; i++) {
      var a = i > 0 ? i - 1 : 0, b = i < n - 1 ? i + 1 : n - 1, tx = X[b] - X[a], ty = Y[b] - Y[a], l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
      NX[i] = L.dir * ty; NY[i] = -L.dir * tx; PX[i] = X[i]; PY[i] = Y[i];
      W[i] = o.w; AL[i] = cl(o.a);
    }
    strip(ctx, n, W, AL, cs(o.col), 0, 1, !L.closed);
  }

  /* each door's own colours (src.html GATES; Свет = porog) */
  var GATES = {
    shifr: { A: [147, 169, 224], T: [226, 232, 246], C: [128, 142, 166], sh: "4,4,8" },
    sobor: { A: [214, 202, 246], T: [244, 240, 252], C: [170, 180, 210], sh: "18,12,32" },
    porog: { A: [240, 178, 132], T: [250, 236, 222], C: [176, 184, 198], sh: "10,6,2" }
  };

  /* ── the real gate ── */
  var gate = null, box = null, field = null, btn = null, cv = null, ctx = null, host = null;
  var keys = [], FS = { fire: null }, lastFire = 0;
  var st = { focus: new Tw(0), press: new Tw(0), nS: new Tw(0), tErr: -1e9, tSucc: -1e9 }, n = 0, fvis = false, focusedV = false, pressing = false;
  var activeUntil = 0, raf = 0, geoKey = "", mo = null;
  var now = function () { return performance.now(); };
  function on() { return root.classList.contains("sb-vvod-itog") && gate && gate.classList.contains("vg-has-scene"); }
  function door() { var d = root.getAttribute("data-sb-door"); return GATES[d] ? d : "shifr"; }
  function attach() {
    var g = doc.getElementById("sbVaultGate");
    if (!g) return false;
    var f = doc.getElementById("sbVaultPass"), b = doc.getElementById("sbVaultOpen"), bx = f && f.parentNode;
    if (!f || !b || !bx || b.parentNode !== bx) return false;
    if (g === gate && f === field && b === btn && cv && cv.parentNode === bx) return true;
    gate = g; field = f; btn = b; box = bx; host = doc.getElementById("sbVaultScene");
    if (cv && cv.parentNode) cv.parentNode.removeChild(cv);
    cv = doc.createElement("canvas"); cv.className = "vg-inv"; cv.setAttribute("aria-hidden", "true");
    box.insertBefore(cv, box.firstChild); ctx = cv.getContext("2d");
    n = Array.from(field.value || "").length; st.nS.set(n);
    focusedV = doc.activeElement === field; fvis = focusedV || n > 0; st.focus.set(fvis ? 1 : 0); st.press.set(0);
    field.addEventListener("focus", function () { focusedV = true; updFocus(now()); });
    field.addEventListener("blur", function () { focusedV = false; updFocus(now()); });
    field.addEventListener("input", function () { onValue(now()); });
    btn.addEventListener("pointerdown", function (ev) { if (ev.button > 0) return; pressDown(now()); });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (ty) { btn.addEventListener(ty, function () { pressUp(now()); }); });
    btn.addEventListener("keydown", function (ev) { if ((ev.key === " " || ev.key === "Enter") && !ev.repeat) pressDown(now()); });
    btn.addEventListener("keyup", function (ev) { if (ev.key === " " || ev.key === "Enter") pressUp(now()); });
    btn.addEventListener("blur", function () { pressUp(now()); });
    if (mo) mo.disconnect();
    mo = new MutationObserver(function () {
      var t = now();
      if (gate.classList.contains("vg-wrong") && !gate.__invWrong) { gate.__invWrong = 1; st.tErr = t; act(t, 1800); }
      if (!gate.classList.contains("vg-wrong")) gate.__invWrong = 0;
      var s = host && host.getAttribute("data-state");
      if ((s === "opening" || s === "open") && st.tSucc < -1e8) { st.tSucc = t; act(t, 1400); }
      if (s === "idle" || s === "cold") { if (st.tSucc > -1e8) { st.tSucc = -1e9; act(t, 600); } }
      act(t, 50);
    });
    mo.observe(gate, { attributes: true, attributeFilter: ["class"] });
    if (host) mo.observe(host, { attributes: true, attributeFilter: ["data-state", "data-door"] });
    mo.observe(root, { attributes: true, attributeFilter: ["data-sb-door", "class"] });
    act(now(), 50);
    return true;
  }
  /* Холст стоит в блоке деталей, и оболочка меряет блок вместе с ним («Одна высота», shell.js placeCluster).
     Холст абсолютный: его рост не будит наблюдатель размера блока — оболочке говорится прямо, иначе место
     двери зависело бы от того, успел ли холст встать до последнего замера (door-one-check). */
  function moved() { try { window.dispatchEvent(new Event("sb-gate-inv")); } catch (e) { /* старый браузер: замер по resize */ } }
  function act(t, ms) { activeUntil = Math.max(activeUntil, t + (ms || 0)); if (!raf) raf = requestAnimationFrame(frame); }
  function updFocus(t) {
    var fv = focusedV || n > 0;
    if (fv !== fvis) { fvis = fv; st.focus.to(fv ? 1 : 0, fv ? 340 : 440, eio, t); act(t, 600); }
  }
  function onValue(t) {
    var k = Array.from(field.value || "").length;
    if (k !== n) { if (k > n) for (var i = n; i < k; i++) keys.push({ t: t, n: i + 1 }); keys = keys.filter(function (q) { return t - q.t < 1600 && q.n <= k; }); n = k; st.nS.to(n, 180, eio, t); updFocus(t); act(t, 400); }
  }
  function pressDown(t) { if (st.tSucc > -1e8) return; pressing = true; st.press.to(1, 210, eio, t); act(t, 400); }
  function pressUp(t) { if (!pressing) return; pressing = false; if (st.tSucc > -1e8) return; st.press.to(0, 440, eio, t); act(t, 600); }

  function frame() {
    raf = 0;
    if (!attach()) { setTimeout(function () { act(now(), 50); }, 300); return; }
    var t = now();
    RM = rmNow();
    if (field.value.length !== n) onValue(t);
    if (!on()) { if (cv.style.display !== "none") { cv.style.display = "none"; geoKey = ""; moved(); } return; }
    cv.style.display = "";
    var fireOn = door() === "shifr" && !window.__sbInvBlank;
    if (!fireOn || t - lastFire >= 33 || t < activeUntil) { lastFire = t; render(t); }
    if (t < activeUntil || (fireOn && !RM)) raf = requestAnimationFrame(frame);
  }

  /* ── «Живой огонь» · «Дальше» — ported from inversiya/ogon-var-src.html (FIRE.far, fireStep, sparks, fireRender, the
     continuous-ribbon strip): the demo's stage constants (field line y 57, button top y 77, centre x 170) are the real
     field's and button's here. Colours: rest #EC8A5F, active #F2A274, error #B98A7C. One canvas, additive. */
  var OG = { A: [236, 138, 95], Aa: [242, 162, 116], C: [185, 138, 124] };
  var COPPER = [224, 102, 60], GOLD = [255, 205, 140], PEACH = [236, 138, 95], HOT = [255, 236, 206];
  var CFG = { U: 6.0, UB: 3.65, lo: 1.5, hi: 46.5, far: 0.55, hold: [0.6, 2.0], sp: [0.4, 0.7], vmax: 5.0, vheld: 10, wid: 1, hot: 0.6, hotA: 0.5, warmA: 0.75, tail: 0, glow: 1 };
  var eoF = function (k) { return 1 - Math.pow(1 - k, 3); };
  var gF = function (x, s) { return Math.exp(-(x * x) / (2 * s * s)); };
  var pulse = function (tau, a, r) { if (tau < 0) return 0; if (RM) return tau < 200 ? 1 : 0; return tau < a ? eoF(tau / a) : tau < a + r ? 1 - eio((tau - a) / r) : 0; };
  var sn = function (t, s) { return Math.sin(t * 0.37 + s) * 0.5 + Math.sin(t * 0.61 + s * 1.7) * 0.3 + Math.sin(t * 1.13 + s * 2.3) * 0.2; };
  var rng = function (seed) { var x = seed | 0 || 7; return function () { x ^= x << 13; x ^= x >>> 17; x ^= x << 5; return ((x >>> 0) % 100000) / 100000; }; };
  var SEED = (Math.random() * 2147483647) | 0 || 7;
  var FX = new Float32Array(1200), FY = new Float32Array(1200), FPX = new Float32Array(1200), FPY = new Float32Array(1200), FW = new Float32Array(1200), FAL = new Float32Array(1200), FLT = new Float32Array(1200);
  function stripF(ctx, n, Wd, Al, col, extra, scaleA, caps) {
    var i, k, j;
    if (n > 2) {
      var mono = true; for (i = 1; i < n; i++) if (FPX[i] < FPX[i - 1] - 0.01) { mono = false; break; }
      if (mono) {
        var any = false; for (i = 0; i < n; i++) if (Al[i] * scaleA > 0.002) { any = true; break; }
        if (!any) return;
        var x0 = FPX[0], x1 = FPX[n - 1], span = x1 - x0 || 1, gr = ctx.createLinearGradient(x0, 0, x1, 0), step = Math.max(1, Math.floor(n / 160));
        for (i = 0; i < n; i += step) gr.addColorStop(Math.min(1, Math.max(0, (FPX[i] - x0) / span)), "rgba(" + col + "," + Math.min(1, Al[i] * scaleA).toFixed(4) + ")");
        gr.addColorStop(1, "rgba(" + col + "," + Math.min(1, Al[n - 1] * scaleA).toFixed(4) + ")");
        var p = new Path2D(), w, tx, ty, l, r, c, sv, f;
        for (i = 0; i < n; i++) { w = (Wd[i] + extra) / 2; var x = FPX[i] + FX[i] * w, y = FPY[i] + FY[i] * w; if (i) p.lineTo(x, y); else p.moveTo(x, y); }
        if (caps) { i = n - 1; k = n - 2; tx = FPX[i] - FPX[k]; ty = FPY[i] - FPY[k]; l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l; r = (Wd[i] + extra) / 2;
          for (j = 1; j < 8; j++) { f = (j / 8) * Math.PI; c = Math.cos(f); sv = Math.sin(f); p.lineTo(FPX[i] + (FX[i] * c + tx * sv) * r, FPY[i] + (FY[i] * c + ty * sv) * r); } }
        for (i = n - 1; i >= 0; i--) { w = (Wd[i] + extra) / 2; p.lineTo(FPX[i] - FX[i] * w, FPY[i] - FY[i] * w); }
        if (caps) { i = 0; k = 1; tx = FPX[i] - FPX[k]; ty = FPY[i] - FPY[k]; l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l; r = (Wd[i] + extra) / 2;
          for (j = 1; j < 8; j++) { f = (j / 8) * Math.PI; c = Math.cos(f); sv = Math.sin(f); p.lineTo(FPX[i] - (FX[i] * c - tx * sv) * r, FPY[i] - (FY[i] * c - ty * sv) * r); } }
        p.closePath(); ctx.fillStyle = gr; ctx.fill(p); return;
      }
    }
    var bk = new Map(), QN = 128;
    var get = function (al) { var q = Math.min(QN * 1.4 | 0, Math.round(al * QN)); if (q <= 0 || q * scaleA < 0.35) return null; var pp = bk.get(q); if (!pp) { pp = new Path2D(); bk.set(q, pp); } return pp; };
    for (i = 0; i < n - 1; i++) {
      var pq = get((Al[i] + Al[i + 1]) * 0.5); if (!pq) continue;
      var w0 = (Wd[i] + extra) / 2, w1 = (Wd[i + 1] + extra) / 2;
      pq.moveTo(FPX[i] + FX[i] * w0, FPY[i] + FY[i] * w0); pq.lineTo(FPX[i + 1] + FX[i + 1] * w1, FPY[i + 1] + FY[i + 1] * w1);
      pq.lineTo(FPX[i + 1] - FX[i + 1] * w1, FPY[i + 1] - FY[i + 1] * w1); pq.lineTo(FPX[i] - FX[i] * w0, FPY[i] - FY[i] * w0); pq.closePath();
    }
    if (caps && n > 1) [[0, 1], [n - 1, n - 2]].forEach(function (ik) {
      var a = ik[0], b = ik[1], pp = get(Al[a]); if (!pp) return;
      var tx2 = FPX[a] - FPX[b], ty2 = FPY[a] - FPY[b], l2 = Math.hypot(tx2, ty2) || 1; tx2 /= l2; ty2 /= l2;
      var r2 = (Wd[a] + extra) / 2, nx = FX[a], ny = FY[a]; pp.moveTo(FPX[a] + nx * r2, FPY[a] + ny * r2);
      for (var jj = 1; jj < 8; jj++) { var ff = (jj / 8) * Math.PI, cc = Math.cos(ff), ss2 = Math.sin(ff); pp.lineTo(FPX[a] + (nx * cc + tx2 * ss2) * r2, FPY[a] + (ny * cc + ty2 * ss2) * r2); }
      pp.lineTo(FPX[a] - nx * r2, FPY[a] - ny * r2); pp.closePath();
    });
    bk.forEach(function (pp, q) { ctx.fillStyle = "rgba(" + col + "," + Math.min(1, q / QN * scaleA).toFixed(4) + ")"; ctx.fill(pp); });
  }
  function drawLineF(ctx, L, o) {
    var n = L.n, X = L.X, Y = L.Y, S = L.S, i;
    for (i = 0; i < n; i++) {
      var a = i > 0 ? i - 1 : 0, b = i < n - 1 ? i + 1 : n - 1, tx = X[b] - X[a], ty = Y[b] - Y[a], l = Math.hypot(tx, ty) || 1; tx /= l; ty /= l;
      FX[i] = L.dir * ty; FY[i] = -L.dir * tx; FPX[i] = X[i]; FPY[i] = Y[i];
      FW[i] = typeof o.w === "number" ? o.w : o.w(S[i], i); FAL[i] = cl(typeof o.a === "number" ? o.a : o.a(S[i], i));
    }
    stripF(ctx, n, FW, FAL, cs(o.col), 0, 1, !L.closed);
    (o.lights || []).forEach(function (lt) {
      for (var j = 0; j < n; j++) FLT[j] = cl(lt.l(S[j], j), 0, 1.4);
      var lc = cs(lt.c);
      stripF(ctx, n, FW, FLT, lc, 0, 0.9, !L.closed); stripF(ctx, n, FW, FLT, lc, 2.6, 0.2, !L.closed); stripF(ctx, n, FW, FLT, lc, 7, 0.07, !L.closed);
    });
  }
  function glowF(ctx, x, y, rx, ry, c, a) {
    if (a <= 0.003) return; var r = Math.max(rx, ry), gr = ctx.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, "rgba(" + cs(c) + "," + a + ")"); gr.addColorStop(0.45, "rgba(" + cs(c) + "," + a * 0.42 + ")"); gr.addColorStop(1, "rgba(" + cs(c) + ",0)");
    ctx.save(); ctx.translate(x, y); ctx.scale(rx / r, ry / r); ctx.translate(-x, -y); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore();
  }
  function newFire(cfg) {
    var R = rng(SEED), mk = function (o) { return Object.assign({ x: 24, vx: 0, a: 1, r: 18, e: 0.6, t: 0, s: R() * 9, tx: 24, hold: 2, sp: 0.4 }, o); };
    var F = { R: R, T: 0, last: null, dir: 0, mood: { k: "wander", left: 6 + R() * 9, blend: 1 }, A: mk({}), B: mk({ a: 0, r: 14, s: R() * 9 + 4 }), sparks: [] };
    F.A.x = cfg.lo + R() * (cfg.hi - cfg.lo); F.A.tx = cfg.lo + R() * (cfg.hi - cfg.lo);
    if (cfg.far > 0) F.A.tx = F.A.x < 24 ? lerp(30, cfg.hi, F.A.tx / 48) : lerp(cfg.lo, 18, F.A.tx / 48);
    F.B.tx = F.A.x; return F;
  }
  function fireStep(P, E, cfg) {
    var F = P.fire || (P.fire = newFire(cfg));
    var t = E.t, dts = RM ? 0 : cl((t - (F.last == null ? t : F.last)) / 1000, 0, 0.05); F.last = t; F.T += dts;
    var R = F.R, U = cfg.U, span = cfg.hi - cfg.lo;
    var newTarget = function (sp) { var x;
      if (cfg.far > 0) { var side = R() < 0.9 ? (sp.x < 24 ? 1 : -1) : (R() < 0.5 ? 1 : -1), half = (cfg.hi - cfg.lo) / 2; x = 24 + side * (4 + (half - 4) * Math.sqrt(R())); }
      else x = cfg.lo + R() * span;
      sp.tx = x; sp.hold = cfg.hold[0] + R() * (cfg.hold[1] - cfg.hold[0]); sp.sp = cfg.sp[0] + R() * (cfg.sp[1] - cfg.sp[0]); };
    var stepSpot = function (sp, fast) {
      sp.t += dts; var nx = sn(sp.t * 0.9, sp.s) * 2.2 * (fast ? 0.3 : 1), k = fast ? 2.4 : sp.sp;
      sp.vx += ((sp.tx - sp.x) * 0.6 - sp.vx * 1.4) * dts * k * (fast ? 2.2 : 1);
      var capV = fast ? cfg.vheld : cfg.vmax; if (sp.vx > capV) sp.vx = capV; else if (sp.vx < -capV) sp.vx = -capV;
      sp.x += sp.vx * dts + nx * dts; sp.x = cl(sp.x, 0.5, 47.5);
      sp.e = 0.5 + 0.5 * (0.5 + 0.5 * sn(sp.t * 1.25, sp.s + 3));
      if (!fast && Math.abs(sp.tx - sp.x) < 1.5) { sp.hold -= dts; if (sp.hold <= 0) newTarget(sp); }
    };
    var M = F.mood; M.left -= dts;
    if (M.left <= 0) { var ks = ["wander", "split", "flare", "rest"], nk; do nk = ks[(R() * 4) | 0]; while (nk === M.k); M.k = nk; M.left = 6 + R() * 9; M.blend = 0; }
    M.blend = Math.min(1, M.blend + dts * 0.35);
    var A = F.A, B = F.B, held = E.fvis || E.sT >= 0;
    if (held) A.tx = 24 + cl(E.caretS, -120, 120) / U;
    stepSpot(A, held); stepSpot(B, false);
    var wantB = !held && M.k === "split" ? 1 : 0, wantA = held ? 1 : M.k === "rest" ? 0.35 : 1, flare = held ? 0.35 : M.k === "flare" ? 1 : 0, ka = RM ? 1 : dts * 0.5;
    B.a += (wantB - B.a) * ka; A.a += (wantA - A.a) * ka * (held ? 2.4 : 1);
    if (M.k !== "split" || held) B.tx = A.x + (R() - 0.5) * 2;
    A.r = 16 + 6 * A.e + 5 * flare * M.blend; B.r = 13 + 4 * B.e;
    if (RM) { A.x = held ? A.tx : 24; A.e = 0.75; B.a = 0; }
    F.dir += (cl(A.vx / 2, -1, 1) - F.dir) * dts * 1.2; F.flare = flare * M.blend; F.U = U; F.dts = dts;
    return F;
  }
  function sparksF(ctx, F, emit, E) {
    var S = F.sparks;
    emit.forEach(function (em) { if (!RM && F.dts > 0 && F.R() < F.dts * em[2]) S.push({ x: em[0] - 5 + F.R() * 10, y: em[1], v: 6 + F.R() * 6, l: 0, L: 1.4 + F.R() * 1.2, w: F.R() * 6, y0: em[1] }); });
    for (var k = S.length - 1; k >= 0; k--) {
      var s = S[k]; s.l += F.dts; s.y -= s.v * F.dts; var rise = s.y0 - s.y;
      if (s.l > s.L || rise > 13) { S.splice(k, 1); continue; }
      var a = Math.sin(Math.PI * Math.min(1, s.l / s.L)) * (1 - rise / 13) * (1 - E.e);
      ctx.fillStyle = "rgba(" + cs(GOLD) + "," + (0.8 * a).toFixed(3) + ")"; ctx.beginPath(); ctx.arc(s.x + 1.2 * Math.sin(s.l * 2.6 + s.w), s.y, 0.7, 0, 7); ctx.fill();
    }
    if (S.length > 24) S.splice(0, S.length - 24);
  }
  function fireRender(ctx, E, Q) {
    var cfg = CFG, t = E.t, f = E.f, e = E.e, pr = E.pr, sT = E.sT, ok = sT >= 0, F = fireStep(E.P, E, cfg), U = F.U, A = F.A, B = F.B;
    var act2 = function (k) { return mix(E.A, E.Aa, k); };
    var c = pr; if (ok) c = Math.max(c, eio(prog(sT, 380)));
    var k = ok ? eoF(prog(sT, 600)) : 0, cool = 1 - 0.85 * e, ry = lerp(lerp(7, 10.5, f), 1.6, e);
    var sA = (A.x - 24) * U, sB = (B.x - 24) * cfg.UB, sgA = A.r * 5.6 * 0.3 * cfg.wid, eA = A.e + 0.25 * F.flare;
    var marks = E.keys.map(function (q) { var tau = t - q.t; return [E.markS(q.n - 1), 0.5 * pulse(tau, 90, 650) + 0.2 * prog(tau, 260)]; });
    var IA = A.a * (0.42 + 0.3 * eA) * cool * (1 - 0.5 * c), tailC = sA - F.dir * 0.95 * sgA, tailS = 1.3 * sgA, tailA = 0.42 * cfg.tail;
    var hotF = function (s) { return cfg.hotA * IA * gF(s - sA, sgA * cfg.hot); };
    var warmF = function (s) { var u = IA * cfg.warmA * gF(s - sA, sgA) + IA * tailA * gF(s - tailC, tailS); marks.forEach(function (m) { u += m[1] * gF(s - m[0], 10); }); return u * cool * (1 - 0.4 * c) + (ok ? 0.3 * k : 0); };
    var oF = Q.FO(ry), LF = lens(oF);
    drawLineF(ctx, trace(Q.cxF, Q.yF, 1, oF, LF.L2, oF, LF.L2), {
      w: function (s) { return 1.2 + 0.45 * hotF(s) / (cfg.hotA / 0.5) + 0.2 * k; }, a: Math.max(0.62, lerp((0.74 + 0.24 * f) * (1 - 0.15 * e), 1, k)), col: mix(act2(f), E.C, e),
      lights: [{ l: warmF, c: mix(PEACH, E.C, e) }, { l: hotF, c: mix(mix(GOLD, HOT, 0.2 * eA), E.C, e) }] });
    var oB = Q.bO(c), LB = lens(oB), hB = lerp(cl(LB.L2, 2, LB.L5), LB.L5, c), BT = trace(Q.cxB, Q.yB, -1, oB, hB, oB, hB);
    var IB = B.a * (0.4 + 0.3 * B.e) * cool, sgB = 26 * (1 + 0.6 * (cfg.wid - 1));
    var runB = function (s) { return 0.5 * c * (1 - ss(hB - 22, hB + 2, Math.abs(s))) + 0.4 * c * gF(s, 28) + (ok ? 0.25 * k : 0); };
    drawLineF(ctx, BT, {
      w: function (s) { return 1.2 + 0.4 * IB * gF(s - sB, 22) + 0.25 * c * gF(s, 30); }, a: lerp((0.84 + 0.16 * c) * (1 - 0.12 * e), 1, k), col: mix(act2(Math.max(c, 0.4 * f)), E.C, 0.75 * e),
      lights: [{ l: function (s) { return (IB * 0.8 * gF(s - sB, sgB) + runB(s)) * cool; }, c: PEACH }, { l: function (s) { return IB * gF(s - sB, 13) * cool + 0.35 * c * gF(s, 16); }, c: mix(GOLD, HOT, 0.3) }] });
    var gE = Math.min(1, A.a * (0.6 + 0.4 * A.e) + 0.3 * F.flare) * cool * (1 - 0.5 * c);
    glowF(ctx, Q.cxF + sA, Q.yF + 1, sgA * 1.5, 6 + 2 * gE, mix(COPPER, GOLD, 0.25 + 0.4 * gE), (0.08 + 0.12 * gE) / Math.sqrt(cfg.glow));
    if (IB > 0.02) glowF(ctx, Q.cxB + sB, Q.yB + 1, 34 * Math.sqrt(cfg.glow), 5, mix(COPPER, GOLD, 0.3), 0.12 * IB / 0.7);
    if (c > 0.02) glowF(ctx, Q.cxB, Q.yB + 18, 100, 22, mix(COPPER, GOLD, 0.35), 0.07 * c * cool);
    var lk = E.keys.length ? E.keys[E.keys.length - 1] : null;
    sparksF(ctx, F, [[Q.cxF + sA, Q.yF - 1, (0.15 + 0.6 * gE) * (E.fvis ? 0.5 : 1)], [Q.cxB + sB, Q.yB - 1, 0.4 * IB], [Q.cxB, Q.yB - 1, 1.6 * c * (ok ? 1 - k : 1)]].concat(lk ? [[Q.cxF + E.markS(lk.n - 1), Q.yF - 1, 5 * pulse(t - lk.t, 60, 300)]] : []), E);
  }
  /* the canvas covers the field and the button with room for the line's ends; positions are layout px in the box */
  var MX = 72, MY = 56;
  function render(t) {
    var fx = field.offsetLeft, fy = field.offsetTop, fw = field.offsetWidth, fh = field.offsetHeight;
    var bx = btn.offsetLeft, by = btn.offsetTop, bw = btn.offsetWidth, bh = btn.offsetHeight;
    if (!fw || !bw) return;
    var x0 = Math.min(fx, bx) - MX, y0 = fy - MY, x1 = Math.max(fx + fw, bx + bw) + MX, y1 = by + bh + MY;
    var dpr = Math.min(3, window.devicePixelRatio || 1), Wc = Math.round((x1 - x0) * dpr), Hc = Math.round((y1 - y0) * dpr);
    var d = door(), key = [x0, y0, x1, y1, dpr, d].join("|");
    if (key !== geoKey) {
      geoKey = key;
      cv.style.left = x0 + "px"; cv.style.top = y0 + "px"; cv.style.width = (x1 - x0) + "px"; cv.style.height = (y1 - y0) + "px";
      if (cv.width !== Wc || cv.height !== Hc) { cv.width = Wc; cv.height = Hc; }
      moved();
    }
    var G = GATES[d];
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height);
    if (window.__sbInvBlank) return;                                   // test hook: the backing only (contrast capture)
    ctx.setTransform(dpr, 0, 0, dpr, -x0 * dpr, -y0 * dpr); ctx.globalCompositeOperation = "lighter";
    /* the approved geometry, measured on the real field (300 × 46) and button (≈186 × 44) */
    var FO = function (ry) { return { hw: fw / 2 - 1, rx: 11, ry: ry, D: fh }; };
    var FL2 = lens(FO(7)).L2, hwb = bw / 2 - 1;
    var bO = function (c) { var m = eio(cl(c * 1.35)); return { hw: lerp(hwb, hwb - 2, m), rx: lerp(11, 18, m), ry: lerp(10, 18, m), D: 36 }; };
    var f = st.focus.val(t), pr = st.press.val(t), nS = st.nS.val(t), e = errE(t - st.tErr), sT = st.tSucc > -1e8 ? t - st.tSucc : -1;
    if (d === "shifr") {                                                 // «Живой огонь», variation 1 «Дальше» (inversiya/ogon-var-src.html)
      var gp = 19, room = fw - 46, cap = Math.floor(room / gp) + 1, first = -(cap - 1) * gp / 2;   // the shell's fixed mark slots (marks never move)
      fireRender(ctx, { t: t, P: FS, f: f, pr: pr, nS: nS, e: e, sT: sT, fvis: fvis, keys: keys, caretS: first + (nS - 1) * gp + Math.max(6, gp * 0.6), markS: function (i) { return first + i * gp; }, A: OG.A, Aa: OG.Aa, C: OG.C },
        { cxF: fx + fw / 2, yF: fy + fh - 1, FO: FO, cxB: bx + bw / 2, yB: by + (bh - 36) / 2, bO: bO });
      gate.classList.toggle("vg-inv-fv", fvis); return;
    }
    /* VARIANTS[4] «Перетекание» */
    var ok = sT >= 0, nn = Math.min(nS, 6);
    var extF = 6 * f - 2.4 * nn, extB = -6 * f + 2.4 * nn;
    extF = lerp(extF, -14.4, e); extB = lerp(extB, -16, e);
    var c = pr; if (ok) c = Math.max(c, eio(prog(sT, 420)));
    var o = bO(c), L = lens(o), hB0 = cl(L.L2 + extB, 2, L.L5), hB = lerp(hB0, L.L5, c);
    var total = FL2 + extF + hB0, hF = Math.max(48, total - hB);
    var k = ok ? eo(prog(sT - 250, 500)) : 0;
    var lineY = fy + fh - 1, byA = by + (bh - 36) / 2;
    drawLine(ctx, trace(fx + fw / 2, lineY, 1, FO(7), hF, FO(7), hF), { w: 1.2 + 0.15 * k, a: Math.max(0.62, lerp((0.7 + 0.26 * f) * (1 - 0.2 * e) + 0.1 * c, 1, k)), col: mix(mix(G.A, G.C, e), G.T, 0.3 * k) }   /* floor 0.62: the error line keeps ≥ 3:1 (Шифр) */);
    drawLine(ctx, trace(bx + bw / 2, byA, -1, o, hB, o, hB), { w: 1.2 + 0.15 * k, a: lerp((0.82 + 0.18 * c) * (1 - 0.15 * e), 1, k), col: mix(mix(G.A, G.C, 0.65 * e), G.T, 0.3 * k) });
    gate.classList.toggle("vg-inv-fv", fvis);
  }
  window.addEventListener("resize", function () { act(now(), 300); });
  if (window.visualViewport) window.visualViewport.addEventListener("resize", function () { act(now(), 300); });
  if (RMQ.addEventListener) RMQ.addEventListener("change", function () { act(now(), 50); });
  /* the gate may be rebuilt (language, door): look again now and then, cheaply */
  setInterval(function () { if (!gate || !gate.isConnected || !cv || !cv.isConnected) act(now(), 50); else if (on()) { var k = [field.offsetLeft, field.offsetTop, field.offsetWidth, btn.offsetTop, btn.offsetWidth].join("|"); if (k !== (frame.k || "")) { frame.k = k; act(now(), 50); } } }, 400);
  act(now(), 50);
  window.__sbInv = { state: function () { return { n: n, f: st.focus.val(now()), pr: st.press.val(now()), e: errE(now() - st.tErr), ok: st.tSucc > -1e8, door: door(), on: on() }; } };
})();
/* ── D-606: вход ── */
/* sys.baby — ВХОД. Три варианта того, как после знака появляется зал «Шифр». Источник света — ЗА знаком
   (основатель: «наш логотип должен освещать всю сцену»): знак чистый и сплошной, сквозь его прорезь не идёт ничего;
   свет выходит из-за его силуэта — по краям и в двух угловых выемках, где сходятся половины, — и освещает зал от знака.
   Как это сделано (дёшево: два холста поверх настоящих ворот, без смешиваний слоёв и без фильтров по большим площадям):
   · «тьма» — холст во весь экран (1 точка CSS на пиксель): поле экспозиции 1/4 разрешения считается в JS
     (vis = 1 − e^(−E·f(d)·haze), f — спад ~ 1/(1 + (d/r0)²) от знака, haze — плотность воздуха), растягивается
     билинейно, плюс свет в воздухе (рассеяние), сложением; при выдержке 1 тьма прозрачна — под ней настоящие ворота;
   · знак — свой небольшой холст в точном прямоугольнике знака Шифра (2× плотность): корона/ободок — силуэт знака,
     размытый один раз при подготовке (тень холста), тело вырезано; поверх — сам чистый знак;
   · 2: лучи — полярная таблица: из-за края знака (доля источника, видимая за силуэтом под этим углом), сквозь печати
     колеса (их настоящая альфа — тени в луче), в неоднородном воздухе; пыль светится только в лучах;
   · 3: печати решётки (настоящие пиксели решётки) открываются по одной, когда до них доходит фронт рассвета.
   В конце всё сводится к обычному виду ворот, и холсты убираются. Касание — сразу в конец. Скрытая вкладка — пауза.
   «Уменьшить движение» — спокойная смена: знак → зал. */
(function () {
"use strict";
var W = window, D = document, H = D.documentElement;
var VARS = [
  { n: "Корона", d: "Свет загорается за знаком, как при затмении: искра в угловой выемке, тонкий ободок по краю, корона — и волна света уходит по колесу и решётке.", dur: 3700 },
  { n: "Лучи", d: "Из-за знака в пыльный воздух веером расходятся лучи — сквозь печати колеса, с тенями от них, — и ложатся на пол, бегут по его сетке.", dur: 3900 },
  { n: "Выдержка", d: "Медленный рассвет, как на плёнке: свет из-за знака поднимает экспозицию зала волной, печати загораются одна за другой, как окна города в сумерках, отражения в полу — последними.", dur: 4000 },
  // the hybrids (founder: «совместите первый с третьим и добавьте свет и лучи из второго»)
  { n: "Затмение и рассвет", d: "Сначала затмение: искра в угловой выемке, ободок обегает край, корона — из короны вырываются лучи в пыльный воздух, сквозь печати колеса, а волна рассвета зажигает печати решётки одну за другой; пол и отражения — последними.", dur: 4220 },
  { n: "Рассвет в лучах", d: "Сначала рассвет: экспозиция зала поднимается волной, печати загораются, как окна в сумерках, в нём медленно растут лучи и ложатся на пол; в конце свет стягивается к знаку — искра в выемке и ободок, как последний контакт затмения.", dur: 4370 },
  { n: "Восход", d: "Лучи и рассвет — с первого мгновения, вокруг знака мягкий ровный ореол: печати решётки, на которые падает луч, загораются первыми, те, что в тени печатей колеса, — позже; свет ложится на пол.", dur: 4170 }
];
var sm = function (a, b, x) { var t = (x - a) / (b - a); t = t < 0 ? 0 : t > 1 ? 1 : t; return t * t * (3 - 2 * t); };
var cl = function (x, a, b) { return x < a ? a : x > b ? b : x; };
var now = function () { return W.performance.now(); };
function rng(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function noise(r, cells) {
  var c = cells + 1, L = new Float32Array(c * c); for (var i = 0; i < L.length; i++) L[i] = r();
  return function (x, y) { var fx = cl(x, 0, 0.99999) * cells, fy = cl(y, 0, 0.99999) * cells, x0 = fx | 0, y0 = fy | 0, tx = fx - x0, ty = fy - y0; tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
    return (L[y0 * c + x0] * (1 - tx) + L[y0 * c + x0 + 1] * tx) * (1 - ty) + (L[(y0 + 1) * c + x0] * (1 - tx) + L[(y0 + 1) * c + x0 + 1] * tx) * ty; };
}

/* ── the clean mark («закрыт»): the approved geometry geo(0,0,100,25,20,8.68), in a 100-unit box ── */
var MB = 25, MRo = 20, MRi = 8.68, INK = "#f2f0ec", ORG = "#e0663c", VOID = "#0b0706";
function lpath(x0, y0, s, rot) {           // the light corner (rot: the dark-orange corner, the same turned 180°)
  var k = s / 100, p = new Path2D();
  var X = function (u) { return x0 + (rot ? 100 - u : u) * k; }, Y = function (v) { return y0 + (rot ? 100 - v : v) * k; }, A = rot ? Math.PI : 0;
  p.moveTo(X(MRo), Y(0)); p.lineTo(X(75), Y(0)); p.lineTo(X(75), Y(25)); p.lineTo(X(25 + MRi), Y(25));
  p.arc(X(25 + MRi), Y(25 + MRi), MRi * k, -Math.PI / 2 + A, Math.PI + A, true);
  p.lineTo(X(25), Y(75)); p.lineTo(X(0), Y(75)); p.lineTo(X(0), Y(MRo));
  p.arc(X(MRo), Y(MRo), MRo * k, Math.PI + A, 1.5 * Math.PI + A, false); p.closePath();
  return p;
}
/* The clean mark is drawn with the Шифр sign's OWN outline (shifr.js markPaths: the 512-unit icon, sign box 130…382,
   radii 36 / 44, the orange inner fillet 16), so that at the hand-over the two coincide edge for edge and only the
   colours of the three parts change: light corner → the gate's left plate, orange corner → its right plate,
   the closed hollow → the gate's hollow. (The «закрыт» render differs from it by 1–2 px at the corners.) */
/* ═══ SIGN — the Шифр sign's outline, the ONE place it lives here. It is the sign's own geometry as the gate draws
   it now (shifr.js api.sign(), 04.11: the clean mark's geometry, zakryt geo(0,0,100,25,20,8.68) — bars 25, outer
   corners r 20, the hollow's two inner corners filleted r 8.68, the halves corner to corner at (75,25) and (25,75)).
   If the sign changes again, change this table and nothing else. Units: sign box box[0]…box[1].
   M/L: move/line to (u, v); A: arcTo(corner u, v, to u, v, radius); Z: close. hollow: [u0, v0, u1, v1].
   __vhod.signCheck() reports any disagreement between this table and the live sign's own pixels. ═══ */
var SIGN = {
  box: [0, 100],
  w: [["M", 20, 0], ["L", 75, 0], ["L", 75, 25], ["L", 42.36, 25], ["A", 25, 25, 25, 42.36, 8.68], ["L", 25, 75], ["L", 0, 75], ["L", 0, 20], ["A", 0, 0, 20, 0, 20], ["Z"]],
  o: [["M", 80, 100], ["L", 25, 100], ["L", 25, 75], ["L", 57.64, 75], ["A", 75, 75, 75, 57.64, 8.68], ["L", 75, 25], ["L", 100, 25], ["L", 100, 80], ["A", 100, 100, 80, 100, 20], ["Z"]],
  hollow: [25, 25, 75, 75]
};
function signPaths(x0, y0, s) {
  var b0 = SIGN.box[0], k = s / (SIGN.box[1] - b0), X = function (u) { return x0 + (u - b0) * k; }, Y = function (v) { return y0 + (v - b0) * k; };
  var mk = function (ops) { var p = new Path2D(); ops.forEach(function (o) { if (o[0] === "M") p.moveTo(X(o[1]), Y(o[2])); else if (o[0] === "L") p.lineTo(X(o[1]), Y(o[2])); else if (o[0] === "A") p.arcTo(X(o[1]), Y(o[2]), X(o[3]), Y(o[4]), o[5] * k); else p.closePath(); }); return p; };
  var h = SIGN.hollow;
  return { w: mk(SIGN.w), o: mk(SIGN.o), hx: X(h[0]), hy: Y(h[1]), hw: (h[2] - h[0]) * k, hh: (h[3] - h[1]) * k };
}
function drawClean(g, x0, y0, s) {
  var P = signPaths(x0, y0, s);
  g.fillStyle = VOID; g.fillRect(P.hx, P.hy, P.hw, P.hh);
  g.fillStyle = INK; g.fill(P.w);
  g.fillStyle = ORG; g.fill(P.o);
}
function fillBody(g, x0, y0, s) { var P = signPaths(x0, y0, s); g.fillRect(P.hx, P.hy, P.hw, P.hh); g.fill(P.w); g.fill(P.o); }
function inW(x, y) {
  if (!((x >= 0 && x < 75 && y >= 0 && y < 25) || (x >= 0 && x < 25 && y >= 0 && y < 75))) return x >= 25 && x < 25 + MRi && y >= 25 && y < 25 + MRi && Math.hypot(x - 25 - MRi, y - 25 - MRi) > MRi;
  if (x < MRo && y < MRo) return Math.hypot(x - MRo, y - MRo) <= MRo;
  return true;
}
function inBody(x, y) { return inW(x, y) || inW(100 - x, 100 - y) || (x >= 25 && x <= 75 && y >= 25 && y <= 75); }
/* for each direction: how far the silhouette reaches (EDGE, units of 100), and how much of the light disc behind it
   (radius 60) shows past the silhouette there (ESC): most at the two corner notches, some off the flat sides, none
   past the rounded corners. */
var NA = 1024, EDGE = new Float32Array(NA), ESC = new Float32Array(NA);
(function () {
  for (var a = 0; a < NA; a++) {
    var th = a / NA * 2 * Math.PI, c = Math.cos(th), s = Math.sin(th), e = 0;
    for (var r = 0; r < 72; r += 0.25) if (inBody(50 + c * r, 50 + s * r)) e = r;
    EDGE[a] = e;
  }
  for (var b = 0; b < NA; b++) {         // a little angular smoothing: the source is a disc, not a point
    var m = 0, n = 0; for (var q = -10; q <= 10; q++) { var w = 1 - Math.abs(q) / 11; m += w * cl((60 - EDGE[(b + q + NA) % NA]) / 25, 0, 1); n += w; }
    ESC[b] = m / n;
  }
})();

/* ── the page ── */
if (!H.classList.contains("vh-playing")) { var ov0 = D.getElementById("vhOv"); if (ov0 && ov0.parentNode) ov0.parentNode.removeChild(ov0); return; }   // D-606: the page decides before its first frame (os/index.html); no entry — its layer leaves the page
var ov = D.getElementById("vhOv"); if (!ov) return;
var dk = ov.querySelector(".vh-dark"), mk = ov.querySelector(".vh-mark"), dg = dk.getContext("2d"), mg = mk.getContext("2d");
var tabs = [].slice.call(D.querySelectorAll("#vhTabs button")), descEl = D.getElementById("vhDesc"), again = D.getElementById("vhAgain");
/* in a product page (the final demo) the page sets window.__vhodConfig = { variant: 4 } before this script: one variant,
   no tabs, no replay, nothing written to the address */
var CFG = { variant: 4 };   // D-606: «Затмение и рассвет»
var V = CFG && CFG.variant ? +CFG.variant : (function () { var m = /^#v?([1-6])$/.exec(location.hash || ""); return m ? +m[1] : 1; })();
var st = "wait", t0 = 0, raf = 0, G = null, PREP = {}, frozen = null, pausedAt = 0, frames = [], lastF = 0, RMnow = false, holdAt = 0, calm = [], onReady = null;
var DPR = 1, costs = [], waitAt = 0, switchUntil = 0;
/* «полный / короткий»: the full entry on the first visit of the day, the short one (~1 s) otherwise; the toggle overrides */
var TODAY = (function () { var d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); })(), MODE = "full";
try { if (W.localStorage && localStorage.getItem("sysbaby.entry.day") === TODAY) MODE = "short"; } catch (e) { /* no storage: full */ }
var lens = [].slice.call(D.querySelectorAll("#vhLen button"));

function scene() { return D.getElementById("sbVaultScene"); }
/* where Шифр draws its sign (scene px): the scene says it on its own root, data-mark="x,y,side" (D-606) */
function MARK() { var e = D.querySelector("#sbVaultScene [data-mark]"); if (!e) return null; var a = String(e.getAttribute("data-mark")).split(",").map(Number); return a.length === 3 && a[2] > 0 ? { x: a[0], y: a[1], side: a[2] } : null; }
function gateUI() { var g = D.getElementById("sbVaultGate"); return g ? [].slice.call(g.querySelectorAll(".vg-box, .vg-langs, .vg-doors, .vg-remember")) : []; }
function gateReady() {
  var sc = scene();
  return !!(sc && sc.getAttribute("data-ready") === "1" && sc.getAttribute("data-door") === "shifr" && MARK() && MARK().side > 0 && sc.querySelector(".pol-bl") && sc.querySelector('canvas[data-d="blk"]'));
}
function geom() {
  var sc = scene(), r = sc.getBoundingClientRect(), m = MARK(), vw = W.innerWidth, vh = W.innerHeight;
  var bl = sc.querySelector(".pol-bl"), br = bl.getBoundingClientRect(), pw = sc.querySelector(".pol-shifr");
  var g = { vw: vw, vh: vh, x: r.left + m.x, y: r.top + m.y, s: m.side, R: br.width / 2 / 1.75 || 150, H: pw ? pw.getBoundingClientRect().top + 120 : vh * 0.6, bl: bl };
  g.Dmax = Math.max(Math.hypot(g.x, g.y), Math.hypot(vw - g.x, g.y), Math.hypot(g.x, vh - g.y), Math.hypot(vw - g.x, vh - g.y));
  g.key = [vw, vh, g.x.toFixed(2), g.y.toFixed(2), g.s.toFixed(3), Math.round(g.H)].join(",");
  return g;
}

/* ── preparation, once per size ── */
var GW = 0, GH = 0, fc = null, fx = null, FI = null, Dd = null, HZ = null, FL = null, YF = null, PO = null, DN = null;
var CMK = null, CMV = null, CMP = null, LIVE = false, MS = 0, MW = 0, MLx = 0, MLy = 0, MOX = 0, MOY = 0, SPR = {};
function prepCommon(g) {
  DPR = Math.min(2, W.devicePixelRatio || 1);
  dk.width = g.vw; dk.height = g.vh; dk.style.width = g.vw + "px"; dk.style.height = g.vh + "px";
  GW = Math.ceil(g.vw / 4) + 1; GH = Math.ceil(g.vh / 4) + 1;
  fc = D.createElement("canvas"); fc.width = GW; fc.height = GH; fx = fc.getContext("2d"); FI = fx.createImageData(GW, GH);
  var n = GW * GH, r = rng(7 + g.vw), a = noise(r, 5), b = noise(r, 13), c = noise(r, 31);
  Dd = new Float32Array(n); HZ = new Float32Array(n); FL = new Float32Array(n); YF = new Float32Array(n); PO = new Float32Array(n); DN = new Float32Array(n);
  var fh = Math.max(1, g.vh - g.H);
  for (var y = 0; y < GH; y++) for (var x = 0; x < GW; x++) {
    var i = y * GW + x, X = x * 4 + 2, Y = y * 4 + 2, u = X / g.vw, v = Y / g.vh;
    Dd[i] = Math.hypot(X - g.x, Y - g.y);
    HZ[i] = 0.55 + 0.3 * a(u, v) + 0.1 * b(u, v) + 0.05 * c(u, v);
    FL[i] = sm(g.H - 70, g.H + 70, Y);                                  // the floor begins as softly as the gate's horizon band
    YF[i] = Math.hypot((X - g.x) / (g.vw * 0.62), cl((Y - g.H) / fh, 0, 1));   // the light spreads over the floor as a widening pool, not a line
    var px = (X - g.x) / (g.vw * 0.46), py = (Y - g.H - fh * 0.06) / (fh * 0.6);
    PO[i] = Math.exp(-(px * px) - (py < 0 ? py * py * 9 : py * py));
    DN[i] = (r() + r() - 1) * 0.9 / 255;
  }
  // the mark's own canvas: exact device pixels, the mark drawn at its true fractional place inside
  MS = Math.ceil(g.s * 7.5); MW = Math.round(MS * DPR);
  MLx = Math.round(g.x - MS / 2); MLy = Math.round(g.y - MS / 2);   // whole CSS pixels: a half-pixel layer is snapped by the compositor
  MOX = g.x - g.s / 2 - MLx; MOY = g.y - g.s / 2 - MLy;
  mk.width = mk.height = MW; mk.style.width = mk.style.height = (MW / DPR) + "px"; mk.style.left = MLx + "px"; mk.style.top = MLy + "px";
  // the clean mark, rendered once into its own bitmap (the one layer of the hand-over)
  // the clean mark, rendered once into its own bitmap, with its own anti-aliased edge (the sign under it is cut out of
  // the gate's canvas while the entry runs — see holeOn — so nothing of the sign's edge shows through it)
  CMK = D.createElement("canvas"); CMK.width = CMK.height = MW; var cmx = CMK.getContext("2d"); cmx.setTransform(DPR, 0, 0, DPR, 0, 0); drawClean(cmx, MOX, MOY, g.s); LIVE = false;
  // its two layers, for the void that lightens with the hall: the void alone, and the plates alone
  var SP = signPaths(MOX, MOY, g.s);
  CMV = D.createElement("canvas"); CMV.width = CMV.height = MW; var vx = CMV.getContext("2d"); vx.setTransform(DPR, 0, 0, DPR, 0, 0); vx.fillStyle = VOID; vx.fillRect(SP.hx, SP.hy, SP.hw, SP.hh);
  CMP = D.createElement("canvas"); CMP.width = CMP.height = MW; var px2 = CMP.getContext("2d"); px2.setTransform(DPR, 0, 0, DPR, 0, 0); px2.fillStyle = INK; px2.fill(SP.w); px2.fillStyle = ORG; px2.fill(SP.o);
  // streamers of the corona: radial structure, strongest where the light escapes (the notches)
  var sw = Math.round(MW / 2), stc = D.createElement("canvas"); stc.width = stc.height = sw;
  var sg = stc.getContext("2d"), im = sg.createImageData(sw, sw), r2 = rng(99), K = [];
  for (var q = 0; q < 11; q++) K.push([5 + Math.floor(r2() * 70), r2() * 6.283, 0.25 + 0.75 * r2()]);
  var SA = new Float32Array(NA);
  for (var j = 0; j < NA; j++) { var th = j / NA * 6.283, s1 = 0, s2 = 0; for (q = 0; q < K.length; q++) { s1 += K[q][2] * Math.sin(K[q][0] * th + K[q][1]); s2 += K[q][2]; } SA[j] = Math.pow(cl(0.5 + 0.9 * s1 / s2, 0, 1), 1.3); }
  var mcx = (MOX + g.s / 2) * DPR / 2, mcy = (MOY + g.s / 2) * DPR / 2;
  for (y = 0; y < sw; y++) for (x = 0; x < sw; x++) {
    var ang = Math.atan2(y - mcy, x - mcx); if (ang < 0) ang += 6.283;
    var ai = Math.floor(ang / 6.283 * NA) % NA, al = 0.3 + 0.7 * SA[ai] * (0.45 + 0.55 * ESC[ai]);
    im.data[(y * sw + x) * 4 + 3] = (al * 255) | 0;
  }
  sg.putImageData(im, 0, 0);
  SPR.rim = sprite(g, 0.7, [255, 244, 230], null);
  SPR.inner = sprite(g, 2.6, [255, 222, 186], null);
  SPR.mid = sprite(g, 8, [255, 192, 142], stc);
  SPR.outer = sprite(g, 22, [255, 168, 116], stc);
}
// the silhouette, blurred once (a canvas shadow), its body cut out: light that spills around the mark
function sprite(g, sig, col, streak) {
  var c = D.createElement("canvas"); c.width = c.height = MW; var x = c.getContext("2d"), OFF = MW + 200;
  x.setTransform(DPR, 0, 0, DPR, -OFF, 0); x.shadowColor = "#fff"; x.shadowBlur = sig * 2 * DPR; x.shadowOffsetX = OFF; x.fillStyle = "#fff";
  fillBody(x, MOX, MOY, g.s); fillBody(x, MOX, MOY, g.s);
  x.shadowColor = "rgba(0,0,0,0)"; x.shadowBlur = 0; x.shadowOffsetX = 0;
  x.setTransform(1, 0, 0, 1, 0, 0);
  if (streak) { x.globalCompositeOperation = "destination-in"; x.drawImage(streak, 0, 0, MW, MW); }
  x.globalCompositeOperation = "source-in"; x.fillStyle = "rgb(" + col.join(",") + ")"; x.fillRect(0, 0, MW, MW);
  x.globalCompositeOperation = "destination-out"; x.setTransform(1, 0, 0, 1, 0, 0); x.drawImage(CMK, 0, 0);   // the body cut out by the mark's own final shape
  return c;
}

/* 2 · rays: a polar table (angle × radius) of the light scattered in the air */
var RNR = 0, RDR = 2, RP = null, RC = null, T2 = null, T2x = null, DUST = null, DOT = null;
function prepRays(g) {
  var s = g.s, cx = g.x, cy = g.y, NR = Math.ceil((g.Dmax + 8) / RDR) + 2, P = new Float32Array(NA * NR);
  var blk = scene().querySelector('canvas[data-d="blk"]'), Rw = g.R * 1.22, ow = Math.ceil(Rw * 2), ox0 = cx - Rw, oy0 = cy - Rw, occ = null;
  try { var oc = D.createElement("canvas"); oc.width = oc.height = ow; var ocx = oc.getContext("2d"), k = blk.width / g.vw; ocx.drawImage(blk, ox0 * k, oy0 * k, ow * k, ow * k, 0, 0, ow, ow); occ = ocx.getImageData(0, 0, ow, ow).data; } catch (e) { occ = null; }
  var r = rng(31), comps = [], i, a;
  for (i = 0; i < 12; i++) comps.push([5 + Math.floor(r() * 85), r() * 6.283, 0.3 + 0.7 * r()]);
  var ANG = new Float32Array(NA);
  for (a = 0; a < NA; a++) { var th = a / NA * 6.283, v = 0, w = 0; for (i = 0; i < comps.length; i++) { v += comps[i][2] * Math.sin(comps[i][0] * th + comps[i][1]); w += comps[i][2]; } ANG[a] = Math.pow(cl(0.5 + 0.8 * v / w, 0, 1), 1.6); }
  var hn = noise(rng(55), 9), hn2 = noise(rng(56), 23);
  for (a = 0; a < NA; a++) {
    var t = a / NA * 6.283, co = Math.cos(t), si = Math.sin(t), e = EDGE[a] * s / 100, es = ESC[a], T = 1, base = 0.12 + 0.88 * ANG[a];
    for (var kq = 0; kq < NR; kq++) {
      var rr = kq * RDR, x = cx + co * rr, y = cy + si * rr, val = 0;
      if (rr > e) {
        if (occ && rr < Rw) { var px = (x - ox0) | 0, py = (y - oy0) | 0; if (px >= 0 && py >= 0 && px < ow && py < ow) T *= 1 - 0.5 * occ[(py * ow + px) * 4 + 3] / 255; }
        var hz = 0.45 + 0.4 * hn(x / g.vw, y / g.vh) + 0.15 * hn2(x / g.vw, y / g.vh);
        val = es * T * base * hz * sm(e, e + 5, rr) / Math.pow(1 + (rr - e) / (s * 2.4), 1.3);
        val *= 1 - sm(g.H - 30, g.H + 60, y);
      }
      P[a * NR + kq] = val;
    }
  }
  // angular prefilter: near the mark many angles share one pixel — average them (no moiré), and soften every ray a little
  var tmp = new Float32Array(NA + 1);
  for (var kk = 0; kk < NR; kk++) {
    var wd = Math.max(1, Math.round(NA * 2.2 / (6.283 * Math.max(1, kk * RDR)))); if (wd > NA / 4) wd = NA / 4 | 0;
    tmp[0] = 0; for (a = 0; a < NA; a++) tmp[a + 1] = tmp[a] + P[a * NR + kk];
    for (a = 0; a < NA; a++) { var lo = a - wd, hi = a + wd + 1, sum = 0;
      if (lo < 0) sum = tmp[NA] - tmp[NA + lo] + tmp[hi]; else if (hi > NA) sum = tmp[NA] - tmp[lo] + tmp[hi - NA]; else sum = tmp[hi] - tmp[lo];
      P[a * NR + kk] = sum / (2 * wd + 1); }
  }
  RP = P; RNR = NR;
  var W2 = Math.ceil(g.vw / 2), H2 = Math.ceil(g.vh / 2);
  RC = D.createElement("canvas"); RC.width = W2; RC.height = H2; var rx = RC.getContext("2d"), im = rx.createImageData(W2, H2), dd = im.data;
  for (var yy = 0; yy < H2; yy++) for (var xx = 0; xx < W2; xx++) {
    var X = xx * 2 + 1, Y = yy * 2 + 1, vv = rayAt(X - cx, Y - cy), q = (yy * W2 + xx) * 4;
    if (vv <= 0) continue;
    var far = sm(0, g.Dmax * 0.8, Math.hypot(X - cx, Y - cy));
    dd[q] = 255; dd[q + 1] = (206 + 22 * far) | 0; dd[q + 2] = (160 + 54 * far) | 0; dd[q + 3] = Math.min(255, vv * 255) | 0;
  }
  rx.putImageData(im, 0, 0);
  T2 = D.createElement("canvas"); T2.width = W2; T2.height = H2; T2x = T2.getContext("2d");
  // dust: specks in the air; they show only where a ray passes through them; near ones are larger and softer
  DOT = D.createElement("canvas"); DOT.width = DOT.height = 32; var dx = DOT.getContext("2d"), dgr = dx.createRadialGradient(16, 16, 0, 16, 16, 16);
  dgr.addColorStop(0, "rgba(255,236,214,1)"); dgr.addColorStop(0.35, "rgba(255,226,196,.55)"); dgr.addColorStop(1, "rgba(255,220,190,0)"); dx.fillStyle = dgr; dx.fillRect(0, 0, 32, 32);
  var rd = rng(77); DUST = [];
  for (i = 0; i < 280; i++) { var z = rd(), ang = rd() * 6.283, rad = Math.sqrt(rd()) * g.Dmax * 0.75; DUST.push({ x: cx + Math.cos(ang) * rad, y: cy + Math.sin(ang) * rad * 0.9, z: z, vx: (rd() - 0.5) * 10 * (0.4 + z), vy: (rd() - 0.35) * 7 * (0.4 + z), ph: rd() * 6.283, f: 0.6 + rd() * 2.2, w: 6 + rd() * 14 }); }
}
function rayAt(dx, dy) {
  var rr = Math.hypot(dx, dy), t = Math.atan2(dy, dx); if (t < 0) t += 6.283185307;
  var fa = t / 6.283185307 * NA, a0 = Math.floor(fa) % NA, a1 = (a0 + 1) % NA, ta = fa - Math.floor(fa), fr = rr / RDR, k0 = Math.floor(fr), tr = fr - k0;
  if (k0 + 1 >= RNR) return 0;
  var p = RP, n = RNR;
  return (p[a0 * n + k0] * (1 - tr) + p[a0 * n + k0 + 1] * tr) * (1 - ta) + (p[a1 * n + k0] * (1 - tr) + p[a1 * n + k0 + 1] * tr) * ta;
}

/* 3 · the lattice's seals, found in its own pixels; each lights when the dawn reaches it */
var GM = null, GMt = null, IG = null, IGx = null, FLc = null, FLx = null, COMP = null, NFL = 0;
function prepGlyphs(g) {
  var vw = g.vw, vh = g.vh, lat = scene().querySelector('canvas[data-d="lat"]');
  var c = D.createElement("canvas"); c.width = vw; c.height = vh; var x = c.getContext("2d");
  x.drawImage(lat, 0, 0, lat.width, lat.height, 0, 0, vw, vh);
  var px = x.getImageData(0, 0, vw, vh), d = px.data, n = vw * vh, L = new Float32Array(n), i, X, Y;
  for (i = 0; i < n; i++) L[i] = 0.3 * d[i * 4] + 0.59 * d[i * 4 + 1] + 0.11 * d[i * 4 + 2];
  // the night behind the seals: the darkest of each 16 × 16 block and its neighbours
  var BS = 16, bw = Math.ceil(vw / BS), bh = Math.ceil(vh / BS), BM = new Float32Array(bw * bh).fill(255), B2 = new Float32Array(bw * bh);
  for (Y = 0; Y < vh; Y++) for (X = 0; X < vw; X++) { var bi = ((Y / BS) | 0) * bw + ((X / BS) | 0); if (L[Y * vw + X] < BM[bi]) BM[bi] = L[Y * vw + X]; }
  for (Y = 0; Y < bh; Y++) for (X = 0; X < bw; X++) { var m = 255; for (var j = -1; j <= 1; j++) for (var k = -1; k <= 1; k++) { var yy = Y + j, xx = X + k; if (yy >= 0 && xx >= 0 && yy < bh && xx < bw) m = Math.min(m, BM[yy * bw + xx]); } B2[Y * bw + X] = m; }
  var A = new Float32Array(n), Rw = g.R * 1.12, top = g.H + 6;
  for (Y = 0; Y < vh; Y++) for (X = 0; X < vw; X++) {
    i = Y * vw + X;
    if (Y > top + 30 || Math.hypot(X - g.x, Y - g.y) < Rw) continue;
    A[i] = cl((L[i] - B2[((Y / BS) | 0) * bw + ((X / BS) | 0)] - 7) / 16, 0, 1) * (1 - sm(top - 70, top + 30, Y));   // the night's grain stays below 8; the seals fade into the floor's horizon band
  }
  // the mask (crisp, the seals' own shapes)
  GM = D.createElement("canvas"); GM.width = vw; GM.height = vh; var gx = GM.getContext("2d"), gi = gx.createImageData(vw, vh);
  for (i = 0; i < n; i++) { gi.data[i * 4] = gi.data[i * 4 + 1] = gi.data[i * 4 + 2] = 255; gi.data[i * 4 + 3] = (A[i] * 255) | 0; }
  gx.putImageData(gi, 0, 0);
  // one seal = one component: the bits of a seal joined by a 2 px dilation, neighbours stay apart
  var Bm = new Uint8Array(n); for (i = 0; i < n; i++) Bm[i] = A[i] > 0.3 ? 1 : 0;
  var Dl = new Uint8Array(n);
  for (Y = 0; Y < vh; Y++) for (X = 0; X < vw; X++) { if (!Bm[Y * vw + X]) continue; for (j = -1; j <= 1; j++) for (k = -1; k <= 1; k++) { var y2 = Y + j, x2 = X + k; if (y2 >= 0 && x2 >= 0 && y2 < vh && x2 < vw) Dl[y2 * vw + x2] = 1; } }
  var lab = new Int32Array(n).fill(-1), par = [], find = function (a) { while (par[a] !== a) { par[a] = par[par[a]]; a = par[a]; } return a; };
  for (Y = 0; Y < vh; Y++) for (X = 0; X < vw; X++) {
    i = Y * vw + X; if (!Dl[i]) continue;
    var up = Y > 0 && Dl[i - vw] ? lab[i - vw] : -1, lf = X > 0 && Dl[i - 1] ? lab[i - 1] : -1;
    if (up < 0 && lf < 0) { lab[i] = par.length; par.push(par.length); }
    else if (up >= 0 && lf >= 0) { var ra = find(up), rb = find(lf); lab[i] = ra; if (ra !== rb) par[rb] = ra; }
    else lab[i] = up >= 0 ? up : lf;
  }
  var map = new Map(), C = [];
  for (Y = 0; Y < vh; Y++) for (X = 0; X < vw; X++) {
    i = Y * vw + X; if (!Bm[i]) continue; var root = find(lab[i]), o = map.get(root);
    if (!o) { o = { x0: X, y0: Y, x1: X, y1: Y, sx: 0, sy: 0, n: 0, lv: -1, fl: -1 }; map.set(root, o); C.push(o); }
    if (X < o.x0) o.x0 = X; if (X > o.x1) o.x1 = X; if (Y < o.y0) o.y0 = Y; if (Y > o.y1) o.y1 = Y; o.sx += X; o.sy += Y; o.n++;
  }
  // pieces of one seal (a seal with an empty row of bits splits) join again: boxes that together still fit one seal
  var cell = 14, grid = new Map(), keyOf = function (x, y) { return ((x / cell) | 0) + "," + ((y / cell) | 0); };
  C.forEach(function (o, idx) { o.id = idx; o.p = idx; var kk = keyOf((o.x0 + o.x1) / 2, (o.y0 + o.y1) / 2); (grid.get(kk) || grid.set(kk, []).get(kk)).push(o); });
  var fnd = function (o) { while (C[o.p] !== o) { o.p = C[C[o.p].p].p; o = C[o.p]; } return o; };
  C.forEach(function (o) {
    var gx0 = (((o.x0 + o.x1) / 2) / cell) | 0, gy0 = (((o.y0 + o.y1) / 2) / cell) | 0;
    for (var a2 = -1; a2 <= 1; a2++) for (var b2 = -1; b2 <= 1; b2++) (grid.get((gx0 + a2) + "," + (gy0 + b2)) || []).forEach(function (q) {
      if (q === o) return; var A1 = fnd(o), B1 = fnd(q); if (A1 === B1) return;
      var ux0 = Math.min(A1.x0, B1.x0), uy0 = Math.min(A1.y0, B1.y0), ux1 = Math.max(A1.x1, B1.x1), uy1 = Math.max(A1.y1, B1.y1);
      if (ux1 - ux0 <= 12 && uy1 - uy0 <= 12) { B1.p = A1.id; A1.x0 = ux0; A1.y0 = uy0; A1.x1 = ux1; A1.y1 = uy1; A1.sx += B1.sx; A1.sy += B1.sy; A1.n += B1.n; }
    });
  });
  C = C.filter(function (o) { return C[o.p] === o; });
  var rj = rng(4242);
  C.forEach(function (o) {
    var cx = o.sx / o.n, cy = o.sy / o.n; o.cx = cx; o.cy = cy; o.d = Math.hypot(cx - g.x, cy - g.y);
    o.j = rj() * 260 + (rj() < 0.14 ? 180 + rj() * 520 : 0);        // some windows come on late
    o.k = 0.7 + 0.3 * rj();                                          // and not all at once to full brightness
    o.x0 -= 1; o.y0 -= 1; o.x1 += 2; o.y1 += 2;
  });
  COMP = C;
  // the warm flash of a seal coming on: the same shapes, tinted once
  GMt = D.createElement("canvas"); GMt.width = vw; GMt.height = vh; var tx = GMt.getContext("2d"); tx.drawImage(GM, 0, 0); tx.globalCompositeOperation = "source-in"; tx.fillStyle = "rgb(255,172,112)"; tx.fillRect(0, 0, vw, vh);
  // what is open so far, kept between frames and changed only where a seal changes (one full-screen draw a frame)
  IG = D.createElement("canvas"); IG.width = vw; IG.height = vh; IGx = IG.getContext("2d");
  FLc = D.createElement("canvas"); FLc.width = vw; FLc.height = vh; FLx = FLc.getContext("2d");
}

function prepare(v) {
  G = geom(); holeOff();
  if (PREP.key !== G.key) { PREP = { key: G.key }; prepCommon(G); }   // (the clean mark reads the live sign: before the hole)
  holeOn(G);
  if ((v === 2 || v >= 4) && !PREP.rays) { prepRays(G); PREP.rays = 1; }
  if ((v === 3 || v >= 4) && !PREP.gl) { prepGlyphs(G); PREP.gl = 1; }
  if (v === 6 && !PREP.rk) {                  // «Восход»: a seal a ray falls on comes on first; one in a seal's shadow, later
    var mx = 0; COMP.forEach(function (o) { o.rb = rayAt(o.cx - G.x, o.cy - G.y) * Math.pow(Math.max(1, o.d) / G.s, 0.6); if (o.rb > mx) mx = o.rb; });
    COMP.forEach(function (o) { o.rk = 1 - 0.42 * Math.min(1, 2.2 * o.rb / Math.max(1e-6, mx)); }); PREP.rk = 1;
  }
  if (v === 3 || v >= 4) { IGx.clearRect(0, 0, G.vw, G.vh); FLx.clearRect(0, 0, G.vw, G.vh); COMP.forEach(function (o) { o.lv = -1; o.fl = -1; }); }
}

/* ── per variant: the light, as functions of e (ms since the start) ── */
function P1(e, g) {
  var s = g.s, R = g.R;
  return { E: 9.5 * Math.pow(sm(850, 3000, e), 1.5), r0: s * 0.9 + R * 2.3 * Math.pow(sm(750, 3000, e), 1.25), front: 0,
    G: 0.17 * sm(650, 1500, e) * (1 - sm(2300, 3400, e)), rg: s * 2.2, col: [255, 188, 140],
    EF: 6 * sm(1800, 3200, e), ff: 1.75 * sm(1800, 3300, e), GP: 0.05 * sm(1900, 2700, e) * (1 - sm(2900, 3600, e)),
    settle: Math.pow(sm(2450, 3600, e), 1.2), bl: sm(1500, 3300, e), hand: sm(2750, 3400, e), ui: sm(2850, 3650, e) };
}
function P2(e, g) {
  var s = g.s, R = g.R;
  return { E: 7 * Math.pow(sm(1250, 3300, e), 1.5), r0: s + R * 2.4 * Math.pow(sm(1000, 3300, e), 1.2), front: 0,
    G: 0.08 * sm(450, 1400, e) * (1 - sm(2600, 3600, e)), rg: s * 1.6, col: [255, 196, 150],
    EF: 7 * sm(1450, 3000, e), ff: 1.75 * sm(1450, 3100, e), GP: 0.11 * sm(1500, 2400, e) * (1 - sm(2900, 3800, e)),
    settle: Math.pow(sm(2750, 3850, e), 1.2), bl: sm(2000, 3600, e), hand: sm(2950, 3600, e), ui: sm(3050, 3880, e),
    rA: sm(450, 1500, e) * (1 - sm(2700, 3700, e)), rFr: s * 0.5 + (g.Dmax + 60) * Math.pow(sm(420, 2300, e), 1.25) };
}
var FR3 = function (e, g) { return g.s * 0.55 + (g.Dmax + 40) * Math.pow(sm(600, 3050, e), 1.15); };
function P3(e, g) {
  var s = g.s;
  return { E: 1.7 * sm(600, 2600, e) + 0.6 * sm(1800, 3200, e), r0: g.R * 2.8, front: FR3(e - 520, g), fw: 160, near: 4 * sm(450, 1500, e),
    G: 0.075 * sm(400, 1400, e) * (1 - sm(2900, 3800, e)), rg: s * 2.6, col: [255, 158, 98],
    EF: 5 * sm(2500, 3650, e), ff: 1.75 * sm(2500, 3800, e), GP: 0.035 * sm(2600, 3300, e) * (1 - sm(3400, 3950, e)),
    settle: Math.pow(sm(2950, 3960, e), 1.3), bl: sm(2200, 3800, e), hand: sm(3150, 3750, e), ui: sm(3250, 3990, e) };
}
/* the hybrids: corona (1) + dawn and seals (3) + rays (2), in three different orders */
var FRA = function (e, g) { return g.s * 0.55 + (g.Dmax + 40) * Math.pow(sm(1150, 3300, e), 1.1); };
var FRB = function (e, g) { return g.s * 0.55 + (g.Dmax + 40) * Math.pow(sm(500, 3000, e), 1.15); };
var FRC = function (e, g) { return g.s * 0.55 + (g.Dmax + 40) * Math.pow(sm(450, 2900, e), 1.1); };
var TH = [0, 0, 0, 0, 3550, 3700, 3500];   // the hybrids: everything under the mark has settled by TH; the hand-over is TH … TH + 650
var FRONT = [null, null, null, FR3, FRA, FRB, FRC], LAG = [0, 0, 0, 520, 450, 520, 450];
function P4(e, g) {          // А «Затмение и рассвет»: corona first; the rays burst out of it; the dawn wave lifts the hall
  var s = g.s;
  return { E: 1.8 * sm(1150, 3000, e) + 0.7 * sm(2200, 3400, e), r0: g.R * 2.8, front: FRA(e - 450, g), fw: 160, near: 4 * sm(800, 1700, e),
    G: 0.15 * sm(650, 1500, e) * (1 - sm(2800, 3450, e)), rg: s * 2.2, col: [255, 182, 130],
    EF: 5.5 * sm(2500, 3400, e), ff: 1.75 * sm(2500, 3500, e), GP: 0.08 * sm(1900, 2700, e) * (1 - sm(3000, 3500, e)),
    settle: Math.pow(sm(2900, 3550, e), 1.3), bl: sm(2200, 3500, e), hand: sm(TH[4], TH[4] + 650, e), ui: sm(3300, 4000, e),
    rA: sm(1000, 1700, e) * (1 - sm(2900, 3500, e)), rFr: s * 0.8 + (g.Dmax + 60) * Math.pow(sm(1000, 2600, e), 1.2) };
}
function P5(e, g) {          // Б «Рассвет в лучах»: the dawn leads; the rays grow slowly inside it; the corona tightens last
  var s = g.s;
  return { E: 1.7 * sm(500, 2500, e) + 0.6 * sm(1700, 3200, e), r0: g.R * 2.8, front: FRB(e - 520, g), fw: 160, near: 3.5 * sm(400, 1500, e),
    G: 0.07 * sm(400, 1400, e) * (1 - sm(3000, 3600, e)), rg: s * 2.6, col: [255, 160, 100],
    EF: 5 * sm(2600, 3500, e), ff: 1.75 * sm(2600, 3600, e), GP: 0.08 * sm(2200, 3000, e) * (1 - sm(3200, 3650, e)),
    settle: Math.pow(sm(3100, 3700, e), 1.3), bl: sm(2400, 3650, e), hand: sm(TH[5], TH[5] + 650, e), ui: sm(3400, 4150, e),
    rA: 0.75 * sm(900, 2600, e) * (1 - sm(3100, 3650, e)), rFr: s * 0.5 + (g.Dmax + 60) * Math.pow(sm(800, 3000, e), 1.2) };
}
function P6(e, g) {          // В «Восход»: rays and dawn together from the first moment; a soft, steady halo round the mark
  var s = g.s;
  return { E: 1.8 * sm(450, 2500, e) + 0.6 * sm(1700, 3200, e), r0: g.R * 2.8, front: FRC(e - 450, g), fw: 170, near: 3.5 * sm(400, 1400, e),
    G: 0.1 * sm(400, 1300, e) * (1 - sm(2800, 3400, e)), rg: s * 2.4, col: [255, 176, 122],
    EF: 5.5 * sm(2200, 3300, e), ff: 1.75 * sm(2200, 3400, e), GP: 0.09 * sm(1500, 2500, e) * (1 - sm(3000, 3450, e)),
    settle: Math.pow(sm(2850, 3500, e), 1.3), bl: sm(2200, 3450, e), hand: sm(TH[6], TH[6] + 650, e), ui: sm(3250, 3950, e),
    rA: 0.9 * sm(400, 1400, e) * (1 - sm(2800, 3400, e)), rFr: s * 0.5 + (g.Dmax + 60) * Math.pow(sm(380, 2600, e), 1.2) };
}
var PF = [null, P1, P2, P3, P4, P5, P6];
var WARP = [null, [[0, 0], [120, 350], [300, 700], [600, 1500], [850, 2600], [1050, 3700]],
  [[0, 0], [120, 350], [400, 1000], [700, 2000], [900, 2900], [1100, 3900]],
  [[0, 0], [120, 350], [450, 1300], [800, 2600], [1000, 3300], [1150, 4000]],
  // short hybrids: the light condensed into 0.5 s, then the same hand-over at 0.5 s
  [[0, 0], [100, 350], [250, 1000], [420, 2200], [600, 3550], [1100, 4200]],
  [[0, 0], [100, 350], [280, 1500], [450, 2700], [600, 3700], [1100, 4350]],
  [[0, 0], [100, 350], [260, 1200], [430, 2300], [600, 3500], [1100, 4150]]];
function warp(v, e) { var w = WARP[v]; if (e <= 0) return e; for (var i = 1; i < w.length; i++) if (e <= w[i][0]) return w[i - 1][1] + (e - w[i - 1][0]) / (w[i][0] - w[i - 1][0]) * (w[i][1] - w[i - 1][1]); return w[w.length - 1][1] + (e - w[w.length - 1][0]); }
function durOf(v, m) { return m === "short" ? WARP[v][WARP[v].length - 1][0] : VARS[v - 1].dur; }

function paintField(p, g) {
  var d = FI.data, n = GW * GH, E = p.E, r0 = p.r0, front = p.front, fw = p.fw || 1, ST = p.settle, Gg = p.G, rg = p.rg, cr = p.col[0], cg = p.col[1], cb = p.col[2];
  var near = p.near || 0, nr = g.R * 1.25, EF = p.EF, ff = p.ff, GP = p.GP;
  var bv = 0, bn = 0, b0 = g.s * 0.75, b1 = g.s * 1.6;
  for (var i = 0; i < n; i++) {
    var dd = Dd[i], hz = HZ[i], q = dd / r0, ex = E * hz / (1 + q * q);
    if (front) ex *= dd < front - fw ? 1 : dd > front ? 0 : sm(front, front - fw, dd);
    if (near) { var qn = dd / nr; ex += near * hz / (1 + qn * qn * qn * qn); }
    var fl = FL[i];
    if (fl > 0) { var yf = YF[i], fm = yf < ff - 0.4 ? 1 : yf > ff ? 0 : sm(ff, ff - 0.4, yf); ex = ex * (1 - fl) + (EF * (0.25 + 0.75 * PO[i]) * fm + ex * 0.15) * fl; }
    var vis = 1 - Math.exp(-ex); vis += (1 - vis) * ST;
    if (dd > b0 && dd < b1) { bv += vis; bn++; }
    var a = 1 - vis + DN[i] * (1 - ST);
    var qg = dd / rg, gl = Gg * hz / Math.pow(1 + qg * qg, 1.5) * (1 - 0.85 * fl);
    if (fl > 0 && GP > 0) gl += GP * PO[i] * fl * (0.3 + 0.7 * sm(ff, ff - 0.4, YF[i]));
    var al = a > gl ? a : gl, j = i * 4;
    if (al <= 0) { d[j + 3] = 0; continue; }
    if (al > 1) al = 1;
    var k = gl / al * 1.0;
    d[j] = cr * k; d[j + 1] = cg * k; d[j + 2] = cb * k; d[j + 3] = al * 255 + 0.5;
  }
  fx.putImageData(FI, 0, 0);
  BGV = bn ? (ST >= 1 ? 1 : bv / bn) : ST;
  dg.globalCompositeOperation = "copy"; dg.globalAlpha = 1; dg.imageSmoothingEnabled = true;
  dg.drawImage(fc, 0, 0, GW, GH, 0, 0, GW * 4, GH * 4);
}

function drawSpr(c, a) { if (a <= 0.003) return; while (a > 1) { mg.globalAlpha = 1; mg.drawImage(c, 0, 0); a -= 1; } mg.globalAlpha = a; mg.drawImage(c, 0, 0); }
function bead(x, y, rad, a, col) { if (a <= 0.003) return; var gr = mg.createRadialGradient(x, y, 0, x, y, rad); gr.addColorStop(0, "rgba(" + col + "," + Math.min(1, a).toFixed(3) + ")"); gr.addColorStop(0.25, "rgba(" + col + "," + (0.45 * Math.min(1, a)).toFixed(3) + ")"); gr.addColorStop(1, "rgba(" + col + ",0)"); mg.globalAlpha = 1; mg.fillStyle = gr; mg.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
// the mark and the light just around it
function paintMark(v, e, p, g) {
  var s = g.s, cx = (MOX + s / 2) * DPR, cy = (MOY + s / 2) * DPR, k = s / 100 * DPR;
  mg.setTransform(1, 0, 0, 1, 0, 0); mg.globalCompositeOperation = "source-over"; mg.globalAlpha = 1; mg.clearRect(0, 0, MW, MW);
  mg.globalCompositeOperation = "lighter";
  var off = 1 - p.settle, fade = 1 - sm(0.55, 1, p.settle);
  // the two corner notches (top right, bottom left): where the light behind the mark first gets out
  var n1x = cx + 27 * k, n1y = cy - 27 * k, n2x = cx - 27 * k, n2y = cy + 27 * k;
  if (v === 1 || v === 4) {
    var sweep = sm(380, 1050, e);
    // the rim runs round the edge from both notches (a conic window)
    if (sweep > 0 && sweep < 1 && mg.createConicGradient) {
      var rimC = SPR._rimC || (SPR._rimC = D.createElement("canvas")); rimC.width = rimC.height = MW; var rc = rimC.getContext("2d");
      rc.globalCompositeOperation = "copy"; rc.drawImage(SPR.rim, 0, 0); rc.globalCompositeOperation = "destination-in";
      var cg = rc.createConicGradient(0, cx, cy), sp = sweep * Math.PI * 1.05, A1 = -Math.PI / 4, A2 = Math.PI * 0.75;
      for (var q = 0; q <= 64; q++) { var th = q / 64 * 2 * Math.PI, d1 = Math.abs(Math.atan2(Math.sin(th - A1), Math.cos(th - A1))), d2 = Math.abs(Math.atan2(Math.sin(th - A2), Math.cos(th - A2))), sp2 = sp * sm(460, 1050, e) / Math.max(0.001, sm(380, 1050, e));
        var al = Math.max(sm(sp + 0.25, sp - 0.05, d1), sm(sp2 + 0.25, sp2 - 0.05, d2)); cg.addColorStop(q / 64, "rgba(0,0,0," + al.toFixed(3) + ")"); }
      rc.fillStyle = cg; rc.fillRect(0, 0, MW, MW); rc.globalCompositeOperation = "source-over";
      drawSpr(rimC, 2.2 * sm(380, 560, e));
    } else drawSpr(SPR.rim, (2.2 - 0.9 * p.settle) * sm(380, 560, e) * fade + 0.0);
    // the diamond: a point of light in the top-right notch, then the bottom-left one; they give way to the rim
    bead(n1x, n1y, s * 0.2 * DPR, 1.25 * sm(360, 450, e) * (1 - sm(800, 1300, e)), "255,248,238");
    bead(n1x, n1y, s * 0.9 * DPR, 0.32 * sm(360, 520, e) * (1 - sm(900, 1600, e)), "255,210,165");
    bead(n2x, n2y, s * 0.16 * DPR, 0.95 * sm(470, 560, e) * (1 - sm(860, 1350, e)), "255,248,238");
    bead(n2x, n2y, s * 0.7 * DPR, 0.22 * sm(470, 600, e) * (1 - sm(900, 1500, e)), "255,210,165");
    drawSpr(SPR.inner, 1.6 * sm(550, 1150, e) * off);
    drawSpr(SPR.mid, 1.5 * sm(700, 1500, e) * off);
    drawSpr(SPR.outer, 1.35 * sm(850, 1900, e) * (1 - p.settle));
  } else if (v === 5) {      // the dawn's warm halo; at the end the light draws in to the mark: the notch sparks, the rim tightens
    var tg = sm(2650, 3150, e);
    drawSpr(SPR.rim, (0.9 * sm(380, 1200, e) + 1.5 * tg) * fade);
    drawSpr(SPR.inner, (0.6 * sm(420, 1500, e) + 0.9 * sm(2700, 3250, e)) * off);
    drawSpr(SPR.mid, 0.55 * sm(500, 1900, e) * (1 - sm(2600, 3300, e)));
    drawSpr(SPR.outer, 0.45 * sm(700, 2300, e) * (1 - sm(2400, 3100, e)));
    bead(n1x, n1y, s * 0.2 * DPR, 1.15 * sm(2780, 2880, e) * (1 - sm(3150, 3600, e)), "255,248,238");
    bead(n1x, n1y, s * 0.9 * DPR, 0.3 * sm(2780, 2930, e) * (1 - sm(3200, 3700, e)), "255,210,165");
    bead(n2x, n2y, s * 0.16 * DPR, 0.85 * sm(2860, 2960, e) * (1 - sm(3200, 3600, e)), "255,248,238");
  } else if (v === 6) {      // a soft, steady halo: the light is in the air, not on the edge
    drawSpr(SPR.rim, 0.8 * sm(380, 1000, e) * fade);
    drawSpr(SPR.inner, 0.75 * sm(400, 1100, e) * off);
    drawSpr(SPR.mid, 0.6 * sm(450, 1300, e) * (1 - p.settle));
    drawSpr(SPR.outer, 0.3 * sm(500, 1600, e) * (1 - p.settle));
    bead(n1x, n1y, s * 0.9 * DPR, 0.22 * sm(380, 900, e) * (1 - p.settle), "255,226,190");
    bead(n2x, n2y, s * 0.9 * DPR, 0.22 * sm(420, 950, e) * (1 - p.settle), "255,226,190");
  } else if (v === 2) {
    drawSpr(SPR.rim, 1.3 * sm(380, 800, e) * fade);
    drawSpr(SPR.inner, 0.9 * sm(420, 1000, e) * off);
    drawSpr(SPR.mid, 0.55 * sm(500, 1300, e) * (1 - p.settle));
    bead(n1x, n1y, s * 0.9 * DPR, 0.3 * sm(380, 900, e) * (1 - p.settle), "255,226,190");
    bead(n2x, n2y, s * 0.9 * DPR, 0.3 * sm(420, 950, e) * (1 - p.settle), "255,226,190");
  } else {
    drawSpr(SPR.rim, 0.95 * sm(380, 1200, e) * fade);
    drawSpr(SPR.inner, 0.75 * sm(420, 1500, e) * off);
    drawSpr(SPR.mid, 0.6 * sm(500, 1900, e) * (1 - p.settle));
    drawSpr(SPR.outer, 0.45 * sm(700, 2300, e) * (1 - p.settle));
  }
  // the mark itself: clean, solid, unlit; at the end it gives way, in place, to the gate's own sign beneath
  mg.globalCompositeOperation = "source-over"; markFace(p.hand, BGV); mg.globalAlpha = 1;
}
/* The hand-over (founder: «между ними не должно быть никакой картинки»): one layer, the clean mark, over the gate's
   own sign, at opacity 1 − h — no silhouette, no fill, no flash. The two share one outline and one place to the
   device pixel, and by the time h starts everything else under the mark has settled (the darkness is gone, the light
   around the mark has handed over to the gate's own), so every pixel of the mark moves straight from its start
   colour to its end colour and never outside them. h is eased (smoothstep) over ≈ 0.65 s (0.5 s in the short one). */
/* Two layers that share an anti-aliased edge can never be laid one over the other cleanly: at an edge pixel of
   coverage c the lower one still shows (1 − c) of itself under the upper one — a dark fringe round the clean mark
   (that, and the old corner mismatch, was the black the founder saw at the corners). So while the entry runs, the gate
   sign's own pixels are cut out of the gate's canvas (a small rectangular hole, the sign box ± 2 px, clip-path) and
   the mark canvas shows, in that box, ONE premultiplied mix: a · clean mark + (1 − a) · a live copy of the sign
   (copied from the gate's canvas each frame of the hand-over, pixel for pixel), laid once over the background. Every
   pixel is then exactly a·(clean over background) + (1 − a)·(gate) — no fringe, no stacking. At the end the hole closes
   on the same pixels the copy showed. */
var HOLE = null, SGC = null, MIX = null;
function holeOn(g) {
  var sc = scene(), blk = sc && sc.querySelector('canvas[data-d="blk"]'); if (!blk) return;
  var sr = sc.getBoundingClientRect(), x0 = Math.floor(g.x - g.s / 2 - 2), y0 = Math.floor(g.y - g.s / 2 - 2), x1 = Math.ceil(g.x + g.s / 2 + 2), y1 = Math.ceil(g.y + g.s / 2 + 2);
  HOLE = { blk: blk, x: x0, y: y0, w: x1 - x0, h: y1 - y0, lx: x0 - sr.left, ly: y0 - sr.top };
  var W0 = blk.clientWidth || g.vw, H0 = blk.clientHeight || g.vh, a = HOLE.lx, b = HOLE.ly, c = a + HOLE.w, d = b + HOLE.h;
  blk.style.setProperty("--vh-hole", "polygon(evenodd, 0 0, " + W0 + "px 0, " + W0 + "px " + H0 + "px, 0 " + H0 + "px, 0 0, " + a + "px " + b + "px, " + a + "px " + d + "px, " + c + "px " + d + "px, " + c + "px " + b + "px, " + a + "px " + b + "px)");
  H.classList.add("vh-hole");
  var dw = Math.round(HOLE.w * DPR), dh = Math.round(HOLE.h * DPR);
  if (!SGC || SGC.width !== dw || SGC.height !== dh) { SGC = D.createElement("canvas"); SGC.width = dw; SGC.height = dh; MIX = D.createElement("canvas"); MIX.width = dw; MIX.height = dh; }
}
function holeOff() { H.classList.remove("vh-hole"); if (HOLE && HOLE.blk) HOLE.blk.style.removeProperty("--vh-hole"); HOLE = null; }
/* The clean mark's dark centre (founder: «как только черный фон гаснет, черный цвет внутри иконки тоже должен
   исчезать»): the void is not a black hole once the hall is lit — it eases, on the very curve the darkness round the
   mark lifts by (w = the backdrop's visibility just outside the mark, from the same exposure field), from the void's
   dark toward the gate sign's own hollow, as the gate draws it this frame. In the box: hollow = (1 − w) · void +
   w · the sign's hollow (premultiplied, one mask), the plates over it; then a · that + (1 − a) · the sign. By the time the
   hand-over starts w = 1, so for the hollow the hand-over changes nothing. */
var BGV = 0, CL = null, HV = null;
function markFace(h, w) {
  var a = 1 - h; if (a <= 0.001 && !HOLE) return;   // with the hole open the sign's copy must be shown to the very last frame
  mg.setTransform(1, 0, 0, 1, 0, 0); mg.globalCompositeOperation = "source-over"; mg.globalAlpha = 1;   // (the light drawn before leaves its own alpha set)
  w = cl(w || 0, 0, 1);
  if (!HOLE || (h <= 0.0005 && w <= 0.0005)) { mg.globalAlpha = a; mg.drawImage(CMK, 0, 0); mg.globalAlpha = 1; return; }
  var blk = HOLE.blk, kb = blk.width / (blk.clientWidth || G.vw), dx = Math.round((HOLE.x - MLx) * DPR), dy = Math.round((HOLE.y - MLy) * DPR), sw = SGC.width, sh = SGC.height;
  if (!CL || CL.width !== sw || CL.height !== sh) { CL = D.createElement("canvas"); CL.width = sw; CL.height = sh; HV = D.createElement("canvas"); HV.width = sw; HV.height = sh; }
  // the sign, as the gate draws it this very frame, copied out of its canvas
  var sx = SGC.getContext("2d"); sx.globalCompositeOperation = "copy"; sx.drawImage(blk, HOLE.lx * kb, HOLE.ly * kb, HOLE.w * kb, HOLE.h * kb, 0, 0, sw, sh);
  // the clean mark of this moment: its hollow eased toward the sign's hollow, its plates over it
  var hx = HV.getContext("2d"); hx.globalCompositeOperation = "copy"; hx.drawImage(SGC, 0, 0); hx.globalCompositeOperation = "destination-in"; hx.drawImage(CMV, dx, dy, sw, sh, 0, 0, sw, sh); hx.globalCompositeOperation = "source-over";
  var cx = CL.getContext("2d"); cx.globalCompositeOperation = "copy"; cx.globalAlpha = 1 - w; cx.drawImage(CMV, dx, dy, sw, sh, 0, 0, sw, sh);
  cx.globalCompositeOperation = "lighter"; cx.globalAlpha = w; cx.drawImage(HV, 0, 0);
  cx.globalCompositeOperation = "source-over"; cx.globalAlpha = 1; cx.drawImage(CMP, dx, dy, sw, sh, 0, 0, sw, sh);
  // the hand-over: a · the clean mark + (1 − a) · the sign, one premultiplied mix laid once
  var mx = MIX.getContext("2d"); mx.globalCompositeOperation = "copy"; mx.globalAlpha = a; mx.drawImage(CL, 0, 0);
  mx.globalCompositeOperation = "lighter"; mx.globalAlpha = 1 - a; mx.drawImage(SGC, 0, 0); mx.globalAlpha = 1; mx.globalCompositeOperation = "source-over";
  mg.drawImage(MIX, dx, dy);
}
function paintRays(e, p, g, eReal) {
  var A = p.rA; if (!(A > 0.003)) return;
  var fr = p.rFr, fw = 140;
  T2x.globalCompositeOperation = "copy"; T2x.drawImage(RC, 0, 0);
  T2x.globalCompositeOperation = "destination-in";
  var gr = T2x.createRadialGradient(g.x / 2, g.y / 2, 0, g.x / 2, g.y / 2, fr / 2); gr.addColorStop(0, "#000"); gr.addColorStop(cl((fr - fw) / fr, 0, 1), "#000"); gr.addColorStop(1, "rgba(0,0,0,0)");
  T2x.fillStyle = gr; T2x.fillRect(0, 0, T2.width, T2.height); T2x.globalCompositeOperation = "source-over";
  dg.globalCompositeOperation = "lighter"; dg.globalAlpha = Math.min(1, 1.15 * A);
  dg.drawImage(T2, 0, 0, T2.width, T2.height, 0, 0, T2.width * 2, T2.height * 2);
  if (A * 1.15 > 1) { dg.globalAlpha = A * 1.15 - 1; dg.drawImage(T2, 0, 0, T2.width, T2.height, 0, 0, T2.width * 2, T2.height * 2); }
  // dust in the beams
  var t = (eReal === undefined ? e : eReal) / 1000;            // the dust drifts in real time, also in the short version
  for (var i = 0; i < DUST.length; i++) {
    var m = DUST[i], x = m.x + m.vx * t + Math.sin(t * 0.7 + m.ph) * m.w * 0.3, y = m.y + m.vy * t + Math.cos(t * 0.5 + m.ph * 1.3) * m.w * 0.2;
    var dx = x - g.x, dy = y - g.y, rr = Math.hypot(dx, dy); if (rr > fr) continue;
    var b = rayAt(dx, dy) * A * (rr > fr - fw ? sm(fr, fr - fw, rr) : 1); if (b < 0.01) continue;
    var gl = 0.55 + 0.45 * Math.pow(0.5 + 0.5 * Math.sin(t * m.f * 6.283 + m.ph), 3);   // flakes turning: a glint now and then
    var sz = 1.3 + 4.2 * m.z * m.z, al = Math.min(1, b * gl * (2.6 - 1.4 * m.z));
    dg.globalAlpha = al; dg.drawImage(DOT, x - sz, y - sz, sz * 2, sz * 2);
  }
  dg.globalAlpha = 1; dg.globalCompositeOperation = "source-over";
}
function paintGlyphs(e, p, g) {
  var ST = p.settle, nfl = 0;
  for (var i = 0; i < COMP.length; i++) {
    var o = COMP[i], tc = tFront(o.d, g) * (V === 6 ? o.rk : 1) + o.j, u = e - tc;
    var lv = u <= 0 ? 0 : sm(0, 170, u) * (o.k + (1 - o.k) * sm(0, 1100, u));
    lv = lv + (1 - lv) * ST; lv = Math.round(lv * 32) / 32;
    var fl = u <= 0 ? 0 : sm(0, 70, u) * Math.exp(-u / 230) * 0.32 * (1 - ST); fl = Math.round(fl * 32) / 32;
    var w = o.x1 - o.x0, h = o.y1 - o.y0;
    if (lv !== o.lv) { IGx.clearRect(o.x0, o.y0, w, h); if (lv > 0) { IGx.globalAlpha = lv; IGx.drawImage(GM, o.x0, o.y0, w, h, o.x0, o.y0, w, h); } o.lv = lv; }
    if (fl !== o.fl) { FLx.clearRect(o.x0, o.y0, w, h); if (fl > 0) { FLx.globalAlpha = fl; FLx.drawImage(GMt, o.x0, o.y0, w, h, o.x0, o.y0, w, h); } o.fl = fl; }
    if (fl > 0) nfl++;
  }
  dg.globalCompositeOperation = "destination-out"; dg.globalAlpha = 1; dg.drawImage(IG, 0, 0);
  if (nfl) { dg.globalCompositeOperation = "lighter"; dg.drawImage(FLc, 0, 0); }
  dg.globalCompositeOperation = "source-over";
}
var FT = null;
function tFront(d, g) {                       // when the dawn's front reaches distance d
  /* ОТКАТ: у вариантов входа 1–2 своего фронта рассвета нет (в FRONT там null) — они идут фронтом третьего, FR3, как в утверждённом входе. */
  var fk = G.key + "|" + V, F = FRONT[V] || FR3;
  if (!FT || FT.key !== fk) { FT = { key: fk, a: [] }; for (var e = 0; e <= 4400; e += 10) FT.a.push(F(e, g)); }
  var a = FT.a, lo = 0, hi = a.length - 1; if (d <= a[0]) return 0; if (d >= a[hi]) return 4400;
  while (hi - lo > 1) { var m = (lo + hi) >> 1; if (a[m] < d) lo = m; else hi = m; }
  return (lo + (d - a[lo]) / Math.max(1e-6, a[hi] - a[lo])) * 10;
}

function setUI(a) { gateUI().forEach(function (el) { el.style.transition = "none"; el.style.opacity = a >= 1 ? "" : a.toFixed(3); }); }
function render(e) {
  var g = G, p;
  if (RMnow) {                                   // reduced motion: the mark, then the hall, a calm cross-fade
    var u = sm(200, 900, e);
    p = { settle: 1, hand: sm(950, 1550, e), ui: sm(700, 1300, e) };
    dg.globalCompositeOperation = "copy"; dg.globalAlpha = 1; dg.fillStyle = "rgba(0,0,0," + (1 - u).toFixed(3) + ")"; dg.fillRect(0, 0, g.vw, g.vh);
    mg.setTransform(1, 0, 0, 1, 0, 0); mg.globalAlpha = 1; mg.clearRect(0, 0, MW, MW); markFace(p.hand, u);
    g.bl.style.opacity = ""; setUI(p.ui);
    return e >= 1580;
  }
  var ef = MODE === "short" ? warp(V, e) : e;
  p = PF[V](ef, g);
  paintField(p, g);
  if (V === 3 || V >= 4) paintGlyphs(ef, p, g);
  if (p.rA > 0.003) paintRays(ef, p, g, e);
  paintMark(V, ef, p, g);
  g.bl.style.opacity = p.bl >= 1 ? "" : p.bl.toFixed(3);
  setUI(p.ui);
  return e >= durOf(V, MODE);
}

/* ── the run ── */
function loop() {
  raf = 0; if (st !== "hold" && st !== "play") return;
  var t = now();
  if (lastF) frames.push(t - lastF); lastF = t;
  if (st === "hold") {
    // the clean mark on black, while the hall finishes building; it starts when frames are calm
    if (!gateReady()) {
      // another door is up (the entry belongs to Шифр), or the gate never says where its mark is: never stay dark
      var sc0 = scene(); if (!waitAt) waitAt = t;
      var noGate = !D.getElementById("sbVaultGate") && D.readyState === "complete" && t - waitAt > 1200;
      if ((t > switchUntil && sc0 && sc0.getAttribute("data-ready") === "1" && sc0.getAttribute("data-door") && sc0.getAttribute("data-door") !== "shifr") || noGate || t - waitAt > 12000) { fadeOut(); return; }
      raf = requestAnimationFrame(loop); return;
    }
    if (!G || !holdAt) { prepare(V); holdAt = t; drawHold(); ov.classList.add("vh-mark-on"); calm = []; }
    var dt = frames.length ? frames[frames.length - 1] : 16; calm.push(dt); if (calm.length > 10) calm.shift();
    var srt = calm.slice().sort(function (a, b) { return a - b; }), med = srt[srt.length >> 1], mx = srt[srt.length - 1];
    var quiet = calm.length >= 10 && mx < Math.max(34, med * 1.7);
    if ((quiet && t - holdAt > 250) || t - holdAt > 3000) { if (geom().key !== G.key) prepare(V); st = "play"; t0 = t; frames = []; costs = []; lastF = t; }
    raf = requestAnimationFrame(loop); return;
  }
  ov.classList.add("vh-live");
  var c0 = now(), endNow = render(t - t0); costs.push(now() - c0);
  if (endNow) { finish(); return; }
  raf = requestAnimationFrame(loop);
}
function drawHold() {
  setUI(0); G.bl.style.opacity = "0";
  dg.globalCompositeOperation = "copy"; dg.globalAlpha = 1; dg.fillStyle = "#000"; dg.fillRect(0, 0, G.vw, G.vh);
  mg.setTransform(1, 0, 0, 1, 0, 0); mg.globalAlpha = 1; mg.globalCompositeOperation = "source-over"; mg.clearRect(0, 0, MW, MW);
  markFace(0);
}
function play(v) {
  if (raf) cancelAnimationFrame(raf); raf = 0;
  V = v || V; frozen = null; RMnow = !!(W.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  if (!CFG) { try { history.replaceState(null, "", "#" + V); } catch (e) { /* file:// may refuse */ } }
  markTabs();
  var sc = scene();
  if (st === "done" && !D.getElementById("sbVaultGate")) { location.reload(); return; }
  /* D-606: the entry never changes the door: at another door the dark simply fades into it */
  st = "hold"; holdAt = 0; G = null; frames = []; lastF = 0; waitAt = 0;
  H.classList.add("vh-playing"); ov.classList.remove("vh-off", "vh-live", "vh-mark-on");
  if (MARK() && gateReady()) { prepare(V); holdAt = now(); drawHold(); }
  else { dg.globalCompositeOperation = "copy"; dg.fillStyle = "#000"; dg.fillRect(0, 0, dk.width, dk.height); mg.clearRect(0, 0, mk.width, mk.height); setUI(0); }
  raf = requestAnimationFrame(loop);
}
/* D-606: another door, or no gate at all — the dark fades away (0.5 s; reduced motion: 0.25 s) and the entry ends */
function fadeOut() {
  if (raf) cancelAnimationFrame(raf); raf = 0; st = "fade";
  setUI(1); ov.style.transition = "opacity " + (RMnow ? ".25s linear" : ".5s ease"); ov.style.opacity = "0";
  setTimeout(function () { st = "hold"; finish(); ov.style.opacity = ""; ov.style.transition = ""; }, RMnow ? 260 : 520);
}
function finish() {
  if (raf) cancelAnimationFrame(raf); raf = 0;
  if (st === "done") return;
  if (st === "play" && MODE === "full" && !frozen) { try { localStorage.setItem("sysbaby.entry.day", TODAY); } catch (e) { /* ignore */ } }
  st = "done"; frozen = null; holeOff();
  ov.classList.add("vh-off"); ov.classList.remove("vh-live");
  if (G && G.bl) G.bl.style.opacity = "";
  gateUI().forEach(function (el) { el.style.opacity = ""; el.style.transition = ""; });
  H.classList.remove("vh-playing", "vh-pre");
  W.__vhodDone = (W.__vhodDone || 0) + 1;
  setTimeout(function () { if (st === "done" && ov.parentNode) ov.parentNode.removeChild(ov); }, 0);   // D-606: the entry's layer leaves the page
}
function markTabs() {
  tabs.forEach(function (b) { b.setAttribute("aria-pressed", +b.getAttribute("data-v") === V ? "true" : "false"); });
  lens.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-len") === MODE ? "true" : "false"); });
  if (descEl) descEl.textContent = VARS[V - 1].n + (MODE === "short" ? " (короткий, ~1 с)" : "") + " — " + VARS[V - 1].d;
}
lens.forEach(function (b) { b.addEventListener("click", function (ev) { ev.stopPropagation(); MODE = b.getAttribute("data-len"); play(V); }); });
tabs.forEach(function (b) { b.addEventListener("click", function (ev) { ev.stopPropagation(); play(+b.getAttribute("data-v")); }); });
if (again) again.addEventListener("click", function (ev) { ev.stopPropagation(); play(V); });
// a tap skips to the end and still lands where it was aimed
D.addEventListener("pointerdown", function (ev) {
  if ((st === "play" || st === "hold") && !(ev.target.closest && ev.target.closest("#vhBar, #vhAgain")) && !frozen) finish();
}, true);
D.addEventListener("keydown", function () { if ((st === "play" || st === "hold") && !frozen) finish(); }, true);
D.addEventListener("input", function () { if ((st === "play" || st === "hold") && !frozen) finish(); }, true);   // (focus alone — the gate focuses its field itself — does not end it)
D.addEventListener("visibilitychange", function () {
  if (D.hidden) { pausedAt = now(); if (raf) { cancelAnimationFrame(raf); raf = 0; } }
  else if (pausedAt) { var d = now() - pausedAt; pausedAt = 0; if (st === "play") t0 += d; if (st === "hold") holdAt += d; lastF = 0; if ((st === "play" || st === "hold") && !raf && !frozen) raf = requestAnimationFrame(loop); }
});
W.addEventListener("resize", function () { if (st === "play" || st === "hold") { if (st === "play") finish(); else { G = null; holdAt = 0; PREP = {}; } } else PREP = {}; });

W.__vhod = {
  VARS: VARS, dur: durOf, get mode() { return MODE; }, setMode: function (m) { MODE = m; markTabs(); }, get state() { return st; }, get variant() { return V; }, frames: function () { return frames.slice(); }, costs: function () { return costs.slice(); }, play: play, finish: finish,
  // tests: render the frame e ms into variant v and hold it there
  seek: function (v, e, m) {
    if (raf) cancelAnimationFrame(raf); raf = 0;
    V = v; MODE = m || "full"; markTabs(); RMnow = false; st = "play"; frozen = e; H.classList.add("vh-playing"); ov.classList.remove("vh-off"); prepare(V);
    if (e < 0) { drawHold(); ov.classList.remove("vh-live"); return; }
    ov.classList.add("vh-live"); if (V === 3 || V >= 4) { COMP.forEach(function (o) { o.lv = -1; o.fl = -1; }); }
    render(e);
  },
  dbg: function () { return { n: COMP && COMP.length, lit: COMP && COMP.filter(function (o) { return o.lv > 0; }).length, t: [100, 300, 600, 900].map(function (d) { return tFront(d, G); }), big: COMP && COMP.slice().sort(function (a, b) { return b.n - a.n; }).slice(0, 5).map(function (o) { return [o.n, o.x1 - o.x0, o.y1 - o.y0]; }), Dmax: G && G.Dmax }; },
  // the SIGN table against the live sign: its plates (alpha ≥ 0.8 in the gate's block canvas) vs this outline's plates,
  // pixels more than 1 px inside either edge that disagree (0 = the outlines coincide)
  signCheck: function () {
    var blk = scene().querySelector('canvas[data-d="blk"]'), m = MARK(); if (!blk || !m) return null;
    var k = blk.width / W.innerWidth, s = m.side * k, x0 = Math.floor((m.x - m.side / 2) * k) - 3, y0 = Math.floor((m.y - m.side / 2) * k) - 3, n = Math.ceil(s) + 7;
    var live = blk.getContext("2d").getImageData(x0, y0, n, n).data, c = D.createElement("canvas"); c.width = c.height = n; var x = c.getContext("2d");
    var P = signPaths((m.x - m.side / 2) * k - x0, (m.y - m.side / 2) * k - y0, s); x.fillStyle = "#fff"; x.fill(P.w); x.fill(P.o);
    var mine = x.getImageData(0, 0, n, n).data, A = new Uint8Array(n * n), B = new Uint8Array(n * n), i, bad = 0, tot = 0;
    for (i = 0; i < n * n; i++) { A[i] = live[i * 4 + 3] >= 204 ? 1 : 0; B[i] = mine[i * 4 + 3] >= 128 ? 1 : 0; }
    for (var yy = 1; yy < n - 1; yy++) for (var xx = 1; xx < n - 1; xx++) { i = yy * n + xx; var nb = [i - 1, i + 1, i - n, i + n, i - n - 1, i - n + 1, i + n - 1, i + n + 1], stable = true;
      /* ОТКАТ: здесь не подмена значения — это условие «сосед иной в A или в B», оба сравнения дают только да/нет. */
      for (var q = 0; q < 8; q++) if (A[nb[q]] !== A[i] || B[nb[q]] !== B[i]) { stable = false; break; }
      if (!stable) continue; tot++; if (A[i] !== B[i]) bad++; }
    return { compared: tot, mismatched: bad };
  },
  liveOutline: function () { return LIVE; },
  dbgVoid: function () { var px = function (c, x, y) { return [].slice.call(c.getContext("2d").getImageData(x, y, 1, 1).data); }; var dx = Math.round((HOLE.x - MLx) * DPR), dy = Math.round((HOLE.y - MLy) * DPR), X = Math.round((MOX + G.s * 0.12) * DPR), Y = Math.round((MOY + G.s * 0.12) * DPR);
    return { BGV: BGV, CMP: px(CMP, X, Y), CMK: px(CMK, X, Y), CL: CL && px(CL, X - dx, Y - dy), MIX: MIX && px(MIX, X - dx, Y - dy), MK: px(mk, X, Y), SGC: SGC && px(SGC, X - dx, Y - dy) }; },
  dbgHole: function () { if (!HOLE || !SGC) return null; var blk = HOLE.blk, kb = blk.width / (blk.clientWidth || G.vw), b = blk.getContext("2d").getImageData(Math.round(HOLE.lx * kb), Math.round(HOLE.ly * kb), SGC.width, SGC.height).data, c = SGC.getContext("2d").getImageData(0, 0, SGC.width, SGC.height).data, m = 0; for (var i = 0; i < b.length; i++) m = Math.max(m, Math.abs(b[i] - c[i])); return { hole: { x: HOLE.x, y: HOLE.y, w: HOLE.w, h: HOLE.h, lx: HOLE.lx, ly: HOLE.ly }, kb: kb, cw: blk.clientWidth, bw: blk.width, sg: [SGC.width, SGC.height], maxDiff: m, ML: [MLx, MLy] }; },   // false: the clean mark's edge is its own (SIGN), the sign is cut out beneath it
  // tests: the pixels of a screenshot clip (CSS rect, device pixels) that lie dmin…dmax device px outside the mark's outline
  ring: function (clip, dmin, dmax) {
    var d = CMK.getContext("2d").getImageData(0, 0, MW, MW).data, w = Math.round(clip.width * DPR), h = Math.round(clip.height * DPR), ox = Math.round(clip.x * DPR - MLx * DPR), oy = Math.round(clip.y * DPR - MLy * DPR), out = [];
    var A = function (x, y) { x += ox; y += oy; return x < 0 || y < 0 || x >= MW || y >= MW ? 0 : d[(y * MW + x) * 4 + 3]; };
    for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) {
      if (A(x, y) > 0) continue; var best = 99;
      for (var j = -dmax; j <= dmax; j++) for (var i = -dmax; i <= dmax; i++) if (A(x + i, y + j) > 127) { var q = Math.hypot(i, j); if (q < best) best = q; }
      if (best >= dmin && best <= dmax) out.push(y * w + x);
    }
    return out;
  },
  markRect: function () { return G ? { x: MLx + MOX, y: MLy + MOY, w: G.s, h: G.s } : null; },
  gateRect: function () { var sc = scene(), r = sc.getBoundingClientRect(), m = MARK(); return m ? { x: r.left + m.x - m.side / 2, y: r.top + m.y - m.side / 2, w: m.side, h: m.side } : null; }
};
markTabs();
play(V);
})();
