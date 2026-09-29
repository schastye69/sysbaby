/* =============================================================================
   КОВЧЕГ — ВСЯ СИСТЕМА В ОДНОМ ФАЙЛЕ, И ОНА САМА ЕГО СОБИРАЕТ.  ·  решение D-314

   ПОВОД, дословно от основателя 27.09.2026: «прошу совет сделать для меня
   очень большой подарок, от которого я буду в полном шоке и самое главное,
   чтобы пользователи sys.baby были в полном шоке. нечто интеллектуальное,
   инновационное, невероятное и грандиозное!»

   ЧТО ЭТО. «Интернета нет, но мы есть» — сказано в Фонаре про ЗНАНИЕ. Ковчег
   говорит то же про САМУ СИСТЕМУ: она умеет сложить себя в один файл. Файл
   открывается двойным щелчком в любом браузере на любом компьютере — с
   флешки, из папки, из письма самому себе: без сети, без сервера, без нас.
   Внутри весь код системы — знак в знак тот, которым она работает сейчас, —
   и, если человек захочет, его вещи, запечатанные словом замка.

   ПОЧЕМУ ЭТО НЕ «СКАЧАТЬ ПРИЛОЖЕНИЕ». Ковчег собирается НЕ на сервере и НЕ
   нами: его собирает страница, которая уже открыта у человека, из тех же
   частей, которыми она сейчас работает. Поэтому он собирается и тогда, когда
   сети уже нет, — из того, что сохранил работник (D-145). Систему нельзя
   отнять, выключив сайт: у каждого, кто однажды собрал ковчег, она есть
   целиком.

   ЧТО ВНУТРИ, И КАК ЭТО ПРОВЕРЯЕТСЯ:
     · каждый файл, который система загружает сама, — внутри знак в знак;
     · ни одной ссылки наружу: ни скрипта, ни стиля, ни манифеста по адресу —
       число таких ссылок комната ПОСЧИТЫВАЕТ по готовому файлу и называет;
     · вес называется числом, измеренным после сборки, байт в байт;
     · вещи — только запечатанными: без замка кнопки «с вещами» нет; в копии
       вещи открываются словом замка и ложатся снова ПОД ЗАМОК, тем же
       словом, — на новом устройстве они не лежат открытыми ни минуты.

   ЧЕГО КОВЧЕГ НЕ УМЕЕТ — сказано в самой комнате, а не спрятано: он снимок
   и сам не обновляется; копия ни с чем не связана; комнатам, которым нужна
   сеть, без сети не легче; на телефонах всё зависит от браузера, и Совет не
   проверял каждый.

   Охраняется tools/ark-check.mjs.
   ========================================================================== */
