/* sys.baby OS — core/eclipse.js
 * Кромка Затмения (D-872, пакет П4) вынесена из field.js байт в байт (доска H4): градиентам
 * кромки не место в файле поля (field-lattice-check), а её холст не должен совпадать именем
 * с холстом поля (lock-memory-check). Подключается в index.html сразу после field.js. */
/* ── ЗАТМЕНИЕ «КРОМКА» · решение D-872 (основатель 10–11.11.2026, «Дом — мой») ──
   Бывшие Угли. Почти чёрный стол; за тёмным диском, как в затмении, теплится
   тонкая кромка света и обходит диск по кругу за 60 с; свет дышит медленно
   (13 с). Касание тихое: свет едва отзывается рядом с пальцем и гаснет за
   1,8 с. Сетки нет: холст — ровно экран в CSS-пикселях на любой ширине, без
   растяжения (доска H4: на 1728 прежний предел 1400 растягивал холст ×1,23), поле системы в Затмении погашено (suppressed()
   в field.js), его отклик на касание не вызывается. Тлеющее пятнышко Углей снято
   (themes.css). Перенесено из демо dom-moy-D/zatmenie.js (temy-anim8).
   Свет медленный, поэтому фон рисуется 30 раз в секунду; под открытыми
   окнами (wp-parked), на воротах, в Светлице и инкогнито холст стоит.
   «Меньше движения» — один неподвижный кадр, касание без отклика.
   Наружу — window.sbEclipse (геометрия диска и счёт кадров) для закона
   tools/eclipse-edge-check.mjs; кадры — tools/themes-frames-check.mjs. */
