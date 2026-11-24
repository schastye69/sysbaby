/* sys.baby OS — core/noise.js
 * ТИХИЙ ШУМ · решение D-892 (основатель, после демо инструментов 12.11.2026).
 * Дождь, море, огонь, ветер, ручей — звук РОЖДАЕТСЯ НА УСТРОЙСТВЕ: шум
 * (белый, розовый, бурый — посчитан в буфер один раз) через фильтры WebAudio,
 * медленная «волна» громкости — генератор низкой частоты, треск огня и
 * капли дождя — короткие всплески того же шума через свой фильтр. Ни одного
 * файла, ни одного запроса: звук нельзя скачать, потому что его негде взять.
 *
 * Плавно: начало и конец — 2,5 с по громкости, смена звука — перетекание.
 * Громкость — нить (0…1). Таймер выключения 15/30/60 мин — к сроку звук
 * гаснет сам. «Не беспокоить» не спрашивается: звук включает сам человек.
 * Звук живёт, пока открыта вкладка; после перезагрузки сам не включается
 * (браузер и не позволит без касания) — помнится только выбор и громкость.
 * Управление — window.sbNoise (его зовёт core/desktools.js).
 * Охраняется tools/noise-check.mjs. */
(function () {
  "use strict";
  var SOUNDS = ["rain", "sea", "fire", "wind", "brook"];
  var FADE = 2.5;   /* ПОСТОЯННАЯ: секунд на плавное начало и конец — короче звучит щелчком, длиннее кажется, что не нажалось. */
  var ac = null, master = null, voice = null, cur = null, vol = 0.5, offAt = 0, offT = 0, bufs = {}, listeners = [];
  function emit(ev) { listeners.forEach(function (f) { try { f(ev); } catch (e) { /* слушатель не роняет звук */ } }); }

  function ctx() {
    if (ac) return ac;
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    ac = new AC(); master = ac.createGain(); master.gain.value = vol; master.connect(ac.destination);
    return ac;
  }
  /* шум один раз на цвет: 4 с, по кругу без шва (края сведены) */
  function noise(kind) {
    if (bufs[kind]) return bufs[kind];
    var n = Math.floor(ac.sampleRate * 4), b = ac.createBuffer(1, n, ac.sampleRate), d = b.getChannelData(0), i;
    var b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0, last = 0;
    for (i = 0; i < n; i++) {
      var w = Math.random() * 2 - 1;
      if (kind === "white") d[i] = w * 0.5;
      else if (kind === "pink") {   /* фильтр Пола Келлета */
        b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
        b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11; b6 = w * 0.115926;
      } else { last = (last + 0.02 * w) / 1.02; d[i] = last * 3.5; }   /* бурый */
    }
    var k = Math.min(2000, n >> 4);
    for (i = 0; i < k; i++) { var t = i / k; d[i] = d[i] * t + d[n - k + i] * (1 - t); }
    return (bufs[kind] = b);
  }
  function src(kind) { var s = ac.createBufferSource(); s.buffer = noise(kind); s.loop = true; s.loopStart = 0; return s; }
  function filt(type, f, q) { var x = ac.createBiquadFilter(); x.type = type; x.frequency.value = f; if (q) x.Q.value = q; return x; }
  function lfo(target, rate, depth) { var o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = rate; g.gain.value = depth; o.connect(g); g.connect(target); o.start(); return o; }

  /* сборка одного звука: { out, stop() } */
  function build(name) {
    var out = ac.createGain(), parts = [], t = 0;
    out.gain.value = 0;
    function chain(kind, nodes, gain) {
      var s = src(kind), g = ac.createGain(), prev = s; g.gain.value = gain;
      nodes.forEach(function (n) { prev.connect(n); prev = n; }); prev.connect(g); g.connect(out); s.start(0, Math.random() * 3);
      parts.push(s); return g;
    }
    /* всплески: капли и треск — короткие вспышки шума через свой фильтр */
    function bursts(rate, f, len, gain) {
      var bp = filt("bandpass", f, 1.2), g = ac.createGain(); g.gain.value = gain; bp.connect(g); g.connect(out);
      (function tick() {
        if (!ac || out._dead) return;
        var s = src("white"), e = ac.createGain(), now = ac.currentTime, l = len * (0.5 + Math.random());
        e.gain.setValueAtTime(0, now); e.gain.linearRampToValueAtTime(0.4 + Math.random() * 0.6, now + 0.004); e.gain.exponentialRampToValueAtTime(0.001, now + l);
        s.connect(e); e.connect(bp); s.start(now, Math.random() * 3); s.stop(now + l + 0.05);
        t = setTimeout(tick, 1000 / rate * (0.3 + Math.random() * 1.4));
      })();
    }
    if (name === "rain") { chain("pink", [filt("highpass", 400), filt("lowpass", 7000)], 0.55); bursts(18, 3200, 0.03, 0.18); }
    else if (name === "sea") { var g = chain("brown", [filt("lowpass", 700)], 0.5); parts.push(lfo(g.gain, 0.09, 0.35)); chain("pink", [filt("bandpass", 1200, 0.6)], 0.08); }
    else if (name === "fire") { chain("brown", [filt("lowpass", 500)], 0.6); bursts(5, 2600, 0.02, 0.35); bursts(1.2, 900, 0.09, 0.2); }
    else if (name === "wind") { var bp = filt("bandpass", 500, 0.9); chain("pink", [bp], 0.7); parts.push(lfo(bp.frequency, 0.07, 260)); }
    else if (name === "brook") { var g2 = chain("white", [filt("bandpass", 1600, 1.4)], 0.35); parts.push(lfo(g2.gain, 0.6, 0.12)); chain("pink", [filt("lowpass", 900)], 0.25); }
    out.connect(master);
    return { name: name, out: out, stop: function (at) {
      var when = ac.currentTime + (at || 0);
      out._dead = true; clearTimeout(t);
      parts.forEach(function (p) { try { p.stop(when + 0.05); } catch (e) { /* уже стоит */ } });
      setTimeout(function () { try { out.disconnect(); } catch (e) { /* уже отключён */ } }, (at || 0) * 1000 + 200);
    } };
  }
  function ramp(g, to, s) { var now = ac.currentTime; g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); g.linearRampToValueAtTime(to, now + s); }

  function play(name) {
    if (SOUNDS.indexOf(name) < 0 || !ctx()) return false;
    if (ac.state !== "running") { try { ac.resume(); } catch (e) { /* без звука — так и скажем */ } }
    if (voice && voice.name === name) return true;
    if (voice) { ramp(voice.out.gain, 0, FADE); voice.stop(FADE); }
    voice = build(name); cur = name; ramp(voice.out.gain, 1, FADE);
    emit("play"); return true;
  }
  function stop(fade) {
    clearTimeout(offT); offAt = 0;
    if (!voice) return;
    var f = fade == null ? FADE : fade;
    ramp(voice.out.gain, 0, Math.max(0.01, f)); voice.stop(f); voice = null; cur = null; emit("stop");
  }
  function setVol(v) { vol = Math.max(0, Math.min(1, +v || 0)); if (master) ramp(master.gain, vol, 0.12); emit("vol"); }
  function sleep(min) {
    clearTimeout(offT); offAt = 0;
    if (!min) { emit("timer"); return; }
    offAt = Date.now() + min * 60000;
    offT = setTimeout(function () { stop(FADE * 4); }, min * 60000);
    emit("timer");
  }

  window.sbNoise = {
    sounds: SOUNDS.slice(), play: play, stop: function () { stop(); }, volume: function (v) { if (v != null) setVol(v); return vol; }, sleep: sleep,
    playing: function () { return cur; }, left: function () { return offAt ? Math.max(0, offAt - Date.now()) : 0; },
    running: function () { return !!(ac && ac.state === "running" && voice); },
    on: function (f) { if (typeof f === "function") listeners.push(f); }
  };
})();
