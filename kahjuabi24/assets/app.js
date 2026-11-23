/* ===========================================================================
   KAHJUABI24 — progressive enhancement. The site is complete without this
   file: every effect below is additive, and every one of them is disabled
   under prefers-reduced-motion.
   =========================================================================== */
(function () {
  document.documentElement.classList.remove('no-js');   /* was an inline <script>; the guest CSP runs no inline code */
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var d = document;

  /* ── drawer ─────────────────────────────────────────────────────────── */
  var drawer = d.getElementById('drawer'),
      openBtn = d.getElementById('menu-btn'),
      closeBtn = d.getElementById('menu-close'),
      lastFocus = null;

  function setOpen(open) {
    if (!drawer) return;
    if (open) { drawer.hidden = false; void drawer.offsetWidth; }
    drawer.classList.toggle('is-open', open);
    if (openBtn) openBtn.setAttribute('aria-expanded', String(open));
    d.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) {
      lastFocus = d.activeElement;
      var first = drawer.querySelector('a, button');
      if (first) first.focus();
    } else {
      setTimeout(function () {
        if (!drawer.classList.contains('is-open')) drawer.hidden = true;
      }, 320);
      if (lastFocus) lastFocus.focus();
    }
  }
  if (openBtn) openBtn.addEventListener('click', function () { setOpen(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setOpen(false); });
  d.addEventListener('keydown', function (e) {
    if (!drawer || !drawer.classList.contains('is-open')) return;
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key !== 'Tab') return;
    var f = drawer.querySelectorAll('a[href], button:not([disabled])');
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && d.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && d.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ── the shield closes ──────────────────────────────────────────────────
     Hero-local scroll progress drives --seal from 0 (open, exposed) to 1
     (closed, protected). The whole geometry of the site is this one move. */
  (function seal() {
    var hero = d.querySelector('.hero');
    if (!hero) return;
    if (reduce) { hero.style.setProperty('--seal', '1'); return; }
    var t = false;
    var run = function () {
      if (t) return;
      t = true;
      requestAnimationFrame(function () {
        var r = hero.getBoundingClientRect();
        var span = Math.max(1, r.height * 0.72);
        if (r.bottom < 0) { t = false; return; }   /* hero off-screen: nothing to draw */
        var p = Math.min(1, Math.max(0, -r.top / span));
        hero.style.setProperty('--seal', p.toFixed(3));   /* v12: on the hero, not :root — no full-page style recalc per frame */
        t = false;
      });
    };
    window.addEventListener('scroll', run, { passive: true });
    window.addEventListener('resize', run, { passive: true });
    run();
  })();

  /* ── live open / closed, computed in Europe/Tallinn ─────────────────── */
  (function hours() {
    var chips = d.querySelectorAll('[data-fx="hours"]');
    if (!chips.length) return;
    /* Подписи приходят из разметки, а не живут здесь.
       Раньше они были вписаны в этот файл, и языков было ровно два: английская
       страница показывала «Avatud». Строка, существующая в двух местах, рано
       или поздно расходится — и расходится молча. Источник один: ui.json →
       build.mjs → data-атрибуты. */

    var now;
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Tallinn', weekday: 'short', hour: '2-digit',
        minute: '2-digit', hour12: false
      }).formatToParts(new Date());
      var g = {};
      f.forEach(function (p) { g[p.type] = p.value; });
      now = { day: g.weekday, h: parseInt(g.hour, 10), m: parseInt(g.minute, 10) };
    } catch (e) { return; }

    var weekend = (now.day === 'Sat' || now.day === 'Sun');
    var mins = now.h * 60 + now.m;
    var state = weekend ? 'weekend' : (mins >= 540 && mins < 1080 ? 'open' : 'closed');

    chips.forEach(function (c) {
      c.hidden = false;
      c.setAttribute('data-state', state);
      var t = c.querySelector('.chip__t');
      if (t) t.textContent = c.getAttribute('data-' + state) || '';
    });
  })();

  /* ── reveal ─────────────────────────────────────────────────────────── */
  var els = d.querySelectorAll('.reveal');
  if (els.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var ro = new IntersectionObserver(function (en) {
        en.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add('is-in');
          ro.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
      els.forEach(function (el) { ro.observe(el); });
    }
  }



  /* ── v12 magic: steps road. (The first-screen scene lives in hero-fog.js, appended at build.) */
  (function stepsRoad() {
    var list = d.querySelector('.steps');
    var road = list && list.querySelector('.steps__road');
    if (!road) return;
    var steps = list.querySelectorAll('.step');
    if (reduce) {
      list.style.setProperty('--p', '1');
      steps.forEach(function (s) { s.classList.add('is-reached'); });
      return;
    }
    var busy = false;
    function run() {
      busy = false;
      var vh = window.innerHeight, r = list.getBoundingClientRect();
      var line = vh * 0.62;
      var p = Math.min(1, Math.max(0, (line - r.top) / Math.max(1, r.height)));
      list.style.setProperty('--p', p.toFixed(4));
      list.style.setProperty('--h', road.offsetHeight + 'px');
      steps.forEach(function (s) {
        s.classList.toggle('is-reached', s.getBoundingClientRect().top + 26 < line);
      });
    }
    function req() { if (!busy) { busy = true; requestAnimationFrame(run); } }
    window.addEventListener('scroll', req, { passive: true });
    window.addEventListener('resize', req, { passive: true });
    run();
  })();

  /* ── request form (v12) ─────────────────────────────────────────────────
     No server ships with this site. If data-endpoint is filled in, the form
     POSTs there; otherwise (and on any failure) it composes an e-mail to
     data-mailto and opens the visitor's mail app. All strings come from the
     markup, per language. */
  var form = d.getElementById('claim');
  if (form) {
    var done = d.getElementById('claim-done');
    var status = d.getElementById('claim-status');
    var btn = form.querySelector('button[type="submit"]');
    var phone = d.getElementById('f-phone');
    var cc = d.getElementById('f-cc');
    var lastText = '', lastHref = '';
    if (form.elements.ts) form.elements.ts.value = String(Date.now());

    /* preselect reason from #teata / #hinnang / #muu */
    function fromHash() {
      var id = (location.hash || '').slice(1);
      var lab = id && d.getElementById(id);
      if (lab && lab.classList.contains('choice')) {
        var r = lab.querySelector('input'); r.checked = true;
        setTimeout(function () {
          var top = d.getElementById('paring') || lab;
          top.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        }, 60);
      }
    }
    fromHash();
    window.addEventListener('hashchange', fromHash);

    /* phone: digits and spaces only, a pasted +CODE moves into the select */
    if (phone) phone.addEventListener('input', function () {
      var v = phone.value;
      var m = v.replace(/\s/g, '').match(/^(?:\+|00)(\d{1,3})/);
      if (m && cc) {
        for (var i = 0; i < cc.options.length; i++) {
          var code = cc.options[i].value.slice(1);
          if (m[1].indexOf(code) === 0) {
            cc.selectedIndex = i;
            v = v.replace(/\s/g, '').replace(/^(?:\+|00)/, '').slice(code.length);
            break;
          }
        }
      }
      v = v.replace(/[^\d ]/g, '').replace(/ {2,}/g, ' ');
      if (v !== phone.value) phone.value = v;
    });

    /* tidy grouping on blur: 5123 4567 / 512 3456 */
    if (phone) phone.addEventListener('blur', function () {
      var n = phone.value.replace(/\D/g, '');
      if (n.length >= 7 && n.length <= 8) phone.value = n.length === 8 ? n.slice(0, 4) + ' ' + n.slice(4) : n.slice(0, 3) + ' ' + n.slice(3);
    });

    function digits(v) { return (v || '').replace(/\D/g, ''); }

    function setErr(field, msg) {
      var box = field.closest('.field');
      if (!box) return;
      var e = box.querySelector('.field__err');
      box.classList.toggle('is-bad', !!msg);
      if (e) { e.hidden = !msg; e.textContent = msg || ''; }
      if (field.setAttribute) field.setAttribute('aria-invalid', msg ? 'true' : 'false');
    }

    function check() {
      var firstBad = null;
      function bad(el, msg) { setErr(el, msg); if (msg && !firstBad) firstBad = el; }
      var reason = form.querySelector('input[name="reason"]:checked');
      var rf = form.querySelector('input[name="reason"]');
      bad(rf, reason ? '' : form.getAttribute('data-err-reason'));
      var name = form.elements.name;
      bad(name, name.value.trim() ? '' : form.getAttribute('data-err-req'));
      var n = digits(phone.value);
      bad(phone, !n ? form.getAttribute('data-err-req')
        : (n.length < 6 || n.length > 13 ? form.getAttribute('data-err-phone') : ''));
      var em = form.elements.email;
      bad(em, em.value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim()) ? form.getAttribute('data-err-email') : '');
      return firstBad;
    }

    form.addEventListener('change', function (e) {
      if (e.target.name === 'reason') setErr(e.target, '');
    });
    form.addEventListener('blur', function (e) {
      var f = e.target;
      if (!f.closest || !f.closest('.field.is-bad')) return;
      check();
    }, true);

    function labelOf(el) {
      var l = form.querySelector('label[for="' + el.id + '"]');
      return l ? l.textContent.replace('*', '').trim() : el.name;
    }

    function compose() {
      var lines = [];
      var reason = form.querySelector('input[name="reason"]:checked');
      var lg = form.querySelector('[data-field="reason"] legend');
      lines.push(lg.textContent.replace('*', '').trim() + ': ' + reason.value);
      ['name', 'phone', 'email', 'plate', 'message'].forEach(function (k) {
        var el = form.elements[k];
        var v = el.value.trim();
        if (!v) return;
        if (k === 'phone') v = cc.value + ' ' + v;
        lines.push((k === 'message' ? '\n' : '') + labelOf(el) + ': ' + v);
      });
      return lines.join('\n');
    }

    function showDone(variant) {
      form.hidden = true;
      done.hidden = false;
      done.querySelectorAll('[data-v]').forEach(function (p) {
        p.hidden = p.getAttribute('data-v') !== variant;
      });
      done.querySelector('[data-act="copy"]').hidden = variant !== 'mail';
      done.querySelector('[data-act="mail"]').hidden = variant !== 'mail';
      done.focus();
      done.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    }

    function viaMail() {
      var subj = form.getAttribute('data-subject') + ' — ' +
        form.querySelector('input[name="reason"]:checked').value;
      lastHref = 'mailto:' + form.getAttribute('data-mailto') +
        '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(lastText);
      done.querySelector('[data-act="mail"]').setAttribute('href', lastHref);
      window.location.href = lastHref;
      showDone('mail');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = check();
      if (bad) {
        if (status) { status.hidden = false; status.setAttribute('data-state', 'error');
          status.textContent = form.querySelector('.form__req').textContent; }
        bad.focus();
        return;
      }
      if (status) status.hidden = true;
      lastText = compose();
      var endpoint = form.getAttribute('data-endpoint');
      if (!endpoint) { viaMail(); return; }
      var original = btn.textContent;
      btn.disabled = true; btn.textContent = form.getAttribute('data-sending') || original;
      var fd = new FormData(form);
      fd.set('phone', cc.value + ' ' + phone.value);
      fd.set('page', location.pathname);
      fd.set('elapsed', String(Date.now() - Number(form.elements.ts.value || Date.now())));
      fd.delete('ts');
      fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: fd })
        .then(function (r) { if (!r.ok) throw new Error('http ' + r.status); showDone('sent'); })
        .catch(viaMail)
        .then(function () { btn.disabled = false; btn.textContent = original; });
    });

    done.addEventListener('click', function (e) {
      var a = e.target.closest('[data-act]');
      if (!a) return;
      var act = a.getAttribute('data-act');
      if (act === 'copy') {
        var ok = function () { a.textContent = form.getAttribute('data-copied'); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(lastText).then(ok, function () {});
        } else {
          var ta = d.createElement('textarea'); ta.value = lastText; d.body.appendChild(ta);
          ta.select(); try { d.execCommand('copy'); ok(); } catch (x) {} ta.remove();
        }
      } else if (act === 'new') {
        form.reset(); form.hidden = false; done.hidden = true;
        if (form.elements.ts) form.elements.ts.value = String(Date.now());
        form.querySelector('input').focus();
      }
    });
  }
})();

