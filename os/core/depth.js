/* sys.baby OS — core/depth.js
 * «ГЛУБИНА» — ВИД ЧЕТЫРЁХ ТЕМ · решение D-1080 (основатель 12.11.2026, показ
 * temy-glubina/sravnenie.html: «глубина» идёт в архив как САМ вид тем, не за
 * переключателем). Пакет GLUBINA. Перенесено из пробного слоя h5-temy (дерево
 * H4a) на H4b; переключателя больше нет — слой живёт всегда, кроме Светлицы
 * (там вид прежний, из core.css); гость видит его так же, как стол (D-1315).
 *
 * Что рисует: почти чёрный пол; свет темы — только большими глубокими формами:
 * дуга горизонта, как край планеты в темноте, и дальнее облако. Затмение —
 * пол этого слоя, а кромку за диском рисует прежний холст #sbEclipse
 * (core/eclipse.js, D-872) — его закон и вид не тронуты; во время шва
 * смены темы холст кромки скрыт и проявляется после шва (без скачка).
 * Тепло — по-настоящему оранжевое (D-1081, основатель: «Мандарин» #ec9455,
 * D-824): атмосфера дуги и облако — свет Мандарина, их сила вдвое–втрое выше,
 * чем у Океана и Авроры, пол — угольно-апельсиновая тьма Мандарина.
 *
 * Шов смены темы (4А): от места касания расходится дуга нового света, знаки
 * загораются, когда она проходит над ними. Без «лесенки»: холст в полный
 * пиксель (до 1,5 dpr, не больше 2,4 Мп), ни одной ступени step() — все края
 * гладкие функции расстояния, кромка не тоньше 1,4 px, сверху дизеринг.
 *
 * Цена: в покое кадр — раз в REST мс (свет почти неподвижен), в Затмении и
 * при «меньше движения» — один кадр; под окном во весь стол и в скрытой
 * вкладке — ни одного. Поле системы (core/field.js) под глубиной не рисует:
 * его suppressed() спрашивает window.sbDepth.live().
 * Без WebGL — слоя нет: поле системы рисует как прежде (sb-depth-nogl). */
