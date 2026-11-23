/* =============================================================================
   LANTERN — то, что берут в руки, когда гаснет свет.  ·  решение D-185

   ПОВОД, дословно от основателя 27.08.2026: «нужно подумать какую ценную
   информацию (не считая использование самой системы) мы можем предоставлять
   пользователю для того, чтобы мы усилили концепт — интернета нет, но мы
   есть». И следом, на предложение Совета: «одно слово — начинайте. Именно про
   вещи касающиеся выживания я и думал».

   ЧТО ЭТО. Свод того, что нужно знать ИМЕННО ТОГДА, КОГДА СЕТИ НЕТ. Не
   развлечение и не справка «на всякий случай»: сеть пропадает в лифте, в
   метро, в лесу, в подвале и в тот час, когда по всему району вырубило свет.
   Ровно в этот час человек не может ничего найти — и ровно в этот час ему
   может понадобиться то, что здесь написано.

   ПОЧЕМУ ЭТО УСИЛИВАЕТ КОНЦЕПТ СИЛЬНЕЕ ЛЮБОГО ЛОЗУНГА. «Интернета нет, но мы
   есть» доказывается не словами о себе, а тем, ЧТО СИСТЕМА ДАЁТ в этот миг.
   Всё, что здесь лежит, лежит на устройстве: ни одного обращения наружу, ни
   одной картинки со стороны. Это работает в самолёте, в бомбоубежище и на
   последних процентах батареи.

   ЧЕГО ЗДЕСЬ НЕТ, И ЭТО СКАЗАНО ПЕРВОЙ СТРОКОЙ:
     · это СПРАВКА, а не медицина, и она не заменяет 112;
     · здесь нет ни одной дозировки лекарства — ни одной, ни при каких
       обстоятельствах;
     · у каждой карточки стоит источник и дата, когда Совет его сверял.
       Знание стареет; карточка без даты — это карточка, о возрасте которой
       все молчат.

   ЦИФРЫ. Ни одной цифры мимо источника — тот же закон, что и на витрине
   (facts-source-check). Где Совет не сверил число со страницей источника,
   числа в карточке НЕТ ВОВСЕ, а сказано действие. Лучше без числа, чем с
   правдоподобным.

   Охраняется tools/lantern-check.mjs.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;

  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M9 2h6M10 2v2.4M14 2v2.4"/>' +
    '<path d="M7.2 4.4h9.6l-1 3.2H8.2z"/>' +
    '<path d="M8.2 7.6h7.6v10a2 2 0 0 1-2 2h-3.6a2 2 0 0 1-2-2z"/>' +
    '<path d="M12 10.6v6"/></svg>';

  function esc(s) {
    return (window.escapeHtml || function (v) { return String(v == null ? "" : v); })(s);
  }
  function lang() {
    var l = window.sbLang ? window.sbLang() : "en";
    return (l === "ru" || l === "ee" || l === "et") ? (l === "et" ? "ee" : l) : "en";
  }

  /* ── ИСТОЧНИКИ. Один список на весь свод: карточка ссылается на имя, и
     подмена источника в одном месте меняет его везде. Дата — день, когда
     Совет читал ЭТУ страницу, а не день, когда её написали. ─────────────── */
  var SOURCES = {
    erc: {
      name: "Resuscitation Council UK · ERC Guidelines 2025",
      url: "https://www.resus.org.uk/professional-library/2025-resuscitation-guidelines/adult-basic-life-support-guidelines",
      checked: "2026-08-27"
    },
    burn: {
      name: "Annals of Emergency Medicine, 2025",
      url: "https://www.annemergmed.com/article/S0196-0644(25)01138-2/fulltext",
      checked: "2026-08-27"
    },
    eu112: {
      name: "Your Europe · European Commission",
      url: "https://europa.eu/youreurope/citizens/travel/security-and-emergencies/emergency/index_en.htm",
      checked: "2026-08-27"
    },
    valmis: {
      name: "Ole valmis! · Päästeamet",
      url: "https://www.olevalmis.ee/kodused-varud/",
      checked: "2026-08-27"
    },
    common: {
      name: "Mayo Clinic · First aid",
      url: "https://www.mayoclinic.org/first-aid",
      checked: "2026-08-27"
    },
    /* Сверено Советом 27.09.2026 — день, когда читалась КАЖДАЯ из этих страниц. */
    fireEE: { name: "Kodu tuleohutuks · Päästeamet", url: "https://kodutuleohutuks.ee/kaitumine-tulekahju-korral/", checked: "2026-09-27" },
    gasEE: { name: "Ole valmis! · Gaasivarustuse katkemine", url: "https://www.olevalmis.ee/gaasivarustuse-katkemine-ja-plahvatusoht", checked: "2026-09-27" },
    shelterEE: { name: "Ole valmis! · Varjumine", url: "https://www.olevalmis.ee/varjumine", checked: "2026-09-27" },
    evacEE: { name: "Ole valmis! · Ulatuslik evakuatsioon", url: "https://www.olevalmis.ee/ulatuslik-evakuatsioon", checked: "2026-09-27" },
    waterEE: { name: "Ole valmis! · Veekatkestus", url: "https://www.olevalmis.ee/veekatkestus", checked: "2026-09-27" },
    stormEE: { name: "Ole valmis! · Torm, äike ja sademed", url: "https://www.olevalmis.ee/torm-tugev-tuul-aike-ja-sademed", checked: "2026-09-27" },
    floodEE: { name: "Ole valmis! · Üleujutus", url: "https://www.olevalmis.ee/uleujutus", checked: "2026-09-27" },
    lostEE: { name: "Naiskodukaitse · Käitumine metsas eksimise korral", url: "https://www.naiskodukaitse.ee/Kaitumine_metsas_eksimise_korral_335", checked: "2026-09-27" },
    iceEE: { name: "Veeohutus · Päästeamet · Jääaugust päästmine", url: "https://veeohutus.ee/talv/teise-paastmine-jaaaugust/", checked: "2026-09-27" },
    poisonEE: { name: "Mürgistusteabekeskus 16662 · Mayo Clinic · Poisoning", url: "https://www.16662.ee/", checked: "2026-09-27" },
    mayoFract: { name: "Mayo Clinic · Fractures", url: "https://www.mayoclinic.org/first-aid/first-aid-fractures/basics/art-20056641", checked: "2026-09-27" },
    mayoHeat: { name: "Mayo Clinic · Heatstroke", url: "https://www.mayoclinic.org/first-aid/first-aid-heatstroke/basics/art-20056655", checked: "2026-09-27" },
    mayoNose: { name: "Mayo Clinic · Nosebleeds", url: "https://www.mayoclinic.org/first-aid/first-aid-nosebleeds/basics/art-20056683", checked: "2026-09-27" },
    mayoElec: { name: "Mayo Clinic · Electrical shock", url: "https://www.mayoclinic.org/first-aid/first-aid-electrical-shock/basics/art-20056695", checked: "2026-09-27" },
    mayoBite: { name: "Mayo Clinic · Animal bites", url: "https://www.mayoclinic.org/first-aid/first-aid-animal-bites/basics/art-20056591", checked: "2026-09-27" },
    mayoFaint: { name: "Mayo Clinic · Fainting", url: "https://www.mayoclinic.org/first-aid/first-aid-fainting/basics/art-20056606", checked: "2026-09-27" },
    mayoHead: { name: "Mayo Clinic · Head trauma", url: "https://www.mayoclinic.org/first-aid/first-aid-head-trauma/basics/art-20056626", checked: "2026-09-27" },
    soulEE: { name: "Hingehoid · Hingehoiutelefon 126", url: "https://www.hingehoid.ee/hingehoiutelefon", checked: "2026-09-27" },
    drownEE: { name: "Veeohutus · Päästeamet · Kannatanu abistamine kaldalt", url: "https://veeohutus.ee/sugis/kannatanu-abistamine-kaldalt/", checked: "2026-09-27" },
    /* Сверено Советом 28.09.2026 (D-315). */
    crashEE: { name: "Politsei- ja Piirivalveamet · Liiklusõnnetuse korral", url: "https://www.politsei.ee/en/what-to-do-in-the-event-of-a-traffic-accident", checked: "2026-09-28" },
    mayoHeart: { name: "Mayo Clinic · Heart attack", url: "https://www.mayoclinic.org/first-aid/first-aid-heart-attack/basics/art-20056679", checked: "2026-09-28" },
    mayoSnake: { name: "Mayo Clinic · Snakebites", url: "https://www.mayoclinic.org/first-aid/first-aid-snake-bites/basics/art-20056681", checked: "2026-09-28" },
    tickEE: { name: "Terviseamet · Puukidega levivad nakkushaigused", url: "https://terviseamet.ee/nakkushaigused/puugihaigused", checked: "2026-09-28" },
    victimEE: { name: "Sotsiaalkindlustusamet · Ohvriabi kriisitelefon 116 006", url: "https://sotsiaalkindlustusamet.ee/en/child-and-adult-need-help/support-victims/victim-support-crisis-helpline", checked: "2026-09-28" },
    sideEE: { name: "Ole valmis! · Sidekatkestus", url: "https://www.olevalmis.ee/sidekatkestus", checked: "2026-09-28" }
  };

  var UI = {
    en: {
      title: "Lantern", label: "Lantern",
      lead: "What is worth knowing exactly when there is no network. All of it lives on this device: no request goes out, and none has to.",
      warn: "This is a reference, not medicine, and it does not replace the emergency number. There is not a single medicine dose here, and there never will be. If you can call — call first, then read.",
      groups: { now: "When it is happening", home: "The home is in danger", dark: "When something stops", away: "Away from home", body: "The body", soul: "The soul", numbers: "Numbers", words: "Ten sentences" },
      ask: "What happened?", askPh: "Write what happened", askGo: "Find",
      askTop: "This looks like it:", askMore: "It may also be:", askOpen: "Open",
      askNone: "I did not find anything by those words. Everything there is stands below. If a life is in danger — call 112.",
            open: "Open", back: "Back", step: "Step", of: "of", next: "Next", done: "Done",
      beatStart: "Start the beat", beatStop: "Stop", beatWhat: "110 a minute — press with the beat",
      clockStart: "Start", clockStop: "Stop", clockReset: "Reset",
      clockUp: "Time since you started", clockDown: "Keep cooling until zero",
      clockFlush: "Keep flushing until zero", clockPinch: "Keep pinching until zero",
      torch: "Light", torchNight: "Night light", torchOff: "Put out",
      whereGo: "Where am I — find my coordinates",
      whereWait: "Asking the device… outdoors it is faster: GPS needs to see the sky.",
      whereLat: "Latitude", whereLon: "Longitude",
      whereAcc: "accuracy ±{m} m · found at {time}",
      whereSay: "Tell the dispatcher: latitude {lat}, longitude {lon}. Latitude first.",
      whereCopy: "Copy", whereCopied: "Copied", whereAgain: "Find again",
      whereDenied: "Access to your location is blocked. Allow it for sys.baby in the browser settings — or describe the place in words: the road, landmarks, what you see around you.",
      whereNone: "This browser cannot find your location. Describe the place in words: the road, landmarks, what you see around you.",
      whereFail: "The location was not found ({why}). Step into the open and try again — or describe the place in words.",
      whereNote: "The coordinates are shown only here: sys.baby does not keep them and sends them nowhere. A phone with GPS finds them without a network; a computer often asks its browser's location service over Wi-Fi, and without internet it may not find them.",
      whereWhat: "has a “Where am I” button",
      tapNext: "Tap to go on",
      source: "Source", checked: "checked"
    },
    ru: {
      title: "Фонарь", label: "Фонарь",
      lead: "То, что стоит знать именно тогда, когда сети нет. Всё это лежит на устройстве: наружу не уходит ни одного запроса, и не должен.",
      warn: "Это справка, а не медицина, и она не заменяет экстренный номер. Здесь нет ни одной дозировки лекарства и не будет. Если можете позвонить — сперва звоните, потом читайте.",
      groups: { now: "Когда это происходит", home: "Дом в опасности", dark: "Когда что-то пропало", away: "Вдали от дома", body: "Тело", soul: "Душа", numbers: "Номера", words: "Десять фраз" },
      ask: "Что случилось?", askPh: "Напишите, что случилось", askGo: "Найти",
      askTop: "Похоже на это:", askMore: "Ещё может подойти:", askOpen: "Открыть",
      askNone: "По этим словам ничего не нашёл. Ниже — всё, что есть. Если жизнь в опасности — звоните 112.",
            open: "Открыть", back: "Назад", step: "Шаг", of: "из", next: "Дальше", done: "Готово",
      beatStart: "Включить ритм", beatStop: "Остановить", beatWhat: "110 в минуту — жмите в такт",
      clockStart: "Пуск", clockStop: "Стоп", clockReset: "Сброс",
      clockUp: "Прошло с начала", clockDown: "Охлаждать до нуля",
      clockFlush: "Промывать до нуля", clockPinch: "Держать зажатым до нуля",
      torch: "Свет", torchNight: "Ночной свет", torchOff: "Погасить",
      whereGo: "Где я — узнать координаты",
      whereWait: "Спрашиваю у устройства… на улице быстрее: GPS нужно видеть небо.",
      whereLat: "Широта", whereLon: "Долгота",
      whereAcc: "точность ±{m} м · определено в {time}",
      whereSay: "Продиктуйте диспетчеру: широта {lat}, долгота {lon}. Сначала широта.",
      whereCopy: "Скопировать", whereCopied: "Скопировано", whereAgain: "Определить снова",
      whereDenied: "Доступ к месту запрещён. Разрешите его для sys.baby в настройках браузера — или опишите место словами: дорога, приметы, что видно вокруг.",
      whereNone: "Этот браузер не умеет определять место. Опишите его словами: дорога, приметы, что видно вокруг.",
      whereFail: "Место не определилось ({why}). Выйдите на открытое место и попробуйте ещё раз — или опишите его словами.",
      whereNote: "Координаты видны только здесь: sys.baby их не хранит и никуда не отправляет. Телефон с GPS находит их и без сети; компьютер часто спрашивает службу местоположения своего браузера по Wi-Fi — без интернета место может не найтись.",
      whereWhat: "есть кнопка «Где я»",
      tapNext: "Нажмите, чтобы дальше",
      source: "Источник", checked: "сверено"
    },
    ee: {
      title: "Latern", label: "Latern",
      lead: "See, mida tasub teada just siis, kui võrku pole. Kõik see on selles seadmes: ükski päring ei lähe välja ega peagi minema.",
      warn: "See on teatmik, mitte meditsiin, ega asenda hädaabinumbrit. Siin ei ole ühtegi ravimiannust ega tule kunagi. Kui saad helistada — helista enne, loe pärast.",
      groups: { now: "Kui see juhtub", home: "Kodu on ohus", dark: "Kui midagi kaob", away: "Kodust eemal", body: "Keha", soul: "Hing", numbers: "Numbrid", words: "Kümme lauset" },
      ask: "Mis juhtus?", askPh: "Kirjuta, mis juhtus", askGo: "Otsi",
      askTop: "Tundub, et see:", askMore: "Võib olla ka:", askOpen: "Ava",
      askNone: "Nende sõnade järgi ma midagi ei leidnud. All on kõik, mis on. Kui elu on ohus — helista 112.",
            open: "Ava", back: "Tagasi", step: "Samm", of: "/", next: "Edasi", done: "Valmis",
      beatStart: "Käivita rütm", beatStop: "Peata", beatWhat: "110 minutis — vajuta rütmis",
      clockStart: "Käivita", clockStop: "Peata", clockReset: "Nulli",
      clockUp: "Aega algusest", clockDown: "Jahuta nullini",
      clockFlush: "Loputa nullini", clockPinch: "Hoia kinni nullini",
      torch: "Valgus", torchNight: "Öövalgus", torchOff: "Kustuta",
      whereGo: "Kus ma olen — leia koordinaadid",
      whereWait: "Küsin seadmelt… õues on kiirem: GPS peab taevast nägema.",
      whereLat: "Laius", whereLon: "Pikkus",
      whereAcc: "täpsus ±{m} m · leitud {time}",
      whereSay: "Ütle dispetšerile: laius {lat}, pikkus {lon}. Kõigepealt laius.",
      whereCopy: "Kopeeri", whereCopied: "Kopeeritud", whereAgain: "Leia uuesti",
      whereDenied: "Juurdepääs asukohale on keelatud. Luba see sys.baby jaoks brauseri seadetes — või kirjelda kohta sõnadega: tee, maamärgid, mida ümberringi näed.",
      whereNone: "See brauser ei oska asukohta leida. Kirjelda kohta sõnadega: tee, maamärgid, mida ümberringi näed.",
      whereFail: "Asukohta ei leitud ({why}). Mine lagedale ja proovi uuesti — või kirjelda kohta sõnadega.",
      whereNote: "Koordinaadid on näha ainult siin: sys.baby ei hoia neid ega saada kuhugi. GPS-iga telefon leiab need ka võrguta; arvuti küsib sageli oma brauseri asukohateenuselt Wi-Fi kaudu — ilma internetita ei pruugi asukoht leiduda.",
      whereWhat: "on nupp «Kus ma olen»",
      tapNext: "Puuduta, et edasi",
      source: "Allikas", checked: "kontrollitud"
    }
  };

  /* ── КАРТОЧКИ. Порядок — по тому, сколько у человека времени: сперва то,
     где счёт на минуты, потом номера, потом долгие беды. ────────────────── */
  var CARDS = [
    {
      id: "cpr", ask: { ru: ["*не дыш", "*без дыхан", "*сердце не", "*остановилось сердц", "*без пульса", "реаним", "посинел", "не очнул"], en: ["*not breathing", "*no pulse", "*stopped breathing", "*heart stopped", "cpr", "collapsed"], ee: ["*ei hinga", "*süda seis", "*pulssi pole", "elustam"] },
      group: "now", src: "erc", tool: { kind: "beat", bpm: 110 },
      en: { title: "Not breathing", steps: [
        "Call 112. Put the phone on speaker and keep it beside you.",
        "Lay them on their back on a hard surface. Heel of one hand in the middle of the chest, the other hand on top.",
        "Press down 5 to 6 cm deep, 100 to 120 times a minute. Let the chest come all the way back up each time.",
        "Not trained in rescue breaths? Then do compressions only, without stopping. This is enough and it saves lives.",
        "Trained? Then 30 compressions to 2 breaths.",
        "If someone brings a defibrillator — switch it on and do exactly what the voice says. Anyone may use it."
      ] },
      ru: { title: "Не дышит", steps: [
        "Звоните 112. Включите громкую связь и положите телефон рядом.",
        "Уложите на спину на твёрдое. Основание ладони — на середину груди, вторая рука сверху.",
        "Давите на глубину от 5 до 6 см, от 100 до 120 раз в минуту. Каждый раз давайте груди полностью подняться.",
        "Не обучены искусственному дыханию? Тогда только нажатия, без остановок. Этого достаточно, и это спасает.",
        "Обучены? Тогда 30 нажатий на 2 вдоха.",
        "Принесли дефибриллятор — включите и делайте ровно то, что говорит голос. Им может пользоваться любой."
      ] },
      ee: { title: "Ei hinga", steps: [
        "Helista 112. Pane telefon valjuhääldile ja endale kõrvale.",
        "Aseta selili kõvale alusele. Ühe käe peopesa alus rinna keskele, teine käsi peale.",
        "Suru 5–6 cm sügavusele, 100–120 korda minutis. Lase rindkerel iga kord täiesti tagasi tulla.",
        "Pole päästehingamist õppinud? Siis ainult surumine, ilma peatumata. Sellest piisab ja see päästab.",
        "Oled õppinud? Siis 30 surumist ja 2 hingetõmmet.",
        "Kui keegi toob defibrillaatori — lülita sisse ja tee täpselt seda, mida hääl ütleb. Seda tohib kasutada igaüks."
      ] }
    },
    {
      id: "choke", ask: { ru: ["*подавил", "*поперхнул", "*застрял в горле", "*не может дышат", "кусок", "задыхается едой"], en: ["*chok", "*stuck in the throat", "*something stuck", "can't breathe after eating"], ee: ["*lämbu", "*kurku kinni", "*toit kurgus", "*läks kurku"] },
      group: "now", src: "erc",
      en: { title: "Choking", steps: [
        "Coughing? Let them cough — a cough shifts more than any hand.",
        "Cannot cough, cannot speak, cannot breathe: stand behind, bend them forward, five sharp blows between the shoulder blades with the heel of your hand.",
        "No good? Five abdominal thrusts: arms around the waist, fist just above the navel, sharply inwards and upwards.",
        "Keep alternating five and five until it comes out or they lose consciousness.",
        "If they go limp — call 112 and start chest compressions."
      ] },
      ru: { title: "Подавился", steps: [
        "Кашляет? Дайте кашлять — кашель сдвигает больше, чем любая рука.",
        "Не кашляет, не говорит, не дышит: встаньте сзади, наклоните вперёд, пять резких ударов основанием ладони между лопаток.",
        "Не помогло? Пять толчков в живот: руки вокруг пояса, кулак чуть выше пупка, резко внутрь и вверх.",
        "Чередуйте пять и пять, пока не выйдет или пока человек в сознании.",
        "Обмяк — звоните 112 и начинайте нажатия на грудь."
      ] },
      ee: { title: "Lämbumine", steps: [
        "Köhib? Lase köhida — köha nihutab rohkem kui ükski käsi.",
        "Ei köhi, ei räägi, ei hinga: seisa selja taha, kalluta ettepoole, viis järsku lööki abaluude vahele peopesa alusega.",
        "Ei aidanud? Viis surumist kõhtu: käed ümber vöökoha, rusikas veidi nabast kõrgemal, järsult sisse ja üles.",
        "Vaheta viis ja viis, kuni tuleb välja või kuni inimene on teadvusel.",
        "Muutub lõdvaks — helista 112 ja alusta rinnasurumist."
      ] }
    },
    {
      id: "bleed", ask: { ru: ["*кровотеч", "*кровь", "*кровит", "*кров=", "*истека", "порез", "рана", "ранил", "ранен"], en: ["*bleed", "*blood", "cut", "wound", "stab", "gash"], ee: ["*verejooks", "*veri", "*veritse", "*jookseb verd", "lõik", "haav"] },
      group: "now", src: "common", tool: { kind: "clock", up: true },
      en: { title: "Heavy bleeding", steps: [
        "Call 112.",
        "Press hard straight onto the wound — cloth, clothing, your hand. Press and do not let go.",
        "Soaked through? Do not take the first layer off. Put another on top and keep pressing.",
        "Raise the limb above the heart if it does not hurt them more.",
        "Do not pull out anything stuck in the wound. Press around it.",
        "Keep them warm and lying down. Cold and standing up both make it worse."
      ] },
      ru: { title: "Сильное кровотечение", steps: [
        "Звоните 112.",
        "Прижмите прямо к ране — тканью, одеждой, рукой. Давите и не отпускайте.",
        "Промокло насквозь? Первый слой не снимайте. Положите сверху ещё и давите дальше.",
        "Поднимите конечность выше сердца, если от этого не больнее.",
        "Не вытаскивайте то, что торчит из раны. Прижимайте вокруг.",
        "Держите в тепле и лёжа. Холод и вертикальное положение делают хуже."
      ] },
      ee: { title: "Tugev verejooks", steps: [
        "Helista 112.",
        "Suru otse haavale — riide, riietuse, käega. Suru ja ära lase lahti.",
        "Läbi imbunud? Esimest kihti ära eemalda. Pane peale veel üks ja suru edasi.",
        "Tõsta jäse südamest kõrgemale, kui see ei tee rohkem haiget.",
        "Ära tõmba välja seda, mis haavas kinni on. Suru selle ümbert.",
        "Hoia sooja ja pikali. Külm ja püstiasend teevad mõlemad halvemaks."
      ] }
    },
    {
      id: "stroke", ask: { ru: ["*инсул", "*перекосило", "*не может говорит", "*лицо съехало", "*не поднимает руку", "онеме", "асимметр"], en: ["*stroke", "*face droop", "*slurred", "*can't speak", "*one side", "numb"], ee: ["*insult", "*nägu viltu", "*ei saa rääkida", "*käsi ei tõuse", "tuim"] },
      group: "now", src: "common",
      en: { title: "Stroke", steps: [
        "Face: ask them to smile. Has one side dropped?",
        "Arms: ask them to raise both. Does one drift down?",
        "Speech: ask them to say a simple sentence. Is it slurred or strange?",
        "Time: any one of these — call 112 at once and say the word stroke.",
        "Note the time it began. The doctors will ask, and the answer decides the treatment.",
        "Give nothing to eat or drink."
      ] },
      ru: { title: "Инсульт", steps: [
        "Лицо: попросите улыбнуться. Одна сторона осела?",
        "Руки: попросите поднять обе. Одна опускается?",
        "Речь: попросите сказать простую фразу. Смазанная или странная?",
        "Время: хоть один признак — звоните 112 немедленно и скажите слово «инсульт».",
        "Запомните, когда началось. Врачи спросят, и от ответа зависит лечение.",
        "Не давайте ни есть, ни пить."
      ] },
      ee: { title: "Insult", steps: [
        "Nägu: palu naeratada. Kas üks pool vajus alla?",
        "Käed: palu tõsta mõlemad. Kas üks vajub?",
        "Kõne: palu öelda lihtne lause. Kas see on segane või imelik?",
        "Aeg: kas või üks neist — helista kohe 112 ja ütle sõna insult.",
        "Jäta meelde, millal algas. Arstid küsivad ja vastusest sõltub ravi.",
        "Ära anna süüa ega juua."
      ] }
    },
    {
      id: "heart", group: "now", src: "mayoHeart",
      ask: { ru: ["*инфаркт", "*боль в груди", "*болит в груди", "*болит сердце", "*давит в груди", "*жжёт в груди", "*сердечный приступ", "сердце"], en: ["*heart attack", "*chest pain", "*pain in the chest", "*pressure in the chest", "heart="], ee: ["*infarkt", "*rinnavalu", "*valu rinnus", "*südameatakk", "süda="] },
      en: { title: "Chest pain — heart attack", steps: [
        "Pressure, tightness or squeezing pain in the chest, spreading to the shoulder, arm, back, neck or jaw; cold sweat, shortness of breath, nausea, dizziness — it may be a heart attack.",
        "Call 112 at once. Do not ignore the signs.",
        "Medicines only if a doctor prescribed them for exactly this, or the 112 dispatcher says so.",
        "Unconscious and not breathing — chest compressions, 100 to 120 a minute, as in “Not breathing”. A defibrillator nearby — switch it on and do what the voice says.",
        "If the ambulance cannot come, let someone else drive. Drive yourself only if there is no other way."
      ] },
      ru: { title: "Боль в груди — инфаркт", steps: [
        "Давящая, сжимающая боль в груди, отдаёт в плечо, руку, спину, шею или челюсть; холодный пот, одышка, тошнота, головокружение — это может быть инфаркт.",
        "Звоните 112 сразу. Не отмахивайтесь от признаков.",
        "Лекарства — только те, что врач назначил именно на такой случай, или если скажет диспетчер 112.",
        "Без сознания и не дышит — нажатия на грудь, 100–120 в минуту, как в «Не дышит». Рядом дефибриллятор — включите и делайте, что говорит голос.",
        "Скорая не может приехать — пусть везёт кто-то другой. За руль сами — только если другого выхода нет."
      ] },
      ee: { title: "Valu rinnus — infarkt", steps: [
        "Suruv, pigistav valu rinnus, mis kiirgub õlga, kätte, selga, kaela või lõuga; külm higi, õhupuudus, iiveldus, pearinglus — see võib olla infarkt.",
        "Helista kohe 112. Ära jäta märke tähelepanuta.",
        "Ravimeid ainult siis, kui arst on need just selleks puhuks määranud või 112 dispetšer ütleb.",
        "Teadvuseta ja ei hinga — rindkere surumised, 100–120 minutis, nagu kaardil «Ei hinga». Defibrillaator on lähedal — lülita sisse ja tee, mida hääl ütleb.",
        "Kiirabi ei saa tulla — lase kellelgi teisel sõidutada. Ise rooli ainult siis, kui muud võimalust pole."
      ] }
    },
    {
      id: "anaph", ask: { ru: ["*аллерг", "*анафилак", "*отёк", "*опухло горло", "*укусила пчел", "*оса", "*задыхается после"], en: ["*allerg", "*anaphyla", "*swelling", "*throat closing", "*bee sting", "*wasp"], ee: ["*allerg", "*anafülak", "*turse", "*kurk paisub", "*mesilane", "*herilane"] },
      group: "now", src: "common",
      en: { title: "Allergic shock", steps: [
        "Swelling of face or throat, a rash spreading, breathing getting hard, feeling faint — call 112.",
        "If they carry an adrenaline auto-injector: it goes into the outer thigh, through clothing if need be. Their own, or the one they hand you.",
        "Lay them flat and raise their legs. Getting up can stop the heart — do not let them stand.",
        "Trouble breathing? Let them sit up, but do not let them walk.",
        "No better in a few minutes and a second injector is at hand — it may be used.",
        "Stay beside them until help comes. It can come back after it eases."
      ] },
      ru: { title: "Аллергический шок", steps: [
        "Отёк лица или горла, расходящаяся сыпь, тяжело дышать, накатывает слабость — звоните 112.",
        "Есть автоинъектор адреналина — в наружную поверхность бедра, при необходимости через одежду. Свой или тот, что вам дали.",
        "Уложите на спину и поднимите ноги. Вставание может остановить сердце — не давайте подниматься.",
        "Тяжело дышать? Дайте сесть, но не давайте ходить.",
        "Через несколько минут не легче, а второй инъектор под рукой — его можно применить.",
        "Будьте рядом до приезда. Отпустив, оно может вернуться."
      ] },
      ee: { title: "Allergiline šokk", steps: [
        "Näo või kõri turse, leviv lööve, raske hingata, tuleb nõrkus — helista 112.",
        "Kui on adrenaliini autosüstal: reie välisküljele, vajadusel läbi riiete. Enda oma või see, mille sulle antakse.",
        "Pane selili ja tõsta jalad üles. Püsti tõusmine võib südame seisata — ära lase tõusta.",
        "Raske hingata? Lase istuda, aga kõndida ära lase.",
        "Mõne minuti pärast pole kergem ja teine süstal on käepärast — seda tohib kasutada.",
        "Ole kõrval kuni abini. Kergendus võib mööduda ja seisund naasta."
      ] }
    },
    {
      id: "burn", ask: { ru: ["*ожог", "*обож", "*обварил", "*ошпар", "*обгорел", "кипят"], en: ["*burnt", "*burned", "*burn=", "*scald", "*boiling water", "*a burn", "*burn on"], ee: ["*põletus", "*põleta", "*kuum vesi", "*keev vesi"] },
      group: "now", src: "burn", tool: { kind: "clock", seconds: 1200 },
      en: { title: "Burn", steps: [
        "Under cool running water for 20 minutes. Not ice, not snow — cool running water.",
        "Twenty minutes is worth it even hours later. It is not a formality; it changes how deep the burn goes.",
        "Take off rings and watches before the swelling. Do not peel off anything stuck to the skin.",
        "No butter, no oil, no toothpaste, no flour. Cover loosely with clean cloth or cling film.",
        "Keep the rest of the body warm — twenty minutes of water cools the whole person, especially a child.",
        "A burn larger than the person's palm, or on face, hands, groin, or a child — call 112."
      ] },
      ru: { title: "Ожог", steps: [
        "Под прохладную проточную воду на 20 минут. Не лёд и не снег — прохладная проточная вода.",
        "Двадцать минут имеют смысл даже спустя часы. Это не формальность: от них зависит, насколько глубоко уйдёт ожог.",
        "Снимите кольца и часы до отёка. Не отдирайте прилипшее к коже.",
        "Никакого масла, крема, зубной пасты, муки. Накройте неплотно чистой тканью или пищевой плёнкой.",
        "Остальное тело держите в тепле — двадцать минут воды охлаждают человека целиком, особенно ребёнка.",
        "Ожог больше ладони самого пострадавшего, или на лице, кистях, паху, или у ребёнка — звоните 112."
      ] },
      ee: { title: "Põletus", steps: [
        "Jaheda voolava vee alla 20 minutiks. Mitte jää ega lumi — jahe voolav vesi.",
        "Kakskümmend minutit tasub end ära ka tunde hiljem. See pole formaalsus: sellest sõltub, kui sügavale põletus läheb.",
        "Võta sõrmused ja kell ära enne turset. Ära kisu lahti seda, mis on naha külge kinni jäänud.",
        "Ei mingit võid, õli, hambapastat ega jahu. Kata lõdvalt puhta riide või toidukilega.",
        "Ülejäänud keha hoia soojas — kakskümmend minutit vett jahutab kogu inimest, eriti last.",
        "Põletus suurem kui kannatanu peopesa, või näol, kätel, kubemes, või lapsel — helista 112."
      ] }
    },
    {
      id: "cold", ask: { ru: ["*замерз", "*переохлажд", "*гипотерм", "*обморож", "дрожит", "очень холодно"], en: ["*hypotherm", "*freezing", "*frostbit", "*very cold", "shivering"], ee: ["*alajahtu", "*külmu", "*väga külm", "väriseb"] },
      group: "now", src: "common",
      en: { title: "Frozen through", steps: [
        "Out of the cold and wind. Off with the wet clothes, on with dry ones or a blanket, head covered.",
        "Move them gently. A body that cold does not like sharp movement.",
        "Warm the middle first — chest, neck, groin — not the hands and feet.",
        "Fully awake and able to swallow: something warm and sweet to drink. No alcohol.",
        "Do not rub the skin and do not put them in hot water.",
        "Confused, slurring, drowsy, or shivering that has stopped by itself — call 112."
      ] },
      ru: { title: "Замёрз", steps: [
        "С холода и ветра — внутрь. Мокрое снять, надеть сухое или укрыть, голову закрыть.",
        "Двигайте осторожно. Настолько остывшее тело не любит резких движений.",
        "Грейте сперва середину — грудь, шею, пах, — а не кисти и стопы.",
        "В полном сознании и может глотать: тёплое сладкое питьё. Алкоголь — нет.",
        "Не растирайте кожу и не сажайте в горячую воду.",
        "Путается, невнятно говорит, клонит в сон, или дрожь прекратилась сама — звоните 112."
      ] },
      ee: { title: "Läbi külmunud", steps: [
        "Külmast ja tuulest sisse. Märg maha, kuiv selga või tekk peale, pea kaetud.",
        "Liiguta ettevaatlikult. Nii jahtunud keha ei salli järske liigutusi.",
        "Soojenda kõigepealt keset — rindkere, kael, kubeme —, mitte käsi ja jalgu.",
        "Täiesti teadvusel ja suudab neelata: soe magus jook. Alkoholi mitte.",
        "Ära hõõru nahka ega pane kuuma vette.",
        "Segaduses, ebaselge kõne, uimane või värin lakkas ise — helista 112."
      ] }
    },
    {
      id: "fit", ask: { ru: ["*судорог", "*припад", "*эпилеп", "*трясёт", "*конвульс", "бьётся"], en: ["*seizure", "*convuls", "*epilep", "*shaking", "fit="], ee: ["*krambid", "*krampi", "*epilep", "*tõmbleb", "hoog"] },
      group: "now", src: "common",
      en: { title: "A fit", steps: [
        "Do not hold them down and do not put anything in their mouth. Neither helps; both harm.",
        "Move away whatever is hard or sharp. Something soft under the head.",
        "Note when it began.",
        "When it stops — onto their side, mouth downwards, so they can breathe.",
        "Stay until they are properly back. Confusion afterwards is normal and passes.",
        "It does not stop, it starts again, they are hurt, or it is their first ever — call 112."
      ] },
      ru: { title: "Припадок", steps: [
        "Не держите и не суйте ничего в рот. Ни то, ни другое не помогает, а вредит и то, и другое.",
        "Уберите твёрдое и острое вокруг. Под голову — мягкое.",
        "Заметьте, когда началось.",
        "Кончилось — поверните на бок, лицом вниз, чтобы дышал.",
        "Побудьте рядом, пока не придёт в себя. Спутанность после — нормально и проходит.",
        "Не прекращается, повторяется, человек травмирован или это впервые — звоните 112."
      ] },
      ee: { title: "Krambihoog", steps: [
        "Ära hoia kinni ega pane midagi suhu. Kumbki ei aita ja mõlemad kahjustavad.",
        "Vii eemale kõva ja terav. Pea alla midagi pehmet.",
        "Pane tähele, millal algas.",
        "Kui lõppes — keera külili, nägu allapoole, et saaks hingata.",
        "Ole kõrval, kuni ta on korralikult tagasi. Segadus pärast on normaalne ja möödub.",
        "Ei lõpe, kordub, inimene sai viga või on see esimene kord — helista 112."
      ] }
    },
    {
      id: "112", ask: { ru: ["*112", "*куда звонить", "*пропал ребен", "*скорую", "*полиц", "пожарн", "позвонить", "вызвать", "номер", "*координат", "*где я нахож", "*местополож"], en: ["*112", "*emergency number", "*missing child", "*ambulance", "*police", "call=", "*coordinates", "*where am i", "*my location"], ee: ["*112", "*hädaabi", "*kadunud laps", "*kiirabi", "*politsei", "helista", "*koordinaat", "*kus ma olen", "*asukoh"] },
      group: "numbers", src: "eu112",
      /* Первый шаг карточки — «скажите ГДЕ». Прибор отвечает на этот шаг (D-331). */
      tool: { kind: "where" },
      en: { title: "112", steps: [
        "112 is the emergency number in every country of the European Union, free from any phone, fixed or mobile.",
        "One number for all three: ambulance, fire, police.",
        "Say first WHERE. An address, a road number, a landmark, anything. Everything else can be asked; the place cannot be guessed.",
        "Then WHAT happened, how many people, and whether anyone is unconscious or not breathing.",
        "Do not hang up first. They will tell you what to do while help is on the way.",
        "116 000 — the hotline for a missing child, the same across the Union."
      ] },
      ru: { title: "112", steps: [
        "112 — экстренный номер в каждой стране Европейского союза, бесплатно с любого телефона, стационарного или мобильного.",
        "Один номер на все три службы: скорая, пожарные, полиция.",
        "Первым делом скажите ГДЕ. Адрес, номер шоссе, приметное место — что угодно. Остальное спросят, место не угадают.",
        "Потом ЧТО случилось, сколько людей и есть ли те, кто без сознания или не дышит.",
        "Не кладите трубку первым. Вам скажут, что делать, пока помощь едет.",
        "116 000 — линия о пропавшем ребёнке, одна и та же по всему Союзу."
      ] },
      ee: { title: "112", steps: [
        "112 on hädaabinumber igas Euroopa Liidu riigis, tasuta igalt telefonilt, laua- või mobiililt.",
        "Üks number kõigi kolme jaoks: kiirabi, pääste, politsei.",
        "Ütle kõigepealt KUS. Aadress, maantee number, silmapaistev koht — ükskõik mis. Muu küsitakse, kohta ei osata arvata.",
        "Siis MIS juhtus, kui palju inimesi ja kas keegi on teadvuseta või ei hinga.",
        "Ära pane esimesena toru ära. Sulle öeldakse, mida teha, kuni abi tuleb.",
        "116 000 — kadunud lapse liin, kogu liidus sama."
      ] }
    },
    {
      id: "dark", ask: { ru: ["*погас свет", "*нет света", "*без света", "*отключили свет", "*нет электрич", "*без электрич", "*отключили электрич", "*генератор", "*отопл", "электрич", "свет=", "света=", "холодильник"], en: ["*blackout", "*power cut", "*no power", "*no light", "*lights out", "*electricity", "*generator", "*heating", "power="], ee: ["*elekter", "*elektrit", "*elektrikatkestus", "*voolu pole", "*generaator", "*küte", "pime"] },
      group: "dark", src: "valmis",
      en: { title: "The power is out", steps: [
        "The Rescue Board asks households to be able to manage on their own, without electricity, water or heating, for at least a week.",
        "Never bring a generator, a grill or a petrol burner indoors — not into the flat, the garage or the porch. Carbon monoxide has no smell and it kills people who are asleep.",
        "Keep the fridge and freezer shut. Every opening costs hours of cold.",
        "Live in one room: the smallest, warmest, with the fewest windows. Close the doors to the rest.",
        "Save the phone: dim it, turn off what you are not using, and keep a charged power bank. A hand-crank or battery radio hears what the phone cannot.",
        "Water: fill everything while it still runs. Candles are light, but a torch does not set the house on fire."
      ] },
      ru: { title: "Погас свет", steps: [
        "Спасательный департамент просит держать дом способным продержаться самостоятельно — без электричества, воды и тепла — не меньше недели.",
        "Никогда не заносите генератор, гриль или бензиновую горелку внутрь — ни в квартиру, ни в гараж, ни на веранду. Угарный газ не пахнет и убивает спящих.",
        "Холодильник и морозильник держите закрытыми. Каждое открывание стоит часов холода.",
        "Живите в одной комнате: меньшей, тёплой, с наименьшим числом окон. Двери в остальные закройте.",
        "Берегите телефон: убавьте яркость, выключите ненужное, держите заряженный аккумулятор. Радио на батарейках или с ручкой слышит то, чего не слышит телефон.",
        "Вода: наберите всё, пока идёт. Свечи — это свет, но фонарь не поджигает дом."
      ] },
      ee: { title: "Elekter on ära", steps: [
        "Päästeamet palub, et kodu tuleks toime iseseisvalt — ilma elektri, vee ja kütteta — vähemalt nädala.",
        "Ära kunagi too generaatorit, grilli ega bensiinipõletit sisse — ei korterisse, garaaži ega verandale. Vingugaasil pole lõhna ja see tapab magajaid.",
        "Hoia külmik ja sügavkülmik suletuna. Iga avamine maksab tunde külma.",
        "Ela ühes toas: väiksemas, soojemas, kõige vähemate akendega. Ülejäänud uksed sulge.",
        "Hoia telefoni: vähenda heledust, lülita mittevajalik välja, hoia laetud akupanka. Patarei- või vändaraadio kuuleb seda, mida telefon ei kuule.",
        "Vesi: täida kõik, kuni see veel jookseb. Küünlad on valgus, aga taskulamp ei süüta maja."
      ] }
    },
    {
      id: "words", ask: { ru: ["*не говорю", "*язык", "*перевод", "*по-эстонски", "*не понимают", "как сказат"], en: ["*language", "*translat", "*don't speak", "*estonian", "how to say"], ee: ["*keel", "*tõlk", "*ei räägi", "*inglise"] },
      group: "words", src: "eu112",
      en: { title: "If you cannot speak the language", steps: [
        "Help me — Aidake mind — Помогите",
        "Call an ambulance — Kutsuge kiirabi — Вызовите скорую",
        "I am here: … — Ma olen siin: … — Я нахожусь: …",
        "He is not breathing — Ta ei hinga — Он не дышит",
        "I am allergic to … — Mul on allergia … — У меня аллергия на …",
        "I do not speak Estonian, do you speak English? — Ma ei räägi eesti keelt, kas te räägite inglise keelt? — Я не говорю по-эстонски, вы говорите по-английски?"
      ] },
      ru: { title: "Если не говорите на языке", steps: [
        "Помогите — Aidake mind — Help me",
        "Вызовите скорую — Kutsuge kiirabi — Call an ambulance",
        "Я нахожусь: … — Ma olen siin: … — I am here: …",
        "Он не дышит — Ta ei hinga — He is not breathing",
        "У меня аллергия на … — Mul on allergia … — I am allergic to …",
        "Я не говорю по-эстонски, вы говорите по-английски? — Ma ei räägi eesti keelt, kas te räägite inglise keelt? — I do not speak Estonian, do you speak English?"
      ] },
      ee: { title: "Kui sa keelt ei räägi", steps: [
        "Aidake mind — Помогите — Help me",
        "Kutsuge kiirabi — Вызовите скорую — Call an ambulance",
        "Ma olen siin: … — Я нахожусь: … — I am here: …",
        "Ta ei hinga — Он не дышит — He is not breathing",
        "Mul on allergia … — У меня аллергия на … — I am allergic to …",
        "Ma ei räägi eesti keelt, kas te räägite inglise keelt? — Я не говорю по-эстонски, вы говорите по-английски? — I do not speak Estonian, do you speak English?"
      ] }
    },
    /* ── СВОД ВЫРОС (D-312, 27.09.2026). Восемнадцать бед ниже сверены Советом
       в день, что стоит у их источников. Порядок в массиве — порядок на полке
       внутри раздела и, при равном весе слов, порядок в подборе: раньше в
       массиве — раньше в ответе. ──────────────────────────────────────── */
    {
      id: "fire", group: "now", src: "fireEE",
      ask: { ru: ["*пожар", "*горит", "*загорел", "*дым", "*огонь", "*задымл", "*пожарн", "пламя"], en: ["*fire", "*smoke", "*burning", "*flames", "*on fire"], ee: ["*tulekahju", "*põleb", "*suits", "*leegid", "*tuli on lahti", "*tuli lahti", "tuli="] },
      en: { title: "Fire", steps: [
        "Call 112. Say the address and whether anyone is inside.",
        "Get everyone out and go yourself. Do not look for the cause or gather things — there is no time.",
        "In smoke stay as low as you can: there is more clean air near the floor. A wet cloth over the mouth and nose.",
        "Way out blocked — gather in one room with a window, block the door gaps, make noise at the window and wait for the rescuers.",
        "Fight it yourself only if the fire is small and you have an extinguisher. A big fire is for the rescuers, not for you.",
        "Meet the rescuers outside and tell them whether anyone is still inside."
      ] },
      ru: { title: "Пожар", steps: [
        "Звоните 112. Скажите адрес и есть ли кто-то внутри.",
        "Выводите всех и уходите сами. Не ищите причину и не собирайте вещи — на это нет времени.",
        "В дыму держитесь как можно ниже: у пола больше чистого воздуха. Мокрая ткань на рот и нос.",
        "Выход отрезан — соберитесь в одной комнате с окном, заткните щели двери, шумите в окно и ждите спасателей.",
        "Тушить самому — только маленький огонь и только огнетушителем. Большой огонь тушат спасатели, а не вы.",
        "Встретьте спасателей снаружи и скажите, остался ли кто-то внутри."
      ] },
      ee: { title: "Tulekahju", steps: [
        "Helista 112. Ütle aadress ja kas keegi on sees.",
        "Vii kõik välja ja mine ise. Ära otsi põhjust ega korja asju — selleks pole aega.",
        "Suitsus hoia end võimalikult madalal: põranda lähedal on rohkem puhast õhku. Märg riie suu ja nina ette.",
        "Väljapääs on lõigatud — kogunege ühte aknaga tuppa, topi ukseääred kinni, tee akna juures häält ja oota päästjaid.",
        "Kustuta ise ainult väikest tuld ja ainult kustutiga. Suur tuli on päästjate, mitte sinu asi.",
        "Tule päästjatele õue vastu ja ütle, kas keegi on veel sees."
      ] }
    },
    {
      id: "gas", group: "now", src: "gasEE",
      ask: { ru: ["*пахнет газ", "*утечк", "газ=", "газа=", "газом=", "газу="], en: ["*smell of gas", "*gas leak", "gas=", "leak"], ee: ["*gaasilõhn", "*gaasileke", "*leke", "gaas=", "gaasi="] },
      en: { title: "Smell of gas", steps: [
        "Do not switch lights on or off, do not light a flame, do not use electrical devices in that room — a spark will set the gas off.",
        "Open the windows and doors.",
        "If it is safe — close the gas valve.",
        "Get people and animals out and go yourself.",
        "Outside, call 112.",
        "Do not go back until the specialists allow it and the rooms have been aired."
      ] },
      ru: { title: "Пахнет газом", steps: [
        "Не включайте и не выключайте свет, не зажигайте огонь, не пользуйтесь электроприборами в этом помещении — искра взорвёт газ.",
        "Откройте окна и двери.",
        "Если это безопасно — закройте газовый кран.",
        "Выведите людей и животных и выйдите сами.",
        "Снаружи звоните 112.",
        "Не возвращайтесь, пока специалисты не разрешат и помещение не проветрено."
      ] },
      ee: { title: "Gaasilõhn", steps: [
        "Ära lülita valgust sisse ega välja, ära süüta tuld, ära kasuta selles ruumis elektriseadmeid — säde võib gaasi plahvatama panna.",
        "Ava aknad ja uksed.",
        "Kui see on ohutu — sulge gaasikraan.",
        "Vii inimesed ja loomad välja ja mine ise.",
        "Õues helista 112.",
        "Ära mine tagasi enne, kui spetsialistid lubavad ja ruumid on tuulutatud."
      ] }
    },
    {
      id: "electric", group: "now", src: "mayoElec",
      ask: { ru: ["*ударило током", "*удар током", "*электрич", "*розетк", "ток=", "током=", "тока=", "провод"], en: ["*electric shock", "*electrocut", "*shock", "*socket", "*wire"], ee: ["*elektrilöök", "*vool", "*pistik", "*juhe"] },
      en: { title: "Electric shock", steps: [
        "Do not touch the person while the current is on them. Cut the power first — the breaker, the plug.",
        "High-voltage wires: no closer than 6 metres, farther if they spark and jump. Do not approach until the power is confirmed off.",
        "Call 112: burns, confusion, trouble breathing, heart trouble, seizures, unconscious.",
        "Not breathing — chest compressions.",
        "Do not move them unless there is immediate danger. Keep them warm.",
        "Cover burns with clean, lint-free cloth."
      ] },
      ru: { title: "Удар током", steps: [
        "Не трогайте человека, пока он под током. Сперва выключите ток — автомат, вилку.",
        "Высоковольтные провода: не ближе 6 метров, дальше — если искрят и прыгают. Не подходите, пока не подтвердят, что ток снят.",
        "Звоните 112: ожоги, спутанность, трудно дышать, перебои сердца, судороги, без сознания.",
        "Не дышит — нажатия на грудь.",
        "Не двигайте, если нет прямой опасности. Держите в тепле.",
        "Ожоги накройте чистой тканью без ворса."
      ] },
      ee: { title: "Elektrilöök", steps: [
        "Ära puuduta inimest, kuni ta on voolu all. Esmalt lülita vool välja — kaitse, pistik.",
        "Kõrgepingejuhtmed: mitte lähemale kui 6 meetrit, kaugemale — kui sädelevad ja hüplevad. Ära lähene, kuni on kinnitatud, et vool on väljas.",
        "Helista 112: põletused, segadus, hingamisraskus, südamerütmi häired, krambid, teadvuseta.",
        "Ei hinga — rinnale surumine.",
        "Ära liiguta, kui otsest ohtu pole. Hoia soojas.",
        "Põletused kata puhta, ebemevaba riidega."
      ] }
    },
    {
      id: "drown", group: "now", src: "drownEE",
      ask: { ru: ["*тонет", "*тону", "*утону", "*захлеб", "*унесло течен", "*упал в воду", "*упал за борт", "*не умеет плават", "*спасательный круг"], en: ["*drown", "*fell in the water", "*overboard", "*can't swim", "*rip current", "*swept away"], ee: ["*upub", "*uppu", "*kukkus vette", "*üle parda", "*ei oska ujuda", "*vool viis"] },
      en: { title: "Drowning", steps: [
        "Someone is drowning: shout for the people around, call 112 — yourself or through someone. Say what happened and where.",
        "Reach out something: a strong branch, an oar, a plank. Or throw: a lifebuoy, a float, a throw line — anything that floats, even an empty bucket. And pull them to the shore.",
        "Do not go into the water if the current, the waves or a soft bottom would make towing them hard: that is how two people drown.",
        "Out of the water — check breathing. Not breathing — chest compressions, as in “Not breathing”, and 112 on speaker.",
        "Drowning yourself: shout for help. Do not panic, do not thrash — float calmly. Clothes and even boots help you float. Look around for floating things. The shore is near — swim to it.",
        "Water of 2 to 3 degrees is life-threatening after 15 minutes already, colder water after a couple of minutes. Once out — straight into warmth."
      ] },
      ru: { title: "Тонет", steps: [
        "Тонет другой: кричите людям вокруг, звоните 112 — сами или через кого-то. Скажите, что случилось и где.",
        "Протяните что-нибудь: крепкую ветку, весло, доску. Или бросьте: спасательный круг, буй, верёвку — любую плавучую вещь, даже пустое ведро. И тяните к берегу.",
        "Не идите в воду, если течение, волна или мягкое дно не дадут его вытащить: так тонут вдвоём.",
        "Вытащили — проверьте дыхание. Не дышит — нажатия на грудь, как в «Не дышит», и 112 на громкой связи.",
        "Тонете сами: зовите на помощь. Не паникуйте, не барахтайтесь — спокойно держитесь на воде. Одежда и даже сапоги помогают держаться на плаву. Ищите плавучие предметы. Берег близко — плывите к нему.",
        "В воде 2–3 градуса опасно для жизни уже через 15 минут, в более холодной — через пару минут. Выбрались — сразу в тепло."
      ] },
      ee: { title: "Upub", steps: [
        "Keegi upub: hõika ümberkaudsed inimesed appi, helista 112 — ise või kellegi kaudu. Ütle, mis juhtus ja kus.",
        "Ulata talle mõni ese: tugev puuoks, aer, lauajupp. Või viska: päästerõngas, poi, viskeliin — ükskõik milline ujuv ese, kasvõi tühi ämber. Ja tõmba kaldale.",
        "Ära mine vette, kui vool, hoovus või pehme põhi teevad kannatanu vedamise raskeks: nii upub kaks inimest.",
        "Kaldal — kontrolli hingamist. Ei hinga — rindkere surumised, nagu kaardil «Ei hinga», ja 112 valjuhääldis.",
        "Upud ise: hüüa appi. Ära satu paanikasse, ära rabele — püsi rahulikult hõljudes. Riided ja isegi saapad aitavad veepinnal püsida. Vaata ringi ujuvate esemete järele. Kallas on lähedal — uju kaldale.",
        "2–3-kraadises vees on eluohtlik juba 15 minuti möödudes, külmemas vees paari minuti pärast. Välja saanud — kohe sooja."
      ] }
    },
    {
      id: "crash", group: "now", src: "crashEE",
      ask: { ru: ["*авари", "*дтп", "*столкнов", "*сбила машина", "*сбил машин", "*врезал", "*перевернул", "машин"], en: ["*car crash", "*accident", "*collision", "*hit by a car", "*crashed", "car="], ee: ["*liiklusõnnetus", "*avarii", "*kokkupõrge", "*auto alla", "auto="] },
      en: { title: "Car crash", steps: [
        "Stop as soon as you can without creating new danger. Hazard lights and position lights on.",
        "No hazard lights, or poor visibility — put a warning triangle on the road.",
        "Someone is hurt — call 112. After the call, give first aid: “Not breathing”, “Heavy bleeding”.",
        "Call 112 also if the drivers disagree about fault, if safety cannot be ensured, if someone has left, or after a collision with a large animal.",
        "Move the vehicles before the police arrive only if others cannot pass otherwise — and first mark their position and traces in front of witnesses.",
        "No one hurt and no dispute — fill in the form “Teade liiklusõnnetusest” together."
      ] },
      ru: { title: "Авария на дороге", steps: [
        "Остановитесь как можно скорее, не создавая новой опасности. Включите аварийку и габариты.",
        "Аварийки нет или плохо видно — поставьте на дорогу знак аварийной остановки.",
        "Есть пострадавшие — звоните 112. После звонка — первая помощь: «Не дышит», «Сильное кровотечение».",
        "112 — и тогда, когда водители не согласны, кто виноват, когда безопасность не обеспечить, когда кто-то уехал или столкнулись с крупным зверем.",
        "Машины до приезда полиции двигайте, только если иначе другим не проехать, — и сперва отметьте их положение и следы при свидетелях.",
        "Пострадавших и спора нет — заполните вместе бланк «Teade liiklusõnnetusest»."
      ] },
      ee: { title: "Liiklusõnnetus", steps: [
        "Peatu nii kiiresti kui võimalik, uut ohtu tekitamata. Lülita sisse ohutuled ja ääretuled.",
        "Ohutulesid pole või nähtavus on halb — pane teele ohukolmnurk.",
        "Keegi on viga saanud — helista 112. Pärast kõnet anna esmaabi: «Ei hinga», «Tugev verejooks».",
        "Helista 112 ka siis, kui juhid ei ole süüs ühel meelel, ohutust ei saa tagada, keegi on lahkunud või põrgati kokku suurulukiga.",
        "Sõidukeid võib enne politsei saabumist liigutada ainult siis, kui teised muidu mööda ei pääse — ja enne tuleb nende asend ja jäljed tunnistajate juuresolekul märgistada.",
        "Viga saanuid ega vaidlust pole — täitke koos «Teade liiklusõnnetusest»."
      ] }
    },
    {
      id: "snake", group: "now", src: "mayoSnake",
      ask: { ru: ["*зме", "*гадюк", "*укусила змея", "*змея укусила", "*змеиный укус"], en: ["*snake", "*viper", "*adder", "*snake bite", "*bitten by a snake"], ee: ["*rästik", "*madu", "*mao", "*rästik hammust", "*madu hammust"] },
      en: { title: "Snakebite", steps: [
        "A snake has bitten — call 112 at once. Do not wait for signs.",
        "Move well away from the snake. Do not try to catch it.",
        "Stay still and calm. Take off rings, watches and anything tight before swelling starts.",
        "Keep the bitten arm or leg still, at about heart level. Wash the bite with soap and water and cover it loosely with a clean, dry bandage.",
        "No tourniquet, no ice; do not cut the bite or try to suck out the venom; no alcohol or coffee.",
        "Do not take painkillers such as aspirin or ibuprofen: they increase bleeding."
      ] },
      ru: { title: "Укусила змея", steps: [
        "Укусила змея — сразу 112. Не ждите, пока появятся признаки.",
        "Отойдите подальше от змеи. Ловить её не пытайтесь.",
        "Сохраняйте покой и не двигайтесь. Снимите кольца, часы и всё тесное — пока нет отёка.",
        "Укушенную руку или ногу держите неподвижно, примерно на уровне сердца. Место укуса промойте водой с мылом и прикройте чистой сухой повязкой, не туго.",
        "Не накладывайте жгут и лёд, не надрезайте укус и не отсасывайте яд, не пейте алкоголь и кофе.",
        "Не принимайте обезболивающие вроде аспирина и ибупрофена: они усиливают кровотечение."
      ] },
      ee: { title: "Maohammustus", steps: [
        "Madu hammustas — helista kohe 112. Ära oota, kuni tunnused tekivad.",
        "Mine maost kaugele. Ära proovi seda püüda.",
        "Püsi rahulik ja liigu võimalikult vähe. Võta ära sõrmused, kell ja kõik kitsas enne, kui turse tekib.",
        "Hoia hammustatud kätt või jalga liikumatult, umbes südame kõrgusel. Pese hammustuskoht vee ja seebiga ja kata lõdvalt puhta kuiva sidemega.",
        "Ära pane žgutti ega jääd, ära lõika hammustuskohta ega ima mürki välja, ära joo alkoholi ega kohvi.",
        "Ära võta valuvaigisteid nagu aspiriin või ibuprofeen: need suurendavad verejooksu."
      ] }
    },
    {
      id: "siren", group: "home", src: "shelterEE",
      ask: { ru: ["*сирен", "*ee-alarm", "*укрыт", "*воздушная тревог", "*бомб", "*ракет", "*дрон", "*взрыв", "*обстрел", "тревога"], en: ["*siren", "*air raid", "*shelter", "*bomb", "*missile", "*drone", "*explosion", "*shelling", "alarm"], ee: ["*sireen", "*varju", "*õhuhäire", "*pomm", "*rakett", "*droon", "*plahvat", "häire"] },
      en: { title: "Siren — take shelter", steps: [
        "Hear a siren or get an EE-ALARM saying varju kohe — take shelter at once, right where you are. Find out what is happening later, from a safe place.",
        "In a building: first a marked shelter — a blue triangle on orange. None — a room on the lowest floor, behind as many strong walls as possible, away from windows and glass.",
        "Outdoors — into the nearest building; at least so that a strong wall is on one side of you.",
        "Stay in the shelter until the danger has passed.",
        "Crisis information — 1247. Need help — 112."
      ] },
      ru: { title: "Сирена — укрыться", steps: [
        "Услышали сирену или получили EE-ALARM «varju kohe» — укрывайтесь сразу там, где вы есть. Разбираться, что происходит, будете потом, из безопасного места.",
        "В здании: сперва отмеченное укрытие — синий треугольник на оранжевом. Нет его — комната на самом нижнем этаже, за как можно большим числом крепких стен, подальше от окон и стекла.",
        "На улице — в ближайшее здание; хотя бы так, чтобы с одной стороны была крепкая стена.",
        "Оставайтесь в укрытии, пока опасность не пройдёт.",
        "Сведения о кризисе — 1247. Нужна помощь — 112."
      ] },
      ee: { title: "Sireen — varju", steps: [
        "Kuuled sireeni või saad EE-ALARMi «varju kohe» — varju kohe seal, kus parasjagu oled. Uuri, mis toimub, hiljem, ohutust kohast.",
        "Hoones: esmalt märgistatud varjumiskoht — sinine kolmnurk oranžil. Kui pole — ruum võimalikult madalal korrusel, võimalikult mitme tugeva seina taga, akendest ja klaasist eemal.",
        "Õues — lähimasse hoonesse; vähemalt nii, et ühelt küljelt on tugev sein.",
        "Püsi varjumiskohas, kuni ohtu enam pole.",
        "Kriisiinfo — 1247. Vajad abi — 112."
      ] }
    },
    {
      id: "evac", group: "home", src: "evacEE",
      ask: { ru: ["*эвакуац", "*эвакуир", "*покинут дом", "*что взят", "*уезжат", "бежат"], en: ["*evacuat", "*leave home", "*what to take", "*flee"], ee: ["*evakuatsioon", "*evakueer", "*mida kaasa võtta", "*lahku", "põgene"] },
      en: { title: "Evacuation", steps: [
        "The state orders evacuation only when life is directly in danger. Told to go — go by the routes you are given, not your own.",
        "Take: documents, cash and cards, the phone with its charger, your prescription medicines.",
        "Food — at least a day per person, better three: ready to eat, filling, needing no stove.",
        "Water, warm clothes for the weather, the essentials for children and the elderly.",
        "Evacuation centres are first for those with nowhere else to live. Somewhere to go — go there.",
        "Need help — 112."
      ] },
      ru: { title: "Эвакуация", steps: [
        "Государство объявляет эвакуацию только при прямой угрозе жизни. Сказали идти — идите по указанным маршрутам, не по своим.",
        "Возьмите: документы, наличные и карты, телефон с зарядкой, свои рецептурные лекарства.",
        "Еда — не меньше чем на день на человека, лучше на три: готовая, сытная, не требующая плиты.",
        "Вода, тёплая одежда по погоде, самое нужное для детей и стариков.",
        "Центры эвакуации — прежде всего для тех, кому больше негде жить. Есть куда — езжайте туда.",
        "Нужна помощь — 112."
      ] },
      ee: { title: "Evakuatsioon", steps: [
        "Riik kuulutab evakuatsiooni välja ainult siis, kui elu on otseses ohus. Kui kästakse minna — mine ette antud teed pidi, mitte oma.",
        "Võta: dokumendid, sularaha ja kaardid, telefon koos laadijaga, oma retseptiravimid.",
        "Toit — vähemalt üheks päevaks inimese kohta, parem kolmeks: valmis, toitev, pliiti mitte vajav.",
        "Vesi, ilmale vastavad soojad riided, kõige vajalikum lastele ja vanuritele.",
        "Evakuatsioonikeskused on eelkõige neile, kel pole kuhugi mujale minna. Kui on kuhu — mine sinna.",
        "Vajad abi — 112."
      ] }
    },
    {
      id: "violence", group: "home", src: "victimEE",
      ask: { ru: ["*насили", "*избива", "*бьет меня", "*угрожа", "*изнасил", "*домашн", "*муж бьет", "*жена бьет", "*побои", "бьет"], en: ["*violence", "*abuse", "*beats me", "*hits me", "*threaten", "*rape", "*assault", "*domestic"], ee: ["*vägivald", "*lööb mind", "*peksab", "*ähvard", "*vägista", "*ahistam", "*koduvägivald"] },
      en: { title: "Violence", steps: [
        "Danger right now — call 112.",
        "116 006 — the victim support crisis line: around the clock, free, in Estonian, Russian and English.",
        "It is for anyone who has suffered physical, mental, sexual or economic violence, a crime or a loss — and for their loved ones.",
        "Would rather write than talk — the chat at palunabi.ee; you can stay anonymous.",
        "You do not have to cope with this alone."
      ] },
      ru: { title: "Насилие", steps: [
        "Опасность прямо сейчас — звоните 112.",
        "116 006 — кризисный телефон помощи жертвам: круглосуточно, бесплатно, по-эстонски, по-русски и по-английски.",
        "Он для всех, кто пережил физическое, психическое, сексуальное или экономическое насилие, преступление или потерю, — и для их близких.",
        "Легче написать, чем говорить, — чат на palunabi.ee, можно анонимно.",
        "С этим не нужно справляться одному."
      ] },
      ee: { title: "Vägivald", steps: [
        "Oht on praegu — helista 112.",
        "116 006 — ohvriabi kriisitelefon: ööpäev läbi, tasuta, eesti, vene ja inglise keeles.",
        "See on kõigile, kes on kogenud füüsilist, vaimset, seksuaalset või majanduslikku vägivalda, kuritegu või kaotust — ja nende lähedastele.",
        "Kirjutada on lihtsam kui rääkida — vestlus palunabi.ee lehel, võid jääda anonüümseks.",
        "Sellega ei pea üksi toime tulema."
      ] }
    },
    {
      id: "water", group: "dark", src: "waterEE",
      ask: { ru: ["*нет воды", "*без воды", "*водопровод", "*кран", "*кипят", "*питьев", "вода=", "воды=", "воду=", "водой="], en: ["*no water", "*tap", "*drinking water", "*boil", "water="], ee: ["*vett ei ole", "*veekatkestus", "*kraan", "*joogive", "*keeda", "vesi=", "vett=", "vee="] },
      en: { title: "No water", steps: [
        "While it still runs — fill everything you can. The reserve is 3 litres per person a day.",
        "Drain what is left in the pipes into containers.",
        "Spend it sparingly: drinking and food first, everything else later.",
        "Water from nature or in doubt: let it settle, strain it through cloth or a coffee filter and boil it hard for at least 1 minute. Boiling kills germs; it does not remove chemicals.",
        "The sewer may stop: a bag in a bucket as a toilet, newspaper, sawdust or peat on top; waste into a separate bucket.",
        "Listen to the local authorities: where and when water will come."
      ] },
      ru: { title: "Нет воды", steps: [
        "Пока вода ещё идёт — наберите всё, что можно. Запас — 3 литра на человека в сутки.",
        "Слейте остатки из труб в посуду.",
        "Тратьте скупо: сперва питьё и еда, всё остальное — потом.",
        "Вода из природы или сомнительная: дайте отстояться, процедите через ткань или кофейный фильтр и кипятите бурно не меньше 1 минуты. Кипячение убивает микробов, но не убирает химию.",
        "Канализация может встать: туалет — пакет в ведре, сверху газета, опилки или торф; отходы — в отдельное ведро.",
        "Слушайте объявления местных властей: откуда и когда будет вода."
      ] },
      ee: { title: "Vett ei ole", steps: [
        "Kuni vesi veel jookseb — täida kõik, mis saab. Varu on 3 liitrit inimese kohta ööpäevas.",
        "Lase torudesse jäänud vesi anumatesse.",
        "Kuluta säästlikult: esmalt joomine ja toit, kõik muu hiljem.",
        "Loodusest võetud või kahtlane vesi: lase settida, kurna läbi riide või kohvifiltri ja keeda intensiivselt mulisedes vähemalt 1 minut. Keetmine tapab mikroobid, kuid ei eemalda keemiat.",
        "Kanalisatsioon võib seiskuda: tualett — kott ämbris, peale ajaleht, saepuru või turvas; jäätmed eraldi ämbrisse.",
        "Kuula kohaliku omavalitsuse teateid: kust ja millal vesi tuleb."
      ] }
    },
    {
      id: "nolink", group: "dark", src: "sideEE",
      ask: { ru: ["*нет связи", "*без связи", "*пропала связь", "*нет сети", "*не ловит", "*нет интернета", "*пропал интернет", "*не работает карт", "*карта не работает", "*карты не работают", "*не проходит оплата", "*наличн", "*112 без", "связь"], en: ["*no signal", "*no network", "*no internet", "*card not working", "*cards not working", "*can't pay", "*cash", "*no mobile", "*no reception"], ee: ["*levi pole", "*side katkes", "*sidekatkestus", "*internetti pole", "*kaart ei tööta", "*kaardid ei tööta", "*sularaha", "levi="] },
      en: { title: "No signal, cards not working", steps: [
        "Your operator's network is down — you can still call 112. Push-button phone: take out the SIM card and dial 112. Smartphone: restart it, do not enter the SIM PIN, and dial 112. Newer smartphones: hold the power button to call for help.",
        "After the call, switch the SIM card back on, so the dispatcher can call you back.",
        "Without mobile data, bank cards, mobile payments, Mobile-ID and Smart-ID may not work. Keep cash at home.",
        "Save the battery: turn off wifi, mobile data, Bluetooth and apps that need a connection; turn the brightness down.",
        "Listen to the news on the radio on the hour — a car radio works too. The state information line is 1247.",
        "Agree on a meeting place with your family in case you cannot reach each other."
      ] },
      ru: { title: "Нет связи, не работают карты", steps: [
        "Сеть вашего оператора не работает — 112 всё равно можно вызвать. Кнопочный телефон: выньте SIM-карту и наберите 112. Смартфон: перезапустите, SIM PIN не вводите, наберите 112. На новых смартфонах: удерживайте кнопку питания, чтобы вызвать помощь.",
        "После звонка снова включите SIM-карту — чтобы диспетчер мог вам перезвонить.",
        "Без мобильного интернета могут не работать банковские карты, мобильные платежи, Mobiil-ID и Smart-ID. Держите дома наличные.",
        "Берегите батарею: выключите wifi, мобильный интернет, Bluetooth и приложения, которым нужна связь; убавьте яркость.",
        "Новости — по радио в начале каждого часа, радио в машине тоже подходит. Справочная линия государства — 1247.",
        "Договоритесь с семьёй о месте встречи на случай, если не дозвонитесь друг до друга."
      ] },
      ee: { title: "Levi pole, kaardid ei tööta", steps: [
        "Sinu operaatori võrk ei tööta — 112 saab ikkagi kutsuda. Nuppudega telefonis eemalda SIM-kaart ja helista 112. Nutitelefonis taaskäivita seade, jäta SIM PIN sisestamata ja helista 112. Uuematel nutitelefonidel hoia all sisse-/väljalülitamise nuppu, et helistada hädaabisse.",
        "Pärast kõnet aktiveeri SIM-kaart uuesti, et päästekorraldaja saaks sulle tagasi helistada.",
        "Andmeside katkestuse korral ei pruugi pangakaardid, mobiilimaksed, Mobiil-ID ega Smart-ID toimida. Hoia kodus sularaha.",
        "Säästa akut: lülita välja wifi, mobiilne internet, Bluetooth ja rakendused, mis vajavad sidet; vähenda ekraani heledust.",
        "Kuula raadiost täistundidel uudiseid — ka autoraadio sobib. Riigiinfo telefon on 1247.",
        "Lepi perega kokku kohtumispaik juhuks, kui üksteisega ühendust ei saa."
      ] }
    },
    {
      id: "storm", group: "dark", src: "stormEE",
      ask: { ru: ["*буря", "*гроза", "*ураган", "*молни", "*шторм", "*ливень", "*сильный ветер", "град=", "ветер"], en: ["*storm", "*thunder", "*lightning", "*hurricane", "*hail", "*strong wind", "*power line", "wind="], ee: ["*torm", "*äike", "*välk", "*rahe", "*tugev tuul", "tuul="] },
      en: { title: "Storm and thunder", steps: [
        "Stay indoors. Close the windows and doors, step away from the windows.",
        "In thunder do not touch wall sockets and do not use a corded phone.",
        "Outdoors keep away from fallen wires, standing water and lone trees; in thunder — from water and from lone trees: they draw the lightning.",
        "In the car: in heavy rain or hail — slowly; if you cannot see — stop in a safe place with the hazard lights on and wait it out.",
        "A downed wire — do not go near. Elektrilevi: 1343.",
        "Danger to life — 112. Repairs and clearing — once the storm has passed."
      ] },
      ru: { title: "Буря и гроза", steps: [
        "Оставайтесь внутри. Закройте окна и двери, отойдите от окон.",
        "В грозу не трогайте розетки и не говорите по проводному телефону.",
        "На улице держитесь подальше от упавших проводов, луж и одиночных деревьев; в грозу — от воды и от одиноких деревьев: они притягивают молнию.",
        "В машине: в ливень и град — медленно; ничего не видно — остановитесь в безопасном месте с аварийкой и переждите.",
        "Оборванный провод — не подходите. Elektrilevi: 1343.",
        "Опасность для жизни — 112. Чинить и разбирать завалы — когда буря пройдёт."
      ] },
      ee: { title: "Torm ja äike", steps: [
        "Püsi siseruumis. Sulge aknad ja uksed, hoia akendest eemale.",
        "Äikese ajal ära puuduta pistikupesi ega räägi lauatelefoniga.",
        "Õues hoia eemale mahalangenud juhtmetest, veeloikudest ja üksikutest puudest; äikese korral hoidu veekogudest ja üksikutest puudest — need tõmbavad välku.",
        "Autos: paduvihmas ja rahes — aeglaselt; kui nähtavust pole — peatu ohutus kohas, lülita sisse ohutuled ja oota.",
        "Maas olev juhe — ära mine ligi. Elektrilevi: 1343.",
        "Oht elule — 112. Parandamine ja koristamine — kui torm on möödas."
      ] }
    },
    {
      id: "flood", group: "dark", src: "floodEE",
      ask: { ru: ["*наводнен", "*затопил", "*вода поднима", "*потоп", "*залило", "*паводок", "*затопило"], en: ["*flood", "*water rising", "*flooded", "*water coming in"], ee: ["*üleujutus", "*uputa", "*vesi tõuseb", "*üle ujut", "*vesi tuleb"] },
      en: { title: "Flood", steps: [
        "Water coming in — go up: upper floor, attic, roof. Stay inside.",
        "Do not walk or drive through flooded ground without need. If you must walk — test the depth with a stick before every step.",
        "Keep away from flooded substations and anything electrical.",
        "In trouble — 112.",
        "Home — only when it is allowed. Let a specialist check the wiring, heating and water.",
        "Do not eat or drink what the water has touched; do not switch on flooded appliances."
      ] },
      ru: { title: "Наводнение", steps: [
        "Вода входит в дом — поднимайтесь: верхний этаж, чердак, крыша. Оставайтесь внутри.",
        "Не ходите и не ездите по залитому без нужды. Пришлось идти — щупайте глубину палкой перед каждым шагом.",
        "Держитесь подальше от залитых подстанций и электрики.",
        "Беда — 112.",
        "Домой — только когда разрешат. Электрику, отопление и воду пусть проверит специалист.",
        "Не ешьте и не пейте то, что побывало в воде; залитые электроприборы не включайте."
      ] },
      ee: { title: "Üleujutus", steps: [
        "Vesi tuleb majja — mine üles: ülemine korrus, pööning, katus. Püsi sees.",
        "Ära kõnni ega sõida üleujutatud alal ilma vajaduseta. Kui pead minema — kontrolli sügavust kepiga enne iga sammu.",
        "Hoia eemale üleujutatud alajaamadest ja elektriseadmetest.",
        "Hädas — 112.",
        "Koju — ainult siis, kui lubatakse. Lase spetsialistil elekter, küte ja vesi üle vaadata.",
        "Ära söö ega joo seda, mis on vees olnud; veekahjustusega elektriseadmeid ära lülita sisse."
      ] }
    },
    {
      id: "lost", group: "away", src: "lostEE", tool: { kind: "where" },
      ask: { ru: ["*заблуд", "*сбился с пути", "*не знаю где я", "*не найду дорог", "*потерялся", "лес=", "лесу=", "леса=", "лесом="], en: ["*lost", "*can't find the way", "*in the forest", "*in the woods", "forest="], ee: ["*eksi", "*ei tea kus", "*ei leia teed", "mets=", "metsas=", "metsa="] },
      en: { title: "Lost", steps: [
        "Stop. Call 112: where you entered the forest, what you see — water, a hill, a road, the kind of forest, whether anyone is hurt. Give your name and do not hang up first.",
        "Getting dark, tired, hurt, bad weather, no gear — stay where you are. Searchers find the one who stays.",
        "Make yourself visible from the ground and from the air: a fire, trampled or laid-out regular shapes — things nature does not make.",
        "Keep warm: shelter, dry, fire. Drink water only if you are sure it is clean.",
        "Decided to move — one direction, by the sun or a compass; go around obstacles without losing it. No crossing rivers with a fast current or a muddy bottom.",
        "Dark — stop and look for shelter, not for the way."
      ] },
      ru: { title: "Заблудился", steps: [
        "Остановитесь. Звоните 112: откуда вошли в лес, что видите — вода, холм, дорога, какой лес, есть ли пострадавшие. Назовите имя и не кладите трубку первым.",
        "Темнеет, устали, ранены, плохая погода, нет снаряжения — оставайтесь на месте. Идут за тем, кто стоит.",
        "Сделайте себя видимым с земли и с воздуха: костёр, вытоптанные или выложенные ветками ровные фигуры — то, чего в природе не бывает.",
        "Держите тепло: укрытие, сухое, огонь. Воду пейте, только если уверены, что она чистая.",
        "Решили идти — одно направление, по солнцу или компасу; препятствия обходите, не теряя его. Через реку с быстрым течением или илистым дном — нет.",
        "Стемнело — остановитесь и ищите укрытие, а не путь."
      ] },
      ee: { title: "Eksinud", steps: [
        "Peatu. Helista 112: kust sa metsa sisenesid, mida näed — vesi, küngas, tee, milline mets, kas keegi on viga saanud. Ütle oma nimi ja ära lõpeta kõnet esimesena.",
        "Läheb pimedaks, oled väsinud, viga saanud, halb ilm, varustust pole — jää paigale. Otsijad leiavad selle, kes püsib.",
        "Tee end nähtavaks maalt ja õhust: lõke, tallatud või okstest laotud korrapärased kujundid — see, mida looduses ei ole.",
        "Hoia sooja: varjualune, kuiv, tuli. Vett joo ainult siis, kui oled kindel, et see on puhas.",
        "Otsustasid liikuda — üks suund, päikese või kompassi järgi; takistustest mine ümber suunda kaotamata. Kiire vooluga või mudase põhjaga jõge ära ületa.",
        "Läks pimedaks — peatu ja otsi varju, mitte teed."
      ] }
    },
    {
      id: "ice", group: "away", src: "iceEE",
      ask: { ru: ["*провалил", "*под лед", "*полын", "*тонкий лед", "лед=", "льду=", "льда="], en: ["*fell through", "*through the ice", "*thin ice", "ice="], ee: ["*läbi jää", "*vajus", "*õhuke jää", "jää=", "jääl=", "jääle="] },
      en: { title: "Through the ice", steps: [
        "Fell in yourself: shout for help. Do not thrash — stay calm. Watch that the current does not pull you under the ice.",
        "Hands on the ice edge, body as flat as you can, strong kicks to push your chest onto the ice, then the legs. Ice picks — one in each hand, drive them in and pull.",
        "Out — do not stand up: roll or crawl away from the hole. Leave by the way you came.",
        "Into the warm at once; wet clothes off, or at least wrung out.",
        "Someone else fell in: 112 first — yourself or through someone nearby. Approach along their tracks: the ice held there.",
        "2–3 metres before the edge lie down on your belly and crawl. Reach out a branch, a board, a ladder, a jacket. Do not stand — crawl or roll back, dragging them with you. Then — warmth and dry clothes."
      ] },
      ru: { title: "Провалился под лёд", steps: [
        "Провалились сами: зовите на помощь. Не барахтайтесь — спокойно. Следите, чтобы течение не утянуло под лёд.",
        "Руки на кромку льда, тело как можно горизонтальнее, сильными гребками выталкивайте на лёд грудь, потом ноги. Есть ледовые шила — по одному в каждой руке, вбить и подтянуться.",
        "Вылезли — не вставайте: катитесь или ползите от полыньи. Уходите той же дорогой, какой пришли.",
        "Сразу в тепло; мокрое снять, хотя бы выжать.",
        "Провалился другой: сперва 112 — сами или через кого-то рядом. Подходите по его следам: там лёд держал.",
        "За 2–3 метра до края ложитесь на живот и ползите. Протяните ветку, доску, лестницу, куртку. Не вставайте — ползком или перекатом назад, тащите его за собой. Потом — тепло и сухое."
      ] },
      ee: { title: "Läbi jää", steps: [
        "Vajusid ise läbi: hüüa appi. Ära rabele — ole rahulik. Jälgi, et vool sind jää alla ei tõmbaks.",
        "Käed jää servale, keha võimalikult horisontaalselt, tugevate ujumisliigutustega lükka rind jääle, siis jalad. Jäänaasklid — üks kummaski käes, löö jäässe ja tõmba end üles.",
        "Väljas — ära tõuse püsti: rulli või rooma jääaugust eemale. Lahku sama rada pidi, kust tulid.",
        "Kohe sooja; märjad riided seljast, vähemalt väänata.",
        "Läbi vajus keegi teine: esmalt 112 — ise või kellegi lähedaloleva kaudu. Lähene tema jälgi pidi: seal jää kandis.",
        "2–3 meetrit enne serva heida kõhuli ja rooma. Ulata oks, laud, redel, jope. Ära tõuse püsti — rooma või rullu tagasi, teda kaasa vedades. Siis — soe ja kuiv."
      ] }
    },
    {
      id: "fracture", group: "body", src: "mayoFract",
      ask: { ru: ["*перелом", "*слома", "*вывих", "*растяж", "*не может наступ", "*кость", "упал", "нога", "рука"], en: ["*fracture", "*broken", "*broke", "*dislocat", "*sprain", "*bone", "fell", "leg", "arm"], ee: ["*luumurd", "*murd", "*nihestu", "*nikastu", "*luu", "kukkus", "jalg", "käsi"] },
      en: { title: "Broken bone or dislocation", steps: [
        "Call 112 if the limb is bent wrong, bone shows, the arm or leg is numb or pale, or the head, neck or back are hurt.",
        "Bleeding — press a clean cloth on it.",
        "Do not straighten and do not push it back. Do not move the person unless you must.",
        "Keep it still as it lies. Trained, and help far off — a splint above and below the break, with padding.",
        "Cold — only through cloth, never straight on the skin.",
        "Going pale, breathing fast and shallow — lay them down, head a little lower, legs raised."
      ] },
      ru: { title: "Перелом или вывих", steps: [
        "Звоните 112, если конечность искривлена, кость видна, рука или нога онемела или побледнела, или пострадали голова, шея, спина.",
        "Кровь — прижмите чистой тканью.",
        "Не выпрямляйте и не вправляйте. Не двигайте человека без крайней нужды.",
        "Обездвижьте как лежит. Умеете и помощь не скоро — шина выше и ниже перелома, с мягкой прокладкой.",
        "Холод — только через ткань, никогда прямо на кожу.",
        "Бледнеет, дышит часто и мелко — уложите, голову чуть ниже, ноги приподнимите."
      ] },
      ee: { title: "Luumurd või nihestus", steps: [
        "Helista 112, kui jäse on viltu, luu paistab, käsi või jalg on tuim või kahvatu, või viga sai pea, kael või selg.",
        "Veri — suru puhta riidega peale.",
        "Ära sirgesta ega paiguta tagasi. Ära liiguta inimest ilma äärmise vajaduseta.",
        "Hoia paigal nii, nagu on. Kui oskad ja abi on kaugel — lahas murrust üles- ja allapoole, pehme polsterdusega.",
        "Külma — ainult läbi riide, mitte kunagi otse nahale.",
        "Muutub kahvatuks, hingab kiiresti ja pinnapealselt — pane pikali, pea veidi madalamale, jalad üles."
      ] }
    },
    {
      id: "heat", group: "body", src: "mayoHeat",
      ask: { ru: ["*перегре", "*тепловой удар", "*солнечный удар", "*жара", "*солнцепёк", "*душно", "жарко"], en: ["*heatstroke", "*sunstroke", "*overheat", "*too hot", "heat="], ee: ["*kuumarabandus", "*päikesepiste", "*ülekuum", "kuum=", "palav="] },
      en: { title: "Overheated", steps: [
        "Hot, confused, slurring, sick, passing out — call 112. That is heatstroke, and it kills.",
        "Into shade and cool at once.",
        "Cool them: cool water on the skin — shower, hose, wet towels, fan them. Cold on the neck, armpits, groin.",
        "Drink — only if conscious: cool water, no alcohol, no coffee.",
        "Stopped breathing — start chest compressions."
      ] },
      ru: { title: "Перегрелся", steps: [
        "Горячий, спутанный, плохо говорит, тошнит, теряет сознание — звоните 112. Это тепловой удар, он убивает.",
        "Немедленно в тень и прохладу.",
        "Охлаждайте: прохладная вода на кожу — душ, шланг, мокрые полотенца, обмахивайте. Холодное на шею, подмышки, пах.",
        "Пить — только если в сознании: прохладную воду, без алкоголя и кофе.",
        "Перестал дышать — начинайте нажатия на грудь."
      ] },
      ee: { title: "Ülekuumenemine", steps: [
        "Kuum, segaduses, räägib halvasti, iiveldab, kaotab teadvuse — helista 112. See on kuumarabandus ja see tapab.",
        "Kohe varju ja jahedasse.",
        "Jahuta: jahe vesi nahale — dušš, voolik, märjad rätikud, lehvita. Külma kaelale, kaenla alla, kubemesse.",
        "Juua — ainult teadvusel olles: jahedat vett, ilma alkoholi ja kohvita.",
        "Lõpetas hingamise — alusta rinnale surumist."
      ] }
    },
    {
      id: "poison", group: "body", src: "poisonEE", tool: { kind: "clock", up: false, seconds: 1200, note: "clockFlush" },
      ask: { ru: ["*отрав", "*выпил", "*проглот", "*таблет", "*передоз", "*надыш", "*угар", "*грибы", "*съел", "*химия", "*яд"], en: ["*poison", "*swallow", "*overdos", "*pills", "*chemical", "*toxic", "*fumes", "*mushroom", "*ate something"], ee: ["*mürg", "*neela", "*üledoos", "*tablet", "*kemik", "*ving", "*seen", "*sõi"] },
      en: { title: "Poisoned", steps: [
        "Drowsy, unconscious, struggling to breathe, seizures, took a lot — 112.",
        "Otherwise — 16662, the Poison Information line: local call rate, anonymous. Keep the packaging at hand: what, how much, when.",
        "Do not make them vomit. Take what is left out of the mouth.",
        "On the skin: clothes off, gloves if you can, and rinse for 15–20 minutes under a shower or a hose.",
        "In the eye: rinse with cool water for 20 minutes or until help comes.",
        "Breathed it in: out into fresh air at once."
      ] },
      ru: { title: "Отравился", steps: [
        "Сонный, без сознания, трудно дышит, судороги, много выпил или принял — 112.",
        "В остальных случаях — 16662, инфолиния Центра отравлений: по цене местного звонка, анонимно. Держите под рукой упаковку: что, сколько, когда.",
        "Не вызывайте рвоту. Остатки изо рта уберите.",
        "Попало на кожу: снимите одежду, лучше в перчатках, и промывайте 15–20 минут под душем или шлангом.",
        "В глаз: промывайте прохладной водой 20 минут или пока не приедет помощь.",
        "Надышался: сразу на свежий воздух."
      ] },
      ee: { title: "Mürgistus", steps: [
        "Unine, teadvuseta, hingab raskelt, krambid, võttis palju — 112.",
        "Muul juhul — 16662, mürgistusteabe infoliin: kohaliku kõne hinnaga, anonüümne. Hoia pakend käepärast: mis, kui palju, millal.",
        "Ära kutsu esile oksendamist. Võta suust välja, mis sinna jäi.",
        "Nahale: riided seljast, võimalusel kinnastega, ja loputa 15–20 minutit duši või vooliku all.",
        "Silma: loputa jaheda veega 20 minutit või kuni abi tuleb.",
        "Hingas sisse: kohe värske õhu kätte."
      ] }
    },
    {
      id: "nose", group: "body", src: "mayoNose", tool: { kind: "clock", up: false, seconds: 600, note: "clockPinch" },
      ask: { ru: ["*кровь из носа", "*идёт из носа", "нос=", "носа=", "носом=", "носу="], en: ["*nosebleed", "*nose bleed", "nose="], ee: ["*ninaver", "*nina jookseb", "*ninast jookseb", "nina=", "ninast="] },
      en: { title: "Nosebleed", steps: [
        "Sit and lean forward — not back, so the blood does not run down the throat.",
        "Pinch both nostrils with your fingers for 10–15 minutes and breathe through the mouth. Do not check early.",
        "Still bleeding — pinch again, for up to 15 minutes more.",
        "Longer than 30 minutes, after a fall or a blow, feeling faint, a lot of blood — 112 or the emergency room."
      ] },
      ru: { title: "Кровь из носа", steps: [
        "Сядьте и наклонитесь вперёд — не назад, чтобы кровь не шла в горло.",
        "Зажмите обе ноздри пальцами на 10–15 минут и дышите ртом. Не проверяйте раньше времени.",
        "Не остановилось — зажмите снова, ещё до 15 минут.",
        "Дольше 30 минут, после падения или удара, кружится голова, крови очень много — 112 или в приёмный покой."
      ] },
      ee: { title: "Ninaverejooks", steps: [
        "Istu ja kummardu ette — mitte taha, et veri kurku ei voolaks.",
        "Pigista mõlemad ninasõõrmed sõrmedega 10–15 minutiks kinni ja hinga suu kaudu. Ära kontrolli enneaegselt.",
        "Ei peatunud — pigista uuesti, veel kuni 15 minutit.",
        "Kestab üle 30 minuti, pärast kukkumist või lööki, pea käib ringi, verd on väga palju — 112 või erakorralise meditsiini osakond."
      ] }
    },
    {
      id: "bite", group: "body", src: "mayoBite",
      ask: { ru: ["*укус", "*покусал", "*бешен", "*летучая мыш", "*животн", "собака", "кошка"], en: ["*bite", "*bitten", "*bit=", "*animal bite", "*rabies", "*attacked by", "dog=", "cat=", "bat="], ee: ["*hammust", "*marutaud", "*nahkhiir", "*loom", "koer", "kass"] },
      en: { title: "Animal bite", steps: [
        "Wash the wound with soap and water.",
        "Bleeding — press a clean cloth on it. Then a clean bandage.",
        "See a doctor: the wound is deep, will not stop bleeding, the animal is unknown or wild — rabies — it swells, reddens or oozes.",
        "A bat — see a doctor even without a visible bite.",
        "Ask the doctor about a tetanus shot if the wound is deep or dirty.",
        "Heavy bleeding, a bite to the face or neck — 112."
      ] },
      ru: { title: "Укусило животное", steps: [
        "Промойте рану водой с мылом.",
        "Кровь — прижмите чистой тканью. Потом чистая повязка.",
        "К врачу: рана глубокая, кровь не останавливается, животное незнакомое или дикое — бешенство, — опухает, краснеет, сочится.",
        "Летучая мышь — к врачу даже без следов укуса.",
        "Спросите врача о прививке от столбняка, если рана глубокая или грязная.",
        "Сильное кровотечение, укус в лицо или шею — 112."
      ] },
      ee: { title: "Loom hammustas", steps: [
        "Pese haav seebi ja veega.",
        "Veri — suru puhta riidega peale. Siis puhas side.",
        "Arsti juurde: haav on sügav, veri ei peatu, loom on võõras või metsik — marutaud —, paisub, punetab või immitseb.",
        "Nahkhiir — arsti juurde ka ilma nähtava hammustuseta.",
        "Küsi arstilt teetanuse süsti kohta, kui haav on sügav või must.",
        "Tugev verejooks, hammustus näkku või kaela — 112."
      ] }
    },
    {
      id: "tick", group: "body", src: "tickEE",
      ask: { ru: ["*клещ", "*присосал", "*клещевой", "*клещ укус", "*укусил клещ"], en: ["*tick=", "*ticks=", "*tick bite", "*tick bit", "*lyme"], ee: ["*puuk", "*puugi", "*puugihammustus", "*puuk hammust"] },
      en: { title: "Tick bite", steps: [
        "Grip the tick with fine-tipped tweezers as close to the skin as you can, without squeezing its body.",
        "Pull it out slowly — pulling or turning. No oil, alcohol or petrol.",
        "Wash the bite with soap and water or disinfect it.",
        "Watch the spot: an infection can show itself more than three weeks later.",
        "An expanding red patch, fever, tiredness, sensitivity to light, feeling worse — go to a doctor."
      ] },
      ru: { title: "Укусил клещ", steps: [
        "Возьмите клеща пинцетом с тонкими кончиками как можно ближе к коже, не сдавливая его тело.",
        "Вытаскивайте медленно — вытягивая или поворачивая. Масло, спирт, бензин не нужны.",
        "Промойте место укуса водой с мылом или продезинфицируйте.",
        "Следите за этим местом: болезнь может проявиться и больше чем через три недели.",
        "Расползающееся красное пятно, температура, усталость, боязнь света, плохое самочувствие — к врачу."
      ] },
      ee: { title: "Puugihammustus", steps: [
        "Haara puugi kehast pintsetiga võimalikult naha lähedalt, puuki pigistamata.",
        "Eemalda puuk aeglaselt, tõmmates või pöörates. Õli, alkoholi ega bensiini pole vaja.",
        "Pese hammustuskoht vee ja seebiga või desinfitseeri.",
        "Jälgi seda kohta: nakkuse sümptomid võivad tekkida ka rohkem kui kolme nädala pärast.",
        "Laienev punetav laik, palavik, väsimus, valgustundlikkus, halvenenud enesetunne — mine arsti juurde."
      ] }
    },
    {
      id: "faint", group: "body", src: "mayoFaint",
      ask: { ru: ["*обморок", "*потерял сознан", "*без сознан", "*упал в обморок", "*головокруж", "*не встаёт", "*не отвечает", "*не реагирует", "*дурно", "*кружится", "*очнул", "*отключил"], en: ["*faint", "*passed out", "*unconscious", "*lost consciousness", "*consciousness", "*not responding", "*won't wake", "*collapsed", "*dizzy", "*blacked out"], ee: ["*minesta", "*teadvuse", "*teadvuseta", "*ei reageeri", "*ei ärka", "*ei tõuse", "*pea käib ringi", "*kukkus kokku"] },
      en: { title: "Fainted", steps: [
        "Lay them on their back, legs raised above the heart, about 30 cm.",
        "Loosen the belt, the collar, anything tight.",
        "Not back within a minute — 112.",
        "Check the breathing. Not breathing — chest compressions and 112.",
        "Fell and got hurt — press on wounds, cool bruises through cloth.",
        "Feeling faint yourself: lie down or sit, head between the knees."
      ] },
      ru: { title: "Потерял сознание", steps: [
        "Уложите на спину, ноги поднимите выше сердца, примерно на 30 см.",
        "Ослабьте ремень, воротник, всё тугое.",
        "Не пришёл в себя за минуту — 112.",
        "Проверьте дыхание. Не дышит — нажатия на грудь и 112.",
        "Упал и ушибся — раны прижмите, ушибы охладите через ткань.",
        "Самому дурно: лягте или сядьте, голову между колен."
      ] },
      ee: { title: "Kaotas teadvuse", steps: [
        "Pane selili, jalad südamest kõrgemale, umbes 30 cm.",
        "Lõdvenda vöö, krae, kõik pingul olev.",
        "Ei tulnud minuti jooksul teadvusele — 112.",
        "Kontrolli hingamist. Ei hinga — rinnale surumine ja 112.",
        "Kukkus ja sai viga — suru haavad kinni, jahuta muljutisi läbi riide.",
        "Endal hakkab paha: heida pikali või istu, pea põlvede vahele."
      ] }
    },
    {
      id: "head", group: "body", src: "mayoHead",
      ask: { ru: ["*ударился головой", "*удар по голове", "*сотряс", "*череп", "*затылок", "голов", "голова=", "головой="], en: ["*hit the head", "*head injury", "*hit his head", "*hit her head", "*hit my head", "*banged", "*concuss", "*skull", "head="], ee: ["*lõi pea", "*peavigastus", "*põrutus", "*kolju", "pea=", "pead=", "peaga="] },
      en: { title: "Hit the head", steps: [
        "112: was unconscious, getting more confused, pupils of different sizes, blood or fluid from the nose or ears, seizures, cannot move an arm or a leg, bleeding heavily.",
        "Lay them down, head and shoulders slightly raised. Do not move the neck, do not remove a helmet.",
        "Bleeding — press a clean cloth on it; if the skull may be broken — do not press straight on the wound.",
        "Watch the breathing and the alertness. Not breathing — chest compressions.",
        "Later sick, vomiting, headache, unsteady, forgetful — see a doctor."
      ] },
      ru: { title: "Ударился головой", steps: [
        "112: был без сознания, путается всё сильнее, зрачки разного размера, кровь или жидкость из носа или ушей, судороги, не двигает рукой или ногой, сильно кровит.",
        "Уложите, голову и плечи чуть приподнять. Шею не двигать, шлем не снимать.",
        "Кровь — прижмите чистой тканью; подозрение на перелом черепа — не давите прямо на рану.",
        "Следите за дыханием и ясностью. Не дышит — нажатия на грудь.",
        "Позже тошнит, рвёт, болит голова, шатает, забывает — к врачу."
      ] },
      ee: { title: "Lõi pea ära", steps: [
        "112: oli teadvuseta, läheb aina segasemaks, pupillid eri suurusega, verd või vedelikku ninast või kõrvast, krambid, ei liiguta kätt või jalga, veritseb tugevalt.",
        "Pane pikali, pea ja õlad veidi kõrgemale. Kaela ära liiguta, kiivrit ära võta.",
        "Veri — suru puhta riidega peale; kui kolju võib olla murdunud — ära suru otse haavale.",
        "Jälgi hingamist ja teadvust. Ei hinga — rinnale surumine.",
        "Hiljem iiveldab, oksendab, pea valutab, kõikuma lööb, unustab — arsti juurde."
      ] }
    },
    {
      id: "soul", group: "soul", src: "soulEE",
      ask: { ru: ["*очень тяжело", "*плохо на душе", "*не хочу жит", "*хочу умерет", "*покончит", "*тоска", "*одинок", "*паник", "*тревож", "*депресс", "*нет сил", "*отчаян", "страшно", "тяжело"], en: ["*very hard", "*hopeless", "*don't want to live", "*want to die", "*suicid", "*lonely", "*panic", "*anxious", "*depress", "*despair", "*can't cope", "scared"], ee: ["*väga raske", "*ei taha elada", "*tahan surra", "*enesetapp", "*üksi", "*paanika", "*ärev", "*depress", "*meeleheit", "hirm", "raske"] },
      en: { title: "It is very hard", steps: [
        "You do not have to be alone with this. Right now there is someone to call.",
        "126 — the spiritual support line, every day from 19 to 00. Estonian; Russian and English — about half of the counsellors.",
        "116 123 — the emotional support line.",
        "If life is in danger — right now — 112.",
        "Go to people: whoever is near, a neighbour, a lit place. Do not stay alone in the dark.",
        "The night ends. In the morning, call your doctor."
      ] },
      ru: { title: "Очень тяжело", steps: [
        "Вам не обязательно быть с этим одному. Прямо сейчас есть, кому позвонить.",
        "126 — телефон душевной поддержки, ежедневно с 19 до 00. Говорят по-эстонски; по-русски и по-английски — примерно половина консультантов.",
        "116 123 — телефон эмоциональной поддержки.",
        "Если опасность для жизни — прямо сейчас — 112.",
        "Идите к людям: к тому, кто рядом, к соседу, в освещённое место. Не оставайтесь одни в темноте.",
        "Ночь заканчивается. Утром позвоните своему врачу."
      ] },
      ee: { title: "On väga raske", steps: [
        "Sa ei pea sellega üksi olema. Just praegu on, kellele helistada.",
        "126 — hingehoiutelefon, iga päev kell 19–00. Eesti keeles; vene ja inglise keeles — umbes pooled nõustajad.",
        "116 123 — emotsionaalse toe telefon.",
        "Kui elu on ohus — just praegu — 112.",
        "Mine inimeste juurde: selle juurde, kes on lähedal, naabri juurde, valgustatud kohta. Ära jää üksi pimedasse.",
        "Öö saab läbi. Hommikul helista oma arstile."
      ] }
    }
  ];

  /* Разделы полки — по тому, сколько у человека времени: сперва беды на
     минуты, потом номера, потом тело, дом, дорога, долгие беды, душа и
     слова. ПОСТОЯННАЯ: список разделов — это состав полки, а не счётчик;
     lantern-check сверяет, что каждый раздел из этого списка нарисован. */
  var GROUPS = ["now", "numbers", "body", "home", "away", "dark", "soul", "words"];

  /* Оболочка передаёт ОКНО, а не место под содержимое: место приложение
     находит само (тот же договор, что у всех прочих). Первый прогон вернул
     пустое окно с верным заголовком — ровно потому, что здесь стоял host. */
  /* ─────────────────── ФОНАРЬ — ПРИБОР, А НЕ СПРАВОЧНИК (v100) ──────────
     ПОВОД, дословно от основателя: «обработайте приложение lantern, он должен
     быть волшебным и идеальным, а не как сейчас».

     ЧТО БЫЛО. Одиннадцать карточек, развёрнутых разом в одну длинную стену
     текста. Как СПРАВОЧНИК это верно. Как помощь — нет: человек, у которого
     на руках перестал дышать другой человек, НЕ ЧИТАЕТ СПИСКОВ. Он держит
     телефон одной рукой, у него трясутся пальцы, и ему нужно ОДНО действие,
     а не одиннадцать заголовков.

     ЧТО СТАЛО, и это одна мысль, а не четыре правки:
       · НА ПОЛКЕ — только имена бед, крупно. Ни одного шага заранее.
       · ОТКРЫЛ — ОДИН ШАГ ВО ВЕСЬ ЭКРАН. Крупно. Нажал куда угодно — дальше.
         Внутри шага нечего прокручивать, потому что шаг один.
       · ГДЕ МОЖНО ПОМОЧЬ РУКАМИ — ПОМОГАЕМ. У непрямого массажа сердца
         бьётся МЕТРОНОМ на 110 в минуту: звук, вспышка и толчок в ладонь.
         У ожога — обратный отсчёт двадцати минут охлаждения. У кровотечения —
         часы, считающие время с наложения жгута. Это уже не слова о помощи,
         а помощь.
       · И ФОНАРЬ СВЕТИТ. Он так называется. Белый свет во весь экран — и
         красный, который не сбивает привыкшие к темноте глаза.

     ПОЧЕМУ ЭТО ВАЖНЕЕ КРАСОТЫ. Ритм 100–120 в минуту — то, что спасатели
     называют первым, и то, что человек без подготовки держать не может:
     без счёта руки уходят либо в 60, либо в 180. Телефон, который стучит
     такт, делает больше, чем абзац, объясняющий, какой такт нужен.

     ЧЕГО ФОНАРЬ ПО-ПРЕЖНЕМУ НЕ ДЕЛАЕТ, и это сказано в самой шапке: он не
     лечит, не заменяет 112 и не назовёт ни одной дозировки. Прибор помогает
     ДЕРЖАТЬ ритм и время — решения остаются на человеке и на враче.

     Охраняется tools/lantern-check.mjs. */

  var openId = null;       /* какая беда открыта */
  var stepAt = 0;          /* какой шаг показан */
  var beat = null;         /* метроном */
  var clock = null;        /* часы */
  var audio = null;

  function calm() {
    try { return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
    catch (e) { return false; }
  }

  function stopTools() {
    if (beat && beat.timer) { clearInterval(beat.timer); }
    if (clock && clock.timer) { clearInterval(clock.timer); }
    beat = null; clock = null;
  }

  /* Щелчок делается ЗВУКОМ, а не файлом: файл — это ещё одна вещь, которой
     может не оказаться без сети, а Фонарь обязан работать без всего. */
  function click() {
    try {
      if (!audio) {
        var C = window.AudioContext || window.webkitAudioContext;
        if (!C) return;
        audio = new C();
      }
      if (audio.state === "suspended") audio.resume();
      var o = audio.createOscillator(), g = audio.createGain();
      o.type = "square"; o.frequency.value = 1050;
      g.gain.setValueAtTime(0.0001, audio.currentTime);
      g.gain.exponentialRampToValueAtTime(0.22, audio.currentTime + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.055);
      o.connect(g); g.connect(audio.destination);
      o.start(); o.stop(audio.currentTime + 0.06);
    } catch (e) { /* без звука — но с вспышкой и толчком */ }
    try { if (navigator.vibrate) navigator.vibrate(18); } catch (e) { /* ignore */ }
  }

  function mmss(sec) {
    var m = Math.floor(Math.abs(sec) / 60), s2 = Math.abs(sec) % 60;
    return (m < 10 ? "0" : "") + m + ":" + (s2 < 10 ? "0" : "") + s2;
  }

  function findCard(id) {
    for (var i = 0; i < CARDS.length; i++) if (CARDS[i].id === id) return CARDS[i];
    return null;
  }

  /* ── «ГДЕ Я» — КООРДИНАТЫ ДЛЯ 112 (D-331) ──────────────────────────────
     Подарок людям, выбранный основателем 28.09.2026. Первый шаг карточки 112
     — «скажите ГДЕ», и человек, который не знает адреса (лес, трасса, чужой
     город), не может его исполнить. Прибор спрашивает место у самого
     устройства и показывает его крупно — числами, которые диктуют
     диспетчеру, и строкой, как их сказать. Координаты живут только в памяти
     этой страницы: не пишутся на диск, не уходят никуда. Сама система
     наружу не ходит; браузер компьютера может спросить свою службу
     местоположения — это названо в окне «Наружу».
     Охраняется tools/where-am-i-check.mjs. */
  var whereFix = null;       /* { lat, lon, acc, at } | { err } — только в памяти */
  function fillT(s, v) {
    return String(s).replace(/\{(\w+)\}/g, function (m, k) { return v && v[k] != null ? String(v[k]) : m; });
  }
  var whereBusy = false;
  function num5(v) {
    var s = Math.abs(v).toFixed(5);
    return lang() === "en" ? s : s.replace(".", ",");
  }
  function latText(v) { return num5(v) + "° " + (v >= 0 ? "N" : "S"); }
  function lonText(v) { return num5(v) + "° " + (v >= 0 ? "E" : "W"); }
  function dms(v, pos, neg) {
    var a = Math.abs(v), d = Math.floor(a), mf = (a - d) * 60, m = Math.floor(mf), s = Math.round((mf - m) * 600) / 10;
    if (s >= 60) { s = 0; m += 1; }
    if (m >= 60) { m = 0; d += 1; }
    var sx = lang() === "en" ? String(s) : String(s).replace(".", ",");
    return d + "° " + m + "′ " + sx + "″ " + (v >= 0 ? pos : neg);
  }
  function whereHtml(t) {
    if (whereBusy) return '<p class="lt-where-wait">' + esc(t.whereWait) + "</p>";
    if (!whereFix) return "";
    if (whereFix.err) return '<p class="lt-where-err">' + esc(whereFix.err) + "</p>";
    var f = whereFix;
    var time = "";
    try { time = new Date(f.at).toLocaleTimeString(lang() === "ee" ? "et" : lang(), { hour: "2-digit", minute: "2-digit" }); } catch (e) { time = ""; }
    return '<div class="lt-where-nums">' +
        '<p class="lt-where-row"><span class="lt-where-k">' + esc(t.whereLat) + '</span><span class="lt-where-v" data-where-lat>' + esc(latText(f.lat)) + "</span></p>" +
        '<p class="lt-where-row"><span class="lt-where-k">' + esc(t.whereLon) + '</span><span class="lt-where-v" data-where-lon>' + esc(lonText(f.lon)) + "</span></p>" +
      "</div>" +
      '<p class="lt-where-dms">' + esc(dms(f.lat, "N", "S") + " · " + dms(f.lon, "E", "W")) + "</p>" +
      '<p class="lt-where-acc">' + esc(fillT(t.whereAcc, { m: Math.round(f.acc), time: time })) + "</p>" +
      '<p class="lt-where-say">' + esc(fillT(t.whereSay, { lat: latText(f.lat), lon: lonText(f.lon) })) + "</p>" +
      '<button type="button" class="lt-small" data-where="copy">' + esc(t.whereCopy) + "</button>";
  }
  function paintWhere(t) {
    var out = doc.querySelector('.window[data-app="lantern"] .lt-where-out');
    if (out) out.innerHTML = whereHtml(t);
    var go = doc.querySelector('.window[data-app="lantern"] [data-where="go"]');
    if (go) go.textContent = whereFix && !whereFix.err ? t.whereAgain : t.whereGo;
    var cp = doc.querySelector('.window[data-app="lantern"] [data-where="copy"]');
    if (cp) cp.addEventListener("click", function () { copyWhere(cp, t); });
  }
  function askWhere(t) {
    if (whereBusy) return;
    var geo = navigator.geolocation;
    if (!geo || typeof geo.getCurrentPosition !== "function") { whereFix = { err: t.whereNone }; paintWhere(t); return; }
    whereBusy = true; paintWhere(t);
    geo.getCurrentPosition(function (p) {
      whereBusy = false;
      whereFix = { lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy || 0, at: p.timestamp || Date.now() };
      paintWhere(t);
    }, function (e) {
      whereBusy = false;
      whereFix = { err: e && e.code === 1 ? t.whereDenied : fillT(t.whereFail, { why: (e && e.message) || "?" }) };
      paintWhere(t);
    }, { enableHighAccuracy: true, timeout: 30000, maximumAge: 0 });
  }
  function copyWhere(btn, t) {
    if (!whereFix || whereFix.err) return;
    var text = fillT(t.whereSay, { lat: latText(whereFix.lat), lon: lonText(whereFix.lon) });
    var done = function () { btn.textContent = t.whereCopied; };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, function () { /* буфер закрыт — числа видны на экране */ }); return; }
    } catch (e) { /* ниже */ }
  }

  /* Подпись прибора. ОТКАТ: у прибора нет своей подписи (ожог, жгут) — общая
     по роду: вверх — «прошло с начала», вниз — «охлаждать до нуля». Своя
     подпись (промывать, держать зажатым) объявляется у карточки в tool.note. */
  function toolNote(c, t) {
    if (c.tool.kind === "beat") return t.beatWhat;
    if (c.tool.kind === "where") return t.whereWhat;
    return (c.tool.note && t[c.tool.note]) || (c.tool.up ? t.clockUp : t.clockDown);
  }

  /* ── «ЧТО СЛУЧИЛОСЬ?» — СЛОВА ЧЕЛОВЕКА ВЕДУТ К БЕДЕ (D-312) ──────────────
     ПОВОД, дословно от основателя 27.09.2026: «на самом верху этого
     приложения должен быть вопрос — что случилось? и у пользователя должна
     быть возможность написать что именно случилось и чтобы система по
     ключевым словам из ответа пользователя подобрала ему необходимый
     раздел из этого приложения».

     КАК ЭТО УСТРОЕНО. У каждой карточки — свои ключевые слова на всех трёх
     языках ОС (поле ask). Человек пишет как умеет; свод НЕ угадывает язык,
     а смотрит слова всех трёх разом: в беде пишут на том языке, какой
     первым пришёл в голову, и с ошибками.
       · «*слово» — сильное (вес 3): само по себе называет беду;
       · «слово» без звезды — слабое (вес 1): лишь намекает;
       · «слово=» — только целиком, отдельным словом («газ», но не «газета»);
       · «два слова» — оборот: ищется как есть внутри написанного;
       · остальное — по началу слова: «кровотеч» находит «кровотечение».
     Баллы складываются; при равных раньше в своде — раньше в ответе: свод
     сложен по срочности, и при сомнении вперёд выходит то, где счёт на
     минуты. По нулю не подсовывается ничего: не нашёл — так и сказано, и
     назван 112.

     ЧЕГО ЗДЕСЬ НЕТ. Ни словаря снаружи, ни сети, ни записи написанного:
     текст живёт в памяти комнаты, пока она открыта, и нигде больше — окно
     закрыли, и его нет. Охраняется tools/lantern-asks-check.mjs. */
  var askText = "";

  function askNorm(s) {
    return String(s == null ? "" : s).toLowerCase()
      .replace(/ё/g, "е").replace(/[\u2019\u2018`\u00b4]/g, "'")
      .replace(/[^\p{L}\p{N}'-]+/gu, " ").replace(/\s+/g, " ").trim();
  }
  /* Русский латиницей («pahnet gazom»): у человека с латинской клавиатурой
     нет времени переключать раскладку. Если в написанном нет ни одной
     кириллической буквы, свод смотрит ещё и на перевод латиницы в
     кириллицу — так, как её обычно набирают. Английские и эстонские слова
     после такого перевода ни на одно ключевое слово не похожи, и лишнего
     не подбирается. */
  var TRANSLIT = { shch: "щ", sch: "щ", sh: "ш", ch: "ч", zh: "ж", kh: "х", ts: "ц", yu: "ю", ju: "ю", ya: "я", ja: "я", yo: "ё", jo: "ё", ye: "е", je: "е",
    a: "а", b: "б", v: "в", g: "г", d: "д", e: "е", z: "з", i: "и", j: "й", k: "к", l: "л", m: "м", n: "н", o: "о", p: "п", r: "р", s: "с", t: "т", u: "у", f: "ф", h: "х", x: "кс", c: "ц", y: "ы", w: "в", q: "к", "'": "ь" };
  var TRANSLIT_RE = /shch|sch|sh|ch|zh|kh|ts|yu|ju|ya|ja|yo|jo|ye|je|[a-z']/g;
  function askLatin(norm) {
    if (/[\u0400-\u04ff]/.test(norm)) return "";
    /* ОТКАТ: буквы нет в таблице — остаётся как есть; это только чужие
       латинские буквы, которых в русской раскладке не бывает. */
    return askNorm(norm.replace(TRANSLIT_RE, function (m) { return TRANSLIT[m] || m; }));
  }
  function askScore(norm, toks, stems) {
    var sum = 0;
    stems.forEach(function (raw) {
      var st = String(raw), w = 1, exact = false;
      if (st.charAt(0) === "*") { w = 3; st = st.slice(1); }
      if (st.slice(-1) === "=") { exact = true; st = st.slice(0, -1); }
      st = askNorm(st);
      if (!st) return;
      var hit;
      if (exact) hit = toks.indexOf(st) !== -1;
      else if (st.indexOf(" ") !== -1) hit = norm.indexOf(st) !== -1;
      else hit = toks.some(function (tk) { return tk.indexOf(st) === 0; });
      if (hit) sum += w;
    });
    return sum;
  }
  function ask(text) {
    var norm = askNorm(text);
    if (!norm) return [];
    var toks = norm.split(" ");
    var lat = askLatin(norm);
    var latToks = lat ? lat.split(" ") : null;
    var rows = [];
    CARDS.forEach(function (c, i) {
      if (!c.ask) return;
      var sc = 0;
      ["ru", "en", "ee"].forEach(function (l) {
        /* ОТКАТ: слов этого языка у карточки нет — язык пропускается; закон
           требует все три, так что это путь только для сломанной карточки. */
        var stems = c.ask[l] || [];
        sc += askScore(norm, toks, stems);
        if (latToks) sc += askScore(lat, latToks, stems);
      });
      if (sc > 0) rows.push({ id: c.id, score: sc, at: i });
    });
    rows.sort(function (a, b) { return b.score - a.score || a.at - b.at; });
    return rows;
  }
  window.sbLanternAsk = ask;

  function askHitHtml(r, t, L, cls) {
    var c = findCard(r.id);
    if (!c) return "";
    /* ОТКАТ: перевода карточки нет — английский, как и на полке. */
    var body = c[L] || c.en;
    return '<button type="button" class="lt-ask-hit ' + cls + '" data-ask-open="' + esc(c.id) + '">' +
      '<span class="lt-ask-hit-title">' + esc(body.title) + "</span>" +
      '<span class="lt-ask-hit-go">' + esc(t.askOpen) + " →</span>" +
      "</button>";
  }
  function askOutHtml(t, L) {
    if (!askNorm(askText)) return "";
    var rows = ask(askText);
    if (!rows.length) return '<p class="lt-ask-none">' + esc(t.askNone) + "</p>";
    var out = '<p class="lt-ask-cap">' + esc(t.askTop) + "</p>" + askHitHtml(rows[0], t, L, "top");
    if (rows.length > 1) {
      out += '<p class="lt-ask-cap more">' + esc(t.askMore) + "</p>";
      rows.slice(1, 4).forEach(function (r) { out += askHitHtml(r, t, L, "more"); });
    }
    return out;
  }
  /* Вопрос стоит ПЕРВЫМ в окне — выше имени комнаты, выше света, выше
     полки: человек в беде не читает заголовков, он говорит, что случилось. */
  function askHtml(t, L) {
    return '<section class="lt-ask" aria-labelledby="ltAskQ">' +
      '<label class="lt-ask-q" id="ltAskQ" for="ltAsk">' + esc(t.ask) + "</label>" +
      '<form class="lt-ask-row" id="ltAskForm" autocomplete="off">' +
        '<input class="lt-ask-in" id="ltAsk" type="text" name="ask" autocomplete="off" autocorrect="off" autocapitalize="sentences" spellcheck="false" enterkeyhint="search" placeholder="' + esc(t.askPh) + '" value="' + esc(askText) + '">' +
        '<button type="submit" class="lt-ask-go">' + esc(t.askGo) + "</button>" +
      "</form>" +
      '<div class="lt-ask-out" id="ltAskOut" aria-live="polite">' + askOutHtml(t, L) + "</div>" +
      "</section>";
  }

  /* ── ПОЛКА ─────────────────────────────────────────────────────────────── */
  function shelfHtml(t, L) {
    var out = askHtml(t, L) + '<header class="lt-head">' +
      '<div class="lt-head-row">' +
        '<h1 class="lt-title">' + esc(t.title) + "</h1>" +
        '<div class="lt-torch-btns">' +
          '<button type="button" class="lt-tb" data-torch="white">' + esc(t.torch) + "</button>" +
          '<button type="button" class="lt-tb night" data-torch="red">' + esc(t.torchNight) + "</button>" +
        "</div>" +
      "</div>" +
      '<p class="lt-lead">' + esc(t.lead) + "</p>" +
      '<p class="lt-warn">' + esc(t.warn) + "</p>" +
      "</header>";
    GROUPS.forEach(function (g) {
      var mine = CARDS.filter(function (c) { return c.group === g; });
      if (!mine.length) return;
      out += '<h2 class="lt-group">' + esc(t.groups[g]) + "</h2>";
      out += '<div class="lt-cards">';
      mine.forEach(function (c) {
        /* ОТКАТ: перевода на этот язык нет — честно падаем на английский.
           Это объявленный договор перевода, а не подмена. */
        var body = c[L] || c.en;
        var s2 = SOURCES[c.src];
        out += '<article class="lt-card" data-card="' + esc(c.id) + '" tabindex="0" role="button">' +
          '<h3 class="lt-card-title">' + esc(body.title) + "</h3>" +
          '<p class="lt-card-hint">' + esc(t.step) + " 1 " + esc(t.of) + " " + body.steps.length +
            (c.tool ? ' · <span class="lt-has-tool">' + esc(toolNote(c, t)) + "</span>" : "") +
          "</p>" +
          '<p class="lt-src">' + esc(t.source) + ": " +
            '<a href="' + esc(s2.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s2.name) + "</a>" +
            " · " + esc(t.checked) + " " + esc(s2.checked) +
          "</p>" +
          "</article>";
      });
      out += "</div>";
    });
    return out;
  }

  /* ── ОТКРЫТАЯ БЕДА: ОДИН ШАГ ──────────────────────────────────────────── */
  function openHtml(c, t, L) {
    /* ОТКАТ: перевода этой карточки на язык нет — честно падаем на английский.
       Это объявленный договор перевода, а не подмена: неполный язык система
       показывает человеку отдельной меткой в полосе языков. */
    var body = c[L] || c.en;
    var n = body.steps.length;
    var i = Math.max(0, Math.min(stepAt, n - 1));
    var last = i === n - 1;
    var tool = "";
    if (c.tool && c.tool.kind === "beat") {
      tool = '<div class="lt-tool lt-beat" data-tool="beat">' +
        '<div class="lt-pulse" id="ltPulse"><span>' + c.tool.bpm + "</span></div>" +
        '<button type="button" class="lt-big" data-beat="toggle">' + esc(t.beatStart) + "</button>" +
        '<p class="lt-tool-note">' + esc(t.beatWhat) + "</p>" +
        "</div>";
    } else if (c.tool && c.tool.kind === "where") {
      tool = '<div class="lt-tool lt-where" data-tool="where">' +
        '<button type="button" class="lt-big" data-where="go">' + esc(whereFix ? t.whereAgain : t.whereGo) + "</button>" +
        '<div class="lt-where-out" role="status" aria-live="polite">' + whereHtml(t) + "</div>" +
        '<p class="lt-tool-note">' + esc(t.whereNote) + "</p>" +
        "</div>";
    } else if (c.tool && c.tool.kind === "clock") {
      var startAt = c.tool.up ? 0 : c.tool.seconds;
      tool = '<div class="lt-tool lt-clock" data-tool="clock" data-up="' + (c.tool.up ? "1" : "0") +
             '" data-seconds="' + (c.tool.seconds || 0) + '">' +
        '<div class="lt-time" id="ltTime">' + mmss(startAt) + "</div>" +
        '<div class="lt-clock-btns">' +
          '<button type="button" class="lt-big" data-clock="toggle">' + esc(t.clockStart) + "</button>" +
          '<button type="button" class="lt-small" data-clock="reset">' + esc(t.clockReset) + "</button>" +
        "</div>" +
        '<p class="lt-tool-note">' + esc(toolNote(c, t)) + "</p>" +
        "</div>";
    }
    return '<div class="lt-open" data-open="' + esc(c.id) + '">' +
      '<div class="lt-top">' +
        '<button type="button" class="lt-back" data-back="1">← ' + esc(t.back) + "</button>" +
        '<span class="lt-count">' + esc(t.step) + " " + (i + 1) + " " + esc(t.of) + " " + n + "</span>" +
      "</div>" +
      '<h2 class="lt-open-title">' + esc(body.title) + "</h2>" +
      '<p class="lt-step" id="ltStep">' + esc(body.steps[i]) + "</p>" +
      tool +
      '<div class="lt-nav">' +
        (i > 0 ? '<button type="button" class="lt-small" data-step="prev">← ' + esc(t.back) + "</button>" : '<span></span>') +
        '<button type="button" class="lt-big next" data-step="next">' + esc(last ? t.done : t.next) + " →</button>" +
      "</div>" +
      '<p class="lt-tap">' + esc(t.tapNext) + "</p>" +
      "</div>";
  }

  function render(win) {
    var host = (win && win.el) ? win.el.querySelector(".window-body") : win;
    if (!host) return;
    var L = lang();
    /* ОТКАТ: перевода на этот язык нет — честно падаем на английский.
       Это объявленный договор перевода, а не подмена. */
    var t = UI[L] || UI.en;
    stopTools();

    var openCard = openId ? findCard(openId) : null;
    /* Полка рисуется ВСЕГДА — и когда беда открыта. Так закон видит состав
       свода, а человек, закрыв беду, оказывается там же, где был. */
    var out = '<div class="lt-wrap' + (openCard ? " is-open" : "") + '">' +
      shelfHtml(t, L) + (openCard ? openHtml(openCard, t, L) : "") +
      "</div>";

    var keep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
    host.innerHTML = out;
    if (keep) { try { keep(); } catch (e) { /* ignore */ } }
    wire(host, win, t);
  }

  function wire(host, win, t) {
    var wrap = host.querySelector(".lt-wrap");
    if (!wrap) return;

    /* «Что случилось?» — подбор идёт живьём, с каждой буквой; Enter или
       «Найти» открывают первое подобранное. Перерисовывается ТОЛЬКО ответ
       под полем — поле и рука на нём остаются на месте. */
    var askIn = host.querySelector("#ltAsk");
    var askOut = host.querySelector("#ltAskOut");
    var askForm = host.querySelector("#ltAskForm");
    if (askIn && askOut && askForm) {
      var L0 = lang();
      var openHit = function (id) { openId = id; stepAt = 0; render(win); };
      var wireHits = function () {
        askOut.querySelectorAll("[data-ask-open]").forEach(function (b) {
          b.addEventListener("click", function (ev) { ev.stopPropagation(); openHit(b.getAttribute("data-ask-open")); });
        });
      };
      var paintAsk = function () { askOut.innerHTML = askOutHtml(t, L0); wireHits(); };
      askIn.addEventListener("input", function () { askText = askIn.value; paintAsk(); });
      askIn.addEventListener("keydown", function (ev) {
        if (ev.key === "Escape" && askIn.value) { ev.preventDefault(); askIn.value = ""; askText = ""; paintAsk(); }
      });
      askForm.addEventListener("submit", function (ev) {
        ev.preventDefault();
        askText = askIn.value; paintAsk();
        var first = askOut.querySelector("[data-ask-open]");
        if (first) openHit(first.getAttribute("data-ask-open"));
        /* ничего не подобрано — ответ уже на экране: «не нашёл», 112, полка */
      });
      wireHits();
    }

    /* Открыть беду */
    host.querySelectorAll(".lt-card").forEach(function (el) {
      var go = function () { openId = el.getAttribute("data-card"); stepAt = 0; render(win); };
      el.addEventListener("click", go);
      el.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); go(); }
      });
    });

    var back = host.querySelector("[data-back]");
    if (back) back.addEventListener("click", function () { openId = null; stepAt = 0; render(win); });

    var openEl = host.querySelector(".lt-open");
    if (openEl) {
      var card = findCard(openId);
      var L = lang();
      /* ОТКАТ: перевода на этот язык нет — честно падаем на английский. */
      var body = card ? (card[L] || card.en) : null;
      var total = body ? body.steps.length : 1;

      var step = function (d) {
        if (d > 0 && stepAt >= total - 1) { openId = null; stepAt = 0; render(win); return; }
        stepAt = Math.max(0, Math.min(total - 1, stepAt + d));
        render(win);
      };
      openEl.querySelectorAll("[data-step]").forEach(function (b) {
        b.addEventListener("click", function (ev) {
          ev.stopPropagation();
          step(b.getAttribute("data-step") === "next" ? 1 : -1);
        });
      });
      /* Нажатие КУДА УГОДНО ведёт дальше — кроме приборов и ссылок: там у
         нажатия своё дело, и отнимать его было бы обманом. */
      openEl.addEventListener("click", function (ev) {
        if (ev.target.closest(".lt-tool, a, button")) return;
        step(1);
      });

      var pulse = openEl.querySelector("#ltPulse");
      var beatBtn = openEl.querySelector("[data-beat]");
      if (beatBtn && card && card.tool) {
        beatBtn.addEventListener("click", function () {
          if (beat && beat.timer) {
            clearInterval(beat.timer); beat = null;
            beatBtn.textContent = t.beatStart;
            openEl.classList.remove("beating");
            return;
          }
          var ms = 60000 / card.tool.bpm;
          click();
          if (pulse && !calm()) { pulse.classList.remove("hit"); void pulse.offsetWidth; pulse.classList.add("hit"); }
          beat = { timer: setInterval(function () {
            click();
            if (pulse && !calm()) { pulse.classList.remove("hit"); void pulse.offsetWidth; pulse.classList.add("hit"); }
          }, ms) };
          beatBtn.textContent = t.beatStop;
          openEl.classList.add("beating");
        });
      }

      var whereBtn = openEl.querySelector("[data-where='go']");
      if (whereBtn) whereBtn.addEventListener("click", function () { askWhere(t); });
      var whereCopy = openEl.querySelector("[data-where='copy']");
      if (whereCopy) whereCopy.addEventListener("click", function () { copyWhere(whereCopy, t); });

      var clockEl = openEl.querySelector("[data-tool='clock']");
      if (clockEl) {
        var up = clockEl.getAttribute("data-up") === "1";
        var full = parseInt(clockEl.getAttribute("data-seconds"), 10) || 0;
        var face = openEl.querySelector("#ltTime");
        var cb = openEl.querySelector("[data-clock='toggle']");
        var rb = openEl.querySelector("[data-clock='reset']");
        var left = up ? 0 : full;
        var paint = function () {
          if (face) face.textContent = mmss(left);
          if (!up && left <= 0) { clockEl.classList.add("done"); }
        };
        if (cb) cb.addEventListener("click", function () {
          if (clock && clock.timer) {
            clearInterval(clock.timer); clock = null; cb.textContent = t.clockStart; return;
          }
          clock = { timer: setInterval(function () {
            left = up ? left + 1 : Math.max(0, left - 1);
            paint();
            if (!up && left === 0) { clearInterval(clock.timer); clock = null; cb.textContent = t.clockStart; click(); }
          }, 1000) };
          cb.textContent = t.clockStop;
        });
        if (rb) rb.addEventListener("click", function () {
          if (clock && clock.timer) { clearInterval(clock.timer); clock = null; }
          left = up ? 0 : full;
          clockEl.classList.remove("done");
          if (cb) cb.textContent = t.clockStart;
          paint();
        });
        paint();
      }
    }

    /* ── СВЕТ ─────────────────────────────────────────────────────────────
       Фонарь так называется. Белый — чтобы видеть; красный — чтобы видеть и
       НЕ ослепнуть: привыкшие к темноте глаза красный свет не сбивает. */
    host.querySelectorAll("[data-torch]").forEach(function (b) {
      b.addEventListener("click", function (ev) {
        ev.stopPropagation();
        torchOn(b.getAttribute("data-torch") === "red" ? "night" : "white", b, t);
      });
    });
  }

  /* ── СВЕТ ПОВЕРХ ВСЕЙ СИСТЕМЫ, ЖИВОЙ, С ОДНОЙ КНОПКОЙ (D-281) ─────────────
     ПОВОД, дословно от основателя 24.09.2026, со снимками: «свет и ночной
     свет нужно сделать более красиво, гениально и желательно с тем же
     анимационным фоном рабочего стола и ничего лишнего быть не должно, кроме
     отключения, а то сейчас это выглядит как какой-то дизайнерский баг...».
     Было: плоская плита ВНУТРИ окна — а полоса системы и док лежат выше
     окна и стояли поверх света; подсказку внизу закрывал док.
     Стало:
       · Свет — отдельный слой на весь экран поверх ВСЕЙ системы, а где
         браузер позволяет — и поверх самого браузера (полный экран).
       · Свет — это обои стола: то же поле (sbField.mirror) в той же фазе.
         Белый — поле, вывернутое в свет: по яркой плите медленно идут
         тёплые тени тех же лент. Ночной — те же ленты тёмно-красным, без
         синего: читающая головка поля синяя, в ночном её нет.
       · Одна кнопка — «Погасить». Касание по свету его не гасит: фонарь
         держат в руке, палец лежит на экране. Escape гасит.
       · Пока горит — экран не гаснет сам (Wake Lock), погас — отпущен.
       · Свет раскрывается кругом из той кнопки, которой его зажгли.
     Слой создаётся при включении и удаляется при выключении: ненужного
     узла в документе не остаётся. Охраняется tools/lantern-light-check.mjs. */
  var LIGHT = {
    /* Белый: плита белая, поле накладывается разностью. Палитра нарочно
       тусклая и холодная — разность с белым даёт тёплые тени лент, и
       средняя яркость остаётся почти белой: фонарь обязан светить. */
    white: { base: "#ffffff", blend: "difference", noHead: false,
      palette: [[4.6, 7.4, 13], [2.9, 4.9, 9], [6.2, 9, 15.6]] },
    /* Ночной: плита тёмно-красная, ленты прибавляют красный. Ни в одной
       строке палитры нет синего, и головки нет. */
    night: { base: "#560000", blend: "lighter", noHead: true,
      palette: [[118, 6, 0], [70, 2, 0], [150, 12, 0]] }
  };
  var torch = null;
  function reducedNow() {
    try {
      if (window.sbReducedMotion && window.sbReducedMotion()) return true;
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) { return false; }
  }
  function torchOn(kind, from, t) {
    torchOff();
    /* ОТКАТ: неизвестный род света — белый: фонарь обязан светить, а не
       промолчать. Родов два, и оба зовутся из этого же файла. */
    var cfg = LIGHT[kind] || LIGHT.white;
    var el = document.createElement("div");
    el.id = "sbTorch";
    el.className = "sb-torch " + kind;
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-label", kind === "night" ? t.torchNight : t.torch);
    el.innerHTML = '<canvas class="sb-torch-field" aria-hidden="true"></canvas>' +
      '<button type="button" class="sb-torch-off" data-torch-off>' + esc(t.torchOff) + "</button>";
    /* Круг раскрытия — из центра нажатой кнопки. */
    try {
      var r = from.getBoundingClientRect();
      el.style.setProperty("--ox", Math.round(r.left + r.width / 2) + "px");
      el.style.setProperty("--oy", Math.round(r.top + r.height / 2) + "px");
    } catch (e) { /* без точки — из середины */ }
    document.body.appendChild(el);
    var still = reducedNow() || document.documentElement.classList.contains("sb-turbo");
    var field = window.sbField && window.sbField.mirror ? window.sbField.mirror(el.querySelector("canvas"), cfg) : null;
    if (field) field.start(still);
    var state = { el: el, field: field, lock: null, fs: false, kind: kind };
    torch = state;
    /* Полный экран — только если система ещё не в нём: выходить потом
       будем только из того, во что вошли сами. */
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      try {
        var p = document.documentElement.requestFullscreen({ navigationUI: "hide" });
        state.fs = true;
        if (p && p.catch) p.catch(function () { state.fs = false; });
      } catch (e) { state.fs = false; }
    }
    if (navigator.wakeLock && navigator.wakeLock.request) {
      navigator.wakeLock.request("screen").then(function (lock) {
        if (torch !== state) { lock.release(); return; }
        state.lock = lock;
      }, function () { /* устройство не держит экран — свет всё равно горит */ });
    }
    el.querySelector("[data-torch-off]").addEventListener("click", function (ev) { ev.stopPropagation(); torchOff(); });
    requestAnimationFrame(function () { el.classList.add("on"); });
  }
  function torchOff() {
    var s = torch;
    if (!s) return;
    torch = null;
    if (s.field) s.field.stop();
    if (s.lock) { try { s.lock.release(); } catch (e) { /* уже отпущен */ } }
    if (s.fs && document.exitFullscreen) { try { var q = document.exitFullscreen(); if (q && q.catch) q.catch(function () { /* уже вышли */ }); } catch (e) { /* уже вышли */ } }
    if (s.el && s.el.parentNode) s.el.parentNode.removeChild(s.el);
  }
  document.addEventListener("keydown", function (ev) {
    if (torch && ev.key === "Escape") { ev.preventDefault(); torchOff(); }
  });
  /* Вкладку спрятали — браузер сам отпускает Wake Lock; вернулись со
     светом — берём снова. */
  document.addEventListener("visibilitychange", function () {
    if (!torch || document.visibilityState !== "visible" || !navigator.wakeLock) return;
    var s = torch;
    navigator.wakeLock.request("screen").then(function (lock) { if (torch === s) s.lock = lock; else lock.release(); }, function () { /* не держит */ });
  });
  window.sbTorch = { off: torchOff, on: function () { return !!torch; } };

  /* Окно закрыли — написанное забыто: оно жило только ради этого окна. */
  if (window.sbBus && window.sbBus.on) {
    window.sbBus.on("window:closed", function (e) { if (e && e.id === "lantern") askText = ""; });
  }

  window.sbLanternCards = function () { return CARDS.slice(); };
  window.sbLanternSources = function () { return SOURCES; };

  if (typeof window.registerApp === "function") {
    window.registerApp("lantern", {
      /* МЕСТО ДЛЯ ЭСТАФЕТЫ (D-290): какая беда открыта и на каком шаге.
         Тот, кто ушёл посреди шагов, возвращается на тот же шаг. */
      where: function () {
        var win = typeof window.getOpenWindow === "function" ? window.getOpenWindow("lantern") : null;
        return win && openId ? { card: openId, step: stepAt } : null;
      },
      resume: function (win, place) {
        if (!win || !place || !findCard(place.card)) return false;
        openId = place.card;
        stepAt = Math.max(0, Number(place.step) || 0);
        render(win);
        return true;
      },
      recall: function (place) {
        var c = place && findCard(place.card);
        if (!c) return null;
        var L = lang();
        /* ОТКАТ: перевода карточки нет — английский, как и в самой комнате. */
        var body = c[L] || c.en;
        /* ОТКАТ: слов комнаты на этом языке нет — английские. */
        var t = UI[L] || UI.en;
        var n = body.steps.length, i = Math.max(0, Math.min(Number(place.step) || 0, n - 1));
        return { name: body.title + ", " + t.step.toLowerCase() + " " + (i + 1) + " " + t.of + " " + n };
      },
      title: UI.en.title,
      label: UI.en.label,
      i18n: {
        ru: { title: UI.ru.title, label: UI.ru.label },
        ee: { title: UI.ee.title, label: UI.ee.label }
      },
      color: "linear-gradient(160deg,#f0b04a 0%,#d2762c 55%,#7a3c12 100%)",
      icon: ICON,
      size: { w: 720, h: 700 },
      /* Свод переводится вместе с системой: смена языка перерисовывает окно. */
      retranslate: true,
      render: render
    });
  }
})();
