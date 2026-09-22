/* ═══════════════════════════════════════════════════════════════════════════
   ЧТО СЕЙЧАС ЖИВО · решение D-243 · шаг четвёртый из четырёх

   ПОВОД, дословно от основателя 19.09.2026: «также прошу совет довести
   структуру sys.baby до полноценной операционной системы».

   ЗАМЕР, С КОТОРОГО ВСЁ НАЧАЛОСЬ. Система знает о себе много: сколько окон
   открыто, сколько записей лежит, сколько писем не прочитано. И НЕ ЗНАЕТ
   ГЛАВНОГО — какая комната делает свою работу, а какая показывает, как было
   бы. Четыре комнаты сознаются в этом честно и НЕВИДИМО, комментарием
   внутри своего файла:

     Письма     «без сервера некуда отправить и неоткуда получить»
     Переписка  «разговор не с кем вести. Собеседник здесь нарисован»
     Браузер    «большинство сайтов запрещают себя показывать так»
     Стенд      «там проверяют, возможна ли вещь»

   Признания правдивы. Но спросить их нельзя: ни человек, ни Совет не могут
   задать системе вопрос «что у тебя живо». Правило самого основателя
   (D-186) — «приложение, которое не может делать свою работу, — не
   приложение, а КАРТИНКА приложения» — оказалось нечем применить.

   ЧТО ЗДЕСЬ. Одно место, которое отвечает на четыре вопроса:
     какие бывают нужды        sbAlive.needs()
     есть ли эта прямо сейчас  sbAlive.check(need)
     что с этой комнатой       sbAlive.room(id)
     что со всеми              sbAlive.all()

   ГЛАВНОЕ ПРАВИЛО: ОТВЕТ ИЗМЕРЯЕТСЯ, А НЕ ОБЪЯВЛЯЕТСЯ. Комната называет,
   ЧТО ЕЙ НУЖНО, — и только. Есть ли это, решает прибор. Комната, сказавшая
   «я живая», не сказала ничего: живость — не мнение о себе.

   ТРИ ОТВЕТА, А НЕ ДВА. «есть» · «нет» · «нечем проверить». Третье
   состояние перенесено сюда из законов (tools/_provable.mjs) нарочно.
   Живого собеседника на том конце машина измерить НЕ МОЖЕТ ничем: нет
   такого запроса, который отличил бы молчащего человека от отсутствующего.
   Сказать «есть» — солгать. Сказать «нет» — тоже солгать, и обиднее.
   Сказать «нечем проверить» и назвать причину — единственное честное.

   ЧЕГО ЗДЕСЬ НЕТ И НЕ БУДЕТ. Система НЕ ходит наружу, чтобы узнать о себе.
   «Почтальон назван» значит, что адрес есть и он один (сверено с описью
   выходов, D-221), а не что письмо дойдёт: узнать это можно только
   попыткой отправить, а отправлять без человека система не станет (D-221).
   Разницу между «адрес есть» и «письмо дойдёт» обязан знать тот, кто
   читает ответ, — поэтому она сказана и здесь, и в терминале.

   КАК ЭТОТ ФАЙЛ УЖЕ ОШИБСЯ ОДИН РАЗ, И УРОК ДОРОЖЕ САМОГО МЕХАНИЗМА.
   Первая редакция дала Письмам нужды «диск» и «почтальон». Оба прибора
   сказали «есть», и система объявила Письма ЖИВЫМИ — при том что сами
   Письма сознаются в своей же строке: работы не делают, отправить некуда и
   получить неоткуда. Механизм отработал безупречно и выдал НЕПРАВДУ,
   потому что нужда была названа не та: почтальон умеет только уносить, а
   для работы нужна обратная дорога — свой сервер.
   ПРИЗНАНИЕ КОМНАТЫ ПРОТИВ СЕБЯ — САМОЕ НАДЁЖНОЕ, ЧТО ЕСТЬ У СИСТЕМЫ.
   Расходится с ним замер — виноват замер, а не признание. Теперь это
   проверяет закон: комната, сказавшая «я не делаю работу», не может быть
   названа живой ни при каком стечении приборов.

   ИМЁН КОМНАТ ЗДЕСЬ НЕТ НИ ОДНОГО. Нужды спрашиваются у комнат при
   регистрации:

       registerApp("mail", {
         needs:   ["диск", "почтальон", "свой сервер"],
         offDesk: "не делает работу",        // или "открывается вещью"
         why:     "человеческая фраза, почему у неё нет значка"
       })

   Охраняется tools/alive-check.mjs.
   ═════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var YES = "есть", NO = "нет", DUNNO = "нечем проверить";
  var DISK = "диск", NET = "сеть", POST = "почтальон", FOLDER = "папка", PEER = "собеседник";
  var SERVER = "свой сервер", CONSENT = "чужое согласие";

  function apps() { return (window.SysBaby && window.SysBaby.apps) || {}; }
  function everyRoom() { return Object.keys(apps()); }
  /* ОБЪЯСНЕНИЕ ПРИБОРА — НА ЯЗЫКЕ ЧЕЛОВЕКА (D-253). Приборы объясняли себя
     по-русски, и терминал печатал это в английский ответ. Слово идёт через
     словарь; нет словаря — остаётся ключ, и закон one-alphabet-check это
     увидит как незнакомое. */
  function say(key, vars) { return window.sbT ? window.sbT(key, vars) : key; }
  function list(def, field) {
    var v = def && def[field];
    return Array.isArray(v) ? v : [];
  }

  /* ── ПРИБОРЫ ──────────────────────────────────────────────────────────
     Каждый отвечает одним из трёх слов и объясняет, ЧТО ИМЕННО он померил.
     Объяснение — не украшение: прибор, чей ответ нельзя пересказать, через
     месяц начинает значить не то, что значил. */
  var probes = {};

  /* ДИСК измеряется ПИСЬМОМ И ЧТЕНИЕМ, а не наличием объявления: комната,
     объявившая себе место, и комната, которая может в него писать, — разные
     комнаты, и вторая узнаётся только письмом.

     ПОЧЕМУ ПИШЕТСЯ ТО ЖЕ САМОЕ, А НЕ КАНАРЕЙКА. Первая редакция клала в
     место комнаты метку, читала её и возвращала прежнее значение. Прибор
     работал — и между двумя этими мигами в месте человека лежала НЕ ЕГО
     ВЕЩЬ. Закрой он вкладку там, выключись машина, упади вкладка — и записи
     нет, а причиной была проверка здоровья. Проверка, которая может съесть
     то, что проверяет, хуже отсутствующей: она отнимает редко, и потому ей
     верят.
     Пишется ровно то, что уже лежит. Это настоящая запись — её так же
     отвергнет закрытое хранилище и так же не пустит чужой ящик, — но она
     НИЧЕГО НЕ МЕНЯЕТ: оборвись она в любой миг, в месте останется то же
     самое. Канарейка кладётся только туда, где пусто, и снимается сразу:
     там терять нечего по определению.

     ГДЕ БЕРЁТСЯ МЕСТО. Своё место комнаты (keeps, D-242), а если комната
     ходит по всему диску по объявлению и своего места не имеет — у ОПИСИ
     ПОЛА (D-239), единственного места, где сказано, кто что держит. Второго
     списка здесь не заводится. */
  function ownPlace(roomId) {
    var def = apps()[roomId] || {};
    var mine = list(def, "keeps")[0];
    if (mine) return mine;
    if (def.sweeps !== true) return null;
    var floor = (window.SB_FLOOR && window.SB_FLOOR.places) || [];
    for (var i = 0; i < floor.length; i++) {
      var pl = floor[i];
      if (pl && Array.isArray(pl.rooms) && pl.rooms.indexOf(roomId) !== -1 &&
          String(pl.id).slice(-1) !== ".") return pl.id;
    }
    return null;
  }

  probes[DISK] = function (roomId) {
    var place = ownPlace(roomId);
    if (!place) {
      return { verdict: NO, why: say("alive.disk.noPlace") };
    }
    if (!window.sbRights || typeof window.sbRights.box !== "function") {
      return { verdict: DUNNO, why: say("alive.disk.noRights") };
    }
    var box = window.sbRights.box(roomId);
    var had = box.get(place);
    var empty = (had === null || had === undefined);
    var mark = empty ? "." : had;          /* в пустое — точка, в занятое — то же самое */
    var wrote = false, read = null;
    try {
      wrote = box.set(place, mark);
      box.flush();
      read = box.get(place);
      if (empty) { box.remove(place); box.flush(); }
    } catch (e) { wrote = false; }
    if (wrote && read === mark) {
      return { verdict: YES, why: say(empty ? "alive.disk.empty" : "alive.disk.same") };
    }
    return { verdict: NO, why: say("alive.disk.refused") };
  };

  /* СЕТЬ. Браузер говорит ровно одно: воткнут ли провод. Он НЕ говорит, что
     тот, кто нужен, отвечает. Разница огромная, и прибор обязан нести её с
     собой, иначе человек прочтёт «сеть есть» как «письмо уйдёт». */
  probes[NET] = function () {
    var on = true;
    try { on = (typeof navigator.onLine === "boolean") ? navigator.onLine : true; }
    catch (e) { return { verdict: DUNNO, why: say("alive.net.unknown") }; }
    return on
      ? { verdict: YES, why: say("alive.net.on") }
      : { verdict: NO, why: say("alive.net.off") };
  };

  /* ПОЧТАЛЬОН. Спрашивается у ОПИСИ ВЫХОДОВ (D-221) — единственного места,
     где адреса наружу названы, — а не у кода письма. Меряется «адрес есть и
     он один», а не «письмо дойдёт»: второе узнаётся только отправкой, а
     отправлять без человека система не станет. */
  probes[POST] = function () {
    var doors = (window.SB_OUTWARD && window.SB_OUTWARD.doors) || null;
    if (!doors) return { verdict: DUNNO, why: say("alive.post.noList") };
    var hosts = [];
    doors.forEach(function (d) {
      if (d && d.side === "third" && d.host && hosts.indexOf(d.host) === -1) hosts.push(d.host);
    });
    if (!hosts.length) return { verdict: NO, why: say("alive.post.none") };
    return { verdict: YES, why: say("alive.post.named", { hosts: hosts.join(", ") }) };
  };

  /* ПАПКА НА ДИСКЕ ЧЕЛОВЕКА. Умение браузера, а не наше: спрашивается у него. */
  probes[FOLDER] = function () {
    var can = false;
    try { can = typeof window.showDirectoryPicker === "function"; } catch (e) { can = false; }
    return can
      ? { verdict: YES, why: say("alive.folder.yes") }
      : { verdict: NO, why: say("alive.folder.no") };
  };

  /* СВОЙ СЕРВЕР — тот, по чьему адресу к вам ПРИХОДИТ. Почтальон умеет
     только уносить: адрес в описи выходов есть, и письмо уйдёт. Обратной
     дороги нет ни одной, и спрашивается это у той же описи: дверь, по
     которой к вам приходят, объявила бы себя receives. Ни одна не объявила.
     ЭТО И ЕСТЬ РАЗНИЦА между «письмо уйдёт» и «переписка работает», и
     первая редакция этого прибора её проглядела: она спросила про
     почтальона, получила «есть» и назвала Письма ЖИВЫМИ — при том что сами
     Письма сознаются, что работы не делают. Ответ разошёлся с признанием, и
     виноват был не механизм, а плохо названная нужда. */
  probes[SERVER] = function () {
    var doors = (window.SB_OUTWARD && window.SB_OUTWARD.doors) || null;
    if (!doors) return { verdict: DUNNO, why: say("alive.server.noList") };
    var back = doors.filter(function (d) { return d && d.receives === true; });
    if (!back.length) {
      return { verdict: NO, why: say("alive.server.none") };
    }
    return { verdict: YES, why: say("alive.server.named", { hosts: back.map(function (d) { return d.host || d.id; }).join(", ") }) };
  };

  /* ЧУЖОЕ СОГЛАСИЕ. Разрешает ли чужой сайт показывать себя в рамке —
     узнаётся только попыткой его открыть. Система нарочно не ходит наружу,
     чтобы поговорить о себе (D-221), и гадать не станет. */
  probes[CONSENT] = function () {
    return { verdict: DUNNO, why: say("alive.consent") };
  };

  /* СОБЕСЕДНИК. ЗДЕСЬ ПРИБОРА НЕТ И БЫТЬ НЕ МОЖЕТ, и это не пробел, а
     единственный честный ответ. Нет запроса, который отличил бы молчащего
     человека от отсутствующего. Комната, которой нужен живой собеседник,
     остаётся непроверяемой — и говорит об этом словами. */
  probes[PEER] = function () {
    return { verdict: DUNNO, why: say("alive.peer") };
  };

  function ask(need, roomId) {
    var p = probes[need];
    if (typeof p !== "function") {
      return { need: need, verdict: DUNNO, why: say("alive.noProbe") };
    }
    var r;
    try { r = p(roomId); } catch (e) { r = { verdict: DUNNO, why: say("alive.probeFailed", { err: e && e.message }) }; }
    return { need: need, verdict: r.verdict, why: r.why };
  }

  window.sbAlive = {
    /* Роды нужд, названные комнатами. Спрошено, не записано. */
    needs: function () {
      var reg = apps(), out = [];
      everyRoom().forEach(function (id) {
        list(reg[id], "needs").forEach(function (n) { if (out.indexOf(n) === -1) out.push(n); });
      });
      return out;
    },

    /* Есть ли эта нужда прямо сейчас. roomId нужен тем приборам, чей ответ
       зависит от комнаты (диск), и не мешает прочим. */
    check: function (need, roomId) { return ask(need, roomId); },

    /* Что с этой комнатой. Состояние выводится из ответов, а не объявляется:
         хоть одно «нет»            → ждёт (и видно, чего)
         нет «нет», но есть «?»     → нечем проверить
         всё «есть» или нужд нет    → живо */
    room: function (id) {
      var def = apps()[id];
      if (!def) return null;
      var needs = list(def, "needs").map(function (n) { return ask(n, id); });
      var state = "живо";
      if (needs.some(function (n) { return n.verdict === NO; })) state = "ждёт";
      else if (needs.some(function (n) { return n.verdict === DUNNO; })) state = DUNNO;
      return {
        id: id,
        title: window.sbAppTitle ? window.sbAppTitle(id) : id,
        state: state,
        needs: needs,
        /* Причина комнаты — ключ словаря (why.<комната>) либо, по-старому,
           готовая фраза. Ключ переводится; фраза идёт как есть. */
        why: (typeof def.why === "string" && def.why.indexOf("why.") === 0) ? say(def.why) : (def.why || ""),
        onDesk: !!(window.sbLaunchableApps && window.sbLaunchableApps().indexOf(id) !== -1)
      };
    },

    all: function () {
      var out = {};
      everyRoom().forEach(function (id) {
        var r = window.sbAlive.room(id);
        if (r) out[id] = r;
      });
      return out;
    },

    /* Короткий счёт для тех, кому нужна одна строка. Считается, не помнится. */
    tally: function () {
      var all = window.sbAlive.all(), out = { живо: 0, ждёт: 0 };
      out[DUNNO] = 0;
      Object.keys(all).forEach(function (id) { out[all[id].state] = (out[all[id].state] || 0) + 1; });
      out.всего = Object.keys(all).length;
      return out;
    }
  };

  /* Контракт объявляется там же, где остальные (§12). */
  if (window.sbContracts && Array.isArray(window.sbContracts.declared)) {
    window.sbContracts.declared.push(
      { name: "sbAlive", file: "core/alive.js", args: "-", returns: "{needs,check,room,all,tally}" }
    );
  }
})();
