/* sys.baby OS — core/panels.js
 * Panel registry (one-open invariant) + the kept panels:
 * Shortcuts, Notifications, Windows, Clipboard, Health, Workspace Layouts,
 * Desktop Manager, Incognito gate (+ self-destruct badge). */
(function () {
  "use strict";

  var doc = document, root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var esc = function (s) { return window.escapeHtml ? window.escapeHtml(s) : String(s == null ? "" : s); };

  /* The app name has one source, in the shell. Reading def.title here is how
     the ⌘K palette and the panels used to end up permanently English while
     the dock beside them translated correctly. */
  function appTitle(id) { return window.sbAppTitle ? window.sbAppTitle(id) : id; }
  function appLabel(id) { return window.sbAppLabel ? window.sbAppLabel(id) : id; }
  function num(v, d) { v = Number(v); return isFinite(v) ? v : d; }
  function readJSON(k, f) { return window.sbReadJSON ? window.sbReadJSON(k, f) : f; }
  function writeJSON(k, v) { if (window.sbWriteJSON) window.sbWriteJSON(k, v); }
  function tr(k, v) { return window.sbT ? window.sbT(k, v) : k; }

  function timeAgo(ts) {
    var s = Math.max(0, Math.floor((Date.now() - num(ts, Date.now())) / 1000));
    if (s < 60) return tr("time.now");
    var m = Math.floor(s / 60);
    if (m < 60) return tr("time.m", { n: m });
    var h = Math.floor(m / 60);
    if (h < 24) return tr("time.h", { n: h });
    return tr("time.d", { n: Math.floor(h / 24) });
  }
  window.sbTimeAgo = timeAgo;

  /* ======================================================= registry §6.0 */
  var panels = Object.create(null);
  window.sbPanels = panels;

  function anyOpen() {
    var k;
    for (k in panels) if (panels[k].isOpen()) return true;
    return false;
  }
  window.sbAnyPanelOpen = anyOpen;

  function closeAll() {
    var k, closed = false;
    for (k in panels) if (panels[k].isOpen()) { panels[k].close(); closed = true; }
    return closed;
  }
  window.sbCloseAllPanels = closeAll;

  window.sbRegisterPanel = function (overlayId, closeBtnId, onOpen) {
    var overlay = doc.getElementById(overlayId);
    if (!overlay) return null;                      /* guarded degradation */
    var lastFocus = null;

    function isOpen() { return overlay.classList.contains("open"); }
    function open() {
      if (isOpen()) return;
      var k;
      for (k in panels) if (k !== overlayId && panels[k].isOpen()) panels[k].close();
      if (window.sbCloseControlCenter) window.sbCloseControlCenter();
      lastFocus = doc.activeElement;
      overlay.classList.add("open");
      overlay.removeAttribute("hidden");
      if (typeof onOpen === "function") { try { onOpen(); } catch (e) { if (window.console) console.error("[panel] " + overlayId, e); } }
      var btn = closeBtnId ? doc.getElementById(closeBtnId) : null;
      if (btn) { try { btn.focus(); } catch (e) { /* ignore */ } }
      if (window.sbBus) window.sbBus.emit("panel:open", { id: overlayId });
    }
    function close() {
      if (!isOpen()) return;
      overlay.classList.remove("open");
      overlay.setAttribute("hidden", "");
      if (typeof api.onClose === "function") { try { api.onClose(); } catch (e) { /* ignore */ } }
      if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) { /* ignore */ } }
      lastFocus = null;
    }
    var api = { open: open, close: close, isOpen: isOpen, el: overlay, onClose: null };
    panels[overlayId] = api;

    overlay.addEventListener("pointerdown", function (ev) { if (ev.target === overlay) close(); });
    var btn = closeBtnId ? doc.getElementById(closeBtnId) : null;
    if (btn) btn.addEventListener("click", close);
    return api;
  };

  function panelBody(overlayId) { var o = doc.getElementById(overlayId); return o ? o.querySelector(".panel-body") : null; }

  /* ── СПРОСИТЬ ПОДТВЕРЖДЕНИЕ ПЕРЕД ОПАСНЫМ · решение D-308 ──────────────────
     Обещание true/false. Пока замок открыт и подтверждение свежее — сразу true;
     иначе окно: слово этого мира (проверяется отпечатком в памяти, presence.
     byWord) или ключ устройства. Без замка — true. */
  window.sbAskPresence = function () {
    var V = window.sbVault;
    if (!V || !V.isLocked || !V.isLocked()) return Promise.resolve(true);
    if (V.presence && V.presence.fresh()) return Promise.resolve(true);
    if (!V.presence) return Promise.resolve(false);
    return wordWindow(V, null);
  };

  /* ── СЛОВО ПЕРЕД КАЖДЫМ НЕОБРАТИМЫМ · решение D-350 ────────────────────────
     ПОВОД — основатель 29.09.2026: «при нажатии „стереть всё и уйти“
     пользователю необходимо ввести пароль… сколько ещё похожих недоработок —
     устранить». При стоящем замке стирание, удаление всех данных, замена при
     импорте, «Заглушить всё», «Забыть место» и «Новый пароль», слияние груза
     и «никогда» у самозапирания шли без слова.
     Теперь при замке необратимое спрашивает слово ВСЕГДА — свежее
     подтверждение (D-308) здесь не пропускает: оно держится две минуты ради
     показа пароля, а стереть за эти две минуты мог бы кто угодно. Только
     слово: ключ устройства отвечает на касание пальца, а необратимое просит
     того, что знает человек. Что именно пропадёт, сказано в том же окне
     (opts.question). Без замка слова нет — вопрос своим голосом (D-335).
     Обещание true/false. Охраняется tools/irreversible-word-check.mjs. */
  window.sbAskIrreversible = function (opts) {
    opts = opts || {};
    var V = window.sbVault;
    if (!V || !V.isLocked || !V.isLocked()) {
      if (typeof window.sbAsk !== "function") return Promise.resolve(false);
      return window.sbAsk({ question: opts.question, ok: opts.ok, danger: true }).then(function (yes) { return !!yes; });
    }
    if (!V.presence || !V.isOpen || !V.isOpen()) return Promise.resolve(false);
    return wordWindow(V, { question: opts.question || "" });
  };

  /* Окно слова — одно на оба вопроса. irr — необратимое: свой заголовок, что
     пропадёт, и никакого ключа устройства. */
  function wordWindow(V, irr) {
    return new Promise(function (resolve) {
      var back = doc.createElement("div");
      back.className = "sb-confirm-back";
      back.setAttribute("role", "dialog"); back.setAttribute("aria-modal", "true");
      var canDev = !irr && V.presence.canDevice && V.presence.canDevice();
      back.innerHTML = '<div class="sb-confirm' + (irr ? " sb-confirm-irr" : "") + '">' +
        '<h3>' + esc(tr(irr ? "confirm.irrTitle" : "confirm.title")) + "</h3>" +
        (irr && irr.question ? '<p class="sb-confirm-what">' + esc(irr.question) + "</p>" : "") +
        '<p class="sb-confirm-why">' + esc(tr(irr ? "confirm.irrWhy" : "confirm.why")) + "</p>" +
        '<input type="password" id="sbConfirmWord" autocomplete="current-password" aria-label="' + esc(tr("confirm.word")) + '" placeholder="' + esc(tr("confirm.word")) + '">' +
        '<p class="sb-confirm-err" id="sbConfirmErr" role="alert"></p>' +
        '<div class="sb-confirm-acts">' +
          '<button type="button" class="btn primary" id="sbConfirmGo">' + esc(tr("confirm.go")) + "</button>" +
          (canDev ? '<button type="button" class="btn ghost" id="sbConfirmDev">' + esc(tr("confirm.device")) + "</button>" : "") +
          '<button type="button" class="btn link" id="sbConfirmCancel">' + esc(tr("confirm.cancel")) + "</button>" +
        "</div></div>";
      doc.body.appendChild(back);
      var word = back.querySelector("#sbConfirmWord");
      var err = back.querySelector("#sbConfirmErr");
      var done = false, asking = false;
      var go = back.querySelector("#sbConfirmGo");
      function finish(v) { if (done) return; done = true; if (back.parentNode) back.parentNode.removeChild(back); resolve(v); }
      /* Промах отвечается с паузой (D-350): пока ответа нет, второе слово не
         отправляется — кнопка ждёт вместе с человеком. */
      function tryWord() {
        var w = word ? word.value : "";
        if (asking) return;
        if (!w) { if (word) word.focus(); return; }
        asking = true;
        if (go) go.disabled = true;
        V.presence.byWord(w).then(function (okp) {
          asking = false;
          if (go) go.disabled = false;
          if (okp) { finish(true); return; }
          var shut = V.presence.shutting && V.presence.shutting();
          if (err) err.textContent = tr(shut ? "confirm.shut" : "confirm.wrong");
          if (shut) { if (go) go.disabled = true; if (word) word.disabled = true; return; }
          if (word) { word.value = ""; word.focus(); }
        });
      }
      if (go) go.addEventListener("click", tryWord);
      if (word) word.addEventListener("keydown", function (ev) { if (ev.key === "Enter") { ev.preventDefault(); tryWord(); } });
      var dev = back.querySelector("#sbConfirmDev");
      if (dev) dev.addEventListener("click", function () {
        dev.disabled = true;
        V.presence.byDevice().then(function (okp) { dev.disabled = false; if (okp) { finish(true); return; } if (err) err.textContent = tr("confirm.deviceNo"); });
      });
      var cancel = back.querySelector("#sbConfirmCancel");
      if (cancel) cancel.addEventListener("click", function () { finish(false); });
      back.addEventListener("pointerdown", function (ev) { if (ev.target === back) finish(false); });
      if (word) setTimeout(function () { word.focus(); }, 60);
    });
  }

  /* ===================================================== 1. shortcuts §6.1 */
  /* The chord is the same everywhere; what it does is a sentence, so it is a
     key rather than the sentence itself. */
  var SHORTCUT_ROWS = [
    ["⌘K", "sc.quickActions"],
    ["Esc", "sc.closeTop"],
    ["?", "sc.thisPanel"],
    ["W", "sc.openWindows"],
    ["E", "sc.expose"],
    ["↑ / ↓", "sc.terminal"],
    ["tap + tap", "sc.note"],
    ["right-click", "sc.deskMenu"]
  ];

  /* ── ВРЕМЯ И КАЛЕНДАРЬ (D-135) ────────────────────────────────────────
     ПОВОД: «при нажатии на время должно открываться расширенное время и
     календарь в небольшом стеклянном окне максимально концептуально и цельно
     по дизайну с нашим дизайном».
     «Цельно с нашим дизайном» здесь значит буквально одно: панель НЕ своя.
     Это то же стекло, тот же заголовок, тот же уход по Esc и тот же возврат
     фокуса, что у всех остальных панелей, — иначе «цельно» было бы словом, а
     не свойством. Своего здесь ровно две вещи: крупное время теми же
     стержнями, что в полосе, и сетка месяца.
     НЕДЕЛЯ НАЧИНАЕТСЯ С ПОНЕДЕЛЬНИКА. Не настройка: система живёт в Таллине,
     и здесь неделя начинается так. */
  var calShift = 0;
  /* ── КАЛЕНДАРЬ ГОВОРИЛ ПО-АНГЛИЙСКИ ВСЕГДА (D-154) ──────────────────────
     Здесь стояло window.sbGetLang — функции с таким именем в системе НЕТ:
     язык объявлен как window.sbLang. Тернарник с запасным «en» проглатывал
     это молча, и панель времени показывала английские месяцы и дни недели на
     всех трёх языках. Ошибку нашёл закон о заметке из календаря — он потребовал
     дату СЛОВАМИ ТОГО ЯЗЫКА, на котором сидит человек, и получил «Tuesday 14
     July» там, где просил русский.
     УРОК НЕ В ОПЕЧАТКЕ. Запасное значение, поставленное «на всякий случай»,
     превратило отсутствие функции в тихую неправду: система не сломалась, она
     стала врать. Поэтому имя теперь спрашивается у того, кто его объявляет,
     а промах виден в самом языке панели. */
  function calLocale() {
    var l = typeof window.sbLang === "function" ? window.sbLang() : "en";
    return l === "ru" ? "ru-RU" : (l === "ee" ? "et-EE" : "en-GB");
  }
  function bigTime(d) {
    var str = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) +
      ":" + ("0" + d.getSeconds()).slice(-2);
    var box = doc.createElement("div");
    box.className = "time-big";
    for (var i = 0; i < str.length; i++) {
      var cell = doc.createElement("span");
      cell.className = "time-cell";
      if (str[i] === ":") { cell.className += " colon"; cell.textContent = ":"; }
      else if (window.sbClockGlyph) cell.appendChild(window.sbClockGlyph(str[i]));
      else cell.textContent = str[i];
      box.appendChild(cell);
    }
    return box;
  }
  function paintTime() {
    var body = panelBody("sbTimeOverlay");
    if (!body) return;
    var now = new Date();
    var view = new Date(now.getFullYear(), now.getMonth() + calShift, 1);
    body.innerHTML = "";

    body.appendChild(bigTime(now));

    var sub = doc.createElement("div");
    sub.className = "time-sub";
    sub.textContent = now.toLocaleDateString(calLocale(),
      { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    body.appendChild(sub);

    var nav = doc.createElement("div");
    nav.className = "cal-nav";
    nav.innerHTML = '<button type="button" class="cal-step" data-step="-1" aria-label="\u2190">\u2039</button>' +
      '<span class="cal-title">' + esc(view.toLocaleDateString(calLocale(), { month: "long", year: "numeric" })) + "</span>" +
      '<button type="button" class="cal-step" data-step="1" aria-label="\u2192">\u203a</button>';
    body.appendChild(nav);

    var head = doc.createElement("div");
    head.className = "cal-head";
    /* 2024-01-01 — понедельник; берём семь дней подряд от него, чтобы имена
       пришли из самой системы дат, а не были вписаны сюда по-русски. */
    for (var w = 0; w < 7; w++) {
      var dw = new Date(2024, 0, 1 + w);
      var sp = doc.createElement("span");
      sp.textContent = dw.toLocaleDateString(calLocale(), { weekday: "short" }).replace(/\.$/, "");
      head.appendChild(sp);
    }
    body.appendChild(head);

    var grid = doc.createElement("div");
    grid.className = "cal-grid";
    var first = new Date(view.getFullYear(), view.getMonth(), 1);
    var lead = (first.getDay() + 6) % 7;           /* понедельник = 0 */
    var days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    for (var b = 0; b < lead; b++) {
      var pad = doc.createElement("span");
      pad.className = "cal-pad";
      grid.appendChild(pad);
    }
    for (var n = 1; n <= days; n++) {
      var cell = doc.createElement("button");
      cell.type = "button";
      cell.className = "cal-day";
      if (calShift === 0 && n === now.getDate()) cell.className += " today";
      cell.textContent = String(n);
      cell.setAttribute("data-day", String(n));
      grid.appendChild(cell);
    }
    body.appendChild(grid);

    /* ── ДЕНЬ, НА КОТОРЫЙ НАЖАЛИ, СТАНОВИТСЯ ЗАМЕТКОЙ (D-154) ─────────────
       ПОВОД, дословно от основателя 26.08.2026: «при нажатии на любой день
       календаря автоматически перенаправляет пользователя на рабочий стол и
       система вписывает в новую заметку это число — максимально доходчиво и
       тепло. и пользователь дальше может продолжить писать, что будет в эту
       дату».
       ДАТА ПИШЕТСЯ СЛОВАМИ, А НЕ ФОРМАТОМ. «14.07» — это машина, говорящая
       с человеком на своём языке; «Понедельник, 14 июля» — человек, которому
       не нужно ничего расшифровывать. Язык берётся тот, на котором он сидит.
       СЛУШАТЕЛЬ НА СЕТКЕ, А НЕ НА КАЖДОМ ЧИСЛЕ: клеток тридцать одна, и они
       перерисовываются при каждом перелистывании месяца. */
    grid.addEventListener("click", function (ev) {
      var b3 = ev.target && ev.target.closest ? ev.target.closest("[data-day]") : null;
      if (!b3) return;
      var dayN = Number(b3.getAttribute("data-day")) || 1;
      var picked = new Date(view.getFullYear(), view.getMonth(), dayN);
      openDayNote(picked);
    });

    $$(".cal-step", body).forEach(function (b2) {
      b2.addEventListener("click", function () {
        calShift += Number(b2.getAttribute("data-step")) || 0;
        paintTime();
      });
    });
  }
  /* Заметка этого дня. Панель закрывается ПЕРВОЙ: заметка, родившаяся за
     закрытой панелью, для человека не родилась вовсе — он её не увидит и
     решит, что нажатие не сработало. */
  function openDayNote(when) {
    var overlay = doc.getElementById("sbTimeOverlay");
    if (overlay && timePanel && typeof timePanel.close === "function") timePanel.close();
    else if (overlay) overlay.classList.remove("open");

    var line = "";
    try {
      line = when.toLocaleDateString(calLocale(), { weekday: "long", day: "numeric", month: "long" });
    } catch (err) { line = String(when.getDate()); }
    line = line.charAt(0).toUpperCase() + line.slice(1);

    if (typeof window.sbAddQuickNote !== "function") return;
    /* Кладётся туда, где человек её увидит: чуть ниже полосы и левее середины
       стола, но в пределах экрана даже на телефоне. */
    var x = Math.max(16, Math.round(window.innerWidth * 0.12));
    var y = Math.max(96, Math.round(window.innerHeight * 0.28));
    var id = window.sbAddQuickNote(line, { onDesktop: true, x: x, y: y });

    if (window.showToast) {
      try { window.showToast(tr("note.day.title"), tr("note.day.body"), ""); }
      catch (err) { /* ignore */ }
    }
    /* И курсор сразу в ней: «пользователь дальше может продолжить писать».
       Заметка, в которую надо ещё попасть пальцем, обрывает ровно ту мысль,
       ради которой её и завели. Ждём кадра — до отрисовки её ещё нет. */
    setTimeout(function () {
      var el = doc.querySelector('#sbNoteLayer .sticky-note[data-id="' + id + '"]');
      var ta = el ? el.querySelector(".note-text") : null;
      if (!ta) return;
      try {
        ta.focus();
        ta.setSelectionRange(ta.value.length, ta.value.length);
      } catch (err) { /* ignore */ }
    }, 260);
  }

  var timePanel = window.sbRegisterPanel("sbTimeOverlay", "sbTimeClose", function () {
    calShift = 0;
    paintTime();
  });
  if (timePanel) {
    window.sbPanels = window.sbPanels || {};
    var btn = doc.getElementById("sbClockBtn");
    if (btn) btn.addEventListener("click", function () { timePanel.open(); });
    /* Пока панель открыта, крупное время идёт: стоящие часы в окне «время» —
       это ровно та ложь, ради которой окно и открывают. */
    setInterval(function () {
      var ov = doc.getElementById("sbTimeOverlay");
      if (ov && ov.classList.contains("open")) paintTime();
    }, 1000);
  }

  var shortcuts = window.sbRegisterPanel("sbShortcutsOverlay", "sbShortcutsClose", function () {
    var body = panelBody("sbShortcutsOverlay");
    if (!body) return;
    var rows = SHORTCUT_ROWS.map(function (r) {
      return '<div class="kv-row"><kbd>' + esc(r[0]) + "</kbd><span>" + esc(tr(r[1])) + "</span></div>";
    }).join("");
    var appRows = "";
    var map = window.sbAppShortcuts || {};
    Object.keys(map).forEach(function (id) {
      var def = (window.SysBaby && window.SysBaby.apps) ? window.SysBaby.apps[id] : null;
      if (!def) return;
      appRows += '<div class="kv-row"><kbd>' + esc(map[id].label) + "</kbd><span>" + esc(appTitle(id)) + "</span></div>";
    });
    body.innerHTML =
      '<div class="panel-scroll">' +
      '<h4 class="panel-sub">' + esc(tr("sc.system")) + "</h4>" + rows +
      (appRows ? '<h4 class="panel-sub">' + esc(tr("sc.openAnApp")) + "</h4>" + appRows : "") +
      "</div>";
  });

  /* =================================================== 2. notifications §6.2 */
  var NOTIF_KEY = "sysbaby.notifications";
  /* ── МИГРАЦИЯ: ЗАПИСЬ БЕЗ ПАСПОРТА СОБЫТИЯ НЕ ЧИТАЕТСЯ (v48) ────────────
     Основатель прислал ВТОРОЙ снимок с «Terminal closed» в журнале — уже
     после правила «подтверждения не пишутся». Разгадка: записи, сделанные
     старой сборкой, лежат в localStorage и переживают обновление кода —
     фильтр на записи не чистит уже записанное. Поэтому фильтр стоит и на
     ЧТЕНИИ: у настоящей записи есть паспорт kind: "event", всё остальное —
     довоенный мусор, и журнал его не показывает. Старые события уходят
     вместе с ним; это осознанная цена одноразовой чистки, о которой
     основатель просил дословно («прошу совет провести чистку мусора»). */
  function notifList() {
    var v = readJSON(NOTIF_KEY, []);
    if (!Array.isArray(v)) return [];
    var clean = v.filter(function (n) { return n && n.kind === "event"; });
    /* Мусор не прячется — он ИСЧЕЗАЕТ: найдя беспаспортные записи, чтение
       тут же перезаписывает хранилище очищенным списком. Иначе «чистка»
       была бы декорацией: снимок хранилища показал бы всё тот же хлам. */
    if (clean.length !== v.length) writeJSON(NOTIF_KEY, clean);
    return clean;
  }
  function notifSave(list) { writeJSON(NOTIF_KEY, list.slice(0, 30)); }

  function unseenCount() { return notifList().filter(function (n) { return !n.seen; }).length; }
  function paintBell() {
    var badge = $("#sbBellBadge");
    if (!badge) return;
    var n = unseenCount();
    if (!n) { badge.hidden = true; badge.textContent = ""; return; }
    badge.hidden = false;
    badge.textContent = n > 9 ? "9+" : String(n);
  }
  window.sbNotifBadgeRefresh = paintBell;

  /* ── СПИСОК ИЗВЕЩЕНИЙ — О СОБЫТИЯХ, А НЕ О СВОИХ ЖЕ НАЖАТИЯХ (v47.3) ────
   *
   * Основатель прислал снимок своего списка: «Echoes closed», «Pulse closed»,
   * «Pulse closed», «Letters closed», «Mail 4 new messages», «Mail 4 new
   * messages», «Seek closed» — и написал: «оповещения о закрытии чего-либо
   * это лишний шум и мусор». Он прав дважды.
   *
   * ПЕРВОЕ. Признак у подсказки был всегда: data-kind = "event" (случилось
   * само) или "confirm" (ответ на нажатие человека). Признак был — решения
   * по нему не было: наблюдатель записывал обе. Подтверждение живёт ровно те
   * пять секунд, пока человек на него смотрит и может нажать «Вернуть»; его
   * место — экран, а не память системы. Событие — то, что он мог пропустить,
   * и только оно имеет право пережить свои пять секунд.
   *
   * ВТОРОЕ. Стоячее обстоятельство («4 непрочитанных письма») записывалось
   * заново при каждом входе, и список набивался копиями одной правды. То же
   * событие теперь ОСВЕЖАЕТ свою строку, а не заводит вторую.
   */
  function recordToast(node) {
    var kind = node.getAttribute("data-kind") || "confirm";
    if (kind !== "event") return;
    var title = node.getAttribute("data-title") || "";
    var text = node.getAttribute("data-text") || "";
    var list = notifList();
    var same = null;
    for (var i = 0; i < list.length; i++) {
      if (list[i] && list[i].title === title && list[i].text === text) { same = i; break; }
    }
    if (same !== null) {
      var kept = list.splice(same, 1)[0];
      kept.ts = Date.now();
      list.unshift(kept);
    } else {
      list.unshift({
        id: "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
        kind: "event",                       /* паспорт: без него запись не читается */
        title: title,
        text: text,
        icon: "",
        ts: Date.now(),
        seen: false
      });
    }
    notifSave(list);
    paintBell();
    if (notifPanel && notifPanel.isOpen()) paintNotifPanel();
  }

  function observeToasts() {
    var host = $("#toastLayer");
    if (!host || !window.MutationObserver) return;
    var mo = new MutationObserver(function (records) {
      records.forEach(function (r) {
        Array.prototype.forEach.call(r.addedNodes, function (n) {
          if (n.nodeType === 1 && n.classList && n.classList.contains("toast")) recordToast(n);
        });
      });
    });
    mo.observe(host, { childList: true });
  }

  function paintNotifPanel() {
    var body = panelBody("sbNotifOverlay");
    if (!body) return;
    var list = notifList();
    if (!list.length) {
      body.innerHTML = '<div class="panel-scroll"><p class="panel-empty">' + esc(tr("p.noNotifications")) + '</p></div>';
      return;
    }
    body.innerHTML = '<div class="panel-scroll">' + list.map(function (n) {
      return '<div class="notif-row" data-id="' + esc(n.id) + '">' +
        '<div class="notif-main"><div class="notif-title">' + esc(n.title) + "</div>" +
        '<div class="notif-text">' + esc(n.text) + "</div></div>" +
        '<div class="notif-time">' + esc(timeAgo(n.ts)) + "</div>" +
        '<button class="notif-x" type="button" aria-label="' + esc(tr("p.dismiss")) + '">✕</button></div>';
    }).join("") + "</div>" +
      '<div class="panel-foot"><button class="btn ghost" type="button" id="sbNotifClear">' + esc(tr("p.clearAll")) + '</button></div>';

    $$(".notif-row", body).forEach(function (row) {
      row.addEventListener("click", function () {
        var id = row.getAttribute("data-id");
        notifSave(notifList().filter(function (n) { return n.id !== id; }));
        paintNotifPanel(); paintBell();
      });
    });
    var clear = $("#sbNotifClear", body);
    if (clear) clear.addEventListener("click", function () { notifSave([]); paintNotifPanel(); paintBell(); });
  }

  var notifPanel = window.sbRegisterPanel("sbNotifOverlay", "sbNotifClose", function () {
    var list = notifList().map(function (n) { n.seen = true; return n; });
    notifSave(list);
    paintNotifPanel();
    paintBell();
  });

  /* ================================================= 3. windows switcher §6.4 */
  var RECENT_KEY = "sysbaby.windows.recent";
  var taskTimer = null;

  function paintTasks() {
    var body = panelBody("sbTaskOverlay");
    if (!body) return;
    var apps = (window.SysBaby && window.SysBaby.apps) || {};
    var open = window.openWindows || {};
    var openIds = Object.keys(open);
    var openHtml = openIds.length ? openIds.map(function (id) {
      var def = apps[id] || {};
      return '<div class="task-row" data-id="' + esc(id) + '">' +
        '<span class="task-tile" style="background:' + esc(def.color || "#334") + '"></span>' +
        '<span class="task-name">' + esc(appTitle(id)) + "</span>" +
        '<span class="task-sub">' + esc(tr("p.openNow")) + '</span>' +
        '<button class="btn tiny" type="button" data-act="focus">' + esc(tr("p.focus")) + '</button>' +
        '<button class="task-x" type="button" data-act="close" aria-label="' + esc(tr("p.close")) + '">✕</button></div>';
    }).join("") : '<p class="panel-empty">' + esc(tr("p.noWindows")) + '</p>';

    var recent = readJSON(RECENT_KEY, []);
    if (!Array.isArray(recent)) recent = [];
    var recentHtml = recent.filter(function (r) { return r && !open[r.id] && apps[r.id]; }).map(function (r) {
      var def = apps[r.id] || {};
      return '<div class="task-row" data-id="' + esc(r.id) + '">' +
        '<span class="task-tile" style="background:' + esc(def.color || "#334") + '"></span>' +
        '<span class="task-name">' + esc(appTitle(r.id)) + "</span>" +
        '<span class="task-sub">' + esc(tr("p.closedAgo", { when: timeAgo(r.ts) })) + "</span>" +
        '<button class="btn tiny" type="button" data-act="reopen">' + esc(tr("p.reopen")) + '</button></div>';
    }).join("");

    body.innerHTML = '<div class="panel-scroll">' +
      '<h4 class="panel-sub">' + esc(tr("p.open")) + "</h4>" + openHtml +
      (recentHtml ? '<h4 class="panel-sub">' + esc(tr("p.recentlyClosed")) + "</h4>" + recentHtml : "") + "</div>";

    $$(".task-row", body).forEach(function (row) {
      var id = row.getAttribute("data-id");
      row.addEventListener("click", function (ev) {
        var act = ev.target && ev.target.getAttribute ? ev.target.getAttribute("data-act") : null;
        if (act === "close") { if (window.closeWindow) window.closeWindow(id); paintTasks(); return; }
        if (window.toggleApp) window.toggleApp(id);
        if (act === "reopen") paintTasks();
        else tasks.close();
      });
    });
  }

  var tasks = window.sbRegisterPanel("sbTaskOverlay", "sbTaskClose", function () {
    paintTasks();
    if (taskTimer) clearInterval(taskTimer);
    taskTimer = setInterval(function () { if (tasks.isOpen()) paintTasks(); else { clearInterval(taskTimer); taskTimer = null; } }, 2000);
  });
  if (tasks) tasks.onClose = function () { if (taskTimer) { clearInterval(taskTimer); taskTimer = null; } };

  /* =================================================== 4. clipboard history §6.7 */
  var CLIP_KEY = "sysbaby.clipboard.history";
  function clipList() { var v = readJSON(CLIP_KEY, []); return Array.isArray(v) ? v : []; }

  window.sbAddClip = function (text) {
    var t = String(text == null ? "" : text).slice(0, 2000);
    if (!t.trim()) return false;
    var list = clipList();
    if (list.length && list[0].text === t) { list[0].ts = Date.now(); }
    else list.unshift({ id: "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), text: t, ts: Date.now() });
    writeJSON(CLIP_KEY, list.slice(0, 20));
    if (clip && clip.isOpen()) paintClip();
    return true;
  };

  doc.addEventListener("copy", function () {
    var t = "";
    var ae = doc.activeElement;
    if (ae && (ae.tagName === "INPUT" || ae.tagName === "TEXTAREA") && typeof ae.selectionStart === "number") {
      t = String(ae.value || "").slice(ae.selectionStart, ae.selectionEnd);
    }
    if (!t) { try { t = String(window.getSelection()); } catch (e) { t = ""; } }
    if (t) window.sbAddClip(t);
  });

  function paintClip() {
    var body = panelBody("sbClipOverlay");
    if (!body) return;
    var list = clipList();
    body.innerHTML = '<div class="panel-scroll">' +
      (list.length ? list.map(function (c) {
        return '<div class="clip-row" data-id="' + esc(c.id) + '"><div class="clip-text">' + esc(c.text) + "</div>" +
          '<div class="clip-time">' + esc(timeAgo(c.ts)) + "</div></div>";
      }).join("") : '<p class="panel-empty">' + esc(tr("p.nothingCopied")) + "</p>") + "</div>" +
      '<div class="panel-foot"><span class="foot-note">' + esc(tr("p.copiedInside")) + '</span>' +
      '<button class="btn ghost" type="button" id="sbClipClear">' + esc(tr("p.clearAll")) + '</button></div>';

    $$(".clip-row", body).forEach(function (row) {
      row.addEventListener("click", function () {
        var id = row.getAttribute("data-id");
        var rec = clipList().filter(function (c) { return c.id === id; })[0];
        if (!rec) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(rec.text).then(function () {
            row.classList.add("copied");
            setTimeout(function () { row.classList.remove("copied"); }, 700);
          }, function () { /* permission refused — silent no-op per spec */ });
        }
      });
    });
    var clr = $("#sbClipClear", body);
    if (clr) clr.addEventListener("click", function () { writeJSON(CLIP_KEY, []); paintClip(); });
  }
  var clip = window.sbRegisterPanel("sbClipOverlay", "sbClipClose", paintClip);

  /* ======================================================= 5. system health §6.6 */
  var fpsTimer = null, frames = 0, fpsValue = null, rafId = 0;

  function sampleFps() {
    frames = 0;
    var loop = function () { frames++; rafId = requestAnimationFrame(loop); };
    rafId = requestAnimationFrame(loop);
    fpsTimer = setInterval(function () {
      fpsValue = frames * 2;      /* 500 ms window */
      frames = 0;
      var el = $("#sbDiagFps");
      if (el) el.textContent = fpsValue + " fps";
    }, 500);
  }
  function stopFps() {
    if (fpsTimer) { clearInterval(fpsTimer); fpsTimer = null; }
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  }

  function bytes(n) {
    if (!isFinite(n)) return "—";
    var u = ["B", "KB", "MB", "GB"], i = 0;
    while (n >= 1024 && i < u.length - 1) { n /= 1024; i++; }
    return (i ? n.toFixed(1) : Math.round(n)) + " " + u[i];
  }

  function paintDiag() {
    var body = panelBody("sbDiagOverlay");
    if (!body) return;
    var mem = (window.performance && window.performance.memory) ? window.performance.memory : null;
    var errs = window.__sbDiagErrors || [];
    var openCount = Object.keys(window.openWindows || {}).length;
    var rows = [
      ["Frame rate", '<span id="sbDiagFps">sampling…</span>'],
      /* Обои умеют сами понижать себе качество на слабом устройстве. Система,
         тихо меняющая себя и не говорящая об этом, — ровно то, что доктрина
         §5 запрещает. Строка ниже и есть это признание: она показывает
         ступень и настоящий размер буфера, а не слово «оптимизировано». */
      ["Wallpaper quality", (function () {
        if (!window.sbField || !window.sbField.tier) return "—";
        var t = window.sbField.tier();
        var name = t.tier === 0 ? "full" : t.tier === 1 ? "half rate" : "reduced";
        return esc(name + " · buffer " + t.buffer + "px · " + Math.round(1000 / t.step) + " draws/s" +
                   (t.forced > 0 ? " · lowered by this device" : ""));
      })()],
      ["JS heap", mem ? (bytes(mem.usedJSHeapSize) + " / " + bytes(mem.jsHeapSizeLimit)) : "not exposed by this browser"],
      ["Storage", '<span id="sbDiagStore">measuring…</span>'],
      ["Open windows", String(openCount)],
      ["CSS fullscreen", $(".window.fullscreen") ? "yes" : "no"],
      ["Browser fullscreen", doc.fullscreenElement ? "yes" : "no"],
      ["Viewport", window.innerWidth + " × " + window.innerHeight],
      ["Screen", (screen.width || 0) + " × " + (screen.height || 0)],
      ["Errors this session", String(errs.length)],
      ["User agent", navigator.userAgent]
    ];
    body.innerHTML = '<div class="panel-scroll">' +
      rows.map(function (r) { return '<div class="kv-row wide"><span class="kv-k">' + esc(r[0]) + '</span><span class="kv-v">' + r[1] + "</span></div>"; }).join("") +
      '<h4 class="panel-sub">Recent errors</h4>' +
      (errs.length ? errs.slice(-10).reverse().map(function (e) {
        return '<div class="diag-err"><code>' + esc(e.where || "") + "</code> " + esc(e.message || "") + "</div>";
      }).join("") : '<p class="panel-empty">None</p>') +
      "</div>" +
      '<div class="panel-foot"><span class="foot-note">' + esc(tr("h.measured")) + '</span>' +
      '<button class="btn ghost" type="button" id="sbDiagCopy">Copy report</button></div>';

    if (navigator.storage && navigator.storage.estimate) {
      navigator.storage.estimate().then(function (est) {
        var el = $("#sbDiagStore");
        if (el) el.textContent = bytes(est.usage || 0) + " of " + bytes(est.quota || 0);
      }, function () {
        var el = $("#sbDiagStore");
        if (el) el.textContent = "not exposed by this browser";
      });
    } else {
      var se = $("#sbDiagStore");
      if (se) se.textContent = "not exposed by this browser";
    }

    var copy = $("#sbDiagCopy", body);
    if (copy) {
      copy.addEventListener("click", function () {
        var text = rows.map(function (r) {
          var v = r[1].indexOf("<") === 0 ? (r[0] === "Frame rate" ? (fpsValue == null ? "sampling" : fpsValue + " fps") : "measured in panel") : r[1];
          return r[0] + ": " + v;
        }).join("\n") + "\n\nErrors:\n" + (errs.length ? errs.slice(-10).map(function (e) { return (e.where || "") + " " + (e.message || ""); }).join("\n") : "none");
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            if (window.showToast) window.showToast("Copied", "Diagnostics are on your clipboard.", "");
          }, function () { /* silent */ });
        }
      });
    }
    stopFps();
    sampleFps();
  }
  var diag = window.sbRegisterPanel("sbDiagOverlay", "sbDiagClose", paintDiag);
  if (diag) diag.onClose = stopFps;

  /* =================================================== 6. workspace layouts §6.8 */
  var LAYOUTS_KEY = "sysbaby.layouts";
  function layoutList() { var v = readJSON(LAYOUTS_KEY, []); return Array.isArray(v) ? v : []; }

  function paintLayouts() {
    var body = panelBody("sbLayoutsOverlay");
    if (!body) return;
    var apps = (window.SysBaby && window.SysBaby.apps) || {};
    var list = layoutList();
    body.innerHTML = '<div class="panel-scroll">' +
      (list.length ? list.map(function (L, idx) {
        var tiles = (L.windows || []).slice(0, 4).map(function (w) {
          var def = apps[w.id] || {};
          return '<span class="lay-tile" style="background:' + esc(def.color || "#334") + '"></span>';
        }).join("");
        return '<div class="task-row" data-idx="' + idx + '"><span class="lay-tiles">' + tiles + "</span>" +
          '<span class="task-name">' + esc(L.name) + "</span>" +
          '<span class="task-sub">' + esc(tr("p.windowsCount", { n: (L.windows || []).length })) + esc(timeAgo(L.ts)) + "</span>" +
          '<button class="btn tiny" type="button" data-act="restore">' + esc(tr("p.restore")) + '</button>' +
          '<button class="task-x" type="button" data-act="del" aria-label="' + esc(tr("p.delete")) + '">✕</button></div>';
      }).join("") : '<p class="panel-empty">' + esc(tr("p.noLayouts")) + "</p>") + "</div>" +
      '<div class="panel-foot"><span class="foot-note">' + esc(tr("p.layoutsNote")) + '</span>' +
      '<button class="btn" type="button" id="sbLayoutSave">' + esc(tr("p.saveCurrent")) + '</button></div>';

    $$(".task-row", body).forEach(function (row) {
      row.addEventListener("click", function (ev) {
        var idx = num(row.getAttribute("data-idx"), -1);
        var act = ev.target && ev.target.getAttribute ? ev.target.getAttribute("data-act") : null;
        var list2 = layoutList();
        if (idx < 0 || !list2[idx]) return;
        if (act === "del") { list2.splice(idx, 1); writeJSON(LAYOUTS_KEY, list2); paintLayouts(); return; }
        restoreLayout(list2[idx]);
        layouts.close();
      });
    });
    var save = $("#sbLayoutSave", body);
    if (save) save.addEventListener("click", saveLayout);
  }

  function saveLayout() {
    var rects = window.sbGetWindowRects ? window.sbGetWindowRects() : [];
    if (!rects.length) {
      if (window.showToast) window.showToast("Nothing to save", "Open a window or two first.", "");
      return;
    }
    var list = layoutList();
    list.unshift({ name: "Layout " + (list.length + 1), ts: Date.now(), windows: rects });
    writeJSON(LAYOUTS_KEY, list.slice(0, 12));
    paintLayouts();
    if (window.showToast) window.showToast("Layout saved", rects.length + " window" + (rects.length === 1 ? "" : "s") + " remembered.", "");
  }
  window.sbSaveWorkspaceLayout = saveLayout;

  function restoreLayout(L) {
    (L.windows || []).forEach(function (w) {
      var open = (window.openWindows || {})[w.id];
      if (open) { if (window.sbPlaceWindow) window.sbPlaceWindow(w.id, w); return; }
      if (window.toggleApp) window.toggleApp(w.id);
      setTimeout(function () { if (window.sbPlaceWindow) window.sbPlaceWindow(w.id, w); }, 520);
    });
    if (window.showToast) window.showToast("Layout restored", esc(L.name) + " is back on screen.", "");
  }

  var layouts = window.sbRegisterPanel("sbLayoutsOverlay", "sbLayoutsClose", paintLayouts);

  /* =================================================== 7. desktop manager §6.9 */
  function paintDesktopMgr() {
    var body = panelBody("sbWidgetsOverlay");
    if (!body) return;
    var apps = (window.SysBaby && window.SysBaby.apps) || {};
    var hiddenIcons = window.sbGetHiddenIcons ? window.sbGetHiddenIcons() : [];
    var iconIds = (window.sbLaunchableApps ? window.sbLaunchableApps() : []).filter(function (id) { return apps[id] && apps[id].desktopIcon !== false; });

    body.innerHTML = '<div class="panel-scroll">' +
      '<h4 class="panel-sub">' + esc(tr("p.appIcons")) + "</h4>" +
      iconIds.map(function (id) {
        var def = apps[id], off = hiddenIcons.indexOf(id) !== -1;
        return '<div class="task-row" data-kind="icon" data-id="' + esc(id) + '">' +
          '<span class="task-tile" style="background:' + esc(def.color || "#334") + '"></span>' +
          '<span class="task-name">' + esc(appLabel(id)) + "</span>" +
          '<span class="task-sub">' + esc(off ? tr("p.removedFromDesktop") : tr("p.onDesktop")) + "</span>" +
          '<button class="btn tiny" type="button">' + esc(off ? tr("p.add") : tr("p.remove")) + "</button></div>";
      }).join("") +
      "</div>" +
      '<div class="panel-foot"><span class="foot-note">' + esc(tr("p.keepsSpot")) + '</span></div>';

    $$(".task-row", body).forEach(function (row) {
      row.addEventListener("click", function () {
        var id = row.getAttribute("data-id"), kind = row.getAttribute("data-kind");
        if (kind === "icon" && window.sbSetIconHidden) {
          var offNow = (window.sbGetHiddenIcons() || []).indexOf(id) !== -1;
          window.sbSetIconHidden(id, !offNow);
        }
        paintDesktopMgr();
      });
    });
  }
  var deskMgr = window.sbRegisterPanel("sbWidgetsOverlay", "sbWidgetsClose", paintDesktopMgr);
  if (window.sbBus) {
    window.sbBus.on("icon:visibility", function () { if (deskMgr && deskMgr.isOpen()) paintDesktopMgr(); });
  }

  /* ================================================== 8. incognito gate §6.5 */
  function sha256Hex(text) {
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      try {
        return window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(function (buf) {
          return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
        });
      } catch (e) { /* fall through */ }
    }
    /* non-cryptographic fallback — gates casual access only, and says so */
    var h = 0, i;
    for (i = 0; i < text.length; i++) { h = ((h << 5) - h + text.charCodeAt(i)) | 0; }
    return Promise.resolve("fallback:" + (h >>> 0).toString(16));
  }

  function rawGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function rawSet(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }

  function paintIncog() {
    var body = panelBody("sbIncogOverlay");
    if (!body) return;
    var inside = !!window.sbIncognitoActive;
    var title = $("#sbIncogTitle");
    var hasHash = !!rawGet("sysbaby.incognito.pwhash");

    if (inside) {
      if (title) title.textContent = "The hidden desktop";
      body.innerHTML = '<div class="panel-scroll"><p class="panel-copy">You are inside the hidden desktop. Nothing written here is exported, snapshotted or shared with your normal space.</p>' +
        '<p class="panel-copy dim">Closing the tab always wipes this space instantly, on top of this.</p></div>' +
        '<div class="panel-foot"><button class="btn" type="button" id="sbIncogExit">Exit Incognito</button></div>';
      var exit = $("#sbIncogExit", body);
      if (exit) exit.addEventListener("click", function () {
        try { sessionStorage.removeItem("sysbaby.space"); sessionStorage.removeItem("sysbaby.incognito.timerSec"); } catch (e) { /* ignore */ }
        location.reload();
      });
      return;
    }

    if (title) title.textContent = hasHash ? "The hidden desktop" : "Seal the hidden desktop";
    var pref = rawGet("sysbaby.incognito.timerPref") || "600";
    body.innerHTML = '<div class="panel-scroll">' +
      '<p class="panel-copy">A second desktop with its own storage. Nothing crosses between the two. The word you choose cannot be recovered — if you forget it, that space is gone.</p>' +
      '<label class="field"><span>Passphrase</span><input type="password" id="sbIncogPw" autocomplete="off" minlength="4" /></label>' +
      (hasHash ? "" : '<label class="field"><span>Confirm</span><input type="password" id="sbIncogPw2" autocomplete="off" /></label>') +
      '<label class="field"><span>Self-destruct after idle</span><select id="sbIncogTimer">' +
      [["0", "Never"], ["300", "5 min"], ["900", "15 min"], ["1800", "30 min"], ["3600", "60 min"]].map(function (o) {
        return '<option value="' + o[0] + '"' + (o[0] === pref ? " selected" : "") + ">" + esc(o[1]) + "</option>";
      }).join("") + "</select></label>" +
      '<p class="panel-copy dim">Closing the tab always wipes this space instantly, on top of this.</p>' +
      '<p class="panel-err" id="sbIncogErr"></p></div>' +
      '<div class="panel-foot"><button class="btn" type="button" id="sbIncogGo">' + (hasHash ? "Enter" : "Seal it") + "</button></div>";

    var go = $("#sbIncogGo", body);
    if (go) go.addEventListener("click", function () {
      var pw = ($("#sbIncogPw", body) || {}).value || "";
      var err = $("#sbIncogErr", body);
      var timer = ($("#sbIncogTimer", body) || {}).value || "600";
      if (pw.length < 4) { if (err) err.textContent = "At least 4 characters."; return; }
      if (!hasHash) {
        var pw2 = ($("#sbIncogPw2", body) || {}).value || "";
        if (pw !== pw2) { if (err) err.textContent = "Those two don't match."; return; }
      }
      sha256Hex("sysbaby::" + pw).then(function (hex) {
        if (hasHash) {
          if (rawGet("sysbaby.incognito.pwhash") !== hex) { if (err) err.textContent = "Incorrect password."; return; }
        } else {
          rawSet("sysbaby.incognito.pwhash", hex);
        }
        rawSet("sysbaby.incognito.timerPref", timer);
        try {
          sessionStorage.setItem("sysbaby.space", "incognito");
          sessionStorage.setItem("sysbaby.incognito.timerSec", timer);
        } catch (e) { if (err) err.textContent = "This browser blocks session storage."; return; }
        location.reload();
      });
    });
  }
  var incog = window.sbRegisterPanel("sbIncogOverlay", "sbIncogClose", paintIncog);
  window.sbOpenIncognitoGate = function () { if (incog) incog.open(); };

  /* self-destruct (inside the space only) */
  (function selfDestruct() {
    if (!window.sbIncognitoActive) return;
    var sec = 0;
    try { sec = num(sessionStorage.getItem("sysbaby.incognito.timerSec"), 0); } catch (e) { sec = 0; }
    if (!(sec > 0)) return;
    var badge = doc.createElement("div");
    badge.id = "sbIncogBadge";
    badge.className = "fixed-badge";
    doc.body.appendChild(badge);
    var deadline = Date.now() + sec * 1000;
    function reset() { deadline = Date.now() + sec * 1000; }
    ["pointerdown", "keydown", "wheel", "touchstart"].forEach(function (e) { doc.addEventListener(e, reset, true); });
    var tick = setInterval(function () {
      var left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      var m = Math.floor(left / 60), s = left % 60;
      badge.textContent = m + ":" + (s < 10 ? "0" : "") + s;
      badge.classList.toggle("urgent", left <= 30);
      if (left <= 0) {
        clearInterval(tick);
        try { localStorage.clear(); } catch (e) { /* facade */ }
        try { sessionStorage.removeItem("sysbaby.space"); sessionStorage.removeItem("sysbaby.incognito.timerSec"); } catch (e) { /* ignore */ }
        location.reload();
      }
    }, 1000);
    window.sbIncognitoSelfDestruct = { reset: reset, seconds: function () { return Math.max(0, Math.round((deadline - Date.now()) / 1000)); } };
  })();

  /* ══════ ЗАМОК БЕРЕЖЁТ И СЕАНС · решение D-254 ═════════════════════════════
     Дыра из описи (zamok-ne-berezhet-seans): человек, отошедший от открытой
     вкладки, был защищён только самой вкладкой — всё расшифрованное жило в
     памяти, пока вкладку не закроют. В описи стояло оправдание: закрыть
     значило бы перешифровывать на каждое действие. Это было неправдой: замок
     и так запечатывает каждую запись в тот же миг (scheduleSeal в store.js),
     а «Запереть сейчас» — просто перезагрузка, потому что ключи живут только
     в памяти. Значит, сеанс без движения закрывается той же ценой.
     ДВИЖЕНИЕ — это нажатие, клавиша, колесо, касание. Срок спрашивается у
     хранилища; ноль — «никогда». Возврат во вкладку тоже сверяет счёт: в
     спрятанной вкладке браузер таймеры усыпляет, и без этой сверки человек,
     вернувшийся через час, застал бы сеанс открытым.
     Охраняется tools/idle-lock-check.mjs. */
  (function idleLock() {
    var V = window.sbVault;
    var KEY = "sysbaby.lock.idleMin", DEFAULT = 15;
    function minutes() {
      var raw = window.sbDB ? window.sbDB.get(KEY) : null;
      /* Пустое место — не ноль: ноль здесь значит «никогда», а пусто — «как
         по умолчанию». Number(null) даёт 0, и без этой строки пустое
         хранилище выключало бы замок покоя молча. */
      if (raw == null || raw === "") return DEFAULT;
      var m = num(raw, NaN);
      return (isFinite(m) && m >= 0) ? m : DEFAULT;
    }
    var last = Date.now();
    function touch() { last = Date.now(); }
    var EVENTS = ["pointerdown", "keydown", "wheel", "touchstart"];
    EVENTS.forEach(function (e) { doc.addEventListener(e, touch, true); });
    /* ── ДВИЖЕНИЕ ВНУТРИ ОКНА-РАМКИ ТОЖЕ ДВИЖЕНИЕ (D-254, поправка v159) ────
       ПОВОД. Пока экран входа стоял поверх стола, его карточка ловила все
       клики — и замок покоя «сбрасывался» ими случайно. Как только вход стали
       честно убирать со стола (D-306), обнажилась рамка приложения «build»
       (iframe): клик ВНУТРЬ неё уходит в её собственный документ и до сторожа
       на родителе не доходит. Человек мог работать в приложении, а замок —
       считать его ушедшим и запереться под руками. Рамка своего происхождения,
       значит её документ нам доступен: вешаем на него тот же сторож. Чужую
       рамку не трогаем — доступа к ней нет, и это правильно. */
    var HDOC = "__sbIdleDoc";
    function hookFrame(fr) {
      try {
        if (!fr) return;
        var d = fr.contentDocument;
        if (!d || fr[HDOC] === d) return;     /* нет доступа, или этот документ уже под сторожем */
        /* Документ рамки меняется при её загрузке: сначала пустой, потом
           настоящий. Сравниваем по документу, а не по флагу на рамке, — иначе
           сторож остаётся на выброшенном пустом документе. */
        EVENTS.forEach(function (e) { d.addEventListener(e, touch, true); });
        fr[HDOC] = d;
      } catch (e) { /* чужое происхождение — недоступно, и не наше дело */ }
    }
    function hookFrames() {
      var frames = doc.getElementsByTagName("iframe"), i;
      for (i = 0; i < frames.length; i++) hookFrame(frames[i]);
    }
    doc.addEventListener("load", function (ev) {
      if (ev.target && ev.target.tagName === "IFRAME") hookFrame(ev.target);
    }, true);
    if (typeof window.MutationObserver === "function") {
      try { new MutationObserver(hookFrames).observe(doc.documentElement, { childList: true, subtree: true }); }
      catch (e) { /* без наблюдателя обойдёмся опросом в check() */ }
    }
    hookFrames();
    function shut() {
      if (window.sbDB && window.sbDB.flushSync) { try { window.sbDB.flushSync(); } catch (e) { /* ignore */ } }
      location.reload();
    }
    function check() {
      hookFrames();                           /* рамки, появившиеся с тех пор */
      if (!V || !V.isLocked() || !V.isOpen()) return;
      var m = minutes();
      if (!(m > 0)) return;
      if (Date.now() - last >= m * 60000) shut();
    }
    setInterval(check, 15000);
    doc.addEventListener("visibilitychange", function () { if (doc.visibilityState === "visible") check(); });
    window.sbIdleLock = {
      minutes: minutes,
      set: function (m) {
        m = num(m, DEFAULT);
        if (window.sbDB) window.sbDB.set(KEY, String(m < 0 ? 0 : m));
        touch();
      },
      idleFor: function () { return Date.now() - last; }
    };
  })();

  /* ============================================================ bare keys */
  doc.addEventListener("keydown", function (ev) {
    if (!window.sbBareKeyOk || !window.sbBareKeyOk(ev)) return;
    if (ev.key === "?" && shortcuts) { ev.preventDefault(); shortcuts.open(); return; }
    if (ev.key === "w" && tasks) { ev.preventDefault(); tasks.open(); }
  });



  /* ══════ ОКНО АККАУНТА · решения D-173, D-174, D-172, D-181 ═══════════════
     Одно окно на всё, что есть «я» в этой системе: кто я, чем закрыт, куда
     ложатся копии и как отсюда уйти. Раньше это жило в трёх местах — правка
     имени в самой полосе, замок отдельным окном, выгрузка в быстрой панели, —
     и человек, искавший «мои настройки», не находил их нигде целиком.
     Основатель, 27.08.2026: «необходимо совместить иконку аккаунта и иконку
     шифрования в одно целое а информацию о шифровании перенести в окно
     аккаунта — так будет правильнее». Совет согласен и по существу: замок —
     не вещь рядом с человеком, а его свойство.
     Охраняется tools/vanish-check.mjs и tools/backup-sync-check.mjs. */

  function cipherLine() {
    var c = window.sbVault && window.sbVault.cipher ? window.sbVault.cipher() : null;
    if (!c) return "";
    return [(c.ciphers || []).join("  →  "), c.mac, (c.kdf || []).join("  →  "),
      "padding " + (c.pad || 256) + " B", c.names ? "names " + c.names : ""]
      .filter(Boolean).join("\n");
  }

  /* Срок покоя стоит рядом с замком, потому что это свойство замка (D-254).
     Варианты — минуты; ноль — «никогда». Текущее значение спрашивается у
     системы, а не помнится окном. */
  var IDLE_CHOICES = [0, 5, 15, 60];
  function idleLabel(m) {
    if (!(m > 0)) return tr("lock.idle.never");
    if (m >= 60) return tr("lock.idle.hour", { n: Math.round(m / 60) });
    return tr("lock.idle.min", { n: m });
  }
  function idleRow() {
    if (!window.sbIdleLock) return "";
    var cur = window.sbIdleLock.minutes();
    var choices = IDLE_CHOICES.indexOf(cur) === -1 ? IDLE_CHOICES.concat([cur]).sort(function (a, b) { return a - b; }) : IDLE_CHOICES;
    var opts = choices.map(function (m) {
      return '<option value="' + m + '"' + (m === cur ? " selected" : "") + ">" + esc(idleLabel(m)) + "</option>";
    }).join("");
    return '<label class="lock-idle"><span class="panel-copy">' + esc(tr("lock.idle")) + "</span>" +
      '<select id="sbLockIdle" aria-label="' + esc(tr("lock.idle")) + '">' + opts + "</select></label>" +
      '<p class="panel-copy dim">' + esc(tr("lock.idleWhat")) + "</p>";
  }

  /* ── ЧТО ОСТАЁТСЯ ОТКРЫТЫМ, СКАЗАНО ВСЛУХ (D-265) ─────────────────────
     В описи дыр стояло «под замком прячутся вещи, но не выбор — человек может
     думать, что спрятано всё». Замер D-265 показал, что выбор (язык, обои,
     настройки) спрятан на ВСЕХ полках диска. Но «спрятано всё» и тогда не
     правда: остаётся запись замка, номер профиля, отметка входа и указатель
     на папку копий. Список не пишется здесь — он спрашивается у замка
     (neverLocked) и у копий (hasFolder); здесь только человеческие слова. */
  /* Строка стука в окне замка (D-341): последние стуки и честная граница. */
  function knockLine() {
    var K = window.sbKnock;
    if (!K) return "";
    var list = K.last();
    var text = list.length ? tr("knock.line", { n: list.length, when: knockWhen(list[list.length - 1]) }) : tr("knock.lineNone");
    return '<p class="panel-copy dim" id="sbKnockLine">' + esc(text + " " + tr("knock.limit", { max: K.max })) + "</p>";
  }
  function staysList(V) {
    var keys = [];
    try { keys = V.neverLocked ? V.neverLocked() : []; } catch (e) { keys = []; }
    var items = keys.map(function (k) {
      var w = tr("lock.stays." + k);
      return w === "lock.stays." + k ? k : w;
    });
    try { if (window.sbBackup && window.sbBackup.hasFolder && window.sbBackup.hasFolder()) items.push(tr("lock.stays.folder")); } catch (e) { /* ignore */ }
    if (!items.length) return "";
    return '<p class="panel-copy dim">' + esc(tr("lock.stays")) + "</p>" +
      '<ul class="lock-stays">' + items.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
  }

  /* ── РАЗДЕЛ «ЗАМОК» ─────────────────────────────────────────────────────── */
  /* Правдивая строка о ключе устройства (D-310): «этого устройства» или
     «аккаунта, который копируется», по флагу, снятому при привязке. */
  function hwStateLine(V) {
    var h = V.hwState();
    if (!h.on) return h.can ? tr("lock.hwNone") : tr("lock.hwCant");
    if (h.synced === true) return tr("lock.hwOnAccount");
    if (h.synced === false) return tr("lock.hwOnDevice");
    return tr("lock.hwOn");
  }
  function lockSection() {
    var V = window.sbVault;
    if (!V) return "";
    if (!V.available()) {
      /* Замка нет — и сказано, ПОЧЕМУ. Чаще всего причина видна в адресной
         строке: страница открыта по http, а по нему браузер криптографию не
         даёт вовсе (D-178). Молчание оставило бы человека думать, что замок
         сломан, — а он просто не может здесь существовать. */
      return '<h4 class="panel-sub">' + esc(tr("lock.title")) + "</h4>" +
        '<p class="lock-warn">' + esc(tr("lock.insecure")) + "</p>";
    }
    var locked = V.isLocked();
    var head = '<h4 class="panel-sub">' + esc(tr("lock.title")) + "</h4>" +
      '<div class="lock-state' + (locked ? "" : " off") + '"><span class="lk-dot"></span><span>' +
      esc(locked ? tr("lock.state.armed") : tr("lock.state.none")) + "</span></div>" +
      '<p class="panel-copy">' + esc(tr("lock.what")) + "</p>" +
      '<p class="panel-copy dim">' + esc(tr("lock.accounts")) + "</p>" +
      (locked ? staysList(V) : "") +
      (locked ? knockLine() : "") +
      '<pre class="lock-cipher">' + esc(cipherLine()) + "</pre>" +
      '<p class="lock-warn">' + esc(tr("lock.warn")) + "</p>";
    /* ── ФАЙЛ ВТОРОГО КЛЮЧА — ТАМ ЖЕ, ГДЕ СЛОВО (D-266) ──────────────────
       Прежде окно звало смену слова, тревожное слово и снятие замка БЕЗ файла,
       и человек со вторым ключом на верное слово слышал «неверный пароль» —
       ложь, от которой не было выхода. Поле стоит только у замка, который
       его требует: что такой замок есть, и так видно на диске. */
    var needsKey = false;
    try { needsKey = !!(V.secondKey && V.secondKey().on); } catch (e) { needsKey = false; }
    var keyRow = needsKey
      ? '<label class="lock-keyfile"><span class="panel-copy">' + esc(tr("lock.keyFile")) + '</span><input type="file" id="sbLockKeyFile"></label>' +
        '<p class="panel-copy dim">' + esc(tr("lock.keyFileWhat")) + "</p>"
      : "";
    /* Код восстановления: есть ли он — спрашивается у замка открытого
       сеанса, а не помнится окном; в тревожном мире ответ свой. */
    var spare = null;
    try { spare = V.recoveryState ? V.recoveryState() : null; } catch (e) { spare = null; }
    var spareLine = spare && spare.at
      ? tr("lock.spareOn", { d: new Date(spare.at).toLocaleDateString() })
      : tr("lock.spareNone");
    var spareRow = V.recoveryMake
      ? '<h4 class="panel-sub">' + esc(tr("lock.spare")) + "</h4>" +
        '<p class="panel-copy dim">' + esc(tr("lock.spareWhat")) + "</p>" +
        '<p class="panel-copy" id="sbLockSpareState">' + esc(spareLine) + "</p>" +
        '<div class="lock-spare-out" id="sbLockSpareOut" hidden>' +
          '<pre class="lock-spare-code" id="sbLockSpareCode" data-sb-nolang></pre>' +
          '<p class="lock-warn">' + esc(tr("lock.spareDone")) + "</p>" +
          /* Бумага — первой (D-332): лист не оставляет в системе ничего, файл — оставляет. */
          '<div class="lock-acts"><button type="button" class="btn ghost" id="sbLockSparePrint">' + esc(tr("lock.sparePrint")) + "</button>" +
            '<button type="button" class="btn ghost" id="sbLockSpareSave">' + esc(tr("lock.spareSave")) + "</button></div>" +
        "</div>"
      : "";
    return head + (locked
      ? '<div class="lock-field">' +
          '<input type="password" id="sbLockCur" autocomplete="current-password" placeholder="' + esc(tr("lock.old")) + '" aria-label="' + esc(tr("lock.old")) + '">' +
          '<input type="password" id="sbLockNew" autocomplete="new-password" hidden placeholder="' + esc(tr("lock.new")) + '" aria-label="' + esc(tr("lock.new")) + '">' +
        "</div>" +
        '<div class="lock-field">' +
          '<input type="password" id="sbLockDuress" autocomplete="new-password" hidden placeholder="' + esc(tr("lock.duressField")) + '" aria-label="' + esc(tr("lock.duressField")) + '">' +
        "</div>" +
        /* НИ ОДНОЙ НАДПИСИ О ТОМ, ЗАВЕДЕНО ЛИ ВТОРОЕ СЛОВО. Кнопки стоят
           всегда и выглядят одинаково при любом состоянии замка: панель,
           умеющая показать «тревожное слово установлено», сама и есть
           утечка, ради предотвращения которой всё это построено. */
        keyRow +
        '<p class="panel-copy dim">' + esc(tr("lock.duressWhat")) + "</p>" +
        /* Честная строка о пределе тревожного слова (D-310). */
        '<p class="panel-copy dim">' + esc(tr("lock.duressCant")) + "</p>" +
        /* ── УСИЛЕНИЕ ПАМЯТЬЮ (D-275) — только у замка прежней цены. Что он
           прежней цены, видно в записи замка и так (строка шифра выше). */
        (V.strengthen && V.strong && !V.strong() ? '<p class="panel-copy dim" id="sbLockStrongWhat">' + esc(tr("lock.strongWhat")) + "</p>" : "") +
        /* ── КЛЮЧ УСТРОЙСТВА (D-276) — привязка и снятие. Что замок его
           спрашивает, видно в записи замка и так; строка это называет. */
        (V.hwState ? '<h4 class="panel-sub">' + esc(tr("lock.hw")) + "</h4>" +
          '<p class="panel-copy dim">' + esc(tr("lock.hwWhat")) + "</p>" +
          '<p class="panel-copy" id="sbLockHwState">' + esc(hwStateLine(V)) + "</p>" : "") +
        idleRow() +
        /* Что пропадёт при снятии замка — сказано до нажатия (D-350). Строка
           одна при любом состоянии замка: есть ли второй мир, она не говорит. */
        '<p class="panel-copy dim" id="sbLockRemoveWhat">' + esc(tr("lock.removeWhat")) + "</p>" +
        '<div class="lock-acts">' +
          '<button type="button" class="btn ghost" id="sbLockChange">' + esc(tr("lock.change")) + "</button>" +
          (V.strengthen && V.strong && !V.strong() ? '<button type="button" class="btn ghost" id="sbLockStrong">' + esc(tr("lock.strong")) + "</button>" : "") +
          (V.hwState && V.hwState().can && !V.hwState().on ? '<button type="button" class="btn ghost" id="sbLockHwAdd">' + esc(tr("lock.hwAdd")) + "</button>" : "") +
          (V.hwState && V.hwState().on ? '<button type="button" class="btn ghost" id="sbLockHwOff">' + esc(tr("lock.hwOff")) + "</button>" : "") +
          '<button type="button" class="btn ghost" id="sbLockSpare">' + esc(tr("lock.spare")) + "</button>" +
          '<button type="button" class="btn ghost" id="sbLockDuressSet">' + esc(tr("lock.duress")) + "</button>" +
          '<button type="button" class="btn ghost" id="sbLockDuressOff">' + esc(tr("lock.duressOff")) + "</button>" +
          '<button type="button" class="btn ghost" id="sbLockRemove">' + esc(tr("lock.remove")) + "</button>" +
          '<button type="button" class="btn primary" id="sbLockNow">' + esc(tr("lock.now")) + "</button>" +
        "</div>" + spareRow
      : '<div class="lock-field">' +
          '<input type="password" id="sbLockP1" autocomplete="new-password" placeholder="' + esc(tr("lock.new")) + '" aria-label="' + esc(tr("lock.new")) + '">' +
          '<input type="password" id="sbLockP2" autocomplete="new-password" placeholder="' + esc(tr("lock.again")) + '" aria-label="' + esc(tr("lock.again")) + '">' +
        "</div>" +
        /* ── ФРАЗА И ЧЕСТНАЯ ЦЕНА КОРОТКОГО СЛОВА (D-309) ───────────────────── */
        (V.phrase ? '<p class="panel-copy dim">' + esc(tr("lock.phraseHint")) + "</p>" +
          '<div class="lock-acts"><button type="button" class="btn ghost" id="sbLockPhrase">' + esc(tr("lock.phrase")) + "</button></div>" +
          '<p class="lock-phrase" id="sbLockPhraseOut" hidden data-sb-nolang></p>' : "") +
        '<p class="lock-warn" id="sbLockWeak" hidden>' + esc(tr("lock.weakWarn")) + "</p>" +
        '<div class="lock-acts">' +
          '<button type="button" class="btn primary" id="sbLockDo">' + esc(tr("lock.set")) + "</button>" +
          '<button type="button" class="btn ghost" id="sbLockDoAnyway" hidden>' + esc(tr("lock.setAnyway")) + "</button>" +
        "</div>");
  }

  function wireLockBody(body) {
    var V = window.sbVault;
    if (!V) return;
    var err = body.querySelector("#sbAccErr");
    function say(m) { if (err) err.textContent = m || ""; }
    function busy(on) {
      body.querySelectorAll("button").forEach(function (b) { b.disabled = !!on; });
      if (on) say(tr("lock.busy"));
    }
    /* Файл второго ключа читается ДО вызова: чтение с диска не должно
       попадать в цену попытки (тот же довод, что у двери замка). */
    function keyBytes() {
      var inp = body.querySelector("#sbLockKeyFile");
      var f = inp && inp.files && inp.files[0];
      if (!f) return Promise.resolve(null);
      return f.arrayBuffer().then(function (b) { return new Uint8Array(b); }, function () { return null; });
    }
    var phraseBtn = body.querySelector("#sbLockPhrase");
    if (phraseBtn && V.phrase) phraseBtn.addEventListener("click", function () {
      var words = V.phrase(6) || [];
      if (!words.length) return;
      var phrase = words.join(" ");
      var p1 = body.querySelector("#sbLockP1"), p2 = body.querySelector("#sbLockP2");
      if (p1) p1.value = phrase;
      if (p2) p2.value = phrase;
      var out = body.querySelector("#sbLockPhraseOut");
      if (out) { out.textContent = phrase; out.hidden = false; }
      var weak = body.querySelector("#sbLockWeak"); if (weak) weak.hidden = true;
      var anyway = body.querySelector("#sbLockDoAnyway"); if (anyway) anyway.hidden = true;
      say("");
    });
    /* Слабое слово не запирается молча (D-309): первая попытка показывает
       предупреждение и «всё равно», запирает — только она. Заперто — значит
       заперто с этого мига (D-166): setLock перезагружает страницу. */
    var doBtn = body.querySelector("#sbLockDo");
    var anywayBtn = body.querySelector("#sbLockDoAnyway");
    function setLock(p1) {
      busy(true);
      V.lock(p1).then(function () { window.location.reload(); }, function () { busy(false); say(tr("lock.failed")); });
    }
    function trySet(force) {
      var p1 = body.querySelector("#sbLockP1").value;
      var p2 = body.querySelector("#sbLockP2").value;
      if (String(p1).length < 4) { say(tr("lock.short")); return; }
      if (p1 !== p2) { say(tr("lock.mismatch")); return; }
      if (!force && V.weakWord && V.weakWord(p1)) {
        var weak = body.querySelector("#sbLockWeak"); if (weak) weak.hidden = false;
        /* «Всё равно» встаёт в поле зрения и принимает фокус (D-343). На
           телефоне она появлялась ниже края окна аккаунта, и каждое следующее
           «Запереть всё» показывало то же самое: «нажимаю — ничего не
           происходит» (телефон основателя, 29.09.2026). */
        if (anywayBtn) {
          anywayBtn.hidden = false;
          anywayBtn.scrollIntoView({ block: "nearest" });
          anywayBtn.focus({ preventScroll: true });
        }
        return;
      }
      setLock(p1);
    }
    if (doBtn) doBtn.addEventListener("click", function () { trySet(false); });
    if (anywayBtn) anywayBtn.addEventListener("click", function () { trySet(true); });
    var changeBtn = body.querySelector("#sbLockChange");
    var newField = body.querySelector("#sbLockNew");
    if (changeBtn && newField) changeBtn.addEventListener("click", function () {
      if (newField.hidden) { newField.hidden = false; newField.focus(); say(""); return; }
      var cur = body.querySelector("#sbLockCur").value;
      var nw = newField.value;
      if (String(nw).length < 4) { say(tr("lock.short")); return; }
      busy(true);
      keyBytes().then(function (kb) { return V.rekey(cur, nw, kb); }).then(function (okp) {
        busy(false);
        if (!okp) { say(tr("lock.wrong")); return; }
        say(tr("lock.changed"));
        newField.value = ""; newField.hidden = true;
        body.querySelector("#sbLockCur").value = "";
        if (window.sbPaintIris) window.sbPaintIris();
      }, function () { busy(false); say(tr("lock.failed")); });
    });
    var dField = body.querySelector("#sbLockDuress");
    var dSet = body.querySelector("#sbLockDuressSet");
    if (dSet && dField) dSet.addEventListener("click", function () {
      if (dField.hidden) { dField.hidden = false; dField.focus(); say(""); return; }
      var cur = body.querySelector("#sbLockCur").value;
      var dw = dField.value;
      if (String(dw).length < 4) { say(tr("lock.short")); return; }
      if (dw === cur) { say(tr("lock.duressSame")); return; }
      busy(true);
      keyBytes().then(function (kb) { return V.setDuress(cur, dw, kb); }).then(function (okp) {
        busy(false);
        if (!okp) { say(tr("lock.wrong")); return; }
        say(tr("lock.duressDone"));
        dField.value = ""; dField.hidden = true;
        body.querySelector("#sbLockCur").value = "";
      }, function () { busy(false); say(tr("lock.failed")); });
    });
    /* Усилить памятью: главное слово обязательно; тревожное — если заводили,
       иначе мир за ним будет потерян, и об этом сказано до нажатия. Первое
       нажатие открывает поле тревожного слова, второе — усиливает. */
    var strongBtn = body.querySelector("#sbLockStrong");
    if (strongBtn && V.strengthen) strongBtn.addEventListener("click", function () {
      var curEl = body.querySelector("#sbLockCur");
      var cur = curEl.value;
      if (String(cur).length < 4) { say(tr("lock.old")); curEl.focus(); return; }
      if (dField && dField.hidden) { dField.hidden = false; dField.focus(); say(tr("lock.strongAsk")); return; }
      var dw = dField ? dField.value : "";
      busy(true);
      keyBytes().then(function (kb) { return V.strengthen(cur, dw || null, kb); }).then(function (okp) {
        busy(false);
        if (!okp) { say(tr("lock.wrong")); return; }
        curEl.value = "";
        if (dField) { dField.value = ""; dField.hidden = true; }
        if (window.showToast) window.showToast(tr("lock.title"), tr("lock.strongDone"), "");
        accountBody();
      }, function (e) { busy(false); say(e && e.message === "duress-wrong" ? tr("lock.duressWrong") : tr("lock.failed")); });
    });
    /* Привязать и отвязать ключ устройства — тем же порядком, что усиление:
       главное слово обязательно, тревожное — если заводили. */
    function hwAction(btnId, run, doneKey) {
      var b = body.querySelector(btnId);
      if (!b) return;
      b.addEventListener("click", function () {
        var curEl = body.querySelector("#sbLockCur");
        var cur = curEl.value;
        if (String(cur).length < 4) { say(tr("lock.old")); curEl.focus(); return; }
        if (dField && dField.hidden) { dField.hidden = false; dField.focus(); say(tr("lock.strongAsk")); return; }
        var dw = dField ? dField.value : "";
        busy(true);
        keyBytes().then(function (kb) { return run(cur, kb, dw || null); }).then(function (okp) {
          busy(false);
          if (!okp) { say(tr("lock.wrong")); return; }
          curEl.value = "";
          if (dField) { dField.value = ""; dField.hidden = true; }
          if (window.showToast) window.showToast(tr("lock.hw"), tr(doneKey), "");
          accountBody();
        }, function (e) {
          busy(false);
          var m = e && e.message;
          say(m === "duress-wrong" ? tr("lock.duressWrong") : (m === "no-prf" || m === "no-webauthn") ? tr("lock.hwNoPrf") : tr("lock.hwFailed"));
        });
      });
    }
    if (V.hwEnroll) hwAction("#sbLockHwAdd", function (p, kb, d) { return V.hwEnroll(p, kb, d); }, "lock.hwDone");
    if (V.hwRemove) hwAction("#sbLockHwOff", function (p, kb, d) { return V.hwRemove(p, kb, d); }, "lock.hwRemoved");
    var dOff = body.querySelector("#sbLockDuressOff");
    if (dOff) dOff.addEventListener("click", function () {
      var cur = body.querySelector("#sbLockCur").value;
      busy(true);
      keyBytes().then(function (kb) { return V.clearDuress(cur, kb); }).then(function (okp) {
        busy(false);
        if (!okp) { say(tr("lock.wrong")); return; }
        /* Тот же ответ, что и при заведении: по надписи на экране нельзя
           узнать, было ли что снимать. */
        say(tr("lock.duressDone"));
        body.querySelector("#sbLockCur").value = "";
      }, function () { busy(false); say(tr("lock.failed")); });
    });
    var removeBtn = body.querySelector("#sbLockRemove");
    if (removeBtn) removeBtn.addEventListener("click", function () {
      var cur = body.querySelector("#sbLockCur").value;
      busy(true);
      keyBytes().then(function (kb) { return V.remove(cur, kb); }).then(function (okp) {
        busy(false);
        if (!okp) { say(tr("lock.wrong")); return; }
        if (window.showToast) window.showToast(tr("lock.title"), tr("lock.removed"), "");
        accountBody();
        if (window.sbPaintIris) window.sbPaintIris();
      }, function () { busy(false); say(tr("lock.failed")); });
    });
    var spareBtn = body.querySelector("#sbLockSpare");
    var spareCode = "";
    if (spareBtn && V.recoveryMake) spareBtn.addEventListener("click", function () {
      var cur = body.querySelector("#sbLockCur").value;
      if (String(cur).length < 4) { say(tr("lock.old")); body.querySelector("#sbLockCur").focus(); return; }
      busy(true);
      keyBytes().then(function (kb) { return V.recoveryMake(cur, kb); }).then(function (code) {
        busy(false);
        if (!code) { say(tr("lock.wrong")); return; }
        spareCode = String(code);
        var out = body.querySelector("#sbLockSpareOut");
        var pre = body.querySelector("#sbLockSpareCode");
        if (pre) pre.textContent = spareCode;
        if (out) out.hidden = false;
        var stEl = body.querySelector("#sbLockSpareState");
        if (stEl) stEl.textContent = tr("lock.spareOn", { d: new Date().toLocaleDateString() });
        body.querySelector("#sbLockCur").value = "";
        say("");
      }, function () { busy(false); say(tr("lock.failed")); });
    });
    var spareSave = body.querySelector("#sbLockSpareSave");
    if (spareSave) spareSave.addEventListener("click", function () {
      if (!spareCode) return;
      var text = tr("lock.spareFile", { code: spareCode, d: new Date().toLocaleDateString() });
      var a = doc.createElement("a");
      a.href = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
      a.download = "sysbaby-recovery-" + new Date().toISOString().slice(0, 10) + ".txt";
      doc.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
    });
    /* ── БУМАЖНАЯ КОПИЯ (D-332) ──────────────────────────────────────────
       Подарок людям, выбранный основателем 28.09.2026. Код восстановления —
       это ключ от всей системы, и лучшее место для него — бумага вдали от
       устройства: её не взломать по сети, и она переживает любой диск.
       Файл кода остаётся в «Загрузках» и в облаке, куда их выгружает
       телефон; напечатанный лист не оставляет в системе ничего. Лист
       собирается на время печати и сразу разбирается: код живёт только в
       памяти этого окна, пока оно открыто, — как и до сих пор.
       Охраняется tools/paper-copy-check.mjs. */
    var sparePrint = body.querySelector("#sbLockSparePrint");
    if (sparePrint) sparePrint.addEventListener("click", function () {
      if (!spareCode) return;
      var old = doc.getElementById("sbPaperSheet");
      if (old) old.remove();
      /* Дата — на языке системы, а не браузера; код — как его показала
         система, со своими чёрточками: перегруппировать его значило бы
         напечатать не тот код, который потом наберут у двери. */
      var l = window.sbLang ? window.sbLang() : "en";
      var d = "";
      try { d = new Date().toLocaleDateString(l === "ee" ? "et" : l); } catch (e) { d = new Date().toISOString().slice(0, 10); }
      var grouped = spareCode;
      var sheet = doc.createElement("div");
      sheet.id = "sbPaperSheet";
      sheet.className = "sb-paper";
      sheet.setAttribute("aria-hidden", "true");
      sheet.innerHTML =
        '<p class="sb-paper-mark">sys.baby</p>' +
        '<h1 class="sb-paper-title">' + esc(tr("lock.paperTitle")) + "</h1>" +
        '<p class="sb-paper-code" data-sb-nolang>' + esc(grouped) + "</p>" +
        '<p class="sb-paper-what">' + esc(tr("lock.paperWhat", { d: d })) + "</p>" +
        '<p class="sb-paper-keep">' + esc(tr("lock.paperKeep")) + "</p>" +
        '<p class="sb-paper-line">' + esc(tr("lock.paperWhere")) + "</p>";
      doc.body.appendChild(sheet);
      var gone = false;
      var drop = function () { if (gone) return; gone = true; sheet.remove(); };
      window.addEventListener("afterprint", drop, { once: true });
      /* ОТКАТ: браузер без события «после печати» — лист разбирается сам через
         минуту: окно печати к этому времени лист уже забрало. */
      setTimeout(drop, 60000);
      try { window.print(); } catch (e) { drop(); }
    });
    var nowBtn = body.querySelector("#sbLockNow");
    if (nowBtn) nowBtn.addEventListener("click", function () { window.location.reload(); });
    /* «Никогда» снимает самозапирание — при замке только словом (D-350);
       отмена возвращает прежний выбор, а не оставляет в поле неправду. */
    var idleSel = body.querySelector("#sbLockIdle");
    if (idleSel && window.sbIdleLock) idleSel.addEventListener("change", function () {
      var want = idleSel.value;
      if (Number(want) > 0 || !window.sbAskIrreversible) { window.sbIdleLock.set(want); return; }
      var was = window.sbIdleLock.minutes();
      window.sbAskIrreversible({ question: tr("lock.idleNeverAsk") }).then(function (okp) {
        if (okp) { window.sbIdleLock.set(want); return; }
        idleSel.value = String(was);
      });
    });
  }

  /* ── РАЗДЕЛ «КОПИИ» · решение D-172 ─────────────────────────────────────── */
  function whenText(ms) {
    if (!ms) return tr("bk.never");
    var d = new Date(ms);
    try { return d.toLocaleString(window.sbLang ? undefined : undefined); }
    catch (e) { return String(d); }
  }
  function backupSection() {
    var B = window.sbBackup;
    var head = '<h4 class="panel-sub">' + esc(tr("bk.title")) + "</h4>";
    if (!B || !B.supported()) {
      /* В ПУСТОТУ НЕ РАБОТАЕТ. Браузер без права писать в папку не получает
         синхронизации — и получает объяснение вместо неё. Писать копии в то же
         хранилище и звать это копиями Совет не станет: одна чистка браузера
         унесла бы обе. */
      return head + '<p class="acc-hint">' + esc(tr("bk.unsupported")) + "</p>" +
        '<div class="acc-acts"><button type="button" class="btn ghost" id="sbAccExport">' + esc(tr("bk.exportNow")) + "</button></div>";
    }
    var st = B.state() || {};
    var has = B.hasFolder();
    var on = B.isOn();
    return head +
      '<p class="acc-hint">' + esc(tr("bk.what")) + "</p>" +
      '<div class="acc-row"><span class="acc-k">' + esc(tr("bk.folder")) + '</span><span class="acc-v" id="sbBkFolder">' +
        esc(has ? (B.folderName() || st.dirName || "—") : tr("bk.noFolder")) + "</span></div>" +
      '<div class="acc-row"><span class="acc-k">' + esc(tr("bk.last")) + '</span><span class="acc-v" id="sbBkLast">' +
        esc(st.lastOk ? whenText(st.lastOk) + (st.sealed ? " · " + tr("bk.sealed") : "") : tr("bk.never")) + "</span></div>" +
      (st.lastErr ? '<p class="panel-err">' + esc(tr("bk.err")) + " " + esc(String(st.lastErr)) + "</p>" : "") +
      '<div class="acc-acts">' +
        '<button type="button" class="btn ghost" id="sbBkPick">' + esc(has ? tr("bk.change") : tr("bk.choose")) + "</button>" +
        '<button type="button" class="btn ' + (on ? "primary" : "ghost") + '" id="sbBkToggle"' + (has ? "" : " disabled") + ">" +
          esc(on ? tr("bk.on") : tr("bk.off")) + "</button>" +
        '<button type="button" class="btn ghost" id="sbBkNow"' + (has ? "" : " disabled") + ">" + esc(tr("bk.saveNow")) + "</button>" +
      "</div>" +
      (has ? "" : '<p class="acc-hint">' + esc(tr("bk.needFolder")) + "</p>") +
      '<div class="acc-acts"><button type="button" class="btn ghost" id="sbAccExport">' + esc(tr("bk.exportNow")) + "</button></div>";
  }

  function wireBackupBody(body) {
    var B = window.sbBackup;
    var err = body.querySelector("#sbAccErr");
    function say(m) { if (err) err.textContent = m || ""; }
    var pick = body.querySelector("#sbBkPick");
    if (pick && B) pick.addEventListener("click", function () {
      B.chooseFolder().then(function () { accountBody(); }, function (e) {
        if (e && e.name === "AbortError") return;      /* человек передумал — не ошибка */
        say(String((e && e.message) || e));
      });
    });
    var toggle = body.querySelector("#sbBkToggle");
    if (toggle && B) toggle.addEventListener("click", function () {
      var next = !B.isOn();
      toggle.disabled = true;
      B.setOn(next).then(function (okp) {
        if (!okp) say(tr("bk.needFolder"));
        accountBody();
      });
    });
    var now = body.querySelector("#sbBkNow");
    if (now && B) now.addEventListener("click", function () {
      now.disabled = true;
      B.saveNow().then(function (r) {
        if (r && r.error) say(String(r.error));
        else if (r && r.skipped === "permission") say(tr("bk.permission"));
        accountBody();
      });
    });
  }

  /* ── ОКНО ЦЕЛИКОМ ───────────────────────────────────────────────────────── */
  function accountBody() {
    var body = panelBody("sbAccountOverlay");
    if (!body) return;
    /* Чужие системы устройства здесь не перечисляются (D-306): прежде окно
       показывало их имена и входило в любую одним нажатием, без пароля. */
    var name = (window.sbGetUsername ? window.sbGetUsername() : "") || "";

    /* Титул, знак и номер — подарки Сундука (D-255): спрашиваются у него,
       пусто — не рисуются. */
    var gift = { title: "", sigil: "", serial: "" };
    try {
      if (window.sbChest) { gift.title = window.sbChest.title() || ""; gift.sigil = window.sbChest.sigil() || ""; gift.serial = window.sbChest.serial() || ""; }
    } catch (e) { gift = { title: "", sigil: "", serial: "" }; }
    var who = '<div class="acc-who">' +
      (gift.sigil ? '<span class="acc-sigil" aria-hidden="true">' + gift.sigil + "</span>" : '<span class="acc-dot" aria-hidden="true"></span>') +
      '<span class="acc-who-text"><b>' + esc(name || tr("acc.guest")) + "</b>" +
      (gift.title ? '<span class="acc-who-sub acc-title">' + esc(gift.title) + "</span>" : "") +
      (gift.serial ? '<span class="acc-who-sub acc-serial" data-sb-nolang>' + esc(gift.serial) + "</span>" : "") +
      "</span></div>";

    var field =
      '<label class="acc-field"><span class="acc-label">' + esc(tr("acc.name")) + "</span>" +
      '<input type="text" id="sbAccName" maxlength="18" autocomplete="username" autocapitalize="off" spellcheck="false" value="' + esc(name) + '">' +
      "</label>" +
      '<p class="panel-copy dim">' + esc(tr("acc.nameSub")) + "</p>" +
      '<div class="acc-acts"><button type="button" class="btn ghost" id="sbAccSave">' + esc(tr("acc.save")) + "</button></div>";

    var leaving =
      '<h4 class="panel-sub">' + esc(tr("acc.leave")) + "</h4>" +
      '<p class="panel-copy">' + esc(tr("acc.leaveSub")) + "</p>" +
      '<div class="acc-acts"><button type="button" class="btn primary wide" id="sbAccLeave">' + esc(tr("acc.leave")) + "</button></div>" +
      '<p class="panel-copy dim">' + esc(tr("acc.wipeSub")) + "</p>" +
      '<div class="acc-acts"><button type="button" class="btn ghost danger" id="sbAccWipe">' + esc(tr("acc.wipe")) + "</button></div>" +
      '<p class="acc-truth">' + esc(tr("acc.truth")) + "</p>" +
      '<div class="acc-acts"><button type="button" class="btn link" id="sbAccSignOut">' + esc(tr("acc.signout")) + "</button></div>";

    body.innerHTML = '<div class="panel-scroll">' + who + field +
      '<div class="acc-sec">' + lockSection() + "</div>" +
      '<div class="acc-sec">' + backupSection() + "</div>" +
      '<div class="acc-sec">' + leaving + "</div>" +
      '<p class="panel-err" id="sbAccErr" role="alert"></p>' +
      "</div>";
    wireAccountBody(body);
    wireLockBody(body);
    wireBackupBody(body);
    if (window.sbPaintIris) window.sbPaintIris();
  }

  function wireAccountBody(body) {
    var err = body.querySelector("#sbAccErr");
    function say(m) { if (err) err.textContent = m || ""; }

    var input = body.querySelector("#sbAccName");
    var save = body.querySelector("#sbAccSave");
    if (save && input) {
      save.addEventListener("click", function () {
        if (String(input.value || "").trim().length < 2) { say(tr("acc.nameSub")); return; }
        if (window.sbSetUsername) window.sbSetUsername(input.value);
        say(tr("acc.saved"));
        accountBody();
      });
      input.addEventListener("keydown", function (ev) { if (ev.key === "Enter") { ev.preventDefault(); save.click(); } });
    }


    /* Выгрузка: подтверждение, затем конверт (D-307, D-308). */
    var exp = body.querySelector("#sbAccExport");
    if (exp) exp.addEventListener("click", function () {
      if (typeof window.sbDownloadExport !== "function") { say("—"); return; }
      Promise.resolve(window.sbDownloadExport()).then(function (res) {
        if (res && res.presence) {
          return window.sbAskPresence().then(function (okp) { return okp ? window.sbDownloadExport() : null; });
        }
        return res;
      }).then(function (res) {
        if (!res) return;
        if (res.ok && window.showToast) window.showToast(tr("bk.title"), (res.sealed ? tr("bk.sealed") + " · " : "") + res.count, "");
        else if (res.error) say(res.error);
      });
    });

    var out = body.querySelector("#sbAccSignOut");
    if (out) out.addEventListener("click", function () { if (window.sbSignOut) window.sbSignOut(); });

    /* ── КНОПКА ТРЕВОГИ НЕ ПЕРЕСПРАШИВАЕТ ────────────────────────────────── */
    var leave = body.querySelector("#sbAccLeave");
    if (leave) leave.addEventListener("click", function () {
      if (!window.sbVanish) return;
      leave.disabled = true;
      window.sbVanish({ deep: false });
    });

    /* ── А КНОПКА, КОТОРУЮ НЕЛЬЗЯ ОТМЕНИТЬ, ПЕРЕСПРАШИВАЕТ ВСЕГДА ──────────
       При замке — словом (D-350): второе касание чужой руки стирало всё.
       Без замка слова нет — прежнее двойное касание. */
    var wipe = body.querySelector("#sbAccWipe");
    if (wipe) {
      var armed = false, disarm = null;
      wipe.addEventListener("click", function () {
        if (!window.sbVanish) return;
        var V = window.sbVault;
        if (V && V.isLocked && V.isLocked() && window.sbAskIrreversible) {
          wipe.disabled = true;
          window.sbAskIrreversible({ question: tr("acc.wipeSub") }).then(function (okp) {
            if (!okp) { wipe.disabled = false; return; }
            window.sbVanish({ deep: true });
          });
          return;
        }
        if (!armed) {
          armed = true;
          say(tr("acc.wipeAsk"));
          wipe.classList.add("armed");
          clearTimeout(disarm);
          /* Взведённое состояние гаснет само: кнопка, оставшаяся заряженной на
             минуту, однажды сработает от случайного касания. */
          disarm = setTimeout(function () { armed = false; wipe.classList.remove("armed"); say(""); }, 8000);
          return;
        }
        clearTimeout(disarm);
        wipe.disabled = true;
        window.sbVanish({ deep: true });
      });
    }
  }

  var accountPanel = window.sbRegisterPanel("sbAccountOverlay", "sbAccountClose", accountBody);
  if (accountPanel) window.sbOpenAccountPanel = function () { accountPanel.open(); };

  /* ── «ПОСТАВИТЬ СЕЙЧАС» ИСПОЛНЯЕТСЯ (D-304) ─────────────────────────────
     Повод — снимок-рассказ основателя 27.09.2026 с iPad: нажал «поставить
     сейчас» и оказался на столе без замка. Кнопка знакомства запоминала выбор
     в памяти страницы, а страница тут же перезагружалась при входе в свой
     профиль — и выбор пропадал, не дойдя ни до кого. Теперь выбор лежит в
     памяти СЕАНСА (переживает эту перезагрузку), и когда стол готов, система
     открывает окно замка и ставит курсор в поле слова. Выбор исполняется один
     раз. Замок молча не ставится — слово выбирает человек.
     Охраняется tools/lock-at-signup-check.mjs. */
  /* Открыть окно Учётной записи НА НУЖНОМ МЕСТЕ: первое из найденного по
     списку селекторов прокручивается в середину и получает фокус. Этим зовут
     «Поставить сейчас» и строки «Замок» и «Копии» в Настройках (D-305). */
  window.sbOpenAccountAt = function (selectors) {
    if (!window.sbOpenAccountPanel) return;
    window.sbOpenAccountPanel();
    setTimeout(function () {
      var el = null, list = String(selectors || "").split(","), i;
      for (i = 0; i < list.length && !el; i++) el = doc.querySelector(list[i].trim());
      if (!el) return;
      try { el.scrollIntoView({ block: "center" }); if (el.focus) el.focus(); } catch (e) { /* ignore */ }
    }, 360);
  };

  /* ── «НУЖЕН ЗАМОК» ВЕДЁТ К ЗАМКУ (D-317) ────────────────────────────────
     Повод — обход всех комнат 28.09.2026: три комнаты говорили «нужен
     замок» и ни одна не давала дороги. Ковчег посылал «в комнату «Замок»»,
     комната «Замок» — «в настройки», Ключи — никуда. Теперь дорога одна на
     всю систему: комната кладёт эту кнопку сразу после своей причины, а
     нажатие ведёт ядро — к полю нового слова в окне учётной записи (или к
     полю нынешнего, если замок уже стоит). Своей дороги комната не заводит:
     три дороги разошлись бы, как разошлись три слова.
     kind "open" — подпись «Открыть замок» (как строка «Замок» в Настройках):
     для случая, когда замок есть, но в нём надо что-то поменять.
     Охраняется tools/lock-call-check.mjs. */
  var LOCK_GLYPH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="5" y="10.5" width="14" height="9.5" rx="2.2"/><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7"/></svg>';
  window.sbLockCallHtml = function (kind) {
    var label = kind === "open" ? tr("set.privacy.lockOpen") : tr("lock.call");
    return '<button type="button" class="sb-lock-call" data-sb-lock-call>' +
      '<span class="sb-lock-call-i" aria-hidden="true">' + LOCK_GLYPH + "</span>" + esc(label) + "</button>";
  };
  doc.addEventListener("click", function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest("[data-sb-lock-call]") : null;
    if (!b || b.disabled) return;
    ev.preventDefault();
    window.sbOpenAccountAt("#sbLockP1, #sbLockCur");
  });

  /* ── «КТО СТУЧАЛСЯ» — СКАЗАТЬ ПОСЛЕ ОТКРЫТИЯ (D-341) ─────────────────────
     Замок открыт — система распечатывает след стука и говорит, сколько раз и
     когда стучались с тех пор, как ЭТА система смотрела в последний раз.
     Извещение идёт и в «Не беспокоить»: это о безопасности, а не новость.
     Сказанное отмечается в конвертах этой системы и не повторяется. */
  function knockWhen(ts) {
    var l = window.sbLang ? window.sbLang() : "en";
    var d = new Date(ts), now = new Date();
    var same = d.toDateString() === now.toDateString();
    try {
      return same ? d.toLocaleTimeString(l === "ee" ? "et" : l, { hour: "2-digit", minute: "2-digit" })
        : d.toLocaleString(l === "ee" ? "et" : l, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      /* ОТКАТ: браузер без часовых слов для этого языка — время пишется цифрами (ГГГГ-ММ-ДД ЧЧ:ММ, UTC), а не пропадает. */
      return d.toISOString().slice(0, 16).replace("T", " ");
    }
  }
  function tellKnocks() {
    var K = window.sbKnock;
    if (!K || !window.sbVault || !window.sbVault.isOpen || !window.sbVault.isOpen()) return;
    K.fresh().then(function (fresh) {
      if (!fresh.length) return;
      var shown = fresh.slice(-3).map(knockWhen).join(", ");
      if (window.showToast) window.showToast(tr("knock.title"), tr("knock.body", { n: fresh.length, when: shown }), "", true, "", "event");
      K.seen();
    });
  }
  if (window.sbBus && window.sbBus.on) window.sbBus.on("vault:change", function (e) { if (e && e.open) setTimeout(tellKnocks, 900); });

  var WANT_LOCK = "sysbaby.lock.wantNow";
  function lockWhenAsked() {
    var want = false;
    try { want = window.sessionStorage.getItem(WANT_LOCK) === "1"; if (want) window.sessionStorage.removeItem(WANT_LOCK); } catch (e) { want = false; }
    if (want) window.sbOpenAccountAt("#sbLockP1");
  }
  if (doc.documentElement.classList.contains("rv-icons")) setTimeout(lockWhenAsked, 0);
  else doc.addEventListener("sysbaby:desktop-ready", lockWhenAsked, { once: true });

  /* ── ЗНАК ГОВОРИТ СОСТОЯНИЕМ, А НЕ ПОДПИСЬЮ ─────────────────────────────
     Читается без слов: лепестки раскрыты — прятать нечего; сомкнулись вокруг
     точки — замок стоит; почти сошлись — заперто. Состояние спрашивается у
     самого замка, а не хранится вторым списком. */
  window.sbPaintIris = function () {
    var btn = doc.getElementById("sbTopIdentity");
    if (!btn) return;
    var V = window.sbVault;
    var st = (!V || !V.available() || !V.isLocked()) ? "none" : (V.isOpen() ? "open" : "shut");
    if (btn.getAttribute("data-state") !== st) btn.setAttribute("data-state", st);
  };
  (function watchVault() {
    window.sbPaintIris();
    if (window.sbBus && window.sbBus.on) {
      window.sbBus.on("vault:change", function () { window.sbPaintIris(); });
    }
  })();

  /* topbar bell + panel triggers */
  function wireTriggers() {
    var bell = $("#sbBell");
    if (bell && notifPanel) bell.addEventListener("click", function () { notifPanel.open(); });
    $$("[data-panel]").forEach(function (btn) {
      var id = btn.getAttribute("data-panel");
      btn.addEventListener("click", function () {
        var p = panels[id];
        if (p) p.open();
      });
    });
    observeToasts();
    paintBell();
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", wireTriggers);
  else wireTriggers();
})();
