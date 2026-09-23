/*
 * chest.js — СУНДУК. Раз в сутки система дарит одну вещь. Решение D-255.
 *
 * ПОВОД, дословно от основателя 22.09.2026: «нам нужно слегка геймофицировать
 * sys.baby … раз в сутки пользователь сможет получить случайный приз (по типу
 * сундуков в играх) … 30 самых гениальных и приятных призов … пока ты не
 * открыл текущий сундук, то следующий ты тоже открыть не можешь … призы
 * должны быть стоящими и создавать впечатление у пользователя персонализации
 * и уникальности. сундуки должны открываться в случайном порядке».
 *
 * ЧТО ЗДЕСЬ ЧЕСТНОГО, И ЭТО СКАЗАНО ЧЕЛОВЕКУ В САМОЙ КОМНАТЕ:
 *   · Сутки считает ЭТО УСТРОЙСТВО. Сервера нет; переведёшь часы — обманешь
 *     только себя. Это не дыра, а свойство системы, у которой нет никого,
 *     кроме её хозяина.
 *   · Призы — вещи этой системы. У них нет цены в деньгах, они не уходят
 *     наружу и не требуют ничьего согласия. Скидок и купонов здесь нет и не
 *     будет: обещать деньги основателя Совет права не имеет.
 *   · Уникальность — не впечатление, а вывод: цвет — из имени, знак — из
 *     имени и дня рождения системы, номер — из соли замка, созвездие — из
 *     букв, письма — из настоящих чисел.
 *
 * ПОРЯДОК. Перестановка тридцати призов делается ОДИН РАЗ при первом входе
 * в комнату, случайными байтами браузера, и хранится. Дальше — по ней.
 *
 * ГДЕ ЖИВУТ ПОДАРКИ. Комната ничего не делает сама «за» другие комнаты: она
 * объявляет движку, что дано, а ядро СПРАШИВАЕТ у сундука: список комнат
 * спрашивает sbAddMood, терминал — реестр команд, вход и прощание — слово,
 * окно аккаунта — титул и номер. Вещи (SVG) кладутся в Хранилище общей рукой
 * (sbHand.give), письма — в Записи через sbAddQuickNote ядра.
 *
 * Опись призов — os/apps/chest/prizes.data.js (единственный источник).
 * Охраняется tools/chest-check.mjs.
 */
