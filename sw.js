/* sys.baby — СЛУЖЕБНЫЙ РАБОТНИК: система живёт, когда сети нет.
 *
 * ПОВОД, дословно от основателя 26.08.2026: «необходимо сделать так, что
 * даже, когда интернета на телефоне или другом устройстве нет, сайт sys.baby
 * должен продолжать работу».
 *
 * И это не только новая работа — это закрытие нашей же неправды: в витрине
 * стояла строка «Offline-first / Работает офлайн», а служебного работника в
 * системе не было вовсе. Без сети открывалась страница браузера.
 *
 * ЧТО ЗДЕСЬ ЕСТЬ И ЧЕГО ЗДЕСЬ НЕТ
 * -----------------------------------------------------------------------
 * СПИСКА ФАЙЛОВ ЗДЕСЬ НЕТ, и это решение, а не упущение. Список, написанный
 * руками, расходится с оболочкой в первый же выпуск — а узнают об этом
 * снаружи и без сети, то есть в единственном месте, где починить нельзя.
 * Поэтому список приносит САМА СТРАНИЦА: она перечисляет то, что реально
 * загрузила (адреса из своих же link и script, с меткой сборки в запросе),
 * и присылает сюда сообщением. Оболочка и её опись не могут разойтись,
 * потому что опись — это и есть оболочка.
 * Кроме link/script страница приносит и link rel="sb-precache" (D-800,
 * v178-H4a): так в опись входят шрифты голоса fonts/nunito-v-cyr.woff2 и
 * fonts/nunito-v-lat.woff2 (вариативный Nunito, D-823), которые браузер берёт не
 * тегом, а из @font-face.
 *
 * ИМЯ ХРАНИЛИЩА НЕСЁТ МЕТКУ СБОРКИ. Новая сборка — новое хранилище, старые
 * стираются при первом же вступлении в силу. Так человек не остаётся с
 * половиной старой и половиной новой системы.
 *
 * С ПОЛКИ — ТОЛЬКО СВЕРЕННОЕ С ОПИСЬЮ (D-827-SHELL-SIGNED-OPIS, основатель
 * 12.11.2026: отдельного адреса для сайтов клиентов не будет). Система и гости
 * живут в одном происхождении, и любая страница этого происхождения может
 * открыть хранилище работника и положить туда подменённый core/store.js. Поэтому
 * опись {путь → sha256} при сборке вписывается сюда, в сам работник (его браузер
 * берёт из сети, через caches его не подложить): работник считает sha256 тела
 * каждого ответа с полки и отдаёт его, только если хэш совпал с описью; иначе —
 * сеть. На полку не ложится ничего, чей хэш не совпал. Полка — только своя:
 * caches.open(своё имя), а не caches.match по всем хранилищам происхождения.
 * Опись пишут tools/stamp-build.mjs, tools/publish.mjs и tools/build-test.mjs
 * (tools/_opis.mjs). Чего это не даёт: адрес вне описи с полки не отдаётся
 * вовсе (только сеть), а дерево, правленное после штампа, без сети не встанет,
 * пока штамп не пройдёт заново, — это честная цена: лучше без офлайна, чем с
 * чужим кодом. Охраняется tools/origin-cache-poison-check.mjs.
 *
 * Список адресов по-прежнему приносит страница (ниже); опись лишь решает, что
 * из принесённого и найденного достойно полки.
 *
 * НАРУЖУ — ТОЛЬКО ПО-НАСТОЯЩЕМУ. Всё, что не с нашего адреса, идёт в сеть и
 * никогда не кладётся в хранилище: письмо в студию либо ушло, либо не ушло,
 * и подделывать ответ из кэша нельзя. Без сети приложение скажет правду —
 * это уже написано в letters-door.
 */