(function () {
  "use strict";
  var REST = 500;
  /* ВОДА В ПОКОЕ — ПЛАВНО (D-1348, решение основателя 18.11: «Океан и Берег не должны тормозить»): вода движется
     быстрее медленного света Авроры и Затмения, и кадр раз в REST читался ступенями (видео с планшета: фон меняется
     ровно дважды в секунду). У Океана в покое — кадр раз в WATER мс (25 к/с) в .55 разрешения (D-1346); остальные
     темы — прежний REST. */
  var WATER = 40;

  /* кромки Океана и Авроры — насыщенные, не молочные: ярчайшая точка держит цвет (field-beam: нет белого пятна) */
  /* палитры: base — пол; atm — свет атмосферы; rim — кромка; far — облако;
     k: [−1 — только пол (Затмение), иначе доля, на которую ниже потолок света
     (Аврора .3: зелёный под насыщенностью заметки и пульта светлеет сильнее всех), сила атмосферы, сила облака] */
  var PAL = {
    /* Тепло «Мандарин» (D-1081): тон 24–28°, пол — #130802 Мандарина */
    studio: { base: [19, 8, 2],  atm: [242, 102, 6],  rim: [255, 176, 96],  far: [240, 100, 8],   k: [0, 1.8, 1.5] },
    ocean:  { base: [2, 3, 10],  atm: [44, 84, 236],  rim: [118, 168, 255], far: [70, 52, 196],   k: [0, 1, 1] },
    aurora: { base: [2, 6, 9],   atm: [28, 196, 150], rim: [104, 236, 196], far: [104, 70, 236],  k: [.3, 1, 1] },
    ember:  { base: [1, 1, 1],   atm: [176, 82, 36],  rim: [255, 198, 140], far: [90, 38, 14],    k: [-1, 1, 1] }
  };
  PAL.eclipse = PAL.ember;
  /* H4e (D-1306): флаги сцены — Океан: без контура + вода; Аврора: без контура (горизонт-«зеркало» рисует холст
     #sbHorizon ниже в этом файле); Тайник и Затмение — прежние (0) */
  function flags(m) {
    if (m === "ocean") return [1, 1, 0];
    /* свет Авроры — от той же ровной глубины, что у Океана (за водой «зеркала»): над горизонтом виден только его
       верхний, самый тихий край, как в показе — больших светлых поверхностей нет */
    if (m === "aurora") return [1, 0, 0];
    return [0, 0, 0];
  }
  function vec(m) {
    var p = PAL[m], f = function (c) { return [c[0] / 255, c[1] / 255, c[2] / 255]; };
    return new Float32Array([].concat(f(p.base), f(p.atm), f(p.rim), f(p.far), p.k));
  }

  var VS = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
  var FS = [
    "precision highp float;",
    "const float LCAP = .11, LLOW = .05;",
    "uniform vec2 uRes; uniform float uT, uPx, uMode, uR, uSeam, uBr;",
    /* H4e (D-1306): флаги сцены — x: без контура планеты (ровная глубина), y: вода (Океан), z: высота горизонта (доля H) */
    "uniform vec3 uFA, uFB;",
    "uniform vec2 uO; uniform vec3 uA[5]; uniform vec3 uB[5]; uniform vec4 uWin[8]; uniform float uNW;",
    /* под окнами кромки дуги нет: сквозь стекло «B» (.98) тонкая яркая линия читалась бы ступенью в теле
       окна (window-one-glass п.4); 2 % света её и не показали бы. Края выреза мягкие (8 px). */
    "float underWin(vec2 p){ float c = 0.; for (int i = 0; i < 8; i++) { if (float(i) >= uNW) break; vec4 r = uWin[i];",
    "  vec2 a = smoothstep(r.xy - 8., r.xy + 8., p) * (1. - smoothstep(r.zw - 8., r.zw + 8., p)); c = max(c, a.x*a.y); } return c; }",
    "float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }",
    /* УЗЛЫ ШУМА — ОДНО ЗНАЧЕНИЕ НА УЗЕЛ (H4e3, D-1330: «линии и прямоугольники с жёсткими краями» на планшете
       основателя). Значение узла — прежний хеш h1, но считается ОДИН раз на узел: при сборке отдельный проход пишет его
       в текстуру решётки 1024×1024, второй собирает в каждый тексель четыре угла клетки (latTex ниже); n2 читает клетку
       одним обращением (NEAREST, центр текселя — точное число). Прежде n2 считал h1 у каждого угла каждой клетки сам;
       h1 = fract(sin(…)·43758) усиливает ошибку последнего разряда в 10⁴ раз, мобильный компилятор считает угол i+(1,0)
       иначе (dot(i,k) + 127.1), и один узел у соседних клеток получал разные значения — шум рвался по линиям решётки.
       На настольном GPU значения узлов те же (до 1/255), рисунок пятен не меняется. Решётка текстуры замкнута (период
       1024 узла, REPEAT): за её краем — те же узлы по кругу, шва нет. Без кадрового буфера — hq, хеш целым счётом:
       тоже одно значение на узел. */
    "uniform sampler2D uLat;",
    "float hq(vec2 c){ c = mod(c, 256.); float a = mod(c.x*157. + c.y*113. + 41., 4096.);",
    "  a = mod(floor(a*a/4096.) + a*61. + c.x + 11., 4096.); a = mod(floor(a*a/4096.) + a*61. + c.y + 11., 4096.);",
    "  a = mod(floor(a*a/4096.) + a*61. + 18., 4096.); return a/4096.; }",
    "float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);",
    "#ifdef SB_NOLAT",
    "  vec4 v = vec4(hq(i), hq(i+vec2(1.,0.)), hq(i+vec2(0.,1.)), hq(i+vec2(1.,1.)));",
    "#else",
    "  vec4 v = texture2D(uLat, (mod(i + 512., 1024.) + .5)/1024.);",
    "#endif",
    "  return mix(mix(v.x, v.y, f.x), mix(v.z, v.w, f.x), f.y); }",
    "float fbm(vec2 p){ return n2(p)*.6 + n2(p*2.1+5.3)*.28 + n2(p*4.3+1.7)*.12; }",
    /* потолок яркости света: тихие слова на прозрачных предметах стола (заметка «свет по кромке», пульт)
       держат 4,5:1 к самому светлому месту под ними — свет выше LCAP (линейная яркость) мягко сжимается,
       тон и насыщенность те же; тонкая кромка дуги — поверх, не сжимается. Нижняя полоса стола (небо голоса,
       D-807: туманность и звёзды поверх стола, пока голос говорит) — потолок ниже (LLOW): голос и заметка над ним
       вместе держат меру (note-contrast) */
    "float capAt(vec2 p){ return mix(LCAP, LLOW, smoothstep(uRes.y*.44, uRes.y*.62, p.y)); }",
    "vec3 capL(vec3 c, float cap){ vec3 l = pow(max(c, 0.), vec3(2.2)); float y = dot(l, vec3(.2126, .7152, .0722));",
    "  float k0 = cap*.6, k1 = cap*.4; if (y <= k0) return c;",
    "  float y2 = k0 + k1*(1. - exp(-(y - k0)/k1)); return c*pow(y2/y, 1./2.2); }",
    /* сцена одной темы; p — в пикселях холста, y вниз; k = (−1 — только пол, сила атмосферы, сила облака) */
    /* ПОД ВОДОЙ — ОКЕАН (H4e3, D-1335, основатель 18.11.2026: «фон — как вода, максимально реалистично: человек
       должен чувствовать, что он под водой»). Палитра темы та же (пол, атмосфера, кромка, облако); свет — сверху:
       мерцающая поверхность над головой, мягкие лучи от неё, каустика — сетка света, гаснущая с глубиной, глубина
       уходит в темноту книзу, редкие взвешенные частицы и пузырьки. Всё медленно (кадр покоя — раз в 500 мс, шаг
       меньше ширины линии); «меньше движения» — тот же кадр неподвижно. Нет ни одного края: только гладкие функции,
       частица — одна на клетку, её число считается в клетке один раз. Потолок света (capL) прежний — слова на столе держат меру. */
    /* каустика — два витка вместо трёх (D-1342, основатель 18.11: «Океан на планшете очень медленный»): сетка света
       та же по рисунку (разница кадра ≤ 3/255), работы на пиксель на треть меньше */
    "float caus(vec2 uv, float t){ vec2 p = uv*6.2831853 - 250., i = p; float c = 0.;",
    "  for (int n = 0; n < 2; n++) { float tt = t*(1. - 3.5/float(n + 1));",
    "    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));",
    "    c += 1./length(vec2(p.x/(sin(i.x + tt)/.006), p.y/(cos(i.y + tt)/.006))); }",
    "  c = 1.17 - pow(c/2., 1.4); return smoothstep(1.25, 2.7, pow(abs(c), 8.)); }",
    "vec3 sea(vec3 base, vec3 atm, vec3 rim, vec3 far, vec2 p, float t){",
    "  float W = uRes.x, H = uRes.y, mn = min(W, H); vec2 q = p/mn; float y = p.y/H;",
    "  float TAU = 6.2831853, sw = uBr*(.012*sin(TAU*t/23.) + .006*sin(TAU*t/9.7 + 1.1));",
    "  vec3 lite = mix(atm, rim, .5);",
    /* глубина: свет поверхности сверху, темнота книзу; облако темы — у поверхности справа */
    "  vec3 col = base + atm*(.20*exp(-y*2.3) + .045*exp(-y*.7));",
    "  vec2 f1 = (p - vec2(W*.84, -H*.06))/mn; col += far*.10*exp(-dot(f1, f1)*2.);",
    /* поверхность над головой: вытянутая рябь, светлее у самого верха */
    "  if (y < .4) { float s = fbm(vec2(q.x*3.1 + sw*6. + t*.018, q.y*13. - t*.035));",
    "    col += lite*exp(-y*9.)*(.07 + .26*smoothstep(.36, .8, s))*smoothstep(.4, .3, y); }",
    /* лучи: веер из-за поверхности, медленно ходят */
    "  vec2 d = p - vec2(W*(.40 + sw), -H*.6); float ang = atan(d.x, d.y);",
    "  float r1 = fbm(vec2(ang*8. + t*.010, t*.008)), r2 = .5 + .25*sin(ang*53. - t*.07) + .25*sin(ang*31. + t*.05 + 1.3);",
    "  float rays = smoothstep(.45, .85, r1)*.75 + smoothstep(.55, .95, r2)*.35*(.5 + r1);",
    "  col += lite*rays*exp(-y*1.9)*.17;",
    /* каустика: сетка света от поверхности, крупная, гаснет с глубиной */
    "  if (y < .78) col += rim*caus(q*.62 + vec2(sw*.6, 0.), t*.055)*.11*exp(-y*1.7)*smoothstep(.78, .55, y);",
    /* взвесь: редкие частицы медленно опускаются; редко — пузырёк поднимается */
    /* взвеси нет (D-1353, основатель: «пыли в темах не надо»; no-tainik-dust-elsewhere — точек в Океане быть не должно):
       частицы убраны целиком, как пузырьки (D-1346); остальная вода прежняя */
    /* пузырьков нет (D-1346, основатель 18.11: «пузырьки смотрятся дёшево» — убраны все, большие и малые) */
    /* глубина книзу — темнее */
    /* к низу — не в черноту, а в синюю мглу цвета пола страницы (--sb-floor Океана 21,32,70; floor-seam-check): шва у
       нижней кромки нет; бока в толще чуть темнее — глубина */
    "  float xc = (p.x/W - .5)*2.; col *= 1. - .30*xc*xc*smoothstep(.15, .7, y)*(1. - smoothstep(.75, 1., y));",
    "  return mix(col, vec3(21., 32., 70.)/255., smoothstep(.55, 1., y)*.92); }",
    "vec3 scene(vec3 base, vec3 atm, vec3 rim, vec3 far, vec3 k, vec3 fl, vec2 p, float t, out vec3 rr){",
    "  float W = uRes.x, H = uRes.y, mn = min(W, H), mx = max(W, H);",
    "  vec2 q = p/mn;",
    "  float uFlat = fl.x, uWater = fl.y;",
    /* ДЫХАНИЕ (H4e, D-1306): три медленных круга 9–13,5 с, малая амплитуда; uBr = 0 при «меньше движения» */
    "  float TAU = 6.2831853;",
    "  float b1 = sin(TAU*t/11.), b2 = sin(TAU*t/13.5 + 1.3), b3 = sin(TAU*t/9. + 2.1);",
    /* Затмение: только пол — диск и кромку рисует #sbEclipse (D-872) */
    "  rr = vec3(0.);",
    /* Океан — под водой (D-1335): своя сцена, свет темы тот же, потолок тот же */
    "  if (fl.y > .5) return capL(sea(base, atm, rim, far, p, t), capAt(p));",
    "  if (k.x < -.5) return base;",
    /* облик пятен — только у сцен с горизонтом: Океан (вода) и Затмение (пол) его не берут, шума на пиксель меньше (D-1342) */
    "  float form = fbm(q*1.15 + vec2(t*(.006 + .012*uBr), -t*(.004 + .009*uBr)));",
    /* горизонт планеты: большая окружность, вершина дуги — на 80–82 % высоты */
    "  float R = mx*1.7;",
    "  float apex = H*(W > H ? .80 : .82);",
    "  vec2 c = vec2(W*(.5 + .05*sin(t*.011)), apex + R);",
    "  float d = length(p - c) - R;",
    /* без контура (H4e, D-1306): та же сила света, но от ровной глубины у горизонта — ни дуги, ни тёмного диска;
       свет медленно поднимается и опускается, как зыбь (Океан); у Авроры горизонт — линия воды «зеркала» */
    "  float hz = fl.z > 0. ? fl.z : (W > H ? .86 : .87);",
    "  float dflat = H*(hz + .012*b3*uBr) - p.y;",
    "  d = mix(d, dflat, uFlat);",
    "  float lat = exp(-pow((p.x - c.x)/(W*.62), 2.));",
    "  float dp = max(d, 0.) + uFlat*max(-d, 0.)*.35, dn = max(-d, 0.);",
    /* под окном край планеты мягче (6 % меньшей стороны) — по той же причине, что и вырез кромки */
    "  float uw = underWin(p), ew = mix(uPx*1.2, mn*.06, uw);",
    "  float sky = mix(smoothstep(-ew, ew, d), 1., uFlat);",
    /* близкий свет у дуги — как был; дальний (широкий) — с силой темы: у Тепла он поднимается
       оранжевым заревом до середины стола, верх остаётся глубоким */
    "  float g = k.y*(1. + .09*b1*uBr);",
    /* Аврора: дальний свет над горизонтом дышит неровно по ширине — то выше, то ниже, очень медленно */
    "  float wv = 1. + uBr*(1. - uWater)*uFlat*.16*sin(p.x/W*2.6 + t*.21)*(.55 + .45*b2);",
    "  vec3 a1 = atm*((.50 - .42*uFlat)*exp(-dp/(mn*.055)) + g*.22*exp(-dp/(mn*.24*wv)) + g*.09*exp(-dp/(mn*.70)))*(.30 + .70*lat)*(.85 + .3*form);",
    "  float rw = max(uPx*1.4, mn*.0018);",
    "  rr = (1. - uFlat)*(1. - uw)*min(rim*(exp(-pow(d/rw, 2.))*.85 + .22*exp(-pow(d/(mn*.010), 2.)))*(.25 + .75*lat), 1.);",
    "  vec3 inner = atm*.10*g*exp(-dn/(mn*.05))*(.3 + .7*lat) + base*.6;",
    "  vec3 col = mix(inner, base + a1, sky);",
    /* дальние облака — по краям, середина пуста; у Тепла облако ниже и сильнее (под знаками, не под шапкой, выше неба голоса) */
    "  float cy1 = k.z > 1.2 ? .46 : .10;",
    "  vec2 o1 = uBr*vec2(.018*sin(t*.11), .014*sin(t*.083 + 1.))*mn, o2 = uBr*vec2(.016*sin(t*.095 + 2.), .02*sin(t*.07))*mn;",
    "  vec2 f1 = (p - vec2(W*.96, H*cy1) - o1)/mn; float g1 = exp(-dot(f1*vec2(1., 1.25), f1*vec2(1., 1.25))*3.2);",
    "  vec2 f2 = (p - vec2(W*.02, H*.46) - o2)/mn; float g2 = exp(-dot(f2*vec2(1.5, .9), f2*vec2(1.5, .9))*4.);",
    "  float kz = k.z*(1. + .14*b2*uBr);",
    "  col += far*.42*kz*g1*(.40 + 1.2*form) + atm*.13*kz*g2*(.35 + 1.3*form);",
    "  return capL(col, capAt(p)*(1. - max(k.x, 0.)));",
    "}",
    /* кромка дуги ложится «экраном»: каналы не упираются в 255, и у Тепла она остаётся оранжевой, не жёлтой */
    "void main(){",
    "  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);",
    "  vec3 col;",
    "  if (uMode < .5) { vec3 Ar; vec3 A = scene(uA[0], uA[1], uA[2], uA[3], uA[4], uFA, p, uT, Ar); col = A + Ar*(1. - A); }",
    "  else {",
    "    float mn = min(uRes.x, uRes.y);",
    "    float d = length(p - uO);",
    /* живая, но гладкая кромка шва: только низкие частоты, без step() */
    "    float wob = (fbm(p/mn*2.4 + vec2(uT*.3, -uT*.22)) - .5)*mn*.035*min(1., uR/(mn*.4));",
    "    float dd = d + wob;",
    "    float soft = mn*.02;",
    "    float m = smoothstep(uR + soft, uR - soft, dd);",
    /* каждая сцена считается только там, где её видно: шов не вдвое дороже покоя */
    "    vec3 Ac = vec3(0.), Bc = vec3(0.), Ar = vec3(0.), Br = vec3(0.);",
    "    if (m < .999) { vec3 A = scene(uA[0], uA[1], uA[2], uA[3], uA[4], uFA, p, uT, Ar);",
    "      float ahead = exp(-max(dd - uR, 0.)/(mn*.10))*(1. - m);",
    "      Ac = A*(1. - .35*ahead*uSeam); }",
    "    if (m > .001) { vec3 B = scene(uB[0], uB[1], uB[2], uB[3], uB[4], uFB, p, uT, Br);",
    "      float behind = exp(-max(uR - dd, 0.)/(mn*.14))*m;",
    "      Bc = B*(1. + .8*behind*uSeam); }",
    "    float rw = max(uPx*1.5, mn*.0028);",
    "    float seam = exp(-pow((dd - uR)/rw, 2.)) + .30*exp(-pow((dd - uR)/(mn*.03), 2.));",
    "    vec3 sc = mix(uB[2], vec3(1.), .12);",
    /* свет за швом и сама кромка шва — под тем же потолком: тихие слова держат меру и во время шва;
       кромки дуг ложатся поверх «экраном» */
    "    vec3 G = capL(mix(Ac, Bc, m) + sc*seam*.55*uSeam, capAt(p)*mix(1. - max(uA[4].x, 0.), 1. - max(uB[4].x, 0.), m)), Rr = mix(Ar, Br, m);",
    "    col = G + Rr*(1. - G);",
    "  }",
    "  col += (h1(gl_FragCoord.xy + fract(uT)*91.) - .5)*(1.5/255.);",
    "  gl_FragColor = vec4(col, 1.);",
    "}"
  ].join("\n");

  /* текстура решётки (D-1330): проход 1 — узел (x − 512, y − 512) → h1 тем же текстом, что был в n2 (24 бита);
     проход 2 — в тексель клетки четыре её угла (по 8 бит), копии одного значения узла. Один раз при сборке.
     Не вышло (нет кадрового буфера) — шейдер собирается с SB_NOLAT, шум на hq (ветка выбирается при сборке, не в кадре). */
  var LAT_FS = "precision highp float;\nfloat h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }\n" +
    "void main(){ vec2 c = floor(gl_FragCoord.xy) - 512.; float h = h1(c);\n" +
    "  gl_FragColor = vec4(floor(h*256.), floor(fract(h*256.)*256.), floor(fract(h*65536.)*256.), 255.)/255.; }";
  var LAT4_FS = "precision highp float;\nuniform sampler2D uA;\n" +
    "float g(vec2 o){ return dot(texture2D(uA, (floor(gl_FragCoord.xy) + o + .5)/1024.).rgb, vec3(255./256., 255./65536., 255./16777216.)); }\n" +
    "void main(){ gl_FragColor = vec4(g(vec2(0., 0.)), g(vec2(1., 0.)), g(vec2(0., 1.)), g(vec2(1., 1.))); }";
  function latTex(g, sh) {
    try {
      var run = function (fs, unit, prep) {
        var pr = g.createProgram(); g.attachShader(pr, sh(g.VERTEX_SHADER, VS)); g.attachShader(pr, sh(g.FRAGMENT_SHADER, fs)); g.linkProgram(pr);
        if (!g.getProgramParameter(pr, g.LINK_STATUS)) return null;
        g.useProgram(pr); if (prep) prep(pr);
        var la = g.getAttribLocation(pr, "a"); g.enableVertexAttribArray(la); g.vertexAttribPointer(la, 2, g.FLOAT, false, 0, 0);
        var tx = g.createTexture(); g.activeTexture(unit); g.bindTexture(g.TEXTURE_2D, tx);
        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, 1024, 1024, 0, g.RGBA, g.UNSIGNED_BYTE, null);
        [g.TEXTURE_MIN_FILTER, g.TEXTURE_MAG_FILTER].forEach(function (k) { g.texParameteri(g.TEXTURE_2D, k, g.NEAREST); });
        [g.TEXTURE_WRAP_S, g.TEXTURE_WRAP_T].forEach(function (k) { g.texParameteri(g.TEXTURE_2D, k, g.REPEAT); });
        var fb = g.createFramebuffer(); g.bindFramebuffer(g.FRAMEBUFFER, fb);
        g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, tx, 0);
        var done = g.checkFramebufferStatus(g.FRAMEBUFFER) === g.FRAMEBUFFER_COMPLETE;
        if (done) { g.viewport(0, 0, 1024, 1024); g.drawArrays(g.TRIANGLES, 0, 3); }
        g.bindFramebuffer(g.FRAMEBUFFER, null); g.deleteFramebuffer(fb); g.deleteProgram(pr);
        if (!done) { g.deleteTexture(tx); return null; }
        return tx;
      };
      var t1 = run(LAT_FS, g.TEXTURE1);
      if (!t1) return false;
      var t4 = run(LAT4_FS, g.TEXTURE0, function (pr) { g.uniform1i(g.getUniformLocation(pr, "uA"), 1); });
      g.activeTexture(g.TEXTURE1); g.bindTexture(g.TEXTURE_2D, null); g.deleteTexture(t1); g.activeTexture(g.TEXTURE0);
      return !!t4;
    } catch (e) { return false; }
  }
  /* одна сборка и одна запись кадра — для потока и для главного: картинка та же самой функцией */
  function glSetup(g) {
    var sh = function (type, src) {
      var o = g.createShader(type); g.shaderSource(o, src); g.compileShader(o);
      if (!g.getShaderParameter(o, g.COMPILE_STATUS)) throw new Error(g.getShaderInfoLog(o));
      return o;
    };
    var buf = g.createBuffer(); g.bindBuffer(g.ARRAY_BUFFER, buf);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), g.STATIC_DRAW);
    /* решётка шума — до сборки шейдера: без неё шейдер собирается с SB_NOLAT (D-1330) */
    var lat = latTex(g, sh);
    var pr = g.createProgram();
    g.attachShader(pr, sh(g.VERTEX_SHADER, VS)); g.attachShader(pr, sh(g.FRAGMENT_SHADER, (lat ? "" : "#define SB_NOLAT\n") + FS));
    g.linkProgram(pr);
    if (!g.getProgramParameter(pr, g.LINK_STATUS)) throw new Error(g.getProgramInfoLog(pr));
    g.useProgram(pr);
    var loc = g.getAttribLocation(pr, "a"); g.enableVertexAttribArray(loc); g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
    var u = {};
    ["uRes", "uT", "uPx", "uMode", "uR", "uSeam", "uO", "uA", "uB", "uWin", "uNW", "uBr", "uFA", "uFB"].forEach(function (n) { u[n] = g.getUniformLocation(pr, n); });
    g.uniform1i(g.getUniformLocation(pr, "uLat"), 0);
    /* ПРОГРЕВ (D-1345, основатель 18.11: «Океан дёргается в миг включения»): сборку шейдера браузер доводит до конца
       только на первом рисовании — оно приходилось на сам миг смены темы (из Тайника и из Светлицы слой не рисует).
       Здесь, в простое после входа, — один пиксель в стороне от экрана (холст ещё не показан, первый кадр закрывает
       его целиком): программа и решётка уже готовы, смена темы берёт готовое. Вид не меняется. */
    try {
      g.viewport(0, 0, 1, 1); g.uniform2f(u.uRes, 1, 1); g.uniform1f(u.uMode, 1); g.uniform1f(u.uR, 0); g.uniform1f(u.uNW, 0);
      g.drawArrays(g.TRIANGLES, 0, 3); g.readPixels(0, 0, 1, 1, g.RGBA, g.UNSIGNED_BYTE, new Uint8Array(4));
    } catch (e) { /* прогрев не обязателен */ }
    return u;
  }
  function glFrame(g, u, f) {
    g.viewport(0, 0, f.w, f.h);
    g.uniform2f(u.uRes, f.w, f.h); g.uniform1f(u.uT, f.t); g.uniform1f(u.uPx, 1);
    g.uniform3fv(u.uA, f.A); g.uniform3fv(u.uB, f.B); g.uniform1f(u.uMode, f.mode);
    g.uniform4fv(u.uWin, f.wins); g.uniform1f(u.uNW, f.nw);
    g.uniform2f(u.uO, f.ox, f.oy); g.uniform1f(u.uR, f.R); g.uniform1f(u.uSeam, f.seam);
    g.uniform1f(u.uBr, f.br || 0); g.uniform3fv(u.uFA, f.FA || [0, 0, 0]); g.uniform3fv(u.uFB, f.FB || [0, 0, 0]);
    g.drawArrays(g.TRIANGLES, 0, 3);
  }

  /* ── ПОТОК ГЛУБИНЫ ───────────────────────────────────────────────────────
     Тот же файл, загруженный потоком (Worker), держит свой холст WebGL вне
     страницы (OffscreenCanvas): сборка шейдера и кадры идут не в главном
     потоке, на экран кадр приходит готовой картинкой (bitmaprenderer). Так
     вход, окна и голос не ждут слоя — тот же приём, что у поля (D-282). */
  if (typeof document === "undefined") {
    if (typeof self === "undefined" || typeof self.postMessage !== "function") return;
    var oc = null, wg = null, wu = null, wpend = null, wbusy = false;
    var wrun = function () {
      wbusy = false;
      var f = wpend; wpend = null;
      if (!f || !wg) return;
      /* D-1231: сбой кадра (потерян контекст, нулевой холст, нехватка памяти на планшете) не должен
         ронять систему: воркер сообщает «fail», главный поток переходит на запасной рисунок. */
      try {
        if (oc.width !== f.w || oc.height !== f.h) { oc.width = f.w; oc.height = f.h; }
        glFrame(wg, wu, f);
        var bmp = oc.transferToImageBitmap();
        self.postMessage({ type: "bmp", bmp: bmp }, [bmp]);
      } catch (err) { wg = null; self.postMessage({ type: "fail" }); }
    };
    self.onmessage = function (e) {
      var m = e.data || {};
      if (m.type === "init") {
        try {
          oc = new OffscreenCanvas(Math.max(2, m.w), Math.max(2, m.h));
          wg = oc.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
          if (!wg) throw new Error("webgl");
          wu = glSetup(wg);
          self.postMessage({ type: "ready" });
        } catch (err) { wg = null; self.postMessage({ type: "fail" }); }
      } else if (m.type === "frame") {
        /* держится только самый свежий кадр */
        wpend = m.f;
        if (!wbusy) { wbusy = true; setTimeout(wrun, 0); }
      }
    };
    return;
  }

  var root = document.documentElement, doc = document;
  function mood() { var m = root.getAttribute("data-wp-mood"); return PAL[m] ? m : "studio"; }
  /* Адрес этого же файла — запустить его потоком; в ковчеге (D-314) адреса нет — поток из текста (как у поля). */
  var SRC = (doc.currentScript && (doc.currentScript.src ||
    (window.SB_ARK && typeof window.SB_ARK.self === "function" ? window.SB_ARK.self(doc.currentScript) : ""))) || "";
  /* ПОТОК ЗАВОДИТСЯ СРАЗУ, ПРИ ЗАГРУЗКЕ (D-1351; закон door-address-check: после нажатия — ни одного запроса; строгость
     страницы — поток только из своего адреса, не blob:): файл потока запрашивается один раз сейчас, пока страница
     грузится, а сборка шейдера в нём — позже, в простое после входа (D-1345), уже без запросов. Поток без «init»
     ничего не делает. */
  var early = null;
  try {
    if (SRC && typeof Worker !== "undefined" && typeof OffscreenCanvas !== "undefined" && OffscreenCanvas.prototype.transferToImageBitmap) early = new Worker(SRC);
  } catch (e) { early = null; }
  var cv = null, gcv = null, c2d = null, gl = null, prog = null, U = {}, W = 0, H = 0, K = 1, raf = 0, T0 = performance.now();
  var worker = null, bmpctx = null, inflight = false, queued = null;
  var cur = null, tr = null, lastTap = null, draws = 0, held = 0, live = false, dirty = true;
  /* пока слой собирается (после первой отрисовки страницы), поле уже молчит — если WebGL есть вообще */
  var pending = !!window.WebGLRenderingContext;
  var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  function reduced() { return mq.matches || root.getAttribute("data-motion") === "reduced"; }
  /* слой виден: тёмная тема (Светлица — прежний вид core.css); гость видит то же, что стол (D-1315) */
  /* Тайник (бывшее Тепло, ключ studio) — поле витрины (core/tainik.js, D-1229): глубина в нём не рисует */
  function shown() { return root.getAttribute("data-theme") !== "light" && mood() !== "studio"; }
  function parked() { return root.classList.contains("wp-parked"); }
  function eclipse(m) { return m === "ember" || m === "eclipse"; }
  /* Турбо (sb-turbo) и «фон выключен» (уровень поля off) — свет стоит, шов — сразу (room-and-seam п.6) */
  function turbo() { return root.classList.contains("sb-turbo") || !!(window.sbField && window.sbField.level && window.sbField.level() === "off"); }

  /* без WebGL — честно назад к полю системы */
  function fallback() {
    live = false; pending = false; root.classList.add("sb-depth-nogl");
    if (early) { early.terminate(); early = null; }
    if (window.sbField) { window.sbField.refresh(); if (window.sbGetWallpaperMood) window.sbField.mood(window.sbGetWallpaperMood()); }
  }
  /* поток: сборка и кадры вне главного; не вышло — тот же холст, но в главном потоке */
  function buildWorker() {
    if (!SRC || typeof Worker === "undefined" || typeof OffscreenCanvas === "undefined" ||
        !OffscreenCanvas.prototype.transferToImageBitmap || typeof createImageBitmap === "undefined") return false;
    try { bmpctx = cv.getContext("bitmaprenderer"); } catch (e) { bmpctx = null; }
    if (!bmpctx) { if (early) { early.terminate(); early = null; } return false; }
    try { worker = early || new Worker(SRC); } catch (e) { worker = null; }
    early = null;
    if (!worker) { swapCanvas(); return false; }
    worker.onmessage = function (e) {
      var m = e.data || {};
      if (m.type === "ready") { live = true; pending = false; prog = true; dirty = true; loop(); }
      else if (m.type === "fail") { worker.terminate(); worker = null; swapCanvas(); buildMain(); if (live) size(); }
      else if (m.type === "bmp") {
        inflight = false;
        if (bmpctx) bmpctx.transferFromImageBitmap(m.bmp);
        if (!cv.classList.contains("sb-depth-on")) cv.classList.add("sb-depth-on");
        /* отложенный кадр уходит, только если стол всё ещё виден */
        /* слабое устройство (кадр туда-обратно дольше 50 мс, программный GPU): следующий кадр шва — после паузы
           той же длины, иначе слой занимает GPU целиком и стол (плитки, окна, переходы) стоит без кадров;
           на обычном GPU кадр — единицы мс, и пауз нет */
        var rtt = performance.now() - sentAt;
        if (queued && rtt > 50) { inflight = true; setTimeout(function () { inflight = false; var q2 = queued; queued = null; if (q2 && !parked() && !doc.hidden) send(q2); }, Math.min(rtt, 400)); return; }
        if (queued) { var q = queued; queued = null; if (!parked() && !doc.hidden) send(q); }
      }
    };
    /* D-1231: ошибка воркера глубины — не ошибка запуска системы: событие гасится, фон уходит на запасной рисунок */
    worker.onerror = function (ev) { if (ev && ev.preventDefault) ev.preventDefault(); if (worker) { worker.terminate(); worker = null; swapCanvas(); buildMain(); if (live) size(); } };
    worker.postMessage({ type: "init", w: Math.round(innerWidth * K), h: Math.round(innerHeight * K) });
    return true;
  }
  /* холст, отданный bitmaprenderer, не берёт 2D — для главного потока он заменяется чистым */
  function swapCanvas() {
    bmpctx = null;
    var n = cv.cloneNode(false); cv.parentNode.replaceChild(n, cv); cv = n;
  }
  /* счёт кадров — в миг, когда кадр заказан: это и есть работа слоя */
  var sentAt = 0;
  function send(f) { inflight = true; draws++; sentAt = performance.now(); worker.postMessage({ type: "frame", f: f }); }
  function build() {
    if (cv) return true;
    cv = doc.getElementById("sbDepthField");
    if (!cv) return false;
    if (buildWorker()) return true;
    buildMain();
    return true;
  }
  function buildMain() {
    /* WebGL считает во внутреннем холсте вне страницы; на экран кадр кладётся в обычный 2D-холст. Холст
       WebGL прямо в странице дорог композитору на каждом кадре (замер 720×1050: 3–8 к/с против 45 без
       него), а 2D-холст стоит так же дёшево, как прежнее поле, — копия только когда кадр нарисован. */
    gcv = doc.createElement("canvas");
    c2d = cv.getContext("2d", { alpha: false });
    gl = c2d && gcv.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
    if (!gl) { fallback(); return; }
    try { U = glSetup(gl); prog = true; live = true; } catch (e) { prog = null; fallback(); }
    pending = false;
    /* потерянный контекст — честно назад к полю системы */
    gcv.addEventListener("webglcontextlost", function (e) {
      e.preventDefault(); prog = null; fallback();
    });
  }
  function size() {
    if (!cv) return;
    W = window.innerWidth; H = window.innerHeight;
    K = Math.min(window.devicePixelRatio || 1, 1.5);
    /* полный пиксель, но не больше ~2,4 Мп: шов гладкий, а кадр дешёвый */
    K = Math.min(K, Math.sqrt(2.4e6 / Math.max(1, W * H)));
    var w = Math.max(2, Math.round(W * K)), h = Math.max(2, Math.round(H * K));
    if (!worker && (cv.width !== w || cv.height !== h)) { cv.width = w; cv.height = h; }
    if (gcv && (gcv.width !== w || gcv.height !== h)) { gcv.width = w; gcv.height = h; }
    /* смена размера стирает холст: кадр — в ближайшем такте (за воротами и под окном — когда стол откроется) */
    dirty = true;
    if (!doc.getElementById("sbVaultGate") && !parked()) draw(performance.now()); else loop();
  }

  /* ВОДА — МЕЛЬЧЕ ЭКРАНА (D-1346, основатель 18.11: «Океан на планшете дёргается»): свет под водой мягкий, без единого
     края (контура у Океана нет) — в покое холст считается в WS = .55 от прежнего (≈ .5 × DPR на планшете), сверху
     растягивается гладко; пикселей — втрое меньше. Шов идёт в полный пиксель (его кромка тонкая). */
  var WS = 0.55;
  function draw(now) {
    if (!prog || !shown()) return;
    var t = reduced() ? 40 : (now - T0) / 1000;
    var m = cur || mood();
    var S = !tr && m === "ocean" ? WS : 1, wz = new Float32Array(wins);
    if (S !== 1) for (var wi = 0; wi < wz.length; wi++) wz[wi] *= S;
    var f = { w: Math.max(2, Math.round(W * K * S)), h: Math.max(2, Math.round(H * K * S)), t: t,
      A: vec(tr ? tr.from : m), B: vec(tr ? tr.to : m), mode: tr ? 1 : 0, wins: wz, nw: nWins,
      ox: tr ? tr.o.x * K : 0, oy: tr ? tr.o.y * K : 0, R: tr ? tr.R * K : 0, seam: tr ? tr.seam : 0,
      br: reduced() ? 0 : 1, FA: flags(tr ? tr.from : m), FB: flags(tr ? tr.to : m) };
    dirty = false;
    if (worker) { if (inflight) queued = f; else send(f); return; }
    if (gcv.width !== f.w || gcv.height !== f.h) { gcv.width = f.w; gcv.height = f.h; }
    glFrame(gl, U, f);
    c2d.imageSmoothingEnabled = true; c2d.imageSmoothingQuality = "high";
    c2d.drawImage(gcv, 0, 0, cv.width, cv.height);
    draws++;
    if (draws === 1) cv.classList.add("sb-depth-on");
  }

  function ease(p) { p = Math.max(0, Math.min(1, p)); return 1 - Math.pow(1 - p, 1.75); }
  function smooth(p) { p = Math.max(0, Math.min(1, p)); return p * p * (3 - 2 * p); }
  function iconCenters() {
    return Array.prototype.map.call(doc.querySelectorAll("#sbIconLayer .desk-icon"), function (el) {
      var r = (el.querySelector(".icon-tile") || el).getBoundingClientRect();
      return { el: el, x: r.left + r.width / 2, y: r.top + r.height / 2, done: false };
    });
  }
  function startSeam(from, to) {
    if (reduced() || turbo() || !prog || !shown() || parked()) { cur = to; dirty = true; draw(performance.now()); return; }
    var o = lastTap && performance.now() - lastTap.at < 4000 ? lastTap : { x: W / 2, y: H - 40 };
    var far = Math.max(Math.hypot(o.x, o.y), Math.hypot(W - o.x, o.y), Math.hypot(o.x, H - o.y), Math.hypot(W - o.x, H - o.y)) + 80;
    tr = { from: from, to: to, o: { x: o.x, y: o.y }, t0: performance.now(), dur: 2700, R: 0, far: far, seam: 1, icons: iconCenters() };
    cur = to;
    root.classList.add("sb-depth-seam");
    loop();
  }
  function stepSeam(now) {
    var p = Math.min(1, (now - tr.t0) / tr.dur);
    tr.R = tr.far * ease(p);
    tr.seam = p < .72 ? 1 : 1 - smooth((p - .72) / .28);
    tr.icons.forEach(function (ic) {
      if (!ic.done && Math.hypot(ic.x - tr.o.x, ic.y - tr.o.y) < tr.R - 6) {
        ic.done = true; ic.el.classList.remove("sb-depth-lit"); void ic.el.offsetWidth; ic.el.classList.add("sb-depth-lit");
      }
    });
    if (p >= 1) { tr = null; root.classList.remove("sb-depth-seam"); }
  }

  var rest = 0;
  function loop() {
    if (raf || !prog) return;
    if (rest) { clearTimeout(rest); rest = 0; }
    raf = requestAnimationFrame(function tick(now) {
      raf = 0;
      if (!shown()) return;
      if (held) now = held;
      if (tr) { stepSeam(now); draw(now); raf = requestAnimationFrame(tick); return; }
      /* под окном во весь стол и в скрытой вкладке — ни кадра, даже отложенного: он дождётся пробуждения;
         за воротами Шифра стола не видно — кадров нет, раз в секунду спросить, ушли ли ворота */
      if (parked() || doc.hidden) return;
      if (doc.getElementById("sbVaultGate")) { setTimeout(loop, 1000); return; }
      if (dirty) draw(now);
      /* покой: свет почти неподвижен — кадр раз в полсекунды; Затмение (пол без света),
         «меньше движения», Турбо, окно во весь стол и скрытая вкладка — ни одного */
      if (parked() || reduced() || turbo() || doc.hidden || eclipse(cur || mood())) {
        /* уровень фона меняется без атрибута на корне — раз в секунду спросить, не вернулся ли он */
        if (!root.classList.contains("sb-turbo") && turbo()) setTimeout(loop, 1000);
        return;
      }
      /* до следующего кадра покоя — таймер по настоящим часам, а не кадр за кадром: между ними страница не
         тронута, и приборы, ускоряющие время страницы (teplo-warm), кадры не разгоняют */
      draw(now);
      rest = setTimeout(function () { rest = 0; loop(); }, (cur || mood()) === "ocean" ? WATER : REST);
    });
  }

  /* наружу: live() — слой рисует (поле системы молчит); hold — остановить время слоя на кадре (для снимков шва) */
  window.sbDepth = {
    live: function () { return (live || pending) && shown(); },
    get draws() { return draws; }, get seam() { return tr; }, palettes: PAL, rest: REST, restWater: WATER,
    /* где считаются кадры: «thread» — свой поток, «main» — главный */
    thread: function () { return worker ? "thread" : "main"; },
    hold: function (on) { held = on ? performance.now() : 0; if (!on && tr) tr.t0 += performance.now() - (tr.heldAt || performance.now()); if (on && tr) tr.heldAt = held; loop(); }
  };

  /* касание кнопки темы — шов идёт оттуда */
  window.addEventListener("pointerdown", function (e) {
    var b = e.target && e.target.closest && e.target.closest("[data-mood]");
    if (b) { var r = b.getBoundingClientRect(); lastTap = { x: r.left + r.width / 2, y: r.top + r.height / 2, at: performance.now() }; }
  }, true);

  /* окна на столе — для выреза кромки; пересчёт по слою окон, не чаще раза в 250 мс, не во время перетаскивания */
  var wins = new Float32Array(32), nWins = 0, winTimer = 0;
  function readWins() {
    winTimer = 0;
    if (root.classList.contains("dragging")) { winTimer = setTimeout(readWins, 250); return; }
    var list = doc.querySelectorAll("#windowLayer .window"), n = 0, key = "";
    for (var i = 0; i < list.length && n < 8; i++) {
      var c = list[i].classList;
      if (c.contains("minimized") || c.contains("closing")) continue;
      var r = list[i].getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      wins[n * 4] = r.left * K; wins[n * 4 + 1] = r.top * K; wins[n * 4 + 2] = r.right * K; wins[n * 4 + 3] = r.bottom * K;
      key += Math.round(r.left) + "," + Math.round(r.top) + "," + Math.round(r.right) + "," + Math.round(r.bottom) + ";";
      n++;
    }
    /* ровная глубина (Океан, Аврора — D-1306) кромки дуги не рисует, и окна в её кадре ничего не меняют: кадр на каждое
       движение окна — пустая работа, а на слабом GPU он занимал его как раз тогда, когда стол перерисовывает окно
       (window-one-glass). Прямоугольники запоминаются — кадр по другой причине возьмёт свежие. */
    if (key !== readWins.key || n !== nWins) { readWins.key = key; nWins = n; if (tr || !flags(cur || mood())[0]) { dirty = true; loop(); } }
  }
  function winsChanged() { if (!winTimer) winTimer = setTimeout(readWins, 250); }
  var bootAt = 0;
  function start() {
    if (!build()) { if (pending) fallback(); return; }
    bootAt = performance.now();
    cur = mood();
    size();
    /* смена темы: слушаем сам атрибут — тема ставится и из пульта, и из Настроек */
    /* слушается корень, но кадр — только когда изменилось то, что видно на фоне: тема, Светлица, движение,
       инкогнито, Турбо, «накрыто окном». Прочие классы корня (перетаскивание, окна, ввод) кадра не стоят. */
    var stamp = function () {
      var c = root.classList;
      return [root.getAttribute("data-theme"), root.getAttribute("data-motion"), c.contains("sb-incognito"), c.contains("sb-turbo"), c.contains("wp-parked")].join("|");
    };
    var seen = stamp();
    new MutationObserver(function () {
      if (!cv) return;
      var m = mood();
      /* тема, надетая при входе (восстановление из хранилища), — без шва: шов — ответ на выбор человека */
      if (m !== cur && (performance.now() - bootAt < 2500 || m === "studio" || cur === "studio")) { cur = m; dirty = true; seen = stamp(); loop(); return; }
      if (m !== cur) { seen = stamp(); startSeam(cur || m, m); return; }
      var st = stamp();
      if (st === seen) return;
      seen = st; dirty = true; loop();
    }).observe(root, { attributes: true, attributeFilter: ["data-wp-mood", "data-theme", "data-motion", "class"] });
    window.addEventListener("resize", size);
    window.addEventListener("resize", winsChanged);
    var wl = doc.getElementById("windowLayer");
    if (wl) new MutationObserver(winsChanged).observe(wl, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style"] });
    readWins();
    doc.addEventListener("visibilitychange", loop);
    if (mq.addEventListener) mq.addEventListener("change", function () { dirty = true; loop(); });
    loop();
  }
  /* depth.js подключён до field.js: к старту поля sbDepth.live() уже отвечает (pending), и поле не рисует ни кадра */
  /* сборка шейдера — после первой отрисовки стола, а не в ней: вход не ждёт слоя; холст проявляется мягко */
  /* и не под занавесом входа: его подъём ждёт проявленного стола (shell.js, v59), и сборка слоя в это время
     отодвигала бы вход; стол встречает человека полом, свет проявляется следом (.8 с) */
  function later() {
    if (doc.getElementById("sbCurtain")) { setTimeout(later, 200); return; }
    (window.requestIdleCallback || function (f) { return setTimeout(f, 60); })(start, { timeout: 1200 });
  }
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", later);
  else later();
})();

