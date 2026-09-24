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

  /* ── ПЕРЕЧИСЛЕНИЕ ТОЖЕ ПРОХОДИТ ЧЕРЕЗ ЗАМОК · решение D-172 ────────────────
     Замок стоит на границе Storage: чтение и запись он перехватывает (D-164).
     А ПЕРЕЧИСЛЕНИЕ — нет: localStorage.key() отдаёт то, что лежит на диске, а
     там при запертом замке лежат конверты sysbaby.v.<хеш>, и настоящих имён
     не видно ВООБЩЕ — в этом и был смысл (D-166).
     Дефект нашёл закон копий: выгрузка профиля, сделанная при стоящем замке,
     возвращалась БЕЗ ЗАМЕТОК. Она перечисляла диск, находила там конверты и
     не находила ни одного знакомого имени. То есть и кнопка «выгрузить
     профиль», и копии в папку сохраняли ПУСТОТУ — молча.
     Лечение здесь, в единственном месте, где система вообще перечисляет
     ключи: пока замок открыт, имена берутся из памяти, где они настоящие.
     Диск при этом остаётся тем же — конвертами. */
  function lsKeys() {
    var out = [], seen = {};
    try {
      var n = window.localStorage.length;
      for (var i = 0; i < n; i++) {
        var k = window.localStorage.key(i);
        if (k == null) continue;
        if (k.indexOf("sysbaby.v.") === 0) continue;      /* конверт — не имя */
        if (!seen[k]) { seen[k] = 1; out.push(k); }
      }
    } catch (e) { /* storage blocked — treated as empty (§10 amnesiac session) */ }
    try {
      if (window.sbVault && window.sbVault.isOpen() && typeof vaultOpenNames === "function") {
        var mine = vaultOpenNames(), j;
        for (j = 0; j < mine.length; j++) if (!seen[mine[j]]) { seen[mine[j]] = 1; out.push(mine[j]); }
      }
    } catch (e) { /* ignore */ }
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
      /* ── ЗДЕСЬ БЫЛА ВТОРАЯ ДВЕРЬ (D-166) ──────────────────────────────
         Стояла проверка «если замок открыт — запечатать отдельно», из первой
         редакции D-161, когда замок жил НАД хранилищем. С D-164 замок стоит
         на самой границе Storage, и эта строка стала не просто лишней, а
         вредной: она уводила запись мимо единственной двери — и звала
         функцию, которой после переделки уже не существовало. Закон поймал
         это первым же прогоном («persistSealed is not defined»).
         Замок один, дверь одна: lsSet ниже сам решит, что уходит конвертом. */
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
    nsKey: nsKey,
    /* ── ЭПОХА ХРАНИЛИЩА (D-274) ─────────────────────────────────────────
       ПОВОД, дословно от основателя 24.09.2026: «открываю сундук, перезахожу
       в свою же систему и у меня снова открытие сундуков начинается с самого
       начала... я уже говорил об этом».
       Пока замок заперт и не открыт, защищённое не читается: хранилище
       отвечает «ничего» — и это не «данных нет», а «данные за дверью».
       Комната, которая держит у себя копию памяти, снятую в эту минуту,
       держала пустоту и после двери — и следующей записью клала её поверх
       настоящей. Эпоха — число, которое меняется, когда меняется ВЕСЬ
       видимый мир разом: замок открыли, заперли, сняли. Всякая копия памяти
       помнит свою эпоху и перечитывается, когда эпоха другая; пока closed(),
       пустоту не запоминает вовсе. Охраняется tools/lock-memory-check.mjs. */
    epoch: function () { return readEpoch; },
    closed: function () { return vaultLocked() && !vaultOpen; }
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
      /* Версия 3 (D-172): добавлен склад «handles» — разрешение на настоящую
         папку для резервных копий. Хранить его больше негде: указатель на
         папку не строка и в localStorage не ложится. */
      try { req = window.indexedDB.open("sysbaby", 3); } catch (e) { resolve(null); return; }
      if (!req) { resolve(null); return; }
      req.onupgradeneeded = function () {
        var db = req.result;
        try { if (!db.objectStoreNames.contains("accounts")) db.createObjectStore("accounts", { keyPath: "id" }); } catch (e) { /* ignore */ }
        try { if (!db.objectStoreNames.contains("snapshots")) db.createObjectStore("snapshots", { keyPath: "profileId" }); } catch (e) { /* ignore */ }
        try { if (!db.objectStoreNames.contains("things")) db.createObjectStore("things", { keyPath: "id" }); } catch (e) { /* ignore */ }
        try { if (!db.objectStoreNames.contains("handles")) db.createObjectStore("handles", { keyPath: "id" }); } catch (e) { /* ignore */ }
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
        /* ОТКАТ: вещь без имени и рода всё равно принимается — имя «вещь» и род
           из самого Blob, а не отказ; иначе файл без расширения терялся бы. */
        name: (meta && meta.name) || "вещь",
        mime: (meta && meta.mime) || blob.type || "application/octet-stream",
        size: blob.size || 0,
        at: Date.now()
      };
      /* ── ПОД ЗАМКОМ ВЕЩЬ ЛОЖИТСЯ КОНВЕРТОМ (D-265) ─────────────────────
         Замок стоит — склад принимает только запечатанное; замок стоит, а
         сеанс не открыт — не принимает ничего: ключа нет, а открытым класть
         нельзя. Имя, род и размер уходят ВНУТРЬ конверта вместе с байтами. */
      if (vaultLocked()) {
        if (!vaultOpen || !vaultKeys) return Promise.resolve(null);
        return thingToSealed(vaultKeys, rec).then(function (sealed) {
          return idbPut("things", sealed);
        }).then(function (okFlag) { return okFlag ? id : null; }, function () { return null; });
      }
      return idbPut("things", rec).then(function (okFlag) { return okFlag ? id : null; });
    },
    get: function (id) {
      if (!id) return Promise.resolve(null);
      return idbGet("things", id).then(function (rec) {
        if (!rec || !rec.sealed) return rec;
        /* Запечатанная вещь отдаётся только открытому сеансу, и только тому
           миру, чьим ключом она запечатана: чужой мир получает «нет вещи». */
        if (!vaultOpen || !vaultKeys) return null;
        return thingFromSealed(vaultKeys, rec).then(null, function () { return null; });
      });
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
    /* Под замком зеркало аккаунта не знает о человеке ничего, кроме номера
       места: имя и почта — сведения о человеке ровно так же, как записи (D-265). */
    if (vaultLocked()) { idbPut("accounts", { id: rec.id }); return; }
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
    return idbPut("snapshots", { profileId: pid, data: diskSafe(enumerateProfileKeys(pid)), updatedAt: Date.now() });
  }
  /* ── СНИМОК НЕ ВЫНОСИТ ПАМЯТЬ СЕАНСА НА ДИСК (D-265) ───────────────────
     Снимок профиля пишется, пока система работает, — то есть пока всё
     расшифровано в памяти. Прежняя редакция клала в IndexedDB ровно эту
     память: записи, письма, профиль — открытым текстом, рядом с замком,
     который их якобы прятал. При стоящем замке защищённое в снимок не идёт
     вовсе: снимок запертой системы несёт только то, что и так лежит
     открытым, — сам замок и два служебных ключа. */
  function diskSafe(data) {
    if (!vaultLocked() || !data) return data;
    var out = {}, k;
    for (k in data) if (Object.prototype.hasOwnProperty.call(data, k) && !isProtectedKey(k)) out[k] = data[k];
    return out;
  }
  function idbAll(storeName) {
    return idb().then(function (db) {
      if (!db) return [];
      return new Promise(function (resolve) {
        var tx, rq;
        try { tx = db.transaction(storeName, "readonly"); rq = tx.objectStore(storeName).getAll(); } catch (e) { resolve([]); return; }
        rq.onsuccess = function () { resolve(rq.result || []); };
        rq.onerror = function () { resolve([]); };
      });
    }).catch(function () { return []; });
  }
  function idbDel(storeName, key) {
    return idb().then(function (db) {
      if (!db) return false;
      return new Promise(function (resolve) {
        var tx;
        try { tx = db.transaction(storeName, "readwrite"); tx.objectStore(storeName).delete(key); } catch (e) { resolve(false); return; }
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { resolve(false); };
        tx.onabort = function () { resolve(false); };
      });
    }).catch(function () { return false; });
  }
  /* ── СТАРЫЕ УТЕЧКИ ВЫЧИЩАЮТСЯ БЕЗ ПРОСЬБЫ (D-265) ───────────────────────
     Прежние выпуски успели записать открытые снимки и имя в зеркало аккаунта
     на дисках людей. Запертая система вычищает это сама — при загрузке, до
     пароля, и сразу после поворота ключа. Вычищается только открытое:
     снимок остаётся снимком, зеркало — номером места. */
  function purgeDiskLeaks() {
    if (!vaultLocked()) return Promise.resolve(false);
    return idbAll("snapshots").then(function (list) {
      return Promise.all(list.map(function (snap) {
        if (!snap || !snap.data) return null;
        var clean = diskSafe(snap.data);
        if (Object.keys(clean).length === Object.keys(snap.data).length) return null;
        return idbPut("snapshots", { profileId: snap.profileId, data: clean, updatedAt: snap.updatedAt });
      }));
    }).then(function () {
      return idbAll("accounts");
    }).then(function (list) {
      return Promise.all(list.map(function (a) {
        if (!a || Object.keys(a).length <= 1) return null;
        return idbPut("accounts", { id: a.id });
      }));
    }).then(function () { return true; });
  }
  window.sbSnapshotNow = snapshotNow;
  window.sbReadSnapshot = function (profileId) { return idbGet("snapshots", profileId || activeProfile()); };

  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") { flush(); snapshotNow(); } });
  setTimeout(function () { idbPutAccount(sbProfiles.currentRecord()); snapshotNow(); }, 2500);
  /* Чистка — сразу, а не через две с половиной секунды: закрытую вкладку
     могут открыть и тут же закрыть, и открытый снимок пролежал бы ещё раз. */
  setTimeout(function () { purgeDiskLeaks(); }, 0);

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
  /* Склад отдан наружу: синхронизация копий (sync.js) хранит в нём указатель
     на настоящую папку. Свой второй indexedDB.open был бы вторым знанием об
     одном хранилище — а с ним и вторая версия схемы, и расхождение. */
  window.sbIdb = { put: idbPut, get: idbGet };

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

  /* ═══════════════════ ЗАМОК · решения D-161, D-164, D-166 ════════════════
     ПОВОД. Основатель давно просил «шифрование в одно нажатие». Выше, в
     разделе входа, стоит честное признание, что этого НЕТ: «пароль решает,
     КТО ВОШЁЛ, а не кто может прочитать файлы… Обещать иное значило бы
     продавать ложное чувство безопасности». Это — то самое обещание, которое
     там отказывались дать, и теперь его можно дать.

     ЧТО ЗАКРЫВАЕТСЯ (D-164, поправка основателя: «абсолютно все данные должны
     быть не видны!»). Не «написанное», а ВСЁ. Список перевёрнут: не «что
     запирать», а «что нельзя запереть». В открытом виде остаются три ключа,
     и каждый назван с причиной:
       · sysbaby.lock.v1       — сам замок: в нём соль, без неё ключ не вывести;
       · sysbaby.activeProfile — какую дверь открывать;
       · sysbaby.authed        — прошёл ли человек вход; это «да/нет».
     Всё остальное под именем sysbaby. — в конверт, включая ключи завтрашних
     приложений: список НЕЛЬЗЯ-запирать закрыт, и новое попадает под замок
     само, без единой правки.

     ЧТО ИМЕННО ПРОИСХОДИТ (D-166, дословно от основателя 27.08.2026: «чтобы
     была зашифрована абсолютно вся информация профиля, чтобы не возможно было
     вообще ничего увидеть. и шифровку делайте уровня signal и выше. пускай их
     будет несколько, но с одним паролем»).

     ОДИН ПАРОЛЬ — ПЯТЬ КЛЮЧЕЙ. Пароль не шифрует ничего сам. Он проходит
     ДВЕ разные растяжки подряд (это и есть «пускай их будет несколько»):
       PBKDF2-HMAC-SHA-512, 210 000 проходов  → 512 бит
       PBKDF2-HMAC-SHA-256, 600 000 проходов  → 256 бит
     Оба числа не выдуманы: это рекомендации OWASP Password Storage Cheat
     Sheet для соответствующих хешей. ЗАМЕРЕНО в этом браузере: 245 мс и
     272 мс, вместе ~0.52 с; на телефоне втрое-впятеро дольше. Прежний замок
     стоил 83 мс — цена выросла вшестеро, и это цена за угадывание пароля
     чужими руками, а не за наш сеанс: ключ выводится один раз на открытие.

     Полученный ключ (KEK) НЕ шифрует данные. Он открывает конверт с
     МАСТЕР-КЛЮЧОМ — 32 случайными байтами, которые не выводятся ни из чего.
     Из мастер-ключа по HKDF-SHA-256 расходятся четыре разных ключа: для
     первого шифра, для второго, для подписи и для имён. Смена пароля поэтому
     не требует перешифровывать данные — переклеивается один конверт.

     ДВА ШИФРА ПОДРЯД, НЕ ОДИН:
       слой 1: AES-256-CTR
       слой 2: AES-256-GCM поверх первого
       подпись: HMAC-SHA-512 поверх всего конверта (encrypt-then-MAC)
     Пробитый один шифр не отдаёт ничего: под ним лежит второй, на
     независимом ключе. Подпись проверяется ДО расшифровки — испорченный или
     подложенный конверт не доходит до расшифровщика вовсе.

     ДЛИНА ТОЖЕ ПРЯЧЕТСЯ. Открытый текст добивается нулями до кратности 256
     байт. Иначе по размеру конверта видно, сколько человек написал, — а это
     сведения о человеке ровно так же, как и сами слова.

     ИМЕНИ КЛЮЧА НА ДИСКЕ НЕТ. Раньше в хранилище стояли sysbaby.notes.v2,
     sysbaby.mail.threads — то есть посторонний видел, чем человек пользуется
     и сколько у него всего. Теперь запись лежит под именем
     sysbaby.v.<HMAC-SHA-256 от имени>, а настоящее имя — ВНУТРИ конверта,
     под обоими шифрами. «Не видно вообще ничего» — значит и этого.

     ЧЕГО ЗДЕСЬ НЕТ, И ЭТО СКАЗАНО ЧЕЛОВЕКУ ДО ПОВОРОТА КЛЮЧА:
       · восстановления пароля нет У ДРУГИХ: сервера нет, копии ни у кого.
         Есть свой код восстановления на бумаге (D-266) — запасная дверь,
         которая выводит ключ, а не проверяет;
       · пока система открыта в этой вкладке, слова лежат в памяти
         расшифрованными. Замок бережёт ПОКОЙ, а не работающий сеанс;
       · растяжка пароля здесь НЕ памятно-твёрдая. Signal на телефоне берёт
         Argon2; в браузере без внешнего кода такого примитива нет, а писать
         свой Совет не станет — самодельная криптография хуже честной цены.
         Сказано прямо: по числу проходов мы выше обычного, по сопротивлению
         видеокарте — нет. Обещать «уровень Signal» целиком было бы той же
         ложью, от которой предостерегает раздел входа.

     Охраняется tools/vault-lock-check.mjs и tools/vault-cascade-check.mjs.
     ═══════════════════════════════════════════════════════════════════════ */
  var LOCK_KEY = "sysbaby.lock.v1";
  var SEAL_PFX = "sysbaby.v.";        /* под этим именем лежат конверты */
  /* ── ЦЕНА ВЫВОДА КЛЮЧА, И ЭТО ЕДИНСТВЕННОЕ ИЗМЕРИМОЕ МЕСТО (D-205) ───────
   Основатель требовал «в десять раз сильнее Signal». У ШИФРА такой величины
   нет: AES-256 уже за пределами перебора, и умножать невозможность бессмысленно.
   А вот у РАСТЯЖКИ ПАРОЛЯ она есть и меряется секундомером: во сколько раз
   дороже обходится злоумышленнику одна попытка подбора.
   Опорой взят не Signal и не наше вчера, а рекомендация OWASP на 2026 год —
   PBKDF2-HMAC-SHA-256, 600 000 проходов. Наша цепочка обязана стоить НЕ МЕНЬШЕ
   ДЕСЯТИ таких, и это не заявление в рекламе, а измерение: закон
   tools/kdf-cost-check.mjs считает эталон на той же машине в ту же минуту и
   сравнивает. На чужом железе число тоже сойдётся — меряется отношение.
   ЦЕНА НАЗВАНА: открытие занимает секунды, а на медленном телефоне —
   до десятка. Платится один раз за сеанс, а не на каждое чтение. */