var CACHE_PREFIX = "sysbaby-shell-";
/* ОПИСЬ:НАЧАЛО — пишут tools/stamp-build.mjs, tools/publish.mjs, tools/build-test.mjs (tools/_opis.mjs); руками не правится */
var BUILD = "v178-H4b";
var SHELL_SHA = {"art/hero-object-sm.webp":"3155778bec485d3f009bbb9010f97f5e2e6347344dfca340ff21234e88b1a4ee","art/hero-object.webp":"14d25b962634e606f7b3a25dd21213a5fb0d1c14e5e2041cab4f51953990b550","build.html":"647966bc6a6b970b4b9c809c6e3fd4d2cc4b86326f10205aeb59d96ea04a253b","index.html":"f59d7527c598f74edba914f6887c0678391fc6210809fdfa886738f7be7b8216","manifest.webmanifest":"a3f542b92aefe6e12913eb9ff98b729cf442eb9f5ec89c71bb3eea72fe15894c","os/apps/ark/ark.css":"64670412332f11e688e489d8594f253be54cc6b2fcca62811c73e53c33a58474","os/apps/ark/ark.js":"bc0381daea531e6bc3b5f432439f71137596519ea9c1991e6f75c8ffa5b30dc2","os/apps/browser/browser.css":"ed4aa3a6a0cb9f696d691693d61ac724aa7cc997521be10b71549d07d94b63c7","os/apps/browser/browser.js":"7110270513cb9aabc4ce0e0cdd7e15fe9ea385b8b559dbf81fecb58875649991","os/apps/build/build.css":"8c181d33ce4c261f625d66eff2ca3507b2519eb45a1f14e75f491f2dd22ab533","os/apps/build/build.js":"5af9af236a41b576a68b84320d729220d583790e6e142a111f03401479a8cd79","os/apps/chest/chest.css":"ea7ba2605235b0f7e02ba8a0437953a8458d661d3c49e22d2bc43f92eed5a12c","os/apps/chest/chest.js":"e6c4570df85fc0912172c2370e21bb1374c648e0bce7f4be7c0ea9faa1ff9cb1","os/apps/chest/prizes.data.js":"933574b9493f99d116a85bea2ac310b7e603c5baa9edaf41f256158204064e7d","os/apps/echoes/echoes.css":"cc79b1b92c9abf19fe7401a91bc260cd4e70ddc3e1bed2b99cc760ba045ccd00","os/apps/echoes/echoes.js":"84e9c65a2e1ec342123c5fe5d2d27ffacfccb1daf988599c6761b3b7b3401580","os/apps/files/files.css":"bb9d57ba289de311969ceaf462bc1630df977f0869cac218e879ed4159d98ece","os/apps/files/files.js":"f830107cfc163a7facb8c4a7971bb0eb9b8fd57c3df7a3323e6f52a4c53ea57d","os/apps/handoff/handoff.css":"90ce3bbee6b94f5681a707db8fe73d577a7a18aefd8ad5d61636747569ea493b","os/apps/handoff/handoff.js":"a08c33d58c38cab1a323ad0b969415b38957d1b5cae7f093be7673d49de38ca1","os/apps/keys/keys.css":"d21a941058de7e66fa69edc44f8b879b6f50679cd789fb3644c490dbd7d0ff3d","os/apps/keys/keys.js":"8d6d529af5ed4125187f71fd07d6e2b5b2b7f0260300b4e80af6d10fd1147f33","os/apps/lantern/lantern.css":"a411900349b21c806faf10bf0825974036effd948572eec9dc7be7f4a57a18f0","os/apps/lantern/lantern.js":"4b714b0d9fbbab58878d4ad1c37572e2caa6a01c198de45789c82aeeb4ef1039","os/apps/mail/mail.css":"f019e03f716cb80d3829a65d99e7cd5a246d138dbabab06bed083839af540e7f","os/apps/mail/mail.js":"26e86f2fcdfc66af41cdd040b1edd654c34c3b294718e37ddba62db2548fc8ba","os/apps/messenger/messenger.css":"43994d3bfa714af3e6348fbb562f738a21103fd13116b41309d5c90a3dac0f5b","os/apps/messenger/messenger.js":"59fbf14e70d393277e393036eadb651e0cb8e35dfd9dd7d973f5d24f14112eeb","os/apps/notes/notes.css":"ea6d6e75812f52a2b69357b40027c2aedb6e1106fa36c8274cfb832d40a749ee","os/apps/notes/notes.js":"b6a665f174949e9780570367da13f178401134949955befd7791699aad29d999","os/apps/outward/outward.css":"5d117f2ae8f6c89cd2bbb8fb3e32bf9acfe8a7d3d92ece9f72a2996344ca3fb4","os/apps/outward/outward.js":"b89273209965a8b027d9c8cdf2208d0f362fb01c333213a86221023f2cdf625b","os/apps/player/player.css":"feb1bd6d01de7a497d1dde05d8ab94500d974d1237e9b62ba801c32cf0e32e9f","os/apps/player/player.js":"8cb48b2acc8b558804a2a526e1a2a462bd8f99cfab76ffcb7064b0445c6d7e17","os/apps/project/project.css":"9207f3e4405f8c38a61ad370f455542438c2a85421fb7485e4e4cf6a6334f4c1","os/apps/project/project.js":"bbee3591222320e0cacc9ce7fd2d00a73926f78b1abf5900db3dc674d7832bb0","os/apps/search/search.css":"c65aa91700bc7c5d38c106a6da446306418dce2c33ba1fdcc6c4e0d656066f9a","os/apps/search/search.js":"38226ebab15a7a08645c2fcf4651bbc39399e88f78ea1037826453a6d2e96412","os/apps/settings/settings.css":"fc9539f492bb0fa6e964a489a18f7923bd4d252e19394dbe2874aeb121f33273","os/apps/settings/settings.js":"1ec2e359ef5cea5b3084828245f52f7a86721f863104522e61753a3beeb128f5","os/apps/solitaire/solitaire.css":"19ecf617ce9dbc2bb2ce6055a95f5da8ad1ff40de65dc8fab31786b9c016ebf8","os/apps/solitaire/solitaire.js":"e5b7dacec9c0d9151c57d7878e047801f1f46812cbe13adcc748847ee4193cb6","os/apps/vault/vault.css":"2699874d958d797fa2cd6abe441d4dd53e9c790d60fe60d43b4aa8fcf5a8c725","os/apps/vault/vault.js":"f0e6c57bbe3d8fe8a4da007743d4848d05845aa063e6767ce40fabc10c44fde6","os/apps/viewer/viewer.css":"770706e77b51f18fcbfc7cdbd523530d5813138cf2999761c850cbe5b798579f","os/apps/viewer/viewer.js":"2ad08034508711d6c8f87a93d520c88fdcd578868d7ea3588b0302a1b7255048","os/core/alarm.js":"269c8ec5adfc1068f36a5c0e3f3956adb9e54d5ec5d230c70969fc7660ad0149","os/core/alive.js":"980dac3a796bd4c4d805e044dd2f667700592b3acd985e0d127f85ef7f976323","os/core/argon2.js":"60a5180055ddc6f16e8f8a0d0a73e322fd14b41d64d9f77c4c1a124899bbe38f","os/core/baton.js":"303346bd3074343319b69a0ab3e48979e4ede39abe720cd829217b426c57d4ec","os/core/calc.js":"885f0280a9790b33479c470689d2797e4c1d7c70452c86be8a5dcee9c1e81fb0","os/core/clock.css":"381642a8e0445a66a40ea3b1ffb45a723e72433fe8a2cec97bc5c0518dcdc644","os/core/clock.js":"ad9f3ed1e134c14c83ba81ab1ba71d221383ef9949623b5ae8523ba6242fb251","os/core/core.css":"cc008e590e38e3840124964939022796f621a98194365bc678d6270262ccc1f8","os/core/depth.css":"c5ae37f8af5a2ec47de3f8e470093b4b013776660bf8950d47a5cc4d0c9366a6","os/core/depth.js":"40023dfeed906467cb5520b7aded2e8ba7c1821bffa0b782494b1cc0f52bc716","os/core/desk.css":"7392eb84ee34a6ef450a6d8e2bf90b88776c7b01f61a86ee4e5a00bd19b44d39","os/core/desktime.js":"afdaedde3c6eaf1e05ec18c5f1d7c9075a50682b411bebda20d7a8e9b7ca9a88","os/core/desktools.css":"72738dc62a453f2536612f0b2563da51f1cda8492cc41084cdccdacfab5b2cb2","os/core/desktools.js":"d929f31585ce0a9005432964e4c0d1ddad9c62bfab2e0dc7bba5814a454f9fa4","os/core/desktop.js":"31425482885fdcded662f11288f5651f7b6b32871507fc3a04fbb6f24f0075e1","os/core/doors/doors.css":"c378e1ac7ea8f34f58df30b60019ca7483bccb5d4ac2cfc0ab9978e8425b0e05","os/core/doors/doors.js":"6e1785b73d9165777ad5b0ef5e3f59e6853cece752342b61ba56959936e7a4b9","os/core/doors/porog.js":"ddc3622aca03b434e71f6b2f7ff7dbeb2baa359bf7a75e384685374b9787710a","os/core/doors/shifr.js":"16ceb79e08ad6b422ef7053015133344f1a7b7263cbe7cca4949cdea7416c2c0","os/core/doors/sobor.js":"5292c4b515b1a0315cc4d8f6a233e62cf18ebc133bbe41d271e6c0b9fca506b7","os/core/doors/sobor/d-art.webp":"0c92de3347165c2c4abfa0c110f5f31f059c9603d3f433d257439a7a15b05d0c","os/core/doors/sobor/d-floor.webp":"5ac92baae8ece62a8cee0de486ddeec117b7555ede453733126076e87c6b9589","os/core/doors/sobor/d-glow.webp":"377ec4b78578297f020ba182f7c91641db62df97148d96f26c1c150663b60ab5","os/core/doors/sobor/d-mask.webp":"a529c24bf5bfbbaa12dc8ef8e68c9efcf565db80ed1061589a74881871b8c6b9","os/core/doors/sobor/d-near.webp":"1642d46670fcb8b67bf56c40efbcdfc805abbde3db31a5464151766e97e8d8ac","os/core/doors/sobor/p-art.webp":"fb92df08b8557939084c8fa7b76e4dfd4f7d9a43c880b61cfa87c26d873fb77a","os/core/doors/sobor/p-floor.webp":"0dd6b78b0898160a64ed3ee1fd2d220bb3cc8bc8dcb58cbf9352f6ddc574da5d","os/core/doors/sobor/p-glow.webp":"60fc9aa65054b6ff5707243346f483a4cad355fcc93f1b6d45dc28d968e087b2","os/core/doors/sobor/p-mask.webp":"31baca9efcb82e0433b2bc4def3ea7d95fb3b01f6d9e1631d4e40354dc7f1213","os/core/doors/sobor/p-near.webp":"7d3c2c13cb6df499659401652c9d2bff511f25115cd0b96792cd86f8ba75834a","os/core/eclipse.js":"0c3f5b13a5f10daa928360ed1208a0bc1e5ec3fe4f427d21ce9a4a387b281266","os/core/field.js":"b6f1a7fb1034750ae3fda8c09aaedfc4a35cf2ff9ab206d1ee478e8186b6f025","os/core/friction.js":"317f81ae7f9f631ae995f46705feedab18d5440b44ee5835426cc5380b41f695","os/core/gate.css":"9c3cf01794429395928d00bde9e177a828d62f39d33eb33db245c7a231a8c64d","os/core/gate.js":"11048a30135b137f42433ac65e86b57353565c64f1945276ec2adc6230ab93a1","os/core/glyphs.js":"a01d8610c79317b5141bcc39a36619e1e1010ac96676e0a7f6e53fd6f3f2d794","os/core/hand.js":"a1182443cf173cfbc92d5cb8016a413999fc4eb0e1f9b5219b51cdfc8b2be896","os/core/install.js":"43c8a5dbfa17a0d8370fd5559459304bf8b9b3083eb9a548a4321dc0de108165","os/core/links.js":"5e4d35ccafe19ce089260311dd261e1effdc40d11a26b864f8e409729799e893","os/core/meet.js":"39e01c3792e72935f8c73d01363a5301c2002cbd2acc5bdf7be2b5f8fc82f3a4","os/core/noise.js":"0036ba7d117addc030b19d0d8a9461f9ebe9c5125b8314e95224c3e4fd43ae67","os/core/noteplus.js":"409215d1c57b9a04ebb0860889a333f5a5962679175d7d4539ed764c54510b63","os/core/palette.js":"3b55a6772f011e8d6711a461d4d1f5565903c09e7d771663bf00a8abdf6396ce","os/core/panels.js":"dff83ef393ca01020492901d67d537e9719303e88e505761f8521ee583cf2fca","os/core/rights.js":"b19c08045d7afe92227086d8d36b2ff78fb2d50e112502554bdd2eec2196239c","os/core/seals.js":"8fef0372da4b031da42238d62790bb7c371637c5389fec686742f47094aaad08","os/core/share.js":"9e17a006009663700b45fc4a3ed304f6bf1cd7751c3bf2fa69be3eaf49931e4c","os/core/shell.js":"94652384d49ed9429985a617adfc4df70a6818184cd09b2048a32fc65e3c44a1","os/core/sky.js":"1cb0867562b96ca238bcbaea0633c4f1bc0bf3f4caa7fa1406be728f8dbaa115","os/core/smiles.js":"9c86904459be8d6c05c788a9b03d800599c6aecd69e385f1b37b61148ef45d75","os/core/store.js":"d1a165eadfd47029b36ca9e4323c15e0e38c9f536867578b7ccf8ac3e169b476","os/core/strings-chistota.js":"b256a3a310568f5adce46b03fec86b2e0bdd2a3dd3e5afad76e94aa9a1f1b929","os/core/strings-desk.js":"7cce8afbf9d11733d63dcbcb7c68263853d35f9ad75ae386cb38076c80bdbb5a","os/core/strings-instrumenty.js":"a1982d9ef2dca9a5dceb0c68206c939cfecff5f2e7d5b3758e1ba820c6c114b7","os/core/strings-meet.js":"a94a1805805d4366a394775cd7d0f6a9959afd4ece9e7c9b5e8eb204e8b136f9","os/core/strings-themes.js":"afdeeb2c27d73f46fac37c1796d9c597b0927747a5240095ac24e1a6cdf7d1f9","os/core/strings-voice.js":"c579b4332ee23df3bbb74b26ed3fd404591c8414fdf463e58358fdf66d554eb9","os/core/strings.js":"52e4ee49b8b40f9d61ff76ccf17983db6aba2d8bf3680d97bdda74585bcfa9e4","os/core/survival.js":"898063082edac240356cbe691ce0cfd65bcb34a4503f4dfc431068ac857fa817","os/core/sync.js":"dc46f67bc92a57e9353572a0746abe4051ebdfe4c042cd67ff2d78ec7cd9c693","os/core/terminal.js":"931f0d2c2538f360ed2cdc8e093c3c5f3a76472fd0aff257f105a216242c7c6d","os/core/themes.css":"2f992589c4dc6671f81fc782d8720d09b0510ba5ceee6366587c483732fbf59a","os/core/thought.js":"c974193d61fb56c770ae75a577276045051c9c7cd39739fed27c7f9ce9b63d11","os/core/topbar.js":"2faef6f81d1d0d311947c9dcdc44e07177851d515a8e2b228c0ec71b65598847","os/core/voice.css":"58f20cb1036af0c4547246f2d9143cf26cf512710df1433a840866112c8ebcc9","os/core/voice.js":"2c454ee8ddebd6322c46e24dd143d7eb04dc57c42cc66f64f5b0a4385b3e5995","os/core/witness.js":"94744002f96b0315a739833e5d760c9f429d79b4369a60323c6b8f055ddbc168","os/core/words.js":"ed4c7c59aef9a7058a2fe8dca41cf2385c5d0dba2cd80f4207879a6128e5c290","os/fonts/nunito-v-cyr.woff2":"2bb0f30bfbb01aa28327a48b82c29d9ba602723f64a550adcde17a53e3c327cc","os/fonts/nunito-v-lat.woff2":"4de2c9b802bee4eb1c45e392a015da3846c91310aad2048a4232ea75b0d33dfb","os/forward.js":"539b5bf800f192d97293d28b32eb3829f589b9c4d7d6753218a8de4642d9b57b","os/icons/sb-192.png":"6851c2264e9b1b6a2f66724aa441e681a440bfd52801c1e0dd973c8aaca86b6a","os/icons/sb-512.png":"e0edb06962f8aa09fbe2f5cefa19a8da74439af9348843e20667f21de488ff6d","os/icons/sb-maskable-512.png":"16d954eb4d2138eab29f41858e14f1a6224070e93b307ae46ef523645a304217","os/index.html":"06b648e87a34dac940e501c976f0810c12b06035add9cabf67c66943acc9fc20","os/manifest.webmanifest":"6087434abb3f2fa41a9719e9def4483267595ee278e7862007283a8fb2fc04ae","os/sw.js":"09fc09ff4bfba6b8ba29e426ad2fa88b9ec83cab39df200073f29f9bc2d0574d","os/widgets/payback.js":"0cda2003e6163aca995fa77bfe0e91b5b8edc65ed654479cde2309e85f298c12","os/widgets/quote.js":"ee9b2f78d53c81b9b1e6468c97c3b72cdd33b67682361790667126d62e04afc5","shared/floor.data.js":"341e7cd438389778afbbdfceda03768341875535a6196d7c818297ca52667c23","shared/outward.data.js":"11b94e468d507a505079cb33add71fdf7c2c89217192152b9e7b74329bd787ec","shared/pricing.data.js":"78d2d5477f31467ce8dac74311f9b53563382118c7e74657155fe324390d7979","shared/system.css":"72b96dff9205b42c756317fa3a3b568e5cc4e33a9afe0f3777d28a93b02e2df5"};
var OPIS_SEAL = "f4d3e5a7e00ce80a5695b90b10629dd92763831be20123fa22733bcaacd5fd43";
/* ОПИСЬ:КОНЕЦ */
/* ИМЯ ХРАНИЛИЩА — из описи, а не из сообщения страницы: работник, проснувшийся
   без страницы, знает своё хранилище сам, и чужое имя, присланное страницей, не
   уводит его на чужую полку. */
