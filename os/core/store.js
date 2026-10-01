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
      /* Версия 4 (D-351): добавлен склад «carrier» — носитель замка, одна
         запись фиксированного размера. */
      try { req = window.indexedDB.open("sysbaby", 4); } catch (e) { resolve(null); return; }
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
  var DENY_PREFIX = ["sysbaby.sync.token::", "sysbaby.incognito::", "sysbaby.i18n.cache."];

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
  window.sbIdb = { put: idbPut, get: idbGet };

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
     (два шифра тела и ключ печати своей роли), ключи «Ключей» и ключи
     конвертов вещей Хранилища, выгрузки и копии. Смена пароля не меняет
     мастера: пересобирается щель слова, записи и пароли «Ключей» те же.

     ДВА ШИФРА ПОДРЯД, НЕ ОДИН (слово основателя: «пускай их будет несколько»):
     тело ячейки — AES-256-CTR, затем ещё раз AES-256-CTR другим ключом, и
     печать HMAC-SHA-512 поверх всей ячейки (encrypt-then-MAC); у конвертов
     вещей, выгрузки и копии — AES-256-CTR, затем AES-256-GCM, и подпись
     HMAC-SHA-512. Оба ключа шифров выведены из одного мастера, и
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
    return o;
  }
  function carrierNorm(v) {
    if (!v || !v.bytes || !Array.isArray(v.seal)) return null;
    var b = v.bytes instanceof Uint8Array ? v.bytes : (v.bytes instanceof ArrayBuffer ? new Uint8Array(v.bytes) : null);
    if (!b || b.length !== CARRIER_REGIONS * CARRIER_REGION || v.seal.length !== CARRIER_REGIONS) return null;
    var o = { bytes: b, seal: v.seal.map(function (s) { return s instanceof Uint8Array ? s : new Uint8Array(s); }) };
    if (v.params && typeof v.params === "object") o.params = v.params;
    return o;
  }
  function carrierRead() {
    return idbGet(CARRIER_STORE, CARRIER_ID).then(function (v) {
      var c = carrierNorm(v);
      if (c) carrierMem = c;
      return c;
    });
  }
  function carrierWrite(c) {
    /* Параметры вывода — В ТОЙ ЖЕ записи (см. paramsOf): одна неделимая запись. */
    return idbPut(CARRIER_STORE, { id: CARRIER_ID, bytes: c.bytes, seal: c.seal, params: c.params || null }).then(function (okp) {
      if (okp) {
        carrierMem = c;
        if (window.sbBus && window.sbBus.emit) window.sbBus.emit("carrier:write", { at: Date.now() });
      }
      return okp;
    });
  }
  function carrierDrop() {
    carrierMem = null;
    return idb().then(function (db) {
      if (!db) return false;
      return new Promise(function (resolve) {
        var tx;
        try { tx = db.transaction(CARRIER_STORE, "readwrite"); tx.objectStore(CARRIER_STORE).clear(); } catch (e) { resolve(false); return; }
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { resolve(false); };
      });
    });
  }
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
  function worldText(kv, codeBits, role) {
    var obj = {}, out;
    kv.forEach(function (v, key) { if (v != null) obj[key] = v; });
    out = { v: 1, w: role === 1 ? 1 : 0, kv: obj };
    if (codeBits) out.c = b64(codeBits);
    return JSON.stringify(out);
  }
  /* ── ЯЧЕЙКА ЗАПЕЧАТЫВАЕТСЯ ЦЕЛИКОМ, ВСЕГДА (D-351) ─────────────────────
     Каждая запись ячейки — новая метка N_s, обе щели заново (щель кода —
     шум, если кода нет), новая метка тела, новое тело, новая печать. Между
     двумя снимками в ячейке не остаётся ни одного неподвижного байта: по
     снимкам не видно ни где голова, ни когда заводили код или меняли слово.
     code — { slot, bits } щели кода или null; role — 0 главный мир, 1 второй. */
  function sealRegion(m, wordSlot, code, kv, role) {
    var ns = randBytes(CR_NS), nb = randBytes(CR_NB);
    return Promise.all([regionKeys(m, role), slotStream(wordSlot, ns), code ? slotStream(code.slot, ns) : Promise.resolve(null)]).then(function (r) {
      var keys = r[0], ew = xorInto(m, r[1]), ec = r[2] ? xorInto(m, r[2]) : randBytes(CR_EC);
      r[1].fill(0); if (r[2]) r[2].fill(0);
      var raw = new TextEncoder().encode(worldText(kv, code && code.bits, role));
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
        return { kv: kvFromObject(obj.kv), code: obj.c ? unb64(obj.c) : null, role: obj.w === 1 ? 1 : 0 };
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
     снимок диска, а не от того, кто снимает диск много раз (эпоха записи —
     следующая ступень, v178). Прежде здесь стояла иная граница — видно ЧИСЛО
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
      var rec = lockRecord();
      if (!rec || !rec.knock || !rec.knock.pub || !Array.isArray(rec.knock.slots) || !rec.knock.slots.length) return Promise.resolve(false);
      return knockSeal(unb64(rec.knock.pub), Date.now()).then(function (slot) {
        var now = lockRecord();
        if (!now || !now.knock || !Array.isArray(now.knock.slots) || !now.knock.slots.length) return false;
        now.knock.slots = now.knock.slots.slice(1).concat([slot]);
        lsSet(LOCK_KEY, JSON.stringify(now));
        return true;
      }, function () { return false; });
    },
    /* Прочесть след — только открытой системой. Замку, поставленному до
       D-341, след заводится при первом открытии главным словом. */
    read: function () {
      var rec = lockRecord();
      if (!vaultOpen || !rec) return Promise.resolve([]);
      if (!rec.knock) {
        if (vaultRole !== 0) return Promise.resolve([]);
        return withMaster(function (m) { return makeKnock(new Uint8Array(m), null); }).then(function (k) {
          knockInCells(k, vaultDoor);
          var now = lockRecord();
          if (now && !now.knock && k) { now.knock = k; lsSet(LOCK_KEY, JSON.stringify(now)); }
          knockLast = [];
          return [];
        }, function () { return []; });
      }
      return knockPrivate(rec).then(function (priv) {
        if (!priv) return [];
        return Promise.all(rec.knock.slots.map(function (s) { return knockOpen(priv, s).then(null, function () { return 0; }); }));
      }).then(function (ts) {
        knockLast = ts.filter(function (t) { return typeof t === "number" && isFinite(t) && t > 0; }).sort(function (a, b) { return a - b; });
        return knockLast.slice();
      }, function () { return []; });
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
    return (rec.carrier ? carrierRead().then(function (x) { return x || carrierMem; }) : Promise.resolve(null)).then(function (car) {
      c = car;
      /* Параметры вывода — носителя, если он их несёт (см. paramsOf). */
      eff = withParams(rec, c && c.params);
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
      hit.slot = keys.slot; hit.gcm = keys.gcm; hit.c = c; hit.params = params;
      /* прежняя дверь того же мира, пережившая переезд, — к уборке */
      if (hit !== hitL && hitL) { if (hitL.role === hit.role) hit.stale = true; hitL.m.fill(0); }
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
    carrierChanged.add("\u0000sb/roll");
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
          if (duressPassword) { dm = new Uint8Array(32); window.crypto.getRandomValues(dm); }
          /* След стука заводится вместе с замком (D-341). */
          var kc0 = new Uint8Array(master), kc1 = dm ? new Uint8Array(dm) : null;
          var knockMade = makeKnock(kc0, kc1).then(function (k) { kc0.fill(0); if (kc1) kc1.fill(0); return k; },
            function () { kc0.fill(0); if (kc1) kc1.fill(0); return null; });
          rows = typeof pairs === "function" ? pairs() : pairs;
          var kv0 = new Map();
          rows.forEach(function (p) { if (p.v != null) kv0.set(p.k, p.v); });
          var c = carrierNew();
          /* Главный мир — в СЛУЧАЙНУЮ ячейку, второй — в другую (D-351): номер
             ячейки не говорит, какой мир в ней. */
          var cell = randBytes(1)[0] & 1;
          var world0 = sealRegion(master, wk[0].slot, null, kv0, 0);
          var world1 = dm ? sealRegion(dm, wk[1].slot, null, new Map(), 1) : Promise.resolve(null);
          return Promise.all([world0, world1, knockMade]).then(function (made) {
            c.bytes.set(made[0].region, cell * CARRIER_REGION); c.seal[cell] = made[0].seal;
            if (made[1]) { c.bytes.set(made[1].region, (1 - cell) * CARRIER_REGION); c.seal[1 - cell] = made[1].seal; }
            knockInCells(made[2], cell);
            c.params = { salt: saltB64, kdf: ["PBKDF2-SHA512:" + cost.it1, "PBKDF2-SHA256:" + cost.it2].concat(a2 ? [a2Label(a2)] : []) };
            if (factorRec) c.params.factor = factorRec;
            return carrierWrite(c).then(function (okp) {
              if (!okp) throw new Error("carrier");
              var body = {
                v: factorRec ? 4 : 3,
                kdf: ["PBKDF2-SHA512:" + cost.it1, "PBKDF2-SHA256:" + cost.it2].concat(a2 ? [a2Label(a2)] : []),
                ciphers: ["AES-256-CTR", "AES-256-CTR"],
                mac: "HMAC-SHA-512",
                /* Носитель (D-351): его размер — не тайна, он у всех один. */
                carrier: CARRIER_REGIONS * CARRIER_REGION,
                salt: saltB64,
                /* Поздние щели обеих ячеек — шум с самого начала. */
                late: [lateNoise(), lateNoise()]
              };
              if (made[2]) body.knock = made[2];
              if (factorRec) body.factor = factorRec;
              lsSet(LOCK_KEY, JSON.stringify(body));
              rows.forEach(function (p) { rawStore.del.call(window.localStorage, p.k); });
              return subkeys(master).then(function (ks) {
                carrierKeys = made[0].keys;
                carrierWordSlot = wk[0].slot;
                vaultDoor = cell;
                vaultRole = 0;
                return holdMaster(master).then(function () { if (dm) dm.fill(0); return ks; });
              });
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

  /* ── ЗАПИСАТЬ НОСИТЕЛЬ: ячейки целиком и параметры — одной записью ──────
     puts — { номер ячейки: запечатанная ячейка }, wipes — номера ячеек,
     которые становятся шумом. Носитель читается заново перед записью:
     чужую ячейку могла переписать другая вкладка. */
  function carrierPut(puts, wipes, params) {
    return carrierRead().then(function (fresh) {
      var base = fresh || carrierMem || carrierNew(), next = carrierCopy(base), r, off, reg;
      for (r in puts) if (Object.prototype.hasOwnProperty.call(puts, r)) {
        next.bytes.set(puts[r].region, Number(r) * CARRIER_REGION);
        next.seal[Number(r)] = puts[r].seal;
      }
      (wipes || []).forEach(function (w) {
        reg = next.bytes.subarray(w * CARRIER_REGION, (w + 1) * CARRIER_REGION);
        for (off = 0; off < reg.length; off += 65536) window.crypto.getRandomValues(reg.subarray(off, Math.min(reg.length, off + 65536)));
        next.seal[w] = randBytes(CR_SEAL);
      });
      if (params) next.params = params;
      else if (base.params) next.params = base.params;
      return carrierWrite(next).then(function (okp) { if (!okp) throw new Error("carrier"); return next; });
    });
  }
  /* Своя ячейка из свежего носителя: печать сверяется мастером под СВОЕЙ
     ролью, тело открывается. Не своя — «not-mine». Байты ключа щели кода
     из тела — та же тайна, что мастер (ими открывается мир), и без просьбы
     (wantCode) обнуляются сразу (D-300). */
  function readOwn(r, m, role, wantCode) {
    return carrierRead().then(function (fresh) {
      var c = fresh || carrierMem;
      if (!c) throw new Error("carrier");
      return regionKeys(m, role).then(function (keys) {
        var reg = regionOf(c, r);
        return window.crypto.subtle.verify("HMAC", keys.mac, c.seal[r], reg).then(function (mine) {
          if (!mine) throw new Error("not-mine");
          return openRegion(keys, reg).then(function (w) {
            if (!wantCode && w.code) { w.code.fill(0); w.code = null; }
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
      carrier: CARRIER_REGIONS * CARRIER_REGION,
      salt: params.salt,
      late: [lateNoise(), lateNoise()]
    };
    if (rec.knock) body.knock = rec.knock;
    if (params.factor) body.factor = params.factor;
    if (params.hw) body.hw = params.hw;
    if (rec.spare) body.spare = rec.spare;
    return body;
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
      return hit;
    });
  }
  function moveWorld(hit, kv) {
    var code = null;
    var fresh = hit.src === "reserved" ? Promise.resolve(kv) : carrierRead().then(function (c) {
      if (!c) return kv;
      return relocated(hit, c).then(function () {
        if (!hit.carried) return kv;
        return readOwn(hit.i, hit.m, hit.role, !hit.dropCode).then(function (w) { code = w.code; return w.kv; });
      }, function (e) {
        var now = lockRecord();
        if (now && !now.carrier) return kv;           /* носитель чужой — см. выше */
        throw e;
      });
    });
    return fresh.then(function (kv2) {
      kv = kv2;
      return codeFromBits(code).then(function (ck) {
        return sealRegion(hit.m, hit.slot, ck, kv, hit.role).then(function (sealed) { if (ck) ck.bits.fill(0); return sealed; },
          function (e) { if (ck) ck.bits.fill(0); throw e; });
      });
    }).then(function (sealed) {
      var puts = {}, rec = lockRecord() || {}, cell, other, resv, j, d, sp, iv, w;
      if (hit.src === "reserved") {
        cell = hit.i;
        puts[cell] = sealed;
        return carrierPut(puts, null, hit.params).then(function () { return { cell: cell, keys: sealed.keys, rec: null, kv: kv, code: code }; },
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
      return carrierPut(puts, null, hit.params).then(function () {
        var next = carriedRecord(rec, hit.params);
        /* След стука — по ячейкам: wrap[r] под мастер мира ячейки r. */
        if (next.knock && Array.isArray(next.knock.wrap) && next.knock.wrap.length === 2 && cell !== hit.role) {
          next.knock = JSON.parse(JSON.stringify(next.knock));
          next.knock.wrap = [next.knock.wrap[1], next.knock.wrap[0]];
        }
        return { cell: cell, keys: sealed.keys, rec: next, kv: kv, code: null };
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
    sealThingsNow(ks, vaultRole !== 0);
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
      if (rec2) { lsSet(LOCK_KEY, JSON.stringify(rec2)); return; }
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
    });
  }
  /* Войти в найденный мир: прочесть ячейку или переехать в носитель. */
  function enterWorld(hit) {
    var m = hit.m;
    return subkeys(m).then(function (ks) {
      var load = hit.src === "carrier"
        ? regionKeys(m, hit.role).then(function (rk) {
            return openRegion(rk, regionOf(hit.c, hit.i)).then(function (w) {
              /* Изменённое в миг прошлого ухода — поверх ячейки (поздняя щель). */
              return lateApply(hit.i, rk, w.kv, hit.c.seal[hit.i]).then(function (late) { return { kv: w.kv, code: w.code, own: null, rk: rk, cell: hit.i, rec: null, late: late }; });
            });
          })
        : legacyWorld(ks).then(function (w) {
            return moveWorld(hit, w.kv).then(function (mv) { return { kv: mv.kv, code: mv.code, own: w.own, rk: mv.keys, cell: mv.cell, rec: mv.rec }; });
          });
      return load.then(function (w) {
        vaultDoor = w.cell;
        vaultRole = hit.role;
        carrierKeys = w.rk;
        carrierWordSlot = hit.slot;
        mirrorParams(hit.params);
        var tidy = (w.own || w.rec || hit.stale) ? finishMove(ks, w.own, w.rec, w.cell, hit.role) : Promise.resolve();
        return tidy.then(function () { return holdCode(w.code); })
          .then(function () { return holdMaster(m); }).then(function () { return adoptWorld(ks, w.kv); })
          .then(function (r) {
            /* Позднее ляжет в ячейку ближайшей печатью — вместе с шумом в щели. */
            (w.late || []).forEach(function (k) { carrierDirty(k); });
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
     ДРУГАЯ ВКЛАДКА. Перед записью носитель читается заново: чужая ячейка
     берётся свежей (её мог записать другой мир в другой вкладке), своя —
     сливается: свои изменения поверх, остальное — как лежит.
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
      if (!vaultOpen || !carrierKeys || !carrierKeys.late || vaultDoor < 0 || !carrierMem) return false;
      var keys = new Set(), delta = {}, n = 0, cell = vaultDoor, ks = carrierKeys;
      carrierChanged.forEach(function (k) { keys.add(k); });
      carrierInflight.forEach(function (k) { keys.add(k); });
      keys.forEach(function (k) { var v = mem.get(k); delta[k] = v == null ? null : v; n++; });
      if (!n) return false;
      var bases = [b64(carrierMem.seal[cell])];
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
            var rec = lockRecord();
            if (!rec || !Array.isArray(rec.late) || rec.late.length !== CARRIER_REGIONS) return false;
            rec.late[cell] = b64(cat(nonce, new Uint8Array(mac), c8));
            lsSet(LOCK_KEY, JSON.stringify(rec));
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
    if (!ks || !ks.late || !seal || !rec || !Array.isArray(rec.late)) return Promise.resolve([]);
    try { b = unb64(rec.late[cell]); } catch (e) { return Promise.resolve([]); }
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
  function carrierSaveWorld() {
    if (!vaultOpen || !carrierKeys || !carrierWordSlot || vaultDoor < 0 || !carrierChanged.size) return Promise.resolve(false);
    var r = vaultDoor, role = vaultRole, keys = carrierKeys, slot = carrierWordSlot;
    var changed = Array.from(carrierChanged);
    carrierChanged.clear();
    changed.forEach(function (k) { carrierInflight.add(k); });
    var settle = function () { changed.forEach(function (k) { carrierInflight.delete(k); }); carrierPendingSeal = null; };
    /* Не записалось — изменения возвращаются в очередь и пробуются позже. */
    var giveBack = function () {
      settle();
      changed.forEach(function (k) { carrierChanged.add(k); });
      if (carrierTimer) clearTimeout(carrierTimer);
      carrierTimer = setTimeout(carrierFlushNow, CARRIER_QUIET_MS * 4);
    };
    return withMaster(function (m) {
      return withCode(function (code) {
        return readOwn(r, m, role).then(function (w) { return w.kv; }, function () { return null; }).then(function (lying) {
          return sealRegion(m, slot, code, mergeOwn(lying, changed), role);
        });
      });
    }).then(function (sealed) {
      if (!vaultOpen || vaultDoor !== r || carrierKeys !== keys) { settle(); return false; }
      var puts = {}; puts[r] = sealed;
      /* Печать, которая сейчас ляжет, — поздняя щель назовёт и её. */
      carrierPendingSeal = sealed.seal;
      return carrierPut(puts, null, null).then(function () {
        settle();
        if (window.sbBus && window.sbBus.emit) {
          var at = Date.now();
          var tileName = "carrier:" + window.sbCarrier.tileOfRegion(r);
          changed.forEach(function (k) { window.sbBus.emit("vault:sealed", { key: k, name: tileName, at: at }); });
        }
        return true;
      });
    }).then(null, function (e) {
      giveBack();
      if (e && e.message === "full") surfaceCarrierFull();
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
  /* Мир, найденный за прежней дверью, переезжает сейчас же. */
  function ensureCarried(hit) {
    if (!hit || (hit.src !== "legacy" && hit.src !== "reserved")) return Promise.resolve(hit);
    return subkeys(hit.m).then(function (ks) {
      return legacyWorld(ks).then(function (w) {
        return carrierJob(function () { return moveWorld(hit, w.kv); }).then(function (mv) {
          if (mv.code) mv.code.fill(0);
          return finishMove(ks, w.own, mv.rec, mv.cell, hit.role).then(function () {
            hit.i = mv.cell; hit.src = "carrier"; hit.stale = false;
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
  function reslotWorlds(w0, w1, fsecNew, patch) {
    var rec0 = lockRecord();
    if (!rec0) return Promise.reject(new Error("no-lock"));
    return carrierRead().then(function (c) {
      var params = paramsOf(withParams(rec0, c && c.params));
      patch(params);
      var cost = costOf({ kdf: params.kdf });
      return deriveWordKeys(w0.pw, params.salt, cost[0], cost[1], fsecNew, cost[2]).then(function (k0) {
        return (w1 ? deriveWordKeys(w1.pw, params.salt, cost[0], cost[1], fsecNew, cost[2]) : Promise.resolve(null)).then(function (k1) {
          /* Ячейки — по месту миров (w.i): главный мир лежит там, где лежит. */
          var c0 = w0.i, c1 = w1 ? w1.i : 1 - w0.i;
          return carrierJob(function () {
            return readOwn(c0, w0.m, 0, true).then(function (own0) {
              return codeFromBits(own0.code).then(function (code0) {
                if (own0.code) own0.code.fill(0);
                var done = function (v) { if (code0) code0.bits.fill(0); return v; };
                return sealRegion(w0.m, k0.slot, code0, own0.kv, 0).then(done, function (e) { done(); throw e; });
              });
            }).then(function (s0) {
              var puts = {}; puts[c0] = s0;
              if (!w1) return carrierPut(puts, [c1], params);
              return readOwn(c1, w1.m, 1).then(function (own1) {
                return sealRegion(w1.m, k1.slot, null, own1.kv, 1);
              }).then(function (s1) { puts[c1] = s1; return carrierPut(puts, null, params); });
            });
          }).then(function () {
            if (vaultOpen && vaultDoor === c0) carrierWordSlot = k0.slot;
            var fin = withParams(lockRecord() || rec0, params);
            /* Прежние двери сделаны прежними параметрами — открыть ими больше нечего. */
            if (Array.isArray(fin.doors)) fin.doors = [randomDoor(), randomDoor()];
            if (!w1 && fin.knock && Array.isArray(fin.knock.wrap) && fin.knock.wrap[c0]) fin.knock.wrap[c1] = knockNoise(fin.knock.wrap[c0]);
            lsSet(LOCK_KEY, JSON.stringify(fin));
            return true;
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
  try { var bootRec = lockRecord(); if (bootRec && bootRec.carrier) carrierRead(); } catch (e) { /* нет базы — поле пустое */ }
  /* Уход и скрытие: сперва поздняя щель (миллисекунды), затем полная
     печать (успеет — хорошо). Модули, что пишут своё в том же миг ухода
     позже, попадают в щель сами (см. carrierDirty). */
  window.addEventListener("pagehide", function () { leaving = true; carrierLateNow(); carrierFlushNow(); });
  window.addEventListener("pageshow", function () { leaving = false; });
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") { leaving = true; carrierLateNow(); carrierFlushNow(); }
    else leaving = false;
  });

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
        ciphers: ["AES-256-CTR", "AES-256-CTR"], mac: "HMAC-SHA-512", carrier: CARRIER_REGIONS * CARRIER_REGION };
      return rec;
    },

    /* Повернуть ключ. Слова уходят в ячейку носителя, открытые значения стираются из
       хранилища и из памяти разом: оставить их «на всякий случай» значило бы
       не запереть ничего. */
    lock: function (password, duressPassword, secondKeyFile) {
      if (!vaultAvailable()) return Promise.reject(new Error("no-subtle"));
      if (String(password || "").length < 4) return Promise.reject(new Error("short"));
      if (vaultLocked()) return Promise.reject(new Error("already"));
      flush();
      /* Флаг поднимается СИНХРОННО, до первого await: между этой строкой и
         записью замка система продолжает жить и писать — это копится в pending. */
      sealing = true;
      pending.clear();
      var collect = function () {
        var m = new Map();
        protectedKeysNow().forEach(function (k) { var v = rawStore.get.call(window.localStorage, k); if (v != null) m.set(k, v); });
        pending.forEach(function (v, k) { if (v == null) m.delete(k); else m.set(k, v); });
        pending.clear();
        var out = [];
        m.forEach(function (v, k) { out.push({ k: k, v: v }); });
        return out;
      };
      var sealedWith = null;
      return buildLock(password, collect, null, duressPassword, secondKeyFile).then(function (ks) {
        sealedWith = ks;
        /* Добираем то, что система записала, пока собиралась ячейка. */
        if (!pending.size) return null;
        var extra = new Map(pending);
        pending.clear();
        return withMaster(function (m) {
          return readOwn(vaultDoor, m, 0).then(function (w) {
            extra.forEach(function (v, k) { if (v == null) w.kv.delete(k); else w.kv.set(k, v); });
            return sealRegion(m, carrierWordSlot, null, w.kv, 0);
          });
        }).then(function (sealed) { var puts = {}; puts[vaultDoor] = sealed; return carrierPut(puts, null, null); });
      }).then(function () {
        /* Вещи склада уходят в конверты ТЕМ ЖЕ поворотом ключа, и старые
           открытые снимки вычищаются: замок держит весь диск (D-265). */
        return sealThingsNow(sealedWith, false).then(function () { return purgeDiskLeaks(); });
      }).then(function () {
        /* ── ЗАПЕР — ЗНАЧИТ ЗАПЕРТО, С ЭТОГО ЖЕ МИГА ──────────────────────
           Поворот ключа ЗАКРЫВАЕТ сеанс: ключи выброшены, память пуста, на
           диск защищённое не идёт вовсе. Дальше — только дверь с паролем. */
        cache.clear();
        mem.clear();
        vaultKeys = null;
        carrierKeys = null;
        carrierWordSlot = null;
        codeBox = null;
        carrierChanged.clear();
        vaultDoor = -1;
        vaultRole = -1;
        dropMaster();
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
         уже лежит в памяти сеанса; без ответа ключ просто не выведется. */
      if (!vaultAvailable()) return Promise.resolve(false);
      if (rec.v === 1) return migrateV1(password, rec);
      /* Верно ли слово, отвечают печати ячеек (и прежние двери, пока замок не
         переехал целиком): считаются ВСЕ, всегда — см. openWorlds. */
      return openWorldsAny(rec, password, secondKeyFile).then(function (hit) {
        /* Открытая система другим миром не открывается (D-349): замер цены и
           любые пробы идут мимо, а слово чужого мира — «неверно». Номер мира
           сеанса ставится ТОЛЬКО здесь и только удачным входом. */
        if (hit && vaultOpen && hit.role !== vaultRole) { hit.m.fill(0); hit = null; }
        if (!hit) throw new Error("wrong");
        if (vaultOpen) { hit.m.fill(0); return true; }
        return enterWorld(hit);
      }).then(function () { return rememberWord(password); }).then(function () { return true; }, function () { return false; });
    },

    /* Снять замок совсем: слова возвращаются в хранилище открытыми. Требует
       пароля — снять замок должен тот, кто его ставил. */
    remove: function (password, secondKeyFile) {
      var rec = lockRecord();
      if (!rec) return Promise.resolve(true);
      return enterOrConfirm(password, secondKeyFile).then(function (door) {
        if (door < 0) return false;
        return unsealThingsNow(vaultKeys).then(function () { return true; });
      }).then(function (okp) {
        if (!okp) return false;
        var names = sealedNamesNow(), i;
        mem.forEach(function (v, k) {
          if (v != null) rawStore.set.call(window.localStorage, k, v);
        });
        for (i = 0; i < names.length; i++) rawStore.del.call(window.localStorage, names[i]);
        /* Порядок (D-351): записи — открытыми, затем снимается замок, затем
           носитель. Оборвись питание между двумя последними — замка нет,
           записи на месте, а оставшийся носитель ничего не открывает. */
        if (carrierTimer) { clearTimeout(carrierTimer); carrierTimer = null; }
        carrierChanged.clear();
        lsDel(LOCK_KEY);
        vaultOpen = false;
        vaultKeys = null;
        carrierKeys = null;
        vaultDoor = -1;
        vaultRole = -1;
        dropMaster();
        carrierDrop();
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
        return ensureCarried(h0).then(function () { return ensureCarried(h1); }).then(function () {
          return factorSecret(fileBytes, fsaltB64);
        }).then(function (fs) {
          return mixFactors(fs, hwNow(rec));
        }).then(function (fsec) {
          return reslotWorlds({ m: h0.m, pw: password, i: h0.i }, h1 ? { m: h1.m, pw: duressPassword, i: h1.i } : null, fsec, function (next) {
            next.factor = { kind: "file", salt: fsaltB64 };
          });
        });
      }).then(scrub, scrubErr);
    },
    clearSecondKey: function (password, fileBytes, duressPassword) {
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
        return ensureCarried(h0).then(function () { return ensureCarried(h1); }).then(function () {
          return mixFactors(null, hwNow(rec));
        }).then(function (fsecNo) {
          return reslotWorlds({ m: h0.m, pw: password, i: h0.i }, h1 ? { m: h1.m, pw: duressPassword, i: h1.i } : null, fsecNo, function (next) {
            delete next.factor;
          });
        });
      }).then(scrub, scrubErr);
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
        return ensureCarried(h0).then(function () { return ensureCarried(h1); }).then(function () {
          return reslotWorlds({ m: h0.m, pw: password, i: h0.i }, h1 ? { m: h1.m, pw: duressPassword, i: h1.i } : null, fsec, function (next) {
            next.kdf = ["PBKDF2-SHA512:" + cost[0], "PBKDF2-SHA256:" + cost[1], a2Label(a2)];
          });
        });
      }).then(scrub, scrubErr);
    },
    /* ── КЛЮЧ УСТРОЙСТВА: состояние, вопрос, привязка, снятие (D-276) ───── */
    hwState: function () { var rec = lockRecord(); var h = hwOf(rec); return { on: !!h, can: hwAvailable(), synced: h && typeof h.synced === "boolean" ? h.synced : null }; },
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
            return ensureCarried(h0).then(function () { return ensureCarried(h1); }).then(function () {
              return reslotWorlds({ m: master0, pw: password, i: h0.i }, master1 ? { m: master1, pw: duressPassword, i: h1.i } : null, fsecNew, function (next) {
                next.hw = { kind: "webauthn-prf", id: b64(new Uint8Array(cred.rawId)), salt: b64(prfSalt), rp: rp };
                if (syncedFlag === true) next.hw.synced = true; else if (syncedFlag === false) next.hw.synced = false;
              });
            }).then(function (okp) {
              hwSecret = secret;
              master0.fill(0); if (master1) master1.fill(0);
              return okp;
            });
          });
        });
      }).then(scrub, scrubErr);
    },
    hwRemove: function (password, secondKeyFile, duressPassword) {
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
          return ensureCarried(h0).then(function () { return ensureCarried(h1); }).then(function () {
            return reslotWorlds({ m: master0, pw: password, i: h0.i }, master1 ? { m: master1, pw: duressPassword, i: h1.i } : null, fileSec, function (next) {
              delete next.hw;
            });
          }).then(function (okp) {
            hwSecret = null;
            master0.fill(0); if (master1) master1.fill(0);
            return okp;
          });
        });
      }).then(scrub, scrubErr);
    },

    /* Сделан ли этот замок ценой с памятью — видно в его записи и так. */
    strong: function () { var rec = lockRecord(); return !!(rec && costOf(rec)[2]); },

    setDuress: function (mainPassword, duressPassword, secondKeyFile) {
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (String(duressPassword || "").length < 4) return Promise.reject(new Error("short"));
      if (String(duressPassword) === String(mainPassword)) return Promise.reject(new Error("same"));
      return enterOrConfirm(mainPassword, secondKeyFile).then(function (door) {
        if (door < 0) return false;
        if (door !== 0) return true;          /* см. выше: молча и «готово» */
        var m = new Uint8Array(32);
        window.crypto.getRandomValues(m);
        return carrierRead().then(function (c) {
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
            return sealRegion(m, k1.slot, null, new Map(), 1).then(function (sealed) { var puts = {}; puts[1 - vaultDoor] = sealed; return carrierPut(puts, null, null); });
          });
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
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      return enterOrConfirm(mainPassword, secondKeyFile).then(function (door) {
        if (door < 0) return false;
        if (door !== 0) return true;
        var mine = vaultDoor, theirs = 1 - vaultDoor;
        return carrierJob(function () { return carrierPut({}, [theirs], null); }).then(function () {
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
        return ensureCarried(hit).then(function () { return codeKeys(code, saltOf(rec), null); }).then(function (ck) {
          return carrierJob(function () {
            return readOwn(hit.i, m, 0).then(function (own) {
              return sealRegion(m, hit.slot, { slot: ck.slot, bits: ck.bits }, own.kv, 0);
            }).then(function (sealed) { var puts = {}; puts[hit.i] = sealed; return carrierPut(puts, null, null); });
          }).then(function () {
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
      var rec = lockRecord();
      if (!rec) return Promise.reject(new Error("no-lock"));
      if (String(newPassword || "").length < 4) return Promise.reject(new Error("short"));
      var sp = rec.spare || null, c = null, eff = rec;
      /* Ключи кода пробуются ВСЕ, всегда: щель кода в каждой ячейке, прежняя
         запасная дверь в записи замка и её копия в резерве (если первым
         переехал второй мир — по ней код находит ячейку, куда вернуть
         главный). */
      return (rec.carrier ? carrierRead().then(function (x) { return x || carrierMem; }) : Promise.resolve(null)).then(function (car) {
        c = car;
        eff = withParams(rec, c && c.params);
        return codeKeys(code, saltOf(eff), sp && sp.kdf);
      }).then(function (ck) {
        ck.bits.fill(0);
        var fromCarrier = c ? slotCandidates(c, ck.slot, "code").then(function (cands) { return carrierMatch(c, cands); }) : Promise.resolve(null);
        var fromRecord = sp ? (function () {
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
        var located = hit.src !== "find" ? Promise.resolve(hit) :
          carrierMatch(c, [new Uint8Array(hit.m), new Uint8Array(hit.m)]).then(function (h) {
            if (h) h.m.fill(0);
            if (!h || h.role !== 0) return null;
            hit.i = h.i; hit.src = "carrier";
            return hit;
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
            hit.slot = wk.slot; hit.params = params; hit.c = c;
            var world = hit.src === "carrier"
              ? readOwn(hit.i, hit.m, hit.role).then(function (w) { return { kv: w.kv, own: null }; })
              : subkeys(hit.m).then(legacyWorld);
            return world.then(function (w) {
              /* Код расходуется: щель кода новой ячейки — шум, ключа кода в теле нет.
                 Со вторым ключом был сделан и второй мир — открыть его больше нечем. */
              return carrierJob(function () {
                if (hit.src === "carrier") {
                  return sealRegion(hit.m, wk.slot, null, w.kv, hit.role).then(function (sealed) {
                    var puts = {}; puts[hit.i] = sealed;
                    return carrierPut(puts, hadFactor ? [1 - hit.i] : null, params).then(function () { return { cell: hit.i, rec: null }; });
                  });
                }
                /* Код расходуется: щель кода ячейки, найденной переездом, не переносится. */
                hit.dropCode = true;
                return moveWorld(hit, w.kv).then(function (mv) {
                  if (mv.code) mv.code.fill(0);
                  return (hadFactor ? carrierPut({}, [1 - mv.cell], params) : Promise.resolve()).then(function () { return mv; });
                });
              }).then(function (mv) {
                if (!w.own && !mv.rec) return mv;
                return subkeys(hit.m).then(function (ks) { return finishMove(ks, w.own, mv.rec, mv.cell, hit.role); }).then(function () { return mv; });
              });
            });
          }).then(function (mv) {
            hit.m.fill(0);
            if (hadFactor) hwSecret = null;
            var next = withParams(lockRecord() || rec, params);
            if (!next.carrier) next.carrier = CARRIER_REGIONS * CARRIER_REGION;
            delete next.spare;
            if (hadFactor) {
              if (Array.isArray(next.doors)) next.doors = [randomDoor(), randomDoor()];
              if (next.knock && Array.isArray(next.knock.wrap) && next.knock.wrap[mv.cell]) next.knock.wrap[1 - mv.cell] = knockNoise(next.knock.wrap[mv.cell]);
            }
            lsSet(LOCK_KEY, JSON.stringify(next));
            return window.sbVault.unlock(newPassword);
          }, function (e) { hit.m.fill(0); throw e; }).then(function (okp) {
            if (okp) markSpare(false);
            return okp;
          });
        });
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
          return carrierJob(function () {
            return withMaster(function (m) {
              return withCode(function (code) {
                return readOwn(r, m, vaultRole).then(function (own) { return sealRegion(m, k.slot, code, own.kv, vaultRole); });
              });
            }).then(function (sealed) { var puts = {}; puts[r] = sealed; return carrierPut(puts, null, null); });
          }).then(function () { carrierWordSlot = k.slot; return true; });
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
            var kv = new Map();
            pairs.forEach(function (p) { kv.set(p.k, p.v); });
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

  var rawStore = {
    get: window.localStorage.getItem,
    set: window.localStorage.setItem,
    del: window.localStorage.removeItem
  };
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
        /* После ухода и очистки (D-174, D-350) голос у диска, а не у памяти
           сеанса: память уходящего мира не выдаётся за то, что лежит. */
        if (vaultOpen && !window.sbVanishing && mem.has(String(k))) return mem.get(String(k));
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
