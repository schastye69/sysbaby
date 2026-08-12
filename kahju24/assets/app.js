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

  /* ── road marking: --scroll drives the centre line ──────────────────── */
  if (!reduce) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var max = d.documentElement.scrollHeight - window.innerHeight;
        var p = max > 0 ? window.scrollY / max : 0;
        d.documentElement.style.setProperty('--scroll', p.toFixed(4));
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    onScroll();
  }

  /* ── impact ring: remember where the pointer entered ────────────────── */
  if (!reduce) {
    d.querySelectorAll('[data-fx="impact"]').forEach(function (el) {
      el.addEventListener('pointerenter', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--rx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--ry', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ── cracked glass: measure each path, then run it when in view ─────── */
  d.querySelectorAll('[data-fx="crack"]').forEach(function (wrap) {
    var svg = wrap.querySelector('.crack');
    if (!svg) return;
    var shapes = svg.querySelectorAll('path, circle');
    shapes.forEach(function (s, i) {
      var len = 300;
      try { len = Math.ceil(s.getTotalLength()); } catch (e) { /* jsdom / old */ }
      s.style.setProperty('--len', len);
      s.style.animationDelay = (i * 90) + 'ms';
    });
    if (!('IntersectionObserver' in window)) { wrap.classList.add('is-live'); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) { wrap.classList.add('is-live'); io.unobserve(e.target); }
      });
    }, { threshold: 0.25 });
    io.observe(wrap);
  });

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

  /* ── barrier sweep between pages (View Transitions where available) ─── */
  if (!reduce && 'startViewTransition' in d) {
    var bar = d.querySelector('.barrier');
    d.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      var url;
      try { url = new URL(a.href); } catch (err) { return; }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return;
      if (a.protocol === 'tel:' || a.protocol === 'mailto:') return;
      if (bar) { bar.classList.remove('is-down'); void bar.offsetWidth; bar.classList.add('is-down'); }
    }, true);
  }

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
