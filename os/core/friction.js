/*
 * friction.js — ЖУРНАЛ ТРЕНИЯ НА УСТРОЙСТВЕ (D-294). ВЫКЛЮЧЕН ПО УМОЛЧАНИЮ.
 *
 * ПОВОД. «SELF-EVOLVING EXPERIMENTAL OS» основателя: система сама замечает
 * лишние шаги и предлагает изменения. На радаре это стояло в «будущем»
 * (on-device-friction-ledger) с причиной: это наблюдение за человеком
 * внутри его собственной системы, и решать, наблюдать ли вообще, может
 * только основатель. Основатель решил: строить, ВЫКЛЮЧЕННЫМ ПО УМОЛЧАНИЮ.
 *
 * ЧТО ЗАМЕЧАЕТ — ДВЕ ВЕЩИ, И ТОЛЬКО О КОМНАТАХ, НЕ О СОДЕРЖИМОМ:
 *   • окно, закрытое почти сразу после открытия, — значок, нажатый не тот;
 *   • комната, которую не открывали месяц, — значок, который только мешает.
 * Ни текста, ни адресов, ни времени каждого открытия: на комнату — три
 * числа (сколько открыли, сколько закрыли сразу, когда открыли последний
 * раз). Это видно целиком в Настройках → Приватность.
 *
 * ЧТО ДЕЛАЕТ С ЗАМЕЧЕННЫМ — ТОЛЬКО ПРЕДЛАГАЕТ, И ТОЛЬКО ТАМ, КУДА ПРИШЛИ.
 * Предложение одно на комнату: «убрать значок со стола». Применяется лишь
 * по нажатию, снимается одним нажатием («Вернуть»), и отказ помнится —
 * второй раз то же не предлагается. Ни всплывающих окон, ни извещений.
 *
 * ГДЕ ЛЕЖИТ. Один ключ хранилища системы — под замком, как всё остальное
 * (floor-check). Инкогнито не пишет ничего. Выключатель останавливает счёт;
 * «Стереть журнал» стирает всё и сразу.
 *
 * Охраняется tools/friction-check.mjs.
 */
