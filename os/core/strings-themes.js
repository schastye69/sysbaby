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
 * D-1323 (основатель 18.11.2026): светлый режим — четыре темы эталона Светлицы, их имена — mood.light.* (Тайник →
 * Светлица, Затмение → Зенит, Океан → Берег, Аврора → Лазурь); Настройки и пульт берут их, когда тема светлая.
 * Охраняется tools/themes-four-check.mjs. */
(function () {
  if (typeof window.sbAddStrings !== "function") return;
  window.sbAddStrings({
    en: { "mood.ember": "Eclipse", "mood.eclipse": "Eclipse", "mood.studio": "Hideaway",
      "mood.light.studio": "Window", "mood.light.ember": "Zenith", "mood.light.eclipse": "Zenith", "mood.light.ocean": "Shore", "mood.light.aurora": "Azure" },
    ru: { "mood.ember": "Затмение", "mood.eclipse": "Затмение", "mood.studio": "Тайник",
      "mood.light.studio": "Окно", "mood.light.ember": "Зенит", "mood.light.eclipse": "Зенит", "mood.light.ocean": "Берег", "mood.light.aurora": "Лазурь" },
    ee: { "mood.ember": "Varjutus", "mood.eclipse": "Varjutus", "mood.studio": "Peidik",
      "mood.light.studio": "Aken", "mood.light.ember": "Seniit", "mood.light.eclipse": "Seniit", "mood.light.ocean": "Kallas", "mood.light.aurora": "Taevasina" }
  });
})();
