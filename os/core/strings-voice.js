/* sys.baby OS — core/strings-voice.js · СЛОВА ГОЛОСА И ИЗВЕЩЕНИЙ (D-810…819, v178-H4a, пакет П1)
 * Вливаются в общий словарь через window.sbAddStrings (D-800).
 * Формы обращения (у знакомства, window.sbAddr): key — «вы» без рода (умолчание);
 * key.ty — «ты» без рода; key.ty.m / key.ty.f — «ты» с родом; key.pub — «на людях».
 * В ET «ты/вы» свои (sina/teie), рода нет — не выдумываем. [слово] — слово-кнопка. */
(function () {
  "use strict";
  if (typeof window.sbAddStrings !== "function") return;
  window.sbAddStrings({
    en: {
      "voice.bell": "Evening edition",
      "voice.bellFoot": "Everything the house said that matters is here. Warm words are kept nowhere.",
      "voice.undo": "bring it back",
      "voice.or": " or ",
      "voice.read": "read",
      "voice.unread": "important — not read yet",
      "voice.resume": "You stopped here — [continue] or [let go]?",
      "voice.witness": "Witness: something left outside the list — [take a look].",
      "voice.knock": "While the house was locked, someone knocked: {n} — at {when}.",
      "voice.knock.pub": "While the house was locked, someone knocked."
    },
    ru: {
      "voice.bell": "Вечерний выпуск",
      "voice.bellFoot": "Здесь — всё, что дом сказал по делу. Тёплые слова не хранятся нигде.",
      "voice.undo": "вернуть",
      "voice.or": " или ",
      "voice.read": "прочитано",
      "voice.unread": "важное — не прочитано",
      "voice.resume": "Вы остановились здесь — [продолжить] или [отпустить]?",
      "voice.resume.ty": "Здесь осталось начатое — [продолжить] или [отпустить]?",
      "voice.resume.ty.m": "Ты остановился здесь — [продолжить] или [отпустить]?",
      "voice.resume.ty.f": "Ты остановилась здесь — [продолжить] или [отпустить]?",
      "voice.witness": "Свидетель: что-то ушло мимо описи — [посмотреть].",
      "voice.knock": "Пока дом был заперт, стучались: {n} — в {when}.",
      "voice.knock.pub": "Пока дом был заперт, кто-то стучался."
    },
    ee: {
      "voice.bell": "Õhtune väljaanne",
      "voice.bellFoot": "Siin on kõik, mida maja asja pärast ütles. Soojad sõnad ei jää kuhugi.",
      "voice.undo": "too tagasi",
      "voice.or": " või ",
      "voice.read": "loetud",
      "voice.unread": "oluline — veel lugemata",
      "voice.resume": "Jäite siin pooleli — [jätka] või [lase lahti]?",
      "voice.resume.ty": "Jäid siin pooleli — [jätka] või [lase lahti]?",
      "voice.witness": "Tunnistaja: midagi läks loetelust mööda — [vaata].",
      "voice.knock": "Kui maja oli lukus, koputati: {n} — kell {when}.",
      "voice.knock.pub": "Kui maja oli lukus, keegi koputas."
    }
  });
})();