(function () {
  "use strict";
  /* Файл живёт отдельно от field.js (доска H4: field-lattice, lock-memory) — в потоке поля его нет;
     проверка документа оставлена на случай, если его поднимут без страницы. */
  if (typeof document === "undefined" || typeof window === "undefined") return;
  var root = document.documentElement, doc = document;
  var cv = null, ctx = null, W = 0, H = 0, K = 1, touches = [], raf = 0, dirty = true, nth = 0, draws = 0;
  var T0 = performance.now(), DUR = 1.8, PERIOD = 60;
  var DESK = { desktop: 1, sbIconLayer: 1, sbNoteLayer: 1, sbWidgetLayer: 1 };
  var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  function reduced() { return mq.matches || root.getAttribute("data-motion") === "reduced"; }
  function gate() { return !!doc.getElementById("sbVaultGate"); }
  function on() {
    var m = root.getAttribute("data-wp-mood");
    return (m === "ember" || m === "eclipse") && root.getAttribute("data-theme") !== "light" &&
      !root.classList.contains("sb-incognito") && !gate();
  }
  /* «Накрыто окном» — тем же правилом, что у поля (occluded() в field.js): окно во
     весь стол. Своё, потому что погашенное в Затмении поле не паркуется.
     Считается по событию слоя окон, а не в кадре. */
  var covered = false;
  function cover() {
    var was = covered;
    covered = false;
    if (cv) {
      var tb = doc.getElementById("topbar"), deskTop = tb ? tb.getBoundingClientRect().bottom : 0;
      var wins = doc.querySelectorAll("#windowLayer .window");
      for (var i = 0; i < wins.length && !covered; i++) {
        var c = wins[i].classList;
        if (c.contains("minimized") || c.contains("closing") || c.contains("opening") || c.contains("traveling")) continue;
        var r = wins[i].getBoundingClientRect();
        covered = r.left <= 1 && r.top <= deskTop + 1 && r.right >= W - 1 && r.bottom >= H - 1;
      }
    }
    if (was && !covered) kick();
  }
  function parked() { return covered || root.classList.contains("wp-parked"); }
  function rgba(c, a) { return "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + Math.max(0, Math.min(1, a)).toFixed(4) + ")"; }
  function bell(p, up) { p = Math.max(0, Math.min(1, p)); return p < up ? Math.sin(p / up * Math.PI / 2) : Math.pow((1 - p) / (1 - up), 1.7); }
  function glow(g, x, y, r, c, a) {
    if (a <= 0.002 || r <= 0) return;
    var gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, rgba(c, a)); gr.addColorStop(0.3, rgba(c, a * 0.62)); gr.addColorStop(0.6, rgba(c, a * 0.2)); gr.addColorStop(1, rgba(c, 0));
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function ell(g, x, y, rx, ry, c, a) {
    if (a <= 0.002) return;
    g.save(); g.translate(x, y); g.scale(1, ry / rx); glow(g, 0, 0, rx, c, a); g.restore();
  }
  function geom() { return { cx: W * 0.62, cy: H * 0.4, R: Math.min(W, H) * 0.36 }; }
  /* кромка: тёплый ореол, за ним смещённое к краю пятно света (обходит круг
     за 60 с), сверху — тёмный диск */
  function rim(b, t) {
    b.fillStyle = "rgba(2,1,1,.965)"; b.fillRect(0, 0, W, H);
    var g = geom(), cx = g.cx, cy = g.cy, R = g.R, ang = t * 6.2832 / PERIOD, br = 0.75 + 0.25 * Math.sin(t * 6.2832 / 13);
    /* кромка заметнее (глубокий аудит Б-53, D-909): на обычном экране стол Затмения читался чёрным, тема была
       неотличима от выключенного экрана — ореол и пятно света ярче в 1,6 раза; углы стола по-прежнему тёмные */
    glow(b, cx, cy, R * 1.5, [150, 70, 40], 0.145 * br);
    ell(b, cx + Math.cos(ang) * R * 0.5, cy + Math.sin(ang) * R * 0.5, R * 1.15, R * 1.15, [235, 140, 80], 0.32 * br);
    var dg = b.createRadialGradient(cx, cy, 0, cx, cy, R * 1.06);
    dg.addColorStop(0, "rgba(1,1,1,1)"); dg.addColorStop(0.9, "rgba(1,1,1,1)"); dg.addColorStop(1, "rgba(1,1,1,0)");
    b.fillStyle = dg; b.beginPath(); b.arc(cx, cy, R * 1.06, 0, 6.2832); b.fill();
  }
  function frame(now) {
    raf = 0;
    if (!cv) return;
    if (!on()) {
      if (dirty) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); dirty = false; }
      if (gate()) setTimeout(kick, 500);      /* ворота уйдут — кромка вернётся */
      return;
    }
    var still = reduced(), t = still ? 12 : (now - T0) / 1000;
    if (still) touches = [];
    touches = touches.filter(function (o) { return t - o.t < DUR; });
    nth++;
    /* 30 раз в секунду: свет медленный, разницы не видно, а кадр системы дешевле */
    if (!still && !dirty && (nth & 1)) { raf = requestAnimationFrame(frame); return; }
    /* под окном стоим: кадр остаётся, работы нет; окно уйдёт — kick() по классу */
    if (!still && parked() && !dirty && !touches.length) return;
    dirty = false;
    /* Кромка рисуется прямо в холст: фон и так меняется каждый кадр из
       тридцати, промежуточный холст давал лишь лишнее копирование экрана. */
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.setTransform(K, 0, 0, K, 0, 0);
    rim(ctx, t);
    for (var j = 0; j < touches.length; j++) {
      var o = touches[j], sb = bell((t - o.t) / DUR, 0.4);
      ell(ctx, o.x, o.y, 230, 190, [200, 110, 64], 0.08 * sb);
      glow(ctx, o.x, o.y, 60, [255, 180, 120], 0.045 * sb);
    }
    draws++;
    if (!still && !doc.hidden) raf = requestAnimationFrame(frame);
  }
  function kick() {
    if (!cv) return;
    dirty = true;
    if (reduced()) { if (raf) cancelAnimationFrame(raf); raf = 0; frame(performance.now()); }
    else if (!raf) raf = requestAnimationFrame(frame);
  }
  function size() {
    /* Ровно экран в CSS-пикселях на любой ширине — без растяжения (D-872 «сетки нет»).
       ОТКАТ: K = min(1, 1400 / большая сторона) растягивал холст ×1,23 на 1728 — та самая сетка. */
    W = window.innerWidth; H = window.innerHeight; K = 1;
    cv.width = Math.round(W * K); cv.height = Math.round(H * K); cover(); kick();
  }
  function mount() {
    var layer = doc.querySelector(".wp-layer");
    if (!layer || cv) return !!cv;
    cv = doc.createElement("canvas"); cv.id = "sbEclipse"; cv.setAttribute("aria-hidden", "true");
    cv.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
    layer.appendChild(cv); ctx = cv.getContext("2d");
    /* Касание слушается тихо, без перехвата: остальные слушатели стола
       (заметки, меню, точка света) получают его как прежде. */
    window.addEventListener("pointerdown", function (e) {
      if (!on() || reduced()) return;
      var tg = e.target;
      /* ОТКАТ: не откат на чужое значение — «||» здесь логическое «или»: касание по самому столу или по любому слою обоев. */
      if (!tg || tg.nodeType !== 1 || !(DESK[tg.id] || (tg.closest && tg.closest(".wp-layer")))) return;
      touches.push({ x: e.clientX, y: e.clientY, t: (performance.now() - T0) / 1000 });
      if (touches.length > 4) touches.shift();
      kick();
    }, { passive: true });
    window.addEventListener("resize", size);
    doc.addEventListener("visibilitychange", kick);
    if (mq.addEventListener) mq.addEventListener("change", kick);
    new MutationObserver(kick).observe(root, { attributes: true, attributeFilter: ["data-motion", "data-wp-mood", "data-theme", "class"] });
    var wl = doc.getElementById("windowLayer");
    if (wl) new MutationObserver(cover).observe(wl, { childList: true, subtree: true, attributes: true, attributeFilter: ["class"] });
    size();
    return true;
  }
  window.sbEclipse = {
    period: PERIOD,
    on: function () { return !!cv && on(); },
    geom: geom,
    draws: function () { return draws; },
    parked: function () { return parked(); }
  };
  function start() { if (!mount()) setTimeout(start, 200); }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", start);
  else start();
})();
