/* sys.baby — «СЛЕД»: ТИХАЯ ЗАГРУЗКА ВНУТРИ СИСТЕМЫ · решение D-1363-INNER-LOADING-TRACE.
 *
 * Основатель 23.11.2026 выбрал И3 «След» (демо vnutri-I3-sled.html): пока что-то грузится — заметка уходит в носитель,
 * тяжёлое окно собирается, письмо Шёпота в пути, кнопка ждёт ответа, — по кромке этой самой вещи бежит искра газа и
 * оставляет тающий след. Экран не затемняется, ничего не накрывает и не ловит касаний; нагрузка — один маленький холст
 * над вещью, только пока она ждёт.
 *
 * ОДИН ЯЗЫК ОЖИДАНИЯ НА ВСЮ СИСТЕМУ. Место ожидания говорит о себе так, как его и так слышит экранное чтение:
 * aria-busy="true". «След» видит любой такой элемент сам (MutationObserver) и уходит, когда ожидание кончилось
 * (aria-busy снят или вещь ушла со страницы). Своих вызовов у мест ожидания нет — нечему разойтись.
 * Честный ход (необязательно): data-sled-p="0..1" — дуга заполняется настоящим ходом работы; без него дуги нет, есть
 * только бегущая искра (прогресс не выдумывается).
 *
 * Краски — те же, что в демо: на тёмных темах Очага (Тайник, Затмение, Океан, Аврора) — свет (белое золото → янтарь),
 * на светлых Светлицы (Окно, Зенит, Берег, Лазурь) — тёплая медь без светлых пятен. Меньше движения (data-motion=
 * "reduced" или prefers-reduced-motion) — неподвижная тонкая кромка, без бегущей искры и без цикла кадров.
 * Ворота сюда не входят: там ожидание показывает «Рождение» (D-1362). Охраняется tools/sled-check.mjs. */
