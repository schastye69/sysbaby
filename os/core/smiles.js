/* sys.baby — ЖИВЫЕ СМАЙЛИКИ «ПЕРЛАМУТР» · решение D-590 (основатель 01–02.11.2026).
 *
 * Восемь чувств — замочек-перламутр с лицом: радость, смех, люблю, ого,
 * грусть, хм, подмиг, спокойно. Каждое двигается по-своему; при снятом
 * движении — неподвижно (подмиг в покое — с закрытым правым глазом).
 *
 * ДВА РАЗМЕРА (решение основателя 02.11): маленький — в строке текста, движение
 * усилено (--a:5, --s:2.6), лицо крупнее; большой — отдельно, как стикер.
 *
 * ЗАПИСЬ ОСТАЁТСЯ ТЕКСТОМ. Смайлик хранится обычным знаком эмодзи (😊 😂 😍
 * 😮 😢 🤔 😉 😌): заметка читается где угодно, копия и «Передать» несут
 * просто текст, а знак с клавиатуры телефона сам становится живым. Строка,
 * в которой стоит один смайлик и больше ничего, — большой; в строке текста —
 * маленький. Палитра: короткое нажатие — маленький в строку, долгое —
 * большой отдельной строкой.
 *
 * Модуль ничего не хранит и никуда не ходит: рисует SVG из своих формул.
 * Стережёт tools/smiles-check.mjs.
 */
