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
       · восстановления пароля нет. Сервера нет — восстанавливать некому;
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
  var KDF1_ITER = 210000;             /* PBKDF2-HMAC-SHA-512 — OWASP */
  var KDF2_ITER = 600000;             /* PBKDF2-HMAC-SHA-256 — OWASP */
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

  var vaultKeys = null;         /* набор ключей сеанса — только в памяти */
  var vaultMaster = null;       /* мастер-ключ сеанса: нужен для смены пароля */
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
  function deriveKEK(password, saltB64) {
    var enc = new TextEncoder();
    var salt = unb64(saltB64);
    var subtle = window.crypto.subtle;
    return subtle.importKey("raw", enc.encode(String(password)), { name: "PBKDF2" }, false, ["deriveBits"])
      .then(function (base) {
        return subtle.deriveBits({ name: "PBKDF2", salt: salt, iterations: KDF1_ITER, hash: "SHA-512" }, base, 512);
      })
      .then(function (bits) {
        return subtle.importKey("raw", bits, { name: "PBKDF2" }, false, ["deriveBits"]);
      })
      .then(function (mid) {
        /* Вторая соль — та же соль с меткой: иначе два прохода склеились бы
           в один длинный, и второй ничего бы не добавил. */
        return subtle.deriveBits({
          name: "PBKDF2", salt: cat(salt, enc.encode("sys.baby/kek/v2")),
          iterations: KDF2_ITER, hash: "SHA-256"
        }, mid, 256);
      })
      .then(function (bits) {
        return subtle.importKey("raw", bits, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
      });
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
  function buildLock(password, pairs, keepMaster) {
    var salt = new Uint8Array(32);
    var wrapIv = new Uint8Array(12);
    var master = keepMaster ? new Uint8Array(keepMaster) : new Uint8Array(32);
    window.crypto.getRandomValues(salt);
    window.crypto.getRandomValues(wrapIv);
    if (!keepMaster) window.crypto.getRandomValues(master);
    var saltB64 = b64(salt);
    return deriveKEK(password, saltB64).then(function (kek) {
      return window.crypto.subtle.encrypt({ name: "AES-GCM", iv: wrapIv }, kek, master).then(function (wrapped) {
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
            lsSet(LOCK_KEY, JSON.stringify({
              v: 2,
              kdf: ["PBKDF2-SHA512:" + KDF1_ITER, "PBKDF2-SHA256:" + KDF2_ITER],
              ciphers: ["AES-256-CTR", "AES-256-GCM"],
              mac: "HMAC-SHA-512",
              names: "HMAC-SHA-256",
              pad: PAD_BLOCK,
              salt: saltB64,
              wrapIv: b64(wrapIv),
              wrap: b64(wrapped)
            }));
            for (i = 0; i < rows.length; i++) rawStore.del.call(window.localStorage, rows[i].from);
            vaultMaster = new Uint8Array(master);
            master.fill(0);
            return ks;
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
      if (!rec) return { v: 2, kdf: ["PBKDF2-SHA512:" + KDF1_ITER, "PBKDF2-SHA256:" + KDF2_ITER],
        ciphers: ["AES-256-CTR", "AES-256-GCM"], mac: "HMAC-SHA-512", names: "HMAC-SHA-256", pad: PAD_BLOCK };
      return rec;
    },

    /* Повернуть ключ. Слова уходят в конверты, открытые значения стираются из
       хранилища и из памяти разом: оставить их «на всякий случай» значило бы
       не запереть ничего. */
    lock: function (password) {
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
      return buildLock(password, pairs).then(function (ks) {
        /* Добираем то, что система записала, пока считался ключ. */
        var extra = [];
        pending.forEach(function (v, k) { extra.push({ k: k, v: v }); });
        pending.clear();
        var jobs = extra.map(function (p) {
          if (p.v == null) return Promise.resolve(null);
          return Promise.all([sealedName(ks, p.k), sealPair(ks, p.k, p.v)]).then(function (r) {
            rawStore.set.call(window.localStorage, r[0], r[1]);
            rawStore.del.call(window.localStorage, p.k);
          });
        });
        return Promise.all(jobs);
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
        if (window.sbBus && window.sbBus.emit) window.sbBus.emit("vault:change", { locked: true, open: false });
        return true;
      }, function (e) { sealing = false; pending.clear(); throw e; });
    },

    /* Открыть на сеанс. Расшифрованное кладётся в ПАМЯТЬ (кэш sbDB), а не
       обратно в хранилище: иначе первое же открытие отменило бы замок. */
    unlock: function (password) {
      var rec = lockRecord();
      if (!rec) return Promise.resolve(true);
      if (!vaultAvailable()) return Promise.resolve(false);
      if (rec.v === 1) return migrateV1(password, rec);
      var wrapped, wrapIv;
      try { wrapped = unb64(rec.wrap); wrapIv = unb64(rec.wrapIv); }
      catch (e) { return Promise.resolve(false); }
      return deriveKEK(password, rec.salt).then(function (kek) {
        /* Верен ли пароль, отвечает сам AES-GCM: неверный ключ не даёт
           подписи сойтись, и распаковка бросает. Отдельное «проверочное
           слово» здесь не нужно — и хорошо: одним известным открытым
           текстом на диске меньше. */
        return window.crypto.subtle.decrypt({ name: "AES-GCM", iv: wrapIv }, kek, wrapped);
      }).then(function (masterBuf) {
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
    remove: function (password) {
      var rec = lockRecord();
      if (!rec) return Promise.resolve(true);
      return window.sbVault.unlock(password).then(function (okp) {
        if (!okp) return false;
        var names = sealedNamesNow(), i;
        mem.forEach(function (v, k) {
          if (v != null) rawStore.set.call(window.localStorage, k, v);
        });
        for (i = 0; i < names.length; i++) rawStore.del.call(window.localStorage, names[i]);
        lsDel(LOCK_KEY);
        vaultOpen = false;
        vaultKeys = null;
        if (vaultMaster) { vaultMaster.fill(0); vaultMaster = null; }
        nameMap.clear();
        if (window.sbBus && window.sbBus.emit) window.sbBus.emit("vault:change", { locked: false });
        return true;
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
    rekey: function (oldPassword, newPassword) {
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (String(newPassword || "").length < 4) return Promise.reject(new Error("short"));
      return window.sbVault.unlock(oldPassword).then(function (okp) {
        if (!okp || !vaultMaster) return false;
        var salt = new Uint8Array(32);
        var wrapIv = new Uint8Array(12);
        window.crypto.getRandomValues(salt);
        window.crypto.getRandomValues(wrapIv);
        var saltB64 = b64(salt);
        return deriveKEK(newPassword, saltB64).then(function (kek) {
          return window.crypto.subtle.encrypt({ name: "AES-GCM", iv: wrapIv }, kek, vaultMaster);
        }).then(function (wrapped) {
          var next = lockRecord() || {};
          next.salt = saltB64;
          next.wrapIv = b64(wrapIv);
          next.wrap = b64(wrapped);
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
        var logical = pfx && it.k.indexOf(pfx) === 0 ? it.k.slice(pfx.length) : it.k;
        cache.set(logical, it.v);
      }
      vaultKeys = ks;
      vaultOpen = true;
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
        return sealPair(vaultKeys, k, val).then(function (env) {
          rawStore.set.call(window.localStorage, phys, env);
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
