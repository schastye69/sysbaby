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
 *
 * ИМЯ ХРАНИЛИЩА НЕСЁТ МЕТКУ СБОРКИ. Новая сборка — новое хранилище, старые
 * стираются при первом же вступлении в силу. Так человек не остаётся с
 * половиной старой и половиной новой системы.
 *
 * НАРУЖУ — ТОЛЬКО ПО-НАСТОЯЩЕМУ. Всё, что не с нашего адреса, идёт в сеть и
 * никогда не кладётся в хранилище: письмо в студию либо ушло, либо не ушло,
 * и подделывать ответ из кэша нельзя. Без сети приложение скажет правду —
 * это уже написано в letters-door.
 */
var CACHE_PREFIX = "sysbaby-shell-";
var CACHE = CACHE_PREFIX + "unstamped";

self.addEventListener("install", function () {
  /* Ждать нечего: опись придёт страницей. Встаём сразу, чтобы первый же
     визит без сети застал работника на месте. */
  self.skipWaiting();
});

self.addEventListener("activate", function (ev) {
  ev.waitUntil(self.clients.claim());
});

/* Опись и метка приходят от страницы. */
self.addEventListener("message", function (ev) {
  var data = ev.data || {};
  if (data.type !== "precache") return;
  if (data.build) CACHE = CACHE_PREFIX + String(data.build);
  var urls = Array.isArray(data.urls) ? data.urls : [];
  ev.waitUntil(
    caches.open(CACHE).then(function (c) {
      /* Поимённо и по одному: один недоступный адрес не должен обрушить
         всю опись — иначе одна опечатка оставит человека без системы. */
      return Promise.all(urls.map(function (u) {
        return c.add(new Request(u, { cache: "reload" })).catch(function () { });
      }));
    }).then(function () {
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
   Каждая ступень ждёт ответа прежней — пустой ответ не должен выдать себя
   за найденный. */
function fromShelf(bare) {
  return caches.match(bare).then(function (hit) {
    return hit || caches.match(new URL("./", self.location.href).href);
  }).then(function (hit) {
    return hit || caches.match(new URL("index.html", self.location.href).href);
  });
}

function sameOrigin(url) {
  try { return new URL(url, self.location.href).origin === self.location.origin; }
  catch (e) { return false; }
}

self.addEventListener("fetch", function (ev) {
  var req = ev.request;
  if (req.method !== "GET") return;                       /* отправка — всегда живая */
  if (!sameOrigin(req.url)) return;                       /* наружу — только по-настоящему */

  /* ДОКУМЕНТ: сначала сеть, потом хранилище. Так новая сборка приходит сама,
     как только сеть есть, и та же страница открывается, когда её нет.
     Документ кладётся в хранилище под адресом БЕЗ строки запроса: строка
     запроса — это то, что человек принёс (?share&text=…), а не часть
     оболочки, и на диске ей не место (D-345). */
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
        var copy = res.clone();
        if (res.ok) caches.open(CACHE).then(function (c) { c.put(bare, copy); });
        return res;
      }).catch(function () {
        return fromShelf(bare).then(function (hit) {
          return hit || new Response("", { status: 504 });
        });
      })
    );
    return;
  }

  /* СНАСТЬ ОБОЛОЧКИ: сначала хранилище. Адреса несут метку сборки (?b=vNN),
     поэтому старое не подменит новое: у новой сборки другой адрес. */
  ev.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      });
    })
  );
});
