/* sys.baby OS — core/store.js
 * Storage spine: incognito facade, sbDB (namespaced localStorage working set),
 * sbProfiles, shared notes store, IndexedDB snapshot mirror, export/import,
 * early diagnostics + boot failure reporter.
 * Loaded FIRST (in <head>), before every other module. */
(function () {
  "use strict";

  /* ---------------------------------------------------------------- 0. raw */
  /* Grab the native storage object once, before the incognito facade may
     replace window.localStorage. Everything below deliberately goes through
     window.localStorage (so the facade applies) except where noted. */
  var nativeLS = null;
  try { nativeLS = window.localStorage; } catch (e) { nativeLS = null; }

  function lsGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { window.localStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function lsDel(k) { try { window.localStorage.removeItem(k); return true; } catch (e) { return false; } }
  function ssGet(k) { try { return window.sessionStorage.getItem(k); } catch (e) { return null; } }
  function ssSet(k, v) { try { window.sessionStorage.setItem(k, v); return true; } catch (e) { return false; } }
  function ssDel(k) { try { window.sessionStorage.removeItem(k); return true; } catch (e) { return false; } }

  function lsKeys() {
    var out = [];
    try {
      var n = window.localStorage.length;
      for (var i = 0; i < n; i++) { var k = window.localStorage.key(i); if (k != null) out.push(k); }
    } catch (e) { /* storage blocked — treated as empty (§10 amnesiac session) */ }
    return out;
  }

  /* ------------------------------------------------- 1. incognito facade §1.3 */
  var INCOG_PREFIX = "sysbaby.incognito::";
  window.sbIncognitoActive = false;

  (function installIncognitoFacade() {
    if (ssGet("sysbaby.space") !== "incognito") return;
    if (!nativeLS) { ssDel("sysbaby.space"); return; }
    try {
      var real = nativeLS;
      var facade = {
        getItem: function (k) { return real.getItem(INCOG_PREFIX + k); },
        setItem: function (k, v) { real.setItem(INCOG_PREFIX + k, String(v)); },
        removeItem: function (k) { real.removeItem(INCOG_PREFIX + k); },
        key: function (i) {
          var mine = [], n = real.length, j;
          for (j = 0; j < n; j++) { var kk = real.key(j); if (kk && kk.indexOf(INCOG_PREFIX) === 0) mine.push(kk.slice(INCOG_PREFIX.length)); }
          return i >= 0 && i < mine.length ? mine[i] : null;
        },
        clear: function () {
          var doomed = [], n = real.length, j;
          for (j = 0; j < n; j++) { var kk = real.key(j); if (kk && kk.indexOf(INCOG_PREFIX) === 0) doomed.push(kk); }
          for (j = 0; j < doomed.length; j++) real.removeItem(doomed[j]);
        }
      };
      Object.defineProperty(facade, "length", {
        get: function () {
          var c = 0, n = real.length, j;
          for (j = 0; j < n; j++) { var kk = real.key(j); if (kk && kk.indexOf(INCOG_PREFIX) === 0) c++; }
          return c;
        }
      });
      Object.defineProperty(window, "localStorage", { value: facade, configurable: true, writable: false });
      /* verify the swap actually took */
      window.localStorage.setItem("sysbaby.__probe", "1");
      var ok = real.getItem(INCOG_PREFIX + "sysbaby.__probe") === "1";
      window.localStorage.removeItem("sysbaby.__probe");
      if (!ok) throw new Error("facade not effective");
      window.sbIncognitoActive = true;
      var de = document.documentElement;
      de.setAttribute("data-theme", "dark");
      de.classList.add("sb-incognito");
    } catch (err) {
      /* fail safe: leave the space rather than run with mixed storage */
      try { Object.defineProperty(window, "localStorage", { value: nativeLS, configurable: true }); } catch (e2) { /* keep going */ }
      ssDel("sysbaby.space"); ssDel("sysbaby.incognito.timerSec");
      window.sbIncognitoActive = false;
      if (window.console) console.warn("[sysbaby] incognito facade unavailable:", err && err.message);
    }
  })();

  /* -------------------------------------------------- 2. diagnostics §10/§6.6 */
  var diagErrors = window.__sbDiagErrors || [];
  window.__sbDiagErrors = diagErrors;
  var reporterShown = false;

  function pushDiag(rec) {
    diagErrors.push(rec);
    if (diagErrors.length > 30) diagErrors.splice(0, diagErrors.length - 30);
  }

  function showBootReport(rec) {
    if (reporterShown) return;
    reporterShown = true;
    var paint = function () {
      if (!document.body) { setTimeout(paint, 50); return; }
      var box = document.createElement("div");
      box.id = "sbBootFail";
      box.setAttribute("role", "alert");
      var where = rec.where || "unknown module";
      box.textContent = "sys.baby did not finish starting.\n" + where + "\n" + (rec.message || "") +
        "\nNothing was lost. Reloading usually works — and this text is exactly what is needed to fix the cause.";
      document.body.appendChild(box);
    };
    paint();
  }

  function shortWhere(src, line, col) {
    if (!src) return "";
    var file = String(src).split("/").slice(-1)[0] || String(src);
    return file + (line ? ":" + line : "") + (col ? ":" + col : "");
  }

  window.addEventListener("error", function (ev) {
    var rec = {
      message: (ev && ev.message) || "Script error",
      where: shortWhere(ev && ev.filename, ev && ev.lineno, ev && ev.colno),
      ts: Date.now()
    };
    pushDiag(rec);
    showBootReport(rec);
  });
  window.addEventListener("unhandledrejection", function (ev) {
    var reason = ev && ev.reason;
    var rec = {
      message: (reason && (reason.message || String(reason))) || "Unhandled rejection",
      where: (reason && reason.stack) ? shortWhere((String(reason.stack).split("\n")[1] || "").trim()) : "promise",
      ts: Date.now()
    };
    pushDiag(rec);
    showBootReport(rec);
  });

  /* ------------------------------------------------------------ 3. sbDB §1.1 */
  var PROFILE_PREFIX = "sysbaby.profile.";
  var cache = new Map();          /* logical key -> string|null (null is a real cached value) */
  var dirty = new Set();
  var flushScheduled = false;
  var storageFailureSurfaced = false;

  function activeProfile() {
    var v = lsGet("sysbaby.activeProfile");
    return v || "local";
  }

  function nsKeyFor(profileId, key) {
    return profileId === "local" ? key : PROFILE_PREFIX + profileId + "." + key;
  }
  function nsKey(key) { return nsKeyFor(activeProfile(), key); }

  function surfaceStorageFailure() {
    if (storageFailureSurfaced) return;
    storageFailureSurfaced = true;
    window.sbStorageFailed = true;
    var title = "Couldn't save";
    var text = "Storage may be full or restricted in this browser.";
    var done = false;
    if (typeof window.showToast === "function") {
      try { window.showToast(title, text, "", true, "toast-warn", "event"); done = true; } catch (e) { done = false; }
    }
    if (done) return;
    var paint = function () {
      if (!document.body) { setTimeout(paint, 60); return; }
      if (document.getElementById("sbQuotaBanner")) return;
      var b = document.createElement("div");
      b.id = "sbQuotaBanner";
      b.setAttribute("role", "alert");
      b.textContent = title + " — " + text;
      document.body.appendChild(b);
    };
    paint();
  }

  function flush() {
    flushScheduled = false;
    if (!dirty.size) return;
    var profile = activeProfile();
    var keys = Array.from(dirty);
    dirty.clear();
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i], v = cache.has(k) ? cache.get(k) : null, ok;
      if (v == null) ok = lsDel(nsKeyFor(profile, k));
      else ok = lsSet(nsKeyFor(profile, k), v);
      if (!ok) {
        if (window.console) console.error("[sbDB] write failed for", k);
        surfaceStorageFailure();
      }
    }
    scheduleSnapshot();
  }

  function scheduleFlush() {
    if (flushScheduled) return;
    flushScheduled = true;
    if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(flush, { timeout: 250 });
    else setTimeout(flush, 60);
  }

  var sbDB = {
    get: function (key) {
      if (cache.has(key)) return cache.get(key);
      var v = lsGet(nsKey(key));
      cache.set(key, v);
      return v;
    },
    set: function (key, value) {
      cache.set(key, (value === null || value === undefined) ? null : String(value));
      dirty.add(key);
      scheduleFlush();
      return true;
    },
    remove: function (key) {
      cache.set(key, null);
      dirty.add(key);
      scheduleFlush();
      return true;
    },
    flushSync: function () { flush(); },
    activeProfile: activeProfile,
    nsKey: nsKey
  };
  window.sbDB = sbDB;

  window.addEventListener("beforeunload", function () { flush(); });
  window.addEventListener("pagehide", function () { flush(); snapshotNow(); });

  /* -------------------------------------------------------- 4. profiles §1.2 */
  var PROFILES_KEY = "sysbaby.profiles.v1";

  function readProfiles() {
    var raw = lsGet(PROFILES_KEY), list = null;
    if (raw) { try { list = JSON.parse(raw); } catch (e) { list = null; } }
    if (!list || !Array.isArray(list) || !list.length) {
      list = [{ id: "local", name: "This computer", createdAt: Date.now() }];
      writeProfiles(list);
    }
    return list;
  }
  function writeProfiles(list) { lsSet(PROFILES_KEY, JSON.stringify(list)); }

  function makeId() {
    var r = Math.random().toString(36).slice(2, 6);
    return "u" + Date.now().toString(36) + r;
  }
  function nameFromEmail(email) {
    var local = String(email || "").split("@")[0].replace(/[._-]+/g, " ").trim();
    if (!local) return "Someone";
    return local.charAt(0).toUpperCase() + local.slice(1);
  }

  var sbProfiles = {
    list: function () { return readProfiles(); },
    current: function () { return activeProfile(); },
    currentRecord: function () {
      var id = activeProfile(), list = readProfiles(), i;
      for (i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
      return { id: "local", name: "This computer" };
    },
    create: function (name, email) {
      var list = readProfiles();
      var rec = {
        id: makeId(),
        name: String(name || "New profile").trim().slice(0, 30),
        createdAt: Date.now()
      };
      if (email) rec.email = String(email).toLowerCase();
      list.push(rec);
      writeProfiles(list);
      idbPutAccount(rec);
      return rec;
    },
    rename: function (id, name) {
      var list = readProfiles(), i;
      for (i = 0; i < list.length; i++) {
        if (list[i].id === id) { list[i].name = String(name || "").trim().slice(0, 30) || list[i].name; writeProfiles(list); return list[i]; }
      }
      return null;
    },
    findByEmail: function (email) {
      var e = String(email || "").toLowerCase(), list = readProfiles(), i;
      for (i = 0; i < list.length; i++) if (list[i].email === e) return list[i];
      return null;
    },
    findOrCreateByEmail: function (email) {
      var found = sbProfiles.findByEmail(email);
      if (found) return found;
      return sbProfiles.create(nameFromEmail(email), email);
    },
    remove: function (id) {
      if (id === "local") return false;
      var list = readProfiles().filter(function (p) { return p.id !== id; });
      writeProfiles(list);
      var pre = PROFILE_PREFIX + id + ".";
      lsKeys().forEach(function (k) { if (k.indexOf(pre) === 0) lsDel(k); });
      if (activeProfile() === id) { lsDel("sysbaby.activeProfile"); }
      return true;
    },
    switchTo: function (id) {
      if (!id || id === activeProfile()) return false;
      sbDB.flushSync();
      lsSet("sysbaby.activeProfile", id);
      location.reload();
      return true;
    }
  };
  window.sbProfiles = sbProfiles;

  /* ==================================================== 4.5 вход без сервера
   *
   * ТРЕБОВАНИЕ ОСНОВАТЕЛЯ 19.08.2026: «вход и регистрация должны работать, но
   * пока без сервера, и с возможностью зайти как гость».
   *
   * ЧТО ЗДЕСЬ БЫЛО ДО ТОГО. Экран входа принимал ЛЮБОЙ пароль, а на «забыли
   * пароль?» отвечал «Demo mode — any password works». Учётные записи при этом
   * были настоящие: sbProfiles умеет заводить профиль, разделять данные по
   * пространствам имён и переключаться между ними. Не хватало ровно одного —
   * проверки того, кто пришёл. Дверь была нарисована.
   *
   * КАК УСТРОЕНО ТЕПЕРЬ. Пароль не хранится нигде и никогда. Хранится соль и
   * результат PBKDF2-SHA-256 в сто пятьдесят тысяч проходов — это стандарт
   * браузера (crypto.subtle), сервер для него не нужен, и подобрать по нему
   * пароль дороже, чем он стоит.
   *
   * ЧЕГО ЗДЕСЬ НЕТ И БЫТЬ НЕ МОЖЕТ, и это сказано вслух:
   *   · это не шифрование данных. Пароль решает, КТО ВОШЁЛ, а не кто может
   *     прочитать файлы: они лежат в хранилище браузера, и человек с доступом
   *     к устройству прочтёт их мимо любой формы входа. Обещать иное значило
   *     бы продавать ложное чувство безопасности;
   *   · восстановления пароля нет. Сервера нет — восстанавливать некому.
   *     Так и написано на экране, вместо «Demo mode».
   *
   * Если crypto.subtle недоступен (страница открыта не по https и не с
   * localhost), пароли НЕ ИЗОБРАЖАЮТСЯ слабым самодельным хешем: available()
   * возвращает false, и экран честно предлагает войти гостем. Слабая криптo,
   * выданная за настоящую, — та же нарисованная дверь, только изнутри.
   *
   * Охраняется tools/os-auth-check.mjs.
   */
  var AUTH_ITER = 150000;

  function subtleOk() {
    return !!(window.crypto && window.crypto.subtle && window.crypto.getRandomValues);
  }

  function toHex(buf) {
    var b = new Uint8Array(buf), out = "", i;
    for (i = 0; i < b.length; i++) out += (b[i] < 16 ? "0" : "") + b[i].toString(16);
    return out;
  }

  function randomSaltHex() {
    var a = new Uint8Array(16);
    window.crypto.getRandomValues(a);
    return toHex(a.buffer);
  }

  function derive(password, saltHex) {
    var enc = new TextEncoder();
    return window.crypto.subtle
      .importKey("raw", enc.encode(String(password)), { name: "PBKDF2" }, false, ["deriveBits"])
      .then(function (key) {
        return window.crypto.subtle.deriveBits({
          name: "PBKDF2",
          salt: enc.encode(saltHex),
          iterations: AUTH_ITER,
          hash: "SHA-256"
        }, key, 256);
      })
      .then(toHex);
  }

  /* Сравнение постоянного времени: обычное === выходит раньше на первом
     несовпавшем символе, и по времени ответа можно подбирать хеш посимвольно.
     Дёшево сделать правильно — значит нет причины делать иначе. */
  function sameSecret(a, b) {
    var x = String(a || ""), y = String(b || "");
    if (x.length !== y.length) return false;
    var diff = 0, i;
    for (i = 0; i < x.length; i++) diff |= x.charCodeAt(i) ^ y.charCodeAt(i);
    return diff === 0;
  }

  function emailOf(name) { return String(name || "").toLowerCase() + "@sys.baby"; }

  var sbAuth = {
    available: subtleOk,
    iterations: AUTH_ITER,

    /* Заведена ли учётная запись с таким именем на ЭТОМ устройстве. */
    has: function (name) {
      var p = sbProfiles.findByEmail(emailOf(name));
      return !!(p && p.auth && p.auth.hash);
    },

    register: function (name, password) {
      if (!subtleOk()) return Promise.reject(new Error("no-subtle"));
      if (String(password || "").length < 4) return Promise.reject(new Error("short"));
      if (sbAuth.has(name)) return Promise.reject(new Error("exists"));
      var salt = randomSaltHex();
      return derive(password, salt).then(function (hash) {
        var prof = sbProfiles.findByEmail(emailOf(name)) || sbProfiles.create(name, emailOf(name));
        var list = readProfiles(), i;
        for (i = 0; i < list.length; i++) {
          if (list[i].id === prof.id) {
            list[i].auth = { algo: "PBKDF2-SHA256", iterations: AUTH_ITER, salt: salt, hash: hash };
            list[i].name = String(name).slice(0, 30);
          }
        }
        writeProfiles(list);
        return sbProfiles.findByEmail(emailOf(name));
      });
    },

    verify: function (name, password) {
      var p = sbProfiles.findByEmail(emailOf(name));
      if (!p || !p.auth || !p.auth.hash) return Promise.resolve(false);
      if (!subtleOk()) return Promise.resolve(false);
      return derive(password, p.auth.salt).then(function (hash) {
        return sameSecret(hash, p.auth.hash);
      });
    },

    profileOf: function (name) { return sbProfiles.findByEmail(emailOf(name)); }
  };
  window.sbAuth = sbAuth;

  /* ------------------------------- 5. profile key enumerator §1.4 (canonical) */
  function enumerateProfileKeys(profileId) {
    var out = {};
    var keys = lsKeys(), i, k;
    if (profileId === "local") {
      for (i = 0; i < keys.length; i++) {
        k = keys[i];
        if (k.indexOf("sysbaby.") !== 0) continue;
        if (k.indexOf(PROFILE_PREFIX) === 0) continue;
        if (k === "sysbaby.sync.url") continue;
        if (k.indexOf("sysbaby.sync.token::") === 0) continue;
        out[k] = lsGet(k);
      }
    } else {
      var pre = PROFILE_PREFIX + profileId + ".";
      for (i = 0; i < keys.length; i++) {
        k = keys[i];
        if (k.indexOf(pre) === 0) out[k.slice(pre.length)] = lsGet(k);
      }
    }
    return out;
  }
  window.sbProfileKeys = enumerateProfileKeys;

  /* ------------------------------------------------ 6. IndexedDB mirror §1.4 */
  var idbPromise = null;
  function idb() {
    if (window.sbIncognitoActive) return Promise.resolve(null);
    if (idbPromise) return idbPromise;
    idbPromise = new Promise(function (resolve) {
      var req;
      /* Версия 2 (v69): добавлен склад «things» — сами вещи, принесённые в
         Хранилище. Повышение версии перезапускает onupgradeneeded, и он
         создаёт ТОЛЬКО недостающее: прежние accounts и snapshots остаются
         на месте со всем содержимым. */
      try { req = window.indexedDB.open("sysbaby", 2); } catch (e) { resolve(null); return; }
      if (!req) { resolve(null); return; }
      req.onupgradeneeded = function () {
        var db = req.result;
        try { if (!db.objectStoreNames.contains("accounts")) db.createObjectStore("accounts", { keyPath: "id" }); } catch (e) { /* ignore */ }
        try { if (!db.objectStoreNames.contains("snapshots")) db.createObjectStore("snapshots", { keyPath: "profileId" }); } catch (e) { /* ignore */ }
        try { if (!db.objectStoreNames.contains("things")) db.createObjectStore("things", { keyPath: "id" }); } catch (e) { /* ignore */ }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { resolve(null); };
      req.onblocked = function () { resolve(null); };
    }).catch(function () { return null; });
    return idbPromise;
  }

  function idbPut(storeName, value) {
    return idb().then(function (db) {
      if (!db) return false;
      return new Promise(function (resolve) {
        var tx;
        try { tx = db.transaction(storeName, "readwrite"); } catch (e) { resolve(false); return; }
        try { tx.objectStore(storeName).put(value); } catch (e) { resolve(false); return; }
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { resolve(false); };
        tx.onabort = function () { resolve(false); };
      });
    }).catch(function () { return false; });
  }

  function idbGet(storeName, key) {
    return idb().then(function (db) {
      if (!db) return null;
      return new Promise(function (resolve) {
        var tx;
        try { tx = db.transaction(storeName, "readonly"); } catch (e) { resolve(null); return; }
        var rq;
        try { rq = tx.objectStore(storeName).get(key); } catch (e) { resolve(null); return; }
        rq.onsuccess = function () { resolve(rq.result || null); };
        rq.onerror = function () { resolve(null); };
      });
    }).catch(function () { return null; });
  }

  /* ── СКЛАД ВЕЩЕЙ (v69) ────────────────────────────────────────────────────
     ПОВОД — просьба основателя развивать приложения; Совет назвал первым
     пробелом то, что Хранилище умело только текст, набранный в нём самом.

     ПОЧЕМУ ВЕЩЬ НЕ ЛЕЖИТ В ОПИСИ. Дерево Хранилища — один документ JSON,
     который переписывается ЦЕЛИКОМ при каждой правке: переименовали папку —
     записали всё дерево заново. Снимок на четыре мегабайта, положенный в
     дерево, переписывался бы вместе с ним при каждом чихе и упёрся бы в
     квоту localStorage (пять мегабайт на всё) с первой же вещи. Поэтому у
     вещи два места: ЗАПИСЬ о ней (имя, род, размер, номер) — в описи,
     содержимое — здесь, где его никто не переписывает попусту.

     Инкогнито не пишет никуда — это правило старше Хранилища, и idb() уже
     возвращает null. Отказ здесь не молчаливый: put отвечает null, а
     приложение обязано сказать об этом человеку (см. vault-things-check).

     Охраняется tools/vault-things-check.mjs. */
  var THING_SEQ = 0;
  function newThingId() {
    THING_SEQ++;
    return "t" + Date.now().toString(36) + "-" + THING_SEQ.toString(36) +
      "-" + Math.floor(Math.random() * 1679616).toString(36);
  }

  window.sbThings = {
    /* Кладёт вещь на склад и отдаёт её номер. null означает «склада нет»:
       инкогнито, отказ браузера, переполнение. Молчать об этом нельзя. */
    put: function (blob, meta) {
      if (!blob) return Promise.resolve(null);
      var id = newThingId();
      var rec = {
        id: id,
        blob: blob,
        name: (meta && meta.name) || "вещь",
        mime: (meta && meta.mime) || blob.type || "application/octet-stream",
        size: blob.size || 0,
        at: Date.now()
      };
      return idbPut("things", rec).then(function (okFlag) { return okFlag ? id : null; });
    },
    get: function (id) {
      if (!id) return Promise.resolve(null);
      return idbGet("things", id);
    },
    del: function (id) {
      if (!id) return Promise.resolve(false);
      return idb().then(function (db) {
        if (!db) return false;
        return new Promise(function (resolve) {
          var tx;
          try { tx = db.transaction("things", "readwrite"); } catch (e) { resolve(false); return; }
          try { tx.objectStore("things").delete(id); } catch (e) { resolve(false); return; }
          tx.oncomplete = function () { resolve(true); };
          tx.onerror = function () { resolve(false); };
          tx.onabort = function () { resolve(false); };
        });
      }).catch(function () { return false; });
    },
    /* Сколько вещей на складе. Нужно не для красоты: закон проверяет им, что
       выброшенная из описи вещь действительно ушла, а не осталась лежать. */
    count: function () {
      return idb().then(function (db) {
        if (!db) return 0;
        return new Promise(function (resolve) {
          var tx;
          try { tx = db.transaction("things", "readonly"); } catch (e) { resolve(0); return; }
          var rq;
          try { rq = tx.objectStore("things").count(); } catch (e) { resolve(0); return; }
          rq.onsuccess = function () { resolve(rq.result || 0); };
          rq.onerror = function () { resolve(0); };
        });
      }).catch(function () { return 0; });
    }
  };

  function idbPutAccount(rec) {
    if (!rec) return;
    idbPut("accounts", {
      id: rec.id,
      username: rec.name || rec.id,
      email: rec.email || null,
      provider: rec.email ? "password" : "guest",
      createdAt: rec.createdAt || Date.now(),
      lastSeen: Date.now()
    });
  }

  var snapTimer = null;
  function scheduleSnapshot() {
    if (window.sbIncognitoActive) return;
    if (snapTimer) clearTimeout(snapTimer);
    snapTimer = setTimeout(snapshotNow, 1400);
  }
  function snapshotNow() {
    if (window.sbIncognitoActive) return Promise.resolve(false);
    if (snapTimer) { clearTimeout(snapTimer); snapTimer = null; }
    var pid = activeProfile();
    return idbPut("snapshots", { profileId: pid, data: enumerateProfileKeys(pid), updatedAt: Date.now() });
  }
  window.sbSnapshotNow = snapshotNow;
  window.sbReadSnapshot = function (profileId) { return idbGet("snapshots", profileId || activeProfile()); };

  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") { flush(); snapshotNow(); } });
  setTimeout(function () { idbPutAccount(sbProfiles.currentRecord()); snapshotNow(); }, 2500);

  /* ------------------------------------------------ 7. EXPORT / IMPORT §1.5 */
  var DENY_EXACT = ["sysbaby.activeProfile", "sysbaby.profiles.v1", "sysbaby.authed",
    "sysbaby.sync.url", "sysbaby.incognito.pwhash", "sysbaby.incognito.timerPref"];
  var DENY_PREFIX = ["sysbaby.sync.token::", "sysbaby.incognito::", "sysbaby.i18n.cache."];

  function denied(key) {
    if (DENY_EXACT.indexOf(key) !== -1) return true;
    for (var i = 0; i < DENY_PREFIX.length; i++) if (key.indexOf(DENY_PREFIX[i]) === 0) return true;
    return false;
  }

  function buildExport(profileId) {
    var pid = profileId || activeProfile();
    var all = enumerateProfileKeys(pid), keys = {}, k;
    for (k in all) if (Object.prototype.hasOwnProperty.call(all, k) && !denied(k) && all[k] != null) keys[k] = all[k];
    var rec = null, list = readProfiles(), i;
    for (i = 0; i < list.length; i++) if (list[i].id === pid) rec = list[i];
    return {
      app: "sysbaby-os",
      version: 1,
      createdAt: new Date().toISOString(),
      profile: { id: pid, name: (rec && rec.name) || "This computer", email: (rec && rec.email) || null },
      keys: keys
    };
  }
  window.sbExportProfile = buildExport;

  window.sbExportFileName = function (profileId) {
    var env = buildExport(profileId);
    var name = String(env.profile.name || "profile").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "profile";
    return "sysbaby-profile-" + name + "-" + env.createdAt.slice(0, 10) + ".json";
  };

  window.sbDownloadExport = function (profileId) {
    var env = buildExport(profileId);
    var name = window.sbExportFileName(profileId);
    try {
      var blob = new Blob([JSON.stringify(env, null, 2)], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 400);
      return { ok: true, name: name, count: Object.keys(env.keys).length };
    } catch (e) {
      if (window.console) console.error("[sbDB] export failed", e);
      return { ok: false, error: "Could not create the export file in this browser." };
    }
  };

  function validateEnvelope(input) {
    var env = input;
    if (typeof input === "string") {
      try { env = JSON.parse(input); } catch (e) { return { ok: false, error: "That file isn't valid JSON." }; }
    }
    if (!env || typeof env !== "object" || Array.isArray(env)) return { ok: false, error: "That file isn't a sys.baby export." };
    if (env.app !== "sysbaby-os") return { ok: false, error: "That file isn't a sys.baby export." };
    var v = Number(env.version);
    if (!(v >= 1)) return { ok: false, error: "That export has no readable version." };
    if (v > 1) return { ok: false, error: "That export was made by a newer version of sys.baby (v" + env.version + ")." };
    if (!env.keys || typeof env.keys !== "object" || Array.isArray(env.keys)) return { ok: false, error: "That export has no keys to restore." };
    var k;
    for (k in env.keys) {
      if (!Object.prototype.hasOwnProperty.call(env.keys, k)) continue;
      if (k.indexOf("sysbaby.") !== 0) return { ok: false, error: "That export contains a key that isn't ours: " + k };
      if (typeof env.keys[k] !== "string") return { ok: false, error: "Key " + k + " is not stored as text." };
    }
    return { ok: true, env: env };
  }
  window.sbValidateImport = validateEnvelope;

  /* sbImportProfile(fileTextOrObject, {mode:"replace"|"merge", profileId, reload:true})
     → {ok:true, count, mode} | {ok:false, error} — never partially imports. */
  window.sbImportProfile = function (input, opts) {
    opts = opts || {};
    var check = validateEnvelope(input);
    if (!check.ok) return check;
    var env = check.env;
    var pid = opts.profileId || activeProfile();
    var mode = opts.mode === "merge" ? "merge" : "replace";
    var incoming = env.keys, k;

    try {
      if (mode === "replace") {
        var existing = enumerateProfileKeys(pid);
        for (k in existing) {
          if (!Object.prototype.hasOwnProperty.call(existing, k)) continue;
          if (denied(k)) continue;         /* device/session machinery survives a restore */
          lsDel(nsKeyFor(pid, k));
        }
      }
      var count = 0;
      for (k in incoming) {
        if (!Object.prototype.hasOwnProperty.call(incoming, k)) continue;
        if (denied(k)) continue;
        if (!lsSet(nsKeyFor(pid, k), incoming[k])) return { ok: false, error: "Storage is full — nothing was changed after key " + k + "." };
        count++;
      }
      cache.clear(); dirty.clear();
      if (opts.reload !== false) setTimeout(function () { location.reload(); }, 60);
      return { ok: true, count: count, mode: mode, profileId: pid };
    } catch (e) {
      return { ok: false, error: "Import failed: " + (e && e.message ? e.message : "unknown error") };
    }
  };

  /* Optional recovery source: this browser's last IndexedDB snapshot (§1.4). */
  window.sbImportFromSnapshot = function (profileId, opts) {
    return window.sbReadSnapshot(profileId).then(function (snap) {
      if (!snap || !snap.data) return { ok: false, error: "No snapshot stored in this browser." };
      var env = { app: "sysbaby-os", version: 1, createdAt: new Date(snap.updatedAt || Date.now()).toISOString(),
        profile: { id: snap.profileId, name: "Snapshot", email: null }, keys: {} };
      var k;
      for (k in snap.data) if (Object.prototype.hasOwnProperty.call(snap.data, k) && typeof snap.data[k] === "string" && !denied(k)) env.keys[k] = snap.data[k];
      return window.sbImportProfile(env, opts || {});
    });
  };

  /* --------------------------------------------- 8. shared notes store §1.6 */
  var NOTES_KEY = "sysbaby.notes.v2";
  var NOTES_LEGACY = "sysbaby.widget.notes";

  function readAll() {
    var raw = sbDB.get(NOTES_KEY), list = null;
    if (raw) { try { list = JSON.parse(raw); } catch (e) { list = null; } }
    if (!Array.isArray(list)) list = null;
    if (list) return list;
    /* legacy migration (once): single-string note → one v2 record */
    var legacy = sbDB.get(NOTES_LEGACY);
    if (legacy && String(legacy).trim()) {
      var migrated = [{ id: uid(), text: String(legacy), pinned: false, updatedAt: Date.now() }];
      if (writeAll(migrated)) {
        /* verified write → remove the predecessor key (ARCHITECTURE §3) */
        if (sbDB.get(NOTES_KEY)) sbDB.remove(NOTES_LEGACY);
      }
      return migrated;
    }
    return [];
  }

  function writeAll(list) {
    var json;
    try { json = JSON.stringify(list); } catch (e) { return false; }
    sbDB.set(NOTES_KEY, json);
    return sbDB.get(NOTES_KEY) === json;
  }

  function uid() { return "n" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  function noteSaveFailed() {
    if (typeof window.showToast === "function") {
      window.showToast("Couldn't save note", "Storage may be full or restricted in this browser.", "", true, "toast-warn", "event");
    } else { surfaceStorageFailure(); }
  }

  var sbNotesStore = {
    uid: uid,
    load: function () { return readAll().filter(function (n) { return !n.deletedAt; }); },
    loadDeleted: function () { return readAll().filter(function (n) { return !!n.deletedAt; }); },
    /* CRITICAL: merge back stored soft-deleted records missing from `list` */
    save: function (list) {
      var incoming = Array.isArray(list) ? list.slice() : [];
      var seen = Object.create(null), i;
      for (i = 0; i < incoming.length; i++) if (incoming[i] && incoming[i].id) seen[incoming[i].id] = true;
      var stored = readAll();
      for (i = 0; i < stored.length; i++) {
        if (stored[i] && stored[i].deletedAt && !seen[stored[i].id]) incoming.push(stored[i]);
      }
      var ok = writeAll(incoming);
      if (!ok) { if (window.console) console.error("[sbNotesStore] save failed"); noteSaveFailed(); }
      return ok;
    },
    notify: function () {
      try { document.dispatchEvent(new CustomEvent("sysbaby:notes-changed")); } catch (e) { /* ignore */ }
    },
    onChange: function (fn) {
      if (typeof fn !== "function") return;
      document.addEventListener("sysbaby:notes-changed", function () { try { fn(); } catch (e) { if (window.console) console.error(e); } });
    },
    softDelete: function (id) {
      var all = readAll(), i, hit = false;
      for (i = 0; i < all.length; i++) if (all[i].id === id && !all[i].deletedAt) { all[i].deletedAt = Date.now(); hit = true; }
      if (hit) { writeAll(all); sbNotesStore.notify(); }
      return hit;
    },
    restore: function (id) {
      var all = readAll(), i, hit = false;
      for (i = 0; i < all.length; i++) if (all[i].id === id && all[i].deletedAt) { delete all[i].deletedAt; hit = true; }
      if (hit) { writeAll(all); sbNotesStore.notify(); }
      return hit;
    },
    purge: function (id) {
      var all = readAll(), next = all.filter(function (n) { return n.id !== id; });
      if (next.length === all.length) return false;
      writeAll(next); sbNotesStore.notify(); return true;
    },
    purgeAllDeleted: function () {
      var all = readAll(), next = all.filter(function (n) { return !n.deletedAt; });
      writeAll(next); sbNotesStore.notify(); return all.length - next.length;
    }
  };
  window.sbNotesStore = sbNotesStore;

  /* Shell owns quick-note creation (FIX §11.2) — returns the new note id. */
  window.sbAddQuickNote = function (text, extra) {
    var body = String(text == null ? "" : text);
    var rec = { id: uid(), text: body, pinned: false, updatedAt: Date.now() };
    if (extra && typeof extra === "object") { for (var k in extra) if (Object.prototype.hasOwnProperty.call(extra, k)) rec[k] = extra[k]; }
    var live = sbNotesStore.load();
    live.unshift(rec);
    sbNotesStore.save(live);
    sbNotesStore.notify();
    if (window.sbBus && window.sbBus.emit) window.sbBus.emit("note:added", { preview: body.slice(0, 80) });
    return rec.id;
  };

  /* Positions are CSS PIXELS (unit discipline §11.2). */
  window.sbPersistNotePosition = function (id, x, y) {
    var all = readAll(), i, hit = false;
    for (i = 0; i < all.length; i++) {
      if (all[i].id === id) { all[i].x = Math.round(x); all[i].y = Math.round(y); all[i].onDesktop = true; hit = true; }
    }
    if (hit) writeAll(all);
    return hit;
  };
})();