(function () {
  "use strict";
  var KEY = "sysbaby.friction.v1";
  var TOGGLE = "friction";
  var QUICK_MS = 1500;       /* ПОСТОЯННАЯ: «закрыли сразу» — быстрее полутора секунд: столько нужно, чтобы понять, что открылось не то, но мало, чтобы что-то сделать. */
  var QUICK_MIN_OPENS = 5;   /* ПОСТОЯННАЯ: меньше пяти открытий — случайность, а не привычка. */
  var QUICK_SHARE = 0.6;     /* ПОСТОЯННАЯ: закрыли сразу в трёх открытиях из пяти и чаще — значок стоит не там. */
  var DAY = 86400000;        /* ПОСТОЯННАЯ: сутки в миллисекундах. */
  var DORMANT_DAYS = 30;     /* ПОСТОЯННАЯ: месяц — комната, которую не открыли за месяц, на столе только мешает. */

  var UI = {
    en: {
      row: "Friction ledger", rowSub: "Off unless you turn it on. The system notices only two things about rooms — a window closed right after opening, a room not opened for a month — and suggests moving its icon into {echoes}. Nothing about what is inside, nothing is sent; it lives under the lock.",
      counts: "Noticed: {opens} openings, {quick} closed at once.",
      erase: "Erase the ledger", erased: "The ledger is erased", erasedBody: "Nothing about rooms is kept any more.",
      quick: "“{app}” was closed right after opening {quick} times out of {opens}. Perhaps its icon is in the way — move it into {echoes}?",
      dormant: "“{app}” has not been opened for {days} days. Move its icon into {echoes}? You can bring it back anytime.",
      accept: "Move into {echoes}", decline: "Keep",
      done: "“{app}” is in {echoes}", doneBody: "It’s waiting there — restore it anytime."
    },
    ru: {
      row: "Журнал трения", rowSub: "Выключен, пока вы его не включите. Система замечает о комнатах только две вещи — окно, закрытое сразу после открытия, и комнату, которую не открывали месяц, — и предлагает перенести её значок в «{echoes}». Ничего о содержимом, ничего не уходит; лежит под замком.",
      counts: "Замечено: открытий {opens}, закрыто сразу {quick}.",
      erase: "Стереть журнал", erased: "Журнал стёрт", erasedBody: "О комнатах больше ничего не хранится.",
      quick: "«{app}» закрыли сразу после открытия {quick} раз из {opens}. Может, значок мешает — перенести его в «{echoes}»?",
      dormant: "«{app}» не открывали {days} дн. Перенести значок в «{echoes}»? Вернуть можно в любой момент.",
      accept: "Перенести в «{echoes}»", decline: "Оставить",
      done: "«{app}» теперь в «{echoes}»", doneBody: "Оно там и ждёт — вернуть можно в любой момент."
    },
    ee: {
      row: "Hõõrdumise logi", rowSub: "Väljas, kuni te selle sisse lülitate. Süsteem märkab tubade kohta ainult kahte asja — kohe pärast avamist suletud akent ja tuba, mida pole kuu aega avatud, — ning pakub selle ikooni viia rakendusse {echoes}. Sisust mitte midagi, midagi ei saadeta; asub luku all.",
      counts: "Märgatud: avamisi {opens}, kohe suletud {quick}.",
      erase: "Kustuta logi", erased: "Logi on kustutatud", erasedBody: "Tubade kohta ei hoita enam midagi.",
      quick: "„{app}“ suleti kohe pärast avamist {quick} korda {opens}-st. Võib-olla ikoon segab — viia see rakendusse {echoes}?",
      dormant: "„{app}“ pole {days} päeva avatud. Viia ikoon rakendusse {echoes}? Saad selle igal ajal tagasi tuua.",
      accept: "Vii rakendusse {echoes}", decline: "Jäta",
      done: "„{app}“ on nüüd rakenduses {echoes}", doneBody: "See ootab seal — saad igal ajal tagasi tuua."
    }
  };
  function lang() { try { return window.sbLang ? window.sbLang() : "en"; } catch (e) { return "en"; } }
  function t(k, vars) {
    /* ОТКАТ: языка нет в словаре — английский, как у словаря ядра (sbTIn). */
    var L = UI[lang()] || UI.en;
    /* ОТКАТ: ключа нет в языке — английский ключ. */
    var s = L[k] || UI.en[k] || k;
    /* Куда уходят убранные значки — комната «Эхо»; её имя у системы. */
    vars = Object.assign({ echoes: title("echoes") }, vars || {});
    return String(s).replace(/\{(\w+)\}/g, function (m, n) { return Object.prototype.hasOwnProperty.call(vars, n) ? String(vars[n]) : m; });
  }
  function keys() { return Object.keys(UI.en); }

  function db() { return window.sbDB || null; }
  function on() {
    if (window.sbIncognitoActive) return false;
    /* Спрашивается по имени, а не через TOGGLE: так вопрос видит и закон
       settings-truth-check — выключатель, о котором не спрашивают, украшение. */
    return !!(window.sbGetControlToggle && window.sbGetControlToggle("friction") === true);
  }
  function readable() { var d = db(); return !!d && !(d.closed && d.closed()); }
  /* Журнал читается из хранилища при каждом вопросе — копии в памяти нет,
     поэтому эпоха замка (D-274) его не касается: за дверью читать нечего. */
  function read() {
    if (!readable()) return null;
    var raw = db().get(KEY);
    if (!raw) return null;
    try {
      var j = JSON.parse(raw);
      return j && j.v === 1 && j.rooms && typeof j.rooms === "object" ? j : null;
    } catch (e) { return null; }
  }
  function write(j) {
    var d = db();
    if (!d || !readable()) return;
    if (j) d.set(KEY, JSON.stringify(j)); else d.remove(KEY);
  }
  function fresh() { return { v: 1, since: Date.now(), rooms: {}, answers: {} }; }

  /* Когда открыто каждое окно — только в памяти, до закрытия. */
  var openedAt = {};
  function opened(id) {
    if (!on() || !readable()) return;
    var j = read() || fresh();
    var r = j.rooms[id] || (j.rooms[id] = { opens: 0, quick: 0, last: 0 });
    r.opens++;
    r.last = Date.now();
    openedAt[id] = r.last;
    write(j);
  }
  function closed(id) {
    var at = openedAt[id];
    delete openedAt[id];
    if (!at || !on() || !readable()) return;
    if (Date.now() - at >= QUICK_MS) return;
    var j = read();
    if (!j || !j.rooms[id]) return;
    j.rooms[id].quick++;
    write(j);
  }

  function title(id) {
    try { if (window.sbAppTitle) return window.sbAppTitle(id); } catch (e) { /* ignore */ }
    var def = ((window.SysBaby && window.SysBaby.apps) || {})[id] || {};
    /* ОТКАТ: оболочка ещё не дала имени — имя из описания комнаты, иначе её id. */
    return def.title || id;
  }
  function visibleRooms() {
    var list = [];
    try { list = (window.sbLaunchableApps ? window.sbLaunchableApps() : []).map(function (x) { return typeof x === "string" ? x : x.id; }); } catch (e) { list = []; }
    var hidden = [];
    try { hidden = window.sbGetHiddenIcons ? window.sbGetHiddenIcons() : []; } catch (e) { hidden = []; }
    return list.filter(function (id) { return hidden.indexOf(id) === -1; });
  }
  /* Предложения не хранятся: они считаются из журнала при каждом вопросе.
     Хранится только ответ человека — чтобы не спрашивать второй раз. */
  function offers() {
    if (!on()) return [];
    var j = read();
    if (!j) return [];
    var now = Date.now(), out = [];
    visibleRooms().forEach(function (id) {
      /* «Эхо» — само место убранных значков; отвеченное — не спрашивается снова. */
      if (id === "echoes" || Object.prototype.hasOwnProperty.call(j.answers, id)) return;
      var r = j.rooms[id];
      if (r && r.opens >= QUICK_MIN_OPENS && r.quick / r.opens >= QUICK_SHARE) {
        out.push({ id: id, kind: "quick", text: t("quick", { app: title(id), quick: r.quick, opens: r.opens }) });
        return;
      }
      var last = r && r.last ? r.last : j.since;
      var days = Math.floor((now - last) / DAY);
      if (now - j.since >= DORMANT_DAYS * DAY && days >= DORMANT_DAYS) out.push({ id: id, kind: "dormant", text: t("dormant", { app: title(id), days: days }) });
    });
    return out;
  }
  function answer(id, accept) {
    var j = read();
    if (!j) return false;
    j.answers[id] = { a: accept ? "yes" : "no", at: Date.now() };
    write(j);
    if (!accept) return true;
    if (window.sbSetIconHidden) window.sbSetIconHidden(id, true);
    if (window.sbShowUndoToast) {
      window.sbShowUndoToast(t("done", { app: title(id) }), t("doneBody"), function () {
        if (window.sbSetIconHidden) window.sbSetIconHidden(id, false);
        var k = read();
        if (k && k.answers[id]) { k.answers[id].a = "undone"; write(k); }
      });
    }
    return true;
  }
  function ledger() {
    var j = read();
    if (!j) return null;
    var opens = 0, quick = 0;
    Object.keys(j.rooms).forEach(function (id) { opens += j.rooms[id].opens; quick += j.rooms[id].quick; });
    return { since: j.since, rooms: j.rooms, answers: j.answers, opens: opens, quick: quick };
  }
  function erase() {
    openedAt = {};
    write(null);
    if (window.showToast) window.showToast(t("erased"), t("erasedBody"), "", true, "toast-calm", "confirm");
  }

  function wire() {
    if (!window.sbBus || !window.sbBus.on) return false;
    window.sbBus.on("window:opened", function (d) { if (d && d.id) opened(d.id); });
    window.sbBus.on("window:closed", function (d) { if (d && d.id) closed(d.id); });
    /* Месяц считается с минуты, когда человек включил журнал, а не с
       первого открытия после: иначе комната, которую не открыли ни разу,
       не получила бы своего предложения никогда. */
    window.sbBus.on("setting:changed", function (d) {
      if (!d || d.kind !== "toggle" || d.key !== TOGGLE) return;
      if (d.on && readable() && !read()) write(fresh());
      if (!d.on) openedAt = {};
    });
    return true;
  }
  if (!wire()) document.addEventListener("DOMContentLoaded", wire, { once: true });

  window.sbFriction = { on: on, ledger: ledger, offers: offers, answer: answer, erase: erase, t: t, keys: keys };
})();
