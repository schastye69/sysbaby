/* sys.baby OS — core/strings-chistota.js
 * Новые слова архива «Чистота» (v178-H4b, основатель 11.11.2026): через
 * window.sbAddStrings, как у пакетов «Дома» (strings-*.js), — таблица strings.js
 * держит прежние ключи, правки её значений объявлены в tools/strings-text-edits.json.
 *   set.switch.on/off      — тумблер словами «да · нет» (D-840-WORDS-SWITCHES);
 *   set.general.noteTouch  — строка Общего на касании без обещания клавиш (D-842);
 *   clock.cal.hintPointer  — подсказка календаря при мыши: «выберите», а не «коснитесь» (обход п.25);
 *   voice.bell (поверх strings-voice.js) — заголовок подноса выпуска строчными (обход п.27);
 *   meet.win.title/first.skip/first.go и set.tab.meet (поверх strings-meet.js) — знакомство строчными (обход п.37);
 *   welcome.hintPointer    — подсказка приветственной заметки при мыши (обход п.38);
 *   k.everywhere           — «искать везде» в палитре, когда кроме поиска ничего нет (глубокий аудит Б-11, D-878);
 *   ec.count.few           — «2 отзвука» (обход п.51); fv.unitTiny — «меньше килобайта» (п.48).
 *   lock.about.body, tip.privacy, set.privacy.leavesBody, set.about.networkValue, set.about.note — ПРАВДА О ПРИВАТНОСТИ (D-1434-PRIVACY-TRUTH,
 *   основатель 25.11.2026: «переписываем честно»): всё хранится на устройстве; наружу уходят только зашифрованные капли
 *   Шёпота через почтальонов и то, что человек сам отправляет или передаёт; все выходы — раздел «наружу»
 *   (shared/outward.data.js). Прежние «ни одного запроса наружу» / «ничего не покидает эту сессию» спорили с описью.
 *   sc.expose, sc.terminal — без «Экспозе» и «История терминала» (осмотр H4e4 п.13).
 *   note.placeholder, clock.cal.hint — строчными (осмотр оболочки H4e4 п.4, п.18; ee — на «teie», как стол, п.10);
 *   acc.k.password — «слово», а не «пароль» (D-1433, термины основателя 25.11.2026: «„слово“ вместо „пароль“ везде»).
 * Охраняется tools/i18n-chistota-check.mjs (ru/en/ee у каждого ключа). */