var CACHE = CACHE_PREFIX + BUILD;

/* Корень сайта для работника: дома он лежит в /os/ (корень — уровнем выше), в
   вебе — в корне или в /test/. Ключ описи — путь от этого корня. */
var SITE_ROOT = (function () {
  try { return new URL("./", self.location.href).pathname.replace(/os\/$/, ""); }
  catch (e) { return "/"; }
})();
function opisKey(url) {
  try {
    var p = new URL(url, self.location.href).pathname;
    if (p.indexOf(SITE_ROOT) !== 0) return null;
    var k = p.slice(SITE_ROOT.length);
    try { k = decodeURIComponent(k); } catch (e) { /* как есть */ }
    if (k === "" || k.charAt(k.length - 1) === "/") k += "index.html";
    return k;
  } catch (e) { return null; }
}

function hex(buf) {
  var b = new Uint8Array(buf), s = "";
  for (var i = 0; i < b.length; i++) s += (b[i] < 16 ? "0" : "") + b[i].toString(16);
  return s;
}
function sha256(buf) {
  if (!self.crypto || !self.crypto.subtle) return Promise.reject(new Error("нет crypto.subtle"));
  return self.crypto.subtle.digest("SHA-256", buf).then(hex);
}

/* Печать описи сверяется один раз: порванная или чужая опись = пустая опись,
   и тогда с полки не отдаётся ничего. */