(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var STORE_KEY = "sysbaby.chest.v1";
  var DAY = 24 * 3600 * 1000;
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M3.5 10.5V18a1.5 1.5 0 0 0 1.5 1.5h14A1.5 1.5 0 0 0 20.5 18v-7.5"/>' +
    '<path d="M3.5 10.5V9a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4v1.5z"/><path d="M10.5 10.5v3h3v-3"/></svg>';

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function lang() {
    try { return (window.sbLang && window.sbLang()) || "en"; } catch (e) { return "en"; }
  }
  function byLang(v) {
    if (v == null) return "";
    if (typeof v === "string") return v;
    /* ОТКАТ: языка в записи нет — падаем на английский, потом на русский.
       Полноту записей на каждом языке сторожит tools/chest-check.mjs. */
    return v[lang()] || v.en || v.ru || "";
  }
  function username() {
    try { return (window.sbGetUsername && window.sbGetUsername()) || "guest"; } catch (e) { return "guest"; }
  }
  function fmt(s, vars) {
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      return Object.prototype.hasOwnProperty.call(vars || {}, k) ? String(vars[k]) : m;
    });
  }

  /* ── СЛОВА КОМНАТЫ ───────────────────────────────────────────────────── */
  var UI = {
    en: {
      title: "Chest", label: "Chest",
      lead: "Once a day the system gives you one thing. Thirty chests, in an order drawn at random for you alone — and the next one does not open until this one has.",
      open: "Open the chest", ready: "A chest is waiting.", waiting: "The next chest opens tomorrow — in {t}.",
      done: "All thirty are open. There are no more chests; everything they held is yours to keep.",
      progress: "{n} of {total} opened", got: "You received", where: "Where it lives",
      shelf: "What the chests have given you", shelfEmpty: "Nothing yet — the first chest is waiting above.",
      day: "day {n}", chooseTitle: "Choose your title", titled: "Your title: {t}",
      letterLead: "Write to yourself. Sealed for {d} days, then it arrives in your Notes on its own.",
      letterSeal: "Seal it", letterSealed: "Sealed on {a}. Arrives on {b}.", letterCame: "Arrived on {b} — it is in your Notes.",
      echoLead: "You wrote this {ago}:", echoNone: "You have not written anything yet. The echo waits for your first note.",
      ago1: "yesterday", agoN: "{n} days ago", agoToday: "today", hour: "h", minute: "min",
      honest: "Honest part: the day is counted by this device — no server, so setting the clock forward only fools you. The prizes are things of this system; they cost nothing, go nowhere, and ask nobody's consent. There are no coupons and no discounts here.",
      titles: { keeper: "Keeper", warden: "Warden", gardener: "Gardener", night: "Night watch" },
      tiers: { joy: "daily joy", discovery: "personal discovery", rare: "rare moment" },
      on: "On", off: "Off", offNote: "Off — the thing stays on the shelf, it just does not act.",
      renameLead: "Give any room your own name. Empty — the room's own name returns.",
      countLead: "A date and a word — and a note on the desk starts counting the days by itself.",
      countDate: "Date", countLabel: "What for", countAdd: "Put it on the desk", countDone: "It is on the desk.",
      count: { until: "{n} days until: {label}", today: "today: {label}", since: "{n} days since: {label}" },
      line: {
        mood: "The room «{room}» is now among your rooms.",
        own: "Your hue is {hue}° — derived from «{name}». No one else has this exact room.",
        night: "From tonight, after midnight the desk goes to Ember by itself and comes back in the morning.",
        rename: "Name your rooms below — the dock and the desk follow at once.",
        countdown: "Set a date below — the note appears on the desk and counts on its own.",
        saver: "Leave the desk still for {n} minutes and see.",
        room: "«{room}» now stands in your dock.",
        serial: "Your system's number: {serial}.",
        stamp: "Your sign now prints in the corner of every note.",
        word: "From now on the system says it with your name: «{w}».",
        title: "Pick one below — it will stand under your name.",
        command: "Type «{cmd}» in the terminal.",
        echo: "From now on this room returns one of your own lines each day.",
        letter: "Write below. It comes back in {d} days.",
        systemletter: "A letter is in your Notes — read it there."
      },
      sysLetter: "Dear {name},\n\nthis is the system you keep. We have been together {days} days. In that time you wrote {notes} notes and {words} words, and {envelopes} envelopes stand sealed on this disk. You opened {chests} chests.\n\nNothing here has left this device. Nothing here will.\n\n— your system, from the chest"
    },
    ru: {
      title: "Сундук", label: "Сундук",
      lead: "Раз в сутки система дарит вам одну вещь. Тридцать сундуков в порядке, выпавшем случайно и только вам, — и следующий не откроется, пока не открыт этот.",
      open: "Открыть сундук", ready: "Сундук ждёт.", waiting: "Следующий сундук откроется завтра — через {t}.",
      done: "Все тридцать открыты. Сундуков больше нет; всё, что в них было, остаётся вашим.",
      progress: "открыто {n} из {total}", got: "Вы получили", where: "Где это живёт",
      shelf: "Что вам дали сундуки", shelfEmpty: "Пока ничего — первый сундук ждёт выше.",
      day: "день {n}", chooseTitle: "Выберите титул", titled: "Ваш титул: {t}",
      letterLead: "Напишите себе. Запечатано на {d} дней, потом само придёт в Записи.",
      letterSeal: "Запечатать", letterSealed: "Запечатано {a}. Придёт {b}.", letterCame: "Пришло {b} — лежит в Записях.",
      echoLead: "Вы написали это {ago}:", echoNone: "Вы ещё ничего не написали. Эхо ждёт вашей первой записи.",
      ago1: "вчера", agoN: "{n} дн. назад", agoToday: "сегодня", hour: "ч", minute: "мин",
      honest: "Честная часть: сутки считает это устройство — сервера нет, и, переведя часы вперёд, вы обманете только себя. Призы — вещи этой системы: они ничего не стоят, никуда не уходят и ничьего согласия не требуют. Купонов и скидок здесь нет.",
      titles: { keeper: "Хранитель", warden: "Смотритель", gardener: "Садовник", night: "Ночной сторож" },
      tiers: { joy: "ежедневная радость", discovery: "личная находка", rare: "редкий момент" },
      on: "Вкл", off: "Выкл", offNote: "Выключено — вещь остаётся на полке, просто не действует.",
      renameLead: "Дайте любой комнате своё имя. Пусто — вернётся её собственное.",
      countLead: "Дата и слово — и заметка на столе сама начнёт считать дни.",
      countDate: "Дата", countLabel: "К чему", countAdd: "Поставить на стол", countDone: "Стоит на столе.",
      count: { until: "{n} дн. до: {label}", today: "сегодня: {label}", since: "{n} дн. после: {label}" },
      line: {
        mood: "Комната «{room}» теперь среди ваших комнат.",
        own: "Ваш тон — {hue}°, выведен из «{name}». Такой комнаты нет ни у кого другого.",
        night: "С этой ночи после полуночи стол сам уйдёт в Угли и утром вернётся.",
        rename: "Назовите комнаты ниже — док и стол подхватят сразу.",
        countdown: "Поставьте дату ниже — заметка появится на столе и будет считать сама.",
        saver: "Оставьте стол без движения на {n} минуты — и увидите.",
        room: "«{room}» теперь стоит в вашем доке.",
        serial: "Номер вашей системы: {serial}.",
        stamp: "Ваш знак теперь стоит в углу каждой заметки.",
        word: "Отныне система говорит это с вашим именем: «{w}».",
        title: "Выберите ниже — он встанет под вашим именем.",
        command: "Наберите «{cmd}» в терминале.",
        echo: "Отныне эта комната каждый день возвращает одну вашу строчку.",
        letter: "Напишите ниже. Оно вернётся через {d} дней.",
        systemletter: "Письмо лежит в Записях — прочтите его там."
      },
      sysLetter: "Дорогой {name},\n\nэто система, которую вы держите. Мы вместе {days} дн. За это время вы написали {notes} записей и {words} слов, и {envelopes} конвертов стоят запечатанными на этом диске. Вы открыли {chests} сундуков.\n\nНичто отсюда не покидало это устройство. И не покинет.\n\n— ваша система, из сундука"
    },
    ee: {
      title: "Laegas", label: "Laegas",
      lead: "Kord päevas annab süsteem sulle ühe asja. Kolmkümmend laegast, järjekorras, mis on loositud ainult sulle — ja järgmine ei avane enne, kui see on avatud.",
      open: "Ava laegas", ready: "Laegas ootab.", waiting: "Järgmine laegas avaneb homme — {t} pärast.",
      done: "Kõik kolmkümmend on avatud. Rohkem laekaid pole; kõik, mis neis oli, jääb sulle.",
      progress: "avatud {n} / {total}", got: "Sa said", where: "Kus see elab",
      shelf: "Mida laekad on sulle andnud", shelfEmpty: "Veel mitte midagi — esimene laegas ootab ülal.",
      day: "päev {n}", chooseTitle: "Vali oma tiitel", titled: "Sinu tiitel: {t}",
      letterLead: "Kirjuta iseendale. Pitseeritud {d} päevaks, siis jõuab ise sinu Märkmetesse.",
      letterSeal: "Pitseeri", letterSealed: "Pitseeritud {a}. Saabub {b}.", letterCame: "Saabus {b} — on sinu Märkmetes.",
      echoLead: "Sa kirjutasid selle {ago}:", echoNone: "Sa pole veel midagi kirjutanud. Kaja ootab sinu esimest märget.",
      ago1: "eile", agoN: "{n} päeva tagasi", agoToday: "täna", hour: "h", minute: "min",
      honest: "Aus osa: päeva loeb see seade — serverit pole, nii et kella ettepoole keeramine petab ainult sind ennast. Auhinnad on selle süsteemi asjad: need ei maksa midagi, ei lähe kuhugi ega küsi kellegi nõusolekut. Kuponge ja allahindlusi siin pole.",
      titles: { keeper: "Hoidja", warden: "Valvur", gardener: "Aednik", night: "Öövaht" },
      tiers: { joy: "igapäevane rõõm", discovery: "isiklik avastus", rare: "haruldane hetk" },
      on: "Sees", off: "Väljas", offNote: "Väljas — asi jääb riiulile, lihtsalt ei toimi.",
      renameLead: "Anna ükskõik millisele toale oma nimi. Tühi — toa enda nimi tuleb tagasi.",
      countLead: "Kuupäev ja sõna — ja märge laual hakkab ise päevi lugema.",
      countDate: "Kuupäev", countLabel: "Milleks", countAdd: "Pane lauale", countDone: "On laual.",
      count: { until: "{n} päeva kuni: {label}", today: "täna: {label}", since: "{n} päeva pärast: {label}" },
      line: {
        mood: "Tuba «{room}» on nüüd sinu tubade seas.",
        own: "Sinu toon on {hue}° — tuletatud nimest «{name}». Sellist tuba pole kellelgi teisel.",
        night: "Alates tänasest ööst läheb laud pärast keskööd ise Hõõgusesse ja tuleb hommikul tagasi.",
        rename: "Nimeta toad allpool — dokk ja laud võtavad kohe üle.",
        countdown: "Pane allpool kuupäev — märge ilmub lauale ja loeb ise.",
        saver: "Jäta laud {n} minutiks liikumatuks — ja näed.",
        room: "«{room}» seisab nüüd sinu dokis.",
        serial: "Sinu süsteemi number: {serial}.",
        stamp: "Sinu märk on nüüd iga märkme nurgas.",
        word: "Nüüdsest ütleb süsteem seda sinu nimega: «{w}».",
        title: "Vali allpool — see jääb sinu nime alla.",
        command: "Kirjuta terminali «{cmd}».",
        echo: "Nüüdsest annab see tuba iga päev tagasi ühe sinu enda rea.",
        letter: "Kirjuta allpool. See tuleb tagasi {d} päeva pärast.",
        systemletter: "Kiri on sinu Märkmetes — loe seda seal."
      },
      sysLetter: "Kallis {name},\n\nsee on süsteem, mida sa hoiad. Oleme koos olnud {days} päeva. Selle aja jooksul kirjutasid sa {notes} märget ja {words} sõna ning {envelopes} ümbrikku seisavad sellel kettal pitseerituna. Sa avasid {chests} laegast.\n\nMiski siit pole sellest seadmest lahkunud. Ega lahku.\n\n— sinu süsteem, laekast"
    }
  };
  function T() { return UI[lang()] || UI.en; }

  /* ── ХРАНИЛИЩЕ ЧЕРЕЗ СВОЙ ЯЩИК (D-242) ──────────────────────────────── */
  function box() {
    return window.sbRights
      ? window.sbRights.box("chest")
      : { get: function () { return null; }, set: function () { return false; } };
  }
  var cached = null;
  function state() {
    if (cached) return cached;
    var st = null;
    try { var raw = box().get(STORE_KEY); st = raw ? JSON.parse(raw) : null; } catch (e) { st = null; }
    if (!st || !Array.isArray(st.order) || !Array.isArray(st.opened)) st = null;
    if (!st) st = { v: 1, order: shuffle(prizes()), opened: [], title: "", letter: null, serial: "", echo: null, off: [], names: {}, night: null };
    if (!Array.isArray(st.off)) st.off = [];
    if (!st.names || typeof st.names !== "object") st.names = {};
    cached = st;
    return st;
  }
  function save() {
    try { box().set(STORE_KEY, JSON.stringify(state())); } catch (e) { /* ignore */ }
  }
  /* Перестановка — случайными байтами браузера, один раз. С двумя условиями
     по слову основателя: первый сундук — ежедневная радость (joy), а редкое
     (rare) не выпадает раньше восьмого дня. Удивление, а не разочарование. */
  var RARE_AFTER = 7;
  function shuffle(list) {
    var a = list.map(function (p) { return p.id; }), i, j, t, r = new Uint32Array(a.length);
    var tier = {};
    list.forEach(function (p) { tier[p.id] = p.tier || "discovery"; });
    try { window.crypto.getRandomValues(r); } catch (e) { for (i = 0; i < r.length; i++) r[i] = Math.floor(Math.random() * 4294967296); }
    for (i = a.length - 1; i > 0; i--) {
      j = r[i] % (i + 1);
      t = a[i]; a[i] = a[j]; a[j] = t;
    }
    /* Редкое из первой недели уезжает назад, меняясь местами с нередким. */
    for (i = 0; i < Math.min(RARE_AFTER, a.length); i++) {
      if (tier[a[i]] !== "rare") continue;
      for (j = a.length - 1; j >= RARE_AFTER; j--) {
        if (tier[a[j]] !== "rare") { t = a[i]; a[i] = a[j]; a[j] = t; break; }
      }
    }
    /* Первым — радость. */
    if (tier[a[0]] !== "joy") {
      for (j = 1; j < a.length; j++) if (tier[a[j]] === "joy") { t = a[0]; a[0] = a[j]; a[j] = t; break; }
    }
    return a;
  }

  function prizes() { return Array.isArray(window.SB_PRIZES) ? window.SB_PRIZES : []; }
  function prize(id) {
    var list = prizes();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }
  function opened(id) {
    return state().opened.some(function (o) { return o.id === id; });
  }
  /* Дано И не выключено человеком: получить вещь и не пользоваться ею —
     тоже часть владения (основатель). */
  function granted(id) {
    return opened(id) && state().off.indexOf(id) === -1;
  }
  function kindGranted(kind, param, value) {
    return state().opened.some(function (o) {
      var p = prize(o.id);
      return !!p && granted(o.id) && p.kind === kind && (!param || (p.params && p.params[param] === value));
    });
  }

  /* ── СУТКИ ───────────────────────────────────────────────────────────── */
  function dayKey(t) {
    var d = new Date(t);
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function available() {
    var st = state();
    if (st.opened.length >= st.order.length) return false;
    if (!st.opened.length) return true;
    return dayKey(st.opened[st.opened.length - 1].at) !== dayKey(Date.now());
  }
  function untilTomorrow() {
    var d = new Date();
    var next = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0);
    var ms = Math.max(0, next - d);
    var h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), t = T();
    /* Единицы — языка экрана, число — общее (D-253). */
    return h + " " + t.hour + " " + (m < 10 ? "0" : "") + m + " " + t.minute;
  }
  function currentId() {
    var st = state();
    return st.opened.length < st.order.length ? st.order[st.opened.length] : null;
  }

  /* ── ВЫВОДЫ ИЗ ИМЕНИ ─────────────────────────────────────────────────── */
  function hash32(str) {
    var h = 0x811c9dc5, s = String(str), i;
    for (i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
    }
    return h >>> 0;
  }
  function birthMs() {
    try {
      var rec = window.sbProfiles && window.sbProfiles.currentRecord ? window.sbProfiles.currentRecord() : null;
      if (rec && rec.createdAt) return Number(rec.createdAt) || Date.now();
    } catch (e) { /* ниже */ }
    return Date.now();
  }
  function daysKept() { return Math.max(1, Math.floor((Date.now() - birthMs()) / DAY) + 1); }
  function hue() { return hash32(username().toLowerCase() + "|hue") % 360; }
  function seedOf() { return hash32(username().toLowerCase() + "|" + dayKey(birthMs())); }
  function dateOf(t) {
    try { return new Date(t).toLocaleDateString(lang() === "ee" ? "et-EE" : (lang() === "ru" ? "ru-RU" : "en-GB")); }
    catch (e) { return new Date(t).toISOString().slice(0, 10); }
  }

  var ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  function serialFrom(source) {
    var a = hash32(source + "|a"), b = hash32(source + "|b"), out = "", i, bits;
    for (i = 0; i < 12; i++) {
      bits = (i < 6) ? ((a >>> (i * 5)) & 31) : ((b >>> ((i - 6) * 5)) & 31);
      out += ALPHA.charAt(bits);
      if (i === 3 || i === 7) out += "-";
    }
    return out;
  }
  function serial() {
    var st = state();
    if (st.serial) return st.serial;
    var src = "";
    try { var c = window.sbVault && window.sbVault.cipher ? window.sbVault.cipher() : null; if (c && c.salt) src = "salt:" + c.salt; } catch (e) { src = ""; }
    if (!src) {
      var r = new Uint32Array(3);
      try { window.crypto.getRandomValues(r); } catch (e) { r[0] = Date.now(); r[1] = Math.random() * 4294967296; r[2] = Math.random() * 4294967296; }
      src = "rnd:" + r[0] + ":" + r[1] + ":" + r[2];
    }
    st.serial = serialFrom(src);
    save();
    return st.serial;
  }

  /* Знак: симметричная сетка 7×7 из бит имени и дня рождения, в кольце. */
  function sigilSvg(size) {
    var seed = seedOf(), cells = [], r, c, bit = 0, on;
    for (r = 0; r < 7; r++) for (c = 0; c < 4; c++) {
      on = ((seed >>> (bit % 32)) & 1) === 1;
      bit += 3;
      if (on) { cells.push([r, c]); if (c !== 3) cells.push([r, 6 - c]); }
    }
    if (cells.length < 6) cells.push([3, 3], [2, 3], [4, 3], [3, 2], [3, 4], [1, 3]);
    var s = size || 120, unit = s / 11, off = unit * 2;
    var out = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + s + ' ' + s + '" width="' + s + '" height="' + s + '">' +
      '<circle cx="' + (s / 2) + '" cy="' + (s / 2) + '" r="' + (s / 2 - unit / 2) + '" fill="none" stroke="currentColor" stroke-width="' + (unit / 3).toFixed(2) + '"/>';
    cells.forEach(function (rc) {
      out += '<rect x="' + (off + rc[1] * unit).toFixed(2) + '" y="' + (off + rc[0] * unit).toFixed(2) + '" width="' + unit.toFixed(2) + '" height="' + unit.toFixed(2) + '" rx="' + (unit / 4).toFixed(2) + '" fill="currentColor"/>';
    });
    return out + "</svg>";
  }

  /* ── ЧИСЛА СИСТЕМЫ — СПРОШЕНЫ, НЕ ЗАПОМНЕНЫ ─────────────────────────── */
  function numbers() {
    var notes = [], words = 0, envelopes = 0, keys = 0;
    try { notes = window.sbNotesStore ? window.sbNotesStore.load() : []; } catch (e) { notes = []; }
    notes.forEach(function (n) { var t = String(n && n.text || "").trim(); if (t) words += t.split(/\s+/).length; });
    try { envelopes = window.sbSeals ? window.sbSeals.names().length : 0; } catch (e) { envelopes = 0; }
    try { keys = window.sbKeysAll ? window.sbKeysAll().length : 0; } catch (e) { keys = 0; }
    return { days: daysKept(), notes: notes.length, words: words, envelopes: envelopes, keys: keys, chests: state().opened.length };
  }

  /* ── ЭХО: ОДНА СВОЯ СТРОЧКА В ДЕНЬ ───────────────────────────────────── */
  function echoLine() {
    var notes = [];
    try { notes = window.sbNotesStore ? window.sbNotesStore.load() : []; } catch (e) { notes = []; }
    var lines = [];
    notes.forEach(function (n) {
      /* Письма, которые написала система, — не слова человека: эхо их не
         возвращает. */
      if (!n || n.from === "chest") return;
      String(n.text || "").split(/\n+/).forEach(function (l) {
        var t = l.trim();
        if (t.length >= 12 && t.length <= 240) lines.push({ text: t, at: Number(n.updatedAt) || Date.now() });
      });
    });
    if (!lines.length) return null;
    var st = state(), key = dayKey(Date.now());
    if (!st.echo || st.echo.day !== key || st.echo.idx >= lines.length) {
      var r = new Uint32Array(1);
      try { window.crypto.getRandomValues(r); } catch (e) { r[0] = Math.floor(Math.random() * 4294967296); }
      st.echo = { day: key, idx: r[0] % lines.length };
      save();
    }
    return lines[st.echo.idx];
  }
  function agoText(at) {
    var t = T(), d = Math.floor((Date.now() - at) / DAY);
    if (d <= 0) return t.agoToday;
    if (d === 1) return t.ago1;
    return fmt(t.agoN, { n: d });
  }

  /* ── ПИСЬМА ──────────────────────────────────────────────────────────── */
  function deliverLetter() {
    var st = state();
    if (!st.letter || st.letter.delivered || Date.now() < st.letter.due) return false;
    if (typeof window.sbAddQuickNote !== "function") return false;
    window.sbAddQuickNote(st.letter.text + "\n\n— " + dateOf(st.letter.at), { from: "chest" });
    st.letter.delivered = Date.now();
    save();
    return true;
  }
  function systemLetter() {
    var n = numbers(), t = T();
    return fmt(t.sysLetter, { name: username(), days: n.days, notes: n.notes, words: n.words, envelopes: n.envelopes, chests: n.chests });
  }

  /* ── КОМНАТЫ, КОТОРЫЕ УМЕЕТ ДАТЬ СУНДУК ──────────────────────────────── */
  var ROOMS = {
    midnight: { id: "midnight", name: "Midnight", hue: 232, span: 10, cycle: 44 * 60000, room: [0.20, 0.30], sat: 52 },
    garden: { id: "garden", name: "Garden", hue: 108, span: 24, cycle: 36 * 60000, room: [0.30, 0.46], sat: 60 },
    lavender: { id: "lavender", name: "Lavender", hue: 272, span: 20, cycle: 38 * 60000, room: [0.28, 0.44], sat: 58 },
    honey: { id: "honey", name: "Honey", hue: 42, span: 14, cycle: 40 * 60000, room: [0.34, 0.50], sat: 78 }
  };
  function moodDef(id) {
    if (id === "own") return { id: "own", name: "Yours", hue: hue(), span: 18, cycle: 41 * 60000, room: [0.30, 0.46], sat: 66 };
    return ROOMS[id] || null;
  }

  /* ── КОМАНДЫ ТЕРМИНАЛА, КОТОРЫЕ УМЕЕТ ДАТЬ СУНДУК ────────────────────── */
  function rnd(n) {
    var r = new Uint32Array(1);
    try { window.crypto.getRandomValues(r); } catch (e) { r[0] = Math.floor(Math.random() * 4294967296); }
    return r[0] % n;
  }
  var timerHandle = null, quietHandle = null;
  function moonPhase(t) {
    /* Синодический месяц от известного новолуния 6.01.2000 18:14 UTC. */
    var synodic = 29.530588853, ref = Date.UTC(2000, 0, 6, 18, 14);
    var days = (t - ref) / DAY, age = ((days % synodic) + synodic) % synodic;
    var lit = (1 - Math.cos((age / synodic) * 2 * Math.PI)) / 2;
    var name = age < 1.85 ? "new" : age < 5.53 ? "waxing crescent" : age < 9.22 ? "first quarter" : age < 12.91 ? "waxing gibbous" :
      age < 16.61 ? "full" : age < 20.30 ? "waning gibbous" : age < 23.99 ? "last quarter" : age < 27.68 ? "waning crescent" : "new";
    var toFull = ((synodic / 2 - age) + synodic) % synodic;
    return { age: age, lit: lit, name: name, nextFull: t + toFull * DAY };
  }
  function sunTimes(lat, lon, t) {
    /* Алгоритм NOAA, упрощённый до восхода и заката. Возвращает UTC-минуты. */
    var d = new Date(t), n = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - Date.UTC(2000, 0, 1, 12)) / DAY);
    var rad = Math.PI / 180;
    var Jstar = n - lon / 360;
    var M = (357.5291 + 0.98560028 * Jstar) % 360;
    var C = 1.9148 * Math.sin(M * rad) + 0.02 * Math.sin(2 * M * rad) + 0.0003 * Math.sin(3 * M * rad);
    var L = (M + C + 180 + 102.9372) % 360;
    var Jt = Jstar + 0.0053 * Math.sin(M * rad) - 0.0069 * Math.sin(2 * L * rad);
    var dec = Math.asin(Math.sin(L * rad) * Math.sin(23.4397 * rad));
    var cosw = (Math.sin(-0.833 * rad) - Math.sin(lat * rad) * Math.sin(dec)) / (Math.cos(lat * rad) * Math.cos(dec));
    if (cosw > 1) return { polar: "night" };
    if (cosw < -1) return { polar: "day" };
    var w = Math.acos(cosw) / rad;
    var transit = Jt, rise = transit - w / 360, set = transit + w / 360;
    var toMs = function (j) { return Date.UTC(2000, 0, 1, 12) + j * DAY; };
    return { rise: toMs(rise), set: toMs(set) };
  }
  function hhmm(ms) {
    var d = new Date(ms);
    return (d.getHours() < 10 ? "0" : "") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
  }
  var COMMANDS = {
    coin: { help: "coin — heads or tails", run: function (rest, io) { io.write(rnd(2) ? "heads." : "tails."); } },
    dice: { help: "dice [sides] — throw a die", run: function (rest, io) {
      var sides = Math.max(2, Math.min(1000, parseInt(rest, 10) || 6));
      io.write("d" + sides + " → " + (rnd(sides) + 1));
    } },
    pick: { help: "pick a, b, c — let the system choose", run: function (rest, io) {
      var opts = String(rest || "").split(/[,;]|\s+or\s+/).map(function (s) { return s.trim(); }).filter(Boolean);
      if (opts.length < 2) { io.write("give me at least two things, separated by commas."); return; }
      io.write(opts[rnd(opts.length)]);
    } },
    timer: { help: "timer <minutes> — the desk tells you when it is up · timer stop", run: function (rest, io) {
      if (/^stop$/i.test(rest)) { if (timerHandle) { clearTimeout(timerHandle); timerHandle = null; io.write("timer stopped."); } else io.write("no timer running."); return; }
      var min = parseFloat(rest);
      if (!(min > 0)) { io.write("timer <minutes>, for example: timer 25"); return; }
      if (timerHandle) clearTimeout(timerHandle);
      timerHandle = setTimeout(function () {
        timerHandle = null;
        if (window.showToast) window.showToast("Timer", min + " min are up.", ICON, true, "", "event");
      }, min * 60000);
      io.write("timer set: " + min + " min. the desk will say when it is up.");
    } },
    days: { help: "days <YYYY-MM-DD> — days until or since a date", run: function (rest, io) {
      var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(String(rest || "").trim());
      if (!m) { io.write("days <YYYY-MM-DD>, for example: days 2027-01-01"); return; }
      var target = new Date(+m[1], +m[2] - 1, +m[3]), today = new Date();
      today.setHours(0, 0, 0, 0);
      var diff = Math.round((target - today) / DAY);
      var wd = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][target.getDay()];
      io.write(diff === 0 ? "that is today, a " + wd + "." : diff > 0 ? diff + " days from now — a " + wd + "." : (-diff) + " days ago — it was a " + wd + ".");
    } },
    when: { help: "when <city> — the time there now", run: function (rest, io) {
      var q = String(rest || "").trim().toLowerCase().replace(/\s+/g, "_");
      if (!q) { io.write("when <city>, for example: when tokyo"); return; }
      var zones = [];
      try { zones = Intl.supportedValuesOf ? Intl.supportedValuesOf("timeZone") : []; } catch (e) { zones = []; }
      var hit = zones.filter(function (z) { return z.toLowerCase().indexOf(q) !== -1; })[0];
      if (!hit) { io.write("no zone matches «" + rest + "» in this browser's table."); return; }
      var s;
      try { s = new Intl.DateTimeFormat("en-GB", { timeZone: hit, hour: "2-digit", minute: "2-digit", weekday: "short" }).format(new Date()); }
      catch (e) { s = "unknown"; }
      io.write(hit.replace(/_/g, " ") + " — " + s);
    } },
    moon: { help: "moon — tonight's phase", run: function (rest, io) {
      var p = moonPhase(Date.now());
      io.write("the moon is " + p.name + ", " + Math.round(p.lit * 100) + "% lit, " + p.age.toFixed(1) + " days old.");
      io.write("next full moon: " + dateOf(p.nextFull) + ".", "term-dim");
    } },
    sun: { help: "sun <lat> <lon> — sunrise and sunset today", run: function (rest, io) {
      var m = String(rest || "").trim().split(/[\s,]+/);
      var lat = parseFloat(m[0]), lon = parseFloat(m[1]);
      if (!isFinite(lat) || !isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) { io.write("sun <lat> <lon>, for example: sun 59.44 24.75"); return; }
      var s = sunTimes(lat, lon, Date.now());
      if (s.polar === "night") { io.write("the sun does not rise there today."); return; }
      if (s.polar === "day") { io.write("the sun does not set there today."); return; }
      io.write("sunrise " + hhmm(s.rise) + " · sunset " + hhmm(s.set) + " (your clock).");
    } },
    quiet: { help: "quiet <minutes> — do not disturb, then it lifts itself", run: function (rest, io) {
      var min = parseFloat(rest);
      if (!(min > 0)) { io.write("quiet <minutes>, for example: quiet 60"); return; }
      if (typeof window.sbSetControlToggle !== "function") { io.write("the desk is not listening."); return; }
      window.sbSetControlToggle("dnd", true);
      if (quietHandle) clearTimeout(quietHandle);
      quietHandle = setTimeout(function () { quietHandle = null; window.sbSetControlToggle("dnd", false); }, min * 60000);
      io.write("quiet for " + min + " min. no notice will interrupt you; it lifts itself after.");
    } },
    chronicle: { help: "chronicle — this system in numbers", run: function (rest, io) {
      var n = numbers();
      io.writeLines([
        "day " + n.days + " with " + username() + ". born " + dateOf(birthMs()) + ".",
        n.notes + " notes · " + n.words + " words · " + n.envelopes + " envelopes sealed · " + n.keys + " places in keys",
        n.chests + " chests opened of " + prizes().length + "."
      ]);
    } },
    note: { help: "note <text> — a sticky note on the desk", run: function (rest, io) {
      var text = String(rest || "").trim();
      if (!text) { io.write("note <text>, for example: note buy bread"); return; }
      if (typeof window.sbAddQuickNote !== "function") { io.write("notes are not listening."); return; }
      window.sbAddQuickNote(text, { onDesktop: true });
      io.write("noted. it is on the desk.");
    } }
  };

  /* ── ДВИЖОК: ЧТО ДАНО — ТО ЖИВЁТ ─────────────────────────────────────── */
  var KINDS = ["mood", "command", "word", "title", "serial", "stamp", "echo", "letter", "systemletter", "night", "rename", "countdown", "saver", "room"];
  function applyOne(p, fresh) {
    switch (p.kind) {
      case "mood": {
        var def = moodDef(p.params.mood);
        if (def && typeof window.sbAddMood === "function") window.sbAddMood(def);
        if (p.params.mood === "own") root.style.setProperty("--sb-own-hue", String(hue()));
        return;
      }
      case "command": {
        window.sbTerminalCommands = window.sbTerminalCommands || {};
        var c = COMMANDS[p.params.cmd];
        if (c) window.sbTerminalCommands[p.params.cmd] = c;
        return;
      }
      case "stamp": {
        if (!granted(p.id)) { root.removeAttribute("data-sigil"); return; }
        var svg = sigilSvg(48).replace("currentColor", "%23ffffff").replace(/currentColor/g, "%23ffffff");
        root.style.setProperty("--sb-sigil", 'url("data:image/svg+xml,' + encodeURIComponent(svg).replace(/%2523/g, "%23") + '")');
        root.setAttribute("data-sigil", "on");
        return;
      }
      case "room": {
        if (typeof window.sbRevealApp === "function") window.sbRevealApp(p.params.room);
        return;
      }
      case "night": { nightTick(); return; }
      case "saver": { saverArm(); return; }
      case "rename": { if (typeof window.sbRefreshNames === "function") window.sbRefreshNames(); return; }
      case "countdown": { refreshCountdowns(); return; }
      case "serial": { serial(); return; }
      case "systemletter": {
        if (fresh && typeof window.sbAddQuickNote === "function") window.sbAddQuickNote(systemLetter(), { from: "chest" });
        return;
      }
      default: return;   /* word, title, echo, letter — их спрашивают у сундука */
    }
  }
  function applyAll() {
    state().opened.forEach(function (o) { var p = prize(o.id); if (p) applyOne(p, false); });
    deliverLetter();
  }
  /* Выключить или включить подаренное. Ничего не теряется: вещь остаётся
     на полке, просто не действует. */
  function toggle(id, on) {
    var st = state(), p = prize(id), i = st.off.indexOf(id);
    if (!p || !p.switch || !opened(id)) return false;
    if (on && i !== -1) st.off.splice(i, 1);
    if (!on && i === -1) st.off.push(id);
    save();
    applyOne(p, false);
    if (!on && p.kind === "night") nightRestore();
    if (!on && p.kind === "saver") saverHide();
    if (p.kind === "rename" && typeof window.sbRefreshNames === "function") window.sbRefreshNames();
    if (window.sbPaintIris) window.sbPaintIris();
    return true;
  }

  /* ── НОЧЬ САМА: ПОСЛЕ ПОЛУНОЧИ — УГЛИ, УТРОМ — ВАША КОМНАТА ──────────── */
  var NIGHT_FROM = 0, NIGHT_TO = 6;
  function nightTick() {
    if (!kindGranted("night") || typeof window.sbGetWallpaperMood !== "function") return;
    var st = state(), h = new Date().getHours(), cur = window.sbGetWallpaperMood();
    if (h >= NIGHT_FROM && h < NIGHT_TO) {
      if (cur !== "ember") { st.night = { dayRoom: cur }; save(); window.sbSetWallpaperMood("ember"); }
    } else nightRestore();
  }
  function nightRestore() {
    var st = state();
    if (!st.night || !st.night.dayRoom) return;
    if (typeof window.sbGetWallpaperMood === "function" && window.sbGetWallpaperMood() === "ember") window.sbSetWallpaperMood(st.night.dayRoom);
    st.night = null; save();
  }
  setInterval(function () { try { nightTick(); refreshCountdowns(); } catch (e) { /* ignore */ } }, 60000);

  /* ── СЧЁТЧИК НА СТОЛЕ: ЗАМЕТКА, КОТОРАЯ САМА СЧИТАЕТ ДНИ ─────────────── */
  function countLine(date, label) {
    var t = T(), target = new Date(date + "T00:00:00"), today = new Date();
    today.setHours(0, 0, 0, 0);
    var n = Math.round((target - today) / DAY);
    if (!isFinite(n)) return label;
    if (n === 0) return fmt(t.count.today, { label: label });
    if (n > 0) return fmt(t.count.until, { n: n, label: label });
    return fmt(t.count.since, { n: -n, label: label });
  }
  function addCountdown(date, label) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || typeof window.sbAddQuickNote !== "function") return false;
    label = String(label || "").trim().slice(0, 60) || date;
    window.sbAddQuickNote(countLine(date, label), { onDesktop: true, from: "chest", countdown: { date: date, label: label } });
    return true;
  }
  function refreshCountdowns() {
    if (!window.sbNotesStore) return;
    var list, changed = false;
    try { list = window.sbNotesStore.load(); } catch (e) { return; }
    list.forEach(function (n) {
      if (!n || !n.countdown || !n.countdown.date) return;
      var line = countLine(n.countdown.date, n.countdown.label || n.countdown.date);
      var rest = String(n.text || "").split("\n").slice(1).join("\n");
      var next = rest ? line + "\n" + rest : line;
      if (next !== n.text) { n.text = next; n.updatedAt = Date.now(); changed = true; }
    });
    if (changed) { window.sbNotesStore.save(list); window.sbNotesStore.notify(); }
  }

  /* ── ЗАСТАВКА: СТОЛ БЕЗ ДВИЖЕНИЯ ГАСНЕТ В ТИХОЕ ПОЛЕ ─────────────────── */
  var saverLast = Date.now(), saverEl = null, saverOn = false, saverArmed = false, saverClock = null;
  function saverMinutes() { var p = prize("saver"); return (p && p.params && p.params.minutes) || 3; }
  function moonGlyph(size) {
    var ph = moonPhase(Date.now()), lit = ph.lit, waxing = ph.age < 29.530588853 / 2;
    var r = size / 2 - 2, cx = size / 2, cy = size / 2;
    /* Освещённая доля рисуется двумя дугами: терминатор — эллипс, чья ширина
       идёт от -r до r по мере фазы. */
    var k = (lit * 2 - 1) * r, sweepDark = waxing ? 0 : 1;
    var d = "M " + cx + " " + (cy - r) + " A " + r + " " + r + " 0 0 " + (waxing ? 1 : 0) + " " + cx + " " + (cy + r) +
      " A " + Math.abs(k) + " " + r + " 0 0 " + ((k >= 0) === waxing ? 0 : 1) + " " + cx + " " + (cy - r) + " Z";
    return '<svg viewBox="0 0 ' + size + " " + size + '" width="' + size + '" height="' + size + '" aria-hidden="true">' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="rgba(255,255,255,.08)"/>' +
      '<path d="' + d + '" fill="rgba(244,241,234,.92)"/>' + (sweepDark ? "" : "") + "</svg>";
  }
  function saverPaint() {
    if (!saverEl) return;
    var d = new Date();
    var time = (d.getHours() < 10 ? "0" : "") + d.getHours() + ":" + (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
    saverEl.innerHTML = '<div class="sb-saver-in"><div class="sb-saver-moon">' + moonGlyph(96) + "</div>" +
      '<div class="sb-saver-time">' + esc(time) + "</div>" +
      '<div class="sb-saver-date">' + esc(dateOf(Date.now())) + "</div>" +
      '<div class="sb-saver-name" data-sb-userdata>' + esc(username()) + "</div></div>";
  }
  function saverShow() {
    if (saverOn || doc.getElementById("sbVaultGate")) return;
    if (!saverEl) {
      saverEl = doc.createElement("div");
      saverEl.id = "sbSaver";
      saverEl.setAttribute("aria-hidden", "true");
      doc.body.appendChild(saverEl);
    }
    saverPaint();
    saverEl.hidden = false;
    saverOn = true;
    requestAnimationFrame(function () { if (saverEl) saverEl.classList.add("on"); });
    if (saverClock) clearInterval(saverClock);
    saverClock = setInterval(saverPaint, 30000);
  }
  function saverHide() {
    if (!saverOn) return;
    saverOn = false;
    if (saverClock) { clearInterval(saverClock); saverClock = null; }
    if (saverEl) { saverEl.classList.remove("on"); saverEl.hidden = true; }
  }
  function saverArm() {
    if (saverArmed) return;
    saverArmed = true;
    var touch = function () { saverLast = Date.now(); if (saverOn) saverHide(); };
    ["pointerdown", "pointermove", "keydown", "wheel", "touchstart"].forEach(function (e) { doc.addEventListener(e, touch, true); });
    setInterval(function () {
      if (!kindGranted("saver") || doc.visibilityState === "hidden") return;
      if (Date.now() - saverLast >= saverMinutes() * 60000) saverShow();
    }, 15000);
  }

  /* ── СВОЁ ИМЯ КОМНАТАМ ───────────────────────────────────────────────── */
  function roomName(id) {
    if (!kindGranted("rename")) return "";
    var v = state().names[id];
    return typeof v === "string" ? v.trim().slice(0, 18) : "";
  }
  function setRoomName(id, name) {
    var st = state();
    name = String(name || "").trim().slice(0, 18);
    if (name) st.names[id] = name; else delete st.names[id];
    save();
    if (typeof window.sbRefreshNames === "function") window.sbRefreshNames();
  }

  function open() {
    if (!available()) return null;
    var st = state(), id = currentId(), p = prize(id);
    if (!p) return null;
    st.opened.push({ id: id, at: Date.now() });
    save();
    applyOne(p, true);
    if (window.sbBus && window.sbBus.emit) window.sbBus.emit("chest:opened", { id: id });
    return p;
  }

  function word(kind) {
    if (!kindGranted("word", "word", kind)) return "";
    var name = username();
    if (kind === "tagline") return "only you and your system, " + name;
    if (kind === "farewell") return "The system sleeps when you do, " + name + ".";
    if (kind === "greeting") return "day " + daysKept() + " with " + name + ". " + state().opened.length + " chests opened.";
    return "";
  }
  function titleText() {
    var st = state();
    if (!kindGranted("title") || !st.title) return "";
    return T().titles[st.title] || "";
  }
  function personalLine(p) {
    var t = T().line, name = username();
    switch (p.kind) {
      case "mood": return p.params.mood === "own" ? fmt(t.own, { hue: hue(), name: name }) : fmt(t.mood, { room: byLang(p.title) });
      case "serial": return fmt(t.serial, { serial: serial() });
      case "night": return t.night;
      case "rename": return t.rename;
      case "countdown": return t.countdown;
      case "saver": return fmt(t.saver, { n: saverMinutes() });
      case "room": return fmt(t.room, { room: byLang(p.title) });
      case "stamp": return t.stamp;
      case "word": return fmt(t.word, { w: word(p.params.word) });
      case "title": return t.title;
      case "command": return fmt(t.command, { cmd: p.params.cmd });
      case "echo": return t.echo;
      case "letter": return fmt(t.letter, { d: p.params.days || 30 });
      case "systemletter": return t.systemletter;
      default: return "";
    }
  }

  /* ── КОМНАТА ─────────────────────────────────────────────────────────── */
  var justOpened = null, countdown = null;
  function chestSvg() {
    return '<svg class="ch-art" viewBox="0 0 160 120" aria-hidden="true">' +
      '<g class="ch-lid"><path d="M18 46V38a22 22 0 0 1 22-22h80a22 22 0 0 1 22 22v8z" fill="var(--ch-wood)" stroke="var(--ch-line)" stroke-width="2"/>' +
      '<path d="M72 46V16M88 46V16" stroke="var(--ch-line)" stroke-width="2"/></g>' +
      '<g class="ch-glow"><ellipse cx="80" cy="48" rx="56" ry="10" fill="var(--accent)" opacity=".55"/></g>' +
      '<rect x="18" y="46" width="124" height="60" rx="6" fill="var(--ch-wood)" stroke="var(--ch-line)" stroke-width="2"/>' +
      '<path d="M72 46v60M88 46v60" stroke="var(--ch-line)" stroke-width="2"/>' +
      '<rect x="72" y="52" width="16" height="16" rx="3" fill="var(--ch-line)"/><circle cx="80" cy="60" r="2.4" fill="var(--ch-wood)"/>' +
      "</svg>";
  }
  function render(win) {
    var host = (win && win.el) ? win.el.querySelector(".window-body") : win;
    if (!host) return;
    var t = T(), st = state(), total = st.order.length, n = st.opened.length;
    deliverLetter();
    var ready = available(), done = n >= total;
    var stateName = done ? "done" : (ready ? "ready" : "waiting");
    var out = '<div class="ch-wrap">';
    out += '<header class="ch-head"><h1 class="ch-title">' + esc(t.title) + "</h1><p class=\"ch-lead\">" + esc(t.lead) + "</p></header>";

    out += '<div class="ch-progress" aria-label="' + esc(fmt(t.progress, { n: n, total: total })) + '">';
    for (var i = 0; i < total; i++) {
      out += '<span class="ch-dot' + (i < n ? " on" : (i === n && ready ? " now" : "")) + '"></span>';
    }
    out += '<span class="ch-count">' + esc(fmt(t.progress, { n: n, total: total })) + "</span></div>";

    out += '<section class="ch-chest" data-state="' + stateName + '"' + (justOpened ? ' data-just="1"' : "") + ">" + chestSvg();
    if (done) out += '<p class="ch-say">' + esc(t.done) + "</p>";
    else if (ready) out += '<p class="ch-say">' + esc(t.ready) + '</p><button type="button" class="ch-open" id="chOpen">' + esc(t.open) + "</button>";
    else out += '<p class="ch-say ch-wait">' + esc(fmt(t.waiting, { t: untilTomorrow() })) + "</p>";
    out += "</section>";

    var show = justOpened || (n && !ready ? prize(st.opened[n - 1].id) : null);
    if (show) {
      out += '<section class="ch-prize' + (justOpened ? " fresh" : "") + '">' +
        '<p class="ch-prize-k">' + esc(t.got) + (t.tiers[show.tier] ? ' · <span class="ch-tier" data-tier="' + esc(show.tier) + '">' + esc(t.tiers[show.tier]) + "</span>" : "") + "</p>" +
        '<h2 class="ch-prize-title">' + esc(byLang(show.title)) + "</h2>" +
        '<p class="ch-prize-what">' + esc(byLang(show.what)) + "</p>" +
        '<p class="ch-prize-line">' + esc(personalLine(show)) + "</p>" +
        extraFor(show, t) +
        whereButton(show, t) +
        "</section>";
    }

    /* Эхо и письмо живут в комнате всегда, когда даны. */
    if (kindGranted("echo") && (!show || show.kind !== "echo")) out += echoHtml(t);
    if (kindGranted("letter") && (!show || show.kind !== "letter")) out += letterHtml(t);
    if (kindGranted("countdown") && (!show || show.kind !== "countdown")) out += countHtml(t);
    if (kindGranted("rename") && (!show || show.kind !== "rename")) out += renameHtml(t);

    out += '<section class="ch-shelf"><h3 class="ch-shelf-title">' + esc(t.shelf) + "</h3>";
    if (!n) out += '<p class="ch-empty">' + esc(t.shelfEmpty) + "</p>";
    else {
      out += "<ol>";
      st.opened.slice().reverse().forEach(function (o, k) {
        var p = prize(o.id);
        if (!p) return;
        var isOn = granted(o.id);
        out += '<li class="ch-item' + (p.switch && !isOn ? " off" : "") + '" data-id="' + esc(o.id) + '"><span class="ch-item-day">' + esc(fmt(t.day, { n: n - k })) + '</span>' +
          '<span class="ch-item-title">' + esc(byLang(p.title)) + '</span>' +
          (p.switch
            ? '<button type="button" class="ch-switch' + (isOn ? " on" : "") + '" data-id="' + esc(o.id) + '" aria-pressed="' + (isOn ? "true" : "false") + '">' + esc(isOn ? t.on : t.off) + "</button>"
            : '<span class="ch-item-date">' + esc(dateOf(o.at)) + "</span>") +
          "</li>";
      });
      out += "</ol>";
    }
    out += "</section>";
    out += '<p class="ch-honest">' + esc(t.honest) + "</p>";
    out += "</div>";

    var keep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
    host.innerHTML = out;
    if (keep && !justOpened) { try { keep(); } catch (e) { /* ignore */ } }
    wire(host, win);
    justOpened = null;
  }
  /* Кнопка «где это живёт»: комната — открыть её; аккаунт — открыть окно
     аккаунта; вход и сам сундук — кнопки нет, идти некуда. */
  function whereButton(p, t) {
    if (p.where === "account") return '<button type="button" class="ch-where" data-account="1">' + esc(t.where) + "</button>";
    if (!p.where || p.where === "chest" || p.where === "login") return "";
    return '<button type="button" class="ch-where" data-open="' + esc(p.where) + '">' + esc(t.where) + "</button>";
  }
  function extraFor(p, t) {
    if (p.kind === "title") return titleHtml(t);
    if (p.kind === "echo") return echoHtml(t);
    if (p.kind === "letter") return letterHtml(t);
    if (p.kind === "rename") return renameHtml(t);
    if (p.kind === "countdown") return countHtml(t);
    return "";
  }
  /* Комнаты для имён спрашиваются у реестра; Сундук себя не переименовывает. */
  function renameHtml(t) {
    var ids = (window.sbLaunchableApps ? window.sbLaunchableApps() : []).filter(function (id) { return id !== "chest"; });
    var st = state(), out = '<section class="ch-rename"><p class="ch-rename-k">' + esc(t.renameLead) + "</p>";
    ids.forEach(function (id) {
      var own = (window.SysBaby && window.SysBaby.apps[id]) ? window.SysBaby.apps[id] : null;
      var base = own ? ((own.i18n && own.i18n[lang()] && own.i18n[lang()].label) || own.label || own.title || id) : id;
      out += '<label class="ch-rename-row"><span class="ch-rename-base">' + esc(base) + '</span>' +
        '<input type="text" class="ch-rename" data-room="' + esc(id) + '" maxlength="18" value="' + esc(st.names[id] || "") + '" placeholder="' + esc(base) + '" data-sb-userdata></label>';
    });
    return out + "</section>";
  }
  function countHtml(t) {
    return '<section class="ch-count"><p class="ch-count-k">' + esc(t.countLead) + "</p>" +
      '<div class="ch-count-row"><label><span>' + esc(t.countDate) + '</span><input type="date" id="chCountDate" data-sb-nolang></label>' +
      '<label><span>' + esc(t.countLabel) + '</span><input type="text" id="chCountLabel" maxlength="60" data-sb-userdata></label>' +
      '<button type="button" class="ch-seal" id="chCountAdd">' + esc(t.countAdd) + '</button></div>' +
      '<p class="ch-count-done" id="chCountDone" hidden>' + esc(t.countDone) + "</p></section>";
  }
  function titleHtml(t) {
    var st = state(), out = '<div class="ch-titles">';
    if (st.title) out += '<p class="ch-titled">' + esc(fmt(t.titled, { t: T().titles[st.title] })) + "</p>";
    else out += '<p class="ch-titled">' + esc(t.chooseTitle) + "</p>";
    ["keeper", "warden", "gardener", "night"].forEach(function (k) {
      out += '<button type="button" class="ch-title-choice' + (st.title === k ? " on" : "") + '" data-title="' + k + '">' + esc(t.titles[k]) + "</button>";
    });
    return out + "</div>";
  }
  function echoHtml(t) {
    var e = echoLine();
    if (!e) return '<section class="ch-echo-box"><p class="ch-echo ch-echo-none">' + esc(t.echoNone) + "</p></section>";
    return '<section class="ch-echo-box"><p class="ch-echo-k">' + esc(fmt(t.echoLead, { ago: agoText(e.at) })) + '</p><blockquote class="ch-echo" data-sb-userdata>' + esc(e.text) + "</blockquote></section>";
  }
  function letterHtml(t) {
    var st = state(), p = prize("letter"), d = (p && p.params.days) || 30;
    if (st.letter && st.letter.delivered) return '<section class="ch-letter"><p class="ch-letter-k">' + esc(fmt(t.letterCame, { b: dateOf(st.letter.due) })) + "</p></section>";
    if (st.letter) return '<section class="ch-letter"><p class="ch-letter-k">' + esc(fmt(t.letterSealed, { a: dateOf(st.letter.at), b: dateOf(st.letter.due) })) + "</p></section>";
    return '<section class="ch-letter"><p class="ch-letter-k">' + esc(fmt(t.letterLead, { d: d })) + "</p>" +
      '<textarea id="chLetterText" rows="4" data-sb-userdata></textarea>' +
      '<button type="button" class="ch-seal" id="chLetterSeal">' + esc(t.letterSeal) + "</button></section>";
  }
  function wire(host, win) {
    var btn = host.querySelector("#chOpen");
    if (btn) btn.addEventListener("click", function () {
      var p = open();
      if (!p) return;
      justOpened = p;
      render(win);
    });
    host.querySelectorAll(".ch-where").forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.getAttribute("data-account")) { if (window.sbOpenAccountPanel) window.sbOpenAccountPanel(); return; }
        var id = b.getAttribute("data-open");
        if (id && typeof window.toggleApp === "function") window.toggleApp(id);
      });
    });
    host.querySelectorAll(".ch-title-choice").forEach(function (b) {
      b.addEventListener("click", function () {
        state().title = b.getAttribute("data-title");
        save();
        if (window.sbPaintIris) window.sbPaintIris();
        render(win);
      });
    });
    host.querySelectorAll(".ch-switch").forEach(function (b) {
      b.addEventListener("click", function () {
        var id = b.getAttribute("data-id");
        toggle(id, !granted(id));
        render(win);
      });
    });
    host.querySelectorAll(".ch-rename").forEach(function (inp) {
      inp.addEventListener("change", function () { setRoomName(inp.getAttribute("data-room"), inp.value); });
    });
    var countAdd = host.querySelector("#chCountAdd");
    if (countAdd) countAdd.addEventListener("click", function () {
      var d = host.querySelector("#chCountDate"), l = host.querySelector("#chCountLabel"), done = host.querySelector("#chCountDone");
      if (!d || !addCountdown(d.value, l ? l.value : "")) { if (d) d.focus(); return; }
      if (l) l.value = "";
      if (done) done.hidden = false;
    });
    var seal = host.querySelector("#chLetterSeal"), ta = host.querySelector("#chLetterText");
    if (seal && ta) seal.addEventListener("click", function () {
      var text = String(ta.value || "").trim();
      if (!text) { ta.focus(); return; }
      var p = prize("letter"), d = (p && p.params.days) || 30;
      state().letter = { text: text, at: Date.now(), due: Date.now() + d * DAY, delivered: 0 };
      save();
      render(win);
    });
    if (countdown) clearInterval(countdown);
    var wait = host.querySelector(".ch-wait");
    if (wait) countdown = setInterval(function () {
      if (!doc.body.contains(wait)) { clearInterval(countdown); countdown = null; return; }
      if (available()) { render(win); return; }
      wait.textContent = fmt(T().waiting, { t: untilTomorrow() });
    }, 30000);
  }

  window.sbChest = {
    prizes: prizes,
    kinds: function () { return KINDS.slice(); },
    state: state,
    available: available,
    open: open,
    granted: granted,
    toggle: toggle,
    word: word,
    title: titleText,
    serial: function () { return kindGranted("serial") ? serial() : ""; },
    sigil: function () { return kindGranted("stamp") ? sigilSvg(28) : ""; },
    roomName: roomName,
    hue: hue,
    numbers: numbers
  };

  if (typeof window.registerApp === "function") {
    window.registerApp("chest", {
      /* ЧТО НУЖНО, ЧТОБЫ ДЕЛАТЬ РАБОТУ (D-243). Охраняется tools/alive-check.mjs. */
      needs: ["диск"],
      /* СВОЁ МЕСТО НА ДИСКЕ (D-242). Охраняется room-rights-check.mjs. */
      keeps: [STORE_KEY],
      title: UI.en.title,
      label: UI.en.label,
      i18n: {
        ru: { title: UI.ru.title, label: UI.ru.label },
        ee: { title: UI.ee.title, label: UI.ee.label }
      },
      color: "linear-gradient(160deg,#f2c777 0%,#d9973a 52%,#8a5a1c 100%)",
      icon: ICON,
      size: { w: 640, h: 700 },
      retranslate: true,
      render: render
    });
  }
  /* ПОСЛЕ объявления, не до: ящик выдаётся по объявлению keeps, и чтение до
     регистрации ядро прав честно отказывало (замер: denial «чтение
     sysbaby.chest.v1»). */
  applyAll();
})();
