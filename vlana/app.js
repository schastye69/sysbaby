(() => {
'use strict';

/* =====================================================================
   CONFIG — всё редактируемое: контакты, часы, образы, цены.
   Чтобы поставить настоящие фотографии, укажите url в поле `image`
   у образа. Дизайн при этом не меняется.
   ===================================================================== */
const CONFIG = {
  brand: 'Nataša Vlassenko',
  tz: 'Europe/Tallinn',
  phone: '+372 555 29 424',
  phoneHref: 'tel:+37255529424',
  email: 'vlana.67@mail.ru',
  company: 'Nataša Vlassenko',
  regcode: '11618393',
  address: ['Kaare tn 11', 'Jõhvi linn', '41534 Jõhvi vald', 'Ida-Viru maakond'],
  hours: [['Вт – Пт', '11:00 – 19:00'], ['Суббота', '10:00 – 16:00'], ['Вс – Пн', 'Выходной']],
  openDays: [2, 3, 4, 5, 6],                       // 0 = воскресенье
  openAt:  { 2: 11, 3: 11, 4: 11, 5: 11, 6: 10 },  // час открытия по дням недели
  closeAt: { 2: 19, 3: 19, 4: 19, 5: 19, 6: 16 },  // час закрытия
  booking: {
    endpoint: '',      // адрес сервера для заявок (POST JSON). Пусто = только интерфейс.
    daysAhead: 14,
    refPrefix: 'NV'
  },
  // duration/step — внутренние: по ним запись решает, какие времена предлагать. Клиенту не показываются.
  services: [
    { id: 'men', name: 'Мужская стрижка', look: 'Чистый контур', price: 19, from: true, duration: 45, step: 60, visual: 'metal', image: '',
      text: 'Машинка и ножницы, ровный контур и форма, которая держится до следующего визита.',
      includes: ['Короткая консультация', 'Стрижка машинкой и ножницами', 'Окантовка и укладка'] },
    { id: 'women', name: 'Женская стрижка', look: 'Форма по вашим волосам', price: 23, from: true, duration: 60, step: 60, visual: 'hair', image: '',
      text: 'Стрижка, которую строят от того, как ваши волосы падают и растут. Итоговая цена зависит от длины и густоты.',
      includes: ['Консультация', 'Мытьё', 'Стрижка', 'Укладка'] },
    { id: 'kids', name: 'Детская стрижка', look: 'Лёгкая форма', price: 15, from: true, duration: 30, step: 60, visual: 'hair', image: '',
      text: 'Спокойно и без спешки: аккуратная стрижка, в которой ребёнку удобно, а родителям — красиво.',
      includes: ['Знакомство', 'Стрижка', 'Укладка'] },
    { id: 'color', name: 'Окрашивание', look: 'Тональный цвет', price: 45, from: true, duration: 120, step: 150, visual: 'hairWarm', image: '',
      text: 'Мягкий цвет, нанесённый тонкими слоями. Он отрастает так же тихо, как появился.',
      includes: ['Подбор тона', 'Окрашивание', 'Мытьё и уход', 'Укладка'] },
    { id: 'perm', name: 'Завивка', look: 'Мягкая волна', price: 40, from: true, duration: 120, step: 150, visual: 'hairWarm', image: '',
      text: 'Волна или локон — по вашим волосам и желанию. Форма, которая живёт сама и не просит укладки каждое утро.',
      includes: ['Консультация и подбор', 'Завивка', 'Уход', 'Укладка'] }
  ]
};

/* ============================ utilities ============================ */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const range = (v, a, b) => clamp((v - a) / (b - a));
const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));
const pad = (n, l = 2) => String(n).padStart(l, '0');
const wait = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const E = {
  outExpo: t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  outCubic: t => 1 - Math.pow(1 - t, 3),
  inCubic: t => t * t * t,
  outQuart: t => 1 - Math.pow(1 - t, 4),
  inOutCubic: t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  inOutQuart: t => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
  inOutSine: t => -(Math.cos(Math.PI * t) - 1) / 2
};
const safe = (fn, label) => { try { fn(); } catch (err) { console.warn('[solus]', label || '', err); } };
const absTop = el => el.getBoundingClientRect().top + window.scrollY;
const hashStr = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 10000) / 10000; };
const toMin = s => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const fromMin = m => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const DOW = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const DOW_L = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
const MON = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
const MON_L = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

const html = document.documentElement;
const Env = {
  touch: matchMedia('(hover: none), (pointer: coarse)').matches,
  reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
  dpr: Math.min(window.devicePixelRatio || 1, 2),
  get mobile() { return window.innerWidth < 820; }
};

/* ============================ ticker ============================ */
const Ticker = {
  fns: [], last: 0, time: 0,
  add(fn, order = 0) { this.fns.push({ fn, order }); this.fns.sort((a, b) => a.order - b.order); },
  start() {
    this.last = performance.now();
    const loop = now => {
      const dt = Math.min((now - this.last) / 1000, 1 / 20);
      this.last = now; this.time += dt;
      for (let i = 0; i < this.fns.length; i++) { try { this.fns[i].fn(dt, this.time); } catch (e) { console.warn('[solus] tick', e); } }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
};

function tween({ from = 0, to = 1, dur = 1000, ease = E.outExpo, delay = 0, update }) {
  return new Promise(res => {
    const t0 = performance.now() + delay;
    const step = now => {
      if (now < t0) { requestAnimationFrame(step); return; }
      const k = dur <= 0 ? 1 : clamp((now - t0) / dur);
      update(lerp(from, to, ease(k)), k);
      if (k < 1) requestAnimationFrame(step); else res();
    };
    requestAnimationFrame(step);
  });
}

/* ============================ text helpers ============================ */
const GLYPHS = 'АБВГДЕЖЗИКЛМНОПРСТУФХЦЧШЭЮЯ0123456789/·—';
function scramble(el, text, { dur = 650, delay = 0 } = {}) {
  if (!el) return;
  if (Env.reduced) { el.textContent = text; return; }
  const from = el.textContent;
  const len = Math.max(from.length, text.length);
  const start = performance.now() + delay;
  cancelAnimationFrame(el._scr);
  const step = now => {
    const k = clamp((now - start) / dur);
    let out = '';
    for (let i = 0; i < len; i++) {
      const settle = 0.3 + (i / len) * 0.7;
      const churn = (i / len) * 0.35;
      if (k >= settle) out += text[i] || '';
      else if (k > churn) out += (text[i] === ' ' || from[i] === ' ') && Math.random() < 0.5 ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
      else out += from[i] || '';
    }
    el.textContent = out;
    if (k < 1) el._scr = requestAnimationFrame(step); else el.textContent = text;
  };
  el._scr = requestAnimationFrame(step);
}
function rollify(el) {
  const text = el.textContent.trim();
  el.textContent = '';
  const sr = document.createElement('span'); sr.className = 'sr'; sr.textContent = text; el.appendChild(sr);
  [...text].forEach((c, i) => {
    const ch = document.createElement('span'); ch.className = 'ch'; ch.setAttribute('aria-hidden', 'true'); ch.style.setProperty('--i', i);
    const inner = document.createElement('span');
    for (let k = 0; k < 2; k++) { const s = document.createElement('span'); s.textContent = c === ' ' ? ' ' : c; inner.appendChild(s); }
    ch.appendChild(inner); el.appendChild(ch);
  });
}

/* ============================ time + schedule ============================ */
function tallinnNow() {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: CONFIG.tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date());
    const o = {}; parts.forEach(p => { o[p.type] = p.value; });
    return { date: new Date(+o.year, +o.month - 1, +o.day, 12), minutes: (+o.hour % 24) * 60 + +o.minute };
  } catch (e) {
    const d = new Date();
    return { date: new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12), minutes: d.getHours() * 60 + d.getMinutes() };
  }
}
const Schedule = {
  key: d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
  days(n) {
    const out = []; const d = new Date(tallinnNow().date); d.setDate(d.getDate() + 1);
    let guard = 0;
    while (out.length < n && guard++ < 60) { if (CONFIG.openDays.includes(d.getDay())) out.push(new Date(d)); d.setDate(d.getDate() + 1); }
    return out;
  },
  slots(d, svc) {
    const day = d.getDay();
    const open = (CONFIG.openAt[day] || 10) * 60, close = (CONFIG.closeAt[day] || 18) * 60;
    const out = [];
    for (let t = open; t + svc.duration <= close; t += svc.step || 60) {
      const time = fromMin(t);
      out.push({ time, taken: false });  /* календаря у мастера на сайте нет: занятость не выдумывается */
    }
    return out;
  },
  today() {
    const day = tallinnNow().date.getDay();
    if (!CONFIG.openDays.includes(day)) return 'Выходной';
    return `${pad(CONFIG.openAt[day])}:00 – ${pad(CONFIG.closeAt[day])}:00`;
  },
  next() {
    const svc = CONFIG.services[0];
    for (const d of this.days(10)) {
      const s = this.slots(d, svc)[0];
      if (s) return `${DOW[d.getDay()]} ${pad(d.getDate())}.${pad(d.getMonth() + 1)} · с ${s.time}`;
    }
    return 'По запросу';
  },
  long: d => `${cap(DOW_L[d.getDay()])}, ${d.getDate()} ${MON_L[d.getMonth()]} ${d.getFullYear()}`
};
const Clock = {
  init() {
    let fmt;
    try { fmt = new Intl.DateTimeFormat('en-GB', { timeZone: CONFIG.tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }); } catch (e) { fmt = null; }
    const tick = () => {
      const d = new Date();
      const s = fmt ? fmt.format(d) : `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      $$('[data-clock]').forEach(e => { e.textContent = s; });
    };
    tick(); setInterval(tick, 1000);
  }
};

/* ============================ scroll physics ============================ */
const Scroll = {
  y: 0, sy: 0, v: 0, target: 0, current: 0, prevY: 0, lastSet: -1,
  animating: false, locked: false, smooth: false,
  max() { return Math.max(0, document.documentElement.scrollHeight - window.innerHeight); },
  init() {
    this.y = this.sy = this.target = this.current = this.prevY = window.scrollY;
    this.smooth = !Env.touch && !Env.reduced;
    if (this.smooth) window.addEventListener('wheel', e => this.onWheel(e), { passive: false });
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });
    window.addEventListener('keydown', e => this.onKey(e));
    Ticker.add(dt => this.update(dt), -10);
  },
  onWheel(e) {
    if (e.ctrlKey) return;
    if (e.target && e.target.closest && e.target.closest('[data-native-scroll]')) return;
    if (this.locked) { e.preventDefault(); return; }
    let d = e.deltaY;
    if (e.deltaMode === 1) d *= 16; else if (e.deltaMode === 2) d *= window.innerHeight;
    if (Math.abs(e.deltaX) > Math.abs(d)) return;
    e.preventDefault();
    if (!this.animating) { this.current = window.scrollY; this.target = this.current; }
    this.target = clamp(this.target + d, 0, this.max());
    this.animating = true;
  },
  onScroll() {
    const y = window.scrollY;
    if (this.animating && Math.abs(y - this.lastSet) > 4) this.animating = false;
    if (!this.animating) { this.target = this.current = y; }
  },
  onKey(e) {
    if (!this.locked) return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
    if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.key) || (e.key === ' ' && t.tagName !== 'BUTTON')) e.preventDefault();
  },
  update(dt) {
    if (this.animating && !this.locked) {
      this.current = damp(this.current, this.target, 8.5, dt);
      if (Math.abs(this.target - this.current) < 0.4) { this.current = this.target; this.animating = false; }
      this.lastSet = this.current;
      window.scrollTo(0, this.current);
    }
    this.y = this.animating ? this.current : window.scrollY;
    const raw = (this.y - this.prevY) / Math.max(dt, 1 / 240);
    this.prevY = this.y;
    this.v = damp(this.v, raw, 6, dt);
    this.sy = Env.reduced ? this.y : damp(this.sy, this.y, 10, dt);
    if (Math.abs(this.sy - this.y) < 0.05) this.sy = this.y;
  },
  jump(y) { this.animating = false; window.scrollTo(0, y); this.target = this.current = this.y = this.sy = this.prevY = window.scrollY; this.v = 0; },
  lock() { this.locked = true; this.animating = false; if (Env.touch) html.classList.add('is-locked'); },
  unlock() { this.locked = false; html.classList.remove('is-locked'); this.target = this.current = window.scrollY; },
  tweenTo(y, dur = 1600) {
    this.locked = true; this.animating = false;
    const from = window.scrollY;
    return tween({ from, to: y, dur: Env.reduced ? 0 : dur, ease: E.inOutQuart, update: v => { window.scrollTo(0, v); this.lastSet = v; } })
      .then(() => { this.locked = false; this.jump(y); });
  }
};

/* ============================ layout ============================ */
const Layout = {
  vw: window.innerWidth, vh: window.innerHeight, fns: [],
  on(fn) { this.fns.push(fn); },
  update() { this.vw = document.documentElement.clientWidth; this.vh = window.innerHeight; this.fns.forEach(f => safe(f, 'layout')); }
};
(() => {
  let t, lw = window.innerWidth, lh = window.innerHeight;
  window.addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      const w = window.innerWidth, h = window.innerHeight;
      if (Env.touch && w === lw && Math.abs(h - lh) < 170) return; // mobile toolbar, not a real resize
      const ae = document.activeElement;
      if (Env.touch && w === lw && ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA')) return; // on-screen keyboard
      lw = w; lh = h; Layout.update();
    }, 160);
  });
  if ('ResizeObserver' in window) {
    let rt, lastH = 0;
    new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight;
      if (Math.abs(h - lastH) < 2) return; lastH = h;
      clearTimeout(rt); rt = setTimeout(() => Layout.update(), 220);
    }).observe(document.body);
  }
})();

/* ============================ pointer, cursor, light ============================ */
const Pointer = {
  tx: 0, ty: 0, sx: 0, sy: 0, px: -1, py: -1, last: -10,
  init() {
    window.addEventListener('pointermove', e => {
      this.px = e.clientX; this.py = e.clientY;
      this.tx = (e.clientX / window.innerWidth) * 2 - 1;
      this.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      this.last = Ticker.time;
    }, { passive: true });
    Ticker.add((dt, t) => this.update(dt, t), -5);
  },
  get idle() { return Ticker.time - this.last > 4; },
  update(dt, t) {
    const idle = this.idle;
    if (idle) { this.tx = Math.sin(t * 0.21) * 0.55; this.ty = Math.cos(t * 0.16) * 0.35; }
    const k = idle ? 0.7 : 2.6;
    this.sx = damp(this.sx, this.tx, k, dt);
    this.sy = damp(this.sy, this.ty, k, dt);
  }
};

const Cursor = {
  el: $('.cursor'), x: -100, y: -100, tx: -100, ty: -100, state: '', lb: '',
  init() {
    if (Env.touch || !this.el) return;
    this.label = $('.cursor__label', this.el);
    html.classList.add('has-cursor');
    window.addEventListener('pointermove', e => {
      if (e.pointerType === 'touch') return;
      this.tx = e.clientX; this.ty = e.clientY;
      if (this.x < -50) { this.x = this.tx; this.y = this.ty; }
      this.el.classList.remove('is-hidden');
    }, { passive: true });
    document.addEventListener('pointerover', e => this.resolve(e.target));
    document.documentElement.addEventListener('mouseleave', () => this.el.classList.add('is-hidden'));
    window.addEventListener('pointerdown', () => this.el.classList.add('is-down'));
    window.addEventListener('pointerup', () => this.el.classList.remove('is-down'));
    Ticker.add(dt => this.update(dt), 5);
  },
  resolve(t) {
    const hit = t && t.closest ? t.closest('[data-cursor], a, button, input, textarea') : null;
    let st = '', lb = '';
    if (hit && !hit.disabled) {
      st = hit.dataset.cursor || (hit.matches('input, textarea') ? 'text' : 'link');
      lb = hit.dataset.label || '';
    }
    if (st !== this.state) { this.state = st; this.el.dataset.state = st; }
    if (lb !== this.lb) { this.lb = lb; this.label.textContent = lb; this.el.classList.toggle('has-label', !!lb); }
  },
  update(dt) {
    this.x = damp(this.x, this.tx, 24, dt);
    this.y = damp(this.y, this.ty, 24, dt);
    this.el.style.transform = `translate3d(${this.x.toFixed(1)}px, ${this.y.toFixed(1)}px, 0)`;
  }
};

const Ambient = {
  el: $('.ambient'), x: 0, y: 0,
  init() {
    if (!this.el) return;
    this.x = window.innerWidth / 2; this.y = window.innerHeight * 0.4;
    Ticker.add((dt, t) => {
      let tx, ty;
      if (Pointer.px < 0 || Pointer.idle) { tx = Layout.vw * (0.5 + Math.sin(t * 0.07) * 0.3); ty = Layout.vh * (0.45 + Math.cos(t * 0.05) * 0.25); }
      else { tx = Pointer.px; ty = Pointer.py; }
      this.x = damp(this.x, tx, 1.8, dt); this.y = damp(this.y, ty, 1.8, dt);
      this.el.style.transform = `translate3d(${this.x.toFixed(1)}px, ${this.y.toFixed(1)}px, 0)`;
    }, 6);
  }
};

const Trail = {
  cv: $('.trail'), pts: [], boost: 0, dirty: false,
  init() {
    if (!this.cv) return;
    if (Env.touch || Env.reduced) { this.cv.remove(); this.cv = null; return; }
    this.ctx = this.cv.getContext('2d');
    const size = () => { this.cv.width = window.innerWidth * Env.dpr; this.cv.height = window.innerHeight * Env.dpr; };
    size(); Layout.on(size);
    window.addEventListener('pointermove', e => { this.pts.push({ x: e.clientX, y: e.clientY, t: performance.now() }); if (this.pts.length > 70) this.pts.shift(); }, { passive: true });
    Ticker.add(dt => this.update(dt), 30);
  },
  kick() { if (this.cv) this.boost = 1; },
  update(dt) {
    const now = performance.now(), life = 650;
    while (this.pts.length && now - this.pts[0].t > life) this.pts.shift();
    if (this.boost <= 0 && !this.dirty) return;
    const c = this.ctx, d = Env.dpr;
    c.clearRect(0, 0, this.cv.width, this.cv.height);
    this.dirty = false;
    if (this.boost > 0 && this.pts.length > 1) {
      c.lineCap = 'round';
      for (let i = 1; i < this.pts.length; i++) {
        const a = this.pts[i - 1], b = this.pts[i];
        const age = (now - b.t) / life;
        const al = (1 - age) * this.boost * 0.42;
        if (al <= 0.003) continue;
        c.strokeStyle = `rgba(228,210,174,${al.toFixed(3)})`;
        c.lineWidth = (0.8 + (1 - age) * 1.6) * d;
        c.beginPath(); c.moveTo(a.x * d, a.y * d); c.lineTo(b.x * d, b.y * d); c.stroke();
      }
      this.dirty = true;
    }
    this.boost = Math.max(0, this.boost - dt * 0.7);
  }
};

function makeGrain() {
  const el = $('.grain'); if (!el) return;
  const n = 200, c = document.createElement('canvas'); c.width = c.height = n;
  const x = c.getContext('2d'), img = x.createImageData(n, n), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.random();
    const light = v > 0.5;
    const a = Math.abs(v - 0.5) * 2;
    d[i] = d[i + 1] = d[i + 2] = light ? 255 : 0;
    d[i + 3] = Math.round(a * a * (light ? 17 : 30));
  }
  x.putImageData(img, 0, 0);
  el.style.backgroundImage = `url(${c.toDataURL('image/png')})`;
  el.style.opacity = '1';
}

/* ============================ WebGL helpers ============================ */
function glProgram(gl, vs, fs) {
  const hp = gl.getShaderPrecisionFormat && gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
  if (hp && hp.precision === 0) fs = fs.replace(/precision highp float;/g, 'precision mediump float;');
  const sh = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  };
  const p = gl.createProgram();
  gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
  const u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(p, i); u[info.name] = gl.getUniformLocation(p, info.name); }
  return { p, u };
}
const QUAD_VS = 'attribute vec2 aP; void main(){ gl_Position = vec4(aP, 0.0, 1.0); }';
function fullTri(gl, prog) {
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog.p, 'aP'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  return b;
}

const GLSL_COMMON = `
precision highp float;
uniform vec2 uRes; uniform float uSeed; uniform float uTime; uniform vec3 uTint;
float h11(float n){ return fract(sin(n * 12.9898) * 43758.5453); }
float h21(vec2 p){ p = fract(p * vec2(233.34, 851.73)); p += dot(p, p + 23.45); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), u.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), u.x), u.y); }
float fbm(vec2 p){ float v = 0.0; float a = 0.5; for (int i = 0; i < 5; i++){ v += a * vn(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + 3.1; a *= 0.5; } return v; }
float fbm3(vec2 p){ float v = 0.0; float a = 0.5; for (int i = 0; i < 3; i++){ v += a * vn(p); p = mat2(1.6, 1.2, -1.2, 1.6) * p + 3.1; a *= 0.5; } return v; }
float sdBox(vec2 p, vec2 b){ vec2 d = abs(p) - b; return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0); }
float sdRBox(vec2 p, vec2 b, float r){ return sdBox(p, b - r) - r; }
float sdArch(vec2 q, float w, float h){ float yc = h - w; if (q.y > yc) return length(vec2(q.x, q.y - yc)) - w; return max(abs(q.x) - w, -q.y); }
vec3 finish(vec3 c, vec2 uv, vec2 fc){
  float vig = smoothstep(1.25, 0.2, length((uv - 0.5) * vec2(1.1, 1.0)));
  c *= mix(0.42, 1.0, vig);
  c += (h21(fc + uSeed * 31.7) - 0.5) * 0.032;
  c = c / (1.0 + c * 0.25);
  return max(c, 0.0);
}
/* macro hair: fibres that follow a warped flow field, lit by an anisotropic band */
vec3 hairTex(vec2 p0, float t, float light, vec3 tint, float seed){
  vec2 p = p0 + vec2(seed * 1.37, seed * 0.61);
  float wv = fbm3(vec2(p.x * 0.9, p.y * 0.55 - t * 0.035));
  float xw = p.x + 0.11 * sin(p.y * 1.7 + wv * 2.4 + t * 0.10) + 0.075 * sin(p.y * 4.6 + p.x * 1.3 + t * 0.16) + 0.16 * wv;
  float clump = fbm3(vec2(xw * 7.0, p.y * 0.35 + t * 0.01));
  float f = 0.0;
  for (int i = 0; i < 3; i++){
    float fi = float(i);
    float freq = 74.0 + fi * 64.0;
    float lay = xw + 0.018 * sin(p.y * (3.0 + fi * 1.7) + fi * 2.1 + t * 0.12);
    float s = lay * freq + fbm3(vec2(lay * 2.5 + fi * 7.0, p.y * 1.4)) * 6.0;
    float id = floor(s);
    float r = h21(vec2(id, fi + seed));
    float prof = 1.0 - abs(fract(s) - 0.5) * 2.0;
    prof = pow(prof, 2.0 + r * 5.0);
    f += prof * (0.25 + 0.75 * r) * (0.62 - fi * 0.14);
  }
  float by = 0.52 + 0.20 * sin(xw * 2.1 + t * 0.08) + (light - 0.5) * 1.5;
  float band = exp(-pow((p0.y - by) * 3.4, 2.0));
  float band2 = exp(-pow((p0.y - by + 0.38) * 7.0, 2.0)) * 0.45;
  float dark = 0.3 + 0.7 * clump;
  vec3 base = vec3(0.05, 0.042, 0.035) * (0.4 + dark);
  return base + f * dark * (0.035 + 1.05 * (band + band2)) * tint;
}
`;

const MATERIALS = {
  hair: { tint: [1.0, 0.87, 0.68], src: `
