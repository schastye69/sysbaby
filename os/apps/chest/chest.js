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
      lead: "Once a day the system gives you one thing. {total} chests, in an order drawn at random for you alone — and the next one does not open until this one has.",
      open: "Open the chest", ready: "A chest is waiting.", waiting: "The next chest opens tomorrow — in {t}.",
      done: "All {total} are open. There are no more chests; everything they held is yours to keep.",
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
      focusLead: "One thing, quietly. Other windows step aside, notices wait.", focusMin: "{n} min", focusStop: "Stop", focusOn: "Focus: {t} left",
      focusDone: "Time is up", focusDoneLine: "{n} minutes on one thing. The desk is yours again.",
      sheetBtn: "A clean sheet", sheetQ: "What matters now?",
      dayLead: "On this day", dayNone: "Nothing on this day in earlier months or years — and the chest invents nothing. Your notes begin on {first}.", dayNoneYet: "No notes yet — the chest invents nothing.",
      monthAgo: "a month ago", monthsAgo: "{n} months ago", yearAgo: "a year ago", yearsAgo: "{n} years ago",
      layoutLead: "The windows as they stand — which are open and where.", layoutSave: "Save this arrangement", layoutBack: "Bring it back", layoutSaved: "Saved: {n} windows, {when}.", layoutNone: "Nothing saved yet.",
      rememberLine: "Day {n} with your system · {k} chests opened. Missed days took nothing from you: the chest waited.",
      keyLead: "Your lock and your envelopes, as they are right now.", keyLocked: "lock set, session open", keyShut: "lock set, session closed", keyNone: "no lock — the copy would be plain text",
      keyEnvelopes: "{n} envelopes sealed on this disk", keyLast: "last copy: {when}", keyNever: "no copy saved yet", keySave: "Save a sealed copy", keySaved: "Saved: {name}",
      tidyLead: "Icons back to the grid, windows in a cascade — and one tap to put it all back.", tidyDo: "Tidy up", tidyUndo: "Put it back", tidyDone: "Moved {i} icons and {w} windows.", tidyNothing: "Nothing to tidy.",
      secretHint: "The terminal knows one more word than its help admits.",
      shotLead: "A real picture of the desk, saved to your device.", shotDo: "Take a snapshot", shotDone: "Saved: {name}", shotNo: "This browser cannot capture the screen — nothing was pretended.", shotRefused: "The screen was not shared — nothing was saved.",
      fragmentLead: "Fragment of the day — from you and {date}.",
      rainLead: "Rain made by this device, right now — no recording.", rainOn: "Let it rain", rainOff: "Stop the rain", rainNo: "This browser has no sound engine — nothing was pretended.",
      voiceLead: "The voice of this device, once, when you ask.", voiceDo: "Say my name", voiceNo: "This browser cannot speak — nothing was pretended.", voiceNoLang: "This device has no voice for your language — nothing was pretended.", voiceSaid: "Said.", voiceText: "Good day, {name}. This is your system. Day {n} together.",
      breathLead: "One minute: in, hold, out, rest. Any touch ends it early.", breathDo: "Breathe one minute", breathIn: "breathe in", breathHold: "hold", breathOut: "breathe out", breathRest: "rest", breathLeave: "touch anywhere to leave", breathDone: "One minute of breath. Nothing was measured.",
      firstLead: "Where it began.", firstBorn: "You began on {date} at {time} — day {n} today.", firstNote: "Your first note, {date}:", firstNone: "No notes yet — the chest invents nothing. Your first note will stand here.",
      mapLead: "Map of days", mapLine: "Days with the system: {n} · with a chest opened: {k}. Empty dots are just empty days: nothing is lost, nothing is owed.",
      mileNote: "Day {n} with {name}.\n\n{notes} notes, {words} words, {envelopes} envelopes sealed, {chests} chests opened. Nothing here has left this device.\n\n— your system, on a round day",
      morningTitle: "Good morning, {name}", morningLine: "Day {n} with your system. The night was spent in Ember; your room returns in {m} minutes.",
      line: {
        mood: "The room «{room}» is now among your rooms.",
        own: "Your hue is {hue}° — derived from «{name}». No one else has this exact room.",
        night: "From tonight, after midnight the desk goes to Ember by itself and comes back in the morning.",
        rename: "Name your rooms below — the dock and the desk follow at once.",
        countdown: "Set a date below — the note appears on the desk and counts on its own.",
        saver: "Leave the desk still for {n} minutes and see.",
        room: "«{room}» now stands in your dock.",
        focus: "Pick the minutes below, or type «focus 15» in the terminal.",
        sheet: "Press below — a clean note appears on the desk with one question.",
        onthisday: "From now on this room shows what you wrote on this day before.",
        layout: "Save below when the windows stand the way you like.",
        morning: "The next morning after a night in Ember will greet you by name.",
        remember: "From now on the chest greets you with your day.",
        keysafe: "Below — the state of your lock, and one tap for a sealed copy.",
        tidy: "Below — one tap to tidy, one to put it back.",
        secret: "No hint beyond this: {hint}",
        alias: "Type «alias k=chronicle» in the terminal, then just «k».",
        shot: "Below — one tap; the browser will ask which screen.",
        trace: "Look at the very top edge of the desk. It will change with the hour.",
        fragment: "Today's fragment is below; tomorrow's will be different.",
        guest: "Look at the right edge of the desk.",
        rain: "Below — one tap starts it, one stops it.",
        voice: "Below — one tap, and the device says your name.",
        breath: "Below — one tap, one minute.",
        firstday: "Below — your beginning, as your own Notes remember it.",
        daysmap: "Below — every day since you began, as dots.",
        milestone: "Day {n} now. The next round day is {next}; the letter will find you in Notes.",
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
      lead: "Раз в сутки система дарит вам одну вещь. {total} сундуков в порядке, выпавшем случайно и только вам, — и следующий не откроется, пока не открыт этот.",
      open: "Открыть сундук", ready: "Сундук ждёт.", waiting: "Следующий сундук откроется завтра — через {t}.",
      done: "Все {total} открыты. Сундуков больше нет; всё, что в них было, остаётся вашим.",
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
      focusLead: "Одно дело, тихо. Остальные окна отходят, извещения ждут.", focusMin: "{n} мин", focusStop: "Стоп", focusOn: "Фокус: осталось {t}",
      focusDone: "Время вышло", focusDoneLine: "{n} минут на одно дело. Стол снова ваш.",
      sheetBtn: "Чистый лист", sheetQ: "Что сейчас важно?",
      dayLead: "В этот день", dayNone: "В этот день в прошлые месяцы и годы — ничего, и сундук ничего не выдумывает. Ваши записи начинаются {first}.", dayNoneYet: "Записей ещё нет — сундук ничего не выдумывает.",
      monthAgo: "месяц назад", monthsAgo: "{n} мес. назад", yearAgo: "год назад", yearsAgo: "{n} г. назад",
      layoutLead: "Окна как они стоят — какие открыты и где.", layoutSave: "Сохранить расклад", layoutBack: "Вернуть", layoutSaved: "Сохранено: окон {n}, {when}.", layoutNone: "Пока ничего не сохранено.",
      rememberLine: "День {n} с вашей системой · открыто {k}. Пропущенные дни ничего не отняли: сундук ждал.",
      keyLead: "Ваш замок и ваши конверты — как они есть сейчас.", keyLocked: "замок стоит, сеанс открыт", keyShut: "замок стоит, сеанс закрыт", keyNone: "замка нет — копия будет открытым текстом",
      keyEnvelopes: "конвертов запечатано на этом диске: {n}", keyLast: "последняя копия: {when}", keyNever: "копия ещё не сохранялась", keySave: "Сохранить запечатанную копию", keySaved: "Сохранено: {name}",
      tidyLead: "Значки на сетку, окна лесенкой — и одно касание, чтобы вернуть всё как было.", tidyDo: "Прибрать", tidyUndo: "Вернуть как было", tidyDone: "Переставлено: значков {i}, окон {w}.", tidyNothing: "Прибирать нечего.",
      secretHint: "Терминал знает на одно слово больше, чем признаёт его help.",
      shotLead: "Настоящая картинка стола, сохранённая на устройство.", shotDo: "Сделать снимок", shotDone: "Сохранено: {name}", shotNo: "Этот браузер не умеет снимать экран — ничего не изображалось.", shotRefused: "Экран не был показан — ничего не сохранено.",
      fragmentLead: "Фрагмент дня — из вас и {date}.",
      rainLead: "Дождь, который это устройство делает сейчас — без записи.", rainOn: "Пустить дождь", rainOff: "Остановить дождь", rainNo: "В этом браузере нет звукового движка — ничего не изображено.",
      voiceLead: "Голос этого устройства — один раз, когда попросите.", voiceDo: "Назови моё имя", voiceNo: "Этот браузер не умеет говорить — ничего не изображено.", voiceNoLang: "На этом устройстве нет голоса для вашего языка — ничего не изображено.", voiceSaid: "Сказано.", voiceText: "Добрый день, {name}. Это ваша система. День {n} вместе.",
      breathLead: "Минута: вдох, задержка, выдох, пауза. Любое касание заканчивает раньше.", breathDo: "Минуту дышать", breathIn: "вдох", breathHold: "задержка", breathOut: "выдох", breathRest: "пауза", breathLeave: "коснитесь, чтобы выйти", breathDone: "Минута дыхания. Ничего не измерялось.",
      firstLead: "Где всё началось.", firstBorn: "Вы начали {date} в {time} — сегодня день {n}.", firstNote: "Ваша первая запись, {date}:", firstNone: "Записей пока нет — сундук ничего не выдумывает. Первая запись встанет здесь.",
      mapLead: "Карта дней", mapLine: "Дней с системой: {n} · с открытым сундуком: {k}. Пустые точки — просто пустые дни: ничего не потеряно и никто ничего не должен.",
      mileNote: "День {n} с {name}.\n\n{notes} записей, {words} слов, {envelopes} конвертов запечатано, {chests} сундуков открыто. Ничто отсюда не покинуло это устройство.\n\n— ваша система, в круглый день",
      morningTitle: "Доброе утро, {name}", morningLine: "День {n} с вашей системой. Ночь прошла в Углях; ваша комната вернётся через {m} мин.",
      line: {
        mood: "Комната «{room}» теперь среди ваших комнат.",
        own: "Ваш тон — {hue}°, выведен из «{name}». Такой комнаты нет ни у кого другого.",
        night: "С этой ночи после полуночи стол сам уйдёт в Угли и утром вернётся.",
        rename: "Назовите комнаты ниже — док и стол подхватят сразу.",
        countdown: "Поставьте дату ниже — заметка появится на столе и будет считать сама.",
        saver: "Оставьте стол без движения на {n} минуты — и увидите.",
        room: "«{room}» теперь стоит в вашем доке.",
        focus: "Выберите минуты ниже или наберите «focus 15» в терминале.",
        sheet: "Нажмите ниже — на столе появится чистая заметка с одним вопросом.",
        onthisday: "Отныне эта комната показывает, что вы писали в этот день раньше.",
        layout: "Сохраните ниже, когда окна стоят так, как вам нравится.",
        morning: "Следующее утро после ночи в Углях поздоровается с вами по имени.",
        remember: "Отныне сундук встречает вас вашим днём.",
        keysafe: "Ниже — состояние замка и одно касание для запечатанной копии.",
        tidy: "Ниже — одно касание прибрать, одно вернуть.",
        secret: "Подсказки не будет, кроме этой: {hint}",
        alias: "Наберите «alias k=chronicle» в терминале, потом просто «k».",
        shot: "Ниже — одно касание; браузер спросит, какой экран.",
        trace: "Посмотрите на самую верхнюю кромку стола. Она будет меняться с часом.",
        fragment: "Сегодняшний фрагмент ниже; завтрашний будет другим.",
        guest: "Посмотрите на правый край стола.",
        rain: "Ниже — одно касание пускает, одно останавливает.",
        voice: "Ниже — одно касание, и устройство называет ваше имя.",
        breath: "Ниже — одно касание, одна минута.",
        firstday: "Ниже — ваше начало, каким его помнят ваши Записи.",
        daysmap: "Ниже — каждый день с начала, точками.",
        milestone: "Сейчас день {n}. Ближайший круглый — {next}; письмо найдёт вас в Записях.",
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
      lead: "Kord päevas annab süsteem sulle ühe asja. {total} laegast, järjekorras, mis on loositud ainult sulle — ja järgmine ei avane enne, kui see on avatud.",
      open: "Ava laegas", ready: "Laegas ootab.", waiting: "Järgmine laegas avaneb homme — {t} pärast.",
      done: "Kõik {total} on avatud. Rohkem laekaid pole; kõik, mis neis oli, jääb sulle.",
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
      focusLead: "Üks asi, vaikselt. Teised aknad astuvad kõrvale, teated ootavad.", focusMin: "{n} min", focusStop: "Peata", focusOn: "Fookus: jäänud {t}",
      focusDone: "Aeg on läbi", focusDoneLine: "{n} minutit ühele asjale. Laud on jälle sinu.",
      sheetBtn: "Puhas leht", sheetQ: "Mis on praegu oluline?",
      dayLead: "Sel päeval", dayNone: "Sel päeval varasematel kuudel ja aastatel — mitte midagi, ja laegas ei mõtle midagi välja. Sinu märkmed algavad {first}.", dayNoneYet: "Märkmeid veel pole — laegas ei mõtle midagi välja.",
      monthAgo: "kuu aega tagasi", monthsAgo: "{n} kuud tagasi", yearAgo: "aasta tagasi", yearsAgo: "{n} aastat tagasi",
      layoutLead: "Aknad nii, nagu need seisavad — millised on lahti ja kus.", layoutSave: "Salvesta paigutus", layoutBack: "Too tagasi", layoutSaved: "Salvestatud: {n} akent, {when}.", layoutNone: "Veel midagi pole salvestatud.",
      rememberLine: "Päev {n} sinu süsteemiga · avatud {k}. Vahele jäänud päevad ei võtnud midagi: laegas ootas.",
      keyLead: "Sinu lukk ja sinu ümbrikud — nii nagu need praegu on.", keyLocked: "lukk peal, seanss avatud", keyShut: "lukk peal, seanss suletud", keyNone: "lukku pole — koopia oleks lihttekst",
      keyEnvelopes: "sellel kettal pitseeritud ümbrikke: {n}", keyLast: "viimane koopia: {when}", keyNever: "koopiat pole veel salvestatud", keySave: "Salvesta pitseeritud koopia", keySaved: "Salvestatud: {name}",
      tidyLead: "Ikoonid ruudustikku, aknad kaskaadi — ja üks puudutus, et kõik endiseks panna.", tidyDo: "Korrasta", tidyUndo: "Pane endiseks", tidyDone: "Liigutatud: ikoone {i}, aknaid {w}.", tidyNothing: "Pole midagi korrastada.",
      secretHint: "Terminal teab ühe sõna rohkem, kui tema help tunnistab.",
      shotLead: "Laua tõeline pilt, salvestatud seadmesse.", shotDo: "Tee hetkepilt", shotDone: "Salvestatud: {name}", shotNo: "See brauser ei oska ekraani pildistada — midagi ei teeseldud.", shotRefused: "Ekraani ei jagatud — midagi ei salvestatud.",
      fragmentLead: "Päeva fragment — sinust ja {date}.",
      rainLead: "Vihm, mida see seade teeb praegu — ilma salvestuseta.", rainOn: "Lase vihma", rainOff: "Peata vihm", rainNo: "Selles brauseris pole helimootorit — midagi ei teeseldud.",
      voiceLead: "Selle seadme hääl — üks kord, kui palud.", voiceDo: "Ütle mu nimi", voiceNo: "See brauser ei oska rääkida — midagi ei teeseldud.", voiceNoLang: "Selles seadmes pole sinu keele häält — midagi ei teeseldud.", voiceSaid: "Öeldud.", voiceText: "Tere päevast, {name}. See on sinu süsteem. Päev {n} koos.",
      breathLead: "Minut: sisse, hoia, välja, paus. Iga puudutus lõpetab varem.", breathDo: "Hinga üks minut", breathIn: "hinga sisse", breathHold: "hoia", breathOut: "hinga välja", breathRest: "paus", breathLeave: "puuduta, et lahkuda", breathDone: "Minut hingamist. Midagi ei mõõdetud.",
      firstLead: "Kus kõik algas.", firstBorn: "Sa alustasid {date} kell {time} — täna on päev {n}.", firstNote: "Sinu esimene märge, {date}:", firstNone: "Märkmeid veel pole — laegas ei mõtle midagi välja. Esimene märge seisab siin.",
      mapLead: "Päevade kaart", mapLine: "Päevi süsteemiga: {n} · avatud laekaga: {k}. Tühjad täpid on lihtsalt tühjad päevad: midagi pole kadunud ja keegi ei võlgne midagi.",
      mileNote: "Päev {n} koos {name}.\n\n{notes} märget, {words} sõna, {envelopes} ümbrikku pitseeritud, {chests} laegast avatud. Miski siit pole sellest seadmest lahkunud.\n\n— sinu süsteem, ümmargusel päeval",
      morningTitle: "Tere hommikust, {name}", morningLine: "Päev {n} sinu süsteemiga. Öö möödus Hõõguses; sinu tuba tuleb tagasi {m} minuti pärast.",
      line: {
        mood: "Tuba «{room}» on nüüd sinu tubade seas.",
        own: "Sinu toon on {hue}° — tuletatud nimest «{name}». Sellist tuba pole kellelgi teisel.",
        night: "Alates tänasest ööst läheb laud pärast keskööd ise Hõõgusesse ja tuleb hommikul tagasi.",
        rename: "Nimeta toad allpool — dokk ja laud võtavad kohe üle.",
        countdown: "Pane allpool kuupäev — märge ilmub lauale ja loeb ise.",
        saver: "Jäta laud {n} minutiks liikumatuks — ja näed.",
        room: "«{room}» seisab nüüd sinu dokis.",
        focus: "Vali allpool minutid või kirjuta terminali «focus 15».",
        sheet: "Vajuta allpool — lauale ilmub puhas märge ühe küsimusega.",
        onthisday: "Nüüdsest näitab see tuba, mida sa sel päeval varem kirjutasid.",
        layout: "Salvesta allpool, kui aknad seisavad nii, nagu sulle meeldib.",
        morning: "Järgmine hommik pärast ööd Hõõguses tervitab sind nimepidi.",
        remember: "Nüüdsest tervitab laegas sind sinu päevaga.",
        keysafe: "Allpool — luku seis ja üks puudutus pitseeritud koopiaks.",
        tidy: "Allpool — üks puudutus korrastamiseks, üks tagasipanekuks.",
        secret: "Vihjet ei tule, peale selle: {hint}",
        alias: "Kirjuta terminali «alias k=chronicle», siis lihtsalt «k».",
        shot: "Allpool — üks puudutus; brauser küsib, milline ekraan.",
        trace: "Vaata laua kõige ülemist serva. See muutub tunniga.",
        fragment: "Tänane fragment on allpool; homne on teistsugune.",
        guest: "Vaata laua paremat serva.",
        rain: "All — üks puudutus alustab, üks peatab.",
        voice: "All — üks puudutus, ja seade ütleb sinu nime.",
        breath: "All — üks puudutus, üks minut.",
        firstday: "All — sinu algus, nagu sinu Märkmed seda mäletavad.",
        daysmap: "All — iga päev alates algusest, täppidena.",
        milestone: "Praegu on päev {n}. Järgmine ümmargune on {next}; kiri leiab sind Märkmetest.",
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
  /* ── ПАМЯТЬ СУНДУКА ЖИВЁТ В ЭПОХЕ ХРАНИЛИЩА (D-274) ─────────────────────
     ПОВОД, дословно от основателя 24.09.2026: «открываю сундук, перезахожу в
     свою же систему и у меня снова открытие сундуков начинается с самого
     начала... я уже говорил об этом».
     D-257 чинил первую причину и доказывал перезагрузкой — по незапертой
     системе. У основателя замок: при входе сперва дверь, и за ней защищённое
     не читается. Сундук успевал спросить память ДО двери (его слово нужно
     карточке входа), получал пустоту, заводил новый порядок и запоминал его;
     после двери показывал запомненную пустоту, а следующее открытие клало её
     поверх настоящей памяти. Теперь копия помнит эпоху хранилища и
     перечитывается, когда эпоха сменилась; пока хранилище закрыто, пустота
     не запоминается и не записывается. Охраняется lock-memory-check. */
  var cached = null, cachedEpoch = -1, transient = null;
  function epochNow() {
    try { return window.sbDB && window.sbDB.epoch ? window.sbDB.epoch() : 0; }
    catch (e) { return 0; /* ОТКАТ: ядро без эпох — одна эпоха на весь сеанс */ }
  }
  function closedNow() {
    try { return !!(window.sbDB && window.sbDB.closed && window.sbDB.closed()); }
    catch (e) { return false; /* ОТКАТ: не можем спросить — считаем открытым, как было */ }
  }
  function fresh() {
    return { v: 1, order: shuffle(prizes()), opened: [], title: "", letter: null, serial: "", echo: null, off: [], names: {}, night: null };
  }
  function state() {
    /* За дверью — временная пустота на эту минуту, не память: её нельзя ни
       запомнить, ни записать. */
    if (closedNow()) { if (!transient) transient = fresh(); return transient; }
    transient = null;
    var ep = epochNow();
    if (cached && cachedEpoch === ep) return cached;
    var st = null;
    try { var raw = box().get(STORE_KEY); st = raw ? JSON.parse(raw) : null; } catch (e) { st = null; }
    if (!st || !Array.isArray(st.order) || !Array.isArray(st.opened)) st = null;
    if (!st) st = fresh();
    if (!Array.isArray(st.off)) st.off = [];
    if (!st.names || typeof st.names !== "object") st.names = {};
    cached = st;
    cachedEpoch = ep;
    return st;
  }
  function save() {
    if (closedNow()) return;
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
    focus: { help: "focus [minutes] — quiet minutes on one thing · focus stop", run: function (rest, io) {
      if (/^stop$/i.test(rest)) { io.write(focusStop(false) ? "focus ended. the desk is yours again." : "no focus running."); return; }
      var min = focusStart(rest);
      io.write("focus: " + min + " min. other windows stepped aside; notices wait.");
    } },
    sheet: { help: "sheet — a clean note with one question", run: function (rest, io) {
      io.write(sheetOpen() ? "a clean sheet is on the desk." : "notes are not listening.");
    } },
    layout: { help: "layout save · layout back — the windows as they stand", run: function (rest, io) {
      if (/^save$/i.test(rest)) { io.write("saved: " + layoutSave() + " windows."); return; }
      if (/^back$/i.test(rest)) { var n = layoutBack(); io.write(n ? "bringing back " + n + " windows." : "nothing saved yet."); return; }
      io.write("layout save · layout back");
    } },
    prompt: { help: "", run: function (rest, io) {
      var g = String(rest || "").trim().slice(0, 3);
      state().prompt = g; save(); applyPrompt();
      io.write(g ? "the prompt is now " + g : "the prompt is itself again.");
    } },
    alias: { help: "alias k=chronicle · alias — list · alias -k — forget", run: function (rest, io) {
      var st = state(); st.aliases = st.aliases || {};
      var r = String(rest || "").trim();
      if (!r) { var keys = Object.keys(st.aliases); io.write(keys.length ? keys.map(function (k) { return k + " = " + st.aliases[k]; }).join(" · ") : "no aliases yet. alias k=chronicle"); return; }
      var m = /^-(\S+)$/.exec(r);
      if (m) { delete st.aliases[m[1]]; save(); publishAliases(); io.write("forgot " + m[1] + "."); return; }
      var eq = /^([a-z0-9_-]{1,16})\s*=\s*(.+)$/i.exec(r);
      if (!eq) { io.write("alias k=chronicle"); return; }
      st.aliases[eq[1].toLowerCase()] = eq[2].trim().slice(0, 80); save(); publishAliases();
      io.write(eq[1].toLowerCase() + " now means «" + st.aliases[eq[1].toLowerCase()] + "».");
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
  var KINDS = ["mood", "command", "word", "title", "serial", "stamp", "echo", "letter", "systemletter", "night", "rename", "countdown", "saver", "room", "focus", "sheet", "onthisday", "layout", "morning", "remember", "keysafe", "tidy", "secret", "shot", "trace", "fragment", "guest", "rain", "voice", "breath", "firstday", "daysmap", "milestone"];
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
      case "focus": {
        window.sbTerminalCommands = window.sbTerminalCommands || {};
        window.sbTerminalCommands.focus = COMMANDS.focus;
        return;
      }
      case "sheet": {
        window.sbTerminalCommands = window.sbTerminalCommands || {};
        window.sbTerminalCommands.sheet = COMMANDS.sheet;
        return;
      }
      case "layout": {
        window.sbTerminalCommands = window.sbTerminalCommands || {};
        window.sbTerminalCommands.layout = COMMANDS.layout;
        return;
      }
      case "morning": { return; }
      case "onthisday": { return; }
      case "remember": { return; }
      case "keysafe": { return; }
      case "shot": { return; }
      case "fragment": { return; }
      case "trace": { traceTick(); return; }
      case "guest": { guestTick(); return; }
      case "tidy": { return; }
      case "rain": { if (!granted(p.id)) rainStop(); return; }
      case "voice": { return; }
      case "breath": { return; }
      case "firstday": { return; }
      case "daysmap": { return; }
      case "milestone": {
        /* В день подарка круглые дни, что уже позади, считаются виденными:
           письмо задним числом — не письмо. */
        if (fresh) { var st0 = state(), n0 = daysKept(); st0.milestones = MILESTONES.filter(function (m) { return m < n0; }); save(); }
        milestoneTick();
        return;
      }
      case "secret": {
        /* Команда о себе не объявляет: help о ней молчит нарочно. */
        window.sbTerminalCommands = window.sbTerminalCommands || {};
        window.sbTerminalCommands.prompt = COMMANDS.prompt;
        applyPrompt();
        return;
      }
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
    publishAliases();
    deliverLetter();
  }
  function publishAliases() {
    window.sbTerminalAliases = granted("alias") ? (state().aliases || {}) : {};
  }
  function applyPrompt() {
    var g = granted("secret") ? String(state().prompt || "") : "";
    window.sbTerminalPromptGlyph = function () { return g; };
    if (typeof window.sbTerminalRepaint === "function") window.sbTerminalRepaint();
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
    if (!on && p.kind === "trace") traceHide();
    if (!on && p.kind === "guest") guestHide();
    if (!on && p.kind === "rain") rainStop();
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
    var inEmber = typeof window.sbGetWallpaperMood === "function" && window.sbGetWallpaperMood() === "ember";
    /* ПЕРВОЕ УТРО: не рывком. Двадцать минут — Суточная комната (её утренний
       свет и есть рассвет), приветствие по имени и по дню, потом своя. */
    if (inEmber && kindGranted("morning") && !st.morning) {
      var mins = morningMinutes();
      st.morning = { dayRoom: st.night.dayRoom, until: Date.now() + mins * 60000 };
      st.night = null; save();
      window.sbSetWallpaperMood("daylight");
      if (window.showToast) window.showToast(fmt(T().morningTitle, { name: username() }), fmt(T().morningLine, { n: daysKept(), m: mins }), ICON, true, "", "event");
      return;
    }
    if (inEmber) window.sbSetWallpaperMood(st.night.dayRoom);
    st.night = null; save();
  }
  function morningMinutes() { var p = prize("morning"); return (p && p.params && p.params.minutes) || 20; }
  function morningTick() {
    var st = state();
    if (!st.morning) return;
    if (Date.now() < st.morning.until) return;
    if (typeof window.sbGetWallpaperMood === "function" && window.sbGetWallpaperMood() === "daylight" && st.morning.dayRoom) window.sbSetWallpaperMood(st.morning.dayRoom);
    st.morning = null; save();
  }
  setInterval(function () { try { nightTick(); morningTick(); refreshCountdowns(); focusTick(); traceTick(); guestTick(); milestoneTick(); } catch (e) { /* ignore */ } }, 60000);

  /* ── ОДИН ФОКУС: ТИХИЕ МИНУТЫ НА ОДНО ДЕЛО ───────────────────────────── */
  var focus = null, focusBadge = null, focusClock = null;
  function focusStart(min) {
    min = Math.max(1, Math.min(180, parseInt(min, 10) || 15));
    focusStop(true);
    var keep = null;
    try {
      var wins = window.openWindows || {};
      Object.keys(wins).forEach(function (id) {
        var w = wins[id];
        if (!w || w.minimized) return;
        if (w.el && w.el.classList.contains("focused")) { keep = id; return; }
      });
      Object.keys(wins).forEach(function (id) {
        if (id === keep || id === "chest") return;
        if (wins[id] && !wins[id].minimized && typeof window.sbMinimizeWindow === "function") window.sbMinimizeWindow(id);
      });
    } catch (e) { /* окна — не условие фокуса */ }
    if (typeof window.sbSetControlToggle === "function") window.sbSetControlToggle("dnd", true);
    focus = { min: min, until: Date.now() + min * 60000 };
    focusBadge = doc.createElement("div");
    focusBadge.id = "sbFocusBadge";
    focusBadge.className = "fixed-badge";
    doc.body.appendChild(focusBadge);
    focusPaint();
    focusClock = setInterval(focusTick, 1000);
    return min;
  }
  function focusPaint() {
    if (!focus || !focusBadge) return;
    var left = Math.max(0, focus.until - Date.now()), m = Math.floor(left / 60000), sec = Math.floor((left % 60000) / 1000);
    focusBadge.textContent = fmt(T().focusOn, { t: m + ":" + (sec < 10 ? "0" : "") + sec });
  }
  function focusTick() {
    if (!focus) return;
    if (Date.now() >= focus.until) {
      var min = focus.min;
      focusStop(false);
      if (window.showToast) window.showToast(T().focusDone, fmt(T().focusDoneLine, { n: min }), ICON, true, "", "event");
      return;
    }
    focusPaint();
  }
  function focusStop(quiet) {
    if (focusClock) { clearInterval(focusClock); focusClock = null; }
    if (focusBadge && focusBadge.parentNode) focusBadge.parentNode.removeChild(focusBadge);
    focusBadge = null;
    if (focus && typeof window.sbSetControlToggle === "function") window.sbSetControlToggle("dnd", false);
    var was = !!focus;
    focus = null;
    return was && !quiet;
  }

  /* ── ЧИСТЫЙ ЛИСТ ─────────────────────────────────────────────────────── */
  function sheetOpen() {
    if (typeof window.sbAddQuickNote !== "function") return null;
    var id = window.sbAddQuickNote("", { onDesktop: true, sheet: true, x: 160 + Math.round(Math.random() * 60), y: 120 + Math.round(Math.random() * 40) });
    setTimeout(function () {
      var ta = doc.querySelector('.sticky-note[data-id="' + id + '"] .note-text');
      if (ta) ta.focus();
    }, 80);
    return id;
  }

  /* ── В ЭТОТ ДЕНЬ ─────────────────────────────────────────────────────── */
  function onThisDay() {
    var notes = [];
    try { notes = window.sbNotesStore ? window.sbNotesStore.load() : []; } catch (e) { notes = []; }
    var today = new Date(), out = [], first = null;
    notes.forEach(function (n) {
      if (!n || n.from === "chest" || !n.text) return;
      var at = new Date(Number(n.updatedAt) || 0);
      if (!first || at < first) first = at;
      if (at.getDate() !== today.getDate()) return;
      var months = (today.getFullYear() - at.getFullYear()) * 12 + (today.getMonth() - at.getMonth());
      if (months <= 0) return;
      out.push({ months: months, at: at.getTime(), line: String(n.text).split("\n")[0].slice(0, 160) });
    });
    out.sort(function (a, b) { return a.months - b.months; });
    return { items: out, first: first ? first.getTime() : null };
  }
  function agoMonths(m) {
    var t = T();
    if (m % 12 === 0) { var y = m / 12; return y === 1 ? t.yearAgo : fmt(t.yearsAgo, { n: y }); }
    return m === 1 ? t.monthAgo : fmt(t.monthsAgo, { n: m });
  }

  /* ── ПОРЯДОК: ПРИБРАТЬ И ВЕРНУТЬ ─────────────────────────────────────── */
  var tidyUndo = null;
  function tidyDo() {
    var wins = window.openWindows || {}, ids = Object.keys(wins).filter(function (id) { return wins[id] && !wins[id].minimized && id !== "chest"; });
    var places = typeof window.sbIconPlaces === "function" ? window.sbIconPlaces() : {};
    tidyUndo = { icons: places, wins: ids.map(function (id) { var w = wins[id]; return { id: id, left: w.x, top: w.y, w: w.w, h: w.h }; }) };
    var moved = typeof window.sbTidyDesk === "function" ? window.sbTidyDesk() : 0;
    var bar = 60;
    try { bar = Math.round(doc.getElementById("topbar").getBoundingClientRect().height) || 60; } catch (e) { bar = 60; }
    ids.forEach(function (id, i) {
      if (typeof window.sbPlaceWindow === "function") window.sbPlaceWindow(id, { left: 40 + i * 32, top: bar + 24 + i * 32, w: wins[id].w, h: wins[id].h });
    });
    return { icons: moved, wins: ids.length };
  }
  function tidyBack() {
    if (!tidyUndo) return false;
    if (typeof window.sbRestoreIconPlaces === "function") window.sbRestoreIconPlaces(tidyUndo.icons);
    tidyUndo.wins.forEach(function (r) {
      if (typeof window.sbPlaceWindow === "function") window.sbPlaceWindow(r.id, { left: r.left, top: r.top, w: r.w, h: r.h });
    });
    tidyUndo = null;
    return true;
  }

  /* ── КЛЮЧ СОХРАНЁН: СОСТОЯНИЕ ЗАМКА И ЗАПЕЧАТАННАЯ КОПИЯ ─────────────── */
  function keyState() {
    var V = window.sbVault, out = { locked: false, open: false, envelopes: 0, last: 0 };
    try { out.locked = !!(V && V.available() && V.isLocked()); out.open = !!(V && V.isOpen()); } catch (e) { /* ignore */ }
    try { out.envelopes = window.sbSeals ? window.sbSeals.names().length : 0; } catch (e) { out.envelopes = 0; }
    try { out.last = (window.sbBackup && window.sbBackup.state && window.sbBackup.state().lastOk) || 0; } catch (e) { out.last = 0; }
    return out;
  }
  function keySave() {
    if (typeof window.sbExportProfile !== "function") return Promise.resolve(null);
    var text = JSON.stringify(window.sbExportProfile(), null, 1), V = window.sbVault;
    var sealed = !!(V && V.isLocked() && V.isOpen() && typeof V.seal === "function");
    return (sealed ? V.seal(text) : Promise.resolve(text)).then(function (body) {
      var name = "sysbaby-copy-" + new Date().toISOString().slice(0, 10) + (sealed ? ".sealed.json" : ".json");
      var blob = new Blob([sealed ? body : text], { type: "application/json" });
      var a = doc.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = name;
      doc.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
      return { name: name, sealed: sealed };
    });
  }

  /* ── СНИМОК ДНЯ: НАСТОЯЩАЯ КАРТИНКА СТОЛА ЧЕРЕЗ СОГЛАСИЕ БРАУЗЕРА ───── */
  function shotSupported() {
    try { return !!(navigator.mediaDevices && typeof navigator.mediaDevices.getDisplayMedia === "function"); } catch (e) { return false; }
  }
  function shotTake() {
    if (!shotSupported()) return Promise.reject(new Error("unsupported"));
    return navigator.mediaDevices.getDisplayMedia({ video: true, audio: false }).then(function (stream) {
      var video = doc.createElement("video");
      video.muted = true; video.srcObject = stream;
      return new Promise(function (resolve, reject) {
        var done = false;
        var finish = function () {
          if (done) return; done = true;
          try {
            var c = doc.createElement("canvas");
            /* ОТКАТ: если поток ещё не назвал размер кадра — обычный размер экрана,
               чтобы снимок всё же получился, а не пустой файл нулевой ширины. */
            c.width = video.videoWidth || 1280; c.height = video.videoHeight || 720;
            c.getContext("2d").drawImage(video, 0, 0, c.width, c.height);
            stream.getTracks().forEach(function (t) { t.stop(); });
            c.toBlob(function (blob) {
              if (!blob) { reject(new Error("no-frame")); return; }
              var name = "sysbaby-desk-" + new Date().toISOString().slice(0, 10) + ".png";
              var a = doc.createElement("a");
              a.href = URL.createObjectURL(blob); a.download = name;
              doc.body.appendChild(a); a.click();
              setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 400);
              resolve({ name: name });
            }, "image/png");
          } catch (e) { stream.getTracks().forEach(function (t) { t.stop(); }); reject(e); }
        };
        video.addEventListener("loadeddata", function () { setTimeout(finish, 120); });
        video.play().catch(function () { finish(); });
        setTimeout(finish, 2500);
      });
    });
  }

  /* ── СВЕТОВОЙ СЛЕД: ПОЛОСКА СВЕТА ПО ВЕРХНЕЙ КРОМКЕ, ЗА ЧАСОМ ────────── */
  var traceEl = null;
  function traceHue(h) {
    /* Рассвет — золото, полдень — белизна, вечер — янтарь, ночь — синева;
       между ними — по прямой, без ступеней. */
    var pts = [[0, 225, 30], [5, 225, 30], [7, 42, 80], [12, 48, 12], [17, 34, 80], [21, 24, 60], [24, 225, 30]];
    for (var i = 1; i < pts.length; i++) {
      if (h <= pts[i][0]) {
        var a = pts[i - 1], b = pts[i], f = (h - a[0]) / (b[0] - a[0]);
        /* Тон — по короткой дуге круга: от янтаря к синеве через розовые
           сумерки, а не через зелень посреди ночи. */
        var dh = b[1] - a[1];
        if (dh > 180) dh -= 360; else if (dh < -180) dh += 360;
        return { hue: (Math.round(a[1] + dh * f) + 360) % 360, sat: Math.round(a[2] + (b[2] - a[2]) * f) };
      }
    }
    return { hue: 225, sat: 30 };
  }
  function traceTick() {
    if (!kindGranted("trace")) { traceHide(); return; }
    if (!traceEl) {
      traceEl = doc.createElement("div");
      traceEl.id = "sbDayTrace";
      traceEl.setAttribute("aria-hidden", "true");
      doc.body.appendChild(traceEl);
    }
    var d = new Date(), h = d.getHours() + d.getMinutes() / 60, c = traceHue(h);
    traceEl.style.setProperty("--trace-hue", String(c.hue));
    traceEl.style.setProperty("--trace-sat", c.sat + "%");
    traceEl.setAttribute("data-hour", String(d.getHours()));
  }
  function traceHide() { if (traceEl && traceEl.parentNode) traceEl.parentNode.removeChild(traceEl); traceEl = null; }

  /* ── ФРАГМЕНТ: МАЛЕНЬКИЙ ПРЕДМЕТ ИЗ ВАС И ДАТЫ ───────────────────────── */
  function fragmentSvg(size) {
    var seed = hash32(username().toLowerCase() + "|" + dayKey(Date.now()) + "|fragment"), s = size || 120 /* ОТКАТ: размер по умолчанию для комнаты */, n = 6, cell = s / n;
    var out = '<svg viewBox="0 0 ' + s + " " + s + '" width="' + s + '" height="' + s + '" aria-hidden="true" data-seed="' + seed + '">';
    var h = hue(), x, y, k = 0;
    for (y = 0; y < n; y++) for (x = 0; x < n; x++) {
      var v = (seed >>> (k % 29)) & 7; k += 5;
      if (v < 3) continue;
      var r = cell * (0.18 + (v - 3) * 0.08), cx = x * cell + cell / 2, cy = y * cell + cell / 2;
      var tone = (h + (v * 37) % 60 - 30 + 360) % 360;
      out += (v % 2)
        ? '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + r.toFixed(1) + '" fill="hsl(' + tone + ' 60% 62%)" fill-opacity=".85"/>'
        : '<rect x="' + (cx - r).toFixed(1) + '" y="' + (cy - r).toFixed(1) + '" width="' + (2 * r).toFixed(1) + '" height="' + (2 * r).toFixed(1) + '" rx="' + (r / 3).toFixed(1) + '" fill="hsl(' + tone + ' 50% 70%)" fill-opacity=".8"/>';
    }
    return out + "</svg>";
  }

  /* ── МАЛЕНЬКИЙ ГОСТЬ: ТИХИЙ КОТ НА КРАЮ СТОЛА ─────────────────────────── */
  var guestEl = null;
  function guestTick() {
    var st = state();
    if (!kindGranted("guest") || st.guestGone === dayKey(Date.now())) { guestHide(); return; }
    if (guestEl) return;
    guestEl = doc.createElement("button");
    guestEl.type = "button";
    guestEl.id = "sbGuest";
    guestEl.setAttribute("aria-label", byLang(prize("guest").title));
    guestEl.innerHTML = '<svg viewBox="0 0 64 48" aria-hidden="true"><path d="M10 46c-2-8-1-16 3-22l-1-12 8 6c4-1 8-1 12 0l8-6-1 12c4 6 5 14 3 22z"/><path d="M40 40c6 0 10-4 14-10 2-3 6-1 4 3-4 8-10 12-18 12" opacity=".9"/><circle cx="22" cy="24" r="1.6" fill="rgba(0,0,0,.55)"/><circle cx="32" cy="24" r="1.6" fill="rgba(0,0,0,.55)"/></svg>';
    guestEl.addEventListener("click", function () {
      state().guestGone = dayKey(Date.now()); save();
      guestEl.classList.add("leaving");
      setTimeout(guestHide, 500);
    });
    doc.body.appendChild(guestEl);
  }
  function guestHide() { if (guestEl && guestEl.parentNode) guestEl.parentNode.removeChild(guestEl); guestEl = null; }


  /* ── ТИХИЙ ДОЖДЬ: ШУМ, КОТОРЫЙ ДЕЛАЕТ САМО УСТРОЙСТВО ────────────────── */
  var rain = null;
  function rainSupported() { return typeof (window.AudioContext || window.webkitAudioContext) === "function"; }
  function rainStart() {
    if (rain || !rainSupported()) return false;
    var AC = window.AudioContext || window.webkitAudioContext;
    var ctx = new AC(), sr = ctx.sampleRate, len = sr * 2, buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0), i, last = 0, w;
    /* Коричневый шум: каждый отсчёт — шаг от предыдущего. Так шумит дождь по
       крыше, а не эфир. Два секунды в кольце — шва не слышно. */
    for (i = 0; i < len; i++) { w = Math.random() * 2 - 1; last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }
    var src = ctx.createBufferSource(); src.buffer = buf; src.loop = true;
    var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900;
    var gain = ctx.createGain(); gain.gain.value = 0.0001;
    /* Капли: редкие короткие всплески высоких частот. */
    var hp = ctx.createBiquadFilter(); hp.type = "bandpass"; hp.frequency.value = 3200; hp.Q.value = 6;
    var drops = ctx.createGain(); drops.gain.value = 0.0;
    src.connect(lp); lp.connect(gain); gain.connect(ctx.destination);
    src.connect(hp); hp.connect(drops); drops.connect(ctx.destination);
    src.start();
    gain.gain.setTargetAtTime(0.09, ctx.currentTime, 1.2);
    var dropTimer = setInterval(function () {
      if (!rain) return;
      var t = ctx.currentTime;
      drops.gain.cancelScheduledValues(t);
      drops.gain.setValueAtTime(0.0, t);
      drops.gain.linearRampToValueAtTime(0.05 + Math.random() * 0.05, t + 0.01);
      drops.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    }, 140 + Math.floor(Math.random() * 120));
    rain = { ctx: ctx, src: src, gain: gain, drops: dropTimer };
    if (ctx.state === "suspended") ctx.resume().catch(function () { /* без жеста — молчит */ });
    return true;
  }
  function rainStop() {
    if (!rain) return;
    var r = rain; rain = null;
    clearInterval(r.drops);
    try { r.gain.gain.setTargetAtTime(0.0001, r.ctx.currentTime, 0.4); } catch (e) { /* ignore */ }
    setTimeout(function () { try { r.src.stop(); } catch (e) { /* ignore */ } try { r.ctx.close(); } catch (e) { /* ignore */ } }, 1500);
  }
  function rainState() { return rain ? { on: true, state: rain.ctx.state } : { on: false, state: "" }; }

  /* ── ГОЛОС: УСТРОЙСТВО ПРОИЗНОСИТ ИМЯ ─────────────────────────────────── */
  function voiceSupported() { return !!(window.speechSynthesis && typeof window.SpeechSynthesisUtterance === "function"); }
  /* Голос на СВОЁМ языке — или честное «нет». Если устройство перечислило
     голоса и среди них нет ни одного для языка системы, чужой голос прочёл
     бы эстонскую фразу по-английски: это был бы не подарок, а насмешка. Пустой
     список значит «ещё не загрузились» — тогда выбирает сам браузер. */
  function voiceFor(tag) {
    var list = [];
    try { list = window.speechSynthesis.getVoices() || []; } catch (e) { list = []; }
    if (!list.length) return { known: false, voice: null };
    var pre = tag.slice(0, 2).toLowerCase(), hit = null;
    list.forEach(function (v) { if (!hit && String(v.lang || "").toLowerCase().indexOf(pre) === 0) hit = v; });
    return { known: true, voice: hit };
  }
  function voiceSay() {
    if (!voiceSupported()) return false;
    var tag = lang() === "ee" ? "et-EE" : (lang() === "ru" ? "ru-RU" : "en-GB");
    var pick = voiceFor(tag);
    if (pick.known && !pick.voice) return "nolang";
    var text = fmt(T().voiceText, { name: username(), n: daysKept() });
    var u = new window.SpeechSynthesisUtterance(text);
    if (pick.voice) u.voice = pick.voice;
    u.lang = tag;
    u.rate = 0.95;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    return true;
  }

  /* ── МИНУТА ДЫХАНИЯ: КРУГ ДЫШИТ ВМЕСТЕ С ЧЕЛОВЕКОМ ────────────────────── */
  /* ПОСТОЯННАЯ: четыре секунды на фазу — «квадратное дыхание» 4-4-4-4, самая
     распространённая безопасная схема; не число о составе системы. */
  var BREATH_STEP = 4000;
  var breath = null;
  function breathSeconds() { var p = prize("breath"); return (p && p.params && p.params.seconds) || 60 /* ОТКАТ: минута по описи */; }
  function breathStart() {
    if (breath) return;
    var t = T(), el = doc.createElement("div");
    el.id = "sbBreathMinute";   /* не #sbBreath: так зовётся дыхание стола (D-141) */
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", byLang(prize("breath").title));
    el.innerHTML = '<div class="sb-breath-in"><div class="sb-breath-ring"></div><p class="sb-breath-phase" data-phase="in">' + esc(t.breathIn) + '</p><p class="sb-breath-left">' + esc(t.breathLeave) + "</p></div>";
    doc.body.appendChild(el);
    var end = function () { breathStop(true); };
    el.addEventListener("pointerdown", end);
    el.addEventListener("keydown", end);
    breath = { el: el, start: Date.now(), until: Date.now() + breathSeconds() * 1000, timer: setInterval(breathTick, 250) };
    requestAnimationFrame(function () { el.classList.add("on"); });
  }
  function breathTick() {
    if (!breath) return;
    var now = Date.now();
    if (now >= breath.until) { breathStop(false); return; }
    var phases = ["in", "hold", "out", "rest"], keys = { "in": "breathIn", hold: "breathHold", out: "breathOut", rest: "breathRest" };
    var k = Math.floor((now - breath.start) / BREATH_STEP) % 4, ph = phases[k];
    var p = breath.el.querySelector(".sb-breath-phase");
    if (p && p.getAttribute("data-phase") !== ph) { p.setAttribute("data-phase", ph); p.textContent = T()[keys[ph]]; }
  }
  function breathStop(early) {
    if (!breath) return;
    var b = breath; breath = null;
    clearInterval(b.timer);
    if (b.el.parentNode) b.el.parentNode.removeChild(b.el);
    if (!early && window.showToast) window.showToast(byLang(prize("breath").title), T().breathDone, ICON, true, "", "event");
  }

  /* ── ВАШ ПЕРВЫЙ ДЕНЬ: СПРОШЕНО У ЗАПИСЕЙ, НЕ ВЫДУМАНО ─────────────────── */
  function firstNote() {
    var notes = [];
    try { notes = window.sbNotesStore ? window.sbNotesStore.load() : []; } catch (e) { notes = []; }
    var first = null;
    notes.forEach(function (n) {
      if (!n || n.from === "chest" || !String(n.text || "").trim()) return;
      var at = Number(n.createdAt || n.updatedAt) || 0;
      if (!first || at < first.at) first = { at: at, text: String(n.text).trim() };
    });
    return first;
  }
  function timeOf(t) {
    try { return new Date(t).toLocaleTimeString(lang() === "ee" ? "et-EE" : (lang() === "ru" ? "ru-RU" : "en-GB"), { hour: "2-digit", minute: "2-digit" }); }
    catch (e) { return new Date(t).toISOString().slice(11, 16); }
  }

  /* ── КРУГЛЫЕ ДНИ: ПИСЬМО В СОТЫЙ, В ГОДОВОЙ, В ТЫСЯЧНЫЙ ──────────────── */
  /* ПОСТОЯННАЯ: сто, год и тысяча — круглые дни по описи приза (params.days);
     здесь лишь отражение описи, а не память о составе системы. */
  var MILESTONES = (function () { var p = prize("milestone"); return (p && p.params && Array.isArray(p.params.days)) ? p.params.days.slice() : []; })();
  function milestoneTick() {
    if (!kindGranted("milestone") || typeof window.sbAddQuickNote !== "function") return;
    var st = state(), n = daysKept();
    if (!Array.isArray(st.milestones)) st.milestones = [];
    MILESTONES.forEach(function (m) {
      if (n < m || st.milestones.indexOf(m) !== -1) return;
      var k = numbers();
      window.sbAddQuickNote(fmt(T().mileNote, { n: m, name: username(), notes: k.notes, words: k.words, envelopes: k.envelopes, chests: k.chests }), { from: "chest" });
      st.milestones.push(m); save();
    });
  }
  function nextMilestone() {
    var n = daysKept();
    for (var i = 0; i < MILESTONES.length; i++) if (MILESTONES[i] > n) return MILESTONES[i];
    return null;
  }

  /* ── МОЙ РАСКЛАД ─────────────────────────────────────────────────────── */
  function layoutSave() {
    var wins = window.openWindows || {}, list = [];
    Object.keys(wins).forEach(function (id) {
      var w = wins[id];
      if (!w || w.minimized || id === "chest") return;
      list.push({ id: id, left: w.x, top: w.y, w: w.w, h: w.h });
    });
    state().layout = { at: Date.now(), wins: list };
    save();
    return list.length;
  }
  function layoutBack() {
    var lay = state().layout;
    if (!lay || !lay.wins || !lay.wins.length) return 0;
    lay.wins.forEach(function (r, i) {
      var open = !!(window.openWindows || {})[r.id];
      if (!open && typeof window.toggleApp === "function") window.toggleApp(r.id);
      setTimeout(function () {
        var w = (window.openWindows || {})[r.id];
        if (w && w.minimized && typeof window.toggleApp === "function") window.toggleApp(r.id);
        if (typeof window.sbPlaceWindow === "function") window.sbPlaceWindow(r.id, { left: r.left, top: r.top, w: r.w, h: r.h });
      }, 420 + i * 60);
    });
    return lay.wins.length;
  }

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
      case "focus": return t.focus;
      case "sheet": return t.sheet;
      case "onthisday": return t.onthisday;
      case "layout": return t.layout;
      case "morning": return t.morning;
      case "remember": return t.remember;
      case "keysafe": return t.keysafe;
      case "tidy": return t.tidy;
      case "secret": return fmt(t.secret, { hint: T().secretHint });
      case "shot": return t.shot;
      case "trace": return t.trace;
      case "fragment": return t.fragment;
      case "guest": return t.guest;
      case "rain": return t.rain;
      case "voice": return t.voice;
      case "breath": return t.breath;
      case "firstday": return t.firstday;
      case "daysmap": return t.daysmap;
      case "milestone": { var nx = nextMilestone(); return fmt(t.milestone, { n: daysKept(), next: nx === null ? "—" : nx }); }
      case "command": if (p.id === "alias") return t.alias; return fmt(t.command, { cmd: p.params.cmd });
      case "stamp": return t.stamp;
      case "word": return fmt(t.word, { w: word(p.params.word) });
      case "title": return t.title;
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
    out += '<header class="ch-head"><h1 class="ch-title">' + esc(t.title) + "</h1><p class=\"ch-lead\">" + esc(fmt(t.lead, { total: total })) + "</p>" +
      (kindGranted("remember") ? '<p class="ch-remember">' + esc(fmt(t.rememberLine, { n: daysKept(), k: n })) + "</p>" : "") + "</header>";

    out += '<div class="ch-progress" aria-label="' + esc(fmt(t.progress, { n: n, total: total })) + '">';
    for (var i = 0; i < total; i++) {
      out += '<span class="ch-dot' + (i < n ? " on" : (i === n && ready ? " now" : "")) + '"></span>';
    }
    out += '<span class="ch-count">' + esc(fmt(t.progress, { n: n, total: total })) + "</span></div>";

    out += '<section class="ch-chest" data-state="' + stateName + '"' + (justOpened ? ' data-just="1"' : "") + ">" + chestSvg();
    if (done) out += '<p class="ch-say">' + esc(fmt(t.done, { total: total })) + "</p>";
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
    if (kindGranted("focus") && (!show || show.kind !== "focus")) out += focusHtml(t);
    if (kindGranted("tidy") && (!show || show.kind !== "tidy")) out += tidyHtml(t);
    if (kindGranted("fragment") && (!show || show.kind !== "fragment")) out += fragmentHtml(t);
    if (kindGranted("shot") && (!show || show.kind !== "shot")) out += shotHtml(t);
    if (kindGranted("rain") && (!show || show.kind !== "rain")) out += rainHtml(t);
    if (kindGranted("voice") && (!show || show.kind !== "voice")) out += voiceHtml(t);
    if (kindGranted("breath") && (!show || show.kind !== "breath")) out += breathHtml(t);
    if (kindGranted("firstday") && (!show || show.kind !== "firstday")) out += firstHtml(t);
    if (kindGranted("daysmap") && (!show || show.kind !== "daysmap")) out += mapHtml(t);
    if (kindGranted("keysafe") && (!show || show.kind !== "keysafe")) out += keyHtml(t);
    if (kindGranted("sheet") && (!show || show.kind !== "sheet")) out += sheetHtml(t);
    if (kindGranted("onthisday") && (!show || show.kind !== "onthisday")) out += dayHtml(t);
    if (kindGranted("layout") && (!show || show.kind !== "layout")) out += layoutHtml(t);
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
  function focusHtml(t) {
    return '<section class="ch-focus"><p class="ch-focus-k">' + esc(t.focusLead) + '</p><div class="ch-focus-row">' +
      [15, 25, 45].map(function (m) { return '<button type="button" class="ch-title-choice ch-focus-btn" data-min="' + m + '">' + esc(fmt(t.focusMin, { n: m })) + "</button>"; }).join("") +
      (focus ? '<button type="button" class="ch-title-choice ch-focus-stop" id="chFocusStop">' + esc(t.focusStop) + "</button>" : "") +
      "</div></section>";
  }
  function sheetHtml(t) {
    return '<section class="ch-sheet"><button type="button" class="ch-seal" id="chSheet">' + esc(t.sheetBtn) + '</button><span class="ch-sheet-q">«' + esc(t.sheetQ) + "»</span></section>";
  }
  function dayHtml(t) {
    var r = onThisDay(), out = '<section class="ch-day"><p class="ch-day-k">' + esc(t.dayLead) + " · " + esc(dateOf(Date.now())) + "</p>";
    if (!r.items.length) {
      out += '<p class="ch-day-none">' + esc(r.first ? fmt(t.dayNone, { first: dateOf(r.first) }) : t.dayNoneYet) + "</p>";
    } else {
      out += "<ul>" + r.items.map(function (it) {
        return '<li class="ch-day-item"><span class="ch-day-ago">' + esc(agoMonths(it.months)) + '</span><span class="ch-day-line" data-sb-userdata>' + esc(it.line) + "</span></li>";
      }).join("") + "</ul>";
    }
    return out + "</section>";
  }
  function layoutHtml(t) {
    var lay = state().layout;
    return '<section class="ch-layout"><p class="ch-layout-k">' + esc(t.layoutLead) + "</p>" +
      '<p class="ch-layout-state">' + esc(lay && lay.wins ? fmt(t.layoutSaved, { n: lay.wins.length, when: dateOf(lay.at) }) : t.layoutNone) + "</p>" +
      '<div class="ch-focus-row"><button type="button" class="ch-seal" id="chLayoutSave">' + esc(t.layoutSave) + "</button>" +
      (lay && lay.wins && lay.wins.length ? '<button type="button" class="ch-title-choice" id="chLayoutBack">' + esc(t.layoutBack) + "</button>" : "") +
      "</div></section>";
  }
  function keyHtml(t) {
    var k = keyState();
    return '<section class="ch-key"><p class="ch-key-k">' + esc(t.keyLead) + "</p>" +
      '<p class="ch-key-state">' + esc(k.locked ? (k.open ? t.keyLocked : t.keyShut) : t.keyNone) + " · " + esc(fmt(t.keyEnvelopes, { n: k.envelopes })) + "</p>" +
      '<p class="ch-key-last">' + esc(k.last ? fmt(t.keyLast, { when: dateOf(k.last) }) : t.keyNever) + "</p>" +
      '<div class="ch-focus-row"><button type="button" class="ch-seal" id="chKeySave">' + esc(t.keySave) + '</button><span class="ch-key-said" id="chKeySaid"></span></div></section>';
  }
  function tidyHtml(t) {
    return '<section class="ch-tidy"><p class="ch-tidy-k">' + esc(t.tidyLead) + "</p>" +
      '<div class="ch-focus-row"><button type="button" class="ch-seal" id="chTidy">' + esc(t.tidyDo) + "</button>" +
      (tidyUndo ? '<button type="button" class="ch-title-choice" id="chTidyBack">' + esc(t.tidyUndo) + "</button>" : "") +
      '<span class="ch-tidy-said" id="chTidySaid"></span></div></section>';
  }
  function shotHtml(t) {
    return '<section class="ch-shot"><p class="ch-shot-k">' + esc(t.shotLead) + "</p>" +
      (shotSupported()
        ? '<div class="ch-focus-row"><button type="button" class="ch-seal" id="chShot">' + esc(t.shotDo) + '</button><span class="ch-shot-said" id="chShotSaid"></span></div>'
        : '<p class="ch-shot-no">' + esc(t.shotNo) + "</p>") + "</section>";
  }
  function fragmentHtml(t) {
    return '<section class="ch-fragment"><p class="ch-fragment-k">' + esc(fmt(t.fragmentLead, { date: dateOf(Date.now()) })) + '</p><div class="ch-fragment-art">' + fragmentSvg(120) + "</div></section>";
  }
  function rainHtml(t) {
    var r = rainState();
    return '<section class="ch-rain"><p class="ch-rain-k">' + esc(t.rainLead) + "</p>" +
      (rainSupported()
        ? '<div class="ch-focus-row"><button type="button" class="ch-seal" id="chRain" data-on="' + (r.on ? "1" : "0") + '">' + esc(r.on ? t.rainOff : t.rainOn) + "</button></div>"
        : '<p class="ch-rain-no">' + esc(t.rainNo) + "</p>") + "</section>";
  }
  function voiceHtml(t) {
    return '<section class="ch-voice"><p class="ch-voice-k">' + esc(t.voiceLead) + "</p>" +
      (voiceSupported()
        ? '<div class="ch-focus-row"><button type="button" class="ch-seal" id="chVoice">' + esc(t.voiceDo) + '</button><span class="ch-voice-said" id="chVoiceSaid"></span></div>'
        : '<p class="ch-voice-no">' + esc(t.voiceNo) + "</p>") + "</section>";
  }
  function breathHtml(t) {
    return '<section class="ch-breath"><p class="ch-breath-k">' + esc(t.breathLead) + '</p><div class="ch-focus-row"><button type="button" class="ch-seal" id="chBreath">' + esc(t.breathDo) + "</button></div></section>";
  }
  function firstHtml(t) {
    var b = birthMs(), f = firstNote();
    return '<section class="ch-first"><p class="ch-first-k">' + esc(t.firstLead) + '</p><p class="ch-first-born">' + esc(fmt(t.firstBorn, { date: dateOf(b), time: timeOf(b), n: daysKept() })) + "</p>" +
      (f ? '<p class="ch-first-when">' + esc(fmt(t.firstNote, { date: dateOf(f.at) })) + '</p><blockquote class="ch-first-note" data-sb-userdata>' + esc(f.text.length > 400 ? f.text.slice(0, 400) + "…" : f.text) + "</blockquote>"
         : '<p class="ch-first-none">' + esc(t.firstNone) + "</p>") + "</section>";
  }
  function mapHtml(t) {
    var st = state(), n = daysKept(), b = birthMs(), lit = {}, k = 0, i, out, dots = "";
    st.opened.forEach(function (o) { lit[dayKey(o.at)] = true; });
    var today = dayKey(Date.now());
    /* Считается то, что СВЕТИТСЯ на карте, а не всё, что лежит в описи:
       сундук, открытый раньше дня рождения профиля (перенос, часы), на карте
       не стоит — и в число не входит. */
    for (i = 0; i < n; i++) {
      var d = dayKey(b + i * DAY);
      if (lit[d]) k++;
      dots += '<span class="ch-map-dot' + (lit[d] ? " on" : "") + (d === today ? " today" : "") + '"></span>';
    }
    out = '<section class="ch-map"><p class="ch-map-k">' + esc(t.mapLead) + '</p><div class="ch-map-grid" role="img" aria-label="' + esc(fmt(t.mapLine, { n: n, k: k })) + '">' + dots;
    return out + '</div><p class="ch-map-line">' + esc(fmt(t.mapLine, { n: n, k: k })) + "</p></section>";
  }
  function extraFor(p, t) {
    if (p.kind === "shot") return shotHtml(t);
    if (p.kind === "rain") return rainHtml(t);
    if (p.kind === "voice") return voiceHtml(t);
    if (p.kind === "breath") return breathHtml(t);
    if (p.kind === "firstday") return firstHtml(t);
    if (p.kind === "daysmap") return mapHtml(t);
    if (p.kind === "fragment") return fragmentHtml(t);
    if (p.kind === "keysafe") return keyHtml(t);
    if (p.kind === "tidy") return tidyHtml(t);
    if (p.kind === "focus") return focusHtml(t);
    if (p.kind === "sheet") return sheetHtml(t);
    if (p.kind === "onthisday") return dayHtml(t);
    if (p.kind === "layout") return layoutHtml(t);
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
    var rainBtn = host.querySelector("#chRain");
    if (rainBtn) rainBtn.addEventListener("click", function () {
      if (rainState().on) rainStop(); else rainStart();
      var on = rainState().on;
      rainBtn.setAttribute("data-on", on ? "1" : "0");
      rainBtn.textContent = on ? T().rainOff : T().rainOn;
    });
    var voiceBtn = host.querySelector("#chVoice");
    if (voiceBtn) voiceBtn.addEventListener("click", function () {
      var said = host.querySelector("#chVoiceSaid");
      var r = voiceSay();
      if (said) said.textContent = r === "nolang" ? T().voiceNoLang : (r ? T().voiceSaid : "");
    });
    var breathBtn = host.querySelector("#chBreath");
    if (breathBtn) breathBtn.addEventListener("click", function () { breathStart(); });
    var shotBtn = host.querySelector("#chShot");
    if (shotBtn) shotBtn.addEventListener("click", function () {
      shotBtn.disabled = true;
      var said = host.querySelector("#chShotSaid");
      shotTake().then(function (r) {
        shotBtn.disabled = false;
        if (said) said.textContent = fmt(T().shotDone, { name: r.name });
      }, function () {
        shotBtn.disabled = false;
        if (said) said.textContent = T().shotRefused;
      });
    });
    var tidyBtn = host.querySelector("#chTidy");
    if (tidyBtn) tidyBtn.addEventListener("click", function () {
      var r = tidyDo();
      render(win);
      var said = host.querySelector("#chTidySaid") || (win.el && win.el.querySelector("#chTidySaid"));
      if (said) said.textContent = (r.icons || r.wins) ? fmt(T().tidyDone, { i: r.icons, w: r.wins }) : T().tidyNothing;
    });
    var tidyBackBtn = host.querySelector("#chTidyBack");
    if (tidyBackBtn) tidyBackBtn.addEventListener("click", function () { tidyBack(); render(win); });
    var keyBtn = host.querySelector("#chKeySave");
    if (keyBtn) keyBtn.addEventListener("click", function () {
      keyBtn.disabled = true;
      keySave().then(function (r) {
        keyBtn.disabled = false;
        var said = host.querySelector("#chKeySaid");
        if (said && r) said.textContent = fmt(T().keySaved, { name: r.name });
      }, function () { keyBtn.disabled = false; });
    });
    host.querySelectorAll(".ch-focus-btn").forEach(function (b) {
      b.addEventListener("click", function () { focusStart(b.getAttribute("data-min")); render(win); });
    });
    var fstop = host.querySelector("#chFocusStop");
    if (fstop) fstop.addEventListener("click", function () { focusStop(false); render(win); });
    var sheetBtn = host.querySelector("#chSheet");
    if (sheetBtn) sheetBtn.addEventListener("click", function () { sheetOpen(); });
    var laySave = host.querySelector("#chLayoutSave");
    if (laySave) laySave.addEventListener("click", function () { layoutSave(); render(win); });
    var layBack = host.querySelector("#chLayoutBack");
    if (layBack) layBack.addEventListener("click", function () { layoutBack(); });
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
    rain: rainState,
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
