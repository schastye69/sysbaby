/* sys.baby OS — core/svetlica.js
 * СВЕТЛИЦА — СВЕТЛЫЙ РЕЖИМ С ЧЕТЫРЬМЯ ТЕМАМИ · D-1323 (основатель 18.11.2026: «включить темы Светлицы в архив»).
 * Перенесено из эталона svetlitsa-ETALON-17-11.html (папка demo-na-proverke) (демо 17.11, блок dm-script)
 * как есть: тот же шейдер, то же «зеркало» Лазури, та же пыль Светлицы и те же касания. Светлица — образ «А · Окно»
 * (вид эталона по умолчанию). Не перенесено то, что было обвязкой показа: пульт демо, режим «днём светлая, ночью
 * тёмная», подмена часов, выбор образа и его память. Тёмные темы этот слой не трогает: двойник надевается, когда
 * у системы светлая тема (data-theme="light") — Тайник → Светлица, Затмение → Зенит, Океан → Берег, Аврора → Лазурь;
 * тему выбирают Настройки и пульт системы. Гость — всегда тёмный (D-326).
 * Стили — os/core/themes.css, блок «СВЕТЛИЦА · ЧЕТЫРЕ ТЕМЫ». ОТКАТ: снять подключение файла в os/index.html и блок. */