(function () {
  "use strict";
  var D = document, W = window, root = D.documentElement;
  var MAX = 6, M = 10;
  function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function sm(x) { x = cl(x); return x * x * (3 - 2 * x); }
  function light() { return root.getAttribute("data-theme") === "light"; }
  function calm() {
    if (root.getAttribute("data-motion") === "reduced") return true;
    try { return !!(W.matchMedia && W.matchMedia("(prefers-reduced-motion: reduce)").matches); } catch (e) { return false; }
  }
  function pal() {
    return light() ? { core: "150,66,18", gold: "184,96,32", amber: "205,120,52", glow: "214,128,60" }
                   : { core: "255,244,226", gold: "255,206,140", amber: "245,150,70", glow: "255,170,90" };
  }
  var glowCache = {};
  function glow(rgb) {
    if (glowCache[rgb]) return glowCache[rgb];
    var c = D.createElement("canvas"); c.width = c.height = 64; var x = c.getContext("2d"), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(" + rgb + ",1)"); g.addColorStop(0.25, "rgba(" + rgb + ",.45)"); g.addColorStop(0.6, "rgba(" + rgb + ",.1)"); g.addColorStop(1, "rgba(" + rgb + ",0)");
    x.fillStyle = g; x.fillRect(0, 0, 64, 64); return (glowCache[rgb] = c);
  }
  /* обвод кромки со скруглением: точка по доле длины */
  function perim(w, h, rad) {
    rad = Math.max(0, Math.min(rad, w / 2, h / 2)); var segs = [], L = 0;
    function line(x0, y0, x1, y1) { var l = Math.hypot(x1 - x0, y1 - y0); segs.push({ t: 0, x0: x0, y0: y0, x1: x1, y1: y1, l: l, s: L }); L += l; }
    function arc(cx, cy, a0) { var l = rad * Math.PI / 2; segs.push({ t: 1, cx: cx, cy: cy, a0: a0, l: l, s: L }); L += l; }
    line(rad, 0, w - rad, 0); arc(w - rad, rad, -Math.PI / 2); line(w, rad, w, h - rad); arc(w - rad, h - rad, 0); line(w - rad, h, rad, h); arc(rad, h - rad, Math.PI / 2); line(0, h - rad, 0, rad); arc(rad, rad, Math.PI);
    return { L: Math.max(1, L), at: function (u) {
      var d = ((u % 1) + 1) % 1 * L;
      for (var i = 0; i < segs.length; i++) { var s = segs[i]; if (d <= s.s + s.l || i === segs.length - 1) { var f = s.l ? (d - s.s) / s.l : 0; if (!s.t) return [s.x0 + (s.x1 - s.x0) * f, s.y0 + (s.y1 - s.y0) * f]; var a = s.a0 + f * Math.PI / 2; return [s.cx + Math.cos(a) * rad, s.cy + Math.sin(a) * rad]; } }
      return [0, 0];
    } };
  }

  var host = null, jobs = [], raf = 0, calmTimer = 0;
  function mount() {
    if (host && host.isConnected) return;
    host = D.createElement("div"); host.id = "sbSled"; host.setAttribute("aria-hidden", "true");
    D.body.appendChild(host);
  }
  function excluded(el) { return !!(el.closest && el.closest("#sbVaultGate, #sbBirth, #sbSled")); }
  function find(el) { for (var i = 0; i < jobs.length; i++) if (jobs[i].el === el) return jobs[i]; return null; }
  function begin(el) {
    if (!el || el.nodeType !== 1 || excluded(el)) return;
    var j = find(el);
    if (j) { j.out = -1; return; }
    if (jobs.length >= MAX) return;
    mount();
    var cv = D.createElement("canvas"); cv.className = "sb-sled";
    host.appendChild(cv);
    j = { el: el, cv: cv, g: cv.getContext("2d"), t0: performance.now() / 1000, out: -1, pm: null, rad: parseFloat(getComputedStyle(el).borderTopLeftRadius) || 8, still: "" };
    jobs.push(j);
    kick();
  }
  function finish(el) { var j = find(el); if (j && j.out < 0) { j.out = performance.now() / 1000; kick(); } }
  function drop(j) {
    var i = jobs.indexOf(j); if (i >= 0) jobs.splice(i, 1);
    if (j.cv && j.cv.parentNode) j.cv.parentNode.removeChild(j.cv);
  }
  function kick() {
    if (calm()) { if (raf) { cancelAnimationFrame(raf); raf = 0; } calmPass(); return; }
    if (!raf && jobs.length) raf = requestAnimationFrame(loop);
  }
  /* холст встаёт над вещью; невидимая вещь (свёрнута, за краем) не рисуется */
  function place(j) {
    var r = j.el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4 || r.bottom < 0 || r.top > innerHeight || r.right < 0 || r.left > innerWidth) { j.cv.style.display = "none"; return null; }
    var dpr = Math.min(2, W.devicePixelRatio || 1), w = r.width + 2 * M, h = r.height + 2 * M, cw = Math.ceil(w * dpr), ch = Math.ceil(h * dpr), c = j.cv;
    if (c.style.display === "none") c.style.display = "";
    if (c.width !== cw || c.height !== ch) { c.width = cw; c.height = ch; c.style.width = w + "px"; c.style.height = h + "px"; }
    c.style.transform = "translate(" + Math.round(r.left - M) + "px," + Math.round(r.top - M) + "px)";
    var g = j.g; g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, w, h);
    var o = 1.5, pw = r.width + 2 * o, ph = r.height + 2 * o;
    if (!j.pm || j.pm.w !== pw || j.pm.h !== ph) { j.pm = perim(pw, ph, j.rad + o); j.pm.w = pw; j.pm.h = ph; }
    return { g: g, ox: M - o, oy: M - o };
  }
  function progress(j) { var v = j.el.getAttribute("data-sled-p"); if (v == null || v === "") return -1; var p = parseFloat(v); return isFinite(p) ? cl(p) : -1; }
  function arcTo(g, pm, to, steps) { g.beginPath(); var n = Math.max(1, Math.round(steps * to)); for (var i = 0; i <= n; i++) { var q = pm.at(i / steps); if (i) g.lineTo(q[0], q[1]); else g.moveTo(q[0], q[1]); } g.stroke(); }
  function draw(j, t) {
    var P = pal(), dk = !light(), at = place(j); if (!at) return;
    var g = at.g, pm = j.pm, app = sm((t - j.t0) / 0.4), out = j.out >= 0 ? sm((t - j.out) / 0.35) : 0, a = app * (1 - out);
    var steps = Math.max(24, Math.round(pm.L / 6)), p = progress(j);
    g.save(); g.translate(at.ox, at.oy); g.lineCap = "round"; g.lineJoin = "round";
    if (p >= 0) { g.globalCompositeOperation = "source-over"; g.strokeStyle = "rgb(" + P.gold + ")"; g.lineWidth = 1.1; g.globalAlpha = a * 0.42; arcTo(g, pm, p, steps); }
    /* искра и тающий след: бежит ровно (px/с), круг за кругом */
    var speed = Math.min(0.9, 240 / pm.L), head = (t - j.t0) * speed, trail = Math.min(0.45, 90 / pm.L), K = 22;
    for (var k = K; k >= 1; k--) {
      var u0 = head - trail * k / K, u1 = head - trail * (k - 1) / K, f = Math.pow(1 - k / K, 1.6), q0 = pm.at(u0), q1 = pm.at(u1);
      g.globalCompositeOperation = "source-over"; g.globalAlpha = a * f * 0.85; g.strokeStyle = "rgb(" + (f > 0.6 ? P.core : P.gold) + ")"; g.lineWidth = 0.6 + 1.6 * f;
      g.beginPath(); g.moveTo(q0[0], q0[1]); g.lineTo(q1[0], q1[1]); g.stroke();
    }
    var hq = pm.at(head);
    if (dk) { g.globalCompositeOperation = "lighter"; g.globalAlpha = a * 0.9; g.drawImage(glow(P.glow), hq[0] - 9, hq[1] - 9, 18, 18); }
    g.globalCompositeOperation = "source-over"; g.globalAlpha = a; g.fillStyle = "rgb(" + P.core + ")"; g.beginPath(); g.arc(hq[0], hq[1], 1.6, 0, 6.2832); g.fill();
    g.restore();
  }
  /* меньше движения: тонкая неподвижная кромка (или честная дуга хода), перерисовка — только если вещь сдвинулась */
  function drawCalm(j) {
    var r = j.el.getBoundingClientRect(), p = progress(j), key = [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height), p, light() ? 1 : 0].join(",");
    if (key === j.still) return;
    j.still = key;
    var at = place(j); if (!at) return;
    var g = at.g, P = pal();
    g.save(); g.translate(at.ox, at.oy); g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = "rgb(" + P.gold + ")"; g.lineWidth = 1.2;
    g.globalAlpha = 0.55; arcTo(g, j.pm, p >= 0 ? Math.max(0.02, p) : 1, Math.max(24, Math.round(j.pm.L / 6)));
    g.restore();
  }
  function alive(j) { return j.el.isConnected && !excluded(j.el); }
  function loop(now) {
    raf = 0;
    if (calm()) { calmPass(); return; }
    var t = now / 1000;
    for (var i = jobs.length - 1; i >= 0; i--) {
      var j = jobs[i];
      if (!alive(j) || (j.out >= 0 && t - j.out > 0.36)) { drop(j); continue; }
      try { draw(j, t); } catch (e) { drop(j); }
    }
    if (jobs.length) raf = requestAnimationFrame(loop);
  }
  function calmPass() {
    clearTimeout(calmTimer); calmTimer = 0;
    for (var i = jobs.length - 1; i >= 0; i--) {
      var j = jobs[i];
      if (!alive(j) || j.out >= 0) { drop(j); continue; }
      try { drawCalm(j); } catch (e) { drop(j); }
    }
    if (jobs.length) calmTimer = setTimeout(calmPass, 400);
  }

  function scan(node) {
    if (!node || node.nodeType !== 1 || !node.isConnected) return;
    if (node.getAttribute("aria-busy") === "true") begin(node);
    if (node.firstElementChild) { var list = node.querySelectorAll('[aria-busy="true"]'); for (var i = 0; i < list.length; i++) begin(list[i]); }
  }
  /* Вставленное разметкой просматривается не в той же задаче, а отдельной, следом: большая раскладка (стол после
     ворот, окно) не становится длиннее на обход своих узлов (закон login-responsive-check: ни одной задачи > 200 мс). */
  var added = [], addedT = 0;
  function scanAdded() { addedT = 0; var list = added; added = []; for (var i = 0; i < list.length; i++) scan(list[i]); }
  function watch() {
    new MutationObserver(function (recs) {
      for (var i = 0; i < recs.length; i++) {
        var r = recs[i];
        if (r.type === "attributes") { if (r.target.getAttribute("aria-busy") === "true") begin(r.target); else finish(r.target); }
        else for (var k = 0; k < r.addedNodes.length; k++) { var n = r.addedNodes[k]; if (n.nodeType === 1) added.push(n); }
      }
      if (added.length && !addedT) addedT = setTimeout(scanAdded, 30);
      /* снятые со страницы вещи уходят в следующем кадре (alive) */
      if (jobs.length) kick();
    }).observe(D.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["aria-busy"] });
    scan(D.body);
  }
  if (D.body) watch(); else D.addEventListener("DOMContentLoaded", watch);

  W.sbSled = {
    count: function () { return jobs.length; },
    /* для мест, у которых нет своего элемента-ожидания: sbSled.during(el, promise) */
    during: function (el, pr) {
      if (!el) return pr;
      el.setAttribute("aria-busy", "true");
      var off = function () { el.removeAttribute("aria-busy"); };
      return Promise.resolve(pr).then(function (v) { off(); return v; }, function (e) { off(); throw e; });
    }
  };
})();