void main(){ vec2 fc = gl_FragCoord.xy; vec2 uv = fc / uRes; float asp = uRes.x / uRes.y;
  float k = clamp(uRes.y / 1000.0, 0.35, 1.0);
  vec2 p = vec2(uv.x * asp, uv.y);
  vec3 c = hairTex(p * k, uSeed * 3.0, 0.5 * k + 0.12 + 0.08 * sin(uSeed), uTint, uSeed) * 1.25;
  gl_FragColor = vec4(finish(c, uv, fc), 1.0); }` },
  hairWarm: { tint: [1.0, 0.68, 0.42], src: null },
  stone: { src: `
void main(){ vec2 fc = gl_FragCoord.xy; vec2 uv = fc / uRes; float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y) + uSeed * 1.7;
  float warp = fbm(p * 2.0);
  float strata = fbm(vec2(p.x * 0.6 + warp * 0.4, p.y * 9.0 + warp * 1.6));
  float fine = fbm(vec2(p.x * 5.0, p.y * 70.0));
  float pores = smoothstep(0.8, 0.93, vn(vec2(p.x * 26.0, p.y * 190.0))) * smoothstep(0.35, 0.6, fbm3(p * 6.0));
  vec3 a = vec3(0.25, 0.228, 0.198); vec3 b = vec3(0.31, 0.287, 0.25);
  vec3 c = mix(a, b, strata);
  c *= 0.88 + 0.24 * fine;
  c -= pores * 0.11;
  float light = smoothstep(1.35, -0.15, uv.x * 0.85 + (1.0 - uv.y) * 0.55);
  c *= 0.18 + 1.05 * light;
  float joint = 1.0 - smoothstep(0.0, 1.2 / uRes.y, abs(uv.y - 0.62));
  c *= 1.0 - joint * 0.5;
  gl_FragColor = vec4(finish(c, uv, fc), 1.0); }` },
  metal: { src: `
void main(){ vec2 fc = gl_FragCoord.xy; vec2 uv = fc / uRes; float asp = uRes.x / uRes.y;
  vec2 p = vec2(uv.x * asp, uv.y);
  float br = fbm(vec2(p.x * 1.4 + uSeed, p.y * 240.0));
  float br2 = vn(vec2(p.x * 3.0, p.y * 900.0));
  float e = (uv.y - 0.36) - (uv.x - 0.5) * 0.5;
  float up = step(0.0, e);
  float spec = exp(-pow((uv.x * 0.95 - uv.y * 0.35 - 0.33) * 2.4, 2.0));
  float spec2 = exp(-pow((uv.x * 0.9 - uv.y * 0.2 - 0.72) * 7.0, 2.0)) * 0.35;
  vec3 steel = vec3(0.10, 0.104, 0.11) + br * 0.09 + br2 * 0.025;
  vec3 c = steel + (spec + spec2) * vec3(0.62, 0.6, 0.56) * (0.6 + 0.4 * br);
  vec3 low = vec3(0.028, 0.027, 0.026) + br * 0.02 + exp(-pow((uv.x - 0.25) * 3.0, 2.0)) * 0.03;
  c = mix(low, c, up);
  c += exp(-abs(e) * uRes.y * 0.8) * vec3(0.95, 0.88, 0.76) * 0.85;
  c += smoothstep(0.05, 0.0, e) * up * vec3(0.12, 0.11, 0.1);
  float screw = length((uv - vec2(0.74, 0.7)) * vec2(asp, 1.0));
  vec2 sq = (uv - vec2(0.74, 0.7)) * vec2(asp, 1.0);
  vec3 pivot = vec3(0.16, 0.16, 0.165) + 0.5 * exp(-dot(sq - vec2(-0.015, 0.018), sq - vec2(-0.015, 0.018)) * 900.0) + fbm(vec2(atan(sq.y, sq.x) * 8.0, screw * 90.0)) * 0.06;
  c = mix(c, pivot, smoothstep(0.047, 0.044, screw));
  c += (1.0 - smoothstep(0.0, 1.5 / uRes.y, abs(screw - 0.046))) * 0.3;
  c -= (1.0 - smoothstep(0.0, 1.4 / uRes.y, abs(sq.x * 0.7 + sq.y * 0.7))) * step(screw, 0.03) * 0.12;
  gl_FragColor = vec4(finish(c, uv, fc), 1.0); }` },
  room: { src: `
void main(){ vec2 fc = gl_FragCoord.xy; vec2 uv = fc / uRes; float asp = uRes.x / uRes.y;
  vec2 p = vec2((uv.x - 0.5) * asp, uv.y);
  float hz = 0.27;
  float ax = (mod(uSeed, 2.0) < 0.5 ? 0.12 : -0.14) * min(asp, 1.2);
  float aw = 0.17 * min(asp, 1.0) + 0.03; float ah = 0.56;
  float beamX = p.x + (uv.y - hz) * 0.55 + 0.2 * asp;
  float beam = smoothstep(0.19, 0.09, abs(beamX - 0.02)) * smoothstep(0.02, 0.1, uv.y - hz);
  vec3 c;
  if (uv.y >= hz){
    float wy = (uv.y - hz) / (1.0 - hz);
    c = vec3(0.075, 0.07, 0.063) * (0.85 + 0.3 * fbm(vec2(p.x * 4.0, uv.y * 9.0)));
    float jx = abs(fract(p.x * 2.4 + 0.5) - 0.5) / 2.4;
    c *= 1.0 - (1.0 - smoothstep(0.0, 1.2 / uRes.y, jx)) * 0.35;
    c += beam * vec3(0.19, 0.155, 0.11) * (1.0 - wy * 0.55);
    float d = sdArch(vec2(p.x - ax, uv.y - hz), aw, ah);
    if (d < 0.0){
      float gy = (uv.y - hz) / ah;
      vec3 mir = vec3(0.022, 0.022, 0.022) + vec3(0.055, 0.05, 0.045) * gy;
      float rb = smoothstep(0.06, 0.02, abs((p.x - ax) + (uv.y - hz) * 0.42 - 0.03));
      mir += rb * vec3(0.10, 0.085, 0.065);
      c = mir;
    }
    c += (1.0 - smoothstep(0.0, 1.6 / uRes.y, abs(d))) * vec3(0.3, 0.26, 0.21) * 0.55;
    c *= 0.6 + 0.55 * smoothstep(1.0, 0.25, wy);
  } else {
    float fy = (hz - uv.y) / hz;
    c = vec3(0.04, 0.038, 0.035) * (0.85 + 0.3 * fbm(vec2(p.x * 3.0, fy * 22.0)));
    float patch = smoothstep(0.22, 0.08, abs(p.x + 0.12 * asp - fy * 0.5)) * smoothstep(1.1, 0.0, fy);
    c += patch * vec3(0.15, 0.12, 0.088);
    float dr = sdArch(vec2(p.x - ax, (hz - uv.y) * 1.6), aw, ah);
    if (dr < 0.0) c *= 0.62;
    c *= 0.7 + 0.3 * smoothstep(0.0, 0.05, fy);
  }
  float bench = sdBox(vec2(p.x - (ax < 0.0 ? 0.3 : -0.32) * asp, uv.y - (hz + 0.032)), vec2(0.14 * min(asp, 1.2), 0.032));
  if (bench < 0.0) c = vec3(0.17, 0.158, 0.138) * (0.55 + 0.7 * smoothstep(-0.03, 0.03, uv.y - hz - 0.03));
  c += (1.0 - smoothstep(0.0, 1.4 / uRes.y, abs(bench))) * 0.08;
  gl_FragColor = vec4(finish(c, uv, fc), 1.0); }` },
  chair: { src: `
