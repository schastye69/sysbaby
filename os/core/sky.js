/* sys.baby OS — core/sky.js
 * СОЛНЦЕ И ЛУНА · решение D-893 (основатель, после демо инструментов 12.11.2026:
 * «просто идеально»; новый инструмент середины стола). Восход и закат для
 * выбранного города, долгота дня и её изменение за сутки, фаза луны словом
 * и светом. ВСЁ НА УСТРОЙСТВЕ: координаты городов — встроенным справочником
 * ниже, расчёт — астрономией (формулы восхода по юлианским дням, как в
 * астрономических ежегодниках: средняя аномалия Солнца, эклиптическая
 * долгота, склонение, часовой угол на высоте −0,833° с рефракцией и
 * полудиском), фаза луны — от опорного новолуния 6.01.2000 18:14 UTC
 * по синодическому месяцу 29,530588853 суток. Сети нет ни в одной строке.
 *
 * Справочник городов — общий для «второго города» и «солнца и луны»
 * (core/desktools.js): пояс времени, имена ru/en/ee, широта, долгота.
 * Охраняется tools/sky-calc-check.mjs (без браузера) и tools/desktools-sky-check.mjs. */
(function () {
  "use strict";
  var CITIES = [
    ["Europe/Tallinn", "Таллин", "Tallinn", "Tallinn", 59.437, 24.754], ["Europe/Helsinki", "Хельсинки", "Helsinki", "Helsingi", 60.170, 24.938], ["Europe/Riga", "Рига", "Riga", "Riia", 56.949, 24.105],
    ["Europe/Vilnius", "Вильнюс", "Vilnius", "Vilnius", 54.687, 25.280], ["Europe/Stockholm", "Стокгольм", "Stockholm", "Stockholm", 59.329, 18.069], ["Europe/Oslo", "Осло", "Oslo", "Oslo", 59.914, 10.752],
    ["Europe/Oslo", "Тромсё", "Tromsø", "Tromsø", 69.649, 18.956], ["Atlantic/Reykjavik", "Рейкьявик", "Reykjavik", "Reykjavík", 64.147, -21.942],
    ["Europe/Copenhagen", "Копенгаген", "Copenhagen", "Kopenhaagen", 55.676, 12.568], ["Europe/Berlin", "Берлин", "Berlin", "Berliin", 52.520, 13.405], ["Europe/Warsaw", "Варшава", "Warsaw", "Varssavi", 52.230, 21.012],
    ["Europe/Prague", "Прага", "Prague", "Praha", 50.076, 14.438], ["Europe/Vienna", "Вена", "Vienna", "Viin", 48.208, 16.374], ["Europe/Paris", "Париж", "Paris", "Pariis", 48.857, 2.352],
    ["Europe/London", "Лондон", "London", "London", 51.507, -0.128], ["Europe/Dublin", "Дублин", "Dublin", "Dublin", 53.350, -6.260], ["Europe/Madrid", "Мадрид", "Madrid", "Madrid", 40.417, -3.704],
    ["Europe/Lisbon", "Лиссабон", "Lisbon", "Lissabon", 38.722, -9.139], ["Europe/Rome", "Рим", "Rome", "Rooma", 41.903, 12.496], ["Europe/Athens", "Афины", "Athens", "Ateena", 37.984, 23.728],
    ["Europe/Istanbul", "Стамбул", "Istanbul", "Istanbul", 41.008, 28.978], ["Europe/Kyiv", "Киев", "Kyiv", "Kiiev", 50.450, 30.523], ["Europe/Minsk", "Минск", "Minsk", "Minsk", 53.900, 27.567],
    ["Europe/Moscow", "Москва", "Moscow", "Moskva", 55.756, 37.617], ["Europe/Samara", "Самара", "Samara", "Samara", 53.195, 50.101], ["Asia/Yekaterinburg", "Екатеринбург", "Yekaterinburg", "Jekaterinburg", 56.838, 60.597],
    ["Asia/Novosibirsk", "Новосибирск", "Novosibirsk", "Novosibirsk", 55.008, 82.935], ["Asia/Vladivostok", "Владивосток", "Vladivostok", "Vladivostok", 43.116, 131.882], ["Asia/Tbilisi", "Тбилиси", "Tbilisi", "Thbilisi", 41.716, 44.783],
    ["Asia/Yerevan", "Ереван", "Yerevan", "Jerevan", 40.179, 44.499], ["Asia/Baku", "Баку", "Baku", "Bakuu", 40.409, 49.867], ["Asia/Almaty", "Алматы", "Almaty", "Almatõ", 43.238, 76.946],
    ["Asia/Tashkent", "Ташкент", "Tashkent", "Taškent", 41.299, 69.240], ["Asia/Dubai", "Дубай", "Dubai", "Dubai", 25.205, 55.271], ["Asia/Jerusalem", "Иерусалим", "Jerusalem", "Jeruusalemm", 31.769, 35.216],
    ["Asia/Kolkata", "Дели", "Delhi", "Delhi", 28.614, 77.209], ["Asia/Bangkok", "Бангкок", "Bangkok", "Bangkok", 13.756, 100.502], ["Asia/Singapore", "Сингапур", "Singapore", "Singapur", 1.352, 103.820],
    ["Asia/Shanghai", "Пекин", "Beijing", "Peking", 39.904, 116.407], ["Asia/Hong_Kong", "Гонконг", "Hong Kong", "Hongkong", 22.320, 114.169], ["Asia/Seoul", "Сеул", "Seoul", "Soul", 37.567, 126.978],
    ["Asia/Tokyo", "Токио", "Tokyo", "Tokyo", 35.676, 139.650], ["Australia/Sydney", "Сидней", "Sydney", "Sydney", -33.869, 151.209], ["Pacific/Auckland", "Окленд", "Auckland", "Auckland", -36.848, 174.763],
    ["America/New_York", "Нью-Йорк", "New York", "New York", 40.713, -74.006], ["America/Toronto", "Торонто", "Toronto", "Toronto", 43.653, -79.383], ["America/Chicago", "Чикаго", "Chicago", "Chicago", 41.878, -87.630],
    ["America/Denver", "Денвер", "Denver", "Denver", 39.739, -104.990], ["America/Los_Angeles", "Лос-Анджелес", "Los Angeles", "Los Angeles", 34.052, -118.244], ["America/Mexico_City", "Мехико", "Mexico City", "México", 19.433, -99.133],
    ["America/Sao_Paulo", "Сан-Паулу", "São Paulo", "São Paulo", -23.551, -46.633], ["America/Buenos_Aires", "Буэнос-Айрес", "Buenos Aires", "Buenos Aires", -34.604, -58.382], ["Africa/Cairo", "Каир", "Cairo", "Kairo", 30.044, 31.236]
  ];

  var PI = Math.PI, rad = PI / 180, DAY = 86400000, J1970 = 2440588, J2000 = 2451545, OBL = rad * 23.4397, J0 = 0.0009;
  function toDays(ms) { return ms / DAY - 0.5 + J1970 - J2000; }
  function fromJulian(j) { return (j + 0.5 - J1970) * DAY; }
  function meanAnomaly(d) { return rad * (357.5291 + 0.98560028 * d); }
  function eclLong(M) { return M + rad * (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)) + rad * 102.9372 + PI; }
  function decl(L) { return Math.asin(Math.sin(OBL) * Math.sin(L)); }

  /* sun(ms, lat, lon) → { rise, set, noon, len } в мс UTC; полярный день/ночь — { polar: "day" | "night", len } */
  function sun(ms, lat, lon) {
    var lw = rad * -lon, phi = rad * lat, d = toDays(ms);
    var n = Math.round(d - J0 - lw / (2 * PI)), ds = J0 + lw / (2 * PI) + n;
    var M = meanAnomaly(ds), L = eclLong(M), dec = decl(L);
    var Jnoon = J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
    var c = (Math.sin(rad * -0.833) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec));
    if (c < -1) return { polar: "day", noon: fromJulian(Jnoon), len: DAY };
    if (c > 1) return { polar: "night", noon: fromJulian(Jnoon), len: 0 };
    var w = Math.acos(c), a = J0 + (w + lw) / (2 * PI) + n;
    var Jset = J2000 + a + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L), Jrise = Jnoon - (Jset - Jnoon);
    return { rise: fromJulian(Jrise), set: fromJulian(Jset), noon: fromJulian(Jnoon), len: (Jset - Jrise) * DAY };
  }

  /* луна: возраст в сутках, освещённая доля, одно из восьми имён фазы */
  var SYN = 29.530588853, NEW0 = Date.UTC(2000, 0, 6, 18, 14);
  var PHASES = ["new", "waxCrescent", "firstQuarter", "waxGibbous", "full", "wanGibbous", "lastQuarter", "wanCrescent"];
  function moon(ms) {
    var age = (((ms - NEW0) / DAY) % SYN + SYN) % SYN, f = age / SYN;
    return { age: age, frac: f, lit: (1 - Math.cos(2 * PI * f)) / 2, waxing: f < 0.5, phase: PHASES[Math.floor((f * 8) + 0.5) % 8] };
  }

  /* полдень этого дня в городе (для расчёта дня «там», а не «здесь») */
  function cityNoon(tz, ms) {
    var p = {};
    try { new Intl.DateTimeFormat("en-US", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(new Date(ms)).forEach(function (x) { p[x.type] = x.value; }); }
    catch (e) { var d = new Date(ms); p = { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() }; }
    return Date.UTC(+p.year, +p.month - 1, +p.day, 12);
  }
  function find(tz, name) {
    for (var i = 0; i < CITIES.length; i++) if (CITIES[i][0] === tz && (!name || [CITIES[i][1], CITIES[i][2], CITIES[i][3]].indexOf(name) !== -1)) return CITIES[i];
    for (i = 0; i < CITIES.length; i++) if (CITIES[i][0] === tz) return CITIES[i];
    return null;
  }
  /* day(city, ms) — всё, что показывает инструмент: сегодня, вчера, луна */
  function day(row, ms) {
    var noon = cityNoon(row[0], ms), today = sun(noon, row[4], row[5]), yest = sun(noon - DAY, row[4], row[5]);
    return { today: today, delta: today.len - yest.len, moon: moon(ms) };
  }

  window.sbCities = CITIES;
  window.sbSky = { sun: sun, moon: moon, day: day, find: find, cityNoon: cityNoon, phases: PHASES };
})();
