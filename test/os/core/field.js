/* =============================================================================
   field.js — the desktop wallpaper.

   Two canvases and four painted divs, sitting inside .wp-layer and nowhere
   else. This is the OS's background; the landing page has its own and the two
   never meet.

   What it draws:

   1. PLASMA WITH DRIFT. An interference field with domain warping, summed with
      itself offset by exactly 1.988 pixels and 1.988 seconds. The present is
      laid over its own past and never realigns with it, so the pattern does
      not repeat — not on a long cycle, at all.
   2. REFRACTION. A tap does not draw a ring. It bends the light that is
      already there: a phase wave runs through the fibres and they flex.
   3. BODIES OF LIGHT — depth and temperature, and a read head sweeping down
      the field once a minute.

   The plasma is computed per pixel into a 248x140 buffer, blown up twice (once
   by drawImage onto a half-resolution canvas, once by CSS onto the viewport).
   Those two bilinear stages are the entire softness budget — there is no blur
   filter anywhere, because a full-screen blur costs more than the whole
   effect. All trigonometry comes from a 2048-entry lookup table; the draw path
   calls Math.sin zero times.

   Level is 'live', 'quiet' or 'off', persisted under field.level. Under
   reduced motion it is forced off and the static #breath glow takes over.
   ========================================================================== */

