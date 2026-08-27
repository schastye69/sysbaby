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

function sameOrigin(url) {
  try { return new URL(url, self.location.href).origin === self.location.origin; }
  catch (e) { return false; }
}

self.addEventListener("fetch", function (ev) {
  var req = ev.request;
  if (req.method !== "GET") return;                       /* отправка — всегда живая */
  if (!sameOrigin(req.url)) return;                       /* наружу — только по-настоящему */

  /* ДОКУМЕНТ: сначала сеть, потом хранилище. Так новая сборка приходит сама,
     как только сеть есть, и та же страница открывается, когда её нет. */
  if (req.mode === "navigate") {
    ev.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () {
        return caches.match(req).then(function (hit) {
          return hit || caches.match("./") || caches.match("index.html") ||
            new Response("", { status: 504 });
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
