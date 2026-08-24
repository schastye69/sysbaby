/* sys.baby OS — core/shell.js
 * Shell engine: helpers, event bus, theme/accent/mood, toasts, app registry,
 * window manager (drag/resize/snap/undo-close), dock, desktop icon grid,
 * boot engine + cinematic curtain, sign-in, deep links, Escape priority.
 * Depends on core/store.js only. Every cross-module touch is guarded. */
(function () {
  "use strict";

  /* =============================================================== helpers */
  var doc = document, root = doc.documentElement;
  var $ = function (sel, ctx) { return (ctx || doc).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); };
  var now = function () { return Date.now(); };
  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
  function num(v, d) { v = Number(v); return isFinite(v) ? v : d; }

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  window.escapeHtml = escapeHtml;

  function readJSON(key, fallback) {
    try {
      var raw = window.sbDB ? window.sbDB.get(key) : null;
      if (!raw) return fallback;
      var v = JSON.parse(raw);
      return (v === null || v === undefined) ? fallback : v;
    } catch (e) { return fallback; }
  }
  function writeJSON(key, value) {
    try { if (window.sbDB) window.sbDB.set(key, JSON.stringify(value)); } catch (e) { if (window.console) console.error("[shell] write " + key, e); }
  }
  window.sbReadJSON = readJSON;
  window.sbWriteJSON = writeJSON;

  /* ── ПЕРЕРИСОВКА НЕ ДВИГАЕТ ТО, ЧТО ПРОКРУТИЛ ЧЕЛОВЕК (v60) ──────────────
     ПОВОД: основатель, дважды и с разных экранов. Сначала «Настройки»:
     «я нажимаю на кнопку about и меню улетает в начало». Потом «Письма»:
     «здесь снова телепорт. больше нигде не должно быть телепортов!».

     В v58 это чинилось внутри одного приложения, и правило было записано
     словами в шапке закона, а не в коде. Слова не исполняются: следующее
     приложение с прокручиваемой полосой получило тот же дефект, не нарушив
     ни строчки. Теперь это не приём, а СРЕДСТВО ОБОЛОЧКИ — одно на всех.

     ПОЧЕМУ ЭТО ВООБЩЕ СЛУЧАЕТСЯ. Приложения перерисовывают корпус целиком
     через innerHTML: так проще и так они устроены с самого начала. Но
     innerHTML УНИЧТОЖАЕТ узлы, а вместе с ними и прокрутку — своё положение
     в списке, свою полосу разделов, своё место в длинной ленте. Человек
     этого не просил: перерисовка — дело системы, прокрутка — дело человека.

     КАК УЗНАЁТСЯ ТОТ ЖЕ УЗЕЛ ПОСЛЕ ЗАМЕНЫ. Ссылку хранить нельзя — узел
     будет другим. Ключом служит место в разметке: имя тега, полный список
     классов и порядковый номер среди таких же внутри корпуса. Для полос и
     лент этого достаточно, а если разметка сменилась целиком — ключ просто
     не найдётся, и восстанавливать будет нечего. Это правильный исход:
     лучше ничего не восстановить, чем восстановить не туда.

     ВОЗВРАТ ИДЁТ СРАЗУ, в той же задаче, до отрисовки, — поэтому кадра с
     полосой в начале не бывает вовсе.

     Чего средство НЕ делает: не подводит полосу к активному разделу. Это
     был бы второй телепорт вместо первого. Требование самое скромное — где
     стояло, там и осталось. */
  window.sbKeepScroll = function (host) {
    if (!host || !host.querySelectorAll) return function () { };
    var keyOf = function (el) {
      return el.tagName + "." + (el.className && el.className.baseVal !== undefined
        ? el.className.baseVal : String(el.className || ""));
    };
    var seen = Object.create(null), kept = [];
    var all = [host].concat(Array.prototype.slice.call(host.querySelectorAll("*")));
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      var l = el.scrollLeft || 0, t = el.scrollTop || 0;
      var k = keyOf(el);
      var n = seen[k] = (seen[k] === undefined ? 0 : seen[k] + 1);
      if (l > 0 || t > 0) kept.push({ k: k, n: n, l: l, t: t });
    }
    if (!kept.length) return function () { };
    return function restore() {
      var seen2 = Object.create(null);
      var all2 = [host].concat(Array.prototype.slice.call(host.querySelectorAll("*")));
      for (var j = 0; j < all2.length; j++) {
        var el2 = all2[j];
        var k2 = keyOf(el2);
        var n2 = seen2[k2] = (seen2[k2] === undefined ? 0 : seen2[k2] + 1);
        for (var m = 0; m < kept.length; m++) {
          if (kept[m].k !== k2 || kept[m].n !== n2) continue;
          var maxL = el2.scrollWidth - el2.clientWidth;
          var maxT = el2.scrollHeight - el2.clientHeight;
          if (maxL > 0) el2.scrollLeft = kept[m].l > maxL ? maxL : kept[m].l;
          if (maxT > 0) el2.scrollTop = kept[m].t > maxT ? maxT : kept[m].t;
          break;
        }
      }
    };
  };

  function rawGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function rawSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* §10 amnesiac */ } }

  var prefersReducedMedia = null;
  try { prefersReducedMedia = window.matchMedia("(prefers-reduced-motion: reduce)"); } catch (e) { prefersReducedMedia = null; }
  function systemReduced() { return !!(prefersReducedMedia && prefersReducedMedia.matches); }
  function reduced() { return root.getAttribute("data-motion") === "reduced"; }
  window.sbReducedMotion = reduced;

  /* responsive flags (§14) — two independent signals */
  function isTouch() {
    try { return window.matchMedia("(pointer: coarse)").matches; } catch (e) { return "ontouchstart" in window; }
  }
  function applyFlags() {
    root.classList.toggle("is-touch", isTouch());
    root.classList.toggle("is-compact", window.innerWidth <= 860);
    root.classList.toggle("is-narrow", window.innerWidth <= 620);
  }
  applyFlags();
  function compact() { return root.classList.contains("is-compact"); }

  /* =================================================================== bus */
  var busMap = Object.create(null);
  var sbBus = {
    on: function (evt, fn) {
      if (typeof fn !== "function") return;
      (busMap[evt] || (busMap[evt] = [])).push(fn);
    },
    emit: function (evt, payload) {
      var list = busMap[evt];
      if (!list) return;
      for (var i = 0; i < list.length; i++) {
        try { list[i](payload); } catch (e) { if (window.console) console.error("[sbBus] " + evt, e); }
      }
    }
  };
  window.sbBus = sbBus;

  /* ============================================================== fetch/anim */
  window.sbFetchWithTimeout = function (url, opts, ms) {
    if (typeof opts === "number") { ms = opts; opts = {}; }
    opts = opts || {}; ms = num(ms, 6000);
    var ctrl = null;
    try { ctrl = new AbortController(); } catch (e) { ctrl = null; }
    if (ctrl) opts.signal = ctrl.signal;
    var timer = setTimeout(function () { if (ctrl) { try { ctrl.abort(); } catch (e) { /* ignore */ } } }, ms);
    return fetch(url, opts).then(function (r) { clearTimeout(timer); return r; }, function (err) { clearTimeout(timer); throw err; });
  };

  window.sbAnimateFigure = function (el, valueOrRange, fmt) {
    if (!el) return;
    var format = typeof fmt === "function" ? fmt : function (n) { return String(Math.round(n)); };
    var isRange = Array.isArray(valueOrRange);
    var to = isRange ? [num(valueOrRange[0], 0), num(valueOrRange[1], 0)] : [num(valueOrRange, 0)];
    var paint = function (vals) { el.textContent = isRange ? (format(vals[0]) + "–" + format(vals[1])) : format(vals[0]); };
    if (systemReduced() || reduced()) { paint(to); return; }
    var fromText = el.getAttribute("data-figure");
    var from = fromText ? JSON.parse(fromText) : to.map(function () { return 0; });
    if (from.length !== to.length) from = to.map(function () { return 0; });
    var start = performance.now(), dur = 500;
    function step(t) {
      var p = clamp((t - start) / dur, 0, 1);
      paint(to.map(function (v, i) { return from[i] + (v - from[i]) * p; }));
      if (p < 1) requestAnimationFrame(step);
      else el.setAttribute("data-figure", JSON.stringify(to));
    }
    el.setAttribute("data-figure", JSON.stringify(to));
    requestAnimationFrame(step);
  };

  /* ================================================= theme / accent / moods */
  var CC_KEY = "sysbaby.controlcenter.v1";
  var THEME_KEY = "sysbaby.theme.mode";      /* addition (§16.3 #2) */
  var ACCENT_KEY = "sysbaby.theme.accent";
  var MOOD_KEY = "sysbaby.wallpaper.mood";

  function ccAll() { var v = readJSON(CC_KEY, {}); return (v && typeof v === "object") ? v : {}; }
  function ccWrite(o) { writeJSON(CC_KEY, o); }

  /* Every setting setter below announces its change on one channel. This is
     the whole real-time-sync mechanism: the Control Center and the Pulse app
     both read the same stored value AND both listen to the same announcement,
     so a change made on either surface appears on the other in the same
     frame — not on the next open. (Found the honest way: the founder flipped
     the dock-dimming switch — then still labelled Auto-Hide, renamed when the
     dock stopped leaving the screen — in the quick panel while Pulse was open
     and watched the other switch not move.) */
  function announceSetting(kind, detail) {
    var payload = detail || {};
    payload.kind = kind;
    sbBus.emit("setting:changed", payload);
    try { doc.dispatchEvent(new CustomEvent("sysbaby:setting-changed", { detail: payload })); } catch (e) { /* ignore */ }
  }
  window.sbAnnounceSetting = announceSetting;

  window.sbGetControlToggle = function (key) {
    var all = ccAll();
    if (Object.prototype.hasOwnProperty.call(all, key)) return !!all[key];
    if (key === "motion") return systemReduced();          /* default ON under reduce-motion */
    if (key === "autohide") return !isTouch();
    if (key === "sound") return true;
    return false;
  };
  window.sbSetControlToggle = function (key, on) {
    var all = ccAll();
    all[key] = !!on;
    ccWrite(all);
    applyControl(key, !!on);
    announceSetting("toggle", { key: key, on: !!on });
    return !!on;
  };

  function applyControl(key, on) {
    if (key === "motion") root.setAttribute("data-motion", on ? "reduced" : "full");
    else if (key === "dnd") root.setAttribute("data-dnd", on ? "1" : "0");
    else if (key === "transparency") root.setAttribute("data-transparency", on ? "reduced" : "full");
    else if (key === "autohide") root.classList.toggle("dock-autohide", !!on && !isTouch());
    $$('[data-cc="' + key + '"]').forEach(function (b) {
      b.classList.toggle("on", !!on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  window.sbApplyControl = applyControl;

  /* ── ТУРБО: РУКОЯТКА ЦЕНЫ КАРТИНКИ (v47.3) ─────────────────────────────
   *
   * Основатель: «turbo режим должен быть максимально функциональным и
   * эффективным». По существу это одно движение, снимающее всё, что стоит
   * кадров: живое поле обоев (постоянный рендер на канвасе), размытие
   * подложки (самая дорогая деталь композитора) и долгие переходы.
   *
   * ГЛАВНОЕ ПРАВИЛО — АРЕНДА, НЕ ПРИСВОЕНИЕ. Турбо запоминает, какими были
   * настройки человека, и при выключении возвращает ИХ, а не заводские:
   * человек, державший «меньше движения» сам, получит его обратно. Без
   * этого правила Турбо становился бы ластиком чужого выбора.
   *
   * Класс sb-turbo на документе — для CSS (см. core.css): им снимаются
   * оставшиеся тени и переходы, до которых не дотягиваются data-атрибуты.
   */
  var TURBO_KEY = "sysbaby.turbo";
  function turboOn() {
    var v = readJSON(TURBO_KEY, null);
    return !!(v && v.on);
  }
  window.sbTurbo = function (on) {
    var cur = readJSON(TURBO_KEY, null) || { on: false };
    if (on === undefined) return cur.on;
    on = !!on;
    if (on === cur.on) return on;
    if (on) {
      /* арендуем: записываем, что было, и включаем экономию */
      cur = {
        on: true,
        was: {
          motion: window.sbGetControlToggle("motion"),
          transparency: window.sbGetControlToggle("transparency"),
          field: window.sbField ? window.sbField.level() : "live"
        }
      };
      window.sbSetControlToggle("motion", true);
      window.sbSetControlToggle("transparency", true);
      if (window.sbField) window.sbField.setLevel("off");
    } else {
      var was = cur.was || {};
      cur = { on: false };
      window.sbSetControlToggle("motion", !!was.motion);
      window.sbSetControlToggle("transparency", !!was.transparency);
      if (window.sbField) window.sbField.setLevel(was.field === "off" || was.field === "quiet" ? was.field : "live");
    }
    writeJSON(TURBO_KEY, cur);
    root.classList.toggle("sb-turbo", on);
    var btn = $("#sbTurboBtn");
    if (btn) {
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.classList.toggle("on", on);
    }
    sbBus.emit("turbo:change", { on: on });
    return on;
  };
  function wireTurbo() {
    var btn = $("#sbTurboBtn");
    if (!btn) return;
    btn.addEventListener("click", function () { window.sbTurbo(!window.sbTurbo()); });
    /* Пережить перезагрузку: включённый Турбо восстанавливается ДО первого
       кадра стола — иначе поле успеет запуститься и тут же остановиться. */
    if (turboOn()) {
      root.classList.add("sb-turbo");
      btn.setAttribute("aria-pressed", "true");
      btn.classList.add("on");
      window.sbSetControlToggle("motion", true);
      window.sbSetControlToggle("transparency", true);
      if (window.sbField) window.sbField.setLevel("off");
      else doc.addEventListener("DOMContentLoaded", function () { if (window.sbField) window.sbField.setLevel("off"); });
    }
  }

  window.setTheme = function (t) {
    var mode = t === "light" ? "light" : "dark";
    if (window.sbIncognitoActive) mode = "dark";            /* incognito forces dark */
    root.setAttribute("data-theme", mode);
    if (window.sbDB) window.sbDB.set(THEME_KEY, mode);      /* persisted (deviation, §16.3 #2) */
    $$(".theme-btn").forEach(function (b) { b.setAttribute("data-theme-state", mode); });
    $$('[data-theme-chip]').forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-theme-chip") === mode); });
    announceSetting("theme", { mode: mode });
    return mode;
  };
  window.sbGetTheme = function () { return root.getAttribute("data-theme") || "dark"; };

  /* Clay — the seam — is the system's own colour and the default. The rest
     are the visitor's to choose: their desktop, not our brand. */
  var ACCENTS = [
    { id: "default", name: "Clay", a1: "#e0663c", a2: "#ec8a5f" },
    { id: "indigo", name: "Indigo", a1: "#5b7cff", a2: "#c76bff" },
    { id: "rose", name: "Rose", a1: "#ff5d8f", a2: "#ff9d5c" },
    { id: "emerald", name: "Emerald", a1: "#22c58b", a2: "#7de08a" },
    { id: "amber", name: "Amber", a1: "#ff9d3d", a2: "#ffd65c" }
  ];
  /* ── ШОВ, ИДУЩИЙ ПО КРУГУ СУТОК (v62) ────────────────────────────────────
     ПОВОД, дословно от основателя: «accent colors добавляем ещё один,
     который медленно будет переключать все цвета - как цветотерапия. они
     должны переключаться медленно почти незаметно. можно назвать этот режим
     концептуально, гениально и функционально».

     ЧТО ЭТО. Шестая краска, которая не краска, а ХОД. Тон обходит полный
     круг ровно за сутки и привязан к местной полуночи. Скорость — 0.25° в
     минуту: увидеть движение нельзя никак, но в один и тот же час дня
     система выглядит одинаково. Цвет становится часами, которые не читают,
     а узнают. Отсюда и имя — Daylight: не название цвета, а название того,
     чем этот цвет служит.

     ПОЧЕМУ СВЕТЛОТА МЕНЯЕТСЯ ВМЕСТЕ С ТОНОМ, А НЕ ОСТАЁТСЯ ПОСТОЯННОЙ.
     Шов — не украшение: в core.css у него объявлено одно значение — «здесь
     можно действовать, или здесь что-то живое», и он же рисует кольца
     фокуса. Значит он обязан быть виден ВСЕГДА. Измерено: при постоянной
     светлоте 56% контраст к грунту гуляет от 2.78 на синем до 14.17 на
     жёлтом — в пять раз, и на синем шов почти пропадает. Поэтому путь
     проложен так, чтобы держать КОНТРАСТ, а не светлоту: под каждый тон
     светлота подобрана заранее (таблица LIGHT, 24 узла через 15°), и по
     всему кругу контраст остаётся 5.75…5.85 при цели 5.78 — контрасте
     нынешнего Clay. Светлота при этом гуляет от 32.5% до 71%, и это цена,
     которую платит цвет, чтобы шов не исчезал.

     ПОЧЕМУ ЭТО ПОЧТИ НИЧЕГО НЕ СТОИТ. Свойство на корне объявляет
     устаревшим стиль всего документа (это Совет измерил на доке, D-093).
     Здесь оно пишется, только когда изменился ОКРУГЛЁННЫЙ до градуса тон, —
     то есть раз в четыре минуты. Триста шестьдесят записей в сутки: та же
     медленность, которая делает ход незаметным, делает его и бесплатным. */
  var DRIFT_ID = "daylight";
  var LIGHT = [63.5, 55.8, 46, 38.5, 32.5, 34, 35.3, 36, 36.5, 36.3, 36, 35.5,
               35, 43, 55.5, 65.3, 71, 69.5, 67.3, 63.8, 57.5, 60, 61.8, 62.8];
  var DRIFT_SAT = 73;

  function hslHex(h, sPct, lPct) {
    h = ((h % 360) + 360) % 360;
    var sN = sPct / 100, lN = lPct / 100;
    var c = (1 - Math.abs(2 * lN - 1)) * sN;
    var x = c * (1 - Math.abs((h / 60) % 2 - 1));
    var m = lN - c / 2, r, g, b;
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    var to = function (v) { var n = Math.round((v + m) * 255); n = n < 0 ? 0 : (n > 255 ? 255 : n); return (n < 16 ? "0" : "") + n.toString(16); };
    return "#" + to(r) + to(g) + to(b);
  }
  function driftLight(hue) {
    var pos = (((hue % 360) + 360) % 360) / 15;
    var i = Math.floor(pos) % LIGHT.length, j = (i + 1) % LIGHT.length, f = pos - Math.floor(pos);
    return LIGHT[i] + (LIGHT[j] - LIGHT[i]) * f;
  }
  /* Чистая функция наружу: по мигу времени — цвет шва. Вынесена ОТДЕЛЬНО
     именно затем, чтобы закон мог пройти все двадцать четыре часа, не трогая
     системных часов машины. */
  window.sbAccentForTime = function (ms) {
    var d = new Date(typeof ms === "number" ? ms : Date.now());
    var minutes = d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
    var hue = Math.round(minutes / 1440 * 360 * 10) / 10;
    var a1 = hslHex(hue, DRIFT_SAT, driftLight(hue));
    var a2 = hslHex(hue + 28, DRIFT_SAT, Math.min(92, driftLight(hue + 28) + 10));
    return { a1: a1, a2: a2, hue: hue };
  };

  var driftTimer = null, driftLastHue = null;
  function driftTick(force) {
    var now = window.sbAccentForTime();
    var rounded = Math.round(now.hue);
    if (!force && rounded === driftLastHue) return;   /* тот же градус — не трогаем документ */
    driftLastHue = rounded;
    applyAccent(now.a1, now.a2);
  }
  function driftStart() {
    driftStop();
    driftTick(true);
    driftTimer = setInterval(function () { driftTick(false); }, 60000);
  }
  function driftStop() { if (driftTimer) { clearInterval(driftTimer); driftTimer = null; } driftLastHue = null; }
  window.sbAccentDrifting = function () { return !!driftTimer; };

  window.sbGetAccentSwatches = function () {
    var list = ACCENTS.map(function (a) { return { id: a.id, name: a.name, a1: a.a1, a2: a.a2 }; });
    var now = window.sbAccentForTime();
    list.push({ id: DRIFT_ID, name: "Daylight", a1: now.a1, a2: now.a2, drift: true });
    return list;
  };
  window.sbGetCurrentAccent = function () {
    var v = readJSON(ACCENT_KEY, null);
    if (v && v.mode === DRIFT_ID) {
      var now = window.sbAccentForTime();
      return { a1: now.a1, a2: now.a2, mode: DRIFT_ID };
    }
    if (v && v.a1) return { a1: v.a1, a2: v.a2 || deriveSecond(v.a1) };
    return { a1: ACCENTS[0].a1, a2: ACCENTS[0].a2 };
  };

  function hexToRgb(hex) {
    var h = String(hex || "").replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    var n = parseInt(h, 16);
    if (!isFinite(n)) return { r: 91, g: 124, b: 255 };
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var mx = Math.max(r, g, b), mn = Math.min(r, g, b), h = 0, s = 0, l = (mx + mn) / 2, d = mx - mn;
    if (d) {
      s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
      if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0));
      else if (mx === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60;
    }
    return { h: h, s: s, l: l };
  }
  function deriveSecond(hex) {
    var c = hexToRgb(hex), hsl = rgbToHsl(c.r, c.g, c.b);
    return "hsl(" + Math.round((hsl.h + 28) % 360) + "," + Math.round(hsl.s * 100) + "%," + Math.round(clamp(hsl.l * 100 + 10, 0, 92)) + "%)";
  }

  window.sbSetAccent = function (hex, second) {
    /* Ход — не цвет, а режим, и приходит он тем же входом: приложение
       настроек передаёт сюда либо шестнадцатеричный цвет, либо это имя. */
    if (String(hex) === DRIFT_ID) {
      writeJSON(ACCENT_KEY, { mode: DRIFT_ID });
      driftStart();
      var cur = window.sbAccentForTime();
      announceSetting("accent", { a1: cur.a1, a2: cur.a2, mode: DRIFT_ID });
      return { a1: cur.a1, a2: cur.a2, mode: DRIFT_ID };
    }
    driftStop();
    var a1 = String(hex || ACCENTS[0].a1);
    var a2 = second || null;
    if (!a2) {
      for (var i = 0; i < ACCENTS.length; i++) if (ACCENTS[i].a1.toLowerCase() === a1.toLowerCase()) a2 = ACCENTS[i].a2;
    }
    if (!a2) a2 = deriveSecond(a1);
    applyAccent(a1, a2);
    writeJSON(ACCENT_KEY, { a1: a1, a2: a2 });
    announceSetting("accent", { a1: a1, a2: a2 });
    return { a1: a1, a2: a2 };
  };
  function applyAccent(a1, a2) {
    var c = hexToRgb(a1), st = root.style;
    st.setProperty("--accent", a1);
    st.setProperty("--accent-2", a2);
    st.setProperty("--accent-rgb", c.r + "," + c.g + "," + c.b);
    st.setProperty("--accent-soft", "rgba(" + c.r + "," + c.g + "," + c.b + ",.18)");
    st.setProperty("--accent-ring", "rgba(" + c.r + "," + c.g + "," + c.b + ",.55)");
  }

  var MOODS = [
    { id: "studio", name: "Studio" },
    { id: "ocean", name: "Ocean" },
    { id: "aurora", name: "Aurora" },
    { id: "sunset", name: "Sunset" },
    { id: "mono", name: "Mono" }
  ];
  window.sbWallpaperMoods = MOODS.map(function (m) { return { id: m.id, name: m.name }; });
  window.sbGetWallpaperMood = function () { return (window.sbDB && window.sbDB.get(MOOD_KEY)) || "studio"; };
  window.sbSetWallpaperMood = function (id) {
    var valid = MOODS.some(function (m) { return m.id === id; }) ? id : "studio";
    if (valid === "studio") root.removeAttribute("data-wp-mood");
    else root.setAttribute("data-wp-mood", valid);
    if (window.sbDB) window.sbDB.set(MOOD_KEY, valid);
    $$('[data-mood]').forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-mood") === valid); });
    sbBus.emit("mood:change", { id: valid });
    announceSetting("mood", { id: valid });
    return valid;
  };

  /* wallpaper contract stubs — engine dropped (§12); callers must never throw */
  window.sbWallpaperPulse = function (/* x_px, y_px */) { };
  window.sbNoteGlowSet = function (/* slot, x_frac, y_frac, intensity */) { };
  window.sbNoteGlowClear = function (/* slot */) { };
  window.sbIconGlowSet = function () { };
  window.sbIconGlowClear = function () { };

  /* =============================================================== toasts §7 */
  var toastLayer = null;
  function layer() { return toastLayer || (toastLayer = $("#toastLayer")); }

  function dnd() { return window.sbGetControlToggle("dnd"); }

  function buildToast(title, text, iconSvg, extraClass, kind) {
    var t = doc.createElement("div");
    t.className = "toast" + (extraClass ? " " + extraClass : "");
    t.setAttribute("role", "status");
    t.setAttribute("data-kind", kind === "event" ? "event" : "confirm");
    t.setAttribute("data-title", String(title == null ? "" : title));
    t.setAttribute("data-text", String(text == null ? "" : text));
    t.innerHTML =
      '<div class="toast-icon">' + (iconSvg || "") + "</div>" +
      '<div class="toast-body"><div class="toast-title">' + escapeHtml(title) + "</div>" +
      '<div class="toast-text">' + escapeHtml(text) + "</div></div>";
    return t;
  }

  function mountToast(t, ttl) {
    var host = layer();
    if (!host) return null;
    host.appendChild(t);
    requestAnimationFrame(function () { t.classList.add("in"); });
    var kill = function () {
      if (!t.parentNode) return;
      t.classList.remove("in");
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 240);
    };
    t.addEventListener("click", function (ev) {
      if (ev.target && ev.target.closest && ev.target.closest("button.toast-action")) return;
      kill();
    });
    setTimeout(kill, num(ttl, 5800));
    return { el: t, dismiss: kill };
  }

  window.showToast = function (title, text, iconSvg, force, extraClass, kind) {
    if (dnd() && !force) return null;
    return mountToast(buildToast(title, text, iconSvg, extraClass, kind), 5800);
  };

  /* ── ЯВНО ЗАПРОШЕННОЕ ВЫТЕСНЯЕТ САМОСЛУЧИВШЕЕСЯ (v47.1) ────────────────
     На телефоне извещения и подсказка стола живут в одном нижнем углу — и
     когда человек нажал лампочку, извещение оказывалось поверх того, что
     он только что попросил. Правило одно и общее: поверхность, которую
     человек вызвал сам, важнее поверхности, которая пришла сама. Извещения
     уходят своим обычным путём (та же анимация, что по нажатию) — они и
     так живут пять секунд, а подсказка не ждёт. */
  window.sbToastsYield = function () {
    var host = $("#toastLayer");
    if (!host) return 0;
    var list = $$(".toast", host);
    list.forEach(function (t) {
      t.classList.remove("in");
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 240);
    });
    return list.length;
  };

  function showUndoToast(title, text, onUndo) {
    if (dnd()) return null;
    var t = buildToast(title, text, ICONS.window, "toast-undo", "confirm");
    var btn = doc.createElement("button");
    btn.type = "button";
    btn.className = "toast-action";
    btn.textContent = tr("toast.undo");
    t.appendChild(btn);
    var handle = mountToast(t, 5800);
    btn.addEventListener("click", function () {
      try { onUndo(); } catch (e) { if (window.console) console.error(e); }
      if (handle) handle.dismiss();
    });
    return handle;
  }

  /* notification chirp (gated by the Sound toggle; Volume slider sets gain) */
  var audioCtx = null;
  window.SysBaby = window.SysBaby || {};
  window.SysBaby.playNotifSound = function () {
    if (!window.sbGetControlToggle("sound")) return false;
    try {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return false;
      audioCtx = audioCtx || new Ctx();
      var vol = clamp(num(window.sbNotifVolume, 0.6), 0, 1) * 0.22;
      [880, 1320].forEach(function (f, i) {
        var o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = "sine"; o.frequency.value = f;
        g.gain.value = 0.0001;
        o.connect(g); g.connect(audioCtx.destination);
        var t0 = audioCtx.currentTime + i * 0.09;
        g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
        o.start(t0); o.stop(t0 + 0.2);
      });
      return true;
    } catch (e) { return false; }
  };

  /* Volume and brightness were the two settings that lied about being
     settings: both sliders worked for exactly as long as the tab stayed open
     and forgot themselves on reload, and neither had a reader another surface
     could ask. Now both persist through sbDB, both have get/set contracts,
     and both announce — so Pulse and the Control Center stay in step live. */
  var VOLUME_KEY = "sysbaby.sound.volume";
  var BRIGHT_KEY = "sysbaby.display.brightness";

  window.sbNotifVolume = 0.6;
  window.sbGetNotifVolume = function () { return clamp(num(window.sbNotifVolume, 0.6), 0, 1); };
  window.sbSetNotifVolume = function (v) {
    var vol = clamp(num(v, 0.6), 0, 1);
    window.sbNotifVolume = vol;
    if (window.sbDB) window.sbDB.set(VOLUME_KEY, String(vol));
    announceSetting("volume", { value: vol });
    return vol;
  };

  window.sbGetBrightness = function () {
    var raw = window.sbDB ? window.sbDB.get(BRIGHT_KEY) : null;
    /* Number(null) is 0 — an unset brightness must read as FULL, not as a
       28%-dark veil over a fresh profile. Caught by the integration veil law
       on the first run: the law earned its keep the day it was written. */
    if (raw == null || raw === "") return 100;
    return clamp(num(raw, 100), 0, 100);
  };
  window.sbSetBrightness = function (v) {
    var val = clamp(num(v, 100), 0, 100);
    applyBrightness(val);
    if (window.sbDB) window.sbDB.set(BRIGHT_KEY, String(val));
    announceSetting("brightness", { value: val });
    return val;
  };
  function applyBrightness(val) {
    /* 100 → no filter at all: the default costs nothing. */
    if (val >= 100) { doc.body.style.filter = ""; return; }
    doc.body.style.filter = "brightness(" + (0.72 + (val / 100) * 0.34).toFixed(3) + ")";
  }
  window.sbApplyBrightness = applyBrightness;

  /* ============================================================ app registry */
  var apps = Object.create(null);
  var order = [];
  window.SysBaby.apps = apps;
  window.SysBaby.order = order;

  window.registerApp = function (id, def) {
    if (!id || !def) return;
    def.id = id;
    if (!def.size) def.size = { w: 680, h: 520 };
    apps[id] = def;
    if (order.indexOf(id) === -1) order.push(id);
    if (bootReady) { buildDock(); layoutIcons(); }
  };
  /* An application's name is not a constant. Every app may declare an i18n
     block — { ru: {title, label}, ee: {...} } — and these two functions are
     the only place in the shell that decides which one is showing. Anything
     a language does not carry falls back to the app's own declaration, so a
     missing translation shows the English name rather than an id. */
  function tr(k, v) { return window.sbT ? window.sbT(k, v) : k; }

  function appTitle(id) {
    var def = apps[id];
    if (!def) return id;
    var l = (window.sbLang ? window.sbLang() : "en");
    var loc = def.i18n && def.i18n[l];
    return (loc && loc.title) || def.title || id;
  }
  function appLabel(id) {
    var def = apps[id];
    if (!def) return id;
    var l = (window.sbLang ? window.sbLang() : "en");
    var loc = def.i18n && def.i18n[l];
    return (loc && loc.label) || (loc && loc.title) || def.label || def.title || id;
  }
  window.sbAppTitle = appTitle;
  window.sbAppLabel = appLabel;

  function launchable() { return order.filter(function (id) { return apps[id] && !apps[id].hidden; }); }
  window.sbLaunchableApps = launchable;

  var ICONS = {
    window: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v6h6"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m5 13 4 4L19 7"/></svg>'
  };
  window.sbIcons = ICONS;

  function appIconMarkup(id) {
    var def = apps[id];
    if (!def) return "";
    return def.icon || ICONS.window;
  }

  /* app-launch shortcuts (§6.1)
     No `title` here on purpose. The Shortcuts panel used to read a copy of
     the app name kept in this table, which meant the panel stayed in English
     for ever and drifted the day an app was renamed. The name has exactly one
     source — appTitle(id) — so this table carries only the key and how to
     write it. */
  window.sbAppShortcuts = {
    files: { key: "e", label: "⌃E" },
    mail: { key: "i", label: "⌃I" },
    messenger: { key: "m", label: "⌃M" },
    notes: { key: "j", label: "⌃J" },
    search: { key: "g", label: "⌃G" },
    settings: { key: ",", label: "⌃," }
  };

  /* ============================================================ window mgr §3 */
  var openWindows = Object.create(null);
  var openOrder = [];              /* ids in open order (topbar app sequence) */
  var zCounter = 40;
  var cascade = 0;
  var focusedId = null;
  var pendingClose = Object.create(null);
  window.openWindows = openWindows;

  function winLayer() { return $("#windowLayer"); }

  /* Whatever query string the OS was entered with, captured before the address
     bar was cleaned (see the head script in index.html). Nothing else reads
     location.search: the URL is not a state store. */
  function entrySearch() { return window.__sbEntry || ""; }

  function sizeFor(def) {
    var w = num(def.size && def.size.w, 680), h = num(def.size && def.size.h, 520);
    w = Math.min(w, window.innerWidth - 28);
    h = Math.min(h, window.innerHeight - 140);
    return { w: Math.max(340, w), h: Math.max(280, h) };
  }

  function lightsMarkup() {
    return '<div class="lights">' +
      '<button class="light close" type="button" aria-label="' + escapeHtml(tr("win.close")) + '"><svg viewBox="0 0 12 12" stroke="currentColor" stroke-width="1.5" fill="none"><path d="m3.5 3.5 5 5m0-5-5 5"/></svg></button>' +
      '<button class="light min" type="button" aria-label="' + escapeHtml(tr("win.minimize")) + '"><svg viewBox="0 0 12 12" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M3 6h6"/></svg></button>' +
      '<button class="light max" type="button" aria-label="' + escapeHtml(tr("win.maximize")) + '"><svg viewBox="0 0 12 12" stroke="currentColor" stroke-width="1.5" fill="none"><path d="M4.5 7.5 2.5 9.5M2.5 9.5V7M2.5 9.5H5M7.5 4.5 9.5 2.5M9.5 2.5V5M9.5 2.5H7"/></svg></button>' +
      "</div>";
  }

  function createWindow(id) {
    var def = apps[id];
    if (!def) return null;
    var host = winLayer();
    if (!host) return null;

    /* A window opens as a window, on every screen. On a phone the margin is
       smaller and the cascade is gone — there is no room to stagger — but the
       wallpaper still shows around all four edges and the state is genuinely
       "normal", not a maximised sheet wearing a smaller size. Full screen is
       something the visitor asks for. */
    var size = sizeFor(def);
    var w = size.w, h = size.h, x, y, born = { maximized: false };

    if (compact()) {
      var cr = compactRect();
      w = cr.w; h = cr.h; x = cr.x; y = cr.y;
    } else {
      var off = (cascade % 5);
      cascade++;
      x = Math.round((window.innerWidth - w) / 2) + off * 24;
      y = Math.round((window.innerHeight - h) / 2) + off * 18;
      x = Math.max(14, Math.min(x, window.innerWidth - w - 14));
      y = clamp(y, 48, Math.max(48, window.innerHeight - h - 108));
    }

    var el = doc.createElement("section");
    el.className = "window";
    el.setAttribute("data-app", id);
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", appTitle(id));
    el.style.left = x + "px"; el.style.top = y + "px";
    el.style.width = w + "px"; el.style.height = h + "px";
    var sc = window.sbAppShortcuts[id];
    el.innerHTML =
      '<header class="titlebar">' + lightsMarkup() +
      '<div class="win-title"><span class="win-chip" aria-hidden="true">' + appIconMarkup(id) + '</span>' +
      '<span class="win-name">' + escapeHtml(appTitle(id)) + "</span>" +
      (def.brand ? '<span class="win-brand">' + escapeHtml(def.brand) + "</span>" : "") + "</div>" +
      '<div class="tb-right">' + (sc ? '<kbd class="win-kbd">' + escapeHtml(sc.label) + "</kbd>" : "") + "</div>" +
      "</header>" +
      '<div class="window-body"></div>' +
      '<div class="resize-handle" aria-hidden="true"></div>';

    var body = el.querySelector(".window-body");
    body.style.padding = "0";
    body.style.display = "flex";

    var win = {
      id: id, el: el, x: x, y: y, w: w, h: h,
      minimized: false, maximized: born.maximized, snapped: null, prevRect: null, z: ++zCounter
    };
    el.style.zIndex = String(win.z);
    if (born.maximized) el.classList.add("maximized");

    host.appendChild(el);
    openWindows[id] = win;
    if (openOrder.indexOf(id) === -1) openOrder.push(id);

    /* travel from the dock tile (fallback desktop icon, fallback bottom-center) */
    animateOpenFrom(el, id, win);

    wireWindow(win);
    renderApp(id);
    focusWindow(id);
    updateAppSequence();
    buildDock();
    sbBus.emit("window:opened", {
      id: id,
      cx: (win.x + win.w / 2) / Math.max(1, window.innerWidth),
      cy: (win.y + win.h / 2) / Math.max(1, window.innerHeight)
    });
    sbBus.emit("app:open", { app: id });
    return win;
  }

  function tileRectFor(id) {
    var t = $('.dock-item[data-app="' + id + '"]') || $('.desk-icon[data-app="' + id + '"]');
    if (t && t.getBoundingClientRect) {
      var r = t.getBoundingClientRect();
      if (r.width) return r;
    }
    return null;
  }

  function animateOpenFrom(el, id, win) {
    if (reduced() || systemReduced()) { el.style.opacity = "1"; return; }
    var r = tileRectFor(id);
    var fromX, fromY;
    if (r) { fromX = r.left + r.width / 2; fromY = r.top + r.height / 2; }
    else { fromX = window.innerWidth / 2; fromY = window.innerHeight - 40; }
    var cx = win.x + win.w / 2, cy = win.y + win.h / 2;
    el.style.transformOrigin = "center center";
    /* На время полёта окно снимает размытие подложки и объявляет композитору,
       ЧТО ИМЕННО будет меняться. Причина написана в core.css у .window.opening:
       размытие превращает дешёвую анимацию переноса в дорогую, потому что
       подложка под движущимся окном каждый кадр другая. */
    /* ── ОДНА СКОРОСТЬ НА ВСЮ СИСТЕМУ (v52) ───────────────────────────────
     * Повод, дословно от основателя 21.08.2026: «окна приложений медленно
     * открываются и закрываются — так всегда и было, но сейчас всё работает
     * достаточно быстро, и то, что окна медленно закрываются и открываются,
     * очень сильно бросается в глаза».
     *
     * ИЗМЕРЕНО ДО ПРАВКИ, телефон с замедлением вчетверо, от вызова до «окно
     * стоит на месте»: открытие 341 мс (медиана из четырёх), закрытие 227 мс.
     * При этом окно появляется в DOM за 20–60 мс — содержимое готово почти
     * сразу, и все оставшиеся три сотни миллисекунд человек ждёт НЕ систему,
     * а анимацию. Ускорять здесь можно ничего не ломая: ждать нечего.
     *
     * ПОЧЕМУ ИМЕННО ЭТИ ЧИСЛА, а не «покороче». В системе уже есть самое
     * быстрое осознанное движение — морф разворота на весь экран, 130 мс, и
     * на него основатель не жаловался ни разу. Значит мерка своя, а не взятая
     * из чужих рекомендаций. Остальные движения приведены в ту же семью:
     *     открыть   260 → 180 → 120 мс
     *     закрыть   200 → 140 → 100 мс
     *     свернуть  200 → 150 → 110 мс
     *     вернуть   200 → 150 → 110 мс
     *
     * ВТОРОЙ ШАГ (v53), по просьбе основателя «ускорить ещё сильнее». Первый
     * шаг привёл окна в семью морфа (130 мс); второй ставит открытие ВРОВЕНЬ
     * с самым быстрым движением системы и уводит остальные ниже него. Ниже
     * сотни уходить не стали намеренно: движение короче ~100 мс перестаёт
     * читаться как движение и превращается в подмену кадра — окно не
     * прилетает, а возникает, и связь между нажатием и результатом теряется.
     * Это не осторожность, а граница: дальше ускорять уже нечего, дальше
     * можно только убрать анимацию совсем — что и делает reduced motion.
     * Закрытие короче открытия НАМЕРЕННО: вещь, которая уходит, не должна
     * держать внимание дольше, чем вещь, которую позвали.
     *
     * Потолки стережёт tools/window-motion-check.mjs. До сегодня он проверял
     * УСТРОЙСТВО движения — правда состояния мгновенна, в полёте не
     * размывает, после полёта чисто — и ни слова не говорил о длительности:
     * окно могло ехать две секунды, и доска была зелена. */
    el.classList.add("opening");
    el.style.transform = "translate3d(" + Math.round(fromX - cx) + "px," + Math.round(fromY - cy) + "px,0) scale(.94)";
    el.style.opacity = "0";
    requestAnimationFrame(function () {
      el.style.transition = "transform 120ms cubic-bezier(.16,1,.3,1), opacity 100ms ease";
      el.style.transform = "translate3d(0,0,0) scale(1)";
      el.style.opacity = "1";
      setTimeout(function () {
        el.style.transition = "";
        el.style.transform = "";
        el.classList.remove("opening");
      }, 140);
    });
  }

  function renderApp(id) {
    var win = openWindows[id], def = apps[id];
    if (!win || !def) return;
    var name = win.el.querySelector(".win-name");
    if (name) name.textContent = appTitle(id);
    var chip = win.el.querySelector(".win-chip");
    if (chip) chip.innerHTML = appIconMarkup(id);
    if (typeof def.render === "function") {
      try { def.render(win); } catch (e) {
        if (window.console) console.error("[shell] render " + id, e);
        var b = win.el.querySelector(".window-body");
        if (b) b.innerHTML = '<div class="app-fail">' + escapeHtml(tr("win.failed", { app: appTitle(id) })) + "</div>";
      }
    }
  }
  window.renderApp = renderApp;
  window.getOpenWindow = function (id) { return openWindows[id]; };

  function focusWindow(id) {
    var win = openWindows[id];
    if (!win) return;
    win.z = ++zCounter;
    win.el.style.zIndex = String(win.z);
    focusedId = id;
    $$(".window").forEach(function (w) { w.classList.toggle("focused", w === win.el); });
    updateAppSequence();
    buildDock();
    updateTopbarAutoHide();
  }
  window.focusWindow = focusWindow;

  function unfocusAll() {
    focusedId = null;
    $$(".window").forEach(function (w) { w.classList.remove("focused"); });
    updateAppSequence();
    buildDock();
  }

  function highestRemaining() {
    var best = null, bz = -1;
    Object.keys(openWindows).forEach(function (k) {
      var w = openWindows[k];
      if (w.minimized) return;
      if (w.z > bz) { bz = w.z; best = k; }
    });
    return best;
  }

  function rememberClosed(id) {
    var list = readJSON("sysbaby.windows.recent", []);
    if (!Array.isArray(list)) list = [];
    list = list.filter(function (r) { return r && r.id !== id; });
    list.unshift({ id: id, ts: now() });
    writeJSON("sysbaby.windows.recent", list.slice(0, 8));
  }

  function closeWindow(id) {
    var win = openWindows[id];
    if (!win) return;
    sbBus.emit("window:closed", { id: id });
    var def = apps[id] || {};
    delete openWindows[id];
    openOrder = openOrder.filter(function (o) { return o !== id; });
    rememberClosed(id);

    var el = win.el;
    el.classList.add("closing", "traveling");
    if (!reduced() && !systemReduced()) {
      el.style.transition = "transform 100ms cubic-bezier(.16,1,.3,1), opacity 80ms ease";
      el.style.transform = "scale(.96)";
      el.style.opacity = "0";
    }
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 110);

    if (focusedId === id) {
      var next = highestRemaining();
      focusedId = null;
      if (next) focusWindow(next); else { updateAppSequence(); buildDock(); }
    } else { updateAppSequence(); buildDock(); }
    updateTopbarAutoHide();

    /* 6 s undo window — the element stays alive, detached */
    pendingClose[id] = { win: win, at: now() };
    var timer = setTimeout(function () {
      if (pendingClose[id] && pendingClose[id].win === win) delete pendingClose[id];
    }, 6000);

    showUndoToast(tr("toast.closed", { app: appTitle(id) }), tr("toast.closedBody"), function () {
      clearTimeout(timer);
      var pend = pendingClose[id];
      if (!pend || pend.win !== win) return;
      delete pendingClose[id];
      var host = winLayer();
      if (!host) return;
      el.classList.remove("closing");
      el.style.transition = "";
      el.style.transform = "";
      el.style.opacity = "1";
      host.appendChild(el);
      openWindows[id] = win;
      if (openOrder.indexOf(id) === -1) openOrder.push(id);
      focusWindow(id);
      buildDock();
      updateAppSequence();
    });
  }
  window.closeWindow = closeWindow;
  window.sbCloseWindow = closeWindow;

  function minimizeWindow(id) {
    var win = openWindows[id];
    if (!win || win.minimized) return;
    win.minimized = true;
    var el = win.el, r = tileRectFor(id);
    if (!reduced() && !systemReduced() && r) {
      var cx = win.x + win.w / 2, cy = win.y + win.h / 2;
      /* traveling: на время полёта окно не размывает (см. core.css). Правило
         родилось у открытия и законом window-motion-check распространено на
         все пути: счёт композитору один и тот же, где бы окно ни летело. */
      el.classList.add("traveling");
      el.style.transition = "transform 110ms cubic-bezier(.16,1,.3,1), opacity 90ms ease";
      el.style.transformOrigin = "center center";
      el.style.transform = "translate3d(" + Math.round(r.left + r.width / 2 - cx) + "px," + Math.round(r.top + r.height / 2 - cy) + "px,0) scale(.12)";
      el.style.opacity = "0";
      setTimeout(function () { dockCatch(id); }, 80);
    }
    setTimeout(function () { el.classList.add("minimized"); el.style.transition = ""; el.classList.remove("traveling"); }, 120);
    if (focusedId === id) {
      var next = highestRemaining();
      focusedId = null;
      if (next) focusWindow(next); else { updateAppSequence(); buildDock(); }
    } else { updateAppSequence(); buildDock(); }
    updateTopbarAutoHide();
  }

  function restoreWindow(id) {
    var win = openWindows[id];
    if (!win || !win.minimized) return;
    win.minimized = false;
    var el = win.el;
    el.classList.remove("minimized");
    if (!reduced() && !systemReduced()) {
      el.classList.add("traveling");
      requestAnimationFrame(function () {
        el.style.transition = "transform 110ms cubic-bezier(.16,1,.3,1), opacity 90ms ease";
        el.style.transform = "translate3d(0,0,0) scale(1)";
        el.style.opacity = "1";
        /* После полёта — ни следа: transition, transform и traveling
           снимаются все разом. Оставленный identity-transform выглядит
           безобидно, но создаёт содержащий блок для fixed-потомков и
           лишний слой композитора — закон ловит это как «не чисто». */
        setTimeout(function () {
          el.style.transition = "";
          el.style.transform = "";
          el.classList.remove("traveling");
        }, 130);
      });
    } else { el.style.transform = ""; el.style.opacity = "1"; }
    dockRelease(id);
    focusWindow(id);
    updateTopbarAutoHide();
  }
  window.sbMinimizeWindow = minimizeWindow;
  /* Публичная дверь назначается НИЖЕ, одна на оба смысла «вернуть» — см.
     комментарий у второго restoreWindow2: здесь была коллизия имён. */

  /* ── ОДИН ЗАСЛОН НА ВСЕ ПУТИ (v47) ─────────────────────────────────────
   *
   * Один и тот же дефект основатель нашёл ТРИЖДЫ: окно оказывалось верхним
   * краем под системной полосой, и его собственные клавиши — закрыть,
   * свернуть, развернуть — прятались за ней. Каждый раз Совет чинил тот путь,
   * которым дефект пришёл: сначала кнопку максимизации, потом перетаскивание
   * к кромке. На третий раз он пришёл через восстановление окна после
   * перезапуска браузера.
   *
   * Значит чинить надо не путь, а МЕСТО, ЧЕРЕЗ КОТОРОЕ ПРОХОДЯТ ВСЕ ПУТИ.
   * Оно здесь: любое перемещение и любой размер окна проходят через applyRect.
   * Правило одно и без исключений: верх окна не бывает выше системной полосы —
   * кроме полного экрана, где полоса убирается сама и уступает место.
   *
   * Это дороже трёх точечных правок ровно ничем, а закрывает и четвёртый путь,
   * которого мы ещё не встретили.
   */
  /* ── МОРФ ПРЯМОУГОЛЬНИКА ЖИВЁТ В ЕДИНСТВЕННОЙ ДВЕРИ (v47.2) ────────────
   *
   * applyRect и раньше умел анимировать — переходом left/top/width/height за
   * 130 мс. Движение было, но оплачивалось ПЕРЕСЧЁТОМ РАСКЛАДКИ на каждом
   * кадре: четыре самых дорогих свойства из существующих, и на каждом кадре
   * содержимое окна перекладывалось заново. Директива основателя требует
   * одновременно характера движения и «performance first» — здесь это одно
   * и то же исправление.
   *
   * Приём FLIP: конечный прямоугольник ставится СРАЗУ (правда состояния
   * мгновенна — законы геометрии видят готовое окно, не полёт), содержимое
   * перекладывается один раз, а видимый путь рисует transform от старого
   * прямоугольника к новому — чистый композитор. Класс traveling на время
   * полёта снимает размытие подложки (core.css, то же правило, что у
   * открытия и сворачивания).
   *
   * Команда посреди прошлого полёта стартует с ТЕКУЩЕГО видимого положения:
   * getBoundingClientRect учитывает transform, морф продолжается оттуда,
   * где его видит человек, без рывка. Длительность оставлена прежней —
   * 130 мс тем же ходом (.16,1,.3,1): тайминг был выбран верно, менялась
   * только цена. */
  function applyRect(win, rect, animate) {
    var el = win.el;
    var fly = animate && !reduced() && !systemReduced();
    var r0 = fly ? el.getBoundingClientRect() : null;
    var y = Math.round(rect.y);
    var h = Math.round(rect.h);
    if (!el.classList.contains("fullscreen") && y < TOPBAR_H) {
      /* Высоту укорачиваем на то же, на что опустили верх: иначе окно, сдвинутое
         вниз, вылезет нижним краем за экран — починили бы одно, сломали другое. */
      h = Math.max(160, h - (TOPBAR_H - y));
      y = TOPBAR_H;
    }
    win.x = Math.round(rect.x); win.y = y;
    win.w = Math.round(rect.w); win.h = h;
    el.style.transition = "";
    el.style.transform = "";
    el.style.left = win.x + "px"; el.style.top = win.y + "px";
    el.style.width = win.w + "px"; el.style.height = win.h + "px";
    if (!fly || !r0 || !r0.width) return;
    var r1 = el.getBoundingClientRect();
    if (!r1.width || !r1.height) return;
    var dx = r0.left - r1.left, dy = r0.top - r1.top;
    var sx = r0.width / r1.width, sy = r0.height / r1.height;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1 && Math.abs(sx - 1) < 0.01 && Math.abs(sy - 1) < 0.01) return;
    el.classList.add("traveling");
    el.style.transformOrigin = "0 0";
    el.style.transform = "translate3d(" + dx + "px," + dy + "px,0) scale(" + sx + "," + sy + ")";
    void el.offsetWidth;                       /* стартовый кадр зафиксирован */
    el.style.transition = "transform 130ms cubic-bezier(.16,1,.3,1)";
    el.style.transform = "translate3d(0,0,0) scale(1)";
    clearTimeout(win.__flyTimer);
    win.__flyTimer = setTimeout(function () {
      el.style.transition = "";
      el.style.transform = "";
      el.style.transformOrigin = "";
      el.classList.remove("traveling");
    }, 170);
  }
  window.sbPlaceWindow = function (id, rect) {
    var win = openWindows[id];
    if (!win || !rect) return false;
    if (compact()) return false;
    win.maximized = false; win.snapped = null;
    win.el.classList.remove("maximized", "snapped", "fullscreen");
    root.classList.remove("sb-fullscreen-window");
    applyRect(win, { x: num(rect.left, win.x), y: num(rect.top, win.y), w: num(rect.w, win.w), h: num(rect.h, win.h) }, true);
    return true;
  };
  window.sbGetWindowRects = function () {
    return openOrder.filter(function (id) { return openWindows[id]; }).map(function (id) {
      var w = openWindows[id];
      return { id: id, left: w.x, top: w.y, w: w.w, h: w.h };
    });
  };

  /* The system bar's height. Maximize is measured against it rather than
     against the viewport, so it has to be a number this file agrees on. */
  var TOPBAR_H = 44;

  /* ── ПРЯМОУГОЛЬНИК КОМПАКТНОГО ОКНА: МЕЖДУ ПАНЕЛЬЮ И ПОЛКОЙ (v48) ───────
   *
   * Две правды основателя, снятые с одного экрана:
   *   · «Должно быть место под док ОС» — окно на телефоне заканчивается НАД
   *     полкой, а не под ней: полка отвечает «что открыто» и не смеет ни
   *     исчезать (D-069), ни лежать поверх содержимого. Высота полки — не
   *     константа: shell публикует её в --dock-h, отсюда и читаем.
   *   · «все окна открываются полноценно, но почему-то otsing вот так» —
   *     окно Seek рождалось при ВЫЕХАВШЕЙ КЛАВИАТУРЕ: поле ввода в фокусе,
   *     innerHeight на телефоне в этот момент вдвое меньше, и высота
   *     запекалась навсегда. Клавиатура уезжала — окно оставалось огрызком.
   *     Лечение не «не открывать при клавиатуре», а честнее: компактные
   *     окна СЛЕДЯТ за прямоугольником (onCompactResize) и подгоняются под
   *     каждый его настоящий размер — клавиатура, поворот, адресная строка.
   */
  function dockAllowance() {
    /* ДВА урока в одной константе (v48):
       · без оглядки на dock-empty — окно, которое сейчас рождается, само и
         выведет полку; первая редакция смотрела на класс, и первое окно
         занимало весь низ, а полка выезжала поверх (поймал smoke-shell);
       · без живого чтения --dock-h — измеренная высота полки дышит на
         ±12px (значок пришёл, подпись мигнула), и окна ездили за этим
         дребезгом. На узком экране полка фиксирована правилами §14
         core.css (плитка 38 + поля 6), итого 62 — берём её как константу
         той же природы, что TOPBAR_H, плюс 22 воздуха. */
    return 84;
  }
  function compactRect() {
    return {
      x: 0, y: TOPBAR_H,
      w: window.innerWidth,
      h: Math.max(220, window.innerHeight - TOPBAR_H - dockAllowance())
    };
  }
  /* Отдельного слушателя resize здесь НЕТ намеренно: подгонкой окон под
     новый экран давно занимается общий обработчик ниже (§ «viewport
     resize»), и вторая подписка на то же событие дала бы две правды об
     одном окне. Первая редакция v48 наступила ровно на это — окна после
     resize отличались на 8px от рождённых. Он же и учит компактные окна
     compactRect-у. */

  function toggleMaximize(id) {
    var win = openWindows[id];
    if (!win) return;
    if (win.maximized) {
      if (win.el.classList.contains("fullscreen")) {
        win.el.classList.remove("fullscreen");
        root.classList.remove("sb-fullscreen-window");
        updateTopbarAutoHide();
        return;
      }
      win.maximized = false;
      win.el.classList.remove("maximized");
      if (win.prevRect) applyRect(win, win.prevRect, true);
    } else {
      win.prevRect = { x: win.x, y: win.y, w: win.w, h: win.h };
      win.maximized = true; win.snapped = null;
      win.el.classList.add("maximized");
      win.el.classList.remove("snapped");
      /* WHY y = TOPBAR_H AND NOT 0
         A maximized window used to be placed at the very top of the viewport,
         directly underneath the system bar — which is fixed at z-index 60
         while the window layer is 20. The titlebar was never removed and was
         never clipped: it was covered. On a desktop the bar auto-hid, so the
         controls reappeared and the bug looked fixed; on a phone the bar does
         not auto-hide, so the close, minimise and maximise keys sat behind it
         permanently.

         Maximised therefore means "fills the desktop", not "fills the screen".
         The window's own controls are then visible in every viewport whether
         the bar is showing or not, and they no longer depend on hiding a
         different piece of chrome to be reachable. Filling the screen is what
         the second press does, and that state hides the bar outright. */
      applyRect(win, maximizedRect(), true);
    }
    updateTopbarAutoHide();
  }
  window.sbToggleMaximize = toggleMaximize;
  /* Ручка для приборов: даёт закону поставить окно ровно в то состояние, в
     которое его ставит перетаскивание к кромке, — не воспроизводя жест.
     Проверяется РЕЗУЛЬТАТ, а не имитация пальца. */
  window.sbSnapForTest = function (id, zone) {
    var win = openWindows[id];
    if (!win) return false;
    var r = snapRect(zone);
    if (!r) return false;
    win.prevRect = { x: win.x, y: win.y, w: win.w, h: win.h };
    if (zone === "max") { win.maximized = true; win.snapped = null; win.el.classList.add("maximized"); }
    else { win.snapped = zone; win.maximized = false; win.el.classList.add("snapped"); }
    applyRect(win, r, false);
    updateTopbarAutoHide();
    return true;
  };
  /* ── ОДНА ДВЕРЬ НА ОБА СМЫСЛА «ВЕРНУТЬ» (v47.2) ────────────────────────
     window.sbRestoreWindow присваивался ДВАЖДЫ: выше — возврат из
     свёрнутого, здесь — выход из развёрнутого. Второе присваивание молча
     затирало первое, и публичная дверь никогда не возвращала свёрнутое
     окно. Нашёл window-motion-check: команда уходила, состояние не
     менялось. Теперь дверь одна и решает по состоянию: свёрнутое сперва
     возвращается на стол — и только следующий вызов снимает развёрнутость.
     Один вызов — один шаг назад, как и жмёт человек. */
  window.sbRestoreWindow = function (id) {
    var win = openWindows[id];
    if (!win) return;
    if (win.minimized) return restoreWindow(id);
    return restoreWindow2(id);
  };

  /* Out of fullscreen and out of maximised in one press, back to the size and
     place the window had before any of it. */
  function restoreWindow2(id) {
    var win = openWindows[id];
    if (!win) return;
    win.el.classList.remove("fullscreen");
    root.classList.remove("sb-fullscreen-window");
    if (win.maximized) {
      win.maximized = false;
      win.el.classList.remove("maximized");
      if (win.prevRect) applyRect(win, win.prevRect, true);
    }
    updateTopbarAutoHide();
  }

  function enterFullscreen(id) {
    var win = openWindows[id];
    if (!win || !win.maximized) return false;
    win.el.classList.add("fullscreen");   /* CSS only — never the Fullscreen API */
    root.classList.add("sb-fullscreen-window");
    updateTopbarAutoHide();
    return true;
  }
  function anyFullscreen() { return !!$(".window.fullscreen"); }
  function exitFullscreen() {
    var el = $(".window.fullscreen");
    if (!el) return false;
    el.classList.remove("fullscreen");
    return true;
  }

  /* ---- snap zones + ghost ---- */
  /* ОДНА ГЕОМЕТРИЯ МАКСИМИЗАЦИИ НА ВСЕ ПУТИ (v47).
     Дефект нашёл основатель на телефоне: окно, поднесённое к верхней кромке,
     раскрывалось на весь экран — и теряло собственные клавиши закрыть,
     свернуть, развернуть. Причина не в вёрстке: к одному состоянию вели ДВА
     пути, кнопкой и перетаскиванием, и починен был только первый. У кнопки в
     v21 уже стояло «максимизировано — значит заполняет РАБОЧИЙ СТОЛ, а не
     экран», с отступом под верхнюю панель и объяснением на двадцать строк;
     snapRect("max") продолжал возвращать y:0, и панель накрывала клавиши.
     Расхождение двух путей к одному состоянию — тот же класс ошибки, что
     когда-то дал два скрипта выкладки. Теперь прямоугольник считает одна
     функция, и разойтись им негде. */
  function maximizedRect() {
    return {
      x: 0, y: TOPBAR_H,
      w: window.innerWidth,
      h: Math.max(160, window.innerHeight - TOPBAR_H)
    };
  }

  function snapRect(zone) {
    var vw = window.innerWidth, vh = window.innerHeight, m = 14, top = 44;
    var halfW = (vw - 28) / 2 - 5, fullH = vh - top - m, halfH = fullH / 2 - 5;
    switch (zone) {
      case "max": return maximizedRect();
      case "left": return { x: m, y: top, w: halfW, h: fullH };
      case "right": return { x: vw - m - halfW, y: top, w: halfW, h: fullH };
      case "tl": return { x: m, y: top, w: halfW, h: halfH };
      case "tr": return { x: vw - m - halfW, y: top, w: halfW, h: halfH };
      case "bl": return { x: m, y: top + halfH + 10, w: halfW, h: halfH };
      case "br": return { x: vw - m - halfW, y: top + halfH + 10, w: halfW, h: halfH };
      default: return null;
    }
  }
  function zoneFor(px, py) {
    var vw = window.innerWidth, edgeL = px < 24, edgeR = px > vw - 24, edgeT = py < 46;
    if (edgeT && edgeL) return "tl";
    if (edgeT && edgeR) return "tr";
    if (edgeT) return "max";
    if (edgeL) return py > window.innerHeight - 120 ? "bl" : "left";
    if (edgeR) return py > window.innerHeight - 120 ? "br" : "right";
    return null;
  }
  var ghostEl = null;
  function ghost() { return ghostEl || (ghostEl = $("#sbSnapGhost")); }
  function showGhost(zone) {
    var g = ghost(), r = snapRect(zone);
    if (!g || !r) return;
    if (!g.classList.contains("on")) {
      g.style.left = r.x + "px"; g.style.top = r.y + "px";
      g.style.width = r.w + "px"; g.style.height = r.h + "px";
      g.classList.add("on");
    } else {
      g.style.left = r.x + "px"; g.style.top = r.y + "px";
      g.style.width = r.w + "px"; g.style.height = r.h + "px";
    }
  }
  function hideGhost() { var g = ghost(); if (g) g.classList.remove("on"); }

  function wireWindow(win) {
    var el = win.el, id = win.id;
    el.addEventListener("pointerdown", function () { if (focusedId !== id) focusWindow(id); }, true);

    var tb = el.querySelector(".titlebar");
    el.querySelector(".light.close").addEventListener("click", function (e) { e.stopPropagation(); closeWindow(id); });
    el.querySelector(".light.min").addEventListener("click", function (e) { e.stopPropagation(); minimizeWindow(id); });
    el.querySelector(".light.max").addEventListener("click", function (e) {
      e.stopPropagation();
      /* THREE STATES, ONE DIRECTION: normal -> maximised -> fullscreen -> normal.
         The old rule was `maximised ? fullscreen : toggle`, which meant
         fullscreen fell back to maximised and maximised went to fullscreen —
         a two-state loop with no way out. Once a window was maximised this
         key could never restore it again, which is half of what the control
         is for. */
      if (el.classList.contains("fullscreen")) restoreWindow2(id);
      else if (win.maximized) enterFullscreen(id);
      else toggleMaximize(id);
    });
    tb.addEventListener("dblclick", function (e) {
      if (e.target && e.target.closest(".light")) return;
      toggleMaximize(id);
    });

    /* drag */
    var drag = null;
    tb.addEventListener("pointerdown", function (ev) {
      if (ev.button !== 0) return;
      if (ev.target && ev.target.closest(".light")) return;
      if (win.maximized) return;
      drag = { sx: ev.clientX, sy: ev.clientY, ox: win.x, oy: win.y, dx: 0, dy: 0, zone: null, raf: 0, moved: false };
      try { tb.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
      root.classList.add("dragging");
    });
    tb.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      drag.dx = ev.clientX - drag.sx; drag.dy = ev.clientY - drag.sy;
      if (Math.abs(drag.dx) + Math.abs(drag.dy) > 3) drag.moved = true;
      if (win.snapped && drag.moved) { win.snapped = null; el.classList.remove("snapped"); }
      var z = zoneFor(ev.clientX, ev.clientY);
      if (z !== drag.zone) { drag.zone = z; if (z) showGhost(z); else hideGhost(); }
      if (!drag.raf) {
        drag.raf = requestAnimationFrame(function () {
          drag.raf = 0;
          if (!drag) return;
          el.style.transform = "translate(" + drag.dx + "px," + drag.dy + "px)";
        });
      }
    });
    function endDrag(ev) {
      if (!drag) return;
      var d = drag; drag = null;
      root.classList.remove("dragging");
      el.style.transform = "";
      hideGhost();
      if (d.raf) cancelAnimationFrame(d.raf);
      if (d.zone) {
        var r = snapRect(d.zone);
        if (d.zone === "max") {
          win.prevRect = { x: d.ox, y: d.oy, w: win.w, h: win.h };
          win.maximized = true; win.snapped = null;
          el.classList.add("maximized"); el.classList.remove("snapped");
        } else {
          win.prevRect = { x: d.ox, y: d.oy, w: win.w, h: win.h };
          win.snapped = d.zone; win.maximized = false;
          el.classList.add("snapped"); el.classList.remove("maximized");
        }
        applyRect(win, r, true);
        updateTopbarAutoHide();
        return;
      }
      var nx = d.ox + d.dx, ny = d.oy + d.dy;
      nx = clamp(nx, -(win.w - 160), window.innerWidth - 160);
      ny = clamp(ny, 44, Math.max(44, window.innerHeight - 40));
      applyRect(win, { x: nx, y: ny, w: win.w, h: win.h }, false);
      if (ev) { /* pointer released */ }
    }
    tb.addEventListener("pointerup", endDrag);
    tb.addEventListener("pointercancel", endDrag);

    /* resize */
    var handle = el.querySelector(".resize-handle"), rs = null;
    handle.addEventListener("pointerdown", function (ev) {
      if (win.maximized) return;
      ev.preventDefault();
      rs = { sx: ev.clientX, sy: ev.clientY, w: win.w, h: win.h };
      try { handle.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
      root.classList.add("dragging");
    });
    handle.addEventListener("pointermove", function (ev) {
      if (!rs) return;
      var w = clamp(rs.w + (ev.clientX - rs.sx), 360, window.innerWidth - 32);
      var h = clamp(rs.h + (ev.clientY - rs.sy), 300, window.innerHeight - 80);
      applyRect(win, { x: win.x, y: win.y, w: w, h: h }, false);
    });
    function endResize() { if (!rs) return; rs = null; root.classList.remove("dragging"); }
    handle.addEventListener("pointerup", endResize);
    handle.addEventListener("pointercancel", endResize);
  }

  /* Публичный вход для приложений, которым нужно открыть окно самим.
     Появился ради build (D-054): он открывается автоматически при первом
     входе, и делать это через внутреннюю функцию оболочки он не может. */
  window.sbOpenApp = function (id) { return toggleApp(id); };

  /* ── СЛЕДЫ ВЫДЕЛЕНИЯ НА СЕНСОРНОМ ЭКРАНЕ (v47) ─────────────────────────
   *
   * Основатель просил об этом несколько раз, и Совет несколько раз чинил не
   * то: подсветку нажатия, запрет выделения на значках, прозрачный tap-highlight.
   * Всё это уже стояло — а оранжевые чёрточки и точки оставались.
   *
   * Что происходит на самом деле. Палец на сенсорном экране начинает выделение
   * там, где оно разрешено (внутри окон текст выделять НУЖНО — его копируют), и
   * бросает его недоведённым. Браузер оставляет прямоугольники брошенного
   * выделения, а наше правило ::selection красит их акцентом — отсюда и
   * оранжевый. Выделения при этом «не работает» ровно в том смысле, в каком
   * его описал основатель: скопировать нечего, а следы есть.
   *
   * Правило: на сенсорном вводе брошенное выделение снимается, как только
   * палец отпущен, — КРОМЕ случая, когда человек работает в поле ввода или в
   * тексте, который он правит. Там выделение осмысленно, и трогать его нельзя.
   * Мышь не затронута вовсе: на ней выделение доводят до конца.
   */
  (function clearStrayTouchSelection() {
    var inEditable = function (n) {
      return !!(n && n.closest && n.closest('input, textarea, [contenteditable="true"], .note-text'));
    };
    doc.addEventListener("touchend", function (ev) {
      if (inEditable(ev.target)) return;
      var sel = window.getSelection && window.getSelection();
      if (!sel || sel.isCollapsed) return;
      /* Выделение, доведённое до конца, человек оставляет намеренно — но на
         сенсорном экране его подтверждает системное меню «копировать», а не
         факт наличия. Через кадр после отпускания брошенное снимается. */
      requestAnimationFrame(function () {
        var s2 = window.getSelection && window.getSelection();
        if (!s2 || s2.isCollapsed) return;
        if (inEditable(doc.activeElement)) return;
        try { s2.removeAllRanges(); } catch (e) { /* некоторые движки запрещают */ }
      });
    }, { passive: true });
  }());

  function toggleApp(id) {
    var def = apps[id];
    if (!def) return;
    if (typeof def.onOpen === "function") { try { def.onOpen(); } catch (e) { if (window.console) console.error(e); } }
    var win = openWindows[id];
    if (win) {
      if (win.minimized) restoreWindow(id);
      else focusWindow(id);
      return win;
    }
    var created = createWindow(id);
    dockBounce(id);
    return created;
  }
  window.toggleApp = toggleApp;

  /* viewport resize (150 ms debounce, keyboard heuristic) */
  var lastH = window.innerHeight, resizeTimer = null;
  window.addEventListener("resize", function () {
    applyFlags();
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      var shrank = lastH - window.innerHeight;
      var ae = doc.activeElement;
      var typing = ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable);
      lastH = window.innerHeight;
      if (shrank > 80 && typing) return;         /* on-screen keyboard: do not reflow */
      Object.keys(openWindows).forEach(function (id) {
        var w = openWindows[id];
        if (compact() && w.maximized) {
          applyRect(w, { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight }, false);
        } else if (compact()) {
          /* v48: компактное окно живёт в ОДНОМ прямоугольнике — compactRect
             (между панелью и полкой, D-069). Здесь стояла своя геометрия с
             полями 10/16 — вторая правда о том же окне: она дралась с
             прямоугольником рождения, и окно после resize становилось на
             8px другим. Правды не соревнуются — правда одна. */
          if (!w.el.classList.contains("fullscreen")) applyRect(w, compactRect(), false);
        } else if (w.maximized) {
          applyRect(w, { x: 0, y: 0, w: window.innerWidth, h: window.innerHeight }, false);
        } else if (w.snapped) {
          applyRect(w, snapRect(w.snapped), false);
        } else {
          applyRect(w, {
            x: clamp(w.x, -(w.w - 160), Math.max(14, window.innerWidth - 160)),
            y: clamp(w.y, 44, Math.max(44, window.innerHeight - 40)),
            w: Math.min(w.w, window.innerWidth - 28), h: Math.min(w.h, window.innerHeight - 60)
          }, false);
        }
      });
      layoutIcons();
    }, 150);
  });

  /* topbar auto-hide while a window is maximized (desktop only) */
  var peekTimer = null;
  function updateTopbarAutoHide() {
    var bar = $("#topbar");
    if (!bar) return;
    /* Only fullscreen hides the bar. Maximised windows now sit below it, so
       hiding it there would open a 44px strip of wallpaper above the window —
       and, worse, would make the window's controls depend on the bar's state
       to be visible at all. `compact()` is no longer part of this decision:
       the old rule kept the bar on phones, which is exactly where the covered
       controls were reported. */
    var full = Object.keys(openWindows).some(function (id) {
      var w = openWindows[id];
      return !w.minimized && w.el && w.el.classList.contains("fullscreen");
    });
    root.classList.toggle("topbar-hidden", full);
  }
  doc.addEventListener("pointermove", function (ev) {
    if (!root.classList.contains("topbar-hidden")) return;
    /* Peeking the bar back would lay it over the fullscreen window's own
       controls — the very thing this pass exists to stop. */
    if (root.classList.contains("sb-fullscreen-window")) return;
    if (ev.clientY <= 6) {
      root.classList.add("topbar-peek");
      if (peekTimer) clearTimeout(peekTimer);
      peekTimer = setTimeout(function () { root.classList.remove("topbar-peek"); }, 1800);
    }
  });

  /* topbar app sequence (§5) */
  function updateAppSequence() {
    /* КРУГЛАЯ КНОПКА ПРИНАДЛЕЖИТ РАБОЧЕМУ СТОЛУ, А НЕ ЭКРАНУ (v47).
       Она висела поверх любого окна: основатель увидел её поверх витрины на
       телефоне. Быстрое действие над столом, накрывающее содержимое окна, —
       это не быстрое действие, а помеха. Когда открыто хотя бы одно окно, она
       уходит; закрылось последнее — возвращается. Класс общий, чтобы то же
       правило можно было применить к другим деталям стола, не переписывая
       каждую по отдельности. */
    var anyOpen = Object.keys(openWindows).some(function (id) {
      var w = openWindows[id];
      return w && !w.minimized;
    });
    root.classList.toggle("has-windows", anyOpen);

    /* ЗНАЧКИ СТОЛА — ЭТО ДОК ТЕЛЕФОНА (v47).
       Основатель написал дважды: свёрнутые окна нигде не отображаются. Первый
       раз Совет поставил метку в док — и она не помогла, потому что НА
       ТЕЛЕФОНЕ ДОКА НЕТ ВООБЩЕ: ниже 620px он не показывается (core.css §14).
       Свёрнутое окно исчезало без следа и без пути назад.
       Значки рабочего стола видны всегда и на всех ширинах, и нажатие на них
       уже возвращает свёрнутое окно (toggleApp). Не хватало ровно одного —
       чтобы по значку было видно состояние. Те же три ответа, что и в доке:
       нет точки — закрыто, точка полная — окно на экране, полая — свёрнуто. */
    $$("#sbIconLayer .desk-icon[data-app]").forEach(function (n) {
      var w = openWindows[n.getAttribute("data-app")];
      n.classList.toggle("running", !!w);
      n.classList.toggle("is-min", !!(w && w.minimized));
      n.classList.toggle("active-app", focusedId === n.getAttribute("data-app"));
    });

    var host = $("#sbAppSeq");
    if (!host) return;
    host.innerHTML = "";
    openOrder.forEach(function (id) {
      var win = openWindows[id], def = apps[id];
      if (!win || !def) return;
      var b = doc.createElement("button");
      b.type = "button";
      b.className = "seq-item" + (focusedId === id ? " active" : "") + (win.minimized ? " dim" : "");
      b.setAttribute("data-app", id);
      b.title = appTitle(id);
      b.innerHTML = '<span class="seq-tile" aria-hidden="true">' + appIconMarkup(id) + '</span>' +
        (focusedId === id ? '<span class="seq-name">' + escapeHtml(appTitle(id)) + "</span>" : "");
      b.addEventListener("click", function () { toggleApp(id); });
      host.appendChild(b);
    });
  }
  window.sbUpdateAppSequence = updateAppSequence;

  /* Names live in three places at once — dock, desktop, top bar — and a
     language change has to reach all three or the desktop ends up bilingual
     with itself. */
  sbBus.on("translate:done", function () {
    buildDock();
    buildIcons();
    layoutIcons();
    updateAppSequence();
    Object.keys(openWindows).forEach(function (id) {
      var w = openWindows[id];
      var n = w.el.querySelector(".win-name");
      if (n) n.textContent = appTitle(id);
      w.el.setAttribute("aria-label", appTitle(id));

      /* A window's TITLE following the language while its CONTENTS stay in
         the old one is worse than not translating at all — it looks like the
         translation half-failed. So an app can ask to be redrawn.

         Opt-in rather than automatic, and deliberately so: a blanket redraw
         would throw away whatever the visitor had typed into a note, a
         message or the order form. Apps that only display things opt in;
         apps holding unsaved input translate their own chrome instead. */
      var def = apps[id];
      if (def && def.retranslate && typeof def.render === "function") {
        try { def.render(w); }
        catch (err) { console.error("[shell] retranslate failed for " + id, err); }
      }
    });
  });

  /* ================================================================ dock §4.1 */
  var dockArmed = false, dockHideTimer = null;

  function buildDock() {
    var host = $("#dockInner");
    if (!host) return;
    var ids = launchable();
    var existing = Object.create(null);
    $$(".dock-item[data-app]", host).forEach(function (n) { existing[n.getAttribute("data-app")] = n; });

    ids.forEach(function (id) {
      var def = apps[id], node = existing[id];
      if (!node) {
        node = doc.createElement("button");
        node.type = "button";
        node.className = "dock-item";
        node.setAttribute("data-app", id);
        node.setAttribute("aria-label", tr("win.openApp", { app: appTitle(id) }));
        node.innerHTML = '<span class="dock-tile">' + appIconMarkup(id) + "</span>" +
          '<span class="dock-dot"></span><span class="dock-badge" hidden></span>';
        node.addEventListener("click", function () { toggleApp(id); });
        host.appendChild(node);
      }
      delete existing[id];
      node.setAttribute("aria-label", tr("win.openApp", { app: appTitle(id) }));
      var win = openWindows[id];
      node.classList.toggle("running", !!win);
      /* ТРИ СОСТОЯНИЯ, А НЕ ДВА (v47). Основатель: «когда сворачиваешь окна —
         не понятно, какие активные, а какие закрытые». Точка под значком
         говорила только «открыто», и свёрнутое окно выглядело как закрытое
         приложение. Теперь: точки нет — закрыто; точка полная — окно на
         экране; точка полая — окно свёрнуто и ждёт. Одно и то же место,
         три разных ответа, ни одного лишнего значка. */
      node.classList.toggle("is-min", !!(win && win.minimized));
      node.classList.toggle("active-app", focusedId === id);
      node.title = appTitle(id) + (win ? " — open" : "");
    });
    Object.keys(existing).forEach(function (id) { if (existing[id].parentNode) existing[id].parentNode.removeChild(existing[id]); });

    var anyRunning = ids.some(function (id) { return !!openWindows[id]; });
    var hint = $("#dockHint");
    if (hint) hint.hidden = anyRunning;
    /* Пустая полка на телефоне не показывается вовсе: там док — полка
       ОТКРЫТОГО (D-061), и пустая полка была бы одинокой оранжевой кнопкой
       без подписи — загадкой, а не приглашением. Пусковой полкой на
       телефоне служит сам стол. Класс вешается всегда, прячет его только
       узкий @media: на широком экране пустой док остаётся приглашением
       с подписью и подсказкой. */
    root.classList.toggle("dock-empty", !anyRunning);
    measureDock();
  }
  window.sbBuildDock = buildDock;

  /* The dock's height is not a constant: it grows with the CTA label, the
     ⌘K hint under it, and whatever the shelf is holding. Anything that has to
     stand clear of the dock (the desktop hint, §8) needs the real number, not
     a guess that silently goes wrong the day the dock changes. Published as
     --dock-h; offsetHeight is used rather than the rect so an auto-hidden
     dock (translated off-screen) still reports its true size. */
  var dockRO = null;
  var dockHPublished = "";
  function publishDockHeight() {
    var dock = $("#dock");
    if (!dock) return;
    var h = dock.offsetHeight;
    if (!(h > 0)) return;
    /* ── ПИСАТЬ В КОРЕНЬ — ЭТО НЕ ПРИСВОИТЬ (v64) ──────────────────────────
       ПОВОД, дословно от основателя 25.08.2026: «после загрузки (startup) фон
       рабочего стола моргает два раза в течении 10 секунд - прошу советв
       очередной раз убрать этот баг».

       «В очередной раз» — самое важное слово: моргание чинили дважды, оба
       раза чиня видимое событие, которое показал основатель. Третий раз
       означает, что чинили следствие.

       Найдено прибором: за первые две секунды загрузки сюда приходили
       ЧЕТЫРНАДЦАТЬ вызовов, и тринадцать из них писали ОДНО И ТО ЖЕ — «60px»,
       десять раз подряд за 330 миллисекунд. А свойство, записанное в корень,
       объявляет устаревшим стиль ВСЕГО документа (D-093, измерено здесь же).
       То есть система десять раз просила браузер пересчитать всю страницу,
       чтобы сообщить ему то, что он уже знал. На телефоне с двумя гигабайтами
       и двадцатью тремя стеклянными поверхностями это и есть моргание.

       Тот же урок уже был выучен на подсветке дока (D-092: «пиши только
       изменившееся») и сюда не дошёл. Теперь дошёл.

       Охраняется tools/root-restyle-check.mjs. */
    var next = h + "px";
    if (next === dockHPublished) return;
    dockHPublished = next;
    doc.documentElement.style.setProperty("--dock-h", next);
  }
  function measureDock() {
    var dock = $("#dock");
    if (!dock) return;

    /* Deliberately NOT measured synchronously here. buildDock runs while the
       shelf is still assembling — the ⌘K line under it has no height until
       its font resolves — and a measurement taken then reads ~14px short.
       Publishing that number is worse than publishing nothing, because the
       CSS fallback is the correct full height and a wrong value overrides it.
       So: wait for a laid-out frame, confirm again once fonts settle, and
       from then on let the observer keep it honest. */
    requestAnimationFrame(publishDockHeight);
    if (doc.fonts && doc.fonts.ready && doc.fonts.ready.then) {
      doc.fonts.ready.then(publishDockHeight, function () { });
    }
    if (!dockRO && typeof ResizeObserver === "function") {
      dockRO = new ResizeObserver(publishDockHeight);
      dockRO.observe(dock);
    }
  }
  window.sbMeasureDock = measureDock;
  window.addEventListener("resize", measureDock);

  function dockBounce(id) {
    var t = $('.dock-item[data-app="' + id + '"]');
    if (!t || reduced() || systemReduced()) return;
    t.classList.remove("bounce");
    void t.offsetWidth;
    t.classList.add("bounce");
    setTimeout(function () { t.classList.remove("bounce"); }, 620);
  }
  function dockCatch(id) {
    var t = $('.dock-item[data-app="' + id + '"]');
    if (!t) return;
    t.classList.add("catch");
    setTimeout(function () { t.classList.remove("catch"); }, 150);
  }
  function dockRelease(id) {
    var t = $('.dock-item[data-app="' + id + '"]');
    if (!t) return;
    t.classList.add("release");
    setTimeout(function () { t.classList.remove("release"); }, 180);
  }

  window.setMailBadge = function (n) {
    var t = $('.dock-item[data-app="mail"] .dock-badge');
    if (!t) return;
    var v = num(n, 0);
    if (v <= 0) { t.hidden = true; t.textContent = ""; return; }
    t.hidden = false;
    t.textContent = v > 9 ? "9+" : String(v);
  };

  /* hover magnification (mouse only, off under reduced motion) */
  /* ── УВЕЛИЧЕНИЕ ПОД УКАЗАТЕЛЕМ ПИШЕТ ТОЛЬКО ТО, ЧТО ИЗМЕНИЛОСЬ (v56) ──────
     ПОВОД: директива основателя о производительности, §4 — «Сколько работы
     происходит на каждый pointer movement во время drag?» и «Не допускайте
     архитектуры: pointermove → massive DOM/state update → layout → paint».

     КАК СЮДА ПРИШЛИ. Обсерватория назвала переключение окон самой дорогой
     мелкой операцией: 19.17 пересчёта стиля на щелчок по плитке дока.
     Первое подозрение — на focusWindow() и buildDock(); измерение его
     СНЯЛО: focusWindow() стоит 1.07 пересчёта, buildDock() — 0.02 мс.
     Дорог оказался не сам фокус, а путь указателя к плитке.

     ЧТО БЫЛО ИЗМЕРЕНО. Одно движение указателя над доком стоило 8.73
     пересчёта стиля и 2.508 мс — по пересчёту на каждую из девяти плиток.
     При шестидесяти движениях в секунду это 150 мс в секунду: пятнадцать
     процентов ядра на то, чтобы провести мышью вдоль дока.

     ЧТО ЗДЕСЬ НЕ ТРОГАЛИ. Ни увеличение, ни его спад, ни порог в сто
     пикселей, ни ограничение одним кадром через requestAnimationFrame —
     оно тут было и работало правильно. Дорого стоило не то, ЧТО считается,
     а то, В КАКОМ ПОРЯДКЕ это читается и пишется.

     ЧТО СДЕЛАНО — ТРИ ПРАВКИ, И ТОЛЬКО ДВЕ ИЗ НИХ ПОМОГЛИ. Порядок важен,
     потому что две неудачные гипотезы здесь дороже одной удачной: они
     показывают, чего НЕ надо делать в следующий раз.

       1. Пропуск неизменившихся значений. Гипотеза: большинству плиток
          пишется то же число. ИЗМЕРЕНО: 8.72 против 8.73 — не помогло
          ничем. Оставлено: дёшево и убирает лишние объявления. Но лечит
          не оно.
       2. Все замеры вперёд, все записи потом. Гипотеза: запись объявляет
          стиль устаревшим, и следующий getBoundingClientRect() заставляет
          движок пересчитать его заново — девять раз за движение.
          ИЗМЕРЕНО: 8.72 → 2.52 пересчёта. Вот это и было причиной.
       3. Прямая запись transform вместо переменной --mag. Гипотеза:
          пользовательское свойство объявляет устаревшим весь поддерево
          плитки, а не саму плитку. ИЗМЕРЕНО: пересчётов столько же (2.52),
          но время упало с 2.012 мс до 0.672.

     ИТОГ на одно движение указателя: 8.73 → 2.52 пересчёта стиля,
     2.508 → 0.672 мс, скрипт 0.601 → 0.250 мс. Рисунок увеличения не
     изменился ни на сотую: 1.45 под указателем, 1.213 у соседей, 1 дальше.

     Уход указателя гасит увеличение той же строкой «1.000», что и память,
     — иначе память и стиль расходились бы на ровном месте. */
  function wireDockMagnify() {
    var dock = $("#dock");
    if (!dock) return;
    var FLAT = "1.000";
    var raf = 0, lastX = 0;
    function setMag(item, v) {
      if (item._sbMag === v) return;
      item._sbMag = v;
      item.style.transform = v === FLAT ? "" : "scale(" + v + ")";
    }
    dock.addEventListener("pointermove", function (ev) {
      if (ev.pointerType !== "mouse" || reduced() || systemReduced() || isTouch()) return;
      lastX = ev.clientX;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var items = $$(".dock-item", dock);
        /* СНАЧАЛА ВСЕ ЗАМЕРЫ, ПОТОМ ВСЕ ЗАПИСИ, И ЭТО ГЛАВНОЕ ЗДЕСЬ.
           Раньше замер и запись чередовались по плиткам: запись объявляла
           стиль устаревшим, следующий getBoundingClientRect() заставлял
           движок пересчитать его заново — и так девять раз за одно движение
           указателя. Измерено: 8.73 пересчёта стиля на движение.

           Проверено отдельно и НЕ подтвердилось: сначала Совет решил, что
           виноваты сами записи, и добавил пропуск неизменившихся значений.
           Числа не двинулись — 8.72 против 8.73. Значит, дело было не в
           записях, а в их чередовании с чтениями. Пропуск оставлен: он
           дешёв и убирает лишние объявления, — но лечит здесь не он.

           Читать все рамки заранее можно потому, что увеличение правит
           только transform: scale(), а transform не меняет разметку.
           Положение плиток от увеличения не едет, и замер не устаревает. */
        var mags = new Array(items.length);
        for (var i = 0; i < items.length; i++) {
          var r = items[i].getBoundingClientRect();
          var d = Math.abs((r.left + r.width / 2) - lastX);
          var sc = d > 100 ? 1 : 1 + 0.45 * (1 - d / 100);
          mags[i] = sc.toFixed(3);
        }
        for (var j = 0; j < items.length; j++) setMag(items[j], mags[j]);
      });
    });
    dock.addEventListener("pointerleave", function () {
      $$(".dock-item", dock).forEach(function (item) { setMag(item, FLAT); });
    });
    /* auto-hide */
    dock.addEventListener("pointerenter", function () { root.classList.remove("dock-away"); armDockHide(); });
    doc.addEventListener("pointermove", function (ev) {
      if (!root.classList.contains("dock-autohide") || !dockArmed) return;
      if (ev.clientY > window.innerHeight - 120) root.classList.remove("dock-away");
    });
  }
  function armDockHide() {
    if (!root.classList.contains("dock-autohide")) return;
    if (dockHideTimer) clearTimeout(dockHideTimer);
    dockHideTimer = setTimeout(function () {
      if (dockArmed && root.classList.contains("dock-autohide")) root.classList.add("dock-away");
    }, 2600);
  }

  /* ======================================================= desktop icons §4.2 */
  var hiddenIcons = null;
  function getHiddenIcons() {
    if (!hiddenIcons) {
      var v = readJSON("sysbaby.icons.hidden", []);
      hiddenIcons = Array.isArray(v) ? v : [];
    }
    return hiddenIcons.slice();
  }
  window.sbGetHiddenIcons = getHiddenIcons;
  window.sbSetIconHidden = function (id, hidden) {
    var list = getHiddenIcons(), i = list.indexOf(id);
    if (hidden && i === -1) list.push(id);
    if (!hidden && i !== -1) list.splice(i, 1);
    hiddenIcons = list;
    writeJSON("sysbaby.icons.hidden", list);
    buildIcons();
    layoutIcons();
    sbBus.emit("icon:visibility", { id: id, hidden: !!hidden });
    return !!hidden;
  };

  /* ── СТОЛ ПОМНИТ, КУДА ЕГО ПОЛОЖИЛИ (v47.3) ────────────────────────────
   *
   * ПОВОД, дословно: «если я переставляю приложение, то оно возвращается
   * обратно на то место, где стояло, а не переносится туда, куда я его
   * переносил — баг».
   *
   * Перенос был задуман ВРЕМЕННЫМ: значок помечался data-dragged, перекладка
   * его не трогала — и она же снимала пометку со всех значков, возвращая их
   * в сетку. На телефоне перекладка случается сама: адресная строка Chrome
   * прячется при прокрутке, высота окна меняется, приходит resize. Человек
   * переставил значок, коснулся экрана — значок вернулся. Перезагрузка
   * теряла перестановку тем более: её нигде не записывали.
   *
   * ПОЧЕМУ ДОЛЯМИ, А НЕ ПИКСЕЛЯМИ. Место запоминается долей от размеров
   * стола. Пиксели верны ровно на том экране, где их записали: поворот
   * телефона или другое устройство выбросили бы значок за край. Доля
   * переживает и то и другое, а чтение всё равно зажимается в границы —
   * страховка стоит одной строки и снимает целый класс дефектов.
   *
   * ПОЧЕМУ ЭТО НЕ «ПРОСТО НАСТРОЙКА». Стол — вещь человека. Система не
   * переставляет на нём предметы без его слова; вернуть всё в сетку можно,
   * но по команде (sbTidyDesk), а не самой собой. */
  var iconPlaces = null;
  function getIconPlaces() {
    if (!iconPlaces) {
      var v = readJSON("sysbaby.icons.pos", {});
      iconPlaces = (v && typeof v === "object" && !Array.isArray(v)) ? v : {};
    }
    return iconPlaces;
  }
  function rememberIconPlace(id, x, y) {
    var host = $("#sbIconLayer");
    if (!host) return;
    var W = host.clientWidth, H = host.clientHeight;
    if (!W || !H) return;
    var places = getIconPlaces();
    places[id] = { fx: x / W, fy: y / H };
    iconPlaces = places;
    writeJSON("sysbaby.icons.pos", places);
  }
  function forgetIconPlace(id) {
    var places = getIconPlaces();
    if (!(id in places)) return;
    delete places[id];
    iconPlaces = places;
    writeJSON("sysbaby.icons.pos", places);
  }
  /* Прибрать стол — вернуть в сетку ВСЁ, что человек двигал. Названная
     дверь: её зовут терминал (`tidy`) и меню стола. */
  window.sbTidyDesk = function () {
    var n = Object.keys(getIconPlaces()).length;
    iconPlaces = {};
    writeJSON("sysbaby.icons.pos", {});
    $$("#sbIconLayer .desk-icon").forEach(function (el) { el.removeAttribute("data-dragged"); });
    layoutIcons();
    return n;
  };
  window.sbIconPlaces = function () { return JSON.parse(JSON.stringify(getIconPlaces())); };

  function desktopIconIds() {
    return launchable().filter(function (id) { return apps[id].desktopIcon !== false; });
  }

  function buildIcons() {
    var host = $("#sbIconLayer");
    if (!host) return;
    var hidden = getHiddenIcons();
    var ids = desktopIconIds();
    var existing = Object.create(null);
    $$(".desk-icon", host).forEach(function (n) { existing[n.getAttribute("data-app")] = n; });

    ids.forEach(function (id) {
      var def = apps[id], node = existing[id];
      if (!node) {
        node = doc.createElement("div");
        node.className = "desk-icon";
        node.setAttribute("data-app", id);
        node.setAttribute("tabindex", "0");
        node.setAttribute("role", "button");
        node.setAttribute("aria-label", tr("win.openApp", { app: appTitle(id) }));
        node.innerHTML = '<span class="icon-tile">' + appIconMarkup(id) + "</span>" +
          '<span class="icon-label">' + escapeHtml(appLabel(id)) + "</span>" +
          '<button class="icon-spark" type="button" tabindex="-1" aria-label="' + escapeHtml(tr("win.quickAction", { app: appTitle(id) })) + '">' + ICONS.spark + "</button>";
        wireIcon(node, id);
        host.appendChild(node);
      }
      delete existing[id];
      /* the name is re-read every build: a node that already exists still has
         to follow the language */
      var lbl = node.querySelector(".icon-label");
      if (lbl) lbl.textContent = appLabel(id);
      node.setAttribute("aria-label", tr("win.openApp", { app: appTitle(id) }));
      var spark = node.querySelector(".icon-spark");
      if (spark) spark.setAttribute("aria-label", tr("win.quickAction", { app: appTitle(id) }));
      node.classList.toggle("hidden-icon", hidden.indexOf(id) !== -1);
    });
    Object.keys(existing).forEach(function (id) { if (existing[id].parentNode) existing[id].parentNode.removeChild(existing[id]); });
  }

  function layoutIcons() {
    var host = $("#sbIconLayer");
    if (!host) return;
    var W = host.clientWidth;
    if (!W) { requestAnimationFrame(layoutIcons); return; }
    var all = $$(".desk-icon", host).filter(function (n) { return !n.classList.contains("hidden-icon"); });
    /* Значки с ЗАПОМНЕННЫМ местом сетке не принадлежат: они стоят там, куда
       их поставил человек, а остальные смыкают ряды — как на любом столе,
       откуда предмет унесли. Поэтому счёт колонок ведётся по оставшимся. */
    var places = getIconPlaces();
    var placed = all.filter(function (n) { return !!places[n.getAttribute("data-app")]; });
    var nodes = all.filter(function (n) { return !places[n.getAttribute("data-app")]; });
    var count = nodes.length || all.length;
    if (!count) { window.sbDesktopGrid = { originX: 0, originY: 0, cellW: 80, cellH: 92, cols: 0, rows: 0, gapX: 16, gapY: 12, stepX: 96, stepY: 104 }; return; }

    /* §4.2, ПЕРЕСЧИТАНО В v47.
       Правило прежнее: крупные значки включаются НЕ РАНЬШЕ той ширины, где
       целый ряд крупных помещается, — иначе рабочий стол становится хуже от
       того, что окно стало шире. Прежде порог был числом (897), посчитанным
       вручную под тогдашнее число приложений, и жил в двух местах сразу — в
       этом файле и в @media в core.css. Каждое новое приложение молча ломало
       обе арифметики: одиннадцатый значок дал провал 11 → 9 колонок на 898px,
       и нашёл его закон, а не человек.
       Теперь порог СЧИТАЕТСЯ ОТ ЧИСЛА ЗНАЧКОВ и объявляется классом, а CSS
       слушает класс. Двенадцатое приложение не потребует ни одной правки. */
    var WIDE_CELL = 80, MIN_GAP = 6, EDGE = 22;
    var needWide = count * WIDE_CELL + (count - 1) * MIN_GAP + EDGE * 2;
    var small = window.innerWidth < needWide;
    root.classList.toggle("icons-small", small);
    var cellW = small ? 68 : 80, cellH = small ? 80 : 92;
    var narrow = W < 520;
    var pad = narrow ? 14 : 22;
    var gapX = narrow ? 10 : 16, gapY = narrow ? 10 : 12;
    var avail = Math.max(cellW, W - pad * 2);
    var cols;

    /* the single row across the top wins whenever it physically fits,
       compressing gaps to 6 px before wrapping (§4.2, the 681 px lesson) */
    var minGap = 6;
    if (count * cellW + (count - 1) * minGap <= avail) {
      cols = count;
      if (count > 1) gapX = clamp(Math.floor((avail - count * cellW) / (count - 1)), minGap, gapX);
    } else {
      cols = Math.max(1, Math.floor((avail + gapX) / (cellW + gapX)));
    }
    var rows = Math.ceil(count / cols);
    var blockW = cols * cellW + (cols - 1) * gapX;
    var originX = Math.max(pad, Math.round((W - blockW) / 2));
    var originY = pad;

    /* Сетка ОБХОДИТ места, занятые рукой человека. Основатель показал
       снимок: значок, вернувшийся из Echoes, лёг ПОВЕРХ переставленной им
       Hoidla — сетка раздавала клетки, не зная, что часть стола уже занята.
       Теперь клетка, пересекающаяся с поставленным вручную значком,
       пропускается, и ряд течёт дальше — как вода вокруг камня. */
    var HH0 = host.clientHeight || (cellH * 2);
    var stones = placed.map(function (n) {
      var pos = places[n.getAttribute("data-app")];
      if (!pos) return null;
      return { x: clamp(pos.fx * W, 2, Math.max(2, W - cellW - 2)),
               y: clamp(pos.fy * HH0, 2, Math.max(2, HH0 - cellH - 2)) };
    }).filter(Boolean);
    function cellFree(x, y) {
      for (var k = 0; k < stones.length; k++) {
        var st = stones[k];
        if (!(x + cellW <= st.x || st.x + cellW <= x || y + cellH <= st.y || st.y + cellH <= y)) return false;
      }
      return true;
    }
    var slot = 0;
    nodes.forEach(function (n) {
      if (n.getAttribute("data-dragged") === "1") return;   /* палец ещё держит — не вырывать */
      var x, y;
      do {
        var c = slot % cols, r = Math.floor(slot / cols);
        x = originX + c * (cellW + gapX);
        y = originY + r * (cellH + gapY);
        slot++;
      } while (!cellFree(x, y) && slot < 400);
      n.style.left = x + "px";
      n.style.top = y + "px";
      n.style.width = cellW + "px";
      n.style.height = cellH + "px";
    });

    /* Запомненные ставятся по своей доле — и зажимаются в границы стола:
       доля записана на другом экране, и без этой строки значок мог бы
       оказаться за краем после поворота телефона. */
    var HH = host.clientHeight || (cellH * 2);
    placed.forEach(function (n) {
      var pos = places[n.getAttribute("data-app")];
      if (!pos) return;
      n.style.width = cellW + "px";
      n.style.height = cellH + "px";
      if (n.getAttribute("data-dragged") === "1") return;
      n.style.left = Math.round(clamp(pos.fx * W, 2, Math.max(2, W - cellW - 2))) + "px";
      n.style.top = Math.round(clamp(pos.fy * HH, 2, Math.max(2, HH - cellH - 2))) + "px";
    });
    $$(".desk-icon", host).forEach(function (n) { n.removeAttribute("data-dragged"); });

    window.sbDesktopGrid = {
      originX: originX, originY: originY, cellW: cellW, cellH: cellH,
      cols: cols, rows: rows, gapX: gapX, gapY: gapY,
      stepX: cellW + gapX, stepY: cellH + gapY
    };
  }
  window.sbLayoutDesktopIcons = layoutIcons;

  var relayoutTimer = null;
  function scheduleRelayout() {
    if (relayoutTimer) clearTimeout(relayoutTimer);
    relayoutTimer = setTimeout(function () {
      layoutIcons();
      setTimeout(layoutIcons, 260);       /* late-settling mobile viewports */
    }, 90);
  }
  window.addEventListener("resize", scheduleRelayout);
  window.addEventListener("orientationchange", scheduleRelayout);
  sbBus.on("icon:visibility", function () { layoutIcons(); });

  /* icon interaction: open, keyboard, drag with collision + grid snap */
  function rectsOverlap(a, b, padPx) {
    return !(a.x + a.w + padPx <= b.x || b.x + b.w + padPx <= a.x || a.y + a.h + padPx <= b.y || b.y + b.h + padPx <= a.y);
  }
  function obstacles(exceptEl) {
    var out = [];
    $$("#sbIconLayer .desk-icon").forEach(function (n) {
      if (n === exceptEl || n.classList.contains("hidden-icon")) return;
      out.push({ x: n.offsetLeft, y: n.offsetTop, w: n.offsetWidth, h: n.offsetHeight });
    });
    $$("#sbNoteLayer .sticky-note").forEach(function (n) {
      if (n === exceptEl) return;
      out.push({ x: n.offsetLeft, y: n.offsetTop, w: n.offsetWidth, h: n.offsetHeight });
    });
    return out;
  }
  window.sbDesktopObstacles = obstacles;

  function freeCellNear(x, y, w, h, exceptEl) {
    var g = window.sbDesktopGrid;
    if (!g || !g.cols) return { x: x, y: y };
    var col = Math.round((x - g.originX) / g.stepX), row = Math.round((y - g.originY) / g.stepY);
    var others = obstacles(exceptEl);
    for (var rad = 0; rad <= 6; rad++) {
      for (var dc = -rad; dc <= rad; dc++) {
        for (var dr = -rad; dr <= rad; dr++) {
          if (Math.max(Math.abs(dc), Math.abs(dr)) !== rad) continue;
          var cx = Math.max(0, col + dc), cy = Math.max(0, row + dr);
          var px = g.originX + cx * g.stepX, py = g.originY + cy * g.stepY;
          var candidate = { x: px, y: py, w: w, h: h };
          var blocked = others.some(function (o) { return rectsOverlap(candidate, o, 8); });
          if (!blocked) return { x: px, y: py };
        }
      }
    }
    return { x: x, y: y };
  }
  window.sbFreeCellNear = freeCellNear;

  function wireIcon(node, id) {
    var drag = null;
    node.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); toggleApp(id); }
    });
    node.addEventListener("pointerdown", function (ev) {
      if (ev.button !== 0) return;
      if (ev.target && ev.target.closest(".icon-spark")) return;
      drag = { sx: ev.clientX, sy: ev.clientY, ox: node.offsetLeft, oy: node.offsetTop, moved: false, armed: false };
      /* ЦЕЛЬ ЗАМЕРЯЕТСЯ ОДИН РАЗ, А НЕ НА КАЖДОМ КАДРЕ (v47.1, цикл скорости №1).
         echoesDropTarget спрашивал getBoundingClientRect у значка Echoes и у
         его окна на КАЖДОЕ движение пальца. Каждый такой вопрос заставляет
         браузер досчитать раскладку немедленно — посреди жеста, шестьдесят
         раз в секунду. За время одного переноса ни значок Echoes, ни его
         окно с места не двигаются, поэтому их место запоминается на входе.
         На отпускании цель ищется заново, по живым числам: там кадр уже не
         на счету, а ошибиться в точке приземления нельзя. */
      drag.zones = echoesZones();
      try { node.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
    });
    node.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var dx = ev.clientX - drag.sx, dy = ev.clientY - drag.sy;
      if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 4) return;
      if (!drag.moved) {
        drag.moved = true;
        node.classList.add("dragging");
        /* Пометка ставится С ПЕРВОГО ДВИЖЕНИЯ, не на отпускании: перекладка
           стола может прийти ПОСРЕДИ жеста (адресная строка телефона шлёт
           resize), и без пометки она передвинет базу значка под переносом —
           отпускание сложит смещение с уже другой базой, и значок «улетит
           в другую сторону» (дословно основатель). Помеченный значок
           перекладка не трогает. */
        node.setAttribute("data-dragged", "1");
        node.style.willChange = "transform";
        if (window.sbEchoesHighlight) window.sbEchoesHighlight(true);
      }
      /* ЗНАЧОК ИДЁТ ЗА РУКОЙ, ВСЕГДА (v47).
         Здесь стояла проверка столкновений: если следующий кадр перекрывал
         чужой значок, кадр просто не рисовался. Задумано как мягкий упор,
         получились СТЕНЫ: на столе из десяти значков свободного места между
         ними нет, и протащить один мимо другого невозможно. Хуже того,
         значок в углу оказывался заперт соседями — основатель написал об
         этом дословно: «приложение echoes сейчас заперто». А echoes — ещё и
         место, куда значки перетаскивают, чтобы убрать: заперев его, мы
         заперли и весь этот путь.
         Место ищется на ОТПУСКАНИИ (freeCellNear ниже) — в тот момент,
         когда человек действительно назвал позицию. Ровно так же это уже
         сделано у заметок, и там об этом написано теми же словами. */
      /* ЗНАЧОК ЕДЕТ ПЕРЕНОСОМ, А НЕ КООРДИНАТОЙ (v47.1, цикл скорости №1).
         Здесь на каждый кадр писались left и top. Это не просто присваивание:
         каждая такая пара заставляет браузер заново разложить весь слой
         значков и перерисовать его, пока палец движется. Перенос (transform)
         композитор делает сам, не трогая раскладку вовсе.
         Настоящая координата не меняется всё это время — она записывается
         один раз, на отпускании, там же, где ищется свободное место. Значок
         при этом ВЫГЛЯДИТ ровно так же: getBoundingClientRect учитывает
         перенос, и закон desktop-drag-check меряет именно его. */
      drag.lastX = dx; drag.lastY = dy;
      node.style.transform = "translate3d(" + Math.round(dx) + "px," + Math.round(dy) + "px,0)";
      var over = zoneHit(drag.zones, ev.clientX, ev.clientY);
      var armed = !!over && over !== node;
      /* Класс переставляется только когда он ДЕЙСТВИТЕЛЬНО меняется: иначе
         каждый кадр просит пересчитать стили ни за чем. */
      if (armed !== drag.armed) { drag.armed = armed; node.classList.toggle("armed", armed); }
    });
    function endIconDrag(ev) {
      if (!drag) return;
      var d = drag; drag = null;
      node.classList.remove("dragging", "armed");
      node.style.willChange = "";
      if (window.sbEchoesHighlight) window.sbEchoesHighlight(false);
      if (!d.moved) { node.style.transform = ""; toggleApp(id); return; }
      /* Перенос был показным — теперь он становится координатой. Порядок
         важен: сперва записать left/top, потом снять transform. Наоборот
         значок мигнул бы обратно в исходную точку на один кадр. */
      /* Посадка считается от НАСТОЯЩЕГО экранного места, а не от базы,
         снятой на захвате: getBoundingClientRect учитывает и перенос, и
         всё, что успело случиться с раскладкой за время жеста. Сажаем
         ровно туда, где значок видит человек, — и зажимаем в слой. */
      var layerEl = node.parentNode;
      var lr = layerEl.getBoundingClientRect();
      var nr = node.getBoundingClientRect();
      var landedX = clamp(nr.left - lr.left, 2, Math.max(2, layerEl.clientWidth - node.offsetWidth - 2));
      var landedY = clamp(nr.top - lr.top, 2, Math.max(2, layerEl.clientHeight - node.offsetHeight - 2));
      node.style.left = Math.round(landedX) + "px";
      node.style.top = Math.round(landedY) + "px";
      node.style.transform = "";
      var over = ev && echoesDropTarget(ev.clientX, ev.clientY);
      if (over && id !== "echoes") {
        /* Унесённый со стола забывает своё место: вернувшись, он должен
           встать в ряд, а не в точку, из которой его когда-то унесли. */
        forgetIconPlace(id);
        window.sbSetIconHidden(id, true);
        window.showToast(tr("toast.toEchoes", { app: appTitle("echoes") }), tr("toast.toEchoesIcon"), ICONS.note);
        layoutIcons();
        return;
      }
      node.setAttribute("data-dragged", "1");
      var snap = freeCellNear(node.offsetLeft, node.offsetTop, node.offsetWidth, node.offsetHeight, node);
      node.classList.add("settling");
      node.style.left = snap.x + "px"; node.style.top = snap.y + "px";
      /* Место человека записывается ЗДЕСЬ и сразу: следующая перекладка
         стола (её вызывает даже адресная строка телефона) обязана уже знать
         о ней, иначе значок вернётся в сетку — ровно тот дефект, о котором
         написал основатель. */
      rememberIconPlace(id, snap.x, snap.y);
      setTimeout(function () { node.classList.remove("settling"); }, 320);
    }
    node.addEventListener("pointerup", endIconDrag);
    node.addEventListener("pointercancel", function () {
      if (!drag) return;
      /* Прерванный жест обязан убрать за собой ТО ЖЕ, что убирает
         законченный: иначе значок останется висеть в переносе. */
      drag = null;
      node.classList.remove("dragging", "armed");
      node.style.transform = "";
      node.style.willChange = "";
      if (window.sbEchoesHighlight) window.sbEchoesHighlight(false);
    });

    wireIconCapsule(node, id);
  }

  /* Места, куда значок можно уронить, снятые ОДИН РАЗ. Возвращается список
     пар «прямоугольник — элемент», чтобы попадание считалось арифметикой, а
     не новым вопросом к раскладке. */
  function echoesZones() {
    var out = [];
    var icon = $('.desk-icon[data-app="echoes"]');
    if (icon) out.push({ r: icon.getBoundingClientRect(), el: icon });
    var win = openWindows.echoes;
    if (win) out.push({ r: win.el.getBoundingClientRect(), el: win.el });
    return out;
  }
  function zoneHit(zones, x, y) {
    if (!zones) return null;
    for (var i = 0; i < zones.length; i++) {
      var r = zones[i].r;
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return zones[i].el;
    }
    return null;
  }

  function echoesDropTarget(x, y) {
    var icon = $('.desk-icon[data-app="echoes"]');
    if (icon) {
      var r = icon.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return icon;
    }
    var win = openWindows.echoes;
    if (win) {
      var wr = win.el.getBoundingClientRect();
      if (x >= wr.left && x <= wr.right && y >= wr.top && y <= wr.bottom) return win.el;
    }
    return null;
  }
  window.sbEchoesHighlight = function (active) {
    var icon = $('.desk-icon[data-app="echoes"]');
    if (icon) icon.classList.toggle("drop-target", !!active);
    var win = openWindows.echoes;
    if (win) win.el.classList.toggle("drop-target", !!active);
  };

  /* Notes rows dragged out of the Notes app land here (shell drop contract) */
  doc.addEventListener("pointerup", function (ev) {
    var ghostNode = $(".notes-row-ghost.dragging");
    if (!ghostNode) return;
    var id = ghostNode.getAttribute("data-id");
    var over = echoesDropTarget(ev.clientX, ev.clientY);
    if (over && id && window.sbNotesStore) {
      window.sbNotesStore.softDelete(id);
      window.showToast(tr("toast.toEchoes", { app: appTitle("echoes") }), tr("toast.toEchoesNote"), ICONS.note);
    }
    window.sbEchoesHighlight(false);
  }, true);

  /* ------------------------------------- hover-reveal quick inputs (§4.2) */
  var CAPSULES = {
    search: "Seek anything…",
    mail: "Write to…",
    messenger: "Quick message…",
    notes: "New scribble…",
    settings: "Jump to a setting…",
    files: "Find a file…",
    echoes: "Search echoes to restore…"
  };

  function wireIconCapsule(node, id) {
    if (!CAPSULES[id]) return;
    var capsule = null, hideTimer = null;

    function ensure() {
      if (capsule) return capsule;
      capsule = doc.createElement("form");
      capsule.className = "icon-capsule";
      capsule.innerHTML = '<input type="text" placeholder="' + escapeHtml(CAPSULES[id]) + '" aria-label="' + escapeHtml(CAPSULES[id]) + '" />';
      capsule.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var input = capsule.querySelector("input");
        runCapsule(id, input.value.trim());
        input.value = "";
        hide(true);
      });
      capsule.addEventListener("keydown", function (ev) {
        if (ev.key === "Escape") { ev.stopPropagation(); hide(true); }
      });
      capsule.addEventListener("pointerenter", function () { if (hideTimer) clearTimeout(hideTimer); });
      capsule.addEventListener("pointerleave", scheduleHide);
      node.appendChild(capsule);
      return capsule;
    }
    function show() {
      if (isTouch()) return;
      ensure();
      node.classList.add("capsule-open");
      var input = capsule.querySelector("input");
      setTimeout(function () { try { input.focus(); } catch (e) { /* ignore */ } }, 40);
    }
    function hide(force) {
      node.classList.remove("capsule-open");
      if (force && capsule) { var i = capsule.querySelector("input"); if (i) i.blur(); }
    }
    function scheduleHide() {
      if (hideTimer) clearTimeout(hideTimer);
      hideTimer = setTimeout(function () { hide(false); }, 260);
    }
    var spark = node.querySelector(".icon-spark");
    if (spark) {
      spark.addEventListener("pointerenter", function () { if (hideTimer) clearTimeout(hideTimer); show(); });
      spark.addEventListener("click", function (ev) { ev.preventDefault(); ev.stopPropagation(); show(); });
    }
    node.addEventListener("pointerleave", scheduleHide);
    node._sbCapsuleShow = show;
  }

  window.sbSeekReveal = function () {
    var node = $('.desk-icon[data-app="search"]');
    if (node && node._sbCapsuleShow) { node._sbCapsuleShow(); return true; }
    if (window.openCmdk) { window.openCmdk(""); return true; }
    return false;
  };

  function afterOpen(id, fn) {
    toggleApp(id);
    setTimeout(function () { try { fn(openWindows[id]); } catch (e) { if (window.console) console.error(e); } }, 260);
  }

  function runCapsule(id, text) {
    if (id === "search") { if (window.openCmdk) window.openCmdk(text); return; }
    if (id === "mail") {
      afterOpen("mail", function (win) {
        if (!win) return;
        var btn = win.el.querySelector("#mailCompose");
        if (btn) btn.click();
        setTimeout(function () {
          var to = win.el.querySelector("#composeTo");
          if (to && text) { to.value = text; to.dispatchEvent(new Event("input", { bubbles: true })); }
        }, 120);
      });
      return;
    }
    if (id === "messenger") {
      afterOpen("messenger", function (win) {
        if (!win || !text) return;
        var input = win.el.querySelector("#msgrInput");
        if (!input) return;
        input.value = text;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
      });
      return;
    }
    if (id === "notes") {
      afterOpen("notes", function (win) {
        if (!win) return;
        var add = win.el.querySelector("#notesAdd");
        if (add) add.click();
        setTimeout(function () {
          var t = win.el.querySelector("#noteTitleInput");
          if (t && text) { t.value = text; t.dispatchEvent(new Event("input", { bubbles: true })); }
        }, 120);
      });
      return;
    }
    if (id === "settings") {
      afterOpen("settings", function (win) {
        if (!win || !text) return;
        var q = text.toLowerCase();
        var hit = $$("[data-section]", win.el).filter(function (n) {
          return (n.textContent || "").toLowerCase().indexOf(q) !== -1 || (n.getAttribute("data-section") || "").indexOf(q) !== -1;
        })[0];
        if (hit) hit.click();
      });
      return;
    }
    if (id === "files") {
      afterOpen("files", function (win) {
        if (!win || !text || !window.sbFilesSearch || !window.sbFilesOpenResult) return;
        var hits = window.sbFilesSearch(text) || [];
        if (hits.length) window.sbFilesOpenResult(win, hits[0]);
      });
      return;
    }
    if (id === "echoes") {
      toggleApp("echoes");
      if (!text || !window.sbNotesStore) return;
      var q = text.toLowerCase();
      var hit = window.sbNotesStore.loadDeleted().filter(function (n) { return String(n.text || "").toLowerCase().indexOf(q) !== -1; })[0];
      if (hit) {
        window.sbNotesStore.restore(hit.id);
        window.showToast(tr("toast.restored"), tr("toast.restoredBody"), ICONS.note);
        renderApp("echoes");
      }
    }
  }

  /* ================================================= Exposé (bare `e`) §3.4 */
  var exposeOn = false;
  function toggleExpose(force) {
    var layerEl = $("#sbExpose");
    if (!layerEl) return false;
    var want = (force === undefined) ? !exposeOn : !!force;
    if (want === exposeOn) return exposeOn;
    exposeOn = want;
    layerEl.hidden = !want;
    layerEl.innerHTML = "";
    root.classList.toggle("expose-on", want);
    if (!want) return exposeOn;
    var ids = openOrder.filter(function (id) { return openWindows[id]; });
    if (!ids.length) {
      layerEl.innerHTML = '<p class="expose-empty">' + escapeHtml(tr("win.noneOpen")) + "</p>";
      return exposeOn;
    }
    var grid = doc.createElement("div");
    grid.className = "expose-grid";
    ids.forEach(function (id) {
      var def = apps[id] || {};
      var card = doc.createElement("button");
      card.type = "button";
      card.className = "expose-card";
      card.innerHTML = '<span class="expose-tile">' + appIconMarkup(id) + "</span>" +
        '<span class="expose-name">' + escapeHtml(appTitle(id)) + "</span>";
      card.addEventListener("click", function () { toggleExpose(false); toggleApp(id); });
      grid.appendChild(card);
    });
    layerEl.appendChild(grid);
    layerEl.addEventListener("click", function (ev) { if (ev.target === layerEl) toggleExpose(false); }, { once: true });
    return exposeOn;
  }
  window.sbToggleExpose = toggleExpose;
  window.sbExposeOpen = function () { return exposeOn; };

  /* ===================================================== Escape priority §3.1 */
  window.sbEmptyDesktopSkipSelector =
    ".window, #topbar, #dock, #sbCmdk, .panel-overlay, #sbControlCenter, .sticky-note, .desk-icon, .sb-widget, #sbCtxMenu, #sbFab, #toastLayer, #sbLogin, #sbCurtain, #sbExpose, .note-invite";

  doc.addEventListener("keydown", function (ev) {
    if (ev.key !== "Escape") return;
    /* single target, in priority order */
    if (window.sbPaletteIsOpen && window.sbPaletteIsOpen()) { ev.preventDefault(); window.sbClosePalette(); return; }
    if (window.sbAnyPanelOpen && window.sbAnyPanelOpen()) { ev.preventDefault(); if (window.sbCloseAllPanels) window.sbCloseAllPanels(); return; }
    if (anyFullscreen()) { ev.preventDefault(); exitFullscreen(); return; }
    if (exposeOn) { ev.preventDefault(); toggleExpose(false); return; }
    if (window.sbContextMenuOpen && window.sbContextMenuOpen()) { ev.preventDefault(); window.sbCloseContextMenu(); return; }
    if (window.sbControlCenterOpen && window.sbControlCenterOpen()) { ev.preventDefault(); window.sbCloseControlCenter(); return; }
    if (window.sbNoteInviteOpen && window.sbNoteInviteOpen()) { ev.preventDefault(); window.sbCloseNoteInvite(); return; }
    var ae = doc.activeElement;
    if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA" || ae.isContentEditable)) return;
    if (focusedId && openWindows[focusedId]) { ev.preventDefault(); closeWindow(focusedId); }
  }, true);

  function typingTarget(ev) {
    var t = ev.target;
    if (!t) return false;
    return t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable;
  }
  window.sbBareKeyOk = function (ev) {
    if (typingTarget(ev)) return false;
    if (ev.metaKey || ev.ctrlKey || ev.altKey || ev.shiftKey) return false;
    if (window.sbAnyPanelOpen && window.sbAnyPanelOpen()) return false;
    return true;
  };

  doc.addEventListener("keydown", function (ev) {
    /* app-launch shortcuts: Ctrl or Cmd, never Alt */
    if ((ev.ctrlKey || ev.metaKey) && !ev.altKey) {
      var k = String(ev.key || "").toLowerCase();
      var hitId = null;
      Object.keys(window.sbAppShortcuts).forEach(function (id) {
        if (window.sbAppShortcuts[id].key === k) hitId = id;
      });
      if (hitId && apps[hitId]) { ev.preventDefault(); toggleApp(hitId); return; }
    }
    if (!window.sbBareKeyOk(ev)) return;
    if (ev.key === "e") { ev.preventDefault(); toggleExpose(); }
  });

  /* click outside any window/dock/topbar/palette unfocuses windows */
  doc.addEventListener("pointerdown", function (ev) {
    var t = ev.target;
    if (!t || !t.closest) return;
    if (t.closest(".window, #dock, #topbar, #sbCmdk, .panel-overlay, #sbControlCenter, #sbCtxMenu, #toastLayer")) return;
    if (focusedId) unfocusAll();
  });

  /* pause decorative motion when the tab is hidden (§13) */
  doc.addEventListener("visibilitychange", function () {
    root.classList.toggle("tab-hidden", doc.visibilityState === "hidden");
  });

  /* ============================================================= boot §2.3/2.4 */
  var bootReady = false;
  /* ЗАГРУЗКА ГОВОРИТ ТО, ЧТО ПРОИСХОДИТ (v47).
   *
   * Здесь стоял список из девяти выдуманных строк — «compile
   * automation.pipeline», «verify integrity ok» — и они печатались по таймеру
   * независимо от того, что делала система. Рядом жил индикатор, который рос
   * на случайную величину и останавливался на девяноста процентах, дожидаясь
   * готовности. Ни строки, ни проценты не измеряли ничего.
   *
   * Для этого проекта такая заставка — не мелочь и не украшение. Весь его
   * смысл в том, чтобы не рассказывать о качестве, а показывать прибор,
   * которым оно измерено. Экран загрузки был единственным местом, где продукт
   * говорил о себе неправду, — и это было первое, что видел человек.
   *
   * Теперь каждая строка — ЗАВЕРШИВШИЙСЯ ШАГ с настоящим числом: сколько
   * приложений зарегистрировалось, сколько записей в данных, за сколько
   * миллисекунд. Шаг, который не удался, остаётся на экране помеченным, а не
   * исчезает. Индикатор двигают выполненные шаги, а не таймер. Занавес
   * поднимается по настоящей готовности рабочего стола.
   *
   * Требование основателя 19.08.2026: «загрузка ОС должна быть настоящей и
   * функциональной». Охраняется tools/os-boot-truth.mjs.
   */
  var BOOT_STEPS = [
    { id: "storage", label: "storage", run: function () {
        var backend = (window.sbDB && typeof window.sbDB.get === "function") ? "sbDB" : "localStorage";
        var n = 0;
        try { for (var i = 0; i < localStorage.length; i++) if (String(localStorage.key(i)).indexOf("sysbaby.") === 0) n++; } catch (e) { n = -1; }
        if (n < 0) throw new Error("хранилище закрыто браузером");
        return backend + "  ·  " + n + " записей";
      } },
    { id: "session", label: "session", run: function () {
        var name = "";
        try { name = (window.sbDB && window.sbDB.get("sysbaby.user.name")) || ""; } catch (e) { name = ""; }
        return (name ? name : "guest") + ".sys.baby";
      } },
    { id: "appearance", label: "appearance", run: function () {
        var th = root.getAttribute("data-theme") || "—";
        var acc = window.sbGetCurrentAccent ? window.sbGetCurrentAccent() : null;
        return th + (acc && acc.a1 ? "  ·  " + acc.a1 : "");
      } },
    { id: "apps", label: "apps", run: function () {
        var list = window.sbLaunchableApps ? window.sbLaunchableApps() : [];
        if (!list.length) throw new Error("ни одно приложение не зарегистрировалось");
        return list.length + " зарегистрировано";
      } },
    { id: "data", label: "data", run: function () {
        /* Имена глобальных берутся из самих файлов данных, а не из памяти:
           первая версия этого шага спрашивала SYSBABY_PORTFOLIO, которого в
           проекте нет, — и честно покраснела на первом же прогоне. Ошибка
           стоила минуты и доказала, что шаг измеряет, а не рассказывает. */
        var pf = (window.sbPortfolio && window.sbPortfolio.length) || 0;
        var pr = (typeof window.sbPricingBand === "function") ? 1 : 0;
        if (!pf) throw new Error("портфолио не подгрузилось");
        return pf + " работ" + (pr ? "  ·  прайс на месте" : "  ·  прайса нет");
      } }
  ];

  /* Наружу — чтобы приборы читали ТО ЖЕ, что видел человек. */
  window.sbBoot = { steps: [], ok: null, ms: 0, startedAt: 0 };
  var GLYPHS = "0123456789abcdef/<>{}[]()=+-_:.|";
  var CELLS = 35;
  /* ── ЗАНАВЕС ГОВОРИТ ГОЛОСОМ СИСТЕМЫ, НЕ ВИТРИНЫ (v47.1) ────────────────
     Основатель: «слоган built around your business должен быть только в
     приложении build». До этого занавес загрузки собирал из шума две фразы
     витрины — «building automated business for you» и «built around your
     business» — и вторая ещё оставалась лежать на столе водяным знаком.
     Это голос ПРОДАВЦА в комнате, которая принадлежит пользователю: ОС
     пользовательская (D-054), и её единственная фраза — её собственная,
     та же, что на входе (D-052). Фразы витрины живут в приложении build —
     его шапка и так начинается со строки «Building Automated Business for
     You». Водяной знак на столе снят вовсе, не переписан: столу не нужна
     подпись, стол и есть система. */
  var SENTENCE_1 = "only you and your system, baby";
  var SENTENCE_2 = "only you and your system, baby";

  function padCenter(text) {
    var t = String(text).slice(0, CELLS);
    var left = Math.floor((CELLS - t.length) / 2);
    return new Array(left + 1).join(" ") + t + new Array(CELLS - t.length - left + 1).join(" ");
  }

  function revealStep(cls, delayMs) {
    setTimeout(function () { root.classList.add(cls); }, delayMs);
  }

  function startReveal() {
    revealStep("rv-topbar", 380);
    revealStep("rv-scene", 540);
    revealStep("rv-widgets", 640);
    setTimeout(function () {
      root.classList.add("rv-icons");
      buildIcons();
      layoutIcons();
      requestAnimationFrame(function () { requestAnimationFrame(layoutIcons); });
      bootReady = true;
      doc.dispatchEvent(new CustomEvent("sysbaby:desktop-ready"));
      if (window.sbGetControlToggle("autohide") && !isTouch()) { dockArmed = true; armDockHide(); }
    }, 720);
    setTimeout(function () {
      var n = 0;
      if (typeof window.sbMailUnreadCount === "function") {
        try { n = num(window.sbMailUnreadCount(), 0); } catch (e) { n = 0; }
      }
      window.setMailBadge(n);
      if (n > 0) window.showToast("Mail", n + " new message" + (n === 1 ? "" : "s") + " waiting", ICONS.mail, false, "", "event");
    }, 2600);
  }

  function systemReadyPromise() {
    return new Promise(function (resolve) {
      var done = false;
      var finish = function () { if (!done) { done = true; resolve(); } };
      var afterLoad = function () {
        var fonts = (doc.fonts && doc.fonts.ready) ? doc.fonts.ready : Promise.resolve();
        fonts.then(function () {
          var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 40); };
          idle(function () { idle(finish); });
        }, finish);
      };
      if (doc.readyState === "complete") afterLoad();
      else window.addEventListener("load", afterLoad);
      setTimeout(finish, 8000);            /* hard cap */
    });
  }

  /* Шаги идут по одному, каждый следующий — в отдельном кадре: так строка
     успевает появиться на экране, а не все разом в конце. */
  function runBootEngine() {
    var bar = $("#bootBar"), status = $("#bootStatus");
    var total = BOOT_STEPS.length + 1;          /* +1 — сам рабочий стол */
    var t0 = now();
    window.sbBoot = { steps: [], ok: null, ms: 0, startedAt: t0 };

    function record(id, ok, detail, ms) {
      var step = { id: id, ok: ok, detail: String(detail), ms: Math.round(ms) };
      window.sbBoot.steps.push(step);
      doc.dispatchEvent(new CustomEvent("sysbaby:boot-step", { detail: step }));
      if (bar) bar.style.width = Math.min(100, Math.round((window.sbBoot.steps.length / total) * 100)) + "%";
      if (status) status.textContent = ok ? id : (id + " — не удалось");
      return step;
    }

    var i = 0;
    function next() {
      if (i >= BOOT_STEPS.length) { finish(); return; }
      var st = BOOT_STEPS[i++];
      var s0 = now();
      try { record(st.id, true, st.run(), now() - s0); }
      catch (err) { record(st.id, false, (err && err.message) || "не удалось", now() - s0); }
      requestAnimationFrame(next);
    }

    function finish() {
      /* Рабочий стол — последний шаг, и он ЖДЁТ настоящего события, а не
         таймера: прежний индикатор доходил до ста и вызывал показ сам. */
      doc.addEventListener("sysbaby:desktop-ready", function () {
        record("desktop", true, "готов", now() - t0);
        window.sbBoot.ms = Math.round(now() - t0);
        window.sbBoot.ok = window.sbBoot.steps.every(function (x) { return x.ok; });
        if (status) status.textContent = window.sbBoot.ok ? "готово · " + window.sbBoot.ms + " мс" : "готово, но не всё";
        doc.dispatchEvent(new CustomEvent("sysbaby:boot-complete", { detail: window.sbBoot }));
      }, { once: true });
      startReveal();
    }

    requestAnimationFrame(next);
  }

  /* ---- cinematic curtain ---- */
  function runCurtain(onDone) {
    var curtain = $("#sbCurtain");
    if (!curtain) { onDone(); return; }
    var cellHost = $("#sbCurtainCells"), logHost = $("#sbCurtainLog");
    var cells = [], i;
    if (cellHost) {
      cellHost.innerHTML = "";
      for (i = 0; i < CELLS; i++) {
        var c = doc.createElement("span");
        c.className = "cur-cell";
        c.textContent = " ";
        cellHost.appendChild(c);
        cells.push(c);
      }
    }
    var locked = new Array(CELLS).fill(false);
    var target = padCenter(SENTENCE_1);
    var timers = [];
    var noiseRaf = 0;
    var finished = false;
    var skipArmed = false;

    var isReduced = systemReduced() || reduced();
    var deepLink = /[?&]open=/.test(entrySearch()) && rawGet("sysbaby.authed");
    var returning = window.sbDB && window.sbDB.get("sysbaby.boot.seen") === "1";
    /* On a phone the full 5.9 s sequence reads as a hung page rather than as an
       opening: the screen is dark, there is no progress and no page chrome to
       reassure. Measured on a throttled handset, the desktop arrived at 8.3 s.
       Compact layouts therefore take the short path — the same one a deep link
       takes. The sequence is unchanged on anything with a real window. */
    var shortPath = deepLink || compact();

    function noise() {
      if (finished) return;
      for (var j = 0; j < CELLS; j++) {
        if (locked[j]) continue;
        if (Math.random() < 0.35) cells[j].textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      noiseRaf = setTimeout(noise, 70);
    }

    function lockSentence(text, from, to, cb) {
      target = padCenter(text);
      var idx = [];
      for (var j = 0; j < CELLS; j++) idx.push(j);
      var span = Math.max(1, to - from);
      idx.forEach(function (j, n) {
        var t = from + (span * (n / CELLS)) + Math.random() * 90;
        timers.push(setTimeout(function () {
          if (finished) return;
          locked[j] = true;
          if (cells[j]) {
            cells[j].textContent = target[j];
            cells[j].classList.remove("broken");
            cells[j].classList.add("locked", "settle");
            (function (cell) {
              timers.push(setTimeout(function () { cell.classList.remove("settle"); }, 360));
            }(cells[j]));
          }
        }, t));
      });
      /* the code is the material, never the subject: it steps back to 8%
         the moment a sentence starts owning the frame */
      timers.push(setTimeout(function () { curtain.classList.add("said"); }, from));
      timers.push(setTimeout(function () { if (cb) cb(); }, to + 120));
    }

    function fragment(at) {
      timers.push(setTimeout(function () {
        if (finished) return;
        curtain.classList.remove("said");
        for (var j = 0; j < CELLS; j++) {
          locked[j] = false;
          if (!cells[j]) continue;
          cells[j].classList.remove("locked", "settle");
          cells[j].classList.add("broken");
        }
      }, at));
      /* the characters let go before they drop back into the flow */
      timers.push(setTimeout(function () {
        if (finished) return;
        for (var j = 0; j < CELLS; j++) if (cells[j]) cells[j].classList.remove("broken");
      }, at + 420));
    }

    /* The network behind the sequence. Points drift; a line is drawn between
       two of them when they are close enough to be neighbours. Nothing is
       placed and nothing is choreographed — it is the one image that says
       what the next five seconds are about, connections being made, before a
       single word has assembled. Lines only, so it never competes with the
       sentence for either attention or frames.

       The backing store is capped at 1.25x rather than the device's own
       ratio: this draws hairlines at eight per cent opacity, and at full
       resolution that is millions of pixels cleared and redrawn every frame
       on the one screen already animating thirty-five character cells. A
       hairline at 1.25x is a hairline, and it costs four fifths less. */
    function runNetwork() {
      var net = $("#sbCurtainNet");
      if (!net || isReduced || !net.getContext) return function () { };
      var g = net.getContext("2d");
      if (!g) return function () { };
      var P = null, dpr = 1, alive = true;
      function size() {
        dpr = Math.min(window.devicePixelRatio || 1, 1.25);
        net.width = Math.floor(window.innerWidth * dpr);
        net.height = Math.floor(window.innerHeight * dpr);
      }
      P = [];
      for (var q = 0; q < 12; q++) {
        P.push({ x: Math.random(), y: Math.random(), a: Math.random() * 6.283,
                 s: 1.8e-5 + Math.random() * 2.6e-5 });
      }
      /* Twenty-four frames a second. The points take half a minute to cross
         the screen, so anything faster redraws an identical picture — and
         during the boot every frame not spent here is one the sentence can
         have. */
      var STEP = 1000 / 24, painted = -1e9;
      function frame(ms) {
        if (!alive) return;
        requestAnimationFrame(frame);
        if (ms - painted < STEP) return;
        painted = ms;
        var W = net.width, H = net.height;
        g.clearRect(0, 0, W, H);
        /* squared distance against a squared radius: the comparison is the
           same and the square root is not taken sixty-six times a frame */
        var reach = Math.min(W, H) * 0.40, reach2 = reach * reach;
        var n = P.length, xs = new Float64Array(n), ys = new Float64Array(n), i, j;
        for (i = 0; i < n; i++) {
          xs[i] = (P[i].x + Math.cos(P[i].a + ms * P[i].s) * 0.14) * W;
          ys[i] = (P[i].y + Math.sin(P[i].a + ms * P[i].s * 1.3) * 0.14) * H;
        }
        g.strokeStyle = "rgba(158,204,226,0.085)";
        g.lineWidth = dpr * 0.8;
        g.beginPath();
        for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) {
          var dx = xs[j] - xs[i], dy = ys[j] - ys[i];
          if (dx * dx + dy * dy > reach2) continue;
          g.moveTo(xs[i], ys[i]); g.lineTo(xs[j], ys[j]);
        }
        g.stroke();
      }
      size();
      window.addEventListener("resize", size);
      requestAnimationFrame(frame);
      requestAnimationFrame(function () { net.classList.add("on"); });
      return function () { alive = false; window.removeEventListener("resize", size); };
    }
    var stopNetwork = runNetwork();

    /* Журнал занавеса — та же лента шагов, что читают приборы. Строка
       появляется, КОГДА шаг закончился, и несёт его настоящее число.
       Неудавшийся шаг остаётся на экране помеченным: исчезнувшая строка
       читается как «этого и не было». */
    function paintLog() {
      if (!logHost) return;
      logHost.innerHTML = "";
      function line(step) {
        var d = doc.createElement("div");
        d.className = "cur-log-line" + (step.ok ? "" : " failed");
        var pad = (step.id + "            ").slice(0, 12);
        d.textContent = pad + step.detail + (step.ok ? "" : "   ✗");
        d.setAttribute("data-step", step.id);
        logHost.appendChild(d);
        requestAnimationFrame(function () { d.classList.add("on"); });
      }
      (window.sbBoot && window.sbBoot.steps ? window.sbBoot.steps : []).forEach(line);
      doc.addEventListener("sysbaby:boot-step", function (e) { line(e.detail); });
    }

    function lift() {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      if (noiseRaf) clearTimeout(noiseRaf);
      if (window.sbDB) window.sbDB.set("sysbaby.boot.seen", "1");
      curtain.classList.add("lifting");
      stopNetwork();                 /* stop drawing before the canvas detaches */
      ghostResidue();
      setTimeout(function () { if (curtain.parentNode) curtain.parentNode.removeChild(curtain); }, 1100);
      onDone();
    }

    /* Водяного знака после подъёма занавеса больше нет (v47.1): фраза
       витрины ушла в приложение build по слову основателя, а своей подписи
       столу не нужно — стол и есть система. Функция оставлена пустой
       намеренно, чтобы точка вызова в lift() рассказывала историю. */
    function ghostResidue() { /* снято по слову основателя, v47.1 */ }

    /* ── ЗАНАВЕС ЖДЁТ НЕ СИГНАЛА, А ГОТОВОГО СТОЛА (v59) ──────────────────
       ПОВОД, дословно от основателя 24.08.2026: «рабочий стол ни в коем
       случае вначале после загрузки не должен моргать. Startup должен
       грузиться до тех пор, пока полностью не прогрузится рабочий стол».

       ЧТО ИЗМЕРЕНО. Занавес начинал уходить на 1518-й миллисекунде — в тот
       миг стол был проявлен на 80%, а ЗНАЧКИ на ШЕСТЬ ПРОЦЕНТОВ. Дальше
       занавес таял целую секунду, а под ним одновременно проявлялись значки:
       две встречные анимации с разными кривыми, и яркость на их сумме
       сначала проваливается, потом возвращается. Это и есть моргание.

       ОТКУДА ВЗЯЛОСЬ. Условие подъёма было «значки ОБЪЯВЛЕНЫ» — событие
       sysbaby:desktop-ready, которое приходит в тот миг, когда классу
       rv-icons только поставили класс. Между «начали проявляться» и
       «проявились» лежит целый переход, и занавес уходил внутри него.

       ЧТО СТАЛО. Ждём не объявления, а СОСТОЯНИЯ: прозрачность стола и слоя
       значков должна дойти до единицы. Это спрашивается у самого экрана, а
       не отсчитывается таймером, — значит, изменится длительность перехода в
       стилях, и условие изменится вместе с ней само.

       ПРЕДОХРАНИТЕЛЬ ОБЯЗАТЕЛЕН. Если слой не появится или переход застрянет,
       ждать вечно нельзя: занавес — это то, что стоит между человеком и его
       системой. Через LIFT_WAIT_CAP поднимаем в любом случае. Моргание —
       беда, запертый вход — беда несравнимо большая. */
    var LIFT_WAIT_CAP = 4000;
    var sequenceDone = false, iconsRevealed = root.classList.contains("rv-icons");
    function maybeLift() { if (sequenceDone && iconsRevealed) lift(); }

    function layerSettled(id) {
      var el = doc.getElementById(id);
      if (!el) return true;                       /* слоя нет — ждать нечего */
      var o = parseFloat(window.getComputedStyle(el).opacity);
      return !(o >= 0) || o > 0.99;
    }
    function waitForDesktop(startedAt) {
      if (finished) return;
      if (layerSettled("desktop") && layerSettled("sbIconLayer")) { iconsRevealed = true; maybeLift(); return; }
      if (now() - startedAt > LIFT_WAIT_CAP) { iconsRevealed = true; maybeLift(); return; }
      requestAnimationFrame(function () { waitForDesktop(startedAt); });
    }
    doc.addEventListener("sysbaby:desktop-ready", function () { waitForDesktop(now()); });

    function endSequence() { sequenceDone = true; maybeLift(); }

    /* skip: armed only once the sequence has actually started */
    function skip() {
      if (!skipArmed || finished) return;
      timers.forEach(clearTimeout);
      if (noiseRaf) clearTimeout(noiseRaf);
      target = padCenter(SENTENCE_2);
      for (var j = 0; j < CELLS; j++) { locked[j] = true; if (cells[j]) { cells[j].textContent = target[j]; cells[j].classList.add("locked"); } }
      endSequence();
    }
    ["pointerdown", "keydown", "touchstart"].forEach(function (e) { doc.addEventListener(e, skip, true); });

    function begin() {
      skipArmed = true;
      paintLog();
      if (isReduced) {
        target = padCenter(SENTENCE_2);
        for (var j = 0; j < CELLS; j++) { locked[j] = true; if (cells[j]) { cells[j].textContent = target[j]; cells[j].classList.add("locked"); } }
        timers.push(setTimeout(endSequence, 300));
        return;
      }
      noise();
      if (shortPath) { lockSentence(SENTENCE_2, 140, 640, null); timers.push(setTimeout(endSequence, 900)); return; }
      /* Фраза теперь одна — собирать её из шума дважды значило бы держать
         человека лишние две секунды ради повтора. Полный путь: шум, сборка,
         пауза на прочтение, подъём. */
      lockSentence(SENTENCE_1, 1150, 1750, null);
      timers.push(setTimeout(endSequence, returning ? 1400 : 3200));
    }

    /* absolute caps */
    var loginVisible = !!$("#sbLogin") && !root.classList.contains("sb-has-session");
    setTimeout(lift, loginVisible ? 20000 : 9000);

    if (loginVisible) doc.addEventListener("sysbaby:login-success", begin, { once: true });
    else begin();
  }

  /* ---- sign-in screen §2.1 ---- */
  function sanitizeUser(v) {
    return String(v || "").toLowerCase().replace(/[^a-z0-9_.\-]/g, "").slice(0, 18);
  }

  function loginSuccess() {
    window.__sbLoginDone = true;
    try { doc.dispatchEvent(new CustomEvent("sysbaby:login-success")); } catch (e) { /* ignore */ }
  }

  function wireLogin() {
    var card = $("#sbLogin");
    if (!card) { loginSuccess(); return; }
    if (root.classList.contains("sb-has-session")) {
      if (card.parentNode) card.parentNode.removeChild(card);
      loginSuccess();
      return;
    }
    var step1 = $("#sbLoginStep1"), step2 = $("#sbLoginStep2");
    var nameInput = $("#sbLoginName"), nameErr = $("#sbLoginNameErr");
    var pwInput = $("#sbLoginPw"), pwErr = $("#sbLoginPwErr");
    var chip = $("#sbLoginChip"), cont = $("#sbLoginContinue"), guest = $("#sbLoginGuest");
    var back = $("#sbLoginBack"), edit = $("#sbLoginEdit"), next = $("#sbLoginNext");
    var forgot = $("#sbLoginForgot"), forgotMsg = $("#sbLoginForgotMsg"), eye = $("#sbLoginEye");
    var chosen = "";

    function toStep2(name) {
      chosen = name;
      if (chip) chip.textContent = name + ".sys.baby";
      if (step1) step1.hidden = true;
      if (step2) step2.hidden = false;
      if (pwInput) setTimeout(function () { pwInput.focus(); }, 60);
    }
    function toStep1() {
      if (step2) step2.hidden = true;
      if (step1) step1.hidden = false;
      if (nameInput) nameInput.focus();
    }

    if (nameInput) {
      nameInput.addEventListener("input", function () {
        var pos = nameInput.selectionStart;
        nameInput.value = sanitizeUser(nameInput.value);
        try { nameInput.setSelectionRange(pos, pos); } catch (e) { /* ignore */ }
        if (nameErr) nameErr.textContent = "";
      });
      nameInput.addEventListener("keydown", function (ev) { if (ev.key === "Enter") { ev.preventDefault(); if (next) next.click(); } });
    }
    /* Одно поле имени решает, что будет дальше: если такая запись на этом
       устройстве есть — это ВХОД, если нет — РЕГИСТРАЦИЯ. Второго экрана и
       второй кнопки не нужно: человек и так знает, заводил он себя здесь или
       нет, а система это ЗНАЕТ ТОЧНО. */
    var registering = false;

    if (next) {
      next.addEventListener("click", function () {
        var v = sanitizeUser(nameInput ? nameInput.value : "");
        if (v.length < 2) {
          if (nameErr) nameErr.textContent = "Enter at least 2 characters — letters, numbers, . _ or -";
          return;
        }
        if (window.sbAuth && !window.sbAuth.available()) {
          if (nameErr) nameErr.textContent = "This page is not on a secure connection, so a password cannot be protected here. Continue as guest.";
          return;
        }
        registering = !(window.sbAuth && window.sbAuth.has(v));
        toStep2(v);
        var title = $(".login-title", step2), sub = $(".login-sub", step2);
        if (title) title.textContent = registering ? "Choose your password" : "Enter your password";
        if (sub) sub.textContent = registering
          ? "This name is free on this device. The password is stored as a hash — never as itself."
          : "Welcome back";
        if (cont) cont.textContent = registering ? "Create account" : "Continue";
      });
    }
    if (edit) edit.addEventListener("click", toStep1);
    if (back) back.addEventListener("click", toStep1);
    /* Правда вместо «Demo mode» (v47). Сервера нет — восстанавливать пароль
       некому и нечем. Единственные настоящие выходы названы прямо. */
    if (forgot) forgot.addEventListener("click", function () {
      if (forgotMsg) forgotMsg.textContent =
        "There is no server, so nobody can reset it — not even us. Enter as guest, or claim another name; this account's data stays on this device.";
    });
    if (eye && pwInput) {
      eye.addEventListener("click", function () {
        var showing = pwInput.type === "text";
        pwInput.type = showing ? "password" : "text";
        eye.setAttribute("aria-pressed", showing ? "false" : "true");
      });
    }
    if (pwInput) pwInput.addEventListener("keydown", function (ev) { if (ev.key === "Enter") { ev.preventDefault(); if (cont) cont.click(); } });

    function finish(profileId, username) {
      rawSet("sysbaby.authed", "1");
      try { sessionStorage.setItem("sysbaby.session.active", "1"); } catch (e) { /* ignore */ }
      if (username && window.sbSetUsername) window.sbSetUsername(username);
      if (window.sbDB) window.sbDB.flushSync();
      if (profileId && window.sbProfiles && profileId !== window.sbProfiles.current()) {
        window.sbProfiles.switchTo(profileId);
        return;
      }
      card.classList.add("out");
      setTimeout(function () { if (card.parentNode) card.parentNode.removeChild(card); }, 480);
      root.classList.add("sb-has-session");
      loginSuccess();
    }

    if (cont) {
      cont.addEventListener("click", function () {
        if (!pwInput || !pwInput.value) { if (pwErr) pwErr.textContent = "Enter your password."; return; }
        if (!window.sbAuth) { if (pwErr) pwErr.textContent = "Sign-in is unavailable here. Continue as guest."; return; }
        if (pwErr) pwErr.textContent = "";
        var pw = pwInput.value;
        var was = cont.textContent;
        cont.disabled = true;
        cont.textContent = registering ? "Creating…" : "Checking…";

        function refuse(msg) {
          cont.disabled = false;
          cont.textContent = was;
          if (pwErr) pwErr.textContent = msg;
          if (pwInput) { pwInput.value = ""; pwInput.focus(); }
        }

        if (registering) {
          if (pw.length < 4) { refuse("At least 4 characters."); return; }
          window.sbAuth.register(chosen, pw).then(function (prof) {
            finish(prof ? prof.id : null, chosen);
          })["catch"](function (err) {
            refuse(err && err.message === "exists" ? "That name is taken on this device." : "Could not create the account here.");
          });
          return;
        }

        /* ВХОД. Неверный пароль не пускает — в этом весь смысл двери. */
        window.sbAuth.verify(chosen, pw).then(function (okPw) {
          if (!okPw) { refuse("Wrong password."); return; }
          var prof = window.sbAuth.profileOf(chosen);
          finish(prof ? prof.id : null, chosen);
        })["catch"](function () { refuse("Could not check the password here."); });
      });
    }
    if (guest) {
      guest.addEventListener("click", function () {
        guest.disabled = true;
        finish("local", null);
      });
    }
    if (nameInput) setTimeout(function () { nameInput.focus(); }, 120);
  }

  /* sign-out farewell (§2.1) */
  window.sbSignOut = function () {
    var curtain = doc.createElement("div");
    curtain.id = "sbFarewell";
    /* Прощание показывает тот же знак, что вход и занавес, — не пустую плитку.
       Система, которая называет себя при встрече, называет себя и прощаясь. */
    curtain.innerHTML = '<div class="farewell-mark">' +
      '<svg viewBox="0 0 100 100"><path fill="currentColor" fill-rule="evenodd" d="M10.06 26.06a16 16 0 0 1 16-16h44v60h-60zM29.94 29.94h60v44a16 16 0 0 1-16 16h-44z"/></svg>' +
      '</div><p class="farewell-line"></p>';
    doc.body.appendChild(curtain);
    requestAnimationFrame(function () { curtain.classList.add("on"); });
    var line = "The system sleeps when you do, baby.";
    var out = curtain.querySelector(".farewell-line");
    var i = 0;
    var type = setInterval(function () {
      i++;
      out.textContent = line.slice(0, i);
      if (i >= line.length) clearInterval(type);
    }, Math.max(14, Math.floor(1800 / line.length)));
    setTimeout(function () {
      if (window.sbDB) window.sbDB.flushSync();
      try { localStorage.removeItem("sysbaby.authed"); } catch (e) { /* ignore */ }
      location.reload();
    }, 2400);
  };

  /* deep link ?open=<appId> */
  function deepLinkOpen() {
    var m = /[?&]open=([a-z]+)/.exec(entrySearch());
    if (!m) return;
    var id = m[1];
    setTimeout(function () { if (apps[id]) toggleApp(id); }, 350);
  }

  /* =============================================================== bootstrap */
  function boot() {
    applyFlags();
    /* restore persisted appearance before first reveal */
    var savedTheme = window.sbDB ? window.sbDB.get(THEME_KEY) : null;
    root.setAttribute("data-theme", window.sbIncognitoActive ? "dark" : (savedTheme === "light" ? "light" : "dark"));
    var acc = window.sbGetCurrentAccent();
    applyAccent(acc.a1, acc.a2);
    /* Ход переживает перезагрузку: режим сохранён, часы идут дальше — значит
       и цвет продолжается с того места, где человек его оставил, а не
       начинается заново. То же правило, что у обоев (D-095). */
    if (acc.mode === DRIFT_ID) driftStart();
    var mood = window.sbGetWallpaperMood();
    if (mood && mood !== "ocean") root.setAttribute("data-wp-mood", mood);
    ["motion", "dnd", "autohide", "transparency"].forEach(function (k) { applyControl(k, window.sbGetControlToggle(k)); });
    wireTurbo();
    /* volume and brightness come back exactly as they were left */
    var savedVol = window.sbDB ? window.sbDB.get(VOLUME_KEY) : null;
    if (savedVol != null) window.sbNotifVolume = clamp(num(savedVol, 0.6), 0, 1);
    applyBrightness(window.sbGetBrightness());

    buildDock();
    buildIcons();
    layoutIcons();
    wireDockMagnify();
    wireLogin();
    updateAppSequence();

    var started = false;
    function startBoot() {
      if (started) return;
      started = true;
      runCurtain(function () { /* curtain lifted */ });
      runBootEngine();
    }
    if (window.__sbLoginDone) setTimeout(startBoot, 650);
    else {
      doc.addEventListener("sysbaby:login-success", function () { setTimeout(startBoot, 650); }, { once: true });
      setTimeout(startBoot, 6000);           /* watchdog */
    }
    window.addEventListener("load", deepLinkOpen);
    if (doc.readyState === "complete") deepLinkOpen();
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", boot);
  else boot();

  /* ── ВЕРСИЯ СИСТЕМЫ — НАСТОЯЩАЯ И ЕДИНСТВЕННАЯ (v48, D-071) ────────────
   *
   * Основатель: «с сегодняшнего дня наша система должна начинать
   * превращаться из демонстрации в настоящую живую операционную систему
   * sys.baby OS 0.0… каждая версия должна меняться на актуальную в
   * терминале, в настройках с выходом каждого нового обновления…
   * абсолютно везде в архиве версия должна обновляться».
   *
   * Здесь было зашито release: 171 — число с прошлого лета, не связанное
   * с меткой сборки: терминал говорил «build 171», сайт — v47, и ни одно
   * обновление не меняло оба. Версий у системы больше не две, а одна, и
   * она ВЫЧИСЛЯЕТСЯ из метки сборки, которую и так обязана поднимать
   * каждая выкладка (иначе кэш не отпустит старые файлы — publish-check):
   * vN → sys.baby OS 0.0.N. Обновляется везде разом, по построению.
   */
  var bootStamp = now();
  var buildMeta = (function () {
    var m = doc.querySelector('meta[name="sysbaby-build"]');
    var v = /^v(\d+)$/.exec((m && m.content) || "");
    return v ? v[1] : "0";
  })();
  window.sbBuild = {
    build: "v" + buildMeta,
    version: "0.0." + buildMeta,
    channel: "core",
    stamp: function () { return "sys.baby OS " + this.version + " · " + this.channel + " " + this.build; },
    uptime: function () {
      var s = Math.floor((now() - bootStamp) / 1000);
      var m = Math.floor(s / 60);
      return m ? m + "m " + (s % 60) + "s" : s + "s";
    },
    report: function () {
      var keyCount = 0;
      try {
        for (var i = 0; i < localStorage.length; i++) { var k = localStorage.key(i); if (k && k.indexOf("sysbaby.") === 0) keyCount++; }
      } catch (e) { keyCount = 0; }
      var panels = window.sbPanels ? Object.keys(window.sbPanels).length : 0;
      return [
        ["build", this.stamp()],
        ["renderer", "css/dom"],
        ["storage", "local, " + keyCount + " keys"],
        ["registry", order.length + " windows, " + launchable().length + " launchable, " + panels + " panels"],
        ["uptime", this.uptime()],
        ["origin", location.origin]
      ];
    }
  };
})();
