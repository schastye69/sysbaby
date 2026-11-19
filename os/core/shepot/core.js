/* sys.baby OS — core/shepot/core.js
 * ── ЯДРО ШЁПОТА: ЗНАКОМСТВО, ХРАПОВИК, КОНВЕРТ (D-1402, D-1403) ────────────────
 * ПОВОД — задание основателя 17.11.2026 (§6 слой 1, §7): письмо нельзя прочесть ни сейчас, ни
 * потом; новая тайна на каждом письме; самовосстановление после взлома; конверт одного размера,
 * пустой неотличим; отрицаемость. Ответ Совета за основателя 17.11: два замка (X448 +
 * ML-KEM-1024) и готовое место под HQC; письма не подписываются.
 *
 * ЧТО ЗДЕСЬ СВОЁ, А ЧТО НЕТ. Алгоритмов своих — ноль: X448, ML-KEM-1024 (FIPS 203), HKDF и
 * HMAC на SHA-512, XChaCha20-Poly1305, AES-256-GCM берутся из вшитой библиотеки (lib.js, опись
 * tools/shepot-vendor.json). Своё здесь — только СОСТАВ: порядок, в котором эти части
 * соединены. Он повторяет опубликованный «двойной храповик» с зашифрованными заголовками, где
 * к каждому шагу Диффи — Хеллмана добавлена тайна ML-KEM. Состав не проверен формально и не
 * прошёл внешний аудит — пока этого нет, интерфейс обязан говорить «внешней проверки ещё не было».
 *
 * КАК ЗНАКОМЯТСЯ. Приглашение (QR или «Передать») несёт случайную тайну в 256 бит и разовый
 * ключ X448. Гость отвечает одним конвертом со своими ключами X448 и ML-KEM. Хозяин отвечает
 * обычным письмом храповика — в нём первая тайна ML-KEM. Корень разговора зависит от трёх
 * вещей сразу: тайны приглашения, X448 и ML-KEM.
 *
 * КОНВЕРТ. Всегда ENVELOPE байт: случайное число, зашифрованный заголовок, зашифрованное
 * тело с набивкой. Снаружи не видно ни ключей, ни номеров, ни длины письма. blank() даёт
 * случайные байты той же длины.
 *
 * ЧЕГО ЯДРО НЕ УМЕЕТ: стереть ключ из памяти браузера наверняка (обнуляем, что можем);
 * защитить от заражённого устройства; скрыть, что устройство в сети. Сети здесь нет вовсе.
 */