var opisReady = null;
function opis() {
  if (!opisReady) {
    opisReady = sha256(new TextEncoder().encode(BUILD + "\n" + JSON.stringify(SHELL_SHA)).buffer).then(function (h) {
      return h === OPIS_SEAL ? SHELL_SHA : {};
    }).catch(function () { return {}; });
  }
  return opisReady;
}

/* Ответ годится для полки и для отдачи с полки, только если sha256 его тела
   совпал с описью. Отдаёт сам ответ или null. Тело читается с копии. */
function verified(res, url) {
  if (!res) return Promise.resolve(null);
  var key = opisKey(url);
  if (!key) return Promise.resolve(null);
  return opis().then(function (O) {
    var want = O[key];
    if (!want) return null;
    return res.clone().arrayBuffer().then(sha256).then(function (h) {
      return h === want ? res : null;
    });
  }).catch(function () { return null; });
}

/* Своя полка — только своё хранилище, не caches.match по всему происхождению. */
function shelf() { return caches.open(CACHE); }
function fromOwnShelf(key) {
  return shelf().then(function (c) {
    return c.match(key).then(function (hit) {
      if (!hit) return null;
      return verified(hit, typeof key === "string" ? key : key.url).then(function (ok) {
        /* Не совпало — снимается с полки: подменённое не ждёт следующего раза. */
        if (!ok) { c.delete(key).catch(function () { }); }
        return ok;
      });
    });
  }).catch(function () { return null; });
}
/* На полку — только сверенное и только своё (ответ своего адреса, 200, basic). */
function putVerified(key, res, url) {
  if (!res || res.status !== 200 || (res.type && res.type !== "basic")) return Promise.resolve(false);
  return verified(res, url).then(function (ok) {
    if (!ok) return false;
    var copy = res.clone();
    return shelf().then(function (c) { return c.put(key, copy); }).then(function () { return true; });
  }).catch(function () { return false; });
}