(function () {
"use strict";
if (typeof document === "undefined" || typeof window === "undefined") return;
const root = document.documentElement, doc = document;
const TW = { studio: "svetlica", ember: "zenit", eclipse: "zenit", ocean: "bereg", aurora: "aurora" };
TW.aurora = "lazur";
const TWI = { svetlica: 0, zenit: 1, bereg: 2, lazur: 3 };
const NAME = { studio: ["Тайник", "Окно"], ember: ["Затмение", "Зенит"], ocean: ["Океан", "Берег"], aurora: ["Аврора", "Лазурь"] };
const mq = matchMedia("(prefers-reduced-motion: reduce)");
const reduced = () => mq.matches || root.getAttribute("data-motion") === "reduced";
const moodNow = () => { const m = root.getAttribute("data-wp-mood"); return m === "eclipse" ? "ember" : (NAME[m] ? m : "studio"); };
function twinNow() {
  if (root.getAttribute("data-theme") !== "light" || root.classList.contains("sb-incognito") || doc.getElementById("sbVaultGate")) return "";
  return TW[moodNow()] || "svetlica";
}

/* ───────────── фон двойника: один холст WebGL ───────────── */
const FS = `precision highp float;
uniform vec2 uRes; uniform float uT, uTw, uBr, uTap, uHz, uSv, uKs; uniform vec4 uTp;
/* шов смены темы (H4e3, D-1334): та же механика, что у Очага (depth.js main, uMode 1) */
uniform float uMode, uTwB, uR, uSeam, uPx; uniform vec2 uO; uniform vec3 uSc;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
/* узлы шума — одно значение на узел (D-1330, как в depth.js): прежний h1, посчитанный один раз на узел, четыре угла
   клетки — в одном текселе текстуры решётки (latTex); n2 читает клетку одним обращением. На настольном GPU рисунок пятен
   тот же, на мобильном шум не рвётся по линиям решётки (прямоугольники с жёсткими краями у часов и заметки). Решётка
   замкнута (период 1024 узла); без кадрового буфера — hq, целым счётом. */
uniform sampler2D uLat;
float hq(vec2 c){ c = mod(c, 256.); float a = mod(c.x*157. + c.y*113. + 41., 4096.);
  a = mod(floor(a*a/4096.) + a*61. + c.x + 11., 4096.); a = mod(floor(a*a/4096.) + a*61. + c.y + 11., 4096.);
  a = mod(floor(a*a/4096.) + a*61. + 18., 4096.); return a/4096.; }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
#ifdef SB_NOLAT
  vec4 v = vec4(hq(i), hq(i+vec2(1.,0.)), hq(i+vec2(0.,1.)), hq(i+vec2(1.,1.)));
#else
  vec4 v = texture2D(uLat, (mod(i + 512., 1024.) + .5)/1024.);
#endif
  return mix(mix(v.x, v.y, f.x), mix(v.z, v.w, f.x), f.y); }
float fbm(vec2 p){ return n2(p)*.6 + n2(p*2.1+5.3)*.28 + n2(p*4.3+1.7)*.12; }
vec3 C(float r, float g, float b){ return vec3(r, g, b)/255.; }
const float TAU = 6.2831853;
/* вода Океана — та же функция и те же скорости (depth.js, D-1306) */
float water(vec2 q, float t){
  vec2 w = vec2(fbm(q*1.3 + vec2(t*.050, -t*.031)), fbm(q*1.3 + vec2(-t*.041, t*.027) + 7.7));
  float v = fbm(q*2.0 + w*1.6 + vec2(t*.022, t*.015));
  return smoothstep(.42, .78, v); }
vec3 svetlica(vec2 p, float t){
  float W = uRes.x, H = uRes.y, mn = min(W, H); vec2 q = p/mn; float y = p.y/H;
  float b1 = sin(TAU*t/11.), b2 = sin(TAU*t/13.5 + 1.3);
  vec3 col = mix(C(238.,225.,202.), C(222.,201.,166.), smoothstep(0., 1., y));
  float form = fbm(q*1.15 + vec2(t*(.006 + .012*uBr), -t*(.004 + .009*uBr)));
  vec2 s = (p - vec2(W*.32, -H*.08))/mn; float g = exp(-dot(s, s)*1.15);
  col += C(255.,238.,206.)*.08*g*(1. + .10*b1*uBr)*(.75 + .5*form);
  /* тёплый янтарь в глубине — там, где у Тайника сияет середина */
  vec2 m = (p - vec2(W*.5, H*.36))/max(W, H); float gm = exp(-dot(m, m)*4.);
  col = mix(col, C(232.,196.,148.), .16*gm*(.8 + .4*b2*uBr));
  col += C(200.,140.,70.)*.05*(form - .5);
  return col; }
vec3 zenit(vec2 p, float t){
  float W = uRes.x, H = uRes.y, mn = min(W, H); float y = p.y/H;
  vec3 col = mix(C(240.,229.,200.), C(225.,206.,165.), smoothstep(0., 1., y));
  /* геометрия диска — та же, что у Затмения (eclipse.js: .62 W, .40 H, R .36 меньшей стороны) */
  vec2 c = vec2(W*.62, H*.4); float R = mn*.36;
  float ang = t*TAU/60., br = .75 + .25*sin(t*TAU/13.);
  vec2 d2 = p - c; float d = length(d2), rr = d/R, a = atan(d2.y, d2.x);
  float st = fbm(vec2(a*1.6 + t*.012, rr*1.2 - t*.03)) ;
  float cor = exp(-max(rr - 1., 0.)*2.4)*smoothstep(.86, 1.03, rr);
  vec2 sp = c + vec2(cos(ang), sin(ang))*R*.5; vec2 sd = (p - sp)/(R*1.15);
  float spot = exp(-dot(sd, sd)*2.2);
  float tap = 1. + 1.1*uTap;
  vec3 gold = C(246.,196.,108.), cream = C(255.,247.,226.);
  col += C(250.,214.,140.)*.10*exp(-rr*rr*.30)*br*tap;
  col = mix(col, gold, clamp(.30*cor*(.55 + .8*st)*br*tap + .10*spot*br*tap*smoothstep(.95, 1.15, rr), 0., .6));
  float disk = smoothstep(R*1.05, R*.86, d);
  col = mix(col, cream, disk*(.34 + .05*sin(t*TAU/13.)*uBr));
  col = mix(col, C(255.,236.,190.), disk*.18*spot);
  return col; }
vec3 bereg(vec2 p, float t){
  float W = uRes.x, H = uRes.y, mn = min(W, H); vec2 q = p/mn; float y = p.y/H;
  float b3 = sin(TAU*t/9. + 2.1);
  /* линия берега там же, где у Океана поднимается свет (.86 H), и дышит так же */
  float hz = H*((W > H ? .86 : .87) + .012*b3*uBr);
  float shore = smoothstep(hz - H*.42, hz + H*.04, p.y);
  vec3 col = mix(C(172.,210.,212.), C(198.,224.,216.), smoothstep(0., .7, y));
  col = mix(col, C(226.,214.,188.), shore*.9);
  /* D-1346 (основатель 18.11: «Берег чуть дёргается; движение воды заметнее — ярче, но спокойно, без больших светлых
     пятен и полосы внизу»): поле течения wv считается один раз (прежде water() считал его второй раз — 6 fbm на пиксель,
     теперь 4; пятна w те же); рябь (rid — тонкие светлые нити) ярче почти вдвое, пятна — чуть тише; к берегу всё гаснет */
  vec2 wv = vec2(fbm(q*1.3 + vec2(t*.050, -t*.031)), fbm(q*1.3 + vec2(-t*.041, t*.027) + 7.7));
  float w = smoothstep(.42, .78, fbm(q*2.0 + wv*1.6 + vec2(t*.022, t*.015)));
  float n = fbm(q*3.4 + wv*1.6 + vec2(t*.022, t*.015));
  float rid = pow(1. - abs(n - .5)*2., 4.);
  float sh = 1. - shore*.75;
  col += C(255.,252.,236.)*(.032*w + .085*rid)*sh;
  col -= C(40.,90.,96.)*.035*(1. - w)*(1. - shore);
  return col; }
vec3 lazur(vec2 p, float t){
  float W = uRes.x, H = uRes.y, mn = min(W, H);
  float hzY = H*uHz;
  float b2 = sin(TAU*t/13.5 + 1.3), b3 = sin(TAU*t/9. + 2.1);
  float form = fbm(p/mn*1.15 + vec2(t*(.006 + .012*uBr), -t*(.004 + .009*uBr)));
  vec3 col = mix(C(182.,207.,232.), C(224.,235.,240.), smoothstep(0., hzY, p.y));
  float dp = max(hzY - p.y, 0.);
  float wv = 1. + uBr*.16*sin(p.x/W*2.6 + t*.21)*(.55 + .45*b2);
  col += C(255.,250.,240.)*.12*exp(-dp/(mn*.24*wv));
  /* зелёный — лёгкий след сияния по краям; места — те же, что у дальних облаков Авроры */
  vec2 o1 = uBr*vec2(.018*sin(t*.11), .014*sin(t*.083 + 1.))*mn, o2 = uBr*vec2(.016*sin(t*.095 + 2.), .02*sin(t*.07))*mn;
  vec2 f1 = (p - vec2(W*.98, H*.12) - o1)/mn; float g1 = exp(-dot(f1*vec2(1., 1.25), f1*vec2(1., 1.25))*3.2);
  vec2 f2 = (p - vec2(W*.0, H*.46) - o2)/mn; float g2 = exp(-dot(f2*vec2(1.5, .9), f2*vec2(1.5, .9))*4.);
  float kz = 1. + .14*b2*uBr;
  col = mix(col, C(132.,206.,170.), clamp(.42*kz*g2*(.45 + 1.1*form), 0., .6));
  col = mix(col, C(150.,206.,184.), clamp(.32*kz*g1*(.45 + 1.1*form), 0., .5));
  col = mix(col, C(186.,178.,232.), clamp(.10*kz*g1*form, 0., .2));
  col = mix(col, C(150.,214.,184.), .08*exp(-dp/(mn*.05))*(1. + .2*b3*uBr));
  col = mix(col, C(150.,214.,184.), clamp(.25*uTap, 0., .25)*exp(-dp/(mn*.3)));
  return col; }

/* ══ СВЕТЛИЦА: три образа (демо 17.11). Шейдер считает в пикселях холста; uKs — пикселей холста на CSS px.
   uTp — последнее касание (x, y в пикселях холста; возраст, с; сила). Низ сходится с полом в main. ══ */
float bellG(float a, float dur){ if (a < 0.) return 0.; float q = clamp(a/dur, 0., 1.); return q < .2 ? sin(q/.2*1.5708) : pow((1.-q)/.8, 1.7); }
vec3 wallSv(vec2 p, float W, float H){
  float mn = min(W, H);
  vec3 col = mix(C(237.,224.,201.), C(225.,205.,171.), smoothstep(0., 1., p.y/H));
  return col*(1. + .02*(fbm(p/mn*6.) - .5) + .01*(fbm(p/mn*38.) - .5)); }
vec3 tapWarm(vec2 p, float mn, float dur){
  float b = bellG(uTp.z, dur)*uTp.w; if (b <= 0.) return vec3(0.);
  vec2 q = (p - uTp.xy)/(mn*.16); return C(255.,214.,150.)*.10*b*exp(-dot(q, q)); }

/* ── А. ОКНО: солнце кладёт на тёплую стену проём арочного окна — рама и ветка в тени; в луче — пылинки ── */
float leafSh(vec2 q, float t, float rust){
  float sh = 0.;
  for (int i = 0; i < 11; i++){ float fi = float(i);
    float s = fi/10.;
    vec2 stem = vec2(-.70 + s*.85, -.22 + s*s*.40);
    float sw = (.07*sin(t*.5 + fi*.9) + .03*sin(t*1.3 + fi*2.1))*rust;
    float ang = (mod(fi, 2.) < .5 ? -1.0 : 2.2) + sw + .3*sin(fi*3.7);
    vec2 d = q - stem; vec2 r = vec2(cos(ang)*d.x + sin(ang)*d.y, -sin(ang)*d.x + cos(ang)*d.y) - vec2(.10, 0.);
    sh = max(sh, 1. - smoothstep(.6, 1.4, length(r/vec2(.11, .045))));
  }
  float s = clamp((q.x + .75)/.9, 0., 1.);
  float br = (1. - smoothstep(.01, .03, abs(q.y - (-.22 + s*s*.40))))*step(-.8, q.x)*step(q.x, .15);
  return max(sh, br*.85); }
vec3 okno(vec2 p, float t){
  float W = uRes.x, H = uRes.y, mn = min(W, H); bool port = W < H*.9;
  vec3 col = wallSv(p, W, H);
  float b = bellG(uTp.z, 2.6)*uTp.w;
  vec2 P0 = port ? vec2(W*.58, H*.63) : vec2(W*.72, H*.53);
  float hh = port ? H*.30 : H*.40, ww = hh*.64;
  vec2 q = p - P0; q.x -= q.y*.40;
  q /= vec2(ww, hh);                     /* x: ±.5 ширина, y: -.5 … .5 высота */
  float ar = ww/hh;                      /* полукруг сверху: радиус .5 ширины */
  float yTopRect = -.5 + .5*ar;          /* где кончается полукруг */
  float sd = q.y > yTopRect ? max(abs(q.x) - .5, q.y - .5) : length(vec2(q.x, (q.y - yTopRect)/ar)) - .5;
  float blur = .035 + .06*clamp(.5 - q.y, 0., 1.);
  float pane = 1. - smoothstep(-blur, blur, sd);
  float mull = 1. - smoothstep(.022, .022 + blur, abs(q.x));
  float tran = 1. - smoothstep(.014, .014 + blur, abs(q.y - yTopRect - .06));
  float frame = max(mull, tran);
  float leaf = leafSh(q, t*uBr, 1. + 3.*b);
  float cloud = 1. - uBr*.12*smoothstep(.35, .85, n2(vec2(t*.045, 1.7)));
  float lit = pane*(1. - .85*frame)*(1. - .62*leaf)*cloud;
  col = mix(col, col*.985 + C(255.,214.,140.)*.15, lit);
  col += C(255.,190.,100.)*.035*lit*(.5 + .5*q.y);
  col += C(250.,190.,110.)*.06*(1. - smoothstep(0., .06, abs(sd)))*pane*cloud;
  /* луч в воздухе — к проёму из левого верха; в нём пылинки */
  vec2 dir = normalize(vec2(.40, 1.));
  vec2 rp = p - P0; float along = dot(rp, dir), across = rp.x*dir.y - rp.y*dir.x;
  float beam = (1. - smoothstep(ww*.35, ww*.85, abs(across)))*smoothstep(-H*1.3, -hh*.2, along)*(1. - smoothstep(-hh*.3, hh*.2, along));
  col += C(255.,232.,190.)*.035*beam*cloud;
  float g = 30.*uKs; vec2 cell = floor(p/g); vec2 f = p/g - cell;
  vec2 mp = vec2(h1(cell), h1(cell + 4.1)) + uBr*vec2(.2*sin(t*.23 + h1(cell + 2.)*6.), .2*cos(t*.19 + h1(cell + 7.)*6.));
  mp = .2 + .6*fract(mp);
  float md = length((f - mp)*g)/uKs;
  float tw = .55 + .45*sin(t*(.5 + h1(cell + 9.)) + h1(cell)*20.);
  float mote = (1. - smoothstep(.5, 1.6, md))*step(.5, h1(cell + 3.3))*tw;
  col = mix(col, C(255.,252.,240.), mote*.8*clamp(beam*1.4 + lit*.7, 0., 1.));
  col = mix(col, C(150.,96.,44.), mote*.12*(1. - clamp(beam*1.4 + lit, 0., 1.))*0.);
  col += tapWarm(p, mn, 2.6);
  return col; }

/* ── Б. ТЮЛЬ: за лёгкой занавеской — солнечное окно; складки светятся и дышат от ветерка ── */
vec3 tyul(vec2 p, float t){
  float W = uRes.x, H = uRes.y, mn = min(W, H), y = p.y/H;
  float b = bellG(uTp.z, 3.)*uTp.w;
  /* что за тюлем: светлый проём окна с рамой, мягко размыт */
  vec2 wc = vec2(W*.5, H*.40); vec2 wq = (p - wc)/vec2(W*.42, H*.52);
  float win = 1. - smoothstep(.2, 1.1, length(wq));
  float frm = (1. - smoothstep(.02, .09, abs(wq.x))) + (1. - smoothstep(.02, .09, abs(wq.y + .08)));
  vec3 col = mix(C(222.,200.,164.), C(255.,242.,214.), win);
  /* складки: вертикальные, к низу чуть шире, качаются волной ветерка */
  float gust = 0.;
  if (uTp.w > 0.) { float dx = (p.x - uTp.x)/(mn*.35); gust = b*1.4*exp(-dx*dx)*sin(dx*3. - uTp.z*4.); }
  float u = p.x/W;
  float sw = uBr*(.55*sin(t*.33 - u*2.3) + .25*sin(t*.57 + u*5.1))*(.3 + .7*y) + gust*(.4 + .6*y);
  float k1 = clamp(W/uKs/200., 3.2, 8.5), k2 = k1*1.76;
  float ph = TAU*(k1*u) + sw*2.2 + .6*sin(TAU*1.7*u + .9);
  float ph2 = TAU*(k2*u) + sw*3.1 + 1.3;
  float hgt = .62*sin(ph) + .25*sin(ph2) + .3*sin(TAU*4.3*u + sw);
  float slope = .62*cos(ph)*k1 + .25*cos(ph2)*k2*1.1;
  slope /= 11.;
  float dbl = pow(1. - abs(slope), 6.);            /* где ткань ложится вдвое — светлая полоска */
  float sh = .5 + .5*clamp(slope, -1., 1.);        /* свет сквозь ткань: склоны к окну светлее */
  float thick = .28 + .30*(1. - abs(clamp(slope, -1., 1.)));
  vec3 cloth = C(250.,238.,216.);
  col = mix(col, cloth*mix(.90, 1.03, sh), thick);
  col += C(255.,236.,200.)*.07*dbl*(.4 + .6*win);
  col -= C(80.,50.,20.)*.025*(1. - sh)*(1. - .5*win);
  /* верх — сборка на карнизе, чуть темнее; низ — подол растворяется в полу */
  col *= 1. - .05*(1. - smoothstep(.0, .08, y));
  col += tapWarm(p, mn, 3.);
  return col; }

/* ── В. ШЁЛК: медовая шёлковая лента лежит в свете, поворачиваясь то лицом, то ребром ── */
vec4 ribbonSv(vec2 p, float W, float H, float t, float c0, float c1, float wd, float tw0, float tws, float ph, float gust){
  float X = p.x/W;
  c0 -= .10*(1. - smoothstep(560., 820., H/uKs));   /* низкий экран: ленты выше нижних 80 px (floor-seam) */
  float c = H*(c0 + c1*X + .045*sin(TAU*(.75*X + .021*t) + ph) + .02*sin(TAU*(1.9*X - .033*t) + ph*2.));
  float w = H*wd*(1. + .3*sin(TAU*(1.1*X + .017*t) + ph + 1.));
  float tw = 3.14159*(tws*X + tw0 + .22*sin(TAU*(.55*X - .019*t) + ph)) + gust;
  float ct = cos(tw);
  float hw = .5*w*abs(ct) + 1.2*uKs;
  float dy = p.y - c;
  float on = 1. - smoothstep(hw - 1.2, hw + 1.2, abs(dy));
  float v = clamp(dy/(w*(abs(ct) < .02 ? .02 : ct)) + .5, 0., 1.);
  float face = abs(ct);
  float sheen = pow(1. - face, 2.);
  float spec = exp(-pow((tw - 3.14159*floor(tw/3.14159) - 1.2)/.3, 2.));
  float across = .75 + .25*sin(v*3.14159);
  float lum = (mix(.35, .55, step(0., ct))*across + .7*sheen + .5*spec*face);
  return vec4(lum, on, abs(dy) - hw, w); }
vec3 shyolk(vec2 p, float t){
  float W = uRes.x, H = uRes.y, mn = min(W, H); bool port = W < H*.9;
  vec3 col = wallSv(p, W, H);
  vec2 g0 = (p - vec2(W*.3, H*.15))/vec2(W, H); col += C(255.,240.,210.)*.05*exp(-dot(g0, g0)*3.);
  float b = bellG(uTp.z, 3.)*uTp.w, gust = 0.;
  if (uTp.w > 0.) { float dx = (p.x - uTp.x)/(mn*.3); gust = b*.9*exp(-dx*dx)*sin(dx*2. - uTp.z*3.); }
  float tt = t*uBr + 20.;
  vec4 r2 = port ? ribbonSv(p, W, H, tt, .76, -.12, .05, .7, 1.3, 2.1, gust*.6) : ribbonSv(p, W, H, tt, .82, -.30, .06, .7, 1.1, 2.1, gust*.6);
  vec4 r1 = port ? ribbonSv(p, W, H, tt, .82, -.06, .095, .1, 1.5, 0., gust) : ribbonSv(p, W, H, tt, .88, -.24, .115, .1, 1.7, 0., gust);
  /* тень ленты на стене — ниже и мягче */
  vec4 s1 = port ? ribbonSv(p - vec2(0., mn*.035), W, H, tt, .82, -.06, .095, .1, 1.5, 0., gust) : ribbonSv(p - vec2(0., mn*.035), W, H, tt, .88, -.24, .115, .1, 1.7, 0., gust);
  col *= 1. - .10*exp(-max(s1.z, 0.)/(mn*.03));
  vec3 deep = C(186.,112.,48.), mid = C(232.,170.,98.), hi = C(255.,246.,226.);
  vec3 c2 = mix(deep, mid, clamp(r2.x, 0., 1.)); c2 = mix(c2, hi, pow(clamp(r2.x - .6, 0., 1.), 1.5)*1.2);
  col = mix(col, mix(col, c2, .8), r2.y);
  vec3 c1 = mix(deep, mid, clamp(r1.x, 0., 1.)); c1 = mix(c1, hi, pow(clamp(r1.x - .55, 0., 1.), 1.3)*1.3);
  col = mix(col, c1, r1.y);
  col += tapWarm(p, mn, 3.);
  return col; }

vec3 twin(float tw, vec2 p){
  vec3 col;
  if (tw < .5) { if (uSv < .5) col = svetlica(p, uT); else if (uSv < 1.5) col = okno(p, uT); else if (uSv < 2.5) col = tyul(p, uT); else col = shyolk(p, uT);
    float fy = smoothstep(uRes.y*.82, uRes.y, p.y); col = mix(col, C(221.,200.,166.), fy*fy*(3. - 2.*fy)); }
  else if (tw < 1.5) col = zenit(p, uT); else if (tw < 2.5) col = bereg(p, uT); else col = lazur(p, uT);
  return col; }
void main(){
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec3 col;
  if (uMode < .5) col = twin(uTw, p);
  else {
    /* ШОВ — КАК У ОЧАГА (depth.js): кольцо от точки касания, живая гладкая кромка, впереди старая тема чуть гаснет,
       позади новая чуть светлее; кромка — цветом новой темы (uSc, --tw-acc-rgb), а не светом поверх тёмного */
    float mn = min(uRes.x, uRes.y);
    float d = length(p - uO);
    float wob = (fbm(p/mn*2.4 + vec2(uT*.3, -uT*.22)) - .5)*mn*.035*min(1., uR/(mn*.4));
    float dd = d + wob;
    float soft = mn*.02;
    float m = smoothstep(uR + soft, uR - soft, dd);
    vec3 Ac = vec3(0.), Bc = vec3(0.);
    if (m < .999) { vec3 A = twin(uTw, p); float ahead = exp(-max(dd - uR, 0.)/(mn*.10))*(1. - m); Ac = A*(1. - .35*ahead*uSeam); }
    /* позади кромки Очаг светлеет (×1,8 на тёмном); светлая тема от этого пересвечивалась в белое — здесь та же форма и
       тот же спад, но новая тема тянется к акценту темы (до 25 %): свет шва — цветом Светлицы */
    if (m > .001) { vec3 B = twin(uTwB, p); float behind = exp(-max(uR - dd, 0.)/(mn*.14))*m; Bc = mix(B, uSc, clamp(.25*behind*uSeam, 0., 1.)); }
    float rw = max(uPx*1.5, mn*.0028);
    float seam = exp(-pow((dd - uR)/rw, 2.)) + .30*exp(-pow((dd - uR)/(mn*.03), 2.));
    col = mix(mix(Ac, Bc, m), uSc, clamp(seam*.55*uSeam, 0., 1.));
  }
  col += (h1(gl_FragCoord.xy + fract(uT)*91.) - .5)*(2./255.);
  gl_FragColor = vec4(col, 1.);
}`;
const VS = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

const SVI = { kak: 0, okno: 1, tyul: 2, shyolk: 3 };
const sv = "okno";   /* образ Светлицы — «А · Окно», вид эталона по умолчанию */
let sky, hz, fx, gl, U = {}, hx, fxx, W = 0, H = 0, K = 1, T0 = performance.now(), raf = 0, tw = "", lastHz = 0, motes = [], taps = [];
/* текстура решётки (D-1330): проход 1 — узел (x − 512, y − 512) → прежний h1 (24 бита); проход 2 — в тексель клетки
   четыре её угла (по 8 бит), копии одного значения узла. Один раз при сборке. */
const LAT_FS = `precision highp float;
float h1(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
void main(){ vec2 c = floor(gl_FragCoord.xy) - 512.; float h = h1(c);
  gl_FragColor = vec4(floor(h*256.), floor(fract(h*256.)*256.), floor(fract(h*65536.)*256.), 255.)/255.; }`;
const LAT4_FS = `precision highp float;
uniform sampler2D uA;
float g(vec2 o){ return dot(texture2D(uA, (floor(gl_FragCoord.xy) + o + .5)/1024.).rgb, vec3(255./256., 255./65536., 255./16777216.)); }
void main(){ gl_FragColor = vec4(g(vec2(0., 0.)), g(vec2(1., 0.)), g(vec2(0., 1.)), g(vec2(1., 1.))); }`;
function latTex(g, sh) {
  try {
    const run = (fs, unit, prep) => {
      const pr = g.createProgram(); g.attachShader(pr, sh(g.VERTEX_SHADER, VS)); g.attachShader(pr, sh(g.FRAGMENT_SHADER, fs)); g.linkProgram(pr);
      if (!g.getProgramParameter(pr, g.LINK_STATUS)) return null;
      g.useProgram(pr); if (prep) prep(pr);
      const la = g.getAttribLocation(pr, "a"); g.enableVertexAttribArray(la); g.vertexAttribPointer(la, 2, g.FLOAT, false, 0, 0);
      const tx = g.createTexture(); g.activeTexture(unit); g.bindTexture(g.TEXTURE_2D, tx);
      g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, 1024, 1024, 0, g.RGBA, g.UNSIGNED_BYTE, null);
      for (const k of [g.TEXTURE_MIN_FILTER, g.TEXTURE_MAG_FILTER]) g.texParameteri(g.TEXTURE_2D, k, g.NEAREST);
      for (const k of [g.TEXTURE_WRAP_S, g.TEXTURE_WRAP_T]) g.texParameteri(g.TEXTURE_2D, k, g.REPEAT);
      const fb = g.createFramebuffer(); g.bindFramebuffer(g.FRAMEBUFFER, fb);
      g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, tx, 0);
      const done = g.checkFramebufferStatus(g.FRAMEBUFFER) === g.FRAMEBUFFER_COMPLETE;
      if (done) { g.viewport(0, 0, 1024, 1024); g.drawArrays(g.TRIANGLES, 0, 3); }
      g.bindFramebuffer(g.FRAMEBUFFER, null); g.deleteFramebuffer(fb); g.deleteProgram(pr);
      if (!done) { g.deleteTexture(tx); return null; }
      return tx;
    };
    const t1 = run(LAT_FS, g.TEXTURE1);
    if (!t1) return false;
    const t4 = run(LAT4_FS, g.TEXTURE0, (pr) => g.uniform1i(g.getUniformLocation(pr, "uA"), 1));
    g.activeTexture(g.TEXTURE1); g.bindTexture(g.TEXTURE_2D, null); g.deleteTexture(t1); g.activeTexture(g.TEXTURE0);
    return !!t4;
  } catch (e) { return false; }
}
function glInit() {
  gl = sky.getContext("webgl", { antialias: false, alpha: false, preserveDrawingBuffer: true });
  if (!gl) return false;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const lat = latTex(gl, sh);   /* решётка шума — до сборки шейдера; без неё — SB_NOLAT (D-1330) */
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, (lat ? "" : "#define SB_NOLAT\n") + FS)); gl.linkProgram(pr);
  gl.useProgram(pr);
  const l = gl.getAttribLocation(pr, "a"); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, 2, gl.FLOAT, false, 0, 0);
  ["uRes", "uT", "uTw", "uBr", "uTap", "uHz", "uSv", "uKs", "uTp", "uMode", "uTwB", "uR", "uSeam", "uPx", "uO", "uSc"].forEach((n) => { U[n] = gl.getUniformLocation(pr, n); });
  gl.uniform1i(gl.getUniformLocation(pr, "uLat"), 0);
  /* ПРОГРЕВ (D-1345): сборка шейдера доводится браузером на первом рисовании — пусть это будет сейчас, в простое после
     входа, одним пикселем (первый кадр двойника закрывает холст целиком), а не в миг смены темы. Вид не меняется. */
  const warm = () => {
    if (doc.getElementById("sbCurtain")) { setTimeout(warm, 300); return; }
    (window.requestIdleCallback || ((f) => setTimeout(f, 60)))(() => {
      if (!gl || lastT) return;   /* двойник уже рисовал — программа собрана */
      try {
        gl.viewport(0, 0, 1, 1); gl.uniform2f(U.uRes, 1, 1); gl.uniform1f(U.uMode, 1); gl.uniform1f(U.uR, 0);
        gl.drawArrays(gl.TRIANGLES, 0, 3); gl.flush();   /* без readPixels: сборку доводит процесс GPU, главный поток не ждёт (desk-time-switch: кадр 667 мс) */
      } catch (e) { /* прогрев не обязателен */ }
    }, { timeout: 2500 });
  };
  warm();
  return true;
}
const portrait = () => innerWidth < 700;
const hzFrac = () => portrait() ? 0.66 : 0.64;   /* как горизонт «зеркала» Авроры (depth.js) */
function size() {
  W = innerWidth; H = innerHeight;
  K = Math.min(1, Math.sqrt(1.6e6 / Math.max(1, W * H))) * 0.7 * kScale;   /* свет гладкий: холст мельче экрана, сверху зерно */
  sky.width = Math.max(2, Math.round(W * K)); sky.height = Math.max(2, Math.round(H * K));
  const kd = Math.min(devicePixelRatio || 1, 1.5);
  hz.width = Math.round(W * kd); hz.height = Math.round(H * kd); hz._k = kd;
  fx.width = Math.round(W * kd); fx.height = Math.round(H * kd); fx._k = kd;
  seedMotes(); lastHz = 0;
}
function seedMotes() {
  motes = []; const n = Math.round(Math.min(220, W * H / 4200));
  for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, v = 2 + Math.random() * 6;
    motes.push({ x: Math.random() * W, y: Math.random() * H, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: .6 + Math.random() * 1.3, ph: Math.random() * 6.283, f: .3 + Math.random() * .9 }); }
}