/* ── ОКЕАН И АВРОРА: ГОРИЗОНТ-«ЗЕРКАЛО» И ОТВЕТ НА КАСАНИЕ · H4e, D-1306…D-1308 ─────────────────────────
 * Основатель 15–16.11.2026: «Океан: фон ТЕКУЩИЙ + только анимация нажатия v8 + убрать контур + оживить (дыхание).
 * Аврора: фон ТЕКУЩИЙ + нажатие v8 + оживить; вместо контура — горизонт», выбран «зеркало» — исходный вариант из
 * показа zvezdy-temy4 («окончательно»). Тайник и Затмение не тронуты: в них оба холста скрыты.
 *  · #sbHorizon — Аврора: ровный тёмный горизонт и спокойная вода, перенесено из показа (drawGround, ветка
 *    «зеркало» в покое: вода, дальние низкие хребты с отражением, редкие острова, низкий туман, дымка горизонта).
 *    Свет глубины (выше) поднимается от той же линии (флаг горизонта в шейдере). Рябь и туман дышат медленно;
 *    кадр — раз в полсекунды, как покой глубины; «меньше движения» — один кадр.
 *  · #sbThemeTap — касание стола: перенесено без изменений из показа тем v8 (h4c-temy-lighttap / okean-avrora):
 *    Океан — над пальцем открывается просвет: луч от поверхности доходит до пальца, под ним разливается свет;
 *    Аврора — занавес сияния просыпается над пальцем, яркость расходится вдоль него, снизу розовая кайма.
 *    Только ответ на касание, без прежнего фона v8. 1,2 с; «меньше движения» — без отклика.
 * Под окном во весь стол (wp-parked), за воротами и в скрытой вкладке — ни кадра. Сети нет. */