self.addEventListener("install", function () {
  /* Ждать нечего: опись адресов придёт страницей. Встаём сразу, чтобы первый же
     визит без сети застал работника на месте. */
  self.skipWaiting();
});

self.addEventListener("activate", function (ev) {
  ev.waitUntil(self.clients.claim());
});

/* Список адресов приходит от страницы; на полку ложится только сверенное. */
self.addEventListener("message", function (ev) {
  var data = ev.data || {};
  if (data.type !== "precache") return;
  var urls = Array.isArray(data.urls) ? data.urls : [];
  ev.waitUntil(
    Promise.all(urls.map(function (u) {
      /* Поимённо и по одному: один недоступный или несверенный адрес не должен
         обрушить всю опись. Чужое происхождение — мимо. */
      var abs;
      try { abs = new URL(u, self.location.href).href; } catch (e) { return null; }
      if (!sameOrigin(abs) || guestPath(abs)) return null;
      return fetch(new Request(abs, { cache: "reload", credentials: "same-origin" })).then(function (res) {
        return putVerified(abs, res, abs);
      }).catch(function () { return false; });
    })).then(function () {
      return caches.keys().then(function (names) {
        return Promise.all(names.map(function (n) {
          if (n !== CACHE && n.indexOf(CACHE_PREFIX) === 0) return caches.delete(n);
          return null;
        }));
      });
    })
  );
});

