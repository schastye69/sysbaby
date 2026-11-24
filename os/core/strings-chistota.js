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
 * Охраняется tools/i18n-chistota-check.mjs (ru/en/ee у каждого ключа). */
(function () {
  if (typeof window.sbAddStrings !== "function") return;
  window.sbAddStrings({
    en: {
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