(function () {
  if (typeof window.sbAddStrings !== "function") return;
  window.sbAddStrings({
    en: {
      "acc.k.password": "word",
      "note.placeholder": "write something…", "clock.cal.hint": "touch a date — a note for that day appears on the desk.",
      "sc.expose": "every window at once", "sc.terminal": "earlier terminal commands",
      "lock.about.body": "sys.baby is your private home in the browser. Everything lies only on this device, locked with your word: without it neither your records nor even their names can be read. Only sealed Whisper drops go out, through the postmen — and whatever you send or hand over yourself.",
      "tip.privacy": "Everything is kept on this device.",
      "set.privacy.leavesBody": "Everything is kept on this device: no server, no sync. Only sealed Whisper drops leave it, through the postmen — and whatever you send or hand over yourself. Every exit is listed under “outward”. A copy of your data is made only by you, below.",
      "set.about.networkValue": "no analytics, no tracking, no calls home. Only sealed Whisper drops go out, through the postmen — and whatever you send or hand over yourself. Pages you open in Browser talk to their own sites. Every exit is listed under “outward”.",
      "set.about.note": "Systems here live in this browser, not on a server. Only what the “outward” list names ever leaves it.",
      "set.switch.on": "on", "set.switch.off": "off",
      "set.general.noteTouch": "open anything — through search; windows — in the top bar",
      "clock.cal.hintPointer": "a date — a note for that day",
      "voice.bell": "evening edition",
      "meet.win.title": "getting acquainted", "meet.first.skip": "skip", "meet.first.go": "enter the home", "set.tab.meet": "getting acquainted",
      "welcome.hintPointer": "click an empty spot to leave your own",
      "ec.count.few": "{n} echoes", "fv.unitTiny": "under a kilobyte",
      "k.everywhere": "search everywhere"
    },
    ru: {
      "acc.k.password": "слово",
      "note.placeholder": "напишите что-нибудь…", "clock.cal.hint": "коснитесь даты — на столе появится заметка на этот день.",
      "sc.expose": "все окна разом", "sc.terminal": "прежние команды терминала",
      "lock.about.body": "Это ваш личный дом в браузере. Всё лежит только на этом устройстве и заперто вашим словом: без него не прочитать ни записей, ни даже их названий. Наружу уходят только зашифрованные капли Шёпота через почтальонов — и то, что вы сами отправляете или передаёте.",
      "tip.privacy": "Всё хранится на этом устройстве.",
      "set.privacy.leavesBody": "Всё хранится на этом устройстве: сервера и синхронизации нет. Наружу уходят только зашифрованные капли Шёпота через почтальонов — и то, что вы сами отправляете или передаёте. Все выходы названы в разделе «наружу». Копию данных делаете только вы, ниже.",
      "set.about.networkValue": "ни аналитики, ни слежения, ни звонков домой. Наружу уходят только зашифрованные капли Шёпота через почтальонов — и то, что вы сами отправляете или передаёте; страницы, открытые в браузере, говорят со своими сайтами. Все выходы — в разделе «наружу».",
      "set.about.note": "Системы здесь живут в этом браузере, а не на сервере. Наружу уходит только то, что названо в разделе «наружу».",
      "set.switch.on": "да", "set.switch.off": "нет",
      "set.general.noteTouch": "открыть что угодно — через поиск; окна — в шапке",
      "clock.cal.hintPointer": "дата — заметка на этот день",
      "voice.bell": "вечерний выпуск",
      "meet.win.title": "знакомство", "meet.first.skip": "пропустить", "meet.first.go": "войти в дом", "set.tab.meet": "знакомство",
      "welcome.hintPointer": "{V:коснись|коснитесь} пустого места, чтобы оставить свою",   /* доска H4b: одна тихая строка «коснитесь» и у мыши (welcome-note-once, D-851) */
      "ec.count.few": "{n} отзвука", "fv.unitTiny": "меньше килобайта",
      "k.everywhere": "искать везде"
    },
    ee: {
      "acc.k.password": "sõna",
      "note.placeholder": "kirjutage midagi…", "clock.cal.hint": "puudutage kuupäeva — lauale ilmub selle päeva märge.",
      "sc.expose": "kõik aknad korraga", "sc.terminal": "terminali varasemad käsud",
      "lock.about.body": "sys.baby on sinu privaatne kodu brauseris. Kõik on ainult selles seadmes ja lukus sinu sõnaga: ilma selleta ei saa lugeda ei kirjeid ega isegi nende nimesid. Välja lähevad ainult Sosina pitseeritud tilgad postiljonide kaudu — ja see, mida ise saadad või edasi annad.",
      "tip.privacy": "Kõik hoitakse selles seadmes.",
      "set.privacy.leavesBody": "Kõik hoitakse selles seadmes: serverit ega sünkroonimist pole. Välja lähevad ainult Sosina pitseeritud tilgad postiljonide kaudu — ja see, mida te ise saadate või edasi annate. Kõik väljapääsud on nimetatud jaotises „välja”. Andmete koopia teete ainult teie, allpool.",
      "set.about.networkValue": "ei analüütikat, ei jälgimist, ei kõnet koju. Välja lähevad ainult Sosina pitseeritud tilgad postiljonide kaudu — ja see, mida te ise saadate või edasi annate; Brauseris avatud lehed suhtlevad oma saitidega. Kõik väljapääsud on jaotises „välja”.",
      "set.about.note": "Süsteemid elavad siin selles brauseris, mitte serveris. Välja läheb ainult see, mida nimekiri „välja” nimetab.",
      "set.switch.on": "jah", "set.switch.off": "ei",
      "set.general.noteTouch": "ava ükskõik mida — otsingu kaudu; aknad — päises",
      "clock.cal.hintPointer": "kuupäev — selle päeva märge",
      "voice.bell": "õhtune väljaanne",
      "meet.win.title": "tutvus", "meet.first.skip": "jäta vahele", "meet.first.go": "sisene koju", "set.tab.meet": "tutvus",
      "welcome.hintPointer": "klõpsake tühjal kohal, et jätta oma märge",
      "ec.count.few": "{n} kaja", "fv.unitTiny": "alla kilobaidi",
      "k.everywhere": "otsi kõikjalt"
    }
  });
})();
