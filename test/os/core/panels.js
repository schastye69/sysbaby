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

  /* ── РАЗДЕЛ «ЗАМОК» ─────────────────────────────────────────────────────── */
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
      '<pre class="lock-cipher">' + esc(cipherLine()) + "</pre>" +
      '<p class="lock-warn">' + esc(tr("lock.warn")) + "</p>";
    return head + (locked
      ? '<div class="lock-field">' +
          '<input type="password" id="sbLockCur" autocomplete="current-password" placeholder="' + esc(tr("lock.old")) + '" aria-label="' + esc(tr("lock.old")) + '">' +
          '<input type="password" id="sbLockNew" autocomplete="new-password" hidden placeholder="' + esc(tr("lock.new")) + '" aria-label="' + esc(tr("lock.new")) + '">' +
        "</div>" +
        '<div class="lock-acts">' +
          '<button type="button" class="btn ghost" id="sbLockChange">' + esc(tr("lock.change")) + "</button>" +
          '<button type="button" class="btn ghost" id="sbLockRemove">' + esc(tr("lock.remove")) + "</button>" +
          '<button type="button" class="btn primary" id="sbLockNow">' + esc(tr("lock.now")) + "</button>" +
        "</div>"
      : '<div class="lock-field">' +
          '<input type="password" id="sbLockP1" autocomplete="new-password" placeholder="' + esc(tr("lock.new")) + '" aria-label="' + esc(tr("lock.new")) + '">' +
          '<input type="password" id="sbLockP2" autocomplete="new-password" placeholder="' + esc(tr("lock.again")) + '" aria-label="' + esc(tr("lock.again")) + '">' +
        "</div>" +
        '<div class="lock-acts"><button type="button" class="btn primary" id="sbLockDo">' + esc(tr("lock.set")) + "</button></div>");
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
    var doBtn = body.querySelector("#sbLockDo");
    if (doBtn) doBtn.addEventListener("click", function () {
      var p1 = body.querySelector("#sbLockP1").value;
      var p2 = body.querySelector("#sbLockP2").value;
      if (String(p1).length < 4) { say(tr("lock.short")); return; }
      if (p1 !== p2) { say(tr("lock.mismatch")); return; }
      busy(true);
      V.lock(p1).then(function () {
        /* Заперто — значит заперто с этого мига: сеанс закрыт, ключей в памяти
           нет. Перезагрузка — единственный честный способ показать запертую
           систему, не оставив на экране ни строчки из уже закрытого (D-166). */
        window.location.reload();
      }, function () { busy(false); say(tr("lock.failed")); });
    });
    var changeBtn = body.querySelector("#sbLockChange");
    var newField = body.querySelector("#sbLockNew");
    if (changeBtn && newField) changeBtn.addEventListener("click", function () {
      if (newField.hidden) { newField.hidden = false; newField.focus(); say(""); return; }
      var cur = body.querySelector("#sbLockCur").value;
      var nw = newField.value;
      if (String(nw).length < 4) { say(tr("lock.short")); return; }
      busy(true);
      V.rekey(cur, nw).then(function (okp) {
        busy(false);
        if (!okp) { say(tr("lock.wrong")); return; }
        say(tr("lock.changed"));
        newField.value = ""; newField.hidden = true;
        body.querySelector("#sbLockCur").value = "";
        if (window.sbPaintIris) window.sbPaintIris();
      }, function () { busy(false); say(tr("lock.failed")); });
    });
    var removeBtn = body.querySelector("#sbLockRemove");
    if (removeBtn) removeBtn.addEventListener("click", function () {
      var cur = body.querySelector("#sbLockCur").value;
      busy(true);
      V.remove(cur).then(function (okp) {
        busy(false);
        if (!okp) { say(tr("lock.wrong")); return; }
        if (window.showToast) window.showToast(tr("lock.title"), tr("lock.removed"), "");
        accountBody();
        if (window.sbPaintIris) window.sbPaintIris();
      }, function () { busy(false); say(tr("lock.failed")); });
    });
    var nowBtn = body.querySelector("#sbLockNow");
    if (nowBtn) nowBtn.addEventListener("click", function () { window.location.reload(); });
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
    var rec = (window.sbProfiles && window.sbProfiles.currentRecord) ? window.sbProfiles.currentRecord() : null;
    var list = (window.sbProfiles && window.sbProfiles.list) ? window.sbProfiles.list() : [];
    var cur = (window.sbProfiles && window.sbProfiles.current) ? window.sbProfiles.current() : "local";
    var name = (window.sbGetUsername ? window.sbGetUsername() : "") || "";

    var who = '<div class="acc-who"><span class="acc-dot" aria-hidden="true"></span>' +
      '<span class="acc-who-text"><b>' + esc(name || tr("acc.guest")) + "</b>" +
      (rec && rec.name ? '<span class="acc-who-sub">' + esc(rec.name) + "</span>" : "") + "</span></div>";

    var field =
      '<label class="acc-field"><span class="acc-label">' + esc(tr("acc.name")) + "</span>" +
      '<input type="text" id="sbAccName" maxlength="18" autocomplete="username" autocapitalize="off" spellcheck="false" value="' + esc(name) + '">' +
      "</label>" +
      '<p class="panel-copy dim">' + esc(tr("acc.nameSub")) + "</p>" +
      '<div class="acc-acts"><button type="button" class="btn ghost" id="sbAccSave">' + esc(tr("acc.save")) + "</button></div>";

    var profiles = "";
    if (list.length > 1) {
      profiles = '<h4 class="panel-sub">' + esc(tr("acc.profile")) + '</h4><div class="acc-profiles">' +
        list.map(function (p) {
          return '<button type="button" class="chip' + (p.id === cur ? " on" : "") + '" data-profile="' + esc(p.id) + '">' +
            esc(p.name || p.id) + "</button>";
        }).join("") + "</div>";
    }

    var leaving =
      '<h4 class="panel-sub">' + esc(tr("acc.leave")) + "</h4>" +
      '<p class="panel-copy">' + esc(tr("acc.leaveSub")) + "</p>" +
      '<div class="acc-acts"><button type="button" class="btn primary wide" id="sbAccLeave">' + esc(tr("acc.leave")) + "</button></div>" +
      '<p class="panel-copy dim">' + esc(tr("acc.wipeSub")) + "</p>" +
      '<div class="acc-acts"><button type="button" class="btn ghost danger" id="sbAccWipe">' + esc(tr("acc.wipe")) + "</button></div>" +
      '<p class="acc-truth">' + esc(tr("acc.truth")) + "</p>" +
      '<div class="acc-acts"><button type="button" class="btn link" id="sbAccSignOut">' + esc(tr("acc.signout")) + "</button></div>";

    body.innerHTML = '<div class="panel-scroll">' + who + field + profiles +
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

    body.querySelectorAll("[data-profile]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (window.sbProfiles) window.sbProfiles.switchTo(b.getAttribute("data-profile"));
      });
    });

    var exp = body.querySelector("#sbAccExport");
    if (exp) exp.addEventListener("click", function () {
      var trigger = doc.getElementById("sbCcExport");
      if (trigger) { trigger.click(); return; }
      if (typeof window.sbExportProfile !== "function") return;
      try {
        var blob = new Blob([JSON.stringify(window.sbExportProfile(), null, 2)], { type: "application/json" });
        var a = doc.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "sysbaby-profile.json";
        a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      } catch (e) { say(String((e && e.message) || e)); }
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

    /* ── А КНОПКА, КОТОРУЮ НЕЛЬЗЯ ОТМЕНИТЬ, ПЕРЕСПРАШИВАЕТ ВСЕГДА ────────── */
    var wipe = body.querySelector("#sbAccWipe");
    if (wipe) {
      var armed = false, disarm = null;
      wipe.addEventListener("click", function () {
        if (!window.sbVanish) return;
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