/* Оболочка с полки: сам документ, иначе корень области, иначе index.html.
   Каждая ступень сверяется с описью и ждёт ответа прежней — пустой или
   подменённый ответ не должен выдать себя за найденный. */
function fromShelf(bare) {
  return fromOwnShelf(bare).then(function (hit) {
    return hit || fromOwnShelf(new URL("./", self.location.href).href);
  }).then(function (hit) {
    return hit || fromOwnShelf(new URL("index.html", self.location.href).href);
  });
}

/* ── САЙТЫ КЛИЕНТОВ НЕ ПРОХОДЯТ ЧЕРЕЗ РАБОТНИКА (D-376) ─────────────────
   На sys.baby/<имя>/ живут сайты клиентов — в той же области, что и
   система. Полка работника им чужая: имена их файлов без номера сборки, и
   «сначала с полки» держало бы у вернувшегося посетителя старый app.js
   клиента до следующей сборки sys.baby, а сайт клиента ложился бы в
   хранилище системы. Пути гостей работник не обслуживает и не кладёт на
   полку — их берёт из сети сам браузер. Список повторяет GUESTS из
   tools/deploy.mjs без тестовой копии; согласие списков стережёт
   tools/guest-list-check.mjs, поведение — tools/client-site-check.mjs.
   livingisrael — второй гость, основатель 20.10.2026, дословно: «Сначала
   здесь sys.baby/livingisrael Потом переедет.» (D-580). */