/* ── «зеркало» Лазури: тот же рисунок, что у горизонта Авроры (depth.js drawGround, ветка «зеркало» в покое),
   краски дня: вода отражает бледное небо, хребты — в голубой дымке, туман белый; ночной вуали нет ── */
function hsh(k) { const x = Math.sin(k * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
function gN(x, k) { return Math.sin(x * 0.011 + k * 1.7) * 0.5 + Math.sin(x * 0.027 + k * 3.1) * 0.28 + Math.sin(x * 0.061 + k * 5.3) * 0.14 + Math.sin(x * 0.13 + k * 2.2) * 0.06; }
function sst(a, b, x) { const v = Math.min(1, Math.max(0, (x - a) / (b - a))); return v * v * (3 - 2 * v); }
function mixc(a, b, f) { return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f]; }
function rgb(c, a) { return "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + (a === undefined ? 1 : a) + ")"; }
let MIST = null;
function mistSpr() {
  if (MIST) return MIST;
  const cv = doc.createElement("canvas"); cv.width = 256; cv.height = 64; const c = cv.getContext("2d"), g = c.createRadialGradient(128, 32, 0, 128, 32, 128);
  g.addColorStop(0, "rgba(250,252,252,1)"); g.addColorStop(0.5, "rgba(250,252,252,.4)"); g.addColorStop(1, "rgba(250,252,252,0)");
  c.setTransform(1, 0, 0, 0.25, 0, 24); c.fillStyle = g; c.fillRect(0, -100, 256, 256); return (MIST = cv);
}
function drawGround(s) {
  const g = hx, k = hz._k; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, hz.width, hz.height); g.setTransform(k, 0, 0, k, 0, 0);
  const p = portrait(), yh = H * hzFrac(), f = H * (p ? 0.6 : 0.74), hc = 16, cx = W / 2, dz = 170, camZ = 0, zmin = f * hc / (H - yh + 20), zmax = 9500;
  const HZ = [214, 228, 236], DK = [128, 152, 172], wob = 0.18;
  const floor = getComputedStyle(root).getPropertyValue("--tw-floor").split(",").map(Number);
  let gb = g.createLinearGradient(0, yh, 0, H); gb.addColorStop(0, "rgb(214,229,237)"); gb.addColorStop(0.15, "rgb(204,221,231)"); gb.addColorStop(0.5, "rgb(196,212,223)"); gb.addColorStop(1, rgb(floor)); g.fillStyle = gb; g.fillRect(0, yh, W, H - yh);
  let rg = g.createRadialGradient(W * 0.3, yh, 0, W * 0.3, yh, W * 0.5); rg.addColorStop(0, "rgba(150,214,186,.16)"); rg.addColorStop(1, "rgba(150,214,186,0)"); g.fillStyle = rg; g.fillRect(0, yh, W, H - yh);
  rg = g.createRadialGradient(W * 0.8, yh, 0, W * 0.8, yh, W * 0.35); rg.addColorStop(0, "rgba(190,180,236,.12)"); rg.addColorStop(1, "rgba(190,180,236,0)"); g.fillStyle = rg; g.fillRect(0, yh, W, H - yh);
  const farL = [[0.03, 0.7, 1], [0.018, 0.35, 2]];
  for (let li = 0; li < farL.length; li++) {
    const hgt = farL[li][0], haze = farL[li][1], j = farL[li][2], col = mixc(DK, HZ, haze * 0.9), top = [];
    for (let x = 0; x <= W + 4; x += 4) { const h = (0.5 + 0.5 * gN(x * (p ? 1.6 : 0.9) + j * 200, j + 3)) * 0.6; top.push(yh - H * hgt * Math.max(0, h)); }
    g.fillStyle = rgb(mixc(col, [200, 216, 226], 0.5), 0.6); g.beginPath(); g.moveTo(0, yh);
    for (let i = 0; i < top.length; i++) g.lineTo(i * 4 + Math.sin((yh + (yh - top[i])) * 0.3 + s * 2) * wob * 0.6, yh + (yh - top[i]) * 0.85);
    g.lineTo(W, yh); g.closePath(); g.fill();
    g.fillStyle = rgb(col); g.beginPath(); g.moveTo(0, yh + 0.5); for (let i = 0; i < top.length; i++) g.lineTo(i * 4, top[i]); g.lineTo(W, yh + 0.5); g.closePath(); g.fill();
  }
  const k0 = Math.ceil((camZ + zmin * 0.9) / dz), k1 = Math.floor((camZ + zmax) / dz), sides = [-1, 1];
  for (let kk0 = k1; kk0 >= k0; kk0--) {
    const z = kk0 * dz - camZ; if (z < zmin * 0.9) continue; const kk = f / z, base = yh + f * hc / z; if (base > H + 60) continue;
    const hzz = 1 - Math.exp(-z / 3800), nf = sst(zmin * 0.9, zmin * 2, z) * Math.min(1, (zmax - z) / 2500), st = z > 3000 ? 8 : (p ? 3 : 4);
    const colI = mixc(DK, HZ, Math.pow(hzz, 0.9) * 0.92), colT = mixc(colI, HZ, 0.14);
    for (let sdI = 0; sdI < 2; sdI++) {
      const sd = sides[sdI], h1 = hsh(kk0 * 3.1 + sd * 7), h2 = hsh(kk0 * 5.7 + sd * 3), h3 = hsh(kk0 * 2.3 + sd * 11);
      if (h3 < 0.55) continue;
      const xin = 520 + 380 * h1, H0 = 10 + 16 * h2, taper = 300, xs0 = cx + sd * xin * kk;
      if (sd > 0 && xs0 > W + 4) continue; if (sd < 0 && xs0 < -4) continue;
      const pts = [], xa = sd > 0 ? xs0 : 0, xb = sd > 0 ? W + st : xs0;
      for (let x = xa; x <= xb; x += st) { const xw = (x - cx) / kk, dd = Math.abs(xw) - xin, hh = H0 * sst(0, taper, dd) * (0.6 + 0.4 * gN(xw * 0.3 + kk0 * 20, kk0)); pts.push([x, base - hh * kk]); }
      if (sd > 0) pts.unshift([xs0, base]); else pts.push([xs0, base]);
      g.fillStyle = rgb(mixc(colI, [196, 212, 222], 0.5), 0.7 * nf); g.beginPath();
      for (let i = 0; i < pts.length; i++) { const yr = base + (base - pts[i][1]) * 0.9, w2 = Math.sin(yr * 0.33 + s * 2.1 + kk0) * wob * (0.4 + (yr - yh) / (H - yh) * 2.2); g[i ? "lineTo" : "moveTo"](pts[i][0] + w2, yr); }
      g.lineTo(pts[pts.length - 1][0], base); g.lineTo(pts[0][0], base); g.closePath(); g.fill();
      let ymin = Infinity; for (let i = 0; i < pts.length; i++) ymin = Math.min(ymin, pts[i][1]);
      const gr = g.createLinearGradient(0, ymin, 0, base); gr.addColorStop(0, rgb(colT, nf)); gr.addColorStop(1, rgb(colI, nf));
      g.fillStyle = gr; g.beginPath(); for (let i = 0; i < pts.length; i++) g[i ? "lineTo" : "moveTo"](pts[i][0], pts[i][1]); g.lineTo(sd > 0 ? W + st : 0, base); g.closePath(); g.fill();
    }
    if (hsh(kk0 * 9 + 2) < 0.85) {
      const xm = (hsh(kk0 * 13) * 2 - 1) * 260, wM = (500 + 700 * hsh(kk0 * 17)) * kk, hM = (20 + 22 * hsh(kk0 * 19)) * kk;
      g.globalAlpha = 0.3 * nf * (1 - hzz * 0.5); g.drawImage(mistSpr(), cx + xm * kk - wM / 2 + Math.sin(s * 0.4 + kk0) * 6 * kk, base - hM * 0.9, wM, hM); g.globalAlpha = 1;
    }
  }
  const hzg = g.createLinearGradient(0, yh - H * 0.05, 0, yh + H * 0.04); hzg.addColorStop(0, "rgba(160,220,196,0)"); hzg.addColorStop(0.55, "rgba(170,226,200,.22)"); hzg.addColorStop(1, "rgba(160,220,196,0)"); g.fillStyle = hzg; g.fillRect(0, yh - H * 0.05, W, H * 0.09);
  /* низ воды сходит в пол страницы — без ступени (floor-seam, D-1314) */
  const fl = g.createLinearGradient(0, H - 90, 0, H); fl.addColorStop(0, rgb(floor, 0)); fl.addColorStop(1, rgb(floor, 1)); g.fillStyle = fl; g.fillRect(0, H - 90, W, 90);
}

