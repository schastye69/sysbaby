/* ═══════════════════════════════════════════════════════════════════════════
   ПРАВА КОМНАТ · решение D-242 · шаг третий из четырёх

   ПОВОД, дословно от основателя 19.09.2026: «также прошу совет довести
   структуру sys.baby до полноценной операционной системы».

   ЗАМЕР, С КОТОРОГО ВСЁ НАЧАЛОСЬ. Совет пересчитал, что система пишет на
   диск: ШЕСТЬДЕСЯТ ПЯТЬ разных имён, и хозяина не объявлено НИ У ОДНОГО.
   Код любой комнаты читает и пишет всё: Браузер может прочитать письма,
   Переписка — стереть записи, и ни человек, ни Совет об этом не узнают.
   Замок (D-161…D-166) защищает от ЧУЖОГО С ДИСКОМ. МЕЖДУ КОМНАТАМИ не
   защищает ничто, потому что между ними нет и границы.

   Опись пола (D-239) сказала, ЧТО лежит. Здесь говорится, ЧЬЁ оно.

   ЧЕГО ЭТО НЕ ДЕЛАЕТ, И СКАЗАТЬ ЭТО ОБЯЗАНО ПЕРВЫМ. В браузере все комнаты
   живут в ОДНОМ мире: их код лежит на одной странице, и localStorage открыт
   каждому напрямую. ЭТО ЗАМОК НА ДВЕРИ, А НЕ СТЕНА ВОКРУГ ДОМА.
   Он ловит ОШИБКУ — комнату, потянувшуюся не туда по недосмотру, — и делает
   чужое чтение ВИДИМЫМ. Он НЕ ловит ПРЕДАТЕЛЬСТВО: комната, написанная
   нарочно, обойдёт его одной строкой. Настоящие стены — это отдельный
   источник у каждой комнаты (iframe или worker), и это другая, большая
   работа, которой Совет ещё не делал. Обещать больше, чем можешь, — то же
   самое, что не сделать ничего, только хуже: человек станет полагаться.

   ЧТО ЗДЕСЬ. Одно место, которое отвечает на четыре вопроса:
     дать комнате её ящик        sbRights.box(roomId)
     чьё это место               sbRights.owner(key)
     вся опись прав              sbRights.map()
     кому и в чём отказано       sbRights.denials()

   ПРАВА СПРАШИВАЮТСЯ У КОМНАТ, А НЕ ПИШУТСЯ ЗДЕСЬ СПИСКОМ (D-200/D-201).
   Комната объявляет при регистрации:

       registerApp("notes", { keeps: ["sysbaby.notes.v2"], reads: [] })

   keeps — СВОЁ: читает и пишет.
   reads — ЧУЖОЕ ПО ОБЪЯВЛЕНИЮ: читает, но не пишет. Чужое берут почитать,
           а не переписать; иначе «объявленное чтение» — это просто запись
           с разрешения, и границы снова нет.
   sweeps — ВЕСЬ ДИСК ПО ДЕЛУ. Так объявляют себя Настройки: они считают
           ключи, собирают профили и делают выгрузку, и без обхода всего
           диска этого не сделать. Право честное, но редкое, и закон
           tools/room-rights-check.mjs называет поимённо каждого, кто его
           взял, в каждом прогоне.
   ДВА ПОСЛЕДНИХ ПОЛЯ ГОВОРЯТ НЕ «КОМУ МОЖНО», А «ГДЕ ЛЕЖИТ». Это разные
   вопросы, и смешивать их нельзя: право — про комнату, место — про диск.

   plain  — МЕСТО, ОБЩЕЕ С ВИТРИНОЙ. Склад раскладывает места по профилям:
           у каждого профиля своя приставка. Но язык интерфейса и список
           виденных систем читает ещё и САЙТ — index.php, который про
           профили ОС не знает ничего и знать не может. Такие места лежат на
           диске под своим именем, без профиля, И ЭТО НЕ НЕДОСМОТР, А
           УСТРОЙСТВО. Раньше комната ходила за ними напрямую с припиской
           «raw localStorage on purpose» — то есть правда была, но жила в
           комментарии. Теперь она объявлена, и закон ПРОВЕРЯЕТ ЕЁ: место,
           названное общим с витриной, обязано встретиться в дереве за
           пределами ОС. Право читать общее с витриной место, которого
           витрина не знает, — не право, а описка.
   visit  — МЕСТО НА ОДНО ПОСЕЩЕНИЕ. Живёт в sessionStorage и умирает с
           вкладкой. Так устроено «витрина закрыта»: человек, закрывший её,
           сказал этим всё, что нужно ДО конца посещения, и помнить это
           назавтра система не должна. Такие места объявляются наравне с
           дисковыми — иначе опись прав описывала бы половину системы и
           молчала о второй.

   ЧТО ТАКОЕ «ЯДРО» В ОПИСИ. Всё, чего не объявила ни одна комната,
   принадлежит ядру — оболочке, полосе, панелям, хранилищу. Список ядра
   здесь НЕ ПИШЕТСЯ: писать его значило бы завести второй источник правды,
   который разойдётся с первым (D-200/D-201). Хозяин неназванного — ядро,
   и это ответ, а не отговорка.

   ОТКАЗ НЕ МОЛЧАЛИВ. Всякий отказ ложится в журнал: какая комната, к какому
   месту и как тянулась. Молчаливый отказ хуже разрешения: комната думает,
   что записала, человек думает, что сохранено, а на диске пусто.

   Охраняется tools/room-rights-check.mjs.
   ═════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  var JOURNAL_MAX = 200;
  var journal = [];

  function apps() { return (window.SysBaby && window.SysBaby.apps) || {}; }
  /* ПЕРЕЧИСЛЯЮТСЯ КОМНАТЫ РЕЕСТРА, А НЕ ПОРЯДОК ДОКА. Порядок — про то, в
     каком виде комнаты показывают человеку; владение — про то, чьё место.
     Комната, зарегистрированная и не попавшая в порядок (скрытая, снятая со
     стола), владеет своим местом ровно так же, и потерять её здесь значило
     бы отдать её место ядру молча. */
  function everyRoom() { return Object.keys(apps()); }
  function list(def, field) {
    var v = def && def[field];
    return Array.isArray(v) ? v : [];
  }

  /* Последняя дверь в хранилище. sbDB поднимается первым, в <head>, и в
     живой системе есть всегда; ветка без него — та самая защита, которую
     раньше каждая комната писала себе сама по три строки. Теперь она одна.
     where: "" — склад с профилями · "plain" — диск без профиля, общее с
     витриной · "visit" — посещение, sessionStorage. */
  function shelf(where) {
    return where === "visit" ? window.sessionStorage : window.localStorage;
  }
  function rawGet(k, where) {
    try {
      if (!where && window.sbDB && typeof window.sbDB.get === "function") return window.sbDB.get(k);
      return shelf(where).getItem(k);
    } catch (e) { return null; }
  }
  function rawSet(k, v, where) {
    try {
      if (!where && window.sbDB && typeof window.sbDB.set === "function") { window.sbDB.set(k, v); return true; }
      shelf(where).setItem(k, v);
      return true;
    } catch (e) { return false; }
  }
  function rawRemove(k, where) {
    try {
      if (!where && window.sbDB && typeof window.sbDB.remove === "function") { window.sbDB.remove(k); return true; }
      shelf(where).removeItem(k);
      return true;
    } catch (e) { return false; }
  }

  function deny(room, key, how) {
    journal.push({ room: room, key: key, how: how, at: Date.now() });
    if (journal.length > JOURNAL_MAX) journal.splice(0, journal.length - JOURNAL_MAX);
    if (window.console) console.warn("[права] " + room + " не пустили к " + key + " (" + how + ")");
    if (window.sbBus && window.sbBus.emit) {
      try { window.sbBus.emit("rights:denied", { room: room, key: key, how: how }); } catch (e) { /* шина — удобство */ }
    }
  }

  window.sbRights = {
    /* Ящик комнаты. Умеет ровно то, что комната объявила, и ни строкой
       больше. Ящик выдаётся по имени комнаты, а не по её коду: ядро не
       умеет и не должно уметь отличать один код от другого — см. шапку. */
    box: function (roomId) {
      function def() { return apps()[roomId] || {}; }
      function may(key, write) {
        var d = def();
        if (d.sweeps === true) return true;
        if (list(d, "keeps").indexOf(key) !== -1) return true;
        if (!write && list(d, "reads").indexOf(key) !== -1) return true;
        return false;
      }
      /* Где лежит место — вопрос отдельный от того, кому оно можно. */
      function where(key) {
        var d = def();
        if (list(d, "visit").indexOf(key) !== -1) return "visit";
        if (list(d, "plain").indexOf(key) !== -1) return "plain";
        return "";
      }
      return {
        get: function (key) {
          if (!may(key, false)) { deny(roomId, key, "чтение"); return null; }
          return rawGet(key, where(key));
        },
        set: function (key, value) {
          if (!may(key, true)) { deny(roomId, key, "запись"); return false; }
          return rawSet(key, value, where(key));
        },
        remove: function (key) {
          if (!may(key, true)) { deny(roomId, key, "запись"); return false; }
          return rawRemove(key, where(key));
        },
        flush: function () {
          try { if (window.sbDB && window.sbDB.flushSync) window.sbDB.flushSync(); }
          catch (e) { /* сброс на диск — не условие работы комнаты */ }
        }
      };
    },

    /* Чьё это место. Ответ спрошен у реестра; неназванное принадлежит ядру. */
    owner: function (key) {
      var reg = apps(), found = null;
      everyRoom().forEach(function (id) {
        if (found) return;
        if (list(reg[id], "keeps").indexOf(key) !== -1) found = id;
      });
      return found || "ядро";
    },

    /* Вся опись прав, собранная из объявлений. Ключей ядра здесь нет
       нарочно: их список не ведётся, чтобы не разойтись с деревом. */
    map: function () {
      var reg = apps(), out = {};
      everyRoom().forEach(function (id) {
        list(reg[id], "keeps").forEach(function (k) {
          if (!out[k]) out[k] = { owner: id, borrowers: [] };
          else out[k].owner = out[k].owner || id;
        });
      });
      everyRoom().forEach(function (id) {
        list(reg[id], "reads").forEach(function (k) {
          if (!out[k]) out[k] = { owner: "ядро", borrowers: [] };
          if (out[k].borrowers.indexOf(id) === -1) out[k].borrowers.push(id);
        });
      });
      return out;
    },

    /* Кому и в чём отказано. Журнал живёт сеанс: он для того, чтобы отказ
       было видно сейчас, а не для того, чтобы вести историю на диске —
       история отказов на диске была бы ещё одним местом без хозяина. */
    denials: function () { return journal.slice(); },

    /* Комнаты, взявшие право на весь диск. Считается, а не помнится. */
    sweepers: function () {
      var reg = apps(), out = [];
      everyRoom().forEach(function (id) { if (reg[id] && reg[id].sweeps === true) out.push(id); });
      return out;
    }
  };

  /* Контракт объявляется там же, где остальные (§12). */
  if (window.sbContracts && Array.isArray(window.sbContracts.declared)) {
    window.sbContracts.declared.push(
      { name: "sbRights", file: "core/rights.js", args: "-", returns: "{box,owner,map,denials,sweepers}" }
    );
  }
})();