/* ── v13 first screen: an empty road dissolving into a living fog (generated by tools/hero_b.py, mode B1b) ── */
(function(){
  var d=document, MODE='B1b', B2=MODE==='B2';
  /* B1a / B1b: the same plate pushed far into the dark, with a living fog (dim = veil over the plate, fm = fog strength) */
  var V={B1a:{dim:.8,fm:.7,live:1},B1b:{dim:.64,fm:.5,live:1,flow:1,empty:1}}[MODE]||{dim:0,fm:1,live:0};
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* ── deterministic noise ── */
  var seed;
  function rnd(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646;}
  function reseed(s){seed=s;}
  reseed(B2?911:577);
  var perm=new Uint8Array(512), val=new Float32Array(256), i;
  for(i=0;i<256;i++){perm[i]=i;val[i]=rnd();}
  for(i=255;i>0;i--){var j=(rnd()*(i+1))|0,t=perm[i];perm[i]=perm[j];perm[j]=t;}
  for(i=0;i<256;i++)perm[256+i]=perm[i];
  function vn(x,y){var xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;xi&=255;yi&=255;var x1=(xi+1)&255,y1=(yi+1)&255;
    var a=val[perm[perm[xi]+yi]],b=val[perm[perm[x1]+yi]],c=val[perm[perm[xi]+y1]],e=val[perm[perm[x1]+y1]];
    var u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);return a+(b-a)*u+(c-a)*v+(a-b-c+e)*u*v;}
  function fbm(x,y,o){var s=0,a=.5,n=0;for(var k=0;k<o;k++){s+=a*vn(x,y);n+=a;x=x*2.03+17.3;y=y*2.03+9.1;a*=.5;}return s/n;}
  function cl(v){return v<0?0:v>1?1:v;}
  function ss(a,b,v){v=cl((v-a)/(b-a));return v*v*(3-2*v);}
  function mix(a,b,t){return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];}
  function css(c,a){return 'rgba('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+','+(a==null?1:a)+')';}

  /* palettes: B1 neutral cold, B2 purple shadows with an amber haze low on the horizon (diffuse, no source) */
  var C = B2 ? {
      skyTop:[24,16,32], skyHz:[112,92,122], warm:[172,118,86], fogNear:[58,44,70], asph:[25,21,29], gravel:[36,31,37],
      grass:[22,18,25], floor:[12,9,16], ditch:[10,8,14], mark:[200,188,172], tree:[10,7,14], post:[150,140,150],
      fogA:[132,114,152], fogB:[168,128,118], dens:.026, half:3.4
    } : {
      skyTop:[30,34,40], skyHz:[118,128,138], warm:[118,128,138], fogNear:[60,68,77], asph:[28,30,33], gravel:[40,41,40],
      grass:[24,28,25], floor:[15,17,16], ditch:[11,13,13], mark:[182,186,188], tree:[14,17,18], post:[170,174,176],
      fogA:[150,160,172], fogB:[150,160,172], dens:.03, half:3.5
    };

  var hero=d.querySelector('.hero'); if(!hero||!hero.querySelector('.scene'))return;
  var cam=hero.querySelector('.scene__cam'), base=hero.querySelector('.base');
  var fogs=[].slice.call(hero.querySelectorAll('.fogl'));

  /* film grain: a static alpha-noise tile, normal blending (cheap to composite over the moving fog) */
  var gc;try{gc=d.createElement('canvas');gc.width=gc.height=192;var gx=gc.getContext('2d'),gd=gx.createImageData(192,192);
    for(i=0;i<gd.data.length;i+=4){var r=rnd()+rnd()-1,wv=r>0?255:0;gd.data[i]=gd.data[i+1]=gd.data[i+2]=wv;gd.data[i+3]=Math.min(255,Math.abs(r)*(B2?44:34));}
    gx.putImageData(gd,0,0);}catch(e){gc=null;}

  function layout(){
    var hb=hero.getBoundingClientRect(), w=hero.clientWidth, h=hero.clientHeight;
    var q=function(s){var r=hero.querySelector(s).getBoundingClientRect();return {t:r.top-hb.top,b:r.bottom-hb.top};};
    var mk=q('.signature__mk'), eb=q('.hero__eyebrow');
    var narrow=w<1000, L={w:w,h:h,narrow:narrow};
    if(narrow){
      L.hy=75+(mk.t-75)*(B2?.5:.4);                // horizon in the band above the logo
      L.fadeA=mk.t+(mk.b-mk.t)*.15; L.fadeB=eb.t-8;  // fully gone before the first line of text
      L.yb=L.fadeB; L.vx=w*(B2?.6:.54);
      L.halfFrac=B2?.62:.52;
    } else {
      L.hy=Math.max(150,h*(B2?.34:.3)); L.fadeA=h*.58; L.fadeB=h*.99; L.yb=h; L.vx=w*(B2?.7:.66);
      L.halfFrac=B2?.36:.3;
    }
    L.H=Math.min(h,Math.ceil(L.fadeB+4));
    return L;
  }

  /* objects on the roadside: spruces, bare birches, delineator posts, wooden poles with wires */
  function spruce(){                       // Nordic spruce: narrow, many drooping ragged tiers with needle tufts
    var n=30+(rnd()*18|0), w0=.14+rnd()*.07, st=.93/n, k, j;
    function side(sg){var o=[];for(k=0;k<n;k++){var t=k/n, y=.06+.93*t;
      var e=w0*Math.pow(1-t,1.08)*(.6+.8*rnd())+.004; if(rnd()<.12)e*=.4;
      var yb=y+st*.5, yt=y-e*.34;                                  // branch root and drooping tip
      o.push([sg*e*.45,yb]);
      for(j=1;j<5;j++){var f=j/5; o.push([sg*e*(.45+.55*f),yb+(yt-yb)*f+(rnd()-.4)*e*.09]);}
      o.push([sg*e,yt]);
      for(j=1;j<3;j++){var f2=j/3; o.push([sg*e*(1-.3*f2),yt+(e*.16)*f2+(rnd()-.5)*e*.07]);}}
      return o;}
    var L=side(-1), R=side(1).reverse(), tw=.01+rnd()*.005;
    return [[-tw,0],[-tw,.06]].concat(L,[[-.003,.985],[0,1],[.003,.985]],R,[[tw,.06],[tw,0]]);}
  function birch(){var segs=[];
    (function br(x,y,a,len,wd,dp){var x2=x+Math.cos(a)*len,y2=y+Math.sin(a)*len;segs.push([x,y,x2,y2,wd]);
      if(dp<=0)return;var n=dp>3?2:3;for(var k=0;k<n;k++)br(x2,y2,a+(rnd()-.5)*1.3+(k-(n-1)/2)*.35,len*(.62+.2*rnd()),wd*.62,dp-1);})
      (0,0,Math.PI/2+(rnd()-.5)*.12,.34,.022,5);
    return segs;}

  function build(L,P){
    reseed(B2?4242:1313);
    var o=[], z, side, X, edge;
    for(side=-1;side<=1;side+=2){
      edge = B2 ? 7.8 : (side<0 ? 15 : 11.5);                           // B1: open field left, forest right
      for(z=B2?11:8;z<190;z+=B2?1.1+rnd()*1.6:1.6+rnd()*2.6){
        var rows=B2?3:(side<0?1:3);
        for(var r=0;r<rows;r++){
          if(!B2&&side<0&&rnd()<.55)continue;
          X=side*(edge+r*5.5+rnd()*6);
          var dec=rnd()<(B2?.08:(side<0?.6:.2));
          o.push({z:z+rnd()*1.5,X:X,k:dec?'b':'s',h:dec?9+rnd()*7:(B2?14:11)+rnd()*(B2?12:9),g:dec?birch():spruce()});
        }
      }
      for(z=14+(side>0?0:25);z<190;z+=50)o.push({z:z,X:side*(P.half+1.7),k:'p'});   // delineators every 50 m
    }
    if(!B2)for(z=9;z<260;z+=48)o.push({z:z,X:8.6,k:'w',h:9});                      // power line on the right
    o.sort(function(a,b){return b.z-a.z;});
    return o;
  }

  /* ── flowing fog (B1b): periodic multi-octave noise sheets that stream across the road without a seam,
        plus a pair of sheets that keep coming towards the camera (cross-faded, constant total density) ── */
  function vnP(x,y,P){var xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi;
    var x0=((xi%P)+P)%P, x1=(x0+1)%P; x0&=255; x1&=255; yi&=255; var y1=(yi+1)&255;
    var a=val[perm[perm[x0]+yi]],b=val[perm[perm[x1]+yi]],c=val[perm[perm[x0]+y1]],e=val[perm[perm[x1]+y1]];
    var u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);return a+(b-a)*u+(c-a)*v+(a-b-c+e)*u*v;}
  function fbmP(x,y,o,P){var s=0,a=.5,n=0;for(var k=0;k<o;k++){s+=a*(P?vnP(x,y,P):vn(x,y));n+=a;x=x*2+(P?P*3:17.3);y=y*2.03+9.1;if(P)P*=2;a*=.5;}return s/n;}
  var FLOW=[];
  function genSheet(cv,RW,RH,o){
    cv.width=RW; cv.height=RH; var fx=cv.getContext('2d'), im=fx.createImageData(RW,RH), D=im.data, den=new Float32Array(RW*(RH+2)), xx, yy;
    for(yy=0;yy<RH+2;yy++)for(xx=0;xx<RW;xx++){var u=xx/o.cell, v=(yy-1)/o.cellY+o.off, P=o.P||0;
      var wx=fbmP(u*.5,v*.5+3.7,3,P?P/2:0)*1.4, wy=fbmP(u*.5+(P?0:5.2),v*.5+1.3,3,P?P/2:0)*.9;
      den[yy*RW+xx]=fbmP(u+(P?0:wx),v+wy+(P?wx*.6:0),5,P);}
    for(yy=0;yy<RH;yy++){var vy=yy/(RH-1);
      for(xx=0;xx<RW;xx++){var dn=den[(yy+1)*RW+xx], env=Math.sin(Math.PI*cl(vy+(fbmP(xx/o.cell*1.7,3.1+o.off,2,o.P?o.P:0)-.5)*.4));
        env=env<0?0:env*env; var a=ss(o.th,.95,dn)*env;
        var lit=1+(den[yy*RW+xx]-den[(yy+2)*RW+xx])*-6; lit=lit<.68?.68:lit>1.3?1.3:lit;
        var k=(yy*RW+xx)*4; D[k]=Math.min(255,o.col[0]*lit); D[k+1]=Math.min(255,o.col[1]*lit); D[k+2]=Math.min(255,o.col[2]*lit); D[k+3]=Math.min(255,a*o.a*255);}}
    fx.putImageData(im,0,0);
  }
  function flowFog(L,w,hy,vx,span,P){
    FLOW=[]; var narrow=L.narrow, k=Math.max(.6,Math.min(1,w/1280)), Pw=Math.round(w), res=Math.max(110,Math.min(230,Math.round(w/5.5)));
    var col=P.fogA;
    // 1: far band at the horizon (narrow screens only) · 2: the main sheet streaming across the road
    var bands=[{n:0,y:hy-span*.36,h:span*.62,cells:3,th:.36,a:.5,speed:9*k,on:narrow},
               {n:1,y:hy-span*.12,h:span*.7, cells:4,th:.4, a:.62,speed:21*k,on:true}];
    bands.forEach(function(b){var cv=fogs[b.n]; if(!b.on){cv.style.display='none';return;} cv.style.display='';
      var RW=res*2, FH=Math.max(40,Math.round(b.h)), RH=Math.max(24,Math.round(RW*FH/(Pw*2)*1.6));
      genSheet(cv,RW,RH,{P:b.cells,cell:res/b.cells,cellY:RH/1.5,off:b.n*41.7,th:b.th,a:b.a*V.fm*1.25,col:col});
      cv.style.width=(Pw*2)+'px'; cv.style.height=FH+'px'; cv.style.transformOrigin='0 0';
      cv.style.transform='translate3d(0px,'+b.y+'px,0)';
      FLOW.push({el:cv,kind:'stream',y:b.y,Pw:Pw,dur:Pw/b.speed});});
    // 3+4: sheets drifting towards the camera from the vanishing point, cross-faded so density stays constant
    var y0=hy-span*.3, FH2=Math.round(span*1.1), FW2=Math.round(w*1.3), x0=-w*.15;
    [2,3].forEach(function(n,i){var cv=fogs[n]; cv.style.display='';
      var RW=Math.max(140,Math.min(300,Math.round(FW2/5))), RH=Math.max(30,Math.round(RW*FH2/FW2*1.4));
      genSheet(cv,RW,RH,{P:0,cell:RW/4.2,cellY:RH/2.2,off:90+i*57.3,th:.42,a:.55*V.fm*1.25,col:col});
      cv.style.width=FW2+'px'; cv.style.height=FH2+'px'; cv.style.transformOrigin=(vx-x0)+'px '+(hy-y0)+'px';
      cv.style.transform='translate3d('+x0+'px,'+y0+'px,0)'; cv.style.opacity=reduce?'.5':(i?'0':'1');
      FLOW.push({el:cv,kind:'approach',x:x0,y:y0,i:i,drift:-14*k});});
  }
  function paint(){
    var L=layout(); if(!L.w)return;
    var w=L.w, H=L.H, hy=L.hy, vx=L.vx, P=C;
    hero.style.setProperty('--fadeA',L.fadeA+'px'); hero.style.setProperty('--fadeB',L.fadeB+'px');
    hero.style.setProperty('--vxp',vx+'px'); hero.style.setProperty('--hyp',hy+'px');
    // camera: the road's half-width at the bottom of the scene sets the camera height (perspective stays physical)
    var camH=Math.max(1.2,Math.min(6,P.half*(L.yb-hy)/(L.halfFrac*w)));
    var F=.8*Math.max(w,L.narrow?H*.8:w);
    var bend=B2?function(z){return z>10?-.0042*(z-10)*(z-10):0;}:function(z){return .00018*z*z;};
    var span=Math.max(40,L.yb-hy), dens=P.dens;
    var SKX=B2?1.5:1.25; function skyAt(y){return mix(P.skyTop,P.skyHz,Math.pow(cl(y/hy),SKX));}
    function fogAt(y){return y<=hy?P.skyHz:mix(P.skyHz,P.fogNear,cl((y-hy)/span*1.25));}

    var dpr=Math.min(devicePixelRatio||1,1.5), W=Math.round(w*dpr), HH=Math.round(H*dpr);
    base.width=W; base.height=HH; base.style.width=w+'px'; base.style.height=H+'px';
    var x=base.getContext('2d');
    var hyD=hy*dpr, vxD=vx*dpr, FD=F*dpr;

    /* 1 ─ sky: diffuse, low cloud deck, the fog glows coldly at the horizon */
    var img=x.createImageData(W,HH), D=img.data, px, py, k;
    for(py=0;py<Math.min(HH,Math.ceil(hyD)+1);py++){
      var t=Math.pow(cl(py/hyD),SKX);
      for(px=0;px<W;px++){
        var cn=fbm(px/W*2.4+3,py/hyD*1.1,4), bnd=.86+.28*cn*(.3+t);
        var c=mix(P.skyTop,P.skyHz,t);
        if(B2){var wg=Math.exp(-Math.pow((hyD-py)/(hyD*.3),2))*Math.exp(-Math.pow((px-vxD+W*.18)/(W*.55),2));c=mix(c,P.warm,wg*.62);}
        k=(py*W+px)*4; D[k]=c[0]*bnd; D[k+1]=c[1]*bnd; D[k+2]=c[2]*bnd; D[k+3]=255;
      }
    }

    /* 2 ─ roadside objects, far → near, in depth bins blurred by distance; a copy feeds the wet reflections */
    var objs=V.empty?[]:build(L,P);              // B1b: nothing but the road and flat ground — emptiness
    var bins=[[100,1e9,2.4],[55,100,1.5],[28,55,.8],[0,28,.25]];
    function drawObjs(ctx,lo,hi){
      for(var n=0;n<objs.length;n++){var ob=objs[n]; if(ob.z<lo||ob.z>=hi)continue;
        var s=FD/ob.z, x0=vxD+(ob.X+bend(ob.z))*s, y0=hyD+camH*s, ft=1-Math.exp(-ob.z*dens*.8);
        var fc=fogAt(y0/dpr);
        if(ob.k==='s'||ob.k==='b'){
          var hp=ob.h*s; if(x0+hp*.45<0||x0-hp*.45>W||y0-hp>HH)continue;
          var yt=y0-hp, gr=ctx.createLinearGradient(0,yt,0,y0), fz=ft*.97;
          gr.addColorStop(0,css(mix(P.tree,skyAt(Math.max(0,yt)/dpr),fz)));
          if(yt<hyD){var th=(hyD-yt)/hp; gr.addColorStop(Math.max(0,Math.min(1,th*.5)),css(mix(P.tree,skyAt(Math.max(0,(yt+hyD)/2)/dpr),fz)));
            gr.addColorStop(Math.max(0,Math.min(1,th)),css(mix(P.tree,P.skyHz,fz)));}
          gr.addColorStop(1,css(mix(P.tree,fc,ft+(1-ft)*(B2?.14:.2))));
          if(ob.k==='s'){ctx.fillStyle=gr;ctx.beginPath();var g=ob.g;ctx.moveTo(x0+g[0][0]*hp,y0-g[0][1]*hp);
            for(var q=1;q<g.length;q++)ctx.lineTo(x0+g[q][0]*hp,y0-g[q][1]*hp);ctx.closePath();ctx.fill();}
          else{ctx.strokeStyle=gr;ctx.lineCap='round';var sg=ob.g;
            for(var q2=0;q2<sg.length;q2++){var e=sg[q2];ctx.lineWidth=Math.max(.35,e[4]*hp);ctx.beginPath();
              ctx.moveTo(x0+e[0]*hp,y0-e[1]*hp);ctx.lineTo(x0+e[2]*hp,y0-e[3]*hp);ctx.stroke();}}
        } else if(ob.k==='p'){
          var ph=1.05*s,pw=Math.max(.6,.11*s); if(ph<1)continue;
          ctx.fillStyle=css(mix(P.post,fc,ft)); ctx.fillRect(x0-pw/2,y0-ph,pw,ph);
          ctx.fillStyle=css(mix([20,20,22],fc,ft)); ctx.fillRect(x0-pw/2,y0-ph,pw,ph*.2);
        } else if(ob.k==='w'){
          var wh=ob.h*s, ww=Math.max(.7,.24*s), wc=mix(P.tree,fc,ft*.88);
          ctx.fillStyle=css(wc); ctx.fillRect(x0-ww/2,y0-wh,ww,wh);
          ctx.fillRect(x0-.9*s,y0-wh+.45*s,1.8*s,Math.max(.6,.12*s));
          // three wires sagging to the next pole
          var z2=ob.z+48, s2=FD/z2, x2=vxD+(ob.X+bend(z2))*s2, zm=ob.z+24, sm=FD/zm, xm=vxD+(ob.X+bend(zm))*sm;
          var wg=ctx.createLinearGradient(x0,0,x2,0); wg.addColorStop(0,css(mix(P.tree,fc,ft*.9),.9)); wg.addColorStop(1,css(fogAt(hy),0));ctx.strokeStyle=wg; ctx.lineWidth=Math.max(.45,.025*s);
          for(var a=-1;a<=1;a++){var y1=hyD+(camH-ob.h+.5)*s, y2=hyD+(camH-ob.h+.5)*s2, ym=hyD+(camH-ob.h+.5+.7)*sm;
            var o1=a*.8*s,o2=a*.8*s2,om=a*.8*sm;
            ctx.beginPath();ctx.moveTo(x0+o1,y1);ctx.quadraticCurveTo(2*(xm+om)-(x0+o1+x2+o2)/2,2*ym-(y1+y2)/2,x2+o2,y2);ctx.stroke();}
        }
      }
    }
    var refl=d.createElement('canvas'); refl.width=W; refl.height=Math.max(1,Math.ceil(hyD)+2);
    var rx=refl.getContext('2d'); rx.putImageData(img,0,0); drawObjs(rx,0,1e9);
    var R=rx.getImageData(0,0,W,refl.height).data, RH=refl.height;

    /* 3 ─ ground, per pixel: asphalt with patches, tar seams, ruts and wet sheen; worn markings; gravel; verge; ditch */
    var g0=Math.max(0,Math.floor(hyD)), lc=P.half/2;
    for(py=g0;py<HH;py++){
      var dy=py+.5-hyD; if(dy<=.5){continue;}
      var z=FD*camH/dy, fp=z/FD, ft=1-Math.exp(-z*dens), fc=fogAt(py/dpr), cz=bend(z);
      var cosI=camH/Math.sqrt(camH*camH+z*z), fres=.02+.98*Math.pow(1-cosI,5);
      var near=cl(.035/fp), edgeN=(vn(z*.07,3.3)-.5)*.3+(vn(z*.9,8.1)-.5)*.06, dash=((z+4.2)%12)<3;
      var aaW=Math.max(fp,1e-4), ry=Math.max(0,Math.min(RH-1,Math.round(hyD-dy*1.02))), spread=1+Math.min(14,dy*.04);
      for(px=0;px<W;px++){
        var X=(px+.5-vxD)*fp-cz, ax=X<0?-X:X, col, wet=0, rough=1, ed=P.half+edgeN;
        if(ax<ed){
          // asphalt
          var patch=fbm(X*.35+40,z*.1,3), tex=fp<.05?(vn(X*9,z*9)-.5)*.35*near:0, gn=(rnd()-.5)*.55*near;
          var lum=.82+.36*(patch-.5)+tex+gn;
          var seam=Math.abs(fbm(X*.7+3,z*.22+5,3)-.5); if(seam<.0045*(1+fp*25)&&fp<.08){lum*=.72;wet=Math.max(wet,.18);}
          col=[P.asph[0]*lum,P.asph[1]*lum,P.asph[2]*lum];
          var dl=Math.abs(Math.abs(X-(X<0?-lc:lc))-.85), rut=Math.exp(-(dl*dl)/.09);
          wet=Math.max(wet,ss(.44,.66,fbm(X*.3+9,z*.075,4))*.95, rut*.55);
          rough=.55+.45*(1-rut);
          // markings: edge lines + dashed centre line, worn
          var wear=ss(.32,.58,fbm(X*1.6+2,z*.35,3)), m=0;
          m=Math.max(m,cl((.075-Math.abs(ax-(P.half-.4)))/aaW+.5));
          if(dash)m=Math.max(m,cl((.06-ax)/aaW+.5));
          m*=wear*(.55+.45*cl(1.2-fp*8));
          if(m>0)col=mix(col,P.mark,m*.8);
        } else if(ax<ed+.9){
          var gl=.8+.4*fbm(X*4,z*4,2)+(rnd()-.5)*.6*near; col=[P.gravel[0]*gl,P.gravel[1]*gl,P.gravel[2]*gl];
          wet=ss(.5,.7,fbm(X*.4,z*.1+3,3))*.5; rough=1.6;
        } else {
          var vg=ax-ed-.9, gt=.62+.6*fbm(X*1.3+5,z*.6,3)+(rnd()-.5)*.5*near;
          col=[P.grass[0]*gt,P.grass[1]*gt,P.grass[2]*gt];
          if(vg>1.3&&vg<3.6){var dd=Math.sin((vg-1.3)/2.3*Math.PI); col=mix(col,P.ditch,dd*.8);
            if(dd>.82){wet=ss(.4,.55,fbm(X*.5,z*.2+11,3))*.95; rough=.4;}}
          if(vg>3.6)col=mix(col,P.floor,ss(3.6,7,vg));
        }
        var Rf=wet*(.25+.75*fres)*(1-.35*(rough-1>0?rough-1:0)) + .03*fres;
        if(Rf>.004){
          var sx=Math.round(px+(vn(px*.06,py*.4)-.5)*3*rough); if(sx<0)sx=0; if(sx>=W)sx=W-1;
          var r0=0,r1=0,r2=0;
          for(var tp=-1;tp<=1;tp++){var yy=Math.max(0,Math.min(RH-1,Math.round(ry+tp*spread*rough))),kk=(yy*W+sx)*4;r0+=R[kk];r1+=R[kk+1];r2+=R[kk+2];}
          var dark=1-wet*.45; col=[col[0]*dark*(1-Rf)+r0/3*Rf,col[1]*dark*(1-Rf)+r1/3*Rf,col[2]*dark*(1-Rf)+r2/3*Rf];
        }
        k=(py*W+px)*4; D[k]=col[0]+(fc[0]-col[0])*ft; D[k+1]=col[1]+(fc[1]-col[1])*ft; D[k+2]=col[2]+(fc[2]-col[2])*ft; D[k+3]=255;
      }
    }
    x.putImageData(img,0,0);

    /* 2b ─ the objects themselves over the ground, by distance bins: far ones softened by the fog */
    var tmp=d.createElement('canvas'); tmp.width=W; tmp.height=HH; var tx=tmp.getContext('2d');
    bins.forEach(function(b){tx.clearRect(0,0,W,HH); drawObjs(tx,b[0],b[1]);
      x.filter=b[2]?'blur('+(b[2]*dpr)+'px)':'none'; x.drawImage(tmp,0,0); x.filter='none';});

    /* 4 ─ low ground fog hugging the road, vignette, grade */
    var gf=x.createLinearGradient(0,hyD-span*.12*dpr,0,hyD+span*.35*dpr);
    gf.addColorStop(0,css(P.skyHz,0)); gf.addColorStop(.35,css(mix(P.skyHz,P.fogA,.3),B2?.2:.42)); gf.addColorStop(1,css(P.fogNear,0));
    x.fillStyle=gf; x.fillRect(0,hyD-span*.12*dpr,W,span*.47*dpr);
    var vg2=x.createRadialGradient(vxD,hyD,Math.min(W,HH)*.18,vxD,hyD,Math.max(W,HH)*.85);
    vg2.addColorStop(0,'rgba(0,0,0,0)'); vg2.addColorStop(1,B2?'rgba(6,3,10,.62)':'rgba(0,2,4,.4)');
    x.fillStyle=vg2; x.fillRect(0,0,W,HH);
    if(B2){var gxp=vxD+bend(60)*FD/60, wr=x.createRadialGradient(gxp,hyD,0,gxp,hyD,Math.max(W*.42,HH*.3));
      wr.addColorStop(0,'rgba(196,128,84,.30)'); wr.addColorStop(.45,'rgba(150,92,96,.12)'); wr.addColorStop(1,'rgba(120,80,110,0)');
      x.globalCompositeOperation='screen'; x.save(); x.translate(gxp,hyD); x.scale(1,.5); x.translate(-gxp,-hyD); x.fillStyle=wr; x.fillRect(0,-HH*2,W,HH*6); x.restore();
      x.globalCompositeOperation='source-over';}
    if(B2){var lb=x.createLinearGradient(0,0,0,hyD); lb.addColorStop(0,'rgba(8,5,12,.4)'); lb.addColorStop(1,'rgba(8,5,12,0)'); x.fillStyle=lb; x.fillRect(0,0,W,hyD);}

    /* film grain baked into the still plate (no extra composited layer) */
    if(gc){x.globalAlpha=B2?.5:.55; x.fillStyle=x.createPattern(gc,'repeat'); x.fillRect(0,0,W,HH); x.globalAlpha=1;}

    if(V.dim){x.fillStyle='rgba(11,11,14,'+V.dim+')'; x.fillRect(0,0,W,HH);}

    /* 5 ─ moving fog: big billowy sheets, lit from above (volume), wider than the screen, never tiled */
    var specs = B2 ? [
        {y:hy-span*.36, h:span*.7,  sc:1.4, th:.36, a:.2,  col:P.fogB},
        {y:hy-span*.1,  h:span*.5,  sc:2.1, th:.42, a:.36, col:P.fogA},
        {y:hy+span*.22, h:span*.7,  sc:1.7, th:.5,  a:.24, col:P.fogA},
        {y:hy-span*.8,  h:span*.7,  sc:1.2, th:.5,  a:.08, col:P.fogA}
      ] : [
        {y:hy-span*.4,  h:span*.8,  sc:1.3, th:.34, a:.34, col:P.fogA},
        {y:hy-span*.12, h:span*.55, sc:2.0, th:.40, a:.46, col:P.fogA},
        {y:hy+span*.22, h:span*.7,  sc:1.6, th:.48, a:.3,  col:P.fogA}
      ];
    if(V.live)specs=[
        {y:hy-span*.42, h:span*.85, sc:1.2, th:.34, a:.3,  col:P.fogA},
        {y:hy-span*.16, h:span*.6,  sc:1.9, th:.40, a:.4,  col:P.fogA},
        {y:hy+span*.02, h:span*.55, sc:2.4, th:.44, a:.3,  col:P.fogA},
        {y:hy+span*.24, h:span*.7,  sc:1.6, th:.48, a:.26, col:P.fogA}
      ];
    if(V.live&&!L.narrow)specs.splice(2,1);           // wide screens: three sheets are enough (and keep 60 fps)
    reseed(B2?77:55); specs0=specs;
    if(V.flow){flowFog(L,w,hy,vx,span,P);return;}
    fogs.forEach(function(cv,n){
      var sp=specs[n]; if(!sp){cv.style.display='none';return;} cv.style.display='';
      var FW=Math.round(w*(V.live?1.7:1.32)), FH=Math.max(40,Math.round(sp.h)), RW=Math.min(440,Math.max(160,Math.round(FW/5))), RHh=Math.max(20,Math.round(RW*FH/FW));
      cv.width=RW; cv.height=RHh; cv.style.width=FW+'px'; cv.style.height=FH+'px';
      var x0=-w*(V.live?.35:.16); cv.style.transform='translate3d('+x0+'px,'+sp.y+'px,0)'; sp.x0=x0; sp.w=w;
      var fx=cv.getContext('2d'), im=fx.createImageData(RW,RHh), off=n*37.3+rnd()*50, ar=FW/FH;
      var den=new Float32Array(RW*(RHh+2));
      for(var yy=0;yy<RHh+2;yy++)for(var xx=0;xx<RW;xx++){var u=xx/RW*sp.sc*ar*.38+off, v=(yy-1)/RHh*sp.sc+off*.4;
        var wx=fbm(u*.6,v*.6,3)*.9, wy=fbm(u*.6+5.2,v*.6+1.3,3)*.7; den[yy*RW+xx]=fbm(u+wx,v+wy,5);}
      for(yy=0;yy<RHh;yy++){var vy=yy/(RHh-1);
        for(xx=0;xx<RW;xx++){var dn=den[(yy+1)*RW+xx], env=Math.sin(Math.PI*cl(vy+(fbm(xx/RW*6+off,3.1,2)-.5)*.35));
          env=env<0?0:env*env; var a2=ss(sp.th,1,dn)*env;
          var lit=1+(den[yy*RW+xx]-den[(yy+2)*RW+xx])*-5.5;                // brighter tops, darker bellies
          lit=lit<.7?.7:lit>1.25?1.25:lit;
          var kq=(yy*RW+xx)*4; im.data[kq]=Math.min(255,sp.col[0]*lit); im.data[kq+1]=Math.min(255,sp.col[1]*lit); im.data[kq+2]=Math.min(255,sp.col[2]*lit);
          im.data[kq+3]=Math.min(255,a2*sp.a*V.fm*255*1.25);}}
      fx.putImageData(im,0,0);
    });
  }
  /* drift: compositor-only transform animations, long incommensurate periods, parallax by depth */
  var DR = B2 ? [[170,.04,0],[112,-.07,4],[76,.11,-5],[132,-.05,6]] : [[210,-.03,0],[150,.05,-3],[104,-.08,4]];
  var anims=[];
  function animate(){
    var keep=anims.map(function(a){return a.currentTime;}); anims.forEach(function(a){a.cancel();}); anims=[]; if(reduce||!fogs[0].animate)return; setTimeout(function(){anims.forEach(function(a,i){if(keep[i]!=null)a.currentTime=keep[i];});},0);
    if(V.flow){
      FLOW.forEach(function(f){
        if(f.kind==='stream')anims.push(f.el.animate([{transform:'translate3d(0px,'+f.y+'px,0)'},{transform:'translate3d('+(-f.Pw)+'px,'+f.y+'px,0)'}],
          {duration:f.dur*1000,iterations:Infinity,easing:'linear',delay:-f.dur*1000*.37}));
        else{var T=16000, a=f.el.animate([
            {transform:'translate3d('+f.x+'px,'+f.y+'px,0) scale(1)',opacity:0},
            {transform:'translate3d('+(f.x+f.drift*T/2000)+'px,'+f.y+'px,0) scale(1.2)',opacity:1,offset:.5},
            {transform:'translate3d('+(f.x+f.drift*T/1000)+'px,'+f.y+'px,0) scale(1.4)',opacity:0}],
            {duration:T,iterations:Infinity,easing:'linear',delay:-T*(.2+f.i*.5)});
          anims.push(a);}
      });
      return;
    }
    if(V.live){
      /* living fog: steady visible drift (layers cross ~.3–.45 of the width per minute or so, opposite directions
         for neighbouring depths = shear, i.e. soft swirling), a wandering vertical path, and slow, desynchronised
         breathing of density (opacity) */
      var LV=[[72,.24,7,1.03,23],[56,-.28,-9,1.05,17],[46,.27,10,1.04,29],[40,-.32,-8,1.05,19]];
      fogs.forEach(function(cv,n){var sp=specs0[n], l=LV[n]; if(!sp||!l)return;
        var kf=[], k;
        for(k=0;k<=4;k++){var f=k/4, yo=Math.sin(f*Math.PI*2+n)*l[2], s=1+(l[3]-1)*Math.sin(f*Math.PI);
          kf.push({transform:'translate3d('+(sp.x0+l[1]*sp.w*f)+'px,'+(sp.y+yo)+'px,0) scale('+s.toFixed(4)+')'});}
        var tf=Math.max(.55,Math.min(1,sp.w/800)); anims.push(cv.animate(kf,{duration:l[0]*1000*tf,iterations:Infinity,direction:'alternate',easing:'linear',delay:-l[0]*1000*tf*((n*.29+.15)%1)}));
        anims.push(cv.animate([{opacity:1},{opacity:.55},{opacity:.9},{opacity:.65},{opacity:1}],
          {duration:l[4]*1000,iterations:Infinity,easing:'ease-in-out',delay:-l[4]*1000*((n*.41)%1)}));
      });
      return;
    }
    fogs.forEach(function(cv,n){var sp=specs0[n], dr=DR[n]; if(!sp||!dr)return;
      var sc=B2?' scale('+(1+.035+n*.012)+')':'';     // B2: the fog slowly comes towards the low camera
      var a=cv.animate([{transform:'translate3d('+sp.x0+'px,'+sp.y+'px,0)'},{transform:'translate3d('+(sp.x0+dr[1]*sp.w)+'px,'+(sp.y+dr[2])+'px,0)'+sc}],
        {duration:dr[0]*1000,iterations:Infinity,direction:'alternate',easing:'ease-in-out',delay:-dr[0]*1000*((n*.37)%1)});
      anims.push(a);});
  }
  var specs0=[];
  var _paint=paint; paint=function(){_paint();animate();};
  paint();
  var hb0=hero.getBoundingClientRect();if(d.fonts&&d.fonts.ready)d.fonts.ready.then(function(){var hb=hero.getBoundingClientRect();if(Math.abs(hb.width-hb0.width)>1||Math.abs(hb.height-hb0.height)>40)requestAnimationFrame(paint)});
  var lw=innerWidth, rt; addEventListener('resize',function(){if(innerWidth===lw)return;lw=innerWidth;clearTimeout(rt);rt=setTimeout(function(){paint();},180)},{passive:true});
  if(!reduce&&'IntersectionObserver' in window) new IntersectionObserver(function(e){
    anims.forEach(function(a){e[0].isIntersecting?a.play():a.pause();});
  }).observe(hero);
})();
