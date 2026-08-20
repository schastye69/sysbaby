/* sys.baby OS — core/desktop.js
 * Desktop surfaces: sticky notes ("memory points"), the widget host engine
 * (drag/resize/persist/shelf-pack/visibility/named layouts), Quick Capture,
 * context menus, the Quick Actions orb, and marquee multi-select. */
(function () {
  "use strict";

  var doc = document, root = doc.documentElement;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var esc = function (s) { return window.escapeHtml ? window.escapeHtml(s) : String(s == null ? "" : s); };
  function num(v, d) { v = Number(v); return isFinite(v) ? v : d; }

  /* One translation path. Sentences are assembled from whole strings with
     placeholders, never from English fragments glued together — word order is
     not the same in the three languages this desktop speaks. */
  function tr(k, v) { return window.sbT ? window.sbT(k, v) : k; }
  function toast2(a, b) { if (window.showToast) window.showToast(tr(a), tr(b), ""); }
  function appTitleOf(id) { return window.sbAppTitle ? window.sbAppTitle(id) : id; }
  function appLabelOf(id) { return window.sbAppLabel ? window.sbAppLabel(id) : id; }
  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
  function readJSON(k, f) { return window.sbReadJSON ? window.sbReadJSON(k, f) : f; }
  function writeJSON(k, v) { if (window.sbWriteJSON) window.sbWriteJSON(k, v); }
  function reduced() { return root.getAttribute("data-motion") === "reduced" || (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches); }
  function isTouch() { return root.classList.contains("is-touch"); }

  /* ==================================================== widgets host §4.4 */
  var LAYOUT_KEY = "sysbaby.widget.layout";
  var HIDDEN_KEY = "sysbaby.widget.hidden";
  var SAVED_KEY = "sysbaby.widget.layouts.saved";
  var LAYOUT_V = 2;

  /* nameKey, not name: the header is resolved at paint time so it follows the
     language, and the English word is only the fallback for a widget some
     other module registers without one. */
  var WIDGET_DEFAULTS = {
    quote: { name: "Quote", nameKey: "widget.quote", w: 250, h: 340 },
    payback: { name: "Payback", nameKey: "widget.payback", w: 250, h: 260 },
    capture: { name: "Quick Capture", nameKey: "widget.capture", w: 230, h: 180 }
  };

  function widgetName(id) {
    var d = WIDGET_DEFAULTS[id] || {};
    return d.nameKey ? tr(d.nameKey) : (d.name || id);
  }
  var DEFAULT_VISIBLE_WIDE = ["quote", "payback", "capture"];
  var DEFAULT_VISIBLE_NARROW = ["quote"];

  function widgetNodes() { return $$("#sbWidgetLayer .sb-widget"); }
  function widgetIds() { return widgetNodes().map(function (n) { return n.getAttribute("data-widget"); }); }

  window.sbListWidgets = function () {
    return widgetNodes().map(function (n) {
      var id = n.getAttribute("data-widget");
      return { id: id, name: (WIDGET_DEFAULTS[id] && WIDGET_DEFAULTS[id].name) || id };
    });
  };
  window.sbWidgetHost = function (id) { return $('#sbWidgetLayer .sb-widget[data-widget="' + id + '"] .sb-widget-body'); };

  /* Widget mount contract for widget modules (widgets/*.js). Two descriptor
     shapes are accepted, because the shell and the widget modules were built
     against different halves of the written contract:
       shell-native : {name?, w?, h?, render(bodyEl)}
       os-apps §11/§12 : {id, title, defaultSize:{w,h}, mount(rootEl)}
     `render` gets the BODY element, `mount` gets the widget ROOT — the widget
     modules resolve `.widget-body` themselves and set state classes on the root.
     Either way the host is created when missing, then dragged/resized/persisted
     by this module. Widget roots carry BOTH `data-widget` (shell/core.css) and
     `data-widget-id` (the os-apps.md markup contract the widgets' scoped CSS
     and their auto-mount path key off). */
  window.sbRegisterWidget = function (id, def) {
    if (!id) return null;
    def = def || {};
    var known = WIDGET_DEFAULTS[id] || {};
    var size = def.defaultSize || {};
    WIDGET_DEFAULTS[id] = {
      name: def.name || def.title || known.name || id,
      nameKey: def.nameKey || known.nameKey || null,
      w: num(def.w, num(size.w, known.w || 240)),
      h: num(def.h, num(size.h, known.h || 200))
    };
    var host = widgetNode(id);
    if (!host) {
      var layerEl = $("#sbWidgetLayer");
      if (!layerEl) return null;
      host = doc.createElement("section");
      host.className = "sb-widget widget";
      host.id = "sbWidget" + id.charAt(0).toUpperCase() + id.slice(1);
      host.setAttribute("data-widget", id);
      host.setAttribute("data-widget-id", id);
      host.innerHTML = '<header class="sb-widget-head widget-head"><span class="sb-widget-title widget-title">' +
        esc(widgetName(id)) + "</span></header>" +
        '<div class="sb-widget-body widget-body"></div>' +
        '<span class="sb-widget-resize" aria-hidden="true"></span>';
      layerEl.appendChild(host);
      placeWidget(host, false);
      wireWidget(host);
      applyWidgetVisibility();
    }
    if (!host.getAttribute("data-widget-id")) host.setAttribute("data-widget-id", id);
    var title = host.querySelector(".sb-widget-title");
    if (title) title.textContent = def.name || def.title || widgetName(id);
    var body = host.querySelector(".sb-widget-body");
    if (typeof def.render === "function") {
      try { def.render(body); } catch (e) { if (window.console) console.error("[widget] " + id, e); }
    } else if (typeof def.mount === "function") {
      try { def.mount(host); } catch (e) { if (window.console) console.error("[widget] " + id, e); }
    }
    return body;
  };
  window.sbWidgets = {
    register: function (id, def) { return window.sbRegisterWidget(id, def); },
    host: function (id) { return window.sbWidgetHost(id); },
    list: function () { return window.sbListWidgets(); }
  };

  function layoutAll() {
    var v = readJSON(LAYOUT_KEY, null);
    if (!v || typeof v !== "object" || num(v.__v, 0) < LAYOUT_V) return { __v: LAYOUT_V };
    return v;
  }
  function layoutSave(o) { o.__v = LAYOUT_V; writeJSON(LAYOUT_KEY, o); }

  function hiddenWidgets() {
    var raw = window.sbDB ? window.sbDB.get(HIDDEN_KEY) : null;
    if (raw) {
      try { var v = JSON.parse(raw); if (Array.isArray(v)) return v; } catch (e) { /* fall through */ }
    }
    var visible = window.innerWidth < 620 ? DEFAULT_VISIBLE_NARROW : DEFAULT_VISIBLE_WIDE;
    return widgetIds().filter(function (id) { return visible.indexOf(id) === -1; });
  }
  window.sbGetHiddenWidgets = hiddenWidgets;

  window.sbSetWidgetHidden = function (id, hidden) {
    var list = hiddenWidgets(), i = list.indexOf(id);
    if (hidden && i === -1) list.push(id);
    if (!hidden && i !== -1) list.splice(i, 1);
    writeJSON(HIDDEN_KEY, list);
    applyWidgetVisibility();
    if (!hidden) placeWidget(widgetNode(id), true);
    if (window.sbBus) window.sbBus.emit("widget:visibility", { id: id, hidden: !!hidden });
    return !!hidden;
  };
  function widgetNode(id) { return $('#sbWidgetLayer .sb-widget[data-widget="' + id + '"]'); }

  function applyWidgetVisibility() {
    var hidden = hiddenWidgets();
    widgetNodes().forEach(function (n) {
      n.hidden = hidden.indexOf(n.getAttribute("data-widget")) !== -1;
    });
  }

  function sizeTier(n) {
    var w = n.offsetWidth;
    n.setAttribute("data-size", w < 200 ? "compact" : (w < 330 ? "medium" : "large"));
  }

  function placeWidget(n, forceShelf) {
    if (!n) return;
    var id = n.getAttribute("data-widget");
    var def = WIDGET_DEFAULTS[id] || { w: 240, h: 200 };
    var saved = layoutAll()[id];
    var vw = window.innerWidth, vh = window.innerHeight;
    var w = num(saved && saved.w, def.w), h = num(saved && saved.h, def.h);
    w = Math.max(def.w, w); h = Math.max(def.h, h);
    var x, y;
    if (saved && !forceShelf && isFinite(saved.x) && isFinite(saved.y)) {
      x = clamp(saved.x, 8, Math.max(8, vw - w - 8));
      y = clamp(saved.y, 50, Math.max(50, vh - h - 8));
    } else {
      var pos = shelfSlot(w, h, n);
      x = pos.x; y = pos.y;
    }
    n.style.width = w + "px"; n.style.height = h + "px";
    n.style.left = Math.round(x) + "px"; n.style.top = Math.round(y) + "px";
    sizeTier(n);
  }

  /* right-anchored shelf pack: fill rows from the right edge leftward */
  function shelfSlot(w, h, self) {
    var margin = 20, gap = 14, startY = 320, safeX = 230;
    var vw = window.innerWidth;
    var placed = widgetNodes().filter(function (n) { return n !== self && !n.hidden && n.style.left; }).map(function (n) {
      return { x: n.offsetLeft, y: n.offsetTop, w: n.offsetWidth, h: n.offsetHeight };
    });
    var y = startY, x = vw - margin - w;
    var guard = 0;
    while (guard++ < 40) {
      var rect = { x: x, y: y, w: w, h: h };
      var hit = placed.filter(function (p) {
        return !(rect.x + rect.w + gap <= p.x || p.x + p.w + gap <= rect.x || rect.y + rect.h + gap <= p.y || p.y + p.h + gap <= rect.y);
      });
      if (!hit.length && x >= safeX) return { x: x, y: y };
      if (x - (w + gap) < safeX) {
        var tallest = placed.filter(function (p) { return p.y < y + h && p.y + p.h > y; })
          .reduce(function (m, p) { return Math.max(m, p.y + p.h); }, y + h);
        y = tallest + gap;
        x = vw - margin - w;
      } else {
        x -= (w + gap);
      }
    }
    return { x: Math.max(safeX, vw - margin - w), y: startY };
  }

  function persistWidget(n) {
    var id = n.getAttribute("data-widget");
    var all = layoutAll();
    all[id] = { x: n.offsetLeft, y: n.offsetTop, w: n.offsetWidth, h: n.offsetHeight };
    layoutSave(all);
  }

  function guideLine(kind, pos) {
    var idc = "sbGuide" + kind;
    var g = doc.getElementById(idc);
    if (pos == null) { if (g) g.remove(); return; }
    if (!g) {
      g = doc.createElement("div");
      g.id = idc;
      g.className = "align-guide " + (kind === "V" ? "v" : "h");
      doc.body.appendChild(g);
    }
    if (kind === "V") g.style.left = pos + "px"; else g.style.top = pos + "px";
  }

  function wireWidget(n) {
    var header = n.querySelector(".sb-widget-head");
    var grip = n.querySelector(".sb-widget-resize");
    var drag = null, rs = null;

    if (header) {
      header.addEventListener("pointerdown", function (ev) {
        if (ev.button !== 0) return;
        drag = { sx: ev.clientX, sy: ev.clientY, ox: n.offsetLeft, oy: n.offsetTop };
        try { header.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
        n.classList.add("dragging");
        root.classList.add("dragging");
      });
      header.addEventListener("pointermove", function (ev) {
        if (!drag) return;
        var x = drag.ox + (ev.clientX - drag.sx), y = drag.oy + (ev.clientY - drag.sy);
        var w = n.offsetWidth, h = n.offsetHeight, vw = window.innerWidth, vh = window.innerHeight;
        /* magnetic alignment: viewport centre lines + other widgets' edges */
        if (!reduced()) {
          var snapT = 7, gv = null, gh = null;
          var cx = x + w / 2, cy = y + h / 2;
          if (Math.abs(cx - vw / 2) < snapT) { x = Math.round(vw / 2 - w / 2); gv = Math.round(vw / 2); }
          if (Math.abs(cy - vh / 2) < snapT) { y = Math.round(vh / 2 - h / 2); gh = Math.round(vh / 2); }
          widgetNodes().forEach(function (o) {
            if (o === n || o.hidden) return;
            [[o.offsetLeft, "L"], [o.offsetLeft + o.offsetWidth, "R"]].forEach(function (p) {
              if (Math.abs(x - p[0]) < snapT) { x = p[0]; gv = p[0]; }
              if (Math.abs(x + w - p[0]) < snapT) { x = p[0] - w; gv = p[0]; }
            });
            [o.offsetTop, o.offsetTop + o.offsetHeight].forEach(function (p) {
              if (Math.abs(y - p) < snapT) { y = p; gh = p; }
              if (Math.abs(y + h - p) < snapT) { y = p - h; gh = p; }
            });
          });
          guideLine("V", gv); guideLine("H", gh);
        }
        n.style.left = clamp(x, 8, Math.max(8, vw - w - 8)) + "px";
        n.style.top = clamp(y, 50, Math.max(50, vh - h - 8)) + "px";
      });
      var endDrag = function () {
        if (!drag) return;
        drag = null;
        n.classList.remove("dragging");
        root.classList.remove("dragging");
        guideLine("V", null); guideLine("H", null);
        persistWidget(n);
      };
      header.addEventListener("pointerup", endDrag);
      header.addEventListener("pointercancel", endDrag);
      header.addEventListener("contextmenu", function (ev) { openMenu(ev, "widget", n); });
    }

    if (grip) {
      grip.addEventListener("pointerdown", function (ev) {
        ev.preventDefault();
        rs = { sx: ev.clientX, sy: ev.clientY, w: n.offsetWidth, h: n.offsetHeight };
        try { grip.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
        root.classList.add("dragging");
      });
      grip.addEventListener("pointermove", function (ev) {
        if (!rs) return;
        var def = WIDGET_DEFAULTS[n.getAttribute("data-widget")] || { w: 180, h: 140 };
        var w = clamp(rs.w + (ev.clientX - rs.sx), def.w, window.innerWidth - 40);
        var h = clamp(rs.h + (ev.clientY - rs.sy), def.h, window.innerHeight - 80);
        n.style.width = Math.round(w) + "px";
        n.style.height = Math.round(h) + "px";
        sizeTier(n);
      });
      var endResize = function () {
        if (!rs) return;
        rs = null;
        root.classList.remove("dragging");
        persistWidget(n);
        if (window.sbBus) window.sbBus.emit("widget:resize", { id: n.getAttribute("data-widget") });
      };
      grip.addEventListener("pointerup", endResize);
      grip.addEventListener("pointercancel", endResize);
    }
  }

  window.sbTidyWidgets = function () {
    if (window.sbDB) window.sbDB.remove(LAYOUT_KEY);
    widgetNodes().forEach(function (n) { placeWidget(n, true); });
    if (window.sbBus) window.sbBus.emit("widgets:tidied", {});
    toast2("toast.tidied", "toast.tidiedBody");
  };

  window.sbSaveCurrentWidgetLayout = function (name) {
    var nm = String(name || "").trim();
    if (!nm) return false;
    var snap = {};
    widgetNodes().forEach(function (n) {
      if (n.hidden) return;
      snap[n.getAttribute("data-widget")] = { x: n.offsetLeft, y: n.offsetTop, w: n.offsetWidth, h: n.offsetHeight };
    });
    var list = readJSON(SAVED_KEY, []);
    if (!Array.isArray(list)) list = [];
    list = list.filter(function (L) { return L && L.name !== nm; });
    list.unshift({ name: nm, snap: snap });
    writeJSON(SAVED_KEY, list.slice(0, 6));
    if (window.showToast) window.showToast(tr("toast.layoutSaved"), tr("toast.layoutSavedBody", { name: nm }), "");
    return true;
  };
  window.sbGetSavedWidgetLayouts = function () {
    var v = readJSON(SAVED_KEY, []);
    return Array.isArray(v) ? v : [];
  };
  window.sbApplyNamedLayout = function (snap) {
    if (!snap) return false;
    Object.keys(snap).forEach(function (id) {
      var n = widgetNode(id);
      if (!n) return;
      var s = snap[id];
      n.style.left = num(s.x, n.offsetLeft) + "px";
      n.style.top = num(s.y, n.offsetTop) + "px";
      n.style.width = num(s.w, n.offsetWidth) + "px";
      n.style.height = num(s.h, n.offsetHeight) + "px";
      sizeTier(n);
      persistWidget(n);
    });
    toast2("toast.layoutRestored", "toast.layoutRestoredBody");
    return true;
  };

  /* ------------------------------------------------- Quick Capture (§4.4) */
  function mountCapture() {
    var body = window.sbWidgetHost("capture");
    if (!body) return;
    body.innerHTML = '<form class="cap-form"><input type="text" id="sbCaptureInput" maxlength="500" placeholder="' + esc(tr("capture.placeholder")) + '" aria-label="' + esc(tr("capture.aria")) + '" /></form>' +
      '<ul class="cap-recent" id="sbCaptureRecent"></ul>';
    var form = body.querySelector(".cap-form");
    var input = body.querySelector("#sbCaptureInput");
    paintRecent();
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var text = String(input.value || "").trim().slice(0, 500);
      if (!text) return;
      input.value = "";
      if (!window.sbAddQuickNote) return;
      window.sbAddQuickNote(text);                          /* FIX: straight into the shared store */
      var list = readJSON("sysbaby.capture.recent", []);
      if (!Array.isArray(list)) list = [];
      list.unshift(text);
      writeJSON("sysbaby.capture.recent", list.slice(0, 8));
      paintRecent();
      if (window.showToast) window.showToast(tr("toast.captured"), tr("toast.capturedBody", { app: appTitleOf("notes") }), "");
    });
    function paintRecent() {
      var host = body.querySelector("#sbCaptureRecent");
      if (!host) return;
      var list = readJSON("sysbaby.capture.recent", []);
      if (!Array.isArray(list)) list = [];
      host.innerHTML = list.slice(0, 4).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");
    }
  }

  /* ============================================ desktop sticky notes §4.3 */
  var noteLayer = null;
  var invite = null;
  var saveTimers = Object.create(null);

  function notesLayer() { return noteLayer || (noteLayer = $("#sbNoteLayer")); }

  function appMentionChips(text) {
    var reg = (window.SysBaby && window.SysBaby.apps) || {};
    var low = String(text || "").toLowerCase();
    var hits = Object.keys(reg).filter(function (id) {
      var def = reg[id];
      if (def.hidden) return false;
      var names = [def.title, def.label, def.brand].filter(Boolean).map(function (s) { return String(s).toLowerCase(); });
      return names.some(function (nm) { return nm.length > 2 && low.indexOf(nm) !== -1; });
    }).slice(0, 4);
    if (!hits.length) return "";
    return '<div class="note-chips">' + hits.map(function (id) {
      var def = reg[id];
      var live = (window.openWindows || {})[id] ? " live" : "";
      return '<button class="note-chip' + live + '" type="button" data-app="' + esc(id) + '">' +
        '<span class="chip-tile" style="background:' + esc(def.color || "#334") + '"></span>' + esc(appTitleOf(id)) + "</button>";
    }).join("") + "</div>";
  }

  /* Where a note can actually sit.

     Unlike an icon this does NOT snap to the application grid — a note is a
     thing you put somewhere, not a thing that belongs in a slot. It keeps the
     position it was given whenever that position is free, and only when it
     is not does it walk outward in small steps until it finds room. The
     search is a spiral rather than a scan so the note lands near where the
     hand left it, not at the start of a row. */
  function noteSpotNear(x, y, w, h, exceptEl) {
    var pad = 10;
    var maxX = Math.max(4, window.innerWidth - w - 4);
    var maxY = Math.max(48, window.innerHeight - h - 12);
    var others = (window.sbDesktopObstacles ? window.sbDesktopObstacles(exceptEl) : []);
    function free(px, py) {
      for (var i = 0; i < others.length; i++) {
        var o = others[i];
        if (!(px + w + pad <= o.x || o.x + o.w + pad <= px ||
              py + h + pad <= o.y || o.y + o.h + pad <= py)) return false;
      }
      return true;
    }
    var sx = clamp(Math.round(x), 4, maxX), sy = clamp(Math.round(y), 48, maxY);
    if (free(sx, sy)) return { x: sx, y: sy };
    var step = 18;
    for (var ring = 1; ring <= 14; ring++) {
      for (var a = 0; a < 12; a++) {
        var ang = (a / 12) * Math.PI * 2;
        var px = clamp(Math.round(sx + Math.cos(ang) * ring * step), 4, maxX);
        var py = clamp(Math.round(sy + Math.sin(ang) * ring * step * 0.7), 48, maxY);
        if (free(px, py)) return { x: px, y: py };
      }
    }
    return { x: sx, y: sy };
  }

  /* Where the note sits in the room decides how much of the wallpaper's light
     falls on it. Written once, on placement — a static value costs nothing,
     and the desktop is already paying for a moving wallpaper. */
  function lightNote(el) {
    var nx = (el.offsetLeft + el.offsetWidth / 2) / Math.max(1, window.innerWidth);
    var ny = (el.offsetTop + el.offsetHeight / 2) / Math.max(1, window.innerHeight);
    el.style.setProperty("--nx", nx.toFixed(3));
    el.style.setProperty("--ny", ny.toFixed(3));
  }

  /* The note's position, or nothing at all. Reads the inline style rather
     than the layout box so it is still right while the element is detached,
     and refuses to answer when there is nothing trustworthy to say. */
  function notePos(el) {
    if (!el) return null;
    var l = parseFloat(el.style.left), t = parseFloat(el.style.top);
    if (isFinite(l) && isFinite(t)) return { x: Math.round(l), y: Math.round(t) };
    if (!el.isConnected) return null;
    return { x: el.offsetLeft, y: el.offsetTop };
  }

  function buildNote(rec) {
    var host = notesLayer();
    if (!host) return null;
    var el = doc.createElement("div");
    el.className = "sticky-note";
    el.setAttribute("data-id", rec.id);
    el.style.left = num(rec.x, 120) + "px";
    el.style.top = num(rec.y, 140) + "px";
    el.innerHTML = '<button class="note-del" type="button" aria-label="' + esc(tr("note.delete")) + '">✕</button>' +
      '<textarea class="note-text" placeholder="' + esc(tr("note.placeholder")) + '" aria-label="' + esc(tr("note.aria")) + '"></textarea>' +
      '<div class="note-chip-host"></div>';
    var ta = el.querySelector(".note-text");
    ta.value = rec.text || "";
    host.appendChild(el);
    autoGrow(ta);
    lightNote(el);
    paintChips(el, ta.value);

    var lastNonEmpty = ta.value;

    function persist() {
      var live = window.sbNotesStore ? window.sbNotesStore.load() : [];
      var found = false;
      var value = ta.value;
      if (!value.trim() && lastNonEmpty.trim() && doc.activeElement !== ta) value = lastNonEmpty;  /* Android blur glitch guard */
      for (var i = 0; i < live.length; i++) {
        if (live[i].id === rec.id) {
          live[i].text = value;
          live[i].updatedAt = Date.now();
          live[i].onDesktop = true;
          /* Never take geometry from a node that is not on screen. A save can
             land mid-rebuild — the debounced write fires 250ms after a
             keystroke, and a store notification rebuilds the layer — and a
             detached element reports 0,0 for both offsets. That is how a note
             ended up in the top-left corner having never been dragged there:
             it was not moved, it was measured while it was nowhere. */
          var pos = notePos(el);
          if (pos) { live[i].x = pos.x; live[i].y = pos.y; }
          found = true;
        }
      }
      if (!found) {
        var np = notePos(el) || { x: num(rec.x, 120), y: num(rec.y, 140) };
        live.unshift({ id: rec.id, text: value, pinned: false, updatedAt: Date.now(), onDesktop: true, x: np.x, y: np.y });
      }
      if (window.sbNotesStore) window.sbNotesStore.save(live);
    }
    el._sbPersist = persist;

    ta.addEventListener("input", function () {
      if (ta.value.trim()) lastNonEmpty = ta.value;
      autoGrow(ta);
      paintChips(el, ta.value);
      if (saveTimers[rec.id]) clearTimeout(saveTimers[rec.id]);
      saveTimers[rec.id] = setTimeout(function () { persist(); if (window.sbNotesStore) window.sbNotesStore.notify(); }, 250);
    });
    ta.addEventListener("focus", function () {
      el.classList.add("focused");
      if (isTouch()) keyboardClamp(el);
    });
    ta.addEventListener("blur", function () {
      el.classList.remove("focused");
      if (!ta.value.trim()) { removeNote(el, rec.id, false); return; }
      persist();
      if (window.sbNotesStore) window.sbNotesStore.notify();
    });
    el.querySelector(".note-del").addEventListener("click", function () {
      removeNote(el, rec.id, true);
    });

    /* ЗАМЕТКА ПЕРЕТАСКИВАЕТСЯ КАК ЗНАЧОК (v47).
     *
     * Прежде перетаскивание начиналось где угодно, КРОМЕ текста, — а текст
     * занимает почти всю заметку. Ухватить её было не за что, и основатель
     * написал прямо: заметки не перемещаются.
     *
     * Правило теперь такое же, как у значков приложений и как у виджетов на
     * телефоне: пока заметку НЕ ПРАВЯТ, вся она — ручка. Нажатие без движения
     * ставит курсор и открывает правку; нажатие с движением двигает. Когда
     * заметка в правке, она не двигается вовсе: там человек работает с
     * текстом, и увести из-под него лист было бы худшим из решений.
     */
    var drag = null;
    el.addEventListener("pointerdown", function (ev) {
      if (ev.target && ev.target.closest(".note-del, .note-chip")) return;
      if (el.classList.contains("focused")) return;      /* правят — не двигаем */
      var onText = !!(ev.target && ev.target.closest(".note-text"));
      drag = {
        sx: ev.clientX, sy: ev.clientY,
        ox: el.offsetLeft, oy: el.offsetTop,
        moved: false, onText: onText
      };
      /* Текст не должен перехватить жест: без этого браузер ставит курсор и
         начинает выделение прежде, чем станет ясно, тащат заметку или нет. */
      if (onText) { try { ev.preventDefault(); } catch (e) { /* ignore */ } }
      try { el.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
    });
    el.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var dx = ev.clientX - drag.sx, dy = ev.clientY - drag.sy;
      if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 4) return;
      drag.moved = true;
      el.classList.add("dragging");
      /* The note follows the hand, always. Refusing to move whenever the path
         crossed an icon is what made notes feel stuck: on a desktop with ten
         icons most of the screen is a wall. Room is found on release instead,
         which is the moment the visitor actually means a position. */
      var nx = clamp(drag.ox + dx, 4, Math.max(4, window.innerWidth - el.offsetWidth - 4));
      var ny = clamp(drag.oy + dy, 48, Math.max(48, window.innerHeight - 60));
      el.style.left = nx + "px"; el.style.top = ny + "px";
    });
    function endDrag() {
      if (!drag) return;
      var moved = drag.moved;
      var wasOnText = drag.onText;
      drag = null;
      el.classList.remove("dragging");
      if (!moved && wasOnText) {
        /* Нажали и не повели — значит хотели писать. */
        try { ta.focus(); } catch (e) { /* ignore */ }
        return;
      }
      if (moved) {
        var spot = noteSpotNear(el.offsetLeft, el.offsetTop, el.offsetWidth, el.offsetHeight, el);
        if (spot.x !== el.offsetLeft || spot.y !== el.offsetTop) {
          el.classList.add("settling");
          el.style.left = spot.x + "px";
          el.style.top = spot.y + "px";
          setTimeout(function () { el.classList.remove("settling"); }, 320);
        }
        lightNote(el);
        if (window.sbPersistNotePosition) window.sbPersistNotePosition(rec.id, spot.x, spot.y);
      }
    }
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointercancel", endDrag);
    return el;
  }

  function paintChips(el, text) {
    var host = el.querySelector(".note-chip-host");
    if (!host) return;
    host.innerHTML = appMentionChips(text);
    $$(".note-chip", host).forEach(function (b) {
      b.addEventListener("click", function (ev) {
        ev.stopPropagation();
        if (window.toggleApp) window.toggleApp(b.getAttribute("data-app"));
      });
    });
  }

  /* РАЗМЕР ЗАМЕТКИ ИДЁТ ЗА ТЕКСТОМ С ПЕРВОГО СЛОВА (v47).
   *
   * Прежде за текстом шла только высота, а ширина стояла намертво — 196px из
   * стилей. Слово «Hi» получало лист размером с ладонь, почти пустой, и
   * основатель сказал об этом так: подстраивается, но не с первого слова.
   *
   * Теперь ширина считается по самой длинной строке, измеренной ТЕМ ЖЕ
   * шрифтом, которым текст нарисован: короткая заметка становится маленькой
   * сразу, длинная растёт до предела и дальше переносит строки. Измеряется
   * настоящим замером в холсте, а не оценкой «примерно семь пикселей на
   * букву»: буквы разной ширины, а кириллица шире латиницы.
   */
  var MEASURE = null;
  function textWidth(ta, line) {
    if (!MEASURE) MEASURE = doc.createElement("canvas").getContext("2d");
    var cs = window.getComputedStyle(ta);
    MEASURE.font = cs.fontStyle + " " + cs.fontWeight + " " + cs.fontSize + " / " + cs.lineHeight + " " + cs.fontFamily;
    return MEASURE.measureText(line).width;
  }

  var NOTE_MIN_W = 118, NOTE_MAX_W = 320;

  function autoGrow(ta) {
    var el = ta.closest ? ta.closest(".sticky-note") : null;
    if (el) {
      var lines = String(ta.value || ta.placeholder || "").split("\n");
      var widest = 0, i;
      for (i = 0; i < lines.length; i++) widest = Math.max(widest, textWidth(ta, lines[i]));
      var pad = el.offsetWidth - ta.offsetWidth + 2;           /* поля самой заметки */
      if (!(pad > 0)) pad = 24;
      var want = Math.ceil(widest) + pad + 18;                  /* 18 — место под крестик */
      el.style.width = Math.round(Math.min(NOTE_MAX_W, Math.max(NOTE_MIN_W, want))) + "px";
    }
    ta.style.height = "auto";
    ta.style.height = Math.min(260, Math.max(20, ta.scrollHeight)) + "px";
  }

  function keyboardClamp(el) {
    var maxTop = Math.round(window.innerHeight * 0.55) - el.offsetHeight;
    if (el.offsetTop > maxTop) el.style.top = Math.max(48, maxTop) + "px";
  }

  function removeNote(el, id, soft) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
    if (soft && window.sbNotesStore) {
      window.sbNotesStore.softDelete(id);
      if (window.showToast) window.showToast(tr("toast.toEchoes", { app: appTitleOf("echoes") }), tr("toast.toEchoesNote"), "");
    } else if (window.sbNotesStore) {
      /* empty note: never persist an invisible ghost */
      var live = window.sbNotesStore.load().filter(function (n) { return n.id !== id; });
      window.sbNotesStore.save(live);
    }
  }

  function loadDesktopNotes() {
    var host = notesLayer();
    if (!host || !window.sbNotesStore) return;
    host.innerHTML = "";
    window.sbNotesStore.load().forEach(function (n) {
      if (!n.onDesktop) return;
      if (!String(n.text || "").trim()) return;              /* empty restored notes never appear */
      buildNote(n);
    });
  }

  function forceSaveNotes() {
    $$(".sticky-note").forEach(function (el) { if (typeof el._sbPersist === "function") el._sbPersist(); });
    if (window.sbDB) window.sbDB.flushSync();
  }
  doc.addEventListener("visibilitychange", function () { if (doc.visibilityState === "hidden") forceSaveNotes(); });
  window.addEventListener("pagehide", forceSaveNotes);

  function createNoteAt(x, y) {
    if (!window.sbNotesStore) return null;
    var id = window.sbNotesStore.uid();
    /* Born where it was asked for, unless something is already there — then
       as close to it as there is room for. A note that lands on top of an
       icon reads as a bug even when it is exactly where you clicked. */
    var spot = noteSpotNear(x, y, 196, 96, null);
    var rec = { id: id, text: "", pinned: false, updatedAt: Date.now(), onDesktop: true, x: spot.x, y: spot.y };
    var live = window.sbNotesStore.load();
    live.unshift(rec);
    window.sbNotesStore.save(live);
    var el = buildNote(rec);
    if (el) {
      var ta = el.querySelector(".note-text");
      setTimeout(function () { try { ta.focus(); } catch (e) { /* ignore */ } }, 30);
    }
    return id;
  }
  window.sbCreateDesktopNote = createNoteAt;

  /* invitation on empty-desktop click */
  function closeInvite() {
    if (invite && invite.parentNode) invite.parentNode.removeChild(invite);
    invite = null;
  }
  window.sbNoteInviteOpen = function () { return !!invite; };
  window.sbCloseNoteInvite = closeInvite;

  function showInvite(x, y) {
    closeInvite();
    invite = doc.createElement("div");
    invite.className = "note-invite";
    invite.style.left = clamp(x, 12, window.innerWidth - 190) + "px";
    invite.style.top = clamp(y, 60, window.innerHeight - 90) + "px";
    invite.innerHTML = '<button class="invite-plus" type="button" aria-label="' + esc(tr("note.inviteAria")) + '">+</button><span>' + esc(tr("note.invite")) + "</span>";
    doc.body.appendChild(invite);
    var px = x, py = y;
    invite.querySelector(".invite-plus").addEventListener("click", function (ev) {
      ev.stopPropagation();
      closeInvite();
      createNoteAt(px, py);
    });
    setTimeout(closeInvite, isTouch() ? 5000 : 4200);
  }

  function onDesktopClick(ev) {
    if (ev.button !== 0) return;
    var t = ev.target;
    if (!t || !t.closest) return;
    if (t.closest(window.sbEmptyDesktopSkipSelector || ".window")) { closeInvite(); return; }
    if (invite) { closeInvite(); return; }
    showInvite(ev.clientX, ev.clientY);
  }

  /* ============================================== marquee multi-select §4.2 */
  function clearSelection() { $$(".selected").forEach(function (n) { n.classList.remove("selected"); }); }

  /* ── РАМКИ ВЫДЕЛЕНИЯ НА СЕНСОРНОМ ЭКРАНЕ НЕТ ВОВСЕ (v47) ────────────────
   *
   * Основатель поставил диагноз точнее Совета: «если просто нажимаю — точек
   * не остаётся, но если зажимаю и провожу пальцем — остаются такие же
   * оранжевые выделения». Это не следы выделения текста, которые Совет
   * чинил накануне, а РАМКА ГРУППОВОГО ВЫДЕЛЕНИЯ: палец, проведённый по
   * пустому месту, тянет её, помечает всё, чего коснулся, и метки остаются
   * до следующего нажатия. На пальце это к тому же неотличимо от попытки
   * что-то перетащить или прокрутить.
   *
   * Его же предложение и принято: на сенсорном вводе рамки нет совсем, и
   * переносится ровно один предмет за раз. Групповое выделение остаётся
   * мыши, где протягивание — однозначный жест и где оно действительно
   * экономит время.
   *
   * Проверка идёт по ТИПУ УКАЗАТЕЛЯ конкретного события, а не по типу
   * устройства: на планшете с мышью рамка работает, тем же пальцем на том
   * же планшете — нет. Устройство бывает и тем и другим; событие — нет.
   */
  function wireMarquee() {
    var scene = $("#desktop");
    if (!scene) return;
    var band = null, start = null;

    function dropBand() {
      if (band && band.parentNode) band.parentNode.removeChild(band);
      band = null; start = null;
    }

    scene.addEventListener("pointerdown", function (ev) {
      if (ev.button !== 0) return;
      if (ev.pointerType && ev.pointerType !== "mouse") { clearSelection(); return; }
      var t = ev.target;
      if (t && t.closest && t.closest(window.sbEmptyDesktopSkipSelector || ".window")) return;
      clearSelection();
      start = { x: ev.clientX, y: ev.clientY };
      band = doc.createElement("div");
      band.className = "marquee";
      doc.body.appendChild(band);
    });
    /* Прерванный жест обязан убирать за собой так же, как законченный:
       на телефоне браузер забирает указатель себе чаще, чем отпускает. */
    doc.addEventListener("pointercancel", dropBand);
    window.addEventListener("blur", dropBand);
    doc.addEventListener("touchend", function () { clearSelection(); }, { passive: true });
    doc.addEventListener("pointermove", function (ev) {
      if (!band || !start) return;
      var x = Math.min(start.x, ev.clientX), y = Math.min(start.y, ev.clientY);
      var w = Math.abs(ev.clientX - start.x), h = Math.abs(ev.clientY - start.y);
      band.style.left = x + "px"; band.style.top = y + "px";
      band.style.width = w + "px"; band.style.height = h + "px";
      var box = { x: x, y: y, w: w, h: h };
      $$("#sbIconLayer .desk-icon, #sbNoteLayer .sticky-note").forEach(function (n) {
        var r = n.getBoundingClientRect();
        var hit = !(box.x + box.w < r.left || r.right < box.x || box.y + box.h < r.top || r.bottom < box.y);
        n.classList.toggle("selected", hit);
      });
    });
    doc.addEventListener("pointerup", dropBand);

    /* group drag: capture-phase so the single-item handlers stay out of it */
    [$("#sbIconLayer"), $("#sbNoteLayer")].forEach(function (layerEl) {
      if (!layerEl) return;
      layerEl.addEventListener("pointerdown", function (ev) {
        /* Группового переноса на пальце не бывает по построению: выделять
           нечем. Условие оставлено явным, чтобы это читалось здесь, а не
           выводилось из отсутствия рамки этажом выше. */
        if (ev.pointerType && ev.pointerType !== "mouse") return;
        var member = ev.target && ev.target.closest ? ev.target.closest(".desk-icon.selected, .sticky-note.selected") : null;
        var members = $$(".desk-icon.selected, .sticky-note.selected");
        if (!member || members.length < 2) return;
        ev.stopPropagation();
        var startX = ev.clientX, startY = ev.clientY;
        var origins = members.map(function (n) { return { n: n, x: n.offsetLeft, y: n.offsetTop }; });
        function move(e2) {
          var dx = e2.clientX - startX, dy = e2.clientY - startY;
          origins.forEach(function (o) {
            o.n.style.left = Math.round(o.x + dx) + "px";
            o.n.style.top = Math.round(o.y + dy) + "px";
          });
        }
        function up() {
          doc.removeEventListener("pointermove", move);
          doc.removeEventListener("pointerup", up);
          origins.forEach(function (o) {
            if (o.n.classList.contains("sticky-note") && window.sbPersistNotePosition) {
              window.sbPersistNotePosition(o.n.getAttribute("data-id"), o.n.offsetLeft, o.n.offsetTop);
            }
            if (o.n.classList.contains("desk-icon")) o.n.setAttribute("data-dragged", "1");
          });
        }
        doc.addEventListener("pointermove", move);
        doc.addEventListener("pointerup", up);
      }, true);
    });
  }

  /* ================================================== context menus §4.5 */
  var menuEl = null;
  window.sbContextMenuOpen = function () { return !!(menuEl && menuEl.classList.contains("open")); };
  window.sbCloseContextMenu = function () {
    if (menuEl) { menuEl.classList.remove("open"); menuEl.setAttribute("hidden", ""); menuEl.innerHTML = ""; }
  };

  function menuHost() {
    if (menuEl) return menuEl;
    menuEl = $("#sbCtxMenu");
    return menuEl;
  }

  function buildMenu(items, x, y) {
    var host = menuHost();
    if (!host) return;
    host.innerHTML = items.map(function (it) {
      if (it === "-") return '<div class="ctx-sep"></div>';
      return '<button class="ctx-item" type="button">' + esc(it.label) + (it.check ? '<span class="ctx-check">✓</span>' : "") + "</button>";
    }).join("");
    host.removeAttribute("hidden");
    host.classList.add("open");
    /* measure before animating, then clamp into the viewport */
    var w = host.offsetWidth, h = host.offsetHeight;
    host.style.left = clamp(x, 8, Math.max(8, window.innerWidth - w - 8)) + "px";
    host.style.top = clamp(y, 8, Math.max(8, window.innerHeight - h - 8)) + "px";
    var buttons = $$(".ctx-item", host);
    var n = 0;
    items.forEach(function (it) {
      if (it === "-") return;
      var b = buttons[n++];
      if (!b) return;
      b.addEventListener("click", function () {
        window.sbCloseContextMenu();
        try { it.run(); } catch (e) { if (window.console) console.error("[ctx]", e); }
      });
    });
  }

  function desktopMenuItems(x, y) {
    var items = [
      { label: tr("menu.newNote"), run: function () { createNoteAt(x, y); } },        /* FIX: really creates one */
      { label: tr("menu.tidyWidgets"), run: function () { if (window.sbTidyWidgets) window.sbTidyWidgets(); } },
      { label: tr("menu.saveWidgets"), run: function () {
        var nm = window.prompt(tr("menu.nameLayout"));
        if (nm && window.sbSaveCurrentWidgetLayout) window.sbSaveCurrentWidgetLayout(nm);
      } }
    ];
    (window.sbGetSavedWidgetLayouts ? window.sbGetSavedWidgetLayouts() : []).forEach(function (L) {
      items.push({ label: tr("menu.restoreLayout", { name: L.name }), run: function () { if (window.sbApplyNamedLayout) window.sbApplyNamedLayout(L.snap); } });
    });
    items.push("-");
    [["menu.clipboard", "sbClipOverlay"], ["menu.switchWindows", "sbTaskOverlay"],
     ["menu.shortcuts", "sbShortcutsOverlay"]].forEach(function (p) {
      items.push({ label: tr(p[0]), run: function () { if (window.sbPanels && window.sbPanels[p[1]]) window.sbPanels[p[1]].open(); } });
    });
    return items;
  }

  function openMenu(ev, kind, target) {
    ev.preventDefault();
    ev.stopPropagation();
    var x = ev.clientX, y = ev.clientY, items;
    if (kind === "widget") {
      items = [
        { label: tr("menu.resetPosition"), run: function () {
          var w = target.offsetWidth, h = target.offsetHeight;
          target.style.left = Math.round((window.innerWidth - w) / 2) + "px";
          target.style.top = Math.round((window.innerHeight - h) / 2) + "px";
          persistWidget(target);
        } },
        { label: tr("menu.hideWidget"), run: function () { if (window.sbSetWidgetHidden) window.sbSetWidgetHidden(target.getAttribute("data-widget"), true); } },
        "-",
        { label: tr("menu.toggleTheme"), run: function () { if (window.setTheme) window.setTheme(window.sbGetTheme() === "light" ? "dark" : "light"); } },
        { label: tr("menu.shortcuts"), run: function () { if (window.sbPanels && window.sbPanels.sbShortcutsOverlay) window.sbPanels.sbShortcutsOverlay.open(); } }
      ];
    } else if (kind === "icon") {
      var id = target.getAttribute("data-app");
      var def = ((window.SysBaby && window.SysBaby.apps) || {})[id] || {};
      items = [
        { label: tr("menu.open", { app: appLabelOf(id) }), run: function () { if (window.toggleApp) window.toggleApp(id); } },
        { label: tr("menu.removeIcon"), run: function () { if (window.sbSetIconHidden) window.sbSetIconHidden(id, true); } },
        "-",
        { label: tr("menu.manageDesktop"), run: function () { if (window.sbPanels && window.sbPanels.sbWidgetsOverlay) window.sbPanels.sbWidgetsOverlay.open(); } }
      ];
    } else {
      items = desktopMenuItems(x, y);
    }
    buildMenu(items, x, y);
  }

  function wireContextMenus() {
    var scene = $("#desktop");
    if (scene) {
      scene.addEventListener("contextmenu", function (ev) {
        var t = ev.target;
        if (t && t.closest && t.closest(".desk-icon")) { openMenu(ev, "icon", t.closest(".desk-icon")); return; }
        if (t && t.closest && t.closest(".sb-widget")) return;    /* header handles its own */
        if (t && t.closest && t.closest(window.sbEmptyDesktopSkipSelector || ".window")) return;
        openMenu(ev, "desktop", null);
      });
    }
    doc.addEventListener("pointerdown", function (ev) {
      if (!window.sbContextMenuOpen()) return;
      if (ev.target && ev.target.closest && ev.target.closest("#sbCtxMenu")) return;
      window.sbCloseContextMenu();
    }, true);
    window.addEventListener("scroll", function () { window.sbCloseContextMenu(); }, true);
    window.addEventListener("blur", function () { window.sbCloseContextMenu(); });
  }

  /* ================================================ quick actions orb §4.5 */
  function wireFab() {
    var fab = $("#sbFab");
    if (!fab) return;
    var saved = readJSON("sysbaby.fab.pos", null);
    if (saved && isFinite(saved.x) && isFinite(saved.y) &&
        saved.x > 0 && saved.x < window.innerWidth - 40 && saved.y > 40 && saved.y < window.innerHeight - 40) {
      fab.style.left = saved.x + "px";
      fab.style.top = saved.y + "px";
      fab.style.right = "auto";
      fab.style.bottom = "auto";
    }
    window.addEventListener("orientationchange", function () {
      fab.style.left = ""; fab.style.top = ""; fab.style.right = ""; fab.style.bottom = "";
      if (window.sbDB) window.sbDB.remove("sysbaby.fab.pos");
    });

    var drag = null;
    fab.addEventListener("pointerdown", function (ev) {
      drag = { sx: ev.clientX, sy: ev.clientY, ox: fab.offsetLeft, oy: fab.offsetTop, moved: false };
      try { fab.setPointerCapture(ev.pointerId); } catch (e) { /* ignore */ }
    });
    fab.addEventListener("pointermove", function (ev) {
      if (!drag) return;
      var dx = ev.clientX - drag.sx, dy = ev.clientY - drag.sy;
      if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 5) return;
      drag.moved = true;
      fab.style.right = "auto"; fab.style.bottom = "auto";
      fab.style.left = clamp(drag.ox + dx, 6, window.innerWidth - fab.offsetWidth - 6) + "px";
      fab.style.top = clamp(drag.oy + dy, 50, window.innerHeight - fab.offsetHeight - 6) + "px";
    });
    fab.addEventListener("pointerup", function () {
      if (!drag) return;
      var moved = drag.moved;
      drag = null;
      if (moved) { writeJSON("sysbaby.fab.pos", { x: fab.offsetLeft, y: fab.offsetTop }); return; }
      if (window.sbContextMenuOpen()) { window.sbCloseContextMenu(); return; }
      var r = fab.getBoundingClientRect();
      buildMenu(desktopMenuItems(r.left, r.top - 12), r.left - 150, Math.max(60, r.top - 320));
    });
  }

  /* ===================================================== initialisation */
  function init() {
    applyWidgetVisibility();
    widgetNodes().forEach(function (n) { placeWidget(n, false); wireWidget(n); });
    mountCapture();
    loadDesktopNotes();
    if (window.sbNotesStore) window.sbNotesStore.onChange(function () {
      /* another surface changed the notes — refresh unless the user is typing here */
      var ae = doc.activeElement;
      if (ae && ae.closest && ae.closest(".sticky-note")) return;
      loadDesktopNotes();
    });
    var scene = $("#desktop");
    if (scene) scene.addEventListener("click", onDesktopClick);
    wireMarquee();
    wireContextMenus();
    wireFab();
    /* widget modules that load after the shell can mount on this signal */
    try { doc.dispatchEvent(new CustomEvent("sysbaby:widgets-ready")); } catch (e) { /* ignore */ }
    window.addEventListener("resize", function () {
      widgetNodes().forEach(function (n) {
        if (n.hidden) return;
        var w = n.offsetWidth, h = n.offsetHeight;
        n.style.left = clamp(n.offsetLeft, 8, Math.max(8, window.innerWidth - w - 8)) + "px";
        n.style.top = clamp(n.offsetTop, 50, Math.max(50, window.innerHeight - h - 8)) + "px";
        sizeTier(n);
      });
    });
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
  else init();
})();
