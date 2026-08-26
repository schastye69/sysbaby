/* sys.baby OS — Echoes (the recovery layer).
 *
 * Spec: os-apps.md section 8.
 * Owns no storage of its own: soft-deleted notes come from the shared notes
 * store, hidden desktop icons from the shell's icon-visibility API.
 *
 * Retention is INDEFINITE. Nothing auto-expires, ever — the fade is cosmetic
 * honesty about time passing, never a deadline. Items leave only by Restore
 * or Silence (which always asks first).
 */
(function () {
  "use strict";

  var FADE_SPAN = 14 * 86400000;   // 14 days — cosmetic only, never a purge deadline

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="2.2"/><path d="M7.8 8.4a5.6 5.6 0 0 0 0 7.2M16.2 8.4a5.6 5.6 0 0 1 0 7.2"/><path d="M4.9 5.6a9.6 9.6 0 0 0 0 12.8M19.1 5.6a9.6 9.6 0 0 1 0 12.8"/></svg>';

  /* Trace content — the system's memory of itself, resting where removed
   * things rest. The shell spec (os-shell.md §12) originally DROPPED the
   * traces seeder; that decision was REVERSED in v21, when the desktop grew
   * its journal layer (Terminal `log`, Vault/Journal, this): a system that
   * remembers how it was built is the product speaking for itself, and Echoes
   * — the app that never forgets — is exactly where its own past belongs.
   * Seeded once per profile (guard key below); restore or silence them like
   * anything else, and they never come back on their own. */
  var TRACE_GUARD = "sysbaby.traces.seeded";
  /* Тексты засеянных эх живут в STRINGS ядра (ключи ec.seed.*): это голос
     студии, и он должен звучать на языке того, кто открыл систему. После
     засева это обычные данные профиля — перевод к ним больше не возвращается. */
  var TRACE_NOTES = [
    { id: "trace-echo-0", key: "ec.seed.0", ageDays: 9 },
    { id: "trace-echo-1", key: "ec.seed.1", ageDays: 4 },
    { id: "trace-echo-2", key: "ec.seed.2", ageDays: 21 },
    { id: "trace-echo-3", key: "ec.seed.3", ageDays: 2 },
    { id: "trace-echo-4", key: "ec.seed.4", ageDays: 1 }
  ];
  /* (The former TRACE_DOCUMENTS file moved to the Vault's Journal folder in
   * v21 — documents belong with documents; echoes hold what was let go.) */

  /* One living note rides along into Scribble: the door to the journal.
   * Pinned so it is seen once, deletable so it is never in the way — and when
   * deleted it arrives here, which is its own small lesson. */
  function t(key, vars) { return typeof window.sbT === "function" ? window.sbT(key, vars) : key; }
  function appName(id) { return window.sbAppTitle ? window.sbAppTitle(id) : id; }
  function journalNote() {
    return t("nt.journalNote", {
      terminal: appName("terminal"), files: appName("files"), echoes: appName("echoes")
    });
  }

  function seedTraces() {
    var s = store();
    var db = window.sbDB;
    if (!s || !db) return;
    try {
      if (db.get(TRACE_GUARD) === "1") return;
      var now = Date.now();
      var live = s.load();
      var deleted = s.loadDeleted();
      var have = {};
      live.concat(deleted).forEach(function (n) { if (n && n.id) have[n.id] = true; });

      var batch = live.slice();
      /* Имя параметра НЕ t: так зовут функцию перевода в этом файле, и
         затенение её здесь молча превратило бы t("ec.seed.0") в обращение к
         объекту следа. */
      TRACE_NOTES.forEach(function (trace) {
        if (have[trace.id]) return;
        batch.push({
          id: trace.id,
          text: t(trace.key),
          pinned: false,
          updatedAt: now - Math.round(trace.ageDays * 86400000),
          deletedAt: now - Math.round(trace.ageDays * 86400000)
        });
      });
      if (!have["trace-scribble-journal"]) {
        batch.unshift({
          id: "trace-scribble-journal",
          text: journalNote(),
          pinned: true,
          updatedAt: now - 3 * 86400000
        });
      }
      s.save(batch);
      db.set(TRACE_GUARD, "1");
      s.notify();
    } catch (err) { console.error("[echoes] trace seeding failed", err); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", seedTraces);
  else seedTraces();

  /* -------------------------------------------------------------- helpers */

  function esc(value) {
    if (typeof window.escapeHtml === "function") return window.escapeHtml(value == null ? "" : String(value));
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function bodyOf(win) { return win && win.el ? win.el.querySelector(".window-body") : null; }

  function store() { return window.sbNotesStore || null; }

  function toast(title, text) {
    if (typeof window.showToast !== "function") return;
    try { window.showToast(title, text, ICON); } catch (err) { console.error("[echoes] toast failed", err); }
  }

  function timeAgo(ts) {
    var diff = Date.now() - (Number(ts) || 0);
    if (diff < 60000) return t("time.now");
    var m = Math.floor(diff / 60000);
    if (m < 60) return t("time.m", { n: m });
    var h = Math.floor(m / 60);
    if (h < 24) return t("time.h", { n: h });
    var d = Math.floor(h / 24);
    if (d < 14) return t("time.d", { n: d });
    return t("time.w", { n: Math.floor(d / 7) });
  }

  function hash(text) {
    var h = 0, s = String(text == null ? "" : text);
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  /* Deterministic per id — the wave never reshuffles between renders. */
  function barHeights(id) {
    var seed = hash(id) || 1;
    var out = [];
    for (var i = 0; i < 9; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      out.push(0.22 + (seed % 1000) / 1000 * 0.78);
    }
    return out;
  }

  function fadeOf(deletedAt) {
    var age = Date.now() - (Number(deletedAt) || 0);
    return Math.min(1, Math.max(0, age / FADE_SPAN));
  }

  function snippetOf(text) {
    var lines = String(text == null ? "" : text).split("\n");
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (line !== "") return line.length > 72 ? line.slice(0, 72) + "…" : line;
    }
    return "(empty note)";
  }

  /* ---------------------------------------------------------------- data */

  function deletedNotes() {
    var s = store();
    if (!s || typeof s.loadDeleted !== "function") return [];
    var list;
    try { list = s.loadDeleted() || []; } catch (err) { console.error("[echoes] loadDeleted failed", err); return []; }
    return list.slice().sort(function (a, b) { return (b.deletedAt || 0) - (a.deletedAt || 0); });
  }

  function hiddenApps() {
    if (typeof window.sbGetHiddenIcons !== "function") return [];
    var ids;
    try { ids = window.sbGetHiddenIcons() || []; } catch (err) { console.error("[echoes] hidden icons failed", err); return []; }
    var apps = (window.SysBaby && window.SysBaby.apps) || {};
    return ids.filter(function (id) { return !!apps[id]; }).map(function (id) {
      return { id: id, title: window.sbAppTitle ? window.sbAppTitle(id) : (apps[id].title || id), color: apps[id].color || "", icon: apps[id].icon || ICON };
    });
  }

  /* -------------------------------------------------------------- markup */

  function waveMarkup(note, fade) {
    var bars = barHeights(note.id).map(function (h) {
      var height = Math.max(2, Math.round(h * 18 * (1 - fade * 0.55)));
      return '<i style="height:' + height + 'px"></i>';
    }).join("");
    return '<span class="ec-wave">' + bars + "</span>";
  }

  function echoRowMarkup(note) {
    var fade = fadeOf(note.deletedAt);
    return '<div class="ec-row" style="opacity:' + (1 - fade * 0.5).toFixed(3) + '" data-id="' + esc(note.id) + '">' +
      waveMarkup(note, fade) +
      '<span class="ec-row-text">' +
        /* Текст эха — то, что посетитель когда-то написал или получил. */
        '<span class="ec-snippet" data-sb-userdata>' + esc(snippetOf(note.text)) + "</span>" +
        '<span class="ec-time">' + esc(timeAgo(note.deletedAt)) + "</span>" +
      "</span>" +
      '<span class="ec-actions">' +
        '<button type="button" class="ec-btn" data-restore="' + esc(note.id) + '">' + esc(t("ec.restore")) + "</button>" +
        '<button type="button" class="ec-btn x" data-silence="' + esc(note.id) + '" title="' + esc(t("ec.silenceTitle")) + '" aria-label="' + esc(t("ec.silenceAria")) + '">✕</button>' +
      "</span>" +
    "</div>";
  }

  function appRowMarkup(app) {
    return '<div class="ec-row app">' +
      '<span class="ec-app-tile" style="background:' + esc(app.color) + '">' + app.icon + "</span>" +
      '<span class="ec-row-text">' +
        '<span class="ec-snippet">' + esc(app.title) + "</span>" +
        '<span class="ec-time">' + esc(t("ec.appRemoved")) + "</span>" +
      "</span>" +
      '<span class="ec-actions">' +
        '<button type="button" class="ec-btn" data-restore-app="' + esc(app.id) + '">' + esc(t("ec.restore")) + "</button>" +
      "</span>" +
    "</div>";
  }

  /* Части стола — не приложения (кнопка действия и всё, что появится дальше).
     Список читается у оболочки: Эхо не знает, из чего стол состоит, оно знает
     только, что убранное лежит здесь. */
  function hiddenParts() {
    if (typeof window.sbDeskParts !== "function") return [];
    try { return window.sbDeskParts().filter(function (p) { return p.hidden; }); }
    catch (err) { console.error("[echoes] desk parts failed", err); return []; }
  }
  function partRowMarkup(part) {
    return '<div class="ec-row app">' +
      '<span class="ec-app-tile part">' + ICON + "</span>" +
      '<span class="ec-row-text">' +
        '<span class="ec-snippet">' + esc(part.title) + "</span>" +
        '<span class="ec-time">' + esc(t("ec.appRemoved")) + "</span>" +
      "</span>" +
      '<span class="ec-actions">' +
        '<button type="button" class="ec-btn" data-restore-part="' + esc(part.id) + '">' + esc(t("ec.restore")) + "</button>" +
      "</span>" +
    "</div>";
  }

  function render(win) {
    var host = bodyOf(win);
    if (!host) return;
    var echoes = deletedNotes();
    var apps = hiddenApps();
    var parts = hiddenParts();

    var markup;
    if (!echoes.length && !apps.length && !parts.length) {
      markup = '<div class="ec-empty">' +
        '<div class="ec-empty-glyph">' + ICON + "</div>" +
        '<p class="ec-empty-title">' + esc(t("ec.empty.title")) + "</p>" +
        '<p class="ec-empty-sub">' + esc(t("ec.empty.sub", { echoes: appName("echoes") })) + "</p>" +
      "</div>";
    } else {
      markup = "";
      if (echoes.length) {
        markup += '<div class="ec-head">' +
          "<span>" + esc(t(echoes.length === 1 ? "ec.count.one" : "ec.count.many", { n: echoes.length })) + "</span>" +
          '<button type="button" class="ec-btn quiet" id="ecSilenceAll">' + esc(t("ec.silenceAll")) + "</button>" +
        "</div>" + echoes.map(echoRowMarkup).join("");
      }
      if (apps.length || parts.length) {
        var n = apps.length + parts.length;
        markup += '<div class="ec-head second"><span>' + esc(t(n === 1 ? "ec.apps.one" : "ec.apps.many", { n: n })) + "</span></div>" +
          apps.map(appRowMarkup).join("") + parts.map(partRowMarkup).join("");
      }
    }

    /* Прокрутка человека переживает перерисовку — средство оболочки,
     общее для всех приложений (D-099). */
    var _sbKeep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
    host.innerHTML = '<div class="app-echoes">' + markup + "</div>";
    if (_sbKeep) _sbKeep();
    wire(win, host, echoes.length);
  }

  function wire(win, host, echoCount) {
    host.querySelectorAll("[data-restore]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var s = store();
        if (!s) return;
        try { s.restore(btn.getAttribute("data-restore")); }
        catch (err) { console.error("[echoes] restore failed", err); return; }
        toast(t("ec.toast.restoredTitle"), t("ec.toast.restoredBody"));
        render(win);
      });
    });

    host.querySelectorAll("[data-silence]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var s = store();
        if (!s) return;
        if (!window.confirm(t("ec.confirm.one"))) return;
        try { s.purge(btn.getAttribute("data-silence")); }
        catch (err) { console.error("[echoes] purge failed", err); return; }
        render(win);
      });
    });

    var all = host.querySelector("#ecSilenceAll");
    if (all) {
      all.addEventListener("click", function () {
        var s = store();
        if (!s) return;
        if (!window.confirm(t("ec.confirm.all", { n: echoCount }))) return;
        /* Touches the notes store only — hidden apps live in shell storage this
         * button cannot reach. There must be no way for it to remove an app. */
        try { s.purgeAllDeleted(); }
        catch (err) { console.error("[echoes] purge-all failed", err); return; }
        render(win);
      });
    }

    host.querySelectorAll("[data-restore-part]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (typeof window.sbSetDeskPartHidden !== "function") return;
        try { window.sbSetDeskPartHidden(btn.getAttribute("data-restore-part"), false); }
        catch (err) { console.error("[echoes] part restore failed", err); return; }
        render(win);
      });
    });

    host.querySelectorAll("[data-restore-app]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (typeof window.sbSetIconHidden !== "function") return;
        try { window.sbSetIconHidden(btn.getAttribute("data-restore-app"), false); }
        catch (err) { console.error("[echoes] icon restore failed", err); return; }
        render(win);
      });
    });
  }

  /* --------------------------------------------------------- live refresh */

  function refreshOpen() {
    var win = typeof window.getOpenWindow === "function" ? window.getOpenWindow("echoes") : null;
    if (win && win.el) render(win);
  }

  /* Subscribed ONCE at module load, never per window open. */
  if (window.sbNotesStore && typeof window.sbNotesStore.onChange === "function") {
    window.sbNotesStore.onChange(refreshOpen);
  } else {
    document.addEventListener("sysbaby:notes-changed", refreshOpen);
  }
  if (window.sbBus && typeof window.sbBus.on === "function") {
    window.sbBus.on("icon:visibility", refreshOpen);
    window.sbBus.on("part:visibility", refreshOpen);
  }

  /* ------------------------------------------------- opt-in trace seeding */

  window.sbSeedTraceContent = function () {
    var db = window.sbDB;
    var guard = "sysbaby.traces.seeded";
    var already = null;
    try { already = db && typeof db.get === "function" ? db.get(guard) : localStorage.getItem(guard); }
    catch (err) { console.error("[echoes] trace guard read failed", err); return false; }
    if (already === "1") return false;

    var s = store();
    if (s && typeof s.save === "function") {
      var now = Date.now();
      var list = s.load() || [];
      var existing = {};
      (s.loadDeleted() || []).forEach(function (n) { existing[n.id] = true; });
      TRACE_NOTES.forEach(function (trace) {
        if (existing[trace.id]) return;
        var stamp = now - trace.ageDays * 86400000;
        list.push({ id: trace.id, text: t(trace.key), pinned: false, updatedAt: stamp, deletedAt: stamp, x: 0, y: 0 });
      });
      s.save(list);
      s.notify();
    }
    if (typeof window.sbFilesSeedDocument === "function") {
      TRACE_DOCUMENTS.forEach(function (doc) {
        try { window.sbFilesSeedDocument(doc.name, doc.body); }
        catch (err) { console.error("[echoes] trace document failed", err); }
      });
    }
    try {
      if (db && typeof db.set === "function") db.set(guard, "1");
      else localStorage.setItem(guard, "1");
    } catch (err) { console.error("[echoes] trace guard write failed", err); }
    return true;
  };

  /* ------------------------------------------------------- registration */

  if (typeof window.registerApp === "function") {
    window.registerApp("echoes", {
      title: "Echoes",
      i18n: {
        ru: { title: "Эхо", label: "Эхо" },
        ee: { title: "Kajad", label: "Kajad" },
      },
      label: "Echoes",
      color: "linear-gradient(160deg,#b3a4ff 0%,#7c63f5 46%,#4526c9 100%)",
      icon: ICON,
      size: { w: 420, h: 520 },
      deskPos: { x: 140, y: 260 },
      render: render
    });
  }
})();
