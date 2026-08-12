/* Obliviate OÜ — interaction layer. No dependencies. ~4 KB. */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Каждый блок изолирован: поломка одного не должна уносить остальные.
     Важнее всего последний — без него содержимое осталось бы скрытым. */
  const safe = (name, fn) => { try { fn(); } catch (e) { console.error('[obliviate] ' + name, e); } };

  /* ------------------------------------------------ scroll choreography */
  safe('scroll choreography', () => {
    const revealables = $$('[data-in]');
    if (revealables.length) {
      if (reduce.matches || !('IntersectionObserver' in window)) {
        revealables.forEach(el => el.classList.add('is-in'));
      } else {
        // stagger siblings that share a group
        const groups = new Map();
        revealables.forEach(el => {
          const key = el.closest('[data-in-group]') || el.parentElement;
          const arr = groups.get(key) || [];
          arr.push(el); groups.set(key, arr);
        });
        groups.forEach(arr => arr.forEach((el, i) => {
          if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', `${Math.min(i, 9) * 45}ms`);
        }));

        const io = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          });
        }, { rootMargin: '0px 0px -5% 0px', threshold: 0.01 });

        // Anything already inside the first viewport plays its entrance immediately —
        // never make a visitor scroll to make above-the-fold content appear.
        revealables.forEach(el => {
          if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in');
          else io.observe(el);
        });
      }
    }
  });

  /* ------------------------------------------------ logo resilience
     The project ships with the client's own mark at assets/logo.png.
     If it has not been copied in yet, fall back to the live original so
     the brand is never absent. */
  safe('logo resilience', () => {
    $$('img[data-logo]').forEach(img => {
      const onErr = () => {
        const alt = img.getAttribute('data-fallback');
        if (alt && !img.dataset.tried) {
          img.dataset.tried = '1';
          img.removeAttribute('srcset');
          img.src = alt;
          return;
        }
        // both sources unavailable -> fall back to the typographic wordmark
        img.removeEventListener('error', onErr);
        img.hidden = true;
        img.closest('.brand, .ftr__brand')?.classList.add('brand--textonly');
      };
      img.addEventListener('error', onErr);
      // the script is deferred, so the error may already have fired during parsing
      if (img.complete && img.naturalWidth === 0) onErr();
    });
  });

  /* ------------------------------------------------ header state */
  safe('header state', () => {
    const hdr = $('.hdr');
    if (hdr) {
      let ticking = false;
      // Тёмная сцена открытия: шапка растворена, пока сцена на экране.
      const stage = document.querySelector('.op--lit');
      const onScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          hdr.classList.toggle('is-stuck', window.scrollY > 12);
          // Шапка тёмная ровно тогда, когда за ней тёмное: считаем по нижней
          // кромке сцены, а не по накопленной прокрутке.
          if (stage) hdr.classList.toggle('on-stage',
            stage.getBoundingClientRect().bottom > hdr.offsetHeight);
          ticking = false;
        });
      };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  });

  /* ------------------------------------------------ desktop dropdown */
  safe('desktop dropdown', () => {
    $$('.nav__group').forEach(group => {
      const btn = $('.nav__toggle', group);
      const menu = $('.menu', group);
      if (!btn || !menu) return;
      let hoverTimer;

      const open = (v) => {
        group.classList.toggle('is-open', v);
        btn.setAttribute('aria-expanded', String(v));
      };
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        open(btn.getAttribute('aria-expanded') !== 'true');
      });
      group.addEventListener('mouseenter', () => { clearTimeout(hoverTimer); open(true); });
      group.addEventListener('mouseleave', () => { hoverTimer = setTimeout(() => open(false), 140); });
      group.addEventListener('focusout', (e) => {
        if (!group.contains(e.relatedTarget)) open(false);
      });
      group.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && group.classList.contains('is-open')) { open(false); btn.focus(); }
      });
    });
  });

  /* ------------------------------------------------ mobile drawer */
  safe('mobile drawer', () => {
    const burger = $('.burger');
    const drawer = $('#nav-drawer');
    if (burger && drawer) {
      let lastFocus = null;
      const focusables = () => $$('a[href], button:not([disabled])', drawer)
        .filter(el => el.offsetParent !== null);

      const setOpen = (v) => {
        burger.setAttribute('aria-expanded', String(v));
        drawer.classList.toggle('is-open', v);
        drawer.setAttribute('aria-hidden', String(!v));
        document.body.classList.toggle('is-locked', v);
        if (v) { lastFocus = document.activeElement; (focusables()[0] || drawer).focus({ preventScroll: true }); }
        else if (lastFocus) lastFocus.focus({ preventScroll: true });
      };
      burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
      drawer.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
      document.addEventListener('keydown', (e) => {
        if (!drawer.classList.contains('is-open')) return;
        if (e.key === 'Escape') { setOpen(false); return; }
        if (e.key !== 'Tab') return;
        const f = focusables();
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
      window.addEventListener('resize', () => {
        if (window.innerWidth >= 1040 && drawer.classList.contains('is-open')) setOpen(false);
      });
    }
  });

  /* ------------------------------------------------ footer year */
  safe('footer year', () => {
    const y = $('[data-year]');
    if (y) y.textContent = String(new Date().getFullYear());
  });

  /* ------------------------------------------------ contact form */
  safe('contact form', () => {
    const form = $('#contact-form');
    if (form) {
      const status = $('#form-status', form);
      const submit = $('button[type=submit]', form);
      const started = Date.now();
      const T = {
        required: 'Palun täida see väli.',
        email: 'Palun sisesta korrektne e-posti aadress.',
        sending: 'Saadan…',
        ok: 'Aitäh! Sõnum on saadetud.',
        fail: 'Saatmine ebaõnnestus. Palun kirjuta meile aadressil info@obliviate.eu',
        mail: 'Avan e-posti…',
      };

      const setErr = (input, msg) => {
        const field = input.closest('.field');
        const box = $('.err', field);
        field.setAttribute('data-invalid', msg ? 'true' : 'false');
        input.setAttribute('aria-invalid', msg ? 'true' : 'false');
        if (box) box.textContent = msg || '';
      };
      const validate = (input) => {
        const v = input.value.trim();
        if (input.required && !v) { setErr(input, T.required); return false; }
        if (input.type === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { setErr(input, T.email); return false; }
        setErr(input, ''); return true;
      };

      $$('input, textarea', form).forEach(input => {
        if (input.type === 'hidden' || input.closest('.hp')) return;
        input.addEventListener('blur', () => validate(input));
        input.addEventListener('input', () => { if (input.closest('.field')?.dataset.invalid === 'true') validate(input); });
      });

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputs = $$('input, textarea', form).filter(i => i.type !== 'hidden' && !i.closest('.hp'));
        let ok = true, firstBad = null;
        inputs.forEach(i => { if (!validate(i)) { ok = false; firstBad = firstBad || i; } });
        if (!ok) { firstBad.focus(); status.dataset.state = 'err'; status.textContent = ''; return; }

        // silent bot checks
        if ($('input[name=company]', form)?.value || Date.now() - started < 2500) {
          status.dataset.state = 'ok'; status.textContent = T.ok; form.reset(); return;
        }

        const data = Object.fromEntries(new FormData(form).entries());
        const compose = () => {
          const subject = encodeURIComponent(`${data.name || ''}`.trim() || 'Obliviate OÜ');
          const body = encodeURIComponent(`${data.message || ''}\n\n${data.name || ''}\n${data.email || ''}\n${data.phone || ''}`);
          window.location.href = `mailto:info@obliviate.eu?subject=${subject}&body=${body}`;
        };

        // No endpoint configured (e.g. deployed as a sub-folder of another
        // project): open the visitor's mail client instead of failing a request.
        if (!form.getAttribute('action')) {
          status.dataset.state = ''; status.textContent = T.mail;
          compose();
          return;
        }

        submit.dataset.busy = 'true';
        status.dataset.state = ''; status.textContent = T.sending;

        try {
          const res = await fetch(form.action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data),
          });
          if (!res.ok) throw new Error(String(res.status));
          status.dataset.state = 'ok'; status.textContent = T.ok;
          form.reset();
        } catch (err) {
          status.dataset.state = 'err'; status.textContent = T.fail;
          compose();
        } finally {
          delete submit.dataset.busy;
        }
      });
    }
  });

})();