(function () {
  "use strict";
  if (typeof document === "undefined" || typeof window === "undefined") return;
  var root = document.documentElement, doc = document;
  var mq = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  function reduced() { return mq.matches || root.getAttribute("data-motion") === "reduced"; }
  function curMood() { var m = root.getAttribute("data-wp-mood"); return (m === "ocean" || m === "aurora") && root.getAttribute("data-theme") !== "light" && !root.classList.contains("sb-depth-nogl") ? m : ""; }
  function parked() { return root.classList.contains("wp-parked") || !!doc.getElementById("sbVaultGate"); }
  function portrait() { return window.innerWidth < 700; }
  /* доля высоты горизонта «зеркала» — как в показе: телефон .66, стол .64 */
  function frac() { return portrait() ? 0.66 : 0.64; }
  var T0 = performance.now();

  /* ── помощники показа — без изменений ── */
  function hsh(k) { var x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
  function gN(x, k) { return Math.sin(x * 0.011 + k * 1.7) * 0.5 + Math.sin(x * 0.027 + k * 3.1) * 0.28 + Math.sin(x * 0.061 + k * 5.3) * 0.14 + Math.sin(x * 0.13 + k * 2.2) * 0.06; }
  function sst(a, b, x) { var v = Math.min(1, Math.max(0, (x - a) / (b - a))); return v * v * (3 - 2 * v); }
  function mixc(a, b, f) { return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]; }
  function rgb(c, a) { return "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + (a === undefined ? 1 : a) + ")"; }
  var MIST = null;
  function mistSpr() {
    if (MIST) return MIST;
    var cv = doc.createElement("canvas"); cv.width = 256; cv.height = 64; var c = cv.getContext("2d"), g = c.createRadialGradient(128, 32, 0, 128, 32, 128);
    g.addColorStop(0, "rgba(190,236,220,1)"); g.addColorStop(0.5, "rgba(190,236,220,.4)"); g.addColorStop(1, "rgba(190,236,220,0)");
    c.setTransform(1, 0, 0, 0.25, 0, 24); c.fillStyle = g; c.fillRect(0, -100, 256, 256); return (MIST = cv);
  }

  /* ── горизонт «зеркало»: drawGround показа, ветка sc = "mirror" в покое (камера на месте, без полёта) ── */
  var hcv = null, hx = null, W = 0, H = 0, K = 1;
  function drawGround(s) {
    var g = hx; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, hcv.width, hcv.height); g.setTransform(K, 0, 0, K, 0, 0);
    var p = portrait(), yh = H * frac(), f = H * (p ? 0.6 : 0.74), hc = 16, cx = W / 2, dz = 170, camZ = 0, zmin = f * hc / (H - yh + 20), zmax = 9500;
    var HZ = [26, 64, 60], DK = [3, 6, 7], wob = 0.18;
    /* 1. вода: свет неба у горизонта, глубина у нас */
    var gb = g.createLinearGradient(0, yh, 0, H); gb.addColorStop(0, "rgb(30,76,70)"); gb.addColorStop(0.12, "rgb(19,50,49)"); gb.addColorStop(0.45, "rgb(9,24,26)"); gb.addColorStop(1, "rgb(4,11,14)"); g.fillStyle = gb; g.fillRect(0, yh, W, H - yh);
    var rg = g.createRadialGradient(W * 0.3, yh, 0, W * 0.3, yh, W * 0.5); rg.addColorStop(0, "rgba(80,220,170,.14)"); rg.addColorStop(1, "rgba(80,220,170,0)"); g.fillStyle = rg; g.fillRect(0, yh, W, H - yh);
    rg = g.createRadialGradient(W * 0.8, yh, 0, W * 0.8, yh, W * 0.35); rg.addColorStop(0, "rgba(130,100,230,.1)"); rg.addColorStop(1, "rgba(130,100,230,0)"); g.fillStyle = rg; g.fillRect(0, yh, W, H - yh);
    /* 3. дальние хребты на бесконечности, с отражением */
    var farL = [[0.03, 0.7, 1], [0.018, 0.35, 2]], li, x, i;
    for (li = 0; li < farL.length; li++) {
      var hgt = farL[li][0], haze = farL[li][1], j = farL[li][2];
      var col = mixc(DK, HZ, haze * 0.9), top = [];
      for (x = 0; x <= W + 4; x += 4) { var h = (0.5 + 0.5 * gN(x * (p ? 1.6 : 0.9) + j * 200, j + 3)) * 0.6; top.push(yh - H * hgt * Math.max(0, h)); }
      g.fillStyle = rgb(mixc(col, [6, 18, 20], 0.5), 0.75); g.beginPath(); g.moveTo(0, yh);
      for (i = 0; i < top.length; i++) g.lineTo(i * 4 + Math.sin((yh + (yh - top[i])) * 0.3 + s * 2) * wob * 0.6, yh + (yh - top[i]) * 0.85);
      g.lineTo(W, yh); g.closePath(); g.fill();
      g.fillStyle = rgb(col); g.beginPath(); g.moveTo(0, yh + 0.5); for (i = 0; i < top.length; i++) g.lineTo(i * 4, top[i]); g.lineTo(W, yh + 0.5); g.closePath(); g.fill();
      g.strokeStyle = "rgba(150,240,205," + (0.05 + 0.05 * (3 - j) / 3).toFixed(3) + ")"; g.lineWidth = 1; g.beginPath(); for (i = 0; i < top.length; i++) g[i ? "lineTo" : "moveTo"](i * 4, top[i] + 0.4); g.stroke();
    }
    /* 4. редкие низкие острова и туман над водой: дальние сначала */
    var k0 = Math.ceil((camZ + zmin * 0.9) / dz), k1 = Math.floor((camZ + zmax) / dz), sides = [-1, 1], k, sdI;
    for (k = k1; k >= k0; k--) {
      var z = k * dz - camZ; if (z < zmin * 0.9) continue; var kk = f / z, base = yh + f * hc / z; if (base > H + 60) continue;
      var hz = 1 - Math.exp(-z / 3800), nf = sst(zmin * 0.9, zmin * 2, z) * Math.min(1, (zmax - z) / 2500), st = z > 3000 ? 8 : (p ? 3 : 4);
      var colI = mixc(DK, HZ, Math.pow(hz, 0.9) * 0.92), colT = mixc(colI, HZ, 0.14);
      for (sdI = 0; sdI < 2; sdI++) {
        var sd = sides[sdI], h1 = hsh(k * 3.1 + sd * 7), h2 = hsh(k * 5.7 + sd * 3), h3 = hsh(k * 2.3 + sd * 11);
        if (h3 < 0.55) continue;
        var xin = 520 + 380 * h1, H0 = 10 + 16 * h2, taper = 300;
        var xs0 = cx + sd * xin * kk; if (sd > 0 && xs0 > W + 4) continue; if (sd < 0 && xs0 < -4) continue;
        var pts = [], xa = sd > 0 ? xs0 : 0, xb = sd > 0 ? W + st : xs0;
        for (x = xa; x <= xb; x += st) { var xw = (x - cx) / kk, dd = Math.abs(xw) - xin, hh = H0 * sst(0, taper, dd) * (0.6 + 0.4 * gN(xw * 0.3 + k * 20, k)); pts.push([x, base - hh * kk]); }
        if (sd > 0) pts.unshift([xs0, base]); else pts.push([xs0, base]);
        g.fillStyle = rgb(mixc(colI, [5, 14, 16], 0.45), 0.82 * nf); g.beginPath();
        for (i = 0; i < pts.length; i++) { var yr = base + (base - pts[i][1]) * 0.9, w2 = Math.sin(yr * 0.33 + s * 2.1 + k) * wob * (0.4 + (yr - yh) / (H - yh) * 2.2); g[i ? "lineTo" : "moveTo"](pts[i][0] + w2, yr); }
        g.lineTo(pts[pts.length - 1][0], base); g.lineTo(pts[0][0], base); g.closePath(); g.fill();
        var ymin = Infinity; for (i = 0; i < pts.length; i++) ymin = Math.min(ymin, pts[i][1]);
        var gr = g.createLinearGradient(0, ymin, 0, base); gr.addColorStop(0, rgb(colT, nf)); gr.addColorStop(1, rgb(colI, nf));
        g.fillStyle = gr; g.beginPath(); for (i = 0; i < pts.length; i++) g[i ? "lineTo" : "moveTo"](pts[i][0], pts[i][1]); g.lineTo(sd > 0 ? W + st : 0, base); g.closePath(); g.fill();
        g.strokeStyle = "rgba(140,232,200," + (0.08 * nf * Math.max(0, 1 - hz * 1.6)).toFixed(3) + ")"; g.lineWidth = 1; g.beginPath(); for (i = 0; i < pts.length; i++) g[i ? "lineTo" : "moveTo"](pts[i][0], pts[i][1] - 0.5); g.stroke();
      }
      if (z < 3200) for (var jj = 0; jj < 2; jj++) { var xw2 = (hsh(k * 7 + jj) * 2 - 1) * 110, x2 = cx + xw2 * kk, w3 = (14 + 26 * hsh(k * 3 + jj)) * kk; g.fillStyle = "rgba(150,240,210," + (0.045 * (1 - z / 3200) * wob).toFixed(3) + ")"; g.fillRect(x2, base - kk * 2 + Math.sin(s * 2 + jj) * kk, w3, Math.max(0.5, kk * 0.35)); }
      if (hsh(k * 9 + 2) < 0.85) {
        var xm = (hsh(k * 13) * 2 - 1) * 260, wM = (500 + 700 * hsh(k * 17)) * kk, hM = (20 + 22 * hsh(k * 19)) * kk;
        g.globalAlpha = 0.26 * nf * (1 - hz * 0.5); g.drawImage(mistSpr(), cx + xm * kk - wM / 2 + Math.sin(s * 0.4 + k) * 6 * kk, base - hM * 0.9, wM, hM); g.globalAlpha = 1;
      }
    }
    /* 5. дымка у горизонта — свет сияния в воздухе */
    var hzg = g.createLinearGradient(0, yh - H * 0.05, 0, yh + H * 0.04); hzg.addColorStop(0, "rgba(60,170,140,0)"); hzg.addColorStop(0.55, "rgba(70,180,150,.12)"); hzg.addColorStop(1, "rgba(60,170,140,0)"); g.fillStyle = hzg; g.fillRect(0, yh - H * 0.05, W, H * 0.09);
    /* 6. «очень тёмная» вода (бриф H4e; правило основателя: никаких больших светлых поверхностей): весь горизонт
       с водой притушен ровной ночной вуалью — рисунок показа тот же, яркость вдвое ниже; слова заметки над
       линией горизонта держат 4,5:1 (note-contrast) */
    var veil = g.createLinearGradient(0, yh - H * 0.06, 0, yh); veil.addColorStop(0, "rgba(1,3,4,0)"); veil.addColorStop(1, "rgba(1,3,4,.55)");
    g.fillStyle = veil; g.fillRect(0, yh - H * 0.06, W, H * 0.06);
    g.fillStyle = "rgba(1,3,4,.55)"; g.fillRect(0, yh, W, H - yh);
  }

  /* ── касание: показ тем v8 (10.11, утверждено) — только ответ на касание, без прежнего фона ── */
  var tcv = null, tx = null, touches = [], SPR = {}, DUR = { ocean: 1.2, aurora: 1.2 }, mood = "";
  function rgba(c, a) { return "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + Math.max(0, Math.min(1, a)).toFixed(4) + ")"; }
  function lift(c, f) { return [c[0] + (255 - c[0]) * f, c[1] + (255 - c[1]) * f, c[2] + (255 - c[2]) * f]; }
  function mix(a, b, f) { return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]; }
  function eo(p) { return 1 - Math.pow(1 - p, 3); }
  function bell(p, up) { p = Math.max(0, Math.min(1, p)); return p < up ? Math.sin(p / up * Math.PI / 2) : Math.pow((1 - p) / (1 - up), 1.7); }
  function n1(t, s) { return Math.sin(t + s) * 0.5 + Math.sin(t * 2.13 + s * 1.7) * 0.3 + Math.sin(t * 3.71 + s * 2.9) * 0.2; }
  function glow(g, x, y, r, c, a) {
    if (a <= 0.002 || r <= 0) return;
    var gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, rgba(c, a)); gr.addColorStop(0.3, rgba(c, a * 0.62)); gr.addColorStop(0.6, rgba(c, a * 0.2)); gr.addColorStop(1, rgba(c, 0));
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function ell(g, x, y, rx, ry, rot, c, a) { if (a <= 0.002) return; g.save(); g.translate(x, y); g.rotate(rot); g.scale(1, ry / rx); glow(g, 0, 0, rx, c, a); g.restore(); }
  function sprite(key, w, h, row) {
    if (SPR[key]) return SPR[key];
    var c = doc.createElement("canvas"), g; c.width = w; c.height = h; g = c.getContext("2d");
    for (var y = 0; y < h; y++) {
      var r = row(y / h), half = w / 2 * r.w, gr = g.createLinearGradient(w / 2 - half, 0, w / 2 + half, 0);
      gr.addColorStop(0, rgba(r.c, 0)); gr.addColorStop(0.25, rgba(r.c, r.a * 0.45)); gr.addColorStop(0.5, rgba(r.c, r.a));
      gr.addColorStop(0.75, rgba(r.c, r.a * 0.45)); gr.addColorStop(1, rgba(r.c, 0));
      g.fillStyle = gr; g.fillRect(w / 2 - half, y, half * 2, 1);
    }
    return (SPR[key] = c);
  }
  function shaftSpr(c) { return sprite("shaft" + c, 384, 768, function (f) { return { w: 0.3 + 0.7 * f, a: Math.min(1, f * 9) * Math.pow(1 - f, 1.5), c: c }; }); }
  function raySpr() { return sprite("ray", 64, 256, function (v) { return { w: 0.75 + 0.25 * v, a: Math.pow(v, 1.7) * Math.pow(Math.min(1, (1 - v) * 3.2), 1.5), c: mix([150, 104, 236], [96, 238, 176], Math.pow(v, 0.8)) }; }); }
  function pinkSpr() { return sprite("pink", 64, 256, function (v) { return { w: 0.8, a: Math.pow(v, 2.2) * Math.pow(Math.min(1, (1 - v) * 2.5), 1.5), c: [255, 116, 168] }; }); }
  function shaft(g, spr, x0, y0, ang, w, L, a) { if (a <= 0.002) return; g.save(); g.globalAlpha = Math.min(1, a); g.translate(x0, y0); g.rotate(ang); g.scale(w / 384, L / 768); g.drawImage(spr, -192, 0); g.restore(); }
  function live(t) { var r = []; for (var i = 0; i < touches.length; i++) { var p = (t - touches[i].t) / DUR[mood]; if (p >= 0 && p < 1) r.push([touches[i], p]); } return r; }
  function tapScene(t, g) {
    var L = live(t), i, j, o, p, a;
    if (mood === "ocean") {
      /* над пальцем открывается просвет: луч от поверхности доходит до пальца, под ним разливается свет */
      var sea = [150, 205, 238], spr = shaftSpr(sea), lean = 0.2 + 0.04 * Math.sin(t * 0.031);
      for (j = 0; j < L.length; j++) {
        o = L[j][0]; p = L[j][1]; var b = bell(p, 0.3), L0 = (o.y + 20) / Math.cos(lean);
        shaft(g, spr, o.x + L0 * Math.sin(lean), -20, lean, W * 0.17, (L0 + 90) * eo(Math.min(1, p / 0.45)), 0.42 * b);
        ell(g, o.x, o.y + 6, 110, 36, 0, lift(sea, 0.45), 0.26 * bell(p, 0.42));
      }
    } else {
      /* занавес сияния просыпается над пальцем: яркость расходится вдоль него, снизу розовая кайма */
      var rs = raySpr(), N = 30, sx = W * 1.3 / (N - 1);
      for (i = 0; i < N; i++) {
        var x = W * -0.15 + sx * i + Math.sin(t * 0.06 + i * 0.5) * 22;
        var base = H * 0.34 + Math.sin(x * 0.004 + t * 0.045) * H * 0.05 + Math.sin(x * 0.0013 - t * 0.03) * H * 0.04;
        var hh = H * (0.2 + 0.09 * Math.sin(i * 1.7 + t * 0.08)), env = 0.55 + 0.45 * Math.sin(i * 0.33 - t * 0.09);
        var boost = 0, fr = 0;
        for (j = 0; j < L.length; j++) {
          o = L[j][0]; p = L[j][1]; var d = Math.abs(x - o.x), front = W * 0.7 * eo(p);
          var k = Math.exp(-(d - front) * (d - front) / (2 * 80 * 80)) * Math.pow(1 - p, 1.3) + Math.exp(-d * d / (2 * 70 * 70)) * bell(p, 0.12);
          boost += k; fr += k;
        }
        /* занавес виден только там, где его разбудило касание: у фронта — та же сила, что в v8 (покой 1 + вспышка 3,4), вдали — ничего */
        a = 0.27 * (0.35 + 0.65 * n1(t * 0.12 + i * 0.37, i)) * env * (1 + 3.4 * boost) * Math.min(1, boost * 2.5);
        if (a > 0.002) { g.save(); g.globalAlpha = Math.min(1, a); g.translate(x, base - hh); g.scale(sx * 2.6 / 64, hh * 1.06 / 256); g.drawImage(rs, -32, 0); g.restore(); }
        if (fr > 0.02) { g.save(); g.globalAlpha = Math.min(1, 0.2 * fr); g.translate(x, base - hh * 0.3); g.scale(sx * 2.6 / 64, hh * 0.55 / 256); g.drawImage(pinkSpr(), -32, 0); g.restore(); }
      }
      for (j = 0; j < L.length; j++) glow(g, L[j][0].x, L[j][0].y, 60, [110, 236, 190], 0.07 * bell(L[j][1], 0.2));
    }
  }

  /* ── такты: горизонт — раз в полсекунды (покой глубины), касание — каждый кадр, пока оно живо ── */
  var raf = 0, rest = 0, dirty = true, KT = 1;
  var DESK_IDS = { desktop: 1, sbIconLayer: 1, sbNoteLayer: 1, sbWidgetLayer: 1 };
  /* ОТКАТ: касание не по одному из слоёв стола (DESK_IDS) — своё, если пришлось на сам фон .wp-layer; иначе не наше (окно, панель) */
  function underBar(y) {
    /* ПОЛОСА СВЕРХУ — МЕБЕЛЬ И ТАМ, ГДЕ ОНА ПРОПУСКАЕТ КАСАНИЕ (H4e2, D-1320): пустая середина полосы касаний не
       ловит (themes.css), и палец проходил сквозь неё на стол. Пока полоса видна, её высота — не стол. */
    var b = document.getElementById("topbar"); if (!b) return false;
    var r = b.getBoundingClientRect(), cs = getComputedStyle(b);
    return r.height > 0 && r.bottom > 0 && y >= r.top && y <= r.bottom && cs.visibility !== "hidden" && cs.display !== "none" && +cs.opacity > 0.05;
  }
  function ownTap(t, y) { return !!(t && t.nodeType === 1 && t.closest && !(y != null && underBar(y)) && (DESK_IDS[t.id] || t.closest(".wp-layer"))); }
  function size() {
    if (!hcv) return;
    W = window.innerWidth; H = window.innerHeight; K = Math.min(window.devicePixelRatio || 1, 1.5); K = Math.min(K, Math.sqrt(2.4e6 / Math.max(1, W * H)));
    KT = Math.min(1, 1400 / Math.max(W, H, 1));
    fit();
    dirty = true; kick();
  }
  /* холсты держат полный размер, только пока нужны: горизонт — в Авроре, касание — пока оно живо. Иначе 2×2:
     два полноэкранных холста без дела занимали память GPU, и на слабом (программном) GPU стол терял кадры
     (window-one-glass: подпись окна в Океане не успевала погаснуть к снимку) */
  /* и в странице стоят, только пока нужны: без дела их нет среди слоёв стола (на слабом GPU лишние холсты в слое
     фона замедляли кадры стола: window-one-glass, подпись окна не успевала погаснуть к снимку) */
  var hLayer = null, hAfter = null;
  /* порядок в слое: глубина, горизонт, касание */
  function place(c, on, prev) {
    if (!hLayer) return;
    if (on && c.parentNode !== hLayer) { var p0 = prev && prev.parentNode === hLayer ? prev : hAfter; hLayer.insertBefore(c, p0 ? p0.nextSibling : null); }
    else if (!on && c.parentNode) c.parentNode.removeChild(c);
  }
  function fit() {
    var aur = mood === "aurora", hw = aur ? Math.max(2, Math.round(W * K)) : 2, hh = aur ? Math.max(2, Math.round(H * K)) : 2;
    if (hcv.width !== hw || hcv.height !== hh) { hcv.width = hw; hcv.height = hh; dirty = true; }
    var on = touches.length > 0, tw = on ? Math.max(2, Math.round(W * KT)) : 2, th = on ? Math.max(2, Math.round(H * KT)) : 2;
    if (tcv.width !== tw || tcv.height !== th) { tcv.width = tw; tcv.height = th; }
    place(hcv, aur, null); place(tcv, on, hcv);
  }
  function frame(now) {
    raf = 0;
    var m = curMood();
    if (m !== mood) { mood = m; touches = []; dirty = true; }
    fit();
    root.classList.toggle("sb-horizon", mood === "aurora");
    if (!mood || parked() || doc.hidden) return;
    var still = reduced(), t = still ? 12 : (now - T0) / 1000;
    if (still) touches = [];
    touches = touches.filter(function (o) { return t - o.t < DUR[mood]; });
    /* окно на столе — вода стоит (один кадр): под стеклом окна живой холст не перерисовывается */
    var calm = still || !!doc.querySelector("#windowLayer .window:not(.minimized):not(.closing)");
    if (mood === "aurora" && (dirty || (!calm && !rest))) { drawGround(still ? 0 : t * 0.5); dirty = false; if (!calm) rest = setTimeout(function () { rest = 0; kick(); }, 500); else if (!still) rest = setTimeout(function () { rest = 0; kick(); }, 1000); }
    /* холст касания виден и перерисовывается только пока касание живо: в покое он снят со страницы
       (полноэкранный холст, стираемый на каждую смену классов корня, мешал составлению окон поверх стола) */
    var liveTap = touches.length > 0;
    if (liveTap || tcv.classList.contains("live")) { tx.setTransform(1, 0, 0, 1, 0, 0); tx.clearRect(0, 0, tcv.width, tcv.height); }
    tcv.classList.toggle("live", liveTap);
    if (!liveTap) fit();
    if (liveTap) { tx.setTransform(KT, 0, 0, KT, 0, 0); tapScene(t, tx); raf = requestAnimationFrame(frame); }
  }
  function kick() { if (!raf && hcv) raf = requestAnimationFrame(frame); }
  function mount() {
    var layer = doc.querySelector(".wp-layer"), after = doc.getElementById("sbDepthField"); if (!layer) return;
    hcv = doc.createElement("canvas"); hcv.id = "sbHorizon"; hcv.setAttribute("aria-hidden", "true");
    tcv = doc.createElement("canvas"); tcv.id = "sbThemeTap"; tcv.setAttribute("aria-hidden", "true");
    hLayer = layer; hAfter = after && after.parentNode === layer ? after : null;
    hx = hcv.getContext("2d"); tx = tcv.getContext("2d");
    window.addEventListener("pointerdown", function (e) {
      if (!mood || reduced() || parked() || !ownTap(e.target, e.clientY)) return;
      touches.push({ x: e.clientX, y: e.clientY, t: (performance.now() - T0) / 1000 }); if (touches.length > 6) touches.shift();
      kick();
    }, { passive: true });
    window.addEventListener("resize", size);
    doc.addEventListener("visibilitychange", kick);
    /* как у глубины выше: кадр — только когда изменилось видимое на фоне (тема, движение, инкогнито, Турбо, «накрыто
       окном», без WebGL); прочие классы корня (перетаскивание, окна, ввод) кадра не стоят — иначе каждое движение окна
       заказывало кадр, и на слабом GPU стол отставал (window-one-glass) */
    var stampH = function () { var c = root.classList; return [root.getAttribute("data-wp-mood"), root.getAttribute("data-theme"), root.getAttribute("data-motion"), c.contains("sb-incognito"), c.contains("sb-turbo"), c.contains("wp-parked"), c.contains("sb-depth-nogl"), c.contains("has-windows"), c.contains("sb-has-session"), c.contains("rv-scene")].join("|"); };
    var seenH = stampH();
    new MutationObserver(function () { var st = stampH(); if (st === seenH) return; seenH = st; dirty = true; kick(); }).observe(root, { attributes: true, attributeFilter: ["data-wp-mood", "data-theme", "data-motion", "class"] });
    if (mq.addEventListener) mq.addEventListener("change", function () { dirty = true; kick(); });
    size();
  }
  window.sbHorizon = { frac: frac, get mood() { return mood; }, get touches() { return touches.length; } };
  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", mount); else mount();
})();
