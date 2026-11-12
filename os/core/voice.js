/* sys.baby OS — core/voice.js · ГОЛОС ДОМА (D-810…819, архив «Дом — мой», v178-H4a, пакет П1)
 *
 * Решение основателя 11.11.2026 (демо golos-doma4 и dom-moy-A): система говорит
 * «пылью света». Пылинки собираются в гладкие светящиеся буквы Nunito, у самого
 * низа — на линии «шёпота внизу» (--desk-row-b, правило v66: у стола один голос
 * и одно место). Одна фраза за раз; касание — допечатать; слова-кнопки —
 * настоящие <button>; aria-live получает всю фразу; «меньше движения» — фраза
 * стоит сразу, холст неподвижен.
 *
 * ПЕРЕХОДНИК. Сорок с лишним мест системы зовут showToast / showStandingToast /
 * sbAsk / sbShowUndoToast — их не правим поштучно. Блок тостов shell.js отдаёт
 * каждое извещение сюда (sbVoice.take): тот же элемент .toast остаётся в
 * #toastLayer (на него опираются комнаты и законы — data-title, .toast-action,
 * handle.el), но плашкой он больше не выглядит: это строка голоса, а её буквы
 * рисует свет на холсте. Кнопки извещения становятся словами-кнопками фразы.
 *
 * ВЕЧЕРНИЙ ВЫПУСК. Сказанное по делу (событие, пришедшее само, и важное)
 * записывается в колокольчик (panels.js, sbNotifRecord). Ответ на своё же
 * нажатие — нет (слово основателя v47.3). Тёплое слово (warm) не пишется нигде.
 * Важное для безопасности не тает, пока не коснутся самих слов.
 *
 * На воротах, экране входа и прощании голос молчит: там чужие глаза.
 * «Не беспокоить» — пришедшее само не звучит (но ложится в выпуск); вопрос
 * человека звучит тише. «На людях» — без имени и без подробностей.
 * Обращение и род — у знакомства (window.sbAddr, пакет П2); без него — «вы» без рода.
 * Смена языка перерисовывает сказанное (аудит п.6).
 * Договор для пакетов: scratchpad plan-dalshe/P1-VOICE-API.md. Законы: tools/voice-*-check.mjs. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var mq = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  function still() { return mq.matches || root.getAttribute("data-motion") === "reduced"; }
  function el(tag, cls) { var e = doc.createElement(tag); if (cls) e.className = cls; return e; }

  /* слова самого голоса (D-823): подпись кнопки для чтеца и подсказка про смахивание.
     Род дома (sbAddr.H) — .he / .d; форма обращения — .ty (см. form() ниже). */
  if (typeof window.sbAddStrings === "function") window.sbAddStrings({
    en: { "voice.close": "close the phrase", "voice.swipe": "Swipe down to quiet me.", "voice.swipe.he": "Swipe down to quiet me.", "voice.swipe.d": "Swipe down to quiet me." },
    ru: { "voice.close": "закрыть фразу",
      "voice.swipe": "Смахните вниз, чтобы я замолчала.", "voice.swipe.ty": "Смахни вниз, чтобы я замолчала.",
      "voice.swipe.he": "Смахните вниз, чтобы я замолчал.", "voice.swipe.he.ty": "Смахни вниз, чтобы я замолчал.",
      "voice.swipe.d": "Смахните вниз — и я замолчу.", "voice.swipe.d.ty": "Смахни вниз — и я замолчу." },
    ee: { "voice.close": "sulge lause",
      "voice.swipe": "Pühkige alla, et ma vaikiksin.", "voice.swipe.ty": "Pühi alla, et ma vaikiksin.",
      "voice.swipe.he": "Pühkige alla, et ma vaikiksin.", "voice.swipe.he.ty": "Pühi alla, et ma vaikiksin.",
      "voice.swipe.d": "Pühkige alla, et ma vaikiksin.", "voice.swipe.d.ty": "Pühi alla, et ma vaikiksin." }
  });

  /* ── слова ─────────────────────────────────────────────────────────── */
  function tr(k, v) { return window.sbT ? window.sbT(k, v) : k; }
  function has(k) { return !!window.sbT && window.sbT(k) !== k; }
  /* Память переводов: какая строка каким ключом сказана. Текст извещения
     приходит уже переведённым; чтобы перерисовать его на новом языке, голос
     помнит, из какого ключа он вышел (sbT зовётся за миг до showToast). */
  var memo = {}, memoN = 0;
  function wrapT() {
    var o = window.sbT; if (!o || o._voice) return;
    var f = function (k, v) {
      var s = o(k, v);
      if (typeof s === "string" && s !== k && s.length > 1) {
        if (memoN > 900) { memo = {}; memoN = 0; }
        if (!memo[s]) memoN++;
        memo[s] = { k: k, v: v };
      }
      return s;
    };
    f._voice = true; window.sbT = f;
  }
  /* имя комнаты — у описи комнат, а не у словаря: ищем его по всем языкам */
  function appBack(s) {
    var A = (window.SysBaby && window.SysBaby.apps) || {}, id, d, l, back = window.sbAppTitle;
    if (typeof back !== "function") return null;
    for (id in A) { d = A[id]; if (!d) continue;
      if (d.title === s) return back(id);
      if (d.i18n) for (l in d.i18n) if (d.i18n[l] && d.i18n[l].title === s) return back(id); }
    return null;
  }
  function retr(s) {
    if (s == null || s === "") return s;
    var m = memo[s];
    if (m) {
      var v = null, k;
      if (m.v) { v = {}; for (k in m.v) v[k] = typeof m.v[k] === "string" ? retr(m.v[k]) : m.v[k]; }
      return tr(m.k, v);
    }
    var a = appBack(s); return a == null ? s : a;
  }

  /* ── обращение и род (П2: window.sbAddr) ──────────────────────────── */
  function addr() {
    var A = window.sbAddr, o = { ty: false, r: "", pub: false };
    try {
      if (A && typeof A.V === "function") o.ty = A.V(true, false) === true;
      if (A && typeof A.R === "function") o.r = A.R("m", "f", "") || "";
      if (A && A.pub != null) o.pub = typeof A.pub === "function" ? !!A.pub() : !!A.pub;
    } catch (e) { /* знакомства ещё нет — «вы» без рода */ }
    if (window.sbVoicePubLaw) o.pub = true;
    return o;
  }
  /* key.pub → key.ty.m|f → key.ty → key.vy.m|f → key */
  function form(k, vars) {
    var a = addr(), c = [];
    if (a.pub) c.push(k + ".pub");
    if (a.ty) { if (a.r) c.push(k + ".ty." + a.r); c.push(k + ".ty"); }
    else if (a.r) c.push(k + ".vy." + a.r);
    for (var i = 0; i < c.length; i++) if (has(c[i])) return tr(c[i], vars);
    return tr(k, vars);
  }

  /* ── где мы ───────────────────────────────────────────────────────── */
  /* ворота, вход, прощание: голос молчит; занавес загрузки — подождать */
  function gated() {
    if (doc.getElementById("sbFarewell")) return true;
    /* экран входа: сессии нет и первое слово ещё не сказано (после первого слова дом открыт сразу) */
    if (!root.classList.contains("sb-has-session") && !window.sbFirstWordAt) {
      var lg = doc.getElementById("sbLogin");
      if (!lg || (getComputedStyle(lg).display !== "none" && !lg.classList.contains("out"))) return true;
    }
    /* ворота замка ещё тают, а дом уже открыт — это уже дом */
    return !!doc.getElementById("sbVaultGate") && !(window.sbVault && window.sbVault.isOpen && window.sbVault.isOpen());
  }
  function curtain() { return !!doc.getElementById("sbCurtain"); }
  function dnd() { return !!(window.sbGetControlToggle && window.sbGetControlToggle("dnd")); }

  /* ── шрифт ────────────────────────────────────────────────────────── */
  /* Вариативный Nunito (OFL-1.1, ось веса 200–400, D-823): буквы собираются в лёгком
     весе wA, после сборки вес «наливается» до wF — тем весом стоит прозрачный носитель
     (.sb-vl в voice.css), поэтому итоговый кадр холста совпадает с раскладкой носителя. */
  var FONT = "SB Voice", fontsReady = false;
  function phone() { return innerWidth <= 480; }
  function px() { return phone() ? 19.5 : 21.5; }
  function wA() { return phone() ? 260 : 240; }
  function wF() { return phone() ? 365 : 340; }
  function fcss(p, w) { return Math.round(w || wF()) + " " + (p || px()) + "px \"" + FONT + "\", system-ui, sans-serif"; }
  /* Грани шрифта голоса — здесь, а не @font-face в voice.css (доска H4, ark-check): адреса берутся у
     link rel="sb-precache" data-face (их же читает опись офлайна), Ковчег подменяет их data:-адресами,
     и файл без сети говорит тем же шрифтом. Грани прежние: вес 200–400, кириллица / латиница. */
  var FACES = { cyr: "U+0400-045F, U+2116", lat: "U+0020-007E, U+00A0, U+00AB, U+00B0, U+00BB, U+00C0-00FF, U+2013, U+2014, U+2026" };
  if (window.FontFace && doc.fonts && doc.fonts.add) {
    Array.prototype.forEach.call(doc.querySelectorAll('link[rel="sb-precache"][data-face]'), function (l) {
      var k = l.getAttribute("data-face");
      if (!FACES[k]) return;
      try { doc.fonts.add(new FontFace(FONT, 'url("' + l.href + '") format("woff2")', { weight: "200 400", style: "normal", display: "swap", unicodeRange: FACES[k] })); }
      catch (e) { /* грань не встала — фраза пишется system-ui, как до загрузки шрифта (fcss держит запасной) */ }
    });
  }
  if (doc.fonts && doc.fonts.load) {
    Promise.all([doc.fonts.load(fcss(21.5, 240), "Аяё—«?»,.0"), doc.fonts.load(fcss(21.5, 340), "Аяё—«?»,.0"), doc.fonts.load(fcss(21.5, 340), "Aõäöü")])
      .then(function () { fontsReady = true; MET = {}; reflow(); }, function () { fontsReady = true; });
  } else fontsReady = true;

  function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function sm(x) { x = cl(x); return x * x * (3 - 2 * x); }
  function smr(x) { x = cl(x); return x * x * x * (x * (x * 6 - 15) + 10); }
  function rng(s) { return function () { s |= 0; s = s + 0x6D2B79F5 | 0; var t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function mk(w, h) { var c = doc.createElement("canvas"); c.width = Math.max(1, w | 0); c.height = Math.max(1, h | 0); return c; }
  var TAU = Math.PI * 2;

  /* ── ЦВЕТ — ИЗ ТЕМЫ · D-823 ──────────────────────────────────────────
     Пыль, небо, свет букв и имя берутся из токенов текущей темы: --accent-rgb,
     --edge-rgb, --wp-light-rgb (свет поля), --ink-rgb, --star-rgb. Тёплых чисел
     здесь нет: в Океане пыль голубоватая, в Авроре — зеленоватая, в Затмении —
     янтарная, в Тепле — своя. В Светлице голос не тёмный брус: буквы чернилами
     темы, пыль акцентом, небо — лёгкая дымка, свет кладётся обычным наложением.
     Время суток меняет тон и густоту пыли (утро — бледное золото из --star-rgb,
     день — жемчуг, вечер — акцент, ночь — серебро и реже) — смешением тех же токенов. */
  var GRAY = [200, 200, 200], WHITE = [255, 255, 255];
  function tok(n, d) {
    var v = getComputedStyle(root).getPropertyValue(n).trim().split(",").map(function (s) { return parseFloat(s); });
    return v.length === 3 && v.every(isFinite) ? v : d;
  }
  function mix(a, b, k) { return [Math.round(a[0] + (b[0] - a[0]) * k), Math.round(a[1] + (b[1] - a[1]) * k), Math.round(a[2] + (b[2] - a[2]) * k)]; }
  function desat(a, k) { var g = 0.3 * a[0] + 0.59 * a[1] + 0.11 * a[2]; return mix(a, [g, g, g], k); }
  function rgba(a, al) { return "rgba(" + a[0] + "," + a[1] + "," + a[2] + "," + (al < 0 ? 0 : al > 1 ? 1 : al).toFixed(3) + ")"; }
  function hourNow() { return window.sbVoiceHourLaw != null ? +window.sbVoiceHourLaw : new Date().getHours(); }
  function todOf(h) { return h >= 6 && h < 11 ? "morning" : h >= 11 && h < 17 ? "day" : h >= 17 && h < 22 ? "evening" : "night"; }
  var pal = null;
  function palette() {
    var light = root.getAttribute("data-theme") === "light";
    var ac = tok("--accent-rgb", GRAY), ed = tok("--edge-rgb", ac), wl = tok("--wp-light-rgb", ac), ink = tok("--ink-rgb", GRAY), st = tok("--star-rgb", ed);
    var tod = todOf(hourNow()), P = { light: light, tod: tod, dens: tod === "night" ? 0.6 : tod === "evening" ? 0.95 : 1 }, base, tint;
    if (!light) {
      P.text = mix(ed, WHITE, 0.55);
      P.name = mix(ac, WHITE, 0.28);
      base = [mix(ed, WHITE, 0.5), mix(ed, WHITE, 0.8), mix(ed, ac, 0.25)];
      P.stars = [mix(ed, WHITE, 0.6), mix(ed, WHITE, 0.85), desat(mix(ed, WHITE, 0.4), 0.4)];
      /* туманность — от акцента: молоко кромки и тёмный свет поля поверх тёплого пола читались бурыми
         (teplo-mandarin при говорящем голосе); кромка — только примесью */
      P.neb = [[ac, 0.40], [mix(ac, wl, 0.3), 0.22], [mix(ac, ed, 0.25), 0.28], [mix(ed, ac, 0.55), 0.26], [mix(ac, wl, 0.45), 0.14]];
      P.nebA = 0.85; P.starK = 1; P.comp = "lighter";
      tint = tod === "morning" ? function (c) { return mix(c, mix(st, WHITE, 0.5), 0.25); }
        : tod === "day" ? function (c) { return mix(c, WHITE, 0.3); }
        : tod === "evening" ? function (c) { return mix(c, ac, 0.3); }
        : function (c) { return mix(desat(c, 0.7), WHITE, 0.15); };
      P.glow = tod === "morning" ? [mix(ac, mix(st, WHITE, 0.4), 0.5), 0.42] : tod === "day" ? [mix(ac, ed, 0.55), 0.42]
        : tod === "evening" ? [ac, 0.46] : [desat(mix(ac, ed, 0.6), 0.7), 0.34];
    } else {
      P.text = mix(ink, ac, 0.12);
      P.name = mix(ac, ink, 0.22);
      base = [ac, mix(ac, ink, 0.35), mix(ac, ed, 0.4)];
      P.stars = [mix(ac, ink, 0.3), ac];
      P.neb = [[ac, 0.20], [mix(ac, wl, 0.5), 0.12], [ed, 0.16], [mix(ed, WHITE, 0.5), 0.2], [wl, 0.08]];
      P.nebA = 0.6; P.starK = 0.45; P.comp = "source-over";
      tint = tod === "morning" ? function (c) { return mix(c, st, 0.2); } : tod === "evening" ? function (c) { return mix(c, ac, 0.3); }
        : tod === "night" ? function (c) { return desat(c, 0.5); } : function (c) { return c; };
      P.glow = [ac, tod === "night" ? 0.12 : 0.16];
    }
    P.dust = base.map(tint);
    P.key = [light, tod, ac, ed, wl, ink].join("|");
    return P;
  }

  /* ── холст, небо и пул пылинок ──────────────────────────────────────
     Перенос движка «лунной пыли» (демо raznoobrazie.html, стратегия «живой»):
     пыль летит в пиксели растра букв (при плотности экрана) и в последние ~15 %
     пути каждого слога растворяется в чёткий текст того же растра. Раскладку
     даёт носитель (DOM): каждый знак рисуется в своей измеренной точке.
     Небо: дальний слой (туманность и мелкие звёзды) — отдельный холст
     #sbVoiceSky, рисуется один раз и плывёт/гаснет стилем (кадр его не
     перерисовывает); средние звёзды и ближние пылинки — на #sbVoiceLight. */
  var layer, cv, cx, sky, shade, door, desk, live, srBtn, dpr = 1, MET = {}, raf = 0, last = 0;
  var band = { top: -1, w: 0, h: 0, sh: 0 }, COST = { n: 0, ms: 0, max: 0 };
  var E = { T: 0, ph: null, old: null, N: 0, oldN: 0, cap: 0, skyA: 0, leftAt: null, fastSky: false, dragY: 0, dragA: 1, back: 0, mid: [], near: [], lingers: [], spr: {}, count: 0, peak: 0, phase: "rest" };
  function met() {
    var k = px(); if (MET[k]) return MET[k];
    var c = doc.createElement("canvas").getContext("2d"); c.font = fcss();
    var m = c.measureText("Ау");
    return (MET[k] = { asc: m.fontBoundingBoxAscent || k * 0.95, desc: m.fontBoundingBoxDescent || k * 0.3 });
  }
  function ensure(n) {
    if (n <= E.cap) return; E.cap = n;
    ["TX", "TY"].forEach(function (k) { E[k] = new Int32Array(n); });
    ["SX", "SY", "CX", "CY", "DL", "DU", "PW"].forEach(function (k) { E[k] = new Float32Array(n); });
    ["AA", "CI", "WK", "KIND"].forEach(function (k) { E[k] = new Uint8Array(n); });
  }
  /* звезда — круглое гауссово пятно: радиус не меньше 1,6 px холста, без резкого центра,
     в дробных координатах (ОТКАТ: прежние звёзды-спрайты с острым центром на целых точках
     на плотности 2.625 и 3 давали «плюсы»-лучи — снимок zvezdy-x8 основателю) */
  function sprite(col, R, soft) {
    var rd = Math.max(1.6 * 2.2, R * dpr), key = col.join(",") + "|" + rd.toFixed(2) + "|" + (soft ? 1 : 0);
    if (E.spr[key]) return E.spr[key];
    var s = Math.ceil(rd * 2) + 4, c = mk(s, s), g = c.getContext("2d"), r = s / 2, gr = g.createRadialGradient(r, r, 0, r, r, rd), k = soft ? 3.2 : 4.5;
    for (var i = 0; i <= 10; i++) { var t = i / 10; gr.addColorStop(t, rgba(col, i === 10 ? 0 : Math.exp(-k * t * t))); }
    g.fillStyle = gr; g.fillRect(0, 0, s, s); c.rd = rd;
    return (E.spr[key] = c);
  }
  function skyH() { return Math.round(Math.max(260, Math.min(460, innerHeight * 0.55))); }
  /* полоса холста: от верха строки (с запасом на пыль) или от верха неба — до низа экрана */
  function fitBand(lineTop) {
    var d = Math.min(2, devicePixelRatio || 1), SH = Math.min(innerHeight, skyH());
    var want = Math.max(0, Math.min(innerHeight - SH, Math.floor((lineTop == null ? innerHeight : lineTop) - 110)));
    if (E.ph && band.top >= 0 && band.top < want && band.w === innerWidth && dpr === d) want = band.top;   /* пока фраза стоит — полоса только растёт */
    var W = innerWidth, H = Math.max(1, innerHeight - want);
    if (band.top === want && band.w === W && band.h === H && dpr === d && band.sh === SH) return false;
    var resized = band.w !== W || dpr !== d || band.sh !== SH;
    dpr = d; band.top = want; band.w = W; band.h = H; band.sh = SH;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    cv.style.top = want + "px"; cv.style.width = W + "px"; cv.style.height = H + "px";
    E.DW = cv.width; E.DH = cv.height; E.HW = E.DW >> 1; E.HH = E.DH >> 1;
    E.far = mk(E.HW, E.HH); E.fx = E.far.getContext("2d"); E.fimg = E.fx.createImageData(E.HW, E.HH); E.fID = E.fimg.data; E.fprev = null;
    E.G = 6; E.gl = mk(Math.ceil(E.DW / E.G), Math.ceil(E.DH / E.G)); E.glx = E.gl.getContext("2d");
    if (resized || !E.skyKey) { E.spr = {}; buildSky(); }
    return true;
  }
  /* небо: облако-эллипс у низа; дальний слой — готовая картинка на своём холсте */
  function buildSky() {
    if (!pal) pal = palette();
    var o = pal, w = band.w, SH = band.sh, r = rng(phone() ? 29 : 17), ph = phone(), pad = 16, d = dpr, i;
    E.skyKey = o.key + "|" + w + "|" + SH + "|" + d;
    function inCloud() { for (;;) { var u = r() * 2 - 1, q = r(), X = w / 2 + u * w * 0.48, Y = SH - Math.pow(q, 0.75) * SH * 0.9, dx = (X - w / 2) / (w * 0.48), dy = (SH - Y) / (SH * 0.9); if (dx * dx + dy * dy <= 1) return [X, Y]; } }
    /* туманность: пять мягких пятен (геометрия демо: планшет — коробка 1400×460, телефон — 600×440) */
    var GEO = ph ? [[130, 220, 340, 230], [70, 260, 230, 180], [300, 230, 250, 210], [200, 270, 200, 80], [170, 150, 260, 150]]
      : [[330, 290, 760, 250], [170, 300, 540, 220], [760, 260, 540, 250], [520, 330, 380, 110], [400, 170, 520, 230]];
    var BW = ph ? 600 : Math.min(1400, w * 0.81 + 120), BH = ph ? 440 : 460, kx = ph ? 1 : BW / 1400, ky = SH / BH, bx = (w - BW) / 2 + (ph ? 0 : 50 * kx);
    var fs = sky; fs.width = Math.round((w + pad * 2) * d); fs.height = Math.round((SH + pad * 2) * d);
    fs.style.width = (w + pad * 2) + "px"; fs.style.height = (SH + pad * 2) + "px"; fs.style.left = -pad + "px"; fs.style.top = (innerHeight - SH - pad) + "px";
    var fx = fs.getContext("2d"); fx.setTransform(1, 0, 0, 1, 0, 0); fx.clearRect(0, 0, fs.width, fs.height); fx.setTransform(d, 0, 0, d, 0, 0);
    fx.save(); fx.globalCompositeOperation = o.light ? "source-over" : "screen";
    GEO.forEach(function (g, k) {
      var nb = o.neb[k], c = nb[0], a = Math.min(1, nb[1] * 1.35 * o.nebA), cxx = bx + (g[0] + g[2] / 2) * kx + pad, cyy = (g[1] + g[3] / 2) * ky + pad;
      fx.save(); fx.translate(cxx, cyy); fx.scale(g[2] * kx / 2, g[3] * ky / 2);
      var gr = fx.createRadialGradient(0, 0, 0, 0, 0, 1);
      gr.addColorStop(0, rgba(c, a)); gr.addColorStop(0.35, rgba(c, a * 0.72)); gr.addColorStop(0.7, rgba(c, a * 0.25)); gr.addColorStop(1, rgba(c, 0));
      fx.fillStyle = gr; fx.beginPath(); fx.arc(0, 0, 1, 0, TAU); fx.fill(); fx.restore();
    });
    fx.restore();
    var sk = o.starK, nf = Math.round((ph ? 48 : 110) * sk); fx.setTransform(1, 0, 0, 1, 0, 0);
    for (i = 0; i < nf; i++) {
      var p = inCloud(), a2 = 0.16 + Math.pow(r(), 2) * 0.4, s = 0.35 + r() * 0.5, col = o.stars[(r() * o.stars.length) | 0], sp = sprite(col, s * 2.6), ae = a2 * Math.min(1.6, (s * d * 2.4) / sp.rd * 1.9);
      if (ae < 0.06) continue;
      fx.globalAlpha = Math.min(1, ae); fx.drawImage(sp, (p[0] + pad) * d - sp.width / 2, (p[1] + pad) * d - sp.height / 2);
    }
    fx.globalAlpha = 1;
    /* средние звёзды дрейфуют заметно (3–7 px/с), крупные — маленькое ядро и тонкий ореол */
    E.mid = []; var nm = Math.round((ph ? 20 : 42) * sk);
    for (i = 0; i < nm; i++) { var p2 = inCloud(), b = Math.pow(r(), 1.8); E.mid.push({ x: p2[0], y: p2[1], ox: 0, oy: 0, a: 0.3 + b * 0.55, R: 0.55 + b * 0.8, col: o.stars[(r() * o.stars.length) | 0], per: 10 + r() * 16, ph: r() * TAU, th: r() * TAU, sp: 3.2 + r() * 3.6, rr: 22 + r() * 26, big: false }); }
    var nbg = Math.max(1, Math.round((ph ? 3 : 5) * Math.min(1, sk)));
    for (i = 0; i < nbg; i++) { var p3 = inCloud(); E.mid.push({ x: p3[0], y: p3[1], ox: 0, oy: 0, a: 0.55 + r() * 0.25, R: 1.5 + r() * 0.5, col: o.stars[0], per: 14 + r() * 10, ph: r() * TAU, th: r() * TAU, sp: 0.5 + r() * 0.8, rr: 8 + r() * 10, big: true }); }
    E.mid.forEach(function (m) { if (m.big) { m.hs = sprite(m.col, m.R * 1.7, true); m.cs = sprite(m.col, 0.1); } else m.s = sprite(m.col, m.R * 2.2); });
    E.near = []; var nn = ph ? 4 : 7;
    for (i = 0; i < nn; i++) { var p4 = inCloud(); E.near.push({ x: p4[0], y: p4[1], vx: (r() - 0.5) * 6, vy: -(4 + r() * 5), a: 0.05 + r() * 0.07, R: 3 + r() * 5, col: o.dust[(r() * o.dust.length) | 0], ph: r() * TAU }); }
    E.near.forEach(function (n) { n.s = sprite(n.col, n.R); });
  }
  function repaint() {   /* тема или время суток сменились — новые цвета неба и пыли */
    var P = palette(); if (pal && P.key === pal.key) return; pal = P; E.spr = {};
    if (band.w) buildSky();
    if (E.ph) { E.dcol = (E.ph.o.dust || pal.dust).concat([pal.name]); cacheText(E.ph, E.ph.cacheW || wF(), true); }
  }

  /* ── разметка фразы — у носителя ──────────────────────────────────── */
  var VOW = "аеёиоуыэюяАЕЁИОУЫЭЮЯaeiouyAEIOUYõäöüÕÄÖÜ";
  var SYL = new RegExp("[^" + VOW + "]*[" + VOW + "]+(?:[^" + VOW + "]+$)?|[^" + VOW + "]+$", "g");
  /* G — знаки носителя (measure): слоги внутри слова — по гласным; слово-кнопка делится так же */
  function units(G, syll) {
    var U = [], wi = -1, lastI = -2, word = [], k = 0;
    function flush() {
      if (!word.length) return;
      var s = word.map(function (g) { return g.ch; }).join(""), parts = syll ? (s.match(SYL) || [s]) : [s], at = 0;
      parts.forEach(function (pt) {
        var mem = word.slice(at, at + pt.length); at += pt.length; if (!mem.length) return;
        var x0 = 1e9, x1 = -1e9; mem.forEach(function (g) { g.u = k; x0 = Math.min(x0, g.x); x1 = Math.max(x1, g.x + g.w); });
        U.push({ k: k++, x0: x0, x1: x1, y: mem[0].y, wd: wi });
      });
      word = [];
    }
    G.forEach(function (g) { if (g.i !== lastI + 1 || (word.length && Math.abs(g.y - word[0].y) > 2)) { flush(); wi++; } word.push(g); lastI = g.i; });
    flush();
    return U;
  }
  function paintText(g, LA, wt, ox, oy, col) {
    g.font = fcss(LA.fs, wt); g.textAlign = "left"; g.textBaseline = "alphabetic";
    for (var i = 0; i < LA.G.length; i++) { var c = LA.G[i]; if (col) g.fillStyle = c.nm ? rgba(col[1], 1) : rgba(col[0], 1); g.fillText(c.ch, c.x - ox, c.y - oy); }
  }
  /* кэш текста: чёткий слой (в весе wt) и слой свечения (один раз, в итоговом весе) */
  function cacheText(P, wt, glowToo) {
    var R = P.rect, d = dpr, c = P.crisp || (P.crisp = mk(R.w, R.h)), g = c.getContext("2d");
    g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, R.w, R.h); g.setTransform(d, 0, 0, d, 0, 0);
    paintText(g, P.LA, wt, R.x / d, R.y / d + band.top, [pal.text, pal.name]);
    if (glowToo || !P.glow) {
      var c2 = P.glow || (P.glow = mk(R.w, R.h)), g2 = c2.getContext("2d");
      g2.setTransform(1, 0, 0, 1, 0, 0); g2.clearRect(0, 0, R.w, R.h); g2.setTransform(d, 0, 0, d, 0, 0);
      g2.shadowColor = rgba(P.o.glow[0], P.o.glow[1]); g2.shadowBlur = P.o.glowBlur * d; g2.shadowOffsetX = 10000 * d; g2.fillStyle = "#000";
      paintText(g2, P.LA, wF(), R.x / d + 10000, R.y / d + band.top);
    }
    P.cacheW = wt;
  }

  /* ── ПОЧЕРК «ЖИВОЙ» · D-823 ──────────────────────────────────────────
     Почерк зависит от смысла: срочное (будильник, ошибка, опасное) — тоже пылью,
     но сборка ≤ 0,35 с; короткое (до 20 знаков) — быстро и почти без пыли;
     подтверждение — пыль снизу, её меньше; важное (пришедшее само) — вихрем,
     полной сборкой; приветствие — по слогам, богаче; вопрос — от центра,
     медленнее. Повтор той же фразы за две минуты — тише. */
  var HIST = {};
  function greet(s) { return /(^|[.!] )(Рада|Рад|Рады),|(^|[.!] )(Glad|Rõõm)/.test(s) || /^(Доброе|Добрый|Доброй|Привет|Здравствуй|Рада|Рад |С возвращением|Good (morning|evening|afternoon)|Hello|Hi[ ,!]|Welcome|Tere|Head(a|t) )/i.test(s); }
  function kindOf(p) {
    var c = p.el.classList, k0 = keyOf(p.title0);
    if (p.urgent || c.contains("toast-warn") || c.contains("toast-ask-danger") || (k0 && /^alarm\./.test(k0.k))) return "urgent";
    if (p.ask || (p.acts.length && p.ttl === Infinity && !p.sticky)) return "ask";
    if (p.warm || greet(p.plain)) return "warm";
    if (p.kind === "event" && !p.user && p.plain.length > 20) return "important";
    if (p.plain.length <= 20) return "short";
    if (p.kind === "confirm" || p.user) return "confirm";
    return "plain";
  }
  function hand(p) {
    var ph = phone(), k = kindOf(p), o = ph
      ? { maxP: 9000, spread: 135, D0: 0.72, D1: 0.4, ws: 0.085, settle: 1.5, linger: 6, bloom: 0.42, glowBlur: 9, lead: 0.1 }
      : { maxP: 15000, spread: 165, D0: 0.75, D1: 0.45, ws: 0.085, settle: 1.5, linger: 10, bloom: 0.42, glowBlur: 10, lead: 0.1 };
    var D00 = o.D0 / 0.62;
    o.kind = k; o.chor = "syll"; o.syll = true; o.dust = pal.dust; o.glow = pal.glow; o.maxP = Math.round(o.maxP * pal.dens);
    o.sky = 1; o.rise = 0.6;
    if (k === "urgent") { o.urgent = true; o.chor = "center"; o.syll = false; o.D0 = 0.2; o.D1 = 0; o.ws = 0.012; o.spread = 16; o.maxP = Math.round(o.maxP * 0.6); o.lead = 0.02; o.sky = 0.55; o.rise = 0.25; o.linger = 0; }
    else if (k === "short") { o.D0 *= 0.6; o.maxP = Math.round(o.maxP * 0.3); o.spread *= 0.45; o.bloom *= 0.7; o.sky = 0.45; o.rise = 0.4; }
    else if (k === "confirm") { o.chor = "rise"; o.syll = false; o.D0 = D00 * 0.8; o.maxP = Math.round(o.maxP * 0.6); o.spread *= 0.8; }
    else if (k === "important") { o.chor = "vortex"; o.syll = false; o.D0 = D00 * 1.1; o.spread *= 1.25; o.bloom *= 1.15; }
    else if (k === "warm") { o.D0 *= 1.1; o.spread *= 1.1; o.maxP = Math.round(o.maxP * 1.1); }
    else if (k === "ask") { o.chor = "center"; o.syll = false; o.D0 = D00 * 1.15; o.spread *= 0.7; }
    var now = performance.now(), seen = HIST[p.plain];
    if (seen != null && now - seen < 120000) { o.maxP = Math.round(o.maxP * 0.45); o.spread *= 0.7; o.bloom *= 0.7; o.again = true; }
    HIST[p.plain] = now;
    if (p.quiet) o.bloom *= 0.62;
    return o;
  }
  /* сколько фраза стоит: 1,5 с заметить + 0,5 с на слово (медленный читатель, ~120 слов
     в минуту), не меньше 4 и не больше 14 с, отсчёт — от сборки; важное ×1,5 (тоже ≤ 14 с);
     вопрос и ждущее ответа — до ответа. Срок, названный самим говорящим (say opt.hold), — его. */
  function wordsIn(s) { return s.split(/\s+/).filter(function (w) { return /[0-9a-zа-яёõäöüšž]/i.test(w); }).length; }
  function holdFor(p) {
    if (p.ttl === Infinity || p.sticky || p.ask) return Infinity;
    if (p.holdOwn) return p.holdOwn;
    var h = Math.min(14, Math.max(4, 1.5 + 0.5 * wordsIn(p.plain)));
    if (p.hand && p.hand.kind === "important") h = Math.min(14, h * 1.5);
    return h * 1000;
  }

  /* ── новая фраза: растр, пылинки, хореография ─────────────────────── */
  function startView(p, G, o, mode) {
    var d = dpr, DW = E.DW, DH = E.DH, seed = ((Date.now() % 100000) + 1) * 7919 + E.count * 104729; E.count++;
    var r = rng(seed), rm = still(), fs = px(), M = met();
    if (E.ph && mode !== "keep") dissolve(E.ph, false);
    var U = units(G, o.syll), NU = U.length || 1, LA = { G: G, U: U, fs: fs };
    var minx = 1e9, maxx = -1e9, top = 1e9, bot = -1e9;
    G.forEach(function (g) { minx = Math.min(minx, g.x); maxx = Math.max(maxx, g.x + g.w); top = Math.min(top, g.y - M.asc); bot = Math.max(bot, g.y + M.desc); });
    if (!G.length) { minx = 0; maxx = 1; top = innerHeight - 40; bot = innerHeight - 20; }
    var rect = { x: Math.max(0, Math.floor((minx - fs * 0.6 - 16) * d)), y: Math.max(0, Math.floor((top - band.top - 16) * d)) };
    rect.w = Math.max(1, Math.min(DW, Math.ceil((maxx + fs * 0.6 + 16) * d)) - rect.x); rect.h = Math.max(1, Math.min(DH, Math.ceil((bot - band.top + 16) * d)) - rect.y);
    var instant = mode === "instant", quick = mode === "quick";
    var P = { o: o, LA: LA, rect: rect, seed: seed, born: E.T, rm: rm, nw: NU, slot: new Float32Array(NU), lingerN: 0 };
    P.t0 = E.T + (E.old && !o.urgent && !instant ? 0.32 : 0) - (o.urgent ? 0.08 : 0);
    E.dcol = o.dust.concat([pal.name]);
    var rich = cl((p.plain.length - 14) / 26);
    if (instant || rm) {
      /* сразу на месте, или «меньше движения»: без пыли, тихое проявление по слогам ~0,6 с */
      var stg = rm && !instant ? Math.min(0.04, 0.25 / NU) : 0;
      for (var q = 0; q < NU; q++) P.slot[q] = q;
      P.wstep = stg; P.D = instant ? 0 : 0.35; P.lead = 0; P.t0 = E.T;
      P.tEnd = E.T + (instant ? 0 : (NU - 1) * stg + 0.35); P.final = true; P.quietIn = rm && !instant;
      P.n0 = P.n1 = E.N; cacheText(P, wF(), true);
      return P;
    }
    /* растр в прямоугольнике фразы — в весе сборки */
    var rc = mk(rect.w, rect.h), rx = rc.getContext("2d", { willReadFrequently: true }); rx.setTransform(d, 0, 0, d, 0, 0); rx.fillStyle = "#fff";
    paintText(rx, LA, wA(), rect.x / d, rect.y / d + band.top);
    var data = rx.getImageData(0, 0, rect.w, rect.h).data, cnt = 0, i;
    for (i = 3; i < data.length; i += 4) if (data[i] > 12) cnt++;
    var MAX = o.maxP, keep = cnt > MAX ? MAX / cnt : 1; ensure(Math.ceil(Math.min(cnt, MAX) * 1.05) + (E.oldN || 0) + 64);
    var style = r(), dir = r() < 0.5 ? -1 : 1, swirl = (r() < 0.5 ? -1 : 1) * (0.25 + r() * 0.35), spread = (o.spread * (0.75 + 0.5 * rich)) * (0.85 + r() * 0.3), pw = 2.3 + r() * 0.7;
    var D = (o.D0 + o.D1 * rich + (o.urgent ? 0 : (r() - 0.5) * 0.12)) * (quick ? 0.6 : 1), wstep = o.ws * (0.85 + r() * 0.3);
    var pcx = innerWidth / 2, pcy = 0, maxd = 1;
    U.forEach(function (u) { u.cx = (u.x0 + u.x1) / 2; u.cy = u.y - band.top; pcy += u.cy; maxd = Math.max(maxd, Math.abs(u.cx - pcx)); });
    pcy = pcy / NU - fs * 0.35;
    var slot = P.slot, UCX = new Float32Array(NU), UCY = new Float32Array(NU), maxSlot = 0;
    U.forEach(function (u) { slot[u.k] = o.chor === "center" ? Math.abs(u.cx - pcx) / maxd * (NU - 1) * 0.55 : o.chor === "vortex" ? u.k * 0.55 : o.chor === "syll" ? u.k * 1.45 : u.k; UCX[u.k] = u.cx * d; UCY[u.k] = (u.cy - fs * 0.4) * d; });
    for (i = 0; i < NU; i++) maxSlot = Math.max(maxSlot, slot[i]);
    if (o.urgent && maxSlot > 0) wstep = Math.min(wstep, 0.03 / maxSlot);   /* срочное собрано не позже 0,35 с */
    /* полосы слогов (в пикселях прямоугольника), сетка поиска — по столбцам */
    var bands = U.map(function (u) { return { x0: (u.x0 - 2) * d - rect.x, x1: (u.x1 + 2) * d - rect.x, y0: (u.y - band.top - fs * 1.15) * d - rect.y, y1: (u.y - band.top + fs * 0.45) * d - rect.y, k: u.k }; });
    var col = new Int16Array(rect.w).fill(-1);
    bands.forEach(function (B) { for (var xx = Math.max(0, B.x0 | 0); xx <= Math.min(rect.w - 1, B.x1 | 0); xx++) if (col[xx] < 0) col[xx] = B.k; });
    var nmU = {}; G.forEach(function (g) { if (g.nm) nmU[g.u] = 1; });
    var PCX = pcx * d, PCY = pcy * d, base = E.oldN || 0, n = base, acc = 0, NAMEC = o.dust.length, lead = o.lead;
    for (var py = 0; py < rect.h; py++) for (var pxx = 0; pxx < rect.w; pxx++) {
      var a = data[(py * rect.w + pxx) * 4 + 3]; if (a <= 12) continue; acc += keep; if (acc < 1) continue; acc -= 1;
      var k = col[pxx]; if (k < 0 || bands.length > 1) { k = Math.max(0, k); for (var b = 0; b < bands.length; b++) { var B = bands[b]; if (pxx >= B.x0 && pxx <= B.x1 && py >= B.y0 && py <= B.y1) { k = B.k; break; } } }
      var X = pxx + rect.x, Y = py + rect.y, rad = (0.2 + Math.pow(r(), 0.85) * 0.8) * spread * d, sx, sy, cxx, cyy;
      if (o.chor === "center") { sx = PCX + (r() - 0.5) * 36 * d; sy = PCY + (r() - 0.5) * 14 * d; cxx = (sx + X) / 2 + (r() - 0.5) * rad * 0.35; cyy = (sy + Y) / 2 - rad * (0.15 + r() * 0.35); }
      else if (o.chor === "vortex") { var a0 = r() * TAU, R0 = (0.55 + 0.45 * r()) * spread * 1.35 * d, a1 = a0 + dir * (1.6 + r() * 0.6); sx = PCX + Math.cos(a0) * R0 * 1.5; sy = PCY + Math.sin(a0) * R0 * 0.42; cxx = PCX + Math.cos(a1) * R0 * 1.05; cyy = PCY + Math.sin(a1) * R0 * 0.32; }
      else if (o.chor === "syll") { var ang = r() * TAU, rr = (6 + Math.pow(r(), 0.7) * 46) * d; sx = UCX[k] + Math.cos(ang) * rr * 1.3; sy = UCY[k] - 24 * d + Math.sin(ang) * rr * 0.5; cxx = (sx + X) / 2 + (r() - 0.5) * 14 * d; cyy = Math.min(sy, Y) - (6 + r() * 14) * d; }
      else if (o.chor === "rise") { sx = X + (r() - 0.5) * rad * 0.9; sy = DH + (10 + r() * 140) * d; cxx = sx + dir * (0.1 + r() * 0.4) * rad; cyy = (sy + Y) / 2 + (r() - 0.5) * 20 * d; }
      else if (style < 0.4) { var an = r() * TAU; sx = X + Math.cos(an) * rad * 1.55; sy = Y + Math.sin(an) * rad * 0.5 - r() * rad * 0.3; var mx = (sx + X) / 2, my = (sy + Y) / 2, nx = -(Y - sy), ny = (X - sx), nl = Math.sqrt(nx * nx + ny * ny) || 1; cxx = mx + nx / nl * rad * swirl; cyy = my + ny / nl * rad * swirl * 0.5; }
      else { sx = X - dir * (rad * 1.2 + 40 * d) + (r() - 0.5) * 40 * d; sy = Y + (r() - 0.5) * rad * 0.5; cxx = (sx + X) / 2 + (r() - 0.5) * 30 * d; cyy = Math.min(sy, Y) - rad * (0.15 + r() * 0.3); }
      E.TX[n] = X; E.TY[n] = Y; E.SX[n] = sx; E.SY[n] = sy; E.CX[n] = cxx; E.CY[n] = cyy;
      E.DU[n] = D * (o.urgent ? 0.97 + r() * 0.06 : 0.93 + r() * 0.14); E.DL[n] = P.t0 + lead + slot[k] * wstep + (r() - 0.5) * (o.urgent ? 0.01 : 0.06);
      E.AA[n] = Math.min(255, a / Math.max(keep, 0.5)); E.CI[n] = nmU[k] && r() < 0.7 ? NAMEC : (r() * o.dust.length) | 0; E.WK[n] = k; E.KIND[n] = 1; E.PW[n] = pw; n++;
    }
    E.N = n; P.n0 = base; P.n1 = n; P.D = D; P.wstep = wstep; P.lead = lead;
    P.tEnd = P.t0 + lead + maxSlot * wstep + D * (o.urgent ? 1.03 : 1.08);
    if (n - base > E.peak) E.peak = n - base;
    cacheText(P, wA(), true);
    P.lingerN = Math.round(o.linger * rich);
    return P;
  }
  /* исчезновение: пыль срывается с букв; вверх — обратно в облако, вниз — за край (смахнули) */
  function dissolve(P, down) {
    var o = P.o, d = dpr, r = rng(P.seed ^ 0x5bd1), R = P.rect, oy = (E.dragY || 0) * d;
    if (!P.rm && !still()) {
      var rc = mk(R.w, R.h), rx = rc.getContext("2d", { willReadFrequently: true }); rx.setTransform(d, 0, 0, d, 0, 0); rx.fillStyle = "#fff";
      paintText(rx, P.LA, P.cacheW || wF(), R.x / d, R.y / d + band.top);
      var data = rx.getImageData(0, 0, R.w, R.h).data, n = 0, stride = 2, T0 = E.T, NC = o.dust.length;
      ensure(Math.ceil(R.w * R.h / (stride * stride) / 3) + 64);
      for (var py = 0; py < R.h; py += stride) for (var pxx = (py / stride % 2) | 0; pxx < R.w; pxx += stride) {
        var a = data[(py * R.w + pxx) * 4 + 3]; if (a <= 40) continue;
        var X = pxx + R.x, Y = py + R.y + oy, an = down ? Math.PI / 2 + (r() - 0.5) * 1.1 : -Math.PI / 2 + (r() - 0.5) * 2.6, dist = (down ? 140 + r() * 240 : 60 + r() * 200) * d;
        E.TX[n] = X; E.TY[n] = Y; E.SX[n] = X + Math.cos(an) * dist * 1.4; E.SY[n] = Y + Math.sin(an) * dist * 0.6; E.CX[n] = X + (r() - 0.5) * 40 * d; E.CY[n] = Y - (10 + r() * 40) * d;
        E.DL[n] = down ? T0 + r() * 0.08 : T0 + 0.05 + (X / E.DW) * 0.2 + r() * 0.12; E.DU[n] = down ? 0.55 + r() * 0.35 : o.urgent ? 0.6 + r() * 0.3 : 1.2 + r() * 0.6;
        E.AA[n] = a; E.CI[n] = (r() * NC) | 0; E.KIND[n] = 2; n++;
      }
      E.oldN = n; E.N = n;
    } else { E.N = 0; E.oldN = 0; }
    E.old = { P: P, t0: E.T, fd: still() || P.rm ? 0.4 : down ? 0.16 : o.urgent ? 0.14 : 0.45, oy: oy, da: E.dragA };
  }
  function leave(down) {
    if (!E.ph) return;
    dissolve(E.ph, down); E.ph = null; E.lingers = []; E.leftAt = E.T; E.fastSky = !!down; E.dragY = 0; E.dragA = 1; E.back = 0;
    E.phase = "leave"; kick();
  }

  /* ── кадр ─────────────────────────────────────────────────────────── */
  function frame(now) {
    raf = 0; if (!cx) return;
    var dt = last ? Math.min(0.05, Math.max(0, (now - last) / 1000)) : 1 / 60; last = now;
    var t0 = performance.now();
    var busy = step(dt); draw();
    var ms = performance.now() - t0; COST.n++; COST.ms += ms; if (ms > COST.max) COST.max = ms;
    if (busy) kick(); else { last = 0; E.phase = "rest"; }
  }
  function kick() { if (!raf && cx) raf = requestAnimationFrame(frame); }
  function step(dt) {
    var T = (E.T += dt), ph = E.ph, rm = still();
    /* небо поднимается с фразой (≈0,6 с; у короткой и срочной — едва), уходит вместе с ней:
       пыль сперва уходит в облако, потом облако растворяется (≈1,2 с; смахнули — ≈0,5 с) */
    var tgt = ph && !rm ? ph.o.sky * (ph.overK || 1) : 0, a = E.skyA;
    if (!ph && E.leftAt != null && T - E.leftAt < (E.fastSky ? 0.1 : 0.45)) tgt = a;
    if (a < tgt) a = Math.min(tgt, a + dt / (ph ? ph.o.rise : 0.6) * (ph ? ph.o.sky : 1)); else if (a > tgt) a = Math.max(tgt, a - dt / (E.fastSky ? 0.5 : 1.2));
    E.skyA = a;
    if (ph) {
      if (!ph.readyAt && T >= ph.tEnd) { ph.readyAt = T; if (ph.onReady) { var f = ph.onReady; ph.onReady = null; f(); } }
      if (!ph.final && T > ph.tEnd) {   /* вес и разрядка «наливаются» после сборки */
        var q = smr((T - ph.tEnd) / ph.o.settle), wt = wA() + (wF() - wA()) * q;
        if (q >= 1) { cacheText(ph, wF(), false); ph.final = true; } else if (Math.abs(wt - ph.cacheW) >= 8) cacheText(ph, wt, false);
      }
      if (ph.lingerN && T > ph.tEnd && !ph.lingered) {
        ph.lingered = true; var r = rng(ph.seed ^ 99), G = ph.LA.G;
        for (var i = 0; i < ph.lingerN; i++) { var g = G[(r() * G.length) | 0]; E.lingers.push({ x: g.x, y: g.y - band.top - r() * ph.LA.fs * 0.8, vx: (r() - 0.5) * 4, vy: -(2 + r() * 5), t0: T + r() * 1.5, life: 3 + r() * 3, s: sprite(ph.o.dust[(r() * ph.o.dust.length) | 0], 1.1) }); }
      }
    }
    if (E.back) {   /* отпустили до порога — фраза мягко возвращается на место */
      E.dragY *= Math.pow(0.0005, dt); E.dragA = 1 - (1 - E.dragA) * Math.pow(0.0005, dt);
      if (E.dragY < 0.1) { E.dragY = 0; E.dragA = 1; E.back = 0; }
      dragCarrier();
    }
    var vis = a > 0.002 && !rm;
    if (vis) {
      var bx0 = ph ? ph.rect.x / dpr - 10 : 0, bx1 = ph ? (ph.rect.x + ph.rect.w) / dpr + 10 : 0, by0 = ph ? ph.rect.y / dpr - 10 - E.skyOff() : 0, by1 = ph ? (ph.rect.y + ph.rect.h) / dpr + 10 - E.skyOff() : 0, cv0 = ph ? sm((T - ph.t0) / 1.2) : 0;
      E.mid.forEach(function (s) {
        var X = s.x + s.ox, Y = s.y + s.oy, dx = X < bx0 ? bx0 - X : X > bx1 ? X - bx1 : 0, dy = Y < by0 ? by0 - Y : Y > by1 ? Y - by1 : 0, dd = Math.sqrt(dx * dx + dy * dy), calm = cv0 * (1 - sm((dd - 6) / 70)), k = 1 - 0.95 * calm, th = s.th + Math.sin(T * 0.11 + s.ph) * 2.4;
        s.ox += Math.cos(th) * s.sp * k * dt; s.oy += Math.sin(th) * s.sp * 0.6 * k * dt; var m = Math.sqrt(s.ox * s.ox + s.oy * s.oy); if (m > s.rr) { s.ox *= s.rr / m; s.oy *= s.rr / m; }
        s.inside = 1 - sm((dd - 1) / 18);
      });
      E.near.forEach(function (p) { p.x += p.vx * dt; p.y += p.vy * dt; p.x += Math.sin(T * 0.3 + p.ph) * 0.6 * dt; if (p.y < band.sh * 0.15) { p.y = band.sh + 10; p.x = band.w * (0.1 + 0.8 * ((Math.sin(p.ph * 13.1 + T) + 1) / 2)); } });
    }
    E.lingers = E.lingers.filter(function (p) { if (T > p.t0) { p.x += p.vx * dt; p.y += p.vy * dt; } return T < p.t0 + p.life; });
    if (E.old && T > E.old.t0 + E.old.fd + 0.05) E.old = null;
    /* шаг неба на своём холсте: плывёт и гаснет стилем */
    if (sky) {
      var fin = sm(a), ddx = Math.sin(T * TAU / 70) * 16 + Math.sin(T * TAU / 47) * 1.1, ddy = Math.cos(T * TAU / 90) * 5 + (1 - a) * 36;
      var op = fin.toFixed(3); if (sky.style.opacity !== op) sky.style.opacity = op;
      sky.style.transform = "translate3d(" + ddx.toFixed(2) + "px," + ddy.toFixed(2) + "px,0)";
    }
    /* фраза стоит — кадры нужны дыханию ореола и звёздам; при «меньше движения» — только до проявления */
    var need = !!ph && (!rm || T < ph.tEnd + 0.05);
    return need || E.N > 0 || a > 0 || !!E.old || E.lingers.length > 0 || !!E.back;
  }
  E.skyOff = function () { return band.h - band.sh; };
  function draw() {
    var x = cx, d = dpr, T = E.T, DW = E.DW, DH = E.DH, o = pal, a = E.skyA, fin = sm(a), P = E.ph, comp = o.comp;
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = "source-over"; x.globalAlpha = 1; x.clearRect(0, 0, DW, DH);
    var q0 = P && P.o.quiet ? 0.62 : 1;
    if (fin > 0.004) {
      var ox = Math.sin(T * TAU / 47) * 5 + Math.sin(T * TAU / 71) * 3, oy = Math.cos(T * TAU / 59) * 2.5, so = E.skyOff();
      x.globalCompositeOperation = comp;
      for (var i = 0; i < E.mid.length; i++) {
        var s = E.mid[i], tw = 0.8 + 0.2 * Math.sin(T * TAU / s.per + s.ph), al = s.a * fin * tw * (1 - 0.9 * (s.inside || 0) * (P ? 1 : 0)); if (al < 0.01) continue;
        var X = (s.x + s.ox + ox * 0.6) * d, Y = (s.y + s.oy + oy * 0.6 + (1 - a) * 22 + so) * d;
        if (s.big) { x.globalAlpha = al * 0.22; x.drawImage(s.hs, X - s.hs.width / 2, Y - s.hs.height / 2); x.globalAlpha = Math.min(1, al * 1.1); x.drawImage(s.cs, X - s.cs.width / 2, Y - s.cs.height / 2); continue; }
        x.globalAlpha = al; x.drawImage(s.s, X - s.s.width / 2, Y - s.s.height / 2);
      }
      E.near.forEach(function (p) { x.globalAlpha = p.a * fin * (0.8 + 0.2 * Math.sin(T * 0.2 + p.ph)); x.drawImage(p.s, (p.x + ox * 1.3) * d - p.s.width / 2, (p.y + oy * 1.3 + (1 - a) * 30 + so) * d - p.s.height / 2); });
      x.globalAlpha = 1; x.globalCompositeOperation = "source-over";
    }
    for (var li = 0; li < E.lingers.length; li++) { var lp = E.lingers[li]; if (T < lp.t0) continue; var u = (T - lp.t0) / lp.life; x.globalAlpha = 0.55 * Math.sin(Math.PI * u) * Math.max(fin, 0.3) * q0; x.drawImage(lp.s, lp.x * d - lp.s.width / 2, lp.y * d - lp.s.height / 2); }
    x.globalAlpha = 1;
    /* уходящий текст тает */
    if (E.old) { var oP = E.old.P, ofa = 1 - sm((T - E.old.t0) / E.old.fd); if (ofa > 0) { x.globalAlpha = ofa * E.old.da * q0; x.drawImage(oP.glow, oP.rect.x, oP.rect.y + E.old.oy); x.globalAlpha = ofa * E.old.da; x.drawImage(oP.crisp, oP.rect.x, oP.rect.y + E.old.oy); x.globalAlpha = 1; } }
    particles(q0);
    if (!P) return;
    var OY = (E.dragY || 0) * d, DA = E.dragA, R = P.rect, LA = P.LA, fs = LA.fs;
    if (T < P.tEnd || P.quietIn && T < P.tEnd + 0.05) {
      /* слог проступает: последние ~15 % пути пыли — уже чёткий текст того же растра */
      for (var k = 0; k < LA.U.length; k++) {
        var U = LA.U[k], uu = P.D ? (T - (P.t0 + P.lead + P.slot[U.k] * P.wstep)) / P.D : 1, aa = P.quietIn ? sm(uu) : sm((uu - 0.86) / 0.16); if (aa <= 0) continue;
        var sx = Math.max(0, Math.round((U.x0 - 3) * d - R.x)), sy = Math.max(0, Math.floor((U.y - band.top - fs * 1.2) * d - R.y)), sw = Math.min(R.w - sx, Math.round((U.x1 + 3) * d - R.x) - sx), sh = Math.min(R.h - sy, Math.ceil(fs * 1.75 * d));
        if (sw <= 0 || sh <= 0) continue;
        x.globalAlpha = aa * 0.9 * DA * q0; x.drawImage(P.glow, sx, sy, sw, sh, R.x + sx, R.y + sy + OY, sw, sh); x.globalAlpha = aa * DA; x.drawImage(P.crisp, sx, sy, sw, sh, R.x + sx, R.y + sy + OY, sw, sh);
      }
      x.globalAlpha = 1;
    } else {
      /* фраза стоит: дышит только ореол (±7 % за 8,5 с), буквы не мигают */
      var br = still() ? 1 : 0.86 + 0.14 * Math.sin((T - P.tEnd) * TAU / 8.5);
      x.globalAlpha = br * DA * q0; x.drawImage(P.glow, R.x, R.y + OY); x.globalAlpha = DA; x.drawImage(P.crisp, R.x, R.y + OY); x.globalAlpha = 1;
    }
  }
  /* пыль: у букв — полная плотность в прямоугольнике фразы, вдали — половинная; свечение — по занятой области */
  function particles(q0) {
    var x = cx, d = dpr, T = E.T, N = E.N || 0; if (!N) return;
    var P = E.ph, R = P ? P.rect : { x: 0, y: 0, w: 1, h: 1 }, NW = R.w, NH = R.h;
    if (!E.nimg || E.nimg.width !== NW || E.nimg.height !== NH) { E.near_c = mk(NW, NH); E.nx = E.near_c.getContext("2d"); E.nimg = E.nx.createImageData(NW, NH); E.nID = E.nimg.data; }
    var nID = E.nID, fID = E.fID, HW = E.HW, HH = E.HH, col = E.dcol, any = false;
    nID.fill(0); if (E.fprev) fID.fill(0, E.fprev.y0 * HW * 4, (E.fprev.y1 + 1) * HW * 4);
    var fb = { x0: 1e9, y0: 1e9, x1: -1, y1: -1 }, XF = null, j, alive = 0;
    if (P) { XF = new Float32Array(P.nw); for (var k = 0; k < P.nw; k++) { var u0 = (T - (P.t0 + P.lead + P.slot[k] * P.wstep)) / P.D; XF[k] = sm((u0 - 0.86) / 0.16); } }
    var OY = (E.dragY || 0) * d;
    for (j = 0; j < N; j++) {
      var kind = E.KIND[j], u = (T - E.DL[j]) / E.DU[j];
      if (kind === 2 && u >= 1) continue; if (kind === 1 && (!XF || (u >= 1 && XF[E.WK[j]] >= 1))) continue; alive++; if (u <= 0) continue; if (u > 1) u = 1;
      var X, Y, al, c = col[E.CI[j]];
      if (kind === 1) { var e = 1 - Math.pow(1 - u, E.PW[j]), q = 1 - e; X = q * q * E.SX[j] + 2 * q * e * E.CX[j] + e * e * E.TX[j]; Y = q * q * E.SY[j] + 2 * q * e * E.CY[j] + e * e * E.TY[j] + OY; al = E.AA[j] * sm(u / 0.22) * (1 - XF[E.WK[j]]) * (0.5 + 0.3 * e); }
      else { var e2 = 1 - (1 - u) * (1 - u) * (1 - u), q2 = 1 - e2; X = q2 * q2 * E.TX[j] + 2 * q2 * e2 * E.CX[j] + e2 * e2 * E.SX[j]; Y = q2 * q2 * E.TY[j] + 2 * q2 * e2 * E.CY[j] + e2 * e2 * E.SY[j]; al = E.AA[j] * sm(u / 0.06) * (1 - sm((u - 0.15) / 0.75)) * 0.75; }
      var xi = X | 0, yi = Y | 0, lx = xi - R.x, ly = yi - R.y;
      if (kind === 1 && P && lx >= 0 && ly >= 0 && lx < NW && ly < NH) { var pi = (ly * NW + lx) * 4; nID[pi] = c[0]; nID[pi + 1] = c[1]; nID[pi + 2] = c[2]; var na = nID[pi + 3] + al; nID[pi + 3] = na > 255 ? 255 : na; any = true; }
      else {
        var hx = xi >> 1, hy = yi >> 1; if (hx < 0 || hy < 0 || hx >= HW || hy >= HH) continue;
        var fi = (hy * HW + hx) * 4; fID[fi] = c[0]; fID[fi + 1] = c[1]; fID[fi + 2] = c[2]; var fa = fID[fi + 3] + al * 0.55; fID[fi + 3] = fa > 255 ? 255 : fa;
        if (hx < fb.x0) fb.x0 = hx; if (hx > fb.x1) fb.x1 = hx; if (hy < fb.y0) fb.y0 = hy; if (hy > fb.y1) fb.y1 = hy;
      }
    }
    if (!alive) { E.N = 0; E.oldN = 0; }
    E.live = alive;
    var G = E.G, gl = E.gl, glx = E.glx, bloom = false; glx.clearRect(0, 0, gl.width, gl.height);
    x.setTransform(1, 0, 0, 1, 0, 0);
    if (fb.x1 >= 0) {
      var fw = fb.x1 - fb.x0 + 1, fh = fb.y1 - fb.y0 + 1; E.fx.clearRect(0, 0, HW, HH); E.fx.putImageData(E.fimg, 0, 0, fb.x0, fb.y0, fw, fh); x.imageSmoothingEnabled = true;
      x.globalAlpha = q0; x.drawImage(E.far, fb.x0, fb.y0, fw, fh, fb.x0 * 2, fb.y0 * 2, fw * 2, fh * 2); x.globalAlpha = 1;
      glx.drawImage(E.far, fb.x0, fb.y0, fw, fh, fb.x0 * 2 / G, fb.y0 * 2 / G, fw * 2 / G, fh * 2 / G); bloom = true; E.fprev = fb;
    } else E.fprev = null;
    if (any) { E.nx.putImageData(E.nimg, 0, 0); x.globalAlpha = E.dragA * q0; x.drawImage(E.near_c, R.x, R.y); x.globalAlpha = 1; glx.drawImage(E.near_c, R.x / G, R.y / G, NW / G, NH / G); bloom = true; }
    if (bloom) {
      var ux0 = any ? R.x : 1e9, uy0 = any ? R.y : 1e9, ux1 = any ? R.x + NW : 0, uy1 = any ? R.y + NH : 0;
      if (fb.x1 >= 0) { ux0 = Math.min(ux0, fb.x0 * 2); uy0 = Math.min(uy0, fb.y0 * 2); ux1 = Math.max(ux1, fb.x1 * 2 + 2); uy1 = Math.max(uy1, fb.y1 * 2 + 2); }
      var gx = Math.max(0, Math.floor(ux0 / G) - 3), gy = Math.max(0, Math.floor(uy0 / G) - 3), gw = Math.min(gl.width - gx, Math.ceil((ux1 - ux0) / G) + 7), gh = Math.min(gl.height - gy, Math.ceil((uy1 - uy0) / G) + 7);
      if (gw > 0 && gh > 0) { x.globalCompositeOperation = pal.comp; x.globalAlpha = (P ? P.o.bloom : 0.42) * q0 * (pal.light ? 0.6 : 1); x.drawImage(gl, gx, gy, gw, gh, gx * G, gy * G, gw * G, gh * G); x.globalAlpha = 1; x.globalCompositeOperation = "source-over"; }
    }
  }

  /* ── фраза ───────────────────────────────────────────────────────── */
  var cur = null, queue = [], seq = 0;
  function txt(n) { return n ? (n.textContent || "").trim() : ""; }
  /* текст фразы по извещению: заголовок, коротко — подробность, и слова-кнопки */
  function compose(p) {
    var a = addr(), title = retr(p.title0) || "", text = retr(p.text0) || "", s = title;
    if (p.undo) return title.replace(/[.!]$/, "") + " — [" + tr("voice.undo") + "]?";
    var showText = text && text !== title && !(a.pub && p.kind === "event") && (title + text).length <= 92;
    if (showText) s = title + (/[.?!…:]$/.test(title) ? " " : ". ") + text;
    if (p.acts.length) {
      var w = p.acts.map(function (b) { return "[" + retr(b._vLabel0) + "]"; });
      var tail = w.length === 1 ? w[0] : w.slice(0, -1).join(", ") + tr("voice.or") + w[w.length - 1];
      s = s.replace(/[.]$/, "") + " — " + tail + (/\?/.test(s) ? "" : "?");
    }
    return s;
  }
  /* у самого .toast — те же слова, что сказаны: комнаты и законы читают их отсюда */
  function syncCarrier(p) {
    if (p.api) return;
    var t = p.el, T = t.querySelector(".toast-title"), X = t.querySelector(".toast-text"), nt = retr(p.title0), nx = retr(p.text0);
    if (p.tpl) return;
    if (T && nt != null) T.textContent = nt;
    if (X && nx != null) X.textContent = nx;
    t.setAttribute("data-title", nt || ""); t.setAttribute("data-text", nx || "");
  }
  function build(t, ttl) {
    var p = { id: ++seq, el: t, ttl: ttl, kind: t.getAttribute("data-kind") || "confirm",
      title0: t.getAttribute("data-title") || "", text0: t.getAttribute("data-text") || "",
      ask: t.classList.contains("toast-ask"), undo: t.classList.contains("toast-undo"),
      standing: ttl === Infinity, warm: t.hasAttribute("data-voice-warm"),
      acts: Array.prototype.slice.call(t.querySelectorAll("button.toast-action")),
      field: t.querySelector(".toast-field"), tpl: null, src: "" };
    p.sticky = t.classList.contains("toast-warn") || t.hasAttribute("data-voice-sticky");
    p.user = p.ask || p.kind === "confirm";   /* ответ на нажатие самого человека */
    p.acts.forEach(function (b) { b._vLabel0 = txt(b); });
    t.classList.add("sb-voice");
    t._vp = p;
    return p;
  }
  /* разметка строки: прозрачные буквы того же шрифта — места, перенос и кернинг считает браузер */
  function render(p) {
    var t = p.el, line = t.querySelector(".sb-vl");
    var s = p.tpl ? p.tpl() : compose(p);
    p.text = s; p.plain = s.replace(/[\[\]]/g, "");
    if (!line) { line = el("p", "sb-vl"); t.appendChild(line); }
    p.acts.forEach(function (b) { if (b.parentNode) b.parentNode.removeChild(b); });
    if (p.field && p.field.parentNode) p.field.parentNode.removeChild(p.field);
    line.innerHTML = "";
    line.style.fontSize = px() + "px";
    var chars = [], parts = s.split(/(\[[^\]]+\])/), bi = 0;
    function word(host, w, isB) {
      w.split(/( )/).forEach(function (piece) {
        if (!piece) return;
        var wb = el("span", piece === " " ? "sb-sp" : "sb-w");
        if (!isB) wb.setAttribute("aria-hidden", "true");
        for (var i = 0; i < piece.length; i++) { var c = el("span", "sb-c"); c.textContent = piece[i]; c._b = isB; wb.appendChild(c); chars.push(c); }
        host.appendChild(wb);
      });
    }
    parts.forEach(function (part) {
      if (!part) return;
      if (part[0] === "[" && part[part.length - 1] === "]") {
        var label = part.slice(1, -1), b = p.acts[bi++];
        if (!b) { word(line, label, false); return; }
        if (p.field && bi === 1) { line.appendChild(p.field); line.appendChild(doc.createTextNode(" ")); }
        b.textContent = ""; b.setAttribute("aria-label", label); b.classList.add("sb-vb"); b.type = "button";
        word(b, label, true); line.appendChild(b);
      } else word(line, part, false);
    });
    if (p.field && !p.field.parentNode) line.appendChild(p.field);
    p.words = p.acts.slice(0, bi).map(function (b) { return b.getAttribute("aria-label"); });
    if (p.ask) t.setAttribute("aria-label", p.plain);
    p.chars = chars;
    return chars;
  }
  function measure(p) {
    var M = met(), lr = p.el.querySelector(".sb-vl").getBoundingClientRect(), G = [];
    p.top = lr.top; p.lineRect = lr;
    /* имя человека в фразе — акцентом (не «на людях») */
    var nm = "", at = -1, A = window.sbAddr;
    try { if (A && typeof A.name === "function" && !addr().pub) nm = String(A.name() || "").trim(); } catch (e) { nm = ""; }
    if (nm.length > 1) { var lo = p.plain.toLowerCase(), nl = nm.toLowerCase(), i0 = lo.indexOf(nl); while (i0 >= 0) { var bef = lo.charAt(i0 - 1), aft = lo.charAt(i0 + nl.length); if (!/[\wа-яё]/i.test(bef) && !/[a-zа-яё]/i.test(aft)) { at = i0; break; } i0 = lo.indexOf(nl, i0 + 1); } }
    p.chars.forEach(function (c, i) {
      var ch = c.textContent; if (ch === " ") return;
      var r = c.getBoundingClientRect();
      G.push({ ch: ch, i: i, btn: !!c._b, nm: at >= 0 && i >= at && i < at + nm.length, x: r.left, w: r.width, y: r.top + M.asc * r.height / (M.asc + M.desc) });
    });
    return G;
  }
  /* свечение — по настоящей строке (D-807): ровное поле на всю ширину слов плюс поля;
     тает только поле (--sbv-px/--sbv-py в voice.css), поэтому крайние слова светятся так же, как середина.
     ОТКАТ: круг шириной 1,32 строки — к краям длинной фразы он таял до 8 % (снимок основателя 11.11.2026). */
  var SH_M = 14;   /* ровное поле за краем слов, до начала таяния */
  function placeShade(p) {
    var r = p.lineRect; if (!r) return;
    var cs = getComputedStyle(shade), fx = parseFloat(cs.getPropertyValue("--sbv-px")) || 56, fy = parseFloat(cs.getPropertyValue("--sbv-py")) || 26;
    var px0 = SH_M + fx, py0 = 6 + fy;
    shade.style.left = Math.round(r.left - px0) + "px"; shade.style.width = Math.round(r.width + 2 * px0) + "px";
    shade.style.top = Math.round(r.top - py0) + "px"; shade.style.height = Math.round(r.height + 2 * py0) + "px";
    var ov = overOther(r);
    shade.classList.toggle("deep", ov);
    /* Короткая фраза поверх окна (телефон: окно дошло до самого низа) не отнимает касаний у окна: простые
       слова пропускают касание к кнопке под ними, слова-кнопки и поле — свои (доска H4: weak-word-reach —
       подсказка закрыла «всё равно» в окне замка). Фраза, ждущая ответа, держит касание, как прежде. */
    p.el.classList.toggle("sb-over-window", (ov || overWindow(r)) && !standing(p));
  }
  /* строка задевает открытое окно хоть краем (не только серединой) */
  function overWindow(r) {
    var W = window.openWindows || {};
    for (var id in W) { var w = W[id]; if (!w || w.minimized || !w.el || !w.el.isConnected) continue;
      var q = w.el.getBoundingClientRect();
      if (q.width > 0 && q.height > 0 && q.left < r.right && q.right > r.left && q.top < r.bottom && q.bottom > r.top) return true; }
    return false;
  }
  /* под строкой не стол (окно, лист, что угодно светлое) — сумрак гуще: голос
     обязан быть слышен над чем угодно (D-726), а стекла над живым полем не держим */
  function overOther(r) {
    if (!doc.elementsFromPoint) return false;
    var list = doc.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    for (var i = 0; i < list.length; i++) {
      var e = list[i];
      if (e === shade || e === cv || (layer && layer.contains(e))) continue;
      if (e === root || e === doc.body) return false;
      return !(desk && desk.contains(e));
    }
    return false;
  }

  /* ── ГОЛОС И ПОЛКА НЕ МЕШАЮТ ДРУГ ДРУГУ · D-807 ──────────────────────
     Полка (#dock) внизу живёт только на телефоне и только при открытых окнах (shell.js, D-636).
     Голос стоит на своём полу у самого низа (--voice-floor) — ровно там, где полка. Решение:
       · короткая фраза — полка уступает: мягко опускается за край и гаснет (html.sb-dock-yield),
         а когда фраза растаяла — возвращается сама;
       · касание (или фокус) в зоне полки, пока она уступает, возвращает полку сразу, а короткая
         фраза тает — человек пришёл к полке, а не к словам (сказанное по делу уже в выпуске);
       · фраза, которая ждёт ответа (вопрос, важное, «держать»), полку не прячет: может стоять
         долго, а полка — единственный путь к свёрнутому. Такая фраза встаёт ровно над полкой
         (html.sb-voice-over-dock → линия нижнего ряда --desk-row-b);
       · полка, на которой лежат свёрнутые окна, не уступает и короткой фразе (доска H4, shelfHolds()). */
  function dockEl() { var d = doc.getElementById("dock"); return d && !root.classList.contains("dock-empty") && d.offsetHeight > 0 ? d : null; }
  function standing(p) { return !!p && (p.ttl === Infinity || p.sticky || p.ask); }
  /* Полка со свёрнутыми окнами не уступает голосу ни на миг: на ней путь назад к свёрнутому
     (решение координатора доски H4 п.6 — правка D-807: после «Свернуть всё» на телефоне полка
     пропадала на срок фразы, 4–14 с). Голос тогда встаёт над полкой, как фраза, ждущая ответа. */
  function shelfHolds() {
    var W = window.openWindows || {};
    for (var id in W) { var w = W[id]; if (w && w.minimized && w.el && w.el.isConnected) return true; }
    return false;
  }
  function dockSet(p) {
    var d = dockEl(), on = !!p && !p.gone, hold = standing(p) || shelfHolds();
    root.classList.toggle("sb-voice-over-dock", !!(d && on && hold));
    root.classList.toggle("sb-dock-yield", !!(d && on && !hold));
  }
  /* где полка стоит в покое (сдвиг уступки — только по вертикали, поэтому считаем от её bottom) */
  function dockRest(d) {
    var r = d.getBoundingClientRect(), b = parseFloat(getComputedStyle(d).bottom) || 0, h = d.offsetHeight;
    return { left: r.left, right: r.right, top: innerHeight - b - h, bottom: innerHeight - b };
  }
  function reclaimDock(x, y, tg) {
    if (!root.classList.contains("sb-dock-yield")) return false;
    var d = dockEl(); if (!d) { dockSet(null); return false; }
    if (x != null) {
      var z = dockRest(d), m = 14;
      if (x < z.left - m || x > z.right + m || y < z.top - m) return false;
      /* слово-кнопка и поле — голосу; касание простых слов короткой фразы и так её гасит — полка вернётся тем же жестом */
      if (tg && tg.closest && tg.closest("#toastLayer button, #toastLayer .toast-field")) return false;
    }
    root.classList.remove("sb-dock-yield");
    if (cur && !cur.gone && !standing(cur)) { cur.answered = true; melt(cur, true); }
    return true;
  }
  /* в правом нижнем углу кроме круглой кнопки может стоять своё (в демо — «первое слово»):
     строка, задевшая такой предмет, отступает от него справа — тем же приёмом, что от кнопки */
  var KEEP = { toastLayer: 1, sbVoiceShade: 1, sbVoiceLight: 1, sbVoiceSky: 1, sbVoiceLive: 1, dock: 1, sbFab: 1 };
  function corner() {
    var out = [], kids = doc.body ? doc.body.children : [];
    for (var i = 0; i < kids.length; i++) {
      /* ОТКАТ: не откат на чужое значение — «||» здесь логическое «или»: свои узлы и скрипты в угол не считаются. */
      var e = kids[i]; if (KEEP[e.id] || e.tagName === "SCRIPT") continue;
      var r = e.getBoundingClientRect();
      if (r.width < 4 || r.height < 4 || r.width > 260 || r.left < innerWidth * 0.55 || r.bottom < innerHeight - 180 || r.top > innerHeight) continue;
      var s = getComputedStyle(e); if (s.position !== "fixed" || s.visibility === "hidden" || s.display === "none" || +s.opacity < 0.05) continue;
      out.push(r);
    }
    return out;
  }
  function dodge(p) {
    var t = p.el, line = t.querySelector(".sb-vl"); if (!line) return false;
    var obs = corner(); if (!obs.length) { if (t.style.marginRight) { t.style.marginRight = ""; return true; } return false; }
    var lr = line.getBoundingClientRect(), tr0 = t.getBoundingClientRect(), need = 0;
    obs.forEach(function (q) { if (q.top < lr.bottom + 6 && q.bottom > lr.top - 6 && q.left < tr0.right) need = Math.max(need, tr0.right - (q.left - 10)); });
    if (!need) return false;
    var base = parseFloat(getComputedStyle(t).marginRight) || 0;
    t.style.marginRight = Math.round(base + need) + "px";
    return true;
  }

  /* телефон: открытое окно дошло до линии речи — голос не ложится на окно, он встаёт под него */
  function placeLayer(p) {
    if (!layer) return;
    dockSet(p || cur);
    var lift = "";
    if (innerWidth <= 560 && !root.classList.contains("sb-voice-over-dock")) {
      var W = window.openWindows || {}, low = 0, id;
      for (id in W) { var w = W[id]; if (!w || w.minimized || !w.el || !w.el.isConnected) continue;
        var r = w.el.getBoundingClientRect(); if (r.width > 0 && r.height > 0 && r.bottom > low) low = r.bottom; }
      var keep = layer.style.bottom; layer.style.bottom = "";
      var lineB = innerHeight - (parseFloat(getComputedStyle(layer).bottom) || 0); layer.style.bottom = keep;
      if (low > lineB - 70) lift = Math.max(4, Math.round(innerHeight - low - 62)) + "px";
    }
    if (layer.style.bottom !== lift) layer.style.bottom = lift;
  }
  function doorOn(lit, knock) { if (!desk) return; desk.classList.toggle("sb-door", !!lit); desk.classList.toggle("sb-knock", !!(lit && knock)); }

  function speak(p) {
    cur = p;
    var t = p.el;
    placeLayer(p);
    Array.prototype.slice.call(layer.querySelectorAll(".toast")).forEach(function (o) { if (o !== t && o.parentNode) o.parentNode.removeChild(o); });
    if (!t.parentNode) layer.appendChild(t);
    p.quiet = dnd() && !p.sticky;
    t.classList.toggle("sb-quiet", !!p.quiet);
    if (window.sbDeskHintYield) window.sbDeskHintYield();   /* одно место речи: пришедший сам шёпот уступает */
    t.style.marginRight = ""; t.style.transform = "";
    render(p);
    if (dodge(p)) render(p);
    if (!pal) pal = palette();
    var G = measure(p), rm = still();
    fitBand(p.top);
    p.hand = hand(p);
    p.hold = holdFor(p);
    var V = startView(p, G, p.hand, "new");
    V.overK = overOther(p.lineRect) ? 0.35 : 1;
    E.ph = V; p.view = V; E.leftAt = null; E.dragY = 0; E.dragA = 1; E.back = 0; E.phase = "say";
    p.typing = !rm && V.tEnd > E.T; p.readyDone = false; p.holdLeft = p.hold; p.paused = 0;
    V.onReady = function () { ready(p); };
    if (p.typing) t.classList.add("sb-typing");
    else ready(p);
    /* запас по часам — если кадров нет (вкладка в тени), сборка всё равно «кончилась» */
    p.typT = setTimeout(function () { ready(p); }, Math.max(0, (V.tEnd - E.T) * 1000) + 120);
    placeShade(p); shade.classList.add("on"); shade.classList.toggle("quiet", !!p.quiet);
    doorOn(p.kind === "event" && !p.quiet && !p.user, p.src === "knock");
    live.textContent = ""; var said = p.plain; setTimeout(function () { if (cur === p) live.textContent = said; }, 40);
    srBtn.hidden = false; t.appendChild(srBtn);
    /* вопрос — фокус на ответ (первым — согласие) и после того, как фраза встала в строку */
    if (p.ask) requestAnimationFrame(function () { if (cur !== p || p.gone) return; var f = p.field && p.field.isConnected ? p.field : p.acts[0]; if (f && doc.activeElement !== f && (!doc.activeElement || !t.contains(doc.activeElement))) try { f.focus({ preventScroll: true }); } catch (e) { /* фокус не обязателен */ } });
    if (window.sbEvent) { try { window.sbEvent("sb:say", { title: p.title0, text: p.plain, kind: p.kind, sticky: !!p.sticky, warm: !!p.warm, source: "voice", el: t }); } catch (e) { /* слушатель упал — голос говорит дальше */ } }
    kick();
  }
  function ready(p) {
    if (p.readyDone) return;
    p.typing = false; p.readyDone = true; clearTimeout(p.typT);
    p.el.classList.remove("sb-typing"); p.el.classList.add("sb-ready");
    p.readyAt = performance.now();
    if (!p.gone && cur === p) holdRun(p);
  }
  /* ── СРОК ФРАЗЫ · D-823 ────────────────────────────────────────────────
     Отсчёт идёт от сборки; пока палец или указатель на фразе (или над ней) —
     отсчёт стоит. По истечении фраза уходит сама: пыль в облако, облако тает. */
  function holdRun(p) {
    clearTimeout(p.holdT);
    if (p.holdLeft === Infinity || p.gone || !p.readyDone || p.paused) return;
    p.holdFrom = performance.now();
    p.holdT = setTimeout(function () { if (cur === p && !p.gone) melt(p, false); }, Math.max(0, p.holdLeft));
  }
  function holdPause(p, on) {
    if (!p || p.gone) return;
    if (on) {
      if (p.paused) return; p.paused = 1;
      if (p.holdFrom && p.holdLeft !== Infinity) { p.holdLeft = Math.max(0, p.holdLeft - (performance.now() - p.holdFrom)); p.holdFrom = 0; }
      clearTimeout(p.holdT);
    } else if (p.paused) { p.paused = 0; holdRun(p); }
  }
  function finish() {
    var p = cur; if (!p || !p.typing || !p.view) return;
    var V = p.view, sh = V.tEnd - E.T;
    if (sh > 0) { V.t0 -= sh; V.tEnd = E.T; for (var j = V.n0; j < V.n1 && j < E.N; j++) E.DL[j] -= sh; }
    ready(p); kick();
  }
  /* уход: пыль срывается с букв и уходит в облако; down — смахнули: пыль вниз, небо гаснет быстрее */
  function melt(p, fast, keepQueue, down) {
    if (!p || p.gone) return;
    p.gone = true; clearTimeout(p.holdT); clearTimeout(p.typT); p.typing = false;
    var t = p.el; t.classList.add("out"); t.classList.remove("sb-typing", "sb-ready");
    try { if (t.contains(doc.activeElement)) doc.activeElement.blur(); } catch (e) { /* фокусу некуда уйти */ }
    if (srBtn && srBtn.parentNode === t) { srBtn.hidden = true; t.removeChild(srBtn); }
    if (t.parentNode) t.parentNode.removeChild(t);
    t.style.transform = "";
    var V = p.view; p.view = null;
    if (V && E.ph === V) leave(!!down);
    if (!fast && !down && cur === p) swipeTip(p);
    if (cur === p) {
      cur = null; live.textContent = "";
      shade.classList.remove("on"); doorOn(false); dockSet(null);
      if (!keepQueue) setTimeout(next, fast ? 120 : 420);
    }
    if (p.onMelt && !p.requeue) { var f = p.onMelt; p.onMelt = null; try { f(); } catch (e) { if (window.console) console.error(e); } }
    kick();
  }

  /* ── ДОСРОЧНО ЗАКРЫТЬ · D-823 ──────────────────────────────────────────
     Смахнуть фразу вниз (пальцем или мышью: идёт за пальцем с сопротивлением;
     до порога 24 px — возвращается; за порогом или быстрым фликом — пыль уходит
     вниз, небо гаснет ≈0,5 с), Esc, невидимая кнопка «закрыть фразу» для чтеца.
     Крестика нет. Вопрос, закрытый так, — это «не отвечать»: ничего не делается,
     вопрос остаётся в выпуске. */
  var SWIPE = 24, drag = null, dragEat = 0;
  function closeNow(p, how) {
    if (!p || p.gone) return false;
    p.closedBy = how; p.answered = true;
    var q = p.ask || (p.acts.length && p.ttl === Infinity && !p.sticky);
    if (q && !p.rec && !p.warm && typeof window.sbNotifRecord === "function") {   /* вопрос без ответа — в выпуск */
      p.el.setAttribute("data-voice-logged", "");
      try { p.rec = window.sbNotifRecord({ title: p.title0 || p.plain, text: p.text0 || "", safe: false, tk: keyOf(p.title0), xk: keyOf(p.text0) }); } catch (e) { /* выпуск недоступен */ }
    }
    if (p.sticky) readSafe(p);
    melt(p, true, false, true);
    /* вопрос sbAsk ждёт ответа обещанием — «не отвечать» = отказ (его слушает shell.js по касанию мимо слов) */
    if (p.ask && !p.api) { try { p.el.dispatchEvent(new MouseEvent("click", { bubbles: false })); } catch (e) { /* вопроса уже нет */ } }
    return true;
  }
  function overLine(x, y) {
    var p = cur; if (!p || p.gone || !p.lineRect) return false;
    var r = p.lineRect;
    return x >= r.left - 12 && x <= r.right + 12 && y <= r.bottom + 12 && y >= r.top - 90;
  }
  function dragCarrier() { if (cur && cur.el) cur.el.style.transform = E.dragY ? "translateY(" + E.dragY.toFixed(1) + "px)" : ""; }
  function onDown(e) {
    if (!cur || cur.gone) return;
    if (overLine(e.clientX, e.clientY)) {
      holdPause(cur, true);
      if (e.target && e.target.closest && e.target.closest("#toastLayer .toast-field")) return;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, ly: e.clientY, lt: performance.now(), v: 0, on: false, p: cur };
    }
  }
  function onMove(e) {
    var over = overLine(e.clientX, e.clientY);
    if (e.pointerType === "mouse" && !drag) holdPause(cur, over);
    if (!drag || e.pointerId !== drag.id || drag.p !== cur) return;
    var dy = e.clientY - drag.y, dx = e.clientX - drag.x, now = performance.now();
    drag.v = (e.clientY - drag.ly) / Math.max(1, now - drag.lt); drag.ly = e.clientY; drag.lt = now;
    if (!drag.on && dy > 8 && dy > Math.abs(dx)) { drag.on = true; if (cur.typing) finish(); }
    if (drag.on) {   /* идёт за пальцем с сопротивлением */
      var v = Math.max(0, dy); E.back = 0; E.dragY = 32 * (1 - Math.exp(-v / 40)); E.dragA = 1 - 0.55 * Math.min(1, v / 60);
      dragCarrier(); kick(); if (e.cancelable) e.preventDefault();
    }
  }
  function onUp(e) {
    var D = drag; if (!D || e.pointerId !== D.id) { if (e.pointerType !== "mouse" && cur) holdPause(cur, false); return; }
    drag = null;
    var p = D.p, dy = e.clientY - D.y;
    if (D.on) {
      dragEat = performance.now();   /* следующий click — от этого же жеста, не касание слов */
      if (p === cur && (dy >= SWIPE || D.v > 0.6)) { closeNow(p, "swipe"); return; }
      E.back = 1; kick();
    }
    if (p === cur && (e.pointerType !== "mouse" || !overLine(e.clientX, e.clientY))) holdPause(p, false);
  }

  /* ── ОДИН РАЗ: ПОДСКАЗКА ПРО СМАХИВАНИЕ · D-823 ────────────────────────
     При первой длинной фразе голос сам говорит, что её можно смахнуть вниз, —
     формой обращения человека (sbAddr) и родом дома, на языке системы. Один раз
     на этом устройстве (метка sysbaby.voice.swipeTip). */
  var TIPK = "sysbaby.voice.swipeTip", tipSaid = false;
  function swipeTip(p) {
    /* только у фразы, которая простояла свой срок (смахнувший уже знает); не у подсказок стола и знакомства */
    if (tipSaid || p.tip || p.ask || p.sticky || p.quiet || p.warm || p.hold === Infinity || wordsIn(p.plain) < 9 || p.el.hasAttribute("data-tip") || queue.length) return;
    try { if (localStorage.getItem(TIPK)) { tipSaid = true; return; } } catch (e) { /* хранилище закрыто — скажем, но только в этот раз */ }
    tipSaid = true;
    try { localStorage.setItem(TIPK, "1"); } catch (e) { /* метку не положить — подсказка всё равно одна за сеанс */ }
    var A = window.sbAddr, hs = "";
    try { if (A && typeof A.H === "function") hs = A.H("", ".he", ".d"); } catch (e) { hs = ""; }
    setTimeout(function () {
      if (cur || queue.length || gated()) { tipSaid = false; try { localStorage.removeItem(TIPK); } catch (e) { /* метка останется — подсказки не будет */ } return; }
      var q = say("", { key: "voice.swipe" + hs, tip: true });
      if (q) q.el.setAttribute("data-voice-tip", "swipe");
    }, 700);
  }
  function next() {
    if (cur || !queue.length) return;
    if (gated() || curtain()) return;
    /* важное — первым: стук у замка не ждёт за «продолжить?» */
    var k = 0; for (var i = 0; i < queue.length; i++) if (queue[i].sticky) { k = i; break; }
    var p = queue.splice(k, 1)[0];
    p.gone = false; p.requeue = false;
    p.el.classList.remove("out");
    speak(p);
  }
  /* очередь: одна фраза за раз. Новое сменяет прежнее; важное и ждущее
     ответа не пропадают — встают в очередь и вернутся. Важное уступает
     только ответу на нажатие самого человека. */
  function enqueue(p) {
    if (p.user) queue = queue.filter(function (q) { return !(q.kind === "confirm" && !q.ask); });   /* подтверждение сменяет подтверждение (D-252) */
    if (!cur) { if (curtain()) { queue.push(p); waitCurtain(); } else speak(p); return; }
    if (cur.sticky && !p.user) { queue.push(p); return; }
    var prev = cur;
    prev.requeue = (prev.sticky || prev.standing) && !prev.answered;
    melt(prev, true, true);
    if (prev.requeue) queue.unshift(prev);
    speak(p);
  }
  var cw = 0;
  function waitCurtain() { if (cw) return; cw = setInterval(function () { if (!curtain()) { clearInterval(cw); cw = 0; next(); } }, 250); }

  /* ── выпуск ───────────────────────────────────────────────────────── */
  function keyOf(s) { var m = memo[s]; return m ? { k: m.k, v: m.v || null } : null; }
  function journal(p) {
    if (p.warm || p.kind !== "event" || typeof window.sbNotifRecord !== "function") return;
    p.el.setAttribute("data-voice-logged", "");
    try { p.rec = window.sbNotifRecord({ title: p.title0, text: p.text0, safe: !!p.sticky, tk: keyOf(p.title0), xk: keyOf(p.text0) }); } catch (e) { if (window.console) console.error("[voice] journal", e); }
  }
  function readSafe(p) {
    p.answered = true;
    if (p.rec && typeof window.sbNotifRead === "function") try { window.sbNotifRead(p.rec); } catch (e) { /* выпуск недоступен — фраза всё равно уходит */ }
  }

  /* ── вход от блока тостов (shell.js) ───────────────────────────────── */
  function take(t, ttl) {
    if (!mount()) return null;
    /* у ворот — ни слова; но важное (держится до касания: предупреждение, вопрос, «стоящее») не теряется —
       ждёт открытия дома, как стук у замка (D-815, D-814; решение координатора доски H4 п.9). Прежде такая
       фраза у ворот выбрасывалась (take → null), и «только чтение» второй вкладки не звучало вовсе. */
    if (gated()) {
      var c0 = t.classList;
      if (!(c0.contains("toast-warn") || c0.contains("toast-ask") || c0.contains("toast-standing"))) return null;
      var hh = { el: t, gone: false, h: null, dismiss: function () { hh.gone = true; if (hh.h && hh.h.dismiss) hh.h.dismiss(); } };
      (function wait() { if (hh.gone) return; if (gated()) { setTimeout(wait, 250); return; } hh.h = take(t, ttl); })();
      return hh;
    }
    var p = build(t, ttl);
    if (p.sticky) p.ttl = Infinity;
    journal(p);
    var h = { el: t, dismiss: function () { p.answered = true; drop(p); } };
    p.handle = h;
    /* касание самих слов (не кнопок): важное — прочитано; вопрос — отказ (его слушает sbAsk); прочее — уходит */
    t.addEventListener("click", function (ev) {
      if (ev.target && ev.target.closest && ev.target.closest("button, .toast-field")) return;
      if (p.ask || ev.isTrusted === false && p.closedBy) return;
      if (p.sticky) readSafe(p);
      p.answered = true; melt(p, true);
    });
    /* слово-кнопка ответила — фраза не вернётся из очереди */
    t.addEventListener("click", function (ev) { if (ev.target && ev.target.closest && ev.target.closest("button.toast-action")) { if (p.sticky) readSafe(p); p.answered = true; } }, true);
    enqueue(p);
    return h;
  }
  function drop(p) {
    if (!p) return;
    var i = queue.indexOf(p); if (i >= 0) queue.splice(i, 1);
    p.requeue = false;
    if (cur === p) melt(p, true);
    else if (!p.gone) { p.gone = true; if (p.el.parentNode) p.el.parentNode.removeChild(p.el); }
  }
  /* «Не беспокоить» заглушило пришедшее само: не звучит, но ложится в выпуск */
  function quietly(title, text, kind, extra) {
    if (kind !== "event" || gated() || typeof window.sbNotifRecord !== "function") return;
    try { window.sbNotifRecord({ title: String(title == null ? "" : title), text: String(text == null ? "" : text), safe: /toast-warn/.test(extra || ""), tk: keyOf(String(title)), xk: keyOf(String(text)) }); } catch (e) { /* выпуск недоступен */ }
  }
  /* голос своей фразой: шаблон с [словами] вместо заголовка извещения (эстафета, Свидетель, стук) */
  function retell(h, tpl, src, o) {
    var t = h && h.el, p = t && t._vp; if (!p) return false;
    p.tpl = tpl; if (src) { p.src = src; t.setAttribute("data-voice-src", src); }
    /* важное для безопасности (стук у замка): не тает до касания, в выпуске — непрочитанное */
    if (o && o.sticky && !p.sticky) {
      p.sticky = true; p.ttl = Infinity; clearTimeout(p.holdT);
      if (!p.warm && p.kind === "event") { p.el.setAttribute("data-voice-logged", ""); try { p.rec = window.sbNotifRecord({ title: p.title0, text: p.text0, safe: true, tk: keyOf(p.title0), xk: keyOf(p.text0) }); } catch (e) { /* выпуск недоступен */ } }
    }
    if (cur === p && !p.gone) { resay(p, false); doorOn(p.kind === "event" && !p.quiet && !p.user, p.src === "knock"); }
    return true;
  }
  /* перерисовать фразу: на новом языке, новой формой. Смена языка — новая короткая
     сборка (D ×0,6) без ухода в облако; settle — сразу на месте. Срок не начинается заново. */
  function same(A, B) {
    if (!A || !B || A.length !== B.length) return false;
    for (var i = 0; i < A.length; i++) if (A[i].ch !== B[i].ch || Math.abs(A[i].x - B[i].x) > 0.5 || Math.abs(A[i].y - B[i].y) > 0.5) return false;
    return true;
  }
  function resay(p, settle, quick) {
    if (!p.view) return;
    placeLayer(p);
    p.el.style.marginRight = "";
    var foc = doc.activeElement && p.el.contains(doc.activeElement) ? doc.activeElement : null;
    render(p);
    if (dodge(p)) render(p);
    var G = measure(p);
    /* окно открылось или закрылось, а строка на месте — сборка идёт дальше, как шла */
    if (!settle && !quick && same(G, p.view.LA.G)) { placeShade(p); if (foc && foc.isConnected && doc.activeElement !== foc) try { foc.focus({ preventScroll: true }); } catch (e) { /* фокус не обязателен */ } return; }
    fitBand(p.top);
    var mode = settle || still() || (!quick && !p.typing) ? "instant" : "quick";
    var V = startView(p, G, p.hand || hand(p), mode === "instant" ? "instant" : "quick");
    V.overK = p.view.overK; V.readyAt = mode === "instant" ? E.T : 0;
    if (mode === "instant") V.tEnd = E.T;
    E.ph = V; p.view = V;
    if (!p.readyDone) { if (mode === "instant") ready(p); else V.onReady = function () { ready(p); }; }
    placeShade(p);
    live.textContent = p.plain;
    if (srBtn) { srBtn.hidden = false; p.el.appendChild(srBtn); }
    if (foc && foc.isConnected) try { foc.focus({ preventScroll: true }); } catch (e) { /* фокус не обязателен */ }
    kick();
  }

  /* ── своя фраза (знакомство, тёплые слова, законы) ─────────────────── */
  function say(text, opt) {
    opt = opt || {};
    if (!mount() || gated()) return null;
    var keyed = !!opt.key;
    if (keyed) text = form(opt.key, opt.vars);
    text = String(text == null ? "" : text);
    var t = el("div", "toast");
    t.setAttribute("data-kind", opt.kind === "event" ? "event" : "confirm");
    t.setAttribute("data-title", text.replace(/[\[\]]/g, "")); t.setAttribute("data-text", "");
    if (opt.warm) t.setAttribute("data-voice-warm", "");
    if (opt.sticky) t.setAttribute("data-voice-sticky", "");
    var ws = []; text.replace(/\[([^\]]+)\]/g, function (m, w) { ws.push(w); return m; });
    ws.forEach(function (w, i) {
      var b = el("button", "toast-action"); b.type = "button"; b.textContent = w;
      b.addEventListener("click", function () { if (opt.on) try { opt.on(w, i); } catch (e) { if (window.console) console.error(e); } if (!opt.stay) drop(t._vp); });
      t.appendChild(b);
    });
    var p = build(t, opt.keep || opt.sticky ? Infinity : (opt.hold || 5800));
    p.api = true; p.onDesk = opt.onDesk || null; p.user = !!opt.user; p.tip = !!opt.tip; p.urgent = !!opt.urgent;
    if (opt.hold && !opt.keep && !opt.sticky) p.holdOwn = +opt.hold;   /* срок назвал сам говорящий */
    p.tpl = keyed ? function () { return form(opt.key, opt.vars); } : function () { return text; };
    if (p.sticky) p.ttl = Infinity;
    journal(p);
    var h = { el: t, dismiss: function () { drop(p); } };
    h.done = new Promise(function (r) { p.onMelt = function () { if (opt.melt) try { opt.melt(); } catch (e) { if (window.console) console.error(e); } r(); }; });
    p.handle = h;
    t.addEventListener("click", function (ev) { if (ev.target.closest && ev.target.closest("button")) return; if (p.sticky) readSafe(p); if (!opt.keep || p.sticky) { p.answered = true; melt(p, true); } });
    if (opt.after && cur && !cur.gone) { queue.push(p); return h; }   /* после того, что звучит сейчас */
    enqueue(p);
    return h;
  }

  /* ── слои ─────────────────────────────────────────────────────────── */
  var mounted = false;
  function mount() {
    if (mounted) return true;
    layer = doc.getElementById("toastLayer"); if (!layer || !doc.body) return false;
    mounted = true;
    wrapT();
    layer.classList.add("sb-voice-layer"); layer.removeAttribute("aria-live");
    shade = el("div"); shade.id = "sbVoiceShade"; shade.setAttribute("aria-hidden", "true");
    cv = el("canvas"); cv.id = "sbVoiceLight"; cv.setAttribute("aria-hidden", "true"); cx = cv.getContext("2d");
    sky = el("canvas"); sky.id = "sbVoiceSky"; sky.setAttribute("aria-hidden", "true");
    layer.parentNode.insertBefore(sky, layer); layer.parentNode.insertBefore(shade, layer); layer.parentNode.insertBefore(cv, layer);
    /* невидимая кнопка для чтеца: «закрыть фразу» — рядом с текстом фразы (крестика глазу нет) */
    srBtn = el("button", "sb-vclose"); srBtn.type = "button"; srBtn.hidden = true;
    srBtn.setAttribute("aria-label", tr("voice.close")); srBtn.textContent = tr("voice.close");
    srBtn.addEventListener("click", function (e) { e.stopPropagation(); closeNow(cur, "reader"); });
    live = el("div"); live.id = "sbVoiceLive"; live.setAttribute("role", "status"); live.setAttribute("aria-live", "polite"); doc.body.appendChild(live);
    /* свет из-под двери: в самом фоне стола, под значками и окнами */
    desk = doc.getElementById("desktop");
    var wp = desk && desk.querySelector(".wp-layer");
    door = el("div"); door.id = "sbVoiceDoor"; door.setAttribute("aria-hidden", "true"); door.innerHTML = '<i class="sb-door-glow"></i><i class="sb-door-line"></i>';
    if (wp && wp.parentNode) wp.parentNode.insertBefore(door, wp.nextSibling); else if (desk) desk.appendChild(door);
    pal = palette();
    fitBand(null);
    /* касание где угодно — допечатать сразу; касание пустого стола — «не отвечать» тому, кто спросил */
    doc.addEventListener("pointerdown", function (e) { if (reclaimDock(e.clientX, e.clientY, e.target)) return; onDown(e); if (cur && cur.typing) finish(); }, true);
    doc.addEventListener("pointermove", onMove, { capture: true, passive: false });
    doc.addEventListener("pointerup", onUp, true);
    doc.addEventListener("pointercancel", function (e) { if (drag && e.pointerId === drag.id) { drag = null; E.back = 1; kick(); if (cur) holdPause(cur, false); } }, true);
    doc.addEventListener("pointerout", function (e) { if (!e.relatedTarget && e.pointerType === "mouse" && cur) holdPause(cur, false); }, true);
    /* click того же жеста, что смахивал, — не касание слов и не «отказ» вопросу */
    doc.addEventListener("click", function (e) { if (dragEat && performance.now() - dragEat < 500 && e.target && e.target.closest && e.target.closest("#toastLayer")) { dragEat = 0; e.stopPropagation(); e.preventDefault(); } }, true);
    /* Esc — закрыть фразу досрочно. Вопрос sbAsk слушает Esc сам (отказ) — ему не мешаем. */
    doc.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !cur || cur.gone || e.defaultPrevented) return;
      if (cur.ask && !cur.api) return;
      if (closeNow(cur, "esc")) { e.preventDefault(); e.stopPropagation(); }
    }, true);
    /* к полке пришли клавишей — она возвращается так же, как от касания */
    doc.addEventListener("focusin", function (e) { var d = doc.getElementById("dock"); if (d && e.target && d.contains(e.target)) reclaimDock(); }, true);
    doc.addEventListener("click", function (e) {
      var id = e.target && e.target.id;
      if (cur && cur.onDesk && (id === "desktop" || id === "sbIconLayer" || id === "sbNoteLayer")) { var f = cur.onDesk; cur.onDesk = null; f(); }
    }, true);
    addEventListener("resize", reflow);
    if (window.sbBus && window.sbBus.on) {
      window.sbBus.on("translate:done", relang);
      window.sbBus.on("theme:changed", function () { setTimeout(repaint, 30); });
      window.sbBus.on("window:opened", function () { setTimeout(reflow, 420); });
      window.sbBus.on("window:closed", function () { setTimeout(reflow, 60); });
    }
    /* ворота встали над открытым домом (замок, выход) — голос умолкает сразу */
    /* полка появилась или ушла (первое окно открыто, последнее закрыто) — решить уступку в тот же миг,
       до кадра: иначе полка успела бы показаться и тут же уйти */
    var dockWas = root.classList.contains("dock-empty");
    if (typeof MutationObserver === "function") new MutationObserver(function () {
      var de = root.classList.contains("dock-empty"); if (de !== dockWas) { dockWas = de; if (cur && !cur.gone) reflow(); else dockSet(null); }
      if (gated()) { if (cur || queue.length) hush(true); } else if (!cur && queue.length) next(); })
      .observe(root, { attributes: true, attributeFilter: ["class"] });
    /* окно свернулось или вернулось с полки посреди фразы — заново решить, уступает ли полка (доска H4, shelfHolds) */
    var dk = doc.getElementById("dock");
    if (dk && typeof MutationObserver === "function") new MutationObserver(function () { if (cur && !cur.gone) dockSet(cur); })
      .observe(dk, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
    /* тема сменилась — цвета пыли и неба из её токенов */
    if (typeof MutationObserver === "function") new MutationObserver(function () { setTimeout(repaint, 30); })
      .observe(root, { attributes: true, attributeFilter: ["data-theme", "data-wp-mood"] });
    if (mq.addEventListener) mq.addEventListener("change", function () { if (cur) resay(cur, true); });
    window.addEventListener("sb:say", function (e) {   /* чужой пакет хочет сказать (П2, П3) */
      var d = e && e.detail; if (!d || d.source === "voice" || d.source === "toast") return;
      say(d.text || d.title || "", d);
    });
    return true;
  }
  function reflow() {
    if (!cur || cur.gone || !layer) { dockSet(null); return; }
    resay(cur, false);
  }
  function relang() {
    if (cur && !cur.gone) { syncCarrier(cur); resay(cur, false, true); }
    if (srBtn) { srBtn.setAttribute("aria-label", tr("voice.close")); srBtn.textContent = tr("voice.close"); }
    queue.forEach(syncCarrier);
  }
  function hush(all) {
    if (all) queue.length = 0;
    if (cur) melt(cur, true, !!all);
  }

  window.sbVoice = {
    ready: function () { return mount() && fontsReady; },
    take: take, say: say, retell: retell, quietly: quietly, form: form, hush: hush, finish: finish,
    /* шёпот, вызванный лампочкой самим человеком, важнее пришедшего (v47.1) */
    yieldTo: function () { if (cur && !cur.sticky && !cur.ask) { cur.answered = true; melt(cur, false); } },
    state: function () {
      var p = cur;
      return { speaking: !!p && !p.gone, text: p ? p.plain : "", typing: !!(p && p.typing), sticky: !!(p && p.sticky), words: p ? (p.words || []).slice() : [],
        quiet: !!(p && p.quiet), gated: gated(), queue: queue.length, src: p ? p.src : "" };
    },
    cost: function (reset) { var r = { n: COST.n, avg: COST.n ? +(COST.ms / COST.n).toFixed(2) : 0, max: +COST.max.toFixed(1) }; if (reset) COST = { n: 0, ms: 0, max: 0 }; return r; },
    /* досрочно закрыть сказанное (то же, что смахнуть) */
    close: function () { return closeNow(cur, "api"); },
    /* что сейчас на холсте — для законов (D-823): фаза, небо, пылинки, почерк, срок */
    view: function () {
      var p = cur, P = E.ph, a = 0;
      if (P) { a = P.quietIn ? cl((E.T - P.t0) / Math.max(0.01, P.tEnd - P.t0)) : E.T >= P.tEnd ? 1 : 0; }
      return { phase: E.phase, sky: +E.skyA.toFixed(3), particles: E.N ? (E.live == null ? E.N : E.live) : 0, peak: E.peak, still: still(),
        kind: p && p.hand ? p.hand.kind : "", chor: p && p.hand ? p.hand.chor : "", again: !!(p && p.hand && p.hand.again), tod: pal ? pal.tod : "",
        hold: p ? (p.hold === Infinity ? -1 : p.hold) : 0, paused: !!(p && p.paused), dragY: +E.dragY.toFixed(2), alpha: +a.toFixed(3),
        assembly: P ? +((P.tEnd - P.born)).toFixed(3) : 0, dpr: dpr, raf: !!raf,
        colors: pal ? { text: pal.text, name: pal.name, dust: pal.dust, glow: pal.glow, light: pal.light } : null,
        stars: E.mid.map(function (m) { return { x: m.x + m.ox, y: band.top + E.skyOff() + m.y + m.oy, big: m.big, a: m.a }; }) };
    }
  };
  /* голос сам шлёт sb:say — переходник П0 молчит */
  window.sbSayOwned = true;
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", mount); else mount();

  /* знаки голоса — заранее, в простое: первая фраза не платит за спрайты кадром */
})();
