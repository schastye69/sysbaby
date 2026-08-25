/* sys.baby OS — Notes (brand "Scribble").
 *
 * Spec: os-apps.md section 3.
 * Storage: sysbaby.notes.v2 via the SHARED notes store (window.sbNotesStore).
 * The store is shell-owned (os-shell.md 1.6). This file installs a
 * contract-complete FALLBACK store only when the shell has not provided one,
 * so Notes/Echoes still work if the store module is missing (guarded
 * degradation, os-shell.md 11.5). The real shell store always wins.
 */
(function () {
  "use strict";

  var KEY = "sysbaby.notes.v2";
  var LEGACY_KEY = "sysbaby.widget.notes";

  /* ---------------------------------------------------------------- store */

  function dbGet(key) {
    try {
      if (window.sbDB && typeof window.sbDB.get === "function") return window.sbDB.get(key);
      return localStorage.getItem(key);
    } catch (err) {
      console.error("[notes] read failed for " + key, err);
      return null;
    }
  }

  function dbSet(key, value) {
    if (window.sbDB && typeof window.sbDB.set === "function") return window.sbDB.set(key, value);
    localStorage.setItem(key, value);
    return true;
  }

  function dbRemove(key) {
    try {
      if (window.sbDB && typeof window.sbDB.remove === "function") { window.sbDB.remove(key); return; }
      localStorage.removeItem(key);
    } catch (err) {
      console.error("[notes] remove failed for " + key, err);
    }
  }

  function dbFlush() {
    try {
      if (window.sbDB && typeof window.sbDB.flushSync === "function") window.sbDB.flushSync();
    } catch (err) {
      console.error("[notes] flush failed", err);
    }
  }

  function storeToast(title, text) {
    if (typeof window.showToast === "function") {
      try { window.showToast(title, text, ICON); } catch (err) { console.error("[notes] toast failed", err); }
    }
  }

  function installFallbackStore() {
    function uid() {
      return "n" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    function parseList(raw) {
      if (typeof raw !== "string" || raw === "") return null;
      try {
        var list = JSON.parse(raw);
        return Array.isArray(list) ? list : null;
      } catch (err) {
        console.error("[notes] corrupt " + KEY + " — starting empty", err);
        return null;
      }
    }

    /* Verified write: flush to the real backing store, read it back, parse it
     * and only then let the caller drop the predecessor key. */
    function writeVerified(list) {
      try {
        dbSet(KEY, JSON.stringify(list));
      } catch (err) {
        console.error("[notes] save failed", err);
        storeToast(t("nt.save.failTitle"), t("nt.save.failBody"));
        return false;
      }
      dbFlush();
      var back = parseList(dbGet(KEY));
      return !!back && back.length === list.length;
    }

    function write(list) {
      try {
        dbSet(KEY, JSON.stringify(list));
        return true;
      } catch (err) {
        console.error("[notes] save failed", err);
        storeToast(t("nt.save.failTitle"), t("nt.save.failBody"));
        return false;
      }
    }

    /* v1 (sysbaby.widget.notes, a single plain string) -> v2 array. */
    function readAll() {
      var current = parseList(dbGet(KEY));
      if (current) return current;

      var legacy = dbGet(LEGACY_KEY);
      if (legacy == null) return [];

      var list = [];
      if (String(legacy).trim() !== "") {
        list = [{ id: uid(), text: String(legacy), pinned: false, updatedAt: Date.now() }];
      }
      if (writeVerified(list)) dbRemove(LEGACY_KEY);
      return list;
    }

    function byId(list, id) {
      for (var i = 0; i < list.length; i++) if (list[i] && list[i].id === id) return i;
      return -1;
    }

    var store = {
      uid: uid,
      load: function () {
        return readAll().filter(function (n) { return n && !n.deletedAt; });
      },
      loadDeleted: function () {
        return readAll().filter(function (n) { return n && n.deletedAt; });
      },
      /* CRITICAL: consumers only ever see load()'s filtered list, so merge back
       * every stored soft-deleted record missing from the incoming list. */
      save: function (list) {
        var incoming = Array.isArray(list) ? list.slice() : [];
        var seen = {};
        incoming.forEach(function (n) { if (n && n.id) seen[n.id] = true; });
        readAll().forEach(function (n) {
          if (n && n.deletedAt && n.id && !seen[n.id]) incoming.push(n);
        });
        return write(incoming);
      },
      notify: function () {
        try {
          document.dispatchEvent(new CustomEvent("sysbaby:notes-changed"));
        } catch (err) {
          console.error("[notes] notify failed", err);
        }
      },
      onChange: function (fn) {
        if (typeof fn === "function") document.addEventListener("sysbaby:notes-changed", fn);
      },
      softDelete: function (id) {
        var list = readAll(), i = byId(list, id);
        if (i < 0) return false;
        list[i].deletedAt = Date.now();
        var ok = write(list);
        store.notify();
        return ok;
      },
      restore: function (id) {
        var list = readAll(), i = byId(list, id);
        if (i < 0) return false;
        delete list[i].deletedAt;
        var ok = write(list);
        store.notify();
        return ok;
      },
      purge: function (id) {
        var list = readAll().filter(function (n) { return !n || n.id !== id; });
        var ok = write(list);
        store.notify();
        return ok;
      },
      purgeAllDeleted: function () {
        var ok = write(readAll().filter(function (n) { return n && !n.deletedAt; }));
        store.notify();
        return ok;
      }
    };

    window.sbNotesStore = store;
    window.sbNotesStoreFallback = true;
  }

  /* ------------------------------------------------------------- helpers */

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4.5h9.5L19 9v10.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-14a1 1 0 0 1 1-1Z"/><path d="M14 4.5V9h4.5"/><path d="M7.5 12.5h8M7.5 16h5"/></svg>';

  function esc(value) {
    if (typeof window.escapeHtml === "function") return window.escapeHtml(value == null ? "" : String(value));
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function store() { return window.sbNotesStore || null; }

  function bodyOf(win) {
    return win && win.el ? win.el.querySelector(".window-body") : null;
  }

  /* Строки живут в STRINGS ядра (core/topbar.js); здесь только ключи. */
  function t(key, vars) { return typeof window.sbT === "function" ? window.sbT(key, vars) : key; }

  function timeAgo(ts) {
    var diff = Date.now() - (Number(ts) || 0);
    if (diff < 60000) return t("time.now");
    var m = Math.floor(diff / 60000);
    if (m < 60) return t("time.m", { n: m });
    var h = Math.floor(m / 60);
    if (h < 24) return t("time.h", { n: h });
    return t("time.d", { n: Math.floor(h / 24) });
  }

  function titleOf(text) {
    var lines = String(text == null ? "" : text).split("\n");
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].trim() !== "") return lines[i].slice(0, 80);
    }
    return t("nt.untitled");
  }

  function previewOf(text) {
    var lines = String(text == null ? "" : text).split("\n");
    return (lines[1] || "").trim();
  }

  function saveNotes(list) {
    var s = store();
    if (!s) return false;
    var ok = false;
    try {
      ok = s.save(list) !== false;
    } catch (err) {
      console.error("[notes] save failed", err);
      ok = false;
    }
    if (!ok && typeof window.showToast === "function") {
      try { window.showToast(t("nt.save.failTitleShort"), t("nt.save.failBody"), ICON); }
      catch (err2) { console.error("[notes] toast failed", err2); }
    }
    try { s.notify(); } catch (err3) { console.error("[notes] notify failed", err3); }
    return ok;
  }

  /* ------------------------------------------------------- module state */

  var activeId = null;      // selection is app-global (one window per app)
  var suppressClick = false; // set while a drag-release is in flight

  function liveNotes() {
    var s = store();
    if (!s) return [];
    try { return s.load() || []; } catch (err) { console.error("[notes] load failed", err); return []; }
  }

  function sorted() {
    return liveNotes().slice().sort(function (a, b) { return (b.updatedAt || 0) - (a.updatedAt || 0); });
  }

  function filtered(list, q) {
    var needle = String(q || "").trim().toLowerCase();
    if (!needle) return list;
    return list.filter(function (n) {
      return String(n.text || "").toLowerCase().indexOf(needle) !== -1;
    });
  }

  /* -------------------------------------------------------------- render */

  function listMarkup(rows) {
    if (!rows.length) return '<div class="notes-empty-list">' + esc(t("nt.emptyList")) + "</div>";
    return rows.map(function (n) {
      var preview = previewOf(n.text);
      return '<div class="notes-row' + (n.id === activeId ? " active" : "") + '" data-id="' + esc(n.id) + '">' +
        /* Название и начало заметки — то, что написал сам посетитель. */
        '<div class="notes-row-title" data-sb-userdata>' + esc(titleOf(n.text)) + "</div>" +
        (preview ? '<div class="notes-row-prev" data-sb-userdata>' + esc(preview) + "</div>" : "") +
        '<div class="notes-row-time">' + esc(timeAgo(n.updatedAt)) + "</div>" +
        "</div>";
    }).join("");
  }

  function editorMarkup(note) {
    if (!note) {
      return '<div class="notes-editor-empty">' +
        '<div class="notes-glyph">' + ICON + "</div>" +
        "<p>" + esc(t("nt.empty")) + "</p>" +
        "</div>";
    }
    var lines = String(note.text == null ? "" : note.text).split("\n");
    var title = lines[0] || "";
    var body = lines.slice(1).join("\n");
    return '<div class="notes-editor-head">' +
      '<button type="button" class="notes-del" id="notesDelete" title="' + esc(t("nt.delete")) + '" aria-label="' + esc(t("nt.delete")) + '">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4.5 7h15M9.5 7V5.2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7M6.5 7l1 12.2a1 1 0 0 0 1 .9h7a1 1 0 0 0 1-.9L17.5 7"/></svg></button>' +
      "</div>" +
      '<input type="text" class="notes-title" id="noteTitleInput" placeholder="' + esc(t("nt.ph.title")) + '" spellcheck="false" value="' + esc(title) + '">' +
      /* The leading newline compensates for the one HTML parsing eats right
       * after <textarea>. Without it a note written as "Title\n\nbody" would
       * silently lose its blank line the next time it was edited. */
      '<textarea class="notes-body" id="noteBodyInput" placeholder="' + esc(t("nt.ph.body")) + '">\n' + esc(body) + "</textarea>";
  }

  function render(win) {
    var host = bodyOf(win);
    if (!host) return;
    if (typeof win._notesFilter !== "string") win._notesFilter = "";

    var all = sorted();
    if (all.length && !all.some(function (n) { return n.id === activeId; })) activeId = all[0].id;
    if (!all.length) activeId = null;
    var rows = filtered(all, win._notesFilter);
    var active = null;
    all.forEach(function (n) { if (n.id === activeId) active = n; });

    /* Прокрутка человека переживает перерисовку — средство оболочки,
     общее для всех приложений (D-099). */
    var _sbKeep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
    host.innerHTML =
      '<div class="app-notes">' +
        '<aside class="notes-side">' +
          '<div class="notes-side-top">' +
            '<input type="search" class="notes-search" id="notesSearch" placeholder="' + esc(t("nt.ph.search")) + '" autocomplete="off" spellcheck="false" value="' + esc(win._notesFilter) + '">' +
            '<button type="button" class="notes-add" id="notesAdd" title="' + esc(t("nt.new")) + '" aria-label="' + esc(t("nt.new")) + '">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5.5v13M5.5 12h13"/></svg>' +
            "</button>" +
          "</div>" +
          '<div class="notes-list" id="notesList">' + listMarkup(rows) + "</div>" +
        "</aside>" +
        '<section class="notes-editor" id="notesEditor">' + editorMarkup(active) + "</section>" +
      "</div>";
    if (_sbKeep) _sbKeep();

    wire(win, host);
  }

  function refreshList(win) {
    var host = bodyOf(win);
    if (!host) return;
    var listEl = host.querySelector("#notesList");
    if (!listEl) return;
    /* Прокрутка человека переживает перерисовку — средство оболочки,
     общее для всех приложений (D-099). */
    var _sbKeep = window.sbKeepScroll ? window.sbKeepScroll(listEl.parentNode || listEl) : null;
    listEl.innerHTML = listMarkup(filtered(sorted(), win._notesFilter || ""));
    if (_sbKeep) _sbKeep();
    wireRows(win, listEl);
  }

  /* --------------------------------------------------------------- wiring */

  function wireRows(win, listEl) {
    listEl.querySelectorAll(".notes-row").forEach(function (row) {
      row.addEventListener("click", function () {
        if (suppressClick) return;
        activeId = row.getAttribute("data-id");
        render(win);
      });
      row.addEventListener("pointerdown", function (ev) { beginDrag(win, row, ev); });
    });
  }

  function wire(win, host) {
    var search = host.querySelector("#notesSearch");
    if (search) {
      search.addEventListener("input", function () {
        win._notesFilter = search.value;
        refreshList(win);
      });
    }

    var add = host.querySelector("#notesAdd");
    if (add) add.addEventListener("click", function () { createNote(win); });

    var listEl = host.querySelector("#notesList");
    if (listEl) wireRows(win, listEl);

    var del = host.querySelector("#notesDelete");
    if (del) del.addEventListener("click", function () { deleteActive(win); });

    var titleEl = host.querySelector("#noteTitleInput");
    var bodyEl = host.querySelector("#noteBodyInput");
    function onEdit() {
      var list = liveNotes();
      var note = null;
      list.forEach(function (n) { if (n.id === activeId) note = n; });
      if (!note) return;
      note.text = (titleEl ? titleEl.value : "") + "\n" + (bodyEl ? bodyEl.value : "");
      note.updatedAt = Date.now();
      saveNotes(list);
      refreshList(win);   // never rebuild the inputs mid-type
    }
    if (titleEl) titleEl.addEventListener("input", onEdit);
    if (bodyEl) bodyEl.addEventListener("input", onEdit);
  }

  function createNote(win) {
    var s = store();
    if (!s) return;
    var list = liveNotes();
    /* Заголовок новой заметки — на языке того, кто её создал; дальше это
       его текст, и смена языка его не трогает. */
    var note = { id: s.uid(), text: t("nt.newNote") + "\n", pinned: false, updatedAt: Date.now() };
    list.unshift(note);
    activeId = note.id;
    saveNotes(list);
    render(win);
    var titleEl = bodyOf(win) && bodyOf(win).querySelector("#noteTitleInput");
    if (titleEl) { titleEl.focus(); titleEl.select(); }
  }

  function deleteActive(win) {
    var s = store();
    if (!s || !activeId) return;
    try { s.softDelete(activeId); } catch (err) { console.error("[notes] soft delete failed", err); }
    activeId = null;
    render(win);
  }

  /* ----------------------------------------------- drag a row to Echoes */

  function beginDrag(win, row, downEv) {
    if (downEv.button !== undefined && downEv.button !== 0) return;
    var id = row.getAttribute("data-id");
    if (!id) return;
    var startX = downEv.clientX, startY = downEv.clientY;
    var ghost = null;

    function isEchoesTarget(x, y) {
      var el = document.elementFromPoint(x, y);
      while (el) {
        if (el.getAttribute) {
          var appId = el.getAttribute("data-app") || el.getAttribute("data-app-id") || el.getAttribute("data-window");
          if (appId === "echoes") return true;
          if (el.id === "echoes" || el.classList && el.classList.contains("echoes-drop")) return true;
        }
        el = el.parentElement;
      }
      return false;
    }

    function move(ev) {
      if (!ghost) {
        if (Math.abs(ev.clientX - startX) < 6 && Math.abs(ev.clientY - startY) < 6) return;
        ghost = document.createElement("div");
        /* Contract with the shell's global drop listener: class + data-id. */
        ghost.className = "notes-row-ghost dragging";
        ghost.setAttribute("data-id", id);
        var titleText = row.querySelector(".notes-row-title");
        var prevText = row.querySelector(".notes-row-prev");
        ghost.innerHTML = '<span class="ghost-title">' + esc(titleText ? titleText.textContent : "") + "</span>" +
          (prevText ? '<span class="ghost-prev">' + esc(prevText.textContent) + "</span>" : "");
        document.body.appendChild(ghost);
        row.classList.add("dragging-source");
        if (typeof window.sbEchoesHighlight === "function") {
          try { window.sbEchoesHighlight(true); } catch (err) { console.error("[notes] echoes highlight failed", err); }
        }
      }
      ghost.style.left = ev.clientX + 12 + "px";
      ghost.style.top = ev.clientY + 12 + "px";
      ghost.classList.toggle("armed", isEchoesTarget(ev.clientX, ev.clientY));
    }

    function up() {
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerup", up);
      if (typeof window.sbEchoesHighlight === "function") {
        try { window.sbEchoesHighlight(false); } catch (err) { console.error("[notes] echoes highlight failed", err); }
      }
      row.classList.remove("dragging-source");
      if (!ghost) return;
      suppressClick = true;
      /* Leave the ghost in the DOM for this tick: the shell's document-level
       * drop listener reads it (class "notes-row-ghost dragging" + data-id). */
      var node = ghost;
      ghost = null;
      setTimeout(function () {
        if (node.parentNode) node.parentNode.removeChild(node);
        suppressClick = false;
      }, 0);
    }

    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
  }

  /* ------------------------------------------------------- live refresh */

  function openWin() {
    if (typeof window.getOpenWindow !== "function") return null;
    try { return window.getOpenWindow("notes") || null; } catch (err) { console.error("[notes] getOpenWindow failed", err); return null; }
  }

  document.addEventListener("sysbaby:notes-changed", function () {
    var win = openWin();
    if (!win || !win.el) return;
    /* never yank the caret out of an editor the user is typing in */
    if (document.activeElement && win.el.contains(document.activeElement)) return;
    render(win);
  });

  /* ---------------------------------------------------- search provider */

  window.sbNotesOpenResult = function (win, id) {
    var s = store();
    if (!win || !s) return false;
    var found = false;
    (s.load() || []).forEach(function (n) { if (n.id === id) found = true; });
    if (!found) return false;
    activeId = id;
    render(win);
    return true;
  };

  /* ------------------------------------------------------- registration */

  if (!window.sbNotesStore) installFallbackStore();

  /* Перерисовка при смене языка — только когда посетитель не пишет: поле
     заметки хранит несохранённые правки ровно между двумя нажатиями клавиш. */
  if (window.sbBus && typeof window.sbBus.on === "function") {
    window.sbBus.on("translate:done", function () {
      var win = typeof window.getOpenWindow === "function" ? window.getOpenWindow("notes") : null;
      var host = win ? bodyOf(win) : null;
      if (!host) return;
      var active = document.activeElement;
      if (active && host.contains(active)) return;
      try { render(win); } catch (err) { console.error("[notes] retranslate failed", err); }
    });
  }

  if (typeof window.registerApp === "function") {
    window.registerApp("notes", {
      title: "Scribble",
      i18n: {
        ru: { title: "Записи", label: "Записи" },
        ee: { title: "Märkmed", label: "Märkmed" },
      },
      label: "Scribble",
      color: "linear-gradient(160deg,#ffe08a 0%,#ffc24d 46%,#f59331 100%)",
      icon: ICON,
      size: { w: 680, h: 520 },
      deskPos: { x: 40, y: 260 },
      render: render
    });
  }
})();
