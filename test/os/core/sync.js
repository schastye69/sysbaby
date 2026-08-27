/* ═══════════════════════════════════════════════════════════════════════════
   СИНХРОНИЗАЦИЯ РЕЗЕРВНЫХ КОПИЙ · решение D-172

   ПОВОД, дословно от основателя 27.08.2026: «необходимо сделать так, чтобы бы
   параллельно с экспорт и импорт файла существовала синхронизация, которая
   будет как можно чаще сохранять резервную копию (синхронизация в пустоту
   работать не должна)? и чтобы она работала автоматически, но с возможностью
   отключения». И следом, второй раз: «синхронизация резервных копий (нужна
   настоящая папка — синхронизация в пустоту работать не будет, как Вы и
   сказали)».

   ГЛАВНОЕ ПРАВИЛО, ЕГО СЛОВАМИ: В ПУСТОТУ НЕ РАБОТАЕТ. У синхронизации должна
   быть НАСТОЯЩАЯ ЦЕЛЬ — папка на устройстве, которую человек выбрал сам. Без
   неё синхронизация не включается, не изображает работу и говорит, чего ей не
   хватает. Копия, лежащая в том же браузере, что и оригинал, — не копия: одна
   чистка браузера уносит обе. Такую «синхронизацию» Совет писать не станет.

   ЧЕМ ЭТО СДЕЛАНО. File System Access: showDirectoryPicker даёт указатель на
   папку, и указатель ХРАНИТСЯ (в indexedDB, склад handles) — значит разрешение
   переживает перезагрузку, и человека не спрашивают каждый раз. Браузеры без
   этого умения названы прямо: там синхронизации нет, есть ручная выгрузка.
   Так честнее, чем писать копии в то же хранилище и звать это копиями.

   ЧТО ПИШЕТСЯ. Кольцо из трёх поколений плюс свежая копия под постоянным
   именем. Три — не украшение: беда, замеченная на другой день, лечится только
   вчерашним снимком, а одна перезаписываемая копия хранит ровно последнюю
   ошибку. Порядок записи — сперва новое поколение, потом постоянное имя:
   обрыв питания посередине оставляет целым хотя бы одно.

   КОПИИ НАСЛЕДУЮТ ЗАМОК. Пока замок стоит, в папку уходит КОНВЕРТ, а не
   открытый текст: замок на диске и открытая копия рядом — это не замок.
   Открывается такая копия тем же паролем, и об этом сказано в окне.

   КАК ЧАСТО. «Как можно чаще» имеет цену: каждая запись — это сериализация
   всего профиля и обращение к диску. Поэтому пишется НЕ ПО ЧАСАМ, А ПО
   ИЗМЕНЕНИЮ: раз в двадцать секунд снимается дешёвый отпечаток хранилища, и
   запись идёт только если он другой. Плюс немедленно — когда вкладку прячут
   или закрывают: это последний миг, когда мы ещё живы.

   Охраняется tools/backup-sync-check.mjs.
   ═════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var ON_KEY = "sysbaby.backup.on";
  var STATE_KEY = "sysbaby.backup.state";
  var HANDLE_ID = "backup-dir";
  var RING = 3;
  var TICK = 20000;              /* как часто СМОТРИМ, не как часто пишем */
  var MIN_GAP = 45000;           /* и не чаще этого — у записи есть цена */
  var FILE_MAIN = "sysbaby-backup.json";

  var dirHandle = null;
  var timer = null;
  var lastPrint = null;
  var lastWrite = 0;
  var busy = false;

  function supported() {
    return typeof window.showDirectoryPicker === "function";
  }
  function readState() {
    try { return JSON.parse(localStorage.getItem(STATE_KEY) || "null") || {}; }
    catch (e) { return {}; }
  }
  function writeState(patch) {
    var st = readState();
    for (var k in patch) if (Object.prototype.hasOwnProperty.call(patch, k)) st[k] = patch[k];
    try { localStorage.setItem(STATE_KEY, JSON.stringify(st)); } catch (e) { /* ignore */ }
    if (window.sbBus && window.sbBus.emit) window.sbBus.emit("backup:change", st);
    return st;
  }
  function isOn() {
    try { return localStorage.getItem(ON_KEY) === "1"; } catch (e) { return false; }
  }

  /* Пока замок заперт и не открыт, система не видит своих данных — писать
     копию было бы записью ПУСТОТЫ поверх настоящей. Тот же дефект, что нашёл
     закон замка (D-164), только с другой стороны. */
  function dataReadable() {
    var V = window.sbVault;
    if (!V || !V.isLocked()) return true;
    return !!V.isOpen();
  }

  /* Дешёвый отпечаток: длины значений, а не значения. Считать хеш всего
     профиля двадцать раз в минуту дороже, чем сама запись. */
  function fingerprint() {
    var n = 0, sum = 0, i, k, v;
    try {
      for (i = 0; i < localStorage.length; i++) {
        k = localStorage.key(i);
        if (!k || k.indexOf("sysbaby.") !== 0) continue;
        if (k === STATE_KEY) continue;          /* своё же эхо не считается */
        v = localStorage.getItem(k);
        n++;
        sum += (v ? v.length : 0) + k.length;
      }
    } catch (e) { return null; }
    return n + ":" + sum;
  }

  function payload() {
    if (typeof window.sbExportProfile !== "function") return Promise.reject(new Error("no-export"));
    var text = JSON.stringify(window.sbExportProfile(), null, 1);
    var V = window.sbVault;
    if (V && V.isLocked() && V.isOpen() && typeof V.seal === "function") {
      return V.seal(text).then(function (env) {
        return { text: env, sealed: true };
      });
    }
    return Promise.resolve({ text: text, sealed: false });
  }

  function ensurePermission(interactive) {
    if (!dirHandle) return Promise.resolve(false);
    if (typeof dirHandle.queryPermission !== "function") return Promise.resolve(true);
    return dirHandle.queryPermission({ mode: "readwrite" }).then(function (st) {
      if (st === "granted") return true;
      if (!interactive) return false;
      /* Спросить заново можно только по прямому действию человека — поэтому
         кнопка «проверить папку» в окне аккаунта существует и нужна. */
      return dirHandle.requestPermission({ mode: "readwrite" }).then(function (st2) {
        return st2 === "granted";
      });
    })["catch"](function () { return false; });
  }

  function writeFile(name, text) {
    return dirHandle.getFileHandle(name, { create: true }).then(function (fh) {
      return fh.createWritable().then(function (w) {
        return w.write(text).then(function () { return w.close(); });
      });
    });
  }

  function saveNow(interactive) {
    if (busy) return Promise.resolve({ skipped: "busy" });
    if (!dirHandle) return Promise.resolve({ skipped: "no-folder" });
    if (!dataReadable()) return Promise.resolve({ skipped: "locked" });
    busy = true;
    return ensurePermission(!!interactive).then(function (okp) {
      if (!okp) {
        writeState({ lastErr: "permission", lastErrAt: Date.now() });
        return { skipped: "permission" };
      }
      return payload().then(function (p) {
        var st = readState();
        var ring = ((st.ring || 0) % RING) + 1;
        var gen = "sysbaby-backup-" + ring + ".json";
        /* Сперва поколение, потом постоянное имя: обрыв посередине оставляет
           целым хотя бы одно. Наоборот было бы наоборот. */
        return writeFile(gen, p.text)
          .then(function () { return writeFile(FILE_MAIN, p.text); })
          .then(function () {
            lastWrite = Date.now();
            lastPrint = fingerprint();
            writeState({
              ring: ring, lastOk: lastWrite, bytes: p.text.length,
              sealed: !!p.sealed, lastErr: null, dirName: dirHandle.name || ""
            });
            return { ok: true, sealed: !!p.sealed, bytes: p.text.length };
          });
      });
    })["catch"](function (e) {
      writeState({ lastErr: String((e && e.message) || e), lastErrAt: Date.now() });
      return { error: String((e && e.message) || e) };
    }).then(function (r) { busy = false; return r; });
  }

  function tick() {
    if (!isOn() || !dirHandle || !dataReadable()) return;
    var print = fingerprint();
    if (print == null || print === lastPrint) return;
    if (Date.now() - lastWrite < MIN_GAP) return;
    saveNow(false);
  }

  function start() {
    stop();
    if (!isOn() || !dirHandle) return;
    lastPrint = fingerprint();
    timer = setInterval(tick, TICK);
  }
  function stop() {
    if (timer) { clearInterval(timer); timer = null; }
  }

  /* Последний миг, когда мы ещё живы: вкладку прячут или закрывают. Здесь
     ждать нечего — пишем сразу, если было что писать. */
  function onLeave() {
    if (!isOn() || !dirHandle || !dataReadable()) return;
    if (fingerprint() === lastPrint) return;
    saveNow(false);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") onLeave();
  });
  window.addEventListener("pagehide", onLeave);

  window.sbBackup = {
    supported: supported,
    isOn: isOn,
    /* Есть ли НАСТОЯЩАЯ цель. Без неё синхронизация не включается — это и
       есть «в пустоту не работает», записанное как условие, а не как совет. */
    hasFolder: function () { return !!dirHandle; },
    folderName: function () { return dirHandle ? (dirHandle.name || "") : ""; },
    state: readState,

    /* Выбрать папку. Только по действию человека: браузер иначе не спросит. */
    chooseFolder: function () {
      if (!supported()) return Promise.reject(new Error("unsupported"));
      return window.showDirectoryPicker({ id: "sysbaby-backup", mode: "readwrite" })
        .then(function (h) {
          dirHandle = h;
          if (window.sbIdb) window.sbIdb.put("handles", { id: HANDLE_ID, handle: h });
          writeState({ dirName: h.name || "", lastErr: null });
          return true;
        });
    },
    forgetFolder: function () {
      dirHandle = null;
      stop();
      try { localStorage.setItem(ON_KEY, "0"); } catch (e) { /* ignore */ }
      if (window.sbIdb) window.sbIdb.put("handles", { id: HANDLE_ID, handle: null });
      writeState({ dirName: "", lastErr: null });
      return true;
    },

    /* Включить нельзя, пока нет папки: отказ — это и есть правило. */
    setOn: function (on) {
      if (on && !dirHandle) return Promise.resolve(false);
      try { localStorage.setItem(ON_KEY, on ? "1" : "0"); } catch (e) { /* ignore */ }
      if (on) { start(); return saveNow(true).then(function () { return true; }); }
      stop();
      writeState({});
      return Promise.resolve(true);
    },
    saveNow: function () { return saveNow(true); },

    /* Восстановление указателя после перезагрузки. Разрешение может быть в
       состоянии «спросить» — тогда папка есть, но писать нельзя до первого
       действия человека, и окно аккаунта говорит именно это. */
    resume: function () {
      if (!supported() || !window.sbIdb) return Promise.resolve(false);
      return window.sbIdb.get("handles", HANDLE_ID).then(function (rec) {
        if (!rec || !rec.handle) return false;
        dirHandle = rec.handle;
        return ensurePermission(false).then(function (okp) {
          writeState({ dirName: dirHandle.name || "", permission: okp ? "granted" : "prompt" });
          if (isOn()) start();
          return true;
        });
      })["catch"](function () { return false; });
    },
    permission: function () {
      if (!dirHandle || typeof dirHandle.queryPermission !== "function") {
        return Promise.resolve(dirHandle ? "granted" : "none");
      }
      return dirHandle.queryPermission({ mode: "readwrite" })["catch"](function () { return "denied"; });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { window.sbBackup.resume(); });
  } else {
    window.sbBackup.resume();
  }
})();
