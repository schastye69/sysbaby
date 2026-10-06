(()=>{var Om=n=>{try{return typeof matchMedia=="function"?matchMedia(n):null}catch{return null}},Mf=Om("(prefers-reduced-motion: reduce)"),Sf=Om("(pointer: coarse)"),_f=typeof navigator<"u"&&navigator.userAgent||"",Dm=typeof navigator<"u"&&navigator.maxTouchPoints||0,tn={reducedMotion:!!(Mf&&Mf.matches),coarse:!!(Sf&&Sf.matches),touch:Dm>0,ios:/iPad|iPhone|iPod/.test(_f)||/Macintosh/.test(_f)&&Dm>1,android:/Android/i.test(_f)},Nm=[];function Um(n,e){n&&(n.addEventListener?n.addEventListener("change",e):n.addListener&&n.addListener(e))}Um(Mf,n=>{tn.reducedMotion=!!n.matches;for(let e=0;e<Nm.length;e++)try{Nm[e](tn.reducedMotion)}catch(t){Rt("env:rm","reduced-motion listener failed",t)}});Um(Sf,n=>{tn.coarse=!!n.matches});var Fm=new Set;function Rt(n,...e){if(!Fm.has(n)){Fm.add(n);try{console.warn(`[sam.vin] ${n}:`,...e)}catch{}}}var nc=new Map,Oe={on(n,e){let t=nc.get(n);return t||(t=[],nc.set(n,t)),t.push(e),()=>Oe.off(n,e)},off(n,e){let t=nc.get(n);if(!t)return;let i=t.indexOf(e);i<0&&(i=t.findIndex(r=>r.orig===e)),i>=0&&t.splice(i,1)},once(n,e){let t=i=>{Oe.off(n,t),e(i)};return t.orig=e,Oe.on(n,t),()=>Oe.off(n,t)},emit(n,e){let t=nc.get(n);if(!t||t.length===0)return;let i=t.slice();for(let r=0;r<i.length;r++)try{i[r](e)}catch(s){Rt(`bus:${n}`,`listener for '${n}' threw`,s)}}};var da=Object.freeze(["void","abyss","deep","steel","slate","pewter","silver","white","obsidian","ember","emberDeep","electrum","paper","ink"]),pa=Object.freeze({void:"--void",abyss:"--abyss",deep:"--deep",steel:"--steel",slate:"--slate",pewter:"--pewter",silver:"--silver",white:"--white",obsidian:"--obsidian",ember:"--ember",emberDeep:"--ember-deep",electrum:"--electrum",paper:"--paper",ink:"--ink"}),Qs=Object.freeze({void:"#04060A",abyss:"#070B12",deep:"#0C1420",steel:"#13202F",slate:"#233446",pewter:"#5E6E80",silver:"#B8C4D0",white:"#EEF2F6",obsidian:"#0B1119",ember:"#FF6A2B",emberDeep:"#B23A12",electrum:"#E8C872",paper:"#E6EAEE",ink:"#0C1420"}),Bm=Object.freeze({void:"#E6EAEE",abyss:"#E6EAEE",deep:"#E6EAEE",steel:"#9AA6B4",slate:"#9AA6B4",silver:"#0C1420",white:"#0C1420",obsidian:"#D3D9DF"});function bf(n){return parseInt(n.slice(1),16)}function km(n,e=[0,0,0]){let t=bf(n);return e[0]=(t>>16&255)/255,e[1]=(t>>8&255)/255,e[2]=(t&255)/255,e}function sc(n,e){let t={};for(let i of Object.keys(n))t[i]=e(n[i]);return Object.freeze(t)}var UA=sc(Qs,bf),xy=sc(Qs,n=>Object.freeze(km(n))),BA=sc(Bm,bf),vy=sc(Bm,n=>Object.freeze(km(n)));function oc(n,e,t=[0,0,0]){let i=xy[n],r=vy[n]||i;return t[0]=i[0]+(r[0]-i[0])*e,t[1]=i[1]+(r[1]-i[1])*e,t[2]=i[2]+(r[2]-i[2])*e,t}var kA=Object.freeze({giant:.07,counter:.12,status:.85,scrim:.6,scrimBreath:[.58,.62],leader:.7,line:.55,vertex:.4,inlay:.45,fresnel:.55,grains:.35,grainsBreath:[.32,.38],axisInside:.35,marginalia:.8,legendBand:.4,column:.7,dimmed:.4,hoverOthers:.55,dome:.45,contours:.4,doneLight:.12,ghost:.6,ghostStroke:.3,whale:.3,spark:.3,rimBoot:[.06,.12],bandHover:1.25}),zA=Object.freeze({maxFrac:.03,peakFrac:.06,peakMs:1500,maxLinePx:2,maxDotPx:6,maxTextPx:11,burnCoolMs:1200}),VA=Object.freeze({maxMs:2500,coolMs:600,nightNucleus:.55}),ar=Object.freeze({nucleusIntensity:.55,litAlpha:.7,breathMs:7e3,drowsyBreathMs:5600,mixMs:1200,yawnMs:1200}),GA=Object.freeze({sans:'"Geologica", system-ui, sans-serif',mono:'"Martian", ui-monospace, monospace'}),HA=Object.freeze({giant:{family:"sans",wght:100,tracking:-.04,lh:.8,desktop:"38vw",phone:"62vmin",alpha:.07},display:{family:"sans",wght:220,tracking:-.035,lh:.9,desktop:"clamp(56px, 8.4vw, 148px)",phone:"13vmin"},heading:{family:"sans",wght:560,desktop:[28,34],phone:[26,31]},lead:{family:"sans",wght:300,desktop:[22,30],phone:[19,26]},brief:{family:"sans",wght:380,desktop:[19,28],phone:[17,25]},body:{family:"sans",wght:380,desktop:[17,25],phone:[16,24],measureCh:36},status:{family:"sans",wght:400,desktop:[16,22],phone:[16,22],maxChars:34,measureCh:44},label:{family:"mono",wght:500,wdth:87.5,tracking:.08,upper:!0,desktop:[11,14],phone:[11,14]},data:{family:"mono",wght:250,wdth:100,tabular:!0,desktop:[72,72],phone:[48,48]},micro:{family:"mono",wght:450,wdth:75,tracking:.1,upper:!0,desktop:[9.5,12],phone:[10,13]}}),ma=Object.freeze({sign:'700 {px}px "Geologica"',burn:'700 {px}px "Geologica"',sand:'700 {px}px "Geologica"',ring:'500 {px}px "Martian"'});var rc=Object.freeze({base:20,range:80,perDay:.08,perSecret:.06});function wf(n,e){return Math.min(1,rc.perDay*n+rc.perSecret*e)}function zm(n,e){return Math.round(rc.base+rc.range*wf(n,e))}var WA=Object.freeze([120,240,480,960,1920]),XA=Object.freeze({o1:120,o2:240,o3:480,o4:960,o5:1920}),yy=Object.freeze({heavy:Object.freeze({omega:6,zeta:1}),medium:Object.freeze({omega:12,zeta:1}),light:Object.freeze({omega:22,zeta:1}),struck:Object.freeze({omega:18,zeta:.18}),notice:Object.freeze({omega:6.3,zeta:.95}),reindex:Object.freeze({omega:9,zeta:1}),hot:Object.freeze({omega:14,zeta:1}),hint:Object.freeze({omega:8,zeta:.25})}),$n=Object.freeze({inertiaDecay:.92,frameMs:16.7,spinDecay:.96,overshootMax:.04,snapOvershoot:.04,settleOvershoot:.02,anticipationFrac:.03,anticipationMs:120,anticipationMinDisp:.1,responseMs:80,pressScale:.96,pressMs:90,rippleMs:260,ripplePx:48}),eo=Object.freeze({periodMs:4200,inhaleMs:1800,exhaleMs:2400,drowsyMs:5600,nightMs:7e3,reducedAmp:.25,nucleus:[.8,1],gap:[.02,.026],grainAlpha:[.32,.38],scrim:[.58,.62],edgeSwayPx:.2,droneDb:2});function ic(n,e,t,i){let r=3*n,s=3*(t-n)-r,o=1-r-s,a=3*e,l=3*(i-e)-a,c=1-a-l,u=f=>((o*f+s)*f+r)*f,d=f=>((c*f+l)*f+a)*f,h=f=>(3*o*f+2*s)*f+r;return function(g){if(g<=0)return 0;if(g>=1)return 1;let _=g;for(let S=0;S<8;S++){let b=u(_)-g;if(Math.abs(b)<1e-6)return d(_);let y=h(_);if(Math.abs(y)<1e-6)break;_-=b/y}let m=0,p=1;_=g;for(let S=0;S<24;S++){let b=u(_);if(Math.abs(b-g)<1e-6)break;b<g?m=_:p=_,_=(m+p)/2}return d(_)}}var YA=Object.freeze({camera:Object.freeze([.7,0,.15,1]),reveal:Object.freeze([.16,1,.3,1]),phosphor:Object.freeze([.2,0,0,1])}),Vm=Object.freeze({camera:ic(.7,0,.15,1),reveal:ic(.16,1,.3,1),phosphor:ic(.2,0,0,1),linear:n=>n<=0?0:n>=1?1:n,sine:n=>.5-.5*Math.cos(Math.PI*(n<=0?0:n>=1?1:n))}),Ze=Object.freeze({dive:1600,diveFirst:2400,diveFirstScale:1.375,diveFirstHold:200,diveSwapAt:1200,diveSwapAtFirst:1850,recall:1200,recallSwapAt:1e3,recallRatchetMs:40,liftBase:900,liftPerBoundary:280,liftMax:1800,slice:280,sliceSwap:140,depart:240,arrive:600,readableOut:120,retargetMin:600,retargetFactor:.8,skipSpeed:3,interactiveU:.7,releaseSourceMs:300,tierFreezeMs:300,unfold:1600,unfoldFirst:2200,refold:900,memberFocus:900,memberBack:600,shluz:1400,shluzBack:900,extract:600,workshop:1200,zenith:2400,nadirFirst:2800,focusReduced:160,bootDesktop:7200,bootReturning:3500,bootSameDay:2e3,bootReduced:2e3,lockStep:220,lockStepSameDay:110,firstLock:3400,ignite:4940,ignitionReturning:2640,typeMsPerChar:28,scanMs:800,burnMsPerLetter:70,burnCoolMs:1200,assemble:480,drawIn:600,phoneActivateWindow:1500,phonePartialHold:2500,phonePartialDrift:900,phoneHintDelay:2200,phoneHintReturning:4e3,lockIn:480,lockInReduced:160,revealMsPerChar:12,revealMax:240,beamCps:22,phosphor:900,statusIn:240,statusHold:4e3,idleRotate:2e4,leadDefault:4e3,leaderDraw:240,leaderStagger:40,labelLowpass:120,coordHz:10,keyHoverTrigger:120,keyHoverIn:480,keyHoverOut:520,dimsDraw:240,navHover:240,navTwin:240,longPress:800,relaunch:2e3,relaunchRingDelay:300,hintGlint:1200,overpullHold:600,stringRing:900,stringFlash:120,shudder:240,hintArriveWindow:3e4,idleLampMs:3e3,lampSweepMs:9e3,lampBlendMs:600,shardFlight:900,electrum:2500,electrumCool:600});var Gm=Math.log(1e3),$A=Object.freeze([-1,0,1,2]),Hm=1.5,Ef=Object.freeze({near:.002,far:400}),Ai=Object.freeze({min:3.2,max:12,rest:7.2,wheelFactor:1.1,wheelStepPx:100}),qA=Object.freeze({d0:12,k:Gm,wheelDiv:2400,pinchGain:1.5,pauseMs:400,decay:.92,elevationDeg:8,settleIdleMs:600,settleMs:1600,settleTo:7.2,leadMs:4e3,strutTickMax:30,stages:Object.freeze([["КЛЮЧ",60],["ЗАЛ ЯДРА",600],["VIN",3600],["VIN ЦЕЛИКОМ",12e3]]),passLatticeD:[300,620]}),Wm=Object.freeze({d0:.06,k:Gm,miniKeyBelow:.05}),jA=Object.freeze({height:2400,diameter:1240,radius:620}),ms=Object.freeze({H:2.4,R:.62,k:1.35,halfH:1.2});function qt(n){let e=Math.min(1,Math.abs(n)/ms.halfH);return ms.R*(1-Math.pow(e,ms.k))}var Mn=Object.freeze([{i:0,sign:"S",code:"SIGNAL",top:1.2,bot:.98,n:3,hollow:0,k:72},{i:1,sign:"A",code:"ARCHIVE",top:.96,bot:.66,n:5,hollow:0,k:120},{i:2,sign:"M",code:"MEMBERS",top:.64,bot:.28,n:7,hollow:0,k:168},{i:3,sign:"•",code:"CORE",top:.26,bot:-.26,n:12,hollow:.3,k:288},{i:4,sign:"V",code:"VOYAGES",top:-.28,bot:-.64,n:7,hollow:0,k:168},{i:5,sign:"I",code:"INSIGNIA",top:-.66,bot:-.96,n:5,hollow:0,k:120},{i:6,sign:"N",code:"NADIR",top:-.98,bot:-1.2,n:3,hollow:0,k:72}].map(n=>Object.freeze({...n,height:Math.round((n.top-n.bot)*1e3)/1e3,mid:(n.top+n.bot)/2,rTop:qt(n.top),rBot:qt(n.bot),rMax:n.top>0&&n.bot<0?ms.R:Math.max(qt(n.top),qt(n.bot))}))),ga=Object.freeze(["S","A","M","•","V","I","N"]),ac=Object.freeze([0,1/3,2/3,1]),St=Object.freeze({rest:.02,breath:.026,leanAdd:.01,hover:.09,hoverNeighbourPush:.012,dive:.3,unfold:.42,recallStart:.3}),wt=Object.freeze({radius:1.25,apertureD:.09,ringEngraveW:.004,hollowR:.3,sign:Object.freeze({depth:.004,heightFrac:.7,strokeFrac:.12,face:0}),friezeH:.018,ticksPerFace:12,tickLen:.025,backFace:6,hoverSlide:.06,diveSlide:.25,diveTurnAwayDeg:20,contract:.03,nucleusAnticipation:1.6,lattice:Object.freeze({faceShift:.75,segmentsPerGenerator:8,generators:2016,segments:16128,solidBelowCamDist:2.4}),r1:Object.freeze({spLo:3,spHi:6}),unfold:Object.freeze({camFrom:7.2,camTo:Object.freeze([0,.04,.95]),ringScale:2.4,ringR:1.3,ringArcDeg:300,ringCap:.06,coreRingCap:.12,platesR:.16,plateSize:.05,platesPeriodS:24,orbitYawDeg:35}),pitchFlipDeg:110,pitchResist:.35,pitchResistMaxDeg:30,yawMaxDeg:180,yawReturnMs:2e3}),En=Object.freeze({r:.035,detail:1,glowR:.0528,breathRingR:.09,apertureAlignDeg:Object.freeze([35,10]),gapOpen:Object.freeze([.03,.09]),minVisibility:.25,hotGain:.4,intensity:Object.freeze([.8,1]),birthdayPulse:1.3}),mi=Object.freeze({half:1.2,extend:3.2,widthPx:2,alphaInside:.35,shootMs:240}),ZA=Object.freeze({driftYawDeg:14,driftPeriodS:40,swayDeg:1.5,swayPeriodsS:Object.freeze([11,13,17,19,23,29,31]),faceViewerDeg:16,reindexMs:Object.freeze([23e3,41e3]),reindexBackMs:1600,reindexTurnMs:620,noticeMaxDeg:7,noticeBootDeg:6,tauBaseMs:40,tauStepMs:40,hotDelayMs:220,hotDelayLateMs:90,hotTrackMs:3e3,hotRampMs:1e3,leanSpeedPx:300,leanRadius:1.2,leanDz:.08,flinchSpeedPx:2500,flinchRadius:1.5,flinchInMs:120,flinchRelaxMs:700,flinchScatter:.05,repelR:.35,repelCap:.06,repelBackMs:900}),to=Object.freeze({T3:24576,T2:16384,T1:8192,annulus:Object.freeze([1.15,1.9]),kepler:.06,jitter:.002,sizePx:Object.freeze([1.2,2]),chunk:4096}),gs=Object.freeze({faces:Object.freeze([11,0,1]),stratum:3,apertureSkip:.06,dotPx:1.5,emitterM:1.2}),KA=Object.freeze({max:7,size:.1,r:1.05,tiltDeg:12,periodS:90}),JA=Object.freeze({size:.24,r:1.6,periodS:60,bpm:71,arriveDay:10,flyMs:2400});var Xm=Object.freeze({SIGNAL:1090,ARCHIVE:810,MEMBERS:460,CORE:0,VOYAGES:-460,INSIGNIA:-810,NADIR:-1090,ZENITH:1260,WORKSHOP:484}),Ym=Object.freeze({SIGNAL:[980,1200],ARCHIVE:[660,960],MEMBERS:[280,640],CORE:[-260,260],VOYAGES:[-640,-280],INSIGNIA:[-960,-660],NADIR:[-1200,-980],ZENITH:[1200,1400],WORKSHOP:[482,487]}),on=Object.freeze({wallsNear:300,wallsFar:620,wallVis:Object.freeze([.08,.14]),strutSpacing:Object.freeze([13,60]),ringStep:20,irisR:18,irisBlades:7,irisBladeDeg:51.4,irisPassR:12,deckR:60,deckRingStep:4,beadR:1.8,beadStep:25,beadCount:97,coreRimR:300,coreIrisY:260,liftOffset:Object.freeze([12,0,6]),drawCalls:40,triangles:12e4,labels:24,labelsLow:16}),$e=Object.freeze({fov:35,fovWide:40,core:Object.freeze({pos:[0,.75,7.2],target:[0,0,0],fov:35,phoneOffsetY:-.06}),boot:Object.freeze({start:[0,.4,16],dolly:9.5,rest:7.2,driftM:.08,driftHz:[.13,.11],tiltDeg:3}),phoneStart:Object.freeze({dist:5.2,keyFrac:.78,centreFrac:.47}),members:Object.freeze({pos:[0,10,48],target:[0,12.5,0],fov:35,phonePos:[0,11,40]}),voyages:Object.freeze({pos:[0,70,44],target:[0,0,-6],fov:35,altRange:[60,140],phonePos:[0,96,30],phonePitchDeg:-70}),archive:Object.freeze({tubeR:9,eyeBelowBand:.4}),signal:Object.freeze({pos:[0,2,26],target:[0,30,0],fov:40,phonePos:[0,2,30],phonePitchDeg:40,apexH:110,apexR:12}),insignia:Object.freeze({pos:[0,1.7,0],fov:40,sphereR:30}),nadir:Object.freeze({depth:110}),zenith:Object.freeze({aboveApex:60,pitchDeg:-62,phonePitchDeg:-70}),workshop:Object.freeze({chamber:4.4,grid:2.4,nodeStep:.4})}),ti=Object.freeze({phoneMaxShort:600,landMaxH:500,desktop:Object.freeze({cols:12,margin:48,gutter:24,chrome:24,edgeInset:14,statusBottom:40,datumFrac:.62}),phone:Object.freeze({cols:4,margin:16,gutter:12,chrome:16,edgeInset:10,statusAboveBand:12,datumPx:120,titleTopPx:72}),measureCh:36,statusMeasureCh:44,hit:44,hitRow:56,crossPx:7,leader:Object.freeze({widthPx:.5,alpha:.7,elbowMin:24,elbowMax:64,runMax:120,maxAnchors:24,maxAnchorsLow:16}),dims:Object.freeze({widthPx:.5,arrowPx:6,extPx:4,gapPx:4,offsetPx:24}),scrim:Object.freeze({scale:1.4,featherPx:40}),nav:Object.freeze({w:56,h:300,hoverW:260,right:24,widthScale:.36,needlePx:12,slotPx:3,zenithDotPx:2,zenithDotAbove:10,twinPx:40,magnetPx:12,wheelPxPerDetent:120,rubber:.35,rubberMax:48,overpullPx:140,letterPx:11}),band:Object.freeze({h:88,sideW:72,letterPx:13,minCell:44}),sheet:Object.freeze({maxFrac:.62,peek:120,handle:24,sideFrac:.44}),elevator:Object.freeze({pxPerHall:360,resistance:.22,tickPx:60}),edge:Object.freeze({pluckPxMs:.4,bendPx:8,twitchPx:2}),sound:Object.freeze({w:32,h:12,bars:8,fps:30}),cursorPx:6,rippleMaxPx:48,beamHeadPx:3,statusDotPx:6}),Vt=Object.freeze({r1:Object.freeze({lo:3,hi:6,bayer:8}),r2:Object.freeze({fresnelPow:3,fresnelGain:.55,spec:Object.freeze([[24,.35],[160,.6]])}),r3:Object.freeze({widthPx:1,primaryPx:1.5,axisPx:2,alpha:.55,glintPow:24,glintGain:.9,farFadeStart:.55,primaryEdges:12}),r4:Object.freeze({atlas:1024,atlasLow:512,rakeLo:.55,rakeHi:.9,inlay:.45,heightTaps:4}),r5:Object.freeze({radiusFactor:2.2,elevationDeg:12,idleMs:3e3,sweepMs:9e3,blendMs:600}),r6:Object.freeze({threshold:.82,levels:4,spritePx:64}),r7:Object.freeze({grain:.02,grainBoot:.025,grainBootUntilMs:1800,grainFps:24,clearInPx:120,clearOutPx:180,vignette:.18,vignetteFrom:.35}),r8:Object.freeze({fogVis:Object.freeze([.08,.14])}),dprCap:Object.freeze({T3:2,T2:1.5,T1:1.25}),dprStep:.25,governor:Object.freeze({windowFrames:90,lowFps:52,dropAfterMs:3e3,highFps:58,upgradeAfterMs:1e4}),budget:Object.freeze({drawCalls:40,triangles:12e4,textureMB:12})}),$m=30;var Ge={kind:"desktop",isPhone:!1,w:0,h:0,dpr:1,safe:{t:0,r:0,b:0,l:0}},no=null;function _y(){if(typeof document>"u"||!document.body)return;no||(no=document.createElement("div"),no.setAttribute("aria-hidden","true"),no.style.cssText="position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)",document.body.appendChild(no));let n=getComputedStyle(no);Ge.safe.t=parseFloat(n.paddingTop)||0,Ge.safe.r=parseFloat(n.paddingRight)||0,Ge.safe.b=parseFloat(n.paddingBottom)||0,Ge.safe.l=parseFloat(n.paddingLeft)||0}var Af=null;function My(){try{return Af||(Af=matchMedia("(pointer: coarse)")),Af.matches}catch{return!1}}function lc(){if(typeof window>"u")return!1;let n=Math.max(1,Math.round(window.innerWidth||document.documentElement.clientWidth||1)),e=Math.max(1,Math.round(window.innerHeight||document.documentElement.clientHeight||1)),t=My()&&Math.min(n,e)<=ti.phoneMaxShort,i=t?e<ti.landMaxH?"phone-land":"phone":"desktop",r=window.devicePixelRatio||1,s=Ge.safe.t,o=Ge.safe.r,a=Ge.safe.b,l=Ge.safe.l;_y();let c=n!==Ge.w||e!==Ge.h||i!==Ge.kind||r!==Ge.dpr||s!==Ge.safe.t||o!==Ge.safe.r||a!==Ge.safe.b||l!==Ge.safe.l;return Ge.w=n,Ge.h=e,Ge.kind=i,Ge.isPhone=t,Ge.dpr=r,c}var Tf=0;function Rf(){if(Tf)return;let n=()=>{Tf=0,lc()&&Oe.emit("layout:change",{kind:Ge.kind,w:Ge.w,h:Ge.h})};Tf=typeof requestAnimationFrame=="function"?requestAnimationFrame(n):setTimeout(n,16)}if(typeof window<"u"){lc(),window.addEventListener("resize",Rf),window.addEventListener("orientationchange",Rf);try{matchMedia("(pointer: coarse)").addEventListener("change",Rf)}catch{}}var ue={phase:"boot",room:"CORE",route:{room:"CORE",sub:null,hash:"#/core"},u:0,tier:"T2",soundOn:!0,night:!1,drowsy:!1,birthday:!1,owner:!1,inverted:!1,unfolded:!1,pullNest:0,resonancePct:0,status:"",columns:[],satellites:0,companion:!1,booting:!0,hintTarget:null};function lr(n){let e=ue.phase;n!==e&&(ue.phase=n,Oe.emit("phase:change",{phase:n,prev:e}))}var io={operator:{id:"sam",name:"Сэм",aliases:["сэм","sam","сэмми","семён","semyon"],callsign:"ВЕДУЩИЙ",birthday:"2018-04-12"},clan:{name:"SAM.VIN",motto:"Своих не бросаем. Даже в лаве.",founded:"2025-03-14",frequency:14.03,sigil:[[3,21],[21,45],[45,27],[27,3],[21,27],[3,45]]},members:[{id:"sam",name:"Сэм",callsign:"ВЕДУЩИЙ",role:"основатель",status:"на связи",level:12,missions:21,seed:7,note:"D4",glyph:null,trait:"Придумал клан на перемене. Всегда идёт первым.",joke:"Говорит «я рядом», когда он на другом конце карты.",achievements:["start","bridge","onehp"]},{id:"lev",name:"Лёва",callsign:"ЯКОРЬ",role:"защита",status:"на связи",level:11,missions:17,seed:23,note:"G3",glyph:[[3,38],[9,11],[38,29],[38,33]],trait:"Если Лёва держит точку — точка держится.",joke:"Знает все карты наизусть. Даже те, которых нет.",achievements:["start","bridge"]},{id:"tim",name:"Тимур",callsign:"ЭХО",role:"разведка",status:"в пути",level:9,missions:14,seed:41,note:"A3",glyph:[[21,9],[9,39],[39,27]],trait:"Слышит соперника раньше, чем тот появится.",joke:"Всегда приходит последним — и спасает всех.",achievements:["three"]},{id:"kira",name:"Кира",callsign:"ЛИСА",role:"наблюдение",status:"на связи",level:10,missions:15,seed:5,note:"B3",glyph:[[8,38],[38,12],[12,8],[8,2],[12,4]],trait:"Видит то, что пропустили все.",joke:"Однажды спряталась так, что её не нашли до конца матча.",achievements:["silent","three"]},{id:"danya",name:"Даня",callsign:"ГРОМ",role:"прорыв",status:"отдыхает",level:8,missions:11,seed:17,note:"E4",glyph:[[4,23],[23,25],[25,44]],trait:"Громкий только в голосовом чате.",joke:"Прыгнул с крыши. Долетел. До сих пор этим гордится.",achievements:["roof"]},{id:"misha",name:"Миша",callsign:"КОМЕТА",role:"связь",status:"в пути",level:7,missions:9,seed:31,note:"G4",glyph:[[36,12],[36,26],[36,18]],trait:"Самый быстрый. Иногда слишком.",joke:"Первым добежал до финиша. В другую сторону.",achievements:["pizza"]},{id:"ars",name:"Арсений",callsign:"ТИШИНА",role:"новичок",status:"на связи",level:3,missions:2,seed:13,note:"A4",glyph:[[21,27],[24,17]],trait:"Новичок. Уже удивил всех.",joke:"Спросил, где кнопка «победить». Мы ищем до сих пор.",achievements:[]}],missions:[{code:"001",title:"Первая высадка",status:"done",brief:"Первый матч клана в полном составе.",conditions:["4 игрока","одна попытка"],crew:["sam","lev","tim","kira"],result:"Проиграли 0:12. Но вместе.",reward:"start",log:"Зонд нашёл на месте высадки старый флаг клана. Он всё ещё там."},{code:"002",title:"Мост над пропастью",status:"done",brief:"Перебраться всем отрядом. Никто не должен упасть.",conditions:["весь отряд","без возрождений"],crew:["sam","lev","danya","misha"],result:"Упали двое. Вернулись.",reward:"bridge",log:"Зонд проверил мост. Мост держится. Лёва, видимо, тоже."},{code:"003",title:"Тихая гавань",status:"done",brief:"Удержать маяк до заката и ни разу не потерять связь.",conditions:["отряд из 3","без потерь","до заката"],crew:["sam","kira","tim"],result:"Маяк наш. Связь — сто процентов.",reward:"silent",log:"Зонд вернулся. На маяке кто-то оставил пиццу."},{code:"004",title:"Северная башня",status:"active",brief:"Добраться до вершины втроём.",conditions:["3 игрока","без возрождений"],crew:["sam","lev","ars"],result:"",reward:"tower",log:"Зонд долетел до середины башни. Вершина видна. Она высокая."},{code:"005",title:"Ночная смена",status:"new",brief:"Продержаться до рассвета. Говорить только шёпотом.",conditions:["4 игрока","шёпотом","до рассвета"],crew:[],result:"",reward:"night",log:"Зонд слушал всю ночь. Кто-то храпел. Не будем говорить кто."},{code:"006",title:"Тёмная вода",status:"locked",decodeDays:5,brief:"Найти, откуда идёт сигнал под водой.",conditions:["5 игроков","с фонарями"],crew:[],result:"",reward:null,log:"Зонд нырнул. Сигнал идёт снизу. Там что-то светится."},{code:"007",title:"Город без карты",status:"locked",unlockAtDays:7,brief:"Пройти город, где никто не был, и нарисовать его карту.",conditions:["весь клан","без подсказок"],crew:[],result:"",reward:null,log:"Зонд нарисовал карту. Город похож на ключ. Совпадение?"},{code:"008",title:"Сто ступеней",status:"locked",unlockAtDays:14,brief:"Подняться по самой длинной лестнице, не упав ни разу.",conditions:["2 игрока","ни одного падения"],crew:[],result:"",reward:null,log:"Зонд насчитал 101 ступень. Одна была лишняя."},{code:"000",title:"Исток",status:"sealed",brief:"Вернуться туда, где всё началось, и оставить там свой знак.",conditions:["весь клан","знак лидера"],crew:[],result:"",reward:"origin",log:"Зонд вернулся с фото первого матча. Все улыбаются. Даже проигравшие."}],achievements:[{id:"start",title:"Начало",shape:"nested",rarity:"обычная",earned:!0,date:"2025-03-15",who:["sam","lev","tim","kira"],text:"Мы сыграли первый матч вместе."},{id:"roof",title:"Прыжок с крыши",shape:"knot",rarity:"легендарная",earned:!0,date:"2025-05-30",who:["danya"],text:"Никто не верил. Гром прыгнул. Гром долетел."},{id:"bridge",title:"Мост выстоял",shape:"twisted",rarity:"редкая",earned:!0,date:"2025-06-02",who:["sam","lev","danya","misha"],text:"Трое против пяти. Мост остался наш."},{id:"three",title:"Трое против всех",shape:"stellated",rarity:"легендарная",earned:!0,date:"2025-08-19",who:["tim","kira","sam"],text:"Нас было трое. Их — все остальные. Победили мы."},{id:"silent",title:"Тишина в эфире",shape:"bipyramid",rarity:"редкая",earned:!0,date:"2025-09-27",who:["kira","tim","sam"],text:"Целый раунд без единого слова. И победили."},{id:"onehp",title:"Победа с 1 HP",shape:"stellated",rarity:"редкая",earned:!0,date:"2025-12-20",who:["sam"],text:"Одна жизнь. Одна попытка. Этого хватило."},{id:"pizza",title:"Пицца-протокол",shape:"nested",rarity:"обычная",earned:!0,date:"2026-01-04",who:["misha","danya"],text:"Перерыв на пиццу посреди решающего матча. Всё равно выиграли."},{id:"tower",title:"Северная башня",shape:"bipyramid",rarity:"редкая",earned:!1,text:"Подняться на вершину втроём."},{id:"night",title:"Ночная смена",shape:"knot",rarity:"обычная",earned:!1,text:"Продержаться до рассвета шёпотом."},{id:"hundred",title:"Сотня",shape:"twisted",rarity:"легендарная",earned:!1,text:"Сыграть сто матчей вместе."},{id:"origin",title:"Исток",shape:"stellated",rarity:"легендарная",earned:!1,text:"Пройти вылазку 000."}],legends:[{id:"found",date:"2025-03-14",kind:"эпичное",title:"Основание",text:"Три человека, один ноутбук, ноль побед. Так всё началось."},{id:"jump",date:"2025-05-30",kind:"победа",title:"Прыжок с крыши",text:"Никто не верил. Гром прыгнул. Гром долетел."},{id:"nights",date:"2025-11-14",kind:"эпичное",title:"Ночь трёх возрождений",text:"Остался один. Поднял всех. Никто до сих пор не понимает как."},{id:"wifi",date:"2026-03-12",kind:"смешное",title:"Великое падение Wi-Fi",text:"Мы почти выиграли. Почти. Роутер помнит всё."}],moments:[{id:"hide",date:"2025-04-20",title:"Лучшее укрытие",who:["kira"],text:"Кира спряталась так хорошо, что её не нашли до конца матча. Даже свои."},{id:"bug",date:"2025-07-08",title:"Великий баг на мосту",who:["danya"],text:"Мост исчез у всех, кроме Дани. Даня стоял в воздухе и не понимал, почему все кричат."},{id:"room",date:"2025-10-02",title:"Секретная комната",who:["lev"],text:"Лёва нашёл секретную комнату и двадцать минут не мог из неё выйти."},{id:"wrong",date:"2026-02-15",title:"Не туда",who:["misha"],text:"Миша первым добежал до финиша. В другую сторону."},{id:"button",date:"2026-06-01",title:"Кнопка «победить»",who:["ars"],text:"Арсений спросил, где кнопка «победить». Мы ищем до сих пор."},{id:"mic",date:"2026-08-23",title:"Тихий план",who:["tim"],text:"Тимур полчаса рассказывал план. Микрофон был выключен. План сработал всё равно."}],jokes:[{id:"key",date:"2025-03-20",hidden:!1,trigger:"ключ",text:"Кто взял ключ? — Никто не брал ключ."},{id:"cover",date:"2025-06-10",hidden:!1,trigger:"прикрывал",text:"Я не отстал. Я прикрывал."},{id:"maps",date:"2025-09-01",hidden:!0,trigger:"карты",text:"Правило №1: не спорить с Лёвой про карты."},{id:"micro",date:"2025-10-15",hidden:!0,trigger:"микрофон",text:"Кто опять забыл включить микрофон?"},{id:"pizza",date:"2026-01-04",hidden:!0,trigger:"пицца",text:"ПИЦЦА-ПРОТОКОЛ АКТИВИРОВАН."},{id:"tactic",date:"2026-04-01",hidden:!0,trigger:"манёвр",text:"Это был тактический манёвр."}],transmissions:[{from:"ШТАБ",text:"Добро пожаловать в VIN. Здесь всё ваше."},{from:"ШТАБ",text:"Новая вылазка откроется в субботу. Готовьтесь."},{from:"ПАПА",text:"Горжусь вашим кланом. Конец связи."},{from:"ШТАБ",text:"Напоминание: вода — тоже снаряжение."},{from:"ШТАБ",text:"На маяке нашли пиццу. Расследование продолжается."},{from:"МАМА",text:"Уроки — это тоже миссия. Секретная."},{from:"ШТАБ",text:"Сегодня отличный день, чтобы найти что-нибудь новое."},{from:"ШТАБ",text:"Если увидишь кита — передай привет."},{from:"ПАПА",text:"Тот, кто читает эту передачу, — молодец. Да, ты."},{from:"ШТАБ",text:"Ключ светится ярче, когда вы вместе."}],signal:{secret:"Частота 14.03 — день, когда всё началось. Ты её нашёл. Об этом знают только свои."},capsule:{openAfterDays:7,text:"Если ты это читаешь — ты вернулся. Настоящий исследователь всегда возвращается. — Папа"},zenith:{message:"Отсюда видно всё, что вы построили. Это только начало."},nadir:{origin:"Всё началось 14 марта 2025 года. Сэм придумал название на перемене: SAM.VIN. Первый матч мы проиграли 0:12. Никто не ушёл. С тех пор ключ светится."},night:{from:21,to:7,drowsyFrom:20,story:"Ночью в VIN тихо. Узлы светятся вполсилы, как окна в доме, где все уже спят."},companion:{name:"Искра"}};function Cf(n){let e=Math.max(0,Math.min(48,n|0));return{x:e%7/6,y:Math.floor(e/7)/6}}function qm(n){if(typeof n=="number")return Number.isFinite(n)?Math.round(n):NaN;if(typeof n=="string"&&n.trim()!==""){let e=Number(n.trim());return Number.isFinite(e)?Math.round(e):NaN}return NaN}function xs(n){let e=[];if(!Array.isArray(n))return e;let t=new Set;for(let i=0;i<n.length&&e.length<24;i++){let r=n[i];if(!Array.isArray(r)||r.length!==2)continue;let s=qm(r[0]),o=qm(r[1]);if(!(s>=0&&s<=48&&o>=0&&o<=48)||s===o)continue;let a=Math.min(s,o),l=Math.max(s,o),c=a*64+l;t.has(c)||(t.add(c),e.push([a,l]))}return e}function If(n){let e=n>>>0;return function(){e=e+1831565813>>>0;let i=e;return i=Math.imul(i^i>>>15,i|1),i^=i+Math.imul(i^i>>>7,i|61),((i^i>>>14)>>>0)/4294967296}}function Pf(n){let e=2166136261,t=String(n);for(let i=0;i<t.length;i++)e^=t.charCodeAt(i),e=Math.imul(e,16777619);return e>>>0}var aT=.5*(Math.sqrt(3)-1),lT=(3-Math.sqrt(3))/6,cT=new Float32Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,0,1,0,-1]);function Sy(n){let e="";for(let t=0;t<n.length;t++)t>0&&(n.length-t)%3===0&&(e+=" "),e+=n[t];return e}function jm(n,e=2){let t=Number(n)||0,i=Math.abs(t).toFixed(e),r=i.indexOf("."),s=r>=0?i.slice(0,r):i,o=r>=0?i.slice(r):"";return(Number(i)===0?"±":t>0?"+":"−")+Sy(s)+o}function xa(n){return String(n??"").toLocaleUpperCase("ru")}var by={"tab.back":{text:"вот ты где.",p:3},sealed:{text:"запечатано. осколков {k} из 5.",p:1},"route.missing":{text:"здесь ничего нет. пока.",p:1}},Ti={current:null,init(n){},say(n,e={},t={force:!1}){let i=by[n];if(!i)return!1;let r=i.text.replace(/\{(\w+)\}/g,(o,a)=>e&&e[a]!=null?String(e[a]):o);Ti.current={key:n,text:r,p:i.p,at:Date.now()},ue.status=r;let s=document.getElementById("status-live");return s&&(s.textContent=r),Oe.emit("status:show",{key:n,text:r,p:i.p}),!0},clear(){Ti.current=null,ue.status=""}};var Lf=["operator","clan","members","missions","achievements","legends","moments","jokes","transmissions","signal","capsule","zenith","nadir","night","companion"],Qm={members:12,missions:24,achievements:24,legends:32,moments:64,jokes:64,transmissions:400},wy=["G2","A2","B2","D3","E3","G3","A3","B3","D4","E4","G4","A4","B4","D5","E5","G5","A5","B5","D6","E6","G6","A6","B6","D7"],Ey=["D4","G3","A3","B3","E4","G4","A4","B4","D5","E5","G5","A5"],Zm=["stellated","twisted","nested","bipyramid","knot"],ro=n=>n!==null&&typeof n=="object"&&!Array.isArray(n),cn=(n,e)=>n[e]!==void 0&&n[e]!==null,va=n=>typeof structuredClone=="function"?structuredClone(n):JSON.parse(JSON.stringify(n)),ni=n=>{try{return JSON.stringify(n).slice(0,40)}catch{return String(n)}};function Ct(n,e,t,i,r){if(typeof n!="string"&&!(typeof n=="number"&&Number.isFinite(n)))return r(`${i}: ${ni(n)} invalid`),{ok:!1};let s=String(n).normalize("NFC").trim().replace(/\s+/g," ");return s===""&&t?(r(`${i}: empty`),{ok:!1}):(s.length>e&&(s=s.slice(0,e-1)+"…",r(`${i}: longer than ${e}, cut`)),{ok:!0,v:s})}function Or(n,e,t){if(typeof n!="string"&&typeof n!="number")return t(`${e}: ${ni(n)} invalid`),{ok:!1};let i=String(n).trim().toLowerCase().replace(/[^a-z0-9_-]/g,"");return i?(i.length>24&&(i=i.slice(0,24),t(`${e}: longer than 24, cut`)),i!==String(n)&&t(`${e}: ${ni(n)} → "${i}"`),{ok:!0,v:i}):(t(`${e}: ${ni(n)} invalid`),{ok:!1})}function Km(n,e,t){return typeof n=="number"&&Number.isInteger(n)&&n>=0&&n<=999?{ok:!0,v:String(n).padStart(3,"0")}:typeof n=="string"&&/^\d{3}$/.test(n.trim())?{ok:!0,v:n.trim()}:(t(`${e}: ${ni(n)} invalid`),{ok:!1})}function Jm(n,e,t){if(n<2e3||n>2100||e<1||e>12||t<1)return!1;let i=new Date(Date.UTC(n,e,0)).getUTCDate();return t<=i}function so(n,e,t){if(typeof n=="string"){let i=n.trim(),r=/^(\d{4})-(\d{2})-(\d{2})$/.exec(i);if(r&&Jm(+r[1],+r[2],+r[3]))return{ok:!0,v:i};if(r=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(i),r&&Jm(+r[3],+r[2],+r[1]))return{ok:!0,v:`${r[3]}-${r[2]}-${r[1]}`}}return t(`${e}: ${ni(n)} invalid date`),{ok:!1}}function e0(n,e){return typeof n=="number"?n:typeof n=="string"&&n.trim()!==""?Number(e?n.trim().replace(",","."):n.trim()):NaN}function cr(n,e,t,i,r){let s=e0(n,!1);if(!Number.isFinite(s))return r(`${i}: ${ni(n)} invalid`),{ok:!1};let o=Math.round(s);return(o<e||o>t)&&(o=Math.min(t,Math.max(e,o)),r(`${i}: ${ni(n)} clamped → ${o}`)),{ok:!0,v:o}}function Ay(n,e,t,i,r,s){let o=e0(n,!0);if(!Number.isFinite(o))return s(`${r}: ${ni(n)} invalid`),{ok:!1};let a=Math.pow(10,i),l=Math.round(o*a)/a;return(l<e||l>t)&&(l=Math.min(t,Math.max(e,l)),s(`${r}: ${ni(n)} clamped → ${l}`)),{ok:!0,v:l}}function t0(n,e,t){return n===!0||n===1||n==="true"||n==="да"?{ok:!0,v:!0}:n===!1||n===0||n==="false"||n==="нет"?{ok:!0,v:!1}:(t(`${e}: ${ni(n)} invalid`),{ok:!1})}function _a(n,e,t,i){if(typeof n=="string"){let r=n.trim().toLowerCase();if(e.includes(r))return{ok:!0,v:r}}return i(`${t}: ${ni(n)} invalid`),{ok:!1}}function n0(n,e,t){if(!Array.isArray(n))return t(`${e}: not a list`),{ok:!1};let i=xs(n);return i.length!==n.length&&t(`${e}: ${n.length-i.length} edge(s) dropped`),i.length?{ok:!0,v:i}:{ok:!1}}function st(n,e,t,i){if(!cn(n,e))return i;let r=t(n[e]);return r.ok?r.v:i}function i0(n,e,t,i,r,s){if(!cn(n,e))return[];let o=n[e];if(!Array.isArray(o))return s(`${r}: not a list`),[];let a=[];for(let l=0;l<o.length;l++){if(a.length>=t){s(`${r}: more than ${t}, rest dropped`);break}let c=Ct(o[l],i,!0,`${r}[${l}]`,s);c.ok&&a.push(c.v)}return a}function uc(n,e,t,i,r){if(!cn(n,e))return[];let s=n[e];if(!Array.isArray(s))return r(`${i}: not a list`),[];let o=[];for(let a=0;a<s.length&&o.length<t;a++){let l=Or(s[a],`${i}[${a}]`,r);l.ok&&o.push(l.v)}return s.length>t&&r(`${i}: more than ${t}, rest dropped`),o}function Sa(n,e){let t=n,i=2;for(;e.has(t);)t=`${n}-${i++}`;return e.add(t),t}function Df(n){return String(n).toLocaleLowerCase("ru").replace(/[^a-zа-яё0-9]/g,"")}function ys(n,e,t,i){let r=[],s=Qm[e];for(let o=0;o<n.length;o++){let a=`${e}[${o}]`;if(r.length>=s){i(`${e}: more than ${s}, rest dropped`);break}if(!ro(n[o])){i(`${a}: not an object, dropped`);continue}let l=t(n[o],o,a);l&&r.push(l)}return r}function Ty(n,e){let t=new Set;return ys(n,"achievements",(i,r,s)=>{let o=cn(i,"title")?Ct(i.title,40,!0,`${s}.title`,e):{ok:!1};if(!o.ok)return e(`${s}: no title, dropped`),null;let a=cn(i,"id")?Or(i.id,`${s}.id`,e):{ok:!1},l=Sa(a.ok?a.v:`a${r+1}`,t),c=st(i,"earned",u=>t0(u,`${s}.earned`,e),!1);return{id:l,title:o.v,shape:st(i,"shape",u=>_a(u,Zm,`${s}.shape`,e),Zm[r%5]),rarity:st(i,"rarity",u=>_a(u,["обычная","редкая","легендарная"],`${s}.rarity`,e),"обычная"),earned:c,date:c?st(i,"date",u=>so(u,`${s}.date`,e),null):null,who:uc(i,"who",12,`${s}.who`,e),text:st(i,"text",u=>Ct(u,200,!1,`${s}.text`,e),"")}},e)}function Ry(n,e){let t=new Set(["workshop"]);return ys(n,"members",(i,r,s)=>{let o=cn(i,"name")?Ct(i.name,24,!0,`${s}.name`,e):{ok:!1};if(!o.ok)return e(`${s}: no name, dropped`),null;let a=cn(i,"id")?Or(i.id,`${s}.id`,e):{ok:!1},l=Sa(a.ok?a.v:`m${r+1}`,t),c=Ey[r%12];if(cn(i,"note")){let u=typeof i.note=="string"?i.note.trim().toUpperCase():"";wy.includes(u)?c=u:e(`${s}.note: ${ni(i.note)} invalid → "${c}"`)}return{id:l,name:o.v,callsign:st(i,"callsign",u=>Ct(u,16,!1,`${s}.callsign`,e),""),role:st(i,"role",u=>Ct(u,32,!1,`${s}.role`,e),""),status:st(i,"status",u=>_a(u,["на связи","в пути","отдыхает"],`${s}.status`,e),"на связи"),level:st(i,"level",u=>cr(u,0,99,`${s}.level`,e),1),missions:st(i,"missions",u=>cr(u,0,999,`${s}.missions`,e),0),seed:st(i,"seed",u=>cr(u,0,9999,`${s}.seed`,e),Pf(l)%100),note:c,glyph:st(i,"glyph",u=>n0(u,`${s}.glyph`,e),null),trait:st(i,"trait",u=>Ct(u,120,!1,`${s}.trait`,e),""),joke:st(i,"joke",u=>Ct(u,160,!1,`${s}.joke`,e),""),achievements:uc(i,"achievements",16,`${s}.achievements`,e)}},e)}function Cy(n,e){let t=new Set;for(let r of n)if(ro(r)&&cn(r,"code")){let s=Km(r.code,"",()=>{});s.ok&&t.add(s.v)}let i=new Set;return ys(n,"missions",(r,s,o)=>{let a=null;if(cn(r,"code")){let d=Km(r.code,`${o}.code`,e);if(d.ok&&(a=d.v,i.has(a)))return e(`${o}: duplicate code ${a}, dropped`),null}if(a===null&&(a=String(s+1).padStart(3,"0"),i.has(a)||t.has(a)))return e(`${o}: no code (${a} taken), dropped`),null;i.add(a);let l=st(r,"status",d=>_a(d,["done","active","new","locked","sealed"],`${o}.status`,e),"new"),c=st(r,"decodeDays",d=>cr(d,1,365,`${o}.decodeDays`,e),null),u=st(r,"unlockAtDays",d=>cr(d,1,365,`${o}.unlockAtDays`,e),null);return l!=="locked"?(c=null,u=null):c!=null&&u!=null?(u=null,e(`${o}: locked with both day fields → decodeDays kept`)):c==null&&u==null&&(c=7,e(`${o}: locked without days → decodeDays 7`)),{code:a,title:st(r,"title",d=>Ct(d,48,!0,`${o}.title`,e),`Вылазка ${a}`),status:l,brief:st(r,"brief",d=>Ct(d,240,!1,`${o}.brief`,e),""),conditions:i0(r,"conditions",6,40,`${o}.conditions`,e),crew:uc(r,"crew",12,`${o}.crew`,e),result:st(r,"result",d=>Ct(d,160,!1,`${o}.result`,e),""),reward:st(r,"reward",d=>Or(d,`${o}.reward`,e),null),log:st(r,"log",d=>Ct(d,200,!1,`${o}.log`,e),""),decodeDays:c,unlockAtDays:u}},e)}function Iy(n,e){let t=new Set;return ys(n,"legends",(i,r,s)=>{let o=cn(i,"date")?so(i.date,`${s}.date`,e):{ok:!1},a=cn(i,"title")?Ct(i.title,48,!0,`${s}.title`,e):{ok:!1};if(!o.ok||!a.ok)return e(`${s}: needs date and title, dropped`),null;let l=cn(i,"id")?Or(i.id,`${s}.id`,e):{ok:!1};return{id:Sa(l.ok?l.v:`l${r+1}`,t),date:o.v,kind:st(i,"kind",c=>_a(c,["победа","смешное","эпичное"],`${s}.kind`,e),"эпичное"),title:a.v,text:st(i,"text",c=>Ct(c,300,!1,`${s}.text`,e),"")}},e)}function Py(n,e){let t=new Set;return ys(n,"moments",(i,r,s)=>{let o=cn(i,"date")?so(i.date,`${s}.date`,e):{ok:!1},a=cn(i,"title")?Ct(i.title,48,!0,`${s}.title`,e):{ok:!1};if(!o.ok||!a.ok)return e(`${s}: needs date and title, dropped`),null;let l=cn(i,"id")?Or(i.id,`${s}.id`,e):{ok:!1};return{id:Sa(l.ok?l.v:`mo${r+1}`,t),date:o.v,title:a.v,who:uc(i,"who",12,`${s}.who`,e),text:st(i,"text",c=>Ct(c,300,!0,`${s}.text`,e),a.v)}},e)}function Ly(n,e){let t=new Set;return ys(n,"jokes",(i,r,s)=>{let o=cn(i,"text")?Ct(i.text,160,!0,`${s}.text`,e):{ok:!1};if(!o.ok)return e(`${s}: no text, dropped`),null;let a=cn(i,"id")?Or(i.id,`${s}.id`,e):{ok:!1},l=st(i,"trigger",c=>Ct(c,24,!1,`${s}.trigger`,e),"");return{id:Sa(a.ok?a.v:`j${r+1}`,t),date:st(i,"date",c=>so(c,`${s}.date`,e),null),hidden:st(i,"hidden",c=>t0(c,`${s}.hidden`,e),!1),trigger:Df(l),text:o.v}},e)}function Dy(n,e){return ys(n,"transmissions",(t,i,r)=>{let s=cn(t,"text")?Ct(t.text,240,!0,`${r}.text`,e):{ok:!1};return s.ok?{from:st(t,"from",o=>Ct(o,16,!0,`${r}.from`,e),"ШТАБ"),text:s.v}:(e(`${r}: no text, dropped`),null)},e)}function Ny(n,e){let t=io.clan;return{name:st(n,"name",i=>Ct(i,24,!0,"clan.name",e),t.name),motto:st(n,"motto",i=>Ct(i,80,!0,"clan.motto",e),t.motto),founded:st(n,"founded",i=>so(i,"clan.founded",e),t.founded),frequency:st(n,"frequency",i=>Ay(i,0,99.99,2,"clan.frequency",e),t.frequency),sigil:st(n,"sigil",i=>n0(i,"clan.sigil",e),xs(t.sigil))}}function Fy(n,e,t){let i=io.operator,r=cn(n,"name")?Ct(n.name,24,!0,"operator.name",t):{ok:!1},s,o=cn(n,"id")?Or(n.id,"operator.id",t):{ok:!1};if(o.ok)s=o.v,e.some(c=>c.id===s)||t(`operator.id: "${s}" matches no member (kept)`);else{let c=r.ok?e.find(u=>u.name.toLocaleLowerCase("ru")===r.v.toLocaleLowerCase("ru")):null;s=c?c.id:e.length?e[0].id:"sam"}let a=e.find(c=>c.id===s)||null,l=r.ok?r.v:a?a.name:i.name;return{id:s,name:l,aliases:i0(n,"aliases",8,24,"operator.aliases",t),callsign:st(n,"callsign",c=>Ct(c,16,!1,"operator.callsign",t),a?a.callsign:""),birthday:st(n,"birthday",c=>so(c,"operator.birthday",t),null)}}function Oy(n,e,t){let i=io,r=(s,o)=>{try{n[s]=o(ro(e[s])?e[s]:i[s])}catch{t(`${s}: crashed, default used`),n[s]=va(i[s])}};r("signal",s=>({secret:st(s,"secret",o=>Ct(o,240,!0,"signal.secret",t),i.signal.secret)})),r("capsule",s=>({openAfterDays:st(s,"openAfterDays",o=>cr(o,0,365,"capsule.openAfterDays",t),i.capsule.openAfterDays),text:st(s,"text",o=>Ct(o,300,!0,"capsule.text",t),i.capsule.text)})),r("zenith",s=>({message:st(s,"message",o=>Ct(o,160,!0,"zenith.message",t),i.zenith.message)})),r("nadir",s=>({origin:st(s,"origin",o=>Ct(o,400,!0,"nadir.origin",t),i.nadir.origin)})),r("night",s=>({from:st(s,"from",o=>cr(o,0,23,"night.from",t),i.night.from),to:st(s,"to",o=>cr(o,0,23,"night.to",t),i.night.to),drowsyFrom:st(s,"drowsyFrom",o=>cr(o,0,23,"night.drowsyFrom",t),i.night.drowsyFrom),story:st(s,"story",o=>Ct(o,240,!0,"night.story",t),i.night.story)})),r("companion",s=>({name:st(s,"name",o=>Ct(o,16,!0,"companion.name",t),i.companion.name)}))}function Uy(n){let e=[],t=u=>{e.push(u)},i=io,r=n;ro(r)||(r={});let s={},o=[];try{o=Object.keys(r)}catch{o=[]}for(let u of o)Lf.includes(u)||t(`unknown key ${u}`);let a={};for(let u of Lf){let d;try{d=r[u]}catch{d=void 0}let f=u in Qm?Array.isArray(d):ro(d);!f&&d!==void 0&&t(`${u}: default used`),a[u]=f?d:va(i[u])}let l=[["achievements",Ty],["members",Ry],["missions",Cy],["legends",Iy],["moments",Py],["jokes",Ly],["transmissions",Dy]];for(let[u,d]of l)try{s[u]=d(a[u],t)}catch{t(`${u}: crashed, default used`);try{s[u]=d(va(i[u]),()=>{})}catch{s[u]=[]}}try{s.clan=Ny(a.clan,t)}catch{t("clan: crashed, default used"),s.clan=va(i.clan)}try{s.operator=Fy(a.operator,s.members,t)}catch{t("operator: crashed, default used"),s.operator={...va(i.operator),aliases:[]}}Oy(s,a,t);try{let u=new Set(s.members.map(f=>f.id)),d=new Set(s.achievements.map(f=>f.id)),h=(f,g,_)=>{let m=[];for(let p of f){if(!g.has(p)){t(`${_}: unknown "${p}" removed`);continue}m.includes(p)||m.push(p)}return m};s.members.forEach((f,g)=>{f.achievements=h(f.achievements,d,`members[${g}].achievements`)}),s.missions.forEach((f,g)=>{f.crew=h(f.crew,u,`missions[${g}].crew`),f.reward!=null&&!d.has(f.reward)&&(t(`missions[${g}].reward: unknown "${f.reward}" removed`),f.reward=null)}),s.achievements.forEach((f,g)=>{f.who=h(f.who,u,`achievements[${g}].who`)}),s.moments.forEach((f,g)=>{f.who=h(f.who,u,`moments[${g}].who`)})}catch{t("refs: crashed")}for(let u of s.jokes)u.date==null&&(u.date=s.clan.founded);try{let u=[];for(let h of s.operator.aliases){let f=Df(h);f.length>=2&&f.length<=24&&!u.includes(f)&&u.push(f)}let d=Df(s.operator.name);d.length>=2&&!u.includes(d)&&u.push(d),s.operator.aliases=u}catch{s.operator.aliases=[]}let c={};for(let u of Lf)c[u]=s[u];return{world:c,issues:e}}function r0(n){if(n&&typeof n=="object"&&!Object.isFrozen(n)){Object.freeze(n);for(let e of Object.keys(n))r0(n[e])}return n}var Ma,s0="file";try{Ma=typeof window<"u"?window.SAMVIN_WORLD:void 0}catch{Ma=void 0}ro(Ma)||(s0="default",Ma=io,Rt("world","world.js missing or broken — using built-in defaults"));var ya=Uy(Ma);ya.issues.length&&Rt("world-issues",`world.js: ${ya.issues.length} issue(s)`,ya.issues);var o0=s0,a0=Object.freeze(ya.issues.slice()),nn=r0(ya.world);var NT=Object.freeze({members:"Здесь пока никого нет.",missions:"Вылазок пока нет.",achievements:"Трофеев пока нет.",transmissions:"Передач пока нет.",probeLog:"Зонд вернулся. Записи нет."});var By=864e5,l0=n=>(n<10?"0":"")+n,hc=n=>n instanceof Date?n:new Date(n??oo());function oo(){return Date.now()}function fc(n){let e=hc(n);return`${e.getFullYear()}-${l0(e.getMonth()+1)}-${l0(e.getDate())}`}function c0(n){let e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(n||""));return e?Math.round(Date.UTC(+e[1],+e[2]-1,+e[3])/By):NaN}function cc(n,e){let t=c0(n),i=c0(e);return Number.isFinite(t)&&Number.isFinite(i)?i-t:0}function u0(n,e,t){return e>t?n>=e||n<t:e<t?n>=e&&n<t:!1}function Nf(n){let e=nn.night;return u0(hc(n).getHours(),e.from,e.to)}function h0(n){let e=nn.night;return Nf(n)||e.drowsyFrom===e.from?!1:u0(hc(n).getHours(),e.drowsyFrom,e.from)}function ky(n){let e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(n||""));return e?{y:+e[1],m:+e[2],d:+e[3]}:null}function Ff(n){let e=ky(nn.operator.birthday);if(!e)return!1;let t=hc(n),i=t.getFullYear(),r=t.getMonth()+1,s=t.getDate();return e.m===2&&e.d===29&&!(i%4===0&&i%100!==0||i%400===0)?r===2&&s===28:r===e.m&&s===e.d}var H0=0,gd=1,W0=2;var Qa=1,X0=2,Po=3,qi=0,Hn=1,ji=2,jn=0,Di=1,Rs=2,xd=3,vd=4,Tu=5;var br=100,Y0=101,$0=102,q0=103,j0=104,Z0=200,el=201,K0=202,J0=203,yd=204,Lo=205,Q0=206,eg=207,tg=208,ng=209,ig=210,rg=211,sg=212,og=213,ag=214,Hc=0,Wc=1,Xc=2,bo=3,Yc=4,$c=5,qc=6,jc=7,_d=0,lg=1,cg=2,ai=0,Md=1,Sd=2,bd=3,wd=4,Ed=5,Ad=6,Td=7;var Rd=300,qr=301,Cs=302,Ru=303,Cu=304,tl=306,Zc=1e3,Dn=1001,Kc=1002,bn=1003,ug=1004;var nl=1005;var yt=1006,Iu=1007;var jr=1008;var li=1009,Cd=1010,Id=1011,Do=1012,Pu=1013,Ni=1014,vi=1015,Nn=1016,Lu=1017,Du=1018,No=1020,Pd=35902,Ld=35899,Dd=1021,Nd=1022,An=1023,Wi=1026,Zr=1027,Nu=1028,Fu=1029,Kr=1030,Ou=1031;var Uu=1033,il=33776,rl=33777,sl=33778,ol=33779,Bu=35840,ku=35841,zu=35842,Vu=35843,Gu=36196,Hu=37492,Wu=37496,Xu=37488,Yu=37489,al=37490,$u=37491,qu=37808,ju=37809,Zu=37810,Ku=37811,Ju=37812,Qu=37813,eh=37814,th=37815,nh=37816,ih=37817,rh=37818,sh=37819,oh=37820,ah=37821,lh=36492,ch=36494,uh=36495,hh=36283,fh=36284,ll=36285,dh=36286;var Ia=2300,Jc=2301,zc=2302,ld=2303,cd=2400,ud=2401,hd=2402;var hg=3200;var Fd=0,fg=1,wr="",si="srgb",Es="srgb-linear",Pa="linear",It="srgb";var Vc=7680;var dg=519,pg=512,mg=513,gg=514,ph=515,xg=516,vg=517,mh=518,yg=519,Od=35044;var Ud="300 es",Li=2e3,La=2001;function Vy(n){for(let e=n.length-1;e>=0;--e)if(n[e]>=65535)return!0;return!1}function Gy(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function Da(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function _g(){let n=Da("canvas");return n.style.display="block",n}var f0={},wo=null;function Na(...n){let e="THREE."+n.shift();wo?wo("log",e,...n):console.log(e,...n)}function Mg(n){let e=n[0];if(typeof e=="string"&&e.startsWith("TSL:")){let t=n[1];t&&t.isStackTrace?n[0]+=" "+t.getLocation():n[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return n}function Ke(...n){n=Mg(n);let e="THREE."+n.shift();if(wo)wo("warn",e,...n);else{let t=n[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...n)}}function tt(...n){n=Mg(n);let e="THREE."+n.shift();if(wo)wo("error",e,...n);else{let t=n[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...n)}}function ws(...n){let e=n.join(" ");e in f0||(f0[e]=!0,Ke(...n))}function Sg(n,e,t){return new Promise(function(i,r){function s(){switch(n.clientWaitSync(e,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:r();break;case n.TIMEOUT_EXPIRED:setTimeout(s,t);break;default:i()}}setTimeout(s,t)})}var bg={[Hc]:Wc,[Xc]:qc,[Yc]:jc,[bo]:$c,[Wc]:Hc,[qc]:Xc,[jc]:Yc,[$c]:bo},Xi=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(t)===-1&&i[e].push(t)}hasEventListener(e,t){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(t)!==-1}removeEventListener(e,t){let i=this._listeners;if(i===void 0)return;let r=i[e];if(r!==void 0){let s=r.indexOf(t);s!==-1&&r.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let i=t[e.type];if(i!==void 0){e.target=this;let r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}},In=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Gc=Math.PI/180,Qc=180/Math.PI;function Gr(){let n=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(In[n&255]+In[n>>8&255]+In[n>>16&255]+In[n>>24&255]+"-"+In[e&255]+In[e>>8&255]+"-"+In[e>>16&15|64]+In[e>>24&255]+"-"+In[t&63|128]+In[t>>8&255]+"-"+In[t>>16&255]+In[t>>24&255]+In[i&255]+In[i>>8&255]+In[i>>16&255]+In[i>>24&255]).toLowerCase()}function mt(n,e,t){return Math.max(e,Math.min(t,n))}function Hy(n,e){return(n%e+e)%e}function Of(n,e,t){return(1-t)*n+t*e}function Hi(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:case Uint8ClampedArray:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function Ut(n,e){switch(e.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Hd=class Hd{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,i=this.y,r=e.elements;return this.x=r[0]*t+r[3]*i+r[6],this.y=r[1]*t+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=mt(this.x,e.x,t.x),this.y=mt(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=mt(this.x,e,t),this.y=mt(this.y,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(mt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(mt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y;return t*t+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let i=Math.cos(t),r=Math.sin(t),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Hd.prototype.isVector2=!0;var nt=Hd,xi=class{constructor(e=0,t=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=i,this._w=r}static slerpFlat(e,t,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],d=i[r+3],h=s[o+0],f=s[o+1],g=s[o+2],_=s[o+3];if(d!==_||l!==h||c!==f||u!==g){let m=l*h+c*f+u*g+d*_;m<0&&(h=-h,f=-f,g=-g,_=-_,m=-m);let p=1-a;if(m<.9995){let S=Math.acos(m),b=Math.sin(S);p=Math.sin(p*S)/b,a=Math.sin(a*S)/b,l=l*p+h*a,c=c*p+f*a,u=u*p+g*a,d=d*p+_*a}else{l=l*p+h*a,c=c*p+f*a,u=u*p+g*a,d=d*p+_*a;let S=1/Math.sqrt(l*l+c*c+u*u+d*d);l*=S,c*=S,u*=S,d*=S}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=d}static multiplyQuaternionsFlat(e,t,i,r,s,o){let a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],d=s[o],h=s[o+1],f=s[o+2],g=s[o+3];return e[t]=a*g+u*d+l*f-c*h,e[t+1]=l*g+u*h+c*d-a*f,e[t+2]=c*g+u*f+a*h-l*d,e[t+3]=u*g-a*d-l*h-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,i,r){return this._x=e,this._y=t,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),d=a(s/2),h=l(i/2),f=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=h*u*d+c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d-h*f*g;break;case"YXZ":this._x=h*u*d+c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d+h*f*g;break;case"ZXY":this._x=h*u*d-c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d-h*f*g;break;case"ZYX":this._x=h*u*d-c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d+h*f*g;break;case"YZX":this._x=h*u*d+c*f*g,this._y=c*f*d+h*u*g,this._z=c*u*g-h*f*d,this._w=c*u*d-h*f*g;break;case"XZY":this._x=h*u*d-c*f*g,this._y=c*f*d-h*u*g,this._z=c*u*g+h*f*d,this._w=c*u*d+h*f*g;break;default:Ke("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let i=t/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,i=t[0],r=t[4],s=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],d=t[10],h=i+a+d;if(h>0){let f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(u-l)*f,this._y=(s-c)*f,this._z=(o-r)*f}else if(i>a&&i>d){let f=2*Math.sqrt(1+i-a-d);this._w=(u-l)/f,this._x=.25*f,this._y=(r+o)/f,this._z=(s+c)/f}else if(a>d){let f=2*Math.sqrt(1+a-i-d);this._w=(s-c)/f,this._x=(r+o)/f,this._y=.25*f,this._z=(l+u)/f}else{let f=2*Math.sqrt(1+d-i-a);this._w=(o-r)/f,this._x=(s+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let i=e.dot(t)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(mt(this.dot(e),-1,1)))}rotateTowards(e,t){let i=this.angleTo(e);if(i===0)return this;let r=Math.min(1,t/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let i=e._x,r=e._y,s=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,t){let i=e._x,r=e._y,s=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,r=-r,s=-s,o=-o,a=-a);let l=1-t;if(a<.9995){let c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,t=Math.sin(t*c)/u,this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+o*t,this._onChangeCallback()}else this._x=this._x*l+i*t,this._y=this._y*l+r*t,this._z=this._z*l+s*t,this._w=this._w*l+o*t,this.normalize();return this}slerpQuaternions(e,t,i){return this.copy(e).slerp(t,i)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Wd=class Wd{constructor(e=0,t=0,i=0){this.x=e,this.y=t,this.z=i}set(e,t,i){return i===void 0&&(i=this.z),this.x=e,this.y=t,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(d0.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(d0.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[3]*i+s[6]*r,this.y=s[1]*t+s[4]*i+s[7]*r,this.z=s[2]*t+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*t+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*t+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*t+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*t+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){let t=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*t-s*r),d=2*(s*i-o*t);return this.x=t+l*c+o*d-a*u,this.y=i+l*u+a*c-s*d,this.z=r+l*d+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*t+s[4]*i+s[8]*r,this.y=s[1]*t+s[5]*i+s[9]*r,this.z=s[2]*t+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=mt(this.x,e.x,t.x),this.y=mt(this.y,e.y,t.y),this.z=mt(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=mt(this.x,e,t),this.y=mt(this.y,e,t),this.z=mt(this.z,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(mt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let i=e.x,r=e.y,s=e.z,o=t.x,a=t.y,l=t.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let i=e.dot(this)/t;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Uf.copy(this).projectOnVector(e),this.sub(Uf)}reflect(e){return this.sub(Uf.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let i=this.dot(e)/t;return Math.acos(mt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return t*t+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,i){let r=Math.sin(t)*e;return this.x=r*Math.sin(i),this.y=Math.cos(t)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,i){return this.x=e*Math.sin(t),this.y=i,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=i,this.z=r,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,i=Math.sqrt(1-t*t);return this.x=i*Math.cos(e),this.y=t,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Wd.prototype.isVector3=!0;var I=Wd,Uf=new I,d0=new xi,Xd=class Xd{constructor(e,t,i,r,s,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c)}set(e,t,i,r,s,o,a,l,c){let u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=t,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],this}extractBasis(e,t,i){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],d=i[7],h=i[2],f=i[5],g=i[8],_=r[0],m=r[3],p=r[6],S=r[1],b=r[4],y=r[7],A=r[2],T=r[5],R=r[8];return s[0]=o*_+a*S+l*A,s[3]=o*m+a*b+l*T,s[6]=o*p+a*y+l*R,s[1]=c*_+u*S+d*A,s[4]=c*m+u*b+d*T,s[7]=c*p+u*y+d*R,s[2]=h*_+f*S+g*A,s[5]=h*m+f*b+g*T,s[8]=h*p+f*y+g*R,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){let e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=u*o-a*c,h=a*l-u*s,f=c*s-o*l,g=t*d+i*h+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=d*_,e[1]=(r*c-u*i)*_,e[2]=(a*i-r*o)*_,e[3]=h*_,e[4]=(u*t-r*l)*_,e[5]=(r*s-a*t)*_,e[6]=f*_,e[7]=(i*l-c*t)*_,e[8]=(o*t-i*s)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,i,r,s,o,a){let l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return ws("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Bf.makeScale(e,t)),this}rotate(e){return ws("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Bf.makeRotation(-e)),this}translate(e,t){return ws("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Bf.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,i,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,i=e.elements;for(let r=0;r<9;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<9;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Xd.prototype.isMatrix3=!0;var at=Xd,Bf=new at,p0=new at().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),m0=new at().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Wy(){let n={enabled:!0,workingColorSpace:Es,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===It&&(r.r=gr(r.r),r.g=gr(r.g),r.b=gr(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===It&&(r.r=So(r.r),r.g=So(r.g),r.b=So(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===wr?Pa:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return ws("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return ws("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],i=[.3127,.329];return n.define({[Es]:{primaries:e,whitePoint:i,transfer:Pa,toXYZ:p0,fromXYZ:m0,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:si},outputColorSpaceConfig:{drawingBufferColorSpace:si}},[si]:{primaries:e,whitePoint:i,transfer:It,toXYZ:p0,fromXYZ:m0,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:si}}}),n}var ft=Wy();function gr(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function So(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var ao,eu=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{ao===void 0&&(ao=Da("canvas")),ao.width=e.width,ao.height=e.height;let r=ao.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=ao}return i.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Da("canvas");t.width=e.width,t.height=e.height;let i=t.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=gr(s[o]/255)*255;return i.putImageData(r,0,0),t}else if(e.data){let t=e.data.slice(0);for(let i=0;i<t.length;i++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[i]=Math.floor(gr(t[i]/255)*255):t[i]=gr(t[i]);return{data:t,width:e.width,height:e.height}}else return Ke("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},Xy=0,Eo=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Xy++}),this.uuid=Gr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(kf(r[o].image)):s.push(kf(r[o]))}else s=kf(r);i.url=s}return t||(e.images[this.uuid]=i),i}};function kf(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?eu.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(Ke("Texture: Unable to serialize Texture."),{})}var Yy=0,zf=new I,Vn=class n extends Xi{constructor(e=n.DEFAULT_IMAGE,t=n.DEFAULT_MAPPING,i=Dn,r=Dn,s=yt,o=jr,a=An,l=li,c=n.DEFAULT_ANISOTROPY,u=wr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Yy++}),this.uuid=Gr(),this.name="",this.source=new Eo(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new nt(0,0),this.repeat=new nt(1,1),this.center=new nt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new at,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(zf).x}get height(){return this.source.getSize(zf).y}get depth(){return this.source.getSize(zf).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let i=e[t];if(i===void 0){Ke(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Ke(`Texture.setValues(): property '${t}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),t||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Rd)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Zc:e.x=e.x-Math.floor(e.x);break;case Dn:e.x=e.x<0?0:1;break;case Kc:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Zc:e.y=e.y-Math.floor(e.y);break;case Dn:e.y=e.y<0?0:1;break;case Kc:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Vn.DEFAULT_IMAGE=null;Vn.DEFAULT_MAPPING=Rd;Vn.DEFAULT_ANISOTROPY=1;var Yd=class Yd{constructor(e=0,t=0,i=0,r=1){this.x=e,this.y=t,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,i,r){return this.x=e,this.y=t,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*t+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*t+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*t+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*t+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,i,r,s,l=e.elements,c=l[0],u=l[4],d=l[8],h=l[1],f=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(d-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(d+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let b=(c+1)/2,y=(f+1)/2,A=(p+1)/2,T=(u+h)/4,R=(d+_)/4,x=(g+m)/4;return b>y&&b>A?b<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(b),r=T/i,s=R/i):y>A?y<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(y),i=T/r,s=x/r):A<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(A),i=R/s,r=x/s),this.set(i,r,s,t),this}let S=Math.sqrt((m-g)*(m-g)+(d-_)*(d-_)+(h-u)*(h-u));return Math.abs(S)<.001&&(S=1),this.x=(m-g)/S,this.y=(d-_)/S,this.z=(h-u)/S,this.w=Math.acos((c+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=mt(this.x,e.x,t.x),this.y=mt(this.y,e.y,t.y),this.z=mt(this.z,e.z,t.z),this.w=mt(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=mt(this.x,e,t),this.y=mt(this.y,e,t),this.z=mt(this.z,e,t),this.w=mt(this.w,e,t),this}clampLength(e,t){let i=this.length();return this.divideScalar(i||1).multiplyScalar(mt(i,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,i){return this.x=e.x+(t.x-e.x)*i,this.y=e.y+(t.y-e.y)*i,this.z=e.z+(t.z-e.z)*i,this.w=e.w+(t.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Yd.prototype.isVector4=!0;var Gt=Yd,tu=class extends Xi{constructor(e=1,t=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:yt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=i.depth,this.scissor=new Gt(0,0,e,t),this.scissorTest=!1,this.viewport=new Gt(0,0,e,t),this.textures=[];let r={width:e,height:t,depth:i.depth},s=new Vn(r),o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:yt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,i=1){if(this.width!==e||this.height!==t||this.depth!==i){this.width=e,this.height=t,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=t,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,i=e.textures.length;t<i;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let r=Object.assign({},e.textures[t].image);this.textures[t].source=new Eo(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},gn=class extends tu{constructor(e=1,t=1,i={}){super(e,t,i),this.isWebGLRenderTarget=!0}},Fa=class extends Vn{constructor(e=null,t=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=bn,this.minFilter=bn,this.wrapR=Dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var nu=class extends Vn{constructor(e=null,t=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:i,depth:r},this.magFilter=bn,this.minFilter=bn,this.wrapR=Dn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var Au=class Au{constructor(e,t,i,r,s,o,a,l,c,u,d,h,f,g,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,i,r,s,o,a,l,c,u,d,h,f,g,_,m)}set(e,t,i,r,s,o,a,l,c,u,d,h,f,g,_,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=i,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=d,p[14]=h,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Au().fromArray(this.elements)}copy(e){let t=this.elements,i=e.elements;return t[0]=i[0],t[1]=i[1],t[2]=i[2],t[3]=i[3],t[4]=i[4],t[5]=i[5],t[6]=i[6],t[7]=i[7],t[8]=i[8],t[9]=i[9],t[10]=i[10],t[11]=i[11],t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15],this}copyPosition(e){let t=this.elements,i=e.elements;return t[12]=i[12],t[13]=i[13],t[14]=i[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,i){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,t,i){return this.set(e.x,t.x,i.x,0,e.y,t.y,i.y,0,e.z,t.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,i=e.elements,r=1/lo.setFromMatrixColumn(e,0).length(),s=1/lo.setFromMatrixColumn(e,1).length(),o=1/lo.setFromMatrixColumn(e,2).length();return t[0]=i[0]*r,t[1]=i[1]*r,t[2]=i[2]*r,t[3]=0,t[4]=i[4]*s,t[5]=i[5]*s,t[6]=i[6]*s,t[7]=0,t[8]=i[8]*o,t[9]=i[9]*o,t[10]=i[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),d=Math.sin(s);if(e.order==="XYZ"){let h=o*u,f=o*d,g=a*u,_=a*d;t[0]=l*u,t[4]=-l*d,t[8]=c,t[1]=f+g*c,t[5]=h-_*c,t[9]=-a*l,t[2]=_-h*c,t[6]=g+f*c,t[10]=o*l}else if(e.order==="YXZ"){let h=l*u,f=l*d,g=c*u,_=c*d;t[0]=h+_*a,t[4]=g*a-f,t[8]=o*c,t[1]=o*d,t[5]=o*u,t[9]=-a,t[2]=f*a-g,t[6]=_+h*a,t[10]=o*l}else if(e.order==="ZXY"){let h=l*u,f=l*d,g=c*u,_=c*d;t[0]=h-_*a,t[4]=-o*d,t[8]=g+f*a,t[1]=f+g*a,t[5]=o*u,t[9]=_-h*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){let h=o*u,f=o*d,g=a*u,_=a*d;t[0]=l*u,t[4]=g*c-f,t[8]=h*c+_,t[1]=l*d,t[5]=_*c+h,t[9]=f*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){let h=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=_-h*d,t[8]=g*d+f,t[1]=d,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=f*d+g,t[10]=h-_*d}else if(e.order==="XZY"){let h=o*l,f=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=-d,t[8]=c*u,t[1]=h*d+_,t[5]=o*u,t[9]=f*d-g,t[2]=g*d-f,t[6]=a*u,t[10]=_*d+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose($y,e,qy)}lookAt(e,t,i){let r=this.elements;return ii.subVectors(e,t),ii.lengthSq()===0&&(ii.z=1),ii.normalize(),Ur.crossVectors(i,ii),Ur.lengthSq()===0&&(Math.abs(i.z)===1?ii.x+=1e-4:ii.z+=1e-4,ii.normalize(),Ur.crossVectors(i,ii)),Ur.normalize(),dc.crossVectors(ii,Ur),r[0]=Ur.x,r[4]=dc.x,r[8]=ii.x,r[1]=Ur.y,r[5]=dc.y,r[9]=ii.y,r[2]=Ur.z,r[6]=dc.z,r[10]=ii.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let i=e.elements,r=t.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],d=i[5],h=i[9],f=i[13],g=i[2],_=i[6],m=i[10],p=i[14],S=i[3],b=i[7],y=i[11],A=i[15],T=r[0],R=r[4],x=r[8],w=r[12],C=r[1],D=r[5],O=r[9],z=r[13],N=r[2],V=r[6],Z=r[10],X=r[14],K=r[3],q=r[7],J=r[11],te=r[15];return s[0]=o*T+a*C+l*N+c*K,s[4]=o*R+a*D+l*V+c*q,s[8]=o*x+a*O+l*Z+c*J,s[12]=o*w+a*z+l*X+c*te,s[1]=u*T+d*C+h*N+f*K,s[5]=u*R+d*D+h*V+f*q,s[9]=u*x+d*O+h*Z+f*J,s[13]=u*w+d*z+h*X+f*te,s[2]=g*T+_*C+m*N+p*K,s[6]=g*R+_*D+m*V+p*q,s[10]=g*x+_*O+m*Z+p*J,s[14]=g*w+_*z+m*X+p*te,s[3]=S*T+b*C+y*N+A*K,s[7]=S*R+b*D+y*V+A*q,s[11]=S*x+b*O+y*Z+A*J,s[15]=S*w+b*z+y*X+A*te,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],d=e[6],h=e[10],f=e[14],g=e[3],_=e[7],m=e[11],p=e[15],S=l*f-c*h,b=a*f-c*d,y=a*h-l*d,A=o*f-c*u,T=o*h-l*u,R=o*d-a*u;return t*(_*S-m*b+p*y)-i*(g*S-m*A+p*T)+r*(g*b-_*A+p*R)-s*(g*y-_*T+m*R)}determinantAffine(){let e=this.elements,t=e[0],i=e[4],r=e[8],s=e[1],o=e[5],a=e[9],l=e[2],c=e[6],u=e[10];return t*(o*u-a*c)-i*(s*u-a*l)+r*(s*c-o*l)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,i){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=t,r[14]=i),this}invert(){let e=this.elements,t=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],d=e[9],h=e[10],f=e[11],g=e[12],_=e[13],m=e[14],p=e[15],S=t*a-i*o,b=t*l-r*o,y=t*c-s*o,A=i*l-r*a,T=i*c-s*a,R=r*c-s*l,x=u*_-d*g,w=u*m-h*g,C=u*p-f*g,D=d*m-h*_,O=d*p-f*_,z=h*p-f*m,N=S*z-b*O+y*D+A*C-T*w+R*x;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let V=1/N;return e[0]=(a*z-l*O+c*D)*V,e[1]=(r*O-i*z-s*D)*V,e[2]=(_*R-m*T+p*A)*V,e[3]=(h*T-d*R-f*A)*V,e[4]=(l*C-o*z-c*w)*V,e[5]=(t*z-r*C+s*w)*V,e[6]=(m*y-g*R-p*b)*V,e[7]=(u*R-h*y+f*b)*V,e[8]=(o*O-a*C+c*x)*V,e[9]=(i*C-t*O-s*x)*V,e[10]=(g*T-_*y+p*S)*V,e[11]=(d*y-u*T-f*S)*V,e[12]=(a*w-o*D-l*x)*V,e[13]=(t*D-i*w+r*x)*V,e[14]=(_*b-g*A-m*S)*V,e[15]=(u*A-d*b+h*S)*V,this}scale(e){let t=this.elements,i=e.x,r=e.y,s=e.z;return t[0]*=i,t[4]*=r,t[8]*=s,t[1]*=i,t[5]*=r,t[9]*=s,t[2]*=i,t[6]*=r,t[10]*=s,t[3]*=i,t[7]*=r,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,i,r))}makeTranslation(e,t,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,i,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,t,-i,0,0,i,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,0,i,0,0,1,0,0,-i,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),i=Math.sin(e);return this.set(t,-i,0,0,i,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let i=Math.cos(t),r=Math.sin(t),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,t,i){return this.set(e,0,0,0,0,t,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,t,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,t,r,1,0,0,0,0,1),this}compose(e,t,i){let r=this.elements,s=t._x,o=t._y,a=t._z,l=t._w,c=s+s,u=o+o,d=a+a,h=s*c,f=s*u,g=s*d,_=o*u,m=o*d,p=a*d,S=l*c,b=l*u,y=l*d,A=i.x,T=i.y,R=i.z;return r[0]=(1-(_+p))*A,r[1]=(f+y)*A,r[2]=(g-b)*A,r[3]=0,r[4]=(f-y)*T,r[5]=(1-(h+p))*T,r[6]=(m+S)*T,r[7]=0,r[8]=(g+b)*R,r[9]=(m-S)*R,r[10]=(1-(h+_))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,t,i){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let s=this.determinantAffine();if(s===0)return i.set(1,1,1),t.identity(),this;let o=lo.set(r[0],r[1],r[2]).length(),a=lo.set(r[4],r[5],r[6]).length(),l=lo.set(r[8],r[9],r[10]).length();s<0&&(o=-o),Ri.copy(this);let c=1/o,u=1/a,d=1/l;return Ri.elements[0]*=c,Ri.elements[1]*=c,Ri.elements[2]*=c,Ri.elements[4]*=u,Ri.elements[5]*=u,Ri.elements[6]*=u,Ri.elements[8]*=d,Ri.elements[9]*=d,Ri.elements[10]*=d,t.setFromRotationMatrix(Ri),i.x=o,i.y=a,i.z=l,this}makePerspective(e,t,i,r,s,o,a=Li,l=!1){let c=this.elements,u=2*s/(t-e),d=2*s/(i-r),h=(t+e)/(t-e),f=(i+r)/(i-r),g,_;if(l)g=s/(o-s),_=o*s/(o-s);else if(a===Li)g=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===La)g=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=d,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,i,r,s,o,a=Li,l=!1){let c=this.elements,u=2/(t-e),d=2/(i-r),h=-(t+e)/(t-e),f=-(i+r)/(i-r),g,_;if(l)g=1/(o-s),_=o/(o-s);else if(a===Li)g=-2/(o-s),_=-(o+s)/(o-s);else if(a===La)g=-1/(o-s),_=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=d,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let t=this.elements,i=e.elements;for(let r=0;r<16;r++)if(t[r]!==i[r])return!1;return!0}fromArray(e,t=0){for(let i=0;i<16;i++)this.elements[i]=e[i+t];return this}toArray(e=[],t=0){let i=this.elements;return e[t]=i[0],e[t+1]=i[1],e[t+2]=i[2],e[t+3]=i[3],e[t+4]=i[4],e[t+5]=i[5],e[t+6]=i[6],e[t+7]=i[7],e[t+8]=i[8],e[t+9]=i[9],e[t+10]=i[10],e[t+11]=i[11],e[t+12]=i[12],e[t+13]=i[13],e[t+14]=i[14],e[t+15]=i[15],e}};Au.prototype.isMatrix4=!0;var vt=Au,lo=new I,Ri=new vt,$y=new I(0,0,0),qy=new I(1,1,1),Ur=new I,dc=new I,ii=new I,g0=new vt,x0=new xi,Hr=class n{constructor(e=0,t=0,i=0,r=n.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,i,r=this._order){return this._x=e,this._y=t,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,i=!0){let r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],d=r[2],h=r[6],f=r[10];switch(t){case"XYZ":this._y=Math.asin(mt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-mt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-d,s),this._z=0);break;case"ZXY":this._x=Math.asin(mt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-d,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-mt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(mt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-d,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-mt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:Ke("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,i){return g0.makeRotationFromQuaternion(e),this.setFromRotationMatrix(g0,t,i)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return x0.setFromEuler(this),this.setFromQuaternion(x0,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Hr.DEFAULT_ORDER="XYZ";var Ao=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},jy=0,v0=new I,co=new xi,ur=new vt,pc=new I,ba=new I,Zy=new I,Ky=new xi,y0=new I(1,0,0),_0=new I(0,1,0),M0=new I(0,0,1),S0={type:"added"},Jy={type:"removed"},uo={type:"childadded",child:null},Vf={type:"childremoved",child:null},qn=class n extends Xi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:jy++}),this.uuid=Gr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let e=new I,t=new Hr,i=new xi,r=new I(1,1,1);function s(){i.setFromEuler(t,!1)}function o(){t.setFromQuaternion(i,void 0,!1)}t._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new vt},normalMatrix:{value:new at}}),this.matrix=new vt,this.matrixWorld=new vt,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ao,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return co.setFromAxisAngle(e,t),this.quaternion.multiply(co),this}rotateOnWorldAxis(e,t){return co.setFromAxisAngle(e,t),this.quaternion.premultiply(co),this}rotateX(e){return this.rotateOnAxis(y0,e)}rotateY(e){return this.rotateOnAxis(_0,e)}rotateZ(e){return this.rotateOnAxis(M0,e)}translateOnAxis(e,t){return v0.copy(e).applyQuaternion(this.quaternion),this.position.add(v0.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(y0,e)}translateY(e){return this.translateOnAxis(_0,e)}translateZ(e){return this.translateOnAxis(M0,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ur.copy(this.matrixWorld).invert())}lookAt(e,t,i){e.isVector3?pc.copy(e):pc.set(e,t,i);let r=this.parent;this.updateWorldMatrix(!0,!1),ba.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ur.lookAt(ba,pc,this.up):ur.lookAt(pc,ba,this.up),this.quaternion.setFromRotationMatrix(ur),r&&(ur.extractRotation(r.matrixWorld),co.setFromRotationMatrix(ur),this.quaternion.premultiply(co.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(tt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(S0),uo.child=e,this.dispatchEvent(uo),uo.child=null):tt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Jy),Vf.child=e,this.dispatchEvent(Vf),Vf.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ur.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ur.multiply(e.parent.matrixWorld)),e.applyMatrix4(ur),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(S0),uo.child=e,this.dispatchEvent(uo),uo.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let i=0,r=this.children.length;i<r;i++){let o=this.children[i].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,i=[]){this[e]===t&&i.push(this);let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,t,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ba,e,Zy),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ba,Ky,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].traverseVisible(e)}traverseAncestors(e){let t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let t=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*i-s[8]*r,s[13]+=i-s[1]*t-s[5]*i-s[9]*r,s[14]+=r-s[2]*t-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let t=this.children;for(let i=0,r=t.length;i<r;i++)t[i].updateMatrixWorld(e)}updateWorldMatrix(e,t,i=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),t===!0){let s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].updateWorldMatrix(!1,!0,i)}}toJSON(e){let t=e===void 0||typeof e=="string",i={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let d=l[c];s(e.shapes,d)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];r.animations.push(s(e.animations,l))}}if(t){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),d=o(e.shapes),h=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),d.length>0&&(i.shapes=d),h.length>0&&(i.skeletons=h),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let i=0;i<e.children.length;i++){let r=e.children[i];this.add(r.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};qn.DEFAULT_UP=new I(0,1,0);qn.DEFAULT_MATRIX_AUTO_UPDATE=!0;qn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Bt=class extends qn{constructor(){super(),this.isGroup=!0,this.type="Group"}},Qy={type:"move"},To=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Bt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Bt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Bt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let i of e.hand.values())this._getHandJoint(t,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,i){let r=null,s=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,i),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let u=c.joints["index-finger-tip"],d=c.joints["thumb-tip"],h=u.position.distanceTo(d.position),f=.02,g=.005;c.inputState.pinching&&h>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=t.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(r=t.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Qy)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let i=new Bt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[t.jointName]=i,e.add(i)}return e.joints[t.jointName]}},wg={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Br={h:0,s:0,l:0},mc={h:0,s:0,l:0};function Gf(n,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?n+(e-n)*6*t:t<1/2?e:t<2/3?n+(e-n)*6*(2/3-t):n}var gt=class{constructor(e,t,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,i)}set(e,t,i){if(t===void 0&&i===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,t,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=si){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ft.colorSpaceToWorking(this,t),this}setRGB(e,t,i,r=ft.workingColorSpace){return this.r=e,this.g=t,this.b=i,ft.colorSpaceToWorking(this,r),this}setHSL(e,t,i,r=ft.workingColorSpace){if(e=Hy(e,1),t=mt(t,0,1),i=mt(i,0,1),t===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+t):i+t-i*t,o=2*i-s;this.r=Gf(o,s,e+1/3),this.g=Gf(o,s,e),this.b=Gf(o,s,e-1/3)}return ft.colorSpaceToWorking(this,r),this}setStyle(e,t=si){function i(s){s!==void 0&&parseFloat(s)<1&&Ke("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,t);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:Ke("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(s,16),t);Ke("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=si){let i=wg[e.toLowerCase()];return i!==void 0?this.setHex(i,t):Ke("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=gr(e.r),this.g=gr(e.g),this.b=gr(e.b),this}copyLinearToSRGB(e){return this.r=So(e.r),this.g=So(e.g),this.b=So(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=si){return ft.workingToColorSpace(Pn.copy(this),e),Math.round(mt(Pn.r*255,0,255))*65536+Math.round(mt(Pn.g*255,0,255))*256+Math.round(mt(Pn.b*255,0,255))}getHexString(e=si){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ft.workingColorSpace){ft.workingToColorSpace(Pn.copy(this),t);let i=Pn.r,r=Pn.g,s=Pn.b,o=Math.max(i,r,s),a=Math.min(i,r,s),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let d=o-a;switch(c=u<=.5?d/(o+a):d/(2-o-a),o){case i:l=(r-s)/d+(r<s?6:0);break;case r:l=(s-i)/d+2;break;case s:l=(i-r)/d+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=ft.workingColorSpace){return ft.workingToColorSpace(Pn.copy(this),t),e.r=Pn.r,e.g=Pn.g,e.b=Pn.b,e}getStyle(e=si){ft.workingToColorSpace(Pn.copy(this),e);let t=Pn.r,i=Pn.g,r=Pn.b;return e!==si?`color(${e} ${t.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,t,i){return this.getHSL(Br),this.setHSL(Br.h+e,Br.s+t,Br.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,i){return this.r=e.r+(t.r-e.r)*i,this.g=e.g+(t.g-e.g)*i,this.b=e.b+(t.b-e.b)*i,this}lerpHSL(e,t){this.getHSL(Br),e.getHSL(mc);let i=Of(Br.h,mc.h,t),r=Of(Br.s,mc.s,t),s=Of(Br.l,mc.l,t);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*t+s[3]*i+s[6]*r,this.g=s[1]*t+s[4]*i+s[7]*r,this.b=s[2]*t+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Pn=new gt;gt.NAMES=wg;var xr=class extends qn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Hr,this.environmentIntensity=1,this.environmentRotation=new Hr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}},Ci=new I,hr=new I,Hf=new I,fr=new I,ho=new I,fo=new I,b0=new I,Wf=new I,Xf=new I,Yf=new I,$f=new Gt,qf=new Gt,jf=new Gt,mr=class n{constructor(e=new I,t=new I,i=new I){this.a=e,this.b=t,this.c=i}static getNormal(e,t,i,r){r.subVectors(i,t),Ci.subVectors(e,t),r.cross(Ci);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,t,i,r,s){Ci.subVectors(r,t),hr.subVectors(i,t),Hf.subVectors(e,t);let o=Ci.dot(Ci),a=Ci.dot(hr),l=Ci.dot(Hf),c=hr.dot(hr),u=hr.dot(Hf),d=o*c-a*a;if(d===0)return s.set(0,0,0),null;let h=1/d,f=(c*l-a*u)*h,g=(o*u-a*l)*h;return s.set(1-f-g,g,f)}static containsPoint(e,t,i,r){return this.getBarycoord(e,t,i,r,fr)===null?!1:fr.x>=0&&fr.y>=0&&fr.x+fr.y<=1}static getInterpolation(e,t,i,r,s,o,a,l){return this.getBarycoord(e,t,i,r,fr)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,fr.x),l.addScaledVector(o,fr.y),l.addScaledVector(a,fr.z),l)}static getInterpolatedAttribute(e,t,i,r,s,o){return $f.setScalar(0),qf.setScalar(0),jf.setScalar(0),$f.fromBufferAttribute(e,t),qf.fromBufferAttribute(e,i),jf.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector($f,s.x),o.addScaledVector(qf,s.y),o.addScaledVector(jf,s.z),o}static isFrontFacing(e,t,i,r){return Ci.subVectors(i,t),hr.subVectors(e,t),Ci.cross(hr).dot(r)<0}set(e,t,i){return this.a.copy(e),this.b.copy(t),this.c.copy(i),this}setFromPointsAndIndices(e,t,i,r){return this.a.copy(e[t]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,t,i,r){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Ci.subVectors(this.c,this.b),hr.subVectors(this.a,this.b),Ci.cross(hr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return n.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,i,r,s){return n.getInterpolation(e,this.a,this.b,this.c,t,i,r,s)}containsPoint(e){return n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let i=this.a,r=this.b,s=this.c,o,a;ho.subVectors(r,i),fo.subVectors(s,i),Wf.subVectors(e,i);let l=ho.dot(Wf),c=fo.dot(Wf);if(l<=0&&c<=0)return t.copy(i);Xf.subVectors(e,r);let u=ho.dot(Xf),d=fo.dot(Xf);if(u>=0&&d<=u)return t.copy(r);let h=l*d-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(i).addScaledVector(ho,o);Yf.subVectors(e,s);let f=ho.dot(Yf),g=fo.dot(Yf);if(g>=0&&f<=g)return t.copy(s);let _=f*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(i).addScaledVector(fo,a);let m=u*g-f*d;if(m<=0&&d-u>=0&&f-g>=0)return b0.subVectors(s,r),a=(d-u)/(d-u+(f-g)),t.copy(r).addScaledVector(b0,a);let p=1/(m+_+h);return o=_*p,a=h*p,t.copy(i).addScaledVector(ho,o).addScaledVector(fo,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Yi=class{constructor(e=new I(1/0,1/0,1/0),t=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t+=3)this.expandByPoint(Ii.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,i=e.count;t<i;t++)this.expandByPoint(Ii.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,i=e.length;t<i;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let i=Ii.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let s=i.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Ii):Ii.fromBufferAttribute(s,o),Ii.applyMatrix4(e.matrixWorld),this.expandByPoint(Ii);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),gc.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),gc.copy(i.boundingBox)),gc.applyMatrix4(e.matrixWorld),this.union(gc)}let r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Ii),Ii.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,i;return e.normal.x>0?(t=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),t<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(wa),xc.subVectors(this.max,wa),po.subVectors(e.a,wa),mo.subVectors(e.b,wa),go.subVectors(e.c,wa),kr.subVectors(mo,po),zr.subVectors(go,mo),_s.subVectors(po,go);let t=[0,-kr.z,kr.y,0,-zr.z,zr.y,0,-_s.z,_s.y,kr.z,0,-kr.x,zr.z,0,-zr.x,_s.z,0,-_s.x,-kr.y,kr.x,0,-zr.y,zr.x,0,-_s.y,_s.x,0];return!Zf(t,po,mo,go,xc)||(t=[1,0,0,0,1,0,0,0,1],!Zf(t,po,mo,go,xc))?!1:(vc.crossVectors(kr,zr),t=[vc.x,vc.y,vc.z],Zf(t,po,mo,go,xc))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ii).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ii).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(dr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),dr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),dr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),dr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),dr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),dr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),dr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),dr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(dr),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},dr=[new I,new I,new I,new I,new I,new I,new I,new I],Ii=new I,gc=new Yi,po=new I,mo=new I,go=new I,kr=new I,zr=new I,_s=new I,wa=new I,xc=new I,vc=new I,Ms=new I;function Zf(n,e,t,i,r){for(let s=0,o=n.length-3;s<=o;s+=3){Ms.fromArray(n,s);let a=r.x*Math.abs(Ms.x)+r.y*Math.abs(Ms.y)+r.z*Math.abs(Ms.z),l=e.dot(Ms),c=t.dot(Ms),u=i.dot(Ms);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var mn=new I,yc=new nt,e_=0,Xt=class extends Xi{constructor(e,t,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:e_++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=i,this.usage=Od,this.updateRanges=[],this.gpuType=vi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,i){e*=this.itemSize,i*=t.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=t.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,i=this.count;t<i;t++)yc.fromBufferAttribute(this,t),yc.applyMatrix3(e),this.setXY(t,yc.x,yc.y);else if(this.itemSize===3)for(let t=0,i=this.count;t<i;t++)mn.fromBufferAttribute(this,t),mn.applyMatrix3(e),this.setXYZ(t,mn.x,mn.y,mn.z);return this}applyMatrix4(e){for(let t=0,i=this.count;t<i;t++)mn.fromBufferAttribute(this,t),mn.applyMatrix4(e),this.setXYZ(t,mn.x,mn.y,mn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)mn.fromBufferAttribute(this,t),mn.applyNormalMatrix(e),this.setXYZ(t,mn.x,mn.y,mn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)mn.fromBufferAttribute(this,t),mn.transformDirection(e),this.setXYZ(t,mn.x,mn.y,mn.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let i=this.array[e*this.itemSize+t];return this.normalized&&(i=Hi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ut(i,this.array)),this.array[e*this.itemSize+t]=i,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Hi(t,this.array)),t}setX(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Hi(t,this.array)),t}setY(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Hi(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Hi(t,this.array)),t}setW(e,t){return this.normalized&&(t=Ut(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,i){return e*=this.itemSize,this.normalized&&(t=Ut(t,this.array),i=Ut(i,this.array)),this.array[e+0]=t,this.array[e+1]=i,this}setXYZ(e,t,i,r){return e*=this.itemSize,this.normalized&&(t=Ut(t,this.array),i=Ut(i,this.array),r=Ut(r,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e*=this.itemSize,this.normalized&&(t=Ut(t,this.array),i=Ut(i,this.array),r=Ut(r,this.array),s=Ut(s,this.array)),this.array[e+0]=t,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var Oa=class extends Xt{constructor(e,t,i){super(new Uint16Array(e),t,i)}};var Ua=class extends Xt{constructor(e,t,i){super(new Uint32Array(e),t,i)}};var Pt=class extends Xt{constructor(e,t,i){super(new Float32Array(e),t,i)}},t_=new Yi,Ea=new I,Kf=new I,$i=class{constructor(e=new I,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let i=this.center;t!==void 0?i.copy(t):t_.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let i=this.center.distanceToSquared(e);return t.copy(e),i>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ea.subVectors(e,this.center);let t=Ea.lengthSq();if(t>this.radius*this.radius){let i=Math.sqrt(t),r=(i-this.radius)*.5;this.center.addScaledVector(Ea,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Kf.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ea.copy(e.center).add(Kf)),this.expandByPoint(Ea.copy(e.center).sub(Kf))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},n_=0,gi=new vt,Jf=new qn,xo=new I,ri=new Yi,Aa=new Yi,Sn=new I,an=class n extends Xi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:n_++}),this.uuid=Gr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Vy(e)?Ua:Oa)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,i=0){this.groups.push({start:e,count:t,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new at().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return gi.makeRotationFromQuaternion(e),this.applyMatrix4(gi),this}rotateX(e){return gi.makeRotationX(e),this.applyMatrix4(gi),this}rotateY(e){return gi.makeRotationY(e),this.applyMatrix4(gi),this}rotateZ(e){return gi.makeRotationZ(e),this.applyMatrix4(gi),this}translate(e,t,i){return gi.makeTranslation(e,t,i),this.applyMatrix4(gi),this}scale(e,t,i){return gi.makeScale(e,t,i),this.applyMatrix4(gi),this}lookAt(e){return Jf.lookAt(e),Jf.updateMatrix(),this.applyMatrix4(Jf.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(xo).negate(),this.translate(xo.x,xo.y,xo.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let i=[];for(let r=0,s=e.length;r<s;r++){let o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Pt(i,3))}else{let i=Math.min(e.length,t.count);for(let r=0;r<i;r++){let s=e[r];t.setXYZ(r,s.x,s.y,s.z||0)}e.length>t.count&&Ke("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Yi);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){tt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let i=0,r=t.length;i<r;i++){let s=t[i];ri.setFromBufferAttribute(s),this.morphTargetsRelative?(Sn.addVectors(this.boundingBox.min,ri.min),this.boundingBox.expandByPoint(Sn),Sn.addVectors(this.boundingBox.max,ri.max),this.boundingBox.expandByPoint(Sn)):(this.boundingBox.expandByPoint(ri.min),this.boundingBox.expandByPoint(ri.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&tt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new $i);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){tt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(e){let i=this.boundingSphere.center;if(ri.setFromBufferAttribute(e),t)for(let s=0,o=t.length;s<o;s++){let a=t[s];Aa.setFromBufferAttribute(a),this.morphTargetsRelative?(Sn.addVectors(ri.min,Aa.min),ri.expandByPoint(Sn),Sn.addVectors(ri.max,Aa.max),ri.expandByPoint(Sn)):(ri.expandByPoint(Aa.min),ri.expandByPoint(Aa.max))}ri.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Sn.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Sn));if(t)for(let s=0,o=t.length;s<o;s++){let a=t[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Sn.fromBufferAttribute(a,c),l&&(xo.fromBufferAttribute(e,c),Sn.add(xo)),r=Math.max(r,i.distanceToSquared(Sn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&tt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){tt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=t.position,r=t.normal,s=t.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new Xt(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let x=0;x<i.count;x++)a[x]=new I,l[x]=new I;let c=new I,u=new I,d=new I,h=new nt,f=new nt,g=new nt,_=new I,m=new I;function p(x,w,C){c.fromBufferAttribute(i,x),u.fromBufferAttribute(i,w),d.fromBufferAttribute(i,C),h.fromBufferAttribute(s,x),f.fromBufferAttribute(s,w),g.fromBufferAttribute(s,C),u.sub(c),d.sub(c),f.sub(h),g.sub(h);let D=1/(f.x*g.y-g.x*f.y);isFinite(D)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(d,-f.y).multiplyScalar(D),m.copy(d).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(D),a[x].add(_),a[w].add(_),a[C].add(_),l[x].add(m),l[w].add(m),l[C].add(m))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let x=0,w=S.length;x<w;++x){let C=S[x],D=C.start,O=C.count;for(let z=D,N=D+O;z<N;z+=3)p(e.getX(z+0),e.getX(z+1),e.getX(z+2))}let b=new I,y=new I,A=new I,T=new I;function R(x){A.fromBufferAttribute(r,x),T.copy(A);let w=a[x];b.copy(w),b.sub(A.multiplyScalar(A.dot(w))).normalize(),y.crossVectors(T,w);let D=y.dot(l[x])<0?-1:1;o.setXYZW(x,b.x,b.y,b.z,D)}for(let x=0,w=S.length;x<w;++x){let C=S[x],D=C.start,O=C.count;for(let z=D,N=D+O;z<N;z+=3)R(e.getX(z+0)),R(e.getX(z+1)),R(e.getX(z+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==t.count)i=new Xt(new Float32Array(t.count*3),3),this.setAttribute("normal",i);else for(let h=0,f=i.count;h<f;h++)i.setXYZ(h,0,0,0);let r=new I,s=new I,o=new I,a=new I,l=new I,c=new I,u=new I,d=new I;if(e)for(let h=0,f=e.count;h<f;h+=3){let g=e.getX(h+0),_=e.getX(h+1),m=e.getX(h+2);r.fromBufferAttribute(t,g),s.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),u.subVectors(o,s),d.subVectors(r,s),u.cross(d),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,f=t.count;h<f;h+=3)r.fromBufferAttribute(t,h+0),s.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),u.subVectors(o,s),d.subVectors(r,s),u.cross(d),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,i=e.count;t<i;t++)Sn.fromBufferAttribute(e,t),Sn.normalize(),e.setXYZ(t,Sn.x,Sn.y,Sn.z)}toNonIndexed(){function e(a,l){let c=a.array,u=a.itemSize,d=a.normalized,h=new c.constructor(l.length*u),f=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?f=l[_]*a.data.stride+a.offset:f=l[_]*u;for(let p=0;p<u;p++)h[g++]=c[f++]}return new Xt(h,u,d)}if(this.index===null)return Ke("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new n,i=this.index.array,r=this.attributes;for(let a in r){let l=r[a],c=e(l,i);t.setAttribute(a,c)}let s=this.morphAttributes;for(let a in s){let l=[],c=s[a];for(let u=0,d=c.length;u<d;u++){let h=c[u],f=e(h,i);l.push(f)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let r={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let d=0,h=c.length;d<h;d++){let f=c[d];u.push(f.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let r=e.attributes;for(let c in r){let u=r[c];this.setAttribute(c,u.clone(t))}let s=e.morphAttributes;for(let c in s){let u=[],d=s[c];for(let h=0,f=d.length;h<f;h++)u.push(d[h].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,u=o.length;c<u;c++){let d=o[c];this.addGroup(d.start,d.count,d.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},iu=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Od,this.updateRanges=[],this.version=0,this.uuid=Gr()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,i){e*=this.stride,i*=t.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=t.array[i+r];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Gr()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(t,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Gr()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}},zn=new I,Ro=class n{constructor(e,t,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,i=this.data.count;t<i;t++)zn.fromBufferAttribute(this,t),zn.applyMatrix4(e),this.setXYZ(t,zn.x,zn.y,zn.z);return this}applyNormalMatrix(e){for(let t=0,i=this.count;t<i;t++)zn.fromBufferAttribute(this,t),zn.applyNormalMatrix(e),this.setXYZ(t,zn.x,zn.y,zn.z);return this}transformDirection(e){for(let t=0,i=this.count;t<i;t++)zn.fromBufferAttribute(this,t),zn.transformDirection(e),this.setXYZ(t,zn.x,zn.y,zn.z);return this}getComponent(e,t){let i=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(i=Hi(i,this.array)),i}setComponent(e,t,i){return this.normalized&&(i=Ut(i,this.array)),this.data.array[e*this.data.stride+this.offset+t]=i,this}setX(e,t){return this.normalized&&(t=Ut(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Ut(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Hi(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Hi(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Hi(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Hi(t,this.array)),t}setXY(e,t,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ut(t,this.array),i=Ut(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this}setXYZ(e,t,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ut(t,this.array),i=Ut(i,this.array),r=Ut(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,t,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Ut(t,this.array),i=Ut(i,this.array),r=Ut(r,this.array),s=Ut(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Na("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return new Xt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new n(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Na("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)t.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Qf=new I,i_=new I,r_=new at,Pi=class{constructor(e=new I(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,i,r){return this.normal.set(e,t,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,i){let r=Qf.subVectors(i,t).cross(i_.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,i=!0){let r=e.delta(Qf),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(o<0||o>1)?null:t.copy(e.start).addScaledVector(r,o)}intersectsLine(e){let t=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return t<0&&i>0||i<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let i=t||r_.getNormalMatrix(e),r=this.coplanarPoint(Qf).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},s_=0,vr=class extends Xi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:s_++}),this.uuid=Gr(),this.name="",this.type="Material",this.blending=Di,this.side=qi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=yd,this.blendDst=Lo,this.blendEquation=br,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new gt(0,0,0),this.blendAlpha=0,this.depthFunc=bo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=dg,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Vc,this.stencilZFail=Vc,this.stencilZPass=Vc,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let i=e[t];if(i===void 0){Ke(`Material: parameter '${t}' has value of undefined.`);continue}let r=this[t];if(r===void 0){Ke(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[t]=i}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){let o=[];for(let a in s){let l=s[a];delete l.metadata,o.push(l)}return o}if(t){let s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new gt().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new Pi().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new nt().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new nt().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,i=null;if(t!==null){let r=t.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=t[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var pr=new I,ed=new I,_c=new I,Mc=new I,yr=class{constructor(e=new I,t=new I(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,pr)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let i=t.dot(this.direction);return i<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=pr.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(pr.copy(this.origin).addScaledVector(this.direction,t),pr.distanceToSquared(e))}distanceSqToSegment(e,t,i,r){ed.copy(e).add(t).multiplyScalar(.5),_c.copy(t).sub(e).normalize(),Mc.copy(this.origin).sub(ed);let s=e.distanceTo(t)*.5,o=-this.direction.dot(_c),a=Mc.dot(this.direction),l=-Mc.dot(_c),c=Mc.lengthSq(),u=Math.abs(1-o*o),d,h,f,g;if(u>0)if(d=o*l-a,h=o*a-l,g=s*u,d>=0)if(h>=-g)if(h<=g){let _=1/u;d*=_,h*=_,f=d*(d+o*h+2*a)+h*(o*d+h+2*l)+c}else h=s,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;else h=-s,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;else h<=-g?(d=Math.max(0,-(-o*s+a)),h=d>0?-s:Math.min(Math.max(-s,-l),s),f=-d*d+h*(h+2*l)+c):h<=g?(d=0,h=Math.min(Math.max(-s,-l),s),f=h*(h+2*l)+c):(d=Math.max(0,-(o*s+a)),h=d>0?s:Math.min(Math.max(-s,-l),s),f=-d*d+h*(h+2*l)+c);else h=o>0?-s:s,d=Math.max(0,-(o*h+a)),f=-d*d+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,d),r&&r.copy(ed).addScaledVector(_c,h),f}intersectSphere(e,t){if(e.radius<0)return null;pr.subVectors(e.center,this.origin);let i=pr.dot(this.direction),r=pr.dot(pr)-i*i,s=e.radius*e.radius;if(r>s)return null;let o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/t;return i>=0?i:null}intersectPlane(e,t){let i=this.distanceToPlane(e);return i===null?null:this.at(i,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let i,r,s,o,a,l,c=1/this.direction.x,u=1/this.direction.y,d=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),u>=0?(s=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(s=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),d>=0?(a=(e.min.z-h.z)*d,l=(e.max.z-h.z)*d):(a=(e.max.z-h.z)*d,l=(e.min.z-h.z)*d),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,t)}intersectsBox(e){return this.intersectBox(e,pr)!==null}intersectTriangle(e,t,i,r,s){let o=this.origin,a=this.direction,l=a.x,c=a.y,u=a.z,d=e.x-o.x,h=e.y-o.y,f=e.z-o.z,g=t.x-o.x,_=t.y-o.y,m=t.z-o.z,p=i.x-o.x,S=i.y-o.y,b=i.z-o.z,y=Math.abs(l),A=Math.abs(c),T=Math.abs(u),R,x,w,C,D,O,z,N,V,Z,X,K;if(y>=A&&y>=T?(w=l,O=d,V=g,K=p,l>=0?(R=c,x=u,C=h,D=f,z=_,N=m,Z=S,X=b):(R=u,x=c,C=f,D=h,z=m,N=_,Z=b,X=S)):A>=T?(w=c,O=h,V=_,K=S,c>=0?(R=u,x=l,C=f,D=d,z=m,N=g,Z=b,X=p):(R=l,x=u,C=d,D=f,z=g,N=m,Z=p,X=b)):(w=u,O=f,V=m,K=b,u>=0?(R=l,x=c,C=d,D=h,z=g,N=_,Z=p,X=S):(R=c,x=l,C=h,D=d,z=_,N=g,Z=S,X=p)),w===0)return null;let q=R/w,J=x/w,te=1/w,Be=C-q*O,Le=D-J*O,dt=z-q*V,ot=N-J*V,rt=Z-q*K,Y=X-J*K,Q=rt*ot-Y*dt,ge=Be*Y-Le*rt,qe=dt*Le-ot*Be;if(r){if(Q<0||ge<0||qe<0)return null}else if((Q<0||ge<0||qe<0)&&(Q>0||ge>0||qe>0))return null;let Se=Q+ge+qe;if(Se===0)return null;let de=te*(Q*O+ge*V+qe*K);return(Se>0?de<0:de>0)?null:this.at(de/Se,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Ba=class extends vr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new gt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Hr,this.combine=_d,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},w0=new vt,Ss=new yr,Sc=new $i,E0=new I,bc=new I,wc=new I,Ec=new I,td=new I,Ac=new I,A0=new I,Tc=new I,Lt=class extends qn{constructor(e=new an,t=new Ba){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){let i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;t.fromBufferAttribute(r,e);let a=this.morphTargetInfluences;if(s&&a){Ac.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let u=a[l],d=s[l];u!==0&&(td.fromBufferAttribute(d,e),o?Ac.addScaledVector(td,u):Ac.addScaledVector(td.sub(t),u))}t.add(Ac)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Sc.copy(i.boundingSphere),Sc.applyMatrix4(s),Ss.copy(e.ray).recast(e.near),!(Sc.containsPoint(Ss.origin)===!1&&(Ss.intersectSphere(Sc,E0)===null||Ss.origin.distanceToSquared(E0)>(e.far-e.near)**2))&&(w0.copy(s).invert(),Ss.copy(e.ray).applyMatrix4(w0),!(i.boundingBox!==null&&Ss.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,t,Ss)))}_computeIntersections(e,t,i){let r,s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,d=s.attributes.normal,h=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){let m=h[g],p=o[m.materialIndex],S=Math.max(m.start,f.start),b=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let y=S,A=b;y<A;y+=3){let T=a.getX(y),R=a.getX(y+1),x=a.getX(y+2);r=Rc(this,p,e,i,c,u,d,T,R,x),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{let g=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let S=a.getX(m),b=a.getX(m+1),y=a.getX(m+2);r=Rc(this,o,e,i,c,u,d,S,b,y),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){let m=h[g],p=o[m.materialIndex],S=Math.max(m.start,f.start),b=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let y=S,A=b;y<A;y+=3){let T=y,R=y+1,x=y+2;r=Rc(this,p,e,i,c,u,d,T,R,x),r&&(r.faceIndex=Math.floor(y/3),r.face.materialIndex=m.materialIndex,t.push(r))}}else{let g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let S=m,b=m+1,y=m+2;r=Rc(this,o,e,i,c,u,d,S,b,y),r&&(r.faceIndex=Math.floor(m/3),t.push(r))}}}};function o_(n,e,t,i,r,s,o,a){let l;if(e.side===Hn?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===qi,a),l===null)return null;Tc.copy(a),Tc.applyMatrix4(n.matrixWorld);let c=t.ray.origin.distanceTo(Tc);return c<t.near||c>t.far?null:{distance:c,point:Tc.clone(),object:n}}function Rc(n,e,t,i,r,s,o,a,l,c){n.getVertexPosition(a,bc),n.getVertexPosition(l,wc),n.getVertexPosition(c,Ec);let u=o_(n,e,t,i,bc,wc,Ec,A0);if(u){let d=new I;mr.getBarycoord(A0,bc,wc,Ec,d),r&&(u.uv=mr.getInterpolatedAttribute(r,a,l,c,d,new nt)),s&&(u.uv1=mr.getInterpolatedAttribute(s,a,l,c,d,new nt)),o&&(u.normal=mr.getInterpolatedAttribute(o,a,l,c,d,new I),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let h={a,b:l,c,normal:new I,materialIndex:0};mr.getNormal(bc,wc,Ec,h.normal),u.face=h,u.barycoord=d}return u}var ka=class extends Vn{constructor(e=null,t=1,i=1,r,s,o,a,l,c=bn,u=bn,d,h){super(null,o,a,l,c,u,r,s,d,h),this.isDataTexture=!0,this.image={data:e,width:t,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Gn=class extends Xt{constructor(e,t,i,r=1){super(e,t,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},vo=new vt,T0=new vt,Cc=[],R0=new Yi,a_=new vt,Ta=new Lt,Ra=new $i,za=class extends Lt{constructor(e,t,i){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Gn(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,a_)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Yi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,vo),R0.copy(e.boundingBox).applyMatrix4(vo),this.boundingBox.union(R0)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new $i),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<t;i++)this.getMatrixAt(i,vo),Ra.copy(e.boundingSphere).applyMatrix4(vo),this.boundingSphere.union(Ra)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let i=t.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,o=e*s+1;for(let a=0;a<i.length;a++)i[a]=r[o+a]}raycast(e,t){let i=this.matrixWorld,r=this.count;if(Ta.geometry=this.geometry,Ta.material=this.material,Ta.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ra.copy(this.boundingSphere),Ra.applyMatrix4(i),e.ray.intersectsSphere(Ra)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,vo),T0.multiplyMatrices(i,vo),Ta.matrixWorld=T0,Ta.raycast(e,Cc);for(let o=0,a=Cc.length;o<a;o++){let l=Cc[o];l.instanceId=s,l.object=this,t.push(l)}Cc.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Gn(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){let i=t.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new ka(new Float32Array(r*this.count),r,this.count,Nu,vi));let s=this.morphTexture.source.data.data,o=0;for(let c=0;c<i.length;c++)o+=i[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=r*e;return s[l]=a,s.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},bs=new $i,l_=new nt(.5,.5),Ic=new I,Va=class{constructor(e=new Pi,t=new Pi,i=new Pi,r=new Pi,s=new Pi,o=new Pi){this.planes=[e,t,i,r,s,o]}set(e,t,i,r,s,o){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){let t=this.planes;for(let i=0;i<6;i++)t[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,t=Li,i=!1){let r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],d=s[5],h=s[6],f=s[7],g=s[8],_=s[9],m=s[10],p=s[11],S=s[12],b=s[13],y=s[14],A=s[15];if(r[0].setComponents(c-o,f-u,p-g,A-S).normalize(),r[1].setComponents(c+o,f+u,p+g,A+S).normalize(),r[2].setComponents(c+a,f+d,p+_,A+b).normalize(),r[3].setComponents(c-a,f-d,p-_,A-b).normalize(),i)r[4].setComponents(l,h,m,y).normalize(),r[5].setComponents(c-l,f-h,p-m,A-y).normalize();else if(r[4].setComponents(c-l,f-h,p-m,A-y).normalize(),t===Li)r[5].setComponents(c+l,f+h,p+m,A+y).normalize();else if(t===La)r[5].setComponents(l,h,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),bs.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),bs.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(bs)}intersectsSprite(e){bs.center.set(0,0,0);let t=l_.distanceTo(e.center);return bs.radius=.7071067811865476+t,bs.applyMatrix4(e.matrixWorld),this.intersectsSphere(bs)}intersectsSphere(e){let t=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){let t=this.planes;for(let i=0;i<6;i++){let r=t[i];if(Ic.x=r.normal.x>0?e.max.x:e.min.x,Ic.y=r.normal.y>0?e.max.y:e.min.y,Ic.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Ic)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let i=0;i<6;i++)if(t[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var ru=class extends vr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new gt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},su=new I,ou=new I,C0=new vt,Ca=new yr,Pc=new $i,nd=new I,I0=new I,au=class extends qn{constructor(e=new an,t=new ru){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[0];for(let r=1,s=t.count;r<s;r++)su.fromBufferAttribute(t,r-1),ou.fromBufferAttribute(t,r),i[r]=i[r-1],i[r]+=su.distanceTo(ou);e.setAttribute("lineDistance",new Pt(i,1))}else Ke("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Pc.copy(i.boundingSphere),Pc.applyMatrix4(r),Pc.radius+=s,e.ray.intersectsSphere(Pc)===!1)return;C0.copy(r).invert(),Ca.copy(e.ray).applyMatrix4(C0);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,h=i.attributes.position;if(u!==null){let f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){let p=u.getX(_),S=u.getX(_+1),b=Lc(this,e,Ca,l,p,S,_);b&&t.push(b)}if(this.isLineLoop){let _=u.getX(g-1),m=u.getX(f),p=Lc(this,e,Ca,l,_,m,g-1);p&&t.push(p)}}else{let f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=c){let p=Lc(this,e,Ca,l,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){let _=Lc(this,e,Ca,l,g-1,f,g-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function Lc(n,e,t,i,r,s,o){let a=n.geometry.attributes.position;if(su.fromBufferAttribute(a,r),ou.fromBufferAttribute(a,s),t.distanceSqToSegment(su,ou,nd,I0)>i)return;nd.applyMatrix4(n.matrixWorld);let c=e.ray.origin.distanceTo(nd);if(!(c<e.near||c>e.far))return{distance:c,point:I0.clone().applyMatrix4(n.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:n}}var P0=new I,L0=new I,Ga=class extends au{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,i=[];for(let r=0,s=t.count;r<s;r+=2)P0.fromBufferAttribute(t,r),L0.fromBufferAttribute(t,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+P0.distanceTo(L0);e.setAttribute("lineDistance",new Pt(i,1))}else Ke("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var lu=class extends vr{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new gt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},D0=new vt,fd=new yr,Dc=new $i,Nc=new I,Ha=class extends qn{constructor(e=new an,t=new lu){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Dc.copy(i.boundingSphere),Dc.applyMatrix4(r),Dc.radius+=s,e.ray.intersectsSphere(Dc)===!1)return;D0.copy(r).invert(),fd.copy(e.ray).applyMatrix4(D0);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,d=i.attributes.position;if(c!==null){let h=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=h,_=f;g<_;g++){let m=c.getX(g);Nc.fromBufferAttribute(d,m),N0(Nc,m,l,r,e,t,this)}}else{let h=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let g=h,_=f;g<_;g++)Nc.fromBufferAttribute(d,g),N0(Nc,g,l,r,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,i=Object.keys(t);if(i.length>0){let r=t[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function N0(n,e,t,i,r,s,o){let a=fd.distanceSqToPoint(n);if(a<t){let l=new I;fd.closestPointToPoint(n,l),l.applyMatrix4(i);let c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Wa=class extends Vn{constructor(e=[],t=qr,i,r,s,o,a,l,c,u){super(e,t,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},_r=class extends Vn{constructor(e,t,i,r,s,o,a,l,c){super(e,t,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Wr=class extends Vn{constructor(e,t,i=Ni,r,s,o,a=bn,l=bn,c,u=Wi,d=1){if(u!==Wi&&u!==Zr)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:d};super(h,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Eo(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}},cu=class extends Wr{constructor(e,t=Ni,i=qr,r,s,o=bn,a=bn,l,c=Wi){let u={width:e,height:e,depth:1},d=[u,u,u,u,u,u];super(e,e,t,i,r,s,o,a,l,c),this.image=d,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},Xa=class extends Vn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Co=class n extends an{constructor(e=1,t=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};let a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);let l=[],c=[],u=[],d=[],h=0,f=0;g("z","y","x",-1,-1,i,t,e,o,s,0),g("z","y","x",1,-1,i,t,-e,o,s,1),g("x","z","y",1,1,e,i,t,r,o,2),g("x","z","y",1,-1,e,i,-t,r,o,3),g("x","y","z",1,-1,e,t,i,r,s,4),g("x","y","z",-1,-1,e,t,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Pt(c,3)),this.setAttribute("normal",new Pt(u,3)),this.setAttribute("uv",new Pt(d,2));function g(_,m,p,S,b,y,A,T,R,x,w){let C=y/R,D=A/x,O=y/2,z=A/2,N=T/2,V=R+1,Z=x+1,X=0,K=0,q=new I;for(let J=0;J<Z;J++){let te=J*D-z;for(let Be=0;Be<V;Be++){let Le=Be*C-O;q[_]=Le*S,q[m]=te*b,q[p]=N,c.push(q.x,q.y,q.z),q[_]=0,q[m]=0,q[p]=T>0?1:-1,u.push(q.x,q.y,q.z),d.push(Be/R),d.push(1-J/x),X+=1}}for(let J=0;J<x;J++)for(let te=0;te<R;te++){let Be=h+te+V*J,Le=h+te+V*(J+1),dt=h+(te+1)+V*(J+1),ot=h+(te+1)+V*J;l.push(Be,Le,ot),l.push(Le,dt,ot),K+=6}a.addGroup(f,K,w),f+=K,h+=X}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Ya=class n extends an{constructor(e=[],t=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:i,detail:r};let s=[],o=[];a(r),c(i),u(),this.setAttribute("position",new Pt(s,3)),this.setAttribute("normal",new Pt(s.slice(),3)),this.setAttribute("uv",new Pt(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(S){let b=new I,y=new I,A=new I;for(let T=0;T<t.length;T+=3)f(t[T+0],b),f(t[T+1],y),f(t[T+2],A),l(b,y,A,S)}function l(S,b,y,A){let T=A+1,R=[];for(let x=0;x<=T;x++){R[x]=[];let w=S.clone().lerp(y,x/T),C=b.clone().lerp(y,x/T),D=T-x;for(let O=0;O<=D;O++)O===0&&x===T?R[x][O]=w:R[x][O]=w.clone().lerp(C,O/D)}for(let x=0;x<T;x++)for(let w=0;w<2*(T-x)-1;w++){let C=Math.floor(w/2);w%2===0?(h(R[x][C+1]),h(R[x+1][C]),h(R[x][C])):(h(R[x][C+1]),h(R[x+1][C+1]),h(R[x+1][C]))}}function c(S){let b=new I;for(let y=0;y<s.length;y+=3)b.x=s[y+0],b.y=s[y+1],b.z=s[y+2],b.normalize().multiplyScalar(S),s[y+0]=b.x,s[y+1]=b.y,s[y+2]=b.z}function u(){let S=new I;for(let b=0;b<s.length;b+=3){S.x=s[b+0],S.y=s[b+1],S.z=s[b+2];let y=m(S)/2/Math.PI+.5,A=p(S)/Math.PI+.5;o.push(y,1-A)}g(),d()}function d(){for(let S=0;S<o.length;S+=6){let b=o[S+0],y=o[S+2],A=o[S+4],T=Math.max(b,y,A),R=Math.min(b,y,A);T>.9&&R<.1&&(b<.2&&(o[S+0]+=1),y<.2&&(o[S+2]+=1),A<.2&&(o[S+4]+=1))}}function h(S){s.push(S.x,S.y,S.z)}function f(S,b){let y=S*3;b.x=e[y+0],b.y=e[y+1],b.z=e[y+2]}function g(){let S=new I,b=new I,y=new I,A=new I,T=new nt,R=new nt,x=new nt;for(let w=0,C=0;w<s.length;w+=9,C+=6){S.set(s[w+0],s[w+1],s[w+2]),b.set(s[w+3],s[w+4],s[w+5]),y.set(s[w+6],s[w+7],s[w+8]),T.set(o[C+0],o[C+1]),R.set(o[C+2],o[C+3]),x.set(o[C+4],o[C+5]),A.copy(S).add(b).add(y).divideScalar(3);let D=m(A);_(T,C+0,S,D),_(R,C+2,b,D),_(x,C+4,y,D)}}function _(S,b,y,A){A<0&&S.x===1&&(o[b]=S.x-1),y.x===0&&y.z===0&&(o[b]=A/2/Math.PI+.5)}function m(S){return Math.atan2(S.z,-S.x)}function p(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.vertices,e.indices,e.radius,e.detail)}};var Fc=new I,Oc=new I,id=new I,Uc=new mr,$a=class extends an{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){let r=Math.pow(10,4),s=Math.cos(Gc*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],u=["a","b","c"],d=new Array(3),h={},f=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);let{a:_,b:m,c:p}=Uc;if(_.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),p.fromBufferAttribute(a,c[2]),Uc.getNormal(id),d[0]=`${Math.round(_.x*r)},${Math.round(_.y*r)},${Math.round(_.z*r)}`,d[1]=`${Math.round(m.x*r)},${Math.round(m.y*r)},${Math.round(m.z*r)}`,d[2]=`${Math.round(p.x*r)},${Math.round(p.y*r)},${Math.round(p.z*r)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let S=0;S<3;S++){let b=(S+1)%3,y=d[S],A=d[b],T=Uc[u[S]],R=Uc[u[b]],x=`${y}_${A}`,w=`${A}_${y}`;w in h&&h[w]?(id.dot(h[w].normal)<=s&&(f.push(T.x,T.y,T.z),f.push(R.x,R.y,R.z)),h[w]=null):x in h||(h[x]={index0:c[S],index1:c[b],normal:id.clone()})}}for(let g in h)if(h[g]){let{index0:_,index1:m}=h[g];Fc.fromBufferAttribute(a,_),Oc.fromBufferAttribute(a,m),f.push(Fc.x,Fc.y,Fc.z),f.push(Oc.x,Oc.y,Oc.z)}this.setAttribute("position",new Pt(f,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}},uu=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ke("Curve: .getPoint() not implemented.")}getPointAt(e,t){let i=this.getUtoTmapping(e);return this.getPoint(i,t)}getPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPoint(i/e));return t}getSpacedPoints(e=5){let t=[];for(let i=0;i<=e;i++)t.push(this.getPointAt(i/e));return t}getLength(){let e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let t=[],i,r=this.getPoint(0),s=0;t.push(0);for(let o=1;o<=e;o++)i=this.getPoint(o/e),s+=i.distanceTo(r),t.push(s),r=i;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){let i=this.getLengths(),r=0,s=i.length,o;t?o=t:o=e*i[s-1];let a=0,l=s-1,c;for(;a<=l;)if(r=Math.floor(a+(l-a)/2),c=i[r]-o,c<0)a=r+1;else if(c>0)l=r-1;else{l=r;break}if(r=l,i[r]===o)return r/(s-1);let u=i[r],h=i[r+1]-u,f=(o-u)/h;return(r+f)/(s-1)}getTangent(e,t){let r=e-1e-4,s=e+1e-4;r<0&&(r=0),s>1&&(s=1);let o=this.getPoint(r),a=this.getPoint(s),l=t||(o.isVector2?new nt:new I);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){let i=this.getUtoTmapping(e);return this.getTangent(i,t)}computeFrenetFrames(e,t=!1){let i=new I,r=[],s=[],o=[],a=new I,l=new vt;for(let f=0;f<=e;f++){let g=f/e;r[f]=this.getTangentAt(g,new I)}s[0]=new I,o[0]=new I;let c=Number.MAX_VALUE,u=Math.abs(r[0].x),d=Math.abs(r[0].y),h=Math.abs(r[0].z);u<=c&&(c=u,i.set(1,0,0)),d<=c&&(c=d,i.set(0,1,0)),h<=c&&i.set(0,0,1),a.crossVectors(r[0],i).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let f=1;f<=e;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(r[f-1],r[f]),a.length()>Number.EPSILON){a.normalize();let g=Math.acos(mt(r[f-1].dot(r[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(r[f],s[f])}if(t===!0){let f=Math.acos(mt(s[0].dot(s[e]),-1,1));f/=e,r[0].dot(a.crossVectors(s[0],s[e]))>0&&(f=-f);for(let g=1;g<=e;g++)s[g].applyMatrix4(l.makeRotationAxis(r[g],f*g)),o[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){let e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}};function Bd(){let n=0,e=0,t=0,i=0;function r(s,o,a,l){n=s,e=a,t=-3*s+3*o-2*a-l,i=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){r(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,u,d){let h=(o-s)/c-(a-s)/(c+u)+(a-o)/u,f=(a-o)/u-(l-o)/(u+d)+(l-a)/d;h*=u,f*=u,r(o,a,h,f)},calc:function(s){let o=s*s,a=o*s;return n+e*s+t*o+i*a}}}var F0=new I,O0=new I,rd=new Bd,sd=new Bd,od=new Bd,qa=class extends uu{constructor(e=[],t=!1,i="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=i,this.tension=r}getPoint(e,t=new I){let i=t,r=this.points,s=r.length,o=(s-(this.closed?0:1))*e,a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,u;this.closed||a>0?c=r[(a-1)%s]:(O0.subVectors(r[0],r[1]).add(r[0]),c=O0);let d=r[a%s],h=r[(a+1)%s];if(this.closed||a+2<s?u=r[(a+2)%s]:(F0.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=F0),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,g=Math.pow(c.distanceToSquared(d),f),_=Math.pow(d.distanceToSquared(h),f),m=Math.pow(h.distanceToSquared(u),f);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),rd.initNonuniformCatmullRom(c.x,d.x,h.x,u.x,g,_,m),sd.initNonuniformCatmullRom(c.y,d.y,h.y,u.y,g,_,m),od.initNonuniformCatmullRom(c.z,d.z,h.z,u.z,g,_,m)}else this.curveType==="catmullrom"&&(rd.initCatmullRom(c.x,d.x,h.x,u.x,this.tension),sd.initCatmullRom(c.y,d.y,h.y,u.y,this.tension),od.initCatmullRom(c.z,d.z,h.z,u.z,this.tension));return i.set(rd.calc(l),sd.calc(l),od.calc(l)),i}copy(e){super.copy(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(r.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){let e=super.toJSON();e.points=[];for(let t=0,i=this.points.length;t<i;t++){let r=this.points[t];e.points.push(r.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,i=e.points.length;t<i;t++){let r=e.points[t];this.points.push(new I().fromArray(r))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}};var As=class n extends Ya{constructor(e=1,t=0){let i=(1+Math.sqrt(5))/2,r=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}};var ja=class n extends Ya{constructor(e=1,t=0){let i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,r,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new n(e.radius,e.detail)}},Mr=class n extends an{constructor(e=1,t=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:i,heightSegments:r};let s=e/2,o=t/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,d=e/a,h=t/l,f=[],g=[],_=[],m=[];for(let p=0;p<u;p++){let S=p*h-o;for(let b=0;b<c;b++){let y=b*d-s;g.push(y,-S,0),_.push(0,0,1),m.push(b/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let S=0;S<a;S++){let b=S+c*p,y=S+c*(p+1),A=S+1+c*(p+1),T=S+1+c*p;f.push(b,y,T),f.push(y,A,T)}this.setIndex(f),this.setAttribute("position",new Pt(g,3)),this.setAttribute("normal",new Pt(_,3)),this.setAttribute("uv",new Pt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new n(e.width,e.height,e.widthSegments,e.heightSegments)}};function Is(n){let e={};for(let t in n){e[t]={};for(let i in n[t]){let r=n[t][i];if(U0(r))r.isRenderTargetTexture?(Ke("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][i]=null):e[t][i]=r.clone();else if(Array.isArray(r))if(U0(r[0])){let s=[];for(let o=0,a=r.length;o<a;o++)s[o]=r[o].clone();e[t][i]=s}else e[t][i]=r.slice();else e[t][i]=r}}return e}function Fn(n){let e={};for(let t=0;t<n.length;t++){let i=Is(n[t]);for(let r in i)e[r]=i[r]}return e}function U0(n){return n&&(n.isColor||n.isMatrix3||n.isMatrix4||n.isVector2||n.isVector3||n.isVector4||n.isTexture||n.isQuaternion)}function c_(n){let e=[];for(let t=0;t<n.length;t++)e.push(n[t].clone());return e}function kd(n){let e=n.getRenderTarget();return e===null?n.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ft.workingColorSpace}var Eg={clone:Is,merge:Fn},u_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,h_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,bt=class extends vr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=u_,this.fragmentShader=h_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Is(e.uniforms),this.uniformsGroups=c_(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let r in this.uniforms){let o=this.uniforms[r].value;o&&o.isTexture?t.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[r]={type:"m4",value:o.toArray()}:t.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let i={};for(let r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(t.extensions=i),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let i in e.uniforms){let r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=t[r.value]||null;break;case"c":this.uniforms[i].value=new gt().setHex(r.value);break;case"v2":this.uniforms[i].value=new nt().fromArray(r.value);break;case"v3":this.uniforms[i].value=new I().fromArray(r.value);break;case"v4":this.uniforms[i].value=new Gt().fromArray(r.value);break;case"m3":this.uniforms[i].value=new at().fromArray(r.value);break;case"m4":this.uniforms[i].value=new vt().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},hu=class extends bt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var fu=class extends vr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=hg,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},du=class extends vr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function yo(n,e){return!n||n.constructor===e?n:typeof e.BYTES_PER_ELEMENT=="number"?new e(n):Array.prototype.slice.call(n)}function ad(n){return n!==void 0&&n.inTangents!==void 0&&n.outTangents!==void 0}var Xr=class{constructor(e,t,i,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new t.constructor(i),this.sampleValues=t,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,i=this._cachedIndex,r=t[i],s=t[i-1];n:{e:{let o;t:{i:if(!(e<r)){for(let a=i+2;;){if(r===void 0){if(e<s)break i;return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(s=r,r=t[++i],e<r)break e}o=t.length;break t}if(!(e>=s)){let a=t[1];e<a&&(i=2,s=a);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(r=s,s=t[--i-1],e>=s)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<t[a]?o=a:i=a+1}if(r=t[i],s=t[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return i=t.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,r)}return this.interpolate_(i,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,i=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)t[o]=i[s+o];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},pu=class extends Xr{constructor(e,t,i,r){super(e,t,i,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:cd,endingEnd:cd}}intervalChanged_(e,t,i){let r=this.parameterPositions,s=e-2,o=e+1,a=r[s],l=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case ud:s=e,a=2*t-i;break;case hd:s=r.length-2,a=t+r[s]-r[s+1];break;default:s=e,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case ud:o=e,l=2*i-t;break;case hd:o=1,l=i+r[1]-r[0];break;default:o=e-1,l=t}let c=(i-t)*.5,u=this.valueSize;this._weightPrev=c/(t-a),this._weightNext=c/(l-i),this._offsetPrev=s*u,this._offsetNext=o*u}interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,d=this._offsetNext,h=this._weightPrev,f=this._weightNext,g=(i-t)/(r-t),_=g*g,m=_*g,p=-h*m+2*h*_-h*g,S=(1+h)*m+(-1.5-2*h)*_+(-.5+h)*g+1,b=(-1-f)*m+(1.5+f)*_+.5*g,y=f*m-f*_;for(let A=0;A!==a;++A)s[A]=p*o[u+A]+S*o[c+A]+b*o[l+A]+y*o[d+A];return s}},mu=class extends Xr{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(i-t)/(r-t),d=1-u;for(let h=0;h!==a;++h)s[h]=o[c+h]*d+o[l+h]*u;return s}},gu=class extends Xr{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e){return this.copySampleValue_(e-1)}},xu=class extends Xr{interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this.inTangents,d=this.outTangents;if(!u||!d){let g=(i-t)/(r-t),_=1-g;for(let m=0;m!==a;++m)s[m]=o[c+m]*_+o[l+m]*g;return s}let h=a*2,f=e-1;for(let g=0;g!==a;++g){let _=o[c+g],m=o[l+g],p=f*h+g*2,S=d[p],b=d[p+1],y=e*h+g*2,A=u[y],T=u[y+1],R=d_(i,t,S,A,r);s[g]=Ag(R,_,b,T,m)}return s}};function Ag(n,e,t,i,r){let s=1-n;return s*s*s*e+3*s*s*n*t+3*s*n*n*i+n*n*n*r}function f_(n,e,t,i,r){let s=1-n;return 3*s*s*(t-e)+6*s*n*(i-t)+3*n*n*(r-i)}function d_(n,e,t,i,r){let s=(n-e)/(r-e);for(let o=0;o<8;o++){let a=Ag(s,e,t,i,r)-n;if(Math.abs(a)<1e-10)break;let l=f_(s,e,t,i,r);if(Math.abs(l)<1e-10)break;s=Math.max(0,Math.min(1,s-a/l))}return s}var oi=class{constructor(e,t,i,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=yo(t,this.TimeBufferType),this.values=yo(i,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,i;if(t.toJSON!==this.toJSON)i=t.toJSON(e);else{i={name:e.name,times:yo(e.times,Array),values:yo(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(i.interpolation=r),ad(e.settings)&&(i.settings={inTangents:yo(e.settings.inTangents,Array),outTangents:yo(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new gu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new mu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new pu(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new xu(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Ia:t=this.InterpolantFactoryMethodDiscrete;break;case Jc:t=this.InterpolantFactoryMethodLinear;break;case zc:t=this.InterpolantFactoryMethodSmooth;break;case ld:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return Ke("KeyframeTrack:",i),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Ia;case this.InterpolantFactoryMethodLinear:return Jc;case this.InterpolantFactoryMethodSmooth:return zc;case this.InterpolantFactoryMethodBezier:return ld}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let i=0,r=t.length;i!==r;++i)t[i]*=e;ad(this.settings)&&(B0(this.settings.inTangents,e),B0(this.settings.outTangents,e))}return this}trim(e,t){let i=this.times,r=i.length,s=0,o=r-1;for(;s!==r&&i[s]<e;)++s;for(;o!==-1&&i[o]>t;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=i.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(tt("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,r=this.values,s=i.length;s===0&&(tt("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){tt("KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){tt("KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(r!==void 0&&Gy(r))for(let a=0,l=r.length;a!==l;++a){let c=r[a];if(isNaN(c)){tt("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),i=this.getValueSize(),r=this.getInterpolation()===zc,s=e.length-1,o=1;for(let a=1;a<s;++a){let l=!1,c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(r)l=!0;else{let d=a*i,h=d-i,f=d+i;for(let g=0;g!==i;++g){let _=t[d+g];if(_!==t[h+g]||_!==t[f+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let d=a*i,h=o*i;for(let f=0;f!==i;++f)t[h+f]=t[d+f]}++o}}if(s>0){e[o]=e[s];for(let a=s*i,l=o*i,c=0;c!==i;++c)t[l+c]=t[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*i)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),i=this.constructor,r=new i(this.name,e,t);return r.createInterpolant=this.createInterpolant,ad(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function B0(n,e){for(let t=0,i=n.length;t!==i;t+=2)n[t]*=e}oi.prototype.ValueTypeName="";oi.prototype.TimeBufferType=Float32Array;oi.prototype.ValueBufferType=Float32Array;oi.prototype.DefaultInterpolation=Jc;var Yr=class extends oi{constructor(e,t,i){super(e,t,i)}};Yr.prototype.ValueTypeName="bool";Yr.prototype.ValueBufferType=Array;Yr.prototype.DefaultInterpolation=Ia;Yr.prototype.InterpolantFactoryMethodLinear=void 0;Yr.prototype.InterpolantFactoryMethodSmooth=void 0;var vu=class extends oi{constructor(e,t,i,r){super(e,t,i,r)}};vu.prototype.ValueTypeName="color";var yu=class extends oi{constructor(e,t,i,r){super(e,t,i,r)}};yu.prototype.ValueTypeName="number";var _u=class extends Xr{constructor(e,t,i,r){super(e,t,i,r)}interpolate_(e,t,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-t)/(r-t),c=e*a;for(let u=c+a;c!==u;c+=4)xi.slerpFlat(s,0,o,c-a,o,c,l);return s}},Za=class extends oi{constructor(e,t,i,r){super(e,t,i,r)}InterpolantFactoryMethodLinear(e){return new _u(this.times,this.values,this.getValueSize(),e)}};Za.prototype.ValueTypeName="quaternion";Za.prototype.InterpolantFactoryMethodSmooth=void 0;var $r=class extends oi{constructor(e,t,i){super(e,t,i)}};$r.prototype.ValueTypeName="string";$r.prototype.ValueBufferType=Array;$r.prototype.DefaultInterpolation=Ia;$r.prototype.InterpolantFactoryMethodLinear=void 0;$r.prototype.InterpolantFactoryMethodSmooth=void 0;var Mu=class extends oi{constructor(e,t,i,r){super(e,t,i,r)}};Mu.prototype.ValueTypeName="vector";var Su=class{constructor(e,t,i){let r=this,s=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=i,this._abortController=null,this.itemStart=function(u){a++,s===!1&&r.onStart!==void 0&&r.onStart(u,o,a),s=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,d){return c.push(u,d),this},this.removeHandler=function(u){let d=c.indexOf(u);return d!==-1&&c.splice(d,2),this},this.getHandler=function(u){for(let d=0,h=c.length;d<h;d+=2){let f=c[d],g=c[d+1];if(f.global&&(f.lastIndex=0),f.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Tg=new Su,bu=class{constructor(e){this.manager=e!==void 0?e:Tg,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let i=this;return new Promise(function(r,s){i.load(e,r,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};bu.DEFAULT_MATERIAL_NAME="__DEFAULT";var Bc=new I,kc=new xi,Gi=new I,Ka=class extends qn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new vt,this.projectionMatrix=new vt,this.projectionMatrixInverse=new vt,this.coordinateSystem=Li,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Bc,kc,Gi),Gi.x===1&&Gi.y===1&&Gi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Bc,kc,Gi.set(1,1,1)).invert()}updateWorldMatrix(e,t,i=!1){super.updateWorldMatrix(e,t,i),this.matrixWorld.decompose(Bc,kc,Gi),Gi.x===1&&Gi.y===1&&Gi.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Bc,kc,Gi.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Vr=new I,k0=new nt,z0=new nt,Ln=class extends Ka{constructor(e=50,t=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=Qc*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Gc*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Qc*2*Math.atan(Math.tan(Gc*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,i){Vr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Vr.x,Vr.y).multiplyScalar(-e/Vr.z),Vr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Vr.x,Vr.y).multiplyScalar(-e/Vr.z)}getViewSize(e,t){return this.getViewBounds(e,k0,z0),t.subVectors(z0,k0)}setViewOffset(e,t,i,r,s,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Gc*.5*this.fov)/this.zoom,i=2*t,r=this.aspect*i,s=-.5*r,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,t-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,t,t-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}};var Sr=class extends Ka{constructor(e=-1,t=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=i-e,o=i+e,a=r+t,l=r-t;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}};var Ts=class extends an{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}};var _o=-90,Mo=1,wu=class extends qn{constructor(e,t,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new Ln(_o,Mo,e,t);r.layers=this.layers,this.add(r);let s=new Ln(_o,Mo,e,t);s.layers=this.layers,this.add(s);let o=new Ln(_o,Mo,e,t);o.layers=this.layers,this.add(o);let a=new Ln(_o,Mo,e,t);a.layers=this.layers,this.add(a);let l=new Ln(_o,Mo,e,t);l.layers=this.layers,this.add(l);let c=new Ln(_o,Mo,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[i,r,s,o,a,l]=t;for(let c of t)this.remove(c);if(e===Li)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===La)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,l,c,u]=this.children,d=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,s),e.setRenderTarget(i,1,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(i,2,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(i,3,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(i,4,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(t,u),e.setRenderTarget(d,h,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},Eu=class extends Ln{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var zd="\\[\\]\\.:\\/",p_=new RegExp("["+zd+"]","g"),Vd="[^"+zd+"]",m_="[^"+zd.replace("\\.","")+"]",g_=/((?:WC+[\/:])*)/.source.replace("WC",Vd),x_=/(WCOD+)?/.source.replace("WCOD",m_),v_=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Vd),y_=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Vd),__=new RegExp("^"+g_+x_+v_+y_+"$"),M_=["material","materials","bones","map"],dd=class{constructor(e,t,i){let r=i||jt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,r)}getValue(e,t){this.bind();let i=this._targetGroup.nCachedObjects_,r=this._bindings[i];r!==void 0&&r.getValue(e,t)}setValue(e,t){let i=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=i.length;r!==s;++r)i[r].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,i=e.length;t!==i;++t)e[t].unbind()}},jt=class n{constructor(e,t,i){this.path=t,this.parsedPath=i||n.parseTrackName(t),this.node=n.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,i){return e&&e.isAnimationObjectGroup?new n.Composite(e,t,i):new n(e,t,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(p_,"")}static parseTrackName(e){let t=__.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},r=i.nodeName&&i.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=i.nodeName.substring(r+1);M_.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,r),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(t);if(i!==void 0)return i}if(e.children){let i=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===t||a.uuid===t)return a;let l=i(a.children);if(l)return l}return null},r=i(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)e[t++]=i[r]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,i=t.objectName,r=t.propertyName,s=t.propertyIndex;if(e||(e=n.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){Ke("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=t.objectIndex;switch(i){case"materials":if(!e.material){tt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){tt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){tt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){tt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){tt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){tt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){tt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[r];if(o===void 0){let c=t.nodeName;tt("PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){tt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){tt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};jt.Composite=dd;jt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};jt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};jt.prototype.GetterByBindingType=[jt.prototype._getValue_direct,jt.prototype._getValue_array,jt.prototype._getValue_arrayElement,jt.prototype._getValue_toArray];jt.prototype.SetterByBindingTypeAndVersioning=[[jt.prototype._setValue_direct,jt.prototype._setValue_direct_setNeedsUpdate,jt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[jt.prototype._setValue_array,jt.prototype._setValue_array_setNeedsUpdate,jt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[jt.prototype._setValue_arrayElement,jt.prototype._setValue_arrayElement_setNeedsUpdate,jt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[jt.prototype._setValue_fromArray,jt.prototype._setValue_fromArray_setNeedsUpdate,jt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var UT=new Float32Array(1);var Io=class extends iu{constructor(e,t,i=1){super(e,t),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){let t=super.clone(e);return t.meshPerAttribute=this.meshPerAttribute,t}toJSON(e){let t=super.toJSON(e);return t.isInstancedInterleavedBuffer=!0,t.meshPerAttribute=this.meshPerAttribute,t}};var V0=new vt,Ja=class{constructor(e,t,i=0,r=1/0){this.ray=new yr(e,t),this.near=i,this.far=r,this.camera=null,this.layers=new Ao,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):tt("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return V0.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(V0),this}intersectObject(e,t=!0,i=[]){return pd(e,this,i,t),i.sort(G0),i}intersectObjects(e,t=!0,i=[]){for(let r=0,s=e.length;r<s;r++)pd(e[r],this,i,t);return i.sort(G0),i}};function G0(n,e){return n.distance-e.distance}function pd(n,e,t,i){let r=!0;if(n.layers.test(e.layers)&&n.raycast(e,t)===!1&&(r=!1),r===!0&&i===!0){let s=n.children;for(let o=0,a=s.length;o<a;o++)pd(s[o],e,t,!0)}}var $d=class $d{constructor(e,t,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let i=0;i<4;i++)this.elements[i]=e[i+t];return this}set(e,t,i,r){let s=this.elements;return s[0]=e,s[2]=t,s[1]=i,s[3]=r,this}};$d.prototype.isMatrix2=!0;var md=$d;function Gd(n,e,t,i){let r=S_(i);switch(t){case Dd:return n*e;case Nu:return n*e/r.components*r.byteLength;case Fu:return n*e/r.components*r.byteLength;case Kr:return n*e*2/r.components*r.byteLength;case Ou:return n*e*2/r.components*r.byteLength;case Nd:return n*e*3/r.components*r.byteLength;case An:return n*e*4/r.components*r.byteLength;case Uu:return n*e*4/r.components*r.byteLength;case il:case rl:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case sl:case ol:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ku:case Vu:return Math.max(n,16)*Math.max(e,8)/4;case Bu:case zu:return Math.max(n,8)*Math.max(e,8)/2;case Gu:case Hu:case Xu:case Yu:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*8;case Wu:case al:case $u:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case qu:return Math.floor((n+3)/4)*Math.floor((e+3)/4)*16;case ju:return Math.floor((n+4)/5)*Math.floor((e+3)/4)*16;case Zu:return Math.floor((n+4)/5)*Math.floor((e+4)/5)*16;case Ku:return Math.floor((n+5)/6)*Math.floor((e+4)/5)*16;case Ju:return Math.floor((n+5)/6)*Math.floor((e+5)/6)*16;case Qu:return Math.floor((n+7)/8)*Math.floor((e+4)/5)*16;case eh:return Math.floor((n+7)/8)*Math.floor((e+5)/6)*16;case th:return Math.floor((n+7)/8)*Math.floor((e+7)/8)*16;case nh:return Math.floor((n+9)/10)*Math.floor((e+4)/5)*16;case ih:return Math.floor((n+9)/10)*Math.floor((e+5)/6)*16;case rh:return Math.floor((n+9)/10)*Math.floor((e+7)/8)*16;case sh:return Math.floor((n+9)/10)*Math.floor((e+9)/10)*16;case oh:return Math.floor((n+11)/12)*Math.floor((e+9)/10)*16;case ah:return Math.floor((n+11)/12)*Math.floor((e+11)/12)*16;case lh:case ch:case uh:return Math.ceil(n/4)*Math.ceil(e/4)*16;case hh:case fh:return Math.ceil(n/4)*Math.ceil(e/4)*8;case ll:case dh:return Math.ceil(n/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function S_(n){switch(n){case li:case Cd:return{byteLength:1,components:1};case Do:case Id:case Nn:return{byteLength:2,components:1};case Lu:case Du:return{byteLength:2,components:4};case Ni:case Pu:case vi:return{byteLength:4,components:1};case Pd:case Ld:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?Ke("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function jg(){let n=null,e=!1,t=null,i=null;function r(s,o){i=n.requestAnimationFrame(r),t(s,o)}return{start:function(){e!==!0&&t!==null&&n!==null&&(i=n.requestAnimationFrame(r),e=!0)},stop:function(){n!==null&&n.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){t=s},setContext:function(s){n=s}}}function w_(n){let e=new WeakMap;function t(a,l){let c=a.array,u=a.usage,d=c.byteLength,h=n.createBuffer();n.bindBuffer(l,h),n.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=n.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=n.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=n.HALF_FLOAT:f=n.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=n.SHORT;else if(c instanceof Uint32Array)f=n.UNSIGNED_INT;else if(c instanceof Int32Array)f=n.INT;else if(c instanceof Int8Array)f=n.BYTE;else if(c instanceof Uint8Array)f=n.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:d}}function i(a,l,c){let u=l.array,d=l.updateRanges;if(n.bindBuffer(c,a),d.length===0)n.bufferSubData(c,0,u);else{d.sort((f,g)=>f.start-g.start);let h=0;for(let f=1;f<d.length;f++){let g=d[h],_=d[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++h,d[h]=_)}d.length=h+1;for(let f=0,g=d.length;f<g;f++){let _=d[f];n.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(n.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var E_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,A_=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,T_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,R_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,C_=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,I_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,P_=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,L_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,D_=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,N_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,F_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,O_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,U_=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,B_=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,k_=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,z_=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,V_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,G_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,H_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,W_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,X_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Y_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,$_=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,q_=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,j_=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Z_=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,K_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,J_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Q_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,eM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,tM="gl_FragColor = linearToOutputTexel( gl_FragColor );",nM=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,iM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,rM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,sM=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,oM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,aM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,lM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,cM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,uM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,hM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,fM=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,dM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,pM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,mM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,gM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,xM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,vM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,yM=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,_M=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,MM=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,SM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,bM=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,wM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,EM=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,AM=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,TM=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,RM=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,CM=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,IM=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,PM=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,LM=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,DM=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,NM=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,FM=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,OM=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,UM=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,BM=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,kM=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,zM=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,VM=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,GM=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,HM=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,WM=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,XM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,YM=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$M=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,qM=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,jM=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ZM=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,KM=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,JM=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,QM=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,eS=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,tS=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,nS=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,iS=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,rS=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,sS=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,oS=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,aS=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,lS=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,cS=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,uS=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,hS=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,fS=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,dS=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,pS=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,mS=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,gS=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,xS=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,vS=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,yS=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,_S=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,MS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,SS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,bS=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,wS=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,ES=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,AS=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,TS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,RS=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,CS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,IS=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,PS=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,LS=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,DS=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,NS=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,FS=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,OS=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,US=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,BS=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,kS=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,zS=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,VS=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,GS=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,HS=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,WS=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,XS=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,YS=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,$S=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qS=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jS=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,ZS=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,KS=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,JS=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,QS=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,eb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,tb=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,nb=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,ib=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,rb=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ut={alphahash_fragment:E_,alphahash_pars_fragment:A_,alphamap_fragment:T_,alphamap_pars_fragment:R_,alphatest_fragment:C_,alphatest_pars_fragment:I_,aomap_fragment:P_,aomap_pars_fragment:L_,batching_pars_vertex:D_,batching_vertex:N_,begin_vertex:F_,beginnormal_vertex:O_,bsdfs:U_,iridescence_fragment:B_,bumpmap_pars_fragment:k_,clipping_planes_fragment:z_,clipping_planes_pars_fragment:V_,clipping_planes_pars_vertex:G_,clipping_planes_vertex:H_,color_fragment:W_,color_pars_fragment:X_,color_pars_vertex:Y_,color_vertex:$_,common:q_,cube_uv_reflection_fragment:j_,defaultnormal_vertex:Z_,displacementmap_pars_vertex:K_,displacementmap_vertex:J_,emissivemap_fragment:Q_,emissivemap_pars_fragment:eM,colorspace_fragment:tM,colorspace_pars_fragment:nM,envmap_fragment:iM,envmap_common_pars_fragment:rM,envmap_pars_fragment:sM,envmap_pars_vertex:oM,envmap_physical_pars_fragment:xM,envmap_vertex:aM,fog_vertex:lM,fog_pars_vertex:cM,fog_fragment:uM,fog_pars_fragment:hM,gradientmap_pars_fragment:fM,lightmap_pars_fragment:dM,lights_lambert_fragment:pM,lights_lambert_pars_fragment:mM,lights_pars_begin:gM,lights_toon_fragment:vM,lights_toon_pars_fragment:yM,lights_phong_fragment:_M,lights_phong_pars_fragment:MM,lights_physical_fragment:SM,lights_physical_pars_fragment:bM,lights_fragment_begin:wM,lights_fragment_maps:EM,lights_fragment_end:AM,lightprobes_pars_fragment:TM,logdepthbuf_fragment:RM,logdepthbuf_pars_fragment:CM,logdepthbuf_pars_vertex:IM,logdepthbuf_vertex:PM,map_fragment:LM,map_pars_fragment:DM,map_particle_fragment:NM,map_particle_pars_fragment:FM,metalnessmap_fragment:OM,metalnessmap_pars_fragment:UM,morphinstance_vertex:BM,morphcolor_vertex:kM,morphnormal_vertex:zM,morphtarget_pars_vertex:VM,morphtarget_vertex:GM,normal_fragment_begin:HM,normal_fragment_maps:WM,normal_pars_fragment:XM,normal_pars_vertex:YM,normal_vertex:$M,normalmap_pars_fragment:qM,clearcoat_normal_fragment_begin:jM,clearcoat_normal_fragment_maps:ZM,clearcoat_pars_fragment:KM,iridescence_pars_fragment:JM,opaque_fragment:QM,packing:eS,premultiplied_alpha_fragment:tS,project_vertex:nS,dithering_fragment:iS,dithering_pars_fragment:rS,roughnessmap_fragment:sS,roughnessmap_pars_fragment:oS,shadowmap_pars_fragment:aS,shadowmap_pars_vertex:lS,shadowmap_vertex:cS,shadowmask_pars_fragment:uS,skinbase_vertex:hS,skinning_pars_vertex:fS,skinning_vertex:dS,skinnormal_vertex:pS,specularmap_fragment:mS,specularmap_pars_fragment:gS,tonemapping_fragment:xS,tonemapping_pars_fragment:vS,transmission_fragment:yS,transmission_pars_fragment:_S,uv_pars_fragment:MS,uv_pars_vertex:SS,uv_vertex:bS,worldpos_vertex:wS,background_vert:ES,background_frag:AS,backgroundCube_vert:TS,backgroundCube_frag:RS,cube_vert:CS,cube_frag:IS,depth_vert:PS,depth_frag:LS,distance_vert:DS,distance_frag:NS,equirect_vert:FS,equirect_frag:OS,linedashed_vert:US,linedashed_frag:BS,meshbasic_vert:kS,meshbasic_frag:zS,meshlambert_vert:VS,meshlambert_frag:GS,meshmatcap_vert:HS,meshmatcap_frag:WS,meshnormal_vert:XS,meshnormal_frag:YS,meshphong_vert:$S,meshphong_frag:qS,meshphysical_vert:jS,meshphysical_frag:ZS,meshtoon_vert:KS,meshtoon_frag:JS,points_vert:QS,points_frag:eb,shadow_vert:tb,shadow_frag:nb,sprite_vert:ib,sprite_frag:rb},we={common:{diffuse:{value:new gt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new at},alphaMap:{value:null},alphaMapTransform:{value:new at},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new at}},envmap:{envMap:{value:null},envMapRotation:{value:new at},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new at}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new at}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new at},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new at},normalScale:{value:new nt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new at},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new at}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new at}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new at}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new gt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new I},probesMax:{value:new I},probesResolution:{value:new I}},points:{diffuse:{value:new gt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new at},alphaTest:{value:0},uvTransform:{value:new at}},sprite:{diffuse:{value:new gt(16777215)},opacity:{value:1},center:{value:new nt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new at},alphaMap:{value:null},alphaMapTransform:{value:new at},alphaTest:{value:0}}},Ki={basic:{uniforms:Fn([we.common,we.specularmap,we.envmap,we.aomap,we.lightmap,we.fog]),vertexShader:ut.meshbasic_vert,fragmentShader:ut.meshbasic_frag},lambert:{uniforms:Fn([we.common,we.specularmap,we.envmap,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.fog,we.lights,{emissive:{value:new gt(0)},envMapIntensity:{value:1}}]),vertexShader:ut.meshlambert_vert,fragmentShader:ut.meshlambert_frag},phong:{uniforms:Fn([we.common,we.specularmap,we.envmap,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.fog,we.lights,{emissive:{value:new gt(0)},specular:{value:new gt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ut.meshphong_vert,fragmentShader:ut.meshphong_frag},standard:{uniforms:Fn([we.common,we.envmap,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.roughnessmap,we.metalnessmap,we.fog,we.lights,{emissive:{value:new gt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ut.meshphysical_vert,fragmentShader:ut.meshphysical_frag},toon:{uniforms:Fn([we.common,we.aomap,we.lightmap,we.emissivemap,we.bumpmap,we.normalmap,we.displacementmap,we.gradientmap,we.fog,we.lights,{emissive:{value:new gt(0)}}]),vertexShader:ut.meshtoon_vert,fragmentShader:ut.meshtoon_frag},matcap:{uniforms:Fn([we.common,we.bumpmap,we.normalmap,we.displacementmap,we.fog,{matcap:{value:null}}]),vertexShader:ut.meshmatcap_vert,fragmentShader:ut.meshmatcap_frag},points:{uniforms:Fn([we.points,we.fog]),vertexShader:ut.points_vert,fragmentShader:ut.points_frag},dashed:{uniforms:Fn([we.common,we.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ut.linedashed_vert,fragmentShader:ut.linedashed_frag},depth:{uniforms:Fn([we.common,we.displacementmap]),vertexShader:ut.depth_vert,fragmentShader:ut.depth_frag},normal:{uniforms:Fn([we.common,we.bumpmap,we.normalmap,we.displacementmap,{opacity:{value:1}}]),vertexShader:ut.meshnormal_vert,fragmentShader:ut.meshnormal_frag},sprite:{uniforms:Fn([we.sprite,we.fog]),vertexShader:ut.sprite_vert,fragmentShader:ut.sprite_frag},background:{uniforms:{uvTransform:{value:new at},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ut.background_vert,fragmentShader:ut.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new at}},vertexShader:ut.backgroundCube_vert,fragmentShader:ut.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ut.cube_vert,fragmentShader:ut.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ut.equirect_vert,fragmentShader:ut.equirect_frag},distance:{uniforms:Fn([we.common,we.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ut.distance_vert,fragmentShader:ut.distance_frag},shadow:{uniforms:Fn([we.lights,we.fog,{color:{value:new gt(0)},opacity:{value:1}}]),vertexShader:ut.shadow_vert,fragmentShader:ut.shadow_frag}};Ki.physical={uniforms:Fn([Ki.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new at},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new at},clearcoatNormalScale:{value:new nt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new at},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new at},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new at},sheen:{value:0},sheenColor:{value:new gt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new at},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new at},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new at},transmissionSamplerSize:{value:new nt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new at},attenuationDistance:{value:0},attenuationColor:{value:new gt(0)},specularColor:{value:new gt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new at},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new at},anisotropyVector:{value:new nt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new at}}]),vertexShader:ut.meshphysical_vert,fragmentShader:ut.meshphysical_frag};var gh={r:0,b:0,g:0},sb=new vt,Zg=new at;Zg.set(-1,0,0,0,1,0,0,0,1);function ob(n,e,t,i,r,s){let o=new gt(0),a=r===!0?0:1,l,c,u=null,d=0,h=null;function f(S){let b=S.isScene===!0?S.background:null;if(b&&b.isTexture){let y=S.backgroundBlurriness>0;b=e.get(b,y)}return b}function g(S){let b=!1,y=f(S);y===null?m(o,a):y&&y.isColor&&(m(y,1),b=!0);let A=n.xr.getEnvironmentBlendMode();A==="additive"?t.buffers.color.setClear(0,0,0,1,s):A==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,s),(n.autoClear||b)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function _(S,b){let y=f(b);y&&(y.isCubeTexture||y.mapping===tl)?(c===void 0&&(c=new Lt(new Co(1,1,1),new bt({name:"BackgroundCubeMaterial",uniforms:Is(Ki.backgroundCube.uniforms),vertexShader:Ki.backgroundCube.vertexShader,fragmentShader:Ki.backgroundCube.fragmentShader,side:Hn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(A,T,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=b.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(sb.makeRotationFromEuler(b.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Zg),c.material.toneMapped=ft.getTransfer(y.colorSpace)!==It,(u!==y||d!==y.version||h!==n.toneMapping)&&(c.material.needsUpdate=!0,u=y,d=y.version,h=n.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new Lt(new Mr(2,2),new bt({name:"BackgroundMaterial",uniforms:Is(Ki.background.uniforms),vertexShader:Ki.background.vertexShader,fragmentShader:Ki.background.fragmentShader,side:qi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=b.backgroundIntensity,l.material.toneMapped=ft.getTransfer(y.colorSpace)!==It,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(u!==y||d!==y.version||h!==n.toneMapping)&&(l.material.needsUpdate=!0,u=y,d=y.version,h=n.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function m(S,b){S.getRGB(gh,kd(n)),t.buffers.color.setClear(gh.r,gh.g,gh.b,b,s)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(S,b=1){o.set(S),a=b,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(S){a=S,m(o,a)},render:g,addToRenderList:_,dispose:p}}function ab(n,e){let t=n.getParameter(n.MAX_VERTEX_ATTRIBS),i={},r=h(null),s=r,o=!1;function a(D,O,z,N,V){let Z=!1,X=d(D,N,z,O);s!==X&&(s=X,c(s.object)),Z=f(D,N,z,V),Z&&g(D,N,z,V),V!==null&&e.update(V,n.ELEMENT_ARRAY_BUFFER),(Z||o)&&(o=!1,y(D,O,z,N),V!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return n.createVertexArray()}function c(D){return n.bindVertexArray(D)}function u(D){return n.deleteVertexArray(D)}function d(D,O,z,N){let V=N.wireframe===!0,Z=i[O.id];Z===void 0&&(Z={},i[O.id]=Z);let X=D.isInstancedMesh===!0?D.id:0,K=Z[X];K===void 0&&(K={},Z[X]=K);let q=K[z.id];q===void 0&&(q={},K[z.id]=q);let J=q[V];return J===void 0&&(J=h(l()),q[V]=J),J}function h(D){let O=[],z=[],N=[];for(let V=0;V<t;V++)O[V]=0,z[V]=0,N[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:z,attributeDivisors:N,object:D,attributes:{},index:null}}function f(D,O,z,N){let V=s.attributes,Z=O.attributes,X=0,K=z.getAttributes();for(let q in K)if(K[q].location>=0){let te=V[q],Be=Z[q];if(Be===void 0&&(q==="instanceMatrix"&&D.instanceMatrix&&(Be=D.instanceMatrix),q==="instanceColor"&&D.instanceColor&&(Be=D.instanceColor)),te===void 0||te.attribute!==Be||Be&&te.data!==Be.data)return!0;X++}return s.attributesNum!==X||s.index!==N}function g(D,O,z,N){let V={},Z=O.attributes,X=0,K=z.getAttributes();for(let q in K)if(K[q].location>=0){let te=Z[q];te===void 0&&(q==="instanceMatrix"&&D.instanceMatrix&&(te=D.instanceMatrix),q==="instanceColor"&&D.instanceColor&&(te=D.instanceColor));let Be={};Be.attribute=te,te&&te.data&&(Be.data=te.data),V[q]=Be,X++}s.attributes=V,s.attributesNum=X,s.index=N}function _(){let D=s.newAttributes;for(let O=0,z=D.length;O<z;O++)D[O]=0}function m(D){p(D,0)}function p(D,O){let z=s.newAttributes,N=s.enabledAttributes,V=s.attributeDivisors;z[D]=1,N[D]===0&&(n.enableVertexAttribArray(D),N[D]=1),V[D]!==O&&(n.vertexAttribDivisor(D,O),V[D]=O)}function S(){let D=s.newAttributes,O=s.enabledAttributes;for(let z=0,N=O.length;z<N;z++)O[z]!==D[z]&&(n.disableVertexAttribArray(z),O[z]=0)}function b(D,O,z,N,V,Z,X){X===!0?n.vertexAttribIPointer(D,O,z,V,Z):n.vertexAttribPointer(D,O,z,N,V,Z)}function y(D,O,z,N){_();let V=N.attributes,Z=z.getAttributes(),X=O.defaultAttributeValues;for(let K in Z){let q=Z[K];if(q.location>=0){let J=V[K];if(J===void 0&&(K==="instanceMatrix"&&D.instanceMatrix&&(J=D.instanceMatrix),K==="instanceColor"&&D.instanceColor&&(J=D.instanceColor)),J!==void 0){let te=J.normalized,Be=J.itemSize,Le=e.get(J);if(Le===void 0)continue;let dt=Le.buffer,ot=Le.type,rt=Le.bytesPerElement,Y=ot===n.INT||ot===n.UNSIGNED_INT||J.gpuType===Pu;if(J.isInterleavedBufferAttribute){let Q=J.data,ge=Q.stride,qe=J.offset;if(Q.isInstancedInterleavedBuffer){for(let Se=0;Se<q.locationSize;Se++)p(q.location+Se,Q.meshPerAttribute);D.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let Se=0;Se<q.locationSize;Se++)m(q.location+Se);n.bindBuffer(n.ARRAY_BUFFER,dt);for(let Se=0;Se<q.locationSize;Se++)b(q.location+Se,Be/q.locationSize,ot,te,ge*rt,(qe+Be/q.locationSize*Se)*rt,Y)}else{if(J.isInstancedBufferAttribute){for(let Q=0;Q<q.locationSize;Q++)p(q.location+Q,J.meshPerAttribute);D.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let Q=0;Q<q.locationSize;Q++)m(q.location+Q);n.bindBuffer(n.ARRAY_BUFFER,dt);for(let Q=0;Q<q.locationSize;Q++)b(q.location+Q,Be/q.locationSize,ot,te,Be*rt,Be/q.locationSize*Q*rt,Y)}}else if(X!==void 0){let te=X[K];if(te!==void 0)switch(te.length){case 2:n.vertexAttrib2fv(q.location,te);break;case 3:n.vertexAttrib3fv(q.location,te);break;case 4:n.vertexAttrib4fv(q.location,te);break;default:n.vertexAttrib1fv(q.location,te)}}}}S()}function A(){w();for(let D in i){let O=i[D];for(let z in O){let N=O[z];for(let V in N){let Z=N[V];for(let X in Z)u(Z[X].object),delete Z[X];delete N[V]}}delete i[D]}}function T(D){if(i[D.id]===void 0)return;let O=i[D.id];for(let z in O){let N=O[z];for(let V in N){let Z=N[V];for(let X in Z)u(Z[X].object),delete Z[X];delete N[V]}}delete i[D.id]}function R(D){for(let O in i){let z=i[O];for(let N in z){let V=z[N];if(V[D.id]===void 0)continue;let Z=V[D.id];for(let X in Z)u(Z[X].object),delete Z[X];delete V[D.id]}}}function x(D){for(let O in i){let z=i[O],N=D.isInstancedMesh===!0?D.id:0,V=z[N];if(V!==void 0){for(let Z in V){let X=V[Z];for(let K in X)u(X[K].object),delete X[K];delete V[Z]}delete z[N],Object.keys(z).length===0&&delete i[O]}}}function w(){C(),o=!0,s!==r&&(s=r,c(s.object))}function C(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:w,resetDefaultState:C,dispose:A,releaseStatesOfGeometry:T,releaseStatesOfObject:x,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:m,disableUnusedAttributes:S}}function lb(n,e,t){let i;function r(l){i=l}function s(l,c){n.drawArrays(i,l,c),t.update(c,i,1)}function o(l,c,u){u!==0&&(n.drawArraysInstanced(i,l,c,u),t.update(c,i,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let h=0;for(let f=0;f<u;f++)h+=c[f];t.update(h,i,1)}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a}function cb(n,e,t,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let R=e.get("EXT_texture_filter_anisotropic");r=n.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(R){return!(R!==An&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){let x=R===Nn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==li&&R!==vi&&!x&&i.convert(R)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE))}function l(R){if(R==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp",u=l(c);u!==c&&(Ke("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let d=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&h===!1&&Ke("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),g=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=n.getParameter(n.MAX_TEXTURE_SIZE),m=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),p=n.getParameter(n.MAX_VERTEX_ATTRIBS),S=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),b=n.getParameter(n.MAX_VARYING_VECTORS),y=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),A=n.getParameter(n.MAX_SAMPLES),T=n.getParameter(n.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:S,maxVaryings:b,maxFragmentUniforms:y,maxSamples:A,samples:T}}function ub(n){let e=this,t=null,i=0,r=!1,s=!1,o=new Pi,a=new at,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(d,h){let f=d.length!==0||h||i!==0||r;return r=h,i=d.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(d,h){t=u(d,h,0)},this.setState=function(d,h,f){let g=d.clippingPlanes,_=d.clipIntersection,m=d.clipShadows,p=n.get(d);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{let S=s?0:i,b=S*4,y=p.clippingState||null;l.value=y,y=u(g,h,b,f);for(let A=0;A!==b;++A)y[A]=t[A];p.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(d,h,f,g){let _=d!==null?d.length:0,m=null;if(_!==0){if(m=l.value,g!==!0||m===null){let p=f+_*4,S=h.matrixWorldInverse;a.getNormalMatrix(S),(m===null||m.length<p)&&(m=new Float32Array(p));for(let b=0,y=f;b!==_;++b,y+=4)o.copy(d[b]).applyMatrix4(S,a),o.normal.toArray(m,y),m[y+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}var Oo=4,hb=6,fb=20,db=256,cl=new Sr,Rg=new gt,qd=null,jd=0,Zd=0,Kd=!1,pb=new I,Ps=new I,vh=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,i=.1,r=100,s={}){let{size:o=256,position:a=pb}=s;qd=this._renderer.getRenderTarget(),jd=this._renderer.getActiveCubeFace(),Zd=this._renderer.getActiveMipmapLevel(),Kd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,a),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Pg(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ig(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(qd,jd,Zd),this._renderer.xr.enabled=Kd,e.scissorTest=!1,Fo(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===qr||e.mapping===Cs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),qd=this._renderer.getRenderTarget(),jd=this._renderer.getActiveCubeFace(),Zd=this._renderer.getActiveMipmapLevel(),Kd=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=t||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,i={magFilter:yt,minFilter:yt,generateMipmaps:!1,type:Nn,format:An,colorSpace:Es,depthBuffer:!1},r=Cg(e,t,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Cg(e,t,i);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=mb(s)),this._blurMaterial=xb(s,e,t),this._ggxMaterial=gb(s,e,t)}return r}_compileMaterial(e){let t=new Lt(new an,e);this._renderer.compile(t,cl)}_sceneToCubeUV(e,t,i,r,s){let l=new Ln(90,1,t,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],d=this._renderer,h=d.autoClear,f=d.toneMapping;d.getClearColor(Rg),d.toneMapping=ai,d.autoClear=!1,d.state.buffers.depth.getReversed()&&(d.setRenderTarget(r),d.clearDepth(),d.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Lt(new Co,new Ba({name:"PMREM.Background",side:Hn,depthWrite:!1,depthTest:!1})));let _=this._backgroundBox,m=_.material,p=!1,S=e.background;S?S.isColor&&(m.color.copy(S),e.background=null,p=!0):(m.color.copy(Rg),p=!0);for(let b=0;b<6;b++){let y=b%3;y===0?(l.up.set(0,c[b],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[b],s.y,s.z)):y===1?(l.up.set(0,0,c[b]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[b],s.z)):(l.up.set(0,c[b],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[b]));let A=this._cubeSize;Fo(r,y*A,b>2?A:0,A,A),d.setRenderTarget(r),p&&d.render(_,l),d.render(e,l)}d.toneMapping=f,d.autoClear=h,e.background=S}_textureToCubeUV(e,t){let i=this._renderer,r=e.mapping===qr||e.mapping===Cs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Pg()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ig());let s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;let a=s.uniforms;a.envMap.value=e;let l=this._cubeSize;Fo(t,0,0,3*l,2*l),i.setRenderTarget(t),i.render(o,cl)}_applyPMREM(e){let t=this._renderer,i=t.autoClear;t.autoClear=!1;let r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);t.autoClear=i}_applyGGXFilter(e,t,i){let r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;let l=o.uniforms,c=i/(this._lodMeshes.length-1),u=t/(this._lodMeshes.length-1),d=Math.sqrt(c*c-u*u),h=c*1.25,f=d*h,{_lodMax:g}=this,_=this._sizeLods[i],m=3*_*(i>g-Oo?i-g+Oo:0),p=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=g-t,Fo(s,m,p,3*_,2*_),r.setRenderTarget(s),r.render(a,cl),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=g-i,Fo(e,m,p,3*_,2*_),r.setRenderTarget(e),r.render(a,cl)}_blur(e,t,i,r){let s=this._pingPongRenderTarget,o=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,s,t,i,o),this._blurPass(s,e,i,i,o)}_blurPass(e,t,i,r,s){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[r];l.material=a;let c=a.uniforms;c.envMap.value=e.texture,c.sigma.value=s,c.mipInt.value=this._lodMax-i;let u=this._sizeLods[r],d=3*u*(r>this._lodMax-Oo?r-this._lodMax+Oo:0),h=4*(this._cubeSize-u);Fo(t,d,h,3*u,2*u),o.setRenderTarget(t),o.render(l,cl)}};function mb(n){let e=[],t=[],i=n,r=n-Oo+1+hb;for(let s=0;s<r;s++){let o=Math.pow(2,i);e.push(o);let a=1/(o-2),l=-a,c=1+a,u=[l,l,c,l,c,c,l,l,c,c,l,c],d=6,h=6,f=3,g=new Float32Array(f*h*d),_=new Float32Array(f*h*d);for(let p=0;p<d;p++){let S=p%3*2/3-1,b=p>2?0:-1,y=[S,b,0,S+2/3,b,0,S+2/3,b+1,0,S,b,0,S+2/3,b+1,0,S,b+1,0];g.set(y,f*h*p);for(let A=0;A<h;A++){let T=u[A*2]*2-1,R=u[A*2+1]*2-1;p===0?Ps.set(1,R,T):p===1?Ps.set(-T,1,-R):p===2?Ps.set(-T,R,1):p===3?Ps.set(-1,R,-T):p===4?Ps.set(-T,-1,R):Ps.set(T,R,-1),Ps.toArray(_,(p*h+A)*f)}}let m=new an;m.setAttribute("position",new Xt(g,f)),m.setAttribute("outputDirection",new Xt(_,f)),t.push(new Lt(m,null)),i>Oo&&i--}return{lodMeshes:t,sizeLods:e}}function Cg(n,e,t){let i=new gn(n,e,t);return i.texture.mapping=tl,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Fo(n,e,t,i,r){n.viewport.set(e,t,i,r),n.scissor.set(e,t,i,r)}function gb(n,e,t){return new bt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:db,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Mh(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:jn,depthTest:!1,depthWrite:!1})}function xb(n,e,t){return new bt({name:"SphericalGaussianBlur",defines:{SAMPLES:fb,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Mh(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:jn,depthTest:!1,depthWrite:!1})}function Ig(){return new bt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Mh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:jn,depthTest:!1,depthWrite:!1})}function Pg(){return new bt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Mh(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:jn,depthTest:!1,depthWrite:!1})}function Mh(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var yh=class extends gn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Wa(r),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Co(5,5,5),s=new bt({name:"CubemapFromEquirect",uniforms:Is(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Hn,blending:jn});s.uniforms.tEquirect.value=t;let o=new Lt(r,s),a=t.minFilter;return t.minFilter===jr&&(t.minFilter=yt),new wu(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,i=!0,r=!0){let s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,i,r);e.setRenderTarget(s)}};function vb(n){let e=new WeakMap,t=new WeakMap,i=null;function r(h,f=!1){return h==null?null:f?o(h):s(h)}function s(h){if(h&&h.isTexture){let f=h.mapping;if(f===Ru||f===Cu)if(e.has(h)){let g=e.get(h).texture;return a(g,h.mapping)}else{let g=h.image;if(g&&g.height>0){let _=new yh(g.height);return _.fromEquirectangularTexture(n,h),e.set(h,_),h.addEventListener("dispose",c),a(_.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture){let f=h.mapping,g=f===Ru||f===Cu,_=f===qr||f===Cs;if(g||_){let m=t.get(h),p=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return i===null&&(i=new vh(n)),m=g?i.fromEquirectangular(h,m):i.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),m.texture;if(m!==void 0)return m.texture;{let S=h.image;return g&&S&&S.height>0||_&&S&&l(S)?(i===null&&(i=new vh(n)),m=g?i.fromEquirectangular(h):i.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,t.set(h,m),h.addEventListener("dispose",u),m.texture):null}}}return h}function a(h,f){return f===Ru?h.mapping=qr:f===Cu&&(h.mapping=Cs),h}function l(h){let f=0,g=6;for(let _=0;_<g;_++)h[_]!==void 0&&f++;return f===g}function c(h){let f=h.target;f.removeEventListener("dispose",c);let g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function u(h){let f=h.target;f.removeEventListener("dispose",u);let g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function d(){e=new WeakMap,t=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:d}}function yb(n){let e={};function t(i){if(e[i]!==void 0)return e[i];let r=n.getExtension(i);return e[i]=r,r}return{has:function(i){return t(i)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(i){let r=t(i);return r===null&&ws("WebGLRenderer: "+i+" extension not supported."),r}}}function _b(n,e,t,i){let r={},s=new WeakMap;function o(d){let h=d.target;h.index!==null&&e.remove(h.index);for(let g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",o),delete r[h.id];let f=s.get(h);f&&(e.remove(f),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function a(d,h){return r[h.id]===!0||(h.addEventListener("dispose",o),r[h.id]=!0,t.memory.geometries++),h}function l(d){let h=d.attributes;for(let f in h)e.update(h[f],n.ARRAY_BUFFER)}function c(d){let h=[],f=d.index,g=d.attributes.position,_=0;if(g===void 0)return;if(f!==null){let S=f.array;_=f.version;for(let b=0,y=S.length;b<y;b+=3){let A=S[b+0],T=S[b+1],R=S[b+2];h.push(A,T,T,R,R,A)}}else{let S=g.array;_=g.version;for(let b=0,y=S.length/3-1;b<y;b+=3){let A=b+0,T=b+1,R=b+2;h.push(A,T,T,R,R,A)}}let m=new(g.count>=65535?Ua:Oa)(h,1);m.version=_;let p=s.get(d);p&&e.remove(p),s.set(d,m)}function u(d){let h=s.get(d);if(h){let f=d.index;f!==null&&h.version<f.version&&c(d)}else c(d);return s.get(d)}return{get:a,update:l,getWireframeAttribute:u}}function Mb(n,e,t){let i;function r(d){i=d}let s,o;function a(d){s=d.type,o=d.bytesPerElement}function l(d,h){n.drawElements(i,h,s,d*o),t.update(h,i,1)}function c(d,h,f){f!==0&&(n.drawElementsInstanced(i,h,s,d*o,f),t.update(h,i,f))}function u(d,h,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,s,d,0,f);let _=0;for(let m=0;m<f;m++)_+=h[m];t.update(_,i,1)}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function Sb(n){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(t.calls++,o){case n.TRIANGLES:t.triangles+=a*(s/3);break;case n.LINES:t.lines+=a*(s/2);break;case n.LINE_STRIP:t.lines+=a*(s-1);break;case n.LINE_LOOP:t.lines+=a*s;break;case n.POINTS:t.points+=a*s;break;default:tt("WebGLInfo: Unknown draw mode:",o);break}}function r(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:r,update:i}}function bb(n,e,t){let i=new WeakMap,r=new Gt;function s(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=u!==void 0?u.length:0,h=i.get(a);if(h===void 0||h.count!==d){let w=function(){R.dispose(),i.delete(a),a.removeEventListener("dispose",w)};h!==void 0&&h.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],S=a.morphAttributes.color||[],b=0;f===!0&&(b=1),g===!0&&(b=2),_===!0&&(b=3);let y=a.attributes.position.count*b,A=1;y>e.maxTextureSize&&(A=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);let T=new Float32Array(y*A*4*d),R=new Fa(T,y,A,d);R.type=vi,R.needsUpdate=!0;let x=b*4;for(let C=0;C<d;C++){let D=m[C],O=p[C],z=S[C],N=y*A*4*C;for(let V=0;V<D.count;V++){let Z=V*x;f===!0&&(r.fromBufferAttribute(D,V),T[N+Z+0]=r.x,T[N+Z+1]=r.y,T[N+Z+2]=r.z,T[N+Z+3]=0),g===!0&&(r.fromBufferAttribute(O,V),T[N+Z+4]=r.x,T[N+Z+5]=r.y,T[N+Z+6]=r.z,T[N+Z+7]=0),_===!0&&(r.fromBufferAttribute(z,V),T[N+Z+8]=r.x,T[N+Z+9]=r.y,T[N+Z+10]=r.z,T[N+Z+11]=z.itemSize===4?r.w:1)}}h={count:d,texture:R,size:new nt(y,A)},i.set(a,h),a.addEventListener("dispose",w)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(n,"morphTexture",o.morphTexture,t);else{let f=0;for(let _=0;_<c.length;_++)f+=c[_];let g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(n,"morphTargetBaseInfluence",g),l.getUniforms().setValue(n,"morphTargetInfluences",c)}l.getUniforms().setValue(n,"morphTargetsTexture",h.texture,t),l.getUniforms().setValue(n,"morphTargetsTextureSize",h.size)}return{update:s}}function wb(n,e,t,i,r){let s=new WeakMap;function o(c){let u=r.render.frame,d=c.geometry,h=e.get(c,d);if(s.get(h)!==u&&(e.update(h),s.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(t.update(c.instanceMatrix,n.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,n.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==u&&(f.update(),s.set(f,u))}return h}function a(){s=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),t.remove(u.instanceMatrix),u.instanceColor!==null&&t.remove(u.instanceColor)}return{update:o,dispose:a}}var Eb={[Md]:"LINEAR_TONE_MAPPING",[Sd]:"REINHARD_TONE_MAPPING",[bd]:"CINEON_TONE_MAPPING",[wd]:"ACES_FILMIC_TONE_MAPPING",[Ad]:"AGX_TONE_MAPPING",[Td]:"NEUTRAL_TONE_MAPPING",[Ed]:"CUSTOM_TONE_MAPPING"};function Ab(n,e,t,i,r,s){let o=new gn(e,t,{type:n,depthBuffer:r,stencilBuffer:s,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new an;c.setAttribute("position",new Pt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Pt([0,2,0,0,2,0],2));let u=new hu({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new Lt(c,u),h=new Sr(-1,1,1,-1,0,1),f=null,g=null,_=!1,m,p=null,S=[],b=!1;this.setSize=function(y,A){o.setSize(y,A),a!==null&&a.setSize(y,A),l!==null&&l.setSize(y,A);for(let T=0;T<S.length;T++){let R=S[T];R.setSize&&R.setSize(y,A)}},this.setEffects=function(y){S=y,b=S.length>0&&S[0].isRenderPass===!0;let A=o.width,T=o.height;S.length>0&&a===null&&(a=new gn(A,T,{type:Nn,depthBuffer:!1,stencilBuffer:!1}),l=new gn(A,T,{type:Nn,depthBuffer:!1,stencilBuffer:!1}));for(let R=0;R<S.length;R++){let x=S[R];x.setSize&&x.setSize(A,T)}},this.begin=function(y,A){if(_||y.toneMapping===ai&&S.length===0)return!1;if(p=A,A!==null){let T=A.width,R=A.height;(o.width!==T||o.height!==R)&&this.setSize(T,R)}return b===!1&&y.setRenderTarget(o),m=y.toneMapping,y.toneMapping=ai,!0},this.hasRenderPass=function(){return b},this.end=function(y,A){y.toneMapping=m,_=!0;let T=o,R=a;for(let x=0;x<S.length;x++){let w=S[x];w.enabled!==!1&&(w.render(y,R,T,A),w.needsSwap!==!1&&(T=R,R=R===a?l:a))}if(f!==y.outputColorSpace||g!==y.toneMapping){f=y.outputColorSpace,g=y.toneMapping,u.defines={},ft.getTransfer(f)===It&&(u.defines.SRGB_TRANSFER="");let x=Eb[g];x&&(u.defines[x]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=T.texture,y.setRenderTarget(p),y.render(d,h),p=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var Kg=new Vn,ep=new Wr(1,1),Jg=new Fa,Qg=new nu,ex=new Wa,Lg=[],Dg=[],Ng=new Float32Array(16),Fg=new Float32Array(9),Og=new Float32Array(4);function Bo(n,e,t){let i=n[0];if(i<=0||i>0)return n;let r=e*t,s=Lg[r];if(s===void 0&&(s=new Float32Array(r),Lg[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=t,n[o].toArray(s,a)}return s}function vn(n,e){if(n.length!==e.length)return!1;for(let t=0,i=n.length;t<i;t++)if(n[t]!==e[t])return!1;return!0}function yn(n,e){for(let t=0,i=e.length;t<i;t++)n[t]=e[t]}function Sh(n,e){let t=Dg[e];t===void 0&&(t=new Int32Array(e),Dg[e]=t);for(let i=0;i!==e;++i)t[i]=n.allocateTextureUnit();return t}function Tb(n,e){let t=this.cache;t[0]!==e&&(n.uniform1f(this.addr,e),t[0]=e)}function Rb(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vn(t,e))return;n.uniform2fv(this.addr,e),yn(t,e)}}function Cb(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(n.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(vn(t,e))return;n.uniform3fv(this.addr,e),yn(t,e)}}function Ib(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vn(t,e))return;n.uniform4fv(this.addr,e),yn(t,e)}}function Pb(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(vn(t,e))return;n.uniformMatrix2fv(this.addr,!1,e),yn(t,e)}else{if(vn(t,i))return;Og.set(i),n.uniformMatrix2fv(this.addr,!1,Og),yn(t,i)}}function Lb(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(vn(t,e))return;n.uniformMatrix3fv(this.addr,!1,e),yn(t,e)}else{if(vn(t,i))return;Fg.set(i),n.uniformMatrix3fv(this.addr,!1,Fg),yn(t,i)}}function Db(n,e){let t=this.cache,i=e.elements;if(i===void 0){if(vn(t,e))return;n.uniformMatrix4fv(this.addr,!1,e),yn(t,e)}else{if(vn(t,i))return;Ng.set(i),n.uniformMatrix4fv(this.addr,!1,Ng),yn(t,i)}}function Nb(n,e){let t=this.cache;t[0]!==e&&(n.uniform1i(this.addr,e),t[0]=e)}function Fb(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vn(t,e))return;n.uniform2iv(this.addr,e),yn(t,e)}}function Ob(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vn(t,e))return;n.uniform3iv(this.addr,e),yn(t,e)}}function Ub(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vn(t,e))return;n.uniform4iv(this.addr,e),yn(t,e)}}function Bb(n,e){let t=this.cache;t[0]!==e&&(n.uniform1ui(this.addr,e),t[0]=e)}function kb(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(n.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vn(t,e))return;n.uniform2uiv(this.addr,e),yn(t,e)}}function zb(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(n.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vn(t,e))return;n.uniform3uiv(this.addr,e),yn(t,e)}}function Vb(n,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(n.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vn(t,e))return;n.uniform4uiv(this.addr,e),yn(t,e)}}function Gb(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r);let s;this.type===n.SAMPLER_2D_SHADOW?(ep.compareFunction=t.isReversedDepthBuffer()?mh:ph,s=ep):s=Kg,t.setTexture2D(e||s,r)}function Hb(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture3D(e||Qg,r)}function Wb(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTextureCube(e||ex,r)}function Xb(n,e,t){let i=this.cache,r=t.allocateTextureUnit();i[0]!==r&&(n.uniform1i(this.addr,r),i[0]=r),t.setTexture2DArray(e||Jg,r)}function Yb(n){switch(n){case 5126:return Tb;case 35664:return Rb;case 35665:return Cb;case 35666:return Ib;case 35674:return Pb;case 35675:return Lb;case 35676:return Db;case 5124:case 35670:return Nb;case 35667:case 35671:return Fb;case 35668:case 35672:return Ob;case 35669:case 35673:return Ub;case 5125:return Bb;case 36294:return kb;case 36295:return zb;case 36296:return Vb;case 35678:case 36198:case 36298:case 36306:case 35682:return Gb;case 35679:case 36299:case 36307:return Hb;case 35680:case 36300:case 36308:case 36293:return Wb;case 36289:case 36303:case 36311:case 36292:return Xb}}function $b(n,e){n.uniform1fv(this.addr,e)}function qb(n,e){let t=Bo(e,this.size,2);n.uniform2fv(this.addr,t)}function jb(n,e){let t=Bo(e,this.size,3);n.uniform3fv(this.addr,t)}function Zb(n,e){let t=Bo(e,this.size,4);n.uniform4fv(this.addr,t)}function Kb(n,e){let t=Bo(e,this.size,4);n.uniformMatrix2fv(this.addr,!1,t)}function Jb(n,e){let t=Bo(e,this.size,9);n.uniformMatrix3fv(this.addr,!1,t)}function Qb(n,e){let t=Bo(e,this.size,16);n.uniformMatrix4fv(this.addr,!1,t)}function e1(n,e){n.uniform1iv(this.addr,e)}function t1(n,e){n.uniform2iv(this.addr,e)}function n1(n,e){n.uniform3iv(this.addr,e)}function i1(n,e){n.uniform4iv(this.addr,e)}function r1(n,e){n.uniform1uiv(this.addr,e)}function s1(n,e){n.uniform2uiv(this.addr,e)}function o1(n,e){n.uniform3uiv(this.addr,e)}function a1(n,e){n.uniform4uiv(this.addr,e)}function l1(n,e,t){let i=this.cache,r=e.length,s=Sh(t,r);vn(i,s)||(n.uniform1iv(this.addr,s),yn(i,s));let o;this.type===n.SAMPLER_2D_SHADOW?o=ep:o=Kg;for(let a=0;a!==r;++a)t.setTexture2D(e[a]||o,s[a])}function c1(n,e,t){let i=this.cache,r=e.length,s=Sh(t,r);vn(i,s)||(n.uniform1iv(this.addr,s),yn(i,s));for(let o=0;o!==r;++o)t.setTexture3D(e[o]||Qg,s[o])}function u1(n,e,t){let i=this.cache,r=e.length,s=Sh(t,r);vn(i,s)||(n.uniform1iv(this.addr,s),yn(i,s));for(let o=0;o!==r;++o)t.setTextureCube(e[o]||ex,s[o])}function h1(n,e,t){let i=this.cache,r=e.length,s=Sh(t,r);vn(i,s)||(n.uniform1iv(this.addr,s),yn(i,s));for(let o=0;o!==r;++o)t.setTexture2DArray(e[o]||Jg,s[o])}function f1(n){switch(n){case 5126:return $b;case 35664:return qb;case 35665:return jb;case 35666:return Zb;case 35674:return Kb;case 35675:return Jb;case 35676:return Qb;case 5124:case 35670:return e1;case 35667:case 35671:return t1;case 35668:case 35672:return n1;case 35669:case 35673:return i1;case 5125:return r1;case 36294:return s1;case 36295:return o1;case 36296:return a1;case 35678:case 36198:case 36298:case 36306:case 35682:return l1;case 35679:case 36299:case 36307:return c1;case 35680:case 36300:case 36308:case 36293:return u1;case 36289:case 36303:case 36311:case 36292:return h1}}var tp=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.setValue=Yb(t.type)}},np=class{constructor(e,t,i){this.id=e,this.addr=i,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=f1(t.type)}},ip=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,i){let r=this.seq;for(let s=0,o=r.length;s!==o;++s){let a=r[s];a.setValue(e,t[a.id],i)}}},Jd=/(\w+)(\])?(\[|\.)?/g;function Ug(n,e){n.seq.push(e),n.map[e.id]=e}function d1(n,e,t){let i=n.name,r=i.length;for(Jd.lastIndex=0;;){let s=Jd.exec(i),o=Jd.lastIndex,a=s[1],l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){Ug(t,c===void 0?new tp(a,n,e):new np(a,n,e));break}else{let d=t.map[a];d===void 0&&(d=new ip(a),Ug(t,d)),t=d}}}var Uo=class{constructor(e,t){this.seq=[],this.map={};let i=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=e.getActiveUniform(t,o),l=e.getUniformLocation(t,a.name);d1(a,l,this)}let r=[],s=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(e,t,i,r){let s=this.map[t];s!==void 0&&s.setValue(e,i,r)}setOptional(e,t,i){let r=t[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,t,i,r){for(let s=0,o=t.length;s!==o;++s){let a=t[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,t){let i=[];for(let r=0,s=e.length;r!==s;++r){let o=e[r];o.id in t&&i.push(o)}return i}};function Bg(n,e,t){let i=n.createShader(e);return n.shaderSource(i,t),n.compileShader(i),i}var p1=37297,m1=0;function g1(n,e){let t=n.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,t.length);for(let o=r;o<s;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return i.join(`
`)}var kg=new at;function x1(n){ft._getMatrix(kg,ft.workingColorSpace,n);let e=`mat3( ${kg.elements.map(t=>t.toFixed(4))} )`;switch(ft.getTransfer(n)){case Pa:return[e,"LinearTransferOETF"];case It:return[e,"sRGBTransferOETF"];default:return Ke("WebGLProgram: Unsupported color space: ",n),[e,"LinearTransferOETF"]}}function zg(n,e,t){let i=n.getShaderParameter(e,n.COMPILE_STATUS),s=(n.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";let o=/ERROR: 0:(\d+)/.exec(s);if(o){let a=parseInt(o[1]);return t.toUpperCase()+`

`+s+`

`+g1(n.getShaderSource(e),a)}else return s}function v1(n,e){let t=x1(e);return[`vec4 ${n}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}var y1={[Md]:"Linear",[Sd]:"Reinhard",[bd]:"Cineon",[wd]:"ACESFilmic",[Ad]:"AgX",[Td]:"Neutral",[Ed]:"Custom"};function _1(n,e){let t=y1[e];return t===void 0?(Ke("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+n+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+n+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var xh=new I;function M1(){ft.getLuminanceCoefficients(xh);let n=xh.x.toFixed(4),e=xh.y.toFixed(4),t=xh.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function S1(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(hl).join(`
`)}function b1(n){let e=[];for(let t in n){let i=n[t];i!==!1&&e.push("#define "+t+" "+i)}return e.join(`
`)}function w1(n,e){let t={},i=n.getProgramParameter(e,n.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){let s=n.getActiveAttrib(e,r),o=s.name,a=1;s.type===n.FLOAT_MAT2&&(a=2),s.type===n.FLOAT_MAT3&&(a=3),s.type===n.FLOAT_MAT4&&(a=4),t[o]={type:s.type,location:n.getAttribLocation(e,o),locationSize:a}}return t}function hl(n){return n!==""}function Vg(n,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return n.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Gg(n,e){return n.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var E1=/^[ \t]*#include +<([\w\d./]+)>/gm;function rp(n){return n.replace(E1,T1)}var A1=new Map;function T1(n,e){let t=ut[e];if(t===void 0){let i=A1.get(e);if(i!==void 0)t=ut[i],Ke('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return rp(t)}var R1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Hg(n){return n.replace(R1,C1)}function C1(n,e,t,i){let r="";for(let s=parseInt(e);s<parseInt(t);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Wg(n){let e=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?e+=`
#define HIGH_PRECISION`:n.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var I1={[Qa]:"SHADOWMAP_TYPE_PCF",[Po]:"SHADOWMAP_TYPE_VSM"};function P1(n){return I1[n.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var L1={[qr]:"ENVMAP_TYPE_CUBE",[Cs]:"ENVMAP_TYPE_CUBE",[tl]:"ENVMAP_TYPE_CUBE_UV"};function D1(n){return n.envMap===!1?"ENVMAP_TYPE_CUBE":L1[n.envMapMode]||"ENVMAP_TYPE_CUBE"}var N1={[Cs]:"ENVMAP_MODE_REFRACTION"};function F1(n){return n.envMap===!1?"ENVMAP_MODE_REFLECTION":N1[n.envMapMode]||"ENVMAP_MODE_REFLECTION"}var O1={[_d]:"ENVMAP_BLENDING_MULTIPLY",[lg]:"ENVMAP_BLENDING_MIX",[cg]:"ENVMAP_BLENDING_ADD"};function U1(n){return n.envMap===!1?"ENVMAP_BLENDING_NONE":O1[n.combine]||"ENVMAP_BLENDING_NONE"}function B1(n){let e=n.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:i,maxMip:t}}function k1(n,e,t,i){let r=n.getContext(),s=t.defines,o=t.vertexShader,a=t.fragmentShader,l=P1(t),c=D1(t),u=F1(t),d=U1(t),h=B1(t),f=S1(t),g=b1(s),_=r.createProgram(),m,p,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(hl).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(hl).join(`
`),p.length>0&&(p+=`
`)):(m=[Wg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(hl).join(`
`),p=[Wg(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+d:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ai?"#define TONE_MAPPING":"",t.toneMapping!==ai?ut.tonemapping_pars_fragment:"",t.toneMapping!==ai?_1("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ut.colorspace_pars_fragment,v1("linearToOutputTexel",t.outputColorSpace),M1(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(hl).join(`
`)),o=rp(o),o=Vg(o,t),o=Gg(o,t),a=rp(a),a=Vg(a,t),a=Gg(a,t),o=Hg(o),a=Hg(a),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Ud?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ud?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let b=S+m+o,y=S+p+a,A=Bg(r,r.VERTEX_SHADER,b),T=Bg(r,r.FRAGMENT_SHADER,y);r.attachShader(_,A),r.attachShader(_,T),t.index0AttributeName!==void 0?r.bindAttribLocation(_,0,t.index0AttributeName):t.hasPositionAttribute===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function R(D){if(n.debug.checkShaderErrors){let O=r.getProgramInfoLog(_)||"",z=r.getShaderInfoLog(A)||"",N=r.getShaderInfoLog(T)||"",V=O.trim(),Z=z.trim(),X=N.trim(),K=!0,q=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(K=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(r,_,A,T);else{let J=zg(r,A,"vertex"),te=zg(r,T,"fragment");tt("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+V+`
`+J+`
`+te)}else V!==""?Ke("WebGLProgram: Program Info Log:",V):(Z===""||X==="")&&(q=!1);q&&(D.diagnostics={runnable:K,programLog:V,vertexShader:{log:Z,prefix:m},fragmentShader:{log:X,prefix:p}})}r.deleteShader(A),r.deleteShader(T),x=new Uo(r,_),w=w1(r,_)}let x;this.getUniforms=function(){return x===void 0&&R(this),x};let w;this.getAttributes=function(){return w===void 0&&R(this),w};let C=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=r.getProgramParameter(_,p1)),C},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=m1++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=A,this.fragmentShader=T,this}var z1=0,sp=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,i){let r=this._getShaderCacheForMaterial(e);return r.has(t)===!1&&(r.add(t),t.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let i of t)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,i=t.get(e);return i===void 0&&(i=new Set,t.set(e,i)),i}_getShaderStage(e){let t=this.shaderCache,i=t.get(e);return i===void 0&&(i=new op(e),t.set(e,i)),i}},op=class{constructor(e){this.id=z1++,this.code=e,this.usedTimes=0}};function V1(n){return n===Kr||n===al||n===ll}function G1(n,e,t,i,r,s){let o=new Ao,a=new sp,l=new Set,c=[],u=new Map,d=i.logarithmicDepthBuffer,h=i.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(x){return l.add(x),x===0?"uv":`uv${x}`}function _(x,w,C,D,O,z){let N=D.fog,V=O.geometry,Z=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?D.environment:null,X=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,K=e.get(x.envMap||Z,X),q=K&&K.mapping===tl?K.image.height:null,J=f[x.type];x.precision!==null&&(h=i.getMaxPrecision(x.precision),h!==x.precision&&Ke("WebGLProgram.getParameters:",x.precision,"not supported, using",h,"instead."));let te=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Be=te!==void 0?te.length:0,Le=0;V.morphAttributes.position!==void 0&&(Le=1),V.morphAttributes.normal!==void 0&&(Le=2),V.morphAttributes.color!==void 0&&(Le=3);let dt,ot,rt,Y;if(J){let Ht=Ki[J];dt=Ht.vertexShader,ot=Ht.fragmentShader}else{dt=x.vertexShader,ot=x.fragmentShader;let Ht=a.getVertexShaderStage(x),At=a.getFragmentShaderStage(x);a.update(x,Ht,At),rt=Ht.id,Y=At.id}let Q=n.getRenderTarget(),ge=n.state.buffers.depth.getReversed(),qe=O.isInstancedMesh===!0,Se=O.isBatchedMesh===!0,de=!!x.map,pe=!!x.matcap,Ae=!!K,We=!!x.aoMap,xt=!!x.lightMap,xe=!!x.bumpMap&&x.wireframe===!1,ye=!!x.normalMap,Qe=!!x.displacementMap,Ft=!!x.emissiveMap,Dt=!!x.metalnessMap,Nt=!!x.roughnessMap,F=x.anisotropy>0,dn=x.clearcoat>0,ht=x.dispersion>0,P=x.retroreflectivity>0,v=x.iridescence>0,E=x.sheen>0,L=x.transmission>0,k=F&&!!x.anisotropyMap,ie=dn&&!!x.clearcoatMap,le=dn&&!!x.clearcoatNormalMap,W=dn&&!!x.clearcoatRoughnessMap,j=v&&!!x.iridescenceMap,fe=v&&!!x.iridescenceThicknessMap,Pe=E&&!!x.sheenColorMap,ne=E&&!!x.sheenRoughnessMap,ae=!!x.specularMap,me=!!x.specularColorMap,ke=!!x.specularIntensityMap,lt=L&&!!x.transmissionMap,B=L&&!!x.thicknessMap,ve=!!x.gradientMap,ee=!!x.alphaMap,_e=x.alphaTest>0,Re=!!x.alphaHash,re=!!x.extensions,Xe=ai;x.toneMapped&&(Q===null||Q.isXRRenderTarget===!0)&&(Xe=n.toneMapping);let Ue={shaderID:J,shaderType:x.type,shaderName:x.name,vertexShader:dt,fragmentShader:ot,defines:x.defines,customVertexShaderID:rt,customFragmentShaderID:Y,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:h,batching:Se,batchingColor:Se&&O._colorsTexture!==null,instancing:qe,instancingColor:qe&&O.instanceColor!==null,instancingMorph:qe&&O.morphTexture!==null,outputColorSpace:Q===null?n.outputColorSpace:Q.isXRRenderTarget===!0?Q.texture.colorSpace:ft.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:de,matcap:pe,envMap:Ae,envMapMode:Ae&&K.mapping,envMapCubeUVHeight:q,aoMap:We,lightMap:xt,bumpMap:xe,normalMap:ye,displacementMap:Qe,emissiveMap:Ft,normalMapObjectSpace:ye&&x.normalMapType===fg,normalMapTangentSpace:ye&&x.normalMapType===Fd,packedNormalMap:ye&&x.normalMapType===Fd&&V1(x.normalMap.format),metalnessMap:Dt,roughnessMap:Nt,anisotropy:F,anisotropyMap:k,clearcoat:dn,clearcoatMap:ie,clearcoatNormalMap:le,clearcoatRoughnessMap:W,dispersion:ht,retroreflection:P,iridescence:v,iridescenceMap:j,iridescenceThicknessMap:fe,sheen:E,sheenColorMap:Pe,sheenRoughnessMap:ne,specularMap:ae,specularColorMap:me,specularIntensityMap:ke,transmission:L,transmissionMap:lt,thicknessMap:B,gradientMap:ve,opaque:x.transparent===!1&&x.blending===Di&&x.alphaToCoverage===!1,alphaMap:ee,alphaTest:_e,alphaHash:Re,combine:x.combine,mapUv:de&&g(x.map.channel),aoMapUv:We&&g(x.aoMap.channel),lightMapUv:xt&&g(x.lightMap.channel),bumpMapUv:xe&&g(x.bumpMap.channel),normalMapUv:ye&&g(x.normalMap.channel),displacementMapUv:Qe&&g(x.displacementMap.channel),emissiveMapUv:Ft&&g(x.emissiveMap.channel),metalnessMapUv:Dt&&g(x.metalnessMap.channel),roughnessMapUv:Nt&&g(x.roughnessMap.channel),anisotropyMapUv:k&&g(x.anisotropyMap.channel),clearcoatMapUv:ie&&g(x.clearcoatMap.channel),clearcoatNormalMapUv:le&&g(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:W&&g(x.clearcoatRoughnessMap.channel),iridescenceMapUv:j&&g(x.iridescenceMap.channel),iridescenceThicknessMapUv:fe&&g(x.iridescenceThicknessMap.channel),sheenColorMapUv:Pe&&g(x.sheenColorMap.channel),sheenRoughnessMapUv:ne&&g(x.sheenRoughnessMap.channel),specularMapUv:ae&&g(x.specularMap.channel),specularColorMapUv:me&&g(x.specularColorMap.channel),specularIntensityMapUv:ke&&g(x.specularIntensityMap.channel),transmissionMapUv:lt&&g(x.transmissionMap.channel),thicknessMapUv:B&&g(x.thicknessMap.channel),alphaMapUv:ee&&g(x.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(ye||F),vertexNormals:!!V.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!V.attributes.uv&&(de||ee),fog:!!N,useFog:x.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||V.attributes.normal===void 0&&ye===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:d,reversedDepthBuffer:ge,skinning:O.isSkinnedMesh===!0,hasPositionAttribute:V.attributes.position!==void 0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:Be,morphTextureStride:Le,numSunLights:w.sun.length,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numSunLightShadows:w.sunShadowMap.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:x.dithering,shadowMapEnabled:n.shadowMap.enabled&&C.length>0,shadowMapType:n.shadowMap.type,toneMapping:Xe,decodeVideoTexture:de&&x.map.isVideoTexture===!0&&ft.getTransfer(x.map.colorSpace)===It,decodeVideoTextureEmissive:Ft&&x.emissiveMap.isVideoTexture===!0&&ft.getTransfer(x.emissiveMap.colorSpace)===It,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===ji,flipSided:x.side===Hn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:re&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(re&&x.extensions.multiDraw===!0||Se)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Ue.vertexUv1s=l.has(1),Ue.vertexUv2s=l.has(2),Ue.vertexUv3s=l.has(3),l.clear(),Ue}function m(x){let w=[];if(x.shaderID?w.push(x.shaderID):(w.push(x.customVertexShaderID),w.push(x.customFragmentShaderID)),x.defines!==void 0)for(let C in x.defines)w.push(C),w.push(x.defines[C]);return x.isRawShaderMaterial===!1&&(p(w,x),S(w,x),w.push(n.outputColorSpace)),w.push(x.customProgramCacheKey),w.join()}function p(x,w){x.push(w.precision),x.push(w.outputColorSpace),x.push(w.envMapMode),x.push(w.envMapCubeUVHeight),x.push(w.mapUv),x.push(w.alphaMapUv),x.push(w.lightMapUv),x.push(w.aoMapUv),x.push(w.bumpMapUv),x.push(w.normalMapUv),x.push(w.displacementMapUv),x.push(w.emissiveMapUv),x.push(w.metalnessMapUv),x.push(w.roughnessMapUv),x.push(w.anisotropyMapUv),x.push(w.clearcoatMapUv),x.push(w.clearcoatNormalMapUv),x.push(w.clearcoatRoughnessMapUv),x.push(w.iridescenceMapUv),x.push(w.iridescenceThicknessMapUv),x.push(w.sheenColorMapUv),x.push(w.sheenRoughnessMapUv),x.push(w.specularMapUv),x.push(w.specularColorMapUv),x.push(w.specularIntensityMapUv),x.push(w.transmissionMapUv),x.push(w.thicknessMapUv),x.push(w.combine),x.push(w.fogExp2),x.push(w.sizeAttenuation),x.push(w.morphTargetsCount),x.push(w.morphAttributeCount),x.push(w.numSunLights),x.push(w.numDirLights),x.push(w.numPointLights),x.push(w.numSpotLights),x.push(w.numSpotLightMaps),x.push(w.numHemiLights),x.push(w.numRectAreaLights),x.push(w.numSunLightShadows),x.push(w.numDirLightShadows),x.push(w.numPointLightShadows),x.push(w.numSpotLightShadows),x.push(w.numSpotLightShadowsWithMaps),x.push(w.numLightProbes),x.push(w.shadowMapType),x.push(w.toneMapping),x.push(w.numClippingPlanes),x.push(w.numClipIntersection),x.push(w.depthPacking)}function S(x,w){o.disableAll(),w.instancing&&o.enable(0),w.instancingColor&&o.enable(1),w.instancingMorph&&o.enable(2),w.matcap&&o.enable(3),w.envMap&&o.enable(4),w.normalMapObjectSpace&&o.enable(5),w.normalMapTangentSpace&&o.enable(6),w.clearcoat&&o.enable(7),w.iridescence&&o.enable(8),w.alphaTest&&o.enable(9),w.vertexColors&&o.enable(10),w.vertexAlphas&&o.enable(11),w.vertexUv1s&&o.enable(12),w.vertexUv2s&&o.enable(13),w.vertexUv3s&&o.enable(14),w.vertexTangents&&o.enable(15),w.anisotropy&&o.enable(16),w.alphaHash&&o.enable(17),w.batching&&o.enable(18),w.dispersion&&o.enable(19),w.retroreflection&&o.enable(24),w.batchingColor&&o.enable(20),w.gradientMap&&o.enable(21),w.packedNormalMap&&o.enable(22),w.vertexNormals&&o.enable(23),x.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.reversedDepthBuffer&&o.enable(4),w.skinning&&o.enable(5),w.morphTargets&&o.enable(6),w.morphNormals&&o.enable(7),w.morphColors&&o.enable(8),w.premultipliedAlpha&&o.enable(9),w.shadowMapEnabled&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),w.decodeVideoTextureEmissive&&o.enable(20),w.alphaToCoverage&&o.enable(21),w.numLightProbeGrids>0&&o.enable(22),w.hasPositionAttribute&&o.enable(23),x.push(o.mask)}function b(x){let w=f[x.type],C;if(w){let D=Ki[w];C=Eg.clone(D.uniforms)}else C=x.uniforms;return C}function y(x,w){let C=u.get(w);return C!==void 0?++C.usedTimes:(C=new k1(n,w,x,r),c.push(C),u.set(w,C)),C}function A(x){if(--x.usedTimes===0){let w=c.indexOf(x);c[w]=c[c.length-1],c.pop(),u.delete(x.cacheKey),x.destroy()}}function T(x){a.remove(x)}function R(){a.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:b,acquireProgram:y,releaseProgram:A,releaseShaderCache:T,programs:c,dispose:R}}function H1(){let n=new WeakMap;function e(o){return n.has(o)}function t(o){let a=n.get(o);return a===void 0&&(a={},n.set(o,a)),a}function i(o){n.delete(o)}function r(o,a,l){n.get(o)[a]=l}function s(){n=new WeakMap}return{has:e,get:t,remove:i,update:r,dispose:s}}function W1(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.material.id!==e.material.id?n.material.id-e.material.id:n.materialVariant!==e.materialVariant?n.materialVariant-e.materialVariant:n.z!==e.z?n.z-e.z:n.id-e.id}function Xg(n,e){return n.groupOrder!==e.groupOrder?n.groupOrder-e.groupOrder:n.renderOrder!==e.renderOrder?n.renderOrder-e.renderOrder:n.z!==e.z?e.z-n.z:n.id-e.id}function Yg(){let n=[],e=0,t=[],i=[],r=[];function s(){e=0,t.length=0,i.length=0,r.length=0}function o(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function a(h,f,g,_,m,p){let S=n[e];return S===void 0?(S={id:h.id,object:h,geometry:f,material:g,materialVariant:o(h),groupOrder:_,renderOrder:h.renderOrder,z:m,group:p},n[e]=S):(S.id=h.id,S.object=h,S.geometry=f,S.material=g,S.materialVariant=o(h),S.groupOrder=_,S.renderOrder=h.renderOrder,S.z=m,S.group=p),e++,S}function l(h,f,g,_,m,p,S){S.reversedDepth===!0&&(m=-m);let b=a(h,f,g,_,m,p);g.transmission>0?i.push(b):g.transparent===!0?r.push(b):t.push(b)}function c(h,f,g,_,m,p){let S=a(h,f,g,_,m,p);g.transmission>0?i.unshift(S):g.transparent===!0?r.unshift(S):t.unshift(S)}function u(h,f){t.length>1&&t.sort(h||W1),i.length>1&&i.sort(f||Xg),r.length>1&&r.sort(f||Xg)}function d(){for(let h=e,f=n.length;h<f;h++){let g=n[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:t,transmissive:i,transparent:r,init:s,push:l,unshift:c,finish:d,sort:u}}function X1(){let n=new WeakMap;function e(i,r){let s=n.get(i),o;return s===void 0?(o=new Yg,n.set(i,[o])):r>=s.length?(o=new Yg,s.push(o)):o=s[r],o}function t(){n=new WeakMap}return{get:e,dispose:t}}function Y1(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new I,color:new gt};break;case"SpotLight":t={position:new I,direction:new I,color:new gt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new I,color:new gt,distance:0,decay:0};break;case"HemisphereLight":t={direction:new I,skyColor:new gt,groundColor:new gt};break;case"RectAreaLight":t={color:new gt,position:new I,halfWidth:new I,halfHeight:new I};break}return n[e.id]=t,t}}}function $1(){let n={};return{get:function(e){if(n[e.id]!==void 0)return n[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new nt,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[e.id]=t,t}}}var q1=0;function j1(n,e){return(e.castShadow?2:0)-(n.castShadow?2:0)+(e.map?1:0)-(n.map?1:0)}function Z1(n){let e=new Y1,t=$1(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new I);let r=new I,s=new vt,o=new vt;function a(c){let u=0,d=0,h=0;for(let O=0;O<9;O++)i.probe[O].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,S=0,b=0,y=0,A=0,T=0,R=0,x=0,w=0,C=0;c.sort(j1);for(let O=0,z=c.length;O<z;O++){let N=c[O],V=N.color,Z=N.intensity,X=N.distance,K=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===Kr?K=N.shadow.map.texture:K=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)u+=V.r*Z,d+=V.g*Z,h+=V.b*Z;else if(N.isLightProbe){for(let q=0;q<9;q++)i.probe[q].addScaledVector(N.sh.coefficients[q],Z);C++}else if(N.isSunLight){let q=e.get(N);if(q.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let J=N.shadow,te=t.get(N);te.shadowIntensity=J.intensity,te.shadowBias=J.bias,te.shadowNormalBias=J.normalBias,te.shadowRadius=J.radius,te.shadowMapSize.copy(J.mapSize).multiply(J.getFrameExtents()),i.sunShadow[g]=te,i.sunShadowMap[g]=K;let Be=J.getViewportCount();for(let Le=0;Le<Be;Le++)i.sunShadowMatrix[_+Le]=J.getMatrix(Le),i.sunShadowCascade[_+Le]=J._cascadeData[Le];_+=Be,g++}i.sun[f]=q,f++}else if(N.isDirectionalLight){let q=e.get(N);if(q.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let J=N.shadow,te=t.get(N);te.shadowIntensity=J.intensity,te.shadowBias=J.bias,te.shadowNormalBias=J.normalBias,te.shadowRadius=J.radius,te.shadowMapSize=J.mapSize,i.directionalShadow[m]=te,i.directionalShadowMap[m]=K,i.directionalShadowMatrix[m]=N.shadow.matrix,A++}i.directional[m]=q,m++}else if(N.isSpotLight){let q=e.get(N);q.position.setFromMatrixPosition(N.matrixWorld),q.color.copy(V).multiplyScalar(Z),q.distance=X,q.coneCos=Math.cos(N.angle),q.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),q.decay=N.decay,i.spot[S]=q;let J=N.shadow;if(N.map&&(i.spotLightMap[x]=N.map,x++,J.updateMatrices(N),N.castShadow&&w++),i.spotLightMatrix[S]=J.matrix,N.castShadow){let te=t.get(N);te.shadowIntensity=J.intensity,te.shadowBias=J.bias,te.shadowNormalBias=J.normalBias,te.shadowRadius=J.radius,te.shadowMapSize=J.mapSize,i.spotShadow[S]=te,i.spotShadowMap[S]=K,R++}S++}else if(N.isRectAreaLight){let q=e.get(N);q.color.copy(V).multiplyScalar(Z),q.halfWidth.set(N.width*.5,0,0),q.halfHeight.set(0,N.height*.5,0),i.rectArea[b]=q,b++}else if(N.isPointLight){let q=e.get(N);if(q.color.copy(N.color).multiplyScalar(N.intensity),q.distance=N.distance,q.decay=N.decay,N.castShadow){let J=N.shadow,te=t.get(N);te.shadowIntensity=J.intensity,te.shadowBias=J.bias,te.shadowNormalBias=J.normalBias,te.shadowRadius=J.radius,te.shadowMapSize=J.mapSize,te.shadowCameraNear=J.camera.near,te.shadowCameraFar=J.camera.far,i.pointShadow[p]=te,i.pointShadowMap[p]=K,i.pointShadowMatrix[p]=N.shadow.matrix,T++}i.point[p]=q,p++}else if(N.isHemisphereLight){let q=e.get(N);q.skyColor.copy(N.color).multiplyScalar(Z),q.groundColor.copy(N.groundColor).multiplyScalar(Z),i.hemi[y]=q,y++}}b>0&&(n.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=we.LTC_FLOAT_1,i.rectAreaLTC2=we.LTC_FLOAT_2):(i.rectAreaLTC1=we.LTC_HALF_1,i.rectAreaLTC2=we.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=d,i.ambient[2]=h;let D=i.hash;(D.sunLength!==f||D.directionalLength!==m||D.pointLength!==p||D.spotLength!==S||D.rectAreaLength!==b||D.hemiLength!==y||D.numSunShadows!==g||D.numDirectionalShadows!==A||D.numPointShadows!==T||D.numSpotShadows!==R||D.numSpotMaps!==x||D.numLightProbes!==C)&&(i.sun.length=f,i.directional.length=m,i.spot.length=S,i.rectArea.length=b,i.point.length=p,i.hemi.length=y,i.sunShadow.length=g,i.sunShadowMap.length=g,i.sunShadowMatrix.length=_,i.sunShadowCascade.length=_,i.directionalShadow.length=A,i.directionalShadowMap.length=A,i.directionalShadowMatrix.length=A,i.pointShadow.length=T,i.pointShadowMap.length=T,i.pointShadowMatrix.length=T,i.spotShadow.length=R,i.spotShadowMap.length=R,i.spotLightMatrix.length=R+x-w,i.spotLightMap.length=x,i.numSpotLightShadowsWithMaps=w,i.numLightProbes=C,D.sunLength=f,D.directionalLength=m,D.pointLength=p,D.spotLength=S,D.rectAreaLength=b,D.hemiLength=y,D.numSunShadows=g,D.numDirectionalShadows=A,D.numPointShadows=T,D.numSpotShadows=R,D.numSpotMaps=x,D.numLightProbes=C,i.version=q1++)}function l(c,u){let d=0,h=0,f=0,g=0,_=0,m=0,p=u.matrixWorldInverse;for(let S=0,b=c.length;S<b;S++){let y=c[S];if(y.isSunLight){let A=i.sun[d];A.direction.setFromMatrixPosition(y.matrixWorld),A.direction.transformDirection(p),d++}else if(y.isDirectionalLight){let A=i.directional[h];A.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),A.direction.sub(r),A.direction.transformDirection(p),h++}else if(y.isSpotLight){let A=i.spot[g];A.position.setFromMatrixPosition(y.matrixWorld),A.position.applyMatrix4(p),A.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),A.direction.sub(r),A.direction.transformDirection(p),g++}else if(y.isRectAreaLight){let A=i.rectArea[_];A.position.setFromMatrixPosition(y.matrixWorld),A.position.applyMatrix4(p),o.identity(),s.copy(y.matrixWorld),s.premultiply(p),o.extractRotation(s),A.halfWidth.set(y.width*.5,0,0),A.halfHeight.set(0,y.height*.5,0),A.halfWidth.applyMatrix4(o),A.halfHeight.applyMatrix4(o),_++}else if(y.isPointLight){let A=i.point[f];A.position.setFromMatrixPosition(y.matrixWorld),A.position.applyMatrix4(p),f++}else if(y.isHemisphereLight){let A=i.hemi[m];A.direction.setFromMatrixPosition(y.matrixWorld),A.direction.transformDirection(p),m++}}}return{setup:a,setupView:l,state:i}}function $g(n){let e=new Z1(n),t=[],i=[],r=[];function s(h){d.camera=h,t.length=0,i.length=0,r.length=0}function o(h){t.push(h)}function a(h){i.push(h)}function l(h){r.push(h)}function c(){e.setup(t)}function u(h){e.setupView(t,h)}let d={lightsArray:t,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:d,setupLights:c,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function K1(n){let e=new WeakMap;function t(r,s=0){let o=e.get(r),a;return o===void 0?(a=new $g(n),e.set(r,[a])):s>=o.length?(a=new $g(n),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:t,dispose:i}}var J1=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Q1=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,ew=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],tw=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],qg=new vt,ul=new I,Qd=new I;function nw(n,e,t){let i=new Va,r=new nt,s=new nt,o=new Gt,a=new fu,l=new du,c={},u=t.maxTextureSize,d={[qi]:Hn,[Hn]:qi,[ji]:ji},h=new bt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new nt},radius:{value:4}},vertexShader:J1,fragmentShader:Q1}),f=h.clone();f.defines.HORIZONTAL_PASS=1;let g=new an;g.setAttribute("position",new Xt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Lt(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Qa;let p=this.type;this.render=function(T,R,x){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||T.length===0)return;this.type===X0&&(Ke("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Qa);let w=n.getRenderTarget(),C=n.getActiveCubeFace(),D=n.getActiveMipmapLevel(),O=n.state;O.setBlending(jn),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);let z=p!==this.type;z&&R.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(V=>V.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,V=T.length;N<V;N++){let Z=T[N],X=Z.shadow;if(X===void 0){Ke("WebGLShadowMap:",Z,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;r.copy(X.mapSize);let K=X.getFrameExtents();r.multiply(K),s.copy(X.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/K.x),r.x=s.x*K.x,X.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/K.y),r.y=s.y*K.y,X.mapSize.y=s.y));let q=n.state.buffers.depth.getReversed();if(X.camera._reversedDepth=q,X.map===null||z===!0){if(X.map!==null&&(X.map.depthTexture!==null&&(X.map.depthTexture.dispose(),X.map.depthTexture=null),X.map.dispose()),this.type===Po){if(Z.isPointLight){Ke("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}X.map=new gn(r.x,r.y,{format:Kr,type:Nn,minFilter:yt,magFilter:yt,generateMipmaps:!1}),X.map.texture.name=Z.name+".shadowMap",X.map.depthTexture=new Wr(r.x,r.y,vi),X.map.depthTexture.name=Z.name+".shadowMapDepth",X.map.depthTexture.format=Wi,X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=bn,X.map.depthTexture.magFilter=bn}else Z.isPointLight?(X.map=new yh(r.x),X.map.depthTexture=new cu(r.x,Ni)):(X.map=new gn(r.x,r.y),X.map.depthTexture=new Wr(r.x,r.y,Ni)),X.map.depthTexture.name=Z.name+".shadowMap",X.map.depthTexture.format=Wi,this.type===Qa?(X.map.depthTexture.compareFunction=q?mh:ph,X.map.depthTexture.minFilter=yt,X.map.depthTexture.magFilter=yt):(X.map.depthTexture.compareFunction=null,X.map.depthTexture.minFilter=bn,X.map.depthTexture.magFilter=bn);X.camera.updateProjectionMatrix()}X.map.isWebGLCubeRenderTarget!==!0&&(X.map.width!==r.x||X.map.height!==r.y)&&X.map.setSize(r.x,r.y);let J=X.map.isWebGLCubeRenderTarget?6:X.getViewportCount();Z.isPointLight!==!0&&X.updateMatrices(Z,x);for(let te=0;te<J;te++){let Be=X.getCamera(te);if(Z.isPointLight){let Le=X.camera,dt=X.matrix,ot=Z.distance||Le.far;ot!==Le.far&&(Le.far=ot,Le.updateProjectionMatrix()),ul.setFromMatrixPosition(Z.matrixWorld),Le.position.copy(ul),Qd.copy(Le.position),Qd.add(ew[te]),Le.up.copy(tw[te]),Le.lookAt(Qd),Le.updateMatrixWorld(),dt.makeTranslation(-ul.x,-ul.y,-ul.z),qg.multiplyMatrices(Le.projectionMatrix,Le.matrixWorldInverse),X._frustum.setFromProjectionMatrix(qg,Le.coordinateSystem,Le.reversedDepth)}if(X.map.isWebGLCubeRenderTarget)n.setRenderTarget(X.map,te),n.clear();else{te===0&&(n.setRenderTarget(X.map),n.clear());let Le=X.getViewport(te);o.set(s.x*Le.x,s.y*Le.y,s.x*Le.z,s.y*Le.w),O.viewport(o)}i=X.getFrustum(te),y(R,x,Be,Z,this.type)}X.isPointLightShadow!==!0&&this.type===Po&&S(X,x),X.needsUpdate=!1}p=this.type,m.needsUpdate=!1,n.setRenderTarget(w,C,D)};function S(T,R){let x=e.update(_);h.defines.VSM_SAMPLES!==T.blurSamples&&(h.defines.VSM_SAMPLES=T.blurSamples,f.defines.VSM_SAMPLES=T.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),T.mapPass===null?T.mapPass=new gn(r.x,r.y,{format:Kr,type:Nn}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),h.uniforms.shadow_pass.value=T.map.depthTexture,h.uniforms.resolution.value.set(T.map.width,T.map.height),h.uniforms.radius.value=T.radius,n.setRenderTarget(T.mapPass),n.clear(),n.renderBufferDirect(R,null,x,h,_,null),f.uniforms.shadow_pass.value=T.mapPass.texture,f.uniforms.resolution.value.set(T.map.width,T.map.height),f.uniforms.radius.value=T.radius,n.setRenderTarget(T.map),n.clear(),n.renderBufferDirect(R,null,x,f,_,null)}function b(T,R,x,w){let C=null,D=x.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(D!==void 0)C=D;else if(C=x.isPointLight===!0?l:a,n.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){let O=C.uuid,z=R.uuid,N=c[O];N===void 0&&(N={},c[O]=N);let V=N[z];V===void 0&&(V=C.clone(),N[z]=V,R.addEventListener("dispose",A)),C=V}if(C.visible=R.visible,C.wireframe=R.wireframe,w===Po?C.side=R.shadowSide!==null?R.shadowSide:R.side:C.side=R.shadowSide!==null?R.shadowSide:d[R.side],C.alphaMap=R.alphaMap,C.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,C.map=R.map,C.clipShadows=R.clipShadows,C.clippingPlanes=R.clippingPlanes,C.clipIntersection=R.clipIntersection,C.displacementMap=R.displacementMap,C.displacementScale=R.displacementScale,C.displacementBias=R.displacementBias,C.wireframeLinewidth=R.wireframeLinewidth,C.linewidth=R.linewidth,x.isPointLight===!0&&C.isMeshDistanceMaterial===!0){let O=n.properties.get(C);O.light=x}return C}function y(T,R,x,w,C){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&C===Po)&&(!T.frustumCulled||T.intersectsFrustum(i))){T.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,T.matrixWorld);let z=e.update(T),N=T.material;if(Array.isArray(N)){let V=z.groups;for(let Z=0,X=V.length;Z<X;Z++){let K=V[Z],q=N[K.materialIndex];if(q&&q.visible){let J=b(T,q,w,C);T.onBeforeShadow(n,T,R,x,z,J,K),n.renderBufferDirect(x,null,z,J,T,K),T.onAfterShadow(n,T,R,x,z,J,K)}}}else if(N.visible){let V=b(T,N,w,C);T.onBeforeShadow(n,T,R,x,z,V,null),n.renderBufferDirect(x,null,z,V,T,null),T.onAfterShadow(n,T,R,x,z,V,null)}}let O=T.children;for(let z=0,N=O.length;z<N;z++)y(O[z],R,x,w,C)}function A(T){T.target.removeEventListener("dispose",A);for(let x in c){let w=c[x],C=T.target.uuid;C in w&&(w[C].dispose(),delete w[C])}}}function iw(n,e){function t(){let B=!1,ve=new Gt,ee=null,_e=new Gt(0,0,0,0);return{setMask:function(Re){ee!==Re&&!B&&(n.colorMask(Re,Re,Re,Re),ee=Re)},setLocked:function(Re){B=Re},setClear:function(Re,re,Xe,Ue,Ht){Ht===!0&&(Re*=Ue,re*=Ue,Xe*=Ue),ve.set(Re,re,Xe,Ue),_e.equals(ve)===!1&&(n.clearColor(Re,re,Xe,Ue),_e.copy(ve))},reset:function(){B=!1,ee=null,_e.set(-1,0,0,0)}}}function i(){let B=!1,ve=!1,ee=null,_e=null,Re=null;return{setReversed:function(re){if(ve!==re){let Xe=e.get("EXT_clip_control");re?Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.ZERO_TO_ONE_EXT):Xe.clipControlEXT(Xe.LOWER_LEFT_EXT,Xe.NEGATIVE_ONE_TO_ONE_EXT),ve=re;let Ue=Re;Re=null,this.setClear(Ue)}},getReversed:function(){return ve},setTest:function(re){re?Q(n.DEPTH_TEST):ge(n.DEPTH_TEST)},setMask:function(re){ee!==re&&!B&&(n.depthMask(re),ee=re)},setFunc:function(re){if(ve&&(re=bg[re]),_e!==re){switch(re){case Hc:n.depthFunc(n.NEVER);break;case Wc:n.depthFunc(n.ALWAYS);break;case Xc:n.depthFunc(n.LESS);break;case bo:n.depthFunc(n.LEQUAL);break;case Yc:n.depthFunc(n.EQUAL);break;case $c:n.depthFunc(n.GEQUAL);break;case qc:n.depthFunc(n.GREATER);break;case jc:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}_e=re}},setLocked:function(re){B=re},setClear:function(re){Re!==re&&(Re=re,ve&&(re=1-re),n.clearDepth(re))},reset:function(){B=!1,ee=null,_e=null,Re=null,ve=!1}}}function r(){let B=!1,ve=null,ee=null,_e=null,Re=null,re=null,Xe=null,Ue=null,Ht=null;return{setTest:function(At){B||(At?Q(n.STENCIL_TEST):ge(n.STENCIL_TEST))},setMask:function(At){ve!==At&&!B&&(n.stencilMask(At),ve=At)},setFunc:function(At,Ei,zi){(ee!==At||_e!==Ei||Re!==zi)&&(n.stencilFunc(At,Ei,zi),ee=At,_e=Ei,Re=zi)},setOp:function(At,Ei,zi){(re!==At||Xe!==Ei||Ue!==zi)&&(n.stencilOp(At,Ei,zi),re=At,Xe=Ei,Ue=zi)},setLocked:function(At){B=At},setClear:function(At){Ht!==At&&(n.clearStencil(At),Ht=At)},reset:function(){B=!1,ve=null,ee=null,_e=null,Re=null,re=null,Xe=null,Ue=null,Ht=null}}}let s=new t,o=new i,a=new r,l=new WeakMap,c=new WeakMap,u={},d={},h={},f=new WeakMap,g=[],_=null,m=!1,p=null,S=null,b=null,y=null,A=null,T=null,R=null,x=new gt(0,0,0),w=0,C=!1,D=null,O=null,z=null,N=null,V=null,Z=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),X=!1,K=0,q=n.getParameter(n.VERSION);q.indexOf("WebGL")!==-1?(K=parseFloat(/^WebGL (\d)/.exec(q)[1]),X=K>=1):q.indexOf("OpenGL ES")!==-1&&(K=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),X=K>=2);let J=null,te={},Be=n.getParameter(n.SCISSOR_BOX),Le=n.getParameter(n.VIEWPORT),dt=new Gt().fromArray(Be),ot=new Gt().fromArray(Le);function rt(B,ve,ee,_e){let Re=new Uint8Array(4),re=n.createTexture();n.bindTexture(B,re),n.texParameteri(B,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(B,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let Xe=0;Xe<ee;Xe++)B===n.TEXTURE_3D||B===n.TEXTURE_2D_ARRAY?n.texImage3D(ve,0,n.RGBA,1,1,_e,0,n.RGBA,n.UNSIGNED_BYTE,Re):n.texImage2D(ve+Xe,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,Re);return re}let Y={};Y[n.TEXTURE_2D]=rt(n.TEXTURE_2D,n.TEXTURE_2D,1),Y[n.TEXTURE_CUBE_MAP]=rt(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),Y[n.TEXTURE_2D_ARRAY]=rt(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),Y[n.TEXTURE_3D]=rt(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),Q(n.DEPTH_TEST),o.setFunc(bo),xe(!1),ye(gd),Q(n.CULL_FACE),We(jn);function Q(B){u[B]!==!0&&(n.enable(B),u[B]=!0)}function ge(B){u[B]!==!1&&(n.disable(B),u[B]=!1)}function qe(B,ve){return h[B]!==ve?(n.bindFramebuffer(B,ve),h[B]=ve,B===n.DRAW_FRAMEBUFFER&&(h[n.FRAMEBUFFER]=ve),B===n.FRAMEBUFFER&&(h[n.DRAW_FRAMEBUFFER]=ve),!0):!1}function Se(B,ve){let ee=g,_e=!1;if(B){ee=f.get(ve),ee===void 0&&(ee=[],f.set(ve,ee));let Re=B.textures;if(ee.length!==Re.length||ee[0]!==n.COLOR_ATTACHMENT0){for(let re=0,Xe=Re.length;re<Xe;re++)ee[re]=n.COLOR_ATTACHMENT0+re;ee.length=Re.length,_e=!0}}else ee[0]!==n.BACK&&(ee[0]=n.BACK,_e=!0);_e&&n.drawBuffers(ee)}function de(B){return _!==B?(n.useProgram(B),_=B,!0):!1}let pe={[br]:n.FUNC_ADD,[Y0]:n.FUNC_SUBTRACT,[$0]:n.FUNC_REVERSE_SUBTRACT};pe[q0]=n.MIN,pe[j0]=n.MAX;let Ae={[Z0]:n.ZERO,[el]:n.ONE,[K0]:n.SRC_COLOR,[yd]:n.SRC_ALPHA,[ig]:n.SRC_ALPHA_SATURATE,[tg]:n.DST_COLOR,[Q0]:n.DST_ALPHA,[J0]:n.ONE_MINUS_SRC_COLOR,[Lo]:n.ONE_MINUS_SRC_ALPHA,[ng]:n.ONE_MINUS_DST_COLOR,[eg]:n.ONE_MINUS_DST_ALPHA,[rg]:n.CONSTANT_COLOR,[sg]:n.ONE_MINUS_CONSTANT_COLOR,[og]:n.CONSTANT_ALPHA,[ag]:n.ONE_MINUS_CONSTANT_ALPHA};function We(B,ve,ee,_e,Re,re,Xe,Ue,Ht,At){if(B===jn){m===!0&&(ge(n.BLEND),m=!1);return}if(m===!1&&(Q(n.BLEND),m=!0),B!==Tu){if(B!==p||At!==C){if((S!==br||A!==br)&&(n.blendEquation(n.FUNC_ADD),S=br,A=br),At)switch(B){case Di:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Rs:n.blendFunc(n.ONE,n.ONE);break;case xd:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case vd:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:tt("WebGLState: Invalid blending: ",B);break}else switch(B){case Di:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case Rs:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case xd:tt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case vd:tt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:tt("WebGLState: Invalid blending: ",B);break}b=null,y=null,T=null,R=null,x.set(0,0,0),w=0,p=B,C=At}return}Re=Re||ve,re=re||ee,Xe=Xe||_e,(ve!==S||Re!==A)&&(n.blendEquationSeparate(pe[ve],pe[Re]),S=ve,A=Re),(ee!==b||_e!==y||re!==T||Xe!==R)&&(n.blendFuncSeparate(Ae[ee],Ae[_e],Ae[re],Ae[Xe]),b=ee,y=_e,T=re,R=Xe),(Ue.equals(x)===!1||Ht!==w)&&(n.blendColor(Ue.r,Ue.g,Ue.b,Ht),x.copy(Ue),w=Ht),p=B,C=!1}function xt(B,ve){B.side===ji?ge(n.CULL_FACE):Q(n.CULL_FACE);let ee=B.side===Hn;ve&&(ee=!ee),xe(ee),B.blending===Di&&B.transparent===!1?We(jn):We(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),o.setFunc(B.depthFunc),o.setTest(B.depthTest),o.setMask(B.depthWrite),s.setMask(B.colorWrite);let _e=B.stencilWrite;a.setTest(_e),_e&&(a.setMask(B.stencilWriteMask),a.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),a.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),Ft(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?Q(n.SAMPLE_ALPHA_TO_COVERAGE):ge(n.SAMPLE_ALPHA_TO_COVERAGE)}function xe(B){D!==B&&(B?n.frontFace(n.CW):n.frontFace(n.CCW),D=B)}function ye(B){B!==H0?(Q(n.CULL_FACE),B!==O&&(B===gd?n.cullFace(n.BACK):B===W0?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):ge(n.CULL_FACE),O=B}function Qe(B){B!==z&&(X&&n.lineWidth(B),z=B)}function Ft(B,ve,ee){B?(Q(n.POLYGON_OFFSET_FILL),(N!==ve||V!==ee)&&(N=ve,V=ee,o.getReversed()&&(ve=-ve),n.polygonOffset(ve,ee))):ge(n.POLYGON_OFFSET_FILL)}function Dt(B){B?Q(n.SCISSOR_TEST):ge(n.SCISSOR_TEST)}function Nt(B){B===void 0&&(B=n.TEXTURE0+Z-1),J!==B&&(n.activeTexture(B),J=B)}function F(B,ve,ee){ee===void 0&&(J===null?ee=n.TEXTURE0+Z-1:ee=J);let _e=te[ee];_e===void 0&&(_e={type:void 0,texture:void 0},te[ee]=_e),(_e.type!==B||_e.texture!==ve)&&(J!==ee&&(n.activeTexture(ee),J=ee),n.bindTexture(B,ve||Y[B]),_e.type=B,_e.texture=ve)}function dn(){let B=te[J];B!==void 0&&B.type!==void 0&&(n.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function ht(){try{n.compressedTexImage2D(...arguments)}catch(B){tt("WebGLState:",B)}}function P(){try{n.compressedTexImage3D(...arguments)}catch(B){tt("WebGLState:",B)}}function v(){try{n.texSubImage2D(...arguments)}catch(B){tt("WebGLState:",B)}}function E(){try{n.texSubImage3D(...arguments)}catch(B){tt("WebGLState:",B)}}function L(){try{n.compressedTexSubImage2D(...arguments)}catch(B){tt("WebGLState:",B)}}function k(){try{n.compressedTexSubImage3D(...arguments)}catch(B){tt("WebGLState:",B)}}function ie(){try{n.texStorage2D(...arguments)}catch(B){tt("WebGLState:",B)}}function le(){try{n.texStorage3D(...arguments)}catch(B){tt("WebGLState:",B)}}function W(){try{n.texImage2D(...arguments)}catch(B){tt("WebGLState:",B)}}function j(){try{n.texImage3D(...arguments)}catch(B){tt("WebGLState:",B)}}function fe(B){return d[B]!==void 0?d[B]:n.getParameter(B)}function Pe(B,ve){d[B]!==ve&&(n.pixelStorei(B,ve),d[B]=ve)}function ne(B){dt.equals(B)===!1&&(n.scissor(B.x,B.y,B.z,B.w),dt.copy(B))}function ae(B){ot.equals(B)===!1&&(n.viewport(B.x,B.y,B.z,B.w),ot.copy(B))}function me(B,ve){let ee=c.get(ve);ee===void 0&&(ee=new WeakMap,c.set(ve,ee));let _e=ee.get(B);_e===void 0&&(_e=n.getUniformBlockIndex(ve,B.name),ee.set(B,_e))}function ke(B,ve){let _e=c.get(ve).get(B);l.get(ve)!==_e&&(n.uniformBlockBinding(ve,_e,B.__bindingPointIndex),l.set(ve,_e))}function lt(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),o.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),n.pixelStorei(n.PACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_ALIGNMENT,4),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,n.BROWSER_DEFAULT_WEBGL),n.pixelStorei(n.PACK_ROW_LENGTH,0),n.pixelStorei(n.PACK_SKIP_PIXELS,0),n.pixelStorei(n.PACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_ROW_LENGTH,0),n.pixelStorei(n.UNPACK_IMAGE_HEIGHT,0),n.pixelStorei(n.UNPACK_SKIP_PIXELS,0),n.pixelStorei(n.UNPACK_SKIP_ROWS,0),n.pixelStorei(n.UNPACK_SKIP_IMAGES,0),u={},d={},J=null,te={},h={},f=new WeakMap,g=[],_=null,m=!1,p=null,S=null,b=null,y=null,A=null,T=null,R=null,x=new gt(0,0,0),w=0,C=!1,D=null,O=null,z=null,N=null,V=null,dt.set(0,0,n.canvas.width,n.canvas.height),ot.set(0,0,n.canvas.width,n.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:Q,disable:ge,bindFramebuffer:qe,drawBuffers:Se,useProgram:de,setBlending:We,setMaterial:xt,setFlipSided:xe,setCullFace:ye,setLineWidth:Qe,setPolygonOffset:Ft,setScissorTest:Dt,activeTexture:Nt,bindTexture:F,unbindTexture:dn,compressedTexImage2D:ht,compressedTexImage3D:P,texImage2D:W,texImage3D:j,pixelStorei:Pe,getParameter:fe,updateUBOMapping:me,uniformBlockBinding:ke,texStorage2D:ie,texStorage3D:le,texSubImage2D:v,texSubImage3D:E,compressedTexSubImage2D:L,compressedTexSubImage3D:k,scissor:ne,viewport:ae,reset:lt}}function rw(n,e,t,i,r,s,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new nt,u=new WeakMap,d=new Set,h,f=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(P,v){return g?new OffscreenCanvas(P,v):Da("canvas")}function m(P,v,E){let L=1,k=ht(P);if((k.width>E||k.height>E)&&(L=E/Math.max(k.width,k.height)),L<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){let ie=Math.floor(L*k.width),le=Math.floor(L*k.height);h===void 0&&(h=_(ie,le));let W=v?_(ie,le):h;return W.width=ie,W.height=le,W.getContext("2d").drawImage(P,0,0,ie,le),Ke("WebGLRenderer: Texture has been resized from ("+k.width+"x"+k.height+") to ("+ie+"x"+le+")."),W}else return"data"in P&&Ke("WebGLRenderer: Image in DataTexture is too big ("+k.width+"x"+k.height+")."),P;return P}function p(P){return P.generateMipmaps}function S(P){n.generateMipmap(P)}function b(P){return P.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?n.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function y(P,v,E,L,k,ie=!1){if(P!==null){if(n[P]!==void 0)return n[P];Ke("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let le;L&&(le=e.get("EXT_texture_norm16"),le||Ke("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let W=v;if(v===n.RED&&(E===n.FLOAT&&(W=n.R32F),E===n.HALF_FLOAT&&(W=n.R16F),E===n.UNSIGNED_BYTE&&(W=n.R8),E===n.UNSIGNED_SHORT&&le&&(W=le.R16_EXT),E===n.SHORT&&le&&(W=le.R16_SNORM_EXT)),v===n.RED_INTEGER&&(E===n.UNSIGNED_BYTE&&(W=n.R8UI),E===n.UNSIGNED_SHORT&&(W=n.R16UI),E===n.UNSIGNED_INT&&(W=n.R32UI),E===n.BYTE&&(W=n.R8I),E===n.SHORT&&(W=n.R16I),E===n.INT&&(W=n.R32I)),v===n.RG&&(E===n.FLOAT&&(W=n.RG32F),E===n.HALF_FLOAT&&(W=n.RG16F),E===n.UNSIGNED_BYTE&&(W=n.RG8),E===n.UNSIGNED_SHORT&&le&&(W=le.RG16_EXT),E===n.SHORT&&le&&(W=le.RG16_SNORM_EXT)),v===n.RG_INTEGER&&(E===n.UNSIGNED_BYTE&&(W=n.RG8UI),E===n.UNSIGNED_SHORT&&(W=n.RG16UI),E===n.UNSIGNED_INT&&(W=n.RG32UI),E===n.BYTE&&(W=n.RG8I),E===n.SHORT&&(W=n.RG16I),E===n.INT&&(W=n.RG32I)),v===n.RGB_INTEGER&&(E===n.UNSIGNED_BYTE&&(W=n.RGB8UI),E===n.UNSIGNED_SHORT&&(W=n.RGB16UI),E===n.UNSIGNED_INT&&(W=n.RGB32UI),E===n.BYTE&&(W=n.RGB8I),E===n.SHORT&&(W=n.RGB16I),E===n.INT&&(W=n.RGB32I)),v===n.RGBA_INTEGER&&(E===n.UNSIGNED_BYTE&&(W=n.RGBA8UI),E===n.UNSIGNED_SHORT&&(W=n.RGBA16UI),E===n.UNSIGNED_INT&&(W=n.RGBA32UI),E===n.BYTE&&(W=n.RGBA8I),E===n.SHORT&&(W=n.RGBA16I),E===n.INT&&(W=n.RGBA32I)),v===n.RGB&&(E===n.UNSIGNED_SHORT&&le&&(W=le.RGB16_EXT),E===n.SHORT&&le&&(W=le.RGB16_SNORM_EXT),E===n.UNSIGNED_INT_5_9_9_9_REV&&(W=n.RGB9_E5),E===n.UNSIGNED_INT_10F_11F_11F_REV&&(W=n.R11F_G11F_B10F)),v===n.RGBA){let j=ie?Pa:ft.getTransfer(k);E===n.FLOAT&&(W=n.RGBA32F),E===n.HALF_FLOAT&&(W=n.RGBA16F),E===n.UNSIGNED_BYTE&&(W=j===It?n.SRGB8_ALPHA8:n.RGBA8),E===n.UNSIGNED_SHORT&&le&&(W=le.RGBA16_EXT),E===n.SHORT&&le&&(W=le.RGBA16_SNORM_EXT),E===n.UNSIGNED_SHORT_4_4_4_4&&(W=n.RGBA4),E===n.UNSIGNED_SHORT_5_5_5_1&&(W=n.RGB5_A1)}return(W===n.R16F||W===n.R32F||W===n.RG16F||W===n.RG32F||W===n.RGBA16F||W===n.RGBA32F)&&e.get("EXT_color_buffer_float"),W}function A(P,v){let E;return P?v===null||v===Ni||v===No?E=n.DEPTH24_STENCIL8:v===vi?E=n.DEPTH32F_STENCIL8:v===Do&&(E=n.DEPTH24_STENCIL8,Ke("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Ni||v===No?E=n.DEPTH_COMPONENT24:v===vi?E=n.DEPTH_COMPONENT32F:v===Do&&(E=n.DEPTH_COMPONENT16),E}function T(P,v){return p(P)===!0||P.isFramebufferTexture&&P.minFilter!==bn&&P.minFilter!==yt?Math.log2(Math.max(v.width,v.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?v.mipmaps.length:1}function R(P){let v=P.target;v.removeEventListener("dispose",R),w(v),v.isVideoTexture&&u.delete(v),v.isHTMLTexture&&d.delete(v)}function x(P){let v=P.target;v.removeEventListener("dispose",x),D(v)}function w(P){let v=i.get(P);if(v.__webglInit===void 0)return;let E=P.source,L=f.get(E);if(L){let k=L[v.__cacheKey];k.usedTimes--,k.usedTimes===0&&C(P),Object.keys(L).length===0&&f.delete(E)}i.remove(P)}function C(P){let v=i.get(P);n.deleteTexture(v.__webglTexture);let E=P.source,L=f.get(E);delete L[v.__cacheKey],o.memory.textures--}function D(P){let v=i.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),i.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let L=0;L<6;L++){if(Array.isArray(v.__webglFramebuffer[L]))for(let k=0;k<v.__webglFramebuffer[L].length;k++)n.deleteFramebuffer(v.__webglFramebuffer[L][k]);else n.deleteFramebuffer(v.__webglFramebuffer[L]);v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer[L])}else{if(Array.isArray(v.__webglFramebuffer))for(let L=0;L<v.__webglFramebuffer.length;L++)n.deleteFramebuffer(v.__webglFramebuffer[L]);else n.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&n.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&n.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let L=0;L<v.__webglColorRenderbuffer.length;L++)v.__webglColorRenderbuffer[L]&&n.deleteRenderbuffer(v.__webglColorRenderbuffer[L]);v.__webglDepthRenderbuffer&&n.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let E=P.textures;for(let L=0,k=E.length;L<k;L++){let ie=i.get(E[L]);ie.__webglTexture&&(n.deleteTexture(ie.__webglTexture),o.memory.textures--),i.remove(E[L])}i.remove(P)}let O=0;function z(){O=0}function N(){return O}function V(P){O=P}function Z(){let P=O;return P>=r.maxTextures&&Ke("WebGLTextures: Trying to use "+(P+1)+" texture units while this GPU supports only "+r.maxTextures),O+=1,P}function X(P){let v=[];return v.push(P.wrapS),v.push(P.wrapT),v.push(P.wrapR||0),v.push(P.magFilter),v.push(P.minFilter),v.push(P.anisotropy),v.push(P.internalFormat),v.push(P.format),v.push(P.type),v.push(P.generateMipmaps),v.push(P.premultiplyAlpha),v.push(P.flipY),v.push(P.unpackAlignment),v.push(P.colorSpace),v.join()}function K(P,v){let E=i.get(P);if(P.isVideoTexture&&F(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&E.__version!==P.version){let L=P.image;if(L===null)Ke("WebGLRenderer: Texture marked for update but no image data found.");else if(L.complete===!1)Ke("WebGLRenderer: Texture marked for update but image is incomplete");else{ge(E,P,v);return}}else P.isExternalTexture&&(E.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(n.TEXTURE_2D,E.__webglTexture,n.TEXTURE0+v)}function q(P,v){let E=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&E.__version!==P.version){ge(E,P,v);return}else P.isExternalTexture&&(E.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(n.TEXTURE_2D_ARRAY,E.__webglTexture,n.TEXTURE0+v)}function J(P,v){let E=i.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&E.__version!==P.version){ge(E,P,v);return}t.bindTexture(n.TEXTURE_3D,E.__webglTexture,n.TEXTURE0+v)}function te(P,v){let E=i.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&E.__version!==P.version){qe(E,P,v);return}t.bindTexture(n.TEXTURE_CUBE_MAP,E.__webglTexture,n.TEXTURE0+v)}let Be={[Zc]:n.REPEAT,[Dn]:n.CLAMP_TO_EDGE,[Kc]:n.MIRRORED_REPEAT},Le={[bn]:n.NEAREST,[ug]:n.NEAREST_MIPMAP_NEAREST,[nl]:n.NEAREST_MIPMAP_LINEAR,[yt]:n.LINEAR,[Iu]:n.LINEAR_MIPMAP_NEAREST,[jr]:n.LINEAR_MIPMAP_LINEAR},dt={[pg]:n.NEVER,[yg]:n.ALWAYS,[mg]:n.LESS,[ph]:n.LEQUAL,[gg]:n.EQUAL,[mh]:n.GEQUAL,[xg]:n.GREATER,[vg]:n.NOTEQUAL};function ot(P,v){if(v.type===vi&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===yt||v.magFilter===Iu||v.magFilter===nl||v.magFilter===jr||v.minFilter===yt||v.minFilter===Iu||v.minFilter===nl||v.minFilter===jr)&&Ke("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(P,n.TEXTURE_WRAP_S,Be[v.wrapS]),n.texParameteri(P,n.TEXTURE_WRAP_T,Be[v.wrapT]),(P===n.TEXTURE_3D||P===n.TEXTURE_2D_ARRAY)&&n.texParameteri(P,n.TEXTURE_WRAP_R,Be[v.wrapR]),n.texParameteri(P,n.TEXTURE_MAG_FILTER,Le[v.magFilter]),n.texParameteri(P,n.TEXTURE_MIN_FILTER,Le[v.minFilter]),v.compareFunction&&(n.texParameteri(P,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(P,n.TEXTURE_COMPARE_FUNC,dt[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===bn||v.minFilter!==nl&&v.minFilter!==jr||v.type===vi&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){let E=e.get("EXT_texture_filter_anisotropic");n.texParameterf(P,E.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,r.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function rt(P,v){let E=!1;P.__webglInit===void 0&&(P.__webglInit=!0,v.addEventListener("dispose",R));let L=v.source,k=f.get(L);k===void 0&&(k={},f.set(L,k));let ie=X(v);if(ie!==P.__cacheKey){k[ie]===void 0&&(k[ie]={texture:n.createTexture(),usedTimes:0},o.memory.textures++,E=!0),k[ie].usedTimes++;let le=k[P.__cacheKey];le!==void 0&&(k[P.__cacheKey].usedTimes--,le.usedTimes===0&&C(v)),P.__cacheKey=ie,P.__webglTexture=k[ie].texture}return E}function Y(P,v,E){return Math.floor(Math.floor(P/E)/v)}function Q(P,v,E,L){let ie=P.updateRanges;if(ie.length===0)t.texSubImage2D(n.TEXTURE_2D,0,0,0,v.width,v.height,E,L,v.data);else{ie.sort((Pe,ne)=>Pe.start-ne.start);let le=0;for(let Pe=1;Pe<ie.length;Pe++){let ne=ie[le],ae=ie[Pe],me=ne.start+ne.count,ke=Y(ae.start,v.width,4),lt=Y(ne.start,v.width,4);ae.start<=me+1&&ke===lt&&Y(ae.start+ae.count-1,v.width,4)===ke?ne.count=Math.max(ne.count,ae.start+ae.count-ne.start):(++le,ie[le]=ae)}ie.length=le+1;let W=t.getParameter(n.UNPACK_ROW_LENGTH),j=t.getParameter(n.UNPACK_SKIP_PIXELS),fe=t.getParameter(n.UNPACK_SKIP_ROWS);t.pixelStorei(n.UNPACK_ROW_LENGTH,v.width);for(let Pe=0,ne=ie.length;Pe<ne;Pe++){let ae=ie[Pe],me=Math.floor(ae.start/4),ke=Math.ceil(ae.count/4),lt=me%v.width,B=Math.floor(me/v.width),ve=ke,ee=1;t.pixelStorei(n.UNPACK_SKIP_PIXELS,lt),t.pixelStorei(n.UNPACK_SKIP_ROWS,B),t.texSubImage2D(n.TEXTURE_2D,0,lt,B,ve,ee,E,L,v.data)}P.clearUpdateRanges(),t.pixelStorei(n.UNPACK_ROW_LENGTH,W),t.pixelStorei(n.UNPACK_SKIP_PIXELS,j),t.pixelStorei(n.UNPACK_SKIP_ROWS,fe)}}function ge(P,v,E){let L=n.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(L=n.TEXTURE_2D_ARRAY),v.isData3DTexture&&(L=n.TEXTURE_3D);let k=rt(P,v),ie=v.source;t.bindTexture(L,P.__webglTexture,n.TEXTURE0+E);let le=i.get(ie);if(ie.version!==le.__version||k===!0){if(t.activeTexture(n.TEXTURE0+E),(typeof ImageBitmap<"u"&&v.image instanceof ImageBitmap)===!1){let ee=ft.getPrimaries(ft.workingColorSpace),_e=v.colorSpace===wr?null:ft.getPrimaries(v.colorSpace),Re=v.colorSpace===wr||ee===_e?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,Re)}t.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment);let j=m(v.image,!1,r.maxTextureSize);j=dn(v,j);let fe=s.convert(v.format,v.colorSpace),Pe=s.convert(v.type),ne=y(v.internalFormat,fe,Pe,v.normalized,v.colorSpace,v.isVideoTexture);ot(L,v);let ae,me=v.mipmaps,ke=v.isVideoTexture!==!0,lt=le.__version===void 0||k===!0,B=ie.dataReady,ve=T(v,j);if(v.isDepthTexture)ne=A(v.format===Zr,v.type),lt&&(ke?t.texStorage2D(n.TEXTURE_2D,1,ne,j.width,j.height):t.texImage2D(n.TEXTURE_2D,0,ne,j.width,j.height,0,fe,Pe,null));else if(v.isDataTexture)if(me.length>0){ke&&lt&&t.texStorage2D(n.TEXTURE_2D,ve,ne,me[0].width,me[0].height);for(let ee=0,_e=me.length;ee<_e;ee++)ae=me[ee],ke?B&&t.texSubImage2D(n.TEXTURE_2D,ee,0,0,ae.width,ae.height,fe,Pe,ae.data):t.texImage2D(n.TEXTURE_2D,ee,ne,ae.width,ae.height,0,fe,Pe,ae.data);v.generateMipmaps=!1}else ke?(lt&&t.texStorage2D(n.TEXTURE_2D,ve,ne,j.width,j.height),B&&Q(v,j,fe,Pe)):t.texImage2D(n.TEXTURE_2D,0,ne,j.width,j.height,0,fe,Pe,j.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){ke&&lt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ve,ne,me[0].width,me[0].height,j.depth);for(let ee=0,_e=me.length;ee<_e;ee++)if(ae=me[ee],v.format!==An)if(fe!==null)if(ke){if(B)if(v.layerUpdates.size>0){let Re=Gd(ae.width,ae.height,v.format,v.type);for(let re of v.layerUpdates){let Xe=ae.data.subarray(re*Re/ae.data.BYTES_PER_ELEMENT,(re+1)*Re/ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ee,0,0,re,ae.width,ae.height,1,fe,Xe)}}else t.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,ee,0,0,0,ae.width,ae.height,j.depth,fe,ae.data)}else t.compressedTexImage3D(n.TEXTURE_2D_ARRAY,ee,ne,ae.width,ae.height,j.depth,0,ae.data,0,0);else Ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else ke?B&&t.texSubImage3D(n.TEXTURE_2D_ARRAY,ee,0,0,0,ae.width,ae.height,j.depth,fe,Pe,ae.data):t.texImage3D(n.TEXTURE_2D_ARRAY,ee,ne,ae.width,ae.height,j.depth,0,fe,Pe,ae.data);v.layerUpdates.size>0&&v.clearLayerUpdates()}else{ke&&lt&&t.texStorage2D(n.TEXTURE_2D,ve,ne,me[0].width,me[0].height);for(let ee=0,_e=me.length;ee<_e;ee++)ae=me[ee],v.format!==An?fe!==null?ke?B&&t.compressedTexSubImage2D(n.TEXTURE_2D,ee,0,0,ae.width,ae.height,fe,ae.data):t.compressedTexImage2D(n.TEXTURE_2D,ee,ne,ae.width,ae.height,0,ae.data):Ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):ke?B&&t.texSubImage2D(n.TEXTURE_2D,ee,0,0,ae.width,ae.height,fe,Pe,ae.data):t.texImage2D(n.TEXTURE_2D,ee,ne,ae.width,ae.height,0,fe,Pe,ae.data)}else if(v.isDataArrayTexture)if(ke){if(lt&&t.texStorage3D(n.TEXTURE_2D_ARRAY,ve,ne,j.width,j.height,j.depth),B)if(v.layerUpdates.size>0){let ee=Gd(j.width,j.height,v.format,v.type);for(let _e of v.layerUpdates){let Re=j.data.subarray(_e*ee/j.data.BYTES_PER_ELEMENT,(_e+1)*ee/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,_e,j.width,j.height,1,fe,Pe,Re)}v.clearLayerUpdates()}else t.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,fe,Pe,j.data)}else t.texImage3D(n.TEXTURE_2D_ARRAY,0,ne,j.width,j.height,j.depth,0,fe,Pe,j.data);else if(v.isData3DTexture)ke?(lt&&t.texStorage3D(n.TEXTURE_3D,ve,ne,j.width,j.height,j.depth),B&&t.texSubImage3D(n.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,fe,Pe,j.data)):t.texImage3D(n.TEXTURE_3D,0,ne,j.width,j.height,j.depth,0,fe,Pe,j.data);else if(v.isFramebufferTexture){if(lt)if(ke)t.texStorage2D(n.TEXTURE_2D,ve,ne,j.width,j.height);else{let ee=j.width,_e=j.height;for(let Re=0;Re<ve;Re++)t.texImage2D(n.TEXTURE_2D,Re,ne,ee,_e,0,fe,Pe,null),ee>>=1,_e>>=1}}else if(v.isHTMLTexture){if("texElementImage2D"in n){let ee=n.canvas;if(ee.hasAttribute("layoutsubtree")||ee.setAttribute("layoutsubtree","true"),j.parentNode!==ee){ee.appendChild(j),d.add(v),ee.onpaint=_e=>{let Re=_e.changedElements;for(let re of d)Re.includes(re.image)&&(re.needsUpdate=!0)},ee.requestPaint();return}if(n.texElementImage2D.length===3)n.texElementImage2D(n.TEXTURE_2D,n.RGBA8,j);else{let Re=n.RGBA,re=n.RGBA,Xe=n.UNSIGNED_BYTE;n.texElementImage2D(n.TEXTURE_2D,0,Re,re,Xe,j)}n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE)}}else if(me.length>0){if(ke&&lt){let ee=ht(me[0]);t.texStorage2D(n.TEXTURE_2D,ve,ne,ee.width,ee.height)}for(let ee=0,_e=me.length;ee<_e;ee++)ae=me[ee],ke?B&&t.texSubImage2D(n.TEXTURE_2D,ee,0,0,fe,Pe,ae):t.texImage2D(n.TEXTURE_2D,ee,ne,fe,Pe,ae);v.generateMipmaps=!1}else if(ke){if(lt){let ee=ht(j);t.texStorage2D(n.TEXTURE_2D,ve,ne,ee.width,ee.height)}B&&t.texSubImage2D(n.TEXTURE_2D,0,0,0,fe,Pe,j)}else t.texImage2D(n.TEXTURE_2D,0,ne,fe,Pe,j);p(v)&&S(L),le.__version=ie.version,v.onUpdate&&v.onUpdate(v)}P.__version=v.version}function qe(P,v,E){if(v.image.length!==6)return;let L=rt(P,v),k=v.source;t.bindTexture(n.TEXTURE_CUBE_MAP,P.__webglTexture,n.TEXTURE0+E);let ie=i.get(k);if(k.version!==ie.__version||L===!0){t.activeTexture(n.TEXTURE0+E);let le=ft.getPrimaries(ft.workingColorSpace),W=v.colorSpace===wr?null:ft.getPrimaries(v.colorSpace),j=v.colorSpace===wr||le===W?n.NONE:n.BROWSER_DEFAULT_WEBGL;t.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,v.flipY),t.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),t.pixelStorei(n.UNPACK_ALIGNMENT,v.unpackAlignment),t.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);let fe=v.isCompressedTexture||v.image[0].isCompressedTexture,Pe=v.image[0]&&v.image[0].isDataTexture,ne=[];for(let re=0;re<6;re++)!fe&&!Pe?ne[re]=m(v.image[re],!0,r.maxCubemapSize):ne[re]=Pe?v.image[re].image:v.image[re],ne[re]=dn(v,ne[re]);let ae=ne[0],me=s.convert(v.format,v.colorSpace),ke=s.convert(v.type),lt=y(v.internalFormat,me,ke,v.normalized,v.colorSpace),B=v.isVideoTexture!==!0,ve=ie.__version===void 0||L===!0,ee=k.dataReady,_e=T(v,ae);ot(n.TEXTURE_CUBE_MAP,v);let Re;if(fe){B&&ve&&t.texStorage2D(n.TEXTURE_CUBE_MAP,_e,lt,ae.width,ae.height);for(let re=0;re<6;re++){Re=ne[re].mipmaps;for(let Xe=0;Xe<Re.length;Xe++){let Ue=Re[Xe];v.format!==An?me!==null?B?ee&&t.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,Xe,0,0,Ue.width,Ue.height,me,Ue.data):t.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,Xe,lt,Ue.width,Ue.height,0,Ue.data):Ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):B?ee&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,Xe,0,0,Ue.width,Ue.height,me,ke,Ue.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,Xe,lt,Ue.width,Ue.height,0,me,ke,Ue.data)}}}else{if(Re=v.mipmaps,B&&ve){Re.length>0&&_e++;let re=ht(ne[0]);t.texStorage2D(n.TEXTURE_CUBE_MAP,_e,lt,re.width,re.height)}for(let re=0;re<6;re++)if(Pe){B?ee&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,ne[re].width,ne[re].height,me,ke,ne[re].data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,lt,ne[re].width,ne[re].height,0,me,ke,ne[re].data);for(let Xe=0;Xe<Re.length;Xe++){let Ht=Re[Xe].image[re].image;B?ee&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,Xe+1,0,0,Ht.width,Ht.height,me,ke,Ht.data):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,Xe+1,lt,Ht.width,Ht.height,0,me,ke,Ht.data)}}else{B?ee&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,me,ke,ne[re]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,lt,me,ke,ne[re]);for(let Xe=0;Xe<Re.length;Xe++){let Ue=Re[Xe];B?ee&&t.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,Xe+1,0,0,me,ke,Ue.image[re]):t.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+re,Xe+1,lt,me,ke,Ue.image[re])}}}p(v)&&S(n.TEXTURE_CUBE_MAP),ie.__version=k.version,v.onUpdate&&v.onUpdate(v)}P.__version=v.version}function Se(P,v,E,L,k,ie){let le=s.convert(E.format,E.colorSpace),W=s.convert(E.type),j=y(E.internalFormat,le,W,E.normalized,E.colorSpace),fe=i.get(v),Pe=i.get(E);if(Pe.__renderTarget=v,!fe.__hasExternalTextures){let ne=Math.max(1,v.width>>ie),ae=Math.max(1,v.height>>ie);k===n.TEXTURE_3D||k===n.TEXTURE_2D_ARRAY?t.texImage3D(k,ie,j,ne,ae,v.depth,0,le,W,null):t.texImage2D(k,ie,j,ne,ae,0,le,W,null)}t.bindFramebuffer(n.FRAMEBUFFER,P),Nt(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,L,k,Pe.__webglTexture,0,Dt(v)):(k===n.TEXTURE_2D||k>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&k<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,L,k,Pe.__webglTexture,ie),t.bindFramebuffer(n.FRAMEBUFFER,null)}function de(P,v,E){if(n.bindRenderbuffer(n.RENDERBUFFER,P),v.depthBuffer){let L=v.depthTexture,k=L&&L.isDepthTexture?L.type:null,ie=A(v.stencilBuffer,k),le=v.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;Nt(v)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Dt(v),ie,v.width,v.height):E?n.renderbufferStorageMultisample(n.RENDERBUFFER,Dt(v),ie,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,ie,v.width,v.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,le,n.RENDERBUFFER,P)}else{let L=v.textures;for(let k=0;k<L.length;k++){let ie=L[k],le=s.convert(ie.format,ie.colorSpace),W=s.convert(ie.type),j=y(ie.internalFormat,le,W,ie.normalized,ie.colorSpace);Nt(v)?a.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,Dt(v),j,v.width,v.height):E?n.renderbufferStorageMultisample(n.RENDERBUFFER,Dt(v),j,v.width,v.height):n.renderbufferStorage(n.RENDERBUFFER,j,v.width,v.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function pe(P,v,E){let L=v.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(n.FRAMEBUFFER,P),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let k=i.get(v.depthTexture);if(k.__renderTarget=v,(!k.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),L){if(k.__webglInit===void 0&&(k.__webglInit=!0,v.depthTexture.addEventListener("dispose",R)),k.__webglTexture===void 0){k.__webglTexture=n.createTexture(),t.bindTexture(n.TEXTURE_CUBE_MAP,k.__webglTexture),ot(n.TEXTURE_CUBE_MAP,v.depthTexture);let fe=s.convert(v.depthTexture.format),Pe=s.convert(v.depthTexture.type),ne;v.depthTexture.format===Wi?ne=n.DEPTH_COMPONENT24:v.depthTexture.format===Zr&&(ne=n.DEPTH24_STENCIL8);for(let ae=0;ae<6;ae++)n.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+ae,0,ne,v.width,v.height,0,fe,Pe,null)}}else K(v.depthTexture,0);let ie=k.__webglTexture,le=Dt(v),W=L?n.TEXTURE_CUBE_MAP_POSITIVE_X+E:n.TEXTURE_2D,j=v.depthTexture.format===Zr?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;if(v.depthTexture.format===Wi)Nt(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,j,W,ie,0,le):n.framebufferTexture2D(n.FRAMEBUFFER,j,W,ie,0);else if(v.depthTexture.format===Zr)Nt(v)?a.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,j,W,ie,0,le):n.framebufferTexture2D(n.FRAMEBUFFER,j,W,ie,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Ae(P){let v=i.get(P),E=P.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==P.depthTexture){let L=P.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),L){let k=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,L.removeEventListener("dispose",k)};L.addEventListener("dispose",k),v.__depthDisposeCallback=k}v.__boundDepthTexture=L}if(P.depthTexture&&!v.__autoAllocateDepthBuffer)if(E)for(let L=0;L<6;L++)pe(v.__webglFramebuffer[L],P,L);else{let L=P.texture.mipmaps;L&&L.length>0?pe(v.__webglFramebuffer[0],P,0):pe(v.__webglFramebuffer,P,0)}else if(E){v.__webglDepthbuffer=[];for(let L=0;L<6;L++)if(t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[L]),v.__webglDepthbuffer[L]===void 0)v.__webglDepthbuffer[L]=n.createRenderbuffer(),de(v.__webglDepthbuffer[L],P,!1);else{let k=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ie=v.__webglDepthbuffer[L];n.bindRenderbuffer(n.RENDERBUFFER,ie),n.framebufferRenderbuffer(n.FRAMEBUFFER,k,n.RENDERBUFFER,ie)}}else{let L=P.texture.mipmaps;if(L&&L.length>0?t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(n.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=n.createRenderbuffer(),de(v.__webglDepthbuffer,P,!1);else{let k=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,ie=v.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,ie),n.framebufferRenderbuffer(n.FRAMEBUFFER,k,n.RENDERBUFFER,ie)}}t.bindFramebuffer(n.FRAMEBUFFER,null)}function We(P,v,E){let L=i.get(P);v!==void 0&&Se(L.__webglFramebuffer,P,P.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),E!==void 0&&Ae(P)}function xt(P){let v=P.texture,E=i.get(P),L=i.get(v);P.addEventListener("dispose",x);let k=P.textures,ie=P.isWebGLCubeRenderTarget===!0,le=k.length>1;if(le||(L.__webglTexture===void 0&&(L.__webglTexture=n.createTexture()),L.__version=v.version,o.memory.textures++),ie){E.__webglFramebuffer=[];for(let W=0;W<6;W++)if(v.mipmaps&&v.mipmaps.length>0){E.__webglFramebuffer[W]=[];for(let j=0;j<v.mipmaps.length;j++)E.__webglFramebuffer[W][j]=n.createFramebuffer()}else E.__webglFramebuffer[W]=n.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){E.__webglFramebuffer=[];for(let W=0;W<v.mipmaps.length;W++)E.__webglFramebuffer[W]=n.createFramebuffer()}else E.__webglFramebuffer=n.createFramebuffer();if(le)for(let W=0,j=k.length;W<j;W++){let fe=i.get(k[W]);fe.__webglTexture===void 0&&(fe.__webglTexture=n.createTexture(),o.memory.textures++)}if(P.samples>0&&Nt(P)===!1){E.__webglMultisampledFramebuffer=n.createFramebuffer(),E.__webglColorRenderbuffer=[],t.bindFramebuffer(n.FRAMEBUFFER,E.__webglMultisampledFramebuffer);for(let W=0;W<k.length;W++){let j=k[W];E.__webglColorRenderbuffer[W]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,E.__webglColorRenderbuffer[W]);let fe=s.convert(j.format,j.colorSpace),Pe=s.convert(j.type),ne=y(j.internalFormat,fe,Pe,j.normalized,j.colorSpace,P.isXRRenderTarget===!0),ae=Dt(P);n.renderbufferStorageMultisample(n.RENDERBUFFER,ae,ne,P.width,P.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+W,n.RENDERBUFFER,E.__webglColorRenderbuffer[W])}n.bindRenderbuffer(n.RENDERBUFFER,null),P.depthBuffer&&(E.__webglDepthRenderbuffer=n.createRenderbuffer(),de(E.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(n.FRAMEBUFFER,null)}}if(ie){t.bindTexture(n.TEXTURE_CUBE_MAP,L.__webglTexture),ot(n.TEXTURE_CUBE_MAP,v);for(let W=0;W<6;W++)if(v.mipmaps&&v.mipmaps.length>0)for(let j=0;j<v.mipmaps.length;j++)Se(E.__webglFramebuffer[W][j],P,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+W,j);else Se(E.__webglFramebuffer[W],P,v,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+W,0);p(v)&&S(n.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(le){for(let W=0,j=k.length;W<j;W++){let fe=k[W],Pe=i.get(fe),ne=n.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(ne=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(ne,Pe.__webglTexture),ot(ne,fe),Se(E.__webglFramebuffer,P,fe,n.COLOR_ATTACHMENT0+W,ne,0),p(fe)&&S(ne)}t.unbindTexture()}else{let W=n.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(W=P.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),t.bindTexture(W,L.__webglTexture),ot(W,v),v.mipmaps&&v.mipmaps.length>0)for(let j=0;j<v.mipmaps.length;j++)Se(E.__webglFramebuffer[j],P,v,n.COLOR_ATTACHMENT0,W,j);else Se(E.__webglFramebuffer,P,v,n.COLOR_ATTACHMENT0,W,0);p(v)&&S(W),t.unbindTexture()}P.depthBuffer&&Ae(P)}function xe(P){let v=P.textures;for(let E=0,L=v.length;E<L;E++){let k=v[E];if(p(k)){let ie=b(P),le=i.get(k).__webglTexture;t.bindTexture(ie,le),S(ie),t.unbindTexture()}}}let ye=[],Qe=[];function Ft(P){if(P.samples>0){if(Nt(P)===!1){let v=P.textures,E=P.width,L=P.height,k=n.COLOR_BUFFER_BIT,ie=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,le=i.get(P),W=v.length>1;if(W)for(let fe=0;fe<v.length;fe++)t.bindFramebuffer(n.FRAMEBUFFER,le.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.RENDERBUFFER,null),t.bindFramebuffer(n.FRAMEBUFFER,le.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.TEXTURE_2D,null,0);t.bindFramebuffer(n.READ_FRAMEBUFFER,le.__webglMultisampledFramebuffer);let j=P.texture.mipmaps;j&&j.length>0?t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglFramebuffer[0]):t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglFramebuffer);for(let fe=0;fe<v.length;fe++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(k|=n.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(k|=n.STENCIL_BUFFER_BIT)),W){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,le.__webglColorRenderbuffer[fe]);let Pe=i.get(v[fe]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,Pe,0)}n.blitFramebuffer(0,0,E,L,0,0,E,L,k,n.NEAREST),l===!0&&(ye.length=0,Qe.length=0,ye.push(n.COLOR_ATTACHMENT0+fe),P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&(ye.push(ie),Qe.push(ie),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,Qe)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,ye))}if(t.bindFramebuffer(n.READ_FRAMEBUFFER,null),t.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),W)for(let fe=0;fe<v.length;fe++){t.bindFramebuffer(n.FRAMEBUFFER,le.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.RENDERBUFFER,le.__webglColorRenderbuffer[fe]);let Pe=i.get(v[fe]).__webglTexture;t.bindFramebuffer(n.FRAMEBUFFER,le.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+fe,n.TEXTURE_2D,Pe,0)}t.bindFramebuffer(n.DRAW_FRAMEBUFFER,le.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&l){let v=P.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[v])}}}function Dt(P){return Math.min(r.maxSamples,P.samples)}function Nt(P){let v=i.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function F(P){let v=o.render.frame;u.get(P)!==v&&(u.set(P,v),P.update())}function dn(P,v){let E=P.colorSpace,L=P.format,k=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||E!==Es&&E!==wr&&(ft.getTransfer(E)===It?(L!==An||k!==li)&&Ke("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):tt("WebGLTextures: Unsupported texture color space:",E)),v}function ht(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=Z,this.resetTextureUnits=z,this.getTextureUnits=N,this.setTextureUnits=V,this.setTexture2D=K,this.setTexture2DArray=q,this.setTexture3D=J,this.setTextureCube=te,this.rebindTextures=We,this.setupRenderTarget=xt,this.updateRenderTargetMipmap=xe,this.updateMultisampleRenderTarget=Ft,this.setupDepthRenderbuffer=Ae,this.setupFrameBufferTexture=Se,this.useMultisampledRTT=Nt,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function sw(n,e){function t(i,r=wr){let s,o=ft.getTransfer(r);if(i===li)return n.UNSIGNED_BYTE;if(i===Lu)return n.UNSIGNED_SHORT_4_4_4_4;if(i===Du)return n.UNSIGNED_SHORT_5_5_5_1;if(i===Pd)return n.UNSIGNED_INT_5_9_9_9_REV;if(i===Ld)return n.UNSIGNED_INT_10F_11F_11F_REV;if(i===Cd)return n.BYTE;if(i===Id)return n.SHORT;if(i===Do)return n.UNSIGNED_SHORT;if(i===Pu)return n.INT;if(i===Ni)return n.UNSIGNED_INT;if(i===vi)return n.FLOAT;if(i===Nn)return n.HALF_FLOAT;if(i===Dd)return n.ALPHA;if(i===Nd)return n.RGB;if(i===An)return n.RGBA;if(i===Wi)return n.DEPTH_COMPONENT;if(i===Zr)return n.DEPTH_STENCIL;if(i===Nu)return n.RED;if(i===Fu)return n.RED_INTEGER;if(i===Kr)return n.RG;if(i===Ou)return n.RG_INTEGER;if(i===Uu)return n.RGBA_INTEGER;if(i===il||i===rl||i===sl||i===ol)if(o===It)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===il)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===rl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===sl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===ol)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===il)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===rl)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===sl)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===ol)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Bu||i===ku||i===zu||i===Vu)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Bu)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===ku)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===zu)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Vu)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Gu||i===Hu||i===Wu||i===Xu||i===Yu||i===al||i===$u)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Gu||i===Hu)return o===It?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Wu)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===Xu)return s.COMPRESSED_R11_EAC;if(i===Yu)return s.COMPRESSED_SIGNED_R11_EAC;if(i===al)return s.COMPRESSED_RG11_EAC;if(i===$u)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===qu||i===ju||i===Zu||i===Ku||i===Ju||i===Qu||i===eh||i===th||i===nh||i===ih||i===rh||i===sh||i===oh||i===ah)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===qu)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===ju)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Zu)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Ku)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Ju)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Qu)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===eh)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===th)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===nh)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===ih)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===rh)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===sh)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===oh)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===ah)return o===It?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===lh||i===ch||i===uh)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===lh)return o===It?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ch)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===uh)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===hh||i===fh||i===ll||i===dh)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===hh)return s.COMPRESSED_RED_RGTC1_EXT;if(i===fh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ll)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===dh)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===No?n.UNSIGNED_INT_24_8:n[i]!==void 0?n[i]:null}return{convert:t}}var ow=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,aw=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,ap=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let i=new Xa(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,i=new bt({vertexShader:ow,fragmentShader:aw,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Lt(new Mr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},lp=class extends Xi{constructor(e,t){super();let i=this,r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,d=null,h=null,f=null,g=null,_=typeof XRWebGLBinding<"u",m=new ap,p={},S=t.getContextAttributes(),b=null,y=null,A=[],T=[],R=new nt,x=null,w=null,C=new Ln;C.viewport=new Gt;let D=new Ln;D.viewport=new Gt;let O=[C,D],z=new Eu,N=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let Q=A[Y];return Q===void 0&&(Q=new To,A[Y]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(Y){let Q=A[Y];return Q===void 0&&(Q=new To,A[Y]=Q),Q.getGripSpace()},this.getHand=function(Y){let Q=A[Y];return Q===void 0&&(Q=new To,A[Y]=Q),Q.getHandSpace()};function Z(Y){let Q=T.indexOf(Y.inputSource);if(Q===-1)return;let ge=A[Q];ge!==void 0&&(ge.update(Y.inputSource,Y.frame,c||o),ge.dispatchEvent({type:Y.type,data:Y.inputSource}))}function X(){r.removeEventListener("select",Z),r.removeEventListener("selectstart",Z),r.removeEventListener("selectend",Z),r.removeEventListener("squeeze",Z),r.removeEventListener("squeezestart",Z),r.removeEventListener("squeezeend",Z),r.removeEventListener("end",X),r.removeEventListener("inputsourceschange",K);for(let Y=0;Y<A.length;Y++){let Q=T[Y];Q!==null&&(T[Y]=null,A[Y].disconnect(Q))}N=null,V=null,m.reset();for(let Y in p)delete p[Y];if(e.setRenderTarget(b),f=null,h=null,d=null,r=null,y=null,rt.stop(),i.isPresenting=!1,e.setPixelRatio(x),e.setSize(R.width,R.height,!1),w!==null){let Y=w.camera;Y.fov=w.fov,Y.zoom=w.zoom,Y.updateProjectionMatrix(),w=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){s=Y,i.isPresenting===!0&&Ke("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){a=Y,i.isPresenting===!0&&Ke("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return d===null&&_&&(d=new XRWebGLBinding(r,t)),d},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(Y){if(r=Y,r!==null){if(b=e.getRenderTarget(),r.addEventListener("select",Z),r.addEventListener("selectstart",Z),r.addEventListener("selectend",Z),r.addEventListener("squeeze",Z),r.addEventListener("squeezestart",Z),r.addEventListener("squeezeend",Z),r.addEventListener("end",X),r.addEventListener("inputsourceschange",K),S.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(R),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let ge=null,qe=null,Se=null;S.depth&&(Se=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ge=S.stencil?Zr:Wi,qe=S.stencil?No:Ni);let de={colorFormat:t.RGBA8,depthFormat:Se,scaleFactor:s};d=this.getBinding(),h=d.createProjectionLayer(de),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),y=new gn(h.textureWidth,h.textureHeight,{format:An,type:li,depthTexture:new Wr(h.textureWidth,h.textureHeight,qe,void 0,void 0,void 0,void 0,void 0,void 0,ge),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let ge={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,t,ge),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),y=new gn(f.framebufferWidth,f.framebufferHeight,{format:An,type:li,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),rt.setContext(r),rt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function K(Y){for(let Q=0;Q<Y.removed.length;Q++){let ge=Y.removed[Q],qe=T.indexOf(ge);qe>=0&&(T[qe]=null,A[qe].disconnect(ge))}for(let Q=0;Q<Y.added.length;Q++){let ge=Y.added[Q],qe=T.indexOf(ge);if(qe===-1){for(let de=0;de<A.length;de++)if(de>=T.length){T.push(ge),qe=de;break}else if(T[de]===null){T[de]=ge,qe=de;break}if(qe===-1)break}let Se=A[qe];Se&&Se.connect(ge)}}let q=new I,J=new I;function te(Y,Q,ge){q.setFromMatrixPosition(Q.matrixWorld),J.setFromMatrixPosition(ge.matrixWorld);let qe=q.distanceTo(J),Se=Q.projectionMatrix.elements,de=ge.projectionMatrix.elements,pe=Se[14]/(Se[10]-1),Ae=Se[14]/(Se[10]+1),We=(Se[9]+1)/Se[5],xt=(Se[9]-1)/Se[5],xe=(Se[8]-1)/Se[0],ye=(de[8]+1)/de[0],Qe=pe*xe,Ft=pe*ye,Dt=qe/(-xe+ye),Nt=Dt*-xe;if(Q.matrixWorld.decompose(Y.position,Y.quaternion,Y.scale),Y.translateX(Nt),Y.translateZ(Dt),Y.matrixWorld.compose(Y.position,Y.quaternion,Y.scale),Y.matrixWorldInverse.copy(Y.matrixWorld).invert(),Se[10]===-1)Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse);else{let F=pe+Dt,dn=Ae+Dt,ht=Qe-Nt,P=Ft+(qe-Nt),v=We*Ae/dn*F,E=xt*Ae/dn*F;Y.projectionMatrix.makePerspective(ht,P,v,E,F,dn),Y.projectionMatrixInverse.copy(Y.projectionMatrix).invert()}}function Be(Y,Q){Q===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(Q.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(r===null)return;let Q=Y.near,ge=Y.far;m.texture!==null&&(m.depthNear>0&&(Q=m.depthNear),m.depthFar>0&&(ge=m.depthFar)),z.near=D.near=C.near=Q,z.far=D.far=C.far=ge,(N!==z.near||V!==z.far)&&(r.updateRenderState({depthNear:z.near,depthFar:z.far}),N=z.near,V=z.far),z.layers.mask=Y.layers.mask|6,C.layers.mask=z.layers.mask&-5,D.layers.mask=z.layers.mask&-3;let qe=Y.parent,Se=z.cameras;Be(z,qe);for(let de=0;de<Se.length;de++)Be(Se[de],qe);Se.length===2?te(z,C,D):z.projectionMatrix.copy(C.projectionMatrix),w===null&&Y.isPerspectiveCamera&&(w={camera:Y,fov:Y.fov,zoom:Y.zoom}),Le(Y,z,qe)};function Le(Y,Q,ge){ge===null?Y.matrix.copy(Q.matrixWorld):(Y.matrix.copy(ge.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(Q.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(Q.projectionMatrix),Y.projectionMatrixInverse.copy(Q.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Qc*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(Y){l=Y,h!==null&&(h.fixedFoveation=Y),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=Y)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(z)},this.getCameraTexture=function(Y){return p[Y]};let dt=null;function ot(Y,Q){if(u=Q.getViewerPose(c||o),g=Q,u!==null){let ge=u.views;f!==null&&(e.setRenderTargetFramebuffer(y,f.framebuffer),e.setRenderTarget(y));let qe=!1;ge.length!==z.cameras.length&&(z.cameras.length=0,qe=!0);for(let Ae=0;Ae<ge.length;Ae++){let We=ge[Ae],xt=null;if(f!==null)xt=f.getViewport(We);else{let ye=d.getViewSubImage(h,We);xt=ye.viewport,Ae===0&&(e.setRenderTargetTextures(y,ye.colorTexture,ye.depthStencilTexture),e.setRenderTarget(y))}let xe=O[Ae];xe===void 0&&(xe=new Ln,xe.layers.enable(Ae),xe.viewport=new Gt,O[Ae]=xe),xe.matrix.fromArray(We.transform.matrix),xe.matrix.decompose(xe.position,xe.quaternion,xe.scale),xe.projectionMatrix.fromArray(We.projectionMatrix),xe.projectionMatrixInverse.copy(xe.projectionMatrix).invert(),xe.viewport.set(xt.x,xt.y,xt.width,xt.height),Ae===0&&(z.matrix.copy(xe.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),qe===!0&&z.cameras.push(xe)}let Se=r.enabledFeatures;if(Se&&Se.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&_){d=i.getBinding();let Ae=d.getDepthInformation(ge[0]);Ae&&Ae.isValid&&Ae.texture&&m.init(Ae,r.renderState)}if(Se&&Se.includes("camera-access")&&_){e.state.unbindTexture(),d=i.getBinding();for(let Ae=0;Ae<ge.length;Ae++){let We=ge[Ae].camera;if(We){let xt=p[We];xt||(xt=new Xa,p[We]=xt);let xe=d.getCameraImage(We);xt.sourceTexture=xe}}}}for(let ge=0;ge<A.length;ge++){let qe=T[ge],Se=A[ge];qe!==null&&Se!==void 0&&Se.update(qe,Q,c||o)}dt&&dt(Y,Q),Q.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:Q}),g=null}let rt=new jg;rt.setAnimationLoop(ot),this.setAnimationLoop=function(Y){dt=Y},this.dispose=function(){}}},lw=new vt,tx=new at;tx.set(-1,0,0,0,1,0,0,0,1);function cw(n,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,kd(n)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,S,b,y){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?s(m,p):p.isMeshLambertMaterial?(s(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(s(m,p),d(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(s(m,p),h(m,p),p.isMeshPhysicalMaterial&&f(m,p,y)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,S,b):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===Hn&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===Hn&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let S=e.get(p),b=S.envMap,y=S.envMapRotation;b&&(m.envMap.value=b,m.envMapRotation.value.setFromMatrix4(lw.makeRotationFromEuler(y)).transpose(),b.isCubeTexture&&b.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(tx),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,S,b){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*S,m.scale.value=b*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function d(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,S){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Hn&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=S.texture,m.transmissionSamplerSize.value.set(S.width,S.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){let S=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(S.matrixWorld),m.nearDistance.value=S.shadow.camera.near,m.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function uw(n,e,t,i){let r={},s={},o=[],a=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,A){let T=A.program;i.uniformBlockBinding(y,T)}function c(y,A){let T=r[y.id];T===void 0&&(m(y),T=u(y),r[y.id]=T,y.addEventListener("dispose",S));let R=A.program;i.updateUBOMapping(y,R);let x=e.render.frame;s[y.id]!==x&&(h(y),s[y.id]=x)}function u(y){let A=d();y.__bindingPointIndex=A;let T=n.createBuffer(),R=y.__size,x=y.usage;return n.bindBuffer(n.UNIFORM_BUFFER,T),n.bufferData(n.UNIFORM_BUFFER,R,x),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,A,T),T}function d(){for(let y=0;y<a;y++)if(o.indexOf(y)===-1)return o.push(y),y;return tt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(y){let A=r[y.id],T=y.uniforms,R=y.__cache;n.bindBuffer(n.UNIFORM_BUFFER,A);for(let x=0,w=T.length;x<w;x++){let C=T[x];if(Array.isArray(C))for(let D=0,O=C.length;D<O;D++)f(C[D],x,D,R);else f(C,x,0,R)}n.bindBuffer(n.UNIFORM_BUFFER,null)}function f(y,A,T,R){if(_(y,A,T,R)===!0){let x=y.__offset,w=y.value;if(Array.isArray(w)){let C=0;for(let D=0;D<w.length;D++){let O=w[D],z=p(O);g(O,y.__data,C),typeof O!="number"&&typeof O!="boolean"&&!O.isMatrix3&&!ArrayBuffer.isView(O)&&(C+=z.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(w,y.__data,0);n.bufferSubData(n.UNIFORM_BUFFER,x,y.__data)}}function g(y,A,T){typeof y=="number"||typeof y=="boolean"?A[0]=y:y.isMatrix3?(A[0]=y.elements[0],A[1]=y.elements[1],A[2]=y.elements[2],A[3]=0,A[4]=y.elements[3],A[5]=y.elements[4],A[6]=y.elements[5],A[7]=0,A[8]=y.elements[6],A[9]=y.elements[7],A[10]=y.elements[8],A[11]=0):ArrayBuffer.isView(y)?A.set(new y.constructor(y.buffer,y.byteOffset,A.length)):y.toArray(A,T)}function _(y,A,T,R){let x=y.value,w=A+"_"+T;if(R[w]===void 0)return typeof x=="number"||typeof x=="boolean"?R[w]=x:ArrayBuffer.isView(x)?R[w]=x.slice():R[w]=x.clone(),!0;{let C=R[w];if(typeof x=="number"||typeof x=="boolean"){if(C!==x)return R[w]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(C.equals(x)===!1)return C.copy(x),!0}}return!1}function m(y){let A=y.uniforms,T=0,R=16;for(let w=0,C=A.length;w<C;w++){let D=Array.isArray(A[w])?A[w]:[A[w]];for(let O=0,z=D.length;O<z;O++){let N=D[O],V=Array.isArray(N.value)?N.value:[N.value];for(let Z=0,X=V.length;Z<X;Z++){let K=V[Z],q=p(K),J=T%R,te=J%q.boundary,Be=J+te;T+=te,Be!==0&&R-Be<q.storage&&(T+=R-Be),N.__data=new Float32Array(q.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=T,T+=q.storage}}}let x=T%R;return x>0&&(T+=R-x),y.__size=T,y.__cache={},this}function p(y){let A={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(A.boundary=4,A.storage=4):y.isVector2?(A.boundary=8,A.storage=8):y.isVector3||y.isColor?(A.boundary=16,A.storage=12):y.isVector4?(A.boundary=16,A.storage=16):y.isMatrix3?(A.boundary=48,A.storage=48):y.isMatrix4?(A.boundary=64,A.storage=64):y.isTexture?Ke("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(A.boundary=16,A.storage=y.byteLength):Ke("WebGLRenderer: Unsupported uniform value type.",y),A}function S(y){let A=y.target;A.removeEventListener("dispose",S);let T=o.indexOf(A.__bindingPointIndex);o.splice(T,1),n.deleteBuffer(r[A.id]),delete r[A.id],delete s[A.id]}function b(){for(let y in r)n.deleteBuffer(r[y]);o=[],r={},s={}}return{bind:l,update:c,dispose:b}}var hw=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Zi=null;function fw(){return Zi===null&&(Zi=new ka(hw,16,16,Kr,Nn),Zi.name="DFG_LUT",Zi.minFilter=yt,Zi.magFilter=yt,Zi.wrapS=Dn,Zi.wrapT=Dn,Zi.generateMipmaps=!1,Zi.needsUpdate=!0),Zi}var _h=class{constructor(e={}){let{canvas:t=_g(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:d=!1,reversedDepthBuffer:h=!1,outputBufferType:f=li}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=o;let _=f,m=new Set([Uu,Ou,Fu]),p=new Set([li,Ni,Do,No,Lu,Du]),S=new Uint32Array(4),b=new Int32Array(4),y=new I,A=null,T=null,R=[],x=[],w=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ai,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let C=this,D=!1,O=null,z=null,N=null,V=null;this._outputColorSpace=si;let Z=0,X=0,K=null,q=-1,J=null,te=new Gt,Be=new Gt,Le=null,dt=new gt(0),ot=0,rt=t.width,Y=t.height,Q=1,ge=null,qe=null,Se=new Gt(0,0,rt,Y),de=new Gt(0,0,rt,Y),pe=!1,Ae=new Va,We=!1,xt=!1,xe=new vt,ye=new I,Qe=new Gt,Ft={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Dt=!1;function Nt(){return K===null?Q:1}let F=i;function dn(M,U){return t.getContext(M,U)}let ht,P,v,E,L,k,ie,le,W,j,fe,Pe,ne,ae,me,ke,lt,B,ve,ee,_e,Re,re;try{let M={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"186"}`),t.addEventListener("webglcontextlost",Ht,!1),t.addEventListener("webglcontextrestored",At,!1),t.addEventListener("webglcontextcreationerror",Ei,!1),F===null){let U="webgl2";if(F=dn(U,M),F===null)throw dn(U)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Xe()}catch(M){throw t.removeEventListener("webglcontextlost",Ht,!1),t.removeEventListener("webglcontextrestored",At,!1),t.removeEventListener("webglcontextcreationerror",Ei,!1),tt("WebGLRenderer: "+M.message),M}function Xe(){ht=new yb(F),ht.init(),_e=new sw(F,ht),P=new cb(F,ht,e,_e),v=new iw(F,ht),P.reversedDepthBuffer&&h&&v.buffers.depth.setReversed(!0),z=F.createFramebuffer(),N=F.createFramebuffer(),V=F.createFramebuffer(),E=new Sb(F),L=new H1,k=new rw(F,ht,v,L,P,_e,E),ie=new vb(C),le=new w_(F),Re=new ab(F,le),W=new _b(F,le,E,Re),j=new wb(F,W,le,Re,E),B=new bb(F,P,k),me=new ub(L),fe=new G1(C,ie,ht,P,Re,me),Pe=new cw(C,L),ne=new X1,ae=new K1(ht),lt=new ob(C,ie,v,j,g,l),ke=new nw(C,j,P),re=new uw(F,E,P,v),ve=new lb(F,ht,E),ee=new Mb(F,ht,E),E.programs=fe.programs,C.capabilities=P,C.extensions=ht,C.properties=L,C.renderLists=ne,C.shadowMap=ke,C.state=v,C.info=E}_!==li&&(w=new Ab(_,t.width,t.height,a,r,s));let Ue=new lp(C,F);this.xr=Ue,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let M=ht.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=ht.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return Q},this.setPixelRatio=function(M){M!==void 0&&(Q=M,this.setSize(rt,Y,!1))},this.getSize=function(M){return M.set(rt,Y)},this.setSize=function(M,U,$=!0){if(Ue.isPresenting){Ke("WebGLRenderer: Can't change size while VR device is presenting.");return}rt=M,Y=U,t.width=Math.floor(M*Q),t.height=Math.floor(U*Q),$===!0&&(t.style.width=M+"px",t.style.height=U+"px"),w!==null&&w.setSize(t.width,t.height),this.setViewport(0,0,M,U)},this.getDrawingBufferSize=function(M){return M.set(rt*Q,Y*Q).floor()},this.setDrawingBufferSize=function(M,U,$){rt=M,Y=U,Q=$,t.width=Math.floor(M*$),t.height=Math.floor(U*$),this.setViewport(0,0,M,U)},this.setEffects=function(M){if(_===li){tt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let U=0;U<M.length;U++)if(M[U].isOutputPass===!0){Ke("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}w.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(te)},this.getViewport=function(M){return M.copy(Se)},this.setViewport=function(M,U,$,G){M.isVector4?Se.set(M.x,M.y,M.z,M.w):Se.set(M,U,$,G),v.viewport(te.copy(Se).multiplyScalar(Q).round())},this.getScissor=function(M){return M.copy(de)},this.setScissor=function(M,U,$,G){M.isVector4?de.set(M.x,M.y,M.z,M.w):de.set(M,U,$,G),v.scissor(Be.copy(de).multiplyScalar(Q).round())},this.getScissorTest=function(){return pe},this.setScissorTest=function(M){v.setScissorTest(pe=M)},this.setOpaqueSort=function(M){ge=M},this.setTransparentSort=function(M){qe=M},this.getClearColor=function(M){return M.copy(lt.getClearColor())},this.setClearColor=function(){lt.setClearColor(...arguments)},this.getClearAlpha=function(){return lt.getClearAlpha()},this.setClearAlpha=function(){lt.setClearAlpha(...arguments)},this.clear=function(M=!0,U=!0,$=!0){let G=0;if(M){let H=!1;if(K!==null){let Ce=K.texture.format;H=m.has(Ce)}if(H){let Ce=K.texture.type,Fe=p.has(Ce),Te=lt.getClearColor(),ze=lt.getClearAlpha(),Ye=Te.r,ct=Te.g,pt=Te.b;Fe?(S[0]=Ye,S[1]=ct,S[2]=pt,S[3]=ze,F.clearBufferuiv(F.COLOR,0,S)):(b[0]=Ye,b[1]=ct,b[2]=pt,b[3]=ze,F.clearBufferiv(F.COLOR,0,b))}else G|=F.COLOR_BUFFER_BIT}U&&(G|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),$&&(G|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),G!==0&&F.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),O=M},this.dispose=function(){t.removeEventListener("webglcontextlost",Ht,!1),t.removeEventListener("webglcontextrestored",At,!1),t.removeEventListener("webglcontextcreationerror",Ei,!1),lt.dispose(),ne.dispose(),ae.dispose(),L.dispose(),ie.dispose(),j.dispose(),Re.dispose(),re.dispose(),fe.dispose(),Ue.dispose(),Ue.removeEventListener("sessionstart",wm),Ue.removeEventListener("sessionend",Em),ps.stop()};function Ht(M){M.preventDefault(),Na("WebGLRenderer: Context Lost."),D=!0}function At(){Na("WebGLRenderer: Context Restored."),D=!1;let M=E.autoReset,U=ke.enabled,$=ke.autoUpdate,G=ke.needsUpdate,H=ke.type;Xe(),E.autoReset=M,ke.enabled=U,ke.autoUpdate=$,ke.needsUpdate=G,ke.type=H}function Ei(M){tt("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function zi(M){let U=M.target;U.removeEventListener("dispose",zi),uy(U)}function uy(M){hy(M),L.remove(M)}function hy(M){let U=L.get(M).programs;U!==void 0&&(U.forEach(function($){fe.releaseProgram($)}),M.isShaderMaterial&&fe.releaseShaderCache(M))}this.renderBufferDirect=function(M,U,$,G,H,Ce){U===null&&(U=Ft);let Fe=H.isMesh&&H.matrixWorld.determinantAffine()<0,Te=py(M,U,$,G,H);v.setMaterial(G,Fe);let ze=$.index,Ye=1;if(G.wireframe===!0){if(ze=W.getWireframeAttribute($),ze===void 0)return;Ye=2}let ct=$.drawRange,pt=$.attributes.position,Ve=ct.start*Ye,Tt=(ct.start+ct.count)*Ye;Ce!==null&&(Ve=Math.max(Ve,Ce.start*Ye),Tt=Math.min(Tt,(Ce.start+Ce.count)*Ye)),ze!==null?(Ve=Math.max(Ve,0),Tt=Math.min(Tt,ze.count)):pt!=null&&(Ve=Math.max(Ve,0),Tt=Math.min(Tt,pt.count));let pn=Tt-Ve;if(pn<0||pn===1/0)return;Re.setup(H,G,Te,$,ze);let $t,zt=ve;if(ze!==null&&($t=le.get(ze),zt=ee,zt.setIndex($t)),H.isMesh)G.wireframe===!0?(v.setLineWidth(G.wireframeLinewidth*Nt()),zt.setMode(F.LINES)):zt.setMode(F.TRIANGLES);else if(H.isLine){let Cn=G.linewidth;Cn===void 0&&(Cn=1),v.setLineWidth(Cn*Nt()),H.isLineSegments?zt.setMode(F.LINES):H.isLineLoop?zt.setMode(F.LINE_LOOP):zt.setMode(F.LINE_STRIP)}else H.isPoints?zt.setMode(F.POINTS):H.isSprite&&zt.setMode(F.TRIANGLES);if(H.isBatchedMesh)if(ht.get("WEBGL_multi_draw"))zt.renderMultiDraw(H._multiDrawStarts,H._multiDrawCounts,H._multiDrawCount);else{let Cn=H._multiDrawStarts,De=H._multiDrawCounts,kn=H._multiDrawCount,Mt=ze?le.get(ze).bytesPerElement:1,pi=L.get(G).currentProgram.getUniforms();for(let Vi=0;Vi<kn;Vi++)pi.setValue(F,"_gl_DrawID",Vi),zt.render(Cn[Vi]/Mt,De[Vi])}else if(H.isInstancedMesh)zt.renderInstances(Ve,pn,H.count);else if($.isInstancedBufferGeometry){let Cn=$._maxInstanceCount!==void 0?$._maxInstanceCount:1/0,De=Math.min($.instanceCount,Cn);zt.renderInstances(Ve,pn,De)}else zt.render(Ve,pn)};function bm(M,U,$,G){O!==null&&M.isNodeMaterial&&O.setObject(G,M),We===!0&&me.setState(M,$,!1),M.transparent===!0&&M.side===ji&&M.forceSinglePass===!1?(M.side=Hn,M.needsUpdate=!0,tc(M,U,G),M.side=qi,M.needsUpdate=!0,tc(M,U,G),M.side=ji):tc(M,U,G)}this.compile=function(M,U,$=null){$===null&&($=M),O!==null&&O.renderStart(M,U,$),T=ae.get($),T.init(U),x.push(T),$.traverseVisible(function(H){H.isLight&&H.layers.test(U.layers)&&(T.pushLight(H),H.castShadow&&T.pushShadow(H))}),M!==$&&M.traverseVisible(function(H){H.isLight&&H.layers.test(U.layers)&&(T.pushLight(H),H.castShadow&&T.pushShadow(H))}),T.setupLights(),O!==null&&O.updateLights(T.state.lightsArray),xt=this.localClippingEnabled,We=me.init(this.clippingPlanes,xt),We===!0&&me.setGlobalState(this.clippingPlanes,U),O!==null&&ke.render(T.state.shadowsArray,$,U);let G=new Set;return M.traverse(function(H){if(!(H.isMesh||H.isPoints||H.isLine||H.isSprite))return;let Ce=H.material;if(Ce)if(Array.isArray(Ce))for(let Fe=0;Fe<Ce.length;Fe++){let Te=Ce[Fe];bm(Te,$,U,H),G.add(Te)}else bm(Ce,$,U,H),G.add(Ce)}),T=x.pop(),O!==null&&O.renderEnd(),G},this.compileAsync=function(M,U,$=null){let G=this.compile(M,U,$);return new Promise(H=>{function Ce(){if(G.forEach(function(Fe){let ze=L.get(Fe).currentProgram;(ze===void 0||ze.isReady())&&G.delete(Fe)}),G.size===0){H(M);return}setTimeout(Ce,10)}ht.get("KHR_parallel_shader_compile")!==null?Ce():setTimeout(Ce,10)})};let vf=null;function fy(M){vf&&vf(M)}function wm(){ps.stop()}function Em(){ps.start()}let ps=new jg;ps.setAnimationLoop(fy),typeof self<"u"&&ps.setContext(self),this.setAnimationLoop=function(M){vf=M,Ue.setAnimationLoop(M),M===null?ps.stop():ps.start()},Ue.addEventListener("sessionstart",wm),Ue.addEventListener("sessionend",Em),this.render=function(M,U){if(U!==void 0&&U.isCamera!==!0){tt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;O!==null&&O.renderStart(M,U);let $=Ue.enabled===!0&&Ue.isPresenting===!0,G=w!==null&&(K===null||$)&&w.begin(C,K);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),Ue.enabled===!0&&Ue.isPresenting===!0&&(w===null||w.isCompositing()===!1)&&(Ue.cameraAutoUpdate===!0&&Ue.updateCamera(U),U=Ue.getCamera()),M.isScene===!0&&M.onBeforeRender(C,M,U,K),T=ae.get(M,x.length),T.init(U),T.state.textureUnits=k.getTextureUnits(),x.push(T),xe.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Ae.setFromProjectionMatrix(xe,Li,U.reversedDepth),xt=this.localClippingEnabled,We=me.init(this.clippingPlanes,xt),A=ne.get(M,R.length),A.init(),R.push(A),Ue.enabled===!0&&Ue.isPresenting===!0){let Fe=C.xr.getDepthSensingMesh();Fe!==null&&yf(Fe,U,-1/0,C.sortObjects)}yf(M,U,0,C.sortObjects),A.finish(),O!==null&&O.updateLights(T.state.lightsArray),C.sortObjects===!0&&A.sort(ge,qe),Dt=Ue.enabled===!1||Ue.isPresenting===!1||Ue.hasDepthSensing()===!1,Dt&&lt.addToRenderList(A,M),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),We===!0&&me.beginShadows();let H=T.state.shadowsArray;if(ke.render(H,M,U),We===!0&&me.endShadows(),(G&&w.hasRenderPass())===!1){let Fe=A.opaque,Te=A.transmissive;if(T.setupLights(),U.isArrayCamera){let ze=U.cameras;if(Te.length>0)for(let Ye=0,ct=ze.length;Ye<ct;Ye++){let pt=ze[Ye];Tm(Fe,Te,M,pt)}Dt&&lt.render(M);for(let Ye=0,ct=ze.length;Ye<ct;Ye++){let pt=ze[Ye];Am(A,M,pt,pt.viewport)}}else Te.length>0&&Tm(Fe,Te,M,U),Dt&&lt.render(M),Am(A,M,U)}K!==null&&X===0&&(k.updateMultisampleRenderTarget(K),k.updateRenderTargetMipmap(K)),G&&w.end(C),M.isScene===!0&&M.onAfterRender(C,M,U),Re.resetDefaultState(),q=-1,J=null,x.pop(),x.length>0?(T=x[x.length-1],k.setTextureUnits(T.state.textureUnits),We===!0&&me.setGlobalState(C.clippingPlanes,T.state.camera)):T=null,R.pop(),R.length>0?A=R[R.length-1]:A=null,O!==null&&O.renderEnd()};function yf(M,U,$,G){if(M.visible===!1)return;if(M.layers.test(U.layers)){if(M.isGroup)$=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(U);else if(M.isLightProbeGrid)T.pushLightProbeGrid(M);else if(M.isLight)T.pushLight(M),M.castShadow&&T.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||M.intersectsFrustum(Ae)){G&&Qe.setFromMatrixPosition(M.matrixWorld).applyMatrix4(xe);let Fe=j.update(M),Te=M.material;Te.visible&&A.push(M,Fe,Te,$,Qe.z,null,U)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||M.intersectsFrustum(Ae))){let Fe=j.update(M),Te=M.material;if(G&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),Qe.copy(M.boundingSphere.center)):(Fe.boundingSphere===null&&Fe.computeBoundingSphere(),Qe.copy(Fe.boundingSphere.center)),Qe.applyMatrix4(M.matrixWorld).applyMatrix4(xe)),Array.isArray(Te)){let ze=Fe.groups;for(let Ye=0,ct=ze.length;Ye<ct;Ye++){let pt=ze[Ye],Ve=Te[pt.materialIndex];Ve&&Ve.visible&&A.push(M,Fe,Ve,$,Qe.z,pt,U)}}else Te.visible&&A.push(M,Fe,Te,$,Qe.z,null,U)}}let Ce=M.children;for(let Fe=0,Te=Ce.length;Fe<Te;Fe++)yf(Ce[Fe],U,$,G)}function Am(M,U,$,G){let{opaque:H,transmissive:Ce,transparent:Fe}=M;T.setupLightsView($),We===!0&&me.setGlobalState(C.clippingPlanes,$),G&&v.viewport(te.copy(G)),H.length>0&&ec(H,U,$),Ce.length>0&&ec(Ce,U,$),Fe.length>0&&ec(Fe,U,$),v.buffers.depth.setTest(!0),v.buffers.depth.setMask(!0),v.buffers.color.setMask(!0),v.setPolygonOffset(!1)}function Tm(M,U,$,G){if(($.isScene===!0?$.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[G.id]===void 0){let Ve=ht.has("EXT_color_buffer_half_float")||ht.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[G.id]=new gn(1,1,{generateMipmaps:!0,type:Ve?Nn:li,minFilter:jr,samples:Math.max(4,P.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ft.workingColorSpace})}let Ce=T.state.transmissionRenderTarget[G.id],Fe=G.viewport||te;Ce.setSize(Fe.z*C.transmissionResolutionScale,Fe.w*C.transmissionResolutionScale);let Te=C.getRenderTarget(),ze=C.getActiveCubeFace(),Ye=C.getActiveMipmapLevel();C.setRenderTarget(Ce),C.getClearColor(dt),ot=C.getClearAlpha(),ot<1&&C.setClearColor(16777215,.5),C.clear(),Dt&&lt.render($);let ct=C.toneMapping;C.toneMapping=ai;let pt=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),T.setupLightsView(G),We===!0&&me.setGlobalState(C.clippingPlanes,G),ec(M,$,G),k.updateMultisampleRenderTarget(Ce),k.updateRenderTargetMipmap(Ce),ht.has("WEBGL_multisampled_render_to_texture")===!1){let Ve=!1;for(let Tt=0,pn=U.length;Tt<pn;Tt++){let $t=U[Tt],{object:zt,geometry:Cn,material:De,group:kn}=$t;if(De.side===ji&&zt.layers.test(G.layers)){let Mt=De.side;De.side=Hn,De.needsUpdate=!0,Rm(zt,$,G,Cn,De,kn),De.side=Mt,De.needsUpdate=!0,Ve=!0}}Ve===!0&&(k.updateMultisampleRenderTarget(Ce),k.updateRenderTargetMipmap(Ce))}C.setRenderTarget(Te,ze,Ye),C.setClearColor(dt,ot),pt!==void 0&&(G.viewport=pt),C.toneMapping=ct}function ec(M,U,$){let G=U.isScene===!0?U.overrideMaterial:null;for(let H=0,Ce=M.length;H<Ce;H++){let Fe=M[H],{object:Te,geometry:ze,group:Ye}=Fe,ct=Fe.material;ct.allowOverride===!0&&G!==null&&(ct=G),Te.layers.test($.layers)&&Rm(Te,U,$,ze,ct,Ye)}}function Rm(M,U,$,G,H,Ce){O!==null&&H.isNodeMaterial&&O.setObject(M,H),M.onBeforeRender(C,U,$,G,H,Ce),M.modelViewMatrix.multiplyMatrices($.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),H.onBeforeRender(C,U,$,G,M,Ce),H.transparent===!0&&H.side===ji&&H.forceSinglePass===!1?(H.side=Hn,H.needsUpdate=!0,C.renderBufferDirect($,U,G,H,M,Ce),H.side=qi,H.needsUpdate=!0,C.renderBufferDirect($,U,G,H,M,Ce),H.side=ji):C.renderBufferDirect($,U,G,H,M,Ce),M.onAfterRender(C,U,$,G,H,Ce)}function tc(M,U,$){U.isScene!==!0&&(U=Ft);let G=L.get(M),H=T.state.lights,Ce=T.state.shadowsArray,Fe=H.state.version,Te=fe.getParameters(M,H.state,Ce,U,$,T.state.lightProbeGridArray),ze=fe.getProgramCacheKey(Te),Ye=G.programs;G.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?U.environment:null,G.fog=U.fog;let ct=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;G.envMap=ie.get(M.envMap||G.environment,ct),G.envMapRotation=G.environment!==null&&M.envMap===null?U.environmentRotation:M.envMapRotation,Ye===void 0&&(M.addEventListener("dispose",zi),Ye=new Map,G.programs=Ye);let pt=Ye.get(ze);if(pt!==void 0){if(G.currentProgram===pt&&G.lightsStateVersion===Fe)return Im(M,Te),pt}else Te.uniforms=fe.getUniforms(M),O!==null&&M.isNodeMaterial&&O.build(M,$,Te),M.onBeforeCompile(Te,C),pt=fe.acquireProgram(Te,ze),Ye.set(ze,pt),G.uniforms=Te.uniforms;let Ve=G.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(Ve.clippingPlanes=me.uniform),Im(M,Te),G.needsLights=gy(M),G.lightsStateVersion=Fe,G.needsLights&&(Ve.ambientLightColor.value=H.state.ambient,Ve.lightProbe.value=H.state.probe,Ve.sunLights.value=H.state.sun,Ve.sunLightShadows.value=H.state.sunShadow,Ve.directionalLights.value=H.state.directional,Ve.directionalLightShadows.value=H.state.directionalShadow,Ve.spotLights.value=H.state.spot,Ve.spotLightShadows.value=H.state.spotShadow,Ve.rectAreaLights.value=H.state.rectArea,Ve.ltc_1.value=H.state.rectAreaLTC1,Ve.ltc_2.value=H.state.rectAreaLTC2,Ve.pointLights.value=H.state.point,Ve.pointLightShadows.value=H.state.pointShadow,Ve.hemisphereLights.value=H.state.hemi,Ve.sunShadowMatrix.value=H.state.sunShadowMatrix,Ve.sunShadowCascade.value=H.state.sunShadowCascade,Ve.directionalShadowMatrix.value=H.state.directionalShadowMatrix,Ve.spotLightMatrix.value=H.state.spotLightMatrix,Ve.spotLightMap.value=H.state.spotLightMap,Ve.pointShadowMatrix.value=H.state.pointShadowMatrix),G.lightProbeGrid=T.state.lightProbeGridArray.length>0,G.currentProgram=pt,G.uniformsList=null,pt}function Cm(M){if(M.uniformsList===null){let U=M.currentProgram.getUniforms();M.uniformsList=Uo.seqWithValue(U.seq,M.uniforms)}return M.uniformsList}function Im(M,U){let $=L.get(M);$.outputColorSpace=U.outputColorSpace,$.batching=U.batching,$.batchingColor=U.batchingColor,$.instancing=U.instancing,$.instancingColor=U.instancingColor,$.instancingMorph=U.instancingMorph,$.skinning=U.skinning,$.morphTargets=U.morphTargets,$.morphNormals=U.morphNormals,$.morphColors=U.morphColors,$.morphTargetsCount=U.morphTargetsCount,$.numClippingPlanes=U.numClippingPlanes,$.numIntersection=U.numClipIntersection,$.vertexAlphas=U.vertexAlphas,$.vertexTangents=U.vertexTangents,$.toneMapping=U.toneMapping}function dy(M,U){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;y.setFromMatrixPosition(U.matrixWorld);for(let $=0,G=M.length;$<G;$++){let H=M[$];if(H.texture!==null&&H.boundingBox.containsPoint(y))return H}return null}function py(M,U,$,G,H){U.isScene!==!0&&(U=Ft),k.resetTextureUnits();let Ce=U.fog,Fe=G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial?U.environment:null,Te=K===null?C.outputColorSpace:K.isXRRenderTarget===!0?K.texture.colorSpace:ft.workingColorSpace,ze=G.isMeshStandardMaterial||G.isMeshLambertMaterial&&!G.envMap||G.isMeshPhongMaterial&&!G.envMap,Ye=ie.get(G.envMap||Fe,ze),ct=G.vertexColors===!0&&!!$.attributes.color&&$.attributes.color.itemSize===4,pt=!!$.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Ve=!!$.morphAttributes.position,Tt=!!$.morphAttributes.normal,pn=!!$.morphAttributes.color,$t=ai;G.toneMapped&&(K===null||K.isXRRenderTarget===!0)&&($t=C.toneMapping);let zt=$.morphAttributes.position||$.morphAttributes.normal||$.morphAttributes.color,Cn=zt!==void 0?zt.length:0,De=L.get(G),kn=T.state.lights;if(We===!0&&(xt===!0||M!==J)){let Wt=M===J&&G.id===q;me.setState(G,M,Wt)}let Mt=!1;G.version===De.__version?(De.needsLights&&De.lightsStateVersion!==kn.state.version||De.outputColorSpace!==Te||H.isBatchedMesh&&De.batching===!1||!H.isBatchedMesh&&De.batching===!0||H.isBatchedMesh&&De.batchingColor===!0&&H._colorsTexture===null||H.isBatchedMesh&&De.batchingColor===!1&&H._colorsTexture!==null||H.isInstancedMesh&&De.instancing===!1||!H.isInstancedMesh&&De.instancing===!0||H.isSkinnedMesh&&De.skinning===!1||!H.isSkinnedMesh&&De.skinning===!0||H.isInstancedMesh&&De.instancingColor===!0&&H.instanceColor===null||H.isInstancedMesh&&De.instancingColor===!1&&H.instanceColor!==null||H.isInstancedMesh&&De.instancingMorph===!0&&H.morphTexture===null||H.isInstancedMesh&&De.instancingMorph===!1&&H.morphTexture!==null||De.envMap!==Ye||G.fog===!0&&De.fog!==Ce||De.numClippingPlanes!==void 0&&(De.numClippingPlanes!==me.numPlanes||De.numIntersection!==me.numIntersection)||De.vertexAlphas!==ct||De.vertexTangents!==pt||De.morphTargets!==Ve||De.morphNormals!==Tt||De.morphColors!==pn||De.toneMapping!==$t||De.morphTargetsCount!==Cn||!!De.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(Mt=!0):(Mt=!0,De.__version=G.version);let pi=De.currentProgram;Mt===!0&&(pi=tc(G,U,H),O&&G.isNodeMaterial&&O.onUpdateProgram(G,pi,De));let Vi=!1,Dr=!1,Ks=!1,Ot=pi.getUniforms(),ln=De.uniforms;if(v.useProgram(pi.program)&&(Vi=!0,Dr=!0,Ks=!0),G.id!==q&&(q=G.id,Dr=!0),De.needsLights){let Wt=dy(T.state.lightProbeGridArray,H);De.lightProbeGrid!==Wt&&(De.lightProbeGrid=Wt,Dr=!0)}if(Vi||J!==M){v.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),Ot.setValue(F,"projectionMatrix",M.projectionMatrix),Ot.setValue(F,"viewMatrix",M.matrixWorldInverse);let Fr=Ot.map.cameraPosition;Fr!==void 0&&Fr.setValue(F,ye.setFromMatrixPosition(M.matrixWorld)),P.logarithmicDepthBuffer&&Ot.setValue(F,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&Ot.setValue(F,"isOrthographic",M.isOrthographicCamera===!0),J!==M&&(J=M,Dr=!0,Ks=!0)}if(De.needsLights&&(kn.state.sunShadowMap.length>0&&Ot.setValue(F,"sunShadowMap",kn.state.sunShadowMap,k),kn.state.directionalShadowMap.length>0&&Ot.setValue(F,"directionalShadowMap",kn.state.directionalShadowMap,k),kn.state.spotShadowMap.length>0&&Ot.setValue(F,"spotShadowMap",kn.state.spotShadowMap,k),kn.state.pointShadowMap.length>0&&Ot.setValue(F,"pointShadowMap",kn.state.pointShadowMap,k)),H.isSkinnedMesh){Ot.setOptional(F,H,"bindMatrix"),Ot.setOptional(F,H,"bindMatrixInverse");let Wt=H.skeleton;Wt&&(Wt.boneTexture===null&&Wt.computeBoneTexture(),Ot.setValue(F,"boneTexture",Wt.boneTexture,k))}H.isBatchedMesh&&(Ot.setOptional(F,H,"batchingTexture"),Ot.setValue(F,"batchingTexture",H._matricesTexture,k),Ot.setOptional(F,H,"batchingIdTexture"),Ot.setValue(F,"batchingIdTexture",H._indirectTexture,k),Ot.setOptional(F,H,"batchingColorTexture"),H._colorsTexture!==null&&Ot.setValue(F,"batchingColorTexture",H._colorsTexture,k));let Nr=$.morphAttributes;if((Nr.position!==void 0||Nr.normal!==void 0||Nr.color!==void 0)&&B.update(H,$,pi),(Dr||De.receiveShadow!==H.receiveShadow)&&(De.receiveShadow=H.receiveShadow,Ot.setValue(F,"receiveShadow",H.receiveShadow)),(G.isMeshStandardMaterial||G.isMeshLambertMaterial||G.isMeshPhongMaterial)&&G.envMap===null&&U.environment!==null&&(ln.envMapIntensity.value=U.environmentIntensity),ln.dfgLUT!==void 0&&(ln.dfgLUT.value=fw()),Dr){if(Ot.setValue(F,"toneMappingExposure",C.toneMappingExposure),De.needsLights&&my(ln,Ks),Ce&&G.fog===!0&&Pe.refreshFogUniforms(ln,Ce),Pe.refreshMaterialUniforms(ln,G,Q,Y,T.state.transmissionRenderTarget[M.id]),De.needsLights&&De.lightProbeGrid){let Wt=De.lightProbeGrid;ln.probesSH.value=Wt.texture,ln.probesMin.value.copy(Wt.boundingBox.min),ln.probesMax.value.copy(Wt.boundingBox.max),ln.probesResolution.value.copy(Wt.resolution)}Uo.upload(F,Cm(De),ln,k)}if(G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Uo.upload(F,Cm(De),ln,k),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&Ot.setValue(F,"center",H.center),Ot.setValue(F,"modelViewMatrix",H.modelViewMatrix),Ot.setValue(F,"normalMatrix",H.normalMatrix),Ot.setValue(F,"modelMatrix",H.matrixWorld),G.uniformsGroups!==void 0){let Wt=G.uniformsGroups;for(let Fr=0,Js=Wt.length;Fr<Js;Fr++){let Lm=Wt[Fr];re.update(Lm,pi),re.bind(Lm,pi)}}return pi}function my(M,U){M.ambientLightColor.needsUpdate=U,M.lightProbe.needsUpdate=U,M.sunLights.needsUpdate=U,M.sunLightShadows.needsUpdate=U,M.directionalLights.needsUpdate=U,M.directionalLightShadows.needsUpdate=U,M.pointLights.needsUpdate=U,M.pointLightShadows.needsUpdate=U,M.spotLights.needsUpdate=U,M.spotLightShadows.needsUpdate=U,M.rectAreaLights.needsUpdate=U,M.hemisphereLights.needsUpdate=U}function gy(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return Z},this.getActiveMipmapLevel=function(){return X},this.getRenderTarget=function(){return K},this.setRenderTargetTextures=function(M,U,$){let G=L.get(M);G.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),L.get(M.texture).__webglTexture=U,L.get(M.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:$,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,U){let $=L.get(M);$.__webglFramebuffer=U,$.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(M,U=0,$=0){K=M,Z=U,X=$;let G=null,H=!1,Ce=!1;if(M){let Te=L.get(M);if(Te.__useDefaultFramebuffer!==void 0){v.bindFramebuffer(F.FRAMEBUFFER,Te.__webglFramebuffer),te.copy(M.viewport),Be.copy(M.scissor),Le=M.scissorTest,v.viewport(te),v.scissor(Be),v.setScissorTest(Le),q=-1;return}else if(Te.__webglFramebuffer===void 0)k.setupRenderTarget(M);else if(Te.__hasExternalTextures)k.rebindTextures(M,L.get(M.texture).__webglTexture,L.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let ct=M.depthTexture;if(Te.__boundDepthTexture!==ct){if(ct!==null&&L.has(ct)&&(M.width!==ct.image.width||M.height!==ct.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");k.setupDepthRenderbuffer(M)}}let ze=M.texture;(ze.isData3DTexture||ze.isDataArrayTexture||ze.isCompressedArrayTexture)&&(Ce=!0);let Ye=L.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Ye[U])?G=Ye[U][$]:G=Ye[U],H=!0):M.samples>0&&k.useMultisampledRTT(M)===!1?G=L.get(M).__webglMultisampledFramebuffer:Array.isArray(Ye)?G=Ye[$]:G=Ye,te.copy(M.viewport),Be.copy(M.scissor),Le=M.scissorTest}else te.copy(Se).multiplyScalar(Q).floor(),Be.copy(de).multiplyScalar(Q).floor(),Le=pe;if($!==0&&(G=z),v.bindFramebuffer(F.FRAMEBUFFER,G)&&v.drawBuffers(M,G),v.viewport(te),v.scissor(Be),v.setScissorTest(Le),H){let Te=L.get(M.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+U,Te.__webglTexture,$)}else if(Ce){let Te=U;for(let ze=0;ze<M.textures.length;ze++){let Ye=L.get(M.textures[ze]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+ze,Ye.__webglTexture,$,Te)}}else if(M!==null&&$!==0){let Te=L.get(M.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Te.__webglTexture,$)}q=-1};function Pm(M){let U=L.get(M);return(U.__readFormat!==M.format||U.__readType!==M.type)&&(U.__readFormat=M.format,U.__readType=M.type,U.__formatReadable=P.textureFormatReadable(M.format),U.__typeReadable=P.textureTypeReadable(M.type)),U}this.readRenderTargetPixels=function(M,U,$,G,H,Ce,Fe,Te=0){if(!(M&&M.isWebGLRenderTarget)){tt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ze=L.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Fe!==void 0&&(ze=ze[Fe]),ze){v.bindFramebuffer(F.FRAMEBUFFER,ze);try{let Ye=M.textures[Te],ct=Ye.format,pt=Ye.type;M.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Te);let Ve=Pm(Ye);if(Ve.__formatReadable===!1){tt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Ve.__typeReadable===!1){tt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=M.width-G&&$>=0&&$<=M.height-H&&F.readPixels(U,$,G,H,_e.convert(ct),_e.convert(pt),Ce)}finally{let Ye=K!==null?L.get(K).__webglFramebuffer:null;v.bindFramebuffer(F.FRAMEBUFFER,Ye)}}},this.readRenderTargetPixelsAsync=async function(M,U,$,G,H,Ce,Fe,Te=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ze=L.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&Fe!==void 0&&(ze=ze[Fe]),ze)if(U>=0&&U<=M.width-G&&$>=0&&$<=M.height-H){v.bindFramebuffer(F.FRAMEBUFFER,ze);let Ye=M.textures[Te],ct=Ye.format,pt=Ye.type;M.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Te);let Ve=Pm(Ye);if(Ve.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Ve.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Tt=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Tt),F.bufferData(F.PIXEL_PACK_BUFFER,Ce.byteLength,F.STREAM_READ),F.readPixels(U,$,G,H,_e.convert(ct),_e.convert(pt),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);let pn=K!==null?L.get(K).__webglFramebuffer:null;v.bindFramebuffer(F.FRAMEBUFFER,pn);let $t=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await Sg(F,$t,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Tt),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,Ce),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(Tt),F.deleteSync($t),Ce}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,U=null,$=0){let G=Math.pow(2,-$),H=Math.floor(M.image.width*G),Ce=Math.floor(M.image.height*G),Fe=U!==null?U.x:0,Te=U!==null?U.y:0;k.setTexture2D(M,0),F.copyTexSubImage2D(F.TEXTURE_2D,$,0,0,Fe,Te,H,Ce),v.unbindTexture()},this.copyTextureToTexture=function(M,U,$=null,G=null,H=0,Ce=0){let Fe,Te,ze,Ye,ct,pt,Ve,Tt,pn,$t=M.isCompressedTexture?M.mipmaps[Ce]:M.image;if($!==null)Fe=$.max.x-$.min.x,Te=$.max.y-$.min.y,ze=$.isBox3?$.max.z-$.min.z:1,Ye=$.min.x,ct=$.min.y,pt=$.isBox3?$.min.z:0;else{let ln=Math.pow(2,-H);Fe=Math.floor($t.width*ln),Te=Math.floor($t.height*ln),M.isDataArrayTexture?ze=$t.depth:M.isData3DTexture?ze=Math.floor($t.depth*ln):ze=1,Ye=0,ct=0,pt=0}G!==null?(Ve=G.x,Tt=G.y,pn=G.z):(Ve=0,Tt=0,pn=0);let zt=_e.convert(U.format),Cn=_e.convert(U.type),De;U.isData3DTexture?(k.setTexture3D(U,0),De=F.TEXTURE_3D):U.isDataArrayTexture||U.isCompressedArrayTexture?(k.setTexture2DArray(U,0),De=F.TEXTURE_2D_ARRAY):(k.setTexture2D(U,0),De=F.TEXTURE_2D),v.activeTexture(F.TEXTURE0),v.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,U.flipY),v.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),v.pixelStorei(F.UNPACK_ALIGNMENT,U.unpackAlignment);let kn=v.getParameter(F.UNPACK_ROW_LENGTH),Mt=v.getParameter(F.UNPACK_IMAGE_HEIGHT),pi=v.getParameter(F.UNPACK_SKIP_PIXELS),Vi=v.getParameter(F.UNPACK_SKIP_ROWS),Dr=v.getParameter(F.UNPACK_SKIP_IMAGES);v.pixelStorei(F.UNPACK_ROW_LENGTH,$t.width),v.pixelStorei(F.UNPACK_IMAGE_HEIGHT,$t.height),v.pixelStorei(F.UNPACK_SKIP_PIXELS,Ye),v.pixelStorei(F.UNPACK_SKIP_ROWS,ct),v.pixelStorei(F.UNPACK_SKIP_IMAGES,pt);let Ks=M.isDataArrayTexture||M.isData3DTexture,Ot=U.isDataArrayTexture||U.isData3DTexture;if(M.isDepthTexture){let ln=L.get(M),Nr=L.get(U),Wt=L.get(ln.__renderTarget),Fr=L.get(Nr.__renderTarget);v.bindFramebuffer(F.READ_FRAMEBUFFER,Wt.__webglFramebuffer),v.bindFramebuffer(F.DRAW_FRAMEBUFFER,Fr.__webglFramebuffer);for(let Js=0;Js<ze;Js++)Ks&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,L.get(M).__webglTexture,H,pt+Js),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,L.get(U).__webglTexture,Ce,pn+Js)),F.blitFramebuffer(Ye,ct,Fe,Te,Ve,Tt,Fe,Te,F.DEPTH_BUFFER_BIT,F.NEAREST);v.bindFramebuffer(F.READ_FRAMEBUFFER,null),v.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(H!==0||M.isRenderTargetTexture||L.has(M)){let ln=L.get(M),Nr=L.get(U);v.bindFramebuffer(F.READ_FRAMEBUFFER,N),v.bindFramebuffer(F.DRAW_FRAMEBUFFER,V);for(let Wt=0;Wt<ze;Wt++)Ks?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,ln.__webglTexture,H,pt+Wt):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,ln.__webglTexture,H),Ot?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,Nr.__webglTexture,Ce,pn+Wt):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Nr.__webglTexture,Ce),H!==0?F.blitFramebuffer(Ye,ct,Fe,Te,Ve,Tt,Fe,Te,F.COLOR_BUFFER_BIT,F.NEAREST):Ot?F.copyTexSubImage3D(De,Ce,Ve,Tt,pn+Wt,Ye,ct,Fe,Te):F.copyTexSubImage2D(De,Ce,Ve,Tt,Ye,ct,Fe,Te);v.bindFramebuffer(F.READ_FRAMEBUFFER,null),v.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else Ot?M.isDataTexture||M.isData3DTexture?F.texSubImage3D(De,Ce,Ve,Tt,pn,Fe,Te,ze,zt,Cn,$t.data):U.isCompressedArrayTexture?F.compressedTexSubImage3D(De,Ce,Ve,Tt,pn,Fe,Te,ze,zt,$t.data):F.texSubImage3D(De,Ce,Ve,Tt,pn,Fe,Te,ze,zt,Cn,$t):M.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,Ce,Ve,Tt,Fe,Te,zt,Cn,$t.data):M.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,Ce,Ve,Tt,$t.width,$t.height,zt,$t.data):F.texSubImage2D(F.TEXTURE_2D,Ce,Ve,Tt,Fe,Te,zt,Cn,$t);v.pixelStorei(F.UNPACK_ROW_LENGTH,kn),v.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Mt),v.pixelStorei(F.UNPACK_SKIP_PIXELS,pi),v.pixelStorei(F.UNPACK_SKIP_ROWS,Vi),v.pixelStorei(F.UNPACK_SKIP_IMAGES,Dr),Ce===0&&U.generateMipmaps&&F.generateMipmap(De),v.unbindTexture()},this.initRenderTarget=function(M){L.get(M).__webglFramebuffer===void 0&&k.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?k.setTextureCube(M,0):M.isData3DTexture?k.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?k.setTexture2DArray(M,0):k.setTexture2D(M,0),v.unbindTexture()},this.resetState=function(){Z=0,X=0,K=null,v.reset(),Re.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Li}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=ft._getDrawingBufferColorSpace(e),t.unpackColorSpace=ft._getUnpackColorSpace()}};var On=Object.freeze({DEFAULT:0,EMISSIVE:1,NOFOG:2}),Zn=()=>({value:new gt(0,0,0)}),he={uTime:{value:0},uBreath:{value:.5},uLamp:{value:new I(0,0,3)},uLampOn:{value:1},uCamPos:{value:new I},uResolution:{value:new nt(1,1)},uPixelRatio:{value:1},uPxPerUnit:{value:1},uWorldScale:{value:1},uFogDensity:{value:.00485},uInvert:{value:0},uNight:{value:0},uEmissivePass:{value:0},cVoid:Zn(),cAbyss:Zn(),cDeep:Zn(),cSteel:Zn(),cSlate:Zn(),cPewter:Zn(),cSilver:Zn(),cWhite:Zn(),cObsidian:Zn(),cEmber:Zn(),cEmberDeep:Zn(),cElectrum:Zn(),cPaper:Zn(),cInk:Zn()};function bh(n){return"c"+n.charAt(0).toUpperCase()+n.slice(1)}function Un(n){return he[bh(n)]||he.cSilver}function Ls(){let n=new Array(7);for(let e=0;e<7;e++)n[e]=new vt;return{value:n}}function Ds(){return{value:[1,1,1,1,1,1,1]}}var cp=new Map;function yi(n,e){n&&cp.set(n,Math.max(0,e||0))}function fl(n){cp.delete(n)}function nx(){let n=0;for(let e of cp.values())n+=e;return n/1048576}var wh=eo.inhaleMs/eo.periodMs,Wn={value:0,phase:0,periodMs:eo.periodMs,amp:tn.reducedMotion?eo.reducedAmp:1,setPeriod(n){n>0&&(Wn.periodMs=n)},mix(n,e){return n+(e-n)*(.5+(Wn.value-.5)*Wn.amp)}};function dw(n){return n<wh?.5-.5*Math.cos(Math.PI*(n/wh)):.5+.5*Math.cos(Math.PI*((n-wh)/(1-wh)))}var ko=new Map,pw=1;function Kn(n,e){let t=pw++;return ko.set(t,{at:Ie.now+Math.max(0,n||0),fn:e}),t}function rx(n){ko.delete(n)}var zo=new Set;function ci(n,e,t){let i,r=new Promise(o=>{i=o}),s={start:Ie.now,ms:Math.max(0,n||0),fn:e,ease:t||null,resolve:i,live:!0};if(s.ms===0){try{e(1)}finally{i()}return{done:r,cancel(){}}}return zo.add(s),{done:r,cancel(){s.live&&(s.live=!1,zo.delete(s),i())}}}var dl=[],up=-1,hp=0;function mw(n,e){n.at<=hp&&dl.push(e)}function gw(n){let e=(hp-n.start)/n.ms;if(e>=1){n.live=!1,zo.delete(n);try{n.fn(1)}catch(t){Rt("clock:tween","tween callback threw",t)}n.resolve()}else{let t=e<=0?0:e;try{n.fn(n.ease?n.ease(t):t)}catch(i){Rt("clock:tween","tween callback threw",i),n.live=!1,zo.delete(n),n.resolve()}}}function xw(n,e){hp=e,Wn.amp=tn.reducedMotion?eo.reducedAmp:1;let t=up<0?0:Math.max(0,e-up);if(up=e,Wn.phase=(Wn.phase+t/Wn.periodMs)%1,Wn.value=dw(Wn.phase),ko.size){dl.length=0,ko.forEach(mw);for(let i=0;i<dl.length;i++){let r=ko.get(dl[i]);if(r){ko.delete(dl[i]);try{r.fn()}catch(s){Rt("clock:after","timer callback threw",s)}}}}zo.size&&zo.forEach(gw)}function ix(){Ie.add(xw,un.CLOCK)}try{ix()}catch{Promise.resolve().then(ix)}var Zt=Object.freeze({...Vm});function _t(n){return n<=0?0:n>=1?1:n}function Et(n,e,t){return n+(e-n)*t}function Ns(n,e,t){if(n===e)return t<n?0:1;let i=_t((t-n)/(e-n));return i*i*(3-2*i)}var ui=`
uniform float uFogDensity; uniform vec3 cAbyss;
float fogVis(float dist) { float f = uFogDensity * dist; return exp(-f * f); }
vec3 applyFog(vec3 col, float dist) { return mix(cAbyss, col, fogVis(dist)); }`,Er=null,Ji={density:he.uFogDensity.value,set(n){Er&&(Er.cancel(),Er=null),Ji.density=n,he.uFogDensity.value=n},to(n,e,t=Zt.camera){Er&&(Er.cancel(),Er=null);let i=Ji.density,r=ci(e,s=>{Ji.density=i+(n-i)*s,he.uFogDensity.value=Ji.density},t);return Er=r,r.done.then(()=>{Er===r&&(Er=null)})}};var pl=`
uniform float uPxPerUnit;
float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }
// strut: strut spacing in LOCAL units (aStrut); modelScale: length(modelMatrix[0].xyz); depth: view-space depth (render units)
float r1Lattice(float strut, float modelScale, float depth) {
  float sp = strut * modelScale * uPxPerUnit / max(depth, 1e-6);
  return smoothstep(3.0, 6.0, sp);
}`,Fs=`
uniform mat4 uStrataM[7];
uniform float uStrataA[7];
int strataIndex(float face) { return int(clamp(floor(face / 16.0 + 0.001), 0.0, 6.0)); }
mat4 strataMatrix(float face) { return uStrataM[strataIndex(face)]; }
float strataAlpha(float face) { return uStrataA[strataIndex(face)]; }`;var Ar={};for(let n=0;n<7;n++)Ar[`sign:${n}`]=[128*n,0,128,128];Ar["glyph:back"]=[896,0,128,128];Ar.frieze=[0,128,1024,32];Ar.ticks=[0,160,1024,32];for(let n=0;n<16;n++)Ar[`capital:${n}`]=[128*(n%8),192+128*Math.floor(n/8),128,128];Ar.deck=[0,448,256,256];for(let n=0;n<7;n++)Ar[`free:${n}`]=n<3?[256*(n+1),448,256,256]:[256*(n-3),704,256,256];var ml=null,gl=null,Os=null,Eh=null;function _w(n,e){let t=()=>{let s=document.createElement("canvas");return s.width=n,s.height=e,s};(!Os||Os.width<n||Os.height<e)&&(Os=t(),Eh=t());let i=Os.getContext("2d",{willReadFrequently:!0}),r=Eh.getContext("2d",{willReadFrequently:!0});return i.setTransform(1,0,0,1,0,0),r.setTransform(1,0,0,1,0,0),i.clearRect(0,0,Os.width,Os.height),r.clearRect(0,0,Eh.width,Eh.height),[i,r]}function Mw(n,e,t,i){for(let r=0;r<t;r++)for(let s=0;s<e;s++){let o=0,a=0;for(let l=-1;l<=1;l++){let c=r+l;if(!(c<0||c>=t))for(let u=-1;u<=1;u++){let d=s+u;d<0||d>=e||(o+=n[(c*e+d)*4+3],a++)}}i[r*e+s]=o/a}}var kt={texture:null,size:1024,REGIONS:Ar,init(n){if(kt.texture)return kt;kt.size=n==="T1"?512:1024,ml=document.createElement("canvas"),ml.width=ml.height=kt.size,gl=ml.getContext("2d",{willReadFrequently:!0}),gl.fillStyle="rgb(255,0,0)",gl.fillRect(0,0,kt.size,kt.size);let e=new _r(ml);return e.flipY=!1,e.generateMipmaps=!1,e.minFilter=yt,e.magFilter=yt,e.wrapS=e.wrapT=Dn,e.premultiplyAlpha=!1,kt.texture=e,yi(e,kt.size*kt.size*4),kt},region(n){let e=Ar[n];if(!e)return null;let t=kt.size/1024,i=e[0]*t,r=e[1]*t,s=e[2]*t,o=e[3]*t;return{x:i,y:r,w:s,h:o,rect:new Gt(e[0]/1024,e[1]/1024,(e[0]+e[2])/1024,(e[1]+e[3])/1024)}},draw(n,e={}){if(!kt.texture)return!1;let t=kt.region(n);if(!t)return!1;let i=Math.round(t.w),r=Math.round(t.h),[s,o]=_w(i,r);try{e.height&&e.height(s,i,r)}catch{}try{e.inlay&&e.inlay(o,i,r)}catch{}let a=s.getImageData(0,0,i,r).data,l=o.getImageData(0,0,i,r).data,c=new Float32Array(i*r);Mw(a,i,r,c);let u=gl.createImageData(i,r),d=u.data;for(let h=0,f=0;f<i*r;f++,h+=4)d[h]=255-Math.round(c[f]),d[h+1]=l[h+3],d[h+2]=0,d[h+3]=255;return gl.putImageData(u,Math.round(t.x),Math.round(t.y)),kt.texture.needsUpdate=!0,!0}};var Bn=Object.freeze({T3:Object.freeze({dprCap:2,msaa:!0,grains:24576,stars:Object.freeze({signal:2e3,zenith:3e3}),bloom:"kawase",lattice:1,atlas:1024,contours:12,ringTex:Object.freeze([2048,128]),labels:24,sandText:!0}),T2:Object.freeze({dprCap:1.5,msaa:!0,grains:16384,stars:Object.freeze({signal:2e3,zenith:3e3}),bloom:"sprites",lattice:1,atlas:1024,contours:12,ringTex:Object.freeze([2048,128]),labels:24,sandText:!0}),T1:Object.freeze({dprCap:1.25,msaa:!1,grains:8192,stars:Object.freeze({signal:800,zenith:1200}),bloom:"sprites",lattice:.5,atlas:512,contours:8,ringTex:Object.freeze([1024,64]),labels:16,sandText:!1})}),_l=["T1","T2","T3"],Sw=/SwiftShader|llvmpipe|Software|Mali-4|Adreno \(TM\) 3/i,Tr=Vt.governor;function cx(){try{return matchMedia("(pointer: coarse)").matches&&Math.min(window.innerWidth,window.innerHeight)<=600}catch{return!1}}function fp(n){let e=Bn[n];return e?cx()?Object.freeze({...e,msaa:n==="T2"?!1:e.msaa,labels:16}):e:null}function sx(n){return null}var xl=null,Ih=!1,ux=!0,dp=-1e9,Ah=null,Ph=0,ox=!1,ax=new Float32Array(Tr.windowFrames),Vo=0,Go=0,vl=0,yl=-1,Ho=-1,Th=-1;function pp(){Vo=0,Go=0,vl=0,yl=-1,Ho=-1}var hx=30,lx=new Float32Array(hx),Rh=0,Wo="off",fx=0,Ch=null;function bw(n,e){let t=Array.prototype.slice.call(n,0,e).sort((i,r)=>i-r);return e?e%2?t[(e-1)/2]:(t[e/2-1]+t[e/2])/2:0}function dx(n){let e=_l.indexOf(n);return e>0?_l[e-1]:n}function ww(n){let e=_l.indexOf(n);return e>=0&&e<_l.length-1?_l[e+1]:n}function Ew(){let n=Ie.now,e=Th<0?0:n-Th;if(Th=n,!(it.tier==="T0"||e<=0)){if(Ah&&n-dp>=300){let t=Ah;Ah=null,it.setTier(t,"deferred")}if(Wo==="wait"&&n>=fx&&(Wo="run"),Wo==="run"){if(lx[Rh++]=e,Rh>=hx){Wo="done";let t=bw(lx,Rh),i=it.tier;t>20?i="T1":t>=12&&(i=dx(i)),i!==it.tier&&it.setTier(i,`benchmark ${t.toFixed(1)} ms`),Ch&&(Ch(it.tier),Ch=null),pp(),Ph=n}return}if(!Ih&&n-Ph>Tr.upgradeAfterMs&&se.data&&se.data.tier!==it.tier)try{se.set("tier",it.tier)}catch{}Ih||!ux||it.governor.update(e/1e3)}}var it={tier:"T2",params:Bn.T2,detect(){let n="T0",e=null;try{let i=document.createElement("canvas").getContext("webgl2");if(!i)throw new Error("no WebGL2");let r="";try{let g=i.getExtension("WEBGL_debug_renderer_info");r=String(g?i.getParameter(g.UNMASKED_RENDERER_WEBGL):i.getParameter(i.RENDERER)||"")}catch{r=""}try{let g=i.getExtension("WEBGL_lose_context");g&&g.loseContext()}catch{}let s=Sw.test(r),o=navigator.hardwareConcurrency||4,a=navigator.deviceMemory,l=(()=>{try{return matchMedia("(pointer: fine)").matches}catch{return!1}})(),c=cx(),u=se.data&&se.data.tier;u?n=u:s||o<=4||a!=null&&a<=3?n="T1":l&&o>=8?n="T3":(!c||a!=null&&a>=6,n="T2"),s&&(n="T1");let d=sx("tier");if(d&&/^T[0-3]$/.test(d)&&(n=d,Ih=!0),sx("gov")==="0"&&(ux=!1),n==="T0")throw new Error("forced T0");let h=fp(n),f=document.getElementById("gl");if(e=f&&f.getContext("webgl2",{antialias:h.msaa,alpha:!0,premultipliedAlpha:!0,depth:!0,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1}),!e)throw new Error("context creation failed")}catch{n="T0",e=null}return it.tier=n,it.params=fp(n),ue.tier=n,{tier:n,gl:e}},benchmark(){return Ih||it.tier==="T0"||Wo!=="off"?Promise.resolve(it.tier):(Wo="wait",Rh=0,fx=Ie.now+600,new Promise(n=>{Ch=n}))},setTier(n,e=""){if(!Bn[n]||n===it.tier||it.tier==="T0")return;if(ue.phase==="transition"&&Ie.now-dp<300){Ah=n;return}let t=it.tier;it.tier=n,it.params=fp(n),ue.tier=n,it.governor.dropSteps=0,Ph=Ie.now,pp();let i=xl&&xl.renderer;if(i)try{i.setTier(n),i.setDprDrop(0)}catch(r){Rt("quality:renderer",r)}Oe.emit("tier:change",{tier:n,prev:t})},governor:{fps:60,dropSteps:0,update(n){let e=n*1e3;if(!(e>0)||(Vo===Tr.windowFrames?vl-=ax[Go]:Vo++,ax[Go]=e,vl+=e,Go=(Go+1)%Tr.windowFrames,Vo<Tr.windowFrames))return;let t=1e3/(vl/Vo);it.governor.fps=t;let i=Ie.now;if(t<Tr.lowFps){Ho=-1,yl<0&&(yl=i);let r=xl&&xl.renderer,s=Math.min(typeof devicePixelRatio=="number"?devicePixelRatio:1,Bn[it.tier].dprCap);if(i-yl>Tr.dropAfterMs&&it.tier!=="T1"){it.setTier(dx(it.tier),`governor ${t.toFixed(0)} fps`);return}if(r&&s-Vt.dprStep*(it.governor.dropSteps+1)>=1-1e-6){it.governor.dropSteps++;try{r.setDprDrop(it.governor.dropSteps)}catch(o){Rt("quality:dpr",o)}Vo=0,Go=0,vl=0}}else yl=-1,t>Tr.highFps&&!ox?(Ho<0&&(Ho=i),i-Ho>Tr.upgradeAfterMs&&it.tier!=="T3"&&(ox=!0,it.setTier(ww(it.tier),`governor ${t.toFixed(0)} fps`))):Ho=-1}},init(n){xl=n,Ph=Ie.now,Ie.add(Ew,un.UI)}};Oe.on("travel:start",()=>{dp=Ie.now});Oe.on("visibility",()=>{pp(),Th=-1});var Aw=`
${pl}
${Fs}
#ifdef USE_KEYGEO
attribute float aFace; attribute vec2 aFaceUV; attribute vec4 aEng; attribute float aKind;
varying vec2 vFaceUV; varying vec4 vEng; varying float vKind; varying float vFace; varying vec3 vLocal;
#endif
#ifdef USE_ASTRUT
attribute float aStrut;
#endif
#ifdef USE_REGION
varying vec2 vUv;
#endif
uniform float uStrut;
varying vec3 vWorld; varying vec3 vN; varying float vSolid;
void main() {
  mat4 M = modelMatrix;
  float sa = 1.0;
#ifdef USE_KEYGEO
#ifdef USE_STRATA
  M = modelMatrix * strataMatrix(aFace);
#endif
#if defined(USE_STRATA) || defined(USE_STRATA_A)
  sa = strataAlpha(aFace);
#endif
  vFaceUV = aFaceUV; vEng = aEng; vKind = aKind; vFace = aFace; vLocal = position;
#endif
#ifdef USE_REGION
  vUv = uv;
#endif
  vec4 w = M * vec4(position, 1.0);
  vec4 v = viewMatrix * w;
  gl_Position = projectionMatrix * v;
  vWorld = w.xyz;
  vN = normalize(mat3(M) * normal);
#ifdef USE_ASTRUT
  float strut = aStrut;
#else
  float strut = uStrut;
#endif
#ifdef USE_R1
  sa *= 1.0 - r1Lattice(strut, length(M[0].xyz), -v.z);
#endif
  vSolid = sa;
}`,Tw=`
${ui}
uniform float uPxPerUnit;
float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }
uniform vec3 uBase; uniform vec3 cSilver; uniform vec3 cWhite; uniform vec3 cPaper; uniform vec3 cInk;
uniform vec3 uLamp; uniform float uLampOn; uniform float uAlpha, uFlash, uRim, uInvert, uPixelRatio, uHideCapsOf;
uniform sampler2D uAtlas; uniform float uTexel; uniform vec4 uRegion;
uniform float uFriezeH, uTickL, uApertureR;
varying vec3 vWorld; varying vec3 vN; varying float vSolid;
#ifdef USE_KEYGEO
varying vec2 vFaceUV; varying vec4 vEng; varying float vKind; varying float vFace; varying vec3 vLocal;
#endif
#ifdef USE_REGION
varying vec2 vUv;
#endif

// → atlas uv of the engraving under this fragment (x < 0: none)
vec2 engraveUV() {
#ifdef USE_KEYGEO
  float si = floor(vFace / 16.0 + 0.001);
  float fj = vFace - si * 16.0;
  if (vKind > 0.5) return vec2(-1.0);
  if (vEng.z < uFriezeH) {                                   // top bevel: frieze cells ((i·12 + j)·3 + c) mod 64
    float c = mod((si * 12.0 + fj) * 3.0 + floor(clamp(vFaceUV.x, 0.0, 0.999) * 3.0), 64.0);
    return vec2((c + fract(vFaceUV.x * 3.0)) / 64.0, 0.125 + clamp(vEng.z / uFriezeH, 0.0, 1.0) * 0.03125);
  }
  if (vEng.w < uFriezeH) {                                   // bottom bevel
    float c = mod((si * 12.0 + fj) * 3.0 + floor(clamp(vFaceUV.x, 0.0, 0.999) * 3.0), 64.0);
    return vec2((c + fract(vFaceUV.x * 3.0)) / 64.0, 0.125 + clamp(1.0 - vEng.w / uFriezeH, 0.0, 1.0) * 0.03125);
  }
  if (vEng.z < uFriezeH + uTickL) {                          // the 12 radial ticks along the top edge
    return vec2(clamp(vFaceUV.x, 0.0, 1.0), 0.15625 + clamp((vEng.z - uFriezeH) / uTickL, 0.0, 1.0) * 0.03125);
  }
  bool sign = fj < 0.5;
  bool back = abs(si - 3.0) < 0.5 && abs(fj - 6.0) < 0.5;
  if ((sign || back) && vEng.x > 0.0 && vEng.x < 1.0 && vEng.y > 0.0 && vEng.y < 1.0) {
    vec2 o = sign ? vec2(si * 0.125, 0.0) : vec2(0.875, 0.0);
    return o + vEng.xy * 0.125;
  }
  return vec2(-1.0);
#elif defined(USE_REGION)
  return uRegion.xy + clamp(vUv, 0.0, 1.0) * (uRegion.zw - uRegion.xy);
#else
  return vec2(-1.0);
#endif
}

void main() {
#ifdef USE_KEYGEO
  float si = floor(vFace / 16.0 + 0.001);
  if (abs(si - 3.0) < 0.5 && vLocal.z > 0.0 && length(vLocal.xy) < uApertureR) discard;   // the • through-aperture
  if (vKind > 0.5 && vKind < 2.5 && abs(si - uHideCapsOf) < 0.5) discard;                 // hall LOD
#endif
  float a = vSolid * uAlpha;
  if (a <= bayer8(gl_FragCoord.xy)) discard;

  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(cameraPosition - vWorld);
  vec3 L = normalize(uLamp - vWorld);
  float nl = dot(N, L);

  vec3 col = uBase;
  col += cSilver * (0.035 * (0.5 + 0.5 * N.y) + 0.05 * max(nl, 0.0) * uLampOn);   // just enough form to read facets
  float fr = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.0);
  col = mix(col, cSilver, fr * uRim);
  vec3 H = normalize(L + V);
  float nh = max(dot(N, H), 0.0);
  col += uLampOn * (cSilver * 0.35 * pow(nh, 24.0) + cWhite * 0.6 * pow(nh, 160.0));

  vec2 auv = engraveUV();
  if (auv.x >= 0.0) {
    vec4 t = texture2D(uAtlas, auv);
    float h = t.r, inlay = t.g;
    if (h < 0.999 || inlay > 0.0) {
      float hl = texture2D(uAtlas, auv - vec2(uTexel, 0.0)).r, hr = texture2D(uAtlas, auv + vec2(uTexel, 0.0)).r;
      float hu = texture2D(uAtlas, auv - vec2(0.0, uTexel)).r, hd = texture2D(uAtlas, auv + vec2(0.0, uTexel)).r;
      vec3 up = normalize(vec3(0.0, 1.0, 0.0) - N * N.y + vec3(1e-4, 0.0, 0.0));
      vec3 T = normalize(cross(up, N));
      float k = 2.4;
      vec3 Ne = normalize(N + (-(hr - hl) * T + (hd - hu) * up) * k);
      float rake = smoothstep(0.55, 0.90, 1.0 - nl) * uLampOn;
      float e = dot(Ne, L) - nl;
      col += cSilver * rake * (max(e, 0.0) * 2.6 + (1.0 - h) * 0.10);
      col *= 1.0 - (1.0 - h) * 0.35 * (1.0 - rake);
      col = mix(col, cSilver, clamp(inlay, 0.0, 1.0) * 0.45);
    }
  }
  col = mix(col, cWhite, uFlash);
#ifdef USE_FOG
  col = applyFog(col, length(vWorld - cameraPosition));
#endif
  if (uInvert > 0.0) {
    col = mix(col, cPaper, uInvert * 0.85);
    vec2 fc = gl_FragCoord.xy / uPixelRatio;
    float hatch = 1.0 - step(1.0, mod((fc.x + fc.y) * 0.70710678, 6.0));
    col = mix(col, cInk, hatch * uInvert);
  }
  gl_FragColor = vec4(col, 1.0);
}`;function mp(n={}){let e={},t=n.engrave!=null?n.engrave:null;t==="key"?e.USE_KEYGEO="":typeof t=="string"&&(e.USE_REGION=""),n.r1!==!1&&(e.USE_R1=""),n.strut==null&&(t==="key"||n.aStrut)&&(e.USE_ASTRUT=""),n.strata?e.USE_STRATA="":n.strataAlpha&&(e.USE_STRATA_A=""),n.fog!==!1&&(e.USE_FOG=""),kt.texture||kt.init(it.tier);let i=typeof t=="string"&&t!=="key"?kt.region(t):null,r=kt.size||1024;return new bt({uniforms:{uBase:Un(n.tint||"obsidian"),uAlpha:{value:1},uFlash:{value:0},uEdgeEmber:{value:0},uRim:{value:n.rim!=null?n.rim:Vt.r2.fresnelGain},uStrut:{value:n.strut!=null?n.strut:.05},uHideCapsOf:{value:-1},uAtlas:{value:kt.texture},uTexel:{value:1/r},uRegion:{value:i?i.rect:new Gt(0,0,0,0)},uFriezeH:{value:wt.friezeH},uTickL:{value:wt.tickLen},uApertureR:{value:wt.apertureD/2},uStrataM:n.strata||Ls(),uStrataA:n.strataAlpha||Ds(),cSilver:he.cSilver,cWhite:he.cWhite,cPaper:he.cPaper,cInk:he.cInk,cAbyss:he.cAbyss,uLamp:he.uLamp,uLampOn:he.uLampOn,uInvert:he.uInvert,uPixelRatio:he.uPixelRatio,uPxPerUnit:he.uPxPerUnit,uFogDensity:he.uFogDensity},defines:e,vertexShader:Aw,fragmentShader:Tw,side:n.side!=null?n.side:qi,transparent:!1,depthWrite:!0})}var Xo=" ",Yo="−";function Rr(n,e,t,i,r,s,o,a,l,c,u,d,h,f,g,_,m,p,S,b,y){let A=Xm[n],[T,R]=Ym[n];return Object.freeze({id:n,slug:e,sign:t,stratum:i,num:r,code:s,title:o,titleOpen:a,name:l,nameOpen:c,line:u,alt:A,level:d,giant:h,floor:T,ceil:R,n:f,fog:g,far:_,wet:m,root:p,note:S,hidden:b,parent:y,anchor:Object.freeze(new I(0,A,0))})}var be=Object.freeze({SIGNAL:Rr("SIGNAL","signal","S",0,"01","SIGNAL","СВЯЗЬ",null,"Связь",null,"передачи и сигналы",`+1${Xo}090.00`,`+1${Xo}090`,3,.014,400,.22,220,392,!1,null),ARCHIVE:Rr("ARCHIVE","archive","A",1,"02","ARCHIVE","ЛЕТОПИСЬ",null,"Летопись",null,"легенды, моменты, шутки","+810.00","+810",5,.006,500,.22,196,440,!1,null),MEMBERS:Rr("MEMBERS","members","M",2,"03","MEMBERS","КЛАН",null,"Клан",null,"кто с нами","+460.00","+460",7,.0034,800,.22,164.81,493.88,!1,null),CORE:Rr("CORE","core","•",3,"04","CORE","ЯДРО",null,"Ядро",null,"имя, девиз, всё о нас","±0.00","±0",12,.00485,700,.22,146.83,587.33,!1,null),VOYAGES:Rr("VOYAGES","voyages","V",4,"05","VOYAGES","ВЫЛАЗКИ",null,"Вылазки",null,"экспедиции и зонды",`${Yo}460.00`,`${Yo}460`,7,.0034,800,.3,123.47,659.25,!1,null),INSIGNIA:Rr("INSIGNIA","insignia","I",5,"06","INSIGNIA","ХРАНИЛИЩЕ",null,"Хранилище",null,"трофеи и находки",`${Yo}810.00`,`${Yo}810`,5,.006,500,0,110,783.99,!1,null),NADIR:Rr("NADIR","nadir","N",6,"07","NADIR","ЗАПЕЧАТАНО","ИСТОК","Запечатано","Исток","осколков {k} из 5",`${Yo}1${Xo}090.00`,`${Yo}1${Xo}090`,3,.014,400,.22,98,880,!1,null),ZENITH:Rr("ZENITH","zenith",null,-1,"00","ZENITH","НАД ВСЕМ",null,"Над всем",null,"—",`+1${Xo}260.00`,`+1${Xo}260`,3,35e-5,4e3,.35,220,392,!0,"SIGNAL"),WORKSHOP:Rr("WORKSHOP","workshop",null,2,"03","WORKSHOP","МАСТЕРСКАЯ",null,"Мастерская",null,"—","+484.00","+484",7,.06,30,.22,164.81,493.88,!0,"MEMBERS")});var Jr=Object.freeze(["SIGNAL","ARCHIVE","MEMBERS","CORE","VOYAGES","INSIGNIA","NADIR"]);var VI=new Map(Jr.map(n=>[be[n].sign,be[n]])),Rw=new Map(Object.values(be).map(n=>[n.slug,n]));function px(n){return Rw.get(String(n||"").toLowerCase())||null}function Lh(n){let e=Jr[n];return e?be[e]:null}var mx=()=>(be[ue.room]||be.CORE).far,gx=`
float lampReach(vec3 p) { float r = 2.0 * max(length(uCamPos - uLamp), 1e-4); float d = length(p - uLamp) / r; return 1.0 / (1.0 + d * d); }`,Cw=new Float32Array([0,-1,0,1,-1,0,0,1,0,1,1,0]),Iw=[0,1,2,2,1,3],Pw=`
${pl}
attribute vec3 aA; attribute vec3 aB; attribute float aW; attribute float aAl;
#ifdef USE_COL_ATTR
attribute vec3 aCol;
#endif
#ifdef USE_STRATA
attribute float aFace;
${Fs}
#endif
uniform vec3 uColor; uniform vec3 cWhite;
uniform float uWidth, uAlpha, uFar, uGlint, uFlatten, uFlattenY, uDrawA, uDrawB, uCount, uFlash, uStrut;
uniform vec2 uResolution; uniform float uPixelRatio; uniform vec3 uLamp; uniform float uWorldScale; uniform vec3 uCamPos;
${gx}
varying vec3 vCol; varying float vAlpha; varying float vSide; varying float vHalfW; varying float vAlong; varying float vDist;
void main() {
  vec3 a = aA, b = aB;
#ifdef USE_FLATTEN
  a.y = mix(a.y, uFlattenY, uFlatten); b.y = mix(b.y, uFlattenY, uFlatten);
#endif
  float id = float(gl_InstanceID);
  float t0 = clamp(uDrawA * uCount - id, 0.0, 1.0), t1 = clamp(uDrawB * uCount - id, 0.0, 1.0);
  if (t1 <= t0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  vec3 a2 = mix(a, b, t0), b2 = mix(a, b, t1);
  mat4 M = modelMatrix;
#ifdef USE_STRATA
  M = modelMatrix * strataMatrix(aFace);
#endif
  vec4 wa = M * vec4(a2, 1.0), wb = M * vec4(b2, 1.0);
  vec4 va = viewMatrix * wa, vb = viewMatrix * wb;
  float zc = -1.0001 * projectionMatrix[3][2] / (projectionMatrix[2][2] - 1.0);   // −near
  if (va.z > zc && vb.z > zc) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  if (va.z > zc) va = mix(va, vb, (va.z - zc) / (va.z - vb.z));
  else if (vb.z > zc) vb = mix(vb, va, (vb.z - zc) / (vb.z - va.z));
  vec4 ca = projectionMatrix * va, cb = projectionMatrix * vb;
  vec2 hr = 0.5 * uResolution;
  vec2 sa = ca.xy / ca.w * hr, sb = cb.xy / cb.w * hr;
  vec2 d = sb - sa; float len = length(d);
  vec2 dir = len > 1e-5 ? d / len : vec2(1.0, 0.0);
  float wpx = max(aW * uWidth * uPixelRatio, 0.0);
  float halfW = 0.5 * wpx + 1.0;
  vec4 c = mix(ca, cb, position.x);
  vec4 v = mix(va, vb, position.x);
  c.xy += vec2(-dir.y, dir.x) * position.y * halfW / hr * c.w;
  gl_Position = c;
  vSide = position.y * halfW; vHalfW = 0.5 * wpx;
  vAlong = position.x * len / uPixelRatio;
  float depth = -v.z;
  float al = aAl * uAlpha;
#ifdef USE_STRATA
  al *= strataAlpha(aFace);
#endif
#ifdef USE_STRUT
  al *= r1Lattice(uStrut, length(M[0].xyz), depth);
#endif
  al *= 1.0 - smoothstep(0.55 * uFar, uFar, depth / max(uWorldScale, 1e-9));
  vec3 wp = mix(wa.xyz, wb.xyz, position.x);
  vec3 sd = wb.xyz - wa.xyz; float sl = length(sd);
  float g = sl > 1e-9 ? pow(1.0 - abs(dot(sd / sl, normalize(uLamp - wp))), 24.0) * uGlint * lampReach(wp) : 0.0;
#ifdef USE_COL_ATTR
  vec3 col = aCol;
#else
  vec3 col = uColor;
#endif
  col = mix(col, cWhite, uFlash);
  vCol = col * (1.0 + g);
  vAlpha = al;
  vDist = length(v.xyz);
}`,Lw=`
${ui}
uniform vec2 uDash;
varying vec3 vCol; varying float vAlpha; varying float vSide; varying float vHalfW; varying float vAlong; varying float vDist;
void main() {
  float cov = clamp(vHalfW + 0.5 - abs(vSide), 0.0, 1.0);
  if (vHalfW < 0.5) cov *= 2.0 * vHalfW + 0.0001;
#ifdef USE_DASH
  if (mod(vAlong, uDash.x + uDash.y) > uDash.x) discard;
#endif
  float a = vAlpha * cov;
  if (a <= 0.002) discard;
  vec3 col = vCol;
#ifdef USE_FOG
  col = applyFog(col, vDist);
#endif
  gl_FragColor = vec4(col, a);
}`;function Dh(n,e){let t=new Float32Array(n);return t.fill(e),t}function hi(n={}){let e=n.segments||new Float32Array(6),t=n.count!=null?n.count:Math.floor(e.length/6),i=Math.max(1,Math.floor(e.length/6)),r=new Ts;r.setAttribute("position",new Xt(Cw,3)),r.setIndex(Iw);let s=new Io(e,6),o=()=>{r.setAttribute("aA",new Ro(s,3,0)),r.setAttribute("aB",new Ro(s,3,3))};o();let a=n.width instanceof Float32Array?n.width:Dh(i,1),l=n.alpha instanceof Float32Array?n.alpha:Dh(i,1);r.setAttribute("aW",new Gn(a,1)),r.setAttribute("aAl",new Gn(l,1));let c={},u=n.color instanceof Float32Array;u&&(r.setAttribute("aCol",new Gn(n.color,3)),c.USE_COL_ATTR=""),n.faces&&n.strata&&(r.setAttribute("aFace",new Gn(n.faces,1)),c.USE_STRATA=""),n.dash&&(c.USE_DASH=""),n.strut!=null&&(c.USE_STRUT=""),n.flatten&&(c.USE_FLATTEN=""),n.fog!==!1&&(c.USE_FOG=""),r.instanceCount=t;let d={uColor:Un(u?"silver":n.color||"silver"),uWidth:{value:typeof n.width=="number"?n.width:1},uAlpha:{value:typeof n.alpha=="number"?n.alpha:n.alpha instanceof Float32Array?1:Vt.r3.alpha},uFar:{value:n.far!=null?n.far:mx()},uGlint:{value:n.glint!=null?n.glint:Vt.r3.glintGain},uFlatten:{value:0},uFlattenY:{value:0},uDrawA:{value:0},uDrawB:{value:1},uCount:{value:t},uFlash:{value:0},uStrut:{value:n.strut!=null?n.strut:0},uDash:{value:new nt(n.dash?n.dash[0]:1,n.dash?n.dash[1]:0)},uStrataM:n.strata||Ls(),uStrataA:n.strataAlpha||Ds(),cWhite:he.cWhite,cAbyss:he.cAbyss,uFogDensity:he.uFogDensity,uLamp:he.uLamp,uCamPos:he.uCamPos,uResolution:he.uResolution,uPixelRatio:he.uPixelRatio,uPxPerUnit:he.uPxPerUnit,uWorldScale:he.uWorldScale},h=new bt({uniforms:d,defines:c,vertexShader:Pw,fragmentShader:Lw,transparent:!0,depthWrite:!1,depthTest:n.depthTest!==!1,blending:n.additive?Rs:Di}),f=new Lt(r,h);return f.frustumCulled=!1,n.layer!=null&&f.layers.set(n.layer),n.renderOrder!=null&&(f.renderOrder=n.renderOrder),{mesh:f,uniforms:d,get count(){return t},setSegments(_,m){let p=m??Math.floor(_.length/6);p<=i&&_!==s.array?(s.array.set(_.subarray(0,p*6)),s.needsUpdate=!0):_!==s.array?(i=Math.max(p,Math.floor(_.length/6)),s=new Io(_,6),o(),a.length<i&&!(n.width instanceof Float32Array)&&r.setAttribute("aW",new Gn(Dh(i,1),1)),l.length<i&&!(n.alpha instanceof Float32Array)&&r.setAttribute("aAl",new Gn(Dh(i,1),1))):s.needsUpdate=!0,t=p,r.instanceCount=p,d.uCount.value=p},setColor(_){_ instanceof Float32Array?(r.setAttribute("aCol",new Gn(_,3)),h.defines.USE_COL_ATTR===void 0&&(h.defines.USE_COL_ATTR="",h.needsUpdate=!0)):(d.uColor=Un(_||"silver"),h.defines.USE_COL_ATTR!==void 0&&(delete h.defines.USE_COL_ATTR,h.needsUpdate=!0))},setAlpha(_){d.uAlpha.value=_,f.visible=_>0},setWidth(_){d.uWidth.value=_},setDrawRange01(_,m){d.uDrawA.value=_,d.uDrawB.value=m},setFlatten(_,m){d.uFlatten.value=_,d.uFlattenY.value=m},dispose(){r.dispose(),h.dispose(),f.parent&&f.parent.remove(f)}}}var Dw=`
${pl}
#ifdef USE_STRATA
attribute float aFace;
${Fs}
#endif
#ifdef USE_ASTRUT
attribute float aStrut;
#endif
#ifdef USE_DIR
attribute vec3 aDir;
#endif
uniform float uStrut, uAlpha, uFar, uGlint, uWorldScale, uFade; uniform vec3 uLamp; uniform vec3 uColor; uniform vec3 uCamPos;
${gx}
varying vec3 vCol; varying float vAlpha; varying float vDist;
void main() {
  mat4 M = modelMatrix;
#ifdef USE_STRATA
  M = modelMatrix * strataMatrix(aFace);
#endif
  vec4 w = M * vec4(position, 1.0);
  vec4 v = viewMatrix * w;
  float depth = -v.z;
#ifdef USE_ASTRUT
  float strut = aStrut;
#else
  float strut = uStrut;
#endif
  float la = r1Lattice(strut, length(M[0].xyz), depth);
  if (la < 0.002 || uFade <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
  gl_Position = projectionMatrix * v;
  float g = 0.0;
#ifdef USE_DIR
  vec3 dw = normalize(mat3(M) * aDir);
  g = pow(1.0 - abs(dot(dw, normalize(uLamp - w.xyz))), 24.0) * uGlint * lampReach(w.xyz);
#endif
  vCol = uColor * (1.0 + g);
  vAlpha = uAlpha * uFade * la * (1.0 - smoothstep(0.55 * uFar, uFar, depth / max(uWorldScale, 1e-9)));
#ifdef USE_STRATA
  vAlpha *= strataAlpha(aFace);
#endif
  vDist = length(v.xyz);
}`,Nw=`
${ui}
varying vec3 vCol; varying float vAlpha; varying float vDist;
void main() {
  if (vAlpha <= 0.002) discard;
  vec3 col = vCol;
#ifdef USE_FOG
  col = applyFog(col, vDist);
#endif
  gl_FragColor = vec4(col, vAlpha);
}`;function xx(n={}){let e={};return n.strut==null&&(e.USE_ASTRUT=""),n.strata&&(e.USE_STRATA=""),n.dir!==!1&&(e.USE_DIR=""),n.fog!==!1&&(e.USE_FOG=""),new bt({uniforms:{uStrut:{value:n.strut!=null?n.strut:0},uAlpha:{value:n.alpha!=null?n.alpha:Vt.r3.alpha},uFade:{value:1},uFar:{value:n.far!=null?n.far:mx()},uGlint:{value:n.glint!=null?n.glint:Vt.r3.glintGain},uColor:Un(n.color||"silver"),uStrataM:n.strata||Ls(),uStrataA:n.strataAlpha||Ds(),uLamp:he.uLamp,uCamPos:he.uCamPos,uWorldScale:he.uWorldScale,uPxPerUnit:he.uPxPerUnit,cAbyss:he.cAbyss,uFogDensity:he.uFogDensity},defines:e,vertexShader:Dw,fragmentShader:Nw,transparent:!0,depthWrite:!1,blending:Di})}var Fw=`
attribute float aSize; attribute float aAlpha;
#ifdef USE_STRATA
attribute float aFace;
${Fs}
#endif
uniform float uSize, uPixelRatio;
varying float vAlpha; varying float vDist; varying float vPx;
void main() {
  mat4 M = modelMatrix;
  float a = aAlpha;
#ifdef USE_STRATA
  M = modelMatrix * strataMatrix(aFace);
  a *= strataAlpha(aFace);
#endif
  vec4 v = viewMatrix * (M * vec4(position, 1.0));
  gl_Position = projectionMatrix * v;
  float px = max(uSize * aSize * uPixelRatio, 1.0);
  gl_PointSize = px + 1.0;
  vPx = px;
  vAlpha = a;
  vDist = length(v.xyz);
}`,Ow=`
${ui}
uniform vec3 uColor; uniform float uAlpha;
varying float vAlpha; varying float vDist; varying float vPx;
void main() {
  float r = length(gl_PointCoord - 0.5) * (vPx + 1.0);     // device px from the centre
  float cov = clamp(0.5 * vPx + 0.5 - r, 0.0, 1.0);
  float a = cov * vAlpha * uAlpha;
  if (a <= 0.003) discard;
  vec3 col = uColor;
#ifdef USE_FOG
  col = applyFog(col, vDist);
#endif
  gl_FragColor = vec4(col, a);
}`;function Nh(n,e){let t=new Float32Array(Math.max(1,n));return t.fill(e),t}function Qr(n={}){let e=n.positions||new Float32Array(3),t=Math.floor(e.length/3),i=n.count!=null?Math.min(n.count,t):t,r=new an;r.setAttribute("position",new Xt(e,3)),r.setAttribute("aSize",new Xt(n.sizes||Nh(t,1),1)),r.setAttribute("aAlpha",new Xt(n.alphas||Nh(t,1),1));let s={};n.faces&&n.strata&&(r.setAttribute("aFace",new Xt(n.faces,1)),s.USE_STRATA=""),n.fog!==!1&&(s.USE_FOG=""),r.setDrawRange(0,i);let o={uColor:Un(n.color||"white"),uAlpha:{value:n.alpha!=null?n.alpha:.4},uSize:{value:n.sizePx!=null?n.sizePx:2},uStrataM:n.strata||Ls(),uStrataA:n.strataAlpha||Ds(),uPixelRatio:he.uPixelRatio,cAbyss:he.cAbyss,uFogDensity:he.uFogDensity},a=new bt({uniforms:o,defines:s,vertexShader:Fw,fragmentShader:Ow,transparent:!0,depthWrite:!1,depthTest:n.depthTest!==!1,blending:Di}),l=new Ha(r,a);return l.frustumCulled=n.frustumCulled===!0,l.layers.set(n.layer!=null?n.layer:On.DEFAULT),n.renderOrder!=null&&(l.renderOrder=n.renderOrder),{object:l,uniforms:o,get count(){return i},setCount(c){i=Math.max(0,Math.min(t,c|0)),r.setDrawRange(0,i)},setAlpha(c){o.uAlpha.value=c,l.visible=c>0},setSize(c){o.uSize.value=c},setColor(c){o.uColor=Un(c),a.uniforms.uColor=o.uColor},setPositions(c,u){let d=u??Math.floor(c.length/3);d<=t&&c!==e?e.set(c.subarray(0,d*3)):c!==e&&(e=c,t=Math.floor(c.length/3),r.setAttribute("position",new Xt(e,3)),r.setAttribute("aSize",new Xt(Nh(t,1),1)),r.setAttribute("aAlpha",new Xt(Nh(t,1),1))),r.attributes.position.needsUpdate=!0,i=Math.min(d,t),r.setDrawRange(0,i)},dispose(){r.dispose(),a.dispose(),l.parent&&l.parent.remove(l)}}}var gp=Math.PI*2,$o=99,Uw=wt.sign.heightFrac;function _i(n,e,t,i,r,s){let o=Math.floor(i),a=i-o,l=gp*o/n-Math.PI/n,c=l+gp/n,u=Math.sin(l)*e,d=Math.cos(l)*e,h=Math.sin(c)*e,f=Math.cos(c)*e;r[s]=u+(h-u)*a,r[s+1]=t,r[s+2]=d+(f-d)*a}function Fh(n,e,t,i,r=n.k){return t*n.n/r+(e<0?.5*n.n/r:0)+e*wt.lattice.faceShift*i}var xp=2,Oh=(n,e,t)=>Math.max(1e-4,2*qt(t)*Math.sin(Math.PI/n)*n/(e*xp)),Uh=class{constructor(){this.p=[],this.n=[],this.uv=[],this.eng=[],this.face=[],this.kind=[],this.strut=[]}tri(e,t,i,r,s,o){let a=t[0]-e[0],l=t[1]-e[1],c=t[2]-e[2],u=i[0]-e[0],d=i[1]-e[1],h=i[2]-e[2],f=l*h-c*d,g=c*u-a*h,_=a*d-l*u,m=Math.hypot(f,g,_);if(m<1e-12)return;f/=m,g/=m,_/=m;let p=e,S=t,b=i;f*o[0]+g*o[1]+_*o[2]<0&&(S=i,b=t,f=-f,g=-g,_=-_);for(let y of[p,S,b])this.p.push(y[0],y[1],y[2]),this.n.push(f,g,_),this.uv.push(y[3],y[4]),this.eng.push(y[5],y[6],y[7],y[8]),this.face.push(r),this.kind.push(s),this.strut.push(y[9])}geometry(){let e=new an;return e.setAttribute("position",new Pt(this.p,3)),e.setAttribute("normal",new Pt(this.n,3)),e.setAttribute("aFaceUV",new Pt(this.uv,2)),e.setAttribute("aEng",new Pt(this.eng,4)),e.setAttribute("aFace",new Pt(this.face,1)),e.setAttribute("aKind",new Pt(this.kind,1)),e.setAttribute("aStrut",new Pt(this.strut,1)),e.computeBoundingSphere(),e}},wn=new Float32Array(3);function vx(n,e){let{i:t,n:i,k:r,top:s,bot:o,hollow:a}=e,l=s-o,c=(s+o)/2,u=Uw*l,d=ac.map(f=>s+(o-s)*f),h=d.map(f=>qt(f));for(let f=0;f<i;f++){let g=gp*f/i,_=Math.cos(g),m=-Math.sin(g),p=[Math.sin(g),0,Math.cos(g)],S=t*16+f,b=(y,A)=>{_i(i,h[y],d[y],f+A,wn,0);let T=wn[0]*_+wn[2]*m;return[wn[0],wn[1],wn[2],A,(s-d[y])/l,T/u+.5,.5-(d[y]-c)/u,s-d[y],d[y]-o,Oh(i,r,d[y])]};for(let y=0;y<3;y++){let A=b(y,0),T=b(y,1),R=b(y+1,0),x=b(y+1,1);n.tri(A,R,x,S,0,p),n.tri(A,x,T,S,0,p)}for(let[y,A,T,R]of[[s,h[0],1,1],[o,h[3],2,-1]]){if(A<=1e-6)continue;let x=Oh(i,r,y),w=(C,D)=>(_i(i,C,y,D,wn,0),[wn[0],wn[1],wn[2],.5,T===1?0:1,-1,-1,$o,$o,x]);if(a>0){let C=w(A,f),D=w(A,f+1),O=w(a,f),z=w(a,f+1);n.tri(C,D,z,S,T,[0,R,0]),n.tri(C,z,O,S,T,[0,R,0])}else n.tri([0,y,0,.5,T===1?0:1,-1,-1,$o,$o,x],w(A,f),w(A,f+1),S,T,[0,R,0])}if(a>0){let y=2*a*Math.sin(Math.PI/i)*i/(r*xp),A=(D,O)=>(_i(i,a,D,O,wn,0),[wn[0],wn[1],wn[2],O-f,(s-D)/l,-1,-1,$o,$o,y]),T=A(s,f),R=A(s,f+1),x=A(o,f),w=A(o,f+1),C=[-Math.sin(g),0,-Math.cos(g)];n.tri(T,x,w,S,3,C),n.tri(T,w,R,S,3,C)}}}function yx(n){let e=[],t=[],i=[],r=[],s=new Float32Array(3),o=new Float32Array(3),a=(u,d,h,f,g,_)=>{let m=f[0]-h[0],p=f[1]-h[1],S=f[2]-h[2],b=Math.hypot(m,p,S)||1,y=u.i*16+(Math.floor(d)%u.n+u.n)%u.n;e.push(h[0],h[1],h[2],f[0],f[1],f[2]),t.push(y,y),i.push(g,_),r.push(m/b,p/b,S/b,m/b,p/b,S/b)},l=wt.lattice.segmentsPerGenerator;for(let u of Mn){let d=Math.max(1,Math.round(u.k*n)),h=u.hollow>0?[!1,!0]:[!1];for(let f of h)for(let g of[1,-1])for(let _=0;_<d;_++)for(let m=0;m<l;m++){let p=m/l,S=(m+1)/l,b=u.top+(u.bot-u.top)*p,y=u.top+(u.bot-u.top)*S,A=f?u.hollow:qt(b),T=f?u.hollow:qt(y),R=Fh(u,g,_,p,d),x=Fh(u,g,_,S,d),w=O=>(O%u.n+u.n)%u.n;_i(u.n,A,b,w(R),s,0),_i(u.n,T,y,w(x),o,0);let C=f?2*u.hollow*Math.sin(Math.PI/u.n)*u.n/(u.k*xp):Oh(u.n,u.k,b),D=f?C:Oh(u.n,u.k,y);a(u,w((R+x)/2),s,o,C,D)}}let c=new an;return c.setAttribute("position",new Pt(e,3)),c.setAttribute("aFace",new Pt(t,1)),c.setAttribute("aStrut",new Pt(i,1)),c.setAttribute("aDir",new Pt(r,3)),c.computeBoundingSphere(),c}function Bw(){let n=[],e=[],t=[],i=new Float32Array(3),r=new Float32Array(3),s=(o,a,l)=>{n.push(i[0],i[1],i[2],r[0],r[1],r[2]),e.push(l),t.push(o*16+a)};for(let o of Mn){let{i:a,n:l,top:c,bot:u,hollow:d}=o,h=ac.map(m=>c+(u-c)*m),f=[...Array(l).keys()].sort((m,p)=>Math.min(m,l-m)-Math.min(p,l-p)),g=0,_=new Set;for(let m of f)for(let p of[0,3])g<Vt.r3.primaryEdges&&qt(h[p])>1e-6&&(_.add(`${p}:${m}`),g++);for(let m=0;m<l;m++){for(let p=0;p<3;p++)_i(l,qt(h[p]),h[p],m,i,0),_i(l,qt(h[p+1]),h[p+1],m,r,0),s(a,m,Vt.r3.widthPx);for(let p of[0,3]){let S=qt(h[p]);S<=1e-6||(_i(l,S,h[p],m,i,0),_i(l,S,h[p],m+.999999,r,0),s(a,m,_.has(`${p}:${m}`)?Vt.r3.primaryPx:Vt.r3.widthPx))}if(d>0)for(let p of[c,u])_i(l,d,p,m,i,0),_i(l,d,p,m+.999999,r,0),s(a,m,Vt.r3.widthPx)}}return{seg:new Float32Array(n),width:new Float32Array(e),face:new Float32Array(t)}}function kw(){let n=[],e=[];for(let t of Mn)for(let i of ac){let r=t.top+(t.bot-t.top)*i,s=qt(r);for(let o=0;o<t.n&&(_i(t.n,s,r,o,wn,0),n.push(wn[0],wn[1],wn[2]),e.push(t.i*16+o),!(s<=1e-6));o++);}return{pos:new Float32Array(n),face:new Float32Array(e)}}function Ml(n={}){let e=!!n.perStratum,t=new Bt;t.name=e?"structure:key":"structure";let i=n.scale!=null?n.scale:1;t.scale.setScalar(i);let r=n.far!=null?n.far:700,s={value:Array.from({length:7},()=>new vt)},o={value:[1,1,1,1,1,1,1]},a=[];if(e)for(let R=0;R<7;R++){let x=new Bt;x.name=`stratum:${R}`,t.add(x),a.push(x)}else a.push(t);let l=()=>{if(e)for(let R=0;R<7;R++)s.value[R].copy(a[R].matrix)},c=[],u=null;if(n.solid!==!1)if(e){u=mp({engrave:"key",strataAlpha:o});for(let R of Mn){let x=new Uh;vx(x,R);let w=new Lt(x.geometry(),u);w.name=`solid:${R.i}`,w.userData.stratum=R.i,a[R.i].add(w),c.push(w)}}else{u=mp({engrave:"key",strata:s,strataAlpha:o});let R=new Uh;for(let w of Mn)vx(R,w);let x=new Lt(R.geometry(),u);x.name="solid",x.frustumCulled=!1,t.add(x),c.push(x)}let d=null,h=null,f=n.latticeDensity!=null?n.latticeDensity:1;n.lattice!==!1&&(h=xx({strata:s,strataAlpha:o,far:r,dir:!0}),d=new Ga(yx(f),h),d.name="lattice",d.frustumCulled=!1,d.onBeforeRender=l,t.add(d));let g=[],_=Vt.r3.alpha;if(n.edges!==!1){let R=Bw(),x=hi({segments:R.seg,width:R.width,faces:R.face,strata:s,strataAlpha:o,far:r,alpha:_});x.mesh.name="edges",x.mesh.onBeforeRender=l,t.add(x.mesh),g.push(x)}let m=null,p=null,S=.4;if(n.vertices){let R=kw();p=Qr({positions:R.pos,faces:R.face,strata:s,strataAlpha:o,sizePx:2,color:"white",alpha:S}),m=p.object,m.name="vertices",m.onBeforeRender=l,t.add(m)}let b=1,y={solid:1,lattice:1,edges:1,vertices:1},A=()=>{t.visible=b>0,u&&(u.uniforms.uAlpha.value=b*y.solid);for(let R of c)R.visible=b*y.solid>0;h&&(h.uniforms.uFade.value=b*y.lattice,d.visible=b*y.lattice>0);for(let R of g)R.setAlpha(_*b*y.edges);p&&p.setAlpha(S*b*y.vertices)},T={group:t,strata:a,solids:c,lattice:d,edges:g,vertices:m,strataMatrices:s,strataAlpha:o,solidMaterial:u,latticeMaterial:h,perStratum:e,setGap(R){for(let x=0;x<7;x++){let w=(3-x)*(R-St.rest);e?a[x].position.y=w:s.value[x].makeTranslation(0,w,0)}},setFade(R){b=Math.max(0,Math.min(1,R)),A()},get fade(){return b},setStratumFade(R,x){R>=0&&R<7&&(o.value[R]=Math.max(0,Math.min(1,x)))},setParts(R){for(let x in R)x in y&&(y[x]=R[x]);A()},setFar(R){h&&(h.uniforms.uFar.value=R);for(let x of g)x.uniforms.uFar.value=R},setHideCaps(R){u&&(u.uniforms.uHideCapsOf.value=R)},setLatticeDensity(R){if(!d||R===f)return;f=R;let x=d.geometry;d.geometry=yx(R),x.dispose()},dispose(){for(let R of c)R.geometry.dispose();u&&u.dispose(),d&&(d.geometry.dispose(),h.dispose());for(let R of g)R.dispose();p&&p.dispose(),t.parent&&t.parent.remove(t)}};return T.setGap(St.rest),n.hallLod&&T.setHideCaps(-1),T}var Qi=null;function zw(){if(Qi)return Qi;let n=document.createElement("canvas");n.width=n.height=64;let e=n.getContext("2d"),t=e.createImageData(64,64);for(let i=0;i<64;i++)for(let r=0;r<64;r++){let s=(r+.5)/32-1,o=(i+.5)/32-1,a=Math.min(1,Math.sqrt(s*s+o*o)),l=(.72*Math.exp(-a*a*18)+.28*Math.exp(-a*a*4.2))*(1-a*a)*(1-a),c=(i*64+r)*4;t.data[c]=t.data[c+1]=t.data[c+2]=255,t.data[c+3]=Math.round(255*Math.min(1,l))}return e.putImageData(t,0,0),Qi=new _r(n),Qi.minFilter=yt,Qi.magFilter=yt,Qi.generateMipmaps=!1,Qi.wrapS=Qi.wrapT=Dn,yi(Qi,4096*4),Qi}var Vw=`
#ifdef USE_BATCH
attribute vec3 aOffset;
#endif
uniform float uRadius;
varying vec2 vUv; varying float vDist;
void main() {
  vec3 c = vec3(0.0);
#ifdef USE_BATCH
  c = aOffset;
#endif
  float s = length(modelMatrix[0].xyz);
  vec4 v = viewMatrix * (modelMatrix * vec4(c, 1.0));
  v.xy += position.xy * 2.0 * uRadius * s;
  gl_Position = projectionMatrix * v;
  vUv = uv;
  vDist = length(v.xyz);
}`,Gw=`
${ui}
uniform sampler2D uTex; uniform vec3 uColor; uniform vec3 cElectrum; uniform vec3 cWhite;
uniform float uIntensity, uNight, uNightMix, uNightI, uFlash;
varying vec2 vUv; varying float vDist;
void main() {
  float a = texture2D(uTex, vUv).a;
  vec3 col = mix(uColor, cElectrum, uNight * uNightMix);
  col = mix(col, cWhite, uFlash);
  float k = uIntensity * mix(1.0, uNightI, uNight * uNightMix);
#ifdef USE_FOG
  k *= fogVis(vDist);
#endif
  float o = a * k;
  if (o <= 0.002) discard;
  gl_FragColor = vec4(col * o, o);
}`,Sl=new Set,vp=null;function _x(){return vp||(vp=new Mr(1,1)),vp}function Mx(n,e){let t={};e&&(t.USE_BATCH=""),n.fog!==!1&&(t.USE_FOG="");let i={uTex:{value:zw()},uColor:Un(n.color||"ember"),uRadius:{value:n.radius!=null?n.radius:.05},uIntensity:{value:n.intensity!=null?n.intensity:1},uNightMix:{value:n.night?1:0},uNightI:{value:n.nightIntensity!=null?n.nightIntensity:.55},uFlash:{value:0},uNight:he.uNight,cElectrum:he.cElectrum,cWhite:he.cWhite,cAbyss:he.cAbyss,uFogDensity:he.uFogDensity};return new bt({uniforms:i,defines:t,vertexShader:Vw,fragmentShader:Gw,transparent:!0,depthWrite:!1,depthTest:n.depthTest!==!1,blending:Rs,premultipliedAlpha:!0})}function yp(n,e){let t=e==="T3";n.core?(t?n.core.layers.enable(On.EMISSIVE):n.core.layers.disable(On.EMISSIVE),n._tierHidden=t):(t?n.sprite.layers.enable(On.EMISSIVE):n.sprite.layers.disable(On.EMISSIVE),n._tierHidden=!1),n._sync()}Oe.on("tier:change",({tier:n})=>{for(let e of Sl)yp(e,n)});function Bh(n={}){let e=new Bt,t=Mx(n,!1),i=new Lt(_x(),t);i.frustumCulled=!1,i.renderOrder=n.renderOrder!=null?n.renderOrder:5,e.add(i),n.core&&e.add(n.core);let r={object:e,sprite:i,core:n.core||null,uniforms:t.uniforms,_tierHidden:!1,_sync(){i.visible=!r._tierHidden&&t.uniforms.uIntensity.value>0},setIntensity(s){t.uniforms.uIntensity.value=s,r._sync()},setColor(s){t.uniforms.uColor=Un(s)},setRadius(s){t.uniforms.uRadius.value=s},setFlash(s){t.uniforms.uFlash.value=s},dispose(){Sl.delete(r),t.dispose(),e.parent&&e.parent.remove(e)}};return Sl.add(r),yp(r,it.tier),r}function kh(n={}){let e=n.positions||new Float32Array(3),t=Math.max(1,Math.floor(e.length/3)),i=_x(),r=new Ts;r.setIndex(i.index.clone()),r.setAttribute("position",i.getAttribute("position").clone()),r.setAttribute("uv",i.getAttribute("uv").clone());let s=new Gn(new Float32Array(t*3),3);s.array.set(e.subarray(0,t*3)),r.setAttribute("aOffset",s);let o=n.count!=null?Math.min(t,n.count):t;r.instanceCount=o;let a=Mx(n,!0),l=new Lt(r,a);l.frustumCulled=!1,l.renderOrder=n.renderOrder!=null?n.renderOrder:5;let c={object:l,sprite:l,core:null,uniforms:a.uniforms,_tierHidden:!1,_sync(){l.visible=o>0&&a.uniforms.uIntensity.value>0},get count(){return o},setCount(u){o=Math.max(0,Math.min(t,u|0)),r.instanceCount=o,c._sync()},setIntensity(u){a.uniforms.uIntensity.value=u,c._sync()},setColor(u){a.uniforms.uColor=Un(u)},setRadius(u){a.uniforms.uRadius.value=u},setPositions(u,d){let h=Math.min(t,d??Math.floor(u.length/3));s.array.set(u.subarray(0,h*3)),s.needsUpdate=!0,c.setCount(h)},dispose(){Sl.delete(c),r.dispose(),a.dispose(),l.parent&&l.parent.remove(l)}};return Sl.add(c),yp(c,it.tier),c}var Us=Mn[gs.stratum],bl=Us.n/Us.k,Hw=Math.floor(1.5/bl-.5)+1,Sx=.003;function Ww(n,e){let t=Math.round(e*1.5/bl-.5);t=Math.max(0,Math.min(Hw-1,t));let i=(t+.5)*bl/1.5,r=Fh(Us,1,0,i),s=Math.round((n-r)/bl);return{s:r+s*bl,t:i,key:`${t}:${s}`}}function Xw(n,e,t){let i=Us.top+(Us.bot-Us.top)*e,r=qt(i),s=Us.n,o=(n%s+s)%s,a=Math.floor(o),l=o-a,c=Math.PI*2*a/s-Math.PI/s,u=c+Math.PI*2/s;return t.set(Math.sin(c)*r+(Math.sin(u)-Math.sin(c))*r*l,i,Math.cos(c)*r+(Math.cos(u)-Math.cos(c))*r*l)}function wl(n){let e=xs(n||[]),t=[],i=new Set,r=o=>-1+3*(.1+.8*o),s=o=>.1+.8*o;for(let[o,a]of e){let l=Cf(o),c=Cf(a),u=Math.hypot((c.x-l.x)*6,(c.y-l.y)*6),d=Math.max(1,Math.round(u));for(let h=0;h<=d;h++){let f=h/d,g=Ww(r(l.x+(c.x-l.x)*f),s(l.y+(c.y-l.y)*f));if(i.has(g.key))continue;i.add(g.key);let _=Xw(g.s,g.t,new I);Math.hypot(_.x,_.y)<gs.apertureSkip||t.push(_)}}return t}function zh(n={}){let e=n.scale||1,t=n.nodes||wl(nn.clan.sigil),i=new Float32Array(Math.max(1,t.length)*3);t.forEach((l,c)=>{let u=Math.hypot(l.x,l.z)||1;i[c*3]=l.x+l.x/u*Sx,i[c*3+1]=l.y,i[c*3+2]=l.z+l.z/u*Sx});let r=0,s=!1,o=ar&&ar.litAlpha!=null?ar.litAlpha:.7;if(e<1e3){let l=Qr({positions:i,count:0,sizePx:n.dotPx||gs.dotPx,color:"ember",alpha:1});return l.object.name="litNodes",l.object.renderOrder=3,{object:l.object,nodes:t,get count(){return r},setCount(c){r=Math.max(0,Math.min(t.length,c|0)),l.setCount(r),l.object.visible=r>0},setNight(c){s=!!c,l.setAlpha(s?o:1)},dispose(){l.dispose()}}}let a=kh({positions:i,count:0,color:"ember",radius:(n.emitterM||gs.emitterM)/e,intensity:1,night:!1});return a.object.name="litNodes",{object:a.object,nodes:t,get count(){return r},setCount(l){r=Math.max(0,Math.min(t.length,l|0)),a.setCount(r)},setNight(l){s=!!l,a.setIntensity(s?o:1)},dispose(){a.dispose()}}}var wx="samvin.v1",bx="samvin.session",Yw=400,Ex=/^S(0[1-9]|1[0-4])$/,qo=n=>n!==null&&typeof n=="object"&&!Array.isArray(n),_p=n=>Array.isArray(n)&&n.every(e=>typeof e=="string");function $w(){return{v:1,firstVisit:null,lastVisit:null,days:[],found:{},shards:0,nadirOpen:!1,owner:!1,glyph:null,drawings:[],jokesFound:[],drones:{day:null,count:0,arrivals:0},resonanceNext:0,maxNest:0,transmissions:{delivered:0,read:[],lastDay:null},probes:{},decoded:[],capsuleOpened:!1,companionArrived:!1,whaleSeen:!1,inverted:!1,sound:"on",tier:null,lastRoom:"#/core",firstDive:!1,firstUnfold:!1,whaleDay:null,birthdayLeadDay:null,foundVars:{}}}var qw={v:n=>n===1,firstVisit:n=>n===null||typeof n=="string"&&Number.isFinite(Date.parse(n)),lastVisit:n=>n===null||typeof n=="string"&&Number.isFinite(Date.parse(n)),days:n=>_p(n),found:n=>qo(n),shards:n=>Number.isInteger(n)&&n>=0&&n<=5,nadirOpen:n=>typeof n=="boolean",owner:n=>typeof n=="boolean",glyph:n=>n===null||Array.isArray(n),drawings:n=>Array.isArray(n),jokesFound:n=>_p(n),drones:n=>qo(n),resonanceNext:n=>Number.isInteger(n)&&n>=0,maxNest:n=>typeof n=="number"&&Number.isFinite(n),transmissions:n=>qo(n),probes:n=>qo(n),decoded:n=>_p(n),capsuleOpened:n=>typeof n=="boolean",companionArrived:n=>typeof n=="boolean",whaleSeen:n=>typeof n=="boolean",inverted:n=>typeof n=="boolean",sound:n=>n==="on"||n==="off",tier:n=>n===null||n==="T1"||n==="T2"||n==="T3",lastRoom:n=>typeof n=="string"&&n.startsWith("#"),firstDive:n=>typeof n=="boolean",firstUnfold:n=>typeof n=="boolean",whaleDay:n=>n===null||typeof n=="string",birthdayLeadDay:n=>n===null||typeof n=="string",foundVars:n=>qo(n)};function jw(n){let e=qo(n)?n:{},t=$w();for(let s of Object.keys(t))(!(s in e)||!qw[s](e[s]))&&(e[s]=t[s]);let i=e.drones;i.day===null||typeof i.day=="string"||(i.day=null),Number.isInteger(i.count)||(i.count=0),Number.isInteger(i.arrivals)||(i.arrivals=0);let r=e.transmissions;(!Number.isInteger(r.delivered)||r.delivered<0)&&(r.delivered=0),Array.isArray(r.read)||(r.read=[]),r.read=r.read.filter(s=>Number.isInteger(s)&&s>=0),r.lastDay===null||typeof r.lastDay=="string"||(r.lastDay=null);for(let s of Object.keys(e.found))(!Ex.test(s)||typeof e.found[s]!="string")&&delete e.found[s];return e.days=[...new Set(e.days.filter(s=>/^\d{4}-\d{2}-\d{2}$/.test(s)))].sort(),e}function Zw(){try{let n=localStorage.getItem(wx);if(n==null)return{};try{return JSON.parse(n)}catch{return{}}}catch{return se.storageOk=!1,{}}}var El=0,Gh=!1;function jo(){if(El&&(clearTimeout(El),El=0),!(!Gh||!se.data)&&(Gh=!1,!!se.storageOk))try{localStorage.setItem(wx,JSON.stringify(se.data))}catch{se.storageOk=!1}}function vs(){if(Gh=!0,!El)try{El=setTimeout(jo,500)}catch{jo()}}var Vh=-1,se={data:null,storageOk:!0,today:"",distinctDays:1,isNewDay:!1,returning:!1,sameDaySession:!1,daysAway:0,bond:0,shrp:28,get litNodes(){if(Vh<0)try{Vh=wl(nn.clan.sigil).length}catch(n){Vh=0,Rt("state:lit",n)}return Math.min(se.distinctDays,Vh)},set(n,e){se.data[n]=e,vs()},patch(n){n(se.data),vs()},deliverTransmissions(){let n=se.data.transmissions;if(n.lastDay===se.today)return 0;let e=nn.transmissions.length,t=Math.min(e,Math.max(n.delivered,se.distinctDays)),i=Math.max(0,t-n.delivered);return n.delivered=Math.max(n.delivered,t),n.lastDay=se.today,vs(),i},markRead(n){let e=se.data.transmissions;!Number.isInteger(n)||n<0||e.read.includes(n)||(e.read.push(n),vs())},rank(){let n=Object.keys(se.data.found).filter(t=>Ex.test(t)).length,e=se.distinctDays;return n>=12&&e>=14?{name:"АРХИТЕКТОР",index:3}:n>=7&&e>=5?{name:"СМОТРИТЕЛЬ",index:2}:n>=3||e>=3?{name:"ИССЛЕДОВАТЕЛЬ",index:1}:{name:"НАБЛЮДАТЕЛЬ",index:0}}};function Ax(n){let e=Number.isFinite(n)?n:Date.now(),t=jw(Zw());se.data=t,se.today=fc(e);let i=!0;try{i=sessionStorage.getItem(bx)==null,sessionStorage.setItem(bx,"1")}catch{i=!0}let r=t.firstVisit,s=t.lastVisit?fc(Date.parse(t.lastVisit)):null;if(se.returning=r!=null&&i,se.sameDaySession=se.returning&&s===se.today,se.daysAway=s?Math.max(0,cc(s,se.today)):0,se.isNewDay=!t.days.includes(se.today),se.isNewDay)for(t.days.push(se.today),t.days.sort();t.days.length>Yw;)t.days.shift();se.distinctDays=Math.max(1,t.days.length);let o=new Date(e).toISOString();t.firstVisit==null&&(t.firstVisit=o),t.lastVisit=o;let a=Object.keys(t.found).length;return se.bond=wf(se.distinctDays,a),se.shrp=zm(se.distinctDays,a),Gh=!0,jo(),se}typeof window<"u"&&window.addEventListener("pagehide",jo);var Tx=Object.freeze({clan:"members",crew:"members",missions:"voyages",vault:"insignia",legends:"archive"}),Cx=new Set(["MEMBERS","VOYAGES","ARCHIVE","INSIGNIA"]);function Kw(n){try{return decodeURIComponent(n)}catch{return n}}function es(n,e){let t={hash:"",room:n,sub:e==null||e===""?null:e};return t.hash=Jw(t),t}function er(n){if(n&&typeof n=="object"&&n.room)return es(be[n.room]?n.room:"CORE",n.sub||null);let t=String(n??"").trim().replace(/^#?\/?/,"").split(/[/?]/).filter(Boolean),i=(t[0]||"core").toLowerCase();Tx[i]&&(i=Tx[i]);let r=px(i);if(!r||r.id==="WORKSHOP")return es("CORE",null);let s=t[1]?Kw(t[1]):null;return r.id==="MEMBERS"&&s&&s.toLowerCase()==="workshop"?es("WORKSHOP",null):r.id==="CORE"?es("CORE",s&&s.toLowerCase()==="open"?"open":null):es(r.id,Cx.has(r.id)?s:null)}function Jw(n){let e=n&&be[n.room]?n.room:"CORE";if(e==="WORKSHOP")return"#/members/workshop";let t=n.sub,i=t!=null&&t!==""&&(Cx.has(e)||e==="CORE"&&t==="open");return`#/${be[e].slug}${i?"/"+encodeURIComponent(String(t)):""}`}var Rx=n=>!!(se.data&&se.data.found&&se.data.found[n]);function Mp(n,e){let t=n&&n.room?n:er(n),i=se.data||{};return t.room==="NADIR"&&!i.nadirOpen?{route:es("CORE",null),status:"sealed",vars:{k:i.shards|0},shudder:"N"}:t.room==="ZENITH"&&!Rx("S13")&&e!=="overpull"?{route:es("CORE",null),status:"route.missing",vars:{}}:t.room==="WORKSHOP"&&!Rx("S06")&&e!=="hall"?{route:es("MEMBERS",nn.operator.id||null)}:{route:t}}function Al(n){let e=nn.clan.name,t=n&&be[n.room]?n.room:"CORE";if(t==="CORE")return ue.owner?`${e} · ${xa(nn.operator.name)}`:e;let i=be[t],r=t==="NADIR"&&se.data&&se.data.nadirOpen&&i.nameOpen?i.nameOpen:i.name;return`${e} · ${r}`}var un=Object.freeze({INPUT:0,CLOCK:10,DIRECTOR:20,WORLD:30,FX:40,LAMP:50,CAMERA:60,OVERLAY:70,RENDER:80,UI:90}),eE=.05,Ix=250,Bs=[],tE=1,Zo=0,Hh=-1;function nE(n){let e=Bs.slice(),t=e.length;for(;t>0&&e[t-1].order>n.order;)t--;e.splice(t,0,n),Bs=e}function Dx(n){if(Zo=0,!Ie.running)return;Zo=requestAnimationFrame(Dx);let e=Hh<0?16.7:n-Hh;Hh=n,e>0||(e=0),e>Ix&&(e=Ix),Ie.now+=e,Ie.frame++;let t=Math.min(eE,e/1e3),i=Ie.now,r=Bs;for(let s=0;s<r.length;s++){let o=r[s];if(!o.dead)try{o.fn(t,i)}catch(a){Rt(`loop:${o.id}`,"frame callback threw and was removed",a),Ie.remove(o.id)}}}var Ie={running:!1,frame:0,now:0,add(n,e=un.UI){let t=tE++;return nE({id:t,fn:n,order:e,dead:!1}),t},remove(n){let e=Bs.findIndex(i=>i.id===n);if(e<0)return;Bs[e].dead=!0;let t=Bs.slice();t.splice(e,1),Bs=t},start(){Ie.running||(Ie.running=!0,Hh=-1,typeof requestAnimationFrame=="function"&&(Zo=requestAnimationFrame(Dx)))},stop(){Ie.running=!1,Zo&&typeof cancelAnimationFrame=="function"&&cancelAnimationFrame(Zo),Zo=0}},Px=!1,Lx=!1;function iE(){let n=document.visibilityState==="hidden"||document.hidden===!0;if(n!==Lx)if(Lx=n,n){Px=Ie.running,Ie.stop();try{document.title=ue.night?"…сплю":"…ты где?"}catch{}try{jo()}catch(e){Rt("loop:flush",e)}Oe.emit("visibility",{hidden:!0})}else{try{document.title=Al(ue.route)}catch{document.title="SAM.VIN"}Px&&Ie.start();try{Ti.say("tab.back")}catch(e){Rt("loop:status",e)}Oe.emit("visibility",{hidden:!1})}}typeof document<"u"&&document.addEventListener("visibilitychange",iE);var rE=1/120,ks=class n{constructor(e,t=1,i=0){this.omega=e,this.zeta=t,this.x=i,this.v=0,this.target=i}step(e){if(!(e>0))return this.x;let t=Math.min(16,Math.ceil(e/rE)),i=e/t,r=this.omega,s=r*r,o=2*this.zeta*r;for(let a=0;a<t;a++)this.v+=(s*(this.target-this.x)-o*this.v)*i,this.x+=this.v*i;return this.x}snap(e){this.x=e,this.target=e,this.v=0}settled(e=.001){return Math.abs(this.target-this.x)<e&&Math.abs(this.v)<e*10}static from(e,t=0){return new n(e.omega,e.zeta==null?1:e.zeta,t)}};var sE=typeof window<"u"&&typeof window.DeviceOrientationEvent<"u",zs=[],Wh=!1,Tl={alpha:0,beta:0,gamma:0,t:0};function Nx(n){Tl.alpha=n.alpha||0,Tl.beta=n.beta||0,Tl.gamma=n.gamma||0,Tl.t=typeof performance<"u"?performance.now():Date.now();for(let e=0;e<zs.length;e++)try{zs[e](Tl)}catch{}}var oE={available:sE&&typeof window.DeviceOrientationEvent.requestPermission!="function",on(n){!oE.available||zs.includes(n)||(zs.push(n),Wh||(window.addEventListener("deviceorientation",Nx),Wh=!0))},off(n){let e=zs.indexOf(n);e>=0&&zs.splice(e,1),Wh&&zs.length===0&&(window.removeEventListener("deviceorientation",Nx),Wh=!1)}};var Xh=null;function Ko(){return Xh||(Xh=new Promise(n=>{let e=!1,t=()=>{e||(e=!0,n())};setTimeout(t,2500);try{let i=typeof document<"u"?document.fonts:null;if(!i||typeof i.load!="function"){t();return}Promise.allSettled([i.load("700 64px Geologica","SAMVINСЭМ"),i.load("500 32px Martian","SAMVIN 0123")]).then(t,t)}catch{t()}}),Xh)}var aE=Object.freeze({set(){},stop(){},alive:!1}),Jt={ctx:null,unlocked:!1,on:!0,bed:null,init(n){Jt.on=!(se.data&&se.data.sound==="off"),ue.soundOn=Jt.on},unlock(){Jt.unlocked||(Jt.unlocked=!0,Oe.emit("audio:unlocked",{}))},resume(){},isOn(){return Jt.on},setOn(n){let e=!!n;e!==Jt.on&&(Jt.on=e,ue.soundOn=e,se.data&&(se.data.sound=e?"on":"off",vs()),Oe.emit("sound:change",{on:e}))},toggle(){Jt.setOn(!Jt.on)},play(n,e){return null},start(n,e){return aE},setRoom(){},setRootU(){},setNight(){},setRank(){},setInverted(){},levels(n){n&&n.fill(0)},now(){return 0}};var ts=Object.freeze({tap:8,tick:6,stratum:7,lock:14,step:20,activation:[8,40,8,40,14,90,30],shard:[8,40,8,40,60],locked:[10,30,10]}),lE=6,Sp=0;function Fx(n,e){let t=document.getElementById("fx");if(!t||Sp>=lE)return;let i=document.createElement("div");i.className="ripple",i.style.transform=`translate3d(${n}px, ${e}px, 0)`,tn.reducedMotion&&i.classList.add("ripple--still"),Sp++;let r=()=>{Sp--,i.remove()};i.addEventListener("animationend",r,{once:!0}),setTimeout(()=>{i.isConnected&&r()},600),t.appendChild(i)}function ns(n){try{if(typeof navigator>"u"||typeof navigator.vibrate!="function")return;let e=navigator.userActivation;if(e&&!e.hasBeenActive)return;navigator.vibrate(n)}catch{}}var Fi=Object.freeze({TAP_MS:350,HOLD_MS:350,LONG_MS:800,SLOP_PX:8,SWIPE_PX:40,SWIPE_V:.3}),cE=60,is=[],Vs=null,Jo=[],Rl=[],Qo=null,oe={type:"down",x:0,y:0,dx:0,dy:0,tx:0,ty:0,vx:0,vy:0,speed:0,t:0,id:0,pointerType:"mouse",button:0,scale:1,dScale:1,deltaY:0,dir:null,afterHold:!1,shift:!1,alt:!1},Cr={x:0,y:0,vx:0,vy:0,speed:0,type:"mouse",buttons:0,t:0},Me={active:!1,id:-1,type:"mouse",x0:0,y0:0,t0:0,lastX:0,lastY:0,lastT:0,dragging:!1,holdFired:!1,longFired:!1,pinch:!1,moved:0,button:0},Cl=0,Il=0,Mi=new Map,kx=0,bp=0,ea=()=>typeof performance<"u"?performance.now():Date.now();function hn(n,e){if(oe.type=n,e&&(oe.shift=!!e.shiftKey,oe.alt=!!e.altKey),n!=="swipe"&&(oe.dir=null),Vs){try{Vs.onGesture(oe)}catch(t){Rt(`input:${Vs.name}`,"captured consumer threw",t)}return}for(let t=is.length-1;t>=0;t--){let i=is[t],r=!1;try{r=!!i.onGesture(oe)}catch(s){Rt(`input:${i.name}`,"consumer threw",s)}if(r)return}}function Ir(n,e,t){oe.x=e,oe.y=t,oe.id=n.pointerId,oe.pointerType=n.pointerType||"mouse",oe.button=n.button|0,oe.scale=1,oe.dScale=1,oe.deltaY=0}function jh(){Cl&&(clearTimeout(Cl),Cl=0),Il&&(clearTimeout(Il),Il=0)}function uE(n){let e=Yt.pointer,t=ea(),i=Math.max(1,t-(e._t||t-16)),r=(n.clientX-e.x)/i,s=(n.clientY-e.y)/i,o=1-Math.exp(-i/cE);e.x>-9e3&&(e.vx+=(r-e.vx)*o,e.vy+=(s-e.vy)*o),e._t=t,e.x=n.clientX,e.y=n.clientY,e.speed=Math.hypot(e.vx,e.vy)*1e3,e.type=n.pointerType||"mouse",e.lastMove=Ie.now,e.inside=!0}function hE(n){if(!Jo.length)return;let e=Yt.pointer;Cr.x=e.x,Cr.y=e.y,Cr.vx=e.vx,Cr.vy=e.vy,Cr.speed=e.speed,Cr.type=e.type,Cr.buttons=n.buttons|0,Cr.t=Ie.now;for(let t=0;t<Jo.length;t++)try{Jo[t](Cr)}catch(i){Rt("input:observer","observer threw",i)}}function fE(n){if(n.pointerType==="touch"){if(Mi.set(n.pointerId,{x:n.clientX,y:n.clientY}),Fx(n.clientX,n.clientY),ns(ts.tap),Mi.size===2&&Me.active){dE(n);return}if(Mi.size>2)return}if(Me.active)return;try{n.currentTarget.setPointerCapture(n.pointerId)}catch{}let e=ea(),t=Yt.pointer;t.x=n.clientX,t.y=n.clientY,t.vx=0,t.vy=0,t.speed=0,t._t=e,t.type=n.pointerType||"mouse",t.lastMove=Ie.now,t.inside=!0,Me.active=!0,Me.id=n.pointerId,Me.type=n.pointerType||"mouse",Me.x0=Me.lastX=n.clientX,Me.y0=Me.lastY=n.clientY,Me.t0=Me.lastT=e,Me.dragging=!1,Me.holdFired=!1,Me.longFired=!1,Me.pinch=!1,Me.moved=0,Me.button=n.button|0,Yt.pointer.down=!0,Ir(n,n.clientX,n.clientY),oe.dx=0,oe.dy=0,oe.tx=0,oe.ty=0,oe.vx=0,oe.vy=0,oe.speed=0,oe.t=0,oe.afterHold=!1,hn("down",n),jh(),Cl=setTimeout(()=>{Cl=0,!(!Me.active||Me.dragging||Me.pinch)&&(Me.holdFired=!0,Ox(),hn("hold",null),Il=setTimeout(()=>{Il=0,!(!Me.active||Me.dragging||Me.pinch)&&(Me.longFired=!0,Ox(),hn("longpress",null))},Fi.LONG_MS-Fi.HOLD_MS))},Fi.HOLD_MS)}function Ox(){oe.x=Me.lastX,oe.y=Me.lastY,oe.dx=0,oe.dy=0,oe.tx=Me.lastX-Me.x0,oe.ty=Me.lastY-Me.y0,oe.vx=0,oe.vy=0,oe.speed=0,oe.t=ea()-Me.t0,oe.id=Me.id,oe.pointerType=Me.type,oe.button=Me.button,oe.scale=1,oe.dScale=1,oe.deltaY=0,oe.afterHold=!0}function dE(n){jh(),Me.dragging&&(oe.t=ea()-Me.t0,hn("dragend",n)),Me.pinch=!0,Me.dragging=!1,zx(),kx=bp=Math.max(1,Math.hypot(Qt.ax-Qt.bx,Qt.ay-Qt.by)),Ir(n,(Qt.ax+Qt.bx)/2,(Qt.ay+Qt.by)/2),oe.scale=1,oe.dScale=1,hn("pinchstart",n)}var Qt={ax:0,ay:0,bx:0,by:0,i:0};function pE(n){Qt.i===0?(Qt.ax=n.x,Qt.ay=n.y):Qt.i===1&&(Qt.bx=n.x,Qt.by=n.y),Qt.i++}function zx(){Qt.i=0,Mi.forEach(pE)}var wp=null,qh=null,Yh=!1;function mE(n){return!!n&&(n===wp||qh!==null&&qh.contains(n))}function gE(n){if(uE(n),hE(n),n.pointerType==="touch"&&Mi.has(n.pointerId)){let t=Mi.get(n.pointerId);t.x=n.clientX,t.y=n.clientY}if(Me.pinch){if(Mi.size<2)return;zx();let t=Math.max(1,Math.hypot(Qt.ax-Qt.bx,Qt.ay-Qt.by));Ir(n,(Qt.ax+Qt.bx)/2,(Qt.ay+Qt.by)/2),oe.scale=t/kx,oe.dScale=t/bp,bp=t,hn("pinch",n);return}if(!Me.active||n.pointerId!==Me.id){if(!Me.active&&(n.pointerType||"mouse")==="mouse"&&(n.buttons|0)===0){if(!mE(n.target)){Yh&&(Yh=!1,Ir(n,n.clientX,n.clientY),hn("leave",n));return}Yh=!0,Ir(n,n.clientX,n.clientY),oe.dx=n.movementX||0,oe.dy=n.movementY||0,oe.tx=0,oe.ty=0,oe.vx=Yt.pointer.vx,oe.vy=Yt.pointer.vy,oe.speed=Yt.pointer.speed,oe.t=0,oe.afterHold=!1,hn("hover",n)}return}let e=ea();Ir(n,n.clientX,n.clientY),oe.dx=n.clientX-Me.lastX,oe.dy=n.clientY-Me.lastY,oe.tx=n.clientX-Me.x0,oe.ty=n.clientY-Me.y0,oe.vx=Yt.pointer.vx,oe.vy=Yt.pointer.vy,oe.speed=Yt.pointer.speed,oe.t=e-Me.t0,oe.afterHold=Me.holdFired,Me.lastX=n.clientX,Me.lastY=n.clientY,Me.lastT=e,Me.moved=Math.max(Me.moved,Math.hypot(oe.tx,oe.ty)),Me.dragging?hn("drag",n):Me.moved>=Fi.SLOP_PX?(Me.dragging=!0,jh(),hn("dragstart",n),hn("drag",n)):hn("move",n)}function Ep(n,e){let t=ea();jh(),Yt.pointer.down=!1;try{n.currentTarget&&n.currentTarget.hasPointerCapture&&n.currentTarget.hasPointerCapture(n.pointerId)&&n.currentTarget.releasePointerCapture(n.pointerId)}catch{}Ir(n,n.clientX,n.clientY),oe.dx=n.clientX-Me.lastX,oe.dy=n.clientY-Me.lastY,oe.tx=n.clientX-Me.x0,oe.ty=n.clientY-Me.y0,oe.vx=Yt.pointer.vx,oe.vy=Yt.pointer.vy,oe.speed=Yt.pointer.speed,oe.t=t-Me.t0,oe.afterHold=Me.holdFired;let i=Me.dragging,r=Me.pinch;if(Me.active=!1,Me.dragging=!1,Me.pinch=!1,e){hn("cancel",n),$h();return}if(r){hn("pinchend",n),$h();return}if(hn("up",n),i){hn("dragend",n);let s=Math.hypot(oe.tx,oe.ty),o=Math.hypot(oe.vx,oe.vy);s>=Fi.SWIPE_PX&&o>=Fi.SWIPE_V&&(oe.dir=Math.abs(oe.tx)>=Math.abs(oe.ty)?oe.tx>0?"right":"left":oe.ty>0?"down":"up",hn("swipe",n))}else!Me.holdFired&&oe.t<Fi.TAP_MS&&Me.moved<Fi.SLOP_PX&&hn("tap",n);$h()}function $h(){Vs=null}function xE(n){if(n.pointerType==="touch"){Mi.delete(n.pointerId);try{Jt.resume()}catch{}if(Me.pinch){Mi.size<2&&Me.active&&(Mi.size===0||n.pointerId===Me.id?Ep(n,!1):(Ir(n,n.clientX,n.clientY),hn("pinchend",n),Me.pinch=!1,Me.active=!1,Yt.pointer.down=!1,$h()));return}}!Me.active||n.pointerId!==Me.id||Ep(n,!1)}function vE(n){n.pointerType==="touch"&&Mi.delete(n.pointerId),Me.active&&(n.pointerId!==Me.id&&!Me.pinch||(Mi.clear(),Ep(n,!0)))}function yE(n){n.preventDefault();let e=n.deltaY;n.deltaMode===1?e*=16:n.deltaMode===2&&(e*=Ge.h||800),oe.x=n.clientX,oe.y=n.clientY,oe.dx=0,oe.dy=0,oe.tx=0,oe.ty=0,oe.vx=0,oe.vy=0,oe.speed=0,oe.t=0,oe.id=0,oe.pointerType="mouse",oe.button=0,oe.scale=1,oe.dScale=1,oe.deltaY=e,oe.afterHold=!1,hn("wheel",n)}function _E(n){n.relatedTarget||(Yt.pointer.inside=!1,Yh=!1,Ir(n,n.clientX,n.clientY),hn("leave",n))}function Ux(n){!n||n.__samvinInput||(n.__samvinInput=!0,n.addEventListener("pointerdown",fE),n.addEventListener("pointerup",xE),n.addEventListener("pointercancel",vE),n.addEventListener("wheel",yE,{passive:!1}),n.addEventListener("contextmenu",e=>e.preventDefault()))}var Bx={name:"hall",onGesture(n){let e=Qo&&Qo.halls;if(!e||typeof e.current!="function")return!1;let t=e.current();return t?!!e.call(t.id,"onGesture",n):!1}},ME={name:"director",onGesture(n){let e=Qo&&Qo.director;if(!e||typeof e.busy!="function"||!e.busy())return!1;let t=e.state,i=Qo.halls;return t&&t.u>=.7&&t.to&&i&&typeof i.call=="function"&&i.call(t.to.room,"onGesture",n)||n.type==="tap"&&typeof e.speedUp=="function"&&e.speedUp(),!0}},Yt={pointer:{x:-9999,y:-9999,vx:0,vy:0,speed:0,type:"mouse",down:!1,lastMove:0,inside:!1},init(n){Qo=n,wp=document.getElementById("gl"),qh=document.getElementById("t0"),Ux(wp),Ux(qh),window.addEventListener("pointermove",gE,{passive:!0}),document.addEventListener("pointerout",_E);let e=()=>{try{Jt.unlock()}catch(t){Rt("input:unlock",t)}};window.addEventListener("pointerdown",e,{capture:!0,passive:!0}),window.addEventListener("touchend",()=>{try{Jt.resume()}catch{}},{passive:!0}),window.addEventListener("keydown",t=>{e();let i=t.target;if(!(i&&(i.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(i.tagName||""))))for(let r=0;r<Rl.length;r++)try{Rl[r](t)}catch(s){Rt("input:keyobserver","key observer threw",s)}},{capture:!0}),is.includes(Bx)||(is.unshift(ME),is.unshift(Bx))},push(n){return is.push(n),()=>{let e=is.indexOf(n);e>=0&&is.splice(e,1)}},capture(n){Vs=n},release(n){(!n||Vs===n)&&(Vs=null)},observe(n){return Jo.push(n),()=>{let e=Jo.indexOf(n);e>=0&&Jo.splice(e,1)}},observeKeys(n){return Rl.push(n),()=>{let e=Rl.indexOf(n);e>=0&&Rl.splice(e,1)}}};function Vx(n,e,t){ft.enabled=!1;let i=Bn[t]||Bn.T2,r=new _h({canvas:n,context:e||void 0,antialias:!!i.msaa,alpha:!0,premultipliedAlpha:!0,depth:!0,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1});r.outputColorSpace=Es,r.toneMapping=ai,r.setClearColor(0,0),r.info.autoReset=!1,r.autoClear=!0;let s=new xr;s.background=null,s.matrixWorldAutoUpdate=!0;let o=new Ln($e.fov,Math.max(1,Ge.w)/Math.max(1,Ge.h),.01,1e3);o.position.set(0,.75,7.2);let a=i.dprCap,l=0,c={three:r,scene:s,camera:o,tier:t,dpr:1,stats:{calls:0,triangles:0,points:0,geometries:0,textures:0,frameMs:0,fps:0},setDprDrop(d){l=Math.max(0,d|0),c.resize()},setTier(d){c.tier=d,a=(Bn[d]||i).dprCap,c.resize()},resize(){let d=typeof devicePixelRatio=="number"&&devicePixelRatio>0?devicePixelRatio:1;c.dpr=Math.max(1,Math.min(d,a)-Vt.dprStep*l);let h=Math.max(1,Ge.w),f=Math.max(1,Ge.h);r.setPixelRatio(c.dpr),r.setSize(h,f,!1),o.aspect=h/f,o.updateProjectionMatrix(),he.uPixelRatio.value=c.dpr,he.uResolution.value.set(Math.round(h*c.dpr),Math.round(f*c.dpr));for(let g of u)g(c)},onResize(d){return u.add(d),()=>u.delete(d)},lost:!1},u=new Set;return n.addEventListener("webglcontextlost",d=>{d.preventDefault(),c.lost=!0,Ie.stop(),Oe.emit("gl:lost",{})},!1),n.addEventListener("webglcontextrestored",()=>{c.lost=!1,c.resize(),Oe.emit("gl:restored",{}),Ie.start()},!1),Oe.on("layout:change",()=>c.resize()),c.resize(),c}var SE=`
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,Gx=`
uniform sampler2D tSrc; uniform vec2 uHalf; uniform float uThreshold;
varying vec2 vUv;
vec3 tap(vec2 uv) {
  vec3 c = texture2D(tSrc, uv).rgb;
#ifdef USE_THRESHOLD
  float m = max(c.r, max(c.g, c.b));
  c *= smoothstep(uThreshold - 0.25, uThreshold + 0.05, m);
#endif
  return c;
}
void main() {
  vec3 s = tap(vUv) * 4.0;
  s += tap(vUv - uHalf); s += tap(vUv + uHalf);
  s += tap(vUv + vec2(uHalf.x, -uHalf.y)); s += tap(vUv - vec2(uHalf.x, -uHalf.y));
  gl_FragColor = vec4(s / 8.0, 1.0);
}`,Hx=`
uniform sampler2D tSrc; uniform vec2 uHalf;
#ifdef USE_ADD
uniform sampler2D tAdd; uniform float uAddGain;
#endif
varying vec2 vUv;
void main() {
  vec2 h = uHalf;
  vec3 s = texture2D(tSrc, vUv + vec2(-h.x * 2.0, 0.0)).rgb;
  s += texture2D(tSrc, vUv + vec2(-h.x, h.y)).rgb * 2.0;
  s += texture2D(tSrc, vUv + vec2(0.0, h.y * 2.0)).rgb;
  s += texture2D(tSrc, vUv + vec2(h.x, h.y)).rgb * 2.0;
  s += texture2D(tSrc, vUv + vec2(h.x * 2.0, 0.0)).rgb;
  s += texture2D(tSrc, vUv + vec2(h.x, -h.y)).rgb * 2.0;
  s += texture2D(tSrc, vUv + vec2(0.0, -h.y * 2.0)).rgb;
  s += texture2D(tSrc, vUv + vec2(-h.x, -h.y)).rgb * 2.0;
  s /= 12.0;
#ifdef USE_ADD
  s += texture2D(tAdd, vUv).rgb * uAddGain;     // progressive: every scale keeps its energy (a small nucleus still glows)
#endif
  gl_FragColor = vec4(s, 1.0);
}`;function Ap(){let n=new an;return n.setAttribute("position",new Xt(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),n}function Wx(n,e=Vt.r6.levels){let t=n.three||n,i=Ap(),r=new xr,s=new Sr(-1,1,1,-1,0,1),o=(A,T,R)=>new bt({uniforms:{tSrc:{value:null},uHalf:{value:new nt},uThreshold:{value:Vt.r6.threshold},tAdd:{value:null},uAddGain:{value:1}},defines:Object.assign(T?{USE_THRESHOLD:""}:{},R?{USE_ADD:""}:{}),vertexShader:SE,fragmentShader:A,depthTest:!1,depthWrite:!1,blending:jn}),a=o(Gx,!0),l=o(Gx,!1),c=o(Hx,!1,!0),u=o(Hx,!1,!1),d=new Lt(i,l);d.frustumCulled=!1,r.add(d);let h={type:Nn,format:An,minFilter:yt,magFilter:yt,depthBuffer:!1},f=[],g=[],_=0,m=0,p=A=>A.width*A.height*8;function S(A,T){b(),_=A,m=T;let R=A,x=T;for(let w=0;w<e;w++){R=Math.max(1,R>>1),x=Math.max(1,x>>1);let C=new gn(R,x,h);yi(C.texture,p(C)),f.push(C)}for(let w=0;w<e;w++){let C=w===0?{width:A,height:T}:f[w-1],D=new gn(C.width,C.height,h);yi(D.texture,p(D)),g.push(D)}}function b(){for(let A of f.concat(g))fl(A.texture),A.dispose();f.length=0,g.length=0}function y(A,T,R,x,w){d.material=A,A.uniforms.tSrc.value=T,A.uniforms.uHalf.value.set(.5/R,.5/x),t.setRenderTarget(w),t.render(r,s)}return{render(A){if(!f.length)return null;let T=A,R=_,x=m;for(let w=0;w<e;w++)y(w===0?a:l,T,R,x,f[w]),T=f[w].texture,R=f[w].width,x=f[w].height;for(let w=e-1;w>=0;w--){let C=w>0?c:u;w>0&&(C.uniforms.tAdd.value=f[w-1].texture),y(C,T,R,x,g[w]),T=g[w].texture,R=g[w].width,x=g[w].height}return g[0].texture},resize(A,T){(A!==_||T!==m)&&S(Math.max(2,A|0),Math.max(2,T|0))},dispose(){b(),i.dispose(),a.dispose(),l.dispose(),c.dispose(),u.dispose()}}}var ta=Vt.r7,Xx="void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",Yx=`
uniform vec2 uRes; uniform float uPR, uGrain, uSeed, uVig; uniform vec2 uPointer;
#ifdef USE_SCENE
uniform sampler2D tScene; uniform sampler2D tBloom; uniform float uBloom;
#endif
float hash(vec2 p) { vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
void main() {
  vec2 fc = gl_FragCoord.xy;
  vec2 uv = fc / uRes;
  float g = (hash(fc + vec2(uSeed * 61.0, uSeed * 37.0)) - 0.5) * 2.0 * uGrain;
  vec2 css = vec2(fc.x, uRes.y - fc.y) / uPR;
  g *= smoothstep(${ta.clearInPx.toFixed(1)}, ${ta.clearOutPx.toFixed(1)}, distance(css, uPointer));
  float aspect = uRes.x / uRes.y;
  vec2 c = (uv * 2.0 - 1.0) * vec2(aspect, 1.0);
  float v = uVig * smoothstep(${ta.vignetteFrom.toFixed(2)}, 1.0, length(c) / length(vec2(aspect, 1.0)));
  float a = 1.0 - (1.0 - v) * (1.0 - abs(g));
  float w = max(g, 0.0);
#ifdef USE_SCENE
  vec4 s = texture2D(tScene, uv);
  vec3 b = texture2D(tBloom, uv).rgb * uBloom;
  vec3 col = s.rgb + b;
  float A = min(1.0, s.a + max(b.r, max(b.g, b.b)));
  gl_FragColor = vec4(min(col, vec3(A)) * (1.0 - a) + vec3(w), A * (1.0 - a) + a);
#else
  gl_FragColor = vec4(vec3(w), a);
#endif
}`,Zh=120;function $x(n){let e=n.three,t=n.scene,i=n.camera,r=new xr,s=new Sr(-1,1,1,-1,0,1),o={uRes:{value:new nt(1,1)},uPR:{value:1},uGrain:{value:ta.grainBoot},uSeed:{value:0},uVig:{value:ta.vignette},uPointer:{value:new nt(-9999,-9999)},tScene:{value:null},tBloom:{value:null},uBloom:{value:1}},a=new bt({uniforms:o,vertexShader:Xx,fragmentShader:Yx,depthTest:!1,depthWrite:!1,transparent:!0,blending:Tu,blendEquation:br,blendSrc:el,blendDst:Lo,blendSrcAlpha:el,blendDstAlpha:Lo}),l=new bt({uniforms:o,defines:{USE_SCENE:""},vertexShader:Xx,fragmentShader:Yx,depthTest:!1,depthWrite:!1,blending:jn}),c=new Lt(Ap(),a);c.frustumCulled=!1,r.add(c);let u=n.tier,d=null,h=null,f=null,g=[],_=!0;function m(){d&&(fl(d.texture),d.dispose(),d=null),h&&(fl(h.texture),h.dispose(),h=null),f&&(f.dispose(),f=null)}function p(){if(u!=="T3"){m();return}let D=o.uRes.value.x,O=o.uRes.value.y;d?(d.setSize(D,O),h.setSize(Math.max(2,D>>1),Math.max(2,O>>1))):(d=new gn(D,O,{type:Nn,format:An,samples:4,depthBuffer:!0,minFilter:yt,magFilter:yt}),h=new gn(Math.max(2,D>>1),Math.max(2,O>>1),{type:Nn,format:An,depthBuffer:!0,minFilter:yt,magFilter:yt}),f=Wx(n,Vt.r6.levels)),yi(d.texture,D*O*8*5),yi(h.texture,h.width*h.height*8),f.resize(h.width,h.height)}function S(){let D=e.getDrawingBufferSize(new nt);o.uRes.value.copy(D),o.uPR.value=n.dpr,p()}n.onResize(S),S();let b=new Float32Array(Zh),y=new Float32Array(Zh),A=0,T=0,R=-1,x=1<<On.DEFAULT|1<<On.NOFOG,w=1<<On.EMISSIVE,C={render(D){if(n.lost)return;o.uSeed.value=tn.reducedMotion?7:Math.floor(Ie.now/(1e3/ta.grainFps))%997;let O=Yt.pointer,z=O.x<-9e3||O.inside===!1||O.type==="touch"&&!O.down;o.uPointer.value.set(z?-9999:O.x,z?-9999:O.y),e.info.reset(),e.autoClear=!1,u==="T3"&&d?(i.layers.mask=x,e.setRenderTarget(d),e.setClearColor(0,0),e.clear(!0,!0,!1),e.render(t,i),n.stats.points=e.info.render.points,i.layers.mask=w,e.setRenderTarget(h),e.clear(!0,!0,!1),he.uEmissivePass.value=1,e.render(t,i),he.uEmissivePass.value=0,i.layers.mask=x,o.tBloom.value=f.render(h.texture),o.tScene.value=d.texture,c.material=l,e.setRenderTarget(null),e.render(r,s)):(i.layers.mask=x,e.setRenderTarget(null),e.setClearColor(0,0),e.clear(!0,!0,!1),e.render(t,i),n.stats.points=e.info.render.points,c.material=a,e.render(r,s));let N=n.stats,V=e.info;N.calls=V.render.calls,N.triangles=V.render.triangles,N.geometries=V.memory.geometries,N.textures=V.memory.textures;let Z=Ie.now;if(R>=0&&(b[T]=Z-R,T=(T+1)%Zh,A<Zh&&A++,(Ie.frame&15)===0&&A>0)){for(let K=0;K<A;K++)y[K]=b[K];let X=y.subarray(0,A);X.sort(),N.frameMs=X[A>>1],N.fps=N.frameMs>0?1e3/N.frameMs:0}if(R=Z,_){_=!1;let X=document.getElementById("ff-grain");X&&X.parentNode&&X.parentNode.removeChild(X);for(let K of g)try{K()}catch{}g.length=0}},setGrain(D){o.uGrain.value=Math.max(0,+D||0)},setTier(D){u=D,p()},onFirstFrame(D){if(_)g.push(D);else try{D()}catch{}},get tier(){return u},uniforms:o};return Oe.on("tier:change",({tier:D})=>C.setTier(D)),C}var tr=[0,0,0],na=null;function Tp(n){for(let e=0;e<da.length;e++){let t=da[e];oc(t,n,tr),he[bh(t)].value.setRGB(tr[0],tr[1],tr[2])}}function qx(n){let e="#";for(let t=0;t<3;t++)e+=Math.round(n[t]*255).toString(16).padStart(2,"0").toUpperCase();return e}function bE(n){if(typeof document>"u")return;let e=document.documentElement.style;for(let t=0;t<da.length;t++){let i=da[t];if(n<=0){e.removeProperty(pa[i]),e.removeProperty(pa[i]+"-rgb");continue}oc(i,n,tr),e.setProperty(pa[i],qx(tr)),e.setProperty(pa[i]+"-rgb",`${Math.round(tr[0]*255)},${Math.round(tr[1]*255)},${Math.round(tr[2]*255)}`)}}var rs={mode:{night:!1,inverted:0},init(){Tp(rs.mode.inverted)},setNight(n){let e=!!n;if(typeof document<"u"&&(e?document.documentElement.setAttribute("data-night",""):document.documentElement.removeAttribute("data-night")),e===rs.mode.night&&!na){he.uNight.value=e?1:0;return}rs.mode.night=e,na&&na.cancel();let t=he.uNight.value,i=e?1:0;na=ci(ar.mixMs,r=>{he.uNight.value=t+(i-t)*r}),na.done.then(()=>{na=null})},setInverted(n){let e=Math.max(0,Math.min(1,+n||0));rs.mode.inverted=e,he.uInvert.value=e,Tp(e),bE(e),typeof document<"u"&&(e>=.5?document.documentElement.setAttribute("data-inverted",""):document.documentElement.removeAttribute("data-inverted"))},color(n){return(he[bh(n)]||he.cSilver).value},hex(n){return Qs[n]?qx(oc(n,rs.mode.inverted,tr)):Qs.silver}};Tp(0);var wE=Math.PI/180,EE=.08,Kh=new I,Jh=new I,Oi=new I,Rp=new I,jx=new I,Cp=new nt,Qh=!1,Zx=new Map,Ip=[],nr={until:0,ms:0,amp:0,off:new I},Ee={camera:null,pose:{pos:new I(0,.75,7.2),target:new I(0,0,0),fov:$e.fov,offsetY:0,roll:0},velocity:new I,init(n){return Ee.camera=n,Qh=!1,Ee},setPose(n){n&&(n.pos&&Ee.pose.pos.copy(n.pos),n.target&&Ee.pose.target.copy(n.target),Ee.pose.fov=n.fov!=null?n.fov:$e.fov,Ee.pose.offsetY=n.offsetY||0,Ee.pose.roll=n.roll||0)},setOffset(n,e,t=0){let i=Zx.get(n);if(!e&&!t){i&&(i.on=!1);return}i||(i={pos:new I,fov:0,on:!0},Zx.set(n,i),Ip.push(i)),e?i.pos.copy(e):i.pos.set(0,0,0),i.fov=t,i.on=!0},tremble(n=1,e=120){tn.reducedMotion||(nr.amp=n,nr.ms=e,nr.until=Ie.now+e)},apply(n=1/60){let e=Ee.camera;if(!e)return;let t=Ee.pose;Kh.set(0,0,0);let i=t.fov;for(let l=0;l<Ip.length;l++){let c=Ip[l];c.on&&(Kh.add(c.pos),i+=c.fov)}let r=Math.max(1e-6,Jh.copy(t.target).sub(t.pos).length());if(nr.until>Ie.now&&nr.ms>0){let l=(nr.until-Ie.now)/nr.ms,c=nr.amp*l*r/Math.max(1e-6,he.uPxPerUnit.value);nr.off.set((Math.random()*2-1)*c,(Math.random()*2-1)*c,0).applyQuaternion(e.quaternion),Kh.add(nr.off)}e.position.copy(t.pos).add(Kh),Jh.copy(t.target).sub(e.position);let s=Jh.length();s>1e-9&&Math.abs(Jh.y/s)>.999?e.up.set(0,0,-1):e.up.set(0,1,0),e.lookAt(t.target),t.roll&&e.rotateZ(t.roll),e.fov=i;let o=Math.max(1,Ge.w),a=Math.max(1,Ge.h);e.aspect=o/a,t.offsetY?e.setViewOffset(o,a,0,-t.offsetY*a,o,a):e.view&&e.view.enabled&&e.clearViewOffset(),He.focus.copy(t.target),He.fitClip(e),e.updateProjectionMatrix(),e.updateMatrixWorld(),he.uCamPos.value.copy(e.position),he.uPxPerUnit.value=a/(2*Math.tan(i*wE/2)),Qh&&n>0&&(jx.copy(e.position).sub(Rp).multiplyScalar(1/n),Ee.velocity.lerp(jx,1-Math.exp(-n/EE))),Rp.copy(e.position),Qh=!0},project(n,e){let t=Ee.camera;return t?(Oi.copy(n).applyMatrix4(t.matrixWorldInverse),e.depth=-Oi.z,Oi.applyMatrix4(t.projectionMatrix),e.x=(Oi.x+1)*.5*Ge.w,e.y=(1-Oi.y)*.5*Ge.h,e.visible=e.depth>0&&Oi.x>=-1&&Oi.x<=1&&Oi.y>=-1&&Oi.y<=1,e):(e.x=-9999,e.y=-9999,e.depth=0,e.visible=!1,e)},unproject(n,e,t,i){let r=Ee.camera;if(!r)return i.set(0,0,0);Ee.ray(n,e,ef),Oi.set(0,0,-1).transformDirection(r.matrixWorld);let s=Math.max(1e-6,ef.direction.dot(Oi));return i.copy(ef.origin).addScaledVector(ef.direction,t/s)},ray(n,e,t){let i=Ee.camera;return Cp.set(n/Math.max(1,Ge.w)*2-1,-(e/Math.max(1,Ge.h))*2+1),t.origin.setFromMatrixPosition(i.matrixWorld),t.direction.set(Cp.x,Cp.y,.5).unproject(i).sub(t.origin).normalize(),t},remapHistory(n){Qh&&n(Rp)}},ef=new yr;var tf=[-1,0,1,2],ss=new Map,Gs=new Map,AE=new Map,Pp=[],Lp=new Map,Tn=new Map([[-1,0],[0,1],[1,1],[2,0]]),ir={grow:[],shrink:[]},TE=new I,Pl=null,Kx=-1;function nf(n){let e=Tn.get(n),t=Gs.get(n);t&&t.setFade(n===-1&&Ll?1:e);let i=ss.get(n);i&&n!==0&&(i.visible=e>0||n===-1&&Ll),n===0&&Pl&&Pl.key&&Pl.key.group&&(Pl.key.group.visible=e>0)}var Ll=!1,en={init(n){Pl=n;let e=He.root;for(let r of tf){let s=new Bt;s.name=`nest:${r}`,s.scale.setScalar(Math.pow(1e3,r)),e.add(s),ss.set(r,s)}let t=(it.params||Bn.T2).lattice;for(let r of[1,2]){let s=Ml({perStratum:!1,latticeDensity:r===1?t:.5,hallLod:r===1,far:be.CORE.far});ss.get(r).add(s.group),Gs.set(r,s);let o=zh({scale:Math.pow(1e3,r)});o.setCount(se.litNodes),ss.get(r).add(o.object),Lp.set(r,o)}let i=Ml({perStratum:!1,lattice:!1,far:1});ss.get(-1).add(i.group),Gs.set(-1,i);for(let r of[-1,1,2]){let s=Bh({color:"ember",radius:En.glowR,intensity:1,depthTest:!1,night:!0,fog:!1});ss.get(r).add(s.object),AE.set(r,s),Pp.push({j:r,e:s,g:ss.get(r),h:ms.H*Math.pow(1e3,r)})}for(let r of tf)nf(r);return Ie.add(en.update,un.WORLD),Oe.on("room:arrive",({room:r})=>{let s=(be[r]||be.CORE).far;for(let o of[1,2])Gs.get(o).setFar(s)}),Oe.on("tier:change",({tier:r})=>{let s=Bn[r];s&&Gs.get(1).setLatticeDensity(s.lattice)}),Oe.on("night:change",({night:r})=>{for(let s of Lp.values())s.setNight(r)}),en},level(n){return ss.get(n)||null},structure(n){return Gs.get(n)||null},litNodes(n){return Lp.get(n)||null},fade(n){return Tn.has(n)?Tn.get(n):0},setFade(n,e){if(!Tn.has(n))return;let t=Math.max(0,Math.min(1,e));t!==Tn.get(n)&&(Tn.set(n,t),nf(n))},setHallLod(n){let e=n?be[n]:null;Kx=e&&e.stratum>=0?e.stratum:-1;let t=Gs.get(1);t&&t.setHideCaps(Kx)},shift(n){let e=tf.map(t=>Tn.get(t));if(n==="grow"){ir.grow.push(e[3]);let t=ir.shrink.length?ir.shrink.pop():0;Tn.set(2,e[2]),Tn.set(1,e[1]),Tn.set(0,e[0]),Tn.set(-1,t)}else{ir.shrink.push(e[0]);let t=ir.grow.length?ir.grow.pop():0;Tn.set(-1,e[1]),Tn.set(0,e[2]),Tn.set(1,e[3]),Tn.set(2,t)}ir.grow.length>8&&ir.grow.shift(),ir.shrink.length>8&&ir.shrink.shift();for(let t of tf)nf(t)},update(){let n=Ee.camera;if(!n)return;let e=He.s,t=TE.copy(n.position).sub(He.Q).length()/e,i=t<Wm.miniKeyBelow;i!==Ll&&(Ll=i,nf(-1));for(let r=0;r<Pp.length;r++){let{j:s,e:o,g:a,h:l}=Pp[r],c=(s===-1?Ll||Tn.get(-1)>0:Tn.get(s)>0)&&t>l*Hm;o.object.visible=c&&a.visible!==!1}}};var RE=new I,Dp=null;function Dl(){let n=He.root;n&&(n.scale.setScalar(He.s),n.position.copy(He.Q),n.updateMatrix()),he.uWorldScale.value=He.s}function Jx(n){let e=Ee.camera;e&&n(e.position),Ee.pose&&(n(Ee.pose.pos),n(Ee.pose.target)),Ee.remapHistory(n),He.focus&&n(He.focus)}var He={root:null,s:1,Q:new I,n:0,focus:new I,init(n,e){return e&&(Dp=e),He.root||(He.root=new Bt,He.root.name="scaleRoot",He.root.matrixAutoUpdate=!1),n&&He.root.parent!==n&&n.add(He.root),Dl(),He},set(n,e){He.s=n,e&&He.Q.copy(e),Dl()},scaleAbout(n,e){let t=He.s;n!==t&&(He.Q.x+=e.x*(t-n),He.Q.y+=e.y*(t-n),He.Q.z+=e.z*(t-n),He.s=n,Dl())},fixedPoint(n){let e=1-He.s;return Math.abs(e)<1e-9?n.set(0,0,0):n.copy(He.Q).multiplyScalar(1/e)},logLerp(n,e,t){return Math.exp(Math.log(n)+(Math.log(e)-Math.log(n))*t)},toRender(n,e){return e.copy(n).multiplyScalar(He.s).add(He.Q)},toCanonical(n,e){return e.copy(n).sub(He.Q).multiplyScalar(1/He.s)},rebase(n){let t={kind:n,k:(n==="grow"?1e3:.001)/He.s,T:He.Q.clone(),s:He.s,Q:He.Q.clone()};Jx(r=>He.mapPoint(r,t,r)),He.s=1,He.Q.set(0,0,0),Dl(),en.shift(n);let i=Dp&&Dp.key;return i&&typeof i.onRebase=="function"&&i.onRebase(n),Oe.emit("scale:rebase",{kind:n,k:t.k,T:t.T}),t},unrebase(n){Jx(e=>e.multiplyScalar(1/n.k).add(n.T)),He.s=n.s,He.Q.copy(n.Q),Dl(),en.shift(n.kind==="grow"?"shrink":"grow")},mapPoint(n,e,t){return t.copy(n).sub(e.T).multiplyScalar(e.k)},fitClip(n){let e=Math.max(1e-5,RE.copy(n.position).sub(He.focus).length());n.near=Ef.near*e,n.far=Ef.far*e}};var Ol=Vt.r5,iv=Ol.elevationDeg*Math.PI/180,CE=Math.cos(iv),IE=Math.sin(iv),Np=Math.PI*2,rf=new I(0,0,0),Fp=wt.radius,Qx=new I,Nl=!1,ia=Math.PI*.75,Op=-.7,Up=.7,Bp=0,kp=0,sf=new I,of=new I,Hs=1,zp="",ev=new I,tv=new I,Fl=new I,nv=new I,fi={position:he.uLamp.value,mode:"sweep",ctx:null,init(n){return fi.ctx=n,fi.setFocus(rf.set(0,0,0),wt.radius),fi},setFocus(n,e){rf.copy(n),Fp=e??Fp},hold(n){n?(Qx.copy(n),Nl||(sf.copy(fi.position),Hs=0),Nl=!0):Nl&&(Nl=!1,sf.copy(fi.position),Hs=0)},sweepOnce(n){kp=Math.max(200,n||1200),Bp=Ie.now+kp},update(n){let e=Ee.camera;if(!e)return;let t=Yt.pointer,i=t.type==="touch"||Ge.isPhone,r;Ie.now<Bp?r="sweep":i?r=t.down?"finger":"sweep":r=t.inside!==!1&&t.x>-9e3&&Ie.now-t.lastMove<Ol.idleMs?"pointer":"sweep",r!==zp&&(zp&&(sf.copy(fi.position),Hs=0),r==="sweep"&&(ia=Math.atan2(Up,Op)),zp=r),fi.mode=r,ev.setFromMatrixColumn(e.matrixWorld,0),tv.setFromMatrixColumn(e.matrixWorld,1),Fl.copy(e.position).sub(rf),Fl.lengthSq()<1e-12?Fl.setFromMatrixColumn(e.matrixWorld,2):Fl.normalize();let s,o;if(r==="sweep"){let l=Ie.now<Bp?kp:Ol.sweepMs;ia+=Np*n*1e3/l,ia>Np&&(ia-=Np),s=Math.cos(ia),o=Math.sin(ia)}else{let l=t.x/Math.max(1,Ge.w)*2-1,c=-(t.y/Math.max(1,Ge.h))*2+1,u=Math.hypot(l,c);u>1e-4&&(Op=l/u,Up=c/u),s=Op,o=Up}nv.copy(ev).multiplyScalar(s).addScaledVector(tv,o).normalize();let a=Ol.radiusFactor*Fp;of.copy(rf).addScaledVector(nv,a*CE).addScaledVector(Fl,a*IE),Nl&&of.copy(Qx),Hs<1?(Hs=Math.min(1,Hs+n*1e3/Ol.blendMs),fi.position.copy(sf).lerp(of,Zt.reveal(Hs))):fi.position.copy(of)}};var ra=Math.PI*2,PE=on.irisBladeDeg*Math.PI/180;function rv(n,e,t,i){for(let r=0;r<e;r++){let s=ra*r/e-Math.PI/e,o=s+ra/e;n.push(Math.sin(s)*t,i,Math.cos(s)*t,Math.sin(o)*t,i,Math.cos(o)*t)}}var LE=n=>qt(n/1e3)*1e3;function sv(n,e){let t=on.irisBlades*2+28,i=new Float32Array(t*6),r=hi({segments:i,color:"silver",alpha:.42,far:e}),s=on.irisR,o=0;function a(l){let c=0,u=(d,h,f,g)=>{i[c++]=d,i[c++]=n,i[c++]=h,i[c++]=f,i[c++]=n,i[c++]=g};for(let d=0;d<on.irisBlades;d++){let h=ra*d/on.irisBlades,f=ra*(d+1)/on.irisBlades,g=s*(.06+.94*l),_=h+Math.PI/on.irisBlades+PE*(1-l),m=Math.sin(_)*g,p=Math.cos(_)*g;u(Math.sin(h)*s,Math.cos(h)*s,m,p),u(m,p,Math.sin(f)*s,Math.cos(f)*s)}for(let d=0;d<28;d++){let h=ra*d/28,f=ra*(d+1)/28;u(Math.sin(h)*s,Math.cos(h)*s,Math.sin(f)*s,Math.cos(f)*s)}r.setSegments(i)}return a(0),{object:r.mesh,lines:r,get open(){return o},set(l){let c=Math.max(0,Math.min(1,l));c!==o&&(o=c,a(c))}}}function ov(n){let e=be[n]||be.CORE,t=e.n,i=new Bt;i.name=`shell:${e.id}`;let r=e.floor-e.alt,s=e.ceil-e.alt,o=e.id==="CORE",a=e.far,l=[];for(let[p,S]of[[r,e.floor],[s,e.ceil]]){let b=o?300:LE(S);for(let y=on.ringStep;y<b-1;y+=on.ringStep)rv(l,t,y,p)}let c=hi({segments:new Float32Array(l.length?l:[0,0,0,0,0,0]),color:"steel",alpha:l.length?1:0,far:a,flatten:!0});c.mesh.name="rings",i.add(c.mesh);let u=null;if(!o){let p=[],S=[];for(let b=on.deckRingStep;b<=on.deckR+1e-6;b+=on.deckRingStep){rv(p,t,b,0);for(let y=0;y<t;y++)S.push(1-.75*(b/on.deckR))}u=hi({segments:new Float32Array(p),alpha:new Float32Array(S),color:"steel",far:a,flatten:!0}),u.mesh.name="deck",i.add(u.mesh)}let d=sv(s,a),h=sv(r,a);i.add(d.object,h.object);let f=1,g=!0,_={rings:l.length?1:0,deck:1,iris:.42};return{group:i,rings:c,deck:u,irisTop:d,irisBottom:h,setDeckVisible(p){g=!!p,u&&(u.mesh.visible=g&&f>0)},setIris(p,S){(p==="top"?d:h).set(S)},setFlatten(p,S){c.setFlatten(p,S),u&&u.setFlatten(p,S)},setAlpha(p){f=Math.max(0,Math.min(1,p)),c.setAlpha(_.rings*f),u&&(u.setAlpha(_.deck*f),u.mesh.visible=g&&f>0),d.lines.setAlpha(_.iris*f),h.lines.setAlpha(_.iris*f)},dispose(){c.dispose(),u&&u.dispose(),d.lines.dispose(),h.lines.dispose(),i.parent&&i.parent.remove(i)}}}var DE=`
varying vec3 vN; varying vec3 vW;
void main() {
  mat4 m = modelMatrix;
#ifdef USE_INSTANCING
  m = modelMatrix * instanceMatrix;
#endif
  vec4 w = m * vec4(position, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(m) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,NE=`
${ui}
uniform vec3 uColor; uniform vec3 uBase; uniform vec3 cWhite; uniform vec3 uLamp; uniform float uAlpha, uFlash;
varying vec3 vN; varying vec3 vW;
void main() {
  // Obsidian body with a silver Fresnel rim and a lamp glint, like every other solid in the world.
  vec3 N = normalize(vN);
  vec3 V = normalize(cameraPosition - vW);
  vec3 L = normalize(uLamp - vW);
  float d = max(dot(N, L), 0.0);
  float fr = pow(1.0 - clamp(abs(dot(N, V)), 0.0, 1.0), 3.0);
  float sp = pow(max(dot(N, normalize(L + V)), 0.0), 24.0);
  vec3 col = uBase + uColor * (0.06 + 0.10 * d + 0.55 * fr + 0.35 * sp);
  col = mix(col, cWhite, uFlash);
  col = applyFog(col, length(vW - cameraPosition));
  gl_FragColor = vec4(col, uAlpha);
}`;function av(){let n=new Bt;n.name="axisPillar";let e=12,t=[],i=1200,r=50;for(let f=-i;f<i;f+=r){let g=f,_=Math.min(i,f+r);_<=-e||g>=e?t.push(0,g,0,0,_,0):(g<-e&&t.push(0,g,0,0,-e,0),_>e&&t.push(0,e,0,0,_,0))}let s=hi({segments:new Float32Array(t),color:"ember",width:2,alpha:.5,glint:.4,far:4e3});s.mesh.name="pillarRibbon",n.add(s.mesh);let o=new ja(on.beadR,0),a=new bt({uniforms:{uColor:Un("silver"),uBase:Un("obsidian"),cWhite:he.cWhite,uLamp:he.uLamp,uAlpha:{value:1},uFlash:{value:0},cAbyss:he.cAbyss,uFogDensity:he.uFogDensity},vertexShader:DE,fragmentShader:NE}),l=new za(o,a,on.beadCount);l.name="pillarBeads";let c=new vt,u=new xi,d=new I,h=new I;for(let f=0;f<on.beadCount;f++){let g=-i+on.beadStep*f;d.set(0,g,0),h.setScalar(Math.abs(g)<e?0:1),l.setMatrixAt(f,c.compose(d,u,h))}return l.instanceMatrix.needsUpdate=!0,l.frustumCulled=!1,n.add(l),n.userData.ribbon=s,n.userData.beads=l,n.userData.uniforms={ribbon:s.uniforms,beads:a.uniforms},n}var Ul=new Ja,Bl=[];var ML=new I;function lv(n,e,t,i){if(!Ee.camera||!t||!t.length)return null;Ee.ray(n,e,Ul.ray),Ul.near=Ee.camera.near,Ul.far=Ee.camera.far,Ul.layers.mask=4294967295,Bl.length=0,Ul.intersectObjects(t,!0,Bl);let r=null;for(let s=0;s<Bl.length;s++){let o=Bl[s];if(FE(o.object)){r=o;break}}return Bl.length=0,r?i?(Object.assign(i,r),i):r:null}function FE(n){for(let e=n;e;e=e.parent)if(!e.visible)return!1;return!0}var Ws=Math.PI/180,Xn=Math.PI*2,OE=137.508*Ws;function UE(n){let e=Mn[n],t=wt.sign.heightFrac*e.height;kt.draw(`sign:${n}`,{height:(i,r,s)=>cv(i,r,s,n,t,!1),inlay:(i,r,s)=>cv(i,r,s,n,t,!0)})}function cv(n,e,t,i,r,s){n.fillStyle="#fff",n.strokeStyle="#fff";let o=e/r;if(ga[i]==="•"){let g=(wt.apertureD/2+.0045)*o,_=wt.ringEngraveW*o;n.beginPath(),s?(n.lineWidth=1,n.arc(e/2,t/2,g-_/2,0,Xn),n.stroke(),n.beginPath(),n.arc(e/2,t/2,g+_/2,0,Xn),n.stroke()):(n.lineWidth=Math.max(1.5,_),n.arc(e/2,t/2,g,0,Xn),n.stroke());return}let l=(i===0||i===6?.5:.9)*t,c=t/2+(i===0?.17*t:i===6?.02*t:0);n.font=ma.sign.replace("{px}",String(Math.round(l*1.38))),n.textAlign="center",n.textBaseline="alphabetic";let u=n.measureText(ga[i]),d=u.actualBoundingBoxAscent||l,h=u.actualBoundingBoxDescent||0,f=c+(d-h)/2;s?(n.lineWidth=1,n.strokeText(ga[i],e/2,f)):n.fillText(ga[i],e/2,f)}function BE(){kt.draw("ticks",{height:(n,e,t)=>{n.fillStyle="#fff";for(let i=0;i<wt.ticksPerFace;i++)n.fillRect((i+.5)/wt.ticksPerFace*e-1,0,2,t*.9)},inlay:(n,e,t)=>{n.fillStyle="#fff";for(let i=0;i<wt.ticksPerFace;i++)n.fillRect(Math.round((i+.5)/wt.ticksPerFace*e),0,1,t*.9)}})}function uv(){kt.texture||kt.init(it.tier);for(let n=0;n<7;n++)UE(n);BE()}var kE="void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",zE=`
uniform vec3 uColor; uniform vec3 cElectrum; uniform vec3 cWhite; uniform float uNight, uI, uFlash, uEmissivePass, uGlowVis;
void main() {
  vec3 c = mix(uColor, cElectrum, uNight);
  float k = uI * mix(1.0, ${ar.nucleusIntensity.toFixed(2)}, uNight);
  k *= mix(1.0, uGlowVis, uEmissivePass);      // T3 bloom source obeys the SPEC visibility rule like the T1/T2 sprite
  gl_FragColor = vec4(mix(c * k, cWhite, uFlash), 1.0);
}`;function hv(n,e){let t=Mn[n],i=t.top+(t.bot-t.top)/3,r=t.top+(t.bot-t.top)*2/3,s=(qt(i)+qt(r))/2;return e.set(0,t.mid,s*Math.cos(Math.PI/t.n))}var fv=()=>({dy:0,slide:0,yaw:0,pitch:0,scaleR:1,scaleY:1,alpha:1,edgeFlash:0});function dv(n){uv(),Ko().then(uv);let e=new Bt;e.name="key";let t=Ml({perStratum:!0,vertices:!0,far:700});e.add(t.group);let i=t.strata,r=new bt({uniforms:{uColor:{value:he.cEmber.value},cElectrum:he.cElectrum,cWhite:he.cWhite,uNight:he.uNight,uI:{value:1},uFlash:{value:0},uEmissivePass:he.uEmissivePass,uGlowVis:{value:1}},vertexShader:kE,fragmentShader:zE}),s=new Lt(new As(En.r,En.detail),r);s.name="nucleus",s.userData.stratum=3;let o=Bh({color:"ember",radius:En.glowR,intensity:1,core:s,depthTest:!1,night:!0,nightIntensity:ar.nucleusIntensity,fog:!1,renderOrder:6});e.add(o.object);let a=hi({segments:new Float32Array([0,-mi.half,0,0,mi.half,0]),color:"ember",width:mi.widthPx,alpha:mi.alphaInside,glint:.3}),l=8,c=new Float32Array(l*2*6),u=new Float32Array(l*2),d=hi({segments:c,alpha:u,color:"ember",width:mi.widthPx,glint:.3});for(let E of[a,d])E.mesh.layers.enable(On.EMISSIVE),E.mesh.renderOrder=4,e.add(E.mesh);let h=-1;function f(E){if(E!==h){h=E;for(let L=0;L<2;L++){let k=L?-1:1;for(let ie=0;ie<l;ie++){let le=mi.half+E*ie/l,W=mi.half+E*(ie+1)/l,j=(L*l+ie)*6;c[j]=0,c[j+1]=k*le,c[j+2]=0,c[j+3]=0,c[j+4]=k*W,c[j+5]=0,u[L*l+ie]=mi.alphaInside*(1-(ie+.5)/l)}}d.setSegments(c),d.mesh.geometry.attributes.aAl.needsUpdate=!0,d.mesh.visible=E>0}}f(mi.extend);let g=48,_=new Float32Array(g*6),m=hv(3,new I).z+.002;for(let E=0;E<g;E++){let L=E/g*Xn,k=(E+1)/g*Xn,ie=E*6;_.set([Math.cos(L)*En.breathRingR,Math.sin(L)*En.breathRingR,m,Math.cos(k)*En.breathRingR,Math.sin(k)*En.breathRingR,m],ie)}let p=hi({segments:_,color:"ember",width:1,alpha:.8,glint:0});p.mesh.visible=!1,i[3].add(p.mesh);let S=zh({scale:1});S.setCount(se.litNodes),i[3].add(S.object);let b=Bn.T3.grains,y=new Float32Array(b*3),A=new Float32Array(b),T=[0];for(let E=1;E<7;E++)T.push((Mn[E-1].bot+Mn[E].top)/2);let R=2654435769,x=()=>{R=R+1831565813|0;let E=R;return E=Math.imul(E^E>>>15,E|1),E^=E+Math.imul(E^E>>>7,E|61),((E^E>>>14)>>>0)/4294967296};for(let E=0;E<b;E++){let L=T[E%7],ie=Math.max(.12,qt(L))*Et(to.annulus[0],to.annulus[1],Math.sqrt(x())),le=x()*Xn;y[E*3]=Math.sin(le)*ie,y[E*3+1]=L+(x()-.5)*2*to.jitter,y[E*3+2]=Math.cos(le)*ie,A[E]=Et(to.sizePx[0],to.sizePx[1],x())}let w=Qr({positions:y,sizes:A,sizePx:1,color:"silver",alpha:.35,count:(it.params||Bn.T2).grains});w.object.name="grains",e.add(w.object);let C={count:(it.params||Bn.T2).grains,mode:"rings",setMode(E){C.mode=E},setPlate(){},writeTargets(){},commitTargets(){},flyToTargets(){},shiver(){},scatter(){}};Oe.on("tier:change",({tier:E})=>{let L=Bn[E];L&&(C.count=Math.min(b,L.grains),w.setCount(C.count))});let D=()=>{ue.satellites=Math.min(7,se.data&&se.data.drawings?se.data.drawings.length:0)};D(),Oe.on("drawing:saved",D);let O=E=>E<=0?1:-Math.log(E)/Math.sqrt(Math.PI*Math.PI+Math.log(E)**2),z=[];for(let E=0;E<7;E++)z.push(new ks(22,O(.04),0));let N=new Float32Array(7),V=new Int32Array(7),Z=[],X=[];for(let E=0;E<7;E++)Z.push(null),X.push(fv());let K=null,q=1,J={scale:1,nucleus:1,gap:-1},te=new ks(6,1,St.rest),Be=new ks(6,1,0),Le=new ks(6,.8,0),dt=!1,ot=!0,rt=1,Y={on:!0,base:1,pulse:1,flashUntil:0,flashToken:null,oneFrameFlash:0},Q={t0:-1,amp:0},ge={t0:-1,amp:0,hz:0,decay:1,ms:0},qe={t0:-1},Se=0,de=he.cEmber.value,pe=new I,Ae=new I,We=new I,xt=new I,xe={x:0,y:0,depth:0,visible:!1},ye={x:0,y:0,depth:0,visible:!1},Qe=new I,Ft=t.solids.concat([s]),Dt=Math.cos(En.apertureAlignDeg[0]*Ws),Nt=Math.cos(En.apertureAlignDeg[1]*Ws);function F(){for(let E=0;E<7;E++)Object.assign(X[E],fv());J.scale=1,J.nucleus=1,J.gap=-1}function dn(E,L){Se=L;for(let ne=0;ne<7;ne++){let ae=z[ne];if(N[ne]!==0){ae.x+=N[ne]*E,ae.v=0,ae.target=ae.x,N[ne]*=Math.pow($n.spinDecay,E*1e3/$n.frameMs);let me=Xn/Mn[ne].n,ke=Math.floor(ae.x/me);ke!==V[ne]&&(V[ne]=ke,Jt.play("tick",{})),Math.abs(N[ne])<.35&&(N[ne]=0,ae.omega=6,ae.zeta=1,ae.target=Math.round(ae.x/Xn)*Xn)}ae.step(E)}te.step(E),Be.step(E),Le.step(E);let k=te.x;dt&&(k+=Wn.mix(St.rest,St.breath)-St.rest),J.gap>=0&&(k=J.gap),K&&K.gap!=null&&(k=Et(k,K.gap,q)),ht=k;let ie=0;for(let ne=0;ne<7;ne++){let ae=X[ne],me=Z[ne],ke=me?q:0,lt=(3-ne)*(k-St.rest)+ae.dy+(me&&me.dy?me.dy*ke:0),B=ae.slide+(me&&me.slide?me.slide*ke:0),ve=z[ne].x+ae.yaw+(me&&me.yaw?me.yaw*ke:0);if(ge.t0>=0){let Ue=L-ge.t0;Ue>ge.ms?ge.t0=-1:ve+=ge.amp*Math.sin(Xn*ge.hz*Ue/1e3+ne*.9)*Math.exp(-Ue/ge.decay)}let ee=ae.pitch+(me&&me.pitch?me.pitch*ke:0),_e=ae.scaleR*(me&&me.scaleR!=null?Et(1,me.scaleR,ke):1),Re=ae.scaleY*(me&&me.scaleY!=null?Et(1,me.scaleY,ke):1),re=ae.alpha*(me&&me.alpha!=null?Et(1,me.alpha,ke):1);ie=Math.max(ie,ae.edgeFlash+(me&&me.edgeFlash?me.edgeFlash*ke:0));let Xe=i[ne];Xe.position.set(Math.sin(ve)*B,lt,Math.cos(ve)*B),Xe.rotation.set(ee,ve,0,"YXZ"),Xe.scale.set(_e,Re,_e),t.setStratumFade(ne,re)}for(let ne=0;ne<t.edges.length;ne++)t.edges[ne].uniforms.uFlash.value=Math.min(1,ie*.6);let le=J.scale*(K&&K.scale!=null?Et(1,K.scale,q):1);e.scale.setScalar(le);let W=Le.x+(K&&K.pitch?K.pitch*q:0);if(qe.t0>=0){let ne=L-qe.t0;ne>600?qe.t0=-1:W+=8*Ws*Math.sin(Math.PI*ne/600)}e.rotation.set(W,Be.x+(K&&K.yaw?K.yaw*q:0),K&&K.roll?K.roll*q:0,"YXZ");let j=0;if(Q.t0>=0){let ne=L-Q.t0;ne>Ze.shudder?Q.t0=-1:j=Math.sin(Xn*3*ne/Ze.shudder)*Q.amp*(1-ne/Ze.shudder)}e.position.set(j,0,K&&K.dz?K.dz*q:0),e.updateWorldMatrix(!0,!0),Qe.setFromMatrixPosition(e.matrixWorld);let fe=Y.on?(dt?Wn.mix(En.intensity[0],En.intensity[1]):1)*Y.pulse*J.nucleus:0;Y.flashUntil&&L>Y.flashUntil&&(Y.flashUntil=0,de=he.cEmber.value,o.setColor("ember")),r.uniforms.uColor.value=de,r.uniforms.uI.value=fe,r.uniforms.uFlash.value=Y.oneFrameFlash>0?1:0,o.setFlash(r.uniforms.uFlash.value),Y.oneFrameFlash>0&&Y.oneFrameFlash--;let Pe=En.minVisibility;if(Ee.camera&&(We.set(0,0,1).transformDirection(i[3].matrixWorld),pe.copy(Ee.camera.position).sub(Qe).normalize(),Pe=Math.max(Pe,Ns(Dt,Nt,pe.dot(We)),Ns(En.gapOpen[0],En.gapOpen[1],k))),o.setIntensity(fe*Pe*rt),r.uniforms.uGlowVis.value=Pe*rt,p.mesh.visible){let ne=Wn.mix(0,1);p.mesh.scale.setScalar(1+.04*ne),p.setAlpha(.55+.35*ne)}}let ht=St.rest,P={group:e,structure:t,radius:wt.radius,nucleusWorld:Qe,grains:C,nucleus:s,glow:o,litNodes:S,faceFrame(E,L){return hv(E,xt),L.F.copy(xt).applyMatrix4(i[E].matrixWorld),L.n.set(0,0,1).transformDirection(i[E].matrixWorld),L},stratumMatrix(E,L){return L.copy(i[E].matrixWorld)},pick(E,L){let k=lv(E,L,Ft);return k&&k.object&&k.object.userData.stratum!=null?k.object.userData.stratum:-1},screenInfo(E){let L=Ee.camera;if(Ee.project(Qe,xe),E.x=xe.x,E.y=xe.y,!L)return E.r=E.rx=E.ry=0,E;let k=e.scale.x;return pe.setFromMatrixColumn(L.matrixWorld,0),Ae.copy(Qe).addScaledVector(pe,wt.radius*k),Ee.project(Ae,ye),E.r=Math.abs(ye.x-xe.x),Ae.copy(Qe).addScaledVector(pe,.62*k),Ee.project(Ae,ye),E.rx=Math.abs(ye.x-xe.x),pe.setFromMatrixColumn(L.matrixWorld,1),Ae.copy(Qe).addScaledVector(pe,1.2*k),Ee.project(Ae,ye),E.ry=Math.abs(ye.y-xe.y),E},stratumScreenY(E){return pe.set(0,Mn[E].mid,0).applyMatrix4(i[E].matrixWorld),Ee.project(pe,xe).y},update:dn,onGesture(E){if(!ot||!E||E.type!=="tap")return!1;let L=P.pick(E.x,E.y);return L<0?!1:(Oe.emit("key:click",{index:L,x:E.x,y:E.y}),!0)},setInteractive(E){ot=!!E},setIdle(E){dt=!!E},setReveal(E){if(!E)return;rt=E.fill!=null?_t(E.fill):1,t.setParts({vertices:E.points!=null?_t(E.points):1,solid:rt,edges:1,lattice:rt}),t.setFade(E.alpha!=null?_t(E.alpha):1);for(let k=0;k<t.edges.length;k++)t.edges[k].uniforms.uFlash.value=E.scanY!=null?.35:0;let L=E.alpha==null||E.alpha>0;a.mesh.visible=L,d.mesh.visible=L&&h>0,p.mesh.visible=L&&v,S.object.visible=(E.alpha==null||E.alpha>0)&&S.count>0,w.setAlpha(.35*(E.alpha!=null?_t(E.alpha):1))},setScramble(E){for(let L=0;L<7;L++){let k=0;E==="golden"?k=L*OE:E==="random"?k=(x()-.5)*Xn:Array.isArray(E)&&(k=+E[L]||0),k=Math.atan2(Math.sin(k),Math.cos(k)),N[L]=0,z[L].snap(k)}},lockSequence(E={}){let L=E.order==="up"?[6,5,4,3,2,1,0]:[0,1,2,3,4,5,6],k=E.stepMs!=null?E.stepMs:Ze.lockStep;if(E.spin)for(let ie of L)Math.abs(z[ie].x)>.01&&(N[ie]=3);return new Promise(ie=>{L.forEach((le,W)=>Kn(W*k,()=>{if(P.alignStratum(le,{spring:"light",overshoot:E.snap!=null?E.snap:$n.snapOvershoot}),Jt.play("ratchet",{i:le}),E.onLock)try{E.onLock(le)}catch{}W===L.length-1&&Kn(320,ie)}))})},alignStratum(E,L={}){let k=z[E];N[E]=0,k.omega=L.spring==="heavy"?6:22,k.zeta=O(L.overshoot!=null?L.overshoot:0),k.target=Math.round(k.x/Xn)*Xn},spinStratum(E,L){N[E]=L,V[E]=Math.floor(z[E].x/(Xn/Mn[E].n))},ignite(E={}){Y.on=!0,Y.oneFrameFlash=E.flash===!1?0:1,de=E.color==="electrum"?he.cElectrum.value:he.cEmber.value,o.setColor(E.color==="electrum"?"electrum":"ember")},douse(){Y.on=!1},shootAxis(E=mi.extend,L=mi.shootMs){return ci(L,ie=>f(E*ie),Zt.reveal).done},setBreathingRing(E){v=!!E,p.mesh.visible=v},setMorph(E,L,k,ie){if(F(),E==="dive"){let le=ie>1600?1.375:1,W=k/le,j=_t(W/120),fe=Zt.camera(_t((W-120)/360));J.scale=W<120?1-wt.contract*Zt.camera(j):1-wt.contract*(1-Ns(120,480,W)),J.nucleus=1+(wt.nucleusAnticipation-1)*(W<120?j:1-Ns(120,480,W)),J.gap=Et(St.rest,St.dive,fe);for(let Pe=0;Pe<7;Pe++){let ne=X[Pe];Pe===L?(ne.slide=wt.diveSlide*fe,ne.yaw=-z[Pe].x*fe,ne.edgeFlash=W<120?j:1-Ns(480,900,W)):(ne.yaw=(Pe<L?-1:1)*wt.diveTurnAwayDeg*Ws*fe,ne.alpha=1-Ns(480*le,1e3*le,k))}}else if(E==="recall"){let le=Ze.recallSwapAt*ie/Ze.recall,W=k-le;if(W<0){J.gap=St.recallStart;return}let j=_t(W/(ie-le||200));J.gap=St.rest+(St.recallStart-St.rest)*(1-Zt.camera(j))-(St.recallStart-St.rest)*$n.settleOvershoot*Math.sin(Math.PI*j);for(let fe=0;fe<7;fe++)W<Ze.recallRatchetMs*(fe+1)&&(X[fe].yaw=(fe%2?-1:1)*6*Ws)}else J.gap<0&&ht!==te.x&&(te.snap(ht),te.target=St.rest)},override(E,L){E>=0&&E<7&&(Z[E]=L||null)},overrideGroup(E){K=E||null},setOverrideWeight(E){q=_t(E)},onRebase(E){F();for(let L=0;L<7;L++)N[L]=0,z[L].snap(0);te.snap(E==="shrink"?St.recallStart:St.rest),te.omega=4,te.target=St.rest},shudder(E=6){tn.reducedMotion&&(E=Math.min(E,2));let L=Ee.camera?Ee.camera.position.distanceTo(Qe):7.2;Q.amp=E*L/Math.max(1,he.uPxPerUnit.value),Q.t0=Se},addYaw(E){Be.x+=E},wobble(E,L,k,ie){tn.reducedMotion||Object.assign(ge,{t0:Se,amp:E,hz:L,decay:Math.max(1,k),ms:ie})},bow(){return qe.t0=Se,Be.target=0,new Promise(E=>Kn(600,E))},nudgePitch(E){Le.x+=E*Ws},flashNucleus(E,L){de=E==="white"?he.cWhite.value:he.cElectrum.value,o.setColor(E==="white"?"white":"electrum"),Y.flashUntil=Se+Math.max(16,L||0)},setNucleusPulse(E){Y.pulse=E>0?E:1}},v=!1;return P.setReveal({points:0,scanY:null,fill:0,alpha:0}),P.douse(),f(0),Oe.on("night:change",({night:E})=>S.setNight(E)),ue.night&&S.setNight(!0),P}var VE=38,pv=-100,Xs=1024,os=256,GE=`
varying vec2 vUv; varying float vDist;
void main() { vUv = uv; vec4 v = modelViewMatrix * vec4(position, 1.0); vDist = length(v.xyz); gl_Position = projectionMatrix * v; }`,HE=`
${ui}
uniform sampler2D uTex; uniform vec3 cSilver; uniform float uAlpha;
varying vec2 vUv; varying float vDist;
void main() {
  float a = texture2D(uTex, vUv).a * uAlpha;
  if (a <= 0.003) discard;
  gl_FragColor = vec4(applyFog(cSilver, vDist), a);
}`;function mv(n){let e=new Bt;e.name="rim";let t=xa(nn.operator.name||""),i=-on.coreRimR*Math.cos(Math.PI/12)+.5,r=document.createElement("canvas");r.width=Xs,r.height=os;let s=new _r(r);s.minFilter=yt,s.magFilter=yt,s.generateMipmaps=!1,s.wrapS=s.wrapT=Dn,yi(s,Xs*os*4);let o=.5;function a(){let b=r.getContext("2d");b.clearRect(0,0,Xs,os),b.fillStyle="#fff",b.font=ma.burn.replace("{px}",String(Math.round(os*.78))),b.textAlign="center",b.textBaseline="middle",b.fillText(t,Xs/2,os/2+os*.04),o=Math.min(1,b.measureText(t).width/Xs),s.needsUpdate=!0,_()}let l=new bt({uniforms:{uTex:{value:s},cSilver:he.cSilver,uAlpha:{value:1},cAbyss:he.cAbyss,uFogDensity:he.uFogDensity},vertexShader:GE,fragmentShader:HE,transparent:!0,depthWrite:!1}),c=VE/.6,u=new Lt(new Mr(c*(Xs/os),c),l);u.position.set(0,pv,i),u.visible=!1,u.name="rimName",e.add(u);let d=Math.max(1,wl(nn.clan.sigil).length),h=new Float32Array(d*3),f=kh({positions:h,count:0,color:"ember",radius:gs.emitterM,intensity:1});e.add(f.object);let g=0;function _(){let b=c*(Xs/os)*o/2+12;for(let y=0;y<d;y++){let A=Math.floor(y/3),T=y%3;h[y*3]=b+A*6,h[y*3+1]=pv+(1-T)*7,h[y*3+2]=i+.5}f.setPositions(h,d),f.setCount(g)}a(),Ko().then(a);let m=null;try{m=document.createElement("span"),m.className="sr-only",m.textContent=t,(document.getElementById("overlay")||document.body).appendChild(m)}catch{m=null}let p=1,S={group:e,burn(b){return S.showName(),Promise.resolve()},showName(){u.visible=p>0},setLitNodes(b){g=Math.max(0,Math.min(d,b|0)),f.setCount(g)},setAlpha(b){p=Math.max(0,Math.min(1,b)),l.uniforms.uAlpha.value=p,e.visible=p>0,f.setIntensity(p)}};return S.setLitNodes(se.litNodes),S}function gv(n){let e=n.app,t=Ai.rest,i=!1,r=null,s=!1,o=$e.core,a=new I(...o.pos),l=new I(...o.target);function c(){let f=$e.core;return{pos:new I(...f.pos),target:new I(...f.target),fov:f.fov,offsetY:n.layout.kind==="desktop"?0:f.phoneOffsetY,roll:0}}function u({index:f}){if(!i||n.director.busy()||e.phase!=="idle"&&e.phase!=="unfolded")return;if(f===3){n.director.go(s?"#/core":"#/core/open",{source:"key"});return}let g=Lh(f);g&&n.director.go(`#/${g.slug}`,{source:"key"})}function d(f){s=f,e.unfolded=f,n.key&&(n.key.overrideGroup(f?{gap:St.unfold}:null),n.key.setOverrideWeight(1))}return{id:"CORE",build(){r=n.bus.on("key:click",u)},pose(){return c()},livePose(f){return Math.abs(t-Ai.rest)<1e-4?!1:(f.target.copy(l),f.pos.copy(a).sub(l).multiplyScalar(t/Ai.rest).add(l),f.fov=o.fov,f.offsetY=n.layout.kind==="desktop"?0:o.phoneOffsetY,f.roll=0,!0)},enter(){},exit(){},arrive(){i=!0,t=Ai.rest},depart(){i=!1,s&&d(!1)},setSub(f){return f==="open"?(s||(d(!0),e.phase==="idle"&&lr("unfolded")),0):f==null?(s&&(d(!1),e.phase==="unfolded"&&lr("idle")),0):!1},update(){},onGesture(f){return n.key&&n.key.onGesture(f)?!0:f.type==="wheel"?(t=Math.max(Ai.min,Math.min(Ai.max,t*Math.pow(Ai.wheelFactor,f.deltaY/Ai.wheelStepPx))),!0):f.type==="pinch"?(t=Math.max(Ai.min,Math.min(Ai.max,t/Math.max(.2,f.dScale||1))),!0):!1},onKey(f){return f.key==="Escape"&&s?(n.director.go("#/core",{source:"kbd"}),!0):!1},resize(){},dispose(){r&&(r(),r=null),s&&d(!1),i=!1}}}function Vp(n,e){if(n==="ZENITH")return e>0?"SIGNAL":null;let t=n==="WORKSHOP"?"MEMBERS":n,i=Jr.indexOf(t);if(i<0)return null;let r=i+(e>0?1:-1);return r>=0&&r<Jr.length?Jr[r]:null}function xv(n){let e=ti.elevator,t=0,i=-1e9,r=0;function s(o){let a=Vp(n.id,o);return t=0,r=0,a?(n.director.go(`#/${be[a].slug}`,{source:"hall"}),!0):!1}return{onWheel(o){let a=n.loop.now;a-i>600&&(t=0,r=0),i=a;let l=o.deltaY||0;if(!l||(t!==0&&Math.sign(l)!==Math.sign(t)&&(t=0,r=0),!Vp(n.id,Math.sign(l))))return!0;let c=Math.abs(t)<e.resistance*e.pxPerHall?.5:1;t+=l*c;let u=Math.floor(Math.abs(t)/e.tickPx);return u>r&&(r=u,n.audio&&n.audio.play("tick",{})),Math.abs(t)>=e.pxPerHall&&s(Math.sign(t)),!0},onSwipe(o){if(o.dir!=="up"&&o.dir!=="down")return!1;let a=o.dir==="up"?1:-1;return Vp(n.id,a)?(ns(ts.lock),s(a)):!1},reset(){t=0,r=0,i=-1e9}}}var af=Math.PI/180,as=Math.PI*2,WE=new Set(["SIGNAL","MEMBERS","INSIGNIA","NADIR","ZENITH","ARCHIVE"]),XE="Зал строится.";function YE(n,e,t){let i=e==="phone",r=(o,a,l=$e.fov,c=0)=>({pos:new I(...o),target:new I(...a),fov:l,offsetY:c,roll:0}),s=(o,a,l)=>{let c=l-o[1];return[o[0],l,o[2]+c/Math.tan(a*af)]};switch(n){case"MEMBERS":return i?r($e.members.phonePos,$e.members.target):r($e.members.pos,$e.members.target);case"VOYAGES":{let o=i?$e.voyages.phonePos:[0,t,t*.6285714285714286];return r(o,i?s(o,-$e.voyages.phonePitchDeg,0):[0,0,-6*(t/70)])}case"ARCHIVE":return r([0,1.6,0],[0,1.6,$e.archive.tubeR]);case"SIGNAL":return i?r($e.signal.phonePos,[0,2+30*Math.tan($e.signal.phonePitchDeg*af),0],$e.fovWide):r($e.signal.pos,$e.signal.target,$e.signal.fov);case"INSIGNIA":return r($e.insignia.pos,[0,1.7,-10],$e.insignia.fov);case"NADIR":return r([0,20,40],[0,0,0]);case"ZENITH":{let o=[0,50,30];return r(o,s(o,i?$e.zenith.phonePitchDeg:$e.zenith.pitchDeg,-110))}case"WORKSHOP":return r([0,0,3.2],[0,0,0]);default:return r($e.core.pos,$e.core.target,$e.core.fov,e==="desktop"?0:$e.core.phoneOffsetY)}}function Ys(n,e,t,i=48,r=0,s=0){for(let o=0;o<i;o++){let a=as*o/i,l=as*(o+1)/i;n.push(r+Math.sin(a)*e,t,s+Math.cos(a)*e,r+Math.sin(l)*e,t,s+Math.cos(l)*e)}}function $E(n,e,t){let o=.75*Math.PI;for(let a of[1,-1])for(let l=0;l<10;l++){let c=as*l/10;n.push(e+Math.sin(c)*1.2,0,t+Math.cos(c)*1.2,e+Math.sin(c+a*o)*1.2,24,t+Math.cos(c+a*o)*1.2)}Ys(n,1.2,0,14,e,t),Ys(n,1.2,24,14,e,t),Ys(n,1.2*1.6,24,14,e,t)}function vv(n,e,t,i){let r=If(e),s=new Float32Array(n*3);for(let o=0;o<n;o++){let a=r()*as,l=Math.asin(.15+.85*r());s[3*o]=Math.cos(l)*Math.sin(a)*i,s[3*o+1]=t+Math.sin(l)*i,s[3*o+2]=Math.cos(l)*Math.cos(a)*i}return s}function qE(n,e){let t=[],i=null,r=[];switch(n){case"columns":{let s=e.world.members,o=s.length,a=s.filter(c=>c.id!==e.world.operator.id),l=s.find(c=>c.id===e.world.operator.id);l&&a.splice(Math.floor(a.length/2),0,l),a.forEach((c,u)=>{let d=o>1?(-25+50*u/(o-1))*af:0,h=48*Math.sin(d),f=48-48*Math.cos(d);$E(t,h,f),r.push({id:c.id,label:c.name,pos:new I(h,24,f)})});break}case"hatches":for(let s=0;s<9;s++){let o=14*Math.sqrt(s),a=s*137.508*af;Ys(t,2.25,.05,24,Math.sin(a)*o,Math.cos(a)*o)}break;case"bands":for(let s=0;s<12;s++)Ys(t,$e.archive.tubeR,2-1.6*s,56);break;case"sky":{let s=$e.signal.apexH,o=$e.signal.apexR;Ys(t,o,s,36);for(let a=1;a<6;a++)Ys(t,60+(o-60)*(a/6),s*a/6,48);for(let a of[1,-1])for(let l=0;l<24;l++){let c=as*l/24,u=c+a*(as/6);t.push(Math.sin(c)*60,0,Math.cos(c)*60,Math.sin(u)*o,s,Math.cos(u)*o)}i=vv(300,20833,$e.signal.apexH,900);break}case"dome":{let s=new $a(new As($e.insignia.sphereR,1),1),o=s.attributes.position.array;for(let a=0;a<o.length;a++)t.push(o[a]+(a%3===1?1.7:0));s.dispose();break}case"chamber":{let s=$e.nadir.depth,o=40;for(let a=0;a<3;a++){let l=as*a/3,c=as*(a+1)/3;t.push(Math.sin(l)*o,0,Math.cos(l)*o,Math.sin(c)*o,0,Math.cos(c)*o),t.push(Math.sin(l)*o,0,Math.cos(l)*o,0,-s,0)}break}case"zenith":i=vv(400,11799,-40,1200);break;default:{i=new Float32Array(147);for(let s=0;s<49;s++)i[3*s]=(s%7-3)*.4,i[3*s+1]=(3-Math.floor(s/7))*.4,i[3*s+2]=0;break}}return{seg:t,pts:i,anchors:r}}function _n(n,e={}){let t=n.id,i=n.meta,r=e.props||"grid",s=null,o=null,a=null,l=null,c=[],u=0,d=0,h=null,f=!1,g=$e.voyages.pos[1],_=new I;function m(){let b=_t(u)*(1-_t(d));s&&s.setAlpha(.55*b),o&&o.setAlpha((r==="grid"?.9:.4)*b),a&&(a.style.opacity=String(_t(u)*(1-_t(d*2))));let y=u>=.7&&d===0;for(let A of c)A.setVisible(y)}function p(){let b=document.createElement("div");b.className="ph-block scrim";let y=document.createElement("p");return y.className="t-body",y.textContent=XE,b.appendChild(y),b}return{id:t,build(){let{seg:b,pts:y,anchors:A}=qE(r,n);if(n.group&&(b.length&&(s=hi({segments:new Float32Array(b),color:"silver",alpha:.55,width:1,far:Math.max(i.far,200)}),s.mesh.name=`ph:${r}`,n.group.add(s.mesh)),y)){let T=r==="sky"||r==="zenith";o=Qr({positions:y,sizePx:T?2:4,color:T?"white":"silver",alpha:.4,fog:!T,layer:T?On.NOFOG:On.DEFAULT}),n.group.add(o.object)}if(n.overlay&&A.length&&n.scale)for(let T of A){let R=T.pos.clone();c.push(n.overlay.add({owner:"placeholder",id:T.id,get:x=>{n.toCanonical(R,_),n.scale.toRender(_,x)},leader:{side:"right",len:40,rise:-24},button:{label:T.label,onActivate:()=>n.director.go(`#/members/${T.id}`,{source:"hall"})}}))}n.layout.isPhone||(a=p(),n.section.appendChild(a)),WE.has(t)&&(l=xv(n)),m()},pose(b){return YE(t,n.layout.kind,g)},livePose(b){return t!=="VOYAGES"||g===$e.voyages.pos[1]||n.layout.kind==="phone"?!1:(b.pos.set(0,g,g*(44/70)),b.target.set(0,0,-6*(g/70)),b.fov=$e.fov,b.offsetY=0,b.roll=0,!0)},enter(b){u=b,b>0&&(d=0),m()},exit(b){d=b,m()},arrive(){f=!0,u=1,d=0,m(),n.layout.isPhone&&n.sheet&&n.sheet.set(p(),{peek:null,state:"peek"})},depart(){f=!1,l&&l.reset(),n.layout.isPhone&&n.sheet&&n.sheet.set(null)},setSub(b){return h=b==null?null:String(b),0},update(){},onGesture(b){if(!f)return!1;if(t==="VOYAGES"&&b.type==="wheel"){let y=$e.voyages.altRange;return g=Math.max(y[0],Math.min(y[1],g+b.deltaY*.08)),!0}return l?b.type==="wheel"?l.onWheel(b):b.type==="swipe"?l.onSwipe(b):!1:!1},onKey(){return!1},resize(){!f||!n.sheet||n.layout.isPhone&&!a&&n.sheet.set(p(),{peek:null,state:"peek"})},dispose(){s&&(s.dispose(),s.mesh.parent&&s.mesh.parent.remove(s.mesh),s=null),o&&(o.dispose&&o.dispose(),o.object.parent&&o.object.parent.remove(o.object),o=null);for(let b of c)b.remove();c.length=0,a&&a.parentNode&&a.parentNode.removeChild(a),a=null,f&&n.layout.isPhone&&n.sheet&&n.sheet.set(null),f=!1},get sub(){return h}}}function yv(n){return _n(n,{props:"columns"})}function _v(n){return _n(n,{props:"grid"})}function Mv(n){return _n(n,{props:"hatches"})}function Sv(n){return _n(n,{props:"bands"})}function bv(n){return _n(n,{props:"sky"})}function wv(n){return _n(n,{props:"dome"})}function Ev(n){return _n(n,{props:"chamber"})}function Av(n){return _n(n,{props:"zenith"})}var Tv=Object.freeze({CORE:gv,MEMBERS:yv,WORKSHOP:_v,VOYAGES:Mv,ARCHIVE:Sv,SIGNAL:bv,INSIGNIA:wv,NADIR:Ev,ZENITH:Av});var di=new Map,rr=[],Pr=null,jE=null,ls=()=>{};function ZE(n){let e={pos:new I(0,.75,7.2),target:new I,fov:$e.fov,offsetY:0,roll:0};return{id:n,build:ls,pose:()=>e,enter:ls,exit:ls,arrive:ls,depart:ls,setSub:()=>0,update:ls,onGesture:()=>!1,onKey:()=>!1,resize:ls,dispose:ls,stub:!0}}function KE(n){let e=document.createElement("section");e.className="hall",e.dataset.room=n,e.hidden=!0;let t=document.getElementById("halls");return t&&t.appendChild(e),e}function JE(n,e,t,i){let r=be[n],s=Object.create(Pr);return s.id=n,s.meta=r,s.group=i,s.section=e,s.shell=t,s.toCanonical=(o,a)=>a.copy(o).add(r.anchor),s}function Rv(n,e){let t=KE(n),i=null,r=null;ue.tier!=="T0"&&et.root&&(i=new Bt,i.name=`hall:${n}`,i.position.copy(be[n].anchor),i.visible=!1,et.root.add(i),r=ov(n),i.add(r.group));let s=JE(n,t,r,i),o={id:n,hall:null,hctx:s,section:t,shell:r,group:i,shown:!1,dead:!1,throwArmed:jE===n};di.set(n,o),rr.push(o);try{o.hall=ue.tier==="T0"?ZE(n):e(s);let a=o.hall.build();a&&typeof a.then=="function"&&a.then(null,l=>Gp(n,l))}catch(a){return Gp(n,a),di.get(n)||null}return i&&(i.visible=!0),o}function Cv(n){n.dead=!0;try{n.hall&&n.hall.dispose()}catch(t){Rt(`hall:${n.id}`,`hall ${n.id} dispose failed`,t)}n.shell&&n.shell.dispose(),n.group&&n.group.parent&&n.group.parent.remove(n.group),n.section&&n.section.parentNode&&n.section.parentNode.removeChild(n.section),di.delete(n.id);let e=rr.indexOf(n);e>=0&&rr.splice(e,1)}function Gp(n,e){Rt(`hall:${n}`,`hall ${n} failed — recalled to CORE`,e);let t=di.get(n);t&&Cv(t);let i=Pr&&Pr.director;if(n==="CORE"){Rv("CORE",s=>_n(s,{props:"grid"}));let r=di.get("CORE");r&&ue.room==="CORE"&&(et.show("CORE",!0),r.hall&&kl(r,"enter",1));return}i&&Promise.resolve().then(()=>i.go("#/core",{source:"error"}))}function kl(n,e,t,i,r){if(!(!n||n.dead||!n.hall||typeof n.hall[e]!="function"))try{return n.hall[e](t,i,r)}catch(s){Gp(n.id,s);return}}function QE(n,e){for(let t=0;t<rr.length;t++){let i=rr[t];i.dead||!i.hall||kl(i,"update",n,e)}}var et={root:null,init(n){return Pr=n,n.scale&&n.scale.root&&!et.root&&(et.root=new Bt,et.root.name="halls",n.scale.root.add(et.root)),Ie.add(QE,un.WORLD),n.bus.on("layout:change",()=>{for(let e=0;e<rr.length;e++)kl(rr[e],"resize")}),et},ensure(n){be[n]||(n="CORE");let e=di.get(n)||Rv(n,Tv[n]||(t=>_n(t,{props:"grid"})));return e&&e.hall?e.hall:null},get(n){let e=di.get(n);return e&&!e.dead?e.hall:null},current(){return et.get(ue.room)},release(n){let e=di.get(n);if(!e||n===ue.room&&ue.phase!=="transition")return;let t=Pr&&Pr.director;t&&t.busy()&&t.state.to&&(t.state.to.room===n||t.logicalSource()===n)||Cv(e)},call(n,e,t,i,r){return kl(di.get(n),e,t,i,r)},shell(n){let e=di.get(n);return e?e.shell:null},group(n){let e=di.get(n);return e?e.group:null},residents(){return rr.map(n=>n.id)},restPose(n,e,t){let i=be[n]||be.CORE,r=di.get(i.id),s=r?kl(r,"pose",e||null):void 0;return s&&s.pos&&s.target?(t.pos.copy(s.pos).add(i.anchor),t.target.copy(s.target).add(i.anchor),t.fov=s.fov||$e.fov,t.offsetY=s.offsetY||0,t.roll=s.roll||0):i.id==="CORE"?(t.pos.fromArray($e.core.pos),t.target.fromArray($e.core.target),t.fov=$e.core.fov,t.offsetY=Pr&&Pr.layout&&Pr.layout.kind!=="desktop"?$e.core.phoneOffsetY:0,t.roll=0):(t.pos.set(0,i.alt+10,48),t.target.set(0,i.alt+12.5,0),t.fov=$e.fov,t.offsetY=0,t.roll=0),t},show(n,e=!1){for(let t=0;t<rr.length;t++){let i=rr[t];i.id===n?(i.shown=!0,i.section.hidden=!1):e&&(i.shown=!1,i.section.hidden=!0)}},hide(n){let e=di.get(n);e&&(e.shown=!1,e.section.hidden=!0)}};function sa(){return{cam:{pos:new I,target:new I,fov:35,offsetY:0,roll:0},s:1,pivot:new I,Q:new I,fog:.00485,fade:{mini:0,key:1,vin:1,parent:0},alt:0,exitU:0,enterU:0,speed01:0,pan:0,counter:0,flashCode:null,morph:{kind:"none",i:3,tMs:0,D:1},vinStrata:new Float32Array([1,1,1,1,1,1,1]),vinGap:.02,rim:1,pillar:1,shellFrom:1,shellTo:1,iris:{fromTop:0,fromBottom:0,toTop:0,toBottom:0},vel:new I}}function cs(n,e){return e.cam.pos.copy(n.cam.pos),e.cam.target.copy(n.cam.target),e.cam.fov=n.cam.fov,e.cam.offsetY=n.cam.offsetY,e.cam.roll=n.cam.roll,e.s=n.s,e.pivot.copy(n.pivot),e.Q.copy(n.Q),e.fog=n.fog,e.fade.mini=n.fade.mini,e.fade.key=n.fade.key,e.fade.vin=n.fade.vin,e.fade.parent=n.fade.parent,e.alt=n.alt,e.exitU=n.exitU,e.enterU=n.enterU,e.speed01=n.speed01,e.pan=n.pan,e.counter=n.counter,e.flashCode=n.flashCode,e.morph.kind=n.morph.kind,e.morph.i=n.morph.i,e.morph.tMs=n.morph.tMs,e.morph.D=n.morph.D,e.vinStrata.set(n.vinStrata),e.vinGap=n.vinGap,e.rim=n.rim,e.pillar=n.pillar,e.shellFrom=n.shellFrom,e.shellTo=n.shellTo,e.iris.fromTop=n.iris.fromTop,e.iris.fromBottom=n.iris.fromBottom,e.iris.toTop=n.iris.toTop,e.iris.toBottom=n.iris.toBottom,e.vel.copy(n.vel),e}function Vl(n,e){n.fade.mini=0,n.fade.key=1,n.fade.vin=1,n.fade.parent=0,n.morph.kind="none",n.vinStrata.fill(1),n.vinGap=.02,n.rim=e?1:0,n.pillar=1,n.shellFrom=1,n.shellTo=1,n.iris.fromTop=0,n.iris.fromBottom=0,n.iris.toTop=0,n.iris.toBottom=0,n.speed01=0,n.pan=0,n.counter=0,n.flashCode=null}var zl=1024,lf=new Float32Array(zl+1);for(let n=0;n<=zl;n++)lf[n]=Zt.camera(n/zl);function eA(n){if(n<=0)return 0;if(n>=1)return 1;let e=0,t=zl;for(;t-e>1;){let s=e+t>>1;lf[s]<n?e=s:t=s}let i=lf[e],r=lf[t];return(e+(r>i?(n-i)/(r-i):0))/zl}var us=(n,e)=>eA(n)*e,Ui=(n,e)=>Zt.camera(_t(n/e));function Yn(n,e,t,i){let r=Ui(e,i),s=Ui(t,i);return s<=r?n>=s?1:0:_t((n-r)/(s-r))}var $s=(n,e,t)=>Math.exp(Math.log(n)+(Math.log(e)-Math.log(n))*t),hs=n=>{let e=_t(n);return e*e*(3-2*e)};function Hp(n,e=7){let t=_t(n)*e,i=Math.floor(t);return i>=e?1:(i+hs((t-i)*3))/e}function cf(n,e){let t=[],i=[];for(let o=0;o<n.length;o++){if(t.length&&t[t.length-1].distanceToSquared(n[o])<1e-12){i[i.length-1]=e[o];continue}t.push(n[o].clone()),i.push(e[o])}t.length===1&&(t.push(t[0].clone()),i.push(i[0]+1e-6));let r=new qa(t,!1,"centripetal"),s=t.length-1;return{curve:r,points:t,knots:i,sample(o,a){if(o<=i[0])return a.copy(t[0]);if(o>=i[s])return a.copy(t[s]);let l=0;for(;l<s-1&&o>i[l+1];)l++;let c=i[l+1]-i[l],u=c>0?(o-i[l])/c:1;return r.getPoint((l+u)/s,a)}}}function Gl(n,e,t,i,r,s){return s.set(i.x+r.x*(t-e)+e*n.x,i.y+r.y*(t-e)+e*n.y,i.z+r.z*(t-e)+e*n.z)}function Wp(n,e,t){let i=1-n;return Math.abs(i)<1e-9?t.set(0,0,0):t.copy(e).multiplyScalar(1/i)}var Hl={restPose:null,faceFrame:null};function Lv(n){Object.assign(Hl,n||{})}function uf(n,e){let t={pos:new I,target:new I,fov:$e.fov,offsetY:0,roll:0};if(Hl.restPose)Hl.restPose(n,e||null,t);else{let i=be[n]||be.CORE;i.id==="CORE"?(t.pos.fromArray($e.core.pos),t.target.fromArray($e.core.target)):(t.pos.set(0,i.alt+10,48),t.target.set(0,i.alt+12.5,0))}return t}var Xp=n=>n==="WORKSHOP"?"MEMBERS":n==="ZENITH"?"SIGNAL":n;function Yp(n,e){let t=Xp(n),i=Xp(e);return t==="CORE"&&i!=="CORE"?"DIVE":i==="CORE"&&t!=="CORE"?"RECALL":"LIFT"}function Dv(n,e){let t=be[n]||be.CORE,i=be[e]||be.CORE;return Math.abs(t.stratum-i.stratum)}function Nv(n,e){let t=Dv(n,e);return t<=1?Ze.liftBase:Math.min(Ze.liftMax,Ze.liftBase+Ze.liftPerBoundary*(t-1))}function tA(n,e,t){return n==="DIVE"?Ze.dive:n==="RECALL"?Ze.recall:n==="SLICE"?Ze.slice:Nv(e,t)}function Fv(n,e,t,i,r=900,s=-1){i.set(0,0,0);let o=t.x-e.x,a=t.y-e.y,l=t.z-e.z,c=Math.sqrt(o*o+a*a+l*l),u=s>0?s:c;if(c<1e-9||c<$n.anticipationMinDisp*u)return i;let d=_t(n)*r,h=$n.anticipationMs,f=d<h?Zt.reveal(d/h):d<3*h?1-hs((d-h)/(2*h)):0,g=-($n.anticipationFrac*u*f)/c;return i.set(o*g,a*g,l*g)}function $p(n,e,t,i){n.exitU=_t(e/Ze.depart),n.enterU=i>=0?e<i?0:_t((e-i)/Math.max(1,t-i)):_t((e-(t-Ze.arrive))/Ze.arrive)}var qp=n=>Math.sin(Math.PI*_t(n));function Iv(n,e,t,i){let r=_t(n/120),s=Zt.camera(_t((n-120)/360)),o=n<120?1-wt.contract*Zt.camera(r):1-wt.contract*(1-nA(120,480,n)),a=Et(St.rest,St.dive,s);return i.copy(t).multiplyScalar(wt.diveSlide*s),i.y+=(3-e)*(a-St.rest),o}function nA(n,e,t){let i=_t((t-n)/(e-n));return i*i*(3-2*i)}function iA(n,e){let t=Mn[n],i=t.top+(t.bot-t.top)/3,r=t.top+(t.bot-t.top)*2/3,s=(qt(i)+qt(r))/2;return e.F.set(0,t.mid,s*Math.cos(Math.PI/t.n)),e.n.set(0,0,1),e}function jp(n,e,t={}){let i=Math.max(0,Math.min(6,e|0)),r=t.to||Lh(i).id,s=!!t.first&&!t.D,o=Math.max(0,Math.min(1100,t.tb0||0)),a=t.D||(s?Ze.diveFirst:Ze.dive-o),l=Ze.diveFirstScale,c=Ze.diveFirstHold,u=1e3*l,d=s?xe=>xe<u?xe/l:xe<u+c?1e3:(xe-c)/l:xe=>o+xe*(Ze.dive-o)/a,h=s?xe=>xe<1e3?xe*l:xe*l+c:xe=>(xe-o)*a/(Ze.dive-o),f=h(Ze.diveSwapAt),g=Ui(f,a),_=n.s,m=n.Q.clone(),p={F:new I,n:new I};Hl.faceFrame&&Math.abs(_-1)<1e-6&&m.lengthSq()<1e-12&&!t.D?Hl.faceFrame(i,p):iA(i,p);let S=p.F,b=p.n.normalize(),y=Math.hypot(S.x,S.z),A=Math.min(.3,.5*y),T=new I,R=Iv(o,i,b,T),x=b.clone().multiplyScalar(wt.diveSlide).add(S);x.y+=(3-i)*(St.dive-St.rest);let w=uf(r,t.sub),C=(be[r]||be.CORE).fog,D=n.cam.pos.clone().sub(m).multiplyScalar(1/(_*R)).sub(T),O=n.cam.target.clone().sub(m).multiplyScalar(1/(_*R)).sub(T),z=[D],N=[0],V=[O],Z=[0];D.distanceTo(S)>2.2&&o<480&&(z.push(S.clone().addScaledVector(b,2)),N.push(Ui(h(480),a))),o<700&&(z.push(S.clone().addScaledVector(b,.4)),N.push(Ui(h(700),a))),z.push(S.clone().addScaledVector(b,-A)),N.push(g),z.push(w.pos.clone().multiplyScalar(1/1e3)),N.push(1),o<480&&(V.push(S.clone()),Z.push(Ui(h(480),a))),V.push(S.clone().addScaledVector(b,-A-.6)),Z.push(g),V.push(w.target.clone().multiplyScalar(1/1e3)),Z.push(1);let K=cf(z,N),q=cf(V,Z),J=Math.max(0,h(Math.max(480,o))),te=n.cam.fov,Be=n.cam.offsetY,Le=n.cam.roll,dt=n.fog,ot=n.alt,rt=n.rim,Y=n.pillar,Q=n.fade.vin,ge=n.cam.pos.distanceTo(n.cam.target),qe=z[1].clone(),Se=o<480?Ui(h(480),a):-1,de=[];for(let xe=Math.max(o,860);xe<=1120;xe+=1e3/$m)de.push(Ui(h(xe),a));let pe=new I,Ae=new I,We=new I,xt=new I;return{kind:"DIVE",from:"CORE",to:r,duration:a,swapAt:g,swapKind:"grow",stratum:i,first:s,pose(xe,ye){let Qe=us(xe,a),Ft=d(Qe);if(Vl(ye,!1),xe<g){let Nt=Iv(Ft,i,b,xt),F=$s(_,1e3,Yn(xe,J,f,a));ye.s=F,ye.pivot.copy(x),ye.Q.copy(m).addScaledVector(x,_-F),K.sample(xe,pe).add(xt).multiplyScalar(Nt),Gl(pe,F,_,m,x,ye.cam.pos),o===0&&Qe<3*$n.anticipationMs&&(Fv(Qe/a,Ae.copy(D),qe,We,a,ge),ye.cam.pos.addScaledVector(We,F)),q.sample(xe,pe).add(xt).multiplyScalar(Nt),Gl(pe,F,_,m,x,ye.cam.target);let dn=Math.log(F/_)/Math.log(1e3/_);ye.fog=$s(dt,C,_t(dn));let ht=1-Yn(xe,J,f,a);ye.fade.vin=Q*ht,ye.rim=rt*ht,ye.pillar=Y*ht,ye.shellFrom=ht,ye.shellTo=0,ye.morph.kind="dive",ye.morph.i=i,ye.morph.tMs=s?Ft*l:Ft,ye.morph.D=s?Ze.diveFirst:Ze.dive}else{ye.s=1,ye.pivot.set(0,0,0),ye.Q.set(0,0,0),K.sample(xe,ye.cam.pos).multiplyScalar(1e3),q.sample(xe,ye.cam.target).multiplyScalar(1e3),ye.fog=C;let Nt=Yn(xe,f,a,a);for(let F=0;F<7;F++)ye.vinStrata[F]=F===i?1:Nt;ye.rim=0,ye.pillar=Nt,ye.shellFrom=0,ye.shellTo=Nt}let Dt=Yn(xe,f,a,a);return ye.cam.fov=Et(te,w.fov,Dt),ye.cam.offsetY=Et(Be,w.offsetY,Dt),ye.cam.roll=Et(Le,w.roll,Dt),ye.alt=Et(ot,(be[r]||be.CORE).alt,xe),$p(ye,Qe,a,f),ye.speed01=qp(Yn(xe,J*.5,f,a)),ye},cues(xe,ye,Qe){if(!(xe<=ye||!Qe||!Qe.audio)){Se>=0&&ye<Se&&xe>=Se&&Qe.audio.play("subDrop",{});for(let Ft=0;Ft<de.length;Ft++)if(ye<de[Ft]&&xe>=de[Ft]){Qe.audio.play("strutTick",{});break}}}}}function Zp(n,e,t={}){let i=t.D||Ze.recall,r=i/Ze.recall,s=Ze.recallSwapAt*r,o=Ze.depart*r,a=Ui(s,i),l=uf("CORE",null),c=n.s,u=n.Q.clone(),d=n.cam.pos.clone(),h=n.cam.target.clone(),f=1/1e3,g=d.clone().sub(l.pos).sub(u).multiplyScalar(1/(c-f)),_=l.target.clone(),m=n.cam.fov,p=n.cam.offsetY,S=n.cam.roll,b=n.fog,y=n.alt,A=n.rim,T=n.pillar,R=be.CORE.fog,x=new I;return{kind:"RECALL",from:e,to:"CORE",duration:i,swapAt:a,swapKind:"shrink",pose(w,C){let D=us(w,i);if(Vl(C,!1),w<a){let O=Yn(w,o,s,i),z=$s(c,f,O);C.s=z,C.pivot.copy(g),C.Q.copy(u).addScaledVector(g,c-z),C.cam.pos.copy(d),x.copy(_).multiplyScalar(z).add(C.Q),C.cam.target.copy(h).lerp(x,hs(Yn(w,o,s*.92,i))),C.cam.fov=Et(m,l.fov,O),C.cam.offsetY=Et(p,l.offsetY,O),C.cam.roll=Et(S,0,O),C.fog=$s(b,R,_t(Math.log(z/c)/Math.log(f/c))),C.fade.parent=Yn(w,s*.55,s,i),C.vinGap=Et(St.rest,St.recallStart,O),C.rim=A*(1-Yn(w,0,o,i)),C.pillar=T,C.shellFrom=1,C.shellTo=0}else{C.s=1,C.pivot.set(0,0,0),C.Q.set(0,0,0),C.cam.pos.copy(l.pos),C.cam.target.copy(l.target),C.cam.fov=l.fov,C.cam.offsetY=l.offsetY,C.cam.roll=0,C.fog=R;let O=Yn(w,s,i,i);C.rim=O,C.pillar=O,C.shellFrom=0,C.shellTo=O,C.morph.kind="recall",C.morph.i=3,C.morph.tMs=D/r,C.morph.D=Ze.recall}return C.alt=Et(y,0,w),$p(C,D,i,-1),C.speed01=qp(Yn(w,o,s,i)),C},cues(w,C,D){w<=C||!D||!D.audio||C<a&&w>=a&&D.audio.play("recallThud",{})}}}var Pv=n=>n==="WORKSHOP"?"MEMBERS":n,qs=["ZENITH","SIGNAL","ARCHIVE","MEMBERS","CORE","VOYAGES","INSIGNIA","NADIR"];function Kp(n,e,t,i={}){let r=i.D||Nv(e,t),s=n.s,o=n.Q.clone(),a=Wp(s,o,new I),l=n.cam.pos.clone().sub(o).multiplyScalar(1/s),c=n.cam.target.clone().sub(o).multiplyScalar(1/s),u=uf(t,i.sub),d=Dv(e,t),h=u.pos.y>l.y,f=h?1:-1,[g,,_]=on.liftOffset,m=[l];i.vel&&i.vel.length()/s>1&&m.push(l.clone().addScaledVector(i.vel,.12/s));let p=-1,S=-1;if(d>=1){let de=be[Pv(e)],pe=be[Pv(t)],Ae=h?de.ceil:de.floor,We=h?pe.floor:pe.ceil;!(Math.abs(l.x-g)<4&&Math.abs(l.z-_)<4)&&(Ae-l.y)*f>-5&&(m.push(new I(g,Ae,_)),p=m.length-1),p<0||Math.abs(We-Ae)>2?(m.push(new I(g,We,_)),S=m.length-1):S=p,p<0&&(p=S)}m.push(u.pos.clone());let b=[0],y=0;for(let de=1;de<m.length;de++)y+=m[de].distanceTo(m[de-1]),b.push(y);for(let de=0;de<b.length;de++)b[de]=y>0?b[de]/y:de/(b.length-1);let A=cf(m,b),T=p>=0?b[p]:.3,R=S>=0?b[S]:.7,x=n.cam.fov,w=n.cam.offsetY,C=n.cam.roll,D=n.fog,O={...n.fade},z=Float32Array.from(n.vinStrata),N=n.vinGap,V=n.rim,Z=i.shellFrom0!=null?i.shellFrom0:1,X=n.morph.kind==="dive"?{i:n.morph.i,tMs:n.morph.tMs,D:n.morph.D}:null,K=(be[t]||be.CORE).fog,q=n.cam.pos.distanceTo(n.cam.target),J=m[1].clone(),te=Math.min(qs.indexOf(e==="WORKSHOP"?"MEMBERS":e),qs.indexOf(t==="WORKSHOP"?"MEMBERS":t)),Be=Math.max(qs.indexOf(e==="WORKSHOP"?"MEMBERS":e),qs.indexOf(t==="WORKSHOP"?"MEMBERS":t)),Le=[],dt=[],ot=new I,rt=new I,Y=de=>{A.sample(0,ot);for(let pe=1;pe<=240;pe++){let Ae=pe/240;if(A.sample(Ae,rt),(ot.y-de)*(rt.y-de)<=0&&ot.y!==rt.y)return Ae-1/240*((rt.y-de)/(rt.y-ot.y));ot.copy(rt)}return-1};for(let de=te+1;de<Be;de++){let pe=be[qs[de]],Ae=Y(pe.alt);Ae>=0&&Le.push({room:pe.id,t0:us(Ae,r)})}for(let de=te;de<Be;de++){let pe=be[qs[de]],Ae=be[qs[de+1]],We=Y((pe.floor+Ae.ceil)/2);We>=0&&dt.push(We)}let Q=d>=1?[T,R]:[],ge=new I,qe=new I,Se=new I;return{kind:"LIFT",from:e,to:t,duration:r,swapAt:-1,swapKind:null,boundaries:d,pose(de,pe){let Ae=us(de,r);Vl(pe,!1);let We=$s(s,1,Yn(de,0,r*.5,r));pe.s=We,pe.pivot.copy(a),pe.Q.copy(o).addScaledVector(a,s-We),A.sample(de,ge);let xt=ge.y;Ae<3*$n.anticipationMs&&(Fv(Ae/r,l,J,qe,r,q),ge.add(qe)),Gl(ge,We,s,o,a,pe.cam.pos),d>=1?(Se.set(0,xt+f*30,0),ge.copy(c).lerp(Se,hs(T>0?de/T:1)),ge.lerp(u.target,hs(R<1?(de-R)/(1-R):0))):ge.copy(c).lerp(u.target,hs(de)),Gl(ge,We,s,o,a,pe.cam.target);let xe=hs(de);pe.cam.fov=Et(x,u.fov,xe),pe.cam.offsetY=Et(w,u.offsetY,xe),pe.cam.roll=Et(C,u.roll,xe),pe.fog=$s(D,K,xe);let ye=Yn(de,0,Ze.depart,r);pe.fade.mini=Et(O.mini,0,ye),pe.fade.key=Et(O.key,1,ye),pe.fade.vin=Et(O.vin,1,ye),pe.fade.parent=Et(O.parent,0,ye);for(let Qe=0;Qe<7;Qe++)pe.vinStrata[Qe]=Et(z[Qe],1,ye);if(pe.vinGap=Et(N,St.rest,ye),pe.rim=V*(1-ye),pe.shellFrom=Et(Z,1,ye),pe.shellTo=1,X&&(pe.morph.kind="dive",pe.morph.i=X.i,pe.morph.D=X.D,pe.morph.tMs=X.tMs*(1-Yn(de,0,r*.6,r))),d>=1){let Qe=Hp(Ae/Ze.depart),Ft=Ae<r-300?1:1-Hp((Ae-(r-300))/300);h?(pe.iris.fromTop=Qe,pe.iris.toBottom=Ft):(pe.iris.fromBottom=Qe,pe.iris.toTop=Ft),pe.counter=Ae>120&&Ae<r-240?.12:0}pe.alt=(pe.cam.pos.y-pe.Q.y)/We,pe.flashCode=null;for(let Qe=0;Qe<Le.length;Qe++)Ae>=Le[Qe].t0&&Ae<Le[Qe].t0+180&&(pe.flashCode=Le[Qe].room);return $p(pe,Ae,r,-1),pe.speed01=qp(de),pe.pan=0,pe},cues(de,pe,Ae){if(!(de<=pe||!Ae||!Ae.audio)){for(let We=0;We<Q.length;We++)pe<Q[We]&&de>=Q[We]&&Ae.audio.play("irisWhoosh",{});for(let We=0;We<dt.length;We++)pe<dt[We]&&de>=dt[We]&&Ae.audio.play("tick",{})}}}}function Ov(n,e){let t=Ze.slice,i=Ze.sliceSwap,r=e.room,s=cs(n,sa()),o=uf(r,e.sub),a=Wp(n.s,n.Q,new I),l=(be[r]||be.CORE).fog,c=Ui(i,t);return{kind:"SLICE",from:null,to:r,duration:t,swapAt:-1,swapKind:null,cutAt:c,pose(u,d){return us(u,t)<i?(cs(s,d),d.exitU=0,d.enterU=0,d.counter=0,d.flashCode=null,d):(Vl(d,r==="CORE"),d.s=1,d.pivot.copy(a),d.Q.set(0,0,0),d.cam.pos.copy(o.pos),d.cam.target.copy(o.target),d.cam.fov=o.fov,d.cam.offsetY=o.offsetY,d.cam.roll=o.roll,d.fog=l,d.alt=(be[r]||be.CORE).alt,d.shellFrom=0,d.shellTo=1,d.exitU=1,d.enterU=1,d)},cues(u,d,h){d<c&&u>=c&&h&&h.t0&&h.app&&h.app.tier==="T0"&&h.t0.show(e)}}}function Uv(n,e,t,i={}){let r=t.room,s=Yp(e,r),o=Math.max(Ze.retargetMin,Ze.retargetFactor*tA(s,e,r)),a;if(s==="DIVE"){let l=be[Xp(r)].stratum;a=jp(n,l,{to:r,sub:t.sub,D:o,tb0:n.s>1.0001?480:0})}else s==="RECALL"?a=Zp(n,e,{D:o}):a=Kp(n,e,r,{sub:t.sub,D:o,vel:n.vel,shellFrom0:i.shellFrom0});return a.retarget=!0,a.from=e,a}var Rn=sa(),rn=sa(),js=sa(),rm={pos:new I,target:new I,fov:35,offsetY:0,roll:0},hf={pos:new I,target:new I,fov:35,offsetY:0,roll:0},Jn={strata:new Float32Array([1,1,1,1,1,1,1]),gap:.02,rim:1,pillar:1,morph:"none"},je=null,Lr=null,Wl={},oa=null,Qp=0,em=0,pf=0,fs="forward",ff=0,Xl=0,tm=!1,nm=!1,Si=null,aa=null,Yl=-1,$l=null,jl="",ql=0,im=new Set,ce={phase:"idle",path:null,from:null,to:null,u:0,t:0,speed:1,scrubbing:!1,swapped:!1},Vv=(n,e)=>n&&typeof n[e]=="function",sn=(n,e,t,i,r)=>Vv(n,e)?n[e](t,i,r):void 0;function rA(n){let e=je.pillar;if(!e||Jn.pillar===n)return;Jn.pillar=n;let t=e.userData;if(t.ribbon&&t.ribbon.setAlpha(n),t.beads){t.beads.visible=n>.001;let i=t.beads.material;i.uniforms.uAlpha.value=n,i.transparent=n<.999}e.visible=n>.001}function sA(n){je.rim&&Jn.rim!==n&&(Jn.rim=n,je.rim.setAlpha(n))}function sm(n){if(!je.renderer)return;He.scaleAbout(n.s,n.pivot),Ee.setPose(n.cam),n.fog>=0&&Ji.set(n.fog),en.setFade(-1,n.fade.mini),en.setFade(0,n.fade.key),en.setFade(1,n.fade.vin),en.setFade(2,n.fade.parent);let e=en.structure(1);if(e){for(let r=0;r<7;r++)Jn.strata[r]!==n.vinStrata[r]&&(Jn.strata[r]=n.vinStrata[r],e.setStratumFade(r,n.vinStrata[r]));Jn.gap!==n.vinGap&&(Jn.gap=n.vinGap,e.setGap(n.vinGap))}je.key&&(n.morph.kind!=="none"?je.key.setMorph(n.morph.kind,n.morph.i,n.morph.tMs,n.morph.D):Jn.morph!=="none"&&je.key.setMorph("none",3,0,1),Jn.morph=n.morph.kind),sA(n.rim),rA(n.pillar);let t=ce.to?et.shell(ce.to.room):null,i=Si?et.shell(Si):null;i&&i!==t&&(i.setAlpha(n.shellFrom),i.setIris("top",n.iris.fromTop),i.setIris("bottom",n.iris.fromBottom)),t&&(t.setAlpha(n.shellTo),t.setIris("top",n.iris.toTop),t.setIris("bottom",n.iris.toBottom))}function oA(){aA(rn),je.renderer&&(rn.cam.pos.copy(Ee.pose.pos),rn.cam.target.copy(Ee.pose.target),rn.cam.fov=Ee.pose.fov,rn.cam.offsetY=Ee.pose.offsetY,rn.cam.roll=Ee.pose.roll,rn.s=He.s,rn.Q.copy(He.Q),He.fixedPoint(rn.pivot),rn.fog=Ji.density,rn.fade.mini=en.fade(-1),rn.fade.key=en.fade(0),rn.fade.vin=en.fade(1),rn.fade.parent=en.fade(2),rn.vel.copy(Ee.velocity)),rn.alt=fn.altitude()}function aA(n){n.vinStrata.set(Jn.strata),n.vinGap=Jn.gap,n.rim=Jn.rim,n.pillar=Jn.pillar,n.morph.kind="none",n.exitU=0,n.enterU=0,n.counter=0,n.flashCode=null,n.shellFrom=1,n.shellTo=0,n.iris.fromTop=n.iris.fromBottom=n.iris.toTop=n.iris.toBottom=0}function la(){let n=fn.current||{room:"CORE",sub:null};et.restPose(n.room,n.sub,rm)}function lA(n){om();let e=n==="LIFT"?"liftRumble":n==="DIVE"||n==="RECALL"?"whoosh":null;e&&je.audio&&(aa=je.audio.start(e,{speed01:0}))}function om(){if(aa){try{aa.stop()}catch{}aa=null}}function cA(){let n=document.getElementById("fx");if(!n)return;let e=document.createElement("i");e.className="slice",n.appendChild(e),Kn(Ze.slice+40,()=>{e.parentNode&&e.parentNode.removeChild(e)})}function Gv(n,e,t,i){if(tn.reducedMotion||ue.tier==="T0")return Ov(n,t);if(i)return Uv(n,i,t,{shellFrom0:n.shellTo});let s=et.get(t.room);if(Vv(s,"entryPath")){let a=et.call(t.room,"entryPath",e.room,n);if(a)return a}let o=Yp(e.room,t.room);if(o==="DIVE"){let a=t.room==="WORKSHOP"?"MEMBERS":t.room==="ZENITH"?"SIGNAL":t.room;return jp(n,be[a].stratum,{first:!(se.data&&se.data.firstDive),fromUnfold:!!ue.unfolded,sub:t.sub,to:t.room})}return o==="RECALL"?Zp(n,e.room):Kp(n,e.room,t.room,{sub:t.sub})}function Hv(n,e,t,i){ce.path=n,ce.from=e,ce.to=t,ce.t=0,ce.u=0,ce.speed=1,ce.swapped=!1,ce.phase="transition",ce.scrubbing=!!i.scrub,Xl=0,fs="forward",Qp=0,em=Ie.now,pf=Ie.now,tm=!1,oa=null,nm=!0,Wl=i,ue.u=0,n.kind==="SLICE"&&cA(),lA(n.kind),Oe.emit("travel:start",{from:e,to:t,kind:n.kind,duration:n.duration})}function Wv(n){let e=et.group(n);if(!(!e||!je.renderer||!Ee.camera))try{je.renderer.three.compile(e,Ee.camera,je.scene)}catch{}}function Bv(n,e){let t=fn.current;oA(),et.ensure(n.room),Wv(n.room),Si=t.room;let i=Gv(rn,t,n,null);return lr("transition"),et.call(t.room,"depart"),sn(je.datum,"depart"),je.renderer&&en.setHallLod(null),Oe.emit("room:depart",{room:t.room,to:n}),Hv(i,t,n,e),new Promise(r=>{Lr=r})}function Xv(){let n=ce.path;if(!n)return ue.room;let e=Si||ce.from&&ce.from.room||ue.room,t=ce.to.room;if(n.swapAt>=0)return ce.swapped?t:e;if(n.kind==="SLICE")return ce.u>=(n.cutAt||.5)?t:e;if(n.kind!=="LIFT")return ce.u<.5?e:t;let i=rn.alt;for(let o of[e,t]){let a=be[o];if(a&&i>=a.floor&&i<=a.ceil)return o}let r=e,s=1/0;for(let o of Jr.concat(["ZENITH"])){let a=be[o],l=i<a.floor?a.floor-i:i>a.ceil?i-a.ceil:0;l<s&&(s=l,r=o)}return r}function uA(n,e){let t=Xv(),i=ce.to.room,r=Si;if(Lr){let a=Lr;Lr=null,a(!1)}Oe.emit("travel:end",{from:ce.from,to:ce.to,kind:ce.path.kind,completed:!1}),t===i&&i!==n.room&&(et.call(i,"depart"),et.call(i,"exit",1)),Si=t,et.ensure(n.room),Wv(n.room);for(let a of et.residents())a!==n.room&&a!==t&&a!==r&&et.release(a);r&&r!==t&&r!==n.room&&(et.call(r,"exit",1),am(r)),cs(rn,js),je.renderer&&(js.vel.copy(Ee.velocity),js.Q.copy(He.Q),js.s=He.s);let s={room:t,sub:null,hash:`#/${be[t].slug}`},o=Gv(js,s,n,t);return oa=null,Hv(o,s,n,e),new Promise(a=>{Lr=a})}function am(n){Kn(Ze.releaseSourceMs,()=>{n===ue.room&&ce.phase!=="transition"||ce.phase==="transition"&&(ce.to.room===n||Si===n)||et.release(n)})}function lm(n,e,t){let i=n.hash;try{let r=location.hash;e==="history"?r!==i&&!(r===""&&i==="#/core")&&window.history.replaceState(null,"",i):t||e==="hash"||e==="go"||e==="deeplink"||r===i?window.history.replaceState(null,"",i):window.history.pushState(null,"",i)}catch{}jl=location.hash}function hA(){let n=ce.path,e=ce.from,t=ce.to;n.pose(1,Rn),sm(Rn),cs(Rn,rn),om();let i=!im.has(t.room);im.add(t.room),ql+=1,ue.room=t.room,ue.route=t,ue.u=0,fn.current=t,ce.phase="idle",ce.scrubbing=!1,ce.u=0;let r=n.kind;je.renderer&&en.setHallLod(t.room),et.show(t.room,!0),et.call(t.room,"enter",1),lr("idle"),et.call(t.room,"arrive",{first:i,sub:t.sub,kind:r,arrivals:ql});let s=t;t.sub&&et.call(t.room,"setSub",t.sub,{instant:!0})===!1&&(s=er(`#/${be[t.room].slug}`),fn.current=s,ue.route=s,Wl={...Wl,replace:!0}),sn(je.datum,"counter",be[t.room].alt,0),sn(je.datum,"flashCode",null),sn(je.datum,"arrive",t.room),sn(je.chrome,"setRoom",t.room),sn(je.keyNav,"setNeedle",be[t.room].alt),sn(je.keyNav,"setCurrent",t.room),sn(je.keyNav,"lockTwin"),je.audio&&je.audio.play("arrivalLock",{root:be[t.room].root}),sn(je.edges,"twitch"),Ge.isPhone&&ns(ts.lock),document.title=Al(s),lm(s,Wl.source,!!Wl.replace),se.set("lastRoom",s.hash),r==="DIVE"&&se.data&&!se.data.firstDive&&se.set("firstDive",!0),la(),fn.lastTravel={kind:r,from:e.hash,to:s.hash,plannedMs:n.duration,ms:Ie.now-pf,completed:!0},ce.path=null,Oe.emit("room:arrive",{room:t.room,sub:s.sub,first:i,kind:r,arrivals:ql}),Oe.emit("route:change",{route:s,prev:e}),Oe.emit("travel:end",{from:e,to:s,kind:r,completed:!0}),ue.tier==="T0"&&je.t0&&sn(je.t0,"show",s);for(let a of et.residents())a!==t.room&&am(a);let o=Lr;Lr=null,o&&o(!0)}function fA(){let n=ce.path,e=ce.from,t=ce.to;n.pose(0,Rn),sm(Rn),cs(Rn,rn),om(),ce.phase="idle",ce.scrubbing=!1,ce.u=0,ue.u=0;let i=Si||e.room;je.renderer&&en.setHallLod(i),et.call(i,"exit",0),et.show(i,!0),lr("idle"),et.call(i,"arrive",{first:!1,sub:fn.current.sub,kind:"REVERT",arrivals:ql}),sn(je.datum,"counter",be[i].alt,0),sn(je.datum,"arrive",i),sn(je.keyNav,"setNeedle",be[i].alt),sn(je.keyNav,"setCurrent",i),fn.lastTravel={kind:n.kind,from:e.hash,to:t.hash,plannedMs:n.duration,ms:Ie.now-pf,completed:!1},ce.path=null,Oe.emit("travel:end",{from:e,to:t,kind:n.kind,completed:!1}),t.room!==i&&am(t.room),la();let r=Lr;Lr=null,r&&r(!1)}var Jp={speed01:0,pan:0};function kv(n){let e=ce.path;e.swapAt>=0&&(!ce.swapped&&n>=e.swapAt?(je.renderer&&(e.pose(Math.max(0,e.swapAt-1e-6),js),He.scaleAbout(e.swapKind==="grow"?1e3:.001,js.pivot),oa=He.rebase(e.swapKind)),ce.swapped=!0):ce.swapped&&n<e.swapAt&&(oa&&je.renderer&&He.unrebase(oa),oa=null,ce.swapped=!1)),e.pose(n,Rn),sm(Rn),Si&&Si!==ce.to.room&&et.call(Si,"exit",Rn.exitU),et.call(ce.to.room,"enter",Rn.enterU),sn(je.keyNav,"setNeedle",Rn.alt),je.audio&&je.audio.setRootU(ce.from.room,ce.to.room,n),sn(je.datum,"counter",Rn.alt,Rn.counter),sn(je.datum,"flashCode",Rn.flashCode),aa&&(Jp.speed01=Rn.speed01,Jp.pan=Rn.pan,aa.set(Jp)),e.cues&&e.cues(n,Qp,je),!tm&&n>=Ze.interactiveU&&(tm=!0,et.show(ce.to.room),Oe.emit("travel:interactive",{to:ce.to})),ue.u=n,ce.u=n,Qp=n,cs(Rn,rn)}function dA(n){if(!je.renderer||ue.phase==="boot"||ue.phase==="start")return;let e=ue.room,t=et.get(e);if(t&&typeof t.livePose=="function"&&et.call(e,"livePose",hf,n)===!0){let i=be[e].anchor;hf.pos.add(i),hf.target.add(i),Ee.setPose(hf);return}Ee.setPose(rm)}function pA(n){let e=Ie.now,t=e-em;if(em=e,nm&&(t=0,nm=!1,pf=e),ce.phase!=="transition"){dA(n);return}let i=ce.path.duration,r;if(ce.scrubbing)r=Xl;else if(fs==="inertia")r=_t(ce.u+ff*t/1e3),ff*=Math.pow($n.inertiaDecay,t/$n.frameMs),(Math.abs(ff)<.05||r<=0||r>=1)&&(fs=r<.5?"reverse":"forward",ce.t=us(r,i));else if(fs==="reverse"){if(ce.t=Math.max(0,ce.t-t*ce.speed),r=Zt.camera(ce.t/i),ce.t<=0){kv(0),fA();return}}else ce.t=Math.min(i,ce.t+t*ce.speed),r=Zt.camera(ce.t/i);kv(r),!ce.scrubbing&&fs==="forward"&&ce.t>=i&&hA()}function df(){if(Yl>=0&&(rx(Yl),Yl=-1),$l){let n=$l;$l=null,n(!1)}}function zv(n,e,t){fn.current=n,ue.route=n,lm(n,t.source,!!t.replace),document.title=Al(n),se.set("lastRoom",n.hash),la(),Oe.emit("route:change",{route:n,prev:e}),ue.tier==="T0"&&je.t0&&sn(je.t0,"show",n)}function mA(n,e){df();let t=fn.current,i=et.call(n.room,"setSub",n.sub,{instant:tn.reducedMotion});if(i===!1||i===void 0){let r=er(`#/${be[n.room].slug}`);return t.sub&&et.call(n.room,"setSub",null,{instant:!0}),zv(r,t,{...e,replace:!0}),Promise.resolve(!0)}return new Promise(r=>{$l=r,Yl=Kn(Math.max(0,+i||0),()=>{Yl=-1,$l=null,zv(n,t,e),r(!0)})})}function gA(n){return ce.phase==="transition"?!1:et.call(ue.room,"onGesture",n)===!0}function xA(n){return ce.phase!=="transition"?!1:(ce.scrubbing||ce.u>=Ze.interactiveU&&et.call(ce.to.room,"onGesture",n)===!0||n.type==="tap"&&fn.speedUp(),!0)}function vA(){jl=location.hash,fn.go(location.hash,{source:"history"})}function yA(){location.hash!==jl&&(jl=location.hash,fn.go(location.hash,{source:"hash"}))}var fn={state:ce,current:null,lastTravel:null,init(n){return je=n,n.director=fn,n.halls=et,Lv({restPose:(e,t,i)=>et.restPose(e,t,i),faceFrame:n.key?(e,t)=>n.key.faceFrame(e,t):null}),fn.current=er("#/core"),ue.room="CORE",ue.route=fn.current,im.add("CORE"),jl=location.hash,Ie.add(pA,un.DIRECTOR),Yt.push({name:"hall",onGesture:gA}),Yt.push({name:"director",onGesture:xA}),window.addEventListener("popstate",vA),window.addEventListener("hashchange",yA),Oe.on("layout:change",la),et.ensure("CORE"),et.show("CORE",!0),la(),n.renderer&&ue.phase!=="boot"&&ue.phase!=="start"&&Ee.setPose(rm),fn},settle(){ce.phase==="transition"||ue.room!=="CORE"||(la(),et.call("CORE","enter",1),et.call("CORE","arrive",{first:!0,sub:null,kind:"BOOT",arrivals:ql}),sn(je.chrome,"setRoom","CORE"),sn(je.keyNav,"setCurrent","CORE"),sn(je.keyNav,"setNeedle",0))},go(n,e={}){try{let t=e.source||"go",i={...e,source:t},r=Mp(er(n),t);r.status&&sn(je.status,"say",r.status,r.vars||{}),r.shudder&&(sn(je.keyNav,"shudder",r.shudder),ue.room==="CORE"&&ce.phase!=="transition"&&je.key&&je.key.shudder(6));let s=r.route;if(ce.phase==="transition")return s.hash===ce.to.hash?new Promise(a=>{Oe.once("travel:end",l=>a(!!l.completed))}):(df(),uA(s,i));let o=fn.current;return s.hash===o.hash?(df(),location.hash&&location.hash!==s.hash&&lm(s,"history",!0),Promise.resolve(!0)):s.room===o.room?mA(s,i):(df(),Bv(s,i))}catch{return Promise.resolve(!1)}},speedUp(){ce.phase==="transition"&&!ce.scrubbing&&fs==="forward"&&(ce.speed=Ze.skipSpeed)},scrub:{begin(n){if(tn.reducedMotion||ue.tier==="T0"||!je.renderer)return!1;if(ce.phase==="transition")return ce.scrubbing=!0,Xl=ce.u,fs="forward",!0;let e=Mp(er(n),"nav").route;return e.room===fn.current.room?!1:(Bv(e,{source:"nav",scrub:!0}),!0)},set(n){ce.phase==="transition"&&ce.scrubbing&&(Xl=_t(n))},end(n=0){ce.phase!=="transition"||!ce.scrubbing||(ce.scrubbing=!1,ce.u=Xl,ce.speed=1,ff=n||0,fs="inertia")}},altitude(){return ce.phase==="transition"?rn.alt:(be[ue.room]||be.CORE).alt},busy(){return ce.phase==="transition"},logicalSource(){return ce.phase==="transition"?Si:null},logicalRoom(){return ce.phase==="transition"?Xv():ue.room}};var cm=0;function _A(n,e){let t=e==null?n.textContent:String(e);n.textContent="";let i=[];for(let r of t){let s=document.createElement("span");s.className="lock-letter",s.textContent=r,n.appendChild(s),i.push(s)}return i}function MA(n,e){return n.style.opacity="0",ci(e,t=>{n.style.opacity=String(t)},Zt.reveal).done.then(()=>{n.style.opacity=""})}function Yv(n,e={}){if(!n)return Promise.resolve();let t=e.weight||220,i=e.ms||Ze.lockIn;if(tn.reducedMotion)return MA(n,Ze.lockInReduced);if(cm>=2)return Promise.resolve();cm+=1;let r=n.textContent,s=_A(n,r),o=se.shrp||28,a=l=>{let c=Zt.reveal(l),u=`"SHRP" ${(o*c).toFixed(1)}, "wght" ${Math.round(120+(t-120)*c)}, "CRSV" 0, "slnt" 0`,d=Ie.now/1e3;for(let h=0;h<s.length;h++){let f=s[h].style;f.fontVariationSettings=u,f.transform=c<1?`translateY(${(Math.sin(17*d+h)*(1-c)*4).toFixed(2)}px)`:""}};return a(0),ci(i,a).done.then(()=>{cm-=1,n.textContent===r&&(n.textContent=r)})}var Je={datum:null,line:null,label:null,title:null,level:null,flash:null,giant:null},dm=null,um=!1,Zl="CORE",Kl=!1,$v=null,mf="",pm=0,qv=new I,jv=new I,Zv=new I,mm=!1;function ca(n,e,t,i){let r=document.createElement(n);return r.id=e,t&&(r.className=t),i.appendChild(r),r}function hm(){return dm??(be[Zl]||be.CORE).giant}function fm(n){Je.giant&&Je.giant.textContent!==n&&(Je.giant.textContent=n)}function SA(){if(!Je.giant||!Ee.camera||Kl)return;mm||(qv.copy(Ee.camera.position),mm=!0),jv.setFromMatrixColumn(Ee.camera.matrixWorld,0);let n=Math.max(.001,Zv.copy(Ee.pose.target).sub(Ee.camera.position).length()),e=Zv.copy(Ee.camera.position).sub(qv).dot(jv)*Ee.camera.zoom*(Ge.h/(2*Math.tan(Ee.camera.fov*Math.PI/360)))/n,t=Math.max(-200,Math.min(200,-.25*e));Math.abs(t-pm)<.25||(pm=t,Je.giant.style.transform=`translate3d(${t.toFixed(1)}px,-50%,0)`)}var Jl={init(n){let e=document.getElementById("frame");return Je.giant=document.getElementById("giant"),e&&(Je.datum=document.getElementById("datum")||ca("div","datum","",e),Je.datum.classList.add("is-out"),Je.line=ca("i","datum-line","",Je.datum),Je.label=ca("p","datum-label","t-label",Je.datum),Je.title=ca("h1","datum-title","t-display",Je.datum),Je.level=ca("p","datum-level","t-micro",Je.datum),Je.flash=ca("p","datum-flash","t-label",e),Je.flash.setAttribute("aria-hidden","true"),Ie.add(SA,un.UI)),Jl},arrive(n,e={}){Zl=be[n]?n:"CORE";let t=be[Zl];if(!Je.datum)return;let i=Zl==="NADIR"&&se.data&&se.data.nadirOpen;Je.title.textContent=i&&t.titleOpen?t.titleOpen:t.title,Je.title.dataset.room=Zl,Je.label.textContent=`${t.num} · ${t.code}`,Je.level.textContent=`▽ ${t.level}`,Je.datum.classList.remove("is-out"),Je.datum.classList.remove("is-drawn");let r=()=>{Je.datum.classList.add("is-drawn")};e.instant?r():requestAnimationFrame(r),e.instant||Yv(Je.title,{weight:220,ms:480}),Kl=!1,mf="",mm=!1,pm=0,Je.giant&&(Je.giant.classList.remove("is-counter"),Je.giant.style.transform="",fm(hm()),Je.giant.classList.add("is-in"),um?Je.giant.dataset.electrum="":delete Je.giant.dataset.electrum)},depart(){Je.datum&&Je.datum.classList.add("is-out"),Je.giant&&Je.giant.classList.remove("is-in")},setGiant(n,e={}){dm=n==null?null:String(n),um=!!e.electrum,!(!Je.giant||Kl)&&(fm(hm()),um?Je.giant.dataset.electrum="":delete Je.giant.dataset.electrum)},counter(n,e){if(!Je.giant)return;let t=e>0;if(t!==Kl&&(Kl=t,Je.giant.classList.toggle("is-counter",t),t?Je.giant.style.transform="":(mf="",fm(hm()))),!t)return;let i=jm(Math.round(n),0);i!==mf&&(mf=i,Je.giant.textContent=i)},flashCode(n){if(!(!Je.flash||n===$v))if($v=n,n&&be[n]){let e=be[n];Je.flash.textContent=`${e.num} · ${e.code}`,Je.flash.classList.add("is-on")}else Je.flash.classList.remove("is-on")},yPx(){return Ge.kind==="desktop"?Ge.h*ti.desktop.datumFrac:ti.phone.datumPx+Ge.safe.t},setVisible(n){Je.datum&&(Je.datum.hidden=!n),Je.giant&&(Je.giant.hidden=!n)}};var ty="http://www.w3.org/2000/svg",bi=[],Zs=null,gf=null,gm=new I,xm=new I,ua={x:0,y:0,depth:0,visible:!1},Kv=0;function Jv(n,e,t){let i=document.createElementNS(ty,n);return i.setAttribute("class",e),i.dataset.owner=t,i}var Qv=n=>`${n<0?"−":n>0?"+":""}${Math.abs(n).toFixed(2)}`;function bA(n){let e=n.leader||(n.focused?{side:"right",len:40,rise:-24}:null);if(!e||!n.path)return;let t=e.side==="left"?-1:1,i=e.rise||0,r=n.sx+t*Math.abs(i),s=n.sy+i,o=r+t*Math.max(ti.leader.elbowMin,Math.min(ti.leader.runMax,e.len||40));n.path.setAttribute("d",`M${n.sx.toFixed(1)} ${n.sy.toFixed(1)}L${r.toFixed(1)} ${s.toFixed(1)}L${o.toFixed(1)} ${s.toFixed(1)}`),n.endX=o+t*6,n.endY=s}function Ql(n,e){if(n.shown===e)return;n.shown=e;let t=e&&(n.el||n.focused);n.el&&n.el.classList.toggle("is-hidden",!e),n.button&&n.button.classList.toggle("is-hidden",!e),n.path&&n.path.classList.toggle("is-hidden",!(t&&(n.leader||n.focused))),n.cross&&n.cross.classList.toggle("is-hidden",!(t&&(n.crossOn||n.focused))),n.coordEl&&n.coordEl.classList.toggle("is-hidden",!(e&&n.coordOn))}function ey(n){let e=n.shown;n.shown=!e,Ql(n,e)}function wA(n){if(!Ee.camera)return;let e=1-Math.exp(-(n*1e3)/120),t=Ie.now-Kv>=1e3/Ze.coordHz;t&&(Kv=Ie.now);let i=0;for(let s=0;s<bi.length;s++){let o=bi[s];o.get(gm),Ee.project(gm,ua);let a=ua.depth>0||!o.hideBehind;if(o.want=o.visible&&a,!!o.want){if(i++,!o.init||o.lowpass<=0)o.sx=ua.x,o.sy=ua.y,o.init=!0;else{let l=o.lowpass===120?e:1-Math.exp(-(n*1e3)/o.lowpass);o.sx+=(ua.x-o.sx)*l,o.sy+=(ua.y-o.sy)*l}o.screen.x=o.sx,o.screen.y=o.sy,t&&o.coordEl&&(He.toCanonical(gm,xm),o.coordEl.textContent=`x ${Qv(xm.x)} · y ${Qv(xm.y)}`)}}let r=-1/0;if(i>Bi.max){let s=[];for(let o of bi)o.want&&s.push(o.priority);s.sort((o,a)=>a-o),r=s[Bi.max-1]}Bi.visibleCount=0;for(let s=0;s<bi.length;s++){let o=bi[s],a=o.want&&(o.priority>=r||o.focused);if(o.screen.visible=a,Ql(o,a),!a||(Bi.visibleCount++,Math.abs(o.sx-o.wx)<.1&&Math.abs(o.sy-o.wy)<.1))continue;o.wx=o.sx,o.wy=o.sy;let l=o.sx.toFixed(1),c=o.sy.toFixed(1);if(o.button&&(o.button.style.transform=`translate3d(${l}px,${c}px,0)`),o.cross&&o.cross.setAttribute("transform",`translate(${l} ${c})`),o.coordEl&&(o.coordEl.style.transform=`translate3d(${(o.sx+8).toFixed(1)}px,${(o.sy+6).toFixed(1)}px,0)`),bA(o),o.el){let u=o.path&&(o.leader||o.focused)?o.endX:o.sx,d=o.path&&(o.leader||o.focused)?o.endY:o.sy,h=o.leader&&o.leader.side==="left";o.el.style.transform=`translate3d(${u.toFixed(1)}px,${d.toFixed(1)}px,0) translate(${h?"-100%":"0"},-50%)`}}}var Bi={max:24,visibleCount:0,init(n){Zs=document.getElementById("overlay"),gf=document.getElementById("leaders");let e=()=>n.app.tier==="T1"||Ge.isPhone?ti.leader.maxAnchorsLow:ti.leader.maxAnchors;return Bi.max=e(),n.bus.on("tier:change",()=>{Bi.max=e()}),n.bus.on("layout:change",()=>{Bi.max=e();for(let t of bi)t.wx=NaN}),Ie.add(wA,un.OVERLAY),Bi},add(n){let e=String(n.owner||"anon"),t={owner:e,id:n.id!=null?String(n.id):null,get:n.get,leader:n.leader||null,crossOn:n.cross!=null?!!n.cross:!!n.leader,coordOn:!!n.coord,priority:n.priority||0,lowpass:n.lowpass!=null?n.lowpass:Ze.labelLowpass,hideBehind:n.hideBehind!==!1,visible:!0,want:!1,shown:!0,focused:!1,init:!1,sx:0,sy:0,wx:NaN,wy:NaN,endX:0,endY:0,screen:{x:0,y:0,visible:!1},el:n.el||null,button:null,path:null,cross:null,coordEl:null};if(t.el&&(t.el.classList.add("anchor"),n.scrim!==!1&&t.el.classList.add("scrim"),t.el.dataset.owner=e,t.id&&(t.el.dataset.id=t.id),Zs&&Zs.appendChild(t.el)),gf){t.path=Jv("path","leader",e),t.path.setAttribute("pathLength","1"),t.cross=Jv("g","cross",e);for(let[s,o,a,l]of[[-3.5,0,3.5,0],[0,-3.5,0,3.5]]){let c=document.createElementNS(ty,"line");c.setAttribute("x1",s),c.setAttribute("y1",o),c.setAttribute("x2",a),c.setAttribute("y2",l),t.cross.appendChild(c)}gf.appendChild(t.path),gf.appendChild(t.cross)}t.coordOn&&Zs&&(t.coordEl=document.createElement("span"),t.coordEl.className="t-micro coord",Zs.appendChild(t.coordEl));let i=s=>{t.focused=s,t.cross&&t.cross.classList.toggle("focus",s),t.path&&t.path.classList.toggle("focus",s),t.wx=NaN,ey(t)};if(n.button&&Zs){let s=document.createElement("button");s.type="button",s.className="proxy",s.dataset.owner=e,t.id&&(s.dataset.id=t.id),s.setAttribute("aria-label",n.button.label||""),n.button.size&&n.button.size>44&&(s.style.width=`${n.button.size}px`,s.style.height=`${n.button.size}px`,s.style.margin=`${-n.button.size/2}px 0 0 ${-n.button.size/2}px`);let o=n.button;s.addEventListener("click",()=>{typeof t.onActivate=="function"&&t.onActivate()}),s.addEventListener("focus",()=>{i(!0),t.onFocus&&t.onFocus()}),s.addEventListener("blur",()=>{i(!1),t.onBlur&&t.onBlur()}),t.onActivate=o.onActivate,t.onFocus=o.onFocus||null,t.onBlur=o.onBlur||null,Zs.appendChild(s),t.button=s}t.shown=!1,Ql(t,!1),Ql(t,!0),bi.push(t);let r={el:t.el,button:t.button,screen:t.screen,setVisible(s){t.visible=!!s,s||Ql(t,!1)},setAlpha(s){let o=String(Math.max(0,Math.min(1,s)));t.el&&(t.el.style.opacity=o),t.path&&(t.path.style.opacity=o)},drawIn(s=Ze.leaderDraw){return t.el&&t.el.classList.add("is-pending"),t.path&&(t.path.classList.remove("is-drawing"),t.path.style.strokeDasharray="1",t.path.style.strokeDashoffset="1"),new Promise(o=>{requestAnimationFrame(()=>{t.path&&(t.path.classList.add("is-drawing"),t.path.style.transitionDuration=`${s}ms`,t.path.style.strokeDashoffset="0"),Kn(s,()=>{t.el&&t.el.classList.remove("is-pending"),o()})})})},update(s){"leader"in s&&(t.leader=s.leader||null),"cross"in s&&(t.crossOn=!!s.cross),"coord"in s&&(t.coordOn=!!s.coord),s.button&&t.button&&(s.button.label!=null&&t.button.setAttribute("aria-label",s.button.label),s.button.onActivate&&(t.onActivate=s.button.onActivate)),"priority"in s&&(t.priority=s.priority||0),t.wx=NaN,ey(t)},remove(){let s=bi.indexOf(t);s>=0&&bi.splice(s,1);for(let o of[t.el,t.button,t.path,t.cross,t.coordEl])o&&o.parentNode&&o.parentNode.removeChild(o)}};return t.api=r,r},clear(n){for(let e=bi.length-1;e>=0;e--)bi[e].owner===n&&bi[e].api.remove()}};var ym=new Set,xn=null,vm=null,ha=null,sr=null,Kt={id:-1,y0:0,t0:0,y:0,t:0,h:0,base:0,moved:!1};function fa(n){if(wi.state!==n){wi.state=n,xn&&(xn.dataset.state=n);for(let e of ym)try{e(n)}catch{}}}function EA(n,e){return n==="full"?0:n==="peek"?Math.max(0,e-120):e}function AA(n){if(wi.state==="closed"||Kt.id>=0||Ge.kind==="phone-land"||wi.state==="full"&&sr&&sr.contains(n.target)&&sr.scrollTop>0)return;let e=xn.getBoundingClientRect();Kt.id=n.pointerId,Kt.y0=Kt.y=n.clientY,Kt.t0=Kt.t=n.timeStamp,Kt.h=e.height,Kt.base=EA(wi.state,e.height),Kt.moved=!1}function TA(n){if(n.pointerId!==Kt.id)return;let e=n.clientY-Kt.y0;if(!Kt.moved&&Math.abs(e)<Fi.SLOP_PX)return;if(!Kt.moved){Kt.moved=!0,xn.classList.add("is-dragging");try{xn.setPointerCapture(n.pointerId)}catch{}}Kt.y=n.clientY,Kt.t=n.timeStamp;let t=Math.max(0,Math.min(Kt.h,Kt.base+e));xn.style.transform=`translateY(${t.toFixed(1)}px)`}function ny(n){if(n.pointerId!==Kt.id||(Kt.id=-1,!Kt.moved))return;xn.classList.remove("is-dragging"),xn.style.transform="";let e=Kt.y-Kt.y0,t=e/Math.max(1,Kt.t-Kt.t0);(Math.abs(e)>=40||Math.abs(t)>=Fi.SWIPE_V)&&(e>0?fa(wi.state==="full"?"peek":"closed"):wi.state==="peek"&&fa("full"))}var wi={state:"closed",init(n){let e=document.getElementById("sheets");return e&&(xn=document.createElement("section"),xn.id="sheet",xn.className="sheet",xn.dataset.state="closed",vm=document.createElement("div"),vm.className="sheet-handle",ha=document.createElement("div"),ha.className="sheet-peek",sr=document.createElement("div"),sr.className="sheet-body",xn.append(vm,ha,sr),e.appendChild(xn),xn.addEventListener("pointerdown",AA),xn.addEventListener("pointermove",TA),xn.addEventListener("pointerup",ny),xn.addEventListener("pointercancel",ny)),wi},set(n,e={}){if(xn){if(ha.textContent="",sr.textContent="",sr.scrollTop=0,e.peek&&ha.appendChild(e.peek),n&&sr.appendChild(n),!n&&!e.peek){fa("closed");return}fa(e.state==="full"?"full":e.state==="closed"?"closed":"peek")}},open(n="peek"){xn&&(ha.firstChild||sr.firstChild)&&fa(n==="full"?"full":"peek")},close(){fa("closed")},onChange(n){return ym.add(n),()=>ym.delete(n)}};var RA=["S01","S02","S03","S04","S05","S06","S07","S08","S09","S10","S11","S12","S13","S14"];function iy(n){let e=()=>{if(n.secrets&&typeof n.secrets.found=="function")return n.secrets.found();let i=se.data&&se.data.found||{};return RA.filter(r=>!!i[r])},t=Object.freeze({version:1,state(){let i=n.renderer,r=se.data||{},s=i?i.stats:null;return{route:ue.route.hash,room:ue.room,phase:ue.phase,tier:ue.tier,u:ue.u,soundOn:ue.soundOn,night:ue.night,owner:ue.owner,inverted:ue.inverted,secrets:e(),shards:r.shards|0,nadirOpen:!!r.nadirOpen,pullNest:ue.pullNest,resonancePct:ue.resonancePct,status:ue.status,columns:ue.columns.slice(),satellites:ue.satellites,companion:ue.companion,whaleSeen:!!r.whaleSeen,_stats:s?{calls:s.calls,triangles:s.triangles,dpr:i.dpr,texMB:nx(),geometries:s.geometries,points:s.points,frameMs:s.frameMs,fps:s.fps,tier:ue.tier,labels:n.overlay?n.overlay.visibleCount|0:0}:null,_travel:n.director&&n.director.lastTravel?{...n.director.lastTravel}:null,_world:{source:o0,issues:a0.length}}},go(i){let r=String(i);location.hash===r?n.director&&n.director.go(r,{source:"go"}):location.hash=r}});try{Object.defineProperty(window,"__SAMVIN__",{value:t,writable:!1,configurable:!1,enumerable:!1})}catch{}return t}var Qn=(n,e,t,i,r,s,o=!1)=>Object.freeze({id:n,name:e,where:t,note:i,line:r,hintRoom:s,timeGated:o}),_m=Object.freeze([Qn("S01","РЕЗОНАНС","CORE","G4","Песок написал имя.","CORE"),Qn("S02","БЕСКОНЕЧНОСТЬ","CORE","A4","Ты всё ещё внутри SAM.VIN.","CORE"),Qn("S03","ГОЛОВОКРУЖЕНИЕ","CORE","B4","Ключ закружился на {p}%.","CORE"),Qn("S04","АККОРД","MEMBERS","D5","Весь клан прозвучал вместе.","MEMBERS"),Qn("S05","ПОЗЫВНОЙ","anywhere","E5","Система узнала тебя.","CORE"),Qn("S06","МАСТЕРСКАЯ","MEMBERS","G5","Твой знак вырезан.","MEMBERS"),Qn("S07","КИТ","any hall","A5","Ты видел кита.",null,!0),Qn("S08","ИЗНАНКА","CORE","B5","Ты видел изнанку.","CORE"),Qn("S09","ДРОН","any hall","D6","Ты поймал дрона.","CURRENT"),Qn("S10","НОЧЬ","any","E6","Ты видел, как VIN спит.",null,!0),Qn("S11","ЧАСТОТА","SIGNAL","G6","Тайная частота: {freq}.","SIGNAL"),Qn("S12","КАПСУЛА","INSIGNIA","A6","Капсула открылась.",null,!0),Qn("S13","ЗЕНИТ","navigator","B6","Ты был над всем.","ZENITH"),Qn("S14","СПУТНИК","CORE","D7","{name} прилетела и осталась.",null,!0)]),pF=Object.freeze(["S01","S03","S04","S02","S06","S09","S08","S11","S13","S05"]),mF=Object.freeze(["S07","S10","S12","S14"]),CA=new Map(_m.map(n=>[n.id,n]));function ry(n){return CA.get(n)||null}function sy(n,e,t){return new Promise(i=>{requestAnimationFrame(()=>i())})}var ki=null,Mm={x:0,y:0,depth:0,visible:!1},ds=(n,e)=>n&&typeof n[e]=="function";function IA(n){return n&&n.isVector3&&Ee.camera?(Ee.project(n,Mm),{x:Mm.x,y:Mm.y}):n&&Number.isFinite(n.x)&&Number.isFinite(n.y)?{x:n.x,y:n.y}:{x:Ge.w/2,y:Ge.h/2}}function xf(n,e){let t=ki&&ki.status;ds(t,"say")&&t.say(n,e||{})}async function PA(n,e){let t=se.data,i=ki&&ki.keyNav,r=t.shards<5&&!t.nadirOpen,s=r&&ds(i,"slotPoint")?i.slotPoint(t.shards):ds(i,"letterPoint")?i.letterPoint("I"):{x:Ge.w/2,y:Ge.h/2},o=se.rank().index;try{await sy(n,e,s)}catch{}r&&se.patch(l=>{l.shards=Math.min(5,(l.shards|0)+1)}),ds(i,"refreshSlots")&&i.refreshSlots(),Jt.play("shard",{}),ns(ts.shard),ki&&ds(ki.chrome,"relockFound")&&ki.chrome.relockFound(),xf("found"),r&&t.shards<5&&xf("shard",{k:t.shards}),Oe.emit("shard:landed",{id:n,k:t.shards,count:or.count()});let a=se.rank();a.index>o&&(Oe.emit("rank:change",{rank:a.name,index:a.index}),xf("rank",{rank:a.name}),ds(Jt,"setRank")&&Jt.setRank(a.index)),r&&t.shards>=5&&!t.nadirOpen&&(se.set("nadirOpen",!0),xf("shard",{k:5}),ki&&ds(ki.lead,"show")&&ki.lead.show("Внизу что-то открылось.",{ms:3e3}),ds(i,"crack")&&i.crack(),Oe.emit("nadir:open",{}))}var or={init(n){return ki=n,n.secrets=or,or},discover(n,e={}){if(!ry(n)||!se.data||or.isFound(n))return!1;let t=e&&e.vars?{...e.vars}:{};se.patch(r=>{r.found[n]=new Date(Date.now()).toISOString(),(!r.foundVars||typeof r.foundVars!="object")&&(r.foundVars={}),r.foundVars[n]=t});let i=IA(e&&e.anchor);return Oe.emit("secret:found",{id:n,anchor:i}),PA(n,i),!0},isFound(n){return!!(se.data&&se.data.found&&se.data.found[n])},found(){return _m.filter(n=>or.isFound(n.id)).map(n=>n.id)},count(){return or.found().length},rank(){return se.rank()},get shards(){return se.data?se.data.shards|0:0}};var BF=Object.freeze([[1,2],[2,3],[1,4],[3,5],[2,7],[4,7]].map(n=>Object.freeze(n)));var KF=48;var tO=Object.freeze({legend:3,achievement:1.6,moment:1.2,joke:.8,before:3});var hO=Object.freeze(["stellated","twisted","nested","bipyramid","knot"]);var Ne={world:nn,state:se,app:ue,bus:Oe,loop:Ie,quality:it,layout:Ge,input:Yt,audio:Jt,secrets:null,status:null,sheet:null,edges:null,hint:null,fog:null,palette:null,atlas:null,lead:null,overlay:null,dims:null,datum:null,chrome:null,keyNav:null,director:null,halls:null,renderer:null,scene:null,camera:null,rig:null,scale:null,nest:null,key:null,rim:null,lamp:null,U:null,worldFx:null,t0:null};function ei(n,e){try{return e(),!0}catch(t){return Rt(`main:${n}`,`boot step "${n}" failed`,t),!1}}function oy(){ei("env",()=>{tn.reducedMotion,lc()}),ei("state",()=>{Ax(oo());let r=oo();ue.night=Nf(r),ue.drowsy=h0(r),ue.birthday=Ff(r),ue.owner=!!se.data.owner,ue.inverted=!!se.data.inverted,document.documentElement.style.setProperty("--shrp",String(se.shrp)),se.deliverTransmissions()}),ei("fonts",()=>{Ko()});let n=null;ei("quality",()=>{n=it.detect().gl});let e=null;ue.tier!=="T0"&&(ei("webgl",()=>{e=LA(n)})||ly()),ei("dom",()=>{Ne.status=Ti,Ti.init(Ne),Ne.overlay=Bi,Bi.init(Ne),Ne.datum=Jl,Jl.init(Ne),Ne.sheet=wi,wi.init(Ne)}),ei("audio",()=>{Jt.init(Ne)}),ei("input",()=>{Yt.init(Ne)});let t=er("#/core");!ei("navigation",()=>{t=er(location.hash),et.init(Ne),fn.init(Ne)})&&ue.tier!=="T0"&&ly(),ei("secrets",()=>{or.init(Ne)}),ei("hook",()=>{iy(Ne)}),ei("loop",()=>{it.init(Ne),e&&(Ie.add(e.render,un.RENDER),e.onFirstFrame(()=>document.body.classList.remove("is-ff"))),Ie.start(),ue.tier!=="T0"&&it.benchmark(),Oe.emit("app:ready",{})}),Ne.key?ei("boot-standin",()=>DA(e,t)):ei("boot-standin",()=>cy(t))}function ay(){let n=$e.core;return{pos:new I(...n.pos),target:new I(...n.target),fov:n.fov,offsetY:Ge.kind==="desktop"?0:n.phoneOffsetY,roll:0}}function LA(n){let e=Vx(document.getElementById("gl"),n,ue.tier);return Ne.renderer=e,Ne.scene=e.scene,Ne.camera=e.camera,Ne.palette=rs,Ne.U=he,Ne.fog=Ji,rs.init(),kt.init(ue.tier),Ne.atlas=kt,Ji.set(be.CORE.fog),He.init(e.scene,Ne),Ne.scale=He,Ne.worldFx=new Bt,Ne.worldFx.name="worldFx",He.root.add(Ne.worldFx),en.init(Ne),Ne.nest=en,Ne.pillar=av(),He.root.add(Ne.pillar),Ne.key=dv(Ne),en.level(0).add(Ne.key.group),Ie.add(Ne.key.update,un.WORLD),Ne.rim=mv(Ne),He.root.add(Ne.rim.group),fi.init(Ne),Ne.lamp=fi,Ee.init(e.camera),Ne.rig=Ee,Ee.setPose(ay()),Oe.on("layout:change",()=>{Ne.director||Ee.setPose(ay())}),Ie.add((t,i)=>{he.uTime.value=i/1e3,he.uBreath.value=Wn.mix(0,1)},un.CLOCK),Ie.add(t=>fi.update(t),un.LAMP),Ie.add(t=>Ee.apply(t),un.CAMERA),Oe.on("gl:lost",()=>{Ne.t0&&Ne.t0.showLost&&Ne.t0.showLost()}),Oe.on("gl:restored",()=>{Ne.t0&&Ne.t0.hideLost&&Ne.t0.hideLost()}),$x(e)}function DA(n,e){let t=Ne.key;en.setFade(1,0);let i=()=>{Kn(600,()=>ci(1e3,r=>en.setFade(1,r),Zt.reveal)),Kn(1e3,()=>{ci(400,r=>t.setReveal({points:r,scanY:null,fill:r,alpha:r}),Zt.reveal).done.then(()=>{t.ignite({color:ue.night?"electrum":"ember",flash:!0}),t.shootAxis(3.2,240),Ne.rim&&Ne.rim.showName(),t.setIdle(!0),n&&n.setGrain(.02),cy(e)})})};n?n.onFirstFrame(i):i()}function cy(n){lr("idle"),ue.booting=!1,Ne.datum&&Ne.datum.arrive("CORE"),Ne.director&&(Ne.director.settle(),n&&(n.room!=="CORE"||n.sub)&&Ne.director.go(n.hash,{source:"deeplink"}))}function ly(){Ne.renderer=Ne.scene=Ne.camera=Ne.key=Ne.rim=Ne.rig=Ne.scale=Ne.nest=Ne.lamp=null,it.tier="T0",ue.tier="T0"}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",oy,{once:!0}):oy();})();
