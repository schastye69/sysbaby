(()=>{var dv=t=>{try{return typeof matchMedia=="function"?matchMedia(t):null}catch{return null}},sm=dv("(prefers-reduced-motion: reduce)"),om=dv("(pointer: coarse)"),rm=typeof navigator<"u"&&navigator.userAgent||"",cv=typeof navigator<"u"&&navigator.maxTouchPoints||0,Ft={reducedMotion:!!(sm&&sm.matches),coarse:!!(om&&om.matches),touch:cv>0,ios:/iPad|iPhone|iPod/.test(rm)||/Macintosh/.test(rm)&&cv>1,android:/Android/i.test(rm)},uv=[];function fv(t,e){t&&(t.addEventListener?t.addEventListener("change",e):t.addListener&&t.addListener(e))}fv(sm,t=>{Ft.reducedMotion=!!t.matches;for(let e=0;e<uv.length;e++)try{uv[e](Ft.reducedMotion)}catch(n){ot("env:rm","reduced-motion listener failed",n)}});fv(om,t=>{Ft.coarse=!!t.matches});var hv=new Set;function ot(t,...e){if(!hv.has(t)){hv.add(t);try{console.warn(`[sam.vin] ${t}:`,...e)}catch{}}}var oh=new Map,_e={on(t,e){let n=oh.get(t);return n||(n=[],oh.set(t,n)),n.push(e),()=>_e.off(t,e)},off(t,e){let n=oh.get(t);if(!n)return;let i=n.indexOf(e);i<0&&(i=n.findIndex(r=>r.orig===e)),i>=0&&n.splice(i,1)},once(t,e){let n=i=>{_e.off(t,n),e(i)};return n.orig=e,_e.on(t,n),()=>_e.off(t,n)},emit(t,e){let n=oh.get(t);if(!n||n.length===0)return;let i=n.slice();for(let r=0;r<i.length;r++)try{i[r](e)}catch(s){ot(`bus:${t}`,`listener for '${t}' threw`,s)}}};var $l=Object.freeze(["void","abyss","deep","steel","slate","pewter","silver","white","obsidian","ember","emberDeep","electrum","paper","ink"]),Xl=Object.freeze({void:"--void",abyss:"--abyss",deep:"--deep",steel:"--steel",slate:"--slate",pewter:"--pewter",silver:"--silver",white:"--white",obsidian:"--obsidian",ember:"--ember",emberDeep:"--ember-deep",electrum:"--electrum",paper:"--paper",ink:"--ink"}),ba=Object.freeze({void:"#04060A",abyss:"#070B12",deep:"#0C1420",steel:"#13202F",slate:"#233446",pewter:"#5E6E80",silver:"#B8C4D0",white:"#EEF2F6",obsidian:"#0B1119",ember:"#FF6A2B",emberDeep:"#B23A12",electrum:"#E8C872",paper:"#E6EAEE",ink:"#0C1420"}),pv=Object.freeze({void:"#E6EAEE",abyss:"#E6EAEE",deep:"#E6EAEE",steel:"#9AA6B4",slate:"#9AA6B4",silver:"#0C1420",white:"#0C1420",obsidian:"#D3D9DF"});function am(t){return parseInt(t.slice(1),16)}function mv(t,e=[0,0,0]){let n=am(t);return e[0]=(n>>16&255)/255,e[1]=(n>>8&255)/255,e[2]=(n&255)/255,e}function ch(t,e){let n={};for(let i of Object.keys(t))n[i]=e(t[i]);return Object.freeze(n)}var K3=ch(ba,am),Aw=ch(ba,t=>Object.freeze(mv(t))),J3=ch(pv,am),Ew=ch(pv,t=>Object.freeze(mv(t)));function uh(t,e,n=[0,0,0]){let i=Aw[t],r=Ew[t]||i;return n[0]=i[0]+(r[0]-i[0])*e,n[1]=i[1]+(r[1]-i[1])*e,n[2]=i[2]+(r[2]-i[2])*e,n}var Q3=Object.freeze({giant:.07,counter:.12,status:.85,scrim:.6,scrimBreath:[.58,.62],leader:.7,line:.55,vertex:.4,inlay:.45,fresnel:.55,grains:.35,grainsBreath:[.32,.38],axisInside:.35,marginalia:.8,legendBand:.4,column:.7,dimmed:.4,hoverOthers:.55,dome:.45,contours:.4,doneLight:.12,ghost:.6,ghostStroke:.3,whale:.3,spark:.3,rimBoot:[.06,.12],bandHover:1.25}),eL=Object.freeze({maxFrac:.03,peakFrac:.06,peakMs:1500,maxLinePx:2,maxDotPx:6,maxTextPx:11,burnCoolMs:1200}),tL=Object.freeze({maxMs:2500,coolMs:600,nightNucleus:.55}),ts=Object.freeze({nucleusIntensity:.55,litAlpha:.7,breathMs:7e3,drowsyBreathMs:5600,mixMs:1200,yawnMs:1200}),nL=Object.freeze({sans:'"Geologica", system-ui, sans-serif',mono:'"Martian", ui-monospace, monospace'}),iL=Object.freeze({giant:{family:"sans",wght:100,tracking:-.04,lh:.8,desktop:"38vw",phone:"62vmin",alpha:.07},display:{family:"sans",wght:220,tracking:-.035,lh:.9,desktop:"clamp(56px, 8.4vw, 148px)",phone:"13vmin"},heading:{family:"sans",wght:560,desktop:[28,34],phone:[26,31]},lead:{family:"sans",wght:300,desktop:[22,30],phone:[19,26]},brief:{family:"sans",wght:380,desktop:[19,28],phone:[17,25]},body:{family:"sans",wght:380,desktop:[17,25],phone:[16,24],measureCh:36},status:{family:"sans",wght:400,desktop:[16,22],phone:[16,22],maxChars:34,measureCh:44},label:{family:"mono",wght:500,wdth:87.5,tracking:.08,upper:!0,desktop:[11,14],phone:[11,14]},data:{family:"mono",wght:250,wdth:100,tabular:!0,desktop:[72,72],phone:[48,48]},micro:{family:"mono",wght:450,wdth:75,tracking:.1,upper:!0,desktop:[9.5,12],phone:[10,13]}}),Cr=Object.freeze({sign:'700 {px}px "Geologica"',burn:'700 {px}px "Geologica"',sand:'700 {px}px "Geologica"',ring:'500 {px}px "Martian"'});var lh=Object.freeze({base:20,range:80,perDay:.08,perSecret:.06});function lm(t,e){return Math.min(1,lh.perDay*t+lh.perSecret*e)}function gv(t,e){return Math.round(lh.base+lh.range*lm(t,e))}var rL=Object.freeze([120,240,480,960,1920]),sL=Object.freeze({o1:120,o2:240,o3:480,o4:960,o5:1920}),xv=Object.freeze({heavy:Object.freeze({omega:6,zeta:1}),medium:Object.freeze({omega:12,zeta:1}),light:Object.freeze({omega:22,zeta:1}),struck:Object.freeze({omega:18,zeta:.18}),notice:Object.freeze({omega:6.3,zeta:.95}),reindex:Object.freeze({omega:9,zeta:1}),hot:Object.freeze({omega:14,zeta:1}),hint:Object.freeze({omega:8,zeta:.25})}),bi=Object.freeze({inertiaDecay:.92,frameMs:16.7,spinDecay:.96,overshootMax:.04,snapOvershoot:.04,settleOvershoot:.02,anticipationFrac:.03,anticipationMs:120,anticipationMinDisp:.1,responseMs:80,pressScale:.96,pressMs:90,rippleMs:260,ripplePx:48}),Ma=Object.freeze({periodMs:4200,inhaleMs:1800,exhaleMs:2400,drowsyMs:5600,nightMs:7e3,reducedAmp:.25,nucleus:[.8,1],gap:[.02,.026],grainAlpha:[.32,.38],scrim:[.58,.62],edgeSwayPx:.2,droneDb:2});function ah(t,e,n,i){let r=3*t,s=3*(n-t)-r,o=1-r-s,a=3*e,l=3*(i-e)-a,c=1-a-l,u=f=>((o*f+s)*f+r)*f,h=f=>((c*f+l)*f+a)*f,d=f=>(3*o*f+2*s)*f+r;return function(g){if(g<=0)return 0;if(g>=1)return 1;let x=g;for(let b=0;b<8;b++){let E=u(x)-g;if(Math.abs(E)<1e-6)return h(x);let v=d(x);if(Math.abs(v)<1e-6)break;x-=E/v}let p=0,m=1;x=g;for(let b=0;b<24;b++){let E=u(x);if(Math.abs(E-g)<1e-6)break;E<g?p=x:m=x,x=(p+m)/2}return h(x)}}var oL=Object.freeze({camera:Object.freeze([.7,0,.15,1]),reveal:Object.freeze([.16,1,.3,1]),phosphor:Object.freeze([.2,0,0,1])}),vv=Object.freeze({camera:ah(.7,0,.15,1),reveal:ah(.16,1,.3,1),phosphor:ah(.2,0,0,1),linear:t=>t<=0?0:t>=1?1:t,sine:t=>.5-.5*Math.cos(Math.PI*(t<=0?0:t>=1?1:t))}),we=Object.freeze({dive:1600,diveFirst:2400,diveFirstScale:1.375,diveFirstHold:200,diveSwapAt:1200,diveSwapAtFirst:1850,recall:1200,recallSwapAt:1e3,recallRatchetMs:40,liftBase:900,liftPerBoundary:280,liftMax:1800,slice:280,sliceSwap:140,depart:240,arrive:600,readableOut:120,retargetMin:600,retargetFactor:.8,skipSpeed:3,interactiveU:.7,releaseSourceMs:300,tierFreezeMs:300,unfold:1600,unfoldFirst:2200,refold:900,memberFocus:900,memberBack:600,shluz:1400,shluzBack:900,extract:600,workshop:1200,zenith:2400,nadirFirst:2800,focusReduced:160,bootDesktop:7200,bootReturning:3500,bootSameDay:2e3,bootReduced:2e3,lockStep:220,lockStepSameDay:110,firstLock:3400,ignite:4940,ignitionReturning:2640,typeMsPerChar:28,scanMs:800,burnMsPerLetter:70,burnCoolMs:1200,assemble:480,drawIn:600,phoneActivateWindow:1500,phonePartialHold:2500,phonePartialDrift:900,phoneHintDelay:2200,phoneHintReturning:4e3,lockIn:480,lockInReduced:160,revealMsPerChar:12,revealMax:240,beamCps:22,phosphor:900,statusIn:240,statusHold:4e3,idleRotate:2e4,leadDefault:4e3,leaderDraw:240,leaderStagger:40,labelLowpass:120,coordHz:10,keyHoverTrigger:120,keyHoverIn:480,keyHoverOut:520,dimsDraw:240,navHover:240,navTwin:240,longPress:800,relaunch:2e3,relaunchRingDelay:300,hintGlint:1200,overpullHold:600,stringRing:900,stringFlash:120,shudder:240,hintArriveWindow:3e4,idleLampMs:3e3,lampSweepMs:9e3,lampBlendMs:600,shardFlight:900,electrum:2500,electrumCool:600});var yv=Math.log(1e3),aL=Object.freeze([-1,0,1,2]),_v=1.5,cm=Object.freeze({near:.002,far:400}),hr=Object.freeze({min:3.2,max:12,rest:7.2,wheelFactor:1.1,wheelStepPx:100}),lL=Object.freeze({d0:12,k:yv,wheelDiv:2400,pinchGain:1.5,pauseMs:400,decay:.92,elevationDeg:8,settleIdleMs:600,settleMs:1600,settleTo:7.2,leadMs:4e3,strutTickMax:30,stages:Object.freeze([["КЛЮЧ",60],["ЗАЛ ЯДРА",600],["VIN",3600],["VIN ЦЕЛИКОМ",12e3]]),passLatticeD:[300,620]}),bv=Object.freeze({d0:.06,k:yv,miniKeyBelow:.05}),cL=Object.freeze({height:2400,diameter:1240,radius:620}),Ao=Object.freeze({H:2.4,R:.62,k:1.35,halfH:1.2});function At(t){let e=Math.min(1,Math.abs(t)/Ao.halfH);return Ao.R*(1-Math.pow(e,Ao.k))}var Wt=Object.freeze([{i:0,sign:"S",code:"SIGNAL",top:1.2,bot:.98,n:3,hollow:0,k:72},{i:1,sign:"A",code:"ARCHIVE",top:.96,bot:.66,n:5,hollow:0,k:120},{i:2,sign:"M",code:"MEMBERS",top:.64,bot:.28,n:7,hollow:0,k:168},{i:3,sign:"•",code:"CORE",top:.26,bot:-.26,n:12,hollow:.3,k:288},{i:4,sign:"V",code:"VOYAGES",top:-.28,bot:-.64,n:7,hollow:0,k:168},{i:5,sign:"I",code:"INSIGNIA",top:-.66,bot:-.96,n:5,hollow:0,k:120},{i:6,sign:"N",code:"NADIR",top:-.98,bot:-1.2,n:3,hollow:0,k:72}].map(t=>Object.freeze({...t,height:Math.round((t.top-t.bot)*1e3)/1e3,mid:(t.top+t.bot)/2,rTop:At(t.top),rBot:At(t.bot),rMax:t.top>0&&t.bot<0?Ao.R:Math.max(At(t.top),At(t.bot))}))),Yl=Object.freeze(["S","A","M","•","V","I","N"]),Eo=Object.freeze([0,1/3,2/3,1]),Dt=Object.freeze({rest:.02,breath:.026,leanAdd:.01,hover:.09,hoverNeighbourPush:.012,dive:.3,unfold:.42,recallStart:.3}),Bt=Object.freeze({radius:1.25,apertureD:.09,ringEngraveW:.004,hollowR:.3,sign:Object.freeze({depth:.004,heightFrac:.7,strokeFrac:.12,face:0}),friezeH:.018,ticksPerFace:12,tickLen:.025,backFace:6,hoverSlide:.06,diveSlide:.25,diveTurnAwayDeg:20,contract:.03,nucleusAnticipation:1.6,lattice:Object.freeze({faceShift:.75,segmentsPerGenerator:8,generators:2016,segments:16128,solidBelowCamDist:2.4}),r1:Object.freeze({spLo:3,spHi:6}),unfold:Object.freeze({camFrom:7.2,camTo:Object.freeze([0,.04,.95]),ringScale:2.4,ringR:1.3,ringArcDeg:300,ringCap:.06,coreRingCap:.12,platesR:.16,plateSize:.05,platesPeriodS:24,orbitYawDeg:35}),pitchFlipDeg:110,pitchResist:.35,pitchResistMaxDeg:30,yawMaxDeg:180,yawReturnMs:2e3}),Wn=Object.freeze({r:.035,detail:1,glowR:.0528,breathRingR:.09,apertureAlignDeg:Object.freeze([35,10]),gapOpen:Object.freeze([.03,.09]),minVisibility:.25,hotGain:.4,intensity:Object.freeze([.8,1]),birthdayPulse:1.3}),Ki=Object.freeze({half:1.2,extend:3.2,widthPx:2,alphaInside:.35,shootMs:240}),uL=Object.freeze({driftYawDeg:14,driftPeriodS:40,swayDeg:1.5,swayPeriodsS:Object.freeze([11,13,17,19,23,29,31]),faceViewerDeg:16,reindexMs:Object.freeze([23e3,41e3]),reindexBackMs:1600,reindexTurnMs:620,noticeMaxDeg:7,noticeBootDeg:6,tauBaseMs:40,tauStepMs:40,hotDelayMs:220,hotDelayLateMs:90,hotTrackMs:3e3,hotRampMs:1e3,leanSpeedPx:300,leanRadius:1.2,leanDz:.08,flinchSpeedPx:2500,flinchRadius:1.5,flinchInMs:120,flinchRelaxMs:700,flinchScatter:.05,repelR:.35,repelCap:.06,repelBackMs:900}),Sa=Object.freeze({T3:24576,T2:16384,T1:8192,annulus:Object.freeze([1.15,1.9]),kepler:.06,jitter:.002,sizePx:Object.freeze([1.2,2]),chunk:4096}),To=Object.freeze({faces:Object.freeze([11,0,1]),stratum:3,apertureSkip:.06,dotPx:1.5,emitterM:1.2}),hL=Object.freeze({max:7,size:.1,r:1.05,tiltDeg:12,periodS:90}),dL=Object.freeze({size:.24,r:1.6,periodS:60,bpm:71,arriveDay:10,flyMs:2400});var Mv=Object.freeze({SIGNAL:1090,ARCHIVE:810,MEMBERS:460,CORE:0,VOYAGES:-460,INSIGNIA:-810,NADIR:-1090,ZENITH:1260,WORKSHOP:484}),Sv=Object.freeze({SIGNAL:[980,1200],ARCHIVE:[660,960],MEMBERS:[280,640],CORE:[-260,260],VOYAGES:[-640,-280],INSIGNIA:[-960,-660],NADIR:[-1200,-980],ZENITH:[1200,1400],WORKSHOP:[482,487]}),bn=Object.freeze({wallsNear:300,wallsFar:620,wallVis:Object.freeze([.08,.14]),strutSpacing:Object.freeze([13,60]),ringStep:20,irisR:18,irisBlades:7,irisBladeDeg:51.4,irisPassR:12,deckR:60,deckRingStep:4,beadR:1.8,beadStep:25,beadCount:97,coreRimR:300,coreIrisY:260,liftOffset:Object.freeze([12,0,6]),drawCalls:40,triangles:12e4,labels:24,labelsLow:16}),nt=Object.freeze({fov:35,fovWide:40,core:Object.freeze({pos:[0,.75,7.2],target:[0,0,0],fov:35,phoneOffsetY:-.06}),boot:Object.freeze({start:[0,.4,16],dolly:9.5,rest:7.2,driftM:.08,driftHz:[.13,.11],tiltDeg:3}),phoneStart:Object.freeze({dist:5.2,keyFrac:.78,centreFrac:.47}),members:Object.freeze({pos:[0,10,48],target:[0,12.5,0],fov:35,phonePos:[0,11,40]}),voyages:Object.freeze({pos:[0,70,44],target:[0,0,-6],fov:35,altRange:[60,140],phonePos:[0,96,30],phonePitchDeg:-70}),archive:Object.freeze({tubeR:9,eyeBelowBand:.4}),signal:Object.freeze({pos:[0,2,26],target:[0,30,0],fov:40,phonePos:[0,2,30],phonePitchDeg:40,apexH:110,apexR:12}),insignia:Object.freeze({pos:[0,1.7,0],fov:40,sphereR:30}),nadir:Object.freeze({depth:110}),zenith:Object.freeze({aboveApex:60,pitchDeg:-62,phonePitchDeg:-70}),workshop:Object.freeze({chamber:4.4,grid:2.4,nodeStep:.4})}),xt=Object.freeze({phoneMaxShort:600,landMaxH:500,desktop:Object.freeze({cols:12,margin:48,gutter:24,chrome:24,edgeInset:14,statusBottom:40,datumFrac:.62}),phone:Object.freeze({cols:4,margin:16,gutter:12,chrome:16,edgeInset:10,statusAboveBand:12,datumPx:120,titleTopPx:72}),measureCh:36,statusMeasureCh:44,hit:44,hitRow:56,crossPx:7,leader:Object.freeze({widthPx:.5,alpha:.7,elbowMin:24,elbowMax:64,runMax:120,maxAnchors:24,maxAnchorsLow:16}),dims:Object.freeze({widthPx:.5,arrowPx:6,extPx:4,gapPx:4,offsetPx:24}),scrim:Object.freeze({scale:1.4,featherPx:40}),nav:Object.freeze({w:56,h:300,hoverW:260,right:24,widthScale:.36,needlePx:12,slotPx:3,zenithDotPx:2,zenithDotAbove:10,twinPx:40,magnetPx:12,wheelPxPerDetent:120,rubber:.35,rubberMax:48,overpullPx:140,letterPx:11}),band:Object.freeze({h:88,sideW:72,letterPx:13,minCell:44}),sheet:Object.freeze({maxFrac:.62,peek:120,handle:24,sideFrac:.44}),elevator:Object.freeze({pxPerHall:360,resistance:.22,tickPx:60}),edge:Object.freeze({pluckPxMs:.4,bendPx:8,twitchPx:2}),sound:Object.freeze({w:32,h:12,bars:8,fps:30}),cursorPx:6,rippleMaxPx:48,beamHeadPx:3,statusDotPx:6}),on=Object.freeze({r1:Object.freeze({lo:3,hi:6,bayer:8}),r2:Object.freeze({fresnelPow:3,fresnelGain:.55,spec:Object.freeze([[24,.35],[160,.6]])}),r3:Object.freeze({widthPx:1,primaryPx:1.5,axisPx:2,alpha:.55,glintPow:24,glintGain:.9,farFadeStart:.55,primaryEdges:12}),r4:Object.freeze({atlas:1024,atlasLow:512,rakeLo:.55,rakeHi:.9,inlay:.45,heightTaps:4}),r5:Object.freeze({radiusFactor:2.2,elevationDeg:12,idleMs:3e3,sweepMs:9e3,blendMs:600}),r6:Object.freeze({threshold:.82,levels:4,spritePx:64}),r7:Object.freeze({grain:.02,grainBoot:.025,grainBootUntilMs:1800,grainFps:24,clearInPx:120,clearOutPx:180,vignette:.18,vignetteFrom:.35}),r8:Object.freeze({fogVis:Object.freeze([.08,.14])}),dprCap:Object.freeze({T3:2,T2:1.5,T1:1.25}),dprStep:.25,governor:Object.freeze({windowFrames:90,lowFps:52,dropAfterMs:3e3,highFps:58,upgradeAfterMs:1e4}),budget:Object.freeze({drawCalls:40,triangles:12e4,textureMB:12})}),wv=30;var ve={kind:"desktop",isPhone:!1,w:0,h:0,dpr:1,safe:{t:0,r:0,b:0,l:0}},wa=null;function Tw(){if(typeof document>"u"||!document.body)return;wa||(wa=document.createElement("div"),wa.setAttribute("aria-hidden","true"),wa.style.cssText="position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)",document.body.appendChild(wa));let t=getComputedStyle(wa);ve.safe.t=parseFloat(t.paddingTop)||0,ve.safe.r=parseFloat(t.paddingRight)||0,ve.safe.b=parseFloat(t.paddingBottom)||0,ve.safe.l=parseFloat(t.paddingLeft)||0}var um=null;function Rw(){try{return um||(um=matchMedia("(pointer: coarse)")),um.matches}catch{return!1}}function hh(){if(typeof window>"u")return!1;let t=Math.max(1,Math.round(window.innerWidth||document.documentElement.clientWidth||1)),e=Math.max(1,Math.round(window.innerHeight||document.documentElement.clientHeight||1)),n=Rw()&&Math.min(t,e)<=xt.phoneMaxShort,i=n?e<xt.landMaxH?"phone-land":"phone":"desktop",r=window.devicePixelRatio||1,s=ve.safe.t,o=ve.safe.r,a=ve.safe.b,l=ve.safe.l;Tw();let c=t!==ve.w||e!==ve.h||i!==ve.kind||r!==ve.dpr||s!==ve.safe.t||o!==ve.safe.r||a!==ve.safe.b||l!==ve.safe.l;return ve.w=t,ve.h=e,ve.kind=i,ve.isPhone=n,ve.dpr=r,c}var hm=0;function dm(){if(hm)return;let t=()=>{hm=0,hh()&&_e.emit("layout:change",{kind:ve.kind,w:ve.w,h:ve.h})};hm=typeof requestAnimationFrame=="function"?requestAnimationFrame(t):setTimeout(t,16)}if(typeof window<"u"){hh(),window.addEventListener("resize",dm),window.addEventListener("orientationchange",dm);try{matchMedia("(pointer: coarse)").addEventListener("change",dm)}catch{}}var J={phase:"boot",room:"CORE",route:{room:"CORE",sub:null,hash:"#/core"},u:0,tier:"T2",soundOn:!0,night:!1,drowsy:!1,birthday:!1,owner:!1,inverted:!1,unfolded:!1,pullNest:0,resonancePct:0,status:"",columns:[],satellites:0,companion:!1,booting:!0,hintTarget:null,show:{active:!1,scene:-1},guests:0,fx:{stage:null}};function Mi(t){let e=J.phase;t!==e&&(J.phase=t,_e.emit("phase:change",{phase:t,prev:e}))}var Ro={operator:{id:"sam",name:"Сэм",aliases:["сэм","sam","сэмми","семён","semyon"],callsign:"ВЕДУЩИЙ",birthday:"2018-04-12",heightM:1.3,papaHeightM:null},clan:{name:"SAM.VIN",motto:"Ни один — не один.",about:"Играем всерьёз. Тех, кто слабее, защищаем ещё серьёзнее — в игре и в жизни.",founded:"2025-03-14",frequency:14.03,sigil:[[3,21],[21,45],[45,27],[27,3],[21,27],[3,45]],code:["Ждать — тоже сила.","Дал слово — держи.","Команда важнее меня.","Новенький — уже свой.","Всё по-честному.","Слово сильнее кулака.","Не проходим мимо."]},members:[{id:"sam",name:"Сэм",callsign:"ВЕДУЩИЙ",role:"основатель",status:"на связи",level:12,missions:21,seed:7,note:"D4",glyph:null,trait:"Придумал клан на перемене. Зовёт всех и ждёт каждого.",joke:"Говорит «я рядом», когда он на другом конце карты.",achievements:["start","bridge","onehp","newbie","peace"]},{id:"lev",name:"Лёва",callsign:"ЯКОРЬ",role:"защита",status:"на связи",level:11,missions:17,seed:23,note:"G3",glyph:[[3,38],[9,11],[38,29],[38,33]],trait:"Если Лёва держит точку — точка держится.",joke:"Знает все карты наизусть. Даже те, которых нет.",achievements:["start","bridge","newbie"]},{id:"tim",name:"Тимур",callsign:"ЭХО",role:"поиск",status:"в пути",level:9,missions:14,seed:41,note:"A3",glyph:[[21,9],[9,39],[39,27]],trait:"Слышит соперника раньше, чем тот появится.",joke:"Всегда приходит последним — и спасает всех.",achievements:["three"]},{id:"kira",name:"Кира",callsign:"ЛИСА",role:"наблюдение",status:"на связи",level:10,missions:15,seed:5,note:"B3",glyph:[[8,38],[38,12],[12,8],[8,2],[12,4]],trait:"Видит то, что пропустили все.",joke:"Однажды спряталась так, что её не нашли до конца матча.",achievements:["silent","three","peace"]},{id:"danya",name:"Даня",callsign:"ГРОМ",role:"заводила",status:"отдыхает",level:8,missions:11,seed:17,note:"E4",glyph:[[4,23],[23,25],[25,44]],trait:"Громкий только в голосовом чате.",joke:"Прыгнул через пропасть. Долетел. До сих пор этим гордится.",achievements:["roof"]},{id:"misha",name:"Миша",callsign:"КОМЕТА",role:"связь",status:"в пути",level:7,missions:9,seed:31,note:"G4",glyph:[[36,12],[36,26],[36,18]],trait:"Быстрый. Иногда слишком.",joke:"Первым добежал до финиша. В другую сторону.",achievements:["pizza"]},{id:"ars",name:"Арсений",callsign:"ТИШИНА",role:"идеи",status:"на связи",level:3,missions:2,seed:13,note:"A4",glyph:[[21,27],[24,17]],trait:"Пришёл новеньким. Уже удивил всех.",joke:"Спросил, где кнопка «победить». Мы ищем до сих пор.",achievements:["newbie"]}],missions:[{code:"001",title:"Первая высадка",status:"done",where:"игра",brief:"Первый матч клана в полном составе.",conditions:["4 игрока","одна попытка"],crew:["sam","lev","tim","kira"],result:"Проиграли 0:12. Но вместе.",reward:"start",log:"Зонд нашёл на месте высадки старый флаг клана. Он всё ещё там."},{code:"002",title:"Мост над пропастью",status:"done",where:"игра",brief:"Перебраться всей командой. Никто не должен упасть.",conditions:["вся команда","без возрождений"],crew:["sam","lev","danya","misha"],result:"Упали двое. Вернулись.",reward:"bridge",log:"Зонд проверил мост. Мост держится. Лёва, видимо, тоже."},{code:"003",title:"Тихая гавань",status:"done",where:"игра",brief:"Удержать маяк до заката и ни разу не потерять связь.",conditions:["втроём","никого не бросить","до заката"],crew:["sam","kira","tim"],result:"Маяк горит. Связь — сто процентов.",reward:"silent",log:"Зонд вернулся. На маяке кто-то оставил пиццу."},{code:"004",title:"Северная башня",status:"active",where:"игра",brief:"Добраться до вершины втроём.",conditions:["3 игрока","без возрождений"],crew:["sam","lev","ars"],result:"",reward:"tower",log:"Зонд долетел до середины башни. Вершина видна. Она высокая."},{code:"005",title:"Ночная смена",status:"new",where:"игра",brief:"Продержаться до рассвета. Говорить только шёпотом.",conditions:["4 игрока","шёпотом","до рассвета"],crew:[],result:"",reward:"night",log:"Зонд слушал всю ночь. Кто-то храпел. Не будем говорить кто."},{code:"006",title:"Тёмная вода",status:"locked",decodeDays:5,where:"игра",brief:"Найти, откуда идёт сигнал под водой.",conditions:["5 игроков","с фонарями"],crew:[],result:"",reward:null,log:"Зонд нырнул. Сигнал идёт снизу. Там что-то светится."},{code:"007",title:"Город без карты",status:"locked",unlockAtDays:7,where:"игра",brief:"Пройти город, где никто не был, и нарисовать его карту.",conditions:["весь клан","без подсказок"],crew:[],result:"",reward:null,log:"Зонд нарисовал карту. Город похож на ключ. Совпадение?"},{code:"008",title:"Сто ступеней",status:"locked",unlockAtDays:14,where:"игра",brief:"Подняться по самой длинной лестнице, не упав ни разу.",conditions:["2 игрока","ни одного падения"],crew:[],result:"",reward:null,log:"Зонд насчитал 101 ступень. Одна была лишняя."},{code:"000",title:"Исток",status:"sealed",where:"игра",brief:"Вернуться туда, где всё началось, и оставить там свой знак.",conditions:["весь клан","знак лидера"],crew:[],result:"",reward:"origin",log:"Зонд вернулся с фото первого матча. Все улыбаются. Даже проигравшие."},{code:"009",title:"Новенький — в игру",status:"done",where:"жизнь",brief:"В классе новенький. Позвать его в игру и познакомить со всеми.",conditions:["вся команда","по-доброму","в первый же день"],crew:["sam","lev","ars"],result:"Арсений теперь в клане. И уже зовёт других.",reward:"newbie",log:"Зонд облетел школьный двор. Новенький там больше не один."},{code:"010",title:"Мир на перемене",status:"done",where:"жизнь",brief:"Двое друзей поссорились. Помочь им договориться — без крика и не выбирая, кто прав.",conditions:["словами","выслушать обоих","без крика"],crew:["sam","kira"],result:"Договорились. Теперь играют в одной команде.",reward:"peace",log:"Зонд прислушался. На перемене снова смеются вдвоём."},{code:"011",title:"Заступиться словом",status:"active",where:"жизнь",brief:"Если кого-то обижают — встать рядом и спокойно сказать: «Так нельзя». Если нужно — позвать взрослого.",conditions:["словами","вместе","спокойно"],crew:["sam","lev","kira"],result:"",reward:"shield",log:"Зонд облетел школу. Если кого-то обидят, клан будет рядом."},{code:"012",title:"Игра для всех",status:"new",where:"жизнь",brief:"Придумать игру на перемене, в которую возьмут каждого, кто захочет. Даже тех, кто стоит в стороне.",conditions:["весь клан","берём каждого","честные правила"],crew:[],result:"",reward:"allgame",log:"Зонд облетел площадку. Места хватит всем. Осталось придумать игру."},{code:"013",title:"Не пройти мимо",status:"new",where:"жизнь",brief:"Кому-то во дворе нужна помощь. Заметить, позвать своих и помочь — вместе.",conditions:["вся команда","не проходить мимо"],crew:[],result:"",reward:null,log:"Зонд видел во дворе малыша с большим мешком. Вчетвером такой мешок нести легко."}],achievements:[{id:"start",title:"Начало",shape:"nested",rarity:"обычная",earned:!0,date:"2025-03-15",where:"игра",who:["sam","lev","tim","kira"],text:"Мы сыграли первый матч вместе."},{id:"roof",title:"Прыжок через пропасть",shape:"knot",rarity:"легендарная",earned:!0,date:"2025-05-30",where:"игра",who:["danya"],text:"Никто не верил. Гром прыгнул. Гром долетел."},{id:"bridge",title:"Мост выстоял",shape:"twisted",rarity:"редкая",earned:!0,date:"2025-06-02",where:"игра",who:["sam","lev","danya","misha"],text:"Мост качался. Мы держали его, пока не перешли все."},{id:"three",title:"Трое за всех",shape:"stellated",rarity:"легендарная",earned:!0,date:"2025-08-19",where:"игра",who:["tim","kira","sam"],text:"Нас было трое. Мы вернулись за каждым, кто отстал, и дошли вместе."},{id:"silent",title:"Тишина в эфире",shape:"bipyramid",rarity:"редкая",earned:!0,date:"2025-09-27",where:"игра",who:["kira","tim","sam"],text:"Целый раунд без единого слова. И победили."},{id:"onehp",title:"Победа с 1 HP",shape:"stellated",rarity:"редкая",earned:!0,date:"2025-12-20",where:"игра",who:["sam"],text:"Одна жизнь. Одна попытка. Этого хватило."},{id:"pizza",title:"Пицца-протокол",shape:"nested",rarity:"обычная",earned:!0,date:"2026-01-04",where:"игра",who:["misha","danya"],text:"Перерыв на пиццу посреди решающего матча. Всё равно выиграли."},{id:"tower",title:"Северная башня",shape:"bipyramid",rarity:"редкая",earned:!1,where:"игра",text:"Подняться на вершину втроём."},{id:"night",title:"Ночная смена",shape:"knot",rarity:"обычная",earned:!1,where:"игра",text:"Продержаться до рассвета шёпотом."},{id:"hundred",title:"Сотня",shape:"twisted",rarity:"легендарная",earned:!1,where:"игра",text:"Сыграть сто матчей вместе."},{id:"origin",title:"Исток",shape:"stellated",rarity:"легендарная",earned:!1,where:"игра",text:"Пройти вылазку 000."},{id:"newbie",title:"Новенький — свой",shape:"nested",rarity:"обычная",earned:!0,date:"2026-04-15",where:"жизнь",who:["sam","lev","ars"],text:"Арсений пришёл новеньким. В тот же день он был в команде."},{id:"peace",title:"Договорились",shape:"twisted",rarity:"редкая",earned:!0,date:"2026-05-20",where:"жизнь",who:["sam","kira"],text:"Двое друзей поссорились. Мы выслушали обоих. Они помирились."},{id:"shield",title:"Заступиться словом",shape:"bipyramid",rarity:"легендарная",earned:!1,where:"жизнь",text:"Заступиться за того, кого обижают. Словами и вместе."},{id:"allgame",title:"Игра для всех",shape:"stellated",rarity:"редкая",earned:!1,where:"жизнь",text:"Придумать игру, в которую берут каждого."}],legends:[{id:"found",date:"2025-03-14",kind:"эпичное",title:"Основание",where:"игра",text:"Три человека, один ноутбук, ноль побед. Так всё началось."},{id:"jump",date:"2025-05-30",kind:"победа",title:"Прыжок через пропасть",where:"игра",text:"Никто не верил. Гром прыгнул. Гром долетел."},{id:"nights",date:"2025-11-14",kind:"эпичное",title:"Ночь трёх возрождений",where:"игра",text:"Остался один. Поднял всех. Никто до сих пор не понимает как."},{id:"wifi",date:"2026-03-12",kind:"смешное",title:"Великое падение Wi-Fi",where:"игра",text:"Мы почти выиграли. Почти. Роутер помнит всё."},{id:"seventh",date:"2026-04-15",kind:"эпичное",title:"Седьмой",where:"жизнь",text:"Новенький стоял один у стены. Сэм позвал его в игру. Так в клане стало семеро."},{id:"recess",date:"2026-05-20",kind:"эпичное",title:"Мир на перемене",where:"жизнь",text:"Двое не разговаривали неделю. Клан позвал обоих в одну игру. Теперь они в одной команде."}],moments:[{id:"hide",date:"2025-04-20",title:"Лучшее укрытие",who:["kira"],where:"игра",text:"Кира спряталась так хорошо, что её не нашли до конца матча. Даже свои."},{id:"bug",date:"2025-07-08",title:"Великий баг на мосту",who:["danya"],where:"игра",text:"Мост исчез у всех, кроме Дани. Даня стоял в воздухе и не понимал, почему все кричат."},{id:"room",date:"2025-10-02",title:"Секретная комната",who:["lev"],where:"игра",text:"Лёва нашёл секретную комнату и двадцать минут не мог из неё выйти."},{id:"wrong",date:"2026-02-15",title:"Не туда",who:["misha"],where:"игра",text:"Миша первым добежал до финиша. В другую сторону."},{id:"button",date:"2026-06-01",title:"Кнопка «победить»",who:["ars"],where:"игра",text:"Арсений спросил, где кнопка «победить». Мы ищем до сих пор."},{id:"mic",date:"2026-08-23",title:"Тихий план",who:["tim"],where:"игра",text:"Тимур полчаса рассказывал план. Микрофон был выключен. План сработал всё равно."},{id:"umbrella",date:"2026-04-28",title:"Зонт на троих",who:["lev","kira"],where:"жизнь",text:"Лёва и Кира поделили зонт с первоклассником, которого даже не знали. Теперь знают."},{id:"slide",date:"2026-09-18",title:"Горка для всех",who:["sam"],where:"жизнь",text:"Старшие не пускали малышей на горку. Сэм не стал толкаться — он договорился. Теперь горка общая."},{id:"yard",date:"2026-09-25",title:"Давайте вместе?",who:["sam","misha","danya","tim"],where:"жизнь",text:"После праздника двор был весь в фантиках. Сэм сказал: «Давайте вместе?» Через десять минут было чисто."}],jokes:[{id:"key",date:"2025-03-20",hidden:!1,trigger:"ключ",text:"Кто взял ключ? — Никто не брал ключ."},{id:"cover",date:"2025-06-10",hidden:!1,trigger:"прикрывал",text:"Я не отстал. Я прикрывал."},{id:"maps",date:"2025-09-01",hidden:!0,trigger:"карты",text:"Правило №1: не спорить с Лёвой про карты."},{id:"micro",date:"2025-10-15",hidden:!0,trigger:"микрофон",text:"Кто опять забыл включить микрофон?"},{id:"pizza",date:"2026-01-04",hidden:!0,trigger:"пицца",text:"ПИЦЦА-ПРОТОКОЛ АКТИВИРОВАН."},{id:"tactic",date:"2026-04-01",hidden:!0,trigger:"манёвр",text:"Это был тактический манёвр."},{id:"lava",date:"2025-03-20",hidden:!1,trigger:"лава",text:"Своих не бросаем. Даже в лаве."}],transmissions:[{from:"VIN",text:"Добро пожаловать в VIN. Здесь всё ваше."},{from:"VIN",text:"Новая вылазка откроется в субботу. Готовьтесь."},{from:"ПАПА",text:"Горжусь вашим кланом. Конец связи."},{from:"VIN",text:"Напоминание: вода — тоже снаряжение."},{from:"VIN",text:"На маяке нашли пиццу. Расследование продолжается."},{from:"МАМА",text:"Уроки — это тоже миссия. Секретная."},{from:"VIN",text:"Сегодня отличный день, чтобы найти что-нибудь новое."},{from:"VIN",text:"Если увидишь кита — передай привет."},{from:"ПАПА",text:"Тот, кто читает эту передачу, — молодец. Да, ты."},{from:"VIN",text:"Ключ светится ярче, когда вы вместе."},{from:"ПАПА",text:"Видел, как вы позвали новенького. Вот это клан."},{from:"VIN",text:"Клан играет в игры. А защищает — везде."}],signal:{secret:"Частота 14.03 — день, когда всё началось. Ты её нашёл. Об этом знают только свои."},capsule:{openAfterDays:7,text:"Если ты это читаешь — ты вернулся. Настоящий исследователь всегда возвращается. — Папа"},zenith:{message:"Отсюда видно всё, что вы построили. Это только начало."},nadir:{origin:"Всё началось 14 марта 2025 года. Сэм придумал название на перемене: SAM.VIN. Первый матч мы проиграли 0:12. Никто не ушёл. Потом мы поняли: команда нужна не только в игре. С тех пор ключ светится."},night:{from:21,to:7,drowsyFrom:20,story:"Ночью в VIN тихо. Узлы светятся вполсилы, как окна в доме, где все уже спят."},companion:{name:"Искра"}};function fm(t){let e=Math.max(0,Math.min(48,t|0));return{x:e%7/6,y:Math.floor(e/7)/6}}function Av(t){if(typeof t=="number")return Number.isFinite(t)?Math.round(t):NaN;if(typeof t=="string"&&t.trim()!==""){let e=Number(t.trim());return Number.isFinite(e)?Math.round(e):NaN}return NaN}function Co(t){let e=[];if(!Array.isArray(t))return e;let n=new Set;for(let i=0;i<t.length&&e.length<24;i++){let r=t[i];if(!Array.isArray(r)||r.length!==2)continue;let s=Av(r[0]),o=Av(r[1]);if(!(s>=0&&s<=48&&o>=0&&o<=48)||s===o)continue;let a=Math.min(s,o),l=Math.max(s,o),c=a*64+l;n.has(c)||(n.add(c),e.push([a,l]))}return e}function ql(t){let e=t>>>0;return function(){e=e+1831565813>>>0;let i=e;return i=Math.imul(i^i>>>15,i|1),i^=i+Math.imul(i^i>>>7,i|61),((i^i>>>14)>>>0)/4294967296}}function jl(t){let e=2166136261,n=String(t);for(let i=0;i<n.length;i++)e^=n.charCodeAt(i),e=Math.imul(e,16777619);return e>>>0}var bL=.5*(Math.sqrt(3)-1),ML=(3-Math.sqrt(3))/6,SL=new Float32Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,0,1,0,-1]);function dh(t,e,n,i){let r=Math.floor(Math.abs(Number(t)||0)),s=r%10,o=r%100;return o>=11&&o<=14?i:s===1?e:s>=2&&s<=4?n:i}function Cw(t){let e="";for(let n=0;n<t.length;n++)n>0&&(t.length-n)%3===0&&(e+=" "),e+=t[n];return e}function Tv(t,e=2){let n=Number(t)||0,i=Math.abs(n).toFixed(e),r=i.indexOf("."),s=r>=0?i.slice(0,r):i,o=r>=0?i.slice(r):"";return(Number(i)===0?"±":n>0?"+":"−")+Cw(s)+o}var Ev=t=>(t<10?"0":"")+t;function ks(t,e="dd.mm.yyyy"){if(t==null)return"";let n=String(t),i,r,s,o=/^(\d{4})-(\d{2})-(\d{2})$/.exec(n);if(o)i=+o[1],r=+o[2],s=+o[3];else{let l=Date.parse(n);if(!Number.isFinite(l))return"";let c=new Date(l);i=c.getFullYear(),r=c.getMonth()+1,s=c.getDate()}let a=`${Ev(s)}.${Ev(r)}`;return e==="dd.mm"?a:`${a}.${i}`}function dr(t){return String(t??"").toLocaleUpperCase("ru")}var Rv=Object.freeze({"boot.pointer":{text:"вижу тебя.",p:3},"boot.nopointer":{text:"система проснулась.",p:3},"return.sameDay":{text:"снова ты.",p:3},"return.days":{text:"ты вернулся. тебя не было {N} {N:день|дня|дней}.",p:3},"return.days.owner":{text:"привет, {name}. тебя не было {N} {N:день|дня|дней}.",p:3},"return.node":{text:"пока тебя не было: +1 узел.",p:2},night:{text:"спокойной ночи, {name}.",p:3},drowsy:{text:"скоро ночь.",p:3},"night.flinch":{text:"ещё не сплю.",p:1},"tab.back":{text:"вот ты где.",p:3},"drawing.boot":{text:"помню твой рисунок.",p:3},"drawing.saved":{text:"запомнил.",p:1},"glyph.saved":{text:"запомнил.",p:1},"probe.sent":{text:"зонд {code} в пути. вернётся завтра.",p:1},"probe.back":{text:"зонд {code} вернулся. есть запись.",p:2},"transmission.new":{text:"пришла передача.",p:2},"mission.decoded":{text:"вылазка {code} расшифрована.",p:2},"companion.far":{text:"кто-то летит к нам.",p:2},"companion.near":{text:"он ближе. осталось {n} {n:день|дня|дней}.",p:2},"companion.arrived":{text:"он прилетел. его зовут {name}.",p:1},"capsule.open":{text:"капсула открыта.",p:1},birthday:{text:"с днём рождения, {name}!",p:2},anniversary:{text:"сегодня {title}. {years} {years:год|года|лет} назад.",p:2},found:{text:"найдено.",p:1},shard:{text:"осколок {k} из 5 на месте.",p:1},"nadir.open":{text:"внизу что-то открылось.",p:1},rank:{text:"новый ранг: {rank}.",p:1},dizzy:{text:"всё кружится.",p:1},"dizzy.after":{text:"уже лучше.",p:1},whale:{text:"смотри. кит.",p:1},drone:{text:"дрон принёс шутку.",p:1},pull:{text:"ты всё ещё внутри sam.vin.",p:1},relaunch:{text:"сплю. разбуди меня.",p:1},"member.typed":{text:"{callsign} на связи.",p:1},"hint.done":{text:"пока всё найдено.",p:1},"hint.time":{text:"остальное придёт само. возвращайся.",p:1},sealed:{text:"запечатано. осколков {k} из 5.",p:1},"route.missing":{text:"здесь ничего нет. пока.",p:1},"idle.nodes":{text:"{n} {n:узел горит|узла горят|узлов горят}.",p:5},"idle.mission":{text:"вылазка {code} ждёт.",p:5},echo:{text:"эхо от стены: {m} м.",p:4},"guests.in":{text:"гости приняты.",p:1},"guests.none":{text:"покажу сам.",p:4},"sbor.done":{text:"клан откликнулся.",p:1},"code.new":{text:"новое правило клана.",p:1},"lost.here":{text:"кто-то маленький потерялся.",p:4},"lost.saved":{text:"ты не прошёл мимо.",p:1},"lost.gentle":{text:"ты был бережным.",p:1},"pair.here":{text:"двое не слышат друг друга.",p:4},"pair.done":{text:"договорились.",p:1},"pair.fact":{text:"ты помог им услышать друг друга.",p:1},"proposal.saved":{text:"записано. покажи папе.",p:1},"proposal.real":{text:"твоя вылазка {code} стала настоящей.",p:2},"reply.saved":{text:"ответ сохранён. покажи папе.",p:1},"show.dark":{text:"разбуди меня.",p:1}});var fh=Ma.inhaleMs/Ma.periodMs,Cn={value:0,phase:0,periodMs:Ma.periodMs,amp:Ft.reducedMotion?Ma.reducedAmp:1,setPeriod(t){t>0&&(Cn.periodMs=t)},held:!1,hold(t){Cn.held=!!t},mix(t,e){return t+(e-t)*(.5+(Cn.value-.5)*Cn.amp)}};function Pw(t){return t<fh?.5-.5*Math.cos(Math.PI*(t/fh)):.5+.5*Math.cos(Math.PI*((t-fh)/(1-fh)))}var Aa=new Map,Iw=1;function it(t,e){let n=Iw++;return Aa.set(n,{at:pe.now+Math.max(0,t||0),fn:e}),n}function Pn(t){Aa.delete(t)}var Ea=new Set;function Un(t,e,n){let i,r=new Promise(o=>{i=o}),s={start:pe.now,ms:Math.max(0,t||0),fn:e,ease:n||null,resolve:i,live:!0};if(s.ms===0){try{e(1)}finally{i()}return{done:r,cancel(){}}}return Ea.add(s),{done:r,cancel(){s.live&&(s.live=!1,Ea.delete(s),i())}}}var Zl=[],pm=-1,mm=0;function Lw(t,e){t.at<=mm&&Zl.push(e)}function Dw(t){let e=(mm-t.start)/t.ms;if(e>=1){t.live=!1,Ea.delete(t);try{t.fn(1)}catch(n){ot("clock:tween","tween callback threw",n)}t.resolve()}else{let n=e<=0?0:e;try{t.fn(t.ease?t.ease(n):n)}catch(i){ot("clock:tween","tween callback threw",i),t.live=!1,Ea.delete(t),t.resolve()}}}function Nw(t,e){mm=e,Cn.amp=Ft.reducedMotion?Ma.reducedAmp:1;let n=pm<0?0:Math.max(0,e-pm);pm=e;let i=Math.min(1,Math.max(0,+pe.timeScale||0));if(Cn.phase=(Cn.phase+n*i*(Cn.held?0:1)/Cn.periodMs)%1,Cn.value=Pw(Cn.phase),Aa.size){Zl.length=0,Aa.forEach(Lw);for(let r=0;r<Zl.length;r++){let s=Aa.get(Zl[r]);if(s){Aa.delete(Zl[r]);try{s.fn()}catch(o){ot("clock:after","timer callback threw",o)}}}}Ea.size&&Ea.forEach(Dw)}function Cv(){pe.add(Nw,Nt.CLOCK)}try{Cv()}catch{Promise.resolve().then(Cv)}var Pr=[],Si=null,Bs=null,Po=0,gm=0,Ow=0,ph=0;function Fw(t,e){return t.replace(/\{(\w+)(?::([^|}]*)\|([^|}]*)\|([^}]*))?\}/g,(n,i,r,s,o)=>{let a=e?e[i]:void 0;return a==null?n:r!=null?dh(a,r,s,o):String(a)})}function Uw(t){$n.current=t,J.status=t.text,Bs&&(Bs.textContent=t.text),Si&&(Si.classList.remove("is-in"),Si.textContent=t.text,ph&&cancelAnimationFrame(ph),ph=requestAnimationFrame(()=>{ph=0,Si.classList.add("is-in")})),Po&&Pn(Po),Po=it(we.statusHold,kw),_e.emit("status:show",{key:t.key,text:t.text,p:t.p})}function xm(){return!$n.current||pe.now-$n.current.at>=we.statusHold}function kw(){Po=0,Pr.length&&mh(Pr.shift())}function mh(t){t.at=pe.now,Uw(t)}function Bw(t){if(Pr.some(n=>n.text===t.text))return;let e=Pr.length;for(;e>0&&Pr[e-1].p>t.p;)e--;Pr.splice(e,0,t),Pr.length>4&&Pr.pop()}function zw(){for(let t=0;t<2;t++){if(Ow++%2===0)return{key:"idle.nodes",vars:{n:W.litNodes|0}};let n=ft.missions||[];for(let i=0;i<n.length;i++){let r=null;try{r=gh(n[i])}catch{r=null}if(r&&(r.state==="active"||r.state==="new"))return{key:"idle.mission",vars:{code:r.numberShown||n[i].code}}}}return{key:"idle.nodes",vars:{n:W.litNodes|0}}}function Pv(){if(gm=it(we.idleRotate,Pv),J.booting||Pr.length||!xm())return;let t=$n.current;if(t&&t.p<5&&pe.now-t.at<we.idleRotate)return;let e=zw();$n.say(e.key,e.vars)}var $n={current:null,init(t){let e=document.getElementById("chrome");return Si=document.getElementById("status"),!Si&&e&&(Si=document.createElement("p"),Si.id="status",Si.className="t-status",Si.setAttribute("aria-hidden","true"),e.appendChild(Si)),Bs=document.getElementById("status-live"),Bs&&Bs.getAttribute("aria-live")!=="polite"&&Bs.setAttribute("aria-live","polite"),gm||(gm=it(we.idleRotate,Pv)),$n},say(t,e={},n={}){let i=Rv[t];if(!i)return!1;let r={key:t,text:Fw(i.text,e),p:i.p,at:0},s=$n.current;return s&&s.text===r.text&&!xm()?!0:n&&n.force||!s||xm()||r.p===1&&s.p>1?(mh(r),!0):(Bw(r),!0)},clear(){Pr.length=0,$n.current=null,J.status="",Po&&(Pn(Po),Po=0),Si&&(Si.classList.remove("is-in"),Si.textContent=""),Bs&&(Bs.textContent="")}};var Vw={done:"ЗАВЕРШЕНА",active:"В ПУТИ",new:"НОВАЯ",sealed:"ЗАПЕЧАТАНА"};function Gw(t){let e=t.decodeDays!=null?t.decodeDays:t.unlockAtDays;return t.status!=="locked"||!e?null:Math.min(100,Math.round(100*W.distinctDays/e))}function gh(t){let e=t,n=W.data||{},i=e.status,r=Gw(e);i==="sealed"&&n.nadirOpen&&(i="new"),i==="locked"&&r===100&&(i="new");let s=null;if(i==="locked")if(e.decodeDays!=null)s="Расшифровка идёт. Возвращайся завтра — будет больше.";else{let l=Math.max(1,e.unlockAtDays-W.distinctDays);s=`Откроется через ${l} ${dh(l,"день","дня","дней")}.`}else i==="sealed"&&(s="Ключ к ней — в самом низу.");let o=Array.isArray(n.decoded)?n.decoded:[],a=vm(e.code);return{code:e.code,title:e.title,state:i,label:i==="locked"?`СИГНАЛ ЗАШИФРОВАН ${r}%`:Vw[i],p:e.status==="locked"?r:null,numberShown:i==="locked"?"0??":e.code,lockedText:s,decodeReady:e.status==="locked"&&r===100&&!o.includes(e.code),probe:a,canProbe:(i==="done"||i==="active"||i==="new")&&a==="none",mission:e}}function vm(t){let e=W.data&&W.data.probes?W.data.probes[t]:null;return e?e.back?"back":"out":"none"}var ym=["operator","clan","members","missions","achievements","legends","moments","jokes","transmissions","signal","capsule","zenith","nadir","night","companion"],Ov={members:12,missions:24,achievements:24,legends:32,moments:64,jokes:64,transmissions:400},Hw=["G2","A2","B2","D3","E3","G3","A3","B3","D4","E4","G4","A4","B4","D5","E5","G5","A5","B5","D6","E6","G6","A6","B6","D7"],Ww=["D4","G3","A3","B3","E4","G4","A4","B4","D5","E5","G5","A5"],Iv=["stellated","twisted","nested","bipyramid","knot"],Ta=t=>t!==null&&typeof t=="object"&&!Array.isArray(t),Mn=(t,e)=>t[e]!==void 0&&t[e]!==null,Jl=t=>typeof structuredClone=="function"?structuredClone(t):JSON.parse(JSON.stringify(t)),Qn=t=>{try{return JSON.stringify(t).slice(0,40)}catch{return String(t)}};function Ut(t,e,n,i,r){if(typeof t!="string"&&!(typeof t=="number"&&Number.isFinite(t)))return r(`${i}: ${Qn(t)} invalid`),{ok:!1};let s=String(t).normalize("NFC").trim().replace(/\s+/g," ");return s===""&&n?(r(`${i}: empty`),{ok:!1}):(s.length>e&&(s=s.slice(0,e-1)+"…",r(`${i}: longer than ${e}, cut`)),{ok:!0,v:s})}function is(t,e,n){if(typeof t!="string"&&typeof t!="number")return n(`${e}: ${Qn(t)} invalid`),{ok:!1};let i=String(t).trim().toLowerCase().replace(/[^a-z0-9_-]/g,"");return i?(i.length>24&&(i=i.slice(0,24),n(`${e}: longer than 24, cut`)),i!==String(t)&&n(`${e}: ${Qn(t)} → "${i}"`),{ok:!0,v:i}):(n(`${e}: ${Qn(t)} invalid`),{ok:!1})}function Lv(t,e,n){return typeof t=="number"&&Number.isInteger(t)&&t>=0&&t<=999?{ok:!0,v:String(t).padStart(3,"0")}:typeof t=="string"&&/^\d{3}$/.test(t.trim())?{ok:!0,v:t.trim()}:(n(`${e}: ${Qn(t)} invalid`),{ok:!1})}function Dv(t,e,n){if(t<2e3||t>2100||e<1||e>12||n<1)return!1;let i=new Date(Date.UTC(t,e,0)).getUTCDate();return n<=i}function Ca(t,e,n){if(typeof t=="string"){let i=t.trim(),r=/^(\d{4})-(\d{2})-(\d{2})$/.exec(i);if(r&&Dv(+r[1],+r[2],+r[3]))return{ok:!0,v:i};if(r=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(i),r&&Dv(+r[3],+r[2],+r[1]))return{ok:!0,v:`${r[3]}-${r[2]}-${r[1]}`}}return n(`${e}: ${Qn(t)} invalid date`),{ok:!1}}function bm(t,e){return typeof t=="number"?t:typeof t=="string"&&t.trim()!==""?Number(e?t.trim().replace(",","."):t.trim()):NaN}function ns(t,e,n,i,r){let s=bm(t,!1);if(!Number.isFinite(s))return r(`${i}: ${Qn(t)} invalid`),{ok:!1};let o=Math.round(s);return(o<e||o>n)&&(o=Math.min(n,Math.max(e,o)),r(`${i}: ${Qn(t)} clamped → ${o}`)),{ok:!0,v:o}}function $w(t,e,n,i,r,s){let o=bm(t,!0);if(!Number.isFinite(o))return s(`${r}: ${Qn(t)} invalid`),{ok:!1};let a=Math.pow(10,i),l=Math.round(o*a)/a;return(l<e||l>n)&&(l=Math.min(n,Math.max(e,l)),s(`${r}: ${Qn(t)} clamped → ${l}`)),{ok:!0,v:l}}function Fv(t,e,n){return t===!0||t===1||t==="true"||t==="да"?{ok:!0,v:!0}:t===!1||t===0||t==="false"||t==="нет"?{ok:!0,v:!1}:(n(`${e}: ${Qn(t)} invalid`),{ok:!1})}function Ra(t,e,n,i){if(typeof t=="string"){let r=t.trim().toLowerCase();if(e.includes(r))return{ok:!0,v:r}}return i(`${n}: ${Qn(t)} invalid`),{ok:!1}}function Uv(t,e,n){if(!Array.isArray(t))return n(`${e}: not a list`),{ok:!1};let i=Co(t);return i.length!==t.length&&n(`${e}: ${t.length-i.length} edge(s) dropped`),i.length?{ok:!0,v:i}:{ok:!1}}function Nv(t,e,n,i,r,s){let o=bm(t,!0);if(!Number.isFinite(o))return s(`${r}: ${Qn(t)} invalid`),{ok:!1};let a=Math.pow(10,i),l=Math.round(o*a)/a;return l<e||l>n?(s(`${r}: ${Qn(t)} out of range`),{ok:!1}):{ok:!0,v:l}}var Xw=["игра","жизнь"],xh=(t,e,n)=>ct(t,"where",i=>Ra(i,Xw,`${e}.where`,n),null);function ct(t,e,n,i){if(!Mn(t,e))return i;let r=n(t[e]);return r.ok?r.v:i}function kv(t,e,n,i,r,s){if(!Mn(t,e))return[];let o=t[e];if(!Array.isArray(o))return s(`${r}: not a list`),[];let a=[];for(let l=0;l<o.length;l++){if(a.length>=n){s(`${r}: more than ${n}, rest dropped`);break}let c=Ut(o[l],i,!0,`${r}[${l}]`,s);c.ok&&a.push(c.v)}return a}function vh(t,e,n,i,r){if(!Mn(t,e))return[];let s=t[e];if(!Array.isArray(s))return r(`${i}: not a list`),[];let o=[];for(let a=0;a<s.length&&o.length<n;a++){let l=is(s[a],`${i}[${a}]`,r);l.ok&&o.push(l.v)}return s.length>n&&r(`${i}: more than ${n}, rest dropped`),o}function tc(t,e){let n=t,i=2;for(;e.has(n);)n=`${t}-${i++}`;return e.add(n),n}function _m(t){return String(t).toLocaleLowerCase("ru").replace(/[^a-zа-яё0-9]/g,"")}function Lo(t,e,n,i){let r=[],s=Ov[e];for(let o=0;o<t.length;o++){let a=`${e}[${o}]`;if(r.length>=s){i(`${e}: more than ${s}, rest dropped`);break}if(!Ta(t[o])){i(`${a}: not an object, dropped`);continue}let l=n(t[o],o,a);l&&r.push(l)}return r}function Yw(t,e){let n=new Set;return Lo(t,"achievements",(i,r,s)=>{let o=Mn(i,"title")?Ut(i.title,40,!0,`${s}.title`,e):{ok:!1};if(!o.ok)return e(`${s}: no title, dropped`),null;let a=Mn(i,"id")?is(i.id,`${s}.id`,e):{ok:!1},l=tc(a.ok?a.v:`a${r+1}`,n),c=ct(i,"earned",u=>Fv(u,`${s}.earned`,e),!1);return{id:l,title:o.v,shape:ct(i,"shape",u=>Ra(u,Iv,`${s}.shape`,e),Iv[r%5]),rarity:ct(i,"rarity",u=>Ra(u,["обычная","редкая","легендарная"],`${s}.rarity`,e),"обычная"),earned:c,date:c?ct(i,"date",u=>Ca(u,`${s}.date`,e),null):null,who:vh(i,"who",12,`${s}.who`,e),text:ct(i,"text",u=>Ut(u,200,!1,`${s}.text`,e),""),where:xh(i,s,e)}},e)}function qw(t,e){let n=new Set(["workshop"]);return Lo(t,"members",(i,r,s)=>{let o=Mn(i,"name")?Ut(i.name,24,!0,`${s}.name`,e):{ok:!1};if(!o.ok)return e(`${s}: no name, dropped`),null;let a=Mn(i,"id")?is(i.id,`${s}.id`,e):{ok:!1},l=tc(a.ok?a.v:`m${r+1}`,n),c=Ww[r%12];if(Mn(i,"note")){let u=typeof i.note=="string"?i.note.trim().toUpperCase():"";Hw.includes(u)?c=u:e(`${s}.note: ${Qn(i.note)} invalid → "${c}"`)}return{id:l,name:o.v,callsign:ct(i,"callsign",u=>Ut(u,16,!1,`${s}.callsign`,e),""),role:ct(i,"role",u=>Ut(u,32,!1,`${s}.role`,e),""),status:ct(i,"status",u=>Ra(u,["на связи","в пути","отдыхает"],`${s}.status`,e),"на связи"),level:ct(i,"level",u=>ns(u,0,99,`${s}.level`,e),1),missions:ct(i,"missions",u=>ns(u,0,999,`${s}.missions`,e),0),seed:ct(i,"seed",u=>ns(u,0,9999,`${s}.seed`,e),jl(l)%100),note:c,glyph:ct(i,"glyph",u=>Uv(u,`${s}.glyph`,e),null),trait:ct(i,"trait",u=>Ut(u,120,!1,`${s}.trait`,e),""),joke:ct(i,"joke",u=>Ut(u,160,!1,`${s}.joke`,e),""),achievements:vh(i,"achievements",16,`${s}.achievements`,e)}},e)}function jw(t,e){let n=new Set;for(let r of t)if(Ta(r)&&Mn(r,"code")){let s=Lv(r.code,"",()=>{});s.ok&&n.add(s.v)}let i=new Set;return Lo(t,"missions",(r,s,o)=>{let a=null;if(Mn(r,"code")){let h=Lv(r.code,`${o}.code`,e);if(h.ok&&(a=h.v,i.has(a)))return e(`${o}: duplicate code ${a}, dropped`),null}if(a===null&&(a=String(s+1).padStart(3,"0"),i.has(a)||n.has(a)))return e(`${o}: no code (${a} taken), dropped`),null;i.add(a);let l=ct(r,"status",h=>Ra(h,["done","active","new","locked","sealed"],`${o}.status`,e),"new"),c=ct(r,"decodeDays",h=>ns(h,1,365,`${o}.decodeDays`,e),null),u=ct(r,"unlockAtDays",h=>ns(h,1,365,`${o}.unlockAtDays`,e),null);return l!=="locked"?(c=null,u=null):c!=null&&u!=null?(u=null,e(`${o}: locked with both day fields → decodeDays kept`)):c==null&&u==null&&(c=7,e(`${o}: locked without days → decodeDays 7`)),{code:a,title:ct(r,"title",h=>Ut(h,48,!0,`${o}.title`,e),`Вылазка ${a}`),status:l,brief:ct(r,"brief",h=>Ut(h,240,!1,`${o}.brief`,e),""),conditions:kv(r,"conditions",6,40,`${o}.conditions`,e),crew:vh(r,"crew",12,`${o}.crew`,e),result:ct(r,"result",h=>Ut(h,160,!1,`${o}.result`,e),""),reward:ct(r,"reward",h=>is(h,`${o}.reward`,e),null),log:ct(r,"log",h=>Ut(h,200,!1,`${o}.log`,e),""),decodeDays:c,unlockAtDays:u,proposedBy:ct(r,"proposedBy",h=>is(h,`${o}.proposedBy`,e),null),where:xh(r,o,e)}},e)}function Zw(t,e){let n=new Set;return Lo(t,"legends",(i,r,s)=>{let o=Mn(i,"date")?Ca(i.date,`${s}.date`,e):{ok:!1},a=Mn(i,"title")?Ut(i.title,48,!0,`${s}.title`,e):{ok:!1};if(!o.ok||!a.ok)return e(`${s}: needs date and title, dropped`),null;let l=Mn(i,"id")?is(i.id,`${s}.id`,e):{ok:!1};return{id:tc(l.ok?l.v:`l${r+1}`,n),date:o.v,kind:ct(i,"kind",c=>Ra(c,["победа","смешное","эпичное"],`${s}.kind`,e),"эпичное"),title:a.v,text:ct(i,"text",c=>Ut(c,300,!1,`${s}.text`,e),""),where:xh(i,s,e)}},e)}function Kw(t,e){let n=new Set;return Lo(t,"moments",(i,r,s)=>{let o=Mn(i,"date")?Ca(i.date,`${s}.date`,e):{ok:!1},a=Mn(i,"title")?Ut(i.title,48,!0,`${s}.title`,e):{ok:!1};if(!o.ok||!a.ok)return e(`${s}: needs date and title, dropped`),null;let l=Mn(i,"id")?is(i.id,`${s}.id`,e):{ok:!1};return{id:tc(l.ok?l.v:`mo${r+1}`,n),date:o.v,title:a.v,who:vh(i,"who",12,`${s}.who`,e),text:ct(i,"text",c=>Ut(c,300,!0,`${s}.text`,e),a.v),where:xh(i,s,e)}},e)}function Jw(t,e){let n=new Set;return Lo(t,"jokes",(i,r,s)=>{let o=Mn(i,"text")?Ut(i.text,160,!0,`${s}.text`,e):{ok:!1};if(!o.ok)return e(`${s}: no text, dropped`),null;let a=Mn(i,"id")?is(i.id,`${s}.id`,e):{ok:!1},l=ct(i,"trigger",c=>Ut(c,24,!1,`${s}.trigger`,e),"");return{id:tc(a.ok?a.v:`j${r+1}`,n),date:ct(i,"date",c=>Ca(c,`${s}.date`,e),null),hidden:ct(i,"hidden",c=>Fv(c,`${s}.hidden`,e),!1),trigger:_m(l),text:o.v}},e)}function Qw(t,e){return Lo(t,"transmissions",(n,i,r)=>{let s=Mn(n,"text")?Ut(n.text,240,!0,`${r}.text`,e):{ok:!1};return s.ok?{from:ct(n,"from",o=>Ut(o,16,!0,`${r}.from`,e),"VIN"),text:s.v}:(e(`${r}: no text, dropped`),null)},e)}function eA(t,e){let n=Ro.clan;return{name:ct(t,"name",i=>Ut(i,24,!0,"clan.name",e),n.name),motto:ct(t,"motto",i=>Ut(i,80,!0,"clan.motto",e),n.motto),about:ct(t,"about",i=>Ut(i,120,!1,"clan.about",e),n.about),founded:ct(t,"founded",i=>Ca(i,"clan.founded",e),n.founded),frequency:ct(t,"frequency",i=>$w(i,0,99.99,2,"clan.frequency",e),n.frequency),sigil:ct(t,"sigil",i=>Uv(i,"clan.sigil",e),Co(n.sigil)),code:tA(t,e)}}function tA(t,e){let n=Ro.clan.code;if(!Mn(t,"code"))return n.slice();let i=t.code;if(!Array.isArray(i))return e("clan.code: not a list, default used"),n.slice();i.length>7&&e("clan.code: more than 7, rest dropped");let r=[];for(let s=0;s<7;s++){if(s>=i.length){r.push(n[s]);continue}let o=i[s];if(typeof o!="string"){e(`clan.code[${s}]: ${Qn(o)} invalid → ""`),r.push("");continue}let a=Ut(o,40,!1,`clan.code[${s}]`,e);r.push(a.ok?a.v:"")}return r}function nA(t,e,n){let i=Ro.operator,r=Mn(t,"name")?Ut(t.name,24,!0,"operator.name",n):{ok:!1},s,o=Mn(t,"id")?is(t.id,"operator.id",n):{ok:!1};if(o.ok)s=o.v,e.some(c=>c.id===s)||n(`operator.id: "${s}" matches no member (kept)`);else{let c=r.ok?e.find(u=>u.name.toLocaleLowerCase("ru")===r.v.toLocaleLowerCase("ru")):null;s=c?c.id:e.length?e[0].id:"sam"}let a=e.find(c=>c.id===s)||null,l=r.ok?r.v:a?a.name:i.name;return{id:s,name:l,aliases:kv(t,"aliases",8,24,"operator.aliases",n),callsign:ct(t,"callsign",c=>Ut(c,16,!1,"operator.callsign",n),a?a.callsign:""),birthday:ct(t,"birthday",c=>Ca(c,"operator.birthday",n),null),heightM:ct(t,"heightM",c=>Nv(c,.8,2.2,2,"operator.heightM",n),i.heightM!=null?i.heightM:1.3),papaHeightM:ct(t,"papaHeightM",c=>Nv(c,1.4,2.3,2,"operator.papaHeightM",n),null)}}function iA(t,e,n){let i=Ro,r=(s,o)=>{try{t[s]=o(Ta(e[s])?e[s]:i[s])}catch{n(`${s}: crashed, default used`),t[s]=Jl(i[s])}};r("signal",s=>({secret:ct(s,"secret",o=>Ut(o,240,!0,"signal.secret",n),i.signal.secret)})),r("capsule",s=>({openAfterDays:ct(s,"openAfterDays",o=>ns(o,0,365,"capsule.openAfterDays",n),i.capsule.openAfterDays),text:ct(s,"text",o=>Ut(o,300,!0,"capsule.text",n),i.capsule.text)})),r("zenith",s=>({message:ct(s,"message",o=>Ut(o,160,!0,"zenith.message",n),i.zenith.message)})),r("nadir",s=>({origin:ct(s,"origin",o=>Ut(o,400,!0,"nadir.origin",n),i.nadir.origin)})),r("night",s=>({from:ct(s,"from",o=>ns(o,0,23,"night.from",n),i.night.from),to:ct(s,"to",o=>ns(o,0,23,"night.to",n),i.night.to),drowsyFrom:ct(s,"drowsyFrom",o=>ns(o,0,23,"night.drowsyFrom",n),i.night.drowsyFrom),story:ct(s,"story",o=>Ut(o,240,!0,"night.story",n),i.night.story)})),r("companion",s=>({name:ct(s,"name",o=>Ut(o,16,!0,"companion.name",n),i.companion.name)}))}function rA(t){let e=[],n=u=>{e.push(u)},i=Ro,r=t;Ta(r)||(r={});let s={},o=[];try{o=Object.keys(r)}catch{o=[]}for(let u of o)ym.includes(u)||n(`unknown key ${u}`);let a={};for(let u of ym){let h;try{h=r[u]}catch{h=void 0}let f=u in Ov?Array.isArray(h):Ta(h);!f&&h!==void 0&&n(`${u}: default used`),a[u]=f?h:Jl(i[u])}let l=[["achievements",Yw],["members",qw],["missions",jw],["legends",Zw],["moments",Kw],["jokes",Jw],["transmissions",Qw]];for(let[u,h]of l)try{s[u]=h(a[u],n)}catch{n(`${u}: crashed, default used`);try{s[u]=h(Jl(i[u]),()=>{})}catch{s[u]=[]}}try{s.clan=eA(a.clan,n)}catch{n("clan: crashed, default used"),s.clan=Jl(i.clan)}try{s.operator=nA(a.operator,s.members,n)}catch{n("operator: crashed, default used"),s.operator={...Jl(i.operator),aliases:[]}}iA(s,a,n);try{let u=new Set(s.members.map(f=>f.id)),h=new Set(s.achievements.map(f=>f.id)),d=(f,g,x)=>{let p=[];for(let m of f){if(!g.has(m)){n(`${x}: unknown "${m}" removed`);continue}p.includes(m)||p.push(m)}return p};s.members.forEach((f,g)=>{f.achievements=d(f.achievements,h,`members[${g}].achievements`)}),s.missions.forEach((f,g)=>{f.crew=d(f.crew,u,`missions[${g}].crew`),f.reward!=null&&!h.has(f.reward)&&(n(`missions[${g}].reward: unknown "${f.reward}" removed`),f.reward=null),f.proposedBy!=null&&!u.has(f.proposedBy)&&(n(`missions[${g}].proposedBy: unknown "${f.proposedBy}" removed`),f.proposedBy=null)}),s.achievements.forEach((f,g)=>{f.who=d(f.who,u,`achievements[${g}].who`)}),s.moments.forEach((f,g)=>{f.who=d(f.who,u,`moments[${g}].who`)})}catch{n("refs: crashed")}for(let u of s.jokes)u.date==null&&(u.date=s.clan.founded);try{let u=[];for(let d of s.operator.aliases){let f=_m(d);f.length>=2&&f.length<=24&&!u.includes(f)&&u.push(f)}let h=_m(s.operator.name);h.length>=2&&!u.includes(h)&&u.push(h),s.operator.aliases=u}catch{s.operator.aliases=[]}let c={};for(let u of ym)c[u]=s[u];return{world:c,issues:e}}function Bv(t){if(t&&typeof t=="object"&&!Object.isFrozen(t)){Object.freeze(t);for(let e of Object.keys(t))Bv(t[e])}return t}var ec,zv="file";try{ec=typeof window<"u"?window.SAMVIN_WORLD:void 0}catch{ec=void 0}Ta(ec)||(zv="default",ec=Ro,ot("world","world.js missing or broken — using built-in defaults"));var Ql=rA(ec);Ql.issues.length&&ot("world-issues",`world.js: ${Ql.issues.length} issue(s)`,Ql.issues);var Vv=zv,Gv=Object.freeze(Ql.issues.slice()),ft=Bv(Ql.world);var iD=Object.freeze({members:"Здесь пока никого нет.",missions:"Вылазок пока нет.",achievements:"Трофеев пока нет.",transmissions:"Передач пока нет.",probeLog:"Зонд вернулся. Записи нет."}),sA=/^S(0[1-9]|1[0-4])$/;function Hv(){let t=W.data||{},e=t.transmissions||{delivered:0,read:[]},n=Math.max(0,Math.min(e.delivered|0,ft.transmissions.length)),i=Array.isArray(e.read)?e.read:[],r=0;for(let u=0;u<n;u++)i.includes(u)||r++;let s=new Set(ft.jokes.map(u=>u.id)),o=new Set((Array.isArray(t.jokesFound)?t.jokesFound:[]).filter(u=>s.has(u))).size,a=0,l=0;for(let u of ft.missions)gh(u).state==="done"&&a++,vm(u.code)==="out"&&l++;let c=t.found&&typeof t.found=="object"?Object.keys(t.found).filter(u=>sA.test(u)).length:0;return{delivered:n,unread:r,legends:ft.legends.length,moments:ft.moments.length,jokesFound:o,members:ft.members.length,online:ft.members.filter(u=>u.status==="на связи").length,founded:ks(ft.clan.founded,"dd.mm.yyyy"),daysSinceFounded:Math.max(0,Io(ft.clan.founded,W.today||ft.clan.founded)),missions:ft.missions.length,done:a,probesOut:l,earned:ft.achievements.filter(u=>u.earned).length,achievements:ft.achievements.length,secrets:c,shards:t.shards|0,nadirOpen:!!t.nadirOpen,life:ft.missions.filter(u=>u.where==="жизнь").length}}var oA=864e5,Wv=t=>(t<10?"0":"")+t,yh=t=>t instanceof Date?t:new Date(t??rs());function rs(){return Date.now()}function _h(t){let e=yh(t);return`${e.getFullYear()}-${Wv(e.getMonth()+1)}-${Wv(e.getDate())}`}function $v(t){let e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(t||""));return e?Math.round(Date.UTC(+e[1],+e[2]-1,+e[3])/oA):NaN}function Io(t,e){let n=$v(t),i=$v(e);return Number.isFinite(n)&&Number.isFinite(i)?i-n:0}function Xv(t,e,n){return e>n?t>=e||t<n:e<n?t>=e&&t<n:!1}function Mm(t){let e=ft.night;return Xv(yh(t).getHours(),e.from,e.to)}function Yv(t){let e=ft.night;return Mm(t)||e.drowsyFrom===e.from?!1:Xv(yh(t).getHours(),e.drowsyFrom,e.from)}function aA(t){let e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(t||""));return e?{y:+e[1],m:+e[2],d:+e[3]}:null}function Sm(t){let e=aA(ft.operator.birthday);if(!e)return!1;let n=yh(t),i=n.getFullYear(),r=n.getMonth()+1,s=n.getDate();return e.m===2&&e.d===29&&!(i%4===0&&i%100!==0||i%400===0)?r===2&&s===28:r===e.m&&s===e.d}var Sy=0,t0=1,wy=2;var Pc=1,Ay=2,Qa=3,Br=0,xi=1,zr=2,Ai=0,vr=1,Vo=2,n0=3,i0=4,Pd=5;var ms=100,Ey=101,Ty=102,Ry=103,Cy=104,Py=200,Ic=201,Iy=202,Ly=203,r0=204,el=205,Dy=206,Ny=207,Oy=208,Fy=209,Uy=210,ky=211,By=212,zy=213,Vy=214,Yh=0,qh=1,jh=2,$a=3,Zh=4,Kh=5,Jh=6,Qh=7,s0=0,Gy=1,Hy=2,Ui=0,o0=1,a0=2,l0=3,c0=4,u0=5,h0=6,d0=7;var f0=300,Js=301,Go=302,Id=303,Ld=304,Lc=306,ed=1e3,ii=1001,td=1002,Gn=1003,Wy=1004;var Dc=1005;var Et=1006,Dd=1007;var Qs=1008;var ki=1009,p0=1010,m0=1011,tl=1012,Nd=1013,yr=1014,er=1015,ri=1016,Od=1017,Fd=1018,nl=1020,g0=35902,x0=35899,v0=1021,y0=1022,Xn=1023,Dr=1026,eo=1027,Ud=1028,kd=1029,to=1030,Bd=1031;var zd=1033,Nc=33776,Oc=33777,Fc=33778,Uc=33779,Vd=35840,Gd=35841,Hd=35842,Wd=35843,$d=36196,Xd=37492,Yd=37496,qd=37488,jd=37489,kc=37490,Zd=37491,Kd=37808,Jd=37809,Qd=37810,ef=37811,tf=37812,nf=37813,rf=37814,sf=37815,of=37816,af=37817,lf=37818,cf=37819,uf=37820,hf=37821,df=36492,ff=36494,pf=36495,mf=36283,gf=36284,Bc=36285,xf=36286;var cc=2300,nd=2301,$h=2302,Ym=2303,qm=2400,jm=2401,Zm=2402;var $y=3200;var _0=0,Xy=1,gs="",Oi="srgb",ko="srgb-linear",uc="linear",$t="srgb";var Xh=7680;var Yy=519,qy=512,jy=513,Zy=514,vf=515,Ky=516,Jy=517,yf=518,Qy=519,b0=35044;var M0="300 es",xr=2e3,hc=2001;function cA(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function uA(t){return ArrayBuffer.isView(t)&&!(t instanceof DataView)}function dc(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function e_(){let t=dc("canvas");return t.style.display="block",t}var qv={},Xa=null;function fc(...t){let e="THREE."+t.shift();Xa?Xa("log",e,...t):console.log(e,...t)}function t_(t){let e=t[0];if(typeof e=="string"&&e.startsWith("TSL:")){let n=t[1];n&&n.isStackTrace?t[0]+=" "+n.getLocation():t[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return t}function ut(...t){t=t_(t);let e="THREE."+t.shift();if(Xa)Xa("warn",e,...t);else{let n=t[0];n&&n.isStackTrace?console.warn(n.getError(e)):console.warn(e,...t)}}function dt(...t){t=t_(t);let e="THREE."+t.shift();if(Xa)Xa("error",e,...t);else{let n=t[0];n&&n.isStackTrace?console.error(n.getError(e)):console.error(e,...t)}}function Uo(...t){let e=t.join(" ");e in qv||(qv[e]=!0,ut(...t))}function n_(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}var i_={[Yh]:qh,[jh]:Jh,[Zh]:Qh,[$a]:Kh,[qh]:Yh,[Jh]:jh,[Qh]:Zh,[Kh]:$a},Nr=class{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){let i=this._listeners;if(i===void 0)return;let r=i[e];if(r!==void 0){let s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){let n=this._listeners;if(n===void 0)return;let i=n[e.type];if(i!==void 0){e.target=this;let r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}},ei=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var wm=Math.PI/180,id=180/Math.PI;function Xs(){let t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(ei[t&255]+ei[t>>8&255]+ei[t>>16&255]+ei[t>>24&255]+"-"+ei[e&255]+ei[e>>8&255]+"-"+ei[e>>16&15|64]+ei[e>>24&255]+"-"+ei[n&63|128]+ei[n>>8&255]+"-"+ei[n>>16&255]+ei[n>>24&255]+ei[i&255]+ei[i>>8&255]+ei[i>>16&255]+ei[i>>24&255]).toLowerCase()}function Rt(t,e,n){return Math.max(e,Math.min(n,t))}function hA(t,e){return(t%e+e)%e}function Am(t,e,n){return(1-n)*t+n*e}function Lr(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:case Uint8ClampedArray:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function tn(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var T0=class T0{constructor(e=0,n=0){this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Rt(this.x,e.x,n.x),this.y=Rt(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=Rt(this.x,e,n),this.y=Rt(this.y,e,n),this}clampLength(e,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Rt(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(e)/n;return Math.acos(Rt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){let i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};T0.prototype.isVector2=!0;var ht=T0,Qi=class{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],h=i[r+3],d=s[o+0],f=s[o+1],g=s[o+2],x=s[o+3];if(h!==x||l!==d||c!==f||u!==g){let p=l*d+c*f+u*g+h*x;p<0&&(d=-d,f=-f,g=-g,x=-x,p=-p);let m=1-a;if(p<.9995){let b=Math.acos(p),E=Math.sin(b);m=Math.sin(m*b)/E,a=Math.sin(a*b)/E,l=l*m+d*a,c=c*m+f*a,u=u*m+g*a,h=h*m+x*a}else{l=l*m+d*a,c=c*m+f*a,u=u*m+g*a,h=h*m+x*a;let b=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=b,c*=b,u*=b,h*=b}}e[n]=l,e[n+1]=c,e[n+2]=u,e[n+3]=h}static multiplyQuaternionsFlat(e,n,i,r,s,o){let a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],h=s[o],d=s[o+1],f=s[o+2],g=s[o+3];return e[n]=a*g+u*h+l*f-c*d,e[n+1]=l*g+u*d+c*h-a*f,e[n+2]=c*g+u*f+a*d-l*h,e[n+3]=u*g-a*h-l*d-c*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){let i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),h=a(s/2),d=l(i/2),f=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"YXZ":this._x=d*u*h+c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"ZXY":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h-d*f*g;break;case"ZYX":this._x=d*u*h-c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h+d*f*g;break;case"YZX":this._x=d*u*h+c*f*g,this._y=c*f*h+d*u*g,this._z=c*u*g-d*f*h,this._w=c*u*h-d*f*g;break;case"XZY":this._x=d*u*h-c*f*g,this._y=c*f*h-d*u*g,this._z=c*u*g+d*f*h,this._w=c*u*h+d*f*g;break;default:ut("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){let i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],a=n[5],l=n[9],c=n[2],u=n[6],h=n[10],d=i+a+h;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(u-l)*f,this._y=(s-c)*f,this._z=(o-r)*f}else if(i>a&&i>h){let f=2*Math.sqrt(1+i-a-h);this._w=(u-l)/f,this._x=.25*f,this._y=(r+o)/f,this._z=(s+c)/f}else if(a>h){let f=2*Math.sqrt(1+a-i-h);this._w=(s-c)/f,this._x=(r+o)/f,this._y=.25*f,this._z=(l+u)/f}else{let f=2*Math.sqrt(1+h-i-a);this._w=(o-r)/f,this._x=(s+c)/f,this._y=(l+u)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Rt(this.dot(e),-1,1)))}rotateTowards(e,n){let i=this.angleTo(e);if(i===0)return this;let r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){let i=e._x,r=e._y,s=e._z,o=e._w,a=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){let i=e._x,r=e._y,s=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,r=-r,s=-s,o=-o,a=-a);let l=1-n;if(a<.9995){let c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,n=Math.sin(n*c)/u,this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+o*n,this._onChangeCallback()}else this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+o*n,this.normalize();return this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){let e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},R0=class R0{constructor(e=0,n=0,i=0){this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(jv.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(jv.setFromAxisAngle(e,n))}applyMatrix3(e){let n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){let n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*n-s*r),h=2*(s*i-o*n);return this.x=n+l*c+o*h-a*u,this.y=i+l*u+a*c-s*h,this.z=r+l*h+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Rt(this.x,e.x,n.x),this.y=Rt(this.y,e.y,n.y),this.z=Rt(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=Rt(this.x,e,n),this.y=Rt(this.y,e,n),this.z=Rt(this.z,e,n),this}clampLength(e,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Rt(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){let i=e.x,r=e.y,s=e.z,o=n.x,a=n.y,l=n.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){let n=e.lengthSq();if(n===0)return this.set(0,0,0);let i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Em.copy(this).projectOnVector(e),this.sub(Em)}reflect(e){return this.sub(Em.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(e)/n;return Math.acos(Rt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){let r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){let n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){let n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};R0.prototype.isVector3=!0;var C=R0,Em=new C,jv=new Qi,C0=class C0{constructor(e,n,i,r,s,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c)}set(e,n,i,r,s,o,a,l,c){let u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=n,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){let i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],h=i[7],d=i[2],f=i[5],g=i[8],x=r[0],p=r[3],m=r[6],b=r[1],E=r[4],v=r[7],S=r[2],w=r[5],T=r[8];return s[0]=o*x+a*b+l*S,s[3]=o*p+a*E+l*w,s[6]=o*m+a*v+l*T,s[1]=c*x+u*b+h*S,s[4]=c*p+u*E+h*w,s[7]=c*m+u*v+h*T,s[2]=d*x+f*b+g*S,s[5]=d*p+f*E+g*w,s[8]=d*m+f*v+g*T,this}multiplyScalar(e){let n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){let e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return n*o*u-n*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){let e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,d=a*l-u*s,f=c*s-o*l,g=n*h+i*d+r*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return e[0]=h*x,e[1]=(r*c-u*i)*x,e[2]=(a*i-r*o)*x,e[3]=d*x,e[4]=(u*n-r*l)*x,e[5]=(r*s-a*n)*x,e[6]=f*x,e[7]=(i*l-c*n)*x,e[8]=(o*n-i*s)*x,this}transpose(){let e,n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,a){let l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+n,0,0,1),this}scale(e,n){return Uo("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Tm.makeScale(e,n)),this}rotate(e){return Uo("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Tm.makeRotation(-e)),this}translate(e,n){return Uo("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Tm.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){let n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){let n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){let i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};C0.prototype.isMatrix3=!0;var gt=C0,Tm=new gt,Zv=new gt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Kv=new gt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function dA(){let t={enabled:!0,workingColorSpace:ko,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===$t&&(r.r=us(r.r),r.g=us(r.g),r.b=us(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===$t&&(r.r=Wa(r.r),r.g=Wa(r.g),r.b=Wa(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===gs?uc:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Uo("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),t.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Uo("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),t.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[ko]:{primaries:e,whitePoint:i,transfer:uc,toXYZ:Zv,fromXYZ:Kv,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Oi},outputColorSpaceConfig:{drawingBufferColorSpace:Oi}},[Oi]:{primaries:e,whitePoint:i,transfer:$t,toXYZ:Zv,fromXYZ:Kv,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Oi}}}),t}var Mt=dA();function us(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Wa(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}var Pa,rd=class{static getDataURL(e,n="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Pa===void 0&&(Pa=dc("canvas")),Pa.width=e.width,Pa.height=e.height;let r=Pa.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Pa}return i.toDataURL(n)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let n=dc("canvas");n.width=e.width,n.height=e.height;let i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=us(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){let n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(us(n[i]/255)*255):n[i]=us(n[i]);return{data:n,width:e.width,height:e.height}}else return ut("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},fA=0,Ya=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:fA++}),this.uuid=Xs(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?e.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?e.set(n.displayWidth,n.displayHeight,0):n!==null?e.set(n.width,n.height,n.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Rm(r[o].image)):s.push(Rm(r[o]))}else s=Rm(r);i.url=s}return n||(e.images[this.uuid]=i),i}};function Rm(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?rd.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(ut("Texture: Unable to serialize Texture."),{})}var pA=0,Cm=new C,mi=class t extends Nr{constructor(e=t.DEFAULT_IMAGE,n=t.DEFAULT_MAPPING,i=ii,r=ii,s=Et,o=Qs,a=Xn,l=ki,c=t.DEFAULT_ANISOTROPY,u=gs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:pA++}),this.uuid=Xs(),this.name="",this.source=new Ya(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ht(0,0),this.repeat=new ht(1,1),this.center=new ht(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new gt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Cm).x}get height(){return this.source.getSize(Cm).y}get depth(){return this.source.getSize(Cm).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let n in e){let i=e[n];if(i===void 0){ut(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}let r=this[n];if(r===void 0){ut(`Texture.setValues(): property '${n}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[n]=i}}toJSON(e){let n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==f0)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ed:e.x=e.x-Math.floor(e.x);break;case ii:e.x=e.x<0?0:1;break;case td:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ed:e.y=e.y-Math.floor(e.y);break;case ii:e.y=e.y<0?0:1;break;case td:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};mi.DEFAULT_IMAGE=null;mi.DEFAULT_MAPPING=f0;mi.DEFAULT_ANISOTROPY=1;var P0=class P0{constructor(e=0,n=0,i=0,r=1){this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s,l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],f=l[5],g=l[9],x=l[2],p=l[6],m=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-x)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+x)<.1&&Math.abs(g+p)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;let E=(c+1)/2,v=(f+1)/2,S=(m+1)/2,w=(u+d)/4,T=(h+x)/4,y=(g+p)/4;return E>v&&E>S?E<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(E),r=w/i,s=T/i):v>S?v<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(v),i=w/r,s=y/r):S<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(S),i=T/s,r=y/s),this.set(i,r,s,n),this}let b=Math.sqrt((p-g)*(p-g)+(h-x)*(h-x)+(d-u)*(d-u));return Math.abs(b)<.001&&(b=1),this.x=(p-g)/b,this.y=(h-x)/b,this.z=(d-u)/b,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(e){let n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Rt(this.x,e.x,n.x),this.y=Rt(this.y,e.y,n.y),this.z=Rt(this.z,e.z,n.z),this.w=Rt(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=Rt(this.x,e,n),this.y=Rt(this.y,e,n),this.z=Rt(this.z,e,n),this.w=Rt(this.w,e,n),this}clampLength(e,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Rt(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};P0.prototype.isVector4=!0;var Ot=P0,sd=class extends Nr{constructor(e=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Et,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=i.depth,this.scissor=new Ot(0,0,e,n),this.scissorTest=!1,this.viewport=new Ot(0,0,e,n),this.textures=[];let r={width:e,height:n,depth:i.depth},s=new mi(r),o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){let n={minFilter:Et,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(n.mapping=e.mapping),e.wrapS!==void 0&&(n.wrapS=e.wrapS),e.wrapT!==void 0&&(n.wrapT=e.wrapT),e.wrapR!==void 0&&(n.wrapR=e.wrapR),e.magFilter!==void 0&&(n.magFilter=e.magFilter),e.minFilter!==void 0&&(n.minFilter=e.minFilter),e.format!==void 0&&(n.format=e.format),e.type!==void 0&&(n.type=e.type),e.anisotropy!==void 0&&(n.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(n.colorSpace=e.colorSpace),e.flipY!==void 0&&(n.flipY=e.flipY),e.generateMipmaps!==void 0&&(n.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(n.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;let r=Object.assign({},e.textures[n].image);this.textures[n].source=new Ya(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let n=e.depthTexture.clone();n.renderTarget=null,this.depthTexture=n}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ln=class extends sd{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}},pc=class extends mi{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Gn,this.minFilter=Gn,this.wrapR=ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var od=class extends mi{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Gn,this.minFilter=Gn,this.wrapR=ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var Cd=class Cd{constructor(e,n,i,r,s,o,a,l,c,u,h,d,f,g,x,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c,u,h,d,f,g,x,p)}set(e,n,i,r,s,o,a,l,c,u,h,d,f,g,x,p){let m=this.elements;return m[0]=e,m[4]=n,m[8]=i,m[12]=r,m[1]=s,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=u,m[10]=h,m[14]=d,m[3]=f,m[7]=g,m[11]=x,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Cd().fromArray(this.elements)}copy(e){let n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){let n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){let n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return this.determinantAffine()===0?(e.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let n=this.elements,i=e.elements,r=1/Ia.setFromMatrixColumn(e,0).length(),s=1/Ia.setFromMatrixColumn(e,1).length(),o=1/Ia.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){let n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){let d=o*u,f=o*h,g=a*u,x=a*h;n[0]=l*u,n[4]=-l*h,n[8]=c,n[1]=f+g*c,n[5]=d-x*c,n[9]=-a*l,n[2]=x-d*c,n[6]=g+f*c,n[10]=o*l}else if(e.order==="YXZ"){let d=l*u,f=l*h,g=c*u,x=c*h;n[0]=d+x*a,n[4]=g*a-f,n[8]=o*c,n[1]=o*h,n[5]=o*u,n[9]=-a,n[2]=f*a-g,n[6]=x+d*a,n[10]=o*l}else if(e.order==="ZXY"){let d=l*u,f=l*h,g=c*u,x=c*h;n[0]=d-x*a,n[4]=-o*h,n[8]=g+f*a,n[1]=f+g*a,n[5]=o*u,n[9]=x-d*a,n[2]=-o*c,n[6]=a,n[10]=o*l}else if(e.order==="ZYX"){let d=o*u,f=o*h,g=a*u,x=a*h;n[0]=l*u,n[4]=g*c-f,n[8]=d*c+x,n[1]=l*h,n[5]=x*c+d,n[9]=f*c-g,n[2]=-c,n[6]=a*l,n[10]=o*l}else if(e.order==="YZX"){let d=o*l,f=o*c,g=a*l,x=a*c;n[0]=l*u,n[4]=x-d*h,n[8]=g*h+f,n[1]=h,n[5]=o*u,n[9]=-a*u,n[2]=-c*u,n[6]=f*h+g,n[10]=d-x*h}else if(e.order==="XZY"){let d=o*l,f=o*c,g=a*l,x=a*c;n[0]=l*u,n[4]=-h,n[8]=c*u,n[1]=d*h+x,n[5]=o*u,n[9]=f*h-g,n[2]=g*h-f,n[6]=a*u,n[10]=x*h+d}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(mA,e,gA)}lookAt(e,n,i){let r=this.elements;return Di.subVectors(e,n),Di.lengthSq()===0&&(Di.z=1),Di.normalize(),zs.crossVectors(i,Di),zs.lengthSq()===0&&(Math.abs(i.z)===1?Di.x+=1e-4:Di.z+=1e-4,Di.normalize(),zs.crossVectors(i,Di)),zs.normalize(),bh.crossVectors(Di,zs),r[0]=zs.x,r[4]=bh.x,r[8]=Di.x,r[1]=zs.y,r[5]=bh.y,r[9]=Di.y,r[2]=zs.z,r[6]=bh.z,r[10]=Di.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){let i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],h=i[5],d=i[9],f=i[13],g=i[2],x=i[6],p=i[10],m=i[14],b=i[3],E=i[7],v=i[11],S=i[15],w=r[0],T=r[4],y=r[8],A=r[12],P=r[1],F=r[5],O=r[9],z=r[13],L=r[2],V=r[6],D=r[10],k=r[14],Z=r[3],Y=r[7],Q=r[11],se=r[15];return s[0]=o*w+a*P+l*L+c*Z,s[4]=o*T+a*F+l*V+c*Y,s[8]=o*y+a*O+l*D+c*Q,s[12]=o*A+a*z+l*k+c*se,s[1]=u*w+h*P+d*L+f*Z,s[5]=u*T+h*F+d*V+f*Y,s[9]=u*y+h*O+d*D+f*Q,s[13]=u*A+h*z+d*k+f*se,s[2]=g*w+x*P+p*L+m*Z,s[6]=g*T+x*F+p*V+m*Y,s[10]=g*y+x*O+p*D+m*Q,s[14]=g*A+x*z+p*k+m*se,s[3]=b*w+E*P+v*L+S*Z,s[7]=b*T+E*F+v*V+S*Y,s[11]=b*y+E*O+v*D+S*Q,s[15]=b*A+E*z+v*k+S*se,this}multiplyScalar(e){let n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){let e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],f=e[14],g=e[3],x=e[7],p=e[11],m=e[15],b=l*f-c*d,E=a*f-c*h,v=a*d-l*h,S=o*f-c*u,w=o*d-l*u,T=o*h-a*u;return n*(x*b-p*E+m*v)-i*(g*b-p*S+m*w)+r*(g*E-x*S+m*T)-s*(g*v-x*w+p*T)}determinantAffine(){let e=this.elements,n=e[0],i=e[4],r=e[8],s=e[1],o=e[5],a=e[9],l=e[2],c=e[6],u=e[10];return n*(o*u-a*c)-i*(s*u-a*l)+r*(s*c-o*l)}transpose(){let e=this.elements,n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){let e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],f=e[11],g=e[12],x=e[13],p=e[14],m=e[15],b=n*a-i*o,E=n*l-r*o,v=n*c-s*o,S=i*l-r*a,w=i*c-s*a,T=r*c-s*l,y=u*x-h*g,A=u*p-d*g,P=u*m-f*g,F=h*p-d*x,O=h*m-f*x,z=d*m-f*p,L=b*z-E*O+v*F+S*P-w*A+T*y;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let V=1/L;return e[0]=(a*z-l*O+c*F)*V,e[1]=(r*O-i*z-s*F)*V,e[2]=(x*T-p*w+m*S)*V,e[3]=(d*w-h*T-f*S)*V,e[4]=(l*P-o*z-c*A)*V,e[5]=(n*z-r*P+s*A)*V,e[6]=(p*v-g*T-m*E)*V,e[7]=(u*T-d*v+f*E)*V,e[8]=(o*O-a*P+c*y)*V,e[9]=(i*P-n*O-s*y)*V,e[10]=(g*w-x*v+m*b)*V,e[11]=(h*v-u*w-f*b)*V,e[12]=(a*A-o*F-l*y)*V,e[13]=(n*F-i*A+r*y)*V,e[14]=(x*E-g*S-p*b)*V,e[15]=(u*S-h*E+d*b)*V,this}scale(e){let n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){let n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){let n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){let n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){let i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){let r=this.elements,s=n._x,o=n._y,a=n._z,l=n._w,c=s+s,u=o+o,h=a+a,d=s*c,f=s*u,g=s*h,x=o*u,p=o*h,m=a*h,b=l*c,E=l*u,v=l*h,S=i.x,w=i.y,T=i.z;return r[0]=(1-(x+m))*S,r[1]=(f+v)*S,r[2]=(g-E)*S,r[3]=0,r[4]=(f-v)*w,r[5]=(1-(d+m))*w,r[6]=(p+b)*w,r[7]=0,r[8]=(g+E)*T,r[9]=(p-b)*T,r[10]=(1-(d+x))*T,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let s=this.determinantAffine();if(s===0)return i.set(1,1,1),n.identity(),this;let o=Ia.set(r[0],r[1],r[2]).length(),a=Ia.set(r[4],r[5],r[6]).length(),l=Ia.set(r[8],r[9],r[10]).length();s<0&&(o=-o),fr.copy(this);let c=1/o,u=1/a,h=1/l;return fr.elements[0]*=c,fr.elements[1]*=c,fr.elements[2]*=c,fr.elements[4]*=u,fr.elements[5]*=u,fr.elements[6]*=u,fr.elements[8]*=h,fr.elements[9]*=h,fr.elements[10]*=h,n.setFromRotationMatrix(fr),i.x=o,i.y=a,i.z=l,this}makePerspective(e,n,i,r,s,o,a=xr,l=!1){let c=this.elements,u=2*s/(n-e),h=2*s/(i-r),d=(n+e)/(n-e),f=(i+r)/(i-r),g,x;if(l)g=s/(o-s),x=o*s/(o-s);else if(a===xr)g=-(o+s)/(o-s),x=-2*o*s/(o-s);else if(a===hc)g=-o/(o-s),x=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,n,i,r,s,o,a=xr,l=!1){let c=this.elements,u=2/(n-e),h=2/(i-r),d=-(n+e)/(n-e),f=-(i+r)/(i-r),g,x;if(l)g=1/(o-s),x=o/(o-s);else if(a===xr)g=-2/(o-s),x=-(o+s)/(o-s);else if(a===hc)g=-1/(o-s),x=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=h,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){let i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}};Cd.prototype.isMatrix4=!0;var Ct=Cd,Ia=new C,fr=new Ct,mA=new C(0,0,0),gA=new C(1,1,1),zs=new C,bh=new C,Di=new C,Jv=new Ct,Qv=new Qi,Ys=class t{constructor(e=0,n=0,i=0,r=t.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){let r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],h=r[2],d=r[6],f=r[10];switch(n){case"XYZ":this._y=Math.asin(Rt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Rt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,s),this._z=0);break;case"ZXY":this._x=Math.asin(Rt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Rt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Rt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-Rt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,f),this._y=0);break;default:ut("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return Jv.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Jv,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Qv.setFromEuler(this),this.setFromQuaternion(Qv,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Ys.DEFAULT_ORDER="XYZ";var qa=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},xA=0,ey=new C,La=new Qi,ss=new Ct,Mh=new C,nc=new C,vA=new C,yA=new Qi,ty=new C(1,0,0),ny=new C(0,1,0),iy=new C(0,0,1),ry={type:"added"},_A={type:"removed"},Da={type:"childadded",child:null},Pm={type:"childremoved",child:null},wi=class t extends Nr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:xA++}),this.uuid=Xs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=t.DEFAULT_UP.clone();let e=new C,n=new Ys,i=new Qi,r=new C(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Ct},normalMatrix:{value:new gt}}),this.matrix=new Ct,this.matrixWorld=new Ct,this.matrixAutoUpdate=t.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new qa,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return La.setFromAxisAngle(e,n),this.quaternion.multiply(La),this}rotateOnWorldAxis(e,n){return La.setFromAxisAngle(e,n),this.quaternion.premultiply(La),this}rotateX(e){return this.rotateOnAxis(ty,e)}rotateY(e){return this.rotateOnAxis(ny,e)}rotateZ(e){return this.rotateOnAxis(iy,e)}translateOnAxis(e,n){return ey.copy(e).applyQuaternion(this.quaternion),this.position.add(ey.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(ty,e)}translateY(e){return this.translateOnAxis(ny,e)}translateZ(e){return this.translateOnAxis(iy,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ss.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Mh.copy(e):Mh.set(e,n,i);let r=this.parent;this.updateWorldMatrix(!0,!1),nc.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ss.lookAt(nc,Mh,this.up):ss.lookAt(Mh,nc,this.up),this.quaternion.setFromRotationMatrix(ss),r&&(ss.extractRotation(r.matrixWorld),La.setFromRotationMatrix(ss),this.quaternion.premultiply(La.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(dt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(ry),Da.child=e,this.dispatchEvent(Da),Da.child=null):dt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(_A),Pm.child=e,this.dispatchEvent(Pm),Pm.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ss.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ss.multiply(e.parent.matrixWorld)),e.applyMatrix4(ss),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(ry),Da.child=e,this.dispatchEvent(Da),Da.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){let o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nc,e,vA),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(nc,yA,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){let n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let n=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=n-s[0]*n-s[4]*i-s[8]*r,s[13]+=i-s[1]*n-s[5]*i-s[9]*r,s[14]+=r-s[2]*n-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n,i=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),n===!0){let s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].updateWorldMatrix(!1,!0,i)}}toJSON(e){let n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let h=l[c];s(e.shapes,h)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];r.animations.push(s(e.animations,l))}}if(n){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),d=o(e.skeletons),f=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),h.length>0&&(i.shapes=h),d.length>0&&(i.skeletons=d),f.length>0&&(i.animations=f),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){let r=e.children[i];this.add(r.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};wi.DEFAULT_UP=new C(0,1,0);wi.DEFAULT_MATRIX_AUTO_UPDATE=!0;wi.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var nn=class extends wi{constructor(){super(),this.isGroup=!0,this.type="Group"}},bA={type:"move"},ja=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new nn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new nn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new nn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let n=this._hand;if(n)for(let i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let x of e.hand.values()){let p=n.getJointPose(x,i),m=this._getHandJoint(c,x);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}let u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),f=.02,g=.005;c.inputState.pinching&&d>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(bA)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){let i=new nn;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}},r_={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Vs={h:0,s:0,l:0},Sh={h:0,s:0,l:0};function Im(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}var wt=class{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Oi){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Mt.colorSpaceToWorking(this,n),this}setRGB(e,n,i,r=Mt.workingColorSpace){return this.r=e,this.g=n,this.b=i,Mt.colorSpaceToWorking(this,r),this}setHSL(e,n,i,r=Mt.workingColorSpace){if(e=hA(e,1),n=Rt(n,0,1),i=Rt(i,0,1),n===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=Im(o,s,e+1/3),this.g=Im(o,s,e),this.b=Im(o,s,e-1/3)}return Mt.colorSpaceToWorking(this,r),this}setStyle(e,n=Oi){function i(s){s!==void 0&&parseFloat(s)<1&&ut("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:ut("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);ut("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Oi){let i=r_[e.toLowerCase()];return i!==void 0?this.setHex(i,n):ut("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=us(e.r),this.g=us(e.g),this.b=us(e.b),this}copyLinearToSRGB(e){return this.r=Wa(e.r),this.g=Wa(e.g),this.b=Wa(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Oi){return Mt.workingToColorSpace(ti.copy(this),e),Math.round(Rt(ti.r*255,0,255))*65536+Math.round(Rt(ti.g*255,0,255))*256+Math.round(Rt(ti.b*255,0,255))}getHexString(e=Oi){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Mt.workingColorSpace){Mt.workingToColorSpace(ti.copy(this),n);let i=ti.r,r=ti.g,s=ti.b,o=Math.max(i,r,s),a=Math.min(i,r,s),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case i:l=(r-s)/h+(r<s?6:0);break;case r:l=(s-i)/h+2;break;case s:l=(i-r)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,n=Mt.workingColorSpace){return Mt.workingToColorSpace(ti.copy(this),n),e.r=ti.r,e.g=ti.g,e.b=ti.b,e}getStyle(e=Oi){Mt.workingToColorSpace(ti.copy(this),e);let n=ti.r,i=ti.g,r=ti.b;return e!==Oi?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(Vs),this.setHSL(Vs.h+e,Vs.s+n,Vs.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Vs),e.getHSL(Sh);let i=Am(Vs.h,Sh.h,n),r=Am(Vs.s,Sh.s,n),s=Am(Vs.l,Sh.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},ti=new wt;wt.NAMES=r_;var hs=class extends wi{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ys,this.environmentIntensity=1,this.environmentRotation=new Ys,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),n.object.backgroundBlurriness=this.backgroundBlurriness,n.object.backgroundIntensity=this.backgroundIntensity,n.object.backgroundRotation=this.backgroundRotation.toArray(),n.object.environmentIntensity=this.environmentIntensity,n.object.environmentRotation=this.environmentRotation.toArray(),n}},pr=new C,os=new C,Lm=new C,as=new C,Na=new C,Oa=new C,sy=new C,Dm=new C,Nm=new C,Om=new C,Fm=new Ot,Um=new Ot,km=new Ot,$s=class t{constructor(e=new C,n=new C,i=new C){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),pr.subVectors(e,n),r.cross(pr);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){pr.subVectors(r,n),os.subVectors(i,n),Lm.subVectors(e,n);let o=pr.dot(pr),a=pr.dot(os),l=pr.dot(Lm),c=os.dot(os),u=os.dot(Lm),h=o*c-a*a;if(h===0)return s.set(0,0,0),null;let d=1/h,f=(c*l-a*u)*d,g=(o*u-a*l)*d;return s.set(1-f-g,g,f)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,as)===null?!1:as.x>=0&&as.y>=0&&as.x+as.y<=1}static getInterpolation(e,n,i,r,s,o,a,l){return this.getBarycoord(e,n,i,r,as)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,as.x),l.addScaledVector(o,as.y),l.addScaledVector(a,as.z),l)}static getInterpolatedAttribute(e,n,i,r,s,o){return Fm.setScalar(0),Um.setScalar(0),km.setScalar(0),Fm.fromBufferAttribute(e,n),Um.fromBufferAttribute(e,i),km.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(Fm,s.x),o.addScaledVector(Um,s.y),o.addScaledVector(km,s.z),o}static isFrontFacing(e,n,i,r){return pr.subVectors(i,n),os.subVectors(e,n),pr.cross(os).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return pr.subVectors(this.c,this.b),os.subVectors(this.a,this.b),pr.cross(os).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return t.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return t.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return t.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return t.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return t.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){let i=this.a,r=this.b,s=this.c,o,a;Na.subVectors(r,i),Oa.subVectors(s,i),Dm.subVectors(e,i);let l=Na.dot(Dm),c=Oa.dot(Dm);if(l<=0&&c<=0)return n.copy(i);Nm.subVectors(e,r);let u=Na.dot(Nm),h=Oa.dot(Nm);if(u>=0&&h<=u)return n.copy(r);let d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),n.copy(i).addScaledVector(Na,o);Om.subVectors(e,s);let f=Na.dot(Om),g=Oa.dot(Om);if(g>=0&&f<=g)return n.copy(s);let x=f*c-l*g;if(x<=0&&c>=0&&g<=0)return a=c/(c-g),n.copy(i).addScaledVector(Oa,a);let p=u*g-f*h;if(p<=0&&h-u>=0&&f-g>=0)return sy.subVectors(s,r),a=(h-u)/(h-u+(f-g)),n.copy(r).addScaledVector(sy,a);let m=1/(p+x+d);return o=x*m,a=d*m,n.copy(i).addScaledVector(Na,o).addScaledVector(Oa,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Or=class{constructor(e=new C(1/0,1/0,1/0),n=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(mr.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(mr.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){let i=mr.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,mr):mr.fromBufferAttribute(s,o),mr.applyMatrix4(e.matrixWorld),this.expandByPoint(mr);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),wh.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),wh.copy(i.boundingBox)),wh.applyMatrix4(e.matrixWorld),this.union(wh)}let r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,mr),mr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ic),Ah.subVectors(this.max,ic),Fa.subVectors(e.a,ic),Ua.subVectors(e.b,ic),ka.subVectors(e.c,ic),Gs.subVectors(Ua,Fa),Hs.subVectors(ka,Ua),Do.subVectors(Fa,ka);let n=[0,-Gs.z,Gs.y,0,-Hs.z,Hs.y,0,-Do.z,Do.y,Gs.z,0,-Gs.x,Hs.z,0,-Hs.x,Do.z,0,-Do.x,-Gs.y,Gs.x,0,-Hs.y,Hs.x,0,-Do.y,Do.x,0];return!Bm(n,Fa,Ua,ka,Ah)||(n=[1,0,0,0,1,0,0,0,1],!Bm(n,Fa,Ua,ka,Ah))?!1:(Eh.crossVectors(Gs,Hs),n=[Eh.x,Eh.y,Eh.z],Bm(n,Fa,Ua,ka,Ah))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,mr).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(mr).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ls[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ls[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ls[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ls[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ls[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ls[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ls[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ls[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ls),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ls=[new C,new C,new C,new C,new C,new C,new C,new C],mr=new C,wh=new Or,Fa=new C,Ua=new C,ka=new C,Gs=new C,Hs=new C,Do=new C,ic=new C,Ah=new C,Eh=new C,No=new C;function Bm(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){No.fromArray(t,s);let a=r.x*Math.abs(No.x)+r.y*Math.abs(No.y)+r.z*Math.abs(No.z),l=e.dot(No),c=n.dot(No),u=i.dot(No);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var In=new C,Th=new ht,MA=0,rn=class extends Nr{constructor(e,n,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:MA++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=b0,this.updateRanges=[],this.gpuType=er,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Th.fromBufferAttribute(this,n),Th.applyMatrix3(e),this.setXY(n,Th.x,Th.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)In.fromBufferAttribute(this,n),In.applyMatrix3(e),this.setXYZ(n,In.x,In.y,In.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)In.fromBufferAttribute(this,n),In.applyMatrix4(e),this.setXYZ(n,In.x,In.y,In.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)In.fromBufferAttribute(this,n),In.applyNormalMatrix(e),this.setXYZ(n,In.x,In.y,In.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)In.fromBufferAttribute(this,n),In.transformDirection(e),this.setXYZ(n,In.x,In.y,In.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=Lr(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=tn(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=Lr(n,this.array)),n}setX(e,n){return this.normalized&&(n=tn(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=Lr(n,this.array)),n}setY(e,n){return this.normalized&&(n=tn(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=Lr(n,this.array)),n}setZ(e,n){return this.normalized&&(n=tn(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=Lr(n,this.array)),n}setW(e,n){return this.normalized&&(n=tn(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=tn(n,this.array),i=tn(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=tn(n,this.array),i=tn(i,this.array),r=tn(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=tn(n,this.array),i=tn(i,this.array),r=tn(r,this.array),s=tn(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var mc=class extends rn{constructor(e,n,i){super(new Uint16Array(e),n,i)}};var gc=class extends rn{constructor(e,n,i){super(new Uint32Array(e),n,i)}};var Kt=class extends rn{constructor(e,n,i){super(new Float32Array(e),n,i)}},SA=new Or,rc=new C,zm=new C,Fr=class{constructor(e=new C,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){let i=this.center;n!==void 0?i.copy(n):SA.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){let i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;rc.subVectors(e,this.center);let n=rc.lengthSq();if(n>this.radius*this.radius){let i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(rc,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(zm.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(rc.copy(e.center).add(zm)),this.expandByPoint(rc.copy(e.center).sub(zm))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},wA=0,Ji=new Ct,Vm=new wi,Ba=new C,Ni=new Or,sc=new Or,Vn=new C,wn=class t extends Nr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:wA++}),this.uuid=Xs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(cA(e)?gc:mc)(e,1):this.index=e,this}setIndirect(e,n=0){return this.indirect=e,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){let n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new gt().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Ji.makeRotationFromQuaternion(e),this.applyMatrix4(Ji),this}rotateX(e){return Ji.makeRotationX(e),this.applyMatrix4(Ji),this}rotateY(e){return Ji.makeRotationY(e),this.applyMatrix4(Ji),this}rotateZ(e){return Ji.makeRotationZ(e),this.applyMatrix4(Ji),this}translate(e,n,i){return Ji.makeTranslation(e,n,i),this.applyMatrix4(Ji),this}scale(e,n,i){return Ji.makeScale(e,n,i),this.applyMatrix4(Ji),this}lookAt(e){return Vm.lookAt(e),Vm.updateMatrix(),this.applyMatrix4(Vm.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ba).negate(),this.translate(Ba.x,Ba.y,Ba.z),this}setFromPoints(e){let n=this.getAttribute("position");if(n===void 0){let i=[];for(let r=0,s=e.length;r<s;r++){let o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Kt(i,3))}else{let i=Math.min(e.length,n.count);for(let r=0;r<i;r++){let s=e[r];n.setXYZ(r,s.x,s.y,s.z||0)}e.length>n.count&&ut("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Or);let e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){dt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){let s=n[i];Ni.setFromBufferAttribute(s),this.morphTargetsRelative?(Vn.addVectors(this.boundingBox.min,Ni.min),this.boundingBox.expandByPoint(Vn),Vn.addVectors(this.boundingBox.max,Ni.max),this.boundingBox.expandByPoint(Vn)):(this.boundingBox.expandByPoint(Ni.min),this.boundingBox.expandByPoint(Ni.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&dt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Fr);let e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){dt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(e){let i=this.boundingSphere.center;if(Ni.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){let a=n[s];sc.setFromBufferAttribute(a),this.morphTargetsRelative?(Vn.addVectors(Ni.min,sc.min),Ni.expandByPoint(Vn),Vn.addVectors(Ni.max,sc.max),Ni.expandByPoint(Vn)):(Ni.expandByPoint(sc.min),Ni.expandByPoint(sc.max))}Ni.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Vn.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Vn));if(n)for(let s=0,o=n.length;s<o;s++){let a=n[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Vn.fromBufferAttribute(a,c),l&&(Ba.fromBufferAttribute(e,c),Vn.add(Ba)),r=Math.max(r,i.distanceToSquared(Vn))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&dt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){dt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=n.position,r=n.normal,s=n.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new rn(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let y=0;y<i.count;y++)a[y]=new C,l[y]=new C;let c=new C,u=new C,h=new C,d=new ht,f=new ht,g=new ht,x=new C,p=new C;function m(y,A,P){c.fromBufferAttribute(i,y),u.fromBufferAttribute(i,A),h.fromBufferAttribute(i,P),d.fromBufferAttribute(s,y),f.fromBufferAttribute(s,A),g.fromBufferAttribute(s,P),u.sub(c),h.sub(c),f.sub(d),g.sub(d);let F=1/(f.x*g.y-g.x*f.y);isFinite(F)&&(x.copy(u).multiplyScalar(g.y).addScaledVector(h,-f.y).multiplyScalar(F),p.copy(h).multiplyScalar(f.x).addScaledVector(u,-g.x).multiplyScalar(F),a[y].add(x),a[A].add(x),a[P].add(x),l[y].add(p),l[A].add(p),l[P].add(p))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let y=0,A=b.length;y<A;++y){let P=b[y],F=P.start,O=P.count;for(let z=F,L=F+O;z<L;z+=3)m(e.getX(z+0),e.getX(z+1),e.getX(z+2))}let E=new C,v=new C,S=new C,w=new C;function T(y){S.fromBufferAttribute(r,y),w.copy(S);let A=a[y];E.copy(A),E.sub(S.multiplyScalar(S.dot(A))).normalize(),v.crossVectors(w,A);let F=v.dot(l[y])<0?-1:1;o.setXYZW(y,E.x,E.y,E.z,F)}for(let y=0,A=b.length;y<A;++y){let P=b[y],F=P.start,O=P.count;for(let z=F,L=F+O;z<L;z+=3)T(e.getX(z+0)),T(e.getX(z+1)),T(e.getX(z+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==n.count)i=new rn(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let d=0,f=i.count;d<f;d++)i.setXYZ(d,0,0,0);let r=new C,s=new C,o=new C,a=new C,l=new C,c=new C,u=new C,h=new C;if(e)for(let d=0,f=e.count;d<f;d+=3){let g=e.getX(d+0),x=e.getX(d+1),p=e.getX(d+2);r.fromBufferAttribute(n,g),s.fromBufferAttribute(n,x),o.fromBufferAttribute(n,p),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,p),a.add(u),l.add(u),c.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,f=n.count;d<f;d+=3)r.fromBufferAttribute(n,d+0),s.fromBufferAttribute(n,d+1),o.fromBufferAttribute(n,d+2),u.subVectors(o,s),h.subVectors(r,s),u.cross(h),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Vn.fromBufferAttribute(e,n),Vn.normalize(),e.setXYZ(n,Vn.x,Vn.y,Vn.z)}toNonIndexed(){function e(a,l){let c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u),f=0,g=0;for(let x=0,p=l.length;x<p;x++){a.isInterleavedBufferAttribute?f=l[x]*a.data.stride+a.offset:f=l[x]*u;for(let m=0;m<u;m++)d[g++]=c[f++]}return new rn(d,u,h)}if(this.index===null)return ut("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let n=new t,i=this.index.array,r=this.attributes;for(let a in r){let l=r[a],c=e(l,i);n.setAttribute(a,c)}let s=this.morphAttributes;for(let a in s){let l=[],c=s[a];for(let u=0,h=c.length;u<h;u++){let d=c[u],f=e(d,i);l.push(f)}n.morphAttributes[a]=l}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let r={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){let f=c[h];u.push(f.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let n={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let r=e.attributes;for(let c in r){let u=r[c];this.setAttribute(c,u.clone(n))}let s=e.morphAttributes;for(let c in s){let u=[],h=s[c];for(let d=0,f=h.length;d<f;d++)u.push(h[d].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,u=o.length;c<u;c++){let h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},ad=class{constructor(e,n){this.isInterleavedBuffer=!0,this.array=e,this.stride=n,this.count=e!==void 0?e.length/n:0,this.usage=b0,this.updateRanges=[],this.version=0,this.uuid=Xs()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,n,i){e*=this.stride,i*=n.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=n.array[i+r];return this}set(e,n=0){return this.array.set(e,n),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Xs()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let n=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(n,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Xs()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let n={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}},pi=new C,Za=class t{constructor(e,n,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=n,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let n=0,i=this.data.count;n<i;n++)pi.fromBufferAttribute(this,n),pi.applyMatrix4(e),this.setXYZ(n,pi.x,pi.y,pi.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)pi.fromBufferAttribute(this,n),pi.applyNormalMatrix(e),this.setXYZ(n,pi.x,pi.y,pi.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)pi.fromBufferAttribute(this,n),pi.transformDirection(e),this.setXYZ(n,pi.x,pi.y,pi.z);return this}getComponent(e,n){let i=this.array[e*this.data.stride+this.offset+n];return this.normalized&&(i=Lr(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=tn(i,this.array)),this.data.array[e*this.data.stride+this.offset+n]=i,this}setX(e,n){return this.normalized&&(n=tn(n,this.array)),this.data.array[e*this.data.stride+this.offset]=n,this}setY(e,n){return this.normalized&&(n=tn(n,this.array)),this.data.array[e*this.data.stride+this.offset+1]=n,this}setZ(e,n){return this.normalized&&(n=tn(n,this.array)),this.data.array[e*this.data.stride+this.offset+2]=n,this}setW(e,n){return this.normalized&&(n=tn(n,this.array)),this.data.array[e*this.data.stride+this.offset+3]=n,this}getX(e){let n=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(n=Lr(n,this.array)),n}getY(e){let n=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(n=Lr(n,this.array)),n}getZ(e){let n=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(n=Lr(n,this.array)),n}getW(e){let n=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(n=Lr(n,this.array)),n}setXY(e,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(n=tn(n,this.array),i=tn(i,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this}setXYZ(e,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(n=tn(n,this.array),i=tn(i,this.array),r=tn(r,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(n=tn(n,this.array),i=tn(i,this.array),r=tn(r,this.array),s=tn(s,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){fc("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let n=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return new rn(new this.array.constructor(n),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new t(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){fc("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let n=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:n,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Gm=new C,AA=new C,EA=new gt,gr=class{constructor(e=new C(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){let r=Gm.subVectors(i,n).cross(AA.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n,i=!0){let r=e.delta(Gm),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(o<0||o>1)?null:n.copy(e.start).addScaledVector(r,o)}intersectsLine(e){let n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){let i=n||EA.getNormalMatrix(e),r=this.coplanarPoint(Gm).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},TA=0,ds=class extends Nr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:TA++}),this.uuid=Xs(),this.name="",this.type="Material",this.blending=vr,this.side=Br,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=r0,this.blendDst=el,this.blendEquation=ms,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new wt(0,0,0),this.blendAlpha=0,this.depthFunc=$a,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Yy,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Xh,this.stencilZFail=Xh,this.stencilZPass=Xh,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let n in e){let i=e[n];if(i===void 0){ut(`Material: parameter '${n}' has value of undefined.`);continue}let r=this[n];if(r===void 0){ut(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){let n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){let o=[];for(let a in s){let l=s[a];delete l.metadata,o.push(l)}return o}if(n){let s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}fromJSON(e,n){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new wt().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new gr().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=n[e.map]||null),e.matcap!==void 0&&(this.matcap=n[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=n[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=n[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=n[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ht().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=n[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=n[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=n[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=n[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=n[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=n[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=n[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=n[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=n[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=n[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=n[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=n[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=n[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=n[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ht().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=n[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=n[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=n[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=n[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=n[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=n[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=n[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let n=e.clippingPlanes,i=null;if(n!==null){let r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var cs=new C,Hm=new C,Rh=new C,Ch=new C,fs=class{constructor(e=new C,n=new C(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,cs)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);let i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let n=cs.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(cs.copy(this.origin).addScaledVector(this.direction,n),cs.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){Hm.copy(e).add(n).multiplyScalar(.5),Rh.copy(n).sub(e).normalize(),Ch.copy(this.origin).sub(Hm);let s=e.distanceTo(n)*.5,o=-this.direction.dot(Rh),a=Ch.dot(this.direction),l=-Ch.dot(Rh),c=Ch.lengthSq(),u=Math.abs(1-o*o),h,d,f,g;if(u>0)if(h=o*l-a,d=o*a-l,g=s*u,h>=0)if(d>=-g)if(d<=g){let x=1/u;h*=x,d*=x,f=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d=-s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-o*s+a)),d=h>0?-s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-s,-l),s),f=d*(d+2*l)+c):(h=Math.max(0,-(o*s+a)),d=h>0?s:Math.min(Math.max(-s,-l),s),f=-h*h+d*(d+2*l)+c);else d=o>0?-s:s,h=Math.max(0,-(o*d+a)),f=-h*h+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,h),r&&r.copy(Hm).addScaledVector(Rh,d),f}intersectSphere(e,n){if(e.radius<0)return null;cs.subVectors(e.center,this.origin);let i=cs.dot(this.direction),r=cs.dot(cs)-i*i,s=e.radius*e.radius;if(r>s)return null;let o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,n):this.at(a,n)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){let i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){let n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,a,l,c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),h>=0?(a=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,cs)!==null}intersectTriangle(e,n,i,r,s){let o=this.origin,a=this.direction,l=a.x,c=a.y,u=a.z,h=e.x-o.x,d=e.y-o.y,f=e.z-o.z,g=n.x-o.x,x=n.y-o.y,p=n.z-o.z,m=i.x-o.x,b=i.y-o.y,E=i.z-o.z,v=Math.abs(l),S=Math.abs(c),w=Math.abs(u),T,y,A,P,F,O,z,L,V,D,k,Z;if(v>=S&&v>=w?(A=l,O=h,V=g,Z=m,l>=0?(T=c,y=u,P=d,F=f,z=x,L=p,D=b,k=E):(T=u,y=c,P=f,F=d,z=p,L=x,D=E,k=b)):S>=w?(A=c,O=d,V=x,Z=b,c>=0?(T=u,y=l,P=f,F=h,z=p,L=g,D=E,k=m):(T=l,y=u,P=h,F=f,z=g,L=p,D=m,k=E)):(A=u,O=f,V=p,Z=E,u>=0?(T=l,y=c,P=h,F=d,z=g,L=x,D=m,k=b):(T=c,y=l,P=d,F=h,z=x,L=g,D=b,k=m)),A===0)return null;let Y=T/A,Q=y/A,se=1/A,Le=P-Y*O,Oe=F-Q*O,mt=z-Y*V,$e=L-Q*V,rt=D-Y*Z,j=k-Q*Z,ne=rt*$e-j*mt,Ee=Le*j-Oe*rt,et=mt*Oe-$e*Le;if(r){if(ne<0||Ee<0||et<0)return null}else if((ne<0||Ee<0||et<0)&&(ne>0||Ee>0||et>0))return null;let Ae=ne+Ee+et;if(Ae===0)return null;let le=se*(ne*O+Ee*V+et*Z);return(Ae>0?le<0:le>0)?null:this.at(le/Ae,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},xc=class extends ds{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ys,this.combine=s0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},oy=new Ct,Oo=new fs,Ph=new Fr,ay=new C,Ih=new C,Lh=new C,Dh=new C,Wm=new C,Nh=new C,ly=new C,Oh=new C,zt=class extends wi{constructor(e=new wn,n=new xc){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,n){let i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);let a=this.morphTargetInfluences;if(s&&a){Nh.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let u=a[l],h=s[l];u!==0&&(Wm.fromBufferAttribute(h,e),o?Nh.addScaledVector(Wm,u):Nh.addScaledVector(Wm.sub(n),u))}n.add(Nh)}return n}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){let i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Ph.copy(i.boundingSphere),Ph.applyMatrix4(s),Oo.copy(e.ray).recast(e.near),!(Ph.containsPoint(Oo.origin)===!1&&(Oo.intersectSphere(Ph,ay)===null||Oo.origin.distanceToSquared(ay)>(e.far-e.near)**2))&&(oy.copy(s).invert(),Oo.copy(e.ray).applyMatrix4(oy),!(i.boundingBox!==null&&Oo.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,Oo)))}_computeIntersections(e,n,i){let r,s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,d=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=d.length;g<x;g++){let p=d[g],m=o[p.materialIndex],b=Math.max(p.start,f.start),E=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let v=b,S=E;v<S;v+=3){let w=a.getX(v),T=a.getX(v+1),y=a.getX(v+2);r=Fh(this,m,e,i,c,u,h,w,T,y),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=p.materialIndex,n.push(r))}}else{let g=Math.max(0,f.start),x=Math.min(a.count,f.start+f.count);for(let p=g,m=x;p<m;p+=3){let b=a.getX(p),E=a.getX(p+1),v=a.getX(p+2);r=Fh(this,o,e,i,c,u,h,b,E,v),r&&(r.faceIndex=Math.floor(p/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,x=d.length;g<x;g++){let p=d[g],m=o[p.materialIndex],b=Math.max(p.start,f.start),E=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let v=b,S=E;v<S;v+=3){let w=v,T=v+1,y=v+2;r=Fh(this,m,e,i,c,u,h,w,T,y),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=p.materialIndex,n.push(r))}}else{let g=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let p=g,m=x;p<m;p+=3){let b=p,E=p+1,v=p+2;r=Fh(this,o,e,i,c,u,h,b,E,v),r&&(r.faceIndex=Math.floor(p/3),n.push(r))}}}};function RA(t,e,n,i,r,s,o,a){let l;if(e.side===xi?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===Br,a),l===null)return null;Oh.copy(a),Oh.applyMatrix4(t.matrixWorld);let c=n.ray.origin.distanceTo(Oh);return c<n.near||c>n.far?null:{distance:c,point:Oh.clone(),object:t}}function Fh(t,e,n,i,r,s,o,a,l,c){t.getVertexPosition(a,Ih),t.getVertexPosition(l,Lh),t.getVertexPosition(c,Dh);let u=RA(t,e,n,i,Ih,Lh,Dh,ly);if(u){let h=new C;$s.getBarycoord(ly,Ih,Lh,Dh,h),r&&(u.uv=$s.getInterpolatedAttribute(r,a,l,c,h,new ht)),s&&(u.uv1=$s.getInterpolatedAttribute(s,a,l,c,h,new ht)),o&&(u.normal=$s.getInterpolatedAttribute(o,a,l,c,h,new C),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let d={a,b:l,c,normal:new C,materialIndex:0};$s.getNormal(Ih,Lh,Dh,d.normal),u.face=d,u.barycoord=h}return u}var vc=class extends mi{constructor(e=null,n=1,i=1,r,s,o,a,l,c=Gn,u=Gn,h,d){super(null,o,a,l,c,u,r,s,h,d),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var gi=class extends rn{constructor(e,n,i,r=1){super(e,n,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},za=new Ct,cy=new Ct,Uh=[],uy=new Or,CA=new Ct,oc=new zt,ac=new Fr,yc=class extends zt{constructor(e,n,i){super(e,n),this.isInstancedMesh=!0,this.instanceMatrix=new gi(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,CA)}computeBoundingBox(){let e=this.geometry,n=this.count;this.boundingBox===null&&(this.boundingBox=new Or),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,za),uy.copy(e.boundingBox).applyMatrix4(za),this.boundingBox.union(uy)}computeBoundingSphere(){let e=this.geometry,n=this.count;this.boundingSphere===null&&(this.boundingSphere=new Fr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,za),ac.copy(e.boundingSphere).applyMatrix4(za),this.boundingSphere.union(ac)}copy(e,n){return super.copy(e,n),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,n){return this.instanceColor===null?n.setRGB(1,1,1):n.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,n){return n.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,n){let i=n.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,o=e*s+1;for(let a=0;a<i.length;a++)i[a]=r[o+a]}raycast(e,n){let i=this.matrixWorld,r=this.count;if(oc.geometry=this.geometry,oc.material=this.material,oc.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ac.copy(this.boundingSphere),ac.applyMatrix4(i),e.ray.intersectsSphere(ac)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,za),cy.multiplyMatrices(i,za),oc.matrixWorld=cy,oc.raycast(e,Uh);for(let o=0,a=Uh.length;o<a;o++){let l=Uh[o];l.instanceId=s,l.object=this,n.push(l)}Uh.length=0}}setColorAt(e,n){return this.instanceColor===null&&(this.instanceColor=new gi(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),n.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,n){return n.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,n){let i=n.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new vc(new Float32Array(r*this.count),r,this.count,Ud,er));let s=this.morphTexture.source.data.data,o=0;for(let c=0;c<i.length;c++)o+=i[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=r*e;return s[l]=a,s.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Fo=new Fr,PA=new ht(.5,.5),kh=new C,_c=class{constructor(e=new gr,n=new gr,i=new gr,r=new gr,s=new gr,o=new gr){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){let a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){let n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=xr,i=!1){let r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],h=s[5],d=s[6],f=s[7],g=s[8],x=s[9],p=s[10],m=s[11],b=s[12],E=s[13],v=s[14],S=s[15];if(r[0].setComponents(c-o,f-u,m-g,S-b).normalize(),r[1].setComponents(c+o,f+u,m+g,S+b).normalize(),r[2].setComponents(c+a,f+h,m+x,S+E).normalize(),r[3].setComponents(c-a,f-h,m-x,S-E).normalize(),i)r[4].setComponents(l,d,p,v).normalize(),r[5].setComponents(c-l,f-d,m-p,S-v).normalize();else if(r[4].setComponents(c-l,f-d,m-p,S-v).normalize(),n===xr)r[5].setComponents(c+l,f+d,m+p,S+v).normalize();else if(n===hc)r[5].setComponents(l,d,p,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Fo.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Fo.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Fo)}intersectsSprite(e){Fo.center.set(0,0,0);let n=PA.distanceTo(e.center);return Fo.radius=.7071067811865476+n,Fo.applyMatrix4(e.matrixWorld),this.intersectsSphere(Fo)}intersectsSphere(e){let n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){let n=this.planes;for(let i=0;i<6;i++){let r=n[i];if(kh.x=r.normal.x>0?e.max.x:e.min.x,kh.y=r.normal.y>0?e.max.y:e.min.y,kh.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(kh)<0)return!1}return!0}containsPoint(e){let n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var ld=class extends ds{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new wt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},cd=new C,ud=new C,hy=new Ct,lc=new fs,Bh=new Fr,$m=new C,dy=new C,hd=class extends wi{constructor(e=new wn,n=new ld){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)cd.fromBufferAttribute(n,r-1),ud.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=cd.distanceTo(ud);e.setAttribute("lineDistance",new Kt(i,1))}else ut("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){let i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Bh.copy(i.boundingSphere),Bh.applyMatrix4(r),Bh.radius+=s,e.ray.intersectsSphere(Bh)===!1)return;hy.copy(r).invert(),lc.copy(e.ray).applyMatrix4(hy);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,d=i.attributes.position;if(u!==null){let f=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let x=f,p=g-1;x<p;x+=c){let m=u.getX(x),b=u.getX(x+1),E=zh(this,e,lc,l,m,b,x);E&&n.push(E)}if(this.isLineLoop){let x=u.getX(g-1),p=u.getX(f),m=zh(this,e,lc,l,x,p,g-1);m&&n.push(m)}}else{let f=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let x=f,p=g-1;x<p;x+=c){let m=zh(this,e,lc,l,x,x+1,x);m&&n.push(m)}if(this.isLineLoop){let x=zh(this,e,lc,l,g-1,f,g-1);x&&n.push(x)}}}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function zh(t,e,n,i,r,s,o){let a=t.geometry.attributes.position;if(cd.fromBufferAttribute(a,r),ud.fromBufferAttribute(a,s),n.distanceSqToSegment(cd,ud,$m,dy)>i)return;$m.applyMatrix4(t.matrixWorld);let c=e.ray.origin.distanceTo($m);if(!(c<e.near||c>e.far))return{distance:c,point:dy.clone().applyMatrix4(t.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:t}}var fy=new C,py=new C,bc=class extends hd{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)fy.fromBufferAttribute(n,r),py.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+fy.distanceTo(py);e.setAttribute("lineDistance",new Kt(i,1))}else ut("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var dd=class extends ds{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new wt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},my=new Ct,Km=new fs,Vh=new Fr,Gh=new C,Mc=class extends wi{constructor(e=new wn,n=new dd){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){let i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Vh.copy(i.boundingSphere),Vh.applyMatrix4(r),Vh.radius+=s,e.ray.intersectsSphere(Vh)===!1)return;my.copy(r).invert(),Km.copy(e.ray).applyMatrix4(my);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,h=i.attributes.position;if(c!==null){let d=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=d,x=f;g<x;g++){let p=c.getX(g);Gh.fromBufferAttribute(h,p),gy(Gh,p,l,r,e,n,this)}}else{let d=Math.max(0,o.start),f=Math.min(h.count,o.start+o.count);for(let g=d,x=f;g<x;g++)Gh.fromBufferAttribute(h,g),gy(Gh,g,l,r,e,n,this)}}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function gy(t,e,n,i,r,s,o){let a=Km.distanceSqToPoint(t);if(a<n){let l=new C;Km.closestPointToPoint(t,l),l.applyMatrix4(i);let c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var Sc=class extends mi{constructor(e=[],n=Js,i,r,s,o,a,l,c,u){super(e,n,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Ur=class extends mi{constructor(e,n,i,r,s,o,a,l,c){super(e,n,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var qs=class extends mi{constructor(e,n,i=yr,r,s,o,a=Gn,l=Gn,c,u=Dr,h=1){if(u!==Dr&&u!==eo)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:e,height:n,depth:h};super(d,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Ya(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let n=super.toJSON(e);return n.compareFunction=this.compareFunction,n}},fd=class extends qs{constructor(e,n=yr,i=Js,r,s,o=Gn,a=Gn,l,c=Dr){let u={width:e,height:e,depth:1},h=[u,u,u,u,u,u];super(e,e,n,i,r,s,o,a,l,c),this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},wc=class extends mi{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Ka=class t extends wn{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};let a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);let l=[],c=[],u=[],h=[],d=0,f=0;g("z","y","x",-1,-1,i,n,e,o,s,0),g("z","y","x",1,-1,i,n,-e,o,s,1),g("x","z","y",1,1,e,i,n,r,o,2),g("x","z","y",1,-1,e,i,-n,r,o,3),g("x","y","z",1,-1,e,n,i,r,s,4),g("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Kt(c,3)),this.setAttribute("normal",new Kt(u,3)),this.setAttribute("uv",new Kt(h,2));function g(x,p,m,b,E,v,S,w,T,y,A){let P=v/T,F=S/y,O=v/2,z=S/2,L=w/2,V=T+1,D=y+1,k=0,Z=0,Y=new C;for(let Q=0;Q<D;Q++){let se=Q*F-z;for(let Le=0;Le<V;Le++){let Oe=Le*P-O;Y[x]=Oe*b,Y[p]=se*E,Y[m]=L,c.push(Y.x,Y.y,Y.z),Y[x]=0,Y[p]=0,Y[m]=w>0?1:-1,u.push(Y.x,Y.y,Y.z),h.push(Le/T),h.push(1-Q/y),k+=1}}for(let Q=0;Q<y;Q++)for(let se=0;se<T;se++){let Le=d+se+V*Q,Oe=d+se+V*(Q+1),mt=d+(se+1)+V*(Q+1),$e=d+(se+1)+V*Q;l.push(Le,Oe,$e),l.push(Oe,mt,$e),Z+=6}a.addGroup(f,Z,A),f+=Z,d+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new t(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var Ac=class t extends wn{constructor(e=[],n=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:n,radius:i,detail:r};let s=[],o=[];a(r),c(i),u(),this.setAttribute("position",new Kt(s,3)),this.setAttribute("normal",new Kt(s.slice(),3)),this.setAttribute("uv",new Kt(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(b){let E=new C,v=new C,S=new C;for(let w=0;w<n.length;w+=3)f(n[w+0],E),f(n[w+1],v),f(n[w+2],S),l(E,v,S,b)}function l(b,E,v,S){let w=S+1,T=[];for(let y=0;y<=w;y++){T[y]=[];let A=b.clone().lerp(v,y/w),P=E.clone().lerp(v,y/w),F=w-y;for(let O=0;O<=F;O++)O===0&&y===w?T[y][O]=A:T[y][O]=A.clone().lerp(P,O/F)}for(let y=0;y<w;y++)for(let A=0;A<2*(w-y)-1;A++){let P=Math.floor(A/2);A%2===0?(d(T[y][P+1]),d(T[y+1][P]),d(T[y][P])):(d(T[y][P+1]),d(T[y+1][P+1]),d(T[y+1][P]))}}function c(b){let E=new C;for(let v=0;v<s.length;v+=3)E.x=s[v+0],E.y=s[v+1],E.z=s[v+2],E.normalize().multiplyScalar(b),s[v+0]=E.x,s[v+1]=E.y,s[v+2]=E.z}function u(){let b=new C;for(let E=0;E<s.length;E+=3){b.x=s[E+0],b.y=s[E+1],b.z=s[E+2];let v=p(b)/2/Math.PI+.5,S=m(b)/Math.PI+.5;o.push(v,1-S)}g(),h()}function h(){for(let b=0;b<o.length;b+=6){let E=o[b+0],v=o[b+2],S=o[b+4],w=Math.max(E,v,S),T=Math.min(E,v,S);w>.9&&T<.1&&(E<.2&&(o[b+0]+=1),v<.2&&(o[b+2]+=1),S<.2&&(o[b+4]+=1))}}function d(b){s.push(b.x,b.y,b.z)}function f(b,E){let v=b*3;E.x=e[v+0],E.y=e[v+1],E.z=e[v+2]}function g(){let b=new C,E=new C,v=new C,S=new C,w=new ht,T=new ht,y=new ht;for(let A=0,P=0;A<s.length;A+=9,P+=6){b.set(s[A+0],s[A+1],s[A+2]),E.set(s[A+3],s[A+4],s[A+5]),v.set(s[A+6],s[A+7],s[A+8]),w.set(o[P+0],o[P+1]),T.set(o[P+2],o[P+3]),y.set(o[P+4],o[P+5]),S.copy(b).add(E).add(v).divideScalar(3);let F=p(S);x(w,P+0,b,F),x(T,P+2,E,F),x(y,P+4,v,F)}}function x(b,E,v,S){S<0&&b.x===1&&(o[E]=b.x-1),v.x===0&&v.z===0&&(o[E]=S/2/Math.PI+.5)}function p(b){return Math.atan2(b.z,-b.x)}function m(b){return Math.atan2(-b.y,Math.sqrt(b.x*b.x+b.z*b.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new t(e.vertices,e.indices,e.radius,e.detail)}};var Bo=class t extends Ac{constructor(e=1,n=0){let i=(1+Math.sqrt(5))/2,r=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,n),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new t(e.radius,e.detail)}};var Ec=class t extends Ac{constructor(e=1,n=0){let i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,r,e,n),this.type="OctahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new t(e.radius,e.detail)}},kr=class t extends wn{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};let s=e/2,o=n/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,h=e/a,d=n/l,f=[],g=[],x=[],p=[];for(let m=0;m<u;m++){let b=m*d-o;for(let E=0;E<c;E++){let v=E*h-s;g.push(v,-b,0),x.push(0,0,1),p.push(E/a),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let b=0;b<a;b++){let E=b+c*m,v=b+c*(m+1),S=b+1+c*(m+1),w=b+1+c*m;f.push(E,v,w),f.push(v,S,w)}this.setIndex(f),this.setAttribute("position",new Kt(g,3)),this.setAttribute("normal",new Kt(x,3)),this.setAttribute("uv",new Kt(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new t(e.width,e.height,e.widthSegments,e.heightSegments)}};function Ho(t){let e={};for(let n in t){e[n]={};for(let i in t[n]){let r=t[n][i];if(xy(r))r.isRenderTargetTexture?(ut("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone();else if(Array.isArray(r))if(xy(r[0])){let s=[];for(let o=0,a=r.length;o<a;o++)s[o]=r[o].clone();e[n][i]=s}else e[n][i]=r.slice();else e[n][i]=r}}return e}function si(t){let e={};for(let n=0;n<t.length;n++){let i=Ho(t[n]);for(let r in i)e[r]=i[r]}return e}function xy(t){return t&&(t.isColor||t.isMatrix3||t.isMatrix4||t.isVector2||t.isVector3||t.isVector4||t.isTexture||t.isQuaternion)}function IA(t){let e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function S0(t){let e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Mt.workingColorSpace}var s_={clone:Ho,merge:si},LA=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,DA=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Pt=class extends ds{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=LA,this.fragmentShader=DA,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ho(e.uniforms),this.uniformsGroups=IA(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(let r in this.uniforms){let o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;let i={};for(let r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}fromJSON(e,n){if(super.fromJSON(e,n),e.uniforms!==void 0)for(let i in e.uniforms){let r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=n[r.value]||null;break;case"c":this.uniforms[i].value=new wt().setHex(r.value);break;case"v2":this.uniforms[i].value=new ht().fromArray(r.value);break;case"v3":this.uniforms[i].value=new C().fromArray(r.value);break;case"v4":this.uniforms[i].value=new Ot().fromArray(r.value);break;case"m3":this.uniforms[i].value=new gt().fromArray(r.value);break;case"m4":this.uniforms[i].value=new Ct().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},pd=class extends Pt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var md=class extends ds{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=$y,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},gd=class extends ds{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Va(t,e){return!t||t.constructor===e?t:typeof e.BYTES_PER_ELEMENT=="number"?new e(t):Array.prototype.slice.call(t)}function Xm(t){return t!==void 0&&t.inTangents!==void 0&&t.outTangents!==void 0}var js=class{constructor(e,n,i,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new n.constructor(i),this.sampleValues=n,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let n=this.parameterPositions,i=this._cachedIndex,r=n[i],s=n[i-1];n:{e:{let o;t:{i:if(!(e<r)){for(let a=i+2;;){if(r===void 0){if(e<s)break i;return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(s=r,r=n[++i],e<r)break e}o=n.length;break t}if(!(e>=s)){let a=n[1];e<a&&(i=2,s=a);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(r=s,s=n[--i-1],e>=s)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<n[a]?o=a:i=a+1}if(r=n[i],s=n[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,r)}return this.interpolate_(i,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let n=this.resultBuffer,i=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)n[o]=i[s+o];return n}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},xd=class extends js{constructor(e,n,i,r){super(e,n,i,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:qm,endingEnd:qm}}intervalChanged_(e,n,i){let r=this.parameterPositions,s=e-2,o=e+1,a=r[s],l=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case jm:s=e,a=2*n-i;break;case Zm:s=r.length-2,a=n+r[s]-r[s+1];break;default:s=e,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case jm:o=e,l=2*i-n;break;case Zm:o=1,l=i+r[1]-r[0];break;default:o=e-1,l=n}let c=(i-n)*.5,u=this.valueSize;this._weightPrev=c/(n-a),this._weightNext=c/(l-i),this._offsetPrev=s*u,this._offsetNext=o*u}interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,h=this._offsetNext,d=this._weightPrev,f=this._weightNext,g=(i-n)/(r-n),x=g*g,p=x*g,m=-d*p+2*d*x-d*g,b=(1+d)*p+(-1.5-2*d)*x+(-.5+d)*g+1,E=(-1-f)*p+(1.5+f)*x+.5*g,v=f*p-f*x;for(let S=0;S!==a;++S)s[S]=m*o[u+S]+b*o[c+S]+E*o[l+S]+v*o[h+S];return s}},vd=class extends js{constructor(e,n,i,r){super(e,n,i,r)}interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(i-n)/(r-n),h=1-u;for(let d=0;d!==a;++d)s[d]=o[c+d]*h+o[l+d]*u;return s}},yd=class extends js{constructor(e,n,i,r){super(e,n,i,r)}interpolate_(e){return this.copySampleValue_(e-1)}},_d=class extends js{interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this.inTangents,h=this.outTangents;if(!u||!h){let g=(i-n)/(r-n),x=1-g;for(let p=0;p!==a;++p)s[p]=o[c+p]*x+o[l+p]*g;return s}let d=a*2,f=e-1;for(let g=0;g!==a;++g){let x=o[c+g],p=o[l+g],m=f*d+g*2,b=h[m],E=h[m+1],v=e*d+g*2,S=u[v],w=u[v+1],T=OA(i,n,b,S,r);s[g]=o_(T,x,E,w,p)}return s}};function o_(t,e,n,i,r){let s=1-t;return s*s*s*e+3*s*s*t*n+3*s*t*t*i+t*t*t*r}function NA(t,e,n,i,r){let s=1-t;return 3*s*s*(n-e)+6*s*t*(i-n)+3*t*t*(r-i)}function OA(t,e,n,i,r){let s=(t-e)/(r-e);for(let o=0;o<8;o++){let a=o_(s,e,n,i,r)-t;if(Math.abs(a)<1e-10)break;let l=NA(s,e,n,i,r);if(Math.abs(l)<1e-10)break;s=Math.max(0,Math.min(1,s-a/l))}return s}var Fi=class{constructor(e,n,i,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(n===void 0||n.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Va(n,this.TimeBufferType),this.values=Va(i,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let n=e.constructor,i;if(n.toJSON!==this.toJSON)i=n.toJSON(e);else{i={name:e.name,times:Va(e.times,Array),values:Va(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(i.interpolation=r),Xm(e.settings)&&(i.settings={inTangents:Va(e.settings.inTangents,Array),outTangents:Va(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new yd(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new vd(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new xd(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let n=new _d(this.times,this.values,this.getValueSize(),e);return this.settings&&(n.inTangents=this.settings.inTangents,n.outTangents=this.settings.outTangents),n}setInterpolation(e){let n;switch(e){case cc:n=this.InterpolantFactoryMethodDiscrete;break;case nd:n=this.InterpolantFactoryMethodLinear;break;case $h:n=this.InterpolantFactoryMethodSmooth;break;case Ym:n=this.InterpolantFactoryMethodBezier;break}if(n===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return ut("KeyframeTrack:",i),this}return this.createInterpolant=n,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return cc;case this.InterpolantFactoryMethodLinear:return nd;case this.InterpolantFactoryMethodSmooth:return $h;case this.InterpolantFactoryMethodBezier:return Ym}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let n=this.times;for(let i=0,r=n.length;i!==r;++i)n[i]+=e}return this}scale(e){if(e!==1){let n=this.times;for(let i=0,r=n.length;i!==r;++i)n[i]*=e;Xm(this.settings)&&(vy(this.settings.inTangents,e),vy(this.settings.outTangents,e))}return this}trim(e,n){let i=this.times,r=i.length,s=0,o=r-1;for(;s!==r&&i[s]<e;)++s;for(;o!==-1&&i[o]>n;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=i.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0,n=this.getValueSize();n-Math.floor(n)!==0&&(dt("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,r=this.values,s=i.length;s===0&&(dt("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){dt("KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){dt("KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(r!==void 0&&uA(r))for(let a=0,l=r.length;a!==l;++a){let c=r[a];if(isNaN(c)){dt("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),n=this.values.slice(),i=this.getValueSize(),r=this.getInterpolation()===$h,s=e.length-1,o=1;for(let a=1;a<s;++a){let l=!1,c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(r)l=!0;else{let h=a*i,d=h-i,f=h+i;for(let g=0;g!==i;++g){let x=n[h+g];if(x!==n[d+g]||x!==n[f+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let h=a*i,d=o*i;for(let f=0;f!==i;++f)n[d+f]=n[h+f]}++o}}if(s>0){e[o]=e[s];for(let a=s*i,l=o*i,c=0;c!==i;++c)n[l+c]=n[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=n.slice(0,o*i)):(this.times=e,this.values=n),this}clone(){let e=this.times.slice(),n=this.values.slice(),i=this.constructor,r=new i(this.name,e,n);return r.createInterpolant=this.createInterpolant,Xm(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function vy(t,e){for(let n=0,i=t.length;n!==i;n+=2)t[n]*=e}Fi.prototype.ValueTypeName="";Fi.prototype.TimeBufferType=Float32Array;Fi.prototype.ValueBufferType=Float32Array;Fi.prototype.DefaultInterpolation=nd;var Zs=class extends Fi{constructor(e,n,i){super(e,n,i)}};Zs.prototype.ValueTypeName="bool";Zs.prototype.ValueBufferType=Array;Zs.prototype.DefaultInterpolation=cc;Zs.prototype.InterpolantFactoryMethodLinear=void 0;Zs.prototype.InterpolantFactoryMethodSmooth=void 0;var bd=class extends Fi{constructor(e,n,i,r){super(e,n,i,r)}};bd.prototype.ValueTypeName="color";var Md=class extends Fi{constructor(e,n,i,r){super(e,n,i,r)}};Md.prototype.ValueTypeName="number";var Sd=class extends js{constructor(e,n,i,r){super(e,n,i,r)}interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-n)/(r-n),c=e*a;for(let u=c+a;c!==u;c+=4)Qi.slerpFlat(s,0,o,c-a,o,c,l);return s}},Tc=class extends Fi{constructor(e,n,i,r){super(e,n,i,r)}InterpolantFactoryMethodLinear(e){return new Sd(this.times,this.values,this.getValueSize(),e)}};Tc.prototype.ValueTypeName="quaternion";Tc.prototype.InterpolantFactoryMethodSmooth=void 0;var Ks=class extends Fi{constructor(e,n,i){super(e,n,i)}};Ks.prototype.ValueTypeName="string";Ks.prototype.ValueBufferType=Array;Ks.prototype.DefaultInterpolation=cc;Ks.prototype.InterpolantFactoryMethodLinear=void 0;Ks.prototype.InterpolantFactoryMethodSmooth=void 0;var wd=class extends Fi{constructor(e,n,i,r){super(e,n,i,r)}};wd.prototype.ValueTypeName="vector";var Ad=class{constructor(e,n,i){let r=this,s=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=n,this.onError=i,this._abortController=null,this.itemStart=function(u){a++,s===!1&&r.onStart!==void 0&&r.onStart(u,o,a),s=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){let h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){let f=c[h],g=c[h+1];if(f.global&&(f.lastIndex=0),f.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},a_=new Ad,Ed=class{constructor(e){this.manager=e!==void 0?e:a_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,n){let i=this;return new Promise(function(r,s){i.load(e,r,n,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};Ed.DEFAULT_MATERIAL_NAME="__DEFAULT";var Hh=new C,Wh=new Qi,Ir=new C,Rc=class extends wi{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ct,this.projectionMatrix=new Ct,this.projectionMatrixInverse=new Ct,this.coordinateSystem=xr,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Hh,Wh,Ir),Ir.x===1&&Ir.y===1&&Ir.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Hh,Wh,Ir.set(1,1,1)).invert()}updateWorldMatrix(e,n,i=!1){super.updateWorldMatrix(e,n,i),this.matrixWorld.decompose(Hh,Wh,Ir),Ir.x===1&&Ir.y===1&&Ir.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Hh,Wh,Ir.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Ws=new C,yy=new ht,_y=new ht,ni=class extends Rc{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let n=.5*this.getFilmHeight()/e;this.fov=id*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(wm*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return id*2*Math.atan(Math.tan(wm*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Ws.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ws.x,Ws.y).multiplyScalar(-e/Ws.z),Ws.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Ws.x,Ws.y).multiplyScalar(-e/Ws.z)}getViewSize(e,n){return this.getViewBounds(e,yy,_y),n.subVectors(_y,yy)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,n=e*Math.tan(wm*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,n-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}};var ps=class extends Rc{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=i-e,o=i+e,a=r+n,l=r-n;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}};var zo=class extends wn{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}};var Ga=-90,Ha=1,Td=class extends wi{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new ni(Ga,Ha,e,n);r.layers=this.layers,this.add(r);let s=new ni(Ga,Ha,e,n);s.layers=this.layers,this.add(s);let o=new ni(Ga,Ha,e,n);o.layers=this.layers,this.add(o);let a=new ni(Ga,Ha,e,n);a.layers=this.layers,this.add(a);let l=new ni(Ga,Ha,e,n);l.layers=this.layers,this.add(l);let c=new ni(Ga,Ha,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,a,l]=n;for(let c of n)this.remove(c);if(e===xr)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===hc)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(n,s),e.setRenderTarget(i,1,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(n,o),e.setRenderTarget(i,2,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(n,a),e.setRenderTarget(i,3,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(n,l),e.setRenderTarget(i,4,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(n,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(n,u),e.setRenderTarget(h,d,f),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},Rd=class extends ni{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var w0="\\[\\]\\.:\\/",FA=new RegExp("["+w0+"]","g"),A0="[^"+w0+"]",UA="[^"+w0.replace("\\.","")+"]",kA=/((?:WC+[\/:])*)/.source.replace("WC",A0),BA=/(WCOD+)?/.source.replace("WCOD",UA),zA=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",A0),VA=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",A0),GA=new RegExp("^"+kA+BA+zA+VA+"$"),HA=["material","materials","bones","map"],Jm=class{constructor(e,n,i){let r=i||dn.parseTrackName(n);this._targetGroup=e,this._bindings=e.subscribe_(n,r)}getValue(e,n){this.bind();let i=this._targetGroup.nCachedObjects_,r=this._bindings[i];r!==void 0&&r.getValue(e,n)}setValue(e,n){let i=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=i.length;r!==s;++r)i[r].setValue(e,n)}bind(){let e=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=e.length;n!==i;++n)e[n].bind()}unbind(){let e=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=e.length;n!==i;++n)e[n].unbind()}},dn=class t{constructor(e,n,i){this.path=n,this.parsedPath=i||t.parseTrackName(n),this.node=t.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,n,i){return e&&e.isAnimationObjectGroup?new t.Composite(e,n,i):new t(e,n,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(FA,"")}static parseTrackName(e){let n=GA.exec(e);if(n===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:n[2],objectName:n[3],objectIndex:n[4],propertyName:n[5],propertyIndex:n[6]},r=i.nodeName&&i.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=i.nodeName.substring(r+1);HA.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,r),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,n){if(n===void 0||n===""||n==="."||n===-1||n===e.name||n===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(n);if(i!==void 0)return i}if(e.children){let i=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===n||a.uuid===n)return a;let l=i(a.children);if(l)return l}return null},r=i(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,n){e[n]=this.targetObject[this.propertyName]}_getValue_array(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)e[n++]=i[r]}_getValue_arrayElement(e,n){e[n]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,n){this.resolvedProperty.toArray(e,n)}_setValue_direct(e,n){this.targetObject[this.propertyName]=e[n]}_setValue_direct_setNeedsUpdate(e,n){this.targetObject[this.propertyName]=e[n],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,n){this.targetObject[this.propertyName]=e[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[n++]}_setValue_array_setNeedsUpdate(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[n++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[n++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,n){this.resolvedProperty[this.propertyIndex]=e[n]}_setValue_arrayElement_setNeedsUpdate(e,n){this.resolvedProperty[this.propertyIndex]=e[n],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,n){this.resolvedProperty[this.propertyIndex]=e[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,n){this.resolvedProperty.fromArray(e,n)}_setValue_fromArray_setNeedsUpdate(e,n){this.resolvedProperty.fromArray(e,n),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,n){this.resolvedProperty.fromArray(e,n),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,n){this.bind(),this.getValue(e,n)}_setValue_unbound(e,n){this.bind(),this.setValue(e,n)}bind(){let e=this.node,n=this.parsedPath,i=n.objectName,r=n.propertyName,s=n.propertyIndex;if(e||(e=t.findNode(this.rootNode,n.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){ut("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=n.objectIndex;switch(i){case"materials":if(!e.material){dt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){dt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){dt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){dt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){dt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){dt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){dt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[r];if(o===void 0){let c=n.nodeName;dt("PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){dt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){dt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};dn.Composite=Jm;dn.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};dn.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};dn.prototype.GetterByBindingType=[dn.prototype._getValue_direct,dn.prototype._getValue_array,dn.prototype._getValue_arrayElement,dn.prototype._getValue_toArray];dn.prototype.SetterByBindingTypeAndVersioning=[[dn.prototype._setValue_direct,dn.prototype._setValue_direct_setNeedsUpdate,dn.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[dn.prototype._setValue_array,dn.prototype._setValue_array_setNeedsUpdate,dn.prototype._setValue_array_setMatrixWorldNeedsUpdate],[dn.prototype._setValue_arrayElement,dn.prototype._setValue_arrayElement_setNeedsUpdate,dn.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[dn.prototype._setValue_fromArray,dn.prototype._setValue_fromArray_setNeedsUpdate,dn.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var oD=new Float32Array(1);var Ja=class extends ad{constructor(e,n,i=1){super(e,n),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){let n=super.clone(e);return n.meshPerAttribute=this.meshPerAttribute,n}toJSON(e){let n=super.toJSON(e);return n.isInstancedInterleavedBuffer=!0,n.meshPerAttribute=this.meshPerAttribute,n}};var by=new Ct,Cc=class{constructor(e,n,i=0,r=1/0){this.ray=new fs(e,n),this.near=i,this.far=r,this.camera=null,this.layers=new qa,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,n){this.ray.set(e,n)}setFromCamera(e,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,n.projectionMatrix.elements[14]).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):dt("Raycaster: Unsupported camera type: "+n.type)}setFromXRController(e){return by.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(by),this}intersectObject(e,n=!0,i=[]){return Qm(e,this,i,n),i.sort(My),i}intersectObjects(e,n=!0,i=[]){for(let r=0,s=e.length;r<s;r++)Qm(e[r],this,i,n);return i.sort(My),i}};function My(t,e){return t.distance-e.distance}function Qm(t,e,n,i){let r=!0;if(t.layers.test(e.layers)&&t.raycast(e,n)===!1&&(r=!1),r===!0&&i===!0){let s=t.children;for(let o=0,a=s.length;o<a;o++)Qm(s[o],e,n,!0)}}var I0=class I0{constructor(e,n,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,n,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,n=0){for(let i=0;i<4;i++)this.elements[i]=e[i+n];return this}set(e,n,i,r){let s=this.elements;return s[0]=e,s[2]=n,s[1]=i,s[3]=r,this}};I0.prototype.isMatrix2=!0;var e0=I0;function E0(t,e,n,i){let r=WA(i);switch(n){case v0:return t*e;case Ud:return t*e/r.components*r.byteLength;case kd:return t*e/r.components*r.byteLength;case to:return t*e*2/r.components*r.byteLength;case Bd:return t*e*2/r.components*r.byteLength;case y0:return t*e*3/r.components*r.byteLength;case Xn:return t*e*4/r.components*r.byteLength;case zd:return t*e*4/r.components*r.byteLength;case Nc:case Oc:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Fc:case Uc:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Gd:case Wd:return Math.max(t,16)*Math.max(e,8)/4;case Vd:case Hd:return Math.max(t,8)*Math.max(e,8)/2;case $d:case Xd:case qd:case jd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Yd:case kc:case Zd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Kd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Jd:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Qd:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case ef:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case tf:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case nf:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case rf:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case sf:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case of:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case af:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case lf:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case cf:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case uf:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case hf:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case df:case ff:case pf:return Math.ceil(t/4)*Math.ceil(e/4)*16;case mf:case gf:return Math.ceil(t/4)*Math.ceil(e/4)*8;case Bc:case xf:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function WA(t){switch(t){case ki:case p0:return{byteLength:1,components:1};case tl:case m0:case ri:return{byteLength:2,components:1};case Od:case Fd:return{byteLength:2,components:4};case yr:case Nd:case er:return{byteLength:4,components:1};case g0:case x0:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?ut("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function C_(){let t=null,e=!1,n=null,i=null;function r(s,o){i=t.requestAnimationFrame(r),n(s,o)}return{start:function(){e!==!0&&n!==null&&t!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t!==null&&t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function XA(t){let e=new WeakMap;function n(a,l){let c=a.array,u=a.usage,h=c.byteLength,d=t.createBuffer();t.bindBuffer(l,d),t.bufferData(l,c,u),a.onUploadCallback();let f;if(c instanceof Float32Array)f=t.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=t.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=t.HALF_FLOAT:f=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=t.SHORT;else if(c instanceof Uint32Array)f=t.UNSIGNED_INT;else if(c instanceof Int32Array)f=t.INT;else if(c instanceof Int8Array)f=t.BYTE;else if(c instanceof Uint8Array)f=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function i(a,l,c){let u=l.array,h=l.updateRanges;if(t.bindBuffer(c,a),h.length===0)t.bufferSubData(c,0,u);else{h.sort((f,g)=>f.start-g.start);let d=0;for(let f=1;f<h.length;f++){let g=h[d],x=h[f];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++d,h[d]=x)}h.length=d+1;for(let f=0,g=h.length;f<g;f++){let x=h[f];t.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(t.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,n(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var YA=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,qA=`#ifdef USE_ALPHAHASH
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
#endif`,jA=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ZA=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,KA=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,JA=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,QA=`#ifdef USE_AOMAP
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
#endif`,eE=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,tE=`#ifdef USE_BATCHING
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
#endif`,nE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,iE=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,rE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,sE=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,oE=`#ifdef USE_IRIDESCENCE
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
#endif`,aE=`#ifdef USE_BUMPMAP
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
#endif`,lE=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,cE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,uE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,hE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,dE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,fE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,pE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,mE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,gE=`#define PI 3.141592653589793
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
} // validated`,xE=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,vE=`vec3 transformedNormal = objectNormal;
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
#endif`,yE=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,_E=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,bE=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ME=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,SE="gl_FragColor = linearToOutputTexel( gl_FragColor );",wE=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,AE=`#ifdef USE_ENVMAP
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
#endif`,EE=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,TE=`#ifdef USE_ENVMAP
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
#endif`,RE=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,CE=`#ifdef USE_ENVMAP
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
#endif`,PE=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,IE=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,LE=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,DE=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,NE=`#ifdef USE_GRADIENTMAP
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
}`,OE=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,FE=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,UE=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,kE=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,BE=`#ifdef USE_ENVMAP
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
#endif`,zE=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,VE=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,GE=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,HE=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,WE=`PhysicalMaterial material;
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
#endif`,$E=`uniform sampler2D dfgLUT;
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
}`,XE=`
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
#endif`,YE=`#if defined( RE_IndirectDiffuse )
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
#endif`,qE=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,jE=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,ZE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,KE=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,JE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,QE=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,eT=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,tT=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,nT=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,iT=`#if defined( USE_POINTS_UV )
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
#endif`,rT=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,sT=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,oT=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,aT=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,lT=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,cT=`#ifdef USE_MORPHTARGETS
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
#endif`,uT=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hT=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,dT=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,fT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,pT=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,mT=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,gT=`#ifdef USE_NORMALMAP
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
#endif`,xT=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,vT=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,yT=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,_T=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,bT=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,MT=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,ST=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,wT=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,AT=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ET=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,TT=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,RT=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,CT=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,PT=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,IT=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,LT=`float getShadowMask() {
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
}`,DT=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,NT=`#ifdef USE_SKINNING
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
#endif`,OT=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,FT=`#ifdef USE_SKINNING
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
#endif`,UT=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,kT=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,BT=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,zT=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,VT=`#ifdef USE_TRANSMISSION
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
#endif`,GT=`#ifdef USE_TRANSMISSION
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
#endif`,HT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,WT=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,$T=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,XT=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,YT=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,qT=`uniform sampler2D t2D;
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
}`,jT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ZT=`#ifdef ENVMAP_TYPE_CUBE
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
}`,KT=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,JT=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,QT=`#include <common>
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
}`,eR=`#if DEPTH_PACKING == 3200
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
}`,tR=`#define DISTANCE
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
}`,nR=`#define DISTANCE
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
}`,iR=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,rR=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sR=`uniform float scale;
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
}`,oR=`uniform vec3 diffuse;
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
}`,aR=`#include <common>
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
}`,lR=`uniform vec3 diffuse;
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
}`,cR=`#define LAMBERT
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
}`,uR=`#define LAMBERT
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
}`,hR=`#define MATCAP
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
}`,dR=`#define MATCAP
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
}`,fR=`#define NORMAL
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
}`,pR=`#define NORMAL
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
}`,mR=`#define PHONG
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
}`,gR=`#define PHONG
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
}`,xR=`#define STANDARD
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
}`,vR=`#define STANDARD
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
}`,yR=`#define TOON
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
}`,_R=`#define TOON
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
}`,bR=`uniform float size;
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
}`,MR=`uniform vec3 diffuse;
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
}`,SR=`#include <common>
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
}`,wR=`uniform vec3 color;
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
}`,AR=`uniform float rotation;
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
}`,ER=`uniform vec3 diffuse;
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
}`,_t={alphahash_fragment:YA,alphahash_pars_fragment:qA,alphamap_fragment:jA,alphamap_pars_fragment:ZA,alphatest_fragment:KA,alphatest_pars_fragment:JA,aomap_fragment:QA,aomap_pars_fragment:eE,batching_pars_vertex:tE,batching_vertex:nE,begin_vertex:iE,beginnormal_vertex:rE,bsdfs:sE,iridescence_fragment:oE,bumpmap_pars_fragment:aE,clipping_planes_fragment:lE,clipping_planes_pars_fragment:cE,clipping_planes_pars_vertex:uE,clipping_planes_vertex:hE,color_fragment:dE,color_pars_fragment:fE,color_pars_vertex:pE,color_vertex:mE,common:gE,cube_uv_reflection_fragment:xE,defaultnormal_vertex:vE,displacementmap_pars_vertex:yE,displacementmap_vertex:_E,emissivemap_fragment:bE,emissivemap_pars_fragment:ME,colorspace_fragment:SE,colorspace_pars_fragment:wE,envmap_fragment:AE,envmap_common_pars_fragment:EE,envmap_pars_fragment:TE,envmap_pars_vertex:RE,envmap_physical_pars_fragment:BE,envmap_vertex:CE,fog_vertex:PE,fog_pars_vertex:IE,fog_fragment:LE,fog_pars_fragment:DE,gradientmap_pars_fragment:NE,lightmap_pars_fragment:OE,lights_lambert_fragment:FE,lights_lambert_pars_fragment:UE,lights_pars_begin:kE,lights_toon_fragment:zE,lights_toon_pars_fragment:VE,lights_phong_fragment:GE,lights_phong_pars_fragment:HE,lights_physical_fragment:WE,lights_physical_pars_fragment:$E,lights_fragment_begin:XE,lights_fragment_maps:YE,lights_fragment_end:qE,lightprobes_pars_fragment:jE,logdepthbuf_fragment:ZE,logdepthbuf_pars_fragment:KE,logdepthbuf_pars_vertex:JE,logdepthbuf_vertex:QE,map_fragment:eT,map_pars_fragment:tT,map_particle_fragment:nT,map_particle_pars_fragment:iT,metalnessmap_fragment:rT,metalnessmap_pars_fragment:sT,morphinstance_vertex:oT,morphcolor_vertex:aT,morphnormal_vertex:lT,morphtarget_pars_vertex:cT,morphtarget_vertex:uT,normal_fragment_begin:hT,normal_fragment_maps:dT,normal_pars_fragment:fT,normal_pars_vertex:pT,normal_vertex:mT,normalmap_pars_fragment:gT,clearcoat_normal_fragment_begin:xT,clearcoat_normal_fragment_maps:vT,clearcoat_pars_fragment:yT,iridescence_pars_fragment:_T,opaque_fragment:bT,packing:MT,premultiplied_alpha_fragment:ST,project_vertex:wT,dithering_fragment:AT,dithering_pars_fragment:ET,roughnessmap_fragment:TT,roughnessmap_pars_fragment:RT,shadowmap_pars_fragment:CT,shadowmap_pars_vertex:PT,shadowmap_vertex:IT,shadowmask_pars_fragment:LT,skinbase_vertex:DT,skinning_pars_vertex:NT,skinning_vertex:OT,skinnormal_vertex:FT,specularmap_fragment:UT,specularmap_pars_fragment:kT,tonemapping_fragment:BT,tonemapping_pars_fragment:zT,transmission_fragment:VT,transmission_pars_fragment:GT,uv_pars_fragment:HT,uv_pars_vertex:WT,uv_vertex:$T,worldpos_vertex:XT,background_vert:YT,background_frag:qT,backgroundCube_vert:jT,backgroundCube_frag:ZT,cube_vert:KT,cube_frag:JT,depth_vert:QT,depth_frag:eR,distance_vert:tR,distance_frag:nR,equirect_vert:iR,equirect_frag:rR,linedashed_vert:sR,linedashed_frag:oR,meshbasic_vert:aR,meshbasic_frag:lR,meshlambert_vert:cR,meshlambert_frag:uR,meshmatcap_vert:hR,meshmatcap_frag:dR,meshnormal_vert:fR,meshnormal_frag:pR,meshphong_vert:mR,meshphong_frag:gR,meshphysical_vert:xR,meshphysical_frag:vR,meshtoon_vert:yR,meshtoon_frag:_R,points_vert:bR,points_frag:MR,shadow_vert:SR,shadow_frag:wR,sprite_vert:AR,sprite_frag:ER},Ue={common:{diffuse:{value:new wt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new gt},alphaMap:{value:null},alphaMapTransform:{value:new gt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new gt}},envmap:{envMap:{value:null},envMapRotation:{value:new gt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new gt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new gt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new gt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new gt},normalScale:{value:new ht(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new gt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new gt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new gt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new gt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new wt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new C},probesMax:{value:new C},probesResolution:{value:new C}},points:{diffuse:{value:new wt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new gt},alphaTest:{value:0},uvTransform:{value:new gt}},sprite:{diffuse:{value:new wt(16777215)},opacity:{value:1},center:{value:new ht(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new gt},alphaMap:{value:null},alphaMapTransform:{value:new gt},alphaTest:{value:0}}},Gr={basic:{uniforms:si([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.fog]),vertexShader:_t.meshbasic_vert,fragmentShader:_t.meshbasic_frag},lambert:{uniforms:si([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new wt(0)},envMapIntensity:{value:1}}]),vertexShader:_t.meshlambert_vert,fragmentShader:_t.meshlambert_frag},phong:{uniforms:si([Ue.common,Ue.specularmap,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,Ue.lights,{emissive:{value:new wt(0)},specular:{value:new wt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:_t.meshphong_vert,fragmentShader:_t.meshphong_frag},standard:{uniforms:si([Ue.common,Ue.envmap,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.roughnessmap,Ue.metalnessmap,Ue.fog,Ue.lights,{emissive:{value:new wt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:_t.meshphysical_vert,fragmentShader:_t.meshphysical_frag},toon:{uniforms:si([Ue.common,Ue.aomap,Ue.lightmap,Ue.emissivemap,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.gradientmap,Ue.fog,Ue.lights,{emissive:{value:new wt(0)}}]),vertexShader:_t.meshtoon_vert,fragmentShader:_t.meshtoon_frag},matcap:{uniforms:si([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,Ue.fog,{matcap:{value:null}}]),vertexShader:_t.meshmatcap_vert,fragmentShader:_t.meshmatcap_frag},points:{uniforms:si([Ue.points,Ue.fog]),vertexShader:_t.points_vert,fragmentShader:_t.points_frag},dashed:{uniforms:si([Ue.common,Ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:_t.linedashed_vert,fragmentShader:_t.linedashed_frag},depth:{uniforms:si([Ue.common,Ue.displacementmap]),vertexShader:_t.depth_vert,fragmentShader:_t.depth_frag},normal:{uniforms:si([Ue.common,Ue.bumpmap,Ue.normalmap,Ue.displacementmap,{opacity:{value:1}}]),vertexShader:_t.meshnormal_vert,fragmentShader:_t.meshnormal_frag},sprite:{uniforms:si([Ue.sprite,Ue.fog]),vertexShader:_t.sprite_vert,fragmentShader:_t.sprite_frag},background:{uniforms:{uvTransform:{value:new gt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:_t.background_vert,fragmentShader:_t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new gt}},vertexShader:_t.backgroundCube_vert,fragmentShader:_t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:_t.cube_vert,fragmentShader:_t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:_t.equirect_vert,fragmentShader:_t.equirect_frag},distance:{uniforms:si([Ue.common,Ue.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:_t.distance_vert,fragmentShader:_t.distance_frag},shadow:{uniforms:si([Ue.lights,Ue.fog,{color:{value:new wt(0)},opacity:{value:1}}]),vertexShader:_t.shadow_vert,fragmentShader:_t.shadow_frag}};Gr.physical={uniforms:si([Gr.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new gt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new gt},clearcoatNormalScale:{value:new ht(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new gt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new gt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new gt},sheen:{value:0},sheenColor:{value:new wt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new gt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new gt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new gt},transmissionSamplerSize:{value:new ht},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new gt},attenuationDistance:{value:0},attenuationColor:{value:new wt(0)},specularColor:{value:new wt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new gt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new gt},anisotropyVector:{value:new ht},anisotropyMap:{value:null},anisotropyMapTransform:{value:new gt}}]),vertexShader:_t.meshphysical_vert,fragmentShader:_t.meshphysical_frag};var _f={r:0,b:0,g:0},TR=new Ct,P_=new gt;P_.set(-1,0,0,0,1,0,0,0,1);function RR(t,e,n,i,r,s){let o=new wt(0),a=r===!0?0:1,l,c,u=null,h=0,d=null;function f(b){let E=b.isScene===!0?b.background:null;if(E&&E.isTexture){let v=b.backgroundBlurriness>0;E=e.get(E,v)}return E}function g(b){let E=!1,v=f(b);v===null?p(o,a):v&&v.isColor&&(p(v,1),E=!0);let S=t.xr.getEnvironmentBlendMode();S==="additive"?n.buffers.color.setClear(0,0,0,1,s):S==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(t.autoClear||E)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function x(b,E){let v=f(E);v&&(v.isCubeTexture||v.mapping===Lc)?(c===void 0&&(c=new zt(new Ka(1,1,1),new Pt({name:"BackgroundCubeMaterial",uniforms:Ho(Gr.backgroundCube.uniforms),vertexShader:Gr.backgroundCube.vertexShader,fragmentShader:Gr.backgroundCube.fragmentShader,side:xi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,w,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(TR.makeRotationFromEuler(E.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(P_),c.material.toneMapped=Mt.getTransfer(v.colorSpace)!==$t,(u!==v||h!==v.version||d!==t.toneMapping)&&(c.material.needsUpdate=!0,u=v,h=v.version,d=t.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new zt(new kr(2,2),new Pt({name:"BackgroundMaterial",uniforms:Ho(Gr.background.uniforms),vertexShader:Gr.background.vertexShader,fragmentShader:Gr.background.fragmentShader,side:Br,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,l.material.toneMapped=Mt.getTransfer(v.colorSpace)!==$t,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||h!==v.version||d!==t.toneMapping)&&(l.material.needsUpdate=!0,u=v,h=v.version,d=t.toneMapping),l.layers.enableAll(),b.unshift(l,l.geometry,l.material,0,0,null))}function p(b,E){b.getRGB(_f,S0(t)),n.buffers.color.setClear(_f.r,_f.g,_f.b,E,s)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(b,E=1){o.set(b),a=E,p(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(b){a=b,p(o,a)},render:g,addToRenderList:x,dispose:m}}function CR(t,e){let n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=d(null),s=r,o=!1;function a(F,O,z,L,V){let D=!1,k=h(F,L,z,O);s!==k&&(s=k,c(s.object)),D=f(F,L,z,V),D&&g(F,L,z,V),V!==null&&e.update(V,t.ELEMENT_ARRAY_BUFFER),(D||o)&&(o=!1,v(F,O,z,L),V!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return t.createVertexArray()}function c(F){return t.bindVertexArray(F)}function u(F){return t.deleteVertexArray(F)}function h(F,O,z,L){let V=L.wireframe===!0,D=i[O.id];D===void 0&&(D={},i[O.id]=D);let k=F.isInstancedMesh===!0?F.id:0,Z=D[k];Z===void 0&&(Z={},D[k]=Z);let Y=Z[z.id];Y===void 0&&(Y={},Z[z.id]=Y);let Q=Y[V];return Q===void 0&&(Q=d(l()),Y[V]=Q),Q}function d(F){let O=[],z=[],L=[];for(let V=0;V<n;V++)O[V]=0,z[V]=0,L[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:z,attributeDivisors:L,object:F,attributes:{},index:null}}function f(F,O,z,L){let V=s.attributes,D=O.attributes,k=0,Z=z.getAttributes();for(let Y in Z)if(Z[Y].location>=0){let se=V[Y],Le=D[Y];if(Le===void 0&&(Y==="instanceMatrix"&&F.instanceMatrix&&(Le=F.instanceMatrix),Y==="instanceColor"&&F.instanceColor&&(Le=F.instanceColor)),se===void 0||se.attribute!==Le||Le&&se.data!==Le.data)return!0;k++}return s.attributesNum!==k||s.index!==L}function g(F,O,z,L){let V={},D=O.attributes,k=0,Z=z.getAttributes();for(let Y in Z)if(Z[Y].location>=0){let se=D[Y];se===void 0&&(Y==="instanceMatrix"&&F.instanceMatrix&&(se=F.instanceMatrix),Y==="instanceColor"&&F.instanceColor&&(se=F.instanceColor));let Le={};Le.attribute=se,se&&se.data&&(Le.data=se.data),V[Y]=Le,k++}s.attributes=V,s.attributesNum=k,s.index=L}function x(){let F=s.newAttributes;for(let O=0,z=F.length;O<z;O++)F[O]=0}function p(F){m(F,0)}function m(F,O){let z=s.newAttributes,L=s.enabledAttributes,V=s.attributeDivisors;z[F]=1,L[F]===0&&(t.enableVertexAttribArray(F),L[F]=1),V[F]!==O&&(t.vertexAttribDivisor(F,O),V[F]=O)}function b(){let F=s.newAttributes,O=s.enabledAttributes;for(let z=0,L=O.length;z<L;z++)O[z]!==F[z]&&(t.disableVertexAttribArray(z),O[z]=0)}function E(F,O,z,L,V,D,k){k===!0?t.vertexAttribIPointer(F,O,z,V,D):t.vertexAttribPointer(F,O,z,L,V,D)}function v(F,O,z,L){x();let V=L.attributes,D=z.getAttributes(),k=O.defaultAttributeValues;for(let Z in D){let Y=D[Z];if(Y.location>=0){let Q=V[Z];if(Q===void 0&&(Z==="instanceMatrix"&&F.instanceMatrix&&(Q=F.instanceMatrix),Z==="instanceColor"&&F.instanceColor&&(Q=F.instanceColor)),Q!==void 0){let se=Q.normalized,Le=Q.itemSize,Oe=e.get(Q);if(Oe===void 0)continue;let mt=Oe.buffer,$e=Oe.type,rt=Oe.bytesPerElement,j=$e===t.INT||$e===t.UNSIGNED_INT||Q.gpuType===Nd;if(Q.isInterleavedBufferAttribute){let ne=Q.data,Ee=ne.stride,et=Q.offset;if(ne.isInstancedInterleavedBuffer){for(let Ae=0;Ae<Y.locationSize;Ae++)m(Y.location+Ae,ne.meshPerAttribute);F.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Ae=0;Ae<Y.locationSize;Ae++)p(Y.location+Ae);t.bindBuffer(t.ARRAY_BUFFER,mt);for(let Ae=0;Ae<Y.locationSize;Ae++)E(Y.location+Ae,Le/Y.locationSize,$e,se,Ee*rt,(et+Le/Y.locationSize*Ae)*rt,j)}else{if(Q.isInstancedBufferAttribute){for(let ne=0;ne<Y.locationSize;ne++)m(Y.location+ne,Q.meshPerAttribute);F.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=Q.meshPerAttribute*Q.count)}else for(let ne=0;ne<Y.locationSize;ne++)p(Y.location+ne);t.bindBuffer(t.ARRAY_BUFFER,mt);for(let ne=0;ne<Y.locationSize;ne++)E(Y.location+ne,Le/Y.locationSize,$e,se,Le*rt,Le/Y.locationSize*ne*rt,j)}}else if(k!==void 0){let se=k[Z];if(se!==void 0)switch(se.length){case 2:t.vertexAttrib2fv(Y.location,se);break;case 3:t.vertexAttrib3fv(Y.location,se);break;case 4:t.vertexAttrib4fv(Y.location,se);break;default:t.vertexAttrib1fv(Y.location,se)}}}}b()}function S(){A();for(let F in i){let O=i[F];for(let z in O){let L=O[z];for(let V in L){let D=L[V];for(let k in D)u(D[k].object),delete D[k];delete L[V]}}delete i[F]}}function w(F){if(i[F.id]===void 0)return;let O=i[F.id];for(let z in O){let L=O[z];for(let V in L){let D=L[V];for(let k in D)u(D[k].object),delete D[k];delete L[V]}}delete i[F.id]}function T(F){for(let O in i){let z=i[O];for(let L in z){let V=z[L];if(V[F.id]===void 0)continue;let D=V[F.id];for(let k in D)u(D[k].object),delete D[k];delete V[F.id]}}}function y(F){for(let O in i){let z=i[O],L=F.isInstancedMesh===!0?F.id:0,V=z[L];if(V!==void 0){for(let D in V){let k=V[D];for(let Z in k)u(k[Z].object),delete k[Z];delete V[D]}delete z[L],Object.keys(z).length===0&&delete i[O]}}}function A(){P(),o=!0,s!==r&&(s=r,c(s.object))}function P(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:A,resetDefaultState:P,dispose:S,releaseStatesOfGeometry:w,releaseStatesOfObject:y,releaseStatesOfProgram:T,initAttributes:x,enableAttribute:p,disableUnusedAttributes:b}}function PR(t,e,n){let i;function r(l){i=l}function s(l,c){t.drawArrays(i,l,c),n.update(c,i,1)}function o(l,c,u){u!==0&&(t.drawArraysInstanced(i,l,c,u),n.update(c,i,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let d=0;for(let f=0;f<u;f++)d+=c[f];n.update(d,i,1)}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a}function IR(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let T=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(T.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(T){return!(T!==Xn&&i.convert(T)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(T){let y=T===ri&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(T!==ki&&T!==er&&!y&&i.convert(T)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE))}function l(T){if(T==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";T="mediump"}return T==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp",u=l(c);u!==c&&(ut("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let h=n.logarithmicDepthBuffer===!0,d=n.reversedDepthBuffer===!0&&e.has("EXT_clip_control");n.reversedDepthBuffer===!0&&d===!1&&ut("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let f=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),g=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=t.getParameter(t.MAX_TEXTURE_SIZE),p=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),m=t.getParameter(t.MAX_VERTEX_ATTRIBS),b=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),E=t.getParameter(t.MAX_VARYING_VECTORS),v=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),S=t.getParameter(t.MAX_SAMPLES),w=t.getParameter(t.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:d,maxTextures:f,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:b,maxVaryings:E,maxFragmentUniforms:v,maxSamples:S,samples:w}}function LR(t){let e=this,n=null,i=0,r=!1,s=!1,o=new gr,a=new gt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){let f=h.length!==0||d||i!==0||r;return r=d,i=h.length,f},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(h,d){n=u(h,d,0)},this.setState=function(h,d,f){let g=h.clippingPlanes,x=h.clipIntersection,p=h.clipShadows,m=t.get(h);if(!r||g===null||g.length===0||s&&!p)s?u(null):c();else{let b=s?0:i,E=b*4,v=m.clippingState||null;l.value=v,v=u(g,d,E,f);for(let S=0;S!==E;++S)v[S]=n[S];m.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(h,d,f,g){let x=h!==null?h.length:0,p=null;if(x!==0){if(p=l.value,g!==!0||p===null){let m=f+x*4,b=d.matrixWorldInverse;a.getNormalMatrix(b),(p===null||p.length<m)&&(p=new Float32Array(m));for(let E=0,v=f;E!==x;++E,v+=4)o.copy(h[E]).applyMatrix4(b,a),o.normal.toArray(p,v),p[v+3]=o.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,p}}var rl=4,DR=6,NR=20,OR=256,zc=new ps,l_=new wt,L0=null,D0=0,N0=0,O0=!1,FR=new C,Wo=new C,Mf=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,n=0,i=.1,r=100,s={}){let{size:o=256,position:a=FR}=s;L0=this._renderer.getRenderTarget(),D0=this._renderer.getActiveCubeFace(),N0=this._renderer.getActiveMipmapLevel(),O0=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,a),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=h_(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=u_(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(L0,D0,N0),this._renderer.xr.enabled=O0,e.scissorTest=!1,il(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Js||e.mapping===Go?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),L0=this._renderer.getRenderTarget(),D0=this._renderer.getActiveCubeFace(),N0=this._renderer.getActiveMipmapLevel(),O0=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Et,minFilter:Et,generateMipmaps:!1,type:ri,format:Xn,colorSpace:ko,depthBuffer:!1},r=c_(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=c_(e,n,i);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=UR(s)),this._blurMaterial=BR(s,e,n),this._ggxMaterial=kR(s,e,n)}return r}_compileMaterial(e){let n=new zt(new wn,e);this._renderer.compile(n,zc)}_sceneToCubeUV(e,n,i,r,s){let l=new ni(90,1,n,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,f=h.toneMapping;h.getClearColor(l_),h.toneMapping=Ui,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(r),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new zt(new Ka,new xc({name:"PMREM.Background",side:xi,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,p=x.material,m=!1,b=e.background;b?b.isColor&&(p.color.copy(b),e.background=null,m=!0):(p.color.copy(l_),m=!0);for(let E=0;E<6;E++){let v=E%3;v===0?(l.up.set(0,c[E],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[E],s.y,s.z)):v===1?(l.up.set(0,0,c[E]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[E],s.z)):(l.up.set(0,c[E],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[E]));let S=this._cubeSize;il(r,v*S,E>2?S:0,S,S),h.setRenderTarget(r),m&&h.render(x,l),h.render(e,l)}h.toneMapping=f,h.autoClear=d,e.background=b}_textureToCubeUV(e,n){let i=this._renderer,r=e.mapping===Js||e.mapping===Go;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=h_()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=u_());let s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;let a=s.uniforms;a.envMap.value=e;let l=this._cubeSize;il(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(o,zc)}_applyPMREM(e){let n=this._renderer,i=n.autoClear;n.autoClear=!1;let r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);n.autoClear=i}_applyGGXFilter(e,n,i){let r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;let l=o.uniforms,c=i/(this._lodMeshes.length-1),u=n/(this._lodMeshes.length-1),h=Math.sqrt(c*c-u*u),d=c*1.25,f=h*d,{_lodMax:g}=this,x=this._sizeLods[i],p=3*x*(i>g-rl?i-g+rl:0),m=4*(this._cubeSize-x);l.envMap.value=e.texture,l.roughness.value=f,l.mipInt.value=g-n,il(s,p,m,3*x,2*x),r.setRenderTarget(s),r.render(a,zc),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=g-i,il(e,p,m,3*x,2*x),r.setRenderTarget(e),r.render(a,zc)}_blur(e,n,i,r){let s=this._pingPongRenderTarget,o=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,s,n,i,o),this._blurPass(s,e,i,i,o)}_blurPass(e,n,i,r,s){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[r];l.material=a;let c=a.uniforms;c.envMap.value=e.texture,c.sigma.value=s,c.mipInt.value=this._lodMax-i;let u=this._sizeLods[r],h=3*u*(r>this._lodMax-rl?r-this._lodMax+rl:0),d=4*(this._cubeSize-u);il(n,h,d,3*u,2*u),o.setRenderTarget(n),o.render(l,zc)}};function UR(t){let e=[],n=[],i=t,r=t-rl+1+DR;for(let s=0;s<r;s++){let o=Math.pow(2,i);e.push(o);let a=1/(o-2),l=-a,c=1+a,u=[l,l,c,l,c,c,l,l,c,c,l,c],h=6,d=6,f=3,g=new Float32Array(f*d*h),x=new Float32Array(f*d*h);for(let m=0;m<h;m++){let b=m%3*2/3-1,E=m>2?0:-1,v=[b,E,0,b+2/3,E,0,b+2/3,E+1,0,b,E,0,b+2/3,E+1,0,b,E+1,0];g.set(v,f*d*m);for(let S=0;S<d;S++){let w=u[S*2]*2-1,T=u[S*2+1]*2-1;m===0?Wo.set(1,T,w):m===1?Wo.set(-w,1,-T):m===2?Wo.set(-w,T,1):m===3?Wo.set(-1,T,-w):m===4?Wo.set(-w,-1,T):Wo.set(w,T,-1),Wo.toArray(x,(m*d+S)*f)}}let p=new wn;p.setAttribute("position",new rn(g,f)),p.setAttribute("outputDirection",new rn(x,f)),n.push(new zt(p,null)),i>rl&&i--}return{lodMeshes:n,sizeLods:e}}function c_(t,e,n){let i=new Ln(t,e,n);return i.texture.mapping=Lc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function il(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function kR(t,e,n){return new Pt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:OR,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:Af(),fragmentShader:`

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
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function BR(t,e,n){return new Pt({name:"SphericalGaussianBlur",defines:{SAMPLES:NR,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:Af(),fragmentShader:`

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
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function u_(){return new Pt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Af(),fragmentShader:`

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
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function h_(){return new Pt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Af(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ai,depthTest:!1,depthWrite:!1})}function Af(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Sf=class extends Ln{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Sc(r),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Ka(5,5,5),s=new Pt({name:"CubemapFromEquirect",uniforms:Ho(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:xi,blending:Ai});s.uniforms.tEquirect.value=n;let o=new zt(r,s),a=n.minFilter;return n.minFilter===Qs&&(n.minFilter=Et),new Td(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n=!0,i=!0,r=!0){let s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}};function zR(t){let e=new WeakMap,n=new WeakMap,i=null;function r(d,f=!1){return d==null?null:f?o(d):s(d)}function s(d){if(d&&d.isTexture){let f=d.mapping;if(f===Id||f===Ld)if(e.has(d)){let g=e.get(d).texture;return a(g,d.mapping)}else{let g=d.image;if(g&&g.height>0){let x=new Sf(g.height);return x.fromEquirectangularTexture(t,d),e.set(d,x),d.addEventListener("dispose",c),a(x.texture,d.mapping)}else return null}}return d}function o(d){if(d&&d.isTexture){let f=d.mapping,g=f===Id||f===Ld,x=f===Js||f===Go;if(g||x){let p=n.get(d),m=p!==void 0?p.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==m)return i===null&&(i=new Mf(t)),p=g?i.fromEquirectangular(d,p):i.fromCubemap(d,p),p.texture.pmremVersion=d.pmremVersion,n.set(d,p),p.texture;if(p!==void 0)return p.texture;{let b=d.image;return g&&b&&b.height>0||x&&b&&l(b)?(i===null&&(i=new Mf(t)),p=g?i.fromEquirectangular(d):i.fromCubemap(d),p.texture.pmremVersion=d.pmremVersion,n.set(d,p),d.addEventListener("dispose",u),p.texture):null}}}return d}function a(d,f){return f===Id?d.mapping=Js:f===Ld&&(d.mapping=Go),d}function l(d){let f=0,g=6;for(let x=0;x<g;x++)d[x]!==void 0&&f++;return f===g}function c(d){let f=d.target;f.removeEventListener("dispose",c);let g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function u(d){let f=d.target;f.removeEventListener("dispose",u);let g=n.get(f);g!==void 0&&(n.delete(f),g.dispose())}function h(){e=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:h}}function VR(t){let e={};function n(i){if(e[i]!==void 0)return e[i];let r=t.getExtension(i);return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){let r=n(i);return r===null&&Uo("WebGLRenderer: "+i+" extension not supported."),r}}}function GR(t,e,n,i){let r={},s=new WeakMap;function o(h){let d=h.target;d.index!==null&&e.remove(d.index);for(let g in d.attributes)e.remove(d.attributes[g]);d.removeEventListener("dispose",o),delete r[d.id];let f=s.get(d);f&&(e.remove(f),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,n.memory.geometries--}function a(h,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,n.memory.geometries++),d}function l(h){let d=h.attributes;for(let f in d)e.update(d[f],t.ARRAY_BUFFER)}function c(h){let d=[],f=h.index,g=h.attributes.position,x=0;if(g===void 0)return;if(f!==null){let b=f.array;x=f.version;for(let E=0,v=b.length;E<v;E+=3){let S=b[E+0],w=b[E+1],T=b[E+2];d.push(S,w,w,T,T,S)}}else{let b=g.array;x=g.version;for(let E=0,v=b.length/3-1;E<v;E+=3){let S=E+0,w=E+1,T=E+2;d.push(S,w,w,T,T,S)}}let p=new(g.count>=65535?gc:mc)(d,1);p.version=x;let m=s.get(h);m&&e.remove(m),s.set(h,p)}function u(h){let d=s.get(h);if(d){let f=h.index;f!==null&&d.version<f.version&&c(h)}else c(h);return s.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function HR(t,e,n){let i;function r(h){i=h}let s,o;function a(h){s=h.type,o=h.bytesPerElement}function l(h,d){t.drawElements(i,d,s,h*o),n.update(d,i,1)}function c(h,d,f){f!==0&&(t.drawElementsInstanced(i,d,s,h*o,f),n.update(d,i,f))}function u(h,d,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,s,h,0,f);let x=0;for(let p=0;p<f;p++)x+=d[p];n.update(x,i,1)}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function WR(t){let e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(s/3);break;case t.LINES:n.lines+=a*(s/2);break;case t.LINE_STRIP:n.lines+=a*(s-1);break;case t.LINE_LOOP:n.lines+=a*s;break;case t.POINTS:n.points+=a*s;break;default:dt("WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function $R(t,e,n){let i=new WeakMap,r=new Ot;function s(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0,d=i.get(a);if(d===void 0||d.count!==h){let A=function(){T.dispose(),i.delete(a),a.removeEventListener("dispose",A)};d!==void 0&&d.texture.dispose();let f=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],b=a.morphAttributes.color||[],E=0;f===!0&&(E=1),g===!0&&(E=2),x===!0&&(E=3);let v=a.attributes.position.count*E,S=1;v>e.maxTextureSize&&(S=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let w=new Float32Array(v*S*4*h),T=new pc(w,v,S,h);T.type=er,T.needsUpdate=!0;let y=E*4;for(let P=0;P<h;P++){let F=p[P],O=m[P],z=b[P],L=v*S*4*P;for(let V=0;V<F.count;V++){let D=V*y;f===!0&&(r.fromBufferAttribute(F,V),w[L+D+0]=r.x,w[L+D+1]=r.y,w[L+D+2]=r.z,w[L+D+3]=0),g===!0&&(r.fromBufferAttribute(O,V),w[L+D+4]=r.x,w[L+D+5]=r.y,w[L+D+6]=r.z,w[L+D+7]=0),x===!0&&(r.fromBufferAttribute(z,V),w[L+D+8]=r.x,w[L+D+9]=r.y,w[L+D+10]=r.z,w[L+D+11]=z.itemSize===4?r.w:1)}}d={count:h,texture:T,size:new ht(v,S)},i.set(a,d),a.addEventListener("dispose",A)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];let g=a.morphTargetsRelative?1:1-f;l.getUniforms().setValue(t,"morphTargetBaseInfluence",g),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",d.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",d.size)}return{update:s}}function XR(t,e,n,i,r){let s=new WeakMap;function o(c){let u=r.render.frame,h=c.geometry,d=e.get(c,h);if(s.get(d)!==u&&(e.update(d),s.set(d,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(n.update(c.instanceMatrix,t.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,t.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){let f=c.skeleton;s.get(f)!==u&&(f.update(),s.set(f,u))}return d}function a(){s=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),n.remove(u.instanceMatrix),u.instanceColor!==null&&n.remove(u.instanceColor)}return{update:o,dispose:a}}var YR={[o0]:"LINEAR_TONE_MAPPING",[a0]:"REINHARD_TONE_MAPPING",[l0]:"CINEON_TONE_MAPPING",[c0]:"ACES_FILMIC_TONE_MAPPING",[h0]:"AGX_TONE_MAPPING",[d0]:"NEUTRAL_TONE_MAPPING",[u0]:"CUSTOM_TONE_MAPPING"};function qR(t,e,n,i,r,s){let o=new Ln(e,n,{type:t,depthBuffer:r,stencilBuffer:s,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new wn;c.setAttribute("position",new Kt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Kt([0,2,0,0,2,0],2));let u=new pd({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),h=new zt(c,u),d=new ps(-1,1,1,-1,0,1),f=null,g=null,x=!1,p,m=null,b=[],E=!1;this.setSize=function(v,S){o.setSize(v,S),a!==null&&a.setSize(v,S),l!==null&&l.setSize(v,S);for(let w=0;w<b.length;w++){let T=b[w];T.setSize&&T.setSize(v,S)}},this.setEffects=function(v){b=v,E=b.length>0&&b[0].isRenderPass===!0;let S=o.width,w=o.height;b.length>0&&a===null&&(a=new Ln(S,w,{type:ri,depthBuffer:!1,stencilBuffer:!1}),l=new Ln(S,w,{type:ri,depthBuffer:!1,stencilBuffer:!1}));for(let T=0;T<b.length;T++){let y=b[T];y.setSize&&y.setSize(S,w)}},this.begin=function(v,S){if(x||v.toneMapping===Ui&&b.length===0)return!1;if(m=S,S!==null){let w=S.width,T=S.height;(o.width!==w||o.height!==T)&&this.setSize(w,T)}return E===!1&&v.setRenderTarget(o),p=v.toneMapping,v.toneMapping=Ui,!0},this.hasRenderPass=function(){return E},this.end=function(v,S){v.toneMapping=p,x=!0;let w=o,T=a;for(let y=0;y<b.length;y++){let A=b[y];A.enabled!==!1&&(A.render(v,T,w,S),A.needsSwap!==!1&&(w=T,T=T===a?l:a))}if(f!==v.outputColorSpace||g!==v.toneMapping){f=v.outputColorSpace,g=v.toneMapping,u.defines={},Mt.getTransfer(f)===$t&&(u.defines.SRGB_TRANSFER="");let y=YR[g];y&&(u.defines[y]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=w.texture,v.setRenderTarget(m),v.render(h,d),m=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var I_=new mi,k0=new qs(1,1),L_=new pc,D_=new od,N_=new Sc,d_=[],f_=[],p_=new Float32Array(16),m_=new Float32Array(9),g_=new Float32Array(4);function ol(t,e,n){let i=t[0];if(i<=0||i>0)return t;let r=e*n,s=d_[r];if(s===void 0&&(s=new Float32Array(r),d_[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(s,a)}return s}function kn(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Bn(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function Ef(t,e){let n=f_[e];n===void 0&&(n=new Int32Array(e),f_[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function jR(t,e){let n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function ZR(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(kn(n,e))return;t.uniform2fv(this.addr,e),Bn(n,e)}}function KR(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(kn(n,e))return;t.uniform3fv(this.addr,e),Bn(n,e)}}function JR(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(kn(n,e))return;t.uniform4fv(this.addr,e),Bn(n,e)}}function QR(t,e){let n=this.cache,i=e.elements;if(i===void 0){if(kn(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Bn(n,e)}else{if(kn(n,i))return;g_.set(i),t.uniformMatrix2fv(this.addr,!1,g_),Bn(n,i)}}function eC(t,e){let n=this.cache,i=e.elements;if(i===void 0){if(kn(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Bn(n,e)}else{if(kn(n,i))return;m_.set(i),t.uniformMatrix3fv(this.addr,!1,m_),Bn(n,i)}}function tC(t,e){let n=this.cache,i=e.elements;if(i===void 0){if(kn(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Bn(n,e)}else{if(kn(n,i))return;p_.set(i),t.uniformMatrix4fv(this.addr,!1,p_),Bn(n,i)}}function nC(t,e){let n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function iC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(kn(n,e))return;t.uniform2iv(this.addr,e),Bn(n,e)}}function rC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(kn(n,e))return;t.uniform3iv(this.addr,e),Bn(n,e)}}function sC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(kn(n,e))return;t.uniform4iv(this.addr,e),Bn(n,e)}}function oC(t,e){let n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function aC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(kn(n,e))return;t.uniform2uiv(this.addr,e),Bn(n,e)}}function lC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(kn(n,e))return;t.uniform3uiv(this.addr,e),Bn(n,e)}}function cC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(kn(n,e))return;t.uniform4uiv(this.addr,e),Bn(n,e)}}function uC(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(k0.compareFunction=n.isReversedDepthBuffer()?yf:vf,s=k0):s=I_,n.setTexture2D(e||s,r)}function hC(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||D_,r)}function dC(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||N_,r)}function fC(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||L_,r)}function pC(t){switch(t){case 5126:return jR;case 35664:return ZR;case 35665:return KR;case 35666:return JR;case 35674:return QR;case 35675:return eC;case 35676:return tC;case 5124:case 35670:return nC;case 35667:case 35671:return iC;case 35668:case 35672:return rC;case 35669:case 35673:return sC;case 5125:return oC;case 36294:return aC;case 36295:return lC;case 36296:return cC;case 35678:case 36198:case 36298:case 36306:case 35682:return uC;case 35679:case 36299:case 36307:return hC;case 35680:case 36300:case 36308:case 36293:return dC;case 36289:case 36303:case 36311:case 36292:return fC}}function mC(t,e){t.uniform1fv(this.addr,e)}function gC(t,e){let n=ol(e,this.size,2);t.uniform2fv(this.addr,n)}function xC(t,e){let n=ol(e,this.size,3);t.uniform3fv(this.addr,n)}function vC(t,e){let n=ol(e,this.size,4);t.uniform4fv(this.addr,n)}function yC(t,e){let n=ol(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function _C(t,e){let n=ol(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function bC(t,e){let n=ol(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function MC(t,e){t.uniform1iv(this.addr,e)}function SC(t,e){t.uniform2iv(this.addr,e)}function wC(t,e){t.uniform3iv(this.addr,e)}function AC(t,e){t.uniform4iv(this.addr,e)}function EC(t,e){t.uniform1uiv(this.addr,e)}function TC(t,e){t.uniform2uiv(this.addr,e)}function RC(t,e){t.uniform3uiv(this.addr,e)}function CC(t,e){t.uniform4uiv(this.addr,e)}function PC(t,e,n){let i=this.cache,r=e.length,s=Ef(n,r);kn(i,s)||(t.uniform1iv(this.addr,s),Bn(i,s));let o;this.type===t.SAMPLER_2D_SHADOW?o=k0:o=I_;for(let a=0;a!==r;++a)n.setTexture2D(e[a]||o,s[a])}function IC(t,e,n){let i=this.cache,r=e.length,s=Ef(n,r);kn(i,s)||(t.uniform1iv(this.addr,s),Bn(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||D_,s[o])}function LC(t,e,n){let i=this.cache,r=e.length,s=Ef(n,r);kn(i,s)||(t.uniform1iv(this.addr,s),Bn(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||N_,s[o])}function DC(t,e,n){let i=this.cache,r=e.length,s=Ef(n,r);kn(i,s)||(t.uniform1iv(this.addr,s),Bn(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||L_,s[o])}function NC(t){switch(t){case 5126:return mC;case 35664:return gC;case 35665:return xC;case 35666:return vC;case 35674:return yC;case 35675:return _C;case 35676:return bC;case 5124:case 35670:return MC;case 35667:case 35671:return SC;case 35668:case 35672:return wC;case 35669:case 35673:return AC;case 5125:return EC;case 36294:return TC;case 36295:return RC;case 36296:return CC;case 35678:case 36198:case 36298:case 36306:case 35682:return PC;case 35679:case 36299:case 36307:return IC;case 35680:case 36300:case 36308:case 36293:return LC;case 36289:case 36303:case 36311:case 36292:return DC}}var B0=class{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=pC(n.type)}},z0=class{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=NC(n.type)}},V0=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){let r=this.seq;for(let s=0,o=r.length;s!==o;++s){let a=r[s];a.setValue(e,n[a.id],i)}}},F0=/(\w+)(\])?(\[|\.)?/g;function x_(t,e){t.seq.push(e),t.map[e.id]=e}function OC(t,e,n){let i=t.name,r=i.length;for(F0.lastIndex=0;;){let s=F0.exec(i),o=F0.lastIndex,a=s[1],l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){x_(n,c===void 0?new B0(a,t,e):new z0(a,t,e));break}else{let h=n.map[a];h===void 0&&(h=new V0(a),x_(n,h)),n=h}}}var sl=class{constructor(e,n){this.seq=[],this.map={};let i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=e.getActiveUniform(n,o),l=e.getUniformLocation(n,a.name);OC(a,l,this)}let r=[],s=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(e,n,i,r){let s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){let r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){let a=n[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,n){let i=[];for(let r=0,s=e.length;r!==s;++r){let o=e[r];o.id in n&&i.push(o)}return i}};function v_(t,e,n){let i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}var FC=37297,UC=0;function kC(t,e){let n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}var y_=new gt;function BC(t){Mt._getMatrix(y_,Mt.workingColorSpace,t);let e=`mat3( ${y_.elements.map(n=>n.toFixed(4))} )`;switch(Mt.getTransfer(t)){case uc:return[e,"LinearTransferOETF"];case $t:return[e,"sRGBTransferOETF"];default:return ut("WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function __(t,e,n){let i=t.getShaderParameter(e,t.COMPILE_STATUS),s=(t.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";let o=/ERROR: 0:(\d+)/.exec(s);if(o){let a=parseInt(o[1]);return n.toUpperCase()+`

`+s+`

`+kC(t.getShaderSource(e),a)}else return s}function zC(t,e){let n=BC(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}var VC={[o0]:"Linear",[a0]:"Reinhard",[l0]:"Cineon",[c0]:"ACESFilmic",[h0]:"AgX",[d0]:"Neutral",[u0]:"Custom"};function GC(t,e){let n=VC[e];return n===void 0?(ut("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+t+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}var bf=new C;function HC(){Mt.getLuminanceCoefficients(bf);let t=bf.x.toFixed(4),e=bf.y.toFixed(4),n=bf.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function WC(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Gc).join(`
`)}function $C(t){let e=[];for(let n in t){let i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function XC(t,e){let n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){let s=t.getActiveAttrib(e,r),o=s.name,a=1;s.type===t.FLOAT_MAT2&&(a=2),s.type===t.FLOAT_MAT3&&(a=3),s.type===t.FLOAT_MAT4&&(a=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function Gc(t){return t!==""}function b_(t,e){let n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function M_(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var YC=/^[ \t]*#include +<([\w\d./]+)>/gm;function G0(t){return t.replace(YC,jC)}var qC=new Map;function jC(t,e){let n=_t[e];if(n===void 0){let i=qC.get(e);if(i!==void 0)n=_t[i],ut('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return G0(n)}var ZC=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function S_(t){return t.replace(ZC,KC)}function KC(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function w_(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}var JC={[Pc]:"SHADOWMAP_TYPE_PCF",[Qa]:"SHADOWMAP_TYPE_VSM"};function QC(t){return JC[t.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var e2={[Js]:"ENVMAP_TYPE_CUBE",[Go]:"ENVMAP_TYPE_CUBE",[Lc]:"ENVMAP_TYPE_CUBE_UV"};function t2(t){return t.envMap===!1?"ENVMAP_TYPE_CUBE":e2[t.envMapMode]||"ENVMAP_TYPE_CUBE"}var n2={[Go]:"ENVMAP_MODE_REFRACTION"};function i2(t){return t.envMap===!1?"ENVMAP_MODE_REFLECTION":n2[t.envMapMode]||"ENVMAP_MODE_REFLECTION"}var r2={[s0]:"ENVMAP_BLENDING_MULTIPLY",[Gy]:"ENVMAP_BLENDING_MIX",[Hy]:"ENVMAP_BLENDING_ADD"};function s2(t){return t.envMap===!1?"ENVMAP_BLENDING_NONE":r2[t.combine]||"ENVMAP_BLENDING_NONE"}function o2(t){let e=t.envMapCubeUVHeight;if(e===null)return null;let n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function a2(t,e,n,i){let r=t.getContext(),s=n.defines,o=n.vertexShader,a=n.fragmentShader,l=QC(n),c=t2(n),u=i2(n),h=s2(n),d=o2(n),f=WC(n),g=$C(s),x=r.createProgram(),p,m,b=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(Gc).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(Gc).join(`
`),m.length>0&&(m+=`
`)):(p=[w_(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Gc).join(`
`),m=[w_(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.retroreflection?"#define USE_RETROREFLECTION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Ui?"#define TONE_MAPPING":"",n.toneMapping!==Ui?_t.tonemapping_pars_fragment:"",n.toneMapping!==Ui?GC("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",_t.colorspace_pars_fragment,zC("linearToOutputTexel",n.outputColorSpace),HC(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Gc).join(`
`)),o=G0(o),o=b_(o,n),o=M_(o,n),a=G0(a),a=b_(a,n),a=M_(a,n),o=S_(o),a=S_(a),n.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",n.glslVersion===M0?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===M0?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let E=b+p+o,v=b+m+a,S=v_(r,r.VERTEX_SHADER,E),w=v_(r,r.FRAGMENT_SHADER,v);r.attachShader(x,S),r.attachShader(x,w),n.index0AttributeName!==void 0?r.bindAttribLocation(x,0,n.index0AttributeName):n.hasPositionAttribute===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function T(F){if(t.debug.checkShaderErrors){let O=r.getProgramInfoLog(x)||"",z=r.getShaderInfoLog(S)||"",L=r.getShaderInfoLog(w)||"",V=O.trim(),D=z.trim(),k=L.trim(),Z=!0,Y=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(Z=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,x,S,w);else{let Q=__(r,S,"vertex"),se=__(r,w,"fragment");dt("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+F.name+`
Material Type: `+F.type+`

Program Info Log: `+V+`
`+Q+`
`+se)}else V!==""?ut("WebGLProgram: Program Info Log:",V):(D===""||k==="")&&(Y=!1);Y&&(F.diagnostics={runnable:Z,programLog:V,vertexShader:{log:D,prefix:p},fragmentShader:{log:k,prefix:m}})}r.deleteShader(S),r.deleteShader(w),y=new sl(r,x),A=XC(r,x)}let y;this.getUniforms=function(){return y===void 0&&T(this),y};let A;this.getAttributes=function(){return A===void 0&&T(this),A};let P=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return P===!1&&(P=r.getProgramParameter(x,FC)),P},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=UC++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=S,this.fragmentShader=w,this}var l2=0,H0=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,n,i){let r=this._getShaderCacheForMaterial(e);return r.has(n)===!1&&(r.add(n),n.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){let n=this.materialCache.get(e);for(let i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let n=this.materialCache,i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){let n=this.shaderCache,i=n.get(e);return i===void 0&&(i=new W0(e),n.set(e,i)),i}},W0=class{constructor(e){this.id=l2++,this.code=e,this.usedTimes=0}};function c2(t){return t===to||t===kc||t===Bc}function u2(t,e,n,i,r,s){let o=new qa,a=new H0,l=new Set,c=[],u=new Map,h=i.logarithmicDepthBuffer,d=i.precision,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(y){return l.add(y),y===0?"uv":`uv${y}`}function x(y,A,P,F,O,z){let L=F.fog,V=O.geometry,D=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?F.environment:null,k=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,Z=e.get(y.envMap||D,k),Y=Z&&Z.mapping===Lc?Z.image.height:null,Q=f[y.type];y.precision!==null&&(d=i.getMaxPrecision(y.precision),d!==y.precision&&ut("WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));let se=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Le=se!==void 0?se.length:0,Oe=0;V.morphAttributes.position!==void 0&&(Oe=1),V.morphAttributes.normal!==void 0&&(Oe=2),V.morphAttributes.color!==void 0&&(Oe=3);let mt,$e,rt,j;if(Q){let Qt=Gr[Q];mt=Qt.vertexShader,$e=Qt.fragmentShader}else{mt=y.vertexShader,$e=y.fragmentShader;let Qt=a.getVertexShaderStage(y),It=a.getFragmentShaderStage(y);a.update(y,Qt,It),rt=Qt.id,j=It.id}let ne=t.getRenderTarget(),Ee=t.state.buffers.depth.getReversed(),et=O.isInstancedMesh===!0,Ae=O.isBatchedMesh===!0,le=!!y.map,ge=!!y.matcap,De=!!Z,Ye=!!y.aoMap,vt=!!y.lightMap,Te=!!y.bumpMap&&y.wireframe===!1,Ce=!!y.normalMap,st=!!y.displacementMap,Jt=!!y.emissiveMap,jt=!!y.metalnessMap,Zt=!!y.roughnessMap,U=y.anisotropy>0,Tn=y.clearcoat>0,bt=y.dispersion>0,I=y.retroreflectivity>0,_=y.iridescence>0,G=y.sheen>0,q=y.transmission>0,ee=U&&!!y.anisotropyMap,Me=Tn&&!!y.clearcoatMap,Ne=Tn&&!!y.clearcoatNormalMap,ie=Tn&&!!y.clearcoatRoughnessMap,oe=_&&!!y.iridescenceMap,Pe=_&&!!y.iridescenceThicknessMap,Ze=G&&!!y.sheenColorMap,R=G&&!!y.sheenRoughnessMap,H=!!y.specularMap,ae=!!y.specularColorMap,be=!!y.specularIntensityMap,Ve=q&&!!y.transmissionMap,N=q&&!!y.thicknessMap,ye=!!y.gradientMap,te=!!y.alphaMap,Se=y.alphaTest>0,ce=!!y.alphaHash,re=!!y.extensions,Ie=Ui;y.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(Ie=t.toneMapping);let ze={shaderID:Q,shaderType:y.type,shaderName:y.name,vertexShader:mt,fragmentShader:$e,defines:y.defines,customVertexShaderID:rt,customFragmentShaderID:j,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:Ae,batchingColor:Ae&&O._colorsTexture!==null,instancing:et,instancingColor:et&&O.instanceColor!==null,instancingMorph:et&&O.morphTexture!==null,outputColorSpace:ne===null?t.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:Mt.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:le,matcap:ge,envMap:De,envMapMode:De&&Z.mapping,envMapCubeUVHeight:Y,aoMap:Ye,lightMap:vt,bumpMap:Te,normalMap:Ce,displacementMap:st,emissiveMap:Jt,normalMapObjectSpace:Ce&&y.normalMapType===Xy,normalMapTangentSpace:Ce&&y.normalMapType===_0,packedNormalMap:Ce&&y.normalMapType===_0&&c2(y.normalMap.format),metalnessMap:jt,roughnessMap:Zt,anisotropy:U,anisotropyMap:ee,clearcoat:Tn,clearcoatMap:Me,clearcoatNormalMap:Ne,clearcoatRoughnessMap:ie,dispersion:bt,retroreflection:I,iridescence:_,iridescenceMap:oe,iridescenceThicknessMap:Pe,sheen:G,sheenColorMap:Ze,sheenRoughnessMap:R,specularMap:H,specularColorMap:ae,specularIntensityMap:be,transmission:q,transmissionMap:Ve,thicknessMap:N,gradientMap:ye,opaque:y.transparent===!1&&y.blending===vr&&y.alphaToCoverage===!1,alphaMap:te,alphaTest:Se,alphaHash:ce,combine:y.combine,mapUv:le&&g(y.map.channel),aoMapUv:Ye&&g(y.aoMap.channel),lightMapUv:vt&&g(y.lightMap.channel),bumpMapUv:Te&&g(y.bumpMap.channel),normalMapUv:Ce&&g(y.normalMap.channel),displacementMapUv:st&&g(y.displacementMap.channel),emissiveMapUv:Jt&&g(y.emissiveMap.channel),metalnessMapUv:jt&&g(y.metalnessMap.channel),roughnessMapUv:Zt&&g(y.roughnessMap.channel),anisotropyMapUv:ee&&g(y.anisotropyMap.channel),clearcoatMapUv:Me&&g(y.clearcoatMap.channel),clearcoatNormalMapUv:Ne&&g(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ie&&g(y.clearcoatRoughnessMap.channel),iridescenceMapUv:oe&&g(y.iridescenceMap.channel),iridescenceThicknessMapUv:Pe&&g(y.iridescenceThicknessMap.channel),sheenColorMapUv:Ze&&g(y.sheenColorMap.channel),sheenRoughnessMapUv:R&&g(y.sheenRoughnessMap.channel),specularMapUv:H&&g(y.specularMap.channel),specularColorMapUv:ae&&g(y.specularColorMap.channel),specularIntensityMapUv:be&&g(y.specularIntensityMap.channel),transmissionMapUv:Ve&&g(y.transmissionMap.channel),thicknessMapUv:N&&g(y.thicknessMap.channel),alphaMapUv:te&&g(y.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(Ce||U),vertexNormals:!!V.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!V.attributes.uv&&(le||te),fog:!!L,useFog:y.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||V.attributes.normal===void 0&&Ce===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:Ee,skinning:O.isSkinnedMesh===!0,hasPositionAttribute:V.attributes.position!==void 0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:Le,morphTextureStride:Oe,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:y.dithering,shadowMapEnabled:t.shadowMap.enabled&&P.length>0,shadowMapType:t.shadowMap.type,toneMapping:Ie,decodeVideoTexture:le&&y.map.isVideoTexture===!0&&Mt.getTransfer(y.map.colorSpace)===$t,decodeVideoTextureEmissive:Jt&&y.emissiveMap.isVideoTexture===!0&&Mt.getTransfer(y.emissiveMap.colorSpace)===$t,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===zr,flipSided:y.side===xi,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:re&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(re&&y.extensions.multiDraw===!0||Ae)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return ze.vertexUv1s=l.has(1),ze.vertexUv2s=l.has(2),ze.vertexUv3s=l.has(3),l.clear(),ze}function p(y){let A=[];if(y.shaderID?A.push(y.shaderID):(A.push(y.customVertexShaderID),A.push(y.customFragmentShaderID)),y.defines!==void 0)for(let P in y.defines)A.push(P),A.push(y.defines[P]);return y.isRawShaderMaterial===!1&&(m(A,y),b(A,y),A.push(t.outputColorSpace)),A.push(y.customProgramCacheKey),A.join()}function m(y,A){y.push(A.precision),y.push(A.outputColorSpace),y.push(A.envMapMode),y.push(A.envMapCubeUVHeight),y.push(A.mapUv),y.push(A.alphaMapUv),y.push(A.lightMapUv),y.push(A.aoMapUv),y.push(A.bumpMapUv),y.push(A.normalMapUv),y.push(A.displacementMapUv),y.push(A.emissiveMapUv),y.push(A.metalnessMapUv),y.push(A.roughnessMapUv),y.push(A.anisotropyMapUv),y.push(A.clearcoatMapUv),y.push(A.clearcoatNormalMapUv),y.push(A.clearcoatRoughnessMapUv),y.push(A.iridescenceMapUv),y.push(A.iridescenceThicknessMapUv),y.push(A.sheenColorMapUv),y.push(A.sheenRoughnessMapUv),y.push(A.specularMapUv),y.push(A.specularColorMapUv),y.push(A.specularIntensityMapUv),y.push(A.transmissionMapUv),y.push(A.thicknessMapUv),y.push(A.combine),y.push(A.fogExp2),y.push(A.sizeAttenuation),y.push(A.morphTargetsCount),y.push(A.morphAttributeCount),y.push(A.numSunLights),y.push(A.numDirLights),y.push(A.numPointLights),y.push(A.numSpotLights),y.push(A.numSpotLightMaps),y.push(A.numHemiLights),y.push(A.numRectAreaLights),y.push(A.numSunLightShadows),y.push(A.numDirLightShadows),y.push(A.numPointLightShadows),y.push(A.numSpotLightShadows),y.push(A.numSpotLightShadowsWithMaps),y.push(A.numLightProbes),y.push(A.shadowMapType),y.push(A.toneMapping),y.push(A.numClippingPlanes),y.push(A.numClipIntersection),y.push(A.depthPacking)}function b(y,A){o.disableAll(),A.instancing&&o.enable(0),A.instancingColor&&o.enable(1),A.instancingMorph&&o.enable(2),A.matcap&&o.enable(3),A.envMap&&o.enable(4),A.normalMapObjectSpace&&o.enable(5),A.normalMapTangentSpace&&o.enable(6),A.clearcoat&&o.enable(7),A.iridescence&&o.enable(8),A.alphaTest&&o.enable(9),A.vertexColors&&o.enable(10),A.vertexAlphas&&o.enable(11),A.vertexUv1s&&o.enable(12),A.vertexUv2s&&o.enable(13),A.vertexUv3s&&o.enable(14),A.vertexTangents&&o.enable(15),A.anisotropy&&o.enable(16),A.alphaHash&&o.enable(17),A.batching&&o.enable(18),A.dispersion&&o.enable(19),A.retroreflection&&o.enable(24),A.batchingColor&&o.enable(20),A.gradientMap&&o.enable(21),A.packedNormalMap&&o.enable(22),A.vertexNormals&&o.enable(23),y.push(o.mask),o.disableAll(),A.fog&&o.enable(0),A.useFog&&o.enable(1),A.flatShading&&o.enable(2),A.logarithmicDepthBuffer&&o.enable(3),A.reversedDepthBuffer&&o.enable(4),A.skinning&&o.enable(5),A.morphTargets&&o.enable(6),A.morphNormals&&o.enable(7),A.morphColors&&o.enable(8),A.premultipliedAlpha&&o.enable(9),A.shadowMapEnabled&&o.enable(10),A.doubleSided&&o.enable(11),A.flipSided&&o.enable(12),A.useDepthPacking&&o.enable(13),A.dithering&&o.enable(14),A.transmission&&o.enable(15),A.sheen&&o.enable(16),A.opaque&&o.enable(17),A.pointsUvs&&o.enable(18),A.decodeVideoTexture&&o.enable(19),A.decodeVideoTextureEmissive&&o.enable(20),A.alphaToCoverage&&o.enable(21),A.numLightProbeGrids>0&&o.enable(22),A.hasPositionAttribute&&o.enable(23),y.push(o.mask)}function E(y){let A=f[y.type],P;if(A){let F=Gr[A];P=s_.clone(F.uniforms)}else P=y.uniforms;return P}function v(y,A){let P=u.get(A);return P!==void 0?++P.usedTimes:(P=new a2(t,A,y,r),c.push(P),u.set(A,P)),P}function S(y){if(--y.usedTimes===0){let A=c.indexOf(y);c[A]=c[c.length-1],c.pop(),u.delete(y.cacheKey),y.destroy()}}function w(y){a.remove(y)}function T(){a.dispose()}return{getParameters:x,getProgramCacheKey:p,getUniforms:E,acquireProgram:v,releaseProgram:S,releaseShaderCache:w,programs:c,dispose:T}}function h2(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let a=t.get(o);return a===void 0&&(a={},t.set(o,a)),a}function i(o){t.delete(o)}function r(o,a,l){t.get(o)[a]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function d2(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.materialVariant!==e.materialVariant?t.materialVariant-e.materialVariant:t.z!==e.z?t.z-e.z:t.id-e.id}function A_(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function E_(){let t=[],e=0,n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function a(d,f,g,x,p,m){let b=t[e];return b===void 0?(b={id:d.id,object:d,geometry:f,material:g,materialVariant:o(d),groupOrder:x,renderOrder:d.renderOrder,z:p,group:m},t[e]=b):(b.id=d.id,b.object=d,b.geometry=f,b.material=g,b.materialVariant=o(d),b.groupOrder=x,b.renderOrder=d.renderOrder,b.z=p,b.group=m),e++,b}function l(d,f,g,x,p,m,b){b.reversedDepth===!0&&(p=-p);let E=a(d,f,g,x,p,m);g.transmission>0?i.push(E):g.transparent===!0?r.push(E):n.push(E)}function c(d,f,g,x,p,m){let b=a(d,f,g,x,p,m);g.transmission>0?i.unshift(b):g.transparent===!0?r.unshift(b):n.unshift(b)}function u(d,f){n.length>1&&n.sort(d||d2),i.length>1&&i.sort(f||A_),r.length>1&&r.sort(f||A_)}function h(){for(let d=e,f=t.length;d<f;d++){let g=t[d];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:l,unshift:c,finish:h,sort:u}}function f2(){let t=new WeakMap;function e(i,r){let s=t.get(i),o;return s===void 0?(o=new E_,t.set(i,[o])):r>=s.length?(o=new E_,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function p2(){let t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"SunLight":case"DirectionalLight":n={direction:new C,color:new wt};break;case"SpotLight":n={position:new C,direction:new C,color:new wt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new C,color:new wt,distance:0,decay:0};break;case"HemisphereLight":n={direction:new C,skyColor:new wt,groundColor:new wt};break;case"RectAreaLight":n={color:new wt,position:new C,halfWidth:new C,halfHeight:new C};break}return t[e.id]=n,n}}}function m2(){let t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"SunLight":case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ht,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}var g2=0;function x2(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function v2(t){let e=new p2,n=m2(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new C);let r=new C,s=new Ct,o=new Ct;function a(c){let u=0,h=0,d=0;for(let O=0;O<9;O++)i.probe[O].set(0,0,0);let f=0,g=0,x=0,p=0,m=0,b=0,E=0,v=0,S=0,w=0,T=0,y=0,A=0,P=0;c.sort(x2);for(let O=0,z=c.length;O<z;O++){let L=c[O],V=L.color,D=L.intensity,k=L.distance,Z=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===to?Z=L.shadow.map.texture:Z=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)u+=V.r*D,h+=V.g*D,d+=V.b*D;else if(L.isLightProbe){for(let Y=0;Y<9;Y++)i.probe[Y].addScaledVector(L.sh.coefficients[Y],D);P++}else if(L.isSunLight){let Y=e.get(L);if(Y.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let Q=L.shadow,se=n.get(L);se.shadowIntensity=Q.intensity,se.shadowBias=Q.bias,se.shadowNormalBias=Q.normalBias,se.shadowRadius=Q.radius,se.shadowMapSize.copy(Q.mapSize).multiply(Q.getFrameExtents()),i.sunShadow[g]=se,i.sunShadowMap[g]=Z;let Le=Q.getViewportCount();for(let Oe=0;Oe<Le;Oe++)i.sunShadowMatrix[x+Oe]=Q.getMatrix(Oe),i.sunShadowCascade[x+Oe]=Q._cascadeData[Oe];x+=Le,g++}i.sun[f]=Y,f++}else if(L.isDirectionalLight){let Y=e.get(L);if(Y.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let Q=L.shadow,se=n.get(L);se.shadowIntensity=Q.intensity,se.shadowBias=Q.bias,se.shadowNormalBias=Q.normalBias,se.shadowRadius=Q.radius,se.shadowMapSize=Q.mapSize,i.directionalShadow[p]=se,i.directionalShadowMap[p]=Z,i.directionalShadowMatrix[p]=L.shadow.matrix,S++}i.directional[p]=Y,p++}else if(L.isSpotLight){let Y=e.get(L);Y.position.setFromMatrixPosition(L.matrixWorld),Y.color.copy(V).multiplyScalar(D),Y.distance=k,Y.coneCos=Math.cos(L.angle),Y.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),Y.decay=L.decay,i.spot[b]=Y;let Q=L.shadow;if(L.map&&(i.spotLightMap[y]=L.map,y++,Q.updateMatrices(L),L.castShadow&&A++),i.spotLightMatrix[b]=Q.matrix,L.castShadow){let se=n.get(L);se.shadowIntensity=Q.intensity,se.shadowBias=Q.bias,se.shadowNormalBias=Q.normalBias,se.shadowRadius=Q.radius,se.shadowMapSize=Q.mapSize,i.spotShadow[b]=se,i.spotShadowMap[b]=Z,T++}b++}else if(L.isRectAreaLight){let Y=e.get(L);Y.color.copy(V).multiplyScalar(D),Y.halfWidth.set(L.width*.5,0,0),Y.halfHeight.set(0,L.height*.5,0),i.rectArea[E]=Y,E++}else if(L.isPointLight){let Y=e.get(L);if(Y.color.copy(L.color).multiplyScalar(L.intensity),Y.distance=L.distance,Y.decay=L.decay,L.castShadow){let Q=L.shadow,se=n.get(L);se.shadowIntensity=Q.intensity,se.shadowBias=Q.bias,se.shadowNormalBias=Q.normalBias,se.shadowRadius=Q.radius,se.shadowMapSize=Q.mapSize,se.shadowCameraNear=Q.camera.near,se.shadowCameraFar=Q.camera.far,i.pointShadow[m]=se,i.pointShadowMap[m]=Z,i.pointShadowMatrix[m]=L.shadow.matrix,w++}i.point[m]=Y,m++}else if(L.isHemisphereLight){let Y=e.get(L);Y.skyColor.copy(L.color).multiplyScalar(D),Y.groundColor.copy(L.groundColor).multiplyScalar(D),i.hemi[v]=Y,v++}}E>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ue.LTC_FLOAT_1,i.rectAreaLTC2=Ue.LTC_FLOAT_2):(i.rectAreaLTC1=Ue.LTC_HALF_1,i.rectAreaLTC2=Ue.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=h,i.ambient[2]=d;let F=i.hash;(F.sunLength!==f||F.directionalLength!==p||F.pointLength!==m||F.spotLength!==b||F.rectAreaLength!==E||F.hemiLength!==v||F.numSunShadows!==g||F.numDirectionalShadows!==S||F.numPointShadows!==w||F.numSpotShadows!==T||F.numSpotMaps!==y||F.numLightProbes!==P)&&(i.sun.length=f,i.directional.length=p,i.spot.length=b,i.rectArea.length=E,i.point.length=m,i.hemi.length=v,i.sunShadow.length=g,i.sunShadowMap.length=g,i.sunShadowMatrix.length=x,i.sunShadowCascade.length=x,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.directionalShadowMatrix.length=S,i.pointShadow.length=w,i.pointShadowMap.length=w,i.pointShadowMatrix.length=w,i.spotShadow.length=T,i.spotShadowMap.length=T,i.spotLightMatrix.length=T+y-A,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=P,F.sunLength=f,F.directionalLength=p,F.pointLength=m,F.spotLength=b,F.rectAreaLength=E,F.hemiLength=v,F.numSunShadows=g,F.numDirectionalShadows=S,F.numPointShadows=w,F.numSpotShadows=T,F.numSpotMaps=y,F.numLightProbes=P,i.version=g2++)}function l(c,u){let h=0,d=0,f=0,g=0,x=0,p=0,m=u.matrixWorldInverse;for(let b=0,E=c.length;b<E;b++){let v=c[b];if(v.isSunLight){let S=i.sun[h];S.direction.setFromMatrixPosition(v.matrixWorld),S.direction.transformDirection(m),h++}else if(v.isDirectionalLight){let S=i.directional[d];S.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(m),d++}else if(v.isSpotLight){let S=i.spot[g];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(m),g++}else if(v.isRectAreaLight){let S=i.rectArea[x];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(m),o.identity(),s.copy(v.matrixWorld),s.premultiply(m),o.extractRotation(s),S.halfWidth.set(v.width*.5,0,0),S.halfHeight.set(0,v.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),x++}else if(v.isPointLight){let S=i.point[f];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(m),f++}else if(v.isHemisphereLight){let S=i.hemi[p];S.direction.setFromMatrixPosition(v.matrixWorld),S.direction.transformDirection(m),p++}}}return{setup:a,setupView:l,state:i}}function T_(t){let e=new v2(t),n=[],i=[],r=[];function s(d){h.camera=d,n.length=0,i.length=0,r.length=0}function o(d){n.push(d)}function a(d){i.push(d)}function l(d){r.push(d)}function c(){e.setup(n)}function u(d){e.setupView(n,d)}let h={lightsArray:n,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:h,setupLights:c,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function y2(t){let e=new WeakMap;function n(r,s=0){let o=e.get(r),a;return o===void 0?(a=new T_(t),e.set(r,[a])):s>=o.length?(a=new T_(t),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:n,dispose:i}}var _2=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,b2=`uniform sampler2D shadow_pass;
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
}`,M2=[new C(1,0,0),new C(-1,0,0),new C(0,1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1)],S2=[new C(0,-1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1),new C(0,-1,0),new C(0,-1,0)],R_=new Ct,Vc=new C,U0=new C;function w2(t,e,n){let i=new _c,r=new ht,s=new ht,o=new Ot,a=new md,l=new gd,c={},u=n.maxTextureSize,h={[Br]:xi,[xi]:Br,[zr]:zr},d=new Pt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ht},radius:{value:4}},vertexShader:_2,fragmentShader:b2}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let g=new wn;g.setAttribute("position",new rn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new zt(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Pc;let m=this.type;this.render=function(w,T,y){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;this.type===Ay&&(ut("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Pc);let A=t.getRenderTarget(),P=t.getActiveCubeFace(),F=t.getActiveMipmapLevel(),O=t.state;O.setBlending(Ai),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);let z=m!==this.type;z&&T.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(V=>V.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,V=w.length;L<V;L++){let D=w[L],k=D.shadow;if(k===void 0){ut("WebGLShadowMap:",D,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;r.copy(k.mapSize);let Z=k.getFrameExtents();r.multiply(Z),s.copy(k.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/Z.x),r.x=s.x*Z.x,k.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/Z.y),r.y=s.y*Z.y,k.mapSize.y=s.y));let Y=t.state.buffers.depth.getReversed();if(k.camera._reversedDepth=Y,k.map===null||z===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===Qa){if(D.isPointLight){ut("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new Ln(r.x,r.y,{format:to,type:ri,minFilter:Et,magFilter:Et,generateMipmaps:!1}),k.map.texture.name=D.name+".shadowMap",k.map.depthTexture=new qs(r.x,r.y,er),k.map.depthTexture.name=D.name+".shadowMapDepth",k.map.depthTexture.format=Dr,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Gn,k.map.depthTexture.magFilter=Gn}else D.isPointLight?(k.map=new Sf(r.x),k.map.depthTexture=new fd(r.x,yr)):(k.map=new Ln(r.x,r.y),k.map.depthTexture=new qs(r.x,r.y,yr)),k.map.depthTexture.name=D.name+".shadowMap",k.map.depthTexture.format=Dr,this.type===Pc?(k.map.depthTexture.compareFunction=Y?yf:vf,k.map.depthTexture.minFilter=Et,k.map.depthTexture.magFilter=Et):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Gn,k.map.depthTexture.magFilter=Gn);k.camera.updateProjectionMatrix()}k.map.isWebGLCubeRenderTarget!==!0&&(k.map.width!==r.x||k.map.height!==r.y)&&k.map.setSize(r.x,r.y);let Q=k.map.isWebGLCubeRenderTarget?6:k.getViewportCount();D.isPointLight!==!0&&k.updateMatrices(D,y);for(let se=0;se<Q;se++){let Le=k.getCamera(se);if(D.isPointLight){let Oe=k.camera,mt=k.matrix,$e=D.distance||Oe.far;$e!==Oe.far&&(Oe.far=$e,Oe.updateProjectionMatrix()),Vc.setFromMatrixPosition(D.matrixWorld),Oe.position.copy(Vc),U0.copy(Oe.position),U0.add(M2[se]),Oe.up.copy(S2[se]),Oe.lookAt(U0),Oe.updateMatrixWorld(),mt.makeTranslation(-Vc.x,-Vc.y,-Vc.z),R_.multiplyMatrices(Oe.projectionMatrix,Oe.matrixWorldInverse),k._frustum.setFromProjectionMatrix(R_,Oe.coordinateSystem,Oe.reversedDepth)}if(k.map.isWebGLCubeRenderTarget)t.setRenderTarget(k.map,se),t.clear();else{se===0&&(t.setRenderTarget(k.map),t.clear());let Oe=k.getViewport(se);o.set(s.x*Oe.x,s.y*Oe.y,s.x*Oe.z,s.y*Oe.w),O.viewport(o)}i=k.getFrustum(se),v(T,y,Le,D,this.type)}k.isPointLightShadow!==!0&&this.type===Qa&&b(k,y),k.needsUpdate=!1}m=this.type,p.needsUpdate=!1,t.setRenderTarget(A,P,F)};function b(w,T){let y=e.update(x);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null?w.mapPass=new Ln(r.x,r.y,{format:to,type:ri}):(w.mapPass.width!==w.map.width||w.mapPass.height!==w.map.height)&&w.mapPass.setSize(w.map.width,w.map.height),d.uniforms.shadow_pass.value=w.map.depthTexture,d.uniforms.resolution.value.set(w.map.width,w.map.height),d.uniforms.radius.value=w.radius,t.setRenderTarget(w.mapPass),t.clear(),t.renderBufferDirect(T,null,y,d,x,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value.set(w.map.width,w.map.height),f.uniforms.radius.value=w.radius,t.setRenderTarget(w.map),t.clear(),t.renderBufferDirect(T,null,y,f,x,null)}function E(w,T,y,A){let P=null,F=y.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(F!==void 0)P=F;else if(P=y.isPointLight===!0?l:a,t.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0||T.alphaToCoverage===!0){let O=P.uuid,z=T.uuid,L=c[O];L===void 0&&(L={},c[O]=L);let V=L[z];V===void 0&&(V=P.clone(),L[z]=V,T.addEventListener("dispose",S)),P=V}if(P.visible=T.visible,P.wireframe=T.wireframe,A===Qa?P.side=T.shadowSide!==null?T.shadowSide:T.side:P.side=T.shadowSide!==null?T.shadowSide:h[T.side],P.alphaMap=T.alphaMap,P.alphaTest=T.alphaToCoverage===!0?.5:T.alphaTest,P.map=T.map,P.clipShadows=T.clipShadows,P.clippingPlanes=T.clippingPlanes,P.clipIntersection=T.clipIntersection,P.displacementMap=T.displacementMap,P.displacementScale=T.displacementScale,P.displacementBias=T.displacementBias,P.wireframeLinewidth=T.wireframeLinewidth,P.linewidth=T.linewidth,y.isPointLight===!0&&P.isMeshDistanceMaterial===!0){let O=t.properties.get(P);O.light=y}return P}function v(w,T,y,A,P){if(w.visible===!1)return;if(w.layers.test(T.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&P===Qa)&&(!w.frustumCulled||w.intersectsFrustum(i))){w.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,w.matrixWorld);let z=e.update(w),L=w.material;if(Array.isArray(L)){let V=z.groups;for(let D=0,k=V.length;D<k;D++){let Z=V[D],Y=L[Z.materialIndex];if(Y&&Y.visible){let Q=E(w,Y,A,P);w.onBeforeShadow(t,w,T,y,z,Q,Z),t.renderBufferDirect(y,null,z,Q,w,Z),w.onAfterShadow(t,w,T,y,z,Q,Z)}}}else if(L.visible){let V=E(w,L,A,P);w.onBeforeShadow(t,w,T,y,z,V,null),t.renderBufferDirect(y,null,z,V,w,null),w.onAfterShadow(t,w,T,y,z,V,null)}}let O=w.children;for(let z=0,L=O.length;z<L;z++)v(O[z],T,y,A,P)}function S(w){w.target.removeEventListener("dispose",S);for(let y in c){let A=c[y],P=w.target.uuid;P in A&&(A[P].dispose(),delete A[P])}}}function A2(t,e){function n(){let N=!1,ye=new Ot,te=null,Se=new Ot(0,0,0,0);return{setMask:function(ce){te!==ce&&!N&&(t.colorMask(ce,ce,ce,ce),te=ce)},setLocked:function(ce){N=ce},setClear:function(ce,re,Ie,ze,Qt){Qt===!0&&(ce*=ze,re*=ze,Ie*=ze),ye.set(ce,re,Ie,ze),Se.equals(ye)===!1&&(t.clearColor(ce,re,Ie,ze),Se.copy(ye))},reset:function(){N=!1,te=null,Se.set(-1,0,0,0)}}}function i(){let N=!1,ye=!1,te=null,Se=null,ce=null;return{setReversed:function(re){if(ye!==re){let Ie=e.get("EXT_clip_control");re?Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.ZERO_TO_ONE_EXT):Ie.clipControlEXT(Ie.LOWER_LEFT_EXT,Ie.NEGATIVE_ONE_TO_ONE_EXT),ye=re;let ze=ce;ce=null,this.setClear(ze)}},getReversed:function(){return ye},setTest:function(re){re?ne(t.DEPTH_TEST):Ee(t.DEPTH_TEST)},setMask:function(re){te!==re&&!N&&(t.depthMask(re),te=re)},setFunc:function(re){if(ye&&(re=i_[re]),Se!==re){switch(re){case Yh:t.depthFunc(t.NEVER);break;case qh:t.depthFunc(t.ALWAYS);break;case jh:t.depthFunc(t.LESS);break;case $a:t.depthFunc(t.LEQUAL);break;case Zh:t.depthFunc(t.EQUAL);break;case Kh:t.depthFunc(t.GEQUAL);break;case Jh:t.depthFunc(t.GREATER);break;case Qh:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}Se=re}},setLocked:function(re){N=re},setClear:function(re){ce!==re&&(ce=re,ye&&(re=1-re),t.clearDepth(re))},reset:function(){N=!1,te=null,Se=null,ce=null,ye=!1}}}function r(){let N=!1,ye=null,te=null,Se=null,ce=null,re=null,Ie=null,ze=null,Qt=null;return{setTest:function(It){N||(It?ne(t.STENCIL_TEST):Ee(t.STENCIL_TEST))},setMask:function(It){ye!==It&&!N&&(t.stencilMask(It),ye=It)},setFunc:function(It,Kn,ji){(te!==It||Se!==Kn||ce!==ji)&&(t.stencilFunc(It,Kn,ji),te=It,Se=Kn,ce=ji)},setOp:function(It,Kn,ji){(re!==It||Ie!==Kn||ze!==ji)&&(t.stencilOp(It,Kn,ji),re=It,Ie=Kn,ze=ji)},setLocked:function(It){N=It},setClear:function(It){Qt!==It&&(t.clearStencil(It),Qt=It)},reset:function(){N=!1,ye=null,te=null,Se=null,ce=null,re=null,Ie=null,ze=null,Qt=null}}}let s=new n,o=new i,a=new r,l=new WeakMap,c=new WeakMap,u={},h={},d={},f=new WeakMap,g=[],x=null,p=!1,m=null,b=null,E=null,v=null,S=null,w=null,T=null,y=new wt(0,0,0),A=0,P=!1,F=null,O=null,z=null,L=null,V=null,D=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS),k=!1,Z=0,Y=t.getParameter(t.VERSION);Y.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(Y)[1]),k=Z>=1):Y.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),k=Z>=2);let Q=null,se={},Le=t.getParameter(t.SCISSOR_BOX),Oe=t.getParameter(t.VIEWPORT),mt=new Ot().fromArray(Le),$e=new Ot().fromArray(Oe);function rt(N,ye,te,Se){let ce=new Uint8Array(4),re=t.createTexture();t.bindTexture(N,re),t.texParameteri(N,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(N,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Ie=0;Ie<te;Ie++)N===t.TEXTURE_3D||N===t.TEXTURE_2D_ARRAY?t.texImage3D(ye,0,t.RGBA,1,1,Se,0,t.RGBA,t.UNSIGNED_BYTE,ce):t.texImage2D(ye+Ie,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,ce);return re}let j={};j[t.TEXTURE_2D]=rt(t.TEXTURE_2D,t.TEXTURE_2D,1),j[t.TEXTURE_CUBE_MAP]=rt(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),j[t.TEXTURE_2D_ARRAY]=rt(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),j[t.TEXTURE_3D]=rt(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ne(t.DEPTH_TEST),o.setFunc($a),Te(!1),Ce(t0),ne(t.CULL_FACE),Ye(Ai);function ne(N){u[N]!==!0&&(t.enable(N),u[N]=!0)}function Ee(N){u[N]!==!1&&(t.disable(N),u[N]=!1)}function et(N,ye){return d[N]!==ye?(t.bindFramebuffer(N,ye),d[N]=ye,N===t.DRAW_FRAMEBUFFER&&(d[t.FRAMEBUFFER]=ye),N===t.FRAMEBUFFER&&(d[t.DRAW_FRAMEBUFFER]=ye),!0):!1}function Ae(N,ye){let te=g,Se=!1;if(N){te=f.get(ye),te===void 0&&(te=[],f.set(ye,te));let ce=N.textures;if(te.length!==ce.length||te[0]!==t.COLOR_ATTACHMENT0){for(let re=0,Ie=ce.length;re<Ie;re++)te[re]=t.COLOR_ATTACHMENT0+re;te.length=ce.length,Se=!0}}else te[0]!==t.BACK&&(te[0]=t.BACK,Se=!0);Se&&t.drawBuffers(te)}function le(N){return x!==N?(t.useProgram(N),x=N,!0):!1}let ge={[ms]:t.FUNC_ADD,[Ey]:t.FUNC_SUBTRACT,[Ty]:t.FUNC_REVERSE_SUBTRACT};ge[Ry]=t.MIN,ge[Cy]=t.MAX;let De={[Py]:t.ZERO,[Ic]:t.ONE,[Iy]:t.SRC_COLOR,[r0]:t.SRC_ALPHA,[Uy]:t.SRC_ALPHA_SATURATE,[Oy]:t.DST_COLOR,[Dy]:t.DST_ALPHA,[Ly]:t.ONE_MINUS_SRC_COLOR,[el]:t.ONE_MINUS_SRC_ALPHA,[Fy]:t.ONE_MINUS_DST_COLOR,[Ny]:t.ONE_MINUS_DST_ALPHA,[ky]:t.CONSTANT_COLOR,[By]:t.ONE_MINUS_CONSTANT_COLOR,[zy]:t.CONSTANT_ALPHA,[Vy]:t.ONE_MINUS_CONSTANT_ALPHA};function Ye(N,ye,te,Se,ce,re,Ie,ze,Qt,It){if(N===Ai){p===!0&&(Ee(t.BLEND),p=!1);return}if(p===!1&&(ne(t.BLEND),p=!0),N!==Pd){if(N!==m||It!==P){if((b!==ms||S!==ms)&&(t.blendEquation(t.FUNC_ADD),b=ms,S=ms),It)switch(N){case vr:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Vo:t.blendFunc(t.ONE,t.ONE);break;case n0:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case i0:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:dt("WebGLState: Invalid blending: ",N);break}else switch(N){case vr:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Vo:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case n0:dt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case i0:dt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:dt("WebGLState: Invalid blending: ",N);break}E=null,v=null,w=null,T=null,y.set(0,0,0),A=0,m=N,P=It}return}ce=ce||ye,re=re||te,Ie=Ie||Se,(ye!==b||ce!==S)&&(t.blendEquationSeparate(ge[ye],ge[ce]),b=ye,S=ce),(te!==E||Se!==v||re!==w||Ie!==T)&&(t.blendFuncSeparate(De[te],De[Se],De[re],De[Ie]),E=te,v=Se,w=re,T=Ie),(ze.equals(y)===!1||Qt!==A)&&(t.blendColor(ze.r,ze.g,ze.b,Qt),y.copy(ze),A=Qt),m=N,P=!1}function vt(N,ye){N.side===zr?Ee(t.CULL_FACE):ne(t.CULL_FACE);let te=N.side===xi;ye&&(te=!te),Te(te),N.blending===vr&&N.transparent===!1?Ye(Ai):Ye(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),s.setMask(N.colorWrite);let Se=N.stencilWrite;a.setTest(Se),Se&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),Jt(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?ne(t.SAMPLE_ALPHA_TO_COVERAGE):Ee(t.SAMPLE_ALPHA_TO_COVERAGE)}function Te(N){F!==N&&(N?t.frontFace(t.CW):t.frontFace(t.CCW),F=N)}function Ce(N){N!==Sy?(ne(t.CULL_FACE),N!==O&&(N===t0?t.cullFace(t.BACK):N===wy?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Ee(t.CULL_FACE),O=N}function st(N){N!==z&&(k&&t.lineWidth(N),z=N)}function Jt(N,ye,te){N?(ne(t.POLYGON_OFFSET_FILL),(L!==ye||V!==te)&&(L=ye,V=te,o.getReversed()&&(ye=-ye),t.polygonOffset(ye,te))):Ee(t.POLYGON_OFFSET_FILL)}function jt(N){N?ne(t.SCISSOR_TEST):Ee(t.SCISSOR_TEST)}function Zt(N){N===void 0&&(N=t.TEXTURE0+D-1),Q!==N&&(t.activeTexture(N),Q=N)}function U(N,ye,te){te===void 0&&(Q===null?te=t.TEXTURE0+D-1:te=Q);let Se=se[te];Se===void 0&&(Se={type:void 0,texture:void 0},se[te]=Se),(Se.type!==N||Se.texture!==ye)&&(Q!==te&&(t.activeTexture(te),Q=te),t.bindTexture(N,ye||j[N]),Se.type=N,Se.texture=ye)}function Tn(){let N=se[Q];N!==void 0&&N.type!==void 0&&(t.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function bt(){try{t.compressedTexImage2D(...arguments)}catch(N){dt("WebGLState:",N)}}function I(){try{t.compressedTexImage3D(...arguments)}catch(N){dt("WebGLState:",N)}}function _(){try{t.texSubImage2D(...arguments)}catch(N){dt("WebGLState:",N)}}function G(){try{t.texSubImage3D(...arguments)}catch(N){dt("WebGLState:",N)}}function q(){try{t.compressedTexSubImage2D(...arguments)}catch(N){dt("WebGLState:",N)}}function ee(){try{t.compressedTexSubImage3D(...arguments)}catch(N){dt("WebGLState:",N)}}function Me(){try{t.texStorage2D(...arguments)}catch(N){dt("WebGLState:",N)}}function Ne(){try{t.texStorage3D(...arguments)}catch(N){dt("WebGLState:",N)}}function ie(){try{t.texImage2D(...arguments)}catch(N){dt("WebGLState:",N)}}function oe(){try{t.texImage3D(...arguments)}catch(N){dt("WebGLState:",N)}}function Pe(N){return h[N]!==void 0?h[N]:t.getParameter(N)}function Ze(N,ye){h[N]!==ye&&(t.pixelStorei(N,ye),h[N]=ye)}function R(N){mt.equals(N)===!1&&(t.scissor(N.x,N.y,N.z,N.w),mt.copy(N))}function H(N){$e.equals(N)===!1&&(t.viewport(N.x,N.y,N.z,N.w),$e.copy(N))}function ae(N,ye){let te=c.get(ye);te===void 0&&(te=new WeakMap,c.set(ye,te));let Se=te.get(N);Se===void 0&&(Se=t.getUniformBlockIndex(ye,N.name),te.set(N,Se))}function be(N,ye){let Se=c.get(ye).get(N);l.get(ye)!==Se&&(t.uniformBlockBinding(ye,Se,N.__bindingPointIndex),l.set(ye,Se))}function Ve(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),o.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),t.pixelStorei(t.PACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.BROWSER_DEFAULT_WEBGL),t.pixelStorei(t.PACK_ROW_LENGTH,0),t.pixelStorei(t.PACK_SKIP_PIXELS,0),t.pixelStorei(t.PACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_ROW_LENGTH,0),t.pixelStorei(t.UNPACK_IMAGE_HEIGHT,0),t.pixelStorei(t.UNPACK_SKIP_PIXELS,0),t.pixelStorei(t.UNPACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_SKIP_IMAGES,0),u={},h={},Q=null,se={},d={},f=new WeakMap,g=[],x=null,p=!1,m=null,b=null,E=null,v=null,S=null,w=null,T=null,y=new wt(0,0,0),A=0,P=!1,F=null,O=null,z=null,L=null,V=null,mt.set(0,0,t.canvas.width,t.canvas.height),$e.set(0,0,t.canvas.width,t.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:ne,disable:Ee,bindFramebuffer:et,drawBuffers:Ae,useProgram:le,setBlending:Ye,setMaterial:vt,setFlipSided:Te,setCullFace:Ce,setLineWidth:st,setPolygonOffset:Jt,setScissorTest:jt,activeTexture:Zt,bindTexture:U,unbindTexture:Tn,compressedTexImage2D:bt,compressedTexImage3D:I,texImage2D:ie,texImage3D:oe,pixelStorei:Ze,getParameter:Pe,updateUBOMapping:ae,uniformBlockBinding:be,texStorage2D:Me,texStorage3D:Ne,texSubImage2D:_,texSubImage3D:G,compressedTexSubImage2D:q,compressedTexSubImage3D:ee,scissor:R,viewport:H,reset:Ve}}function E2(t,e,n,i,r,s,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ht,u=new WeakMap,h=new Set,d,f=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(I,_){return g?new OffscreenCanvas(I,_):dc("canvas")}function p(I,_,G){let q=1,ee=bt(I);if((ee.width>G||ee.height>G)&&(q=G/Math.max(ee.width,ee.height)),q<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){let Me=Math.floor(q*ee.width),Ne=Math.floor(q*ee.height);d===void 0&&(d=x(Me,Ne));let ie=_?x(Me,Ne):d;return ie.width=Me,ie.height=Ne,ie.getContext("2d").drawImage(I,0,0,Me,Ne),ut("WebGLRenderer: Texture has been resized from ("+ee.width+"x"+ee.height+") to ("+Me+"x"+Ne+")."),ie}else return"data"in I&&ut("WebGLRenderer: Image in DataTexture is too big ("+ee.width+"x"+ee.height+")."),I;return I}function m(I){return I.generateMipmaps}function b(I){t.generateMipmap(I)}function E(I){return I.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?t.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function v(I,_,G,q,ee,Me=!1){if(I!==null){if(t[I]!==void 0)return t[I];ut("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let Ne;q&&(Ne=e.get("EXT_texture_norm16"),Ne||ut("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let ie=_;if(_===t.RED&&(G===t.FLOAT&&(ie=t.R32F),G===t.HALF_FLOAT&&(ie=t.R16F),G===t.UNSIGNED_BYTE&&(ie=t.R8),G===t.UNSIGNED_SHORT&&Ne&&(ie=Ne.R16_EXT),G===t.SHORT&&Ne&&(ie=Ne.R16_SNORM_EXT)),_===t.RED_INTEGER&&(G===t.UNSIGNED_BYTE&&(ie=t.R8UI),G===t.UNSIGNED_SHORT&&(ie=t.R16UI),G===t.UNSIGNED_INT&&(ie=t.R32UI),G===t.BYTE&&(ie=t.R8I),G===t.SHORT&&(ie=t.R16I),G===t.INT&&(ie=t.R32I)),_===t.RG&&(G===t.FLOAT&&(ie=t.RG32F),G===t.HALF_FLOAT&&(ie=t.RG16F),G===t.UNSIGNED_BYTE&&(ie=t.RG8),G===t.UNSIGNED_SHORT&&Ne&&(ie=Ne.RG16_EXT),G===t.SHORT&&Ne&&(ie=Ne.RG16_SNORM_EXT)),_===t.RG_INTEGER&&(G===t.UNSIGNED_BYTE&&(ie=t.RG8UI),G===t.UNSIGNED_SHORT&&(ie=t.RG16UI),G===t.UNSIGNED_INT&&(ie=t.RG32UI),G===t.BYTE&&(ie=t.RG8I),G===t.SHORT&&(ie=t.RG16I),G===t.INT&&(ie=t.RG32I)),_===t.RGB_INTEGER&&(G===t.UNSIGNED_BYTE&&(ie=t.RGB8UI),G===t.UNSIGNED_SHORT&&(ie=t.RGB16UI),G===t.UNSIGNED_INT&&(ie=t.RGB32UI),G===t.BYTE&&(ie=t.RGB8I),G===t.SHORT&&(ie=t.RGB16I),G===t.INT&&(ie=t.RGB32I)),_===t.RGBA_INTEGER&&(G===t.UNSIGNED_BYTE&&(ie=t.RGBA8UI),G===t.UNSIGNED_SHORT&&(ie=t.RGBA16UI),G===t.UNSIGNED_INT&&(ie=t.RGBA32UI),G===t.BYTE&&(ie=t.RGBA8I),G===t.SHORT&&(ie=t.RGBA16I),G===t.INT&&(ie=t.RGBA32I)),_===t.RGB&&(G===t.UNSIGNED_SHORT&&Ne&&(ie=Ne.RGB16_EXT),G===t.SHORT&&Ne&&(ie=Ne.RGB16_SNORM_EXT),G===t.UNSIGNED_INT_5_9_9_9_REV&&(ie=t.RGB9_E5),G===t.UNSIGNED_INT_10F_11F_11F_REV&&(ie=t.R11F_G11F_B10F)),_===t.RGBA){let oe=Me?uc:Mt.getTransfer(ee);G===t.FLOAT&&(ie=t.RGBA32F),G===t.HALF_FLOAT&&(ie=t.RGBA16F),G===t.UNSIGNED_BYTE&&(ie=oe===$t?t.SRGB8_ALPHA8:t.RGBA8),G===t.UNSIGNED_SHORT&&Ne&&(ie=Ne.RGBA16_EXT),G===t.SHORT&&Ne&&(ie=Ne.RGBA16_SNORM_EXT),G===t.UNSIGNED_SHORT_4_4_4_4&&(ie=t.RGBA4),G===t.UNSIGNED_SHORT_5_5_5_1&&(ie=t.RGB5_A1)}return(ie===t.R16F||ie===t.R32F||ie===t.RG16F||ie===t.RG32F||ie===t.RGBA16F||ie===t.RGBA32F)&&e.get("EXT_color_buffer_float"),ie}function S(I,_){let G;return I?_===null||_===yr||_===nl?G=t.DEPTH24_STENCIL8:_===er?G=t.DEPTH32F_STENCIL8:_===tl&&(G=t.DEPTH24_STENCIL8,ut("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===yr||_===nl?G=t.DEPTH_COMPONENT24:_===er?G=t.DEPTH_COMPONENT32F:_===tl&&(G=t.DEPTH_COMPONENT16),G}function w(I,_){return m(I)===!0||I.isFramebufferTexture&&I.minFilter!==Gn&&I.minFilter!==Et?Math.log2(Math.max(_.width,_.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?_.mipmaps.length:1}function T(I){let _=I.target;_.removeEventListener("dispose",T),A(_),_.isVideoTexture&&u.delete(_),_.isHTMLTexture&&h.delete(_)}function y(I){let _=I.target;_.removeEventListener("dispose",y),F(_)}function A(I){let _=i.get(I);if(_.__webglInit===void 0)return;let G=I.source,q=f.get(G);if(q){let ee=q[_.__cacheKey];ee.usedTimes--,ee.usedTimes===0&&P(I),Object.keys(q).length===0&&f.delete(G)}i.remove(I)}function P(I){let _=i.get(I);t.deleteTexture(_.__webglTexture);let G=I.source,q=f.get(G);delete q[_.__cacheKey],o.memory.textures--}function F(I){let _=i.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),i.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(_.__webglFramebuffer[q]))for(let ee=0;ee<_.__webglFramebuffer[q].length;ee++)t.deleteFramebuffer(_.__webglFramebuffer[q][ee]);else t.deleteFramebuffer(_.__webglFramebuffer[q]);_.__webglDepthbuffer&&t.deleteRenderbuffer(_.__webglDepthbuffer[q])}else{if(Array.isArray(_.__webglFramebuffer))for(let q=0;q<_.__webglFramebuffer.length;q++)t.deleteFramebuffer(_.__webglFramebuffer[q]);else t.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&t.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&t.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let q=0;q<_.__webglColorRenderbuffer.length;q++)_.__webglColorRenderbuffer[q]&&t.deleteRenderbuffer(_.__webglColorRenderbuffer[q]);_.__webglDepthRenderbuffer&&t.deleteRenderbuffer(_.__webglDepthRenderbuffer)}let G=I.textures;for(let q=0,ee=G.length;q<ee;q++){let Me=i.get(G[q]);Me.__webglTexture&&(t.deleteTexture(Me.__webglTexture),o.memory.textures--),i.remove(G[q])}i.remove(I)}let O=0;function z(){O=0}function L(){return O}function V(I){O=I}function D(){let I=O;return I>=r.maxTextures&&ut("WebGLTextures: Trying to use "+(I+1)+" texture units while this GPU supports only "+r.maxTextures),O+=1,I}function k(I){let _=[];return _.push(I.wrapS),_.push(I.wrapT),_.push(I.wrapR||0),_.push(I.magFilter),_.push(I.minFilter),_.push(I.anisotropy),_.push(I.internalFormat),_.push(I.format),_.push(I.type),_.push(I.generateMipmaps),_.push(I.premultiplyAlpha),_.push(I.flipY),_.push(I.unpackAlignment),_.push(I.colorSpace),_.join()}function Z(I,_){let G=i.get(I);if(I.isVideoTexture&&U(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&G.__version!==I.version){let q=I.image;if(q===null)ut("WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)ut("WebGLRenderer: Texture marked for update but image is incomplete");else{Ee(G,I,_);return}}else I.isExternalTexture&&(G.__webglTexture=I.sourceTexture?I.sourceTexture:null);n.bindTexture(t.TEXTURE_2D,G.__webglTexture,t.TEXTURE0+_)}function Y(I,_){let G=i.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&G.__version!==I.version){Ee(G,I,_);return}else I.isExternalTexture&&(G.__webglTexture=I.sourceTexture?I.sourceTexture:null);n.bindTexture(t.TEXTURE_2D_ARRAY,G.__webglTexture,t.TEXTURE0+_)}function Q(I,_){let G=i.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&G.__version!==I.version){Ee(G,I,_);return}n.bindTexture(t.TEXTURE_3D,G.__webglTexture,t.TEXTURE0+_)}function se(I,_){let G=i.get(I);if(I.isCubeDepthTexture!==!0&&I.version>0&&G.__version!==I.version){et(G,I,_);return}n.bindTexture(t.TEXTURE_CUBE_MAP,G.__webglTexture,t.TEXTURE0+_)}let Le={[ed]:t.REPEAT,[ii]:t.CLAMP_TO_EDGE,[td]:t.MIRRORED_REPEAT},Oe={[Gn]:t.NEAREST,[Wy]:t.NEAREST_MIPMAP_NEAREST,[Dc]:t.NEAREST_MIPMAP_LINEAR,[Et]:t.LINEAR,[Dd]:t.LINEAR_MIPMAP_NEAREST,[Qs]:t.LINEAR_MIPMAP_LINEAR},mt={[qy]:t.NEVER,[Qy]:t.ALWAYS,[jy]:t.LESS,[vf]:t.LEQUAL,[Zy]:t.EQUAL,[yf]:t.GEQUAL,[Ky]:t.GREATER,[Jy]:t.NOTEQUAL};function $e(I,_){if(_.type===er&&e.has("OES_texture_float_linear")===!1&&(_.magFilter===Et||_.magFilter===Dd||_.magFilter===Dc||_.magFilter===Qs||_.minFilter===Et||_.minFilter===Dd||_.minFilter===Dc||_.minFilter===Qs)&&ut("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(I,t.TEXTURE_WRAP_S,Le[_.wrapS]),t.texParameteri(I,t.TEXTURE_WRAP_T,Le[_.wrapT]),(I===t.TEXTURE_3D||I===t.TEXTURE_2D_ARRAY)&&t.texParameteri(I,t.TEXTURE_WRAP_R,Le[_.wrapR]),t.texParameteri(I,t.TEXTURE_MAG_FILTER,Oe[_.magFilter]),t.texParameteri(I,t.TEXTURE_MIN_FILTER,Oe[_.minFilter]),_.compareFunction&&(t.texParameteri(I,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(I,t.TEXTURE_COMPARE_FUNC,mt[_.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Gn||_.minFilter!==Dc&&_.minFilter!==Qs||_.type===er&&e.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||i.get(_).__currentAnisotropy){let G=e.get("EXT_texture_filter_anisotropic");t.texParameterf(I,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,r.getMaxAnisotropy())),i.get(_).__currentAnisotropy=_.anisotropy}}}function rt(I,_){let G=!1;I.__webglInit===void 0&&(I.__webglInit=!0,_.addEventListener("dispose",T));let q=_.source,ee=f.get(q);ee===void 0&&(ee={},f.set(q,ee));let Me=k(_);if(Me!==I.__cacheKey){ee[Me]===void 0&&(ee[Me]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,G=!0),ee[Me].usedTimes++;let Ne=ee[I.__cacheKey];Ne!==void 0&&(ee[I.__cacheKey].usedTimes--,Ne.usedTimes===0&&P(_)),I.__cacheKey=Me,I.__webglTexture=ee[Me].texture}return G}function j(I,_,G){return Math.floor(Math.floor(I/G)/_)}function ne(I,_,G,q){let Me=I.updateRanges;if(Me.length===0)n.texSubImage2D(t.TEXTURE_2D,0,0,0,_.width,_.height,G,q,_.data);else{Me.sort((Ze,R)=>Ze.start-R.start);let Ne=0;for(let Ze=1;Ze<Me.length;Ze++){let R=Me[Ne],H=Me[Ze],ae=R.start+R.count,be=j(H.start,_.width,4),Ve=j(R.start,_.width,4);H.start<=ae+1&&be===Ve&&j(H.start+H.count-1,_.width,4)===be?R.count=Math.max(R.count,H.start+H.count-R.start):(++Ne,Me[Ne]=H)}Me.length=Ne+1;let ie=n.getParameter(t.UNPACK_ROW_LENGTH),oe=n.getParameter(t.UNPACK_SKIP_PIXELS),Pe=n.getParameter(t.UNPACK_SKIP_ROWS);n.pixelStorei(t.UNPACK_ROW_LENGTH,_.width);for(let Ze=0,R=Me.length;Ze<R;Ze++){let H=Me[Ze],ae=Math.floor(H.start/4),be=Math.ceil(H.count/4),Ve=ae%_.width,N=Math.floor(ae/_.width),ye=be,te=1;n.pixelStorei(t.UNPACK_SKIP_PIXELS,Ve),n.pixelStorei(t.UNPACK_SKIP_ROWS,N),n.texSubImage2D(t.TEXTURE_2D,0,Ve,N,ye,te,G,q,_.data)}I.clearUpdateRanges(),n.pixelStorei(t.UNPACK_ROW_LENGTH,ie),n.pixelStorei(t.UNPACK_SKIP_PIXELS,oe),n.pixelStorei(t.UNPACK_SKIP_ROWS,Pe)}}function Ee(I,_,G){let q=t.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&(q=t.TEXTURE_2D_ARRAY),_.isData3DTexture&&(q=t.TEXTURE_3D);let ee=rt(I,_),Me=_.source;n.bindTexture(q,I.__webglTexture,t.TEXTURE0+G);let Ne=i.get(Me);if(Me.version!==Ne.__version||ee===!0){if(n.activeTexture(t.TEXTURE0+G),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){let te=Mt.getPrimaries(Mt.workingColorSpace),Se=_.colorSpace===gs?null:Mt.getPrimaries(_.colorSpace),ce=_.colorSpace===gs||te===Se?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ce)}n.pixelStorei(t.UNPACK_ALIGNMENT,_.unpackAlignment);let oe=p(_.image,!1,r.maxTextureSize);oe=Tn(_,oe);let Pe=s.convert(_.format,_.colorSpace),Ze=s.convert(_.type),R=v(_.internalFormat,Pe,Ze,_.normalized,_.colorSpace,_.isVideoTexture);$e(q,_);let H,ae=_.mipmaps,be=_.isVideoTexture!==!0,Ve=Ne.__version===void 0||ee===!0,N=Me.dataReady,ye=w(_,oe);if(_.isDepthTexture)R=S(_.format===eo,_.type),Ve&&(be?n.texStorage2D(t.TEXTURE_2D,1,R,oe.width,oe.height):n.texImage2D(t.TEXTURE_2D,0,R,oe.width,oe.height,0,Pe,Ze,null));else if(_.isDataTexture)if(ae.length>0){be&&Ve&&n.texStorage2D(t.TEXTURE_2D,ye,R,ae[0].width,ae[0].height);for(let te=0,Se=ae.length;te<Se;te++)H=ae[te],be?N&&n.texSubImage2D(t.TEXTURE_2D,te,0,0,H.width,H.height,Pe,Ze,H.data):n.texImage2D(t.TEXTURE_2D,te,R,H.width,H.height,0,Pe,Ze,H.data);_.generateMipmaps=!1}else be?(Ve&&n.texStorage2D(t.TEXTURE_2D,ye,R,oe.width,oe.height),N&&ne(_,oe,Pe,Ze)):n.texImage2D(t.TEXTURE_2D,0,R,oe.width,oe.height,0,Pe,Ze,oe.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){be&&Ve&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ye,R,ae[0].width,ae[0].height,oe.depth);for(let te=0,Se=ae.length;te<Se;te++)if(H=ae[te],_.format!==Xn)if(Pe!==null)if(be){if(N)if(_.layerUpdates.size>0){let ce=E0(H.width,H.height,_.format,_.type);for(let re of _.layerUpdates){let Ie=H.data.subarray(re*ce/H.data.BYTES_PER_ELEMENT,(re+1)*ce/H.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,te,0,0,re,H.width,H.height,1,Pe,Ie)}}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,te,0,0,0,H.width,H.height,oe.depth,Pe,H.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,te,R,H.width,H.height,oe.depth,0,H.data,0,0);else ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else be?N&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,te,0,0,0,H.width,H.height,oe.depth,Pe,Ze,H.data):n.texImage3D(t.TEXTURE_2D_ARRAY,te,R,H.width,H.height,oe.depth,0,Pe,Ze,H.data);_.layerUpdates.size>0&&_.clearLayerUpdates()}else{be&&Ve&&n.texStorage2D(t.TEXTURE_2D,ye,R,ae[0].width,ae[0].height);for(let te=0,Se=ae.length;te<Se;te++)H=ae[te],_.format!==Xn?Pe!==null?be?N&&n.compressedTexSubImage2D(t.TEXTURE_2D,te,0,0,H.width,H.height,Pe,H.data):n.compressedTexImage2D(t.TEXTURE_2D,te,R,H.width,H.height,0,H.data):ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):be?N&&n.texSubImage2D(t.TEXTURE_2D,te,0,0,H.width,H.height,Pe,Ze,H.data):n.texImage2D(t.TEXTURE_2D,te,R,H.width,H.height,0,Pe,Ze,H.data)}else if(_.isDataArrayTexture)if(be){if(Ve&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ye,R,oe.width,oe.height,oe.depth),N)if(_.layerUpdates.size>0){let te=E0(oe.width,oe.height,_.format,_.type);for(let Se of _.layerUpdates){let ce=oe.data.subarray(Se*te/oe.data.BYTES_PER_ELEMENT,(Se+1)*te/oe.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,Se,oe.width,oe.height,1,Pe,Ze,ce)}_.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,oe.width,oe.height,oe.depth,Pe,Ze,oe.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,R,oe.width,oe.height,oe.depth,0,Pe,Ze,oe.data);else if(_.isData3DTexture)be?(Ve&&n.texStorage3D(t.TEXTURE_3D,ye,R,oe.width,oe.height,oe.depth),N&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,oe.width,oe.height,oe.depth,Pe,Ze,oe.data)):n.texImage3D(t.TEXTURE_3D,0,R,oe.width,oe.height,oe.depth,0,Pe,Ze,oe.data);else if(_.isFramebufferTexture){if(Ve)if(be)n.texStorage2D(t.TEXTURE_2D,ye,R,oe.width,oe.height);else{let te=oe.width,Se=oe.height;for(let ce=0;ce<ye;ce++)n.texImage2D(t.TEXTURE_2D,ce,R,te,Se,0,Pe,Ze,null),te>>=1,Se>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in t){let te=t.canvas;if(te.hasAttribute("layoutsubtree")||te.setAttribute("layoutsubtree","true"),oe.parentNode!==te){te.appendChild(oe),h.add(_),te.onpaint=Se=>{let ce=Se.changedElements;for(let re of h)ce.includes(re.image)&&(re.needsUpdate=!0)},te.requestPaint();return}if(t.texElementImage2D.length===3)t.texElementImage2D(t.TEXTURE_2D,t.RGBA8,oe);else{let ce=t.RGBA,re=t.RGBA,Ie=t.UNSIGNED_BYTE;t.texElementImage2D(t.TEXTURE_2D,0,ce,re,Ie,oe)}t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}}else if(ae.length>0){if(be&&Ve){let te=bt(ae[0]);n.texStorage2D(t.TEXTURE_2D,ye,R,te.width,te.height)}for(let te=0,Se=ae.length;te<Se;te++)H=ae[te],be?N&&n.texSubImage2D(t.TEXTURE_2D,te,0,0,Pe,Ze,H):n.texImage2D(t.TEXTURE_2D,te,R,Pe,Ze,H);_.generateMipmaps=!1}else if(be){if(Ve){let te=bt(oe);n.texStorage2D(t.TEXTURE_2D,ye,R,te.width,te.height)}N&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,Pe,Ze,oe)}else n.texImage2D(t.TEXTURE_2D,0,R,Pe,Ze,oe);m(_)&&b(q),Ne.__version=Me.version,_.onUpdate&&_.onUpdate(_)}I.__version=_.version}function et(I,_,G){if(_.image.length!==6)return;let q=rt(I,_),ee=_.source;n.bindTexture(t.TEXTURE_CUBE_MAP,I.__webglTexture,t.TEXTURE0+G);let Me=i.get(ee);if(ee.version!==Me.__version||q===!0){n.activeTexture(t.TEXTURE0+G);let Ne=Mt.getPrimaries(Mt.workingColorSpace),ie=_.colorSpace===gs?null:Mt.getPrimaries(_.colorSpace),oe=_.colorSpace===gs||Ne===ie?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,_.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),n.pixelStorei(t.UNPACK_ALIGNMENT,_.unpackAlignment),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,oe);let Pe=_.isCompressedTexture||_.image[0].isCompressedTexture,Ze=_.image[0]&&_.image[0].isDataTexture,R=[];for(let re=0;re<6;re++)!Pe&&!Ze?R[re]=p(_.image[re],!0,r.maxCubemapSize):R[re]=Ze?_.image[re].image:_.image[re],R[re]=Tn(_,R[re]);let H=R[0],ae=s.convert(_.format,_.colorSpace),be=s.convert(_.type),Ve=v(_.internalFormat,ae,be,_.normalized,_.colorSpace),N=_.isVideoTexture!==!0,ye=Me.__version===void 0||q===!0,te=ee.dataReady,Se=w(_,H);$e(t.TEXTURE_CUBE_MAP,_);let ce;if(Pe){N&&ye&&n.texStorage2D(t.TEXTURE_CUBE_MAP,Se,Ve,H.width,H.height);for(let re=0;re<6;re++){ce=R[re].mipmaps;for(let Ie=0;Ie<ce.length;Ie++){let ze=ce[Ie];_.format!==Xn?ae!==null?N?te&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie,0,0,ze.width,ze.height,ae,ze.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie,Ve,ze.width,ze.height,0,ze.data):ut("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?te&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie,0,0,ze.width,ze.height,ae,be,ze.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie,Ve,ze.width,ze.height,0,ae,be,ze.data)}}}else{if(ce=_.mipmaps,N&&ye){ce.length>0&&Se++;let re=bt(R[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,Se,Ve,re.width,re.height)}for(let re=0;re<6;re++)if(Ze){N?te&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,R[re].width,R[re].height,ae,be,R[re].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,Ve,R[re].width,R[re].height,0,ae,be,R[re].data);for(let Ie=0;Ie<ce.length;Ie++){let Qt=ce[Ie].image[re].image;N?te&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie+1,0,0,Qt.width,Qt.height,ae,be,Qt.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie+1,Ve,Qt.width,Qt.height,0,ae,be,Qt.data)}}else{N?te&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,ae,be,R[re]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,Ve,ae,be,R[re]);for(let Ie=0;Ie<ce.length;Ie++){let ze=ce[Ie];N?te&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie+1,0,0,ae,be,ze.image[re]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,Ie+1,Ve,ae,be,ze.image[re])}}}m(_)&&b(t.TEXTURE_CUBE_MAP),Me.__version=ee.version,_.onUpdate&&_.onUpdate(_)}I.__version=_.version}function Ae(I,_,G,q,ee,Me){let Ne=s.convert(G.format,G.colorSpace),ie=s.convert(G.type),oe=v(G.internalFormat,Ne,ie,G.normalized,G.colorSpace),Pe=i.get(_),Ze=i.get(G);if(Ze.__renderTarget=_,!Pe.__hasExternalTextures){let R=Math.max(1,_.width>>Me),H=Math.max(1,_.height>>Me);ee===t.TEXTURE_3D||ee===t.TEXTURE_2D_ARRAY?n.texImage3D(ee,Me,oe,R,H,_.depth,0,Ne,ie,null):n.texImage2D(ee,Me,oe,R,H,0,Ne,ie,null)}n.bindFramebuffer(t.FRAMEBUFFER,I),Zt(_)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,q,ee,Ze.__webglTexture,0,jt(_)):(ee===t.TEXTURE_2D||ee>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&ee<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,q,ee,Ze.__webglTexture,Me),n.bindFramebuffer(t.FRAMEBUFFER,null)}function le(I,_,G){if(t.bindRenderbuffer(t.RENDERBUFFER,I),_.depthBuffer){let q=_.depthTexture,ee=q&&q.isDepthTexture?q.type:null,Me=S(_.stencilBuffer,ee),Ne=_.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;Zt(_)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,jt(_),Me,_.width,_.height):G?t.renderbufferStorageMultisample(t.RENDERBUFFER,jt(_),Me,_.width,_.height):t.renderbufferStorage(t.RENDERBUFFER,Me,_.width,_.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,Ne,t.RENDERBUFFER,I)}else{let q=_.textures;for(let ee=0;ee<q.length;ee++){let Me=q[ee],Ne=s.convert(Me.format,Me.colorSpace),ie=s.convert(Me.type),oe=v(Me.internalFormat,Ne,ie,Me.normalized,Me.colorSpace);Zt(_)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,jt(_),oe,_.width,_.height):G?t.renderbufferStorageMultisample(t.RENDERBUFFER,jt(_),oe,_.width,_.height):t.renderbufferStorage(t.RENDERBUFFER,oe,_.width,_.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function ge(I,_,G){let q=_.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(t.FRAMEBUFFER,I),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let ee=i.get(_.depthTexture);if(ee.__renderTarget=_,(!ee.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),q){if(ee.__webglInit===void 0&&(ee.__webglInit=!0,_.depthTexture.addEventListener("dispose",T)),ee.__webglTexture===void 0){ee.__webglTexture=t.createTexture(),n.bindTexture(t.TEXTURE_CUBE_MAP,ee.__webglTexture),$e(t.TEXTURE_CUBE_MAP,_.depthTexture);let Pe=s.convert(_.depthTexture.format),Ze=s.convert(_.depthTexture.type),R;_.depthTexture.format===Dr?R=t.DEPTH_COMPONENT24:_.depthTexture.format===eo&&(R=t.DEPTH24_STENCIL8);for(let H=0;H<6;H++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+H,0,R,_.width,_.height,0,Pe,Ze,null)}}else Z(_.depthTexture,0);let Me=ee.__webglTexture,Ne=jt(_),ie=q?t.TEXTURE_CUBE_MAP_POSITIVE_X+G:t.TEXTURE_2D,oe=_.depthTexture.format===eo?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(_.depthTexture.format===Dr)Zt(_)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,oe,ie,Me,0,Ne):t.framebufferTexture2D(t.FRAMEBUFFER,oe,ie,Me,0);else if(_.depthTexture.format===eo)Zt(_)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,oe,ie,Me,0,Ne):t.framebufferTexture2D(t.FRAMEBUFFER,oe,ie,Me,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function De(I){let _=i.get(I),G=I.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==I.depthTexture){let q=I.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),q){let ee=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,q.removeEventListener("dispose",ee)};q.addEventListener("dispose",ee),_.__depthDisposeCallback=ee}_.__boundDepthTexture=q}if(I.depthTexture&&!_.__autoAllocateDepthBuffer)if(G)for(let q=0;q<6;q++)ge(_.__webglFramebuffer[q],I,q);else{let q=I.texture.mipmaps;q&&q.length>0?ge(_.__webglFramebuffer[0],I,0):ge(_.__webglFramebuffer,I,0)}else if(G){_.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(n.bindFramebuffer(t.FRAMEBUFFER,_.__webglFramebuffer[q]),_.__webglDepthbuffer[q]===void 0)_.__webglDepthbuffer[q]=t.createRenderbuffer(),le(_.__webglDepthbuffer[q],I,!1);else{let ee=I.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Me=_.__webglDepthbuffer[q];t.bindRenderbuffer(t.RENDERBUFFER,Me),t.framebufferRenderbuffer(t.FRAMEBUFFER,ee,t.RENDERBUFFER,Me)}}else{let q=I.texture.mipmaps;if(q&&q.length>0?n.bindFramebuffer(t.FRAMEBUFFER,_.__webglFramebuffer[0]):n.bindFramebuffer(t.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=t.createRenderbuffer(),le(_.__webglDepthbuffer,I,!1);else{let ee=I.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Me=_.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,Me),t.framebufferRenderbuffer(t.FRAMEBUFFER,ee,t.RENDERBUFFER,Me)}}n.bindFramebuffer(t.FRAMEBUFFER,null)}function Ye(I,_,G){let q=i.get(I);_!==void 0&&Ae(q.__webglFramebuffer,I,I.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),G!==void 0&&De(I)}function vt(I){let _=I.texture,G=i.get(I),q=i.get(_);I.addEventListener("dispose",y);let ee=I.textures,Me=I.isWebGLCubeRenderTarget===!0,Ne=ee.length>1;if(Ne||(q.__webglTexture===void 0&&(q.__webglTexture=t.createTexture()),q.__version=_.version,o.memory.textures++),Me){G.__webglFramebuffer=[];for(let ie=0;ie<6;ie++)if(_.mipmaps&&_.mipmaps.length>0){G.__webglFramebuffer[ie]=[];for(let oe=0;oe<_.mipmaps.length;oe++)G.__webglFramebuffer[ie][oe]=t.createFramebuffer()}else G.__webglFramebuffer[ie]=t.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){G.__webglFramebuffer=[];for(let ie=0;ie<_.mipmaps.length;ie++)G.__webglFramebuffer[ie]=t.createFramebuffer()}else G.__webglFramebuffer=t.createFramebuffer();if(Ne)for(let ie=0,oe=ee.length;ie<oe;ie++){let Pe=i.get(ee[ie]);Pe.__webglTexture===void 0&&(Pe.__webglTexture=t.createTexture(),o.memory.textures++)}if(I.samples>0&&Zt(I)===!1){G.__webglMultisampledFramebuffer=t.createFramebuffer(),G.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let ie=0;ie<ee.length;ie++){let oe=ee[ie];G.__webglColorRenderbuffer[ie]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,G.__webglColorRenderbuffer[ie]);let Pe=s.convert(oe.format,oe.colorSpace),Ze=s.convert(oe.type),R=v(oe.internalFormat,Pe,Ze,oe.normalized,oe.colorSpace,I.isXRRenderTarget===!0),H=jt(I);t.renderbufferStorageMultisample(t.RENDERBUFFER,H,R,I.width,I.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ie,t.RENDERBUFFER,G.__webglColorRenderbuffer[ie])}t.bindRenderbuffer(t.RENDERBUFFER,null),I.depthBuffer&&(G.__webglDepthRenderbuffer=t.createRenderbuffer(),le(G.__webglDepthRenderbuffer,I,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(Me){n.bindTexture(t.TEXTURE_CUBE_MAP,q.__webglTexture),$e(t.TEXTURE_CUBE_MAP,_);for(let ie=0;ie<6;ie++)if(_.mipmaps&&_.mipmaps.length>0)for(let oe=0;oe<_.mipmaps.length;oe++)Ae(G.__webglFramebuffer[ie][oe],I,_,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,oe);else Ae(G.__webglFramebuffer[ie],I,_,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0);m(_)&&b(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Ne){for(let ie=0,oe=ee.length;ie<oe;ie++){let Pe=ee[ie],Ze=i.get(Pe),R=t.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(R=I.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(R,Ze.__webglTexture),$e(R,Pe),Ae(G.__webglFramebuffer,I,Pe,t.COLOR_ATTACHMENT0+ie,R,0),m(Pe)&&b(R)}n.unbindTexture()}else{let ie=t.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(ie=I.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(ie,q.__webglTexture),$e(ie,_),_.mipmaps&&_.mipmaps.length>0)for(let oe=0;oe<_.mipmaps.length;oe++)Ae(G.__webglFramebuffer[oe],I,_,t.COLOR_ATTACHMENT0,ie,oe);else Ae(G.__webglFramebuffer,I,_,t.COLOR_ATTACHMENT0,ie,0);m(_)&&b(ie),n.unbindTexture()}I.depthBuffer&&De(I)}function Te(I){let _=I.textures;for(let G=0,q=_.length;G<q;G++){let ee=_[G];if(m(ee)){let Me=E(I),Ne=i.get(ee).__webglTexture;n.bindTexture(Me,Ne),b(Me),n.unbindTexture()}}}let Ce=[],st=[];function Jt(I){if(I.samples>0){if(Zt(I)===!1){let _=I.textures,G=I.width,q=I.height,ee=t.COLOR_BUFFER_BIT,Me=I.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Ne=i.get(I),ie=_.length>1;if(ie)for(let Pe=0;Pe<_.length;Pe++)n.bindFramebuffer(t.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Pe,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,Ne.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Pe,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer);let oe=I.texture.mipmaps;oe&&oe.length>0?n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer[0]):n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ne.__webglFramebuffer);for(let Pe=0;Pe<_.length;Pe++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(ee|=t.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(ee|=t.STENCIL_BUFFER_BIT)),ie){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Ne.__webglColorRenderbuffer[Pe]);let Ze=i.get(_[Pe]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Ze,0)}t.blitFramebuffer(0,0,G,q,0,0,G,q,ee,t.NEAREST),l===!0&&(Ce.length=0,st.length=0,Ce.push(t.COLOR_ATTACHMENT0+Pe),I.depthBuffer&&I.storeMultisampledDepthBuffer===!1&&(Ce.push(Me),st.push(Me),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,st)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Ce))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),ie)for(let Pe=0;Pe<_.length;Pe++){n.bindFramebuffer(t.FRAMEBUFFER,Ne.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Pe,t.RENDERBUFFER,Ne.__webglColorRenderbuffer[Pe]);let Ze=i.get(_[Pe]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,Ne.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Pe,t.TEXTURE_2D,Ze,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ne.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.storeMultisampledDepthBuffer===!1&&l){let _=I.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[_])}}}function jt(I){return Math.min(r.maxSamples,I.samples)}function Zt(I){let _=i.get(I);return I.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function U(I){let _=o.render.frame;u.get(I)!==_&&(u.set(I,_),I.update())}function Tn(I,_){let G=I.colorSpace,q=I.format,ee=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||G!==ko&&G!==gs&&(Mt.getTransfer(G)===$t?(q!==Xn||ee!==ki)&&ut("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):dt("WebGLTextures: Unsupported texture color space:",G)),_}function bt(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(c.width=I.naturalWidth||I.width,c.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(c.width=I.displayWidth,c.height=I.displayHeight):(c.width=I.width,c.height=I.height),c}this.allocateTextureUnit=D,this.resetTextureUnits=z,this.getTextureUnits=L,this.setTextureUnits=V,this.setTexture2D=Z,this.setTexture2DArray=Y,this.setTexture3D=Q,this.setTextureCube=se,this.rebindTextures=Ye,this.setupRenderTarget=vt,this.updateRenderTargetMipmap=Te,this.updateMultisampleRenderTarget=Jt,this.setupDepthRenderbuffer=De,this.setupFrameBufferTexture=Ae,this.useMultisampledRTT=Zt,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function T2(t,e){function n(i,r=gs){let s,o=Mt.getTransfer(r);if(i===ki)return t.UNSIGNED_BYTE;if(i===Od)return t.UNSIGNED_SHORT_4_4_4_4;if(i===Fd)return t.UNSIGNED_SHORT_5_5_5_1;if(i===g0)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===x0)return t.UNSIGNED_INT_10F_11F_11F_REV;if(i===p0)return t.BYTE;if(i===m0)return t.SHORT;if(i===tl)return t.UNSIGNED_SHORT;if(i===Nd)return t.INT;if(i===yr)return t.UNSIGNED_INT;if(i===er)return t.FLOAT;if(i===ri)return t.HALF_FLOAT;if(i===v0)return t.ALPHA;if(i===y0)return t.RGB;if(i===Xn)return t.RGBA;if(i===Dr)return t.DEPTH_COMPONENT;if(i===eo)return t.DEPTH_STENCIL;if(i===Ud)return t.RED;if(i===kd)return t.RED_INTEGER;if(i===to)return t.RG;if(i===Bd)return t.RG_INTEGER;if(i===zd)return t.RGBA_INTEGER;if(i===Nc||i===Oc||i===Fc||i===Uc)if(o===$t)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Nc)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Oc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Fc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Uc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Nc)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Oc)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Fc)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Uc)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Vd||i===Gd||i===Hd||i===Wd)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Vd)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Gd)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Hd)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Wd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===$d||i===Xd||i===Yd||i===qd||i===jd||i===kc||i===Zd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===$d||i===Xd)return o===$t?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Yd)return o===$t?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===qd)return s.COMPRESSED_R11_EAC;if(i===jd)return s.COMPRESSED_SIGNED_R11_EAC;if(i===kc)return s.COMPRESSED_RG11_EAC;if(i===Zd)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Kd||i===Jd||i===Qd||i===ef||i===tf||i===nf||i===rf||i===sf||i===of||i===af||i===lf||i===cf||i===uf||i===hf)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Kd)return o===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Jd)return o===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Qd)return o===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===ef)return o===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===tf)return o===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===nf)return o===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===rf)return o===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===sf)return o===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===of)return o===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===af)return o===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===lf)return o===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===cf)return o===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===uf)return o===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===hf)return o===$t?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===df||i===ff||i===pf)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===df)return o===$t?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===ff)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===pf)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===mf||i===gf||i===Bc||i===xf)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===mf)return s.COMPRESSED_RED_RGTC1_EXT;if(i===gf)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Bc)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===xf)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===nl?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}var R2=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,C2=`
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

}`,$0=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n){if(this.texture===null){let i=new wc(e.texture);(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let n=e.cameras[0].viewport,i=new Pt({vertexShader:R2,fragmentShader:C2,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new zt(new kr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},X0=class extends Nr{constructor(e,n){super();let i=this,r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,f=null,g=null,x=typeof XRWebGLBinding<"u",p=new $0,m={},b=n.getContextAttributes(),E=null,v=null,S=[],w=[],T=new ht,y=null,A=null,P=new ni;P.viewport=new Ot;let F=new ni;F.viewport=new Ot;let O=[P,F],z=new Rd,L=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let ne=S[j];return ne===void 0&&(ne=new ja,S[j]=ne),ne.getTargetRaySpace()},this.getControllerGrip=function(j){let ne=S[j];return ne===void 0&&(ne=new ja,S[j]=ne),ne.getGripSpace()},this.getHand=function(j){let ne=S[j];return ne===void 0&&(ne=new ja,S[j]=ne),ne.getHandSpace()};function D(j){let ne=w.indexOf(j.inputSource);if(ne===-1)return;let Ee=S[ne];Ee!==void 0&&(Ee.update(j.inputSource,j.frame,c||o),Ee.dispatchEvent({type:j.type,data:j.inputSource}))}function k(){r.removeEventListener("select",D),r.removeEventListener("selectstart",D),r.removeEventListener("selectend",D),r.removeEventListener("squeeze",D),r.removeEventListener("squeezestart",D),r.removeEventListener("squeezeend",D),r.removeEventListener("end",k),r.removeEventListener("inputsourceschange",Z);for(let j=0;j<S.length;j++){let ne=w[j];ne!==null&&(w[j]=null,S[j].disconnect(ne))}L=null,V=null,p.reset();for(let j in m)delete m[j];if(e.setRenderTarget(E),f=null,d=null,h=null,r=null,v=null,rt.stop(),i.isPresenting=!1,e.setPixelRatio(y),e.setSize(T.width,T.height,!1),A!==null){let j=A.camera;j.fov=A.fov,j.zoom=A.zoom,j.updateProjectionMatrix(),A=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){s=j,i.isPresenting===!0&&ut("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){a=j,i.isPresenting===!0&&ut("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return h===null&&x&&(h=new XRWebGLBinding(r,n)),h},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(j){if(r=j,r!==null){if(E=e.getRenderTarget(),r.addEventListener("select",D),r.addEventListener("selectstart",D),r.addEventListener("selectend",D),r.addEventListener("squeeze",D),r.addEventListener("squeezestart",D),r.addEventListener("squeezeend",D),r.addEventListener("end",k),r.addEventListener("inputsourceschange",Z),b.xrCompatible!==!0&&await n.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(T),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let Ee=null,et=null,Ae=null;b.depth&&(Ae=b.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Ee=b.stencil?eo:Dr,et=b.stencil?nl:yr);let le={colorFormat:n.RGBA8,depthFormat:Ae,scaleFactor:s};h=this.getBinding(),d=h.createProjectionLayer(le),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),v=new Ln(d.textureWidth,d.textureHeight,{format:Xn,type:ki,depthTexture:new qs(d.textureWidth,d.textureHeight,et,void 0,void 0,void 0,void 0,void 0,void 0,Ee),stencilBuffer:b.stencil,colorSpace:e.outputColorSpace,samples:b.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let Ee={antialias:b.antialias,alpha:!0,depth:b.depth,stencil:b.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(r,n,Ee),r.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),v=new Ln(f.framebufferWidth,f.framebufferHeight,{format:Xn,type:ki,colorSpace:e.outputColorSpace,stencilBuffer:b.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),rt.setContext(r),rt.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function Z(j){for(let ne=0;ne<j.removed.length;ne++){let Ee=j.removed[ne],et=w.indexOf(Ee);et>=0&&(w[et]=null,S[et].disconnect(Ee))}for(let ne=0;ne<j.added.length;ne++){let Ee=j.added[ne],et=w.indexOf(Ee);if(et===-1){for(let le=0;le<S.length;le++)if(le>=w.length){w.push(Ee),et=le;break}else if(w[le]===null){w[le]=Ee,et=le;break}if(et===-1)break}let Ae=S[et];Ae&&Ae.connect(Ee)}}let Y=new C,Q=new C;function se(j,ne,Ee){Y.setFromMatrixPosition(ne.matrixWorld),Q.setFromMatrixPosition(Ee.matrixWorld);let et=Y.distanceTo(Q),Ae=ne.projectionMatrix.elements,le=Ee.projectionMatrix.elements,ge=Ae[14]/(Ae[10]-1),De=Ae[14]/(Ae[10]+1),Ye=(Ae[9]+1)/Ae[5],vt=(Ae[9]-1)/Ae[5],Te=(Ae[8]-1)/Ae[0],Ce=(le[8]+1)/le[0],st=ge*Te,Jt=ge*Ce,jt=et/(-Te+Ce),Zt=jt*-Te;if(ne.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(Zt),j.translateZ(jt),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Ae[10]===-1)j.projectionMatrix.copy(ne.projectionMatrix),j.projectionMatrixInverse.copy(ne.projectionMatrixInverse);else{let U=ge+jt,Tn=De+jt,bt=st-Zt,I=Jt+(et-Zt),_=Ye*De/Tn*U,G=vt*De/Tn*U;j.projectionMatrix.makePerspective(bt,I,_,G,U,Tn),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function Le(j,ne){ne===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(ne.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(r===null)return;let ne=j.near,Ee=j.far;p.texture!==null&&(p.depthNear>0&&(ne=p.depthNear),p.depthFar>0&&(Ee=p.depthFar)),z.near=F.near=P.near=ne,z.far=F.far=P.far=Ee,(L!==z.near||V!==z.far)&&(r.updateRenderState({depthNear:z.near,depthFar:z.far}),L=z.near,V=z.far),z.layers.mask=j.layers.mask|6,P.layers.mask=z.layers.mask&-5,F.layers.mask=z.layers.mask&-3;let et=j.parent,Ae=z.cameras;Le(z,et);for(let le=0;le<Ae.length;le++)Le(Ae[le],et);Ae.length===2?se(z,P,F):z.projectionMatrix.copy(P.projectionMatrix),A===null&&j.isPerspectiveCamera&&(A={camera:j,fov:j.fov,zoom:j.zoom}),Oe(j,z,et)};function Oe(j,ne,Ee){Ee===null?j.matrix.copy(ne.matrixWorld):(j.matrix.copy(Ee.matrixWorld),j.matrix.invert(),j.matrix.multiply(ne.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(ne.projectionMatrix),j.projectionMatrixInverse.copy(ne.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=id*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(j){l=j,d!==null&&(d.fixedFoveation=j),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=j)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(z)},this.getCameraTexture=function(j){return m[j]};let mt=null;function $e(j,ne){if(u=ne.getViewerPose(c||o),g=ne,u!==null){let Ee=u.views;f!==null&&(e.setRenderTargetFramebuffer(v,f.framebuffer),e.setRenderTarget(v));let et=!1;Ee.length!==z.cameras.length&&(z.cameras.length=0,et=!0);for(let De=0;De<Ee.length;De++){let Ye=Ee[De],vt=null;if(f!==null)vt=f.getViewport(Ye);else{let Ce=h.getViewSubImage(d,Ye);vt=Ce.viewport,De===0&&(e.setRenderTargetTextures(v,Ce.colorTexture,Ce.depthStencilTexture),e.setRenderTarget(v))}let Te=O[De];Te===void 0&&(Te=new ni,Te.layers.enable(De),Te.viewport=new Ot,O[De]=Te),Te.matrix.fromArray(Ye.transform.matrix),Te.matrix.decompose(Te.position,Te.quaternion,Te.scale),Te.projectionMatrix.fromArray(Ye.projectionMatrix),Te.projectionMatrixInverse.copy(Te.projectionMatrix).invert(),Te.viewport.set(vt.x,vt.y,vt.width,vt.height),De===0&&(z.matrix.copy(Te.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),et===!0&&z.cameras.push(Te)}let Ae=r.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&x){h=i.getBinding();let De=h.getDepthInformation(Ee[0]);De&&De.isValid&&De.texture&&p.init(De,r.renderState)}if(Ae&&Ae.includes("camera-access")&&x){e.state.unbindTexture(),h=i.getBinding();for(let De=0;De<Ee.length;De++){let Ye=Ee[De].camera;if(Ye){let vt=m[Ye];vt||(vt=new wc,m[Ye]=vt);let Te=h.getCameraImage(Ye);vt.sourceTexture=Te}}}}for(let Ee=0;Ee<S.length;Ee++){let et=w[Ee],Ae=S[Ee];et!==null&&Ae!==void 0&&Ae.update(et,ne,c||o)}mt&&mt(j,ne),ne.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ne}),g=null}let rt=new C_;rt.setAnimationLoop($e),this.setAnimationLoop=function(j){mt=j},this.dispose=function(){}}},P2=new Ct,O_=new gt;O_.set(-1,0,0,0,1,0,0,0,1);function I2(t,e){function n(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function i(p,m){m.color.getRGB(p.fogColor.value,S0(t)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function r(p,m,b,E,v){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?s(p,m):m.isMeshLambertMaterial?(s(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(s(p,m),h(p,m)):m.isMeshPhongMaterial?(s(p,m),u(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(s(p,m),d(p,m),m.isMeshPhysicalMaterial&&f(p,m,v)):m.isMeshMatcapMaterial?(s(p,m),g(p,m)):m.isMeshDepthMaterial?s(p,m):m.isMeshDistanceMaterial?(s(p,m),x(p,m)):m.isMeshNormalMaterial?s(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?l(p,m,b,E):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function s(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,n(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,n(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,n(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===xi&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,n(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===xi&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,n(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,n(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,n(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);let b=e.get(m),E=b.envMap,v=b.envMapRotation;E&&(p.envMap.value=E,p.envMapRotation.value.setFromMatrix4(P2.makeRotationFromEuler(v)).transpose(),E.isCubeTexture&&E.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(O_),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,n(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,n(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,n(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,b,E){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*b,p.scale.value=E*.5,m.map&&(p.map.value=m.map,n(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,n(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,n(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,n(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function u(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function h(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function d(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,n(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,n(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,b){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,n(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,n(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,n(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,n(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,n(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===xi&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.retroreflectivity>0&&(p.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,n(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,n(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=b.texture,p.transmissionSamplerSize.value.set(b.width,b.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,n(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,n(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,n(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,n(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,n(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function x(p,m){let b=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(b.matrixWorld),p.nearDistance.value=b.shadow.camera.near,p.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function L2(t,e,n,i){let r={},s={},o=[],a=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,S){let w=S.program;i.uniformBlockBinding(v,w)}function c(v,S){let w=r[v.id];w===void 0&&(p(v),w=u(v),r[v.id]=w,v.addEventListener("dispose",b));let T=S.program;i.updateUBOMapping(v,T);let y=e.render.frame;s[v.id]!==y&&(d(v),s[v.id]=y)}function u(v){let S=h();v.__bindingPointIndex=S;let w=t.createBuffer(),T=v.__size,y=v.usage;return t.bindBuffer(t.UNIFORM_BUFFER,w),t.bufferData(t.UNIFORM_BUFFER,T,y),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,S,w),w}function h(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return dt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(v){let S=r[v.id],w=v.uniforms,T=v.__cache;t.bindBuffer(t.UNIFORM_BUFFER,S);for(let y=0,A=w.length;y<A;y++){let P=w[y];if(Array.isArray(P))for(let F=0,O=P.length;F<O;F++)f(P[F],y,F,T);else f(P,y,0,T)}t.bindBuffer(t.UNIFORM_BUFFER,null)}function f(v,S,w,T){if(x(v,S,w,T)===!0){let y=v.__offset,A=v.value;if(Array.isArray(A)){let P=0;for(let F=0;F<A.length;F++){let O=A[F],z=m(O);g(O,v.__data,P),typeof O!="number"&&typeof O!="boolean"&&!O.isMatrix3&&!ArrayBuffer.isView(O)&&(P+=z.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(A,v.__data,0);t.bufferSubData(t.UNIFORM_BUFFER,y,v.__data)}}function g(v,S,w){typeof v=="number"||typeof v=="boolean"?S[0]=v:v.isMatrix3?(S[0]=v.elements[0],S[1]=v.elements[1],S[2]=v.elements[2],S[3]=0,S[4]=v.elements[3],S[5]=v.elements[4],S[6]=v.elements[5],S[7]=0,S[8]=v.elements[6],S[9]=v.elements[7],S[10]=v.elements[8],S[11]=0):ArrayBuffer.isView(v)?S.set(new v.constructor(v.buffer,v.byteOffset,S.length)):v.toArray(S,w)}function x(v,S,w,T){let y=v.value,A=S+"_"+w;if(T[A]===void 0)return typeof y=="number"||typeof y=="boolean"?T[A]=y:ArrayBuffer.isView(y)?T[A]=y.slice():T[A]=y.clone(),!0;{let P=T[A];if(typeof y=="number"||typeof y=="boolean"){if(P!==y)return T[A]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(P.equals(y)===!1)return P.copy(y),!0}}return!1}function p(v){let S=v.uniforms,w=0,T=16;for(let A=0,P=S.length;A<P;A++){let F=Array.isArray(S[A])?S[A]:[S[A]];for(let O=0,z=F.length;O<z;O++){let L=F[O],V=Array.isArray(L.value)?L.value:[L.value];for(let D=0,k=V.length;D<k;D++){let Z=V[D],Y=m(Z),Q=w%T,se=Q%Y.boundary,Le=Q+se;w+=se,Le!==0&&T-Le<Y.storage&&(w+=T-Le),L.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=w,w+=Y.storage}}}let y=w%T;return y>0&&(w+=T-y),v.__size=w,v.__cache={},this}function m(v){let S={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(S.boundary=4,S.storage=4):v.isVector2?(S.boundary=8,S.storage=8):v.isVector3||v.isColor?(S.boundary=16,S.storage=12):v.isVector4?(S.boundary=16,S.storage=16):v.isMatrix3?(S.boundary=48,S.storage=48):v.isMatrix4?(S.boundary=64,S.storage=64):v.isTexture?ut("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(S.boundary=16,S.storage=v.byteLength):ut("WebGLRenderer: Unsupported uniform value type.",v),S}function b(v){let S=v.target;S.removeEventListener("dispose",b);let w=o.indexOf(S.__bindingPointIndex);o.splice(w,1),t.deleteBuffer(r[S.id]),delete r[S.id],delete s[S.id]}function E(){for(let v in r)t.deleteBuffer(r[v]);o=[],r={},s={}}return{bind:l,update:c,dispose:E}}var D2=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Vr=null;function N2(){return Vr===null&&(Vr=new vc(D2,16,16,to,ri),Vr.name="DFG_LUT",Vr.minFilter=Et,Vr.magFilter=Et,Vr.wrapS=ii,Vr.wrapT=ii,Vr.generateMipmaps=!1,Vr.needsUpdate=!0),Vr}var wf=class{constructor(e={}){let{canvas:n=e_(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:d=!1,outputBufferType:f=ki}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=o;let x=f,p=new Set([zd,Bd,kd]),m=new Set([ki,yr,tl,nl,Od,Fd]),b=new Uint32Array(4),E=new Int32Array(4),v=new C,S=null,w=null,T=[],y=[],A=null;this.domElement=n,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ui,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let P=this,F=!1,O=null,z=null,L=null,V=null;this._outputColorSpace=Oi;let D=0,k=0,Z=null,Y=-1,Q=null,se=new Ot,Le=new Ot,Oe=null,mt=new wt(0),$e=0,rt=n.width,j=n.height,ne=1,Ee=null,et=null,Ae=new Ot(0,0,rt,j),le=new Ot(0,0,rt,j),ge=!1,De=new _c,Ye=!1,vt=!1,Te=new Ct,Ce=new C,st=new Ot,Jt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},jt=!1;function Zt(){return Z===null?ne:1}let U=i;function Tn(M,B){return n.getContext(M,B)}let bt,I,_,G,q,ee,Me,Ne,ie,oe,Pe,Ze,R,H,ae,be,Ve,N,ye,te,Se,ce,re;try{let M={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${"186"}`),n.addEventListener("webglcontextlost",Qt,!1),n.addEventListener("webglcontextrestored",It,!1),n.addEventListener("webglcontextcreationerror",Kn,!1),U===null){let B="webgl2";if(U=Tn(B,M),U===null)throw Tn(B)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ie()}catch(M){throw n.removeEventListener("webglcontextlost",Qt,!1),n.removeEventListener("webglcontextrestored",It,!1),n.removeEventListener("webglcontextcreationerror",Kn,!1),dt("WebGLRenderer: "+M.message),M}function Ie(){bt=new VR(U),bt.init(),Se=new T2(U,bt),I=new IR(U,bt,e,Se),_=new A2(U,bt),I.reversedDepthBuffer&&d&&_.buffers.depth.setReversed(!0),z=U.createFramebuffer(),L=U.createFramebuffer(),V=U.createFramebuffer(),G=new WR(U),q=new h2,ee=new E2(U,bt,_,q,I,Se,G),Me=new zR(P),Ne=new XA(U),ce=new CR(U,Ne),ie=new GR(U,Ne,G,ce),oe=new XR(U,ie,Ne,ce,G),N=new $R(U,I,ee),ae=new LR(q),Pe=new u2(P,Me,bt,I,ce,ae),Ze=new I2(P,q),R=new f2,H=new y2(bt),Ve=new RR(P,Me,_,oe,g,l),be=new w2(P,oe,I),re=new L2(U,G,I,_),ye=new PR(U,bt,G),te=new HR(U,bt,G),G.programs=Pe.programs,P.capabilities=I,P.extensions=bt,P.properties=q,P.renderLists=R,P.shadowMap=be,P.state=_,P.info=G}x!==ki&&(A=new qR(x,n.width,n.height,a,r,s));let ze=new X0(P,U);this.xr=ze,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let M=bt.get("WEBGL_lose_context");M&&M.loseContext()},this.forceContextRestore=function(){let M=bt.get("WEBGL_lose_context");M&&M.restoreContext()},this.getPixelRatio=function(){return ne},this.setPixelRatio=function(M){M!==void 0&&(ne=M,this.setSize(rt,j,!1))},this.getSize=function(M){return M.set(rt,j)},this.setSize=function(M,B,K=!0){if(ze.isPresenting){ut("WebGLRenderer: Can't change size while VR device is presenting.");return}rt=M,j=B,n.width=Math.floor(M*ne),n.height=Math.floor(B*ne),K===!0&&(n.style.width=M+"px",n.style.height=B+"px"),A!==null&&A.setSize(n.width,n.height),this.setViewport(0,0,M,B)},this.getDrawingBufferSize=function(M){return M.set(rt*ne,j*ne).floor()},this.setDrawingBufferSize=function(M,B,K){rt=M,j=B,ne=K,n.width=Math.floor(M*K),n.height=Math.floor(B*K),this.setViewport(0,0,M,B)},this.setEffects=function(M){if(x===ki){dt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(M){for(let B=0;B<M.length;B++)if(M[B].isOutputPass===!0){ut("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(M||[])},this.getCurrentViewport=function(M){return M.copy(se)},this.getViewport=function(M){return M.copy(Ae)},this.setViewport=function(M,B,K,$){M.isVector4?Ae.set(M.x,M.y,M.z,M.w):Ae.set(M,B,K,$),_.viewport(se.copy(Ae).multiplyScalar(ne).round())},this.getScissor=function(M){return M.copy(le)},this.setScissor=function(M,B,K,$){M.isVector4?le.set(M.x,M.y,M.z,M.w):le.set(M,B,K,$),_.scissor(Le.copy(le).multiplyScalar(ne).round())},this.getScissorTest=function(){return ge},this.setScissorTest=function(M){_.setScissorTest(ge=M)},this.setOpaqueSort=function(M){Ee=M},this.setTransparentSort=function(M){et=M},this.getClearColor=function(M){return M.copy(Ve.getClearColor())},this.setClearColor=function(){Ve.setClearColor(...arguments)},this.getClearAlpha=function(){return Ve.getClearAlpha()},this.setClearAlpha=function(){Ve.setClearAlpha(...arguments)},this.clear=function(M=!0,B=!0,K=!0){let $=0;if(M){let X=!1;if(Z!==null){let Be=Z.texture.format;X=p.has(Be)}if(X){let Be=Z.texture.type,He=m.has(Be),ke=Ve.getClearColor(),qe=Ve.getClearAlpha(),Je=ke.r,yt=ke.g,St=ke.b;He?(b[0]=Je,b[1]=yt,b[2]=St,b[3]=qe,U.clearBufferuiv(U.COLOR,0,b)):(E[0]=Je,E[1]=yt,E[2]=St,E[3]=qe,U.clearBufferiv(U.COLOR,0,E))}else $|=U.COLOR_BUFFER_BIT}B&&($|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),K&&($|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),$!==0&&U.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(M){M.setRenderer(this),O=M},this.dispose=function(){n.removeEventListener("webglcontextlost",Qt,!1),n.removeEventListener("webglcontextrestored",It,!1),n.removeEventListener("webglcontextcreationerror",Kn,!1),Ve.dispose(),R.dispose(),H.dispose(),q.dispose(),Me.dispose(),oe.dispose(),ce.dispose(),re.dispose(),Pe.dispose(),ze.dispose(),ze.removeEventListener("sessionstart",ev),ze.removeEventListener("sessionend",tv),wo.stop()};function Qt(M){M.preventDefault(),fc("WebGLRenderer: Context Lost."),F=!0}function It(){fc("WebGLRenderer: Context Restored."),F=!1;let M=G.autoReset,B=be.enabled,K=be.autoUpdate,$=be.needsUpdate,X=be.type;Ie(),G.autoReset=M,be.enabled=B,be.autoUpdate=K,be.needsUpdate=$,be.type=X}function Kn(M){dt("WebGLRenderer: A WebGL context could not be created. Reason: ",M.statusMessage)}function ji(M){let B=M.target;B.removeEventListener("dispose",ji),nh(B)}function nh(M){nm(M),q.remove(M)}function nm(M){let B=q.get(M).programs;B!==void 0&&(B.forEach(function(K){Pe.releaseProgram(K)}),M.isShaderMaterial&&Pe.releaseShaderCache(M))}this.renderBufferDirect=function(M,B,K,$,X,Be){B===null&&(B=Jt);let He=X.isMesh&&X.matrixWorld.determinantAffine()<0,ke=Mw(M,B,K,$,X);_.setMaterial($,He);let qe=K.index,Je=1;if($.wireframe===!0){if(qe=ie.getWireframeAttribute(K),qe===void 0)return;Je=2}let yt=K.drawRange,St=K.attributes.position,je=yt.start*Je,Ht=(yt.start+yt.count)*Je;Be!==null&&(je=Math.max(je,Be.start*Je),Ht=Math.min(Ht,(Be.start+Be.count)*Je)),qe!==null?(je=Math.max(je,0),Ht=Math.min(Ht,qe.count)):St!=null&&(je=Math.max(je,0),Ht=Math.min(Ht,St.count));let Rn=Ht-je;if(Rn<0||Rn===1/0)return;ce.setup(X,$,ke,K,qe);let hn,sn=ye;if(qe!==null&&(hn=Ne.get(qe),sn=te,sn.setIndex(hn)),X.isMesh)$.wireframe===!0?(_.setLineWidth($.wireframeLinewidth*Zt()),sn.setMode(U.LINES)):sn.setMode(U.TRIANGLES);else if(X.isLine){let Jn=$.linewidth;Jn===void 0&&(Jn=1),_.setLineWidth(Jn*Zt()),X.isLineSegments?sn.setMode(U.LINES):X.isLineLoop?sn.setMode(U.LINE_LOOP):sn.setMode(U.LINE_STRIP)}else X.isPoints?sn.setMode(U.POINTS):X.isSprite&&sn.setMode(U.TRIANGLES);if(X.isBatchedMesh)if(bt.get("WEBGL_multi_draw"))sn.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{let Jn=X._multiDrawStarts,Ge=X._multiDrawCounts,fi=X._multiDrawCount,Lt=qe?Ne.get(qe).bytesPerElement:1,Zi=q.get($).currentProgram.getUniforms();for(let Rr=0;Rr<fi;Rr++)Zi.setValue(U,"_gl_DrawID",Rr),sn.render(Jn[Rr]/Lt,Ge[Rr])}else if(X.isInstancedMesh)sn.renderInstances(je,Rn,X.count);else if(K.isInstancedBufferGeometry){let Jn=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,Ge=Math.min(K.instanceCount,Jn);sn.renderInstances(je,Rn,Ge)}else sn.render(je,Rn)};function ih(M,B,K,$){O!==null&&M.isNodeMaterial&&O.setObject($,M),Ye===!0&&ae.setState(M,K,!1),M.transparent===!0&&M.side===zr&&M.forceSinglePass===!1?(M.side=xi,M.needsUpdate=!0,sh(M,B,$),M.side=Br,M.needsUpdate=!0,sh(M,B,$),M.side=zr):sh(M,B,$)}this.compile=function(M,B,K=null){K===null&&(K=M),O!==null&&O.renderStart(M,B,K),w=H.get(K),w.init(B),y.push(w),K.traverseVisible(function(X){X.isLight&&X.layers.test(B.layers)&&(w.pushLight(X),X.castShadow&&w.pushShadow(X))}),M!==K&&M.traverseVisible(function(X){X.isLight&&X.layers.test(B.layers)&&(w.pushLight(X),X.castShadow&&w.pushShadow(X))}),w.setupLights(),O!==null&&O.updateLights(w.state.lightsArray),vt=this.localClippingEnabled,Ye=ae.init(this.clippingPlanes,vt),Ye===!0&&ae.setGlobalState(this.clippingPlanes,B),O!==null&&be.render(w.state.shadowsArray,K,B);let $=new Set;return M.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;let Be=X.material;if(Be)if(Array.isArray(Be))for(let He=0;He<Be.length;He++){let ke=Be[He];ih(ke,K,B,X),$.add(ke)}else ih(Be,K,B,X),$.add(Be)}),w=y.pop(),O!==null&&O.renderEnd(),$},this.compileAsync=function(M,B,K=null){let $=this.compile(M,B,K);return new Promise(X=>{function Be(){if($.forEach(function(He){let qe=q.get(He).currentProgram;(qe===void 0||qe.isReady())&&$.delete(He)}),$.size===0){X(M);return}setTimeout(Be,10)}bt.get("KHR_parallel_shader_compile")!==null?Be():setTimeout(Be,10)})};let So=null;function Wl(M){So&&So(M)}function ev(){wo.stop()}function tv(){wo.start()}let wo=new C_;wo.setAnimationLoop(Wl),typeof self<"u"&&wo.setContext(self),this.setAnimationLoop=function(M){So=M,ze.setAnimationLoop(M),M===null?wo.stop():wo.start()},ze.addEventListener("sessionstart",ev),ze.addEventListener("sessionend",tv),this.render=function(M,B){if(B!==void 0&&B.isCamera!==!0){dt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(F===!0)return;O!==null&&O.renderStart(M,B);let K=ze.enabled===!0&&ze.isPresenting===!0,$=A!==null&&(Z===null||K)&&A.begin(P,Z);if(M.matrixWorldAutoUpdate===!0&&M.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),ze.enabled===!0&&ze.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(ze.cameraAutoUpdate===!0&&ze.updateCamera(B),B=ze.getCamera()),M.isScene===!0&&M.onBeforeRender(P,M,B,Z),w=H.get(M,y.length),w.init(B),w.state.textureUnits=ee.getTextureUnits(),y.push(w),Te.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),De.setFromProjectionMatrix(Te,xr,B.reversedDepth),vt=this.localClippingEnabled,Ye=ae.init(this.clippingPlanes,vt),S=R.get(M,T.length),S.init(),T.push(S),ze.enabled===!0&&ze.isPresenting===!0){let He=P.xr.getDepthSensingMesh();He!==null&&im(He,B,-1/0,P.sortObjects)}im(M,B,0,P.sortObjects),S.finish(),O!==null&&O.updateLights(w.state.lightsArray),P.sortObjects===!0&&S.sort(Ee,et),jt=ze.enabled===!1||ze.isPresenting===!1||ze.hasDepthSensing()===!1,jt&&Ve.addToRenderList(S,M),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ye===!0&&ae.beginShadows();let X=w.state.shadowsArray;if(be.render(X,M,B),Ye===!0&&ae.endShadows(),($&&A.hasRenderPass())===!1){let He=S.opaque,ke=S.transmissive;if(w.setupLights(),B.isArrayCamera){let qe=B.cameras;if(ke.length>0)for(let Je=0,yt=qe.length;Je<yt;Je++){let St=qe[Je];iv(He,ke,M,St)}jt&&Ve.render(M);for(let Je=0,yt=qe.length;Je<yt;Je++){let St=qe[Je];nv(S,M,St,St.viewport)}}else ke.length>0&&iv(He,ke,M,B),jt&&Ve.render(M),nv(S,M,B)}Z!==null&&k===0&&(ee.updateMultisampleRenderTarget(Z),ee.updateRenderTargetMipmap(Z)),$&&A.end(P),M.isScene===!0&&M.onAfterRender(P,M,B),ce.resetDefaultState(),Y=-1,Q=null,y.pop(),y.length>0?(w=y[y.length-1],ee.setTextureUnits(w.state.textureUnits),Ye===!0&&ae.setGlobalState(P.clippingPlanes,w.state.camera)):w=null,T.pop(),T.length>0?S=T[T.length-1]:S=null,O!==null&&O.renderEnd()};function im(M,B,K,$){if(M.visible===!1)return;if(M.layers.test(B.layers)){if(M.isGroup)K=M.renderOrder;else if(M.isLOD)M.autoUpdate===!0&&M.update(B);else if(M.isLightProbeGrid)w.pushLightProbeGrid(M);else if(M.isLight)w.pushLight(M),M.castShadow&&w.pushShadow(M);else if(M.isSprite){if(!M.frustumCulled||M.intersectsFrustum(De)){$&&st.setFromMatrixPosition(M.matrixWorld).applyMatrix4(Te);let He=oe.update(M),ke=M.material;ke.visible&&S.push(M,He,ke,K,st.z,null,B)}}else if((M.isMesh||M.isLine||M.isPoints)&&(!M.frustumCulled||M.intersectsFrustum(De))){let He=oe.update(M),ke=M.material;if($&&(M.boundingSphere!==void 0?(M.boundingSphere===null&&M.computeBoundingSphere(),st.copy(M.boundingSphere.center)):(He.boundingSphere===null&&He.computeBoundingSphere(),st.copy(He.boundingSphere.center)),st.applyMatrix4(M.matrixWorld).applyMatrix4(Te)),Array.isArray(ke)){let qe=He.groups;for(let Je=0,yt=qe.length;Je<yt;Je++){let St=qe[Je],je=ke[St.materialIndex];je&&je.visible&&S.push(M,He,je,K,st.z,St,B)}}else ke.visible&&S.push(M,He,ke,K,st.z,null,B)}}let Be=M.children;for(let He=0,ke=Be.length;He<ke;He++)im(Be[He],B,K,$)}function nv(M,B,K,$){let{opaque:X,transmissive:Be,transparent:He}=M;w.setupLightsView(K),Ye===!0&&ae.setGlobalState(P.clippingPlanes,K),$&&_.viewport(se.copy($)),X.length>0&&rh(X,B,K),Be.length>0&&rh(Be,B,K),He.length>0&&rh(He,B,K),_.buffers.depth.setTest(!0),_.buffers.depth.setMask(!0),_.buffers.color.setMask(!0),_.setPolygonOffset(!1)}function iv(M,B,K,$){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[$.id]===void 0){let je=bt.has("EXT_color_buffer_half_float")||bt.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[$.id]=new Ln(1,1,{generateMipmaps:!0,type:je?ri:ki,minFilter:Qs,samples:Math.max(4,I.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Mt.workingColorSpace})}let Be=w.state.transmissionRenderTarget[$.id],He=$.viewport||se;Be.setSize(He.z*P.transmissionResolutionScale,He.w*P.transmissionResolutionScale);let ke=P.getRenderTarget(),qe=P.getActiveCubeFace(),Je=P.getActiveMipmapLevel();P.setRenderTarget(Be),P.getClearColor(mt),$e=P.getClearAlpha(),$e<1&&P.setClearColor(16777215,.5),P.clear(),jt&&Ve.render(K);let yt=P.toneMapping;P.toneMapping=Ui;let St=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),w.setupLightsView($),Ye===!0&&ae.setGlobalState(P.clippingPlanes,$),rh(M,K,$),ee.updateMultisampleRenderTarget(Be),ee.updateRenderTargetMipmap(Be),bt.has("WEBGL_multisampled_render_to_texture")===!1){let je=!1;for(let Ht=0,Rn=B.length;Ht<Rn;Ht++){let hn=B[Ht],{object:sn,geometry:Jn,material:Ge,group:fi}=hn;if(Ge.side===zr&&sn.layers.test($.layers)){let Lt=Ge.side;Ge.side=xi,Ge.needsUpdate=!0,rv(sn,K,$,Jn,Ge,fi),Ge.side=Lt,Ge.needsUpdate=!0,je=!0}}je===!0&&(ee.updateMultisampleRenderTarget(Be),ee.updateRenderTargetMipmap(Be))}P.setRenderTarget(ke,qe,Je),P.setClearColor(mt,$e),St!==void 0&&($.viewport=St),P.toneMapping=yt}function rh(M,B,K){let $=B.isScene===!0?B.overrideMaterial:null;for(let X=0,Be=M.length;X<Be;X++){let He=M[X],{object:ke,geometry:qe,group:Je}=He,yt=He.material;yt.allowOverride===!0&&$!==null&&(yt=$),ke.layers.test(K.layers)&&rv(ke,B,K,qe,yt,Je)}}function rv(M,B,K,$,X,Be){O!==null&&X.isNodeMaterial&&O.setObject(M,X),M.onBeforeRender(P,B,K,$,X,Be),M.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,M.matrixWorld),M.normalMatrix.getNormalMatrix(M.modelViewMatrix),X.onBeforeRender(P,B,K,$,M,Be),X.transparent===!0&&X.side===zr&&X.forceSinglePass===!1?(X.side=xi,X.needsUpdate=!0,P.renderBufferDirect(K,B,$,X,M,Be),X.side=Br,X.needsUpdate=!0,P.renderBufferDirect(K,B,$,X,M,Be),X.side=zr):P.renderBufferDirect(K,B,$,X,M,Be),M.onAfterRender(P,B,K,$,X,Be)}function sh(M,B,K){B.isScene!==!0&&(B=Jt);let $=q.get(M),X=w.state.lights,Be=w.state.shadowsArray,He=X.state.version,ke=Pe.getParameters(M,X.state,Be,B,K,w.state.lightProbeGridArray),qe=Pe.getProgramCacheKey(ke),Je=$.programs;$.environment=M.isMeshStandardMaterial||M.isMeshLambertMaterial||M.isMeshPhongMaterial?B.environment:null,$.fog=B.fog;let yt=M.isMeshStandardMaterial||M.isMeshLambertMaterial&&!M.envMap||M.isMeshPhongMaterial&&!M.envMap;$.envMap=Me.get(M.envMap||$.environment,yt),$.envMapRotation=$.environment!==null&&M.envMap===null?B.environmentRotation:M.envMapRotation,Je===void 0&&(M.addEventListener("dispose",ji),Je=new Map,$.programs=Je);let St=Je.get(qe);if(St!==void 0){if($.currentProgram===St&&$.lightsStateVersion===He)return ov(M,ke),St}else ke.uniforms=Pe.getUniforms(M),O!==null&&M.isNodeMaterial&&O.build(M,K,ke),M.onBeforeCompile(ke,P),St=Pe.acquireProgram(ke,qe),Je.set(qe,St),$.uniforms=ke.uniforms;let je=$.uniforms;return(!M.isShaderMaterial&&!M.isRawShaderMaterial||M.clipping===!0)&&(je.clippingPlanes=ae.uniform),ov(M,ke),$.needsLights=ww(M),$.lightsStateVersion=He,$.needsLights&&(je.ambientLightColor.value=X.state.ambient,je.lightProbe.value=X.state.probe,je.sunLights.value=X.state.sun,je.sunLightShadows.value=X.state.sunShadow,je.directionalLights.value=X.state.directional,je.directionalLightShadows.value=X.state.directionalShadow,je.spotLights.value=X.state.spot,je.spotLightShadows.value=X.state.spotShadow,je.rectAreaLights.value=X.state.rectArea,je.ltc_1.value=X.state.rectAreaLTC1,je.ltc_2.value=X.state.rectAreaLTC2,je.pointLights.value=X.state.point,je.pointLightShadows.value=X.state.pointShadow,je.hemisphereLights.value=X.state.hemi,je.sunShadowMatrix.value=X.state.sunShadowMatrix,je.sunShadowCascade.value=X.state.sunShadowCascade,je.directionalShadowMatrix.value=X.state.directionalShadowMatrix,je.spotLightMatrix.value=X.state.spotLightMatrix,je.spotLightMap.value=X.state.spotLightMap,je.pointShadowMatrix.value=X.state.pointShadowMatrix),$.lightProbeGrid=w.state.lightProbeGridArray.length>0,$.currentProgram=St,$.uniformsList=null,St}function sv(M){if(M.uniformsList===null){let B=M.currentProgram.getUniforms();M.uniformsList=sl.seqWithValue(B.seq,M.uniforms)}return M.uniformsList}function ov(M,B){let K=q.get(M);K.outputColorSpace=B.outputColorSpace,K.batching=B.batching,K.batchingColor=B.batchingColor,K.instancing=B.instancing,K.instancingColor=B.instancingColor,K.instancingMorph=B.instancingMorph,K.skinning=B.skinning,K.morphTargets=B.morphTargets,K.morphNormals=B.morphNormals,K.morphColors=B.morphColors,K.morphTargetsCount=B.morphTargetsCount,K.numClippingPlanes=B.numClippingPlanes,K.numIntersection=B.numClipIntersection,K.vertexAlphas=B.vertexAlphas,K.vertexTangents=B.vertexTangents,K.toneMapping=B.toneMapping}function bw(M,B){if(M.length===0)return null;if(M.length===1)return M[0].texture!==null?M[0]:null;v.setFromMatrixPosition(B.matrixWorld);for(let K=0,$=M.length;K<$;K++){let X=M[K];if(X.texture!==null&&X.boundingBox.containsPoint(v))return X}return null}function Mw(M,B,K,$,X){B.isScene!==!0&&(B=Jt),ee.resetTextureUnits();let Be=B.fog,He=$.isMeshStandardMaterial||$.isMeshLambertMaterial||$.isMeshPhongMaterial?B.environment:null,ke=Z===null?P.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:Mt.workingColorSpace,qe=$.isMeshStandardMaterial||$.isMeshLambertMaterial&&!$.envMap||$.isMeshPhongMaterial&&!$.envMap,Je=Me.get($.envMap||He,qe),yt=$.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,St=!!K.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),je=!!K.morphAttributes.position,Ht=!!K.morphAttributes.normal,Rn=!!K.morphAttributes.color,hn=Ui;$.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(hn=P.toneMapping);let sn=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,Jn=sn!==void 0?sn.length:0,Ge=q.get($),fi=w.state.lights;if(Ye===!0&&(vt===!0||M!==Q)){let ln=M===Q&&$.id===Y;ae.setState($,M,ln)}let Lt=!1;$.version===Ge.__version?(Ge.needsLights&&Ge.lightsStateVersion!==fi.state.version||Ge.outputColorSpace!==ke||X.isBatchedMesh&&Ge.batching===!1||!X.isBatchedMesh&&Ge.batching===!0||X.isBatchedMesh&&Ge.batchingColor===!0&&X._colorsTexture===null||X.isBatchedMesh&&Ge.batchingColor===!1&&X._colorsTexture!==null||X.isInstancedMesh&&Ge.instancing===!1||!X.isInstancedMesh&&Ge.instancing===!0||X.isSkinnedMesh&&Ge.skinning===!1||!X.isSkinnedMesh&&Ge.skinning===!0||X.isInstancedMesh&&Ge.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Ge.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Ge.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Ge.instancingMorph===!1&&X.morphTexture!==null||Ge.envMap!==Je||$.fog===!0&&Ge.fog!==Be||Ge.numClippingPlanes!==void 0&&(Ge.numClippingPlanes!==ae.numPlanes||Ge.numIntersection!==ae.numIntersection)||Ge.vertexAlphas!==yt||Ge.vertexTangents!==St||Ge.morphTargets!==je||Ge.morphNormals!==Ht||Ge.morphColors!==Rn||Ge.toneMapping!==hn||Ge.morphTargetsCount!==Jn||!!Ge.lightProbeGrid!=w.state.lightProbeGridArray.length>0)&&(Lt=!0):(Lt=!0,Ge.__version=$.version);let Zi=Ge.currentProgram;Lt===!0&&(Zi=sh($,B,X),O&&$.isNodeMaterial&&O.onUpdateProgram($,Zi,Ge));let Rr=!1,Os=!1,ya=!1,en=Zi.getUniforms(),Sn=Ge.uniforms;if(_.useProgram(Zi.program)&&(Rr=!0,Os=!0,ya=!0),$.id!==Y&&(Y=$.id,Os=!0),Ge.needsLights){let ln=bw(w.state.lightProbeGridArray,X);Ge.lightProbeGrid!==ln&&(Ge.lightProbeGrid=ln,Os=!0)}if(Rr||Q!==M){_.buffers.depth.getReversed()&&M.reversedDepth!==!0&&(M._reversedDepth=!0,M.updateProjectionMatrix()),en.setValue(U,"projectionMatrix",M.projectionMatrix),en.setValue(U,"viewMatrix",M.matrixWorldInverse);let Us=en.map.cameraPosition;Us!==void 0&&Us.setValue(U,Ce.setFromMatrixPosition(M.matrixWorld)),I.logarithmicDepthBuffer&&en.setValue(U,"logDepthBufFC",2/(Math.log(M.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&en.setValue(U,"isOrthographic",M.isOrthographicCamera===!0),Q!==M&&(Q=M,Os=!0,ya=!0)}if(Ge.needsLights&&(fi.state.sunShadowMap.length>0&&en.setValue(U,"sunShadowMap",fi.state.sunShadowMap,ee),fi.state.directionalShadowMap.length>0&&en.setValue(U,"directionalShadowMap",fi.state.directionalShadowMap,ee),fi.state.spotShadowMap.length>0&&en.setValue(U,"spotShadowMap",fi.state.spotShadowMap,ee),fi.state.pointShadowMap.length>0&&en.setValue(U,"pointShadowMap",fi.state.pointShadowMap,ee)),X.isSkinnedMesh){en.setOptional(U,X,"bindMatrix"),en.setOptional(U,X,"bindMatrixInverse");let ln=X.skeleton;ln&&(ln.boneTexture===null&&ln.computeBoneTexture(),en.setValue(U,"boneTexture",ln.boneTexture,ee))}X.isBatchedMesh&&(en.setOptional(U,X,"batchingTexture"),en.setValue(U,"batchingTexture",X._matricesTexture,ee),en.setOptional(U,X,"batchingIdTexture"),en.setValue(U,"batchingIdTexture",X._indirectTexture,ee),en.setOptional(U,X,"batchingColorTexture"),X._colorsTexture!==null&&en.setValue(U,"batchingColorTexture",X._colorsTexture,ee));let Fs=K.morphAttributes;if((Fs.position!==void 0||Fs.normal!==void 0||Fs.color!==void 0)&&N.update(X,K,Zi),(Os||Ge.receiveShadow!==X.receiveShadow)&&(Ge.receiveShadow=X.receiveShadow,en.setValue(U,"receiveShadow",X.receiveShadow)),($.isMeshStandardMaterial||$.isMeshLambertMaterial||$.isMeshPhongMaterial)&&$.envMap===null&&B.environment!==null&&(Sn.envMapIntensity.value=B.environmentIntensity),Sn.dfgLUT!==void 0&&(Sn.dfgLUT.value=N2()),Os){if(en.setValue(U,"toneMappingExposure",P.toneMappingExposure),Ge.needsLights&&Sw(Sn,ya),Be&&$.fog===!0&&Ze.refreshFogUniforms(Sn,Be),Ze.refreshMaterialUniforms(Sn,$,ne,j,w.state.transmissionRenderTarget[M.id]),Ge.needsLights&&Ge.lightProbeGrid){let ln=Ge.lightProbeGrid;Sn.probesSH.value=ln.texture,Sn.probesMin.value.copy(ln.boundingBox.min),Sn.probesMax.value.copy(ln.boundingBox.max),Sn.probesResolution.value.copy(ln.resolution)}sl.upload(U,sv(Ge),Sn,ee)}if($.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(sl.upload(U,sv(Ge),Sn,ee),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&en.setValue(U,"center",X.center),en.setValue(U,"modelViewMatrix",X.modelViewMatrix),en.setValue(U,"normalMatrix",X.normalMatrix),en.setValue(U,"modelMatrix",X.matrixWorld),$.uniformsGroups!==void 0){let ln=$.uniformsGroups;for(let Us=0,_a=ln.length;Us<_a;Us++){let lv=ln[Us];re.update(lv,Zi),re.bind(lv,Zi)}}return Zi}function Sw(M,B){M.ambientLightColor.needsUpdate=B,M.lightProbe.needsUpdate=B,M.sunLights.needsUpdate=B,M.sunLightShadows.needsUpdate=B,M.directionalLights.needsUpdate=B,M.directionalLightShadows.needsUpdate=B,M.pointLights.needsUpdate=B,M.pointLightShadows.needsUpdate=B,M.spotLights.needsUpdate=B,M.spotLightShadows.needsUpdate=B,M.rectAreaLights.needsUpdate=B,M.hemisphereLights.needsUpdate=B}function ww(M){return M.isMeshLambertMaterial||M.isMeshToonMaterial||M.isMeshPhongMaterial||M.isMeshStandardMaterial||M.isShadowMaterial||M.isShaderMaterial&&M.lights===!0}this.getActiveCubeFace=function(){return D},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return Z},this.setRenderTargetTextures=function(M,B,K){let $=q.get(M);$.__autoAllocateDepthBuffer=M.resolveDepthBuffer===!1,$.__autoAllocateDepthBuffer===!1&&($.__useRenderToTexture=!1),q.get(M.texture).__webglTexture=B,q.get(M.depthTexture).__webglTexture=$.__autoAllocateDepthBuffer?void 0:K,$.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(M,B){let K=q.get(M);K.__webglFramebuffer=B,K.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(M,B=0,K=0){Z=M,D=B,k=K;let $=null,X=!1,Be=!1;if(M){let ke=q.get(M);if(ke.__useDefaultFramebuffer!==void 0){_.bindFramebuffer(U.FRAMEBUFFER,ke.__webglFramebuffer),se.copy(M.viewport),Le.copy(M.scissor),Oe=M.scissorTest,_.viewport(se),_.scissor(Le),_.setScissorTest(Oe),Y=-1;return}else if(ke.__webglFramebuffer===void 0)ee.setupRenderTarget(M);else if(ke.__hasExternalTextures)ee.rebindTextures(M,q.get(M.texture).__webglTexture,q.get(M.depthTexture).__webglTexture);else if(M.depthBuffer){let yt=M.depthTexture;if(ke.__boundDepthTexture!==yt){if(yt!==null&&q.has(yt)&&(M.width!==yt.image.width||M.height!==yt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");ee.setupDepthRenderbuffer(M)}}let qe=M.texture;(qe.isData3DTexture||qe.isDataArrayTexture||qe.isCompressedArrayTexture)&&(Be=!0);let Je=q.get(M).__webglFramebuffer;M.isWebGLCubeRenderTarget?(Array.isArray(Je[B])?$=Je[B][K]:$=Je[B],X=!0):M.samples>0&&ee.useMultisampledRTT(M)===!1?$=q.get(M).__webglMultisampledFramebuffer:Array.isArray(Je)?$=Je[K]:$=Je,se.copy(M.viewport),Le.copy(M.scissor),Oe=M.scissorTest}else se.copy(Ae).multiplyScalar(ne).floor(),Le.copy(le).multiplyScalar(ne).floor(),Oe=ge;if(K!==0&&($=z),_.bindFramebuffer(U.FRAMEBUFFER,$)&&_.drawBuffers(M,$),_.viewport(se),_.scissor(Le),_.setScissorTest(Oe),X){let ke=q.get(M.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+B,ke.__webglTexture,K)}else if(Be){let ke=B;for(let qe=0;qe<M.textures.length;qe++){let Je=q.get(M.textures[qe]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+qe,Je.__webglTexture,K,ke)}}else if(M!==null&&K!==0){let ke=q.get(M.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,ke.__webglTexture,K)}Y=-1};function av(M){let B=q.get(M);return(B.__readFormat!==M.format||B.__readType!==M.type)&&(B.__readFormat=M.format,B.__readType=M.type,B.__formatReadable=I.textureFormatReadable(M.format),B.__typeReadable=I.textureTypeReadable(M.type)),B}this.readRenderTargetPixels=function(M,B,K,$,X,Be,He,ke=0){if(!(M&&M.isWebGLRenderTarget)){dt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let qe=q.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&He!==void 0&&(qe=qe[He]),qe){_.bindFramebuffer(U.FRAMEBUFFER,qe);try{let Je=M.textures[ke],yt=Je.format,St=Je.type;M.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+ke);let je=av(Je);if(je.__formatReadable===!1){dt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(je.__typeReadable===!1){dt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=M.width-$&&K>=0&&K<=M.height-X&&U.readPixels(B,K,$,X,Se.convert(yt),Se.convert(St),Be)}finally{let Je=Z!==null?q.get(Z).__webglFramebuffer:null;_.bindFramebuffer(U.FRAMEBUFFER,Je)}}},this.readRenderTargetPixelsAsync=async function(M,B,K,$,X,Be,He,ke=0){if(!(M&&M.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let qe=q.get(M).__webglFramebuffer;if(M.isWebGLCubeRenderTarget&&He!==void 0&&(qe=qe[He]),qe)if(B>=0&&B<=M.width-$&&K>=0&&K<=M.height-X){_.bindFramebuffer(U.FRAMEBUFFER,qe);let Je=M.textures[ke],yt=Je.format,St=Je.type;M.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+ke);let je=av(Je);if(je.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(je.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ht=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,Ht),U.bufferData(U.PIXEL_PACK_BUFFER,Be.byteLength,U.STREAM_READ),U.readPixels(B,K,$,X,Se.convert(yt),Se.convert(St),0),U.bindBuffer(U.PIXEL_PACK_BUFFER,null);let Rn=Z!==null?q.get(Z).__webglFramebuffer:null;_.bindFramebuffer(U.FRAMEBUFFER,Rn);let hn=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await n_(U,hn,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,Ht),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,Be),U.bindBuffer(U.PIXEL_PACK_BUFFER,null),U.deleteBuffer(Ht),U.deleteSync(hn),Be}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(M,B=null,K=0){let $=Math.pow(2,-K),X=Math.floor(M.image.width*$),Be=Math.floor(M.image.height*$),He=B!==null?B.x:0,ke=B!==null?B.y:0;ee.setTexture2D(M,0),U.copyTexSubImage2D(U.TEXTURE_2D,K,0,0,He,ke,X,Be),_.unbindTexture()},this.copyTextureToTexture=function(M,B,K=null,$=null,X=0,Be=0){let He,ke,qe,Je,yt,St,je,Ht,Rn,hn=M.isCompressedTexture?M.mipmaps[Be]:M.image;if(K!==null)He=K.max.x-K.min.x,ke=K.max.y-K.min.y,qe=K.isBox3?K.max.z-K.min.z:1,Je=K.min.x,yt=K.min.y,St=K.isBox3?K.min.z:0;else{let Sn=Math.pow(2,-X);He=Math.floor(hn.width*Sn),ke=Math.floor(hn.height*Sn),M.isDataArrayTexture?qe=hn.depth:M.isData3DTexture?qe=Math.floor(hn.depth*Sn):qe=1,Je=0,yt=0,St=0}$!==null?(je=$.x,Ht=$.y,Rn=$.z):(je=0,Ht=0,Rn=0);let sn=Se.convert(B.format),Jn=Se.convert(B.type),Ge;B.isData3DTexture?(ee.setTexture3D(B,0),Ge=U.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(ee.setTexture2DArray(B,0),Ge=U.TEXTURE_2D_ARRAY):(ee.setTexture2D(B,0),Ge=U.TEXTURE_2D),_.activeTexture(U.TEXTURE0),_.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,B.flipY),_.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),_.pixelStorei(U.UNPACK_ALIGNMENT,B.unpackAlignment);let fi=_.getParameter(U.UNPACK_ROW_LENGTH),Lt=_.getParameter(U.UNPACK_IMAGE_HEIGHT),Zi=_.getParameter(U.UNPACK_SKIP_PIXELS),Rr=_.getParameter(U.UNPACK_SKIP_ROWS),Os=_.getParameter(U.UNPACK_SKIP_IMAGES);_.pixelStorei(U.UNPACK_ROW_LENGTH,hn.width),_.pixelStorei(U.UNPACK_IMAGE_HEIGHT,hn.height),_.pixelStorei(U.UNPACK_SKIP_PIXELS,Je),_.pixelStorei(U.UNPACK_SKIP_ROWS,yt),_.pixelStorei(U.UNPACK_SKIP_IMAGES,St);let ya=M.isDataArrayTexture||M.isData3DTexture,en=B.isDataArrayTexture||B.isData3DTexture;if(M.isDepthTexture){let Sn=q.get(M),Fs=q.get(B),ln=q.get(Sn.__renderTarget),Us=q.get(Fs.__renderTarget);_.bindFramebuffer(U.READ_FRAMEBUFFER,ln.__webglFramebuffer),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,Us.__webglFramebuffer);for(let _a=0;_a<qe;_a++)ya&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,q.get(M).__webglTexture,X,St+_a),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,q.get(B).__webglTexture,Be,Rn+_a)),U.blitFramebuffer(Je,yt,He,ke,je,Ht,He,ke,U.DEPTH_BUFFER_BIT,U.NEAREST);_.bindFramebuffer(U.READ_FRAMEBUFFER,null),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(X!==0||M.isRenderTargetTexture||q.has(M)){let Sn=q.get(M),Fs=q.get(B);_.bindFramebuffer(U.READ_FRAMEBUFFER,L),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,V);for(let ln=0;ln<qe;ln++)ya?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Sn.__webglTexture,X,St+ln):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Sn.__webglTexture,X),en?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Fs.__webglTexture,Be,Rn+ln):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Fs.__webglTexture,Be),X!==0?U.blitFramebuffer(Je,yt,He,ke,je,Ht,He,ke,U.COLOR_BUFFER_BIT,U.NEAREST):en?U.copyTexSubImage3D(Ge,Be,je,Ht,Rn+ln,Je,yt,He,ke):U.copyTexSubImage2D(Ge,Be,je,Ht,Je,yt,He,ke);_.bindFramebuffer(U.READ_FRAMEBUFFER,null),_.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else en?M.isDataTexture||M.isData3DTexture?U.texSubImage3D(Ge,Be,je,Ht,Rn,He,ke,qe,sn,Jn,hn.data):B.isCompressedArrayTexture?U.compressedTexSubImage3D(Ge,Be,je,Ht,Rn,He,ke,qe,sn,hn.data):U.texSubImage3D(Ge,Be,je,Ht,Rn,He,ke,qe,sn,Jn,hn):M.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,Be,je,Ht,He,ke,sn,Jn,hn.data):M.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,Be,je,Ht,hn.width,hn.height,sn,hn.data):U.texSubImage2D(U.TEXTURE_2D,Be,je,Ht,He,ke,sn,Jn,hn);_.pixelStorei(U.UNPACK_ROW_LENGTH,fi),_.pixelStorei(U.UNPACK_IMAGE_HEIGHT,Lt),_.pixelStorei(U.UNPACK_SKIP_PIXELS,Zi),_.pixelStorei(U.UNPACK_SKIP_ROWS,Rr),_.pixelStorei(U.UNPACK_SKIP_IMAGES,Os),Be===0&&B.generateMipmaps&&U.generateMipmap(Ge),_.unbindTexture()},this.initRenderTarget=function(M){q.get(M).__webglFramebuffer===void 0&&ee.setupRenderTarget(M)},this.initTexture=function(M){M.isCubeTexture?ee.setTextureCube(M,0):M.isData3DTexture?ee.setTexture3D(M,0):M.isDataArrayTexture||M.isCompressedArrayTexture?ee.setTexture2DArray(M,0):ee.setTexture2D(M,0),_.unbindTexture()},this.resetState=function(){D=0,k=0,Z=null,_.reset(),ce.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let n=this.getContext();n.drawingBufferColorSpace=Mt._getDrawingBufferColorSpace(e),n.unpackColorSpace=Mt._getUnpackColorSpace()}};var oi=Object.freeze({DEFAULT:0,EMISSIVE:1,NOFOG:2}),Ei=()=>({value:new wt(0,0,0)}),ue={uTime:{value:0},uBreath:{value:.5},uLamp:{value:new C(0,0,3)},uLampOn:{value:1},uCamPos:{value:new C},uResolution:{value:new ht(1,1)},uPixelRatio:{value:1},uPxPerUnit:{value:1},uWorldScale:{value:1},uFogDensity:{value:.00485},uInvert:{value:0},uNight:{value:0},uEmissivePass:{value:0},uWorldTime:{value:0},uWave0a:{value:new Ot},uWave0b:{value:new Ot},uWave1a:{value:new Ot},uWave1b:{value:new Ot},uImpact:{value:0},uImpactWarm:{value:0},uPulse:{value:0},uFocus:{value:new C},uFxCaps:{value:new ht},uFxLineA:{value:1},uGap:{value:.02},uCut:{value:[0,0,0,0,0,0,0]},cVoid:Ei(),cAbyss:Ei(),cDeep:Ei(),cSteel:Ei(),cSlate:Ei(),cPewter:Ei(),cSilver:Ei(),cWhite:Ei(),cObsidian:Ei(),cEmber:Ei(),cEmberDeep:Ei(),cElectrum:Ei(),cPaper:Ei(),cInk:Ei()};function Tf(t){return"c"+t.charAt(0).toUpperCase()+t.slice(1)}function ai(t){return ue[Tf(t)]||ue.cSilver}function $o(){let t=new Array(7);for(let e=0;e<7;e++)t[e]=new Ct;return{value:t}}function Xo(){return{value:[1,1,1,1,1,1,1]}}var F_=new Map;function Yo(t,e){t&&F_.set(t,Math.max(0,e||0))}function U_(){let t=0;for(let e of F_.values())t+=e;return t/1048576}var cn=Object.freeze({...vv});function Tt(t){return t<=0?0:t>=1?1:t}function Vt(t,e,n){return t+(e-t)*n}function qo(t,e,n){if(t===e)return n<t?0:1;let i=Tt((n-t)/(e-t));return i*i*(3-2*i)}var Bi=`
uniform float uFogDensity; uniform vec3 cAbyss;
float fogVis(float dist) { float f = uFogDensity * dist; return exp(-f * f); }
vec3 applyFog(vec3 col, float dist) { return mix(cAbyss, col, fogVis(dist)); }`,xs=null,Y0=new Map,Rf=1,q0=()=>{ue.uFogDensity.value=tr.density*Rf},tr={density:ue.uFogDensity.value,set(t){xs&&(xs.cancel(),xs=null),tr.density=t,q0()},to(t,e,n=cn.camera){xs&&(xs.cancel(),xs=null);let i=tr.density,r=Un(e,s=>{tr.density=i+(t-i)*s,q0()},n);return xs=r,r.done.then(()=>{xs===r&&(xs=null)})},factor(t,e){let n=+e;n===1||!(n>0)?Y0.delete(t):Y0.set(t,n),Rf=1,Y0.forEach(i=>{Rf*=i}),q0()},factors(){return Rf}};var Cf={T3:Object.freeze({dustPool:65536,dustAmbient:49152,stir:!0,heptagon:!0,deposition:!0,prosvetWidth:1.5,threadDust:2e3,swarf:900,shed:300,puff:200,widthDof:!0}),T2:Object.freeze({dustPool:32768,dustAmbient:24576,stir:!0,heptagon:!0,deposition:!0,prosvetWidth:1.5,threadDust:600,swarf:900,shed:300,puff:200,widthDof:!0}),T1:Object.freeze({dustPool:6144,dustAmbient:4096,stir:!1,heptagon:!1,deposition:!1,prosvetWidth:1,threadDust:0,swarf:300,shed:0,puff:0,widthDof:!1})},j0=t=>Object.freeze({dustLoops:t==="T1"?1:2,shadowDb:Ft.coarse?-12:-26}),li=Object.freeze({T3:Object.freeze({dprCap:2,msaa:!0,grains:24576,stars:Object.freeze({signal:2e3,zenith:3e3}),bloom:"kawase",lattice:1,atlas:1024,contours:12,ringTex:Object.freeze([2048,128]),labels:24,sandText:!0,fx:Cf.T3,audio:j0("T3")}),T2:Object.freeze({dprCap:1.5,msaa:!0,grains:16384,stars:Object.freeze({signal:2e3,zenith:3e3}),bloom:"sprites",lattice:1,atlas:1024,contours:12,ringTex:Object.freeze([2048,128]),labels:24,sandText:!0,fx:Cf.T2,audio:j0("T2")}),T1:Object.freeze({dprCap:1.25,msaa:!1,grains:8192,stars:Object.freeze({signal:800,zenith:1200}),bloom:"sprites",lattice:.5,atlas:512,contours:8,ringTex:Object.freeze([1024,64]),labels:16,sandText:!1,fx:Cf.T1,audio:j0("T1")})}),O2=Object.freeze({...Cf.T2,dustPool:16384,dustAmbient:12288,heptagon:!1,deposition:!1,prosvetWidth:1,threadDust:300,swarf:400,widthDof:!1}),Xc=["T1","T2","T3"],F2=/SwiftShader|llvmpipe|Software|Mali-4|Adreno \(TM\) 3/i,vs=on.governor;function G_(){try{return matchMedia("(pointer: coarse)").matches&&Math.min(window.innerWidth,window.innerHeight)<=600}catch{return!1}}function Z0(t){let e=li[t];return e?G_()?Object.freeze({...e,msaa:t==="T2"?!1:e.msaa,labels:16,fx:t==="T2"?O2:e.fx}):e:null}function k_(t){return null}var Hc=null,Nf=!1,H_=!0,K0=-1e9,Pf=null,Of=0,B_=!1,z_=new Float32Array(vs.windowFrames),al=0,ll=0,Wc=0,$c=-1,cl=-1,If=-1;function J0(){al=0,ll=0,Wc=0,$c=-1,cl=-1}var W_=30,V_=new Float32Array(W_),Lf=0,ul="off",$_=0,Df=null;function U2(t,e){let n=Array.prototype.slice.call(t,0,e).sort((i,r)=>i-r);return e?e%2?n[(e-1)/2]:(n[e/2-1]+n[e/2])/2:0}function X_(t){let e=Xc.indexOf(t);return e>0?Xc[e-1]:t}function k2(t){let e=Xc.indexOf(t);return e>=0&&e<Xc.length-1?Xc[e+1]:t}function B2(){let t=pe.now,e=If<0?0:t-If;if(If=t,!(pt.tier==="T0"||e<=0)){if(Pf&&t-K0>=300){let n=Pf;Pf=null,pt.setTier(n,"deferred")}if(ul==="wait"&&t>=$_&&(ul="run"),ul==="run"){if(V_[Lf++]=e,Lf>=W_){ul="done";let n=U2(V_,Lf),i=pt.tier;n>20?i="T1":n>=12&&(i=X_(i)),i!==pt.tier&&pt.setTier(i,`benchmark ${n.toFixed(1)} ms`),Df&&(Df(pt.tier),Df=null),J0(),Of=t}return}if(!Nf&&t-Of>vs.upgradeAfterMs&&W.data&&W.data.tier!==pt.tier)try{W.set("tier",pt.tier)}catch{}Nf||!H_||pt.governor.update(e/1e3)}}var pt={tier:"T2",params:li.T2,detect(){let t="T0",e=null;try{let i=document.createElement("canvas").getContext("webgl2");if(!i)throw new Error("no WebGL2");let r="";try{let g=i.getExtension("WEBGL_debug_renderer_info");r=String(g?i.getParameter(g.UNMASKED_RENDERER_WEBGL):i.getParameter(i.RENDERER)||"")}catch{r=""}try{let g=i.getExtension("WEBGL_lose_context");g&&g.loseContext()}catch{}let s=F2.test(r),o=navigator.hardwareConcurrency||4,a=navigator.deviceMemory,l=(()=>{try{return matchMedia("(pointer: fine)").matches}catch{return!1}})(),c=G_(),u=W.data&&W.data.tier;u?t=u:s||o<=4||a!=null&&a<=3?t="T1":l&&o>=8?t="T3":(!c||a!=null&&a>=6,t="T2"),s&&(t="T1");let h=k_("tier");if(h&&/^T[0-3]$/.test(h)&&(t=h,Nf=!0),k_("gov")==="0"&&(H_=!1),t==="T0")throw new Error("forced T0");let d=Z0(t),f=document.getElementById("gl");if(e=f&&f.getContext("webgl2",{antialias:d.msaa,alpha:!0,premultipliedAlpha:!0,depth:!0,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1}),!e)throw new Error("context creation failed")}catch{t="T0",e=null}return pt.tier=t,pt.params=Z0(t),J.tier=t,{tier:t,gl:e}},benchmark(){return Nf||pt.tier==="T0"||ul!=="off"?Promise.resolve(pt.tier):(ul="wait",Lf=0,$_=pe.now+600,new Promise(t=>{Df=t}))},setTier(t,e=""){if(!li[t]||t===pt.tier||pt.tier==="T0")return;if(J.phase==="transition"&&pe.now-K0<300){Pf=t;return}let n=pt.tier;pt.tier=t,pt.params=Z0(t),J.tier=t,pt.governor.dropSteps=0,Of=pe.now,J0();let i=Hc&&Hc.renderer;if(i)try{i.setTier(t),i.setDprDrop(0)}catch(r){ot("quality:renderer",r)}_e.emit("tier:change",{tier:t,prev:n})},governor:{fps:60,dropSteps:0,update(t){let e=t*1e3;if(!(e>0)||(al===vs.windowFrames?Wc-=z_[ll]:al++,z_[ll]=e,Wc+=e,ll=(ll+1)%vs.windowFrames,al<vs.windowFrames))return;let n=1e3/(Wc/al);pt.governor.fps=n;let i=pe.now;if(n<vs.lowFps){cl=-1,$c<0&&($c=i);let r=Hc&&Hc.renderer,s=Math.min(typeof devicePixelRatio=="number"?devicePixelRatio:1,li[pt.tier].dprCap);if(i-$c>vs.dropAfterMs&&pt.tier!=="T1"){pt.setTier(X_(pt.tier),`governor ${n.toFixed(0)} fps`);return}if(r&&s-on.dprStep*(pt.governor.dropSteps+1)>=1-1e-6){pt.governor.dropSteps++;try{r.setDprDrop(pt.governor.dropSteps)}catch(o){ot("quality:dpr",o)}al=0,ll=0,Wc=0}}else $c=-1,n>vs.highFps&&!B_?(cl<0&&(cl=i),i-cl>vs.upgradeAfterMs&&pt.tier!=="T3"&&(B_=!0,pt.setTier(k2(pt.tier),`governor ${n.toFixed(0)} fps`))):cl=-1}},init(t){Hc=t,Of=pe.now,pe.add(B2,Nt.UI)}};_e.on("travel:start",()=>{K0=pe.now});_e.on("visibility",()=>{J0(),If=-1});var Hr=null;function z2(){if(Hr)return Hr;let t=document.createElement("canvas");t.width=t.height=64;let e=t.getContext("2d"),n=e.createImageData(64,64);for(let i=0;i<64;i++)for(let r=0;r<64;r++){let s=(r+.5)/32-1,o=(i+.5)/32-1,a=Math.min(1,Math.sqrt(s*s+o*o)),l=(.72*Math.exp(-a*a*18)+.28*Math.exp(-a*a*4.2))*(1-a*a)*(1-a),c=(i*64+r)*4;n.data[c]=n.data[c+1]=n.data[c+2]=255,n.data[c+3]=Math.round(255*Math.min(1,l))}return e.putImageData(n,0,0),Hr=new Ur(t),Hr.minFilter=Et,Hr.magFilter=Et,Hr.generateMipmaps=!1,Hr.wrapS=Hr.wrapT=ii,Yo(Hr,4096*4),Hr}var V2=`
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
}`,G2=`
${Bi}
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
}`,Yc=new Set,Q0=null;function Y_(){return Q0||(Q0=new kr(1,1)),Q0}function q_(t,e){let n={};e&&(n.USE_BATCH=""),t.fog!==!1&&(n.USE_FOG="");let i={uTex:{value:z2()},uColor:ai(t.color||"ember"),uRadius:{value:t.radius!=null?t.radius:.05},uIntensity:{value:t.intensity!=null?t.intensity:1},uNightMix:{value:t.night?1:0},uNightI:{value:t.nightIntensity!=null?t.nightIntensity:.55},uFlash:{value:0},uNight:ue.uNight,cElectrum:ue.cElectrum,cWhite:ue.cWhite,cAbyss:ue.cAbyss,uFogDensity:ue.uFogDensity};return new Pt({uniforms:i,defines:n,vertexShader:V2,fragmentShader:G2,transparent:!0,depthWrite:!1,depthTest:t.depthTest!==!1,blending:Vo,premultipliedAlpha:!0})}function eg(t,e){let n=e==="T3";t.core?(n?t.core.layers.enable(oi.EMISSIVE):t.core.layers.disable(oi.EMISSIVE),t._tierHidden=n):(n?t.sprite.layers.enable(oi.EMISSIVE):t.sprite.layers.disable(oi.EMISSIVE),t._tierHidden=!1),t._sync()}_e.on("tier:change",({tier:t})=>{for(let e of Yc)eg(e,t)});function Ff(t={}){let e=new nn,n=q_(t,!1),i=new zt(Y_(),n);i.frustumCulled=!1,i.renderOrder=t.renderOrder!=null?t.renderOrder:5,e.add(i),t.core&&e.add(t.core);let r={object:e,sprite:i,core:t.core||null,uniforms:n.uniforms,_tierHidden:!1,_sync(){i.visible=!r._tierHidden&&n.uniforms.uIntensity.value>0},setIntensity(s){n.uniforms.uIntensity.value=s,r._sync()},setColor(s){n.uniforms.uColor=ai(s)},setRadius(s){n.uniforms.uRadius.value=s},setFlash(s){n.uniforms.uFlash.value=s},dispose(){Yc.delete(r),n.dispose(),e.parent&&e.parent.remove(e)}};return Yc.add(r),eg(r,pt.tier),r}function Uf(t={}){let e=t.positions||new Float32Array(3),n=Math.max(1,Math.floor(e.length/3)),i=Y_(),r=new zo;r.setIndex(i.index.clone()),r.setAttribute("position",i.getAttribute("position").clone()),r.setAttribute("uv",i.getAttribute("uv").clone());let s=new gi(new Float32Array(n*3),3);s.array.set(e.subarray(0,n*3)),r.setAttribute("aOffset",s);let o=t.count!=null?Math.min(n,t.count):n;r.instanceCount=o;let a=q_(t,!0),l=new zt(r,a);l.frustumCulled=!1,l.renderOrder=t.renderOrder!=null?t.renderOrder:5;let c={object:l,sprite:l,core:null,uniforms:a.uniforms,_tierHidden:!1,_sync(){l.visible=o>0&&a.uniforms.uIntensity.value>0},get count(){return o},setCount(u){o=Math.max(0,Math.min(n,u|0)),r.instanceCount=o,c._sync()},setIntensity(u){a.uniforms.uIntensity.value=u,c._sync()},setColor(u){a.uniforms.uColor=ai(u)},setRadius(u){a.uniforms.uRadius.value=u},setPositions(u,h){let d=Math.min(n,h??Math.floor(u.length/3));s.array.set(u.subarray(0,d*3)),s.needsUpdate=!0,c.setCount(d)},dispose(){Yc.delete(c),r.dispose(),a.dispose(),l.parent&&l.parent.remove(l)}};return Yc.add(c),eg(c,pt.tier),c}var hl=" ",dl="−";function ys(t,e,n,i,r,s,o,a,l,c,u,h,d,f,g,x,p,m,b,E,v){let S=Mv[t],[w,T]=Sv[t];return Object.freeze({id:t,slug:e,sign:n,stratum:i,num:r,code:s,title:o,titleOpen:a,name:l,nameOpen:c,line:u,alt:S,level:h,giant:d,floor:w,ceil:T,n:f,fog:g,far:x,wet:p,root:m,note:b,hidden:E,parent:v,anchor:Object.freeze(new C(0,S,0))})}var he=Object.freeze({SIGNAL:ys("SIGNAL","signal","S",0,"01","SIGNAL","СВЯЗЬ",null,"Связь",null,"передачи и сигналы",`+1${hl}090.00`,`+1${hl}090`,3,.014,400,.22,220,392,!1,null),ARCHIVE:ys("ARCHIVE","archive","A",1,"02","ARCHIVE","ЛЕТОПИСЬ",null,"Летопись",null,"легенды, моменты, шутки","+810.00","+810",5,.006,500,.22,196,440,!1,null),MEMBERS:ys("MEMBERS","members","M",2,"03","MEMBERS","КЛАН",null,"Клан",null,"кто с нами","+460.00","+460",7,.0034,800,.22,164.81,493.88,!1,null),CORE:ys("CORE","core","•",3,"04","CORE","ЯДРО",null,"Ядро",null,"имя, девиз, всё о нас","±0.00","±0",12,.00485,700,.22,146.83,587.33,!1,null),VOYAGES:ys("VOYAGES","voyages","V",4,"05","VOYAGES","ВЫЛАЗКИ",null,"Вылазки",null,"экспедиции и зонды",`${dl}460.00`,`${dl}460`,7,.0034,800,.3,123.47,659.25,!1,null),INSIGNIA:ys("INSIGNIA","insignia","I",5,"06","INSIGNIA","ХРАНИЛИЩЕ",null,"Хранилище",null,"трофеи и находки",`${dl}810.00`,`${dl}810`,5,.006,500,0,110,783.99,!1,null),NADIR:ys("NADIR","nadir","N",6,"07","NADIR","ЗАПЕЧАТАНО","ИСТОК","Запечатано","Исток","осколков {k} из 5",`${dl}1${hl}090.00`,`${dl}1${hl}090`,3,.014,400,.22,98,880,!1,null),ZENITH:ys("ZENITH","zenith",null,-1,"00","ZENITH","НАД ВСЕМ",null,"Над всем",null,"—",`+1${hl}260.00`,`+1${hl}260`,3,35e-5,4e3,.35,220,392,!0,"SIGNAL"),WORKSHOP:ys("WORKSHOP","workshop",null,2,"03","WORKSHOP","МАСТЕРСКАЯ",null,"Мастерская",null,"—","+484.00","+484",7,.06,30,.22,164.81,493.88,!0,"MEMBERS")});var An=Object.freeze(["SIGNAL","ARCHIVE","MEMBERS","CORE","VOYAGES","INSIGNIA","NADIR"]);var sU=new Map(An.map(t=>[he[t].sign,he[t]])),H2=new Map(Object.values(he).map(t=>[t.slug,t]));function j_(t){return H2.get(String(t||"").toLowerCase())||null}function kf(t){let e=An[t];return e?he[e]:null}var Bf=[-1,0,1,2],no=new Map,jo=new Map,W2=new Map,tg=[],ng=new Map,Yn=new Map([[-1,0],[0,1],[1,1],[2,0]]),Wr={grow:[],shrink:[]},$2=new C,qc=null,Z_=-1;function zf(t){let e=Yn.get(t),n=jo.get(t);n&&n.setFade(t===-1&&jc?1:e);let i=no.get(t);i&&t!==0&&(i.visible=e>0||t===-1&&jc),t===0&&qc&&qc.key&&qc.key.group&&(qc.key.group.visible=e>0)}var jc=!1,yn={init(t){qc=t;let e=Ke.root;for(let r of Bf){let s=new nn;s.name=`nest:${r}`,s.scale.setScalar(Math.pow(1e3,r)),e.add(s),no.set(r,s)}let n=(pt.params||li.T2).lattice;for(let r of[1,2]){let s=Zc({perStratum:!1,latticeDensity:r===1?n:.5,hallLod:r===1,far:he.CORE.far});no.get(r).add(s.group),jo.set(r,s);let o=Vf({scale:Math.pow(1e3,r)});o.setCount(W.litNodes),no.get(r).add(o.object),ng.set(r,o)}let i=Zc({perStratum:!1,lattice:!1,far:1});no.get(-1).add(i.group),jo.set(-1,i);for(let r of[-1,1,2]){let s=Ff({color:"ember",radius:Wn.glowR,intensity:1,depthTest:!1,night:!0,fog:!1});no.get(r).add(s.object),W2.set(r,s),tg.push({j:r,e:s,g:no.get(r),h:Ao.H*Math.pow(1e3,r)})}for(let r of Bf)zf(r);return pe.add(yn.update,Nt.WORLD),_e.on("room:arrive",({room:r})=>{let s=(he[r]||he.CORE).far;for(let o of[1,2])jo.get(o).setFar(s)}),_e.on("tier:change",({tier:r})=>{let s=li[r];s&&jo.get(1).setLatticeDensity(s.lattice)}),_e.on("night:change",({night:r})=>{for(let s of ng.values())s.setNight(r)}),yn},level(t){return no.get(t)||null},structure(t){return jo.get(t)||null},litNodes(t){return ng.get(t)||null},fade(t){return Yn.has(t)?Yn.get(t):0},setFade(t,e){if(!Yn.has(t))return;let n=Math.max(0,Math.min(1,e));n!==Yn.get(t)&&(Yn.set(t,n),zf(t))},setHallLod(t){let e=t?he[t]:null;Z_=e&&e.stratum>=0?e.stratum:-1;let n=jo.get(1);n&&n.setHideCaps(Z_)},shift(t){let e=Bf.map(n=>Yn.get(n));if(t==="grow"){Wr.grow.push(e[3]);let n=Wr.shrink.length?Wr.shrink.pop():0;Yn.set(2,e[2]),Yn.set(1,e[1]),Yn.set(0,e[0]),Yn.set(-1,n)}else{Wr.shrink.push(e[0]);let n=Wr.grow.length?Wr.grow.pop():0;Yn.set(-1,e[1]),Yn.set(0,e[2]),Yn.set(1,e[3]),Yn.set(2,n)}Wr.grow.length>8&&Wr.grow.shift(),Wr.shrink.length>8&&Wr.shrink.shift();for(let n of Bf)zf(n)},update(){let t=Re.camera;if(!t)return;let e=Ke.s,n=$2.copy(t.position).sub(Ke.Q).length()/e,i=n<bv.miniKeyBelow;i!==jc&&(jc=i,zf(-1));for(let r=0;r<tg.length;r++){let{j:s,e:o,g:a,h:l}=tg[r],c=(s===-1?jc||Yn.get(-1)>0:Yn.get(s)>0)&&n>l*_v;o.object.visible=c&&a.visible!==!1}}};var X2=new C,ig=null;function Kc(){let t=Ke.root;t&&(t.scale.setScalar(Ke.s),t.position.copy(Ke.Q),t.updateMatrix()),ue.uWorldScale.value=Ke.s}function K_(t){let e=Re.camera;e&&t(e.position),Re.pose&&(t(Re.pose.pos),t(Re.pose.target)),Re.remapHistory(t),Ke.focus&&t(Ke.focus)}var Ke={root:null,s:1,Q:new C,n:0,focus:new C,init(t,e){return e&&(ig=e),Ke.root||(Ke.root=new nn,Ke.root.name="scaleRoot",Ke.root.matrixAutoUpdate=!1),t&&Ke.root.parent!==t&&t.add(Ke.root),Kc(),Ke},set(t,e){Ke.s=t,e&&Ke.Q.copy(e),Kc()},scaleAbout(t,e){let n=Ke.s;t!==n&&(Ke.Q.x+=e.x*(n-t),Ke.Q.y+=e.y*(n-t),Ke.Q.z+=e.z*(n-t),Ke.s=t,Kc())},fixedPoint(t){let e=1-Ke.s;return Math.abs(e)<1e-9?t.set(0,0,0):t.copy(Ke.Q).multiplyScalar(1/e)},logLerp(t,e,n){return Math.exp(Math.log(t)+(Math.log(e)-Math.log(t))*n)},toRender(t,e){return e.copy(t).multiplyScalar(Ke.s).add(Ke.Q)},toCanonical(t,e){return e.copy(t).sub(Ke.Q).multiplyScalar(1/Ke.s)},rebase(t){let n={kind:t,k:(t==="grow"?1e3:.001)/Ke.s,T:Ke.Q.clone(),s:Ke.s,Q:Ke.Q.clone()};K_(r=>Ke.mapPoint(r,n,r)),Ke.s=1,Ke.Q.set(0,0,0),Kc(),yn.shift(t);let i=ig&&ig.key;return i&&typeof i.onRebase=="function"&&i.onRebase(t),_e.emit("scale:rebase",{kind:t,k:n.k,T:n.T}),n},unrebase(t){K_(e=>e.multiplyScalar(1/t.k).add(t.T)),Ke.s=t.s,Ke.Q.copy(t.Q),Kc(),yn.shift(t.kind==="grow"?"shrink":"grow")},mapPoint(t,e,n){return n.copy(t).sub(e.T).multiplyScalar(e.k)},fitClip(t){let e=Math.max(1e-5,X2.copy(t.position).sub(Ke.focus).length());t.near=cm.near*e,t.far=cm.far*e}};var Y2=Math.PI/180,q2=.08,Gf=new C,Hf=new C,_r=new C,rg=new C,J_=new C,sg=new ht,Wf=!1,Q_=new Map,og=[],$r={until:0,ms:0,amp:0,off:new C},Re={camera:null,pose:{pos:new C(0,.75,7.2),target:new C(0,0,0),fov:nt.fov,offsetY:0,roll:0},velocity:new C,init(t){return Re.camera=t,Wf=!1,Re},setPose(t){t&&(t.pos&&Re.pose.pos.copy(t.pos),t.target&&Re.pose.target.copy(t.target),Re.pose.fov=t.fov!=null?t.fov:nt.fov,Re.pose.offsetY=t.offsetY||0,Re.pose.roll=t.roll||0)},setOffset(t,e,n=0){let i=Q_.get(t);if(!e&&!n){i&&(i.on=!1);return}i||(i={pos:new C,fov:0,on:!0},Q_.set(t,i),og.push(i)),e?i.pos.copy(e):i.pos.set(0,0,0),i.fov=n,i.on=!0},tremble(t=1,e=120){Ft.reducedMotion||($r.amp=t,$r.ms=e,$r.until=pe.now+e)},apply(t=1/60){let e=Re.camera;if(!e)return;let n=Re.pose;Gf.set(0,0,0);let i=n.fov;for(let l=0;l<og.length;l++){let c=og[l];c.on&&(Gf.add(c.pos),i+=c.fov)}let r=Math.max(1e-6,Hf.copy(n.target).sub(n.pos).length());if($r.until>pe.now&&$r.ms>0){let l=($r.until-pe.now)/$r.ms,c=$r.amp*l*r/Math.max(1e-6,ue.uPxPerUnit.value);$r.off.set((Math.random()*2-1)*c,(Math.random()*2-1)*c,0).applyQuaternion(e.quaternion),Gf.add($r.off)}e.position.copy(n.pos).add(Gf),Hf.copy(n.target).sub(e.position);let s=Hf.length();s>1e-9&&Math.abs(Hf.y/s)>.999?e.up.set(0,0,-1):e.up.set(0,1,0),e.lookAt(n.target),n.roll&&e.rotateZ(n.roll),e.fov=i;let o=Math.max(1,ve.w),a=Math.max(1,ve.h);e.aspect=o/a,n.offsetY?e.setViewOffset(o,a,0,-n.offsetY*a,o,a):e.view&&e.view.enabled&&e.clearViewOffset(),Ke.focus.copy(n.target),Ke.fitClip(e),e.updateProjectionMatrix(),e.updateMatrixWorld(),ue.uCamPos.value.copy(e.position),ue.uPxPerUnit.value=a/(2*Math.tan(i*Y2/2)),Wf&&t>0&&(J_.copy(e.position).sub(rg).multiplyScalar(1/t),Re.velocity.lerp(J_,1-Math.exp(-t/q2))),rg.copy(e.position),Wf=!0},project(t,e){let n=Re.camera;return n?(_r.copy(t).applyMatrix4(n.matrixWorldInverse),e.depth=-_r.z,_r.applyMatrix4(n.projectionMatrix),e.x=(_r.x+1)*.5*ve.w,e.y=(1-_r.y)*.5*ve.h,e.visible=e.depth>0&&_r.x>=-1&&_r.x<=1&&_r.y>=-1&&_r.y<=1,e):(e.x=-9999,e.y=-9999,e.depth=0,e.visible=!1,e)},unproject(t,e,n,i){let r=Re.camera;if(!r)return i.set(0,0,0);Re.ray(t,e,$f),_r.set(0,0,-1).transformDirection(r.matrixWorld);let s=Math.max(1e-6,$f.direction.dot(_r));return i.copy($f.origin).addScaledVector($f.direction,n/s)},ray(t,e,n){let i=Re.camera;return sg.set(t/Math.max(1,ve.w)*2-1,-(e/Math.max(1,ve.h))*2+1),n.origin.setFromMatrixPosition(i.matrixWorld),n.direction.set(sg.x,sg.y,.5).unproject(i).sub(n.origin).normalize(),n},remapHistory(t){Wf&&t(rg)}},$f=new fs;var Jc=`
uniform float uPxPerUnit;
float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }
// strut: strut spacing in LOCAL units (aStrut); modelScale: length(modelMatrix[0].xyz); depth: view-space depth (render units)
float r1Lattice(float strut, float modelScale, float depth) {
  float sp = strut * modelScale * uPxPerUnit / max(depth, 1e-6);
  return smoothstep(3.0, 6.0, sp);
}`,Zo=`
uniform mat4 uStrataM[7];
uniform float uStrataA[7];
int strataIndex(float face) { return int(clamp(floor(face / 16.0 + 0.001), 0.0, 6.0)); }
mat4 strataMatrix(float face) { return uStrataM[strataIndex(face)]; }
float strataAlpha(float face) { return uStrataA[strataIndex(face)]; }`;var ci={};for(let t=0;t<7;t++)ci[`sign:${t}`]=[128*t,0,128,128];ci["glyph:back"]=[896,0,128,128];ci.frieze=[0,128,1024,32];ci.ticks=[0,160,1024,32];for(let t=0;t<16;t++)ci[`capital:${t}`]=[128*(t%8),192+128*Math.floor(t/8),128,128];ci.deck=[0,448,256,256];for(let t=0;t<7;t++)ci[`free:${t}`]=t<3?[256*(t+1),448,256,256]:[256*(t-3),704,256,256];ci["code:0"]=[0,960,512,64];ci["code:1"]=[512,960,512,64];ci["code:2"]=[512,320,512,64];ci["code:3"]=[512,384,512,64];ci["code:4"]=[0,704,512,64];ci["code:5"]=[0,768,512,64];ci["code:6"]=[0,832,512,64];var Qc=null,eu=null,Ko=null,Xf=null;function j2(t,e){let n=()=>{let s=document.createElement("canvas");return s.width=t,s.height=e,s};(!Ko||Ko.width<t||Ko.height<e)&&(Ko=n(),Xf=n());let i=Ko.getContext("2d",{willReadFrequently:!0}),r=Xf.getContext("2d",{willReadFrequently:!0});return i.setTransform(1,0,0,1,0,0),r.setTransform(1,0,0,1,0,0),i.clearRect(0,0,Ko.width,Ko.height),r.clearRect(0,0,Xf.width,Xf.height),[i,r]}function Z2(t,e,n,i){for(let r=0;r<n;r++)for(let s=0;s<e;s++){let o=0,a=0;for(let l=-1;l<=1;l++){let c=r+l;if(!(c<0||c>=n))for(let u=-1;u<=1;u++){let h=s+u;h<0||h>=e||(o+=t[(c*e+h)*4+3],a++)}}i[r*e+s]=o/a}}var Xt={texture:null,size:1024,REGIONS:ci,init(t){if(Xt.texture)return Xt;Xt.size=t==="T1"?512:1024,Qc=document.createElement("canvas"),Qc.width=Qc.height=Xt.size,eu=Qc.getContext("2d",{willReadFrequently:!0}),eu.fillStyle="rgb(255,0,0)",eu.fillRect(0,0,Xt.size,Xt.size);let e=new Ur(Qc);return e.flipY=!1,e.generateMipmaps=!1,e.minFilter=Et,e.magFilter=Et,e.wrapS=e.wrapT=ii,e.premultiplyAlpha=!1,Xt.texture=e,Yo(e,Xt.size*Xt.size*4),Xt},region(t){let e=ci[t];if(!e)return null;let n=Xt.size/1024,i=e[0]*n,r=e[1]*n,s=e[2]*n,o=e[3]*n;return{x:i,y:r,w:s,h:o,rect:new Ot(e[0]/1024,e[1]/1024,(e[0]+e[2])/1024,(e[1]+e[3])/1024)}},draw(t,e={}){if(!Xt.texture)return!1;let n=Xt.region(t);if(!n)return!1;let i=Math.round(n.w),r=Math.round(n.h),[s,o]=j2(i,r);try{e.height&&e.height(s,i,r)}catch{}try{e.inlay&&e.inlay(o,i,r)}catch{}let a=s.getImageData(0,0,i,r).data,l=o.getImageData(0,0,i,r).data,c=new Float32Array(i*r);Z2(a,i,r,c);let u=eu.createImageData(i,r),h=u.data;for(let d=0,f=0;f<i*r;f++,d+=4)h[d]=255-Math.round(c[f]),h[d+1]=l[d+3],h[d+2]=0,h[d+3]=255;return eu.putImageData(u,Math.round(n.x),Math.round(n.y)),Xt.texture.needsUpdate=!0,!0}};var _s=`
uniform vec4 uWave0a, uWave0b, uWave1a, uWave1b;
uniform float uImpact, uImpactWarm, uPulse, uFxLineA, uWorldScale;
uniform vec3 uFocus; uniform vec2 uFxCaps;
float fxShell(vec4 a, vec4 b, vec3 p) {                 // gaussian shell weight 0..1 (mode 1 only)
  if (b.w < 0.5 || b.w > 1.5) return 0.0;
  float d = length(p - a.xyz); float x = (d - a.w) / max(b.y, 1e-4); return exp(-x * x);
}
vec3 fxDisplace(vec3 p) {                               // render-space position → displaced position
  vec3 q = p;
  for (int k = 0; k < 2; k++) {
    vec4 a = k == 0 ? uWave0a : uWave1a; vec4 b = k == 0 ? uWave0b : uWave1b;
    float d = length(p - a.xyz);
    if (b.w > 0.5 && b.w < 1.5 && d >= 2.0 * uWorldScale) q += normalize(p - a.xyz) * (b.x * d) * fxShell(a, b, p);
  }
  return q;
}
float fxWaveBright(vec3 p) {                            // additive brightness (lines/lattice/points)
  float g = uWave0b.z * fxShell(uWave0a, uWave0b, p) + uWave1b.z * fxShell(uWave1a, uWave1b, p);
  for (int k = 0; k < 2; k++) {                          // axis mode: lit for 400 ms after the front passes
    vec4 a = k == 0 ? uWave0a : uWave1a; vec4 b = k == 0 ? uWave0b : uWave1b;
    if (b.w > 1.5) { float lag = a.w - length(p - a.xyz); g += step(0.0, lag) * step(lag, 137.2 * uWorldScale); }
  }
  return g;
}
float fxCoc(float depth) {                              // circle of confusion, CSS px, ≤ 10
  return uFocus.z > 0.5 ? min(10.0, uFocus.y * abs(depth - uFocus.x) / max(depth, 1e-4)) : 0.0;
}`;var eb=`
float fxHeptagon(vec2 pc) {                             // 7-blade aperture SDF, one flat side down; pc in [-1,1]
  float a = atan(pc.x, -pc.y); float k = 6.2831853 / 7.0;
  float r = cos(floor(0.5 + a / k) * k - a) * length(pc); return r;  // < cos(π/7) inside
}`;function bs(){return{uWave0a:ue.uWave0a,uWave0b:ue.uWave0b,uWave1a:ue.uWave1a,uWave1b:ue.uWave1b,uImpact:ue.uImpact,uImpactWarm:ue.uImpactWarm,uPulse:ue.uPulse,uFxLineA:ue.uFxLineA,uFocus:ue.uFocus,uFxCaps:ue.uFxCaps,uWorldScale:ue.uWorldScale}}var K2=`
${Jc}
${Zo}
${_s}
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
  w.xyz = fxDisplace(w.xyz);                                 // H4: ВОЛНА displacement only (R2 shading untouched)
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
}`,J2=`
${Bi}
uniform float uPxPerUnit;
float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }
uniform vec3 uBase; uniform vec3 cSilver; uniform vec3 cWhite; uniform vec3 cPaper; uniform vec3 cInk;
uniform vec3 uLamp; uniform float uLampOn; uniform float uAlpha, uFlash, uRim, uInvert, uPixelRatio, uHideCapsOf;
uniform sampler2D uAtlas; uniform float uTexel; uniform vec4 uRegion;
uniform float uFriezeH, uTickL, uApertureR;
uniform float uCut[7]; uniform float uN[7]; uniform vec2 uCodeBand[7]; uniform vec4 uCodeRect[7]; uniform vec2 uCodeU;
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
  bool glyphFace = abs(si - 3.0) < 0.5 && abs(fj - 5.0) < 0.5;   // H7: glyph:back moved from face (3, 6) to (3, 5)
  if ((sign || glyphFace) && vEng.x > 0.0 && vEng.x < 1.0 && vEng.y > 0.0 && vEng.y < 1.0) {
    vec2 o = sign ? vec2(si * 0.125, 0.0) : vec2(0.875, 0.0);
    return o + vEng.xy * 0.125;
  }
  int ii = int(si + 0.5);                                       // H7: the КОДЕКС law on back face jb(i) = floor(n_i / 2)
  bool codeFace = abs(fj - floor(uN[ii] / 2.0)) < 0.5;
  if (codeFace) {
    vec2 cb = uCodeBand[ii];
    float u = (vFaceUV.x - uCodeU.x) / (uCodeU.y - uCodeU.x);
    if (abs(vFaceUV.y - cb.x) < cb.y && u >= 0.0 && u <= 1.0 && u < uCut[ii]) {
      vec4 r = uCodeRect[ii];
      return r.xy + vec2(u, (vFaceUV.y - (cb.x - cb.y)) / (2.0 * cb.y)) * r.zw;
    }
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
}`,ag=null;function lg(t={}){let e={},n=t.engrave!=null?t.engrave:null;n==="key"?e.USE_KEYGEO="":typeof n=="string"&&(e.USE_REGION=""),t.r1!==!1&&(e.USE_R1=""),t.strut==null&&(n==="key"||t.aStrut)&&(e.USE_ASTRUT=""),t.strata?e.USE_STRATA="":t.strataAlpha&&(e.USE_STRATA_A=""),t.fog!==!1&&(e.USE_FOG=""),Xt.texture||Xt.init(pt.tier);let i=typeof n=="string"&&n!=="key"?Xt.region(n):null,r=Xt.size||1024;return ag||(ag={uN:{value:Wt.map(o=>o.n)},uCodeBand:{value:Yf.map(o=>new ht(o.vc,o.vh))},uCodeRect:{value:Wt.map((o,a)=>{let l=Xt.region(`code:${a}`).rect;return new Ot(l.x,l.y,l.z-l.x,l.w-l.y)})},uCodeU:{value:new ht(Yf[0].u0,Yf[0].u1)}}),new Pt({uniforms:{uBase:ai(t.tint||"obsidian"),uAlpha:{value:1},uFlash:{value:0},uEdgeEmber:{value:0},uRim:{value:t.rim!=null?t.rim:on.r2.fresnelGain},uStrut:{value:t.strut!=null?t.strut:.05},uHideCapsOf:{value:-1},uAtlas:{value:Xt.texture},uTexel:{value:1/r},uRegion:{value:i?i.rect:new Ot(0,0,0,0)},uFriezeH:{value:Bt.friezeH},uTickL:{value:Bt.tickLen},uApertureR:{value:Bt.apertureD/2},uStrataM:t.strata||$o(),uStrataA:t.strataAlpha||Xo(),cSilver:ue.cSilver,cWhite:ue.cWhite,cPaper:ue.cPaper,cInk:ue.cInk,cAbyss:ue.cAbyss,uLamp:ue.uLamp,uLampOn:ue.uLampOn,uInvert:ue.uInvert,uPixelRatio:ue.uPixelRatio,uPxPerUnit:ue.uPxPerUnit,uFogDensity:ue.uFogDensity,uCut:ue.uCut,...ag,...bs()},defines:e,vertexShader:K2,fragmentShader:J2,side:t.side!=null?t.side:Br,transparent:!1,depthWrite:!0})}var tb=()=>(he[J.room]||he.CORE).far,nb=`
float lampReach(vec3 p) { float r = 2.0 * max(length(uCamPos - uLamp), 1e-4); float d = length(p - uLamp) / r; return 1.0 / (1.0 + d * d); }`,Q2=new Float32Array([0,-1,0,1,-1,0,0,1,0,1,1,0]),eP=[0,1,2,2,1,3],tP=`
${Jc}
${_s}
attribute vec3 aA; attribute vec3 aB; attribute float aW; attribute float aAl;
#ifdef USE_COL_ATTR
attribute vec3 aCol;
#endif
#ifdef USE_STRATA
attribute float aFace;
${Zo}
#endif
uniform vec3 uColor; uniform vec3 cWhite;
uniform float uWidth, uAlpha, uFar, uGlint, uFlatten, uFlattenY, uDrawA, uDrawB, uCount, uFlash, uStrut;
uniform vec2 uResolution; uniform float uPixelRatio; uniform vec3 uLamp; uniform vec3 uCamPos;   // uWorldScale: FX_GLSL
${nb}
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
  wa.xyz = fxDisplace(wa.xyz); wb.xyz = fxDisplace(wb.xyz);
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
  float coc = fxCoc(-va.z * 0.5 + -vb.z * 0.5);
  float wpx = max(aW * uWidth * uPixelRatio, 0.0);
  float wpxQuad = wpx * (1.0 + 0.5 * max(uImpact, uImpactWarm) * uFxCaps.x) + coc * uFxCaps.x * uPixelRatio;
  float halfW = 0.5 * wpxQuad + 1.0;
  vec4 c = mix(ca, cb, position.x);
  vec4 v = mix(va, vb, position.x);
  c.xy += vec2(-dir.y, dir.x) * position.y * halfW / hr * c.w;
  gl_Position = c;
  vSide = position.y * halfW; vHalfW = 0.5 * (wpx * (1.0 + 0.5 * uImpact * uFxCaps.x) + coc * uFxCaps.x * uPixelRatio);
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
  float w0 = max(aW * uWidth, 0.5);
  al = mix(al, min(1.0, 2.5 * al), uImpact) * uFxLineA * (w0 / (w0 + coc));
  vec3 wp = mix(wa.xyz, wb.xyz, position.x);
  vec3 sd = wb.xyz - wa.xyz; float sl = length(sd);
  float g = sl > 1e-9 ? pow(1.0 - abs(dot(sd / sl, normalize(uLamp - wp))), 24.0) * uGlint * lampReach(wp) : 0.0;
#ifdef USE_COL_ATTR
  vec3 col = aCol;
#else
  vec3 col = uColor;
#endif
  col = mix(col, cWhite, uFlash);
  col = mix(col, cWhite, uImpact) * (1.0 + fxWaveBright(wp));
  vCol = col * (1.0 + g);
  vAlpha = al;
  vDist = length(v.xyz);
}`,nP=`
${Bi}
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
}`;function qf(t,e){let n=new Float32Array(t);return n.fill(e),n}function zi(t={}){let e=t.segments||new Float32Array(6),n=t.count!=null?t.count:Math.floor(e.length/6),i=Math.max(1,Math.floor(e.length/6)),r=new zo;r.setAttribute("position",new rn(Q2,3)),r.setIndex(eP);let s=new Ja(e,6),o=()=>{r.setAttribute("aA",new Za(s,3,0)),r.setAttribute("aB",new Za(s,3,3))};o();let a=t.width instanceof Float32Array?t.width:qf(i,1),l=t.alpha instanceof Float32Array?t.alpha:qf(i,1);r.setAttribute("aW",new gi(a,1)),r.setAttribute("aAl",new gi(l,1));let c={},u=t.color instanceof Float32Array;u&&(r.setAttribute("aCol",new gi(t.color,3)),c.USE_COL_ATTR=""),t.faces&&t.strata&&(r.setAttribute("aFace",new gi(t.faces,1)),c.USE_STRATA=""),t.dash&&(c.USE_DASH=""),t.strut!=null&&(c.USE_STRUT=""),t.flatten&&(c.USE_FLATTEN=""),t.fog!==!1&&(c.USE_FOG=""),r.instanceCount=n;let h={uColor:ai(u?"silver":t.color||"silver"),uWidth:{value:typeof t.width=="number"?t.width:1},uAlpha:{value:typeof t.alpha=="number"?t.alpha:t.alpha instanceof Float32Array?1:on.r3.alpha},uFar:{value:t.far!=null?t.far:tb()},uGlint:{value:t.glint!=null?t.glint:on.r3.glintGain},uFlatten:{value:0},uFlattenY:{value:0},uDrawA:{value:0},uDrawB:{value:1},uCount:{value:n},uFlash:{value:0},uStrut:{value:t.strut!=null?t.strut:0},uDash:{value:new ht(t.dash?t.dash[0]:1,t.dash?t.dash[1]:0)},uStrataM:t.strata||$o(),uStrataA:t.strataAlpha||Xo(),cWhite:ue.cWhite,cAbyss:ue.cAbyss,uFogDensity:ue.uFogDensity,uLamp:ue.uLamp,uCamPos:ue.uCamPos,uResolution:ue.uResolution,uPixelRatio:ue.uPixelRatio,uPxPerUnit:ue.uPxPerUnit,uWorldScale:ue.uWorldScale,...bs()},d=new Pt({uniforms:h,defines:c,vertexShader:tP,fragmentShader:nP,transparent:!0,depthWrite:!1,depthTest:t.depthTest!==!1,blending:t.additive?Vo:vr}),f=new zt(r,d);return f.frustumCulled=!1,t.layer!=null&&f.layers.set(t.layer),t.renderOrder!=null&&(f.renderOrder=t.renderOrder),{mesh:f,uniforms:h,get count(){return n},setSegments(x,p){let m=p??Math.floor(x.length/6);m<=i&&x!==s.array?(s.array.set(x.subarray(0,m*6)),s.needsUpdate=!0):x!==s.array?(i=Math.max(m,Math.floor(x.length/6)),s=new Ja(x,6),o(),a.length<i&&!(t.width instanceof Float32Array)&&r.setAttribute("aW",new gi(qf(i,1),1)),l.length<i&&!(t.alpha instanceof Float32Array)&&r.setAttribute("aAl",new gi(qf(i,1),1))):s.needsUpdate=!0,n=m,r.instanceCount=m,h.uCount.value=m},setColor(x){x instanceof Float32Array?(r.setAttribute("aCol",new gi(x,3)),d.defines.USE_COL_ATTR===void 0&&(d.defines.USE_COL_ATTR="",d.needsUpdate=!0)):(h.uColor=ai(x||"silver"),d.defines.USE_COL_ATTR!==void 0&&(delete d.defines.USE_COL_ATTR,d.needsUpdate=!0))},setAlpha(x){h.uAlpha.value=x,f.visible=x>0},setWidth(x){h.uWidth.value=x},setDrawRange01(x,p){h.uDrawA.value=x,h.uDrawB.value=p},setFlatten(x,p){h.uFlatten.value=x,h.uFlattenY.value=p},dispose(){r.dispose(),d.dispose(),f.parent&&f.parent.remove(f)}}}var iP=`
${Jc}
${_s}
#ifdef USE_STRATA
attribute float aFace;
${Zo}
#endif
#ifdef USE_ASTRUT
attribute float aStrut;
#endif
#ifdef USE_DIR
attribute vec3 aDir;
#endif
uniform float uStrut, uAlpha, uFar, uGlint, uFade; uniform vec3 uLamp; uniform vec3 uColor; uniform vec3 uCamPos; uniform vec3 cWhite;
${nb}
varying vec3 vCol; varying float vAlpha; varying float vDist;
void main() {
  mat4 M = modelMatrix;
#ifdef USE_STRATA
  M = modelMatrix * strataMatrix(aFace);
#endif
  vec4 w = M * vec4(position, 1.0);
  w.xyz = fxDisplace(w.xyz);
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
  vCol = mix(uColor, cWhite, uImpact) * (1.0 + g + fxWaveBright(w.xyz));
  vAlpha = uAlpha * uFade * la * (1.0 - smoothstep(0.55 * uFar, uFar, depth / max(uWorldScale, 1e-9)));
#ifdef USE_STRATA
  vAlpha *= strataAlpha(aFace);
#endif
  vAlpha = min(1.0, vAlpha * uFxLineA * mix(1.0, 2.5, uImpact) * (1.0 / (1.0 + fxCoc(depth))));
  vDist = length(v.xyz);
}`,rP=`
${Bi}
varying vec3 vCol; varying float vAlpha; varying float vDist;
void main() {
  if (vAlpha <= 0.002) discard;
  vec3 col = vCol;
#ifdef USE_FOG
  col = applyFog(col, vDist);
#endif
  gl_FragColor = vec4(col, vAlpha);
}`;function ib(t={}){let e={};return t.strut==null&&(e.USE_ASTRUT=""),t.strata&&(e.USE_STRATA=""),t.dir!==!1&&(e.USE_DIR=""),t.fog!==!1&&(e.USE_FOG=""),new Pt({uniforms:{uStrut:{value:t.strut!=null?t.strut:0},uAlpha:{value:t.alpha!=null?t.alpha:on.r3.alpha},uFade:{value:1},uFar:{value:t.far!=null?t.far:tb()},uGlint:{value:t.glint!=null?t.glint:on.r3.glintGain},uColor:ai(t.color||"silver"),uStrataM:t.strata||$o(),uStrataA:t.strataAlpha||Xo(),uLamp:ue.uLamp,uCamPos:ue.uCamPos,uWorldScale:ue.uWorldScale,uPxPerUnit:ue.uPxPerUnit,cAbyss:ue.cAbyss,uFogDensity:ue.uFogDensity,cWhite:ue.cWhite,...bs()},defines:e,vertexShader:iP,fragmentShader:rP,transparent:!0,depthWrite:!1,blending:vr})}var sP=`
${_s}
attribute float aSize; attribute float aAlpha;
#ifdef USE_STRATA
attribute float aFace;
${Zo}
#endif
uniform float uSize, uPixelRatio;
varying float vAlpha; varying float vDist; varying float vPx; varying float vCoc; varying float vBright;
void main() {
  mat4 M = modelMatrix;
  float a = aAlpha;
#ifdef USE_STRATA
  M = modelMatrix * strataMatrix(aFace);
  a *= strataAlpha(aFace);
#endif
  vec4 w = M * vec4(position, 1.0);
  w.xyz = fxDisplace(w.xyz);
  vec4 v = viewMatrix * w;
  gl_Position = projectionMatrix * v;
  float px = max(uSize * aSize * uPixelRatio, 1.0);
  float coc = fxCoc(-v.z);
  px = px + coc * uPixelRatio;
  float s0 = max(uSize * aSize, 1.0);
  a *= pow(s0 / (s0 + coc), 2.0);
  vCoc = coc;
  vBright = 1.0 + fxWaveBright(w.xyz);
  gl_PointSize = px + 1.0;
  vPx = px;
  vAlpha = a;
  vDist = length(v.xyz);
}`,oP=`
${Bi}
${eb}
uniform vec3 uColor; uniform float uAlpha; uniform vec2 uFxCaps;
varying float vAlpha; varying float vDist; varying float vPx; varying float vCoc; varying float vBright;
void main() {
  float r = length(gl_PointCoord - 0.5) * (vPx + 1.0);     // device px from the centre
  float cov = clamp(0.5 * vPx + 0.5 - r, 0.0, 1.0);
  if (uFxCaps.y > 0.5 && vCoc >= 2.0) cov = clamp((0.9009689 - fxHeptagon((gl_PointCoord - 0.5) * 2.0)) * (vPx + 1.0) * 0.5, 0.0, 1.0);
  float a = cov * vAlpha * uAlpha;
  if (a <= 0.003) discard;
  vec3 col = uColor * vBright;
#ifdef USE_FOG
  col = applyFog(col, vDist);
#endif
  gl_FragColor = vec4(col, a);
}`;function jf(t,e){let n=new Float32Array(Math.max(1,t));return n.fill(e),n}function io(t={}){let e=t.positions||new Float32Array(3),n=Math.floor(e.length/3),i=t.count!=null?Math.min(t.count,n):n,r=new wn;r.setAttribute("position",new rn(e,3)),r.setAttribute("aSize",new rn(t.sizes||jf(n,1),1)),r.setAttribute("aAlpha",new rn(t.alphas||jf(n,1),1));let s={};t.faces&&t.strata&&(r.setAttribute("aFace",new rn(t.faces,1)),s.USE_STRATA=""),t.fog!==!1&&(s.USE_FOG=""),r.setDrawRange(0,i);let o={uColor:ai(t.color||"white"),uAlpha:{value:t.alpha!=null?t.alpha:.4},uSize:{value:t.sizePx!=null?t.sizePx:2},uStrataM:t.strata||$o(),uStrataA:t.strataAlpha||Xo(),uPixelRatio:ue.uPixelRatio,cAbyss:ue.cAbyss,uFogDensity:ue.uFogDensity,...bs()},a=new Pt({uniforms:o,defines:s,vertexShader:sP,fragmentShader:oP,transparent:!0,depthWrite:!1,depthTest:t.depthTest!==!1,blending:vr}),l=new Mc(r,a);return l.frustumCulled=t.frustumCulled===!0,l.layers.set(t.layer!=null?t.layer:oi.DEFAULT),t.renderOrder!=null&&(l.renderOrder=t.renderOrder),{object:l,uniforms:o,get count(){return i},setCount(c){i=Math.max(0,Math.min(n,c|0)),r.setDrawRange(0,i)},setAlpha(c){o.uAlpha.value=c,l.visible=c>0},setSize(c){o.uSize.value=c},setColor(c){o.uColor=ai(c),a.uniforms.uColor=o.uColor},setPositions(c,u){let h=u??Math.floor(c.length/3);h<=n&&c!==e?e.set(c.subarray(0,h*3)):c!==e&&(e=c,n=Math.floor(c.length/3),r.setAttribute("position",new rn(e,3)),r.setAttribute("aSize",new rn(jf(n,1),1)),r.setAttribute("aAlpha",new rn(jf(n,1),1))),r.attributes.position.needsUpdate=!0,i=Math.min(h,n),r.setDrawRange(0,i)},dispose(){r.dispose(),a.dispose(),l.parent&&l.parent.remove(l)}}}var cg=Math.PI*2,fl=99,aP=Bt.sign.heightFrac;function nr(t,e,n,i,r,s){let o=Math.floor(i),a=i-o,l=cg*o/t-Math.PI/t,c=l+cg/t,u=Math.sin(l)*e,h=Math.cos(l)*e,d=Math.sin(c)*e,f=Math.cos(c)*e;r[s]=u+(d-u)*a,r[s+1]=n,r[s+2]=h+(f-h)*a}function Zf(t,e,n,i,r=t.k){return n*t.n/r+(e<0?.5*t.n/r:0)+e*Bt.lattice.faceShift*i}var ug=2,Kf=(t,e,n)=>Math.max(1e-4,2*At(n)*Math.sin(Math.PI/t)*t/(e*ug)),lP=(t,e)=>2*At(e)*Math.sin(Math.PI/t.n);function cP(t){let e=Math.cos(Math.PI/t.n),n=0;for(let i=0;i<Eo.length-1;i++){let r=t.top+(t.bot-t.top)*Eo[i],s=t.top+(t.bot-t.top)*Eo[i+1];n+=Math.hypot(r-s,(At(r)-At(s))*e)}return n}var Yf=Object.freeze(Wt.map(t=>{let e=t.i===0?.8333333333333334:t.i===6?.16666666666666666:.5,n=lP(t,t.top+(t.bot-t.top)*e),i=Math.min(.14,.5*(.8*n/8)/cP(t));return Object.freeze({vc:e,vh:i,u0:.1,u1:.9})}));var Jf=class{constructor(){this.p=[],this.n=[],this.uv=[],this.eng=[],this.face=[],this.kind=[],this.strut=[]}tri(e,n,i,r,s,o){let a=n[0]-e[0],l=n[1]-e[1],c=n[2]-e[2],u=i[0]-e[0],h=i[1]-e[1],d=i[2]-e[2],f=l*d-c*h,g=c*u-a*d,x=a*h-l*u,p=Math.hypot(f,g,x);if(p<1e-12)return;f/=p,g/=p,x/=p;let m=e,b=n,E=i;f*o[0]+g*o[1]+x*o[2]<0&&(b=i,E=n,f=-f,g=-g,x=-x);for(let v of[m,b,E])this.p.push(v[0],v[1],v[2]),this.n.push(f,g,x),this.uv.push(v[3],v[4]),this.eng.push(v[5],v[6],v[7],v[8]),this.face.push(r),this.kind.push(s),this.strut.push(v[9])}geometry(){let e=new wn;return e.setAttribute("position",new Kt(this.p,3)),e.setAttribute("normal",new Kt(this.n,3)),e.setAttribute("aFaceUV",new Kt(this.uv,2)),e.setAttribute("aEng",new Kt(this.eng,4)),e.setAttribute("aFace",new Kt(this.face,1)),e.setAttribute("aKind",new Kt(this.kind,1)),e.setAttribute("aStrut",new Kt(this.strut,1)),e.computeBoundingSphere(),e}},Hn=new Float32Array(3);function rb(t,e){let{i:n,n:i,k:r,top:s,bot:o,hollow:a}=e,l=s-o,c=(s+o)/2,u=aP*l,h=Eo.map(f=>s+(o-s)*f),d=h.map(f=>At(f));for(let f=0;f<i;f++){let g=cg*f/i,x=Math.cos(g),p=-Math.sin(g),m=[Math.sin(g),0,Math.cos(g)],b=n*16+f,E=(v,S)=>{nr(i,d[v],h[v],f+S,Hn,0);let w=Hn[0]*x+Hn[2]*p;return[Hn[0],Hn[1],Hn[2],S,(s-h[v])/l,w/u+.5,.5-(h[v]-c)/u,s-h[v],h[v]-o,Kf(i,r,h[v])]};for(let v=0;v<3;v++){let S=E(v,0),w=E(v,1),T=E(v+1,0),y=E(v+1,1);t.tri(S,T,y,b,0,m),t.tri(S,y,w,b,0,m)}for(let[v,S,w,T]of[[s,d[0],1,1],[o,d[3],2,-1]]){if(S<=1e-6)continue;let y=Kf(i,r,v),A=(P,F)=>(nr(i,P,v,F,Hn,0),[Hn[0],Hn[1],Hn[2],.5,w===1?0:1,-1,-1,fl,fl,y]);if(a>0){let P=A(S,f),F=A(S,f+1),O=A(a,f),z=A(a,f+1);t.tri(P,F,z,b,w,[0,T,0]),t.tri(P,z,O,b,w,[0,T,0])}else t.tri([0,v,0,.5,w===1?0:1,-1,-1,fl,fl,y],A(S,f),A(S,f+1),b,w,[0,T,0])}if(a>0){let v=2*a*Math.sin(Math.PI/i)*i/(r*ug),S=(F,O)=>(nr(i,a,F,O,Hn,0),[Hn[0],Hn[1],Hn[2],O-f,(s-F)/l,-1,-1,fl,fl,v]),w=S(s,f),T=S(s,f+1),y=S(o,f),A=S(o,f+1),P=[-Math.sin(g),0,-Math.cos(g)];t.tri(w,y,A,b,3,P),t.tri(w,A,T,b,3,P)}}}function sb(t){let e=[],n=[],i=[],r=[],s=new Float32Array(3),o=new Float32Array(3),a=(u,h,d,f,g,x)=>{let p=f[0]-d[0],m=f[1]-d[1],b=f[2]-d[2],E=Math.hypot(p,m,b)||1,v=u.i*16+(Math.floor(h)%u.n+u.n)%u.n;e.push(d[0],d[1],d[2],f[0],f[1],f[2]),n.push(v,v),i.push(g,x),r.push(p/E,m/E,b/E,p/E,m/E,b/E)},l=Bt.lattice.segmentsPerGenerator;for(let u of Wt){let h=Math.max(1,Math.round(u.k*t)),d=u.hollow>0?[!1,!0]:[!1];for(let f of d)for(let g of[1,-1])for(let x=0;x<h;x++)for(let p=0;p<l;p++){let m=p/l,b=(p+1)/l,E=u.top+(u.bot-u.top)*m,v=u.top+(u.bot-u.top)*b,S=f?u.hollow:At(E),w=f?u.hollow:At(v),T=Zf(u,g,x,m,h),y=Zf(u,g,x,b,h),A=O=>(O%u.n+u.n)%u.n;nr(u.n,S,E,A(T),s,0),nr(u.n,w,v,A(y),o,0);let P=f?2*u.hollow*Math.sin(Math.PI/u.n)*u.n/(u.k*ug):Kf(u.n,u.k,E),F=f?P:Kf(u.n,u.k,v);a(u,A((T+y)/2),s,o,P,F)}}let c=new wn;return c.setAttribute("position",new Kt(e,3)),c.setAttribute("aFace",new Kt(n,1)),c.setAttribute("aStrut",new Kt(i,1)),c.setAttribute("aDir",new Kt(r,3)),c.computeBoundingSphere(),c}function uP(){let t=[],e=[],n=[],i=new Float32Array(3),r=new Float32Array(3),s=(o,a,l)=>{t.push(i[0],i[1],i[2],r[0],r[1],r[2]),e.push(l),n.push(o*16+a)};for(let o of Wt){let{i:a,n:l,top:c,bot:u,hollow:h}=o,d=Eo.map(p=>c+(u-c)*p),f=[...Array(l).keys()].sort((p,m)=>Math.min(p,l-p)-Math.min(m,l-m)),g=0,x=new Set;for(let p of f)for(let m of[0,3])g<on.r3.primaryEdges&&At(d[m])>1e-6&&(x.add(`${m}:${p}`),g++);for(let p=0;p<l;p++){for(let m=0;m<3;m++)nr(l,At(d[m]),d[m],p,i,0),nr(l,At(d[m+1]),d[m+1],p,r,0),s(a,p,on.r3.widthPx);for(let m of[0,3]){let b=At(d[m]);b<=1e-6||(nr(l,b,d[m],p,i,0),nr(l,b,d[m],p+.999999,r,0),s(a,p,x.has(`${m}:${p}`)?on.r3.primaryPx:on.r3.widthPx))}if(h>0)for(let m of[c,u])nr(l,h,m,p,i,0),nr(l,h,m,p+.999999,r,0),s(a,p,on.r3.widthPx)}}return{seg:new Float32Array(t),width:new Float32Array(e),face:new Float32Array(n)}}function hP(){let t=[],e=[];for(let n of Wt)for(let i of Eo){let r=n.top+(n.bot-n.top)*i,s=At(r);for(let o=0;o<n.n&&(nr(n.n,s,r,o,Hn,0),t.push(Hn[0],Hn[1],Hn[2]),e.push(n.i*16+o),!(s<=1e-6));o++);}return{pos:new Float32Array(t),face:new Float32Array(e)}}var tu=[],ob=-1,pl=new Ct,ab=new Ct,lb=new C,cb=new C,dP=new C;function fP(){let t=Re.camera;if(t)for(let e=0;e<tu.length;e++)tu[e](t)}function pP(t){tu.push(t),ob<0&&(ob=pe.add(fP,Nt.CAMERA+5))}function mP(t){let e=tu.indexOf(t);e>=0&&tu.splice(e,1)}function gP(t){let e=0,n=t.array;for(let i=0;i<n.length;i+=3){let r=n[i]*n[i]+n[i+1]*n[i+1]+n[i+2]*n[i+2];r>e&&(e=r)}return Math.sqrt(e)}function ub(t){let e=0;for(let n=0;n<t.length;n++)t[n]>e&&(e=t[n]);return e}function Zc(t={}){let e=!!t.perStratum,n=new nn;n.name=e?"structure:key":"structure";let i=t.scale!=null?t.scale:1;n.scale.setScalar(i);let r=t.far!=null?t.far:700,s={value:Array.from({length:7},()=>new Ct)},o={value:[1,1,1,1,1,1,1]},a=[];if(e)for(let D=0;D<7;D++){let k=new nn;k.name=`stratum:${D}`,n.add(k),a.push(k)}else a.push(n);let l=()=>{if(e)for(let D=0;D<7;D++)s.value[D].copy(a[D].matrix)},c=[],u=null;if(t.solid!==!1)if(e){u=lg({engrave:"key",strataAlpha:o});for(let D of Wt){let k=new Jf;rb(k,D);let Z=new zt(k.geometry(),u);Z.name=`solid:${D.i}`,Z.userData.stratum=D.i,a[D.i].add(Z),c.push(Z)}}else{u=lg({engrave:"key",strata:s,strataAlpha:o});let D=new Jf;for(let Z of Wt)rb(D,Z);let k=new zt(D.geometry(),u);k.name="solid",k.frustumCulled=!1,n.add(k),c.push(k)}let h=null,d=null,f=t.latticeDensity!=null?t.latticeDensity:1;t.lattice!==!1&&(d=ib({strata:s,strataAlpha:o,far:r,dir:!0}),h=new bc(sb(f),d),h.name="lattice",h.frustumCulled=!1,h.onBeforeRender=l,n.add(h));let g=[],x=on.r3.alpha;if(t.edges!==!1){let D=uP(),k=zi({segments:D.seg,width:D.width,faces:D.face,strata:s,strataAlpha:o,far:r,alpha:x});k.mesh.name="edges",k.mesh.onBeforeRender=l,n.add(k.mesh),g.push(k)}let p=null,m=null,b=.4;if(t.vertices){let D=hP();m=io({positions:D.pos,faces:D.face,strata:s,strataAlpha:o,sizePx:2,color:"white",alpha:b}),p=m.object,p.name="vertices",p.onBeforeRender=l,n.add(p)}let E=1,v={solid:1,lattice:1,edges:1,vertices:1},S=!0,w=!1,T=!0,y=null,A=()=>{n.visible=E>0,u&&(u.uniforms.uAlpha.value=E*v.solid),T=E*v.solid>0;for(let D=0;D<c.length;D++)c[D].visible=T&&!(y&&y[D]&&y[D].empty);d&&(d.uniforms.uFade.value=E*v.lattice,S=E*v.lattice>0,h.visible=S&&!w);for(let D of g)D.setAlpha(x*E*v.edges);m&&m.setAlpha(b*E*v.vertices)},P=h?gP(h.geometry.attributes.position):0,F=h?ub(h.geometry.attributes.aStrut.array):0,O=D=>{if(!h||!S)return;n.updateWorldMatrix(!0,!1);let k=n.matrixWorld.elements,Z=Math.hypot(k[0],k[1],k[2]),Y=0,Q=1;for(let mt=0;mt<7;mt++){let $e=e?a[mt].matrix.elements:s.value[mt].elements,rt=Math.hypot($e[12],$e[13],$e[14]);rt>Y&&(Y=rt);let j=Math.hypot($e[0],$e[1],$e[2]);j>Q&&(Q=j)}let se=(P*Q+Y)*Z;lb.set(k[12],k[13],k[14]),D.getWorldDirection(cb);let Le=dP.copy(lb).sub(D.position).dot(cb)-se,Oe=Le>0&&F*Q*Z*ue.uPxPerUnit.value/Le<=3;Oe!==w&&(w=Oe,h.visible=S&&!w)};y=c.map(D=>{let k=D.geometry,Z=k.attributes.position.array,Y=k.attributes.aStrut.array,Q=k.attributes.aFace.array,se=Z.length/3,Le=se/3,Oe=new rn(se>65535?new Uint32Array(se):new Uint16Array(se),1);for(let ne=0;ne<se;ne++)Oe.array[ne]=ne;k.setIndex(Oe);let mt=new Uint8Array(Le).fill(1),$e=new Float32Array(28),rt=new Float32Array(7),j={mesh:D,empty:!1};return j.run=ne=>{if(e){D.updateWorldMatrix(!0,!1),pl.multiplyMatrices(ne.matrixWorldInverse,D.matrixWorld);let le=pl.elements,ge=D.matrixWorld.elements;$e[0]=le[2],$e[1]=le[6],$e[2]=le[10],$e[3]=le[14],rt[0]=Math.hypot(ge[0],ge[1],ge[2])}else{n.updateWorldMatrix(!0,!1),ab.multiplyMatrices(ne.matrixWorldInverse,n.matrixWorld);for(let le=0;le<7;le++){pl.multiplyMatrices(ab,s.value[le]);let ge=pl.elements;$e[le*4]=ge[2],$e[le*4+1]=ge[6],$e[le*4+2]=ge[10],$e[le*4+3]=ge[14],pl.multiplyMatrices(n.matrixWorld,s.value[le]);let De=pl.elements;rt[le]=Math.hypot(De[0],De[1],De[2])}}let Ee=ue.uPxPerUnit.value,et=!1;for(let le=0;le<Le;le++){let ge=0;for(let De=0;De<3&&!ge;De++){let Ye=le*3+De,vt=Ye*3,Te=e?0:Math.min(6,Math.max(0,Math.floor(Q[Ye]/16+.001))),Ce=Te*4,st=-($e[Ce]*Z[vt]+$e[Ce+1]*Z[vt+1]+$e[Ce+2]*Z[vt+2]+$e[Ce+3]);Y[Ye]*rt[Te]*Ee/Math.max(st,1e-6)<6.001&&(ge=1)}mt[le]!==ge&&(mt[le]=ge,et=!0)}if(!et)return;let Ae=0;for(let le=0;le<Le;le++)mt[le]&&(Oe.array[Ae++]=le*3,Oe.array[Ae++]=le*3+1,Oe.array[Ae++]=le*3+2);Oe.clearUpdateRanges(),Oe.addUpdateRange(0,Math.max(1,Ae)),Oe.needsUpdate=!0,k.setDrawRange(0,Ae),j.empty=Ae===0,D.visible=T&&!j.empty},j});let z=y.length?D=>{if(!(!T||!n.visible))for(let k=0;k<y.length;k++)y[k].run(D)}:null,L=D=>{O(D),z&&z(D)};pP(L);let V={group:n,strata:a,solids:c,lattice:h,edges:g,vertices:p,strataMatrices:s,strataAlpha:o,solidMaterial:u,latticeMaterial:d,perStratum:e,setGap(D){for(let k=0;k<7;k++){let Z=(3-k)*(D-Dt.rest);e?a[k].position.y=Z:s.value[k].makeTranslation(0,Z,0)}},setFade(D){E=Math.max(0,Math.min(1,D)),A()},get fade(){return E},setStratumFade(D,k){D>=0&&D<7&&(o.value[D]=Math.max(0,Math.min(1,k)))},setParts(D){for(let k in D)k in v&&(v[k]=D[k]);A()},setFar(D){d&&(d.uniforms.uFar.value=D);for(let k of g)k.uniforms.uFar.value=D},setHideCaps(D){u&&(u.uniforms.uHideCapsOf.value=D)},setLatticeDensity(D){if(!h||D===f)return;f=D;let k=h.geometry;h.geometry=sb(D),F=ub(h.geometry.attributes.aStrut.array),k.dispose()},dispose(){mP(L);for(let D of c)D.geometry.dispose();u&&u.dispose(),h&&(h.geometry.dispose(),d.dispose());for(let D of g)D.dispose();m&&m.dispose(),n.parent&&n.parent.remove(n)}};return V.setGap(Dt.rest),t.hallLod&&V.setHideCaps(-1),V}var Jo=Wt[To.stratum],nu=Jo.n/Jo.k,xP=Math.floor(1.5/nu-.5)+1,hb=.003;function vP(t,e){let n=Math.round(e*1.5/nu-.5);n=Math.max(0,Math.min(xP-1,n));let i=(n+.5)*nu/1.5,r=Zf(Jo,1,0,i),s=Math.round((t-r)/nu);return{s:r+s*nu,t:i,key:`${n}:${s}`}}function yP(t,e,n){let i=Jo.top+(Jo.bot-Jo.top)*e,r=At(i),s=Jo.n,o=(t%s+s)%s,a=Math.floor(o),l=o-a,c=Math.PI*2*a/s-Math.PI/s,u=c+Math.PI*2/s;return n.set(Math.sin(c)*r+(Math.sin(u)-Math.sin(c))*r*l,i,Math.cos(c)*r+(Math.cos(u)-Math.cos(c))*r*l)}function iu(t){let e=Co(t||[]),n=[],i=new Set,r=o=>-1+3*(.1+.8*o),s=o=>.1+.8*o;for(let[o,a]of e){let l=fm(o),c=fm(a),u=Math.hypot((c.x-l.x)*6,(c.y-l.y)*6),h=Math.max(1,Math.round(u));for(let d=0;d<=h;d++){let f=d/h,g=vP(r(l.x+(c.x-l.x)*f),s(l.y+(c.y-l.y)*f));if(i.has(g.key))continue;i.add(g.key);let x=yP(g.s,g.t,new C);Math.hypot(x.x,x.y)<To.apertureSkip||n.push(x)}}return n}function Vf(t={}){let e=t.scale||1,n=t.nodes||iu(ft.clan.sigil),i=new Float32Array(Math.max(1,n.length)*3);n.forEach((l,c)=>{let u=Math.hypot(l.x,l.z)||1;i[c*3]=l.x+l.x/u*hb,i[c*3+1]=l.y,i[c*3+2]=l.z+l.z/u*hb});let r=0,s=!1,o=ts&&ts.litAlpha!=null?ts.litAlpha:.7;if(e<1e3){let l=io({positions:i,count:0,sizePx:t.dotPx||To.dotPx,color:"ember",alpha:1});return l.object.name="litNodes",l.object.renderOrder=3,{object:l.object,nodes:n,get count(){return r},setCount(c){r=Math.max(0,Math.min(n.length,c|0)),l.setCount(r),l.object.visible=r>0},setNight(c){s=!!c,l.setAlpha(s?o:1)},dispose(){l.dispose()}}}let a=Uf({positions:i,count:0,color:"ember",radius:(t.emitterM||To.emitterM)/e,intensity:1,night:!1});return a.object.name="litNodes",{object:a.object,nodes:n,get count(){return r},setCount(l){r=Math.max(0,Math.min(n.length,l|0)),a.setCount(r)},setNight(l){s=!!l,a.setIntensity(s?o:1)},dispose(){a.dispose()}}}var mb="samvin.v1",db="samvin.session",_P=400,gb=/^S(0[1-9]|1[0-4])$/,vi=t=>t!==null&&typeof t=="object"&&!Array.isArray(t),hg=t=>Array.isArray(t)&&t.every(e=>typeof e=="string");function bP(){return{v:1,firstVisit:null,lastVisit:null,days:[],found:{},shards:0,nadirOpen:!1,owner:!1,glyph:null,drawings:[],jokesFound:[],drones:{day:null,count:0,arrivals:0},resonanceNext:0,maxNest:0,transmissions:{delivered:0,read:[],lastDay:null},probes:{},decoded:[],capsuleOpened:!1,companionArrived:!1,whaleSeen:!1,inverted:!1,sound:"on",tier:null,lastRoom:"#/core",firstDive:!1,firstUnfold:!1,whaleDay:null,birthdayLeadDay:null,foundVars:{},deeds:{},code:{},codeShown:[],sbor:{count:0,last:null,here:[]},lost:{saved:0,pairs:0,kind:null,day:null,rescued:!1,hid:!1},replies:{},proposals:[],shows:{count:0,lastDay:null}}}var MP=["wait","finish","call","host","rope","gentle","notice","word"],fb=["S","A","M","•","V","I","N"],pb=t=>typeof t=="string"&&Number.isFinite(Date.parse(t)),Qf=t=>Number.isInteger(t)&&t>=0,dg=t=>t===null||typeof t=="string",SP={v:t=>t===1,firstVisit:t=>t===null||typeof t=="string"&&Number.isFinite(Date.parse(t)),lastVisit:t=>t===null||typeof t=="string"&&Number.isFinite(Date.parse(t)),days:t=>hg(t),found:t=>vi(t),shards:t=>Number.isInteger(t)&&t>=0&&t<=5,nadirOpen:t=>typeof t=="boolean",owner:t=>typeof t=="boolean",glyph:t=>t===null||Array.isArray(t),drawings:t=>Array.isArray(t),jokesFound:t=>hg(t),drones:t=>vi(t),resonanceNext:t=>Number.isInteger(t)&&t>=0,maxNest:t=>typeof t=="number"&&Number.isFinite(t),transmissions:t=>vi(t),probes:t=>vi(t),decoded:t=>hg(t),capsuleOpened:t=>typeof t=="boolean",companionArrived:t=>typeof t=="boolean",whaleSeen:t=>typeof t=="boolean",inverted:t=>typeof t=="boolean",sound:t=>t==="on"||t==="off",tier:t=>t===null||t==="T1"||t==="T2"||t==="T3",lastRoom:t=>typeof t=="string"&&t.startsWith("#"),firstDive:t=>typeof t=="boolean",firstUnfold:t=>typeof t=="boolean",whaleDay:t=>t===null||typeof t=="string",birthdayLeadDay:t=>t===null||typeof t=="string",foundVars:t=>vi(t),deeds:t=>vi(t),code:t=>vi(t),codeShown:t=>Array.isArray(t),sbor:t=>vi(t),lost:t=>vi(t),replies:t=>vi(t),proposals:t=>Array.isArray(t),shows:t=>vi(t)};function wP(t){for(let r of Object.keys(t.deeds))(!MP.includes(r)||!pb(t.deeds[r]))&&delete t.deeds[r];for(let r of Object.keys(t.code))(!fb.includes(r)||!pb(t.code[r]))&&delete t.code[r];t.codeShown=[...new Set(t.codeShown.filter(r=>fb.includes(r)))];let e=t.sbor;Qf(e.count)||(e.count=0),dg(e.last)||(e.last=null),Array.isArray(e.here)||(e.here=[]),e.here=e.here.filter(r=>vi(r)&&typeof r.day=="string"&&Array.isArray(r.ids)).map(r=>({...r,ids:r.ids.filter(s=>typeof s=="string")})).slice(-30);let n=t.lost;Qf(n.saved)||(n.saved=0),Qf(n.pairs)||(n.pairs=0),n.kind===null||n.kind==="one"||n.kind==="pair"||(n.kind=null),dg(n.day)||(n.day=null),typeof n.rescued!="boolean"&&(n.rescued=!1),typeof n.hid!="boolean"&&(n.hid=!1);for(let r of Object.keys(t.replies)){let s=t.replies[r];if(!/^\d+$/.test(r)||!Array.isArray(s)){delete t.replies[r];continue}t.replies[r]=s.filter(o=>Array.isArray(o)&&o.length===2&&o.every(a=>typeof a=="number"&&a>=-1&&a<=1)).slice(0,64)}t.proposals=t.proposals.filter(r=>vi(r)&&typeof r.id=="string"&&typeof r.title=="string").slice(0,3).map(r=>({...r,title:r.title.slice(0,32),text:typeof r.text=="string"?r.text.slice(0,80):"",where:r.where==="игра"||r.where==="жизнь"?r.where:"игра"}));let i=t.shows;Qf(i.count)||(i.count=0),dg(i.lastDay)||(i.lastDay=null);for(let r of Object.keys(t.probes)){let s=t.probes[r];vi(s)&&"read"in s&&typeof s.read!="boolean"&&delete s.read}}function AP(t){let e=vi(t)?t:{},n=bP();for(let s of Object.keys(n))(!(s in e)||!SP[s](e[s]))&&(e[s]=n[s]);let i=e.drones;i.day===null||typeof i.day=="string"||(i.day=null),Number.isInteger(i.count)||(i.count=0),Number.isInteger(i.arrivals)||(i.arrivals=0);let r=e.transmissions;(!Number.isInteger(r.delivered)||r.delivered<0)&&(r.delivered=0),Array.isArray(r.read)||(r.read=[]),r.read=r.read.filter(s=>Number.isInteger(s)&&s>=0),r.lastDay===null||typeof r.lastDay=="string"||(r.lastDay=null);for(let s of Object.keys(e.found))(!gb.test(s)||typeof e.found[s]!="string")&&delete e.found[s];e.days=[...new Set(e.days.filter(s=>/^\d{4}-\d{2}-\d{2}$/.test(s)))].sort();try{wP(e)}catch(s){ot("state:migrate",s)}return e}function EP(){try{let t=localStorage.getItem(mb);if(t==null)return{};try{return JSON.parse(t)}catch{return{}}}catch{return W.storageOk=!1,{}}}var ru=0,tp=!1;function ml(){if(ru&&(clearTimeout(ru),ru=0),!(!tp||!W.data)&&(tp=!1,!!W.storageOk))try{localStorage.setItem(mb,JSON.stringify(W.data))}catch{W.storageOk=!1}}function Kl(){if(tp=!0,!ru)try{ru=setTimeout(ml,500)}catch{ml()}}var ep=-1,W={data:null,storageOk:!0,today:"",distinctDays:1,isNewDay:!1,returning:!1,sameDaySession:!1,daysAway:0,bond:0,shrp:28,get litNodes(){if(ep<0)try{ep=iu(ft.clan.sigil).length}catch(t){ep=0,ot("state:lit",t)}return Math.min(W.distinctDays,ep)},set(t,e){W.data[t]=e,Kl()},patch(t){t(W.data),Kl()},deliverTransmissions(){let t=W.data.transmissions;if(t.lastDay===W.today)return 0;let e=ft.transmissions.length,n=Math.min(e,Math.max(t.delivered,W.distinctDays)),i=Math.max(0,n-t.delivered);return t.delivered=Math.max(t.delivered,n),t.lastDay=W.today,Kl(),i},markRead(t){let e=W.data.transmissions;!Number.isInteger(t)||t<0||e.read.includes(t)||(e.read.push(t),Kl())},rank(){let t=Object.keys(W.data.found).filter(n=>gb.test(n)).length,e=W.distinctDays;return t>=12&&e>=14?{name:"АРХИТЕКТОР",index:3}:t>=7&&e>=5?{name:"СМОТРИТЕЛЬ",index:2}:t>=3||e>=3?{name:"ИССЛЕДОВАТЕЛЬ",index:1}:{name:"НАБЛЮДАТЕЛЬ",index:0}}};function xb(t){let e=Number.isFinite(t)?t:Date.now(),n=AP(EP());W.data=n,W.today=_h(e);let i=!0;try{i=sessionStorage.getItem(db)==null,sessionStorage.setItem(db,"1")}catch{i=!0}let r=n.firstVisit,s=n.lastVisit?_h(Date.parse(n.lastVisit)):null;if(W.returning=r!=null&&i,W.sameDaySession=W.returning&&s===W.today,W.daysAway=s?Math.max(0,Io(s,W.today)):0,W.isNewDay=!n.days.includes(W.today),W.isNewDay)for(n.days.push(W.today),n.days.sort();n.days.length>_P;)n.days.shift();W.distinctDays=Math.max(1,n.days.length);let o=new Date(e).toISOString();n.firstVisit==null&&(n.firstVisit=o),n.lastVisit=o;let a=Object.keys(n.found).length;return W.bond=lm(W.distinctDays,a),W.shrp=gv(W.distinctDays,a),tp=!0,ml(),W}typeof window<"u"&&window.addEventListener("pagehide",ml);var vb=Object.freeze({clan:"members",crew:"members",missions:"voyages",vault:"insignia",legends:"archive"}),_b=new Set(["MEMBERS","VOYAGES","ARCHIVE","INSIGNIA"]);function TP(t){try{return decodeURIComponent(t)}catch{return t}}function ro(t,e){let n={hash:"",room:t,sub:e==null||e===""?null:e};return n.hash=RP(n),n}function Xr(t){if(t&&typeof t=="object"&&t.room)return ro(he[t.room]?t.room:"CORE",t.sub||null);let n=String(t??"").trim().replace(/^#?\/?/,"").split(/[/?]/).filter(Boolean),i=(n[0]||"core").toLowerCase();vb[i]&&(i=vb[i]);let r=j_(i);if(!r||r.id==="WORKSHOP")return ro("CORE",null);let s=n[1]?TP(n[1]):null;return r.id==="MEMBERS"&&s&&s.toLowerCase()==="workshop"?ro("WORKSHOP",null):r.id==="CORE"?ro("CORE",s&&s.toLowerCase()==="open"?"open":null):ro(r.id,_b.has(r.id)?s:null)}function RP(t){let e=t&&he[t.room]?t.room:"CORE";if(e==="WORKSHOP")return"#/members/workshop";let n=t.sub,i=n!=null&&n!==""&&(_b.has(e)||e==="CORE"&&n==="open");return`#/${he[e].slug}${i?"/"+encodeURIComponent(String(n)):""}`}var yb=t=>!!(W.data&&W.data.found&&W.data.found[t]);function fg(t,e){let n=t&&t.room?t:Xr(t),i=W.data||{};return n.room==="NADIR"&&!i.nadirOpen?{route:ro("CORE",null),status:"sealed",vars:{k:i.shards|0},shudder:"N"}:n.room==="ZENITH"&&!yb("S13")&&e!=="overpull"?{route:ro("CORE",null),status:"route.missing",vars:{}}:n.room==="WORKSHOP"&&!yb("S06")&&e!=="hall"?{route:ro("MEMBERS",ft.operator.id||null)}:{route:n}}function su(t){let e=ft.clan.name,n=t&&he[t.room]?t.room:"CORE";if(n==="CORE")return J.owner?`${e} · ${dr(ft.operator.name)}`:e;let i=he[n],r=n==="NADIR"&&W.data&&W.data.nadirOpen&&i.nameOpen?i.nameOpen:i.name;return`${e} · ${r}`}var Nt=Object.freeze({INPUT:0,CLOCK:10,DIRECTOR:20,WORLD:30,FX:40,LAMP:50,CAMERA:60,OVERLAY:70,RENDER:80,UI:90}),PP=.05,pg=250,Qo=[],IP=1,gl=0,xl=-1;function LP(t){let e=Qo.slice(),n=e.length;for(;n>0&&e[n-1].order>t.order;)n--;e.splice(n,0,t),Qo=e}function Sb(t){if(gl=0,!pe.running)return;gl=requestAnimationFrame(Sb);let e=xl<0?16.7:t-xl;xl=t,e>0||(e=0),e>pg&&(e=pg),pe.now+=e,pe.frame++;let n=Math.min(1,Math.max(0,+pe.timeScale||0));pe.worldNow+=e*n;let i=Math.min(PP,e/1e3),r=i*n,s=pe.now,o=Qo;for(let a=0;a<o.length;a++){let l=o[a];if(!l.dead)try{l.fn(l.order>=30&&l.order<50?r:i,s)}catch(c){ot(`loop:${l.id}`,"frame callback threw and was removed",c),pe.remove(l.id)}}}var pe={running:!1,frame:0,now:0,timeScale:1,worldNow:0,at(){if(!pe.running||xl<0||typeof performance>"u")return pe.now;let t=performance.now()-xl;return pe.now+(t>0?Math.min(t,pg):0)},add(t,e=Nt.UI){let n=IP++;return LP({id:n,fn:t,order:e,dead:!1}),n},remove(t){let e=Qo.findIndex(i=>i.id===t);if(e<0)return;Qo[e].dead=!0;let n=Qo.slice();n.splice(e,1),Qo=n},start(){pe.running||(pe.running=!0,xl=-1,typeof requestAnimationFrame=="function"&&(gl=requestAnimationFrame(Sb)))},stop(){pe.running=!1,gl&&typeof cancelAnimationFrame=="function"&&cancelAnimationFrame(gl),gl=0}},bb=!1,Mb=!1;function DP(){let t=document.visibilityState==="hidden"||document.hidden===!0;if(t!==Mb)if(Mb=t,t){bb=pe.running,pe.stop();try{document.title=J.night?"…сплю":"…ты где?"}catch{}try{ml()}catch(e){ot("loop:flush",e)}_e.emit("visibility",{hidden:!0})}else{try{document.title=su(J.route)}catch{document.title="SAM.VIN"}bb&&pe.start();try{$n.say("tab.back",{},{force:!0})}catch(e){ot("loop:status",e)}_e.emit("visibility",{hidden:!1})}}typeof document<"u"&&document.addEventListener("visibilitychange",DP);var wb=xv,NP=1/120,ir=class t{constructor(e,n=1,i=0){this.omega=e,this.zeta=n,this.x=i,this.v=0,this.target=i}step(e){if(!(e>0))return this.x;let n=Math.min(16,Math.ceil(e/NP)),i=e/n,r=this.omega,s=r*r,o=2*this.zeta*r;for(let a=0;a<n;a++)this.v+=(s*(this.target-this.x)-o*this.v)*i,this.x+=this.v*i;return this.x}snap(e){this.x=e,this.target=e,this.v=0}settled(e=.001){return Math.abs(this.target-this.x)<e&&Math.abs(this.v)<e*10}static from(e,n=0){return new t(e.omega,e.zeta==null?1:e.zeta,n)}};var OP=typeof window<"u"&&typeof window.DeviceOrientationEvent<"u",ea=[],np=!1,ou={alpha:0,beta:0,gamma:0,t:0};function Ab(t){ou.alpha=t.alpha||0,ou.beta=t.beta||0,ou.gamma=t.gamma||0,ou.t=typeof performance<"u"?performance.now():Date.now();for(let e=0;e<ea.length;e++)try{ea[e](ou)}catch{}}var FP={available:OP&&typeof window.DeviceOrientationEvent.requestPermission!="function",on(t){!FP.available||ea.includes(t)||(ea.push(t),np||(window.addEventListener("deviceorientation",Ab),np=!0))},off(t){let e=ea.indexOf(t);e>=0&&ea.splice(e,1),np&&ea.length===0&&(window.removeEventListener("deviceorientation",Ab),np=!1)}};var ip=null;function vl(){return ip||(ip=new Promise(t=>{let e=!1,n=()=>{e||(e=!0,t())};setTimeout(n,2500);try{let i=typeof document<"u"?document.fonts:null;if(!i||typeof i.load!="function"){n();return}Promise.allSettled([i.load("700 64px Geologica","SAMVINСЭМ"),i.load("500 32px Martian","SAMVIN 0123")]).then(n,n)}catch{n()}}),ip)}function rp(t){return Math.pow(10,t/20)}function au(t,e=440,n="sine"){let i=t.createOscillator();return i.type=n,i.frequency.value=e,i}function UP(t,{a:e=.005,d:n=.2,peak:i=1,t0:r=t.currentTime}={}){let s=t.createGain();return s.gain.setValueAtTime(0,r),s.gain.linearRampToValueAtTime(i,r+e),s.gain.exponentialRampToValueAtTime(Math.max(1e-5,i*1e-4),r+e+n),s}var Eb=t=>jl(t)%600+300;function Qe(t,e){let n=t.ctx,i=n.currentTime,r=au(n,Eb(e)*Math.pow(2,(t.transpose||0)/12)),s=UP(n,{a:.004,d:.036,peak:rp(-30),t0:i});r.connect(s).connect(t.bus.ui),r.start(i),r.stop(i+.06);let o={alive:!0,stop(){if(o.alive){o.alive=!1;try{r.stop()}catch{}}}};return r.onended=()=>{o.alive=!1},t.track(o,.06)}function Ti(t,e,n){let i=t.ctx,r=Eb(e),s=au(i,r),o=i.createGain();o.gain.value=0,s.connect(o).connect(t.bus.fx),s.start();let a={alive:!0,set(l){if(!a.alive||!l)return;let c=l.speed01!=null?l.speed01:l.amount!=null?l.amount:l.k!=null?l.k/5:l.d!=null?Math.min(1,l.d/12):1,u=Math.max(0,Math.min(1,c)),h=i.currentTime;o.gain.setTargetAtTime(rp(-40)*(.25+.75*u),h,.03),s.frequency.setTargetAtTime(r*(1+.5*u),h,.03)},stop(l=200){if(!a.alive)return;a.alive=!1;let c=i.currentTime,u=Math.max(.008,l/1e3);o.gain.cancelScheduledValues(c),o.gain.setValueAtTime(o.gain.value,c),o.gain.linearRampToValueAtTime(0,c+u);try{s.stop(c+u+.02)}catch{}}};return a.set(n||{speed01:0}),t.track(a,3600)}var Tb=t=>Qe(t,"signature"),Rb=t=>Qe(t,"ratchet"),Cb=t=>Qe(t,"owner");var Pb=t=>Qe(t,"hoverTick"),Ib=t=>Qe(t,"select"),Lb=t=>Qe(t,"tick"),Db=t=>Qe(t,"stringPluck"),Nb=t=>Qe(t,"lockedThud"),Ob=t=>Qe(t,"chisel"),Fb=t=>Qe(t,"stratumNote"),Ub=t=>Qe(t,"memberNote"),kb=t=>Qe(t,"workshopNode"),Bb=t=>Qe(t,"wordBell"),zb=t=>Qe(t,"arrivalLock"),Vb=t=>Qe(t,"flinch");var Gb=(t,e)=>Ti(t,"whoosh",e),Hb=t=>Qe(t,"subDrop"),Wb=t=>Qe(t,"strutTick"),$b=t=>Qe(t,"recallThud"),Xb=(t,e)=>Ti(t,"liftRumble",e),Yb=t=>Qe(t,"irisWhoosh"),qb=t=>Qe(t,"bootSwell"),jb=t=>Qe(t,"snapAir");var Zb=t=>Qe(t,"shard"),Kb=(t,e)=>Ti(t,"resRise",e),Jb=(t,e)=>Ti(t,"resSub",e),Qb=t=>Qe(t,"chunk"),eM=t=>Qe(t,"resChord"),tM=t=>Qe(t,"hiss"),nM=(t,e)=>Ti(t,"shepard",e),iM=t=>Qe(t,"whale"),rM=t=>Qe(t,"dizzy"),sM=t=>Qe(t,"chord"),oM=t=>Qe(t,"capsule"),aM=t=>Qe(t,"companion"),lM=(t,e)=>Ti(t,"zenithPad",e),cM=t=>Qe(t,"invertRoll"),uM=t=>Qe(t,"droneDodge");var hM=(t,e)=>Ti(t,"probeHold",e),dM=t=>Qe(t,"probeFlight"),fM=t=>Qe(t,"probeReturn"),pM=(t,e)=>Ti(t,"skyVoice",e),mM=(t,e)=>Ti(t,"dialStatic",e),gM=(t,e)=>Ti(t,"dialCarrier",e),xM=t=>Qe(t,"beatLock"),vM=t=>Qe(t,"vaultNote"),yM=(t,e)=>Ti(t,"wind",e);var _M=()=>({set(){},stop(){},alive:!0}),bM=t=>Qe(t,"latch"),MM=t=>Qe(t,"reverseTail"),SM=t=>Qe(t,"popClick"),wM=t=>Qe(t,"foldNoise"),AM=t=>Qe(t,"digiTail"),EM=t=>Qe(t,"subRise"),TM=t=>Qe(t,"farEcho"),RM=t=>Qe(t,"farBoom"),CM=t=>Qe(t,"debrisKnock"),PM=t=>Qe(t,"bondThread"),IM=t=>Qe(t,"sborCall"),LM=t=>Qe(t,"sborAnswer"),DM=t=>Qe(t,"guestBurn"),NM=t=>Qe(t,"lostChirp"),OM=t=>Qe(t,"lostHide"),FM=t=>Qe(t,"rescue"),UM=()=>_M(),kM=()=>_M();var mg=Object.freeze({signature:Tb,ratchet:Rb,owner:Cb,hoverTick:Pb,select:Ib,tick:Lb,stringPluck:Db,lockedThud:Nb,chisel:Ob,stratumNote:Fb,memberNote:Ub,workshopNode:kb,wordBell:Bb,arrivalLock:zb,flinch:Vb,whoosh:Gb,subDrop:Hb,strutTick:Wb,recallThud:$b,liftRumble:Xb,irisWhoosh:Yb,bootSwell:qb,snapAir:jb,shard:Zb,resRise:Kb,resSub:Jb,chunk:Qb,resChord:eM,hiss:tM,shepard:nM,whale:iM,dizzy:rM,chord:sM,capsule:oM,companion:aM,zenithPad:lM,invertRoll:cM,droneDodge:uM,probeHold:hM,probeFlight:dM,probeReturn:fM,skyVoice:pM,dialStatic:mM,dialCarrier:gM,beatLock:xM,vaultNote:vM,wind:yM,latch:bM,reverseTail:MM,popClick:SM,foldNoise:wM,digiTail:AM,subRise:EM,farEcho:TM,farBoom:RM,debrisKnock:CM,bondThread:PM,sborCall:IM,sborAnswer:LM,guestBurn:DM,lostChirp:NM,lostHide:OM,rescue:FM,dust:UM,subPulse:kM}),BM=new Set(["whoosh","liftRumble","resRise","resSub","shepard","zenithPad","probeHold","skyVoice","dialStatic","dialCarrier","wind","dust","subPulse"]);function zM(t){let e=null,n=null,i={room:"CORE",root:146.83,night:!1,rank:0,duckDb:0,narrowU:0,start(){if(e)return;let r=t.ctx;n=r.createGain(),n.gain.value=0,n.gain.setTargetAtTime(rp(-34),r.currentTime,.4),n.connect(t.bus.bed),e=[au(r,49),au(r,49.3)];for(let s of e)s.connect(n),s.start()},stop(){if(!e)return;let r=t.ctx,s=r.currentTime;n.gain.setTargetAtTime(0,s,.1);for(let o of e)try{o.stop(s+.6)}catch{}e=null},setRoom(r){i.room=r},setRootGlide(r,s,o){i.root=r*Math.pow(s/r,Math.max(0,Math.min(1,o)))},setNight(r){i.night=!!r},setRank(r){i.rank=r|0},duck(r,s){i.duckDb=r},narrow(r){i.narrowU=r},update(r){}};return i}var WP=Object.freeze({G2:98,A2:110,B2:123.47,D3:146.83,E3:164.81,G3:196,A3:220,B3:246.94,D4:293.66,E4:329.63,G4:392,A4:440,B4:493.88,D5:587.33,E5:659.25,G5:783.99,A5:880,B5:987.77,D6:1174.66,E6:1318.51,G6:1567.98,A6:1760,B6:1975.53,D7:2349.32}),hB=Object.freeze([392,440,493.88,587.33,659.25,783.99,880]),dB=Object.freeze(Object.fromEntries(Object.keys(he).map(t=>[t,he[t].root]))),fB=Object.freeze({S01:"G4",S02:"A4",S03:"B4",S04:"D5",S05:"E5",S06:"G5",S07:"A5",S08:"B5",S09:"D6",S10:"E6",S11:"G6",S12:"A6",S13:"B6",S14:"D7"});function VM(t){let e=WP[t];return e??440}function GM(t,e,n){return e.connect(n),{fx:{gate:(i=400,{at:r}={})=>({hitAt:(r??0)+i/1e3}),advanceHit:i=>i,muffle(){},pop(){return null},width(){},tape(){},tapeReset(){},shadow(){},snapshot:()=>({gateLog:[],muffleHz:2e4,width:1,buffersReady:!1})},postGate:n,dispose(){try{e.disconnect(n)}catch{}}}}var HM=["dustA","bellSam","bellVin","rev.sam","rev.vin","rev.lock","rev.thud","digiTail","irTight","dustB"];function gg(t,e){return Promise.resolve()}var $P=Math.pow(10,-6/20),xg=Object.freeze({set(){},stop(){},alive:!1}),ta=[],vg=new Uint8Array(32),yg=null,tt=null,ia=null,oo=null,br=null,yl=null,cu=null,Ms=!1,uu=0,YM=!1,WM=!1,lu=new Float32Array(64),na=[],gn={ctx:null,bus:{ui:null,fx:null,room:null,bed:null},transpose:0,night:!1,hz:VM,get irLong(){return!yg&&tt&&(yg=qM(6)),yg},send(t){let e=tt.createGain();return e.gain.value=t,e.connect(yl),e},wet:null,buf:{},chain:null,coarse:!1,tier:"T2",track(t,e){if(!t)return t;let n=tt?tt.currentTime:0;for(let i=ta.length-1;i>=0;i--)(!ta[i].v.alive||ta[i].end<n)&&ta.splice(i,1);for(ta.push({v:t,end:n+(e||1)});ta.length>24;){let i=ta.shift();try{i.v.stop(8)}catch{}}return t}};function qM(t){let e=tt.sampleRate,n=Math.floor(e*t),i=tt.createBuffer(2,n,e),r=Math.exp(-2*Math.PI*120/e),s=Math.exp(-6.9/(t*e));for(let o=0;o<2;o++){let a=i.getChannelData(o),l=0,c=0,u=1;for(let h=0;h<n;h++){let d=(Math.random()*2-1)*u;u*=s,c=r*(c+d-l),l=d,a[h]=c}}return i}function op(t,e,n){let i=tt.currentTime;t.cancelScheduledValues(i),t.setValueAtTime(t.value,i),t.linearRampToValueAtTime(e,i+n/1e3)}function $M(){tt&&(op(ia.gain,0,400),clearTimeout(uu),uu=setTimeout(()=>{uu=0,tt&&(Ms||!We.on)&&tt.suspend().catch(()=>{})},420))}function _g(){!tt||!We.on||Ms||(clearTimeout(uu),uu=0,tt.resume().catch(()=>{}),op(ia.gain,$P,400))}function XP(){br=tt.createDynamicsCompressor(),br.threshold.value=-18,br.ratio.value=3,br.attack.value=.003,br.release.value=.25,ia=tt.createGain(),ia.gain.value=0,oo=tt.createAnalyser(),oo.fftSize=64,oo.smoothingTimeConstant=.6,ia.connect(oo).connect(tt.destination),yl=tt.createGain();let t=qM(3.4),e=tt.createGain(),n=tt.createConvolver(),i=tt.createGain(),r=tt.createGain(),s=tt.createConvolver(),o=tt.createGain();e.gain.value=1,i.gain.value=1,r.gain.value=0,o.gain.value=0,n.buffer=t,s.buffer=t,yl.connect(e).connect(n).connect(i).connect(br),yl.connect(r).connect(s).connect(o).connect(br),gn.wet={bus:yl,inA:e,retA:i,convA:n,inB:r,retB:o,convB:s,live:"A"},gn.buf={},gn.coarse=!!Ft.coarse,gn.tier=J.tier,cu={};for(let a of["ui","fx","room"]){let l=tt.createGain();l.connect(br);let c=tt.createGain();c.gain.value=a==="ui"?.11:.22,l.connect(c).connect(yl),gn.bus[a]=l,cu[a]=c}try{gn.chain=GM(gn,br,ia)}catch(a){ot("audio:chain",a),br.connect(ia),gn.chain=null}gn.bus.bed=tt.createGain(),gn.bus.bed.connect(br),gn.ctx=tt}var We={ctx:null,unlocked:!1,on:!0,bed:null,init(t){return We.on=!(W.data&&W.data.sound==="off"),J.soundOn=We.on,_e.on("visibility",e=>{Ms=!!e.hidden,Ms?$M():_g()}),_e.on("room:arrive",e=>We.setRoom(e.room)),_e.on("boot:done",()=>{YM=!0,XM()}),We},unlock(){if(We.unlocked)return;let t=window.AudioContext||window.webkitAudioContext;if(t)try{tt=new t;try{navigator.audioSession&&(navigator.audioSession.type="playback")}catch{}XP(),We.ctx=tt,We.unlocked=!0;try{We.bed=zM(gn)}catch(e){ot("audio:bed",e)}We.setRoom(J.room||"CORE"),We.setNight(J.night),We.on?(We.bed&&We.bed.start(),_g()):tt.suspend().catch(()=>{}),pe.add(e=>{We.bed&&We.on&&We.bed.update(e)},Nt.FX);try{gg(gn,["dustA"]).catch(e=>ot("audio:prerender",e))}catch(e){ot("audio:prerender",e)}XM(),_e.emit("audio:unlocked",{})}catch(e){ot("audio:unlock","audio unavailable",e)}},resume(){tt&&We.on&&!Ms&&tt.state!=="running"&&tt.resume().catch(()=>{})},isOn(){return We.on},setOn(t){let e=!!t;e!==We.on&&(We.on=e,J.soundOn=e,W.set("sound",e?"on":"off"),tt&&(e?(We.bed&&We.bed.start(),_g()):($M(),We.bed&&setTimeout(()=>{!We.on&&We.bed&&We.bed.stop()},400))),_e.emit("sound:change",{on:e}))},toggle(){We.setOn(!We.on)},play(t,e={}){if(!tt||!We.on||Ms)return null;let n=mg[t];if(!n)return null;e&&e.when!=null&&(e.when=Math.max(e.when,tt.currentTime));try{return n(gn,e||{})||null}catch(i){return ot(`audio:${t}`,"recipe failed",t,i),null}},start(t,e={}){if(!tt||!We.on||Ms||!BM.has(t))return xg;e&&e.when!=null&&(e.when=Math.max(e.when,tt.currentTime));try{return mg[t](gn,e||{})||xg}catch(n){return ot(`audio:${t}`,"recipe failed",t,n),xg}},setRoom(t){let e=he[t];!e||!tt||(cu&&(op(cu.room.gain,e.wet,300),op(cu.fx.gain,e.wet,300)),We.bed&&(We.bed.setRoom(t),We.bed.duck(t==="INSIGNIA"?-60:0,960)))},setRootU(t,e,n){if(!We.bed)return;let i=he[t],r=he[e];i&&r&&We.bed.setRootGlide(i.root,r.root,n)},setNight(t){gn.night=!!t,We.bed&&We.bed.setNight(!!t)},setRank(t){We.bed&&We.bed.setRank(t|0)},setInverted(t){gn.transpose=t?-5:0},levels(t){if(t){if(!oo||!We.on||Ms){t.fill(0);return}oo.getByteFrequencyData(vg);for(let e=0;e<8;e++){let n=vg[e*2]+vg[e*2+1];t[e]=Math.min(1,n/510*1.6)}}},now(){return tt?tt.currentTime:0}};function XM(){if(!YM||!tt||WM)return;WM=!0;let t=HM.slice(1),e=i=>typeof requestIdleCallback=="function"?requestIdleCallback(i):setTimeout(i,200),n=()=>{let i=t.shift();if(i)try{gg(gn,[i]).catch(r=>ot("audio:prerender",r)).then(()=>e(n))}catch(r){ot("audio:prerender",r),e(n)}};e(n)}var jM=()=>!!(tt&&We.unlocked&&We.on&&!Ms),ZM=t=>gn.chain&&gn.chain.fx&&typeof gn.chain.fx[t]=="function"?gn.chain.fx[t]:null;function bg(){if(!tt)return 0;let t=tt.outputLatency!=null?tt.outputLatency:tt.baseLatency!=null?tt.baseLatency:0;return Math.min(.25,Math.max(0,+t||0))}function KM(){try{let t=tt.getOutputTimestamp?tt.getOutputTimestamp():null;return t&&t.performanceTime>0?t:null}catch{return null}}function sp(t){if(!tt)return NaN;let e=KM();return e?e.performanceTime+(t-e.contextTime)*1e3:performance.now()+(t-tt.currentTime)*1e3+1e3*bg()}function YP(t){if(!tt)return NaN;let e=KM();return e?e.contextTime+(t-e.performanceTime)/1e3:tt.currentTime+(t-performance.now())/1e3-bg()}function qP(){if(!oo)return-120;try{oo.getFloatTimeDomainData(lu);let t=0;for(let n=0;n<lu.length;n++)t+=lu[n]*lu[n];let e=Math.sqrt(t/lu.length);return e>1e-6?Math.max(-120,20*Math.log10(e)):-120}catch{return-120}}function so(t,e,n){if(!jM())return n;let i=ZM(t);if(!i)return n;try{let r=i.apply(gn.chain.fx,e);return r===void 0?n:r}catch(r){return ot(`audio:fx:${t}`,r),n}}We.fx={latency:bg,toPerf:sp,ctxTimeFor:YP,ready:jM,gate(t=400,e={}){let n=e&&e.at!=null?e.at:tt?tt.currentTime:0,i=so("gate",[t,{...e||{},at:n}],null);return!i||i.hitAt==null?{hitAt:null}:(na.push({at:sp(n),hitAt:sp(i.hitAt)}),na.length>16&&na.shift(),i)},advanceHit(t){let e=so("advanceHit",[t],null);return e!=null&&na.length&&(na[na.length-1].hitAt=sp(e)),e??null},muffle(t,e=0,n={}){so("muffle",[t,e,n||{}],void 0)},pop(t=700,e={}){let n=so("pop",[t,e||{}],null);return n??null},width(t,e,n={}){so("width",[t,e,n||{}],void 0)},tape(t=900,e={}){so("tape",[t,e||{}],void 0)},tapeReset(t={}){so("tapeReset",[t||{}],void 0)},shadow(t){so("shadow",[t],void 0)},snapshot(){let t=null,e=ZM("snapshot");if(e)try{t=e.call(gn.chain.fx)}catch(n){ot("audio:fx:snapshot",n)}return t=t||{},{gateLog:na.map(n=>({at:n.at,hitAt:n.hitAt})),muffleHz:t.muffleHz!=null?t.muffleHz:2e4,width:t.width!=null?t.width:1,buffersReady:!!t.buffersReady,rmsDb:qP()}}};var Mr=Object.freeze({tap:8,tick:6,stratum:7,lock:14,step:20,activation:[8,40,8,40,14,90,30],shard:[8,40,8,40,60],locked:[10,30,10]}),jP=6,Mg=0;function JM(t,e){let n=document.getElementById("fx");if(!n||Mg>=jP)return;let i=document.createElement("div");i.className="ripple",i.style.transform=`translate3d(${t}px, ${e}px, 0)`,Ft.reducedMotion&&i.classList.add("ripple--still"),Mg++;let r=()=>{Mg--,i.remove()};i.addEventListener("animationend",r,{once:!0}),setTimeout(()=>{i.isConnected&&r()},600),n.appendChild(i)}function Sr(t){try{if(typeof navigator>"u"||typeof navigator.vibrate!="function")return;let e=navigator.userActivation;if(e&&!e.hasBeenActive)return;navigator.vibrate(t)}catch{}}var Ri=Object.freeze({TAP_MS:350,HOLD_MS:350,LONG_MS:800,SLOP_PX:8,SWIPE_PX:40,SWIPE_V:.3}),ZP=60,wr=[],ra=null,bl=[],hu=[],Ml=null,xe={type:"down",x:0,y:0,dx:0,dy:0,tx:0,ty:0,vx:0,vy:0,speed:0,t:0,id:0,pointerType:"mouse",button:0,scale:1,dScale:1,deltaY:0,dir:null,afterHold:!1,shift:!1,alt:!1},Ss={x:0,y:0,vx:0,vy:0,speed:0,type:"mouse",buttons:0,t:0},Fe={active:!1,id:-1,type:"mouse",x0:0,y0:0,t0:0,lastX:0,lastY:0,lastT:0,dragging:!1,holdFired:!1,longFired:!1,pinch:!1,moved:0,button:0},du=0,fu=0,rr=new Map,iS=0,Sg=0,mu=()=>typeof performance<"u"?performance.now():Date.now(),rS=t=>{let e=t&&t.timeStamp,n=mu();return e>0&&e<=n+1&&e>n-5e3?e:n},_l=null;function En(t,e){if(xe.type=t,e&&(xe.shift=!!e.shiftKey,xe.alt=!!e.altKey),t!=="swipe"&&(xe.dir=null),ra){try{ra.onGesture(xe)}catch(i){ot(`input:${ra.name}`,"captured consumer threw",i)}return}let n=t!=="down"&&t!=="hover"&&t!=="leave"&&t!=="wheel";if(t==="down")_l=null;else if(n&&_l){if(wr.indexOf(_l)<0)return;try{_l.onGesture(xe)}catch(i){ot(`input:${_l.name}`,"consumer threw",i)}return}for(let i=wr.length-1;i>=0;i--){let r=wr[i],s=!1;try{s=!!r.onGesture(xe)}catch(o){ot(`input:${r.name}`,"consumer threw",o)}if(s){t==="down"&&(_l=r);return}}}function ws(t,e,n){xe.x=e,xe.y=n,xe.id=t.pointerId,xe.pointerType=t.pointerType||"mouse",xe.button=t.button|0,xe.scale=1,xe.dScale=1,xe.deltaY=0}function up(){du&&(clearTimeout(du),du=0),fu&&(clearTimeout(fu),fu=0)}function KP(t){let e=fn.pointer,n=rS(t),i=Math.max(1,n-(e._t||n-16)),r=(t.clientX-e.x)/i,s=(t.clientY-e.y)/i,o=1-Math.exp(-i/ZP);e.x>-9e3&&(e.vx+=(r-e.vx)*o,e.vy+=(s-e.vy)*o),e._t=n,e.x=t.clientX,e.y=t.clientY,e.speed=Math.hypot(e.vx,e.vy)*1e3,e.type=t.pointerType||"mouse",e.lastMove=pe.now,e.inside=!0}function JP(t){if(!bl.length)return;let e=fn.pointer;Ss.x=e.x,Ss.y=e.y,Ss.vx=e.vx,Ss.vy=e.vy,Ss.speed=e.speed,Ss.type=e.type,Ss.buttons=t.buttons|0,Ss.t=pe.now;for(let n=0;n<bl.length;n++)try{bl[n](Ss)}catch(i){ot("input:observer","observer threw",i)}}function QP(t){if(t.pointerType==="touch"){if(rr.set(t.pointerId,{x:t.clientX,y:t.clientY}),JM(t.clientX,t.clientY),Sr(Mr.tap),rr.size===2&&Fe.active){eI(t);return}if(rr.size>2)return}if(Fe.active)return;try{t.currentTarget.setPointerCapture(t.pointerId)}catch{}let e=rS(t),n=fn.pointer;n.x=t.clientX,n.y=t.clientY,n.vx=0,n.vy=0,n.speed=0,n._t=e,n.type=t.pointerType||"mouse",n.lastMove=pe.now,n.inside=!0,Fe.active=!0,Fe.id=t.pointerId,Fe.type=t.pointerType||"mouse",Fe.x0=Fe.lastX=t.clientX,Fe.y0=Fe.lastY=t.clientY,Fe.t0=Fe.lastT=e,Fe.dragging=!1,Fe.holdFired=!1,Fe.longFired=!1,Fe.pinch=!1,Fe.moved=0,Fe.button=t.button|0,fn.pointer.down=!0,ws(t,t.clientX,t.clientY),xe.dx=0,xe.dy=0,xe.tx=0,xe.ty=0,xe.vx=0,xe.vy=0,xe.speed=0,xe.t=0,xe.afterHold=!1,En("down",t),up(),du=setTimeout(()=>{du=0,!(!Fe.active||Fe.dragging||Fe.pinch)&&(Fe.holdFired=!0,QM(),En("hold",null),fu=setTimeout(()=>{fu=0,!(!Fe.active||Fe.dragging||Fe.pinch)&&(Fe.longFired=!0,QM(),En("longpress",null))},Ri.LONG_MS-Ri.HOLD_MS))},Ri.HOLD_MS)}function QM(){xe.x=Fe.lastX,xe.y=Fe.lastY,xe.dx=0,xe.dy=0,xe.tx=Fe.lastX-Fe.x0,xe.ty=Fe.lastY-Fe.y0,xe.vx=0,xe.vy=0,xe.speed=0,xe.t=mu()-Fe.t0,xe.id=Fe.id,xe.pointerType=Fe.type,xe.button=Fe.button,xe.scale=1,xe.dScale=1,xe.deltaY=0,xe.afterHold=!0}function eI(t){up(),Fe.dragging&&(xe.t=mu()-Fe.t0,En("dragend",t)),Fe.pinch=!0,Fe.dragging=!1,sS(),iS=Sg=Math.max(1,Math.hypot(xn.ax-xn.bx,xn.ay-xn.by)),ws(t,(xn.ax+xn.bx)/2,(xn.ay+xn.by)/2),xe.scale=1,xe.dScale=1,En("pinchstart",t)}var xn={ax:0,ay:0,bx:0,by:0,i:0};function tI(t){xn.i===0?(xn.ax=t.x,xn.ay=t.y):xn.i===1&&(xn.bx=t.x,xn.by=t.y),xn.i++}function sS(){xn.i=0,rr.forEach(tI)}var wg=null,cp=null,ap=!1;function nI(t){return!!t&&(t===wg||cp!==null&&cp.contains(t))}function iI(t){if(KP(t),JP(t),t.pointerType==="touch"&&rr.has(t.pointerId)){let n=rr.get(t.pointerId);n.x=t.clientX,n.y=t.clientY}if(Fe.pinch){if(rr.size<2)return;sS();let n=Math.max(1,Math.hypot(xn.ax-xn.bx,xn.ay-xn.by));ws(t,(xn.ax+xn.bx)/2,(xn.ay+xn.by)/2),xe.scale=n/iS,xe.dScale=n/Sg,Sg=n,En("pinch",t);return}if(!Fe.active||t.pointerId!==Fe.id){if(!Fe.active&&(t.pointerType||"mouse")==="mouse"&&(t.buttons|0)===0){if(!nI(t.target)){ap&&(ap=!1,ws(t,t.clientX,t.clientY),En("leave",t));return}ap=!0,ws(t,t.clientX,t.clientY),xe.dx=t.movementX||0,xe.dy=t.movementY||0,xe.tx=0,xe.ty=0,xe.vx=fn.pointer.vx,xe.vy=fn.pointer.vy,xe.speed=fn.pointer.speed,xe.t=0,xe.afterHold=!1,En("hover",t)}return}let e=mu();ws(t,t.clientX,t.clientY),xe.dx=t.clientX-Fe.lastX,xe.dy=t.clientY-Fe.lastY,xe.tx=t.clientX-Fe.x0,xe.ty=t.clientY-Fe.y0,xe.vx=fn.pointer.vx,xe.vy=fn.pointer.vy,xe.speed=fn.pointer.speed,xe.t=e-Fe.t0,xe.afterHold=Fe.holdFired,Fe.lastX=t.clientX,Fe.lastY=t.clientY,Fe.lastT=e,Fe.moved=Math.max(Fe.moved,Math.hypot(xe.tx,xe.ty)),Fe.dragging?En("drag",t):Fe.moved>=Ri.SLOP_PX?(Fe.dragging=!0,up(),En("dragstart",t),En("drag",t)):En("move",t)}function Ag(t,e){let n=mu();up(),fn.pointer.down=!1;try{t.currentTarget&&t.currentTarget.hasPointerCapture&&t.currentTarget.hasPointerCapture(t.pointerId)&&t.currentTarget.releasePointerCapture(t.pointerId)}catch{}ws(t,t.clientX,t.clientY),xe.dx=t.clientX-Fe.lastX,xe.dy=t.clientY-Fe.lastY,xe.tx=t.clientX-Fe.x0,xe.ty=t.clientY-Fe.y0,xe.vx=fn.pointer.vx,xe.vy=fn.pointer.vy,xe.speed=fn.pointer.speed,xe.t=n-Fe.t0,xe.afterHold=Fe.holdFired;let i=Fe.dragging,r=Fe.pinch;if(Fe.active=!1,Fe.dragging=!1,Fe.pinch=!1,e){En("cancel",t),lp();return}if(r){En("pinchend",t),lp();return}if(En("up",t),i){En("dragend",t);let s=Math.hypot(xe.tx,xe.ty),o=Math.hypot(xe.vx,xe.vy);s>=Ri.SWIPE_PX&&o>=Ri.SWIPE_V&&(xe.dir=Math.abs(xe.tx)>=Math.abs(xe.ty)?xe.tx>0?"right":"left":xe.ty>0?"down":"up",En("swipe",t))}else!Fe.holdFired&&xe.t<Ri.TAP_MS&&Fe.moved<Ri.SLOP_PX&&En("tap",t);lp()}function lp(){ra=null}function rI(t){if(t.pointerType==="touch"){rr.delete(t.pointerId);try{We.resume()}catch{}if(Fe.pinch){rr.size<2&&Fe.active&&(rr.size===0||t.pointerId===Fe.id?Ag(t,!1):(ws(t,t.clientX,t.clientY),En("pinchend",t),Fe.pinch=!1,Fe.active=!1,fn.pointer.down=!1,lp()));return}}!Fe.active||t.pointerId!==Fe.id||Ag(t,!1)}function sI(t){t.pointerType==="touch"&&rr.delete(t.pointerId),Fe.active&&(t.pointerId!==Fe.id&&!Fe.pinch||(rr.clear(),Ag(t,!0)))}function oI(t){t.preventDefault();let e=t.deltaY;t.deltaMode===1?e*=16:t.deltaMode===2&&(e*=ve.h||800),xe.x=t.clientX,xe.y=t.clientY,xe.dx=0,xe.dy=0,xe.tx=0,xe.ty=0,xe.vx=0,xe.vy=0,xe.speed=0,xe.t=0,xe.id=0,xe.pointerType="mouse",xe.button=0,xe.scale=1,xe.dScale=1,xe.deltaY=e,xe.afterHold=!1,En("wheel",t)}function aI(t){t.relatedTarget||(fn.pointer.inside=!1,ap=!1,ws(t,t.clientX,t.clientY),En("leave",t))}function eS(t){!t||t.__samvinInput||(t.__samvinInput=!0,t.addEventListener("pointerdown",QP),t.addEventListener("pointerup",rI),t.addEventListener("pointercancel",sI),t.addEventListener("wheel",oI,{passive:!1}),t.addEventListener("contextmenu",e=>e.preventDefault()))}var tS={name:"hall",onGesture(t){let e=Ml&&Ml.halls;if(!e||typeof e.current!="function")return!1;let n=e.current();return n?!!e.call(n.id,"onGesture",t):!1}},lI={name:"director",onGesture(t){let e=Ml&&Ml.director;if(!e||typeof e.busy!="function"||!e.busy())return!1;let n=e.state,i=Ml.halls;return n&&n.u>=.7&&n.to&&i&&typeof i.call=="function"&&i.call(n.to.room,"onGesture",t)||t.type==="tap"&&typeof e.speedUp=="function"&&e.speedUp(),!0}},pu=[];function nS(t,e,n,i){if(!pu.length)return;let r={x:t,y:e,type:n,target:i||null,t:performance.now()},s=pu.slice();for(let o=0;o<s.length;o++)try{s[o](r)}catch(a){ot("input:downobserver","down observer threw",a)}}var fn={pointer:{x:-9999,y:-9999,vx:0,vy:0,speed:0,type:"mouse",down:!1,lastMove:0,inside:!1},init(t){Ml=t,wg=document.getElementById("gl"),cp=document.getElementById("t0"),eS(wg),eS(cp),window.addEventListener("pointermove",iI,{passive:!0}),document.addEventListener("pointerout",aI);let e=()=>{try{We.unlock()}catch(n){ot("input:unlock",n)}};window.addEventListener("pointerdown",e,{capture:!0,passive:!0}),window.addEventListener("touchend",()=>{try{We.resume()}catch{}},{passive:!0}),document.addEventListener("pointerdown",n=>{nS(n.clientX,n.clientY,n.pointerType==="touch"||n.pointerType==="pen"?n.pointerType:"mouse",n.target instanceof Element?n.target:null)},{capture:!0,passive:!0}),window.addEventListener("keydown",n=>{e();let i=n.target;if(!(i&&(i.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(i.tagName||"")))){nS(fn.pointer.x,fn.pointer.y,"key",i instanceof Element?i:null);for(let r=0;r<hu.length;r++)try{hu[r](n)}catch(s){ot("input:keyobserver","key observer threw",s)}}},{capture:!0}),wr.includes(tS)||(wr.unshift(lI),wr.unshift(tS))},push(t){return wr.push(t),()=>{let e=wr.indexOf(t);e>=0&&wr.splice(e,1)}},offerKey(t){for(let e=wr.length-1;e>=0;e--){let n=wr[e];if(typeof n.onKey=="function")try{if(n.onKey(t))return!0}catch(i){ot(`input:${n.name}:key`,"key consumer threw",i)}}return!1},capture(t){ra=t},release(t){(!t||ra===t)&&(ra=null)},observe(t){return bl.push(t),()=>{let e=bl.indexOf(t);e>=0&&bl.splice(e,1)}},observeDown(t){return typeof t!="function"?()=>{}:(pu.push(t),()=>{let e=pu.indexOf(t);e>=0&&pu.splice(e,1)})},observeKeys(t){return hu.push(t),()=>{let e=hu.indexOf(t);e>=0&&hu.splice(e,1)}}};function oS(t,e,n){Mt.enabled=!1;let i=li[n]||li.T2,r=new wf({canvas:t,context:e||void 0,antialias:!!i.msaa,alpha:!0,premultipliedAlpha:!0,depth:!0,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1});r.outputColorSpace=ko,r.toneMapping=Ui,r.setClearColor(0,0),r.info.autoReset=!1,r.autoClear=!0,r.debug.checkShaderErrors=!1;let s=new hs;s.background=null,s.matrixWorldAutoUpdate=!0;let o=new ni(nt.fov,Math.max(1,ve.w)/Math.max(1,ve.h),.01,1e3);o.position.set(0,.75,7.2);let a=i.dprCap,l=0,c=new WeakSet,u=0,h={three:r,scene:s,camera:o,tier:n,dpr:1,stats:{calls:0,triangles:0,points:0,geometries:0,textures:0,frameMs:0,fps:0},setDprDrop(f){u=Math.max(0,f|0),h.resize()},setTier(f){h.tier=f,a=(li[f]||i).dprCap,h.resize()},resize(){let f=typeof devicePixelRatio=="number"&&devicePixelRatio>0?devicePixelRatio:1;h.dpr=Math.max(1,Math.min(f,a)-on.dprStep*u);let g=Math.max(1,ve.w),x=Math.max(1,ve.h);r.setPixelRatio(h.dpr),r.setSize(g,x,!1),o.aspect=g/x,o.updateProjectionMatrix(),ue.uPixelRatio.value=h.dpr,ue.uResolution.value.set(Math.round(g*h.dpr),Math.round(x*h.dpr));for(let p of d)p(h)},pinPrograms(){let f=r.info.programs;if(!(!f||f.length===l)){for(let g=l;g<f.length;g++)f[g].usedTimes++;l=f.length}},warm(f,g,x){r.compile(f,g,x||f),f.traverse(S=>{let w=S.material?Array.isArray(S.material)?S.material:[S.material]:null;if(w)for(let T of w){let y=r.properties.get(T).currentProgram;y&&!c.has(y)&&(c.add(y),y.getUniforms(),y.getAttributes())}}),h.pinPrograms();let p=r.getContext(),m=r.getRenderTarget(),b=r.autoClear,E=g.layers.mask,v=f.parent;try{r.setRenderTarget(h.sceneTarget||null),r.autoClear=!1,r.setScissorTest(!0),r.setScissor(0,0,1,1),g.layers.enableAll(),r.render(f,g)}finally{r.setScissorTest(!1),r.autoClear=b,r.setRenderTarget(m),g.layers.mask=E,v&&f!==x&&f.updateWorldMatrix(!0,!0)}p.finish()},sceneTarget:null,onResize(f){return d.add(f),()=>d.delete(f)},lost:!1},d=new Set;return t.addEventListener("webglcontextlost",f=>{f.preventDefault(),h.lost=!0,pe.stop(),_e.emit("gl:lost",{})},!1),t.addEventListener("webglcontextrestored",()=>{h.lost=!1,h.resize(),_e.emit("gl:restored",{}),pe.start()},!1),_e.on("layout:change",()=>h.resize()),h.resize(),h}var cI=`
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,aS=`
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
}`,lS=`
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
}`;function Eg(){let t=new wn;return t.setAttribute("position",new rn(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),t}function cS(t,e=on.r6.levels){let n=t.three||t,i=Eg(),r=new hs,s=new ps(-1,1,1,-1,0,1),o=(v,S,w)=>new Pt({uniforms:{tSrc:{value:null},uHalf:{value:new ht},uThreshold:{value:on.r6.threshold},tAdd:{value:null},uAddGain:{value:1}},defines:Object.assign(S?{USE_THRESHOLD:""}:{},w?{USE_ADD:""}:{}),vertexShader:cI,fragmentShader:v,depthTest:!1,depthWrite:!1,blending:Ai}),a=o(aS,!0),l=o(aS,!1),c=o(lS,!1,!0),u=o(lS,!1,!1),h=new zt(i,l);h.frustumCulled=!1,r.add(h);let d={type:ri,format:Xn,minFilter:Et,magFilter:Et,depthBuffer:!1},f=[],g=[],x=0,p=0;function m(v,S){b(),x=v,p=S;let w=v,T=S;for(let y=0;y<e;y++){w=Math.max(1,w>>1),T=Math.max(1,T>>1);let A=new Ln(w,T,d);f.push(A)}for(let y=0;y<e;y++){let A=y===0?{width:v,height:S}:f[y-1],P=new Ln(A.width,A.height,d);g.push(P)}}function b(){for(let v of f.concat(g))v.dispose();f.length=0,g.length=0}function E(v,S,w,T,y){h.material=v,v.uniforms.tSrc.value=S,v.uniforms.uHalf.value.set(.5/w,.5/T),n.setRenderTarget(y),n.render(r,s)}return{render(v){if(!f.length)return null;let S=v,w=x,T=p;for(let y=0;y<e;y++)E(y===0?a:l,S,w,T,f[y]),S=f[y].texture,w=f[y].width,T=f[y].height;for(let y=e-1;y>=0;y--){let A=y>0?c:u;y>0&&(A.uniforms.tAdd.value=f[y-1].texture),E(A,S,w,T,g[y]),S=g[y].texture,w=g[y].width,T=g[y].height}return g[0].texture},resize(v,S){(v!==x||S!==p)&&m(Math.max(2,v|0),Math.max(2,S|0))},dispose(){b(),i.dispose(),a.dispose(),l.dispose(),c.dispose(),u.dispose()}}}var Sl=on.r7,uS="void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",hS=`
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
  g *= smoothstep(${Sl.clearInPx.toFixed(1)}, ${Sl.clearOutPx.toFixed(1)}, distance(css, uPointer));
  float aspect = uRes.x / uRes.y;
  vec2 c = (uv * 2.0 - 1.0) * vec2(aspect, 1.0);
  float v = uVig * smoothstep(${Sl.vignetteFrom.toFixed(2)}, 1.0, length(c) / length(vec2(aspect, 1.0)));
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
}`,hp=120;function dS(t){let e=t.three,n=t.scene,i=t.camera,r=new hs,s=new ps(-1,1,1,-1,0,1),o={uRes:{value:new ht(1,1)},uPR:{value:1},uGrain:{value:Sl.grainBoot},uSeed:{value:0},uVig:{value:Sl.vignette},uPointer:{value:new ht(-9999,-9999)},tScene:{value:null},tBloom:{value:null},uBloom:{value:1}},a=new Pt({uniforms:o,vertexShader:uS,fragmentShader:hS,depthTest:!1,depthWrite:!1,transparent:!0,blending:Pd,blendEquation:ms,blendSrc:Ic,blendDst:el,blendSrcAlpha:Ic,blendDstAlpha:el}),l=new Pt({uniforms:o,defines:{USE_SCENE:""},vertexShader:uS,fragmentShader:hS,depthTest:!1,depthWrite:!1,blending:Ai}),c=new zt(Eg(),a);c.frustumCulled=!1,r.add(c);let u=t.tier,h=null,d=null,f=null,g=[],x=!0;function p(){t.sceneTarget=null,h&&(h.dispose(),h=null),d&&(d.dispose(),d=null),f&&(f.dispose(),f=null)}function m(){if(u!=="T3"){p();return}let O=o.uRes.value.x,z=o.uRes.value.y;h?(h.setSize(O,z),d.setSize(Math.max(2,O>>1),Math.max(2,z>>1))):(h=new Ln(O,z,{type:ri,format:Xn,samples:4,depthBuffer:!0,minFilter:Et,magFilter:Et}),d=new Ln(Math.max(2,O>>1),Math.max(2,z>>1),{type:ri,format:Xn,depthBuffer:!0,minFilter:Et,magFilter:Et}),f=cS(t,on.r6.levels)),t.sceneTarget=h,f.resize(d.width,d.height)}function b(){let O=e.getDrawingBufferSize(new ht);o.uRes.value.copy(O),o.uPR.value=t.dpr,m()}t.onResize(b),b();let E=new Float32Array(hp),v=new Float32Array(hp),S=0,w=0,T=-1,y=1<<oi.DEFAULT|1<<oi.NOFOG,A=1<<oi.EMISSIVE,P=!1,F={render(O){if(t.lost)return;P||(o.uSeed.value=Ft.reducedMotion?7:Math.floor(pe.now/(1e3/Sl.grainFps))%997);let z=fn.pointer,L=z.x<-9e3||z.inside===!1||z.type==="touch"&&!z.down;o.uPointer.value.set(L?-9999:z.x,L?-9999:z.y),e.info.reset(),e.autoClear=!1,u==="T3"&&h?(i.layers.mask=y,e.setRenderTarget(h),e.setClearColor(0,0),e.clear(!0,!0,!1),e.render(n,i),t.stats.points=e.info.render.points,i.layers.mask=A,e.setRenderTarget(d),e.clear(!0,!0,!1),ue.uEmissivePass.value=1,e.render(n,i),ue.uEmissivePass.value=0,i.layers.mask=y,o.tBloom.value=f.render(d.texture),o.tScene.value=h.texture,c.material=l,e.setRenderTarget(null),e.render(r,s)):(i.layers.mask=y,e.setRenderTarget(null),e.setClearColor(0,0),e.clear(!0,!0,!1),e.render(n,i),t.stats.points=e.info.render.points,c.material=a,e.render(r,s)),t.pinPrograms();let V=t.stats,D=e.info;V.calls=D.render.calls,V.triangles=D.render.triangles,V.geometries=D.memory.geometries,V.textures=D.memory.textures;let k=pe.now;if(T>=0&&(E[w]=k-T,w=(w+1)%hp,S<hp&&S++,(pe.frame&15)===0&&S>0)){for(let Y=0;Y<S;Y++)v[Y]=E[Y];let Z=v.subarray(0,S);Z.sort(),V.frameMs=Z[S>>1],V.fps=V.frameMs>0?1e3/V.frameMs:0}if(T=k,x){x=!1;let Z=document.getElementById("ff-grain");Z&&Z.parentNode&&Z.parentNode.removeChild(Z);for(let Y of g)try{Y()}catch{}g.length=0}},setGrain(O){o.uGrain.value=Math.max(0,+O||0)},freezeGrain(O){P=!!O},setTier(O){u=O,m()},onFirstFrame(O){if(x)g.push(O);else try{O()}catch{}},get tier(){return u},uniforms:o};return _e.on("tier:change",({tier:O})=>F.setTier(O)),F}var Yr=[0,0,0],wl=null;function Tg(t){for(let e=0;e<$l.length;e++){let n=$l[e];uh(n,t,Yr),ue[Tf(n)].value.setRGB(Yr[0],Yr[1],Yr[2])}}function fS(t){let e="#";for(let n=0;n<3;n++)e+=Math.round(t[n]*255).toString(16).padStart(2,"0").toUpperCase();return e}function uI(t){if(typeof document>"u")return;let e=document.documentElement.style;for(let n=0;n<$l.length;n++){let i=$l[n];if(t<=0){e.removeProperty(Xl[i]),e.removeProperty(Xl[i]+"-rgb");continue}uh(i,t,Yr),e.setProperty(Xl[i],fS(Yr)),e.setProperty(Xl[i]+"-rgb",`${Math.round(Yr[0]*255)},${Math.round(Yr[1]*255)},${Math.round(Yr[2]*255)}`)}}var ao={mode:{night:!1,inverted:0},init(){Tg(ao.mode.inverted)},setNight(t){let e=!!t;if(typeof document<"u"&&(e?document.documentElement.setAttribute("data-night",""):document.documentElement.removeAttribute("data-night")),e===ao.mode.night&&!wl){ue.uNight.value=e?1:0;return}ao.mode.night=e,wl&&wl.cancel();let n=ue.uNight.value,i=e?1:0;wl=Un(ts.mixMs,r=>{ue.uNight.value=n+(i-n)*r}),wl.done.then(()=>{wl=null})},setInverted(t){let e=Math.max(0,Math.min(1,+t||0));ao.mode.inverted=e,ue.uInvert.value=e,Tg(e),uI(e),typeof document<"u"&&(e>=.5?document.documentElement.setAttribute("data-inverted",""):document.documentElement.removeAttribute("data-inverted"))},color(t){return(ue[Tf(t)]||ue.cSilver).value},hex(t){return ba[t]?fS(uh(t,ao.mode.inverted,Yr)):ba.silver}};Tg(0);var vu=on.r5,vS=vu.elevationDeg*Math.PI/180,hI=Math.cos(vS),dI=Math.sin(vS),Rg=Math.PI*2,dp=new C(0,0,0),Cg=Bt.radius,pS=new C,gu=!1,Al=Math.PI*.75,Pg=-.7,Ig=.7,Lg=0,Dg=0,fp=new C,pp=new C,sa=1,Ng="",mS=new C,gS=new C,xu=new C,xS=new C,Vi={position:ue.uLamp.value,mode:"sweep",ctx:null,init(t){return Vi.ctx=t,Vi.setFocus(dp.set(0,0,0),Bt.radius),Vi},setFocus(t,e){dp.copy(t),Cg=e??Cg},hold(t){t?(pS.copy(t),gu||(fp.copy(Vi.position),sa=0),gu=!0):gu&&(gu=!1,fp.copy(Vi.position),sa=0)},sweepOnce(t){Dg=Math.max(200,t||1200),Lg=pe.now+Dg},update(t){let e=Re.camera;if(!e)return;let n=fn.pointer,i=n.type==="touch"||ve.isPhone,r;pe.now<Lg?r="sweep":i?r=n.down?"finger":"sweep":r=n.inside!==!1&&n.x>-9e3&&pe.now-n.lastMove<vu.idleMs?"pointer":"sweep",r!==Ng&&(Ng&&(fp.copy(Vi.position),sa=0),r==="sweep"&&(Al=Math.atan2(Ig,Pg)),Ng=r),Vi.mode=r,mS.setFromMatrixColumn(e.matrixWorld,0),gS.setFromMatrixColumn(e.matrixWorld,1),xu.copy(e.position).sub(dp),xu.lengthSq()<1e-12?xu.setFromMatrixColumn(e.matrixWorld,2):xu.normalize();let s,o;if(r==="sweep"){let l=pe.now<Lg?Dg:vu.sweepMs;Al+=Rg*t*1e3/l,Al>Rg&&(Al-=Rg),s=Math.cos(Al),o=Math.sin(Al)}else{let l=n.x/Math.max(1,ve.w)*2-1,c=-(n.y/Math.max(1,ve.h))*2+1,u=Math.hypot(l,c);u>1e-4&&(Pg=l/u,Ig=c/u),s=Pg,o=Ig}xS.copy(mS).multiplyScalar(s).addScaledVector(gS,o).normalize();let a=vu.radiusFactor*Cg;pp.copy(dp).addScaledVector(xS,a*hI).addScaledVector(xu,a*dI),gu&&pp.copy(pS),sa<1?(sa=Math.min(1,sa+t*1e3/vu.blendMs),Vi.position.copy(fp).lerp(pp,cn.reveal(sa))):Vi.position.copy(pp)}};var El=Math.PI*2,fI=bn.irisBladeDeg*Math.PI/180;function yS(t,e,n,i){for(let r=0;r<e;r++){let s=El*r/e-Math.PI/e,o=s+El/e;t.push(Math.sin(s)*n,i,Math.cos(s)*n,Math.sin(o)*n,i,Math.cos(o)*n)}}var pI=t=>At(t/1e3)*1e3;function _S(t,e){let n=bn.irisBlades*2+28,i=new Float32Array(n*6),r=zi({segments:i,color:"silver",alpha:.42,far:e}),s=bn.irisR,o=0;function a(l){let c=0,u=(h,d,f,g)=>{i[c++]=h,i[c++]=t,i[c++]=d,i[c++]=f,i[c++]=t,i[c++]=g};for(let h=0;h<bn.irisBlades;h++){let d=El*h/bn.irisBlades,f=El*(h+1)/bn.irisBlades,g=s*(.06+.94*l),x=d+Math.PI/bn.irisBlades+fI*(1-l),p=Math.sin(x)*g,m=Math.cos(x)*g;u(Math.sin(d)*s,Math.cos(d)*s,p,m),u(p,m,Math.sin(f)*s,Math.cos(f)*s)}for(let h=0;h<28;h++){let d=El*h/28,f=El*(h+1)/28;u(Math.sin(d)*s,Math.cos(d)*s,Math.sin(f)*s,Math.cos(f)*s)}r.setSegments(i)}return a(0),{object:r.mesh,lines:r,get open(){return o},set(l){let c=Math.max(0,Math.min(1,l));c!==o&&(o=c,a(c))}}}function bS(t){let e=he[t]||he.CORE,n=e.n,i=new nn;i.name=`shell:${e.id}`;let r=e.floor-e.alt,s=e.ceil-e.alt,o=e.id==="CORE",a=e.far,l=[];for(let[m,b]of[[r,e.floor],[s,e.ceil]]){let E=o?300:pI(b);for(let v=bn.ringStep;v<E-1;v+=bn.ringStep)yS(l,n,v,m)}let c=zi({segments:new Float32Array(l.length?l:[0,0,0,0,0,0]),color:"steel",alpha:l.length?1:0,far:a,flatten:!0});c.mesh.name="rings",i.add(c.mesh);let u=null;if(!o){let m=[],b=[];for(let E=bn.deckRingStep;E<=bn.deckR+1e-6;E+=bn.deckRingStep){yS(m,n,E,0);for(let v=0;v<n;v++)b.push(1-.75*(E/bn.deckR))}u=zi({segments:new Float32Array(m),alpha:new Float32Array(b),color:"steel",far:a,flatten:!0}),u.mesh.name="deck",i.add(u.mesh)}let h=_S(s,a),d=_S(r,a);i.add(h.object,d.object);let f=1,g=!0,x={rings:l.length?1:0,deck:1,iris:.42};return{group:i,rings:c,deck:u,irisTop:h,irisBottom:d,setDeckVisible(m){g=!!m,u&&(u.mesh.visible=g&&f>0)},setIris(m,b){(m==="top"?h:d).set(b)},setFlatten(m,b){c.setFlatten(m,b),u&&u.setFlatten(m,b)},setAlpha(m){f=Math.max(0,Math.min(1,m)),c.setAlpha(x.rings*f),u&&(u.setAlpha(x.deck*f),u.mesh.visible=g&&f>0),h.lines.setAlpha(x.iris*f),d.lines.setAlpha(x.iris*f)},dispose(){c.dispose(),u&&u.dispose(),h.lines.dispose(),d.lines.dispose(),i.parent&&i.parent.remove(i)}}}var mI=`
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
}`,gI=`
${Bi}
${_s}
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
  col = mix(col, cWhite, clamp(max(uImpact, fxWaveBright(vW)), 0.0, 1.0));   // H4: ПРОСВЕТ / ВОЛНА axis beads
  col = applyFog(col, length(vW - cameraPosition));
  gl_FragColor = vec4(col, uAlpha);
}`;function MS(){let t=new nn;t.name="axisPillar";let e=12,n=[],i=1200,r=50;for(let f=-i;f<i;f+=r){let g=f,x=Math.min(i,f+r);x<=-e||g>=e?n.push(0,g,0,0,x,0):(g<-e&&n.push(0,g,0,0,-e,0),x>e&&n.push(0,e,0,0,x,0))}let s=zi({segments:new Float32Array(n),color:"ember",width:2,alpha:.5,glint:.4,far:4e3});s.mesh.name="pillarRibbon",t.add(s.mesh);let o=new Ec(bn.beadR,0),a=new Pt({uniforms:{uColor:ai("silver"),uBase:ai("obsidian"),cWhite:ue.cWhite,uLamp:ue.uLamp,uAlpha:{value:1},uFlash:{value:0},cAbyss:ue.cAbyss,uFogDensity:ue.uFogDensity,...bs()},vertexShader:mI,fragmentShader:gI}),l=new yc(o,a,bn.beadCount);l.name="pillarBeads";let c=new Ct,u=new Qi,h=new C,d=new C;for(let f=0;f<bn.beadCount;f++){let g=-i+bn.beadStep*f;h.set(0,g,0),d.setScalar(Math.abs(g)<e?0:1),l.setMatrixAt(f,c.compose(h,u,d))}return l.instanceMatrix.needsUpdate=!0,l.frustumCulled=!1,t.add(l),t.userData.ribbon=s,t.userData.beads=l,t.userData.uniforms={ribbon:s.uniforms,beads:a.uniforms},t}var yu=new Cc,_u=[];var R4=new C;function SS(t,e,n,i){if(!Re.camera||!n||!n.length)return null;Re.ray(t,e,yu.ray),yu.near=Re.camera.near,yu.far=Re.camera.far,yu.layers.mask=4294967295,_u.length=0,yu.intersectObjects(n,!0,_u);let r=null;for(let s=0;s<_u.length;s++){let o=_u[s];if(xI(o.object)){r=o;break}}return _u.length=0,r?i?(Object.assign(i,r),i):r:null}function xI(t){for(let e=t;e;e=e.parent)if(!e.visible)return!1;return!0}var As=Math.PI/180,ui=Math.PI*2,vI=137.508*As;function yI(t){let e=Wt[t],n=Bt.sign.heightFrac*e.height;Xt.draw(`sign:${t}`,{height:(i,r,s)=>wS(i,r,s,t,n,!1),inlay:(i,r,s)=>wS(i,r,s,t,n,!0)})}function wS(t,e,n,i,r,s){t.fillStyle="#fff",t.strokeStyle="#fff";let o=e/r;if(Yl[i]==="•"){let g=(Bt.apertureD/2+.0045)*o,x=Bt.ringEngraveW*o;t.beginPath(),s?(t.lineWidth=1,t.arc(e/2,n/2,g-x/2,0,ui),t.stroke(),t.beginPath(),t.arc(e/2,n/2,g+x/2,0,ui),t.stroke()):(t.lineWidth=Math.max(1.5,x),t.arc(e/2,n/2,g,0,ui),t.stroke());return}let l=(i===0||i===6?.5:.9)*n,c=n/2+(i===0?.17*n:i===6?.02*n:0);t.font=Cr.sign.replace("{px}",String(Math.round(l*1.38))),t.textAlign="center",t.textBaseline="alphabetic";let u=t.measureText(Yl[i]),h=u.actualBoundingBoxAscent||l,d=u.actualBoundingBoxDescent||0,f=c+(h-d)/2;s?(t.lineWidth=1,t.strokeText(Yl[i],e/2,f)):t.fillText(Yl[i],e/2,f)}function _I(){Xt.draw("ticks",{height:(t,e,n)=>{t.fillStyle="#fff";for(let i=0;i<Bt.ticksPerFace;i++)t.fillRect((i+.5)/Bt.ticksPerFace*e-1,0,2,n*.9)},inlay:(t,e,n)=>{t.fillStyle="#fff";for(let i=0;i<Bt.ticksPerFace;i++)t.fillRect(Math.round((i+.5)/Bt.ticksPerFace*e),0,1,n*.9)}})}function AS(){Xt.texture||Xt.init(pt.tier);for(let t=0;t<7;t++)yI(t);_I();for(let t=0;t<7;t++)bu[t]&&Fg(t,bu[t])}var bu=["","","","","","",""];function ES(t,e,n,i,r){t.fillStyle="#fff",t.strokeStyle="#fff";let s=Math.round(n*.86);t.font=Cr.sign.replace("{px}",String(s));let o=t.measureText(i).width;o>e*.98&&(s=Math.max(6,Math.floor(s*(e*.98)/o)),t.font=Cr.sign.replace("{px}",String(s))),t.textAlign="center",t.textBaseline="middle",r?(t.lineWidth=1,t.strokeText(i,e/2,n/2)):t.fillText(i,e/2,n/2)}function Fg(t,e){Xt.draw(`code:${t}`,{height:(n,i,r)=>ES(n,i,r,e,!1),inlay:(n,i,r)=>ES(n,i,r,e,!0)})}var bI="void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",MI=`
uniform vec3 uColor; uniform vec3 cElectrum; uniform vec3 cWhite; uniform float uNight, uI, uFlash, uEmissivePass, uGlowVis;
void main() {
  vec3 c = mix(uColor, cElectrum, uNight);
  float k = uI * mix(1.0, ${ts.nucleusIntensity.toFixed(2)}, uNight);
  k *= mix(1.0, uGlowVis, uEmissivePass);      // T3 bloom source obeys the SPEC visibility rule like the T1/T2 sprite
  gl_FragColor = vec4(mix(c * k, cWhite, uFlash), 1.0);
}`;function Og(t,e){let n=Wt[t],i=n.top+(n.bot-n.top)/3,r=n.top+(n.bot-n.top)*2/3,s=(At(i)+At(r))/2;return e.set(0,n.mid,s*Math.cos(Math.PI/n.n))}var TS=()=>({dy:0,slide:0,yaw:0,pitch:0,scaleR:1,scaleY:1,alpha:1,edgeFlash:0});function RS(t){AS(),vl().then(AS);let e=new nn;e.name="key";let n=Zc({perStratum:!0,vertices:!0,far:700});e.add(n.group);let i=n.strata,r=new Pt({uniforms:{uColor:{value:ue.cEmber.value},cElectrum:ue.cElectrum,cWhite:ue.cWhite,uNight:ue.uNight,uI:{value:1},uFlash:{value:0},uEmissivePass:ue.uEmissivePass,uGlowVis:{value:1}},vertexShader:bI,fragmentShader:MI}),s=new zt(new Bo(Wn.r,Wn.detail),r);s.name="nucleus",s.userData.stratum=3;let o=Ff({color:"ember",radius:Wn.glowR,intensity:1,core:s,depthTest:!1,night:!0,nightIntensity:ts.nucleusIntensity,fog:!1,renderOrder:6});e.add(o.object);let a=zi({segments:new Float32Array([0,-Ki.half,0,0,Ki.half,0]),color:"ember",width:Ki.widthPx,alpha:Ki.alphaInside,glint:.3}),l=8,c=new Float32Array(l*2*6),u=new Float32Array(l*2),h=zi({segments:c,alpha:u,color:"ember",width:Ki.widthPx,glint:.3});for(let R of[a,h])R.mesh.layers.enable(oi.EMISSIVE),R.mesh.renderOrder=4,e.add(R.mesh);let d=-1;function f(R){if(R!==d){d=R;for(let H=0;H<2;H++){let ae=H?-1:1;for(let be=0;be<l;be++){let Ve=Ki.half+R*be/l,N=Ki.half+R*(be+1)/l,ye=(H*l+be)*6;c[ye]=0,c[ye+1]=ae*Ve,c[ye+2]=0,c[ye+3]=0,c[ye+4]=ae*N,c[ye+5]=0,u[H*l+be]=Ki.alphaInside*(1-(be+.5)/l)}}h.setSegments(c),h.mesh.geometry.attributes.aAl.needsUpdate=!0,h.mesh.visible=R>0}}f(Ki.extend);let g=48,x=new Float32Array(g*6),p=Og(3,new C).z+.002;for(let R=0;R<g;R++){let H=R/g*ui,ae=(R+1)/g*ui,be=R*6;x.set([Math.cos(H)*Wn.breathRingR,Math.sin(H)*Wn.breathRingR,p,Math.cos(ae)*Wn.breathRingR,Math.sin(ae)*Wn.breathRingR,p],be)}let m=zi({segments:x,color:"ember",width:1,alpha:.8,glint:0});m.mesh.visible=!1,i[3].add(m.mesh);let b=Vf({scale:1});b.setCount(W.litNodes),i[3].add(b.object);let E=li.T3.grains,v=new Float32Array(E*3),S=new Float32Array(E),w=[0];for(let R=1;R<7;R++)w.push((Wt[R-1].bot+Wt[R].top)/2);let T=2654435769,y=()=>{T=T+1831565813|0;let R=T;return R=Math.imul(R^R>>>15,R|1),R^=R+Math.imul(R^R>>>7,R|61),((R^R>>>14)>>>0)/4294967296};for(let R=0;R<E;R++){let H=w[R%7],be=Math.max(.12,At(H))*Vt(Sa.annulus[0],Sa.annulus[1],Math.sqrt(y())),Ve=y()*ui;v[R*3]=Math.sin(Ve)*be,v[R*3+1]=H+(y()-.5)*2*Sa.jitter,v[R*3+2]=Math.cos(Ve)*be,S[R]=Vt(Sa.sizePx[0],Sa.sizePx[1],y())}let A=io({positions:v,sizes:S,sizePx:1,color:"silver",alpha:.35,count:(pt.params||li.T2).grains});A.object.name="grains",e.add(A.object);let P={count:(pt.params||li.T2).grains,mode:"rings",setMode(R){P.mode=R},setPlate(){},writeTargets(){},commitTargets(){},flyToTargets(){},shiver(){},scatter(){}};_e.on("tier:change",({tier:R})=>{let H=li[R];H&&(P.count=Math.min(E,H.grains),A.setCount(P.count))});let F=()=>{J.satellites=Math.min(7,W.data&&W.data.drawings?W.data.drawings.length:0)};F(),_e.on("drawing:saved",F);let O=R=>R<=0?1:-Math.log(R)/Math.sqrt(Math.PI*Math.PI+Math.log(R)**2),z=[];for(let R=0;R<7;R++)z.push(new ir(22,O(.04),0));let L=new Float32Array(7),V=new Int32Array(7),D=[],k=[];for(let R=0;R<7;R++)D.push(null),k.push(TS());let Z=null,Y=1,Q={scale:1,nucleus:1,gap:-1},se=new ir(6,1,Dt.rest),Le=new ir(6,1,0),Oe=new ir(6,.8,0),mt=!1,$e=!0,rt=1,j={on:!0,base:1,pulse:1,flashUntil:0,flashToken:null,oneFrameFlash:0},ne={t0:-1,amp:0},Ee={t0:-1,amp:0,hz:0,decay:1,ms:0},et={t0:-1},Ae=0,le=ue.cEmber.value,ge=new C,De=new C,Ye=new C,vt=new C,Te={x:0,y:0,depth:0,visible:!1},Ce={x:0,y:0,depth:0,visible:!1},st=new C,Jt=n.solids.concat([s]),jt=Math.cos(Wn.apertureAlignDeg[0]*As),Zt=Math.cos(Wn.apertureAlignDeg[1]*As);function U(){for(let R=0;R<7;R++)Object.assign(k[R],TS());Q.scale=1,Q.nucleus=1,Q.gap=-1}function Tn(R,H){Ae=H;for(let ce=0;ce<7;ce++){let re=z[ce];if(L[ce]!==0){re.x+=L[ce]*R,re.v=0,re.target=re.x,L[ce]*=Math.pow(bi.spinDecay,R*1e3/bi.frameMs);let Ie=ui/Wt[ce].n,ze=Math.floor(re.x/Ie);ze!==V[ce]&&(V[ce]=ze,We.play("tick",{})),Math.abs(L[ce])<.35&&(L[ce]=0,re.omega=6,re.zeta=1,re.target=Math.round(re.x/ui)*ui)}re.step(R)}se.step(R),Le.step(R),Oe.step(R);let ae=se.x;if(mt&&(ae+=Cn.mix(Dt.rest,Dt.breath)-Dt.rest),Q.gap>=0&&(ae=Q.gap),Z&&Z.gap!=null&&(ae=Vt(ae,Z.gap,Y)),bt=ae,ue.uGap.value=ae,_>=0&&!Ne()){let ce=_;_=-1;for(let re=0;re<7;re++)Me[re]&&(Me[re]=0,Fg(re,bu[re]))}{let ce=Math.atan2(Math.sin(Le.x),Math.cos(Le.x));Math.abs(Math.abs(ce)-Math.PI)<=35*As?G<0&&(G=H):G=-1}let be=0;for(let ce=0;ce<7;ce++){let re=k[ce],Ie=D[ce],ze=Ie?Y:0,Qt=(3-ce)*(ae-Dt.rest)+re.dy+(Ie&&Ie.dy?Ie.dy*ze:0),It=re.slide+(Ie&&Ie.slide?Ie.slide*ze:0),Kn=z[ce].x+re.yaw+(Ie&&Ie.yaw?Ie.yaw*ze:0);if(Ee.t0>=0){let Wl=H-Ee.t0;Wl>Ee.ms?Ee.t0=-1:Kn+=Ee.amp*Math.sin(ui*Ee.hz*Wl/1e3+ce*.9)*Math.exp(-Wl/Ee.decay)}let ji=re.pitch+(Ie&&Ie.pitch?Ie.pitch*ze:0),nh=re.scaleR*(Ie&&Ie.scaleR!=null?Vt(1,Ie.scaleR,ze):1),nm=re.scaleY*(Ie&&Ie.scaleY!=null?Vt(1,Ie.scaleY,ze):1),ih=re.alpha*(Ie&&Ie.alpha!=null?Vt(1,Ie.alpha,ze):1);be=Math.max(be,re.edgeFlash+(Ie&&Ie.edgeFlash?Ie.edgeFlash*ze:0));let So=i[ce];So.position.set(Math.sin(Kn)*It,Qt,Math.cos(Kn)*It),So.rotation.set(ji,Kn,0,"YXZ"),So.scale.set(nh,nm,nh),n.setStratumFade(ce,ih)}I>0&&(I--,be=Math.max(be,1/.6));for(let ce=0;ce<n.edges.length;ce++)n.edges[ce].uniforms.uFlash.value=Math.min(1,be*.6);let Ve=Q.scale*(Z&&Z.scale!=null?Vt(1,Z.scale,Y):1);e.scale.setScalar(Ve);let N=Oe.x+(Z&&Z.pitch?Z.pitch*Y:0);if(et.t0>=0){let ce=H-et.t0;ce>600?et.t0=-1:N+=8*As*Math.sin(Math.PI*ce/600)}e.rotation.set(N,Le.x+(Z&&Z.yaw?Z.yaw*Y:0),Z&&Z.roll?Z.roll*Y:0,"YXZ");let ye=0;if(ne.t0>=0){let ce=H-ne.t0;ce>we.shudder?ne.t0=-1:ye=Math.sin(ui*3*ce/we.shudder)*ne.amp*(1-ce/we.shudder)}e.position.set(ye,0,Z&&Z.dz?Z.dz*Y:0),e.updateWorldMatrix(!0,!0),st.setFromMatrixPosition(e.matrixWorld);let te=j.on?(mt?Cn.mix(Wn.intensity[0],Wn.intensity[1]):1)*j.pulse*Q.nucleus:0;q!=null&&(te=q),j.flashUntil&&H>j.flashUntil&&(j.flashUntil=0,le=ue.cEmber.value,o.setColor("ember")),r.uniforms.uColor.value=le,r.uniforms.uI.value=te,r.uniforms.uFlash.value=j.oneFrameFlash>0?1:0,o.setFlash(r.uniforms.uFlash.value),j.oneFrameFlash>0&&j.oneFrameFlash--;let Se=Wn.minVisibility;if(Re.camera&&(Ye.set(0,0,1).transformDirection(i[3].matrixWorld),ge.copy(Re.camera.position).sub(st).normalize(),Se=Math.max(Se,qo(jt,Zt,ge.dot(Ye)),qo(Wn.gapOpen[0],Wn.gapOpen[1],ae))),o.setIntensity(te*Se*rt),r.uniforms.uGlowVis.value=Se*rt,m.mesh.visible){let ce=Cn.mix(0,1);m.mesh.scale.setScalar(1+.04*ce),m.setAlpha(.55+.35*ce)}}let bt=Dt.rest,I=0,_=-1,G=-1,q=null,ee=null,Me=new Uint8Array(7),Ne=()=>{try{return!!(t&&t.fx&&t.fx.impact&&t.fx.impact.inPause())}catch{return!1}},ie=new C,oe=new C,Pe={group:e,structure:n,radius:Bt.radius,nucleusWorld:st,grains:P,nucleus:s,glow:o,litNodes:b,faceFrame(R,H){return Og(R,vt),H.F.copy(vt).applyMatrix4(i[R].matrixWorld),H.n.set(0,0,1).transformDirection(i[R].matrixWorld),H},stratumMatrix(R,H){return H.copy(i[R].matrixWorld)},pick(R,H){let ae=SS(R,H,Jt);return ae&&ae.object&&ae.object.userData.stratum!=null?ae.object.userData.stratum:-1},screenInfo(R){let H=Re.camera;if(Re.project(st,Te),R.x=Te.x,R.y=Te.y,!H)return R.r=R.rx=R.ry=0,R;let ae=e.scale.x;return ge.setFromMatrixColumn(H.matrixWorld,0),De.copy(st).addScaledVector(ge,Bt.radius*ae),Re.project(De,Ce),R.r=Math.abs(Ce.x-Te.x),De.copy(st).addScaledVector(ge,.62*ae),Re.project(De,Ce),R.rx=Math.abs(Ce.x-Te.x),ge.setFromMatrixColumn(H.matrixWorld,1),De.copy(st).addScaledVector(ge,1.2*ae),Re.project(De,Ce),R.ry=Math.abs(Ce.y-Te.y),R},stratumScreenY(R){return ge.set(0,Wt[R].mid,0).applyMatrix4(i[R].matrixWorld),Re.project(ge,Te).y},update:Tn,onGesture(R){if(!$e||!R||R.type!=="tap")return!1;let H=Pe.pick(R.x,R.y);return H<0?!1:(_e.emit("key:click",{index:H,x:R.x,y:R.y}),!0)},setInteractive(R){$e=!!R},setIdle(R){mt=!!R},setReveal(R){if(!R)return;rt=R.fill!=null?Tt(R.fill):1,n.setParts({vertices:R.points!=null?Tt(R.points):1,solid:rt,edges:1,lattice:rt}),n.setFade(R.alpha!=null?Tt(R.alpha):1);for(let ae=0;ae<n.edges.length;ae++)n.edges[ae].uniforms.uFlash.value=R.scanY!=null?.35:0;let H=R.alpha==null||R.alpha>0;a.mesh.visible=H,h.mesh.visible=H&&d>0,m.mesh.visible=H&&Ze,b.object.visible=(R.alpha==null||R.alpha>0)&&b.count>0,A.setAlpha(.35*(R.alpha!=null?Tt(R.alpha):1))},setScramble(R){for(let H=0;H<7;H++){let ae=0;R==="golden"?ae=H*vI:R==="random"?ae=(y()-.5)*ui:Array.isArray(R)&&(ae=+R[H]||0),ae=Math.atan2(Math.sin(ae),Math.cos(ae)),L[H]=0,z[H].snap(ae)}},lockSequence(R={}){let H=R.order==="up"?[6,5,4,3,2,1,0]:[0,1,2,3,4,5,6],ae=R.stepMs!=null?R.stepMs:we.lockStep;if(R.spin)for(let be of H)Math.abs(z[be].x)>.01&&(L[be]=3);return new Promise(be=>{H.forEach((Ve,N)=>it(N*ae,()=>{if(Pe.alignStratum(Ve,{spring:"light",overshoot:R.snap!=null?R.snap:bi.snapOvershoot}),We.play("ratchet",{i:Ve}),R.onLock)try{R.onLock(Ve)}catch{}N===H.length-1&&it(320,be)}))})},alignStratum(R,H={}){let ae=z[R];L[R]=0,ae.omega=H.spring==="heavy"?6:22,ae.zeta=O(H.overshoot!=null?H.overshoot:0),ae.target=Math.round(ae.x/ui)*ui},spinStratum(R,H){L[R]=H,V[R]=Math.floor(z[R].x/(ui/Wt[R].n))},ignite(R={}){j.on=!0,j.oneFrameFlash=R.flash===!1?0:1,le=R.color==="electrum"?ue.cElectrum.value:ue.cEmber.value,o.setColor(R.color==="electrum"?"electrum":"ember")},douse(){j.on=!1},shootAxis(R=Ki.extend,H=Ki.shootMs){return Un(H,be=>f(R*be),cn.reveal).done},setBreathingRing(R){Ze=!!R,m.mesh.visible=Ze},setMorph(R,H,ae,be){if(U(),R==="dive"){let Ve=be>1600?1.375:1,N=ae/Ve,ye=Tt(N/120),te=cn.camera(Tt((N-120)/360));Q.scale=N<120?1-Bt.contract*cn.camera(ye):1-Bt.contract*(1-qo(120,480,N)),Q.nucleus=1+(Bt.nucleusAnticipation-1)*(N<120?ye:1-qo(120,480,N)),Q.gap=Vt(Dt.rest,Dt.dive,te);for(let Se=0;Se<7;Se++){let ce=k[Se];Se===H?(ce.slide=Bt.diveSlide*te,ce.yaw=-z[Se].x*te,ce.edgeFlash=N<120?ye:1-qo(480,900,N)):(ce.yaw=(Se<H?-1:1)*Bt.diveTurnAwayDeg*As*te,ce.alpha=1-qo(480*Ve,1e3*Ve,ae))}}else if(R==="recall"){let Ve=we.recallSwapAt*be/we.recall,N=ae-Ve;if(N<0){Q.gap=Dt.recallStart;return}let ye=Tt(N/(be-Ve||200));Q.gap=Dt.rest+(Dt.recallStart-Dt.rest)*(1-cn.camera(ye))-(Dt.recallStart-Dt.rest)*bi.settleOvershoot*Math.sin(Math.PI*ye);for(let te=0;te<7;te++)N<we.recallRatchetMs*(te+1)&&(k[te].yaw=(te%2?-1:1)*6*As)}else Q.gap<0&&bt!==se.x&&(se.snap(bt),se.target=Dt.rest)},override(R,H){R>=0&&R<7&&(D[R]=H||null)},overrideGroup(R){Z=R||null},setOverrideWeight(R){Y=Tt(R)},onRebase(R){U();for(let H=0;H<7;H++)L[H]=0,z[H].snap(0);se.snap(R==="shrink"?Dt.recallStart:Dt.rest),se.omega=4,se.target=Dt.rest},shudder(R=6){Ft.reducedMotion&&(R=Math.min(R,2));let H=Re.camera?Re.camera.position.distanceTo(st):7.2;ne.amp=R*H/Math.max(1,ue.uPxPerUnit.value),ne.t0=Ae},addYaw(R){Le.x+=R},wobble(R,H,ae,be){Ft.reducedMotion||Object.assign(Ee,{t0:Ae,amp:R,hz:H,decay:Math.max(1,ae),ms:be})},bow(){return et.t0=Ae,Le.target=0,new Promise(R=>it(600,R))},nudgePitch(R){Oe.x+=R*As},flashNucleus(R,H){le=R==="white"?ue.cWhite.value:ue.cElectrum.value,o.setColor(R==="white"?"white":"electrum"),j.flashUntil=Ae+Math.max(16,H||0)},setNucleusPulse(R){j.pulse=R>0?R:1},flashEdges(R,H="white",ae=1){I=Math.max(I,Math.max(1,ae|0))},setLaw(R,H,ae){if(!(R>=0&&R<7))return;let be=String(H??"");be!==bu[R]&&(bu[R]=be,Ne()?(Me[R]=1,_=R):Fg(R,be)),ue.uCut.value[R]=Tt(+ae||0)},yawTo(R,H){ee&&ee.cancel();let ae=Le.x,be=(R||0)*As,Ve=Math.max(0,H||0);return Ve<=0?(Le.snap(be),Le.target=be,Promise.resolve()):(ee=Un(Ve,N=>{Le.x=ae+(be-ae)*N,Le.v=0,Le.target=Le.x},cn.camera),ee.done)},backFaceFrame(R,H){let ae=Wt[R];if(!ae)return H;let be=Math.floor(ae.n/2),Ve=ui*be/ae.n;Og(R,ie);let N=ie.z;return ie.set(Math.sin(Ve)*N,ie.y,Math.cos(Ve)*N).applyMatrix4(i[R].matrixWorld),oe.set(Math.sin(Ve),0,Math.cos(Ve)).transformDirection(i[R].matrixWorld),H.F.copy(ie),H.n.copy(oe),H},isShowingBack(){return G>=0&&Ae-G>=240},setScrambleQuant(R,H){},setNucleus(R){q=R==null?null:Tt(+R||0)},strike(R){},bowTo(R,H){return Pe.bow()}};P.markSaved=(R,H)=>{},P.spiral=R=>{};let Ze=!1;return Pe.setReveal({points:0,scanY:null,fill:0,alpha:0}),Pe.douse(),f(0),_e.on("night:change",({night:R})=>b.setNight(R)),J.night&&b.setNight(!0),Pe}var SI=["S01","S02","S03","S04","S05","S06","S07","S08","S09","S10","S11","S12","S13","S14"],CS=new Map;function kt(t,e){typeof t=="string"&&t&&typeof e=="function"&&CS.set(t,e)}kt("fx",()=>({stage:null,queue:[],impacts:[],prosvet:[],waveArrivalMs:null,timeScale:pe.timeScale,dust:{pool:0,live:0}}));kt("scaleBar",()=>null);kt("figure",()=>null);kt("deeds",()=>[]);kt("code",()=>[]);kt("show",()=>null);kt("guests",()=>0);kt("sbor",()=>null);kt("proposals",()=>0);kt("lost",()=>null);kt("rim",()=>[]);kt("boot",()=>null);kt("resonance",()=>null);function PS(t){kt("audio",()=>{let i=[];try{i=t.fx&&t.fx.cue&&typeof t.fx.cue.log=="function"?t.fx.cue.log():[]}catch{i=[]}return{...We.fx.snapshot(),cueLog:i}});let e=()=>{if(t.secrets&&typeof t.secrets.found=="function")return t.secrets.found();let i=W.data&&W.data.found||{};return SI.filter(r=>!!i[r])},n=Object.freeze({version:1,state(){let i=t.renderer,r=W.data||{},s=i?i.stats:null,o={route:J.route.hash,room:J.room,phase:J.phase,tier:J.tier,u:J.u,soundOn:J.soundOn,night:J.night,owner:J.owner,inverted:J.inverted,secrets:e(),shards:r.shards|0,nadirOpen:!!r.nadirOpen,pullNest:J.pullNest,resonancePct:J.resonancePct,status:J.status,columns:J.columns.slice(),satellites:J.satellites,companion:J.companion,whaleSeen:!!r.whaleSeen,_stats:s?{calls:s.calls,triangles:s.triangles,dpr:i.dpr,texMB:U_(),geometries:s.geometries,points:s.points,frameMs:s.frameMs,fps:s.fps,tier:J.tier,labels:t.overlay?t.overlay.visibleCount|0:0}:null,_travel:t.director&&t.director.lastTravel?{...t.director.lastTravel}:null,_world:{source:Vv,issues:Gv.length}};return CS.forEach((a,l)=>{try{o[l]=a()}catch(c){o[l]=null,ot(`hook:${l}`,"test-hook field threw",c)}}),o},go(i){let r=String(i);location.hash===r?t.director&&t.director.go(r,{source:"go"}):location.hash=r}});try{Object.defineProperty(window,"__SAMVIN__",{value:n,writable:!1,configurable:!1,enumerable:!1})}catch{}return n}var mp=38,Ug=-100,qn=1024,Gi=256,IS=`
varying vec2 vUv; varying float vDist;
void main() { vUv = uv; vec4 v = modelViewMatrix * vec4(position, 1.0); vDist = length(v.xyz); gl_Position = projectionMatrix * v; }`,LS=`
${Bi}
uniform sampler2D uTex; uniform vec3 cSilver; uniform float uAlpha;
varying vec2 vUv; varying float vDist;
void main() {
  float a = texture2D(uTex, vUv).a * uAlpha;
  if (a <= 0.003) discard;
  gl_FragColor = vec4(applyFog(cSilver, vDist), a);
}`;function DS(t){let e=new nn;e.name="rim";let n=dr(ft.operator.name||""),i=-bn.coreRimR*Math.cos(Math.PI/12)+.5,r=document.createElement("canvas");r.width=qn,r.height=Gi;let s=new Ur(r);s.minFilter=Et,s.magFilter=Et,s.generateMipmaps=!1,s.wrapS=s.wrapT=ii,Yo(s,qn*Gi*4);let o=.5,a=[],l=1,c=[.5],u="   ";function h(){let L=r.getContext("2d");if(L.clearRect(0,0,qn,Gi),L.fillStyle="#fff",L.textAlign="center",L.textBaseline="middle",!a.length)l=1,L.font=Cr.burn.replace("{px}",String(Math.round(Gi*.78))),L.fillText(n,qn/2,Gi/2+Gi*.04),o=Math.min(1,L.measureText(n).width/qn),c.length=1,c[0]=.5;else{let V=[n].concat(a),D=V.join(u);L.font=Cr.burn.replace("{px}",String(Math.round(Gi*.78)));let k=L.measureText(D).width;l=Math.min(1,qn*.98/Math.max(1,k)),L.font=Cr.burn.replace("{px}",String(Math.max(8,Math.round(Gi*.78*l))));let Z=L.measureText(D).width,Y=L.measureText(u).width,Q=qn/2-Z/2;L.textAlign="left",c.length=0;for(let se of V){let Le=L.measureText(se).width;L.fillText(se,Q,Gi/2+Gi*.04),c.push((Q+Le/2)/qn),Q+=Le+Y}o=Math.min(1,Z/qn)}s.needsUpdate=!0,E()}let d=new Pt({uniforms:{uTex:{value:s},cSilver:ue.cSilver,uAlpha:{value:1},cAbyss:ue.cAbyss,uFogDensity:ue.uFogDensity},vertexShader:IS,fragmentShader:LS,transparent:!0,depthWrite:!1}),f=mp/.6,g=new zt(new kr(f*(qn/Gi),f),d);g.position.set(0,Ug,i),g.visible=!1,g.name="rimName",e.add(g);let x=Math.max(1,iu(ft.clan.sigil).length),p=new Float32Array(x*3),m=Uf({positions:p,count:0,color:"ember",radius:To.emitterM,intensity:1});e.add(m.object);let b=0;function E(){let L=f*(qn/Gi)*o/2+12;for(let V=0;V<x;V++){let D=Math.floor(V/3),k=V%3;p[V*3]=L+D*6,p[V*3+1]=Ug+(1-k)*7,p[V*3+2]=i+.5}m.setPositions(p,x),m.setCount(b)}h(),vl().then(h);let v=null;try{v=document.createElement("span"),v.className="sr-only",v.textContent=n,(document.getElementById("overlay")||document.body).appendChild(v)}catch{v=null}let S=null,w=null,T=null,y=null;function A(){if(!T){T=document.createElement("canvas"),T.width=qn,T.height=64,y=new Ur(T),y.minFilter=Et,y.magFilter=Et,y.generateMipmaps=!1,Yo(y,qn*64*4);let V=new Pt({uniforms:{uTex:{value:y},cSilver:ue.cSilver,uAlpha:{value:.7*O},cAbyss:ue.cAbyss,uFogDensity:ue.uFogDensity},vertexShader:IS,fragmentShader:LS,transparent:!0,depthWrite:!1}),D=mp*.22/.6;w=new zt(new kr(D*(qn/64),D),V),w.position.set(0,Ug-f*.5-D*.2,i),w.name="rimRole",e.add(w)}let L=T.getContext("2d");L.clearRect(0,0,qn,64),L.fillStyle="#fff",L.font=Cr.burn.replace("{px}",String(Math.round(64*.78))),L.textAlign="center",L.textBaseline="middle",S&&L.fillText(S,qn/2,34),y.needsUpdate=!0,w.visible=!!S&&g.visible}let P=new C,F={x:0,y:0,depth:0,visible:!1},O=1,z={group:e,burn(L){let V=L&&Number.isFinite(L.at)?L.at:null,D=V!=null?Math.max(0,V-performance.now()):0;return D<=0?(z.showName(),Promise.resolve()):new Promise(k=>it(D,()=>{z.showName(),k()}))},showName(){g.visible=O>0,w&&(w.visible=!!S&&g.visible)},burnGuests(L,V){return a=(Array.isArray(L)?L:[]).map(D=>dr(String(D||""))).filter(Boolean),h(),z.showName(),Promise.resolve()},clearGuests(){a.length&&(a=[],h())},rows(){let L=mp*l;return[n].concat(a).map(V=>({text:V,heightM:L,row:0}))},setRole(L){S=L?dr(String(L)):null,(S||w)&&A()},namePoint(L,V){let D=V||{x:0,y:0},k=c[Math.max(0,Math.min(c.length-1,L|0))]!=null?c[Math.max(0,Math.min(c.length-1,L|0))]:.5;return P.set((k-.5)*f*(qn/Gi),0,0),g.updateWorldMatrix(!0,!1),g.localToWorld(P),Re.camera?(Re.project(P,F),D.x=F.x,D.y=F.y):(D.x=0,D.y=0),D},letterHeightM(){return mp},setLitNodes(L){b=Math.max(0,Math.min(x,L|0)),m.setCount(b)},setAlpha(L){O=Math.max(0,Math.min(1,L)),d.uniforms.uAlpha.value=O,w&&(w.material.uniforms.uAlpha.value=.7*O),e.visible=O>0,m.setIntensity(O)}};return z.setLitNodes(W.litNodes),kt("rim",()=>z.rows()),z}function NS(t){let e=t.app,n=hr.rest,i=!1,r=null,s=!1,o=nt.core,a=new C(...o.pos),l=new C(...o.target),c={pos:new C,target:new C,fov:o.fov,offsetY:0,roll:0};function u(){return c.pos.copy(a),c.target.copy(l),c.fov=o.fov,c.offsetY=t.layout.kind==="desktop"?0:o.phoneOffsetY,c.roll=0,c}function h({index:g}){if(!i||t.director.busy()||e.phase!=="idle"&&e.phase!=="unfolded")return;if(g===3){t.director.go(s?"#/core":"#/core/open",{source:"key"});return}let x=kf(g);x&&t.director.go(`#/${x.slug}`,{source:"key"})}function d(g){s=g,e.unfolded=g,t.key&&(t.key.overrideGroup(g?{gap:Dt.unfold}:null),t.key.setOverrideWeight(1))}return{id:"CORE",build(){r=t.bus.on("key:click",h)},pose(){return u()},livePose(g){return Math.abs(n-hr.rest)<1e-4?!1:(g.target.copy(l),g.pos.copy(a).sub(l).multiplyScalar(n/hr.rest).add(l),g.fov=o.fov,g.offsetY=t.layout.kind==="desktop"?0:o.phoneOffsetY,g.roll=0,!0)},enter(){},exit(){},arrive(){i=!0,n=hr.rest},depart(){i=!1,s&&d(!1)},setSub(g){return g==="open"?(s||(d(!0),e.phase==="idle"&&Mi("unfolded")),0):g==null?(s&&(d(!1),e.phase==="unfolded"&&Mi("idle")),0):!1},update(){},onGesture(g){return t.key&&t.key.onGesture(g)?!0:g.type==="wheel"?(n=Math.max(hr.min,Math.min(hr.max,n*Math.pow(hr.wheelFactor,g.deltaY/hr.wheelStepPx))),!0):g.type==="pinch"?(n=Math.max(hr.min,Math.min(hr.max,n/Math.max(.2,g.dScale||1))),!0):!1},onKey(g){return g.key==="Escape"&&s?(t.director.go("#/core",{source:"kbd"}),!0):!1},resize(){},dispose(){r&&(r(),r=null),s&&d(!1),i=!1}}}function lo(t,e){if(t==="ZENITH")return e>0?"SIGNAL":null;let n=t==="WORKSHOP"?"MEMBERS":t,i=An.indexOf(n);if(i<0)return null;let r=i+(e>0?1:-1);return r>=0&&r<An.length?An[r]:null}function OS(t){let e=xt.elevator,n=0,i=-1e9,r=0;function s(o){let a=lo(t.id,o);return n=0,r=0,a?(t.director.go(`#/${he[a].slug}`,{source:"hall"}),!0):!1}return{onWheel(o){let a=t.loop.now;a-i>600&&(n=0,r=0),i=a;let l=o.deltaY||0;if(!l||(n!==0&&Math.sign(l)!==Math.sign(n)&&(n=0,r=0),!lo(t.id,Math.sign(l))))return!0;let c=Math.abs(n)<e.resistance*e.pxPerHall?.5:1;n+=l*c;let u=Math.floor(Math.abs(n)/e.tickPx);return u>r&&(r=u,t.audio&&t.audio.play("tick",{})),Math.abs(n)>=e.pxPerHall&&s(Math.sign(n)),!0},onSwipe(o){if(o.dir!=="up"&&o.dir!=="down")return!1;let a=o.dir==="up"?1:-1;return lo(t.id,a)?(Sr(Mr.lock),s(a)):!1},reset(){n=0,r=0,i=-1e9}}}var xp=Math.PI/180,Es=Math.PI*2,wI=new Set(["SIGNAL","MEMBERS","INSIGNIA","NADIR","ZENITH","ARCHIVE"]),AI="Зал строится.",gp=[0,0,0];function qr(t,e,n,i,r,s=nt.fov,o=0){return t.pos.set(e[0],e[1],e[2]),t.target.set(n,i,r),t.fov=s,t.offsetY=o,t.roll=0,t}function FS(t,e,n,i,r){return qr(t,e,e[0],i,e[2]+(i-e[1])/Math.tan(n*xp),r)}function Mu(t,e,n){return gp[0]=t,gp[1]=e,gp[2]=n,gp}function US(t,e,n,i){let r=e==="phone",s;switch(t){case"MEMBERS":return s=nt.members.target,qr(i,r?nt.members.phonePos:nt.members.pos,s[0],s[1],s[2]);case"VOYAGES":return r?FS(i,nt.voyages.phonePos,-nt.voyages.phonePitchDeg,0):qr(i,Mu(0,n,n*(44/70)),0,0,-6*(n/70));case"ARCHIVE":return qr(i,Mu(0,1.6,0),0,1.6,nt.archive.tubeR);case"SIGNAL":return r?qr(i,nt.signal.phonePos,0,2+30*Math.tan(nt.signal.phonePitchDeg*xp),0,nt.fovWide):(s=nt.signal.target,qr(i,nt.signal.pos,s[0],s[1],s[2],nt.signal.fov));case"INSIGNIA":return qr(i,nt.insignia.pos,0,1.7,-10,nt.insignia.fov);case"NADIR":return qr(i,Mu(0,20,40),0,0,0);case"ZENITH":return FS(i,Mu(0,50,30),r?nt.zenith.phonePitchDeg:nt.zenith.pitchDeg,-110);case"WORKSHOP":return qr(i,Mu(0,0,3.2),0,0,0);default:return s=nt.core.target,qr(i,nt.core.pos,s[0],s[1],s[2],nt.core.fov,e==="desktop"?0:nt.core.phoneOffsetY)}}function oa(t,e,n,i=48,r=0,s=0){for(let o=0;o<i;o++){let a=Es*o/i,l=Es*(o+1)/i;t.push(r+Math.sin(a)*e,n,s+Math.cos(a)*e,r+Math.sin(l)*e,n,s+Math.cos(l)*e)}}function EI(t,e,n){let o=.75*Math.PI;for(let a of[1,-1])for(let l=0;l<10;l++){let c=Es*l/10;t.push(e+Math.sin(c)*1.2,0,n+Math.cos(c)*1.2,e+Math.sin(c+a*o)*1.2,24,n+Math.cos(c+a*o)*1.2)}oa(t,1.2,0,14,e,n),oa(t,1.2,24,14,e,n),oa(t,1.2*1.6,24,14,e,n)}function kS(t,e,n,i){let r=ql(e),s=new Float32Array(t*3);for(let o=0;o<t;o++){let a=r()*Es,l=Math.asin(.15+.85*r());s[3*o]=Math.cos(l)*Math.sin(a)*i,s[3*o+1]=n+Math.sin(l)*i,s[3*o+2]=Math.cos(l)*Math.cos(a)*i}return s}function TI(t,e){let n=[],i=null,r=[];switch(t){case"columns":{let s=e.world.members,o=s.length,a=s.filter(c=>c.id!==e.world.operator.id),l=s.find(c=>c.id===e.world.operator.id);l&&a.splice(Math.floor(a.length/2),0,l),a.forEach((c,u)=>{let h=o>1?(-25+50*u/(o-1))*xp:0,d=48*Math.sin(h),f=48-48*Math.cos(h);EI(n,d,f),r.push({id:c.id,label:c.name,pos:new C(d,24,f)})});break}case"hatches":for(let s=0;s<9;s++){let o=14*Math.sqrt(s),a=s*137.508*xp;oa(n,2.25,.05,24,Math.sin(a)*o,Math.cos(a)*o)}break;case"bands":for(let s=0;s<12;s++)oa(n,nt.archive.tubeR,2-1.6*s,56);break;case"sky":{let s=nt.signal.apexH,o=nt.signal.apexR;oa(n,o,s,36);for(let a=1;a<6;a++)oa(n,60+(o-60)*(a/6),s*a/6,48);for(let a of[1,-1])for(let l=0;l<24;l++){let c=Es*l/24,u=c+a*(Es/6);n.push(Math.sin(c)*60,0,Math.cos(c)*60,Math.sin(u)*o,s,Math.cos(u)*o)}i=kS(300,20833,nt.signal.apexH,900);break}case"dome":{let s=new Bo(nt.insignia.sphereR,1),o=s.attributes.position.array,a=new Set,l=c=>`${o[c].toFixed(3)},${o[c+1].toFixed(3)},${o[c+2].toFixed(3)}`;for(let c=0;c<o.length;c+=9)for(let[u,h]of[[0,3],[3,6],[6,0]]){let d=l(c+u),f=l(c+h),g=d<f?d+"|"+f:f+"|"+d;a.has(g)||(a.add(g),n.push(o[c+u],o[c+u+1]+1.7,o[c+u+2],o[c+h],o[c+h+1]+1.7,o[c+h+2]))}s.dispose();break}case"chamber":{let s=nt.nadir.depth,o=40;for(let a=0;a<3;a++){let l=Es*a/3,c=Es*(a+1)/3;n.push(Math.sin(l)*o,0,Math.cos(l)*o,Math.sin(c)*o,0,Math.cos(c)*o),n.push(Math.sin(l)*o,0,Math.cos(l)*o,0,-s,0)}break}case"zenith":i=kS(400,11799,-40,1200);break;default:{i=new Float32Array(147);for(let s=0;s<49;s++)i[3*s]=(s%7-3)*.4,i[3*s+1]=(3-Math.floor(s/7))*.4,i[3*s+2]=0;break}}return{seg:n,pts:i,anchors:r}}function zn(t,e={}){let n=t.id,i=t.meta,r=e.props||"grid",s=null,o=null,a=null,l=null,c=[],u=0,h=0,d=null,f=!1,g=nt.voyages.pos[1],x=new C,p={pos:new C,target:new C,fov:nt.fov,offsetY:0,roll:0};function m(){let v=Tt(u)*(1-Tt(h));s&&s.setAlpha(.55*v),o&&o.setAlpha((r==="grid"?.9:.4)*v),a&&(a.style.opacity=String(Tt(u)*(1-Tt(h*2))));let S=u>=.7&&h===0;for(let w of c)w.setVisible(S)}function b(){let v=document.createElement("div");v.className="ph-block scrim";let S=document.createElement("p");return S.className="t-body",S.textContent=AI,v.appendChild(S),v}return{id:n,build(){let{seg:v,pts:S,anchors:w}=TI(r,t);if(t.group&&(v.length&&(s=zi({segments:new Float32Array(v),color:"silver",alpha:.55,width:1,far:Math.max(i.far,200)}),s.mesh.name=`ph:${r}`,t.group.add(s.mesh)),S)){let T=r==="sky"||r==="zenith";o=io({positions:S,sizePx:T?2:4,color:T?"white":"silver",alpha:.4,fog:!T,layer:T?oi.NOFOG:oi.DEFAULT}),t.group.add(o.object)}if(t.overlay&&w.length&&t.scale)for(let T of w){let y=T.pos.clone();c.push(t.overlay.add({owner:"placeholder",id:T.id,get:A=>{t.toCanonical(y,x),t.scale.toRender(x,A)},leader:{side:"right",len:40,rise:-24},button:{label:T.label,onActivate:()=>t.director.go(`#/members/${T.id}`,{source:"hall"})}}))}t.layout.isPhone||(a=b(),t.section.appendChild(a)),wI.has(n)&&(l=OS(t)),m()},pose(v){return US(n,t.layout.kind,g,p)},lostSpots(){let v=US(n,t.layout.kind,g,{pos:new C,target:new C,fov:0,offsetY:0,roll:0}),S=[];for(let w=0;w<6;w++){let T=Es*w/6;S.push(new C(v.target.x+Math.sin(T)*11,0,v.target.z+Math.cos(T)*11))}return S},livePose(v){return n!=="VOYAGES"||g===nt.voyages.pos[1]||t.layout.kind==="phone"?!1:(v.pos.set(0,g,g*(44/70)),v.target.set(0,0,-6*(g/70)),v.fov=nt.fov,v.offsetY=0,v.roll=0,!0)},enter(v){u=v,v>0&&(h=0),m()},exit(v){h=v,m()},arrive(){f=!0,u=1,h=0,m(),t.layout.isPhone&&t.sheet&&t.sheet.set(b(),{peek:null,state:"peek"})},depart(){f=!1,l&&l.reset(),t.layout.isPhone&&t.sheet&&t.sheet.set(null)},setSub(v){return d=v==null?null:String(v),0},update(){},onGesture(v){if(!f)return!1;if(n==="VOYAGES"&&v.type==="wheel"){let S=nt.voyages.altRange;return g=Math.max(S[0],Math.min(S[1],g+v.deltaY*.08)),!0}return l?v.type==="wheel"?l.onWheel(v):v.type==="swipe"?l.onSwipe(v):!1:!1},onKey(){return!1},resize(){!f||!t.sheet||t.layout.isPhone&&!a&&t.sheet.set(b(),{peek:null,state:"peek"})},dispose(){s&&(s.dispose(),s.mesh.parent&&s.mesh.parent.remove(s.mesh),s=null),o&&(o.dispose&&o.dispose(),o.object.parent&&o.object.parent.remove(o.object),o=null);for(let v of c)v.remove();c.length=0,a&&a.parentNode&&a.parentNode.removeChild(a),a=null,f&&t.layout.isPhone&&t.sheet&&t.sheet.set(null),f=!1},get sub(){return d}}}function BS(t){return zn(t,{props:"columns"})}function zS(t){return zn(t,{props:"grid"})}function VS(t){return zn(t,{props:"hatches"})}function GS(t){return zn(t,{props:"bands"})}function HS(t){return zn(t,{props:"sky"})}function WS(t){return zn(t,{props:"dome"})}function $S(t){return zn(t,{props:"chamber"})}function XS(t){return zn(t,{props:"zenith"})}var YS=Object.freeze({CORE:NS,MEMBERS:BS,WORKSHOP:zS,VOYAGES:VS,ARCHIVE:GS,SIGNAL:HS,INSIGNIA:WS,NADIR:$S,ZENITH:XS});var Hi=new Map,jr=[],Rs=null,RI=null,Ts=()=>{},co=[];function qS(t,e,n){if(!co.length||!t||t.dead)return;let i=co;for(let r=0;r<i.length;r++){let s=i[r],o=s[e];if(typeof o=="function")try{o.call(s,t.hctx,n)}catch(a){ot(`ext:${s.name}`,`hall extension ${s.name} failed — removed`,a),co=co.filter(l=>l!==s)}}}function CI(t){let e={pos:new C(0,.75,7.2),target:new C,fov:nt.fov,offsetY:0,roll:0};return{id:t,build:Ts,pose:()=>e,enter:Ts,exit:Ts,arrive:Ts,depart:Ts,setSub:()=>0,update:Ts,onGesture:()=>!1,onKey:()=>!1,resize:Ts,dispose:Ts,stub:!0}}function PI(t){let e=document.createElement("section");e.className="hall",e.dataset.room=t,e.hidden=!0;let n=document.getElementById("halls");return n&&n.appendChild(e),e}function II(t,e,n,i){let r=he[t],s=Object.create(Rs);return s.id=t,s.meta=r,s.group=i,s.section=e,s.shell=n,s.toCanonical=(o,a)=>a.copy(o).add(r.anchor),s}function jS(t,e){let n=PI(t),i=null,r=null;J.tier!=="T0"&&at.root&&(i=new nn,i.name=`hall:${t}`,i.position.copy(he[t].anchor),i.visible=!1,at.root.add(i),r=bS(t),i.add(r.group));let s=II(t,n,r,i),o={id:t,hall:null,hctx:s,section:n,shell:r,group:i,shown:!1,dead:!1,throwArmed:RI===t};Hi.set(t,o),jr.push(o);try{o.hall=J.tier==="T0"?CI(t):e(s);let a=o.hall.build();a&&typeof a.then=="function"&&a.then(null,l=>kg(t,l))}catch(a){return kg(t,a),Hi.get(t)||null}return i&&(i.visible=!0),o}function ZS(t){qS(t,"dispose"),t.dead=!0;try{t.hall&&t.hall.dispose()}catch(n){ot(`hall:${t.id}`,`hall ${t.id} dispose failed`,n)}t.shell&&t.shell.dispose(),t.group&&t.group.parent&&t.group.parent.remove(t.group),t.section&&t.section.parentNode&&t.section.parentNode.removeChild(t.section),Hi.delete(t.id);let e=jr.indexOf(t);e>=0&&jr.splice(e,1)}function kg(t,e){ot(`hall:${t}`,`hall ${t} failed — recalled to CORE`,e);let n=Hi.get(t);n&&ZS(n);let i=Rs&&Rs.director;if(t==="CORE"){jS("CORE",s=>zn(s,{props:"grid"}));let r=Hi.get("CORE");r&&J.room==="CORE"&&(at.show("CORE",!0),r.hall&&Su(r,"enter",1));return}i&&Promise.resolve().then(()=>i.go("#/core",{source:"error"}))}function Su(t,e,n,i,r){if(!t||t.dead||!t.hall||typeof t.hall[e]!="function")return;let s;try{s=t.hall[e](n,i,r)}catch(o){kg(t.id,o);return}return(e==="arrive"||e==="depart"||e==="update")&&qS(t,e,n),s}function LI(t,e){for(let n=0;n<jr.length;n++){let i=jr[n];i.dead||!i.hall||Su(i,"update",t,e)}}var at={root:null,init(t){return Rs=t,t.scale&&t.scale.root&&!at.root&&(at.root=new nn,at.root.name="halls",t.scale.root.add(at.root)),pe.add(LI,Nt.WORLD),t.bus.on("layout:change",()=>{for(let e=0;e<jr.length;e++)Su(jr[e],"resize")}),at},ensure(t){he[t]||(t="CORE");let e=Hi.get(t)||jS(t,YS[t]||(n=>zn(n,{props:"grid"})));return e&&e.hall?e.hall:null},get(t){let e=Hi.get(t);return e&&!e.dead?e.hall:null},current(){return at.get(J.room)},release(t){let e=Hi.get(t);if(!e||t===J.room&&J.phase!=="transition")return;let n=Rs&&Rs.director;n&&n.busy()&&n.state.to&&(n.state.to.room===t||n.logicalSource()===t)||ZS(e)},call(t,e,n,i,r){let s=Su(Hi.get(t),e,n,i,r);return e==="lostSpots"?Array.isArray(s)?s:[]:s},addExtension(t){return!t||typeof t!="object"?Ts:(co=co.concat([t]),()=>{co=co.filter(e=>e!==t)})},shell(t){let e=Hi.get(t);return e?e.shell:null},group(t){let e=Hi.get(t);return e?e.group:null},residents(){return jr.map(t=>t.id)},restPose(t,e,n){let i=he[t]||he.CORE,r=Hi.get(i.id),s=r?Su(r,"pose",e||null):void 0;return s&&s.pos&&s.target?(n.pos.copy(s.pos).add(i.anchor),n.target.copy(s.target).add(i.anchor),n.fov=s.fov||nt.fov,n.offsetY=s.offsetY||0,n.roll=s.roll||0):i.id==="CORE"?(n.pos.fromArray(nt.core.pos),n.target.fromArray(nt.core.target),n.fov=nt.core.fov,n.offsetY=Rs&&Rs.layout&&Rs.layout.kind!=="desktop"?nt.core.phoneOffsetY:0,n.roll=0):(n.pos.set(0,i.alt+10,48),n.target.set(0,i.alt+12.5,0),n.fov=nt.fov,n.offsetY=0,n.roll=0),n},show(t,e=!1){for(let n=0;n<jr.length;n++){let i=jr[n];i.id===t?(i.shown=!0,i.section.hidden=!1):e&&(i.shown=!1,i.section.hidden=!0)}},hide(t){let e=Hi.get(t);e&&(e.shown=!1,e.section.hidden=!0)}};function Tl(){return{cam:{pos:new C,target:new C,fov:35,offsetY:0,roll:0},s:1,pivot:new C,Q:new C,fog:.00485,fade:{mini:0,key:1,vin:1,parent:0},alt:0,exitU:0,enterU:0,speed01:0,pan:0,counter:0,flashCode:null,morph:{kind:"none",i:3,tMs:0,D:1},vinStrata:new Float32Array([1,1,1,1,1,1,1]),vinGap:.02,rim:1,pillar:1,shellFrom:1,shellTo:1,iris:{fromTop:0,fromBottom:0,toTop:0,toBottom:0},vel:new C}}function uo(t,e){return e.cam.pos.copy(t.cam.pos),e.cam.target.copy(t.cam.target),e.cam.fov=t.cam.fov,e.cam.offsetY=t.cam.offsetY,e.cam.roll=t.cam.roll,e.s=t.s,e.pivot.copy(t.pivot),e.Q.copy(t.Q),e.fog=t.fog,e.fade.mini=t.fade.mini,e.fade.key=t.fade.key,e.fade.vin=t.fade.vin,e.fade.parent=t.fade.parent,e.alt=t.alt,e.exitU=t.exitU,e.enterU=t.enterU,e.speed01=t.speed01,e.pan=t.pan,e.counter=t.counter,e.flashCode=t.flashCode,e.morph.kind=t.morph.kind,e.morph.i=t.morph.i,e.morph.tMs=t.morph.tMs,e.morph.D=t.morph.D,e.vinStrata.set(t.vinStrata),e.vinGap=t.vinGap,e.rim=t.rim,e.pillar=t.pillar,e.shellFrom=t.shellFrom,e.shellTo=t.shellTo,e.iris.fromTop=t.iris.fromTop,e.iris.fromBottom=t.iris.fromBottom,e.iris.toTop=t.iris.toTop,e.iris.toBottom=t.iris.toBottom,e.vel.copy(t.vel),e}function Au(t,e){t.fade.mini=0,t.fade.key=1,t.fade.vin=1,t.fade.parent=0,t.morph.kind="none",t.vinStrata.fill(1),t.vinGap=.02,t.rim=e?1:0,t.pillar=1,t.shellFrom=1,t.shellTo=1,t.iris.fromTop=0,t.iris.fromBottom=0,t.iris.toTop=0,t.iris.toBottom=0,t.speed01=0,t.pan=0,t.counter=0,t.flashCode=null}var wu=1024,vp=new Float32Array(wu+1);for(let t=0;t<=wu;t++)vp[t]=cn.camera(t/wu);function DI(t){if(t<=0)return 0;if(t>=1)return 1;let e=0,n=wu;for(;n-e>1;){let s=e+n>>1;vp[s]<t?e=s:n=s}let i=vp[e],r=vp[n];return(e+(r>i?(t-i)/(r-i):0))/wu}var ho=(t,e)=>DI(t)*e,Ar=(t,e)=>cn.camera(Tt(t/e));function yi(t,e,n,i){let r=Ar(e,i),s=Ar(n,i);return s<=r?t>=s?1:0:Tt((t-r)/(s-r))}var aa=(t,e,n)=>Math.exp(Math.log(t)+(Math.log(e)-Math.log(t))*n),fo=t=>{let e=Tt(t);return e*e*(3-2*e)};function Bg(t,e=7){let n=Tt(t)*e,i=Math.floor(n);return i>=e?1:(i+fo((n-i)*3))/e}function NI(t){let e=new C,n=new C,i=new Float64Array(12),r=(o,a,l,c,u,h,d,f)=>{let g=(l-a)/h-(c-a)/(h+d)+(c-l)/d,x=(c-l)/d-(u-l)/(d+f)+(u-c)/f;g*=d,x*=d,i[o]=l,i[o+1]=g,i[o+2]=-3*l+3*c-2*g-x,i[o+3]=2*l-2*c+g+x},s=(o,a)=>i[o]+i[o+1]*a+i[o+2]*a*a+i[o+3]*a*a*a;return{points:t,getPoint(o,a=new C){let l=t.length,c=(l-1)*o,u=Math.floor(c),h=c-u;h===0&&u===l-1&&(u=l-2,h=1);let d=u>0?t[u-1]:n.subVectors(t[0],t[1]).add(t[0]),f=t[u%l],g=t[(u+1)%l],x=u+2<l?t[u+2]:e.subVectors(t[l-1],t[l-2]).add(t[l-1]),p=Math.pow(d.distanceToSquared(f),.25),m=Math.pow(f.distanceToSquared(g),.25),b=Math.pow(g.distanceToSquared(x),.25);return m<1e-4&&(m=1),p<1e-4&&(p=m),b<1e-4&&(b=m),r(0,d.x,f.x,g.x,x.x,p,m,b),r(4,d.y,f.y,g.y,x.y,p,m,b),r(8,d.z,f.z,g.z,x.z,p,m,b),a.set(s(0,h),s(4,h),s(8,h))}}}function yp(t,e){let n=[],i=[];for(let o=0;o<t.length;o++){if(n.length&&n[n.length-1].distanceToSquared(t[o])<1e-12){i[i.length-1]=e[o];continue}n.push(t[o].clone()),i.push(e[o])}n.length===1&&(n.push(n[0].clone()),i.push(i[0]+1e-6));let r=NI(n),s=n.length-1;return{curve:r,points:n,knots:i,sample(o,a){if(o<=i[0])return a.copy(n[0]);if(o>=i[s])return a.copy(n[s]);let l=0;for(;l<s-1&&o>i[l+1];)l++;let c=i[l+1]-i[l],u=c>0?(o-i[l])/c:1;return r.getPoint((l+u)/s,a)}}}function Eu(t,e,n,i,r,s){return s.set(i.x+r.x*(n-e)+e*t.x,i.y+r.y*(n-e)+e*t.y,i.z+r.z*(n-e)+e*t.z)}function zg(t,e,n){let i=1-t;return Math.abs(i)<1e-9?n.set(0,0,0):n.copy(e).multiplyScalar(1/i)}var Tu={restPose:null,faceFrame:null};function QS(t){Object.assign(Tu,t||{})}function _p(t,e){let n={pos:new C,target:new C,fov:nt.fov,offsetY:0,roll:0};if(Tu.restPose)Tu.restPose(t,e||null,n);else{let i=he[t]||he.CORE;i.id==="CORE"?(n.pos.fromArray(nt.core.pos),n.target.fromArray(nt.core.target)):(n.pos.set(0,i.alt+10,48),n.target.set(0,i.alt+12.5,0))}return n}var Vg=t=>t==="WORKSHOP"?"MEMBERS":t==="ZENITH"?"SIGNAL":t;function Gg(t,e){let n=Vg(t),i=Vg(e);return n==="CORE"&&i!=="CORE"?"DIVE":i==="CORE"&&n!=="CORE"?"RECALL":"LIFT"}function e1(t,e){let n=he[t]||he.CORE,i=he[e]||he.CORE;return Math.abs(n.stratum-i.stratum)}function t1(t,e){let n=e1(t,e);return n<=1?we.liftBase:Math.min(we.liftMax,we.liftBase+we.liftPerBoundary*(n-1))}function OI(t,e,n){return t==="DIVE"?we.dive:t==="RECALL"?we.recall:t==="SLICE"?we.slice:t1(e,n)}function n1(t,e,n,i,r=900,s=-1){i.set(0,0,0);let o=n.x-e.x,a=n.y-e.y,l=n.z-e.z,c=Math.sqrt(o*o+a*a+l*l),u=s>0?s:c;if(c<1e-9||c<bi.anticipationMinDisp*u)return i;let h=Tt(t)*r,d=bi.anticipationMs,f=h<d?cn.reveal(h/d):h<3*d?1-fo((h-d)/(2*d)):0,g=-(bi.anticipationFrac*u*f)/c;return i.set(o*g,a*g,l*g)}function Hg(t,e,n,i){t.exitU=Tt(e/we.depart),t.enterU=i>=0?e<i?0:Tt((e-i)/Math.max(1,n-i)):Tt((e-(n-we.arrive))/we.arrive)}var Wg=t=>Math.sin(Math.PI*Tt(t));function KS(t,e,n,i){let r=Tt(t/120),s=cn.camera(Tt((t-120)/360)),o=t<120?1-Bt.contract*cn.camera(r):1-Bt.contract*(1-FI(120,480,t)),a=Vt(Dt.rest,Dt.dive,s);return i.copy(n).multiplyScalar(Bt.diveSlide*s),i.y+=(3-e)*(a-Dt.rest),o}function FI(t,e,n){let i=Tt((n-t)/(e-t));return i*i*(3-2*i)}function UI(t,e){let n=Wt[t],i=n.top+(n.bot-n.top)/3,r=n.top+(n.bot-n.top)*2/3,s=(At(i)+At(r))/2;return e.F.set(0,n.mid,s*Math.cos(Math.PI/n.n)),e.n.set(0,0,1),e}function $g(t,e,n={}){let i=Math.max(0,Math.min(6,e|0)),r=n.to||kf(i).id,s=!!n.first&&!n.D,o=Math.max(0,Math.min(1100,n.tb0||0)),a=n.D||(s?we.diveFirst:we.dive-o),l=we.diveFirstScale,c=we.diveFirstHold,u=1e3*l,h=s?Te=>Te<u?Te/l:Te<u+c?1e3:(Te-c)/l:Te=>o+Te*(we.dive-o)/a,d=s?Te=>Te<1e3?Te*l:Te*l+c:Te=>(Te-o)*a/(we.dive-o),f=d(we.diveSwapAt),g=Ar(f,a),x=t.s,p=t.Q.clone(),m={F:new C,n:new C};Tu.faceFrame&&Math.abs(x-1)<1e-6&&p.lengthSq()<1e-12&&!n.D?Tu.faceFrame(i,m):UI(i,m);let b=m.F,E=m.n.normalize(),v=Math.hypot(b.x,b.z),S=Math.min(.3,.5*v),w=new C,T=KS(o,i,E,w),y=E.clone().multiplyScalar(Bt.diveSlide).add(b);y.y+=(3-i)*(Dt.dive-Dt.rest);let A=_p(r,n.sub),P=(he[r]||he.CORE).fog,F=t.cam.pos.clone().sub(p).multiplyScalar(1/(x*T)).sub(w),O=t.cam.target.clone().sub(p).multiplyScalar(1/(x*T)).sub(w),z=[F],L=[0],V=[O],D=[0];F.distanceTo(b)>2.2&&o<480&&(z.push(b.clone().addScaledVector(E,2)),L.push(Ar(d(480),a))),o<700&&(z.push(b.clone().addScaledVector(E,.4)),L.push(Ar(d(700),a))),z.push(b.clone().addScaledVector(E,-S)),L.push(g),z.push(A.pos.clone().multiplyScalar(1/1e3)),L.push(1),o<480&&(V.push(b.clone()),D.push(Ar(d(480),a))),V.push(b.clone().addScaledVector(E,-S-.6)),D.push(g),V.push(A.target.clone().multiplyScalar(1/1e3)),D.push(1);let Z=yp(z,L),Y=yp(V,D),Q=Math.max(0,d(Math.max(480,o))),se=t.cam.fov,Le=t.cam.offsetY,Oe=t.cam.roll,mt=t.fog,$e=t.alt,rt=t.rim,j=t.pillar,ne=t.fade.vin,Ee=t.cam.pos.distanceTo(t.cam.target),et=z[1].clone(),Ae=o<480?Ar(d(480),a):-1,le=[];for(let Te=Math.max(o,860);Te<=1120;Te+=1e3/wv)le.push(Ar(d(Te),a));let ge=new C,De=new C,Ye=new C,vt=new C;return{kind:"DIVE",from:"CORE",to:r,duration:a,swapAt:g,swapKind:"grow",stratum:i,first:s,pose(Te,Ce){let st=ho(Te,a),Jt=h(st);if(Au(Ce,!1),Te<g){let Zt=KS(Jt,i,E,vt),U=aa(x,1e3,yi(Te,Q,f,a));Ce.s=U,Ce.pivot.copy(y),Ce.Q.copy(p).addScaledVector(y,x-U),Z.sample(Te,ge).add(vt).multiplyScalar(Zt),Eu(ge,U,x,p,y,Ce.cam.pos),o===0&&st<3*bi.anticipationMs&&(n1(st/a,De.copy(F),et,Ye,a,Ee),Ce.cam.pos.addScaledVector(Ye,U)),Y.sample(Te,ge).add(vt).multiplyScalar(Zt),Eu(ge,U,x,p,y,Ce.cam.target);let Tn=Math.log(U/x)/Math.log(1e3/x);Ce.fog=aa(mt,P,Tt(Tn));let bt=1-yi(Te,Q,f,a);Ce.fade.vin=ne*bt,Ce.rim=rt*bt,Ce.pillar=j*bt,Ce.shellFrom=bt,Ce.shellTo=0,Ce.morph.kind="dive",Ce.morph.i=i,Ce.morph.tMs=s?Jt*l:Jt,Ce.morph.D=s?we.diveFirst:we.dive}else{Ce.s=1,Ce.pivot.set(0,0,0),Ce.Q.set(0,0,0),Z.sample(Te,Ce.cam.pos).multiplyScalar(1e3),Y.sample(Te,Ce.cam.target).multiplyScalar(1e3),Ce.fog=P;let Zt=yi(Te,f,Math.min(a,f+we.depart),a);for(let U=0;U<7;U++)Ce.vinStrata[U]=U===i?1:Zt;Ce.rim=0,Ce.pillar=Zt,Ce.shellFrom=0,Ce.shellTo=Zt}let jt=yi(Te,f,a,a);return Ce.cam.fov=Vt(se,A.fov,jt),Ce.cam.offsetY=Vt(Le,A.offsetY,jt),Ce.cam.roll=Vt(Oe,A.roll,jt),Ce.alt=Vt($e,(he[r]||he.CORE).alt,Te),Hg(Ce,st,a,f),Ce.speed01=Wg(yi(Te,Q*.5,f,a)),Ce},cues(Te,Ce,st){if(!(Te<=Ce||!st||!st.audio)){Ae>=0&&Ce<Ae&&Te>=Ae&&st.audio.play("subDrop",{});for(let Jt=0;Jt<le.length;Jt++)if(Ce<le[Jt]&&Te>=le[Jt]){st.audio.play("strutTick",{});break}}}}}function Xg(t,e,n={}){let i=n.D||we.recall,r=i/we.recall,s=we.recallSwapAt*r,o=we.depart*r,a=Ar(s,i),l=_p("CORE",null),c=t.s,u=t.Q.clone(),h=t.cam.pos.clone(),d=t.cam.target.clone(),f=1/1e3,g=h.clone().sub(l.pos).sub(u).multiplyScalar(1/(c-f)),x=l.target.clone(),p=t.cam.fov,m=t.cam.offsetY,b=t.cam.roll,E=t.fog,v=t.alt,S=t.rim,w=t.pillar,T=he.CORE.fog,y=new C;return{kind:"RECALL",from:e,to:"CORE",duration:i,swapAt:a,swapKind:"shrink",pose(A,P){let F=ho(A,i);if(Au(P,!1),A<a){let O=yi(A,o,s,i),z=aa(c,f,O);P.s=z,P.pivot.copy(g),P.Q.copy(u).addScaledVector(g,c-z),P.cam.pos.copy(h),y.copy(x).multiplyScalar(z).add(P.Q),P.cam.target.copy(d).lerp(y,fo(yi(A,o,s*.92,i))),P.cam.fov=Vt(p,l.fov,O),P.cam.offsetY=Vt(m,l.offsetY,O),P.cam.roll=Vt(b,0,O),P.fog=aa(E,T,Tt(Math.log(z/c)/Math.log(f/c))),P.fade.parent=yi(A,s*.55,s,i),P.vinGap=Vt(Dt.rest,Dt.recallStart,O),P.rim=S*(1-yi(A,0,o,i)),P.pillar=w,P.shellFrom=1,P.shellTo=0}else{P.s=1,P.pivot.set(0,0,0),P.Q.set(0,0,0),P.cam.pos.copy(l.pos),P.cam.target.copy(l.target),P.cam.fov=l.fov,P.cam.offsetY=l.offsetY,P.cam.roll=0,P.fog=T;let O=yi(A,s,i,i);P.rim=O,P.pillar=O,P.shellFrom=0,P.shellTo=O,P.morph.kind="recall",P.morph.i=3,P.morph.tMs=F/r,P.morph.D=we.recall}return P.alt=Vt(v,0,A),Hg(P,F,i,-1),P.speed01=Wg(yi(A,o,s,i)),P},cues(A,P,F){A<=P||!F||!F.audio||P<a&&A>=a&&F.audio.play("recallThud",{})}}}var JS=t=>t==="WORKSHOP"?"MEMBERS":t,la=["ZENITH","SIGNAL","ARCHIVE","MEMBERS","CORE","VOYAGES","INSIGNIA","NADIR"];function Yg(t,e,n,i={}){let r=i.D||t1(e,n),s=t.s,o=t.Q.clone(),a=zg(s,o,new C),l=t.cam.pos.clone().sub(o).multiplyScalar(1/s),c=t.cam.target.clone().sub(o).multiplyScalar(1/s),u=_p(n,i.sub),h=e1(e,n),d=u.pos.y>l.y,f=d?1:-1,[g,,x]=bn.liftOffset,p=[l];i.vel&&i.vel.length()/s>1&&p.push(l.clone().addScaledVector(i.vel,.12/s));let m=-1,b=-1;if(h>=1){let le=he[JS(e)],ge=he[JS(n)],De=d?le.ceil:le.floor,Ye=d?ge.floor:ge.ceil;!(Math.abs(l.x-g)<4&&Math.abs(l.z-x)<4)&&(De-l.y)*f>-5&&(p.push(new C(g,De,x)),m=p.length-1),m<0||Math.abs(Ye-De)>2?(p.push(new C(g,Ye,x)),b=p.length-1):b=m,m<0&&(m=b)}p.push(u.pos.clone());let E=[0],v=0;for(let le=1;le<p.length;le++)v+=p[le].distanceTo(p[le-1]),E.push(v);for(let le=0;le<E.length;le++)E[le]=v>0?E[le]/v:le/(E.length-1);let S=yp(p,E),w=m>=0?E[m]:.3,T=b>=0?E[b]:.7,y=t.cam.fov,A=t.cam.offsetY,P=t.cam.roll,F=t.fog,O={...t.fade},z=Float32Array.from(t.vinStrata),L=t.vinGap,V=t.rim,D=i.shellFrom0!=null?i.shellFrom0:1,k=t.morph.kind==="dive"?{i:t.morph.i,tMs:t.morph.tMs,D:t.morph.D}:null,Z=(he[n]||he.CORE).fog,Y=t.cam.pos.distanceTo(t.cam.target),Q=p[1].clone(),se=Math.min(la.indexOf(e==="WORKSHOP"?"MEMBERS":e),la.indexOf(n==="WORKSHOP"?"MEMBERS":n)),Le=Math.max(la.indexOf(e==="WORKSHOP"?"MEMBERS":e),la.indexOf(n==="WORKSHOP"?"MEMBERS":n)),Oe=[],mt=[],$e=new C,rt=new C,j=le=>{S.sample(0,$e);for(let ge=1;ge<=240;ge++){let De=ge/240;if(S.sample(De,rt),($e.y-le)*(rt.y-le)<=0&&$e.y!==rt.y)return De-1/240*((rt.y-le)/(rt.y-$e.y));$e.copy(rt)}return-1};for(let le=se+1;le<Le;le++){let ge=he[la[le]],De=j(ge.alt);De>=0&&Oe.push({room:ge.id,t0:ho(De,r)})}for(let le=se;le<Le;le++){let ge=he[la[le]],De=he[la[le+1]],Ye=j((ge.floor+De.ceil)/2);Ye>=0&&mt.push(Ye)}let ne=h>=1?[w,T]:[],Ee=new C,et=new C,Ae=new C;return{kind:"LIFT",from:e,to:n,duration:r,swapAt:-1,swapKind:null,boundaries:h,pose(le,ge){let De=ho(le,r);Au(ge,!1);let Ye=aa(s,1,yi(le,0,r*.5,r));ge.s=Ye,ge.pivot.copy(a),ge.Q.copy(o).addScaledVector(a,s-Ye),S.sample(le,Ee);let vt=Ee.y;De<3*bi.anticipationMs&&(n1(De/r,l,Q,et,r,Y),Ee.add(et)),Eu(Ee,Ye,s,o,a,ge.cam.pos),h>=1?(Ae.set(0,vt+f*30,0),Ee.copy(c).lerp(Ae,fo(w>0?le/w:1)),Ee.lerp(u.target,fo(T<1?(le-T)/(1-T):0))):Ee.copy(c).lerp(u.target,fo(le)),Eu(Ee,Ye,s,o,a,ge.cam.target);let Te=fo(le);ge.cam.fov=Vt(y,u.fov,Te),ge.cam.offsetY=Vt(A,u.offsetY,Te),ge.cam.roll=Vt(P,u.roll,Te),ge.fog=aa(F,Z,Te);let Ce=yi(le,0,we.depart,r);ge.fade.mini=Vt(O.mini,0,Ce),ge.fade.key=Vt(O.key,1,Ce),ge.fade.vin=Vt(O.vin,1,Ce),ge.fade.parent=Vt(O.parent,0,Ce);for(let st=0;st<7;st++)ge.vinStrata[st]=Vt(z[st],1,Ce);if(ge.vinGap=Vt(L,Dt.rest,Ce),ge.rim=V*(1-Ce),ge.shellFrom=Vt(D,1,Ce),ge.shellTo=1,k&&(ge.morph.kind="dive",ge.morph.i=k.i,ge.morph.D=k.D,ge.morph.tMs=k.tMs*(1-yi(le,0,r*.6,r))),h>=1){let st=Bg(De/we.depart),Jt=De<r-300?1:1-Bg((De-(r-300))/300);d?(ge.iris.fromTop=st,ge.iris.toBottom=Jt):(ge.iris.fromBottom=st,ge.iris.toTop=Jt),ge.counter=De>120&&De<r-240?.12:0}ge.alt=(ge.cam.pos.y-ge.Q.y)/Ye,ge.flashCode=null;for(let st=0;st<Oe.length;st++)De>=Oe[st].t0&&De<Oe[st].t0+180&&(ge.flashCode=Oe[st].room);return Hg(ge,De,r,-1),ge.speed01=Wg(le),ge.pan=0,ge},cues(le,ge,De){if(!(le<=ge||!De||!De.audio)){for(let Ye=0;Ye<ne.length;Ye++)ge<ne[Ye]&&le>=ne[Ye]&&De.audio.play("irisWhoosh",{});for(let Ye=0;Ye<mt.length;Ye++)ge<mt[Ye]&&le>=mt[Ye]&&De.audio.play("tick",{})}}}}function i1(t,e){let n=we.slice,i=we.sliceSwap,r=e.room,s=uo(t,Tl()),o=_p(r,e.sub),a=zg(t.s,t.Q,new C),l=(he[r]||he.CORE).fog,c=Ar(i,n);return{kind:"SLICE",from:null,to:r,duration:n,swapAt:-1,swapKind:null,cutAt:c,pose(u,h){return ho(u,n)<i?(uo(s,h),h.exitU=0,h.enterU=0,h.counter=0,h.flashCode=null,h):(Au(h,r==="CORE"),h.s=1,h.pivot.copy(a),h.Q.set(0,0,0),h.cam.pos.copy(o.pos),h.cam.target.copy(o.target),h.cam.fov=o.fov,h.cam.offsetY=o.offsetY,h.cam.roll=o.roll,h.fog=l,h.alt=(he[r]||he.CORE).alt,h.shellFrom=0,h.shellTo=1,h.exitU=1,h.enterU=1,h)},cues(u,h,d){h<c&&u>=c&&d&&d.t0&&d.app&&d.app.tier==="T0"&&d.t0.show(e)}}}function r1(t,e,n,i={}){let r=n.room,s=Gg(e,r),o=Math.max(we.retargetMin,we.retargetFactor*OI(s,e,r)),a;if(s==="DIVE"){let l=he[Vg(r)].stratum;a=$g(t,l,{to:r,sub:n.sub,D:o,tb0:t.s>1.0001?480:0})}else s==="RECALL"?a=Xg(t,e,{D:o}):a=Yg(t,e,r,{sub:n.sub,D:o,vel:t.vel,shellFrom0:i.shellFrom0});return a.retarget=!0,a.from=e,a}var kI=[];function s1(){return kI}var jn=Tl(),vn=Tl(),ca=Tl(),nx={pos:new C,target:new C,fov:35,offsetY:0,roll:0},bp={pos:new C,target:new C,fov:35,offsetY:0,roll:0},Ci={strata:new Float32Array([1,1,1,1,1,1,1]),gap:.02,rim:1,pillar:1,morph:"none"},Xe=null,sr=null,Ru={},Rl=null,jg=0,Iu=0,Ap=0,Zr="forward",Mp=0,Lu=0,Zg=!1,Kg=!1,Wi=null,Cl=null,Du=-1,Nu=null,Ou="",po=0,Sp=new Set,de={phase:"idle",path:null,from:null,to:null,u:0,t:0,speed:1,scrubbing:!1,swapped:!1},ua={active:!1,kind:null},o1=new WeakSet,mo=!1,Jg=600,Qg=null;function BI(t,e,n,i){if(!t||o1.has(t))return;o1.add(t);let r=s1();if(!r.length)return;let s={kind:t.kind,from:e?e.room:J.room,to:n?n.room:J.room,first:t.kind==="DIVE"?!(W.data&&W.data.firstDive):!Sp.has(n?n.room:J.room),reduced:!!(Ft.reducedMotion||J.tier==="T0"),retarget:!!i};for(let o=0;o<r.length;o++)try{r[o](t,s)}catch{}}var ix=t=>!!(de.path&&de.path.planned&&typeof de.path.planned.has=="function"&&de.path.planned.has(t)),h1=(t,e)=>t&&typeof t[e]=="function",Gt=(t,e,n,i,r)=>h1(t,e)?t[e](n,i,r):void 0;function zI(t){let e=Xe.pillar;if(!e||Ci.pillar===t)return;Ci.pillar=t;let n=e.userData;if(n.ribbon&&n.ribbon.setAlpha(t),n.beads){n.beads.visible=t>.001;let i=n.beads.material;i.uniforms.uAlpha.value=t,i.transparent=t<.999}e.visible=t>.001}function VI(t){Xe.rim&&Ci.rim!==t&&(Ci.rim=t,Xe.rim.setAlpha(t))}function rx(t){if(!Xe.renderer)return;Ke.scaleAbout(t.s,t.pivot),Re.setPose(t.cam),t.fog>=0&&tr.set(t.fog),yn.setFade(-1,t.fade.mini),yn.setFade(0,t.fade.key),yn.setFade(1,t.fade.vin),yn.setFade(2,t.fade.parent);let e=yn.structure(1);if(e){for(let r=0;r<7;r++)Ci.strata[r]!==t.vinStrata[r]&&(Ci.strata[r]=t.vinStrata[r],e.setStratumFade(r,t.vinStrata[r]));Ci.gap!==t.vinGap&&(Ci.gap=t.vinGap,e.setGap(t.vinGap))}Xe.key&&(t.morph.kind!=="none"?Xe.key.setMorph(t.morph.kind,t.morph.i,t.morph.tMs,t.morph.D):Ci.morph!=="none"&&Xe.key.setMorph("none",3,0,1),Ci.morph=t.morph.kind),VI(t.rim),zI(t.pillar);let n=de.to?at.shell(de.to.room):null,i=Wi?at.shell(Wi):null;i&&i!==n&&(i.setAlpha(t.shellFrom),i.setIris("top",t.iris.fromTop),i.setIris("bottom",t.iris.fromBottom)),n&&(n.setAlpha(t.shellTo),n.setIris("top",t.iris.toTop),n.setIris("bottom",t.iris.toBottom))}function d1(){GI(vn),Xe.renderer&&(vn.cam.pos.copy(Re.pose.pos),vn.cam.target.copy(Re.pose.target),vn.cam.fov=Re.pose.fov,vn.cam.offsetY=Re.pose.offsetY,vn.cam.roll=Re.pose.roll,vn.s=Ke.s,vn.Q.copy(Ke.Q),Ke.fixedPoint(vn.pivot),vn.fog=tr.density,vn.fade.mini=yn.fade(-1),vn.fade.key=yn.fade(0),vn.fade.vin=yn.fade(1),vn.fade.parent=yn.fade(2),vn.vel.copy(Re.velocity)),vn.alt=un.altitude()}function GI(t){t.vinStrata.set(Ci.strata),t.vinGap=Ci.gap,t.rim=Ci.rim,t.pillar=Ci.pillar,t.morph.kind="none",t.exitU=0,t.enterU=0,t.counter=0,t.flashCode=null,t.shellFrom=1,t.shellTo=0,t.iris.fromTop=t.iris.fromBottom=t.iris.toTop=t.iris.toBottom=0}function ha(){let t=un.current||{room:"CORE",sub:null};at.restPose(t.room,t.sub,nx)}function HI(t){sx();let e=t==="LIFT"?"liftRumble":t==="DIVE"||t==="RECALL"?"whoosh":null;e&&Xe.audio&&(Cl=Xe.audio.start(e,{speed01:0}))}function sx(){if(Cl){try{Cl.stop()}catch{}Cl=null}}function WI(){let t=document.getElementById("fx");if(!t)return;let e=document.createElement("i");e.className="slice",t.appendChild(e),it(we.slice+40,()=>{e.parentNode&&e.parentNode.removeChild(e)})}function f1(t,e,n,i){if(Ft.reducedMotion||J.tier==="T0")return i1(t,n);if(i)return r1(t,i,n,{shellFrom0:t.shellTo});let s=at.get(n.room);if(h1(s,"entryPath")){let a=at.call(n.room,"entryPath",e.room,t);if(a)return a}let o=Gg(e.room,n.room);if(o==="DIVE"){let a=n.room==="WORKSHOP"?"MEMBERS":n.room==="ZENITH"?"SIGNAL":n.room;return $g(t,he[a].stratum,{first:!(W.data&&W.data.firstDive),fromUnfold:!!J.unfolded,sub:n.sub,to:n.room})}return o==="RECALL"?Xg(t,e.room):Yg(t,e.room,n.room,{sub:n.sub})}function ox(t,e,n,i){BI(t,e,n,!!i.retargeted),mo=!!i.play,mo&&(Jg=i.skipMs!=null?i.skipMs:600),de.path=t,de.from=e,de.to=n,de.t=0,de.u=0,de.speed=1,de.swapped=!1,de.phase="transition",de.scrubbing=!!i.scrub,Lu=0,Zr="forward",jg=0,Iu=pe.at(),Ap=Iu,Zg=!1,Rl=null,Kg=!0,wp++,de.scrubbing||cx(Iu,!0),Ru=i,J.u=0,t.kind==="SLICE"&&WI(),HI(t.kind),_e.emit("travel:start",{from:e,to:n,kind:t.kind,duration:t.duration})}var a1=new WeakSet;function p1(t){let e=at.group(t);if(!(!e||!Xe.renderer||!Re.camera||a1.has(e))){a1.add(e);try{Xe.renderer.warm(e,Re.camera,Xe.scene)}catch{}}}function l1(t,e){let n=un.current;d1(),at.ensure(t.room),p1(t.room),Wi=n.room;let i=f1(vn,n,t,null);return Mi("transition"),at.call(n.room,"depart"),Gt(Xe.datum,"depart"),Xe.renderer&&yn.setHallLod(null),_e.emit("room:depart",{room:n.room,to:t}),ox(i,n,t,e),new Promise(r=>{sr=r})}function m1(){let t=de.path;if(!t)return J.room;let e=Wi||de.from&&de.from.room||J.room,n=de.to.room;if(t.swapAt>=0)return de.swapped?n:e;if(t.kind==="SLICE")return de.u>=(t.cutAt||.5)?n:e;if(t.kind!=="LIFT")return de.u<.5?e:n;let i=vn.alt;for(let o of[e,n]){let a=he[o];if(a&&i>=a.floor&&i<=a.ceil)return o}let r=e,s=1/0;for(let o of An.concat(["ZENITH"])){let a=he[o],l=i<a.floor?a.floor-i:i>a.ceil?i-a.ceil:0;l<s&&(s=l,r=o)}return r}function $I(t,e){let n=m1(),i=de.to.room,r=Wi;if(sr){let a=sr;sr=null,a(!1)}_e.emit("travel:end",{from:de.from,to:de.to,kind:de.path.kind,completed:!1}),n===i&&i!==t.room&&(at.call(i,"depart"),at.call(i,"exit",1)),Wi=n,at.ensure(t.room),p1(t.room);for(let a of at.residents())a!==t.room&&a!==n&&a!==r&&at.release(a);r&&r!==n&&r!==t.room&&(at.call(r,"exit",1),ax(r)),uo(vn,ca),Xe.renderer&&(ca.vel.copy(Re.velocity),ca.Q.copy(Ke.Q),ca.s=Ke.s);let s={room:n,sub:null,hash:`#/${he[n].slug}`},o=f1(ca,s,t,n);return Rl=null,ox(o,s,t,{...e,retargeted:!0,play:!1}),new Promise(a=>{sr=a})}function ax(t){it(we.releaseSourceMs,()=>{t===J.room&&de.phase!=="transition"||de.phase==="transition"&&(de.to.room===t||Wi===t)||at.release(t)})}function lx(t,e,n){let i=t.hash;try{let r=location.hash;e==="history"?r!==i&&!(r===""&&i==="#/core")&&window.history.replaceState(null,"",i):n||e==="hash"||e==="go"||e==="deeplink"||r===i?window.history.replaceState(null,"",i):window.history.pushState(null,"",i)}catch{}Ou=location.hash}function g1(){let t=de.path,e=de.from,n=de.to;if(t.pose(1,jn),rx(jn),uo(jn,vn),sx(),ua.active=!1,mo){XI(t,e,n);return}let i=!Sp.has(n.room);Sp.add(n.room),po+=1,J.room=n.room,J.route=n,J.u=0,un.current=n,de.phase="idle",de.scrubbing=!1,de.u=0;let r=t.kind;Xe.renderer&&yn.setHallLod(n.room),at.show(n.room,!0),at.call(n.room,"enter",1),Mi("idle"),at.call(n.room,"arrive",{first:i,sub:n.sub,kind:r,arrivals:po});let s=n;n.sub&&at.call(n.room,"setSub",n.sub,{instant:!0})===!1&&(s=Xr(`#/${he[n.room].slug}`),un.current=s,J.route=s,Ru={...Ru,replace:!0}),Gt(Xe.datum,"counter",he[n.room].alt,0),Gt(Xe.datum,"flashCode",null),Gt(Xe.datum,"arrive",n.room),Gt(Xe.chrome,"setRoom",n.room),Gt(Xe.keyNav,"setNeedle",he[n.room].alt),Gt(Xe.keyNav,"setCurrent",n.room),Gt(Xe.keyNav,"lockTwin"),Xe.audio&&!ix("arrivalLock")&&Xe.audio.play("arrivalLock",{root:he[n.room].root}),Gt(Xe.edges,"twitch"),ve.isPhone&&Sr(Mr.lock),document.title=su(s),lx(s,Ru.source,!!Ru.replace),W.set("lastRoom",s.hash),r==="DIVE"&&W.data&&!W.data.firstDive&&W.set("firstDive",!0),ha(),un.lastTravel={kind:r,from:e.hash,to:s.hash,plannedMs:t.duration,ms:pe.at()-Ap,completed:!0},de.path=null,_e.emit("room:arrive",{room:n.room,sub:s.sub,first:i,kind:r,arrivals:po}),_e.emit("route:change",{route:s,prev:e}),_e.emit("travel:end",{from:e,to:s,kind:r,completed:!0}),J.tier==="T0"&&Xe.t0&&Gt(Xe.t0,"show",s);for(let a of at.residents())a!==n.room&&ax(a);let o=sr;sr=null,o&&o(!0)}function XI(t,e,n){mo=!1;let i=n.room;J.u=0,de.phase="idle",de.scrubbing=!1,de.u=0,Xe.renderer&&yn.setHallLod(i),at.show(i,!0),at.call(i,"enter",1),Mi("idle"),po+=1,at.call(i,"arrive",{first:!1,sub:un.current.sub,kind:t.kind,arrivals:po}),Gt(Xe.datum,"counter",he[i].alt,0),Gt(Xe.datum,"flashCode",null),Gt(Xe.datum,"arrive",i),Gt(Xe.keyNav,"setNeedle",he[i].alt),Gt(Xe.keyNav,"setCurrent",i),Gt(Xe.keyNav,"lockTwin"),Xe.audio&&!ix("arrivalLock")&&Xe.audio.play("arrivalLock",{root:he[i].root}),Gt(Xe.edges,"twitch"),ve.isPhone&&Sr(Mr.lock),ha(),un.lastTravel={kind:t.kind,from:e.hash,to:un.current.hash,plannedMs:t.duration,ms:pe.at()-Ap,completed:!0},de.path=null,_e.emit("room:arrive",{room:i,sub:un.current.sub,first:!1,kind:t.kind,arrivals:po}),_e.emit("travel:end",{from:e,to:un.current,kind:t.kind,completed:!0});let r=sr;sr=null,r&&r(!0)}function YI(){let t=de.path,e=de.from,n=de.to;t.pose(0,jn),rx(jn),uo(jn,vn),sx(),ua.active=!1,mo=!1,de.phase="idle",de.scrubbing=!1,de.u=0,J.u=0;let i=Wi||e.room;Xe.renderer&&yn.setHallLod(i),at.call(i,"exit",0),at.show(i,!0),Mi("idle"),at.call(i,"arrive",{first:!1,sub:un.current.sub,kind:"REVERT",arrivals:po}),Gt(Xe.datum,"counter",he[i].alt,0),Gt(Xe.datum,"arrive",i),Gt(Xe.keyNav,"setNeedle",he[i].alt),Gt(Xe.keyNav,"setCurrent",i),un.lastTravel={kind:t.kind,from:e.hash,to:n.hash,plannedMs:t.duration,ms:pe.now-Ap,completed:!1},de.path=null,_e.emit("travel:end",{from:e,to:n,kind:t.kind,completed:!1}),n.room!==i&&ax(n.room),ha();let r=sr;sr=null,r&&r(!1)}var qg={speed01:0,pan:0};function ex(t){let e=de.path;if(e.swapAt>=0&&(!de.swapped&&t>=e.swapAt?(Xe.renderer&&(e.pose(Math.max(0,e.swapAt-1e-6),ca),Ke.scaleAbout(e.swapKind==="grow"?1e3:.001,ca.pivot),Rl=Ke.rebase(e.swapKind)),de.swapped=!0):de.swapped&&t<e.swapAt&&(Rl&&Xe.renderer&&Ke.unrebase(Rl),Rl=null,de.swapped=!1)),e.pose(t,jn),ua.active=!0,ua.kind=e.kind,e.fx)try{e.fx(t,ua)}catch{}rx(jn),mo||(Wi&&Wi!==de.to.room&&at.call(Wi,"exit",jn.exitU),at.call(de.to.room,"enter",jn.enterU)),Gt(Xe.keyNav,"setNeedle",jn.alt),Xe.audio&&Xe.audio.setRootU(de.from.room,de.to.room,t),Gt(Xe.datum,"counter",jn.alt,jn.counter),Gt(Xe.datum,"flashCode",jn.flashCode),Cl&&(qg.speed01=jn.speed01,qg.pan=jn.pan,Cl.set(qg)),e.cues&&e.cues(t,jg,Qg||Xe),!Zg&&t>=we.interactiveU&&(Zg=!0,at.show(de.to.room),_e.emit("travel:interactive",{to:de.to})),J.u=t,de.u=t,jg=t,uo(jn,vn)}function qI(t){if(!Xe.renderer||J.phase==="boot"||J.phase==="start")return;let e=J.room,n=at.get(e);if(n&&typeof n.livePose=="function"&&at.call(e,"livePose",bp,t)===!0){let i=he[e].anchor;bp.pos.add(i),bp.target.add(i),Re.setPose(bp);return}Re.setPose(nx)}function jI(t){let e=pe.now,n=e-Iu;if(Iu=e,Kg&&(Kg=!1,n<0&&(n=0)),de.phase!=="transition"){ua.active=!1,qI(t);return}let i=de.path.duration,r;if(de.scrubbing)r=Lu;else if(Zr==="inertia")r=Tt(de.u+Mp*n/1e3),Mp*=Math.pow(bi.inertiaDecay,n/bi.frameMs),(Math.abs(Mp)<.05||r<=0||r>=1)&&(Zr=r<.5?"reverse":"forward",de.t=ho(r,i));else if(Zr==="reverse"){if(de.t=Math.max(0,de.t-n*de.speed),r=cn.camera(de.t/i),de.t<=0){ex(0),YI();return}}else de.t=Math.min(i,de.t+n*de.speed),r=cn.camera(de.t/i);ex(r),!de.scrubbing&&Zr==="forward"&&(de.t>=i?g1():cx(e))}var Cu=0,tx=0,wp=0,c1=0;function ZI(){Cu=0,!(tx!==wp||de.phase!=="transition"||de.scrubbing||Zr!=="forward"||!de.path||!pe.running)&&(de.t=de.path.duration,ex(1),g1())}function cx(t,e){let n=(de.path.duration-de.t)/Math.max(1e-6,de.speed)-(pe.at()-t);if(n>400&&!e)return;let i=performance.now()+Math.max(0,n);Cu&&tx===wp&&!e&&i>=c1||(Cu&&clearTimeout(Cu),tx=wp,c1=i,Cu=setTimeout(ZI,Math.max(0,n)))}function Pu(){if(Du>=0&&(Pn(Du),Du=-1),Nu){let t=Nu;Nu=null,t(!1)}}function u1(t,e,n){un.current=t,J.route=t,lx(t,n.source,!!n.replace),document.title=su(t),W.set("lastRoom",t.hash),ha(),_e.emit("route:change",{route:t,prev:e}),J.tier==="T0"&&Xe.t0&&Gt(Xe.t0,"show",t)}function KI(t,e){Pu();let n=un.current,i=at.call(t.room,"setSub",t.sub,{instant:Ft.reducedMotion});if(i===!1||i===void 0){let r=Xr(`#/${he[t.room].slug}`);return n.sub&&at.call(t.room,"setSub",null,{instant:!0}),u1(r,n,{...e,replace:!0}),Promise.resolve(!0)}return new Promise(r=>{Nu=r,Du=it(Math.max(0,+i||0),()=>{Du=-1,Nu=null,u1(t,n,e),r(!0)})})}function JI(){Ou=location.hash,un.go(location.hash,{source:"history"})}function QI(){location.hash!==Ou&&(Ou=location.hash,un.go(location.hash,{source:"hash"}))}var un={state:de,current:null,lastTravel:null,init(t){if(Xe=t,t.director=un,t.halls=at,t.audio){let e=Object.create(t.audio);e.play=(n,i)=>ix(n)?null:t.audio.play(n,i),Qg=Object.create(t),Qg.audio=e}return QS({restPose:(e,n,i)=>at.restPose(e,n,i),faceFrame:t.key?(e,n)=>t.key.faceFrame(e,n):null}),un.current=Xr("#/core"),J.room="CORE",J.route=un.current,Sp.add("CORE"),Ou=location.hash,pe.add(jI,Nt.DIRECTOR),window.addEventListener("popstate",JI),window.addEventListener("hashchange",QI),_e.on("layout:change",ha),at.ensure("CORE"),at.show("CORE",!0),ha(),t.renderer&&J.phase!=="boot"&&J.phase!=="start"&&Re.setPose(nx),un},settle(){de.phase==="transition"||J.room!=="CORE"||(ha(),at.call("CORE","enter",1),at.call("CORE","arrive",{first:!0,sub:null,kind:"BOOT",arrivals:po}),Gt(Xe.chrome,"setRoom","CORE"),Gt(Xe.keyNav,"setCurrent","CORE"),Gt(Xe.keyNav,"setNeedle",0))},go(t,e={}){try{let n=e.source||"go",i={...e,source:n},r=fg(Xr(t),n);r.status&&Gt(Xe.status,"say",r.status,r.vars||{}),r.shudder&&(Gt(Xe.keyNav,"shudder",r.shudder),J.room==="CORE"&&de.phase!=="transition"&&Xe.key&&Xe.key.shudder(6));let s=r.route;if(de.phase==="transition")return s.hash===de.to.hash?new Promise(a=>{_e.once("travel:end",l=>a(!!l.completed))}):(Pu(),$I(s,i));let o=un.current;return s.hash===o.hash?(Pu(),location.hash&&location.hash!==s.hash&&lx(s,"history",!0),Promise.resolve(!0)):s.room===o.room?KI(s,i):(Pu(),l1(s,i))}catch{return Promise.resolve(!1)}},speedUp(){if(!(de.phase!=="transition"||de.scrubbing||Zr!=="forward")){if(mo){let t=de.path.duration-de.t;t>Jg&&(de.speed=Math.max(de.speed,t/Math.max(1,Jg))),cx(pe.now,!0);return}de.speed=we.skipSpeed}},get playing(){return mo},fxOut(){return ua},pose(){return vn},predict(t){return de.phase!=="transition"||de.scrubbing||Zr!=="forward"||!(t>=de.t)?null:performance.now()+(t-de.t)/Math.max(1e-6,de.speed)},play(t,e={source:"show",skipMs:600}){try{if(!t||typeof t.pose!="function"||de.phase==="transition")return Promise.resolve(!1);Pu();let n=un.current;t.from||(t.from=n.room),t.to||(t.to=n.room),d1(),Wi=n.room,Mi("transition"),at.call(n.room,"depart"),Gt(Xe.datum,"depart"),_e.emit("room:depart",{room:n.room,to:n});let i={source:"show",skipMs:600,...e||{},play:!0};return ox(t,n,n,i),new Promise(r=>{sr=r})}catch{return Promise.resolve(!1)}},scrub:{begin(t){if(Ft.reducedMotion||J.tier==="T0"||!Xe.renderer)return!1;if(de.phase==="transition")return de.scrubbing=!0,Lu=de.u,Zr="forward",!0;let e=fg(Xr(t),"nav").route;return e.room===un.current.room?!1:(l1(e,{source:"nav",scrub:!0}),!0)},set(t){de.phase==="transition"&&de.scrubbing&&(Lu=Tt(t))},end(t=0){de.phase!=="transition"||!de.scrubbing||(de.scrubbing=!1,de.u=Lu,de.speed=1,Mp=t||0,Zr="inertia")}},altitude(){return de.phase==="transition"?vn.alt:(he[J.room]||he.CORE).alt},busy(){return de.phase==="transition"},logicalSource(){return de.phase==="transition"?Wi:null},logicalRoom(){return de.phase==="transition"?m1():J.room}};var ux=0;function e3(t,e){let n=e==null?t.textContent:String(e);t.textContent="";let i=[];for(let r of n){let s=document.createElement("span");s.className="lock-letter",s.textContent=r,t.appendChild(s),i.push(s)}return i}function hx(t,e){return t.style.opacity="0",Un(e,n=>{t.style.opacity=String(n)},cn.reveal).done.then(()=>{t.style.opacity=""})}function x1(t,e={}){if(!t)return Promise.resolve();let n=e.weight||220,i=e.ms||we.lockIn;if(Ft.reducedMotion)return hx(t,we.lockInReduced);if(ux>=2)return Promise.resolve();ux+=1;let r=t.textContent,s=e3(t,r),o=W.shrp||28,a=-1,l=c=>{let u=cn.reveal(c),h=Math.round(u*5)/5,d=h!==a?`"SHRP" ${(o*h).toFixed(1)}, "wght" ${Math.round(120+(n-120)*h)}, "CRSV" 0, "slnt" 0`:null;a=h;let f=pe.now/1e3;for(let g=0;g<s.length;g++){let x=s[g].style;d&&(x.fontVariationSettings=d),x.transform=u<1?`translateX(${(Math.sin(17*f+g)*(1-u)*4).toFixed(2)}px)`:""}};return l(0),Un(i,l).done.then(()=>{ux-=1,t.textContent===r&&(t.textContent=r)})}function v1(t,e={}){if(!t)return Promise.resolve();let n=e.msPerChar||we.revealMsPerChar,i=e.maxMs||we.revealMax;if(Ft.reducedMotion)return hx(t,we.lockInReduced);let r=Math.min(i,Math.max(1,t.textContent.length*n));t.classList.add("reveal-mask");let s=o=>{t.style.setProperty("--reveal",`${(o*108).toFixed(1)}%`),t.style.opacity=String(Math.min(1,o*2))};return s(0),Un(r,s).done.then(()=>{t.classList.remove("reveal-mask"),t.style.removeProperty("--reveal"),t.style.opacity=""})}function y1(t,e,n={}){if(!t)return Promise.resolve();let i=n.cps||we.beamCps;if(Ft.reducedMotion)return t.textContent=String(e),hx(t,we.lockInReduced);t.textContent="";let r=[];for(let c of String(e)){let u=document.createElement("span");u.className="beam-letter",u.textContent=c,t.appendChild(u),r.push(u)}let s=document.getElementById("fx"),o=document.createElement("i");o.className="beam-head",s&&s.appendChild(o);let a=r.map(c=>c.getBoundingClientRect()),l=1e3/i;return new Promise(c=>{let u=0,h=()=>{if(u>=r.length){it(160,()=>{o.parentNode&&o.parentNode.removeChild(o)}),c();return}let d=a[u];o.style.transform=`translate3d(${(d.right-1.5).toFixed(1)}px, ${(d.bottom-d.height*.2).toFixed(1)}px, 0)`,r[u].classList.add("is-lit"),u+=1,it(l,h)};h()})}var lt={datum:null,line:null,label:null,title:null,level:null,flash:null,giant:null},mx=null,dx=!1,Fu="CORE",Uu=!1,_1=null,Ep="",gx=0,b1=new C,M1=new C,S1=new C,xx=!1;function Pl(t,e,n,i){let r=document.createElement(t);return r.id=e,n&&(r.className=n),i.appendChild(r),r}function fx(){return mx??(he[Fu]||he.CORE).giant}function px(t){lt.giant&&lt.giant.textContent!==t&&(lt.giant.textContent=t)}function t3(){if(!lt.giant||!Re.camera||Uu)return;xx||(b1.copy(Re.camera.position),xx=!0),M1.setFromMatrixColumn(Re.camera.matrixWorld,0);let t=Math.max(.001,S1.copy(Re.pose.target).sub(Re.camera.position).length()),e=S1.copy(Re.camera.position).sub(b1).dot(M1)*Re.camera.zoom*(ve.h/(2*Math.tan(Re.camera.fov*Math.PI/360)))/t,n=Math.max(-200,Math.min(200,-.25*e));Math.abs(n-gx)<.25||(gx=n,lt.giant.style.transform=`translate3d(${n.toFixed(1)}px,-50%,0)`)}var ku={init(t){let e=document.getElementById("frame");return lt.giant=document.getElementById("giant"),e&&(lt.datum=document.getElementById("datum")||Pl("div","datum","",e),lt.datum.classList.add("is-out"),lt.line=Pl("i","datum-line","",lt.datum),lt.label=Pl("p","datum-label","t-label",lt.datum),lt.title=Pl("h1","datum-title","t-display",lt.datum),lt.level=Pl("p","datum-level","t-micro",lt.datum),lt.flash=Pl("p","datum-flash","t-label",e),lt.flash.setAttribute("aria-hidden","true"),pe.add(t3,Nt.UI)),ku},arrive(t,e={}){Fu=he[t]?t:"CORE";let n=he[Fu];if(!lt.datum)return;let i=Fu==="NADIR"&&W.data&&W.data.nadirOpen;lt.title.textContent=i&&n.titleOpen?n.titleOpen:n.title,lt.title.dataset.room=Fu,lt.label.textContent=`${n.num} · ${n.code}`,lt.level.textContent=`▽ ${n.level}`,lt.datum.classList.remove("is-out"),lt.datum.classList.remove("is-drawn");let r=()=>{lt.datum.classList.add("is-drawn")};e.instant?r():requestAnimationFrame(r),e.instant||x1(lt.title,{weight:220,ms:480}),Uu=!1,Ep="",xx=!1,gx=0,lt.giant&&(lt.giant.classList.remove("is-counter"),lt.giant.style.transform="",px(fx()),lt.giant.classList.add("is-in"),dx?lt.giant.dataset.electrum="":delete lt.giant.dataset.electrum)},depart(){lt.datum&&lt.datum.classList.add("is-out"),lt.giant&&lt.giant.classList.remove("is-in")},setGiant(t,e={}){mx=t==null?null:String(t),dx=!!e.electrum,!(!lt.giant||Uu)&&(px(fx()),dx?lt.giant.dataset.electrum="":delete lt.giant.dataset.electrum)},counter(t,e){if(!lt.giant)return;let n=e>0;if(n!==Uu&&(Uu=n,lt.giant.classList.toggle("is-counter",n),n?lt.giant.style.transform="":(Ep="",px(fx()))),!n)return;let i=Tv(Math.round(t),0);i!==Ep&&(Ep=i,lt.giant.textContent=i)},flashCode(t){if(!(!lt.flash||t===_1))if(_1=t,t&&he[t]){let e=he[t];lt.flash.textContent=`${e.num} · ${e.code}`,lt.flash.classList.add("is-on")}else lt.flash.classList.remove("is-on")},yPx(){return ve.kind==="desktop"?ve.h*xt.desktop.datumFrac:xt.phone.datumPx+ve.safe.t},setVisible(t){lt.datum&&(lt.datum.hidden=!t),lt.giant&&(lt.giant.hidden=!t)}};var R1="http://www.w3.org/2000/svg",hi=[],da=null,Tp=null,Bu=new C,vx=new C,Kr={x:0,y:0,depth:0,visible:!1},w1=0,Rp=new Float64Array(64);function A1(t,e,n){let i=document.createElementNS(R1,t);return i.setAttribute("class",e),i.dataset.owner=n,i}var E1=t=>`${t<0?"−":t>0?"+":""}${Math.abs(t).toFixed(2)}`;function n3(t){let e=t.leader||(t.focused?{side:"right",len:40,rise:-24}:null);if(!e||!t.path)return;let n=e.side==="left"?-1:1,i=e.rise||0,r=t.sx+n*Math.abs(i),s=t.sy+i,o=r+n*Math.max(xt.leader.elbowMin,Math.min(xt.leader.runMax,e.len||40));t.path.setAttribute("d",`M${t.sx.toFixed(1)} ${t.sy.toFixed(1)}L${r.toFixed(1)} ${s.toFixed(1)}L${o.toFixed(1)} ${s.toFixed(1)}`),t.endX=o+n*6,t.endY=s}function Il(t,e){if(t.shown===e)return;t.shown=e;let n=e&&(t.el||t.focused);t.el&&t.el.classList.toggle("is-hidden",!e),t.button&&t.button.classList.toggle("is-hidden",!e),t.path&&t.path.classList.toggle("is-hidden",!(n&&(t.leader||t.focused))),t.cross&&t.cross.classList.toggle("is-hidden",!(n&&(t.crossOn||t.focused))),t.coordEl&&t.coordEl.classList.toggle("is-hidden",!(e&&t.coordOn))}function T1(t){let e=t.shown;t.shown=!e,Il(t,e)}function i3(t){if(!Re.camera)return;let e=1-Math.exp(-(t*1e3)/120),n=pe.now-w1>=1e3/we.coordHz;n&&(w1=pe.now);let i=0;for(let s=0;s<hi.length;s++){let o=hi[s];o.get(Bu),Re.project(Bu,Kr);let a=Kr.depth>0||!o.hideBehind;if(o.want=o.visible&&a,!!o.want){if(i++,!o.init||o.lowpass<=0)o.sx=Kr.x,o.sy=Kr.y,o.init=!0;else{let l=o.lowpass===120?e:1-Math.exp(-(t*1e3)/o.lowpass);o.sx+=(Kr.x-o.sx)*l,o.sy+=(Kr.y-o.sy)*l}o.screen.x=o.sx,o.screen.y=o.sy,n&&o.coordEl&&(Ke.toCanonical(Bu,vx),o.coordEl.textContent=`x ${E1(vx.x)} · y ${E1(vx.y)}`)}}let r=-1/0;if(i>Er.max){Rp.length<hi.length&&(Rp=new Float64Array(hi.length*2));let s=0;for(let a=0;a<hi.length;a++)hi[a].want&&(Rp[s++]=hi[a].priority);r=Rp.subarray(0,s).sort()[s-Er.max]}Er.visibleCount=0;for(let s=0;s<hi.length;s++){let o=hi[s],a=o.want&&(o.priority>=r||o.focused);if(o.screen.visible=a,Il(o,a),!a||(Er.visibleCount++,Math.abs(o.sx-o.wx)<.1&&Math.abs(o.sy-o.wy)<.1))continue;o.wx=o.sx,o.wy=o.sy;let l=o.sx.toFixed(1),c=o.sy.toFixed(1);if(o.button&&(o.button.style.transform=`translate3d(${l}px,${c}px,0)`),o.cross&&o.cross.setAttribute("transform",`translate(${l} ${c})`),o.coordEl&&(o.coordEl.style.transform=`translate3d(${(o.sx+8).toFixed(1)}px,${(o.sy+6).toFixed(1)}px,0)`),n3(o),o.el){let u=o.path&&(o.leader||o.focused)?o.endX:o.sx,h=o.path&&(o.leader||o.focused)?o.endY:o.sy,d=o.leader&&o.leader.side==="left";o.el.style.transform=`translate3d(${u.toFixed(1)}px,${h.toFixed(1)}px,0) translate(${d?"-100%":"0"},-50%)`}}}var Er={max:24,visibleCount:0,init(t){da=document.getElementById("overlay"),Tp=document.getElementById("leaders");let e=()=>t.app.tier==="T1"||ve.isPhone?xt.leader.maxAnchorsLow:xt.leader.maxAnchors;return Er.max=e(),t.bus.on("tier:change",()=>{Er.max=e()}),t.bus.on("layout:change",()=>{Er.max=e();for(let n of hi)n.wx=NaN}),pe.add(i3,Nt.OVERLAY),Er},add(t){let e=String(t.owner||"anon"),n={owner:e,id:t.id!=null?String(t.id):null,get:t.get,leader:t.leader||null,crossOn:t.cross!=null?!!t.cross:!!t.leader,coordOn:!!t.coord,priority:t.priority||0,lowpass:t.lowpass!=null?t.lowpass:we.labelLowpass,hideBehind:t.hideBehind!==!1,visible:!0,want:!1,shown:!0,focused:!1,init:!1,sx:0,sy:0,wx:NaN,wy:NaN,endX:0,endY:0,screen:{x:0,y:0,visible:!1},el:t.el||null,button:null,path:null,cross:null,coordEl:null};if(n.el&&(n.el.classList.add("anchor"),t.scrim!==!1&&n.el.classList.add("scrim"),n.el.dataset.owner=e,n.id&&(n.el.dataset.id=n.id),da&&da.appendChild(n.el)),Tp){n.path=A1("path","leader",e),n.path.setAttribute("pathLength","1"),n.cross=A1("g","cross",e);for(let[s,o,a,l]of[[-3.5,0,3.5,0],[0,-3.5,0,3.5]]){let c=document.createElementNS(R1,"line");c.setAttribute("x1",s),c.setAttribute("y1",o),c.setAttribute("x2",a),c.setAttribute("y2",l),n.cross.appendChild(c)}Tp.appendChild(n.path),Tp.appendChild(n.cross)}n.coordOn&&da&&(n.coordEl=document.createElement("span"),n.coordEl.className="t-micro coord",da.appendChild(n.coordEl));let i=s=>{n.focused=s,n.cross&&n.cross.classList.toggle("focus",s),n.path&&n.path.classList.toggle("focus",s),n.wx=NaN,T1(n)};if(t.button&&da){let s=document.createElement("button");s.type="button",s.className="proxy",s.dataset.owner=e,n.id&&(s.dataset.id=n.id),s.setAttribute("aria-label",t.button.label||""),t.button.size&&t.button.size>44&&(s.style.width=`${t.button.size}px`,s.style.height=`${t.button.size}px`,s.style.margin=`${-t.button.size/2}px 0 0 ${-t.button.size/2}px`);let o=t.button;s.addEventListener("click",()=>{typeof n.onActivate=="function"&&n.onActivate()}),s.addEventListener("focus",()=>{i(!0),n.onFocus&&n.onFocus()}),s.addEventListener("blur",()=>{i(!1),n.onBlur&&n.onBlur()}),n.onActivate=o.onActivate,n.onFocus=o.onFocus||null,n.onBlur=o.onBlur||null,da.appendChild(s),n.button=s}n.shown=!1,Il(n,!1),Il(n,!0),hi.push(n);let r={el:n.el,button:n.button,screen:n.screen,setVisible(s){if(n.visible=!!s,!s){Il(n,!1);return}n.shown||!Re.camera||(n.get(Bu),Re.project(Bu,Kr),(Kr.depth>0||!n.hideBehind)&&(n.init||(n.sx=Kr.x,n.sy=Kr.y,n.init=!0),n.wx=NaN,Il(n,!0),n.button&&(n.button.style.transform=`translate3d(${n.sx.toFixed(1)}px,${n.sy.toFixed(1)}px,0)`)))},setAlpha(s){let o=String(Math.max(0,Math.min(1,s)));n.el&&(n.el.style.opacity=o),n.path&&(n.path.style.opacity=o)},drawIn(s=we.leaderDraw){return n.el&&n.el.classList.add("is-pending"),n.path&&(n.path.classList.remove("is-drawing"),n.path.style.strokeDasharray="1",n.path.style.strokeDashoffset="1"),new Promise(o=>{requestAnimationFrame(()=>{n.path&&(n.path.classList.add("is-drawing"),n.path.style.transitionDuration=`${s}ms`,n.path.style.strokeDashoffset="0"),it(s,()=>{n.el&&n.el.classList.remove("is-pending"),o()})})})},update(s){"leader"in s&&(n.leader=s.leader||null),"cross"in s&&(n.crossOn=!!s.cross),"coord"in s&&(n.coordOn=!!s.coord),s.button&&n.button&&(s.button.label!=null&&n.button.setAttribute("aria-label",s.button.label),s.button.onActivate&&(n.onActivate=s.button.onActivate)),"priority"in s&&(n.priority=s.priority||0),n.wx=NaN,T1(n)},remove(){let s=hi.indexOf(n);s>=0&&hi.splice(s,1);for(let o of[n.el,n.button,n.path,n.cross,n.coordEl])o&&o.parentNode&&o.parentNode.removeChild(o)}};return n.api=r,r},clear(t){for(let e=hi.length-1;e>=0;e--)hi[e].owner===t&&hi[e].api.remove()}};var _x=new Set,Dn=null,yx=null,Ll=null,Jr=null,pn={id:-1,y0:0,t0:0,y:0,t:0,h:0,base:0,moved:!1};function Dl(t){if(or.state!==t){or.state=t,Dn&&(Dn.dataset.state=t);for(let e of _x)try{e(t)}catch{}}}function r3(t,e){return t==="full"?0:t==="peek"?Math.max(0,e-120):e}function s3(t){if(or.state==="closed"||pn.id>=0||ve.kind==="phone-land"||or.state==="full"&&Jr&&Jr.contains(t.target)&&Jr.scrollTop>0)return;let e=Dn.getBoundingClientRect();pn.id=t.pointerId,pn.y0=pn.y=t.clientY,pn.t0=pn.t=t.timeStamp,pn.h=e.height,pn.base=r3(or.state,e.height),pn.moved=!1}function o3(t){if(t.pointerId!==pn.id)return;let e=t.clientY-pn.y0;if(!pn.moved&&Math.abs(e)<Ri.SLOP_PX)return;if(!pn.moved){pn.moved=!0,Dn.classList.add("is-dragging");try{Dn.setPointerCapture(t.pointerId)}catch{}}pn.y=t.clientY,pn.t=t.timeStamp;let n=Math.max(0,Math.min(pn.h,pn.base+e));Dn.style.transform=`translateY(${n.toFixed(1)}px)`}function C1(t){if(t.pointerId!==pn.id||(pn.id=-1,!pn.moved))return;Dn.classList.remove("is-dragging"),Dn.style.transform="";let e=pn.y-pn.y0,n=e/Math.max(1,pn.t-pn.t0);(Math.abs(e)>=40||Math.abs(n)>=Ri.SWIPE_V)&&(e>0?Dl(or.state==="full"?"peek":"closed"):or.state==="peek"&&Dl("full"))}var or={state:"closed",init(t){let e=document.getElementById("sheets");return e&&(Dn=document.createElement("section"),Dn.id="sheet",Dn.className="sheet",Dn.dataset.state="closed",yx=document.createElement("div"),yx.className="sheet-handle",Ll=document.createElement("div"),Ll.className="sheet-peek",Jr=document.createElement("div"),Jr.className="sheet-body",Dn.append(yx,Ll,Jr),e.appendChild(Dn),Dn.addEventListener("pointerdown",s3),Dn.addEventListener("pointermove",o3),Dn.addEventListener("pointerup",C1),Dn.addEventListener("pointercancel",C1)),or},set(t,e={}){if(Dn){if(Ll.textContent="",Jr.textContent="",Jr.scrollTop=0,e.peek&&Ll.appendChild(e.peek),t&&Jr.appendChild(t),!t&&!e.peek){Dl("closed");return}Dl(e.state==="full"?"full":e.state==="closed"?"closed":"peek")}},open(t="peek"){Dn&&(Ll.firstChild||Jr.firstChild)&&Dl(t==="full"?"full":"peek")},close(){Dl("closed")},onChange(t){return _x.add(t),()=>_x.delete(t)}};var bx="http://www.w3.org/2000/svg",Mx=new Float32Array(8),Tx=new Float32Array(8),Ol=null,Vu=[],Cp=0,P1=-1e9,Sx=!1,L1=!0,Pp=0,Ip=null,wx=null,Np=null,Zn=null,Nl=null,zu=0,Lp=null,Ax="";function fa(t,e,n,i,r){let s=document.createElement(t);return e&&(s.className=e),r&&(s.id=r),n!=null&&(s.textContent=n),i&&i.appendChild(s),s}var Ex=t=>String(t).padStart(2,"0");function Dp(t){let e=document.getElementById(t);return e?(e.classList.remove("ff-c"),e.classList.add("corner","corner--dim"),e.textContent="",e):null}function I1(t){L1=t,mn.el.sound&&mn.el.sound.setAttribute("aria-pressed",t?"true":"false"),Np&&(Np.textContent=t?"ЗВУК":"ТИХО")}function a3(){Cp&&Pn(Cp);let t=new Date(rs());Cp=it((60-t.getSeconds())*1e3-t.getMilliseconds()+20,()=>{Cp=0,mn.refresh()})}function l3(){if(!Vu.length||pe.now-P1<1e3/xt.sound.fps)return;P1=pe.now;let t=Ol&&Ol.audio;t&&L1?t.levels(Mx):Mx.fill(0);let e=xt.sound.h;for(let n=0;n<8;n++){let i=Math.max(1,Math.round(Mx[n]*e*2)/2);i!==Tx[n]&&(Tx[n]=i,Vu[n].setAttribute("y",String(e-i)),Vu[n].setAttribute("height",String(i)))}}var mn={el:{tl:null,tlName:null,tlMicro:null,tr:null,sound:null,bl:null,br:null},init(t){Ol=t;let e=mn.el;if(e.tl=Dp("c-tl"),e.tl&&(e.tlName=fa("span","t-label","SAM.VIN",e.tl,"c-tl-name"),e.tlMicro=fa("span","t-micro","",e.tl,"c-tl-micro")),e.tr=Dp("c-tr"),e.tr){let n=fa("button","",null,e.tr,"sound");n.type="button",n.setAttribute("aria-label","Звук"),Np=fa("span","t-label","ЗВУК",n,"sound-label");let i=document.createElementNS(bx,"svg");i.setAttribute("class","sound-wave"),i.setAttribute("viewBox",`0 0 ${xt.sound.w} ${xt.sound.h}`),i.setAttribute("aria-hidden","true"),Vu=[];for(let s=0;s<8;s++){let o=document.createElementNS(bx,"rect");o.setAttribute("class","bar"),o.setAttribute("x",String(s*4+.5)),o.setAttribute("width","2"),o.setAttribute("y",String(xt.sound.h-1)),o.setAttribute("height","1"),Tx[s]=1,i.appendChild(o),Vu.push(o)}let r=document.createElementNS(bx,"line");r.setAttribute("class","flat"),r.setAttribute("x1","0"),r.setAttribute("x2",String(xt.sound.w)),r.setAttribute("y1",String(xt.sound.h-.5)),r.setAttribute("y2",String(xt.sound.h-.5)),i.appendChild(r),n.appendChild(i),n.addEventListener("click",()=>{t.audio&&t.audio.toggle()}),e.sound=n}return e.bl=Dp("c-bl"),e.bl&&e.bl.classList.add("t-micro"),e.br=Dp("c-br"),e.br&&(e.br.classList.add("t-micro"),Ip=fa("span","found-count","",e.br),wx=fa("span","rank","",e.br)),I1(!(W.data&&W.data.sound==="off")),_e.on("sound:change",n=>I1(!!n.on)),_e.on("rank:change",()=>mn.refresh()),_e.on("visibility",n=>{n.hidden||mn.refresh()}),mn.setRoom("CORE"),mn.refresh(),pe.add(l3,Nt.UI),mn},setRoom(t){let e=he[t]||he.CORE;Ax=`${e.code} · ▽ ${e.level}`,mn.el.tlMicro&&Lp==null&&(mn.el.tlMicro.textContent=Ax)},setTLVerb(t,e={fadeMs:240}){let n=mn.el.tl;if(!n)return;let i=e&&e.fadeMs!=null?e.fadeMs:240;if(zu&&(Pn(zu),zu=0),t&&typeof t=="object")Nl=t,Zn||(Zn=fa("button","verb t-label",null,n,"c-tl-verb"),Zn.type="button",Zn.style.pointerEvents="auto",Zn.addEventListener("click",()=>{Nl&&typeof Nl.onActivate=="function"&&Nl.onActivate()}),Zn.style.opacity="0"),Zn.textContent=String(t.label||""),t.qa?Zn.setAttribute("data-qa",String(t.qa)):Zn.removeAttribute("data-qa"),Zn.hidden=!1,Zn.style.transition=`opacity ${i}ms linear`,Zn.offsetWidth,Zn.style.opacity="1";else if(Zn){Nl=null,Zn.style.transition=`opacity ${i}ms linear`,Zn.style.opacity="0";let r=Zn;zu=it(i,()=>{zu=0,Nl||(r.hidden=!0)})}},setTLMicro(t){Lp=t==null?null:String(t),mn.el.tlMicro&&(mn.el.tlMicro.textContent=Lp??Ax)},refresh(){let t=mn.el;if(t.bl){if(Sx)t.bl.textContent="РЕЖИМ ЧЕРТЕЖА";else{let e=new Date(rs());t.bl.textContent=`ДЕНЬ ${W.distinctDays|0} · УЗЛОВ ${W.litNodes|0} · ${Ex(e.getHours())}:${Ex(e.getMinutes())}`}a3()}if(Ip){let e=Ol&&Ol.secrets?Ol.secrets.count():Object.keys(W.data&&W.data.found||{}).length;Ip.textContent=`НАЙДЕНО ${Ex(Math.min(99,e))} / ??`,wx.textContent=W.data?W.rank().name:""}},typeIn(t=we.typeMsPerChar){let e=mn.el,n=[e.tlName,e.tlMicro,Np,e.bl&&!Sx?e.bl:null,Ip,wx].filter(Boolean),i=n.map(s=>s.textContent),r=Math.max(1,...i.map(s=>s.length));for(let s of n)s.textContent="";return Un(r*t,s=>{let o=Math.round(s*r);for(let a=0;a<n.length;a++){let l=i[a].slice(0,o);n[a].textContent!==l&&(n[a].textContent=l)}}).done.then(()=>{for(let s=0;s<n.length;s++)n[s].textContent=i[s]})},assemble(t=we.assemble){let e=mn.el;for(let n of[e.tl,e.tr,e.bl,e.br])n&&(n.style.transitionDuration=`${t}ms`,n.classList.remove("corner--dim"));return new Promise(n=>it(t,n))},relockFound(){mn.refresh();let t=mn.el.br;t&&(t.classList.add("is-relock"),Pp&&Pn(Pp),Pp=it(we.statusIn,()=>{Pp=0,t.classList.remove("is-relock")}))},setT0Marker(t){Sx=!!t,mn.refresh()}};var $i=null,pa=null,Fl=null,Cs=0,Rx=0,Ul=null;function Cx(){Cs=0,$i&&$i.classList.remove("is-in");let t=Ul;Ul=null,t&&it(240,t)}var Gu={init(t){let e=document.getElementById("frame");return $i=document.getElementById("lead"),!$i&&e&&($i=document.createElement("div"),$i.id="lead",$i.className="scrim",e.appendChild($i)),$i&&(pa=document.getElementById("lead-text")||$i.appendChild(document.createElement("p")),pa.id="lead-text",pa.className="t-lead",Fl=document.getElementById("lead-micro")||$i.appendChild(document.createElement("p")),Fl.id="lead-micro",Fl.className="t-micro",Fl.hidden=!0),Gu},show(t,e={}){if(!$i)return Promise.resolve();let n=e.ms!=null?e.ms:we.leadDefault;if(Cs&&(Pn(Cs),Cs=0),Ul){let s=Ul;Ul=null,s()}let i=++Rx;pa.className=e.cls||"t-lead",Fl.textContent=e.micro?String(e.micro):"",Fl.hidden=!e.micro,$i.classList.add("is-in");let r=new Promise(s=>{Ul=s});return e.beam?y1(pa,String(t),{}).then(()=>{i===Rx&&(Cs=it(n,Cx))}):(pa.textContent=String(t),v1(pa),Cs=it(n,Cx)),r},hide(){Cs&&(Pn(Cs),Cs=0),Rx++,Cx()}};var D1="http://www.w3.org/2000/svg",vo=[],Px=null,Ix=null,N1=new C,O1=new C,go={x:0,y:0,depth:0,visible:!1},xo={x:0,y:0,depth:0,visible:!1},Op=xt.dims,Yt=t=>t.toFixed(1);function c3(t){if(t.a(N1),t.b(O1),Re.project(N1,go),Re.project(O1,xo),go.depth<=0||xo.depth<=0)return!1;let e=xo.x-go.x,n=xo.y-go.y,i=Math.hypot(e,n);if(i<8)return!1;e/=i,n/=i;let r=-n,s=e,o=t.side;(o==="left"&&r>0||o==="right"&&r<0||o==="above"&&s>0||o==="below"&&s<0)&&(r=-r,s=-s);let a=t.offset,l=go.x+r*a,c=go.y+s*a,u=xo.x+r*a,h=xo.y+s*a,d=(l+u)/2,f=(c+h)/2,g=Math.min(i/2-2,t.gapHalf),x=Op.arrowPx,p=Op.extPx,m=`M${Yt(go.x+r*4)} ${Yt(go.y+s*4)}L${Yt(l+r*p)} ${Yt(c+s*p)}M${Yt(xo.x+r*4)} ${Yt(xo.y+s*4)}L${Yt(u+r*p)} ${Yt(h+s*p)}M${Yt(l)} ${Yt(c)}L${Yt(d-e*g)} ${Yt(f-n*g)}M${Yt(d+e*g)} ${Yt(f+n*g)}L${Yt(u)} ${Yt(h)}M${Yt(l+(e*.866-n*.5)*x)} ${Yt(c+(n*.866+e*.5)*x)}L${Yt(l)} ${Yt(c)}L${Yt(l+(e*.866+n*.5)*x)} ${Yt(c+(n*.866-e*.5)*x)}M${Yt(u-(e*.866-n*.5)*x)} ${Yt(h-(n*.866+e*.5)*x)}L${Yt(u)} ${Yt(h)}L${Yt(u-(e*.866+n*.5)*x)} ${Yt(h-(n*.866-e*.5)*x)}`;return m!==t.lastD&&(t.lastD=m,t.path.setAttribute("d",m)),t.label.style.transform=`translate3d(${Yt(d)}px,${Yt(f)}px,0) translate(-50%,-50%)`,!0}function u3(){if(Re.camera)for(let t=0;t<vo.length;t++){let e=vo[t],n=e.visible&&c3(e);n!==e.shown&&(e.shown=n,e.g.classList.toggle("is-hidden",!n),e.label.classList.toggle("is-hidden",!n))}}var Fp={init(t){return Px=document.getElementById("leaders"),Ix=document.getElementById("overlay"),pe.add(u3,Nt.OVERLAY),Fp},add(t){let e=String(t.owner||"anon"),n=document.createElementNS(D1,"g");n.setAttribute("class","dim is-hidden"),n.dataset.owner=e;let i=document.createElementNS(D1,"path");i.setAttribute("pathLength","1"),n.appendChild(i);let r=document.createElement("span");r.className="t-micro dim-label is-hidden",r.dataset.owner=e,Px&&Px.appendChild(n),Ix&&Ix.appendChild(r);let s={owner:e,a:t.a,b:t.b,side:t.side||"right",offset:t.offset!=null?t.offset:Op.offsetPx,g:n,path:i,label:r,visible:!0,shown:!1,lastD:"",gapHalf:0},o=l=>{r.textContent=String(l||""),s.gapHalf=(r.textContent.length*6.2+2*Op.gapPx)/2};o(t.label),vo.push(s);let a={setVisible(l){s.visible=!!l},drawIn(l=we.dimsDraw){return i.classList.remove("is-drawing"),i.style.strokeDasharray="1",i.style.strokeDashoffset="1",r.style.opacity="0",new Promise(c=>{requestAnimationFrame(()=>{i.classList.add("is-drawing"),i.style.transitionDuration=`${l}ms`,i.style.strokeDashoffset="0",it(l,()=>{r.style.opacity="",c()})})})},setLabel:o,remove(){let l=vo.indexOf(s);l>=0&&vo.splice(l,1),n.parentNode&&n.parentNode.removeChild(n),r.parentNode&&r.parentNode.removeChild(r)}};return s.api=a,a},clear(t){for(let e=vo.length-1;e>=0;e--)vo[e].owner===t&&vo[e].api.remove()}};var Lx="http://www.w3.org/2000/svg",Xi=[0,1,2,3].map(t=>({i:t,el:null,svg:null,sp:ir.from(wb.struck,0),at:0,flash:0,lastD:""})),Ps=null,Dx=null,kp=14,kl=NaN,Hu=NaN,Wu=!0,yo=t=>t.toFixed(1);function U1(){return kp+12}function h3(t,e){let n=ve.w,i=ve.h,r=kp,s=U1(),o=2*(t.sp.x+e);switch(t.i){case 0:return`M${r} ${r}Q${yo(t.at)} ${yo(r+o)} ${n-r} ${r}`;case 2:return`M${r} ${s-r}Q${yo(t.at)} ${yo(s-r-o)} ${n-r} ${s-r}`;case 1:return`M${s-r} ${r}Q${yo(s-r-o)} ${yo(t.at)} ${s-r} ${i-r}`;default:return`M${r} ${r}Q${yo(r+o)} ${yo(t.at)} ${r} ${i-r}`}}function d3(){let t=ve.w,e=ve.h,n=U1();for(let i of Xi){if(!i.svg)continue;let r=i.i%2===0,s=r?t:n,o=r?n:e;i.svg.setAttribute("viewBox",`0 0 ${s} ${o}`),i.svg.setAttribute("width",String(s)),i.svg.setAttribute("height",String(o)),i.svg.style.transform=`translate3d(${i.i===1?t-n:0}px,${i.i===2?e-n:0}px,0)`}}function Up(t,e,n,i){t.flash&&Pn(t.flash),t.at=e,t.sp.x=n*Math.min(xt.edge.bendPx,3+i*4),t.sp.v=0,t.sp.target=0,t.el.classList.add("is-flash"),t.flash=it(we.stringFlash,()=>{t.flash=0,t.el.classList.remove("is-flash")});let r=Dx&&Dx.audio;r&&r.play("stringPluck",{root:(he[J.room]||he.CORE).root})}function f3(t){let e=t.x,n=t.y;if(Number.isFinite(kl)&&Wu){let i=Math.hypot(t.vx,t.vy);if(i>xt.edge.pluckPxMs){let r=ve.w,s=ve.h,o=kp,a=ve.isPhone;(Hu-o)*(n-o)<0&&Up(Xi[0],e,n>Hu?1:-1,i),(Hu-(s-o))*(n-(s-o))<0&&Up(Xi[2],e,n<Hu?1:-1,i),!a&&(kl-(r-o))*(e-(r-o))<0&&Up(Xi[1],n,e<kl?1:-1,i),!a&&(kl-o)*(e-o)<0&&Up(Xi[3],n,e>kl?1:-1,i)}}kl=e,Hu=n}function p3(t){if(!Ps||!Wu)return;let e=.2*(Cn.value-.5)*2*Cn.amp;for(let n=0;n<4;n++){let i=Xi[n];(i.sp.x!==0||i.sp.v!==0)&&(i.sp.step(t),Math.abs(i.sp.x)<.01&&Math.abs(i.sp.v)<.05&&i.sp.snap(0));let r=h3(i,e);r!==i.lastD&&(i.lastD=r,i.el.setAttribute("d",r))}}function F1(){kp=ve.isPhone?xt.phone.edgeInset:xt.desktop.edgeInset;for(let t of Xi)t.at=(t.i%2===0?ve.w:ve.h)/2,t.lastD="";d3()}var $u={init(t){Dx=t;let e=document.getElementById("frame");if(!e)return $u;Ps=document.createElementNS(Lx,"svg"),Ps.id="edges",Ps.setAttribute("aria-hidden","true");for(let n of Xi)n.svg=document.createElementNS(Lx,"svg"),n.svg.setAttribute("class","edge-strip"),n.el=document.createElementNS(Lx,"path"),n.el.setAttribute("class","edge"),n.el.setAttribute("pathLength","1"),n.svg.appendChild(n.el),Ps.appendChild(n.svg);return e.insertBefore(Ps,e.firstChild),F1(),t.bus.on("layout:change",F1),t.input.observe(f3),pe.add(p3,Nt.UI),$u},drawIn(t=we.drawIn){if(!Ps)return Promise.resolve();for(let e of Xi)e.el.style.transition="none",e.el.style.strokeDasharray="1",e.el.style.strokeDashoffset="1";return new Promise(e=>{requestAnimationFrame(()=>{for(let n of Xi)n.el.style.transition=`stroke-dashoffset ${t}ms cubic-bezier(.16,1,.3,1)`,n.el.style.strokeDashoffset="0";it(t,()=>{for(let n of Xi)n.el.style.transition="",n.el.style.strokeDasharray="",n.el.style.strokeDashoffset="";e()})})})},twitch(t=xt.edge.twitchPx){for(let e of Xi)e.sp.x=t,e.sp.v=0,e.sp.target=0},setVisible(t){Wu=!!t,Ps&&Ps.classList.toggle("is-off",!Wu);for(let e of Xi)e.el&&e.el.classList.toggle("is-off",!Wu)}};var _o=null,zp=!1,k1=!1,B1=!0,Nx=null;function Bp(){let t=B1&&zp&&!ve.isPhone;t===k1||!_o||(k1=t,_o.classList.toggle("is-on",t))}var Xu={init(t){let e=document.getElementById("fx"),n=document.getElementById("gl");return e&&(_o=document.createElement("i"),_o.id="cursor",e.appendChild(_o),n&&(n.addEventListener("pointerover",i=>{(i.pointerType==="mouse"||i.pointerType==="pen")&&(zp=!0,Bp())}),n.addEventListener("pointerout",()=>{zp=!1,Bp()}),n.addEventListener("pointerdown",i=>{i.pointerType==="touch"&&(zp=!1,Bp())})),t.input.observe(i=>{i.type!=="touch"&&(_o.style.transform=`translate3d(${i.x}px,${i.y}px,0)`)})),Xu},setVisible(t){B1=!!t,Bp()},setColor(t){Nx=t&&t!=="ember"?t:null,_o&&(_o.style.boxShadow=Nx?`inset 0 0 0 1px var(--${Nx})`:"")}};var m3="http://www.w3.org/2000/svg",Mo=["S","A","M","•","V","I","N"],an=new Float64Array(7),ar=An.map(t=>he[t].alt),On=null,_n="desktop",ur=56,Nn=300,qt=null,zl=null,Pi=null,$1=null,Gp=null,Ds=null,X1=null,Ls=null,qu=null,Gl=null,Yi=null,Fx=null,cr=[],Vl=[],Yu="CORE",ju=0,Ux=NaN,Vp=-1,z1=!1,Bl=0,V1=-1e9,bo=new ir(8,.25,0),Wp=!1,Y1=0,Tr=new ir(12,1,0),kx=0;function g3(){if(_n=ve.kind==="desktop"?"desktop":ve.kind==="phone"?"phone":"land",_n==="desktop"){ur=xt.nav.w,Nn=xt.nav.h;for(let t=0;t<7;t++)an[t]=Nn/2-ar[t]/1e3*(Nn/2.4)}else if(_n==="phone"){ur=Math.max(100,ve.w-32),Nn=xt.band.h;for(let t=0;t<7;t++)an[t]=16+(t+.5)*ur/7}else{ur=xt.band.sideW,Nn=Math.max(100,ve.h-32);for(let t=0;t<7;t++)an[t]=16+(t+.5)*Nn/7}}function Xp(t){if(t>=ar[0])return an[0]+(t-ar[0])*(an[1]-an[0])/(ar[1]-ar[0]);for(let e=1;e<7;e++)if(t>=ar[e])return an[e]+(t-ar[e])*(an[e-1]-an[e])/(ar[e-1]-ar[e]);return an[6]+(t-ar[6])*(an[6]-an[5])/(ar[6]-ar[5])}var Zu=t=>t==="WORKSHOP"?2:An.indexOf(t);function Ku(t){let e=0;for(let n=1;n<7;n++)Math.abs(t-an[n])<Math.abs(t-an[e])&&(e=n);return e}function x3(t){let e=[];for(let i=0;i<2;i++)for(let r=0;r<=4;r++){let s=i===0?r/4:1-r/4,o=t.top+(t.bot-t.top)*s,a=t.top>0&&t.bot<0&&r===4/2?.62:At(o),l,c;if(_n==="desktop")l=Nn/2-o*(Nn/2.4),c=a*(Nn/2.4)*xt.nav.widthScale;else{let d=(_n==="phone"?ur:Nn)/7;l=t.i*d+d*s,c=a/.62*((_n==="phone"?Nn:ur)*.36)}let u=i===0?1:-1,h=_n==="phone"?Nn/2:ur/2;e.push(_n==="phone"?`${l.toFixed(1)} ${(h-u*c).toFixed(1)}`:`${(h+u*c).toFixed(1)} ${l.toFixed(1)}`)}return`M${e.join("L")}Z`}function v3(){let t=Wt[6],e=ql(7),n=[];for(let i=0;i<5;i++){let r=.1+.2*i,s="";for(let o=0;o<=4;o++){let a=t.top+(t.bot-t.top)*(o/4),l=At(a),c=(r-.5+(e()-.5)*.15)*2*l,u,h;if(_n==="desktop")h=Nn/2-a*(Nn/2.4),u=ur/2+c*(Nn/2.4)*xt.nav.widthScale;else if(_n==="phone"){let d=ur/7;u=6*d+d*(o/4),h=Nn/2+c/.62*Nn*.36}else{let d=Nn/7;h=6*d+d*(o/4),u=ur/2+c/.62*ur*.36}s+=`${o?"L":"M"}${u.toFixed(1)} ${h.toFixed(1)}`}n.push(s)}return n.join("")}function G1(){g3(),zl.setAttribute("viewBox",`0 0 ${ur.toFixed(1)} ${Nn.toFixed(1)}`);for(let e=0;e<7;e++)Vl[e].setAttribute("d",x3(Wt[e]));Pi.setAttribute("d",v3());let t=_n==="desktop";for(let e=0;e<7;e++)cr[e].style.top=t?`${an[e].toFixed(1)}px`:"";Ls.style.top=t?`${(an[6]+12).toFixed(1)}px`:"",Gl.style.top=t?`${an[3].toFixed(1)}px`:"",Ux=NaN}function q1(){let t=Wp?bo.x:Xp(ju);return t+=Tr.x+kx,t}function H1(t,e){t.style.transform=_n==="phone"?`translate3d(${(e-.5).toFixed(1)}px,0,0)`:`translate3d(0,${(e-.5).toFixed(1)}px,0)`}function y3(t){if(!qt)return;Wp&&(bo.step(t),pe.now>Y1&&(bo.target=Xp(ju),Math.abs(bo.x-bo.target)<.3&&Math.abs(bo.v)<2&&(Wp=!1))),(Tr.x!==0||Tr.v!==0)&&(Tr.step(t),Tr.target===0&&Math.abs(Tr.x)<.05&&Math.abs(Tr.v)<.5&&Tr.snap(0));let e=q1();Math.abs(e-Ux)<.05||(Ux=e,H1($1,e),Ds&&H1(Ds,e))}function ma(t,e,n,i){let r=cr[t];r&&(r["_"+e]&&Pn(r["_"+e]),r.setAttribute(e,e==="data-glint"?i||"electrum":""),r["_"+e]=it(n,()=>{r["_"+e]=0,r.removeAttribute(e)}))}function Ox(){let t=!!(W.data&&W.data.nadirOpen),e=cr[6],n=he.NADIR;e.setAttribute("aria-label",t?n.nameOpen:n.name),e.querySelector(".kn-name").textContent=t?n.nameOpen:n.name;let i=W.data?W.data.shards|0:0;e.querySelector(".kn-level").textContent=t?`▽ ${n.giant}`:"●".repeat(i)+"○".repeat(5-i)}function zx(t){if(t!==Vp){if(Vp>=0&&cr[Vp].classList.remove("is-hot"),Vp=t,t<0){Gp.classList.remove("is-on");return}cr[t].classList.add("is-hot"),Gp.style.transform=`translate3d(0,${(an[t]-.5).toFixed(1)}px,0)`,Gp.classList.add("is-on"),On.audio&&On.audio.play("hoverTick",{x:ve.w-52})}}function $p(t){_n!=="desktop"&&(t=!1),t!==z1&&(z1=t,t?qt.setAttribute("data-expanded",""):(qt.removeAttribute("data-expanded"),zx(-1)))}var Vx=t=>`#/${he[t].slug}`;function Bx(t,e="nav"){On.director&&On.director.go(Vx(An[t]),{source:e})}function _3(){let t=On.director;return t&&t.busy()&&t.state.to?t.state.to.room:J.room}function b3(t){if(t.preventDefault(),_n!=="desktop")return;let e=t.deltaY;if(t.deltaMode===1?e*=16:t.deltaMode===2&&(e*=ve.h),(pe.now-V1>600||Math.sign(e)!==Math.sign(Bl))&&(Bl=0),V1=pe.now,Bl+=e,Math.abs(Bl)<xt.nav.wheelPxPerDetent)return;let n=Math.sign(Bl);Bl=0;let i=lo(_3(),n);i&&(On.audio&&On.audio.play("tick",{}),On.director.go(Vx(i),{source:"nav"}))}var me={id:-1,row:-1,x0:0,y0:0,p0:0,left:0,top:0,moved:!1,mode:null,done:!1,timers:[],v:0,lastP:0,lastT:0,target:-1,from:0,u0:0,pull:0,pullTimer:0,mapDy:0};function Gx(t){return _n==="phone"?t.clientX-me.left:t.clientY-me.top}var Hp=(t,e)=>setTimeout(e,t);function Hx(){for(let t of me.timers)clearTimeout(t);me.timers.length=0,me.pullTimer&&(clearTimeout(me.pullTimer),me.pullTimer=0)}function Yp(){Gl.classList.remove("is-on"),Yi.style.transition="none",Yi.style.strokeDashoffset="1"}function M3(t){if(me.id>=0||t.pointerType==="mouse"&&t.button!==0)return;let e=qt.getBoundingClientRect();me.id=t.pointerId,me.left=e.left,me.top=e.top,me.x0=t.clientX,me.y0=t.clientY,me.moved=!1,me.mode=null,me.done=!1,me.v=0,me.target=-1,me.p0=me.lastP=Gx(t),me.lastT=t.timeStamp,me.row=Ku(me.p0),Math.abs(me.p0-an[me.row])>30&&(me.row=-1);try{qt.setPointerCapture(t.pointerId)}catch{}me.row===3?(me.timers.push(Hp(we.relaunchRingDelay,()=>{Gl.classList.add("is-on"),Yi.style.transition="none",Yi.style.strokeDashoffset="1",requestAnimationFrame(()=>{Yi.style.transition=`stroke-dashoffset ${we.relaunch-we.relaunchRingDelay}ms linear`,Yi.style.strokeDashoffset="0"})})),me.timers.push(Hp(we.relaunch,()=>{me.done=!0,Yp(),Sr(Mr.lock),J.room!=="CORE"&&On.director&&On.director.go("#/core",{source:"nav"}),_e.emit("relaunch",{})}))):me.row>=0&&me.timers.push(Hp(we.longPress,()=>{me.done=!0,On.hint&&On.hint.swing()}))}function S3(t,e,n){Hx(),Yp();let i=_n==="phone"?e:n,r=_n==="phone"?n:e;if(me.row===0&&i<0&&Math.abs(i)>=Math.abs(r)*.5){me.mode="pull";return}if(_n==="phone"&&n<0&&Math.abs(n)>Math.abs(e)){me.mode="map";return}let s=On.director;if(!s){me.mode="none";return}let o=Gx(t);if(s.busy()){if(!s.scrub.begin(s.state.to.hash)){me.mode="detent";return}me.target=Zu(s.state.to.room),me.from=o,me.u0=s.state.u,me.mode="scrub";return}let a=Xp(he[J.room].alt),l=Math.sign(o-a)||Math.sign(i)||1,c=Ku(o);if((c===Zu(J.room)||Math.abs(o-a)<12)&&(c=Zu(J.room)+l),c<0||c>6){me.mode="none";return}if(me.target=c,me.from=a,me.u0=0,!s.scrub.begin(Vx(An[c]))){me.mode="detent";return}me.mode="scrub"}function w3(t){let e=an[me.target]-me.from;return Math.abs(e)<1?1:Math.max(0,Math.min(1,me.u0+(t-me.from)/e*(1-me.u0)))}function A3(t){if(t.pointerId!==me.id){_n==="desktop"&&t.pointerType==="mouse"&&me.id<0&&E3(t);return}let e=t.clientX-me.x0,n=t.clientY-me.y0;if(!me.moved){let s=Math.hypot(e,n);if(s>=Ri.SLOP_PX/2&&me.timers.length&&!me.done&&(Hx(),Yp()),s<Ri.SLOP_PX)return;if(me.moved=!0,me.done){me.mode="none";return}S3(t,e,n)}let i=Gx(t),r=Math.max(1,t.timeStamp-me.lastT);if(me.v+=((i-me.lastP)/r-me.v)*Math.min(1,r/60),me.lastP=i,me.lastT=t.timeStamp,me.mode==="scrub")On.director.scrub.set(w3(i));else if(me.mode==="pull"){let s=an[0]-i;_n==="phone"?s+=Math.max(0,me.top-t.clientY):_n==="land"&&(s+=Math.max(0,me.left-t.clientX)),me.pull=Math.max(0,s),Tr.snap(-Math.min(xt.nav.rubberMax,me.pull*xt.nav.rubber)),me.pull>=xt.nav.overpullPx&&!me.pullTimer?me.pullTimer=Hp(we.overpullHold,()=>{me.pullTimer=0,me.done=!0,me.mode="none",Tr.target=0,On.director&&On.director.go("#/zenith",{source:"overpull"})}):me.pull<xt.nav.overpullPx&&me.pullTimer&&(clearTimeout(me.pullTimer),me.pullTimer=0)}else me.mode==="map"&&(me.mapDy=t.clientY-me.y0);_n==="desktop"&&(me.mode==="scrub"||me.mode==="detent")&&zx(Ku(i))}function W1(t,e){if(t.pointerId!==me.id)return;me.id=-1,Hx(),Yp();let n=On.director,i=me.lastP;if(me.mode==="scrub"&&n)if(e)n.scrub.end(-4);else{let r=me.v*1e3/(an[me.target]-me.from||1),s=xt.nav.magnetPx;Math.abs(i-an[me.target])<=s?r=Math.max(r,2):Math.abs(i-me.from)<=s&&(r=Math.min(r,-2)),n.scrub.end(r)}else if(me.mode==="pull")Tr.target=0;else if(me.mode==="detent"&&!e){let r=Ku(i);r!==Zu(J.room)&&Bx(r)}else me.mode==="map"&&!e?me.mapDy<=-40&&On.navMap&&On.navMap.open():!me.moved&&!me.done&&!e&&me.row>=0&&Bx(me.row);me.mode=null}function E3(t){$p(!0);let e=ve.h/2-Nn/2,n=t.clientY-e,i=Ku(n);zx(Math.abs(n-an[i])<=22?i:-1)}function _i(t,e,n,i){let r=document.createElement(t);return e&&(r.className=e),i&&(r.id=i),n.appendChild(r),r}function Is(t,e,n){let i=document.createElementNS(m3,t);return e&&i.setAttribute("class",e),n.appendChild(i),i}function T3(){qt=document.createElement("nav"),qt.id="keynav",qt.setAttribute("aria-label","КЛЮЧ"),zl=Is("svg","kn-draw",qt),zl.setAttribute("aria-hidden","true"),zl.setAttribute("preserveAspectRatio","none");for(let n=0;n<7;n++){let i=Is("path","kn-stratum",zl);i.setAttribute("data-stratum",Mo[n]),i.setAttribute("pathLength","1"),Vl.push(i)}Pi=Is("path","kn-crack",zl),Pi.setAttribute("pathLength","1"),Pi.style.strokeDasharray="1",Pi.style.strokeDashoffset="1";for(let n=0;n<7;n++){let i=An[n],r=he[i],s=_i("button","kn-row",qt);s.type="button",s.dataset.sign=Mo[n],s.dataset.room=i,s.style.setProperty("--i",String(n)),s.setAttribute("aria-label",r.name);let o=_i("span","kn-letter t-label",s);o.textContent=Mo[n];let a=_i("span","kn-text",s),l=_i("span","kn-head",a);_i("span","kn-code t-label",l).textContent=`${Mo[n]} · ${r.code}`,_i("span","kn-name t-body t-body--15 t-body--em",l).textContent=r.name,_i("span","kn-level t-micro",a).textContent=`▽ ${r.giant}`,s.addEventListener("click",c=>{c.detail===0&&Bx(n)}),cr.push(s)}Gp=_i("i","kn-tick",qt),$1=_i("i","",qt,"keynav-needle"),Ds=Is("svg","kn-twin",qt),Ds.setAttribute("viewBox","0 0 40 12"),X1=[Is("path","",Ds),Is("path","",Ds)],Ls=_i("div","",qt,"keynav-slots");for(let n=0;n<5;n++)_i("i","slot",Ls);qu=_i("i","",qt,"keynav-zenith"),Gl=_i("div","",qt,"keynav-ring");let t=Is("svg","",Gl);t.setAttribute("viewBox","0 0 44 44");let e=Is("circle","track",t);e.setAttribute("cx","22"),e.setAttribute("cy","22"),e.setAttribute("r","18"),Yi=Is("circle","fill",t),Yi.setAttribute("cx","22"),Yi.setAttribute("cy","22"),Yi.setAttribute("r","18"),Yi.setAttribute("pathLength","1"),Yi.style.strokeDasharray="1",Yi.style.strokeDashoffset="1",_i("span","t-label",Gl).textContent="ПЕРЕЗАПУСК",Fx=_i("p","t-body t-body--15 t-body--em",qt,"keynav-name"),qt.addEventListener("pointerdown",M3),qt.addEventListener("pointermove",A3),qt.addEventListener("pointerup",n=>W1(n,!1)),qt.addEventListener("pointercancel",n=>W1(n,!0)),qt.addEventListener("pointerleave",n=>{me.id<0&&n.pointerType==="mouse"&&$p(!1)}),qt.addEventListener("wheel",b3,{passive:!1}),qt.addEventListener("contextmenu",n=>n.preventDefault())}var lr={el:null,init(t){On=t;let e=document.getElementById("chrome");return e&&(T3(),e.appendChild(qt),lr.el=qt,G1(),Ox(),lr.refreshSlots(),W.data&&W.data.nadirOpen&&(Pi.style.strokeDashoffset="0",Pi.classList.add("is-cool")),lr.showZenith(!!(W.data&&W.data.found&&W.data.found.S13)),lr.setCurrent(J.room||"CORE"),_e.on("layout:change",()=>{G1(),$p(!1)}),_e.on("secret:found",n=>{n.id==="S13"&&lr.showZenith(!0)}),_e.on("room:arrive",()=>{try{Hv().unread>0&&lr.blink("S")}catch{}}),pe.add(y3,Nt.UI)),lr},show(t={}){if(!qt)return Promise.resolve();let e=t.ms!=null?t.ms:we.drawIn;qt.classList.add("is-shown");for(let n of Vl)n.style.transition="none",n.style.strokeDasharray="1",n.style.strokeDashoffset="1";return requestAnimationFrame(()=>{for(let n of Vl)n.style.transition=`stroke-dashoffset ${e}ms cubic-bezier(.16,1,.3,1),stroke .24s`,n.style.strokeDashoffset="0"}),new Promise(n=>it(e,()=>{for(let i of Vl)i.style.strokeDasharray="",i.style.strokeDashoffset="",i.style.transition="";n()}))},hide(){qt&&(qt.classList.remove("is-shown"),$p(!1))},setCurrent(t){Yu=he[t]?t:"CORE";let e=Zu(Yu);for(let i=0;i<7;i++)i===e?cr[i].setAttribute("aria-current","true"):cr[i].removeAttribute("aria-current"),Vl[i].classList.toggle("is-current",i===e);let n=he[Yu];Fx&&(Fx.textContent=Yu==="NADIR"&&W.data&&W.data.nadirOpen?n.nameOpen:n.name),ju=n.alt},setNeedle(t){ju=Number.isFinite(t)?t:0},lockTwin(){if(!Ds||_n!=="desktop")return;Ds.classList.add("is-on");let[t,e]=X1;Un(we.navTwin,n=>{let i=5*(1-n),r=3,s=3+2*(1-n),o="M0 6",a="M0 6";for(let l=2;l<=40;l+=2)o+=`L${l} ${(6+i*Math.sin(l/40*r*6.283)).toFixed(2)}`,a+=`L${l} ${(6+i*Math.sin(l/40*s*6.283+1)).toFixed(2)}`;t.setAttribute("d",o),e.setAttribute("d",a)}).done.then(()=>it(120,()=>Ds.classList.remove("is-on")))},flashLetter(t,e,n){let i=Mo.indexOf(t);i>=0&&ma(i,e==="electrum"||e==="white"?"data-glint":"data-flash",n||we.hintGlint,e)},flashAll(t,e="ember"){for(let n=0;n<7;n++)e==="electrum"||e==="white"?ma(n,"data-glint",t||4200,e):ma(n,"data-flash",t||4200)},blink(t){let e=Mo.indexOf(t);e>=0&&ma(e,"data-blink",480)},shudder(t){let e=Mo.indexOf(t);if(e<0)return;let n=cr[e];n.hasAttribute("data-shudder")?(n.removeAttribute("data-shudder"),requestAnimationFrame(()=>ma(e,"data-shudder",1e3))):ma(e,"data-shudder",1e3),t==="N"&&(Ls.classList.add("is-flash"),it(we.shudder,()=>Ls.classList.remove("is-flash")))},refreshSlots(){let t=W.data?Math.min(5,W.data.shards|0):0;if(Ls)for(let e=0;e<5;e++)Ls.children[e].classList.toggle("filled",e<t);cr.length&&Ox()},slotPoint(t){let e=Ls&&Ls.children[Math.max(0,Math.min(4,t|0))];if(!e)return{x:ve.w/2,y:ve.h/2};let n=e.getBoundingClientRect();return{x:n.left+n.width/2,y:n.top+n.height/2}},letterPoint(t){let e=Math.max(0,Mo.indexOf(t)),n=cr[e]&&cr[e].firstChild;if(!n)return{x:ve.w/2,y:ve.h/2};let i=n.getBoundingClientRect();return{x:i.left+i.width/2,y:i.top+i.height/2}},crack(){return Pi?(Pi.classList.remove("is-cool"),Pi.style.transition="none",Pi.style.strokeDashoffset="1",requestAnimationFrame(()=>{Pi.style.transition="stroke-dashoffset 2.8s cubic-bezier(.2,0,0,1),stroke .6s",Pi.style.strokeDashoffset="0"}),it(1400,()=>{Ox(),lr.setCurrent(Yu)}),new Promise(t=>it(2800,()=>{Pi.classList.add("is-cool"),t()}))):Promise.resolve()},showZenith(t){qu&&qu.classList.toggle("is-on",!!t)},pullAboveS(t=20,e=600){let n=Xp(ju),i=an[0]-t-n;Un(e,r=>{kx=i*Math.sin(Math.PI*r)}).done.then(()=>{kx=0})},swingTo(t,e=we.hintGlint){bo.snap(q1()),bo.target=t<0?an[0]-xt.nav.zenithDotAbove*2:an[t],Wp=!0,Y1=pe.now+900+e,t<0?(qu.classList.add("is-ghost"),it(900+e,()=>qu.classList.remove("is-ghost"))):it(450,()=>ma(t,"data-glint",e))}};var j1="http://www.w3.org/2000/svg",Wx=null,di=null,Z1=[],K1=[],qp=0,Ju={id:-1,y0:0};function $x(){let t=!!(W.data&&W.data.nadirOpen),e=J.room==="WORKSHOP"?"MEMBERS":J.room;for(let n=0;n<7;n++){let i=An[n],r=he[i],s=Z1[n],o=i==="NADIR"&&!t;s.querySelector(".t-body").textContent=i==="NADIR"&&t?r.nameOpen:r.name,o?s.setAttribute("data-sealed",""):s.removeAttribute("data-sealed"),i===e?s.setAttribute("aria-current","true"):s.removeAttribute("aria-current"),K1[n].classList.toggle("is-current",i===e)}}function R3(t){let e=[];for(let n=0;n<2;n++)for(let i=0;i<=4;i++){let r=n===0?i/4:1-i/4,s=t.top+(t.bot-t.top)*r,o=t.top>0&&t.bot<0&&i===2?.62:At(s),a=36+(n===0?1:-1)*o*125*.45;e.push(`${a.toFixed(1)} ${(150-s*125).toFixed(1)}`)}return`M${e.join("L")}Z`}var qi={isOpen:!1,init(t){Wx=t;let e=document.getElementById("sheets");if(!e)return qi;di=document.createElement("div"),di.id="map",di.hidden=!0,di.setAttribute("role","dialog"),di.setAttribute("aria-label","КАРТА");let n=document.createElement("div");n.className="map-head";let i=document.createElement("p");i.className="t-label",i.textContent="КАРТА · VIN";let r=document.createElement("button");r.type="button",r.className="verb",r.textContent="ЗАКРЫТЬ",r.addEventListener("click",()=>qi.close()),n.append(i,r);let s=document.createElement("div");s.className="map-body";let o=document.createElementNS(j1,"svg");o.setAttribute("class","map-draw"),o.setAttribute("viewBox","0 0 72 300"),o.setAttribute("preserveAspectRatio","xMidYMin meet"),o.setAttribute("aria-hidden","true");for(let l of Wt){let c=document.createElementNS(j1,"path");c.setAttribute("d",R3(l)),o.appendChild(c),K1.push(c)}let a=document.createElement("div");return a.className="map-rows",Z1=An.map(l=>{let c=he[l],u=document.createElement("button");u.type="button",u.className="map-row",u.dataset.room=l;let h=document.createElement("span");h.className="t-micro",h.textContent=`▽ ${c.level}`;let d=document.createElement("span");d.className="t-label",d.textContent=`${c.num} · ${c.code}`;let f=document.createElement("span");return f.className="t-body",f.textContent=c.name,u.append(h,d,f),u.addEventListener("click",()=>{qi.close(),Wx.director&&Wx.director.go(`#/${c.slug}`,{source:"nav"})}),a.appendChild(u),u}),s.append(o,a),di.append(n,s),di.addEventListener("pointerdown",l=>{Ju.id=l.pointerId,Ju.y0=l.clientY}),di.addEventListener("pointerup",l=>{l.pointerId===Ju.id&&l.clientY-Ju.y0>60&&qi.close(),Ju.id=-1}),e.appendChild(di),_e.on("room:arrive",$x),_e.on("nadir:open",$x),qi},open(){!di||qi.isOpen||(qp&&(qp=0),$x(),qi.isOpen=!0,di.hidden=!1,di.classList.add("is-closing"),requestAnimationFrame(()=>requestAnimationFrame(()=>di.classList.remove("is-closing"))))},close(){if(!di||!qi.isOpen)return;qi.isOpen=!1,di.classList.add("is-closing");let t=++qp;it(480,()=>{t===qp&&!qi.isOpen&&(di.hidden=!0)})}};var Ii=(t,e,n,i,r,s,o=!1)=>Object.freeze({id:t,name:e,where:n,note:i,line:r,hintRoom:s,timeGated:o}),Xx=Object.freeze([Ii("S01","РЕЗОНАНС","CORE","G4","Песок написал имя.","CORE"),Ii("S02","БЕСКОНЕЧНОСТЬ","CORE","A4","Ты всё ещё внутри SAM.VIN.","CORE"),Ii("S03","ГОЛОВОКРУЖЕНИЕ","CORE","B4","Ключ закружился на {p}%.","CORE"),Ii("S04","ВСЕ ВМЕСТЕ","MEMBERS","D5","Весь клан откликнулся вместе.","MEMBERS"),Ii("S05","ПОЗЫВНОЙ","anywhere","E5","Система узнала тебя.","CORE"),Ii("S06","МАСТЕРСКАЯ","MEMBERS","G5","Твой знак вырезан.","MEMBERS"),Ii("S07","КИТ","any hall","A5","Ты видел кита.",null,!0),Ii("S08","ИЗНАНКА","CORE","B5","Ты видел изнанку.","CORE"),Ii("S09","ДРОН","any hall","D6","Ты поймал дрона.","CURRENT"),Ii("S10","НОЧЬ","any","E6","Ты видел, как VIN спит.",null,!0),Ii("S11","ЧАСТОТА","SIGNAL","G6","Тайная частота: {freq}.","SIGNAL"),Ii("S12","КАПСУЛА","INSIGNIA","A6","Капсула открылась.",null,!0),Ii("S13","ЗЕНИТ","navigator","B6","Ты был над всем.","ZENITH"),Ii("S14","СПУТНИК","CORE","D7","{name} прилетела и осталась.",null,!0)]),J1=Object.freeze(["S01","S03","S04","S02","S06","S09","S08","S11","S13","S05"]),Q1=Object.freeze(["S07","S10","S12","S14"]),C3=new Map(Xx.map(t=>[t.id,t]));function jp(t){return C3.get(t)||null}var ga=null,Hl=null,ew=t=>!!(W.data&&W.data.found&&W.data.found[t]);function tw(t){let e=Hl;if(!e||pe.now-e.at>we.hintArriveWindow){Hl=null;return}e.room===t&&(Hl=null,_e.emit("hint:arrive",{secret:e.secret,room:t,source:"hint"}))}var Qu={playMotion(t,e={source:"show"}){_e.emit("hint:arrive",{secret:t,room:J.room,source:e&&e.source||"show"})},init(t){return ga=t,t.hint=Qu,_e.on("room:arrive",e=>tw(e.room)),Qu},target(){for(let t of J1){if(ew(t))continue;let n=jp(t).hintRoom;return n==="CURRENT"&&(n=J.room),{secret:t,room:n,kind:"secret"}}return Q1.some(t=>!ew(t))?{secret:null,room:null,kind:"time"}:{secret:null,room:null,kind:"done"}},swing(){let t=Qu.target(),e=ga&&ga.keyNav,n=3;return t.kind==="secret"&&(n=t.room==="ZENITH"?-1:Math.max(0,An.indexOf(t.room==="WORKSHOP"?"MEMBERS":t.room))),e&&e.swingTo&&e.swingTo(n),t.kind!=="secret"&&ga.status&&ga.status.say(t.kind==="time"?"hint.time":"hint.done"),J.hintTarget={secret:t.secret,room:t.room,at:pe.now},_e.emit("hint:swing",{secret:t.secret,room:t.room}),Hl=t.kind==="secret"&&he[t.room]?{secret:t.secret,room:t.room,at:pe.now}:null,Hl&&Hl.room===J.room&&!(ga.director&&ga.director.busy())&&setTimeout(()=>tw(J.room),0),t}};var P3=new Set(["ArrowUp","ArrowDown","PageUp","PageDown","Home","Escape"]),I3=t=>!!t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName||"")),iw=t=>{let e=/^(?:Digit|Numpad)([1-7])$/.exec(t);return e?Number(e[1])-1:-1};function nw(t,e){let n=iw(t.code);if(n>=0)return`#/${he[An[n]].slug}`;switch(t.key){case"ArrowUp":case"PageUp":{let i=lo(e,-1);return i?`#/${he[i].slug}`:""}case"ArrowDown":case"PageDown":{let i=lo(e,1);return i?`#/${he[i].slug}`:""}case"Home":case"Escape":return"#/core";default:return null}}var rw=[];function L3(t){let e=rw;for(let n=e.length-1;n>=0;n--)try{if(e[n].fn(t)===!0)return!0}catch{}return!1}function sw(t){window.addEventListener("keydown",e=>{if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey)return;let n=e.key==="Escape";if(I3(e.target)){n&&t.sheet&&t.sheet.state!=="closed"&&t.sheet.close();return}if(n&&t.navMap&&t.navMap.isOpen){t.navMap.close(),e.preventDefault();return}if(rw.length&&L3(e)){e.preventDefault();return}if(J.booting&&t.input.offerKey&&t.input.offerKey(e)){e.preventDefault();return}let i=t.director;if(i&&i.busy()){if(n&&i.playing){i.speedUp(),e.preventDefault();return}let r=i.state.to?i.state.to.room:J.room,s=nw(e,r);if(s!=null){s&&i.go(s,{source:"kbd"}),e.preventDefault();return}e.key!=="Tab"&&e.key!=="Shift"&&e.key.length&&i.speedUp();return}if(t.halls&&t.halls.call(J.room,"onKey",e)===!0){e.preventDefault();return}if(e.code==="KeyM"){t.audio&&t.audio.toggle();return}if(i&&(P3.has(e.key)||iw(e.code)>=0)){let r=nw(e,J.room);r&&i.go(r,{source:"kbd"}),e.preventDefault()}})}var Qr={t0:null,nLockAt:null,ignitionAt:null,idleAt:null};kt("boot",()=>({...Qr}));var Zp=()=>typeof performance<"u"?performance.now():Date.now(),ow=!1,qx=!1;function Yx(t){qx||(qx=!0,t.status&&t.status.say(t.input.pointer.lastMove?"boot.pointer":"boot.nopointer"))}function aw(t,e){t.wake=p=>lw(t,p),Qr.t0=Zp(),Qr.nLockAt=null,Qr.ignitionAt=null,Qr.idleAt=null,ow||(ow=!0,t.bus.on("relaunch",()=>D3(t)));let n=t.key,i=Ft.reducedMotion,r=[],s=[],o=!1,a,l=new Promise(p=>{a=p}),c=(p,m)=>r.push(it(p,m)),u=(p,m,b)=>{let E=Un(p,m,b);return s.push(E),E};J.booting=!0,qx=!1,J.phase!=="boot"&&Mi("boot");let h=()=>{Qr.ignitionAt==null&&(Qr.ignitionAt=Zp()),n&&(n.ignite({color:J.night?"electrum":"ember",flash:!0}),t.bus.emit("boot:ignite",{returning:W.returning}))},d=p=>{t.chrome&&(p?Promise.resolve():t.chrome.typeIn()).then(()=>t.chrome.assemble(p?0:void 0)),t.keyNav&&t.keyNav.show(p?{ms:0}:{}),t.edges&&t.edges.drawIn(p?0:void 0)},f=p=>{if(!o){o=!0;for(let m of r)Pn(m);for(let m of s)m.cancel();x(),p&&(n&&(n.setScramble([0,0,0,0,0,0,0]),n.setReveal({points:1,scanY:null,fill:1,alpha:1}),h(),n.shootAxis(3.2,0)),t.nest&&t.nest.setFade(1,1),d(!0)),t.composite&&t.composite.setGrain(.02),t.datum&&t.datum.arrive("CORE",{instant:!!p}),t.rim&&t.rim.showName(),n&&(n.setBreathingRing(!0),n.setIdle(!0),n.setInteractive(!0)),Yx(t),Mi("idle"),J.booting=!1,Qr.idleAt=Zp(),t.bus.emit("boot:done",{returning:W.returning,sameDay:W.sameDaySession,phone:ve.isPhone}),a()}},g={name:"boot",onGesture(p){return(p.type==="down"||p.type==="tap"||p.type==="wheel"||p.type==="dragstart")&&f(!0),!0},onKey(){return f(!0),!0}},x=t.input.push(g);if(!n){let p=t.t0&&t.t0.boot?t.t0.boot({phone:ve.isPhone,returning:W.returning,sameDay:W.sameDaySession,reduced:i}):Promise.resolve();return d(!1),p.then(()=>f(!1),()=>f(!1)),l}return t.nest&&t.nest.setFade(1,0),t.audio&&t.audio.play("bootSwell",{}),i?(c(200,()=>{t.nest&&u(400,p=>t.nest.setFade(1,p))}),c(300,()=>u(400,p=>n.setReveal({points:p,scanY:null,fill:p,alpha:p}))),c(700,()=>{h(),Yx(t),n.shootAxis(3.2,0),d(!1)}),c(1e3,()=>f(!1)),l):(n.setScramble("golden"),c(600,()=>{t.nest&&u(1e3,p=>t.nest.setFade(1,p),cn.reveal)}),c(1300,()=>d(!1)),c(900,()=>u(400,p=>n.setReveal({points:p,scanY:null,fill:p,alpha:p}),cn.reveal)),c(1e3,()=>{n.lockSequence({order:"down",stepMs:220,spin:!1,snap:.04}).then(()=>{o||(Qr.nLockAt==null&&(Qr.nLockAt=Zp()),h(),Yx(t),n.shootAxis(3.2,240).then(()=>{o||f(!1)}))})}),l)}function lw(t,e={show:!1}){let n=t.key;if(t.fx&&t.fx.pieces&&typeof t.fx.pieces.wakeReset=="function")try{t.fx.pieces.wakeReset()}catch{}return n?n.lockSequence({order:"down",stepMs:220,spin:!1,snap:.04}).then(()=>{n.ignite({color:J.night?"electrum":"ember",flash:!0}),t.bus.emit("boot:ignite",{returning:!0,wake:!0}),t.audio&&t.audio.play("signature",{found:t.secrets?t.secrets.found():[]})}):Promise.resolve()}async function D3(t){let e=t.key,n=t.fx&&t.fx.pieces;if(n&&typeof n.fold=="function")try{await n.fold({context:"relaunch"})}catch{}if(t.status&&t.status.say("relaunch"),!e)return;e.setScramble("golden"),e.douse();let i=null;i=t.input.push({name:"relaunch",onGesture(r){return r.type!=="tap"||J.room!=="CORE"||e.pick(r.x,r.y)<0?!1:(i(),lw(t,{show:!1}),!0)}})}function N3(t,e){let n=dr(ft.operator.name||""),i=38,r=[],s=null,o=1,a=!1,l=0,c=document.createElement("div");Object.assign(c.style,{position:"absolute",left:"50%",top:`calc(50% + ${(jx*50).toFixed(1)}vh + 24px)`,transform:"translateX(-50%)",textAlign:"center",whiteSpace:"nowrap",color:"var(--silver)"}),c.hidden=!0;let u=document.createElement("p");u.className="t-label",u.setAttribute("aria-hidden","true"),u.style.margin="0";let h=document.createElement("p");h.className="t-micro",h.setAttribute("aria-hidden","true"),h.style.margin="4px 0 0",h.style.opacity="0.7",c.appendChild(u),c.appendChild(h);let d=document.createElement("span");d.className="sr-only",d.textContent=n,t&&(t.appendChild(c),t.appendChild(d));let f=[];function g(){u.textContent="",f.length=0,[n].concat(r).forEach((p,m)=>{m&&u.appendChild(document.createTextNode("   "));let b=document.createElement("span");b.textContent=p,u.appendChild(b),f.push(b)}),h.textContent=s||"",h.hidden=!s,c.style.opacity=String(o)}g();let x={group:null,burn(p){let m=p&&Number.isFinite(p.at)?p.at:null,b=m!=null?Math.max(0,m-performance.now()):0;return b<=0?(x.showName(),Promise.resolve()):new Promise(E=>it(b,()=>{x.showName(),E()}))},showName(){a=!0,c.hidden=!(o>0)},burnGuests(p){return r=(Array.isArray(p)?p:[]).map(m=>dr(String(m||""))).filter(Boolean),g(),x.showName(),Promise.resolve()},clearGuests(){r=[],g()},rows(){return[n].concat(r).map(p=>({text:p,heightM:i,row:0}))},setRole(p){s=p?dr(String(p)):null,g()},namePoint(p,m){let b=m||{x:0,y:0},E=f[Math.max(0,Math.min(f.length-1,p|0))],v=E&&!c.hidden?E.getBoundingClientRect():null;return v&&v.width?(b.x=v.left+v.width/2,b.y=v.top+v.height/2):(b.x=ve.w/2,b.y=ve.h*.85),b},letterHeightM(){return i},setLitNodes(p){l=Math.max(0,p|0)},setAlpha(p){o=Math.max(0,Math.min(1,+p||0)),c.style.opacity=String(o),c.hidden=!a||!(o>0)}};return e&&kt("rim",()=>x.rows()),x}var O3="http://www.w3.org/2000/svg",jx=.56;function Kp(t,e,n){let i=document.createElementNS(O3,t);for(let r in e)i.setAttribute(r,e[r]);return n&&n.appendChild(i),i}function F3(){let t=Kp("svg",{viewBox:"-0.8 -1.3 1.6 2.6","aria-hidden":"true"});Object.assign(t.style,{position:"absolute",left:"50%",top:"50%",height:`${jx*100}vh`,transform:"translate(-50%,-50%)",overflow:"visible"});for(let e of Wt){let n=[],i=e.top>0&&e.bot<0?[e.top,0,e.bot]:[e.top,e.bot];for(let r of i)n.push(`${At(r).toFixed(3)},${(-r).toFixed(3)}`);for(let r=i.length-1;r>=0;r--)n.push(`${(-At(i[r])).toFixed(3)},${(-i[r]).toFixed(3)}`);if(Kp("polygon",{points:n.join(" "),fill:"none",stroke:"var(--silver)","stroke-width":"1","vector-effect":"non-scaling-stroke"},t),e.sign!=="•"){let r=Kp("text",{x:"0",y:(-e.mid).toFixed(3),"text-anchor":"middle","dominant-baseline":"central",fill:"var(--pewter)"},t);r.style.font='500 0.07px "Martian", ui-monospace, monospace',r.style.letterSpacing="0.008px",r.textContent=e.sign}}return Kp("circle",{cx:"0",cy:"0",r:"0.022",fill:"var(--ember)"},t),t}function Jp(t){let e=document.getElementById("t0"),n={},i=!1,r="CORE",s=F3();if(e){e.textContent="",Object.assign(e.style,{background:"var(--void)"}),e.appendChild(s);for(let l of Object.keys(he)){let c=document.createElement("section");c.dataset.room=l,c.hidden=l!=="CORE",Object.assign(c.style,{position:"absolute",left:"var(--title-x)",top:"calc(var(--datum-y) + 36px)"});let u=document.createElement("p");u.className="t-micro",u.textContent=`${he[l].num} · ${he[l].code} · ▽ ${he[l].level}`,c.appendChild(u),e.appendChild(c),n[l]=c}e.hidden=t.app.tier!=="T0"}let o=N3(e,t.app.tier==="T0"),a={root:e,rim:o,twin(l,c){},boot(l){return new Promise(c=>it(600,c))},show(l){let c=l&&he[l.room]?l.room:"CORE";r=c;for(let u in n)n[u].hidden=u!==c;s.style.display=c==="CORE"?"":"none"},keyScreen(){return{x:ve.w/2,y:ve.h/2,r:ve.h*jx/2}},showLost(){let l=r;i=!0,e&&(e.hidden=!1),a.show({room:"CORE"}),r=l},hideLost(){i&&(i=!1,e&&t.app.tier!=="T0"&&(e.hidden=!0),a.show({room:r}))}};return a}function cw(t,e,n){return new Promise(i=>{requestAnimationFrame(()=>i())})}var Li=null,Zx={x:0,y:0,depth:0,visible:!1},Ns=(t,e)=>t&&typeof t[e]=="function";function U3(t){return t&&t.isVector3&&Re.camera?(Re.project(t,Zx),{x:Zx.x,y:Zx.y}):t&&Number.isFinite(t.x)&&Number.isFinite(t.y)?{x:t.x,y:t.y}:{x:ve.w/2,y:ve.h/2}}function eh(t,e){let n=Li&&Li.status;Ns(n,"say")&&n.say(t,e||{})}async function k3(t,e){let n=W.data,i=Li&&Li.keyNav,r=n.shards<5&&!n.nadirOpen,s=r&&Ns(i,"slotPoint")?i.slotPoint(n.shards):Ns(i,"letterPoint")?i.letterPoint("I"):{x:ve.w/2,y:ve.h/2},o=W.rank().index;try{await cw(t,e,s)}catch{}r&&W.patch(l=>{l.shards=Math.min(5,(l.shards|0)+1)}),Ns(i,"refreshSlots")&&i.refreshSlots(),We.play("shard",{}),Sr(Mr.shard),Li&&Ns(Li.chrome,"relockFound")&&Li.chrome.relockFound(),eh("found"),r&&n.shards<5&&eh("shard",{k:n.shards}),_e.emit("shard:landed",{id:t,k:n.shards,count:es.count()});let a=W.rank();if(a.index>o&&(_e.emit("rank:change",{rank:a.name,index:a.index}),eh("rank",{rank:a.name.toLocaleLowerCase("ru")}),Ns(We,"setRank")&&We.setRank(a.index)),r&&n.shards>=5&&!n.nadirOpen){eh("shard",{k:5});let l=Li&&Li.fx&&Li.fx.pieces;if(Ns(l,"nadirUnseal"))try{await l.nadirUnseal()}catch{}if(W.data.nadirOpen)return;W.set("nadirOpen",!0),Li&&Ns(Li.lead,"show")&&Li.lead.show("Внизу что-то открылось.",{ms:3e3}),Ns(i,"crack")&&i.crack(),eh("nadir.open"),_e.emit("nadir:open",{})}}var es={init(t){return Li=t,t.secrets=es,es},discover(t,e={}){if(!jp(t)||!W.data||es.isFound(t))return!1;let n=e&&e.vars?{...e.vars}:{};W.patch(r=>{r.found[t]=new Date(Date.now()).toISOString(),(!r.foundVars||typeof r.foundVars!="object")&&(r.foundVars={}),r.foundVars[t]=n});let i=U3(e&&e.anchor);return _e.emit("secret:found",{id:t,anchor:i}),k3(t,i),!0},isFound(t){return!!(W.data&&W.data.found&&W.data.found[t])},found(){return Xx.filter(t=>es.isFound(t.id)).map(t=>t.id)},count(){return es.found().length},rank(){return W.rank()},get shards(){return W.data?W.data.shards|0:0}};var yH=Object.freeze([[1,2],[2,3],[1,4],[3,5],[2,7],[4,7]].map(t=>Object.freeze(t)));var LH=48;var FH=Object.freeze({legend:3,achievement:1.6,moment:1.2,joke:.8,before:3});var XH=Object.freeze(["stellated","twisted","nested","bipyramid","knot"]);var B3=343,xa=()=>performance.now(),z3=()=>({set(){},release(){},alive:!1});function uw(t,e){let n=Promise.resolve(),i={current:null,queue:[],run(x,p,m={maxWaitMs:1200}){let b=n.then(async()=>{i.current=x,J.fx.stage=x;try{await(typeof p=="function"?p({reduced:!1,signal:{aborted:!1}}):null)}catch{}return i.current=null,J.fx.stage=null,"ran"});return n=b.catch(()=>"ran"),b},busy(){return i.current!=null},deferToIdleCore(x,p){return i.run(x,p)}},r={at(x,p){let m=p||{},b=it(Math.max(0,x-xa()),()=>{try{m.visual&&m.visual()}catch{}try{m.audio&&We.fx.ready()&&m.audio(We.fx.ctxTimeFor(x))}catch{}});return{cancel(){Pn(b)}}},now(x){let p=x||{};try{p.visual&&p.visual()}catch{}try{p.audio&&We.fx.ready()&&p.audio()}catch{}},cancelAfter(x){},presentAt(x){return x+16.7},log(){return[]},nowPerf(){return xa()}},s={lastPauseAt:-1/0,lastProsvetAt:-1/0,pause(x={}){let p=x&&Number.isFinite(x.at)?x.at:xa();return s.lastPauseAt=p,new Promise(m=>it(Math.max(0,p+400-xa()),()=>{let b=p+400;try{x&&x.onHit&&x.onHit(b)}catch{}m({hitAt:b,advanced:!1,skipped:!1})}))},inPause(){return!1},prosvet(x){return!1}},o={fire(x){let p=xa();return{startAt:p,arrival:m=>p+1e3*(+m||0)/B3,stop(){}}}},a={rack(x){return Promise.resolve()},set(){},clear(){}},l={run(x){return{stop(){}}},stopAll(){}},c={show(){},hide(){},set(){},rmLabel(){}},u={show(){},hide(){},state:()=>({visible:!1,heightPx:0})},h={enabled:!1,emitter(){return z3()},splat(){},impulse(){},sheet(){},stats:()=>({pool:0,live:0})},d=(x,p)=>{try{t.t0&&typeof t.t0.twin=="function"&&t.t0.twin(x,p)}catch{}},g={stage:i,cue:r,impact:s,wave:o,focus:a,pulse:l,scalebar:c,scaleFigure:u,dust:h,pieces:{titleFx(x){return{stop(){}}},swarf(){},fold(x){let p=t.key;return p?(p.setScramble("golden"),p.douse()):e&&d("close",{phase:"asleep",t01:1}),new Promise(m=>it(600,m))},wakeReset(){},owner(x){return Promise.resolve({hitAt:xa(),rimAt:null,echoAt:null})},nadirUnseal(){return Promise.resolve({hitAt:xa()})}},setLineAlpha(x,p){ue.uFxLineA.value=Math.max(0,+x||0)},fogFactor(x,p,m){tr.factor(x,p)},ears:{tabReturn(){},descent(){},popAt(){}},provalFor(x){return new Promise(p=>it(Math.max(0,x||0),p))},setTier(x){},snapshot(){return{stage:i.current,queue:i.queue.slice(),impacts:[],prosvet:[],waveArrivalMs:null,timeScale:pe.timeScale,dust:h.stats()}}};return kt("fx",()=>g.snapshot()),kt("scaleBar",()=>null),kt("figure",()=>null),g}function hw(t){return uw(t,!1)}function Qp(t){return uw(t,!0)}var dw=["wait","finish","call","host","rope","gentle","notice","word"],tm={wait:0,finish:1,call:2,host:3,rope:4,word:5,notice:6},V3={wait:"КАПСУЛА",finish:"ЗОНД",call:"СБОР",host:"ГОСТИ",rope:"ВСЕ ВМЕСТЕ",word:"ДОГОВОРИЛИСЬ",notice:"ПОТЕРЯШКА"},th=["S","A","M","•","V","I","N"],G3=1,H3={SIGNAL:"Связь",ARCHIVE:"Летопись",MEMBERS:"Клан",VOYAGES:"Вылазки",INSIGNIA:"Хранилище",NADIR:"Исток"},em=()=>W.data||{},W3=t=>{for(let e of Object.keys(tm))if(tm[e]===t)return e;return null};function Qx(t){let e=th[t];if(!e)return null;let n=ft.clan&&ft.clan.code||[],i=typeof n[t]=="string"?n[t]:"",r=em().code&&typeof em().code[e]=="string"?em().code[e]:null;if(!r||!i)return null;let s=W3(t);return{text:i,at:r,deedId:s,deedName:s?V3[s]:""}}function fw(){let t=[];for(let e=0;e<7;e++)Qx(e)&&t.push(e);return t}function $3(t){let e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(t||""));if(!e)return"";let n=new Date(Date.UTC(+e[1],+e[2]-1,+e[3])),i=n.getUTCDay()||7;n.setUTCDate(n.getUTCDate()+4-i);let r=new Date(Date.UTC(n.getUTCFullYear(),0,1)),s=Math.ceil(((n-r)/864e5+1)/7);return`${n.getUTCFullYear()}-W${String(s).padStart(2,"0")}`}var va=t=>typeof t=="string"?t.slice(0,10):null,Jx=t=>{let e=ft.members.find(n=>n.id===t);return e?e.name:null};function pw(){let t=em(),e=[],n=(p,m,b,E,v,S,w,T)=>{let y={kind:p,id:m,date:b,label:E,title:v,text:S,who:w||[],height:G3};T&&Object.assign(y,T),e.push(y)},i=t.sbor||{},r=i.count|0,s=va(i.last);r>=1&&s&&n("sbor","sbor-all",s,`СБОРЫ · ${r}`,"Сборы клана",`Сборов: ${r}. Последний — ${ks(s,"dd.mm.yyyy")}.`,[]);let o=new Map;for(let p of Array.isArray(i.here)?i.here:[]){let m=va(p&&p.day);!m||!Array.isArray(p.ids)||!p.ids.length||o.set($3(m),{day:m,ids:p.ids.slice()})}let a=[...o.values()].sort((p,m)=>p.day<m.day?-1:p.day>m.day?1:0).slice(-30);for(let p of a){let m=p.ids.filter(b=>Jx(b));n("sbor",`sbor-${p.day}`,p.day,`СБОР · ${ks(p.day,"dd.mm.yyyy")}`,"Сбор клана",`Здесь были: ${m.map(Jx).join(", ")}.`,m)}let l=t.lost||{},c=Array.isArray(l.log)?l.log.filter(p=>p&&va(p.day)&&(p.kind==="one"||p.kind==="pair")):[];c.sort((p,m)=>p.day<m.day?-1:p.day>m.day?1:0);let u=0,h=0,d=0;for(let p of c){d+=1;let m=p.kind==="pair"?++h:++u;if(m!==1&&m%10!==0)continue;let b=H3[p.room]||"Ядро",E=va(p.day);p.kind==="pair"?n("deed",`deed-${d}`,E,`ДЕЛО · ${ks(E,"dd.mm.yyyy")}`,"Договорились",`Двое не слышали друг друга. Зал: ${b}. Ты помог им договориться.`,[],{sub:"pair"}):n("deed",`deed-${d}`,E,`ДЕЛО · ${ks(E,"dd.mm.yyyy")}`,"Не прошёл мимо",`Маленький ключ потерялся. Зал: ${b}. Ты привёл его домой.`,[],{sub:"one"})}let f=t.shows||{},g=new Map;if(Array.isArray(f.log))for(let p of f.log){let m=va(p&&p.day);m&&g.set(m,p)}else va(f.lastDay)&&(f.count|0)>0&&g.set(va(f.lastDay),{day:f.lastDay,guests:0,who:[]});let x=ft.operator.name;for(let[p,m]of g){let b=Array.isArray(m.who)?m.who.filter(v=>Jx(v)):[],E=Math.max(m.guests|0,b.length);n("show",`show-${p}`,p,`ПОКАЗ · ${ks(p,"dd.mm.yyyy")}`,"Показ для гостей",`Гостей: ${E}. Вёл ${x}.`,b)}return e.sort((p,m)=>p.date<m.date?1:p.date>m.date?-1:0),e}function mw(t){let e={done(n,i={}){if(!dw.includes(n)||!W.data)return!1;let r=W.data;if((!r.deeds||typeof r.deeds!="object")&&(r.deeds={}),typeof r.deeds[n]=="string")return!1;let s=i&&typeof i.at=="string"?i.at:new Date().toISOString();W.patch(c=>{c.deeds[n]=s}),_e.emit("deed:done",{id:n});let o=tm[n];if(o==null||!(ft.clan.code||[])[o])return!0;let l=th[o];return(!r.code||typeof r.code!="object")&&(r.code={}),typeof r.code[l]!="string"&&(W.patch(c=>{c.code[l]=s}),_e.emit("code:earned",{stratum:o})),!0},derive(){let n=W.data;if(!n)return;n.found&&typeof n.found.S04=="string"&&e.done("rope"),n.capsuleOpened===!0&&e.done("wait");let i=n.probes||{};for(let r of Object.keys(i)){let s=i[r];if(s&&s.back&&s.read===!0){e.done("finish");break}}},law:n=>Qx(n),earned:()=>fw(),bands:()=>pw(),setView(n){}};return _e.on("secret:found",n=>{n&&n.id==="S04"&&e.done("rope")}),_e.on("capsule:open",()=>e.done("wait")),_e.on("probe:read",n=>{let i=n&&W.data&&W.data.probes?W.data.probes[n.code]:null;i&&i.back&&typeof i.sent=="string"&&Io(i.sent,W.today)>0&&e.done("finish")}),e}function gw(t){t.deeds=mw(t),t.host={guests:{active:!1,list:()=>[],isHere:()=>!1,open(){},clear(){},letterHeightM:()=>38},show:{active:!1,scene:-1,start(){},next(){},prev(){},exit(){}},sbor:{attach(){},holdProgress(){},holdCancel(){},holdComplete:()=>Promise.resolve(),toggleHere(){},info:()=>({count:0,last:null,hint:!0})},lost:{today:()=>null,blocksDrone:()=>!1,snapshot:()=>null,setView(){}},proposals:{list:()=>[],openSheet(){},add:(n,i,r)=>null,remove(){},promoteFromWorld(){},proposedByName:()=>null}};try{t.deeds.derive()}catch{}t.host.proposals.promoteFromWorld();let e=()=>W.data||{};kt("deeds",()=>Object.keys(e().deeds||{}).filter(n=>typeof e().deeds[n]=="string")),kt("code",()=>th.filter(n=>e().code&&typeof e().code[n]=="string")),kt("show",()=>({active:!!J.show.active,scene:J.show.scene})),kt("guests",()=>J.guests|0),kt("sbor",()=>({count:(e().sbor&&e().sbor.count)|0})),kt("proposals",()=>Array.isArray(e().proposals)?e().proposals.length:0),kt("lost",()=>t.host.lost.snapshot())}var fe={world:ft,state:W,app:J,bus:_e,loop:pe,quality:pt,layout:ve,input:fn,audio:We,secrets:null,status:null,sheet:null,edges:null,hint:null,fog:null,palette:null,atlas:null,lead:null,overlay:null,dims:null,datum:null,chrome:null,keyNav:null,director:null,halls:null,renderer:null,scene:null,camera:null,rig:null,scale:null,nest:null,key:null,rim:null,lamp:null,U:null,worldFx:null,t0:null,composite:null,navMap:null,cursor:null,pillar:null,fx:null,host:null,deeds:null,wake:null};function Fn(t,e){try{return e(),!0}catch(n){return ot(`main:${t}`,`boot step "${t}" failed`,n),!1}}function xw(){Fn("env",()=>{Ft.reducedMotion,hh()}),Fn("state",()=>{xb(rs());let a=rs();J.night=Mm(a),J.drowsy=Yv(a),J.birthday=Sm(a),J.owner=!!W.data.owner,J.inverted=!!W.data.inverted,document.documentElement.style.setProperty("--shrp",String(W.shrp)),W.deliverTransmissions()}),Fn("fonts",()=>{vl()});let t=null;Fn("quality",()=>{t=pt.detect().gl}),J.tier!=="T0"&&(Fn("webgl",()=>{fe.composite=X3(t)})||_w()),J.tier==="T0"&&!fe.t0&&Fn("t0",()=>{fe.t0=Jp(fe),J.tier="T0"}),J.tier==="T0"&&(fe.rim=fe.t0&&fe.t0.rim?fe.t0.rim:fe.rim);let e=Fn("dom",()=>{fe.chrome=mn,mn.init(fe),fe.status=$n,$n.init(fe),fe.lead=Gu,Gu.init(fe),fe.overlay=Er,Er.init(fe),fe.dims=Fp,Fp.init(fe),fe.datum=ku,ku.init(fe),fe.edges=$u,$u.init(fe),fe.sheet=or,or.init(fe),fe.navMap=qi,qi.init(fe),fe.keyNav=lr,lr.init(fe),fe.cursor=Xu,Xu.init(fe),J.tier==="T0"&&mn.setT0Marker(!0)}),n=Fn("audio",()=>{We.init(fe)});Fn("fx",()=>{fe.fx=J.tier==="T0"?Qp(fe):hw(fe)})||Fn("fx:t0",()=>{fe.fx=Qp(fe)});let i=Fn("input",()=>{fn.init(fe),sw(fe)}),r=Xr("#/core"),s=Fn("navigation",()=>{r=Xr(location.hash),at.init(fe),un.init(fe)}),o=Fn("secrets",()=>{es.init(fe)});Fn("host",()=>gw(fe)),o=Fn("hint",()=>{Qu.init(fe)})&&o,Fn("hook",()=>{PS(fe)}),J.tier!=="T0"&&!(e&&n&&i&&s&&o)&&(_w(),Fn("t0",()=>{fe.t0=Jp(fe),fe.chrome&&mn.setT0Marker(!0)}),fe.t0&&fe.t0.rim&&(fe.rim=fe.t0.rim),Fn("fx:t0",()=>{fe.fx=Qp(fe)})),Fn("loop",()=>{pt.init(fe);let a=J.tier!=="T0"?fe.composite:null;a?(Y3(),pe.add(a.render,Nt.RENDER),a.onFirstFrame(()=>document.body.classList.remove("is-ff"))):document.body.classList.remove("is-ff"),pe.start(),J.tier!=="T0"&&pt.benchmark(),_e.emit("app:ready",{})}),Fn("boot",()=>{let a=()=>aw(fe,r).then(()=>yw(r),l=>{ot("main:boot",l),yw(r)});fe.composite&&J.tier!=="T0"?fe.composite.onFirstFrame(a):a()})}function vw(){let t=nt.core;return{pos:new C(...t.pos),target:new C(...t.target),fov:t.fov,offsetY:ve.kind==="desktop"?0:t.phoneOffsetY,roll:0}}function X3(t){let e=oS(document.getElementById("gl"),t,J.tier);return fe.renderer=e,fe.scene=e.scene,fe.camera=e.camera,fe.palette=ao,fe.U=ue,fe.fog=tr,ao.init(),Xt.init(J.tier),fe.atlas=Xt,tr.set(he.CORE.fog),Ke.init(e.scene,fe),fe.scale=Ke,fe.worldFx=new nn,fe.worldFx.name="worldFx",Ke.root.add(fe.worldFx),yn.init(fe),fe.nest=yn,fe.pillar=MS(),Ke.root.add(fe.pillar),fe.key=RS(fe),yn.level(0).add(fe.key.group),pe.add(fe.key.update,Nt.WORLD),fe.rim=DS(fe),Ke.root.add(fe.rim.group),Vi.init(fe),fe.lamp=Vi,Re.init(e.camera),fe.rig=Re,Re.setPose(vw()),_e.on("layout:change",()=>{fe.director||Re.setPose(vw())}),pe.add((n,i)=>{ue.uTime.value=i/1e3,ue.uWorldTime.value=pe.worldNow/1e3,ue.uBreath.value=Cn.mix(0,1)},Nt.CLOCK),pe.add(n=>Vi.update(n),Nt.LAMP),pe.add(n=>Re.apply(n),Nt.CAMERA),_e.on("gl:lost",()=>{try{fe.t0||(fe.t0=Jp(fe)),fe.t0.showLost()}catch(n){ot("main:t0",n)}}),_e.on("gl:restored",()=>{fe.t0&&fe.t0.hideLost&&fe.t0.hideLost()}),dS(e)}function Y3(){if(!(fe.renderer&&fe.renderer.three)||!fe.scene||!fe.camera)return;let e=[];fe.scene.traverse(n=>{n.visible||(e.push(n),n.visible=!0)});try{fe.renderer.warm(fe.scene,fe.camera,fe.scene)}catch(n){ot("main:warm",n)}for(let n of e)n.visible=!1}function yw(t){(J.phase==="boot"||J.phase==="start")&&Mi("idle"),J.booting=!1,fe.director&&(fe.director.settle(),t&&(t.room!=="CORE"||t.sub)&&fe.director.go(t.hash,{source:"deeplink"}))}function _w(){fe.renderer=fe.scene=fe.camera=fe.key=fe.rim=fe.rig=fe.scale=fe.nest=fe.lamp=null,fe.composite=null,pt.tier="T0",J.tier="T0";let t=document.getElementById("gl");t&&(t.hidden=!0)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",xw,{once:!0}):xw();})();