(function (G) {
  "use strict";
  var L = G.sbShepotLib;
  if (!L) return;
  var V = 1, P = "sb-shepot/1/";
  /* Замки обмена ключами. Третье место — под HQC (коды, другая математика): пусто, пока нет
     проверенной библиотеки. Появится — войдёт третьей тайной в mix() и сменит V. */
  var LOCKS = ["x448", "ml-kem-1024", null];
  var DH = 56, KPK = 1568, KCT = 1568, HDR = DH + KPK + KCT + 8, TAGS = 32, NONCE = 36;
  var ENVELOPE = 8192, EHDR = HDR + TAGS, EBODY = ENVELOPE - NONCE - EHDR, BODY = EBODY - TAGS, MAX_BODY = BODY - 2;
  var HELLO = ENVELOPE - NONCE - TAGS, MAX_SKIP = 64, WORDS = 2048;
  var te = new TextEncoder();

  function rnd(n) { var a = new Uint8Array(n); for (var i = 0; i < n; i += 65536) G.crypto.getRandomValues(a.subarray(i, Math.min(n, i + 65536))); return a; }
  function cat() { var n = 0, i; for (i = 0; i < arguments.length; i++) n += arguments[i].length; var o = new Uint8Array(n), p = 0; for (i = 0; i < arguments.length; i++) { o.set(arguments[i], p); p += arguments[i].length; } return o; }
  function u32(n) { return new Uint8Array([n >>> 24, n >>> 16 & 255, n >>> 8 & 255, n & 255]); }
  function r32(b, p) { return ((b[p] << 24) | (b[p + 1] << 16) | (b[p + 2] << 8) | b[p + 3]) >>> 0; }
  function wipe() { for (var i = 0; i < arguments.length; i++) if (arguments[i] && arguments[i].fill) arguments[i].fill(0); }
  function kdf(ikm, salt, info, len) { return L.hkdf(L.sha512, ikm, salt || undefined, te.encode(P + info), len); }
  function hex(b) { var s = ""; for (var i = 0; i < b.length; i++) s += (b[i] < 16 ? "0" : "") + b[i].toString(16); return s; }
  function unhex(s) { var b = new Uint8Array(s.length / 2); for (var i = 0; i < b.length; i++) b[i] = parseInt(s.substr(i * 2, 2), 16); return b; }
  var B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  function b64(b) { var s = "", i, n; for (i = 0; i < b.length; i += 3) { n = (b[i] << 16) | ((b[i + 1] || 0) << 8) | (b[i + 2] || 0); s += B64[n >> 18] + B64[n >> 12 & 63] + (i + 1 < b.length ? B64[n >> 6 & 63] : "") + (i + 2 < b.length ? B64[n & 63] : ""); } return s; }
  function unb64(s) { var out = [], i, n, k, c; for (i = 0; i < s.length; i += 4) { n = 0; k = 0; for (c = 0; c < 4; c++) { var v = i + c < s.length ? B64.indexOf(s[i + c]) : -2; if (v === -1) return null; if (v >= 0) { n |= v << (18 - 6 * c); k++; } } out.push(n >> 16 & 255); if (k > 2) out.push(n >> 8 & 255); if (k > 3) out.push(n & 255); } return new Uint8Array(out); }

  /* Каскад: AES-256-GCM внутри, XChaCha20-Poly1305 снаружи, ключи независимые (64 байта). */
  function sealC(k, n, pt, aad) { return L.xchacha20poly1305(k.subarray(0, 32), n.subarray(0, 24), aad).encrypt(L.gcm(k.subarray(32, 64), n.subarray(24, 36), aad).encrypt(pt)); }
  function openC(k, n, ct, aad) { try { return L.gcm(k.subarray(32, 64), n.subarray(24, 36), aad).decrypt(L.xchacha20poly1305(k.subarray(0, 32), n.subarray(0, 24), aad).decrypt(ct)); } catch (e) { return null; } }

  function dhPair() { var sk = L.x448.utils.randomSecretKey(); return { sk: sk, pk: L.x448.getPublicKey(sk) }; }
  function kemPair() { var k = L.ml_kem1024.keygen(); return { sk: k.secretKey, pk: k.publicKey }; }
  /* Смешение замков: тайны всех занятых мест LOCKS идут в один вывод ключа. */
  function mix(rk, dhOut, kemOut) { var ikm = cat(dhOut, kemOut), o = kdf(ikm, rk, "rk", 128); wipe(ikm, dhOut, kemOut); return [o.slice(0, 32), o.slice(32, 64), o.slice(64, 128)]; }
  function step(ck) { return [L.hmac(L.sha512, ck, new Uint8Array([1])), L.hmac(L.sha512, ck, new Uint8Array([2])).slice(0, 32)]; }
  var AAD_H = te.encode(P + "header"), AAD_HELLO = te.encode(P + "hello");

  function roots(secret, dhOut, code, hello) {
    var ad = L.sha512(cat(code, hello)), o = kdf(cat(secret, dhOut), ad, "sk", 224);
    wipe(dhOut);
    return { ad: ad, sk: o.slice(0, 32), hka: o.slice(32, 96), nhkb: o.slice(96, 160), tg: o.slice(160, 192), th: o.slice(192, 224) };
  }
  function parseCode(code) { var b = typeof code === "string" ? unb64(code) : null; if (!b || b.length !== 1 + 32 + DH || b[0] !== V) return null; return { raw: b, secret: b.slice(1, 33), a0: b.slice(33) }; }

  function invite() {
    var a0 = dhPair(), secret = rnd(32), raw = cat(new Uint8Array([V]), secret, a0.pk);
    return { code: b64(raw), pending: { v: V, code: b64(raw), a0sk: hex(a0.sk) } };
  }
  function join(code) {
    var c = parseCode(code); if (!c) throw new Error("shepot: bad invite");
    var b0 = dhPair(), kb = kemPair(), hello = cat(b0.pk, kb.pk), pad = new Uint8Array(HELLO); pad.set(hello);
    var n = rnd(NONCE), k1 = kdf(c.secret, c.a0, "hello", 64);
    var r = roots(c.secret, L.x448.getSharedSecret(b0.sk, c.a0), c.raw, hello);
    var st = { v: V, ad: r.ad, rk: r.sk, dhs: b0, dhr: null, kems: kb, kemr: null, ct: null, cks: null, ckr: null,
      hks: null, hkr: null, nhks: r.nhkb, nhkr: r.hka, ns: 0, nr: 0, pn: 0, skipped: [], sas: null, ts: r.tg, tr: r.th };
    var env = cat(n, sealC(k1, n, pad, AAD_HELLO)); wipe(k1, pad);
    return { state: st, envelope: env };
  }
  function accept(pending, envelope) {
    try {
      var c = parseCode(pending && pending.code); if (!c || !envelope || envelope.length !== ENVELOPE) return null;
      var k1 = kdf(c.secret, c.a0, "hello", 64), pad = openC(k1, envelope.subarray(0, NONCE), envelope.subarray(NONCE), AAD_HELLO); wipe(k1);
      if (!pad) return null;
      var hello = pad.slice(0, DH + KPK), b0 = hello.slice(0, DH), kb = hello.slice(DH), a0sk = unhex(pending.a0sk);
      var r = roots(c.secret, L.x448.getSharedSecret(a0sk, b0), c.raw, hello); wipe(a0sk);
      var dhs = dhPair(), enc = L.ml_kem1024.encapsulate(kb), m = mix(r.sk, L.x448.getSharedSecret(dhs.sk, b0), enc.sharedSecret);
      var st = { v: V, ad: r.ad, rk: m[0], dhs: dhs, dhr: b0, kems: kemPair(), kemr: kb, ct: enc.cipherText, cks: m[1], ckr: null,
        hks: r.hka, hkr: null, nhks: m[2], nhkr: r.nhkb, ns: 0, nr: 0, pn: 0, skipped: [], sas: kdf(m[0], r.ad, "sas", 8), ts: r.th, tr: r.tg };
      return seal(st, new Uint8Array(0));
    } catch (e) { return null; }
  }

  function clone(s) {
    var o = {}, k; for (k in s) { var v = s[k]; o[k] = v instanceof Uint8Array ? v.slice() : v; }
    o.dhs = { sk: s.dhs.sk.slice(), pk: s.dhs.pk.slice() }; o.kems = { sk: s.kems.sk.slice(), pk: s.kems.pk.slice() };
    o.skipped = s.skipped.map(function (x) { return { hk: x.hk.slice(), n: x.n, mk: x.mk.slice() }; });
    return o;
  }
  /* Ключ и число тела — из ключа письма И случайного числа конверта. Если состояние откатилось (страница упала
     до записи) и тот же ключ письма запечатал другое письмо, пара «ключ + число» всё равно не повторится. */
  function bodyKeys(mk, n) { var o = kdf(mk, n, "mk", 64 + NONCE); wipe(mk); return { k: o.subarray(0, 64), n: o.subarray(64) }; }

  function seal(state, body) {
    if (!state || !state.cks) throw new Error("shepot: not ready");
    if (!(body instanceof Uint8Array) && !(body && typeof body.length === "number")) throw new Error("shepot: body");
    if (body.length > MAX_BODY) throw new Error("shepot: too long");
    var st = clone(state), s = step(st.cks); wipe(st.cks); st.cks = s[1];
    var header = cat(st.dhs.pk, st.kems.pk, st.ct, u32(st.pn), u32(st.ns)), n = rnd(NONCE);
    var ehdr = sealC(st.hks, n, header, AAD_H); st.ns++;
    var plain = new Uint8Array(BODY); plain[0] = body.length >> 8; plain[1] = body.length & 255; plain.set(body, 2);
    var bk = bodyKeys(s[0], n), ebody = sealC(bk.k, bk.n, plain, cat(st.ad, ehdr)); wipe(plain, bk.k, bk.n);
    return { state: st, envelope: cat(n, ehdr, ebody) };
  }

  function readHeader(hk, n, ehdr) {
    if (!hk) return null; var h = openC(hk, n, ehdr, AAD_H); if (!h || h.length !== HDR) return null;
    return { dh: h.slice(0, DH), kpk: h.slice(DH, DH + KPK), ct: h.slice(DH + KPK, DH + KPK + KCT), pn: r32(h, HDR - 8), n: r32(h, HDR - 4) };
  }
  function skipTo(st, until) {
    if (!st.ckr) return true; if (until - st.nr > MAX_SKIP) return false;
    while (st.nr < until) { var s = step(st.ckr); wipe(st.ckr); st.ckr = s[1]; st.skipped.push({ hk: st.hkr.slice(), n: st.nr, mk: s[0] }); st.nr++; }
    while (st.skipped.length > MAX_SKIP * 2) wipe(st.skipped.shift().mk);
    return true;
  }
  function ratchet(st, h) {
    st.pn = st.ns; st.ns = 0; st.nr = 0; st.hks = st.nhks; st.hkr = st.nhkr; st.dhr = h.dh; st.kemr = h.kpk;
    var m = mix(st.rk, L.x448.getSharedSecret(st.dhs.sk, st.dhr), L.ml_kem1024.decapsulate(h.ct, st.kems.sk));
    st.ckr = m[1]; st.nhkr = m[2];
    if (!st.sas) st.sas = kdf(m[0], st.ad, "sas", 8);
    wipe(st.dhs.sk, st.kems.sk); st.dhs = dhPair(); st.kems = kemPair();
    var enc = L.ml_kem1024.encapsulate(st.kemr); st.ct = enc.cipherText;
    var m2 = mix(m[0], L.x448.getSharedSecret(st.dhs.sk, st.dhr), enc.sharedSecret);
    st.rk = m2[0]; st.cks = m2[1]; st.nhks = m2[2];
  }
  function body(st, mk, n, ehdr, ebody) {
    var bk = bodyKeys(mk, n), p = openC(bk.k, bk.n, ebody, cat(st.ad, ehdr)); wipe(bk.k, bk.n);
    if (!p || p.length !== BODY) return null; var len = (p[0] << 8) | p[1]; if (len > MAX_BODY) return null;
    var out = p.slice(2, 2 + len); wipe(p); return out;
  }
  function open(state, envelope) {
    try {
      if (!state || !envelope || envelope.length !== ENVELOPE) return null;
      var n = envelope.subarray(0, NONCE), ehdr = envelope.subarray(NONCE, NONCE + EHDR), ebody = envelope.subarray(NONCE + EHDR);
      var st = clone(state), h, i, seen = {}, b;
      for (i = 0; i < st.skipped.length; i++) {            /* отложенные ключи пропущенных писем */
        var x = st.skipped[i], id = hex(x.hk.subarray(0, 16));
        if (!(id in seen)) seen[id] = readHeader(x.hk, n, ehdr);
        if (seen[id] && seen[id].n === x.n) { b = body(st, x.mk.slice(), n, ehdr, ebody); if (!b) return null; wipe(x.mk); st.skipped.splice(i, 1); return { state: st, body: b }; }
      }
      h = readHeader(st.hkr, n, ehdr);
      if (h) { if (h.n < st.nr || !skipTo(st, h.n)) return null; }
      else {
        h = readHeader(st.nhkr, n, ehdr); if (!h) return null;
        if (!skipTo(st, h.pn)) return null;
        ratchet(st, h);
        if (!skipTo(st, h.n)) return null;
      }
      var s = step(st.ckr); wipe(st.ckr); st.ckr = s[1]; st.nr++;
      b = body(st, s[0], n, ehdr, ebody); if (!b) return null;
      return { state: st, body: b };
    } catch (e) { return null; }
  }

  function save(st) {
    return JSON.stringify(st, function (k, v) { return v instanceof Uint8Array ? "x:" + hex(v) : v; });
  }
  function load(s) {
    return JSON.parse(s, function (k, v) { return typeof v === "string" && v.slice(0, 2) === "x:" ? unhex(v.slice(2)) : v; });
  }
  /* Четыре слова сверки: 44 бита из тайны первого шага храповика. Номера, а не слова: словарь
     выбирает интерфейс, у обоих он обязан быть один. */
  function words(st) {
    if (!st || !st.sas) return null; var b = st.sas, out = [], acc = 0, bits = 0, i = 0;
    while (out.length < 4) { acc = acc * 256 + b[i++]; bits += 8; if (bits >= 11) { bits -= 11; out.push(Math.floor(acc / Math.pow(2, bits)) % WORDS); acc = acc % Math.pow(2, bits); } }
    return out;
  }
  function blank() { return rnd(ENVELOPE); }
  /* Тайное расписание (§6 слой 4): из общей тайны двоих — два ключа меток, по одному на
     направление. Из них почта выводит, у какого почтальона и под какой меткой ждать каплю.
     Ключи выведены при знакомстве и с храповиком не меняются: тот, кто украл состояние, узнаёт
     метки разговора вперёд (не письма). Место встречи — ключ меток для самого первого конверта,
     выведен из приглашения. */
  function keys(st) { return st && st.ts && st.tr ? { send: st.ts.slice(), recv: st.tr.slice() } : null; }
  function meet(code) { var c = parseCode(code); return c ? kdf(c.secret, c.a0, "meet", 32) : null; }

  G.sbShepot = { V: V, LOCKS: LOCKS, ENVELOPE: ENVELOPE, MAX_BODY: MAX_BODY, WORDS: WORDS,
    invite: invite, join: join, accept: accept, seal: seal, open: open, blank: blank, save: save, load: load, words: words, keys: keys, meet: meet };
})(typeof globalThis !== "undefined" ? globalThis : window);
