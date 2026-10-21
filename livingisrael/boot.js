/* boot.js — до первой отрисовки. Ничего не хранит и никуда не обращается.
 * 1. Помечает, что JS есть (.js); если движение разрешено и браузер умеет нужное — .fxp (эффекты).
 * 2. Пролог «И свет во тьме светит» (Ин 1:5): только при свежем входе — не по #ссылке, не при
 *    перезагрузке и не при «назад/вперёд», не при «меньше движения», не в фоновой вкладке.
 *    Запоминать «уже видели» негде и незачем: сайт ничего не хранит (раздел «Конфиденциальность»).
 *    Пропуск — касание, щелчок, колесо, прокрутка, любая клавиша или кнопка «Пропустить»: за ~300 мс.
 *    Медленное устройство — короткий пролог (~2,5 с). Слой пролога снимается из DOM в конце. */
(function () {
  var h = document.documentElement, w = window;
  h.classList.remove('no-js'); h.classList.add('js');
  var ok = false;
  try {
    ok = !w.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in w && 'requestAnimationFrame' in w;
  } catch (e) { ok = false; }
  // .fx ставится сразу (то же условие, что в app.js): иначе позднее переключение класса на <html>
  // заставило бы пересчитать всю страницу посреди пролога
  if (ok) h.classList.add('fxp', 'fx');

  var type = 'navigate';
  try {
    var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    if (nav && nav.type) type = nav.type;
    else if (performance.navigation) type = ['navigate', 'reload', 'back_forward'][performance.navigation.type] || 'navigate';
  } catch (e) { /* как свежий вход */ }
  var fresh = type === 'navigate' || type === 'prerender';
  if (!ok || !fresh || location.hash || document.visibilityState === 'hidden' || !('animate' in h)) {
    // пролога не будет: его разметку убрать совсем (без JS она и так скрыта атрибутом hidden)
    document.addEventListener('DOMContentLoaded', function () {
      ['[data-pro]', '[data-pro-skip]'].forEach(function (s) { var e = document.querySelector(s); if (e) e.remove(); });
    });
    return;
  }

  h.classList.add('pro-on');
  var c = navigator.connection || {};
  var slow = (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
    c.saveData === true || /(^|-)(2g|3g)$/.test(c.effectiveType || '');
  var state = 0;            // 0 — ждём первый кадр, 1 — идёт, 2 — финал, 3 — снят
  var timers = [];
  var q = function (s) { return document.querySelector(s); };
  var later = function (fn, ms) { timers.push(setTimeout(fn, ms)); };

  function done() {
    if (state === 3) return;
    state = 3;
    timers.forEach(clearTimeout);
    off();
    var pro = q('[data-pro]'), btn = q('[data-pro-skip]');
    if (pro) pro.remove();
    if (btn) btn.remove();
    h.classList.remove('pro-on', 'pro-go', 'pro-short', 'pro-fonts');
    try { document.dispatchEvent(new CustomEvent('li:prologue')); } catch (e) { /* старый браузер: печать начнётся сама */ }
  }
  /* финал: пламя летит к курсору первого экрана, полосы уходят, свет открывает пергамент */
  function finale(fast) {
    if (state > 1 && !fast) return;
    var pro = q('[data-pro]');
    if (!pro) { done(); return; }
    if (fast) {                       // пропуск: сразу к концу, ~300 мс
      state = 2;
      pro.classList.add('is-cut');
      var b = q('[data-pro-skip]'); if (b) b.classList.add('is-cut');
      later(done, 320);
      return;
    }
    state = 2;
    var fl = q('[data-pro-flame]'), dst = q('.tw__flame');
    var T = slow ? 700 : 950;
    if (fl && dst && fl.animate) {
      var a = fl.firstElementChild.getBoundingClientRect(), b2 = dst.getBoundingClientRect();
      if (a.height > 0 && b2.height > 0) {
        var s = b2.height / a.height;
        var dx = (b2.left + b2.width / 2) - (a.left + a.width / 2), dy = (b2.top + b2.height) - (a.top + a.height);
        // масштаб — от основания пламени, как и рост
        fl.animate([{ transform: 'translate3d(0,0,0) scale(1)' }, { transform: 'translate3d(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px,0) scale(' + s.toFixed(3) + ')' }],
          { duration: T, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'forwards' });
      }
    }
    pro.classList.add('is-end');
    later(function () { h.classList.add('pro-landed'); }, T - 60);
    later(done, T + 380);
  }
  function skip() { if (state === 1 || state === 0) finale(true); else if (state === 2) done(); }
  var EV = ['pointerdown', 'wheel', 'touchstart', 'keydown'];
  function onScroll() { if (w.scrollY > 8) skip(); }
  function onVis() { if (document.visibilityState === 'hidden') done(); }
  function off() {
    EV.forEach(function (t) { w.removeEventListener(t, skip, true); });
    w.removeEventListener('scroll', onScroll);
    document.removeEventListener('visibilitychange', onVis);
  }
  EV.forEach(function (t) { w.addEventListener(t, skip, { capture: true, passive: true }); });
  w.addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('visibilitychange', onVis);

  /* титры и стих пролога показываются, только когда их шрифты уже здесь: иначе текст перескочил бы
     с запасного шрифта на свой прямо на глазах (и это был бы сдвиг вёрстки) */
  try {
    if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('1em Forum'), document.fonts.load('italic 1em Literata')]).then(function () { h.classList.add('pro-fonts'); }, function () {});
  } catch (e) { /* без титров — только пламя */ }
  /* старт — в первом кадре (до него CSS ещё не загружен, и смотреть не на что) */
  requestAnimationFrame(function () {
    if (state !== 0) return;
    if (performance.now() > 1800) slow = true;   // первый кадр пришёл поздно: сеть или устройство медленные
    if (slow) h.classList.add('pro-short');
    h.classList.add('pro-go');
    state = 1;
    later(function () { finale(false); }, slow ? 1750 : 4700);
  });
})();
