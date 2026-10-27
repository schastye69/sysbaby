// data/defaults.js — DEFAULT_WORLD (ARCH §4.1, §4.4, §4.7): the scalar sections of world.seed.js (values, order and
// spelling identical; comments dropped) — what every per-field default of the loader needs, always in the bundle.
// The seven lists (members, missions, achievements, legends, moments, jokes, transmissions) are only ever needed when
// world.js is missing or one of its lists is broken; build.mjs ships them as a/world-default.<hash>.js, a copy of
// world.seed.js that data/world.js fetches in that case before the boot (whenWorldReady). Keep in sync with the seed:
// $SCR/qa/wp0/world-check.mjs asserts JSON equality of these sections.
export const DEFAULT_WORLD = {
  "operator": {
    "id": "sam",
    "name": "Сэм",
    "aliases": [
      "сэм",
      "sam",
      "сэмми",
      "семён",
      "semyon"
    ],
    "callsign": "ВЕДУЩИЙ",
    "birthday": "2018-04-12",
    "heightM": 1.3,
    "papaHeightM": null
  },
  "clan": {
    "name": "SAM.VIN",
    "motto": "Ни один — не один.",
    "about": "Играем всерьёз. Тех, кто слабее, защищаем ещё серьёзнее — в игре и в жизни.",
    "founded": "2025-03-14",
    "frequency": 14.03,
    "sigil": [
      [
        3,
        21
      ],
      [
        21,
        45
      ],
      [
        45,
        27
      ],
      [
        27,
        3
      ],
      [
        21,
        27
      ],
      [
        3,
        45
      ]
    ],
    "code": [
      "Ждать — тоже сила.",
      "Дал слово — держи.",
      "Команда важнее меня.",
      "Новенький — уже свой.",
      "Всё по-честному.",
      "Слово сильнее кулака.",
      "Не проходим мимо."
    ]
  },
  "signal": {
    "secret": "Частота 14.03 — день, когда всё началось. Ты её нашёл. Об этом знают только свои."
  },
  "capsule": {
    "openAfterDays": 7,
    "text": "Если ты это читаешь — ты вернулся. Настоящий исследователь всегда возвращается. — Папа"
  },
  "zenith": {
    "message": "Отсюда видно всё, что вы построили. Это только начало."
  },
  "nadir": {
    "origin": "Всё началось 14 марта 2025 года. Сэм придумал название на перемене: SAM.VIN. Первый матч мы проиграли 0:12. Никто не ушёл. Потом мы поняли: команда нужна не только в игре. С тех пор ключ светится."
  },
  "night": {
    "from": 21,
    "to": 7,
    "drowsyFrom": 20,
    "story": "Ночью в VIN тихо. Узлы светятся вполсилы, как окна в доме, где все уже спят."
  },
  "companion": {
    "name": "Искра"
  }
};
