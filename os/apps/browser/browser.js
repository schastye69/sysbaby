/* sys.baby OS — Браузер.
 *
 * ПОВОД, дословно от основателя 26.08.2026: «прошу совет сделать рабочий
 * прототип браузера. обязательно рабочий. и обязательно, чтобы работал на
 * телефоне».
 *
 * ГРАНИЦА, НАЗВАННАЯ ВСЛУХ. Чужую страницу внутри рамки показать удаётся НЕ
 * ВСЕГДА: большинство сайтов присылают X-Frame-Options или frame-ancestors и
 * запрещают себя показывать. Обойти это можно только сервером-посредником —
 * а у sys.baby серверной стороны нет и по обещанию не будет. Значит браузер
 * честен: где разрешают — рисует у себя, где нет — рядом всегда лежит выход
 * наружу.
 *
 * И ВТОРАЯ ГРАНИЦА, ЕЩЁ ВАЖНЕЕ ПЕРВОЙ. Изнутри страницы НЕЛЬЗЯ надёжно
 * узнать, отказал сайт или просто грузится медленно: кросс-доменную рамку
 * читать не дают. Поэтому здесь нет угадывания. Кнопка «Вкладкой» стоит на
 * виду с первой секунды — не как признание поражения, а как обычный путь.
 * Система, которая делает вид, будто знает, чего не знает, врёт дважды: и
 * когда угадала неверно, и когда угадала верно.
 *
 * ЧЕГО ЗДЕСЬ НЕТ И ПОЧЕМУ. Домашней страницы нет: пустое окно НИКУДА не
 * ходит. Это не вкус — в системе есть закон «ноль внешних запросов»
 * (liveworks-check), и браузер его соблюдает, а не отменяет. Первый запрос
 * делает человек, а не система.
 *
 * Охраняется tools/browser-check.mjs.
 */
