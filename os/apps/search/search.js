/* sys.baby OS — Search (brand "Seek").
 *
 * Spec: os-apps.md sections 1 and 2.
 * Owns no storage. Reads every other app through the search-provider protocol
 * (sbNotesStore.load / sbMailAll+Search / sbFilesAll+Search / sbMessengerAll+
 * Search) so a result can never outlive the item it points at. A missing
 * provider simply removes that source.
 */
(function () {
  "use strict";

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="6.2"/><path d="m15.6 15.6 3.9 3.9"/></svg>';

  var TYPE_FALLBACK_COLOR = {
    app: "linear-gradient(160deg,#4a4e58 0%,#2a2c33 50%,#111216 100%)",
    note: "linear-gradient(160deg,#ffe08a 0%,#ffc24d 46%,#f59331 100%)",
    mail: "linear-gradient(160deg,#7fe0ff 0%,#38b6f5 46%,#0f8fd9 100%)",
    file: "linear-gradient(160deg,#66e0d8 0%,#2bb6c9 48%,#1481c4 100%)",
    message: "linear-gradient(160deg,#8bf0a4 0%,#37cf68 46%,#12a047 100%)"
  };

  var TYPE_APP = { note: "notes", mail: "mail", file: "files", message: "messenger" };
  /* Строки живут в STRINGS ядра (core/topbar.js); здесь только ключи. */
  function t(key, vars) { return typeof window.sbT === "function" ? window.sbT(key, vars) : key; }
  var TYPE_KICKER = { app: "sk.kicker.app", note: "sk.kicker.note", mail: "sk.kicker.mail", file: "sk.kicker.file", message: "sk.kicker.message" };

  /* -------------------------------------------------------------- helpers */

  function esc(value) {
    if (typeof window.escapeHtml === "function") return window.escapeHtml(value == null ? "" : String(value));
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function bodyOf(win) { return win && win.el ? win.el.querySelector(".window-body") : null; }

  function registry() {
    var sb = window.SysBaby || {};
    var apps = sb.apps || {};
    var order = Array.isArray(sb.order) ? sb.order : Object.keys(apps);
    var out = [];
    order.forEach(function (id) {
      var def = apps[id];
      if (!def || def.hidden) return;
      out.push({ id: id, title: window.sbAppTitle ? window.sbAppTitle(id) : (def.title || id), color: def.color || TYPE_FALLBACK_COLOR.app, icon: def.icon || ICON });
    });
    return out;
  }

  function appColor(appId, type) {
    var sb = window.SysBaby || {};
    var def = (sb.apps || {})[appId];
    if (def && def.color) return def.color;
    return TYPE_FALLBACK_COLOR[type] || TYPE_FALLBACK_COLOR.app;
  }

  function appIcon(appId) {
    var sb = window.SysBaby || {};
    var def = (sb.apps || {})[appId];
    return (def && (def.glyph || def.icon)) || ICON;
  }

  function callProvider(name, arg) {
    if (typeof window[name] !== "function") return [];
    try {
      var out = arg === undefined ? window[name]() : window[name](arg);
      return Array.isArray(out) ? out : [];
    } catch (err) {
      console.error("[search] provider " + name + " failed", err);
      return [];
    }
  }

  function notesProvider() {
    var store = window.sbNotesStore;
    if (!store || typeof store.load !== "function") return [];
    try { return store.load() || []; } catch (err) { console.error("[search] notes provider failed", err); return []; }
  }

  function noteTitle(text) {
    var lines = String(text == null ? "" : text).split("\n");
    for (var i = 0; i < lines.length; i++) if (lines[i].trim() !== "") return lines[i].slice(0, 80);
    return t("nt.untitled");
  }

  function noteSub(text) {
    var lines = String(text == null ? "" : text).split("\n");
    var titleIndex = -1;
    for (var i = 0; i < lines.length; i++) { if (lines[i].trim() !== "") { titleIndex = i; break; } }
    if (titleIndex < 0) return "";
    return lines.slice(titleIndex + 1).join(" ").trim();
  }

  /* --------------------------------------------------------- result rows */

  function noteRow(note) {
    return { type: "note", id: note.id, title: noteTitle(note.text), sub: noteSub(note.text) };
  }

  function mailRow(m) {
    return { type: "mail", id: m.id, title: m.subject || t("ml.noSubject"), sub: [m.from, m.snippet].filter(Boolean).join(" — "), payload: m };
  }

  function fileRow(f) {
    var parents = (f.path || []).slice(0, -1);
    return { type: "file", title: f.name, sub: parents.length ? parents.join(" / ") : t("fv.home"), payload: { name: f.name, path: (f.path || []).slice(), content: f.content } };
  }

  function messageRow(c) {
    return { type: "message", id: c.id, title: c.name, sub: c.last || "", payload: c };
  }

  function appRow(app) {
    return { type: "app", id: app.id, title: app.title, sub: t("menu.open", { app: app.title }) };
  }

  function collect(query) {
    var needle = String(query || "").trim().toLowerCase();
    var rows = [];

    registry().forEach(function (app) {
      var haystack = (app.title + " " + t("menu.open", { app: app.title })).toLowerCase();
      if (haystack.indexOf(needle) !== -1) rows.push(appRow(app));
    });

    notesProvider().forEach(function (note) {
      if (String(note.text || "").toLowerCase().indexOf(needle) !== -1) rows.push(noteRow(note));
    });

    callProvider("sbMailSearch", query).forEach(function (m) { rows.push(mailRow(m)); });
    callProvider("sbFilesSearch", query).forEach(function (f) { rows.push(fileRow(f)); });
    callProvider("sbMessengerSearch", query).forEach(function (c) { rows.push(messageRow(c)); });

    return rows;
  }

  function recentRows() {
    var rows = [];
    notesProvider()
      .slice()
      .sort(function (a, b) { return (b.updatedAt || 0) - (a.updatedAt || 0); })
      .slice(0, 2)
      .forEach(function (note) { rows.push(noteRow(note)); });
    callProvider("sbMailAll").slice(0, 2).forEach(function (m) { rows.push(mailRow(m)); });
    callProvider("sbFilesAll").slice(0, 2).forEach(function (f) { rows.push(fileRow(f)); });
    callProvider("sbMessengerAll").slice(0, 1).forEach(function (c) { rows.push(messageRow(c)); });
    return rows;
  }

  /* --------------------------------------------------------------- markup */

  function rowMarkup(row, index) {
    var appId = row.type === "app" ? row.id : TYPE_APP[row.type];
    var color = row.type === "app" ? appColor(row.id, "app") : appColor(appId, row.type);
    return '<button type="button" class="sk-row" data-row="' + index + '">' +
      '<span class="sk-tile" style="background:' + esc(color) + '">' + appIcon(appId) + "</span>" +
      /* Название и подпись найденного — это чужие данные: имя файла, тема
         письма, первая строка заметки. Переводится только вид записи. */
      '<span class="sk-row-text"' + (row.type === "app" ? "" : " data-sb-userdata") + ">" +
        '<span class="sk-row-title">' + esc(row.title) + "</span>" +
        '<span class="sk-row-sub">' + esc(row.sub || "") + "</span>" +
      "</span>" +
      '<span class="sk-kicker">' + esc(TYPE_KICKER[row.type] ? t(TYPE_KICKER[row.type]) : "") + "</span>" +
    "</button>";
  }

  function render(win) {
    var host = bodyOf(win);
    if (!host) return;
    if (typeof win._searchQuery !== "string") win._searchQuery = "";
    var query = win._searchQuery;
    var trimmed = query.trim();

    var rows, sections;
    if (!trimmed) {
      rows = recentRows();
      sections =
        '<div class="sk-section-title">' + esc(t("sk.suggested")) + "</div>" +
        '<div class="sk-chips">' +
          registry().map(function (app) {
            return '<button type="button" class="sk-chip" data-app="' + esc(app.id) + '">' + esc(app.title) + "</button>";
          }).join("") +
        "</div>" +
        (rows.length ? '<div class="sk-section-title">' + esc(t("sk.recent")) + '</div><div class="sk-rows">' + rows.map(rowMarkup).join("") + "</div>" : "");
    } else {
      rows = collect(trimmed);
      if (rows.length) {
        sections = '<div class="sk-count">' + esc(t(rows.length === 1 ? "sk.count.one" : "sk.count.many", { n: rows.length })) + "</div>" +
          '<div class="sk-rows">' + rows.map(rowMarkup).join("") + "</div>";
      } else {
        sections = '<div class="sk-none">' +
          '<div class="sk-none-glyph">' + ICON + "</div>" +
          '<p class="sk-none-title">' + esc(t("sk.none", { q: trimmed })) + "</p>" +
          '<p class="sk-none-sub">' + esc(t("sk.noneSub")) + "</p>" +
        "</div>";
      }
    }

    /* Прокрутка человека переживает перерисовку — средство оболочки,
     общее для всех приложений (D-099). */
    var _sbKeep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
    host.innerHTML =
      '<div class="app-search">' +
        '<div class="sk-field">' +
          '<span class="sk-field-icon">' + ICON + "</span>" +
          '<input type="text" id="skInput" class="sk-input" placeholder="' + esc(t("sk.ph")) + '" autocomplete="off" spellcheck="false" value="' + esc(query) + '">' +
          '<kbd class="sk-kbd">⌘K</kbd>' +
        "</div>" +
        '<div class="sk-results">' + sections + "</div>" +
      "</div>";
    if (_sbKeep) _sbKeep();

    wire(win, host, rows);

    setTimeout(function () {
      var input = bodyOf(win) && bodyOf(win).querySelector("#skInput");
      if (input && !(document.activeElement && document.activeElement.id === "skInput")) {
        input.focus();
        input.setSelectionRange(input.value.length, input.value.length);
      }
    }, 60);
  }

  function wire(win, host, rows) {
    var input = host.querySelector("#skInput");
    if (input) {
      input.addEventListener("input", function () {
        var caret = input.selectionStart;
        win._searchQuery = input.value;
        render(win);
        var again = bodyOf(win) && bodyOf(win).querySelector("#skInput");
        if (again) { again.focus(); if (caret != null) again.setSelectionRange(caret, caret); }
      });
    }

    host.querySelectorAll("[data-app]").forEach(function (chip) {
      chip.addEventListener("click", function () { openApp(chip.getAttribute("data-app")); });
    });

    host.querySelectorAll("[data-row]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var row = rows[parseInt(btn.getAttribute("data-row"), 10)];
        if (row) openRow(row);
      });
    });
  }

  function openApp(id) {
    if (typeof window.toggleApp !== "function") return;
    try { window.toggleApp(id); } catch (err) { console.error("[search] toggleApp failed", err); }
  }

  function openRow(row) {
    if (row.type === "app") { openApp(row.id); return; }
    var appId = TYPE_APP[row.type];
    openApp(appId);
    var win = typeof window.getOpenWindow === "function" ? window.getOpenWindow(appId) : null;
    if (!win) return;
    try {
      if (row.type === "note" && typeof window.sbNotesOpenResult === "function") window.sbNotesOpenResult(win, row.id);
      else if (row.type === "mail" && typeof window.sbMailOpenResult === "function") window.sbMailOpenResult(win, row.payload);
      else if (row.type === "file" && typeof window.sbFilesOpenResult === "function") window.sbFilesOpenResult(win, row.payload);
      else if (row.type === "message" && typeof window.sbMessengerOpenResult === "function") window.sbMessengerOpenResult(win, row.payload);
    } catch (err) {
      console.error("[search] jump to result failed", err);
    }
  }

  /* ------------------------------------------------------------- provider */

  window.sbSearchOpenQuery = function (win, query) {
    if (!win) return false;
    win._searchQuery = String(query == null ? "" : query);
    render(win);
    return true;
  };

  /* ------------------------------------------------------- registration */

  /* Перерисовка при смене языка — если в строке поиска ничего не набрано.
     Набранный запрос принадлежит посетителю, а не переводу. */
  if (window.sbBus && typeof window.sbBus.on === "function") {
    window.sbBus.on("translate:done", function () {
      var win = typeof window.getOpenWindow === "function" ? window.getOpenWindow("search") : null;
      if (!win || !bodyOf(win)) return;
      if (String(win._searchQuery || "").trim()) return;
      try { render(win); } catch (err) { console.error("[search] retranslate failed", err); }
    });
  }

  if (typeof window.registerApp === "function") {
    window.registerApp("search", {
      title: "Seek",
      i18n: {
        ru: { title: "Поиск", label: "Поиск" },
        ee: { title: "Otsing", label: "Otsing" },
      },
      label: "Seek",
      color: "linear-gradient(160deg,#4a4e58 0%,#2a2c33 50%,#111216 100%)",
      icon: ICON,
      size: { w: 600, h: 520 },
      deskPos: { x: 140, y: 40 },
      render: render
    });
  }
})();
