/*
 * portfolio.strings.js — тексты портфолио, общие для системы и витрины.
 *
 * ПОЧЕМУ ОТДЕЛЬНЫМ ФАЙЛОМ. Портфолио переезжает из ОС в приложение build
 * (решение D-054: система принадлежит пришедшему, а о нас говорит одно окно).
 * Переносить надо не текст, а точку вызова — но тексты жили в словаре
 * оболочки, которого витрина не видит, и общий рендерер показал бы ей ключи
 * вместо слов. Это первый из трёх шагов переезда: сначала слова, потом
 * рендерер, и только потом снятие приложения с рабочего стола.
 *
 * Файл читают ОБЕ поверхности. Правится он здесь и только здесь.
 */
(function () {
  "use strict";
  window.sbPortfolioStrings = {
    en: {
      "pf.intro": "The workspace behind our real client work — and itself an example of it. This desktop, its applications and its storage are our own build, running in your browser with no install and no account. Below is the work itself — and one of the systems is running right here: open it and use it.",
      "pf.live": "live",
      "pf.badge.conf": "Confidential · Anonymous",
      "pf.badge.public": "Public",
      "pf.sub.delivered": "Delivered",
      "pf.sub.goal": "Goal",
      "pf.sub.results": "Results",
      "pf.results.firstHand": "First-hand: we worked in this trade before building the system.",
      "pf.results.clientReported": "Reported by the client.",
      "pf.results.sourceUnknown": "Source not recorded — ask us where this figure came from.",
      "pf.results.withheld": "Withheld at the client’s request — the same discretion covers your project.",
      "pf.results.notDelivered": "Built and not yet handed over. We agree the measurement at handover and publish the figure the client gives us, whatever it says.",
      "pf.results.pending": "Outcome measurement is agreed with the client and scheduled. We publish the figure they give us, whatever it says.",
      "pf.results.ownBuild": "Our own build for a private dental practice — we deliberately stopped short of rollout. It turned out that people with thirty years of writing by hand fill a card faster than they type, and one fast young person does not compensate for that: transcribing another shift's handwritten notes doubles the work instead of removing it. We paid for that finding ourselves, and it is now the first question we ask every client: who exactly will be entering the data. We show the system on request; there is no public demo.",
      "pf.name.ownBuild": "Our own build",
      "pf.name.ownBuildTitle": "Built by the studio itself — there is no outside client to name",
      "pf.open": "Open and use this system →",
      "pf.onPremises": "Running at the client’s premises, not as a hosted demonstration.",
      "pf.explore": "Explore",
      "pf.brief": "Project brief",
      "pf.everything": "Everything about this client",
      "pf.name.withheld": "Communication · Confidential",
      "pf.name.withheldTitle": "Client identity withheld at their request",
      "pf.name.pending": "Name · Pending permission",
      "pf.name.pendingTitle": "Permission to name this client has not been requested yet",
      "pf.empty": "Real completed client work will appear here.",
      "pf.replay": "Replay a working day in this desktop",
      "pf.replaySub": "A demonstration, not a recording — two minutes",
      "pf.cta": "Want a system like this built for your business?",
      "pf.ctaLink": "Start your project →",
      "pf.tech.offline-first": "Offline-first",
      "pf.tech.zero-dependencies": "Zero dependencies",
      "pf.tech.print-native-a4": "Print-native A4",
      "pf.tech.et-ru-bilingual": "ET / RU bilingual",
      "pf.tech.responsive-web": "Responsive web",
      "pf.tech.runs-entirely-in-the-browser": "Runs entirely in the browser",
      "pf.tech.no-server-no-account": "No server, no account",
      "pf.tech.print-native-pdf": "Print-native PDF",
      "pf.tech.sepa-payment-qr": "SEPA payment QR",
      "pf.tech.e-signature": "E-signature",
    },
    ru: {
      "pf.intro": "Рабочее место, за которым делается наша клиентская работа, — и само по себе её пример. Этот рабочий стол, его приложения и его хранилище собраны нами и работают в вашем браузере без установки и без аккаунта. Ниже — сама работа, и одна из систем запущена прямо здесь: откройте и пользуйтесь.",
      "pf.live": "вживую",
      "pf.badge.conf": "Конфиденциально · анонимно",
      "pf.badge.public": "Открыто",
      "pf.sub.delivered": "Сделано",
      "pf.sub.goal": "Задача",
      "pf.sub.results": "Результат",
      "pf.results.firstHand": "Из первых рук: мы работали в этом деле до того, как построили систему.",
      "pf.results.clientReported": "По словам клиента.",
      "pf.results.sourceUnknown": "Источник не записан — спросите нас, откуда эта цифра.",
      "pf.results.withheld": "Не раскрывается по просьбе клиента — та же сдержанность распространяется и на ваш проект.",
      "pf.results.notDelivered": "Построено и ещё не передано. Измерение согласуем при передаче и опубликуем ту цифру, которую даст клиент, какой бы она ни была.",
      "pf.results.pending": "Измерение результата согласовано с клиентом и назначено. Опубликуем ту цифру, которую он даст, какой бы она ни была.",
      "pf.results.ownBuild": "Собственная разработка для частной стоматологической клиники — до внедрения мы её сознательно не довели. Выяснилось, что люди с тридцатилетним стажем письма заполняют карту от руки быстрее, чем печатают, и одним быстрым молодым человеком это не компенсируется: переносить рукописи за другую смену значит удваивать работу, а не убирать её. Вывод мы оплатили сами, и теперь он входит в первый вопрос каждому клиенту: кто конкретно будет вводить данные. Систему показываем по запросу, публичной демонстрации нет.",
      "pf.name.ownBuild": "Собственная разработка",
      "pf.name.ownBuildTitle": "Построено самой студией — стороннего заказчика, которого можно назвать, нет",
      "pf.open": "Открыть и попробовать эту систему →",
      "pf.onPremises": "Работает у клиента, а не как публичная демонстрация.",
      "pf.explore": "Посмотреть",
      "pf.brief": "Описание проекта",
      "pf.everything": "Всё об этом клиенте",
      "pf.name.withheld": "Связь · конфиденциально",
      "pf.name.withheldTitle": "Имя клиента не раскрывается по его просьбе",
      "pf.name.pending": "Имя · ждём разрешения",
      "pf.name.pendingTitle": "Разрешение назвать этого клиента ещё не запрашивалось",
      "pf.empty": "Здесь появится настоящая завершённая клиентская работа.",
      "pf.replay": "Проиграть рабочий день на этом столе",
      "pf.replaySub": "Демонстрация, а не запись — две минуты",
      "pf.cta": "Хотите такую же систему для своего дела?",
      "pf.ctaLink": "Начать проект →",
      "pf.tech.offline-first": "Работает офлайн",
      "pf.tech.zero-dependencies": "Без сторонних библиотек",
      "pf.tech.print-native-a4": "Печать A4 без доработок",
      "pf.tech.et-ru-bilingual": "ET / RU — два языка",
      "pf.tech.responsive-web": "Адаптивный веб",
      "pf.tech.runs-entirely-in-the-browser": "Целиком в браузере",
      "pf.tech.no-server-no-account": "Без сервера и без аккаунта",
      "pf.tech.print-native-pdf": "Печать в PDF без доработок",
      "pf.tech.sepa-payment-qr": "QR для оплаты SEPA",
      "pf.tech.e-signature": "Электронная подпись",
    },
    ee: {
      "pf.intro": "Tööruum, mille taga sünnib meie päris kliienditöö — ja ühtlasi selle näide. See töölaud, selle rakendused ja salvestus on meie enda ehitatud ning töötavad teie brauseris ilma paigalduse ja kontota. Allpool on töö ise — ja üks süsteemidest töötab siinsamas: avage ja kasutage.",
      "pf.live": "elav",
      "pf.badge.conf": "Konfidentsiaalne · anonüümne",
      "pf.badge.public": "Avalik",
      "pf.sub.delivered": "Tehtud",
      "pf.sub.goal": "Eesmärk",
      "pf.sub.results": "Tulemus",
      "pf.results.firstHand": "Esimesest käest: töötasime selles valdkonnas enne, kui süsteemi ehitasime.",
      "pf.results.clientReported": "Kliendi öeldu põhjal.",
      "pf.results.sourceUnknown": "Allikat pole kirja pandud — küsige meilt, kust see arv tuli.",
      "pf.results.withheld": "Kliendi soovil avaldamata — sama hoolikus katab ka teie projekti.",
      "pf.results.notDelivered": "Ehitatud ja veel üle andmata. Mõõtmise lepime kokku üleandmisel ja avaldame selle arvu, mille klient annab, olgu see milline tahes.",
      "pf.results.pending": "Tulemuse mõõtmine on kliendiga kokku lepitud ja plaanis. Avaldame arvu, mille tema annab, olgu see milline tahes.",
      "pf.results.ownBuild": "Meie enda ehitatud lahendus erahambaravipraksisele — jätsime selle teadlikult kasutuselevõtuni viimata. Selgus, et inimesed, kes on kolmkümmend aastat käsitsi kirjutanud, täidavad kaardi käsitsi kiiremini kui klaviatuuril, ja üks kiire noor inimene seda ei korva: teise vahetuse käsikirjade ümbertrükkimine kahekordistab töö, mitte ei kaota seda. Selle järelduse eest maksime ise, ja nüüd on see esimene küsimus igale kliendile: kes täpselt hakkab andmeid sisestama. Süsteemi näitame soovi korral, avalikku demot ei ole.",
      "pf.name.ownBuild": "Meie enda ehitatud",
      "pf.name.ownBuildTitle": "Ehitatud stuudio enda poolt — välist tellijat, keda nimetada, ei ole",
      "pf.open": "Ava ja kasuta seda süsteemi →",
      "pf.onPremises": "Töötab kliendi juures, mitte majutatud demonstratsioonina.",
      "pf.explore": "Vaadake lähemalt",
      "pf.brief": "Projekti kirjeldus",
      "pf.everything": "Kõik selle kliendi kohta",
      "pf.name.withheld": "Suhtlus · konfidentsiaalne",
      "pf.name.withheldTitle": "Kliendi nimi jääb tema soovil avaldamata",
      "pf.name.pending": "Nimi · luba ootel",
      "pf.name.pendingTitle": "Luba seda klienti nimetada pole veel küsitud",
      "pf.empty": "Siia ilmub päris lõpetatud klienditöö.",
      "pf.replay": "Mängi see tööpäev töölaual uuesti läbi",
      "pf.replaySub": "Demonstratsioon, mitte salvestus — kaks minutit",
      "pf.cta": "Kas soovite sellist süsteemi oma ettevõttele?",
      "pf.ctaLink": "Alusta oma projekti →",
      "pf.tech.offline-first": "Töötab võrguühenduseta",
      "pf.tech.zero-dependencies": "Ilma väliste teekideta",
      "pf.tech.print-native-a4": "A4 trükk ilma kohendamata",
      "pf.tech.et-ru-bilingual": "ET / RU — kaks keelt",
      "pf.tech.responsive-web": "Kohanduv veeb",
      "pf.tech.runs-entirely-in-the-browser": "Täielikult brauseris",
      "pf.tech.no-server-no-account": "Serverita ja kontota",
      "pf.tech.print-native-pdf": "PDF-trükk ilma kohendamata",
      "pf.tech.sepa-payment-qr": "SEPA makse QR",
      "pf.tech.e-signature": "Digiallkiri",
    },
  };
  /* Общий поиск строки: сначала словарь оболочки, если он есть, потом свой.
     Порядок важен: в системе перевод может быть уточнён, и уточнение должно
     побеждать. Неизвестный ключ возвращается собой — он громкий и потому
     чинится, а не растворяется пустой строкой. */
  window.sbPortfolioText = function (key, lang) {
    if (typeof window.sbT === "function") {
      var viaShell = window.sbT(key);
      if (viaShell && viaShell !== key) return viaShell;
    }
    var L = window.sbPortfolioStrings[lang] || window.sbPortfolioStrings.en;
    return (L && L[key]) || window.sbPortfolioStrings.en[key] || key;
  };
}());
