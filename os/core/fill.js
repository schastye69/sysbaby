/* sys.baby OS — core/fill.js
 * ── СКЛАД ЗАВОДИТСЯ ШУМОМ НЕ В ГЛАВНОМ ПОТОКЕ (D-1356) ─────────────────────
 * ПОВОД, дословно от основателя 22.11.2026: «на любом устройстве регистрация и
 * вход должны работать быстро… нажимаешь „войти“ или „зарегистрироваться“ —
 * всё зависает». О складе: «чтобы было быстро И безопасно».
 *
 * ЧТО ЭТО. Поток (Web Worker), который делает ровно то же, что делал главный
 * поток в thEnsure (core/store.js): кладёт в склад «carrier» базы «sysbaby»
 * TH_CHUNKS частей шума по мебибайту, каждая — своей транзакцией, и каждая
 * сперва спрашивает, нет ли уже печатей («tmac»); печати — последними. Шум —
 * crypto.getRandomValues того же браузера, ничего своего. Слова поток не
 * знает никогда. Второе дело потока — шифр частей половины склада
 * (thSealChunk): AES-CTR самого браузера, ключом страницы, который приходит
 * сюда неизвлекаемым объектом — байтов ключа нет и здесь. Печать (HMAC)
 * склада мира поток не ставит: её ставит страница под своим правом писателя.
 * Печатает поток только выбрасываемую базу пустого хода «sysbaby-pad» (D-1357).
 *
 * ПОЧЕМУ ОТДЕЛЬНЫЙ ФАЙЛ. Заголовок страницы разрешает потоки только из своего
 * адреса (worker-src 'self'); поток из Blob запрещён (page-strictness-check).
 * Файл поднимается заранее — когда открыто окно первого слова, до нажатия.
 *
 * ЗАЧЕМ. Склад (256 МиБ) заводится параллельно с растяжкой слова, а не после
 * неё: время до стола — примерно большее из двух, а не их сумма. Стол
 * открывается только после того, как склад лёг (замок ждёт его, как прежде).
 */
(function () {
  "use strict";
  if (typeof window !== "undefined" || typeof self === "undefined" || typeof self.postMessage !== "function") return;
  function noise(n) {
    var u = new Uint8Array(n), off;
    for (off = 0; off < n; off += 65536) self.crypto.getRandomValues(u.subarray(off, Math.min(n, off + 65536)));
    return u.buffer;
  }
  function open(name, version) {
    return new Promise(function (resolve) {
      var req;
      try { req = self.indexedDB.open(name, version); } catch (e) { resolve(null); return; }
      /* Базу заводит и поднимает только страница: здесь — никогда. */
      req.onupgradeneeded = function () { try { req.transaction.abort(); } catch (e) { /* ignore */ } };
      req.onsuccess = function () {
        var db = req.result;
        try { db.onversionchange = function () { try { db.close(); } catch (e) { /* ignore */ } }; } catch (e) { /* ignore */ }
        resolve(db);
      };
      req.onerror = function () { resolve(null); };
      req.onblocked = function () { resolve(null); };
    });
  }
  function one(db, store, macId, id, bytes) {
    return new Promise(function (resolve) {
      var tx;
      try { tx = db.transaction(store, "readwrite"); } catch (e) { resolve("fail"); return; }
      var s = tx.objectStore(store), seen = false;
      var g = s.get(macId);
      g.onsuccess = function () { if (g.result && g.result.bytes) { seen = true; return; } s.put({ id: id, bytes: bytes }); };
      tx.oncomplete = function () { resolve(seen ? "seen" : "ok"); };
      tx.onerror = function () { resolve("fail"); };
      tx.onabort = function () { resolve("fail"); };
    });
  }
  /* Шифр одной части склада (core/store.js thSealChunk): AES-CTR самого
     браузера, ключом страницы (неизвлекаемым). Открытая часть обнуляется здесь
     же, как только зашифрована. ПЕЧАТИ поток НЕ ставит: печать (HMAC) — дело
     страницы, под её правом писателя (один писатель, D-353; закон
     one-writer-check держит печать в странице) — поток только возвращает шифр. */
  function seal(d) {
    var subtle = self.crypto.subtle, plain = d.plain ? new Uint8Array(d.plain) : new Uint8Array(d.size);
    subtle.encrypt({ name: "AES-CTR", counter: new Uint8Array(d.counter), length: 64 }, d.ctr, plain).then(function (ct) {
      plain.fill(0);
      self.postMessage({ id: d.id, ok: true, ct: ct }, [ct]);
    }).then(null, function (e) { plain.fill(0); self.postMessage({ id: d.id, ok: false, err: String((e && e.message) || e) }); });
  }
  /* Пустой ход окна первого слова (D-1357, база «sysbaby-pad», ключи этой минуты, мира в ней нет): шифр и печать
     здесь, как было, — чтобы ход стоил того же, что прежде. Склад мира сюда не попадает никогда (op «seal»). */
  function padSeal(d) {
    var subtle = self.crypto.subtle, plain = d.plain ? new Uint8Array(d.plain) : new Uint8Array(d.size);
    subtle.encrypt({ name: "AES-CTR", counter: new Uint8Array(d.counter), length: 64 }, d.ctr, plain).then(function (ct) {
      plain.fill(0);
      var c = new Uint8Array(ct), head = new Uint8Array(d.head), inp = new Uint8Array(head.length + c.length);
      inp.set(head, 0); inp.set(c, head.length);
      return subtle.sign("HMAC", d.mac, inp).then(function (tag) {
        self.postMessage({ id: d.id, ok: true, ct: ct, tag: tag }, [ct, tag]);
      });
    }).then(null, function (e) { plain.fill(0); self.postMessage({ id: d.id, ok: false, err: String((e && e.message) || e) }); });
  }
  var stop = false;
  self.onmessage = function (ev) {
    var d = ev.data || {};
    if (d.op === "stop") { stop = true; return; }
    if (d.op === "ping") { self.postMessage({ id: d.id, ok: true }); return; }
    if (d.op === "seal") { seal(d); return; }
    if (d.op === "padseal") { padSeal(d); return; }
    if (d.op !== "fill") return;
    stop = false;
    open(d.db, d.version).then(function (db) {
      if (!db) { self.postMessage({ id: d.id, ok: false, err: "no-db" }); return; }
      var i = 0, mine = [];
      function next() {
        if (stop) return Promise.resolve("fail");
        if (i >= d.chunks) return one(db, d.store, d.macId, d.macId, noise(d.macLen));
        var id = d.prefix + i; i++;
        return one(db, d.store, d.macId, id, noise(d.chunk)).then(function (r) {
          if (r !== "ok") return r;
          mine.push(id);
          return next();
        });
      }
      next().then(function (r) {
        try { db.close(); } catch (e) { /* ignore */ }
        self.postMessage({ id: d.id, ok: true, r: r, mine: mine });
      });
    });
  };
})();
