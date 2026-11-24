/* sys.baby OS — core/shepot/post.js
 * ── ПОЧТА ШЁПОТА: КОНВЕРТ ИДЁТ КАПЛЯМИ ЧЕРЕЗ ПЯТЕРЫХ ПОЧТАЛЬОНОВ (D-1404) ───────────────
 * ПОВОД — задание основателя 17.11.2026 (§1, §6 слои 2–5): своего сервера нет; почтальоны —
 * сторонние, из разных стран и у разных владельцев; письмо — поток капель, «3 из 5» по Шамиру;
 * капли живут минуты; ровное дыхание; тайное расписание; Свидетель видит каждое соединение.
 * Пятёрку основатель утвердил 17.11 («Да, утверждаю.», plan/SHEPOT-POCHTALIONY-17-11.md).
 *
 * КАК ИДЁТ КОНВЕРТ. Раз в такт (BREATH_MS) каждый разговор отдаёт ровно один конверт ядра:
 * письмо, подтверждение или пустой — снаружи они одинаковы. Конверт делится на пять капель
 * (любые три собирают, две не дают ничего), к каждой добавлена печать общего ключа двоих, и
 * каждая уходит своему почтальону под разовой меткой и разовым ключом отправителя, в случайный
 * миг внутри такта. Метку на каждый такт и каждого почтальона оба выводят из общей тайны —
 * это и есть расписание. Капля живёт LIFE_S секунд.
 *
 * ЧТО СВОЁ, А ЧТО НЕТ. Деление «3 из 5», подписи капель и печати — из вшитой библиотеки
 * (tools/shepot-vendor.json). Своё — порядок: кто, что и когда отправляет и чего ждёт.
 *
 * ПИСЬМО ДОХОДИТ ИЛИ ЖДЁТ. Отправленное лежит в очереди, пока собеседник не подтвердит, и
 * досылается тем же шагом. Капли недолговечны, поэтому письмо доходит, когда оба на связи.
 *
 * ЧЕГО ПОЧТА НЕ СКРЫВАЕТ, и это сказано человеку: почтальон видит адрес подключения и то, что
 * устройство на связи; один почтальон видит, о каких метках его спрашивают с одного соединения;
 * наблюдатель за всеми пятью сразу может связать капли по времени. Почтальоны — одна сеть
 * (Nostr): слой «разные сети» ещё не сделан.
 */