(function () {
  "use strict";

  var doc = document;

  function q(sel) { return doc.querySelector(sel); }

  function reduced() {
    if (window.sbReducedMotion && window.sbReducedMotion()) return true;
    try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
    catch (e) { return false; }
  }

  /* The CSS hides the field in the light theme and in incognito, where the
     gradient wallpaper takes over. Knowing that here too means the loop stops
     rather than painting a canvas nobody can see. */
  function suppressed() {
    var root = doc.documentElement;
    return root.getAttribute("data-theme") === "light" || root.classList.contains("sb-incognito");
  }

  /* Windows are frosted glass: backdrop-filter: blur(58px). A blurred backdrop
     has to be recomputed every time anything underneath it repaints, so a
     wallpaper that redraws 29 times a second costs a full-screen 58px blur 29
     times a second as well. Measured on this desktop at 1280x800 with two
     windows open: 33 fps with a still wallpaper, 11 fps with a moving one.
     That is the whole cost — a static layer is free, however elaborate.

     So the wallpaper moves when it is the thing you are looking at, and holds
     still when it is not. Opening a window parks it on its last frame, which
     stays on the canvas; closing the last one starts it again from exactly
     where it stopped, because the elapsed pause is added back to t0 and the
     picture never jumps. In between you see a still wallpaper in the margins
     around a window — which is what you would have seen anyway. */
  var PARKED_CLASS = "wp-parked";

  var LEVEL_KEY = "field.level";

  /* The mood IS the wallpaper. The field is opaque, so it is the only thing
     anyone sees — and mapping the four moods onto four of the reference's own
     chapter palettes was the bug: two of those are both blue, so Ocean and
     Aurora were indistinguishable and the control looked dead. These are their
     own triples, named for what they are and matching the gradients beneath. */
  var MOOD_PALETTE = {
    /* studio — the system's own room: graphite plasma with a clay ember. The
       environment stays achromatic; the seam is the only warmth in it. */
    studio: [[54, 48, 46], [30, 28, 30], [198, 92, 56]],
    ocean:  [[58, 92, 226], [40, 66, 190], [86, 112, 238]],
    aurora: [[46, 214, 170], [64, 128, 236], [128, 92, 255]],
    sunset: [[255, 138, 78], [214, 68, 122], [255, 96, 140]],
    mono:   [[176, 182, 198], [124, 130, 146], [208, 214, 226]]
  };

  var Field = {
    cv: null, cx: null, off: null, ocx: null, img: null, buf: null,
    W: 0, H: 0, cw: 0, ch: 0, pw: 0, ph: 0, dpr: 1,
    raf: 0, last: 0, t0: 0, step: 40, level: "live", on: true,
    /* typing starts far in the past, not at 0: at 0 the first four seconds
       after load would read as "someone is writing" and the field would open
       dimmed. Nothing calls pulse() by default, so it stays that way. */
    charge: 0, calm: 0, typing: -1e9, tiltX: 0, tiltY: 0, head: 0,
    pal: null, palTo: null, blobs: [], waves: [],
    SIN: null,
    init: function () {
      if (this.cv) return;
      this.cv = q("#sbField");
      if (!this.cv) return;
      this.cx = this.cv.getContext("2d", { alpha: false });
      if (!this.cx) { this.cv = null; return; }
      this.off = doc.createElement("canvas");
      this.ocx = this.off.getContext("2d");
      this.SIN = new Float32Array(2048);
      for (var i = 0; i < 2048; i++) this.SIN[i] = Math.sin(i * Math.PI * 2 / 2048);
      this.pal = MOOD_PALETTE.studio.map(function (c) { return c.slice(); });
      this.palTo = MOOD_PALETTE.studio;
      for (var b = 0; b < 3; b++) this.blobs.push({
        px: .24 + b * .28, py: .28 + ((b * 41) % 100) / 240,
        ax: .19 + b * .05, ay: .13 + b * .04,
        sx: 37 + b * 15, sy: 53 + b * 21, ph: b * 2.3, r: .52 + b * .14
      });
      var self = this;
      window.addEventListener("resize", function () { self.resize(); });
      /* a touch bends the light — no new line appears on the screen */
      window.addEventListener("pointerdown", function (e) {
        self.waves.push({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight, t: 0 });
        if (self.waves.length > 3) self.waves.shift();
        self.charge = Math.min(1, self.charge + .3);
      }, { passive: true });
      /* No deviceorientation listener. The reference parallaxes the field
         from the phone's tilt; here the wallpaper holds still whichever way
         the device is turned. tiltX/tiltY stay 0 and the maths is unchanged. */
      this.resize();
      this.applyMood(window.sbGetWallpaperMood ? window.sbGetWallpaperMood() : "studio");
      var saved = window.sbDB ? window.sbDB.get(LEVEL_KEY) : null;
      this.setLevel(saved === "off" || saved === "quiet" ? saved : "live");
    },

    setLevel: function (lv) {
      if (!this.cv) return;
      this.level = lv;
      this.on = lv !== "off" && !reduced() && !suppressed();
      this.cv.classList.toggle("off", !this.on);
      var breath = q("#sbBreath");
      if (breath) breath.classList.toggle("off", this.on);
      cancelAnimationFrame(this.raf);
      if (this.on && !this.parked) { this.t0 = now(); this.last = 0; this.loop(); }
      else if (this.on) { this.t0 = now(); this.last = 0; this.parkedAt = now(); }
    },

    resize: function () {
      if (!this.cv) return;
      this.W = window.innerWidth; this.H = window.innerHeight;
      var small = this.W <= 760;
      this.step = small ? 42 : 34;
      var k = small ? .46 : .5;
      this.cw = Math.max(2, Math.round(this.W * k));
      this.ch = Math.max(2, Math.round(this.H * k));
      this.cv.width = this.cw; this.cv.height = this.ch;
      this.pw = small ? 118 : 248;
      this.ph = Math.max(2, Math.round(this.pw * this.H / this.W));
      this.off.width = this.pw; this.off.height = this.ph;
      this.img = this.ocx.createImageData(this.pw, this.ph);
      this.buf = new Uint32Array(this.img.data.buffer);
      this.cx.imageSmoothingEnabled = true;
      this.cx.imageSmoothingQuality = "high";
    },

    /* The desktop's furniture is lit by the wallpaper, not by a palette of
       its own: the mood's own colours are published as custom properties and
       anything sitting on the desktop — a note, for now — reads them. Change
       the mood and the light on every note changes with it, because it is
       the same light. */
    publishLight: function (p) {
      var st = doc.documentElement.style;
      st.setProperty("--wp-light", "rgb(" + p[0][0] + "," + p[0][1] + "," + p[0][2] + ")");
      st.setProperty("--wp-light-rgb", p[0][0] + "," + p[0][1] + "," + p[0][2]);
      st.setProperty("--wp-light-2", "rgb(" + p[2][0] + "," + p[2][1] + "," + p[2][2] + ")");
      st.setProperty("--wp-light-2-rgb", p[2][0] + "," + p[2][1] + "," + p[2][2]);
    },

    applyMood: function (mood) {
      var p = MOOD_PALETTE[mood] || MOOD_PALETTE.studio;
      this.publishLight(p);
      if (!this.pal || p === this.palTo) { this.palTo = p; return; }
      this.palTo = p;
      /* Nothing is drawing while the wallpaper is parked behind a window, so a
         mood chosen with an app open would sit in palTo and never arrive. Snap
         the colour and paint one frame: the change lands immediately, wherever
         the visitor happens to be standing. */
      if (!this.on || this.parked) {
        for (var i = 0; i < this.pal.length; i++)
          for (var k = 0; k < 3; k++) this.pal[i][k] = p[i][k];
        if (this.on) { this.last = 0; this.draw(now()); }
      }
    },

    pulse: function () { this.charge = Math.min(1, this.charge + .13); this.typing = now(); },

    loop: function () {
      var self = this;
      this.raf = requestAnimationFrame(function (ts) { self.loop(); self.draw(ts); });
    },

    /* park / unpark, driven by whether any window is on screen */
    parked: false,
    parkedAt: 0,
    park: function (yes) {
      yes = !!yes;
      if (yes === this.parked) return;
      this.parked = yes;
      doc.documentElement.classList.toggle(PARKED_CLASS, yes);
      if (!this.cv) return;
      if (yes) {
        this.parkedAt = now();
        cancelAnimationFrame(this.raf);
      } else if (this.on) {
        /* give back the time that passed while parked, so the pattern carries
           on from the frame it stopped at instead of jumping forward */
        var slept = now() - this.parkedAt;
        this.t0 += slept;
        this.typing += slept;
        this.last = 0;
        this.loop();
      }
    },

    draw: function (ts) {
      if (!this.on || doc.hidden) return;
      if (ts - this.last < this.step) return;
      var dt = Math.min(120, ts - this.last || this.step);
      this.last = ts;
      var t = (ts - this.t0) / 1000;
      var S_ = this.SIN, K = 325.9493;
      var s = function (a) { return S_[(a * K) & 2047]; };

      var breath = .72 + .28 * s(t * 0.8976);
      var writing = (ts - this.typing) < 4000;
      this.calm += ((writing ? 1 : 0) - this.calm) * Math.min(1, dt / 620);
      this.charge *= Math.pow(.975, dt / 40);
      var quiet = this.level === "quiet";
      var gain = (quiet ? .42 : 1) * (1 - this.calm * .55) * breath;
      var warm = this.charge;

      for (var i = 0; i < this.pal.length; i++)
        for (var k = 0; k < 3; k++)
          this.pal[i][k] += (this.palTo[i][k] - this.pal[i][k]) * Math.min(1, dt / 1600);

      /* refraction waves live 2.4 seconds */
      for (var wi = this.waves.length - 1; wi >= 0; wi--) {
        this.waves[wi].t += dt / 1000;
        if (this.waves[wi].t > 2.4) this.waves.splice(wi, 1);
      }

      /* ── plasma: the present plus its own past, offset by 1.988 ── */
      var pw = this.pw, ph = this.ph, buf = this.buf;
      var c0 = this.pal[0], c2 = this.pal[2];
      var cxp = (.5 + this.tiltX * .16) * pw, cyp = (.42 + this.tiltY * .14) * ph;
      var amp = (quiet ? .5 : 1) * gain;
      var DR = 1.988;
      var nw = this.waves.length;
      var wx0 = new Float32Array(nw), wy0 = new Float32Array(nw), wa = new Float32Array(nw);
      for (var q0 = 0; q0 < nw; q0++) {
        var w0 = this.waves[q0];
        wx0[q0] = w0.x * pw; wy0[q0] = w0.y * ph;
        var e0 = w0.t / 2.4;
        wa[q0] = (1 - e0) * (1 - e0) * 26;      /* bend strength, fading quadratically */
      }
      var idx = 0;
      for (var y = 0; y < ph; y++) {
        for (var x = 0; x < pw; x++) {
          /* refraction phase from taps — bend the coordinates, draw no lines */
          var bend = 0, comp = 0;
          for (var wj = 0; wj < nw; wj++) {
            var ddx = x - wx0[wj], ddy = y - wy0[wj];
            var d = Math.sqrt(ddx * ddx + ddy * ddy);
            var w = this.waves[wj];
            var front = d * 0.155 - w.t * 5.0;
            if (front > -4.6 && front < 4.6) {
              var fall = 1 / (1 + d * 0.028);
              var sh = s(front * 0.62);
              bend += sh * wa[wj] * fall;
              /* compressing the front raises brightness — a lens does this */
              comp += (1 - Math.abs(front) / 4.6) * fall * (1 - w.t / 2.4);
            }
          }
          var wx = x + s(y * 0.031 + t * 0.13) * 7.5 + bend;
          var wy = y + s(x * 0.028 - t * 0.11) * 7.5 + bend * 0.6;
          var dx = wx - cxp, dy = wy - cyp;
          var v = s(wx * 0.0295 + t * 0.207)
            + s(wy * 0.0231 - t * 0.163)
            + s((wx + wy) * 0.0182 + t * 0.121)
            + s((dx * dx + dy * dy) * 0.00055 - t * 0.281);
          /* the same pattern, shifted in time and space by 1.988 */
          var ex = wx + DR, ey = wy + DR, tt = t - DR;
          var edx = ex - cxp, edy = ey - cyp;
          var v2 = s(ex * 0.0295 + tt * 0.207)
            + s(ey * 0.0231 - tt * 0.163)
            + s((ex + ey) * 0.0182 + tt * 0.121)
            + s((edx * edx + edy * edy) * 0.00055 - tt * 0.281);
          var n = ((v * 0.70 + v2 * 0.30) + 4) * 0.125;
          n = n * n; n = n * n; n = n * n * n;      /* ^12 — narrow ribbons on dark */
          if (comp > 0) n += comp * comp * 0.10;
          var qq = n * amp * 7.4;
          var w2 = s(wy * 0.019 + t * 0.09) * .5 + .5;
          var r = (c0[0] * (1 - w2) + c2[0] * w2) * qq + 190 * n * warm * amp * 0.7;
          var g = (c0[1] * (1 - w2) + c2[1] * w2) * qq + 140 * n * warm * amp * 0.5;
          var b = (c0[2] * (1 - w2) + c2[2] * w2) * qq + 95 * n * warm * amp * 0.3;
          r = r < 0 ? 0 : r > 255 ? 255 : r; g = g < 0 ? 0 : g > 255 ? 255 : g; b = b < 0 ? 0 : b > 255 ? 255 : b;
          buf[idx++] = (255 << 24) | (b << 16) | (g << 8) | r;
        }
      }
      this.ocx.putImageData(this.img, 0, 0);
      var cx = this.cx, W = this.cw, H = this.ch;
      cx.globalCompositeOperation = "source-over";
      cx.fillStyle = "#070a14";
      cx.fillRect(0, 0, W, H);
      cx.globalCompositeOperation = "lighter";
      cx.drawImage(this.off, 0, 0, pw, ph, 0, 0, W, H);

      /* ── bodies of light ── */
      var glow = (quiet ? .022 : .052) * gain + warm * .045 * gain;
      for (var bi = 0; bi < this.blobs.length; bi++) {
        var bb = this.blobs[bi], cc = this.pal[bi % this.pal.length];
        var bx = (bb.px + s(t / bb.sx + bb.ph) * bb.ax + this.tiltX * .05) * W;
        var by = (bb.py + s(t / bb.sy + bb.ph * 1.7) * bb.ay + this.tiltY * .05) * H;
        var br = Math.max(W, H) * bb.r * (1 + s(t / 31 + bb.ph) * .12);
        var ba = glow * (.7 + s(t / 23 + bb.ph * 2) * .3);
        var bg = cx.createRadialGradient(bx, by, 0, bx, by, br);
        bg.addColorStop(0, "rgba(" + (cc[0] | 0) + "," + (cc[1] | 0) + "," + (cc[2] | 0) + "," + ba.toFixed(4) + ")");
        bg.addColorStop(.5, "rgba(" + (cc[0] | 0) + "," + (cc[1] | 0) + "," + (cc[2] | 0) + "," + (ba * .3).toFixed(4) + ")");
        bg.addColorStop(1, "rgba(0,0,0,0)");
        cx.fillStyle = bg;
        cx.fillRect(0, 0, W, H);
      }

      /* ── the read head ── */
      var headN = ((t / 46) % 1.34 - .17);
      this.head = headN;
      var sy = headN * H, band = H * .24;
      var sg = cx.createLinearGradient(0, sy - band, 0, sy + band);
      var sa = (0.055 + warm * .05) * gain;
      sg.addColorStop(0, "rgba(143,168,242,0)");
      sg.addColorStop(.5, "rgba(143,168,242," + sa.toFixed(4) + ")");
      sg.addColorStop(1, "rgba(143,168,242,0)");
      cx.fillStyle = sg;
      cx.fillRect(0, Math.max(0, sy - band), W, band * 2);
      cx.globalCompositeOperation = "source-over";
    }
  };

  function now() {
    return (window.performance && window.performance.now) ? window.performance.now() : Date.now();
  }

  /* ------------------------------------------------------------- public API */

  window.sbField = {
    init: function () { Field.init(); },
    level: function () { return Field.level; },
    setLevel: function (lv) {
      if (lv !== "live" && lv !== "quiet" && lv !== "off") lv = "live";
      Field.setLevel(lv);
      if (window.sbDB) window.sbDB.set(LEVEL_KEY, lv);
      return lv;
    },
    /* Re-evaluate against the current reduced-motion state. PC Studio latches
       that once at load; here the toggle is in the Control Center, so it has
       to take effect without a reload. */
    refresh: function () { if (Field.cv) Field.setLevel(Field.level); },
    mood: function (id) { Field.applyMood(id); },
    pulse: function () { Field.pulse(); },
    running: function () { return !!Field.cv && Field.on && !Field.parked; },
    parked: function () { return Field.parked; }
  };

  /* Any window on screen — open, not minimised — parks the wallpaper. */
  function occluded() {
    var wins = doc.querySelectorAll("#windowLayer .window");
    for (var i = 0; i < wins.length; i++) {
      if (!wins[i].classList.contains("minimized")) return true;
    }
    return false;
  }

  function syncPark() { Field.park(occluded()); }

  function start() {
    Field.init();
    if (window.sbBus && window.sbBus.on) {
      window.sbBus.on("mood:change", function (p) { Field.applyMood(p && p.id); });
    }
    /* Reduce Motion writes data-motion on <html>; the theme writes data-theme;
       incognito adds a class. Watching the attributes means every path that
       sets one of them — Control Center, the Settings pane, the restore on
       boot — reaches the field, and none of them has to know it exists. */
    if (window.MutationObserver) {
      var root = doc.documentElement;
      /* Only these three matter. The class check is deliberately narrow: the
         field parks itself by adding a class to the same element, and reading
         the whole className here would make it answer its own footsteps. */
      var stamp = function () {
        return root.getAttribute("data-motion") + "|" + root.getAttribute("data-theme") +
          "|" + (root.classList.contains("sb-incognito") ? 1 : 0);
      };
      var seen = stamp();
      new MutationObserver(function () {
        var next = stamp();
        if (next === seen) return;
        seen = next;
        window.sbField.refresh();
      }).observe(root, { attributes: true, attributeFilter: ["data-motion", "data-theme", "class"] });
    }

    /* Watching the window layer rather than listening for open/close events
       means minimise, restore and any future path all reach the field, and
       the shell keeps not having to know the field exists. */
    var layer = doc.getElementById("windowLayer");
    if (layer && window.MutationObserver) {
      new MutationObserver(syncPark).observe(layer, {
        childList: true, subtree: true, attributes: true, attributeFilter: ["class"]
      });
    }
    syncPark();
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", start);
  else start();
})();
