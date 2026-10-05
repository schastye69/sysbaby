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

  /* Какой замок знает эта вкладка (D-353, шаг 4; см. «ЗАМОК, КОТОРЫЙ ЗНАЕТ
     ВКЛАДКА» ниже): соль записи замка — запоминается сразу после фасада
     инкогнито (ниже), до первого обращения к хранилищу, тем же взглядом,
     каким её потом сверяют. */
  var seenLock = null, ownGone = null;
  function lockSaltNow() {
    var raw = null, rec = null;
    try { raw = window.localStorage.getItem("sysbaby.lock.v1"); } catch (e) { raw = null; }
    if (!raw) return null;
    try { rec = JSON.parse(raw); } catch (e) { return "?"; }
    return rec && rec.salt ? String(rec.salt) : "?";
  }

  /* ── ПЕРЕЧИСЛЕНИЕ ТОЖЕ ПРОХОДИТ ЧЕРЕЗ ЗАМОК · решение D-172 ────────────────
     Замок стоит на границе Storage: чтение и запись он перехватывает (D-164).
     А ПЕРЕЧИСЛЕНИЕ — нет: localStorage.key() отдаёт то, что лежит на диске, а
     там при запертом замке нет ни одного настоящего имени — в этом и был
     смысл (D-166): с v177 записи лежат в носителе IndexedDB (D-351), до того
     лежали конвертами sysbaby.v.<хеш>.
     Дефект нашёл закон копий: выгрузка профиля, сделанная при стоящем замке,
     возвращалась БЕЗ ЗАМЕТОК. Она перечисляла диск, находила там конверты и
     не находила ни одного знакомого имени. То есть и кнопка «выгрузить
     профиль», и копии в папку сохраняли ПУСТОТУ — молча.
     Лечение здесь, в единственном месте, где система вообще перечисляет
     ключи: пока замок открыт, имена берутся из памяти, где они настоящие.
     Диск при этом остаётся тем же — запечатанным. */
  function lsKeys() {
    var out = [], seen = {};
    try {
      var n = window.localStorage.length;
      for (var i = 0; i < n; i++) {
        var k = window.localStorage.key(i);
        if (k == null) continue;
        if (k.indexOf("sysbaby.v.") === 0) continue;      /* прежний конверт — не имя */
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
  /* Соль — тем же взглядом, что и сверка: в инкогнито — через фасад
     (разбор №4: взгляд мимо фасада видел настоящий замок, которого фасад
     не показывает, и вкладка инкогнито считала замок пропавшим). */
  try { seenLock = lockSaltNow(); } catch (e) { seenLock = null; }

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
         Замок один, дверь одна: lsSet ниже сам решит, что уходит под замок. */
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
    /* Записать в ЧУЖОЕ пространство — в профиль, куда человек сейчас войдёт.
       Нужно двери (D-306): имя входящего кладётся в его профиль, а не в тот,
       из которого он уходит. Прежняя дверь писала имя в текущий — и гость
       видел в полосе имя того, кто заводился последним. */
    setIn: function (profileId, key, value) {
      if (!profileId || profileId === activeProfile()) { sbDB.set(key, value); return true; }
      return lsSet(nsKeyFor(profileId, key), String(value));
    },
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

  function derive(password, saltHex, iterations) {
    var enc = new TextEncoder();
    return window.crypto.subtle
      .importKey("raw", enc.encode(String(password)), { name: "PBKDF2" }, false, ["deriveBits"])
      .then(function (key) {
        return window.crypto.subtle.deriveBits({
          name: "PBKDF2",
          salt: enc.encode(saltHex),
          iterations: iterations || AUTH_ITER,
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

  /* ═══════════ ДВЕРЬ НЕ ЗНАЕТ ИМЁН · решение D-306 (v159) ════════════════
     ПОВОД, дословно от основателя: «первая страница должна быть обязательно
     входом для того, чтобы посторонний даже не мог подозревать существует ли
     вообще аккаунт у конкретного пользователя».
     ЧТО БЫЛО. Учётка лежала в общем списке под своим именем и почтой, а у
     двери был вопрос has(имя) — «занято ли». Экран отвечал на него любому:
     «Welcome back» чужому имени, «This name is free» — свободному.
     ЧТО СТАЛО. Учётку находят не по имени, а по ОТПЕЧАТКУ ПАРЫ: PBKDF2 от
     пароля с солью «соль устройства ‖ имя». В записи нет ни имени, ни почты —
     только этот отпечаток. Отсюда три свойства сразу:
       · спросить «есть ли здесь juri», не зная пароля, нельзя — ни у экрана,
         ни у списка на диске: вопроса has() больше нет вовсе;
       · одно имя с двумя паролями — две разные системы, и «Первое слово»
         никогда не отвечает «занято»;
       · работа у двери одна и та же для любого имени: один вывод ключа (и ещё
         один, пока на устройстве живы записи прежней сборки, — для любого
         имени, а не только для старого).
     Соль устройства — случайные 16 байт, одни на устройство: заранее
     посчитанные таблицы «имя + пароль» с чужих устройств здесь бесполезны.
     Под замком и соль, и список лежат запечатанными, как всё остальное.
     ЧЕГО ЭТО НЕ ДАЁТ, ВСЛУХ. Без замка имя человека лежит открыто внутри его
     собственного профиля (как и его заметки), а число записей видно по
     диску. Экран не выдаёт ничего; диск без замка выдаёт всё — это сказано
     в карточке «Живучесть».
     Охраняется tools/first-door-check.mjs. */
  var AUTH_SALT_KEY = "sysbaby.auth.salt";
  function deviceSalt() {
    var s = lsGet(AUTH_SALT_KEY);
    if (!s) { s = randomSaltHex(); lsSet(AUTH_SALT_KEY, s); }
    return s;
  }
  function doorTag(name, password) {
    return derive(password, deviceSalt() + "\u0000" + String(name || "").toLowerCase());
  }
  function legacyAuthed(list) {
    return list.filter(function (p) { return p && p.auth && p.auth.hash && p.auth.salt; });
  }
  /* Одна попытка — одна и та же работа при любом имени. Возвращает запись,
     которую открывает пара, или null. Запись прежней сборки, открытая своим
     паролем, тут же переезжает: имя и почта из неё уходят. */
  function doorPair(name, password) {
    if (!subtleOk()) return Promise.resolve({ prof: null, tag: null });
    var list = readProfiles();
    var olds = legacyAuthed(list);
    var old = null, i;
    if (olds.length) {
      var e = emailOf(name);
      for (i = 0; i < olds.length; i++) if (olds[i].email === e) old = olds[i];
    }
    var jobs = [doorTag(name, password)];
    /* Пока на устройстве есть хоть одна старая запись, второй вывод делается
       ВСЕГДА — по её соли или по пустой. Иначе время ответа говорило бы,
       старое ли это имя. */
    /* ОТКАТ: у старой записи без числа проходов — число той сборки, 150 000. */
    if (olds.length) jobs.push(derive(password, old ? old.auth.salt : randomSaltHex(), old ? (old.auth.iterations || AUTH_ITER) : AUTH_ITER));
    return Promise.all(jobs).then(function (r) {
      var tag = r[0], found = null, j;
      for (j = 0; j < list.length; j++) {
        if (list[j] && list[j].auth && list[j].auth.tag && sameSecret(list[j].auth.tag, tag)) found = list[j];
      }
      if (!found && old && r.length > 1 && sameSecret(r[1], old.auth.hash)) {
        for (j = 0; j < list.length; j++) {
          if (list[j].id === old.id) {
            list[j].auth = { algo: "PBKDF2-SHA256", iterations: AUTH_ITER, v: 2, tag: tag };
            delete list[j].name;
            delete list[j].email;
            found = list[j];
          }
        }
        writeProfiles(list);
      }
      return { prof: found, tag: tag };
    });
  }

  var sbAuth = {
    available: subtleOk,
    iterations: AUTH_ITER,

    /* ВХОД: пара открывает систему — вернуть её; нет — null. Почему нет, не
       сообщается никому: ни экрану, ни вызывающему. */
    open: function (name, password) {
      return doorPair(name, password).then(function (r) { return r.prof; });
    },

    /* «ПЕРВОЕ СЛОВО»: завести систему. Если пара уже открывает систему, это
       её хозяин — он знает пароль, и ему отдаётся его же система; тому, кто
       пароля не знает, этот путь не говорит ничего. «Занято» не бывает. */
    found: function (name, password) {
      if (!subtleOk()) return Promise.reject(new Error("no-subtle"));
      if (String(password || "").length < 4) return Promise.reject(new Error("short"));
      return doorPair(name, password).then(function (r) {
        if (r.prof) return r.prof;
        var list = readProfiles();
        var rec = { id: makeId(), createdAt: Date.now(), auth: { algo: "PBKDF2-SHA256", iterations: AUTH_ITER, v: 2, tag: r.tag } };
        list.push(rec);
        writeProfiles(list);
        return rec;
      });
    }
  };
  window.sbAuth = sbAuth;

  /* ── ИМЯ, ПОПАВШЕЕ ГОСТЮ ПО ОШИБКЕ (D-306) ────────────────────────────────
     Прежняя дверь писала имя заводящегося в ТЕКУЩИЙ профиль — то есть гостю
     устройства, — а уже потом переключалась. Гость видел в верхней полосе имя
     того, кто заводился последним: ровно то, чего посторонний знать не должен.
     Сборка v159 пишет имя туда, куда входят (sbDB.setIn), а оставшееся у
     гостя имя стирает, если оно совпадает с именем учётки прежней сборки. */
  (function forgetMisplacedName() {
    try {
      var guestName = lsGet("sysbaby.username");
      if (!guestName) return;
      var g = String(guestName).toLowerCase();
      var hit = readProfiles().some(function (p) { return !!(p && p.auth && p.name && String(p.name).toLowerCase() === g); });
      if (hit) lsDel("sysbaby.username");
    } catch (e) { /* хранилище закрыто — стирать нечего */ }
  })();

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
  function idb(forErase) {
    if (window.sbIncognitoActive) return Promise.resolve(null);
    /* Замок исчез (или появился) под вкладкой — базы она не открывает (и не
       пересоздаёт). */
    if (lostNow()) return Promise.resolve(null);
    /* После ухода (D-174) база не открывается вовсе: открыть её — значит
       пересоздать стёртую, пустую, но след. Открывает только само стирание. */
    if (window.sbVanishing && !forErase) return Promise.resolve(null);
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
      /* Версия 4 (D-351): добавлен склад «carrier» — носитель замка, одна
         запись фиксированного размера. */
      /* Версия 5 (D-353): новых складов нет — это ВОРОТА ВЕРСИЙ. Носитель
         пишется теперь только сравнением и заменой в одной транзакции, а
         сборка до D-353 писала его по-старому: прочитав в одной транзакции и
         записав в другой — поверх более нового. Открытая вкладка прежней
         сборки получает versionchange и закрывает базу, а открыть её снова
         своей версией не может (VersionError): по старым правилам она базу
         больше не пишет. Запись замка в localStorage такая вкладка в миг
         ухода ещё может переписать целиком (щели в самой записи, как в
         v178) — безвредно: lateRead предпочитает щели своими записями
         (финальный разбор H1, п. 4). */
      /* Версия 6 (A1 разбора границ): те же ворота против сборки до A1 —
         она без Web Locks ставила и поворачивала замок сравнением-и-заменой,
         а эта в браузере без них общего не пишет вовсе. */
      try { req = window.indexedDB.open("sysbaby", 6); } catch (e) { resolve(null); return; }
      if (!req) { resolve(null); return; }
      req.onupgradeneeded = function () {
        var db = req.result;
        try { if (!db.objectStoreNames.contains("accounts")) db.createObjectStore("accounts", { keyPath: "id" }); } catch (e) { /* ignore */ }
        try { if (!db.objectStoreNames.contains("snapshots")) db.createObjectStore("snapshots", { keyPath: "profileId" }); } catch (e) { /* ignore */ }
        try { if (!db.objectStoreNames.contains("things")) db.createObjectStore("things", { keyPath: "id" }); } catch (e) { /* ignore */ }
        try { if (!db.objectStoreNames.contains("handles")) db.createObjectStore("handles", { keyPath: "id" }); } catch (e) { /* ignore */ }
        try { if (!db.objectStoreNames.contains("carrier")) db.createObjectStore("carrier", { keyPath: "id" }); } catch (e) { /* ignore */ }
      };
      req.onsuccess = function () {
        var db = req.result;
        /* Новой версии базы в другой вкладке эта уступает сразу (D-351):
           иначе та ждала бы, а с ней — дверь замка. */
        try { db.onversionchange = function () { try { db.close(); } catch (e) { /* ignore */ } idbPromise = null; }; } catch (e) { /* ignore */ }
        resolve(db);
      };
      req.onerror = function () { resolve(null); };
      /* Прежняя вкладка держит прежнюю версию: ждём, пока отпустит. Не
         дождались за четверть минуты — отвечаем «нет базы», но не навсегда:
         следующий вопрос спросит снова. */
      req.onblocked = function () {
        setTimeout(function () { if (idbPromise === pending0) idbPromise = null; resolve(null); }, 15000);
      };
    }).catch(function () { return null; });
    var pending0 = idbPromise;
    return idbPromise;
  }

  function idbPut(storeName, value) {
    /* Замёрзшая вкладка (D-353) не пишет ничего — ни вещей, ни снимков, ни
       учёток, ни указателя папки; уходящая (D-174) и потерявшая замок — тоже. */
    if (carrierStale || window.sbVanishing || lostNow()) return Promise.resolve(false);
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
     возвращает null. Отказ здесь не молчаливый: put отвечает null, why()
     называет причину, а приложение обязано сказать о ней человеку своими
     словами (см. vault-things-check, one-door-things-check).
     ПОД ЗАМКОМ (D-352) вещь лежит не здесь, а в складе носителя — в
     половине своего мира, см. «ОДНА ДВЕРЬ, СТУПЕНЬ 2»; склад «things» под
     замком держит только конверты, не поместившиеся в склад носителя.

     Охраняется tools/vault-things-check.mjs. */
  var THING_SEQ = 0;
  function newThingId() {
    THING_SEQ++;
    return "t" + Date.now().toString(36) + "-" + THING_SEQ.toString(36) +
      "-" + Math.floor(Math.random() * 1679616).toString(36);
  }

  window.sbThings = {
    /* Кладёт вещь на склад и отдаёт её номер. null означает «не принято»:
       почему — отвечает why() (incognito, full, nostore, closed, fail). Молчать об
       этом нельзя. */
    put: function (blob, meta) {
      if (!blob) return Promise.resolve(null);
      if (carrierStale) { thWhy = "frozen"; return Promise.resolve(null); }   /* замёрзшая вкладка (D-353) */
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
      /* ── ПОД ЗАМКОМ ВЕЩЬ ЛОЖИТСЯ В СКЛАД НОСИТЕЛЯ (D-352) ──────────────
         Замок стоит — вещь уходит в половину открытого мира, и половина
         пересобирается целиком; замок стоит, а сеанс не открыт — не
         принимается ничего: ключа нет, а открытым класть нельзя. Имя, род и
         размер уходят ВНУТРЬ половины вместе с байтами. */
      if (vaultLocked()) {
        if (!vaultOpen || !vaultKeys) { thWhy = "closed"; return Promise.resolve(null); }
        return thQueue("add", rec);
      }
      return idbPut("things", rec).then(function (okFlag) {
        if (!okFlag) thWhy = window.sbIncognitoActive ? "incognito" : "fail";
        return okFlag ? id : null;
      });
    },
    get: function (id) {
      if (!id) return Promise.resolve(null);
      if (vaultLocked()) {
        /* Запертая вещь отдаётся только открытому сеансу и только своему
           миру: сперва его половина склада, затем прежний конверт. */
        if (!vaultOpen || !vaultKeys) return Promise.resolve(null);
        var tries = 0;
        var fromHalf = function () {
          return thLoad(vaultDoor).then(function (st) {
            var it = st.mac ? thFind(st.dir, id) : null;
            if (!it) return null;
            return thReadItem(st, it).then(function (blob) {
              return { id: it.id, blob: blob, name: it.name, mime: it.mime, size: it.size, at: it.at };
            });
          }).then(null, function () {
            /* Другая вкладка успела пересобрать половину — прочесть заново. */
            thState = null;
            return ++tries < 2 ? fromHalf() : null;
          });
        };
        return fromHalf().then(function (got) {
          if (got) return got;
          return idbGet("things", id).then(function (rec) {
            if (!rec || !rec.sealed) return null;
            return thingFromSealed(vaultKeys, rec).then(null, function () { return null; });
          });
        });
      }
      return idbGet("things", id).then(function (rec) {
        /* Снят замок, а вещь запечатана — её мира больше нет: «нет вещи». */
        if (!rec || rec.sealed) return null;
        return rec;
      });
    },
    del: function (id) {
      if (!id) return Promise.resolve(false);
      if (carrierStale) { thWhy = "frozen"; return Promise.resolve(false); }
      if (vaultLocked()) {
        if (!vaultOpen || !vaultKeys) return Promise.resolve(false);
        return thLoad(vaultDoor).then(function (st) {
          if (st.mac && thFind(st.dir, id)) return thQueue("del", id);
          /* Прежний конверт этого мира убирается, как прежде. */
          return idbGet("things", id).then(function (rec) {
            if (!rec || !rec.sealed) return false;
            return thingFromSealed(vaultKeys, rec).then(function () { return idbDel("things", id); }, function () { return false; });
          });
        }).then(null, function () { return false; });
      }
      return idbDel("things", id);
    },
    /* Сколько вещей на складе. Нужно не для красоты: закон проверяет им, что
       выброшенная из описи вещь действительно ушла, а не осталась лежать. */
    count: function () {
      if (vaultLocked()) {
        if (!vaultOpen) return Promise.resolve(0);
        return thLoad(vaultDoor).then(function (st) { return st.dir.items.length; }, function () { return 0; });
      }
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
    },
    /* Склад носителя называет себя сам (D-352): часть, число частей,
       половина мира и сколько в своей половине занято (знает только
       открытый мир). */
    capacity: function () {
      var used = (vaultOpen && thState && thState.r === vaultDoor) ? thUsed(thState.dir) : 0;
      return { chunk: TH_CHUNK, chunks: TH_CHUNKS, half: TH_HALF, used: used };
    },
    why: function () { return thWhy; },
    /* Дождаться, пока склад вещей успокоится (переезд, пересборка). */
    settled: function () { return thingsWork.then(function () { return true; }, function () { return true; }); },
    /* Цена записи — настоящей пересборкой своей половины (D-352), в мс. */
    measure: function () {
      if (!vaultLocked() || !vaultOpen) return Promise.resolve(null);
      return thQueue("force", null);
    }
  };

  function idbPutAccount(rec) {
    if (!rec) return;
    if (lockedNonWriter()) return;
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
  /* При замке пишет только писатель открытого мира (D-353, шаг 4): дверь и
     читающая вкладка снимков и учёток не пишут. */
  function lockedNonWriter() { return vaultLocked() && (!vaultOpen || !!carrierStale || !writeRight); }
  function snapshotNow() {
    if (window.sbIncognitoActive) return Promise.resolve(false);
    if (lockedNonWriter() || window.sbVanishing || lostNow()) return Promise.resolve(false);
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
    for (k in data) if (Object.prototype.hasOwnProperty.call(data, k) && !isProtectedKey(k) && k.indexOf("sysbaby.lock.late.") !== 0) out[k] = data[k];
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
    if (carrierStale || lostNow()) return Promise.resolve(false);
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
    if (carrierStale || window.sbVanishing || lostNow()) return Promise.resolve(false);
    /* Вычищается сразу, при загрузке, до пароля (D-265) — и только
       СРАВНЕНИЕМ И ЗАМЕНОЙ в одной транзакции (разбор №3 шага 4): запись
       переписывается, лишь пока она та самая утечка. Писатель под замком
       кладёт снимки уже без защищённого и учётки — одним номером, поэтому
       вкладка у двери не ляжет своим прочитанным поверх более нового. */
    return idb().then(function (db) {
      if (!db) return false;
      return new Promise(function (resolve) {
        var tx;
        try { tx = db.transaction(["snapshots", "accounts"], "readwrite"); } catch (e) { resolve(false); return; }
        var walk = function (store, fix) {
          var q;
          try { q = tx.objectStore(store).openCursor(); } catch (e) { return; }
          q.onsuccess = function () {
            var c = q.result;
            if (!c) return;
            var next = fix(c.value);
            if (next) { try { c.update(next); } catch (e) { /* ignore */ } }
            c["continue"]();
          };
        };
        walk("snapshots", function (snap) {
          if (!snap || !snap.data) return null;
          var clean = diskSafe(snap.data);
          if (Object.keys(clean).length === Object.keys(snap.data).length) return null;
          return { profileId: snap.profileId, data: clean, updatedAt: snap.updatedAt };
        });
        walk("accounts", function (a) {
          if (!a || Object.keys(a).length <= 1) return null;
          return { id: a.id };
        });
        tx.oncomplete = function () { resolve(true); };
        tx.onabort = function () { resolve(false); };
      });
    }).then(null, function () { return false; });
  }
  window.sbSnapshotNow = snapshotNow;
  window.sbReadSnapshot = function (profileId) { return idbGet("snapshots", profileId || activeProfile()); };

  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") { flush(); snapshotNow(); } });
  setTimeout(function () { idbPutAccount(sbProfiles.currentRecord()); snapshotNow(); }, 2500);
  /* Чистка — сразу, а не через две с половиной секунды: закрытую вкладку
     могут открыть и тут же закрыть, и открытый снимок пролежал бы ещё раз. */
  setTimeout(function () { purgeDiskLeaks(); }, 0);

  /* ------------------------------------------------ 7. EXPORT / IMPORT §1.5 */
  /* ── МАШИНЕРИЯ УСТРОЙСТВА НЕ ЕДЕТ (D-314) ─────────────────────────────
     Найдено законом ковчега: открытая выгрузка, снятая под замком, везла
     ЗАПИСЬ ЗАМКА этого устройства (соли и обёртку ключа). Восстановление на
     другом устройстве клало её поверх открытых данных — там вставала дверь
     чужого замка, а за ней лежало незапертое. Запись замка, соль входа,
     дата кода восстановления и минутная отметка «поставить сейчас» —
     свойства ЭТОГО устройства, а не вещи человека: в выгрузку они не
     попадают, а восстановление их не трогает — ни чужих не кладёт, ни
     своих не стирает. Минуты покоя до запирания — выбор человека, он едет. */
  var DENY_EXACT = ["sysbaby.activeProfile", "sysbaby.profiles.v1", "sysbaby.authed",
    "sysbaby.sync.url", "sysbaby.incognito.pwhash", "sysbaby.incognito.timerPref",
    "sysbaby.lock.v1", "sysbaby.lock.spareAt", "sysbaby.lock.wantNow", "sysbaby.auth.salt",
    /* Отметка «след стука уже видел» — о двери ЭТОГО устройства (D-341). */
    "sysbaby.knock.seen"];
  /* Поздние щели — о двери ЭТОГО устройства и его последнем миге (D-353):
     в выгрузку не едут, восстановление их не кладёт и не стирает. */
  var DENY_PREFIX = ["sysbaby.sync.token::", "sysbaby.incognito::", "sysbaby.i18n.cache.", "sysbaby.lock.late."];

  function denied(key) {
    if (DENY_EXACT.indexOf(key) !== -1) return true;
    for (var i = 0; i < DENY_PREFIX.length; i++) if (key.indexOf(DENY_PREFIX[i]) === 0) return true;
    return false;
  }
  /* Одно знание на всю систему: Настройки спрашивают его здесь, а не держат
     свой список (два списка уже разошлись — у Настроек не было машинерии). */
  window.sbExportDenied = denied;

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
      /* Имени в записи учётки нет с v159 (D-306): оно живёт в самом профиле. */
      /* ОТКАТ: у гостя без имени — «This computer», как и прежде. */
      profile: { id: pid, name: (rec && rec.name) || (pid !== "local" && lsGet(nsKeyFor(pid, "sysbaby.username"))) || "This computer", email: (rec && rec.email) || null },
      keys: keys
    };
  }
  window.sbExportProfile = buildExport;
  /* Склад отдан наружу: синхронизация копий (sync.js) хранит в нём указатель
     на настоящую папку. Свой второй indexedDB.open был бы вторым знанием об
     одном хранилище — а с ним и вторая версия схемы, и расхождение. */
  /* Наружу пишется только указатель папки (handles): носитель, вещи, снимки
     и учётки — только своими дверями записи со сверкой (A1 разбора границ:
     слепой put в любой склад был бы записью общего мимо них). */
  window.sbIdb = { put: function (storeName, value) { return storeName === "handles" ? idbPut(storeName, value) : Promise.resolve(false); }, get: idbGet };

  window.sbExportFileName = function (profileId) {
    var env = buildExport(profileId);
    var name = String(env.profile.name || "profile").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "profile";
    return "sysbaby-profile-" + name + "-" + env.createdAt.slice(0, 10) + ".json";
  };

  function saveText(name, text) {
    var blob = new Blob([text], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 400);
  }
  window.sbDownloadExport = function (profileId) {
    /* ── ПРИ ЗАМКЕ — КОНВЕРТ И ТОЛЬКО ПОСЛЕ ПОДТВЕРЖДЕНИЯ (D-307, D-308) ──
       Без свежего подтверждения выгрузка не делается вовсе: ответ говорит,
       что нужно подтверждение, и окно его спрашивает (sbExportNow). */
    if (window.sbVault && window.sbVault.isLocked()) {
      if (!window.sbVault.presence.fresh()) return Promise.resolve({ ok: false, presence: true, error: "Confirm it is you first." });
      var count = Object.keys(buildExport(profileId).keys).length;
      return window.sbVault.exportText(profileId).then(function (r) {
        var sealedName = "sysbaby-sealed-" + new Date().toISOString().slice(0, 10) + ".json";
        try { saveText(sealedName, r.text); } catch (e) { return { ok: false, error: "Could not create the export file in this browser." }; }
        return { ok: true, name: sealedName, count: count, sealed: true };
      }, function () { return { ok: false, error: "The lock is shut — open it first." }; });
    }
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
    /* Запечатанная выгрузка (D-307) открывается словом или кодом раньше, чем
       входит сюда: нести её конверт в хранилище как ключи нельзя. */
    if (env.kind === "sealed-export") return { ok: false, sealed: true, error: "This export is sealed — it opens with the lock's word or the recovery code." };
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
    /* Под замком импорт — запись мира: только вкладка, которая пишет (D-353,
       шаг 4). Читающая, замёрзшая или у двери отвечает «нет», а не «принято»
       — её запись не легла бы никуда. */
    if (lockLost() || (vaultLocked() && (!vaultOpen || carrierStale || !writeRight))) {
      return { ok: false, error: "This tab cannot write right now: the world is written in another tab. Reload this tab, then import again." };
    }
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
      if (opts.reload !== false) {
        /* Под замком принятое лежит в памяти и уходит на диск печатью ячейки:
           страница поднимается заново, только когда печать легла (D-353,
           разбор №3) — иначе уход оборвал бы её, а в позднюю щель (64 КиБ)
           большое не помещается. */
        var go = function () { location.reload(); };
        /* Печать не легла (отказ — вкладка замёрзла; сбой — сказано вслух,
           правки в очереди) — страница не уходит: уход унёс бы принятое
           молча (разбор №4). */
        var gone = function (sealedOk) { if (sealedOk === true && !carrierStale) go(); };
        if (vaultLocked() && vaultOpen && typeof window.sbVaultSettled === "function") window.sbVaultSettled().then(gone, function () { /* сбой сказан вслух */ });
        else setTimeout(go, 60);
      }
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
     Всё остальное под именем sysbaby. — под замок, включая ключи завтрашних
     приложений: список НЕЛЬЗЯ-запирать закрыт, и новое попадает под замок
     само, без единой правки.

     ЧТО ИМЕННО ПРОИСХОДИТ (D-166, дословно от основателя 27.08.2026: «чтобы
     была зашифрована абсолютно вся информация профиля, чтобы не возможно было
     вообще ничего увидеть. и шифровку делайте уровня signal и выше. пускай их
     будет несколько, но с одним паролем»).

     ОДИН ПАРОЛЬ — МНОГО КЛЮЧЕЙ. Пароль не шифрует ничего сам. Он проходит
     ТРИ растяжки подряд (это и есть «пускай их будет несколько»): две
     временем — PBKDF2-HMAC-SHA-512 и PBKDF2-HMAC-SHA-256, числа проходов не
     ниже рекомендаций OWASP и подобраны под устройство (D-205, D-303), — и
     одну памятью, Argon2id на 64 МиБ (D-275). Первая редакция (август 2026)
     стояла на двух PBKDF2 по 210 000 и 600 000 проходов и памятью не
     растягивала вовсе; писала об этом вслух и была права — тогда.

     Полученный ключ НЕ шифрует данные. С носителем (D-351) он открывает
     ЩЕЛЬ ячейки мира, в которой лежит МАСТЕР-КЛЮЧ — 32 случайных байта, не
     выводимых ни из чего; до v177 он открывал конверт мастер-ключа — дверь
     в записи замка. Из мастер-ключа по HKDF-SHA-256 расходятся ключи ячейки
     (два шифра тела и ключ печати своей роли), ключи склада вещей (D-352),
     ключи «Ключей» и ключи конвертов выгрузки и копии. Смена пароля не меняет
     мастера: пересобирается щель слова, записи и пароли «Ключей» те же.

     ДВА ШИФРА ПОДРЯД, НЕ ОДИН (слово основателя: «пускай их будет несколько»):
     тело ячейки — AES-256-CTR, затем ещё раз AES-256-CTR другим ключом, и
     печать HMAC-SHA-512 поверх всей ячейки (encrypt-then-MAC); у склада
     вещей — AES-256-CTR и печать HMAC-SHA-256 каждой части; у конвертов
     выгрузки, копии и прежних конвертов вещей — AES-256-CTR, затем
     AES-256-GCM, и подпись HMAC-SHA-512. Оба ключа шифров выведены из одного мастера, и
     независимой защиты друг от друга они не дают — это сказано вслух (разбор
     «Шифр без театра», Н10); второй слой оставлен по слову основателя.
     Печать проверяется ДО расшифровки — испорченная или подложенная ячейка
     не открывается вовсе.

     ДЛИНА И ИМЕНА НЕ ВИДНЫ. Носитель одного размера всегда: по нему не
     видно, сколько человек написал. Имён записей на диске нет — они внутри
     ячейки, под обоими шифрами. Раньше в хранилище стояли sysbaby.notes.v2,
     sysbaby.mail.threads — посторонний видел, чем человек пользуется; потом
     записи лежали конвертами sysbaby.v.<HMAC-SHA-256 от имени>, добитыми до
     кратности 256 байт (до v177). «Не видно вообще ничего» — значит и этого.

     ЧЕГО ЗДЕСЬ НЕТ, И ЭТО СКАЗАНО ЧЕЛОВЕКУ ДО ПОВОРОТА КЛЮЧА:
       · восстановления пароля нет У ДРУГИХ: сервера нет, копии ни у кого.
         Есть свой код восстановления на бумаге (D-266) — щель кода в
         ячейке, которая выводит ключ, а не проверяет;
       · пока система открыта в этой вкладке, слова лежат в памяти
         расшифрованными. Замок бережёт ПОКОЙ, а не работающий сеанс;
       · растяжка памятью (Argon2id) делает перебор на видеокартах дороже,
         но не отменяет его: короткое слово подбирают. Обещать «уровень
         Signal» целиком было бы той же ложью, от которой предостерегает
         раздел входа.

     Охраняется tools/vault-lock-check.mjs и tools/vault-cascade-check.mjs.
     ═══════════════════════════════════════════════════════════════════════ */
  var LOCK_KEY = "sysbaby.lock.v1";
  var SEAL_PFX = "sysbaby.v.";        /* под этим именем лежали конверты записей (до v177); у переехавшего замка — их остаток */
  /* ВОРОТА ВЕРСИЙ И ДЛЯ ЗАПИСИ ЗАМКА (D-353). Сборка до D-353 узнавала
     носитель по полю carrier записи замка — и, оставшись открытой во
     вкладке после обновления, без базы (ворота IndexedDB) брала носитель
     из своей памяти и по нему сверяла слово: снятие замка ею писало бы
     открытым СВОЁ старое поверх нового. Теперь поле зовётся carrier5: старая
     сборка носителя не видит, её дверь не находит мира и не пишет ничего. */
  function carrierSize(rec) { return rec ? (rec.carrier5 || rec.carrier || 0) : 0; }
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
  var PAD_BLOCK = 256;                /* длина прячется: конверт выгрузки и копии кратен блоку */
  var VAULT_ITER = KDF2_ITER;         /* прежнее имя — для старых записей v1 */

  /* Поздние щели — отдельными записями, по одной на ячейку (D-353): их пишут
     открытые миры в миг ухода, и общая запись замка, которую переписывали
     целиком, теряла щель одного мира от записи другого. Снаружи каждая —
     64 КиБ шума у всех замков одинаково; сведений в них не прибавилось. */
  var VAULT_NEVER = ["sysbaby.lock.v1", "sysbaby.lock.late.0", "sysbaby.lock.late.1", "sysbaby.activeProfile", "sysbaby.authed"];
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
  /* Имена прежних конвертов, лежащих на диске (остаток переезда, D-351). */
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
  /* ── МАСТЕР В ПАМЯТИ — НЕ БАЙТАМИ (D-300, инвариант I13) ────────────────
     Прежде мастер-ключ сеанса лежал в памяти страницы массивом байтов — ради
     смены слова и вывода паролей «Ключей». Разбор «Шифр без театра» (Н9):
     снимок памяти процесса, файл подкачки, отчёт о сбое — везде, где лежит
     память страницы, лежал и мастер. Теперь байты живут мгновение: сразу
     после развёртки из них делаются ключи WebCrypto, которые скрипт вынуть
     не может (extractable=false), — основание HKDF для «Ключей» и ключ
     сеанса, под которым мастер лежит запечатанным. Массив обнуляется тут же.
     Смене слова нужны сами байты — она распечатывает их на один шаг и
     обнуляет снова (withMaster). Чего это не даёт, вслух: ключи WebCrypto
     тоже живут в памяти браузера — их не вынет скрипт страницы, но может
     тот, кто читает память всего процесса.
     Охраняется tools/key-extractable-check.mjs. */
  var masterBox = null;         /* { key, iv, box } — мастер под ключом сеанса */
  var siteBase = null;          /* основание HKDF для «Ключей» — неизвлекаемое */
  /* Через какую дверь вошли. НАРУЖУ НЕ ОТДАЁТСЯ НИКОГДА: система,
     умеющая ответить «ты в тревожном мире», не защищает ни от кого.
     С носителем (D-351) это ДВА числа: vaultDoor — номер ЯЧЕЙКИ открытого
     мира (куда писать), vaultRole — кто он: 0 главный, 1 второй. Номер
     ячейки о роли не говорит: главный мир лежит в случайной. */
  var vaultDoor = -1;
  var vaultRole = -1;
  var vaultOpen = false;

  function vaultAvailable() { return subtleOk(); }
  function lockRecord() {
    try { return JSON.parse(lsGet(LOCK_KEY) || "null"); } catch (e) { return null; }
  }
  /* Заперто ли — по самой строке записи, без разбора на каждом шагу: в
     записи лежат поздние щели (D-351), и разбирать её при каждом обращении
     к хранилищу значило бы платить за это каждым кадром. */
  var lockRawSeen = null, lockRawOk = false;
  function vaultLocked() {
    var raw = lsGet(LOCK_KEY);
    if (!raw) return false;
    if (raw === lockRawSeen) return lockRawOk;
    lockRawSeen = raw;
    try { lockRawOk = !!JSON.parse(raw); } catch (e) { lockRawOk = false; }
    return lockRawOk;
  }

  function holdMaster(bytes) {
    var subtle = window.crypto.subtle, iv = new Uint8Array(12);
    window.crypto.getRandomValues(iv);
    return Promise.all([
      subtle.importKey("raw", bytes, "HKDF", false, ["deriveBits"]),
      subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"])
    ]).then(function (k) {
      return subtle.encrypt({ name: "AES-GCM", iv: iv }, k[1], bytes).then(function (box) {
        siteBase = k[0];
        masterBox = { key: k[1], iv: iv, box: box };
      });
    }).then(function () { bytes.fill(0); }, function (e) { bytes.fill(0); throw e; });
  }
  function dropMaster() { masterBox = null; siteBase = null; wordCheck = null; presentAt = 0; }
  /* Обнулить всё, что дверь отдала этому вызову, — на любом исходе (D-300). */
  function zero() { for (var i = 0; i < arguments.length; i++) if (arguments[i] && arguments[i].fill) arguments[i].fill(0); }
  /* Байты мастера — на один шаг и обратно в ноль, что бы шаг ни вернул. */
  function withMaster(fn) {
    if (!masterBox) return Promise.reject(new Error("closed"));
    var mb = masterBox;
    return window.crypto.subtle.decrypt({ name: "AES-GCM", iv: mb.iv }, mb.key, mb.box).then(function (buf) {
      var m = new Uint8Array(buf);
      return Promise.resolve().then(function () { return fn(m); })
        .then(function (r) { m.fill(0); return r; }, function (e) { m.fill(0); throw e; });
    });
  }

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

  /* ── ЦЕНА ПОД ЭТО УСТРОЙСТВО (D-303, план Н11) ────────────────────────────
     ПОВОД: на iPad в Safari единая цена растяжки открывала замок минуту (шапка
     adaptive-cost-check). Здесь система один раз мерит устройство и подбирает
     цену под БЮДЖЕТ в несколько секунд. Память Argon2id (64 МиБ) — защита от
     перебора видеокартой — НЕ трогается; подбирается только ВРЕМЯ: число
     проходов Argon2id и счётчики PBKDF2, с полом, ниже которого не опускаемся,
     и потолком сегодняшних значений (быстрый устройство не делается медленнее).
     Меряется один раз за сеанс. Цена записывается в замок и оттуда берётся
     снятием — поэтому медленный замок и открывается быстро.

     ПОЧЕМУ ЦЕЛЬ — ОТНОШЕНИЕ, А НЕ СЕКУНДЫ. Обещание системы (kdf-cost-check,
     прежняя просьба основателя) — одна попытка подбора стоит не меньше ДЕСЯТИ
     эталонов OWASP (600 000 × PBKDF2-SHA-256). Это обещание — пол, ниже
     которого спешка не опускается: цель — тринадцать эталонов (запас над
     десятью на дрожь замера). На быстрой машине тринадцать эталонов — это
     секунды; на медленной — те же тринадцать, но абсолютное время больше.
     Мгновенным открытие быть не может, не нарушив обещания, — и Совет об этом
     говорит вслух, а не прячет.

     ГДЕ ЛЕЖИТ ЦЕНА. Память Argon2id (64 МиБ) не трогается — это защита от
     видеокарты. Проходов памяти — два (пол): каждый лишний проход на iPad
     считается чистым JS и стоит дорого временем, а отношение дешевле набрать
     родным PBKDF2. Поэтому Argon2id держит память, а до тринадцати эталонов
     добирает PBKDF2, у которого цена времени на любом устройстве честная.

     ПОЛ ОБЕЩАНИЯ НЕ ДЕРЖИТСЯ НА ЗАМЕРЕ (D-344). Десять эталонов набирает
     один PBKDF2-SHA-256: не меньше 10 × 600 000 проходов — тот же алгоритм,
     что у эталона, поэтому это ровно десять эталонов на любом железе, у
     человека и у нападающего. Argon2id и SHA-512 — сверху. Прежде пол стоял
     на замере прохода Argon2id: медленный или холодный пробник засчитывал
     памяти лишние эталоны, и настоящая цена падала до 8–9 (доски v170, v171);
     а время Argon2id, посчитанного в JS на медленном устройстве, — вообще не
     цена для нападающего: у него родной Argon2id. Цена: около секунды на
     столе и две-три на iPad к каждому открытию — секунды, а не минута.
     ПОСТОЯННАЯ: цель 13 эталонов; эталон OWASP 600 000; проходов Argon2id 2;
     пол SHA-256 — десять эталонов (обещание основателя). */
  var COST_TARGET = 13, OWASP_REF = 600000, A2_PASSES = 2, IT_FLOOR = 600000;
  var PROMISE = 10, IT2_FLOOR = PROMISE * OWASP_REF;
  var calibrated = null;
  function calibrateCost() {
    if (calibrated) return Promise.resolve(calibrated);
    var full = todayA2();
    if (!full) { calibrated = { it1: KDF1_ITER, it2: KDF2_ITER, a2: null }; return Promise.resolve(calibrated); }
    var subtle = window.crypto.subtle, enc = new TextEncoder();
    var salt = new Uint8Array(16); window.crypto.getRandomValues(salt);
    var PROBE = 100000;   /* проба PBKDF2 — по ней ms на итерацию */
    var per512 = 0, per256 = 0;
    return subtle.importKey("raw", enc.encode("sys.baby/calibrate"), { name: "PBKDF2" }, false, ["deriveBits"]).then(function (base) {
      var t0 = performance.now();
      return subtle.deriveBits({ name: "PBKDF2", salt: salt, iterations: PROBE, hash: "SHA-512" }, base, 512).then(function () {
        per512 = (performance.now() - t0) / PROBE;
        var t1 = performance.now();
        return subtle.deriveBits({ name: "PBKDF2", salt: salt, iterations: PROBE, hash: "SHA-256" }, base, 256).then(function () {
          per256 = (performance.now() - t1) / PROBE;
          var t2 = performance.now();
          return window.sbArgon2.hash(new Uint8Array(32), salt, { m: full.m, t: 1, p: full.p, tagLength: 32 }).then(function () {
            var perPass = performance.now() - t2;
            /* Один эталон OWASP в мс на этом устройстве — им и мерим отношение,
               ровно как kdf-cost-check: те же 600 000 × SHA-256. */
            var owaspMs = OWASP_REF * per256;
            var t = A2_PASSES;
            var argonRatio = (t * perPass) / Math.max(1e-4, owaspMs);   /* сколько эталонов уже даёт память */
            var need = Math.max(0, COST_TARGET - argonRatio);           /* остаток добираем PBKDF2 */
            var clamp = function (v, cap, floor) { return Math.max(floor || IT_FLOOR, Math.min(cap, Math.round(v))); };
            /* Разложение остатка: 40 % на SHA-512, 60 % на SHA-256. it/OWASP_REF
               эталонов для SHA-256; для SHA-512 — через отношение времён.
               SHA-256 — не ниже пола обещания, что бы ни показал замер (D-344). */
            var it2 = clamp(0.6 * need * OWASP_REF, KDF2_ITER, IT2_FLOOR);
            var it1 = clamp((0.4 * need * owaspMs) / Math.max(1e-4, per512), KDF1_ITER);
            calibrated = { it1: it1, it2: it2, a2: { m: full.m, t: t, p: full.p } };
            return calibrated;
          });
        });
      });
    }, function () { calibrated = { it1: KDF1_ITER, it2: KDF2_ITER, a2: full }; return calibrated; });
  }
  function a2Parse(s) {
    var m = /^ARGON2ID:m=(\d+),t=(\d+),p=(\d+)$/.exec(String(s || ""));
    return m ? { m: parseInt(m[1], 10), t: parseInt(m[2], 10), p: parseInt(m[3], 10) } : null;
  }
  /* Итог растяжки байтами — для двух ключей из одного счёта (D-351): ключа
     прежних дверей (AES-GCM, переезд) и ключа щели слова в носителе. Байты
     живут один шаг: вызывающий обнуляет их сразу после импорта. */
  function deriveWordBits(password, saltB64, it1, it2, fsec, a2) {
    return deriveKEK(password, saltB64, it1, it2, fsec, a2, true).then(function (bits) {
      var out = new Uint8Array(bits);
      if (bits instanceof Uint8Array) bits.fill(0);
      return out;
    });
  }
  function deriveWordKeys(password, saltB64, it1, it2, fsec, a2) {
    var subtle = window.crypto.subtle;
    return deriveWordBits(password, saltB64, it1, it2, fsec, a2).then(function (bits) {
      return Promise.all([
        subtle.importKey("raw", bits, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]),
        slotKeyFrom(bits, "sys.baby/carrier/word/v1")
      ]).then(function (k) { bits.fill(0); return { gcm: k[0], slot: k[1] }; }, function (e) { bits.fill(0); throw e; });
    });
  }
  function deriveKEK(password, saltB64, it1, it2, fsec, a2, asBits) {
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
        if (!fsec) return asBits ? bits : subtle.importKey("raw", bits, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
        return subtle.importKey("raw", fsec, { name: "HMAC", hash: "SHA-256" }, false, ["sign"])
          .then(function (hk) { return subtle.sign("HMAC", hk, bits); })
          .then(function (prk) {
            return asBits ? prk : subtle.importKey("raw", prk, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
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
  /* ЧТО СПРОСИТЬ У ДВЕРИ — ПО НОСИТЕЛЮ (классификация границ, Г5). Носитель
     пишется строго, запись замка — позже; обрыв питания между ними оставляет
     копию без второго ключа или ключа устройства, которые носитель требует.
     Прав носитель (см. paramsOf): дверь спрашивает то, что требует он, — тем
     же условием, каким openWorlds берёт его параметры. Носитель для этого
     читается до двери (sbVault.requirements). */
  function effRecord() {
    var rec = lockRecord();
    return rec && carrierMem && carrierMem.params && (carrierSize(rec) || ownCarrierOf(rec, carrierMem)) ? withParams(rec, carrierMem.params) : rec;
  }
  /* Носитель рядом с записью замка прежнего вида (с дверями) — свой, если
     соль у них одна (соль случайна; переезд кладёт в носитель параметры этой
     записи). Тогда прав носитель (D-351): его параметры вывода новее —
     второй ключ, ключ устройства, цена, поставленные после переезда, до
     записи замка могли не дойти (обрыв питания, финальный разбор H1, Г10).
     Соль другая — носитель чужой (остался от снятого или заменённого
     замка), и параметры — свои у записи. */
  function ownCarrierOf(rec, c) {
    return !!(rec && c && c.params && c.params.salt && !carrierSize(rec) && (rec.doors || rec.wrap || rec.spare) && c.params.salt === saltOf(rec));
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
      d("sys.baby/name/v2", { name: "HMAC", hash: "SHA-256", length: 256 }, ["sign"]),
      /* Основание для ключей ТРЕТЬЕЙ редакции (D-311): из него по HKDF
         выводится свой ключ на каждый конверт выгрузки и копии при каждой
         печати (до v177 — и на каждую запись мира). Неизвлекаемое. */
      subtle.importKey("raw", master, "HKDF", false, ["deriveKey"])
    ]).then(function (k) {
      return { ctr: k[0], gcm: k[1], mac: k[2], name: k[3], base: k[4] };
    });
  }

  /* ═══════ ОДНА ДВЕРЬ, СТУПЕНЬ 1: НОСИТЕЛЬ ВМЕСТО ДВЕРЕЙ И КОНВЕРТОВ · D-351 ═══════
     Архитектура — документ основателя «One Door» (утверждён 29.09.2026),
     ступень 1: ключи без завёрнутых дверей в записи замка и один носитель
     фиксированного размера.

     НОСИТЕЛЬ. Одна запись IndexedDB (склад «carrier», номер «one»): байты
     фиксированного размера CARRIER_REGIONS × CARRIER_REGION и рядом —
     печати ячеек (seal), по одной на ячейку. Размер выбирается при повороте
     ключа и не меняется никогда: ни от записей, ни от удаления, ни от второго
     слова. Незанятая ячейка — случайные байты, её печать — случайные байты.

     ЯЧЕЙКА МИРА (всё — под ключами мира; снаружи — только случайные байты):
       N_s  16  — метка щелей, новая при каждой записи;
       E_w  32  — мастер мира, закрытый потоком из ключа СЛОВА;
       E_c  32  — тот же мастер, закрытый потоком из ключа КОДА (шум, если кода нет);
       N_b  16  — метка тела, новая при каждой записи;
       тело     — AES-CTR ∘ AES-CTR (два ключа) над ( длина ‖ род ‖ записи мира ),
                  до конца ячейки.
     Открытых тегов AEAD, заголовков и длин в носителе нет (длина тела —
     внутри, под шифром). Целостность — СНАРУЖИ
     байтов ячейки: печать = HMAC-SHA-512 ключом мира по всей ячейке; она же
     узнаёт, чья ячейка: слово выводит ключ, ключ даёт кандидата в мастера в
     КАЖДОЙ ячейке, и считаются ОБЕ печати всегда.

     ПОЧЕМУ МАСТЕР В ЯЧЕЙКЕ, А НЕ ВЫВОДИТСЯ ИЗ СЛОВА НАПРЯМУЮ. Пароли «Ключей»
     выводятся из мастера (siteKey): мастер, выведенный из слова, сменился бы
     при переезде и при каждой смене слова — и вместе с ним каждый пароль
     каждого сайта. Поэтому слово выводит КЛЮЧ, ключ открывает щель ячейки, в
     щели лежит прежний мастер. Снаружи ячейки нет ни одной двери.
     ПРОВЕРЕНО ПО ПРОСЬБЕ ОСНОВАТЕЛЯ (30.09.2026: «не создаёт ли схема нового
     признака существования мира, числа миров, верного слова или строения
     данных»). Один снимок: всё — случайные байты. Несколько снимков: первая
     редакция держала голову ячейки неподвижной, и по снимкам читались и её
     место, и миг заведения кода или смены слова. Поэтому ячейка
     запечатывается ЦЕЛИКОМ при каждой записи (sealRegion): ключ щели слова
     живёт в сеансе, ключ щели кода — в теле ячейки. Буквальная схема «мастер
     = вывод из слова» не прячет лучше: коду восстановления в ней тоже нужен
     мастер где-то на диске. Что остаётся видно по нескольким снимкам — какая
     ячейка менялась, — это остаточная утечка One Door, названная в документе.
     НОМЕР ЯЧЕЙКИ НЕ ГОВОРИТ, ЧЕЙ МИР (тот же разбор, вторая находка). Первая
     редакция клала главный мир в ячейку 0, второй — в 1. Тогда «какая ячейка
     менялась, пока открыто» отвечала и на вопрос «какой мир открыт», а
     открытый второй мир доказывал, что есть главный. Теперь главный мир
     ложится в СЛУЧАЙНУЮ ячейку, второй — в другую; роль (главный или второй)
     узнаётся только сверкой печати: у каждой роли свой ключ печати. Запись
     замка при переезде теряет двери: чужая прежняя дверь уезжает в РЕЗЕРВ —
     случайные байты другой ячейки, где на месте её роли лежит её обёртка
     мастера (см. moveWorld).

     Охраняется tools/one-door-carrier-check.mjs (носитель) и
     tools/one-door-migration-check.mjs (переезд). */
  var CARRIER_STORE = "carrier", CARRIER_ID = "one";
  /* ПОСТОЯННАЯ: две ячейки — главный мир и второй (D-203, решение основателя
     29.09.2026: второй мир — полноценный). Ячейка — мебибайт: записи мира
     сжимаются (deflate) и помещаются с запасом против квоты localStorage,
     которой они жили до сих пор (пять мегабайт на всё). */
  var CARRIER_REGIONS = 2, CARRIER_REGION = 1048576;
  /* ПОСТОЯННАЯ: длины частей ячейки — размеры примитивов, а не состав. */
  var CR_NS = 16, CR_EW = 32, CR_EC = 32, CR_NB = 16, CR_SEAL = 64;
  var CR_HEAD = CR_NS + CR_EW + CR_EC + CR_NB;
  var carrierMem = null;          /* { bytes: Uint8Array, seal: [Uint8Array×2] } — последнее прочитанное или записанное */
  var carrierKeys = null;         /* { body, mac } открытого мира — неизвлекаемые */
  /* СЕАНС ПОМНИТ, ОТ ЧЕГО ОН СЧИТАЕТ (D-353): ownBase — своя ячейка в том
     виде, в каком сеанс её последний раз видел (открыл или сам записал),
     sessionG — поколение полномочий (worldText). carrierStale — сеанс узнал,
     что отстал, и больше не пишет: "records" — мир сохранили в другой
     вкладке, "auth" — там сменили то, чем мир открывается. */
  var ownBase = null, sessionG = 0, carrierStale = null, removingNow = false;
  /* ЗАМОК, КОТОРЫЙ ЗНАЕТ ВКЛАДКА (разборы №2–3 шага 4). Вкладка помнит соль
     той записи замка, которую видела при загрузке или поставила сама (свой
     поворот ключа, переезд замка v1). Запись замка исчезла, сменилась
     другой или ПОЯВИЛАСЬ — и не этой вкладкой — значит, память вкладки
     старее лежащего: она не пишет ничего (ни в localStorage, ни в
     IndexedDB, базы не пересоздаёт), говорит это вслух, а вход ведёт к
     перезагрузке. Своё снятие или стирание (ownGone) — не исчезновение.
     Чужой замок не усыновляется: вкладка, поднятая без замка, после замка
     в другой вкладке живёт памятью без замка, и её записи легли бы
     открытыми рядом с запертым или поверх снятого. */
  /* seenLock, ownGone и lockSaltNow — в начале файла: соль запомнена до
     первого обращения к хранилищу. */
  var removalCut = false, lateSuspended = false, lateKnown = null;
  /* Свой поворот ключа или своя пересборка: теперь вкладка знает этот замок. */
  function noteOwnLock() { seenLock = lockSaltNow(); ownGone = null; }
  function lockLost() {
    var cur = lockSaltNow();
    if (cur === seenLock) return false;
    if (!cur && seenLock && ownGone === seenLock) return false;
    return true;
  }
  /* Потеряла — замирает (один раз) и говорит это: «изменено в другой
     вкладке», единственный выход — «Перечитать». */
  function lostNow() {
    if (!lockLost()) return false;
    if (!carrierStale) {
      if (vaultOpen) carrierStaleNow("records");
      else { carrierStale = "records"; writerDrop(); staleSay("records"); }
    }
    return true;
  }
  /* Другая вкладка тронула запись замка — узнать сразу, а не при записи. */
  try {
    window.addEventListener("storage", function (ev) {
      try { if (ev && (ev.key === null || ev.key === "sysbaby.lock.v1")) lostNow(); } catch (e) { /* ignore */ }
    });
  } catch (e) { /* ignore */ }
  /* ── ОДИН ПИСАТЕЛЬ НА ЯЧЕЙКУ (D-353, шаг 4) ─────────────────────────────
     Поздняя щель лежит в localStorage, носитель — в IndexedDB; общей
     транзакции у них нет, и сравнением её не замкнуть. Поэтому «кто пишет»
     решается ДО записи: право писать ячейку — исключительный Web Lock с
     постоянным именем, одним на все миры (WRITER_LOCK, ниже), взятый без
     ожидания при входе.
     Его держит одна вкладка браузера; снимает его сам браузер, когда
     вкладки не стало. Без него вкладка мира только читает.
     ПРИМАНКА. Каждая вкладка держит ровно один замок: у двери и без права —
     случайный той же формы. Число и вид замков не говорят, открыт ли где-то
     второй мир; ждущих замков нет (только ifAvailable) — кроме вкладки,
     которая после обрыва питания ждёт, пока другая долечит запись замка
     (sbVault.crashWait): её ждущий запрос — права писателя, одного на все
     миры, и о мирах не говорит ничего.
     БЕЗ WEB LOCKS один писатель не доказан: запись — только сравнением-и-
     заменой, поздней щели и удаления нет. */
  var LOCKS = null;
  try { LOCKS = window.navigator && window.navigator.locks && typeof window.navigator.locks.request === "function" ? window.navigator.locks : null; } catch (e) { LOCKS = null; }
  var writeRight = null;      /* "lock" | "cas" | false; null — мир не открыт */
  var heldLock = null;        /* { name, release, world } — ровно один на вкладку */
  function hexOf(u8) { var o = "", i; for (i = 0; i < u8.length; i++) o += (u8[i] < 16 ? "0" : "") + u8[i].toString(16); return o; }
  function lockTry(name) {
    if (!LOCKS || !name) return Promise.resolve(null);
    return new Promise(function (resolve) {
      var settled = false;
      try {
        LOCKS.request(name, { mode: "exclusive", ifAvailable: true }, function (lock) {
          if (!lock) { settled = true; resolve(null); return null; }
          return new Promise(function (rel) { settled = true; resolve({ name: name, release: rel }); });
        }).then(null, function () { if (!settled) resolve(null); });
      } catch (e) { resolve(null); }
    });
  }
  /* Держать ровно один замок: новый взят — прежний отпущен. */
  function lockSwap(h, world) {
    var old = heldLock;
    heldLock = h ? { name: h.name, release: h.release, world: !!world } : null;
    if (old && old.release) { try { old.release(); } catch (e) { /* ignore */ } }
  }
  function lockDecoy() {
    return lockTry(hexOf(randBytes(32))).then(function (h) { if (h) lockSwap(h, false); return !!h; });
  }
  /* ОДНО ПРАВО НА ВЕСЬ ИСТОЧНИК (повторный разбор шага 4). Имя права —
     постоянное и одно для всех миров: по замкам не сказать, какой мир пишет и
     открыт ли второй; вкладка второго мира при писателе главного — такая же
     читающая, как вкладка того же мира. Право берётся у двери ДО чтения мира.
     ПОСТОЯННАЯ: имя — SHA-256("sys.baby/writer/v1") шестнадцатерично: того же
     вида, что приманки. */
  var WRITER_LOCK = "8d9cfa0ea216b2164dc04496c9d6cb1f10dcc548cd56019173bc8432bd0270ae";
  /* Право писателя без ожидания. Уже держим — оно наше. */
  /* НЕТ ДОКАЗУЕМОЙ ИСКЛЮЧИТЕЛЬНОСТИ — ОТКАЗ, ЗАПИСИ НЕТ (основатель,
     A1 разбора границ: «NO PROVABLE EXCLUSIVITY → REJECT → NO WRITE»).
     Без Web Locks один писатель на источник не доказан ничем, кроме
     сравнения-и-замены внутри одной транзакции IndexedDB. Этого хватает
     записи СВОЕЙ ячейки (её сверяет сама транзакция) — и не хватает всему,
     что меняет общее для вкладок: запись замка, слово, второй ключ, ключ
     устройства, цену, тревожный мир, код, переезд прежнего вида, копию
     параметров, ряд стуков в записи замка. Им — отказ до любого чтения и
     любой записи; ни флагов в localStorage, ни пауз, ни повторов. */
  function noLocksRefusal() { return LOCKS ? null : Promise.reject(new Error("nolocks")); }
  function writerTake() {
    if (!LOCKS) return Promise.resolve("cas");
    if (heldLock && heldLock.world) return Promise.resolve("lock");
    return lockTry(WRITER_LOCK).then(function (h) {
      if (!h) return false;
      lockSwap(h, true);
      return "lock";
    }, function () { return false; });
  }
  /* Замёрзшая вкладка права не держит: замок мира — назад в приманку, чтобы
     вкладка, открытая после «Перечитать», могла стать писателем. */
  function writerDrop() {
    /* Право перестаёт быть нашим сразу (writerTake больше не скажет «lock»),
       а сам замок отпускается, когда взята приманка. */
    if (heldLock && heldLock.world) { heldLock.world = false; lockDecoy().then(function (ok) { if (!ok) lockSwap(null, false); }); }
    if (writeRight === "lock") writeRight = false;
  }
  /* Стирать хранилище при замке (снять замок, «Стереть всё», глубокий
     уход) вправе только писатель открытого мира; без замка — стирать нечего
     беречь. */
  function mayErase() {
    /* Память вкладки старше лежащего (замок исчез, сменился, появился) —
       стирать ей нечего беречь и не за кого решать: отказ. */
    if (lockLost()) return false;
    if (!lockRecord()) return !carrierStale;
    return !!vaultOpen && !carrierStale && writeRight === "lock" && !!heldLock && !!heldLock.world;
  }
  lockDecoy();

  function carrierNew() {
    var bytes = new Uint8Array(CARRIER_REGIONS * CARRIER_REGION), seal = [], i, off;
    /* getRandomValues отдаёт не больше 64 КиБ за раз. */
    for (off = 0; off < bytes.length; off += 65536) window.crypto.getRandomValues(bytes.subarray(off, Math.min(bytes.length, off + 65536)));
    for (i = 0; i < CARRIER_REGIONS; i++) seal.push(randBytes(CR_SEAL));
    return { bytes: bytes, seal: seal };
  }
  function carrierCopy(c) {
    var o = { bytes: new Uint8Array(c.bytes), seal: c.seal.map(function (s) { return new Uint8Array(s); }) };
    if (c.params) o.params = JSON.parse(JSON.stringify(c.params));
    if (c.mark) o.mark = JSON.parse(JSON.stringify(c.mark));
    if (Array.isArray(c.spent)) o.spent = c.spent.slice();
    if (Array.isArray(c.knock)) o.knock = c.knock.slice();
    if (c.removing) o.removing = c.removing;
    return o;
  }
  function carrierNorm(v) {
    if (!v || !v.bytes || !Array.isArray(v.seal)) return null;
    var b = v.bytes instanceof Uint8Array ? v.bytes : (v.bytes instanceof ArrayBuffer ? new Uint8Array(v.bytes) : null);
    if (!b || b.length !== CARRIER_REGIONS * CARRIER_REGION || v.seal.length !== CARRIER_REGIONS) return null;
    var o = { bytes: b, seal: v.seal.map(function (s) { return s instanceof Uint8Array ? s : new Uint8Array(s); }) };
    if (v.params && typeof v.params === "object") o.params = v.params;
    if (v.mark && typeof v.mark === "object") o.mark = v.mark;
    if (Array.isArray(v.spent)) o.spent = v.spent;
    if (Array.isArray(v.knock)) o.knock = v.knock;
    if (v.removing) o.removing = v.removing;
    return o;
  }
  function carrierRead() {
    return idbGet(CARRIER_STORE, CARRIER_ID).then(function (v) {
      var c = carrierNorm(v);
      if (c) carrierMem = c;
      return c;
    });
  }
  /* ── ОДНА ДВЕРЬ ЗАПИСИ: СРАВНЕНИЕ И ЗАМЕНА В ОДНОЙ ТРАНЗАКЦИИ (D-353) ────
     Основатель, 01.10.2026: «Ни одна операция sys.baby не имеет права
     уничтожить, откатить или заменить более новое состояние ячейки более
     старым состоянием. Stale writer всегда получает отказ. Он никогда не
     получает право «починить» состояние автоматически».
     ЧТО БЫЛО (до D-353). Запись носителя читала его одной транзакцией, а
     писала другой, и между ними шла печать ячейки — сотни миллисекунд.
     Вкладка, открывшая мир раньше, писала поверх более нового: смена слова в
     другой вкладке откатывалась к прежнему слову, новый код восстановления
     переставал работать, правка соседней вкладки пропадала, запись другого
     мира откатывалась. Всё это показал stale-writer-check на v178.
     ЧТО СТАЛО. Носитель пишет ОДНА функция. Пишущий называет состояние, от
     которого он считал (base), и ячейки, которые он меняет; в ОДНОЙ
     транзакции IndexedDB запись читается заново, и каждая называемая ячейка
     сверяется с base байт в байт — тело и печать. Совпало — пишется только
     названное, всё остальное берётся из этого же чтения. Не совпало — отказ
     ("stale"), и не пишется НИЧЕГО: ни повтора в новой транзакции, ни
     ремонта, ни «последний прав». Между чтением и записью в транзакции нет
     ожиданий вне IndexedDB: всё, что считается долго (печать, шифр), готово
     заранее. Транзакция — с долговечностью «strict».
     base === CARRIER_ANY — носитель должен быть (журнал стуков: он не
     трогает ни одной ячейки); base === null — носителя быть не должно.
     Охраняется tools/stale-writer-1-check.mjs и остальными частями закона
     устаревшего писателя на доске (тело закона — stale-writer-check). */
  var CARRIER_ANY = { any: true };
  /* ВЕСТЬ О ЗАПИСИ (D-353). Записав ячейку или половину вещей, вкладка
     говорит соседям того же адреса: «ячейка r изменена». Вкладка, чей мир
     лежит в этой ячейке, сразу знает, что отстала, и замерзает ДО попытки
     записи — а не узнаёт об этом своей отвергнутой записью. В вести НЕТ
     номера ячейки (повторный разбор шага 4: номер говорил бы открытому миру,
     что жив другой): получатель сам перечитывает свою ячейку и свою половину
     склада и замерзает, только если изменились они. Весть не покидает
     браузер и не ложится на диск. */
  var carrierNews = null;
  try { if (typeof window.BroadcastChannel === "function") carrierNews = new window.BroadcastChannel("sysbaby-carrier"); } catch (e) { carrierNews = null; }
  function carrierTell() {
    if (!carrierNews) return;
    try { carrierNews.postMessage({ t: "carrier" }); } catch (e) { /* соседей нет — сказать некому */ }
  }
  /* ── ПОВОРОТ КЛЮЧА — В ТИШИНЕ (разбор №4) ─────────────────────────────
     Пока одна вкладка собирает открытые записи под замок, другая могла бы
     дописать запись, которую первая тут же сотрёт как уже собранную (её
     собранное старше), или оставить новую открытой рядом с запертым.
     Поэтому поворачивающая, держа право писателя, после растяжки слова и
     перед самым сбором просит каждую вкладку источника замолчать: та
     сбрасывает свои отложенные записи на диск, замерзает («изменено в
     другой вкладке», выход — «Перечитать») и отвечает, назвав свой замок
     (у каждой вкладки ровно один замок, Web Locks знают их все). Затем —
     круги отпечатков открытых записей, уже в тишине, пока свой взгляд на
     диск не совпадёт с отпечатком каждой (у браузера свой кеш localStorage
     на процесс). Не ответил хоть один названный замок за QUIET_MS или
     взгляды не сошлись за 2·QUIET_MS — отказ «busy», ничего не заперто.
     Упала растяжка — никто не замёрз: тишины ещё не было. Без Web Locks
     вкладок не перечесть — не доказано (граница). Вкладка, открытая
     посреди поворота, узнаёт о замке по его записи — граница, вслух. */
  var quietWait = null, turning = false;
  /* ПОСТОЯННАЯ: 3 с — живая вкладка отвечает за миллисекунды; дольше ждать значит держать поворот ключа ради вкладки, которая не ответит. */
  var QUIET_MS = 3000;
  /* ПОСТОЯННАЯ: 50 мс — шаг ожидания, пока записи другой вкладки дойдут до этой. */
  var QUIET_STEP_MS = 50;
  /* Весть — без цифр (по ней не сказать ни номера ячейки, ни числа миров). */
  function lettersOf(hex) { return String(hex).replace(/[0-9]/g, function (d) { return "ghijklmnop".charAt(+d); }); }
  function plainPrint() {
    var names = protectedKeysNow().slice().sort(), h = 2166136261, i, j, t;
    for (i = 0; i < names.length; i++) {
      t = names[i] + "\u0000" + String(rawStore.get.call(window.localStorage, names[i])) + "\u0001";
      for (j = 0; j < t.length; j++) { h ^= t.charCodeAt(j); h = Math.imul(h, 16777619) >>> 0; }
    }
    return lettersOf(h.toString(16));
  }
  /* Имя своего замка — буквами: ответ называет, КТО ответил (разбор №5), и
     поворачивающая сверяет ответы со списком замков, а не только их число. */
  function quietName() { return heldLock && heldLock.name ? lettersOf(heldLock.name) : "-"; }
  function quietHere(id, kind) {
    /* Инкогнито пишет в своё пространство — сбору не мешает и не замолкает. */
    if (!window.sbIncognitoActive && kind === "quiet" && !vaultLocked() && !carrierStale) {
      try { flush(); } catch (e) { /* ignore */ }
      carrierStale = "records";
      writerDrop();
      staleSay("records");
    }
    /* Вкладка, которая видит замок или живёт в инкогнито (открытым в общем
       пространстве она не пишет), отвечает без отпечатка — «-». */
    var p = (window.sbIncognitoActive || vaultLocked()) ? "-" : plainPrint();
    try { carrierNews.postMessage({ t: "quiet-ok", id: id, n: quietName(), p: p }); } catch (e) { /* ignore */ }
  }
  function lockQuiet() {
    if (!LOCKS || typeof LOCKS.query !== "function" || !carrierNews || window.sbIncognitoActive) return Promise.resolve(true);
    var started = Date.now();
    return LOCKS.query().then(function (q) {
      var mine = heldLock && heldLock.name, want = {}, count = 0;
      ((q && Array.isArray(q.held)) ? q.held : []).forEach(function (h) {
        if (h && h.name && h.name !== mine && !want[lettersOf(h.name)]) { want[lettersOf(h.name)] = true; count++; }
      });
      if (!count) return true;
      /* Один круг: просьба (тишина или отпечаток) — и ответ каждого названного
         замка; не ответили за QUIET_MS — отказ «busy». */
      var ask = function (kind) {
        var id = lettersOf(hexOf(randBytes(16))), got = {}, left = count;
        return new Promise(function (resolve, reject) {
          var t = setTimeout(function () { quietWait = null; reject(new Error("busy")); }, QUIET_MS);
          quietWait = { id: id, on: function (n, p) {
            if (!want[n] || Object.prototype.hasOwnProperty.call(got, n)) return;
            got[n] = String(p || "");
            if (--left <= 0) { clearTimeout(t); quietWait = null; resolve(got); }
          } };
          try { carrierNews.postMessage({ t: kind, id: id }); } catch (e) { clearTimeout(t); quietWait = null; reject(new Error("busy")); }
        });
      };
      /* Круг тишины: все названные замолкают. Затем круги отпечатков — уже в
         тишине, где взгляды сходятся, — пока свой взгляд на диск не совпадёт
         с каждым (у браузера свой кеш localStorage на процесс). */
      return ask("quiet").then(function () {
        return (function round() {
          return ask("print").then(function (got) {
            var me = plainPrint(), all = true, n;
            for (n in got) if (Object.prototype.hasOwnProperty.call(got, n) && got[n] !== "-" && got[n] !== me) all = false;
            if (all) return true;
            if (Date.now() - started > 2 * QUIET_MS) throw new Error("busy");
            return new Promise(function (r) { setTimeout(r, QUIET_STEP_MS); }).then(round);
          });
        })();
      });
    });
  }
  if (carrierNews) carrierNews.onmessage = function (ev) {
    var msg = ev && ev.data;
    if (msg && (msg.t === "quiet" || msg.t === "print")) { quietHere(msg.id, msg.t); return; }
    if (msg && msg.t === "quiet-ok") { if (quietWait && quietWait.id === msg.id) quietWait.on(msg.n, msg.p); return; }
    if (!vaultOpen || vaultDoor < 0 || !ownBase) return;
    var r = vaultDoor;
    Promise.all([carrierRead(), thMacRead()]).then(function (got) {
      var c = got[0], mac = got[1], sl = c && c.seal && c.seal[r] ? new Uint8Array(c.seal[r]) : null;
      var mine = !!sl && !!ownBase && ((sameBytes(sl, ownBase.seal) && sameBytes(regionOf(c, r), ownBase.region)) ||
        (!!carrierPendingSeal && sameBytes(sl, new Uint8Array(carrierPendingSeal))));
      var half = true;
      if (mac && thState && thState.r === r && thState.nonce) half = sameBytes(mac.subarray(r * TH_MAC_HALF, r * TH_MAC_HALF + TH_NONCE), thState.nonce);
      if (mine && half) return;
      /* Читающая вкладка своего вида по вести не меняет (по ней не сказать,
         тот ли мир пишет); полномочия сверяются и у неё. */
      if (carrierStale !== "records" && carrierStale !== "auth" && carrierStale !== "reader") carrierStaleNow("records");
      /* Сменили ли там полномочия — сверяется сразу (только чтение). */
      staleProbe();
    }).then(null, function () { /* прочесть не далось — промолчать: своя запись всё равно сверит */ });
  };
  function sameCell(a, b, r) {
    return !!a && !!b && sameBytes(a.seal[r], b.seal[r]) && sameBytes(regionOf(a, r), regionOf(b, r));
  }
  function carrierRecord(c) {
    var rec = { id: CARRIER_ID, bytes: c.bytes, seal: c.seal, params: c.params || null };
    if (Array.isArray(c.knock)) rec.knock = c.knock;
    /* Метка стоящего замка (Г8) и отпечатки израсходованных прежних запасных
       дверей (Г10) — полями той же записи: в складе носителя под замком
       по-прежнему одна запись постоянного размера (D-351). */
    if (c.mark) rec.mark = c.mark;
    if (Array.isArray(c.spent) && c.spent.length) rec.spent = c.spent;
    if (c.removing) rec.removing = c.removing;
    return rec;
  }
  function carrierCommit(base, cells, change, also) {
    /* Замёрзшая вкладка не пишет носитель ничем: ни повтором, ни частью, ни
       журналом, ни переездом (D-353, «CONFLICT → REJECT → NO WRITE → FREEZE»). */
    if (carrierStale) return Promise.reject(new Error("frozen"));
    /* Ячейки существующего мира пишет только писатель (разбор №2 шага 4);
       журнал стука (CARRIER_ANY) и заведение замка (записи замка ещё нет) —
       без права: они ячеек мира не переписывают. */
    if (base !== CARRIER_ANY && LOCKS && lockRecord() && !(heldLock && heldLock.world)) return Promise.reject(new Error("writer"));
    /* Поздняя щель своей ячейки сменилась не этой вкладкой (щель прежнего
       писателя дошла позже права): мир старше лежащего — отказ, как при
       чужой ячейке (разбор №3: сверка перед каждой записью, не таймер). */
    if (base !== CARRIER_ANY && lateDrift()) return Promise.reject(new Error("stale"));
    return idb().then(function (db) {
      if (!db) throw new Error("carrier");
      return new Promise(function (resolve, reject) {
        var tx, st, q, next = null, why = "carrier";
        try {
          tx = db.transaction(CARRIER_STORE, "readwrite", { durability: "strict" });
          st = tx.objectStore(CARRIER_STORE);
          q = st.get(CARRIER_ID);
        } catch (e) { reject(new Error("carrier")); return; }
        var refuse = function (w) { why = w; next = null; try { tx.abort(); } catch (e) { /* уже закрыта */ } };
        q.onsuccess = function () {
          var cur = carrierNorm(q.result), i;
          if (carrierStale) { refuse("frozen"); return; }
          if (base !== CARRIER_ANY && lateDrift()) { refuse("stale"); return; }
          /* Носитель снимается (снятие замка, см. remove): никто, кроме
             снимающего, его больше не пишет. */
          if (cur && cur.removing) { refuse("fenced"); return; }
          if (base === null ? !!cur : !cur) { refuse("stale"); return; }
          if (base !== CARRIER_ANY && base !== null) {
            for (i = 0; i < cells.length; i++) if (!sameCell(cur, base, cells[i])) { refuse("stale"); return; }
          }
          next = cur ? carrierCopy(cur) : carrierNew();
          try { change(next); } catch (e) { refuse((e && e.message) || "carrier"); return; }
          try { st.put(carrierRecord(next)); } catch (e) { refuse("carrier"); return; }
          /* То, что ложится той же транзакцией (поворот ключа уносит переход
             прежнего снятия). */
          if (also) { try { also(st); } catch (e) { refuse("carrier"); } }
        };
        q.onerror = function () { refuse("carrier"); };
        tx.oncomplete = function () {
          if (!next) { reject(new Error(why)); return; }
          carrierMem = next;
          if (window.sbBus && window.sbBus.emit) window.sbBus.emit("carrier:write", { at: Date.now() });
          if (base !== CARRIER_ANY) carrierTell();
          resolve(next);
        };
        tx.onabort = function () { reject(new Error(why)); };
      });
    });
  }
  /* Ячейки целиком и параметры. Шум для стираемых ячеек готовится ДО
     транзакции: getRandomValues на мебибайт — это время. */
  function carrierPut(base, puts, wipes, params, alter) {
    var cells = Object.keys(puts || {}).map(Number).concat(wipes || []), noise = {};
    (wipes || []).forEach(function (w) {
      var reg = new Uint8Array(CARRIER_REGION), off;
      for (off = 0; off < reg.length; off += 65536) window.crypto.getRandomValues(reg.subarray(off, Math.min(reg.length, off + 65536)));
      noise[w] = { region: reg, seal: randBytes(CR_SEAL) };
    });
    return carrierCommit(base, cells, function (next) {
      var r;
      for (r in puts) if (Object.prototype.hasOwnProperty.call(puts, r)) {
        next.bytes.set(puts[r].region, Number(r) * CARRIER_REGION);
        next.seal[Number(r)] = puts[r].seal;
      }
      for (r in noise) if (Object.prototype.hasOwnProperty.call(noise, r)) {
        next.bytes.set(noise[r].region, Number(r) * CARRIER_REGION);
        next.seal[Number(r)] = noise[r].seal;
      }
      if (params) next.params = params;
      if (alter) alter(next);
    });
  }
  /* Снять носитель (снятие замка) — только если ни одна ячейка не менялась
     с base: та же сверка в той же транзакции, что и очистка. */
  function regionOf(c, r) { return c.bytes.subarray(r * CARRIER_REGION, (r + 1) * CARRIER_REGION); }

  /* ── ПОЗДНЯЯ ЩЕЛЬ: ТО, ЧТО ПИШЕТСЯ В МИГ УХОДА (D-351) ──────────────────
     Ячейка — мебибайт, и её печать стоит десятки и сотни миллисекунд, а
     запись IndexedDB, начатая в миг ухода со страницы, не доходит до диска
     вовсе: браузер обрывает её вместе со страницей (замерено: шифр успевает,
     транзакция — нет). Стол, эстафета, свидетель и счёт пишут своё ИМЕННО в
     миг ухода (pagehide), и под замком это пропадало бы целиком. Нашёл
     baton-check: запись, открытая перед перезагрузкой, после двери не
     называлась. Конверты до v177 печатались по одному и ложились в
     localStorage синхронно — и успевали.
     Поэтому у каждой ячейки есть ПОЗДНЯЯ ЩЕЛЬ — поле late[r] записи замка,
     одного размера всегда: шум, пока в нём нечего держать. В миг ухода
     изменённое с последней печати закрывается AES-CTR и запечатывается
     HMAC-SHA-512 ключами мира (миллисекунды; сжатие в этот миг не успевает —
     замерено) и ложится в щель
     СВОЕЙ ячейки синхронной записью localStorage. Внутри названа печать
     ячейки, поверх которой оно лежит: при следующем входе изменённое ложится
     в мир, только если ячейка всё та же, — позднее, уже вошедшее в более
     новую печать, не вернёт старого. Щель не гасится: устаревшая неотличима
     от шума и не применяется.
     ГРАНИЦА, вслух: изменённое, не поместившееся в щель, в миг ухода не
     спасается — только полной печатью, если она успела раньше. */
  /* ПОСТОЯННАЯ: щель — 64 КиБ: столько изменённого за одно окно печати
     не бывает и у стола с сотней заметок, а запись замка, где лежат обе
     щели, читается целиком не чаще, чем её меняют (см. vaultLocked). */
  var LATE_SIZE = 65536, LATE_NONCE = 16;
  function lateNoise() { return b64(randBytes(LATE_SIZE)); }
  var LATE_PFX = "sysbaby.lock.late.";
  function lateKey(r) { return LATE_PFX + r; }
  /* Щель своей ячейки — та, что этот сеанс видел при входе или записал сам
     (lateKnown)? Нет — значит, её записал другой писатель (прежний, чья
     запись localStorage дошла до этой вкладки позже права). */
  function lateDrift() {
    if (lateHold) { for (var lr in lateHold) if (Object.prototype.hasOwnProperty.call(lateHold, lr) && lateRead(+lr) !== lateHold[lr]) return true; }
    return !!lateKnown && !!vaultOpen && writeRight === "lock" && lateKnown.cell === vaultDoor && lateRead(vaultDoor) !== lateKnown.v;
  }
  /* Щель ячейки r: своя запись; у замка, ещё не переложенного (до D-353), —
     из общей записи замка. */
  function lateRead(r) {
    var own = lsGet(lateKey(r));
    if (own) return own;
    var rec = lockRecord();
    return rec && Array.isArray(rec.late) ? rec.late[r] : null;
  }
  /* У каждого замка обе щели есть всегда — шум с самого начала. */
  function lateEnsure() {
    var r;
    for (r = 0; r < CARRIER_REGIONS; r++) if (!lsGet(lateKey(r))) lsSet(lateKey(r), lateNoise());
  }
  /* Перекладка один раз: щели из общей записи замка — в свои записи, затем
     из записи замка они уходят. */
  function lateToKeys() {
    var rec = lockRecord(), r, moved = true;
    if (!rec || !Array.isArray(rec.late)) return;
    for (r = 0; r < CARRIER_REGIONS; r++) {
      if (lsGet(lateKey(r)) || !rec.late[r]) continue;
      lsSet(lateKey(r), rec.late[r]);
      /* Прежняя щель уходит из записи замка, только когда её копия
         прочитана назад байт в байт: место не далось — переложится потом. */
      if (lsGet(lateKey(r)) !== rec.late[r]) moved = false;
    }
    if (!moved) return;
    lateEnsure();
    var raw = lsGet(LOCK_KEY), now = lockRecord();
    if (now && Array.isArray(now.late)) { delete now.late; lockRecordSwap(raw, now); }
  }
  function xorInto(a, b) { var o = new Uint8Array(a.length), i; for (i = 0; i < a.length; i++) o[i] = a[i] ^ b[i]; return o; }
  /* Поток для щели: AES-CTR ключом щели по метке щелей ячейки (N_s — новая
     при каждой печати ячейки, см. sealRegion). */
  function slotStream(slotKey, ns) {
    return window.crypto.subtle.encrypt({ name: "AES-CTR", counter: ns, length: 64 }, slotKey, new Uint8Array(CR_EW))
      .then(function (b) { return new Uint8Array(b); });
  }
  /* Ключ щели из ИТОГА растяжки (32 байта): HKDF, неизвлекаемый. */
  function slotKeyFrom(bits, info) {
    var subtle = window.crypto.subtle;
    return subtle.importKey("raw", bits, "HKDF", false, ["deriveKey"]).then(function (base) {
      return subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt: new Uint8Array(0), info: new TextEncoder().encode(info) },
        base, { name: "AES-CTR", length: 256 }, false, ["encrypt", "decrypt"]);
    });
  }
  /* Ключи ячейки из мастера мира: тело и печать. Неизвлекаемые.
     Ключ печати — СВОЙ у каждой роли (0 главный мир, 1 второй): так роль
     узнаётся той же сверкой печати, что и сам мир, — без расшифровки тела и
     без единого байта роли снаружи. Сверяются обе роли всегда. */
  function regionKeys(master, role) {
    var subtle = window.crypto.subtle, enc = new TextEncoder(), empty = new Uint8Array(0);
    var macInfo = role === 1 ? "sys.baby/carrier/mac/second/v1" : "sys.baby/carrier/mac/v1";
    return subtle.importKey("raw", master, "HKDF", false, ["deriveKey"]).then(function (m) {
      return Promise.all([
        subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt: empty, info: enc.encode("sys.baby/carrier/body/v1") }, m, { name: "AES-CTR", length: 256 }, false, ["encrypt", "decrypt"]),
        subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt: empty, info: enc.encode("sys.baby/carrier/body2/v1") }, m, { name: "AES-CTR", length: 256 }, false, ["encrypt", "decrypt"]),
        subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt: empty, info: enc.encode(macInfo) }, m, { name: "HMAC", hash: "SHA-512", length: 512 }, false, ["sign", "verify"]),
        subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt: empty, info: enc.encode("sys.baby/carrier/late/v1") }, m, { name: "AES-CTR", length: 256 }, false, ["encrypt", "decrypt"]),
        subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt: empty, info: enc.encode("sys.baby/carrier/late-mac/v1") }, m, { name: "HMAC", hash: "SHA-512", length: 512 }, false, ["sign", "verify"])
      ]);
    }).then(function (k) { return { body: k[0], body2: k[1], mac: k[2], late: k[3], lateMac: k[4], role: role === 1 ? 1 : 0 }; });
  }
  /* Кандидаты в мастера из щели (слова или кода) — по одному на ячейку. Все
     считаются всегда; какой настоящий, говорит печать. */
  function slotCandidates(c, slotKey, which) {
    var off = which === "code" ? CR_NS + CR_EW : CR_NS, jobs = [], r;
    for (r = 0; r < CARRIER_REGIONS; r++) {
      (function (reg) {
        jobs.push(slotStream(slotKey, reg.subarray(0, CR_NS)).then(function (ks) {
          var m = xorInto(reg.subarray(off, off + CR_EW), ks);
          ks.fill(0);
          return m;
        }));
      })(regionOf(c, r));
    }
    return Promise.all(jobs);
  }
  /* Сверка печатей: верная — та ячейка, чья печать сходится под своим
     кандидатом, и та роль, чьим ключом она сошлась. Сверяются ВСЕ ячейки
     под ОБЕИМИ ролями; ответ — { i, m, role } или null. */
  function carrierMatch(c, cands) {
    var verify = function (m, r, role) {
      return regionKeys(m, role).then(function (k) {
        return window.crypto.subtle.verify("HMAC", k.mac, c.seal[r], regionOf(c, r));
      }).then(null, function () { return false; });
    };
    return Promise.all(cands.map(function (m, r) {
      return Promise.all([verify(m, r, 0), verify(m, r, 1)]);
    })).then(function (good) {
      var hit = null, r;
      for (r = 0; r < good.length; r++) {
        if ((good[r][0] || good[r][1]) && !hit) hit = { i: r, m: cands[r], role: good[r][0] ? 0 : 1 };
        else cands[r].fill(0);
      }
      return hit;
    });
  }

  /* ── ТЕЛО ЯЧЕЙКИ: записи мира ─────────────────────────────────────────── */
  /* ПОСТОЯННАЯ: род тела — 0 открытый JSON, 1 сжатый deflate-raw. Сжатие
     берётся, где браузер умеет; читатель читает оба. */
  function deflate(bytes) {
    if (typeof window.CompressionStream !== "function") return Promise.resolve(null);
    try {
      var cs = new window.CompressionStream("deflate-raw");
      return new Response(new Blob([bytes]).stream().pipeThrough(cs)).arrayBuffer().then(function (b) { return new Uint8Array(b); }, function () { return null; });
    } catch (e) { return Promise.resolve(null); }
  }
  function inflate(bytes) {
    if (typeof window.DecompressionStream !== "function") return Promise.reject(new Error("no-inflate"));
    var ds = new window.DecompressionStream("deflate-raw");
    return new Response(new Blob([bytes]).stream().pipeThrough(ds)).arrayBuffer().then(function (b) { return new Uint8Array(b); });
  }
  /* Внутри тела — записи мира и, если заведён код восстановления, ключ его
     щели: без него щель кода нельзя было бы пересобрать при записи, и она
     лежала бы неподвижно — а неподвижные байты среди меняющихся и есть
     признак (разбор основателя 30.09.2026: «ни существования, ни строения»). */
  /* ── КТО ЭТОТ МИР — ЗНАЕТ ТОЛЬКО ЕГО ЯЧЕЙКА (D-351) ─────────────────────
     Главный мир или второй — ключ печати ячейки (у каждой роли свой, см.
     regionKeys) и поле w ВНУТРИ тела, под ключами мира. Номер
     ячейки о роли не говорит ничего: главный мир ложится в случайную ячейку
     (buildLock, первый переезд). Первая редакция клала главный в ячейку 0,
     второй — в 1; тогда по снимкам — какая половина носителя менялась, пока
     открыто, — читалось, какой мир открыт, а раз открыт второй, значит, есть
     и главный. Найдено разбором Совета до выпуска (30.09.2026). */
  /* ПОКОЛЕНИЕ ПОЛНОМОЧИЙ g (D-353): растёт при каждой смене того, чем мир
     открывается, — слова, кода, второго ключа, ключа устройства, цены. Сеанс
     помнит своё g; ячейка с другим g значит, что полномочия сменились в
     другой вкладке, и этот сеанс в неё больше не пишет. */
  function worldText(kv, codeBits, role, g) {
    var obj = {}, out;
    kv.forEach(function (v, key) { if (v != null) obj[key] = v; });
    out = { v: 1, w: role === 1 ? 1 : 0, kv: obj, g: g > 0 ? Math.floor(g) : 0 };
    if (codeBits) out.c = b64(codeBits);
    return JSON.stringify(out);
  }
  /* ── ЯЧЕЙКА ЗАПЕЧАТЫВАЕТСЯ ЦЕЛИКОМ, ВСЕГДА (D-351) ─────────────────────
     Каждая запись ячейки — новая метка N_s, обе щели заново (щель кода —
     шум, если кода нет), новая метка тела, новое тело, новая печать. Между
     двумя снимками в ячейке не остаётся ни одного неподвижного байта: по
     снимкам не видно ни где голова, ни когда заводили код или меняли слово.
     code — { slot, bits } щели кода или null; role — 0 главный мир, 1 второй. */
  function sealRegion(m, wordSlot, code, kv, role, g) {
    var ns = randBytes(CR_NS), nb = randBytes(CR_NB);
    return Promise.all([regionKeys(m, role), slotStream(wordSlot, ns), code ? slotStream(code.slot, ns) : Promise.resolve(null)]).then(function (r) {
      var keys = r[0], ew = xorInto(m, r[1]), ec = r[2] ? xorInto(m, r[2]) : randBytes(CR_EC);
      r[1].fill(0); if (r[2]) r[2].fill(0);
      var raw = new TextEncoder().encode(worldText(kv, code && code.bits, role, g));
      return deflate(raw).then(function (z) {
        var kind = z && z.length < raw.length ? 1 : 0, data = kind ? z : raw;
        var room = CARRIER_REGION - CR_HEAD;
        if (5 + data.length > room) throw new Error("full");
        var body = new Uint8Array(room);
        body[0] = (data.length >>> 24) & 255; body[1] = (data.length >>> 16) & 255;
        body[2] = (data.length >>> 8) & 255; body[3] = data.length & 255;
        body[4] = kind;
        body.set(data, 5);
        /* Два шифра подряд, каждый своим ключом (D-166: «пускай их будет
           несколько, но с одним паролем»); тегов нет — целостность у печати. */
        return window.crypto.subtle.encrypt({ name: "AES-CTR", counter: nb, length: 64 }, keys.body, body).then(function (mid) {
          return window.crypto.subtle.encrypt({ name: "AES-CTR", counter: nb, length: 64 }, keys.body2, mid);
        }).then(function (ct) {
          var reg = new Uint8Array(CARRIER_REGION);
          reg.set(ns, 0);
          reg.set(ew, CR_NS);
          reg.set(ec, CR_NS + CR_EW);
          reg.set(nb, CR_NS + CR_EW + CR_EC);
          reg.set(new Uint8Array(ct), CR_HEAD);
          return window.crypto.subtle.sign("HMAC", keys.mac, reg).then(function (s) { return { region: reg, seal: new Uint8Array(s), keys: keys }; });
        });
      });
    });
  }
  /* Открыть тело ячейки ключами мира: записи и ключ щели кода, если есть. */
  function openRegion(keys, reg) {
    var nb = reg.subarray(CR_NS + CR_EW + CR_EC, CR_HEAD);
    return window.crypto.subtle.decrypt({ name: "AES-CTR", counter: nb, length: 64 }, keys.body2, reg.subarray(CR_HEAD)).then(function (mid) {
      return window.crypto.subtle.decrypt({ name: "AES-CTR", counter: nb, length: 64 }, keys.body, mid);
    }).then(function (b) {
      var body = new Uint8Array(b);
      var n = ((body[0] << 24) | (body[1] << 16) | (body[2] << 8) | body[3]) >>> 0;
      if (n > body.length - 5) throw new Error("shape");
      var data = body.subarray(5, 5 + n);
      return (body[4] === 1 ? inflate(data) : Promise.resolve(data)).then(function (plain) {
        var obj = JSON.parse(new TextDecoder().decode(plain));
        if (!obj || obj.v !== 1 || !obj.kv || typeof obj.kv !== "object") throw new Error("shape");
        return { kv: kvFromObject(obj.kv), code: obj.c ? unb64(obj.c) : null, role: obj.w === 1 ? 1 : 0, g: obj.g > 0 ? Math.floor(obj.g) : 0 };
      });
    });
  }
  /* Ключ щели кода — из байтов, хранящихся в теле. */
  function codeFromBits(bits) {
    if (!bits) return Promise.resolve(null);
    var copy = new Uint8Array(bits);
    return slotKeyFrom(copy, "sys.baby/carrier/code/v1").then(function (slot) { return { slot: slot, bits: copy }; });
  }

  /* ── КЛЮЧИ КОНВЕРТА ТРЕТЬЕЙ РЕДАКЦИИ (D-311 → D-351) ──────────────────
     До v177 так запечатывалась каждая запись мира; с носителем (D-351) —
     конверты выгрузки и копии (вещи Хранилища — своим конвертом, ключами
     сеанса, см. sealBytes), и так читаются прежние конверты записей при
     переезде. Каждый такой конверт при каждой печати получает СВОЙ ключ:
     HKDF от мастера по имени места и метке в 128 случайных бит. Повтор пары «ключ +
     число GCM» невозможен по устройству — ключи разные. Метка случайная, а не
     счётчик правок: счётчик на диске рассказывал бы, сколько раз правили
     запись. Имя места входит в вывод ключа — конверт, переложенный под чужое
     имя, не откроется. */
  /* Имя места — одной строкой в одном месте: так его пишут и в ключ, и в AAD. */
  function recLabel(label) { return String(label); }
  function recKeys(ks, label, slot) {
    var subtle = window.crypto.subtle, enc = new TextEncoder(), empty = new Uint8Array(0);
    var tail = "|" + recLabel(label) + "|" + b64(slot);
    return Promise.all([
      subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt: empty, info: enc.encode("sys.baby/rec/v3/ctr" + tail) }, ks.base, { name: "AES-CTR", length: 256 }, false, ["encrypt", "decrypt"]),
      subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt: empty, info: enc.encode("sys.baby/rec/v3/gcm" + tail) }, ks.base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"])
    ]).then(function (k) { return { ctr: k[0], gcm: k[1] }; });
  }
  /* Дополнительные данные GCM третьей редакции: род, метка, имя места. */
  function recAad(label, slot) {
    return cat(new Uint8Array([4]), slot, new TextEncoder().encode(recLabel(label)));
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

  /* ── КОНВЕРТ: имя и значение под двумя шифрами и подписью ───────────────
     ТРЕТЬЯ РЕДАКЦИЯ (D-311). Снаружи форма прежняя — пять частей за цифрой
     «2»: цифра на диске называет ФОРМУ, а не шифр внутри. Редакция шифра
     стоит ПОД ПОДПИСЬЮ (первый байт подписанного: 2 — прежняя, 4 — третья;
     3 занято вещами, D-265): диск не говорит, какой записи сколько лет и в
     каком она мире, а читатель узнаёт редакцию по подписи, не по надписи.
     Первая часть в третьей редакции — метка ключа этой записи (и счётчик
     CTR); ключи выводятся recKeys. Писатель пишет ТОЛЬКО третью редакцию;
     читатель читает обе — читать старое всегда. */
  function sealPair(ks, name, text, label) {
    if (label == null) return sealedName(ks, name).then(function (nm) { return sealPair(ks, name, text, nm); });
    var enc = new TextEncoder();
    var nameBytes = enc.encode(String(name));
    var valBytes = enc.encode(String(text));
    if (nameBytes.length > 65535) return Promise.reject(new Error("name"));
    var head = new Uint8Array(2);
    head[0] = (nameBytes.length >>> 8) & 255;
    head[1] = nameBytes.length & 255;
    var body = padBytes(cat(head, nameBytes, valBytes));
    var slot = new Uint8Array(16);
    var iv = new Uint8Array(12);
    window.crypto.getRandomValues(slot);
    window.crypto.getRandomValues(iv);
    var subtle = window.crypto.subtle;
    return recKeys(ks, label, slot).then(function (rk) {
      return subtle.encrypt({ name: "AES-CTR", counter: slot, length: 64 }, rk.ctr, body).then(function (mid) {
        return subtle.encrypt({ name: "AES-GCM", iv: iv, additionalData: recAad(label, slot) }, rk.gcm, new Uint8Array(mid));
      });
    }).then(function (outer) {
      var o = new Uint8Array(outer);
      var signed = cat(new Uint8Array([4]), slot, iv, o);
      return subtle.sign("HMAC", ks.mac, signed).then(function (tag) {
        return "2." + b64(slot) + "." + b64(iv) + "." + b64(o) + "." + b64(new Uint8Array(tag));
      });
    });
  }
  function unpackBody(body) {
    var flat = unpadBytes(new Uint8Array(body));
    if (flat.length < 2) throw new Error("shape");
    var nlen = (flat[0] << 8) | flat[1];
    if (nlen > flat.length - 2) throw new Error("shape");
    var dec = new TextDecoder();
    return { name: dec.decode(flat.subarray(2, 2 + nlen)), value: dec.decode(flat.subarray(2 + nlen)) };
  }
  function openPair(ks, envelope, label) {
    var parts = String(envelope || "").split(".");
    if (parts.length !== 5 || parts[0] !== "2") return Promise.reject(new Error("shape"));
    var slot, iv, o, tag;
    try { slot = unb64(parts[1]); iv = unb64(parts[2]); o = unb64(parts[3]); tag = unb64(parts[4]); }
    catch (e) { return Promise.reject(new Error("shape")); }
    var subtle = window.crypto.subtle;
    /* Подпись — ПЕРВОЙ. Расшифровывать неподписанное значит впускать в
       расшифровщик чужие байты; encrypt-then-MAC затем и придуман. Сперва
       пробуется третья редакция (её пишет система), затем прежняя. */
    function third() {
      if (label == null) return Promise.reject(new Error("label"));
      return subtle.verify("HMAC", ks.mac, tag, cat(new Uint8Array([4]), slot, iv, o)).then(function (good) {
        if (!good) throw new Error("mac");
        return recKeys(ks, label, slot);
      }).then(function (rk) {
        return subtle.decrypt({ name: "AES-GCM", iv: iv, additionalData: recAad(label, slot) }, rk.gcm, o).then(function (mid) {
          return subtle.decrypt({ name: "AES-CTR", counter: slot, length: 64 }, rk.ctr, new Uint8Array(mid));
        });
      }).then(function (body) { var r = unpackBody(body); r.edition = 3; return r; });
    }
    function second() {
      return subtle.verify("HMAC", ks.mac, tag, cat(new Uint8Array([2]), slot, iv, o)).then(function (good) {
        if (!good) throw new Error("mac");
        return subtle.decrypt({ name: "AES-GCM", iv: iv, additionalData: slot }, ks.gcm, o);
      }).then(function (mid) {
        return subtle.decrypt({ name: "AES-CTR", counter: slot, length: 64 }, ks.ctr, new Uint8Array(mid));
      }).then(function (body) { var r = unpackBody(body); r.edition = 2; return r; });
    }
    return third().then(null, function () { return second(); });
  }

  /* ── ВЕЩЬ В КОНВЕРТЕ (D-265 → D-352) ──────────────────────────────────
     С D-352 вещь под замком лежит в складе носителя; конвертом ложится только
     то, что не поместилось в склад у поворота ключа или на устройстве без
     места под склад, а прежние конверты читаются и переезжают в склад.
     Те же два шифра и подпись, что у прежних записей (CTR → GCM → HMAC-SHA-512), на
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
  /* Запечатывание, переезд в склад носителя (D-352) и распечатывание идут
     ОДНОЙ очередью: иначе открытие замка (переезд своего) и снятие замка
     (распечатать всё), начатые подряд, разошлись бы по складу наперегонки, и
     вещь осталась бы запечатанной ключом, которого уже нет. Какие открытые
     вещи берёт мир при входе — только те, о которых он знает (номер вещи в
     одной из его записей), см. thLegacy: открытая вещь, оставшаяся от
     прежнего выпуска, могла принадлежать другому миру. */
  var thingsWork = Promise.resolve();
  function thingsQueue(job) {
    thingsWork = thingsWork.then(job, job);
    return thingsWork;
  }
  function unsealThingsNow(ks) {
    return thingsQueue(function () { return unsealThingsJob(ks); });
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
  /* ─────── ДВА МИРА, И ВТОРОЙ НЕОТЛИЧИМ ОТ ПУСТОТЫ (v98 → D-351) ───────
     ПОВОД. Основатель просил шифрование «в десять раз сильнее, чем у Signal».
     Такой величины не существует: AES-256 уже за пределами перебора, и
     умножить невозможность на десять нельзя. Зато можно уметь то, чего не
     умеет ни Signal, ни кто-либо ещё из массовых: ТРЕВОЖНЫЙ ПАРОЛЬ.

     КАК УСТРОЕНО (с v177, D-351). В носителе ВСЕГДА две ячейки одного
     размера. В ячейке мира — его мастер-ключ, закрытый ключом из его слова,
     и его записи под ключами из мастера. Мир другого слова для этого —
     случайные байты. До v177 то же делали две двери в записи замка — два
     конверта мастер-ключа — и конверты записей с именами из мастера.

     ГЛАВНОЕ, И БЕЗ ЭТОГО ВСЁ БЕССМЫСЛЕННО: вторая ячейка стоит ВСЕГДА, даже
     когда тревожного пароля нет. Тогда в ней случайные байты и случайная
     печать, которые не откроет никто и никогда, и по диску НЕЛЬЗЯ узнать,
     есть ли в ней мир. Если бы место появлялось только при заведённом
     тревожном пароле, само его наличие и было бы признанием. И номер ячейки
     не говорит, чья она: главный мир лежит в случайной, роль узнаётся только
     сверкой печати.

     ПРОВЕРЯЮТСЯ ВСЕГДА ОБЕ. Не «первая, а если не вышло — вторая»: иначе
     время ответа говорило бы, какая ячейка открылась. Растяжка одна на
     попытку, и обе ячейки сверяются под обеими ролями всегда.

     ЧЕГО ЭТО НЕ ДАЁТ, и Совет говорит вслух: по НЕСКОЛЬКИМ снимкам диска видно,
     какая ячейка менялась, — значит, открывали ли между снимками второй мир.
     Тревожный пароль защищает от того, кто ЗАСТАВЛЯЕТ ОТКРЫТЬ и изучает один
     снимок диска, а не от того, кто снимает диск много раз. Эпоха записи
     (следующая ступень) спрячет, когда и что писали, но не то, что менялись ячейки
     другого мира: их без его ключа не перешифровать — это остаточная граница
     One Door, названная в документе. Прежде здесь стояла иная граница — видно ЧИСЛО
     конвертов; её закрыли пустышки ступенями (D-206), а носитель одного
     размера сделал ненужными и их.

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
     ещё один вход к мастер-ключу, который открывается не словом, а кодом:
     160 случайных бит, тридцать два знака без путаницы (алфавит Крокфорда:
     нет I, L, O, U). Код показывается ОДИН раз — на бумагу; на диске его нет
     ни байта. Код не проверяется отдельно: он ВЫВОДИТ ключ той же растяжкой,
     что и слово, — обходить нечего.
     С носителем (D-351) это ЩЕЛЬ КОДА в ячейке главного мира; до v177 —
     запасная дверь в записи замка. ЩЕЛЬ КОДА СТОИТ ВСЕГДА, в каждой ячейке:
     без кода в ней шум той же длины. Иначе диск говорил бы, есть ли у
     человека код.
     КОД ОДНОРАЗОВЫЙ: открыл — щель снова становится шумом, и окно аккаунта
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
  /* Ключи кода (D-351): одна растяжка — ключ щели кода в носителе и ключ
     прежней запасной двери (для замка, ещё не переехавшего). */
  function codeKeys(code, saltB64, kdf) {
    var sk = costOf({ kdf: kdf || spareKdf() });
    return deriveKEK(spareSecret(spareNorm(code)), saltB64, sk[0], sk[1], null, null, true).then(function (b) {
      var bits = new Uint8Array(b);
      /* Байты ключа щели кода отдаются вызывающему: они ложатся в тело ячейки
         (см. worldText) — вызывающий обнуляет их, как только положил. */
      return Promise.all([
        window.crypto.subtle.importKey("raw", bits, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]),
        slotKeyFrom(bits, "sys.baby/carrier/code/v1")
      ]).then(function (k) { return { gcm: k[0], slot: k[1], bits: bits }; }, function (e) { bits.fill(0); throw e; });
    });
  }
  function codeSlotKey(code, saltB64) { return codeKeys(code, saltB64, null).then(function (k) { k.bits.fill(0); return k.slot; }); }

  /* ── «КТО СТУЧАЛСЯ» — ЗАПЕЧАТАННЫЙ СЛЕД СТУКА (D-341) ─────────────────────
     Подарок людям, выбранный основателем 28.09.2026 (вариант 20). Неверное
     слово у двери замка и неверный код восстановления оставляют ВРЕМЯ — и
     только время; самих слов нет нигде.
     ТРЕБОВАНИЕ ОСНОВАТЕЛЯ D-164: пока замок заперт, на диске читаемо только
     то, без чего замок не открыть. Поэтому след пишется сразу ЗАПЕЧАТАННЫМ:
     в записи замка лежит открытый ключ (ECDH P-256), и каждый стук ставит в
     конец ряда из двадцати слотов время, зашифрованное к этому ключу, а самый
     старый слот уходит из начала: внутри — ровно последние стуки. Закрытый ключ
     завёрнут под мастер-ключ мира — прочесть след может только открытая
     система. Слоты заполнены шифром нуля с первой минуты замка: снаружи
     запись одинакова, стучались или нет. Завёрнутых ключей два, по ячейкам
     носителя (D-351): у ячейки главного мира — под его мастер, у другой —
     под мастер второго мира, а без него — случайные байты той же длины:
     запись не говорит, есть ли второй мир. Новой открытой записи на диске нет.
     РЯД — В НОСИТЕЛЕ (D-353): ключ и обёртки лежат в записи замка, а сам ряд
     — в записи «one» склада «carrier», рядом с ячейками, и пишется через
     дверь записи носителя. Прежде стук переписывал запись замка целиком, а
     в ней живут поздние щели открытых вкладок: неизвестное слово могло
     отменить чужую запись. Теперь оно не пишет в localStorage ничего.
     ЧЕГО ЭТО НЕ ДАЁТ, вслух (сказано и в окне замка): перебор снятой копии
     диска следа не оставляет; стёртое хранилище браузера стирает и след; по
     двум снимкам диска видно, что запись замка менялась и сколько стуков
     легло между снимками, — но не их время и не слова.
     Охраняется tools/knock-check.mjs. */
  var KNOCK_SLOTS = 20; /* ПОСТОЯННАЯ: двадцать слотов — хватает, чтобы увидеть осаду, и запись замка не растёт. */
  var KNOCK_SEEN = "sysbaby.knock.seen";
  var knockLast = [];
  function knockAes(bits, info) {
    var subtle = window.crypto.subtle, enc = new TextEncoder();
    return subtle.importKey("raw", bits, "HKDF", false, ["deriveKey"]).then(function (k) {
      return subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt: new Uint8Array(0), info: enc.encode(info) }, k, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    });
  }
  /* Слот: эфемерный открытый ключ (65) · вектор (12) · шифр времени (8 + 16). */
  function knockSeal(pubRaw, t) {
    var subtle = window.crypto.subtle, curve = { name: "ECDH", namedCurve: "P-256" };
    return Promise.all([
      subtle.importKey("raw", pubRaw, curve, false, []),
      subtle.generateKey(curve, true, ["deriveBits"])
    ]).then(function (k) {
      return Promise.all([subtle.deriveBits({ name: "ECDH", public: k[0] }, k[1].privateKey, 256), subtle.exportKey("raw", k[1].publicKey)]);
    }).then(function (r) {
      return knockAes(r[0], "sys.baby/knock/slot/v1").then(function (key) {
        var iv = new Uint8Array(12), body = new Uint8Array(8);
        window.crypto.getRandomValues(iv);
        new DataView(body.buffer).setFloat64(0, t);
        return subtle.encrypt({ name: "AES-GCM", iv: iv }, key, body).then(function (ct) {
          var eph = new Uint8Array(r[1]), c = new Uint8Array(ct), out = new Uint8Array(eph.length + 12 + c.length);
          out.set(eph, 0); out.set(iv, eph.length); out.set(c, eph.length + 12);
          return b64(out);
        });
      });
    });
  }
  function knockOpen(priv, slot) {
    var subtle = window.crypto.subtle, raw = unb64(slot);
    if (raw.length < 65 + 12 + 24) return Promise.resolve(0);
    return subtle.importKey("raw", raw.slice(0, 65), { name: "ECDH", namedCurve: "P-256" }, false, []).then(function (eph) {
      return subtle.deriveBits({ name: "ECDH", public: eph }, priv, 256);
    }).then(function (bits) {
      return knockAes(bits, "sys.baby/knock/slot/v1");
    }).then(function (key) {
      return subtle.decrypt({ name: "AES-GCM", iv: raw.slice(65, 77) }, key, raw.slice(77));
    }).then(function (buf) { return new DataView(buf).getFloat64(0); });
  }
  function knockWrap(masterBytes, pkcs8) {
    return knockAes(masterBytes, "sys.baby/knock/wrap/v1").then(function (key) {
      var iv = new Uint8Array(12);
      window.crypto.getRandomValues(iv);
      return window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, pkcs8).then(function (ct) { return { iv: b64(iv), ct: b64(ct) }; });
    });
  }
  /* Второй завёрнутый ключ без второго мира: случайные байты той же длины. */
  function knockNoise(like) {
    var iv = new Uint8Array(12), ct = new Uint8Array(unb64(like.ct).length);
    window.crypto.getRandomValues(iv); window.crypto.getRandomValues(ct);
    return { iv: b64(iv), ct: b64(ct) };
  }
  function makeKnock(master0, master1) {
    var subtle = window.crypto.subtle;
    return subtle.generateKey({ name: "ECDH", namedCurve: "P-256" }, true, ["deriveBits"]).then(function (kp) {
      return Promise.all([subtle.exportKey("raw", kp.publicKey), subtle.exportKey("pkcs8", kp.privateKey)]);
    }).then(function (r) {
      var pubRaw = new Uint8Array(r[0]), pk = new Uint8Array(r[1]);
      return knockWrap(master0, pk).then(function (w0) {
        return (master1 ? knockWrap(master1, pk) : Promise.resolve(knockNoise(w0))).then(function (w1) {
          pk.fill(0);
          var jobs = [], i;
          for (i = 0; i < KNOCK_SLOTS; i++) jobs.push(knockSeal(pubRaw, 0));
          return Promise.all(jobs).then(function (slots) { return { pub: b64(pubRaw), wrap: [w0, w1], slots: slots }; });
        });
      }, function (e) { pk.fill(0); throw e; });
    });
  }
  /* Закрытый ключ следа — развёрнутый мастером ОТКРЫТОГО мира, неизвлекаемый. */
  function knockPrivate(rec) {
    var door = (typeof vaultDoor === "number" && vaultDoor >= 0) ? vaultDoor : 0;
    var w = rec && rec.knock && rec.knock.wrap && rec.knock.wrap[door];
    if (!w) return Promise.resolve(null);
    return withMaster(function (m) { return knockAes(m, "sys.baby/knock/wrap/v1"); }).then(function (key) {
      return window.crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(w.iv) }, key, unb64(w.ct));
    }).then(function (buf) {
      var pk = new Uint8Array(buf);
      return window.crypto.subtle.importKey("pkcs8", pk, { name: "ECDH", namedCurve: "P-256" }, false, ["deriveBits"])
        .then(function (priv) { pk.fill(0); return priv; }, function () { pk.fill(0); return null; });
    }, function () { return null; });
  }
  /* Завёрнутые ключи следа стоят ПО ЯЧЕЙКАМ, а не по ролям (D-351): wrap[r] —
     под мастер мира ячейки r. makeKnock отдаёт [главный, второй]; если
     главный мир лежит в ячейке 1 — пара переставляется. */
  function knockInCells(k, cellOfMain) {
    if (k && Array.isArray(k.wrap) && cellOfMain === 1) k.wrap = [k.wrap[1], k.wrap[0]];
    return k;
  }
  /* Для тревожного мира: тот же закрытый ключ, завёрнутый под его мастер.
     Разворачивается ключом открытого (главного) мира — из его ячейки. */
  function knockForWorld(masterBytes) {
    var cell = (typeof vaultDoor === "number" && vaultDoor >= 0) ? vaultDoor : 0;
    var rec = lockRecord(), w = rec && rec.knock && rec.knock.wrap && rec.knock.wrap[cell];
    if (!w) return Promise.resolve(null);
    var mc = new Uint8Array(masterBytes);
    return withMaster(function (m) { return knockAes(m, "sys.baby/knock/wrap/v1"); }).then(function (key) {
      return window.crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(w.iv) }, key, unb64(w.ct));
    }).then(function (buf) {
      var pk = new Uint8Array(buf);
      return knockWrap(mc, pk).then(function (w1) { pk.fill(0); mc.fill(0); return w1; });
    }).then(null, function () { mc.fill(0); return null; });
  }
  window.sbKnock = {
    max: KNOCK_SLOTS,
    /* Стук: время, запечатанное к открытому ключу, встаёт в конец ряда, а самый
       старый слот уходит из начала. Ряд всегда длиной KNOCK_SLOTS, и все слоты
       снаружи одинаковы; внутри — ровно последние стуки, ни один не ложится
       поверх другого (первый вид клал стук в случайный слот и терял стуки). */
    note: function () {
      /* Ряд стуков лежит в самом носителе (D-353), а не в записи замка: запись
         замка пишут поздние щели открытых вкладок, и стук, переписывавший её
         целиком, мог отменить их. Стук — запись через ту же дверь записи, и
         ни одной ячейки она не касается. */
      var rec = lockRecord();
      if (!rec || !rec.knock || !rec.knock.pub) return Promise.resolve(false);
      return knockSeal(unb64(rec.knock.pub), Date.now()).then(function (slot) {
        return carrierCommit(CARRIER_ANY, [], function (next) {
          if (!Array.isArray(next.knock) || !next.knock.length) throw new Error("no-knock");
          next.knock = next.knock.slice(1).concat([slot]);
        }).then(function () { return true; }, function () { return false; });
      }, function () { return false; });
    },
    /* Прочесть след — только открытой системой. Замку, поставленному до
       D-341, след заводится при первом открытии главным словом. */
    read: function () {
      if (!vaultOpen || !lockRecord()) return Promise.resolve([]);
      /* Ряд, ещё лежащий в записи замка, сперва переезжает — иначе новый ряд
         шума занял бы его место и прежний след пропал бы. */
      return knockToCarrier().then(function () { return carrierRead(); }).then(function (c) {
        var rec = lockRecord();
        if (!rec) return [];
        var slots = c && Array.isArray(c.knock) && c.knock.length ? c.knock : null;
        if (!rec.knock || !rec.knock.pub || !slots) {
          if (vaultRole !== 0 || !c || !LOCKS) return [];   /* без Web Locks след не заводится (A1) */
          return withMaster(function (m) { return makeKnock(new Uint8Array(m), null); }).then(function (k) {
            knockInCells(k, vaultDoor);
            var now = lockRecord(), pub = k.pub;
            if (now && !(now.knock && now.knock.pub)) { now.knock = { pub: k.pub, wrap: k.wrap }; lsSet(LOCK_KEY, JSON.stringify(now)); }
            else if (now && now.knock && now.knock.pub) pub = now.knock.pub;
            /* Ряд — шум того же вида к тому ключу, что лежит в записи замка. */
            var fill = pub === k.pub ? Promise.resolve(k.slots) : Promise.all(Array.from({ length: KNOCK_SLOTS }, function () { return knockSeal(unb64(pub), 0); }));
            return fill.then(function (fresh) {
              return carrierCommit(CARRIER_ANY, [], function (next) { if (!Array.isArray(next.knock) || !next.knock.length) next.knock = fresh; });
            }).then(function () { knockLast = []; return []; }, function () { return []; });
          }, function () { return []; });
        }
        return knockPrivate(rec).then(function (priv) {
          if (!priv) return [];
          return Promise.all(slots.map(function (x) { return knockOpen(priv, x).then(null, function () { return 0; }); }));
        }).then(function (ts) {
          knockLast = ts.filter(function (t) { return typeof t === "number" && isFinite(t) && t > 0; }).sort(function (a, b) { return a - b; });
          return knockLast.slice();
        }, function () { return []; });
      });
    },
    last: function () { return knockLast.slice(); },
    fresh: function () {
      return window.sbKnock.read().then(function (list) {
        var seen = 0;
        try { seen = Number(window.localStorage.getItem(KNOCK_SEEN)) || 0; } catch (e) { seen = 0; }
        return list.filter(function (t) { return t > seen; });
      });
    },
    seen: function () { try { window.localStorage.setItem(KNOCK_SEEN, String(Date.now())); } catch (e) { /* место не далось — скажем ещё раз */ } }
  };
  /* Ряд стуков, лежавший в записи замка (до укрепления D-353), переезжает в
     носитель: один раз, через дверь записи, и лишь затем уходит из записи
     замка. Замку без носителя (до v177) ряд переедет после первого входа. */
  function knockToCarrier() {
    if (!LOCKS) return Promise.resolve(false);   /* запись замка — общее для вкладок (A1) */
    var rec = lockRecord();
    if (!rec || !rec.knock || !Array.isArray(rec.knock.slots)) return Promise.resolve(false);
    var slots = rec.knock.slots.slice();
    return carrierRead().then(function (c) {
      if (!c) return false;
      return carrierCommit(CARRIER_ANY, [], function (next) { if (!Array.isArray(next.knock) || !next.knock.length) next.knock = slots; }).then(function () {
        var now = lockRecord();
        if (now && now.knock && now.knock.slots) { delete now.knock.slots; lsSet(LOCK_KEY, JSON.stringify(now)); }
        return true;
      });
    }).then(null, function () { return false; });
  }
  /* Перекладка записи замка в вид D-353 — один раз, при загрузке. */
  /* Запись замка у localStorage без транзакций: разовая перекладка пишет,
     только если строка записи та же, что прочитана (перечитана в том же
     шаге) — иначе её переложит тот, кто записал. */
  function lockRecordSwap(before, next) {
    if (lsGet(LOCK_KEY) !== before) return false;
    return lsSet(LOCK_KEY, JSON.stringify(next));
  }
  function lockTo5() {
    var raw = lsGet(LOCK_KEY), rec = lockRecord();
    if (rec && rec.carrier && !rec.carrier5) { rec.carrier5 = rec.carrier; delete rec.carrier; lockRecordSwap(raw, rec); }
  }
  /* ── СНЯТИЕ ЗАМКА: ПРАВО, ПОРЯДОК, ОБРЫВ (D-353, шаг 4) ─────────────────
     ПРАВО. Снимать (и стирать хранилище при замке) вправе только писатель
     ячейки — вкладка, держащая её Web Lock (mayErase). Замёрзшая, читающая
     и вкладка без Web Locks — отказ.
     ПОРЯДОК, и каждое промежуточное состояние лечится:
       (1) ЗАБОР — сравнением-и-заменой ОБЕИХ ячеек: «one».removing =
           { by: имя замка писателя }. С этого мига носитель не пишет никто
           (carrierCommit, вещи и стук отказывают забору).
       (2) В памяти, без единой записи: записи мира и вещи открытыми.
       (3) ОДНА транзакция IndexedDB: обе ячейки и забор сверены с (1) —
           вещи ложатся открытыми, склад носителя очищается, в нём остаётся
           одна запись «removal» с открытыми записями (переход).
       (4) Записи — открытыми в localStorage; запись замка и щели уходят.
       (5) Запись «removal» уходит.
     ОБРЫВ. Обрыв до (3): носитель цел, забор стоит — забор снимается, мир
     прежний, открытого нигде нет. Обрыв после (3): носителя нет, есть
     «removal» — снятие доводится (4)–(5). Лечит загрузка, и ТОЛЬКО если
     снимающего уже нет: его замок свободен (берётся без ожидания). Без
     часов: живое снятие, сколько бы оно ни шло, не трогается. */
  var REMOVAL_ID = "removal";
  /* ИЗРАСХОДОВАННАЯ ПРЕЖНЯЯ ЗАПАСНАЯ ДВЕРЬ (финальный разбор H1, Г10). Код
     замка до D-351 лежит запасной дверью в записи замка (rec.spare); он
     расходуется строгой записью носителя, а из записи замка уходит позже —
     в localStorage, который ложится на диск с задержкой. Обрыв питания в
     этом окне оставлял прежнюю запасную дверь, и израсходованный код
     открывал мир снова. Теперь расход кода (и замена его новым) кладёт в
     сам носитель той же записью отпечаток двери (поле spent записи «one»),
     и дверь с таким отпечатком не открывает ничего. Отпечаток — SHA-256
     обёртки двери: тайны в нём нет, обёртка лежит открыто в записи замка.
     Снятие и «Удалить все» уносят его вместе с носителем; новый замок
     начинает без него. */
  function spareFp(sp) {
    if (!sp || !sp.wrap) return Promise.resolve(null);
    return window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(sp.wrap))).then(function (d) { return hexOf(new Uint8Array(d)); }, function () { return null; });
  }
  function spareSpent(c, fp) { return !!(c && fp && Array.isArray(c.spent) && c.spent.indexOf(fp) !== -1); }
  function spendAlso(fp) {
    return fp ? function (next) { if (!Array.isArray(next.spent)) next.spent = []; if (next.spent.indexOf(fp) === -1) next.spent.push(fp); } : null;
  }
  /* Пока загрузка доводит снятие, страница не пишет ничего: она поднялась
     запертой и пустой, и её пустота легла бы поверх открытых записей
     (нашёл one-writer-check: sbDB записывал «[]» поверх записей мира). */
  var healingNow = false;
  function removalRead() {
    return idb().then(function (db) {
      if (!db) return null;
      return new Promise(function (resolve) {
        var q;
        try { q = db.transaction(CARRIER_STORE, "readonly").objectStore(CARRIER_STORE).get(REMOVAL_ID); } catch (e) { resolve(null); return; }
        q.onsuccess = function () { resolve(q.result || null); };
        q.onerror = function () { resolve(null); };
      });
    });
  }
  /* (4): открытые записи — в localStorage (и правки, накопленные за
     переход, — ДО снятия записи замка), затем запись замка и щели — вон.
     Записи localStorage одного шага ложатся на диск по порядку: нет на
     диске записи замка — значит, открытые записи легли раньше неё.
     (5) переход НЕ уносится здесь: localStorage браузер сбрасывает на диск
     с задержкой, а носитель уже очищен строгой записью IndexedDB — обрыв
     питания в этом окне оставил бы запись замка без мира. Переход уносит
     следующая загрузка (carrierHealHeld). Повторяемо. */
  function removalFinish(st, extra) {
    /* Эта вкладка сама доводит снятие: исчезновение замка — её дело. */
    ownGone = seenLock;
    var kv = (st && st.kv) || {}, k, laid = [], extraFailed = false;
    try {
      for (k in kv) if (Object.prototype.hasOwnProperty.call(kv, k) && kv[k] != null) { rawStore.set.call(window.localStorage, k, String(kv[k])); laid.push(k); }
      (st && Array.isArray(st.sealed) ? st.sealed : []).forEach(function (n) { rawStore.del.call(window.localStorage, n); });
      rawStore.del.call(window.localStorage, lateKey(0));
      rawStore.del.call(window.localStorage, lateKey(1));
      rawStore.del.call(window.localStorage, LOCK_KEY);
    } catch (e) {
      /* Не легло до снятия записи замка (места не хватило, страница умерла
         на записи) — легшее откатывается: открытое не лежит рядом со
         стоящей записью замка (D-265; разбор №5). Мир — в переходе, его
         доведёт загрузка. */
      if (rawStore.get.call(window.localStorage, LOCK_KEY) != null) laid.forEach(function (n) { try { rawStore.del.call(window.localStorage, n); } catch (e2) { /* ignore */ } });
      throw e;
    }
    /* Запись замка снята. Правки перехода — ПОСЛЕ неё (разбор №5): записи
       localStorage ложатся на диск по порядку, и всё, что легло после
       снятия записи замка, загрузка, доводящая снятие, уже не тронет —
       стоит запись замка, значит, ничего позднее неё не легло. */
    if (extra) extra.forEach(function (v, key) {
      try { if (v == null) rawStore.del.call(window.localStorage, key); else rawStore.set.call(window.localStorage, key, String(v)); }
      catch (e) { extraFailed = true; }
    });
    if (extraFailed) removalSayRoom();
    /* Замка больше нет — и вкладка знает, что его нет: следующий поворот
       ключа в ней же — свой, не чужой (разбор №4). */
    seenLock = null; ownGone = null;
    return true;
  }
  /* Хватит ли места положить записи открытыми: проба того же размера
     (знаков; квота localStorage считается знаками) и сразу её стирание. */
  var ROOM_KEY = "sysbaby.lock.room";
  function roomForOpen(kv) {
    var n = 0, k;
    for (k in kv) if (Object.prototype.hasOwnProperty.call(kv, k) && kv[k] != null) n += k.length + String(kv[k]).length;
    /* С запасом на правки, что лягут за переход (их пока нет в kv). */
    n += LATE_SIZE;
    try {
      rawStore.set.call(window.localStorage, ROOM_KEY, new Array(n + 1).join("0"));
      rawStore.del.call(window.localStorage, ROOM_KEY);
      return true;
    } catch (e) {
      try { rawStore.del.call(window.localStorage, ROOM_KEY); } catch (e2) { /* ignore */ }
      return false;
    }
  }
  /* Переход — тем, что легло открытым (своё снятие, под правом писателя). */
  function removalMark(by, laid) {
    return idb().then(function (db) {
      if (!db) return false;
      return new Promise(function (resolve) {
        var tx, store, q, done = false;
        try { tx = db.transaction(CARRIER_STORE, "readwrite", { durability: "strict" }); store = tx.objectStore(CARRIER_STORE); q = store.get(REMOVAL_ID); } catch (e) { resolve(false); return; }
        q.onsuccess = function () {
          var cur = q.result;
          if (!cur || cur.by !== by) return;
          cur.kv = laid;
          store.put(cur);
          done = true;
        };
        tx.oncomplete = function () { resolve(done); };
        tx.onabort = function () { resolve(false); };
      });
    }).then(null, function () { return false; });
  }
  /* (5) Унести переход — только тот самый (имя снимающего то же). */
  function removalDrop(st) {
    return idb().then(function (db) {
      if (!db) return false;
      return new Promise(function (resolve) {
        var tx, store, q, done = false;
        try { tx = db.transaction(CARRIER_STORE, "readwrite", { durability: "strict" }); store = tx.objectStore(CARRIER_STORE); q = store.get(REMOVAL_ID); } catch (e) { resolve(false); return; }
        q.onsuccess = function () {
          var cur = q.result;
          if (!cur || cur.by !== st.by) return;
          store["delete"](REMOVAL_ID);
          done = true;
        };
        tx.oncomplete = function () { resolve(done); };
        tx.onabort = function () { resolve(false); };
      });
    });
  }
  /* Снять забор (откат обрыва до (3)) — только свой: имя снимающего то же. */
  function carrierUnfence(by) {
    return idb().then(function (db) {
      if (!db) return false;
      return new Promise(function (resolve) {
        var tx, st, q, done = false;
        try { tx = db.transaction(CARRIER_STORE, "readwrite", { durability: "strict" }); st = tx.objectStore(CARRIER_STORE); q = st.get(CARRIER_ID); } catch (e) { resolve(false); return; }
        q.onsuccess = function () {
          var cur = carrierNorm(q.result);
          if (!cur || !cur.removing || cur.removing.by !== by) return;
          var keep = carrierCopy(cur);
          delete keep.removing;
          st.put(carrierRecord(keep));
          done = true;
        };
        tx.oncomplete = function () { resolve(done); };
        tx.onabort = function () { resolve(false); };
      });
    });
  }
  /* Лечит загрузка, держа право писателя: снимающий держит его до конца
     снятия, значит свободное право — снимающего нет. Под правом всё
     перечитывается заново: другая вкладка могла долечить раньше. */
  /* ПЕРЕХОД ЗНАЕТ СВОЙ ЗАМОК (разборы №3–4): в нём соль записи замка,
     которую снимали.
       · Стоит та же запись замка (и через HEAL_SETTLE_MS) — снятие не дошло
         до диска: довести (4). Переход остаётся.
       · Записи замка нет — (4) легло, а легло ли на ДИСК, браузер не
         говорит: localStorage он сбрасывает с задержкой. Переход остаётся
         запасной копией и ничего не применяет (открытое могло стать
         новее). Уносит его следующий поворот ключа — той же транзакцией,
         что кладёт новый замок, — или «Удалить все локальные данные».
       · Стоит другая запись замка — переход прежнего замка: его мир уже
         вошёл в новый замок; унести, не применяя.
     Переход без соли (сборки до разбора №3 к людям не выходили) — довести,
     только если запись замка стоит, а ячеек нет. */
  /* ПОСТОЯННАЯ: 300 мс — дольше передачи записи localStorage между процессами браузера (та же мера, что у поздней щели): снявшая вкладка могла только что снять запись замка, а до этой вкладки это ещё не дошло. */
  var HEAL_SETTLE_MS = 300;
  /* ЗАМОК СВОЕГО СНЯТИЯ (классификация границ, Г3-1). После снятия вкладка
     не перезагружается и пишет открыто. Загружающаяся вкладка, до которой
     удаление записи замка ещё не дошло (кеш localStorage на процесс), видела
     ту же соль и «доводила» снятие — клала старые записи перехода поверх
     новых правок снимавшей; пауза HEAL_SETTLE_MS этого не доказывала. Теперь
     снимавшая, пока жива, держит замок с именем её снятия — того же вида,
     что приманки, и вместо приманки, — а лечение перехода, чья снимавшая
     жива, не начинается вовсе. Свой следующий поворот ключа в той же
     вкладке меняет этот замок на право писателя: переход уносит его же
     запись носителя. Не дошёл поворот до записи — переход остаётся без
     замка снятия, но и лечить его нечем: лечение требует видеть прежнюю
     запись замка, а её снятие уже унесло. */
  function removalLockName(by) {
    return window.crypto.subtle.digest("SHA-256", new TextEncoder().encode("sys.baby/removal/v1/" + String(by))).then(function (d) { return hexOf(new Uint8Array(d)); });
  }
  function removalHold(by) {
    if (!LOCKS || !by) { writerDrop(); return Promise.resolve(false); }
    return removalLockName(by).then(function (name) { return lockTry(name); }).then(function (h) {
      if (!h) { writerDrop(); return false; }
      lockSwap(h, false);
      if (writeRight === "lock") writeRight = false;
      return true;
    }, function () { writerDrop(); return false; });
  }
  function removalAlive(st) {
    if (!LOCKS || !st || !st.by) return Promise.resolve(false);
    return Promise.all([removalLockName(st.by), LOCKS.query()]).then(function (got) {
      var held = (got[1] && got[1].held) || [];
      return held.some(function (l) { return l && l.name === got[0]; });
    }, function () { return true; });
  }
  function carrierHealHeld() {
    return Promise.all([carrierRead(), removalRead()]).then(function (got) {
      var c = got[0], st = got[1], now = lockSaltNow();
      var same = !!st && !!now && (st.salt ? now === st.salt : !c);
      if (same) {
        return removalAlive(st).then(function (alive) {
          if (alive) return "clean";
          return new Promise(function (r) { setTimeout(r, HEAL_SETTLE_MS); });
        }).then(function (v) {
          if (v === "clean") return "clean";
          if (lockSaltNow() !== now) return "clean";
          healingNow = true;
          try { removalFinish(st, null); }
          catch (e) {
            /* Места не хватило — переход цел, страница пишет снова и говорит это. */
            healingNow = false;
            removalSayRoom();
            return "clean";
          }
          return "finished";
        });
      }
      var dropped = st && now ? removalDrop(st) : Promise.resolve(false);
      return dropped.then(function (d) {
        if (c && c.removing && c.removing.by) return carrierUnfence(c.removing.by).then(function () { return "unfenced"; });
        return d ? "dropped" : "clean";
      });
    });
  }
  function removalSayRoom() {
    var tr = window.sbT || function (k) { return k; };
    try { if (typeof window.showToast === "function") window.showToast(tr("lock.title"), tr("lock.removeRoom"), "", true, "toast-warn", "event"); } catch (e) { /* ignore */ }
  }
  function carrierFenceHeal() {
    return Promise.all([carrierRead(), removalRead()]).then(function (got) {
      /* Лечить есть что: переход при стоящей записи замка или забор. Переход
         без записи замка — запасная копия до следующего замка; ради неё
         право писателя не берётся (иначе каждая загрузка на миг отнимала бы
         его у поворота ключа в другой вкладке). */
      if (!(got[1] && lockSaltNow()) && !(got[0] && got[0].removing)) return false;
      return lockTry(WRITER_LOCK).then(function (h) {
        if (!h) return false;                        /* право держит живая вкладка — не трогать */
        return carrierHealHeld().then(function (r) {
          try { h.release(); } catch (e) { /* ignore */ }
          /* Снятие доведено — страница поднимается заново, уже без замка. */
          if (r === "finished") { try { window.location.reload(); } catch (e) { /* ignore */ } }
          return r !== "clean";
        }, function () { try { h.release(); } catch (e) { /* ignore */ } return false; });
      });
    }).then(null, function () { return false; });
  }
  /* СТЕРЕТЬ ВСЁ ПРИ ЗАМКЕ («Удалить все локальные данные», «Стереть всё и
     уйти»; D-353, шаг 4). Только писатель открытого мира; своя ячейка
     сверена с тем, от чего считает сеанс, В ТОЙ ЖЕ транзакции, что очищает
     все склады базы: носитель, вещи, снимки, учётки. Не совпало — отказ, ни
     одного удаления. Прежде «Удалить все локальные данные» при замке
     оставляло носитель на диске — сказанное не было правдой. */
  /* Все склады базы разом, одной строгой транзакцией. */
  function clearAllStores() {
    return idb(true).then(function (db) {
      if (!db) return true;
      var names = Array.from(db.objectStoreNames);
      return new Promise(function (resolve, reject) {
        var tx;
        try { tx = db.transaction(names, "readwrite", { durability: "strict" }); names.forEach(function (n) { tx.objectStore(n).clear(); }); } catch (e) { reject(new Error("carrier")); return; }
        tx.oncomplete = function () { carrierMem = null; resolve(true); };
        tx.onabort = function () { reject(new Error("carrier")); };
      });
    });
  }
  function eraseAllStores() {
    /* При замке стирание — дело писателя открытого мира; без Web Locks
       писатель не доказан — отказ, ничего не стёрто (A1). */
    if (!LOCKS && lockRecord()) return Promise.reject(new Error("nolocks"));
    if (!mayErase()) return Promise.reject(new Error("writer"));
    /* Без замка — все склады базы разом, без сверки ячейки (ячеек нет): и
       запасная копия последнего снятия («removal»), и снимки, и вещи —
       «удалить все локальные данные» должно быть правдой (разбор №4). */
    if (!lockRecord()) {
      /* Идёт свой поворот ключа или своё снятие — стирать нельзя: стёрлось бы
         только что собранное (разбор №6). */
      if (turning || sealing || removingNow) return Promise.reject(new Error("busy"));
      /* Без Web Locks и без замка исключительность стиранию не нужна: замок
         без них не ставится и не поворачивается (A1), а вкладки сборок до A1
         отсечены воротами версий базы — стирать открытое есть только само
         открытое. Сразу: без паузы и без поддельного права. */
      if (!LOCKS) return clearAllStores();
      /* И без замка стирание — под правом писателя (разбор №5): пока другая
         вкладка поворачивает ключ, право у неё — отказ, а не её носитель,
         стёртый между его записью и записью замка. Право взято — ещё раз
         чуть погодя смотрим, не встал ли замок, до этой вкладки не дошедший. */
      var noop = { release: function () { /* своё право — не отпускать */ } };
      var take = heldLock && heldLock.world ? Promise.resolve(noop) : lockTry(WRITER_LOCK);
      return take.then(function (h) {
        if (!h) throw new Error("writer");
        var free = function () { try { h.release(); } catch (e) { /* ignore */ } };
        return new Promise(function (r) { setTimeout(r, HEAL_SETTLE_MS); }).then(function () {
          if (lockLost() || lockRecord()) throw new Error("writer");
          return clearAllStores();
        }).then(function (v) { free(); return v; }, function (e) { free(); throw e; });
      });
    }
    /* Стирание идёт и тогда, когда система уже «уходит» (sbVanishing):
       открыть базу вправе только оно. */
    return idb(true).then(function (db) {
      if (!db) throw new Error("carrier");
      var names = Array.from(db.objectStoreNames), r = vaultDoor;
      return new Promise(function (resolve, reject) {
        var tx, q, done = false;
        try { tx = db.transaction(names, "readwrite", { durability: "strict" }); q = tx.objectStore(CARRIER_STORE).get(CARRIER_ID); } catch (e) { reject(new Error("carrier")); return; }
        q.onsuccess = function () {
          var cur = carrierNorm(q.result), sl = cur && cur.seal && cur.seal[r] ? new Uint8Array(cur.seal[r]) : null;
          if (!cur || cur.removing || !ownBase || !sl || !sameBytes(sl, ownBase.seal) || !sameBytes(regionOf(cur, r), ownBase.region)) { try { tx.abort(); } catch (e) { /* ignore */ } return; }
          names.forEach(function (n) { tx.objectStore(n).clear(); });
          done = true;
        };
        tx.oncomplete = function () { if (done) { carrierMem = null; ownGone = seenLock; resolve(true); } else reject(new Error("stale")); };
        tx.onabort = function () { reject(new Error("stale")); };
      });
    });
  }
  /* (2) вещи открытыми — в памяти: своя половина склада и прежние
     конверты; конверт, который этим ключом не открыть, — вещь другого мира,
     после снятия она шум и уходит (как и прежде, D-352). */
  function thPlainAll(ks) {
    return thingsQueue(function () {
      var out = { put: [], del: [] };
      return thLoad(vaultDoor).then(function (st) {
        if (!st || !st.mac) return null;
        return st.dir.items.reduce(function (chain, it) {
          return chain.then(function () { return thReadItem(st, it); }).then(function (blob) {
            out.put.push({ id: it.id, blob: blob, name: it.name, mime: it.mime, size: it.size, at: it.at });
          });
        }, Promise.resolve());
      }).then(function () { return idbAll("things"); }).then(function (list) {
        /* Вещь своей половины склада — новее всего, что лежит под тем же
           именем в «things» (П9): переехавший конверт оставляет на своём месте
           пустышку с тем же id, и прежде она уходила в «удалить» — удаление в
           той же транзакции стирало только что открытую вещь. Под этим id
           ложится вещь склада: ни пустышка, ни старый конверт её не трогают. */
        var inHalf = {};
        out.put.forEach(function (x) { inHalf[x.id] = true; });
        return (list || []).reduce(function (chain, rec) {
          return chain.then(function () {
            if (!rec || !rec.sealed || inHalf[rec.id]) return null;
            return thingFromSealed(ks, rec).then(function (p) { out.put.push(p); }, function () { out.del.push(rec.id); });
          });
        }, Promise.resolve());
      }).then(function () { return out; });
    });
  }
  /* (3) одна транзакция на склад носителя и склад вещей. */
  function removalCommit(fenced, by, plain, kv, sealed, salt) {
    return idb().then(function (db) {
      if (!db) throw new Error("carrier");
      return new Promise(function (resolve, reject) {
        var tx, st, q, done = false;
        try {
          tx = db.transaction([CARRIER_STORE, "things"], "readwrite", { durability: "strict" });
          st = tx.objectStore(CARRIER_STORE);
          q = st.get(CARRIER_ID);
        } catch (e) { reject(new Error("carrier")); return; }
        q.onsuccess = function () {
          var cur = carrierNorm(q.result), r;
          if (!cur || !cur.removing || cur.removing.by !== by) { try { tx.abort(); } catch (e) { /* ignore */ } return; }
          for (r = 0; r < CARRIER_REGIONS; r++) if (!sameCell(cur, fenced, r)) { try { tx.abort(); } catch (e) { /* ignore */ } return; }
          /* Снимается тот замок, который знает снимающий. */
          if (!salt || lockSaltNow() !== salt) { try { tx.abort(); } catch (e) { /* ignore */ } return; }
          /* Поздняя щель своей ячейки сменилась не этой вкладкой (щель
             прежнего писателя дошла в самый переход): мир старше лежащего —
             снятия нет (разбор №6). */
          if (lateDrift()) { try { tx.abort(); } catch (e) { /* ignore */ } return; }
          var th = tx.objectStore("things");
          plain.put.forEach(function (x) { th.put(x); });
          plain.del.forEach(function (id) { th.delete(id); });
          st.clear();
          st.put({ id: REMOVAL_ID, by: by, salt: salt, kv: kv, sealed: sealed });
          done = true;
        };
        tx.oncomplete = function () { if (done) resolve(true); else reject(new Error("stale")); };
        tx.onabort = function () { reject(new Error("stale")); };
      });
    });
  }
  carrierFenceHeal();
  /* Разовые перекладки записи замка (вид D-353: поле носителя carrier5, щели
     своими записями, ряд стуков в носителе) — чтение-правка-запись общего:
     только писателем при входе (разбор A1-3), см. lockFormatAsWriter. При
     загрузке право не просится вовсе: оно отнимало бы его у двери соседней
     вкладки и у лечения оборванного снятия. Без Web Locks перекладки нет —
     запись прежнего вида читается как есть (lateRead, carrierSize). */
  function lockFormatAsWriter() {
    if (!LOCKS || !vaultOpen || carrierStale || writeRight !== "lock" || !(heldLock && heldLock.world) || !lockRecord()) return;
    lockTo5();
    lateToKeys();
    if (lockRecord() && !Array.isArray((lockRecord() || {}).late)) lateEnsure();
    /* Свои же щели — своя запись, а не чужая: память о них идёт вслед. */
    if (lateKnown) lateKnown.v = lateRead(lateKnown.cell);
  }
  /* У каждого замка обе щели есть всегда — и после сбоя места тоже. */
  /* Отметка «код заведён» — ВНУТРИ хранилища, под замком: снаружи её нет,
     и в тревожном мире она своя. */
  function markSpare(on) {
    try { if (on) lsSet(SPARE_KEY, String(Date.now())); else lsDel(SPARE_KEY); } catch (e) { /* ignore */ }
  }

  /* СОЛЬ У ЗАМКА ОДНА НА ОБА МИРА, и это не экономия на стойкости.
     Соль мешает считать таблицы ЗАРАНЕЕ и СРАЗУ НА МНОГИХ; для двух миров
     одного человека на одном устройстве разные соли не добавляют ничего, а
     стоят ровно вдвое: открытие считало бы растяжку дважды. С одной солью
     растяжка считается ОДИН раз, а полученный ключ пробуется на обеих
     ячейках (до v177 — на обеих дверях) — это уже дешёвые действия. Заодно исчезает утечка временем:
     стоимость попытки одинакова всегда. */

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
       же удачном открытии переезжает в носитель (moveWorld, D-351). */
    return [{ salt: rec.salt, wrapIv: rec.wrapIv, wrap: rec.wrap }];
  }

  /* ── СЛОВО ИЩЕТ СВОЙ МИР: ЯЧЕЙКИ, РЕЗЕРВ ПРЕЖНЕЙ ДВЕРИ, ПРЕЖНИЕ ДВЕРИ (D-351) ──
     Одна растяжка на попытку. Её итог даёт два ключа: ключ щели слова в
     носителе и ключ прежних дверей (GCM) — для замка, ещё не переехавшего
     целиком. Пробуются ВСЕ ячейки под обеими ролями, ВСЕ места резерва и ВСЕ
     прежние двери, всегда (Promise.all, а не гонка); ответ —
     { i, m, role, src: "carrier" | "reserved" | "legacy", slot } или null.
       i    — номер ячейки (−1, если мир ещё за прежней дверью записи замка);
       role — 0 главный мир, 1 второй: сошедшаяся роль печати, место резерва
              или номер прежней двери.
     ДВЕРЬ ОТВЕЧАЕТ, А НЕ ПЕРЕКЛЮЧАЕТ (D-349): проба — это не только вход, но
     и смена слова, второе слово, код, второй ключ, замер цены заведомо
     неверным словом. Проба только отвечает — какая ячейка и какой мастер;
     номер ячейки сеанса ставит один вход (unlock → enterWorld).
     Мир, найденный в носителе, главнее своей прежней двери: если запись
     замка несёт и носитель, и прежнюю дверь того же мира, дверь убирается
     (finishMove). Переезд, оборванный до записи замка, носителя в ней не
     называет — его доводит moveWorld (носитель, появившийся после пробы). */
  /* ПОСТОЯННАЯ: резерв прежней двери — её вектор (12) и обёртка мастера
     (32 + 16 тега GCM) = 60 байт; место роли j — со смещения 60·j; запасная
     дверь (код v176) главного мира — со смещения 120. Размеры примитивов,
     а не состав. */
  var RES_DOOR = 60, RES_SPARE = 120;
  function gcmAt(key, bytes, off) {
    return window.crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes.slice(off, off + 12) }, key, bytes.slice(off + 12, off + RES_DOOR))
      .then(function (buf) { return new Uint8Array(buf); }, function () { return null; });
  }
  function openWorlds(rec, password, fileBytes) {
    var keys = null, c = null, eff = rec;
    /* Носитель читается и при записи замка прежнего вида (с дверями), если
       он есть (финальный разбор H1, Г10): после обрыва питания сразу за
       переездом или сменой слова на диске может лежать прежняя запись рядом
       с уже записанным носителем, и мир тогда — в носителе: слово ищется в
       его ячейках раньше прежних дверей. Параметры вывода у прежней записи —
       её собственные: носитель рядом с ней может быть и чужим. */
    var known = carrierSize(rec), legacyRec = !known && !!(rec.doors || rec.wrap);
    /* Дверь читает носитель заново и только заново (D-353): память вкладки —
       не свидетель того, что лежит. */
    return (known || legacyRec ? carrierRead() : Promise.resolve(null)).then(function (car) {
      c = car;
      /* Параметры вывода — носителя, если он их несёт (см. paramsOf). */
      eff = known || ownCarrierOf(rec, c) ? withParams(rec, c && c.params) : rec;
      var cost = costOf(eff);
      return factorFor(eff, fileBytes).then(function (fsec) {
        return deriveWordKeys(password, saltOf(eff), cost[0], cost[1], fsec, cost[2]);
      });
    }).then(function (k) {
      keys = k;
      var legacy = rec.doors || rec.wrap ? doorsOf(rec).map(function (d) {
        var wrapped, iv;
        try { wrapped = unb64(d.wrap); iv = unb64(d.wrapIv || d.iv); }
        catch (e) { return Promise.resolve(null); }
        return window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, k.gcm, wrapped)
          .then(function (buf) { return new Uint8Array(buf); }, function () { return null; });
      }) : [];
      var fromCarrier = c ? slotCandidates(c, k.slot, "word").then(function (cands) { return carrierMatch(c, cands); }) : Promise.resolve(null);
      var reserved = [], r, j;
      if (c) for (r = 0; r < CARRIER_REGIONS; r++) for (j = 0; j < 2; j++) reserved.push(gcmAt(k.gcm, regionOf(c, r), RES_DOOR * j));
      return Promise.all([fromCarrier, Promise.all(reserved), Promise.all(legacy)]);
    }).then(function (all) {
      var hitC = all[0], res = all[1], leg = all[2], hitR = null, hitL = null, n;
      for (n = 0; n < res.length; n++) {
        if (!res[n]) continue;
        if (!hitR && !hitC) hitR = { i: Math.floor(n / 2), role: n % 2, m: res[n] }; else res[n].fill(0);
      }
      for (n = 0; n < leg.length; n++) {
        if (!leg[n]) continue;
        if (!hitL) hitL = { i: -1, role: n, m: leg[n] }; else leg[n].fill(0);
      }
      var params = paramsOf(eff), hit = hitC || hitR || hitL;
      if (!hit) return null;
      hit.src = hitC ? "carrier" : (hitR ? "reserved" : "legacy");
      /* gcm — ключ прежних дверей из той же растяжки: им переезд находит мир
         в резерве, если носитель записан уже после пробы (см. moveWorld). */
      hit.slot = keys.slot; hit.gcm = keys.gcm; hit.params = params;
      /* Прежняя дверь при записи замка прежнего вида — как прежде: носитель
         ей не назван (переезд прочтёт его сам и найдёт мир в нём). */
      hit.c = hit.src === "legacy" && !known ? null : c;
      /* прежняя дверь того же мира, пережившая переезд, — к уборке */
      if (hit !== hitL && hitL) { if (hitL.role === hit.role) hit.stale = true; hitL.m.fill(0); }
      /* Мир найден в носителе, а запись замка — прежнего вида (обрыв сразу
         после переезда или смены слова, Г10): её двери старше носителя —
         переезд доводится, как после обрыва первого переезда. */
      if (legacyRec && hit !== hitL) hit.stale = true;
      return hit;
    });
  }
  /* Прежнее имя: слово ищет свой мир (см. openWorlds). */
  function openWorldsAny(rec, password, fileBytes) { return openWorlds(rec, password, fileBytes); }
  /* Прежние двери записи — только для выгрузки первой редакции (v176 и
     раньше): её запись замка везёт двери с собой. Пробуются ВСЕ, всегда. */
  function openDoors(rec, password, fsec) {
    var cost = costOf(rec);
    return deriveKEK(password, saltOf(rec), cost[0], cost[1], fsec, cost[2]).then(function (kek) {
      return Promise.all(doorsOf(rec).map(function (d) {
        var wrapped, iv;
        try { wrapped = unb64(d.wrap); iv = unb64(d.wrapIv || d.iv); }
        catch (e) { return Promise.resolve(null); }
        return window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, kek, wrapped)
          .then(function (buf) { return new Uint8Array(buf); }, function () { return null; });
      }));
    }).then(function (res) {
      var hit = null, i;
      for (i = 0; i < res.length; i++) {
        if (!res[i]) continue;
        if (!hit) hit = { i: i, m: res[i] }; else res[i].fill(0);
      }
      return hit;
    });
  }

  /* ── ОДИН МИР НА СЕАНС (D-349) ─────────────────────────────────────────
     Пока система открыта, слово в окне аккаунта обязано быть словом ЭТОГО
     мира. Слово другого мира — «неверно», тем же ответом и за то же время,
     что и любое чужое: все ячейки и двери считаются всегда. Иначе открытый
     мир можно было подменить посреди сеанса, не закрыв его. Сверяется
     РОЛЬ: ячейка у мира одна, а до переезда он стоит за прежней дверью. */
  function ownDoor(hit) {
    if (!hit) return null;
    if (vaultOpen && hit.role !== vaultRole) { hit.m.fill(0); return null; }
    return hit;
  }
  /* Второе слово обязано открыть ИМЕННО второй мир: опечатка или главное
     слово ещё раз не становятся «вторым миром» и не стирают настоящий. */
  function otherDoor(hit) {
    if (hit && hit.role === 1) return hit;
    if (hit) hit.m.fill(0);
    return null;
  }
  /* Для действий, которые берут слово: открытая система сверяет его с
     миром сеанса и НЕ открывает заново; закрытая — открывается им, как
     прежде. Ответ — РОЛЬ мира сеанса (0 главный, 1 второй) или −1. */
  function enterOrConfirm(password, secondKeyFile) {
    if (!vaultOpen) return window.sbVault.unlock(password, secondKeyFile).then(function (okp) { return okp ? vaultRole : -1; });
    var rec = lockRecord();
    if (!rec) return Promise.resolve(-1);
    return openWorldsAny(rec, password, secondKeyFile).then(ownDoor).then(function (hit) {
      if (!hit) return -1;
      hit.m.fill(0);
      return hit.role;
    });
  }


  /* ── ПУСТЫШКИ — ТОЛЬКО ДЛЯ ОСТАТКА ПРЕЖНИХ КОНВЕРТОВ (D-351) ────────────
     С носителем новых конвертов нет, и подсыпать нечего: размер носителя
     один всегда (прежде число конвертов пряталось ступенями — v99, D-316).
     Пустышка осталась одна роль: заменить собой конверт мира, переехавшего в
     носитель, — тем же ростом, чтобы число прежних конвертов на диске не
     менялось и остаток не говорил, сколько миров переехало. */
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
  /* Служебные имена пустышек прежних замков (v101): в мир не входят. */
  var DECOY_WORD = String.fromCharCode(0) + "sb/decoy/";

  /* ── МЕДЛЕННЫЙ ОБОРОТ — ЯЧЕЙКОЙ (v102 → D-351) ──────────────────────────
     ПОВОД, дословно от основателя: «сделайте шифрование ещё более
     невообразимым. он должен постоянно меняться». Прежде оборот
     переворачивал по четыре конверта; теперь переворачивается ЯЧЕЙКА
     открытого мира целиком: то же содержимое, новая метка тела — другие
     байты от первого до последнего. Два снимка носителя отличаются всегда,
     и по ним не сказать, правили что-то или нет.
     ЧЕГО ОБОРОТ НЕ ДАЁТ, вслух: другая ячейка не переворачивается — ключа
     её мира у открытого нет, а перезаписать её шумом значило бы стереть
     мир в ней. Это и есть остаточная утечка One Door: несколько снимков и
     слово первого мира показывают, открывали ли второй между снимками.
     Охраняется tools/one-door-carrier-check.mjs. */
  /* ПОСТОЯННАЯ: оборот раз в полторы минуты открытого сеанса (v102). */
  var ROLL_EVERY = 90000;
  /* ПОСТОЯННАЯ: кругов сходимости поворота ключа до записи замка (Р-A5.2).
     Круг — печать мебибайта и одна запись носителя; пять кругов — правки,
     дошедшие за пять печатей подряд. Что пишет чаще, то и дальше пишет:
     честнее отказать до записи замка, чем запереть не то. */
  var LOCK_SETTLE_ROUNDS = 5;
  var ROLL_KEY = "\u0000sb/roll";
  var rollTimer = null;
  function ownTiles() {
    var C = window.sbCarrier, out = [], per, i, from;
    if (!C || vaultDoor < 0) return out;
    per = Math.ceil(CARRIER_REGION / C.tileSize());
    from = Math.floor(vaultDoor * CARRIER_REGION / C.tileSize());
    for (i = 0; i < per; i++) out.push("carrier:" + (from + i));
    return out;
  }
  function rollOnce() {
    if (!vaultOpen || !carrierKeys) return Promise.resolve([]);
    carrierChanged.add(ROLL_KEY);
    return carrierFlushNow().then(function () {
      var names = ownTiles();
      if (names.length && window.sbBus && window.sbBus.emit) {
        window.sbBus.emit("vault:roll", { names: names.slice(), turned: names.length, total: window.sbCarrier.tiles() });
      }
      return names;
    });
  }
  function rollKeep() {
    if (rollTimer) clearInterval(rollTimer);
    rollTimer = setInterval(function () {
      if (!vaultOpen || !carrierKeys) { clearInterval(rollTimer); rollTimer = null; return; }
      rollOnce();
    }, ROLL_EVERY);
  }
  /* Наружу — чтобы окно ПОКАЗЫВАЛО оборот настоящими числами (D-214). */
  window.sbVaultRoll = function () {
    return rollOnce().then(function (done) {
      return { turned: done.length, names: done.slice(), total: window.sbCarrier ? window.sbCarrier.tiles() : 0 };
    });
  };

  /* ── ПЕРЕПИСЬ ДИСКА (D-214 → D-351) ───────────────────────────────────
     Что лежит: носитель, его размер и плитки; своя ячейка открытого мира —
     не тайна от хозяина. Про другую ячейку перепись не говорит ничего, кроме
     её размера: есть ли в ней мир, отсюда не видно — и это правда. */
  window.sbVaultCensus = function () {
    var C = window.sbCarrier;
    var total = C ? C.tiles() : 0;
    var own = ownTiles().length;
    return { total: total, own: own, other: Math.max(0, total - own), size: C ? C.size() : 0,
             tile: C ? C.tileSize() : 0, regions: CARRIER_REGIONS, legacy: sealedNamesNow().length,
             at: own, every: ROLL_EVERY };
  };

  /* ── ПОВЕРНУТЬ КЛЮЧ: НОСИТЕЛЬ, ЗАТЕМ ЗАПИСЬ ЗАМКА (D-351) ────────────────
     pairs — функция: открытые записи снимаются ПОСЛЕ растяжки, чтобы в ячейку
     легло и то, что система записала, пока считался ключ. Порядок выбран
     так, чтобы обрыв питания в любой точке не стоил ни одной записи: сперва
     носитель, затем запись замка, и лишь потом стираются открытые копии.
     В записи замка нет дверей и нет запасной двери: её форма одна и та же
     со вторым словом и без. */
  function buildLock(password, pairs, keepMaster, duressPassword, factorFile) {
    var salt = new Uint8Array(32);
    var master = keepMaster ? new Uint8Array(keepMaster) : new Uint8Array(32);
    window.crypto.getRandomValues(salt);
    if (!keepMaster) window.crypto.getRandomValues(master);
    var saltB64 = b64(salt);
    var fsalt = new Uint8Array(32);
    window.crypto.getRandomValues(fsalt);
    var fsaltB64 = b64(fsalt);
    var factorRec = factorFile ? { kind: "file", salt: fsaltB64 } : null;
    var dm = null, rows = null;
    var scrub = function () { master.fill(0); if (dm) dm.fill(0); };
    return (factorFile ? factorSecret(factorFile, fsaltB64) : Promise.resolve(null)).then(function (fsec) {
      return calibrateCost().then(function (cost) {
        var a2 = cost.a2;
        /* Растяжки — по очереди: у каждой своя память Argon2id, и две разом
           удвоили бы её на слабом телефоне. */
        return deriveWordKeys(password, saltB64, cost.it1, cost.it2, fsec, a2).then(function (k0) {
          return (duressPassword ? deriveWordKeys(duressPassword, saltB64, cost.it1, cost.it2, fsec, a2) : Promise.resolve(null))
            .then(function (k1) { return [k0, k1]; });
        }).then(function (wk) {
          /* Сбор — после растяжки (разбор №5): тишина соседей при повороте
             ключа объявляется перед самым сбором, и упавшая растяжка никого
             не замораживает; записи соседей за время растяжки — в сборе. */
          return Promise.resolve(typeof pairs === "function" ? pairs() : pairs).then(function (got) { rows = got; return wk; });
        }).then(function (wk) {
          if (duressPassword) { dm = new Uint8Array(32); window.crypto.getRandomValues(dm); }
          /* След стука заводится вместе с замком (D-341). */
          var kc0 = new Uint8Array(master), kc1 = dm ? new Uint8Array(dm) : null;
          var knockMade = makeKnock(kc0, kc1).then(function (k) { kc0.fill(0); if (kc1) kc1.fill(0); return k; },
            function () { kc0.fill(0); if (kc1) kc1.fill(0); return null; });
          var kv0 = new Map();
          rows.forEach(function (p) { if (p.v != null) kv0.set(p.k, p.v); });
          var c = carrierNew();
          /* Главный мир — в СЛУЧАЙНУЮ ячейку, второй — в другую (D-351): номер
             ячейки не говорит, какой мир в ней. */
          var cell = randBytes(1)[0] & 1;
          var world0 = sealRegion(master, wk[0].slot, null, kv0, 0, 0);
          var world1 = dm ? sealRegion(dm, wk[1].slot, null, new Map(), 1, 0) : Promise.resolve(null);
          /* От чего считается поворот ключа (D-353): носитель, который лежит
             сейчас (или его нет), — запись сверится с ним в той же транзакции. */
          return Promise.all([world0, world1, knockMade, carrierRead()]).then(function (made) {
            c.bytes.set(made[0].region, cell * CARRIER_REGION); c.seal[cell] = made[0].seal;
            if (made[1]) { c.bytes.set(made[1].region, (1 - cell) * CARRIER_REGION); c.seal[1 - cell] = made[1].seal; }
            knockInCells(made[2], cell);
            c.params = { salt: saltB64, kdf: ["PBKDF2-SHA512:" + cost.it1, "PBKDF2-SHA256:" + cost.it2].concat(a2 ? [a2Label(a2)] : []) };
            if (factorRec) c.params.factor = factorRec;
            /* Журнал стуков — в самом носителе (D-353), рядом с ячейками: его
               пишет неизвестное слово, и запись замка он больше не трогает. */
            if (made[2] && Array.isArray(made[2].slots)) c.knock = made[2].slots.slice();
            var seen = made[3], all = [], ri;
            for (ri = 0; ri < CARRIER_REGIONS; ri++) all.push(ri);
            return carrierCommit(seen, all, function (next) {
              /* Запись замка, которой эта вкладка не знает, появилась (чужой
                 поворот ключа) или сменилась — отказ, а не запертое поверх
                 запертого (разбор №3; без Web Locks — единственная стража). */
              if (lockLost()) throw new Error("already");
              next.bytes.set(c.bytes, 0);
              next.seal = c.seal.map(function (x) { return new Uint8Array(x); });
              next.params = c.params;
              if (c.knock) next.knock = c.knock; else delete next.knock;
              /* Новый носитель метку стоящего замка получает, только когда
                 ляжет его запись замка (lockMark, Г8); отпечатки прежних
                 запасных дверей прежнего замка ему ни к чему. */
              delete next.mark;
              delete next.spent;
            }, function (store) {
              /* Переход прежнего снятия (его открытые записи) уходит той же
                 транзакцией, что кладёт новый замок: под замком открытого на
                 диске нет (D-265), а до замка переход — запасная копия мира
                 на случай, если открытые записи снятия не успели на диск. */
              store["delete"](REMOVAL_ID);
            }).then(function (written0) {
              /* СХОДИМОСТЬ ДО ЗАПИСИ ЗАМКА (Р-A5.2, класс A). Пока печаталась
                 ячейка, система жила: правки этой вкладки и вкладки, открытой
                 посреди поворота (Г9-3), лежат на диске открытыми. Запись
                 замка ложится, только когда то, что лежит, — ровно то, что в
                 ячейке: иначе ячейка печатается заново (сравнением и заменой
                 от только что записанного носителя), и сверка повторяется.
                 Сверка и запись замка — один синхронный шаг. Прежде эти
                 правки дописывались ПОСЛЕ записи замка: упала дозапись —
                 замок стоял, правки пропадали, а окно говорило «ничего не
                 изменено»; обрыв между записью замка и дозаписью терял их
                 так же. Не сошлось за LOCK_SETTLE_ROUNDS кругов (что-то пишет
                 без конца) — отказ до записи замка: замка нет, всё лежит,
                 как лежало. */
              var sealedNow = made[0];
              var settleThen = function (written, kvNow, n) {
                var drift = typeof pairs === "function" && typeof pairs.drift === "function" ? pairs.drift(kvNow) : null;
                if (!drift) return layLock(written, sealedNow);
                if (n >= LOCK_SETTLE_ROUNDS) throw new Error("moving");
                return sealRegion(master, wk[0].slot, null, drift, 0, 0).then(function (s) {
                  sealedNow = s;
                  var puts = {}; puts[cell] = s;
                  return carrierPut(written, puts, null, null, function () { if (lockLost()) throw new Error("already"); });
                }).then(function (w2) { return settleThen(w2, drift, n + 1); });
              };
              var layLock = function (written, sealed) {
                var body = {
                  v: factorRec ? 4 : 3,
                  kdf: ["PBKDF2-SHA512:" + cost.it1, "PBKDF2-SHA256:" + cost.it2].concat(a2 ? [a2Label(a2)] : []),
                  ciphers: ["AES-256-CTR", "AES-256-CTR"],
                  mac: "HMAC-SHA-512",
                  /* Носитель (D-351): его размер — не тайна, он у всех один. */
                  carrier5: CARRIER_REGIONS * CARRIER_REGION,
                  salt: saltB64
                };
                if (made[2]) body.knock = { pub: made[2].pub, wrap: made[2].wrap };
                if (factorRec) body.factor = factorRec;
                var bodyText = JSON.stringify(body);
                lsSet(LOCK_KEY, bodyText);
                /* Легла именно своя запись — иначе это чужой замок, и вкладка
                   его не усыновляет. */
                if (lsGet(LOCK_KEY) !== bodyText) throw new Error("already");
                noteOwnLock();
                /* С этой строки замок стоит: что бы ни упало дальше, «ничего не
                   изменено» уже неправда (см. lock, keepOpen). */
                if (typeof pairs === "function" && typeof pairs.laid === "function") pairs.laid();
                /* Поздние щели обеих ячеек — шум с самого начала, своими записями. */
                lsSet(lateKey(0), lateNoise()); lsSet(lateKey(1), lateNoise());
                lateKnown = { cell: cell, v: lateRead(cell) };
                /* Открытые записи уходят с диска в том же шаге, что легла запись
                   замка. Поворот ключа сверяет их с тем, что лежало при сборе
                   (Г9-3, см. lock); переезд v1 стирает свои конверты по имени. */
                if (typeof pairs === "function" && typeof pairs.lay === "function") pairs.lay();
                else rows.forEach(function (p) { rawStore.del.call(window.localStorage, p.k); });
                /* Запись замка легла — метка стоящего замка рядом с носителем
                   (Г8, см. crashHeal). Не легла метка — замок стоит и так, но
                   обрыв питания в ближайшие секунды тогда не лечится (граница
                   названа в D-353). */
                return lockMark(body.knock, written).then(function () { return subkeys(master); }).then(function (ks) {
                  carrierKeys = sealed.keys;
                  carrierWordSlot = wk[0].slot;
                  vaultDoor = cell;
                  vaultRole = 0;
                  ownFrom(written, cell);
                  sessionG = 0;
                  carrierStale = null;
                  return holdMaster(master).then(function () { if (dm) dm.fill(0); return ks; });
                });
              };
              return settleThen(written0, kv0, 0);
            });
          });
        });
      });
    }).then(null, function (e) { scrub(); throw e; });
  }

  /* ═══════ СВЕЖЕЕ ПОДТВЕРЖДЕНИЕ ПЕРЕД ОПАСНЫМ · решение D-308 (план Н8) ═══════
     Разбор «Шифр без театра», Н8: открытый телефон, минута без присмотра — и
     уносилась выгрузка и все пароли «Ключей». Теперь выгрузка при замке, показ
     и копирование пароля идут только после свежего подтверждения: слово этого
     мира или ключ устройства. Свежим подтверждение остаётся PRESENCE_MS.
     КАК ПРОВЕРЯЕТСЯ СЛОВО. Не новой растяжкой (это секунды на каждое нажатие),
     а по отпечатку, который живёт только в памяти этого сеанса: при открытии
     замка слово подписывается ключом HMAC, который браузер не отдаёт скрипту
     (extractable=false). На диске от него нет ничего; закрыл замок или страницу —
     отпечатка нет. Это слово ТОГО мира, который открыт: в тревожном мире
     подтверждает тревожное слово, главное — нет.
     ЧЕГО ЭТО НЕ ДАЁТ, вслух: от вредного кода внутри открытой страницы
     подтверждение не спасает — он видит то же, что человек. Оно закрывает
     одно: чужие руки на оставленном открытым устройстве.
     Охраняется tools/fresh-presence-check.mjs. */
  /* ПОСТОЯННАЯ: две минуты — столько живёт подтверждение, чтобы показать и
     скопировать пароль одним заходом, но не дольше, чем человек отходит от
     стола. */
  var PRESENCE_MS = 120000;
  var presentAt = 0;
  var wordCheck = null;          /* { key: HMAC неизвлекаемый, mac } — только память сеанса */
  function wordMac(key, word) {
    return window.crypto.subtle.sign("HMAC", key, new TextEncoder().encode(String(word || ""))).then(function (m) { return new Uint8Array(m); });
  }
  function rememberWord(word) {
    return window.crypto.subtle.generateKey({ name: "HMAC", hash: "SHA-256" }, false, ["sign"]).then(function (k) {
      return wordMac(k, word).then(function (mac) { wordCheck = { key: k, mac: mac }; });
    })["catch"](function () { wordCheck = null; });
  }
  function sameBytes(a, b) {
    if (!a || !b || a.length !== b.length) return false;
    var d = 0, i;
    for (i = 0; i < a.length; i++) d |= a[i] ^ b[i];
    return d === 0;
  }
  function presenceFresh() {
    if (!vaultLocked()) return true;
    return !!vaultOpen && presentAt > 0 && (Date.now() - presentAt) < PRESENCE_MS;
  }
  /* ── ДВЕРЬ ПОДТВЕРЖДЕНИЯ НЕ ПЕРЕБИРАЕТСЯ · решение D-350 ─────────────────
     Слово здесь сверяется отпечатком — мгновенно, без растяжки двери. Прежде
     на любое число неверных слов она отвечала сразу и молча: открытая система,
     оставленная без присмотра, давала перебирать слово без цены и без следа.
     Теперь промахи платят сами. Первый отвечается сразу — это опечатка; каждый
     следующий подряд — дольше. Каждый оставляет стук (sbKnock.note, D-341), и
     стук пишется ДО ответа. Пятый подряд закрывает сеанс: перезагрузка к
     двери, где каждая попытка стоит полной растяжки. Верное слово обнуляет
     счёт. Попытки идут по одной: следующая ждёт ответа предыдущей, иначе
     паузу обходили бы вызовами разом.
     ЧЕГО ЭТО НЕ ДАЁТ, вслух: от вредного кода внутри открытой страницы это не
     спасает — он видит то же, что человек. Закрывает одно: чужие руки у
     оставленного открытым устройства.
     Охраняется tools/irreversible-word-check.mjs. */
  /* ПОСТОЯННАЯ: пауза перед ответом на первый…четвёртый промах подряд —
     первый сразу (опечатка), дальше вдвое; вместе около семи секунд: перебор
     становится виден и долог, а человек, дважды ошибившийся, не ждёт минуту. */
  var PRESENCE_MISS_WAIT = [0, 1000, 2000, 4000];
  /* ПОСТОЯННАЯ: пятый промах подряд закрывает сеанс — на один больше пауз,
     чтобы последняя пауза была последней, а не очередной. */
  var PRESENCE_MISS_SHUT = 5;
  var presenceMisses = 0, presenceQueue = Promise.resolve(), presenceShut = false;
  /* ПОСТОЯННАЯ: секунда с небольшим — прочесть, почему сеанс закрывается;
     слово за это время уже не принимается (presenceShut). */
  var PRESENCE_SHUT_SAY_MS = 1200;
  function presenceCloseSession() {
    presenceShut = true;
    if (window.sbDB && window.sbDB.flushSync) { try { window.sbDB.flushSync(); } catch (e) { /* закрываемся всё равно */ } }
    setTimeout(function () { window.location.reload(); }, PRESENCE_SHUT_SAY_MS);
  }
  function presenceMiss() {
    presenceMisses++;
    var n = presenceMisses;
    var knocked = window.sbKnock ? window.sbKnock.note().then(null, function () { return false; }) : Promise.resolve(false);
    return knocked.then(function () {
      if (n >= PRESENCE_MISS_SHUT) { presenceCloseSession(); return false; }
      var wait = PRESENCE_MISS_WAIT[Math.min(n, PRESENCE_MISS_WAIT.length) - 1] || 0;
      return new Promise(function (r) { setTimeout(function () { r(false); }, wait); });
    });
  }
  function presenceByWord(word) {
    if (!vaultLocked()) return Promise.resolve(true);
    var turn = presenceQueue.then(function () {
      if (presenceShut || !vaultOpen || !wordCheck) return false;
      var wc = wordCheck;
      return wordMac(wc.key, word).then(function (mac) {
        var okp = sameBytes(mac, wc.mac);
        if (!okp) return presenceMiss();
        presenceMisses = 0;
        presentAt = Date.now();
        return true;
      }, function () { return false; });
    });
    presenceQueue = turn.then(null, function () { return false; });
    return turn;
  }
  function presenceByDevice() {
    var rec = lockRecord();
    if (!vaultOpen || !hwOf(rec) || !hwSecret) return Promise.resolve(false);
    var before = new Uint8Array(hwSecret);
    return hwAsk(rec).then(function (answered) {
      var okp = !!answered && sameBytes(before, hwSecret);
      if (!okp) hwSecret = before;          /* чужой ответ не заменяет свой */
      if (okp) presentAt = Date.now();
      return okp;
    });
  }

  /* ═══════ ВЫГРУЗКА ПРИ ЗАМКЕ — ЗАПЕЧАТАННАЯ · решение D-307 (план Н1) ═══════
     Разбор «Шифр без театра», Н1: копии в папку были запечатаны, а ручная
     выгрузка при стоящем замке писала открытый JSON. Тот, кто получил файл,
     читал всё, и двух дверей для него не существовало.
     Теперь при замке выгрузка — конверт: внутри то, из чего выводится ключ
     мира (первая редакция, до v177, везла запись замка целиком — с
     завёрнутым мастер-ключом за каждой дверью и запасной дверью кода;
     вторая — см. ниже), и сам профиль, запечатанный ключами открытого мира. Открывается на ЛЮБОМ
     устройстве словом этого мира или кодом восстановления (sbVault.openExport)
     — ровно той же растяжкой, что замок. Лёгкой двери рядом с тяжёлой нет.
     В имени файла нет имени человека.
     ЧЕГО ЭТО НЕ ДАЁТ, вслух: выгрузка главного мира под тревожным словом не
     откроется — это различитель миров, пока не построен общий слой (план T,
     пункт 3); у тревожного слова об этом сказано.
     Без замка выгрузка по-прежнему открыта: запечатывать её нечем, и это
     сказано в ответе системы, а не спрятано.
     Охраняется tools/sealed-export-check.mjs. */
  /* ── ВЫГРУЗКА ВТОРОЙ РЕДАКЦИИ (D-351) ─────────────────────────────────
     Везёт то, из чего на ЛЮБОМ устройстве выводится ключ этого мира: соль,
     цену и признаки факторов из записи замка — и голову СВОЕЙ ячейки (метка,
     щель слова, щель кода). Второй ячейки, дверей и следа стука в выгрузке
     нет: выгрузка одного мира не говорит о другом ничего. */
  function exportText(profileId) {
    var plain = JSON.stringify(buildExport(profileId), null, 2);
    if (!vaultLocked()) return Promise.resolve({ text: plain, sealed: false });
    if (!vaultOpen || !vaultKeys) return Promise.reject(new Error("closed"));
    var rec = lockRecord() || {};
    var lock = { v: rec.v, kdf: rec.kdf, salt: saltOf(rec) };
    if (rec.factor) lock.factor = rec.factor;
    if (rec.hw) lock.hw = rec.hw;
    return carrierRead().then(function (c) { return c || carrierMem; }).then(function (c) {
      if (!c || vaultDoor < 0) throw new Error("closed");
      var head = regionOf(c, vaultDoor).subarray(0, CR_NS + CR_EW + CR_EC);
      return sealPair(vaultKeys, "export", plain, "export").then(function (body) {
        return {
          sealed: true,
          text: JSON.stringify({ app: "sysbaby-os", kind: "sealed-export", version: 2, createdAt: new Date().toISOString(), lock: lock, head: b64(head), body: body })
        };
      });
    });
  }
  function spareMaster(rec, code) {
    var sp = rec && rec.spare;
    if (!sp) return Promise.resolve(null);
    var sk = costOf({ kdf: sp.kdf });
    return deriveKEK(spareSecret(spareNorm(code)), saltOf(rec), sk[0], sk[1], null).then(function (kek) {
      var wrapped, iv;
      try { wrapped = unb64(sp.wrap); iv = unb64(sp.wrapIv); } catch (e) { return null; }
      return window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, kek, wrapped)
        .then(function (buf) { return new Uint8Array(buf); }, function () { return null; });
    });
  }
  /* Открыть запечатанную выгрузку. secret — слово, либо { code } — код
     восстановления. opts.file — байты второго ключа, opts.device — спросить
     ключ устройства той записи. Состояние открытого сеанса не меняется. */
  function openExport(input, secret, opts) {
    opts = opts || {};
    var obj = input;
    if (typeof input === "string") { try { obj = JSON.parse(input); } catch (e) { return Promise.resolve(null); } }
    if (!obj || obj.kind !== "sealed-export" || !obj.lock || !obj.body) return Promise.resolve(null);
    var rec = obj.lock;
    var savedHw = hwSecret;
    var restore = function (v) { hwSecret = savedHw; return v; };
    var viaCode = !!(secret && typeof secret === "object" && secret.code);
    var ask = (!viaCode && hwOf(rec) && opts.device) ? hwAsk(rec) : Promise.resolve(true);
    /* Вторая редакция (D-351): мастер — из щели головы; первая — из двери. */
    var head = null;
    if (obj.head) { try { head = unb64(obj.head); } catch (e) { head = null; } if (!head || head.length !== CR_NS + CR_EW + CR_EC) return Promise.resolve(null); }
    var fromHead = function (slotKey, which) {
      var off = which === "code" ? CR_NS + CR_EW : CR_NS;
      return slotStream(slotKey, head.subarray(0, CR_NS)).then(function (ks) { var m = xorInto(head.subarray(off, off + CR_EW), ks); ks.fill(0); return m; });
    };
    return ask.then(function () {
      if (head) {
        if (viaCode) return codeSlotKey(secret.code, saltOf(rec)).then(function (k) { return fromHead(k, "code"); });
        var cost = costOf(rec);
        return factorFor(rec, opts.file || null).then(function (fsec) {
          return deriveWordKeys(String(secret || ""), saltOf(rec), cost[0], cost[1], fsec, cost[2]);
        }).then(function (k) { return fromHead(k.slot, "word"); });
      }
      if (viaCode) return spareMaster(rec, secret.code);
      return factorFor(rec, opts.file || null).then(function (fsec) { return openDoors(rec, String(secret || ""), fsec); })
        .then(function (hit) { return hit ? hit.m : null; });
    }).then(function (m) {
      restore();
      if (!m) return null;
      return subkeys(m).then(function (ks) {
        m.fill(0);
        return openPair(ks, obj.body, "export").then(function (p) { return p.value; }, function () { return null; });
      });
    }, function () { restore(); return null; });
  }

  /* ═══════ ФРАЗА ИЗ ШЕСТИ СЛОВ · решение D-309 (план Н6) ═══════
     Слова — из общего списка window.SB_WORDS (core/words.js). Выбор каждого
     слова — crypto.getRandomValues с отбраковкой: без перекоса к началу
     списка. Сила фразы считается из длины списка, а не пишется числом. */
  function phraseWords(n) {
    var list = window.SB_WORDS || [];
    var out = [], L = list.length, lim, buf = new Uint32Array(1), i;
    if (L < 2) return [];
    lim = Math.floor(0x100000000 / L) * L;
    for (i = 0; i < (n || 6); i++) {
      do { window.crypto.getRandomValues(buf); } while (buf[0] >= lim);
      out.push(list[buf[0] % L]);
    }
    return out;
  }
  function phraseBits(n) {
    var L = (window.SB_WORDS || []).length;
    return L > 1 ? Math.floor((n || 6) * Math.log(L) / Math.LN2) : 0;
  }
  /* ПОСТОЯННАЯ: двенадцать знаков — порог, ниже которого слово без ключа
     устройства принимается только после честного предупреждения (разбор
     «Шифр без театра», инвариант I14: 12 случайных знаков — уже десятки бит). */
  var WEAK_BELOW = 12;
  function wordIsWeak(word) {
    if (hwOf(lockRecord())) return false;
    return String(word || "").length < WEAK_BELOW;
  }

  /* ═══════ ВХОД В МИР И ПЕРЕЕЗД В НОСИТЕЛЬ · D-351 ═══════════════════════
     Мир, найденный в носителе, читается из своей ячейки. Мир, найденный за
     прежней дверью или в резерве, ПЕРЕЕЗЖАЕТ: его конверты открываются,
     записи ложатся в ячейку (первый переезд замка — в случайную, из резерва —
     в ту же), и лишь после того, как носитель записан, запись замка теряет
     двери, а свои конверты становятся пустышками того же роста (число
     конвертов на диске не меняется: остаток не говорит, сколько миров
     переехало). Чужие конверты не трогаются — под ними может лежать второй
     мир, который ещё не открывали; его прежняя дверь ждёт в резерве (см.
     moveWorld). Мастер мира тот же: пароли «Ключей», вещи Хранилища и код
     восстановления остаются в силе.
     ГРАНИЦА, вслух: остаток прежних конвертов (и прежняя запасная дверь, пока
     не заведён новый код) говорит, что замок был до переезда, — и снимок,
     сделанный до переезда, видел двери. Полная неопределённость — только у
     устройств, начавших с носителя. */
  function kvFromObject(obj) {
    var m = new Map(), k;
    for (k in obj) if (Object.prototype.hasOwnProperty.call(obj, k)) m.set(k, String(obj[k]));
    return m;
  }
  /* Записи мира из прежних конвертов: открываются только свои. */
  function legacyWorld(ks) {
    var names = sealedNamesNow();
    return Promise.all(names.map(function (phys) {
      var raw = rawStore.get.call(window.localStorage, phys);
      if (raw == null) return Promise.resolve(null);
      return openPair(ks, raw, phys).then(function (p) { return { phys: phys, k: p.name, v: p.value }; }, function () { return null; });
    })).then(function (rows) {
      var kv = new Map(), own = [];
      rows.forEach(function (r) {
        if (!r) return;
        /* служебные имена пустышек в мир не входят */
        if (String(r.k).indexOf(DECOY_WORD) === 0) return;
        kv.set(r.k, r.v); own.push(r.phys);
      });
      return { kv: kv, own: own };
    });
  }

  /* ── ПАРАМЕТРЫ ВЫВОДА ЛЕЖАТ В САМОМ НОСИТЕЛЕ (D-351) ─────────────────────
     Соль, цена и признаки второго ключа и ключа устройства — то, из чего
     выводится ключ щели, — записываются В ТУ ЖЕ запись носителя, что и
     щели. Запись замка в localStorage держит их копию для входа до двери;
     разойдутся (оборвалось питание между двумя записями) — прав носитель,
     и копия чинится при входе. Так смена второго ключа или цены не
     оставляет на диске никакой промежуточной пометки. */
  function paramsOf(rec) {
    var p = { salt: saltOf(rec), kdf: (rec && rec.kdf) || [] };
    if (rec && rec.factor) p.factor = rec.factor;
    if (rec && rec.hw) p.hw = rec.hw;
    return p;
  }
  function withParams(rec, p) {
    if (!p) return rec;
    var o = {}, k;
    for (k in rec) if (Object.prototype.hasOwnProperty.call(rec, k)) o[k] = rec[k];
    o.salt = p.salt || o.salt; o.kdf = p.kdf || o.kdf;
    if (p.factor) o.factor = p.factor; else delete o.factor;
    if (p.hw) o.hw = p.hw; else delete o.hw;
    o.v = o.hw ? 5 : (o.factor ? 4 : 3);
    return o;
  }
  function sameParams(a, b) { return JSON.stringify(a) === JSON.stringify(b); }
  /* Копия в записи замка — по носителю. */
  function mirrorParams(p) {
    var rec = lockRecord();
    if (!rec || !p) return;
    var next = withParams(rec, p);
    if (!sameParams(paramsOf(rec), paramsOf(next))) lsSet(LOCK_KEY, JSON.stringify(next));
  }

  /* ── СЕАНС ОТКРЫТОГО МИРА: ключ щели слова и ключ щели кода (D-351) ──────
     Чтобы при КАЖДОЙ записи пересобрать обе щели, открытому миру нужны оба
     ключа. Ключ щели слова — из растяжки у двери, неизвлекаемый. Ключ щели
     кода лежит в теле ячейки байтами; в сеансе они держатся запечатанными
     неизвлекаемым ключом сеанса и распечатываются на один шаг (как мастер,
     D-300). */
  var carrierWordSlot = null;
  var codeBox = null;
  function holdCode(bits) {
    codeBox = null;
    if (!bits) return Promise.resolve();
    var iv = randBytes(12);
    return window.crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]).then(function (k) {
      return window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, k, bits).then(function (box) {
        codeBox = { key: k, iv: iv, box: box };
        bits.fill(0);
      });
    });
  }
  function withCode(fn) {
    if (!codeBox) return Promise.resolve().then(function () { return fn(null); });
    var cb = codeBox;
    return window.crypto.subtle.decrypt({ name: "AES-GCM", iv: cb.iv }, cb.key, cb.box).then(function (buf) {
      var bits = new Uint8Array(buf);
      return codeFromBits(bits).then(function (code) {
        bits.fill(0);
        return Promise.resolve().then(function () { return fn(code); })
          .then(function (r) { code.bits.fill(0); return r; }, function (e) { code.bits.fill(0); throw e; });
      });
    });
  }

  /* Своя ячейка из свежего носителя: печать сверяется мастером под СВОЕЙ
     ролью, тело открывается. Не своя — «not-mine». Байты ключа щели кода
     из тела — та же тайна, что мастер (ими открывается мир), и без просьбы
     (wantCode) обнуляются сразу (D-300). */
  /* Ответ несёт и сам прочитанный носитель (w.c): от него считается запись,
     и с ним она сверяется в одной двери записи (D-353). Носителя на диске
     нет — отказ: память сеанса не заменяет прочитанного. */
  function readOwn(r, m, role, wantCode) {
    return carrierRead().then(function (c) {
      if (!c) throw new Error("carrier");
      return regionKeys(m, role).then(function (keys) {
        var reg = regionOf(c, r);
        return window.crypto.subtle.verify("HMAC", keys.mac, c.seal[r], reg).then(function (mine) {
          if (!mine) throw new Error("not-mine");
          return openRegion(keys, reg).then(function (w) {
            if (!wantCode && w.code) { w.code.fill(0); w.code = null; }
            w.c = c;
            return w;
          });
        });
      });
    });
  }
  /* Прежние свои конверты — в пустышки того же роста (число конвертов на
     диске не меняется: остаток не говорит, сколько миров переехало). */
  function legacyTidy(own) {
    var sizes = envelopeBodySizes();
    (own || []).forEach(function (phys) {
      if (rawStore.get.call(window.localStorage, phys) == null) return;
      try { rawStore.set.call(window.localStorage, phys, makeDecoy(sizes).env); } catch (e) { /* место не далось — остаётся как было */ }
    });
  }
  /* ── ЗАПИСЬ ЗАМКА ПОСЛЕ ПЕРВОГО ПЕРЕЕЗДА — ТОЙ ЖЕ ФОРМЫ, ЧТО У НОВОГО ────
     Двери уехали в носитель (своя — ячейкой, чужая — резервом), служебные
     поля конвертов прежней редакции не нужны никому. Остаётся ровно то, что
     пишет buildLock, в том же порядке. Запасная дверь (код v176) остаётся,
     пока человек не заведёт новый код или не войдёт кодом: её открывает
     только сам код, и снять её молча значило бы отнять код. */
  function carriedRecord(rec, params) {
    var body = {
      v: params.hw ? 5 : (params.factor ? 4 : 3),
      kdf: params.kdf,
      ciphers: ["AES-256-CTR", "AES-256-CTR"],
      mac: "HMAC-SHA-512",
      carrier5: CARRIER_REGIONS * CARRIER_REGION,
      salt: params.salt
    };
    if (rec.knock) body.knock = rec.knock;
    if (params.factor) body.factor = params.factor;
    if (params.hw) body.hw = params.hw;
    if (rec.spare) body.spare = rec.spare;
    return body;
  }
  /* ── ОБРЫВ ПИТАНИЯ СРАЗУ ПОСЛЕ ЗАМКА (классификация границ, Г8) ────────
     Носитель пишется строго (durability strict), а запись замка, щели и
     удаление открытых записей — в localStorage, который браузер кладёт на
     диск позже. Обрыв в этом окне оставлял носитель без записи замка и
     открытые записи до замка: загрузка открывала систему БЕЗ слова — старое
     состояние побеждало новое, а записанное после замка жило только в
     носителе.
     МЕТКА СТОЯЩЕГО ЗАМКА. Поворот ключа кладёт её в сам носитель (поле mark
     записи «one») второй строгой записью, когда запись замка уже легла, — с
     этого мига замок для человека стоит. Запись замка не легла (нет места) — метки нет, и
     носитель неудачного поворота ничего не запирает: правки после неудачи
     новее его. Снятие и «Удалить все» уносят метку вместе с носителем; новый
     поворот ключа пишет носитель без неё. Замки сборок до H1 метки не несут, и
     их носитель без записи замка по-прежнему ничего не открывает (D-351).
     ЛЕЧЕНИЕ — до двери, только под правом писателя (A1: без доказанной
     исключительности — ни одной записи) и после сверки заново:
       · записи замка нет, перехода снятия нет, носитель с меткой есть —
         запись замка восстанавливается из параметров носителя (они в нём,
         D-351), щели заводятся, открытые записи до замка стираются (их
         содержимое — в носителе); страница поднимается заново запертой;
       · обрыв на шаг позже: запись замка есть, щелей нет, а открытые записи
         лежат — щели заводятся, открытые записи стираются.
     Хоть одно условие не так — ничего не пишется. */
  function lockMark(knock, base) {
    /* Сравнением и заменой от только что записанного носителя (D-353): его
       ячейки не меняются, меняется одно поле. След стука (pub, wrap) лежит
       только в записи замка (D-341): метка несёт его копию, чтобы
       восстановленная запись замка не теряла стук. Тайны в нём нет — запись
       замка лежит открыто. */
    return carrierCommit(base, [], function (next) {
      next.mark = knock && knock.pub && knock.wrap ? { knock: { pub: knock.pub, wrap: knock.wrap } } : { v: 1 };
    }).then(function () { return true; }, function () { return false; });
  }
  function crashRead() {
    return idb().then(function (db) {
      if (!db) return null;
      return new Promise(function (resolve) {
        var tx, st, one, rm;
        try { tx = db.transaction(CARRIER_STORE, "readonly"); st = tx.objectStore(CARRIER_STORE); one = st.get(CARRIER_ID); rm = st.get(REMOVAL_ID); } catch (e) { resolve(null); return; }
        tx.oncomplete = function () { var c = carrierNorm(one.result); resolve({ c: c, rm: rm.result || null, mark: c && c.mark ? c.mark : null }); };
        tx.onabort = function () { resolve(null); };
      });
    }).then(null, function () { return null; });
  }
  function crashKind(r) {
    if (!r || !r.c || !r.mark || r.rm || r.c.removing || !r.c.params || !r.c.params.salt) return null;
    var rec = lockRecord();
    if (!rec) return "orphan";
    if (rec.v === 1 || rec.doors || rec.wrap || !carrierSize(rec)) return null;
    if (!lsGet(lateKey(0)) && !lsGet(lateKey(1)) && protectedKeysNow().length) return "leftover";
    return null;
  }
  /* Лечить есть что, а права нет (его держит живая вкладка — она и лечит)
     или лечение не легло: вкладка не поднимается открытой поверх обрыва —
     иначе её правки легли бы открытыми и следующее лечение стёрло бы их
     (разбор A2–A4, п. 1). Она замирает — «изменено в другой вкладке»,
     выход «Перечитать» — и не пишет ничего (CONFLICT → REJECT → NO WRITE →
     FREEZE). */
  function crashHold() {
    if (!carrierStale) { carrierStale = "records"; writerDrop(); staleSay("records"); }
    return "frozen";
  }
  function crashHeal() {
    if (!LOCKS || carrierStale || vaultOpen || window.sbVanishing) return Promise.resolve(false);
    return crashRead().then(function (r) {
      var kind = crashKind(r);
      if (!kind) return false;
      return lockTry(WRITER_LOCK).then(function (h) {
        if (!h) return crashHold();
        var free = function () { try { h.release(); } catch (e) { /* ignore */ } };
        return new Promise(function (res) { setTimeout(res, HEAL_SETTLE_MS); }).then(crashRead).then(function (r2) {
          if (carrierStale || vaultOpen || window.sbVanishing) return false;
          /* Лечить было что, а второе чтение не удалось — закрыто, не открыто. */
          if (!r2) { crashHold(); return "frozen-room"; }
          /* Запись замка появилась не этой вкладкой (её поставила или
             восстановила другая) — замереть, как при любом чужом замке. */
          if (lostNow()) return "frozen";
          if (crashKind(r2) !== kind) return false;
          if (kind === "orphan") {
            var mk = r2.mark && r2.mark.knock ? { knock: r2.mark.knock } : {};
            var text = JSON.stringify(carriedRecord(mk, paramsOf(withParams({}, r2.c.params))));
            lsSet(LOCK_KEY, text);
            /* Запись замка не легла (нет места) — ждать права бессмысленно:
               оно у этой вкладки. Занавес стоит до записи замка другой
               вкладкой или до «Перечитать». */
            if (lsGet(LOCK_KEY) !== text) { crashHold(); return "frozen-room"; }
            noteOwnLock();
          }
          lateEnsure();
          protectedKeysNow().forEach(function (k) { try { rawStore.del.call(window.localStorage, k); } catch (e) { /* ignore */ } });
          return kind;
        }).then(function (v) { free(); return v; }, function () { free(); crashHold(); return "frozen-room"; });
      });
    }).then(null, function () { return false; });
  }
  /* ── ПЕРЕЕЗД МИРА В НОСИТЕЛЬ (D-351) ──────────────────────────────────
     Из резерва — в ту же ячейку. Из-за прежней двери записи замка (первый
     переезд этого замка, носителя ещё нет) — в СЛУЧАЙНУЮ ячейку; другая
     ячейка становится РЕЗЕРВОМ второй прежней двери: случайные байты, в
     которых на месте её роли лежит её обёртка мастера (и, если уезжает
     второй мир, копия запасной двери главного — чтобы код нашёл, куда
     вернуть главный мир). Носитель пишется ОДНОЙ записью, и лишь затем
     запись замка теряет двери: обрыв между ними оставит прежние двери рядом
     с носителем, и следующий вход найдёт мир в его ячейке и доведёт
     переезд (см. ниже «носитель, появившийся после пробы»).
     НОСИТЕЛЬ, ПОЯВИВШИЙСЯ ПОСЛЕ ПРОБЫ. Второй ключ, ключ устройства, их
     снятие и усиление памятью берут ОБА слова до первой записи — и у
     закрытой системы обе пробы видят прежние двери. Первый переезд пишет
     носитель, и второй мир с этой минуты ждёт уже в резерве; переезд «как
     первый» по старой пробе переписал бы носитель целиком и стёр бы мир,
     переехавший только что. То же — у двух вкладок, открывающих прежний
     замок разными словами. Поэтому перед первым переездом носитель
     читается заново, и если он есть, мир ищется в нём: в своей ячейке
     (печать сходится его мастером — его первый переезд оборвался до
     записи замка или прошёл в другой вкладке) или в резерве (тем же
     ключом прежней двери, hit.gcm). Найден в резерве — ложится туда.
     Найден в своей ячейке — его записи берутся ИЗ ЯЧЕЙКИ, а не из
     прежних конвертов: ячейка новее или та же, а свои конверты к этому
     мигу могли уже стать пустышками; ключ щели кода в ней сохраняется.
     Не найден, а запись замка уже знает носитель (carrier) — отказ, и не
     пишется ничего: носитель этого замка, мира в нём нет. Не найден, и
     запись замка носителя не знает — носитель чужой (остался от снятого
     или заменённого замка: восстановленная прежняя копия, прежний замок
     поверх нового), и первый переезд пишет свой, как всегда. Нашёл разбор
     Совета 01.10.2026, до выпуска; второе различие — kdf-cost-check на
     доске v177.
     Ответ — { cell, keys, rec, kv, code }: kv — записи, легшие в ячейку;
     code — байты ключа щели кода из ячейки (их обнуляет вызывающий). */
  function relocated(hit, c) {
    if (!hit.gcm) return Promise.reject(new Error("carrier-state"));
    return regionKeys(hit.m, hit.role).then(function (keys) {
      var jobs = [], r;
      for (r = 0; r < CARRIER_REGIONS; r++) {
        jobs.push(window.crypto.subtle.verify("HMAC", keys.mac, c.seal[r], regionOf(c, r)).then(null, function () { return false; }));
        jobs.push(gcmAt(hit.gcm, regionOf(c, r), RES_DOOR * hit.role));
      }
      return Promise.all(jobs);
    }).then(function (got) {
      var cell = -1, carried = false, r, own, res;
      for (r = 0; r < CARRIER_REGIONS; r++) {
        own = got[2 * r]; res = got[2 * r + 1];
        if (cell < 0 && (own || (res && sameBytes(res, hit.m)))) { cell = r; carried = !!own; }
        if (res) res.fill(0);
      }
      if (cell < 0) throw new Error("carrier-state");
      hit.src = "reserved"; hit.i = cell; hit.c = c; hit.carried = carried;
      if (!carried) return hit;
      /* Мир уже в своей ячейке. Её щель слова должна открываться набранным
         словом (так бывает, когда переезд того же слова прошёл в другой
         вкладке после пробы); не открывается — прежняя дверь старше ячейки:
         слово с тех пор сменили (финальный разбор H1, Г10). Ответ как на
         неверное слово, без записи: перепечатать ячейку прежним словом
         значило бы вернуть старое слово и отнять новое. */
      return slotCandidates(c, hit.slot, "word").then(function (cands) { return carrierMatch(c, cands); }).then(function (h) {
        var good = !!h && h.i === cell && h.role === hit.role;
        if (h) h.m.fill(0);
        if (!good) throw new Error("wrong");
        return hit;
      });
    });
  }
  function moveWorld(hit, kv) {
    var code = null, g = 0;
    /* От чего считается переезд (D-353): носитель, прочитанный здесь, — с
       ним и сверяется запись; носителя не было — его и не должно появиться. */
    var seen = hit.src === "reserved" && hit.c ? hit.c : null;
    var fresh = hit.src === "reserved" ? (seen ? Promise.resolve(kv) : carrierRead().then(function (c) {
      if (!c) throw new Error("carrier-state");
      seen = c;
      return kv;
    })) : carrierRead().then(function (c) {
      seen = c;
      if (!c) return kv;
      return relocated(hit, c).then(function () {
        if (!hit.carried) return kv;
        return readOwn(hit.i, hit.m, hit.role, !hit.dropCode).then(function (w) { code = w.code; g = w.g; seen = w.c; return w.kv; });
      }, function (e) {
        if (e && e.message === "wrong") throw e;          /* прежняя дверь устарела — см. relocated */
        var now = lockRecord();
        if (now && !carrierSize(now)) return kv;           /* носитель чужой — см. выше */
        throw e;
      });
    });
    return fresh.then(function (kv2) {
      kv = kv2;
      return codeFromBits(code).then(function (ck) {
        return sealRegion(hit.m, hit.slot, ck, kv, hit.role, g).then(function (sealed) { if (ck) ck.bits.fill(0); return sealed; },
          function (e) { if (ck) ck.bits.fill(0); throw e; });
      });
    }).then(function (sealed) {
      var puts = {}, rec = lockRecord() || {}, cell, other, resv, j, d, sp, iv, w;
      if (hit.src === "reserved") {
        cell = hit.i;
        puts[cell] = sealed;
        return carrierPut(seen, puts, null, hit.params, hit.spend || null).then(function (next) { return { cell: cell, keys: sealed.keys, rec: null, kv: kv, code: code, c: next, g: g }; },
          function (e) { if (code) code.fill(0); throw e; });
      }
      if (hit.c) throw new Error("carrier-state");
      cell = randBytes(1)[0] & 1; other = 1 - cell; j = 1 - hit.role;
      resv = new Uint8Array(CARRIER_REGION);
      for (var off = 0; off < resv.length; off += 65536) window.crypto.getRandomValues(resv.subarray(off, Math.min(resv.length, off + 65536)));
      d = (rec.doors || [])[j];
      try {
        if (d && d.wrap) {
          iv = unb64(d.wrapIv || d.iv); w = unb64(d.wrap);
          if (iv.length === 12 && w.length === RES_DOOR - 12) { resv.set(iv, RES_DOOR * j); resv.set(w, RES_DOOR * j + 12); }
        }
        sp = rec.spare;
        if (j === 0 && sp && sp.wrap) {
          iv = unb64(sp.wrapIv); w = unb64(sp.wrap);
          if (iv.length === 12 && w.length === RES_DOOR - 12) { resv.set(iv, RES_SPARE); resv.set(w, RES_SPARE + 12); }
        }
      } catch (e) { /* обёртка не читается — резерв остаётся шумом */ }
      puts[cell] = sealed;
      puts[other] = { region: resv, seal: randBytes(CR_SEAL) };
      return carrierPut(seen, puts, null, hit.params, hit.spend || null).then(function (written) {
        var next = carriedRecord(rec, hit.params);
        /* След стука — по ячейкам: wrap[r] под мастер мира ячейки r. */
        if (next.knock && Array.isArray(next.knock.wrap) && next.knock.wrap.length === 2 && cell !== hit.role) {
          next.knock = JSON.parse(JSON.stringify(next.knock));
          next.knock.wrap = [next.knock.wrap[1], next.knock.wrap[0]];
        }
        return { cell: cell, keys: sealed.keys, rec: next, kv: kv, code: null, c: written, g: 0 };
      });
    });
  }
  /* Открытый мир — в память сеанса: записи, кэш своего профиля, ключи. */
  function adoptWorld(ks, kv) {
    var pfx = activeProfile() === "local" ? "" : PROFILE_PREFIX + activeProfile() + ".";
    mem.clear();
    kv.forEach(function (v, k) {
      mem.set(k, v);
      /* ── ЧУЖОЙ ПРОФИЛЬ НЕ ВХОДИТ В СВОЮ ПАМЯТЬ (D-274) ─────────────────
         В память кэша идёт ТОЛЬКО своё: под именем — ключи со своей
         приставкой, гостем — ключи без чужих приставок. Нашёл
         lock-memory-check: записи гостя вставали на логические места
         профиля, и какая победит, решал порядок расшифровки. */
      var logical = null;
      if (pfx) { if (k.indexOf(pfx) === 0) logical = k.slice(pfx.length); }
      else if (k.indexOf(PROFILE_PREFIX) !== 0) logical = k;
      if (logical !== null) cache.set(logical, v);
    });
    vaultKeys = ks;
    vaultOpen = true;
    carrierChanged.clear();
    rollKeep();
    /* Вещи — в склад своей половины (D-352); прежние конверты переезжают. */
    thOnOpen(ks, vaultRole !== 0);
    bumpEpoch("open");
    if (window.sbBus && window.sbBus.emit) window.sbBus.emit("vault:change", { locked: true, open: true });
    if (typeof window.sbApplyStoredAppearance === "function") {
      try { window.sbApplyStoredAppearance(); } catch (e) { /* ignore */ }
    }
    if (typeof window.sbNotesStore === "object" && window.sbNotesStore.notify) {
      try { window.sbNotesStore.notify(); } catch (e) { /* ignore */ }
    }
    return true;
  }
  /* Довести переезд: свои прежние конверты — в пустышки, запись замка — без
     дверей. Для мира из носителя с прежней дверью рядом (hit.stale) — то же. */
  function finishMove(ks, own, rec2, cell, role) {
    return (own ? Promise.resolve(own) : legacyWorld(ks).then(function (x) { return x.own; })).then(function (list) {
      legacyTidy(list);
      if (rec2) { lsSet(LOCK_KEY, JSON.stringify(rec2)); lateEnsure(); return; }
      var now = lockRecord(), next;
      if (!now || !(now.doors || now.wrap)) return;
      /* Обрыв первого переезда: носитель записан, запись замка — ещё
         прежняя. След стука в ней стоит по ролям; ставится по ячейкам. */
      next = carriedRecord(now, paramsOf(now));
      if (next.knock && Array.isArray(next.knock.wrap) && next.knock.wrap.length === 2 && cell !== role) {
        next.knock = JSON.parse(JSON.stringify(next.knock));
        next.knock.wrap = [next.knock.wrap[1], next.knock.wrap[0]];
      }
      lsSet(LOCK_KEY, JSON.stringify(next));
      lateEnsure();
    });
  }
  /* Войти в найденный мир: прочесть ячейку или переехать в носитель. */
  function enterWorld(hit, right) {
    var m = hit.m;
    if (right === undefined) right = LOCKS ? false : "cas";
    /* Читающая вкладка мир прежнего вида не переносит: переезд — запись. Ответ
       — как на неверное слово (D-349): иной ответ сказал бы, что слово верно
       и что это не тот мир, что открыт в другой вкладке (разбор №3). */
    if (right !== "lock" && hit.src !== "carrier") { m.fill(0); return Promise.reject(new Error("wrong")); }
    return subkeys(m).then(function (ks) {
      var load = hit.src === "carrier"
        ? regionKeys(m, hit.role).then(function (rk) {
            return openRegion(rk, regionOf(hit.c, hit.i)).then(function (w) {
              /* Изменённое в миг прошлого ухода — поверх ячейки (поздняя щель).
                 Какой щель была в этот миг — запоминается: право писателя,
                 взятое позже, сверит, не легла ли с тех пор новая. */
              var lateSeen = lateRead(hit.i);
              return lateApply(hit.i, rk, w.kv, hit.c.seal[hit.i]).then(function (late) { return { kv: w.kv, code: w.code, own: null, rk: rk, cell: hit.i, rec: null, late: late, c: hit.c, g: w.g, lateSeen: lateSeen }; });
            });
          })
        : legacyWorld(ks).then(function (w) {
            return moveWorld(hit, w.kv).then(function (mv) { return { kv: mv.kv, code: mv.code, own: w.own, rk: mv.keys, cell: mv.cell, rec: mv.rec, c: mv.c, g: mv.g }; });
          });
      return load.then(function (w) {
        /* ПРАВО ПИСАТЕЛЯ (D-353, шаг 4) взято после верного слова — мир
           сверяется заново: прежний писатель мог записать ячейку или позднюю
           щель между проверкой слова и этим мигом; тогда основание сеанса
           устарело, и вкладка не пишет — только «Перечитать». */
        if (right !== "lock") return { w: w, right: right, fresh: true };
        var judge = function (c2) {
          var same = !!c2 && !c2.removing && !!w.c && sameCell(c2, w.c, w.cell) && (hit.src !== "carrier" || lateRead(w.cell) === w.lateSeen);
          return { w: w, right: "lock", fresh: same };
        };
        return carrierRead().then(function (c2) {
          /* Забор оборванного снятия: право у нас — значит, снимающего нет;
             лечим под правом и судим заново (разбор №2 шага 4). */
          if (c2 && c2.removing) {
            return carrierHealHeld().then(function (r) {
              if (r === "finished") { try { window.location.reload(); } catch (e) { /* ignore */ } throw new Error("removed"); }
              return carrierRead().then(judge);
            });
          }
          return judge(c2);
        }, function () { return { w: w, right: "lock", fresh: false }; });
      }).then(function (x) {
        var w = x.w;
        vaultDoor = w.cell;
        vaultRole = hit.role;
        carrierKeys = w.rk;
        carrierWordSlot = hit.slot;
        /* От чего этот сеанс считает (D-353). */
        ownFrom(w.c, w.cell);
        sessionG = w.g || 0;
        carrierStale = null;
        writeRight = x.right;
        /* Без права — только чтение с первой секунды, до любой записи входа
           (вещи, переезд, след); основание устарело — то же, со словами
           «изменено в другой вкладке». */
        lateKnown = null;
        if (x.right === false) carrierStaleNow("reader");
        else if (!x.fresh) carrierStaleNow("records");
        else if (x.right === "lock") {
          /* Последняя щель прежнего писателя могла дойти до этой вкладки позже
             права (у браузера свой кеш localStorage на процесс). Сеанс помнит
             щель, от которой считает (lateKnown), и сверяет её перед КАЖДОЙ
             своей записью — носителя и щели (разбор №3); ещё одна сверка
             чуть погодя замораживает и без записи. */
          /* Мир прежнего вида щели не имел: её заводит сам переезд (ниже), и
             сеанс запоминает её после него. */
          if (hit.src === "carrier") lateKnown = { cell: w.cell, v: w.lateSeen };
          /* ПОСТОЯННАЯ: 300 мс — дольше передачи записи localStorage между процессами браузера и раньше первой печати по окну (700 мс). */
          setTimeout(function () {
            if (vaultOpen && !carrierStale && lateDrift()) { carrierStaleNow("records"); return; }
            /* Сверка прошла — писатель перекладывает запись замка (разбор A1-3):
               обе щели сразу своими записями, без окна, в котором одна щель
               выдала бы снимкам второй мир. */
            lockFormatAsWriter();
          }, 300);
        }
        /* Копия параметров в записи замка и уборка прежних конвертов — записи
           общего для вкладок: только доказанному писателю (Web Lock) со свежим
           основанием (A1; без Web Locks — не пишутся). */
        if (x.right === "lock") mirrorParams(hit.params);
        var tidy = (w.own || w.rec || hit.stale) && x.right === "lock" && x.fresh ? finishMove(ks, w.own, w.rec, w.cell, hit.role) : Promise.resolve();
        return tidy.then(function () {
          if (x.right === "lock" && x.fresh && hit.src !== "carrier" && !carrierStale) lateKnown = { cell: w.cell, v: lateRead(w.cell) };
          return holdCode(w.code);
        })
          .then(function () { return holdMaster(m); }).then(function () { return adoptWorld(ks, w.kv); })
          .then(function (r) {
            /* Позднее ляжет в ячейку ближайшей печатью — вместе с шумом в щели. */
            (w.late || []).forEach(function (k) { carrierDirty(k); });
            knockToCarrier();
            return r;
          });
      });
    }).then(null, function (e) { m.fill(0); throw e; });
  }

  /* ── ЗАПЕРТОЕ ПИШЕТСЯ ЗАПЕРТЫМ — ЯЧЕЙКОЙ ЦЕЛИКОМ (D-351) ─────────────────
     Пока мир открыт, записи лежат в памяти, а на диск уходит ячейка целиком
     (sealRegion): новая метка, обе щели, новое тело, новая печать.
     Записи собираются окном в CARRIER_QUIET_MS от первой правки: ячейка —
     мебибайт, и писать её на каждую букву значило бы изнашивать память
     телефона; при непрерывной записи печать идёт не реже раза в окно.
     ДРУГАЯ ВКЛАДКА (D-353). Запись — одной транзакцией сравнения и замены
     (carrierCommit): чужая ячейка не трогается вовсе, своя ложится, только
     если на месте ровно та, от которой считает сеанс; иначе — отказ без
     записи и заморозка вкладки. Слияния, повтора и пересоздания нет.
     В МИГ УХОДА полная печать начинается, но браузер не обязан её
     дождаться (замерено: запись IndexedDB в этот миг обрывается). Поэтому
     сперва изменённое ложится в позднюю щель (см. ниже) синхронной записью.
     ЦЕНА НАЗВАНА: изменённое, не поместившееся в щель (64 КиБ), в миг ухода
     не спасается — только полной печатью, если она успела раньше. */
  /* ПОСТОЯННАЯ: окно в 700 мс от первой правки — между словами при наборе; шире — копились бы потери при закрытии. */
  var CARRIER_QUIET_MS = 700;
  var carrierTimer = null;
  var carrierChanged = new Set();
  var carrierInflight = new Set();   /* ключи печати, что уже идёт, но ещё не легла */
  var carrierPendingSeal = null;     /* печать той ячейки, что сейчас ложится */
  var leaving = false;               /* страница уходит или скрыта */
  var lateQueue = Promise.resolve(), lateQueued = false;
  /* Изменённое с последней печати — в позднюю щель своей ячейки. Снимок
     берётся В МИГ записи: последняя в очереди запись несёт всё новейшее.
     Сама запись — синхронная (localStorage): её не оборвёт уход страницы. */
  function carrierLateNow() {
    lateQueue = lateQueue.then(function () {
      if (carrierStale || !vaultOpen || !carrierKeys || !carrierKeys.late || vaultDoor < 0 || !ownBase) return false;
      /* Щель пишет только писатель ячейки (D-353, шаг 4): у неё нет
         сравнения-и-замены с носителем, и второй писатель сделал бы её
         «кто последний, тот и прав». Без замка (и без Web Locks) щели нет.
         Замка нет — мир снят: щели не заводятся. */
      if (writeRight !== "lock" || !heldLock || !heldLock.world || !lsGet(LOCK_KEY)) return false;
      var keys = new Set(), delta = {}, n = 0, cell = vaultDoor, ks = carrierKeys;
      carrierChanged.forEach(function (k) { keys.add(k); });
      carrierInflight.forEach(function (k) { keys.add(k); });
      keys.forEach(function (k) { var v = mem.get(k); delta[k] = v == null ? null : v; n++; });
      if (!n) return false;
      /* Основа щели — состояние, от которого считает ЭТОТ сеанс (D-353), а не
         последнее прочитанное: отставший сеанс читал и более новое, но его
         изменения сделаны поверх своего, и лечь поверх чужого они не должны. */
      var bases = [b64(ownBase.seal)];
      if (carrierPendingSeal) bases.push(b64(carrierPendingSeal));
      /* Без сжатия: поток сжатия в миг ухода не доходит до конца (замерено),
         шифр — доходит. */
      var data = new TextEncoder().encode(JSON.stringify({ v: 1, b: bases, d: delta }));
      return Promise.resolve().then(function () {
        var kind = 0, room = LATE_SIZE - LATE_NONCE - CR_SEAL;
        if (5 + data.length > room) return false;
        var plain = new Uint8Array(room), nonce = randBytes(LATE_NONCE);
        plain[0] = (data.length >>> 24) & 255; plain[1] = (data.length >>> 16) & 255;
        plain[2] = (data.length >>> 8) & 255; plain[3] = data.length & 255;
        plain[4] = kind;
        plain.set(data, 5);
        return window.crypto.subtle.encrypt({ name: "AES-CTR", counter: nonce, length: 64 }, ks.late, plain).then(function (ct) {
          var c8 = new Uint8Array(ct);
          return window.crypto.subtle.sign("HMAC", ks.lateMac, cat(nonce, c8)).then(function (mac) {
            /* Своя запись своей ячейки — целиком, без чтения общей (D-353). */
            if (carrierStale || lateSuspended || writeRight !== "lock" || !heldLock || !heldLock.world || !lsGet(LOCK_KEY)) return false;
            /* Чужая щель на месте своей — не писать поверх неё: заморозка. */
            if (lateDrift()) { carrierStaleNow("records"); return false; }
            var slotNow = b64(cat(nonce, new Uint8Array(mac), c8));
            lsSet(lateKey(cell), slotNow);
            if (lateRead(cell) === slotNow) lateKnown = { cell: cell, v: slotNow };
            return true;
          });
        });
      });
    }).then(null, function () { return false; });
    return lateQueue;
  }
  /* Щель своей ячейки — прочесть при входе: изменённое ложится поверх
     записей ячейки, если лежало поверх ЭТОЙ ЖЕ печати. Ответ — список
     изменённых ключей (пустой, если в щели шум, чужое или устаревшее). */
  function lateApply(cell, ks, kv, seal) {
    var rec = lockRecord(), b;
    var slot = lateRead(cell);
    if (!ks || !ks.late || !seal || !slot) return Promise.resolve([]);
    try { b = unb64(slot); } catch (e) { return Promise.resolve([]); }
    if (!b || b.length !== LATE_SIZE) return Promise.resolve([]);
    var nonce = b.subarray(0, LATE_NONCE), mac = b.subarray(LATE_NONCE, LATE_NONCE + CR_SEAL), ct = b.subarray(LATE_NONCE + CR_SEAL);
    return window.crypto.subtle.verify("HMAC", ks.lateMac, mac, cat(nonce, ct)).then(function (good) {
      if (!good) return [];
      return window.crypto.subtle.decrypt({ name: "AES-CTR", counter: nonce, length: 64 }, ks.late, ct).then(function (buf) {
        var p = new Uint8Array(buf);
        var n = ((p[0] << 24) | (p[1] << 16) | (p[2] << 8) | p[3]) >>> 0;
        if (n > p.length - 5) return [];
        var data = p.subarray(5, 5 + n);
        return Promise.resolve(data).then(function (plain) {
          var obj = JSON.parse(new TextDecoder().decode(plain)), out = [], k;
          if (!obj || obj.v !== 1 || !obj.d || typeof obj.d !== "object" || !Array.isArray(obj.b)) return [];
          if (obj.b.indexOf(b64(seal)) < 0) return [];
          for (k in obj.d) if (Object.prototype.hasOwnProperty.call(obj.d, k)) {
            if (obj.d[k] == null) kv.delete(k); else kv.set(k, String(obj.d[k]));
            out.push(k);
          }
          return out;
        });
      });
    }).then(null, function () { return []; });
  }
  function carrierDirty(k) {
    if (!vaultOpen || !carrierKeys) return;
    carrierChanged.add(String(k));
    /* Пишут в миг ухода — поздняя щель сейчас же (по одной на ход событий). */
    if (leaving && !lateQueued) {
      lateQueued = true;
      Promise.resolve().then(function () { lateQueued = false; carrierLateNow(); });
    }
    /* ОКНО, А НЕ ПОКОЙ. Таймер ставится первой правкой и больше не
       переставляется: правки внутри окна собираются в одну печать. Прежде
       каждая правка переставляла таймер заново, и система, которая пишет
       что-нибудь чаще раза в CARRIER_QUIET_MS, не запечатывала НИЧЕГО до
       ухода со страницы, — а уход не обязан дождаться записи. Нашёл
       baton-check: запись, открытая за полторы секунды до перезагрузки,
       после двери пропадала. */
    if (!carrierTimer) carrierTimer = setTimeout(carrierFlushNow, CARRIER_QUIET_MS);
  }
  function carrierFlushNow() {
    if (carrierTimer) { clearTimeout(carrierTimer); carrierTimer = null; }
    if (!carrierChanged.size) return sealQueue;
    sealQueue = sealQueue.then(carrierSaveWorld).catch(function (e) { if (window.console) console.error("[vault] carrier write failed", e); });
    return sealQueue;
  }
  /* Своё поверх лежащего: изменённые ключи — из памяти, остальное — из ячейки. */
  function mergeOwn(lying, changed) {
    var kv = lying || new Map();
    if (!lying) mem.forEach(function (v, k) { if (v != null) kv.set(k, v); });
    changed.forEach(function (k) { var v = mem.get(k); if (v == null) kv.delete(k); else kv.set(k, v); });
    return kv;
  }
  /* ── УСТАРЕВШИЙ ПИСАТЕЛЬ ПОЛУЧАЕТ ОТКАЗ (D-353) ─────────────────────
     Своя ячейка сверяется с тем, от чего сеанс считает (ownBase, sessionG).
     Её записала другая вкладка — этот сеанс отстал: он НЕ пишет и не
     «чинит», а говорит об этом. Сменились полномочия (слово, код, ключи) —
     сеанс закрывает мир: его ключи больше не те. Сохранили записи — сеанс
     перестаёт сохранять: иначе его более старая копия легла бы поверх более
     новой. Ячейка не открывается своим ключом — тоже отказ, а не запись из
     памяти поверх неизвестного. */
  function ownCurrent(w, r) {
    if (!w || !w.c) throw new Error("stale-auth");
    if (w.g !== sessionG) throw new Error("stale-auth");
    if (!ownBase || !sameBytes(w.c.seal[r], ownBase.seal) || !sameBytes(regionOf(w.c, r), ownBase.region)) throw new Error("stale");
    return w;
  }
  function ownAfter(sealed) {
    ownBase = { region: new Uint8Array(sealed.region), seal: new Uint8Array(sealed.seal) };
  }
  function ownFrom(c, r) {
    ownBase = c ? { region: new Uint8Array(regionOf(c, r)), seal: new Uint8Array(c.seal[r]) } : null;
  }
  var staleSaidAt = 0;
  /* Сказать об отставании; о записях — не чаще раза в 20 с, пока человек
     продолжает писать в отставшей вкладке. */
  var staleStanding = null;
  function staleSay(kind) {
    var tr = window.sbT || function (k) { return k; };
    var now = Date.now();
    /* Бессрочное извещение с одним выходом — «Перечитать»: состояние
       перечитывается только по явному действию человека. */
    if (typeof window.showStandingToast === "function") {
      if (staleStanding && staleStanding.kind === kind && staleStanding.handle && staleStanding.handle.el && staleStanding.handle.el.parentNode) return;
      if (staleStanding && staleStanding.handle && staleStanding.handle.dismiss) { try { staleStanding.handle.dismiss(); } catch (e) { /* ignore */ } }
      try {
        staleStanding = { kind: kind, handle: window.showStandingToast(tr(kind === "reader" ? "lock.readerTitle" : "lock.staleTitle"), tr(kind === "auth" ? "lock.staleAuthBody" : kind === "reader" ? "lock.readerBody" : "lock.staleBody"), "",
          [{ id: "stale-reload", label: tr("lock.staleReload"), run: function () { try { window.location.reload(); } catch (e) { /* ignore */ } } }], "toast-warn", true) };
      } catch (e) { staleStanding = null; }
      return;
    }
    /* ПОСТОЯННАЯ: 20 с между повторами — правка за правкой не превращается в ленту извещений. */
    if (typeof window.showToast === "function" && (kind === "auth" || now - staleSaidAt > 20000)) {
      staleSaidAt = now;
      try { window.showToast(tr(kind === "reader" ? "lock.readerTitle" : "lock.staleTitle"), tr(kind === "auth" ? "lock.staleAuthBody" : kind === "reader" ? "lock.readerBody" : "lock.staleBody"), "", true, "toast-warn", "event"); } catch (e) { /* ignore */ }
    }
  }
  /* ЗАМОРОЗКА (D-353, слово основателя: «CONFLICT → REJECT → NO WRITE →
     FREEZE → FRESH STATE»). Узнав, что отстала, вкладка теряет право записи
     целиком: носитель, вещи, поздняя щель, запись замка, журнал, метки,
     снимки — всё отвечает отказом (carrierStale проверяют все двери записи).
     Несохранённое остаётся только в её памяти и на экране. Назад — один
     путь: явное «Перечитать» (перезагрузка), свежее чтение у двери и новое
     право записи. Сменили полномочия — ключи сеанса выбрасываются сразу. */
  /* Читающая (нет права) < правка в другой вкладке < сменились полномочия. */
  var STALE_RANK = { reader: 1, records: 2, auth: 3 };
  function carrierStaleNow(kind) {
    if (!STALE_RANK[kind]) kind = "records";
    /* Своё снятие замка: отказы от своего же забора — не конфликт, и право
       писателя держится до конца снятия (иначе загрузка другой вкладки
       сочла бы снимающего мёртвым). Писателя, кроме снимающего, нет. */
    if (removingNow && kind !== "auth") return;
    if (carrierStale && STALE_RANK[carrierStale] >= STALE_RANK[kind]) return;
    carrierStale = kind;
    writerDrop();
    if (carrierTimer) { clearTimeout(carrierTimer); carrierTimer = null; }
    carrierChanged.clear();
    if (kind === "auth") {
      vaultKeys = null;
      carrierKeys = null;
      carrierWordSlot = null;
      codeBox = null;
      thK = null; thState = null;
      ownBase = null;
      dropMaster();
      vaultOpen = false;
      if (window.sbBus && window.sbBus.emit) window.sbBus.emit("vault:change", { locked: true, open: false, frozen: true });
    } else if (window.sbBus && window.sbBus.emit) window.sbBus.emit("vault:change", { locked: true, open: true, frozen: true });
    staleSay(kind);
  }
  /* Замёрзшая вкладка не пишет, но слушает: сменили полномочия — ключи сеанса
     выбрасываются. Читает и только читает. */
  function staleProbe() {
    carrierChanged.clear();
    if ((carrierStale !== "records" && carrierStale !== "reader") || !vaultOpen || vaultDoor < 0) return Promise.resolve(false);
    var r = vaultDoor, role = vaultRole;
    return withMaster(function (m) { return readOwn(r, m, role); }).then(function (w) {
      if (w.g !== sessionG) carrierStaleNow("auth");
      else staleSay(carrierStale);
      return false;
    }, function () { carrierStaleNow("auth"); return false; });
  }
  function carrierSaveWorld() {
    if (carrierStale) return staleProbe();
    if (removingNow) return Promise.resolve(false);   /* снимаемый носитель не пишется; правки остаются в очереди — уйдут открытыми или вернутся печатью при откате */
    if (!vaultOpen || !carrierKeys || !carrierWordSlot || vaultDoor < 0 || !carrierChanged.size) return Promise.resolve(false);
    var r = vaultDoor, role = vaultRole, keys = carrierKeys, slot = carrierWordSlot;
    var changed = Array.from(carrierChanged);
    carrierChanged.clear();
    changed.forEach(function (k) { carrierInflight.add(k); });
    var settle = function () { changed.forEach(function (k) { carrierInflight.delete(k); }); carrierPendingSeal = null; };
    /* Не записалось по сбою носителя — изменения возвращаются в очередь и
       пробуются позже. Отказ «отстал» — не сбой: повтора нет. */
    var giveBack = function () {
      settle();
      changed.forEach(function (k) { carrierChanged.add(k); });
      if (carrierTimer) clearTimeout(carrierTimer);
      carrierTimer = setTimeout(carrierFlushNow, CARRIER_QUIET_MS * 4);
    };
    var base = null;
    return withMaster(function (m) {
      return withCode(function (code) {
        return readOwn(r, m, role).then(null, function () { throw new Error("stale-auth"); }).then(function (w) {
          ownCurrent(w, r);
          base = w.c;
          return sealRegion(m, slot, code, mergeOwn(w.kv, changed), role, sessionG);
        });
      });
    }).then(function (sealed) {
      if (!sealed) { settle(); return false; }
      if (!vaultOpen || vaultDoor !== r || carrierKeys !== keys) { settle(); return false; }
      var puts = {}; puts[r] = sealed;
      /* Печать, которая сейчас ляжет, — поздняя щель назовёт и её. */
      carrierPendingSeal = sealed.seal;
      return carrierPut(base, puts, null, null).then(function () {
        ownAfter(sealed);
        settle();
        if (window.sbBus && window.sbBus.emit) {
          var at = Date.now();
          var tileName = "carrier:" + window.sbCarrier.tileOfRegion(r);
          changed.forEach(function (k) { window.sbBus.emit("vault:sealed", { key: k, name: tileName, at: at }); });
        }
        return true;
      });
    }).then(null, function (e) {
      var why = e && e.message;
      /* Отказ — не сбой (D-353): ни повтора, ни слов «не удалось сохранить».
         «frozen» — вкладка замёрзла, пока запись шла (весть соседей пришла
         раньше её конца). Отказ сверкой ячейки («stale») не говорит, сменились
         ли полномочия: они сверяются тут же, только чтением (staleProbe), —
         весть соседей могла и не дойти. */
      /* Свой забор (идёт своё снятие замка) — не конфликт: записанное уйдёт
         открытым вместе со снятием. Чужой забор — носитель снимается. */
      if (why === "fenced" && removingNow) { settle(); return false; }
      if (why === "fenced") why = "stale";
      if (why === "stale" || why === "stale-auth" || why === "frozen") {
        settle();
        if (why !== "frozen") carrierStaleNow(why === "stale-auth" ? "auth" : "records");
        if (carrierStale === "records") return staleProbe();
        return false;
      }
      giveBack();
      if (why === "full") surfaceCarrierFull();
      else surfaceStorageFailure();
      if (window.console) console.error("[vault] carrier write failed", e);
      return false;
    });
  }
  var carrierFullSaid = false;
  function surfaceCarrierFull() {
    if (carrierFullSaid) return;
    carrierFullSaid = true;
    var tr = window.sbT || function (k) { return k; };
    if (typeof window.showToast === "function") {
      try { window.showToast(tr("lock.fullTitle"), tr("lock.fullBody"), "", true, "toast-warn", "event"); } catch (e) { /* ignore */ }
    }
  }
  /* Всякая запись носителя — по очереди с записью ячейки мира: иначе ячейка,
     собранная до смены щели, легла бы поверх неё и вернула прежнее слово. */
  function carrierJob(fn) {
    var job = sealQueue.then(function () { return fn(); });
    sealQueue = job.then(null, function () { return null; });
    return job;
  }
  /* Запись у закрытой системы — под правом писателя (D-353, шаг 4): вкладка
     берёт право сама и отпускает его, если мир в ней так и не открыт; пока
     пишет другая вкладка — отказ «writer». */
  function withWriter(fn) {
    var had = !!(heldLock && heldLock.world);
    var let_go = function () { if (!had && !vaultOpen) writerDrop(); };
    return writerTake().then(function (right) {
      if (right === false) throw new Error("writer");
      return fn();
    }).then(function (v) { let_go(); return v; }, function (e) { let_go(); throw e; });
  }
  /* Мир, найденный за прежней дверью, переезжает сейчас же — под правом
     писателя: переезд пишет носитель и запись замка. */
  function ensureCarried(hit) {
    /* Мир найден в носителе, а запись замка — прежнего вида (hit.stale):
       переезд доводится под правом до действия — иначе прежняя дверь в
       записи замка пережила бы и второй ключ, и цену (финальный разбор H1,
       Г10). */
    if (hit && hit.src === "carrier" && hit.stale) {
      return withWriter(function () {
        return subkeys(hit.m).then(function (ks) { return finishMove(ks, null, null, hit.i, hit.role); }).then(function () { hit.stale = false; return hit; });
      });
    }
    if (!hit || (hit.src !== "legacy" && hit.src !== "reserved")) return Promise.resolve(hit);
    return withWriter(function () { return carryHeld(hit); });
  }
  function carryHeld(hit) {
    return subkeys(hit.m).then(function (ks) {
      return legacyWorld(ks).then(function (w) {
        return carrierJob(function () { return moveWorld(hit, w.kv); }).then(function (mv) {
          if (mv.code) mv.code.fill(0);
          return finishMove(ks, w.own, mv.rec, mv.cell, hit.role).then(function () {
            /* Ячейка, в которую мир переехал под этим же правом, — теперь то,
               от чего считает план действия (разбор №8). */
            hit.i = mv.cell; hit.src = "carrier"; hit.stale = false; hit.c = carrierMem;
            return hit;
          });
        });
      });
    });
  }
  /* ── ПЕРЕДЕЛАТЬ ЩЕЛИ СЛОВ ПОД НОВЫЕ ПАРАМЕТРЫ ВЫВОДА (D-351) ─────────────
     Второй ключ, ключ устройства, цена памятью меняют то, из чего выводится
     ключ щели. Обе ячейки пересобираются заново, параметры ложатся рядом —
     ОДНОЙ записью носителя. w0 — главный мир { m, pw }, обязателен; w1 —
     второй или null (тогда его ячейка — шум: мир за ней открыть больше
     нечем, и это сказано в окне до нажатия). patch меняет параметры. */
  /* Пересборка обеих ячеек (второй ключ, ключ устройства, цена) — запись:
     только под правом писателя (D-353, шаг 4). Вкладка у закрытой системы
     берёт право сама и отпускает его, если мир в ней так и не открыт; пока
     пишет другая вкладка — отказ «writer». */
  function reslotWorlds(w0, w1, fsecNew, patch, plan) {
    var rec0 = lockRecord();
    if (!rec0) return Promise.reject(new Error("no-lock"));
    if (carrierStale || lostNow()) return Promise.reject(new Error("frozen"));
    var had = !!(heldLock && heldLock.world);
    var let_go = function () { if (!had && !vaultOpen) writerDrop(); };
    return writerTake().then(function (right) {
      if (right === false) throw new Error("writer");
      return reslotHeld(w0, w1, fsecNew, patch, rec0, plan || rec0);
    }).then(function (v) { let_go(); return v; }, function (e) { let_go(); throw e; });
  }
  /* Щели, от которых считает пересборка у закрытой системы (разбор №7):
     прочитаны под правом после HEAL_SETTLE_MS и сверяются перед записью и в
     самой транзакции (lateDrift) — щель, сменившаяся после чтения, означает
     отказ без записи, а не печать, которая сделала бы её мёртвой. */
  var lateHold = null;
  function reslotHeld(w0, w1, fsecNew, patch, rec0, plan) {
    var settle = vaultOpen ? Promise.resolve() : new Promise(function (r) { setTimeout(r, HEAL_SETTLE_MS); });
    return settle.then(function () { return reslotPlanned(w0, w1, fsecNew, patch, rec0, plan); })
      .then(function (v) { lateHold = null; return v; }, function (e) { lateHold = null; throw e; });
  }
  function reslotPlanned(w0, w1, fsecNew, patch, rec0, plan) {
    return carrierRead().then(function (c) {
      var params = paramsOf(withParams(rec0, c && c.params));
      patch(params);
      var cost = costOf({ kdf: params.kdf });
      return deriveWordKeys(w0.pw, params.salt, cost[0], cost[1], fsecNew, cost[2]).then(function (k0) {
        return (w1 ? deriveWordKeys(w1.pw, params.salt, cost[0], cost[1], fsecNew, cost[2]) : Promise.resolve(null)).then(function (k1) {
          /* Ячейки — по месту миров (w.i): главный мир лежит там, где лежит. */
          var c0 = w0.i, c1 = w1 ? w1.i : 1 - w0.i;
          /* Полномочия обоих миров меняются: поколение каждого растёт (D-353),
             и сеансы этих миров в других вкладках узнают, что отстали. */
          var mine = vaultOpen && vaultDoor === c0 && vaultRole === 0, s0 = null, g0 = 0;
          return carrierJob(function () {
            return readOwn(c0, w0.m, 0, true).then(function (own0) {
              if (mine) { try { ownCurrent(own0, c0); } catch (e) { if (own0.code) own0.code.fill(0); throw e; } }
              /* План действия (файл, ключ устройства, цена) построен по записи
                 замка, прочитанной под правом; лежащие в носителе параметры
                 обязаны быть теми же. Иначе план устарел: отказ без записи. */
              if (!sameParams(paramsOf(plan), paramsOf(withParams(plan, own0.c && own0.c.params)))) { if (own0.code) own0.code.fill(0); throw new Error("stale"); }
              /* Ячейка, которую открыло слово, — тоже часть плана (разбор №8): у
                 закрытой системы она обязана быть той же и сейчас. Сменилась
                 (другая вкладка сменила слово, пока право было не у нас) —
                 отказ без записи, а не печать прежнего слова поверх нового.
                 Открытый мир сверяет свою ячейку выше (ownCurrent). */
              if (!mine && w0.c && !sameCell(w0.c, own0.c, c0)) { if (own0.code) own0.code.fill(0); throw new Error("stale"); }
              /* У закрытой системы последний миг прежнего писателя (поздняя щель
                 главного мира) ложится в его ячейку и здесь — новая печать не
                 делает его мёртвым (старое не ложится поверх нового). */
              if (mine) return own0;
              lateHold = lateHold || {}; lateHold[c0] = lateRead(c0);
              return regionKeys(w0.m, 0).then(function (rk0) { return lateApply(c0, rk0, own0.kv, own0.c.seal[c0]); }).then(function () { return own0; });
            }).then(function (own0) {
              g0 = own0.g + 1;
              return codeFromBits(own0.code).then(function (code0) {
                if (own0.code) own0.code.fill(0);
                var done = function (v) { if (code0) code0.bits.fill(0); return v; };
                return sealRegion(w0.m, k0.slot, code0, own0.kv, 0, g0).then(done, function (e) { done(); throw e; });
              }).then(function (sealed0) { s0 = sealed0; return own0.c; });
            }).then(function (base0) {
              var puts = {}; puts[c0] = s0;
              if (!w1) return carrierPut(base0, puts, [c1], params);
              return readOwn(c1, w1.m, 1).then(function (own1) {
                /* Обе ячейки — от одного и того же прочитанного носителя. */
                if (!sameCell(base0, own1.c, c0)) throw new Error("stale");
                if (!mine && w1.c && !sameCell(w1.c, own1.c, c1)) throw new Error("stale");
                /* Последний миг второго мира (его поздняя щель) ложится в его
                   ячейку и здесь — новая печать не делает его мёртвым. */
                if (!mine) { lateHold = lateHold || {}; lateHold[c1] = lateRead(c1); }
                return regionKeys(w1.m, 1).then(function (rk1) { return lateApply(c1, rk1, own1.kv, own1.c.seal[c1]); }).then(function () {
                  return sealRegion(w1.m, k1.slot, null, own1.kv, 1, own1.g + 1);
                }).then(function (s1) { puts[c1] = s1; return carrierPut(own1.c, puts, null, params); });
              });
            });
          }).then(function () {
            if (mine) { ownAfter(s0); sessionG = g0; }
            if (vaultOpen && vaultDoor === c0) carrierWordSlot = k0.slot;
            var fin = withParams(lockRecord() || rec0, params);
            /* Прежние двери сделаны прежними параметрами — открыть ими больше нечего. */
            if (Array.isArray(fin.doors)) fin.doors = [randomDoor(), randomDoor()];
            if (!w1 && fin.knock && Array.isArray(fin.knock.wrap) && fin.knock.wrap[c0]) fin.knock.wrap[c1] = knockNoise(fin.knock.wrap[c0]);
            lsSet(LOCK_KEY, JSON.stringify(fin));
            /* Мир за ячейкой-шумом потерян — и его склад вещей в шум (D-352). */
            return w1 ? true : thWipe(c1).then(function () { return true; });
          });
        });
      });
    });
  }

  /* ── НОСИТЕЛЬ НАРУЖУ — ТОЛЬКО БАЙТАМИ (D-351) ──────────────────────────
     Дверь и окно «Замок» рисуют носитель так же, как рисовали конверты: по
     НАСТОЯЩИМ байтам, плитками по CARRIER_TILE. Ключей и смысла здесь нет —
     ровно то, что увидел бы чужой с этим диском в руках. */
  /* ПОСТОЯННАЯ: плитка — 16 КиБ; мебибайт ячейки — 64 плитки, носитель — 128:
     поле двери и окно держат столько клеток без потери кадров (D-217). */
  var CARRIER_TILE = 16384;
  window.sbCarrier = {
    size: function () { return CARRIER_REGIONS * CARRIER_REGION; },
    tileSize: function () { return CARRIER_TILE; },
    tiles: function () { return carrierMem ? Math.ceil(carrierMem.bytes.length / CARRIER_TILE) : 0; },
    tile: function (i) {
      if (!carrierMem) return "";
      var from = i * CARRIER_TILE, to = Math.min(carrierMem.bytes.length, from + CARRIER_TILE);
      if (!(to > from)) return "";
      /* Лицо плитки — по её первым 96 байтам и последним 96: этого хватает,
         чтобы любое изменение плитки меняло лицо, и не приходится гнать
         шестнадцать килобайт через base64 на каждый кадр. */
      return b64(cat(carrierMem.bytes.subarray(from, Math.min(to, from + 96)), carrierMem.bytes.subarray(Math.max(from, to - 96), to)));
    },
    tileOfRegion: function (r) { return Math.floor((r * CARRIER_REGION + CR_HEAD) / CARRIER_TILE); },
    load: function () { return carrierRead().then(function (c) { return !!c; }); }
  };
  /* Замок с носителем — носитель читается сразу, до двери: поле за дверью
     рисует его байты. */
  try { var bootRec = lockRecord(); if (carrierSize(bootRec)) carrierRead(); } catch (e) { /* нет базы — поле пустое */ }
  /* ═══════ ОДНА ДВЕРЬ, СТУПЕНЬ 2: СКЛАД ВЕЩЕЙ ОДНОГО РАЗМЕРА · D-352 ═══════
     ПОВОД. После ступени 1 (D-351) записи мира лежали в носителе одного
     размера, а вещи Хранилища — конвертами по одному в складе «things»: по
     диску было видно, сколько вещей и какого они веса, а по двум снимкам —
     какого веса вещь положили только что. Размер склада основатель отдал
     Совету 01.10.2026: «Прошу совет принять самое гениальное,
     интеллектуальное и правильное решение».
     РЕШЕНИЕ. Под замком вещи лежат в носителе (тот же склад «carrier»
     IndexedDB): TH_CHUNKS записей по мебибайту и запись печатей «tmac».
     Половина — мир: части ячейки r (тот же номер, что у ячейки его записей,
     и он так же не говорит, чей мир). Внутри половины, под ключами мира, —
     одна строка байтов: длина описи ‖ опись (JSON: номер, имя, род, вес,
     время и место каждой вещи) ‖ вещи подряд ‖ нули до конца; снаружи —
     AES-CTR ключом мира от метки половины и HMAC-SHA-256 каждой части
     (метка, номер части, шифр). Метка и печати частей обеих половин — в
     «tmac», той же длины всегда.
     ЛЮБАЯ ЗАПИСЬ ВЕЩЕЙ ПЕРЕСОБИРАЕТ ПОЛОВИНУ ЦЕЛИКОМ: новая метка, каждая
     часть заново. Если бы писались только изменённые части, по двум
     снимкам было бы видно, сколько частей сменилось, — то есть вес
     положенной вещи: «строение данных», которого One Door не допускает.
     Поэтому цена записи — вес половины, а не вещи, и размер выбран по ней:
     128 МиБ на мир, 256 на носитель, одинаково у всех. Несколько вещей,
     принесённых разом, ложатся одной пересборкой.
     ЗАПИСЬ — ОДНОЙ ТРАНЗАКЦИЕЙ: все части половины и печати либо ложатся
     вместе, либо не ложатся вовсе; внутри транзакции метка половины
     сверяется с той, что читали, — другая вкладка, успевшая записать раньше,
     не будет переписана вслепую, пересборка повторяется.
     ПОЛОВИНА, ЧЬЯ ОПИСЬ НЕ СХОДИТСЯ С ПЕЧАТЬЮ, — ПУСТА: так выглядит шум
     нового склада, и так же — половина, испорченная на диске (её вещи уже не
     прочесть; спасают копии).
     ПРЕЖНИЕ КОНВЕРТЫ (вещи v177 и раньше, D-265) переезжают в половину при
     входе своим словом, сколько поместится; на месте переехавшего — пустышка
     того же веса под тем же номером: число и вес конвертов на диске не
     меняются, и остаток не говорит, переехал ли мир. Не поместившееся
     остаётся конвертом, и это сказано вслух (lock.thingsLeft).
     ГРАНИЦЫ, вслух: по нескольким снимкам видно, менялся ли склад и когда
     (эпоха записи — следующая ступень); на миг записи шифр половины (128 МиБ)
     держится в памяти — иначе запись не была бы одной транзакцией; вещи,
     оставшиеся конвертами, видны по числу и весу, как прежде.
     Охраняется tools/one-door-things-check.mjs. */
  /* ПОСТОЯННАЯ: часть — мебибайт (одна запись IndexedDB), половина мира —
     128 частей: 128 МиБ на мир, 256 на носитель (D-352, замер: пересборка
     128 МиБ — около полутора секунд записи на двухъядерной машине). */
  var TH_CHUNK = 1048576, TH_HALF_CHUNKS = 128;
  var TH_HALF = TH_CHUNK * TH_HALF_CHUNKS, TH_CHUNKS = CARRIER_REGIONS * TH_HALF_CHUNKS;
  /* ПОСТОЯННАЯ: метка половины — 16 байт (счётчик AES-CTR), печать части —
     32 (HMAC-SHA-256), блок CTR — 16 байт: в части 65536 блоков. */
  var TH_NONCE = 16, TH_TAG = 32, TH_BLOCKS = TH_CHUNK / 16;
  var TH_MAC_HALF = TH_NONCE + TH_HALF_CHUNKS * TH_TAG, TH_MAC_ID = "tmac";
  var thK = null;        /* { ctr, mac } открытого мира — неизвлекаемые */
  var thState = null;    /* { r, nonce, dir } — последняя прочитанная опись своей половины */
  var thWhy = null;      /* почему склад не принял последнюю вещь: full | closed | nostore | incognito | frozen | fail */
  var thPend = null;     /* вещи, ждущие пересборки: { add: [], del: [], force } */
  function thId(r, i) { return "t" + (r * TH_HALF_CHUNKS + i); }
  function thNoise(n) {
    var u = new Uint8Array(n), off;
    for (off = 0; off < n; off += 65536) window.crypto.getRandomValues(u.subarray(off, Math.min(n, off + 65536)));
    return u.buffer;
  }
  function thKeys() {
    if (thK) return Promise.resolve(thK);
    return withMaster(function (m) {
      var subtle = window.crypto.subtle, enc = new TextEncoder(), empty = new Uint8Array(0);
      return subtle.importKey("raw", m, "HKDF", false, ["deriveKey"]).then(function (b) {
        return Promise.all([
          subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt: empty, info: enc.encode("sys.baby/things/ctr/v1") }, b, { name: "AES-CTR", length: 256 }, false, ["encrypt", "decrypt"]),
          subtle.deriveKey({ name: "HKDF", hash: "SHA-256", salt: empty, info: enc.encode("sys.baby/things/mac/v1") }, b, { name: "HMAC", hash: "SHA-256", length: 256 }, false, ["sign", "verify"])
        ]);
      });
    }).then(function (k) { thK = { ctr: k[0], mac: k[1] }; return thK; });
  }
  /* Счётчик части i: метка половины плюс i·65536 блоков в младших 64 битах
     (как считает сам AES-CTR с length: 64) — половина одна сплошная струя. */
  function thCounter(nonce, i) {
    var c = new Uint8Array(nonce), add = i * TH_BLOCKS, k, v;
    for (k = 15; k >= 8; k--) { v = c[k] + (add % 256); c[k] = v % 256; add = Math.floor(add / 256) + Math.floor(v / 256); }
    return c;
  }
  function thTagInput(nonce, i, ct) {
    var head = new Uint8Array(TH_NONCE + 4);
    head.set(nonce, 0);
    head[16] = (i >>> 24) & 255; head[17] = (i >>> 16) & 255; head[18] = (i >>> 8) & 255; head[19] = i & 255;
    return cat(head, ct);
  }
  function thMacRead() {
    return idbGet(CARRIER_STORE, TH_MAC_ID).then(function (m) {
      var u = m && m.bytes ? new Uint8Array(m.bytes) : null;
      return u && u.length === CARRIER_REGIONS * TH_MAC_HALF ? u : null;
    });
  }
  /* Склад носителя заводится шумом: часть за частью, каждая — своей
     транзакцией, и каждая сперва спрашивает, нет ли уже печатей (их кладёт
     последней та, что завела склад): заведённый склад не перепишется шумом
     поверх чужой записи. Печати — последними. */
  function thEnsure() {
    if (carrierStale) return Promise.reject(new Error("frozen"));
    return thMacRead().then(function (mac) {
      if (mac) return true;
      return idb().then(function (db) {
        if (!db) return false;
        var i = 0;
        function one(id, bytes) {
          return new Promise(function (resolve) {
            var tx;
            try { tx = db.transaction(CARRIER_STORE, "readwrite"); } catch (e) { resolve("fail"); return; }
            var s = tx.objectStore(CARRIER_STORE), seen = false;
            var g = s.get(TH_MAC_ID);
            g.onsuccess = function () { if (g.result && g.result.bytes) { seen = true; return; } s.put({ id: id, bytes: bytes }); };
            tx.oncomplete = function () { resolve(seen ? "seen" : "ok"); };
            tx.onerror = function () { resolve("fail"); };
            tx.onabort = function () { resolve("fail"); };
          });
        }
        function next() {
          if (i >= TH_CHUNKS) return one(TH_MAC_ID, thNoise(CARRIER_REGIONS * TH_MAC_HALF)).then(function (r) { return r !== "fail"; });
          var id = "t" + i; i++;
          return one(id, thNoise(TH_CHUNK)).then(function (r) { if (r === "fail") return false; if (r === "seen") return true; return next(); });
        }
        return next();
      }).then(function (okp) {
        /* Браузер не дал места (приватное окно, полный диск) — склада нет. */
        if (!okp) throw new Error("no-room");
        return true;
      });
    });
  }
  /* Часть i своей половины: печать — ПЕРВОЙ, затем расшифровка. */
  function thOpenChunk(k, r, i, mac) {
    var base = r * TH_MAC_HALF, nonce = mac.subarray(base, base + TH_NONCE);
    var tag = mac.subarray(base + TH_NONCE + i * TH_TAG, base + TH_NONCE + (i + 1) * TH_TAG);
    return idbGet(CARRIER_STORE, thId(r, i)).then(function (v) {
      var ct = v && v.bytes ? new Uint8Array(v.bytes) : null;
      if (!ct || ct.length !== TH_CHUNK) throw new Error("tag");
      return window.crypto.subtle.verify("HMAC", k.mac, tag, thTagInput(nonce, i, ct)).then(function (good) {
        if (!good) throw new Error("tag");
        return window.crypto.subtle.decrypt({ name: "AES-CTR", counter: thCounter(nonce, i), length: 64 }, k.ctr, ct);
      }).then(function (p) { return new Uint8Array(p); });
    });
  }
  function thEmptyDir() { return { v: 1, legacy: 0, items: [] }; }
  /* Опись своей половины; не сходится печать или форма — половина пуста. */
  function thReadDir(k, r, mac) {
    return thOpenChunk(k, r, 0, mac).then(function (p0) {
      var n = ((p0[0] << 24) | (p0[1] << 16) | (p0[2] << 8) | p0[3]) >>> 0;
      if (!n || n > TH_HALF - 4) throw new Error("shape");
      var parts = [p0.subarray(4, Math.min(TH_CHUNK, 4 + n))], got = parts[0].length, i = 1;
      function more() {
        if (got >= n) return Promise.resolve();
        return thOpenChunk(k, r, i, mac).then(function (p) {
          var take = p.subarray(0, Math.min(TH_CHUNK, n - got));
          parts.push(take); got += take.length; i++;
          return more();
        });
      }
      return more().then(function () {
        var dir = JSON.parse(new TextDecoder().decode(cat.apply(null, parts)));
        if (!dir || dir.v !== 1 || !Array.isArray(dir.items)) throw new Error("shape");
        var end = 4 + n;
        dir.items.forEach(function (it) {
          if (!it || typeof it.id !== "string" || !(it.size >= 0) || !(it.off >= end) || it.off + it.size > TH_HALF) throw new Error("shape");
        });
        return dir;
      });
    }).then(null, function () { return null; });
  }
  /* Своя половина: ключи, печати, опись (из памяти, если метка та же). */
  function thLoad(r) {
    if (typeof r !== "number") r = vaultDoor;
    return Promise.all([thKeys(), thMacRead()]).then(function (x) {
      var k = x[0], mac = x[1];
      if (!mac || r < 0) return { k: k, r: r, mac: null, nonce: null, dir: thEmptyDir() };
      var nonce = mac.slice(r * TH_MAC_HALF, r * TH_MAC_HALF + TH_NONCE);
      if (thState && thState.r === r && sameBytes(thState.nonce, nonce)) return { k: k, r: r, mac: mac, nonce: nonce, dir: thState.dir };
      return thReadDir(k, r, mac).then(function (dir) {
        dir = dir || thEmptyDir();
        thState = { r: r, nonce: nonce, dir: dir };
        return { k: k, r: r, mac: mac, nonce: nonce, dir: dir };
      });
    });
  }
  function thFind(dir, id) { for (var i = 0; i < dir.items.length; i++) if (dir.items[i].id === id) return dir.items[i]; return null; }
  function thReadItem(st, it) {
    if (!it.size) return Promise.resolve(new Blob([], { type: it.mime || "" }));
    var first = Math.floor(it.off / TH_CHUNK), last = Math.floor((it.off + it.size - 1) / TH_CHUNK), parts = [], i = first;
    function step() {
      if (i > last) return Promise.resolve(new Blob(parts, { type: it.mime || "" }));
      var ci = i;
      return thOpenChunk(st.k, st.r, ci, st.mac).then(function (p) {
        var a = ci === first ? it.off - ci * TH_CHUNK : 0;
        var b = ci === last ? it.off + it.size - ci * TH_CHUNK : TH_CHUNK;
        parts.push(p.slice(a, b));
        i++;
        return step();
      });
    }
    return step();
  }
  function thUsed(dir) {
    var end = 0;
    dir.items.forEach(function (it) { if (it.off + it.size > end) end = it.off + it.size; });
    if (!dir.items.length) end = 4 + new TextEncoder().encode(JSON.stringify(dir)).length;
    return end;
  }
  /* Раскладка: опись, затем вещи подряд. Места вещей зависят от длины
     описи, длина описи — от мест: считается, пока не сойдётся. */
  function thLayout(items, legacy) {
    var meta = items.map(function (it) { return { id: it.id, name: it.name, mime: it.mime, size: it.size, at: it.at, off: 0 }; });
    var dir = { v: 1, legacy: legacy ? 1 : 0, items: meta }, txt = null, off = 0, guard, k, changed;
    for (guard = 0; guard < 8; guard++) {
      txt = new TextEncoder().encode(JSON.stringify(dir));
      off = 4 + txt.length; changed = false;
      for (k = 0; k < meta.length; k++) { if (meta[k].off !== off) { meta[k].off = off; changed = true; } off += meta[k].size; }
      if (!changed) break;
    }
    var hdr = new Uint8Array(4 + txt.length);
    hdr[0] = (txt.length >>> 24) & 255; hdr[1] = (txt.length >>> 16) & 255; hdr[2] = (txt.length >>> 8) & 255; hdr[3] = txt.length & 255;
    hdr.set(txt, 4);
    return { dir: dir, hdr: hdr, total: off };
  }
  /* Пересобрать половину: опись и вещи — подряд, часть за частью, новой
     меткой. Прежние вещи читаются из прежней половины по частям (в памяти —
     одна часть), новые — из своих Blob. Ответ — шифр и печати частей. */
  function thBuild(st, plan, nonce) {
    var out = { buf: new Uint8Array(TH_CHUNK), pos: 0, j: 0, cts: [], tags: [] };
    var cache = { i: -1, p: null };
    function flush() {
      var plain = out.buf, j = out.j++;
      out.buf = new Uint8Array(TH_CHUNK); out.pos = 0;
      return window.crypto.subtle.encrypt({ name: "AES-CTR", counter: thCounter(nonce, j), length: 64 }, st.k.ctr, plain).then(function (ct) {
        out.cts[j] = ct;
        return window.crypto.subtle.sign("HMAC", st.k.mac, thTagInput(nonce, j, new Uint8Array(ct)));
      }).then(function (tag) { out.tags[j] = new Uint8Array(tag); plain.fill(0); });
    }
    function put(bytes) {
      var off = 0;
      function step() {
        if (off >= bytes.length) return Promise.resolve();
        var n = Math.min(bytes.length - off, TH_CHUNK - out.pos);
        out.buf.set(bytes.subarray(off, off + n), out.pos); out.pos += n; off += n;
        if (out.pos === TH_CHUNK) return flush().then(step);
        return step();
      }
      return step();
    }
    function oldChunk(i) {
      if (cache.i === i) return Promise.resolve(cache.p);
      return thOpenChunk(st.k, st.r, i, st.mac).then(function (p) { if (cache.p) cache.p.fill(0); cache.i = i; cache.p = p; return p; });
    }
    function putOld(it) {
      var pos = it.src.off, end = it.src.off + it.src.size;
      function step() {
        if (pos >= end) return Promise.resolve();
        var i = Math.floor(pos / TH_CHUNK);
        return oldChunk(i).then(function (p) {
          var a = pos - i * TH_CHUNK, b = Math.min(TH_CHUNK, end - i * TH_CHUNK);
          pos = i * TH_CHUNK + b;
          return put(p.subarray(a, b));
        }).then(step);
      }
      return step();
    }
    function putBlob(blob) {
      var pos = 0;
      function step() {
        if (pos >= blob.size) return Promise.resolve();
        var e = Math.min(blob.size, pos + TH_CHUNK);
        return blobBytes(blob.slice(pos, e)).then(function (u) { pos = e; return put(u); }).then(step);
      }
      return step();
    }
    var chain = put(plan.hdr);
    plan.items.forEach(function (it) {
      chain = chain.then(function () { return it.blob ? putBlob(it.blob) : putOld(it); });
    });
    return chain.then(function () {
      function rest() { return out.j < TH_HALF_CHUNKS ? flush().then(rest) : Promise.resolve(); }
      return rest();
    }).then(function () { if (cache.p) cache.p.fill(0); out.buf = null; return out; });
  }
  /* Половина и печати — одной транзакцией; метка сверяется внутри неё. */
  function thCommit(st, nonce, out) {
    if (carrierStale) return Promise.reject(new Error("frozen"));
    return idb().then(function (db) {
      if (!db) throw new Error("no-idb");
      return new Promise(function (resolve, reject) {
        var tx;
        try { tx = db.transaction(CARRIER_STORE, "readwrite"); } catch (e) { reject(e); return; }
        var s = tx.objectStore(CARRIER_STORE), stale = false, base = st.r * TH_MAC_HALF;
        var one = s.get(CARRIER_ID), fenced = false;
        /* Своя половина пишется, только если и своя ячейка мира — та, от
           которой считает сеанс (D-353): иначе вкладка, до которой не дошла
           весть соседей, клала бы вещи после смены слова в другой вкладке.
           Своя печать, которая сейчас ложится, — тоже своя. */
        var mine = st.r === vaultDoor && ownBase ? [ownBase.seal, carrierPendingSeal ? new Uint8Array(carrierPendingSeal) : null] : null;
        one.onsuccess = function () {
          var c = one.result;
          if (c && c.removing) { fenced = true; stale = true; try { tx.abort(); } catch (e) { /* уже закрыта */ } return; }
          if (mine) {
            var sl = c && Array.isArray(c.seal) && c.seal[st.r] ? new Uint8Array(c.seal[st.r]) : null;
            if (!sl || !mine.some(function (x) { return x && sameBytes(sl, x); })) { stale = true; try { tx.abort(); } catch (e) { /* уже закрыта */ } }
          }
        };
        var g = s.get(TH_MAC_ID);
        g.onsuccess = function () {
          if (carrierStale) { stale = true; try { tx.abort(); } catch (e) { /* уже закрыта */ } return; }
          var cur = g.result && g.result.bytes ? new Uint8Array(g.result.bytes) : null;
          if (!cur || cur.length !== CARRIER_REGIONS * TH_MAC_HALF || !st.nonce || !sameBytes(cur.subarray(base, base + TH_NONCE), st.nonce)) {
            stale = true;
            try { tx.abort(); } catch (e) { /* уже закрыта */ }
            return;
          }
          var mac = new Uint8Array(cur), j;
          mac.set(nonce, base);
          for (j = 0; j < TH_HALF_CHUNKS; j++) {
            mac.set(out.tags[j], base + TH_NONCE + j * TH_TAG);
            s.put({ id: thId(st.r, j), bytes: out.cts[j] });
          }
          s.put({ id: TH_MAC_ID, bytes: mac.buffer });
        };
        tx.oncomplete = function () { carrierTell(); resolve(true); };
        tx.onabort = function () { if (stale) resolve(false); else reject(tx.error || new Error("abort")); };
      });
    });
  }
  /* Одна пересборка своей половины: убрать del, добавить add (сколько
     поместится, по порядку), положить extra (переезжающие конверты) и
     поставить отметку legacy. Ответ — { added: [id|null], moved: [id], dir }. */
  function thRewrite(r, op) {
    function go() {
      if (carrierStale) return Promise.reject(new Error("frozen"));
      return thLoad(r).then(function (st) {
        if (!st.mac) throw new Error("no-carrier");
        var keep = st.dir.items.filter(function (it) { return (op.del || []).indexOf(it.id) === -1; })
          .map(function (it) { return { id: it.id, name: it.name, mime: it.mime, size: it.size, at: it.at, src: it }; });
        var items = keep.slice(), added = [], moved = [];
        (op.add || []).forEach(function (a) {
          var cand = items.concat([a]);
          if (thLayout(cand, 0).total <= TH_HALF) { items = cand; added.push(a.id); } else added.push(null);
        });
        (op.extra || []).forEach(function (a) {
          /* Уже в половине (переезд оборвался до уборки конверта) — второй раз не кладётся. */
          if (thFind(st.dir, a.id) || items.some(function (x) { return x.id === a.id; })) { moved.push(a.id); return; }
          var cand = items.concat([a]);
          if (thLayout(cand, 0).total <= TH_HALF) { items = cand; moved.push(a.id); }
        });
        var legacy = op.legacyIfAll ? (moved.length === (op.extra || []).length ? 1 : 0)
          : (typeof op.legacy === "number" ? op.legacy : st.dir.legacy);
        var changed = op.force || keep.length !== st.dir.items.length || added.some(Boolean) || moved.length || legacy !== st.dir.legacy;
        if (!changed) return { added: added, moved: moved, dir: st.dir, same: true };
        var plan = thLayout(items, legacy);
        plan.items = items;
        var nonce = randBytes(TH_NONCE);
        return thBuild(st, plan, nonce).then(function (out) {
          return thCommit(st, nonce, out).then(function (done) {
            out.cts = null;
            /* Половину переписали в другой вкладке после того, как эта её
               прочла: отказ и заморозка, без повтора (D-353). */
            if (!done) {
              thState = null;
              throw new Error("stale");
            }
            thState = { r: st.r, nonce: nonce, dir: plan.dir };
            return { added: added, moved: moved, dir: plan.dir };
          });
        });
      });
    }
    return go();
  }
  /* Ждущие вещи — одной пересборкой (D-352: «несколько вещей, принесённых
     разом, ложатся одной пересборкой»). */
  function thQueue(kind, payload) {
    return new Promise(function (resolve) {
      if (!thPend) {
        var p = thPend = { add: [], del: [], force: false };
        thingsQueue(function () {
          if (thPend === p) thPend = null;
          return thRun(p);
        });
      }
      if (kind === "add") thPend.add.push({ item: payload, done: resolve });
      else if (kind === "del") thPend.del.push({ id: payload, done: resolve });
      else { thPend.force = true; thPend.add.push({ item: null, done: resolve }); }
    });
  }
  function thRun(p) {
    var room = true;
    var adds = p.add.filter(function (a) { return a.item; });
    var finish = function (res) {
      p.add.forEach(function (a) {
        if (!a.item) { a.done(res ? res.ms : null); return; }
        var k = adds.indexOf(a), id = res ? res.added[k] : null;
        if (!id) thWhy = res ? "full" : (room ? "fail" : "nostore");
        a.done(id || null);
      });
      p.del.forEach(function (d) { d.done(!!res && !thFind(res.dir, d.id)); });
    };
    if (!vaultOpen || vaultDoor < 0) {
      p.add.forEach(function (a) { a.done(null); });
      p.del.forEach(function (d) { d.done(false); });
      thWhy = "closed";
      return Promise.resolve();
    }
    var t0 = (window.performance || Date).now();
    return thEnsure().then(null, function (e) { room = false; throw e; }).then(function () {
      return thRewrite(vaultDoor, { add: adds.map(function (a) { return a.item; }), del: p.del.map(function (d) { return d.id; }), force: p.force });
    }).then(function (res) {
      res.ms = Math.max(1, Math.round((window.performance || Date).now() - t0));
      finish(res);
    }, function (e) {
      /* Отказ сверкой не говорит, сменились ли полномочия: сверяются тут же,
         только чтением (staleProbe), — весть соседей могла не дойти. */
      if (e && e.message === "stale") { carrierStaleNow("records"); staleProbe(); }
      if (carrierStale) { thWhy = "frozen"; finish(null); thWhy = "frozen"; return; }
      if (window.console) console.error("[vault] things write failed", e);
      finish(null);
    });
  }
  /* Пустышка того же веса, что конверт этой вещи (sealBytes, D-265). */
  function thDecoyLen(rec) {
    if (rec.sealed && rec.box) return rec.box.size;
    var meta = new TextEncoder().encode(JSON.stringify({ name: rec.name, mime: rec.mime, size: rec.size, at: rec.at }));
    var total = 4 + 2 + meta.length + (rec.blob ? rec.blob.size : 0);
    return 16 + 12 + Math.ceil(total / THING_BLOCK) * THING_BLOCK + 16 + 64;
  }
  function thDecoy(rec) {
    var n = thDecoyLen(rec), parts = [], off;
    for (off = 0; off < n; off += TH_CHUNK) parts.push(thNoise(Math.min(TH_CHUNK, n - off)));
    return { id: rec.id, sealed: 3, box: new Blob(parts, { type: "application/octet-stream" }) };
  }
  /* Прежние вещи этого мира в складе «things»: открытые (оставленные
     выпусками до v144) — всегда; конверты — пока опись не отметила, что
     переезд прошёл (legacy). Ответ — [{ id, blob, name, mime, size, at, rec }]. */
  function thLegacy(ks, onlyKnown, withSealed) {
    var known = null;
    if (onlyKnown) { known = []; mem.forEach(function (v) { if (v != null) known.push(String(v)); }); known = known.join("\n"); }
    return idbAll("things").then(function (list) {
      var out = [];
      return list.reduce(function (chain, rec) {
        return chain.then(function () {
          if (!rec || !rec.id) return null;
          if (!rec.sealed && rec.blob) {
            if (known !== null && known.indexOf(String(rec.id)) === -1) return null;
            out.push({ id: rec.id, blob: rec.blob, name: rec.name, mime: rec.mime, size: rec.size || rec.blob.size || 0, at: rec.at || 0, rec: rec });
            return null;
          }
          if (!withSealed || !rec.sealed || !ks) return null;
          return thingFromSealed(ks, rec).then(function (p) {
            out.push({ id: p.id, blob: p.blob, name: p.name, mime: p.mime, size: p.blob.size, at: p.at || 0, rec: rec });
          }, function () { return null; });
        });
      }, Promise.resolve()).then(function () { return out; });
    });
  }
  /* Склада нет — открытые вещи этого мира запечатываются конвертами, как до
     D-352: под замком не остаётся открытым ничего (D-265). Ответ — сколько. */
  function thSealPlain(ks, onlyKnown) {
    /* Читающая и замёрзшая вкладки склада вещей не трогают вовсе. */
    if (carrierStale) return Promise.resolve(0);
    var known = null;
    if (onlyKnown) { known = []; mem.forEach(function (v) { if (v != null) known.push(String(v)); }); known = known.join("\n"); }
    var n = 0;
    return idbAll("things").then(function (list) {
      return list.reduce(function (chain, rec) {
        return chain.then(function () {
          if (!rec || rec.sealed || !rec.blob) return null;
          if (known !== null && known.indexOf(String(rec.id)) === -1) return null;
          n++;
          return thingToSealed(ks, rec).then(function (sealed) { return idbPut("things", sealed); });
        });
      }, Promise.resolve());
    }).then(function () { return n; }, function () { return n; });
  }
  var thNoStoreSaid = false;
  function surfaceThingsNoStore() {
    if (thNoStoreSaid) return;
    thNoStoreSaid = true;
    var tr = window.sbT || function (k) { return k; };
    if (typeof window.showToast === "function") {
      try { window.showToast(tr("lock.thingsNoStoreTitle"), String(tr("lock.thingsNoStoreBody")).replace("{mb}", String(Math.round(TH_CHUNKS * TH_CHUNK / 1048576))), "", true, "toast-warn", "event"); } catch (e) { /* ignore */ }
    }
  }
  function surfaceThingsLeft(n) {
    if (!n) return;
    var tr = window.sbT || function (k) { return k; };
    if (typeof window.showToast === "function") {
      try { window.showToast(tr("lock.thingsLeftTitle"), String(tr("lock.thingsLeftBody")).replace("{n}", String(n)), "", true, "toast-warn", "event"); } catch (e) { /* ignore */ }
    }
  }
  /* Вход словом: склад заводится, если его нет (замок v177), и прежние вещи
     этого мира переезжают в его половину. */
  function thOnOpen(ks, onlyKnown) {
    thK = null; thState = null;
    if (carrierStale) return Promise.resolve(null);
    return thingsQueue(function () {
      return thEnsure().then(function () { return thLoad(vaultDoor); }).then(function (st) {
        if (!st.mac) return null;
        /* Переезд прежних конвертов в склад (и отметка о нём) — запись общего:
           только доказанному писателю (A1). Без Web Locks вещь читается из
           конверта как есть. */
        if (writeRight !== "lock") return null;
        return thLegacy(ks, onlyKnown, !st.dir.legacy).then(function (cands) {
          if (!cands.length) {
            if (st.dir.legacy) return null;
            /* Конвертов этого мира нет — отметка ставится, только если в складе
               «things» вообще что-то лежит: иначе проверять и так нечего. */
            return idbAll("things").then(function (all) {
              if (!all.some(function (x) { return x && x.sealed; })) return null;
              return thRewrite(vaultDoor, { legacy: 1 });
            });
          }
          return thRewrite(vaultDoor, { extra: cands, legacyIfAll: true }).then(function (res) {
            var left = cands.filter(function (c) { return res.moved.indexOf(c.id) === -1; });
            var swap = cands.filter(function (c) { return res.moved.indexOf(c.id) !== -1; });
            return swap.reduce(function (chain, c) {
              return chain.then(function () { return idbPut("things", thDecoy(c.rec)); });
            }, Promise.resolve()).then(function () {
              /* Не поместившиеся открытые — запечатываются, как прежде (D-265). */
              return left.reduce(function (chain, c) {
                return chain.then(function () { if (c.rec.sealed) return null; return thingToSealed(ks, c.rec).then(function (s) { return idbPut("things", s); }); });
              }, Promise.resolve());
            }).then(function () { surfaceThingsLeft(left.length); });
          });
        });
      }).then(null, function (e) {
        if (window.console) console.error("[vault] things open failed", e);
        /* Склада нет — прежние открытые вещи всё равно не остаются открытыми. */
        return thSealPlain(ks, onlyKnown).then(function () { if (e && e.message === "no-room") surfaceThingsNoStore(); });
      });
    });
  }
  /* Поворот ключа: открытые вещи — в половину главного мира, сколько
     поместится; остальные — конвертами, и это сказано вслух. Вызывается,
     пока мастер ещё в памяти сеанса (до закрытия). */
  function thAtLock(ks) {
    thK = null; thState = null;
    if (carrierStale) return Promise.resolve(null);
    return thingsQueue(function () {
      return thEnsure().then(function () { return idbAll("things"); }).then(function (list) {
        var plain = list.filter(function (rec) { return rec && !rec.sealed && rec.blob; })
          .map(function (rec) { return { id: rec.id, blob: rec.blob, name: rec.name, mime: rec.mime, size: rec.size || rec.blob.size || 0, at: rec.at || 0, rec: rec }; });
        plain.sort(function (a, b) { return (a.at || 0) - (b.at || 0); });
        return thRewrite(vaultDoor, { extra: plain, legacyIfAll: true, force: true }).then(function (res) {
          var left = plain.filter(function (c) { return res.moved.indexOf(c.id) === -1; });
          return plain.reduce(function (chain, c) {
            return chain.then(function () {
              if (res.moved.indexOf(c.id) !== -1) return idbDel("things", c.id);
              return thingToSealed(ks, c.rec).then(function (s) { return idbPut("things", s); });
            });
          }, Promise.resolve()).then(function () { surfaceThingsLeft(left.length); });
        });
      }).then(function () { return true; }, function (e) {
        if (window.console) console.error("[vault] things lock failed", e);
        /* Склада нет — вещи запираются конвертами, как до D-352, и это сказано. */
        return thSealPlain(ks, false).then(function () { if (e && e.message === "no-room") surfaceThingsNoStore(); return false; });
      });
    });
  }
  /* Снятие замка: вещи открытого мира — открытыми в склад «things». */
  function thMacPatch(r, half) {
    if (carrierStale) return Promise.resolve(false);
    return idb().then(function (db) {
      if (!db) return false;
      return new Promise(function (resolve) {
        var tx, st, g, wrote = false;
        try { tx = db.transaction(CARRIER_STORE, "readwrite"); st = tx.objectStore(CARRIER_STORE); g = st.get(TH_MAC_ID); } catch (e) { resolve(false); return; }
        g.onsuccess = function () {
          if (carrierStale || !g.result || !g.result.bytes) return;
          var m = new Uint8Array(g.result.bytes);
          if (m.length !== CARRIER_REGIONS * TH_MAC_HALF) return;
          m = new Uint8Array(m);
          m.set(half, r * TH_MAC_HALF);
          st.put({ id: TH_MAC_ID, bytes: m.buffer });
          wrote = true;
        };
        tx.oncomplete = function () { if (wrote) carrierTell(); resolve(wrote); };
        tx.onabort = function () { resolve(false); };
      });
    });
  }
  function thUnpack() {
    return thingsQueue(function () {
      return thLoad(vaultDoor).then(function (st) {
        if (!st.mac) return true;
        return st.dir.items.reduce(function (chain, it) {
          return chain.then(function () { return thReadItem(st, it); }).then(function (blob) {
            return idbPut("things", { id: it.id, blob: blob, name: it.name, mime: it.mime, size: it.size, at: it.at });
          });
        }, Promise.resolve()).then(function () { return true; });
      }).then(null, function (e) { if (window.console) console.error("[vault] things unpack failed", e); return false; });
    });
  }
  /* Половина другого мира — в шум (снятие второго слова, новый второй мир,
     код со вторым ключом): ключ её мира уже стёрт вместе с ячейкой, а шум
     делает стирание настоящим и для того, у кого осталась копия того ключа. */
  function thWipe(r) {
    if (carrierStale) return Promise.resolve(false);
    return thingsQueue(function () {
      return thMacRead().then(function (mac) {
        if (!mac) return true;
        var i = 0;
        function next() {
          if (i >= TH_HALF_CHUNKS) return Promise.resolve();
          var id = thId(r, i); i++;
          return idbPut(CARRIER_STORE, { id: id, bytes: thNoise(TH_CHUNK) }).then(next);
        }
        /* Печати половины r — заменой в той же транзакции, где прочитаны
           (D-353): печати другой половины, записанные другой вкладкой в
           этот миг, не откатываются. */
        return next().then(function () { return thMacPatch(r, new Uint8Array(thNoise(TH_MAC_HALF))); });
      }).then(function () { return true; }, function () { return false; });
    });
  }

  /* Уход и скрытие: сперва поздняя щель (миллисекунды), затем полная
     печать (успеет — хорошо). Модули, что пишут своё в том же миг ухода
     позже, попадают в щель сами (см. carrierDirty). */
  window.addEventListener("pagehide", function (ev) {
    leaving = true;
    carrierLateNow();
    /* Уходит в кеш истории: держит ли браузер там право писателя, не сказано
       ни одним стандартом — отложенная щель после этого мига не пишется. */
    if (ev && ev.persisted) lateSuspended = true;
    carrierFlushNow();
  });
  window.addEventListener("pageshow", function (ev) {
    leaving = false;
    /* Вернулась из кеша истории: держит ли браузер ещё право писателя, не
       сказано ни одним стандартом — вкладка не пишет, назад — «Перечитать». */
    if (ev && ev.persisted && vaultOpen) carrierStaleNow("records");
    else lateSuspended = false;
  });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") { leaving = true; carrierLateNow(); carrierFlushNow(); }
    else leaving = false;
  });

  window.sbVault = {
    available: vaultAvailable,
    isLocked: vaultLocked,
    isOpen: function () { return vaultOpen; },
    /* Заморожена ли вкладка (D-353): null — нет; "records" — мир сохранили в
       другой вкладке; "auth" — там сменили то, чем он открывается. */
    frozen: function () { return carrierStale; },
    /* Право записи сеанса (D-353, шаг 4): "lock" — писатель ячейки (Web
       Lock), "cas" — Web Locks нет, запись только сравнением-и-заменой,
       false — только чтение; null — мир не открыт. */
    writer: function () { return vaultOpen ? (carrierStale ? false : writeRight) : null; },
    /* Запись замка исчезла, сменилась или появилась под вкладкой: её
       память старше лежащего, она не пишет ничего (D-353, шаг 4). */
    lost: function () { return lockLost(); },
    /* Стирать хранилище при замке вправе только писатель открытого мира. */
    mayErase: function () { return mayErase(); },
    eraseAll: function () { return eraseAllStores(); },
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
      return sealPair(vaultKeys, "backup", text, "backup");
    },
    openSealed: function (envelope) {
      if (!vaultOpen || !vaultKeys) return Promise.reject(new Error("closed"));
      return openPair(vaultKeys, envelope, "backup").then(function (p) { return p.value; });
    },
    /* Чем именно заперто — не тайна: тайна это ключ, а не имя шифра. */
    cipher: function () {
      var rec = lockRecord();
      if (!rec) return { v: 3, kdf: ["PBKDF2-SHA512:" + KDF1_ITER, "PBKDF2-SHA256:" + KDF2_ITER].concat(todayA2() ? [a2Label(todayA2())] : []),
        ciphers: ["AES-256-CTR", "AES-256-CTR"], mac: "HMAC-SHA-512", carrier5: CARRIER_REGIONS * CARRIER_REGION };
      return rec;
    },

    /* Повернуть ключ. Слова уходят в ячейку носителя, открытые значения стираются из
       хранилища и из памяти разом: оставить их «на всякий случай» значило бы
       не запереть ничего. */
    lock: function (password, duressPassword, secondKeyFile) {
      var nl = noLocksRefusal(); if (nl) return nl;   /* без Web Locks — отказ, записи нет (A1) */
      if (carrierStale) return Promise.reject(new Error("frozen"));   /* замёрзшая вкладка не пишет (D-353) */
      if (!vaultAvailable()) return Promise.reject(new Error("no-subtle"));
      if (String(password || "").length < 4) return Promise.reject(new Error("short"));
      if (vaultLocked()) return Promise.reject(new Error("already"));
      if (lostNow()) return Promise.reject(new Error("frozen"));
      /* Один поворот за раз и в этой вкладке: sealing, pending и тишина у
         сеанса одни (разбор №5). */
      if (turning) return Promise.reject(new Error("busy"));
      turning = true;
      /* laid — запись замка легла (Р-A5.2): после неё отказ «ничего не
         изменено» — неправда. sealedWith — ключи мира нового замка. */
      var laid = false, sealedWith = null, sealedKvNow = null;
      /* Сеанс поворота закрывается: ключи выброшены, память пуста. */
      var shut = function () {
        cache.clear();
        mem.clear();
        vaultKeys = null;
        carrierKeys = null;
        carrierWordSlot = null;
        codeBox = null;
        carrierChanged.clear();
        thK = null; thState = null;
        vaultDoor = -1;
        vaultRole = -1;
        ownBase = null;
        dropMaster();
        vaultOpen = false;
        sealing = false;
        pending.clear();
        pendDisk.clear();
        bumpEpoch("lock");
        if (window.sbBus && window.sbBus.emit) window.sbBus.emit("vault:change", { locked: true, open: false });
      };
      /* Хвост поворота — правки, легшие после записи замка, — в свою ячейку,
         кругами, пока не опустеет; круг — сравнением и заменой от лежащего. */
      var sealTail = function (n) {
        if (!pending.size) return null;
        if (n >= LOCK_SETTLE_ROUNDS) return Promise.reject(new Error("moving"));
        var extra = new Map(pending), base = null;
        return withMaster(function (m) {
          return readOwn(vaultDoor, m, 0).then(function (w) {
            ownCurrent(w, vaultDoor);
            base = w.c;
            extra.forEach(function (v, k) { if (v == null) w.kv.delete(k); else w.kv.set(k, v); });
            return sealRegion(m, carrierWordSlot, null, w.kv, 0, sessionG);
          });
        }).then(function (sealed) {
          var puts = {}; puts[vaultDoor] = sealed;
          return carrierPut(base, puts, null, null).then(function () {
            ownAfter(sealed);
            extra.forEach(function (v, k) { if (pending.has(k) && pending.get(k) === v) pending["delete"](k); });
            return sealTail(n + 1);
          });
        });
      };
      /* ЗАМОК СТОИТ — ЗНАЧИТ, ТАК И СКАЗАТЬ (Р-A5.2, класс A). Запись замка
         легла, а дальше что-то упало (хвост не лёг: ячейка полна, сбой
         IndexedDB). Отказ «ничего не изменено» здесь — неправда, а сброс
         хвоста — потеря. Поэтому: хвост есть — мир нового замка остаётся
         ОТКРЫТЫМ в этой вкладке, правки хвоста — в его памяти и в очереди
         ячейки (повтор сам, как у всякой упавшей записи ячейки), право
         писателя — у вкладки; ответ «kept». Хвоста нет или открыть нечем
         (ключей мира нет) — сеанс закрывается, как после удачного поворота:
         замок стоит, мир за словом; ответ «locked». */
      var keepOpen = function (e) {
        var why = e && e.message;
        var drop = function () { pending.clear(); pendDisk.clear(); sealing = false; };
        if (!pending.size || !sealedWith || vaultDoor < 0 || !carrierKeys) {
          drop();
          shut();
          writerDrop();
          return Promise.reject(new Error("locked"));
        }
        /* ПОКА МИР ОТКРЫВАЕТСЯ ЗАНОВО — ПРАВКИ ВСЁ ЕЩЁ ХВОСТ (финальный обзор
           H1). Мир нового замка открывается не сразу: своя ячейка читается и
           расшифровывается. Всё это время запись замка стоит, а мир ещё не
           открыт: сбрось здесь sealing — и граница хранилища выбросила бы
           правку этого окна молча («запертое не перезаписывается»), а
           открытие мира затёрло бы ещё не сброшенную правку прежним значением
           ячейки. Поэтому хвост копится до самого открытия; очередь записи
           сбрасывается в него; и только тогда хвост ложится в открытый мир. */
        return withMaster(function (m) { return readOwn(vaultDoor, m, 0); }).then(function (w) {
          ownCurrent(w, vaultDoor);
          return w.kv;
        }, function () { return new Map(sealedKvNow || []); }).then(function (kv) {
          try { flush(); } catch (e2) { /* очередь записи — как получится; хвост ниже */ }
          var extra = new Map(pending);
          drop();
          extra.forEach(function (v, k) { if (v == null) kv["delete"](k); else kv.set(k, v); });
          writeRight = heldLock && heldLock.world ? "lock" : "cas";
          adoptWorld(sealedWith, kv);
          extra.forEach(function (v, k) { carrierChanged.add(k); });
          if (!carrierTimer) carrierTimer = setTimeout(carrierFlushNow, CARRIER_QUIET_MS * 4);
          if (why === "full") surfaceCarrierFull();
          throw new Error("kept");
        }).then(null, function (e3) {
          if (sealing) drop();
          throw e3;
        });
      };
      /* Поворот ключа — запись: только писатель (D-353, разбор №3). Две
         вкладки разом поворачивать ключ не могут: вторая получает отказ, а не
         переписывает запертое первой пустым; правки, сделанные, пока
         собиралась ячейка, ложатся под тем же правом. Без Web Locks то же
         сторожит сверка внутри записи носителя (buildLock). Право
         отпускается, когда поворот кончился: сеанс закрыт. */
      return writerTake().then(function (right) {
        if (right === false) throw new Error("writer");
        if (vaultLocked() || lostNow()) throw new Error("already");
        flush();
        /* Флаг поднимается СИНХРОННО, до первого await самого поворота (право
           уже взято): система продолжает жить и писать — до записи замка на
           диск открытыми (замка ещё нет; сходимость их запечатает), после
           неё — в pending (хвост поворота, см. sealTail). */
        sealing = true;
        pending.clear();
      }).then(function () {
        /* Сбор — в тишине: остальные вкладки замолкают перед самым сбором,
           после растяжки (см. «ПОВОРОТ КЛЮЧА — В ТИШИНЕ»). */
        var collect = function () { return lockQuiet().then(collectNow); };
        var rawAt = new Map();
        var collectNow = function () {
          var m = new Map();
          rawAt = new Map();
          pendDisk.clear();
          protectedKeysNow().forEach(function (k) { var v = rawStore.get.call(window.localStorage, k); if (v != null) { m.set(k, v); rawAt.set(k, v); } });
          pending.forEach(function (v, k) { if (v == null) m.delete(k); else m.set(k, v); });
          pending.clear();
          var out = [];
          m.forEach(function (v, k) { out.push({ k: k, v: v }); });
          return out;
        };
        /* ВКЛАДКА, ОТКРЫТАЯ ПОСРЕДИ ПОВОРОТА (классификация границ, Г9-3).
           Тишина просится у тех, кто есть; вкладка, открытая после просьбы,
           пишет открыто, пока не ляжет запись замка. Стирать собранное по
           имени значило бы стереть и её запись, новее собранной, — в ячейке
           осталось бы старое. Поэтому в том же шаге, что легла запись замка,
           каждая открытая запись сверяется с тем, что лежало при сборе:
           совпала — уходит; другая, новая или стёртая — уходит с диска и
           ложится в мир тем же поворотом, как своё отложенное. Ключ, который
           писали обе вкладки, — по времени: своё отложенное помнит, что
           лежало на диске в миг своей записи (pendDisk); диск с тех пор
           другой — значит, та вкладка писала позже, и прав диск. Запись,
           дошедшая из другого процесса браузера позже этого шага, остаётся
           границей задержки localStorage (Г3). */
        collect.lay = function () {
          var seen = {};
          var later = function (k, v) {
            if (pending.has(k) && pendDisk.has(k)) return pendDisk.get(k) !== v;
            return !rawAt.has(k) ? v !== null : rawAt.get(k) !== v;
          };
          protectedKeysNow().forEach(function (k) {
            var v = rawStore.get.call(window.localStorage, k);
            seen[k] = true;
            if (later(k, v)) pending.set(k, v);
            rawStore.del.call(window.localStorage, k);
          });
          rawAt.forEach(function (v, k) { if (!seen[k] && later(k, null)) pending.set(k, null); });
        };
        /* Сходимость до записи замка (Р-A5.2, см. buildLock): что лежит на
           диске сейчас — то ли, что в ячейке. Не то — ответ: что лежит (его
           и печатать); то — null, и «что лежало при сборе» становится тем,
           что лежит: шаг записи замка стирает ровно запечатанное. До записи
           замка правки идут на диск открытыми (замка ещё нет), поэтому обрыв
           в любой миг поворота их не теряет. */
        collect.drift = function (sealedKv) {
          var now = new Map(), same;
          protectedKeysNow().forEach(function (k) { var v = rawStore.get.call(window.localStorage, k); if (v != null) now.set(k, v); });
          same = now.size === sealedKv.size;
          if (same) now.forEach(function (v, k) { if (sealedKv.get(k) !== v) same = false; });
          if (!same) return now;
          rawAt = new Map(now);
          pendDisk.clear();
          sealedKvNow = sealedKv;
          return null;
        };
        collect.laid = function () { laid = true; };
        return buildLock(password, collect, null, duressPassword, secondKeyFile).then(function (ks) {
          sealedWith = ks;
          /* Вещи уходят в склад носителя ТЕМ ЖЕ поворотом ключа (D-352; не
             поместившееся — конвертами, D-265), и старые открытые снимки
             вычищаются: замок держит весь диск. */
          return thAtLock(sealedWith).then(function () { return purgeDiskLeaks(); });
        }).then(function () {
          /* Хвост поворота: что система записала после записи замка (уже
             только в память, pending), — в свою ячейку, пока не опустеет. */
          return sealTail(0);
        }).then(function () {
          /* ── ЗАПЕР — ЗНАЧИТ ЗАПЕРТО, С ЭТОГО ЖЕ МИГА ──────────────────────
             Поворот ключа ЗАКРЫВАЕТ сеанс: ключи выброшены, память пуста, на
             диск защищённое не идёт вовсе. Дальше — только дверь с паролем. */
          shut();
          return true;
        });
      }).then(function (r) { turning = false; writerDrop(); return r; }, function (e) {
        turning = false;
        /* Запись замка легла — не «не вышло» (Р-A5.2): см. keepOpen. */
        if (laid) return keepOpen(e);
        /* Поворот не состоялся: накопленное за него ложится открытым, как
           легло бы без поворота, — если замка так и нет (своей записи замка
           нет — значит, и ячеек этой вкладки нет). */
        if (sealing) {
          sealing = false;
          if (!vaultLocked() && !lostNow()) pending.forEach(function (v, k) { try { if (v == null) rawStore.del.call(window.localStorage, k); else rawStore.set.call(window.localStorage, k, v); } catch (e2) { /* ignore */ } });
          pending.clear();
        }
        writerDrop();
        throw e;
      });
    },

    /* Открыть на сеанс. Расшифрованное кладётся в ПАМЯТЬ (кэш sbDB), а не
       обратно в хранилище: иначе первое же открытие отменило бы замок. */
    unlock: function (password, secondKeyFile) {
      /* ЗАМЁРЗШАЯ ВКЛАДКА НЕ ВХОДИТ ЗАНОВО НА МЕСТЕ (D-353). Даже верным, даже
         новым словом: в её памяти сеанса — отложенное и прочитанное до чужой
         записи, и вход поверх него дал бы старому новое право записи. Назад —
         только «Перечитать»: перезагрузка, свежее чтение, новое право. */
      /* Запись замка исчезла, сменилась или появилась под вкладкой (снятие,
         стирание или поворот ключа в другой вкладке): вход — перезагрузка, а
         не «открыто» на любое слово поверх памяти, которая старше лежащего. */
      if (lockLost()) { try { window.location.reload(); } catch (e) { /* ignore */ } return Promise.resolve(false); }
      /* Замёрзшая вкладка у двери отвечает «нет» и верному слову: тот же
         ответ, что неверному, а выход один — «Перечитать» (стоящее сообщение
         говорит это). */
      if (carrierStale) return Promise.resolve(false);
      var rec = lockRecord();
      if (!rec) return Promise.resolve(true);
      /* Ключ устройства спрашивается дверью ДО слова (hwAsk) — здесь его ответ
         уже лежит в памяти сеанса; без ответа ключ просто не выведется. */
      if (!vaultAvailable()) return Promise.resolve(false);
      /* Замок самого первого вида переезжает записью — только писатель. Без
         права ответ тот же, что на неверное слово (право берётся до проверки
         слова: ответ о слове не говорит ничего). Не вошли — право отпущено. */
      if (rec.v === 1) {
        return writerTake().then(function (right) {
          /* Без Web Locks переезд не доказан одним писателем — ответ тот же,
             что на неверное слово (A1). */
          if (right !== "lock") return false;
          return migrateV1(password, rec, right).then(function (okp) {
            if (!okp && right === "lock" && !vaultOpen) writerDrop();
            return okp;
          }, function () {
            if (right === "lock" && !vaultOpen) writerDrop();
            return false;
          });
        });
      }
      /* Верно ли слово, отвечают печати ячеек (и прежние двери, пока замок не
         переехал целиком): считаются ВСЕ, всегда — см. openWorlds. */
      return openWorldsAny(rec, password, secondKeyFile).then(function (hit) {
        /* Открытая система другим миром не открывается (D-349): замер цены и
           любые пробы идут мимо, а слово чужого мира — «неверно». Номер мира
           сеанса ставится ТОЛЬКО здесь и только удачным входом. */
        if (hit && vaultOpen && hit.role !== vaultRole) { hit.m.fill(0); hit = null; }
        if (!hit) throw new Error("wrong");
        if (vaultOpen) { hit.m.fill(0); return true; }
        /* Право писателя — после верного слова: неверное слово (и замер цены
           попытки) права не трогает. Мир, прочитанный до права, сверяется
           заново при входе (enterWorld). */
        return writerTake().then(function (right) {
          return enterWorld(hit, right).then(null, function (e) {
            /* Вход не состоялся — взятое право отпускается. */
            if (right === "lock" && !vaultOpen) writerDrop();
            throw e;
          });
        });
      }).then(function () { return rememberWord(password); }).then(function () { return true; }, function () { return false; });
    },

    /* Снять замок совсем: слова возвращаются в хранилище открытыми. Требует
       пароля — снять замок должен тот, кто его ставил. */
    remove: function (password, secondKeyFile) {
      var nl = noLocksRefusal(); if (nl) return nl;   /* без Web Locks — отказ, записи нет (A1) */
      if (carrierStale) return Promise.reject(new Error("frozen"));   /* замёрзшая вкладка не пишет (D-353) */
      var rec = lockRecord();
      if (!rec) return Promise.resolve(true);
      /* ПРАВО И ПОРЯДОК — см. «СНЯТИЕ ЗАМКА: ПРАВО, ПОРЯДОК, ОБРЫВ» выше.
         Снимает только писатель (D-353, шаг 4). У закрытой системы вкладка
         сперва входит верным словом — вход сам берёт право писателя (или
         открывает мир только на чтение), — и право сверяется после входа. */
      if (removingNow || lostNow() || (vaultOpen && !mayErase())) return Promise.reject(new Error("writer"));
      /* Без Web Locks снять нельзя вовсе — и мир ради отказа не открывается
         (разбор №6). */
      if (!LOCKS) return Promise.reject(new Error("writer"));
      var wasClosed = !vaultOpen;
      var by = hexOf(randBytes(16)), fenced = null, plain = null, kv = {}, sealed = [], cut = false;
      var still = function () { return !carrierStale && !!heldLock && !!heldLock.world; };
      /* Снятие не состоялось — накопленное за переход возвращается в мир. */
      var unCut = function () {
        if (!cut) return;
        cut = false; removalCut = false;
        pending.forEach(function (v, k) { mem.set(k, v); carrierChanged.add(k); });
        pending.clear();
      };
      return enterOrConfirm(password, secondKeyFile).then(function (door) {
        if (door < 0) return -1;
        if (!mayErase()) throw new Error("writer");
        /* Только что вошли — поздняя щель прежнего писателя могла ещё не
           дойти до этой вкладки (кеш localStorage на процесс): та же мера, что
           и после входа, и сверка щели (разбор №6). */
        return (wasClosed ? new Promise(function (r) { setTimeout(r, HEAL_SETTLE_MS); }) : Promise.resolve()).then(function () {
          if (lateDrift()) { carrierStaleNow("records"); throw new Error("stale"); }
          return door;
        });
      }).then(function (door) {
        if (door < 0) return null;
        /* Слово подтверждено. С этого мига своя печать по окну не идёт —
           правки ОСТАЮТСЯ в очереди (уйдут открытыми или лягут печатью при
           откате), а отказы от своего забора не замораживают. */
        removingNow = true;
        if (carrierTimer) { clearTimeout(carrierTimer); carrierTimer = null; }
        var r0 = vaultDoor;
        return withMaster(function (m) { return readOwn(r0, m, vaultRole); }).then(function (w) {
          try { ownCurrent(w, r0); } catch (e) { removingNow = false; carrierStaleNow(e.message === "stale-auth" ? "auth" : "records"); return null; }
          return w.c;
        }, function () { removingNow = false; carrierStaleNow("auth"); return null; });
      }).then(function (base) {
        if (!base || !still()) return null;
        /* (1) забор: сравнение-и-замена обеих ячеек. */
        return carrierCommit(base, [0, 1], function (next) { next.removing = { by: by }; }).then(function (n) {
          fenced = n;
          return true;
        }, function () { return null; });
      }).then(function (okp) {
        if (!okp || !still()) return false;
        /* (2) вещи открытыми — в памяти, без единой записи. */
        sealed = sealedNamesNow();
        return thPlainAll(vaultKeys).then(function (p) { plain = p; return true; });
      }).then(function (okp) {
        if (!okp || !still()) return false;
        /* Снимок записей и начало перехода — в одной задаче: правки после
           этого мига копятся (removalCut) и лягут открытыми вместе со снятием. */
        mem.forEach(function (v, k) { if (v != null) kv[k] = v; });
        pending.clear();
        /* Хватит ли места положить записи открытыми — проверяется ДО (3):
           после (3) ячеек уже нет, и нехватка места на (4) оставила бы мир
           только в переходе (разбор №4). Проба — запись того же размера и
           сразу её стирание. Не хватает — отказ «room», мир прежний. */
        if (!roomForOpen(kv)) throw new Error("room");
        removalCut = true; cut = true;
        /* (3) одна транзакция: сверка обеих ячеек и забора, вещи открытыми,
           склад носителя — в переход «removal». */
        return removalCommit(fenced, by, plain, kv, sealed, seenLock);
      }).then(function (okp) {
        if (!okp) return false;
        /* (4) записи открытыми (и накопленное за переход), запись замка и
           щели — вон; переход (5) унесёт следующая загрузка. */
        carrierChanged.clear();
        vaultOpen = false;
        vaultKeys = null;
        carrierKeys = null;
        thK = null; thState = null;
        vaultDoor = -1;
        vaultRole = -1;
        ownBase = null;
        writeRight = null;
        dropMaster();
        carrierMem = null;
        /* Накопленное за переход ложится открытым поверх — до снятия записи
           замка, в том же шаге. Не легло (место кончилось) — носителя уже
           нет, переход лежит: снятие доведёт следующая загрузка. */
        var extra = new Map(pending);
        pending.clear();
        var laidAll = function () {
          var o = {}, kk2;
          for (kk2 in kv) if (Object.prototype.hasOwnProperty.call(kv, kk2)) o[kk2] = kv[kk2];
          extra.forEach(function (v, key) { if (v == null) delete o[key]; else o[key] = String(v); });
          return o;
        };
        try { removalFinish({ kv: kv, sealed: sealed }, extra); }
        catch (e) {
          /* Не легло — правки перехода уходят в переход (под правом), чтобы
             доведение при загрузке положило и их (разбор №6). */
          removalCut = false; cut = false;
          return removalMark(by, laidAll()).then(function () { writerDrop(); removalSayRoom(); throw new Error("removal-unfinished"); });
        }
        removalCut = false; cut = false;
        /* Запасная копия — ровно то, что легло открытым (с правками перехода):
           доведение после обрыва не вернёт старшего, чем легло (разбор №4).
           Пишется под правом писателя, до того как право отпущено. */
        var laid = laidAll();
        return removalMark(by, laid).then(function () {
          /* Мира нет — нет и права писателя. Но вкладка, снявшая замок, жива
             и пишет открыто: до конца жизни она держит вместо права замок
             своего снятия (Г3-1), и лечение этого перехода нигде не начнётся. */
          return removalHold(by);
        }).then(function () {
          bumpEpoch("remove");
          if (window.sbBus && window.sbBus.emit) window.sbBus.emit("vault:change", { locked: false });
          return true;
        });
      }).then(function (r) {
        if (r === true) { removingNow = false; return true; }
        unCut();
        /* Не дошло до (3) — откат: забор снимает сам снимающий, если не
           замёрз (после конфликта он не пишет — забор снимет лечение под
           правом писателя); очередь правок пишется печатью. */
        var undo = fenced && !carrierStale ? carrierUnfence(by) : Promise.resolve(false);
        return undo.then(function () {
          removingNow = false;
          if (carrierChanged.size && !carrierTimer) carrierTimer = setTimeout(carrierFlushNow, CARRIER_QUIET_MS);
          return false;
        });
      }, function (e) {
        unCut();
        var undo = fenced && !carrierStale && vaultOpen ? carrierUnfence(by) : Promise.resolve(false);
        return undo.then(function () {
          removingNow = false;
          /* Отказ из-за чужой поздней щели — вкладка отстала: заморозка. */
          if (vaultOpen && lateDrift()) carrierStaleNow("records");
          if (vaultOpen && carrierChanged.size && !carrierTimer) carrierTimer = setTimeout(carrierFlushNow, CARRIER_QUIET_MS);
          throw e;
        });
      });
    },

    /* ── КЛЮЧ, КОТОРОГО НИГДЕ НЕТ ────────────────────────────────────────
       Пароль для места не ХРАНИТСЯ, а ВЫВОДИТСЯ: HKDF от мастер-ключа
       хранилища, именем места и счётчиком. Одно и то же место при одном и том
       же счётчике всегда даёт один и тот же пароль — и ни одного байта этого
       пароля нет ни на диске, ни в памяти дольше показа.

       ЧТО ЭТО ДАЁТ. Красть нечего: под замком лежит имя места, а не пароль.
       Терять нечего: новое устройство, то же слово — и все пароли вернулись.
       Синхронизировать нечего: выводится на месте, одинаково везде.

       ЧЕГО НЕ ДАЁТ, и это сказано человеку в самом приложении: пароли,
       заведённые НЕ здесь, вывести нельзя — их приходится хранить, как любую
       запись мира. И если мастер-слово утечёт, утечёт всё разом:
       у выведенных ключей общий корень. Счётчик существует ровно для того,
       чтобы сменить пароль одного места, не трогая остальные.

       Охраняется tools/keys-check.mjs. */
    /* Алфавит отдаётся наружу, чтобы закон СПРАШИВАЛ его, а не помнил:
       список знаков — состав системы, и замораживать его в приборе нельзя. */
    keyAlphabet: function () { return KEY_ALL; },

    siteKey: function (place, counter, length) {
      if (!vaultOpen || !siteBase) return Promise.reject(new Error("closed"));
      var want = Math.max(10, Math.min(64, parseInt(length, 10) || 20));
      var info = new TextEncoder().encode("sys.baby/site/v1/" + String(place) + "#" + (parseInt(counter, 10) || 0));
      /* То же HKDF от того же мастера, что и прежде, — только основание уже
         неизвлекаемый ключ сеанса (D-300): пароли мест не меняются. */
      return window.crypto.subtle.deriveBits(
        { name: "HKDF", hash: "SHA-256", salt: new Uint8Array(0), info: info }, siteBase, 8 * 256)
        .then(function (bits) { return shapeKey(new Uint8Array(bits), want); });
    },

    /* ── ТРЕВОЖНЫЙ ПАРОЛЬ ──────────────────────────────────────────────────
       Второе слово, открывающее ДРУГОЙ мир: свои записи, свой стол, свои
       заметки. Ничто в системе не показывает, что второй мир существует, —
       ни надписью, ни задержкой, ни лишней строкой на диске (см. шапку «Два
       мира, и второй неотличим от пустоты»).

       ПОЧЕМУ ИЗ ТРЕВОЖНОГО МИРА ЭТО НЕ РАБОТАЕТ, И ПОЧЕМУ ОБ ЭТОМ НЕ
       СООБЩАЕТСЯ. Тот, кто вошёл вторым словом, — это либо человек под
       принуждением, либо тот, кто его принуждает. Дать ему переписать щель
       главного мира значило бы отдать ему главный мир. Поэтому вызов из тревожного
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
      var f = factorOf(effRecord());
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
      var nl = noLocksRefusal(); if (nl) return nl;   /* без Web Locks — отказ, записи нет (A1) */
      /* Право писателя — до чтения записи замка и до проверки слова (разбор №7): план строится по тому, что лежит, пока никто другой не пишет; пока пишет другая вкладка — отказ «writer» любому слову. */
      if (carrierStale || lostNow()) return Promise.reject(new Error("frozen"));
      return withWriter(function () {
      if (carrierStale) return Promise.reject(new Error("frozen"));   /* замёрзшая вкладка не пишет (D-353) */
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (factorOf(rec)) return Promise.reject(new Error("already"));
      if (!fileBytes || !fileBytes.length) return Promise.reject(new Error("no-file"));
      var fsalt = new Uint8Array(32);
      window.crypto.getRandomValues(fsalt);
      var fsaltB64 = b64(fsalt);
      var h0 = null, h1 = null;
      var scrub = function (r) { zero(h0 && h0.m, h1 && h1.m); return r; }, scrubErr = function (e) { zero(h0 && h0.m, h1 && h1.m); throw e; };
      return openWorldsAny(rec, password, null).then(ownDoor).then(function (hit) {
        if (!hit) return false;
        if (hit.role !== 0) { zero(hit.m); return true; }        /* из тревожного мира — молча «готово» */
        h0 = hit;
        if (!duressPassword) return null;
        return openWorldsAny(rec, duressPassword, null).then(otherDoor).then(function (h2) {
          if (!h2) return "duress-wrong";
          h1 = h2; return null;
        });
      }).then(function (early) {
        if (early === false || early === true) return early;
        if (early === "duress-wrong") return Promise.reject(new Error("duress-wrong"));
        return withWriter(function () { return ensureCarried(h0).then(function () { return ensureCarried(h1); }).then(function () {
          return factorSecret(fileBytes, fsaltB64);
        }).then(function (fs) {
          return mixFactors(fs, hwNow(rec));
        }).then(function (fsec) {
          return reslotWorlds({ m: h0.m, pw: password, i: h0.i, c: h0.c }, h1 ? { m: h1.m, pw: duressPassword, i: h1.i, c: h1.c } : null, fsec, function (next) {
            next.factor = { kind: "file", salt: fsaltB64 };
          }, rec);
        }); });
      }).then(scrub, scrubErr);
    });
    },
    clearSecondKey: function (password, fileBytes, duressPassword) {
      var nl = noLocksRefusal(); if (nl) return nl;   /* без Web Locks — отказ, записи нет (A1) */
      /* Право писателя — до чтения записи замка и до проверки слова (разбор №7): план строится по тому, что лежит, пока никто другой не пишет; пока пишет другая вкладка — отказ «writer» любому слову. */
      if (carrierStale || lostNow()) return Promise.reject(new Error("frozen"));
      return withWriter(function () {
      if (carrierStale) return Promise.reject(new Error("frozen"));   /* замёрзшая вкладка не пишет (D-353) */
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (!factorOf(rec)) return Promise.resolve(true);
      var h0 = null, h1 = null;
      var scrub = function (r) { zero(h0 && h0.m, h1 && h1.m); return r; }, scrubErr = function (e) { zero(h0 && h0.m, h1 && h1.m); throw e; };
      return openWorldsAny(rec, password, fileBytes).then(ownDoor).then(function (hit) {
        if (!hit) return false;
        if (hit.role !== 0) { zero(hit.m); return true; }
        h0 = hit;
        if (!duressPassword) return null;
        return openWorldsAny(rec, duressPassword, fileBytes).then(otherDoor).then(function (h2) {
          if (!h2) return "duress-wrong";
          h1 = h2; return null;
        });
      }).then(function (early) {
        if (early === false || early === true) return early;
        if (early === "duress-wrong") return Promise.reject(new Error("duress-wrong"));
        /* Снимается файл — ключ устройства остаётся (D-276). */
        return withWriter(function () { return ensureCarried(h0).then(function () { return ensureCarried(h1); }).then(function () {
          return mixFactors(null, hwNow(rec));
        }).then(function (fsecNo) {
          return reslotWorlds({ m: h0.m, pw: password, i: h0.i, c: h0.c }, h1 ? { m: h1.m, pw: duressPassword, i: h1.i, c: h1.c } : null, fsecNo, function (next) {
            delete next.factor;
          }, rec);
        }); });
      }).then(scrub, scrubErr);
    });
    },

    /* ── УСИЛИТЬ ЗАМОК ПАМЯТЬЮ (D-275) ────────────────────────────────────
       Замок, сделанный до D-275, растягивает слово только временем. Здесь
       его ячейки запечатываются заново под цену с памятью (до v177 —
       переделывались двери); мастер-ключ не меняется — меняется лишь то, чем
       он открывается.
       ПОЧЕМУ НЕ МОЛЧА ПРИ ВХОДЕ. Все щели слов замка обязаны быть одной цены
       (D-266): растяжка считается один раз и пробуется на всех. Щель главного
       мира можно переделать словом, которое человек только что ввёл, —
       тревожную нельзя: её слова система не знает. Молчаливое усиление
       убило бы тревожный мир — ровно тот урок D-266. Поэтому усиление —
       действие человека: он вводит слово и, если заводил, тревожное. Без
       тревожного слова вторая ячейка становится шумом, и это сказано в окне
       ДО нажатия. Неверное тревожное слово не принимается: иначе опечатка
       стирала бы мир.
       Из тревожного мира — молча «готово» и ничего не меняется (D-203). */
    strengthen: function (password, duressPassword, secondKeyFile) {
      var nl = noLocksRefusal(); if (nl) return nl;   /* без Web Locks — отказ, записи нет (A1) */
      /* Право писателя — до чтения записи замка и до проверки слова (разбор №7): план строится по тому, что лежит, пока никто другой не пишет; пока пишет другая вкладка — отказ «writer» любому слову. */
      if (carrierStale || lostNow()) return Promise.reject(new Error("frozen"));
      return withWriter(function () {
      if (carrierStale) return Promise.reject(new Error("frozen"));   /* замёрзшая вкладка не пишет (D-353) */
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      var a2 = todayA2();
      if (!a2) return Promise.reject(new Error("no-argon2"));
      var cost = costOf(rec);
      if (cost[2]) return Promise.resolve(true);
      var h0 = null, h1 = null, fsec = null;
      var scrub = function (r) { zero(h0 && h0.m, h1 && h1.m); return r; }, scrubErr = function (e) { zero(h0 && h0.m, h1 && h1.m); throw e; };
      return factorFor(rec, secondKeyFile).then(function (fs) {
        fsec = fs;
        return openWorldsAny(rec, password, secondKeyFile).then(ownDoor);
      }).then(function (hit) {
        if (!hit) return false;
        if (hit.role !== 0) { zero(hit.m); return true; }
        h0 = hit;
        if (!duressPassword) return null;
        return openWorldsAny(rec, duressPassword, secondKeyFile).then(otherDoor).then(function (h2) {
          if (!h2) return "duress-wrong";
          h1 = h2;
          return null;
        });
      }).then(function (early) {
        if (early === false || early === true) return early;
        if (early === "duress-wrong") return Promise.reject(new Error("duress-wrong"));
        return withWriter(function () { return ensureCarried(h0).then(function () { return ensureCarried(h1); }).then(function () {
          return reslotWorlds({ m: h0.m, pw: password, i: h0.i, c: h0.c }, h1 ? { m: h1.m, pw: duressPassword, i: h1.i, c: h1.c } : null, fsec, function (next) {
            next.kdf = ["PBKDF2-SHA512:" + cost[0], "PBKDF2-SHA256:" + cost[1], a2Label(a2)];
          }, rec);
        }); });
      }).then(scrub, scrubErr);
    });
    },
    /* ── КЛЮЧ УСТРОЙСТВА: состояние, вопрос, привязка, снятие (D-276) ───── */
    hwState: function () { var rec = effRecord(); var h = hwOf(rec); return { on: !!h, can: hwAvailable(), synced: h && typeof h.synced === "boolean" ? h.synced : null }; },
    hwAsk: function () { return hwAsk(effRecord()); },
    /* До двери: обрыв питания сразу после замка ведёт к двери (Г8). */
    crashHeal: function () { return crashHeal(); },
    /* Лечить было что, а лечит другая вкладка (или лечение не легло): ждать,
       пока запись замка не появится или право писателя не освободится, — и
       тогда подняться заново (финальный разбор H1, п. 1). Ожидание — не
       замена исключительности: эта вкладка ничего не пишет ни до, ни после;
       ждущий запрос права отпускается в тот же миг, как дан. */
    crashWait: function (storageOnly) {
      return new Promise(function (resolve) {
        var done = false, go = function () { if (!done) { done = true; resolve(true); } };
        try { window.addEventListener("storage", function (ev) { if (ev && (ev.key === null || ev.key === LOCK_KEY)) go(); }); } catch (e) { /* ignore */ }
        if (LOCKS && !storageOnly) { try { LOCKS.request(WRITER_LOCK, { mode: "exclusive" }, function () { go(); return null; }).then(null, function () { /* ignore */ }); } catch (e) { /* ignore */ } }
      });
    },
    /* Требования двери — после свежего чтения носителя (Г5). */
    requirements: function () {
      var rec = lockRecord();
      return (rec && (carrierSize(rec) || rec.doors || rec.wrap || rec.spare) ? carrierRead() : Promise.resolve(null)).then(function () {
        var eff = effRecord();
        return { key: !!factorOf(eff), hw: !!hwOf(eff) };
      });
    },
    hwEnroll: function (password, secondKeyFile, duressPassword) {
      var nl = noLocksRefusal(); if (nl) return nl;   /* без Web Locks — отказ, записи нет (A1) */
      /* Право писателя — до чтения записи замка и до проверки слова (разбор №7): план строится по тому, что лежит, пока никто другой не пишет; пока пишет другая вкладка — отказ «writer» любому слову. */
      if (carrierStale || lostNow()) return Promise.reject(new Error("frozen"));
      return withWriter(function () {
      if (carrierStale) return Promise.reject(new Error("frozen"));   /* замёрзшая вкладка не пишет (D-353) */
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (!vaultOpen) return Promise.reject(new Error("closed"));
      if (hwOf(rec)) return Promise.reject(new Error("already"));
      if (!hwAvailable()) return Promise.reject(new Error("no-webauthn"));
      var prfSalt = new Uint8Array(32), userId = new Uint8Array(16), challenge = new Uint8Array(32);
      window.crypto.getRandomValues(prfSalt); window.crypto.getRandomValues(userId); window.crypto.getRandomValues(challenge);
      var rp = String(location.hostname || "");
      var cred = null, secret = null, fsecOld = null, master0 = null, master1 = null, fromDuress = false;
      var syncedFlag = null;   /* флаг Backup Eligible, снятый ниже (D-310) */
      var scrub = function (r) { zero(master0, master1); return r; }, scrubErr = function (e) { zero(master0, master1); throw e; };
      var h0 = null, h1 = null;
      return factorFor(rec, secondKeyFile).then(function (fo) {
        fsecOld = fo;
        return openWorldsAny(rec, password, secondKeyFile).then(ownDoor);
      }).then(function (hit) {
        if (!hit) return false;
        fromDuress = hit.role !== 0;
        h0 = hit; master0 = hit.m;
        if (fromDuress || !duressPassword) return true;
        return openWorldsAny(rec, duressPassword, secondKeyFile).then(otherDoor).then(function (h2) {
          if (!h2) return "duress-wrong";
          h1 = h2; master1 = h2.m;
          return true;
        });
      }).then(function (st) {
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
          /* ── ПРАВДА О ТОМ, ГДЕ ЖИВЁТ КЛЮЧ (D-310, план Н7) ──────────────────
             Флаг Backup Eligible в данных устройства говорит, МОЖЕТ ЛИ ключ
             копироваться: у ключа-брелока в связке аккаунта (iCloud Keychain,
             Google Password Manager) он поднят, у ключа, привязанного к чипу
             одного устройства, — нет. Мы его читаем один раз, здесь, и
             сохраняем, чтобы подпись у двери не лгала «чип этого телефона» про
             ключ, который на самом деле копируется. Флага нет — не утверждаем
             ни того, ни другого. */
          syncedFlag = null;
          try {
            var adFn = cred && cred.response && cred.response.getAuthenticatorData;
            if (adFn) { var ad = new Uint8Array(cred.response.getAuthenticatorData()); if (ad.length > 32) syncedFlag = (ad[32] & 0x08) !== 0; }
          } catch (e) { syncedFlag = null; }
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
            return withWriter(function () { return ensureCarried(h0).then(function () { return ensureCarried(h1); }).then(function () {
              return reslotWorlds({ m: master0, pw: password, i: h0.i, c: h0.c }, master1 ? { m: master1, pw: duressPassword, i: h1.i, c: h1.c } : null, fsecNew, function (next) {
                next.hw = { kind: "webauthn-prf", id: b64(new Uint8Array(cred.rawId)), salt: b64(prfSalt), rp: rp };
                if (syncedFlag === true) next.hw.synced = true; else if (syncedFlag === false) next.hw.synced = false;
              }, rec);
            }).then(function (okp) {
              hwSecret = secret;
              master0.fill(0); if (master1) master1.fill(0);
              return okp;
            }); });
          });
        });
      }).then(scrub, scrubErr);
    });
    },
    hwRemove: function (password, secondKeyFile, duressPassword) {
      var nl = noLocksRefusal(); if (nl) return nl;   /* без Web Locks — отказ, записи нет (A1) */
      /* Право писателя — до чтения записи замка и до проверки слова (разбор №7): план строится по тому, что лежит, пока никто другой не пишет; пока пишет другая вкладка — отказ «writer» любому слову. */
      if (carrierStale || lostNow()) return Promise.reject(new Error("frozen"));
      return withWriter(function () {
      if (carrierStale) return Promise.reject(new Error("frozen"));   /* замёрзшая вкладка не пишет (D-353) */
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (!hwOf(rec)) return Promise.resolve(true);
      var fsecOld = null, master0 = null, master1 = null, fileSec = null;
      var scrub = function (r) { zero(master0, master1); return r; }, scrubErr = function (e) { zero(master0, master1); throw e; };
      var h0 = null, h1 = null;
      return factorFor(rec, secondKeyFile).then(function (fo) {
        fsecOld = fo;
        return openWorldsAny(rec, password, secondKeyFile).then(ownDoor);
      }).then(function (hit) {
        if (!hit) return false;
        if (hit.role !== 0) { zero(hit.m); return true; }
        h0 = hit; master0 = hit.m;
        if (!duressPassword) return null;
        return openWorldsAny(rec, duressPassword, secondKeyFile).then(otherDoor).then(function (h2) {
          if (!h2) return "duress-wrong";
          h1 = h2; master1 = h2.m; return null;
        });
      }).then(function (early) {
        if (early === false || early === true) return early;
        if (early === "duress-wrong") return Promise.reject(new Error("duress-wrong"));
        var f = factorOf(rec);
        return (f ? factorSecret(secondKeyFile || new Uint8Array(0), f.salt) : Promise.resolve(null)).then(function (fs) {
          fileSec = fs;
          return withWriter(function () { return ensureCarried(h0).then(function () { return ensureCarried(h1); }).then(function () {
            return reslotWorlds({ m: master0, pw: password, i: h0.i, c: h0.c }, master1 ? { m: master1, pw: duressPassword, i: h1.i, c: h1.c } : null, fileSec, function (next) {
              delete next.hw;
            }, rec);
          }).then(function (okp) {
            hwSecret = null;
            master0.fill(0); if (master1) master1.fill(0);
            return okp;
          }); });
        });
      }).then(scrub, scrubErr);
    });
    },

    /* Сделан ли этот замок ценой с памятью — видно в его записи и так. */
    strong: function () { var rec = lockRecord(); return !!(rec && costOf(rec)[2]); },

    setDuress: function (mainPassword, duressPassword, secondKeyFile) {
      var nl = noLocksRefusal(); if (nl) return nl;   /* без Web Locks — отказ, записи нет (A1) */
      if (carrierStale) return Promise.reject(new Error("frozen"));   /* замёрзшая вкладка не пишет (D-353) */
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (String(duressPassword || "").length < 4) return Promise.reject(new Error("short"));
      if (String(duressPassword) === String(mainPassword)) return Promise.reject(new Error("same"));
      return enterOrConfirm(mainPassword, secondKeyFile).then(function (door) {
        if (door < 0) return false;
        if (door !== 0) return true;          /* см. выше: молча и «готово» */
        var m = new Uint8Array(32), seen = null;
        window.crypto.getRandomValues(m);
        return carrierRead().then(function (c) {
          /* От этого носителя считается второй мир (D-353): другая ячейка
             сверится с ним в той же транзакции, что и запись. */
          seen = c;
          if (!c) throw new Error("carrier");
          var eff = withParams(lockRecord() || {}, c && c.params), cost = costOf(eff);
          /* Второй мир — новая ячейка: пустой мир под своим мастером, щель
             слова — ключом второго слова. Прежний второй мир (ячейка или
             дверь) уходит в шум, как уходил всегда. */
          return factorFor(eff, secondKeyFile).then(function (fsec) {
            return deriveWordKeys(duressPassword, saltOf(eff), cost[0], cost[1], fsec, cost[2]);
          });
        }).then(function (k1) {
          /* Второй мир — в ДРУГУЮ ячейку, чем открытый главный. */
          return carrierJob(function () {
            return sealRegion(m, k1.slot, null, new Map(), 1, 0).then(function (sealed) { var puts = {}; puts[1 - vaultDoor] = sealed; return carrierPut(seen, puts, null, null); });
          });
        }).then(function () {
          /* Склад вещей прежнего второго мира — в шум (D-352). */
          return thWipe(1 - vaultDoor);
        }).then(function () {
          return knockForWorld(m);
        }).then(function (w1) {
          var next = lockRecord() || {};
          if (w1 && next.knock && Array.isArray(next.knock.wrap)) next.knock.wrap[1 - vaultDoor] = w1;
          if (Array.isArray(next.doors) && next.doors[1]) next.doors[1] = randomDoor();
          lsSet(LOCK_KEY, JSON.stringify(next));
          m.fill(0);
          return true;
        }, function (e) { m.fill(0); throw e; });
      });
    },

    /* Снять тревожное слово: вторая ячейка становится случайным шумом, и мир
       в ней теряется навсегда — открыть его больше нечем. Носитель не меняет
       ни размера, ни формы: по одному снимку не сказать, был ли там мир (до
       v177 записи того мира оставались на диске набором конвертов — диск, с
       которого вдруг исчезла половина конвертов, сам рассказывал бы, что там
       что-то было). */
    clearDuress: function (mainPassword, secondKeyFile) {
      var nl = noLocksRefusal(); if (nl) return nl;   /* без Web Locks — отказ, записи нет (A1) */
      if (carrierStale) return Promise.reject(new Error("frozen"));   /* замёрзшая вкладка не пишет (D-353) */
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      return enterOrConfirm(mainPassword, secondKeyFile).then(function (door) {
        if (door < 0) return false;
        if (door !== 0) return true;
        var mine = vaultDoor, theirs = 1 - vaultDoor;
        return carrierJob(function () {
          return carrierRead().then(function (seen) { if (!seen) throw new Error("carrier"); return carrierPut(seen, {}, [theirs], null); });
        }).then(function () { return thWipe(theirs); }).then(function () {
          var next = lockRecord() || {};
          if (Array.isArray(next.doors) && next.doors[1]) next.doors[1] = randomDoor();
          if (next.knock && Array.isArray(next.knock.wrap) && next.knock.wrap[mine]) next.knock.wrap[theirs] = knockNoise(next.knock.wrap[mine]);
          lsSet(LOCK_KEY, JSON.stringify(next));
          return true;
        });
      });
    },

    /* ── КОД ВОССТАНОВЛЕНИЯ (D-266) — см. шапку «ЗАПАСНАЯ ДВЕРЬ» ─────────── */
    recoveryMake: function (password, secondKeyFile) {
      var nl = noLocksRefusal(); if (nl) return nl;   /* без Web Locks — отказ, записи нет (A1) */
      if (carrierStale) return Promise.reject(new Error("frozen"));   /* замёрзшая вкладка не пишет (D-353) */
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (!vaultOpen) return Promise.reject(new Error("closed"));
      return openWorldsAny(rec, password, secondKeyFile).then(ownDoor).then(function (hit) {
        if (!hit) return false;
        var m = hit.m, door = hit.role;
        var code = spareNew();
        /* Из тревожного мира — код, который выглядит кодом и не открывает
           ничего: щель кода главной ячейки не трогается, а признаться, что
           мир не первый, значило бы отдать главный (D-203). */
        if (door !== 0) { m.fill(0); markSpare(true); return code; }
        /* Код — ещё один вход в ту же ячейку (D-351): щель кода закрывает тот
           же мастер потоком из ключа кода. Отдельной записи «код заведён»
           на диске нет: щель кода есть в каждой ячейке всегда. */
        var oldFp = null;
        return ensureCarried(hit).then(function () { return spareFp(rec.spare); }).then(function (fp) { oldFp = fp; return codeKeys(code, saltOf(rec), null); }).then(function (ck) {
          /* Код — смена полномочий: поколение растёт (D-353). Сеанс, отставший
             от своей ячейки, кода не заводит — он записал бы старое поверх. */
          var mine = vaultOpen && vaultRole === 0 && vaultDoor === hit.i, base = null, sealedNow = null, gNext = 0;
          return carrierJob(function () {
            return readOwn(hit.i, m, 0).then(function (own) {
              if (mine) ownCurrent(own, hit.i);
              base = own.c;
              gNext = own.g + 1;
              return sealRegion(m, hit.slot, { slot: ck.slot, bits: ck.bits }, own.kv, 0, gNext);
            /* Прежняя запасная дверь (код замка до D-351) заменена новым кодом —
               отпечаток расхода той же записью (Г10, см. spareSpent). */
            }).then(function (sealed) { sealedNow = sealed; var puts = {}; puts[hit.i] = sealed; return carrierPut(base, puts, null, null, spendAlso(oldFp)); });
          }).then(function () {
            if (mine) { ownAfter(sealedNow); sessionG = gNext; }
            /* Открытый главный мир с этой минуты пересобирает и щель кода. */
            if (vaultOpen && vaultRole === 0 && vaultDoor === hit.i) return holdCode(new Uint8Array(ck.bits)).then(function () { ck.bits.fill(0); return true; });
            ck.bits.fill(0);
            return true;
          });
        }).then(function () {
          m.fill(0);
          var next = lockRecord() || {};
          if (next.spare) { delete next.spare; lsSet(LOCK_KEY, JSON.stringify(next)); }
          markSpare(true);
          return code;
        }, function (e) { m.fill(0); throw e; });
      });
    },
    /* Свежее подтверждение (D-308) и запечатанная выгрузка (D-307). */
    presence: {
      fresh: presenceFresh,
      byWord: presenceByWord,
      byDevice: presenceByDevice,
      canDevice: function () { return !!(vaultOpen && hwOf(lockRecord()) && hwSecret); },
      /* Сеанс закрывается после пятого промаха подряд (D-350). */
      shutting: function () { return presenceShut; },
      forget: function () { presentAt = 0; },
      windowMs: function () { return PRESENCE_MS; }
    },
    exportText: exportText,
    openExport: openExport,
    /* Фраза и честная цена короткого слова (D-309). */
    phrase: function (n) { return phraseWords(n || 6); },
    phraseBits: phraseBits,
    weakWord: wordIsWeak,
    weakBelow: function () { return WEAK_BELOW; },
    recoveryState: function () {
      if (!vaultOpen) return null;
      var at = parseInt(lsGet(SPARE_KEY) || "", 10);
      return { at: at > 0 ? at : null };
    },
    /* Открыть кодом, у двери, когда слово забыто. Главный мир встаёт под
       НОВЫМ словом, код расходуется. Был второй ключ — он снимается: человек,
       потерявший файл, иначе остался бы за дверью и с кодом. Вместе с ним
       теряется тревожный мир — его щель сделана с файлом, и открыть её
       больше нечем; это сказано у двери до нажатия. */
    recover: function (code, newPassword) {
      var nl = noLocksRefusal(); if (nl) return nl;   /* без Web Locks — отказ, записи нет (A1) */
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (String(newPassword || "").length < 4) return Promise.reject(new Error("short"));
      var sp = rec.spare || null, c = null, eff = rec;
      /* Ключи кода пробуются ВСЕ, всегда: щель кода в каждой ячейке, прежняя
         запасная дверь в записи замка и её копия в резерве (если первым
         переехал второй мир — по ней код находит ячейку, куда вернуть
         главный). */
      /* Восстановление пишет ячейку мира — только с правом писателя (D-353,
         шаг 4): пока мир пишет другая вкладка, код у двери отказывает. Право
         берётся ДО чтения носителя; не дошло до входа — право отпускается. */
      if (carrierStale) return Promise.reject(new Error("frozen"));
      var hadIt = !!(heldLock && heldLock.world);
      /* Носитель читается и при записи замка прежнего вида (Г10, см.
         openWorlds); прежняя запасная дверь с меткой расхода не открывает
         ничего (см. spareSpent). */
      var known = carrierSize(rec), legacyRec = !known && !!(rec.doors || rec.wrap || rec.spare), spFp = null, spDead = false;
      return writerTake().then(function (right) {
        if (right === false) throw new Error("writer");
        return known || legacyRec ? carrierRead() : null;
      }).then(function (car) {
        c = car;
        eff = known || ownCarrierOf(rec, c) ? withParams(rec, c && c.params) : rec;
        return spareFp(sp).then(function (fp) { spFp = fp; return spareSpent(c, fp); });
      }).then(function (dead) {
        spDead = dead;
        return codeKeys(code, saltOf(eff), sp && !spDead ? sp.kdf : null);
      }).then(function (ck) {
        ck.bits.fill(0);
        var fromCarrier = c ? slotCandidates(c, ck.slot, "code").then(function (cands) { return carrierMatch(c, cands); }) : Promise.resolve(null);
        var fromRecord = sp && !spDead ? (function () {
          var wrapped, iv;
          try { wrapped = unb64(sp.wrap); iv = unb64(sp.wrapIv); } catch (e) { return Promise.resolve(null); }
          return window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, ck.gcm, wrapped)
            .then(function (buf) { return new Uint8Array(buf); }, function () { return null; });
        })() : Promise.resolve(null);
        var fromReserve = [], r;
        if (c) for (r = 0; r < CARRIER_REGIONS; r++) fromReserve.push(gcmAt(ck.gcm, regionOf(c, r), RES_SPARE));
        return Promise.all([fromCarrier, fromRecord, Promise.all(fromReserve)]);
      }).then(function (got) {
        var hitC = got[0], mL = got[1], resv = got[2], hit = null, resCell = -1, r;
        for (r = 0; r < resv.length; r++) if (resv[r]) { if (resCell < 0) resCell = r; resv[r].fill(0); }
        if (hitC) { hit = { i: hitC.i, role: hitC.role, m: hitC.m, src: "carrier" }; if (mL) mL.fill(0); }
        else if (mL) {
          /* Главный мир по прежней запасной двери: носителя нет — первый
             переезд; есть резерв с копией двери — мир ждёт там; иначе он уже
             в носителе, и его ячейку назовёт печать. */
          if (!c) hit = { i: -1, role: 0, m: mL, src: "legacy" };
          else if (resCell >= 0) hit = { i: resCell, role: 0, m: mL, src: "reserved" };
          else hit = { i: -1, role: 0, m: mL, src: "find" };
        }
        if (!hit) return false;
        /* Расход прежней запасной двери ложится той же записью носителя. */
        if (mL && hit.m === mL) hit.spend = spendAlso(spFp);
        var located = hit.src !== "find" ? Promise.resolve(hit) :
          carrierMatch(c, [new Uint8Array(hit.m), new Uint8Array(hit.m)]).then(function (h) {
            if (h) h.m.fill(0);
            if (h && h.role === 0) { hit.i = h.i; hit.src = "carrier"; return hit; }
            /* Мира в носителе нет, а запись замка носителя не знает —
               носитель чужой (Г10: читается и при прежней записи), первый
               переезд пишет свой, как прежде. */
            if (!h && !known) { hit.src = "legacy"; return hit; }
            return null;
          });
        return located.then(function (h) {
          if (!h) { hit.m.fill(0); return false; }
          var hadFactor = !!factorOf(eff) || !!hwOf(eff);
          /* Мир встаёт под НОВЫМ словом, без второго ключа и ключа устройства:
             человек, потерявший файл, иначе остался бы за дверью и с кодом. */
          var params = paramsOf(eff);
          delete params.factor; delete params.hw;
          var cost = costOf({ kdf: params.kdf });
          return deriveWordKeys(newPassword, params.salt, cost[0], cost[1], null, cost[2]).then(function (wk) {
            hit.slot = wk.slot; hit.params = params;
            /* Прежняя запасная дверь при записи, не знающей носителя, — без
               него: переезд прочтёт носитель сам (Г10, как в openWorlds). */
            hit.c = hit.src === "legacy" && !known ? null : c;
            /* Восстановление — смена полномочий: поколение мира растёт (D-353),
               и его сеансы в других вкладках узнают, что слово сменилось. */
            var world = hit.src === "carrier"
              ? readOwn(hit.i, hit.m, hit.role).then(function (w) {
                  /* Изменённое в последний миг прошлого писателя (поздняя щель)
                     ложится в мир и при восстановлении — иначе новая печать
                     молча сделала бы его мёртвым. */
                  return regionKeys(hit.m, hit.role).then(function (rk) { return lateApply(hit.i, rk, w.kv, w.c.seal[hit.i]); })
                    .then(function () { return { kv: w.kv, own: null, c: w.c, g: w.g }; });
                })
              : subkeys(hit.m).then(legacyWorld);
            return world.then(function (w) {
              /* Код расходуется: щель кода новой ячейки — шум, ключа кода в теле нет.
                 Со вторым ключом был сделан и второй мир — открыть его больше нечем. */
              return carrierJob(function () {
                if (hit.src === "carrier") {
                  return sealRegion(hit.m, wk.slot, null, w.kv, hit.role, (w.g || 0) + 1).then(function (sealed) {
                    var puts = {}; puts[hit.i] = sealed;
                    return carrierPut(w.c, puts, hadFactor ? [1 - hit.i] : null, params, hit.spend || null).then(function () { return { cell: hit.i, rec: null }; });
                  });
                }
                /* Код расходуется: щель кода ячейки, найденной переездом, не переносится. */
                hit.dropCode = true;
                return moveWorld(hit, w.kv).then(function (mv) {
                  if (mv.code) mv.code.fill(0);
                  return (hadFactor ? carrierPut(mv.c, {}, [1 - mv.cell], params) : Promise.resolve()).then(function () { return mv; });
                });
              }).then(function (mv) {
                /* Запись замка прежнего вида при мире в носителе (Г10): двери
                   уходят из неё и здесь — иначе прежнее слово давало бы мастер
                   по прежней двери. */
                if (!w.own && !mv.rec && !legacyRec) return mv;
                return subkeys(hit.m).then(function (ks) { return finishMove(ks, w.own, mv.rec, mv.cell, hit.role); }).then(function () { return mv; });
              });
            });
          }).then(function (mv) {
            hit.m.fill(0);
            if (hadFactor) hwSecret = null;
            var next = withParams(lockRecord() || rec, params);
            if (!next.carrier5) next.carrier5 = CARRIER_REGIONS * CARRIER_REGION;
            delete next.carrier;
            delete next.spare;
            if (hadFactor) {
              if (Array.isArray(next.doors)) next.doors = [randomDoor(), randomDoor()];
              if (next.knock && Array.isArray(next.knock.wrap) && next.knock.wrap[mv.cell]) next.knock.wrap[1 - mv.cell] = knockNoise(next.knock.wrap[mv.cell]);
            }
            lsSet(LOCK_KEY, JSON.stringify(next));
            /* Второй мир со вторым ключом потерян — и его склад вещей в шум (D-352). */
            return (hadFactor ? thWipe(1 - mv.cell) : Promise.resolve()).then(function () { return window.sbVault.unlock(newPassword); });
          }, function (e) { hit.m.fill(0); throw e; }).then(function (okp) {
            if (okp) markSpare(false);
            return okp;
          });
        });
      }).then(function (okp) {
        if (!okp && !hadIt && !vaultOpen) writerDrop();
        return okp;
      }, function (e) {
        if (!hadIt && !vaultOpen) writerDrop();
        throw e;
      });
    },

    /* ── СМЕНА ПАРОЛЯ БЕЗ СМЕНЫ МАСТЕРА ────────────────────────────────────
       Пароль не шифрует данные — он держит щель с мастер-ключом. Поэтому
       смена пароля пересобирает щель слова СВОЕЙ ячейки: новая растяжка,
       новый ключ щели, тот же мастер внутри — и те же записи, и те же пароли
       «Ключей». До v177 здесь переклеивался один конверт двери, а конверты
       с данными оставались байт в байт прежними; с носителем (D-351) ячейка
       запечатывается ЦЕЛИКОМ одной записью IndexedDB — обрыв не оставит
       половины на старом слове, а по снимкам смену слова не отличить от
       любой записи. Запись замка не меняется вовсе: соль и цена — замка.
       Проверяет tools/vault-cascade-check.mjs и one-door-carrier-check. */
    rekey: function (oldPassword, newPassword, secondKeyFile) {
      var nl = noLocksRefusal(); if (nl) return nl;   /* без Web Locks — отказ, записи нет (A1) */
      if (carrierStale) return Promise.reject(new Error("frozen"));   /* замёрзшая вкладка не пишет (D-353) */
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (String(newPassword || "").length < 4) return Promise.reject(new Error("short"));
      var fsecNew = null;
      return enterOrConfirm(oldPassword, secondKeyFile).then(function (door) {
        if (door < 0 || !masterBox) return false;
        /* Второй ключ входит и в новое слово: смена слова не снимает его (D-266). */
        return factorFor(lockRecord(), secondKeyFile).then(function (f) { fsecNew = f; return true; });
      }).then(function (okp) {
        if (!okp || !masterBox) return false;
        /* Соль и цена — замка (D-266): вторая ячейка сделана ими, и растяжка
           считается одна на все. Пересобирается ОДНА ячейка — та, в которую
           вошли, с новой щелью слова; другая остаётся байт в байт. */
        var r = (typeof vaultDoor === "number" && vaultDoor >= 0) ? vaultDoor : 0;
        return carrierRead().then(function (c) {
          var eff = withParams(lockRecord() || {}, c && c.params), cost = costOf(eff);
          return deriveWordKeys(newPassword, saltOf(eff), cost[0], cost[1], fsecNew, cost[2]);
        }).then(function (k) {
          /* Смена слова — смена полномочий (D-353): поколение растёт; отставший
             сеанс слова не меняет — он записал бы поверх более нового. */
          var base = null, sealedNow = null, gNext = 0;
          return carrierJob(function () {
            return withMaster(function (m) {
              return withCode(function (code) {
                return readOwn(r, m, vaultRole).then(function (own) {
                  ownCurrent(own, r);
                  base = own.c;
                  gNext = own.g + 1;
                  return sealRegion(m, k.slot, code, own.kv, vaultRole, gNext);
                });
              });
            }).then(function (sealed) { sealedNow = sealed; var puts = {}; puts[r] = sealed; return carrierPut(base, puts, null, null); });
          }).then(function () { ownAfter(sealedNow); sessionG = gNext; carrierWordSlot = k.slot; return true; });
        }).then(function (okw) {
          if (!okw) return false;
          /* Подтверждение (D-308) отныне узнаёт новое слово, а не прежнее. */
          return rememberWord(newPassword).then(function () { return true; });
        });
      });
    }
  };

  /* ── ПЕРЕЕЗД СО СТАРОГО ЗАМКА ─────────────────────────────────────────────
     Замок v1 остался у тех, кто запер систему до 27.08.2026. Верный пароль
     обязан открыть его и там — и тут же переклеить всё на новый лад. Порядок
     шагов выбран так, чтобы обрыв питания в любой точке не стоил ни одного
     ключа: сперва всё читается в память, затем пишется носитель, затем
     новая запись замка, и только последними стираются старые. */
  function migrateV1(password, rec, right) {
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
          /* Запись замка v1 НЕ стирается заранее (разбор №3, блокер): новая
             ложится поверх неё только после носителя (buildLock). Обрыв в
             любой точке оставляет либо v1 целиком, либо новый замок целиком;
             и пока идёт переезд, система заперта — правки не ложатся
             открытыми. */
          return buildLock(password, pairs).then(function (ks) {
            var kv = new Map();
            pairs.forEach(function (p) { kv.set(p.k, p.v); });
            writeRight = right || (LOCKS ? false : "cas");
            return adoptWorld(ks, kv);
          });
        });
      }, function () { return false; });
    }, function () { return false; });
  }

  /* ── ЗАПЕРТОЕ ПИШЕТСЯ ЗАПЕРТЫМ ────────────────────────────────────────────
     Пока сеанс открыт, слова лежат в памяти расшифрованными — на этом стоит
     весь синхронный sbDB.get, которым пользуются все приложения. А на диск
     они обязаны уходить запечатанными — ячейкой носителя (D-351). Шифрование
     асинхронно, поэтому запись идёт через очередь: на диске всегда лежит
     последняя ГОТОВАЯ ячейка. Изменённое в миг ухода со страницы ложится в
     позднюю щель своей ячейки (см. carrierLateNow). Цена названа: что не
     поместилось в щель и не успело в ячейку, остаётся незаписанным.
     Потерять последний символ хуже, чем ничего, — но записать его открытым
     было бы хуже вдвое, а это и есть выбор между двумя бедами. */
  /* ── ЗАМОК СТОИТ НА ГРАНИЦЕ ХРАНИЛИЩА, А НЕ НАД НЕЙ (D-164) ──────────────
     Первая редакция запирала записи, шедшие через sbDB. Закон это и поймал:
     четыре ключа утекли открытыми — язык, два сторожа и заметки. Оказалось,
     что модули пишут в хранилище НАПРЯМУЮ, своими rawSet, мимо sbDB. Замок,
     охраняющий одну из нескольких дверей, не замок.
     Поэтому дверь делается ОДНА — сама Storage. Пока замок открыт:
       · запись защищённого ключа НЕ ДОХОДИТ ДО ДИСКА открытой: значение
         ложится в память, а на диск уходит ячейка носителя, когда шифр готов;
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
  /* ── ЩЕЛЬ МЕЖДУ «ЕЩЁ НЕ ЗАПЕРТО» И «УЖЕ ЗАПЕРТО» (D-170, нашёл закон) ────
     Поворот ключа занимает полсекунды: столько считается растяжка пароля. Всё
     это время замок ЕЩЁ не записан (vaultLocked() ложь) и сеанс ЕЩЁ не открыт
     (vaultOpen ложь) — то есть страж пропускал записи на диск ОТКРЫТЫМИ. Закон
     поймал ровно один такой ключ, sysbaby.boot.seen, и был прав: щель в
     полсекунды — это щель. Теперь у замка есть третье состояние, «запирается»:
     записи в это время не идут на диск вовсе, а копятся здесь и уезжают в
     ячейку тем же поворотом ключа. */
  var sealing = false;
  var pending = new Map();
  /* Что лежало на диске, когда своя запись ушла в отложенное (Г9-3): по
     нему поворот ключа узнаёт, писала ли этот ключ после неё вкладка,
     открытая посреди поворота (см. collect.lay в lock). */
  var pendDisk = new Map();

  var rawStore = {
    get: window.localStorage.getItem,
    set: window.localStorage.setItem,
    del: window.localStorage.removeItem
  };
  /* Проба места перед снятием (ROOM_KEY) пишется и стирается в одном шаге;
     оборвалось между ними — не лежать ей: её длина сказала бы размер
     открытого мира, а носитель его прячет (разбор №5). */
  try { if (rawStore.get.call(window.localStorage, ROOM_KEY) != null) rawStore.del.call(window.localStorage, ROOM_KEY); } catch (e) { /* ignore */ }
  /* Запись защищённого ключа уходит в ячейку мира (D-351): см. carrierDirty. */
  function scheduleSeal(k) { carrierDirty(k); }
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
        if (window.sbVanishing || healingNow) return;
        /* Замок исчез под вкладкой, поднявшейся под ним (разбор №2): её
           запертая пустота на диск не идёт. */
        if (lostNow()) return;
        /* Своё снятие замка между снимком записей и концом: написанное
           копится и ляжет открытым вместе со снятием (или вернётся в мир). */
        if (removalCut && isProtectedKey(k)) { pending.set(String(k), String(v)); return; }
        /* ЗАМЁРЗШАЯ ВКЛАДКА (D-353): написанное остаётся в её памяти, на диск
           не идёт ничего — ни записи мира, ни метки профиля, ни записи замка. */
        if (carrierStale) {
          if (isProtectedKey(k)) { mem.set(String(k), String(v)); scheduleSeal(String(k)); }
          return;
        }
        if (isProtectedKey(k)) {
          if (vaultOpen) {
            /* То же значение — не правка (D-353): ячейка не пересобирается, и
               соседняя вкладка того же мира не замерзает от записи, которая
               ничего не меняет (загрузка пишет метки, что уже лежат). */
            if (mem.has(String(k)) && mem.get(String(k)) === String(v)) return;
            mem.set(String(k), String(v));
            scheduleSeal(String(k));
            return;
          }
          /* Поворот ключа идёт: до записи замка — на диск открытыми (замка
             ещё нет; сходимость поворота их запечатает), после — в хвост
             поворота (Р-A5.2). */
          if (sealing && vaultLocked()) { pending.set(String(k), String(v)); pendDisk.set(String(k), rawStore.get.call(ls, k)); return; }
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
        /* После ухода и очистки (D-174, D-350) голос у диска, а не у памяти
           сеанса: память уходящего мира не выдаётся за то, что лежит. */
        if ((vaultOpen || carrierStale) && !window.sbVanishing && mem.has(String(k))) return mem.get(String(k));
        return rawStore.get.call(ls, k);
      });
      shadow("removeItem", function (k) {
        if (!isOurs(this)) return rawStore.del.call(this, k);
        if (healingNow) return;
        if (lostNow()) return;
        if (removalCut && isProtectedKey(k)) { pending.set(String(k), null); return; }
        /* Стирать при уходе (D-174) — только тому, кто вправе стирать: при
           замке это писатель открытого мира (D-353, шаг 4). */
        if (window.sbVanishing) {
          var kk = String(k);
          if (!mayErase() && (isProtectedKey(kk) || kk === LOCK_KEY || kk.indexOf(LATE_PFX) === 0 || kk.indexOf(SEAL_PFX) === 0)) return;
          return rawStore.del.call(ls, k);
        }
        if (carrierStale) {
          if (isProtectedKey(k)) { mem.set(String(k), null); scheduleSeal(String(k)); }
          return;
        }
        if (isProtectedKey(k)) {
          if (vaultOpen) {
            if (!mem.has(String(k)) || mem.get(String(k)) === null) return;   /* стирать нечего — не правка */
            mem.set(String(k), null); scheduleSeal(String(k)); return;
          }
          if (sealing && vaultLocked()) { pending.set(String(k), null); pendDisk.set(String(k), rawStore.get.call(ls, k)); return; }
          if (vaultLocked()) return;          /* та же причина: не стирать вслепую */
        }
        return rawStore.del.call(ls, k);
      });
    } catch (e) { if (window.console) console.error("[vault] storage guard failed", e); }
  })();
  /* Дождаться, пока всё записанное ляжет в носитель: копившееся — сейчас же. */
  window.sbVaultSettled = function () { return carrierFlushNow(); };

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