(function () {
  "use strict";

  var doc = document;
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.6"/><path d="M3.5 12h17"/><path d="M12 3.4c2.4 2.4 3.6 5.3 3.6 8.6s-1.2 6.2-3.6 8.6c-2.4-2.4-3.6-5.3-3.6-8.6S9.6 5.8 12 3.4Z"/></svg>';

  var HIST_KEY = "sysbaby.browser.history";
  var MARK_KEY = "sysbaby.browser.marks";
  var HIST_CAP = 200;

  function t(key, vars) { return typeof window.sbT === "function" ? window.sbT(key, vars) : key; }
  function esc(v) {
    return String(v == null ? "" : v).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }
  function readJSON(k, dflt) {
    try { var v = window.sbDB && window.sbDB.get(k); return v ? JSON.parse(v) : dflt; }
    catch (err) { console.error("[browser] read failed", err); return dflt; }
  }
  function writeJSON(k, v) {
    try { if (window.sbDB) window.sbDB.set(k, JSON.stringify(v)); }
    catch (err) { console.error("[browser] write failed", err); }
  }

  /* ── РАЗБОР АДРЕСА — ЧИСТАЯ ФУНКЦИЯ ───────────────────────────────────
     Вынесена наружу нарочно: закон должен проверять разбор, не открывая
     ни одной страницы и не выходя в сеть. Тот же приём, что у хода краски
     (sbAccentForTime) и у срока заметки (sbNoteDue). */
  var SCHEME = /^[a-z][a-z0-9+.-]*:\/\//i;
  var LOOKS_LIKE_HOST = /^[a-z0-9-]+(\.[a-z0-9-]+)+(:\d+)?(\/.*)?$/i;
  var LOOKS_LIKE_IP = /^\d{1,3}(\.\d{1,3}){3}(:\d+)?(\/.*)?$/;
  var LOCALHOST = /^localhost(:\d+)?(\/.*)?$/i;
  window.sbBrowserResolve = function (raw) {
    var s = String(raw == null ? "" : raw).trim();
    if (!s) return { kind: "none", url: "", label: "" };
    if (SCHEME.test(s)) return { kind: "url", url: s, label: s };
    if (LOOKS_LIKE_HOST.test(s) || LOOKS_LIKE_IP.test(s) || LOCALHOST.test(s)) {
      return { kind: "url", url: "https://" + s, label: s };
    }
    return { kind: "search", url: "https://duckduckgo.com/?q=" + encodeURIComponent(s), label: s };
  };

  window.sbBrowserHistory = function () { var v = readJSON(HIST_KEY, []); return Array.isArray(v) ? v : []; };
  window.sbBrowserBookmarks = function () { var v = readJSON(MARK_KEY, []); return Array.isArray(v) ? v : []; };
  function remember(url, label) {
    var h = window.sbBrowserHistory().filter(function (x) { return x.url !== url; });
    h.unshift({ url: url, label: label || url, at: Date.now() });
    writeJSON(HIST_KEY, h.slice(0, HIST_CAP));
  }
  window.sbBrowserBookmark = function (url, label) {
    if (!url) return null;
    var m = window.sbBrowserBookmarks().filter(function (x) { return x.url !== url; });
    m.unshift({ url: url, label: label || url, at: Date.now() });
    writeJSON(MARK_KEY, m);
    return m;
  };
  window.sbBrowserForget = function (url) {
    writeJSON(MARK_KEY, window.sbBrowserBookmarks().filter(function (x) { return x.url !== url; }));
    writeJSON(HIST_KEY, window.sbBrowserHistory().filter(function (x) { return x.url !== url; }));
  };

  var I = {
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5.5 8 12l6.5 6.5"/></svg>',
    fwd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 5.5 16 12l-6.5 6.5"/></svg>',
    again: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 4.5V10h-5.5"/></svg>',
    mark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 4.5h11v15l-5.5-4-5.5 4z"/></svg>',
    out: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M13.5 5.5H19V11"/><path d="M19 5.5 11 13.5"/><path d="M17 14.5v3.5a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5V8.5A1.5 1.5 0 0 1 6 7h3.5"/></svg>'
  };

  function markup() {
    return '<div class="app-browser">' +
      '<div class="br-bar">' +
        '<button type="button" class="br-btn br-back" aria-label="' + esc(t("br.back")) + '" title="' + esc(t("br.back")) + '">' + I.back + "</button>" +
        '<button type="button" class="br-btn br-fwd" aria-label="' + esc(t("br.fwd")) + '" title="' + esc(t("br.fwd")) + '">' + I.fwd + "</button>" +
        '<button type="button" class="br-btn br-again" aria-label="' + esc(t("br.again")) + '" title="' + esc(t("br.again")) + '">' + I.again + "</button>" +
        '<input class="br-url" type="text" inputmode="url" autocomplete="off" autocapitalize="off" spellcheck="false" ' +
          'placeholder="' + esc(t("br.placeholder")) + '" aria-label="' + esc(t("br.placeholder")) + '" />' +
        '<button type="button" class="br-btn br-mark" aria-label="' + esc(t("br.bookmark")) + '" title="' + esc(t("br.bookmark")) + '">' + I.mark + "</button>" +
        /* ВЫХОД НАРУЖУ СТОИТ ЗДЕСЬ ВСЕГДА. Не «когда не получилось» — система
           не умеет узнать, получилось ли, и делать вид не станет. */
        '<a class="br-btn br-out" href="about:blank" target="_blank" rel="noopener noreferrer" ' +
          'aria-label="' + esc(t("br.openTab")) + '" title="' + esc(t("br.openTab")) + '">' + I.out + "</a>" +
      "</div>" +
      '<div class="br-stage">' +
        '<div class="br-empty">' +
          '<div class="br-empty-glyph">' + ICON + "</div>" +
          '<p class="br-empty-title">' + esc(t("br.empty.title")) + "</p>" +
          '<p class="br-empty-sub">' + esc(t("br.empty.sub")) + "</p>" +
          '<div class="br-marks"></div>' +
        "</div>" +
      "</div>" +
    "</div>";
  }

  function paintMarks(host) {
    var box = host.querySelector(".br-marks");
    if (!box) return;
    var marks = window.sbBrowserBookmarks().slice(0, 6);
    var hist = window.sbBrowserHistory().slice(0, 6);
    var list = marks.length ? marks : hist;
    if (!list.length) { box.innerHTML = ""; return; }
    box.innerHTML = '<div class="br-marks-head">' +
        esc(marks.length ? t("br.saved") : t("br.recent")) + "</div>" +
      list.map(function (m) {
        return '<button type="button" class="br-mark-item" data-go="' + esc(m.url) + '">' +
          esc(m.label || m.url) + "</button>";
      }).join("");
  }

  function render(win) {
    var host = win && win.el ? win.el.querySelector(".window-body") : null;
    if (!host) return;
    /* Прокрутка человека переживает перерисовку — средство оболочки, общее для
       всех приложений (D-098). Обёртка стоит ВПЛОТНУЮ к записи: закон смотрит
       на несколько строк назад, и этот же урок уже был оплачен смотровой. */
    var _sbKeep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
    host.innerHTML = markup();
    if (_sbKeep) _sbKeep();
    var app = host.querySelector(".app-browser");
    var stage = app.querySelector(".br-stage");
    var input = app.querySelector(".br-url");
    var out = app.querySelector(".br-out");
    var stack = [], at = -1, frame = null;

    function syncNav() {
      app.querySelector(".br-back").disabled = at <= 0;
      app.querySelector(".br-fwd").disabled = at >= stack.length - 1;
      app.querySelector(".br-again").disabled = at < 0;
      app.querySelector(".br-mark").disabled = at < 0;
    }
    function show(url, push) {
      if (!frame) {
        frame = doc.createElement("iframe");
        frame.className = "br-frame";
        frame.setAttribute("referrerpolicy", "no-referrer");
        frame.setAttribute("allow", "clipboard-write; fullscreen");
        frame.setAttribute("title", t("br.frameTitle"));
        stage.innerHTML = "";
        stage.appendChild(frame);
      }
      frame.src = url;
      input.value = url;
      out.href = url;
      if (push) { stack = stack.slice(0, at + 1); stack.push(url); at = stack.length - 1; }
      remember(url, url);
      syncNav();
    }
    function go(raw, push) {
      var r = window.sbBrowserResolve(raw);
      if (r.kind === "none") return;
      show(r.url, push !== false);
    }

    input.addEventListener("keydown", function (ev) {
      if (ev.key !== "Enter") return;
      ev.preventDefault();
      go(input.value, true);
      try { input.blur(); } catch (e) { /* ignore */ }
    });
    app.querySelector(".br-back").addEventListener("click", function () {
      if (at <= 0) return; at--; show(stack[at], false);
    });
    app.querySelector(".br-fwd").addEventListener("click", function () {
      if (at >= stack.length - 1) return; at++; show(stack[at], false);
    });
    app.querySelector(".br-again").addEventListener("click", function () {
      if (at < 0) return; show(stack[at], false);
    });
    app.querySelector(".br-mark").addEventListener("click", function () {
      if (at < 0) return;
      window.sbBrowserBookmark(stack[at], stack[at]);
      if (window.showToast) window.showToast(t("br.bookmarked"), stack[at], "");
    });
    app.addEventListener("click", function (ev) {
      var b = ev.target.closest && ev.target.closest("[data-go]");
      if (b) go(b.getAttribute("data-go"), true);
    });

    paintMarks(app);
    syncNav();

    /* Рамка не должна жить дальше своего окна: чужая страница, оставшаяся в
       документе после закрытия, продолжала бы работать и звучать. Оболочка
       убирает окно из документа через 110 мс после закрытия — но рамку надо
       гасить СРАЗУ, на сигнале, а не ждать уборки: эти сто десять миллисекунд
       чужая страница ещё грузится и ещё может заиграть. Слушаем настоящий
       сигнал оболочки (window:closed), а не выдуманный крючок. */
    if (window.sbBus && typeof window.sbBus.on === "function") {
      window.sbBus.on("window:closed", function (p) {
        if (!p || p.id !== "browser") return;
        if (frame) { try { frame.src = "about:blank"; } catch (e) { /* ignore */ } }
        if (frame && frame.parentNode) frame.parentNode.removeChild(frame);
        frame = null;
      });
    }
  }

  if (typeof window.registerApp === "function") {
    window.registerApp("browser", {
      title: "Browser",
      i18n: {
        ru: { title: "Браузер", label: "Браузер" },
        ee: { title: "Brauser", label: "Brauser" }
      },
      label: "Browser",
      color: "linear-gradient(160deg,#9fe0c8 0%,#3ec39a 52%,#1f8f70 100%)",
      icon: ICON,
      size: { w: 900, h: 640 },
      render: render
    });
  }
})();
