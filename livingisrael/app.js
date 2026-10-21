/* app.js — Living Israel Tallinn. Без хранилищ, без чужих адресов, без окон.
 * 1. Оглавление: лист на телефоне (Esc, фокус внутри), свеча слева на широком экране.
 * 2. «Где вы сейчас»: пламя в оглавлении и подпись в шапке.
 * 3. «Ближайшее»: следующее собрание по времени Таллина.
 * 4. Копирование IBAN (navigator.clipboard.writeText) с видимым подтверждением.
 * 5. Просмотр фотографий в <dialog>.
 * Подписи берутся из <template id="ui-strings"> — их источник content.<язык>.mjs. */
(() => {
  'use strict';
  const doc = document;
  const $ = (s, r) => (r || doc).querySelector(s);
  const $$ = (s, r) => Array.from((r || doc).querySelectorAll(s));
  const S = {};
  const tpl = $('#ui-strings');
  if (tpl) for (const d of $$('data', tpl.content)) S[d.value] = d.textContent;
  const wide = window.matchMedia('(min-width: 1180px)');

  /* 1. Оглавление */
  const toc = $('#toc');
  const btn = $('[data-toc-btn]');
  const closeBtn = $('[data-toc-close]');
  const isSheet = () => !wide.matches;
  function showToc() {
    if (!toc || !btn) return;
    toc.classList.add('is-open');
    doc.documentElement.classList.add('toc-open');
    btn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => fxPlace());
    const cur = $('a[aria-current="true"]', toc) || $('a', toc);
    if (cur) cur.focus();
  }
  function hideToc(returnFocus) {
    if (!toc || !btn || !toc.classList.contains('is-open')) return;
    toc.classList.remove('is-open');
    doc.documentElement.classList.remove('toc-open');
    btn.setAttribute('aria-expanded', 'false');
    if (returnFocus) btn.focus();
  }
  if (btn) btn.addEventListener('click', () => (toc.classList.contains('is-open') ? hideToc(true) : showToc()));
  if (closeBtn) closeBtn.addEventListener('click', () => hideToc(true));
  if (toc) {
    toc.addEventListener('click', (e) => { const a = e.target.closest('a[href^="#"]'); if (a && isSheet()) hideToc(false); });
    toc.addEventListener('keydown', (e) => {
      if (!toc.classList.contains('is-open') || !isSheet()) return;
      if (e.key === 'Escape') { e.preventDefault(); hideToc(true); return; }
      if (e.key !== 'Tab') return;
      const f = $$('a, button', toc).filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  wide.addEventListener('change', () => hideToc(false));

  /* 2. Где вы сейчас */
  const now = $('[data-now]');
  const links = new Map($$('[data-toc]').map((a) => [a.dataset.toc, a]));
  const label = (a) => { const s = a.querySelector('span:last-child'); return (s ? s.textContent : a.textContent).trim(); };
  let current = null;
  let fxPlace = () => {};
  function mark(id) {
    if (id === current || !links.has(id)) return;
    current = id;
    for (const [k, a] of links) { if (k === id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); }
    if (now) now.textContent = label(links.get(id));
    fxPlace();
  }
  const spied = $$('[data-spy]');
  if ('IntersectionObserver' in window && spied.length) {
    const seen = new Map();
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) seen.set(en.target.id, en.isIntersecting);
      const hit = spied.filter((s) => seen.get(s.id));
      if (hit.length) mark(hit[hit.length - 1].id);
    }, { rootMargin: '-35% 0px -55% 0px' });
    spied.forEach((s) => io.observe(s));
  }

  /* 3. Ближайшее собрание (время Таллина) */
  const next = $('[data-next]');
  if (next) {
    try {
      const wall = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Tallinn' }));
      const mins = wall.getHours() * 60 + wall.getMinutes();
      const card = (k) => $('.day[data-event="' + k + '"]');
      const eventsOn = (d) => {
        const out = []; const w = d.getDay();
        if (w === 6) out.push({ k: 'sat', t: 12 * 60 });
        if (w === 0) {
          out.push({ k: 'sun', t: 9 * 60 });
          const n = new Date(d); n.setDate(d.getDate() + 7);
          if (n.getMonth() !== d.getMonth()) out.push({ k: 'last', t: null });
        }
        if (w === 2) out.push({ k: 'tue', t: null });
        return out;
      };
      let found = null;
      for (let i = 0; i < 15 && !found; i++) {
        const d = new Date(wall); d.setDate(wall.getDate() + i);
        for (const ev of eventsOn(d)) {
          if (i === 0 && ev.t != null && ev.t + 90 < mins) continue;   // уже прошло
          if (card(ev.k)) { found = { ...ev, i, d }; break; }
        }
      }
      if (found) {
        const c = card(found.k);
        const when = found.i === 0 ? (S.today || 'Сегодня') : found.i === 1 ? (S.tomorrow || 'Завтра')
          : new Intl.DateTimeFormat('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }).format(found.d);
        const what = (c.querySelector('.day__what') || {}).textContent || '';
        const where = (c.querySelector('.day__where') || {}).textContent || '';
        const timeEl = c.querySelector('.day__time');
        next.textContent = '';
        const strong = doc.createElement('strong');
        strong.textContent = when.charAt(0).toUpperCase() + when.slice(1) + (timeEl ? ', ' + timeEl.textContent.trim() : '');
        next.append(strong, doc.createElement('br'), doc.createTextNode(what + (where ? ' — ' + where : '')));
        c.classList.add('is-next');
        const badge = doc.createElement('span'); badge.className = 'day__badge'; badge.textContent = S.next || 'Ближайшее';
        const w = c.querySelector('.day__when'); if (w) w.append(' ', badge);
      }
    } catch (e) { /* без даты остаётся ссылка на расписание */ }
  }

  /* 4. Копирование IBAN */
  const copy = $('[data-copy]');
  const status = $('[data-copy-status]');
  if (copy && status) {
    copy.addEventListener('click', async () => {
      const value = copy.dataset.copy;   // ровно EE822200221082813780, без пробелов
      status.classList.remove('ok');
      try {
        if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('no clipboard');
        await navigator.clipboard.writeText(value);
        status.textContent = (S.copied || 'IBAN скопирован') + ': ' + value;
        status.classList.add('ok');
      } catch (e) {
        const node = $('[data-iban]');
        if (node) { const r = doc.createRange(); r.selectNodeContents(node); const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r); }
        status.textContent = S.copyFail || 'Не получилось скопировать — выделите номер вручную';
      }
    });
  }

  /* 6. Волшебство (только если не просили «меньше движения»; без JS всё видно сразу) */
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  const tocFlame = $('.toc__flame');
  const track = $('.toc__track');
  function placeFlame() {
    if (!tocFlame || !track || !current) return;
    const a = links.get(current); if (!a || !a.offsetParent) return;
    const cs = getComputedStyle(a);
    const y = a.getBoundingClientRect().y - track.getBoundingClientRect().y + parseFloat(cs.paddingTop) + parseFloat(cs.fontSize) * 0.62 - 5;
    tocFlame.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    tocFlame.classList.add('is-on');
  }
  fxPlace = placeFlame;
  if (!calm.matches && 'IntersectionObserver' in window) {
    doc.documentElement.classList.add('fx');
    const below = (el) => el.getBoundingClientRect().y > window.innerHeight * 0.92;
    const targets = $$('.verse, .gallery .ph, .lead-photo .ph, .split__aside .ph, .gilt');
    $$('.verse').forEach((v) => { const ln = $$('.ln', v); ln.forEach((l, i) => l.style.setProperty('--i', i)); v.style.setProperty('--n', ln.length); });
    $$('.gallery').forEach((g) => $$('.ph', g).forEach((p, i) => { const im = p.querySelector('img'); if (im) im.style.transitionDelay = (i % 4) * 90 + 'ms'; }));
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const t = e.target;
      if (e.isIntersecting) { t.classList.add('fx-in', 'fx-vis'); t.classList.remove('fx-wait'); }
      else t.classList.remove('fx-vis');
    }), { rootMargin: '0px 0px -8% 0px' });
    targets.forEach((t) => { if (below(t)) t.classList.add('fx-wait'); io.observe(t); });
    // первый экран: лучи и пылинки спят, когда его не видно; рассвет теплеет при прокрутке
    const hero = $('.hero'); const dawn = $('[data-dawn]');
    let heroOn = true, ticking = false;
    if (hero) new IntersectionObserver((es) => { heroOn = es[0].isIntersecting; hero.classList.toggle('fx-off', !heroOn); doc.documentElement.classList.toggle('fx-top', heroOn); }).observe(hero);
    const warm = () => { ticking = false; if (!dawn || !heroOn) return; dawn.style.opacity = Math.min(1, window.scrollY / (window.innerHeight * 0.9)).toFixed(3); };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(warm); } }, { passive: true });
    warm();
    window.addEventListener('resize', placeFlame, { passive: true });
    const lbEl = $('[data-lb]'); if (lbEl) lbEl.classList.add('fx-lb');
    placeFlame(); if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(placeFlame);
  }

  /* 5. Фотографии */
  const lb = $('[data-lb]');
  const lbImg = $('[data-lb-img]');
  if (lb && lbImg && typeof lb.showModal === 'function') {
    let from = null;
    doc.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-lightbox]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      const im = a.querySelector('img');
      lbImg.src = a.getAttribute('href');
      lbImg.alt = im ? im.alt : '';
      lb.setAttribute('aria-label', lbImg.alt || 'Фотография');
      from = a;
      lb.showModal();
      requestAnimationFrame(() => lb.classList.add('is-shown'));
      $('[data-lb-close]', lb).focus();
    });
    $('[data-lb-close]', lb).addEventListener('click', () => lb.close());
    lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
    lb.addEventListener('close', () => { lb.classList.remove('is-shown'); lbImg.removeAttribute('src'); if (from) from.focus(); });
  }
})();
