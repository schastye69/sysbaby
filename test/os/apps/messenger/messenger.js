/* sys.baby OS — Messenger (brand "Whisper").
 *
 * Spec: os-apps.md section 6.
 * Storage: sysbaby.messenger.v3 (via sbDB) — array of conversations.
 * Legacy:  sysbaby.messenger.v2 (ids/ts/muted, no groups/edit/reactions)
 *          sysbaby.messenger.v1 (messages are only {from,text})
 * The normalizer runs on EVERY load; after a verified v3 write both legacy
 * keys are removed.
 *
 * Honesty rule: sample contacts never fake replies. One system notice per
 * conversation, then silence. No typing indicator, no presence simulator.
 */
(function () {
  "use strict";

  var KEY_V3 = "sysbaby.messenger.v3";
  var KEY_V2 = "sysbaby.messenger.v2";
  var KEY_V1 = "sysbaby.messenger.v1";

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 6.4A1.9 1.9 0 0 1 6.4 4.5h11.2a1.9 1.9 0 0 1 1.9 1.9v7.4a1.9 1.9 0 0 1-1.9 1.9H9.8L5.6 19.3a.6.6 0 0 1-1-.47V15.7a1.9 1.9 0 0 1-.1-.6V6.4Z"/></svg>';
  var PAPERCLIP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M18.5 11.3 12 17.8a4 4 0 0 1-5.7-5.7l7-7a2.7 2.7 0 0 1 3.8 3.8l-7 7a1.3 1.3 0 0 1-1.9-1.9l6.3-6.3"/></svg>';
  var FILE_GLYPH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.6h7.2L18 8.4v12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"/><path d="M13.2 3.6v4.8H18"/></svg>';
  var GROUP_GLYPH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="9.5" r="3"/><path d="M3.8 19a5.2 5.2 0 0 1 10.4 0"/><path d="M16 7.1a2.9 2.9 0 0 1 0 5.6M17.4 19a5.2 5.2 0 0 0-2-4.1"/></svg>';

  var PALETTE = ["#0a84ff", "#ff9500", "#30d158", "#ff375f", "#5e5ce6", "#ffd60a", "#64d2ff", "#bf5af2"];
  var REACTIONS = ["👍", "❤️", "😂", "😮", "😢"];
  /* Строки живут в STRINGS ядра (core/topbar.js); здесь только ключи. */
  function t(key, vars) { return typeof window.sbT === "function" ? window.sbT(key, vars) : key; }
  function appName(id) { return window.sbAppTitle ? window.sbAppTitle(id) : id; }

  var SEED = [
    { id: 1, name: "Sample Client · Logistics", initials: "SL", color: "#0a84ff", unread: true, muted: false, isGroup: false, members: [], online: true,
      messages: [
        { from: "them", text: "The new order-routing automation went live this morning — dispatch time is already down about 40%.", tsOffsetHours: 5 },
        { from: "them", text: "Could we scope the supplier-invoice flow for next sprint?", tsOffsetHours: 4.8 }
      ] },
    { id: 2, name: "Sample Client · Retail", initials: "SR", color: "#ff9500", unread: false, muted: false, isGroup: false, members: [], online: false,
      messages: [
        { from: "them", text: "Signed the SoW and sent it back — kickoff Monday?", tsOffsetHours: 26 },
        { from: "me", text: "Received. Kickoff confirmed for Monday 10:00.", tsOffsetHours: 25.8 }
      ] },
    { id: 3, name: "Sample Project · Delivery", initials: "SP", color: "#30d158", unread: false, muted: false, isGroup: true, members: ["Delivery Lead", "Engineer", "Sample Client"], online: true,
      messages: [
        { from: "them", senderName: "Delivery Lead", text: "Staging passed all checks. Client demo scheduled Thursday 14:00.", tsOffsetHours: 70 }
      ] }
  ];

  /* -------------------------------------------------------------- helpers */

  function esc(value) {
    if (typeof window.escapeHtml === "function") return window.escapeHtml(value == null ? "" : String(value));
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function dbGet(key) {
    try {
      if (window.sbDB && typeof window.sbDB.get === "function") return window.sbDB.get(key);
      return localStorage.getItem(key);
    } catch (err) { console.error("[messenger] read failed", err); return null; }
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
    } catch (err) { console.error("[messenger] remove failed", err); }
  }

  function dbFlush() {
    try { if (window.sbDB && typeof window.sbDB.flushSync === "function") window.sbDB.flushSync(); }
    catch (err) { console.error("[messenger] flush failed", err); }
  }

  function toast(title, text) {
    if (typeof window.showToast !== "function") return;
    try { window.showToast(title, text, ICON); } catch (err) { console.error("[messenger] toast failed", err); }
  }

  function bodyOf(win) { return win && win.el ? win.el.querySelector(".window-body") : null; }

  function uid() { return "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  function hash(text) {
    var h = 0, s = String(text == null ? "" : text);
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }

  function initialsOf(name) {
    var words = String(name == null ? "" : name).trim().split(/\s+/).filter(Boolean);
    if (!words.length) return "?";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  function colorFor(name) { return PALETTE[hash(name) % PALETTE.length]; }

  var DATE_LOCALE = { en: "en-GB", ru: "ru-RU", ee: "et-EE" };

  function dayLabel(ts) {
    var d = new Date(Number(ts) || 0), now = new Date();
    function startOf(x) { return new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime(); }
    var days = Math.round((startOf(now) - startOf(d)) / 86400000);
    if (days === 0) return t("mg.day.today");
    if (days === 1) return t("mg.day.yesterday");
    var opts = { day: "numeric", month: "short" };
    if (d.getFullYear() !== now.getFullYear()) opts.year = "numeric";
    /* Дата пишется по правилам языка окна, а не по британским. */
    return d.toLocaleDateString(DATE_LOCALE[window.sbLang ? window.sbLang() : "en"] || "en-GB", opts);
  }

  function clockOf(ts) {
    return new Date(Number(ts) || 0).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false });
  }

  /* ------------------------------------------------------------ data model */

  var convos = null;
  var activeId = null;

  function normalizeMessages(list) {
    var messages = Array.isArray(list) ? list : [];
    var base = Date.now() - messages.length * 60000;
    messages.forEach(function (m, idx) {
      if (!m || typeof m !== "object") return;
      if (!m.id) m.id = uid();
      if (m.edited == null) m.edited = false;
      if (m.reaction === undefined) m.reaction = null;
      if (m.ts == null) m.ts = base + idx * 60000;
    });
    return messages;
  }

  /* Fills only missing fields — existing values always win. */
  function normalizeConversation(c, idx) {
    if (!c || typeof c !== "object") return c;
    if (c.id == null) c.id = idx + 1;
    if (c.name == null) c.name = "";
    if (c.muted == null) c.muted = false;
    if (c.isGroup == null) c.isGroup = false;
    if (!Array.isArray(c.members)) c.members = [];
    /* v21: presence is no longer invented. A local app cannot know whether a
       person is "online", so it no longer claims to — the dot was a hash of
       the contact's name, which is a costume, not a fact. */
    if (c.online == null) c.online = false;
    if (c.unread == null) c.unread = false;
    if (!c.initials) c.initials = initialsOf(c.name);
    if (!c.color) c.color = colorFor(c.name);
    c.messages = normalizeMessages(c.messages);
    return c;
  }

  function normalizeAll(list) {
    return (Array.isArray(list) ? list : []).map(normalizeConversation);
  }

  function parseList(raw) {
    if (typeof raw !== "string" || raw === "") return null;
    try {
      var value = JSON.parse(raw);
      return Array.isArray(value) ? value : null;
    } catch (err) { console.error("[messenger] corrupt conversation JSON", err); return null; }
  }

  function write() {
    try {
      dbSet(KEY_V3, JSON.stringify(convos));
      return true;
    } catch (err) {
      console.error("[messenger] save failed", err);
      toast(t("mg.save.failTitle"), t("mg.save.failBody"));
      return false;
    }
  }

  function writeVerified() {
    if (!write()) return false;
    dbFlush();
    var back = parseList(dbGet(KEY_V3));
    return !!back && back.length === convos.length;
  }

  function seed() {
    var now = Date.now();
    convos = SEED.map(function (c) {
      var copy = JSON.parse(JSON.stringify(c));
      copy.messages = copy.messages.map(function (m) {
        var msg = { id: uid(), from: m.from, text: m.text, ts: now - Math.round(m.tsOffsetHours * 3600000), edited: false, reaction: null };
        if (m.seen != null) msg.seen = m.seen;
        if (m.senderName) msg.senderName = m.senderName;
        return msg;
      });
      return copy;
    });
    write();
  }

  function load() {
    var v3 = parseList(dbGet(KEY_V3));
    if (v3) { convos = normalizeAll(v3); return; }

    var legacy = parseList(dbGet(KEY_V2));
    if (!legacy) legacy = parseList(dbGet(KEY_V1));
    if (legacy) {
      convos = normalizeAll(legacy);
      if (writeVerified()) {
        if (dbGet(KEY_V2) != null) dbRemove(KEY_V2);
        if (dbGet(KEY_V1) != null) dbRemove(KEY_V1);
      }
      return;
    }
    seed();
  }

  function ensureLoaded() { if (!convos) load(); }

  function byId(id) {
    ensureLoaded();
    var found = null;
    convos.forEach(function (c) { if (String(c.id) === String(id)) found = c; });
    return found;
  }

  function lastLine(c) {
    var messages = c.messages || [];
    if (!messages.length) return t("mg.noMessages");
    var last = messages[messages.length - 1];
    if (last.type === "file") return "📎 " + (last.fileName || "");
    return last.text || "";
  }

  /* --------------------------------------------------------------- markup */

  function avatarMarkup(c, size) {
    return '<span class="mg-avatar' + (size ? " " + size : "") + '" style="background:' + esc(c.color) + '">' +
      (c.isGroup ? GROUP_GLYPH : esc(c.initials)) + "</span>";
  }

  function convoRowMarkup(c) {
    return '<div class="mg-convo' + (String(c.id) === String(activeId) ? " active" : "") + (c.muted ? " muted" : "") + '" data-convo="' + esc(c.id) + '">' +
      '<span class="mg-avatar-wrap">' + avatarMarkup(c) + "</span>" +
      /* Имя собеседника и последняя реплика — данные посетителя. */
      '<span class="mg-convo-text" data-sb-userdata><span class="mg-convo-name">' + esc(c.name) + "</span>" +
        '<span class="mg-convo-last">' + esc(lastLine(c)) + "</span></span>" +
      (c.unread && !c.muted ? '<i class="mg-unread"></i>' : "") +
      '<span class="mg-convo-actions">' +
        '<button type="button" class="mg-mini" data-mute="' + esc(c.id) + '" title="' + esc(c.muted ? t("mg.unmute") : t("mg.mute")) + '" aria-label="' + esc(c.muted ? t("mg.unmute") : t("mg.mute")) + '">' +
          (c.muted
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4.5 9.5h3l4-3.2v11.4l-4-3.2h-3Z"/><path d="m15 9.5 4.5 5M19.5 9.5 15 14.5"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4.5 9.5h3l4-3.2v11.4l-4-3.2h-3Z"/><path d="M15.4 9.2a4 4 0 0 1 0 5.6"/></svg>') +
        "</button>" +
        '<button type="button" class="mg-mini danger" data-del-convo="' + esc(c.id) + '" title="' + esc(t("mg.delete")) + '" aria-label="' + esc(t("mg.deleteConvo")) + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4.5 7h15M9.5 7V5.2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7M6.5 7l1 12.2a1 1 0 0 0 1 .9h7a1 1 0 0 0 1-.9L17.5 7"/></svg>' +
        "</button>" +
      "</span>" +
    "</div>";
  }

  function newFormMarkup(win) {
    if (!win._msgrNewOpen) return "";
    var tab = win._msgrNewTab === "group" ? "group" : "direct";
    return '<div class="mg-newform">' +
      '<div class="mg-tabs">' +
        '<button type="button" class="mg-tab' + (tab === "direct" ? " active" : "") + '" data-tab="direct">' + esc(t("mg.tab.direct")) + "</button>" +
        '<button type="button" class="mg-tab' + (tab === "group" ? " active" : "") + '" data-tab="group">' + esc(t("mg.tab.group")) + "</button>" +
      "</div>" +
      (tab === "direct"
        ? '<input type="text" id="mgNewName" class="mg-input" maxlength="30" placeholder="' + esc(t("mg.ph.name")) + '" autocomplete="off">'
        : '<input type="text" id="mgNewGroup" class="mg-input" maxlength="40" placeholder="' + esc(t("mg.ph.groupName")) + '" autocomplete="off">' +
          '<input type="text" id="mgNewMembers" class="mg-input" maxlength="120" placeholder="' + esc(t("mg.ph.members")) + '" autocomplete="off">') +
      '<button type="button" class="mg-start" id="mgStart">' + esc(t("mg.start")) + "</button>" +
    "</div>";
  }

  function bubbleMarkup(c, m, isLastOwn) {
    if (m.from === "system") {
      return '<div class="mg-system" data-sb-userdata><span>' + esc(m.text || "") + "</span></div>";
    }
    var mine = m.from === "me";
    var inner;
    if (m.type === "file") {
      inner = '<button type="button" class="mg-file-chip" data-file="' + esc(m.id) + '">' + FILE_GLYPH +
        '<span data-sb-userdata>' + esc(m.fileName || "") + "</span></button>";
    } else {
      inner = '<div class="mg-text" data-sb-userdata>' + esc(m.text || "") + "</div>";
    }
    var seen = mine && isLastOwn && m.seen === true;
    return '<div class="mg-msg' + (mine ? " mine" : " theirs") + '" data-msg="' + esc(m.id) + '">' +
      (!mine && c.isGroup && m.senderName ? '<div class="mg-sender" data-sb-userdata>' + esc(m.senderName) + "</div>" : "") +
      '<div class="mg-bubble' + (m.type === "file" ? " file" : "") + '">' + inner +
        (m.reaction ? '<span class="mg-reaction">' + esc(m.reaction) + "</span>" : "") +
      "</div>" +
      '<div class="mg-meta">' +
        "<span>" + esc(clockOf(m.ts)) + (m.edited ? " · " + esc(t("mg.edited")) : "") + "</span>" +
        (seen ? "<span>· " + esc(t("mg.seen")) + "</span>" : "") +
        '<button type="button" class="mg-meta-btn" data-react="' + esc(m.id) + '" title="' + esc(t("mg.react")) + '" aria-label="' + esc(t("mg.react")) + '">🙂</button>' +
        '<button type="button" class="mg-meta-btn" data-del-msg="' + esc(m.id) + '" title="' + esc(t("mg.delMsg")) + '" aria-label="' + esc(t("mg.delMsg")) + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M4.5 7h15M9.5 7V5.2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7M6.5 7l1 12.2a1 1 0 0 0 1 .9h7a1 1 0 0 0 1-.9L17.5 7"/></svg>' +
        "</button>" +
      "</div>" +
    "</div>";
  }

  function threadMarkup(win, c) {
    if (!c) {
      return '<div class="mg-thread-empty"><div class="mg-glyph">' + ICON + "</div><p>" + esc(t("mg.selectConvo")) + "</p></div>";
    }
    var messages = c.messages || [];
    var lastOwnId = null;
    messages.forEach(function (m) { if (m.from === "me") lastOwnId = m.id; });

    var out = [], lastDay = null;
    messages.forEach(function (m) {
      var label = dayLabel(m.ts);
      if (label !== lastDay) { out.push('<div class="mg-day"><span>' + esc(label) + "</span></div>"); lastDay = label; }
      out.push(bubbleMarkup(c, m, m.id === lastOwnId));
    });

    var firstWord = String(c.name || "").trim().split(/\s+/)[0] || "";

    return '<header class="mg-head">' +
        '<span class="mg-avatar-wrap">' + avatarMarkup(c, "big") + "</span>" +
        '<span class="mg-head-text">' +
          '<button type="button" class="mg-head-name" id="mgContact" data-sb-userdata title="' + esc(t("mg.contactTitle")) + '">' + esc(c.name) + "</button>" +
          (c.isGroup && c.members.length
            ? '<span class="mg-head-members" data-sb-userdata>' + esc(c.members.join(", ")) + "</span>"
            : '<span class="mg-head-members">' + esc(t("mg.localNote")) + "</span>") +
        "</span>" +
        /* The one honest way out of a local room: turn the thread into a real
           letter. Whisper thinks, Letters speaks — that is the difference. */
        '<button type="button" class="mg-to-letter" id="mgToLetter" title="' + esc(t("mg.toLetterTitle")) + '">' + esc(t("mg.toLetter")) + "</button>" +
      "</header>" +
      '<div class="mg-messages" id="mgMessages">' + (out.length ? out.join("") : '<div class="mg-thread-empty"><p>' + esc(t("mg.noMessages")) + "</p></div>") + "</div>" +
      attachMarkup(win) +
      '<div class="mg-inputrow">' +
        '<button type="button" class="mg-attach-btn" id="mgAttach" title="' + esc(t("mg.attach", { files: appName("files") })) + '" aria-label="' + esc(t("mg.attach", { files: appName("files") })) + '">' + PAPERCLIP + "</button>" +
        '<input type="text" id="msgrInput" class="mg-input flat" placeholder="' + esc(t("mg.ph.message", { name: firstWord })) + '" autocomplete="off">' +
        '<button type="button" class="mg-send" id="mgSend" title="' + esc(t("mg.send")) + '" aria-label="' + esc(t("mg.send")) + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4 4 10.4l6.3 2.4L20 4Z"/><path d="M20 4 13.4 20l-3.1-7.2L20 4Z"/></svg>' +
        "</button>" +
      "</div>";
  }

  function attachMarkup(win) {
    if (!win._msgrAttachOpen) return "";
    var query = String(win._msgrAttachQuery || "");
    var files = [];
    if (typeof window.sbFilesAll === "function") {
      try { files = window.sbFilesAll() || []; } catch (err) { console.error("[messenger] file list failed", err); }
    }
    var needle = query.trim().toLowerCase();
    if (needle) files = files.filter(function (f) { return String(f.name).toLowerCase().indexOf(needle) !== -1; });
    files = files.slice(0, 30);

    return '<div class="mg-attach">' +
      '<input type="search" id="mgAttachSearch" class="mg-input" placeholder="' + esc(t("mg.attachSearch", { files: appName("files") })) + '" autocomplete="off" value="' + esc(query) + '">' +
      '<div class="mg-attach-list">' +
        (files.length
          ? files.map(function (f, idx) {
              return '<button type="button" class="mg-attach-item" data-attach="' + idx + '">' + FILE_GLYPH +
                '<span class="mg-attach-name">' + esc(f.name) + "</span>" +
                '<span class="mg-attach-path" data-sb-userdata>' + esc((f.path || []).slice(0, -1).join(" / ") || t("fv.home")) + "</span></button>";
            }).join("")
          : '<div class="mg-attach-empty">' + esc(t("mg.attachEmpty")) + "</div>") +
      "</div>" +
    "</div>";
  }

  function render(win) {
    var host = bodyOf(win);
    if (!host) return;
    ensureLoaded();
    if (typeof win._msgrFilter !== "string") win._msgrFilter = "";

    var needle = win._msgrFilter.trim().toLowerCase();
    var list = convos.filter(function (c) { return !needle || String(c.name).toLowerCase().indexOf(needle) !== -1; });
    var active = byId(activeId);

    /* Прокрутка человека переживает перерисовку — средство оболочки,
     общее для всех приложений (D-099). */
    var _sbKeep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
    host.innerHTML =
      '<div class="app-msgr">' +
        '<aside class="mg-side">' +
          '<div class="mg-side-top">' +
            '<input type="search" id="mgSearch" class="mg-input" placeholder="' + esc(t("mg.search")) + '" autocomplete="off" value="' + esc(win._msgrFilter) + '">' +
            '<button type="button" class="mg-newbtn" id="mgNew" title="' + esc(t("mg.new")) + '" aria-label="' + esc(t("mg.new")) + '">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 5.5v13M5.5 12h13"/></svg></button>' +
          "</div>" +
          newFormMarkup(win) +
          '<div class="mg-list">' +
            (list.length
              ? list.map(convoRowMarkup).join("")
              : '<div class="mg-list-empty">' + esc(needle ? t("mg.listEmptySearch", { q: win._msgrFilter.trim() }) : t("mg.listEmpty")) + "</div>") +
          "</div>" +
        "</aside>" +
        '<section class="mg-thread">' + threadMarkup(win, active) + "</section>" +
      "</div>";
    if (_sbKeep) _sbKeep();

    wire(win, host);
    scrollThread(host);
  }

  function scrollThread(host) {
    var messages = host.querySelector("#mgMessages");
    if (messages) messages.scrollTop = messages.scrollHeight;
  }

  /* --------------------------------------------------------------- wiring */

  function wire(win, host) {
    var search = host.querySelector("#mgSearch");
    if (search) {
      search.addEventListener("input", function () {
        var caret = search.selectionStart;
        win._msgrFilter = search.value;
        render(win);
        var again = bodyOf(win) && bodyOf(win).querySelector("#mgSearch");
        if (again) { again.focus(); if (caret != null) again.setSelectionRange(caret, caret); }
      });
    }

    var newBtn = host.querySelector("#mgNew");
    if (newBtn) {
      newBtn.addEventListener("click", function () {
        win._msgrNewOpen = !win._msgrNewOpen;
        if (!win._msgrNewTab) win._msgrNewTab = "direct";
        render(win);
      });
    }

    host.querySelectorAll("[data-tab]").forEach(function (btn) {
      btn.addEventListener("click", function () { win._msgrNewTab = btn.getAttribute("data-tab"); render(win); });
    });

    var start = host.querySelector("#mgStart");
    if (start) start.addEventListener("click", function () { startConversation(win, host); });
    ["#mgNewName", "#mgNewGroup", "#mgNewMembers"].forEach(function (sel) {
      var field = host.querySelector(sel);
      if (field) field.addEventListener("keydown", function (ev) { if (ev.key === "Enter") startConversation(win, host); });
    });
    var firstField = host.querySelector("#mgNewName") || host.querySelector("#mgNewGroup");
    if (firstField && win._msgrNewOpen && !win._msgrFormFocused) { firstField.focus(); win._msgrFormFocused = true; }
    if (!win._msgrNewOpen) win._msgrFormFocused = false;

    host.querySelectorAll("[data-convo]").forEach(function (row) {
      row.addEventListener("click", function (ev) {
        if (ev.target.closest && ev.target.closest(".mg-convo-actions")) return;
        selectConversation(win, row.getAttribute("data-convo"));
      });
    });

    host.querySelectorAll("[data-mute]").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        var c = byId(btn.getAttribute("data-mute"));
        if (!c) return;
        c.muted = !c.muted;
        write();
        render(win);
      });
    });

    host.querySelectorAll("[data-del-convo]").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        var c = byId(btn.getAttribute("data-del-convo"));
        if (!c) return;
        if (!window.confirm(t("mg.confirm.delConvo", { name: c.name }))) return;
        var wasActive = String(c.id) === String(activeId);
        convos = convos.filter(function (x) { return String(x.id) !== String(c.id); });
        if (wasActive) activeId = convos.length ? convos[0].id : null;
        write();
        render(win);
      });
    });

    var contact = host.querySelector("#mgContact");
    if (contact) {
      contact.addEventListener("click", function () {
        var c = byId(activeId);
        if (!c) return;
        if (typeof window.toggleApp === "function") {
          try { window.toggleApp("search"); } catch (err) { console.error("[messenger] toggleApp failed", err); }
        }
        var searchWin = typeof window.getOpenWindow === "function" ? window.getOpenWindow("search") : null;
        if (searchWin && typeof window.sbSearchOpenQuery === "function") {
          try { window.sbSearchOpenQuery(searchWin, c.name); } catch (err) { console.error("[messenger] search handoff failed", err); }
        }
      });
    }

    var input = host.querySelector("#msgrInput");
    var send = host.querySelector("#mgSend");
    if (input) input.addEventListener("keydown", function (ev) { if (ev.key === "Enter") { ev.preventDefault(); sendMessage(win, input.value); } });
    if (send && input) send.addEventListener("click", function () { sendMessage(win, input.value); });

    var toLetter = host.querySelector("#mgToLetter");
    if (toLetter) {
      toLetter.addEventListener("click", function () {
        var c = byId(activeId);
        if (!c || typeof window.sbMailComposeStudio !== "function") return;
        var lines = (c.messages || [])
          .filter(function (m) { return m.from !== "system" && m.type !== "file" && m.text; })
          .slice(-12)
          .map(function (m) { return (m.from === "me" ? t("mg.letter.me") : t("mg.letter.them")) + m.text; });
        /* Черновик письма пишется на языке окна: его будет читать и править
           сам посетитель, прежде чем нажать «отправить». */
        var body = t("mg.letter.head", { messenger: appName("messenger"), name: c.name }) + "\n\n" + lines.join("\n") + "\n\n---\n\n";
        try {
          window.sbMailComposeStudio({ subject: t("mg.letter.subject", { name: c.name }), body: body });
        } catch (err) { console.error("[messenger] letter bridge failed", err); }
      });
    }

    var attachBtn = host.querySelector("#mgAttach");
    if (attachBtn) {
      attachBtn.addEventListener("click", function () {
        win._msgrAttachOpen = !win._msgrAttachOpen;
        win._msgrAttachQuery = "";
        render(win);
      });
    }

    var attachSearch = host.querySelector("#mgAttachSearch");
    if (attachSearch) {
      attachSearch.addEventListener("input", function () {
        var caret = attachSearch.selectionStart;
        win._msgrAttachQuery = attachSearch.value;
        render(win);
        var again = bodyOf(win) && bodyOf(win).querySelector("#mgAttachSearch");
        if (again) { again.focus(); if (caret != null) again.setSelectionRange(caret, caret); }
      });
    }

    host.querySelectorAll("[data-attach]").forEach(function (btn) {
      btn.addEventListener("click", function () { attachFile(win, parseInt(btn.getAttribute("data-attach"), 10)); });
    });

    host.querySelectorAll("[data-file]").forEach(function (btn) {
      btn.addEventListener("click", function () { openFileChip(btn.getAttribute("data-file")); });
    });

    host.querySelectorAll("[data-react]").forEach(function (btn) {
      btn.addEventListener("click", function (ev) { ev.stopPropagation(); openReactionPicker(win, btn, btn.getAttribute("data-react")); });
    });

    host.querySelectorAll("[data-del-msg]").forEach(function (btn) {
      btn.addEventListener("click", function () { deleteMessage(win, btn.getAttribute("data-del-msg")); });
    });

    host.querySelectorAll(".mg-msg.mine .mg-bubble:not(.file)").forEach(function (bubble) {
      bubble.addEventListener("dblclick", function () {
        var wrap = bubble.closest(".mg-msg");
        if (wrap) beginEdit(win, wrap.getAttribute("data-msg"), bubble);
      });
    });
  }

  /* -------------------------------------------------------------- actions */

  function selectConversation(win, id) {
    var c = byId(id);
    if (!c) return;
    activeId = c.id;
    if (c.unread) { c.unread = false; write(); }
    win._msgrAttachOpen = false;
    render(win);
  }

  function startConversation(win, host) {
    var tab = win._msgrNewTab === "group" ? "group" : "direct";
    var name, members = [], isGroup = false;

    if (tab === "direct") {
      var nameField = host.querySelector("#mgNewName");
      name = nameField ? nameField.value.trim() : "";
      if (!name) return;
    } else {
      var groupField = host.querySelector("#mgNewGroup");
      var memberField = host.querySelector("#mgNewMembers");
      name = groupField ? groupField.value.trim() : "";
      members = (memberField ? memberField.value : "").split(",").map(function (s) { return s.trim(); }).filter(Boolean);
      if (!name || members.length < 2) return;
      isGroup = true;
    }

    var convo = {
      id: Date.now(),
      name: name,
      initials: initialsOf(name),
      color: colorFor(name),
      unread: false,
      muted: false,
      isGroup: isGroup,
      members: members,
      online: false,          /* presence is not invented — v21 honesty rule */
      messages: []
    };
    convos.unshift(convo);
    activeId = convo.id;
    win._msgrNewOpen = false;
    win._msgrNewTab = "direct";
    win._msgrFormFocused = false;
    write();
    render(win);
  }

  function sendMessage(win, text) {
    var c = byId(activeId);
    var value = String(text == null ? "" : text).trim();
    if (!c || !value) return;
    c.messages.push({ id: uid(), from: "me", text: value, ts: Date.now(), seen: false, edited: false, reaction: null });
    write();
    var input = bodyOf(win) && bodyOf(win).querySelector("#msgrInput");
    if (input) input.value = "";
    render(win);
    if (c.muted) return;

    /* v21: the fake "Seen" is gone. Nothing here reads your message, so
       nothing claims to have seen it — a read receipt on a timer was a
       presence simulator wearing politer clothes. What remains is the one
       honest system notice per conversation, and then silence. */
    var convoId = c.id;
    setTimeout(function () {
      var target = byId(convoId);
      if (!target) return;
      if (!target.noticeShown) {
        target.noticeShown = true;
        /* Заметка о том, что переписка — образец, пишется на языке того, кто
           её увидел первым, и дальше живёт как обычное сообщение. */
        target.messages.push({ id: uid(), from: "system", text: t("mg.sampleNotice"), ts: Date.now(), edited: false, reaction: null });
        write();
        var openWin = typeof window.getOpenWindow === "function" ? window.getOpenWindow("messenger") : null;
        if (openWin && String(activeId) === String(convoId)) render(openWin);
      }
    }, 1500);
  }

  function attachFile(win, index) {
    var c = byId(activeId);
    if (!c) return;
    var files = [];
    if (typeof window.sbFilesAll === "function") {
      try { files = window.sbFilesAll() || []; } catch (err) { console.error("[messenger] file list failed", err); }
    }
    var needle = String(win._msgrAttachQuery || "").trim().toLowerCase();
    if (needle) files = files.filter(function (f) { return String(f.name).toLowerCase().indexOf(needle) !== -1; });
    var file = files.slice(0, 30)[index];
    if (!file) return;

    c.messages.push({
      id: uid(), from: "me", type: "file", fileName: file.name, filePath: (file.path || []).slice(),
      ts: Date.now(), seen: false, edited: false, reaction: null
    });
    win._msgrAttachOpen = false;
    write();
    render(win);
  }

  function openFileChip(messageId) {
    var c = byId(activeId);
    if (!c) return;
    var msg = null;
    c.messages.forEach(function (m) { if (m.id === messageId) msg = m; });
    if (!msg) return;
    if (typeof window.toggleApp === "function") {
      try { window.toggleApp("files"); } catch (err) { console.error("[messenger] toggleApp failed", err); }
    }
    var filesWin = typeof window.getOpenWindow === "function" ? window.getOpenWindow("files") : null;
    if (filesWin && typeof window.sbFilesOpenResult === "function") {
      try { window.sbFilesOpenResult(filesWin, { path: msg.filePath || [], name: msg.fileName }); }
      catch (err) { console.error("[messenger] file jump failed", err); }
    }
  }

  function deleteMessage(win, messageId) {
    var c = byId(activeId);
    if (!c) return;
    c.messages = c.messages.filter(function (m) { return m.id !== messageId; });
    write();
    render(win);
  }

  function openReactionPicker(win, anchor, messageId) {
    var existing = document.querySelector(".mg-react-pop");
    if (existing) existing.remove();

    var pop = document.createElement("div");
    pop.className = "mg-react-pop";
    pop.innerHTML = REACTIONS.map(function (emoji) {
      return '<button type="button" data-emoji="' + esc(emoji) + '">' + esc(emoji) + "</button>";
    }).join("");
    document.body.appendChild(pop);

    var rect = anchor.getBoundingClientRect();
    pop.style.left = Math.max(8, rect.left - 60) + "px";
    pop.style.top = Math.max(8, rect.top - 42) + "px";

    function close() {
      if (pop.parentNode) pop.parentNode.removeChild(pop);
      document.removeEventListener("pointerdown", outside, true);
    }
    function outside(ev) { if (!pop.contains(ev.target)) close(); }

    pop.querySelectorAll("[data-emoji]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var c = byId(activeId);
        if (!c) { close(); return; }
        var emoji = btn.getAttribute("data-emoji");
        c.messages.forEach(function (m) {
          if (m.id !== messageId) return;
          m.reaction = m.reaction === emoji ? null : emoji;   // one reaction max, toggles off
        });
        write();
        close();
        render(win);
      });
    });
    setTimeout(function () { document.addEventListener("pointerdown", outside, true); }, 0);
  }

  function beginEdit(win, messageId, bubble) {
    var c = byId(activeId);
    if (!c) return;
    var msg = null;
    c.messages.forEach(function (m) { if (m.id === messageId) msg = m; });
    if (!msg || msg.type === "file" || msg.from !== "me") return;

    var area = document.createElement("textarea");
    area.className = "mg-edit-area";
    area.value = msg.text || "";
    bubble.innerHTML = "";
    bubble.appendChild(area);
    area.focus();
    area.setSelectionRange(area.value.length, area.value.length);

    var done = false;
    function commit() {
      if (done) return;
      done = true;
      var value = area.value.trim();
      if (value && value !== msg.text) {
        msg.text = value;
        msg.edited = true;
        write();
      }
      render(win);
    }
    function cancel() { if (done) return; done = true; render(win); }

    area.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" && !ev.shiftKey) { ev.preventDefault(); ev.stopPropagation(); commit(); }
      else if (ev.key === "Escape") { ev.preventDefault(); ev.stopPropagation(); cancel(); }
    });
    area.addEventListener("blur", commit);
  }

  /* ------------------------------------------------------------ providers */

  function shapeOf(c) { return { id: c.id, name: c.name, last: lastLine(c) }; }

  window.sbMessengerAll = function () {
    ensureLoaded();
    return convos.map(shapeOf);
  };

  window.sbMessengerSearch = function (q) {
    ensureLoaded();
    var needle = String(q == null ? "" : q).trim().toLowerCase();
    if (!needle) return [];
    return convos.filter(function (c) {
      if (String(c.name).toLowerCase().indexOf(needle) !== -1) return true;
      return (c.messages || []).some(function (m) {
        return String(m.text || "").toLowerCase().indexOf(needle) !== -1;
      });
    }).map(shapeOf);
  };

  window.sbMessengerOpenResult = function (win, result) {
    if (!win || !result || result.id == null) return false;
    var c = byId(result.id);
    if (!c) return false;
    activeId = c.id;
    if (c.unread) { c.unread = false; write(); }
    render(win);
    return true;
  };

  /* ------------------------------------------------------- registration */

  /* Перерисовка при смене языка — кроме случая, когда посетитель что-то
     набрал в строке сообщения или открыл форму новой переписки. */
  if (window.sbBus && typeof window.sbBus.on === "function") {
    window.sbBus.on("translate:done", function () {
      var win = typeof window.getOpenWindow === "function" ? window.getOpenWindow("messenger") : null;
      var host = win ? bodyOf(win) : null;
      if (!host) return;
      var input = host.querySelector("#msgrInput");
      if (win._msgrNewOpen || (input && input.value)) return;
      try { render(win); } catch (err) { console.error("[messenger] retranslate failed", err); }
    });
  }

  if (typeof window.registerApp === "function") {
    window.registerApp("messenger", {
      title: "Whisper",
      i18n: {
        ru: { title: "Разговор", label: "Разговор" },
        ee: { title: "Sosin", label: "Sosin" },
      },
      label: "Whisper",
      color: "linear-gradient(160deg,#8bf0a4 0%,#37cf68 46%,#12a047 100%)",
      icon: ICON,
      size: { w: 700, h: 520 },
      deskPos: { x: 140, y: 150 },
      render: render
    });
  }
})();