var GUESTS = ["kahjuabi24", "vlana", "livingisrael"];

/* Корень сайта для работника: дома он лежит в /os/ (корень — уровнем выше),
   в вебе — в корне или в /test/. Гость — первая часть пути после корня. */
function guestPath(url) {
  try {
    var base = new URL("./", self.location.href).pathname.replace(/os\/$/, "");
    var p = new URL(url, self.location.href).pathname;
    if (p.indexOf(base) !== 0) return false;
    return GUESTS.indexOf(p.slice(base.length).split("/")[0]) !== -1;
  } catch (e) { return false; }
}

function sameOrigin(url) {
  try { return new URL(url, self.location.href).origin === self.location.origin; }
  catch (e) { return false; }
}

function sameOrigin(url) {
  try { return new URL(url, self.location.href).origin === self.location.origin; }
  catch (e) { return false; }
}

self.addEventListener("fetch", function (ev) {
  var req = ev.request;
  if (req.method !== "GET") return;                       /* отправка — всегда живая */
  if (!sameOrigin(req.url)) return;                       /* наружу — только по-настоящему */
  if (guestPath(req.url)) return;                         /* сайт клиента — мимо полки (D-376) */

  /* ДОКУМЕНТ: сначала сеть, потом хранилище. Так новая сборка приходит сама,
     как только сеть есть, и та же страница открывается, когда её нет.
     Документ кладётся в хранилище под адресом БЕЗ строки запроса: строка
     запроса — это то, что человек принёс (?share&text=…), а не часть
     оболочки, и на диске ей не место (D-345). На полку — только сверенный
     с описью (D-827). */
  if (req.mode === "navigate") {
    var nav = new URL(req.url);
    var bare = nav.origin + nav.pathname;
    /* ПРИШЕДШЕЕ ЧЕРЕЗ «ПОДЕЛИТЬСЯ» НЕ УХОДИТ ИЗ ТЕЛЕФОНА (D-345). Меню
       «Поделиться» открывает систему адресом ./?share&text=…; раньше этот
       адрес шёл «сначала в сеть» — текст уезжал на сервер строкой адреса и
       ложился в хранилище под полным адресом, читаемо при запертом замке.
       Теперь оболочка берётся с полки, а если её там нет — из сети по адресу
       без строки запроса. Вещь читает сама страница из своего адреса. */
    if (nav.searchParams.has("share")) {
      ev.respondWith(fromShelf(bare).then(function (hit) {
        return hit || fetch(bare, { credentials: "same-origin" });
      }));
      return;
    }
    ev.respondWith(
      fetch(req).then(function (res) {
        if (res && res.ok) putVerified(bare, res, bare);
        return res;
      }).catch(function () {
        return fromShelf(bare).then(function (hit) {
          return hit || new Response("", { status: 504 });
        });
      })
    );
    return;
  }

  /* СНАСТЬ ОБОЛОЧКИ: сначала своя полка — но только сверенное с описью; не
     совпало или нет — сеть (и сверенный ответ сети заменяет подменённый).
     Адреса несут метку сборки (?b=vNN): у новой сборки другой адрес. */
  ev.respondWith(
    fromOwnShelf(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        putVerified(req, res, req.url);
        return res;
      });
    })
  );
});
