/* sys.baby OS — core/shepot/ryadom.js
 * ── ШЁПОТ «РЯДОМ» В СИСТЕМЕ (D-1435…D-1439, архив H4e5) ─────────────────────────────────────
 * ПОВОД — утверждённый основателем дизайн К3а «Рядом» (демо shepot-K3a-ryadom.html, 23–24.11.2026) и указания:
 *   · «тень собеседника — повернута к тебе (анфас/лёгкие 3/4 спереди), без черт лица; силуэт прежде контура»
 *     (24.11 ~20:20; образец силуэта — первая фигура «Рядом» из shepot-teni-10d.html);
 *   · «приложения не открываются надписью-заставкой с именем в центре» (24.11 ~13:55) — заставки здесь нет;
 *   · «в строке присутствия видна ровно одна надпись, слова не накладываются» (24.11 ~13:40) — закон
 *     tools/shepot-presence-one-check.mjs;
 *   · голосовые письма, живые смайлики в четырёх размерах, «позвать в разговор» (23.11, 25.11 ~13:05).
 *
 * ЧТО ЗДЕСЬ. Комната переписки рисует разговор Шёпота как прежде (apps/messenger + core/shepot/room.js);
 * этот модуль надевает на него «Рядом»: сцену с живой тенью собеседника за письмами, строку присутствия,
 * кнопки смайликов и голоса у поля письма, голосовое письмо (запись, волна, прослушивание) и лист
 * «позвать в разговор». Своего окна и своей памяти у модуля нет.
 *
 * ЧЕСТНОСТЬ. Тень не играет «печатает/читает»: у почты Шёпота таких сигналов нет, и выдумывать их нельзя
 * (правило комнаты: «no presence simulator»). Тень отвечает только на настоящее: связь включена — она
 * здесь; письмо пришло — склоняется ближе и теплеет; своё письмо дошло — кивает. Разговор на троих
 * требует общего ключа на троих, которого у Шёпота ещё нет, — лист «позвать» говорит это прямо и
 * предлагает настоящее: новое приглашение одному человеку (QR / «Передать», как прежде).
 *
 * ГОЛОС ОСТАЁТСЯ ЗДЕСЬ, ПОКА НЕ ЗАПЕЧАТАН. Запись — только на этом устройстве (MediaRecorder), никуда не
 * уходит сама. Отправленное голосовое — обычное письмо Шёпота: его байты (base64 в письме с меткой
 * VOICE) запечатывает и везёт та же почта, теми же ключами и каплями (core/shepot/core.js, post.js). Своей
 * криптографии здесь нет. Сам в сеть модуль не ходит.
 *
 * ДВИЖЕНИЕ. Тень рисуется на холсты один раз на тему; живёт только transform и opacity обёрток: дыхание — CSS-анимация
 * (композитор), наклон и свет — переходы по смене цели. Кадров скрипта нет; «меньше движения» — тень стоит.
 */
