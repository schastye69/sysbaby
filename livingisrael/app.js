/* app.js — Living Israel Tallinn. Без хранилищ, без чужих адресов, без сетевых вызовов.
 * 1. Оглавление: лист на телефоне (Esc, фокус внутри), свеча слева на широком экране.
 * 2. «Где вы сейчас»: пламя в оглавлении, подпись в шапке, девять состояний света.
 * 3. «Ближайшее»: следующее собрание по времени Таллина.
 * 4. Копирование IBAN (navigator.clipboard.writeText) с видимым подтверждением.
 * 5. Просмотр фотографий в <dialog>.
 * 6. Волшебство (только без «меньше движения»): печатная строка со свечой-курсором,
 *    появление мест Писания и фото, блик позолоты, угольки, касание света.
 * 7. «Свет стезе моей»: стезя и пламя, идущее с читателем.
 * Подписи — из <template id="ui-strings"> (источник — content.<язык>.mjs). */
(() => {
  'use strict';
  const doc = document, root = doc.documentElement;
  const $ = (s, r) => (r || doc).querySelector(s);
  const $$ = (s, r) => Array.from((r || doc).querySelectorAll(s));
  const S = {};
  const tpl = $('#ui-strings');
  if (tpl) for (const d of $$('data', tpl.content)) S[d.value] = d.textContent;
  const wide = window.matchMedia('(min-width: 1180px)');
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hasIO = 'IntersectionObserver' in window, hasRAF = 'requestAnimationFrame' in window;
  const raf = hasRAF ? (f) => requestAnimationFrame(f) : (f) => setTimeout(f, 16);

  /* 1. Оглавление */
  const toc = $('#toc');
  const btn = $('[data-toc-btn]');
  const closeBtn = $('[data-toc-close]');
  const isSheet = () => !wide.matches;
  let fxPlace = () => {};
  // пока лист оглавления открыт на телефоне, страница под ним инертна (как у модального окна)
  const behind = () => [$('.head'), $('main'), $('.foot')].filter(Boolean);
  function showToc() {
    if (!toc || !btn) return;
    if (isSheet()) behind().forEach((el) => { el.inert = true; });
    toc.classList.add('is-open');
    root.classList.add('toc-open');
    btn.setAttribute('aria-expanded', 'true');
    raf(() => fxPlace());
    const cur = $('a[aria-current="true"]', toc) || $('a', toc);
    if (cur) cur.focus();
  }
  function hideToc(returnFocus) {
    if (!toc || !btn || !toc.classList.contains('is-open')) return;
    behind().forEach((el) => { el.inert = false; });
    toc.classList.remove('is-open');
    root.classList.remove('toc-open');
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
  if (wide.addEventListener) wide.addEventListener('change', () => hideToc(false));

  /* «К содержанию»: фокус — в main (и для браузеров, что не переносят его сами) */
  const skipLink = $('.skip'), mainEl = $('#main');
  if (skipLink && mainEl) skipLink.addEventListener('click', (e) => { e.preventDefault(); mainEl.focus({ preventScroll: true }); mainEl.scrollIntoView({ block: 'start' }); });

  /* 2. Где вы сейчас + девять состояний света */
  const now = $('[data-now]');
  const links = new Map($$('[data-toc]').map((a) => [a.dataset.toc, a]));
  const label = (a) => { const s = a.querySelector('span:last-child'); return (s ? s.textContent : a.textContent).trim(); };
  let current = null;
  const skies = new Map($$('[data-sky]').map((el) => [el.dataset.sky, el]));
  let skyOn = null;
  function skyTo(id) { const el = skies.get(id) || null; if (el === skyOn) return; if (skyOn) skyOn.classList.remove('is-on'); if (el) el.classList.add('is-on'); skyOn = el; }
  function mark(id) {
    if (id === current || !links.has(id)) return;
    current = id;
    for (const [k, a] of links) { if (k === id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); }
    if (now) now.textContent = label(links.get(id));
    skyTo(id);
    fxPlace();
  }
  const spied = $$('[data-spy]');
  if (hasIO && spied.length) {
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
      raf(() => lb.classList.add('is-shown'));
      $('[data-lb-close]', lb).focus();
    });
    $('[data-lb-close]', lb).addEventListener('click', () => lb.close());
    lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
    lb.addEventListener('close', () => { lb.classList.remove('is-shown'); lbImg.removeAttribute('src'); if (from) from.focus(); });
  }

  /* 6. Волшебство — только если движение разрешено и браузер умеет нужное */
  const moving = !calm.matches && hasIO && hasRAF;
  const tocFlame = $('.toc__flame');
  const track = $('.toc__track');
  function placeFlame() {
    if (!tocFlame || !track || !current) return;
    const a = links.get(current); if (!a || !a.offsetParent) return;
    const cs = getComputedStyle(a);
    const y = a.getBoundingClientRect().y - track.getBoundingClientRect().y + parseFloat(cs.paddingTop) + parseFloat(cs.fontSize) * 0.62 - 13;
    tocFlame.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    tocFlame.classList.add('is-on');
  }
  let heroOn = true;
  let twWake = () => {};
  if (moving) {
    root.classList.add('fx');
    fxPlace = placeFlame;
    const below = (el) => el.getBoundingClientRect().y > window.innerHeight * 0.92;
    const targets = $$('.verse:not(.hero .verse), .gallery .ph, .lead-photo .ph, .split__aside .ph, .gilt, .donate');
    $$('.verse').forEach((v) => { const ln = $$('.ln', v); ln.forEach((l, i) => l.style.setProperty('--i', i)); v.style.setProperty('--n', ln.length); });
    $$('.gallery').forEach((g) => $$('.ph', g).forEach((p, i) => { const im = p.querySelector('img'); if (im) im.style.transitionDelay = (i % 4) * 90 + 'ms'; }));
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      const t = e.target;
      if (e.isIntersecting) { t.classList.add('fx-in', 'fx-vis'); t.classList.remove('fx-wait'); }
      else t.classList.remove('fx-vis');
    }), { rootMargin: '0px 0px -8% 0px' });
    targets.forEach((t) => { if (below(t)) t.classList.add('fx-wait'); io.observe(t); });
    // первый экран: лучи, угольки и пламя спят, когда его не видно
    const hero = $('.hero');
    if (hero) new IntersectionObserver((es) => { heroOn = es[0].isIntersecting; hero.classList.toggle('fx-off', !heroOn); root.classList.toggle('fx-top', heroOn); if (heroOn) twWake(); }).observe(hero);
    const lbEl = $('[data-lb]'); if (lbEl) lbEl.classList.add('fx-lb');
    window.addEventListener('resize', placeFlame, { passive: true });

    /* Печатная строка. Глаголы — из статичной строки под словом (порядок один):
       Люби · Верь · Надейся · Радуйся · Благодари · Прощай · Молись · Служи.
       Готовое слово держится ~1,6 с и один раз вспыхивает позолотой; стирание — ~45 мс
       на букву, пламя тускнеет; печать — 70–90 мс на букву, пламя разгорается.
       Слово всегда по центру — сдвигом (transform), не вёрсткой: место под «Благодари»
       занято заранее, эпиграф не двигается. Вне экрана и в скрытой вкладке — пауза. */
    const tw = $('.tw'), twWord = $('[data-tw]'), twLine = $('[data-tw-line]');
    const glint = $('[data-tw-glint]'), glintIn = glint && $('.tw__glintin', glint);
    const verbEls = $$('[data-verb]');
    const verbs = verbEls.map((v) => v.textContent.trim());
    if (tw && twWord && twLine && verbs.length === 8) {
      let k = 0, timer = 0, pending = null, started = false;
      const paused = () => doc.hidden || !heroOn;
      const at = (fn, ms) => { pending = fn; timer = setTimeout(() => { timer = 0; if (paused()) return; pending = null; fn(); }, ms); };
      twWake = () => { if (started && !timer && pending && !paused()) { const fn = pending; pending = null; fn(); } };
      // курсор вынут из потока и ставится сдвигом: ни слово, ни курсор не меняют места в вёрстке
      const cur = $('.tw__cursor', tw);
      let gap = 0, cw = 0;
      const measure = () => {
        const keep = twWord.textContent; if (!keep) twWord.textContent = verbs[0];
        tw.classList.remove('is-abs'); cur.style.transform = 'none'; twLine.style.transform = 'none';
        const cr = cur.getBoundingClientRect(), wr = twWord.getBoundingClientRect();
        gap = cr.left - wr.right; cw = cr.width;
        tw.classList.add('is-abs');
        twWord.textContent = keep;
        center();
      };
      const center = () => {
        const ww = twWord.offsetWidth;
        const x = (tw.clientWidth - (ww + gap + cw)) / 2;
        twLine.style.transform = 'translate3d(' + x.toFixed(1) + 'px,0,0)';
        cur.style.transform = 'translate3d(' + (ww + gap).toFixed(1) + 'px,0,0)';
      };
      measure();
      const lit = (i) => verbEls.forEach((v, j) => v.classList.toggle('is-on', j === i));
      function shine(w) {
        if (!glint || !glintIn) return;
        glintIn.textContent = w;
        glint.classList.remove('is-on'); void glint.offsetWidth; glint.classList.add('is-on');
      }
      function erase() {
        tw.classList.add('is-dim'); tw.classList.remove('is-bright');
        if (glint) glint.classList.remove('is-on');
        const cur = twWord.textContent;
        if (cur.length) { twWord.textContent = cur.slice(0, -1); center(); at(erase, 40 + Math.random() * 10); }
        else at(() => type(verbs[k], 1), 340);
      }
      function type(w, n) {
        if (n === 1) { tw.classList.remove('is-dim'); lit(k); }
        twWord.textContent = w.slice(0, n); center();
        if (n < w.length) at(() => type(w, n + 1), 70 + Math.random() * 20);
        else {
          tw.classList.add('is-bright'); shine(w);
          setTimeout(() => tw.classList.remove('is-bright'), 700);
          k = (k + 1) % verbs.length;
          at(erase, 1600);
        }
      }
      if (glint) glint.addEventListener('animationend', (e) => { if (e.target === glint.firstElementChild) glint.classList.remove('is-on'); });
      tw.classList.add('is-run');
      doc.addEventListener('visibilitychange', twWake);
      let mz = 0; window.addEventListener('resize', () => { clearTimeout(mz); mz = setTimeout(measure, 100); }, { passive: true });
      const go = (fromEmpty) => {
        if (started) return; started = true;
        if (fromEmpty) { twWord.textContent = ''; center(); at(() => type(verbs[0], 1), 120); }
        else { center(); lit(0); shine(verbs[0]); k = 1; at(erase, 1600); }
      };
      if (root.classList.contains('pro-on')) {
        twWord.textContent = ''; center();
        doc.addEventListener('li:prologue', () => go(true), { once: true });
      } else go(false);
      if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(measure);
    }

    /* Касание света: только пустое место, никогда не мешает касанию */
    const tl = $('[data-touch]');
    if (tl) doc.addEventListener('pointerdown', (e) => {
      if (root.classList.contains('pro-on')) return;
      if (e.target.closest('a, button, input, textarea, select, label, summary, dialog, img, [role="button"], .toc')) return;
      tl.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)';
      tl.classList.remove('is-on'); void tl.offsetWidth; tl.classList.add('is-on');
    }, { passive: true });

    placeFlame(); if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(placeFlame);
  } else {
    // без движения: печатная строка неподвижна — крупно «Люби» и строка всех восьми слов
    root.classList.remove('pro-on');
  }

  /* 7. «Свет стезе моей». Смещения считаются один раз (и при изменении размеров);
     в кадре читается только scrollY. Пламя останавливается у «Пожертвовать»
     и приходит к «Свяжитесь с нами». */
  const spine = $('[data-spine]');
  if (spine) {
    const lit = $('[data-spine-lit]'), sf = $('[data-spine-flame]');
    const nodes = $$('[data-node]', spine);
    let G = null, sTick = false, restOn = false, flameOn = false, litT = '', flT = '';
    const docY = (el) => el.getBoundingClientRect().top + window.scrollY;
    function geometry() {
      const start = $('#church'), end = $('#contacts-h'), don = $('#donate-h'), col = $('#church .wrap');
      if (!start || !end || !col) return;
      const off = parseFloat(getComputedStyle(root).getPropertyValue('--spine-off')) || 24;
      const cs = getComputedStyle(col);
      const x = Math.max(6, col.getBoundingClientRect().left + parseFloat(cs.paddingLeft) - off);
      const y0 = docY(start), stop = docY(end) + end.offsetHeight * 0.5, len = Math.max(1, stop - y0);
      const vh = window.innerHeight;
      const D = don ? docY(don) + don.offsetHeight * 0.5 : stop;
      G = { x, top: y0, stop, read: vh * 0.42, D, P: vh * 0.25, R: vh * 0.6,
        nodes: nodes.map((n) => { const h = doc.getElementById(n.dataset.node); const y = h ? docY(h) + Math.min(h.offsetHeight, 70) / 2 : y0; n.style.setProperty('--y', y.toFixed(1) + 'px'); return [n, y, null]; }) };
      // узлы, чернильная линия и сама стезя ставятся один раз переменными (без слоёв); каждый кадр двигаются только слой золота и пламя
      spine.style.setProperty('--x', x.toFixed(1) + 'px');
      spine.style.setProperty('--top', y0.toFixed(1) + 'px');
      spine.style.setProperty('--len', len.toFixed(1) + 'px');
      spine.classList.add('is-ready');
      $$('.min .verse').forEach((v) => { const b = v.getBoundingClientRect().left - x; if (b > 10 && b < 260) { v.style.setProperty('--b', (b - 1).toFixed(1) + 'px'); v.classList.add('has-branch'); } else v.classList.remove('has-branch'); });
      frame();
    }
    // путь пламени в координатах документа: идёт со строкой чтения, останавливается у «Пожертвовать», догоняет, приходит к «Свяжитесь»
    function path(s) {
      const { D, P, R } = G;
      let f = s;
      if (s >= D && s < D + P) f = D;
      else if (s >= D + P && s < D + P + R) f = D + (s - D - P) * (R + P) / R;
      return Math.min(G.stop, Math.max(G.top, f));
    }
    function frame() {
      sTick = false;
      if (!G) return;
      const y = window.scrollY;
      const s = y + G.read;
      const f = moving ? path(s) : G.stop;
      // слой золота закреплён на экране: от max(верх стезе, верх экрана) до пламени; пишем, только если изменилось
      if (lit && moving) {
        const a = Math.max(G.top - y, 0), len = Math.max(0, Math.min(f - y, window.innerHeight) - a);
        const t = 'translate3d(' + G.x.toFixed(1) + 'px,' + a.toFixed(1) + 'px,0) scaleY(' + (len / 100).toFixed(3) + ')';
        if (t !== litT) { litT = t; lit.style.transform = t; }
      }
      for (const row of G.nodes) { const on = row[1] <= f + 2; if (on !== row[2]) { row[2] = on; row[0].classList.toggle('is-lit', on); } }
      if (sf && moving) {
        const t = 'translate3d(' + G.x.toFixed(1) + 'px,' + (f - y).toFixed(1) + 'px,0)';
        if (t !== flT) { flT = t; sf.style.transform = t; }
        const on = s > G.top - 40; if (on !== flameOn) { flameOn = on; sf.classList.toggle('is-on', on); }
        const rest = f === G.stop || (s >= G.D && s < G.D + G.P); if (rest !== restOn) { restOn = rest; sf.classList.toggle('is-rest', rest); }
      }
    }
    if (!moving) spine.classList.add('is-calm');
    let rz = 0;
    const regeo = () => { clearTimeout(rz); rz = setTimeout(geometry, 140); };
    window.addEventListener('resize', regeo, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(regeo).observe(doc.body);
    if (moving) window.addEventListener('scroll', () => { if (!sTick) { sTick = true; raf(frame); } }, { passive: true });
    geometry();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(geometry);
    window.addEventListener('load', geometry);
  }
})();