(function (G) {
  "use strict";
  var L = G.sbShepotLib, S = G.sbShepot;
  if (!L || !S || !L.split || !L.schnorr) return;
  /* Утверждённая пятёрка (D-1401). Порядок — номер капли: менять нельзя, у двоих он один. */
  var POSTMEN = ["relay.dwadziesciajeden.pl", "nos.lol", "relay.primal.net", "relay.snort.social", "relay.nostr.wirednet.jp"];
  var DROPS = 5, NEED = 3, KIND = 1059;
  /* ПОСТОЯННЫЕ. Такт 30 с — две капли в минуту каждому почтальону с разговора: в пределах
     замеренных лимитов. Жизнь капли 3 минуты — «минуты» из задания: недоставленное письмо
     досылается каждый такт, так что старые капли хранить незачем. Приглашение 10 минут —
     предел времени на подбор слов сверки тому, кто подменил приглашение. */
  var CARD = 2, NAME = 40;
  var BREATH_MS = 15000, LIFE_S = 180, INVITE_MS = 600000;
  var BACK = Math.ceil(LIFE_S * 1000 / BREATH_MS) + 1, AHEAD = 2, BLOCK = 8;
  /* МИГ КАПЛИ В ТАКТЕ (решение основателя 17.11.2026, вечер, п.1: «капли в первые 3 с такта… В тишине и в
     разговоре капли обязаны ложиться в тот же миг такта, одинаково»). Каждая капля уходит в случайный миг между
     первой и третьей секундой от НАЧАЛА такта. Раньше первой нельзя: за секунду сдвинутые ключи ложатся на диск.
     Миг выбирается до и независимо от того, что в конверте, и отсчитывается от начала такта, а не от конца
     работы над конвертом, — поэтому письмо, подтверждение и пустой конверт неотличимы и по времени. */
  var HOLD = 1000, MOMENT = 2000;
  var MAC = 16, HEAD = 9, PIECE = S.MAX_BODY - HEAD, WIN_OUT = 8, SEEN = 128, QUEUE = 200;
  var te = new TextEncoder(), td = new TextDecoder();

  function rnd(n) { var a = new Uint8Array(n); G.crypto.getRandomValues(a); return a; }
  function cat() { var n = 0, i; for (i = 0; i < arguments.length; i++) n += arguments[i].length; var o = new Uint8Array(n), p = 0; for (i = 0; i < arguments.length; i++) { o.set(arguments[i], p); p += arguments[i].length; } return o; }
  function u32(n) { return new Uint8Array([n >>> 24, n >>> 16 & 255, n >>> 8 & 255, n & 255]); }
  function r32(b, p) { return ((b[p] << 24) | (b[p + 1] << 16) | (b[p + 2] << 8) | b[p + 3]) >>> 0; }
  function hex(b) { var s = ""; for (var i = 0; i < b.length; i++) s += (b[i] < 16 ? "0" : "") + b[i].toString(16); return s; }
  function unhex(s) { var b = new Uint8Array(s.length / 2); for (var i = 0; i < b.length; i++) b[i] = parseInt(s.substr(i * 2, 2), 16); return b; }
  var B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  function b64(b) { var s = "", i, n; for (i = 0; i < b.length; i += 3) { n = (b[i] << 16) | ((b[i + 1] || 0) << 8) | (b[i + 2] || 0); s += B64[n >> 18] + B64[n >> 12 & 63] + (i + 1 < b.length ? B64[n >> 6 & 63] : "=") + (i + 2 < b.length ? B64[n & 63] : "="); } return s; }
  function unb64(s) {
    if (typeof s !== "string" || s.length % 4) return null;
    var pad = s.slice(-2) === "==" ? 2 : s.slice(-1) === "=" ? 1 : 0, out = new Uint8Array(s.length / 4 * 3 - pad), p = 0, i, c, n, v;
    for (i = 0; i < s.length; i += 4) {
      n = 0; for (c = 0; c < 4; c++) { v = s[i + c] === "=" ? 0 : B64.indexOf(s[i + c]); if (v < 0) return null; n = n * 64 + v; }
      if (p < out.length) out[p++] = n >> 16; if (p < out.length) out[p++] = n >> 8 & 255; if (p < out.length) out[p++] = n & 255;
    }
    return out;
  }
  function same(a, b) { if (!a || !b || a.length !== b.length) return false; var d = 0; for (var i = 0; i < a.length; i++) d |= a[i] ^ b[i]; return d === 0; }
  function mark(key, what, slot, i) { return L.hmac(L.sha512, key, cat(te.encode("sb-shepot/1/" + what), u32(slot), new Uint8Array([i]))); }
  /* Метка капли: открытый ключ, выведенный из расписания. Снаружи — обычный адресат конверта. */
  function tagOf(key, slot, i) {
    var h = mark(key, "tag", slot, i);
    try { return hex(L.schnorr.getPublicKey(h.subarray(0, 32))); } catch (e) { return hex(L.schnorr.getPublicKey(h.subarray(32, 64))); }
  }
  function sealOf(key, slot, i, share) { return L.hmac(L.sha512, mark(key, "mac", slot, i), share).subarray(0, MAC); }

  /* Конверт → пять капель. Каждая: доля Шамира и печать общего ключа. */
  function drops(env, key, slot) {
    return L.split(env, DROPS, NEED).then(function (shares) {
      return shares.map(function (sh, i) { return { i: i, content: b64(cat(sh, sealOf(key, slot, i, sh))) }; });
    });
  }
  /* Доля из капли — только если печать общего ключа сошлась. */
  function check(content, key, slot, i) {
    var raw = unb64(content);
    if (!raw || raw.length !== S.ENVELOPE + 1 + MAC) return null;
    var sh = raw.subarray(0, S.ENVELOPE + 1);
    return same(sealOf(key, slot, i, sh), raw.subarray(S.ENVELOPE + 1)) ? sh : null;
  }
  function join3(shares) {
    return L.combine(shares.slice(0, NEED)).then(function (env) { return env && env.length === S.ENVELOPE ? env : null; }, function () { return null; });
  }
  /* Капли → конверт. Капля без верной печати отвергается до сборки и названа в bad. */
  function gather(list, key, slot) {
    var good = [], bad = [], seen = {};
    list.forEach(function (d) {
      if (seen[d.i]) return; seen[d.i] = 1;
      var sh = check(d.content, key, slot, d.i);
      if (sh) good.push(sh); else bad.push(d.i);
    });
    if (good.length < NEED) return Promise.resolve(null);
    return join3(good).then(function (env) { return env ? { env: env, bad: bad } : null; });
  }

  function make(opts) {
    opts = opts || {};
    var now = opts.now || function () { return Date.now(); };
    var later = opts.later || function (fn, ms) { return setTimeout(fn, ms); };
    var never = opts.never || function (id) { clearTimeout(id); };
    var socket = opts.socket || function (url) { return new WebSocket(url); };
    var witness = opts.witness || function (host) { if (G.sbWitness && G.sbWitness.socket) G.sbWitness.socket(host); };
    var tell = { text: opts.text || function () {}, card: opts.card || function () {}, change: opts.change || function () {}, state: opts.state || function () {} };
    var dice = opts.dice || function () { return r32(rnd(4), 0); };   /* случай — у браузера; подменяет его только закон */
    var on = false, recs = [], live = new WeakMap(), beat = null, version = 0, tags = {}, buckets = {};
    var men = POSTMEN.map(function (host, i) { return { host: host, i: i, ws: null, open: false, sockets: 0, sent: 0, ok: 0, refused: 0, got: 0, bad: 0, why: "", retry: 0, timer: null, subs: {}, wait: [] }; });

    function slotNow() { return Math.floor(now() / BREATH_MS); }
    function state(rec) { var st = live.get(rec); if (!st && rec.st) { st = S.load(rec.st); live.set(rec, st); } return st || null; }
    /* rec.at — когда ключи сдвинулись в последний раз: по нему переписка, сливаясь со списком другой вкладки, берёт
       более новое состояние и не откатывает ключи (откат сломал бы разговор навсегда). */
    function keep(rec, st) { live.set(rec, st); rec.st = S.save(st); rec.at = now(); }
    function mine(env) { return hex(L.sha512(env).subarray(0, 8)); }
    function remember(rec, h) { rec.seen.push(h); while (rec.seen.length > SEEN) rec.seen.shift(); }
    function blankRec(role, stage) {
      return { v: 1, id: hex(rnd(8)), role: role, stage: stage, t0: now(), code: null, pending: null, hello: null, meet: null, st: null, ks: null, kr: null,
        first: null, greet: false, seq: 0, got: 0, far: {}, ackDue: false, out: [], wait: [], seen: [], rr: 0, last: 0, words: null };
    }

    /* ── кого слушаем: ключи меток, которые ждёт разговор ── */
    function listens(rec) {
      var k = [];
      if (rec.kr && (rec.stage === "talk" || rec.stage === "hello")) k.push({ key: rec.kr, ch: "talk" });
      if (rec.meet && (rec.stage === "invite" || (rec.stage === "talk" && rec.greet))) k.push({ key: rec.meet, ch: "meet" });
      return k;
    }
    function subscribe(p) {
      if (!p.open) return;
      var s = slotNow(), lo = Math.floor((s - BACK) / BLOCK), hi = Math.floor((s + AHEAD) / BLOCK), b, id;
      for (id in p.subs) if (+id < lo) { try { p.ws.send(JSON.stringify(["CLOSE", "b" + id])); } catch (e) { /* соединение уже закрыто */ } delete p.subs[id]; }
      for (b = lo; b <= hi; b++) {
        if (p.subs[b] === version) continue;
        var list = [];
        recs.forEach(function (rec) {
          listens(rec).forEach(function (k) {
            var key = unhex(k.key), sl, t;
            for (sl = b * BLOCK; sl < (b + 1) * BLOCK; sl++) { t = tagOf(key, sl, p.i); tags[t] = { rec: rec, ch: k.ch, slot: sl, i: p.i, key: k.key }; list.push(t); }
          });
        });
        if (!list.length) { if (p.subs[b] != null) { try { p.ws.send(JSON.stringify(["CLOSE", "b" + b])); } catch (e) { /* закрыто */ } delete p.subs[b]; } continue; }
        try { p.ws.send(JSON.stringify(["REQ", "b" + b, { kinds: [KIND], "#p": list }])); p.subs[b] = version; } catch (e) { /* закрыто: спросим после переподключения */ }
      }
    }
    function resubscribe() { version++; men.forEach(subscribe); }

    /* ── соединения ── */
    function connect(p) {
      if (!on || p.ws) return;
      witness(p.host); p.sockets++;
      var ws; try { ws = socket("wss://" + p.host + "/"); } catch (e) { p.why = "нет соединения"; again(p); return; }
      p.ws = ws;
      ws.onopen = function () {
        if (p.ws !== ws) return;
        p.open = true; p.retry = 0; p.subs = {}; subscribe(p);
        var t = now(); p.wait.forEach(function (w) { if (t - w.at < BREATH_MS) push(p, w.ev); }); p.wait = [];
        tell.state();
      };
      ws.onmessage = function (m) { if (p.ws === ws) hear(p, m.data); };
      ws.onerror = function () { /* за ошибкой придёт закрытие */ };
      ws.onclose = function () { if (p.ws !== ws) return; p.ws = null; p.open = false; p.subs = {}; tell.state(); again(p); };
    }
    function again(p) {
      if (!on || p.timer) return;
      var ms = Math.min(60000, 5000 * Math.pow(2, p.retry)); p.retry = Math.min(p.retry + 1, 6);
      p.timer = later(function () { p.timer = null; connect(p); }, ms);
    }
    function push(p, ev) { try { p.ws.send(JSON.stringify(["EVENT", ev])); p.sent++; } catch (e) { /* закрылось на лету: капля потеряна, письмо дошлётся */ } }

    /* ── капля как событие: разовый ключ, разовая метка, срок жизни ── */
    function eventOf(content, tag) {
      var sk = L.schnorr.utils.randomSecretKey(), pub = hex(L.schnorr.getPublicKey(sk)), at = Math.floor(now() / 1000);
      var t = [["p", tag], ["expiration", String(at + LIFE_S)]];
      var id = L.sha256(te.encode(JSON.stringify([0, pub, at, KIND, t, content])));
      var ev = { id: hex(id), pubkey: pub, created_at: at, kind: KIND, tags: t, content: content, sig: hex(L.schnorr.sign(id, sk)) };
      sk.fill(0); return ev;
    }
    function post(p, content, tag) {
      if (!on) return;
      var ev = eventOf(content, tag);
      if (p.open) push(p, ev); else if (p.ws && p.wait.length < 4) p.wait.push({ at: now(), ev: ev });
    }

    /* ── что отдаёт разговор в этот такт ── */
    function sealBody(rec, kind, seq, bytes) {
      var st = state(rec), r = S.seal(st, cat(new Uint8Array([kind]), u32(seq), u32(rec.got), bytes));
      keep(rec, r.state); return r.envelope;
    }
    function nextEnvelope(rec) {
      if (rec.stage === "hello") return { env: unb64(rec.hello), key: unhex(rec.meet) };
      if (rec.stage !== "talk") return { env: S.blank(), key: rnd(32) };
      var key = unhex(rec.ks), env;
      var fresh = null, i, win = Math.min(rec.out.length, WIN_OUT);
      for (i = 0; i < win && !fresh; i++) if (!rec.out[i].env) fresh = rec.out[i];
      if (rec.first) { env = unb64(rec.first); rec.first = null; }
      /* Новое письмо запечатывается в миг первой отправки: так оно несёт свежее подтверждение
         и отдельный конверт на «получил» не нужен. Досылается потом тот же конверт. */
      else if (fresh) { env = sealBody(rec, fresh.k === CARD ? CARD : 1, fresh.seq, unb64(fresh.text)); fresh.env = b64(env); delete fresh.text; rec.ackDue = false; }
      else if (rec.ackDue) { env = sealBody(rec, 0, 0, new Uint8Array(0)); rec.ackDue = false; }
      else if (rec.out.length) { var at = rec.rr % win; env = unb64(rec.out[at].env); rec.rr = at + 1; }   /* по кругу, со старшего */
      else return { env: S.blank(), key: key };
      /* Ключи разговора только что сдвинулись: запись — срочная, она обязана лечь раньше, чем конверт уйдёт. */
      tell.change(rec, true);
      return { env: env, key: key };
    }
    function breathe() {
      beat = null; if (!on) return;
      /* Миг отсчитывается от начала такта по часам. Если устройство опоздало к такту больше чем на полсекунды
         (уснувшая вкладка, выход на связь посреди такта), отсчёт идёт от «сейчас»: между сдвигом ключей и первой
         каплей всегда остаётся не меньше полсекунды на запись. Опоздание от содержимого конверта не зависит. */
      var s = slotNow(), t0 = s * BREATH_MS; if (now() - t0 > HOLD / 2) t0 = now();
      recs.forEach(function (rec) {
        if (rec.last > s + AHEAD) rec.last = 0;           /* часы устройства были переведены назад */
        if (rec.last >= s) return;                       /* один конверт на такт: метки такта разовые */
        rec.last = s;
        if ((rec.stage === "invite" || rec.stage === "hello") && now() - rec.t0 > INVITE_MS) { late(rec); version++; }
        var moments = [], k; for (k = 0; k < DROPS; k++) moments.push(HOLD + dice() % MOMENT);   /* до конверта и не глядя в него */
        var job; try { job = nextEnvelope(rec); } catch (e) { job = { env: S.blank(), key: rnd(32) }; }   /* испорченная запись не глушит остальных */
        drops(job.env, job.key, s).then(function (list) {
          list.forEach(function (d) {
            var tag = tagOf(job.key, s, d.i);
            later(function () { post(men[d.i], d.content, tag); }, Math.max(0, t0 + moments[d.i] - now()));
          });
        });
      });
      men.forEach(subscribe);
      sweep(s);
      beat = later(breathe, (s + 1) * BREATH_MS - now() + 5);
    }
    function sweep(s) {
      var k; for (k in tags) if (tags[k].slot < s - BACK - BLOCK) delete tags[k];
      for (k in buckets) if (buckets[k].slot < s - BACK - BLOCK) delete buckets[k];
    }
    function late(rec) { rec.stage = "late"; rec.code = null; rec.pending = null; rec.hello = null; rec.meet = null; rec.st = null; live.delete(rec); tell.change(rec); }

    /* ── что приходит от почтальона ── */
    function hear(p, raw) {
      var d; try { d = JSON.parse(raw); } catch (e) { return; }
      if (!d || !d.length) return;
      if (d[0] === "OK") { if (d[2]) p.ok++; else { p.refused++; p.why = String(d[3] || "").slice(0, 80); } return; }
      if (d[0] !== "EVENT" || !d[2] || d[2].kind !== KIND || typeof d[2].content !== "string" || !d[2].tags) return;
      var ev = d[2], t = null, i;
      for (i = 0; i < ev.tags.length; i++) if (ev.tags[i] && ev.tags[i][0] === "p" && tags[ev.tags[i][1]]) { t = tags[ev.tags[i][1]]; break; }
      if (!t || t.i !== p.i || recs.indexOf(t.rec) === -1) return;
      var bid = t.rec.id + t.ch + t.slot, b = buckets[bid] || (buckets[bid] = { slot: t.slot, got: {}, good: [], done: false, busy: false });
      if (b.got[p.i]) return;
      b.got[p.i] = 1; p.got++;
      var sh = check(ev.content, unhex(t.key), t.slot, p.i);
      if (!sh) { p.bad++; tell.state(); return; }                 /* подмена: печать не сошлась — почтальон назван */
      if (b.done) return;
      b.good.push(sh);
      if (b.busy || b.good.length < NEED) return;
      b.busy = true;
      join3(b.good).then(function (env) { b.busy = false; b.done = true; b.good = []; if (env && on) take(t.rec, t.ch, env); });
    }
    function take(rec, ch, env) {
      if (recs.indexOf(rec) === -1) return;
      var h = mine(env), r, st;
      if (ch === "meet") {
        if (rec.stage === "invite") {
          if (now() - rec.t0 > INVITE_MS) { late(rec); resubscribe(); return; }
          r = S.accept(rec.pending, env); if (!r) return;
          keep(rec, r.state); var k = S.keys(r.state);
          rec.ks = hex(k.send); rec.kr = hex(k.recv); rec.first = b64(r.envelope); rec.stage = "talk"; rec.greet = true;
          rec.code = null; rec.pending = null; rec.words = S.words(r.state); remember(rec, h);
          resubscribe(); tell.change(rec);
        } else if (rec.greet && rec.seen.indexOf(h) !== -1) { rec.ackDue = true; tell.change(rec); }
        return;
      }
      if (rec.seen.indexOf(h) !== -1) { rec.ackDue = true; tell.change(rec); return; }   /* досланное: наше подтверждение потерялось */
      st = state(rec); if (!st) return;
      r = S.open(st, env); if (!r) return;                                               /* пустой конверт или не наш */
      keep(rec, r.state); remember(rec, h);
      if (rec.stage === "hello") {
        rec.stage = "talk"; rec.hello = null; rec.meet = null; rec.words = S.words(r.state);
        var waiting = rec.wait; rec.wait = []; waiting.forEach(function (txt) { queue(rec, txt); });
        resubscribe();
      }
      if (rec.greet) { rec.greet = false; rec.meet = null; resubscribe(); }
      var b = r.body;
      if (b.length >= HEAD) {
        var kind = b[0], seq = r32(b, 1), ack = r32(b, 5);
        if (ack) { var n0 = rec.out.length; rec.out = rec.out.filter(function (o) { return o.seq > ack; }); if (rec.out.length !== n0) rec.rr = 0; }
        if (kind === 1 || kind === CARD) {
          rec.ackDue = true;
          if (seq > rec.got && seq <= rec.got + QUEUE && rec.far[seq] == null) {
            try { rec.far[seq] = td.decode(b.subarray(HEAD)); } catch (e) { rec.far[seq] = ""; }
            if (kind === CARD) rec.far[seq] = { card: rec.far[seq] };
            /* письма отдаются по порядку: пришедшее раньше своей очереди ждёт соседа */
            while (rec.far[rec.got + 1] != null) { rec.got++; var text = rec.far[rec.got]; delete rec.far[rec.got]; if (text && typeof text === "object") tell.card(rec, String(text.card || "")); else tell.text(rec, text, now(), rec.got); }
          }
        }
      }
      tell.change(rec);
    }

    /* ── сказать ── */
    function queue(rec, text) {
      var bytes = te.encode(String(text)), p = 0, cut;
      while (p < bytes.length) {
        cut = Math.min(bytes.length, p + PIECE);
        while (cut < bytes.length && cut > p && (bytes[cut] & 192) === 128) cut--;       /* не резать букву пополам */
        rec.seq++; rec.out.push({ seq: rec.seq, text: b64(bytes.subarray(p, cut)) });
        p = cut;
      }
    }
    function say(rec, text) {
      text = String(text == null ? "" : text);
      if (!text || recs.indexOf(rec) === -1 || rec.stage === "invite" || rec.stage === "late") return false;
      if (rec.out.length + rec.wait.length >= QUEUE) return false;
      if (rec.stage === "talk") queue(rec, text); else rec.wait.push(text);
      tell.change(rec); return true;
    }

    /* Карточка имени: едет тем же путём и в том же конверте, что письмо, — почтальону её не отличить.
       Имя уходит, только если человек сам это включил (решение основателя 18.11). */
    function card(rec, name) {
      name = String(name == null ? "" : name).slice(0, NAME);
      if (!name || recs.indexOf(rec) === -1 || rec.stage !== "talk" || rec.out.length >= QUEUE) return false;
      rec.seq++; rec.out.push({ seq: rec.seq, text: b64(te.encode(name)), k: CARD });
      tell.change(rec); return true;
    }

    return {
      card: card,
      open: function () { if (on) return; on = true; men.forEach(connect); breathe(); tell.state(); },
      close: function () {
        if (!on) return; on = false;
        if (beat != null) { never(beat); beat = null; }
        men.forEach(function (p) { if (p.timer != null) { never(p.timer); p.timer = null; } var ws = p.ws; p.ws = null; p.open = false; p.subs = {}; p.wait = []; if (ws) { try { ws.close(); } catch (e) { /* уже закрыт */ } } });
        tags = {}; buckets = {}; tell.state();
      },
      invite: function () {
        var inv = S.invite(), rec = blankRec("host", "invite");
        rec.code = inv.code; rec.pending = inv.pending; rec.meet = hex(S.meet(inv.code));
        recs.push(rec); resubscribe(); return rec;
      },
      join: function (code) {
        var j = S.join(String(code)), rec = blankRec("guest", "hello"), k = S.keys(j.state);
        rec.hello = b64(j.envelope); rec.meet = hex(S.meet(String(code))); rec.ks = hex(k.send); rec.kr = hex(k.recv);
        keep(rec, j.state); recs.push(rec); resubscribe(); return rec;
      },
      /* Устройство проснулось (окно снова на виду): упавшие соединения поднимаются сразу, пропущенный такт догоняется. */
      wake: function () {
        if (!on) return;
        men.forEach(function (p) { if (!p.ws) { if (p.timer != null) { never(p.timer); p.timer = null; } p.retry = 0; connect(p); } });
        if (beat != null) { never(beat); beat = null; }
        breathe();
      },
      add: function (rec) { if (rec && rec.v === 1 && recs.indexOf(rec) === -1) { recs.push(rec); resubscribe(); } return rec; },
      remove: function (rec) { var i = recs.indexOf(rec); if (i !== -1) { recs.splice(i, 1); live.delete(rec); resubscribe(); } },
      say: say,
      status: function () {
        return { on: on, slot: slotNow(), postmen: men.map(function (p) { return { host: p.host, open: p.open, sockets: p.sockets, sent: p.sent, ok: p.ok, refused: p.refused, got: p.got, bad: p.bad, why: p.why }; }) };
      }
    };
  }

  G.sbShepotPost = { POSTMEN: POSTMEN.slice(), DROPS: DROPS, NEED: NEED, KIND: KIND, BREATH_MS: BREATH_MS, LIFE_S: LIFE_S, INVITE_MS: INVITE_MS,
    make: make, drops: drops, gather: gather };
})(typeof globalThis !== "undefined" ? globalThis : window);