(function () {
  "use strict";

  var doc = document;
  var ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M3.2 13.4h17.6l-2.1 4.3a2.2 2.2 0 0 1-2 1.3H7.3a2.2 2.2 0 0 1-2-1.3z"/>' +
    '<path d="M7.2 13.4V9.2h9.6v4.2"/><path d="M10.2 9.2V6.6h3.6v2.6"/>' +
    '<path d="M2.6 21.2c1.3 0 1.3-.8 2.6-.8s1.3.8 2.6.8 1.3-.8 2.6-.8 1.3.8 2.6.8 1.3-.8 2.6-.8 1.3.8 2.6.8 1.3-.8 2.6-.8"/></svg>';

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function lang() {
    var l = window.sbLang ? window.sbLang() : "en";
    return (l === "ru" || l === "ee" || l === "et") ? (l === "et" ? "ee" : l) : "en";
  }
  function fill(s, v) {
    return String(s).replace(/\{(\w+)\}/g, function (m, k) { return v && v[k] != null ? String(v[k]) : m; });
  }

  var UI = {
    en: {
      title: "Ark", label: "Ark",
      lead: "The whole system in one file. It opens with a double click in any browser on any computer: no internet, no server, no us. It is assembled right here, on your device — and without a network too.",
      whyQ: "Why, if sys.baby already works without a network?",
      why: [
        "Offline, the site works only where it was already opened: in this browser, on this device. The ark is a file: you can carry it to a computer that has never seen sys.baby — even one with no internet at all.",
        "The browser's copy of the site can be erased: by the “Leave now” button, by clearing the browser, or by the browser itself when it runs short of space. After that, sys.baby will not open on that device without a network. The ark stays where you put it: on a USB stick, in the cloud, in your mail.",
        "The site lives as long as its address and hosting live. The ark is a snapshot of this build: it opens the same way a year from now, even if sys.baby changes or disappears.",
        "With your things, it is a move without a server: notes, letters and keys travel inside the file, sealed with the lock's word."
      ],
      whyNot: "If you work from one device every day and have a network, you do not need the ark on those days. It is insurance, and a way to move.",
      buildH: "A clean ark",
      buildP: "Every room, the Lantern, the Lock, the Keys — the whole system as it is right now. None of your things are in it: you can give it to anyone.",
      buildGo: "Build the ark",
      cargoH: "With your things",
      cargoP: "The same — plus your notes, letters and keys inside, sealed with the lock's word. Without the word the file is just the system: your things cannot be read.",
      cargoGo: "Build with my things",
      cargoNoLock: "Things travel only sealed, and the seal is your lock. Without a lock this button stays off.",
      cargoSecond: "Your lock has a second key (a file or a device key). A device key is bound to the site's address, and the ark file has no address — such things do not travel in an ark. Remove the second key to build one.",
      working: "Building… {n} of {total}",
      doneTitle: "The ark is built",
      done: "{name} · {size} · parts inside: {files} · links outside: {outside}.",
      doneCargo: "Your things inside are sealed with the lock's word.",
      doneWhere: "The file is where your browser puts downloads. Put it on a USB stick, in a cloud, or send it to yourself.",
      share: "Send the file",
      errStale: "The saved copy of the system is older than the running one. Open sys.baby with a network, let it update, and build again.",
      errFetch: "Could not build: a part of the system was not found ({what}). If there is no network, open the system with a network once — after that the ark builds without one.",
      errSeal: "Could not seal your things: the lock is shut or did not answer.",
      errSave: "The browser did not let the file be saved.",
      boardH: "On board",
      limitsH: "What the ark cannot do",
      limits: [
        "It is a snapshot of this build ({build}) and does not update itself. A new ark is built here, on sys.baby.",
        "Rooms that need a network — letters, conversations, the browser, the showcase — are no better off in an ark without one than here.",
        "The copy is connected to nothing: what is written in it stays in it. To bring it back here, use the export in Settings.",
        "Reliable on a computer: double click, any browser. On a phone it depends on the browser and the system — the Council has not checked every one: open it once and see.",
        "Things travel only under the lock. If the word is forgotten, they cannot be taken out of the ark — just as here."
      ],
      copyH: "This is an ark",
      copy: "A copy of sys.baby {build}, built on {date}. Everything you write here stays in this browser on this computer — nothing goes out.",
      cargoIn: "Sealed things travel in this file. Enter the lock's word and they will settle here, under the same lock.",
      word: "The lock's word",
      unpack: "Open my things",
      later: "Later",
      unpacking: "Opening… this takes a few seconds: the word is stretched just as in the lock.",
      badWord: "This word does not open the cargo. If the lock had a second key, it does not work in an ark.",
      unpackFail: "The cargo opened, but it could not be put in place: {why}",
      unpacked: "Your things are here (parts: {n}). The lock is the same: it opens with the same word.",
      unpackedLocked: "Your things are here (parts: {n}). They settled under this copy's lock.",
      copyLimits: [
        "A new ark cannot be built here: the copy has no sources — only itself. A new one is built on sys.baby.",
        "Letters, conversations, the browser and the showcase do not work here without a network — as anywhere.",
        "This copy is connected to nothing: what is written stays in it."
      ],
      nf: {
        build: "The build showcase lives on the sys.baby site and is not in the ark: it needs a network. When there is one, open sys.baby.",
        project: "This work lives on the sys.baby site: the ark carries its description, not the work itself. When there is a network, open it there.",
        experimental: "The bench's experiment is a separate file of the site; it is not in the ark."
      },
      mb: "MB"
    },
    ru: {
      title: "Ковчег", label: "Ковчег",
      lead: "Вся система — в одном файле. Он открывается двойным щелчком в любом браузере на любом компьютере: без интернета, без сервера, без нас. Собирается прямо здесь, на вашем устройстве, — и без сети тоже.",
      whyQ: "Зачем, если sys.baby и так работает без сети?",
      why: [
        "Без сети сайт работает только там, где его уже открывали: в этом браузере, на этом устройстве. Ковчег — файл: его можно унести на компьютер, который sys.baby не видел ни разу, — даже если там нет интернета вовсе.",
        "Копия сайта в браузере стирается: кнопкой «Уйти сейчас», уборкой браузера или им самим, когда ему мало места. После этого без сети sys.baby на этом устройстве не откроется. Ковчег лежит там, куда вы его положили: на флешке, в облаке, в почте.",
        "Сайт живёт, пока живы его адрес и хостинг. Ковчег — снимок этой сборки: он откроется таким же через год, даже если sys.baby изменится или исчезнет.",
        "С вещами — это переезд без сервера: записи, письма и ключи едут внутри файла, запечатанные словом замка."
      ],
      whyNot: "Если вы каждый день работаете с одного устройства и сеть есть, ковчег вам в эти дни не нужен. Он — страховка и способ переезда.",
      buildH: "Чистый ковчег",
      buildP: "Все комнаты, Фонарь, Замок, Ключи — вся система, как она есть сейчас. Ваших вещей в нём нет: его можно отдать кому угодно.",
      buildGo: "Собрать ковчег",
      cargoH: "С вашими вещами",
      cargoP: "То же — и ваши записи, письма, ключи внутри, запечатанные словом замка. Без слова файл — просто система: вещи в нём не читаются.",
      cargoGo: "Собрать с вещами",
      cargoNoLock: "Вещи едут только запечатанными, а печать — это ваш замок. Без замка эта кнопка не работает.",
      cargoSecond: "У замка есть второй ключ (файл или ключ устройства). Ключ устройства привязан к адресу сайта, а у файла ковчега адреса нет — такие вещи в ковчег не едут. Снимите второй ключ, чтобы собрать.",
      working: "Собираю… {n} из {total}",
      doneTitle: "Ковчег собран",
      done: "{name} · {size} · частей внутри: {files} · ссылок наружу: {outside}.",
      doneCargo: "Ваши вещи внутри запечатаны словом замка.",
      doneWhere: "Файл лежит там, куда браузер кладёт загрузки. Положите его на флешку, в облако или отправьте себе.",
      share: "Отправить файл",
      errStale: "Сохранённая копия системы старее запущенной. Откройте sys.baby с сетью, дайте ей обновиться — и соберите снова.",
      errFetch: "Не удалось собрать: часть системы не нашлась ({what}). Если сети нет — откройте систему с сетью один раз, и дальше ковчег соберётся и без неё.",
      errSeal: "Не удалось запечатать вещи: замок закрыт или не ответил.",
      errSave: "Браузер не дал сохранить файл.",
      boardH: "На борту",
      limitsH: "Чего ковчег не умеет",
      limits: [
        "Он — снимок этой сборки ({build}) и сам не обновляется. Новый ковчег собирается здесь, на sys.baby.",
        "Комнатам, которым нужна сеть, — письмам, переписке, браузеру, витрине — в ковчеге без сети не легче, чем здесь.",
        "Копия ни с чем не связана: что написано в ней, остаётся в ней. Вернуть сюда — выгрузкой в Настройках.",
        "Надёжно — на компьютере: двойной щелчок, любой браузер. На телефоне всё зависит от браузера и системы — Совет не проверял каждый: откройте один раз и посмотрите.",
        "Вещи едут только под замком. Если слово забыто, из ковчега их не достать — как и здесь."
      ],
      copyH: "Это ковчег",
      copy: "Копия sys.baby {build}, собранная {date}. Всё, что вы здесь пишете, остаётся в этом браузере на этом компьютере — наружу не уходит ничего.",
      cargoIn: "В этом файле едут запечатанные вещи. Введите слово замка — и они лягут сюда, под тот же замок.",
      word: "Слово замка",
      unpack: "Открыть вещи",
      later: "Потом",
      unpacking: "Открываю… это займёт несколько секунд: слово растягивается так же, как в замке.",
      badWord: "Это слово груз не открывает. Если у замка был второй ключ — в ковчеге он не работает.",
      unpackFail: "Груз открылся, но разложить его не вышло: {why}",
      unpacked: "Вещи на месте (частей: {n}). Замок — тот же: открывается тем же словом.",
      unpackedLocked: "Вещи на месте (частей: {n}). Они легли под замок этой копии.",
      copyLimits: [
        "Новый ковчег здесь не собрать: у копии нет исходников — только она сама. Новый собирается на sys.baby.",
        "Письма, переписка, браузер и витрина здесь без сети не работают — как и везде.",
        "Эта копия ни с чем не связана: написанное остаётся в ней."
      ],
      nf: {
        build: "Витрина build живёт на сайте sys.baby и в ковчег не входит: ей нужна сеть. Когда сеть будет — откройте sys.baby.",
        project: "Эта работа живёт на сайте sys.baby: в ковчеге есть её описание, но не она сама. Когда сеть будет — откройте её там.",
        experimental: "Опыт стенда — отдельный файл сайта, в ковчег он не входит."
      },
      mb: "МБ"
    },
    ee: {
      title: "Laev", label: "Laev",
      lead: "Kogu süsteem ühes failis. See avaneb topeltklõpsuga igas brauseris igas arvutis: ilma internetita, ilma serverita, ilma meieta. See pannakse kokku siinsamas, sinu seadmes — ka ilma võrguta.",
      whyQ: "Milleks, kui sys.baby töötab niigi ilma võrguta?",
      why: [
        "Ilma võrguta töötab sait ainult seal, kus seda on juba avatud: selles brauseris, selles seadmes. Laev on fail: selle saab viia arvutisse, mis pole sys.baby't kunagi näinud — isegi kui seal internetti üldse pole.",
        "Saidi koopia brauseris võib kustuda: nupuga „Lahku kohe“, brauseri puhastamisega või brauseri enda poolt, kui ruumi jääb väheks. Pärast seda ei avane sys.baby selles seadmes ilma võrguta. Laev jääb sinna, kuhu sa selle panid: mälupulgale, pilve, meili.",
        "Sait elab seni, kuni elavad selle aadress ja majutus. Laev on selle versiooni hetktõmmis: see avaneb aasta pärast samamoodi, isegi kui sys.baby muutub või kaob.",
        "Asjadega on see kolimine ilma serverita: märkmed, kirjad ja võtmed sõidavad faili sees, pitseeritud luku sõnaga."
      ],
      whyNot: "Kui töötad iga päev ühest seadmest ja võrk on olemas, pole laeva neil päevadel vaja. See on kindlustus ja viis kolida.",
      buildH: "Puhas laev",
      buildP: "Kõik toad, Latern, Lukk, Võtmed — kogu süsteem sellisena, nagu see praegu on. Sinu asju selles ei ole: seda võib anda kellele tahes.",
      buildGo: "Pane laev kokku",
      cargoH: "Sinu asjadega",
      cargoP: "Sama — ja sinu märkmed, kirjad ja võtmed sees, pitseeritud luku sõnaga. Ilma sõnata on fail lihtsalt süsteem: asju sealt lugeda ei saa.",
      cargoGo: "Pane kokku koos asjadega",
      cargoNoLock: "Asjad sõidavad ainult pitseeritult, ja pitser on sinu lukk. Ilma lukuta see nupp ei tööta.",
      cargoSecond: "Lukul on teine võti (fail või seadme võti). Seadme võti on seotud saidi aadressiga, laeva failil aadressi pole — sellised asjad laevaga ei sõida. Eemalda teine võti, et kokku panna.",
      working: "Panen kokku… {n} / {total}",
      doneTitle: "Laev on kokku pandud",
      done: "{name} · {size} · osi sees: {files} · linke väljapoole: {outside}.",
      doneCargo: "Sinu asjad on sees luku sõnaga pitseeritud.",
      doneWhere: "Fail on seal, kuhu brauser allalaadimised paneb. Pane see mälupulgale, pilve või saada endale.",
      share: "Saada fail",
      errStale: "Süsteemi salvestatud koopia on vanem kui käivitatud. Ava sys.baby võrguga, lase sel uueneda ja pane uuesti kokku.",
      errFetch: "Kokku panna ei õnnestunud: osa süsteemist ei leitud ({what}). Kui võrku pole, ava süsteem korra võrguga — edaspidi paneb laev end kokku ka ilma selleta.",
      errSeal: "Asju ei õnnestunud pitseerida: lukk on suletud või ei vastanud.",
      errSave: "Brauser ei lasknud faili salvestada.",
      boardH: "Pardal",
      limitsH: "Mida laev ei oska",
      limits: [
        "See on selle versiooni ({build}) hetktõmmis ega uuene ise. Uus laev pannakse kokku siin, sys.baby's.",
        "Tubadel, mis vajavad võrku — kirjad, vestlused, brauser, vitriin —, ei ole laevas ilma võrguta kergem kui siin.",
        "Koopia ei ole millegagi seotud: mis sinna kirjutatakse, jääb sinna. Siia tagasi tuua saab Seadete ekspordiga.",
        "Kindel on arvutis: topeltklõps, ükskõik milline brauser. Telefonis sõltub see brauserist ja süsteemist — Nõukogu pole kõiki kontrollinud: ava korra ja vaata.",
        "Asjad sõidavad ainult luku all. Kui sõna on ununenud, ei saa neid laevast kätte — nagu ka siin."
      ],
      copyH: "See on laev",
      copy: "sys.baby {build} koopia, kokku pandud {date}. Kõik, mida siia kirjutad, jääb sellesse brauserisse selles arvutis — midagi ei lähe välja.",
      cargoIn: "Selles failis sõidavad pitseeritud asjad. Sisesta luku sõna ja need asuvad siia, sama luku alla.",
      word: "Luku sõna",
      unpack: "Ava minu asjad",
      later: "Hiljem",
      unpacking: "Avan… see võtab mõne sekundi: sõna venitatakse samamoodi nagu lukus.",
      badWord: "See sõna ei ava lasti. Kui lukul oli teine võti, laevas see ei tööta.",
      unpackFail: "Last avanes, kuid seda ei õnnestunud paigutada: {why}",
      unpacked: "Sinu asjad on kohal (osi: {n}). Lukk on sama: avaneb sama sõnaga.",
      unpackedLocked: "Sinu asjad on kohal (osi: {n}). Need asusid selle koopia luku alla.",
      copyLimits: [
        "Siin uut laeva kokku panna ei saa: koopial pole lähtekoodi — ainult ta ise. Uus pannakse kokku sys.baby's.",
        "Kirjad, vestlused, brauser ja vitriin ei tööta siin ilma võrguta — nagu mujalgi.",
        "See koopia ei ole millegagi seotud: kirjutatu jääb sinna."
      ],
      nf: {
        build: "Vitriin build elab saidil sys.baby ega ole laevas: see vajab võrku. Kui võrk on olemas, ava sys.baby.",
        project: "See töö elab saidil sys.baby: laevas on selle kirjeldus, mitte töö ise. Kui võrk on olemas, ava see seal.",
        experimental: "Katsepingi katse on saidi eraldi fail; laevas seda ei ole."
      },
      mb: "MB"
    }
  };
  function T() {
    /* ОТКАТ: слов комнаты на этом языке нет — английские; языков у системы
       три, и все три здесь есть, так что это путь только для чужого кода. */
    return UI[lang()] || UI.en;
  }

  /* Копия ли это. Метку ставит сборщик ПЕРВЫМ скриптом файла — до всего. */
  var ARK = window.SB_ARK || null;
  var KEY = "sysbaby.ark.v1";
  function box() {
    return window.sbRights
      ? window.sbRights.box("ark")
      : { get: function () { return null; }, set: function () { return false; }, flush: function () {} };
  }

  /* ─────────────────────────── СБОРЩИК ───────────────────────────────────
     Документ берётся ИСХОДНИКОМ (тем, что прислал сервер или сохранил
     работник), а не снимком живого экрана: живой экран уже весь переписан
     окнами. Каждый скрипт и стиль по адресу заменяется им самим. Больше
     ничего в документе не трогается, кроме трёх вещей, названных поимённо:
     метка ковчега первым скриптом, манифест (у файла нет адреса, ставить
     его как приложение некуда) и груз перед концом тела. */
  var TAG_RE = /<script\b[^>]*\bsrc="([^"]+)"[^>]*>\s*<\/script>|<link\b[^>]*>/gi;

  function stampNow() {
    var m = doc.querySelector('meta[name="sysbaby-build"]');
    return m ? m.getAttribute("content") : "";
  }
  function stampOf(html) {
    var m = /<meta\s+name="sysbaby-build"\s+content="([^"]*)"/i.exec(html);
    return m ? m[1] : "";
  }
  /* Образцы собраны из кусков нарочно: этот файл сам ляжет в ковчег, и
     целое «rel=манифест» в его тексте читалось бы как ссылка на манифест. */
  var SHEET_RE = new RegExp('\\brel="' + "style" + 'sheet"', "i");
  var MANIFEST_RE = new RegExp('\\brel="' + "mani" + 'fest"', "i");
  function isSheet(tag) { return SHEET_RE.test(tag); }
  function hrefOf(tag) { var m = /\bhref="([^"]+)"/i.exec(tag); return m ? m[1] : ""; }

  /* Внутри тега скрипта браузер ищет закрывающий тег скрипта и начало
     HTML-комментария — и то и другое оборвало бы код раньше времени.
     Экранирование не меняет смысла ни в строке, ни в выражении, ни в
     комментарии; сейчас таких мест в коде системы нет (и в этом файле их
     нарочно нет: он сам ляжет в ковчег знак в знак), и замена ничего не
     трогает — это защита на будущее. */
  var HTML_COMMENT_RE = new RegExp("<!" + "--", "g");
  function jsSafe(t) { return String(t).replace(/<\/(script)/gi, "<\\/$1").replace(HTML_COMMENT_RE, "<\\!--"); }
  function cssSafe(t) { return String(t).replace(/<\/(style)/gi, "<\\/$1"); }

  function getText(url) {
    return fetch(url, { credentials: "same-origin" }).then(function (r) {
      if (!r.ok) throw new Error(String(r.status));
      return r.text();
    });
  }

  /* Ссылки наружу считаются ПО ГОТОВОМУ ФАЙЛУ: разметка без кода и без
     стилей — на src/href ресурсов; стили — на url(). Код не считается: он
     не ссылка, а поведение, и его строки («<iframe src=…») — не адреса. */
  function outsideRefs(html) {
    var styles = [];
    var markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, function (m, css) { styles.push(css); return ""; });
    var n = 0;
    markup.replace(/<(script|img|iframe|source|audio|video|embed|track)\b[^>]*?\ssrc="([^"]*)"/gi, function (m, tag, v) {
      if (!/^(data:|blob:)/i.test(v)) n++; return m;
    });
    markup.replace(/<link\b[^>]*?\shref="([^"]*)"/gi, function (m, v) {
      if (!/^(data:|#)/i.test(v)) n++; return m;
    });
    var css = styles.join("\n");
    markup.replace(/\sstyle="([^"]*)"/gi, function (m, v) { css += "\n" + v; return m; });
    /* «%23» — это «#», записанный внутри data:-адреса (узор шума у обоев
       ссылается так на свой же фильтр): ссылка внутрь, а не наружу. */
    css.replace(/url\(\s*(['"]?)([^'")]*)\1\s*\)/gi, function (m, q, v) {
      if (!/^(data:|#|%23|blob:)/i.test(v)) n++; return m;
    });
    return n;
  }

  function assemble(cargoText, progress) {
    var docUrl = location.href.split("#")[0].split("?")[0];
    var stamp = stampNow();
    return getText(docUrl).then(function (html) {
      if (!stamp || stampOf(html) !== stamp) { var e = new Error("stale"); e.code = "stale"; throw e; }
      var urls = [];
      html.replace(TAG_RE, function (m, src) {
        var u = src || (isSheet(m) ? hrefOf(m) : "");
        if (u && urls.indexOf(u) === -1) urls.push(u);
        return m;
      });
      var got = {}, done = 0;
      if (progress) progress(0, urls.length);
      return Promise.all(urls.map(function (u) {
        return getText(new URL(u, docUrl).href).then(function (t) {
          got[u] = t; done++;
          if (progress) progress(done, urls.length);
        }, function () { var e = new Error(u); e.code = "fetch"; e.what = u; throw e; });
      })).then(function () {
        var files = 0;
        var out = html.replace(TAG_RE, function (m, src) {
          if (src) { files++; return '<script data-ark-file="' + esc(src) + '">' + jsSafe(got[src]) + "\n<\/script>"; }
          if (isSheet(m)) { var h = hrefOf(m); files++; return '<style data-ark-file="' + esc(h) + '">' + cssSafe(got[h]) + "<\/style>"; }
          /* У файла нет адреса — ставить его приложением некуда. */
          if (MANIFEST_RE.test(m)) return "";
          return m;
        });
        var meta = { v: 1, build: stamp, built: new Date().toISOString(), files: files, cargo: !!cargoText };
        /* Откуда собран — только если это защищённый адрес в сети: туда
           ведут ссылки «Передать» из копии. Адрес стенда или файла в ковчег
           не кладётся — он никому ничего не скажет. */
        if (location.protocol === "https:") meta.from = location.origin + location.pathname;
        var head = "<script>window.SB_ARK=" + JSON.stringify(meta).replace(/</g, "\\u003c") + ";" +
          "window.SB_ARK.self=function(el){try{return URL.createObjectURL(new Blob([el.textContent],{type:\"text/javascript\"}));}catch(e){return \"\";}};<\/script>";
        var cm = /<meta\s+charset=[^>]*>/i.exec(out);
        out = cm ? out.slice(0, cm.index + cm[0].length) + "\n" + head + out.slice(cm.index + cm[0].length) : head + out;
        if (cargoText) {
          var tail = '<script type="application/json" id="sysbaby-cargo">' + String(cargoText).replace(/</g, "\\u003c") + "<\/script>\n";
          var at = out.toLowerCase().lastIndexOf("</body>");
          out = at === -1 ? out + tail : out.slice(0, at) + tail + out.slice(at);
        }
        return { html: out, files: files, stamp: stamp, outside: outsideRefs(out) };
      });
    });
  }

  function fileName(stamp, withCargo) {
    var d = new Date().toISOString().slice(0, 10);
    return "sysbaby-ark-" + stamp + "-" + d + (withCargo ? "-sealed" : "") + ".html";
  }
  function sizeText(bytes, t) {
    var mb = (bytes / 1048576).toFixed(1);
    if (lang() !== "en") mb = mb.replace(".", ",");
    return mb + " " + t.mb;
  }
  function save(name, blob) {
    var url = URL.createObjectURL(blob);
    var a = doc.createElement("a");
    a.href = url; a.download = name; a.rel = "noopener";
    doc.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1500);
  }

  /* ─────────────────────────── СОСТОЯНИЕ КОМНАТЫ ───────────────────────── */
  var busy = null;          /* "build" | "cargo" | "unpack" */
  var progress = "";        /* строка хода сборки */
  var last = null;          /* { name, bytes, files, outside, cargo } — последний собранный */
  var lastFile = null;      /* File для «Отправить» — живёт в памяти, пока открыта вкладка */
  var err = "";             /* ошибка сборки или распаковки */
  var unpacked = null;      /* { n, relocked } */

  function lockState() {
    var V = window.sbVault;
    if (!V || !V.isLocked || !V.isLocked()) return "none";
    try {
      var sk = V.secondKey ? V.secondKey() : null, hw = V.hwState ? V.hwState() : null;
      if ((sk && sk.on) || (hw && hw.on)) return "second";
    } catch (e) { /* не ответил — судим по замку */ }
    return V.isOpen && V.isOpen() ? "open" : "shut";
  }

  function cargoNode() { return doc.getElementById("sysbaby-cargo"); }
  function cargoMeta() {
    var n = cargoNode();
    if (!n) return null;
    try { var o = JSON.parse(n.textContent); return { createdAt: String(o.createdAt || "") }; } catch (e) { return null; }
  }
  function flag() { try { return JSON.parse(box().get(KEY) || "null"); } catch (e) { return null; } }
  function setFlag(state) {
    var c = cargoMeta();
    try { box().set(KEY, JSON.stringify({ cargo: c ? c.createdAt : "", state: state, at: Date.now() })); box().flush(); } catch (e) { /* место не далось — спросим ещё раз, и только */ }
  }
  function cargoPending() {
    var c = cargoMeta();
    if (!c) return false;
    var f = flag();
    return !(f && f.cargo === c.createdAt && (f.state === "unpacked" || f.state === "later"));
  }

  /* ─────────────────────────── ОКНО ────────────────────────────────────── */
  function boardHtml() {
    var ids = window.sbLaunchableApps ? window.sbLaunchableApps() : [];
    if (!ids.length) return "";
    return '<div class="ak-board"><h3 class="ak-sub">' + esc(T().boardH) + '</h3><div class="ak-chips">' +
      ids.map(function (id) {
        var name = window.sbAppTitle ? window.sbAppTitle(id) : id;
        /* Своё имя комнаты, данное человеком, — его данные, а не наш перевод:
           оно помечается, чтобы законы языка его не судили. Узнаётся без
           чужой двери: имя от оболочки не совпало с объявленным переводом. */
        var def = (window.SysBaby && window.SysBaby.apps && window.SysBaby.apps[id]) || {};
        var loc = def.i18n && def.i18n[lang()];
        /* ОТКАТ: перевода у комнаты нет — её английское имя, как у оболочки. */
        var declared = (loc && loc.title) || def.title || id;
        return '<span class="ak-chip"' + (name !== declared ? " data-sb-userdata" : "") + ">" + esc(name) + "</span>";
      }).join("") + "</div></div>";
  }
  function limitsHtml(list) {
    return '<section class="ak-limits"><h3 class="ak-sub">' + esc(T().limitsH) + "</h3><ul>" +
      list.map(function (l) { return "<li>" + esc(fill(l, { build: ARK ? ARK.build : stampNow() })) + "</li>"; }).join("") +
      "</ul></section>";
  }
  function doneHtml(t) {
    if (!last) return "";
    return '<div class="ak-done" role="status" data-bytes="' + last.bytes + '" data-files="' + last.files + '" data-outside="' + last.outside + '">' +
      '<h3 class="ak-done-h">' + esc(t.doneTitle) + "</h3>" +
      '<p class="ak-done-line">' + esc(fill(t.done, { name: last.name, size: sizeText(last.bytes, t), files: last.files, outside: last.outside })) + "</p>" +
      (last.cargo ? '<p class="ak-done-line">' + esc(t.doneCargo) + "</p>" : "") +
      '<p class="ak-done-where">' + esc(t.doneWhere) + "</p>" +
      (lastFile ? '<button type="button" class="ak-btn" data-ark="share">' + esc(t.share) + "</button>" : "") +
      "</div>";
  }

  function servedHtml(t) {
    var ls = lockState();
    var cargoOff = ls !== "open";
    var why = ls === "second" ? t.cargoSecond : (cargoOff ? t.cargoNoLock : "");
    var b = busy === "build" || busy === "cargo";
    return '<header class="ak-head">' +
        '<h1 class="ak-title">' + esc(t.title) + "</h1>" +
        '<p class="ak-lead">' + esc(t.lead) + "</p>" +
      "</header>" +
      /* ЗАЧЕМ, ЕСЛИ САЙТ И ТАК РАБОТАЕТ БЕЗ СЕТИ (D-328). Вопрос основателя
         28.09.2026: «для чего и кому нужен ковчег? сайт ведь и так может
         работать без интернета». Раз спросил он — спросит каждый. Ответ стоит
         до кнопок, свёрнутым: кто знает, зачем пришёл, проходит мимо. */
      '<details class="ak-why"><summary>' + esc(t.whyQ) + "</summary><ul>" +
        t.why.map(function (w) { return "<li>" + esc(w) + "</li>"; }).join("") +
        '</ul><p class="ak-why-not">' + esc(t.whyNot) + "</p></details>" +
      '<div class="ak-cards">' +
        '<section class="ak-card">' +
          '<h2 class="ak-card-h">' + esc(t.buildH) + "</h2>" +
          '<p class="ak-card-p">' + esc(t.buildP) + "</p>" +
          '<button type="button" class="ak-btn primary" data-ark="build"' + (b ? " disabled" : "") + ">" +
            esc(busy === "build" && progress ? progress : t.buildGo) + "</button>" +
          /* Итог встаёт там, куда человек смотрел, нажимая: под своей кнопкой. */
          (last && !last.cargo ? doneHtml(t) : "") +
        "</section>" +
        '<section class="ak-card cargo">' +
          '<h2 class="ak-card-h">' + esc(t.cargoH) + "</h2>" +
          '<p class="ak-card-p">' + esc(t.cargoP) + "</p>" +
          '<button type="button" class="ak-btn" data-ark="cargo"' + (cargoOff || b ? " disabled" : "") + ">" +
            esc(busy === "cargo" && progress ? progress : t.cargoGo) + "</button>" +
          /* Причина — и сразу дорога к замку, одна на всю систему (D-317):
             кнопку отдаёт ядро, нажатие ведёт ядро. */
          (why ? '<p class="ak-cargo-why">' + esc(why) + "</p>" +
            (window.sbLockCallHtml ? window.sbLockCallHtml(ls === "second" ? "open" : "") : "") : "") +
          (last && last.cargo ? doneHtml(t) : "") +
        "</section>" +
      "</div>" +
      (err ? '<p class="ak-err" role="alert">' + esc(err) + "</p>" : "") +
      boardHtml() +
      limitsHtml(t.limits);
  }

  function dayText(iso) {
    var d = String(iso || "").slice(0, 10);
    /* По-русски и по-эстонски дата пишется день-месяц-год; по-английски
       оставлен порядок ISO — он однозначен при любой привычке читателя. */
    return lang() === "en" ? d : d.split("-").reverse().join(".");
  }
  function copyHtml(t) {
    var date = dayText(ARK.built);
    var c = cargoMeta();
    var cargo = "";
    if (c && unpacked) {
      cargo = '<p class="ak-unpacked" role="status">' + esc(fill(unpacked.relocked ? t.unpacked : t.unpackedLocked, { n: unpacked.n })) + "</p>";
    } else if (c && !(flag() && flag().state === "unpacked" && flag().cargo === c.createdAt)) {
      cargo = '<section class="ak-card cargo">' +
        '<p class="ak-card-p">' + esc(t.cargoIn) + "</p>" +
        '<form class="ak-unpack" id="akForm" autocomplete="off">' +
          '<input type="password" id="akWord" class="ak-word" autocomplete="current-password" aria-label="' + esc(t.word) + '" placeholder="' + esc(t.word) + '"' + (busy ? " disabled" : "") + ">" +
          '<button type="submit" class="ak-btn primary" id="akUnpack"' + (busy ? " disabled" : "") + ">" + esc(busy === "unpack" ? t.unpacking : t.unpack) + "</button>" +
          '<button type="button" class="ak-btn ghost" id="akLater"' + (busy ? " disabled" : "") + ">" + esc(t.later) + "</button>" +
        "</form>" +
        '<p class="ak-err" role="alert">' + esc(err) + "</p>" +
      "</section>";
    }
    return '<header class="ak-head">' +
        '<h1 class="ak-title">' + esc(t.title) + "</h1>" +
      "</header>" +
      '<div class="ak-copy"><h2 class="ak-card-h">' + esc(t.copyH) + "</h2>" +
        '<p class="ak-card-p">' + esc(fill(t.copy, { build: ARK.build, date: date })) + "</p></div>" +
      cargo +
      boardHtml() +
      limitsHtml(t.copyLimits);
  }

  function render(win) {
    var host = (win && win.el) ? win.el.querySelector(".window-body") : win;
    if (!host) return;
    var t = T();
    var out = '<div class="ak-wrap">' + (ARK ? copyHtml(t) : servedHtml(t)) + "</div>";
    var keep = window.sbKeepScroll ? window.sbKeepScroll(host) : null;
    host.innerHTML = out;
    if (keep) { try { keep(); } catch (e) { /* ignore */ } }
    wire(host, win, t);
  }
  function rerender() {
    var win = typeof window.getOpenWindow === "function" ? window.getOpenWindow("ark") : null;
    if (win) render(win);
  }

  function build(withCargo) {
    if (busy) return;
    var t = T();
    busy = withCargo ? "cargo" : "build"; err = ""; progress = ""; last = null; lastFile = null;
    rerender();
    var tick = function (n, total) {
      progress = fill(t.working, { n: n, total: total });
      var btn = doc.querySelector('.window[data-app="ark"] [data-ark="' + busy + '"]');
      if (btn) btn.textContent = progress;
    };
    var sealed = withCargo
      ? (window.sbAskPresence ? window.sbAskPresence() : Promise.resolve(true)).then(function (okp) {
          if (!okp) { var e = new Error("presence"); e.code = "presence"; throw e; }
          return window.sbVault.exportText().then(function (r) {
            if (!r || !r.sealed) { var e2 = new Error("seal"); e2.code = "seal"; throw e2; }
            return r.text;
          }, function () { var e3 = new Error("seal"); e3.code = "seal"; throw e3; });
        })
      : Promise.resolve(null);
    sealed.then(function (cargoText) {
      return assemble(cargoText, tick).then(function (r) {
        var name = fileName(r.stamp, !!cargoText);
        var blob = new Blob([r.html], { type: "text/html" });
        try { save(name, blob); } catch (e) { var e4 = new Error("save"); e4.code = "save"; throw e4; }
        last = { name: name, bytes: blob.size, files: r.files, outside: r.outside, cargo: !!cargoText };
        try {
          var f = new File([blob], name, { type: "text/html" });
          lastFile = (navigator.canShare && navigator.canShare({ files: [f] })) ? f : null;
        } catch (e) { lastFile = null; }
      });
    }).then(function () {
      busy = null; progress = ""; rerender();
    }, function (e) {
      busy = null; progress = "";
      var code = e && e.code;
      if (code === "presence") err = "";
      else if (code === "stale") err = t.errStale;
      else if (code === "seal") err = t.errSeal;
      else if (code === "save") err = t.errSave;
      else err = fill(t.errFetch, { what: (e && e.what) || (e && e.message) || "?" });
      rerender();
    });
  }

  /* ── РАЗГРУЗКА В КОПИИ ────────────────────────────────────────────────
     Слово открывает груз той же растяжкой, что замок (sbVault.openExport);
     открытое раскладывается в этот профиль СЛИЯНИЕМ (что было — остаётся,
     что привезли — ложится поверх); машинерию устройства ядро не везёт и не
     кладёт (D-314). Потом — ЗАМОК ТЕМ ЖЕ СЛОВОМ, если в копии его ещё нет,
     и сразу открыть: вещи на новом устройстве не лежат открытыми ни минуты
     дольше, чем идёт растяжка. */
  function unpack(word) {
    var t = T();
    var node = cargoNode();
    if (!node || busy) return;
    busy = "unpack"; err = ""; rerender();
    var V = window.sbVault;
    V.openExport(node.textContent, word).then(function (plain) {
      if (!plain) { busy = null; err = t.badWord; rerender(); return null; }
      var res = window.sbImportProfile ? window.sbImportProfile(plain, { mode: "merge", reload: false }) : null;
      if (!res || !res.ok) { busy = null; err = fill(t.unpackFail, { why: (res && res.error) || "?" }); rerender(); return null; }
      setFlag("unpacked");
      if (V.isLocked()) return { n: res.count, relocked: false };
      return V.lock(word).then(function () { return V.unlock(word); }).then(function (okp) {
        return { n: res.count, relocked: !!okp };
      });
    }).then(function (r) {
      if (!r) return;
      busy = null; unpacked = r; err = "";
      rerender();
    }, function (e) {
      busy = null; err = fill(t.unpackFail, { why: (e && e.message) || "?" }); rerender();
    });
  }

  function wire(host, win, t) {
    host.querySelectorAll("[data-ark]").forEach(function (b) {
      b.addEventListener("click", function () {
        var what = b.getAttribute("data-ark");
        if (what === "build") build(false);
        else if (what === "cargo") build(true);
        else if (what === "share" && lastFile && navigator.share) {
          navigator.share({ files: [lastFile], title: lastFile.name }).then(null, function () { /* человек передумал */ });
        }
      });
    });
    var form = host.querySelector("#akForm");
    if (form) {
      form.addEventListener("submit", function (ev) {
        ev.preventDefault();
        var w = host.querySelector("#akWord");
        var v = w ? w.value : "";
        if (!v) { if (w) w.focus(); return; }
        unpack(v);
      });
      var later = host.querySelector("#akLater");
      if (later) later.addEventListener("click", function () {
        setFlag("later");
        if (typeof window.closeWindow === "function") window.closeWindow("ark"); else rerender();
      });
    }
  }

  /* ── ОКНО БЕЗ РАМКИ В КОПИИ ───────────────────────────────────────────
     Комнаты, которые показывают страницу сайта в рамке (витрина, работы,
     стенд), в ковчеге рамки не рисуют: страницы в файле нет, и пустая рамка
     была бы враньём видом. Слово о том, где эта страница, — здесь, одно для
     всех, на языке человека. */
  function noFrameHtml(what) {
    var t = T();
    /* ОТКАТ: неизвестный род рамки — слово витрины: оно честно для любой
       страницы сайта. Родов три, и все три названы в словаре. */
    var text = t.nf[what] || t.nf.build;
    return '<div class="sb-ark-noframe" role="note"><span class="sb-ark-noframe-i" aria-hidden="true">' + ICON + "</span><p>" + esc(text) + "</p></div>";
  }
  window.sbArkNoFrameHtml = noFrameHtml;
  window.sbArkNoFrame = function (body, what) {
    if (!body) return;
    var keep = window.sbKeepScroll ? window.sbKeepScroll(body) : null;
    body.innerHTML = noFrameHtml(what);
    if (keep) { try { keep(); } catch (e) { /* ignore */ } }
  };

  /* ── В КОПИИ С ГРУЗОМ КОМНАТА ОТКРЫВАЕТСЯ САМА ─────────────────────────
     Человек, открывший файл со своими вещами, не должен искать, куда
     вводить слово. Но не поверх двери: пока идёт знакомство или стоит дверь
     замка, окно не встаёт — оно встанет, когда человек окажется внутри. */
  function offer() {
    if (!ARK || !cargoPending()) return;
    var V = window.sbVault;
    if (V && V.isLocked && V.isLocked() && !(V.isOpen && V.isOpen())) return;
    var root = doc.documentElement;
    var loginUp = !!doc.getElementById("sbLogin") && !root.classList.contains("sb-has-session") && !window.__sbLoginDone;
    if (loginUp) return;
    var opener = window.sbOpenApp || window.toggleApp;
    if (typeof opener !== "function") { setTimeout(offer, 300); return; }
    var open = typeof window.getOpenWindow === "function" ? window.getOpenWindow("ark") : null;
    if (open) return;
    try { opener("ark"); } catch (e) { setTimeout(offer, 400); }
  }
  if (ARK) {
    doc.addEventListener("sysbaby:desktop-ready", function () { setTimeout(offer, 400); });
    doc.addEventListener("sysbaby:login-success", function () { setTimeout(offer, 700); });
    if (window.sbBus && window.sbBus.on) window.sbBus.on("vault:change", function (e) { if (e && e.open) setTimeout(offer, 300); });
    setTimeout(offer, 2500);
  }

  window.sbArk = {
    /* Собрать ковчег строкой — для законов и терминала; окно зовёт то же. */
    assemble: function (withCargoText) { return assemble(withCargoText || null, null); },
    isCopy: function () { return !!ARK; },
    meta: function () { return ARK ? JSON.parse(JSON.stringify(ARK)) : null; }
  };

  if (typeof window.registerApp === "function") {
    window.registerApp("ark", {
      /* ДВЕРИ НАРУЖУ КОМНАТЫ (D-240): витрина, работы и стенд в копии зовут
         слово ковчега вместо рамки — это названо здесь, хозяином. */
      opens: ["sbArkNoFrame", "sbArkNoFrameHtml"],
      keeps: [KEY],
      reads: [],
      needs: ["диск"],
      /* ── ОТЛОЖЕН (D-330) ─────────────────────────────────────────────────
         Основатель 28.09.2026: «я считаю, что ковчег несёт больше
         потенциальных рисков, чем пользы… предлагаю отложить ковчег на
         будущее и пока его спрятать от пользователей». Совет согласился:
         копия не получает исправлений, чужой файл нечем проверить (до
         подписанных сборок, план T8), а в Chrome копия без замка открыта
         другим файлам с диска. Снят со стола, из полки и из палитры; причина
         сказана системе, а не комментарию. УБРАН, А НЕ УДАЛЁН: код на месте,
         ark-check его проверяет, по имени комната открывается. Возврат —
         снятием двух строк. */
      hidden: true,
      offDesk: "отложено решением",
      why: "why.ark",
      title: UI.en.title,
      label: UI.en.label,
      i18n: {
        ru: { title: UI.ru.title, label: UI.ru.label },
        ee: { title: UI.ee.title, label: UI.ee.label }
      },
      color: "linear-gradient(160deg,#9ad8e8 0%,#2f7fa3 52%,#0e2c42 100%)",
      icon: ICON,
      size: { w: 700, h: 720 },
      retranslate: true,
      render: render
    });
  }
})();
