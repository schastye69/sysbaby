/* sys.baby OS — core/desktools.js
 * ИНСТРУМЕНТЫ В ЦЕНТРЕ СТОЛА · решения D-880…D-886, основатель 11.11.2026
 * (plan-dalshe/instrumenty-stola.md). Архив после «Чистоты».
 *
 * ОДНА СЕРЕДИНА, ОДИН СВЕТ. Время, таймер, секундомер и будильник уже идут
 * светом в середине стола (core/desktime.js). Сюда же встают остальные
 * инструменты — тем же холстом (sbDeskTime.show) и тем же видом, который
 * человек выбрал для времени: «линии света» или «пыль света»
 * (sysbaby.desktime.view, Настройки → Знакомство). Своих окон у
 * инструментов нет: стекла, рамок, шапок — нет; только свет и строчные слова.
 *
 * ВХОДЫ:
 *   · касание середины пустого стола (окон на виду нет) — строка из света
 *     «мысль — или счёт», на фоне — клавиши из света, под ними слова
 *     инструментов: расчёт · дыхание · ожидание · счётчик · город;
 *   · цифра, набранная на столе с клавиатуры (ни поля, ни окна, ни панели
 *     в фокусе) — та же строка, сразу со счётом, без клавиш;
 *   · «12 × 7 =» в записи (на столе или в Записях) — ответ встаёт сразу за
 *     знаком «=» (core/calc.js, точность по виду, деление на ноль — словом).
 *   Касание вне середины и вне инструментов, Esc — убрать. Набранная, но
 *   не отданная мысль не теряется: она вернётся в строку при следующем
 *   касании (только в памяти вкладки).
 *
 * СТРОКА РЕШАЕТ САМА, ЧТО ЭТО: только числа и знаки — счёт (цифры светом,
 * «= 84» подписью, Enter или «=» — ответ перетекает в цифры); «5 миль в км» —
 * единицы; любые другие слова — мысль: клавиши гаснут, Enter отдаёт её в
 * записи (core/thought.js) — без окна.
 *
 * ПРИГЛАШЕНИЕ К ЗАМЕТКЕ ОСТАЁТСЯ. Пустое место стола вне середины — как
 * прежде, «+ заметка» (desktop.js, v47). Есть окна на виду — первое касание
 * по пустоте их убирает (v47): середина отвечает, только когда стол пуст.
 *
 * ГЛАВНОЕ СЕГОДНЯ светится в середине, пока стол в покое (sbNoteToday,
 * core/noteplus.js) — тем же видом света; касание открывает запись.
 *
 * ПОКОЙ НЕ СТОИТ КАДРОВ: свет главного рисуется один раз на смену текста,
 * темы или размера; дыхание просит кадры только пока идёт. «Меньше
 * движения» — дыхание словами без роста света, цифры сразу.
 * Хранилище — sbDB «sysbaby.desktools.v1» (счётчик, ожидание, город; опись
 * shared/floor.data.js), под замком прячется вместе со всем.
 * Сеть — никогда: пояса времени — Intl браузера, единицы — свой список.
 * Охраняется tools/desktools-center-check.mjs, desktools-tools-check.mjs,
 * desktools-light-check.mjs, calc-light-check.mjs, thought-capture-check.mjs,
 * notes-today-check.mjs. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var mq = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var KEY = "sysbaby.desktools.v1", DAY = 86400000;
  function T(k, v) { return window.sbToolT ? window.sbToolT(k, v) : k; }
  function reduced() { return mq.matches || root.getAttribute("data-motion") === "reduced"; }
  function lang() { var l = typeof window.sbLang === "function" ? window.sbLang() : "en"; return l === "ru" || l === "ee" ? l : "en"; }
  function locale() { var l = lang(); return l === "ru" ? "ru-RU" : l === "ee" ? "et-EE" : "en-GB"; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function sm(x) { x = cl(x); return x * x * (3 - 2 * x); }
  function two(n) { return (n < 10 ? "0" : "") + n; }
  function say(text, opt) { try { if (window.sbVoice && window.sbVoice.say) return window.sbVoice.say(text, opt || {}); } catch (e) { /* голос занят */ } return null; }

  /* ---------- хранилище ---------- */
  function readS() {
    var o = null; try { o = JSON.parse((window.sbDB && window.sbDB.get(KEY)) || "null"); } catch (e) { o = null; }
    o = o && typeof o === "object" ? o : {};
    if (typeof o.count !== "number") o.count = 0;
    return o;
  }
  function writeS(o) { try { if (window.sbDB && !(window.sbDB.closed && window.sbDB.closed())) window.sbDB.set(KEY, JSON.stringify(o)); } catch (e) { /* закрыто — останется в памяти до двери */ } }

  /* ---------- DOM ---------- */
  var DT = null, ov = null, blk = null, line = null, keys = null, tray = null, pane = null, sr = null, mic = null, hit = null, todayBtn = null;
  var open = false, by = "", tool = "line", draft = "", justEq = false, swallowUntil = 0, cityTick = 0, pinTick = 0, foot = null, sign = null;
  var KEYS = ["C", "(", ")", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", "dec", "back", "="];
  /* МЫСЛЬ ПЕРВОЙ (основатель 12.11): касание середины даёт только строку мысли; клавиши
     света — только у «расчёта». line — мысль, calc — расчёт (та же строка, плюс клавиши). */
  var TOOLS = ["line", "calc", "breath", "wait", "count", "city", "noise", "sun"];
  function lineish(t) { return (t || tool) === "line" || (t || tool) === "calc"; }
  /* закрепить можно то, что показывает число на столе (D-890); у шума свой знак, у дыхания — свой срок */
  var PINNABLE = { count: 1, wait: 1, city: 1, sun: 1 };
  var lastRes = null, holdT = 0, held = false;
  function decSign() { return lang() === "en" ? "." : ","; }
  function keyFace(k) { return k === "dec" ? decSign() : k === "back" ? "‹" : k === "C" ? T("dt.key.clear") : k; }
  /* чтецу — имя действия, а не знак: «разделить», а не «÷» (D-900) */
  var KEYNAME = { "\u00f7": "dt.key.div", "\u00d7": "dt.key.mul", "\u2212": "dt.key.minus", "+": "dt.key.plus", "=": "dt.key.eq", "(": "dt.key.open", ")": "dt.key.close", dec: "dt.key.dec", back: "dt.key.back", C: "dt.key.clear" };
  function keyAria(k) { return KEYNAME[k] ? T(KEYNAME[k]) : k; }
  function markup() {
    return '<div class="dt-block" hidden>' +
      /* невидимая кнопка для чтеца и клавиатуры: видна, только когда на ней фокус (D-900) */
      '<button type="button" class="dt-close" aria-label="' + esc(T("dt.close")) + '">' + esc(T("dt.close")) + "</button>" +
      '<button type="button" class="dt-hit" tabindex="-1" aria-hidden="true"></button>' +
      '<div class="dt-linebox"><input type="text" class="dt-line" id="sbDtLine" autocomplete="off" autocapitalize="sentences" spellcheck="false" enterkeyhint="done" maxlength="400" placeholder="' + esc(T("dt.line.ph")) + '" aria-label="' + esc(T("dt.line.aria")) + '">' +
      '<button type="button" class="dt-mic" hidden aria-pressed="false" aria-label="' + esc(T("dt.mic")) + '" title="' + esc(T("dt.mic.local")) + '"><span class="dt-mic-dot" aria-hidden="true"></span></button></div>' +
      '<div class="dt-keys" role="group" aria-label="' + esc(T("dt.keys.aria")) + '">' + KEYS.map(function (k) {
        return '<button type="button" class="dt-key' + (k === "C" ? " word" : "") + (k === "=" ? " eq" : "") + '" data-k="' + esc(k) + '" aria-label="' + esc(keyAria(k)) + '">' + esc(keyFace(k)) + "</button>";
      }).join("") + "</div>" +
      '<div class="dt-pane" hidden></div>' +
      '<div class="dt-tray" role="toolbar" aria-label="' + esc(T("dt.tray.aria")) + '">' + TOOLS.map(function (t) {
        return '<button type="button" class="dt-word" data-tool="' + t + '" aria-pressed="false">' + esc(T("dt.tool." + t)) + "</button>";
      }).join("") + "</div>" +
      /* тихие слова внизу: закрепить · линии · пыль (D-890, D-898) */
      '<div class="dt-hist" role="list" aria-label="' + esc(T("dt.hist.aria")) + '" hidden></div>' +
      '<div class="dt-foot"><button type="button" class="dt-quiet dt-pin" aria-pressed="false" hidden>' + esc(T("dt.pin")) + "</button>" +
      '<button type="button" class="dt-quiet dt-histbtn" aria-expanded="false" hidden>' + esc(T("dt.hist")) + "</button>" +
      '<span class="dt-view" role="group" aria-label="' + esc(T("dt.view.aria")) + '">' +
      '<button type="button" class="dt-quiet" data-view="lines" aria-pressed="false">' + esc(T("dt.view.lines")) + '</button><span class="dt-dot" aria-hidden="true">·</span>' +
      '<button type="button" class="dt-quiet" data-view="dust" aria-pressed="false">' + esc(T("dt.view.dust")) + "</button></span>" +
      '<button type="button" class="dt-quiet dt-shut">' + esc(T("dt.shut")) + "</button></div>" +
      "</div>" +
      '<button type="button" class="dt-sound" hidden><span class="dt-sound-dot" aria-hidden="true"></span></button>' +
      '<button type="button" class="dt-today" hidden></button>' +
      '<div class="dt-sr" role="status" aria-live="polite"></div>';
  }
  function build() {
    ov = doc.createElement("section");
    ov.id = "sbDeskTools"; ov.setAttribute("aria-label", T("dt.aria"));
    ov.innerHTML = markup();
    doc.body.appendChild(ov);
    grab();
    wire();
  }
  function grab() {
    blk = ov.querySelector(".dt-block"); line = ov.querySelector(".dt-line"); keys = ov.querySelector(".dt-keys");
    tray = ov.querySelector(".dt-tray"); pane = ov.querySelector(".dt-pane"); sr = ov.querySelector(".dt-sr");
    mic = ov.querySelector(".dt-mic"); hit = ov.querySelector(".dt-hit"); todayBtn = ov.querySelector(".dt-today");
    foot = ov.querySelector(".dt-foot"); sign = ov.querySelector(".dt-sound");
  }
  function relang() {
    if (!ov) return;
    var v = line ? line.value : "", wasOpen = open, t = tool;
    ov.setAttribute("aria-label", T("dt.aria"));
    ov.innerHTML = markup(); grab(); wireInner();
    if (wasOpen) { blk.hidden = false; line.value = v; setTool(t, true); layout(); }
    paintToday(true);
  }
  function announce(s) { if (sr && sr.textContent !== s) sr.textContent = s; }

  /* ---------- место: блок в середине, над голосом, под значками ---------- */
  function safeTop() {
    var tb = doc.getElementById("topbar"), r = tb ? tb.getBoundingClientRect() : null, y = (r && r.height ? r.bottom : 44) + 12;
    if (!root.classList.contains("is-compact") && Number(window.sbIconZoneBottom) > 0) y = Math.max(y, window.sbIconZoneBottom + 12);
    return Math.max(Math.round(y), iconsBottom() + 12);
  }
  /* ЗНАЧКИ НЕ ПОД СВЕТОМ (D-895): на телефоне сетка значков занимает верх
     стола, и ответ счёта ложился на неё. Низ последнего видимого значка —
     граница: свет инструмента встаёт в свободную середину под ней. */
  function iconsBottom() {
    var b = 0;
    [].forEach.call(doc.querySelectorAll("#sbIconLayer .desk-icon"), function (el) {
      var r = el.getBoundingClientRect(); if (r.width && r.height && r.top < window.innerHeight * 0.7) b = Math.max(b, r.bottom);
    });
    return Math.round(b);
  }
  /* середина для закреплённого: центр стола, но не выше свободного места под значками */
  function freeCy() {
    var H = window.innerHeight, Hd = DT.Hd(), low = H - 96 - Hd * 1.6;   /* снизу — голос, док и «+»: подписи не ложатся на них */
    ["#dock", "#sbFab"].forEach(function (q) { var e = doc.querySelector(q); if (!e) return; var r = e.getBoundingClientRect(); if (r.width && r.height && r.top > H * 0.5) low = Math.min(low, r.top - Hd * 1.6); });
    return Math.round(Math.min(Math.max(H * 0.5, iconsBottom() + 12 + Hd * 0.6), Math.max(low, H * 0.3)));
  }
  var L = { gy: 0 };
  function layout() {
    if (!ov || !DT) return;
    var W = window.innerWidth, H = window.innerHeight, Hd = DT.Hd();
    var k = Math.round(Math.max(44, Math.min(72, W / 7.4, H / 12.5)));
    var showKeys = tool === "calc" && !keys.hidden;
    /* под цифрами света: одна подпись у строки счёта, две — у счётчика, ожидания и города */
    var lineH = Math.max(44, Math.round(Hd * 0.5)), capH = lineish() ? 56 : 84;
    var keysH = showKeys ? 5 * k + 4 * 8 : 0, paneH = !lineish() ? pane.offsetHeight || 60 : 0;
    var footH = 34, room = H - 76 - safeTop();   /* 76 — низ у голоса */
    var B = Hd + capH + (lineish() ? lineH + 14 : 0) + keysH + paneH + 18 + 40 + footH;
    /* не помещается под значками — клавиши мельчают (не мельче 36 px), а не залезают на значки */
    while (showKeys && B > room && k > 36) { k -= 2; keysH = 5 * k + 4 * 8; B = Hd + capH + lineH + 14 + keysH + 18 + 40 + footH; }
    var top = Math.max(safeTop(), Math.round(H * 0.47 - B / 2));
    /* Низ инструмента — над голосом И над «+» и полкой (глубокий аудит Б-18, D-876): на 390 слова «шум»,
       «закрыть» садились под круг «+», «линии · пыль» уходили за нижний край. Не помещается — блок
       поднимается к шапке, а остаток прокручивается внутри, а не прячется. */
    var lowEdge = H - 76;
    ["#sbFab", "#dock"].forEach(function (q) { var e = doc.querySelector(q); if (!e) return; var r = e.getBoundingClientRect(); if (r.width && r.height && r.top > H * 0.5) lowEdge = Math.min(lowEdge, r.top - 12); });
    if (top + B > lowEdge) top = Math.max(safeTop(), lowEdge - B);
    ov.style.setProperty("--dt-maxh", Math.max(160, lowEdge - top) + "px");
    /* ЭКРАННАЯ КЛАВИАТУРА (D-900): видимая часть экрана — visualViewport; поднялась
       клавиатура — клавиши света уходят (печатает она), а строка встаёт над ней,
       и вертикально, и горизонтально — ничего не прячется под клавиатурой */
    var vv = window.visualViewport, vb = vv ? vv.offsetTop + vv.height : H, kb = H - vb > 80;
    ov.classList.toggle("kb", kb);
    doc.documentElement.classList.toggle("sb-kb", kb);   /* клавиатура поднята — «+» уходит, пока печатают (глубокий аудит Б-58, D-876) */
    if (kb) {
      var tb = doc.getElementById("topbar"), tr = tb ? tb.getBoundingClientRect().bottom : 0;
      var need = Hd + capH + (lineish() ? lineH : paneH) + 12;
      top = Math.max(Math.round((vv ? vv.offsetTop : 0) + tr + 6), Math.round(vb - need));
    }
    L.gy = top + Math.round(Hd / 2); L.gx = Math.round(W / 2);
    /* ── ТЕЛЕФОН НА БОКУ (844×390, html.is-short; POLISH-C D-1023-TOOLS-LANDSCAPE, глубокий аудит Б-4/Б-57) ──
       Под рядом значков оставалось 160 px из 390: свет, слова и «закрыть» уходили в прокрутку, видна была
       одна строка. Как окно на телефоне — лист поверх значков, так и инструмент на боку: значки отходят
       (html.sb-tools-wide), а инструмент встаёт в две колонки — слева свет (и строка мысли/счёта),
       справа клавиши, выбор, лоток и тихие слова. Низ — над голосом и «+», лишнее прокручивается справа. */
    var land = root.classList.contains("is-short") && !kb && open;
    root.classList.toggle("sb-tools-wide", land);
    ov.classList.toggle("land", land);
    if (land) {
      var tb2 = doc.getElementById("topbar"), t0 = Math.round((tb2 ? tb2.getBoundingClientRect().bottom : 44) + 10);
      var avail = Math.max(120, lowEdge - t0), lightH = Hd + capH + (lineish() ? lineH + 14 : 0);
      top = t0;
      L.gx = Math.round(W / 4 + 4);
      L.gy = t0 + Math.max(0, Math.round((avail - lightH) / 2)) + Math.round(Hd / 2);
      while (showKeys && 5 * k + 4 * 8 > avail && k > 36) k -= 2;
      ov.style.setProperty("--dt-maxh", avail + "px");
      ov.style.setProperty("--dt-ltop", (L.gy - Math.round(Hd / 2) + Hd + capH) + "px");
      ov.style.setProperty("--dt-htop", (L.gy - Math.round(Hd / 2)) + "px");
    }
    DT.setCx(land ? L.gx : null);
    ov.style.setProperty("--dt-k", k + "px");
    ov.style.setProperty("--dt-hd", Hd + "px");
    ov.style.setProperty("--dt-top", top + "px");
    ov.style.setProperty("--dt-line-h", lineH + "px");
    ov.style.setProperty("--dt-cap", capH + "px");
    DT.setCy(L.gy);
  }
  function paint() {
    if (!ov || !DT) return;
    var P = DT.pal();
    ov.style.setProperty("--dt-c", P.c.join(","));
    ov.style.setProperty("--dt-g", P.g.join(","));
    ov.setAttribute("data-view", DT.variant() === "dust" ? "dust" : "line");
    if (foot) [].forEach.call(foot.querySelectorAll("[data-view]"), function (b) { var on = (b.dataset.view === "dust") === (DT.variant() === "dust"); b.setAttribute("aria-pressed", on ? "true" : "false"); b.classList.toggle("on", on); });
  }

  /* ---------- открыть / убрать ---------- */
  function visibleWindows() {
    var o = window.openWindows || {};
    return Object.keys(o).filter(function (id) { return o[id] && !o[id].minimized; }).length;
  }
  function deskBusy() {
    return !!doc.getElementById("sbCurtain") || !!doc.getElementById("sbVaultGate") || (window.sbAnyPanelOpen && window.sbAnyPanelOpen()) ||
      (window.sbNoteInviteOpen && window.sbNoteInviteOpen()) || root.classList.contains("sb-note-full");
  }
  function openTools(how) {
    if (!ov || !DT) return false;
    if (open) return true;
    open = true; by = how || "touch"; justEq = false;
    paint(); hideToday();
    blk.hidden = false; ov.classList.add("on");
    line.value = draft; draft = "";
    /* ТРИ ВХОДА — ТРИ СМЫСЛА (D-891, уточнено D-907, основатель 12.11):
       касание середины — всегда мысль; набор на пустом столе, цифры тоже, — тоже мысль
       («12×7» — мысль, «12×7 =» — ответ в строке), расчёт сам не открывается никогда;
       «инструменты» в быстром меню — последний инструмент. */
    var first = by === "key" ? "calc" : by === "pult" ? (readS().last || "line") : "line";   /* "key" — только API законов; набор на столе — "type", мысль */
    if (TOOLS.indexOf(first) < 0) first = "line";
    setTool(first, true);
    keys.hidden = first !== "calc" || by === "key";
    layout(); update();
    /* фокус в строку: подсказка гаснет сразу; у расчёта касанием — клавиши света вместо системной клавиатуры */
    if (lineish() && !(tool === "calc" && by !== "key" && root.classList.contains("is-touch"))) { try { line.focus({ preventScroll: true }); var L0 = line.value.length; line.setSelectionRange(L0, L0); } catch (e) { line.focus(); } }
    try { window.dispatchEvent(new CustomEvent("sb:desktools", { detail: { open: true, by: by } })); } catch (e) { /* старый браузер */ }
    return true;
  }
  function closeTools(keepDraft) {
    if (!open) return;
    open = false;
    if (keepDraft !== false && tool === "line" && !answered && line.value.trim()) draft = line.value;
    else if (heldDraft) draft = heldDraft;
    heldDraft = "";
    answered = false;   /* только мысль: расчёт не сохраняется черновиком */
    stopBreath(); clearInterval(cityTick); cityTick = 0;
    if (window.sbThought && window.sbThought.mic.on()) window.sbThought.mic.stop();
    ov.classList.remove("on"); blk.hidden = true; pane.hidden = true; pane.innerHTML = "";
    if (doc.activeElement && ov.contains(doc.activeElement)) { try { doc.activeElement.blur(); } catch (e) { /* фокус не обязателен */ } }
    DT.hide();
    DT.setCx(null); ov.classList.remove("land"); root.classList.remove("sb-tools-wide");   /* значки возвращаются (D-1023) */
    if (!(window.sbClock && window.sbClock.isOpen && window.sbClock.isOpen())) DT.setCy(null);
    announce("");
    showPinned();
    paintToday(true);
    doc.documentElement.classList.remove("sb-kb");
    paintSign();   /* инструменты убраны, а шум звучит — на столе встаёт знак «звучит» (D-892) */
    try { window.dispatchEvent(new CustomEvent("sb:desktools", { detail: { open: false } })); } catch (e) { /* старый браузер */ }
  }

  /* ---------- строка: счёт, единицы или мысль ---------- */
  var MATH = /^[\d\s.,+\-−–*×xXхХ·\/÷^%()=]+$/;
  function kindOf(v) {
    var s = String(v || "").trim();
    if (!s) return "empty";
    if (window.sbCalc && window.sbCalc.convert(s.replace(/=\s*$/, ""))) return "conv";
    /* проценты и даты словами (D-897): «15% от 80», «через 45 дней», «какой день 25.12» */
    if (window.sbCalc && window.sbCalc.phrase && window.sbCalc.phrase(s.replace(/=\s*$/, ""), lang())) return "phrase";
    if (MATH.test(s) && /\d/.test(s)) return "math";
    return "words";
  }
  function glyphsOf(v) {
    var d = decSign();
    return String(v || "").replace(/\s+/g, "").replace(/=+$/, "").replace(/[*xXхХ·]/g, "×").replace(/\//g, "÷").replace(/[-–]/g, "−").replace(/[.,]/g, d);
  }
  function allGlyphs(s) { for (var i = 0; i < s.length; i++) if (!DT.has(s[i])) return false; return true; }
  /* ответ — целиком или подписью: результат не обрезается, как выражение */
  /* не помещается светом (длинное, «1·10²⁰») — ответ встаёт подписью целиком */
  function showResult(text, label, join) {
    var g = String(text || "").replace(/\u202f/g, " "); label = label || "";   /* разряды — пробелом пера (D-905) */
    if (g && allGlyphs(g) && DT.fit(g) === g) DT.show({ str: g, label: label, sub: "" });
    else if (join) DT.show({ str: "", label: g + (label ? " " + label : ""), sub: "" });
    else DT.show({ str: "", label: g, sub: label });
  }
  function update() {
    if (!open || !lineish()) return;
    if (tool === "line") { ov.setAttribute("data-kind", answered ? "answer" : "words"); if (!answered) DT.hide(); return; }
    var v = line.value, k = kindOf(v), C = window.sbCalc;
    ov.setAttribute("data-kind", k);
    keys.classList.toggle("dim", k === "words" || k === "conv" || k === "phrase");   /* буквы в строке — клавиши цифр не нужны */
    if (k === "empty") { DT.hide(); announce(""); return; }
    if (k === "words") { DT.hide(); return; }
    if (k === "conv") {
      var c = C.convert(v.replace(/=\s*$/, ""));
      if (c.ok) { showResult(C.format(c.value, lang(), 6), c.unit, true); announce(c.text); }
      else { DT.show({ str: "", label: T(c.word) }); announce(T(c.word)); }
      return;
    }
    if (k === "phrase") {
      var ph = C.phrase(v.replace(/=\s*$/, ""), lang());
      if (!ph.ok) { DT.show({ str: "", label: T(ph.word) }); announce(T(ph.word)); return; }
      if (typeof ph.value === "number") showResult(ph.kind === "split" ? ph.text : C.format(ph.value, lang()), ph.unit || "", true);
      else DT.show({ str: "", label: ph.text });
      announce(ph.text); return;
    }
    var expr = v.replace(/=\s*$/, ""), r = C.evaluate(expr), g = glyphsOf(v);
    /* «= 84» — подписью под цифрами света (одна строка подписи: ниже — сама строка ввода) */
    var said = r ? (r.ok ? (r.action ? "= " + r.text : "") : T(r.word)) : "";
    DT.show({ str: g, label: said, sub: "" });
    if (said) announce(said);
  }
  function equals() {
    var C = window.sbCalc, v = line.value.replace(/=\s*$/, ""), k = kindOf(v);
    if (k === "conv" || k === "phrase") { update(); return; }
    if (k !== "math") return;
    var r = C.evaluate(v);
    if (!r) return;
    if (!r.ok) { DT.show({ str: glyphsOf(v), label: T(r.word), sub: "" }); announce(T(r.word)); return; }
    showResult(r.text, T("dt.calc.from", { expr: glyphsOf(v) }), false);
    announce(T("dt.calc.from", { expr: v.trim() }) + " " + r.text);
    lastRes = { expr: glyphsOf(v), res: r.text }; pushHist(lastRes.expr, lastRes.res); armCopy();
    line.value = r.text.replace("−", "-"); justEq = true;
    ov.setAttribute("data-kind", "math");
  }
  /* ---------- касание ответа — «скопировано» и [в запись] (D-901) ---------- */
  function armCopy() {
    if (!hit || !lineish() || !lastRes) return;
    hit.hidden = false; hit.tabIndex = 0; hit.removeAttribute("aria-hidden");
    hit.setAttribute("aria-label", T("dt.copy.aria", { v: lastRes.res }));
  }
  function disarmCopy() { lastRes = null; if (hit && lineish()) { hit.hidden = true; hit.tabIndex = -1; hit.setAttribute("aria-hidden", "true"); } }
  function copyAnswer() {
    if (!lastRes) return;
    var r = lastRes, text = r.expr + " = " + r.res;
    /* буфер — местный: navigator.clipboard ничего не отправляет */
    try { if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(r.res).catch(function () { /* нет права — скажем то же, буфер не главное */ }); } catch (e) { /* старый браузер */ }
    say(T("dt.copied", { v: r.res }) + " [" + T("dt.toNote") + "]", { on: function () {
      if (typeof window.sbAddQuickNote === "function") { window.sbAddQuickNote(text, { calc: true }); say(T("dt.toNote.done")); }
    } });
  }
  function press(k) {
    var v = line.value;
    if (k !== "=") disarmCopy();
    if (k === "C") { line.value = ""; justEq = false; update(); return; }
    if (k === "back") { line.value = v.slice(0, -1); justEq = false; update(); return; }
    if (k === "=") { equals(); return; }
    var ch = k === "dec" ? decSign() : k === "−" ? "-" : k;
    /* после ответа цифра начинает новый счёт, знак — продолжает от ответа */
    if (justEq && /[\d(]/.test(ch) || (justEq && ch === decSign())) v = "";
    justEq = false;
    line.value = v + ch; update();
  }
  /* МЫСЛЬ ОСТАЁТСЯ МЫСЛЬЮ (основатель 12.11): цифры внутри — просто текст («позвонить в 18:30»,
     «2 литра»); только чистый пример и «=» — ответ светом прямо в строке, как в записи, и это
     уже не мысль: Enter её не сохраняет, в записи она уйдёт только словом [в запись]. */
  var answered = false, heldDraft = "";
  function thoughtEq() {
    var C = window.sbCalc, a = C && C.lineAnswer(line.value + "=", lang());
    if (!a) return false;
    var txt = a.res.ok ? a.res.text : T(a.res.word);
    line.value = a.expr + " = " + txt; answered = true;
    ov.setAttribute("data-kind", "answer");
    if (a.res.ok && typeof a.res.value === "number") showResult(a.res.kind === "split" ? a.res.text : C.format(a.res.value, lang()), a.res.unit || "", true);
    else DT.show({ str: "", label: txt });
    announce(line.value);
    if (a.res.ok) { lastRes = { expr: glyphsOf(a.expr) || a.expr, res: txt }; pushHist(lastRes.expr, lastRes.res); armCopy(); }
    return true;
  }
  function enter() {
    if (tool === "line") {
      if (answered) return;   /* ответ — не мысль: в записи только словом [в запись] */
      if (line.value.trim() && window.sbThought) { var tid = window.sbThought.save(line.value); if (tid) { line.value = ""; draft = ""; closeTools(false); } }
      return;
    }
    var k = kindOf(line.value);
    if (k === "math") { equals(); return; }
    if (k === "conv" || k === "phrase") { update(); return; }
    if (k === "words" && window.sbThought) {
      var id = window.sbThought.save(line.value);
      if (id) { line.value = ""; draft = ""; closeTools(false); }
    }
  }

  /* ---------- инструменты ---------- */
  function setTool(t, quiet) {
    var was = tool; tool = t;
    if (!quiet) { var s0 = readS(); if (s0.last !== t) { s0.last = t; writeS(s0); } }
    paintFoot();
    if (was === "breath" && t !== "breath") stopBreath();
    clearInterval(cityTick); cityTick = 0;
    [].forEach.call(tray.querySelectorAll(".dt-word"), function (b) { var on = b.dataset.tool === t; b.setAttribute("aria-pressed", on ? "true" : "false"); b.classList.toggle("on", on); });
    ov.setAttribute("data-tool", t);
    var isLine = lineish(t);
    ov.querySelector(".dt-linebox").hidden = !isLine;
    keys.hidden = t !== "calc";
    /* подсказка строки — по смыслу: «мысль…» или «пример…» */
    line.placeholder = T(t === "calc" ? "dt.line.phCalc" : "dt.line.ph");
    pane.hidden = isLine; hit.hidden = t !== "count";
    if (t !== "count") { hit.setAttribute("aria-hidden", "true"); hit.tabIndex = -1; }
    if (isLine && lastRes) armCopy();
    if (isLine) {
      pane.innerHTML = "";
      if (!quiet) {
        layout(); update();
        /* мысль — фокус сразу; расчёт касанием — без системной клавиатуры: клавиши света уже здесь */
        if (t === "line" || !root.classList.contains("is-touch")) { try { line.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
      }
      return;
    }
    DT.hide();
    if (t === "count") paneCount();
    else if (t === "wait") paneWait();
    else if (t === "city") paneCity();
    else if (t === "breath") paneBreath();
    else if (t === "sun") paneSun();
    else if (t === "noise") paneNoise();
    layout();
  }
  function btnW(data, word, extra) { return '<button type="button" class="dt-word' + (extra || "") + '" ' + data + ">" + esc(word) + "</button>"; }

  /* счётчик: касание = +1 */
  function showCount(n, first) { DT.show({ str: String(n).replace("-", "−"), label: T("dt.count.label"), sub: first ? T("dt.count.tap") + " \u00b7 " + T("dt.count.long") : "" }); }
  function paneCount() {
    var s = readS();
    pane.innerHTML = '<div class="dt-row">' + btnW('data-c="minus" aria-label="' + esc(T("dt.key.minus")) + ' 1"', T("dt.count.minus")) + btnW('data-c="reset"', T("dt.count.reset")) + "</div>";
    hit.setAttribute("aria-label", T("dt.count.plus")); hit.removeAttribute("aria-hidden"); hit.tabIndex = 0;
    showCount(s.count, s.count === 0);
    announce(T("dt.count.said", { n: s.count }));
    if (by !== "touch") { try { hit.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
  }
  function count(d) {
    var s = readS();
    s.count = d === 0 ? 0 : s.count + d; writeS(s);
    showCount(s.count, false); announce(T("dt.count.said", { n: s.count }));
    try { if (d > 0 && navigator.vibrate && root.classList.contains("is-touch")) navigator.vibrate(8); } catch (e) { /* без отклика */ }
  }

  /* ожидание: до дня */
  function plural(n) {
    var l = lang(), a = Math.abs(n) % 100, b = a % 10;
    if (l === "ru") return T(a > 10 && a < 20 ? "dt.wait.day5" : b === 1 ? "dt.wait.day1" : b >= 2 && b <= 4 ? "dt.wait.day2" : "dt.wait.day5");
    return T(Math.abs(n) === 1 ? "dt.wait.day1" : "dt.wait.day2");
  }
  function daysTo(iso, nowAt) {
    var m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(String(iso || "")); if (!m) return null;
    var t = new Date(+m[1], +m[2] - 1, +m[3]).getTime(), n = new Date(nowAt || Date.now()); n.setHours(0, 0, 0, 0);
    return Math.round((t - n.getTime()) / DAY);
  }
  function showWait() {
    var s = readS(), w = s.wait || {}, n = daysTo(w.date);
    if (n == null) { DT.hide(); return; }
    var what = String(w.what || "").trim(), lbl = what ? T("dt.wait.until", { what: what }) : T("dt.wait.untilBare");
    if (n === 0) DT.show({ str: "", label: what || T("dt.wait.today"), sub: T("dt.wait.today") });
    else if (n > 0) DT.show({ str: String(n), label: lbl, sub: plural(n) });
    else DT.show({ str: String(-n), label: what, sub: T("dt.wait.past", { n: -n }) });
    announce((what ? what + ": " : "") + (n === 0 ? T("dt.wait.today") : n > 0 ? n + " " + plural(n) : T("dt.wait.past", { n: -n })));
  }
  function paneWait() {
    var w = readS().wait || {};
    pane.innerHTML = '<div class="dt-row"><input type="text" class="dt-field" data-w="what" maxlength="40" autocomplete="off" placeholder="' + esc(T("dt.wait.what")) + '" aria-label="' + esc(T("dt.wait.whatAria")) + '" value="' + esc(w.what || "") + '">' +
      '<input type="date" class="dt-field dt-date" data-w="date" autocomplete="off" aria-label="' + esc(T("dt.wait.when")) + '" value="' + esc(w.date || "") + '"></div>' +
      '<div class="dt-row">' + btnW('data-w2="forget"', T("dt.wait.forget")) + btnW('data-w2="done"', T("dt.done"), " lamp") + "</div>";
    showWait();
  }
  function putWait() {
    var s = readS(), a = pane.querySelector('[data-w="what"]'), b = pane.querySelector('[data-w="date"]');
    s.wait = { what: a ? a.value.trim().slice(0, 40) : "", date: b ? b.value : "" }; writeS(s); showWait();
  }

  /* второй город: пояса браузера, без сети */
  /* справочник городов — общий с «солнцем и луной» (core/sky.js): пояс, имена ru/en/ee, широта, долгота */
  var CITIES = window.sbCities || [];

  function nameOf(row) { var l = lang(); return row[l === "ru" ? 1 : l === "ee" ? 3 : 2]; }
  function zoneOk(tz) { try { new Intl.DateTimeFormat("en", { timeZone: tz }).format(0); return true; } catch (e) { return false; } }
  function findCity(q) {
    var s = String(q || "").trim().toLowerCase().replace(/ё/g, "е"); if (!s) return null;
    var i, r;
    for (i = 0; i < CITIES.length; i++) { r = CITIES[i]; if ([r[1], r[2], r[3]].some(function (n) { return n.toLowerCase().replace(/ё/g, "е") === s; })) return { tz: r[0], name: nameOf(r), row: r }; }
    for (i = 0; i < CITIES.length; i++) { r = CITIES[i]; if ([r[1], r[2], r[3]].some(function (n) { return n.toLowerCase().replace(/ё/g, "е").indexOf(s) === 0; })) return { tz: r[0], name: nameOf(r), row: r }; }
    /* все пояса, которые знает этот браузер: «Reykjavik», «Asia/Kathmandu» */
    var all = []; try { all = Intl.supportedValuesOf ? Intl.supportedValuesOf("timeZone") : []; } catch (e) { all = []; }
    for (i = 0; i < all.length; i++) {
      var tail = all[i].split("/").pop().replace(/_/g, " ").toLowerCase();
      if (all[i].toLowerCase() === s || tail === s || tail.indexOf(s) === 0) return { tz: all[i], name: all[i].split("/").pop().replace(/_/g, " ") };
    }
    if (zoneOk(q)) return { tz: q, name: q.split("/").pop().replace(/_/g, " ") };
    return null;
  }
  function offsetMin(tz, d) {
    try {
      var p = {}; new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).formatToParts(d).forEach(function (x) { p[x.type] = x.value; });
      return Math.round((Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute) - Math.floor(d.getTime() / 60000) * 60000) / 60000);
    } catch (e) { return null; }
  }
  function showCity() {
    var c = readS().city;
    /* город ещё не выбран — тот же выбор по умолчанию, что у солнца: город пояса этого устройства, иначе первый
       в справочнике; закреплённый второй город не встаёт пустым местом (desktools-pin, доска H4b) */
    if (!c || !c.tz || !zoneOk(c.tz)) { var d0 = sunCity(); c = d0 && d0[0] ? { tz: d0[0], name: nameOf(d0) } : null; }
    if (!c || !c.tz || !zoneOk(c.tz)) { DT.hide(); return; }
    var d = new Date(), hm = "";
    try { hm = new Intl.DateTimeFormat("en-GB", { timeZone: c.tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(d); } catch (e) { hm = ""; }
    var diff = offsetMin(c.tz, d), here = -d.getTimezoneOffset(), sub = "";
    if (diff != null) {
      var dm = diff - here, a = Math.abs(dm), h = Math.floor(a / 60), m = a % 60;
      var amt = m ? T("dt.city.hm", { h: h, m: m }) : T("dt.city.hh", { h: h });
      sub = dm === 0 ? T("dt.city.same") : T(dm > 0 ? "dt.city.ahead" : "dt.city.behind", { h: amt });
    }
    DT.show({ str: hm.replace(/^0(?=\d:)/, ""), label: c.name, sub: sub });
    announce(c.name + " " + hm + (sub ? ", " + sub : ""));
  }
  function paneCity() {
    var c = readS().city || {};
    pane.innerHTML = '<div class="dt-row"><input type="text" class="dt-field" data-city="1" list="sbDtCities" maxlength="40" autocomplete="off" placeholder="' + esc(T("dt.city.ph")) + '" aria-label="' + esc(T("dt.city.aria")) + '" value="' + esc(c.name || "") + '">' +
      '<datalist id="sbDtCities">' + CITIES.map(function (r) { return '<option value="' + esc(nameOf(r)) + '"></option>'; }).join("") + "</datalist></div>" +
      '<p class="dt-hint">' + esc(T("dt.city.hint")) + "</p>" +
      '<div class="dt-row">' + btnW('data-w2="done"', T("dt.done"), " lamp") + "</div>";
    showCity();
    cityTick = setInterval(function () { if (open && tool === "city") showCity(); }, 15000);
  }
  function putCity(v) {
    var f = findCity(v), s = readS();
    if (!f) { DT.show({ str: "", label: "", sub: T("dt.city.none") }); announce(T("dt.city.none")); return; }
    s.city = { tz: f.tz, name: f.name }; writeS(s); showCity();
  }

  /* ---------- солнце и луна (D-893): восход, закат, долгота дня, фаза луны ---------- */
  function hmIn(tz, ms) { try { return new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(ms).replace(/^0(?=\d:)/, ""); } catch (e) { return ""; } }
  function sunCity() {
    var c = readS().sun, row = c && window.sbSky ? window.sbSky.find(c.tz, c.name) : null;
    if (!row) {   /* по умолчанию — город пояса этого устройства, иначе Таллин */
      var here = ""; try { here = Intl.DateTimeFormat().resolvedOptions().timeZone; } catch (e) { here = ""; }
      row = (window.sbSky && window.sbSky.find(here)) || CITIES[0];
    }
    return row;
  }
  function showSun() {
    var row = sunCity(); if (!row || !window.sbSky) { DT.hide(); return; }
    var D = window.sbSky.day(row, Date.now()), t = D.today, mo = T("dt.moon." + D.moon.phase), lbl, str, sub;
    if (t.polar) { str = ""; lbl = nameOf(row); sub = T(t.polar === "day" ? "dt.sun.polarDay" : "dt.sun.polarNight") + " \u00b7 " + mo; }
    else {
      var L = Math.round(t.len / 60000); str = Math.floor(L / 60) + ":" + two(L % 60);
      lbl = nameOf(row) + " \u00b7 " + T("dt.sun.rise", { t: hmIn(row[0], t.rise) }) + " \u00b7 " + T("dt.sun.set", { t: hmIn(row[0], t.set) });
      var dm = Math.round(D.delta / 60000);
      /* крупное «7:56» — долгота дня, а не время: вторая подпись называет его словами (глубокий аудит Б-17, D-869) */
      sub = T("dt.sun.len", { h: Math.floor(L / 60), m: L % 60 }) + " \u00b7 " + (dm === 0 ? T("dt.sun.same") : T(dm > 0 ? "dt.sun.longer" : "dt.sun.shorter", { m: Math.abs(dm) })) + " \u00b7 " + mo;
    }
    DT.show({ str: str, label: lbl, sub: sub });
    announce(lbl + ". " + sub);
    paintMoon(D.moon);
  }
  /* луна светом: освещённая доля диска тем же светом темы */
  function paintMoon(m) {
    var c = pane && pane.querySelector(".dt-moon"); if (!c || !DT) return;
    var dpr = Math.min(2, window.devicePixelRatio || 1), S = 44, x = c.getContext("2d"), P = DT.pal();
    c.width = S * dpr; c.height = S * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, S, S);
    var r = 15, cx = S / 2, cy = S / 2, core = "rgba(" + P.c.join(","), glow = "rgba(" + P.g.join(",");
    x.fillStyle = glow + ",0.10)"; x.beginPath(); x.arc(cx, cy, r, 0, 6.283); x.fill();
    /* терминатор — эллипс с полуосью r·cos(2πf) */
    var f = m.frac, k = Math.cos(2 * Math.PI * f), right = m.waxing;
    x.save(); x.beginPath();
    x.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, !right);
    x.ellipse(cx, cy, Math.abs(k) * r, r, 0, Math.PI / 2, -Math.PI / 2, (k > 0) === right);
    x.closePath(); x.shadowColor = glow + ",0.7)"; x.shadowBlur = 8; x.fillStyle = core + ",0.92)"; x.fill(); x.restore();
    c.setAttribute("aria-label", T("dt.moon." + m.phase));
  }
  function paneSun() {
    var row = sunCity();
    pane.innerHTML = '<div class="dt-row"><canvas class="dt-moon" width="44" height="44" role="img"></canvas>' +
      '<input type="text" class="dt-field" data-sun="1" list="sbDtCities" maxlength="40" autocomplete="off" placeholder="' + esc(T("dt.city.ph")) + '" aria-label="' + esc(T("dt.city.aria")) + '" value="' + esc(row ? nameOf(row) : "") + '">' +
      '<datalist id="sbDtCities">' + CITIES.map(function (r) { return '<option value="' + esc(nameOf(r)) + '"></option>'; }).join("") + "</datalist></div>" +
      '<p class="dt-hint">' + esc(T("dt.sun.hint")) + "</p>" +
      '<div class="dt-row">' + btnW('data-w2="done"', T("dt.done"), " lamp") + "</div>";
    showSun();
    cityTick = setInterval(function () { if (open && tool === "sun") showSun(); }, 60000);
  }
  function putSun(v) {
    var f = findCity(v), s = readS();
    if (!f || !f.row) { DT.show({ str: "", label: "", sub: T("dt.city.none") }); announce(T("dt.city.none")); return; }
    s.sun = { tz: f.tz, name: nameOf(f.row) }; writeS(s); showSun();
  }

  /* ---------- тихий шум (D-892): звук рождается на устройстве (core/noise.js) ---------- */
  function noiseView() {
    var N = window.sbNoise; if (!N) return;
    var cur = N.playing(), left = N.left();
    if (open && tool === "noise") DT.show({ str: "", label: cur ? T("dt.noise." + cur) : T("dt.tool.noise"), sub: left ? T("dt.noise.left", { n: Math.ceil(left / 60000) }) : "" });
    if (pane && tool === "noise") {
      [].forEach.call(pane.querySelectorAll("[data-snd]"), function (b) { var on = b.dataset.snd === cur; b.setAttribute("aria-pressed", on ? "true" : "false"); b.classList.toggle("on", on); });
    }
    paintSign();
  }
  function paneNoise() {
    /* громкость по умолчанию — низкая (D-892): первый звук входит тихо и плавно */
    var N = window.sbNoise, s = readS(), v = typeof s.vol === "number" ? s.vol : 0.22;
    if (!N) return;
    N.volume(v);
    pane.innerHTML = '<div class="dt-row" role="group" aria-label="' + esc(T("dt.tool.noise")) + '">' + N.sounds.map(function (n) { return btnW('data-snd="' + n + '" aria-pressed="false"', T("dt.noise." + n)); }).join("") + "</div>" +
      '<input type="range" class="dt-thread" min="0" max="100" step="1" value="' + Math.round(v * 100) + '" aria-label="' + esc(T("dt.noise.vol")) + '">' +
      '<div class="dt-row">' + [15, 30, 60].map(function (m) { return btnW('data-sleep="' + m + '"', T("dt.noise.min", { n: m })); }).join("") + btnW('data-sleep="0"', T("dt.noise.forever")) + btnW('data-snd-off="1"', T("dt.noise.off")) + "</div>";
    noiseView();
  }
  /* тихий световой знак, что звучит: точка у середины стола, касание — к шуму */
  function paintSign() {
    if (!sign) return;
    var N = window.sbNoise, cur = N && N.playing();
    sign.hidden = !cur || (open && tool === "noise");
    if (!sign.hidden) {
      sign.setAttribute("aria-label", T("dt.noise.sign", { s: T("dt.noise." + cur) }));
      var H = window.innerHeight; sign.style.top = Math.round(Math.min(H - 110, freeCy() + DT.Hd() * 1.4)) + "px";
    }
  }

  /* ---------- закрепить (D-890): инструмент остаётся на столе тем же слоем ---------- */
  function paintFoot() {
    if (!foot) return;
    var pb = foot.querySelector(".dt-pin"), pinned = readS().pin === tool;
    pb.hidden = !PINNABLE[tool];
    pb.textContent = T(pinned ? "dt.unpin" : "dt.pin");
    pb.setAttribute("aria-pressed", pinned ? "true" : "false");
    pb.classList.toggle("on", pinned);
    var hb = foot.querySelector(".dt-histbtn"), hl = ov.querySelector(".dt-hist");
    hb.hidden = tool !== "calc" || !(readS().hist || []).length;
    if (hb.hidden && hl) { hl.hidden = true; hb.setAttribute("aria-expanded", "false"); }
  }
  /* ---------- история: последние пять расчётов тихой колонкой (D-901) ---------- */
  function pushHist(expr, res) {
    var s = readS(), h = (s.hist || []).filter(function (x) { return x && x.e !== expr; });
    h.unshift({ e: expr, r: res }); s.hist = h.slice(0, 5); writeS(s); paintFoot();
  }
  function paintHist() {
    var hl = ov.querySelector(".dt-hist"); if (!hl) return;
    hl.innerHTML = (readS().hist || []).map(function (x, i) {
      return '<button type="button" class="dt-quiet dt-histrow" role="listitem" data-h="' + i + '">' + esc(x.e + " = " + x.r) + "</button>";
    }).join("");
  }
  function togglePin() {
    if (!PINNABLE[tool]) return;
    var s = readS(), on = s.pin !== tool;
    s.pin = on ? tool : null; writeS(s);
    say(T(on ? "dt.pin.on" : "dt.pin.off"));
    paintFoot();
  }
  function pinnedShow(p) {
    if (p === "count") showCount(readS().count, false);
    else if (p === "wait") showWait();
    else if (p === "city") showCity();
    else if (p === "sun") showSun();
  }
  /* закреплённый — на столе, пока инструменты убраны; идущее время важнее: под таймером слой молчит */
  function showPinned() {
    clearInterval(pinTick); pinTick = 0;
    if (open || !DT) return;
    var p = readS().pin;
    if (!p || !PINNABLE[p]) return;
    if (DT.info().mode) { DT.hide(); return; }
    pinnedShow(p); DT.setCy(freeCy());
    if (p === "city" || p === "sun" || p === "wait") pinTick = setInterval(function () { if (!open && !doc.hidden && !DT.info().mode) pinnedShow(p); }, p === "city" ? 15000 : 60000);
  }

  /* ---------- дыхание: свет растёт на вдохе и гаснет на выдохе ---------- */
  /* ПОСТОЯННЫЕ: вдох 4 с, пауза 1 с, выдох 5 с — 10 с на круг, 9 кругов = полторы минуты (решение основателя «~1,5 мин»). */
  var B_IN = 4000, B_HOLD = 1000, B_OUT = 5000, B_N = 9, B_END = 3200;
  var bcv = null, bctx = null, braf = 0, bt0 = 0, bWord = "", bTmo = 0, bR = 0;
  function breathCanvas() {
    if (bcv) return bcv;
    var layer = doc.querySelector(".wp-layer"); if (!layer) return null;
    bcv = doc.createElement("canvas"); bcv.id = "sbDtBreath"; bcv.setAttribute("aria-hidden", "true");
    bcv.style.cssText = "position:absolute;left:0;top:0;right:auto;bottom:auto;display:block;pointer-events:none";
    layer.appendChild(bcv); bctx = bcv.getContext("2d");
    return bcv;
  }
  function breathPhase(t) {
    var cyc = B_IN + B_HOLD + B_OUT, k = Math.floor(t / cyc), u = t - k * cyc;
    if (k >= B_N) return { end: true, e: t - B_N * cyc };
    if (u < B_IN) return { w: "in", r: sm(u / B_IN) };
    if (u < B_IN + B_HOLD) return { w: "hold", r: 1 };
    return { w: "out", r: 1 - sm((u - B_IN - B_HOLD) / B_OUT) };
  }
  function drawBreath(r, word, al) {
    var P = DT.pal(), dpr = Math.min(2, window.devicePixelRatio || 1), S = bR * 2 + 40, x = bctx;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, bcv.width, bcv.height); x.setTransform(dpr, 0, 0, dpr, 0, 0);
    var c = S / 2, rad = bR * (0.28 + 0.72 * r), dust = DT.variant() === "dust", core = "rgba(" + P.c.join(",") + ",", glow = "rgba(" + P.g.join(",") + ",";
    var g = x.createRadialGradient(c, c, 0, c, c, rad * 1.25);
    g.addColorStop(0, glow + (0.16 + 0.14 * r) * al + ")"); g.addColorStop(0.7, glow + 0.06 * al + ")"); g.addColorStop(1, glow + "0)");
    x.fillStyle = g; x.beginPath(); x.arc(c, c, rad * 1.25, 0, 6.283); x.fill();
    if (dust) {
      x.globalCompositeOperation = "lighter";
      for (var i = 0; i < 90; i++) {
        var a = i * 2.39996, j = 1 + 0.05 * Math.sin(i * 12.9898), px = c + Math.cos(a) * rad * j, py = c + Math.sin(a) * rad * j, s = 1.2 + (i % 5) * 0.35;
        x.fillStyle = core + (0.55 + 0.35 * ((i * 7) % 3) / 2) * al + ")"; x.beginPath(); x.arc(px, py, s, 0, 6.283); x.fill();
      }
      x.globalCompositeOperation = "source-over";
    } else {
      x.lineWidth = 6; x.strokeStyle = glow + 0.25 * al + ")"; x.filter = "blur(4px)"; x.beginPath(); x.arc(c, c, rad, 0, 6.283); x.stroke();
      x.filter = "none"; x.lineWidth = 1.4; x.strokeStyle = core + 0.92 * al + ")"; x.beginPath(); x.arc(c, c, rad, 0, 6.283); x.stroke();
    }
    if (word) {
      x.font = "300 " + Math.round(Math.max(15, bR * 0.13)) + "px \"SB Voice\", system-ui, sans-serif"; x.textAlign = "center"; x.textBaseline = "middle";
      x.shadowColor = glow + "0.6)"; x.shadowBlur = 10; x.fillStyle = core + 0.85 * al + ")"; x.fillText(word, c, c); x.shadowBlur = 0;
    }
  }
  function sizeBreath() {
    if (!breathCanvas()) return;
    var W = window.innerWidth, H = window.innerHeight, dpr = Math.min(2, window.devicePixelRatio || 1);
    bR = Math.round(Math.max(70, Math.min(170, Math.min(W, H) * 0.2)));
    var cy = Math.min(L.gy + DT.Hd() * 0.4, H * 0.55);
    /* круг вдоха не ложится на подписи значков (глубокий аудит Б-19, D-876): центр не выше низа значков + R + 12,
       а радиус — по свободному месту между значками и низом стола */
    var ib = iconsBottom(), free = (H - 90) - ib, cx = W / 2;
    if (ov && ov.classList.contains("land")) {
      /* на боку значки отошли: круг — в левой колонке, по её высоте и ширине (D-1023) */
      cx = L.gx; cy = L.gy + Math.round(DT.Hd() * 0.4);
      var tb3 = doc.getElementById("topbar"), t3 = tb3 ? tb3.getBoundingClientRect().bottom : 44;
      bR = Math.max(44, Math.min(bR, Math.floor(W / 4) - 28, Math.floor(Math.min(cy - t3, H - 16 - cy)) - 8));
    } else if (ib && free > 0) { bR = Math.max(44, Math.min(bR, Math.floor((free - 24) / 2))); cy = Math.max(cy, ib + bR + 12); }
    var S = bR * 2 + 40; bcv.width = Math.round(S * dpr); bcv.height = Math.round(S * dpr); bcv.style.width = S + "px"; bcv.style.height = S + "px";
    bcv.style.transform = "translate3d(" + Math.round(cx - S / 2) + "px," + Math.round(cy - S / 2) + "px,0)";
  }
  function breathFrame() {
    braf = 0; if (!bcv || tool !== "breath") return;
    var t = performance.now() - bt0, ph = breathPhase(t);
    if (ph.end) {
      var al = 1 - sm(ph.e / B_END); drawBreath(0, T("dt.breath.end"), al);
      if (ph.e < B_END) braf = requestAnimationFrame(breathFrame); else { stopBreath(); announce(T("dt.breath.end")); setTool("line"); }
      return;
    }
    var w = T("dt.breath." + ph.w); if (w !== bWord) { bWord = w; }
    drawBreath(ph.r, w, 1);
    braf = requestAnimationFrame(breathFrame);
  }
  /* «меньше движения»: свет не растёт — меняются только слова, по одной перерисовке на смену */
  function breathStill() {
    var t = performance.now() - bt0, ph = breathPhase(t);
    if (ph.end) { drawBreath(0.6, T("dt.breath.end"), 1); bTmo = setTimeout(function () { stopBreath(); setTool("line"); }, B_END); return; }
    drawBreath(0.6, T("dt.breath." + ph.w), 1);
    var cyc = B_IN + B_HOLD + B_OUT, u = t % cyc, nextIn = u < B_IN ? B_IN - u : u < B_IN + B_HOLD ? B_IN + B_HOLD - u : cyc - u;
    bTmo = setTimeout(breathStill, Math.max(30, nextIn + 10));
  }
  function paneBreath() {
    pane.innerHTML = '<p class="dt-hint">' + esc(T("dt.breath.aria")) + '</p><div class="dt-row">' + btnW('data-b="stop"', T("dt.breath.stop")) + "</div>";
    if (!breathCanvas()) return;
    sizeBreath(); bt0 = performance.now(); bWord = ""; bcv.style.opacity = "1";
    announce(T("dt.breath.aria"));
    if (reduced()) breathStill(); else braf = requestAnimationFrame(breathFrame);
  }
  function stopBreath() {
    if (braf) cancelAnimationFrame(braf); braf = 0; clearTimeout(bTmo); bTmo = 0;
    if (bctx) { bctx.setTransform(1, 0, 0, 1, 0, 0); bctx.clearRect(0, 0, bcv.width, bcv.height); }
  }

  /* ---------- главное сегодня: запись светится в середине ---------- */
  var tcv = null, tctx = null, tKey = "", tRect = null;
  function todayCanvas() {
    if (tcv) return tcv;
    var layer = doc.querySelector(".wp-layer"); if (!layer) return null;
    tcv = doc.createElement("canvas"); tcv.id = "sbDtToday"; tcv.setAttribute("aria-hidden", "true");
    tcv.style.cssText = "position:absolute;left:0;top:0;right:auto;bottom:auto;display:block;pointer-events:none";
    layer.appendChild(tcv); tctx = tcv.getContext("2d");
    return tcv;
  }
  function hideToday() { if (tctx) { tctx.setTransform(1, 0, 0, 1, 0, 0); tctx.clearRect(0, 0, tcv.width, tcv.height); } tKey = ""; if (todayBtn) todayBtn.hidden = true; }
  function rnd(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function paintToday(force) {
    if (!DT || !todayBtn) return;
    var N = window.sbNoteToday ? window.sbNoteToday.get() : null, info = DT.info();
    if (!N || open || deskBusy() || DT.tool()) { hideToday(); return; }
    if (!todayCanvas()) return;
    var txt = String(N.text || "").split("\n").filter(function (l) { return l.trim(); })[0] || "";
    txt = txt.trim(); if (txt.length > 46) txt = txt.slice(0, 45).trim() + "…";
    var W = window.innerWidth, H = window.innerHeight, Hd = DT.Hd(), dpr = Math.min(2, window.devicePixelRatio || 1);
    /* в покое — в самой середине; идёт время — над ним, тем же светом */
    var cy = info.mode ? Math.max(safeTop() + 20, Math.round(H * 0.5 - Hd * 1.25)) : Math.round(H * 0.5);
    var view = DT.variant(), P = DT.pal(), key = [txt, view, P.mood, W, H, cy, reduced()].join("|");
    if (!force && key === tKey) return;
    tKey = key;
    var fs = Math.round(Math.max(20, Math.min(40, Hd * 0.42))), font = "300 " + fs + "px \"SB Voice\", system-ui, sans-serif";
    var m = tctx; m.font = font; var tw = Math.ceil(m.measureText(txt).width), bw = Math.min(W - 24, tw + fs * 2), bh = fs * 3;
    tcv.width = Math.round(bw * dpr); tcv.height = Math.round(bh * dpr); tcv.style.width = bw + "px"; tcv.style.height = bh + "px";
    tcv.style.transform = "translate3d(" + Math.round(W / 2 - bw / 2) + "px," + Math.round(cy - bh / 2) + "px,0)";
    var x = tctx; x.setTransform(dpr, 0, 0, dpr, 0, 0); x.font = font; x.textAlign = "center"; x.textBaseline = "middle";
    var core = "rgba(" + P.c.join(",") + ",", glow = "rgba(" + P.g.join(",") + ",";
    if (view === "dust") {
      /* пыль: буквы — маской, по маске — пылинки (раз на смену текста, не каждый кадр) */
      var mk = doc.createElement("canvas"); mk.width = Math.ceil(bw); mk.height = Math.ceil(bh);
      var mx = mk.getContext("2d"); mx.font = font; mx.textAlign = "center"; mx.textBaseline = "middle"; mx.fillStyle = "#fff"; mx.fillText(txt, bw / 2, bh / 2);
      var px = mx.getImageData(0, 0, mk.width, mk.height).data, step = 2, i = 0;
      x.shadowColor = glow + "0.5)"; x.shadowBlur = 6;
      for (var yy = 0; yy < mk.height; yy += step) for (var xx = 0; xx < mk.width; xx += step) {
        if (px[(yy * mk.width + xx) * 4 + 3] < 120) continue;
        i++; if (rnd(i) > 0.55) continue;
        x.fillStyle = core + (0.45 + 0.45 * rnd(i + 3)) + ")"; x.beginPath(); x.arc(xx + rnd(i + 7) - 0.5, yy + rnd(i + 9) - 0.5, 0.7 + rnd(i + 5) * 0.8, 0, 6.283); x.fill();
      }
      x.shadowBlur = 0;
    } else {
      x.shadowColor = glow + "0.55)"; x.shadowBlur = 16; x.fillStyle = glow + "0.35)"; x.fillText(txt, bw / 2, bh / 2);
      x.shadowBlur = 5; x.fillStyle = core + "0.92)"; x.fillText(txt, bw / 2, bh / 2); x.shadowBlur = 0;
    }
    tRect = { x: Math.round(W / 2 - Math.min(bw, tw + 24) / 2), y: Math.round(cy - fs * 0.9), w: Math.min(bw, tw + 24), h: Math.round(fs * 1.8) };
    todayBtn.hidden = false; todayBtn.dataset.id = N.id;
    todayBtn.setAttribute("aria-label", T("dt.today.aria", { t: txt }));
    todayBtn.style.left = tRect.x + "px"; todayBtn.style.top = tRect.y + "px"; todayBtn.style.width = tRect.w + "px"; todayBtn.style.height = tRect.h + "px";
  }

  /* ---------- «12 × 7 =» в записи — ответ сразу ---------- */
  var answering = false;
  function noteAnswer(ev) {
    var el = ev.target;
    if (!el || !window.sbCalc || ev.inputType !== "insertText" || ev.data !== "=" || answering) return;
    if (el.tagName !== "TEXTAREA" && !(el.tagName === "INPUT" && (el.type === "text" || el.type === "search"))) return;
    if (!(el.closest && (el.closest(".sticky-note") || el.closest('.window[data-app="notes"]')))) return;
    var pos = el.selectionStart; if (pos == null || pos !== el.selectionEnd) return;
    var v = el.value, ls = v.lastIndexOf("\n", pos - 1) + 1, le = v.indexOf("\n", pos);
    if (v.slice(pos, le < 0 ? v.length : le).trim()) return;   /* «=» не в конце строки — это не просьба посчитать */
    var a = window.sbCalc.lineAnswer(v.slice(ls, pos)); if (!a) return;
    var ins = " " + (a.res.ok ? a.res.text : T(a.res.word));
    /* до слушателей самой записи: они сохранят уже строку с ответом */
    /* вставка — отдельным шагом правки: Ctrl+Z снимает ответ и оставляет набранное (D-903) */
    var done = false;
    answering = true; try { done = doc.execCommand && doc.execCommand("insertText", false, ins); } catch (e) { done = false; } answering = false;
    if (!done || el.value.slice(pos, pos + ins.length) !== ins) {
      try { el.setRangeText(ins, pos, pos, "end"); } catch (e) { el.value = v.slice(0, pos) + ins + v.slice(pos); el.selectionStart = el.selectionEnd = pos + ins.length; }
    }
    lastAns = { el: el, pos: pos, ins: ins };
  }
  /* Ctrl+Z сразу после ответа снимает ровно ответ: браузер склеивает вставку с набранным в один шаг
     и снимал бы «7 = 84» целиком (D-903, desktools-ux п.13). Не сразу после — правка как у браузера. */
  var lastAns = null;
  function noteUndo(ev) {
    if (!lastAns || ev.key.toLowerCase() !== "z" || !(ev.ctrlKey || ev.metaKey) || ev.shiftKey || ev.altKey) { if (ev.key && ev.key.length === 1 && !ev.ctrlKey && !ev.metaKey) lastAns = null; return; }
    var L = lastAns, el = L.el; lastAns = null;
    if (ev.target !== el || el.selectionStart !== L.pos + L.ins.length || el.value.slice(L.pos, L.pos + L.ins.length) !== L.ins) return;
    ev.preventDefault();
    el.setRangeText("", L.pos, L.pos + L.ins.length, "end");
    el.dispatchEvent(new Event("input", { bubbles: true }));
  }

  /* ---------- провода ---------- */
  function inCenter(x, y) {
    var W = window.innerWidth, H = window.innerHeight, r = Math.max(64, Math.min(W, H) * 0.17), dx = x - W / 2, dy = y - H * 0.5;
    return dx * dx + dy * dy <= r * r;
  }
  function deskTarget(t) {
    if (!t || !t.closest || !t.closest("#desktop")) return false;
    return !t.closest(window.sbEmptyDesktopSkipSelector || ".window");
  }
  function wireInner() {
    line.addEventListener("focus", function () { setTimeout(layout, 320); });   /* экранная клавиатура поднимается не сразу */
    line.addEventListener("input", function (ev) {
      disarmCopy(); answered = false;
      if (justEq && ev.data && /\d/.test(ev.data) && line.value.length > 1) { line.value = ev.data; }
      justEq = false; update();
    });
    line.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter") { ev.preventDefault(); enter(); }
      else if (ev.key === "=" && tool === "line") { if (thoughtEq()) ev.preventDefault(); }
      else if (ev.key === "=" && kindOf(line.value) === "math") { ev.preventDefault(); equals(); }
    });
    keys.addEventListener("click", function (ev) { var b = ev.target.closest && ev.target.closest("[data-k]"); if (b) press(b.dataset.k); });
    tray.addEventListener("click", function (ev) { var b = ev.target.closest && ev.target.closest("[data-tool]"); if (b) setTool(b.dataset.tool); });
    /* счётчик: касание +1, долгое касание −1 (случайное касание не портит счёт) · строка: касание ответа — скопировать */
    hit.addEventListener("pointerdown", function () {
      if (tool !== "count") return;
      held = false; clearTimeout(holdT);
      holdT = setTimeout(function () { held = true; count(-1); }, 550);   /* ПОСТОЯННАЯ: 550 мс — долгое касание системы (как у смайликов, D-590) */
    });
    ["pointerup", "pointercancel", "pointerleave"].forEach(function (k) { hit.addEventListener(k, function () { clearTimeout(holdT); }); });
    hit.addEventListener("click", function () {
      if (tool === "count") { if (held) { held = false; return; } count(1); }
      else if (lineish()) copyAnswer();
    });
    /* стрелки по сетке клавиш света (D-900): ←→ — соседняя, ↑↓ — ряд выше и ниже */
    keys.addEventListener("keydown", function (ev) {
      var b = ev.target.closest && ev.target.closest("[data-k]"); if (!b) return;
      var all = [].slice.call(keys.querySelectorAll("[data-k]")), i = all.indexOf(b), j = -1;
      if (ev.key === "ArrowRight") j = i + 1; else if (ev.key === "ArrowLeft") j = i - 1; else if (ev.key === "ArrowDown") j = i + 4; else if (ev.key === "ArrowUp") j = i - 4; else return;
      ev.preventDefault(); if (j >= 0 && j < all.length) all[j].focus();
    });
    ov.querySelector(".dt-close").addEventListener("click", function () { closeTools(); });
    ov.querySelector(".dt-hist").addEventListener("click", function (ev) {
      var b = ev.target.closest && ev.target.closest("[data-h]"); if (!b) return;
      var h = (readS().hist || [])[+b.dataset.h]; if (!h) return;
      line.value = h.r.replace("\u2212", "-"); justEq = true; update();
    });
    /* смахивания нет (основатель 12.11: жест пришлось бы объяснять) — внизу слово «закрыть», Esc и кнопка для чтеца */
    pane.addEventListener("click", function (ev) {
      var b = ev.target.closest && ev.target.closest("button"); if (!b) return;
      if (b.dataset.c === "plus" || b.dataset.c === "minus") count(b.dataset.c === "plus" ? 1 : -1);
      /* сброс — только после вопроса голосом: случайное касание не стирает счёт */
      if (b.dataset.c === "reset") say(T("dt.count.ask") + " [" + T("dt.count.yes") + "] [" + T("dt.count.no") + "]", { on: function (w, i) { if (i === 0) count(0); } });
      if (b.dataset.b === "stop") { stopBreath(); setTool("line"); }
      if (b.dataset.w2 === "forget") { var s = readS(); delete s.wait; writeS(s); paneWait(); }
      if (b.dataset.w2 === "done") closeTools(false);
      if (b.dataset.snd && window.sbNoise) {
        if (!window.sbNoise.play(b.dataset.snd)) say(T("dt.noise.mute"));
        /* честно, один раз: на телефоне браузер в фоне может приглушить звук */
        else if (root.classList.contains("is-touch")) { var sb0 = readS(); if (!sb0.bgSaid) { sb0.bgSaid = 1; writeS(sb0); setTimeout(function () { say(T("dt.noise.bg")); }, 1400); } }
        var s2 = readS(); s2.snd = b.dataset.snd; writeS(s2);
        setTimeout(function () { if (window.sbNoise && window.sbNoise.playing() && !window.sbNoise.running()) say(T("dt.noise.mute")); }, 600);
        noiseView();
      }
      if (b.dataset.sleep != null && window.sbNoise) { window.sbNoise.sleep(+b.dataset.sleep); noiseView(); }
      if (b.dataset.sndOff && window.sbNoise) { window.sbNoise.stop(); noiseView(); }
    });
    pane.addEventListener("input", function (ev) {
      var t = ev.target;
      if (t.classList && t.classList.contains("dt-thread") && window.sbNoise) { var v = +t.value / 100; window.sbNoise.volume(v); var s3 = readS(); s3.vol = v; writeS(s3); }
    });
    pane.addEventListener("change", function (ev) {
      var t = ev.target;
      if (t.dataset && t.dataset.w) putWait();
      if (t.dataset && t.dataset.city) putCity(t.value);
      if (t.dataset && t.dataset.sun) putSun(t.value);
    });
    pane.addEventListener("keydown", function (ev) {
      var t = ev.target;
      if (ev.key === "Enter" && t.dataset && t.dataset.city) { ev.preventDefault(); putCity(t.value); }
      if (ev.key === "Enter" && t.dataset && t.dataset.sun) { ev.preventDefault(); putSun(t.value); }
      if (ev.key === "Enter" && t.dataset && t.dataset.w) { ev.preventDefault(); putWait(); }
    });
    todayBtn.addEventListener("click", function () { if (window.sbThought && todayBtn.dataset.id) window.sbThought.open(todayBtn.dataset.id); });
    foot.addEventListener("click", function (ev) {
      var b = ev.target.closest && ev.target.closest("button"); if (!b) return;
      if (b.classList.contains("dt-pin")) togglePin();
      if (b.classList.contains("dt-shut")) closeTools();
      if (b.classList.contains("dt-histbtn")) { var hl = ov.querySelector(".dt-hist"), on = hl.hidden; if (on) paintHist(); hl.hidden = !on; b.setAttribute("aria-expanded", on ? "true" : "false"); layout(); }
      /* линии · пыль прямо в инструменте (D-898): тот же выбор, что в Настройках */
      if (b.dataset.view) {
        if (window.sbAddr && window.sbAddr.setView) window.sbAddr.setView(b.dataset.view);
        else { try { localStorage.setItem("sysbaby.desktime.view", b.dataset.view); } catch (e) { /* без памяти */ } window.dispatchEvent(new CustomEvent("sb:desktime", { detail: { view: b.dataset.view } })); }
      }
    });
    sign.addEventListener("click", function () { if (!open) openTools(root.classList.contains("is-touch") ? "touch" : "pointer"); setTool("noise"); });
    /* голос: кнопка видна, если у браузера есть вопрос «на устройстве?»; сам вопрос — только по касанию (D-894) */
    if (window.sbThought && window.sbThought.mic) {
      mic.hidden = !window.sbThought.mic.maybe();
      mic.addEventListener("click", function () {
        var M = window.sbThought.mic;
        if (M.on()) { M.stop(); return; }
        M.available(function (okv) {
          if (!okv) { mic.hidden = true; say(T("dt.mic.none")); return; }
          startMic();
        });
      });
    }
  }
  function startMic() {
    var M = window.sbThought && window.sbThought.mic; if (!M || !mic) return;
    var base = line.value ? line.value.replace(/\s*$/, " ") : "";
    if (M.start(function (t) { line.value = base + t; update(); }, function () { mic.setAttribute("aria-pressed", "false"); mic.classList.remove("on"); line.placeholder = T("dt.line.ph"); })) {
      mic.setAttribute("aria-pressed", "true"); mic.classList.add("on"); line.placeholder = T("dt.mic.on");
    }
  }
  function wire() {
    wireInner();
    /* счётчик с клавиатуры: + и = — плюс один, − — минус (слушатель на самом ov: он не пересоздаётся при смене языка) */
    ov.addEventListener("keydown", function (ev) {
      if (tool !== "count" || (ev.target && /INPUT|TEXTAREA/.test(ev.target.tagName))) return;
      if (ev.key === "+" || ev.key === "=") { ev.preventDefault(); count(1); }
      if (ev.key === "-") { ev.preventDefault(); count(-1); }
    });
    /* касание середины пустого стола — инструменты; раньше приглашения к заметке */
    doc.addEventListener("click", function (ev) {
      if (performance.now() < swallowUntil) { if (deskTarget(ev.target)) { ev.stopPropagation(); ev.preventDefault(); } swallowUntil = 0; return; }
      if (open || ev.button !== 0 || !deskTarget(ev.target)) return;
      if (visibleWindows() || deskBusy() || !inCenter(ev.clientX, ev.clientY)) return;
      ev.stopPropagation(); ev.preventDefault();
      var touch = root.classList.contains("is-touch") || root.getAttribute("data-input") === "touch";
      openTools(touch ? "touch" : "pointer");
    }, true);
    /* касание мимо — убрать; само это касание не зовёт приглашение к заметке */
    doc.addEventListener("pointerdown", function (ev) {
      if (!open) return;
      var t = ev.target; if (!t || !t.closest) return;
      if (t.closest(".dt-block, .dt-today, .dt-sound, #toastLayer, [id^='sbVoice']")) return;
      /* на телефоне касание мимо не обрывает ввод: убирает, только когда строка пуста и поле не в фокусе (D-900) */
      if (ev.pointerType === "touch" || root.classList.contains("is-touch")) {
        var a0 = doc.activeElement, typing = a0 && ov.contains(a0) && /INPUT|TEXTAREA/.test(a0.tagName) && a0.type !== "range" && !!String(a0.value || "").trim();
        if ((lineish() && line.value.trim()) || typing) return;
      }
      closeTools();
      if (deskTarget(t)) swallowUntil = performance.now() + 600;
    }, true);
    /* Esc — убрать, раньше общего порядка Esc: окно под инструментами не закрывается */
    doc.addEventListener("keydown", function (ev) {
      if (open && ev.key === "Escape") { ev.preventDefault(); ev.stopImmediatePropagation(); closeTools(); }
    }, true);
    /* НАБОР НА ПУСТОМ СТОЛЕ — СТРОКА МЫСЛИ (основатель 12.11): любой знак, цифра тоже —
       сам расчёт не открывается никогда; «расчёт» с клавишами света — только словом.
       Перехват раньше голых клавиш оболочки («e», «w»): на пустом столе без окон набор —
       это мысль; «?» (список клавиш) остаётся за оболочкой. */
    doc.addEventListener("keydown", function (ev) {
      if (open || ev.defaultPrevented || ev.isComposing || !ev.key || ev.key.length !== 1 || ev.key === "?" || ev.key === " ") return;
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      if ((window.sbAnyPanelOpen && window.sbAnyPanelOpen()) || visibleWindows() || deskBusy()) return;
      /* фокус в поле, окне, заметке, пульте, воротах — знак принадлежит им (D-900) */
      var a = doc.activeElement; if (a && a !== doc.body && a.closest && (a.isContentEditable || a.closest(".window, .sticky-note, #topbar, #dock, #sbControlCenter, .panel-overlay, #sbLogin, #sbVaultGate, #sbCurtain, input, textarea, select, button"))) return;
      if (doc.querySelector("#sbVaultGate:not([hidden]), #sbCurtain")) return;
      ev.preventDefault(); ev.stopImmediatePropagation();
      /* набор начинает новую мысль; прежний недописанный черновик не теряется — он ждёт касания середины */
      var keep = draft; draft = "";
      if (openTools("type")) { line.value = ev.key; heldDraft = keep; update(); }
    }, true);
    doc.addEventListener("input", noteAnswer, true);
    doc.addEventListener("keydown", noteUndo, true);
    /* ВТОРОЙ ВХОД — ИЗ ПУЛЬТА (D-899): «инструменты» в быстром меню открывают середину стола
       с последним инструментом; окна на виду уходят, как от касания пустого стола (v47) */
    doc.addEventListener("click", function (ev) {
      var b = ev.target && ev.target.closest ? ev.target.closest("#sbCcTools") : null; if (!b) return;
      ev.preventDefault();
      if (window.sbCloseControlCenter) window.sbCloseControlCenter();
      if (window.sbMinimizeAll) window.sbMinimizeAll();
      if (open) closeTools();
      openTools("pult");
    });
    if (window.sbNoise && window.sbNoise.on) window.sbNoise.on(function () { noiseView(); });
    if (window.visualViewport) { var vvT = 0; ["resize", "scroll"].forEach(function (k) { window.visualViewport.addEventListener(k, function () { if (!open) return; clearTimeout(vvT); vvT = setTimeout(layout, 30); }); }); }
    /* вкладка скрыта — свет спит: закреплённый не тикает, перерисовка — при возвращении */
    doc.addEventListener("visibilitychange", function () { if (!doc.hidden && !open) showPinned(); });
    hintOnce();
    window.addEventListener("resize", function () { if (open) layout(); if (tool === "breath" && open) sizeBreath(); paintToday(); if (!open && readS().pin) DT.setCy(freeCy()); paintSign(); });
    window.addEventListener("sb:theme", function () { paint(); paintToday(true); });
    window.addEventListener("sb:desktime", function () { setTimeout(function () { paint(); paintToday(true); }, 0); });
    window.addEventListener("sb:today", function () { paintToday(true); });
    if (window.sbNotesStore) window.sbNotesStore.onChange(function () { setTimeout(paintToday, 0); });
    if (window.sbBus && window.sbBus.on) window.sbBus.on("translate:done", relang);
    DT.on(function (ev) {
      if (ev === "start" || ev === "stop" || ev === "gone" || ev === "tool-off" || ev === "tool-yield") setTimeout(function () { paintToday(true); }, 0);
      /* пошло время — закреплённый молчит; время ушло — закреплённый вернулся */
      if (ev === "start" && !open && readS().pin) DT.hide();
      if ((ev === "stop" || ev === "gone") && !open) setTimeout(showPinned, 0);
      if (ev === "variant" || ev === "mood") { paint(); paintToday(true); if (tool === "sun" && open) showSun(); }
    });
    setTimeout(function () { paint(); showPinned(); }, 500);
    /* полночь: вчерашнее главное гаснет само */
    setInterval(function () { paintToday(); }, 60000);
    setTimeout(function () { paintToday(true); }, 400);
  }

  /* ---------- одна фраза после знакомства (D-902) ---------- */
  /* Голос ОДИН раз говорит, где инструменты: после знакомства, не в первую минуту, на столе
     без окон, в форме обращения человека (sbAddr). Сказано — помнится в sysbaby.desktools.v1. */
  function hintOnce() {
    var t0 = Date.now(), iv2 = setInterval(function () {
      var s = readS(); if (s.hinted) { clearInterval(iv2); return; }
      if (Date.now() - t0 < 60000 || open || visibleWindows() || deskBusy() || doc.hidden) return;
      var M = window.sbMeet && window.sbMeet.state ? window.sbMeet.state() : null;
      if (!M || !M.met || M.pending) return;
      var V = window.sbVoice && window.sbVoice.state ? window.sbVoice.state() : null; if (V && V.speaking) return;
      var txt = T("dt.hint.center");
      txt = window.sbAddr && window.sbAddr.fill ? window.sbAddr.fill(txt) : txt.replace(/\{[VR]:(?:[^{}|]*\|)*([^{}|]*)\}/g, "$1");
      s.hinted = 1; writeS(s); say(txt); clearInterval(iv2);
    }, 5000);
  }

  window.sbDeskTools = {
    open: function (how) { return openTools(how || "pointer"); },
    close: function () { closeTools(); },
    isOpen: function () { return open; },
    tool: function (t) { if (t && open) setTool(t); return tool; },
    type: function (s) { if (!open) openTools("key"); line.value = String(s || ""); update(); return kindOf(line.value); },
    enter: function () { enter(); },
    press: function (k) { if (open) press(k); },
    state: function () { return { open: open, by: by, tool: tool, answered: answered, kind: open ? kindOf(line.value) : "", value: line ? line.value : "", keys: !!(keys && !keys.hidden && !keys.classList.contains("dim")), placeholder: line ? line.placeholder : "", shown: DT ? DT.tool() : null, center: L.gy }; },
    findCity: findCity, daysTo: daysTo, plural: plural,
    pinned: function () { return readS().pin || null; }, last: function () { return readS().last || null; }, freeCy: function () { return DT ? freeCy() : 0; }, iconsBottom: iconsBottom,
    /* длительность дыхания — для закона: вдох, пауза, выдох, круги */
    breath: { inMs: B_IN, holdMs: B_HOLD, outMs: B_OUT, rounds: B_N, total: (B_IN + B_HOLD + B_OUT) * B_N, on: function () { return tool === "breath" && (!!braf || !!bTmo); } }
  };

  var tries = 0, iv = setInterval(function () {
    if (++tries > 600) { clearInterval(iv); return; }
    if (!window.sbDeskTime || !window.sbCalc || !doc.body || !doc.querySelector(".wp-layer") || !doc.getElementById("sbDeskTime")) return;
    clearInterval(iv);
    DT = window.sbDeskTime;
    build();
  }, 100);
})();
