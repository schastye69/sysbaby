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

  /* последний ввод — клавиатура? (для рамки фокуса окна аккаунта, D-620) */
  var kbdLast = false;
  doc.addEventListener("keydown", function (ev) { if (ev.key === "Tab" || ev.key === "Enter" || ev.key === " " || /^Arrow/.test(ev.key)) kbdLast = true; }, true);
  doc.addEventListener("pointerdown", function () { kbdLast = false; }, true);
  /* ── ПОДНОС У СВОЕЙ КНОПКИ (Чистота, D-847-TRAY-AT-BUTTON) ──────────────
     Выпуск и ключница были модалкой по центру — вуаль, размытие, серая плита
     с чертой. Теперь это поднос --tray5 под своей кнопкой в шапке (как меню
     языка): стол виден, касание мимо подноса его закрывает. */
  var TRAY_AT = { sbNotifOverlay: "sbBell", sbAccountOverlay: "sbTopIdentity" };
  function placeTray(overlay, anchorId) {
    var a = doc.getElementById(anchorId), p = overlay.querySelector(".panel");
    if (!a || !p) return;
    var r = a.getBoundingClientRect(), W = window.innerWidth, gap = 8;
    var w = Math.min(p.offsetWidth || 420, W - 24);
    var x = Math.round(r.left + r.width / 2 - w / 2);
    p.style.left = Math.max(12, Math.min(x, W - w - 12)) + "px";
    p.style.top = Math.round(r.bottom + gap) + "px";
  }
  window.sbRegisterPanel = function (overlayId, closeBtnId, onOpen) {
    var overlay = doc.getElementById(overlayId);
    if (!overlay) return null;                      /* guarded degradation */
    var lastFocus = null;
    var trayAt = TRAY_AT[overlayId] || null;
    if (trayAt) overlay.classList.add("is-tray");
    function outside(ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      if (t.closest("#" + overlayId + " .panel") || t.closest("#" + trayAt)) return;
      close();
    }

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
      if (trayAt) {
        placeTray(overlay, trayAt);
        setTimeout(function () { doc.addEventListener("pointerdown", outside, true); }, 0);
      }
      var btn = closeBtnId ? doc.getElementById(closeBtnId) : null;
      /* Окно аккаунта (D-620): фокус встаёт на ✕, но рамка фокуса видна только
         при навигации клавиатурой — открытие касанием или из кода её не рисует. */
      var quiet = overlayId === "sbAccountOverlay" && !kbdLast;
      if (btn) { try { btn.focus(quiet ? { focusVisible: false } : undefined); } catch (e) { /* ignore */ } }
      if (window.sbBus) window.sbBus.emit("panel:open", { id: overlayId });
    }
    function close() {
      if (!isOpen()) return;
      overlay.classList.remove("open");
      overlay.setAttribute("hidden", "");
      if (trayAt) doc.removeEventListener("pointerdown", outside, true);
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
        /* one-time-code, а не current-password: окно стоит поверх открытого
           мира без формы, и менеджер паролей Chromium брал «логином» набранное
           в соседнем поле мира и писал его в Login Data (Р-S2.2, D-358). */
        '<input type="password" id="sbConfirmWord" autocomplete="one-time-code" aria-label="' + esc(tr("confirm.word")) + '" placeholder="' + esc(tr("confirm.word")) + '">' +
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
    /* ПРЕЖНИЙ КАЛЕНДАРЬ ВЫКЛЮЧЕН (сборка H4, D-853): касание времени ведёт в
       панель часов core/clock.js (sbClock), и она же отвечает тем, кто зовёт
       sbPanels.sbTimeOverlay.open(). Здесь остаётся только запас — если
       панели часов в странице нет, касание открывает прежний календарь. */
    var btn = doc.getElementById("sbClockBtn");
    if (btn) btn.addEventListener("click", function () { if (!window.sbClock) timePanel.open(); });
    setInterval(function () {
      if (window.sbClock) return;
      var ov = doc.getElementById("sbTimeOverlay");
      if (ov && ov.classList.contains("open")) paintTime();
    }, 1000);
  }

  var shortcuts = window.sbRegisterPanel("sbShortcutsOverlay", "sbShortcutsClose", function () {
    var body = panelBody("sbShortcutsOverlay");
    if (!body) return;
    var rows = SHORTCUT_ROWS.map(function (r) {
      return '<div class="kv-row"><kbd>' + esc(window.sbKeys ? window.sbKeys(r[0]) : r[0]) + "</kbd><span>" + esc(tr(r[1])) + "</span></div>";
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

  /* важное, которого ещё не коснулись, считается, пока его не прочитали (D-814) */
  function unseenCount() { return notifList().filter(function (n) { return !n.seen || (n.safe && !n.read); }).length; }
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
    /* голос уже записал сам — с ключами слов и пометкой важного (D-813) */
    if (node.hasAttribute("data-voice-logged") || node.hasAttribute("data-voice-warm")) return;
    record({ title: node.getAttribute("data-title") || "", text: node.getAttribute("data-text") || "" });
  }
  /* ── ВЕЧЕРНИЙ ВЫПУСК (D-813, v178-H4a) ────────────────────────────────
     Решение основателя 11.11.2026: колокольчик — «вечерний выпуск», журнал
     всего, что голос дома сказал по делу. Событие, пришедшее само, и важное
     для безопасности — строка выпуска; ответ на своё же нажатие — нет
     (v47.3); тёплые слова голоса сюда не приходят и не хранятся нигде.
     Строка помнит ключи своих слов (tk/xk): смена языка перерисовывает её.
     Важное (safe) остаётся непрочитанным, пока его не коснулись. Голос пишет
     сюда сам (sbNotifRecord) — и тогда, когда «Не беспокоить» его заглушило. */
  function record(e) {
    var title = String(e.title == null ? "" : e.title), text = String(e.text == null ? "" : e.text);
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
    var row = list[0];
    if (e.safe) { row.safe = true; row.read = false; row.seen = false; }
    if (e.tk) row.tk = e.tk;
    if (e.xk) row.xk = e.xk;
    notifSave(list);
    paintBell();
    if (notifPanel && notifPanel.isOpen()) paintNotifPanel();
    return row.id;
  }
  window.sbNotifRecord = function (e) { return e ? record(e) : null; };
  window.sbNotifRead = function (id) {
    var list = notifList(), hit = false;
    list.forEach(function (n) { if (n.id === id) { n.read = true; n.seen = true; hit = true; } });
    if (hit) { notifSave(list); paintBell(); if (notifPanel && notifPanel.isOpen()) paintNotifPanel(); }
    return hit;
  };
  window.sbNotifList = function () { return notifList().map(function (n) { return { id: n.id, title: said(n, "title"), text: said(n, "text"), ts: n.ts, seen: !!n.seen, safe: !!n.safe, read: !!n.read }; }); };
  /* строка на языке, который сейчас: из ключа, если голос его знал */
  function said(n, f) {
    var k = f === "title" ? n.tk : n.xk;
    if (k && k.k) { var v = tr(k.k, k.v || undefined); if (v && v !== k.k) return v; }
    return n[f];
  }

  /* колокольчик зовётся «вечерний выпуск» (решение основателя 11.11.2026) — на любом языке */
  function bellName() {
    var head = $("#sbNotifTitle");
    if (head && head.getAttribute("data-i18n") !== "voice.bell") head.setAttribute("data-i18n", "voice.bell");
    if (head) head.textContent = tr("voice.bell");
  }
  bellName();
  if (window.sbBus && window.sbBus.on) window.sbBus.on("translate:done", function () { bellName(); if (notifPanel && notifPanel.isOpen()) paintNotifPanel(); });
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
    bellName();
    /* пояснение о выпуске — под тихим словом «как это устроено», а не каждый раз под списком (обход п.28, D-913) */
    var foot = '<details class="sb-more sbv-more"><summary>' + esc(tr("voice.bellMore")) + '</summary><p class="panel-copy dim sbv-foot">' + esc(tr("voice.bellFoot")) + "</p></details>";
    if (!list.length) {
      /* Пусто — один вид пустых экранов (обход п.29): знак колокольчика и одна
         строка; пояснение о выпуске — только когда в нём что-то есть. */
      body.innerHTML = '<div class="panel-scroll"><p class="panel-empty panel-empty-znak">' + sbZnak("bell") + "<span>" + esc(tr("p.noNotifications")) + "</span></p></div>";
      return;
    }
    body.innerHTML = '<div class="panel-scroll">' + list.map(function (n) {
      var unread = n.safe && !n.read;
      return '<div class="notif-row' + (n.safe ? " sbv-safe" : "") + (unread ? " sbv-unread" : "") + '" data-id="' + esc(n.id) + '">' +
        '<div class="notif-main"><div class="notif-title">' + esc(said(n, "title")) + "</div>" +
        '<div class="notif-text">' + esc(said(n, "text")) + (unread ? " · " + esc(tr("voice.unread")) : "") + "</div></div>" +
        '<div class="notif-time">' + esc(timeAgo(n.ts)) + "</div>" +
        (unread ? '<button class="btn tiny sbv-read" type="button" data-read="' + esc(n.id) + '">' + esc(tr("voice.read")) + "</button>" : "") +
        '<button class="notif-x" type="button" aria-label="' + esc(tr("p.dismiss")) + '">' + sbZnak("close") + '</button></div>';
    }).join("") + foot + "</div>" +
      '<div class="panel-foot"><button class="btn ghost" type="button" id="sbNotifClear">' + esc(tr("p.clearAll")) + '</button></div>';

    $$(".sbv-read", body).forEach(function (b) {
      b.addEventListener("click", function (ev) { ev.stopPropagation(); window.sbNotifRead(b.getAttribute("data-read")); });
    });
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
        '<button class="task-x" type="button" data-act="close" aria-label="' + esc(tr("p.close")) + '">' + sbZnak("close") + '</button></div>';
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
          '<button class="task-x" type="button" data-act="del" aria-label="' + esc(tr("p.delete")) + '">' + sbZnak("close") + '</button></div>';
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
      /* one-time-code, а не off: на off менеджер паролей Chromium поле пароля
         всё равно берёт себе (Р-S2.2, D-358, вариант А основателя). */
      '<label class="field"><span>Passphrase</span><input type="password" id="sbIncogPw" autocomplete="one-time-code" minlength="4" /></label>' +
      (hasHash ? "" : '<label class="field"><span>Confirm</span><input type="password" id="sbIncogPw2" autocomplete="one-time-code" /></label>') +
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

  /* ══════ СЕАНС УХОДИТ ПОСЛЕ ТОГО, КАК РАСКРЫТОЕ УБРАНО · решение D-360 ═════
     Граница Р-S2.4: «Запереть сейчас», пятое неверное слово и постановка
     замка закрывают сеанс перезагрузкой — и вместе со страницей умирал таймер,
     который через 20 секунд стирает скопированный пароль «Ключей». Пароль
     оставался в буфере обмена у самой двери, хотя интерфейс обещал обратное.
     Теперь путь закрытия один: комната, которой есть что убрать, объявляет
     это (sbOnSessionClose), а закрывающий зовёт sbSessionClose(go) — убрать
     всё, дождаться, и только потом уйти к двери. Если комната убрать не
     смогла (браузер отказал в записи в буфер), она возвращает правду
     { title, text } — и правда показывается ДО ухода, а не теряется вместе
     со страницей.
     Этим путём идут: «Запереть сейчас», постановка замка, пятое неверное
     слово, покой, «Уйти сейчас» (sbVanish), «Выйти» (sbSignOut — панель,
     Центр управления, «К двери» в Настройках), «Выйти» в Настройках,
     «Удалить все локальные данные» в Настройках при замке и — сведение H2 с
     D-359 — соседняя вкладка, получившая весть «сеанс закрыт» или «профиль
     стирается» (store.js shutHere). ПОРЯДОК на каждом из них: комнаты
     убирают своё первыми (они зовутся в тот же такт, что и sbSessionClose),
     затем несохранённое ложится (I1), и только когда буфер ответил — ключи
     уходят и вкладка идёт к двери.
     ТИХО (opts.quiet) — без правды на экране и без ожидания: кнопка тревоги
     (человек уходит немедля), покой (у экрана никого: правду прочёл бы тот,
     кто подошёл, а сеанс держался бы ради неё открытым; по сроку она уже
     сказана таймером комнаты), пятое неверное слово (правду прочёл бы тот,
     кто пять раз ошибся словом) и соседняя вкладка, закрытая вестью (у неё
     человека может не быть). Тихий уход не теряется за уже начатым.
     ЧЕГО ЭТО НЕ ДАЁТ, вслух: закрытие вкладки самим человеком и прочие
     перезагрузки (снятие замка, инкогнито, импорт настроек, устаревшая
     вкладка) этим путём не идут; буфер там стирает только таймер комнаты,
     пока страница жива. Фоновая вкладка, закрытая вестью, в настоящем
     браузере может получить отказ в записи в буфер (нет фокуса) — тогда её
     скопированный пароль остаётся в буфере, а правда тиха (закон судит этот
     путь в Chromium без окон, где фокус есть у каждой вкладки).
     Охраняется tools/keys-presence-check.mjs. */
  var sessionClosers = [];
  window.sbOnSessionClose = function (fn) { if (typeof fn === "function") sessionClosers.push(fn); };
  /* ПОСТОЯННАЯ: 1,5 с — дольше комнату не ждать: запись в буфер обмена идёт
     миллисекунды; закрываемый сеанс не держится открытым ради зависшей. */
  var SESSION_SEAL_MS = 1500;
  /* ПОСТОЯННАЯ: 4 с — прочесть правду о неочищенном буфере до ухода к
     двери: одна фраза тому, кто только что нажал «Запереть». */
  var SESSION_SAY_MS = 4000;
  var sessionClosing = false;
  var sealing = null;
  /* Комнаты убирают своё один раз за жизнь страницы; ответ — правды тех,
     кому убрать не удалось. */
  function sessionSeal() {
    if (sealing) return sealing;
    sealing = new Promise(function (resolveAll) {
      var says = [];
      var each = sessionClosers.map(function (fn) {
        return new Promise(function (resolve) {
          try {
            Promise.resolve(fn()).then(function (s) { if (s && s.text) says.push(s); resolve(); }, function () { resolve(); });
          } catch (e) { resolve(); }
        });
      });
      var done = false;
      var finish = function () { if (done) return; done = true; resolveAll(says); };
      setTimeout(finish, SESSION_SEAL_MS);
      Promise.all(each).then(finish, finish);
    });
    return sealing;
  }
  window.sbSessionClose = function (go, opts) {
    go = typeof go === "function" ? go : function () { window.location.reload(); };
    var quiet = !!(opts && opts.quiet);
    if (sessionClosing && !quiet) return;
    sessionClosing = true;
    sessionSeal().then(function (says) {
      if (quiet || !says.length) { go(); return; }
      says.forEach(function (s) {
        if (window.showToast) { try { window.showToast(s.title || "", s.text, "", true, "toast-warn", "event"); } catch (e) { /* ignore */ } }
      });
      setTimeout(go, SESSION_SAY_MS);
    });
  };

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
    /* Движение говорится и соседним вкладкам: покой считается по вкладкам
       ТОГО ЖЕ мира (D-359) — сеанс закрывается во всех, значит и держится
       движением в любой вкладке своего мира; движение во вкладке другого
       мира (второго слова) весть не продлевает — её подпись не сойдётся. */
    function touch() { last = Date.now(); if (V && V.stir) { try { V.stir(); } catch (e) { /* ignore */ } } }
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
    /* Сеанс закрывается во всех вкладках профиля (D-359), не только здесь. */
    function shut() {
      /* К двери — тем же путём, что «Запереть сейчас»: раскрытое убрано,
         скопированный пароль стёрт до ухода ключей (D-360). Тихо: у экрана
         никого, правда о буфере пустому экрану не показывается. Порядок
         сведения H2: комнаты убирают своё в этот же такт (раньше всего), затем
         несохранённое ложится, затем весть соседям (D-359); к двери — когда
         буфер ответил. */
      window.sbSessionClose(function () { location.reload(); }, { quiet: true });
      if (window.sbDB && window.sbDB.flushSync) { try { window.sbDB.flushSync(); } catch (e) { /* ignore */ } }
      if (V && V.shutAll) { try { V.shutAll(); } catch (e) { /* ignore */ } }
    }
    function check() {
      hookFrames();                           /* рамки, появившиеся с тех пор */
      if (!V || !V.isLocked() || !V.isOpen()) return;
      var m = minutes();
      if (!(m > 0)) return;
      var heard = V.stirredAt ? V.stirredAt() : 0;
      if (Date.now() - Math.max(last, heard) >= m * 60000) shut();
    }
    setInterval(check, 15000);
    /* Срок проверяется в миг возвращения (D-592): скрытой вкладке браузер
       душит таймеры, и опрос мог не прийти. Возврат из «заморозки» и из
       кеша страницы — тоже возвращение. Стережёт tools/idle-lock-check.mjs. */
    doc.addEventListener("visibilitychange", function () { if (doc.visibilityState === "visible") check(); });
    doc.addEventListener("resume", check);
    window.addEventListener("pageshow", check);
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
    /* Подписи строк — из словаря на языке окна (D-692); имена алгоритмов —
       имена собственные и стоят как есть. Прежде вся опись была английской
       («padding 256 B») и в русском окне читалась непереведённой. */
    return [tr("lock.cipher.ciphers", { v: (c.ciphers || []).join("  ›  ") }), c.mac ? tr("lock.cipher.mac", { v: c.mac }) : "",
      tr("lock.cipher.kdf", { v: (c.kdf || []).join("  ›  ") }),
      tr("lock.cipher.pad", { n: c.pad || 256 }), c.names ? tr("lock.cipher.names", { v: c.names }) : ""]
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
  /* mode (D-637): "settings" — замок целиком без форм ключей (они под
     планкой ключницы); "password" | "spare" | "device" | "duress" — форма
     одного ключа для раскрытия под планкой; без mode — всё, как прежде. */
  function lockSection(mode) {
    var V = window.sbVault;
    if (!V) return "";
    if (!V.available()) {
      /* Замка нет — и сказано, ПОЧЕМУ. Чаще всего причина видна в адресной
         строке: страница открыта по http, а по нему браузер криптографию не
         даёт вовсе (D-178). Молчание оставило бы человека думать, что замок
         сломан, — а он просто не может здесь существовать. */
      return '<h4 class="panel-sub">' + esc(tr("lock.title")) + "</h4>" +
        '<p class="sb-note lock-insecure">' + esc(tr("lock.insecure")) + "</p>";
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
    var setForm = '<div class="lock-field">' +
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
        "</div>";
    var curField = '<div class="lock-field">' +
          '<input type="password" id="sbLockCur" autocomplete="current-password" placeholder="' + esc(tr("lock.old")) + '" aria-label="' + esc(tr("lock.old")) + '">' +
          (mode == null || mode === "password" ? '<input type="password" id="sbLockNew" autocomplete="new-password" hidden placeholder="' + esc(tr("lock.new")) + '" aria-label="' + esc(tr("lock.new")) + '">' : "") +
        "</div>";
    var duressField = '<div class="lock-field">' +
          '<input type="password" id="sbLockDuress" autocomplete="new-password" hidden placeholder="' + esc(tr("lock.duressField")) + '" aria-label="' + esc(tr("lock.duressField")) + '">' +
        "</div>";
    var hwBlock = V.hwState ? '<h4 class="panel-sub">' + esc(tr("lock.hw")) + "</h4>" +
          '<p class="panel-copy dim">' + esc(tr("lock.hwWhat")) + "</p>" +
          '<p class="panel-copy" id="sbLockHwState">' + esc(hwStateLine(V)) + "</p>" : "";
    var weakOld = V.strengthen && V.strong && !V.strong();
    var btn = function (id, key, cls) { return '<button type="button" class="btn ' + (cls || "ghost") + '" id="' + id + '">' + esc(tr(key)) + "</button>"; };
    var hwBtns = (V.hwState && V.hwState().can && !V.hwState().on ? btn("sbLockHwAdd", "lock.hwAdd") : "") +
          (V.hwState && V.hwState().on ? btn("sbLockHwOff", "lock.hwOff") : "");
    /* ── ФОРМА ОДНОГО КЛЮЧА ПОД ПЛАНКОЙ (D-637) ────────────────────────────
       Без замка ключ вешается только после пароля — у каждого крючка та же
       форма нового слова. С замком у каждого ключа своя форма. Форма мешочка
       одна и та же при любом состоянии замка: ни одной надписи о том,
       заведено ли тревожное слово, — те же поля и те же кнопки. */
    if (mode && mode !== "settings") {
      if (!locked) return setForm;
      if (mode === "password") return curField + keyRow + '<div class="lock-acts">' + btn("sbLockChange", "lock.change") + "</div>";
      if (mode === "spare") return curField + keyRow + '<div class="lock-acts">' + btn("sbLockSpare", "lock.spare") + "</div>" + spareRow;
      if (mode === "device") return hwBlock + curField + keyRow + (hwBtns ? '<div class="lock-acts">' + hwBtns + "</div>" : "");
      if (mode === "duress") return curField + duressField + keyRow +
        '<p class="panel-copy dim">' + esc(tr("lock.duressWhat")) + "</p>" +
        '<p class="panel-copy dim">' + esc(tr("lock.duressCant")) + "</p>" +
        '<div class="lock-acts">' + btn("sbLockDuressSet", "lock.duress") + btn("sbLockDuressOff", "lock.duressOff") + "</div>";
      return "";
    }
    if (mode === "settings") {
      return head + (locked
        ? curField + keyRow +
          (weakOld ? '<p class="panel-copy dim" id="sbLockStrongWhat">' + esc(tr("lock.strongWhat")) + "</p>" : "") +
          idleRow() +
          '<p class="panel-copy dim" id="sbLockRemoveWhat">' + esc(tr("lock.removeWhat")) + "</p>" +
          '<div class="lock-acts">' + (weakOld ? btn("sbLockStrong", "lock.strong") : "") + btn("sbLockRemove", "lock.remove") + btn("sbLockNow", "lock.now", "primary") + "</div>"
        : setForm);
    }
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
      /* Замок встал — сеанс без замка закрывается тем же путём (D-360). */
      var toDoor = function () { window.sbSessionClose(function () { window.location.reload(); }); };
      V.lock(p1).then(toDoor, function (e) {
        var m = e && e.message;
        /* Замок встал, хвост поворота уже под ним — как удача (Р-A5.2). */
        if (m === "locked") { toDoor(); return; }
        /* Замок встал, а последние правки ещё не под ним: мир открыт в этой
           вкладке и держит их. Окно постановки замка больше не нужно. */
        if (m === "kept") {
          busy(false);
          say(tr("lock.kept"));
          ["#sbLockDo", "#sbLockDoAnyway", "#sbLockPhrase"].forEach(function (q) { var b = body.querySelector(q); if (b) b.disabled = true; });
          return;
        }
        busy(false);
        say(tr(m === "nolocks" ? "lock.noLocks" : m === "busy" ? "lock.quietBusy" : "lock.failed"));
      });
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
      }, function (e) { busy(false); say(tr(e && e.message === "nolocks" ? "lock.noLocks" : "lock.failed")); });
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
      }, function (e) { busy(false); say(tr(e && e.message === "nolocks" ? "lock.noLocks" : "lock.failed")); });
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
        accountRefresh();
      }, function (e) { busy(false); say(e && e.message === "nolocks" ? tr("lock.noLocks") : e && e.message === "duress-wrong" ? tr("lock.duressWrong") : tr("lock.failed")); });
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
          accountRefresh();
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
      }, function (e) { busy(false); say(tr(e && e.message === "nolocks" ? "lock.noLocks" : "lock.failed")); });
    });
    var removeBtn = body.querySelector("#sbLockRemove");
    if (removeBtn) removeBtn.addEventListener("click", function () {
      var cur = body.querySelector("#sbLockCur").value;
      busy(true);
      keyBytes().then(function (kb) { return V.remove(cur, kb); }).then(function (okp) {
        busy(false);
        if (!okp) { say(tr("lock.wrong")); return; }
        if (window.showToast) window.showToast(tr("lock.title"), tr("lock.removed"), "");
        accountRefresh();
        if (window.sbPaintIris) window.sbPaintIris();
      }, function (e) { busy(false); say(tr(e && e.message === "nolocks" ? "lock.noLocks" : e && e.message === "room" ? "lock.removeRoom" : "lock.failed")); });
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
      }, function (e) { busy(false); say(tr(e && e.message === "nolocks" ? "lock.noLocks" : "lock.failed")); });
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
    /* «Запереть сейчас» закрывает сеанс во всех вкладках профиля (D-359) и
       уходит к двери после того, как раскрытое убрано и буфер со скопированным
       паролем очищен (D-360). */
    if (nowBtn) nowBtn.addEventListener("click", function () {
      /* Окно Настроек, открытое ради «Ключей и замка» (D-637), уходит вместе с
         сеансом: эстафета не переносит его через дверь и не пишет за него. */
      if (nowBtn.closest && nowBtn.closest('.window[data-app="settings"]') && window.closeWindow) {
        try { window.closeWindow("settings"); } catch (e) { /* ignore */ }
      }
      /* Комнаты убирают своё в этот же такт, весть уходит следом; соседние
         закрываются немедля, эта — когда буфер ответил (или правда прочитана). */
      window.sbSessionClose(function () { window.location.reload(); });
      if (V && V.shutAll) { try { V.shutAll(); } catch (e) { /* ignore */ } }
    });
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
      B.chooseFolder().then(function () { accountRefresh(); }, function (e) {
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
        accountRefresh();
      });
    });
    var now = body.querySelector("#sbBkNow");
    if (now && B) now.addEventListener("click", function () {
      now.disabled = true;
      B.saveNow().then(function (r) {
        if (r && r.error) say(String(r.error));
        else if (r && r.skipped === "permission") say(tr("bk.permission"));
        accountRefresh();
      });
    });
  }

  /* ОТКАТ: Чистота А (D-836) заменила ключницу нитью света и четырьмя знаками
     в лунках; основатель 12.11.2026 вернул объёмную ключницу как ритуал —
     перекладина, воронёные ключи, сливовый бархатный мешочек (D-828-KEY-RACK-RITUAL:
     ключница — исключение-ритуал из закона «знаки одной семьи»). Рисунок и цвета —
     прежние, из сборки v178-H4a (D-620, D-635); колорист готовит варианты цвета
     отдельно. Слова под планкой — по-прежнему языком «Чистоты» (D-837). */
  /* ── КЛЮЧНИЦА «ТЁМНЫЙ МЕТАЛЛ» · решение D-620 (основатель 09.11.2026) ──────
     Утверждено по klyuchi4/u4.png и u2.png: воронёные ключи на тёмной планке,
     ушки разные, чтобы ключи не путались, — трилистник (пароль), кольцо (код
     восстановления), квадрат (ключ устройства), сердце (тревожное слово).
     Свечения в ушках нет: сигнал один — ключ висит = сделано; тень формы и
     «+» по центру ушка = нет, и касание ведёт к добавлению. Ниже — «Запереть
     сейчас», «Уйти…»; Ковчег и «как устроен шифр» — в «Настройках».
     ТРЕВОЖНОЕ СЛОВО НЕ ВЫДАЁТ СЕБЯ И ЗДЕСЬ. Окно не знает и не показывает,
     заведено ли второе слово (см. lockSection: «панель, умеющая показать
     „тревожное слово установлено“, сама и есть утечка»). Поэтому его место
     всегда одно и то же — тень сердца с «+» и строка «не показывается»,
     при любом состоянии замка. Охраняется tools/klyuchnica-check.mjs. */
  var KR_BOW = {
    tre: "M0 -34 C9 -34 15 -27 14 -19 C22 -21 30 -14 28 -5 C27 3 19 7 12 5 C14 13 8 20 0 20 C-8 20 -14 13 -12 5 C-19 7 -27 3 -28 -5 C-30 -14 -22 -21 -14 -19 C-15 -27 -9 -34 0 -34 Z M0 -24 a5 5 0 1 0 .1 0 Z M-16 -8 a4.5 4.5 0 1 0 .1 0 Z M16 -8 a4.5 4.5 0 1 0 .1 0 Z M0 -5 a6 6 0 1 0 .1 0 Z",
    ring: "M0 -32 a26 26 0 1 1 -.1 0 Z M0 -20 a14 14 0 1 0 .1 0 Z",
    sq: "M-17 -29 h34 a6 6 0 0 1 6 6 v34 a6 6 0 0 1 -6 6 h-34 a6 6 0 0 1 -6 -6 v-34 a6 6 0 0 1 6 -6 Z M-8 -14 h16 v16 h-16 Z",
    heart: "M0 22 C-34 2 -28 -32 -8 -30 C-3 -30 0 -25 0 -22 C0 -25 3 -30 8 -30 C28 -32 34 2 0 22 Z M0 -14 a6 6 0 1 0 .1 0 Z"
  };
  var KR_X = [64, 186, 308, 430];
  function krKey(bow) {
    var m = "url(#krIron)";
    return '<g filter="url(#krMetal)"><path fill-rule="evenodd" fill="' + m + '" d="' + bow + '"/>' +
      '<path fill="' + m + '" d="M-9 22 h18 a3 3 0 0 1 3 3 v3 a3 3 0 0 1 -3 3 h-18 a3 3 0 0 1 -3 -3 v-3 a3 3 0 0 1 3 -3 Z"/>' +
      '<path fill="' + m + '" d="M-6 32 h12 v4 h-12 Z M-8 37 h16 a2 2 0 0 1 0 5 h-16 a2 2 0 0 1 0 -5 Z"/>' +
      '<path fill="' + m + '" d="M-4.5 42 h9 v108 a4.5 4.5 0 0 1 -9 0 Z"/>' +
      '<path fill="' + m + '" d="M4 118 h16 v6 h-7 v5 h10 v7 h-6 v5 h8 v8 h-21 Z"/>' +
      '<path d="M-1.2 46 v98" stroke="#000" stroke-opacity=".35" stroke-width="1.1"/></g>';
  }
  function krHook(x) {
    return '<g transform="translate(' + x + ',30)"><circle r="6.5" fill="url(#krRail)"/><circle r="2" fill="#000" opacity=".4"/>' +
      '<path d="M0 4 C0 20 3 26 11 24 C15 23 16 19 15 15" stroke="url(#krRail)" stroke-width="4.2" fill="none" stroke-linecap="round"/></g>';
  }
  function krHang(x, rot, bow) {
    return '<g class="kr-key" transform="translate(' + (x + 12) + ',53) rotate(' + rot + ')">' +
      '<circle r="10" fill="none" stroke="url(#krIron)" stroke-width="2.6"/>' +
      '<circle r="10" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".8" transform="translate(-.8,-.8)"/>' +
      '<g transform="translate(0,44) scale(.92)">' + krKey(bow) + "</g></g>";
  }
  function krGhost(x, bow, cy) {
    var outline = bow.split(/\s+M/)[0];
    return '<g class="kr-ghost" transform="translate(' + (x + 12) + ',97) scale(.92)" opacity=".5">' +
      '<path fill-rule="evenodd" d="' + outline + '" fill="#000" opacity=".25"/>' +
      '<path d="M-4.5 42 h9 v108 a4.5 4.5 0 0 1 -9 0 Z" fill="#000" opacity=".2"/>' +
      '<path fill-rule="evenodd" d="' + outline + '" fill="none" stroke="#f0dbe8" stroke-opacity=".5" stroke-width="1.3" stroke-dasharray="3 4"/>' +
      '<g class="kr-plus" transform="translate(0,' + cy + ')" stroke="#ffb36b" stroke-width="2.2" stroke-linecap="round"><line x1="-7" y1="0" x2="7" y2="0"/><line x1="0" y1="-7" x2="0" y2="7"/></g></g>';
  }
  /* ── ТРЕВОЖНОЕ СЛОВО — СЛИВОВЫЙ БАРХАТНЫЙ МЕШОЧЕК НА ШНУРКЕ · решение D-635 ──
     Основатель 09.11.2026: на 4-м крючке — мешочек «бархат на шнурке»
     (вариант 1), цвет — сливовый (оригинал; оранжевый — «похож на
     коричневый дешёвый мешочек»). Мешочек всегда один и тот же до байта:
     по нему не узнать, заведено ли слово (правило lockSection). Рисунок —
     scratchpad meshochek/gen.js, p1. Охраняется tools/klyuchnica-check.mjs. */
  function krPouch(x, rot) {
    var body = "M-8 2 C-12 12 -29 30 -32 62 C-35 98 -24 125 1 126 C26 125 36 98 33 62 C30 30 12 12 8 2 Z";
    var frill = "M-8 1 C-12 -2 -17 -6 -16 -13 C-12 -10 -8 -15 -3 -12 C0 -16 4 -15 6 -11 C10 -14 15 -10 17 -12 C17 -5 12 -2 8 1 Z";
    var y0 = -10;
    var inner = '<defs><clipPath id="krPc1"><path d="' + body + '"/></clipPath><clipPath id="krPc1f"><path d="' + frill + '"/></clipPath></defs>' +
      '<g filter="url(#krCord)"><path d="M-3 ' + y0 + " C-7 " + (y0 - 12) + " -7 -41 0 -41.5 C7 -41 7 " + (y0 - 12) + " 3 " + y0 + '" fill="none" stroke="url(#krCordG)" stroke-width="2.6" stroke-linecap="round"/></g>' +
      '<g filter="url(#krVelvet)"><path d="' + frill + '" fill="url(#krPlum)"/><path d="' + body + '" fill="url(#krPlum)"/></g>' +
      '<g clip-path="url(#krPc1f)" filter="url(#krSoft1)"><path d="M-3 -12 L-2 0 M6 -11 L3 0" stroke="#0a0308" stroke-opacity=".55" stroke-width="1.4"/></g>' +
      '<g clip-path="url(#krPc1)"><g fill="none" stroke-linecap="round">' +
        '<path d="M-3 8 C-10 34 -17 70 -14 122 M6 8 C11 40 16 76 12 124 M1 10 C4 50 26 80 24 116" stroke="#070205" stroke-opacity=".62" stroke-width="7" filter="url(#krSoft)"/>' +
        '<path d="M-6 9 C-13 36 -21 74 -19 116" stroke="#d08cbc" stroke-opacity=".13" stroke-width="3" filter="url(#krSoft)"/>' +
        '<path d="M-12 30 C-24 50 -30 80 -28 104" stroke="#d08cbc" stroke-opacity=".08" stroke-width="5" filter="url(#krSoft)"/>' +
        '<path d="' + body + '" stroke="#c07aae" stroke-opacity=".2" stroke-width="2.4" filter="url(#krSoft1)"/></g></g>' +
      '<g filter="url(#krCord)" fill="none" stroke-linecap="round">' +
        '<path d="M-10 1.5 C-4 4.5 4 4.5 10 1.5" stroke="url(#krCordG)" stroke-width="3.2"/>' +
        '<path d="M-10 -1.2 C-4 1.4 4 1.4 10 -1.2" stroke="url(#krCordG)" stroke-width="2.6"/>' +
        '<path d="M8.5 2 C15 9 17 22 13.5 36" stroke="url(#krCordG)" stroke-width="2.3"/>' +
        '<path d="M9 3 C19 11 23 27 21 44" stroke="url(#krCordG)" stroke-width="2.3"/></g>' +
      '<g filter="url(#krMetal)"><rect x="11" y="34" width="5" height="11" rx="2.5" fill="url(#krIron)" transform="rotate(-12 13.5 39)"/><rect x="18.6" y="42" width="5" height="11" rx="2.5" fill="url(#krIron)" transform="rotate(-4 21 47)"/></g>';
    return '<g class="kr-pouch" transform="translate(' + (x + 12) + ',53) rotate(' + rot + ')">' +
      '<circle r="10" fill="none" stroke="url(#krIron)" stroke-width="2.6"/>' +
      '<circle r="10" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width=".8" transform="translate(-.8,-.8)"/>' +
      '<g transform="translate(0,44) scale(.92)">' + inner + "</g></g>";
  }
  function krSvg(slots) {
    var defs = '<defs>' +
      '<filter id="krMetal" x="-40%" y="-10%" width="180%" height="130%">' +
        '<feGaussianBlur in="SourceAlpha" stdDeviation="1.3" result="b"/>' +
        '<feSpecularLighting in="b" surfaceScale="3.6" specularConstant="1.25" specularExponent="34" lighting-color="#fff4e0" result="s"><fePointLight x="-80" y="-160" z="160"/></feSpecularLighting>' +
        '<feComposite in="s" in2="SourceAlpha" operator="in" result="sp"/>' +
        '<feDiffuseLighting in="b" surfaceScale="2.4" diffuseConstant="0.9" lighting-color="#ffffff" result="d"><feDistantLight azimuth="235" elevation="48"/></feDiffuseLighting>' +
        '<feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1.15" k2="0.15" k3="0" k4="0" result="dl"/>' +
        '<feComposite in="dl" in2="sp" operator="arithmetic" k1="0" k2="1" k3="0.9" k4="0" result="lit"/>' +
        '<feComposite in="lit" in2="SourceAlpha" operator="in" result="lit2"/>' +
        '<feOffset in="SourceAlpha" dx="7" dy="12" result="o"/><feGaussianBlur in="o" stdDeviation="5" result="ob"/>' +
        '<feColorMatrix in="ob" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .66 0" result="sh"/>' +
        '<feMerge><feMergeNode in="sh"/><feMergeNode in="lit2"/></feMerge></filter>' +
      '<linearGradient id="krIron" x1="0" y1="0" x2="1" y2=".3"><stop offset="0" stop-color="#7d7a86"/><stop offset=".3" stop-color="#3a3842"/><stop offset=".6" stop-color="#1c1b21"/><stop offset=".85" stop-color="#2c2a33"/><stop offset="1" stop-color="#6a6774"/></linearGradient>' +
      '<linearGradient id="krRail" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a8794"/><stop offset=".4" stop-color="#34323b"/><stop offset="1" stop-color="#121116"/></linearGradient>' +
'<filter id="krVelvet" x="-45%" y="-15%" width="190%" height="140%">' +
        '<feGaussianBlur in="SourceAlpha" stdDeviation="3.2" result="b"/>' +
        '<feDiffuseLighting in="b" surfaceScale="5" diffuseConstant="1" lighting-color="#ffffff" result="d"><feDistantLight azimuth="235" elevation="50"/></feDiffuseLighting>' +
        '<feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1.0" k2="0.04" k3="0" k4="0" result="dl"/>' +
        '<feSpecularLighting in="b" surfaceScale="4" specularConstant="0.3" specularExponent="16" lighting-color="#fff4e0" result="s"><fePointLight x="-80" y="-160" z="160"/></feSpecularLighting>' +
        '<feComposite in="s" in2="SourceAlpha" operator="in" result="sp"/>' +
        '<feComposite in="dl" in2="sp" operator="arithmetic" k1="0" k2="1" k3=".55" k4="0" result="lit"/>' +
        '<feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" result="n"/>' +
        '<feColorMatrix in="n" type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 0 1" result="ng"/>' +
        '<feComposite in="lit" in2="ng" operator="arithmetic" k1="0" k2="1" k3="0.035" k4="-0.0175" result="gr"/>' +
        '<feComposite in="gr" in2="SourceAlpha" operator="in" result="lit2"/>' +
        '<feOffset in="SourceAlpha" dx="7" dy="12" result="o"/><feGaussianBlur in="o" stdDeviation="5" result="ob"/>' +
        '<feColorMatrix in="ob" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .66 0" result="sh"/>' +
        '<feMerge><feMergeNode in="sh"/><feMergeNode in="lit2"/></feMerge></filter>' +
      '<filter id="krCord" x="-45%" y="-15%" width="190%" height="140%">' +
        '<feGaussianBlur in="SourceAlpha" stdDeviation="0.9" result="b"/>' +
        '<feDiffuseLighting in="b" surfaceScale="5" diffuseConstant="1" lighting-color="#ffffff" result="d"><feDistantLight azimuth="235" elevation="50"/></feDiffuseLighting>' +
        '<feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1.0" k2="0.04" k3="0" k4="0" result="dl"/>' +
        '<feSpecularLighting in="b" surfaceScale="4" specularConstant="0.5" specularExponent="14" lighting-color="#fff4e0" result="s"><fePointLight x="-80" y="-160" z="160"/></feSpecularLighting>' +
        '<feComposite in="s" in2="SourceAlpha" operator="in" result="sp"/>' +
        '<feComposite in="dl" in2="sp" operator="arithmetic" k1="0" k2="1" k3=".55" k4="0" result="lit"/>' +
        '<feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" result="n"/>' +
        '<feColorMatrix in="n" type="matrix" values=".33 .33 .33 0 0 .33 .33 .33 0 0 .33 .33 .33 0 0 0 0 0 0 1" result="ng"/>' +
        '<feComposite in="lit" in2="ng" operator="arithmetic" k1="0" k2="1" k3="0.05" k4="-0.025" result="gr"/>' +
        '<feComposite in="gr" in2="SourceAlpha" operator="in" result="lit2"/>' +
        '<feOffset in="SourceAlpha" dx="7" dy="12" result="o"/><feGaussianBlur in="o" stdDeviation="5" result="ob"/>' +
        '<feColorMatrix in="ob" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .66 0" result="sh"/>' +
        '<feMerge><feMergeNode in="sh"/><feMergeNode in="lit2"/></feMerge></filter>' +
      '<filter id="krSoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="2.6"/></filter>' +
      '<filter id="krSoft1" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation=".7"/></filter>' +
      '<radialGradient id="krPlum" cx="36%" cy="42%" r="70%"><stop offset="0" stop-color="#5c1d4a"/><stop offset=".5" stop-color="#34102b"/><stop offset="1" stop-color="#14050e"/></radialGradient>' +
      '<linearGradient id="krCordG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a4a58"/><stop offset="1" stop-color="#241c25"/></linearGradient>' +
      '<radialGradient id="krPool" cx="50%" cy="10%" r="75%"><stop offset="0" stop-color="#ffb36b" stop-opacity=".14"/><stop offset="1" stop-color="#ffb36b" stop-opacity="0"/></radialGradient>' +
      "</defs>";
    var out = '<svg class="kr-svg" viewBox="0 0 516 262" aria-hidden="true" focusable="false">' + defs +
      '<ellipse cx="258" cy="150" rx="250" ry="150" fill="url(#krPool)"/>' +
      '<g><rect x="30" y="22" width="456" height="11" rx="5.5" fill="url(#krRail)"/><rect x="34" y="23.5" width="448" height="2.6" rx="1.3" fill="#fff" opacity=".25"/>' +
      '<circle cx="30" cy="27.5" r="9" fill="url(#krRail)"/><circle cx="486" cy="27.5" r="9" fill="url(#krRail)"/>' +
      '<circle cx="27" cy="24.5" r="3" fill="#fff" opacity=".35"/><circle cx="483" cy="24.5" r="3" fill="#fff" opacity=".35"/></g>';
    KR_X.forEach(function (x) { out += krHook(x); });
    slots.forEach(function (k, i) {
      if (k.secret) { out += krPouch(KR_X[i], k.rot); return; }
      out += k.has ? krHang(KR_X[i], k.rot, KR_BOW[k.bow]) : krGhost(KR_X[i], KR_BOW[k.bow], k.cy);
    });
    return out + "</svg>";
  }
  /* Что висит — спрашивается у замка открытого сеанса, а не помнится окном. */
  function krSlots() {
    var V = window.sbVault;
    var locked = false, spare = false, hw = false;
    try {
      locked = !!(V && V.available() && V.isLocked());
      spare = !!(locked && V.recoveryState && (V.recoveryState() || {}).at);
      hw = !!(locked && V.hwState && (V.hwState() || {}).on);
    } catch (e) { locked = false; spare = false; hw = false; }
    return [
      { id: "password", bow: "tre", rot: -5, cy: -6, has: locked, name: tr("acc.k.password"), go: locked ? "#sbLockChange, #sbLockCur" : "#sbLockP1" },
      { id: "spare", bow: "ring", rot: 4, cy: -6, has: spare, name: tr("lock.spare"), go: locked ? "#sbLockSpare" : "#sbLockP1" },
      { id: "device", bow: "sq", rot: -3, cy: -6, has: hw, name: tr("lock.hw"), go: locked ? "#sbLockHwAdd, #sbLockHwState" : "#sbLockP1" },
      { id: "duress", bow: "heart", rot: 5, cy: -3, has: false, secret: true, name: tr("lock.duress"), go: locked ? "#sbLockDuressSet" : "#sbLockP1" }
    ];
  }
  function krMark() {
    return '<svg class="acc-mark" viewBox="0 0 100 100" aria-hidden="true"><path class="sb-hs" d="M26.04 10.06H69.97V30.03H36.96A6.93 6.93 0 0 0 30.03 36.96V69.97H10.06V26.04A15.98 15.98 0 0 1 26.04 10.06Z"/>' +
      '<path class="sb-hb" d="M73.96 89.94H30.03V69.97H63.04A6.93 6.93 0 0 0 69.97 63.04V30.03H89.94V73.96A15.98 15.98 0 0 1 73.96 89.94Z"/></svg>';
  }
  function keyRack() {
    var slots = krSlots();
    var V = window.sbVault;
    var locked = false;
    try { locked = !!(V && V.available() && V.isLocked()); } catch (e) { locked = false; }
    var cols = slots.map(function (k) {
      var state = k.secret ? tr("acc.k.secret") : (k.has ? tr("acc.k.here") : tr("acc.k.hang"));
      return '<button type="button" class="kr-col' + (k.has ? " has" : " empty") + (k.secret ? " secret" : "") + '" data-key="' + k.id + '" data-go="' + esc(k.go) + '"' +
        ' aria-expanded="false" aria-controls="sbKrFold" aria-label="' + esc(k.name + " — " + state) + '"><span class="kr-name">' + esc(k.name) + '</span><span class="kr-state">' + esc(state) + "</span></button>";
    }).join("");
    /* Под планкой — раскрытие одного ключа (D-637): касание ключа открывает
       ровно его форму, повторное — сворачивает; открыто одно за раз. */
    return '<div class="key-rack" id="sbKeyRack">' + krSvg(slots) + '<div class="kr-cols">' + cols + "</div></div>" +
      '<div class="kr-fold" id="sbKrFold" hidden></div>' +
      '<div class="acc-acts kr-acts">' +
        (locked ? '<button type="button" class="btn primary wide kr-lock" id="sbAccLockNow">' + esc(tr("lock.now")) + "</button>" : "") +
        '<button type="button" class="btn ghost wide kr-leave" id="sbAccLeaveMore">' + esc(tr("acc.leaveMore")) + "</button>" +
      "</div>" +
      '<p class="kr-more">' + esc(tr("acc.inSettings")) + ' <button type="button" class="btn link kr-settings" id="sbAccToSettings">' + esc(tr("acc.inSettingsLink")) + "</button></p>";
  }
  function wireKeyRack(body) {
    body.querySelectorAll(".kr-col").forEach(function (b) {
      b.addEventListener("click", function () { krFold(body, b.getAttribute("data-key")); });
    });
    var lockNow = body.querySelector("#sbAccLockNow");
    /* «Запереть сейчас» — то же действие, что в Настройках (D-359, D-360). */
    if (lockNow) lockNow.addEventListener("click", function () {
      var V = window.sbVault;
      window.sbSessionClose(function () { window.location.reload(); });
      if (V && V.shutAll) { try { V.shutAll(); } catch (e) { /* ignore */ } }
    });
    var leaveMore = body.querySelector("#sbAccLeaveMore");
    if (leaveMore) leaveMore.addEventListener("click", function () { accountGo("#sbAccLeave"); });
    var toSettings = body.querySelector("#sbAccToSettings");
    if (toSettings) toSettings.addEventListener("click", function () {
      if (accountPanel && accountPanel.close) accountPanel.close();
      var openIt = window.sbOpenApp || window.toggleApp;
      if (typeof openIt === "function") openIt("settings");
      setTimeout(function () {
        var tab = doc.querySelector('.window[data-app="settings"] [data-section="privacy"]');
        if (tab) tab.click();
      }, 260);
    });
  }
  /* Ключ ведёт к своему месту в окне: первое найденное по списку прокручивается
     в середину и получает фокус. */
  /* Раскрыть под планкой форму ключа; тот же ключ ещё раз — свернуть. */
  function krFold(body, key) {
    var fold = body.querySelector("#sbKrFold");
    if (!fold) return;
    var open = fold.getAttribute("data-key");
    body.querySelectorAll(".kr-col").forEach(function (c) { c.classList.remove("open"); c.setAttribute("aria-expanded", "false"); });
    if (open === key && !fold.hidden) { fold.hidden = true; fold.removeAttribute("data-key"); fold.innerHTML = ""; return; }
    fold.setAttribute("data-key", key);
    fold.innerHTML = lockSection(key) + '<p class="panel-err" id="sbAccErr" role="alert"></p>';
    fold.hidden = false;
    var col = body.querySelector('.kr-col[data-key="' + key + '"]');
    if (col) { col.classList.add("open"); col.setAttribute("aria-expanded", "true"); }
    wireLockBody(fold);
    var first = fold.querySelector("input:not([hidden]):not([type=file])");
    if (first) { try { first.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
  }
  window.sbKeyRackFold = function (key) { var b = panelBody("sbAccountOverlay"); if (b) krFold(b, key); };
  /* Подробности живут в Настройках → «Ключи и замок» (D-637): ключ ведёт
     туда, окно ключницы закрывается. */
  function accountGo(selectors) {
    if (accountPanel && accountPanel.close) accountPanel.close();
    window.sbOpenAccountAt(selectors);
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
      (gift.sigil ? '<span class="acc-sigil" aria-hidden="true">' + gift.sigil + "</span>" : krMark()) +
      '<span class="acc-who-text"><b>' + esc(name || tr("acc.guest")) + "</b>" +
      (gift.title ? '<span class="acc-who-sub acc-title">' + esc(gift.title) + "</span>" : "") +
      (gift.serial ? '<span class="acc-who-sub acc-serial" data-sb-nolang>' + esc(gift.serial) + "</span>" : "") +
      "</span></div>";

    /* ── ОКНО — ТОЛЬКО КЛЮЧНИЦА · решение D-637 (основатель 09.11.2026) ─────
       По D-620 в окне «Аккаунт» остаются имя, ключница с крючками, «Запереть
       сейчас», «Уйти…» и строка «Ковчег и как устроен шифр — в Настройках».
       Всё прежнее — имя в системе, замок, коды, копии, уход и стирание — живёт
       в Настройках → «Ключи и замок» теми же узлами и той же разводкой
       (accountDetails). Ничего не потеряно, только переехало.
       Охраняется tools/klyuchnica-check.mjs. */
    body.innerHTML = '<div class="panel-scroll">' + who + keyRack() + "</div>";
    wireKeyRack(body);
    if (window.sbPaintIris) window.sbPaintIris();
  }
  /* Подробности учётной записи — в любом хозяине (Настройки → «Ключи и замок»). */
  var detailsSaid = "";
  function accountDetails(host) {
    if (!host) return;
    /* Раскрытый ключ под планкой сворачивается: те же поля не стоят дважды. */
    var rf = doc.getElementById("sbKrFold");
    if (rf) { rf.hidden = true; rf.innerHTML = ""; rf.removeAttribute("data-key"); }
    var parts = accountBodyParts();
    /* Сказанное не стирается перерисовкой: если раздел встал заново (замок
       встал, окно Настроек перерисовалось), строка ответа остаётся. */
    var oldErr = host.querySelector("#sbAccErr");
    var said = oldErr ? oldErr.textContent : detailsSaid;
    host.innerHTML = '<div id="sbAccountDetails" class="acc-details">' +
      '<div class="acc-sec acc-detail">' + parts.field + "</div>" +
      /* Замок целиком — и формы ключей тоже (D-637: «каждая функция доступна
         в Настройках»); под планкой ключницы — те же формы по одной. */
      '<div class="acc-sec">' + lockSection() + "</div>" +
      '<div class="acc-sec">' + backupSection() + "</div>" +
      '<div class="acc-sec">' + parts.leaving + "</div>" +
      '<p class="panel-err" id="sbAccErr" role="alert"></p>' +
      "</div>";
    var box = host.querySelector("#sbAccountDetails");
    var ne = box.querySelector("#sbAccErr");
    if (ne) {
      if (said) ne.textContent = said;
      /* Последнее сказанное помнится модулем: раздел могут перерисовать
         целиком (смена языка при постановке замка перерисовывает Настройки). */
      detailsSaid = ne.textContent;
      new MutationObserver(function () {
        detailsSaid = ne.textContent;
        /* Ответ пришёл в прежний, уже перерисованный раздел (обещание замка
           дошло позже) — он переносится в тот, что сейчас на экране. */
        if (!ne.isConnected) {
          var live = doc.querySelector("#sbAccountDetails #sbAccErr");
          if (live && live !== ne && live.textContent !== detailsSaid) live.textContent = detailsSaid;
        }
      }).observe(ne, { childList: true, characterData: true, subtree: true });
    }
    wireAccountBody(box);
    wireLockBody(box);
    wireBackupBody(box);
    if (window.sbPaintIris) window.sbPaintIris();
  }
  window.sbAccountDetails = accountDetails;
  function leavingHtml() {
    return       '<h4 class="panel-sub">' + esc(tr("acc.leave")) + "</h4>" +
      '<p class="panel-copy">' + esc(tr("acc.leaveSub")) + "</p>" +
      '<div class="acc-acts"><button type="button" class="btn primary wide" id="sbAccLeave">' + esc(tr("acc.leave")) + "</button></div>" +
      '<p class="panel-copy dim">' + esc(tr("acc.wipeSub")) + "</p>" +
      '<div class="acc-acts"><button type="button" class="btn ghost danger" id="sbAccWipe">' + esc(tr("acc.wipe")) + "</button></div>" +
      '<p class="acc-truth">' + esc(tr("acc.truth")) + "</p>" +
      '<div class="acc-acts"><button type="button" class="btn link" id="sbAccSignOut">' + esc(tr("acc.signout")) + "</button></div>";
  }

  /* Части подробностей строятся тем же кодом, что и прежде; окно ключницы
     их не показывает. */
  function accountBodyParts() {
    var name = (window.sbGetUsername ? window.sbGetUsername() : "") || "";
    /* пустое имя — пустое поле с «гость» подсказкой; предел — как у хранения, 24 (D-1000) */
    var guestPh = window.sbGuestWord ? window.sbGuestWord() : "";
    if (window.sbUsernameStored && !window.sbUsernameStored()) name = "";
    return {
      field: '<label class="acc-field"><span class="acc-label">' + esc(tr("acc.name")) + "</span>" +
        '<input type="text" id="sbAccName" maxlength="24" autocomplete="username" autocapitalize="off" spellcheck="false" placeholder="' + esc(guestPh) + '" value="' + esc(name) + '">' +
        "</label>" +
        '<p class="panel-copy dim">' + esc(tr("acc.nameSub")) + "</p>" +
        '<div class="acc-acts"><button type="button" class="btn ghost" id="sbAccSave">' + esc(tr("acc.save")) + "</button></div>",
      leaving: leavingHtml()
    };
  }
  /* Перерисовать то, что сейчас на экране: окно ключницы, если открыто, и
     подробности в Настройках, если они стоят. */
  function accountRefresh() {
    var o = doc.getElementById("sbAccountOverlay");
    if (o && o.classList.contains("open")) accountBody();
    var d = doc.getElementById("sbAccountDetails");
    if (d && d.parentNode) accountDetails(d.parentNode);
  }
  window.sbAccountRefresh = accountRefresh;

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
        accountRefresh();
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
        /* Стирать при замке вправе только писатель открытого мира (D-353,
           шаг 4): читающая или замёрзшая вкладка стёрла бы поверх более
           нового состояния другой вкладки. */
        if (V && V.isLocked && V.isLocked() && V.mayErase && !V.mayErase()) { say(tr("acc.wipeWriter")); return; }
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
  /* Подробности учётной записи — в Настройках → «Ключи и замок» (D-637).
     Обещание: исполняется, когда раздел стоит на экране. */
  window.sbOpenAccountDetails = function () {
    detailsSaid = "";   /* новое открытие — новый разговор */
    return new Promise(function (res) {
      var openIt = window.sbOpenApp || window.toggleApp;
      var win = doc.querySelector('.window[data-app="settings"]');
      if (!win && typeof openIt === "function") openIt("settings");
      var tries = 0;
      /* Уже стоят — перерисовать по нынешнему состоянию замка (как прежнее
         открытие окна перерисовывало его). */
      var stood = doc.getElementById("sbAccountDetails");
      if (stood && stood.parentNode) accountDetails(stood.parentNode);
      (function wait() {
        var w = doc.querySelector('.window[data-app="settings"]');
        var tab = w && w.querySelector('[data-section="account"]');
        if (tab && !w.querySelector("#sbAccountDetails")) tab.click();
        var d = doc.getElementById("sbAccountDetails");
        /* «Стоит на экране» — значит и окно долетело (D-693): пока на нём
           класс opening, оно ещё едет, и то, что позвавший найдёт в разделе,
           через миг окажется на 20 px в стороне — палец или мышь, нацеленные
           на «Запереть всё», попадали в пустой стол («Стол убран»), и
           «всё равно» не появлялась вовсе. */
        if (d && !(w && w.classList.contains("opening"))) { if (window.focusWindow) { try { window.focusWindow("settings"); } catch (e) { /* ignore */ } } res(d); return; }
        if (++tries > 60) { res(null); return; }
        setTimeout(wait, 60);
      })();
    });
  };
  window.sbOpenAccountAt = function (selectors) {
    return window.sbOpenAccountDetails().then(function (host) {
      if (!host) return;
      var el = null, list = String(selectors || "").split(","), i;
      for (i = 0; i < list.length && !el; i++) el = host.querySelector(list[i].trim());
      if (!el) return;
      try { el.scrollIntoView({ block: "center" }); if (el.focus) el.focus(); } catch (e) { /* ignore */ }
    });
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
  var LOCK_GLYPH = sbZnak("vault");
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
     Сказанное отмечается под замком этой системы и не повторяется. */
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
      var h = window.showToast ? window.showToast(tr("knock.title"), tr("knock.body", { n: fresh.length, when: shown }), "", true, "", "event") : null;
      /* голос говорит о стуке своей фразой; «на людях» — без времени (D-816) */
      if (h && window.sbVoice && window.sbVoice.retell) window.sbVoice.retell(h, function () { return window.sbVoice.form("voice.knock", { n: fresh.length, when: shown }); }, "knock", { sticky: true });
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
