/* ОПИСЬ ПОЛА — ЕДИНСТВЕННЫЙ ИСТОЧНИК (D-239).
 *
 * ПОВОД, дословно от основателя 19.09.2026: «также прошу совет довести
 * структуру sys.baby до полноценной операционной системы».
 *
 * ПЕРВЫЙ ШАГ — НЕ ПЕРЕСТРОЙКА, А ОПИСЬ. Замер показал: вещи человека лежат
 * по островам. Каждый ключ пишет ровно одна комната, и ни одна комната не
 * читает вещи другой — ни разу. Мебель у системы общая: окна, док, замок,
 * хранилище, поиск. ПОЛА НЕТ.
 *
 * Прежде чем класть пол, надо знать, что на нём уже лежит. Это тот же
 * приём, которым сделана опись «Наружу» (D-221): один источник, который
 * читают ДВОЕ — окно системы и закон, — и который не может вырасти молча.
 *
 * ЧТО ЗДЕСЬ. Шестьдесят мест, где система что-либо хранит на диске этого
 * устройства. У каждого сказано: чьё оно, что там лежит человеческими
 * словами, какая комната его пишет и где это в коде.
 *
 * ТРИ РОДА, И РАЗНИЦА МЕЖДУ НИМИ НЕ КОСМЕТИЧЕСКАЯ:
 *   вещи      — то, что человек СДЕЛАЛ. Записи, письма, файлы, разговоры.
 *               Потерять это нельзя, и именно ради этого стоит замок.
 *   выбор     — то, что человек РЕШИЛ. Язык, яркость, где лежат значки.
 *               Потеря неприятна, но не смертельна.
 *   служебное — то, что система помнит О СЕБЕ. Видели ли загрузку, можно
 *               ли писать на диск. Человеку это не принадлежит.
 *
 * ИЗМЕРЕНО, А НЕ ОБЪЯВЛЕНО: при запирании замка 20.09.2026 спряталось
 * СЕМЬ ИЗ СЕМИ ключей, лежавших на диске. Под замком не остаётся открытым
 * ничего — ни вещей, ни выбора, ни служебного. Это проверяет закон
 * tools/floor-check.mjs живым запиранием, а не чтением этой строки.
 *
 * ЧЕГО ЭТА ОПИСЬ ПОКА НЕ ДАЁТ, И ЭТО СКАЗАНО ВСЛУХ. Она описывает пол, но
 * НЕ ДЕЛАЕТ его общим. Вещь, сделанная в одной комнате, по-прежнему
 * существует только для неё. Опись — первый из четырёх шагов; второй
 * («один способ передать»), третий («права комнат») и четвёртый («что
 * сейчас живо») ждут своей очереди и своего решения основателя.
 */
