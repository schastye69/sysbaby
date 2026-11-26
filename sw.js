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
var BUILD = "v180-H4e5";
var SHELL_SHA = {"art/hero-object-sm.webp":"3155778bec485d3f009bbb9010f97f5e2e6347344dfca340ff21234e88b1a4ee","art/hero-object.webp":"14d25b962634e606f7b3a25dd21213a5fb0d1c14e5e2041cab4f51953990b550","build.html":"5282bfd5d8b071fddde6c62dda4333b99a00db665f31909adc4b195d77c64adc","index.html":"ae614f41edcbceffab7df8da8e6aa2587cb361c38d3abc026ab8ed346addc667","manifest.webmanifest":"588704fadfad5b0b3370ebbc14f6f37053bebabeebfea1bc99d3579b37ef4214","os/apps/ark/ark.css":"64670412332f11e688e489d8594f253be54cc6b2fcca62811c73e53c33a58474","os/apps/ark/ark.js":"390ada2b8837d59ae5600cc4a99580a0ce3d89f56d2207992cef1985f8cfeb84","os/apps/browser/browser.css":"ed4aa3a6a0cb9f696d691693d61ac724aa7cc997521be10b71549d07d94b63c7","os/apps/browser/browser.js":"7110270513cb9aabc4ce0e0cdd7e15fe9ea385b8b559dbf81fecb58875649991","os/apps/build/build.css":"8c181d33ce4c261f625d66eff2ca3507b2519eb45a1f14e75f491f2dd22ab533","os/apps/build/build.js":"5af9af236a41b576a68b84320d729220d583790e6e142a111f03401479a8cd79","os/apps/chest/chest.css":"ea7ba2605235b0f7e02ba8a0437953a8458d661d3c49e22d2bc43f92eed5a12c","os/apps/chest/chest.js":"3bfc15d5682f935a32ae6db5f2e388ecc5b15d8e7b36dd58d0519c5321b50cef","os/apps/chest/prizes.data.js":"933574b9493f99d116a85bea2ac310b7e603c5baa9edaf41f256158204064e7d","os/apps/echoes/echoes.css":"ed18eb2b68b66e4beea5b42c47cf7221707ba07c04fbc766ff35b7dbdf495403","os/apps/echoes/echoes.js":"547391552f22dcc5da8e1f232ab0d6f11224b7608468aa288497730fd2418985","os/apps/files/files.css":"aa9db6506a7868d1305caa097961854e9d8b9ac9cd1809a12ac0ad304161e8a0","os/apps/files/files.js":"f830107cfc163a7facb8c4a7971bb0eb9b8fd57c3df7a3323e6f52a4c53ea57d","os/apps/handoff/handoff.css":"6885a1a6ad3510ad0d351fcf58d3511dca3e82c556d244041a0d9f80d27bbfe9","os/apps/handoff/handoff.js":"a08c33d58c38cab1a323ad0b969415b38957d1b5cae7f093be7673d49de38ca1","os/apps/keys/keys.css":"d21a941058de7e66fa69edc44f8b879b6f50679cd789fb3644c490dbd7d0ff3d","os/apps/keys/keys.js":"8d6d529af5ed4125187f71fd07d6e2b5b2b7f0260300b4e80af6d10fd1147f33","os/apps/lantern/lantern.css":"a411900349b21c806faf10bf0825974036effd948572eec9dc7be7f4a57a18f0","os/apps/lantern/lantern.js":"cde1ca4e9e29e8f5eb8eacacf46a460ed00901ff2fd4ec030cbddbfe79aea6b2","os/apps/mail/mail.css":"f019e03f716cb80d3829a65d99e7cd5a246d138dbabab06bed083839af540e7f","os/apps/mail/mail.js":"1914cbcf7ddb702e83d2cff94c2fa797762115d0ff33811b52f6eb4d7a423b38","os/apps/messenger/messenger.css":"43994d3bfa714af3e6348fbb562f738a21103fd13116b41309d5c90a3dac0f5b","os/apps/messenger/messenger.js":"1b13a844c8a2fcb1b40a16b35cfe8e38e00424d9a591f7f63d7fb3fd1a28d332","os/apps/notes/notes.css":"194996b88818fbfd90729643b293fa4278c0bb67ea3f4377cf39c72fc9673026","os/apps/notes/notes.js":"78da46d7080b10cab8e3f08a336ffb8d802889701893e7d9428eb19612902990","os/apps/outward/outward.css":"2baff57c3f9c06104bec8f51eae6b30ef64d823782220d6442090dbdaa3b6f67","os/apps/outward/outward.js":"b89273209965a8b027d9c8cdf2208d0f362fb01c333213a86221023f2cdf625b","os/apps/player/player.css":"feb1bd6d01de7a497d1dde05d8ab94500d974d1237e9b62ba801c32cf0e32e9f","os/apps/player/player.js":"8cb48b2acc8b558804a2a526e1a2a462bd8f99cfab76ffcb7064b0445c6d7e17","os/apps/project/project.css":"9207f3e4405f8c38a61ad370f455542438c2a85421fb7485e4e4cf6a6334f4c1","os/apps/project/project.js":"bbee3591222320e0cacc9ce7fd2d00a73926f78b1abf5900db3dc674d7832bb0","os/apps/search/search.css":"f937f19874c20dd8130695f1b5ddc34c4a8d80d4985ecfc57894a13676580d16","os/apps/search/search.js":"38226ebab15a7a08645c2fcf4651bbc39399e88f78ea1037826453a6d2e96412","os/apps/settings/settings.css":"28de366559323d67006219f55f943d927de366f680686d30cf9adb6c043e957b","os/apps/settings/settings.js":"cd292cc4ccf24c5d816677a3a0792b2051b439af2c23f13e293ea77566cf7533","os/apps/smiles-blanket/blanket.html":"bc6b5803bfde2e5c73920f9848e92bbacdeed38a468c96d5a9689f475b6a2c94","os/apps/solitaire/solitaire.css":"19ecf617ce9dbc2bb2ce6055a95f5da8ad1ff40de65dc8fab31786b9c016ebf8","os/apps/solitaire/solitaire.js":"e5b7dacec9c0d9151c57d7878e047801f1f46812cbe13adcc748847ee4193cb6","os/apps/vault/vault.css":"5bb64aa39ba814f74d6a6972dc1466eaad70191dded3e643ba73b3454678f5f3","os/apps/vault/vault.js":"a73ad2541f44a9f9dbe9fab2cc46f1a957effdede6f2baea694cfee12ea7fb96","os/apps/viewer/viewer.css":"770706e77b51f18fcbfc7cdbd523530d5813138cf2999761c850cbe5b798579f","os/apps/viewer/viewer.js":"2ad08034508711d6c8f87a93d520c88fdcd578868d7ea3588b0302a1b7255048","os/core/alarm.js":"269c8ec5adfc1068f36a5c0e3f3956adb9e54d5ec5d230c70969fc7660ad0149","os/core/alive.js":"980dac3a796bd4c4d805e044dd2f667700592b3acd985e0d127f85ef7f976323","os/core/argon2.js":"43d019699f884f9536270e3bfc3c6da9d9a56ff4d63e8a9931ca86259dc55720","os/core/baton.js":"303346bd3074343319b69a0ab3e48979e4ede39abe720cd829217b426c57d4ec","os/core/birth-live.js":"765fab513504abc4a36b1e6fe4ae301af0b9667fa7469e56f095c1ca13bb422d","os/core/birth.css":"f101cb33fc8e39560ffbf1f34608bcaab34a20ffbe1398dea230f9517c2f161c","os/core/birth.js":"ad0ee83505cb1836c00b5da09539d44fd6f2eb928e4baa7bb6870f55d282be08","os/core/birth/land-intro.mp4":"517bac2abaa25e4dad8a5a4f47465aa6802598c865f9fe8b79b79808b7c2fdfb","os/core/birth/land-intro.webm":"58ac986a982c3d0566de4f78e1f546fc19658f7100d9af8a9765bf28094513f3","os/core/birth/land-loop.mp4":"38d894f097891b7e7ebefed97e5f7d15933f287f10f09f7b7787e569a8913600","os/core/birth/land-loop.webm":"e037bd909c131ba71a5567f3f4da26ff99e7fda253e898eec4a81c29702fc895","os/core/birth/land-still.webp":"2b93b3e66755c3db61207d0c2c57107fd139125617d46d238fd0e37789ccc4b0","os/core/birth/port-intro.mp4":"500122dee780dc4b248c0582725e2a792c78f7265d28b55a5d63fb256f9271fb","os/core/birth/port-intro.webm":"1f334a3948adabef6da9adf74ea67425e12cb2723992d73a26bc26796c491342","os/core/birth/port-loop.mp4":"9f8fda655156bfa7ceeebcd54e8d942d7ba48dd8bd96dfa3a91b23b812775fd7","os/core/birth/port-loop.webm":"400ffddf4f5a270c742aa703daef9f7316052f5dad57e49945ee7b6b2f557564","os/core/birth/port-still.webp":"5be9350cc5191dd88899b3ecad04ae878d888a5ecdbb0de938dfed97db64ec49","os/core/calc.js":"885f0280a9790b33479c470689d2797e4c1d7c70452c86be8a5dcee9c1e81fb0","os/core/clock.css":"381642a8e0445a66a40ea3b1ffb45a723e72433fe8a2cec97bc5c0518dcdc644","os/core/clock.js":"ea69cdefe6f4430933746a095677485ec061cce15bf5bd524ff679349c9afaa1","os/core/core.css":"96b3461366d47cb4038501c5d4e932e4d345ee4ac6ce54b77597b1f29c63fd16","os/core/depth.css":"9947db8ebdc0fa760e19334468287c9ac14023daeb9eca22a892432473be9d77","os/core/depth.js":"2559177657033c225e4f6166afcc7c3549c6205235d6fccbfa46cd58a9eb0b73","os/core/desk.css":"7392eb84ee34a6ef450a6d8e2bf90b88776c7b01f61a86ee4e5a00bd19b44d39","os/core/desks.css":"489949d6341d37bb1f00332924eb324c47c17a179ae4b9bbb996fb3b3ddd0af8","os/core/desks.js":"95453d877913d1dc9f344c7b47be7d7064a4dd06151e486db20b0f4f3f2f3c3f","os/core/desktime.js":"cc11ef0bad3f2e8c6f678b6794a628f65c78dc4fc920167c0e9974c3af6e4a12","os/core/desktools.css":"450beb9be6c121c466b05d3b3af944ae834725ee95f9a9a10d471266fbfa518c","os/core/desktools.js":"00418d6a033e5974e33278ceff02a0858e69553cb138ff21e5f25075a10a01cd","os/core/desktop.js":"0ce1790f9ad0e48181788888f0095c6238f4f76e69faaeee47252b7d78dcbe8a","os/core/doors/doors.css":"c378e1ac7ea8f34f58df30b60019ca7483bccb5d4ac2cfc0ab9978e8425b0e05","os/core/doors/doors.js":"28fc81fcc8211afb48db4f5bae0d99f047ceba356f6b0c9a877c29207651c216","os/core/doors/porog.js":"ddc3622aca03b434e71f6b2f7ff7dbeb2baa359bf7a75e384685374b9787710a","os/core/doors/shifr.js":"219f314dcc7290845848101bef0347da1de2b456264383d400cfa9f6f1d2da2b","os/core/doors/sobor.js":"5292c4b515b1a0315cc4d8f6a233e62cf18ebc133bbe41d271e6c0b9fca506b7","os/core/doors/sobor/d-art.webp":"0c92de3347165c2c4abfa0c110f5f31f059c9603d3f433d257439a7a15b05d0c","os/core/doors/sobor/d-floor.webp":"5ac92baae8ece62a8cee0de486ddeec117b7555ede453733126076e87c6b9589","os/core/doors/sobor/d-glow.webp":"377ec4b78578297f020ba182f7c91641db62df97148d96f26c1c150663b60ab5","os/core/doors/sobor/d-mask.webp":"a529c24bf5bfbbaa12dc8ef8e68c9efcf565db80ed1061589a74881871b8c6b9","os/core/doors/sobor/d-near.webp":"1642d46670fcb8b67bf56c40efbcdfc805abbde3db31a5464151766e97e8d8ac","os/core/doors/sobor/p-art.webp":"fb92df08b8557939084c8fa7b76e4dfd4f7d9a43c880b61cfa87c26d873fb77a","os/core/doors/sobor/p-floor.webp":"0dd6b78b0898160a64ed3ee1fd2d220bb3cc8bc8dcb58cbf9352f6ddc574da5d","os/core/doors/sobor/p-glow.webp":"60fc9aa65054b6ff5707243346f483a4cad355fcc93f1b6d45dc28d968e087b2","os/core/doors/sobor/p-mask.webp":"31baca9efcb82e0433b2bc4def3ea7d95fb3b01f6d9e1631d4e40354dc7f1213","os/core/doors/sobor/p-near.webp":"7d3c2c13cb6df499659401652c9d2bff511f25115cd0b96792cd86f8ba75834a","os/core/eclipse.js":"a93ecf3efaf6174043d268ea6ebf5d718c9fa3971f45249af057b837fae6b179","os/core/field.js":"9f35f5e645eee8a78cc5449db81721aadb8153cba7541a186df2d039d1c38456","os/core/fill.js":"5dd336f4326508064bbc933cbb76ae9a1380e76cba0b11597da27e0414cf7d53","os/core/friction.js":"317f81ae7f9f631ae995f46705feedab18d5440b44ee5835426cc5380b41f695","os/core/gate.css":"a90c196584fa4b7ad85874253e60f6b9141647b6104acee8456b251538409882","os/core/gate.js":"018c7ce5281c16db363458644c5ff5ecf7540692b76b5495fe161a27dfd850d9","os/core/glyphs.js":"26a4d259cf22a9481cbfa6bda865914891cc2617df02be766b2837e3bff40e04","os/core/hand.js":"a1182443cf173cfbc92d5cb8016a413999fc4eb0e1f9b5219b51cdfc8b2be896","os/core/install.js":"43c8a5dbfa17a0d8370fd5559459304bf8b9b3083eb9a548a4321dc0de108165","os/core/links.js":"5e4d35ccafe19ce089260311dd261e1effdc40d11a26b864f8e409729799e893","os/core/meet.js":"ebc211e1d3ddd1ee4ae642dd8b3f357733b6b8a810186324315e403d8793bb73","os/core/noise.js":"0036ba7d117addc030b19d0d8a9461f9ebe9c5125b8314e95224c3e4fd43ae67","os/core/noteplus.js":"409215d1c57b9a04ebb0860889a333f5a5962679175d7d4539ed764c54510b63","os/core/palette.js":"3747b6d7388d4e5b4e5a7c8c31d5c1115579ce5f2a32d5b8af459aee7958a6d1","os/core/panels.js":"e5b930a86af3ea6b4f39b73a0a9959462314034e14de5ea37e9b6e43f29bb70e","os/core/rights.js":"8a923145c762efc1e5a4e8fbf1f9d70abf29b7d77445c4bc2da828a8f7022448","os/core/seals.js":"8fef0372da4b031da42238d62790bb7c371637c5389fec686742f47094aaad08","os/core/share.js":"9e17a006009663700b45fc4a3ed304f6bf1cd7751c3bf2fa69be3eaf49931e4c","os/core/shell.js":"cbcd5af4f7e140f5d5c4c5611c827015028fbf666951fbcb655617895e49809a","os/core/shepot/core.js":"641e069c6086262764eb484d2a165b9476745a6f220f8b814e20d09fc8ae8cf2","os/core/shepot/lib.js":"7ff438fc7d5305854a47d180ba3ddcba6781bc19d3768ec2ee56084b1aecedc0","os/core/shepot/post.js":"e8886f58086d8aed3c96d2320dc7551ae0a92d188048f5a927270286cc048a0a","os/core/shepot/room.css":"4ea2271cecd2cb8d9fe4b1bff6fb37b02b00cdb1121d016169e485ec40db32e9","os/core/shepot/room.js":"963b89be46b5e63f03a13c05b9c451e3fcf37016e7317b6e1a62881584a3f5be","os/core/shepot/ryadom.css":"db1a6337a241f57655bcdcd21faca20174851101cb12d9de9a6082f4f8a1ee10","os/core/shepot/ryadom.js":"221ced376e64b16c75919b8f97f85c307daeadc7ed882150939f4af8a135737d","os/core/sky.js":"1cb0867562b96ca238bcbaea0633c4f1bc0bf3f4caa7fa1406be728f8dbaa115","os/core/sled.css":"067bbd256087bf29e6b8d4a6dc0fcf8f21f5cba336c3b89927b12d1851ef04ca","os/core/sled.js":"ae3d522f58b298b77b76dd54e4a453191b3adf1e145192ff4d660c320ff1db57","os/core/smiles-font.css":"1a73ac63c63fdab3463b37e24e060f069390f4af2783214a0e87be475c601a9b","os/core/smiles-sets/chastitsy.css":"99b7abf7e0d3bee92df5c2e89f734baa0cc2c0be0381b1f6260379106c253bde","os/core/smiles-sets/chastitsy/calm-b.webp":"b71be41a09ca6a1d99688364de96c9edf2511737f68f7572afe98099b88f2d20","os/core/smiles-sets/chastitsy/calm-s.webp":"d0bdc569c5311f60662210afc2571098bebb324bd3f5efcf8eba56f085ede984","os/core/smiles-sets/chastitsy/happy-b.webp":"54590a505afb3ca480c5eb31318952c6fa07654628b08014e9c1e08a4dfef177","os/core/smiles-sets/chastitsy/happy-s.webp":"7e7fb213cb4c558176a6383867c9ac754d362e66dca268738505c5bfd98a3a87","os/core/smiles-sets/chastitsy/laugh-b.webp":"c9ad4d1985201d96a350c6adda4fb647b5acea4b8741537404ce459a7abcfc03","os/core/smiles-sets/chastitsy/laugh-s.webp":"e6af0b5be2eab22e9382cfc208bda275f5c114c68a4f2973bc210d6c6fe13fc3","os/core/smiles-sets/chastitsy/love-b.webp":"485296b5b1d55426d49e815ef05e080d82c22791242b618537ee71347b2d6b35","os/core/smiles-sets/chastitsy/love-s.webp":"73955ae153c593bcea6938b17b6cf1b96efc4848be92d0ee484ef5d9c964c1ca","os/core/smiles-sets/chastitsy/sad-b.webp":"e58d5b1f5ca8ae3137736aa56c889d5f5a61665b9d18c882802b9b55f654e753","os/core/smiles-sets/chastitsy/sad-s.webp":"54d5673167af3264f49db56558f28efb880726e5c5c8d4622fe42c28196c0c5c","os/core/smiles-sets/chastitsy/think-b.webp":"b5ce3360a39cb0feb94b054687fb7b2d0dce3a71228e53f6d2138cd07e4f7afe","os/core/smiles-sets/chastitsy/think-s.webp":"866b0334567f50d0270aeef622c8c595030f796379f78399110ee53ee6f87b29","os/core/smiles-sets/chastitsy/wink-b.webp":"684cb0a924c8764b2e07e74dcf7cc6c54cdfc1378d02482c0b1d7bad0f609dce","os/core/smiles-sets/chastitsy/wink-s.webp":"67d6383a643d6edb591e9404f946a03b22a6a796734a5842dd92e23f371a4b38","os/core/smiles-sets/chastitsy/wow-b.webp":"182d503c5e8ca2d69e41c98761d82c015ef0288134a471f3e09fa7019bba51db","os/core/smiles-sets/chastitsy/wow-s.webp":"965bdc2ba28230ff7a74dae4679a164d459c264779b4ac14935419c11b5fc041","os/core/smiles-sets/kosmos.css":"e523aa58e7a1ae61f83b724c2ef623db039db6de864a21e2b419a0f3789c84ad","os/core/smiles-sets/kosmos/calm-b.webp":"372d0071ad121781cebe7e2c433aa368b55d2c86add5b71aa958a1e8b31ec09a","os/core/smiles-sets/kosmos/calm-s.webp":"cd74d925db01e96109795727755b56b6ba837d4d5ef54fb277a549883a7e4719","os/core/smiles-sets/kosmos/happy-b.webp":"a42e7654ee4959cef33feffec3fe60b27cf31393e85326dc88e9ded5d646b75f","os/core/smiles-sets/kosmos/happy-s.webp":"03d6756a6c1d5537228465fdb97acf33023e191572aee3229c13e6e7a8051396","os/core/smiles-sets/kosmos/laugh-b.webp":"456006fa5b1dd6a7f5f2fb4033d00b7920afa371afda96077a83a4dce5c4ff99","os/core/smiles-sets/kosmos/laugh-s.webp":"ac2bf122ce88789fdac1938e0f2829de5a8b8d4b0baefd38500c9bfe1745ef18","os/core/smiles-sets/kosmos/love-b.webp":"8a8725a9b35b4197d81a970677397a316d3d9f1eaf418b9ded476c1f44332011","os/core/smiles-sets/kosmos/love-s.webp":"27707f3450d2c5a2a39e33c56e1af5da020b64aefd36fd8cb8468c42ed1ff18b","os/core/smiles-sets/kosmos/sad-b.webp":"64561b120a26b373cd46a8fd20c4c01f3dd75009898e5867868f3098878c221d","os/core/smiles-sets/kosmos/sad-s.webp":"0719d18ba8412faa2f0da83f17203f8b13d0d2110789be847923bfc0133cf877","os/core/smiles-sets/kosmos/think-b.webp":"29239192f77ef5c571d3f02b2ff495f23fbeadb614070940b29eaf4a2b1eeebc","os/core/smiles-sets/kosmos/think-s.webp":"7d58c999f0efa43defa133f69f568e17cd8f668d181a81369755d4c33dd35ef1","os/core/smiles-sets/kosmos/wink-b.webp":"20b8d97caadd1c76de87ece0ecbdf4d4e2fde70d0557a2cecd45e536e861693e","os/core/smiles-sets/kosmos/wink-s.webp":"71812167a4977f2b9899ca9f955f296c7d5fa77578de9a6a1c0319a174c2962e","os/core/smiles-sets/kosmos/wow-b.webp":"84834b5848df69ac67e65e340b5e9e7b06c94dcfd78087b8ab1f9280b762a631","os/core/smiles-sets/kosmos/wow-s.webp":"636b18982b43a286de3f55201a264b4da6f6ad8265901d6af8f1268841b922f5","os/core/smiles-sets/mir.css":"c0db6b1ccff030ab76e92ca4efa8965969f5b63828044f3d980124df14f14696","os/core/smiles-sets/mir/calm-b.webp":"9a6f72dbf414949b641766ee6f9a25e3e34fb1010b2ed6ad545c08e3141a500e","os/core/smiles-sets/mir/calm-s.webp":"89d932745680acb1b285d9e28beeca8f9c0e3b43ff31093d48be1c4860dbc7e6","os/core/smiles-sets/mir/happy-b.webp":"3bd143b65e0596e45b1579a847a2b813901fd0d49b0ec7e1ffdd89b2c9f89980","os/core/smiles-sets/mir/happy-s.webp":"2075f02793f9aa1f64dcbc9051c98f0fecf71dad5f659d99d39ca6d6b1f29e06","os/core/smiles-sets/mir/laugh-b.webp":"7b3ffcb733ade6c04482950f4a5d3304e1e97d3478e529d1bc3a5fd324cbea45","os/core/smiles-sets/mir/laugh-s.webp":"b756ca5c678d5d6437d9107026d8a1ca9d9b3306345d279dde779dc35c20ebca","os/core/smiles-sets/mir/love-b.webp":"6afabb91facc6e0ec9f3f9ceb2bbc9d8f2fd14514609d3ac7b91a71976c8ec9d","os/core/smiles-sets/mir/love-s.webp":"d67ddf82a8a82c46b9a26baca57638dd4c17a41d847ed33de4142442e1ae6665","os/core/smiles-sets/mir/sad-b.webp":"f74c4cc2a86254ede093cd318d61e0d1006ec2e1f84a90e62c15df6b112f7013","os/core/smiles-sets/mir/sad-s.webp":"55e569811c9157a27d275f55050f7bd274da07524615671bdfd6b9cd594657ea","os/core/smiles-sets/mir/think-b.webp":"0164bd9b6b9e6a52bb1ceeb7af16af8c6f9fbaae4d9b41ddf591e4abf125706e","os/core/smiles-sets/mir/think-s.webp":"4deb6ba4012a64721a7b2ce8515c07046f6477a77306e5d2ebc6fc202749fcd3","os/core/smiles-sets/mir/wink-b.webp":"4ccc60ab4db6a1bde2d2a3903ad3d737028c5a2218aefe4e471b76e25b28059c","os/core/smiles-sets/mir/wink-s.webp":"8820af39bcbaa90479bdb91dce12f5e7beb314f046b41fb7504fb89396590821","os/core/smiles-sets/mir/wow-b.webp":"7c3364b431fc362bde63354303f5e2fcf9f9da77664e3c2b16613aaac64cb25d","os/core/smiles-sets/mir/wow-s.webp":"2e713dcde27ddc0dd8f751c9a90de9c1453f41e3969d78b45afbca30c1c0a64b","os/core/smiles-sets/neon.css":"e52edaba17919546031e8beb112abbc5d19beb07d29d8255ca1a0a5d8e5ad45c","os/core/smiles-sets/neon/calm-b.webp":"0fc8e9a9fbf1e6fba6f2b683ff4d9e82f3d9dfdaf0ed395ad7840b42913c572f","os/core/smiles-sets/neon/calm-s.webp":"dfb94ac89d07f511a1967bba52a6740d04676eddd83343b08e5b302bd7785ec1","os/core/smiles-sets/neon/happy-b.webp":"ad5537432b8575ca9d0cb6a83c34a59baccb678354cdc19e3b7f1c92befae490","os/core/smiles-sets/neon/happy-s.webp":"9352fa3aa71365fe21aa3ebeed5a1f2933b7e9365de7c7bc68b7fe881b52a5fd","os/core/smiles-sets/neon/laugh-b.webp":"c3c05751c130b92f4e777896ca5352d79c2792194977a9b61446bff1ffc9b2e9","os/core/smiles-sets/neon/laugh-s.webp":"1b81160bf51afb2622167404905eceff325c27d724225a58b01c08863303d0aa","os/core/smiles-sets/neon/love-b.webp":"17d25f36a515017d58f5640bcdcac1013dee229c2b2cbb85536105521bed601d","os/core/smiles-sets/neon/love-s.webp":"a72722df8bf06f82d672d0c2e291983e88f53ce81c8288b48bc53ea0bfa8363f","os/core/smiles-sets/neon/sad-b.webp":"5b01a55676e29d8db76088a35dbdce4f9f61ac8fbe26e7582cfb19dcebe7e438","os/core/smiles-sets/neon/sad-s.webp":"df4c49885e3fb924a405fd56bd5daf99650832dcb1807921f79a58581fa74a64","os/core/smiles-sets/neon/think-b.webp":"1adf8668928d7c0133d9d792273212cb20933cdc9df7ffea2d3041c757414710","os/core/smiles-sets/neon/think-s.webp":"d4cc34db51bd9bf4020c34bfeccf28e65987796561acd296cdad7654387f0466","os/core/smiles-sets/neon/wink-b.webp":"ba4e8371c81c1abb9b55cfa615ef250b7d9ed948d4066d22e371116b4808af91","os/core/smiles-sets/neon/wink-s.webp":"876a1862b5146e4001dd46ca58810953a0cf3830b334d6ddab40dbb47bcef07b","os/core/smiles-sets/neon/wow-b.webp":"2d66c9f0d8901c7b00559f38a1b760825b46075f6c82cf90504f3c51b355ac34","os/core/smiles-sets/neon/wow-s.webp":"5bd80ec87dea0aa2a3e284be9ba6db9e52fa5143b85fdac65e5efcf757e4a60a","os/core/smiles-sets/plyush.css":"2d45f003081f803112dd390a9805bc81e86cb71e2e1d6bbc1ee766b964827dd4","os/core/smiles-sets/plyush/calm-b.webp":"96640142bc0593822c108fa1a0ecffcb297580088fb5d6a33cdad24895af98de","os/core/smiles-sets/plyush/calm-s.webp":"45f34047b1d3184ed089f958cc50fc34f01aaf26eda1ae5ca409bdca10907eab","os/core/smiles-sets/plyush/happy-b.webp":"8209cb6a76815b98a4e9fa3b728d147e80f208f269890f1cb5114900647551b4","os/core/smiles-sets/plyush/happy-s.webp":"ca0b72388c6e9d9f5907eae4e7f481060a516a5f85d01606c9d785edce3c3e45","os/core/smiles-sets/plyush/laugh-b.webp":"005e22bf1d5d54ffa9074a4b3cc900e420314e0e08dbee1cdac2873fc8227959","os/core/smiles-sets/plyush/laugh-s.webp":"22b10b19a398014f7540232c15289c35fc7888498df7686307e2aaab327561f7","os/core/smiles-sets/plyush/love-b.webp":"1dd1bf6d4f5b3afdb306ab7dd467e7d0f95ba26c1f4d9a760c9930cc99475389","os/core/smiles-sets/plyush/love-s.webp":"d7479b99706286bd6236f2bff435644703ebc46e5391929101bfd4bd4449ef17","os/core/smiles-sets/plyush/sad-b.webp":"fe90f0aa49923beb65456009c440418ed9dab4ad3bbdf4309d08fb28e227fa2b","os/core/smiles-sets/plyush/sad-s.webp":"0a66917ea6daabf0e8a9b1f99693bcd31a7d66b40c80902c008e47dc0ac48b2d","os/core/smiles-sets/plyush/think-b.webp":"88d3d2ac233a54d959727acd0bb23db999fa3dac47f4e51dc3d05f01bdd8721f","os/core/smiles-sets/plyush/think-s.webp":"e3ad618329caf8832990e2eecd85fdb147b6c5f4bb5b5112991b702fd4f3c39d","os/core/smiles-sets/plyush/wink-b.webp":"02e44639e31d35e2f5b5371c30bda72c221986c5b3e77d6183143ae0398ac11f","os/core/smiles-sets/plyush/wink-s.webp":"76eaac0fce77d7955a032638e4d27e6de9d49818699fdd10c8964f440ce15ba3","os/core/smiles-sets/plyush/wow-b.webp":"28ae69486e76e5a3d4a214ee72325f810d4d87cc49658b3719b566587d7c93eb","os/core/smiles-sets/plyush/wow-s.webp":"55a02fcf99a7f1264421773b965eded0f20203cbd2f28c7d451933a8229a5dde","os/core/smiles-sets/steklo.css":"ea771938fa2dae2f38713c1b404bf8b773ea87132480a1d73cf2faf7fe71a465","os/core/smiles-sets/steklo/calm-b.webp":"1908a4b61a0da0228672658a49a1344822c9ccc6d29d26afd372a6398dc53d14","os/core/smiles-sets/steklo/calm-s.webp":"bf607bb8a89feccceabcd250aec2ab0b103c0fcf0a798fd2e461ff0ceb70793a","os/core/smiles-sets/steklo/happy-b.webp":"4c40475cdb3c7debf35001d2057800280b1a6179c900721ded807955a2088da4","os/core/smiles-sets/steklo/happy-s.webp":"c738c3229cdd9d66a4c97e2a5b867be2c5a9fd606e7ddb9be08b1e8892fcda9f","os/core/smiles-sets/steklo/laugh-b.webp":"85372735fab6085d85959dd383c98457983fddc602d24b0b97ea2542b24d29d1","os/core/smiles-sets/steklo/laugh-s.webp":"9889eed6fc7c69f27fcca05ec3476ac3b8aa1bcb1beded40619bdefaa487cd5f","os/core/smiles-sets/steklo/love-b.webp":"724d29d39dd48ddb2425a28c1082010813653566633719d28dc933b001030df3","os/core/smiles-sets/steklo/love-s.webp":"2c3a1c2a065e10eb9316b326eb9acdc390fc841861a07a0f4c4f282ce58e3737","os/core/smiles-sets/steklo/sad-b.webp":"9ddb828329595821c52fdd35c902f986daa5c8eea2140fb35808427640cf83a5","os/core/smiles-sets/steklo/sad-s.webp":"79bdb21e0ca125576ce36d011e80bc56c548e54f93aae97ea4523b7909678ea5","os/core/smiles-sets/steklo/think-b.webp":"e5ea1e42ed2e6a13dd22de0aa7e4c3bef232d34d6ec13ca1e41ce978f92e0dfd","os/core/smiles-sets/steklo/think-s.webp":"aa2dc68ac7351ce0c3c0b0362addb1d4e3f3a37413bd7fe25671fee5cf4c945a","os/core/smiles-sets/steklo/wink-b.webp":"637adcc4e1928dd7f237a3629c02ed219fa90615a85de6bffee12db31a55a47a","os/core/smiles-sets/steklo/wink-s.webp":"86d8f660d58173815e6ff4a92c2bc38825d770acd5dbdf37e990dbb96fec60ce","os/core/smiles-sets/steklo/wow-b.webp":"335dfb85c30ac8eab38d679fa2fd215f4ef86efa005a6da81e3430ff26504bbd","os/core/smiles-sets/steklo/wow-s.webp":"6f800221340fd43c38dea5300c3bb8b04733dea97ec70f27745f5f49bef19017","os/core/smiles-sets/zhele.css":"f712e61a10ea3f9aeeeb688f42201c9d4d5fbd6df1c157cd40b80c771431069b","os/core/smiles-sets/zhele/calm-b.webp":"fb92219701138fa675c7db022e87b96477300ba1ab0cd303535b683ac7a37778","os/core/smiles-sets/zhele/calm-s.webp":"d2ca1abb012d6d987e774867f1613fe789051dea190fc3d3533c37e5d0d6d2d9","os/core/smiles-sets/zhele/happy-b.webp":"f3b8d9400f122a244a951e14a704ec20f66dbeef86f2a3d5e4205d355ba849ed","os/core/smiles-sets/zhele/happy-s.webp":"5d6a4e4fe343e77b14fe6d323c869373377bbf87d6a12ac05a3d67cc483ab0e3","os/core/smiles-sets/zhele/laugh-b.webp":"9d24788858d0c7c4facd0303f9e2551a6c2b53bbd0dd302bbcb39d7ed17124cd","os/core/smiles-sets/zhele/laugh-s.webp":"bf36d05817d3d71841e1846dad4b383fec7edc410c571477c58d6fb3600b623d","os/core/smiles-sets/zhele/love-b.webp":"5a7596d766ab4e768d1e8b8311555ad80db93a7b7bc1d4404826769ad1e06cab","os/core/smiles-sets/zhele/love-s.webp":"b51867fc64b36ebd8444b23b6594e9099e82428bf82bd275420cbe06092509a4","os/core/smiles-sets/zhele/sad-b.webp":"73f8591536415a21d67e9ece3474028883fba8c30475b931d3c76516576b13de","os/core/smiles-sets/zhele/sad-s.webp":"93c48cc0afdda41adba5db1d5b1a5274a568aa0e46ac0efe2da85f54965f7db9","os/core/smiles-sets/zhele/think-b.webp":"91fe2e169c1f7e2f6c180443753156587d67120f1c34a0d070f966b30489d41c","os/core/smiles-sets/zhele/think-s.webp":"895d6c7d95b871ba57eff50cd01415a684f7917ac818112435c103e5cb6a0262","os/core/smiles-sets/zhele/wink-b.webp":"7fcd14eab9ff7e608732b29d8fef0db89b6fdceb43c4a2ce2e058cb983529e95","os/core/smiles-sets/zhele/wink-s.webp":"7b10295828132ee511e009c0b8f13a436060f69250c85d3ca29031961c93702a","os/core/smiles-sets/zhele/wow-b.webp":"02b76cdcf0bab012b2159017a8e3fe23a5936f3af13352cdf6d28b3ace420dd4","os/core/smiles-sets/zhele/wow-s.webp":"a431d8f1935e6943254bd4957ca75d1f1208fef8dc4c31d612d27a8026b82a43","os/core/smiles.js":"45d9826c6df7036bea16b6ab648984732d236df707e033a7240c57c937587b76","os/core/store.js":"c088397f113edb5fa5ca09020a7180091ddae913df2ad6c4eb1c9ac189e16559","os/core/strings-chistota.js":"23e01200510735f65594a6e3b0dd01af025a6783ed1548676c64509231956f9c","os/core/strings-desk.js":"287303cf92a3c8c274d31c03ee78b53aa8b4d554a44ae0daf1fb59e44d3a2d52","os/core/strings-instrumenty.js":"d8d1b4a965c60a3667e007f24733b911ed60acbc1026054d311208a61ed10ac2","os/core/strings-meet.js":"a94a1805805d4366a394775cd7d0f6a9959afd4ece9e7c9b5e8eb204e8b136f9","os/core/strings-ryadom.js":"58ea172c3702f5a52420c78514817bb75bb35e7779537a9628ce0087dc5f09b0","os/core/strings-shepot.js":"7bbd56c317776f20d7c41f94820485a771d242e7bc6bdf66c114d551c45f9b8a","os/core/strings-themes.js":"1b6aee9a5dcbc5ec97fd9fb1435784442343c393053c885b136724d0dd104ce8","os/core/strings-voice.js":"c579b4332ee23df3bbb74b26ed3fd404591c8414fdf463e58358fdf66d554eb9","os/core/strings-vorota.js":"5775ffc6ff64b7de869613f1686c8710c08615c68b250ec498b84f8eb7c94744","os/core/strings.js":"4737c6445f8f63454d223df93313baacc3438364ad86ef073409471b63c352e9","os/core/survival.js":"898063082edac240356cbe691ce0cfd65bcb34a4503f4dfc431068ac857fa817","os/core/svetlica.js":"faab69372809f889a9faeabaf42e21adf52d16d6609014962342d926154205cf","os/core/sync.js":"dc46f67bc92a57e9353572a0746abe4051ebdfe4c042cd67ff2d78ec7cd9c693","os/core/tainik.js":"92eae203655831804204aa5cf87c83303ca46ae4f95376531499bfb3dba4b3f0","os/core/terminal.js":"797fea4b9335961c69e2b3d23cd7321542780b28cc24e5d4b4a4c04ceb97f01e","os/core/themes.css":"366e82bdd704c08246bf72a359643a485bf5157e526c511a8bd15d6b9135ac1e","os/core/thought.js":"c974193d61fb56c770ae75a577276045051c9c7cd39739fed27c7f9ce9b63d11","os/core/topbar.js":"967ac9ca06943cf4da3ce3ec3ea91b6309146f648a5c1684e662e1739c584f51","os/core/voice.css":"0fddf532af8fd02631bcfb16a858141f479e7ea86aef66c22517b091f040247e","os/core/voice.js":"f53f0fd454a70a5460f473112522611e197bfc2c85c15d9455eed34b191ad912","os/core/witness.js":"9b1b876057f60334949a810fb166326696fa7b38a87aa8d85e9c49cf0f429464","os/core/words.js":"ed4c7c59aef9a7058a2fe8dca41cf2385c5d0dba2cd80f4207879a6128e5c290","os/fonts/nunito-v-cyr.woff2":"2bb0f30bfbb01aa28327a48b82c29d9ba602723f64a550adcde17a53e3c327cc","os/fonts/nunito-v-lat.woff2":"4de2c9b802bee4eb1c45e392a015da3846c91310aad2048a4232ea75b0d33dfb","os/fonts/sb-smile-h.woff2":"b13931878c29231780a8519b64121c1f20309893b7b0ee3f2e36ae9c38bd4a43","os/fonts/sb-smile-l.woff2":"43468ecb0124b4be6ecb7d64a1c47c3ac8775ef4ec5e3e367b72785185b4ef85","os/fonts/sb-smile-m.woff2":"520f7cbaf7ffc68557f741daa553979d987c18f9d51aee84e89c150613dfaf92","os/fonts/sb-smile-s.woff2":"562d33b1339bd22a510d661329fa1a85e513824e7bc280492d35ebb3897ae1aa","os/fonts/sb-strut.woff2":"6ea7b31c54bae779e0ed4499e03fc5246b8327f29a6c741fb5c03094c3b55670","os/forward.js":"539b5bf800f192d97293d28b32eb3829f589b9c4d7d6753218a8de4642d9b57b","os/icons/sb-192.png":"6851c2264e9b1b6a2f66724aa441e681a440bfd52801c1e0dd973c8aaca86b6a","os/icons/sb-512.png":"e0edb06962f8aa09fbe2f5cefa19a8da74439af9348843e20667f21de488ff6d","os/icons/sb-maskable-512.png":"16d954eb4d2138eab29f41858e14f1a6224070e93b307ae46ef523645a304217","os/index.html":"634fc0cba5077b26b61a54a8a4b4f20624ad89da7da3751cb617d8e1f0fa5dc0","os/manifest.webmanifest":"0762633c05fbeebc39b36a57c6d64ad4cc8d221839a928a37a3a67284265b9dd","os/sw.js":"9af27ccf26609ba83d8b4460c056b84e5bafa6a6e8410fb321486d9605d20451","os/widgets/payback.js":"0cda2003e6163aca995fa77bfe0e91b5b8edc65ed654479cde2309e85f298c12","os/widgets/quote.js":"ee9b2f78d53c81b9b1e6468c97c3b72cdd33b67682361790667126d62e04afc5","shared/floor.data.js":"9f45580dfeb23a56ea67510c83cf9f6ffb8a91bd37cf7a09b25b45ffac28bcab","shared/outward.data.js":"22301dcf5053f7bed757fc051ce36d4ddf3a329de46cba4a5a2ef5f4a27e6b27","shared/pricing.data.js":"78d2d5477f31467ce8dac74311f9b53563382118c7e74657155fe324390d7979","shared/system.css":"72b96dff9205b42c756317fa3a3b568e5cc4e33a9afe0f3777d28a93b02e2df5"};
var OPIS_SEAL = "e3adeaeb73041dec4cd842dc5b9b3b2d0545bc98d6e072431dc3b91414c5feb4";
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