/* ── пыль Светлицы (звёзды Тайника днём — пылинки в солнечном луче) и касания ── */
function bell(p, up) { p = Math.max(0, Math.min(1, p)); return p < up ? Math.sin(p / up * Math.PI / 2) : Math.pow((1 - p) / (1 - up), 1.7); }
function glow(g, x, y, r, c, a) { if (a <= 0.002) return; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, rgb(c, a)); gr.addColorStop(0.35, rgb(c, a * 0.55)); gr.addColorStop(1, rgb(c, 0)); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
const TAPDUR = { svetlica: 3.2, zenit: 1.8, bereg: 1.6, lazur: 1.4 };
function drawFx(t, dt) {
  const g = fxx, k = fx._k; g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, fx.width, fx.height); g.setTransform(k, 0, 0, k, 0, 0);
  taps = taps.filter((o) => t - o.t < TAPDUR[tw]);
  if (tw === "svetlica" && sv !== "kak") { /* новые образы рисует шейдер; касание — тёплый свет там же */ }
  else if (tw === "svetlica") {
    for (const m of motes) {
      let vx = m.vx, vy = m.vy;
      for (const o of taps) { const dx = m.x - o.x, dy = m.y - o.y, d2 = dx * dx + dy * dy; if (d2 < 150 * 150) { const s = (1 - d2 / 22500) * 40 * bell((t - o.t) / TAPDUR.svetlica, .2); vx += -dy / 150 * s; vy += dx / 150 * s; } }
      m.x += vx * dt; m.y += vy * dt;
      if (m.x < -4) m.x += W + 8; if (m.x > W + 4) m.x -= W + 8; if (m.y < -4) m.y += H + 8; if (m.y > H + 4) m.y -= H + 8;
      const a = (0.16 + 0.22 * (0.5 + 0.5 * Math.sin(t * m.f + m.ph))) * (1 - 0.6 * Math.max(0, (m.y / H - .8) * 5));
      g.fillStyle = "rgba(168,104,40," + a.toFixed(3) + ")"; g.beginPath(); g.arc(m.x, m.y, m.r, 0, 6.283); g.fill();
    }
    for (const o of taps) glow(g, o.x, o.y, 150, [255, 226, 176], 0.34 * bell((t - o.t) / TAPDUR.svetlica, .25));
  } else if (tw === "bereg") {
    for (const o of taps) { const p = (t - o.t) / TAPDUR.bereg, b = bell(p, .2);
      for (let i = 0; i < 3; i++) { const r = 20 + (p * 170) * (1 - i * 0.22); g.strokeStyle = "rgba(255,253,240," + (0.5 * b * (1 - i * 0.3)).toFixed(3) + ")"; g.lineWidth = 2.2 - i * 0.5; g.beginPath(); g.ellipse(o.x, o.y, r, r * 0.62, 0, 0, 6.283); g.stroke(); }
      glow(g, o.x, o.y, 90, [255, 252, 236], 0.22 * b); }
  } else if (tw === "lazur") {
    for (const o of taps) { const p = (t - o.t) / TAPDUR.lazur, b = bell(p, .2);
      g.save(); g.translate(o.x, o.y); g.scale(0.35, 1.6); glow(g, 0, -40, 140, [130, 214, 176], 0.3 * b); g.restore(); }
  }
}
function tapLevel(t) {   /* Зенит: касание — светлеет сама корона (как утверждённое «касание 4» у Затмения), на месте пальца ничего */
  let v = 0; for (const o of taps) v = Math.max(v, bell((t - o.t) / TAPDUR.zenit, .4)); return v;
}
let lastT = 0;
const REST = 500;   /* как depth.js REST (field-idle, field-cadence) */
const WATER = 40;   /* вода Берега в покое (D-1348) */
/* ДОРОГОЙ КАДР — МЕЛЬЧЕ ХОЛСТ (аудит оболочки H4e4, п.6: на 1440 переход ко второй светлой теме «зависал» больше минуты).
   Причина: небо двойника — шейдер на холсте .7 экрана (на 1440 — 1008×630), а шов смены темы считает в каждой точке ДВЕ
   темы и идёт без паузы между кадрами; на программной графике (без GPU) кадр шёл ~1 с и держал страницу. Теперь кадр,
   опоздавший больше чем на SLOW мс, уменьшает холст неба (не ниже K_MIN от прежнего): свет гладкий и так (сверху зерно),
   а страница отвечает. На обычном GPU кадр — единицы мс, и холст не меняется. */
