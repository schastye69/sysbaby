/* sys.baby OS — core/strings-themes.js
 * Заготовка П0 (v178-H4a, D-800). Владелец — П4: слова тем через window.sbAddStrings.
 * Подключён в index.html и попадает в опись офлайна.
 *
 * D-870 (основатель 10–11.11.2026, «Дом — мой»): тем четыре — тепло · океан ·
 * аврора · затмение. «Угли» стали Затмением (ключ хранения прежний — ember),
 * поэтому меняется только слово. В пульте слова строчные (text-transform).
 * D-1229 (основатель 13.11.2026, «это гениально, это победа»): Тепло стало полем витрины «Магия» — и,
 * возможно, получит новое имя. Имя темы — ЗДЕСЬ, одной строкой на язык (ключ хранения прежний — studio):
 * пока «Тайник» — заглушка до выбора основателя.
 * Охраняется tools/themes-four-check.mjs. */
(function () {
  if (typeof window.sbAddStrings !== "function") return;
  window.sbAddStrings({
    en: { "mood.ember": "Eclipse", "mood.eclipse": "Eclipse", "mood.studio": "Hideaway" },
    ru: { "mood.ember": "Затмение", "mood.eclipse": "Затмение", "mood.studio": "Тайник" },
    ee: { "mood.ember": "Varjutus", "mood.eclipse": "Varjutus", "mood.studio": "Peidik" }
  });
})();