window.SB_FLOOR = {
  "_": [
    "ОПИСЬ ПОЛА. Единственный источник для окна системы и предмет закона",
    "tools/floor-check.mjs.",
    "",
    "kind: вещи — то, что человек сделал; выбор — то, что он решил;",
    "служебное — то, что система помнит о себе.",
    "",
    "id, кончающийся точкой, — ПРИСТАВКА: таких ключей на диске много, и",
    "имена им даются на ходу.",
    "",
    "rooms — комнаты, чей код называет этот ключ. «ядро» значит, что его",
    "держит сама система, а не приложение.",
    "",
    "Опись не может вырасти молча: закон обходит дерево и требует, чтобы",
    "каждое место, где система пишет на диск, было здесь названо."
  ],
  "places": [
    {
      "id": "sysbaby.__probe",
      "kind": "служебное",
      "what": "Один байт, которым система спрашивает у браузера, можно ли вообще писать на диск.",
      "rooms": ["ядро"],
      "where": "os/core/store.js:88"
    },
    {
      "id": "sysbaby.alarms.v1",
      "kind": "вещи",
      "what": "Ваши будильники: когда звонить и звонил ли уже.",
      "rooms": ["ядро"],
      "where": "os/core/alarm.js:33"
    },
    {
      "id": "sysbaby.authed",
      "kind": "служебное",
      "what": "Вошли ли вы в систему в этом браузере.",
      "rooms": ["settings", "ядро"],
      "where": "os/apps/settings/settings.js:14"
    },
    {
      "id": "sysbaby.backup.on",
      "kind": "выбор",
      "what": "Включена ли синхронизация копий.",
      "rooms": ["ядро"],
      "where": "os/core/sync.js:45"
    },
    {
      "id": "sysbaby.backup.state",
      "kind": "выбор",
      "what": "Когда копия писалась в последний раз и что случилось.",
      "rooms": ["ядро"],
      "where": "os/core/sync.js:46"
    },
    {
      "id": "sysbaby.boot.seen",
      "kind": "служебное",
      "what": "Видели ли вы загрузку хоть раз.",
      "rooms": ["ядро"],
      "where": "os/core/shell.js:4033"
    },
    {
      "id": "sysbaby.browser.history",
      "kind": "вещи",
      "what": "Адреса, которые вы открывали в Браузере.",
      "rooms": ["browser"],
      "where": "os/apps/browser/browser.js:34"
    },
    {
      "id": "sysbaby.browser.marks",
      "kind": "вещи",
      "what": "Закладки Браузера: адреса, которые вы отложили, чтобы вернуться.",
      "rooms": ["browser"],
      "where": "os/apps/browser/browser.js:35"
    },
    {
      "id": "sysbaby.browser.shut",
      "kind": "служебное",
      "what": "Чем кончилась последняя страница в Браузере.",
      "rooms": ["browser"],
      "where": "os/apps/browser/browser.js:36"
    },
    {
      "id": "sysbaby.build.closed",
      "kind": "служебное",
      "what": "Закрывали ли вы окно build.",
      "rooms": ["build"],
      "where": "os/apps/build/build.js:184"
    },
    {
      "id": "sysbaby.capture.recent",
      "kind": "вещи",
      "what": "Последнее снятое с экрана.",
      "rooms": ["ядро"],
      "where": "os/core/desktop.js:368"
    },
    {
      "id": "sysbaby.clipboard.history",
      "kind": "вещи",
      "what": "То, что вы копировали: последние куски текста.",
      "rooms": ["ядро"],
      "where": "os/core/panels.js:487"
    },
    {
      "id": "sysbaby.controlcenter.v1",
      "kind": "выбор",
      "what": "Переключатели центра управления, включая двери наружу.",
      "rooms": ["ядро"],
      "where": "os/core/shell.js:173"
    },
    {
      "id": "sysbaby.controls.side",
      "kind": "выбор",
      "what": "С какой стороны окна стоят огоньки.",
      "rooms": ["ядро"],
      "where": "os/core/shell.js:1124"
    },
    {
      "id": "sysbaby.demo.swept.v1",
      "kind": "служебное",
      "what": "Убраны ли образцы, положенные при первом запуске.",
      "rooms": ["ядро"],
      "where": "os/core/store.js:2320"
    },
    {
      "id": "sysbaby.desk.parts.hidden",
      "kind": "выбор",
      "what": "Какие части стола вы скрыли.",
      "rooms": ["ядро"],
      "where": "os/core/shell.js:3332"
    },
    {
      "id": "sysbaby.display.brightness",
      "kind": "выбор",
      "what": "Яркость, выставленная вами.",
      "rooms": ["ядро"],
      "where": "os/core/shell.js:1269"
    },
    {
      "id": "sysbaby.estimates",
      "kind": "вещи",
      "what": "Сметы, посчитанные в работах витрины.",
      "rooms": ["build"],
      "where": "os/apps/build/build.js:168"
    },
    {
      "id": "sysbaby.fab.pos",
      "kind": "выбор",
      "what": "Куда вы передвинули кнопку быстрых действий.",
      "rooms": ["ядро"],
      "where": "os/core/desktop.js:1906"
    },
    {
      "id": "sysbaby.files.v1",
      "kind": "вещи",
      "what": "Хранилище целиком: папки, файлы и выброшенное, которое ещё можно вернуть из «Эха».",
      "rooms": ["build", "files", "ядро"],
      "where": "os/apps/build/build.js:168"
    },
    {
      "id": "sysbaby.i18n.cache.",
      "kind": "служебное",
      "what": "ПРИСТАВКА. Запас переводов, чтобы язык не мигал при открытии.",
      "rooms": ["settings", "ядро"],
      "where": "os/apps/settings/settings.js:841"
    },
    {
      "id": "sysbaby.i18n.lang",
      "kind": "выбор",
      "what": "Язык, на котором с вами говорит рабочий стол: русский, английский или эстонский.",
      "rooms": ["project", "ядро"],
      "where": "os/apps/project/project.js:41"
    },
    {
      "id": "sysbaby.icons.hidden",
      "kind": "выбор",
      "what": "Какие значки вы убрали со стола.",
      "rooms": ["ядро"],
      "where": "os/core/shell.js:2680"
    },
    {
      "id": "sysbaby.icons.pos",
      "kind": "выбор",
      "what": "Куда вы переставили значки на столе (D-067).",
      "rooms": ["ядро"],
      "where": "os/core/shell.js:2752"
    },
    {
      "id": "sysbaby.incognito.pwhash",
      "kind": "служебное",
      "what": "Отпечаток пароля второй двери.",
      "rooms": ["settings", "ядро"],
      "where": "os/apps/settings/settings.js:833"
    },
    {
      "id": "sysbaby.keys.v1",
      "kind": "вещи",
      "what": "Места, для которых вы держите пароли. Сами пароли здесь не лежат: они выводятся из запертого хранилища заново.",
      "rooms": ["keys"],
      "where": "os/apps/keys/keys.js:31"
    },
    {
      "id": "sysbaby.layouts",
      "kind": "выбор",
      "what": "Расположение окон, которое вы запомнили.",
      "rooms": ["ядро"],
      "where": "os/core/panels.js:640"
    },
    {
      "id": "sysbaby.lock.v1",
      "kind": "служебное",
      "what": "Запись замка: соли и обёртка ключа. Пароля здесь нет и быть не может (D-215).",
      "rooms": ["ядро"],
      "where": "os/core/store.js:945"
    },
    {
      "id": "sysbaby.mail.studio-letter.v1",
      "kind": "вещи",
      "what": "Черновик письма в студию, если вы начали его и не отправили.",
      "rooms": ["mail"],
      "where": "os/apps/mail/mail.js:244"
    },
    {
      "id": "sysbaby.mail.v1",
      "kind": "вещи",
      "what": "Письма прежнего образца. Читается один раз при переносе и тут же убирается.",
      "rooms": ["mail"],
      "where": "os/apps/mail/mail.js:24"
    },
    {
      "id": "sysbaby.mail.v2",
      "kind": "вещи",
      "what": "Письма: входящие, черновики и отправленные, со словами и адресами.",
      "rooms": ["mail", "ядро"],
      "where": "os/apps/mail/mail.js:23"
    },
    {
      "id": "sysbaby.messenger.v1",
      "kind": "вещи",
      "what": "Разговоры самого первого образца. Тоже убираются.",
      "rooms": ["messenger"],
      "where": "os/apps/messenger/messenger.js:18"
    },
    {
      "id": "sysbaby.messenger.v2",
      "kind": "вещи",
      "what": "Разговоры прежнего образца. Убираются при каждом чтении (D-227).",
      "rooms": ["messenger"],
      "where": "os/apps/messenger/messenger.js:17"
    },
    {
      "id": "sysbaby.messenger.v3",
      "kind": "вещи",
      "what": "Разговоры Переписки. Удаление здесь окончательное — так задумано (D-224).",
      "rooms": ["messenger", "ядро"],
      "where": "os/apps/messenger/messenger.js:16"
    },
    {
      "id": "sysbaby.notes.v2",
      "kind": "вещи",
      "what": "Все ваши записи: текст, время, приколота ли, висит ли на столе.",
      "rooms": ["notes", "ядро"],
      "where": "os/apps/notes/notes.js:13"
    },
    {
      "id": "sysbaby.notifications",
      "kind": "вещи",
      "what": "Извещения, которые система вам показывала.",
      "rooms": ["ядро"],
      "where": "os/core/panels.js:303"
    },
    {
      "id": "sysbaby.profile.",
      "kind": "вещи",
      "what": "ПРИСТАВКА. Всё, что принадлежит одному профилю, когда их несколько.",
      "rooms": ["settings", "ядро"],
      "where": "os/apps/settings/settings.js:848"
    },
    {
      "id": "sysbaby.profiles.v1",
      "kind": "вещи",
      "what": "Список профилей на этом устройстве.",
      "rooms": ["settings", "ядро"],
      "where": "os/apps/settings/settings.js:830"
    },
    {
      "id": "sysbaby.promises",
      "kind": "вещи",
      "what": "Обещания — то, что вы себе назначили.",
      "rooms": ["build"],
      "where": "os/apps/build/build.js:168"
    },
    {
      "id": "sysbaby.seen.systems",
      "kind": "выбор",
      "what": "Какие работы витрины вы уже смотрели.",
      "rooms": ["project"],
      "where": "os/apps/project/project.js:18"
    },
    {
      "id": "sysbaby.session.active",
      "kind": "служебное",
      "what": "Идёт ли сейчас сеанс. По этой записи система понимает, запирать ли себя при возвращении.",
      "rooms": ["ядро"],
      "where": "os/core/shell.js:4396"
    },
    {
      "id": "sysbaby.sessiontimer.pref",
      "kind": "выбор",
      "what": "Через сколько запирать систему без вас.",
      "rooms": ["ядро"],
      "where": "os/core/topbar.js:2627"
    },
    {
      "id": "sysbaby.sound.volume",
      "kind": "выбор",
      "what": "Громкость звуков системы, выставленная вами.",
      "rooms": ["ядро"],
      "where": "os/core/shell.js:1268"
    },
    {
      "id": "sysbaby.space",
      "kind": "выбор",
      "what": "Какое пространство стола выбрано.",
      "rooms": ["ядро"],
      "where": "os/core/panels.js:773"
    },
    {
      "id": "sysbaby.sync.url",
      "kind": "выбор",
      "what": "Куда складывать резервные копии.",
      "rooms": ["settings", "ядро"],
      "where": "os/apps/settings/settings.js:832"
    },
    {
      "id": "sysbaby.templates",
      "kind": "вещи",
      "what": "Ваши заготовки: тексты и формы, которые вы сохранили, чтобы не писать заново.",
      "rooms": ["build"],
      "where": "os/apps/build/build.js:168"
    },
    {
      "id": "sysbaby.theme.accent",
      "kind": "выбор",
      "what": "Цвет шва, если вы выбрали его сами.",
      "rooms": ["ядро"],
      "where": "os/core/shell.js:175"
    },
    {
      "id": "sysbaby.theme.mode",
      "kind": "выбор",
      "what": "Тёмная комната или светлая.",
      "rooms": ["ядро"],
      "where": "os/core/shell.js:174"
    },
    {
      "id": "sysbaby.tips.seen",
      "kind": "выбор",
      "what": "Какие подсказки вам уже показывали.",
      "rooms": ["ядро"],
      "where": "os/core/topbar.js:2192"
    },
    {
      "id": "sysbaby.traces.seeded",
      "kind": "служебное",
      "what": "Положены ли в «Эхо» первые следы для примера.",
      "rooms": ["echoes"],
      "where": "os/apps/echoes/echoes.js:26"
    },
    {
      "id": "sysbaby.turbo",
      "kind": "выбор",
      "what": "Режим, в котором система бережёт заряд.",
      "rooms": ["ядро"],
      "where": "os/core/shell.js:251"
    },
    {
      "id": "sysbaby.user.name",
      "kind": "выбор",
      "what": "То же имя прежнего образца.",
      "rooms": ["ядро"],
      "where": "os/core/shell.js:3650"
    },
    {
      "id": "sysbaby.username",
      "kind": "выбор",
      "what": "Имя, которым к вам обращается система.",
      "rooms": ["ядро"],
      "where": "os/core/topbar.js:1646"
    },
    {
      "id": "sysbaby.v.",
      "kind": "вещи",
      "what": "ПРИСТАВКА. Запечатанные конверты хранилища и обманки к ним. Имена выведены из ключа, содержимое — шифр. Их число постоянно и не говорит, много внутри или пусто (D-212).",
      "rooms": ["vault", "ядро"],
      "where": "os/apps/vault/vault.js:31"
    },
    {
      "id": "sysbaby.wallpaper.mood",
      "kind": "выбор",
      "what": "Какой свет стоит на столе.",
      "rooms": ["ядро"],
      "where": "os/core/shell.js:176"
    },
    {
      "id": "sysbaby.widget.hidden",
      "kind": "выбор",
      "what": "Какие предметы стола вы спрятали.",
      "rooms": ["ядро"],
      "where": "os/core/desktop.js:29"
    },
    {
      "id": "sysbaby.widget.layout",
      "kind": "выбор",
      "what": "Как разложены предметы на столе.",
      "rooms": ["ядро"],
      "where": "os/core/desktop.js:28"
    },
    {
      "id": "sysbaby.widget.layouts.saved",
      "kind": "выбор",
      "what": "Сохранённые вами раскладки стола.",
      "rooms": ["ядро"],
      "where": "os/core/desktop.js:30"
    },
    {
      "id": "sysbaby.widget.notes",
      "kind": "выбор",
      "what": "Какая запись висит на столе.",
      "rooms": ["notes", "ядро"],
      "where": "os/apps/notes/notes.js:14"
    },
    {
      "id": "sysbaby.windows.recent",
      "kind": "выбор",
      "what": "Какие окна были открыты последними.",
      "rooms": ["ядро"],
      "where": "os/core/panels.js:433"
    }
  ]
};
