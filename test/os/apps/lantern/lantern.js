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
    }
  };

  var UI = {
    en: {
      title: "Lantern", label: "Lantern",
      lead: "What is worth knowing exactly when there is no network. All of it lives on this device: no request goes out, and none has to.",
      warn: "This is a reference, not medicine, and it does not replace the emergency number. There is not a single medicine dose here, and there never will be. If you can call — call first, then read.",
      groups: { now: "When it is happening", numbers: "Numbers", dark: "When the lights go out", words: "Ten sentences" },
      source: "Source", checked: "checked"
    },
    ru: {
      title: "Фонарь", label: "Фонарь",
      lead: "То, что стоит знать именно тогда, когда сети нет. Всё это лежит на устройстве: наружу не уходит ни одного запроса, и не должен.",
      warn: "Это справка, а не медицина, и она не заменяет экстренный номер. Здесь нет ни одной дозировки лекарства и не будет. Если можете позвонить — сперва звоните, потом читайте.",
      groups: { now: "Когда это происходит", numbers: "Номера", dark: "Когда погас свет", words: "Десять фраз" },
      source: "Источник", checked: "сверено"
    },
    ee: {
      title: "Latern", label: "Latern",
      lead: "See, mida tasub teada just siis, kui võrku pole. Kõik see on selles seadmes: ükski päring ei lähe välja ega peagi minema.",
      warn: "See on teatmik, mitte meditsiin, ega asenda hädaabinumbrit. Siin ei ole ühtegi ravimiannust ega tule kunagi. Kui saad helistada — helista enne, loe pärast.",
      groups: { now: "Kui see juhtub", numbers: "Numbrid", dark: "Kui valgus kustub", words: "Kümme lauset" },
      source: "Allikas", checked: "kontrollitud"
    }
  };

  /* ── КАРТОЧКИ. Порядок — по тому, сколько у человека времени: сперва то,
     где счёт на минуты, потом номера, потом долгие беды. ────────────────── */
  var CARDS = [
    {
      id: "cpr", group: "now", src: "erc",
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
      id: "choke", group: "now", src: "erc",
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
      id: "bleed", group: "now", src: "common",
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
      id: "stroke", group: "now", src: "common",
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
      id: "anaph", group: "now", src: "common",
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
      id: "burn", group: "now", src: "burn",
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
      id: "cold", group: "now", src: "common",
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
      id: "fit", group: "now", src: "common",
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
      id: "112", group: "numbers", src: "eu112",
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
      id: "dark", group: "dark", src: "valmis",
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
      id: "words", group: "words", src: "eu112",
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
    }
  ];

  var GROUPS = ["now", "numbers", "dark", "words"];

  /* Оболочка передаёт ОКНО, а не место под содержимое: место приложение
     находит само (тот же договор, что у всех прочих). Первый прогон вернул
     пустое окно с верным заголовком — ровно потому, что здесь стоял host. */
  function render(win) {
    var host = (win && win.el) ? win.el.querySelector(".window-body") : win;
    if (!host) return;
    var L = lang();
    var t = UI[L] || UI.en;
    var out = '<div class="lt-wrap">';
    out += '<header class="lt-head">' +
      '<h1 class="lt-title">' + esc(t.title) + "</h1>" +
      '<p class="lt-lead">' + esc(t.lead) + "</p>" +
      '<p class="lt-warn">' + esc(t.warn) + "</p>" +
      "</header>";

    GROUPS.forEach(function (g) {
      var mine = CARDS.filter(function (c) { return c.group === g; });
      if (!mine.length) return;
      out += '<h2 class="lt-group">' + esc(t.groups[g]) + "</h2>";
      out += '<div class="lt-cards">';
      mine.forEach(function (c) {
        var body = c[L] || c.en;
        var s = SOURCES[c.src];
        out += '<article class="lt-card" data-card="' + esc(c.id) + '">' +
          '<h3 class="lt-card-title">' + esc(body.title) + "</h3>" +
          "<ol class=\"lt-steps\">" +
          body.steps.map(function (line) { return "<li>" + esc(line) + "</li>"; }).join("") +
          "</ol>" +
          '<p class="lt-src">' + esc(t.source) + ": " +
            '<a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.name) + "</a>" +
            " · " + esc(t.checked) + " " + esc(s.checked) +
          "</p>" +
          "</article>";
      });
      out += "</div>";
    });
    out += "</div>";
    /* Прокрутка человека переживает перерисовку — средство оболочки, общее для
       всех приложений (D-099). Снимок берётся ВПЛОТНУЮ к подмене корпуса: между
       снимком и подменой ничего не должно случиться, иначе он о другом. */
    var keep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
    host.innerHTML = out;
    if (keep) { try { keep(); } catch (e) { /* ignore */ } }
  }

  window.sbLanternCards = function () { return CARDS.slice(); };
  window.sbLanternSources = function () { return SOURCES; };

  if (typeof window.registerApp === "function") {
    window.registerApp("lantern", {
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
