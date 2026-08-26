/* sys.baby OS — Mail (brand "Letters").
 *
 * Spec: os-apps.md section 5.
 * Storage: sysbaby.mail.v2 (via sbDB) — {nextId:int, data:[message…]}
 * Legacy:  sysbaby.mail.v1 — same envelope, records may lack
 *          fromAddr/to/ts/starred/folder. The normalizer runs on EVERY load
 *          (not only on upgrade) so missing fields are always back-filled.
 *          After a verified v2 write the v1 key is removed.
 *
 * v21 — Letters grew a real door. A letter addressed to the studio
 * (build@sys.baby) is DELIVERED: posted through the same relay the landing
 * page's order form uses, into the same inbox a human actually reads.
 * The honesty contract, in both directions:
 *   - "Delivered" is claimed ONLY after the relay accepts the request.
 *     Refused or offline → the letter stays in Drafts and says so.
 *   - every other address stays local, and the interface says THAT too.
 * No simulated delivery, ever. The preferred-reply-channel the visitor picks
 * is stored as typed and rides along in the email for the operator to read.
 */
(function () {
  "use strict";

  var KEY_V2 = "sysbaby.mail.v2";
  var KEY_V1 = "sysbaby.mail.v1";
  var DOMAIN = "@sys.baby";
  var STUDIO_ADDR = "build@sys.baby";
  /* Same relay, same inbox, same acceptance rule as the landing page's order
     form — the channel that was proven end-to-end on 10 aug 2026. */
  var RELAY = "https://formsubmit.co/ajax/build@sys.baby";
  /* Значение канала (Email, Phone…) уезжает в письмо студии и обязано
     остаться английским — переводится только надпись в выпадающем списке,
     ключом ml.channel.<слаг>. Перевести значение значило бы прислать нам
     в почту слово, которого нет в наших правилах разбора. */
  var CHANNELS = ["Email", "Phone", "Telegram", "WhatsApp", "Signal", "URL", "Other"];
  function channelLabel(c) { return t("ml.channel." + String(c).toLowerCase()); }

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3.2" y="5.5" width="17.6" height="13" rx="2"/><path d="m3.8 7 8.2 5.6L20.2 7"/></svg>';

  /* Replay arrival schedule: message id -> minutes from 08:00. */
  var REPLAY_MINUTES = { 1: 55, 2: 130, 3: 0, 4: 330 };

  /* Строки живут в STRINGS ядра (core/topbar.js); здесь — только ключи. */
  function t(key, vars) { return typeof window.sbT === "function" ? window.sbT(key, vars) : key; }
  function appName(id) { return window.sbAppTitle ? window.sbAppTitle(id) : id; }

  /* ── СИСТЕМА ПРИХОДИТ ПУСТОЙ (D-142) ────────────────────────────────────
     ПОВОД, дословно от основателя 26.08.2026: «прошу полностью очистить
     содержимое приложений от всяких примеров и мусора. Система должна
     выглядеть чистой».
     Засеянные примеры были нужны, пока систему показывали. Теперь ею
     пользуются — и чужие письма, чужие папки и чужие разговоры в своей
     системе выглядят ровно тем, чем являются: мусором. Приложение, которому
     нечего показать, теперь ГОВОРИТ с человеком (D-140), а не притворяется
     занятым. */
  var SEED = { nextId: 1, data: [] };


  var FOLDERS = [
    { id: "inbox", labelKey: "ml.folder.inbox", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 13.5 6.2 6.2A1.4 1.4 0 0 1 7.5 5.2h9a1.4 1.4 0 0 1 1.3 1L20 13.5v4.3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4.3Z"/><path d="M4 13.5h4l1.2 2.2h5.6l1.2-2.2h4"/></svg>' },
    { id: "starred", labelKey: "ml.folder.starred", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m12 4.8 2.3 4.7 5.2.8-3.8 3.6.9 5.1-4.6-2.4-4.6 2.4.9-5.1L4.5 10.3l5.2-.8L12 4.8Z"/></svg>' },
    { id: "sent", labelKey: "ml.folder.sent", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4 4 10.4l6.3 2.4L20 4Z"/><path d="M20 4 13.4 20l-3.1-7.2L20 4Z"/></svg>' },
    { id: "drafts", labelKey: "ml.folder.drafts", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5.2h9.5L19 9.6V19a.9.9 0 0 1-.9.9H5a.9.9 0 0 1-.9-.9V6.1A.9.9 0 0 1 5 5.2Z"/><path d="M14.5 5.2v4.4H19"/></svg>' },
    { id: "trash", labelKey: "ml.folder.trash", icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M4.5 7h15M9.5 7V5.2a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1V7M6.5 7l1 12.2a1 1 0 0 0 1 .9h7a1 1 0 0 0 1-.9L17.5 7"/></svg>' }
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
    } catch (err) { console.error("[mail] read failed", err); return null; }
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
    } catch (err) { console.error("[mail] remove failed", err); }
  }

  function dbFlush() {
    try { if (window.sbDB && typeof window.sbDB.flushSync === "function") window.sbDB.flushSync(); }
    catch (err) { console.error("[mail] flush failed", err); }
  }

  function toast(title, text) {
    if (typeof window.showToast !== "function") return;
    try { window.showToast(title, text, ICON); } catch (err) { console.error("[mail] toast failed", err); }
  }

  function bodyOf(win) { return win && win.el ? win.el.querySelector(".window-body") : null; }

  function username() {
    if (typeof window.sbGetUsername === "function") {
      try { return window.sbGetUsername() || "guest"; } catch (err) { console.error("[mail] username failed", err); }
    }
    return "guest";
  }

  function myAddress() { return username() + DOMAIN; }

  function normalizeAddress(value) {
    var v = String(value == null ? "" : value).trim();
    if (!v) return "";
    return v.indexOf("@") !== -1 ? v : v + DOMAIN;
  }

  function slugify(value) {
    var v = String(value == null ? "" : value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    return v || "unknown";
  }

  var DATE_LOCALE = { en: "en-GB", ru: "ru-RU", ee: "et-EE" };
  function timeAgo(ts) {
    ts = Number(ts) || 0;
    var diff = Date.now() - ts;
    if (diff >= 7 * 86400000) {
      /* Дата старше недели пишется по правилам языка, а не по британским:
         «10 aug» в русском окне читается как чужая строка. */
      try { return new Date(ts).toLocaleDateString(DATE_LOCALE[window.sbLang ? window.sbLang() : "en"] || "en-GB", { day: "numeric", month: "short" }); }
      catch (err) { return new Date(ts).toDateString(); }
    }
    if (diff < 60000) return t("ml.time.now");
    var m = Math.floor(diff / 60000);
    if (m < 60) return t("ml.time.m", { n: m });
    var h = Math.floor(m / 60);
    if (h < 24) return t("ml.time.h", { n: h });
    return t("ml.time.d", { n: Math.floor(h / 24) });
  }

  /* -------------------------------------------------------- data & schema */

  var state = null;
  var selectedId = null;

  /* Fills only missing fields — existing values always win. */
  function normalizeRecord(m) {
    if (!m || typeof m !== "object") return m;
    if (m.folder == null) m.folder = "inbox";
    if (m.fromAddr == null) {
      var from = String(m.from == null ? "" : m.from);
      m.fromAddr = from.toLowerCase().indexOf("sys.baby") !== -1 ? from : slugify(from) + DOMAIN;
    }
    if (m.to == null) {
      /* v1 sent items stored the recipient in `from`. */
      m.to = m.folder === "sent" ? normalizeAddress(m.from) : "you";
    }
    if (m.ts == null) m.ts = Date.now();
    m.starred = !!m.starred;
    return m;
  }

  function normalizeAll(envelope) {
    var data = Array.isArray(envelope && envelope.data) ? envelope.data : [];
    data.forEach(normalizeRecord);
    var maxId = 0;
    data.forEach(function (m) { if (Number(m.id) > maxId) maxId = Number(m.id); });
    var nextId = Number(envelope && envelope.nextId);
    if (!nextId || nextId <= maxId) nextId = maxId + 1;
    return { nextId: nextId, data: data };
  }

  function parseEnvelope(raw) {
    if (typeof raw !== "string" || raw === "") return null;
    try {
      var value = JSON.parse(raw);
      if (value && Array.isArray(value.data)) return value;
    } catch (err) { console.error("[mail] corrupt mailbox JSON", err); }
    return null;
  }

  function write() {
    try {
      dbSet(KEY_V2, JSON.stringify(state));
      return true;
    } catch (err) {
      console.error("[mail] save failed", err);
      toast(t("ml.save.failTitle"), t("ml.save.failBody"));
      return false;
    }
  }

  function writeVerified() {
    if (!write()) return false;
    dbFlush();
    var back = parseEnvelope(dbGet(KEY_V2));
    return !!back && back.data.length === state.data.length;
  }

  function seed() {
    var now = Date.now();
    state = {
      nextId: SEED.nextId,
      data: SEED.data.map(function (m) {
        var copy = JSON.parse(JSON.stringify(m));
        copy.ts = now - Math.round(copy.tsOffsetDays * 86400000);
        delete copy.tsOffsetDays;
        return copy;
      })
    };
    write();
    dbSet(STUDIO_GUARD, "1");
  }

  function load() {
    var v2 = parseEnvelope(dbGet(KEY_V2));
    if (v2) { state = normalizeAll(v2); topUpStudioLetter(); return; }

    var v1 = parseEnvelope(dbGet(KEY_V1));
    if (v1) {
      state = normalizeAll(v1);
      if (writeVerified()) dbRemove(KEY_V1);   // predecessor dropped only after a verified write
      topUpStudioLetter();
      return;
    }
    seed();
  }

  /* Mailboxes stored before v21 predate the studio letter (seed id 5).
     It is announced once into them — guarded, so deleting it is final.
     A fresh seed stamps the same guard: one state, however you arrived. */
  var STUDIO_GUARD = "sysbaby.mail.studio-letter.v1";
  function topUpStudioLetter() {
    var GUARD = STUDIO_GUARD;
    try {
      if (dbGet(GUARD) === "1") return;
      var has = state.data.some(function (m) { return m && m.fromAddr === STUDIO_ADDR && !m.delivery; });
      if (!has) {
        var tpl = null;
        SEED.data.forEach(function (m) { if (m.id === 5) tpl = m; });
        if (tpl) {
          var copy = JSON.parse(JSON.stringify(tpl));
          copy.id = state.nextId++;
          copy.ts = Date.now() - Math.round(copy.tsOffsetDays * 86400000);
          delete copy.tsOffsetDays;
          state.data.push(copy);
          write();
          pushBadge();
        }
      }
      dbSet(GUARD, "1");
    } catch (err) { console.error("[mail] studio letter top-up failed", err); }
  }

  function ensureLoaded() { if (!state) load(); }

  function messageById(id) {
    ensureLoaded();
    var found = null;
    state.data.forEach(function (m) { if (m.id === id) found = m; });
    return found;
  }

  function unreadInbox() {
    ensureLoaded();
    return state.data.filter(function (m) { return m.folder === "inbox" && m.unread; }).length;
  }

  function pushBadge() {
    if (typeof window.setMailBadge === "function") {
      try { window.setMailBadge(unreadInbox()); } catch (err) { console.error("[mail] badge failed", err); }
    }
  }

  /* ------------------------------------------------------- replay filter */

  function replayVisible(m) {
    if (typeof window.sbReplayCutoff !== "function") return true;
    var cutoff;
    try { cutoff = window.sbReplayCutoff(); } catch (err) { console.error("[mail] replay cutoff failed", err); return true; }
    if (cutoff == null) return true;
    var scheduled = REPLAY_MINUTES[m.id];
    if (scheduled === undefined) return true;   // user-created mail always shows
    return scheduled <= cutoff;
  }

  /* -------------------------------------------------------------- queries */

  function inFolder(folder) {
    ensureLoaded();
    return state.data.filter(function (m) {
      if (!replayVisible(m)) return false;
      if (folder === "starred") return m.starred && m.folder !== "trash";
      return m.folder === folder;
    });
  }

  function matches(m, needle) {
    return [m.from, m.to, m.subject, m.snippet, m.body].join(" ").toLowerCase().indexOf(needle) !== -1;
  }

  function visibleList(win) {
    var list = inFolder(win._mailFolder);
    var needle = String(win._mailSearch || "").trim().toLowerCase();
    if (needle) list = list.filter(function (m) { return matches(m, needle); });
    return list.slice().sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
  }

  /* --------------------------------------------------------------- markup */

  function starMarkup(m) {
    return '<button type="button" class="ml-star' + (m.starred ? " on" : "") + '" data-star="' + m.id + '" title="' + esc(m.starred ? t("ml.unstar") : t("ml.star")) + '" aria-label="' + esc(t("ml.star")) + '">' +
      '<svg viewBox="0 0 24 24" fill="' + (m.starred ? "currentColor" : "none") + '" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="m12 4.8 2.3 4.7 5.2.8-3.8 3.6.9 5.1-4.6-2.4-4.6 2.4.9-5.1L4.5 10.3l5.2-.8L12 4.8Z"/></svg></button>';
  }

  function deliveryTag(m, folder) {
    if (folder === "sent" && m.delivery) {
      if (m.delivery.state === "delivered") return '<span class="ml-tag delivered">' + esc(t("ml.tag.delivered")) + "</span>";
      if (m.delivery.state === "local") return '<span class="ml-tag local">' + esc(t("ml.tag.local")) + "</span>";
    }
    if (folder === "drafts" && m.composeMode === "studio") return '<span class="ml-tag studio">' + esc(t("ml.tag.studio")) + "</span>";
    return "";
  }

  function rowMarkup(m, folder) {
    var who = folder === "sent" ? m.to : m.from;
    return '<div class="ml-row' + (m.unread ? " unread" : "") + (m.id === selectedId ? " active" : "") + '" data-id="' + m.id + '">' +
      starMarkup(m) +
      '<div class="ml-row-main">' +
        '<div class="ml-row-top">' +
          '<span class="ml-row-who"><span data-sb-userdata>' + (m.unread ? '<i class="ml-dot"></i>' : "") + esc(who || "") + "</span>" +
            (folder === "drafts" ? '<span class="ml-draft-tag">' + esc(t("ml.tag.draft")) + "</span>" : "") + deliveryTag(m, folder) + "</span>" +
          '<span class="ml-row-time">' + esc(timeAgo(m.ts)) + "</span>" +
        "</div>" +
        '<div class="ml-row-subject" data-sb-userdata>' + esc(m.subject || t("ml.noSubject")) + "</div>" +
        '<div class="ml-row-snippet" data-sb-userdata>' + esc(m.snippet || "") + "</div>" +
      "</div>" +
    "</div>";
  }

  function emptyMarkup(win) {
    var needle = String(win._mailSearch || "").trim();
    var text = needle ? esc(t("ml.empty.search", { q: needle })) : esc(t("ml.empty." + win._mailFolder));
    return '<div class="ml-empty"><div class="ml-empty-glyph">' + ICON + "</div><p>" + text + "</p></div>";
  }

  function linksFor(id) {
    if (typeof window.sbLinksFor !== "function") return [];
    try { return window.sbLinksFor(id) || []; } catch (err) { console.error("[mail] links lookup failed", err); return []; }
  }

  function linkKindLabel(kind) {
    var kinds = window.sbLinkKinds;
    var def = kinds && kinds[kind];
    if (def && def.labelKey) return t(def.labelKey);
    if (def && def.label) return def.label;
    return String(kind || "");
  }

  function connectedMarkup(id) {
    var links = linksFor(id);
    if (!links.length) return "";
    var msg = messageById(id);
    var isStudio = !!(msg && msg.fromAddr === STUDIO_ADDR);
    var note = isStudio
      ? esc(t("ml.connected.real"))
      : esc(t("ml.connected.sample"));
    var rows = links.map(function (link, idx) {
      var live = false;
      if (typeof link.live === "function") {
        try { live = !!link.live(); } catch (err) { console.error("[mail] link live() failed", err); }
      }
      return '<button type="button" class="ml-link' + (live ? " live" : "") + '" data-link="' + idx + '">' +
        '<span class="ml-link-kind">' + esc(linkKindLabel(link.kind)) + "</span>" +
        '<span class="ml-link-text"><span class="ml-link-title">' + esc(link.title || "") + "</span>" +
          '<span class="ml-link-sub">' + esc(live ? t("ml.link.openNow") : (link.sub || "")) + "</span></span>" +
        '<span class="ml-link-mark">' + (live ? '<i class="ml-live-dot"></i>' : "→") + "</span>" +
      "</button>";
    }).join("");
    return '<div class="ml-connected"><div class="ml-connected-head">' + esc(t("ml.connected")) + "</div>" +
      '<p class="ml-connected-note">' + note + "</p>" +
      '<div class="ml-links">' + rows + "</div></div>";
  }

  function readingMarkup(win) {
    var m = messageById(selectedId);
    var list = visibleList(win);
    var inView = m && list.some(function (x) { return x.id === m.id; });
    if (!m || !inView) return '<div class="ml-read-empty"><p>' + esc(t("ml.selectMessage")) + "</p></div>";

    var isSent = m.folder === "sent";
    var contact = isSent ? (m.to || "") : (m.from || "");
    var contactLink = contact && contact !== "You"
      ? '<button type="button" class="ml-contact" data-sb-userdata data-contact="' + esc(contact) + '" title="' + esc(t("ml.contactTitle")) + '">' + esc(contact) + "</button>"
      : esc(contact);

    var meta = isSent
      ? esc(t("ml.meta.to")) + " " + contactLink
      : esc(t("ml.meta.from")) + " " + contactLink + ' <span data-sb-userdata>&lt;' + esc(m.fromAddr || "") + "&gt;</span>";

    var actions;
    if (m.folder === "trash") {
      actions = starMarkup(m) +
        '<button type="button" class="ml-btn" id="mlRestore">' + esc(t("ml.act.restore")) + "</button>" +
        '<button type="button" class="ml-btn danger" id="mlPurge">' + esc(t("ml.act.purge")) + "</button>";
    } else if (m.folder === "drafts") {
      actions = '<button type="button" class="ml-btn primary" id="mlContinue">' + esc(t("ml.act.continue")) + "</button>" +
        starMarkup(m) +
        '<button type="button" class="ml-btn" id="mlDelete">' + esc(t("ml.act.delete")) + "</button>";
    } else {
      actions = '<button type="button" class="ml-btn" id="mlReply">' + esc(t("ml.act.reply")) + "</button>" +
        '<button type="button" class="ml-btn" id="mlForward">' + esc(t("ml.act.forward")) + "</button>" +
        '<button type="button" class="ml-btn" id="mlToNote" title="' + esc(t("ml.act.toNoteTitle", { notes: appName("notes") })) + '">' +
          esc(t("ml.act.toNote", { notes: appName("notes") })) + "</button>" +
        starMarkup(m) +
        '<button type="button" class="ml-btn" id="mlDelete">' + esc(t("ml.act.delete")) + "</button>";
    }

    /* A delivered letter carries its receipt; a local one carries its truth. */
    var deliveryLine = "";
    if (m.folder === "sent" && m.delivery) {
      if (m.delivery.state === "delivered") {
        var chan = m.channel ? channelLabel(m.channel) + (m.contact ? " · " + m.contact : "") : "";
        deliveryLine = '<div class="ml-delivery ok">' + esc(m.channel
          ? t("ml.delivery.okReply", { addr: STUDIO_ADDR, when: timeAgo(m.delivery.at), channel: chan })
          : t("ml.delivery.ok", { addr: STUDIO_ADDR, when: timeAgo(m.delivery.at) })) + "</div>";
      } else if (m.delivery.state === "local") {
        deliveryLine = '<div class="ml-delivery quiet">' + esc(t("ml.delivery.local")) + "</div>";
      }
    }

    return '<div class="ml-read">' +
      '<h2 class="ml-read-subject" data-sb-userdata>' + esc(m.subject || t("ml.noSubject")) + "</h2>" +
      '<div class="ml-read-meta">' + meta + ' <span class="ml-sep">·</span> ' + esc(timeAgo(m.ts)) + "</div>" +
      deliveryLine +
      '<div class="ml-read-actions">' + actions + "</div>" +
      /* Тело письма — данные посетителя: сюда перевод не заходит. */
      '<div class="ml-read-body" data-sb-userdata>' + esc(m.body || "") + "</div>" +
      connectedMarkup(m.id) +
    "</div>";
  }

  function composeMarkup(win) {
    var d = win._mailCompose;
    if (!d) return "";
    var studio = d.mode === "studio";
    var channel = d.channel || "Email";
    var channelOptions = CHANNELS.map(function (c) {
      return '<option value="' + esc(c) + '"' + (c === channel ? " selected" : "") + ">" + esc(channelLabel(c)) + "</option>";
    }).join("");

    return '<div class="ml-compose">' +
      '<div class="ml-compose-head"><span id="mlComposeFrom">' + esc(t("ml.compose.from", { addr: myAddress() })) + "</span>" +
        '<button type="button" class="ml-compose-x" id="mlComposeClose" title="' + esc(t("ml.compose.close")) + '" aria-label="' + esc(t("ml.compose.close")) + '">×</button></div>' +
      /* Two kinds of letter, and the interface never lets them blur:
         one truly leaves, one truly stays. */
      '<div class="ml-mode">' +
        '<button type="button" class="ml-mode-btn' + (studio ? " active" : "") + '" data-compose-mode="studio">' + esc(t("ml.compose.studio")) + "</button>" +
        '<button type="button" class="ml-mode-btn' + (!studio ? " active" : "") + '" data-compose-mode="local">' + esc(t("ml.compose.local")) + "</button>" +
        '<span class="ml-mode-note">' + esc(studio ? t("ml.compose.studioNote") : t("ml.compose.localNote")) + "</span>" +
      "</div>" +
      (studio
        ? '<div class="ml-field ml-to-fixed">' + esc(t("ml.meta.to")) + " <b>" + esc(STUDIO_ADDR) + "</b><span> · " + esc(t("ml.compose.realDelivery")) + "</span></div>"
        : '<input type="text" id="composeTo" class="ml-field" placeholder="' + esc(t("ml.compose.toPlaceholder")) + '" value="' + esc(d.to || "") + '" autocomplete="off">') +
      '<input type="text" id="composeSubject" class="ml-field" placeholder="' + esc(t("ml.compose.subject")) + '" value="' + esc(d.subject || "") + '" autocomplete="off">' +
      /* The leading newline is compensation: HTML parsing eats exactly one
       * newline directly after <textarea>, which would otherwise silently drop
       * the blank first line every reply/forward body starts with. */
      '<textarea id="composeBody" class="ml-field ml-body" placeholder="' + esc(studio ? t("ml.compose.bodyStudio") : t("ml.compose.bodyLocal")) + '">\n' + esc(d.body || "") + "</textarea>" +
      (studio
        ? '<div class="ml-reply-row">' +
            '<label class="ml-reply-label">' + esc(t("ml.compose.howAnswer")) + "</label>" +
            '<select id="composeChannel" class="ml-field ml-channel">' + channelOptions + "</select>" +
            '<input type="text" id="composeContact" class="ml-field ml-contact" placeholder="' + esc(channelPlaceholder(channel)) + '" value="' + esc(d.contact || "") + '" autocomplete="off">' +
          "</div>"
        : "") +
      '<p class="ml-compose-status" id="mlComposeStatus" role="status"></p>' +
      '<div class="ml-compose-foot">' +
        '<span class="ml-honest">' + esc(studio ? t("ml.compose.honestStudio") : t("ml.compose.honestLocal")) + "</span>" +
        '<button type="button" class="ml-btn primary" id="mlSend">' + esc(studio ? t("ml.compose.sendStudio") : t("ml.compose.sendLocal")) + "</button>" +
      "</div>" +
    "</div>";
  }

  function channelPlaceholder(channel) {
    switch (channel) {
      case "Email": return t("ml.ph.email");
      case "Phone": return t("ml.ph.phone");
      case "Telegram": return t("ml.ph.telegram");
      case "WhatsApp": return t("ml.ph.whatsapp");
      case "Signal": return t("ml.ph.signal");
      case "URL": return t("ml.ph.url");
      default: return t("ml.ph.other");
    }
  }

  function render(win) {
    var host = bodyOf(win);
    if (!host) return;
    ensureLoaded();
    if (!win._mailFolder) win._mailFolder = "inbox";
    if (typeof win._mailSearch !== "string") win._mailSearch = "";

    var draftCount = inFolder("drafts").length;
    var unread = unreadInbox();
    var list = visibleList(win);

    /* Прокрутка человека переживает перерисовку — средство оболочки,
     общее для всех приложений (D-099). */
    var _sbKeep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
    host.innerHTML =
      '<div class="app-mail">' +
        '<aside class="ml-folders">' +
          FOLDERS.map(function (f) {
            var badge = "";
            if (f.id === "inbox" && unread) badge = '<span class="ml-badge">' + unread + "</span>";
            if (f.id === "drafts" && draftCount) badge = '<span class="ml-badge quiet">' + draftCount + "</span>";
            return '<button type="button" class="ml-folder' + (win._mailFolder === f.id ? " active" : "") + '" data-folder="' + f.id + '">' +
              '<span class="ml-folder-icon">' + f.icon + "</span><span>" + esc(t(f.labelKey)) + "</span>" + badge + "</button>";
          }).join("") +
        "</aside>" +
        '<div class="ml-mid">' +
          '<div class="ml-toolbar">' +
            '<button type="button" class="ml-btn primary" id="mailCompose">' + esc(t("ml.toolbar.compose")) + "</button>" +
            '<button type="button" class="ml-btn studio" id="mailComposeStudio" title="' + esc(t("ml.toolbar.studioTitle")) + '">' + esc(t("ml.toolbar.studio")) + "</button>" +
            '<input type="search" class="ml-search" id="mlSearch" placeholder="' + esc(t("ml.toolbar.search")) + '" autocomplete="off" value="' + esc(win._mailSearch) + '">' +
          "</div>" +
          '<div class="ml-list" id="mlList">' +
            (list.length ? list.map(function (m) { return rowMarkup(m, win._mailFolder); }).join("") : emptyMarkup(win)) +
          "</div>" +
        "</div>" +
        '<section class="ml-pane">' + readingMarkup(win) + "</section>" +
        composeMarkup(win) +
      "</div>";
    if (_sbKeep) _sbKeep();

    wire(win, host);
  }

  /* --------------------------------------------------------------- wiring */

  function wire(win, host) {
    host.querySelectorAll("[data-folder]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        win._mailFolder = btn.getAttribute("data-folder");
        win._mailSearch = "";
        selectedId = null;
        render(win);
      });
    });

    var search = host.querySelector("#mlSearch");
    if (search) {
      search.addEventListener("input", function () {
        var caret = search.selectionStart;
        win._mailSearch = search.value;
        render(win);
        var again = bodyOf(win) && bodyOf(win).querySelector("#mlSearch");
        if (again) {
          again.focus();
          if (caret != null) again.setSelectionRange(caret, caret);
        }
      });
    }

    host.querySelectorAll(".ml-row").forEach(function (row) {
      row.addEventListener("click", function (ev) {
        if (ev.target.closest && ev.target.closest("[data-star]")) return;
        openMessage(win, parseInt(row.getAttribute("data-id"), 10));
      });
    });

    host.querySelectorAll("[data-star]").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        var m = messageById(parseInt(btn.getAttribute("data-star"), 10));
        if (!m) return;
        m.starred = !m.starred;
        write();
        render(win);
      });
    });

    var compose = host.querySelector("#mailCompose");
    if (compose) compose.addEventListener("click", function () { openCompose(win, {}); });

    var composeStudio = host.querySelector("#mailComposeStudio");
    if (composeStudio) composeStudio.addEventListener("click", function () { openCompose(win, { mode: "studio" }); });

    bindReading(win, host);
    bindCompose(win, host);
  }

  function bindReading(win, host) {
    var m = messageById(selectedId);

    var contact = host.querySelector(".ml-contact");
    if (contact) {
      contact.addEventListener("click", function () {
        var query = contact.getAttribute("data-contact") || "";
        if (typeof window.toggleApp === "function") {
          try { window.toggleApp("search"); } catch (err) { console.error("[mail] toggleApp failed", err); }
        }
        var searchWin = typeof window.getOpenWindow === "function" ? window.getOpenWindow("search") : null;
        if (searchWin && typeof window.sbSearchOpenQuery === "function") {
          try { window.sbSearchOpenQuery(searchWin, query); } catch (err) { console.error("[mail] search handoff failed", err); }
        }
      });
    }

    var reply = host.querySelector("#mlReply");
    if (reply && m) {
      reply.addEventListener("click", function () {
        openCompose(win, {
          /* Replying to the studio's letter opens the real channel, primed. */
          mode: m.fromAddr === STUDIO_ADDR ? "studio" : "local",
          to: m.fromAddr || "",
          subject: /^Re:/i.test(m.subject || "") ? m.subject : "Re: " + (m.subject || ""),
          body: m.fromAddr === STUDIO_ADDR ? "" : "\n\n— On " + timeAgo(m.ts) + ", " + (m.from || "") + " wrote —\n" + (m.body || "")
        });
      });
    }

    var toNote = host.querySelector("#mlToNote");
    if (toNote && m) {
      toNote.addEventListener("click", function () {
        if (typeof window.sbAddQuickNote !== "function") return;
        var noteText = (m.subject ? m.subject + "\n\n" : "") + (m.body || "") +
          "\n\n— from Letters · " + (m.from || m.to || "") + " · " + timeAgo(m.ts);
        try { window.sbAddQuickNote(noteText); } catch (err) { console.error("[mail] to-note failed", err); return; }
        toast(t("ml.toast.savedNoteTitle", { notes: appName("notes") }), t("ml.toast.savedNoteBody"));
      });
    }

    var forward = host.querySelector("#mlForward");
    if (forward && m) {
      forward.addEventListener("click", function () {
        openCompose(win, {
          to: "",
          subject: /^Fwd:/i.test(m.subject || "") ? m.subject : "Fwd: " + (m.subject || ""),
          body: "\n\n— Forwarded message —\nFrom: " + (m.from || "") + " " + (m.fromAddr || "") + "\n" + (m.body || "")
        });
      });
    }

    var del = host.querySelector("#mlDelete");
    if (del && m) {
      del.addEventListener("click", function () {
        m.folder = "trash";
        selectedId = null;
        write();
        pushBadge();
        render(win);
        toast(t("ml.toast.mailTitle"), t("ml.toast.trash"));
      });
    }

    var restore = host.querySelector("#mlRestore");
    if (restore && m) {
      restore.addEventListener("click", function () {
        m.folder = m.to === "you" ? "inbox" : "sent";
        selectedId = null;
        write();
        pushBadge();
        render(win);
      });
    }

    var purge = host.querySelector("#mlPurge");
    if (purge && m) {
      purge.addEventListener("click", function () {
        if (!window.confirm(t("ml.confirm.purge", { subject: m.subject || t("ml.thisMessage") }))) return;
        state.data = state.data.filter(function (x) { return x.id !== m.id; });
        selectedId = null;
        write();
        pushBadge();
        render(win);
      });
    }

    var cont = host.querySelector("#mlContinue");
    if (cont && m) {
      cont.addEventListener("click", function () {
        openCompose(win, {
          mode: m.composeMode === "studio" ? "studio" : "local",
          to: m.to || "", subject: m.subject || "", body: m.body || "",
          channel: m.channel || "Email", contact: m.contact || "",
          draftId: m.id
        });
      });
    }

    bindLinks(host);
  }

  function bindLinks(host) {
    host.querySelectorAll("[data-link]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var idx = parseInt(btn.getAttribute("data-link"), 10);
        var fresh = linksFor(selectedId);   // re-resolve, never a stale closure
        var link = fresh[idx];
        if (!link || typeof link.open !== "function") return;
        try { link.open(); } catch (err) { console.error("[mail] link open failed", err); }
      });
    });
  }

  function openMessage(win, id) {
    var m = messageById(id);
    if (!m) return;
    selectedId = id;
    if (m.unread) {
      m.unread = false;
      write();
      pushBadge();
    }
    render(win);
  }

  /* -------------------------------------------------------------- compose */

  function openCompose(win, prefill) {
    win._mailCompose = {
      mode: prefill.mode === "studio" || normalizeAddress(prefill.to || "") === STUDIO_ADDR ? "studio" : "local",
      to: prefill.to || "",
      subject: prefill.subject || "",
      body: prefill.body || "",
      channel: prefill.channel || "Email",
      contact: prefill.contact || "",
      draftId: prefill.draftId != null ? prefill.draftId : null
    };
    render(win);
    var host = bodyOf(win);
    var first = host && (host.querySelector("#composeTo") || host.querySelector("#composeSubject"));
    if (first) first.focus();
  }

  /* Cross-app door: Whisper (and anything else) can hand a visitor over to a
     real studio letter with context already in place. */
  window.sbMailComposeStudio = function (prefill) {
    if (typeof window.toggleApp === "function") {
      try { if (!window.getOpenWindow || !window.getOpenWindow("mail")) window.toggleApp("mail"); } catch (err) { console.error("[mail] open failed", err); }
    }
    var win = typeof window.getOpenWindow === "function" ? window.getOpenWindow("mail") : null;
    if (!win) return false;
    var p = prefill || {};
    p.mode = "studio";
    openCompose(win, p);
    if (typeof window.focusWindow === "function") { try { window.focusWindow("mail"); } catch (err) { /* ignore */ } }
    return true;
  };

  function readCompose(win, host) {
    var d = win._mailCompose || {};
    return {
      mode: d.mode === "studio" ? "studio" : "local",
      to: d.mode === "studio" ? STUDIO_ADDR : ((host.querySelector("#composeTo") || {}).value || ""),
      subject: (host.querySelector("#composeSubject") || {}).value || "",
      body: (host.querySelector("#composeBody") || {}).value || "",
      channel: (host.querySelector("#composeChannel") || {}).value || d.channel || "Email",
      contact: (host.querySelector("#composeContact") || {}).value || ""
    };
  }

  /* Same acceptance rule as the landing page's two formsubmit calls:
     delivered only if the response is OK and the body does not say
     success:false. Copied, not reinvented — one truth about one relay. */
  function acceptResponse(response, bodyText) {
    if (!response.ok) return false;
    if (!bodyText) return true;
    var data;
    try { data = JSON.parse(bodyText); } catch (err) { return true; }
    if (data && (data.success === false || data.success === "false")) return false;
    return true;
  }

  function saveDraftRecord(win, fields, draftId) {
    var existing = draftId != null ? messageById(draftId) : null;
    if (existing) {
      existing.to = fields.to;
      existing.subject = fields.subject;
      existing.body = fields.body;
      existing.snippet = fields.body.slice(0, 60);
      existing.composeMode = fields.mode;
      existing.channel = fields.channel;
      existing.contact = fields.contact;
      existing.ts = Date.now();
      write();
      return existing.id;
    }
    var id = state.nextId++;
    state.data.push({
      id: id,
      from: "",
      fromAddr: myAddress(),
      to: fields.to,
      subject: fields.subject,
      snippet: fields.body.slice(0, 60),
      body: fields.body,
      composeMode: fields.mode,
      channel: fields.channel,
      contact: fields.contact,
      ts: Date.now(),
      unread: false,
      folder: "drafts",
      starred: false
    });
    write();
    return id;
  }

  function composeStatus(host, text, kind) {
    var el = host.querySelector("#mlComposeStatus");
    if (!el) return;
    el.textContent = text || "";
    el.className = "ml-compose-status" + (kind ? " " + kind : "");
  }

  /* The real send. "Delivered" is a claim about the world, so it is made
     only after the world agreed — never before, never on a timer. */
  function sendToStudio(win, host, fields) {
    var btn = host.querySelector("#mlSend");
    if (btn) { btn.disabled = true; btn.textContent = t("ml.compose.sending"); }
    composeStatus(host, t("ml.status.relay"));

    var fail = function (why) {
      /* The letter is kept, the claim is not made. */
      var draftId = saveDraftRecord(win, fields, win._mailCompose ? win._mailCompose.draftId : null);
      if (win._mailCompose) win._mailCompose.draftId = draftId;
      var live = bodyOf(win);
      if (live) {
        var b = live.querySelector("#mlSend");
        if (b) { b.disabled = false; b.textContent = t("ml.compose.sendStudio"); }
        composeStatus(live, why + " Your letter is kept in Drafts — nothing was lost, and nothing pretends it was sent.", "warn");
      }
      toast(t("ml.toast.notDeliveredTitle"), t("ml.toast.notDeliveredBody"));
    };

    if (navigator.onLine === false) { fail(t("ml.fail.offline")); return; }

    var fd = new FormData();
    fd.append("_subject", "sys.baby OS letter — " + (fields.subject.trim() || "(no subject)"));
    fd.append("_template", "table");
    fd.append("_captcha", "false");
    /* Ниже — не интерфейс, а полезная нагрузка письма к нам в почту.
       Имена полей английские намеренно: их читает наш разбор писем, а не
       посетитель. */
    fd.append("Letter", fields.body);
    fd.append("Preferred reply channel", fields.channel || "(not specified)");
    fd.append("Reply contact", fields.contact.trim() || "(not provided)");
    fd.append("Sender profile", myAddress());
    fd.append("Origin", "Letters · sys.baby OS");

    fetch(RELAY, { method: "POST", body: fd, headers: { Accept: "application/json" } })
      .then(function (response) {
        return response.text().then(function (text) { return acceptResponse(response, text); });
      })
      .catch(function () { return false; })
      .then(function (delivered) {
        if (!delivered) { fail(t("ml.fail.refused")); return; }

        var draftId = win._mailCompose ? win._mailCompose.draftId : null;
        if (draftId != null) state.data = state.data.filter(function (x) { return x.id !== draftId; });

        var id = state.nextId++;
        state.data.push({
          id: id,
          from: "You",
          fromAddr: myAddress(),
          to: STUDIO_ADDR,
          subject: fields.subject.trim() || "(no subject)",
          snippet: fields.body.slice(0, 60),
          body: fields.body,
          channel: fields.channel,
          contact: fields.contact.trim(),
          delivery: { state: "delivered", at: Date.now() },
          ts: Date.now(),
          unread: false,
          folder: "sent",
          starred: false
        });
        write();

        win._mailCompose = null;
        win._mailFolder = "sent";
        win._mailSearch = "";
        selectedId = id;
        render(win);
        toast(t("ml.toast.deliveredTitle"), t("ml.toast.deliveredBody"));
        if (window.SysBaby && typeof window.SysBaby.playNotifSound === "function") {
          try { window.SysBaby.playNotifSound(); } catch (err) { console.error("[mail] notif sound failed", err); }
        }
      });
  }

  function bindCompose(win, host) {
    if (!win._mailCompose) return;

    host.querySelectorAll("[data-compose-mode]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var fields = readCompose(win, host);
        win._mailCompose.subject = fields.subject;
        win._mailCompose.body = fields.body;
        win._mailCompose.channel = fields.channel;
        win._mailCompose.contact = fields.contact;
        if (win._mailCompose.mode !== "studio") win._mailCompose.to = fields.to;
        win._mailCompose.mode = btn.getAttribute("data-compose-mode") === "studio" ? "studio" : "local";
        render(win);
      });
    });

    var channelSel = host.querySelector("#composeChannel");
    if (channelSel) {
      channelSel.addEventListener("change", function () {
        win._mailCompose.channel = channelSel.value;
        var contact = host.querySelector("#composeContact");
        if (contact) contact.placeholder = channelPlaceholder(channelSel.value);
      });
    }

    var close = host.querySelector("#mlComposeClose");
    if (close) {
      close.addEventListener("click", function () {
        var fields = readCompose(win, host);
        var draftId = win._mailCompose.draftId;
        win._mailCompose = null;
        var toEmpty = fields.mode === "studio" ? true : !fields.to.trim();
        if (toEmpty && !fields.subject.trim() && !fields.body.trim()) { render(win); return; }
        /* Silent draft save — mode and reply channel survive with it. */
        saveDraftRecord(win, fields, draftId);
        render(win);
      });
    }

    var send = host.querySelector("#mlSend");
    if (send) {
      send.addEventListener("click", function () {
        var fields = readCompose(win, host);

        /* A letter addressed to the studio is a studio letter no matter which
           tab it was typed in — it must never be quietly kept local. */
        if (fields.mode !== "studio" && normalizeAddress(fields.to) === STUDIO_ADDR) {
          fields.mode = "studio";
          win._mailCompose.mode = "studio";
        }

        if (fields.mode === "studio") {
          if (!fields.body.trim()) { composeStatus(host, t("ml.status.emptyBody"), "warn"); return; }
          sendToStudio(win, host, fields);
          return;
        }

        var draftId = win._mailCompose.draftId;
        var to = normalizeAddress(fields.to) || "someone" + DOMAIN;
        var subject = fields.subject.trim() || "(no subject)";

        if (draftId != null) state.data = state.data.filter(function (x) { return x.id !== draftId; });

        state.data.push({
          id: state.nextId++,
          from: "You",
          fromAddr: myAddress(),
          to: to,
          subject: subject,
          snippet: fields.body.slice(0, 60),
          body: fields.body,
          delivery: { state: "local", at: Date.now() },
          ts: Date.now(),
          unread: false,
          folder: "sent",
          starred: false
        });
        write();

        win._mailCompose = null;
        win._mailFolder = "sent";
        win._mailSearch = "";
        selectedId = null;
        render(win);
        toast(t("ml.toast.keptTitle"), t("ml.toast.keptBody"));
      });
    }
  }

  /* -------------------------------------------- connected panel liveness */

  var repaintScheduled = false;

  function repaintConnected() {
    var win = typeof window.getOpenWindow === "function" ? window.getOpenWindow("mail") : null;
    var host = bodyOf(win);
    if (!host || selectedId == null) return;
    var pane = host.querySelector(".ml-connected");
    var read = host.querySelector(".ml-read");
    if (!read) return;
    var markup = connectedMarkup(selectedId);
    if (pane) pane.remove();
    if (markup) read.insertAdjacentHTML("beforeend", markup);
    bindLinks(host);   // only the link rows are re-created; other handlers survive
  }

  function scheduleRepaint() {
    if (repaintScheduled) return;
    repaintScheduled = true;
    var run = function () { repaintScheduled = false; repaintConnected(); };
    if (typeof requestAnimationFrame === "function") requestAnimationFrame(run);
    else setTimeout(run, 16);
  }

  if (window.sbBus && typeof window.sbBus.on === "function") {
    window.sbBus.on("window:opened", scheduleRepaint);
    window.sbBus.on("window:closed", scheduleRepaint);
  }

  document.addEventListener("sysbaby:username-changed", function () {
    var win = typeof window.getOpenWindow === "function" ? window.getOpenWindow("mail") : null;
    var host = bodyOf(win);
    if (!host) return;
    var line = host.querySelector("#mlComposeFrom");
    if (line) line.textContent = t("ml.compose.newMsgFrom", { addr: myAddress() });
  });

  /* ------------------------------------------------------------ providers */

  window.sbMailAll = function () {
    ensureLoaded();
    return state.data
      .filter(function (m) { return m.folder !== "trash"; })
      .slice()
      .sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); })
      .map(function (m) { return { id: m.id, folder: m.folder, from: m.from, subject: m.subject, snippet: m.snippet }; });
  };

  window.sbMailSearch = function (q) {
    ensureLoaded();
    var needle = String(q == null ? "" : q).trim().toLowerCase();
    if (!needle) return [];
    return state.data
      .filter(function (m) {
        if (m.folder === "trash") return false;
        return [m.from, m.subject, m.snippet, m.body].join(" ").toLowerCase().indexOf(needle) !== -1;
      })
      .map(function (m) { return { id: m.id, folder: m.folder, from: m.from, subject: m.subject }; });
  };

  window.sbMailOpenResult = function (win, result) {
    if (!win || !result || result.id == null) return false;
    var m = messageById(result.id);
    if (!m) return false;
    win._mailFolder = m.folder;
    win._mailSearch = "";
    selectedId = m.id;
    if (m.unread) { m.unread = false; write(); pushBadge(); }
    render(win);
    return true;
  };

  window.sbMailUnreadCount = function () { return unreadInbox(); };

  /* ------------------------------------------------------- registration */

  /* Перерисовка при смене языка — но только когда не открыт черновик.
     Оболочка предлагает retranslate: true, и Письма его НЕ берут: слепая
     перерисовка стёрла бы текст, который посетитель уже набрал в окне
     письма. Пока черновик открыт, переведены остаются заголовок окна, док
     и панели; содержимое письма — это его слова, и они важнее. */
  if (window.sbBus && typeof window.sbBus.on === "function") {
    window.sbBus.on("translate:done", function () {
      var win = typeof window.getOpenWindow === "function" ? window.getOpenWindow("mail") : null;
      if (!win || !bodyOf(win)) return;
      if (win._mailCompose) return;
      try { render(win); } catch (err) { console.error("[mail] retranslate failed", err); }
    });
  }

  if (typeof window.registerApp === "function") {
    window.registerApp("mail", {
      title: "Letters",
      i18n: {
        ru: { title: "Письма", label: "Письма" },
        ee: { title: "Kirjad", label: "Kirjad" },
      },
      label: "Letters",
      color: "linear-gradient(160deg,#7fe0ff 0%,#38b6f5 46%,#0f8fd9 100%)",
      icon: ICON,
      size: { w: 760, h: 560 },
      deskPos: { x: 40, y: 370 },
      render: render
    });
  }
})();
