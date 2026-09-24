/* ОПИСЬ ВЫХОДОВ НАРУЖУ — ЕДИНСТВЕННЫЙ ИСТОЧНИК (D-221).
 *
 * Лежит в shared/, потому что её читают ДВОЕ: окно «Наружу» в системе и
 * закон tools/outward-check.mjs. Держать её в spec/ было нельзя — spec не
 * публикуется, и окну пришлось бы иметь вторую копию. Две копии описи
 * расходятся, и обе продолжают называться описью.
 *
 * Правила полей — в поле _ ниже. Опись не может вырасти молча: прибор
 * обходит дерево и требует, чтобы каждое место, откуда код ходит наружу,
 * было здесь названо.
 */
window.SB_OUTWARD = {
  "_": [
    "ОПИСЬ ВЫХОДОВ НАРУЖУ. Единственный источник для окна «Наружу» и предмет",
    "закона tools/outward-check.mjs.",
    "",
    "side: self — к своему же адресу; third — к чужому хозяину; hand — адрес",
    "называет сам человек. byHand: false значит «система ходит сама».",
    "Самоходная дверь обязана иметь toggle ИЛИ noToggleWhy с настоящей причиной.",
    "",
    "Опись охраняет ЗАПРОСЫ, которые делает код. Обычная ссылка <a href> сюда",
    "не входит: её адрес виден до нажатия и она ничего не уносит.",
    "",
    "default: 'on'/'off' — с чем дверь живёт, пока человек не трогал выключатель.",
    "Самоходная дверь К ЧУЖОМУ ХОЗЯИНУ обязана быть 'off' — это закон, а не вкус.",
    "",
    "what / who — на каждом языке ОС, как и title (D-253). Раньше они были только",
    "по-русски и выходили на английский и эстонский экран как есть."
  ],
  "doors": [
    {
      "id": "browser-frame",
      "title": {
        "ru": "Браузер — страница в рамке",
        "en": "Browser — a page in the frame",
        "ee": "Brauser — leht raamis"
      },
      "where": [
        "os/apps/browser/browser.js:237"
      ],
      "side": "hand",
      "byHand": true,
      "host": "",
      "what": {
        "ru": "Адрес, который вы сами назвали, и всё, что обычно уходит при открытии страницы: ваш адрес в сети, вид браузера, размер экрана, ваши cookies того сайта.",
        "en": "The address you typed yourself, and everything that normally leaves when a page opens: your network address, your browser type, your screen size, your cookies for that site.",
        "ee": "Aadress, mille ise sisestasid, ja kõik, mis lehe avamisel tavaliselt lahkub: sinu võrguaadress, brauseri tüüp, ekraani suurus, sinu küpsised sellel saidil."
      },
      "who": {
        "ru": "Тот сайт и его хозяева. sys.baby не видит ничего: рамка чужая, читать её изнутри страницы нельзя.",
        "en": "That site and its owners. sys.baby sees nothing: the frame belongs to them, and a page cannot read inside it.",
        "ee": "See sait ja selle omanikud. sys.baby ei näe midagi: raam on võõras ja lehe seest seda lugeda ei saa."
      }
    },
    {
      "id": "browser-tab",
      "title": {
        "ru": "Браузер — открыть настоящей вкладкой",
        "en": "Browser — open in a real tab",
        "ee": "Brauser — ava päris vahekaardil"
      },
      "where": [
        "os/apps/browser/browser.js"
      ],
      "side": "hand",
      "byHand": true,
      "host": "",
      "what": {
        "ru": "То же самое, что и при обычном переходе по ссылке: адрес, который вы назвали, уходит вашему браузеру и дальше тому сайту.",
        "en": "The same as following any link: the address you typed goes to your browser and on to that site.",
        "ee": "Sama mis tavalise lingi avamisel: sinu sisestatud aadress läheb sinu brauserile ja edasi sellele saidile."
      },
      "who": {
        "ru": "Тот сайт. Это обычная вкладка вашего браузера, sys.baby к ней отношения не имеет.",
        "en": "That site. It is an ordinary tab of your browser; sys.baby has nothing to do with it.",
        "ee": "See sait. See on sinu brauseri tavaline vahekaart; sys.baby-l pole sellega mingit pistmist."
      }
    },
    {
      "id": "mail-own",
      "title": {
        "ru": "Письма — своей почтой",
        "en": "Letters — your own mail",
        "ee": "Kirjad — oma postiga"
      },
      "where": [
        "os/apps/mail/mail.js"
      ],
      "side": "hand",
      "byHand": true,
      "host": "",
      "what": {
        "ru": "Адрес получателя, тема и текст письма — открытым текстом — уходят вашей почтовой программе, а через неё вашей почтовой службе.",
        "en": "The recipient's address, the subject and the letter's text — as plain text — go to your mail app, and through it to your mail service.",
        "ee": "Saaja aadress, teema ja kirja tekst — avatud tekstina — lähevad sinu postiprogrammile ja selle kaudu sinu postiteenusele."
      },
      "who": {
        "ru": "Ваша почтовая служба и получатель письма. sys.baby в этом пути не участвует и не знает, дошло ли письмо.",
        "en": "Your mail service and the recipient. sys.baby takes no part in this path and does not know whether the letter arrived.",
        "ee": "Sinu postiteenus ja kirja saaja. sys.baby selles teekonnas ei osale ega tea, kas kiri kohale jõudis."
      }
    },
    {
      "id": "messenger-sealed",
      "title": {
        "ru": "Разговор — запечатанное сообщение",
        "en": "Whisper — a sealed message",
        "ee": "Sosin — pitseeritud sõnum"
      },
      "where": [
        "os/apps/messenger/messenger.js"
      ],
      "side": "hand",
      "byHand": true,
      "host": "",
      "what": {
        "ru": "Строка «sb1:…», которую вы сами скопировали и отдали любой программе. Внутри — сообщение, запечатанное общим словом; без слова это шум.",
        "en": "The «sb1:…» text you copied yourself and gave to any app. Inside is the message, sealed with your shared word; without the word it is noise.",
        "ee": "Tekst «sb1:…», mille ise kopeerisid ja andsid mis tahes rakendusele. Sees on ühise sõnaga pitseeritud sõnum; ilma sõnata on see müra."
      },
      "who": {
        "ru": "Программа, которой вы доверили строку, видит только шум; прочесть сообщение может лишь тот, кто знает общее слово.",
        "en": "The app you trusted with the text sees only noise; only someone who knows the shared word can read the message.",
        "ee": "Rakendus, millele teksti usaldasid, näeb ainult müra; sõnumit saab lugeda ainult see, kes teab ühist sõna."
      }
    },
    {
      "id": "browser-search",
      "title": {
        "ru": "Браузер — поиск",
        "en": "Browser — search",
        "ee": "Brauser — otsing"
      },
      "where": [
        "os/apps/browser/browser.js:69"
      ],
      "side": "third",
      "byHand": true,
      "host": "duckduckgo.com",
      "what": {
        "ru": "Слова, которые вы набрали, если они не похожи на адрес. Они уходят в строке запроса к поисковой службе.",
        "en": "The words you typed, if they do not look like an address. They leave in the query string to the search service.",
        "ee": "Sinu sisestatud sõnad, kui need ei näe välja nagu aadress. Need lahkuvad päringureana otsinguteenusele."
      },
      "who": {
        "ru": "DuckDuckGo. Служба выбрана за то, что не ведёт истории поиска, но верить в это приходится ей, а не проверять.",
        "en": "DuckDuckGo. Chosen because it keeps no search history — but that is something you have to trust it on, not verify.",
        "ee": "DuckDuckGo. Valitud, sest see ei pea otsinguajalugu — kuid seda tuleb teenusel uskuda, mitte kontrollida."
      }
    },
    {
      "id": "letters",
      "title": {
        "ru": "Письма — отправка",
        "en": "Letters — sending",
        "ee": "Kirjad — saatmine"
      },
      "where": [
        "os/apps/mail/mail.js:858"
      ],
      "side": "third",
      "byHand": true,
      "host": "formsubmit.co",
      "what": {
        "ru": "Весь текст письма, имя и обратный адрес, которые вы вписали, и метка «Letters · sys.baby OS».",
        "en": "The full text of the letter, the name and reply address you entered, and the tag “Letters · sys.baby OS”.",
        "ee": "Kirja kogu tekst, sinu sisestatud nimi ja vastusaadress ning silt „Letters · sys.baby OS“."
      },
      "who": {
        "ru": "Служба formsubmit.co и её владельцы — письмо проходит через их машину открытым, это не наш сервер. И почтовый ящик sys.baby, куда оно придёт.",
        "en": "The formsubmit.co service and its owners — the letter passes through their machine in the clear; it is not our server. And the sys.baby mailbox where it lands.",
        "ee": "Teenus formsubmit.co ja selle omanikud — kiri läbib nende masina avatult; see ei ole meie server. Ja sys.baby postkast, kuhu see jõuab."
      }
    },
    {
      "id": "landing-form",
      "title": {
        "ru": "Витрина — форма связи",
        "en": "Showcase — contact form",
        "ee": "Esileht — kontaktivorm"
      },
      "where": [
        "index.php:4430",
        "index.php:4784"
      ],
      "side": "third",
      "byHand": true,
      "host": "formsubmit.co",
      "what": {
        "ru": "То, что вписано в форму на витрине: имя, способ связи, текст, и от кого пришли, если это указано.",
        "en": "What was entered in the form on the showcase: name, how to reach you, the text, and where you came from if that was given.",
        "ee": "Mis vitriini vormi sisestati: nimi, kuidas sind kätte saada, tekst ja kust sa tulid, kui see on märgitud."
      },
      "who": {
        "ru": "Та же служба formsubmit.co. Написанное проходит через чужую машину открытым.",
        "en": "The same formsubmit.co service. What you wrote passes through someone else's machine in the clear.",
        "ee": "Sama teenus formsubmit.co. Kirjutatu läbib võõra masina avatult."
      }
    },
    {
      "id": "works-probe",
      "title": {
        "ru": "Работы — проверка, жива ли",
        "en": "Works — liveness probe",
        "ee": "Tööd — kas töötab"
      },
      "where": [
        "shared/portfolio.view.js:322",
        "os/core/shell.js:148"
      ],
      "side": "self",
      "byHand": false,
      "toggle": "probeWorks",
      "host": "",
      "what": {
        "ru": "Один запрос к адресу самой работы на этом же сайте, чтобы карточка не говорила «работает», когда работа не отвечает.",
        "en": "One request to the work's own address on this same site, so the card does not say “working” when the work does not answer.",
        "ee": "Üks päring töö enda aadressile samal saidil, et kaart ei ütleks „töötab“, kui töö ei vasta."
      },
      "who": {
        "ru": "Тот, кто держит sys.baby, и посредник сети — Cloudflare. Наружу к чужим хозяевам не уходит ничего.",
        "en": "Whoever hosts sys.baby, and the network intermediary — Cloudflare. Nothing leaves to outside owners.",
        "ee": "See, kes sys.baby-d hoiab, ja võrgu vahendaja — Cloudflare. Võõrastele omanikele ei lahku midagi."
      },
      "default": "on",
      "defaultWhy": {
        "ru": "Включено по умолчанию: адрес свой, чужих хозяев нет, а выключенная проверка вернула бы карточку, которая говорит «работает», не зная этого. Третья сторона по умолчанию была бы выключена — здесь её нет.",
        "en": "On by default: our own address, no outside owners, and a probe switched off would return a card that says “working” without knowing it. A third party would be off by default — there is none here.",
        "ee": "Vaikimisi sees: oma aadress, võõraid omanikke pole, ja väljalülitatud kontroll tagastaks kaardi, mis ütleb „töötab“ seda teadmata. Kolmas osapool oleks vaikimisi väljas — siin seda pole."
      }
    },
    {
      "id": "works-frame",
      "title": {
        "ru": "Работы — живое превью",
        "en": "Works — live preview",
        "ee": "Tööd — elav eelvaade"
      },
      "where": [
        "shared/portfolio.view.js:202"
      ],
      "side": "self",
      "byHand": false,
      "toggle": "probeWorks",
      "host": "",
      "what": {
        "ru": "Работа открывается в рамке прямо в карточке — это не картинка, а сама работающая программа, и она грузится сама.",
        "en": "The work opens in a frame right inside the card — not a picture but the running program itself, and it loads on its own.",
        "ee": "Töö avaneb raamis otse kaardi sees — mitte pilt, vaid töötav programm ise, ja see laadib end ise."
      },
      "who": {
        "ru": "Тот же, кто держит sys.baby. Адрес свой, чужих хозяев здесь нет.",
        "en": "The same party that hosts sys.baby. Our own address; no outside owners here.",
        "ee": "Sama, kes sys.baby-d hoiab. Oma aadress; võõraid omanikke siin pole."
      },
      "default": "on",
      "defaultWhy": {
        "ru": "Включено по умолчанию: адрес свой, чужих хозяев нет, а выключенная проверка вернула бы карточку, которая говорит «работает», не зная этого. Третья сторона по умолчанию была бы выключена — здесь её нет.",
        "en": "On by default: our own address, no outside owners, and a probe switched off would return a card that says “working” without knowing it. A third party would be off by default — there is none here.",
        "ee": "Vaikimisi sees: oma aadress, võõraid omanikke pole, ja väljalülitatud kontroll tagastaks kaardi, mis ütleb „töötab“ seda teadmata. Kolmas osapool oleks vaikimisi väljas — siin seda pole."
      }
    },
    {
      "id": "service-worker",
      "title": {
        "ru": "Служебный работник — загрузка системы",
        "en": "Service worker — loading the system",
        "ee": "Teenustööline — süsteemi laadimine"
      },
      "where": [
        "os/sw.js:81",
        "os/sw.js:100"
      ],
      "side": "self",
      "byHand": false,
      "host": "",
      "noToggleWhy": {
        "ru": "Выключателя быть не может: это и есть загрузка самой системы. Он ходит за теми же файлами, за которыми пришёл ваш браузер, и кладёт их в запас, чтобы система открывалась без сети. Выключить его — значит выключить систему; выключатель здесь был бы обманкой.",
        "en": "There can be no switch: this IS the loading of the system itself. It fetches the same files your browser came for and keeps them in reserve so the system opens without a network. Switching it off would mean switching the system off; a switch here would be a decoy.",
        "ee": "Lülitit ei saa olla: see ONGI süsteemi enda laadimine. See toob samad failid, mille järele sinu brauser tuli, ja hoiab neid varuks, et süsteem avaneks ilma võrguta. Selle väljalülitamine tähendaks süsteemi väljalülitamist; lüliti oleks siin pettekuju."
      },
      "what": {
        "ru": "Запрос за файлами самой системы: страница, стили, код приложений. Ровно то, что браузер запросил бы и без него.",
        "en": "A request for the system's own files: the page, the styles, the application code. Exactly what the browser would request without it.",
        "ee": "Päring süsteemi enda failide järele: leht, stiilid, rakenduste kood. Täpselt see, mida brauser küsiks ka ilma selleta."
      },
      "who": {
        "ru": "Тот, кто держит sys.baby, и посредник сети. Ни одного чужого хозяина.",
        "en": "Whoever hosts sys.baby, and the network intermediary. Not a single outside owner.",
        "ee": "See, kes sys.baby-d hoiab, ja võrgu vahendaja. Mitte ühtegi võõrast omanikku."
      },
      "default": "on",
      "defaultWhy": {
        "ru": "Это и есть загрузка самой системы; выключателя нет — см. причину рядом.",
        "en": "On by default: our own address, no outside owners, and a probe switched off would return a card that says “working” without knowing it. A third party would be off by default — there is none here.",
        "ee": "Vaikimisi sees: oma aadress, võõraid omanikke pole, ja väljalülitatud kontroll tagastaks kaardi, mis ütleb „töötab“ seda teadmata. Kolmas osapool oleks vaikimisi väljas — siin seda pole."
      }
    },
    {
      "id": "build-frame",
      "title": {
        "ru": "Build — витрина внутри окна",
        "en": "Build — the showcase inside a window",
        "ee": "Build — esileht akna sees"
      },
      "where": [
        "os/apps/build/build.js:73"
      ],
      "side": "self",
      "byHand": true,
      "host": "",
      "what": {
        "ru": "Витрина sys.baby открывается в рамке внутри окна: тот же сайт, тот же адрес.",
        "en": "The sys.baby showcase opens in a frame inside the window: same site, same address.",
        "ee": "sys.baby vitriin avaneb akna sees raamis: sama sait, sama aadress."
      },
      "who": {
        "ru": "Тот, кто держит sys.baby. Чужих хозяев здесь нет.",
        "en": "Whoever hosts sys.baby. No outside owners here.",
        "ee": "See, kes sys.baby-d hoiab. Võõraid omanikke siin pole."
      }
    },
    {
      "id": "project-frame",
      "title": {
        "ru": "Проект — работа в рамке",
        "en": "Project — the work in a frame",
        "ee": "Projekt — töö raamis"
      },
      "where": [
        "os/apps/project/project.js:187"
      ],
      "side": "self",
      "byHand": true,
      "host": "",
      "what": {
        "ru": "Выбранная работа открывается в рамке: это сама работающая программа с этого же сайта.",
        "en": "The chosen work opens in a frame: the running program itself, from this same site.",
        "ee": "Valitud töö avaneb raamis: töötav programm ise, samalt saidilt."
      },
      "who": {
        "ru": "Тот, кто держит sys.baby.",
        "en": "Whoever hosts sys.baby.",
        "ee": "See, kes sys.baby-d hoiab."
      }
    },
    {
      "id": "product-frame",
      "title": {
        "ru": "Витрина — товар в рамке",
        "en": "Showcase — product in a frame",
        "ee": "Esileht — toode raamis"
      },
      "where": [
        "index.php:4171"
      ],
      "side": "self",
      "byHand": true,
      "host": "",
      "what": {
        "ru": "Выбранный товар витрины показывается рамкой с этого же сайта.",
        "en": "The chosen showcase item is shown in a frame from this same site.",
        "ee": "Valitud vitriinitoode näidatakse raamis samalt saidilt."
      },
      "who": {
        "ru": "Тот, кто держит sys.baby.",
        "en": "Whoever hosts sys.baby.",
        "ee": "See, kes sys.baby-d hoiab."
      }
    }
  ]
};
