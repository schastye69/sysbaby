/* sys.baby OS — core/desks.js
 * НЕСКОЛЬКО СТОЛОВ · СТОЛ ИНСТРУМЕНТОВ — решения D-1358 и D-1359.
 *
 * D-1358 (основатель 15.11.2026, утверждён показ demo-utverzhdeno/zvezdy-temy6.html — «сделать
 * ровно так, ничего не придумывать»). Перенесён слой столов показа (его блок «столы» и переход «Звёзды», vStars):
 *   · переход между столами — «в глубину»: звёздное поле на холсте под столом (starfield: точки без шлейфов,
 *     параллакс от глубины, мягкая «экспозиция» на пике скорости), уходящий стол растёт и размывается, его
 *     значки и заметки разлетаются от середины (каждый на свою глубину), приходящий выплывает из глубины;
 *     фон чуть «дышит» масштабом и яркостью, вуаль, вздох света и имя стола «стол i из N» — числа показа
 *     (T = 1450 мс, travel 1500, доли .62/.4, кривые EIN/EOUT) без изменений; звёзды подкрашены под тему
 *     (таблица THEMES показа: tint, bl, bloom, veil, dim, swell, alpha);
 *   · справа — шкала столов звёздами («созвездие»): крупные звёзды, тихая нить света, искра летит от прежней
 *     звезды к новой и садится вспышкой; касание звезды — к её столу, имя всплывает слева от звезды;
 *   · листать: вверх (касанием по пустому столу), колесом, стрелками ↑↓ (PageDown/PageUp); на краю — «упор»;
 *   · новый стол — пункт «новый стол» в меню «+» (как в показе: не больше трёх, на третьем — «столов уже три»,
 *     недоступно); убрать стол показ не умеет — и здесь его нет;
 *   · подсказка, когда добавлен второй стол, — голосом, слово в слово из показа: «Листайте вверх или нажимайте
 *     точки справа»; следующий — «Стол «…» — ещё глубже».
 *   «Меньше движения» — смена столов наплывом за 420 мс, как в показе.
 *
 * D-1359 (основатель 23.11.2026): «инструменты» — на ОТДЕЛЬНОМ ПОСЛЕДНЕМ столе. Там ряд раскрыт полностью и
 * инструменты в полный размер, а на первом столе они места больше не занимают: ручки «инструменты» внизу нет
 * (без дублей). Путь к ним — последняя звезда шкалы справа, отмеченная своим знаком (шесть точек ручки).
 * Про большие экраны основатель не уверен — по умолчанию стол инструментов при любой ширине (TOOLS_FROM_W).
 * D-1421 (основатель 25.11.2026): крупное время с подписью солнца — на столе инструментов (его покой — ряд и часы); на
 * первом столе — только значки и заметки. Часы на столе инструментов стоят (desk-clock-still).
 * D-1420 (основатель 25.11.2026): «Звёзды» — на всех устройствах; касание пальцем и слабое устройство — перелёт на
 * композиторе (compField: заранее нарисованные глубины, только transform/opacity, без размытия).
 *
 * Где что: первый стол — сам стол системы (#sbIconLayer, #sbWidgetLayer, #sbNoteLayer и закреплённый свет
 * #sbDeskTime); свои столы 2–3 — пустые слои #sbDesks (показ своих вещей на них не задаёт); стол инструментов —
 * #sbDeskTools в режиме «desk» (core/desktools.js). Число своих столов — sbDB «sysbaby.desks.v1».
 * Охраняется tools/desks-check.mjs. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var KEY = "sysbaby.desks.v1", MAX = 3;
  /* D-1359: с какой ширины окна инструменты живут на своём столе; 0 — при любой (основатель не уверен о больших экранах) */
  var TOOLS_FROM_W = 0;
  var mq = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  function reduced() { return mq.matches || root.getAttribute("data-motion") === "reduced"; }

  var WORDS = {
    en: { "desks.aria": "Desks", "desks.n0": "Main", "desks.n1": "Work", "desks.n2": "Home", "desks.tools": "Tools",
      "desks.of": "desk {i} of {n}", "desks.star": "desk {i}: {name}", "desks.new": "new desk", "desks.full": "three desks already",
      "desks.hint": "Swipe up or tap the dots on the right", "desks.deeper": "Desk «{name}» — one deeper",
      "desks.rename": "rename", "desks.remove": "remove", "desks.go": "go", "desks.up": "move up", "desks.down": "move down", "desks.line": "desk",
      "desks.nameAsk": "Desk name", "desks.notes.one": "{n} note", "desks.notes.many": "{n} notes", "desks.notes.few": "{n} notes",
      "desks.removed": "Desk «{name}» is resting in Echoes{what}. [bring it back]", "desks.withNotes": " — with {n}", "desks.empty": "",
      "desks.echoLine": "Desk «{name}» — {n}", "desks.restoreDesk": "bring back the desk", "desks.open": "open", "desks.noRoom": "Three desks already — make room first, then it comes back", "desks.list": "desks", "desks.listSub": "The last one is the tools desk — it is not renamed or removed" },
    ru: { "desks.aria": "Столы", "desks.n0": "Главный", "desks.n1": "Работа", "desks.n2": "Дом", "desks.tools": "Инструменты",
      "desks.of": "стол {i} из {n}", "desks.star": "стол {i}: {name}", "desks.new": "новый стол", "desks.full": "столов уже три",
      "desks.hint": "Листайте вверх или нажимайте точки справа", "desks.deeper": "Стол «{name}» — ещё глубже",
      "desks.rename": "переименовать", "desks.remove": "убрать", "desks.go": "перейти", "desks.up": "выше", "desks.down": "ниже", "desks.line": "стол",
      "desks.nameAsk": "Имя стола", "desks.notes.one": "{n} заметка", "desks.notes.few": "{n} заметки", "desks.notes.many": "{n} заметок",
      "desks.removed": "Стол «{name}» отдыхает в Эхо{what}. [вернуть]", "desks.withNotes": " — вместе с ним {n}", "desks.empty": "",
      "desks.echoLine": "Стол «{name}» — {n}", "desks.restoreDesk": "вернуть стол", "desks.open": "открыть", "desks.noRoom": "Столов уже три — освободите место, и он вернётся", "desks.list": "столы", "desks.listSub": "Последний — стол инструментов: его не переименовать и не убрать" },
    ee: { "desks.aria": "Lauad", "desks.n0": "Peamine", "desks.n1": "Töö", "desks.n2": "Kodu", "desks.tools": "Tööriistad",
      "desks.of": "laud {i} / {n}", "desks.star": "laud {i}: {name}", "desks.new": "uus laud", "desks.full": "lauda on juba kolm",
      "desks.hint": "Libistage üles või puudutage täppe paremal", "desks.deeper": "Laud «{name}» — veel sügavamal",
      "desks.rename": "nimeta ümber", "desks.remove": "eemalda", "desks.go": "mine", "desks.up": "üles", "desks.down": "alla", "desks.line": "laud",
      "desks.nameAsk": "Laua nimi", "desks.notes.one": "{n} märge", "desks.notes.few": "{n} märget", "desks.notes.many": "{n} märget",
      "desks.removed": "Laud «{name}» puhkab Kajades{what}. [too tagasi]", "desks.withNotes": " — koos sellega {n}", "desks.empty": "",
      "desks.echoLine": "Laud «{name}» — {n}", "desks.restoreDesk": "too laud tagasi", "desks.open": "ava", "desks.noRoom": "Lauda on juba kolm — tee ruumi, siis ta tuleb tagasi", "desks.list": "lauad", "desks.listSub": "Viimane on tööriistade laud — seda ümber ei nimetata ega eemaldata" }
  };
  function T_(k, v) { return T(k, v); }
  function T(k, v) {
    var l = typeof window.sbLang === "function" ? window.sbLang() : "en"; l = WORDS[l] ? l : "en";
    /* новые слова столов (25.11.2026) — в core/strings-desk.js (общий словарь sbT), здесь — прежние.
       ОТКАТ: слова нет ни здесь, ни в общем словаре (словарь ещё не пришёл) — виден сам ключ, а не пустое место */
    var s = String(WORDS[l][k] || WORDS.en[k] || (typeof window.sbT === "function" ? window.sbT(k) : k));
    return v ? s.replace(/\{(\w+)\}/g, function (m, x) { return Object.prototype.hasOwnProperty.call(v, x) ? String(v[x]) : m; }) : s;
  }

  /* звёзды подкрашены под тему — таблица показа (THEMES: tint, bl, bloom, veil, dim, swell, alpha) */
  var THEMES = {
    studio: { tint: ["255,246,236", "255,232,208", "238,238,242", "255,214,176"], bl: ["255,228,200", "236,170,120", "236,153,85"], bloom: .07, veil: .32, dim: .55, swell: .35, alpha: 1 },
    ember: { tint: ["255,222,188", "255,186,124", "255,156,88", "238,122,58"], bl: ["255,196,140", "214,104,44", "150,52,16"], bloom: .085, veil: .46, dim: .4, swell: .42, alpha: 1.08 },
    ocean: { tint: ["236,246,255", "208,230,255", "182,214,255", "226,240,255"], bl: ["206,230,255", "120,172,236", "44,145,218"], bloom: .07, veil: .3, dim: .58, swell: .35, alpha: 1 },
    aurora: { tint: ["220,255,240", "160,242,204", "200,180,255", "140,228,192"], bl: ["214,255,238", "130,220,190", "150,120,236"], bloom: .07, veil: .3, dim: .58, swell: .35, alpha: 1 }
  };
  THEMES.eclipse = THEMES.ember;
  /* ОТКАТ: таблица показа дала свет звёзд только тёмным темам; у темы без своей строки (Светлица, тема из будущего) звёзды
     светят тёплым светом Студии — первой темы дома, а не пропадают */
  function TH() { var m = window.sbGetWallpaperMood ? window.sbGetWallpaperMood() : "studio"; return THEMES[m] || THEMES.studio; }

  /* ---------- состояние ---------- */
  var n = 1, cur = 0, busy = false, built = false;
  var gauge = null, fx = null, veil = null, breathEl = null, title = null, box = null, own = [];
  /* имена своих столов (null — имя по умолчанию); стол инструментов имени не меняет */
  var names = [], ids = ["main"], removed = [];
  /* СТОЛ ИНСТРУМЕНТОВ — ТОЖЕ СТОЛ (основатель 25.11.2026): его можно переименовать (знак звезды остаётся) и убрать в Эхо, как
     свой стол (вариант «А»; системный — развеять нельзя, только вернуть: «вернуть инструменты» в пульте). Шкалу можно скрыть
     (Настройки) — тогда на экране не видно, что столов больше одного. Система помнит, на каком столе её оставили (savedAt). */
  var toolsGone = false, toolsName = null, hideG = false, savedAt = null, loaded = false;
  function readNames() {
    var o = null; try { o = JSON.parse((window.sbDB && window.sbDB.get(KEY)) || "null"); } catch (e) { o = null; }
    names = o && Array.isArray(o.names) ? o.names.slice(0, MAX).map(function (x) { return typeof x === "string" && x.trim() ? x.trim().slice(0, 40) : null; }) : [];
    ids = o && Array.isArray(o.ids) ? o.ids.slice(0, MAX).map(function (x) { return typeof x === "string" ? x.replace(/[^\w-]/g, "").slice(0, 24) : ""; }) : []; ids[0] = "main";
    /* убранные столы — целиком, с заметками (в Эхо одной строкой; D-1358, вариант основателя «А») */
    removed = o && Array.isArray(o.removed) ? o.removed.filter(function (r) { return r && r.id && Array.isArray(r.notes); }) : [];
    if (o) loaded = true;
    toolsGone = !!(o && o.toolsGone); toolsName = o && typeof o.toolsName === "string" && o.toolsName.trim() ? o.toolsName.trim().slice(0, 40) : null;
    hideG = !!(o && o.hideGauge); savedAt = o && typeof o.at === "string" ? o.at.replace(/[^\w-]/g, "").slice(0, 24) : null;
  }
  function newId() { return "d" + Date.now().toString(36) + Math.floor(Math.random() * 1296).toString(36); }
  function readN() { var o = null; try { o = JSON.parse((window.sbDB && window.sbDB.get(KEY)) || "null"); } catch (e) { o = null; } var k = o && +o.n; return k >= 1 && k <= MAX ? Math.round(k) : 1; }
  function writeN() { try { if (window.sbDB && !(window.sbDB.closed && window.sbDB.closed())) window.sbDB.set(KEY, JSON.stringify({ n: n, names: names, ids: ids, removed: removed, toolsGone: toolsGone, toolsName: toolsName, hideGauge: hideG, at: idOf(cur) })); } catch (e) { /* закрыто — останется до двери */ } }
  /* ширина окна — запомненная до следующего resize: чтение innerWidth после правки DOM заставляет браузер пересчитать
     стили и раскладку; в цикле шкалы (total()/toolsAt() на каждой звезде) это было 4–6 пересчётов прямо в ответе на
     «новый стол / убрать / вернуть» (×4, профиль: ~20 мс из 25) */
  var vwC = 0;
  window.addEventListener("resize", function () { vwC = 0; }, true);
  function toolsOn() { return !toolsGone && (vwC || (vwC = window.innerWidth)) >= TOOLS_FROM_W; }
  function total() { return n + (toolsOn() ? 1 : 0); }
  function toolsAt() { return toolsOn() ? n : -1; }
  /* ОТКАТ: стол, которому человек не дал имени (names[i] пусто), зовётся своим словом по номеру — «Работа», «Третий» */
  function nameOf(i) { return i === toolsAt() ? toolsName || T("desks.tools") : names[i] || T("desks.n" + i); }

  /* ---------- раскладка показа: «d» — от 1280×800, «p» — телефон (уже 700) ---------- */
  var M = "d", sc = 1, W = 0, H = 0;
  function fit() {
    var iw = window.innerWidth, ih = window.innerHeight; M = iw < 700 ? "p" : "d";
    var D = M === "p" ? { W: 390, H: 844 } : { W: 1280, H: 800 };
    sc = Math.min(iw / D.W, ih / D.H); if (M === "p") sc = Math.min(sc, iw / 360);
    W = iw; H = ih;
    fxSize();
    if (gauge) { gauge.style.setProperty("--sbd-k", String(sc)); gauge.classList.toggle("p", M === "p"); }
    if (title) { title.style.top = Math.round(M === "p" ? H * .44 : H * .6) + "px"; title.style.setProperty("--sbd-k", String(sc)); }
  }

  /* ---------- слои столов ---------- */
  function DTc() { return doc.getElementById("sbDeskTime"); }
  function OV() { return doc.getElementById("sbDeskTools"); }
  function layerOf(i) {
    if (i === 0) {
      var els = ["sbIconLayer", "sbWidgetLayer"].map(function (id) { return doc.getElementById(id); }).filter(Boolean);
      var items = [].slice.call(doc.querySelectorAll("#sbIconLayer .desk-icon")).filter(function (e) { var r = e.getBoundingClientRect(); return r.width && r.height && r.bottom > 0 && r.top < H; });
      /* D-1421: крупные часы — на столе инструментов; свет середины первого стола — только идущий таймер/секундомер/будильник */
      var lit = !!(window.sbDeskTime && window.sbDeskTime.info && window.sbDeskTime.info().mode);
      return { di: 0, els: els, items: items.map(function (e) { var r = e.getBoundingClientRect(); return { el: e, cx: r.left + r.width / 2, cy: r.top + r.height / 2 }; }), notes: notesOf(0), dt: lit };
    }
    if (i === toolsAt()) return { di: i, els: [OV()].filter(Boolean), items: [], notes: [], dt: true };
    return { di: i, els: [own[i - 1]].filter(Boolean), items: [], notes: notesOf(i), dt: false };
  }
  /* ЗАМЕТКИ ПО СТОЛАМ (D-1358): у каждой заметки свой стол (data-desk; без отметки — первый). Слой заметок один — видно
     только заметки столов из набора (в покое — нынешний, в перелёте — оба). */
  /* ОТКАТ: стол без записанного id (старая запись до D-1358) — «-», ничей: его заметки не приписываются чужому столу */
  /* стол инструментов — свой id «tools»: на нём тоже живут заметки (касание пустого места — заметка, основатель 25.11.2026) */
  function idOf(i) { return i === 0 ? "main" : i === toolsAt() ? "tools" : ids[i] || "-"; }
  function notesOf(i) {
    var id = idOf(i);
    return [].slice.call(doc.querySelectorAll("#sbNoteLayer .sticky-note")).filter(function (e) { return (e.getAttribute("data-desk") || "main") === id; })
      .map(function (e) { var r = e.getBoundingClientRect(); return { el: e, cx: r.left + r.width / 2, cy: r.top + r.height / 2 }; }).filter(function (it) { return it.cy > -200 && it.cy < H + 200; });
  }
  /* видимость заметок — пометкой на самой заметке (а не сменой таблицы стилей: она пересчитывала весь документ);
     новые заметки (перерисовка слоя) помечаются наблюдателем слоя */
  var noteShow = ["main"], noteObs = null;
  function markNotes() {
    [].forEach.call(doc.querySelectorAll("#sbNoteLayer > .sticky-note"), function (e) { mark(e, "data-sbd-hide", noteShow.indexOf(e.getAttribute("data-desk") || "main") < 0); });
  }
  function showNotes(list) {
    noteShow = list.slice(); markNotes();
    var L = doc.getElementById("sbNoteLayer");
    if (!noteObs && L && window.MutationObserver) { noteObs = new MutationObserver(markNotes); noteObs.observe(L, { childList: true }); }
  }
  /* ЧТО ВИДНО — ПОМЕТКАМИ НА САМИХ СЛОЯХ, а не классом на <html> (замер ×4, Performance: класс корня пересчитывал стили
     всего документа (18–33 мс) и будил наблюдателей корня в gate.js, panels.js, tainik.js — ровно в кадрах смены стола).
     Пометка data-sbd-off на слое пересчитывает только его поддерево. */
  var shown = { main: true, tools: false };
  function mark(el, attr, on) { if (!el) return; if (on) { if (!el.hasAttribute(attr)) el.setAttribute(attr, ""); } else if (el.hasAttribute(attr)) el.removeAttribute(attr); }
  function paintShown() {
    ["sbIconLayer", "sbWidgetLayer"].forEach(function (id) { mark(doc.getElementById(id), "data-sbd-off", !shown.main); });
    mark(DTc(), "data-sbd-off", !shown.main && !shown.tools);
    var o = OV(); if (o) mark(o, "data-sbd-away", cur !== 0);
  }
  function showFor(i, on) {
    if (i === 0) { shown.main = on; paintShown(); }
    else if (i === toolsAt()) { shown.tools = on; paintShown(); }
    else if (own[i - 1]) own[i - 1].classList.toggle("on", on);
  }
  function flightMarks(on, lite) {
    var o = OV(); if (o) mark(o, "data-sbd-flight", on);
    ["sbIconLayer", "sbNoteLayer"].forEach(function (id) { mark(doc.getElementById(id), "data-sbd-lite", !!lite); });
  }
  var armedMain = false;   /* первый стол больше не гаснет своим слоем (data-sbd-dim): в перелёте его несёт масштаб и прозрачность */
  /* перелёт на композиторе: ряд стола инструментов собран заранее, в простое (sbDeskTools.arm — ряд стоит на своём месте
     прозрачным своим слоем); приход на стол инструментов только проявляет его — ни одной перестройки в кадрах перелёта */
  function armTools() {
    if (!useComp() || reduced()) return;
    if (busy || cur !== 0 || !window.sbDeskTools || !window.sbDeskTools.arm || !window.sbDeskTools.arm()) {
      if (!(window.sbDeskTools && window.sbDeskTools.armed && window.sbDeskTools.armed())) setTimeout(function () { idle(armTools, 1500); }, 2000);
    }
  }
  function settle() {
    var armT = armedMain && cur === toolsAt();
    ["sbIconLayer", "sbWidgetLayer", "sbNoteLayer"].forEach(function (id) { mark(doc.getElementById(id), "data-sbd-dim", armT); });
    shown.main = cur === 0 || armT; shown.tools = cur === toolsAt(); paintShown();
    for (var i = 1; i < total(); i++) if (i !== toolsAt() && own[i - 1]) own[i - 1].classList.toggle("on", i === cur);
    /* своим столам касание достаётся столу системы (заметки); перехватчик — только у стола инструментов */
    /* перехватчика касаний на столе инструментов больше нет: касание мимо инструментов — пустое место стола, и оно, как на
       любом столе, предлагает заметку (desktop.js); в перелёте перехватчик стоит (go) */
    if (box) box.classList.remove("on");
    if (built) saveAtLater();
    showNotes(armT ? ["main"] : [idOf(cur)]);
  }

  /* ---------- шкала: созвездие ---------- */
  var DOTS = '<span class="sbd-sign" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>';
  function gaugeBuild() {
    if (!gauge) return;
    gauge.setAttribute("aria-label", T("desks.aria"));
    gauge.innerHTML = '<i class="thr" aria-hidden="true"></i><i class="spk" aria-hidden="true"></i><i class="blm" aria-hidden="true"></i>';
    for (var i = 0; i < total(); i++) {
      var b = doc.createElement("button"), tools = i === toolsAt();
      b.type = "button"; b.dataset.g = String(i); if (tools) b.className = "tools";
      b.setAttribute("aria-label", T("desks.star", { i: i + 1, name: nameOf(i) }));
      b.innerHTML = '<span class="nm">' + nameOf(i).replace(/[<&]/g, "") + '</span><span class="st" aria-hidden="true"><i class="hl"></i>' + (tools ? DOTS : '<i class="cr"></i>') + "</span>";
      (function (b) { var tt = 0; b.addEventListener("pointerdown", function () { b.classList.add("tap", "show"); clearTimeout(tt); tt = setTimeout(function () { b.classList.remove("tap", "show"); }, 1500); }); })(b);
      gauge.appendChild(b);
    }
    /* один стол — шкалы нет; «скрыть шкалу» (Настройки) — тоже нет, переходы — пульт и клавиши */
    gauge.classList.toggle("off", total() < 2 || hideG);
    gaugeMark();
    /* нить созвездия: звёзды стоят столбцом с постоянным шагом, верхняя — у края шкалы; шаг и край меряются один раз
       (на сборке и после resize), дальше нить считается без чтения раскладки — ответ на «новый стол / убрать / вернуть»
       не ждёт пересчёта всей страницы (×4: ~9 мс на каждое чтение offsetTop после правки DOM) */
    var bs = gBtns(); if (bs.length > 1) {
      var th = gauge.querySelector(".thr"), key = gauge.classList.contains("p") ? "p" : "d", g = thrK[key];
      if (!g) { var ys = bs.map(gY), a = Math.min.apply(null, ys), z = Math.max.apply(null, ys); g = { y0: a, step: (z - a) / (bs.length - 1) }; if (g.step > 0) thrK[key] = g; }
      th.style.top = (g.y0 - 14) + "px"; th.style.height = ((bs.length - 1) * g.step + 28) + "px";
    }
  }
  var thrK = {};
  window.addEventListener("resize", function () { thrK = {}; }, true);
  function gBtns() { return gauge ? [].slice.call(gauge.querySelectorAll("button")) : []; }
  function gY(b) { return b.offsetTop + b.offsetHeight / 2; }
  var gmT = 0;
  function gaugeMark(show) {
    gBtns().forEach(function (b, i) { b.classList.toggle("cur", i === cur); b.setAttribute("aria-current", i === cur ? "true" : "false"); b.classList.toggle("show", !!show && i === cur); });
    clearTimeout(gmT); if (show) gmT = setTimeout(function () { gaugeMark(); }, 1700);
  }
  /* искра летит по нити от прежней звезды к новой и садится маленькой вспышкой */
  var gfT = 0;
  function gaugeFly(from, to) {
    var bs = gBtns(); clearTimeout(gfT);
    if (reduced() || !bs[from] || !bs[to]) { gaugeMark(true); return; }
    bs.forEach(function (b, i) { b.classList.remove("cur", "show"); b.setAttribute("aria-current", i === to ? "true" : "false"); });
    var y0 = gY(bs[from]), y1 = gY(bs[to]), sp = gauge.querySelector(".spk"), bl = gauge.querySelector(".blm"), Dt = 1000, d0 = 140;
    sp.animate([{ transform: "translateY(" + y0 + "px) scale(.5)", opacity: 0 }, { opacity: 1, offset: .16 }, { opacity: 1, offset: .86 }, { transform: "translateY(" + y1 + "px) scale(1)", opacity: 0 }], { duration: Dt, delay: d0, easing: EM(), fill: "both" });
    gfT = setTimeout(function () {
      bl.animate([{ transform: "translateY(" + y1 + "px) scale(.3)", opacity: 0 }, { transform: "translateY(" + y1 + "px) scale(.85)", opacity: 1, offset: .28 }, { transform: "translateY(" + y1 + "px) scale(1.45)", opacity: 0 }], { duration: 850, easing: EE(), fill: "both" });
      gaugeMark(true);
    }, d0 + Dt * .88);
  }

  /* ---------- СЛАБОЕ УСТРОЙСТВО (основатель 23.11.2026: «скорость на слабых устройствах, нигде без задержек»;
     25.11.2026: «не слабые устройства» — прежний признак считал слабым почти любой телефон и планшет) ----------
     Слабым устройство считается только по-настоящему: (1) чистая работа процессора в простое (медиана семи проб) дольше
     BENCH_MS — проба без чтения холста (на телефоне чтение пикселей ждёт видеочип и мерило не процессор, а обмен с ним);
     (2) кадр стола в покое длиннее IDLE_MS (меньше 25 кадров в секунду: экран, ограниченный 30 Гц, — 33 мс — не слабость);
     (3) прошлый перелёт добавил к обычному кадру больше FLIGHT_ADD_MS — ровно мера закона D-1360.
     Слабое устройство летит ТЕМ ЖЕ перелётом «Звёзды» на композиторе (compField), только звёзд в 2,5 раза меньше (одна глубина) и вещи стола
     уходят вместе со столом, а не каждая своим слоем. */
  var BENCH_MS = 4.5, IDLE_MS = 40, FLIGHT_ADD_MS = 20, weak = false, lastFlight = 0, idleCad = 16.7;
  function med(a) { var d = a.slice(1).map(function (x, i) { return x - a[i]; }).sort(function (x, y) { return x - y; }); return d.length ? d[d.length >> 1] : 0; }
  function setWeak(v) { if (v && !weak) { weak = true; pool = null; comp = null; idle(compPrep, 1500); idle(armTools, 3000); } }
  /* проба в простое: только процессор (синусы и случайные числа), без холста; обычная машина — около 2 мс */
  function bench() {
    var t = performance.now(), q = 0;
    for (var i = 0; i < 60000; i++) q += Math.sin(i) * Math.random();
    return performance.now() - t + (q > 1e9 ? 1 : 0);
  }
  function probe() {
    var a = [], k = function (t) { a.push(t); if (a.length < 24) requestAnimationFrame(k); else { idleCad = Math.max(1, med(a)); setWeak(idleCad > IDLE_MS); } };
    requestAnimationFrame(k);
    var b = [], step = function () { b.push(bench()); if (b.length < 7) idle(step, 800); else { b.sort(function (p, q) { return p - q; }); setWeak(b[3] > BENCH_MS); } };
    idle(step, 800);
  }
  /* кадры перелёта: перелёт добавил к обычному кадру больше FLIGHT_ADD_MS — следующий перелёт облегчить */
  function watchFlight() { var a = [], on = true, k = function (t) { a.push(t); if (on) requestAnimationFrame(k); }; requestAnimationFrame(k); return function () { on = false; lastFlight = med(a); setWeak(lastFlight > Math.max(idleCad, 16.7) + FLIGHT_ADD_MS); }; }
  var pool = null;
  function makePool() {
    var Wd = W / sc, Hd = H / sc, N = (M === "p" ? 520 : 900), TN = TH().tint, ps = [];
    if (weak) N = Math.round(N * .3);
    for (var i = 0; i < N; i++) { var r3 = Math.pow(Math.random(), 3); ps.push({ x: (Math.random() * 2 - 1) * Wd * 1.15, y: (Math.random() * 2 - 1) * Hd * 1.15, z: 40 + Math.random() * 2600, r: .55 + r3 * 1.7, b: .45 + Math.random() * .55, s: starSpr(TN[Math.random() < .55 ? 0 : (Math.random() * 4) | 0]) }); }
    pool = { ps: ps, key: M + W + "x" + H + TN[0] + weak };
  }
  function idle(fn, ms) { if (window.requestIdleCallback) requestIdleCallback(fn, { timeout: ms || 1500 }); else setTimeout(fn, 60); }
  /* холст звёзд: живой перелёт — во всё разрешение экрана; перелёт на композиторе — заранее нарисованный (compPrep) */
  function fxSize() { if (!fx) return; if (useComp()) { comp = null; idle(compPrep, 1500); return; } var dpr = Math.min(3, window.devicePixelRatio || 1); fx.width = Math.round(W * dpr); fx.height = Math.round(H * dpr); FX.k = dpr; }

  /* ---------- ПЕРЕЛЁТ НА КОМПОЗИТОРЕ (основатель 25.11.2026: «Звёзды» на всех устройствах) ----------
     Телефон, планшет (касание пальцем) и слабое устройство летят тем же перелётом «в глубину», но дёшево: звёздное поле
     нарисовано заранее, в простое, тремя глубинами (дальняя — сам #sbDesksFx, средняя, ближняя) и вспышкой света; в
     перелёте ни один холст не перерисовывается — глубины только растут от середины (transform: scale) и гаснут (opacity),
     каждая со своей скоростью — так и выходит параллакс показа: ближние звёзды несутся к краям, дальние едва плывут.
     Путь камеры — та же «тяжёлая» кривая показа eio, выбранная по точкам (ключевые кадры; между ними — без своей кривой, по умолчанию анимации). Слои стола
     — тот же масштаб и прозрачность показа, без размытия (filter: blur в кадрах нет); размытие держит вуаль. На столе
     с мышью и обычным процессором — прежний живой перелёт показа без изменений. */
  var coarse = window.matchMedia ? matchMedia("(pointer: coarse)") : { matches: false };
  function useComp() { return weak || coarse.matches; }
  var comp = null, compEls = null;
  /* глубины: доля звёзд, размер, яркость, во сколько раз вырастает слой за перелёт */
  var DEPTHS = [{ n: .5, r: [.6, 1.3], b: [.45, .95], grow: 1.35 }, { n: .32, r: [.7, 1.5], b: [.45, .9], grow: 2.2 }, { n: .18, r: [1, 2.1], b: [.6, 1], grow: 3.4 }];
  function compCanvases() {
    if (compEls && compEls[0].isConnected) return compEls;
    var host = fx.parentNode, mk = function (cls) { var c = doc.createElement("canvas"); c.className = "sbd-fx " + cls; c.setAttribute("aria-hidden", "true"); return c; };
    var bloom = mk("bloom"), mid = mk("mid"), near = mk("near");
    host.insertBefore(bloom, fx); host.insertBefore(mid, fx.nextSibling); host.insertBefore(near, mid.nextSibling);
    return (compEls = [bloom, fx, mid, near]);
  }
  function compPrep() {
    if (!fx || !fx.parentNode || reduced() || !useComp()) return null;
    var TN = TH().tint, BL = TH().bl, key = W + "x" + H + TN[0] + weak;
    if (comp && comp.key === key) return comp;
    var els = compCanvases(), dpr = Math.min(1.5, window.devicePixelRatio || 1);
    /* холст не больше ~1,6 Мп: заранее нарисованные глубины держит видеопамять (планшет 1728×1080 — около 1×) */
    var k = Math.max(.5, Math.min(weak ? Math.min(1, dpr) : dpr, Math.sqrt(1.6e6 / Math.max(1, W * H)))), N = Math.round((M === "p" ? 520 : 900) * (weak ? .4 : 1));
    for (var d = 0; d < 3; d++) {
      var c = els[d + 1], D = DEPTHS[d], x = c.getContext("2d"), n = Math.round(N * (weak ? (d ? 0 : 1) : D.n));
      c.width = Math.round(W * k); c.height = Math.round(H * k); x.setTransform(k, 0, 0, k, 0, 0); x.clearRect(0, 0, W, H);
      x.globalCompositeOperation = "lighter";
      for (var i = 0; i < n; i++) {
        var r = (D.r[0] + Math.pow(Math.random(), 3) * (D.r[1] - D.r[0])) * Math.max(1, sc), sz = r * 4.4;
        x.globalAlpha = D.b[0] + Math.random() * (D.b[1] - D.b[0]);
        x.drawImage(starSpr(TN[Math.random() < .55 ? 0 : (Math.random() * 4) | 0]), Math.random() * W - sz / 2, Math.random() * H - sz / 2, sz, sz);
      }
      x.globalAlpha = 1;
    }
    /* вспышка света на пике скорости (bloom показа) — малым холстом, растянутым композитором */
    var bl = els[0], bw = 64, bh = Math.max(16, Math.round(64 * H / Math.max(1, W))), bx = bl.getContext("2d"), g = bx.createRadialGradient(bw / 2, bh * .52, 0, bw / 2, bh * .52, Math.max(bw, bh) * .75);
    bl.width = bw; bl.height = bh; g.addColorStop(0, "rgba(" + BL[0] + ",1)"); g.addColorStop(.35, "rgba(" + BL[1] + ",.35)"); g.addColorStop(1, "rgba(" + BL[2] + ",0)");
    bx.fillStyle = g; bx.fillRect(0, 0, bw, bh);
    return (comp = { key: key, els: els });
  }
  /* камера: та же кривая eio, что у живого поля, — по точкам; глубина d растёт в grow раз (назад — наоборот) */
  function compField(o) {
    var C = compPrep(); if (!C) return [];
    var out = [], TT = TH(), fw = o.dir > 0, P = 12;
    C.els.forEach(function (e, i) { if (!weak || i === 1) e.setAttribute("data-sbd-run", ""); });
    /* слабое устройство — одна глубина (дальняя, #sbDesksFx) без вспышки: один слой композитора вместо четырёх */
    var nd = weak ? 1 : 3;
    for (var d = 0; d < nd; d++) {
      var g = DEPTHS[d].grow, kf = [];
      for (var i = 0; i <= P; i++) {
        var u = i / P, E = eio(u), s = fw ? 1 + (g - 1) * E : g - (g - 1) * E;
        /* огибающая показа: свет набирается за первые 14 %, гаснет за последние 30 % (ближние гаснут раньше — улетели) */
        var A = Math.min(1, u / .14) * Math.min(1, (1 - u) / (.3 + d * .08)) * (o.alpha || 1);
        kf.push({ transform: "scale(" + s.toFixed(4) + ")", opacity: Math.max(0, Math.min(1, A)).toFixed(3) });
      }
      out.push(C.els[d + 1].animate(kf, { duration: o.T, fill: "forwards" }));
    }
    var bk = []; for (var j = 0; j <= P; j++) { var v = vel(j / P), A2 = Math.min(1, (j / P) / .14) * Math.min(1, (1 - j / P) / .3); bk.push({ opacity: (Math.min(1, (TT.bloom || .07) * 6) * v * A2).toFixed(3) }); }
    if (!weak) out.push(C.els[0].animate(bk, { duration: o.T, fill: "forwards" }));
    /* конец: глубины уже погасли (последний ключевой кадр — прозрачность 0) — снять пометку и анимации, если новых нет */
    fin(out).then(function () { if (C.els[1].getAnimations().some(function (x) { return out.indexOf(x) < 0; })) return; C.els.forEach(function (e) { e.removeAttribute("data-sbd-run"); }); out.forEach(function (x) { try { x.cancel(); } catch (e) { /* уже снята */ } }); });
    return out;
  }
  /* сначала все чтения, потом все записи — без дёрганья раскладки на каждом слое */
  function origins(list) {
    var rs = list.map(function (el) { return el.id === "sbDeskTime" && el.parentNode ? el.parentNode.getBoundingClientRect() : el.getBoundingClientRect(); });
    list.forEach(function (el, i) { el.style.transformOrigin = Math.round(W / 2 - rs[i].left) + "px " + Math.round(H * .52 - rs[i].top) + "px"; });
  }

  /* ---------- звёздное поле (холст под столом) ----------
     в покое пустой холст во весь экран не стоит на экране (core/desks.css, data-sbd-run): только пока летят звёзды */
  var FX = { k: 1, list: [], run: false };
  function fxLoop() {
    var c = fx.getContext("2d"), t = performance.now();
    c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, fx.width, fx.height); c.setTransform(FX.k, 0, 0, FX.k, 0, 0);
    c.globalCompositeOperation = "lighter";
    FX.list = FX.list.filter(function (e) { return e.draw(c, t); });
    if (FX.list.length) requestAnimationFrame(fxLoop); else { FX.run = false; c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, fx.width, fx.height); fx.removeAttribute("data-sbd-run"); }
  }
  function fxAdd(e) { FX.list.push(e); if (!FX.run) { FX.run = true; fx.setAttribute("data-sbd-run", ""); requestAnimationFrame(fxLoop); } }
  var SPR = {};
  function starSpr(rgb) {
    if (SPR[rgb]) return SPR[rgb];
    var s = doc.createElement("canvas"); s.width = s.height = 64; var c = s.getContext("2d"), g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(" + rgb + ",1)"); g.addColorStop(.12, "rgba(" + rgb + ",.9)"); g.addColorStop(.3, "rgba(" + rgb + ",.28)"); g.addColorStop(.6, "rgba(" + rgb + ",.06)"); g.addColorStop(1, "rgba(" + rgb + ",0)");
    c.fillStyle = g; c.fillRect(0, 0, 64, 64); return (SPR[rgb] = s);
  }
  function eio(u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; }        /* «тяжёлый» in-out */
  function vel(u) { return Math.pow(Math.sin(Math.PI * Math.min(1, Math.max(0, u))), 2); }  /* скорость камеры ~ производная */
  function starfield(o) {
    var Wd = W / sc, Hd = H / sc;   /* поле — в единицах показа, как там (stage scale) */
    var cx = Wd / 2, cy = Hd * .52, f = Math.max(Wd, Hd) * .62, ZR = 2600, ps = [], N = 0, TN = TH().tint, BL = TH().bl;
    /* частицы — из заготовки простоя (та же раскладка, что и на месте); следующая готовится в простое */
    if (pool && pool.key === M + W + "x" + H + TN[0] + weak) { ps = pool.ps; pool = null; } else N = (M === "p" ? 520 : 900) * (weak ? .3 : 1);
    idle(makePool);
    for (var i = 0; i < N; i++) { var r3 = Math.pow(Math.random(), 3); ps.push({ x: (Math.random() * 2 - 1) * Wd * 1.15, y: (Math.random() * 2 - 1) * Hd * 1.15, z: 40 + Math.random() * ZR, r: .55 + r3 * 1.7, b: .45 + Math.random() * .55, s: starSpr(TN[Math.random() < .55 ? 0 : (Math.random() * 4) | 0]) }); }
    var t0 = performance.now();
    fxAdd({ draw: function (c, t) {
      var u = (t - t0) / o.T; if (u < 0) return true; if (u >= 1) return false;
      c.setTransform(FX.k * sc, 0, 0, FX.k * sc, 0, 0);
      var E = eio(u), v = vel(u), shift = o.dir * o.travel * E, A = Math.min(1, u / .14) * Math.min(1, (1 - u) / .3) * (o.alpha || 1);
      c.globalCompositeOperation = "lighter";
      if (o.bloom) { var R = Math.max(Wd, Hd) * .75, g = c.createRadialGradient(cx, cy, 0, cx, cy, R), a = o.bloom * v * A; g.addColorStop(0, "rgba(" + BL[0] + "," + a.toFixed(3) + ")"); g.addColorStop(.35, "rgba(" + BL[1] + "," + (a * .35).toFixed(3) + ")"); g.addColorStop(1, "rgba(" + BL[2] + ",0)"); c.fillStyle = g; c.fillRect(0, 0, Wd, Hd); }
      for (var j = 0; j < ps.length; j++) {
        var p = ps[j], z = p.z - shift; z = ((z - 40) % ZR + ZR) % ZR + 40;
        var k = f / z, sx = cx + p.x * k, sy = cy + p.y * k; if (sx < -8 || sy < -8 || sx > Wd + 8 || sy > Hd + 8) continue;
        var al = A * p.b * Math.min(1, (ZR + 40 - z) / 800) * Math.min(1, (z - 40) / 160); if (al < .01) continue;
        var sz = Math.min(3.4, p.r * (.6 + 300 / z)) * (1 + (o.swell || .3) * v);
        c.globalAlpha = Math.min(1, al); c.drawImage(p.s, sx - sz * 2.2, sy - sz * 2.2, sz * 4.4, sz * 4.4);
      }
      c.globalAlpha = 1; return true;
    } });
  }

  /* ---------- переход «Звёзды» (vStars показа) ---------- */
  var EIN = "cubic-bezier(.6,0,.82,.36)", EOUT = "cubic-bezier(.16,.84,.3,1)";
  /* кривые шкалы (core.css: --ease-move, --ease-enter; easing-scale-check): строки переходов, которые назначает код,
     говорят словом шкалы — его число спрашивается у корня в миг перехода, своего числа здесь нет */
  function curve(w) {
    var v = getComputedStyle(root).getPropertyValue(w).trim();
    /* ОТКАТ: ядро стилей ещё не пришло (слово пусто) — переход идёт прямой, а не падает: пустую кривую браузер не примет */
    return v || "linear";
  }
  function EM() { return curve("--ease-move"); }
  function EE() { return curve("--ease-enter"); }
  /* занавес и имя стола в покое не стоят на экране вовсе (visibility: hidden, core/desks.css): пустой слой во весь экран
     поверх стола — тоже слой, о него спотыкаются и чтение экрана, и приборы касания и контраста. Пометка ставится на
     время своих анимаций и снимается, когда на слое не осталось ни одной — только на нём самом, не на корне */
  function run(host, a) {
    host.setAttribute("data-sbd-run", "");
    a.finished.catch(function () { /* снято */ }).then(function () {
      if (!(host.getAnimations ? host.getAnimations({ subtree: true }).length : 0)) host.removeAttribute("data-sbd-run");
    });
    return a;
  }
  function anim(el, kf, o) { var a = el.animate(kf, Object.assign({ fill: "both" }, o)); return a; }
  function fin(list) { return Promise.all(list.map(function (a) { return a.finished.catch(function () { /* отменено */ }); })); }
  function origin(el) {
    var p = el.id === "sbDeskTime" && el.parentNode ? el.parentNode.getBoundingClientRect() : el.getBoundingClientRect();
    el.style.transformOrigin = Math.round(W / 2 - p.left) + "px " + Math.round(H * .52 - p.top) + "px";
  }
  function off(it, k) { return [(it.cx - W / 2) * k, (it.cy - H * .52) * k]; }
  var touched = [];
  /* уборка после перелёта — своих анимаций и точек масштаба; зовётся в простое, а не в кадре конца перелёта */
  function cleanAll(list, els) { (list || []).forEach(function (a) { try { a.cancel(); } catch (e) { /* уже снята */ } }); (els || []).forEach(function (e) { if (!busy || !e.getAnimations().length) e.style.transformOrigin = ""; }); }
  function vStars(A, B, dir, T, swap) {
    var l = [], fw = dir > 0, TT = TH(), cm = useComp();
    /* касание пальцем и слабое устройство — поле на композиторе (заранее нарисованное); мышь — живое поле показа */
    if (cm) compField({ dir: dir, T: T + 150, alpha: TT.alpha }); else starfield({ dir: dir, T: T + 150, travel: 1500, bloom: TT.bloom, swell: TT.swell, alpha: TT.alpha });
    var KA = [{ scale: "1", filter: "blur(0px)", opacity: 1 }, { scale: String(fw ? 1.12 : .93), filter: "blur(1px)", opacity: .9, offset: .3 }, { scale: String(fw ? 1.9 : .5), filter: "blur(14px)", opacity: 0 }];
    var KB = [{ scale: String(fw ? .52 : 1.7), filter: "blur(9px)", opacity: 0 }, { filter: "blur(4px)", opacity: .55, offset: .35 }, { scale: String(fw ? 1.012 : .992), filter: "blur(1.2px)", opacity: 1, offset: .72 }, { scale: "1", filter: "blur(0px)", opacity: 1 }];
    /* перелёт на композиторе: размытие больших слоёв — самая дорогая часть кадра; без него — только масштаб и прозрачность */
    if (cm) [KA, KB].forEach(function (K) { K.forEach(function (f) { delete f.filter; }); });
    /* слабое устройство: та же глубина, короче ход — уходящий стол растёт до 1,3 (а не 1,9), приходящий выплывает с 0,8:
       растр слоя под наибольший масштаб анимации — в 2 раза меньше точек, кадр композитора короче */
    if (weak) { KA[KA.length - 1].scale = String(fw ? 1.3 : .8); KB[0].scale = String(fw ? .8 : 1.25); }
    var dt0 = DTc();
    origins(A.els.concat(B.els, (A.notes || []).map(function (it) { return it.el; }), (B.notes || []).map(function (it) { return it.el; }), dt0 && (A.dt || B.dt) ? [dt0] : []));
    A.els.forEach(function (e) { touched.push(e); l.push(anim(e, KA, { duration: T * .62, easing: EIN })); });
    /* глубина вещи — тот же хеш показа: dep = fract(sin((i + 1)·12.9898 + стол·78.233)·43758.5453) */
    /* слабое устройство: вещи не разлетаются каждая своим слоем (меньше слоёв — короче передача кадра); стол уходит целиком */
    if (!weak) A.items.forEach(function (it, i) { var dep = ((Math.sin((i + 1) * 12.9898 + A.di * 78.233) * 43758.5453) % 1 + 1) % 1, k = fw ? .2 + dep * .5 : -.12, d = off(it, k); touched.push(it.el); l.push(anim(it.el, [{ translate: "0px 0px" }, { translate: d[0] + "px " + d[1] + "px" }], { duration: T * .62, easing: EIN })); });
    B.els.forEach(function (e) { touched.push(e); l.push(anim(e, KB, { duration: T * .62, delay: T * .4, easing: EOUT })); });
    /* заметки стола уходят и приходят вместе с ним (масштаб от середины экрана), уходящие ещё и разлетаются */
    (A.notes || []).forEach(function (it, i) { var e = it.el, dep = ((Math.sin((i + 7) * 12.9898 + A.di * 78.233) * 43758.5453) % 1 + 1) % 1, d = off(it, fw ? .2 + dep * .5 : -.12); touched.push(e);
      l.push(anim(e, KA.map(function (f, j) { return Object.assign({}, f, { translate: j === KA.length - 1 ? d[0] + "px " + d[1] + "px" : j === 0 ? "0px 0px" : (d[0] * .3) + "px " + (d[1] * .3) + "px" }); }), { duration: T * .62, easing: EIN })); });
    (B.notes || []).forEach(function (it) { touched.push(it.el); l.push(anim(it.el, KB, { duration: T * .62, delay: T * .4, easing: EOUT })); });
    /* свет середины (#sbDeskTime) — один холст на оба стола: уходит со старым и приходит с новым одним ходом */
    var dt = DTc();
    if (dt && (A.dt || B.dt)) {
      touched.push(dt);
      if (A.dt && B.dt) {
        l.push(anim(dt, [KA[0], { scale: KA[1].scale, filter: KA[1].filter, opacity: .9, offset: .18 }, { scale: KA[2].scale, filter: KA[2].filter, opacity: 0, offset: .6 },
          { scale: KB[0].scale, filter: KB[0].filter, opacity: 0, offset: .6 }, { filter: KB[1].filter, opacity: .55, offset: .71 }, { scale: KB[2].scale, filter: KB[2].filter, opacity: 1, offset: .87 }, KB[3]], { duration: T * 1.02 }));
        setTimeout(swap, T * .62);
      } else if (A.dt) { l.push(anim(dt, KA, { duration: T * .62, easing: EIN })); swap(); }
      /* к столу инструментов с первого (на нём часов больше нет, D-1421): стол собран заранее — проявляется в ответе на касание;
         не собран — следующей задачей после первого кадра. Свет середины выплывает с задержкой T·0,4 — он уже нарисован */
      else { if (window.sbDeskTools && window.sbDeskTools.armed && window.sbDeskTools.armed()) swap(); else later(swap); l.push(anim(dt, KB, { duration: T * .62, delay: T * .4, easing: EOUT })); }
    } else swap();
    var wp = doc.querySelector("#desktop > .wp-layer");
    /* фон «дышит» масштабом и яркостью; на композиторе — только масштабом (яркость держит вуаль), на слабом — не дышит */
    if (wp && !weak) { touched.push(wp); wp.style.transformOrigin = "50% 55%"; anim(wp, cm ? [{ scale: "1" }, { scale: String(fw ? 1.1 : .96), offset: .45 }, { scale: "1" }] : [{ scale: "1", filter: "brightness(1)" }, { scale: String(fw ? 1.1 : .96), filter: "brightness(" + (TT.dim || .72) + ")", offset: .45 }, { scale: "1", filter: "brightness(1)" }], { duration: T + 100, easing: EM(), fill: "none" }); }
    run(veil.parentNode, anim(veil, [{ opacity: 0 }, { opacity: cm ? Math.min(.6, TT.veil + (1 - (TT.dim || .72)) * .5) : TT.veil, offset: .5 }, { opacity: 0 }], { duration: T, easing: EM(), fill: "none" }));
    /* вздох света — ещё один слой во весь экран; слабому устройству его не смешивать в каждом кадре (вуаль уже даёт свет) */
    if (!weak) run(breathEl.parentNode, anim(breathEl, [{ opacity: 0 }, { opacity: 1, offset: .35 }, { opacity: 0 }], { duration: 900, delay: T * .78, easing: EM(), fill: "none" }));
    showTitle(cur, T * .5);
    return l;
  }
  function showTitle(i, delay) {
    title.querySelector("b").textContent = nameOf(i); title.querySelector("i").textContent = T("desks.of", { i: i + 1, n: total() });
    var K = [{ opacity: 0, transform: "translateY(12px)", filter: "blur(6px)" }, { opacity: 1, transform: "none", filter: "blur(0)", offset: .25 }, { opacity: 1, offset: .7 }, { opacity: 0, transform: "translateY(-8px)", filter: "blur(4px)" }];
    if (useComp()) K.forEach(function (f) { delete f.filter; });
    run(title, anim(title, K, { duration: 1700, delay: delay || 0, easing: EE(), fill: "none" }));
  }
  function bump(d) {
    if (reduced() || busy || total() < 2) return;
    var L = layerOf(cur), els = L.els.concat(L.dt && DTc() ? [DTc()] : []);
    els.forEach(function (e) { origin(e); e.animate([{ scale: "1" }, { scale: String(d > 0 ? 1.03 : .97) }, { scale: "1" }], { duration: 380, easing: EM() }).finished.then(function () { e.style.transformOrigin = ""; }).catch(function () { /* ignore */ }); });
    var g = gBtns()[cur]; if (g) g.animate([{ transform: "none" }, { transform: "translateY(" + d * 5 + "px)" }, { transform: "none" }], { duration: 380 });
  }

  /* ---------- перейти ---------- */
  function go(to, opt) {
    opt = opt || {};
    if (busy || !built) return false;
    atDone = true;   /* человек сам выбрал стол — запомненный при входе больше не подставляется */
    if (to < 0 || to >= total()) { bump(to < 0 ? -1 : 1); return false; }
    if (to === cur) { if (to === toolsAt() && opt.tool && window.sbDeskTools) window.sbDeskTools.tool(opt.tool); return true; }
    busy = true; flightMarks(true, useComp());
    /* приглашение к заметке принадлежит столу, где его позвали: стол сменился — приглашение уходит */
    if (window.sbCloseNoteInvite) { try { window.sbCloseNoteInvite(); } catch (e) { /* приглашения нет */ } }
    /* перелёт на композиторе: фон (поле темы, голос, глубина) не рисует кадров, пока летят звёзды — главный поток свободен */
    if (useComp() && !reduced()) holdFrames(1450 + 200);
    if (window.sbCloseContextMenu) { try { window.sbCloseContextMenu(); } catch (e) { /* меню и так закрыто */ } }
    var from = cur, dir = to > from ? 1 : -1, tools = toolsAt();
    /* открытое на первом столе (выбранный инструмент, строка мысли) убирается до перелёта, как в показе — setOpen(false) */
    if (from === 0 && window.sbDeskTools && window.sbDeskTools.isOpen()) window.sbDeskTools.close();
    var A = layerOf(from), B = layerOf(to);
    cur = to; gaugeFly(from, to);
    /* последний стол — сразу, следующей задачей (не в кадре ответа): закрыли вкладку посреди перелёта — откроется там, куда летели */
    later(function () { if (loaded || atDone) writeN(); });
    showFor(to, true); if (box) box.classList.add("on"); showNotes([idOf(from), idOf(to)]);
    /* стол инструментов: ряд встаёт на своё место заранее, пока стол ещё прозрачен (одна тяжёлая перестройка — не в середине перелёта) */
    if (to === tools && window.sbDeskTools && window.sbDeskTools.prep && !weak) later(function () { if (busy && cur === tools) window.sbDeskTools.prep(true); });
    /* слабое устройство: стол инструментов собирается сразу, пока он прозрачен (ряд, свет — те же закреплённые часы); в середине
       перелёта — только выбор названного инструмента. Уходя — инструменты убираются «мягко»: разборка в простое после перелёта */
    var early = weak && to === tools && window.sbDeskTools && !reduced();
    /* стол инструментов собран заранее (ряд — sbDeskTools.arm, часы — кэш света): проявить его — в ответе на касание (≤ 100 мс),
       а не в кадрах перелёта; не собран — следующей задачей */
    var armedT = !!(window.sbDeskTools && window.sbDeskTools.armed && window.sbDeskTools.armed());
    if (early) { if (armedT) window.sbDeskTools.desk(true); else later(function () { if (busy && cur === tools) window.sbDeskTools.desk(true); }); }
    var swap = function () {
      if (to === tools && window.sbDeskTools) { if (early) { if (opt.tool) window.sbDeskTools.tool(opt.tool); } else window.sbDeskTools.desk(true, opt.tool); }
      if (from === tools && window.sbDeskTools) window.sbDeskTools.desk(false, null, !reduced());
    };
    var fw0 = watchFlight();
    /* конец перелёта: снять анимации и классы одной записью; слушатели «стол сменился» — следующей задачей, не в этом кадре */
    /* конец перелёта: в кадре — только пометки «что видно»; снять анимации (их конечное состояние то же, что после снятия:
       уходящий стол уже скрыт, пришедший — на месте) и вернуть стекло — в простое */
    var done = function (myAnims, myEls) { fw0(); busy = false; settle();
      /* свет середины нового стола — его закреплённое или ничего (core/desktools.js: showPinned по «sb:desk») */ idle(function () { cleanAll(myAnims, myEls); }, 250); var o = OV(); if (o) mark(o, "data-sbd-flight", false);
      /* стекло значков возвращается в простое — не в кадре конца перелёта */
      if (useComp()) idle(function () { if (!busy) flightMarks(false, false); }, 400);
      later(function () { try { window.dispatchEvent(new CustomEvent("sb:desk", { detail: { at: cur, tools: cur === tools } })); } catch (e) { /* старый браузер */ } }); };
    var l;
    if (reduced()) {
      swap();
      l = A.els.map(function (e) { touched.push(e); return anim(e, [{ opacity: 1 }, { opacity: 0 }], { duration: 420, easing: EM() }); })
        .concat(B.els.map(function (e) { touched.push(e); return anim(e, [{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: EM() }); }))
        .concat((A.notes || []).map(function (it) { touched.push(it.el); return anim(it.el, [{ opacity: 1 }, { opacity: 0 }], { duration: 420, easing: EM() }); }))
        .concat((B.notes || []).map(function (it) { touched.push(it.el); return anim(it.el, [{ opacity: 0 }, { opacity: 1 }], { duration: 420, easing: EM() }); }));
      gaugeMark(true);
    } else l = vStars(A, B, dir, 1450, swap);
    var myAnims = l, myEls = touched; touched = [];
    fin(l).then(function () { done(myAnims, myEls); });
    return true;
  }

  var holdUntil = 0;
  /* ФОН НА ПАУЗЕ НА ВРЕМЯ СМЕНЫ СТОЛА (перелёт на композиторе): поле и кромка темы, голос и глубина не рисуют кадров
     время перелёта; затем идут дальше. В покое вид не меняется. */
  window.sbFramesHeld = function () { return Math.max(0, holdUntil - performance.now()); };
  function holdFrames(ms) {
    holdUntil = performance.now() + ms;
    if (window.sbDepth && window.sbDepth.hold) { window.sbDepth.hold(true); setTimeout(function () { if (performance.now() >= holdUntil - 1 && window.sbDepth) window.sbDepth.hold(false); }, ms); }
  }
  function add() {
    if (n >= MAX) return false;
    n++; names[n - 1] = null; ids[n - 1] = newId(); gaugeBuild();   /* ответ — новая звезда; запись и остальное — следом */
    later(function () { writeN(); buildOwn(); settle(); changedLater(); });
    var say = function (t) { try { if (window.sbVoice && window.sbVoice.say) window.sbVoice.say(t); } catch (e) { /* голос занят */ } };
    if (n === 2) setTimeout(function () { say(T("desks.hint")); }, 450);
    else later(function () { say(T("desks.deeper", { name: nameOf(n - 1) })); });
    return true;
  }
  function buildOwn() {
    if (!box) return;
    while (own.length < n - 1) { var d = doc.createElement("div"); d.className = "sbd-desk"; d.setAttribute("aria-hidden", "true"); box.appendChild(d); own.push(d); }
    while (own.length > n - 1) { var x = own.pop(); if (x.parentNode) x.parentNode.removeChild(x); }
    var fresh = false; for (var i = 1; i < n; i++) if (!ids[i]) { ids[i] = newId(); fresh = true; }
    ids.length = Math.max(n, 1); if (fresh) writeN();
  }

  /* ---------- жесты: листать вверх · колесо · стрелки ---------- */
  function onDesk(t) {
    if (!t || !t.closest) return false;
    if (t.closest(".window, #topbar, #dock, #sbFab, #sbCtxMenu, #sbDesksGauge, #toastLayer, .panel-overlay, #sbControlCenter, #sbCmdk, #sbLogin, #sbCurtain, #sbVaultGate, .desk-icon, .sticky-note, .note-invite, input, textarea, select, [contenteditable]")) return false;
    if (t.closest("#sbDeskTools .dt-block, #sbDeskTools .dt-tray")) return false;
    return !!t.closest("#desktop, #sbDesks, #sbDeskTools") || t === doc.body || t === root;
  }
  function calm() {
    if (busy || !built) return false;
    if (doc.querySelector("#sbCurtain, #sbVaultGate:not([hidden])") || root.classList.contains("sb-login")) return false;
    var lg = doc.getElementById("sbLogin"); if (lg && !lg.hidden && lg.getBoundingClientRect().height && getComputedStyle(lg).display !== "none" && getComputedStyle(lg).visibility !== "hidden") return false;
    if (window.sbAnyPanelOpen && window.sbAnyPanelOpen()) return false;
    if (root.classList.contains("has-windows")) return false;
    return true;
  }
  var st = null;
  function wire() {
    var lpT = 0, lpAt = 0;
    gauge.addEventListener("click", function (ev) { var b = ev.target.closest && ev.target.closest("button[data-g]"); if (!b) return; ev.stopPropagation(); if (performance.now() - lpAt < 800) return; go(+b.dataset.g); });
    /* правая кнопка / долгое касание звезды — меню стола */
    gauge.addEventListener("contextmenu", function (ev) { var b = ev.target.closest && ev.target.closest("button[data-g]"); if (!b) return; ev.preventDefault(); ev.stopPropagation(); var r = b.getBoundingClientRect(); starMenu(+b.dataset.g, Math.round(r.left - 190), Math.round(r.top)); });
    gauge.addEventListener("pointerdown", function (ev) { var b = ev.target.closest && ev.target.closest("button[data-g]"); if (!b || ev.pointerType === "mouse") return; clearTimeout(lpT);
      lpT = setTimeout(function () { lpAt = performance.now(); var r = b.getBoundingClientRect(); starMenu(+b.dataset.g, Math.round(r.left - 190), Math.round(r.top)); }, 520); });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (k) { gauge.addEventListener(k, function () { clearTimeout(lpT); }); });
    doc.addEventListener("pointerdown", function (ev) { st = ev.pointerType === "touch" && onDesk(ev.target) ? { x: ev.clientX, y: ev.clientY, t: performance.now() } : null; }, true);
    doc.addEventListener("pointercancel", function () { st = null; }, true);
    doc.addEventListener("pointerup", function (ev) {
      if (!st) return; var dx = ev.clientX - st.x, dy = ev.clientY - st.y, dt = performance.now() - st.t; st = null;
      if (Math.abs(dy) > 46 && Math.abs(dy) > Math.abs(dx) * 1.3 && dt < 900 && total() > 1 && calm()) go(cur + (dy < 0 ? 1 : -1));
    }, true);
    var wAcc = 0, wT = 0;
    doc.addEventListener("wheel", function (ev) {
      if (!onDesk(ev.target) || !calm() || total() < 2) return;
      ev.preventDefault();
      var t = performance.now(); if (t - wT > 260) wAcc = 0; wT = t; wAcc += ev.deltaY;
      if (Math.abs(wAcc) > 70) { var d = wAcc > 0 ? 1 : -1; wAcc = 0; go(cur + d); }
    }, { passive: false });
    doc.addEventListener("keydown", function (ev) {
      if (ev.defaultPrevented || ev.ctrlKey || ev.metaKey || ev.altKey || ev.shiftKey) return;
      if (ev.key !== "ArrowUp" && ev.key !== "ArrowDown" && ev.key !== "PageUp" && ev.key !== "PageDown") return;
      var a = doc.activeElement;
      if (a && a !== doc.body && !(a.closest && a.closest("#sbDesksGauge"))) return;
      if (!calm() || total() < 2) return;
      ev.preventDefault();
      go(cur + (ev.key === "ArrowUp" || ev.key === "PageDown" ? 1 : -1));
    });
    /* инструменты убраны (Esc, «закрыть», пульт) на их столе — назад к первому столу */
    window.addEventListener("sb:desktools", function (ev) { if (ev.detail && !ev.detail.open && !busy && cur === toolsAt() && cur > 0) go(0); });
    window.addEventListener("resize", function () { var was = total(); fit(); if (total() !== was) { if (cur >= total()) cur = 0; gaugeBuild(); settle(); } else gaugeBuild(); });
    if (window.sbBus && window.sbBus.on) window.sbBus.on("translate:done", changed);
    var pal = function () {
      var P = window.sbDeskTime && window.sbDeskTime.pal ? window.sbDeskTime.pal() : null; if (!P) return;
      [gauge, title].forEach(function (e) { e.style.setProperty("--sbd-c", P.c.join(",")); e.style.setProperty("--sbd-g", P.g.join(",")); });
    };
    pal(); window.addEventListener("sb:theme", function () { setTimeout(pal, 0); });
    if (window.sbDeskTime && window.sbDeskTime.on) window.sbDeskTime.on(function (e) { if (e === "mood" || e === "ready") pal(); });
  }

  function build() {
    var desk = doc.getElementById("desktop"), wp = desk && desk.querySelector(".wp-layer");
    fx = doc.createElement("canvas"); fx.id = "sbDesksFx"; fx.setAttribute("aria-hidden", "true");
    if (wp && wp.nextSibling) desk.insertBefore(fx, wp.nextSibling); else if (desk) desk.appendChild(fx);
    box = doc.createElement("div"); box.id = "sbDesks"; box.setAttribute("aria-hidden", "true"); doc.body.appendChild(box);
    var fl = doc.createElement("div"); fl.id = "sbDesksVeil"; fl.setAttribute("aria-hidden", "true"); fl.innerHTML = '<div class="veil"></div><div class="breath"></div>'; doc.body.appendChild(fl);
    veil = fl.querySelector(".veil"); breathEl = fl.querySelector(".breath");
    title = doc.createElement("div"); title.id = "sbDesksTitle"; title.setAttribute("aria-hidden", "true"); title.innerHTML = "<b></b><i></i>"; doc.body.appendChild(title);
    gauge = doc.createElement("nav"); gauge.id = "sbDesksGauge"; gauge.className = "off"; doc.body.appendChild(gauge);
    n = readN(); readNames(); buildOwn(); fit(); built = true;
    gaugeBuild(); settle(); wire(); paintPult(); restoreAt();
    /* поле звёзд готовится заранее, в простое: живому перелёту — частицы, перелёту на композиторе — нарисованные глубины */
    setTimeout(function () { idle(function () { probe(); idle(function () { if (useComp()) { compPrep(); idle(armTools, 1500); } else makePool(); }); }); }, 3000);
    window.addEventListener("sb:theme", function () { comp = null; if (useComp()) setTimeout(function () { idle(compPrep, 1500); }, 600); });
    /* число столов — из хранилища: за дверью оно читается, когда хранилище открыто (первая минута) */
    var k = 0, rd = setInterval(function () { if (++k > 30) { clearInterval(rd); return; } var m = readN(); if (m !== n && !busy) { n = Math.max(n, m); readNames(); buildOwn(); changed(); settle(); }
      /* запись столов открылась позже (дверь): имя, судьба стола инструментов, шкала и последний стол — оттуда */
      if (!atDone && !busy && cur === 0) { var g0 = toolsGone, h0 = hideG; readNames(); if (g0 !== toolsGone || h0 !== hideG) changed(); restoreAt(); } }, 2000);
  }

  /* ---------- УПРАВЛЕНИЕ СТОЛАМИ (основатель 23.11.2026): одни и те же действия из четырёх мест —
     долгое касание / правая кнопка по звезде шкалы, меню «+», Настройки → «док и рабочий стол», пульт.
     Новый стол · переименовать · порядок · перейти. «Убрать» — следующим шагом (основатель решает, как убранное
     хранится в Эхо): до тех пор входа нет нигде (CAN_REMOVE). Стол инструментов не переименовать и не убрать. */
  var CAN_REMOVE = true;
  /* шкала — сразу; пульт, Эхо и Настройки — следующей задачей */
  function changedLater() { setTimeout(function () { paintPult(); try { window.dispatchEvent(new CustomEvent("sb:desks")); } catch (e) { /* старый браузер */ } }, 0); }
  function changed() { gaugeBuild(); setTimeout(function () { paintPult(); try { window.dispatchEvent(new CustomEvent("sb:desks")); } catch (e) { /* старый браузер */ } }, 0); }
  function own_(i) { return i >= 0 && i < total() && i !== toolsAt(); }
  /* переименовать можно любой стол, стол инструментов тоже (его знак у звезды остаётся) */
  function canRename(i) { return i >= 0 && i < total(); }
  function setName(i, v) {
    if (!canRename(i)) return false;
    v = String(v == null ? "" : v).replace(/\s+/g, " ").trim().slice(0, 40);
    if (i === toolsAt()) { toolsName = v && v !== T("desks.tools") ? v : null; writeN(); changed(); return true; }
    names[i] = v && v !== T("desks.n" + i) ? v : null; writeN(); changed(); return true;
  }
  function rename(i) {
    if (!canRename(i) || !window.sbAsk) return Promise.resolve(false);
    return window.sbAsk({ title: T("desks.nameAsk"), field: { value: nameOf(i) }, ok: T("desks.rename") }).then(function (v) { return v == null ? false : setName(i, v); });
  }
  /* порядок своих столов: первый (на нём значки) стоит первым; свой стол переезжает с именем и заметками */
  function move(i, d) {
    var j = i + d; if (i < 1 || j < 1 || i >= n || j >= n) return false;
    /* ОТКАТ: безымянный стол называется в извещении своим словом по номеру — как на шкале (nameOf) */
    var a = names[i] || T("desks.n" + i), b = names[j] || T("desks.n" + j), t = ids[i];
    names[i] = b === T("desks.n" + i) ? null : b; names[j] = a === T("desks.n" + j) ? null : a;
    ids[i] = ids[j]; ids[j] = t;   /* стол переезжает со своими заметками */
    writeN(); changed(); settle(); return true;
  }
  function list() {
    var out = []; for (var i = 0; i < total(); i++) out.push({ i: i, name: nameOf(i), tools: i === toolsAt(), cur: i === cur, rename: canRename(i), remove: CAN_REMOVE && i > 0, up: i > 1 && i < n, down: i >= 1 && i < n - 1 });
    return out;
  }
  function act(a, i) {
    if (a === "go") return Promise.resolve(go(i));
    if (a === "new") return Promise.resolve(add());
    if (a === "rename") return rename(i);
    if (a === "up") return Promise.resolve(move(i, -1));
    if (a === "down") return Promise.resolve(move(i, 1));
    if (a === "remove") return Promise.resolve(remove(i));
    if (a === "toolsBack") return Promise.resolve(restore("tools"));
    if (a === "gauge") return Promise.resolve(setGaugeHidden(!hideG));
    return Promise.resolve(false);
  }
  /* ---------- УБРАТЬ СТОЛ (D-1358, основатель: вариант «А»): стол уходит в Эхо ЦЕЛИКОМ — имя, место в порядке и всё, что на
     нём (заметки с их мыслями, булавками, местом). В Эхо — одна строка «Стол «Работа» — 5 заметок»; заметки отдельно не
     показываются (их нет в списке заметок — они лежат в записи стола). Хранится там же, где столы — sbDB (под замком,
     как всё). Первый стол и стол инструментов не убираются. Подтверждение — голосом, сразу с «вернуть». */
  function notesStore() { return window.sbNotesStore || null; }
  /* голос — после того, как ответ уже на экране (фраза голоса строится не за один кадр на слабом устройстве) */
  function later(fn) { requestAnimationFrame(function () { setTimeout(fn, 0); }); }
  /* сдвиг порядка: имя по умолчанию («Работа», «Дом») закрепляется за столом, а не за местом */
  function pinNames() { for (var j = 1; j < n; j++) if (!names[j]) names[j] = T("desks.n" + j); }
  function plural(k) { var L = typeof window.sbLang === "function" ? window.sbLang() : "en"; if (L !== "ru") return k === 1 ? "one" : "many"; return k % 10 === 1 && k % 100 !== 11 ? "one" : k % 10 >= 2 && k % 10 <= 4 && (k % 100 < 12 || k % 100 > 14) ? "few" : "many"; }
  function countWord(k) { return T("desks.notes." + plural(k), { n: k }); }
  function remove(i) {
    if (i >= 1 && i === toolsAt() && !busy) return removeTools();
    if (!(i >= 1 && i < n) || busy) return false;
    /* ОТВЕТ — СРАЗУ, РАБОТА — ПОСЛЕ (скорость на слабом устройстве): в этом кадре — только шкала и что видно; заметки стола,
       запись в хранилище, пульт, Эхо и голос — следующей задачей после ответа */
    var S = notesStore(), id = ids[i], mine = [];
    var rec = { id: id, name: nameOf(i), custom: names[i] || null, pos: i, notes: mine, at: Date.now() };
    removed.unshift(rec);
    pinNames(); ids.splice(i, 1); names.splice(i, 1); n--;
    var moved = cur === i; if (cur === i) cur = i - 1; else if (cur > i) cur--;
    gaugeBuild(); if (moved) settle();
    later(function () {
      if (S) { var rest = []; (S.load() || []).forEach(function (r) { if (r && r.desk === id) mine.push(r); else rest.push(r); }); if (mine.length) { S.save(rest); S.notify(); } }
      writeN(); buildOwn(); settle(); changedLater();
      try { window.dispatchEvent(new CustomEvent("sb:desk", { detail: { at: cur, tools: cur === toolsAt() } })); } catch (e) { /* старый браузер */ }
      /* голос (фраза строится 60–90 мс на ×4) — своей задачей, кадром позже: не одним куском с записью и пультом */
      later(function () { if (window.sbVoice && window.sbVoice.say) window.sbVoice.say(T("desks.removed", { name: rec.name, what: mine.length ? T("desks.withNotes", { n: countWord(mine.length) }) : T("desks.empty") }), { hold: 9000, on: function () { restore(rec.id); } }); });
    });
    return true;
  }
  function restore(rid) {
    var k = -1; removed.forEach(function (r, j) { if (r.id === rid) k = j; }); if (k < 0) return false;
    if (removed[k].system) return restoreTools(k);
    if (n >= MAX) { if (window.sbVoice && window.sbVoice.say) window.sbVoice.say(T("desks.noRoom")); return false; }
    var rec = removed.splice(k, 1)[0], pos = Math.max(1, Math.min(rec.pos || 1, n));
    pinNames(); ids.splice(pos, 0, rec.id); names.splice(pos, 0, rec.custom || rec.name); n++;
    if (cur >= pos && cur > 0) cur++;
    var S = notesStore();
    gaugeBuild();   /* ответ — звезда на месте; остальное — следующей задачей */
    later(function () {
      writeN(); buildOwn(); settle(); changedLater();
      if (S && rec.notes.length) { var live = S.load() || [], have = {}; live.forEach(function (r) { have[r.id] = 1; }); rec.notes.forEach(function (r) { if (!have[r.id]) live.push(r); }); S.save(live); S.notify(); }
    });
    return true;
  }
  /* одна заметка из убранного стола: к своему столу, если он есть, иначе — на первый */
  /* СТОЛ ИНСТРУМЕНТОВ — В ЭХО (основатель 25.11.2026): уходит целиком, со своими заметками и именем, одной строкой Эха;
     системный — развеять нельзя, только вернуть (Эхо, голос, «вернуть инструменты» в пульте). Пока его нет, звезды нет,
     и при одном своём столе шкала исчезает. */
  function removeTools() {
    var at = toolsAt(); if (at < 0) return false;
    var S = notesStore(), mine = [];
    var rec = { id: "tools", system: true, name: nameOf(at), custom: toolsName, pos: at, notes: mine, at: Date.now() };
    removed = removed.filter(function (r) { return r.id !== "tools"; }); removed.unshift(rec);
    var was = cur === at;
    if (was && window.sbDeskTools) { try { window.sbDeskTools.desk(false, null, false); } catch (e) { /* инструменты и так убраны */ } }
    toolsGone = true; if (cur >= total()) cur = total() - 1;
    gaugeBuild(); settle();
    later(function () {
      if (S) { var rest = []; (S.load() || []).forEach(function (r) { if (r && r.desk === "tools") mine.push(r); else rest.push(r); }); if (mine.length) { S.save(rest); S.notify(); } }
      writeN(); changedLater();
      try { window.dispatchEvent(new CustomEvent("sb:desk", { detail: { at: cur, tools: false } })); } catch (e) { /* старый браузер */ }
      later(function () { if (window.sbVoice && window.sbVoice.say) window.sbVoice.say(T("desks.removed", { name: rec.name, what: mine.length ? T("desks.withNotes", { n: countWord(mine.length) }) : T("desks.empty") }), { hold: 9000, on: function () { restore("tools"); } }); });
    });
    return true;
  }
  function restoreTools(k) {
    var rec = removed.splice(k, 1)[0]; toolsGone = false; toolsName = rec.custom || null;
    var S = notesStore();
    gaugeBuild();
    later(function () {
      writeN(); settle(); changedLater();
      if (S && rec.notes.length) { var live = S.load() || [], have = {}; live.forEach(function (r) { have[r.id] = 1; }); rec.notes.forEach(function (r) { if (!have[r.id]) live.push(r); }); S.save(live); S.notify(); }
    });
    return true;
  }
  function setGaugeHidden(v) { hideG = !!v; writeN(); gaugeBuild(); changedLater(); return true; }
  /* последний стол — запись в простое после смены стола; при входе — тот же стол, без перелёта (restoreAt) */
  var saveT = 0;
  /* пока запись столов не прочитана (за дверью), последний стол не пишется: иначе пустая память затёрла бы имена и Эхо */
  function saveAtLater() { if (!loaded && !atDone) return; clearTimeout(saveT); saveT = setTimeout(function () { idle(writeN, 2000); }, 600); }
  var atDone = false;
  function restoreAt() {
    if (atDone || !savedAt || busy || cur !== 0) return;
    var to = savedAt === "tools" ? toolsAt() : ids.indexOf(savedAt);
    if (to <= 0 || to >= total()) return;
    atDone = true; cur = to; settle(); gaugeMark();
    var open0 = function () { if (cur === toolsAt() && !busy && window.sbDeskTools && !window.sbDeskTools.isOpen()) window.sbDeskTools.desk(true); };
    open0();
    /* вход ещё раскладывает стол (голос, приветствие, свет): если инструменты успели убрать — открыть их ещё раз, когда всё встало */
    [1200, 3000].forEach(function (ms) { setTimeout(open0, ms); });
    try { window.dispatchEvent(new CustomEvent("sb:desk", { detail: { at: cur, tools: cur === toolsAt() } })); } catch (e) { /* старый браузер */ }
  }
  function restoreNote(rid, nid) {
    var rec = null; removed.forEach(function (r) { if (r.id === rid) rec = r; }); if (!rec) return false;
    var k = -1; rec.notes.forEach(function (x, j) { if (x.id === nid) k = j; }); if (k < 0) return false;
    var note = rec.notes.splice(k, 1)[0];
    if (ids.indexOf(note.desk) < 1) delete note.desk;
    var S = notesStore(); if (S) { var live = S.load() || []; live.push(note); S.save(live); S.notify(); }
    writeN(); changed(); return true;
  }
  /* меню звезды: те же пункты, что везде — переименовать · новый стол («убрать» — когда будет решено) */
  function starMenu(i, x, y) {
    if (!window.sbMenu) return false;
    var items = [];
    if (canRename(i)) items.push({ label: T("desks.rename"), run: function () { rename(i); } });
    if (CAN_REMOVE && i > 0) items.push({ label: T("desks.remove"), run: function () { remove(i); } });
    items.push({ label: T(n >= MAX ? "desks.full" : "desks.new"), disabled: n >= MAX, run: function () { add(); } });
    window.sbMenu(items, x, y); return true;
  }
  /* пульт: строка «стол: Главный · Работа · +» — слова без плашек */
  function paintPult() {
    var tb = doc.getElementById("sbCcTools"); if (!tb) return;
    var row = doc.getElementById("sbCcDesks");
    if (!row) { row = doc.createElement("div"); row.id = "sbCcDesks"; row.className = "sv-row cc-desks"; row.setAttribute("role", "group"); tb.parentNode.insertBefore(row, tb.nextSibling);
      row.addEventListener("click", function (ev) { var b = ev.target.closest && ev.target.closest("button"); if (!b) return; ev.stopPropagation(); if (window.sbCloseControlCenter) window.sbCloseControlCenter(); act(b.dataset.act, +b.dataset.i); }); }
    row.setAttribute("aria-label", T("desks.aria"));
    var h = '<span class="cc-desks-l">' + T("desks.line") + ":</span>";
    list().forEach(function (d, k) { h += (k ? '<span class="cc-desks-s" aria-hidden="true">·</span>' : "") + '<button type="button" data-act="go" data-i="' + d.i + '" aria-current="' + d.cur + '">' + d.name.replace(/[<&"]/g, "") + "</button>"; });
    if (n < MAX) h += '<span class="cc-desks-s" aria-hidden="true">·</span><button type="button" class="cc-desks-add" data-act="new" data-i="-1" aria-label="' + T("desks.new") + '">+</button>';
    /* стол инструментов в Эхо — вернуть его отсюда одним касанием */
    if (toolsGone) h += '<span class="cc-desks-s" aria-hidden="true">·</span><button type="button" data-act="toolsBack" data-i="-1">' + T("desks.toolsBack").replace(/[<&"]/g, "") + "</button>";
    row.innerHTML = h;
  }

  window.sbDesks = {
    at: function () { return cur; },
    count: function () { return total(); },
    own: function () { return n; },
    max: MAX,
    toolsAt: function () { return toolsAt(); },
    onTools: function () { return cur === toolsAt(); },
    busy: function () { return busy; },
    go: function (i, opt) { return go(i, opt); },
    /* к инструментам: последний стол; tool — сразу этот инструмент (пульт — последний выбранный) */
    tools: function (tool) { var t = toolsAt(); if (t < 0) return false; return go(t, { tool: tool }); },
    add: function () { return add(); },
    full: function () { return n >= MAX; },
    words: function (k, v) { return T(k, v); },
    name: function (i) { return nameOf(i); },
    list: function () { return list(); },
    act: function (a, i) { return act(a, i); },
    rename: function (i, v) { return v === undefined ? rename(i) : setName(i, v); },
    move: function (i, d) { return move(i, d); },
    menu: function (i, x, y) { return starMenu(i, x, y); },
    /* для законов: облегчён ли перелёт на этом устройстве и медиана кадра прошлого перелёта */
    weak: function () { return weak; }, lastFlight: function () { return Math.round(lastFlight); },
    curId: function () { return cur > 0 && cur < n ? ids[cur] : cur > 0 && cur === toolsAt() ? "tools" : null; },
    toolsGone: function () { return toolsGone; },
    gaugeHidden: function (v) { if (v === undefined) return hideG; return setGaugeHidden(!!v); },
    idOf: function (i) { return idOf(i); },
    remove: function (i) { return remove(i); },
    /* для Эхо: убранные столы — одна строка на стол */
    removed: function () { return removed.map(function (r) { return { id: r.id, system: !!r.system, name: r.name, at: r.at, count: r.notes.length, line: T("desks.echoLine", { name: r.name, n: countWord(r.notes.length) }), notes: r.notes.map(function (x) { return { id: x.id, text: x.text || "" }; }) }; }); },
    restore: function (rid) { return restore(rid); },
    restoreNote: function (rid, nid) { return restoreNote(rid, nid); }
  };

  var tries = 0, iv = setInterval(function () {
    if (++tries > 600) { clearInterval(iv); return; }
    if (!doc.body || !doc.getElementById("desktop") || !window.sbDeskTools || !window.sbDeskTools.desk || !window.sbDB) return;
    clearInterval(iv);
    build();
  }, 100);
})();