const SLOW = 250, K_MIN = .2;
let kScale = 1, due = 0;
function frame(now) {
  /* цена кадра шейдера ложится не на сам вызов, а на следующую отрисовку: меряем опоздание кадра против назначенного */
  const late = due ? performance.now() - due : 0;
  /* мельче — только на время шва (дорог именно он); шов прошёл — холст снова полный, и покой выглядит одинаково
     на любом устройстве (закон no-hard-edges: шум не рвётся между путями отрисовки) */
  if (gl && tw && seam && late > SLOW && kScale > K_MIN) { kScale = Math.max(K_MIN, kScale * .7); size(); }
  else if (!seam && kScale !== 1) { kScale = 1; size(); }
  frameBody(now);
}
function frameBody(now) {
  const want = twinNow();
  if (want !== tw) setTwin(want, false);
  if (!tw || doc.hidden || root.classList.contains("wp-parked")) return;
  const still = reduced(), t = still ? 12 : (now - T0) / 1000, dt = Math.min(0.1, Math.max(0, t - lastT)); lastT = t;
  if (still) taps = [];
  if (gl) {
  gl.viewport(0, 0, sky.width, sky.height);
  gl.uniform2f(U.uRes, sky.width, sky.height);
  gl.uniform1f(U.uT, t); gl.uniform1f(U.uTw, TWI[tw]); gl.uniform1f(U.uBr, still ? 0 : 1);
  { const lt = taps.length ? taps[taps.length - 1] : null, kk = sky.width / W;
    gl.uniform1f(U.uSv, SVI[sv]); gl.uniform1f(U.uKs, kk);
    if (lt && tw === "svetlica" && !still) gl.uniform4f(U.uTp, lt.x * kk, lt.y * kk, t - lt.t, 1); else gl.uniform4f(U.uTp, 0, 0, 0, 0); }
  gl.uniform1f(U.uTap, tw === "zenit" ? tapLevel(t) : (tw === "lazur" && taps.length ? tapLevel(t) : 0)); gl.uniform1f(U.uHz, hzFrac());
  if (seam) {
    stepSeam(now); const kk = sky.width / W;
    gl.uniform1f(U.uMode, seam ? 1 : 0);
    if (seam) { gl.uniform1f(U.uTw, TWI[seam.from]); gl.uniform1f(U.uTwB, TWI[seam.to]); gl.uniform1f(U.uR, seam.R * kk); gl.uniform1f(U.uSeam, seam.seam);
      gl.uniform2f(U.uO, seam.o.x * kk, seam.o.y * kk); gl.uniform1f(U.uPx, 1); gl.uniform3f(U.uSc, seam.sc[0], seam.sc[1], seam.sc[2]); }
  } else gl.uniform1f(U.uMode, 0);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  if (tw === "lazur" && (!lastHz || now - lastHz > 500)) { drawGround(still ? 0 : t * 0.5); lastHz = now; }
  drawFx(t, dt);
  /* ПОКОЙ — КАК У ОЧАГА (D-1339, depth.js REST): полный ход только пока идёт шов или живёт касание; в покое кадр раз в
     REST мс по таймеру (свет почти неподвижен, кадры те же — меняется только их частота). Прежде кадр шёл каждые 28 мс
     всегда: за поддельный час sun-check — сотни тысяч кадров WebGL, на устройстве — батарея. */
  /* D-1348 (основатель 18.11: «Океан и Берег не должны тормозить»): вода Берега в покое — кадр раз в WATER мс (25 к/с,
     холст и так .7 CSS px), иначе её ход читается ступенями; остальные двойники — прежний REST */
  if (seam) kick(0); else if (!still) kick(taps.length ? 28 : tw === "bereg" ? WATER : REST);
}
function loop(now) { raf = 0; frame(now); }
let resting = false;   /* ждёт кадр покоя (REST): касание, шов и смена темы его не ждут */
function kick(delay) {
  delay = delay || 0;
  if (raf && !(resting && delay < REST)) return;
  if (raf) { clearTimeout(raf); raf = 0; }
  resting = delay >= REST;
  due = performance.now() + delay + 34;   /* ПОСТОЯННАЯ: 34 мс — два кадра 60 Гц на сам requestAnimationFrame */
  raf = setTimeout(() => { resting = false; raf = requestAnimationFrame(loop) || 1; }, delay);
}
/* ── ШОВ СМЕНЫ ТЕМЫ — КАК У ОЧАГА (H4e3, D-1334): depth.js startSeam/stepSeam один в один — то же начало (последнее касание
   кнопки темы за 4 с, иначе низ середины экрана), 2,7 с, радиус по 1 − (1 − p)^1,75, кромка гаснет после 72 %, значки
   загораются, когда шов проходит над ними; «меньше движения» — без шва. Цвет кромки — акцент новой темы. ── */
let seam = null, lastTap = null;
addEventListener("pointerdown", (e) => { const b = e.target && e.target.closest && e.target.closest("[data-mood]"); if (b) { const r = b.getBoundingClientRect(); lastTap = { x: r.left + r.width / 2, y: r.top + r.height / 2, at: performance.now() }; } }, true);
function easeS(p) { p = Math.max(0, Math.min(1, p)); return 1 - Math.pow(1 - p, 1.75); }
function smoothS(p) { p = Math.max(0, Math.min(1, p)); return p * p * (3 - 2 * p); }
function startSeam(from, to) {
  if (!gl || reduced() || !from || !to || from === to) { seam = null; return; }
  const o = lastTap && performance.now() - lastTap.at < 4000 ? lastTap : { x: W / 2, y: H - 40 };
  const far = Math.max(Math.hypot(o.x, o.y), Math.hypot(W - o.x, o.y), Math.hypot(o.x, H - o.y), Math.hypot(W - o.x, H - o.y)) + 80;
  const acc = getComputedStyle(root).getPropertyValue("--tw-acc-rgb").split(",").map((v) => (+v || 0) / 255);
  const icons = Array.prototype.map.call(doc.querySelectorAll("#sbIconLayer .desk-icon"), (el) => { const r = (el.querySelector(".icon-tile") || el).getBoundingClientRect(); return { el: el, x: r.left + r.width / 2, y: r.top + r.height / 2, done: false }; });
  seam = { from: from, to: to, o: { x: o.x, y: o.y }, t0: performance.now(), dur: 2700, R: 0, far: far, seam: 1, sc: acc.length === 3 ? acc : [1, 1, 1], icons: icons };
  root.classList.add("sb-tw-seam");
}
function stepSeam(now) {
  if (!seam) return;
  const p = Math.min(1, (now - seam.t0) / seam.dur);
  seam.R = seam.far * easeS(p);
  seam.seam = p < .72 ? 1 : 1 - smoothS((p - .72) / .28);
  seam.icons.forEach((ic) => { if (!ic.done && Math.hypot(ic.x - seam.o.x, ic.y - seam.o.y) < seam.R - 6) { ic.done = true; ic.el.classList.remove("sb-depth-lit"); void ic.el.offsetWidth; ic.el.classList.add("sb-depth-lit"); } });
  if (p >= 1) { seam = null; root.classList.remove("sb-tw-seam"); }
}
function setTwin(v, draw) {
  const was = tw;
  tw = v;
  root.classList.toggle("sb-tw", !!v);
  if (v) root.setAttribute("data-sb-tw", v); else root.removeAttribute("data-sb-tw");
  if (was && v && was !== v) startSeam(was, v); else { seam = null; root.classList.remove("sb-tw-seam"); }   /* кромка — цветом уже новой темы */
  lastHz = 0; taps = [];
  /* вход в светлую тему из тёмной: первый кадр неба — следующим кадром страницы, а не в том же шаге, что смена темы
     (на устройстве без GPU он стоит до секунды — и держал смену цвета всего стола, pold-quiet-contrast); смена
     двойника внутри светлых — по-прежнему сразу (шов). */
  if (v && draw !== false) { if (!was) kick(0); else { frame(performance.now()); kick(); } }
}
function mount() {
  const layer = doc.querySelector(".wp-layer"); if (!layer) return false;
  const before = doc.getElementById("sbDeskTime");
  sky = doc.createElement("canvas"); sky.id = "sbLightSky"; hz = doc.createElement("canvas"); hz.id = "sbLightHz"; fx = doc.createElement("canvas"); fx.id = "sbLightFx";
  [sky, hz, fx].forEach((c) => { c.setAttribute("aria-hidden", "true"); layer.insertBefore(c, before && before.parentNode === layer ? before : null); });
  /* БЕЗ WebGL ТЕМА ВСЁ РАВНО НАДЕВАЕТСЯ (H4e3, D-1331). Эталон здесь выходил, не надев двойника: оставалась прежняя
     светлая тема со своим акцентом (Firefox без WebGL — зелёная «Начать» в Лазури вместо синей; Зенит — белый). Теперь
     надеваются класс, токены, имена, «зеркало» Лазури и пыль (2D); небо шейдера заменяет ровный переход от стены темы
     к полу (html.sb-tw-nogl, themes.css). */
  if (!glInit()) { gl = null; root.classList.add("sb-tw-nogl"); }
  hx = hz.getContext("2d"); fxx = fx.getContext("2d");
  size(); addEventListener("resize", () => { size(); if (tw) { frame(performance.now()); kick(); } });
  const DESK = { desktop: 1, sbIconLayer: 1, sbNoteLayer: 1, sbWidgetLayer: 1 };
  addEventListener("pointerdown", (e) => {
    /* ОТКАТ: не откат на чужое значение — «||» здесь логическое «или»: касание по самому столу или по любому слою обоев. */
    const tg = e.target; if (!tw || reduced() || !tg || tg.nodeType !== 1 || !(DESK[tg.id] || (tg.closest && tg.closest(".wp-layer")))) return;
    taps.push({ x: e.clientX, y: e.clientY, t: (performance.now() - T0) / 1000 }); if (taps.length > 5) taps.shift(); if (reduced()) return; kick();
  }, { passive: true });
  new MutationObserver(() => { const v = twinNow(); if (v !== tw) setTwin(v); else kick(); }).observe(root, { attributes: true, attributeFilter: ["data-theme", "data-wp-mood", "data-motion", "class"] });
  doc.addEventListener("visibilitychange", () => kick());
  new MutationObserver(() => { const v = twinNow(); if (v !== tw) setTwin(v); }).observe(doc.body, { childList: true });
  setTwin(twinNow());
  return true;
}

function start() {
  if (!doc.querySelector(".wp-layer") || !window.setTheme || !window.sbSetWallpaperMood) { setTimeout(start, 200); return; }
  mount();
}
start();
/* наружу: twin() — надетый двойник; pane() — прямоугольник солнечного проёма окна Светлицы («А · Окно») в CSS px
   (та же геометрия, что в шейдере okno: P0, hh, ww, наклон .40, поле размытия) — фигура темы для законов */
function pane() {
  if (tw !== "svetlica") return null;
  const port = W < H * .9, P0 = port ? [W * .58, H * .63] : [W * .72, H * .53], hh = port ? H * .30 : H * .40, ww = hh * .64, m = hh * .12;
  return { left: P0[0] - ww / 2 - .40 * hh / 2 - m, right: P0[0] + ww / 2 + .40 * hh / 2 + m, top: P0[1] - hh / 2 - m, bottom: P0[1] + hh / 2 + m };
}
window.sbLight = { twin: function () { return tw; }, pane: pane, kick: function () { kick(); }, rest: REST, restWater: WATER,
  /* шов смены темы — для закона: от какой к какой, доля пути, радиус */
  seam: function () { return seam ? { from: seam.from, to: seam.to, p: Math.min(1, (performance.now() - seam.t0) / seam.dur), R: seam.R, far: seam.far, o: seam.o, seam: seam.seam, dur: seam.dur } : null; } };
})();
