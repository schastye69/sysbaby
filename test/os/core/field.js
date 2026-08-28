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
  /* ── КАСАНИЕ ПО МЕБЕЛИ — НЕ КАСАНИЕ ПО СТОЛУ (v64) ───────────────────────
     ПОВОД, дословно от основателя 25.08.2026: «при нажатии, закрыть,
     свернуть или развернуть в окнах, срабатывает касание по фону рабочего
     стола, хотя я нажимаю по этим кнопкам в окнах».

     Поле слушает pointerdown на окне браузера — то есть все нажатия подряд.
     Куда именно ткнули, оно не спрашивало никогда: сторож стоял один и о
     другом — «живо ли поле». Поэтому огонь окна, док, полоса и панель
     записывались столу как его собственное касание.

     Это третий дефект одного рода (D-079, D-089 — и вот этот), и первые два
     чинились добавлением ещё одного условия «когда НЕ считать». Третий раз
     подряд означает, что ошибкой был сам список. Признак взят
     ПОЛОЖИТЕЛЬНЫЙ: касание принадлежит полю тогда и только тогда, когда
     палец опустился на сам стол — на обои или на пустое место слоёв,
     лежащих поверх них. Всё прочее — мебель.

     Такой признак не нужно дополнять. Предмет, который система заведёт
     завтра, по умолчанию окажется мебелью, а не столом; новый предмет, о
     котором забыли, лучше пусть молчит, чем говорит от чужого имени.

     Охраняется tools/tap-belongs-check.mjs. */
  var DESK_IDS = { desktop: 1, sbIconLayer: 1, sbNoteLayer: 1, sbWidgetLayer: 1 };
  function ownTap(t) {
    if (!t || t.nodeType !== 1 || !t.closest) return false;
    if (DESK_IDS[t.id]) return true;
    return !!t.closest(".wp-layer");
  }

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
  /* Такт покоя: 80 мс, то есть 12.5 кадра в секунду. Число не выбрано, а
     измерено — обоснование целиком в draw(), где оно применяется. */
  var IDLE_STEP = 80;

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
    raf: 0, last: 0, t0: 0, offAt: 0, step: 40, level: "live", on: true,
    /* typing starts far in the past, not at 0: at 0 the first four seconds
       after load would read as "someone is writing" and the field would open
       dimmed. Nothing calls pulse() by default, so it stays that way. */
    charge: 0, calm: 0, typing: -1e9, tiltX: 0, tiltY: 0, head: 0,
    pal: null, palTo: null, blobs: [], waves: [], seed: 22222219,
    SIN: null,
    /* Два счётчика РАБОТЫ, а не событий: растут только тогда, когда поле
       действительно что-то сделало — записало касание, пересобрало буферы.
       Наружу их отдаёт sbField, там же, где running/parked/tier: «поле
       стоит» — это утверждение, и его надо чем-то мерить. Без них
       единственным прибором был глазомер. */
    touchCount: 0, resizeCount: 0, drawCount: 0, pendingResize: false,
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
      /* Пересборка буферов ОТКЛАДЫВАЕТСЯ, пока поле накрыто окном.
         Повод (21.08.2026): на телефоне resize сыплется пачками — адресная
         строка уезжает при каждой прокрутке, клавиатура открывается и
         закрывается. Каждый всплеск заново считал ступень качества и
         пересобирал буферы поля, которого в этот момент не видно вовсе.
         Пропущенное не теряется: park() догонит один раз при пробуждении —
         одна пересборка вместо всей пачки. */
      window.addEventListener("resize", function () {
        if (self.parked) { self.pendingResize = true; return; }
        self.resize();
      });
      /* a touch bends the light — no new line appears on the screen.
         НО ТОЛЬКО ПОКА ПОЛЕ ВИДНО. Повод, дословно от основателя: «он
         работает на заднем фоне и копит касания». Слушатель висел на window
         безусловно, и восемь тапов ВНУТРИ окна приложения — по кнопкам, по
         полям ввода — все восемь записывались как касания стола: волна в
         очередь и +0.3 к заряду. Очередь обрезана тремя, заряд копился до
         единицы, и в миг закрытия окна всё накопленное выплёскивалось —
         человек получал рябь от нажатий, которых столу не адресовал. На
         телефоне окно во весь экран, там КАЖДОЕ касание чужое. */
      window.addEventListener("pointerdown", function (e) {
        /* ДВА СПОСОБА НЕ БЫТЬ ЖИВЫМ, А СТОРОЖ БЫЛ НА ОДНОМ (v53).
           Повод, от основателя 21.08.2026: «когда работает турбо режим он
           накапливает в себе нажатия по рабочему столу и когда переключатель
           на обычный режим все эти нажатия производятся».

           Это тот же дефект, что чинили позавчера (D-079), и не пойманный до
           конца мною же. Тогда сторож встал на parked — «накрыто окном». Но
           поле гаснет и вторым путём: on=false. Так его гасят ТУРБО
           (setLevel «off»), приглушённое движение, светлая тема и инкогнито.
           Во всех четырёх случаях касания продолжали записываться: волна в
           очередь, +0.3 к заряду. Заряд копится до единицы — и в миг, когда
           поле возвращают, всё накопленное играет разом.

           Правильный признак не «накрыто» и не «выключено», а ЖИВО ЛИ ПОЛЕ
           ВООБЩЕ. Один сторож на оба пути: он же закрывает и те два, о
           которых основатель не говорил. */
        if (self.parked || !self.on) return;
        if (!ownTap(e.target)) return;
        self.touchCount++;
        self.waves.push({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight, t: 0 });
        if (self.waves.length > 3) self.waves.shift();
        self.charge = Math.min(1, self.charge + .3);
        /* Такт покоя растянут до 80 мс; без этой строки палец ждал бы
           следующего тика до восьмидесяти миллисекунд, и рябь запаздывала
           бы за касанием. Ноль здесь значит «рисуй на ближайшем кадре». */
        self.last = 0;
      }, { passive: true });
      /* No deviceorientation listener. The reference parallaxes the field
         from the phone's tilt; here the wallpaper holds still whichever way
         the device is turned. tiltX/tiltY stay 0 and the maths is unchanged. */
      this.resize();
      this.applyMood(window.sbGetWallpaperMood ? window.sbGetWallpaperMood() : "studio");
      var saved = window.sbDB ? window.sbDB.get(LEVEL_KEY) : null;
      this.setLevel(saved === "off" || saved === "quiet" ? saved : "live");
    },

    /* ── ПОГАСШЕЕ ПОЛЕ НЕ ПЕРЕМАТЫВАЕТСЯ В НАЧАЛО (v57) ────────────────────
       ПОВОД, от основателя 24.08.2026, со снимками: «в турбо режиме по
       прежнему копяться нажатия и когда из него выходишь, они все разом
       выстреливают». На втором снимке — огромная вспышка света поверх
       значков в миг выхода из турбо.

       ЧТО ПРОВЕРИЛИ ПЕРВЫМ ДЕЛОМ И ЧЕГО НЕ НАШЛИ. Накопления нажатий нет:
       сторож из v53 (D-088) держит. Воспроизведено — включить турбо,
       десять раз постучать по столу, выключить: счётчик касаний поля
       остался нулевым, очередь волн пуста. То есть жалоба верна, а
       названная в ней причина — нет.

       ЧТО НАШЛОСЬ НА САМОМ ДЕЛЕ. Вспышка — не пачка нажатий, а ОДИН
       ПРЫЖОК всего рисунка разом. Эта строка ставила t0 = now() при каждом
       возврате уровня, то есть выбрасывала накопленное время поля и
       начинала узор заново. Светящиеся тела при t = 0 стоят в исходных
       фазах и сходятся в одно яркое пятно — его и видно на снимке.

       ИЗМЕРЕНО, а не выведено из чтения кода. Расстояние картинки до
       эталона «поле в самую первую секунду», в уровнях из 255:
           кадр перед входом в турбо  → 19.3
           кадр сразу после выхода    → 6.72
       То есть выход из турбо возвращает обои почти ровно в начало. И
       разница за пять секунд турбо (16.47) в полтора раза больше, чем за
       те же пять секунд обычного хода (10.91), — при одинаково прошедшем
       времени.

       ПОЧЕМУ ЭТО НЕ БЫЛО ЗАМЕЧЕНО РАНЬШЕ. У поля ДВА способа замолчать, и
       время возвращал только один. park() — «накрыто окном» — честно
       считает сон и отдаёт его обратно (t0 += slept), и рядом с ним об
       этом написан комментарий. setLevel() — «погашено уровнем» — сон не
       считал вовсе. Тот же перекос, что и в D-088: сторож стоял на одном
       из двух путей. Теперь оба пути ведут себя одинаково.

       Двойного счёта нет: при возврате уровня parkedAt ставится заново,
       поэтому park() потом отмеряет сон от этого мига, а не от прошлого. */
    setLevel: function (lv) {
      if (!this.cv) return;
      var was = this.level;
      var wasOn = this.on;
      this.level = lv;
      this.on = lv !== "off" && !reduced() && !suppressed();
      this.cv.classList.toggle("off", !this.on);
      /* «Тихо» теперь меняет размер буфера и такт, а не только яркость —
         значит смена уровня обязана пересобрать буферы. Раньше resize здесь
         не звался, потому что менять было нечего. */
      if (was !== lv) { this.costI = 0; this.resize(); }
      var breath = q("#sbBreath");
      if (breath) breath.classList.toggle("off", this.on);
      cancelAnimationFrame(this.raf);

      if (!this.t0) this.t0 = now();                    /* самый первый запуск */
      else if (!this.on && wasOn) this.offAt = now();   /* гаснет: запомнили миг */
      else if (this.on && !wasOn && this.offAt) {       /* вернулось: отдаём время */
        var slept = now() - this.offAt;
        this.t0 += slept;
        this.typing += slept;
        this.offAt = 0;
      }
      this.last = 0;
      if (this.on && !this.parked) this.loop();
      else if (this.on) this.parkedAt = now();
    },

    resize: function () {
      if (!this.cv) return;
      this.resizeCount++;
      this.W = window.innerWidth; this.H = window.innerHeight;
      var small = this.W <= 760;

      /* Ступень качества. Одно число управляет и разрешением, и частотой.
         ---------------------------------------------------------------------
         12.08, замер. «Тихо» раньше умножало только яркость: 82,9 % занятости
         главного потока против 83,9 % у «живо» — то есть настройка убавляла
         картинку и не убавляла работу. Это неверное обещание в интерфейсе, а
         не оптимизация.

           ступень 0 — полное: буфер 168/248, свой такт
           ступень 1 — вдвое реже: та же картинка, кадр через один
           ступень 2 — грубее и реже: буфер 120/176 плюс половинный такт

         Ступень 2 — это то, чем «тихо» обязано быть, и то, куда система
         уходит сама, если устройство не тянет. Картинка на ней остаётся той
         же картиной: плазма низкочастотная, и её мягкости лишний раз не
         повредит — ломается не облик, а стоимость. */
      var tier = this.tierNow();
      this.step = (small ? 42 : 34) * (tier >= 1 ? 2 : 1);

      /* Одно увеличение вместо двух.
         ---------------------------------------------------------------------
         12.08, поле: на телефоне обои показывали регулярные КЛЕТКИ, на планшете
         — просто зернистость. Разгадка в цепочке масштабирований.

         Картина считается в буфере 118 px шириной (pw), потом рисовалась на
         канвас шириной W*0.46 ≈ 179 CSS-px, а канвас растягивался стилями до
         390 CSS-px и до 1072 физических при плотности 2,75. Итого 118 → 1072,
         девятикратное увеличение, и оно шло В ДВА ЭТАПА. Первый квантовал
         картину в сетку 179, второй растягивал эту сетку ещё в шесть раз — и
         решётка становилась видимой. На планшете буфер вдвое крупнее (248), а
         плотность ниже, поэтому там та же решётка читается как зерно.

         Здесь канвас перестаёт быть промежуточной ступенью: его собственный
         размер равен размеру буфера, и увеличение остаётся ровно одно —
         плавное, браузерное, от источника сразу к экрану. Это ещё и дешевле:
         заливать и композитить приходится меньше пикселей. */
      /* Разрешение источника поднято на телефоне: 118 было выбрано под
         процессор, но при девятикратном увеличении оно давало слишком крупную
         ячейку. 168 стоит примерно вдвое дороже за кадр и остаётся дешёвым,
         а видимая ячейка уменьшается почти в полтора раза. */
      this.pw = Math.round((small ? 168 : 248) * (tier >= 2 ? 0.715 : 1));
      this.ph = Math.max(2, Math.round(this.pw * this.H / this.W));
      this.off.width = this.pw; this.off.height = this.ph;
      this.cw = this.pw; this.ch = this.ph;
      this.cv.width = this.cw; this.cv.height = this.ch;
      this.img = this.ocx.createImageData(this.pw, this.ph);
      this.buf = new Uint32Array(this.img.data.buffer);

      /* Строчные черновики для тел света. Выделяются здесь и живут до
         следующего изменения размера — в кадре не создаётся ни одного
         объекта. Длина по числу пятен: в строке активных всегда не больше. */
      var nb0 = this.blobs.length;
      this.rIR = new Float32Array(nb0); this.rQ0 = new Float32Array(nb0);
      this.cx.imageSmoothingEnabled = true;
      this.cx.imageSmoothingQuality = "high";
    },

    /* The desktop's furniture is lit by the wallpaper, not by a palette of
       its own: the mood's own colours are published as custom properties and
       anything sitting on the desktop — a note, for now — reads them. Change
       the mood and the light on every note changes with it, because it is
       the same light. */
    /* ── ПИШЕТСЯ ТОЛЬКО ИЗМЕНИВШЕЕСЯ (D-159, урок D-143) ────────────────
       Раньше сюда приходили при СМЕНЕ настроения — то есть по нажатию
       человека, изредка. С D-159 живая комната зовёт это на каждом шаге шва,
       и четыре записи в корень стали регулярным расходом: каждая объявляет
       устаревшим стиль ВСЕГО документа (D-093, D-112). Соседний закон поймал
       это в тот же прогон — «свойство не пишется тем значением, которое уже
       стоит», четыре штуки. Спрашиваем у корня, что там сейчас, и пишем
       только новое: ровно тот же приём, что у света часов. */
    publishLight: function (p) {
      var st = doc.documentElement.style;
      var put = function (key, value) {
        if (st.getPropertyValue(key) === value) return;
        st.setProperty(key, value);
      };
      put("--wp-light", "rgb(" + p[0][0] + "," + p[0][1] + "," + p[0][2] + ")");
      put("--wp-light-rgb", p[0][0] + "," + p[0][1] + "," + p[0][2]);
      put("--wp-light-2", "rgb(" + p[2][0] + "," + p[2][1] + "," + p[2][2] + ")");
      put("--wp-light-2-rgb", p[2][0] + "," + p[2][1] + "," + p[2][2]);
    },

    applyMood: function (mood) {
      /* ── ЖИВЫЕ КОМНАТЫ КРАСЯТ ФОН СВОИМ СВЕТОМ (D-159) ─────────────────
         Таблица ниже знает пять неподвижных комнат. Живые (суточная,
         светотерапия, праздник) в ней не значатся, и неизвестное имя молча
         падало на studio — фон оставался графитовым и не менялся НИКОГДА.
         Основатель: «в feast не меняется цвет анимации фона рабочего стола, а
         должен». Дописывать в таблицу ещё три строки значило бы повторить ту
         же ошибку в четвёртый раз: список жил бы отдельно от объявления
         комнат. Поэтому у живых комнат палитра СПРАШИВАЕТСЯ у света. */
      /* ── ПЯТЫЙ РАЗ ТОЙ ЖЕ ОШИБКИ, И ПОСЛЕДНИЙ (D-191) ──────────────────
         Строчкой ниже стояло `MOOD_PALETTE[mood] || MOOD_PALETTE.studio`: имя,
         которого нет в таблице, молча падало на Студию. Комментарий выше сам
         предупреждал, что дописывать строки в таблицу — значит повторять
         ошибку; но падение на Студию осталось, и первая же НОВАЯ НЕПОДВИЖНАЯ
         комната (Угли, D-187) получила чужой фон. Закон room-and-seam поймал
         это словами «совпали со Студией: ember».
         Порядок теперь такой и другого не будет: сперва РУЧНАЯ настройка, если
         она для этой комнаты есть; иначе — СПРОСИТЬ У СВЕТА самой комнаты; и
         только если нет ни того, ни другого, — Студия. Новая комната больше
         никогда не окажется чужого цвета из-за того, что её забыли вписать. */
      var p = MOOD_PALETTE[mood] || null;
      if (!p && typeof window.sbRoomPalette === "function") {
        try { p = window.sbRoomPalette(mood); } catch (err) { p = null; }
      }
      if (!p) p = MOOD_PALETTE.studio;
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

    /* last = 0 по той же причине, что и в pointerdown: пульс приходит от
       набора текста, и поле обязано отозваться на ближайшем кадре, а не
       через такт покоя. */
    pulse: function () { this.charge = Math.min(1, this.charge + .13); this.typing = now(); this.last = 0; },

    /* ------------------------------------------------------- ступень качества */
    /* Ступень — это максимум из двух: того, что попросил человек («тихо»), и
       того, что вынудило железо. Просьба никогда не отменяется автоматикой,
       а автоматика никогда не поднимает качество выше просьбы. */
    tier: 0,                    /* что вынудило железо */
    tierAt: 0,                  /* когда в последний раз меняли */
    cost: null,                 /* кольцо последних длительностей отрисовки */
    costI: 0,
    tierNow: function () {
      var t = this.tier;
      if (this.level === "quiet" && t < 2) t = 2;
      return t;
    },

    /* Наблюдение за собственной стоимостью.
       -------------------------------------------------------------------------
       Прибор дешёвый: две отметки времени на отрисовку и кольцо на 32 записи.
       Решение принимается по МЕДИАНЕ, а не по среднему: один длинный кадр от
       чужой вкладки не должен ронять качество на весь сеанс.

       Пороги разведены нарочно широко — 11 мс вниз, 4,5 мс вверх, — чтобы
       система не металась между ступенями у самой границы. Вниз можно не чаще
       раза в 4 секунды, вверх — раза в 20: возвращать качество надо неохотно,
       потому что ошибка вверх снова уронит частоту кадров, а ошибка вниз
       стоит человеку только чуть более мягкой картинки. */
    note: function (ms) {
      if (!this.cost) { this.cost = new Float32Array(32); this.costI = -32; }
      this.cost[((this.costI++) % 32 + 32) % 32] = ms;
      if (this.costI < 32) return;                     /* кольцо ещё не полное */
      var t = now();
      if (t - this.tierAt < 4000) return;
      var s = Array.prototype.slice.call(this.cost).sort(function (a, b) { return a - b; });
      var med = s[16];
      if (med > 11 && this.tier < 2) { this.tier++; this.tierAt = t; this.costI = 0; this.resize(); return; }
      if (med < 4.5 && this.tier > 0 && t - this.tierAt > 20000) {
        this.tier--; this.tierAt = t; this.costI = 0; this.resize();
      }
    },

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
      } else {
        /* Размер, изменившийся во сне, догоняется ЗДЕСЬ и один раз — вместо
           всей пачки resize, которую телефон высыпал, пока поле было
           накрыто. Пробуждение — единственное место, где пересборка снова
           имеет смысл: до него её результата никто не видел. */
        /* ── ПУСТОЙ КАДР ПОСЛЕ ПРОБУЖДЕНИЯ (v59) ─────────────────────────
           ПОВОД, от основателя 24.08.2026: «и когда закрываешь окна, фон тоже
           иногда моргает».

           «Иногда» — это ключ. Пересборка буфера ОЧИЩАЕТ канвас, а сюда она
           попадает только тогда, когда экран менялся, пока поле спало. На
           телефоне так делает сама адресная строка браузера, когда прячется
           и показывается, — отсюда и «иногда».

           Между очисткой и первой отрисовкой оставался ровно один кадр, и в
           нём обои были пусты. Воспроизведено и измерено: закрыть накрывшее
           окно после изменения экрана во сне — один кадр яркости 0 среди
           кадров по 18.6.

           Лечится тем же приёмом, что уже применён при смене настроения
           обоев строкой выше по файлу: нарисовать СРАЗУ, в этой же задаче, а
           не ждать ближайшего кадра. Показывать нечего ровно ноль кадров. */
        if (this.pendingResize) {
          this.pendingResize = false;
          this.resize();
          if (this.on) { this.last = 0; this.draw(now()); }
        }
        if (this.on) {
          /* give back the time that passed while parked, so the pattern carries
             on from the frame it stopped at instead of jumping forward */
          var slept = now() - this.parkedAt;
          this.t0 += slept;
          this.typing += slept;
          this.last = 0;
          this.loop();
        }
      }
    },

    draw: function (ts) {
      if (!this.on || doc.hidden) return;
      /* Пока по полю идёт волна от касания, такт не режется. Плазма дрейфует
         так медленно, что двенадцать кадров в секунду читаются как спокойное
         движение; рябь от пальца живёт 2,4 секунды и на таком такте стала бы
         ступенчатой. Это единственное быстрое движение в обоях — ему отдаётся
         полный такт, остальному хватает урезанного. */
      /* ── ТАКТ ПОКОЯ (v55) ─────────────────────────────────────────────
         ПОВОД: директива основателя о производительности. Обсерватория
         показала вычитанием, что на ПУСТОМ столе поле — 94 из каждых 95
         миллисекунд всей работы системы: 239.97 мс скрипта за три секунды
         против 2.55 мс с погашенным полем. Профиль назвал виновника точно:
         draw 233 мс + s 60 мс + обёртка rAF 27 мс за пять секунд, то есть
         6.3% главного потока в состоянии, где не происходит ничего.

         ЧТО ЗДЕСЬ НЕ СДЕЛАНО. Поле не погашено, не упрощено и не лишено ни
         одного эффекта. Изменён только ТАКТ — и только когда на столе
         ничего не происходит.

         ПОЧЕМУ ИМЕННО 80 мс, А НЕ «на глаз». Рисунок — функция времени,
         значит разница между двумя кадрами зависит только от промежутка.
         Измерено на живом поле, 46 снимков канваса, все пары до 220 мс:

             промежуток   средняя разница на пиксель (из 255)
                20 мс     0.578      ← пол случайного дизера
                40 мс     0.582
                60 мс     0.588
                80 мс     0.591      ← всё ещё пол
               100 мс     0.905
               120 мс     1.214      ← вдвое выше пола, шаг становится виден

         До 80 мс картинка не меняется НИЧЕМ, кроме собственного дизера поля.
         Дрейф начинает читаться после сотни. Отсюда и порог: 80 мс — это
         12.5 кадра в секунду, и ровно столько же названо в комментарии
         выше, написанном задолго до этой мерки и с другой стороны: «плазма
         дрейфует так медленно, что двенадцать кадров в секунду читаются как
         спокойное движение». Два независимых пути к одному числу.

         ЧТО СЧИТАЕТСЯ ПОКОЕМ. Ни одной живой волны от касания, заряд угас,
         и последние четыре секунды никто не печатал. Любое из трёх —
         и такт мгновенно полный: за это отвечает last = 0 в pointerdown и
         в pulse(), иначе первое касание ждало бы до 80 мс и палец это
         почувствовал бы. */
      var idleNow = !this.waves.length && this.charge < .02 && (ts - this.typing) >= 4000;
      var stepNow = this.waves.length ? Math.min(this.step, 42)
        : (idleNow ? (this.step > IDLE_STEP ? this.step : IDLE_STEP) : this.step);
      if (ts - this.last < stepNow) return;
      this.drawCount++;               /* наружу через work(): по нему закон считает такт */
      var t_in = now();                       /* прибор адаптации, см. note() */
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
      /* ── тела света и читающая головка: считаются ЗДЕСЬ, а не рисуются
         градиентами поверх канваса.
         ---------------------------------------------------------------------
         12.08, поле. Клетки на телефоне давал не шум и не плазма, а именно
         градиенты. Chrome (Skia) дизерит любой градиент упорядоченной матрицей,
         чтобы на плавном переходе не было полос. На канвасе шириной 168 px
         матрица — это ±0,5 уровня с шагом в два пикселя; канвас растягивается
         стилями в 6,4 раза, и шаг превращается в 12,7 физического пикселя.
         Ровно такая клетка и была видна. Доказано вычитанием: если убрать
         пятна и головку, оставив голую плазму, период падает с 12,69 до
         шумового пола, а амплитуда — с 0,489 до 0,428 без периодичности.

         Здесь они складываются в тот же буфер, в котором считается плазма,
         во float, и квантуются один раз вместе с ней. Дизерить нечего, потому
         что градиента как объекта Skia больше нет. Это ещё и дешевле: было
         четыре заливки всего канваса за кадр, стало ноль.

         Спад пятна: исходные стопы 1 / 0,3 / 0 при u = 0 / 0,5 / 1. Функция
         (1−q)^4, где q = d²/r², даёт 1 / 0,316 / 0 — совпадает в пределах
         сотой и не требует квадратного корня. */
      var glow = (quiet ? .022 : .052) * gain + warm * .045 * gain;
      var nb = this.blobs.length;
      var bX = new Float32Array(nb), bY = new Float32Array(nb),
          bR2 = new Float32Array(nb), bA = new Float32Array(nb),
          bCr = new Float32Array(nb), bCg = new Float32Array(nb), bCb = new Float32Array(nb);
      for (var bi = 0; bi < nb; bi++) {
        var bb = this.blobs[bi], cc = this.pal[bi % this.pal.length];
        bX[bi] = (bb.px + s(t / bb.sx + bb.ph) * bb.ax + this.tiltX * .05) * pw;
        bY[bi] = (bb.py + s(t / bb.sy + bb.ph * 1.7) * bb.ay + this.tiltY * .05) * ph;
        var brr = Math.max(pw, ph) * bb.r * (1 + s(t / 31 + bb.ph) * .12);
        bR2[bi] = brr * brr;
        bA[bi] = glow * (.7 + s(t / 23 + bb.ph * 2) * .3);
        bCr[bi] = cc[0]; bCg[bi] = cc[1]; bCb[bi] = cc[2];
      }
      var headN = ((t / 46) % 1.34 - .17);
      this.head = headN;
      var hy = headN * ph, hBand = ph * .24;
      var hA = (0.055 + warm * .05) * gain;

      /* Мелкий случайный дизер вместо упорядоченного: без него плавный
         градиент, посчитанный во float и обрезанный до 8 бит, даёт полосы.
         Случайный шум их разбивает и, в отличие от матрицы Skia, не имеет
         периода — растягивать в шесть раз можно безнаказанно. */
      var seed = this.seed | 0;

      /* Обратные квадраты радиусов — один раз на кадр вместо деления на пиксель.
         Деление стоит в десятки раз дороже умножения, а раньше их было три на
         каждый пиксель: 183 тысячи делений в кадре. */
      var bIR = this.rIR;
      for (var bk = 0; bk < nb; bk++) bIR[bk] = 1 / bR2[bk];
      var rQ0 = this.rQ0;

      var idx = 0;
      for (var y = 0; y < ph; y++) {
        /* головка зависит только от строки — считается один раз на строку */
        var hd = y - hy, hAbs = hd < 0 ? -hd : hd, hw = 0;
        if (hAbs < hBand) hw = hA * (1 - hAbs / hBand);
        var hR = 143 * hw, hG = 168 * hw, hB = 242 * hw;

        /* Вертикальная часть q² — одна на строку, а не на каждый пиксель.
           Пятну, не дотянувшемуся до строки, кладётся заведомо большое q²:
           тогда общая проверка «q² < 1» отсекает его сама, и лишней ветки
           в горячем цикле не появляется.

           Отдельно проверено и ОТКАЧЕНО: вариант с горизонтальными границами
           отрезка оказался ДОРОЖЕ исходного — 304 мс против 209 за шесть
           секунд. Две проверки на пиксель на пятно и лишние чтения из
           типизированных массивов стоят больше, чем экономит отсечение,
           потому что пятна огромны и покрывают почти всю строку. */
        for (var bi3 = 0; bi3 < nb; bi3++) {
          var dyb = y - bY[bi3], q0 = dyb * dyb * bIR[bi3];
          rQ0[bi3] = q0 < 1 ? q0 : 4;
        }

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

          /* тела света — тот же аддитивный вклад, что давал lighter-градиент.
             Ни одного деления: вертикальная часть q² пришла из строки,
             горизонтальная умножается на готовый обратный квадрат радиуса. */
          for (var bj = 0; bj < nb; bj++) {
            var pdx = x - bX[bj];
            var q2 = rQ0[bj] + pdx * pdx * bIR[bj];
            if (q2 < 1) {
              var fv = 1 - q2; fv = fv * fv; fv = fv * fv * bA[bj];
              r += bCr[bj] * fv; g += bCg[bj] * fv; b += bCb[bj] * fv;
            }
          }
          /* читающая головка — вклад строки, посчитан выше */
          if (hw > 0) { r += hR; g += hG; b += hB; }

          /* дизер: ±0,5 уровня, без периода */
          seed = (seed * 1664525 + 1013904223) | 0;
          var dz = ((seed >>> 16) & 1023) * 0.0009766 - 0.5;
          r += dz; g += dz; b += dz;

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
      cx.globalCompositeOperation = "source-over";
      this.seed = seed;
      /* Ни одного градиента после этой строки. Тела света и читающая головка
         уже в буфере — см. длинный комментарий перед пиксельным циклом. */
      this.note(now() - t_in);
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
    /* Цель по цвету — наружу, чтобы закон мог СПРОСИТЬ, а не угадывать по
       пикселям: «фон следует за комнатой» — это утверждение, и его надо чем-то
       мерить. Тем же рассуждением наружу отданы touchCount и drawCount. */
    palette: function () { return Field.palTo ? Field.palTo.map(function (c) { return c.slice(); }) : null; },
    pulse: function () { Field.pulse(); },
    running: function () { return !!Field.cv && Field.on && !Field.parked; },
    /* Ступень качества наружу — чтобы её можно было проверить законом и
       увидеть в диагностике, а не угадывать по виду. 0 полное · 1 вдвое реже
       · 2 грубее и реже. Второе число — ширина буфера в пикселях. */
    tier: function () { return { tier: Field.tierNow(), forced: Field.tier, buffer: Field.pw, step: Field.step }; },
    parked: function () { return Field.parked; },
    /* Сколько РАБОТЫ поле проделало: записанных касаний и пересборок буфера.
       Закон tools/field-idle-check.mjs держит оба числа неподвижными, пока
       поле накрыто окном. Числа только растут и никогда не сбрасываются —
       сброс дал бы закону способ не заметить работу между двумя замерами. */
    work: function () { return { touches: Field.touchCount, resizes: Field.resizeCount, draws: Field.drawCount }; }
  };

  /* ── ОБОИ ГАСНУТ, ТОЛЬКО ЕСЛИ ИХ НЕ ВИДНО, И ТОЛЬКО ПОСЛЕ ПОЛЁТА (v58) ───
     ПОВОД, дословно от основателя 24.08.2026: «фон должен отключаться только
     тогда, когда окно открыто на весь экран. а ещё фон должен отключаться
     только после того, как страница полностью открылась на весь экран, а не
     по нажатию как сейчас - из-за этого ощущение как-бужто виснит или
     тормозит экран во время открытия приложения. если рабочий фон видно, то
     он не должен отключаться».

     ЧТО БЫЛО. Признак «накрыто» был грубым: ЛЮБОЕ несвёрнутое окно, любого
     размера и в любой момент своего полёта. Отсюда обе беды сразу. На столе
     маленькое окно гасило обои, которые прекрасно видно вокруг него. И
     гасило их В МИГ НАЖАТИЯ — то есть ровно тогда, когда окно летит и каждый
     кадр на счету: park() вешает класс wp-parked на <html>, а класс на корне
     объявляет устаревшим стиль всего документа. Пересчёт всего документа
     посреди анимации открытия и есть то «подвисание», которое видно глазом.

     ЧТО СТАЛО. Два условия вместо одного, оба взяты у самого предмета.

     ПЕРВОЕ: накрыт ли КАНВАС. Сравнивается не с числом и не с размером
     экрана, а с рамкой самих обоев: окно должно накрыть их целиком. Тогда
     «если рабочий фон видно, то он не должен отключаться» становится не
     правилом на словах, а прямым измерением того самого, о чём речь.

     Верхняя кромка берётся не у обоев, а у ПОЛОСЫ: канвас лежит и под ней,
     но полоса — мебель, а не рабочий фон, и сорока четырёх пикселей за
     стеклом человек «рабочим фоном» не зовёт. Проверено измерением, почему
     это важно: развёрнутое на весь экран окно — 1280×756 при канвасе
     1280×800, и без этой поправки не накрывало бы обои НИКОГДА, то есть
     поле не гасло бы вообще ни при каком окне. Кромка читается у самой
     полосы, а не набирается числом 44, — тогда её нельзя разъехаться.

     ВТОРОЕ: окно должно долететь. Летящее окно (opening, traveling) и
     закрывающееся (closing) не считаются накрывшими — они ещё в пути.
     Наблюдатель в start() смотрит за атрибутом class на слое окон, поэтому
     снятие класса opening само вызовет пересчёт, и обои погаснут ровно
     тогда, когда лететь стало нечему. Отдельного таймера не нужно, а значит,
     нечему и разъехаться с настоящей длительностью анимации. */
  function occluded() {
    var cv = Field.cv;
    if (!cv) return false;
    var f = cv.getBoundingClientRect();
    if (!(f.width > 0 && f.height > 0)) return false;
    var tb = doc.getElementById("topbar");
    var deskTop = tb ? tb.getBoundingClientRect().bottom : f.top;
    var wins = doc.querySelectorAll("#windowLayer .window");
    for (var i = 0; i < wins.length; i++) {
      var c = wins[i].classList;
      if (c.contains("minimized") || c.contains("closing")) continue;
      if (c.contains("opening") || c.contains("traveling")) continue;
      var r = wins[i].getBoundingClientRect();
      if (r.left <= f.left + 1 && r.top <= deskTop + 1 &&
          r.right >= f.right - 1 && r.bottom >= f.bottom - 1) return true;
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
