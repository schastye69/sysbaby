/* sys.baby OS — core/strings-themes.js
 * Заготовка П0 (v178-H4a, D-800). Владелец — П4: слова тем через window.sbAddStrings.
 * Подключён в index.html и попадает в опись офлайна.
 *
 * D-870 (основатель 10–11.11.2026, «Дом — мой»): тем четыре — тепло · океан ·
 * аврора · затмение. «Угли» стали Затмением (ключ хранения прежний — ember),
 * поэтому меняется только слово. В пульте слова строчные (text-transform).
 * Охраняется tools/themes-four-check.mjs. */
(function () {
  if (typeof window.sbAddStrings !== "function") return;
  window.sbAddStrings({
    en: { "mood.ember": "Eclipse", "mood.eclipse": "Eclipse" },
    ru: { "mood.ember": "Затмение", "mood.eclipse": "Затмение" },
    ee: { "mood.ember": "Varjutus", "mood.eclipse": "Varjutus" }
  });
})();
