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

  /* ── СИСТЕМА ПРИХОДИТ ПУСТОЙ (D-142) ────────────────────────────────────
     ПОВОД, дословно от основателя 26.08.2026: «прошу полностью очистить
     содержимое приложений от всяких примеров и мусора. Система должна
     выглядеть чистой».
     Засеянные примеры были нужны, пока систему показывали. Теперь ею
     пользуются — и чужие письма, чужие папки и чужие разговоры в своей
     системе выглядят ровно тем, чем являются: мусором. Приложение, которому
     нечего показать, теперь ГОВОРИТ с человеком (D-140), а не притворяется
     занятым. */
  var SEED = [];


  /* -------------------------------------------------------------- helpers */

  function esc(value) {
    if (typeof window.escapeHtml === "function") return window.escapeHtml(value == null ? "" : String(value));
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  /* ── ХРАНИЛИЩЕ ЧЕРЕЗ СВОЙ ЯЩИК · D-242 ──────────────────────────────────
     Здесь стояли свои обёртки над складом, и такие же были у каждой комнаты.
     Комната ходила на диск прямо, и ни одна строка системы не говорила,
     какие места ей принадлежат. Теперь диск виден через ящик, выданный по
     объявлению keeps/reads (см. registerApp ниже), а защита от закрытого
     хранилища живёт в ОДНОМ месте — os/core/rights.js.
     ЯЩИК СПРАШИВАЕТСЯ, А НЕ ЗАПОМИНАЕТСЯ: комната объявляется раньше, чем
     поднимается ядро прав. */
  function box() {
    return window.sbRights
      ? window.sbRights.box("messenger")
      : { get: function () { return null; }, set: function () { return false; },
          remove: function () { return false; }, flush: function () { } };
  }
  function dbGet(key) { return box().get(key); }
  /* ── ЭПОХА ХРАНИЛИЩА (D-274) ──────────────────────────────────────────
     Копия памяти этой комнаты помнит, в какую эпоху хранилища она снята, и
     перечитывается, когда эпоха другая (замок открыли, заперли, сняли). Пока
     хранилище закрыто замком, копия не снимается вовсе: «ничего» за дверью —
     не пустота, а запертое. Охраняется tools/lock-memory-check.mjs. */
  function epochNow() {
    try { return window.sbDB && window.sbDB.epoch ? window.sbDB.epoch() : 0; }
    catch (e) { return 0; /* ОТКАТ: ядро без эпох — одна эпоха на весь сеанс */ }
  }
  function storeClosed() {
    try { return !!(window.sbDB && window.sbDB.closed && window.sbDB.closed()); }
    catch (e) { return false; /* ОТКАТ: не спросить — считаем открытым, как было */ }
  }
  function dbSet(key, value) { return box().set(key, value); }
  function dbRemove(key) { box().remove(key); }
  function dbFlush() { box().flush(); }

  function toast(title, text) {
    if (typeof window.showToast !== "function") return;
    try { window.showToast(title, text, ICON); } catch (err) { console.error("[messenger] toast failed", err); }
  }

  function bodyOf(win) { return win && win.el ? win.el.querySelector(".window-body") : null; }

  function uid() { return "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  /* ── ЗАПЕЧАТАННАЯ ПЕРЕПИСКА (D-269) ───────────────────────────────────
     ПОВОД. В описи дыр: «Переписка не делает работу — ждёт своего сервера».
     Сервер нужен, чтобы НОСИТЬ сообщения. Но носить их умеет любой канал,
     которым человек уже пользуется: мессенджер, почта, SMS. Чего у этих
     каналов нет — тайны: носильщик читает всё.
     Здесь тайна есть. У разговора — ОБЩЕЕ СЛОВО, о котором двое договорились
     при встрече или голосом. Сообщение запечатывается им: PBKDF2-SHA-256
     (600 000 проходов, своя соль на каждое сообщение) → AES-256-GCM. Получается
     строка «sb1:…» — её человек сам несёт любым путём, и тот, кто несёт,
     видит шум. На другом конце вставленная строка открывается тем же словом.
     ЧТО ЭТО НЕ ДАЁТ, сказано вслух: носит человек, а не система; дошло ли —
     система не знает; общее слово хранится под замком и никуда не уходит, но
     если его узнает носильщик, тайна кончится. Слабое общее слово — слабая
     тайна: поэтому короче шести знаков его не принимаем. */
  var SEAL_PREFIX = "sb1:";
  /* ПОСТОЯННАЯ: 600 000 — рекомендация OWASP для PBKDF2-SHA-256; цена одной
     попытки подбора общего слова, а не число о составе системы. */
  var SEAL_ITER = 600000;
  var SEAL_AAD = "sys.baby/whisper/v1";
  /* ПОСТОЯННАЯ: шесть знаков — нижняя граница общего слова; мера тайны. */
  var PACT_MIN = 6;
  function b64u(bytes) {
    var bin = "", i;
    for (i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function unb64u(str) {
    var s64 = String(str).replace(/-/g, "+").replace(/_/g, "/");
    while (s64.length % 4) s64 += "=";
    var bin = atob(s64), out = new Uint8Array(bin.length), i;
    for (i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function pactKey(pact, salt) {
    var subtle = window.crypto.subtle;
    return subtle.importKey("raw", new TextEncoder().encode(String(pact)), { name: "PBKDF2" }, false, ["deriveKey"]).then(function (base) {
      return subtle.deriveKey({ name: "PBKDF2", salt: salt, iterations: SEAL_ITER, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    });
  }
  function sealFor(pact, text) {
    var salt = new Uint8Array(16), iv = new Uint8Array(12);
    window.crypto.getRandomValues(salt);
    window.crypto.getRandomValues(iv);
    var body = new TextEncoder().encode(JSON.stringify({ v: 1, t: String(text), at: Date.now() }));
    return pactKey(pact, salt).then(function (key) {
      return window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv, additionalData: new TextEncoder().encode(SEAL_AAD) }, key, body);
    }).then(function (ct) {
      var c = new Uint8Array(ct), all = new Uint8Array(16 + 12 + c.length);
      all.set(salt, 0); all.set(iv, 16); all.set(c, 28);
      return SEAL_PREFIX + b64u(all);
    });
  }
  /* Вставить можно как угодно: с пробелами, переносами и словами вокруг —
     печать ищется в тексте сама. */
  function findSeal(pasted) {
    var m = String(pasted || "").replace(/\s+/g, "").match(/sb1:[A-Za-z0-9_-]+/);
    return m ? m[0] : "";
  }
  function openFrom(pact, sealed) {
    var s64 = findSeal(sealed);
    if (!s64) return Promise.reject(new Error("shape"));
    var all;
    try { all = unb64u(s64.slice(SEAL_PREFIX.length)); } catch (e) { return Promise.reject(new Error("shape")); }
    if (all.length < 16 + 12 + 16) return Promise.reject(new Error("shape"));
    var salt = all.subarray(0, 16), iv = all.subarray(16, 28), ct = all.subarray(28);
    return pactKey(pact, salt).then(function (key) {
      return window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv, additionalData: new TextEncoder().encode(SEAL_AAD) }, key, ct);
    }).then(function (plain) {
      var o = JSON.parse(new TextDecoder().decode(plain));
      if (!o || typeof o.t !== "string") throw new Error("shape");
      return o;
    });
  }

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

  var convos = null, convosEpoch = -1;
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
    /* Копия из другой эпохи не пишется никогда: она легла бы поверх настоящей памяти (D-274). */
    if (convosEpoch !== epochNow()) return false;
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

  /* ── СТАРЫЕ РЕДАКЦИИ УБИРАЮТСЯ ВСЕГДА, А НЕ ТОЛЬКО ПРИ ПЕРЕНОСЕ (D-227) ──
     ЗДЕСЬ БЫЛА ЩЕЛЬ, и нашёл её закон, написанный для скрытого приложения.
     Если нынешняя редакция уже есть, чтение возвращалось СРАЗУ — и ключи
     прежнего образца оставались на диске навсегда. То есть у всякого, кто
     пользовался старой сборкой и перешёл на новую, рядом с живой перепиской
     лежала её прежняя копия: не нужная никому, не показанная нигде, и
     переживающая любое удаление разговоров.
     Уборка теперь стоит ПЕРВОЙ и не зависит от того, было ли что переносить.
     В шапке приложения было написано «keys are removed» — теперь это правда,
     а не намерение. */
  function dropLegacy() {
    if (dbGet(KEY_V2) != null) dbRemove(KEY_V2);
    if (dbGet(KEY_V1) != null) dbRemove(KEY_V1);
  }

  function load() {
    convosEpoch = epochNow();
    /* За дверью замка переписка не читается и не сажается (D-274). */
    if (storeClosed()) { convos = []; convosEpoch = -1; return; }
    var v3 = parseList(dbGet(KEY_V3));
    if (v3) { convos = normalizeAll(v3); dropLegacy(); return; }

    var legacy = parseList(dbGet(KEY_V2));
    if (!legacy) legacy = parseList(dbGet(KEY_V1));
    if (legacy) {
      convos = normalizeAll(legacy);
      if (writeVerified()) dropLegacy();
      return;
    }
    seed();
    dropLegacy();
  }

  function ensureLoaded() { if (!convos || convosEpoch !== epochNow()) load(); }

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
        "<span>" + esc(clockOf(m.ts)) + (m.edited ? " · " + esc(t("mg.edited")) : "") +
          (m.sealedIn || m.sealedOut ? " · " + esc(t("mg.sealedTag")) : "") + "</span>" +
        (mine && c.pact && m.type !== "file"
          ? '<button type="button" class="mg-meta-btn mg-seal-btn" data-seal="' + esc(m.id) + '" title="' + esc(t("mg.sealTitle")) + '">' + esc(t("mg.seal")) + "</button>" : "") +
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
        '<button type="button" class="mg-to-letter" id="mgPactBtn" aria-expanded="' + (win._mgPactOpen ? "true" : "false") + '">' + esc(c.pact ? t("mg.pactSet") : t("mg.pact")) + "</button>" +
        '<button type="button" class="mg-to-letter" id="mgToLetter" title="' + esc(t("mg.toLetterTitle")) + '">' + esc(t("mg.toLetter")) + "</button>" +
      "</header>" +
      sealPanels(win, c) +
      '<div class="mg-messages" id="mgMessages">' + (out.length ? out.join("") : '<div class="mg-thread-empty"><p>' + esc(t("mg.noMessages")) + "</p></div>") + "</div>" +
      attachMarkup(win) +
      '<div class="mg-inputrow">' +
        '<button type="button" class="mg-attach-btn" id="mgPaste" title="' + esc(t("mg.paste")) + '" aria-label="' + esc(t("mg.paste")) + '" aria-expanded="' + (win._mgPasteOpen ? "true" : "false") + '">' + SEAL_GLYPH + "</button>" +
        '<button type="button" class="mg-attach-btn" id="mgAttach" title="' + esc(t("mg.attach", { files: appName("files") })) + '" aria-label="' + esc(t("mg.attach", { files: appName("files") })) + '">' + PAPERCLIP + "</button>" +
        '<input type="text" id="msgrInput" class="mg-input flat" placeholder="' + esc(t("mg.ph.message", { name: firstWord })) + '" autocomplete="off">' +
        '<button type="button" class="mg-send" id="mgSend" title="' + esc(t("mg.send")) + '" aria-label="' + esc(t("mg.send")) + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 4 4 10.4l6.3 2.4L20 4Z"/><path d="M20 4 13.4 20l-3.1-7.2L20 4Z"/></svg>' +
        "</button>" +
      "</div>";
  }

  var SEAL_GLYPH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 7.5h15v10a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5v-10Z"/><path d="m4.5 7.5 7.5 6 7.5-6"/><circle cx="12" cy="16" r="1.4"/></svg>';
  /* Три тихие панели запечатанной переписки: общее слово, выданная печать,
     вставка полученной. Каждая открывается касанием и не висит без дела. */
  function sealPanels(win, c) {
    var out = "";
    if (win._mgPactOpen) {
      out += '<div class="mg-seal-panel" id="mgPactPanel">' +
        '<p class="mg-seal-what">' + esc(t("mg.pactWhat")) + "</p>" +
        '<div class="mg-seal-row"><input type="password" id="mgPactInput" class="mg-input flat" autocomplete="off" placeholder="' + esc(t("mg.pactPh")) + '" aria-label="' + esc(t("mg.pact")) + '">' +
        '<button type="button" class="mg-seal-go" id="mgPactSave">' + esc(t("mg.pactSave")) + "</button></div>" +
        '<p class="mg-seal-say" id="mgPactSay" role="status"></p></div>';
    }
    if (win._mgSealed && String(win._mgSealed.convo) === String(c.id)) {
      out += '<div class="mg-seal-panel" id="mgSealedPanel">' +
        '<p class="mg-seal-what">' + esc(t("mg.sealedOut")) + "</p>" +
        '<textarea id="mgSealedOut" class="mg-seal-text" readonly data-sb-nolang>' + esc(win._mgSealed.text) + "</textarea>" +
        '<div class="mg-seal-row"><button type="button" class="mg-seal-go" id="mgSealedCopy">' + esc(t("mg.copy")) + "</button>" +
        (navigator.share ? '<button type="button" class="mg-seal-go" id="mgSealedShare">' + esc(t("mg.share")) + "</button>" : "") +
        '<button type="button" class="mg-seal-go quiet" id="mgSealedClose">' + esc(t("mg.close")) + "</button></div>" +
        '<p class="mg-seal-say" id="mgSealedSay" role="status"></p></div>';
    }
    if (win._mgPasteOpen) {
      out += '<div class="mg-seal-panel" id="mgPastePanel">' +
        '<p class="mg-seal-what">' + esc(t("mg.pasteWhat")) + "</p>" +
        '<textarea id="mgSealedIn" class="mg-seal-text" data-sb-nolang placeholder="sb1:…" aria-label="' + esc(t("mg.paste")) + '"></textarea>' +
        '<div class="mg-seal-row"><button type="button" class="mg-seal-go" id="mgSealedOpen">' + esc(t("mg.pasteOpen")) + "</button></div>" +
        '<p class="mg-seal-say" id="mgPasteSay" role="status"></p></div>';
    }
    return out;
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

    /* ── запечатанная переписка: проводка (D-269) ── */
    var pactBtn = host.querySelector("#mgPactBtn");
    if (pactBtn) pactBtn.addEventListener("click", function () { win._mgPactOpen = !win._mgPactOpen; render(win); });
    var pactSave = host.querySelector("#mgPactSave");
    if (pactSave) pactSave.addEventListener("click", function () {
      var c = byId(activeId), inp = host.querySelector("#mgPactInput"), say = host.querySelector("#mgPactSay");
      var v = inp ? String(inp.value) : "";
      if (!c) return;
      if (v.length < PACT_MIN) { if (say) say.textContent = t("mg.pactShort", { n: PACT_MIN }); return; }
      c.pact = v;
      write();
      win._mgPactOpen = false;
      render(win);
      toast(t("mg.pactSet"), t("mg.pactOn"));
    });
    host.querySelectorAll("[data-seal]").forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        var c = byId(activeId);
        if (!c || !c.pact) return;
        var m = null;
        (c.messages || []).forEach(function (x) { if (String(x.id) === btn.getAttribute("data-seal")) m = x; });
        if (!m || !m.text) return;
        btn.disabled = true;
        sealFor(c.pact, m.text).then(function (sealed) {
          m.sealedOut = Date.now();
          write();
          win._mgSealed = { convo: c.id, text: sealed };
          render(win);
        }, function () { btn.disabled = false; toast(t("mg.seal"), t("mg.sealFailed")); });
      });
    });
    var sealedCopy = host.querySelector("#mgSealedCopy");
    if (sealedCopy) sealedCopy.addEventListener("click", function () {
      var ta = host.querySelector("#mgSealedOut"), say = host.querySelector("#mgSealedSay");
      var text = ta ? ta.value : "";
      var done = function () { if (say) say.textContent = t("mg.copied"); };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { if (ta) { ta.select(); } if (say) say.textContent = t("mg.copyHand"); });
      } else { if (ta) ta.select(); if (say) say.textContent = t("mg.copyHand"); }
    });
    var sealedShare = host.querySelector("#mgSealedShare");
    if (sealedShare) sealedShare.addEventListener("click", function () {
      var ta = host.querySelector("#mgSealedOut");
      try { navigator.share({ text: ta ? ta.value : "" }).catch(function () { /* человек передумал */ }); } catch (e) { /* ignore */ }
    });
    var sealedClose = host.querySelector("#mgSealedClose");
    if (sealedClose) sealedClose.addEventListener("click", function () { win._mgSealed = null; render(win); });
    var pasteBtn = host.querySelector("#mgPaste");
    if (pasteBtn) pasteBtn.addEventListener("click", function () { win._mgPasteOpen = !win._mgPasteOpen; render(win); });
    var sealedOpen = host.querySelector("#mgSealedOpen");
    if (sealedOpen) sealedOpen.addEventListener("click", function () {
      var c = byId(activeId), ta = host.querySelector("#mgSealedIn"), say = host.querySelector("#mgPasteSay");
      if (!c) return;
      if (!c.pact) { if (say) say.textContent = t("mg.pasteNoPact"); return; }
      var pasted = ta ? ta.value : "";
      if (!findSeal(pasted)) { if (say) say.textContent = t("mg.pasteNone"); return; }
      sealedOpen.disabled = true;
      openFrom(c.pact, pasted).then(function (o) {
        c.messages.push({ id: uid(), from: "them", text: o.t, ts: Date.now(), sentAt: Number(o.at) || null, sealedIn: true, edited: false, reaction: null });
        write();
        win._mgPasteOpen = false;
        render(win);
      }, function () {
        sealedOpen.disabled = false;
        if (say) say.textContent = t("mg.pasteWrong");
      });
    });

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
      /* МЕСТО ДЛЯ ЭСТАФЕТЫ (D-290): открытая переписка — указателем.
         Пришли новые слова после ухода — карточка скажет, что менялась. */
      where: function () {
        var win = typeof window.getOpenWindow === "function" ? window.getOpenWindow("messenger") : null;
        return win && activeId != null && byId(activeId) ? { id: String(activeId) } : null;
      },
      resume: function (win, place) {
        return !!(win && place && window.sbMessengerOpenResult(win, { id: place.id }));
      },
      recall: function (place, since) {
        var c = place && byId(place.id);
        if (!c) return null;
        var last = 0;
        (c.messages || []).forEach(function (m) { if (m && m.ts > last) last = m.ts; });
        return { name: c.name, changed: !!(since && last > since) };
      },
      /* ЧЕМ ЭТА КОМНАТА ОТКРЫВАЕТСЯ СНАРУЖИ (D-245). Дверь, о которой хозяин
         не сказал, — незваная: ровно из таких выросли шестнадцать частных
         ходов, каждый правый в свой день. Охраняется tools/hand-check.mjs. */
      opens: ["sbMessengerOpenResult"],
      /* ЧТО НУЖНО, ЧТОБЫ ДЕЛАТЬ РАБОТУ (D-243). Комната НАЗЫВАЕТ нужду;
         есть ли она — измеряет прибор, а не она сама.
         Охраняется tools/alive-check.mjs. */
      /* С D-269 сервер Переписке не нужен: носит человек, любым своим путём,
         а тайну держит общее слово. Живого собеседника на том конце прибор
         не измерит — и так и скажет. */
      needs: ["диск", "собеседник"],
      /* ПРИЧИНА — СИСТЕМЕ, А НЕ КОММЕНТАРИЮ (D-243). */
      /* Причина — ключ словаря: на экран она идёт на языке человека (D-253). */
      why: "why.messenger",
      /* СВОИ МЕСТА НА ДИСКЕ (D-242). Охраняется room-rights-check.mjs. */
      keeps: [KEY_V3, KEY_V2, KEY_V1],
      /* ── ВРЕМЕННО УБРАНО СО СТОЛА · решение D-186 ──────────────────────
         Основатель 27.08.2026: «прошу временно убрать те приложения, которые
         не несут пользы на данном этапе».
         ПРИЧИНА ИМЕННО ЗДЕСЬ: Разговор без сервера не с кем вести. Собеседник здесь нарисован, и это честно сказано внутри, — но пользы человеку сейчас ноль.
         ПРАВИЛО, ПО КОТОРОМУ ВЫБИРАЛИ: приложение, которое не может делать
         свою работу, — не приложение, а КАРТИНКА приложения. Такие сняты со
         стола, из полки и из палитры.
         УБРАНО, А НЕ УДАЛЕНО: код на месте, законы его по-прежнему проверяют,
         открыть по имени можно. Возврат — снятием одной строки.
         ── ВОЗВРАЩЕНО НА СТОЛ · решение D-269 ────────────────────────────
         Причина снятия была одна: работы нет. С запечатанной перепиской она
         есть — по тому же правилу основателя комната, которая делает свою
         работу, стоит на столе. Снять снова — строкой hidden: true. */
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