(function () {
  "use strict";
  var R = window.sbShepotRoom, P = window.sbShepotPost;
  if (!R || !R.there) { window.sbShepotRyadom = null; return; }

  var VOICE = "⁣sbv1:";          /* метка голосового письма: невидимый разделитель + имя образца */
  var MAX_S = 30, MAX_B64 = 160000;   /* ПОСТОЯННЫЕ: 30 с — предел записи (как в демо); 160 000 знаков ≈ 120 КБ — с запасом на 30 с при 24 кбит/с */
  var BARS = 40;                       /* ПОСТОЯННАЯ: столбиков волны — как в демо */
  var rec = null, play = null, seen = {}, presT = null;

  function t(k, v) { return typeof window.sbT === "function" ? window.sbT(k, v) : k; }
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (ch) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]; }); }
  function say(key) { try { if (window.sbVoice && window.sbVoice.say) window.sbVoice.say("", { key: key }); } catch (e) { /* голос занят — слово пропущено */ } }
  function still() { try { return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) || document.documentElement.getAttribute("data-motion") === "reduced"; } catch (e) { return false; /* ОТКАТ: не спросить — двигаемся, как все */ } }
  function fmt(d) { d = Math.max(1, Math.round(d)); var s = d % 60; return Math.floor(d / 60) + ":" + (s < 10 ? "0" : "") + s; }

  /* ── голосовое письмо: образец ── */
  function isVoice(text) { return typeof text === "string" && text.indexOf(VOICE) === 0; }
  function voiceOf(text) {
    if (!isVoice(text)) return null;
    try {
      var o = JSON.parse(text.slice(VOICE.length));
      if (!o || typeof o.a !== "string" || o.a.length > MAX_B64 || !/^[A-Za-z0-9+/]+=*$/.test(o.a)) return null;
      return { d: Math.max(0, Math.min(MAX_S + 1, +o.d || 0)), w: String(o.w || "").replace(/[^1-9]/g, "").slice(0, BARS),
        m: /^audio\/[a-z0-9.+\-]{1,24}(;\s?codecs=[a-z0-9.\-]{1,16})?$/i.test(String(o.m || "")) ? String(o.m) : "audio/webm", a: o.a };
    } catch (e) { return null; /* чужое или испорченное — показываем как письмо, не как голос */ }
  }
  function label(text) { var v = voiceOf(text); return v ? t("shr.voice", { d: fmt(v.d) }) : isVoice(text) ? t("shr.voice.coming") : null; }
  function bars(v) {
    var w = v.w || "", out = "";
    for (var i = 0; i < BARS; i++) { var a = w.length ? (+w.charAt(Math.floor(i * w.length / BARS)) || 1) / 9 : .3; out += '<i style="transform:scaleY(' + Math.max(.12, a).toFixed(2) + ')"></i>'; }
    return out;
  }
  /* Тело письма в комнате «Рядом»: голосовое — волна и длительность; слова — живые смайлики. */
  function inner(m) {
    if (m.shrPart) return '<div class="mg-text shr-part"></div>';
    if (isVoice(m.text) && !voiceOf(m.text)) return '<div class="mg-text shr-voice-coming">' + esc(t("shr.voice.coming")) + "</div>";
    var v = voiceOf(m.text);
    if (v) {
      var b = bars(v);
      return '<div class="mg-text shr-voice" role="button" tabindex="0" data-shr-voice="' + esc(m.id) + '" aria-label="' + esc(t("shr.voice.play", { d: fmt(v.d) })) + '">' +
        '<span class="shr-vw" aria-hidden="true"><span class="shr-vb">' + b + '</span><span class="shr-vh"><span class="shr-vb">' + b + "</span></span></span>" +
        '<span class="shr-vd">' + esc(fmt(v.d)) + "</span></div>";
    }
    var S = window.sbSmiles, txt = String(m.text || "");
    var only = !!(S && S.has(txt) && S.plain && !String(S.plain(txt, "name") || "").replace(/:[^:\s]+:|\s/g, ""));   /* письмо — один смайлик: без листа стекла */
    return '<div class="mg-text' + (only ? " shr-sm-only" : "") + '" data-sb-userdata>' + (S && S.has(txt) ? S.render(txt) : esc(txt)) + "</div>";
  }

  /* ── ТЕНЬ «РЯДОМ», ЛИЦОМ К ВАМ (образец — первая фигура shepot-teni-10d.html) ──────────────────────
     Голова анфас с лёгким поворотом (t .12), плечи, волосы с неровной кромкой. Черт лица нет: силуэт —
     сплошная тьма, свет только по внешнему краю (ореол за фигурой, мягкая кромка и тонкий контур). */
  var GW = 600, GH = 800, CX = 300, PI = Math.PI, TAU = PI * 2;
  function cv(w, h) { var c = document.createElement("canvas"); c.width = w || GW; c.height = h || GH; return c; }
  function rng(s) { return function () { s = s + 0x6D2B79F5 | 0; var q = Math.imul(s ^ s >>> 15, 1 | s); q = q + Math.imul(q ^ q >>> 7, 61 | q) ^ q; return ((q ^ q >>> 14) >>> 0) / 4294967296; }; }
  function sm(x) { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); }
  function crPath(x, A, closed) {
    var n = A.length, m = closed ? n : n - 1; x.moveTo(A[0][0], A[0][1]);
    for (var i = 0; i < m; i++) {
      var p0 = A[closed ? (i - 1 + n) % n : Math.max(0, i - 1)], p1 = A[i], p2 = A[(i + 1) % n], p3 = A[closed ? (i + 2) % n : Math.min(n - 1, i + 2)];
      x.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
    }
    if (closed) x.closePath();
  }
  function shape(x, A) { x.beginPath(); crPath(x, A, true); x.fill(); }
  function mir(Rt, Lt) { Lt = Lt || Rt; var o = Rt.map(function (p) { return [CX + p[0], p[1]]; }); for (var i = Lt.length - 2; i > 0; i--) o.push([CX - Lt[i][0], Lt[i][1]]); return o; }
  function T(A, dx, dy) { return A.map(function (p) { return [CX + p[0] + (dx || 0), p[1] + (dy || 0)]; }); }
  function turn(A, k, y0, y1, a) { return A.map(function (p) { return [p[0] + k * a * sm((p[1] - y0) / (y1 - y0)), p[1]]; }); }
  function cr1(a, b, c, d, u) { var u2 = u * u, u3 = u2 * u; return .5 * (2 * b + (-a + c) * u + (2 * a - 5 * b + 4 * c - d) * u2 + (-a + 3 * b - 3 * c + d) * u3); }
  function sample(A, k) {
    var o = [], m = A.length;
    for (var i = 0; i < m - 1; i++) { var p0 = A[Math.max(0, i - 1)], p1 = A[i], p2 = A[i + 1], p3 = A[Math.min(m - 1, i + 2)]; for (var j = 0; j < k; j++) { var u = j / k; o.push([cr1(p0[0], p1[0], p2[0], p3[0], u), cr1(p0[1], p1[1], p2[1], p3[1], u)]); } }
    o.push(A[m - 1]); return o;
  }
  function lock(x, A, w) {
    var S = sample(A, 6), n = S.length, L = [], Rr = [];
    for (var i = 0; i < n; i++) { var a = S[Math.max(0, i - 1)], b = S[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1, h = w * (1 - i / (n - 1)) / 2;
      L.push([S[i][0] - dy / d * h, S[i][1] + dx / d * h]); Rr.push([S[i][0] + dy / d * h, S[i][1] - dx / d * h]); }
    x.beginPath(); x.moveTo(L[0][0], L[0][1]); for (i = 1; i < n; i++) x.lineTo(L[i][0], L[i][1]); for (i = n - 1; i >= 0; i--) x.lineTo(Rr[i][0], Rr[i][1]); x.closePath(); x.fill();
  }
  function fringe(x, A, c, Rn, n, len, spread, curl) {
    var S = sample(A, 24);
    for (var i = 0; i < n; i++) {
      var p = S[Math.floor(Rn() * S.length)], a = Math.atan2(p[1] - c[1], p[0] - c[0]) + (Rn() - .5) * spread, l = len * (.35 + Rn() * .85), b = (Rn() - .5) * (curl || .6);
      var mm = [p[0] + Math.cos(a) * l * .5 + Math.cos(a + PI / 2) * l * b * .4, p[1] + Math.sin(a) * l * .5 + Math.sin(a + PI / 2) * l * b * .4], e = [p[0] + Math.cos(a + b) * l, p[1] + Math.sin(a + b) * l];
      lock(x, [[p[0] - Math.cos(a) * 3, p[1] - Math.sin(a) * 3], mm, e], 1.1 + Rn() * 1.6);
    }
  }
  function headHalf(o, ear) {
    var tp = o.top, h = o.chin - o.top, w = o.w, j = o.jaw, c = o.cw, A = [[0, tp], [w * .5, tp + h * .012], [w * .84, tp + h * .075], [w * .99, tp + h * .2], [w * 1.03, tp + h * .34]];
    if (ear > 0) A.push([w * 1.015, tp + h * .405], [w + ear * .6, tp + h * .425], [w + ear * .95, tp + h * .475], [w + ear * .88, tp + h * .56], [w + ear * .5, tp + h * .635], [w * .98, tp + h * .68]);
    else A.push([w * 1.0, tp + h * .48], [w * .96, tp + h * .64]);
    A.push([w * .9, tp + h * .74], [j, tp + h * .83], [j * .62 + c * .38, tp + h * .925], [c, tp + h * .982], [0, o.chin]); return A;
  }
  function head(o) { var A = mir(headHalf(o, o.ear), headHalf(o, o.ear)); return o.t ? turn(A, o.t, o.top + (o.chin - o.top) * .3, o.chin, 14) : A; }
  function bodyM() { return mir([[0, 384], [42, 386], [43, 412], [50, 436], [66, 452], [100, 466], [146, 480], [184, 494], [210, 512], [226, 538], [232, 576], [235, 640], [240, 880], [0, 880]]); }
  function bt(A, k) { return A.map(function (p) { var d = p[0] - CX; return [CX + d * (d > 0 ? 1 - k : 1 + k), p[1]]; }); }
  function figure(x) {
    var Rn = rng(101), o = { top: 196, chin: 420, w: 77, jaw: 60, cw: 22, ear: 11, t: .12 };
    shape(x, bt(bodyM(), .05)); shape(x, head(o));
    var hair = T([[-79, 276], [-82, 248], [-78, 220], [-62, 198], [-34, 186], [0, 183], [34, 186], [62, 198], [78, 220], [82, 248], [79, 276]]);
    shape(x, hair.concat(T([[60, 240], [0, 226], [-60, 240]])));
    fringe(x, hair.slice(1, -1), [300, 300], Rn, 300, 8, 1.1, .6);
  }
  var FILTER = (function () { try { var c = cv(2, 2).getContext("2d"); c.filter = "blur(2px)"; return c.filter === "blur(2px)"; } catch (e) { return false; /* ОТКАТ: без фильтра холста — мягкость сжатием */ } })();
  function blurred(src, px) {
    var o = cv(src.width, src.height), x = o.getContext("2d");
    if (!px) { x.drawImage(src, 0, 0); return o; }
    if (FILTER) { x.filter = "blur(" + px + "px)"; x.drawImage(src, 0, 0); x.filter = "none"; return o; }
    var f = Math.max(1.5, px * .7), s = cv(Math.max(1, Math.round(src.width / f)), Math.max(1, Math.round(src.height / f))), sx = s.getContext("2d");
    sx.imageSmoothingQuality = "high"; sx.drawImage(src, 0, 0, s.width, s.height); x.imageSmoothingQuality = "high"; x.drawImage(s, 0, 0, o.width, o.height); return o;
  }
  function tint(m, col, a, bl) { var c = blurred(m, bl), x = c.getContext("2d"); x.globalCompositeOperation = "source-in"; x.fillStyle = "rgba(" + col + "," + a + ")"; x.fillRect(0, 0, GW, GH); return c; }
  function erode(m, r) { var c = cv(), x = c.getContext("2d"); x.drawImage(m, 0, 0); x.globalCompositeOperation = "destination-in"; for (var k = 0; k < 16; k++) { var a = k / 16 * TAU; x.drawImage(m, Math.cos(a) * r, Math.sin(a) * r); } return c; }
  function edge(m, r) { var c = cv(), x = c.getContext("2d"); x.drawImage(m, 0, 0); x.globalCompositeOperation = "destination-out"; x.drawImage(erode(m, r), 0, 0); return c; }
  function fall(c, L, r0, r1) {
    var x = c.getContext("2d"); x.globalCompositeOperation = "destination-in";
    var g = x.createRadialGradient(L[0], L[1], r0, L[0], L[1], r1); g.addColorStop(0, "#000"); g.addColorStop(.55, "rgba(0,0,0,.55)"); g.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = g; x.fillRect(0, 0, GW, GH); x.globalCompositeOperation = "source-over"; return c;
  }
  function side(c, a0) {
    var x = c.getContext("2d"); x.globalCompositeOperation = "destination-in";
    var g = x.createLinearGradient(140, 0, 500, 0); g.addColorStop(0, "rgba(0,0,0," + a0 + ")"); g.addColorStop(1, "#000");
    x.fillStyle = g; x.fillRect(0, 0, GW, GH); x.globalCompositeOperation = "source-over"; return c;
  }
  function fadeLow(c) {   /* низ растворяется в темноте комнаты — без среза */
    var x = c.getContext("2d"); x.globalCompositeOperation = "destination-out";
    var f = x.createLinearGradient(0, 540, 0, GH); for (var i = 0; i <= 10; i++) { var q = i / 10; f.addColorStop(q, "rgba(0,0,0," + (q * q * (3 - 2 * q)).toFixed(3) + ")"); }
    x.fillStyle = f; x.fillRect(0, 0, GW, GH); x.globalCompositeOperation = "source-over"; return c;
  }
  function rgbOf(v, dflt) {
    v = String(v || "").trim(); var m = /^(\d+)\s*,\s*(\d+)\s*,\s*(\d+)$/.exec(v);
    if (m) return [+m[1], +m[2], +m[3]];
    m = /rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/.exec(v); if (m) return [+m[1], +m[2], +m[3]];
    m = /^#([0-9a-f]{6})$/i.exec(v); if (m) { var n = parseInt(m[1], 16); return [n >> 16, n >> 8 & 255, n & 255]; }
    return dflt;
  }
  /* Две картинки на тему: свет за фигурой (glow) и сама фигура со светом по кромке (fig). */
  function paint(stage) {
    var cs = getComputedStyle(stage.el), acc = rgbOf(cs.getPropertyValue("--accent-rgb"), [236, 148, 85]), edg = rgbOf(cs.getPropertyValue("--edge-rgb"), [255, 222, 194]);
    var bg = rgbOf(getComputedStyle(document.documentElement).getPropertyValue("--bg"), [19, 8, 2]), light = document.documentElement.getAttribute("data-theme") === "light";
    var key = acc.join() + "|" + edg.join() + "|" + bg.join() + "|" + light;
    if (stage.key === key) return; stage.key = key;
    var A = acc.join(","), E = light ? acc.map(function (v) { return Math.round(v * .7); }).join(",") : edg.join(","), L = [300, 330];
    var figCol = light ? "rgb(" + bg.map(function (v) { return Math.round(v * .55); }).join(",") + ")" : "rgb(" + bg.map(function (v) { return Math.round(v * .45); }).join(",") + ")";
    var M = cv(), mx = M.getContext("2d"); mx.fillStyle = figCol; mx.strokeStyle = figCol; mx.lineJoin = mx.lineCap = "round"; figure(mx);
    var k = light ? .55 : 1;
    /* свет за фигурой: тёплое контровое свечение — его тень заслоняет */
    var g0 = stage.glow, gx = g0.getContext("2d"); g0.width = GW; g0.height = GH; gx.clearRect(0, 0, GW, GH);
    var g = gx.createRadialGradient(L[0] + 10, L[1] - 10, 0, L[0] + 10, L[1] - 10, 285);   /* в пределах холста: края картинки не видно */
    g.addColorStop(0, "rgba(" + A + "," + (.5 * k) + ")"); g.addColorStop(.25, "rgba(" + A + "," + (.3 * k) + ")"); g.addColorStop(.5, "rgba(" + A + "," + (.12 * k) + ")"); g.addColorStop(.78, "rgba(" + A + "," + (.035 * k) + ")"); g.addColorStop(1, "rgba(" + A + ",0)");
    gx.fillStyle = g; gx.fillRect(0, 0, GW, GH); fadeLow(g0);
    /* фигура: ореол рассеяния, сплошной силуэт, мягкая кромка и тонкий контур — свет только по краю */
    var f0 = stage.fig, o = f0.getContext("2d"); f0.width = GW; f0.height = GH; o.clearRect(0, 0, GW, GH);
    o.drawImage(side(fall(tint(M, E, .42 * k, 30), L, 60, 420), .6), 0, 0);
    o.drawImage(side(fall(tint(M, E, .3 * k, 8), L, 60, 380), .5), 0, 0);
    o.drawImage(M, 0, 0);
    o.drawImage(side(fall(tint(edge(M, 5), A, .14 * k, 2), L, 40, 360), .3), 0, 0);
    o.drawImage(side(fall(tint(edge(M, 2.2), E, .7 * k, .7), L, 40, 400), .4), 0, 0);
    fadeLow(f0);
  }

  /* ── сцена: одна на окно, переживает перерисовку комнаты (узел переносится в новое место) ──
     ДВИЖЕНИЕ БЕЗ КАДРОВ СКРИПТА: дыхание — CSS-анимация обёртки (композитор, только transform), наклон, свет и
     присутствие — переход transform/opacity по смене цели. Скрипт лишь ставит цели по настоящим событиям. */
  function stageOf(win) {
    if (win._shrStage) return win._shrStage;
    var el = document.createElement("div"); el.className = "shr-stage"; el.setAttribute("aria-hidden", "true");
    el.innerHTML = '<div class="shr-body"><div class="shr-lean"><div class="shr-breath"><canvas class="shr-glow"></canvas><canvas class="shr-fig"></canvas></div></div></div><i class="shr-vig"></i>';
    var s = { el: el, lean: el.querySelector(".shr-lean"), glow: el.querySelector(".shr-glow"), fig: el.querySelector(".shr-fig"), key: "", pr: 0, ap: 0, wm: 0, ny: 0, timers: {} };
    win._shrStage = s; return s;
  }
  function apply(s) {
    var sc = 1 + s.ap * .045 + s.wm * .01, y = (1 - s.pr) * 14 + s.ny * 4;
    s.lean.style.transform = "translate3d(0," + y.toFixed(1) + "px,0) rotate(" + (-s.ny * .4).toFixed(2) + "deg) scale(" + sc.toFixed(4) + ")";
    s.lean.style.opacity = (.25 + .75 * s.pr).toFixed(3);
    s.glow.style.opacity = Math.min(1, .55 + .45 * s.pr + s.wm * .6).toFixed(3);
  }
  function pulse(s, n, a, ms) { s[n] = a; apply(s); clearTimeout(s.timers[n]); s.timers[n] = setTimeout(function () { s[n] = 0; apply(s); }, ms); }
  function run(s, pr) { s.pr = pr; apply(s); }

  /* ── строка присутствия: ровно одна надпись (закон shepot-presence-one-check) ──
     Старая надпись уходит вверх и гаснет, новая проявляется снизу с задержкой — сменяются только прямые
     дети строки; вложенное (.lit) остаётся в потоке своей надписи. */
  function recentAt(c) {
    var at = 0; (c.messages || []).forEach(function (m) { if (m.sh && m.from !== "me" && m.ts > at) at = m.ts; });
    return at;
  }
  function presText(c) {
    var at = recentAt(c), life = (P ? P.LIFE_S : 180) * 1000;
    return R.on() && at && Date.now() - at < life ? t("shr.pres.near") : R.headNote(c);
  }
  function setPres(win, host, c) {
    var line = host.querySelector("#shHead"); if (!line) return;
    var want = presText(c), was = win._shrSay;
    line.classList.add("shr-pres");
    if (was == null || was === want || still()) { line.innerHTML = '<span class="shr-say">' + esc(want) + "</span>"; win._shrSay = want; }
    else {
      /* уходящая надпись — только картинка (content: attr), не текст: чтец и копия видят одну строку, новую */
      line.innerHTML = '<span class="shr-say" aria-hidden="true" data-was="' + esc(was) + '"></span><span class="shr-say pre">' + esc(want) + "</span>"; win._shrSay = want;
      var nw = line.lastChild, old = line.firstChild;
      requestAnimationFrame(function () { requestAnimationFrame(function () { old.classList.add("out"); nw.classList.remove("pre"); }); });
      setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 420);   /* ПОСТОЯННАЯ: уход старой надписи (--t-move) с запасом */
    }
    /* «рядом» — пока свежо письмо; потом строка сама возвращается к связи, без перерисовки комнаты */
    clearTimeout(presT);
    var at = recentAt(c), life = (P ? P.LIFE_S : 180) * 1000;
    if (at && Date.now() - at < life) presT = setTimeout(function () { var h = win.el && win.el.querySelector(".window-body"); if (h && h.contains(line)) setPres(win, h, c); }, life - (Date.now() - at) + 60);
  }

  /* ── смайлики: лист восьми чувств и четырёх размеров; касание — письмо этим смайликом ── */
  var SIZE = "s";
  function smileSheet(win, host, c, api) {
    var S = window.sbSmiles; if (!S) return "";
    var names = S.list();
    return '<div class="shr-smenu" role="dialog" aria-label="' + esc(t("shr.smile")) + '"><div class="shr-sm-grid" role="group">' +
      names.map(function (x) { return '<button type="button" data-shr-sm="' + esc(x.e) + '" aria-label="' + esc(x.name) + '">' + S.svg(x.e, "big") + "</button>"; }).join("") +
      '</div><div class="shr-sm-sizes" role="radiogroup">' + S.sizes.map(function (z) { return '<button type="button" role="radio" data-shr-z="' + z + '" aria-checked="' + (z === SIZE) + '" aria-label="' + esc(z) + '"><i class="shr-zc shr-zc-' + z + '"></i></button>'; }).join("") + "</div></div>";
  }

  /* ── запись голоса: только здесь, MediaRecorder; волна — от настоящего звука ── */
  function mime() {
    var MR = window.MediaRecorder; if (!MR || !MR.isTypeSupported) return "";
    var list = ["audio/webm;codecs=opus", "audio/ogg;codecs=opus", "audio/mp4", "audio/webm"];
    for (var i = 0; i < list.length; i++) if (MR.isTypeSupported(list[i])) return list[i];
    return "";
  }
  function recStart(win, c, api) {
    if (rec) return;
    var md = navigator.mediaDevices;
    if (!md || !md.getUserMedia || !window.MediaRecorder) { say("shr.rec.none"); return; }
    rec = { win: win, c: c, api: api, t0: 0, amps: [], chunks: [], stream: null, mr: null, ac: null, an: null, buf: null, raf: 0, cancel: false, ready: false };
    var r0 = rec; api.render();
    md.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }).then(function (stream) {
      if (rec !== r0) { stream.getTracks().forEach(function (tr) { tr.stop(); }); return; }
      r0.stream = stream; var mt = mime();
      try { r0.mr = new MediaRecorder(stream, mt ? { mimeType: mt, audioBitsPerSecond: 24000 } : { audioBitsPerSecond: 24000 }); }
      catch (e) { recEnd(false); say("shr.rec.none"); return; }
      r0.mr.ondataavailable = function (ev) { if (ev.data && ev.data.size) r0.chunks.push(ev.data); };
      r0.mr.onstop = function () { finish(r0); };
      try { var AC = window.AudioContext || window.webkitAudioContext; r0.ac = new AC(); var src = r0.ac.createMediaStreamSource(stream); r0.an = r0.ac.createAnalyser(); r0.an.fftSize = 512; src.connect(r0.an); r0.buf = new Uint8Array(r0.an.fftSize); }
      catch (e) { r0.an = null; /* без анализатора волна — по времени, запись идёт */ }
      r0.mr.start(250); r0.t0 = performance.now(); r0.ready = true; say("shr.rec.local");
      waveLoop(r0);
    }, function () { if (rec === r0) { rec = null; api.render(); } say("shr.rec.denied"); });
  }
  function level(r0) {
    if (!r0.an) return .3 + .3 * Math.abs(Math.sin(performance.now() / 160));
    r0.an.getByteTimeDomainData(r0.buf); var s = 0; for (var i = 0; i < r0.buf.length; i++) { var v = (r0.buf[i] - 128) / 128; s += v * v; }
    return Math.min(1, Math.sqrt(s / r0.buf.length) * 4);
  }
  function waveLoop(r0) {
    var lastS = 0;
    (function loop(now) {
      if (rec !== r0) return;
      var tt = (now - r0.t0) / 1000;
      if (now - lastS > 70) { lastS = now; r0.amps.push(level(r0)); }   /* ПОСТОЯННАЯ: 70 мс — шаг волны, как в демо */
      var host = r0.win.el && r0.win.el.querySelector(".window-body"), cvs = host && host.querySelector(".shr-rwc"), tm = host && host.querySelector(".shr-rt");
      if (tm) tm.textContent = fmt(tt);
      if (cvs) {
        var x = cvs.getContext("2d"), rr = Math.min(2, window.devicePixelRatio || 1), w = cvs.clientWidth || 160, h = cvs.clientHeight || 26;
        if (cvs.width !== Math.round(w * rr)) { cvs.width = Math.round(w * rr); cvs.height = Math.round(h * rr); }
        x.setTransform(rr, 0, 0, rr, 0, 0); x.clearRect(0, 0, w, h); x.fillStyle = getComputedStyle(cvs).color;
        var n = Math.floor(w / 4), a = r0.amps.slice(-n);
        for (var k = 0; k < a.length; k++) { var bh = Math.max(2, a[k] * (h - 2)); x.globalAlpha = .35 + .65 * (k / n); x.fillRect(w - (a.length - k) * 4, (h - bh) / 2, 2.2, bh); }
        x.globalAlpha = 1;
      }
      if (tt > MAX_S) { recEnd(true); return; }
      r0.raf = requestAnimationFrame(loop);
    })(performance.now());
  }
  function recEnd(sendIt) {
    var r0 = rec; if (!r0) return; rec = null;
    r0.cancel = !sendIt; r0.dur = r0.t0 ? (performance.now() - r0.t0) / 1000 : 0;
    if (r0.raf) cancelAnimationFrame(r0.raf);
    if (r0.mr && r0.mr.state !== "inactive") { try { r0.mr.stop(); } catch (e) { finish(r0); } } else finish(r0);
    r0.api.render();
  }
  function finish(r0) {
    if (r0.done) return; r0.done = true;
    if (r0.stream) r0.stream.getTracks().forEach(function (tr) { tr.stop(); });
    if (r0.ac) { try { r0.ac.close(); } catch (e) { /* уже закрыт */ } }
    if (r0.cancel || r0.dur < .6 || !r0.chunks.length) { r0.chunks = []; return; }   /* ПОСТОЯННАЯ: короче 0,6 с — случайное касание, как в демо */
    var type = (r0.mr && r0.mr.mimeType) || mime() || "audio/webm", blob = new Blob(r0.chunks, { type: type }); r0.chunks = [];
    var fr = new FileReader();
    fr.onload = function () {
      var b64 = String(fr.result || "").replace(/^data:[^,]*,/, "");
      if (!b64 || b64.length > MAX_B64) { say("shr.rec.long"); return; }
      var a = r0.amps, w = "";
      for (var i = 0; i < BARS; i++) { var s0 = Math.floor(i * a.length / BARS), s1 = Math.max(s0 + 1, Math.floor((i + 1) * a.length / BARS)), m = 0; for (var j = s0; j < s1; j++) m = Math.max(m, a[j] || 0); w += Math.max(1, Math.min(9, Math.round(m * 9))); }
      var text = VOICE + JSON.stringify({ v: 1, d: Math.round(r0.dur * 10) / 10, w: w, m: type.split(";")[0], a: b64 });
      if (R.send(r0.win, r0.c, text)) { say("shr.rec.long"); r0.api.render(); }
    };
    fr.readAsDataURL(blob);
  }

  /* ── прослушивание: волна светлеет ровно в такт звуку ── */
  function listen(win, c, id) {
    if (play && play.id === id) { stopPlay(); return; }
    stopPlay();
    var m = null; (c.messages || []).forEach(function (x) { if (String(x.id) === String(id)) m = x; });
    var v = m && voiceOf(m.text); if (!v) return;
    var bin; try { bin = atob(v.a); } catch (e) { return; /* испорченные байты — молчим */ }
    var u8 = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    var url = URL.createObjectURL(new Blob([u8], { type: v.m })), au = new Audio(url);
    play = { id: id, au: au, url: url, win: win, d: v.d || 1, raf: 0 };
    var p0 = play;
    au.onended = function () { if (play === p0) stopPlay(); };
    au.play().then(null, function () { if (play === p0) stopPlay(); });
    (function loop() {
      if (play !== p0) return;
      var host = win.el && win.el.querySelector(".window-body"), el = host && host.querySelector('[data-shr-voice="' + String(id).replace(/"/g, "") + '"]');
      var dur = isFinite(au.duration) && au.duration > 0 ? au.duration : p0.d, k = Math.max(0, Math.min(1, au.currentTime / dur));
      if (el) { var vh = el.querySelector(".shr-vh"), vb = vh && vh.firstChild; el.classList.add("on"); if (vh) vh.style.transform = "translateX(" + ((k - 1) * 100).toFixed(2) + "%)"; if (vb) vb.style.transform = "translateX(" + ((1 - k) * 100).toFixed(2) + "%)"; }
      p0.raf = requestAnimationFrame(loop);
    })();
  }
  function stopPlay() {
    if (!play) return; var p0 = play; play = null;
    if (p0.raf) cancelAnimationFrame(p0.raf);
    try { p0.au.pause(); } catch (e) { /* уже стоит */ }
    URL.revokeObjectURL(p0.url);
    var host = p0.win.el && p0.win.el.querySelector(".window-body"), el = host && host.querySelector('[data-shr-voice="' + String(p0.id).replace(/"/g, "") + '"]');
    if (el) { el.classList.remove("on"); var vh = el.querySelector(".shr-vh"); if (vh) { vh.style.transform = ""; if (vh.firstChild) vh.firstChild.style.transform = ""; } }
  }

  /* ── знаки: микрофон рисуется заливкой на сетке 100, как знаки набора (контурных значков в системе нет) ── */
  var MIC = '<svg class="shr-ic" viewBox="0 0 100 100" fill="currentColor" aria-hidden="true" focusable="false"><rect x="38" y="10" width="24" height="48" rx="12"/><path d="M20 44h12a18 18 0 0 0 36 0h12a30 30 0 0 1-24 29.4V84h12v10H32V84h12V73.4A30 30 0 0 1 20 44Z"/></svg>';

  /* ── голосовое приходит частями ── Почта режет длинное письмо на части по такту, и каждая часть приходит своим
     письмом по порядку (post.js queue). Голосовое собирается здесь: начало с меткой VOICE и следующие за ним части
     того же собеседника склеиваются, пока образец не прочтётся целиком. Возвращает true, если что-то склеено. */
  function gather(c) {
    var ms = c.messages || [], changed = false;
    for (var i = 0; i < ms.length; i++) {
      var m = ms[i]; if (!m || !m.sh || m.from === "me" || !isVoice(m.text) || voiceOf(m.text)) continue;
      var txt = m.text, j = i + 1;
      while (j < ms.length && ms[j].sh && ms[j].from !== "me" && !isVoice(ms[j].text) && txt.length < MAX_B64 + 400) {
        txt += ms[j].text; j++;
        if (voiceOf(txt)) { m.text = txt; ms.splice(i + 1, j - i - 1); changed = true; break; }
      }
      if (!voiceOf(m.text)) for (var k = i + 1; k < j; k++) ms[k].shrPart = 1;   /* остальное ещё в пути: части не показываются */
    }
    return changed;
  }
  /* ── надеть «Рядом» на разговор Шёпота после каждой перерисовки комнаты ── */
  function mount(win, host, c, api) {
    if (gather(c) && api.write) { api.write(); api.render(); return; }
    var thread = host.querySelector(".mg-thread"), app = host.querySelector(".app-msgr");
    if (!thread || !c || !R.is(c)) { if (app) app.classList.remove("shr-room"); return; }
    thread.classList.add("shr"); if (app) app.classList.add("shr-room");
    /* сцена с тенью — за письмами */
    var s = stageOf(win), slot = thread.querySelector(".shr-slot");
    if (slot) slot.appendChild(s.el);
    paint(s);
    var theirs = 0, done = 0; (c.messages || []).forEach(function (m) { if (m.sh && m.from !== "me") theirs++; if (m.sh && m.from === "me" && m.shDone) done++; });
    var mem = seen[c.id] || (seen[c.id] = { theirs: theirs, done: done });
    run(s, R.on() ? (Date.now() - recentAt(c) < (P ? P.LIFE_S : 180) * 1000 ? 1 : .8) : .45);
    if (theirs > mem.theirs) { pulse(s, "ap", .9, 1600); pulse(s, "wm", .5, 1800); }   /* письмо пришло — склонился ближе, тепло */
    if (done > mem.done) pulse(s, "ny", 1, 900);                                       /* своё дошло — кивнул */
    mem.theirs = theirs; mem.done = done;
    setPres(win, host, c);
    /* живые смайлики: только видимые, не больше шести (на слабом — двух); новые — «пружинкой» */
    var box = host.querySelector("#mgMessages");
    if (box && window.sbSmiles && window.sbSmiles.alive) {
      var last = (c.messages || [])[c.messages.length - 1];
      if (last && !mem["sm" + last.id]) { mem["sm" + last.id] = 1; var el = box.querySelector('[data-msg="' + String(last.id).replace(/"/g, "") + '"]'); if (el && mem.ready) el.querySelectorAll("svg.sb-sm").forEach(function (sv) { sv.classList.add("go"); setTimeout(function () { sv.classList.remove("go"); }, 700); }); }
      mem.ready = true;
      window.sbSmiles.alive(box);
    }
    /* шапка: «позвать в разговор» */
    var head = thread.querySelector(".mg-head");
    if (head && !head.querySelector("#shrInvite")) {
      var ib = document.createElement("button"); ib.type = "button"; ib.id = "shrInvite"; ib.className = "shr-hbtn"; ib.setAttribute("aria-label", t("shr.invite")); ib.title = t("shr.invite");
      ib.setAttribute("aria-expanded", win._shrSheet ? "true" : "false"); ib.innerHTML = window.sbZnak ? window.sbZnak("people") : "";
      var first = head.querySelector("#shLink"); if (first) head.insertBefore(ib, first); else head.appendChild(ib);
      ib.addEventListener("click", function () { win._shrSheet = !win._shrSheet; win._shrSheetSay = ""; win._shrSm = false; api.render(); });
    }
    /* лист «позвать в разговор» */
    if (win._shrSheet) {
      var others = api.convos().filter(function (o) { return o !== c && R.is(o); });
      var sh = document.createElement("div"); sh.className = "shr-sheet"; sh.setAttribute("role", "dialog"); sh.setAttribute("aria-label", t("shr.inv.title"));
      sh.innerHTML = '<p class="shr-sh-t">' + esc(t("shr.inv.title")) + "</p>" +
        others.map(function (o) { return '<button type="button" data-shr-inv="' + esc(o.id) + '"><i></i><span data-sb-userdata>' + esc(o.name) + "</span></button>"; }).join("") +
        '<button type="button" data-shr-new><i class="shr-new"></i>' + esc(t("shr.inv.new")) + "</button>" +
        '<p class="shr-sh-say" role="status">' + esc(win._shrSheetSay || "") + "</p>";
      thread.appendChild(sh);
      sh.addEventListener("click", function (ev) {
        var b = ev.target.closest("button"); if (!b) return;
        if (b.hasAttribute("data-shr-inv")) { win._shrSheetSay = t("shr.inv.three"); var p = sh.querySelector(".shr-sh-say"); if (p) p.textContent = win._shrSheetSay; return; }
        if (b.hasAttribute("data-shr-new")) { win._shrSheet = false; win._msgrNewOpen = true; win._msgrNewTab = "direct"; api.render(); var go = win.el && win.el.querySelector("#shInvite"); if (go) go.click(); }
      });
    }
    /* поле письма: смайлики и голос */
    var row = thread.querySelector(".mg-inputrow"), inp = row && row.querySelector("#msgrInput");
    if (row && inp && !row.querySelector("#shrSmile")) {
      var off = inp.disabled;
      inp.setAttribute("data-sm-key", "shr");   /* у поля своя кнопка смайликов — общая кнопка ядра сюда не встаёт */
      var sb = document.createElement("button"); sb.type = "button"; sb.id = "shrSmile"; sb.className = "shr-cbtn"; sb.setAttribute("aria-label", t("shr.smile")); sb.title = t("shr.smile");
      sb.setAttribute("aria-expanded", win._shrSm ? "true" : "false"); sb.disabled = off;
      sb.innerHTML = window.sbSmiles ? window.sbSmiles.svg("happy") : "";
      row.insertBefore(sb, inp);
      var mb = document.createElement("button"); mb.type = "button"; mb.id = "shrMic"; mb.className = "shr-cbtn"; mb.disabled = off;
      mb.setAttribute("aria-pressed", rec ? "true" : "false"); mb.setAttribute("aria-label", t(rec ? "shr.rec.stop" : "shr.mic")); mb.title = t(rec ? "shr.rec.stop" : "shr.mic");
      mb.innerHTML = MIC + '<i class="shr-mw" aria-hidden="true"><b></b><b></b><b></b></i>';
      var send = row.querySelector("#mgSend"); row.insertBefore(mb, send || null);
      var rw = document.createElement("div"); rw.className = "shr-rec"; rw.setAttribute("aria-live", "polite");
      rw.innerHTML = '<button type="button" class="shr-rcx" id="shrRecCancel" aria-label="' + esc(t("shr.rec.cancel")) + '">' + (window.sbZnak ? window.sbZnak("close") : "") + '</button><canvas class="shr-rwc" aria-hidden="true"></canvas><span class="shr-rt">0:00</span><span class="shr-rh">' + esc(t("shr.rec.hint")) + "</span>";
      row.appendChild(rw);
      row.classList.toggle("shr-recording", !!rec);
      sb.addEventListener("click", function () { win._shrSm = !win._shrSm; win._shrSheet = false; api.render(); });
      mb.addEventListener("click", function () { if (rec) recEnd(true); else recStart(win, c, api); });
      rw.querySelector("#shrRecCancel").addEventListener("click", function () { recEnd(false); });
    }
    if (win._shrSm && row && !(inp && inp.disabled)) {
      var mwrap = document.createElement("div"); mwrap.innerHTML = smileSheet(win, host, c, api); var menu = mwrap.firstChild;
      if (menu) {
        row.appendChild(menu);   /* лист стоит над полем, не на кнопке */
        menu.addEventListener("click", function (ev) {
          var b = ev.target.closest("button"); if (!b) return;
          if (b.hasAttribute("data-shr-z")) { SIZE = b.getAttribute("data-shr-z"); menu.querySelectorAll("[data-shr-z]").forEach(function (x) { x.setAttribute("aria-checked", String(x === b)); }); return; }
          var e = b.getAttribute("data-shr-sm"), S = window.sbSmiles; if (!e || !S) return;
          win._shrSm = false;
          if (R.send(win, c, S.sign(e, 0, SIZE))) api.render(); else api.render();
        });
      }
    }
    /* голосовые письма в разговоре: касание — слушать */
    host.querySelectorAll("[data-shr-voice]").forEach(function (el) {
      var go = function () { listen(win, c, el.getAttribute("data-shr-voice")); };
      el.addEventListener("click", go);
      el.addEventListener("keydown", function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); go(); } });
      if (play && String(play.id) === el.getAttribute("data-shr-voice")) el.classList.add("on");
    });
  }
  /* Комната ушла с разговора Шёпота — запись и звук гаснут, ничего не остаётся «в пути». */
  function leave(win) {
    if (rec && rec.win === win) recEnd(false);
    if (play && play.win === win) stopPlay();

  }
  if (window.sbBus && typeof window.sbBus.on === "function") window.sbBus.on("window:closed", function (e) { if (e && e.id === "messenger") { if (rec) recEnd(false); stopPlay(); } });

  window.sbShepotRyadom = { mount: mount, leave: leave, inner: inner, label: label, isVoice: isVoice, VOICE: VOICE,
    state: function () { return { rec: !!rec, play: play ? String(play.id) : null }; } };
})();
