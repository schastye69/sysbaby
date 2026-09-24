/* ═══════════════════════════════════════════════════════════════════════════
   ПЕРЕДАЧА ИЗ КОМНАТЫ В КОМНАТУ · решение D-240 · шаг второй из четырёх

   ПОВОД, дословно от основателя 19.09.2026: «также прошу совет довести
   структуру sys.baby до полноценной операционной системы».

   ЗАМЕР, С КОТОРОГО ВСЁ НАЧАЛОСЬ. Опись пола (D-239) показала: вещи человека
   лежат по островам, и ни одна комната не читает вещи другой — ни разу.
   Общего «открыть в…» в системе НЕ БЫЛО ВОВСЕ. Были две частные
   односторонние двери, заведённые по случаю: sbAddQuickNote (кто угодно →
   Записи) и sbFilesSeedDocument (кто-то → Хранилище). Ни та ни другая не
   объявлена, не видна человеку и не знает о существовании второй.

   ПОЧЕМУ НЕ ТРЕТЬЯ ТАКАЯ ЖЕ. Частный ход дешевле общего ровно один раз — в
   тот день, когда его пишут. Дальше каждая новая пара комнат стоит ещё
   одного хода, и однажды их становится столько, что человек не может знать,
   что куда передаётся, а Совет не может это пересчитать. Так уже вышло с
   размером буквы, плотностью чернил и отступом комнаты (D-230, D-234,
   D-236): величина без имени расходится. Здесь то же самое, только вместо
   величины — действие.

   ЧТО ЗДЕСЬ. Одно место, которое отвечает на три вопроса:
     какие бывают вещи          sbHand.kinds()
     кто возьмёт такую вещь     sbHand.roomsFor(kind)
     передать                   sbHand.give(roomId, thing)

   РЕЕСТР СПРАШИВАЕТСЯ У КОМНАТ, А НЕ ПИШЕТСЯ ЗДЕСЬ СПИСКОМ (D-200/D-201).
   Комната объявляет при регистрации:

       registerApp("files", { takes: ["запись", "файл"], take: function (thing) {…} })

   и этого довольно: новая комната начинает принимать вещи, не трогая этот
   файл. Списка имён здесь нет и быть не должно.

   ОБЪЯВИТЬ МАЛО — НАДО УМЕТЬ. Комната попадает в ответ roomsFor ТОЛЬКО если
   у неё есть и объявление takes, и настоящий приёмник take. Объявление без
   приёмника — это обещание двери, которая не открывается; человек нажмёт и
   ничего не произойдёт. Такая комната в список не попадает, и закон
   tools/hand-check.mjs проверяет это мутантом.

   ЧТО ТАКОЕ ВЕЩЬ. { kind, name, text } — род, имя и содержимое. Больше
   ничего: вещь, которая тащит за собой устройство своей комнаты, не вещь,
   а привязка. С D-267 — ещё source, обратный адрес {room, id, v, at}: его
   форму задаёт ЯДРО, а не комната, и принимающий хранит его не разбирая.

   Охраняется tools/hand-check.mjs.
   ═════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  function apps() { return (window.SysBaby && window.SysBaby.apps) || {}; }
  function order() { return (window.SysBaby && window.SysBaby.order) || []; }
  function title(id) { return window.sbAppTitle ? window.sbAppTitle(id) : id; }

  /* Комната умеет принимать, если ОБЪЯВИЛА род и ИМЕЕТ приёмник. */
  function canTake(def, kind) {
    if (!def || typeof def.take !== "function") return false;
    var list = def.takes;
    if (!Array.isArray(list) || !list.length) return false;
    return list.indexOf(kind) !== -1;
  }

  window.sbHand = {
    /* Все роды вещей, которые хоть кто-то принимает. Спрошено, не записано. */
    kinds: function () {
      var reg = apps(), out = [];
      order().forEach(function (id) {
        var def = reg[id];
        if (!def || typeof def.take !== "function" || !Array.isArray(def.takes)) return;
        def.takes.forEach(function (k) { if (out.indexOf(k) === -1) out.push(k); });
      });
      return out;
    },

    /* Кто возьмёт вещь такого рода. Комната, отдающая вещь, себя не
       предлагает: «передать в то же место» — не передача. */
    roomsFor: function (kind, fromId) {
      var reg = apps(), out = [];
      order().forEach(function (id) {
        if (fromId && id === fromId) return;
        if (!canTake(reg[id], kind)) return;
        out.push({ id: id, title: title(id) });
      });
      return out;
    },

    /* Передать. Возвращает правду только тогда, когда комната ВЗЯЛА:
       приёмник обязан вернуть ложь, если не смог, и мы не сочиняем успех. */
    give: function (roomId, thing) {
      if (!thing || !thing.kind) return false;
      var def = apps()[roomId];
      if (!canTake(def, thing.kind)) return false;
      var got = false;
      try { got = def.take(thing) !== false; }
      catch (e) { console.error("[hand] " + roomId + " не взял вещь", e); return false; }
      if (!got) return false;
      if (window.sbBus && window.sbBus.emit) {
        window.sbBus.emit("hand:given", { to: roomId, kind: thing.kind, name: thing.name || "" });
      }
      return true;
    }
  };

  /* ── ЖИВАЯ КОПИЯ (D-267) ─────────────────────────────────────────────
     Вещь, переданная из комнаты в комнату, остаётся КОПИЕЙ — и это выбор:
     общий пол отнял бы у человека право держать свою версию. Беда была в
     другом: человек не узнавал, что источник с тех пор изменился. Теперь
     вещь несёт source — {room, id, v, at}: откуда, какой предмет, отпечаток
     переданного текста и когда. Комната-источник объявляет current(id) —
     какая вещь у неё сейчас ({name, text} или null, если её больше нет), —
     и копия отвечает одним из трёх: same · changed · gone. Решает человек:
     новая версия берётся касанием, а не приезжает сама.
     Отпечаток — FNV-1a по тексту: он не тайна и не подпись, он отвечает
     ровно на один вопрос — «тот же ли это текст». */
  function sign(text) {
    var h = 0x811c9dc5, str = String(text == null ? "" : text), i;
    for (i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return ("0000000" + (h >>> 0).toString(16)).slice(-8);
  }
  function fmt(str, vars) {
    return String(str).replace(/\{(\w+)\}/g, function (m, k) { return vars && vars[k] != null ? String(vars[k]) : m; });
  }
  window.sbHand.sign = sign;
  window.sbHand.source = function (room, id, text) {
    return { room: String(room), id: String(id), v: sign(text), at: Date.now() };
  };
  window.sbHand.current = function (src) {
    if (!src || !src.room) return undefined;
    var def = apps()[src.room];
    if (!def || typeof def.current !== "function") return undefined;
    try { return def.current(src.id); } catch (e) { return undefined; }
  };
  window.sbHand.state = function (src) {
    var cur = window.sbHand.current(src);
    if (cur === undefined) return "unknown";
    if (!cur) return "gone";
    return sign(cur.text) === src.v ? "same" : "changed";
  };
  window.sbHand.sourceHtml = function (src) {
    if (!src || !src.room) return "";
    var st = window.sbHand.state(src);
    var d = new Date(src.at || Date.now()).toLocaleDateString();
    var head = fmt(word("hand.src.from", "Скопировано из «{room}» {d}."), { room: title(src.room), d: d });
    var line = st === "same" ? word("hand.src.same", "Совпадает с источником.")
      : st === "changed" ? word("hand.src.changed", "С тех пор источник изменился.")
      : st === "gone" ? word("hand.src.gone", "Источника больше нет — это последняя копия.") : "";
    return '<div class="sb-hand-src" data-state="' + esc(st) + '"><span>' + esc(head + (line ? " " + line : "")) + "</span>" +
      (st === "changed" ? '<button type="button" class="sb-hand-src-take">' + esc(word("hand.src.update", "Взять новую версию")) + "</button>" : "") +
      "</div>";
  };
  /* Касание берёт то, что у источника СЕЙЧАС, — не то, что было при
     отрисовке: между ними могла пройти ещё одна правка. */
  window.sbHand.wireSource = function (host, src, onTake) {
    var btn = host && host.querySelector(".sb-hand-src-take");
    if (!btn || !src) return;
    btn.addEventListener("click", function () {
      var cur = window.sbHand.current(src);
      if (!cur) return;
      onTake(cur, { room: src.room, id: src.id, v: sign(cur.text), at: Date.now() });
    });
  };

  /* ── ОДНА КНОПКА НА ВСЕ КОМНАТЫ ──────────────────────────────────────
     Разметка и проводка живут ЗДЕСЬ, а не в каждой комнате отдельно. Иначе
     «один способ передать» превращается в три похожих способа с разными
     словами и разным поведением — то есть обратно в частные ходы, только с
     общим ядром под ними.
     Комната говорит: вот куда поставить, вот какого рода вещь, вот как её
     собрать. Всё остальное — общее. */
  function esc(s) {
    return window.escapeHtml ? window.escapeHtml(s) : String(s == null ? "" : s);
  }
  function word(key, fallback) {
    var v = window.sbT ? window.sbT(key) : key;
    return (!v || v === key) ? fallback : v;
  }

  /* Разметка. Пусто, если принять вещь некому: не предлагать несуществующего. */
  window.sbHand.menuHtml = function (kind, fromId) {
    var able = window.sbHand.roomsFor(kind, fromId);
    if (!able.length) return "";
    return '<span class="sb-hand">' +
      '<button type="button" class="sb-hand-btn" aria-haspopup="true" aria-expanded="false">' +
      esc(word("hand.to", "Передать в…")) + "</button>" +
      '<span class="sb-hand-menu" hidden>' +
      able.map(function (r) {
        return '<button type="button" class="sb-hand-to" data-to="' + esc(r.id) + '">' + esc(r.title) + "</button>";
      }).join("") + "</span></span>";
  };

  /* Проводка. Второй довод — та самая мерка, которой комната собирает вещь:
     её зовут в миг нажатия, и она отдаёт вещь либо ложь, если отдавать
     нечего. Скобок тут нет нарочно: со скобками это читается как имя
     существующей в дереве функции, и закон комментариев справедливо
     покраснел на такой записи. */
  window.sbHand.wire = function (host, getThing) {
    if (!host) return;
    var box = host.querySelector(".sb-hand");
    if (!box || box.getAttribute("data-wired") === "1") return;
    box.setAttribute("data-wired", "1");
    var btn = box.querySelector(".sb-hand-btn");
    var menu = box.querySelector(".sb-hand-menu");
    if (!btn || !menu) return;
    btn.addEventListener("click", function () {
      var opening = menu.hasAttribute("hidden");
      if (opening) menu.removeAttribute("hidden"); else menu.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", opening ? "true" : "false");
    });
    menu.addEventListener("click", function (ev) {
      var to = ev.target && ev.target.closest ? ev.target.closest("[data-to]") : null;
      if (!to) return;
      menu.setAttribute("hidden", "");
      btn.setAttribute("aria-expanded", "false");
      var thing = null;
      try { thing = getThing(); } catch (e) { thing = null; }
      if (!thing) return;
      var done = window.sbHand.give(to.getAttribute("data-to"), thing);
      if (typeof window.showToast === "function") {
        window.showToast(
          done ? word("hand.done", "Передано") + ": " + to.textContent
               : word("hand.fail", "Не передано"),
          done ? word("hand.doneSub", "Вещь теперь и там. Здесь она тоже остаётся.")
               : word("hand.failSub", "Та комната вещь не взяла, и никто не делает вид, что взяла."),
          "", true);
      }
    });
  };

  /* Контракт объявляется там же, где остальные (§12). */
  if (window.sbContracts && Array.isArray(window.sbContracts.declared)) {
    window.sbContracts.declared.push(
      { name: "sbHand", file: "core/hand.js", args: "-", returns: "{kinds,roomsFor,give,menuHtml,wire}" }
    );
  }
})();
