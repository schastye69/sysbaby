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
    /* H4e (D-1300): по умолчанию на столе — «время» (часы и солнце без касаний); снятая булавка пишется null */
    /* ЗАКРЕПЛЁННОЕ — ПО СТОЛАМ (основатель 25.11.2026): «закрепить» — единственный путь инструмента на стол; само ничего не
       перепрыгивает. pins = { id стола: инструмент }; по умолчанию не закреплено ничего (часы живут на столе инструментов).
       Прежняя одна булавка (pin, по умолчанию «время» на первом столе) больше не читается. */
    if (!o.pins || typeof o.pins !== "object") o.pins = {};
    return o;
  }
  function writeS(o) { try { if (window.sbDB && !(window.sbDB.closed && window.sbDB.closed())) window.sbDB.set(KEY, JSON.stringify(o)); } catch (e) { /* закрыто — останется в памяти до двери */ } }

  /* ---------- DOM ---------- */
  var DT = null, ov = null, blk = null, line = null, keys = null, tray = null, pane = null, sr = null, mic = null, hit = null, todayBtn = null;
  var covered = false, menuFrom = "", open = false, picked = false, by = "", tool = "line", deskOn = false, pinHit = null, runBadge = null, pinRect = null, timeTick2 = 0, draft = "", justEq = false, swallowUntil = 0, cityTick = 0, pinTick = 0, foot = null, sign = null;
  var KEYS = ["C", "(", ")", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", "dec", "back", "="];
  /* МЫСЛЬ ПЕРВОЙ (основатель 12.11): касание середины даёт только строку мысли; клавиши
     света — только у «расчёта». line — мысль, calc — расчёт (та же строка, плюс клавиши). */
  /* D-1287: два ряда по смыслу — сверху покой и мир, снизу числа и время */
  /* H4e (D-1300): двенадцать — «время» первым; ряды 6 + 6: время, мысль, шум, дыхание, солнце, город / расчёт, счётчик, ожидание, таймер, секундомер, будильник */
  var TOOLS = ["time", "line", "noise", "breath", "sun", "city", "calc", "count", "wait", "timer", "stopwatch", "alarm"];
  /* D-1262: таймер · секундомер · будильник — обычные режимы ряда; дело и состояние — те же, что в панели часов (sbClock.ctl) */
  var TIMEISH = { timer: "clock.tab.timer", stopwatch: "clock.tab.sw", alarm: "clock.tab.alarm" };
  /* ОТКАТ: у таймера, секундомера и будильника слово — из таблицы часов; у остальных режимов — своё «dt.tool.<имя>». Это выбор таблицы, а не подмена: слово есть в обеих. */
  function toolWord(t) { return T(TIMEISH[t] || "dt.tool." + t); }
  var ICO = {
    /* D-1286: у каждого режима свой знак из семейства значков — заливка цветом слова, без свечения */
    time: '<path fill-rule="evenodd" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm-.9 4.5v6.1l4.3 2.6.95-1.55-3.45-2.05V6.5z"/>',
    line: '<path d="M13 3.5c2.3 0 4.2 1.5 4.8 3.6A4 4 0 0 1 17 15H8a4.5 4.5 0 0 1-1-8.9A5 5 0 0 1 13 3.5z"/><circle cx="7.5" cy="18" r="1.8"/><circle cx="4.6" cy="20.8" r="1.1"/>',
    noise: '<rect x="2.5" y="10" width="2.6" height="4" rx="1.3"/><rect x="6.6" y="6.5" width="2.6" height="11" rx="1.3"/><rect x="10.7" y="3" width="2.6" height="18" rx="1.3"/><rect x="14.8" y="7.5" width="2.6" height="9" rx="1.3"/><rect x="18.9" y="9.5" width="2.6" height="5" rx="1.3"/>',
    breath: '<circle cx="12" cy="12" r="5.2"/><path fill-rule="evenodd" d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20zm0 1.8a8.2 8.2 0 1 0 0 16.4 8.2 8.2 0 0 0 0-16.4z" opacity=".55"/>',
    wait: '<path fill-rule="evenodd" d="M8 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h1.5A2.5 2.5 0 0 1 21 6.5v12a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 18.5v-12A2.5 2.5 0 0 1 5.5 4H7V3a1 1 0 0 1 1-1zM5 10v8.5c0 .3.2.5.5.5h13c.3 0 .5-.2.5-.5V10zm9 3h3v3h-3z"/>',
    sun: '<circle cx="12" cy="12" r="4.6"/><g><rect x="11" y="1.5" width="2" height="3.4" rx="1"/><rect x="11" y="19.1" width="2" height="3.4" rx="1"/><rect x="1.5" y="11" width="3.4" height="2" rx="1"/><rect x="19.1" y="11" width="3.4" height="2" rx="1"/><rect x="11" y="1.5" width="2" height="3.4" rx="1" transform="rotate(45 12 12)"/><rect x="11" y="19.1" width="2" height="3.4" rx="1" transform="rotate(45 12 12)"/><rect x="1.5" y="11" width="3.4" height="2" rx="1" transform="rotate(45 12 12)"/><rect x="19.1" y="11" width="3.4" height="2" rx="1" transform="rotate(45 12 12)"/></g>',
    city: '<path d="M3 21V10l5-3v3l4-2.5V4h7a1 1 0 0 1 1 1v16zm12-14v2h2V7zm0 4v2h2v-2zm0 4v2h2v-2zM6 13v2h2v-2zm0 4v2h2v-2zm4-4v2h2v-2zm0 4v2h2v-2z" fill-rule="evenodd"/>',
    calc: '<path fill-rule="evenodd" d="M6.5 2h11A2.5 2.5 0 0 1 20 4.5v15a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2zM7 5v4h10V5zm0 7v2h2v-2zm4 0v2h2v-2zm4 0v2h2v-2zm-8 4v2h2v-2zm4 0v2h2v-2zm4 0v2h2v-2z"/>',
    count: '<path fill-rule="evenodd" d="M6 3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3zm5 4.5v3.5H7.5v2H11v3.5h2V13h3.5v-2H13V7.5z"/>',
    timer: '<path d="M6 2h12v2h-1v2.6c0 1.9-1.1 3.2-2.6 4.6L13 12l1.4.8c1.5 1.4 2.6 2.7 2.6 4.6V20h1v2H6v-2h1v-2.6c0-1.9 1.1-3.2 2.6-4.6L11 12l-1.4-.8C8.1 9.8 7 8.5 7 6.6V4H6z"/>',
    stopwatch: '<path fill-rule="evenodd" d="M10 2h4v2h-1v1.1A8 8 0 1 1 11 5.1V4h-1zM12 8a.9.9 0 0 0-.9.9V13c0 .3.2.6.45.78l2.6 1.5.9-1.56-2.15-1.24V8.9A.9.9 0 0 0 12 8zM18.2 5.4l1.4 1.4-1.2 1.2-1.4-1.4z"/>',
    alarm: '<path d="M12 2a1 1 0 0 1 1 1v1.1a6 6 0 0 1 5 5.9v4.2l1.8 2.4a.8.8 0 0 1-.6 1.3H4.8a.8.8 0 0 1-.6-1.3L6 14.2V10a6 6 0 0 1 5-5.9V3a1 1 0 0 1 1-1zm-2.2 17h4.4a2.2 2.2 0 0 1-4.4 0z"/>'
  };
  function icoOf(t) { return ICO[t] ? '<svg class="dt-ico" viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true" focusable="false">' + ICO[t] + "</svg>" : ""; }
  function lineish(t) { return (t || tool) === "line" || (t || tool) === "calc"; }
  /* закрепить можно то, что показывает число на столе (D-890); у шума свой знак, у дыхания — свой срок */
  var PINNABLE = { time: 1, count: 1, wait: 1, city: 1, sun: 1, timer: 1, stopwatch: 1, alarm: 1 };
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
        /* D-1287: после «города» — перенос строки: два ровных ряда по центру, 6 + 5 */
        return '<button type="button" class="dt-word" data-tool="' + t + '" aria-pressed="false">' + icoOf(t) + esc(toolWord(t)) + "</button>" + (t === "city" ? '<span class="dt-br" aria-hidden="true"></span>' : "");
      }).join("") + "</div>" +
      /* тихие слова внизу: закрепить · закрыть (D-890; «линии · пыль» убраны, D-1240) */
      '<div class="dt-hist" role="list" aria-label="' + esc(T("dt.hist.aria")) + '" hidden></div>' +
      '<div class="dt-foot"><button type="button" class="dt-quiet dt-pin" aria-pressed="false" hidden>' + esc(T("dt.pin")) + "</button>" +
      '<button type="button" class="dt-quiet dt-histbtn" aria-expanded="false" hidden>' + esc(T("dt.hist")) + "</button></div>" +
      "</div>" +
      '<button type="button" class="dt-sound" hidden><span class="dt-sound-dot" aria-hidden="true"></span></button>' +
      '<button type="button" class="dt-today" hidden></button>' +
      /* H4e (D-1300): касание закреплённого (часов) открывает его; пустой стол — для заметок */
      '<button type="button" class="dt-pinhit" hidden></button>' +
      /* D-1359: ручки «инструменты» на столе больше нет — ряд живёт на своём, последнем столе (core/desks.js) */
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
    pinHit = ov.querySelector(".dt-pinhit");
  }
  function relang() {
    if (!ov) return;
    var v = line ? line.value : "", wasOpen = open, t = tool;
    ov.setAttribute("aria-label", T("dt.aria"));
    ov.innerHTML = markup(); grab(); wireInner();
    if (armed) { armed = false; if (!wasOpen) arm(); }
    if (wasOpen) { blk.hidden = false; line.value = v; if (deskOn) { ov.classList.add("on"); placeTray(true); } if (picked) setTool(t, true); else setMenu(); layout(); }
    paintToday(true); paintTray(); showPinned();
  }
  function announce(s) { if (sr && sr.textContent !== s) sr.textContent = s; }

  /* ---------- место: блок в середине, над голосом, под значками ---------- */
  /* класс корня — только когда он меняется: и «снять отсутствующий» переписывает атрибут <html>, а это пересчёт стилей всего
     документа и наблюдатели корня (замер ×4 при смене стола, D-1360) */
  function rootCls(c, on) { if (root.classList.contains(c) !== !!on) root.classList.toggle(c, !!on); }
  function safeTop() {
    var tb = doc.getElementById("topbar"), r = tb ? tb.getBoundingClientRect() : null, y = (r && r.height ? r.bottom : 44) + 12;
    /* D-1359: на столе инструментов значков первого стола нет — место от шапки */
    if (deskOn) return Math.round(y);
    if (!root.classList.contains("is-compact") && Number(window.sbIconZoneBottom) > 0) y = Math.max(y, window.sbIconZoneBottom + 12);
    return Math.max(Math.round(y), iconsBottom() + 12);
  }
  /* ЗНАЧКИ НЕ ПОД СВЕТОМ (D-895): на телефоне сетка значков занимает верх
     стола, и ответ счёта ложился на неё. Низ последнего видимого значка —
     граница: свет инструмента встаёт в свободную середину под ней. */
  var ibLast = 0;
  function iconsBottom() {
    /* D-1358: во время перелёта между столами значки растянуты переходом — граница берётся по столу в покое */
    if (window.sbDesks && window.sbDesks.busy() && ibLast) return ibLast;
    var b = 0;
    [].forEach.call(doc.querySelectorAll("#sbIconLayer .desk-icon"), function (el) {
      var r = el.getBoundingClientRect(); if (r.width && r.height && r.top < window.innerHeight * 0.7) b = Math.max(b, r.bottom);
    });
    return (ibLast = Math.round(b));
  }
  /* середина для закреплённого: центр стола, но не выше свободного места под значками */
  function freeCy() {
    var H = window.innerHeight, Hd = DT.Hd(), low = H - 96 - Hd * 1.6;   /* снизу — голос, док и «+»: подписи не ложатся на них */
    ["#dock", "#sbFab"].forEach(function (q) { var e = doc.querySelector(q); if (!e) return; var r = e.getBoundingClientRect(); if (r.width && r.height && r.top > H * 0.5) low = Math.min(low, r.top - Hd * 1.6); });
    return Math.round(Math.min(Math.max(H * 0.5, iconsBottom() + 12 + Hd * 0.6), Math.max(low, H * 0.3)));
  }
  /* воздух над цифрами на столе инструментов — от высоты экрана, один для всех инструментов (телефон 664 — 8 px, планшет
     1080 — 110 px, не больше 160) */
  function figPad() { return Math.round(Math.max(8, Math.min(160, (window.innerHeight - 640) * 0.25))); }
  var L = { gy: 0 };
  function layout() {
    if (!ov || !DT) return;
    var W = window.innerWidth, H = window.innerHeight, Hd = DT.Hd();
    /* H4e6 (основатель 27.11.2026: «У калькулятора слишком маленькие кнопочки… Калькулятор делать просто крупным и по центру…
       в полный размер… Но растягивать точно не надо»): клавиша — как у настоящего калькулятора, до 88 px (было до 72 и
       W/7.4, H/12.5 — на планшете 56…58); пропорции сетки 4 × 5 и просветы прежние, ширина — по клавишам, не по столу.
       Не помещается между цифрами и рядом — мельчает, как прежде (цикл ниже). */
    var k = Math.round(Math.max(44, Math.min(88, W / 6.2, H / 9.2)));   /* W/6.2: на телефоне клавиши не заходят под шкалу столов справа */
    var showKeys = tool === "calc" && !keys.hidden;
    /* под цифрами света: одна подпись у строки счёта, две — у счётчика, ожидания и города */
    var lineH = Math.max(44, Math.round(Hd * 0.5)), capH = lineish() ? 56 : 84;
    /* СТОЛ ИНСТРУМЕНТОВ — ОДНА СЕТКА (D-1422, основатель 25.11.2026: «всё в одинаковом масштабе, аккуратно и симметрично»):
       у всех двенадцати главная цифра или фигура одного размера (Hd) и на одной высоте (figTop от шапки, не от инструмента);
       строка мысли и счёта встаёт НА место цифр (своей строки под ними нет), подписи — одной высоты места (capH), ряд стоит
       на месте; всё — по середине. Переключение инструментов не сдвигает ни ряд, ни ось. */
    var grid = deskOn && tray && !tray.hidden && !root.classList.contains("is-short");
    if (grid) { capH = lineish() ? 56 : 96; lineH = 0; }
    var keysH = showKeys ? 5 * k + 4 * 8 : 0, paneH = !lineish() ? pane.offsetHeight || 60 : 0;
    /* H4e6: пустые «тихие слова» (на столе инструментов их нет) места не берут — клавиши расчёта получают эти 34 px */
    var footH = foot && !foot.hidden && foot.offsetHeight ? 34 : 0, room = H - 76 - safeTop();   /* 76 — низ у голоса */
    if (deskOn && tray && !tray.hidden) { paintTray(); var tr0 = tray.getBoundingClientRect(); if (tr0.height) room = Math.min(room, Math.round(tr0.top - 12) - safeTop()); }
    if (grid) room -= figPad();
    var B = Hd + capH + (lineish() && lineH ? lineH + 14 : 0) + keysH + paneH + (grid ? 14 : 18 + 40) + footH;
    /* не помещается под значками — клавиши мельчают (не мельче 36 px), а не залезают на значки */
    while (showKeys && B > room && k > 36) { k -= 2; keysH = 5 * k + 4 * 8; B = Hd + capH + (lineH ? lineH + 14 : 0) + keysH + (grid ? 14 : 18 + 40) + footH; }
    var top = Math.max(safeTop(), Math.round(H * 0.47 - B / 2));
    /* Низ инструмента — над голосом И над «+» и полкой (глубокий аудит Б-18, D-876): на 390 слова «шум»,
       «закрыть» садились под круг «+», «линии · пыль» уходили за нижний край. Не помещается — блок
       поднимается к шапке, а остаток прокручивается внутри, а не прячется. */
    var lowEdge = H - 76;
    ["#sbFab", "#dock"].forEach(function (q) { var e = doc.querySelector(q); if (!e) return; var r = e.getBoundingClientRect(); if (r.width && r.height && r.top > H * 0.5) lowEdge = Math.min(lowEdge, r.top - 12); });
    var lowEdge0 = lowEdge;   /* на боку ряд стоит в левой колонке — правой (клавиши, панель) он не мешает */
    /* D-1359: на столе инструментов низ блока — над раскрытым рядом */
    if (deskOn && tray && !tray.hidden) { paintTray(); var trc = tray.getBoundingClientRect(); if (trc.height) lowEdge = Math.min(lowEdge, Math.round(trc.top - 12)); }
    if (top + B > lowEdge) top = Math.max(safeTop(), lowEdge - B);
    /* D-1341: закреплённый на столе инструмент (часы) открыт касанием — свет остаётся там, где стоял на столе:
       блок встаёт от него, а не от середины; не помещается над голосом — лишнее прокручивается внутри (--dt-maxh) */
    /* D-1350: то же, когда инструменты открыты ручкой «инструменты» (ряд, ничего не выбрано): свет — закреплённые часы */
    if (open && pinnedLit()) {
      var anc = freeCy() - Math.round(Hd / 2);
      if (anc >= safeTop() && anc + Hd + capH + footH <= lowEdge) top = anc;
    }
    /* одна сетка: верх цифр — от шапки, один для всех инструментов и для покоя ряда (часы) */
    if (grid) top = safeTop() + figPad();
    ov.classList.toggle("dt-grid", grid);
    ov.style.setProperty("--dt-maxh", Math.max(160, lowEdge - top) + "px");
    /* ЭКРАННАЯ КЛАВИАТУРА (D-900): видимая часть экрана — visualViewport; поднялась
       клавиатура — клавиши света уходят (печатает она), а строка встаёт над ней,
       и вертикально, и горизонтально — ничего не прячется под клавиатурой */
    var vv = window.visualViewport, vb = vv ? vv.offsetTop + vv.height : H, kb = H - vb > 80;
    ov.classList.toggle("kb", kb);
    rootCls("sb-kb", kb);   /* клавиатура поднята — «+» уходит, пока печатают (глубокий аудит Б-58, D-876) */
    if (kb) {
      var tb = doc.getElementById("topbar"), tr = tb ? tb.getBoundingClientRect().bottom : 0;
      var need = Hd + capH + (lineish() ? Math.max(44, Math.round(Hd * 0.5)) : paneH) + 12;   /* в сетке своей строки нет (lineH 0), над клавиатурой — есть */
      top = Math.max(Math.round((vv ? vv.offsetTop : 0) + tr + 6), Math.round(vb - need));
    }
    L.gy = top + Math.round(Hd / 2); L.gx = Math.round(W / 2);
    /* ── ТЕЛЕФОН НА БОКУ (844×390, html.is-short; POLISH-C D-1023-TOOLS-LANDSCAPE, глубокий аудит Б-4/Б-57) ──
       Под рядом значков оставалось 160 px из 390: свет, слова и «закрыть» уходили в прокрутку, видна была
       одна строка. Как окно на телефоне — лист поверх значков, так и инструмент на боку: значки отходят
       (html.sb-tools-wide), а инструмент встаёт в две колонки — слева свет (и строка мысли/счёта),
       справа клавиши, выбор, лоток и тихие слова. Низ — над голосом и «+», лишнее прокручивается справа. */
    var land = root.classList.contains("is-short") && !kb && open;
    rootCls("sb-tools-wide", land);
    ov.classList.toggle("land", land);
    if (land) {
      var tb2 = doc.getElementById("topbar"), t0 = Math.round((tb2 ? tb2.getBoundingClientRect().bottom : 44) + 10);
      var avail = Math.max(120, lowEdge - t0), lightH = Hd + capH + (lineish() ? lineH + 14 : 0);
      /* стол инструментов на боку: слева — свет над рядом (ряд — низ левой колонки), справа — клавиши и панель до «+» */
      var availR = deskOn ? Math.max(120, lowEdge0 - t0) : avail;
      top = t0;
      L.gx = Math.round(W / 4 + 4);
      L.gy = t0 + Math.max(0, Math.round((avail - lightH) / 2)) + Math.round(Hd / 2);
      while (showKeys && 5 * k + 4 * 8 > availR && k > 36) k -= 2;
      ov.style.setProperty("--dt-maxh", availR + "px");
      ov.style.setProperty("--dt-ltop", (L.gy - Math.round(Hd / 2) + Hd + capH) + "px");
      ov.style.setProperty("--dt-htop", (L.gy - Math.round(Hd / 2)) + "px");
    }
    DT.setCx(land ? L.gx : null);
    ov.style.setProperty("--dt-k", k + "px");
    ov.style.setProperty("--dt-hd", Hd + "px");
    ov.style.setProperty("--dt-top", top + "px");
    ov.style.setProperty("--dt-line-h", Math.max(44, Math.round(Hd * 0.5)) + "px");
    ov.style.setProperty("--dt-cap", capH + "px");
    DT.setCy(L.gy);
  }
  function paint() {
    if (!ov || !DT) return;
    var P = DT.pal();
    ov.style.setProperty("--dt-c", P.c.join(","));
    ov.style.setProperty("--dt-g", P.g.join(","));
    ov.setAttribute("data-view", "line");
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
  function openTools(how, want) {
    if (!ov || !DT) return false;
    flushSoft();
    if (open) return true;
    /* ряд уже нарисован и стоит на месте — открыть стол инструментов: показать ряд, без перестройки и раскладки */
    if (armed && how === "desk" && !want) {
      open = true; by = "desk"; deskOn = true; picked = false; justEq = false;
      /* в кадре смены — только ряд (пометка); блок света (кнопка «закрыть») встаёт сразу после перехода: показ блока —
         пересчёт и раскладка его поддерева, ровно в кадре смены на слабом устройстве (замер ×4) */
      menuBlock(); ov.classList.add("on"); ov.setAttribute("data-tool", "menu");
      line.value = draft; draft = "";   /* недописанная мысль ждёт в строке, как и на обычном пути */
      dimTray(false, true);
      /* D-1421/D-1422: покой стола инструментов — закреплённые часы на месте сетки, сразу (как в setMenu) */
      deskOn = true; layout();
      DT.mute(false);
      if (!DT.info().mode) pinnedShow(REST); else DT.hide();
      minuteTick(function () { return open && !picked && !DT.info().mode; });
      if (blk.hidden) blk.hidden = false;   /* блок пуст (menuBlock) — показ дешёвый, в ответе на касание, а не посреди перелёта */
      try { window.dispatchEvent(new CustomEvent("sb:desktools", { detail: { open: true, by: by } })); } catch (e) { /* старый браузер */ }
      return true;
    }
    open = true; by = how || "touch"; justEq = false;
    DT.mute(false);   /* инструменты открыты здесь — их свет и идущее время видны (убраны — решает showPinned) */
    paint(); hideToday();
    blk.hidden = false; ov.classList.add("on");
    line.value = draft; draft = "";
    /* ВХОДЫ (D-891, D-907; H4e D-1300…D-1302):
       · касание закреплённого (часов) — сам этот инструмент («pin»);
       · стол инструментов (D-1359, core/desks.js) — весь ряд в полный размер, ничего не выбрано или
         сразу названный инструмент («desk»); ручки «инструменты» на первом столе больше нет;
       · набор на столе — мысль («type»), «key» — только API законов (расчёт);
       · «инструменты» в быстром меню — последний инструмент («pult»). */
    if (by === "desk") {
      deskOn = true; placeTray(true);
      if (want && TOOLS.indexOf(want) >= 0) { setTool(want, true); keys.hidden = want !== "calc"; layout(); update(); }
      else { setMenu(); layout(); }
    } else {
      var first = by === "pin" ? (want || pinnedNow() || REST) : by === "key" ? "calc" : by === "pult" ? (readS().last || "line") : "line";
      if (TOOLS.indexOf(first) < 0) first = "line";
      setTool(first, true);
      keys.hidden = first !== "calc" || by === "key";
      layout(); update();
      /* фокус в строку: подсказка гаснет сразу; у расчёта касанием — клавиши света вместо системной клавиатуры */
      if (lineish() && !(tool === "calc" && by !== "key" && root.classList.contains("is-touch"))) { try { line.focus({ preventScroll: true }); var L0 = line.value.length; line.setSelectionRange(L0, L0); } catch (e) { line.focus(); } }
    }
    paintTray(); paintPinHit();
    try { window.dispatchEvent(new CustomEvent("sb:desktools", { detail: { open: true, by: by } })); } catch (e) { /* старый браузер */ }
    return true;
  }
  /* МЕНЮ (D-1301): виден весь ряд, ничего не выбрано; в середине — то, что закреплено (часы) */
  function setMenu() {
    picked = false;
    stopBreath(); clearInterval(cityTick); cityTick = 0; clearInterval(timeTick); timeTick = 0;
    if (window.sbThought && window.sbThought.mic && window.sbThought.mic.on()) window.sbThought.mic.stop();
    ov.setAttribute("data-tool", "menu"); ov.removeAttribute("data-kind");
    ov.querySelector(".dt-linebox").hidden = true; keys.hidden = true; pane.hidden = true; pane.innerHTML = ""; hit.hidden = true;
    tray.hidden = false; foot.hidden = true;
    var hl = ov.querySelector(".dt-hist"); if (hl) hl.hidden = true;
    [].forEach.call(tray.querySelectorAll(".dt-word"), function (b) { var on = b.dataset.tool === pinOf("main"); b.setAttribute("aria-pressed", "false"); b.classList.remove("on"); b.classList.toggle("pinned", on); });
    if (doc.activeElement && ov.contains(doc.activeElement) && true) { try { doc.activeElement.blur(); } catch (e) { /* фокус не обязателен */ } }
    /* покой стола инструментов — его часы (REST), сменой минуты вместе с шапкой; идущее время важнее */
    DT.mute(false);
    if (!DT.info().mode) pinnedShow(REST); else DT.hide();
    minuteTick(function () { return open && !picked && !DT.info().mode; });
    announce(T("dt.tray.aria"));
  }
  var REST = "time";   /* покой стола инструментов — крупные часы с подписью солнца (D-1421) */
  function deskIdNow() { return window.sbDesks && window.sbDesks.idOf ? window.sbDesks.idOf(window.sbDesks.at()) : "main"; }
  function pinOf(id) { var p = (readS().pins || {})[id]; return p && PINNABLE[p] ? p : null; }
  /* закреплённое на ЭТОМ столе (на столе инструментов своих булавок нет — там покой ряда) */
  function pinnedNow() { var id = deskIdNow(); return id === "tools" ? null : pinOf(id); }
  function setPin(id, t) { var s = readS(); s.pins = s.pins || {}; if (t && PINNABLE[t]) s.pins[id] = t; else delete s.pins[id]; writeS(s); }
  /* свет середины сейчас — закреплённый (D-1341, D-1350): выбран он сам или открыт ряд инструментов (ничего не выбрано) */
  function pinnedLit() { return deskOn && !DT.info().mode && (!picked || tool === REST); }
  /* D-1358 (скорость): уход со стола инструментов с открытым рядом — «мягко»: инструменты убраны сразу (isOpen — нет),
     а разборка разметки — в простое, когда стол уже ушёл (свет середины тот же — закреплённые часы) */
  var softPending = false;
  function softClose() {
    if (!open || picked) { closeTools(); return; }
    open = false; softPending = true;
    if (armed && tray) dimTray(true, true);   /* ряд гаснет сразу своим слоем; разборка — в простое */
    else if (tray) tray.hidden = true;   /* ряд не нарисован заранее — убрать его сразу, разборка блока — в простое */
    var run = function () { if (!softPending) return; softPending = false; open = true; closeTools(); if (window.sbDesks && window.sbDesks.weak && window.sbDesks.weak() && DT.snap) DT.snap(); };
    /* разборка невидима — не в кадрах смены: простой посреди перехода (между его кадрами) не годится — разборка (×4: ~30 мс
       и тяжёлый кадр следом) рвала кадр смены; поэтому — после перехода (пока фон на паузе, sbFramesHeld) и в простое */
    var held = window.sbFramesHeld ? window.sbFramesHeld() : 0;
    setTimeout(function () { if (window.requestIdleCallback) requestIdleCallback(run, { timeout: 700 }); else setTimeout(run, 60); }, held > 0 ? held + 160 : 0);
  }
  /* и наоборот — «мягкое» открытие стола инструментов на слабом устройстве: открыто сразу (isOpen, tool), разметка ряда
     собирается в простое — сразу после перелёта, не в его кадрах */
  var openPending = false;
  function softOpen(want) {
    flushSoft();
    if (armed && !want && !open) return openTools("desk");
    if (open) { if (want) setTool(want); return true; }
    open = true; deskOn = true; by = "desk"; picked = !!want; if (want && TOOLS.indexOf(want) >= 0) tool = want; openPending = true;
    var run = function () { if (!openPending) return; openPending = false; open = false; deskOn = false; openTools("desk", want); };
    if (window.requestIdleCallback) requestIdleCallback(run, { timeout: 100 }); else setTimeout(run, 60);
    return true;
  }
  function flushSoft() { if (softPending) { softPending = false; open = true; closeTools(); } }
  function closeTools(keepDraft) {
    if (!open) return;
    if (openPending) { openPending = false; open = false; deskOn = false; picked = false; try { window.dispatchEvent(new CustomEvent("sb:desktools", { detail: { open: false } })); } catch (e) { /* старый браузер */ } return; }
    /* свет остаётся, если это закреплённое на первом столе (Esc со стола инструментов ведёт туда) — не гаснет и не вычерчивается заново */
    var pinDest = deskOn ? pinOf("main") : pinnedNow(), keepLit = pinnedLit() || (picked && !!pinDest && tool === pinDest && !DT.info().mode);
    open = false;
    if (keepDraft !== false && (tool === "line" || !lineish(tool)) && !answered && line.value.trim()) draft = line.value;   /* открыт был не расчёт: в строке — недописанная мысль (её не трогали) */
    else if (heldDraft) draft = heldDraft;
    heldDraft = "";
    answered = false;   /* только мысль: расчёт не сохраняется черновиком */
    stopBreath(); clearInterval(cityTick); cityTick = 0; clearInterval(timeTick); timeTick = 0;
    if (window.sbThought && window.sbThought.mic.on()) window.sbThought.mic.stop();
    ov.classList.remove("on"); blk.hidden = true; pane.hidden = true; pane.innerHTML = ""; picked = false; menuFrom = "";
    if (deskOn) { deskOn = false; placeTray(false); }
    if (doc.activeElement && ov.contains(doc.activeElement)) { try { doc.activeElement.blur(); } catch (e) { /* фокус не обязателен */ } }
    /* D-1341: закреплённый остаётся на столе тем же светом — не гасится и не вычерчивается заново (showPinned ниже) */
    if (!keepLit) DT.hide();
    DT.setCx(null); ov.classList.remove("land"); rootCls("sb-tools-wide", false);   /* значки возвращаются (D-1023) */
    if (!(window.sbClock && window.sbClock.isOpen && window.sbClock.isOpen())) DT.setCy(null);
    announce("");
    showPinned();
    paintToday(true);
    rootCls("sb-kb", false);
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
    var was = tool; tool = t; picked = true;
    if (open && blk.hidden) blk.hidden = false;   /* блок света, отложенный при смене стола (openTools) — нужен уже сейчас */
    /* D-1301: на первом столе выбранный инструмент прячет ряд; D-1359: на столе инструментов ряд раскрыт всегда */
    if (armed) { if (deskOn) dimTray(false); else dimTray(true); } else tray.hidden = !deskOn;
    foot.hidden = false;
    if (!quiet) { var s0 = readS(); if (s0.last !== t) { s0.last = t; writeS(s0); } }
    paintFoot();
    if (was === "breath" && t !== "breath") stopBreath();
    clearInterval(cityTick); cityTick = 0;
    clearInterval(timeTick); timeTick = 0;
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
        /* D-1422: на столе инструментов касанием клавиатура не выскакивает сама — поле на виду, касание поля её зовёт
           (иначе пустой экран с курсором и клавиатура поверх поля и ряда) */
        if ((t === "line" && !(deskOn && root.classList.contains("is-touch"))) || !root.classList.contains("is-touch")) { try { line.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
      }
      return;
    }
    DT.hide();
    if (t === "time") paneTime0();
    else if (t === "count") paneCount();
    else if (t === "wait") paneWait();
    else if (t === "city") paneCity();
    else if (t === "breath") paneBreath();
    else if (t === "sun") paneSun();
    else if (t === "noise") paneNoise();
    else if (TIMEISH[t]) paneTime(t);
    layout();
    trayToActive();
    /* клавиатурой и мышью — сразу в поле инструмента (осмотр H4e4, п.14: после «города» фокус оставался на ряду); пальцем —
       нет: системная клавиатура не выскакивает сама */
    if (!quiet && (t === "city" || t === "sun" || t === "wait") && !root.classList.contains("is-touch")) { var f0 = pane.querySelector("input.dt-field"); if (f0) { try { f0.focus({ preventScroll: true }); } catch (e) { /* фокус не обязателен */ } } }
  }
  function btnW(data, word, extra) { return '<button type="button" class="dt-word' + (extra || "") + '" ' + data + ">" + esc(word) + "</button>"; }

  /* ---------- таймер · секундомер · будильник (D-1262) ----------
     Один источник правды — core/clock.js (sbClock.ctl) и свет на столе (sbDeskTime): таймер, начатый здесь, —
     тот же таймер в панели часов, и наоборот; запись будильника системы одна, звенит один раз.
     Идёт своё время — его рисует сам свет на столе (крупно); пока не идёт — здесь показан срок «про запас». */
  var timeTick = 0, timeSig = "";
  var PRE = [45000, 180000, 300000, 600000, 1500000];
  function p2(n) { return (n < 10 ? "0" : "") + n; }
  function mss(ms) { var s = Math.max(0, Math.ceil(ms / 1000)), h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60; return (h ? h + ":" + p2(m) : m) + ":" + p2(s % 60); }
  function swf(ms) { var t = Math.floor(ms / 100), s = Math.floor(t / 10), m = Math.floor(s / 60); return { main: m + ":" + p2(s % 60), sub: "," + (t % 10) }; }
  function CK() { var c = window.sbClock && window.sbClock.ctl; return c && c.ready() ? c : null; }
  function ckBtn(k, v, word, extra) { return btnW('data-ck="' + k + ":" + v + '"', T(word), extra); }
  function preWord(ms) { return ms < 60000 ? T("clock.sec", { n: ms / 1000 }) : T("clock.min", { n: ms / 60000 }); }
  function hmOf(d) { return d.getHours() + ":" + p2(d.getMinutes()); }
  function paneTime(t) {
    timeSig = "";
    var h = "";
    if (t === "timer") h = '<div class="dt-row dt-pre" role="group" aria-label="' + esc(T("clock.tab.timer")) + '">' + PRE.map(function (ms) { return btnW('data-ck="ms:' + ms + '" aria-pressed="false"', preWord(ms)); }).join("") + "</div>";
    if (t === "alarm") h = '<div class="dt-row">' + ckBtn("a", "1", "clock.alarm.in1") + ckBtn("a", "-5", "clock.alarm.minus5") + ckBtn("a", "5", "clock.alarm.plus5") +
      '<input type="time" class="dt-field dt-time" data-ck-at="1" autocomplete="off" aria-label="' + esc(T("clock.tab.alarm")) + '"></div>';
    pane.innerHTML = h + '<div class="dt-row dt-tact"></div><div class="dt-laps" aria-live="polite"></div>';
    viewTime();
    timeTick = setInterval(function () { if (open && TIMEISH[tool]) viewTime(); }, 250);
  }
  function viewTime() {
    if (!open || !DT || !TIMEISH[tool] || !pane) return;
    var c = CK(), i = DT.info(), st = c ? c.state() : { timerSet: 180000, laps: [] }, mine = (tool === "timer" && i.mode === "timer") || (tool === "stopwatch" && i.mode === "stopwatch") || (tool === "alarm" && i.mode === "alarm");
    var a = "", sub = "", str = "", laps = "";
    if (tool === "timer") {
      str = mss(st.timerSet);
      sub = "";
      a = !mine ? ckBtn("t", "go", "clock.go", " lamp") : i.done ? ckBtn("t", "go", "clock.again", " lamp") + ckBtn("t", "stop", "clock.ok") :
        (i.paused ? ckBtn("t", "on", "clock.on", " lamp") : ckBtn("t", "pause", "clock.pause", " lamp")) + ckBtn("t", "stop", "clock.reset");
      [].forEach.call(pane.querySelectorAll("[data-ck^='ms:']"), function (b) { b.setAttribute("aria-pressed", +b.dataset.ck.slice(3) === (mine ? i.total : st.timerSet) ? "true" : "false"); });
    } else if (tool === "stopwatch") {
      str = "0:00"; sub = "";
      a = !mine ? ckBtn("s", "go", "clock.sw.start", " lamp") : i.paused ? ckBtn("s", "on", "clock.on", " lamp") + ckBtn("s", "stop", "clock.reset") :
        ckBtn("s", "pause", "clock.pause", " lamp") + ckBtn("s", "lap", "clock.lap");
      var L = st.laps || [];
      laps = L.slice(-3).map(function (v, j, arr) { var n = L.length - arr.length + j, prev = n ? L[n - 1] : 0, x = swf(v - prev); return T("clock.lapN", { n: n + 1 }) + " · " + x.main + x.sub; }).join("   ");
    } else {
      var at = new Date(c ? c.alarmAt() : Date.now() + 3600000), now = new Date();
      str = hmOf(at);
      var mins = Math.max(0, Math.round((at - now) / 60000)), tomorrow = at.toDateString() !== now.toDateString(), wd = "";
      try { wd = at.toLocaleDateString(lang() === "ru" ? "ru-RU" : lang() === "ee" ? "et-EE" : "en-GB", { weekday: "long" }); } catch (e) { wd = ""; }
      sub = T("clock.alarm.left", { when: tomorrow ? T("clock.alarm.tomorrow", { day: wd }) : T("clock.alarm.today"), left: mins >= 60 ? T("clock.alarm.hm", { h: Math.floor(mins / 60), m: mins % 60 }) : T("clock.alarm.m", { m: mins }) });
      a = !mine ? ckBtn("a2", "go", "clock.alarm.set", " lamp") : i.done ? ckBtn("a2", "stop", "clock.ok", " lamp") : ckBtn("a2", "stop", "clock.alarm.off");
      var ti = pane.querySelector(".dt-time"); if (ti && doc.activeElement !== ti) { var hv = p2(at.getHours()) + ":" + p2(at.getMinutes()); if (ti.value !== hv) ti.value = hv; }
    }
    var tact = pane.querySelector(".dt-tact"), lp = pane.querySelector(".dt-laps");
    if (tact && tact.__h !== a) { tact.innerHTML = a; tact.__h = a; }
    if (lp && lp.textContent !== laps) lp.textContent = laps;
    /* идёт своё время — крупно рисует свет на столе; нет — срок про запас тем же светом */
    if (mine) { DT.hide(); timeSig = ""; return; }
    var sig = tool + "|" + str + "|" + sub;
    if (sig !== timeSig) { timeSig = sig; DT.show({ str: str, label: toolWord(tool), sub: sub }); }
  }
  function timeAct(spec) {
    var c = CK(); if (!c) return;
    var k = spec.indexOf(":"), d = {}; d[spec.slice(0, k)] = spec.slice(k + 1);
    c.act(d); timeSig = ""; viewTime();
  }
  /* ряд мягко прокручивается по ширине (телефон): кромки гаснут, лишнего этажа нет */
  function fitTray() {
    if (!tray) return;
    var sl = tray.scrollLeft, over = tray.scrollWidth - tray.clientWidth > 2;
    tray.style.setProperty("--dt-fl", over && sl > 2 ? "26px" : "0px");
    tray.style.setProperty("--dt-fr", over && sl < tray.scrollWidth - tray.clientWidth - 2 ? "26px" : "0px");
  }
  function trayToActive() {
    if (!tray || tray.scrollWidth - tray.clientWidth <= 2) { fitTray(); return; }
    var ob = tray.querySelector(".dt-word.on"); if (ob) tray.scrollLeft = Math.max(0, ob.offsetLeft - (tray.clientWidth - ob.offsetWidth) / 2);
    fitTray();
  }

  /* ---------- время и солнце на столе (H4e, D-1300) ----------
     Средние часы ЧЧ:ММ светом и одна строка солнца: днём — «☀ закат ЧЧ:ММ · через X ч Y мин», ночью — «☀ восход …».
     Всё считается здесь: город пояса этого устройства (sbSky), без сети. */
  function hm0(ms) { var d = new Date(ms); return d.getHours() + ":" + two(d.getMinutes()); }
  function durWord(ms) { var m = Math.max(0, Math.round(ms / 60000)), h = Math.floor(m / 60); return h ? T("dt.dur.hm", { h: h, m: m % 60 }) : T("dt.dur.m", { m: m }); }
  function sunLine(now) {
    var row = sunCity(); if (!row || !window.sbSky) return "";
    var S0 = window.sbSky.sun(window.sbSky.cityNoon(row[0], now), row[4], row[5]);
    if (S0.polar) return "\u2600 " + T(S0.polar === "day" ? "dt.sun.polarDay" : "dt.sun.polarNight");
    /* восход и закат — часами САМОГО города, как в инструменте «солнце» (hmIn): было часами устройства (hm0), и у устройства
       с поясом UTC (строгая приватность браузера) под часами стояло «восход 6:39», а в «солнце» — «8:37 (Таллин)» */
    if (now < S0.rise) return "\u2600 " + T("dt.time.rise", { t: hmIn(row[0], S0.rise), d: durWord(S0.rise - now) });
    if (now < S0.set) return "\u2600 " + T("dt.time.set", { t: hmIn(row[0], S0.set), d: durWord(S0.set - now) });
    var S1 = window.sbSky.sun(window.sbSky.cityNoon(row[0], now + DAY), row[4], row[5]);
    if (S1.polar || !S1.rise) return "";
    return "\u2600 " + T("dt.time.rise", { t: hmIn(row[0], S1.rise), d: durWord(S1.rise - now) });
  }
  var clockPaint = null;
  function showTime(once) {
    var now = Date.now(), str = hm0(now), sub = sunLine(now);
    clockPaint = { str: str, label: sub };
    DT.show({ str: str, label: sub, sub: "", now: !!once });
    announce(T("dt.time.aria", { t: str }) + (sub ? ". " + sub.replace("\u2600 ", "") : ""));
    syncTopClock();
  }
  function paneTime0() {
    pane.innerHTML = "";
    showTime(true);
    minuteTick(function () { return open && tool === "time"; });
  }
  /* часы светом сменяют минуту в ту же секунду, что и время в шапке (было «раз в 10 с» — на столе 17:29 при шапке 17:30):
     будильник — к началу следующей минуты, дальше — каждую минуту; cityTick держит его, чтобы снять там же, где прежде */
  function minuteTick(still) {
    clearTimeout(cityTick);
    var step = function () { cityTick = setTimeout(function () { if (!still()) { cityTick = 0; return; } showTime(); step(); }, 60000 - Date.now() % 60000 + 30); };
    step();
  }
  /* «не показывать одно и то же дважды» (основатель 15.11): часы на столе — в шапке только дата; убрали — время вернулось */
  function clockOnDesk() {
    /* D-1421 (основатель 25.11.2026): время в верхней панели видно всегда — шапка больше не прячет его, когда на столе часы;
       крупные часы живут на столе инструментов. Ответ остаётся для законов: «часы светом стоят на столе сейчас» */
    var t = DT && DT.tool();
    /* часы на столе видны, только когда стол открыт: окно (на телефоне — лист во весь экран), ворота, панель —
       и время возвращается в шапку (основатель 15.11: «время в панели на телефоне не убирать» — часов телефона не видно) */
    return !!(t && clockPaint && t.str === clockPaint.str && t.label === clockPaint.label && !(DT.info().mode) && !visibleWindows() && !deskBusy());
  }
  function syncTopClock() {
    var on = false;   /* D-1421: шапка не прячет время ни при каких часах на столе (плашка не меняет ширину, соседи не дёргаются) */
    /* пометка — на шапке, а не на <html>: класс корня пересчитывал стили всего документа и будил наблюдателей корня
       (замер ×4 при смене стола, D-1358) */
    var tb = doc.getElementById("topbar"); if (!tb) return;
    if (tb.classList.contains("sb-desk-clock") !== on) { tb.classList.toggle("sb-desk-clock", on); if (window.sbRepaintClock) window.sbRepaintClock(); }
  }

  /* счётчик: касание = +1 */
  /* подсказка — словами устройства (осмотр H4e4, п.15): пальцем — «касание», мышью — «щелчок» */
  function showCount(n, first) { var tch = root.classList.contains("is-touch"); DT.show({ str: String(n).replace("-", "−"), label: T("dt.count.label"), sub: first ? T(tch ? "dt.count.tap" : "dt.count.click") + " \u00b7 " + T(tch ? "dt.count.long" : "dt.count.longClick") : "" }); }
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
    /* H4e (D-1300): город в том же поясе — только имя: то же время уже есть на столе и в шапке */
    if (diff != null && diff === here) { DT.show({ str: "", label: c.name, sub: T("dt.city.same") }); announce(c.name + ", " + T("dt.city.same")); return; }
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
    /* после заката «солнце» показывает ГРЯДУЩИЙ день (как строка под часами — следующий восход): иначе под часами «восход
       8:39» (завтра), а здесь «восход 8:37» (сегодняшний, уже прошедший) — противоречие (косяк 9, 24.11). Слово «завтра» */
    var now0 = Date.now(), D0 = window.sbSky.day(row, now0), next = !D0.today.polar && now0 > D0.today.set;
    var D = next ? window.sbSky.day(row, now0 + DAY) : D0, t = D.today, mo = T("dt.moon." + D.moon.phase), lbl, str, sub;
    if (t.polar) { str = ""; lbl = nameOf(row); sub = T(t.polar === "day" ? "dt.sun.polarDay" : "dt.sun.polarNight") + " \u00b7 " + mo; }
    else {
      var L = Math.round(t.len / 60000); str = Math.floor(L / 60) + ":" + two(L % 60);
      lbl = nameOf(row) + " \u00b7 " + (next ? T("dt.sun.tomorrow") + " \u00b7 " : "") + T("dt.sun.rise", { t: hmIn(row[0], t.rise) }) + " \u00b7 " + T("dt.sun.set", { t: hmIn(row[0], t.set) });
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
    /* светлая тема: сердцевина света — тёмные чернила (INK), и полная луна выходила тёмным диском (осмотр H4e4, п.12);
       освещённая часть луны — всегда свет (ореол темы), тень — чернила тише */
    var lightT = root.getAttribute("data-theme") === "light";
    var r = 15, cx = S / 2, cy = S / 2, core = "rgba(" + (lightT ? P.g : P.c).join(","), glow = "rgba(" + (lightT ? P.c : P.g).join(",");
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
    /* «закрепить на столе» — на первый стол (единственный путь инструмента туда, основатель 25.11.2026) */
    var pb = foot.querySelector(".dt-pin"), pinned = pinOf("main") === tool;
    pb.hidden = !PINNABLE[tool];
    pb.textContent = T(pinned ? "dt.unpin" : "dt.pin");   /* D-1301: одна булавка — «закрепить на столе» / «убрать со стола»; «закрыть» — ручка, Esc, касание мимо */
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
    var on = pinOf("main") !== tool;
    setPin("main", on ? tool : null);
    say(T(on ? "dt.pin.on" : "dt.pin.off"));
    paintFoot(); syncTopClock();
  }
  function pinnedShow(p) {
    if (p === "time") showTime(true);
    else if (p === "count") showCount(readS().count, false);
    else if (p === "wait") showWait();
    else if (p === "city") showCity();
    else if (p === "sun") showSun();
    else if (TIMEISH[p]) pinnedTime(p);
  }
  function pinnedTime(p) {
    var c = CK(), st = c ? c.state() : { timerSet: 180000 }, str = p === "timer" ? mss(st.timerSet) : p === "stopwatch" ? "0:00" : hmOf(new Date(c ? c.alarmAt() : Date.now()));
    DT.show({ str: str, label: toolWord(p), sub: "" });
  }
  /* закреплённый — на столе, пока инструменты убраны; идущее время важнее: под таймером слой молчит */
  function showPinned() {
    clearInterval(pinTick); pinTick = 0;
    if (open || !DT) { paintPinHit(); syncTopClock(); return; }
    /* стол инструментов (инструменты убраны) — свет середины его покоя, идущее время на нём видно */
    if (onToolsDesk()) { DT.mute(false); pinRect = null; paintPinHit(); syncTopClock(); return; }
    var p = pinnedNow(), run = DT.info().mode;
    /* НИЧЕГО НЕ ПЕРЕПРЫГИВАЕТ (основатель 25.11.2026): на этом столе видно только закреплённое на нём. Идущий таймер,
       секундомер, будильник без булавки здесь не рисуются (идут дальше; срок — звуком и уведомлением, core/alarm.js);
       закреплён сам этот режим — виден он, идущий */
    DT.mute(!(p && run && p === run));
    /* под окном закреплённого не видно — и свет его не рисуется: сквозь стекло окна (.98) яркие линии часов
       читались бы пятном в теле окна (window-one-glass п.4); окна ушли — часы вернулись */
    covered = coveredNow();
    if (covered && p) { if (DT.tool()) DT.hide(); pinRect = null; paintPinHit(); syncTopClock(); setTimeout(function () { paintToday(true); }, 0); return; }
    if (!p) { if (DT.tool()) DT.hide(); pinRect = null; paintPinHit(); syncTopClock(); return; }
    DT.setCy(freeCy());
    if (run && p === run) DT.hide(); else pinnedShow(p);
    setTimeout(function () { paintToday(true); }, 0);   /* главное сегодня встаёт над вернувшимся закреплённым */
    if (p === "city" || p === "sun" || p === "wait") pinTick = setInterval(function () { if (!open && !doc.hidden && !coveredNow()) { pinnedShow(p); paintPinHit(); } }, p === "city" ? 15000 : 60000);
    if (p === "time") minuteTick(function () { return !open && pinnedNow() === "time" && !coveredNow() && !doc.hidden; });
    paintPinHit(); syncTopClock();
  }

  /* стол закрыт для закреплённого: окно на виду или заметка легла на его место — заметка важнее (пустой стол — для
     заметок), а свет под стеклом заметки мешал бы читать её слова (note-contrast) */
  function coveredNow() {
    if (visibleWindows() > 0) return true;
    if (!DT) return false;
    /* заметка закрывает часы, когда легла на их середину (сами цифры), а не просто задела край их места:
       середина стола под касанием «мысли/часов» система держит свободной (D-916), её заметки сюда не ложатся */
    var W0 = window.innerWidth, Hd0 = DT.Hd(), cy0 = freeCy(), a = { x: Math.round(W0 / 2 - Hd0 * 0.8), y: Math.round(cy0 - Hd0 * 0.4), w: Math.round(Hd0 * 1.6), h: Math.round(Hd0 * 0.8) }, hit = false;
    [].forEach.call(doc.querySelectorAll("#sbNoteLayer .sticky-note"), function (n) {
      var r = n.getBoundingClientRect(); if (!r.width || !r.height) return;
      if (r.left < a.x + a.w && r.right > a.x && r.top < a.y + a.h && r.bottom > a.y) hit = true;
    });
    return hit;
  }
  /* касание закреплённого: место его света (середина над свободным местом стола) */
  function paintPinHit() {
    if (!pinHit) return;
    /* идущий таймер, секундомер или будильник на столе — тоже «закреплённое»: касание открывает его режим */
    /* касание закреплённого — его инструмент; идущее время — только если закреплён сам этот режим (иначе на столе его нет) */
    var p0 = pinnedNow(), run = DT && DT.info().mode && DT.info().mode === p0 ? p0 : null, p = run || p0, t = run ? { str: "0:00", label: "", sub: "" } : DT && DT.tool();
    if (open || !p || !t || deskBusy() || visibleWindows() || awayDesk()) { pinHit.hidden = true; pinRect = null; return; }
    var W = window.innerWidth, Hd = DT.Hd(), cy = freeCy(), w = Math.min(W - 32, Math.max(Hd * 3.4, 220)), top = Math.round(cy - Hd * 0.75), h = Math.round(Hd * 1.5 + (t.label ? 40 : 0) + (t.sub ? 24 : 0));
    pinRect = { x: Math.round(W / 2 - w / 2), y: top, w: Math.round(w), h: h };
    pinHit.hidden = false;
    pinHit.dataset.tool = p;
    pinHit.setAttribute("aria-label", T("dt.pinhit.aria", { t: toolWord(p) }) + (run ? "" : (t.str ? " " + t.str : "") + (t.label ? ". " + t.label.replace("\u2600 ", "") : "")));
    pinHit.style.left = pinRect.x + "px"; pinHit.style.top = pinRect.y + "px"; pinHit.style.width = pinRect.w + "px"; pinHit.style.height = pinRect.h + "px";
  }
  /* D-1359: СТОЛ ИНСТРУМЕНТОВ. Ряд выходит из блока света и встаёт у нижнего края своего стола — раскрыт весь,
     в полный размер; свет инструмента и его строка — над ним. Ушли со стола — ряд возвращается в блок. */
  /* СЛАБОЕ УСТРОЙСТВО — РЯД ДЕРЖИТСЯ НАРИСОВАННЫМ (координатор по решению основателя 23.11.2026, D-1360): ряд стола
     инструментов один раз встаёт на своё место (в простое) и остаётся там своим композиторным слоем (will-change: opacity,
     contain: strict); переход к столу инструментов и обратно — только прозрачность и касания ряда (data-sbd-dim), без
     display/visibility и без перестройки. */
  var armed = false;
  /* спрятан — сжат в ноль по высоте (scale), прозрачен, без касаний и вне фокуса (inert); раскладка не меняется */
  /* soft — смена стола на слабом устройстве: в кадре смены меняется только пометка (прозрачность и сжатие — на композиторе);
     inert пересчитывает стили всего ряда (≈50 элементов, ×4: 5–10 мс), поэтому он ставится/снимается сразу после
     перехода (.2 с). Пока ряд гаснет, его касания не принимаются (обработчик ряда смотрит на пометку). */
  var inertT = 0;
  function dimTray(on, soft) {
    if (!tray) return;
    clearTimeout(inertT);
    if (on) tray.setAttribute("data-sbd-dim", ""); else tray.removeAttribute("data-sbd-dim");
    if (!soft) { tray.inert = !!on; return; }
    inertT = setTimeout(function () { var d = tray.hasAttribute("data-sbd-dim"); if (tray.inert !== d) tray.inert = d; }, 240);
  }
  function arm() {
    /* только в покое: инструменты открыты — подождать (ряд не переставляется под рукой) */
    if (armed || !tray || !ov || open || softPending || openPending) return false;
    armed = true;
    {
      ov.classList.add("dt-desk"); if (tray.parentNode !== ov) ov.insertBefore(tray, ov.querySelector(".dt-sound"));
      [].forEach.call(tray.querySelectorAll(".dt-word"), function (b) { b.setAttribute("aria-pressed", "false"); b.classList.remove("on"); b.classList.toggle("pinned", b.dataset.tool === pinOf("main")); });
      dimTray(true); tray.hidden = false;
      menuBlock();
    }
    paint(); paintTray();
    tray.setAttribute("data-sbd-arm", "");
    warmRest();
    return true;
  }
  /* блок света в состоянии ряда: строки, клавиш, панели, подножия нет — свет середины один (закреплённое) */
  /* часы покоя стола инструментов — знаки и подпись солнца в кэше света заранее (в простое, раз в минуту) */
  var warmT = 0;
  function warmRest() {
    clearTimeout(warmT);
    var go = function () { if (!open && DT && DT.warm) { var now = Date.now(); DT.warm(hm0(now) + "0123456789:", sunLine(now)); DT.warm(hm0(now + 60000), sunLine(now + 60000)); } };
    if (window.requestIdleCallback) requestIdleCallback(go, { timeout: 2000 }); else setTimeout(go, 60);
    warmT = setTimeout(warmRest, 60000 - Date.now() % 60000 + 500);
  }
  function menuBlock() {
    var lb = ov.querySelector(".dt-linebox"); if (lb && !lb.hidden) lb.hidden = true;
    [keys, pane, foot, hit].forEach(function (e) { if (e && !e.hidden) e.hidden = true; });
    var hl = ov.querySelector(".dt-hist"); if (hl && !hl.hidden) hl.hidden = true;
  }
  function placeTray(on) {
    if (!tray) return;
    if (armed) { ov.classList.add("dt-desk"); if (tray.parentNode !== ov) ov.insertBefore(tray, ov.querySelector(".dt-sound")); tray.hidden = false; if (on) dimTray(false); else dimTray(true); paintTray(); return; }
    ov.classList.toggle("dt-desk", !!on);
    if (on) { if (tray.parentNode !== ov) ov.insertBefore(tray, ov.querySelector(".dt-sound")); tray.hidden = false; }
    else if (tray.parentNode === ov) { blk.insertBefore(tray, ov.querySelector(".dt-hist")); }
    paintTray();
  }
  function trayBottom() {
    var H = window.innerHeight, low = H - 24;
    ["#sbFab", "#dock"].forEach(function (q) { var e = doc.querySelector(q); if (!e) return; var r = e.getBoundingClientRect(); if (r.width && r.height && r.top > H * 0.5 && r.left < window.innerWidth / 2 + 260 && r.right > window.innerWidth / 2 - 260) low = Math.min(low, r.top - 12); });
    var fab = doc.getElementById("sbFab"); if (fab) { var f = fab.getBoundingClientRect(); if (f.width && f.height && f.top > H * 0.5) low = Math.min(low, Math.round(f.top + f.height / 2 + 18)); }
    return Math.round(low);
  }
  function paintTray() {
    if (!deskOn || !tray) return;
    ov.style.setProperty("--dt-tray-b", Math.max(8, window.innerHeight - trayBottom()) + "px");
  }
  /* бейдж идущего таймера в шапке (D-1303): только когда сам таймер на столе не виден */
  function paintRun() {
    var b = doc.getElementById("sbClockBtn"); if (!b || !DT) return;
    if (!runBadge || !runBadge.isConnected) { runBadge = doc.createElement("span"); runBadge.className = "tb-run"; runBadge.id = "sbDtRun"; runBadge.hidden = true; runBadge.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + ICO.timer + '</svg><span class="tb-run-t"></span>'; b.insertBefore(runBadge, b.firstChild); }
    var i = DT.info(), seen = i.mode && !visibleWindows() && !deskBusy() && !(open && picked && !TIMEISH[tool]);
    var show = !!i.mode && !seen;
    if (show) {
      var sec = i.mode === "stopwatch" ? Math.floor(i.v / 1000) : Math.ceil(Math.max(0, i.total - i.v) / 1000), h = Math.floor(sec / 3600), m = Math.floor(sec / 60) % 60;
      var txt = (h ? h + ":" + two(m) : m) + ":" + two(sec % 60), tt = runBadge.querySelector(".tb-run-t");
      if (tt.textContent !== txt) tt.textContent = txt;
    }
    if (runBadge.hidden === show) runBadge.hidden = !show;
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
    var c = S / 2, rad = bR * (0.28 + 0.72 * r), core = "rgba(" + P.c.join(",") + ",", glow = "rgba(" + P.g.join(",") + ",";
    var g = x.createRadialGradient(c, c, 0, c, c, rad * 1.25);
    g.addColorStop(0, glow + (0.16 + 0.14 * r) * al + ")"); g.addColorStop(0.7, glow + 0.06 * al + ")"); g.addColorStop(1, glow + "0)");
    x.fillStyle = g; x.beginPath(); x.arc(c, c, rad * 1.25, 0, 6.283); x.fill();
    x.lineWidth = 6; x.strokeStyle = glow + 0.25 * al + ")"; x.filter = "blur(4px)"; x.beginPath(); x.arc(c, c, rad, 0, 6.283); x.stroke();
    x.filter = "none"; x.lineWidth = 1.4; x.strokeStyle = core + 0.92 * al + ")"; x.beginPath(); x.arc(c, c, rad, 0, 6.283); x.stroke();
    if (word) {
      x.font = "300 " + Math.round(Math.max(15, bR * 0.13)) + "px \"SB Voice\", \"SB Smile\", system-ui, sans-serif"; x.textAlign = "center"; x.textBaseline = "middle";
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
    } else if (ov && ov.classList.contains("dt-grid")) {
      /* D-1422: на столе инструментов круг вдоха — главная фигура: на месте цифр и их подписи (одна высота для всех), текст
         подсказки — под ним, а не внутри круга */
      var zt = L.gy - Math.round(DT.Hd() / 2), zh = DT.Hd() + 96;
      bR = Math.max(36, Math.round(zh / 2) - 6); cy = zt + Math.round(zh / 2); cx = W / 2;
    } else if (ib && free > 0) { bR = Math.max(44, Math.min(bR, Math.floor((free - 24) / 2))); cy = Math.max(cy, ib + bR + 12); }
    var S = bR * 2 + 40; bcv.width = Math.round(S * dpr); bcv.height = Math.round(S * dpr); bcv.style.width = S + "px"; bcv.style.height = S + "px";
    bcv.style.transform = "translate3d(" + Math.round(cx - S / 2) + "px," + Math.round(cy - S / 2) + "px,0)";
  }
  function breathFrame() {
    braf = 0; if (!bcv || tool !== "breath") return;
    var t = performance.now() - bt0, ph = breathPhase(t);
    if (ph.end) {
      var al = 1 - sm(ph.e / B_END); drawBreath(0, T("dt.breath.end"), al);
      if (ph.e < B_END) braf = requestAnimationFrame(breathFrame); else { stopBreath(); announce(T("dt.breath.end")); afterBreath(); }
      return;
    }
    var w = T("dt.breath." + ph.w); if (w !== bWord) { bWord = w; }
    drawBreath(ph.r, w, 1);
    braf = requestAnimationFrame(breathFrame);
  }
  /* «меньше движения»: свет не растёт — меняются только слова, по одной перерисовке на смену */
  function breathStill() {
    var t = performance.now() - bt0, ph = breathPhase(t);
    if (ph.end) { drawBreath(0.6, T("dt.breath.end"), 1); bTmo = setTimeout(function () { stopBreath(); afterBreath(); }, B_END); return; }
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
  /* дыхание кончилось или «хватит» (осмотр H4e4, п.6): на столе инструментов — назад к ряду и часам, а не в пустую мысль */
  function afterBreath() { if (deskOn && open) { setMenu(); layout(); } else setTool("line"); }
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
  function paintToday(force) {
    if (!DT || !todayBtn) return;
    var N = window.sbNoteToday ? window.sbNoteToday.get() : null, info = DT.info();
    var restPin = !open && !!pinnedNow() && !!DT.tool();   /* H4e: закреплённое (часы) на столе — главное сегодня встаёт над ним */
    /* D-1445: на столе инструментов главное сегодня не светится — там свои инструменты; оно живёт на первом столе */
    if (!N || open || deskBusy() || onToolsDesk() || (DT.tool() && !restPin)) { hideToday(); return; }
    if (!todayCanvas()) return;
    var txt = String(N.text || "").split("\n").filter(function (l) { return l.trim(); })[0] || "";
    txt = txt.trim(); if (txt.length > 46) txt = txt.slice(0, 45).trim() + "…";
    var W = window.innerWidth, H = window.innerHeight, Hd = DT.Hd(), dpr = Math.min(2, window.devicePixelRatio || 1);
    /* в покое — в самой середине; идёт время — над ним, тем же светом */
    var cy = info.mode || restPin ? Math.max(safeTop() + 20, Math.round((restPin ? freeCy() : H * 0.5) - Hd * 1.25)) : Math.round(H * 0.5);
    var view = DT.variant(), P = DT.pal(), key = [txt, view, P.mood, W, H, cy, reduced()].join("|");
    if (!force && key === tKey) return;
    tKey = key;
    var fs = Math.round(Math.max(20, Math.min(40, Hd * 0.42))), font = "300 " + fs + "px \"SB Voice\", \"SB Smile\", system-ui, sans-serif";
    var m = tctx; m.font = font; var tw = Math.ceil(m.measureText(txt).width), bw = Math.min(W - 24, tw + fs * 2), bh = fs * 3;
    tcv.width = Math.round(bw * dpr); tcv.height = Math.round(bh * dpr); tcv.style.width = bw + "px"; tcv.style.height = bh + "px";
    tcv.style.transform = "translate3d(" + Math.round(W / 2 - bw / 2) + "px," + Math.round(cy - bh / 2) + "px,0)";
    var x = tctx; x.setTransform(dpr, 0, 0, dpr, 0, 0); x.font = font; x.textAlign = "center"; x.textBaseline = "middle";
    var core = "rgba(" + P.c.join(",") + ",", glow = "rgba(" + P.g.join(",") + ",";
      x.shadowColor = glow + "0.55)"; x.shadowBlur = 16; x.fillStyle = glow + "0.35)"; x.fillText(txt, bw / 2, bh / 2);
    x.shadowBlur = 5; x.fillStyle = core + "0.92)"; x.fillText(txt, bw / 2, bh / 2); x.shadowBlur = 0;
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
  /* H4e (D-1300): инструменты открывает только касание закреплённого (часов); пустой стол — для заметок */
  function inPinned(x, y) {
    if (!pinRect) return false;
    return x >= pinRect.x && x <= pinRect.x + pinRect.w && y >= pinRect.y && y <= pinRect.y + pinRect.h;
  }
  /* D-1358: на другом столе (свой стол 2–3 или стол инструментов) середина первого стола не отвечает */
  function awayDesk() { return !!(window.sbDesks && window.sbDesks.at() !== 0); }
  function onToolsDesk() { return !!(window.sbDesks && window.sbDesks.onTools && window.sbDesks.onTools()); }
  function deskTarget(t) {
    if (!t || !t.closest || !t.closest("#desktop")) return false;
    return !t.closest(window.sbEmptyDesktopSkipSelector || ".window");
  }
  function wireInner() {
    /* экранная клавиатура поднимается не сразу; инструменты успели убрать — раскладка не трогает часы стола (D-1350:
       поздний вызов ставил свет на место блока, и часы оставались поднятыми) */
    line.addEventListener("focus", function () { setTimeout(function () { if (open) layout(); }, 320); });
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
    tray.addEventListener("click", function (ev) { if (tray.hasAttribute("data-sbd-dim")) return; var b = ev.target.closest && ev.target.closest("[data-tool]"); if (b) { menuFrom = ""; setTool(b.dataset.tool); } });
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
      if (b.dataset.ck) { timeAct(b.dataset.ck); return; }
      if (b.dataset.c === "plus" || b.dataset.c === "minus") count(b.dataset.c === "plus" ? 1 : -1);
      /* сброс — только после вопроса голосом: случайное касание не стирает счёт */
      if (b.dataset.c === "reset") say(T("dt.count.ask") + " [" + T("dt.count.yes") + "] [" + T("dt.count.no") + "]", { on: function (w, i) { if (i === 0) count(0); } });
      if (b.dataset.b === "stop") { stopBreath(); afterBreath(); }
      if (b.dataset.w2 === "forget") { var s = readS(); delete s.wait; writeS(s); paneWait(); }
      /* «готово» (осмотр H4e4, п.7): на столе инструментов — инструмент остаётся на виду со своим итогом (было: инструменты
         убирались и стол уходил на первый — итог пропадал); вне его — как прежде, убрать */
      if (b.dataset.w2 === "done") { if (deskOn) { if (doc.activeElement && ov.contains(doc.activeElement)) { try { doc.activeElement.blur(); } catch (e) { /* фокус не обязателен */ } } if (tool === "wait") showWait(); else if (tool === "city") showCity(); else if (tool === "sun") showSun(); } else closeTools(false); }
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
      if (t.dataset && t.dataset.ckAt && t.value) { var c0 = CK(); if (c0) { c0.act({ at: t.value }); timeSig = ""; viewTime(); } }
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
    /* D-1300: касание закреплённого — он сам; к ряду — последняя звезда справа (стол инструментов, D-1359) */
    pinHit.addEventListener("click", function (ev) { ev.stopPropagation(); if (!open) openTools("pin", pinHit.dataset.tool); });
    foot.addEventListener("click", function (ev) {
      var b = ev.target.closest && ev.target.closest("button"); if (!b) return;
      if (b.classList.contains("dt-pin")) togglePin();
      if (b.classList.contains("dt-histbtn")) { var hl = ov.querySelector(".dt-hist"), on = hl.hidden; if (on) paintHist(); hl.hidden = !on; b.setAttribute("aria-expanded", on ? "true" : "false"); layout(); }
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
    /* H4e (D-1305): пока система слушает, загорается только черта пульта в шапке; стол спокоен */
    if (M.start(function (t) { line.value = base + t; update(); }, function () { mic.setAttribute("aria-pressed", "false"); mic.classList.remove("on"); line.placeholder = T("dt.line.ph"); root.classList.remove("sb-listening"); })) {
      mic.setAttribute("aria-pressed", "true"); mic.classList.add("on"); line.placeholder = T("dt.mic.on"); root.classList.add("sb-listening");
    }
  }
  function wire() {
    wireInner();
    window.addEventListener("resize", function () { if (open) trayToActive(); });
    if (DT && DT.on) DT.on(function (ev) { if (ev !== "tool" && ev !== "tool-off" && ev !== "mood" && ev !== "ready" && open && TIMEISH[tool]) { timeSig = ""; viewTime(); } });
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
      if (visibleWindows() || deskBusy() || !inPinned(ev.clientX, ev.clientY)) return;
      ev.stopPropagation(); ev.preventDefault();
      openTools("pin", pinHit && pinHit.dataset.tool);
    }, true);
    /* ВЕРНУЛСЯ К ИНСТРУМЕНТУ — ПРИГЛАШЕНИЕ УШЛО (D-1445): касание пустого места при набранной строке позвало заметку,
       а человек продолжил счёт — висящее приглашение снимается, и следующее касание мимо снова зовёт заметку, а не гасит
       старое. ОТКАТ: убрать этот слушатель — приглашение уходит само через 5 с. */
    doc.addEventListener("pointerdown", function (ev) {
      if (!open || !ov.contains(ev.target)) return;
      if (window.sbNoteInviteOpen && window.sbNoteInviteOpen() && window.sbCloseNoteInvite) window.sbCloseNoteInvite();
    }, true);
    /* касание мимо — убрать; само это касание не зовёт приглашение к заметке */
    doc.addEventListener("pointerdown", function (ev) {
      if (!open) return;
      /* D-1359: на столе инструментов касание мимо их не убирает — это их стол; уйти — звездой, листанием, Esc */
      if (deskOn) return;
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
      if (!open || ev.key !== "Escape") return;
      /* сначала — приглашение к заметке (касание пустого места на столе инструментов): Esc убирает только его, инструмент и
         часы остаются, где были */
      if (window.sbNoteInviteOpen && window.sbNoteInviteOpen()) { ev.preventDefault(); ev.stopImmediatePropagation(); if (window.sbCloseNoteInvite) window.sbCloseNoteInvite(); return; }
      ev.preventDefault(); ev.stopImmediatePropagation(); closeTools();
    }, true);
    /* НАБОР НА ПУСТОМ СТОЛЕ — СТРОКА МЫСЛИ (основатель 12.11): любой знак, цифра тоже —
       сам расчёт не открывается никогда; «расчёт» с клавишами света — только словом.
       Перехват раньше голых клавиш оболочки («e», «w»): на пустом столе без окон набор —
       это мысль; «?» (список клавиш) остаётся за оболочкой. */
    /* H4e (D-1300): инструменты открыты не на строке (часы, меню, счётчик…) — набор с клавиатуры, не в поле,
       это тоже мысль: строка встаёт сама и берёт знак. Счётчик свои + − = оставляет себе. */
    doc.addEventListener("keydown", function (ev) {
      if (!open || ev.defaultPrevented || ev.isComposing || !ev.key || ev.key.length !== 1 || ev.key === " " || ev.ctrlKey || ev.metaKey || ev.altKey) return;
      if (picked && lineish()) return;
      if (picked && tool === "count" && /[+=\-]/.test(ev.key)) return;
      var a = doc.activeElement; if (a && a !== doc.body && a.closest && (a.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(a.tagName))) return;
      ev.preventDefault(); ev.stopImmediatePropagation();
      setTool("line"); line.value = (line.value || "") + ev.key; update();
      try { line.focus({ preventScroll: true }); var n = line.value.length; line.setSelectionRange(n, n); } catch (e) { /* фокус не обязателен */ }
    }, true);
    doc.addEventListener("keydown", function (ev) {
      if (open || ev.defaultPrevented || ev.isComposing || !ev.key || ev.key.length !== 1 || ev.key === "?" || ev.key === " ") return;
      if (ev.ctrlKey || ev.metaKey || ev.altKey) return;
      if ((window.sbAnyPanelOpen && window.sbAnyPanelOpen()) || visibleWindows() || deskBusy() || awayDesk()) return;
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
      /* D-1359: инструменты — на своём столе: пульт ведёт туда, сразу с последним инструментом */
      var lastT = readS().last || "line";
      if (window.sbDesks && window.sbDesks.tools && window.sbDesks.toolsAt() >= 0) { if (deskOn) setTool(lastT); else window.sbDesks.tools(lastT); return; }
      if (open) closeTools();
      openTools("pult");
    });
    if (window.sbNoise && window.sbNoise.on) window.sbNoise.on(function () { noiseView(); });
    if (window.visualViewport) { var vvT = 0; ["resize", "scroll"].forEach(function (k) { window.visualViewport.addEventListener(k, function () { if (!open) return; clearTimeout(vvT); vvT = setTimeout(layout, 30); }); }); }
    /* вкладка скрыта — свет спит: закреплённый не тикает, перерисовка — при возвращении */
    doc.addEventListener("visibilitychange", function () { if (!doc.hidden && !open) showPinned(); });
    hintOnce();
    window.addEventListener("resize", function () { if (open) layout(); if (tool === "breath" && open) sizeBreath(); paintToday(); if (!open && pinnedNow()) DT.setCy(freeCy()); paintSign(); paintTray(); paintPinHit(); });
    window.addEventListener("sb:theme", function () { paint(); paintToday(true); });
    /* D-1358: перелёт между столами кончился — место закреплённого считается заново по столу в покое (во время перелёта
       значки первого стола растянуты, и свободная середина под ними мерилась бы неверно) */
    window.addEventListener("sb:desk", function () { if (!open) showPinned(); else if (!(armed && deskOn && !picked)) layout(); paintPinHit(); paintToday(true); });
    window.addEventListener("sb:desktime", function () { setTimeout(function () { paint(); paintToday(true); }, 0); });
    window.addEventListener("sb:today", function () { paintToday(true); });
    if (window.sbNotesStore) window.sbNotesStore.onChange(function () { setTimeout(paintToday, 0); [80, 400].forEach(function (ms) { setTimeout(function () { if (!open && coveredNow() !== covered) showPinned(); }, ms); }); });
    if (window.sbBus && window.sbBus.on) window.sbBus.on("translate:done", relang);
    DT.on(function (ev) {
      if (ev === "start" || ev === "stop" || ev === "gone" || ev === "tool-off" || ev === "tool-yield") setTimeout(function () { paintToday(true); }, 0);
      /* пошло время — закреплённый молчит; время ушло — закреплённый вернулся */
      if ((ev === "start" || ev === "stop" || ev === "gone") && !open) showPinned();
      if ((ev === "stop" || ev === "gone") && !open) setTimeout(showPinned, 0);
      if (ev === "variant" || ev === "mood") { paint(); paintToday(true); if (tool === "sun" && open) showSun(); }
    });
    tray.addEventListener("scroll", fitTray, { passive: true });
    /* ручка, касание часов и бейдж таймера следят за столом: окна, ворота, панели — без кадров, раз в полсекунды */
    setInterval(function () {
      if (doc.hidden) return;
      if (!open && coveredNow() !== covered) showPinned();
      paintTray(); paintRun(); if (!open) paintPinHit(); syncTopClock();
    }, 500);
    /* заметка легла на место часов или ушла с него — сразу, без ожидания такта */
    var noteLayer = doc.getElementById("sbNoteLayer"), noteT = 0;
    if (noteLayer && window.MutationObserver) new MutationObserver(function () { if (noteT) return; noteT = requestAnimationFrame(function () { noteT = 0; if (!open && coveredNow() !== covered) showPinned(); }); }).observe(noteLayer, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class"] });
    if (window.sbBus && window.sbBus.on) ["window:opened", "window:closed"].forEach(function (ev) { window.sbBus.on(ev, function () { setTimeout(function () { if (!open) showPinned(); paintRun(); syncTopClock(); }, 0); }); });
    DT.on(function (ev) { if (ev === "tool" || ev === "tool-off" || ev === "start" || ev === "stop" || ev === "gone") setTimeout(function () { syncTopClock(); paintRun(); }, 0); });
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
    open: function (how, t) { return openTools(how || "pointer", t); },
    menu: function () { if (open) { setMenu(); layout(); } return open && !picked; },
    /* закрепить инструмент или снять булавку (null) — тот же путь, что булавка внутри инструмента */
    /* закрепить: на первый стол (кнопка «закрепить на столе» у инструментов) или на указанный стол (меню стола
       «добавить инструмент», основатель 25.11.2026); пусто — снять */
    pin: function (t, id) { setPin(id || "main", t && PINNABLE[t] ? t : null); if (open) paintFoot(); else showPinned(); syncTopClock(); return pinOf(id || "main"); },
    pinHere: function (t) { var id = deskIdNow(); if (id === "tools") return null; setPin(id, t && PINNABLE[t] ? t : null); if (!open) showPinned(); say(T(t ? "dt.pin.on" : "dt.pin.off")); return pinOf(id); },
    pinnable: function () { return TOOLS.filter(function (t) { return PINNABLE[t]; }).map(function (t) { return { tool: t, word: toolWord(t) }; }); },
    picked: function () { return open && picked; },
    close: function () { closeTools(); },
    /* D-1359: стол инструментов (core/desks.js) — открыть ряд в полный размер (или сразу инструмент t) и убрать */
    desk: function (on, t, soft) { if (!on && soft) { if (open && deskOn) softClose(); return false; } if (on && soft) return softOpen(t); if (on) { if (open && !deskOn) closeTools(); if (!open) return openTools("desk", t); if (t) setTool(t); return true; } if (open && deskOn) closeTools(); return false; },
    onDesk: function () { return open && deskOn; },
    arm: function () { return arm(); }, armed: function () { return armed; },
    /* D-1358 (скорость): ряд заранее в своём месте стола инструментов, пока тот прозрачен в перелёте; открытие — позже */
    prep: function (on) { if (on && !open && tray) { placeTray(true); tray.hidden = false; } else if (!on && !open && tray && tray.parentNode === ov) { placeTray(false); } },
    isOpen: function () { return open; },
    tool: function (t) { if (t && open) setTool(t); return tool; },
    type: function (s) { if (!open) openTools("key"); line.value = String(s || ""); update(); return kindOf(line.value); },
    enter: function () { enter(); },
    press: function (k) { if (open) press(k); },
    state: function () { return { open: open, picked: open && picked, by: by, tool: tool, answered: answered, kind: open ? kindOf(line.value) : "", value: line ? line.value : "", keys: !!(keys && !keys.hidden && !keys.classList.contains("dim")), placeholder: line ? line.placeholder : "", shown: DT ? DT.tool() : null, center: L.gy }; },
    findCity: findCity, daysTo: daysTo, plural: plural,
    pinned: function () { return pinnedNow(); }, clockOnDesk: function () { return clockOnDesk(); }, pinRect: function () { return pinRect ? { x: pinRect.x, y: pinRect.y, w: pinRect.w, h: pinRect.h } : null; }, last: function () { return readS().last || null; }, freeCy: function () { return DT ? freeCy() : 0; }, iconsBottom: iconsBottom,
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