var KDF1_ITER = 1500000;             /* PBKDF2-HMAC-SHA-512 — OWASP */
  /* ── ТРЕТИЙ ПРОХОД — ПАМЯТЬ (D-275) ──────────────────────────────────────
     Argon2id после двух PBKDF2: каждой попытке подобрать слово нужны 64 МиБ
     своей памяти, трижды пройденной (подробно — шапка core/argon2.js).
     ПОСТОЯННАЯ: m = 65536 КиБ, t = 3, p = 1 — второй рекомендованный набор
     RFC 9106 (m = 2^16, t = 3); одна дорожка, потому что JS считает её одним
     потоком, а работа та же. Замер на столе: около секунды на попытку. */
  var A2_M = 65536, A2_T = 3, A2_P = 1;
  var KDF2_ITER = 8000000;             /* PBKDF2-HMAC-SHA-256 — OWASP */
  var PAD_BLOCK = 256;                /* длина прячется: конверт кратен блоку */
  var VAULT_ITER = KDF2_ITER;         /* прежнее имя — для старых записей v1 */

  var VAULT_NEVER = ["sysbaby.lock.v1", "sysbaby.activeProfile", "sysbaby.authed"];
  function isProtectedKey(k) {
    var key = String(k || "");
    if (key.indexOf("sysbaby.") !== 0) return false;
    /* Конверт — не предмет для запирания, он сам и есть запертое. */
    if (key.indexOf(SEAL_PFX) === 0) return false;
    return VAULT_NEVER.indexOf(key) === -1;
  }
  /* Ключи, которые СЕЙЧАС лежат в хранилище открытыми и подлежат замку.
     Спрашивается у самого хранилища, а не у списка: система пишет и то, о чём
     этот файл не знает (приложения заводят свои ключи), и оставить их
     открытыми значило бы оставить дыру ровно того размера, что и незнание. */
  function protectedKeysNow() {
    var out = [], i, k;
    try {
      for (i = 0; i < localStorage.length; i++) {
        k = localStorage.key(i);
        if (k && isProtectedKey(k)) out.push(k);
      }
    } catch (e) { /* хранилище закрыто — запирать нечего */ }
    return out;
  }
  /* Имена конвертов, лежащих на диске. */
  function sealedNamesNow() {
    var out = [], i, k;
    try {
      for (i = 0; i < localStorage.length; i++) {
        k = localStorage.key(i);
        if (k && k.indexOf(SEAL_PFX) === 0) out.push(k);
      }
    } catch (e) { /* ignore */ }
    return out;
  }

  /* Эпоха хранилища (D-274): см. sbDB.epoch. Меняется в одном месте — здесь. */
  var readEpoch = 1;
  function bumpEpoch(why) {
    readEpoch++;
    if (window.sbBus && window.sbBus.emit) window.sbBus.emit("store:epoch", { epoch: readEpoch, why: why });
  }
  var vaultKeys = null;         /* набор ключей сеанса — только в памяти */
  var vaultMaster = null;       /* мастер-ключ сеанса: нужен для смены пароля */
  /* Через какую дверь вошли. НАРУЖУ НЕ ОТДАЁТСЯ НИКОГДА: система,
     умеющая ответить «ты в тревожном мире», не защищает ни от кого. */
  var vaultDoor = -1;
  var vaultOpen = false;

  function vaultAvailable() { return subtleOk(); }
  function lockRecord() {
    try { return JSON.parse(lsGet(LOCK_KEY) || "null"); } catch (e) { return null; }
  }
  function vaultLocked() { return !!lockRecord(); }

  function b64(buf) {
    var b = new Uint8Array(buf), s = "", i;
    for (i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
    return btoa(s);
  }
  function unb64(str) {
    var s = atob(String(str)), a = new Uint8Array(s.length), i;
    for (i = 0; i < s.length; i++) a[i] = s.charCodeAt(i);
    return a;
  }
  function b64url(buf) {
    return b64(buf).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function cat() {
    var n = 0, i, off = 0;
    for (i = 0; i < arguments.length; i++) n += arguments[i].length;
    var out = new Uint8Array(n);
    for (i = 0; i < arguments.length; i++) { out.set(arguments[i], off); off += arguments[i].length; }
    return out;
  }

  /* ── ПАРОЛЬ → KEK: две растяжки подряд, одна за другой ─────────────────── */
  /* Проходы приходят ДОВОДОМ, а не берутся из констант: замок, запертый
     прежней ценой, обязан открываться прежней ценой. Иначе всякое усиление
     растяжки стирало бы людям хранилище. */
  /* ── ВТОРОЙ КЛЮЧ ВХОДИТ В ВЫВОД, А НЕ ПРОВЕРЯЕТСЯ ОТДЕЛЬНО (D-215) ──────
     Самая частая ошибка «двухфакторных» хранилищ: второй фактор проверяют, а
     ключ выводят по-прежнему из одного пароля. Тогда второй фактор — вахтёр:
     он останавливает того, кто идёт через дверь, и ничего не значит для того,
     у кого диск в руках. Здесь второй ключ ВХОДИТ В САМ ВЫВОД: без его байтов
     из пароля не получается тот KEK, и обходить нечего — нечего обходить.
     Приём стандартный, не самодельный: извлечение HKDF, где солью служит
     тайна второго ключа (RFC 5869, шаг extract). */
  /* Сегодняшняя цена памяти — если растяжка памятью на этом устройстве есть.
     Без неё новый замок делается прежней ценой, и это видно в его записи. */
  function todayA2() {
    return (window.sbArgon2 && typeof window.sbArgon2.hash === "function") ? { m: A2_M, t: A2_T, p: A2_P } : null;
  }
  function a2Label(a2) { return "ARGON2ID:m=" + a2.m + ",t=" + a2.t + ",p=" + a2.p; }
  function a2Parse(s) {
    var m = /^ARGON2ID:m=(\d+),t=(\d+),p=(\d+)$/.exec(String(s || ""));
    return m ? { m: parseInt(m[1], 10), t: parseInt(m[2], 10), p: parseInt(m[3], 10) } : null;
  }
  function deriveKEK(password, saltB64, it1, it2, fsec, a2) {
    var n1 = it1 || KDF1_ITER, n2 = it2 || KDF2_ITER;
    var enc = new TextEncoder();
    var salt = unb64(saltB64);
    var subtle = window.crypto.subtle;
    return subtle.importKey("raw", enc.encode(String(password)), { name: "PBKDF2" }, false, ["deriveBits"])
      .then(function (base) {
        return subtle.deriveBits({ name: "PBKDF2", salt: salt, iterations: n1, hash: "SHA-512" }, base, 512);
      })
      .then(function (bits) {
        return subtle.importKey("raw", bits, { name: "PBKDF2" }, false, ["deriveBits"]);
      })
      .then(function (mid) {
        /* Вторая соль — та же соль с меткой: иначе два прохода склеились бы
           в один длинный, и второй ничего бы не добавил. */
        return subtle.deriveBits({
          name: "PBKDF2", salt: cat(salt, enc.encode("sys.baby/kek/v2")),
          iterations: n2, hash: "SHA-256"
        }, mid, 256);
      })
      .then(function (bits) {
        /* Третий проход — память (D-275). Вход — итог PBKDF2, соль — та же с
           третьей меткой: три прохода не склеиваются ни в один. У замка без
           этого прохода в записи его нет, и он открывается прежней ценой. */
        if (!a2) return bits;
        if (!window.sbArgon2) return Promise.reject(new Error("no-argon2"));
        return window.sbArgon2.hash(new Uint8Array(bits), cat(salt, enc.encode("sys.baby/kek/v3")),
          { m: a2.m, t: a2.t, p: a2.p, tagLength: 32 });
      })
      .then(function (bits) {
        if (!fsec) return subtle.importKey("raw", bits, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
        return subtle.importKey("raw", fsec, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
          .then(function (hk) { return subtle.sign("HMAC", hk, bits); })
          .then(function (prk) {
            return subtle.importKey("raw", prk, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
          });
      });
  }

  /* Тайна второго ключа — это НЕ сам файл: SHA-256 от его байтов вместе с
     солью ЭТОГО замка. Один и тот же файл у двух хранилищ даёт разные тайны,
     а на диске не лежит ничего, по чему файл можно было бы узнать. */
  function factorSecret(fileBytes, saltB64) {
    var body = new Uint8Array(fileBytes || new Uint8Array(0));
    var salt = unb64(saltB64);
    return window.crypto.subtle.digest("SHA-256", cat(body, salt))
      .then(function (d) { return new Uint8Array(d); });
  }
  function factorOf(rec) { return (rec && rec.factor) || null; }

  /* ── КЛЮЧ УСТРОЙСТВА (D-276) ─────────────────────────────────────────────
     ПОВОД, дословно от основателя 24.09.2026: «сделать шифрование ещё более
     невероятным. любыми методами, но самыми сильными и инновационными».
     Самое сильное, что умеет браузер без сервера, — ключ, которого нет ни в
     какой памяти, куда можно заглянуть: секрет живёт в защищённом чипе
     устройства (Secure Enclave, Titan, TPM, ключ-брелок) и отдаёт наружу не
     себя, а ОТВЕТ на наш вопрос — HMAC от нашей соли (расширение WebAuthn
     PRF, оно же hmac-secret в CTAP2). Ответ даётся только после отпечатка,
     лица или PIN самого устройства. Этот ответ входит в ключ двери наравне
     со словом и файлом: без устройства дверь не ВЫВОДИТСЯ — нечего
     проверять, нечего обходить.
     ЧТО НА ДИСКЕ: имя ключа (идентификатор учётки WebAuthn) и соль вопроса.
     Ни ответа, ни его следа. Ответ живёт в памяти сеанса — он нужен, чтобы
     сменить слово или завести тревожное, не прикладывая палец снова, — и
     исчезает вместе со страницей.
     ЧТО ОНО ДАЁТ: украденный диск плюс подсмотренное слово — всё ещё ничего.
     ЧЕГО НЕ ДАЁТ, вслух: потерянное устройство без кода восстановления — это
     потерянный замок; код восстановления открывает главный мир без слова и
     без ключа устройства — и снимает его, как снимает второй ключ.
     Охраняется tools/hardware-key-check.mjs. */
  var hwSecret = null;
  function hwOf(rec) { return (rec && rec.hw) || null; }
  function hwAvailable() {
    return !!(window.isSecureContext && window.PublicKeyCredential && navigator.credentials && navigator.credentials.get);
  }
  function mixFactors(fileSec, hw) {
    if (!hw) return Promise.resolve(fileSec);
    var enc = new TextEncoder();
    var body = cat(enc.encode("sys.baby/factors/v1"), fileSec ? cat(new Uint8Array([1]), new Uint8Array(fileSec)) : new Uint8Array([0]));
    return window.crypto.subtle.digest("SHA-256", cat(body, new Uint8Array(hw))).then(function (d) { return new Uint8Array(d); });
  }
  /* Ответ устройства на этот сеанс; без него — заведомо не тот (32 нуля). */
  function hwNow(rec) {
    if (!hwOf(rec)) return null;
    /* ОТКАТ: устройство не спрошено или не ответило — дверь просто не выведется. */
    return hwSecret || new Uint8Array(32);
  }
  function hwAsk(rec) {
    var h = hwOf(rec);
    if (!h) return Promise.resolve(true);
    if (!hwAvailable()) return Promise.resolve(false);
    var challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);
    var opts = {
      challenge: challenge,
      allowCredentials: [{ type: "public-key", id: unb64(h.id) }],
      userVerification: "required",
      timeout: 120000,
      extensions: { prf: { eval: { first: unb64(h.salt) } } }
    };
    if (h.rp) opts.rpId = h.rp;
    return navigator.credentials.get({ publicKey: opts }).then(function (a) {
      var ext = a && a.getClientExtensionResults ? a.getClientExtensionResults() : null;
      var first = ext && ext.prf && ext.prf.results && ext.prf.results.first;
      if (!first) return false;
      hwSecret = new Uint8Array(first);
      return true;
    }, function () { return false; });
  }
  /* Второй ключ нужен ИЛИ нет — это свойство замка, и оно видно на диске.
     Сказано вслух в окне: посторонний узнаёт, что второй ключ есть; узнать,
     ЧТО ИМЕННО за файл, и тем более обойтись без него он не может. */
  function factorFor(rec, fileBytes) {
    var f = factorOf(rec), filePart;
    if (!f) filePart = Promise.resolve(null);
    else if (!fileBytes) filePart = Promise.resolve(new Uint8Array(32));   /* заведомо не тот */
    else filePart = factorSecret(fileBytes, f.salt);
    /* Ключ устройства входит в ту же тайну, что и файл (D-276). */
    if (!hwOf(rec)) return filePart;
    return filePart.then(function (fs) { return mixFactors(fs, hwNow(rec)); });
  }

  /* ── МАСТЕР-КЛЮЧ → четыре ключа по HKDF ───────────────────────────────── */
  function subkeys(master) {
    var enc = new TextEncoder();
    var subtle = window.crypto.subtle;
    var empty = new Uint8Array(0);
    function d(info, type, uses) {
      return subtle.importKey("raw", master, "HKDF", false, ["deriveKey"]).then(function (m) {
        return subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt: empty, info: enc.encode(info) }, m, type, false, uses);
      });
    }
    return Promise.all([
      d("sys.baby/ctr/v2", { name: "AES-CTR", length: 256 }, ["encrypt", "decrypt"]),
      d("sys.baby/gcm/v2", { name: "AES-GCM", length: 256 }, ["encrypt", "decrypt"]),
      d("sys.baby/mac/v2", { name: "HMAC", hash: "SHA-512", length: 512 }, ["sign", "verify"]),
      d("sys.baby/name/v2", { name: "HMAC", hash: "SHA-256", length: 256 }, ["sign"])
    ]).then(function (k) {
      return { ctr: k[0], gcm: k[1], mac: k[2], name: k[3] };
    });
  }

  /* ── ДЛИНА ПРЯЧЕТСЯ ───────────────────────────────────────────────────── */
  function padBytes(bytes) {
    var total = 4 + bytes.length;
    var n = Math.ceil(total / PAD_BLOCK) * PAD_BLOCK;
    var out = new Uint8Array(n);
    out[0] = (bytes.length >>> 24) & 255;
    out[1] = (bytes.length >>> 16) & 255;
    out[2] = (bytes.length >>> 8) & 255;
    out[3] = bytes.length & 255;
    out.set(bytes, 4);
    return out;
  }
  function unpadBytes(bytes) {
    if (bytes.length < 4) throw new Error("pad");
    var n = ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
    if (n > bytes.length - 4) throw new Error("pad");
    return bytes.subarray(4, 4 + n);
  }

  /* ── ИМЯ КЛЮЧА НА ДИСКЕ ───────────────────────────────────────────────── */
  function sealedName(ks, logical) {
    return window.crypto.subtle.sign("HMAC", ks.name, new TextEncoder().encode(String(logical)))
      .then(function (sig) { return SEAL_PFX + b64url(new Uint8Array(sig).subarray(0, 16)); });
  }

  /* ── КОНВЕРТ: имя и значение под двумя шифрами и подписью ─────────────── */
  function sealPair(ks, name, text) {
    var enc = new TextEncoder();
    var nameBytes = enc.encode(String(name));
    var valBytes = enc.encode(String(text));
    if (nameBytes.length > 65535) return Promise.reject(new Error("name"));
    var head = new Uint8Array(2);
    head[0] = (nameBytes.length >>> 8) & 255;
    head[1] = nameBytes.length & 255;
    var body = padBytes(cat(head, nameBytes, valBytes));
    var ctr = new Uint8Array(16);
    var iv = new Uint8Array(12);
    window.crypto.getRandomValues(ctr);
    window.crypto.getRandomValues(iv);
    var subtle = window.crypto.subtle;
    return subtle.encrypt({ name: "AES-CTR", counter: ctr, length: 64 }, ks.ctr, body)
      .then(function (mid) {
        return subtle.encrypt({ name: "AES-GCM", iv: iv, additionalData: ctr }, ks.gcm, new Uint8Array(mid));
      })
      .then(function (outer) {
        var o = new Uint8Array(outer);
        var signed = cat(new Uint8Array([2]), ctr, iv, o);
        return subtle.sign("HMAC", ks.mac, signed).then(function (tag) {
          return "2." + b64(ctr) + "." + b64(iv) + "." + b64(o) + "." + b64(new Uint8Array(tag));
        });
      });
  }
  function openPair(ks, envelope) {
    var parts = String(envelope || "").split(".");
    if (parts.length !== 5 || parts[0] !== "2") return Promise.reject(new Error("shape"));
    var ctr, iv, o, tag;
    try { ctr = unb64(parts[1]); iv = unb64(parts[2]); o = unb64(parts[3]); tag = unb64(parts[4]); }
    catch (e) { return Promise.reject(new Error("shape")); }
    var subtle = window.crypto.subtle;
    var signed = cat(new Uint8Array([2]), ctr, iv, o);
    /* Подпись — ПЕРВОЙ. Расшифровывать неподписанное значит впускать в
       расшифровщик чужие байты; encrypt-then-MAC затем и придуман. */
    return subtle.verify("HMAC", ks.mac, tag, signed).then(function (good) {
      if (!good) throw new Error("mac");
      return subtle.decrypt({ name: "AES-GCM", iv: iv, additionalData: ctr }, ks.gcm, o);
    }).then(function (mid) {
      return subtle.decrypt({ name: "AES-CTR", counter: ctr, length: 64 }, ks.ctr, new Uint8Array(mid));
    }).then(function (body) {
      var flat = unpadBytes(new Uint8Array(body));
      if (flat.length < 2) throw new Error("shape");
      var nlen = (flat[0] << 8) | flat[1];
      if (nlen > flat.length - 2) throw new Error("shape");
      var dec = new TextDecoder();
      return {
        name: dec.decode(flat.subarray(2, 2 + nlen)),
        value: dec.decode(flat.subarray(2 + nlen))
      };
    });
  }

  /* ── ВЕЩЬ В КОНВЕРТЕ (D-265) ──────────────────────────────────────────
     Те же два шифра и подпись, что у записей (CTR → GCM → HMAC-SHA-512), на
     тех же ключах сеанса; первый байт подписанного — 3, у записей — 2, и
     конверт одного рода нельзя выдать за конверт другого. Внутри — имя,
     род, размер и время вещи, затем её байты; снаружи — только номер.
     Длина прячется кратностью 4 КиБ: у файлов сотни килобайт, и шаг в 256
     байт ничего бы не спрятал, а раздул бы число шагов. */
  var THING_BLOCK = 4096;
  function padTo(bytes, block) {
    var total = 4 + bytes.length;
    var n = Math.ceil(total / block) * block;
    var out = new Uint8Array(n);
    out[0] = (bytes.length >>> 24) & 255;
    out[1] = (bytes.length >>> 16) & 255;
    out[2] = (bytes.length >>> 8) & 255;
    out[3] = bytes.length & 255;
    out.set(bytes, 4);
    return out;
  }
  function blobBytes(blob) {
    if (blob && typeof blob.arrayBuffer === "function") return blob.arrayBuffer().then(function (b) { return new Uint8Array(b); });
    return new Promise(function (resolve, reject) {
      var fr = new FileReader();
      fr.onload = function () { resolve(new Uint8Array(fr.result)); };
      fr.onerror = function () { reject(fr.error); };
      fr.readAsArrayBuffer(blob);
    });
  }
  function sealBytes(ks, meta, bytes) {
    var mb = new TextEncoder().encode(JSON.stringify(meta));
    if (mb.length > 65535) return Promise.reject(new Error("meta"));
    var body = padTo(cat(new Uint8Array([(mb.length >>> 8) & 255, mb.length & 255]), mb, bytes), THING_BLOCK);
    var ctr = new Uint8Array(16), iv = new Uint8Array(12);
    window.crypto.getRandomValues(ctr);
    window.crypto.getRandomValues(iv);
    var subtle = window.crypto.subtle;
    return subtle.encrypt({ name: "AES-CTR", counter: ctr, length: 64 }, ks.ctr, body).then(function (mid) {
      return subtle.encrypt({ name: "AES-GCM", iv: iv, additionalData: ctr }, ks.gcm, new Uint8Array(mid));
    }).then(function (outer) {
      var o = new Uint8Array(outer);
      return subtle.sign("HMAC", ks.mac, cat(new Uint8Array([3]), ctr, iv, o)).then(function (tag) {
        return cat(ctr, iv, o, new Uint8Array(tag));
      });
    });
  }
  function openBytes(ks, box) {
    /* ПОСТОЯННАЯ: 16 — счётчик CTR, 12 — вектор GCM, 64 — подпись
       HMAC-SHA-512; размеры примитивов, а не состав системы. */
    if (!box || box.length < 16 + 12 + 16 + 64) return Promise.reject(new Error("shape"));
    var ctr = box.subarray(0, 16), iv = box.subarray(16, 28);
    var o = box.subarray(28, box.length - 64), tag = box.subarray(box.length - 64);
    var subtle = window.crypto.subtle;
    return subtle.verify("HMAC", ks.mac, tag, cat(new Uint8Array([3]), ctr, iv, o)).then(function (good) {
      if (!good) throw new Error("mac");
      return subtle.decrypt({ name: "AES-GCM", iv: iv, additionalData: ctr }, ks.gcm, o);
    }).then(function (mid) {
      return subtle.decrypt({ name: "AES-CTR", counter: ctr, length: 64 }, ks.ctr, new Uint8Array(mid));
    }).then(function (plain) {
      var flat = unpadBytes(new Uint8Array(plain));
      if (flat.length < 2) throw new Error("shape");
      var mlen = (flat[0] << 8) | flat[1];
      if (mlen > flat.length - 2) throw new Error("shape");
      return { meta: JSON.parse(new TextDecoder().decode(flat.subarray(2, 2 + mlen))), bytes: flat.slice(2 + mlen) };
    });
  }
  function thingToSealed(ks, rec) {
    return blobBytes(rec.blob).then(function (bytes) {
      return sealBytes(ks, { name: rec.name, mime: rec.mime, size: rec.size, at: rec.at }, bytes);
    }).then(function (box) {
      return { id: rec.id, sealed: 3, box: new Blob([box], { type: "application/octet-stream" }) };
    });
  }
  function thingFromSealed(ks, rec) {
    return blobBytes(rec.box).then(function (b) { return openBytes(ks, b); }).then(function (o) {
      var m = o.meta || {};
      return { id: rec.id, blob: new Blob([o.bytes], { type: m.mime || "" }), name: m.name, mime: m.mime, size: m.size, at: m.at };
    });
  }
  /* Запечатать открытые вещи. При повороте ключа мир один — запечатывается
     всё. При открытии замка — только вещи, о которых знает ЭТОТ мир (номер
     вещи стоит в одной из его расшифрованных записей): открытая вещь,
     оставшаяся от прежнего выпуска, могла принадлежать другому миру, и
     запечатать её чужим ключом значило бы потерять её для хозяина. */
  /* Запечатывание и распечатывание идут ОДНОЙ очередью: иначе открытие
     замка (запечатать своё) и снятие замка (распечатать всё), начатые подряд,
     разошлись бы по складу наперегонки, и вещь осталась бы запечатанной
     ключом, которого уже нет. */
  var thingsWork = Promise.resolve();
  function thingsQueue(job) {
    thingsWork = thingsWork.then(job, job);
    return thingsWork;
  }
  function sealThingsNow(ks, onlyKnown) {
    return thingsQueue(function () { return sealThingsJob(ks, onlyKnown); });
  }
  function unsealThingsNow(ks) {
    return thingsQueue(function () { return unsealThingsJob(ks); });
  }
  function sealThingsJob(ks, onlyKnown) {
    var known = null;
    if (onlyKnown) {
      known = [];
      mem.forEach(function (v) { if (v != null) known.push(String(v)); });
      known = known.join("\n");
    }
    return idbAll("things").then(function (list) {
      return list.reduce(function (chain, rec) {
        return chain.then(function () {
          if (!rec || rec.sealed || !rec.blob) return null;
          if (known !== null && known.indexOf(String(rec.id)) === -1) return null;
          return thingToSealed(ks, rec).then(function (sealed) { return idbPut("things", sealed); });
        });
      }, Promise.resolve());
    }).then(function () { return true; }, function () { return false; });
  }
  /* Снять замок — распечатать вещи. Запечатанная вещь без мастер-ключа
     потеряна навсегда; вещь другого мира, которую этим ключом не открыть,
     после снятия замка не откроет уже никто — она убирается как шум. */
  function unsealThingsJob(ks) {
    return idbAll("things").then(function (list) {
      return list.reduce(function (chain, rec) {
        return chain.then(function () {
          if (!rec || !rec.sealed) return null;
          return thingFromSealed(ks, rec).then(function (plain) {
            return idbPut("things", plain);
          }, function () { return idbDel("things", rec.id); });
        });
      }, Promise.resolve());
    }).then(function () { return true; }, function () { return false; });
  }

  /* ── СТАРЫЙ ЗАМОК v1: только читается, чтобы переехать ────────────────── */
  function deriveVaultKeyV1(password, saltHex) {
    var enc = new TextEncoder();
    return window.crypto.subtle
      .importKey("raw", enc.encode(String(password)), { name: "PBKDF2" }, false, ["deriveKey"])
      .then(function (base) {
        return window.crypto.subtle.deriveKey({
          name: "PBKDF2", salt: enc.encode(saltHex), iterations: 150000, hash: "SHA-256"
        }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
      });
  }
  function openTextV1(key, envelope) {
    var box;
    try { box = JSON.parse(envelope); } catch (e) { return Promise.reject(new Error("shape")); }
    if (!box || box.v !== 1 || !box.iv || !box.ct) return Promise.reject(new Error("shape"));
    return window.crypto.subtle
      .decrypt({ name: "AES-GCM", iv: unb64(box.iv) }, key, unb64(box.ct))
      .then(function (buf) { return new TextDecoder().decode(buf); });
  }

  /* ── СОБРАТЬ НОВЫЙ ЗАМОК ИЗ ПАРОЛЯ И ОТКРЫТЫХ ПАР ─────────────────────── */
  /* ─────────────── ДВЕ ДВЕРИ, И ВТОРАЯ НЕОТЛИЧИМА ОТ ПЕРВОЙ (v98) ───────
     ПОВОД. Основатель просил шифрование «в десять раз сильнее, чем у Signal».
     Такой величины не существует: AES-256 уже за пределами перебора, и
     умножить невозможность на десять нельзя. Зато можно уметь то, чего не
     умеет ни Signal, ни кто-либо ещё из массовых: ТРЕВОЖНЫЙ ПАРОЛЬ.

     КАК УСТРОЕНО. На диске ВСЕГДА лежат ровно две двери. Каждая — конверт с
     мастер-ключом, завёрнутый в ключ, выведенный из своего пароля и своей
     соли. Имена записей выводятся из мастера (HMAC), поэтому записи одного
     мира для другого — неотличимый от шума набор конвертов.

     ГЛАВНОЕ, И БЕЗ ЭТОГО ВСЁ БЕССМЫСЛЕННО: вторая дверь стоит ВСЕГДА, даже
     когда тревожного пароля нет. Тогда в ней случайные байты, которые не
     откроет никто и никогда. Выход AES-GCM от случайного шума неотличим, и
     по диску НЕЛЬЗЯ узнать, настоящая вторая дверь или пустышка. Если бы
     дверь появлялась только при заведённом тревожном пароле, само её
     наличие и было бы признанием — и вся защита не стоила бы ничего.

     ПРОВЕРЯЮТСЯ ВСЕГДА ОБЕ. Не «первая, а если не вышло — вторая»: иначе
     время ответа говорило бы, какая дверь открылась. Обе растяжки считаются
     всегда, и стоимость неверного пароля одинакова для любого.

     ЧЕГО ЭТО НЕ ДАЁТ, и Совет говорит вслух: ЧИСЛО конвертов на диске видно.
     Если в главном мире сорок записей, а в тревожном три, тот, кто считает
     конверты, увидит сорок три. Скрыть это можно только подсыпая пустышки —
     это отдельная работа и отдельное решение. Сегодня тревожный пароль
     защищает от того, кто ЗАСТАВЛЯЕТ ОТКРЫТЬ, а не от того, кто месяцами
     изучает диск.

     Охраняется tools/two-doors-check.mjs. */

  /* ── ИЗ БАЙТОВ В ПАРОЛЬ, БЕЗ ПЕРЕКОСА ────────────────────────────────────
     Взять байт по остатку от деления на длину алфавита — обычная и тихая
     ошибка: 256 не делится на 72, и первые сорок знаков алфавита выпадали бы
     чаще прочих. Здесь байты, попавшие в неполный хвост, ОТБРАСЫВАЮТСЯ —
     и распределение ровное. Из четырёх рядов знаков по одному ставится
     обязательно, иначе иные места откажутся принимать пароль. */
  var KEY_LOW = "abcdefghijkmnopqrstuvwxyz";
  var KEY_UP = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  var KEY_NUM = "23456789";
  var KEY_SYM = "!#$%&*+-=?";
  var KEY_ALL = KEY_LOW + KEY_UP + KEY_NUM + KEY_SYM;

  function shapeKey(bytes, want) {
    var at = 0;
    function draw(alpha) {
      var limit = 256 - (256 % alpha.length);
      while (at < bytes.length) {
        var b = bytes[at++];
        if (b < limit) return alpha.charAt(b % alpha.length);
      }
      return alpha.charAt(0);          /* байты кончились — такого не бывает при 256 */
    }
    var out = [draw(KEY_LOW), draw(KEY_UP), draw(KEY_NUM), draw(KEY_SYM)];
    while (out.length < want) out.push(draw(KEY_ALL));
    /* Перемешивание тоже выводится из тех же байтов: иначе обязательные знаки
       всегда стояли бы первыми четырьмя, и это было бы видно. */
    for (var i = out.length - 1; i > 0; i--) {
      var limit = 256 - (256 % (i + 1));
      var j = 0;
      while (at < bytes.length) { var b2 = bytes[at++]; if (b2 < limit) { j = b2 % (i + 1); break; } }
      var t = out[i]; out[i] = out[j]; out[j] = t;
    }
    return out.join("");
  }

  function randomDoor() {
    var iv = new Uint8Array(12), wrap = new Uint8Array(48);
    window.crypto.getRandomValues(iv);
    window.crypto.getRandomValues(wrap);
    return { wrapIv: b64(iv), wrap: b64(wrap) };
  }

  /* ── ЗАПАСНАЯ ДВЕРЬ: КОД ВОССТАНОВЛЕНИЯ (D-266) ─────────────────────────
     «Забытый пароль означает потерю запертого» — так стояло в описи дыр, и
     причиной называлось отсутствие сервера. Сервер для этого не нужен. Нужен
     ещё один конверт мастер-ключа, который открывается не словом, а кодом:
     160 случайных бит, тридцать два знака без путаницы (алфавит Крокфорда:
     нет I, L, O, U). Код показывается ОДИН раз — на бумагу; на диске его нет
     ни байта. Код не проверяется отдельно: он ВЫВОДИТ ключ той же растяжкой,
     что и слово, — обходить нечего.
     ЗАПАСНАЯ ДВЕРЬ СТОИТ ВСЕГДА, как и вторая: без кода в ней шум той же длины.
     Иначе диск говорил бы, есть ли у человека код.
     КОД ОДНОРАЗОВЫЙ: открыл — дверь снова становится шумом, и окно аккаунта
     предлагает завести новый. Код, однажды набранный на чужих глазах или
     чужой клавиатуре, не должен оставаться ключом.
     ЦЕНА НАЗВАНА: код открывает главный мир без слова и без второго ключа.
     Он — такая же тайна, как слово, только длиннее; хранить его отдельно от
     устройства — условие, при котором он спасает, а не выдаёт. */
  var SPARE_ALPHA = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  var SPARE_KEY = "sysbaby.lock.spareAt";
  function spareNorm(code) {
    return String(code || "").toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1").replace(/[^0-9A-Z]/g, "");
  }
  function spareNew() {
    var b = new Uint8Array(20), out = "", acc = 0, bits = 0, i;
    window.crypto.getRandomValues(b);
    for (i = 0; i < b.length; i++) {
      acc = ((acc << 8) | b[i]) & 0xffff;
      bits += 8;
      while (bits >= 5) { out += SPARE_ALPHA.charAt((acc >>> (bits - 5)) & 31); bits -= 5; }
    }
    return out.match(/.{4}/g).join("-");
  }
  function spareSecret(norm) { return "sys.baby/spare/v1:" + norm; }
  function spareKdf() { return ["PBKDF2-SHA512:" + KDF1_ITER, "PBKDF2-SHA256:" + KDF2_ITER]; }
  function randomSpare() { var d = randomDoor(); d.kdf = spareKdf(); return d; }
  function makeSpare(code, master, saltB64) {
    var iv = new Uint8Array(12);
    window.crypto.getRandomValues(iv);
    return deriveKEK(spareSecret(spareNorm(code)), saltB64, KDF1_ITER, KDF2_ITER, null).then(function (kek) {
      return window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, kek, master);
    }).then(function (w) { return { wrapIv: b64(iv), wrap: b64(w), kdf: spareKdf() }; });
  }
  function upgradeSpare() {
    var rec = lockRecord();
    if (!rec || rec.spare) return;
    rec.spare = randomSpare();
    lsSet(LOCK_KEY, JSON.stringify(rec));
  }
  /* Отметка «код заведён» — ВНУТРИ хранилища, под замком: снаружи её нет,
     и в тревожном мире она своя. */
  function markSpare(on) {
    try { if (on) lsSet(SPARE_KEY, String(Date.now())); else lsDel(SPARE_KEY); } catch (e) { /* ignore */ }
  }

  /* СОЛЬ У ЗАМКА ОДНА НА ОБЕ ДВЕРИ, и это не экономия на стойкости.
     Соль мешает считать таблицы ЗАРАНЕЕ и СРАЗУ НА МНОГИХ; для двух дверей
     одного человека на одном устройстве разные соли не добавляют ничего, а
     стоят ровно вдвое: открытие считало бы растяжку дважды. С одной солью
     растяжка считается ОДИН раз, а полученный ключ пробуется на обеих
     дверях — это уже дешёвые действия. Заодно исчезает утечка временем:
     стоимость попытки одинакова всегда. */
  /* ── ДВЕРЬ ДЕЛАЕТСЯ ЦЕНОЙ СВОЕГО ЗАМКА (D-266, нашёл закон) ────────────
     Растяжка считается ОДИН раз на попытку и пробуется на всех дверях — значит
     все двери обязаны быть сделаны одной ценой: ценой, записанной в замке.
     Прежде новая дверь делалась СЕГОДНЯШНЕЙ ценой, а открывалась ценой замка:
     у замка, запертого до D-205, тревожное слово, заведённое потом, не
     открывало ничего, а смена главного слова переписывала цену замка и
     молча убивала тревожный мир. cost — пара проходов из costOf(rec); без неё
     дверь делается сегодняшней ценой, и это верно только для нового замка. */
  function makeDoor(password, master, saltB64, fsec, cost) {
    var iv = new Uint8Array(12);
    window.crypto.getRandomValues(iv);
    return deriveKEK(password, saltB64, cost ? cost[0] : null, cost ? cost[1] : null, fsec, cost ? cost[2] : todayA2()).then(function (kek) {
      return window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, kek, master);
    }).then(function (w) { return { wrapIv: b64(iv), wrap: b64(w) }; });
  }

  /* Во сколько проходов заперт ЭТОТ замок. Старые записи несут это в kdf;
     совсем древние — не несут, и тогда действует прежняя пара. */
  function costOf(rec) {
    var k = (rec && rec.kdf) || [];
    var a = parseInt(String(k[0] || "").split(":")[1], 10);
    var b = parseInt(String(k[1] || "").split(":")[1], 10);
    /* Третий элемент — проход памятью (D-275), если замок сделан с ним. */
    return [a > 0 ? a : 210000, b > 0 ? b : 600000, a2Parse(k[2])];
  }

  function saltOf(rec) {
    if (rec && rec.salt) return rec.salt;
    var d = doorsOf(rec)[0];
    return d && d.salt;
  }

  function doorsOf(rec) {
    if (rec && rec.doors && rec.doors.length) return rec.doors;
    /* Замок прежнего образца: одна дверь. Открывается по-старому и при первом
       же удачном открытии дописывается до двух — см. upgradeDoors. */
    return [{ salt: rec.salt, wrapIv: rec.wrapIv, wrap: rec.wrap }];
  }

  function openDoors(rec, password, fsec) {
    var doors = doorsOf(rec);
    var cost = costOf(rec);
    return deriveKEK(password, saltOf(rec), cost[0], cost[1], fsec, cost[2]).then(function (kek) {
      var jobs = doors.map(function (d) {
        var wrapped, iv;
        try { wrapped = unb64(d.wrap); iv = unb64(d.wrapIv || d.iv); }
        catch (e) { return Promise.resolve(null); }
        return window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, kek, wrapped)
          .then(function (buf) { return new Uint8Array(buf); }, function () { return null; });
      });
      /* Promise.all, а не гонка: обе двери пробуются до конца всегда. */
      return Promise.all(jobs);
    }).then(function (res) {
      for (var i = 0; i < res.length; i++) if (res[i]) { vaultDoor = i; return res[i]; }
      vaultDoor = -1;
      return null;
    });
  }

  /* Замок с одной дверью дописывается до двух молча, при первом открытии:
     человек ничего не делал, а диск с этой минуты уже не говорит, есть ли
     у него второй мир. */
  function upgradeDoors(rec) {
    if (rec && rec.doors && rec.doors.length >= 2) return;
    var next = {};
    var k; for (k in rec) if (Object.prototype.hasOwnProperty.call(rec, k)) next[k] = rec[k];
    next.v = 3;
    next.salt = saltOf(rec);
    next.doors = doorsOf(rec).map(function (d) { return { wrapIv: d.wrapIv, wrap: d.wrap }; })
      .concat([randomDoor()]);
    delete next.wrapIv; delete next.wrap;
    lsSet(LOCK_KEY, JSON.stringify(next));
  }

  /* ─────────── ЧИСЛО КОНВЕРТОВ НА ДИСКЕ ТОЖЕ ПРЯЧЕТСЯ (v99) ──────────────
     ПОВОД — предел, который Совет назвал сам, когда строил две двери (D-203):
     «ЧИСЛО конвертов на диске видно. Если в главном мире сорок записей, а в
     тревожном три, тот, кто считает конверты, увидит сорок три». Пока это
     так, тревожное слово защищает наполовину: мир за второй дверью можно не
     открыть, но можно ПОСЧИТАТЬ.

     ЧТО СДЕЛАНО. К настоящим конвертам подсыпаются пустышки, и на диске
     всегда лежит число, кратное тридцати двум. Пустышка неотличима от
     конверта: то же имя в том же пространстве, тот же порядок частей, те же
     длины, и внутри — случайные байты, которые не откроются никогда и ничем.
     Размер тела берётся у УЖЕ ЛЕЖАЩИХ конвертов, а не выдумывается: иначе
     пустышки выдала бы собственная ровность.

     ПОДСЫПАТЬ МОЖНО, УБИРАТЬ НЕЛЬЗЯ. Система не знает, какие конверты
     пустышки: под открытым ключом не открывается ни пустышка, ни ЧУЖОЙ МИР
     за второй дверью. Убирать «лишнее» значило бы однажды стереть человеку
     его второй мир. Поэтому число только растёт до следующей ступени.

     ЧТО ЭТО ДАЁТ И ЧЕГО НЕ ДАЁТ, вслух. Считающий узнаёт СТУПЕНЬ, а не
     число: «не больше тридцати двух» вместо «сорок три». Два мира на 43
     записи и один мир на 20 выглядят одинаково. Но ступень видна, и при
     двухстах записях в главном мире тревожный мир в трёх записях всё ещё
     прячется, а вот при пустом главном — нет: у человека, который только
     завёл систему, тридцать два конверта. Это цена ступени, и она названа.

     Охраняется tools/decoy-count-check.mjs. */

  var DECOY_STEP = 32;

  function randBytes(n) { var u = new Uint8Array(n); window.crypto.getRandomValues(u); return u; }

  /* Длины тел уже лежащих конвертов — чтобы пустышка была того же роста. */
  function envelopeBodySizes() {
    var out = [], names = sealedNamesNow(), i, v, p;
    for (i = 0; i < names.length; i++) {
      v = rawStore.get.call(window.localStorage, names[i]);
      if (!v) continue;
      p = String(v).split(".");
      if (p.length !== 5 || p[0] !== "2") continue;
      try { out.push(unb64(p[3]).length); } catch (e) { /* ignore */ }
    }
    return out;
  }

  function makeDecoy(sizes) {
    var body = sizes.length
      ? sizes[Math.floor(Math.random() * sizes.length)]
      : PAD_BLOCK + 16;
    return {
      env: "2." + b64(randBytes(16)) + "." + b64(randBytes(12)) +
           "." + b64(randBytes(body)) + "." + b64(randBytes(64))
    };
  }

  /* ── ПУСТЫШКИ ИМЕНУЮТСЯ ТЕМ ЖЕ HMAC, ЧТО И ЗАПИСИ (v101) ───────────────
     Снаружи имя пустышки неотличимо от имени записи: оба — отпечаток под
     ключом имён. Изнутри же они ПЕРЕЧИСЛИМЫ, потому что выводятся из
     служебного слова со счётчиком, а не из имени человеческого ключа.
     ЗАЧЕМ ЭТО ПОНАДОБИЛОСЬ. Пока пустышки звались случайно, система не
     могла отличить свою подсыпку от ЧУЖОГО МИРА за второй дверью и не
     трогала ничего. Значит каждая новая запись выталкивала число за
     ступень и стоила целых тридцати двух конвертов: доска поймала рост
     64 → 160 на трёх записях подряд. Теперь новая запись СЪЕДАЕТ пустышку,
     и число на диске стоит на месте.
     Служебное слово начинается с нулевого знака: в ключах хранилища такого
     знака не бывает, столкнуться не с чем. */
  var DECOY_WORD = String.fromCharCode(0) + "sb/decoy/";

  function decoyName(ks, i) { return sealedName(ks, DECOY_WORD + i); }

  function decoyRoll(ks, upto) {
    var jobs = [], i;
    for (i = 0; i < upto; i++) jobs.push(decoyName(ks, i));
    return Promise.all(jobs);
  }

  function levelDisk(ks) {
    if (!vaultLocked() || !ks) return Promise.resolve();
    var n = sealedNamesNow().length;
    if (!n) return Promise.resolve();
    var target = Math.max(DECOY_STEP, Math.ceil(n / DECOY_STEP) * DECOY_STEP);
    if (n >= target) return Promise.resolve();
    var need = target - n;
    return decoyRoll(ks, target + DECOY_STEP).then(function (names) {
      /* ЗАМОК ПРОВЕРЯЕТСЯ ЕЩЁ РАЗ, ПЕРЕД САМОЙ ЗАПИСЬЮ. Отпечатки имён
         считаются не мгновенно, и за это время человек мог снять замок:
         тогда подсыпка дописывала конверты в уже открытое хранилище —
         доска поймала это строкой «после снятия замка конвертов не
         осталось». Проверка в начале длинной работы ничего не значит. */
      if (!vaultLocked()) return;
      var sizes = envelopeBodySizes(), made = 0, i;
      for (i = 0; i < names.length && made < need; i++) {
        if (rawStore.get.call(window.localStorage, names[i]) != null) continue;
        try { rawStore.set.call(window.localStorage, names[i], makeDecoy(sizes).env); made++; }
        catch (e) { return; }             /* места нет — молча останавливаемся */
      }
    });
  }

  /* Вызывается ПЕРЕД записью нового конверта: снимает ОДНУ свою пустышку,
     чтобы число на диске не шевельнулось. Чужие конверты не трогаются
     никогда — под ними может лежать второй мир. */
  function makeRoom(ks) {
    if (!vaultLocked() || !ks) return Promise.resolve();
    var n = sealedNamesNow().length;
    var upto = Math.ceil(n / DECOY_STEP) * DECOY_STEP + DECOY_STEP;
    return decoyRoll(ks, upto).then(function (names) {
      if (!vaultLocked()) return;
      var i;
      for (i = names.length - 1; i >= 0; i--) {
        if (rawStore.get.call(window.localStorage, names[i]) != null) {
          rawStore.del.call(window.localStorage, names[i]);
          return;
        }
      }
    });
  }


  /* ── МЕДЛЕННЫЙ ОБОРОТ: ЧЕГО НЕ ВИДНО, ТОГО НЕ СРАВНИТЬ (v102) ──────────
     ПОВОД, дословно от основателя: «сделайте шифрование ещё более
     невообразимым. он должен постоянно меняться».

     ЧТО ЗДЕСЬ БЫЛО ОТКРЫТО, ХОТЯ ВСЁ БЫЛО ЗАШИФРОВАНО. Конверт меняется на
     диске ровно тогда, когда человек правит запись. Значит тот, у кого есть
     ДВА СНИМКА диска — вчерашний и сегодняшний, — читает без всякого ключа:
     какие именно записи человек трогал и когда. Содержание скрыто, а
     ПОВЕДЕНИЕ видно насквозь. Это настоящая утечка, и до сегодня она была.

     ЧТО СДЕЛАНО. Конверты переворачиваются сами, по нескольку за раз: запись
     открывается и запечатывается заново со свежими случайными числами.
     Содержимое то же, байты другие — целиком, до последнего. Пустышки
     переворачиваются тем же порядком: им выдаётся новый случайный шум.
     За несколько оборотов меняется ВЕСЬ диск, хотя человек не тронул ничего.

     ПОЧЕМУ ЭТО НЕ УКРАШЕНИЕ. Два снимка диска теперь отличаются всегда и
     везде. Сказать по ним, какую запись правили, нельзя: правленая ничем не
     выделяется среди перевёрнутых.

     ЧЕГО ОБОРОТ НЕ ДАЁТ, вслух: он НЕ защищает от того, кто получил диск и
     узнал пароль. Ключ по-прежнему выводится из слова человека. Оборот
     закрывает ровно одну щель — сравнение снимков — и не притворяется,
     что закрывает другие.

     ЧУЖОЕ НЕ ТРОГАЕТСЯ НИКОГДА. Конверт, который не открылся текущим ключом,
     это либо своя пустышка (её имя перечислимо), либо запись ВТОРОГО МИРА.
     Первую переворачиваем, вторую не касаемся.

     Охраняется tools/roll-check.mjs. */

  var ROLL_AT_ONCE = 4;
  var ROLL_EVERY = 90000;
  var rollTimer = null;

  /* ── ОБОРОТ НАЗЫВАЕТ ИМЕНА, А НЕ ЧИСЛО (D-214) ─────────────────────────
     Прежде оборот возвращал одно число. Числу можно нарисовать какую угодно
     картинку: окно показало бы «перевернулось четыре» и мигнуло бы любыми
     четырьмя ячейками. Теперь оборот отдаёт ИМЕНА перевёрнутых конвертов и
     объявляет их шине. Окно не иллюстрирует оборот — оно его отражает, и
     закон может сверить: ячейки, которые повернулись на экране, это ровно те
     конверты, чьи байты на диске стали другими. */
  function rollOnce(ks) {
    if (!vaultLocked() || !ks) return Promise.resolve([]);
    var names = sealedNamesNow();
    if (!names.length) return Promise.resolve([]);
    var upto = Math.ceil(names.length / DECOY_STEP) * DECOY_STEP + DECOY_STEP;
    return decoyRoll(ks, upto).then(function (decoys) {
      var mine = {}, i;
      for (i = 0; i < decoys.length; i++) mine[decoys[i]] = true;
      /* Кого переворачивать — решает случай, а не порядок в хранилище:
         иначе сам оборот стал бы расписанием, читаемым со стороны. */
      var pick = names.slice();
      for (i = pick.length - 1; i > 0; i--) {
        var j = randBytes(1)[0] % (i + 1);
        var t = pick[i]; pick[i] = pick[j]; pick[j] = t;
      }
      pick = pick.slice(0, ROLL_AT_ONCE);
      var sizes = envelopeBodySizes();
      var jobs = pick.map(function (phys) {
        var raw = rawStore.get.call(window.localStorage, phys);
        if (raw == null) return Promise.resolve(null);
        return openPair(ks, raw).then(function (p) {
          return sealPair(ks, p.name, p.value).then(function (env) {
            /* Замок мог быть снят, пока шифровали. Тогда писать некуда. */
            if (!vaultLocked() || rawStore.get.call(window.localStorage, phys) == null) return null;
            rawStore.set.call(window.localStorage, phys, env);
            return phys;
          });
        }, function () {
          if (!mine[phys]) return null;
          if (!vaultLocked() || rawStore.get.call(window.localStorage, phys) == null) return null;
          rawStore.set.call(window.localStorage, phys, makeDecoy(sizes).env);
          return phys;
        });
      });
      return Promise.all(jobs).then(function (r) {
        var done = r.filter(function (x) { return !!x; });
        if (done.length && window.sbBus && window.sbBus.emit) {
          window.sbBus.emit("vault:roll", { names: done.slice(), turned: done.length, total: sealedNamesNow().length });
        }
        return done;
      });
    });
  }

  function rollKeep(ks) {
    if (rollTimer) clearInterval(rollTimer);
    rollTimer = setInterval(function () {
      if (!vaultOpen || !vaultKeys) { clearInterval(rollTimer); rollTimer = null; return; }
      rollOnce(vaultKeys);
    }, ROLL_EVERY);
  }

  /* Наружу — чтобы окно аккаунта ПОКАЗЫВАЛО оборот настоящими числами,
     а не рисовало его. */
  window.sbVaultRoll = function () {
    return rollOnce(vaultKeys).then(function (done) {
      return { turned: done.length, names: done.slice(), total: sealedNamesNow().length };
    });
  };

  /* ── ПЕРЕПИСЬ ДИСКА (D-214) ───────────────────────────────────────────
     Сколько конвертов лежит, сколько из них настоящих и сколько пустышек —
     это НЕ тайна от хозяина и полная тайна от всех прочих: снаружи конверты
     неразличимы. Отдаётся наружу затем, чтобы окно СПРАШИВАЛО число, а не
     помнило его, и чтобы закон мог сверить нарисованное с лежащим. */
  window.sbVaultCensus = function () {
    var total = sealedNamesNow().length;
    var real = 0;
    nameMap.forEach(function (phys) {
      if (rawStore.get.call(window.localStorage, phys) != null) real++;
    });
    return { total: total, real: real, decoy: Math.max(0, total - real), step: DECOY_STEP,
             at: ROLL_AT_ONCE, every: ROLL_EVERY };
  };

  function buildLock(password, pairs, keepMaster, duressPassword, factorFile) {
    var salt = new Uint8Array(32);
    var wrapIv = new Uint8Array(12);
    var master = keepMaster ? new Uint8Array(keepMaster) : new Uint8Array(32);
    window.crypto.getRandomValues(salt);
    window.crypto.getRandomValues(wrapIv);
    if (!keepMaster) window.crypto.getRandomValues(master);
    var saltB64 = b64(salt);
    var fsalt = new Uint8Array(32);
    window.crypto.getRandomValues(fsalt);
    var fsaltB64 = b64(fsalt);
    var factorRec = factorFile ? { kind: "file", salt: fsaltB64 } : null;
    return (factorFile ? factorSecret(factorFile, fsaltB64) : Promise.resolve(null)).then(function (fsec) {
    var a2 = todayA2();
    return deriveKEK(password, saltB64, null, null, fsec, a2).then(function (kek) {
      return window.crypto.subtle.encrypt({ name: "AES-GCM", iv: wrapIv }, kek, master).then(function (wrapped) {
        var second = duressPassword
          ? makeDoor(duressPassword, (function () { var m = new Uint8Array(32); window.crypto.getRandomValues(m); return m; })(), saltB64, fsec, [KDF1_ITER, KDF2_ITER, a2])
          : Promise.resolve(randomDoor());
        return second.then(function (door2) {
        return subkeys(master).then(function (ks) {
          var jobs = pairs.map(function (p) {
            return Promise.all([sealedName(ks, p.k), sealPair(ks, p.k, p.v)])
              .then(function (r) { return { name: r[0], env: r[1], from: p.k }; });
          });
          return Promise.all(jobs).then(function (rows) {
            var i;
            for (i = 0; i < rows.length; i++) rawStore.set.call(window.localStorage, rows[i].name, rows[i].env);
            /* Запись замка — ПОСЛЕДНЕЙ из создающих, но ДО стирания открытых:
               оборвись питание посередине, на диске лежат и конверты, и
               открытые копии, а замка нет — потерять нечего. */
            var body = {
              v: factorRec ? 4 : 3,
              kdf: ["PBKDF2-SHA512:" + KDF1_ITER, "PBKDF2-SHA256:" + KDF2_ITER].concat(a2 ? [a2Label(a2)] : []),
              ciphers: ["AES-256-CTR", "AES-256-GCM"],
              mac: "HMAC-SHA-512",
              names: "HMAC-SHA-256",
              pad: PAD_BLOCK,
              salt: saltB64,
              doors: [{ wrapIv: b64(wrapIv), wrap: b64(wrapped) }, door2],
              spare: randomSpare()
            };
            if (factorRec) body.factor = factorRec;
            lsSet(LOCK_KEY, JSON.stringify(body));
            for (i = 0; i < rows.length; i++) rawStore.del.call(window.localStorage, rows[i].from);
            vaultMaster = new Uint8Array(master);
            master.fill(0);
            return levelDisk(ks).then(function () { return ks; });
          });
        });
        });
      });
    });
    });
  }

  window.sbVault = {
    available: vaultAvailable,
    isLocked: vaultLocked,
    isOpen: function () { return vaultOpen; },
    protectedKeys: protectedKeysNow,
    sealedNames: sealedNamesNow,
    neverLocked: function () { return VAULT_NEVER.slice(); },
    /* ── КОПИИ НАСЛЕДУЮТ ЗАМОК (D-172) ──────────────────────────────────
       Выгрузка профиля — открытый текст. Писать её в папку, пока человек
       запер систему, значило бы вынести наружу ровно то, что он спрятал:
       замок на диске и открытая копия рядом — это не замок.
       Поэтому конверт отдаётся наружу, и синхронизация кладёт в папку
       запертое запертым. Открыть такую копию можно только тем же паролем —
       и это сказано человеку прямо в окне. */
    seal: function (text) {
      if (!vaultOpen || !vaultKeys) return Promise.reject(new Error("closed"));
      return sealPair(vaultKeys, "backup", text);
    },
    openSealed: function (envelope) {
      if (!vaultOpen || !vaultKeys) return Promise.reject(new Error("closed"));
      return openPair(vaultKeys, envelope).then(function (p) { return p.value; });
    },
    /* Чем именно заперто — не тайна: тайна это ключ, а не имя шифра. */
    cipher: function () {
      var rec = lockRecord();
      if (!rec) return { v: 2, kdf: ["PBKDF2-SHA512:" + KDF1_ITER, "PBKDF2-SHA256:" + KDF2_ITER].concat(todayA2() ? [a2Label(todayA2())] : []),
        ciphers: ["AES-256-CTR", "AES-256-GCM"], mac: "HMAC-SHA-512", names: "HMAC-SHA-256", pad: PAD_BLOCK };
      return rec;
    },

    /* Повернуть ключ. Слова уходят в конверты, открытые значения стираются из
       хранилища и из памяти разом: оставить их «на всякий случай» значило бы
       не запереть ничего. */
    lock: function (password, duressPassword, secondKeyFile) {
      if (!vaultAvailable()) return Promise.reject(new Error("no-subtle"));
      if (String(password || "").length < 4) return Promise.reject(new Error("short"));
      if (vaultLocked()) return Promise.reject(new Error("already"));
      flush();
      var pairs = protectedKeysNow().map(function (k) {
        return { k: k, v: rawStore.get.call(window.localStorage, k) };
      }).filter(function (p) { return p.v != null; });
      /* Флаг поднимается СИНХРОННО, до первого await: между этой строкой и
         записью замка система продолжает жить и писать. */
      sealing = true;
      pending.clear();
      var sealedWith = null;
      return buildLock(password, pairs, null, duressPassword, secondKeyFile).then(function (ks) {
        sealedWith = ks;
        /* Добираем то, что система записала, пока считался ключ. */
        var extra = [];
        pending.forEach(function (v, k) { extra.push({ k: k, v: v }); });
        pending.clear();
        /* ПО ОДНОМУ, А НЕ ПАЧКОЙ: каждый доклеенный конверт обязан занять
           место СВОЕЙ пустышки, иначе число на диске выходит за ступень —
           доска поймала ровно это: тридцать три конверта вместо тридцати
           двух после поворота ключа. */
        return extra.reduce(function (chain, p) {
          return chain.then(function () {
            if (p.v == null) return null;
            return Promise.all([sealedName(ks, p.k), sealPair(ks, p.k, p.v)]).then(function (r) {
              var fresh = rawStore.get.call(window.localStorage, r[0]) == null;
              return (fresh ? makeRoom(ks) : Promise.resolve()).then(function () {
                rawStore.set.call(window.localStorage, r[0], r[1]);
                rawStore.del.call(window.localStorage, p.k);
              });
            });
          });
        }, Promise.resolve());
      }).then(function () {
        /* ВЫРАВНИВАНИЕ ПОСЛЕДНИМ, А НЕ В СЕРЕДИНЕ. buildLock уже подсыпал
           пустышек, но сразу после него сюда доклеиваются записи, сделанные
           ПОКА СЧИТАЛСЯ КЛЮЧ, — и число снова переставало быть круглым.
           Прибор поймал это на первом же прогоне: тридцать шесть конвертов
           вместо тридцати двух. Выравнивать надо там, где запись кончается. */
        return levelDisk(sealedWith);
      }).then(function () {
        /* Вещи склада уходят в конверты ТЕМ ЖЕ поворотом ключа, и старые
           открытые снимки вычищаются: замок держит весь диск (D-265). */
        return sealThingsNow(sealedWith, false).then(function () { return purgeDiskLeaks(); });
      }).then(function () {
        /* ── ЗАПЕР — ЗНАЧИТ ЗАПЕРТО, С ЭТОГО ЖЕ МИГА ────────────────────────
           Прежняя редакция оставляла сеанс ОТКРЫТЫМ после поворота ключа и
           при этом стирала память. Получалась худшая из возможных середин:
           система считала, что данных нет (память пуста), но продолжала
           писать — и первая же запись заклеивала свежий конверт пустым
           списком. Это ровно тот дефект, который закон нашёл в D-164, только
           входящий с другой стороны.
           Поэтому поворот ключа ЗАКРЫВАЕТ сеанс: ключи выброшены, память
           пуста, на диск защищённое не идёт вовсе. Дальше — только дверь с
           паролем, и это же честно по виду: человек нажал «запереть» и видит
           запертое, а не прежний стол. */
        cache.clear();
        mem.clear();
        nameMap.clear();
        vaultKeys = null;
        if (vaultMaster) { vaultMaster.fill(0); vaultMaster = null; }
        vaultOpen = false;
        sealing = false;
        bumpEpoch("lock");
        if (window.sbBus && window.sbBus.emit) window.sbBus.emit("vault:change", { locked: true, open: false });
        return true;
      }, function (e) { sealing = false; pending.clear(); throw e; });
    },

    /* Открыть на сеанс. Расшифрованное кладётся в ПАМЯТЬ (кэш sbDB), а не
       обратно в хранилище: иначе первое же открытие отменило бы замок. */
    unlock: function (password, secondKeyFile) {
      var rec = lockRecord();
      if (!rec) return Promise.resolve(true);
      /* Ключ устройства спрашивается дверью ДО слова (hwAsk) — здесь его ответ
         уже лежит в памяти сеанса; без ответа дверь просто не выведется. */
      if (!vaultAvailable()) return Promise.resolve(false);
      if (rec.v === 1) return migrateV1(password, rec);
      /* Верен ли пароль, отвечает сам AES-GCM: неверный ключ не даёт подписи
         сойтись, и распаковка бросает. Отдельное «проверочное слово» здесь не
         нужно — и хорошо: одним известным открытым текстом на диске меньше.
         Дверей две, и считаются ОБЕ всегда — см. шапку про две двери. */
      return factorFor(rec, secondKeyFile).then(function (fsec) {
        return openDoors(rec, password, fsec);
      }).then(function (masterBuf) {
        if (!masterBuf) throw new Error("wrong");
        if (!factorOf(rec)) upgradeDoors(rec);
        upgradeSpare();
        var master = new Uint8Array(masterBuf);
        return subkeys(master).then(function (ks) {
          /* Мастер-ключ остаётся в памяти сеанса — ради смены пароля БЕЗ
             перешифровки: меняется конверт, в котором он лежит, а не данные.
             Ключи шифров всё равно выведены из него и живут рядом; прятать
             от себя же исходник, из которого они получены, было бы обрядом,
             а не защитой. */
          vaultMaster = new Uint8Array(master);
          master.fill(0);
          return openAllSealed(ks);
        });
      }).then(function () { return true; }, function () { return false; });
    },

    /* Снять замок совсем: слова возвращаются в хранилище открытыми. Требует
       пароля — снять замок должен тот, кто его ставил. */
    remove: function (password, secondKeyFile) {
      var rec = lockRecord();
      if (!rec) return Promise.resolve(true);
      return window.sbVault.unlock(password, secondKeyFile).then(function (okp) {
        if (!okp) return false;
        return unsealThingsNow(vaultKeys).then(function () { return true; });
      }).then(function (okp) {
        if (!okp) return false;
        var names = sealedNamesNow(), i;
        mem.forEach(function (v, k) {
          if (v != null) rawStore.set.call(window.localStorage, k, v);
        });
        for (i = 0; i < names.length; i++) rawStore.del.call(window.localStorage, names[i]);
        lsDel(LOCK_KEY);
        vaultOpen = false;
        vaultKeys = null;
        vaultDoor = -1;
        if (vaultMaster) { vaultMaster.fill(0); vaultMaster = null; }
        nameMap.clear();
        bumpEpoch("remove");
        if (window.sbBus && window.sbBus.emit) window.sbBus.emit("vault:change", { locked: false });
        return true;
      });
    },

    /* ── КЛЮЧ, КОТОРОГО НИГДЕ НЕТ ────────────────────────────────────────
       Пароль для места не ХРАНИТСЯ, а ВЫВОДИТСЯ: HKDF от мастер-ключа
       хранилища, именем места и счётчиком. Одно и то же место при одном и том
       же счётчике всегда даёт один и тот же пароль — и ни одного байта этого
       пароля нет ни на диске, ни в памяти дольше показа.

       ЧТО ЭТО ДАЁТ. Красть нечего: в конвертах лежит имя места, а не пароль.
       Терять нечего: новое устройство, то же слово — и все пароли вернулись.
       Синхронизировать нечего: выводится на месте, одинаково везде.

       ЧЕГО НЕ ДАЁТ, и это сказано человеку в самом приложении: пароли,
       заведённые НЕ здесь, вывести нельзя — их приходится хранить, и для них
       остаётся обычный конверт. И если мастер-слово утечёт, утечёт всё разом:
       у выведенных ключей общий корень. Счётчик существует ровно для того,
       чтобы сменить пароль одного места, не трогая остальные.

       Охраняется tools/keys-check.mjs. */
    /* Алфавит отдаётся наружу, чтобы закон СПРАШИВАЛ его, а не помнил:
       список знаков — состав системы, и замораживать его в приборе нельзя. */
    keyAlphabet: function () { return KEY_ALL; },

    siteKey: function (place, counter, length) {
      if (!vaultOpen || !vaultMaster) return Promise.reject(new Error("closed"));
      var want = Math.max(10, Math.min(64, parseInt(length, 10) || 20));
      var info = new TextEncoder().encode("sys.baby/site/v1/" + String(place) + "#" + (parseInt(counter, 10) || 0));
      return window.crypto.subtle.importKey("raw", vaultMaster, "HKDF", false, ["deriveBits"])
        .then(function (k) {
          return window.crypto.subtle.deriveBits(
            { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(0), info: info }, k, 8 * 256);
        })
        .then(function (bits) { return shapeKey(new Uint8Array(bits), want); });
    },

    /* ── ТРЕВОЖНЫЙ ПАРОЛЬ ──────────────────────────────────────────────────
       Второе слово, открывающее ДРУГОЙ мир: свои записи, свой стол, свои
       заметки. Ничто в системе не показывает, что второй мир существует, —
       ни надписью, ни задержкой, ни лишней строкой на диске (см. шапку про
       две двери).

       ПОЧЕМУ ИЗ ТРЕВОЖНОГО МИРА ЭТО НЕ РАБОТАЕТ, И ПОЧЕМУ ОБ ЭТОМ НЕ
       СООБЩАЕТСЯ. Тот, кто вошёл вторым словом, — это либо человек под
       принуждением, либо тот, кто его принуждает. Дать ему переписать первую
       дверь значило бы отдать ему главный мир. Поэтому вызов из тревожного
       мира НИЧЕГО НЕ ПИШЕТ и отвечает «готово»: отказ был бы признанием, что
       мир не первый, а признание здесь дороже любой потери. */
    /* ── ВТОРОЙ КЛЮЧ: ТАЙНА, КОТОРОЙ НЕТ НА ЭТОМ ДИСКЕ (D-215) ────────────
       ПОВОД, дословно от основателя: «прошу совет самым креативным,
       интеллектуальным и гениальным способом сделать. шифрование ещё в разы
       сильнее».

       ПОЧЕМУ НЕ «УСИЛИТЬ ШИФР». Шифр не является слабым местом и усилению не
       подлежит: перебор ключа AES-256 невозможен физически, а не трудно.
       Слабое место ровно одно и всегда одно и то же — СЛОВО ЧЕЛОВЕКА, из
       которого ключ выводится. Растяжка уже стоит двадцать один OWASP; сделать
       её вдесятеро дороже значит заставить хозяина ждать двадцать секунд у
       двери и получить множитель десять — против слова, которое подбирают за
       миллионы попыток. Это не усиление, это обряд.

       ЧТО ДЕЙСТВИТЕЛЬНО УМНОЖАЕТ СТОЙКОСТЬ. Тайна, которой НЕТ ни на диске,
       ни в голове: файл, который человек держит отдельно. Его байты входят в
       вывод ключа. Тот, кто унёс диск и узнал слово, не получает ничего —
       не потому, что его остановила проверка, а потому, что ключ без файла
       не выводится. Множитель здесь не «в разы»: перебор становится
       бессмысленным до тех пор, пока файл не в руках.

       ЦЕНА, КОТОРУЮ СОВЕТ ОБЯЗАН НАЗВАТЬ ПЕРВОЙ. Потерять файл — то же
       самое, что забыть слово: спасает только код восстановления (D-266),
       если он заведён. Второй ключ
       делает хранилище сильнее РОВНО НАСТОЛЬКО, насколько надёжно человек
       хранит файл отдельно от машины. Поэтому он не включается сам и не
       предлагается по умолчанию.

       ЧЕГО ОН НЕ ДАЁТ: он не спасает от того, у кого И диск, И слово, И файл.
       Он не делает шифр сильнее. Он убирает возможность подбирать слово,
       имея один только диск.

       Охраняется tools/second-key-check.mjs. */
    secondKey: function () {
      var f = factorOf(lockRecord());
      return { on: !!f, kind: f ? f.kind : null };
    },
    /* Ключ рождается здесь, а не выбирается из своих файлов: чужой файл можно
       случайно изменить, пересохранить или выложить, и он перестанет быть
       ключом молча. Этот — случайные байты, у которых нет другой работы. */
    newSecondKey: function () {
      var b = new Uint8Array(512);
      window.crypto.getRandomValues(b);
      return b;
    },
    setSecondKey: function (password, fileBytes, duressPassword) {
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (factorOf(rec)) return Promise.reject(new Error("already"));
      if (!fileBytes || !fileBytes.length) return Promise.reject(new Error("no-file"));
      var saltB64 = saltOf(rec);
      var fsalt = new Uint8Array(32);
      window.crypto.getRandomValues(fsalt);
      var fsaltB64 = b64(fsalt);
      var master0 = null, master1 = null, fsec = null, fsecOld = null;
      return factorFor(rec, null).then(function (fo) {
        fsecOld = fo;
        return openDoors(rec, password, fsecOld);
      }).then(function (m) {
        if (!m) return false;
        if (vaultDoor !== 0) return true;        /* из тревожного мира — молча «готово» */
        master0 = m;
        if (!duressPassword) return null;
        return openDoors(rec, duressPassword, fsecOld).then(function (m2) { master1 = m2; return null; });
      }).then(function (early) {
        if (early === false || early === true) return early;
        return factorSecret(fileBytes, fsaltB64).then(function (fs) {
          return mixFactors(fs, hwNow(rec));
        }).then(function (fs) {
          fsec = fs;
          return makeDoor(password, master0, saltB64, fsec, costOf(rec));
        }).then(function (door0) {
          var second = master1 ? makeDoor(duressPassword, master1, saltB64, fsec, costOf(rec)) : Promise.resolve(randomDoor());
          return second.then(function (door1) {
            var next = lockRecord() || {};
            next.v = hwOf(next) ? 5 : 4;
            next.salt = saltB64;
            next.factor = { kind: "file", salt: fsaltB64 };
            next.doors = [door0, door1];
            delete next.wrapIv; delete next.wrap;
            lsSet(LOCK_KEY, JSON.stringify(next));
            vaultDoor = 0;
            return true;
          });
        });
      });
    },
    clearSecondKey: function (password, fileBytes, duressPassword) {
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (!factorOf(rec)) return Promise.resolve(true);
      var saltB64 = saltOf(rec);
      var master0 = null, master1 = null;
      return factorFor(rec, fileBytes).then(function (fsec) {
        return openDoors(rec, password, fsec).then(function (m) {
          if (!m) return false;
          if (vaultDoor !== 0) return true;
          master0 = m;
          if (!duressPassword) return null;
          return openDoors(rec, duressPassword, fsec).then(function (m2) { master1 = m2; return null; });
        });
      }).then(function (early) {
        if (early === false || early === true) return early;
        /* Снимается файл — ключ устройства остаётся (D-276). */
        return mixFactors(null, hwNow(rec)).then(function (fsecNo) {
        return makeDoor(password, master0, saltB64, fsecNo, costOf(rec)).then(function (door0) {
          var second = master1 ? makeDoor(duressPassword, master1, saltB64, fsecNo, costOf(rec)) : Promise.resolve(randomDoor());
          return second.then(function (door1) {
            var next = lockRecord() || {};
            next.v = hwOf(next) ? 5 : 3;
            next.salt = saltB64;
            delete next.factor;
            next.doors = [door0, door1];
            lsSet(LOCK_KEY, JSON.stringify(next));
            vaultDoor = 0;
            return true;
          });
        });
        });
      });
    },

    /* ── УСИЛИТЬ ЗАМОК ПАМЯТЬЮ (D-275) ────────────────────────────────────
       Замок, сделанный до D-275, растягивает слово только временем. Здесь
       его двери переделываются ценой с памятью; мастер-ключ и конверты не
       трогаются — меняется лишь то, чем открывается мастер-ключ.
       ПОЧЕМУ НЕ МОЛЧА ПРИ ВХОДЕ. Все двери замка обязаны быть одной цены
       (D-266): растяжка считается один раз и пробуется на всех. Главную
       дверь можно переделать словом, которое человек только что ввёл, —
       тревожную нельзя: её слова система не знает. Молчаливое усиление
       убило бы тревожный мир — ровно тот урок D-266. Поэтому усиление —
       действие человека: он вводит слово и, если заводил, тревожное. Без
       тревожного слова вторая дверь становится шумом, и это сказано в окне
       ДО нажатия. Неверное тревожное слово не принимается: иначе опечатка
       стирала бы мир.
       Из тревожного мира — молча «готово» и ничего не меняется (D-203). */
    strengthen: function (password, duressPassword, secondKeyFile) {
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      var a2 = todayA2();
      if (!a2) return Promise.reject(new Error("no-argon2"));
      var cost = costOf(rec);
      if (cost[2]) return Promise.resolve(true);
      var saltB64 = saltOf(rec), master0 = null, master1 = null, fsec = null;
      return factorFor(rec, secondKeyFile).then(function (fs) {
        fsec = fs;
        return openDoors(rec, password, fsec);
      }).then(function (m) {
        if (!m) return false;
        if (vaultDoor !== 0) return true;
        master0 = m;
        if (!duressPassword) return null;
        return openDoors(rec, duressPassword, fsec).then(function (m2) {
          if (!m2 || vaultDoor !== 1) return "duress-wrong";
          master1 = m2;
          return null;
        });
      }).then(function (early) {
        if (early === false || early === true) { vaultDoor = 0; return early; }
        if (early === "duress-wrong") { vaultDoor = 0; return Promise.reject(new Error("duress-wrong")); }
        var next = [cost[0], cost[1], a2];
        return makeDoor(password, master0, saltB64, fsec, next).then(function (door0) {
          var second = master1 ? makeDoor(duressPassword, master1, saltB64, fsec, next) : Promise.resolve(randomDoor());
          return second.then(function (door1) {
            var fresh = lockRecord() || {};
            fresh.salt = saltB64;
            fresh.kdf = ["PBKDF2-SHA512:" + cost[0], "PBKDF2-SHA256:" + cost[1], a2Label(a2)];
            fresh.doors = [door0, door1];
            delete fresh.wrapIv; delete fresh.wrap;
            lsSet(LOCK_KEY, JSON.stringify(fresh));
            master0.fill(0); if (master1) master1.fill(0);
            vaultDoor = 0;
            return true;
          });
        });
      });
    },
    /* ── КЛЮЧ УСТРОЙСТВА: состояние, вопрос, привязка, снятие (D-276) ───── */
    hwState: function () { var rec = lockRecord(); return { on: !!hwOf(rec), can: hwAvailable() }; },
    hwAsk: function () { return hwAsk(lockRecord()); },
    hwEnroll: function (password, secondKeyFile, duressPassword) {
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (!vaultOpen) return Promise.reject(new Error("closed"));
      if (hwOf(rec)) return Promise.reject(new Error("already"));
      if (!hwAvailable()) return Promise.reject(new Error("no-webauthn"));
      var prfSalt = new Uint8Array(32), userId = new Uint8Array(16), challenge = new Uint8Array(32);
      window.crypto.getRandomValues(prfSalt); window.crypto.getRandomValues(userId); window.crypto.getRandomValues(challenge);
      var rp = String(location.hostname || "");
      var cred = null, secret = null, fsecOld = null, master0 = null, master1 = null, fromDuress = false;
      return factorFor(rec, secondKeyFile).then(function (fo) {
        fsecOld = fo;
        return openDoors(rec, password, fsecOld);
      }).then(function (m) {
        if (!m) return false;
        fromDuress = vaultDoor !== 0;
        master0 = m;
        if (fromDuress || !duressPassword) return true;
        return openDoors(rec, duressPassword, fsecOld).then(function (m2) {
          if (!m2 || vaultDoor !== 1) return "duress-wrong";
          master1 = m2;
          return true;
        });
      }).then(function (st) {
        vaultDoor = fromDuress ? vaultDoor : 0;
        if (st === false) return false;
        if (st === "duress-wrong") return Promise.reject(new Error("duress-wrong"));
        /* Учётка заводится у устройства и ТУТ ЖЕ спрашивается: ключ, который
           не ответил на вопрос, в замок не входит. */
        return navigator.credentials.create({ publicKey: {
          rp: { name: "sys.baby", id: rp },
          user: { id: userId, name: "sys.baby", displayName: "sys.baby" },
          challenge: challenge,
          pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
          authenticatorSelection: { userVerification: "required", residentKey: "preferred" },
          timeout: 120000,
          extensions: { prf: { eval: { first: prfSalt } } }
        } }).then(function (c) {
          cred = c;
          var ext = c && c.getClientExtensionResults ? c.getClientExtensionResults() : null;
          if (!ext || !ext.prf || ext.prf.enabled === false) throw new Error("no-prf");
          var first = ext.prf.results && ext.prf.results.first;
          if (first) return new Uint8Array(first);
          var ch2 = new Uint8Array(32); window.crypto.getRandomValues(ch2);
          return navigator.credentials.get({ publicKey: {
            challenge: ch2, rpId: rp, userVerification: "required", timeout: 120000,
            allowCredentials: [{ type: "public-key", id: c.rawId }],
            extensions: { prf: { eval: { first: prfSalt } } }
          } }).then(function (a) {
            var e2 = a && a.getClientExtensionResults ? a.getClientExtensionResults() : null;
            var f2 = e2 && e2.prf && e2.prf.results && e2.prf.results.first;
            if (!f2) throw new Error("no-prf");
            return new Uint8Array(f2);
          });
        }).then(function (sec) {
          secret = sec;
          /* Из тревожного мира — учётка заведена (снаружи это видно и так),
             а замок не тронут: признаться, что мир не первый, значило бы
             отдать главный (D-203). */
          if (fromDuress) { master0.fill(0); return true; }
          var fileSec = null;
          var f = factorOf(rec);
          return (f ? factorSecret(secondKeyFile || new Uint8Array(0), f.salt) : Promise.resolve(null)).then(function (fs) {
            fileSec = fs;
            return mixFactors(fileSec, secret);
          }).then(function (fsecNew) {
            var cost = costOf(rec), saltB64 = saltOf(rec);
            return makeDoor(password, master0, saltB64, fsecNew, cost).then(function (door0) {
              var second = master1 ? makeDoor(duressPassword, master1, saltB64, fsecNew, cost) : Promise.resolve(randomDoor());
              return second.then(function (door1) {
                var next = lockRecord() || {};
                next.v = 5;
                next.salt = saltB64;
                next.hw = { kind: "webauthn-prf", id: b64(new Uint8Array(cred.rawId)), salt: b64(prfSalt), rp: rp };
                next.doors = [door0, door1];
                delete next.wrapIv; delete next.wrap;
                lsSet(LOCK_KEY, JSON.stringify(next));
                hwSecret = secret;
                master0.fill(0); if (master1) master1.fill(0);
                vaultDoor = 0;
                return true;
              });
            });
          });
        });
      });
    },
    hwRemove: function (password, secondKeyFile, duressPassword) {
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (!hwOf(rec)) return Promise.resolve(true);
      var fsecOld = null, master0 = null, master1 = null, fileSec = null;
      return factorFor(rec, secondKeyFile).then(function (fo) {
        fsecOld = fo;
        return openDoors(rec, password, fsecOld);
      }).then(function (m) {
        if (!m) return false;
        if (vaultDoor !== 0) return true;
        master0 = m;
        if (!duressPassword) return null;
        return openDoors(rec, duressPassword, fsecOld).then(function (m2) {
          if (!m2 || vaultDoor !== 1) return "duress-wrong";
          master1 = m2; return null;
        });
      }).then(function (early) {
        if (early === false || early === true) return early;
        if (early === "duress-wrong") { vaultDoor = 0; return Promise.reject(new Error("duress-wrong")); }
        var f = factorOf(rec);
        return (f ? factorSecret(secondKeyFile || new Uint8Array(0), f.salt) : Promise.resolve(null)).then(function (fs) {
          fileSec = fs;
          var cost = costOf(rec), saltB64 = saltOf(rec);
          return makeDoor(password, master0, saltB64, fileSec, cost).then(function (door0) {
            var second = master1 ? makeDoor(duressPassword, master1, saltB64, fileSec, cost) : Promise.resolve(randomDoor());
            return second.then(function (door1) {
              var next = lockRecord() || {};
              next.v = hwOf(next) ? 5 : (factorOf(next) ? 4 : 3);
              next.salt = saltB64;
              delete next.hw;
              next.doors = [door0, door1];
              lsSet(LOCK_KEY, JSON.stringify(next));
              hwSecret = null;
              master0.fill(0); if (master1) master1.fill(0);
              vaultDoor = 0;
              return true;
            });
          });
        });
      });
    },

    /* Сделан ли этот замок ценой с памятью — видно в его записи и так. */
    strong: function () { var rec = lockRecord(); return !!(rec && costOf(rec)[2]); },

    setDuress: function (mainPassword, duressPassword, secondKeyFile) {
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (String(duressPassword || "").length < 4) return Promise.reject(new Error("short"));
      if (String(duressPassword) === String(mainPassword)) return Promise.reject(new Error("same"));
      return window.sbVault.unlock(mainPassword, secondKeyFile).then(function (okp) {
        if (!okp) return false;
        if (vaultDoor !== 0) return true;          /* см. выше: молча и «готово» */
        var m = new Uint8Array(32);
        window.crypto.getRandomValues(m);
        var next0 = lockRecord() || {};
        return factorFor(next0, secondKeyFile).then(function (fsec) {
        return makeDoor(duressPassword, m, saltOf(next0), fsec, costOf(next0)).then(function (door) {
          var next = lockRecord() || {};
          var doors = doorsOf(next).map(function (d) { return { wrapIv: d.wrapIv, wrap: d.wrap }; });
          while (doors.length < 2) doors.push(randomDoor());
          doors[1] = door;
          /* Замок со вторым ключом остаётся четвёртой редакцией: понизить его
             здесь значило бы молча снять второй ключ вместе с тревожным. */
          next.v = hwOf(next) ? 5 : (factorOf(next) ? 4 : 3);
          next.salt = saltOf(next); next.doors = doors;
          delete next.wrapIv; delete next.wrap;
          lsSet(LOCK_KEY, JSON.stringify(next));
          m.fill(0);
          return true;
        });
        });
      });
    },

    /* Снять тревожное слово: вторая дверь становится случайным шумом, и мир
       за ней теряется навсегда — открыть его больше нечем. Записи того мира
       остаются на диске неотличимым от шума набором конвертов, и это не
       недосмотр: диск, с которого вдруг исчезла половина конвертов, сам
       рассказывает, что там что-то было. */
    clearDuress: function (mainPassword, secondKeyFile) {
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      return window.sbVault.unlock(mainPassword, secondKeyFile).then(function (okp) {
        if (!okp) return false;
        if (vaultDoor !== 0) return true;
        var next = lockRecord() || {};
        var doors = doorsOf(next).map(function (d) { return { wrapIv: d.wrapIv, wrap: d.wrap }; });
        while (doors.length < 2) doors.push(randomDoor());
        doors[1] = randomDoor();
        /* Замок со вторым ключом остаётся четвёртой редакцией (D-266): понизить
           его здесь значило бы стереть запись о втором ключе при дверях,
           сделанных с ним, — и не открыть больше ничего. */
        next.v = hwOf(next) ? 5 : (factorOf(next) ? 4 : 3); next.salt = saltOf(next); next.doors = doors;
        delete next.wrapIv; delete next.wrap;
        lsSet(LOCK_KEY, JSON.stringify(next));
        return true;
      });
    },

    /* ── КОД ВОССТАНОВЛЕНИЯ (D-266) — см. шапку «ЗАПАСНАЯ ДВЕРЬ» ─────────── */
    recoveryMake: function (password, secondKeyFile) {
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (!vaultOpen) return Promise.reject(new Error("closed"));
      var saved = vaultDoor;
      return factorFor(rec, secondKeyFile).then(function (fsec) {
        return openDoors(rec, password, fsec);
      }).then(function (m) {
        var door = vaultDoor;
        vaultDoor = saved;
        if (!m) return false;
        var code = spareNew();
        /* Из тревожного мира — код, который выглядит кодом и не открывает
           ничего: запасная дверь главного мира не трогается, а признаться, что
           мир не первый, значило бы отдать главный (D-203). */
        if (door !== 0) { m.fill(0); markSpare(true); return code; }
        return makeSpare(code, m, saltOf(rec)).then(function (sp) {
          m.fill(0);
          var next = lockRecord() || {};
          next.spare = sp;
          lsSet(LOCK_KEY, JSON.stringify(next));
          markSpare(true);
          return code;
        });
      });
    },
    recoveryState: function () {
      if (!vaultOpen) return null;
      var at = parseInt(lsGet(SPARE_KEY) || "", 10);
      return { at: at > 0 ? at : null };
    },
    /* Открыть кодом, у двери, когда слово забыто. Главный мир встаёт под
       НОВЫМ словом, код расходуется. Был второй ключ — он снимается: человек,
       потерявший файл, иначе остался бы за дверью и с кодом. Вместе с ним
       теряется тревожный мир — его дверь сделана с файлом, и открыть её
       больше нечем; это сказано у двери до нажатия. */
    recover: function (code, newPassword) {
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (String(newPassword || "").length < 4) return Promise.reject(new Error("short"));
      var sp = rec.spare || randomSpare();
      var sk = costOf({ kdf: sp.kdf });
      var saltB64 = saltOf(rec);
      return deriveKEK(spareSecret(spareNorm(code)), saltB64, sk[0], sk[1], null).then(function (kek) {
        var wrapped, iv;
        try { wrapped = unb64(sp.wrap); iv = unb64(sp.wrapIv); } catch (e) { return null; }
        return window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, kek, wrapped)
          .then(function (buf) { return new Uint8Array(buf); }, function () { return null; });
      }).then(function (master) {
        if (!master) return false;
        var hadFactor = !!factorOf(rec) || !!hwOf(rec);
        return makeDoor(newPassword, master, saltB64, null, costOf(rec)).then(function (door0) {
          master.fill(0);
          var next = lockRecord() || {};
          var doors = doorsOf(next).map(function (d) { return { wrapIv: d.wrapIv, wrap: d.wrap }; });
          while (doors.length < 2) doors.push(randomDoor());
          doors[0] = door0;
          if (hadFactor) { doors[1] = randomDoor(); delete next.factor; delete next.hw; hwSecret = null; }
          next.v = 3;
          next.salt = saltB64;
          next.doors = doors;
          next.spare = randomSpare();
          delete next.wrapIv; delete next.wrap;
          lsSet(LOCK_KEY, JSON.stringify(next));
          return window.sbVault.unlock(newPassword);
        }).then(function (okp) {
          if (okp) markSpare(false);
          return okp;
        });
      });
    },

    /* ── СМЕНА ПАРОЛЯ БЕЗ ПЕРЕШИФРОВКИ ─────────────────────────────────────
       Пароль не шифрует данные — он держит конверт с мастер-ключом. Поэтому
       смена пароля переклеивает ОДИН конверт: новая соль, новая растяжка,
       новый KEK, тот же мастер внутри. Конверты с данными на диске остаются
       байт в байт теми же — это и проверяет закон. Перешифровка всего
       хранилища ради нового слова была бы долгой (на телефоне — минуты) и
       опасной: обрыв посередине оставил бы половину данных на старом ключе,
       а половину на новом. */
    rekey: function (oldPassword, newPassword, secondKeyFile) {
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (String(newPassword || "").length < 4) return Promise.reject(new Error("short"));
      var fsecNew = null;
      return window.sbVault.unlock(oldPassword, secondKeyFile).then(function (okp) {
        if (!okp || !vaultMaster) return false;
        /* Второй ключ входит и в новую дверь: смена слова не снимает его
           (D-266 — прежде смена со вторым ключом не проходила вовсе, а если бы
           прошла, записала бы дверь без него и третью редакцию замка). */
        return factorFor(lockRecord(), secondKeyFile).then(function (f) { fsecNew = f; return true; });
      }).then(function (okp) {
        if (!okp || !vaultMaster) return false;
        /* СОЛЬ ЗАМКА НЕ МЕНЯЕТСЯ ПРИ СМЕНЕ ПАРОЛЯ, и это выбор, а не небрежность.
           Соль общая на обе двери; сменить её значило бы заново завернуть и
           вторую дверь — а её пароль тому, кто меняет первый, неизвестен.
           Смена соли молча убивала бы тревожный мир. Соль остаётся случайной,
           уникальной для этого устройства и никогда не покидает его; её
           задача — не дать считать таблицы заранее, и смена пароля этой
           задачи не касается. */
        var wrapIv = new Uint8Array(12);
        window.crypto.getRandomValues(wrapIv);
        var saltB64 = saltOf(lockRecord() || {});
        /* Цена — ЦЕНА ЗАМКА, а не сегодняшняя (D-266): другие двери сделаны
           ею, и растяжка считается одна на все. */
        var cost = costOf(lockRecord() || {});
        return deriveKEK(newPassword, saltB64, cost[0], cost[1], fsecNew, cost[2]).then(function (kek) {
          return window.crypto.subtle.encrypt({ name: "AES-GCM", iv: wrapIv }, kek, vaultMaster);
        }).then(function (wrapped) {
          var next = lockRecord() || {};
          var doors = doorsOf(next).slice();
          /* Переклеивается ТА дверь, через которую вошли: остальные остаются
             байт в байт. Иначе смена главного пароля стирала бы тревожный —
             молча и необратимо. Какая это дверь, знает только тот, кто вошёл:
             наружу это число не отдаётся. */
          var mine = (typeof vaultDoor === "number" && vaultDoor >= 0) ? vaultDoor : 0;
          doors = doors.map(function (d) { return { wrapIv: d.wrapIv, wrap: d.wrap }; });
          doors[mine] = { wrapIv: b64(wrapIv), wrap: b64(wrapped) };
          next.v = hwOf(next) ? 5 : (factorOf(next) ? 4 : 3);
          next.salt = saltB64;
          /* Проход памятью остаётся в записи (D-275): двери сделаны им, и без
             этой строки после смены слова замок не открылся бы никогда. */
          next.kdf = ["PBKDF2-SHA512:" + cost[0], "PBKDF2-SHA256:" + cost[1]].concat(cost[2] ? [a2Label(cost[2])] : []);
          next.doors = doors;
          delete next.wrapIv; delete next.wrap;
          lsSet(LOCK_KEY, JSON.stringify(next));
          return true;
        });
      });
    }
  };

  /* ── ОТКРЫТЬ ВСЕ КОНВЕРТЫ И РАССТАВИТЬ ПО ПАМЯТИ ──────────────────────── */
  function openAllSealed(ks) {
    var names = sealedNamesNow();
    var jobs = names.map(function (phys) {
      var raw = rawStore.get.call(window.localStorage, phys);
      if (raw == null) return Promise.resolve(null);
      return openPair(ks, raw).then(function (p) { return { phys: phys, k: p.name, v: p.value }; },
        function () { return null; });
    });
    return Promise.all(jobs).then(function (rows) {
      var pfx = activeProfile() === "local" ? "" : PROFILE_PREFIX + activeProfile() + ".";
      var i;
      for (i = 0; i < rows.length; i++) {
        var it = rows[i];
        if (!it) continue;
        /* И в память границы: с этого мига всякий, кто спросит хранилище
           напрямую, получит открытое значение, а на диске останется конверт. */
        mem.set(it.k, it.v);
        nameMap.set(it.k, it.phys);
        /* В памяти ключи ЛОГИЧЕСКИЕ (без приставки профиля) — такими их
           спрашивает sbDB.get. Приставку снимаем здесь, в единственном
           месте, где физическое имя превращается в логическое. */
        /* ── ЧУЖОЙ ПРОФИЛЬ НЕ ВХОДИТ В СВОЮ ПАМЯТЬ (D-274) ─────────────────
           Здесь стояло «есть приставка своего профиля — снять её, нет — взять
           имя как есть». Но «как есть» — это ключи ГОСТЯ: у них приставки нет
           вовсе. Под своим именем записи гостя вставали в память на те же
           логические места, и какая победит, решал порядок расшифровки.
           Нашёл lock-memory-check: под именем «ПРОБА запись» лежала в
           хранилище, а комната видела «[]» — пустые Записи гостя. Каждый
           второй-третий вход. Теперь в память идёт ТОЛЬКО своё: под именем —
           ключи со своей приставкой, гостем — ключи без чужих приставок.
           Конверт остаётся открытым в своём месте (mem) — чужого он не
           подменяет, потому что там лежат физические имена. */
        var logical = null;
        if (pfx) { if (it.k.indexOf(pfx) === 0) logical = it.k.slice(pfx.length); }
        else if (it.k.indexOf(PROFILE_PREFIX) !== 0) logical = it.k;
        if (logical !== null) cache.set(logical, it.v);
      }
      vaultKeys = ks;
      vaultOpen = true;
      /* Главный мир запечатывает все открытые вещи: открытая вещь на диске
         запертой системы — утечка, чья бы она ни была. Второй мир — только
         свои: запечатать чужую вещь чужим ключом значило бы отнять её у
         хозяина. */
      sealThingsNow(ks, vaultDoor !== 0);
      levelDisk(ks).then(function () { return rollOnce(ks); });
      rollKeep(ks);
      /* Мир за дверью вернулся весь разом — копии памяти, снятые до двери,
         обязаны перечитаться (D-274). Эпоха меняется ДО объявления: всякий,
         кто услышит «открыто», спросит уже новую. */
      bumpEpoch("open");
      if (window.sbBus && window.sbBus.emit) window.sbBus.emit("vault:change", { locked: true, open: true });
      /* Вид системы возвращается вместе со словами: до этого мига комната
         была не своя, потому что и её запирали (D-164). */
      if (typeof window.sbApplyStoredAppearance === "function") {
        try { window.sbApplyStoredAppearance(); } catch (e) { /* ignore */ }
      }
      if (typeof window.sbNotesStore === "object" && window.sbNotesStore.notify) {
        try { window.sbNotesStore.notify(); } catch (e) { /* ignore */ }
      }
      return true;
    });
  }

  /* ── ПЕРЕЕЗД СО СТАРОГО ЗАМКА ─────────────────────────────────────────────
     Замок v1 остался у тех, кто запер систему до 27.08.2026. Верный пароль
     обязан открыть его и там — и тут же переклеить всё на новый лад. Порядок
     шагов выбран так, чтобы обрыв питания в любой точке не стоил ни одного
     ключа: сперва всё читается в память, затем пишутся новые конверты, затем
     новая запись замка, и только последними стираются старые. */
  function migrateV1(password, rec) {
    var names = protectedKeysNow();     /* у v1 конверты лежали под своими именами */
    return deriveVaultKeyV1(password, rec.salt).then(function (key) {
      return openTextV1(key, rec.check).then(function (word) {
        if (word !== "sys.baby") return false;
        var jobs = names.map(function (k) {
          var raw = rawStore.get.call(window.localStorage, k);
          if (raw == null) return Promise.resolve(null);
          return openTextV1(key, raw).then(function (txt) { return { k: k, v: txt }; },
            function () { return null; });
        });
        return Promise.all(jobs).then(function (rows) {
          var pairs = rows.filter(Boolean);
          lsDel(LOCK_KEY);
          return buildLock(password, pairs).then(function (ks) {
            return openAllSealed(ks);
          });
        });
      }, function () { return false; });
    }, function () { return false; });
  }

  /* ── ЗАПЕРТОЕ ПИШЕТСЯ ЗАПЕРТЫМ ────────────────────────────────────────────
     Пока сеанс открыт, слова лежат в памяти расшифрованными — на этом стоит
     весь синхронный sbDB.get, которым пользуются все приложения. А на диск
     они обязаны уходить в конверте. Шифрование асинхронно, поэтому запись
     идёт через очередь: в хранилище всегда лежит последний ГОТОВЫЙ конверт.
     Цена названа: изменение, сделанное за миллисекунды до закрытия вкладки,
     может не успеть попасть в конверт и останется незаписанным. Потерять
     последний символ хуже, чем ничего, — но записать его открытым было бы
     хуже вдвое, а это и есть выбор между двумя бедами. */
  /* ── ЗАМОК СТОИТ НА ГРАНИЦЕ ХРАНИЛИЩА, А НЕ НАД НЕЙ (D-164) ──────────────
     Первая редакция запирала записи, шедшие через sbDB. Закон это и поймал:
     четыре ключа утекли открытыми — язык, два сторожа и заметки. Оказалось,
     что модули пишут в хранилище НАПРЯМУЮ, своими rawSet, мимо sbDB. Замок,
     охраняющий одну из нескольких дверей, не замок.
     Поэтому дверь делается ОДНА — сама Storage. Пока замок открыт:
       · запись защищённого ключа НЕ ДОХОДИТ ДО ДИСКА открытой: значение
         ложится в память, а на диск уходит конверт, когда шифр готов;
       · чтение возвращает то, что в памяти, — для всей системы ничего не
         меняется, и ни одно приложение об этом не знает.
     ПОЧЕМУ ПОДМЕНА, А НЕ ПРАВКА ВСЕХ МОДУЛЕЙ. Правка перечисляет known
     writers — а замок обязан держать и тех, о ком мы не знаем, включая
     завтрашние. Список пишущих не может быть полным; граница — может. */
  var sealQueue = Promise.resolve();
  var mem = new Map();               /* открытые значения защищённых ключей */
  /* Настоящие имена того, что сейчас открыто. Спрашивает lsKeys — перечисление
     обязано видеть то же, что видит чтение (D-172). */
  function vaultOpenNames() {
    var out = [];
    mem.forEach(function (v, k) { if (v != null) out.push(k); });
    return out;
  }
  var nameMap = new Map();           /* настоящее имя → имя конверта на диске */
  /* ── ЩЕЛЬ МЕЖДУ «ЕЩЁ НЕ ЗАПЕРТО» И «УЖЕ ЗАПЕРТО» (D-170, нашёл закон) ────
     Поворот ключа занимает полсекунды: столько считается растяжка пароля. Всё
     это время замок ЕЩЁ не записан (vaultLocked() ложь) и сеанс ЕЩЁ не открыт
     (vaultOpen ложь) — то есть страж пропускал записи на диск ОТКРЫТЫМИ. Закон
     поймал ровно один такой ключ, sysbaby.boot.seen, и был прав: щель в
     полсекунды — это щель. Теперь у замка есть третье состояние, «запирается»:
     записи в это время не идут на диск вовсе, а копятся здесь и уезжают в
     конвертах тем же поворотом ключа. */
  var sealing = false;
  var pending = new Map();

  var rawStore = {
    get: window.localStorage.getItem,
    set: window.localStorage.setItem,
    del: window.localStorage.removeItem
  };
  function scheduleSeal(k) {
    var val = mem.get(k);
    sealQueue = sealQueue.then(function () {
      if (!vaultOpen || !vaultKeys) return null;
      if (mem.get(k) !== val) return null;          /* уже перезаписано — сеем свежее */
      var known = nameMap.get(k);
      var namePromise = known ? Promise.resolve(known) : sealedName(vaultKeys, k);
      return namePromise.then(function (phys) {
        nameMap.set(k, phys);
        if (val == null) { rawStore.del.call(window.localStorage, phys); return null; }
        var fresh = rawStore.get.call(window.localStorage, phys) == null;
        var keys = vaultKeys;
        return sealPair(keys, k, val).then(function (env) {
          /* СРАЗУ, А НЕ ОТЛОЖЕННО. Отложенная подсыпка оставляла окно в
             четыреста миллисекунд, в котором число конвертов не круглое —
             и в это окно диск говорит правду. Окна быть не должно вовсе.
             Новый конверт при этом занимает место СВОЕЙ пустышки. */
          return (fresh ? makeRoom(keys) : Promise.resolve()).then(function () {
            rawStore.set.call(window.localStorage, phys, env);
            /* ── МИГ ЗАПЕЧАТЫВАНИЯ ОБЪЯВЛЯЕТСЯ НАРУЖУ (D-219) ─────────────
               Человек дописал строку — и она ушла в конверт. До сих пор это
               было совершенно невидимо: система делала самое важное молча.
               Объявляется ИМЯ КЛЮЧА и ИМЯ КОНВЕРТА, чтобы стол показывал
               настоящую печать этого конверта, а не рисовал похожую. */
            if (window.sbBus && window.sbBus.emit) {
              window.sbBus.emit("vault:sealed", { key: k, name: phys, at: Date.now() });
            }
            return levelDisk(keys);
          });
        });
      });
    }).catch(function (e) { if (window.console) console.error("[vault] seal failed", e); });
  }
  (function guardStorage() {
    var ls = window.localStorage;
    /* ── ПОДМЕНА СТАВИТСЯ НА ОБРАЗЕЦ, А НЕ НА ПРЕДМЕТ (D-170, нашла доска) ──
       Прежняя редакция писала ls.setItem = … — то есть заводила СОБСТВЕННОЕ
       ПЕРЕЧИСЛИМОЕ свойство прямо на хранилище, и Object.keys(localStorage)
       начинал отдавать «setItem», «getItem», «removeItem» вперемешку с
       настоящими ключами. Закон smoke-shell показал их как три ключа без
       хозяина — и был прав: всякий, кто перебирает хранилище (выгрузка
       профиля в том числе), увидел бы их.
       Попытка сделать те же свойства неперечислимыми через defineProperty
       ЗАМОК СЛОМАЛА: Storage — не обычный объект, у него свои правила для
       определения свойств, и подмена не встала вовсе. Это тоже нашёл закон,
       следующим же прогоном, и это тот самый случай, когда чинить надо не
       заплатой, а сменой места.
       Поэтому подмена стоит на ОБРАЗЦЕ — Storage.prototype, — и действует
       только для localStorage: sessionStorage чужой, и трогать его замок не
       имеет права. Сам предмет остаётся нетронутым, и перечисление его
       ключей отдаёт ровно ключи.
       ГРАНИЦА НАЗВАНА ВСЛУХ. Подмена держит методы getItem/setItem/removeItem
       — ими пользуется вся система и все её приложения. Она НЕ держит
       обращение по имени, localStorage['ключ']: закрыть и его можно только
       подменив сам объект прокси, а это дороже и опаснее, чем польза, пока в
       системе нет ни одного места, которое пишет так. Закон vault-lock-check
       нарочно смотрит на диск именно этой дверью — чтобы мерить хранилище, а
       не рассказ сторожа о хранилище. */
    var proto = window.Storage && window.Storage.prototype;
    function isOurs(that) { return that === ls; }
    function shadow(name, fn) {
      if (proto) proto[name] = fn; else ls[name] = fn;
    }
    try {
      shadow("setItem", function (k, v) {
        if (!isOurs(this)) return rawStore.set.call(this, k, v);
        /* ── ПОСЛЕ УХОДА НЕ ПИШЕТСЯ НИЧЕГО (D-174) ─────────────────────────
           У системы есть отложенные записи и таймеры. Любой из них воскресил
           бы стёртое через миг после уборки — и человек, нажавший «стереть
           всё», нашёл бы на диске свежие следы своего же ухода. */
        if (window.sbVanishing) return;
        if (isProtectedKey(k)) {
          if (vaultOpen) {
            mem.set(String(k), String(v));
            scheduleSeal(String(k));
            return;
          }
          if (sealing) { pending.set(String(k), String(v)); return; }
          /* ── ЗАПЕРТОЕ НЕ ПЕРЕЗАПИСЫВАЕТСЯ (D-164) ────────────────────────
             Пока замок заперт и ещё не открыт, система живёт на пустом месте:
             она не видит своих данных и потому считает, что их нет. Первая
             редакция пропускала такие записи на диск — и загрузка МОЛЧА
             затирала конверт пустым списком заметок. Закон поймал это в тот
             же прогон: после верного пароля возвращалось ноль заметок.
             Потерять данные, отпирая замок, — худшее, что замок может
             сделать. Пока не открыт — на диск не пишем ничего. */
          if (vaultLocked()) return;
        }
        return rawStore.set.call(ls, k, v);
      });
      shadow("getItem", function (k) {
        if (!isOurs(this)) return rawStore.get.call(this, k);
        if (vaultOpen && mem.has(String(k))) return mem.get(String(k));
        return rawStore.get.call(ls, k);
      });
      shadow("removeItem", function (k) {
        if (!isOurs(this)) return rawStore.del.call(this, k);
        if (window.sbVanishing) return rawStore.del.call(ls, k);   /* стирать — можно всегда */
        if (isProtectedKey(k)) {
          if (vaultOpen) { mem.set(String(k), null); scheduleSeal(String(k)); return; }
          if (sealing) { pending.set(String(k), null); return; }
          if (vaultLocked()) return;          /* та же причина: не стирать вслепую */
        }
        return rawStore.del.call(ls, k);
      });
    } catch (e) { if (window.console) console.error("[vault] storage guard failed", e); }
  })();
  window.sbVaultSettled = function () { return sealQueue; };

  /* ═══════════════════════════════════════════════════════════════════════
     РАЗОВАЯ УБОРКА ЗАВОДСКИХ ПРИМЕРОВ · решение D-147

     ПОВОД, дословно от основателя. Сперва: «сейчас полностью очистите
     содержимое приложений от всяких примеров и мусора. Система должна
     выглядеть чистой». Затем, со снимком своего Хранилища, где стоят Demo
     Workspace, Templates и Journal: «система по прежнему не очищена от
     мусора и примеров».

     ЧТО БЫЛО СДЕЛАНО НЕ ДО КОНЦА. D-142 убрал ЗАВОД: новые профили приходят
     пустыми. Но у того, кто открывал систему раньше, примеры УЖЕ ЛЕЖАТ в
     его собственном хранилище, и очистка завода их не трогает. Формально
     просьба исполнена; по существу — нет: основатель просил не «чтобы у
     будущих было чисто», а чтобы стало чисто У НЕГО.

     ПОЧЕМУ ЗДЕСЬ, А НЕ В КАЖДОМ ПРИЛОЖЕНИИ. Уборка — ОДНО событие: она
     случается однажды и целиком. Разложенная по четырём приложениям, она
     стала бы четырьмя событиями с четырьмя сторожами, и порядок загрузки
     решал бы, что убрано, а что нет. Здесь она происходит ДО того, как хоть
     одно приложение прочитало своё хранилище: store.js грузится первым.
     Знание чужих форм — цена, которую платит любая миграция; она датирована
     и одноразова, и в этом её отличие от постоянной связи.

     ГЛАВНОЕ ПРАВИЛО: УНОСИТСЯ ТОЛЬКО СВОЁ. Тронутое человеком остаётся —
     папка, куда он положил файл; разговор, где он написал; письмо, которое
     он завёл сам. Узнаётся своё не по имени (имя человек может повторить),
     а по ОТПЕЧАТКУ посаженного текста: «SAMPLE DATA», «SAMPLE INVOICE»,
     заголовок шаблона, docId дневникового слоя. Ни одну из этих строк не
     напечатать случайно.

     Охраняется tools/demo-sweep-check.mjs — на профиле, где засев ЛЕЖИТ.
     ═══════════════════════════════════════════════════════════════════════ */
  (function sweepFactoryDemo() {
    var GUARD = "sysbaby.demo.swept.v1";
    function dbGet(k) {
      try { return window.sbDB ? window.sbDB.get(k) : localStorage.getItem(k); }
      catch (e) { return null; }
    }
    function dbSet(k, v) {
      try { if (window.sbDB) window.sbDB.set(k, v); else localStorage.setItem(k, v); }
      catch (e) { /* ignore */ }
    }
    if (dbGet(GUARD) === "1") return;

    /* ---- Хранилище: папка уходит, только если ВСЁ в ней — посаженное ---- */
    var PLANTED_FILE = /SAMPLE DATA|SAMPLE INVOICE|^# Statement of Work \(template\)/;
    function plantedFile(node) {
      if (node.docId) return true;                     /* дневниковый слой */
      return PLANTED_FILE.test(String(node.content || ""));
    }
    function plantedTree(node) {
      if (!node || typeof node !== "object") return false;
      if (node.type === "file") return plantedFile(node);
      var kids = node.children || [];
      if (!kids.length) return false;                  /* пустую папку не трогаем */
      for (var i = 0; i < kids.length; i++) if (!plantedTree(kids[i])) return false;
      return true;
    }
    try {
      var vraw = dbGet("sysbaby.files.v1");
      if (vraw) {
        var tree = JSON.parse(vraw);
        if (tree && Array.isArray(tree.children)) {
          var kept = tree.children.filter(function (c) { return !plantedTree(c); });
          if (kept.length !== tree.children.length) {
            tree.children = kept;
            dbSet("sysbaby.files.v1", JSON.stringify(tree));
          }
        }
      }
    } catch (e) { if (window.console) console.error("[sweep] vault", e); }

    /* ---- Почта: письмо узнаётся по паре «адрес + тема» ------------------ */
    var PLANTED_MAIL = {
      "client@sample.demo": "Order-routing automation — go-live results",
      "client2@sample.demo": "Signed SoW — kickoff Monday?",
      "lead@sample.demo": "Interested in automating our invoicing",
      "delivery@sys.baby": "Sample rollout — staging passed",
      "build@sys.baby": "This mailbox has a real door"
    };
    try {
      var mraw = dbGet("sysbaby.mail.v2");
      if (mraw) {
        var box = JSON.parse(mraw);
        if (box && Array.isArray(box.data)) {
          var live = box.data.filter(function (m) {
            return !(m && PLANTED_MAIL[m.fromAddr] && PLANTED_MAIL[m.fromAddr] === m.subject);
          });
          if (live.length !== box.data.length) {
            box.data = live;
            dbSet("sysbaby.mail.v2", JSON.stringify(box));
          }
        }
      }
    } catch (e) { if (window.console) console.error("[sweep] mail", e); }

    /* ---- Переписка: разговор уходит, только если человек в нём молчал --- */
    var PLANTED_CONVO = {
      "Sample Client · Logistics": 1,
      "Sample Client · Retail": 1,
      "Sample Project · Delivery": 1
    };
    var PLANTED_LINE = [
      "The new order-routing automation went live this morning — dispatch time is already down about 40%.",
      "Could we scope the supplier-invoice flow for next sprint?",
      "Signed the SoW and sent it back — kickoff Monday?",
      "Received. Kickoff confirmed for Monday 10:00.",
      "Staging passed all checks. Client demo scheduled Thursday 14:00.",
      "This is a sample conversation — nothing was sent anywhere. What you write stays in this browser."
    ];
    try {
      var craw = dbGet("sysbaby.messenger.v3");
      if (craw) {
        var list = JSON.parse(craw);
        if (Array.isArray(list)) {
          var keptC = list.filter(function (c) {
            if (!c || !PLANTED_CONVO[c.name]) return true;
            var msgs = c.messages || [];
            for (var i = 0; i < msgs.length; i++) {
              if (PLANTED_LINE.indexOf(String(msgs[i] && msgs[i].text)) === -1) return true;
            }
            return false;
          });
          if (keptC.length !== list.length) dbSet("sysbaby.messenger.v3", JSON.stringify(keptC));
        }
      }
    } catch (e) { if (window.console) console.error("[sweep] whisper", e); }

    /* ---- Заметки: следы дневникового слоя узнаются по своим же именам --- */
    try {
      var nraw = dbGet("sysbaby.notes.v2");
      if (nraw) {
        var notes = JSON.parse(nraw);
        if (Array.isArray(notes)) {
          var keptN = notes.filter(function (n) {
            return !(n && (/^trace-echo-/.test(String(n.id)) || n.id === "trace-scribble-journal"));
          });
          if (keptN.length !== notes.length) dbSet("sysbaby.notes.v2", JSON.stringify(keptN));
        }
      }
    } catch (e) { if (window.console) console.error("[sweep] notes", e); }

    dbSet(GUARD, "1");
    if (window.sbDB && window.sbDB.flushSync) { try { window.sbDB.flushSync(); } catch (e) { /* ignore */ } }
  })();

})();
