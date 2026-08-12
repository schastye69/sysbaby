/* ===========================================================================
   KAHJUABI24 — progressive enhancement. The site is complete without this
   file: every effect below is additive, and every one of them is disabled
   under prefers-reduced-motion.
   =========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var d = document;

  /* ── drawer ─────────────────────────────────────────────────────────── */
  var drawer = d.getElementById('drawer'),
      openBtn = d.getElementById('menu-btn'),
      closeBtn = d.getElementById('menu-close'),
      lastFocus = null;

  function setOpen(open) {
    if (!drawer) return;
    if (open) { drawer.hidden = false; void drawer.offsetWidth; }
    drawer.classList.toggle('is-open', open);
    if (openBtn) openBtn.setAttribute('aria-expanded', String(open));
    d.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) {
      lastFocus = d.activeElement;
      var first = drawer.querySelector('a, button');
      if (first) first.focus();
    } else {
      setTimeout(function () {
        if (!drawer.classList.contains('is-open')) drawer.hidden = true;
      }, 320);
      if (lastFocus) lastFocus.focus();
    }
  }
  if (openBtn) openBtn.addEventListener('click', function () { setOpen(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
  d.addEventListener('keydown', function (e) {
    if (!drawer || !drawer.classList.contains('is-open')) return;
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key !== 'Tab') return;
    var f = drawer.querySelectorAll('a[href], button:not([disabled])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ── the shield closes ──────────────────────────────────────────────────
     Hero-local scroll progress drives --seal from 0 (open, exposed) to 1
     (closed, protected). The whole geometry of the site is this one move. */
  (function seal() {
    var hero = d.querySelector('.hero');
    if (!hero) return;
    if (reduce) { d.documentElement.style.setProperty('--seal', '1'); return; }
    var t = false;
    var run = function () {
      if (t) return;
      t = true;
      requestAnimationFrame(function () {
        var r = hero.getBoundingClientRect();
        var span = Math.max(1, r.height * 0.72);
        var p = Math.min(1, Math.max(0, -r.top / span));
        d.documentElement.style.setProperty('--seal', p.toFixed(3));
        t = false;
      });
    };
    window.addEventListener('scroll', run, { passive: true });
    window.addEventListener('resize', run, { passive: true });
    run();
  })();

  /* ── live open / closed, computed in Europe/Tallinn ─────────────────── */
  (function hours() {
    var chips = d.querySelectorAll('[data-fx="hours"]');
    if (!chips.length) return;
    var lang = d.documentElement.lang === 'ru' ? 'ru' : 'et';
    var T = {
      et: { open: 'Avatud', closed: 'Suletud', weekend: 'Nädalavahetus — helista' },
      ru: { open: 'Открыто', closed: 'Закрыто', weekend: 'Выходные — звоните' }
    }[lang];

    var now;
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Tallinn', weekday: 'short', hour: '2-digit',
        minute: '2-digit', hour12: false
      }).formatToParts(new Date());
      var g = {};
      f.forEach(function (p) { g[p.type] = p.value; });
      now = { day: g.weekday, h: parseInt(g.hour, 10), m: parseInt(g.minute, 10) };
    } catch (e) { return; }

    var weekend = (now.day === 'Sat' || now.day === 'Sun');
    var mins = now.h * 60 + now.m;
    var state = weekend ? 'weekend' : (mins >= 540 && mins < 1080 ? 'open' : 'closed');

    chips.forEach(function (c) {
      c.hidden = false;
      c.setAttribute('data-state', state);
      var t = c.querySelector('.chip__t');
      if (t) t.textContent = T[state];
    });
  })();

  /* ── reveal ─────────────────────────────────────────────────────────── */
  var els = d.querySelectorAll('.reveal');
  if (els.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var ro = new IntersectionObserver(function (en) {
        en.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          ro.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
      els.forEach(function (el) { ro.observe(el); });
    }
  }

  /* ── contact form ───────────────────────────────────────────────────── */
  var form = d.getElementById('claim');
  if (form) {
    var status = d.getElementById('claim-status');
    var btn = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        var bad = form.querySelector(':invalid');
        if (bad) bad.focus();
        return;
      }
      e.preventDefault();
      var original = btn ? btn.textContent : '';
      var sending = form.getAttribute('data-sending');
      if (btn) { btn.disabled = true; if (sending) btn.textContent = sending; }
      fetch(form.action, {
        method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form)
      }).then(function (r) {
        if (!r.ok) throw new Error('http ' + r.status);
        form.reset(); show('ok');
      }).catch(function () {
        show('error');
      }).then(function () {
        if (btn) { btn.disabled = false; btn.textContent = original; }
      });
    });
    function show(state) {
      if (!status) return;
      status.hidden = false;
      status.setAttribute('data-state', state);
      status.textContent = form.getAttribute('data-msg-' + state) || '';
    }
  }
})();