vec3 part(float d, vec3 col, vec3 c){ return mix(c, col, 1.0 - smoothstep(-0.0015, 0.0015, d)); }
void main(){ vec2 fc = gl_FragCoord.xy; vec2 uv = fc / uRes; float asp = uRes.x / uRes.y;
  vec2 p = vec2((uv.x - 0.5) * asp, uv.y);
  float hz = 0.2;
  float hw = 0.07 + (1.0 - uv.y) * 0.34;
  float cone = exp(-pow(p.x / hw, 2.0)) * smoothstep(0.0, 0.6, uv.y) * 0.07;
  vec3 c = vec3(0.028, 0.027, 0.025) + cone * vec3(1.0, 0.86, 0.66);
  if (uv.y < hz){
    float fy = (hz - uv.y) / hz;
    c = vec3(0.03, 0.029, 0.027) * (0.9 + 0.2 * fbm(vec2(p.x * 3.0, fy * 30.0)));
    float pool = exp(-pow(p.x / 0.33, 2.0) - pow((uv.y - hz + 0.06) / 0.07, 2.0));
    c += pool * vec3(0.16, 0.13, 0.095);
  }
  float spot = exp(-pow(p.x / 0.26, 2.0));
  // reflection first (drawn below the horizon, faded)
  vec2 rq = vec2(p.x, 2.0 * hz - uv.y);
  float rs = min(min(sdRBox(rq - vec2(0.0, hz + 0.27), vec2(0.19, 0.03), 0.02), sdRBox(rq - vec2(0.0, hz + 0.49), vec2(0.15, 0.19), 0.06)), sdBox(rq - vec2(0.0, hz + 0.13), vec2(0.022, 0.12)));
  if (uv.y < hz && rs < 0.0) c = mix(c, vec3(0.012), 0.6 * smoothstep(0.0, 0.12, hz - uv.y + 0.02));
  float base = length(vec2(p.x / 0.17, (uv.y - hz - 0.004) / 0.018)) - 1.0;
  c = part(base, vec3(0.05, 0.05, 0.052) + (1.0 - smoothstep(-0.25, 0.0, base)) * 0.0 + smoothstep(-0.2, 0.0, base) * 0.12 * spot, c);
  float col = sdBox(p - vec2(0.0, hz + 0.13), vec2(0.022, 0.12));
  float cyl = 1.0 - pow(abs(p.x) / 0.022, 2.0);
  c = part(col, vec3(0.06, 0.062, 0.066) + pow(max(cyl, 0.0), 6.0) * 0.35 * vec3(0.9, 0.86, 0.8) + max(cyl, 0.0) * 0.04, c);
  float back = sdRBox(p - vec2(0.0, hz + 0.49), vec2(0.15, 0.19), 0.06);
  float bx = clamp(p.x / 0.15, -1.0, 1.0);
  vec3 leather = vec3(0.045, 0.036, 0.03);
  vec3 bcol = leather * (0.6 + 0.8 * (1.0 - bx * bx)) + pow(max(1.0 - bx * bx, 0.0), 8.0) * 0.1 * spot * vec3(1.0, 0.85, 0.65);
  bcol += smoothstep(-0.02, 0.0, back) * 0.1 * vec3(1.0, 0.86, 0.66) * smoothstep(hz + 0.5, hz + 0.68, uv.y);
  float seams = 1.0 - smoothstep(0.0, 1.5 / uRes.y, abs(abs(p.x) - 0.06));
  bcol *= 1.0 - seams * 0.35 * step(back, -0.01);
  c = part(back, bcol, c);
  float head = sdRBox(p - vec2(0.0, hz + 0.76), vec2(0.075, 0.03), 0.028);
  float rod = sdBox(p - vec2(0.0, hz + 0.705), vec2(0.006, 0.03));
  c = part(rod, vec3(0.09, 0.09, 0.095), c);
  c = part(head, leather * 1.2 + smoothstep(-0.015, 0.0, head) * 0.14 * vec3(1.0, 0.86, 0.66) * step(hz + 0.76, uv.y), c);
  float seat = sdRBox(p - vec2(0.0, hz + 0.27), vec2(0.19, 0.03), 0.02);
  vec3 scol = leather * 0.9 + smoothstep(0.0, 0.06, uv.y - hz - 0.25) * 0.16 * spot * vec3(1.0, 0.85, 0.66);
  c = part(seat, scol, c);
  float arms = min(sdRBox(vec2(abs(p.x), uv.y) - vec2(0.205, hz + 0.345), vec2(0.022, 0.009), 0.008), sdBox(vec2(abs(p.x), uv.y) - vec2(0.205, hz + 0.315), vec2(0.004, 0.03)));
  c = part(arms, vec3(0.1, 0.075, 0.055) + smoothstep(hz + 0.34, hz + 0.355, uv.y) * 0.12, c);
  gl_FragColor = vec4(finish(c, uv, fc), 1.0); }` }
};
MATERIALS.hairWarm.src = MATERIALS.hair.src;

/* ============================ 2D fallbacks (no WebGL) ============================ */
// Used when a browser or device has WebGL switched off, blocked or lost. Same palette, same composition.
const rng = seed => { let a = (seed * 9973 + 1) >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const rrect = (x, X, Y, w, h, r) => { x.beginPath(); x.moveTo(X + r, Y); x.lineTo(X + w - r, Y); x.quadraticCurveTo(X + w, Y, X + w, Y + r); x.lineTo(X + w, Y + h - r); x.quadraticCurveTo(X + w, Y + h, X + w - r, Y + h); x.lineTo(X + r, Y + h); x.quadraticCurveTo(X, Y + h, X, Y + h - r); x.lineTo(X, Y + r); x.quadraticCurveTo(X, Y, X + r, Y); x.closePath(); };
const Fallback = {
  canvas(w, h) { const c = document.createElement('canvas'); c.width = Math.max(1, w); c.height = Math.max(1, h); return [c, c.getContext('2d')]; },
  vignette(x, w, h, k = 0.7) {
    const g = x.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.2, w / 2, h / 2, Math.max(w, h) * 0.75);
    g.addColorStop(0, 'rgba(10,10,9,0)'); g.addColorStop(1, `rgba(10,10,9,${k})`);
    x.fillStyle = g; x.fillRect(0, 0, w, h);
  },
  hair(w, h, seed = 1, warm = false) {
    const [c, x] = this.canvas(w, h), r = rng(seed + 3);
    x.fillStyle = '#0b0a09'; x.fillRect(0, 0, w, h);
    const tint = warm ? [236, 168, 104] : [238, 216, 182];
    const A0 = h * 0.07, f0 = (Math.PI * 1.7) / h, p0 = r() * 6.28, A1 = h * 0.025, f1 = (Math.PI * 4.6) / h, p1 = r() * 6.28;
    const n = Math.round(w / 1.6), step = Math.max(6, h / 70);
    x.lineCap = 'round';
    for (let i = 0; i < n; i++) {
      const x0 = r() * w * 1.25 - w * 0.12, amp = h * 0.012 * r(), ph = r() * 6.28, b = Math.pow(r(), 2.4);
      x.strokeStyle = `rgba(${tint[0]},${tint[1]},${tint[2]},${(0.025 + b * 0.2).toFixed(3)})`;
      x.lineWidth = 0.5 + r() * 1.2;
      x.beginPath();
      for (let y = -step; y <= h + step; y += step) {
        const xx = x0 + Math.sin(y * f0 + p0) * A0 + Math.sin(y * f1 + p1 + x0 * 0.002) * A1 + Math.sin(y * f1 * 1.9 + ph) * amp;
        if (y === -step) x.moveTo(xx, y); else x.lineTo(xx, y);
      }
      x.stroke();
    }
    const g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(10,10,9,.78)'); g.addColorStop(0.42, 'rgba(10,10,9,.05)'); g.addColorStop(0.58, 'rgba(10,10,9,.05)'); g.addColorStop(1, 'rgba(10,10,9,.82)');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    this.vignette(x, w, h, 0.55);
    return c;
  },
  stone(w, h, seed = 1) {
    const [c, x] = this.canvas(w, h), r = rng(seed + 11);
    x.fillStyle = '#2b2721'; x.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 1 + r() * 3) {
      x.fillStyle = r() < 0.5 ? `rgba(255,244,222,${(r() * 0.05).toFixed(3)})` : `rgba(0,0,0,${(r() * 0.08).toFixed(3)})`;
      x.fillRect(0, y, w, 1 + r() * 2);
    }
    for (let i = 0; i < (w * h) / 900; i++) {
      x.fillStyle = `rgba(0,0,0,${(0.15 + r() * 0.35).toFixed(2)})`;
      x.beginPath(); x.ellipse(r() * w, r() * h, 1 + r() * 4, 0.6 + r() * 1.2, 0, 0, 6.29); x.fill();
    }
    x.fillStyle = 'rgba(0,0,0,.45)'; x.fillRect(0, h * 0.38, w, 1);
    const g = x.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, 'rgba(255,238,210,.08)'); g.addColorStop(0.55, 'rgba(10,10,9,.35)'); g.addColorStop(1, 'rgba(10,10,9,.88)');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    return c;
  },
  metal(w, h, seed = 1) {
    const [c, x] = this.canvas(w, h), r = rng(seed + 21);
    x.fillStyle = '#1b1c1e'; x.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y++) { x.fillStyle = `rgba(230,232,236,${(r() * 0.07).toFixed(3)})`; x.fillRect(0, y, w, 1); }
    const g = x.createLinearGradient(w * 0.05, h * 0.05, w * 0.75, h * 0.6);
    g.addColorStop(0, 'rgba(230,226,218,0)'); g.addColorStop(0.45, 'rgba(230,226,218,.42)'); g.addColorStop(0.62, 'rgba(230,226,218,.05)'); g.addColorStop(1, 'rgba(230,226,218,0)');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    const yL = h * (0.64 + 0.25), yR = h * (0.64 - 0.25);
    x.fillStyle = '#080807'; x.beginPath(); x.moveTo(0, yL); x.lineTo(w, yR); x.lineTo(w, h); x.lineTo(0, h); x.closePath(); x.fill();
    x.strokeStyle = 'rgba(245,232,205,.85)'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(0, yL); x.lineTo(w, yR); x.stroke();
    const px = w * 0.74, py = h * 0.3, pr = h * 0.046;
    const pg = x.createRadialGradient(px - pr * 0.3, py - pr * 0.4, 1, px, py, pr);
    pg.addColorStop(0, '#9a9a9c'); pg.addColorStop(1, '#2a2a2c');
    x.fillStyle = pg; x.beginPath(); x.arc(px, py, pr, 0, 6.29); x.fill();
    x.strokeStyle = 'rgba(255,255,255,.3)'; x.lineWidth = 1; x.stroke();
    this.vignette(x, w, h, 0.5);
    return c;
  },
  room(w, h, seed = 0) {
    const [c, x] = this.canvas(w, h);
    const hz = h * 0.73, asp = w / h;
    const wall = x.createLinearGradient(0, 0, 0, hz); wall.addColorStop(0, '#0d0c0b'); wall.addColorStop(1, '#1d1b18');
    x.fillStyle = wall; x.fillRect(0, 0, w, hz);
    const fl = x.createLinearGradient(0, hz, 0, h); fl.addColorStop(0, '#141210'); fl.addColorStop(1, '#090807');
    x.fillStyle = fl; x.fillRect(0, hz, w, h - hz);
    x.save(); x.globalCompositeOperation = 'lighter';
    const bx = w * 0.18, bg = x.createLinearGradient(bx, 0, bx + h * 0.4, 0);
    bg.addColorStop(0, 'rgba(255,214,160,0)'); bg.addColorStop(0.5, 'rgba(255,214,160,.13)'); bg.addColorStop(1, 'rgba(255,214,160,0)');
    x.fillStyle = bg; x.beginPath(); x.moveTo(bx, 0); x.lineTo(bx + h * 0.22, 0); x.lineTo(bx + h * 0.62, hz); x.lineTo(bx + h * 0.38, hz); x.closePath(); x.fill();
    x.restore();
    const ax = w * (0.5 + ((seed % 2 ? -0.14 : 0.12) * Math.min(asp, 1.2)) / asp), aw = h * (0.17 * Math.min(asp, 1) + 0.03), ah = h * 0.56;
    x.beginPath(); x.moveTo(ax - aw, hz); x.lineTo(ax - aw, hz - ah + aw); x.arc(ax, hz - ah + aw, aw, Math.PI, 0); x.lineTo(ax + aw, hz); x.closePath();
    const mg = x.createLinearGradient(0, hz - ah, 0, hz); mg.addColorStop(0, '#060606'); mg.addColorStop(1, '#16140f');
    x.fillStyle = mg; x.fill(); x.strokeStyle = 'rgba(236,214,180,.35)'; x.lineWidth = 1; x.stroke();
    const bx2 = ax < w / 2 ? w * 0.62 : w * 0.12;
    x.fillStyle = '#2a2722'; x.fillRect(bx2, hz - h * 0.064, w * 0.26, h * 0.064);
    x.fillStyle = 'rgba(255,240,215,.12)'; x.fillRect(bx2, hz - h * 0.064, w * 0.26, 1);
    this.vignette(x, w, h, 0.6);
    return c;
  },
  chair(w, h) {
    const [c, x] = this.canvas(w, h), cx = w / 2, fy = h * 0.8, u = h;
    x.fillStyle = '#080807'; x.fillRect(0, 0, w, h);
    const cone = x.createLinearGradient(0, 0, 0, fy);
    cone.addColorStop(0, 'rgba(255,220,170,.0)'); cone.addColorStop(1, 'rgba(255,220,170,.07)');
    x.fillStyle = cone; x.beginPath(); x.moveTo(cx - u * 0.06, 0); x.lineTo(cx + u * 0.06, 0); x.lineTo(cx + u * 0.38, fy); x.lineTo(cx - u * 0.38, fy); x.closePath(); x.fill();
    const pool = x.createRadialGradient(cx, fy + u * 0.03, 1, cx, fy + u * 0.03, u * 0.36);
    pool.addColorStop(0, 'rgba(255,214,160,.16)'); pool.addColorStop(1, 'rgba(255,214,160,0)');
    x.fillStyle = pool; x.fillRect(0, fy - u * 0.1, w, h);
    const leather = (y0, y1) => { const g = x.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#3a2c22'); g.addColorStop(1, '#0d0a08'); return g; };
    x.fillStyle = '#121214'; x.beginPath(); x.ellipse(cx, fy, u * 0.17, u * 0.018, 0, 0, 6.29); x.fill();
    const col = x.createLinearGradient(cx - u * 0.022, 0, cx + u * 0.022, 0);
    col.addColorStop(0, '#111'); col.addColorStop(0.45, '#9b988f'); col.addColorStop(1, '#141414');
    x.fillStyle = col; x.fillRect(cx - u * 0.022, fy - u * 0.25, u * 0.044, u * 0.25);
    x.fillStyle = leather(fy - u * 0.69, fy - u * 0.3); rrect(x, cx - u * 0.15, fy - u * 0.69, u * 0.3, u * 0.38, u * 0.06); x.fill();
    x.fillStyle = leather(fy - u * 0.3, fy - u * 0.24); rrect(x, cx - u * 0.19, fy - u * 0.3, u * 0.38, u * 0.06, u * 0.02); x.fill();
    x.fillStyle = leather(fy - u * 0.79, fy - u * 0.73); rrect(x, cx - u * 0.075, fy - u * 0.79, u * 0.15, u * 0.056, u * 0.026); x.fill();
    x.fillStyle = '#1d1d1f'; x.fillRect(cx - u * 0.006, fy - u * 0.735, u * 0.012, u * 0.05);
    x.fillStyle = '#2a1f17'; rrect(x, cx - u * 0.227, fy - u * 0.355, u * 0.044, u * 0.018, u * 0.008); x.fill(); rrect(x, cx + u * 0.183, fy - u * 0.355, u * 0.044, u * 0.018, u * 0.008); x.fill();
    this.vignette(x, w, h, 0.55);
    return c;
  },
  material(type, w, h, seed) {
    switch (type) {
      case 'hairWarm': return this.hair(w, h, seed, true);
      case 'stone': return this.stone(w, h, seed);
      case 'metal': return this.metal(w, h, seed);
      case 'room': return this.room(w, h, seed);
      case 'chair': return this.chair(w, h);
      default: return this.hair(w, h, seed, false);
    }
  }
};

// caps WebGL redraws near 75 fps so 120 Hz phones do not burn battery on invisible frames
const frameGate = (o, dt) => { o._acc = Math.min((o._acc || 0) + dt, 0.05); if (o._acc < 1 / 75) return false; o._acc -= 1 / 75; if (o._acc > 1 / 75) o._acc = 0; return true; };

/* ============================ materials lab ============================ */
const Lab = {
  gl: null, cv: null, progs: new Map(), queue: [], running: false,
  init() {
    this.cv = document.createElement('canvas');
    try { this.gl = this.cv.getContext('webgl', { preserveDrawingBuffer: true, antialias: false, alpha: false, depth: false }); } catch (e) { this.gl = null; }
    if (this.gl) this.cv.addEventListener('webglcontextlost', ev => { ev.preventDefault(); this.gl = null; this.progs.clear(); }, false);
  },
  program(src) {
    if (this.progs.has(src)) return this.progs.get(src);
    const gl = this.gl;
    const prog = glProgram(gl, QUAD_VS, GLSL_COMMON + src);
    gl.useProgram(prog.p);
    prog.buf = fullTri(gl, prog);
    this.progs.set(src, prog);
    return prog;
  },
  render(type, w, h, seed) {
    const gl = this.gl;
    if (!gl || gl.isContextLost()) return Fallback.material(type, w, h, seed);
    try {
      const m = MATERIALS[type] || MATERIALS.hair;
      this.cv.width = w; this.cv.height = h;
      gl.viewport(0, 0, w, h);
      const prog = this.program(m.src);
      gl.useProgram(prog.p);
      gl.bindBuffer(gl.ARRAY_BUFFER, prog.buf);
      const loc = gl.getAttribLocation(prog.p, 'aP'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(prog.u.uRes, w, h);
      if (prog.u.uSeed) gl.uniform1f(prog.u.uSeed, seed);
      if (prog.u.uTime) gl.uniform1f(prog.u.uTime, seed * 7.0);
      if (prog.u.uTint) gl.uniform3fv(prog.u.uTint, m.tint || [1, 0.87, 0.68]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (gl.isContextLost()) return Fallback.material(type, w, h, seed);
      const out = document.createElement('canvas'); out.width = w; out.height = h;
      out.getContext('2d').drawImage(this.cv, 0, 0);
      return out;
    } catch (err) {
      console.warn('[solus] lab', err);
      return Fallback.material(type, w, h, seed);
    }
  },
  push(job) { this.queue.push(job); this.pump(); },
  pump() {
    if (this.running) return; this.running = true;
    const idle = window.requestIdleCallback ? cb => window.requestIdleCallback(cb, { timeout: 400 }) : cb => setTimeout(cb, 16);
    const next = () => {
      const job = this.queue.shift();
      if (!job) { this.running = false; return; }
      safe(job, 'lab');
      idle(next);
    };
    idle(next);
  }
};

const Media = {
  io: null,
  init() {
    if ('IntersectionObserver' in window) this.io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { this.io.unobserve(e.target); this.fill(e.target); } }), { rootMargin: '120% 0px 120% 0px' });
    $$('.media[data-visual]').forEach(el => this.observe(el));
    let hov = null;
    document.addEventListener('pointermove', e => {
      if (Env.touch) return;
      const m = e.target.closest ? e.target.closest('.media[data-hover]') : null;
      if (m !== hov) { if (hov) { hov.style.setProperty('--hx', '0px'); hov.style.setProperty('--hy', '0px'); } hov = m; }
      if (!m) return;
      const r = m.getBoundingClientRect();
      const rx = (e.clientX - r.left) / r.width - 0.5, ry = (e.clientY - r.top) / r.height - 0.5;
      m.style.setProperty('--hx', `${(-rx * 18).toFixed(1)}px`); m.style.setProperty('--hy', `${(-ry * 18).toFixed(1)}px`);
      m.style.setProperty('--gx', `${((rx + 0.5) * 100).toFixed(1)}%`); m.style.setProperty('--gy', `${((ry + 0.5) * 100).toFixed(1)}%`);
    }, { passive: true });
  },
  observe(el) { if (this.io) this.io.observe(el); else this.fill(el); },
  fill(el, size) {
    if (el._filled) return; el._filled = true;
    const src = el.dataset.src;
    if (src) {
      const img = new Image(); img.alt = ''; img.decoding = 'async'; img.loading = 'lazy';
      img.onload = () => el.classList.add('is-drawn');
      img.src = src; el.appendChild(img); return;
    }
    Lab.push(() => {
      let w = size ? size.w : el.offsetWidth, h = size ? size.h : el.offsetHeight;
      if (!w || !h) { w = Layout.vw; h = Layout.vh; }
      let s = size ? 1 : Math.min(Env.dpr, 1.5) * 1.1;
      const maxD = Env.mobile ? 1100 : (size ? 1600 : 1800);
      if (Math.max(w, h) * s > maxD) s = maxD / Math.max(w, h);
      const c = Lab.render(el.dataset.visual, Math.round(w * s), Math.round(h * s), +el.dataset.seed || 0);
      el.appendChild(c);
      requestAnimationFrame(() => el.classList.add('is-drawn'));
    });
  }
};

/* ============================ THE LINE ============================
   One fixed SVG polyline. Each section owns an "anchor" that says where the
   line should be while that section holds the viewport centre; between
   anchors the points morph pointwise, so the line rotates, converges to a
   point or stretches back out as you scroll. It also bends with scroll
   velocity and steps aside for the cursor.                                */
const Line = {
  N: 56, el: $('.line'), base: $('.line__base'), light: $('.line__light'), dot: $('.line__dot'),
  anchors: [], pts: null, phase: 0, bend: 0, isDot: false, lastD: '',
  init() {
    if (!this.el) return;
    this.pts = new Float32Array(this.N * 2);
    this.a = new Float32Array(this.N * 2); this.b = new Float32Array(this.N * 2);
    // m: how far (in viewport heights) outside the host the anchor still holds the line; negative = must be well inside (pinned hosts)
    this.anchors = [
      { host: $('.hero__pin'), m: -0.35, get: () => Hero.lineGeom() },
      { host: $('.room__pin'), m: -0.35, get: () => Room.lineGeom() },
      { host: $('.manif'), m: 0.22, get: () => this.hGeom($('[data-anchor="manif"]')) },
      { host: $('.steps'), m: -0.08, get: () => this.vGeom($('[data-anchor="axis"]'), $('.steps')) },
      { host: $('.parting__pin'), m: -0.35, get: () => this.vGeom($('[data-anchor="parting"]'), $('.parting__pin')) },
      { host: $('.looks__list'), m: 0.04, get: () => Looks.lineGeom() },
      { host: $('.flow') || $('.call'), m: 0.04, get: () => Booking.lineGeom() },
      { host: $('.foot__end'), m: 0.3, get: () => this.pGeom($('[data-anchor="end"]')) }
    ].filter(a => a.host);
    const size = () => { this.el.setAttribute('viewBox', `0 0 ${Layout.vw} ${Layout.vh}`); this.el.setAttribute('width', Layout.vw); this.el.setAttribute('height', Layout.vh); };
    size(); Layout.on(size);
    Ticker.add((dt, t) => this.update(dt, t), 26);
  },
  // geometry helpers — all return {type, ...} in viewport px
  hGeom(el, x0, x1) { if (!el) return null; const r = el.getBoundingClientRect(); return { type: 'h', y: r.top, x0: x0 == null ? 0 : x0, x1: x1 == null ? Layout.vw : x1 }; },
  vGeom(el, host) { if (!el) return null; const r = el.getBoundingClientRect(), h = (host || el).getBoundingClientRect(); return { type: 'v', x: r.left, y0: Math.max(h.top, -40), y1: Math.min(h.bottom, Layout.vh + 40) }; },
  pGeom(el) { if (!el) return null; const r = el.getBoundingClientRect(); return { type: 'p', x: r.left + r.width / 2, y: r.top + r.height / 2 }; },
  fillPts(out, g) {
    const N = this.N;
    for (let i = 0; i < N; i++) {
      const f = i / (N - 1);
      let x, y;
      if (g.type === 'h') { x = g.x0 + (g.x1 - g.x0) * f; y = g.y; }
      else if (g.type === 'v') { x = g.x; y = g.y0 + (g.y1 - g.y0) * f; }
      else { x = g.x; y = g.y; }
      out[i * 2] = x; out[i * 2 + 1] = y;
    }
  },
  update(dt, t) {
    const vh = Layout.vh, c = vh * 0.5;
    const A = this.anchors;
    // release / catch points along the page for each anchor
    let k = -1;
    const rects = A.map(a => a.host.getBoundingClientRect());
    for (let i = 0; i < A.length; i++) { if (rects[i].bottom + A[i].m * vh <= c) k = i; }
    let ia = Math.max(0, k), ib = Math.min(A.length - 1, k + 1), tt = 0;
    if (k >= 0 && k < A.length - 1) {
      const rel = rects[k].bottom + A[k].m * vh, cat = rects[k + 1].top - A[k + 1].m * vh;
      tt = cat > rel ? clamp((c - rel) / (cat - rel)) : 1;
    } else if (k === A.length - 1) { ia = ib = k; tt = 0; }
    let ga = null, gb = null;
    try { ga = A[ia].get(); } catch (e) { ga = null; }
    try { gb = ia === ib ? ga : A[ib].get(); } catch (e) { gb = null; }
    if (!ga && !gb) return;
    if (!ga) ga = gb; if (!gb) gb = ga;
    this.fillPts(this.a, ga); this.fillPts(this.b, gb);
    const e = E.inOutSine(tt), P = this.pts, N = this.N;
    for (let i = 0; i < N * 2; i++) P[i] = this.a[i] + (this.b[i] - this.a[i]) * e;
    // chord + normal
    const dx = P[(N - 1) * 2] - P[0], dy = P[(N - 1) * 2 + 1] - P[1];
    const chord = Math.hypot(dx, dy) || 1;
    const nx = -dy / chord, ny = dx / chord;
    const pointness = 1 - clamp(chord / 60);
    // physics: scroll velocity bends the line like a string; the cursor pushes it aside
    const vb = Env.reduced ? 0 : clamp(Scroll.v / 4200, -1, 1) * 11;
    this.bend = damp(this.bend, vb, 7, dt);
    const px = Pointer.px, py = Pointer.py, hasPtr = !Env.touch && px >= 0 && !Pointer.idle;
    for (let i = 0; i < N; i++) {
      const f = i / (N - 1), s = Math.sin(Math.PI * f) * this.bend * (1 - pointness);
      let ox = nx * s, oy = ny * s;
      if (hasPtr && !pointness) {
        const ddx = px - P[i * 2], ddy = py - P[i * 2 + 1];
        const d = Math.hypot(ddx, ddy);
        if (d < 140) { const side = (ddx * nx + ddy * ny) > 0 ? -1 : 1; const push = 9 * Math.exp(-(d * d) / (2 * 55 * 55)); ox += nx * push * side; oy += ny * push * side; }
      }
      P[i * 2] += ox; P[i * 2 + 1] += oy;
    }
    // path
    let d = `M${P[0].toFixed(1)} ${P[1].toFixed(1)}`, len = 0;
    for (let i = 1; i < N; i++) { d += `L${P[i * 2].toFixed(1)} ${P[i * 2 + 1].toFixed(1)}`; len += Math.hypot(P[i * 2] - P[(i - 1) * 2], P[i * 2 + 1] - P[(i - 1) * 2 + 1]); }
    if (d !== this.lastD) { this.lastD = d; this.base.setAttribute('d', d); this.light.setAttribute('d', d); }
    // light travelling along the line
    if (!Env.reduced && len > 4) {
      this.phase = (this.phase + dt / 2.6) % 1;
      const seg = Math.max(24, len * 0.12);
      this.light.style.strokeDasharray = `${seg.toFixed(1)} ${len.toFixed(1)}`;
      this.light.style.strokeDashoffset = (-(this.phase * (len + seg)) + seg).toFixed(1);
      this.light.style.opacity = (0.9 * (1 - pointness)).toFixed(2);
    }
    const isDot = pointness > 0.6;
    if (isDot !== this.isDot) { this.isDot = isDot; this.el.classList.toggle('is-dot', isDot); }
    if (isDot) { this.dot.setAttribute('cx', P[0].toFixed(1)); this.dot.setAttribute('cy', P[1].toFixed(1)); }
  }
};

/* ============================ 00 · ПОРОГ ============================ */
const HERO_VS = `
attribute vec4 aD;
uniform float uTime; uniform float uAspect; uniform float uIntro; uniform float uScroll;
uniform float uK; uniform float uOffY; uniform float uSX; uniform float uHover; uniform vec2 uMouse;
uniform float uCutY; uniform float uMode; uniform float uFade;
varying float vA; varying float vS; varying float vD;
vec3 spine(float t, float tm){
  return vec3(0.30 * sin(t * 3.3 + tm * 0.31 + 0.6) + 0.10 * sin(t * 7.4 - tm * 0.43),
              mix(1.25, -1.2, t),
              0.34 * cos(t * 2.7 + tm * 0.27));
}
vec3 strand(float t, vec4 d, float tm){
  vec3 c = spine(t, tm);
  vec3 T = normalize(spine(t + 0.012, tm) - c);
  vec3 N = normalize(cross(T, vec3(0.0, 0.0, 1.0)));
  vec3 B = cross(T, N);
  float tw = t * 4.6 + tm * 0.21 + uScroll * 3.0;
  vec3 d1 = N * cos(tw) + B * sin(tw);
  vec3 d2 = -N * sin(tw) + B * cos(tw);
  float w = 0.05 + 0.5 * pow(max(sin(3.14159 * min(t * 1.08, 1.0)), 0.0), 0.65) + 0.22 * smoothstep(0.7, 1.0, t);
  w *= 1.0 + uScroll * 0.9;
  vec3 p = c + d1 * (d.y * w) + d2 * (d.z * w * 0.32);
  float amp = 0.006 + 0.04 * t * t + step(0.9, d.w) * 0.16 * t * t;
  p += vec3(sin(t * 11.0 + d.w * 61.0 + tm * 0.9), 0.35 * sin(t * 9.0 + d.w * 37.0 - tm * 0.7), cos(t * 8.0 + d.w * 23.0 + tm * 0.6)) * amp;
  return p;
}
void main(){
  float t = aD.x; float tm = uTime;
  vec3 p = strand(t, aD, tm);
  vec3 T = normalize(strand(t + 0.01, aD, tm) - p);
  float ay = uMouse.x * 0.32 + sin(tm * 0.09) * 0.18;
  float ax = -uMouse.y * 0.14;
  float cy = cos(ay); float sy = sin(ay); float cx = cos(ax); float sx = sin(ax);
  mat3 R = mat3(cy, 0.0, -sy, 0.0, 1.0, 0.0, sy, 0.0, cy) * mat3(1.0, 0.0, 0.0, 0.0, cx, sx, 0.0, -sx, cx);
  p = R * p; T = R * T;
  vec2 m = vec2(uMouse.x * 1.35, uMouse.y * 1.25);
  vec2 dd = p.xy - m;
  float fall = exp(-dot(dd, dd) * 7.0) * uHover;
  p.xy += normalize(dd + vec2(0.0001)) * fall * 0.11;
  p.z += fall * 0.1;
  vec3 cam = p - vec3(0.0, 0.0, 3.4);
  float depth = -cam.z;
  vec2 ndc = vec2(cam.x * uSX / uAspect, cam.y) * uK * 3.4 / depth;
  ndc.y += uOffY;
  vec3 V = normalize(-cam);
  vec3 L = normalize(vec3(uMouse.x * 2.4 + 0.5, uMouse.y * 2.0 + 0.9, 1.3));
  vec3 H = normalize(L + V);
  float th = dot(T, H);
  float sTH = sqrt(max(0.0, 1.0 - th * th));
  float tl = dot(T, L);
  vD = sqrt(max(0.0, 1.0 - tl * tl));
  vS = pow(sTH, 90.0) + 0.22 * pow(sTH, 14.0);
  float grow = smoothstep(t - 0.1, t, uIntro * 1.12 - aD.w * 0.08);
  float fog = clamp(1.15 - (depth - 3.1) * 1.1, 0.25, 1.0);
  float alpha = grow * fog * smoothstep(0.0, 0.07, t);
  if (uMode < 0.5) {
    alpha *= smoothstep(uCutY - 0.012, uCutY + 0.012, ndc.y);
  } else {
    float ph = fract(uTime * 0.075 + aD.w * 9.0);
    float below = 1.0 - smoothstep(uCutY - 0.012, uCutY + 0.012, ndc.y);
    ndc.y -= ph * 0.95;
    ndc.x += sin(ph * 5.0 + aD.w * 30.0) * 0.08 * ph;
    alpha *= below * (1.0 - ph) * (1.0 - ph) * step(aD.w, 0.12) * 0.8 * uFade * (1.0 - 0.6 * smoothstep(0.85, 1.0, t));
  }
  gl_Position = vec4(ndc, 0.0, 1.0);
  vA = alpha;
}`;
const HERO_FS = `
precision mediump float;
varying float vA; varying float vS; varying float vD;
uniform float uGain;
void main(){
  vec3 base = vec3(0.46, 0.41, 0.35) * (0.1 + 0.45 * vD);
  vec3 hl = vec3(1.0, 0.9, 0.74) * vS * 1.9;
  vec3 c = (base + hl) * vA * uGain;
  gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)));
}`;

const Hero = {
  sec: $('.hero'), pin: $('.hero__pin'), cv: $('.hero__gl'), name: $('.hero__name'), cut: $('.hero__cut'),
  gl: null, prog: null, count: 0, intro: 0, hover: 0, geo: {}, p: 0, gap: 0,
  init() {
    this.fades = $$('.hero__fade');
    let ok = false;
    try { ok = this.initGL(); } catch (err) { console.warn('[nv] hero gl', err); ok = false; }
    if (!ok) safe(() => this.init2D(), 'hero 2d');
    this.measure();
    Layout.on(() => this.measure());
    Ticker.add((dt, t) => this.update(dt, t), 2);
  },
  measure() {
    const W = this.pin.clientWidth, H = this.pin.clientHeight;
    const hz = this.cut.offsetTop;
    const mob = W < 820;
    this.geo = { W, H, hz, mob };
    this.top = absTop(this.sec); this.len = Math.max(1, this.sec.offsetHeight - H);
    this.resizeGL();
    if (this.ctx2d) safe(() => this.draw2D(), 'hero 2d draw');
  },
  lineGeom() { const r = this.cut.getBoundingClientRect(); return { type: 'h', y: r.top, x0: 0, x1: Layout.vw }; },
  initGL() {
    let gl = null;
    try { gl = this.cv.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: true, depth: false, stencil: false, powerPreference: 'high-performance' }); } catch (e) { gl = null; }
    if (!gl) return false;
    if (!this._loss) {
      this._loss = true;
      this.cv.addEventListener('webglcontextlost', ev => { ev.preventDefault(); this.lost = true; }, false);
      this.cv.addEventListener('webglcontextrestored', () => { this.lost = false; safe(() => { this.initGL(); this.resizeGL(); }, 'hero restore'); }, false);
    }
    this.gl = gl;
    this.prog = glProgram(gl, HERO_VS, HERO_FS);
    const N = Env.mobile ? 820 : 1750, S = Env.mobile ? 52 : 76;
    const data = new Float32Array(N * (S - 1) * 2 * 4);
    const bell = () => (Math.random() + Math.random() + Math.random()) / 1.5 - 1;
    let o = 0;
    for (let i = 0; i < N; i++) {
      const u = bell(), v = bell(), r = Math.random();
      for (let k = 0; k < S - 1; k++) {
        data[o++] = k / (S - 1); data[o++] = u; data[o++] = v; data[o++] = r;
        data[o++] = (k + 1) / (S - 1); data[o++] = u; data[o++] = v; data[o++] = r;
      }
    }
    this.count = N * (S - 1) * 2;
    this.buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, this.buf); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    gl.useProgram(this.prog.p);
    const loc = gl.getAttribLocation(this.prog.p, 'aD'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 4, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
    gl.clearColor(0, 0, 0, 0);
    if (this.gain == null) this.gain = (Env.mobile ? 0.07 : 0.052) * (Env.dpr > 1.4 ? 1.3 : 1);
    return true;
  },
  init2D() {
    if (this.gl) { const nc = this.cv.cloneNode(false); this.cv.replaceWith(nc); this.cv = nc; this.gl = null; }
    const ctx = this.cv.getContext('2d');
    if (!ctx) return;
    this.ctx2d = ctx;
    this.cv.classList.add('is-2d');
  },
  mapping() {
    // the strand parameter t = 0.62 (where the lock is still full) lands exactly on the line; the root hangs above the top edge
    const { H, hz, mob } = this.geo;
    const cutNdc = 1 - (2 * hz) / H;
    const yCut = 1.25 - 2.45 * 0.62;
    const k = Math.max(0.6, (1.12 - cutNdc) / (1.25 - yCut));
    return { cutNdc, k, offY: cutNdc - yCut * k, sx: mob ? 0.34 : 0.7 };
  },
  draw2D() {
    const { W, H, hz, mob } = this.geo, x = this.ctx2d;
    if (!W || !H) return;
    const d = Math.min(Env.dpr, 2), asp = W / H, tm = 9;
    const { k, offY, sx } = this.mapping();
    this.cv.width = Math.round(W * d); this.cv.height = Math.round(H * d);
    const cw = this.cv.width, ch = this.cv.height;
    x.clearRect(0, 0, cw, ch);
    x.globalCompositeOperation = 'lighter'; x.lineCap = 'round'; x.lineJoin = 'round';
    const spine = t => [0.30 * Math.sin(t * 3.3 + tm * 0.31 + 0.6) + 0.10 * Math.sin(t * 7.4 - tm * 0.43), 1.25 - 2.45 * t, 0.34 * Math.cos(t * 2.7 + tm * 0.27)];
    const nrm = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
    const r = rng(7), N = mob ? 300 : 460, S = 56;
    const bell = () => (r() + r() + r()) / 1.5 - 1;
    for (let i = 0; i < N; i++) {
      const u = bell(), v = bell(), w0 = r(), pts = [];
      for (let s = 0; s < S; s++) {
        const t = s / (S - 1), c = spine(t), c2 = spine(t + 0.012);
        const T = nrm([c2[0] - c[0], c2[1] - c[1], c2[2] - c[2]]);
        const Nv = nrm([T[1], -T[0], 0]);
        const B = [T[1] * Nv[2] - T[2] * Nv[1], T[2] * Nv[0] - T[0] * Nv[2], T[0] * Nv[1] - T[1] * Nv[0]];
        const tw = t * 4.6 + tm * 0.21, ct = Math.cos(tw), st = Math.sin(tw);
        const sm = Math.max(0, Math.min(1, (t - 0.7) / 0.3)), wd = 0.05 + 0.5 * Math.pow(Math.max(Math.sin(Math.PI * Math.min(t * 1.08, 1)), 0), 0.65) + 0.22 * sm * sm * (3 - 2 * sm);
        const a1 = u * wd, a2 = v * wd * 0.32, amp = 0.006 + 0.04 * t * t + (w0 > 0.9 ? 0.16 * t * t : 0);
        const p = [0, 1, 2].map(q => c[q] + (Nv[q] * ct + B[q] * st) * a1 + (-Nv[q] * st + B[q] * ct) * a2);
        p[0] += Math.sin(t * 11 + w0 * 61 + tm * 0.9) * amp; p[1] += 0.35 * Math.sin(t * 9 + w0 * 37 - tm * 0.7) * amp; p[2] += Math.cos(t * 8 + w0 * 23 + tm * 0.6) * amp;
        const depth = 3.4 - p[2];
        const nx = (p[0] * sx / asp) * k * 3.4 / depth, ny = p[1] * k * 3.4 / depth + offY;
        pts.push((nx * 0.5 + 0.5) * cw, (0.5 - ny * 0.5) * ch);
      }
      const b = Math.pow(r(), 2);
      x.lineWidth = (0.45 + r() * 0.55) * d;
      x.strokeStyle = `rgba(232,212,180,${(0.03 + b * 0.08).toFixed(3)})`;
      x.beginPath(); x.moveTo(pts[0], pts[1]); for (let q = 2; q < pts.length; q += 2) x.lineTo(pts[q], pts[q + 1]); x.stroke();
      const h0 = Math.floor(S * (0.3 + r() * 0.3)), h1 = Math.min(S - 4, h0 + Math.floor(S * (0.1 + r() * 0.25)));
      x.strokeStyle = `rgba(255,238,210,${(0.025 + b * 0.09).toFixed(3)})`;
      x.beginPath(); x.moveTo(pts[h0 * 2], pts[h0 * 2 + 1]); for (let q = h0 + 1; q < h1; q++) x.lineTo(pts[q * 2], pts[q * 2 + 1]); x.stroke();
    }
    // nothing below the cut, soft start above the top edge
    x.globalCompositeOperation = 'destination-out';
    x.fillStyle = 'rgba(0,0,0,1)'; x.fillRect(0, hz * d, cw, ch - hz * d);
    const g = x.createLinearGradient(0, 0, 0, ch * 0.12);
    g.addColorStop(0, 'rgba(0,0,0,.9)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(0, 0, cw, ch * 0.12);
    x.globalCompositeOperation = 'source-over';
  },
  resizeGL() {
    if (!this.gl) return;
    const { W, H, mob } = this.geo;
    const d = this.lowDpr ? 1 : Math.min(Env.dpr, mob ? 2 : 1.75);
    this.cv.width = Math.round(W * d); this.cv.height = Math.round(H * d);
    this.gl.viewport(0, 0, this.cv.width, this.cv.height);
    Object.assign(this, this.mapping());
  },
  reveal() { tween({ dur: Env.reduced ? 0 : 3800, ease: E.outCubic, update: v => { this.intro = v; } }); },
  bootTexts() {
    const el = $('[data-nextslot]'); if (el) el.textContent = Schedule.next();
    const td = $('[data-today]'); if (td) td.textContent = Schedule.today();
  },
  update(dt, t) {
    const { W, H } = this.geo;
    if (!W) return;
    if (Scroll.sy > this.top + this.len + H) return;
    // the cut opens: halves part, the lock rises with the upper half
    const s = Math.max(0, Scroll.sy - this.top);
    const p = clamp(s / (this.len * 0.85));
    this.p = p;
    const gap = p * H * 0.62;
    if (Math.abs(gap - this.gap) > 0.2) {
      this.gap = gap;
      this.name.style.setProperty('--gap', `${gap.toFixed(1)}px`);
      const fo = (1 - range(p, 0, 0.3)).toFixed(3);
      this.fades.forEach(el => { el.style.opacity = fo; el.style.pointerEvents = p > 0.3 ? 'none' : ''; });
    }
    const mx = Pointer.sx, my = Pointer.sy;
    const active = !Pointer.idle && Pointer.py >= 0 && Pointer.py < H;
    this.hover = damp(this.hover, active ? 1 : 0.25, 2, dt);
    if (!Env.reduced) this.cv.style.transform = `translate3d(${(-mx * 10).toFixed(2)}px, ${(-gap + my * 5).toFixed(2)}px, 0)`;
    else this.cv.style.transform = `translate3d(0, ${(-gap).toFixed(2)}px, 0)`;
    if (!this.gl || this.lost || this.intro <= 0) return;
    if (!frameGate(this, dt)) return;
    this.perf(dt);
    const gl = this.gl, u = this.prog.u;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(u.uTime, Env.reduced ? 12 : t);
    gl.uniform1f(u.uAspect, W / H);
    gl.uniform1f(u.uIntro, this.intro);
    gl.uniform1f(u.uScroll, p * 0.5);
    gl.uniform1f(u.uK, this.k);
    gl.uniform1f(u.uOffY, this.offY);
    gl.uniform1f(u.uSX, this.sx);
    gl.uniform1f(u.uHover, this.hover);
    gl.uniform2f(u.uMouse, mx, my);
    gl.uniform1f(u.uGain, this.gain);
    gl.uniform1f(u.uCutY, this.cutNdc);
    gl.uniform1f(u.uFade, 1 - range(p, 0, 0.25));
    gl.uniform1f(u.uMode, 0);
    gl.drawArrays(gl.LINES, 0, this.drawCount || this.count);
    if (!Env.reduced && p < 0.25) { gl.uniform1f(u.uMode, 1); gl.drawArrays(gl.LINES, 0, this.drawCount || this.count); }
  },
  // adaptive quality: if the device cannot hold ~40fps, draw fewer fibres and lighten the centerpiece
  perf(dt) {
    if (this.tuned) return;
    this.frames = (this.frames || 0) + 1;
    if (this.frames < 30) return;
    this.acc = (this.acc || 0) + dt;
    if (this.frames < 120) return;
    const avg = this.acc / 90;
    this.tuned = true;
    if (avg > 0.025) {
      this.drawCount = Math.floor(this.count * (avg > 0.05 ? 0.35 : 0.55) / 2) * 2;
      this.gain *= avg > 0.05 ? 2.2 : 1.6;
      if (avg > 0.05) { this.lowDpr = true; this.resizeGL(); }
      Parting.q = 0.7; Parting.measure();
    }
  }
};

/* ============================ 01 · КОМНАТА ============================
   The line arrives as a point and draws the room: the floor edge, the mirror,
   then the chair — a wireframe in true perspective, lit by depth, orbiting a
   few degrees with the cursor (or a horizontal drag on touch screens).      */
const Room = {
  sec: $('.room'), pin: $('.room__pin'), cv: $('.room__cv'), ctx: null,
  lines: [], total: 0, top: 0, len: 1, p: 0, pen: null, yawV: 0, yawVel: 0, start: null,
  init() {
    this.ctx = this.cv.getContext('2d');
    this.l1 = $$('.rt--1 .ln>span'); this.l2 = $$('.rt--2 .ln>span'); this.hint = $('[data-room-hint]');
    if (this.hint && !Env.touch) this.hint.hidden = true;
    this.build();
    this.measure(); Layout.on(() => this.measure());
    // orbit by horizontal drag on touch screens; vertical scroll keeps working (touch-action: pan-y)
    let sx = 0, sy = 0, drag = false, moved = false, lastX = 0, lastT = 0;
    this.pin.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') return; sx = lastX = e.clientX; sy = e.clientY; drag = true; moved = false; lastT = performance.now(); }, { passive: true });
    window.addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (!moved && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) moved = true;
      if (moved) { const now = performance.now(); const d = e.clientX - lastX; this.yawV += d * 0.0045; this.yawVel = d / Math.max(1, now - lastT) * 4.5; lastX = e.clientX; lastT = now; }
    }, { passive: true });
    const end = () => { drag = false; };
    window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
    Ticker.add((dt, t) => this.update(dt, t), 12);
  },
  build() {
    const L = [];
    const add = pts => { let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]); L.push({ pts, len }); };
    const circleY = (cx, y, cz, r, n = 44, a0 = 0) => { const pts = []; for (let i = 0; i <= n; i++) { const a = a0 + i / n * Math.PI * 2; pts.push([cx + Math.cos(a) * r, y, cz + Math.sin(a) * r]); } return pts; };
    const rrectY = (cx, y, cz, w, d, r, n = 6) => {
      const pts = [], hw = w / 2 - r, hd = d / 2 - r;
      const corners = [[hw, hd, 0], [-hw, hd, Math.PI / 2], [-hw, -hd, Math.PI], [hw, -hd, Math.PI * 1.5]];
      for (const [ox, oz, a0] of corners) for (let i = 0; i <= n; i++) { const a = a0 + i / n * Math.PI / 2; pts.push([cx + ox + Math.cos(a) * r, y, cz + oz + Math.sin(a) * r]); }
      pts.push(pts[0].slice()); return pts;
    };
    const rrectXY = (cx, cy, z, w, h, r, n = 6) => {
      const pts = [], hw = w / 2 - r, hh = h / 2 - r;
      const corners = [[hw, hh, 0], [-hw, hh, Math.PI / 2], [-hw, -hh, Math.PI], [hw, -hh, Math.PI * 1.5]];
      for (const [ox, oy, a0] of corners) for (let i = 0; i <= n; i++) { const a = a0 + i / n * Math.PI / 2; pts.push([cx + ox + Math.cos(a) * r, cy + oy + Math.sin(a) * r, z]); }
      pts.push(pts[0].slice()); return pts;
    };
    const tilt = (pts, ang, py, pz) => pts.map(([x, y, z]) => { const dy = y - py, dz = z - pz; return [x, py + dy * Math.cos(ang) - dz * Math.sin(ang), pz + dy * Math.sin(ang) + dz * Math.cos(ang)]; });
    const Z = -1.35;
    // 1 · floor / wall edge — the line continues horizontally into the room
    add([[-2.4, 0, Z], [2.4, 0, Z]]);
    // 2 · mirror: an arch standing against the wall
    const arch = (hw, top, z) => { const pts = [[-hw, 0, z], [-hw, top - hw, z]]; for (let i = 0; i <= 24; i++) { const a = Math.PI - i / 24 * Math.PI; pts.push([Math.cos(a) * hw, top - hw + Math.sin(a) * hw, z]); } pts.push([hw, 0, z]); return pts; };
    add(arch(0.46, 1.92, Z + 0.02));
    add(arch(0.425, 1.885, Z + 0.025));
    // 3 · base
    add(circleY(0, 0, 0, 0.36));
    add(circleY(0, 0.035, 0, 0.36, 44, 0.4));
    add(circleY(0, 0.035, 0, 0.14, 32));
    // 4 · column
    add(circleY(0, 0.47, 0, 0.05, 24));
    for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2 + 0.4; add([[Math.cos(a) * 0.05, 0.035, Math.sin(a) * 0.05], [Math.cos(a) * 0.05, 0.47, Math.sin(a) * 0.05]]); }
    // 5 · seat
    const s0 = rrectY(0, 0.48, 0.03, 0.54, 0.5, 0.08), s1 = rrectY(0, 0.56, 0.03, 0.54, 0.5, 0.08);
    add(s0); add(s1);
    for (let i = 0; i < 4; i++) { const k = i * 7 + 3; add([s0[k], s1[k]]); }
    // 6 · arms
    for (const sx of [-0.3, 0.3]) {
      add(rrectY(sx, 0.75, 0.0, 0.055, 0.36, 0.02, 4));
      add([[sx, 0.56, 0.12], [sx, 0.73, 0.12]]);
    }
    // 7 · backrest, reclined 7°
    const pv = [0.56, -0.2], ang = -0.12;
    const b0 = tilt(rrectXY(0, 0.87, -0.2, 0.48, 0.58, 0.07), ang, pv[0], pv[1]), b1 = tilt(rrectXY(0, 0.87, -0.27, 0.48, 0.58, 0.07), ang, pv[0], pv[1]);
    add(b0); add(b1);
    for (let i = 0; i < 4; i++) { const k = i * 7 + 3; add([b0[k], b1[k]]); }
    // 8 · headrest
    add(tilt([[0, 1.16, -0.235], [0, 1.22, -0.235]], ang, pv[0], pv[1]));
    const h0 = tilt(rrectXY(0, 1.27, -0.2, 0.2, 0.09, 0.035), ang, pv[0], pv[1]), h1 = tilt(rrectXY(0, 1.27, -0.265, 0.2, 0.09, 0.035), ang, pv[0], pv[1]);
    add(h0); add(h1);
    this.lines = L; this.total = L.reduce((s, l) => s + l.len, 0);
  },
  measure() {
    this.top = absTop(this.sec); this.len = Math.max(1, this.sec.offsetHeight - Layout.vh);
    const W = this.pin.clientWidth, H = this.pin.clientHeight, d = Math.min(Env.dpr, 2);
    this.W = W; this.H = H; this.d = d;
    this.cv.width = Math.round(W * d); this.cv.height = Math.round(H * d);
    this.mob = W < 820;
    this.dirty = true;
  },
  camera(t) {
    const yaw = 0.55 + Pointer.sx * 0.11 + Math.sin(t * 0.08) * 0.05 + this.yawV;
    const pitch = 0.2 - Pointer.sy * 0.06;
    const R = this.mob ? 3.5 : 3.9;
    const target = [0, 0.78, -0.45];
    const eye = [target[0] + Math.sin(yaw) * Math.cos(pitch) * R, target[1] + Math.sin(pitch) * R, target[2] + Math.cos(yaw) * Math.cos(pitch) * R];
    const f = [target[0] - eye[0], target[1] - eye[1], target[2] - eye[2]];
    const fl = Math.hypot(f[0], f[1], f[2]); f[0] /= fl; f[1] /= fl; f[2] /= fl;
    const r = [-f[2], 0, f[0]]; const rl = Math.hypot(r[0], r[2]); r[0] /= rl; r[2] /= rl;
    const u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
    const F = (this.mob ? this.W * 1.7 : this.H * 1.3) * this.d;
    const cx = (this.mob ? 0.5 : 0.62) * this.W * this.d, cy = (this.mob ? 0.4 : 0.52) * this.H * this.d;
    return { eye, f, r, u, F, cx, cy };
  },
  proj(p, c) {
    const dx = p[0] - c.eye[0], dy = p[1] - c.eye[1], dz = p[2] - c.eye[2];
    const z = dx * c.f[0] + dy * c.f[1] + dz * c.f[2];
    const x = dx * c.r[0] + dy * c.r[1] + dz * c.r[2];
    const y = dx * c.u[0] + dy * c.u[1] + dz * c.u[2];
    return [c.cx + x * c.F / z, c.cy - y * c.F / z, z];
  },
  lineGeom() {
    const r = this.pin.getBoundingClientRect();
    const pen = this.pen || this.start;
    if (!pen) return { type: 'p', x: Layout.vw / 2, y: r.top + Layout.vh / 2 };
    return { type: 'p', x: r.left + pen[0] / this.d, y: r.top + pen[1] / this.d };
  },
  update(dt, t) {
    this.yawV += this.yawVel * dt * 0.01; this.yawVel *= Math.exp(-4 * dt);
    const vis = !(Scroll.sy + Layout.vh < this.top - 50 || Scroll.sy > this.top + this.len + Layout.vh + 50);
    if (!vis && !this.dirty) return;
    this.dirty = false;
    const raw = (Scroll.sy - this.top) / this.len, p = clamp(raw);
    this.p = p;
    const drawn = range(p, 0.05, 0.72), erase = E.inCubic(range(p, 0.86, 0.97));
    const line = (el, a, b, c2, d2) => { const inn = E.outCubic(range(p, a, b)), out = E.inCubic(range(p, c2, d2)); el.style.transform = `translate3d(0, ${((1 - inn) * 175 - out * 175).toFixed(2)}%, 0)`; };
    this.l1.forEach((el, i) => line(el, 0.4 + i * 0.03, 0.52 + i * 0.03, 0.86, 0.93));
    this.l2.forEach((el, i) => line(el, 0.58 + i * 0.03, 0.7 + i * 0.03, 0.88, 0.95));
    if (this.hint) this.hint.style.opacity = p < 0.06 ? '1' : '0';
    this.render(drawn, erase, t);
  },
  render(drawn, erase, t) {
    const x = this.ctx, cw = this.cv.width, ch = this.cv.height, d = this.d;
    const cam = this.camera(t);
    x.clearRect(0, 0, cw, ch);
    // a quiet pool of daylight at the mirror's foot
    const base = this.proj([0, 0, -1.3], cam);
    const g = x.createRadialGradient(base[0], base[1], 2, base[0], base[1], ch * 0.45);
    g.addColorStop(0, `rgba(200,176,137,${(0.075 * drawn * (1 - erase)).toFixed(3)})`); g.addColorStop(1, 'rgba(200,176,137,0)');
    x.fillStyle = g; x.fillRect(0, 0, cw, ch);
    const D = drawn * this.total, S = erase * this.total, trail = this.total * 0.04;
    let acc = 0, pen = null;
    x.lineWidth = 1 * d; x.lineCap = 'round'; x.lineJoin = 'round';
    const first = this.lines[0], fp = this.proj(first.pts[0], cam);
    this.start = [fp[0], fp[1]];
    for (const L of this.lines) {
      const a0 = acc, a1 = acc + L.len; acc = a1;
      if (a1 <= S || a0 >= D) continue;
      const pts = L.pts, n = pts.length;
      // walk the polyline, drawing [S, D] with the last `trail` in brass
      let segAcc = a0, started = false;
      x.beginPath();
      let depthSum = 0, dc = 0, prev = this.proj(pts[0], cam);
      for (let i = 1; i < n; i++) {
        const q = this.proj(pts[i], cam);
        const sl = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]);
        const s0 = segAcc, s1 = segAcc + sl; segAcc = s1;
        if (s1 <= S) { prev = q; continue; }
        if (s0 >= D) break;
        const f0 = clamp((S - s0) / sl), f1 = clamp((D - s0) / sl);
        const P0 = [prev[0] + (q[0] - prev[0]) * f0, prev[1] + (q[1] - prev[1]) * f0];
        const P1 = [prev[0] + (q[0] - prev[0]) * f1, prev[1] + (q[1] - prev[1]) * f1];
        if (!started) { x.moveTo(P0[0], P0[1]); started = true; }
        x.lineTo(P1[0], P1[1]);
        depthSum += q[2]; dc++;
        if (f1 < 1) { pen = P1; break; }
        pen = P1; prev = q;
      }
      const depth = dc ? depthSum / dc : 4;
      const fog = clamp(1.35 - (depth - 2.6) * 0.42, 0.22, 1);
      x.strokeStyle = `rgba(236,230,218,${(0.26 + 0.5 * fog).toFixed(3)})`;
      x.stroke();
    }
    // the drawing head: a short brass trail and the pen
    if (pen && drawn > 0 && drawn < 1) {
      let acc2 = 0;
      x.beginPath(); let st = false;
      for (const L of this.lines) {
        const a0 = acc2, a1 = acc2 + L.len; acc2 = a1;
        if (a1 <= D - trail || a0 >= D) continue;
        let segAcc = a0, prev = this.proj(L.pts[0], cam);
        for (let i = 1; i < L.pts.length; i++) {
          const q = this.proj(L.pts[i], cam);
          const sl = Math.hypot(L.pts[i][0] - L.pts[i - 1][0], L.pts[i][1] - L.pts[i - 1][1], L.pts[i][2] - L.pts[i - 1][2]);
          const s0 = segAcc, s1 = segAcc + sl; segAcc = s1;
          if (s1 <= D - trail) { prev = q; continue; }
          if (s0 >= D) break;
          const f0 = clamp((D - trail - s0) / sl), f1 = clamp((D - s0) / sl);
          const P0 = [prev[0] + (q[0] - prev[0]) * f0, prev[1] + (q[1] - prev[1]) * f0];
          const P1 = [prev[0] + (q[0] - prev[0]) * f1, prev[1] + (q[1] - prev[1]) * f1];
          if (!st) { x.moveTo(P0[0], P0[1]); st = true; }
          x.lineTo(P1[0], P1[1]);
          prev = q;
        }
      }
      x.strokeStyle = 'rgba(228,210,174,.95)'; x.lineWidth = 1.2 * d; x.stroke();
      x.fillStyle = '#e4d2ae'; x.beginPath(); x.arc(pen[0], pen[1], 2.4 * d, 0, Math.PI * 2); x.fill();
    }
    this.pen = pen || (drawn >= 1 ? this.lastPen : this.start);
    if (pen) this.lastPen = pen;
  }
};

/* ============================ navigation + transitions ============================ */
const Nav = {
  secs: $$('[data-section]'), cache: [], active: -1, pct: -1,
  init() {
    this.rail = $$('.rail a');
    this.measure(); Layout.on(() => this.measure());
    Ticker.add(() => this.update(), 20);
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('[data-go]');
      if (!a) return;
      e.preventDefault();
      const i = +a.dataset.go;
      if (html.classList.contains('is-index')) this.toggleIndex(false);
      Transition.go(i);
    });
    this.rail.forEach(a => {
      a.addEventListener('mouseenter', () => {
        const i = +a.dataset.go;
        $('.peek__n').textContent = pad(i);
        $('.peek__t').textContent = this.secs[i].dataset.name;
        html.classList.add('nav-peek');
      });
      a.addEventListener('mouseleave', () => html.classList.remove('nav-peek'));
      a.addEventListener('click', () => html.classList.remove('nav-peek'));
    });
    const bar = $('.cmd__bar');
    bar.addEventListener('click', () => this.toggleIndex(!html.classList.contains('is-index')));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && html.classList.contains('is-index')) this.toggleIndex(false); });
  },
  toggleIndex(on) {
    html.classList.toggle('is-index', on);
    $('.cmd__bar').setAttribute('aria-expanded', String(on));
    $('.cmd__bar').setAttribute('aria-label', on ? 'Закрыть оглавление' : 'Открыть оглавление');
    if (on) Scroll.lock(); else Scroll.unlock();
  },
  measure() {
    this.cache = this.secs.map(s => ({ top: absTop(s), h: s.offsetHeight }));
    const last = this.cache[this.cache.length - 1];
    last.h = document.documentElement.scrollHeight - last.top;
  },
  update() {
    const y = Scroll.y + Layout.vh * 0.5;
    let idx = 0;
    for (let i = 0; i < this.cache.length; i++) if (y >= this.cache[i].top) idx = i;
    if (idx !== this.active) this.setActive(idx);
    const pct = Math.round(clamp(Scroll.y / Scroll.max()) * 100);
    if (pct !== this.pct) {
      this.pct = pct;
      $('.cmd__prog i').style.setProperty('--p', pct / 100);
    }
  },
  setActive(i) {
    const first = this.active === -1;
    this.active = i;
    this.rail.forEach((a, k) => {
      a.classList.toggle('is-active', k === i - 1);
      a.classList.toggle('is-past', k < i - 1);
      if (k === i - 1) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    const name = this.secs[i].dataset.name;
    swapText($('[data-cmd-t]'), name); swapText($('[data-cmd-n]'), pad(i));
    html.classList.toggle('past-hero', i > 0);
    if (!first && !Transition.busy) Trail.kick();
  }
};

const Transition = {
  veil: $('.veil'), busy: false,
  async go(i, { y = null, during = null } = {}) {
    if (this.busy) return;
    Nav.measure();
    const target = y != null ? y : (i === 0 ? 0 : Nav.cache[i].top + 1);
    if (Env.reduced) { if (during) during(); Scroll.jump(target); return; }
    this.busy = true;
    Scroll.lock();
    const name = Nav.secs[i].dataset.name;
    $('.veil__num').textContent = pad(i);
    $('.veil__label').textContent = name;
    this.veil.classList.add('is-active', 'is-closed');
    await wait(720);
    if (during) safe(during, 'transition');
    Scroll.unlock();
    Scroll.jump(target);
    await wait(180);
    this.veil.classList.add('is-opening'); this.veil.classList.remove('is-closed');
    await wait(980);
    this.veil.classList.remove('is-active', 'is-opening');
    this.busy = false;
  }
};

/* ============================ reveal, velocity ============================ */
const Reveal = {
  init() {
    if (!('IntersectionObserver' in window)) { $$('[data-reveal]').forEach(el => { if (!el.closest('.step')) el.classList.add('is-in'); }); return; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      e.target.classList.add('is-in');
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    $$('[data-reveal]').forEach(el => { if (!el.closest('.step')) io.observe(el); });
  }
};

const Vel = {
  items: [],
  init() {
    this.items = $$('[data-vel]').map(el => ({ el, f: +el.dataset.vel || 1, y: 0 }));
    Ticker.add(dt => this.update(dt), 10);
  },
  update(dt) {
    if (Env.reduced) return;
    const v = clamp(Scroll.v / 2600, -1, 1);
    for (const it of this.items) {
      const ny = damp(it.y, v * 24 * it.f, 5, dt);
      if (Math.abs(ny - it.y) < 0.004 && Math.abs(ny) < 0.05) continue;
      it.y = ny; it.el.style.transform = `translate3d(0, ${ny.toFixed(2)}px, 0)`;
    }
  }
};

/* ============================ 02 · РЕМЕСЛО: the manifesto shears as it passes ============================ */
const Manif = {
  el: $('.manif'),
  init() { if (!this.el) return; Ticker.add(() => this.update(), 11); },
  update() {
    const r = this.el.getBoundingClientRect();
    if (r.bottom < -50 || r.top > Layout.vh + 50) return;
    const c = (r.top + r.height / 2) / Layout.vh;      // 0 top … 1 bottom
    const sh = Env.reduced ? 0 : clamp((0.5 - c) * 2, -1, 1) * Layout.vw * 0.035;
    this.el.style.setProperty('--sh', `${sh.toFixed(1)}px`);
  }
};

const PART_FS = `
uniform float uSplit; uniform float uLight; uniform float uN; uniform vec2 uMouse;
void main(){
  vec2 fc = gl_FragCoord.xy; vec2 uv = fc / uRes; float asp = uRes.x / uRes.y;
  vec3 col = vec3(0.0); float edge = 0.0; float hit = 0.0;
  for (int i = 0; i < 14; i++){
    float k = float(i);
    if (k >= uN) break;
    float x0 = k / uN; float x1 = (k + 1.0) / uN; float cx = (x0 + x1) * 0.5;
    float s = cx < 0.5 ? -1.0 : 1.0;
    float dist = abs(cx - 0.5);
    float disp = s * uSplit * (0.2 + dist * 0.6);
    float lx = uv.x - disp;
    if (hit < 0.5 && lx >= x0 && lx < x1){
      hit = 1.0;
      float r = h11(k + 3.0);
      float dy = uSplit * (r - 0.5) * 0.16;
      float sc = 1.0 + uSplit * dist * 0.22;
      vec2 suv = vec2(lx, (uv.y - 0.5) / sc + 0.5 + dy);
      vec2 p = vec2(suv.x * asp, suv.y) + uMouse * 0.012;
      col = hairTex(p * 0.85, uTime, uLight + uMouse.y * 0.05, vec3(1.0, 0.87, 0.68), 0.0);
      col *= 1.0 - uSplit * dist * 1.3;
      float e = min(lx - x0, x1 - lx) * uRes.x;
      edge = (1.0 - smoothstep(0.0, 1.6, e)) * uSplit;
    }
  }
  col = max(col, 0.0);
  col += edge * vec3(0.95, 0.86, 0.7) * 0.3;
  float vig = smoothstep(1.35, 0.15, length((uv - 0.5) * vec2(asp * 0.75, 1.0)));
  col *= mix(0.3, 1.0, vig);
  col *= smoothstep(0.0, 0.12, uv.y) * smoothstep(1.0, 0.88, uv.y);
  col += (h21(fc + fract(uTime) * 97.0) - 0.5) * 0.028;
  col = col / (1.0 + col * 0.35);
  col = vec3(0.039, 0.039, 0.035) + col;
  gl_FragColor = vec4(col, 1.0);
}`;

const Parting = {
  sec: $('.parting'), cv: $('.parting__gl'), gl: null, top: 0, len: 1, q: 1,
  init() {
    this.l1 = $$('.pt--1 .ln>span'); this.l2 = $$('.pt--2 .ln>span');
    let ok = false;
    try { ok = this.initGL(); } catch (err) { console.warn('[solus] parting gl', err); ok = false; }
    if (!ok) { this.gl = null; safe(() => this.initFallback(), 'parting fallback'); }
    this.measure(); Layout.on(() => this.measure());
    Ticker.add((dt, t) => this.update(dt, t), 14);
  },
  initGL() {
    let gl = null;
    try { gl = this.cv.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false }); } catch (e) { gl = null; }
    if (!gl) return false;
    if (!this._loss) {
      this._loss = true;
      this.cv.addEventListener('webglcontextlost', ev => { ev.preventDefault(); this.lost = true; }, false);
      this.cv.addEventListener('webglcontextrestored', () => { this.lost = false; safe(() => { this.initGL(); this.measure(); }, 'parting restore'); }, false);
    }
    this.gl = gl; this.prog = glProgram(gl, QUAD_VS, GLSL_COMMON + PART_FS);
    gl.useProgram(this.prog.p); fullTri(gl, this.prog);
    return true;
  },
  initFallback() {
    this.cv.style.display = 'none';
    const fb = document.createElement('div'); fb.className = 'parting__fb'; fb.setAttribute('aria-hidden', 'true');
    this.cv.parentNode.insertBefore(fb, this.cv);
    this.fb = fb; this.N = Env.mobile ? 8 : 12; this.slices = []; this.rs = [];
    const r = rng(5);
    for (let k = 0; k < this.N; k++) { const s = document.createElement('div'); s.className = 'pfs'; fb.appendChild(s); this.slices.push(s); this.rs.push(r()); }
    this.sweep = document.createElement('div'); this.sweep.className = 'sweep'; fb.appendChild(this.sweep);
  },
  measureFallback() {
    const W = this.fb.clientWidth, H = this.fb.clientHeight;
    if (!W || !H || (W === this.fbW && H === this.fbH)) return;
    this.fbW = W; this.fbH = H;
    const s = Math.min(Env.dpr, 1.5);
    const tex = Fallback.hair(Math.round(W * s), Math.round(H * s), 2, false).toDataURL('image/jpeg', 0.84);
    const sw = W / this.N;
    this.slices.forEach((el, k) => {
      el.style.left = `${(k * sw).toFixed(2)}px`; el.style.width = `${(sw + 0.6).toFixed(2)}px`;
      el.style.backgroundImage = `url(${tex})`; el.style.backgroundSize = `${W}px ${H}px`; el.style.backgroundPosition = `${(-k * sw).toFixed(2)}px 0`;
    });
  },
  measure() {
    this.top = absTop(this.sec); this.len = Math.max(1, this.sec.offsetHeight - Layout.vh);
    if (this.fb) { this.measureFallback(); return; }
    if (!this.gl) return;
    const w = this.cv.clientWidth, h = this.cv.clientHeight;
    let s = Math.min(Env.dpr, 1.5) * this.q;
    const cap = 2.8e6 * this.q * this.q;
    if (w * h * s * s > cap) s = Math.sqrt(cap / (w * h));
    this.cv.width = Math.max(1, Math.round(w * s)); this.cv.height = Math.max(1, Math.round(h * s));
    this.gl.viewport(0, 0, this.cv.width, this.cv.height);
  },
  // lowers the render resolution step by step until the device holds ~40 fps
  perf(dt) {
    if (this.tuned) return;
    this.pf = (this.pf || 0) + 1;
    if (this.pf < 20) return;
    this.pacc = (this.pacc || 0) + dt;
    if (this.pf < 80) return;
    const avg = this.pacc / 60; this.pf = 0; this.pacc = 0;
    if (avg > 0.024 && this.q > 0.42) { this.q *= 0.75; this.measure(); } else this.tuned = true;
  },
  updateFallback(split, light) {
    const N = this.N, W = this.fbW || 1, H = this.fbH || 1;
    this.fb.style.setProperty('--e', split.toFixed(3));
    this.slices.forEach((el, k) => {
      const cx = (k + 0.5) / N, s = cx < 0.5 ? -1 : 1, dist = Math.abs(cx - 0.5);
      const disp = s * split * (0.2 + dist * 0.6) * W, dy = split * (this.rs[k] - 0.5) * 0.16 * H, sc = 1 + split * dist * 0.22;
      el.style.transform = `translate3d(${disp.toFixed(1)}px, ${dy.toFixed(1)}px, 0) scale(${sc.toFixed(4)})`;
      el.style.opacity = Math.max(0, 1 - split * dist * 1.3).toFixed(3);
    });
    this.sweep.style.transform = `translate3d(0, ${((0.55 - light) * H * 0.8).toFixed(1)}px, 0)`;
  },
  update(dt, t) {
    if (Scroll.sy + Layout.vh < this.top - 50 || Scroll.sy > this.top + this.len + Layout.vh + 50) return;
    const raw = (Scroll.sy - this.top) / this.len;
    const p = clamp(raw);
    const split = E.inOutCubic(range(p, 0.1, 0.32)) * (1 - E.inOutCubic(range(p, 0.7, 0.88)));
    const light = lerp(0.28, 1.25, E.inOutSine(range(raw, -0.35, 1)));
    const line = (el, a, b, c, d) => {
      const inn = E.outCubic(range(p, a, b)), out = E.inCubic(range(p, c, d));
      el.style.transform = `translate3d(0, ${((1 - inn) * 175 - out * 175).toFixed(2)}%, 0)`;
    };
    this.l1.forEach((el, i) => line(el, 0.24 + i * 0.03, 0.36 + i * 0.03, 0.47 + i * 0.02, 0.55 + i * 0.02));
    this.l2.forEach((el, i) => line(el, 0.55 + i * 0.03, 0.66 + i * 0.03, 0.77 + i * 0.02, 0.85 + i * 0.02));
    if (this.fb) { this.updateFallback(split, light); return; }
    if (!this.gl || this.lost) return;
    if (!frameGate(this, dt)) return;
    this.perf(dt);
    const gl = this.gl, u = this.prog.u;
    gl.uniform2f(u.uRes, this.cv.width, this.cv.height);
    gl.uniform1f(u.uTime, Env.reduced ? 4 : t);
    gl.uniform1f(u.uSplit, split);
    gl.uniform1f(u.uLight, light);
    gl.uniform1f(u.uN, Env.mobile ? 8 : 12);
    gl.uniform2f(u.uMouse, Pointer.sx, Pointer.sy);
    if (u.uSeed) gl.uniform1f(u.uSeed, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
};

/* ============================ 03 · ОБРАЗЫ ============================
   Three rows. The line rests on the active one and opens a slit through the
   letters, showing the material of that look. Click, and the slit becomes the
   whole screen.                                                               */
const Looks = {
  list: $('.looks__list'), rows: [], medias: [], active: -1, slitF: 0.5, lineY: null, half: 0.11,
  init() {
    CONFIG.services.forEach((s, i) => {
      const li = document.createElement('li');
      li.className = 'look'; li.dataset.i = i;
      li.innerHTML = `<button class="look__btn" type="button" data-cursor="open" data-label="Открыть образ">
          <span class="look__n mono">${pad(i + 1)}</span><span class="look__name">${esc(s.name)}</span>
          <span class="look__price mono">${s.from ? 'от ' : ''}${s.price} €</span>
          <span class="look__sub serif">${esc(s.look)}</span></button>
        <div class="look__slit" aria-hidden="true"><div class="media" data-visual="${s.visual}" data-seed="${i + 1}" data-src="${esc(s.image || '')}"></div></div>`;
      this.list.appendChild(li);
      const m = $('.media', li); this.medias.push(m); Media.observe(m);
    });
    this.rows = $$('.look', this.list);
    this.half = Env.touch ? 0.15 : 0.11;
    this.rows.forEach((r, i) => {
      const btn = $('.look__btn', r);
      if (!Env.touch) {
        r.addEventListener('pointerenter', e => { this.setActive(i); this.slitAt(r, e.clientY); r.classList.add('is-live'); });
        r.addEventListener('pointermove', e => { if (this.active === i) this.slitAt(r, e.clientY); }, { passive: true });
        r.addEventListener('pointerleave', () => { r.classList.remove('is-live'); if (this.active === i) { this.slitF = this.restF(r); this.apply(r); } });
      }
      btn.addEventListener('focus', () => this.setActive(i));
      btn.addEventListener('click', () => Obj.open(i, r, this.slitRect(r)));
    });
    this.setActive(0);
    this.measure(); Layout.on(() => this.measure());
    Ticker.add(dt => this.update(dt), 16);
  },
  measure() { this.top = absTop(this.list); this.h = this.list.offsetHeight; const r = this.rows[this.active]; if (r && !r.classList.contains('is-live')) { this.slitF = this.restF(r); this.apply(r); } },
  restF(row) {
    // rest position: between the name and the subtitle
    const rr = row.getBoundingClientRect(), n = $('.look__name', row).getBoundingClientRect(), s = $('.look__sub', row).getBoundingClientRect();
    if (!rr.height) return 0.5;
    const y = (n.bottom + s.top) / 2 - rr.top;
    return clamp(y / rr.height, this.half + 0.02, 1 - this.half - 0.02);
  },
  slitAt(row, clientY) {
    const r = row.getBoundingClientRect();
    this.slitF = clamp((clientY - r.top) / r.height, this.half + 0.02, 1 - this.half - 0.02);
    this.apply(row);
  },
  apply(row) {
    const f = this.slitF, h = this.half;
    row.style.setProperty('--sa', `${((f - h) * 100).toFixed(2)}%`);
    row.style.setProperty('--sb', `${((1 - f - h) * 100).toFixed(2)}%`);
  },
  slitRect(row) {
    const r = row.getBoundingClientRect(), f = this.active === this.rows.indexOf(row) ? this.slitF : 0.5, h = this.half;
    return { top: r.top + r.height * (f - h), bottom: r.top + r.height * (f + h), left: r.left, right: r.right };
  },
  setActive(i) {
    if (i === this.active || i < 0) return;
    const prev = this.rows[this.active];
    if (prev) { prev.classList.remove('is-active', 'is-live'); prev.style.setProperty('--sa', '50%'); prev.style.setProperty('--sb', '50%'); }
    this.active = i;
    this.list.classList.add('has-active');
    const row = this.rows[i];
    row.classList.add('is-active');
    this.slitF = this.restF(row); this.apply(row);
  },
  lineGeom() {
    const row = this.rows[this.active] || this.rows[0];
    if (!row) return null;
    const r = row.getBoundingClientRect();
    const target = r.top + r.height * this.slitF;
    if (this.lineY == null || Math.abs(this.lineY - target) > Layout.vh) this.lineY = target;
    return { type: 'h', y: this.lineY, x0: 0, x1: Layout.vw };
  },
  update(dt) {
    if (Scroll.y + Layout.vh < this.top || Scroll.y > this.top + this.h) return;
    // the line glides to the active slit instead of jumping
    const row = this.rows[this.active];
    if (row && this.lineY != null) {
      const r = row.getBoundingClientRect();
      const target = r.top + r.height * this.slitF;
      this.lineY = damp(this.lineY, target, 10, dt);
    }
    if (!Env.touch) return;
    const mid = Layout.vh * 0.46; let best = -1, bd = 1e9;
    this.rows.forEach((r, i) => { const b = r.getBoundingClientRect(); const d = Math.abs(b.top + b.height / 2 - mid); if (d < bd) { bd = d; best = i; } });
    if (best >= 0 && bd < Layout.vh * 0.4) this.setActive(best);
  }
};

const Obj = {
  el: $('.obj'), idx: 0, from: null, isOpen: false, medias: [],
  init() {
    const box = $('.obj__media');
    CONFIG.services.forEach((s, i) => {
      const m = document.createElement('div');
      m.className = 'media'; m.dataset.visual = s.visual; m.dataset.seed = String(i + 11); m.dataset.src = s.image || '';
      box.appendChild(m); this.medias.push(m);
    });
    const warmUp = () => this.medias.forEach(m => Media.fill(m, { w: Layout.vw, h: Layout.vh }));
    if ('IntersectionObserver' in window) {
      const warm = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; warm.disconnect(); warmUp(); }), { rootMargin: '100% 0px' });
      warm.observe($('.looks'));
    } else setTimeout(warmUp, 4000);
    $('.obj__close').addEventListener('click', () => this.close());
    $('[data-obj-prev]').addEventListener('click', () => this.step(-1));
    $('[data-obj-next]').addEventListener('click', () => this.step(1));
    $('[data-obj-reserve]').addEventListener('click', () => {
      const i = this.idx;
      Transition.go(4, {
        y: absTop($('.flow') || $('.call')) - Layout.vh * 0.12,
        during: () => { this.closeInstant(); Booking.preselect(i); }
      });
    });
    document.addEventListener('keydown', e => {
      if (!this.isOpen) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowRight') this.step(1);
      if (e.key === 'ArrowLeft') this.step(-1);
      if (e.key === 'Tab') {
        const f = $$('button', this.el); const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    let sx = 0;
    this.el.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
    this.el.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 60) this.step(dx < 0 ? 1 : -1); }, { passive: true });
  },
  clip(r) {
    const w = document.documentElement.clientWidth, h = window.innerHeight;
    return `inset(${Math.max(0, r.top).toFixed(1)}px ${Math.max(0, w - r.right).toFixed(1)}px ${Math.max(0, h - r.bottom).toFixed(1)}px ${Math.max(0, r.left).toFixed(1)}px)`;
  },
  fill(i) {
    const s = CONFIG.services[i];
    this.idx = i;
    $('[data-obj-n]').textContent = pad(i + 1);
    $('[data-obj-total]').textContent = pad(CONFIG.services.length);
    const words = s.name.split(' ');
    const row = words.map((w, k) => `<span style="--i:${k}">${esc(w)}</span>`).join(' ');
    $('.obj__name .cut__h--t').innerHTML = row; $('.obj__name .cut__h--b').innerHTML = row;
    this.fitName();
    $('[data-obj-sr]').textContent = s.name;
    $('[data-obj="title"]').textContent = s.look;
    $('[data-obj="text"]').textContent = s.text;
    $('[data-obj="spec"]').innerHTML = [['Цена', `${s.from ? 'от ' : ''}${s.price} €`], ['Включено', s.includes.join(' · ')]]
      .map(([k, v]) => `<dt>${k}</dt><dd>${esc(v)}</dd>`).join('');
    this.medias.forEach((m, k) => m.classList.toggle('is-on', k === i));
    this.medias.forEach(m => Media.fill(m, { w: Layout.vw, h: Layout.vh }));
  },
  fitName() {
    // the name must fit the width in one line: scale the font until it does
    const name = $('.obj__name'), row = $('.obj__name .cut__h--t');
    name.style.removeProperty('--ofs');
    const avail = name.clientWidth;
    if (!avail) return;
    const fs = parseFloat(getComputedStyle(name).fontSize), w = row.scrollWidth;
    if (w > avail) name.style.setProperty('--ofs', `${Math.floor(fs * avail / w * 0.985)}px`);
  },
  open(i, fromEl, rect) {
    if (this.isOpen || Transition.busy) return;
    this.fill(i); this.from = fromEl; this.isOpen = true;
    const el = this.el;
    el.hidden = false;
    el.style.transition = 'none';
    el.style.clipPath = this.clip(rect || fromEl.getBoundingClientRect());
    el.classList.remove('is-open', 'is-leaving');
    void el.offsetWidth;
    el.style.transition = '';
    this.fitName();
    requestAnimationFrame(() => { el.style.clipPath = 'inset(0px 0px 0px 0px)'; el.classList.add('is-open'); });
    Scroll.lock();
    Trail.kick();
    setTimeout(() => $('.obj__close').focus({ preventScroll: true }), 500);
  },
  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    const el = this.el;
    el.classList.add('is-leaving');
    el.style.clipPath = this.clip(Looks.slitRect(this.from));
    setTimeout(() => {
      el.classList.remove('is-open', 'is-leaving'); el.hidden = true;
      Scroll.unlock();
      const b = $('.look__btn', this.from); if (b) b.focus({ preventScroll: true });
    }, 1000);
  },
  closeInstant() {
    this.isOpen = false;
    this.el.classList.remove('is-open', 'is-leaving'); this.el.hidden = true;
    Scroll.unlock();
  },
  step(d) {
    if (!this.isOpen || this._stepping) return;
    this._stepping = true;
    const n = CONFIG.services.length, i = (this.idx + d + n) % n;
    this.el.classList.add('is-leaving');
    setTimeout(() => {
      this.el.classList.remove('is-open');
      this.fill(i);
      Looks.setActive(i); this.from = Looks.rows[i];
      void this.el.offsetWidth;
      this.el.classList.remove('is-leaving'); this.el.classList.add('is-open');
      this._stepping = false;
    }, 460);
  }
};

/* ============================ 04 · ЗАПИСЬ ============================
   Four steps. Time is chosen on the line itself: the day becomes a line from
   opening to closing, taken hours are cuts in it, and you put a point on it. */
async function submitBooking(data) {
  if (CONFIG.booking.endpoint) {
    const r = await fetch(CONFIG.booking.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    if (!r.ok) throw new Error(`Booking request failed (${r.status})`);
    return r.json().catch(() => ({}));
  }
  await wait(1000);
  return { ok: true };
}

const Booking = {
  flow: $('.flow'), stage: $('.flow__stage'), steps: $$('.step'), idx: $$('.flow__steps li'), step: 1, busy: false,
  st: { svc: null, date: null, time: null, name: '', phone: '', email: '', note: '' },
  init() {
    if (!$('.opts')) return;  /* запись только по телефону: шагов записи на странице нет */
    const box = $('.opts');
    CONFIG.services.forEach((s, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'opt'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false');
      b.dataset.cursor = 'link'; b.style.setProperty('--i', i);
      b.innerHTML = `<span class="opt__n mono">${pad(i + 1)}</span><span class="opt__name">${esc(s.name)}</span><span class="opt__p mono">${s.from ? 'от ' : ''}${s.price} €</span><span class="opt__sub serif">${esc(s.look)}</span>`;
      b.addEventListener('click', () => this.pickService(i, b));
      box.appendChild(b);
    });
    this.steps.forEach(s => [...s.children].forEach((c, i) => c.style.setProperty('--i', i)));
    $('.fields').addEventListener('submit', e => this.submitDetails(e));
    $$('.fld input').forEach(inp => inp.addEventListener('input', () => { const f = inp.closest('.fld'); f.classList.remove('is-bad'); $('.fld__msg', f).textContent = ''; }));
    $('.flow__back').addEventListener('click', () => { if (this.step > 1 && this.step < 5) this.go(this.step - 1); });
    $('[data-reset]').addEventListener('click', () => this.reset());
    this.tl = $('.tl'); this.tlNodes = $('.tl__nodes'); this.tlScale = $('.tl__scale'); this.tlMarker = $('.tl__marker'); this.tlTime = $('.tl__time'); this.tlHint = $('[data-tl-hint]');
    this.initTimeline();
    this.initHold();
    this.updateIndex();
  },
  /* ---- the line as an anchor: the timeline when visible, otherwise the steps line ---- */
  lineGeom() {
    const vis = this.step === 2 && this.tl.offsetParent;
    if (vis) { const r = $('.tl__line').getBoundingClientRect(); return { type: 'h', y: r.top, x0: r.left, x1: r.right }; }
    const s = ($('.flow__steps') || $('.call__line')).getBoundingClientRect();
    return { type: 'h', y: s.bottom, x0: s.left, x1: s.right };
  },
  buf(key, text) { const el = $(`[data-buf="${key}"]`); if (el) swapText(el, text); },
  fly(fromEl, key, text) {
    const target = $(`[data-buf="${key}"]`);
    const tr = target ? target.getBoundingClientRect() : null;
    if (Env.reduced || !fromEl || !tr || tr.width === 0) { this.buf(key, text); return; }
    const fr = fromEl.getBoundingClientRect();
    const g = document.createElement('span'); g.className = 'ghost mono'; g.textContent = text; g.setAttribute('aria-hidden', 'true');
    document.body.appendChild(g);
    g.style.transform = `translate3d(${fr.left.toFixed(1)}px, ${(fr.top + fr.height / 2 - 8).toFixed(1)}px, 0)`;
    void g.offsetWidth;
    g.style.transform = `translate3d(${tr.left.toFixed(1)}px, ${tr.top.toFixed(1)}px, 0)`; g.style.opacity = '0.15';
    setTimeout(() => { g.remove(); this.buf(key, text); }, 860);
  },
  pickService(i, el) {
    if (this.busy) return;
    $$('.opt').forEach(o => { o.classList.toggle('is-picked', o === el); o.setAttribute('aria-checked', String(o === el)); });
    this.st.svc = CONFIG.services[i]; this.st.date = null; this.st.time = null;
    this.fly($('.opt__name', el), 'service', this.st.svc.name);
    this.buf('date', '—'); this.buf('time', '—');
    setTimeout(() => this.go(2), 560);
  },
  preselect(i) {
    if (!$('.opts')) return;
    this.steps.forEach((s, k) => { s.hidden = k !== 0; s.classList.toggle('is-active', k === 0); s.classList.remove('is-leaving'); });
    this.stage.style.height = ''; this.step = 1; this.busy = false; this.updateIndex();
    setTimeout(() => this.pickService(i, $$('.opt')[i]), 900);
  },
  /* ---- days ---- */
  buildDates() {
    const box = $('.days'); box.innerHTML = '';
    Schedule.days(CONFIG.booking.daysAhead).forEach((d, k) => {
      const free = Schedule.slots(d, this.st.svc).some(s => !s.taken);
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'day'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false');
      b.style.setProperty('--i', k); b.dataset.cursor = 'link';
      b.setAttribute('aria-label', `${Schedule.long(d)}${free ? '' : ', всё занято'}`);
      b.innerHTML = `<span class="mono">${DOW[d.getDay()]}</span><b>${pad(d.getDate())}</b><span class="mono">${free ? MON[d.getMonth()] : 'Занято'}</span>`;
      if (!free) b.disabled = true;
      b.addEventListener('click', () => this.pickDate(d, b));
      box.appendChild(b);
    });
    this.clearTimeline();
  },
  pickDate(d, el) {
    $$('.day').forEach(o => o.setAttribute('aria-checked', String(o === el)));
    this.st.date = d; this.st.time = null;
    this.buf('date', `${DOW[d.getDay()]} ${pad(d.getDate())} ${MON[d.getMonth()]}`); this.buf('time', '—');
    this.buildTimeline(d);
  },
  /* ---- the timeline ---- */
  clearTimeline() {
    this.tlNodes.innerHTML = ''; this.tlScale.innerHTML = '';
    $$('.tl__gap', this.tl).forEach(g => g.remove());
    this.tl.classList.remove('has-time'); this.tlHint.textContent = 'Сначала выберите день';
    this.nodes = [];
  },
  buildTimeline(d) {
    this.clearTimeline();
    const day = d.getDay(), open = (CONFIG.openAt[day] || 10) * 60, close = (CONFIG.closeAt[day] || 18) * 60;
    this.tlOpen = open; this.tlClose = close;
    const frac = m => (m - open) / (close - open);
    for (let h = Math.ceil(open / 60); h <= Math.floor(close / 60); h++) {
      const f = frac(h * 60);
      const lab = document.createElement('span'); lab.textContent = pad(h); lab.style.left = `${(f * 100).toFixed(2)}%`;
      const tick = document.createElement('i'); tick.style.left = `${(f * 100).toFixed(2)}%`;
      this.tlScale.appendChild(lab); this.tlScale.appendChild(tick);
    }
    const slots = Schedule.slots(d, this.st.svc);
    this.nodes = slots.map((s, k) => {
      const f = frac(toMin(s.time));
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'tl__node'; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', 'false');
      b.style.left = `${(f * 100).toFixed(2)}%`; b.style.setProperty('--i', k); b.dataset.cursor = 'drag';
      b.innerHTML = `<span class="tl__tip mono">${s.time}</span><span class="sr">${s.time}${s.taken ? ', занято' : ''}</span>`;
      if (s.taken) { b.disabled = true; const g = document.createElement('i'); g.className = 'tl__gap'; g.style.left = `${(f * 100).toFixed(2)}%`; this.tl.insertBefore(g, this.tlNodes); }
      else b.addEventListener('click', () => { if (this.justDragged) return; this.pickTime(s.time, f, b); });
      this.tlNodes.appendChild(b);
      return { time: s.time, f, taken: s.taken, el: b };
    });
    this.tlHint.textContent = Env.touch ? 'Коснитесь точки или протяните маркер по линии' : 'Нажмите на точку или протяните маркер по линии';
  },
  nearest(f) {
    let best = null, bd = 2;
    for (const n of this.nodes) { if (n.taken) continue; const d = Math.abs(n.f - f); if (d < bd) { bd = d; best = n; } }
    return best;
  },
  placeMarker(f, time) {
    this.tlMarker.style.left = `${(f * 100).toFixed(2)}%`;
    this.tlTime.textContent = time;
    this.tl.classList.add('has-time');
  },
  pickTime(t, f, el) {
    if (this.busy) return;
    this.nodes.forEach(n => n.el.setAttribute('aria-checked', String(n.el === el)));
    this.placeMarker(f, t);
    this.st.time = t;
    this.fly(this.tlTime, 'time', t);
    setTimeout(() => this.go(3), 700);
  },
  initTimeline() {
    const tl = this.tl;
    let down = false, drag = false, sx = 0, cur = null;
    const fx = x => { const r = $('.tl__line').getBoundingClientRect(); return clamp((x - r.left) / r.width); };
    tl.addEventListener('pointerdown', e => {
      if (!this.nodes || !this.nodes.length || this.busy) return;
      down = true; drag = false; sx = e.clientX; cur = null;
    });
    window.addEventListener('pointermove', e => {
      if (!down) return;
      if (!drag && Math.abs(e.clientX - sx) > 6) { drag = true; tl.classList.add('is-drag'); try { tl.setPointerCapture(e.pointerId); } catch (err) { /* noop */ } }
      if (!drag) return;
      const n = this.nearest(fx(e.clientX));
      if (n && n !== cur) { cur = n; this.placeMarker(n.f, n.time); }
    });
    const up = e => {
      if (!down) return;
      down = false;
      if (drag) {
        drag = false; tl.classList.remove('is-drag');
        this.justDragged = true; setTimeout(() => { this.justDragged = false; }, 300);
        const n = cur || this.nearest(fx(e.clientX));
        if (n) this.pickTime(n.time, n.f, n.el);
      }
    };
    window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  },
  /* ---- details ---- */
  submitDetails(e) {
    e.preventDefault();
    const v = id => $(id).value.trim();
    const name = v('#bk-name'), phone = v('#bk-phone'), email = v('#bk-email'), note = v('#bk-note');
    const bad = [];
    if (name.length < 2) bad.push(['name', 'Укажите имя, чтобы мастер знал, кого ждать.']);
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7 || /[^\d\s+()\-.]/.test(phone)) bad.push(['phone', 'Укажите телефон с кодом страны, например +372 5123 4567.']);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) bad.push(['email', 'Проверьте адрес почты или оставьте поле пустым.']);
    $$('.fld').forEach(f => { f.classList.remove('is-bad'); $('.fld__msg', f).textContent = ''; });
    if (bad.length) {
      bad.forEach(([k, msg]) => { const f = $(`.fld[data-f="${k}"]`); f.classList.add('is-bad'); $('.fld__msg', f).textContent = msg; });
      $(`.fld[data-f="${bad[0][0]}"] input`).focus();
      return;
    }
    Object.assign(this.st, { name, phone, email, note });
    this.buf('guest', name.split(/\s+/)[0]);
    this.go(4);
  },
  buildSummary() {
    const s = this.st, v = s.svc;
    const rows = [
      ['Образ', `${v.name} — ${v.look}`], ['День', Schedule.long(s.date)], ['Время', s.time],
      ['Гость', `${s.name} · ${s.phone.replace(/ /g, ' ')}`]
    ];
    if (s.note) rows.push(['Комментарий', s.note]);
    $('.summary').innerHTML = rows.map(([k, x]) => `<dt class="mono">${k}</dt><dd>${esc(x)}</dd>`).join('') +
      `<dt class="mono">Итого</dt><dd class="total">${v.from ? 'от ' : ''}${v.price} € <span class="mono dim">· оплата на месте</span></dd>`;
    this.resetHold && this.resetHold();
  },
  /* ---- hold: the line fills to the end ---- */
  initHold() {
    const b = $('.hold'), fill = $('.hold__fill'), pct = $('.hold__p'), lab = $('.hold__t'), hint = $('.hold__hint');
    let p = 0, holding = false, raf = 0, last = 0, done = false;
    const loop = now => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      p = holding ? Math.min(1, p + dt / 1.1) : Math.max(0, p - dt * 2.4);
      fill.style.transform = `scaleX(${E.inOutSine(p).toFixed(4)})`;
      pct.textContent = pad(Math.round(p * 100), 3);
      if (p >= 1 && holding && !done) { done = true; holding = false; raf = 0; this.confirm(); return; }
      if (holding || p > 0) raf = requestAnimationFrame(loop); else raf = 0;
    };
    const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); } };
    b.addEventListener('pointerdown', e => {
      if (done || this.busy) return;
      e.preventDefault(); holding = true;
      try { b.setPointerCapture(e.pointerId); } catch (err) { /* noop */ }
      kick();
    });
    const end = () => { holding = false; if (p > 0) kick(); };
    ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ev => b.addEventListener(ev, end));
    b.addEventListener('click', e => { if (e.detail === 0 && !done && !this.busy) { done = true; p = 1; fill.style.transform = 'scaleX(1)'; pct.textContent = '100'; this.confirm(); } });
    b.addEventListener('contextmenu', e => e.preventDefault());
    this.resetHold = () => {
      done = false; holding = false; p = 0; fill.style.transform = 'scaleX(0)'; pct.textContent = '000';
      lab.textContent = 'Удерживайте — линия дойдёт до конца и подтвердит запись'; hint.textContent = 'Нажмите и держите секунду · с клавиатуры: Enter';
    };
    this.failHold = msg => { done = false; p = 0; kick(); lab.textContent = 'Не отправлено · удерживайте снова'; hint.textContent = msg; };
  },
  async confirm() {
    const lab = $('.hold__t');
    lab.textContent = 'Отправка';
    const s = this.st;
    const payload = { service: s.svc.id, date: Schedule.key(s.date), time: s.time, duration: s.svc.duration, name: s.name, phone: s.phone, email: s.email, note: s.note };
    try { await submitBooking(payload); }
    catch (err) { this.failHold('Заявка не дошла. Проверьте соединение и удерживайте кнопку снова.'); return; }
    const code = 'ABCDEFGHJKLMNPRSTUVWXYZ';
    const ref = `${CONFIG.booking.refPrefix}-${pad(s.date.getDate())}${pad(s.date.getMonth() + 1)}-${s.time.replace(':', '')}-${code[(Math.random() * code.length) | 0]}${code[(Math.random() * code.length) | 0]}`;
    $('.done__ref').textContent = `Номер · ${ref}`;
    this.go(5);
  },
  updateIndex() {
    this.idx.forEach(li => {
      const k = +li.dataset.si;
      li.classList.toggle('is-done', k < this.step);
      li.classList.toggle('is-current', k === this.step);
    });
    $('.flow__back').hidden = this.step === 1 || this.step === 5;
    $('[data-stepn]').textContent = pad(Math.min(this.step, 4));
  },
  async go(n) {
    if (this.busy || n === this.step) return;
    this.busy = true;
    const cur = this.steps[this.step - 1], next = this.steps[n - 1];
    const cs = getComputedStyle(this.stage);
    const padY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
    this.stage.style.height = `${this.stage.offsetHeight}px`;
    cur.classList.add('is-leaving');
    await wait(Env.reduced ? 0 : 440);
    cur.classList.remove('is-active', 'is-leaving'); cur.hidden = true;
    if (n === 2) this.buildDates();
    if (n === 4) this.buildSummary();
    if (n === 5) { const t = $('.done__t'); t.classList.remove('is-in'); setTimeout(() => t.classList.add('is-in'), 350); }
    next.hidden = false;
    this.stage.style.height = `${next.offsetHeight + padY}px`;
    void next.offsetWidth;
    next.classList.add('is-active');
    this.step = n; this.updateIndex();
    await wait(Env.reduced ? 0 : 780);
    this.stage.style.height = '';
    this.busy = false;
    if (!Env.touch && n === 3) $('#bk-name').focus({ preventScroll: true });
  },
  reset() {
    Object.assign(this.st, { svc: null, date: null, time: null, name: '', phone: '', email: '', note: '' });
    $$('.fields input').forEach(i => { i.value = ''; });
    $$('.opt').forEach(o => { o.classList.remove('is-picked'); o.setAttribute('aria-checked', 'false'); });
    ['service', 'date', 'time', 'guest'].forEach(k => this.buf(k, '—'));
    this.go(1);
  }
};

/* ============================ ПОДВАЛ ============================ */
const Foot = {
  init() {
    $('.totop').addEventListener('click', () => Scroll.tweenTo(0, 2000));
    $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
      const v = CONFIG[b.dataset.copy], lab = $('.mono', b);
      try { await navigator.clipboard.writeText(v); lab.textContent = 'Скопировано'; }
      catch (err) {
        const r = document.createRange(); r.selectNodeContents(b.previousElementSibling || b);
        const sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
        lab.textContent = 'Выделено';
      }
      clearTimeout(b._t); b._t = setTimeout(() => { lab.textContent = 'Копировать'; }, 1800);
    }));
  }
};

function swapText(el, text) {
  if (!el || el.textContent === text) return;
  if (Env.reduced) { el.textContent = text; return; }
  el.style.transition = 'opacity .18s';
  el.style.opacity = '0';
  clearTimeout(el._sw);
  el._sw = setTimeout(() => { el.textContent = text; el.style.opacity = ''; }, 190);
}

function fillConfig() {
  $$('[data-cfg="phone"]').forEach(e => { e.textContent = CONFIG.phone; if (e.tagName === 'A') e.href = CONFIG.phoneHref; });
  $$('[data-cfg="phone-call"]').forEach(e => { e.href = CONFIG.phoneHref; });
  $$('[data-cfg="email"]').forEach(e => { e.textContent = CONFIG.email; if (e.tagName === 'A') e.href = `mailto:${CONFIG.email}`; });
  $$('[data-cfg="address"]').forEach(e => { e.innerHTML = CONFIG.address.map(esc).join('<br>'); });
  $$('[data-cfg="hours"]').forEach(e => { e.innerHTML = CONFIG.hours.map(([d, h]) => `<li><span>${esc(d)}</span><span>${esc(h)}</span></li>`).join(''); });
  $$('[data-cfg="company"]').forEach(e => { e.textContent = CONFIG.company; });
  $$('[data-cfg="regcode"]').forEach(e => { e.textContent = `Рег. код ${CONFIG.regcode}`; });
  $$('[data-year]').forEach(e => { e.textContent = new Date().getFullYear(); });
  const ln = $('[data-loader-name]');
  if (ln) ln.innerHTML = [...CONFIG.brand].map(c => `<span>${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('');
  // the name on the threshold, letter by letter, in two halves
  const words = CONFIG.brand.toUpperCase().split(/\s+/);
  let idx = 0;
  const row = words.map((w, wi) => [...w].map(ch => `<span class="w${wi + 1}" style="--i:${idx++}">${esc(ch)}</span>`).join('')).join('<span class="sp"></span>');
  $$('.hero__name .cut__h').forEach(h => { h.innerHTML = row; });
}

