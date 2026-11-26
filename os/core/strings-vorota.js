/* sys.baby OS — core/strings-vorota.js · СЛОВА ВОРОТ И ВЫХОДА (архив H4e5, D-1430…D-1433)
 * Вливаются в общий словарь через window.sbAddStrings (D-800); позднее сильнее — строки ниже заменяют прежние
 * значения strings.js, сам strings.js не правится.
 *   Слоган под дверью не переводится (D-1433, уточнение основателя 25.11.2026): «only you and your encrypted system, baby.». Выход из ключницы (D-1432) — прежнее слово cc.signout, нового нет.
 *   page.home — описание в заголовке вкладки и описании страницы (D-1433): «your private home» / «ваш личный дом» (дом говорит на «вы», D-833) /
 *   «sinu privaatne kodu».
 *   sc.k.tapTwice, sc.k.rightClick — жесты в списке сочетаний словами, а не «tap + tap»/«right-click» (осмотр H4e4 п.13).
 *   Правда о приватности (D-1434) — поверх прежних ключей strings.js, потому в core/strings-chistota.js: его словарь
 *   strings-move-check вливает в ожидаемую таблицу (пакет правок текстов). */
(function () {
  "use strict";
  if (typeof window.sbAddStrings !== "function") return;
  window.sbAddStrings({
    en: {
      "page.home": "your private home", "sc.k.tapTwice": "tap twice", "sc.k.rightClick": "right mouse button"
    },
    ru: {
      "page.home": "ваш личный дом", "sc.k.tapTwice": "двойное касание", "sc.k.rightClick": "правая кнопка мыши"
    },
    ee: {
      "page.home": "sinu privaatne kodu", "sc.k.tapTwice": "topeltpuudutus", "sc.k.rightClick": "hiire parem nupp"
    }
  });
})();
