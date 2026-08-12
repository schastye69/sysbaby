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
  var TRACE_NOTES = [
    { id: "trace-echo-0", text: "Nothing you delete here is destroyed. It waits, gets quieter, and stays restorable. That was a decision, not an accident — most systems ask you to be certain at the worst possible moment.", ageDays: 9 },
    { id: "trace-echo-1", text: "If you are reading this, you deleted something and then went looking for it. That instinct is the reason this app exists.", ageDays: 4 },
    { id: "trace-echo-2", text: "Every app on this desktop was built by the same two hands that build the systems we sell. Nothing here is a template. You can check: open the portfolio and use the real one.", ageDays: 21 },
    { id: "trace-echo-3", text: "aug 2026 — the word 'applications' was removed from the landing page. It rested a while in a place much like this one, then we understood: the light under the door says it better with no letters at all.", ageDays: 2 },
    { id: "trace-echo-4", text: "10 aug 2026 — the first letter truly left this system and reached the studio's inbox. The chain behind the form had been broken in three places, and everything had LOOKED fine. Since that day: a thing exists when it is observed working.", ageDays: 1 }
  ];
  /* (The former TRACE_DOCUMENTS file moved to the Vault's Journal folder in
   * v21 — documents belong with documents; echoes hold what was let go.) */

  /* One living note rides along into Scribble: the door to the journal.
   * Pinned so it is seen once, deletable so it is never in the way — and when
   * deleted it arrives here, which is its own small lesson. */
  var JOURNAL_NOTE = "This desktop keeps a journal of its own building — open Terminal and type `log`. The longer entries live in Vault → Journal.\n\nEvery entry is true.\n\n(This note is yours now: edit it, unpin it, or delete it — it will wait in Echoes, like everything here.)";

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
      TRACE_NOTES.forEach(function (t) {
        if (have[t.id]) return;
        batch.push({
          id: t.id,
          text: t.text,
          pinned: false,
          updatedAt: now - Math.round(t.ageDays * 86400000),
          deletedAt: now - Math.round(t.ageDays * 86400000)
        });
      });
      if (!have["trace-scribble-journal"]) {
        batch.unshift({
          id: "trace-scribble-journal",
          text: JOURNAL_NOTE,
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
    if (diff < 60000) return "Just now";
    var m = Math.floor(diff / 60000);
    if (m < 60) return m + "m ago";
    var h = Math.floor(m / 60);
    if (h < 24) return h + "h ago";
    var d = Math.floor(h / 24);
    if (d < 14) return d + "d ago";
    return Math.floor(d / 7) + "w ago";
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
        '<span class="ec-snippet">' + esc(snippetOf(note.text)) + "</span>" +
        '<span class="ec-time">' + esc(timeAgo(note.deletedAt)) + "</span>" +
      "</span>" +
      '<span class="ec-actions">' +
        '<button type="button" class="ec-btn" data-restore="' + esc(note.id) + '">Restore</button>' +
        '<button type="button" class="ec-btn x" data-silence="' + esc(note.id) + '" title="Delete forever — cannot be undone" aria-label="Delete forever">✕</button>' +
      "</span>" +
    "</div>";
  }

  function appRowMarkup(app) {
    return '<div class="ec-row app">' +
      '<span class="ec-app-tile" style="background:' + esc(app.color) + '">' + app.icon + "</span>" +
      '<span class="ec-row-text">' +
        '<span class="ec-snippet">' + esc(app.title) + "</span>" +
        '<span class="ec-time">Removed from desktop — never deleted</span>' +
      "</span>" +
      '<span class="ec-actions">' +
        '<button type="button" class="ec-btn" data-restore-app="' + esc(app.id) + '">Restore</button>' +
      "</span>" +
    "</div>";
  }

  function render(win) {
    var host = bodyOf(win);
    if (!host) return;
    var echoes = deletedNotes();
    var apps = hiddenApps();

    var markup;
    if (!echoes.length && !apps.length) {
      markup = '<div class="ec-empty">' +
        '<div class="ec-empty-glyph">' + ICON + "</div>" +
        '<p class="ec-empty-title">Nothing echoes here yet</p>' +
        '<p class="ec-empty-sub">Deleted notes and apps you’ve removed from the desktop settle here first — nothing disappears without a second chance. Drag anything onto Echoes to send it here.</p>' +
      "</div>";
    } else {
      markup = "";
      if (echoes.length) {
        markup += '<div class="ec-head">' +
          "<span>" + echoes.length + " echo" + (echoes.length === 1 ? "" : "es") + "</span>" +
          '<button type="button" class="ec-btn quiet" id="ecSilenceAll">Silence all</button>' +
        "</div>" + echoes.map(echoRowMarkup).join("");
      }
      if (apps.length) {
        markup += '<div class="ec-head second"><span>' + apps.length + " hidden app" + (apps.length === 1 ? "" : "s") + "</span></div>" +
          apps.map(appRowMarkup).join("");
      }
    }

    host.innerHTML = '<div class="app-echoes">' + markup + "</div>";
    wire(win, host, echoes.length);
  }

  function wire(win, host, echoCount) {
    host.querySelectorAll("[data-restore]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var s = store();
        if (!s) return;
        try { s.restore(btn.getAttribute("data-restore")); }
        catch (err) { console.error("[echoes] restore failed", err); return; }
        toast("Note restored", "It's back where it was.");
        render(win);
      });
    });

    host.querySelectorAll("[data-silence]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var s = store();
        if (!s) return;
        if (!window.confirm("Silence this echo forever? This cannot be undone.")) return;
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
        if (!window.confirm("Silence all " + echoCount + " echoes forever? This cannot be undone.")) return;
        /* Touches the notes store only — hidden apps live in shell storage this
         * button cannot reach. There must be no way for it to remove an app. */
        try { s.purgeAllDeleted(); }
        catch (err) { console.error("[echoes] purge-all failed", err); return; }
        render(win);
      });
    }

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
        list.push({ id: trace.id, text: trace.text, pinned: false, updatedAt: stamp, deletedAt: stamp, x: 0, y: 0 });
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