/* ============================ INTRO ============================ */
const Intro = {
  async run() {
    const L = $('#loader');
    const allStages = () => ['stage-line', 'stage-name', 'stage-ui', 'stage-object'].forEach(c => html.classList.add(c));
    if (!L) { allStages(); Hero.reveal(); return; }
    const fill = $('.loader__fill'), letters = $$('.loader__brand span');
    const line = $('.loader__line'), track = $('.loader__track');
    html.classList.add('is-loading'); Scroll.locked = true;
    let ready = false;
    Promise.all([document.fonts ? document.fonts.ready.catch(() => {}) : null, wait(Env.reduced ? 300 : 1800)]).then(() => { ready = true; });
    setTimeout(() => { ready = true; }, 6000);
    let shown = 0;
    const t0 = performance.now();
    await new Promise(res => {
      const step = now => {
        const el = (now - t0) / 1000;
        let goal = E.inOutSine(clamp(el / (Env.reduced ? 0.4 : 2.3))) * 100;
        if (!ready) goal = Math.min(goal, 88);
        shown += (goal - shown) * 0.14; if (goal - shown < 0.25) shown = goal;
        fill.style.transform = `scaleX(${(shown / 100).toFixed(4)})`;
        letters.forEach((l, i) => { if (shown >= 4 + (i / letters.length) * 78) l.classList.add('is-on'); });
        if (shown >= 100 && ready) { res(); return; }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    await wait(380);
    L.classList.add('is-done');
    await wait(Env.reduced ? 0 : 420);
    Hero.measure();
    const hzY = Hero.cut.getBoundingClientRect().top, ly = line.getBoundingClientRect().top;
    const sx = Layout.vw / Math.max(1, track.getBoundingClientRect().width);
    await tween({ dur: Env.reduced ? 0 : 1300, ease: E.inOutQuart, update: v => {
      line.style.transform = `translate3d(0, ${((hzY - ly) * v).toFixed(2)}px, 0)`;
      track.style.transform = `scaleX(${(1 + (sx - 1) * v).toFixed(4)})`;
      fill.style.opacity = (1 - v * 0.5).toFixed(3);
    } });
    html.classList.add('stage-line');
    L.classList.add('is-gone');
    await wait(Env.reduced ? 0 : 500);
    html.classList.add('stage-name');
    await wait(Env.reduced ? 0 : 900);
    html.classList.add('stage-ui');
    Hero.bootTexts();
    await wait(Env.reduced ? 0 : 250);
    html.classList.add('stage-object');
    Hero.reveal();
    html.classList.remove('is-loading');
    Scroll.locked = false; Scroll.jump(window.scrollY);
    setTimeout(() => L.remove(), 1000);
    const map = { room: 1, craft: 2, looks: 3, book: 4 };
    const h = location.hash.replace('#', '');
    if (map[h]) setTimeout(() => Transition.go(map[h]), 900);
  }
};

/* ============================ BOOT ============================ */
function boot() {
  try { history.scrollRestoration = 'manual'; } catch (e) { /* noop */ }
  window.scrollTo(0, 0);
  if (Env.reduced) html.classList.add('is-reduced');
  safe(fillConfig, 'config');
  safe(makeGrain, 'grain');
  Ticker.start();
  safe(() => Scroll.init(), 'scroll');
  safe(() => Pointer.init(), 'pointer');
  safe(() => Cursor.init(), 'cursor');
  safe(() => Ambient.init(), 'ambient');
  safe(() => Trail.init(), 'trail');
  safe(() => Clock.init(), 'clock');
  safe(() => Lab.init(), 'lab');
  safe(() => Media.init(), 'media');
  safe(() => $$('.roll').forEach(rollify), 'roll');
  safe(() => Hero.init(), 'hero');
  safe(() => Room.init(), 'room');
  safe(() => Manif.init(), 'manif');
  safe(() => Parting.init(), 'parting');
  safe(() => Looks.init(), 'looks');
  safe(() => Obj.init(), 'obj');
  safe(() => Booking.init(), 'booking');
  safe(() => Foot.init(), 'foot');
  safe(() => Nav.init(), 'nav');
  safe(() => Reveal.init(), 'reveal');
  safe(() => Vel.init(), 'vel');
  safe(() => Line.init(), 'line');
  Layout.update();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => Layout.update()).catch(() => {});
  Intro.run().catch(err => {
    console.warn('[nv] intro', err);
    ['stage-line', 'stage-name', 'stage-ui', 'stage-object'].forEach(c => html.classList.add(c));
    html.classList.remove('is-loading'); Scroll.locked = false; const L = $('#loader'); if (L) L.remove(); Hero.reveal();
  });
}

if (/[?&]debug/.test(location.search)) window.__nv = { Lab, MATERIALS, Scroll, Transition, Line, Room, Hero, Looks, Booking };
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