(function () {
  "use strict";
  if (window.sbSmiles) return;
  var LIST = [
    { e: "happy", ch: "\uD83D\uDE0A" }, { e: "laugh", ch: "\uD83D\uDE02" }, { e: "love", ch: "\uD83D\uDE0D" }, { e: "wow", ch: "\uD83D\uDE2E" },
    { e: "sad", ch: "\uD83D\uDE22" }, { e: "think", ch: "\uD83E\uDD14" }, { e: "wink", ch: "\uD83D\uDE09" }, { e: "calm", ch: "\uD83D\uDE0C" }
  ];
  var BY_CH = {}, IDX = {};
  LIST.forEach(function (x, i) { BY_CH[x.ch] = x.e; IDX[x.e] = i; });
  var CSS = "svg.sb-sm[data-e]{--a:1;--s:1}\nsvg.sb-sm[data-e] .all,svg.sb-sm[data-e] .sh,svg.sb-sm[data-e] .shd,svg.sb-sm[data-e] .fx *{transform-box:view-box}\nsvg.sb-sm[data-e] .all{transform-origin:50px 94px} svg.sb-sm[data-e] .sh{transform-origin:50px 46px} svg.sb-sm[data-e] .shd{transform-origin:50px 95px}\nsvg.sb-sm[data-e] .eye,svg.sb-sm[data-e] .mouth,svg.sb-sm[data-e] .blush,svg.sb-sm[data-e] .brows,svg.sb-sm[data-e] .brow,svg.sb-sm[data-e] .eyes,svg.sb-sm[data-e] .open,svg.sb-sm[data-e] .shut,svg.sb-sm[data-e] .face{transform-box:fill-box;transform-origin:center}\nsvg.sb-sm[data-e] .mouth{transform-origin:50% 0}\nsvg.sb-sm[data-e] .bd,svg.sb-sm[data-e] .sh{animation:sbe-pearl 7s ease-in-out infinite}\n@keyframes sbe-pearl{0%,100%{filter:hue-rotate(0)}50%{filter:hue-rotate(18deg)}}\n/* радость */\n .sb-sm[data-e=happy] .all{animation:sbe-hop 2.6s cubic-bezier(.3,.7,.4,1) infinite}\n .sb-sm[data-e=happy] .shd{animation:sbe-shd 2.6s cubic-bezier(.3,.7,.4,1) infinite}\n@keyframes sbe-hop{0%,58%,100%{transform:none}66%{transform:translateY(calc(var(--a)*1px)) scale(calc(1 + var(--s)*.05),calc(1 - var(--s)*.05))}76%{transform:translateY(calc(var(--a)*-7px)) scale(calc(1 - var(--s)*.03),calc(1 + var(--s)*.03))}86%{transform:scale(calc(1 + var(--s)*.04),calc(1 - var(--s)*.04))}93%{transform:none}}\n@keyframes sbe-shd{0%,58%,100%{transform:none;opacity:.3}76%{transform:scale(.8);opacity:.18}}\n .sb-sm[data-e=happy] .eye{animation:sbe-blink 2.6s infinite}\n@keyframes sbe-blink{0%,38%,46%,100%{transform:none}42%{transform:scaleY(.08)}}\n .sb-sm[data-e=happy] .mouth{animation:sbe-grin 2.6s infinite}\n@keyframes sbe-grin{0%,60%,100%{transform:none}76%{transform:scale(calc(1 + var(--s)*.25),calc(1 + var(--s)*.15))}}\n/* смех */\n .sb-sm[data-e=laugh] .all{animation:sbe-jig 1.9s ease-in-out infinite}\n .sb-sm[data-e=laugh] .sh{animation:sbe-throw 1.9s ease-in-out infinite,sbe-pearl 7s ease-in-out infinite}\n@keyframes sbe-jig{0%,40%,100%{transform:none}48%{transform:rotate(calc(var(--a)*-3deg))}56%{transform:rotate(calc(var(--a)*3deg))}64%{transform:rotate(calc(var(--a)*-2.5deg))}72%{transform:rotate(calc(var(--a)*2deg))}80%{transform:none}}\n@keyframes sbe-throw{0%,40%,100%{transform:none}50%{transform:rotate(calc(var(--a)*-9deg)) translateY(-2px)}60%{transform:rotate(calc(var(--a)*-3deg))}70%{transform:rotate(calc(var(--a)*-9deg)) translateY(-2px)}82%{transform:none}}\n .sb-sm[data-e=laugh] .mouth{animation:sbe-haha 1.9s infinite}\n@keyframes sbe-haha{0%,40%,100%{transform:none}48%,64%{transform:scaleY(.5)}56%,72%{transform:scaleY(1.18)}80%{transform:none}}\n .sb-sm[data-e=laugh] .eyes{animation:sbe-squint 1.9s infinite}\n@keyframes sbe-squint{0%,40%,100%{transform:none}48%,72%{transform:translateY(calc(var(--a)*-1px)) scaleY(1.2)}60%{transform:translateY(.5px)}}\n .sb-sm[data-e=laugh] .blush, .sb-sm[data-e=love] .blush{animation:sbe-glow 1.9s infinite}\n@keyframes sbe-glow{0%,40%,100%{transform:none}60%{transform:scale(1.3)}}\n/* люблю */\n .sb-sm[data-e=love] .sh{animation:sbe-beat 1.6s ease-in-out infinite,sbe-pearl 7s ease-in-out infinite;transform-origin:50px 30px}\n@keyframes sbe-beat{0%,60%,100%{transform:none}10%{transform:scale(calc(1 + var(--s)*.14))}22%{transform:scale(.98)}32%{transform:scale(calc(1 + var(--s)*.1))}44%{transform:none}}\n .sb-sm[data-e=love] .eye{animation:sbe-beatE 1.6s infinite}\n@keyframes sbe-beatE{0%,60%,100%{transform:none}10%{transform:scale(calc(1 + var(--s)*.3))}22%{transform:scale(.95)}32%{transform:scale(calc(1 + var(--s)*.22))}44%{transform:none}}\n .sb-sm[data-e=love] .hf{animation:sbe-fly 3.2s ease-out infinite;transform-origin:78px 37px}\n@keyframes sbe-fly{0%,20%{opacity:0;transform:translate(0,4px) scale(.6)}35%{opacity:1}100%{opacity:0;transform:translate(6px,-22px) scale(1.1)}}\n/* ого */\n .sb-sm[data-e=wow] .sh{animation:sbe-pop 2.4s cubic-bezier(.2,1.6,.4,1) infinite,sbe-pearl 7s ease-in-out infinite}\n .sb-sm[data-e=wow] .all{animation:sbe-stretch 2.4s ease-out infinite}\n@keyframes sbe-pop{0%,55%,100%{transform:none}63%{transform:translateY(calc(var(--a)*-8px))}75%{transform:translateY(calc(var(--a)*-2px))}85%{transform:none}}\n@keyframes sbe-stretch{0%,55%,100%{transform:none}61%{transform:scale(calc(1 - var(--s)*.04),calc(1 + var(--s)*.05))}72%{transform:none}}\n .sb-sm[data-e=wow] .eye{animation:sbe-wide 2.4s cubic-bezier(.2,1.6,.4,1) infinite}\n@keyframes sbe-wide{0%,55%,100%{transform:none}63%{transform:scale(calc(1 + var(--s)*.35))}80%{transform:scale(1.1)}92%{transform:none}}\n .sb-sm[data-e=wow] .brows{animation:sbe-raise 2.4s cubic-bezier(.2,1.6,.4,1) infinite}\n@keyframes sbe-raise{0%,55%,100%{transform:none}63%{transform:translateY(calc(var(--a)*-2.5px))}88%{transform:none}}\n .sb-sm[data-e=wow] .mouth{animation:sbe-oh 2.4s cubic-bezier(.2,1.6,.4,1) infinite;transform-origin:center}\n@keyframes sbe-oh{0%,55%,100%{transform:none}63%{transform:scale(calc(1 + var(--s)*.45))}85%{transform:none}}\n/* грусть */\n .sb-sm[data-e=sad] .sh{animation:sbe-droop 4.5s ease-in-out infinite,sbe-pearl 7s ease-in-out infinite}\n .sb-sm[data-e=sad] .all{animation:sbe-sink 4.5s ease-in-out infinite}\n@keyframes sbe-droop{0%,100%{transform:none}50%{transform:translateY(calc(var(--a)*2px)) scaleY(calc(1 - var(--a)*.12))}}\n@keyframes sbe-sink{0%,100%{transform:none}50%{transform:translateY(calc(var(--a)*1.5px))}}\n .sb-sm[data-e=sad] .eyes{animation:sbe-down 4.5s ease-in-out infinite}\n@keyframes sbe-down{0%,100%{transform:none}50%{transform:translateY(calc(var(--a)*1.6px))}}\n .sb-sm[data-e=sad] .eye{animation:sbe-slowblink 4.5s infinite}\n@keyframes sbe-slowblink{0%,66%,80%,100%{transform:none}73%{transform:scaleY(.12)}}\n .sb-sm[data-e=sad] .mouth{animation:sbe-wobble 4.5s ease-in-out infinite;transform-origin:center}\n@keyframes sbe-wobble{0%,100%{transform:none}45%{transform:scaleX(.86) translateY(.6px)}55%{transform:scaleX(.92)}}\n .sb-sm[data-e=sad] .drop{animation:sbe-tear 4.5s ease-in infinite}\n@keyframes sbe-tear{0%,30%{opacity:0;transform:none}40%{opacity:1}85%{opacity:.9;transform:translateY(16px)}100%{opacity:0;transform:translateY(20px)}}\n/* хм */\n .sb-sm[data-e=think] .sh{animation:sbe-ponder 3.4s ease-in-out infinite,sbe-pearl 7s ease-in-out infinite}\n@keyframes sbe-ponder{0%,100%{transform:rotate(calc(var(--a)*-7deg))}50%{transform:rotate(calc(var(--a)*7deg))}}\n .sb-sm[data-e=think] .eyes{animation:sbe-look 3.4s ease-in-out infinite}\n@keyframes sbe-look{0%,100%{transform:translate(calc(var(--a)*-1.6px),-1px)}50%{transform:translate(calc(var(--a)*1.6px),-1.6px)}}\n .sb-sm[data-e=think] .brow{animation:sbe-bob 3.4s ease-in-out infinite}\n@keyframes sbe-bob{0%,100%{transform:none}50%{transform:translateY(calc(var(--a)*-1.6px))}}\n .sb-sm[data-e=think] .mouth{animation:sbe-hmm 3.4s ease-in-out infinite}\n@keyframes sbe-hmm{0%,100%{transform:translateX(calc(var(--a)*-1.2px))}50%{transform:translateX(calc(var(--a)*1.2px)) rotate(-4deg)}}\n .sb-sm[data-e=think] .fx circle{animation:sbe-bub 3.4s ease-out infinite;opacity:0}\n .sb-sm[data-e=think] .b2{animation-delay:.35s!important} .sb-sm[data-e=think] .b3{animation-delay:.7s!important}\n@keyframes sbe-bub{0%{opacity:0;transform:translateY(3px)}20%{opacity:.75}70%{opacity:.75}100%{opacity:0;transform:translateY(-3px)}}\n/* подмиг — в покое правый глаз закрыт; в движении: открыт → подмигивает */\n .sb-sm[data-e=wink] .open{opacity:0}  .sb-sm[data-e=wink] .shut{opacity:1}\n .sb-sm[data-e=wink] .sh{animation:sbe-lid 2.8s ease-in-out infinite,sbe-pearl 7s ease-in-out infinite}\n .sb-sm[data-e=wink] .all{animation:sbe-lean 2.8s ease-in-out infinite}\n@keyframes sbe-lid{0%,62%,100%{transform:none}70%{transform:scaleY(.45) translateY(6px)}80%{transform:none}}\n@keyframes sbe-lean{0%,60%,100%{transform:none}70%{transform:rotate(calc(var(--a)*4deg))}84%{transform:none}}\n .sb-sm[data-e=wink] .open{animation:sbe-open 2.8s infinite} .sb-sm[data-e=wink] .shut{animation:sbe-shut 2.8s infinite}\n@keyframes sbe-open{0%,62%,82%,100%{opacity:1;transform:none}66%,78%{opacity:0;transform:scaleY(.1)}}\n@keyframes sbe-shut{0%,62%,82%,100%{opacity:0}66%,78%{opacity:1}}\n .sb-sm[data-e=wink] .mouth{animation:sbe-smirk 2.8s infinite;transform-origin:center}\n@keyframes sbe-smirk{0%,60%,100%{transform:none}70%{transform:rotate(-7deg) scale(calc(1 + var(--s)*.12))}84%{transform:none}}\n/* спокойно */\n .sb-sm[data-e=calm] .all{animation:sbe-breathe 5s ease-in-out infinite}\n .sb-sm[data-e=calm] .sh{animation:sbe-rock 5s ease-in-out infinite,sbe-pearl 7s ease-in-out infinite;transform-origin:56px 44px}\n@keyframes sbe-breathe{0%,100%{transform:none}50%{transform:scale(calc(1 + var(--s)*.025),calc(1 + var(--s)*.035))}}\n@keyframes sbe-rock{0%,100%{transform:rotate(calc(var(--a)*-5deg))}50%{transform:rotate(calc(var(--a)*5deg))}}\n .sb-sm[data-e=calm] .t1{animation:sbe-tw 2.6s ease-in-out infinite} .sb-sm[data-e=calm] .t2{animation:sbe-tw 2.6s ease-in-out 1.3s infinite}\n@keyframes sbe-tw{0%,100%{opacity:.2}50%{opacity:1}}\n .sb-sm[data-e=calm] .z1, .sb-sm[data-e=calm] .z2{transform-box:fill-box;transform-origin:center;opacity:0;animation:sbe-zz 5s ease-out infinite}\n .sb-sm[data-e=calm] .z2{animation-delay:1.2s}\n@keyframes sbe-zz{0%{opacity:0;transform:translate(0,3px) scale(.7)}25%{opacity:.85}100%{opacity:0;transform:translate(6px,-12px) scale(1.15)}}\nsvg.sb-sm.go .all{animation:sbe-tap .6s cubic-bezier(.3,1.6,.5,1)!important}\n@keyframes sbe-tap{0%{transform:scale(.9)}60%{transform:scale(1.12)}100%{transform:none}}\n@media (prefers-reduced-motion:reduce){svg.sb-sm[data-e] *{animation:none!important} .sb-sm[data-e=wink] .open{opacity:0!important} .sb-sm[data-e=wink] .shut{opacity:1!important} .sb-sm[data-e=calm] .z1{opacity:.7!important}}\n\nsvg.sb-sm{overflow:visible}\nsvg.sb-sm.inl{width:1.9em;height:1.9em;vertical-align:-0.55em;--a:5;--s:2.6}\nsvg.sb-sm.big{width:96px;height:96px;display:block;margin:6px 0}\nsvg.sb-sm.inl .bd,svg.sb-sm.inl .sh{animation-name:none}\n.sb-sm-line{display:block}\n";
  function style() {
    if (document.getElementById("sbSmilesCss")) return;
    var st = document.createElement("style");
    st.id = "sbSmilesCss";
    st.textContent = CSS;
    (document.head || document.documentElement).appendChild(st);
  }
  /* формулы — те же, что в утверждённом демо (smayliki-zhivye-v4) */
  const OPEN=e=>e==='love'||e==='laugh';
  const shackle=(e,stroke,w,extra='')=>`<path d="M34 46 V32 a16 16 0 0 1 32 0 V${OPEN(e)?'22':'46'}" stroke="${stroke}" stroke-width="${w}" fill="none" stroke-linecap="round" ${OPEN(e)?'transform="translate(9 -6) rotate(18 66 30)"':''} ${extra}/>`;
  const PAL=['#f0a560','#e88a6a','#ef8fb0','#f2c86a','#8fb2ef','#b29ae8','#86d6b4','#c9c0d6'];
  // kawaii face: big shiny eyes with two highlights; the rest borrows from face()
  function face2(e,ink,blush,cx,cy,s){const X=v=>cx+(v-50)*s,Y=v=>cy+(v-54)*s;const eye=(x,y,r=6)=>`<ellipse cx="${X(x)}" cy="${Y(y)}" rx="${r*s}" ry="${(r+1)*s}" fill="${ink}"/><circle cx="${X(x+1.8)}" cy="${Y(y-2.2)}" r="${2.2*s}" fill="#fff"/><circle cx="${X(x-1.6)}" cy="${Y(y+2)}" r="${1*s}" fill="#fff" opacity=".85"/>`;
   const arc=(x1,y1,qx,qy,x2,y2,w=3)=>`<path d="M${X(x1)} ${Y(y1)} Q${X(qx)} ${Y(qy)} ${X(x2)} ${Y(y2)}" stroke="${ink}" stroke-width="${w*s}" fill="none" stroke-linecap="round"/>`;
   let g=blush?`<ellipse cx="${X(28)}" cy="${Y(62)}" rx="${7*s}" ry="${4.2*s}" fill="${blush}"/><ellipse cx="${X(72)}" cy="${Y(62)}" rx="${7*s}" ry="${4.2*s}" fill="${blush}"/>`:'';
   if(e==='happy')return g+eye(37,50)+eye(63,50)+arc(44,63,50,68,56,63);
   if(e==='wow')return g+eye(37,48,7)+eye(63,48,7)+`<ellipse cx="${X(50)}" cy="${Y(66)}" rx="${3.5*s}" ry="${4.5*s}" fill="${ink}"/>`;
   if(e==='sad')return g+eye(37,51)+eye(63,51)+arc(44,67,50,63,56,67)+`<path d="M${X(70)} ${Y(56)} q${2.2*s} ${5*s} 0 ${7*s} q${-2.2*s} ${-2*s} 0 ${-7*s}" fill="#7fc4ff"/>`;
   if(e==='think')return g+eye(37,50)+arc(57,50,63,47,69,50)+arc(44,65,50,64,56,66)+`<circle cx="${X(78)}" cy="${Y(30)}" r="${2.6*s}" fill="${ink}" opacity=".45"/><circle cx="${X(85)}" cy="${Y(22)}" r="${4*s}" fill="${ink}" opacity=".45"/>`;
   return face(e,ink,blush,cx,cy,s);}
  const sh2=(e,c,w,hi)=>{const o=OPEN(e);const t=o?'transform="translate(9 -6) rotate(18 66 30)"':'';return `<path d="M35 47 V33 a15 15 0 0 1 30 0 V${o?'23':'47'}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" ${t}/>`+(hi?`<path d="M35 44 V33 a15 15 0 0 1 9 -13.5" stroke="#fff" stroke-width="${w*0.3}" fill="none" stroke-linecap="round" opacity=".85" ${t}/>`:'');};
  const HU=[[20,320],[350,280],[330,260],[45,330],[210,290],[270,330],[160,230],[300,200]];
  const star=(x,y,r,o=.9)=>`<path d="M${x} ${y-r} L${x+r*.28} ${y-r*.28} L${x+r} ${y} L${x+r*.28} ${y+r*.28} L${x} ${y+r} L${x-r*.28} ${y+r*.28} L${x-r} ${y} L${x-r*.28} ${y-r*.28}Z" fill="#fff" opacity="${o}"/>`;
  // the gesture of the shackle, shared by all hybrids; o: {c: paint, w: width, k: 0..1 how far the gesture goes, hi: highlight}
  function gest(e,o){const c=o.c,w=o.w,k=o.k==null?1:o.k;const L=(d,extra='')=>`<g ${extra}><path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`+(o.hi?`<path d="${d}" stroke="#fff" stroke-width="${w*.28}" fill="none" stroke-linecap="round" opacity=".7" transform="translate(-${w*.18} -${w*.12})"/>`:'')+'</g>';
   if(e==='love')return L(`M50 44 C50 44 ${50-20*k} ${44-10*k} ${50-20*k} ${44-21*k} a${10*k} ${10*k} 0 0 1 ${20*k} -2 a${10*k} ${10*k} 0 0 1 ${20*k} 2 C${50+20*k} ${44-10*k} 50 44 50 44Z`);
   if(e==='think')return L(`M${40} ${28} a11 11 0 1 1 16 9 q-6 4 -6 8`);
   if(e==='wow')return L(`M37 46 V${22+(1-k)*8} a13 13 0 0 1 26 0 V46`)+(o.fx?`<path d="M27 15 l-4 -4 M73 15 l4 -4" stroke="${o.fxc||'#fff'}" stroke-width="2" stroke-linecap="round" opacity=".8"/>`:'');
   if(e==='sad')return L(`M34 47 C34 ${30+(1-k)*8} 40 ${30+(1-k)*8} 44 38 M66 47 C66 ${30+(1-k)*8} 60 ${30+(1-k)*8} 56 38`);
   if(e==='calm')return `<path d="M60 14 a18 18 0 1 0 6 30 a14 14 0 1 1 -6 -30Z" fill="${c}"/>`;
   if(e==='wink')return L('M33 46 C35 37 42 35 50 35 C58 35 65 37 67 46');
   if(e==='laugh'){const v=o.lv||0;
    if(v===1)return L('M35 47 V33 a15 15 0 0 1 30 0 V47','transform="translate(0 -9)"')+`<path d="M30 44 h6 M64 44 h6 M28 38 h5 M67 38 h5" stroke="${c}" stroke-width="2" stroke-linecap="round" opacity=".6"/>`;
    if(v===2)return L('M35 47 C30 43 40 40 35 36 C30 32 40 29 37 25 a13 13 0 0 1 26 0 C60 29 70 32 65 36 C60 40 70 43 65 47');
    if(v===3)return L('M35 47 q-4 -4 0 -8 q4 -4 0 -8 a15 15 0 0 1 30 0 q-4 4 0 8 q4 4 0 8')+`<path d="M27 30 q-3 3 0 6 M73 30 q3 3 0 6" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>`;
    if(v===4)return L('M35 47 V36 a15 15 0 0 1 30 0 V47','transform="rotate(-10 50 46) translate(0 -4)"')+`<path d="M73 22 l5 -3 M76 30 l6 0 M24 26 l-5 -3" stroke="${c}" stroke-width="2" stroke-linecap="round" opacity=".6"/>`;
    return L('M35 47 V30 a15 15 0 0 1 30 0 V47','transform="translate(0 -7) scale(1 1)"')+`<path d="M40 49 h4 M56 49 h4" stroke="${c}" stroke-width="3" stroke-linecap="round" opacity=".5"/>`;}
   return L('M35 47 V33 a15 15 0 0 1 30 0 V47');}
  const FX={love:(x,y)=>`<path d="M${x} ${y} l-3.5 -3.5 a2.2 2.2 0 0 1 3.5 -3 a2.2 2.2 0 0 1 3.5 3z" fill="#ff7a9a"/>`,sad:(x,y)=>`<path d="M${x} ${y-4} q2 4 0 6 q-2 -2 0 -6" fill="#8fc8ff"/>`,think:(x,y)=>`<circle cx="${x}" cy="${y}" r="1.6" fill="#fff" opacity=".7"/><circle cx="${x+5}" cy="${y-4}" r="2.4" fill="#fff" opacity=".7"/>`,calm:(x,y)=>star(x,y,2.6,.9)+star(x+7,y+8,1.8,.7),laugh:(x,y)=>`<path d="M${x} ${y} q3 -3 6 0 M${x+2} ${y+6} q3 -3 6 0" stroke="#fff" stroke-width="1.5" fill="none" opacity=".75"/>`,wink:(x,y)=>star(x,y,3,.95),happy:(x,y)=>star(x,y,3.2,.9),wow:()=>''};
  const body=(i,id,extra='')=>{const h=HU[i];return `<defs><linearGradient id="${id}${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h[0]},90%,88%)"/><stop offset=".5" stop-color="hsl(${(h[0]+h[1])/2|0},80%,80%)"/><stop offset="1" stop-color="hsl(${h[1]},75%,74%)"/></linearGradient>${extra}</defs>`;};
  const BL={love:'#ff8fb0aa',laugh:'#ff9fb099',wink:'#ff9fb099'};
  const EI={happy:0,laugh:1,love:2,wow:3,sad:4,think:5,wink:6,calm:7};
  // five ways to light the pearl
  function HL(t,i,e){const k=EI[e];
   if(t===1)return `<ellipse cx="36" cy="52" rx="20" ry="6" fill="url(#hw)" transform="rotate(-14 36 52)"/>`; // same place, soft
   if(t===2){const P=[[34,52,-18],[66,51,18],[30,56,-30],[50,48,0],[68,53,22],[36,50,-12],[64,50,15],[44,49,-6]][k];return `<ellipse cx="${P[0]}" cy="${P[1]}" rx="8.5" ry="3.4" fill="url(#hs)" transform="rotate(${P[2]} ${P[0]} ${P[1]})"/>`;}
   if(t===3)return `<path d="M26 47.5 Q50 41.5 74 47.5" stroke="url(#hr)" stroke-width="2.4" fill="none" stroke-linecap="round"/>`; // rim light from above
   if(t===4)return ['happy','laugh','love','wow','wink'].includes(e)?`<ellipse cx="34" cy="52" rx="9" ry="3.6" fill="url(#hs)" transform="rotate(-18 34 52)"/>`:'';
   const G=[[30,53],[70,52],[32,50],[50,48],[69,55],[31,55],[67,50],[36,49]][k];return `<circle cx="${G[0]}" cy="${G[1]}" r="1.8" fill="#fff" opacity=".9"/><path d="M${G[0]-5} ${G[1]+3} q3 -2 6 -3" stroke="#fff" stroke-width="1.2" fill="none" opacity=".45" stroke-linecap="round"/>`;}
  const DEFS=`<defs><radialGradient id="hs"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><linearGradient id="hr" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".38"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><radialGradient id="hw"><stop offset="0" stop-color="#fff" stop-opacity=".32"/><stop offset=".6" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>`;
  const pearlBody=(i,id,face_e,src,t)=>DEFS+`<rect x="16" y="42" width="68" height="52" rx="24" fill="url(#${id}${i})"/>`+HL(t,i,src||face_e)+face2(face_e,'#3a2a44',BL[src||face_e]||null,50,70,.64);
  const fe=e=>e==='love'?'happy':e;
  // animated: each part in its own group so it can move on its own
  const AFX={
   think:`<g class="fx"><circle class="b1" cx="80" cy="38" r="1.7" fill="#fff"/><circle class="b2" cx="85" cy="31" r="2.4" fill="#fff"/><circle class="b3" cx="91" cy="23" r="3.2" fill="#fff"/></g>`,
   calm:`<g class="fx">${star(84,36,2.6,.9).replace('<path','<path class="t1"')}${star(91,44,1.8,.7).replace('<path','<path class="t2"')}</g>`,
   sad:`<g class="fx"><path class="drop" d="M71 64 q2.2 4.6 0 6.6 q-2.2 -2 0 -6.6" fill="#8fc8ff"/></g>`,
   love:`<g class="fx"><path class="hf" d="M78 40 l-3.5 -3.5 a2.2 2.2 0 0 1 3.5 -3 a2.2 2.2 0 0 1 3.5 3z" fill="#ff8fb0"/></g>`
  };
  // a bigger, living face: every part in its own group, so eyes, mouth and cheeks can move
  function faceA(e,small){const K='#33243f';
   const eye=(x,cls)=>`<g class="eye ${cls}"><ellipse cx="${x}" cy="65" rx="4.9" ry="5.8" fill="${K}"/><ellipse cx="${x}" cy="66.6" rx="3.1" ry="2.6" fill="#5b4672" opacity=".55"/><circle cx="${x+1.7}" cy="62.8" r="2" fill="#fff"/><circle cx="${x-1.5}" cy="67.4" r=".95" fill="#fff" opacity=".9"/></g>`;
   const arcUp=x=>`<path d="M${x-5.2} 66.5 Q${x} 60 ${x+5.2} 66.5" stroke="${K}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
   const arcDn=x=>`<path d="M${x-5.2} 64.5 Q${x} 69.2 ${x+5.2} 64.5" stroke="${K}" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
   const heart=x=>`<path d="M${x} 70 l-5.4 -5.4 a3.3 3.3 0 0 1 5.4 -4.5 a3.3 3.3 0 0 1 5.4 4.5z" fill="#ff5480"/><circle cx="${x-2.6}" cy="62.6" r="1" fill="#fff" opacity=".8"/>`;
   const line=(d,w=2.8)=>`<path d="${d}" stroke="${K}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
   const cheeks=BL[e]?`<g class="blush"><ellipse cx="31" cy="73" rx="5.6" ry="3.2" fill="${BL[e]}"/><ellipse cx="69" cy="73" rx="5.6" ry="3.2" fill="${BL[e]}"/></g>`:'';
   let eyes='',mouth='',brows='';
   if(e==='happy'){eyes=eye(38,'eL')+eye(62,'eR');mouth=line('M43.5 75 Q50 81.8 56.5 75');}
   if(e==='laugh'){eyes=`<g class="eye eL">${arcUp(38)}</g><g class="eye eR">${arcUp(62)}</g>`;mouth=`<path d="M41.5 74 Q50 87 58.5 74 Z" fill="${K}"/><path d="M45.5 80.6 Q50 84.6 54.5 80.6 Q50 78.6 45.5 80.6Z" fill="#ff8fa8"/>`;}
   if(e==='love'){eyes=`<g class="eye eL">${heart(38)}</g><g class="eye eR">${heart(62)}</g>`;mouth=line('M44 76 Q50 81.2 56 76');}
   if(e==='wow'){eyes=eye(38,'eL')+eye(62,'eR');mouth=`<ellipse cx="50" cy="79" rx="3.7" ry="4.7" fill="${K}"/>`;brows=line('M33 56.5 Q38 53 43 55.5',2.2)+line('M57 55.5 Q62 53 67 56.5',2.2);}
   if(e==='sad'){eyes=eye(38,'eL')+eye(62,'eR');mouth=line('M44 80.5 Q50 75.5 56 80.5');brows=line('M33 59 L42.5 56.2',2.2)+line('M67 59 L57.5 56.2',2.2);}
   if(e==='think'){eyes=eye(38,'eL')+`<g class="eye eR">${line('M57 64.5 Q62 62 67 64.5')}</g>`;mouth=line('M45 79 Q50.5 77.4 56 77.4');brows=line('M33.5 57.8 L42.5 57.8',2.2)+`<g class="brow">${line('M57 55.5 Q62 51.5 67 54.5',2.2)}</g>`;}
   if(e==='wink'){eyes=eye(38,'eL')+`<g class="eye eR"><g class="open">${eye(62,'')}</g><g class="shut">${arcUp(62)}</g></g>`;mouth=line('M43.5 75 Q50 81.8 56.5 75')+`<path d="M52 78.7 q3 4.4 5.4 0" fill="#ff8fa8"/>`;brows=line('M33 57 Q38 54.8 43 56.4',2.2);}
   if(e==='calm'){eyes=`<g class="eye eL">${arcDn(38)}</g><g class="eye eR">${arcDn(62)}</g>`;mouth=line('M46 76.5 Q50 79.6 54 76.5');}
   const k=small?1.32:1.14, dy=small?-3:-1.5;
   return `<g transform="translate(0 ${dy}) translate(50 68) scale(${k}) translate(-50 -68)">`+cheeks+`<g class="brows">${brows}</g><g class="eyes">${eyes}</g><g class="mouth">${mouth}</g></g>`;}
  AFX.calm=`<g class="fx">${star(84,36,2.6,.9).replace('<path','<path class="t1"')}${star(91,44,1.8,.7).replace('<path','<path class="t2"')}<text class="z1" x="74" y="50" font-size="7" font-family="Georgia" fill="#e9e2f5">z</text><text class="z2" x="79" y="44" font-size="5.5" font-family="Georgia" fill="#e9e2f5">z</text></g>`;
  AFX.sad=`<g class="fx"><path class="drop" d="M67 70 q2.2 4.6 0 6.6 q-2.2 -2 0 -6.6" fill="#8fc8ff"/></g>`;
  function smiley(e,i,small){const h=HU[i];
   const defs=body(i,'g0',`<linearGradient id="g0s${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="hsl(${h[0]},80%,90%)"/><stop offset="1" stop-color="hsl(${h[1]},70%,84%)"/></linearGradient>`);
   return defs+DEFS+`<ellipse class="shd" cx="50" cy="95" rx="26" ry="3" fill="#000" opacity=".3"/><g class="all"><g class="sh">`+gest(e,{c:`url(#g0s${i})`,w:8.5,hi:true,lv:4,fx:true})+`</g><g class="bd"><rect x="16" y="42" width="68" height="52" rx="24" fill="url(#g0${i})"/>`+HL(1,i,e)+`</g><g class="face">`+faceA(e,small)+`</g></g>`+(AFX[e]||'');}
  
  var UID = 0;
  function svg(e, size) {
    if (!(e in IDX)) return "";
    style();
    var small = size !== "big";
    /* У каждого смайлика свои имена градиентов: одинаковые id на странице
       брали краску у первого, а первый мог лежать в скрытой палитре — и
       тело перламутра пропадало (найдено 02.11 на снимке Заметок). */
    var u = "_" + (++UID);
    var body = smiley(e, IDX[e], small).replace(/id="([^"]+)"/g, 'id="$1' + u + '"').replace(/url\(#([^)]+)\)/g, "url(#$1" + u + ")");
    return '<svg class="sb-sm ' + (small ? "inl" : "big") + '" viewBox="0 0 100 100" data-e="' + e + '" role="img" aria-label="' + LIST[IDX[e]].ch + '">' + body + "</svg>";
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  var RE = new RegExp("(" + LIST.map(function (x) { return x.ch; }).join("|") + ")\\uFE0F?", "g");
  /* Текст → разметка: каждая строка экранируется; строка из одного смайлика —
     большой, смайлик внутри строки — маленький. Остальное — как есть. */
  function render(text) {
    return String(text == null ? "" : text).split("\n").map(function (line) {
      var bare = line.trim().replace(/\uFE0F/g, "");
      if (BY_CH[bare]) return '<span class="sb-sm-line">' + svg(BY_CH[bare], "big") + "</span>";
      var parts = line.split(RE), html = "";
      for (var i = 0; i < parts.length; i++) html += (i % 2) ? svg(BY_CH[parts[i]], "small") : esc(parts[i]);
      return html;
    }).join("<br>");
  }
  function has(text) { RE.lastIndex = 0; var hit = RE.test(String(text || "")); RE.lastIndex = 0; return hit; }
  window.sbSmiles = { list: function () { return LIST.map(function (x) { return { e: x.e, ch: x.ch }; }); }, svg: svg, render: render, has: has };
})();
