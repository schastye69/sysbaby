(()=>{var px=t=>{try{return typeof matchMedia=="function"?matchMedia(t):null}catch{return null}},bp=px("(prefers-reduced-motion: reduce)"),Sp=px("(pointer: coarse)"),Mp=typeof navigator<"u"&&navigator.userAgent||"",hx=typeof navigator<"u"&&navigator.maxTouchPoints||0,Qt={reducedMotion:!!(bp&&bp.matches),coarse:!!(Sp&&Sp.matches),touch:hx>0,ios:/iPad|iPhone|iPod/.test(Mp)||/Macintosh/.test(Mp)&&hx>1,android:/Android/i.test(Mp)},fx=[];function mx(t,e){t&&(t.addEventListener?t.addEventListener("change",e):t.addListener&&t.addListener(e))}mx(bp,t=>{Qt.reducedMotion=!!t.matches;for(let e=0;e<fx.length;e++)try{fx[e](Qt.reducedMotion)}catch(n){xt("env:rm","reduced-motion listener failed",n)}});mx(Sp,t=>{Qt.coarse=!!t.matches});var dx=new Set;function xt(t,...e){if(!dx.has(t)){dx.add(t);try{console.warn(`[sam.vin] ${t}:`,...e)}catch{}}}var Ou=new Map,Ee={on(t,e){let n=Ou.get(t);return n||(n=[],Ou.set(t,n)),n.push(e),()=>Ee.off(t,e)},off(t,e){let n=Ou.get(t);if(!n)return;let i=n.indexOf(e);i<0&&(i=n.findIndex(r=>r.orig===e)),i>=0&&n.splice(i,1)},once(t,e){let n=i=>{Ee.off(t,n),e(i)};return n.orig=e,Ee.on(t,n),()=>Ee.off(t,n)},emit(t,e){let n=Ou.get(t);if(!n||n.length===0)return;let i=n.slice();for(let r=0;r<i.length;r++)try{i[r](e)}catch(s){xt(`bus:${t}`,`listener for '${t}' threw`,s)}}};var _l=Object.freeze(["void","abyss","deep","steel","slate","pewter","silver","white","obsidian","ember","emberDeep","electrum","paper","ink"]),Ml=Object.freeze({void:"--void",abyss:"--abyss",deep:"--deep",steel:"--steel",slate:"--slate",pewter:"--pewter",silver:"--silver",white:"--white",obsidian:"--obsidian",ember:"--ember",emberDeep:"--ember-deep",electrum:"--electrum",paper:"--paper",ink:"--ink"}),qo=Object.freeze({void:"#04060A",abyss:"#070B12",deep:"#0C1420",steel:"#13202F",slate:"#233446",pewter:"#5E6E80",silver:"#B8C4D0",white:"#EEF2F6",obsidian:"#0B1119",ember:"#FF6A2B",emberDeep:"#B23A12",electrum:"#E8C872",paper:"#E6EAEE",ink:"#0C1420"}),gx=Object.freeze({void:"#E6EAEE",abyss:"#E6EAEE",deep:"#E6EAEE",steel:"#9AA6B4",slate:"#9AA6B4",silver:"#0C1420",white:"#0C1420",obsidian:"#D3D9DF"});function wp(t){return parseInt(t.slice(1),16)}function xx(t,e=[0,0,0]){let n=wp(t);return e[0]=(n>>16&255)/255,e[1]=(n>>8&255)/255,e[2]=(n&255)/255,e}function Bu(t,e){let n={};for(let i of Object.keys(t))n[i]=e(t[i]);return Object.freeze(n)}var jP=Bu(qo,wp),zS=Bu(qo,t=>Object.freeze(xx(t))),ZP=Bu(gx,wp),VS=Bu(gx,t=>Object.freeze(xx(t)));function ku(t,e,n=[0,0,0]){let i=zS[t],r=VS[t]||i;return n[0]=i[0]+(r[0]-i[0])*e,n[1]=i[1]+(r[1]-i[1])*e,n[2]=i[2]+(r[2]-i[2])*e,n}var KP=Object.freeze({giant:.07,counter:.12,status:.85,scrim:.6,scrimBreath:[.58,.62],leader:.7,line:.55,vertex:.4,inlay:.45,fresnel:.55,grains:.35,grainsBreath:[.32,.38],axisInside:.35,marginalia:.8,legendBand:.4,column:.7,dimmed:.4,hoverOthers:.55,dome:.45,contours:.4,doneLight:.12,ghost:.6,ghostStroke:.3,whale:.3,spark:.3,rimBoot:[.06,.12],bandHover:1.25}),JP=Object.freeze({maxFrac:.03,peakFrac:.06,peakMs:1500,maxLinePx:2,maxDotPx:6,maxTextPx:11,burnCoolMs:1200}),QP=Object.freeze({maxMs:2500,coolMs:600,nightNucleus:.55}),zr=Object.freeze({nucleusIntensity:.55,litAlpha:.7,breathMs:7e3,drowsyBreathMs:5600,mixMs:1200,yawnMs:1200}),eI=Object.freeze({sans:'"Geologica", system-ui, sans-serif',mono:'"Martian", ui-monospace, monospace'}),tI=Object.freeze({giant:{family:"sans",wght:100,tracking:-.04,lh:.8,desktop:"38vw",phone:"62vmin",alpha:.07},display:{family:"sans",wght:220,tracking:-.035,lh:.9,desktop:"clamp(56px, 8.4vw, 148px)",phone:"13vmin"},heading:{family:"sans",wght:560,desktop:[28,34],phone:[26,31]},lead:{family:"sans",wght:300,desktop:[22,30],phone:[19,26]},brief:{family:"sans",wght:380,desktop:[19,28],phone:[17,25]},body:{family:"sans",wght:380,desktop:[17,25],phone:[16,24],measureCh:36},status:{family:"sans",wght:400,desktop:[16,22],phone:[16,22],maxChars:34,measureCh:44},label:{family:"mono",wght:500,wdth:87.5,tracking:.08,upper:!0,desktop:[11,14],phone:[11,14]},data:{family:"mono",wght:250,wdth:100,tabular:!0,desktop:[72,72],phone:[48,48]},micro:{family:"mono",wght:450,wdth:75,tracking:.1,upper:!0,desktop:[9.5,12],phone:[10,13]}}),bl=Object.freeze({sign:'700 {px}px "Geologica"',burn:'700 {px}px "Geologica"',sand:'700 {px}px "Geologica"',ring:'500 {px}px "Martian"'});var Uu=Object.freeze({base:20,range:80,perDay:.08,perSecret:.06});function Ap(t,e){return Math.min(1,Uu.perDay*t+Uu.perSecret*e)}function vx(t,e){return Math.round(Uu.base+Uu.range*Ap(t,e))}var nI=Object.freeze([120,240,480,960,1920]),iI=Object.freeze({o1:120,o2:240,o3:480,o4:960,o5:1920}),yx=Object.freeze({heavy:Object.freeze({omega:6,zeta:1}),medium:Object.freeze({omega:12,zeta:1}),light:Object.freeze({omega:22,zeta:1}),struck:Object.freeze({omega:18,zeta:.18}),notice:Object.freeze({omega:6.3,zeta:.95}),reindex:Object.freeze({omega:9,zeta:1}),hot:Object.freeze({omega:14,zeta:1}),hint:Object.freeze({omega:8,zeta:.25})}),di=Object.freeze({inertiaDecay:.92,frameMs:16.7,spinDecay:.96,overshootMax:.04,snapOvershoot:.04,settleOvershoot:.02,anticipationFrac:.03,anticipationMs:120,anticipationMinDisp:.1,responseMs:80,pressScale:.96,pressMs:90,rippleMs:260,ripplePx:48}),jo=Object.freeze({periodMs:4200,inhaleMs:1800,exhaleMs:2400,drowsyMs:5600,nightMs:7e3,reducedAmp:.25,nucleus:[.8,1],gap:[.02,.026],grainAlpha:[.32,.38],scrim:[.58,.62],edgeSwayPx:.2,droneDb:2});function Fu(t,e,n,i){let r=3*t,s=3*(n-t)-r,o=1-r-s,a=3*e,l=3*(i-e)-a,c=1-a-l,u=d=>((o*d+s)*d+r)*d,f=d=>((c*d+l)*d+a)*d,h=d=>(3*o*d+2*s)*d+r;return function(g){if(g<=0)return 0;if(g>=1)return 1;let _=g;for(let M=0;M<8;M++){let T=u(_)-g;if(Math.abs(T)<1e-6)return f(_);let x=h(_);if(Math.abs(x)<1e-6)break;_-=T/x}let m=0,p=1;_=g;for(let M=0;M<24;M++){let T=u(_);if(Math.abs(T-g)<1e-6)break;T<g?m=_:p=_,_=(m+p)/2}return f(_)}}var rI=Object.freeze({camera:Object.freeze([.7,0,.15,1]),reveal:Object.freeze([.16,1,.3,1]),phosphor:Object.freeze([.2,0,0,1])}),_x=Object.freeze({camera:Fu(.7,0,.15,1),reveal:Fu(.16,1,.3,1),phosphor:Fu(.2,0,0,1),linear:t=>t<=0?0:t>=1?1:t,sine:t=>.5-.5*Math.cos(Math.PI*(t<=0?0:t>=1?1:t))}),_e=Object.freeze({dive:1600,diveFirst:2400,diveFirstScale:1.375,diveFirstHold:200,diveSwapAt:1200,diveSwapAtFirst:1850,recall:1200,recallSwapAt:1e3,recallRatchetMs:40,liftBase:900,liftPerBoundary:280,liftMax:1800,slice:280,sliceSwap:140,depart:240,arrive:600,readableOut:120,retargetMin:600,retargetFactor:.8,skipSpeed:3,interactiveU:.7,releaseSourceMs:300,tierFreezeMs:300,unfold:1600,unfoldFirst:2200,refold:900,memberFocus:900,memberBack:600,shluz:1400,shluzBack:900,extract:600,workshop:1200,zenith:2400,nadirFirst:2800,focusReduced:160,bootDesktop:7200,bootReturning:3500,bootSameDay:2e3,bootReduced:2e3,lockStep:220,lockStepSameDay:110,firstLock:3400,ignite:4940,ignitionReturning:2640,typeMsPerChar:28,scanMs:800,burnMsPerLetter:70,burnCoolMs:1200,assemble:480,drawIn:600,phoneActivateWindow:1500,phonePartialHold:2500,phonePartialDrift:900,phoneHintDelay:2200,phoneHintReturning:4e3,lockIn:480,lockInReduced:160,revealMsPerChar:12,revealMax:240,beamCps:22,phosphor:900,statusIn:240,statusHold:4e3,idleRotate:2e4,leadDefault:4e3,leaderDraw:240,leaderStagger:40,labelLowpass:120,coordHz:10,keyHoverTrigger:120,keyHoverIn:480,keyHoverOut:520,dimsDraw:240,navHover:240,navTwin:240,longPress:800,relaunch:2e3,relaunchRingDelay:300,hintGlint:1200,overpullHold:600,stringRing:900,stringFlash:120,shudder:240,hintArriveWindow:3e4,idleLampMs:3e3,lampSweepMs:9e3,lampBlendMs:600,shardFlight:900,electrum:2500,electrumCool:600});var Mx=Math.log(1e3),sI=Object.freeze([-1,0,1,2]),bx=1.5,Ep=Object.freeze({near:.002,far:400}),tr=Object.freeze({min:3.2,max:12,rest:7.2,wheelFactor:1.1,wheelStepPx:100}),oI=Object.freeze({d0:12,k:Mx,wheelDiv:2400,pinchGain:1.5,pauseMs:400,decay:.92,elevationDeg:8,settleIdleMs:600,settleMs:1600,settleTo:7.2,leadMs:4e3,strutTickMax:30,stages:Object.freeze([["КЛЮЧ",60],["ЗАЛ ЯДРА",600],["VIN",3600],["VIN ЦЕЛИКОМ",12e3]]),passLatticeD:[300,620]}),Sx=Object.freeze({d0:.06,k:Mx,miniKeyBelow:.05}),aI=Object.freeze({height:2400,diameter:1240,radius:620}),ao=Object.freeze({H:2.4,R:.62,k:1.35,halfH:1.2});function Ct(t){let e=Math.min(1,Math.abs(t)/ao.halfH);return ao.R*(1-Math.pow(e,ao.k))}var an=Object.freeze([{i:0,sign:"S",code:"SIGNAL",top:1.2,bot:.98,n:3,hollow:0,k:72},{i:1,sign:"A",code:"ARCHIVE",top:.96,bot:.66,n:5,hollow:0,k:120},{i:2,sign:"M",code:"MEMBERS",top:.64,bot:.28,n:7,hollow:0,k:168},{i:3,sign:"•",code:"CORE",top:.26,bot:-.26,n:12,hollow:.3,k:288},{i:4,sign:"V",code:"VOYAGES",top:-.28,bot:-.64,n:7,hollow:0,k:168},{i:5,sign:"I",code:"INSIGNIA",top:-.66,bot:-.96,n:5,hollow:0,k:120},{i:6,sign:"N",code:"NADIR",top:-.98,bot:-1.2,n:3,hollow:0,k:72}].map(t=>Object.freeze({...t,height:Math.round((t.top-t.bot)*1e3)/1e3,mid:(t.top+t.bot)/2,rTop:Ct(t.top),rBot:Ct(t.bot),rMax:t.top>0&&t.bot<0?ao.R:Math.max(Ct(t.top),Ct(t.bot))}))),Sl=Object.freeze(["S","A","M","•","V","I","N"]),zu=Object.freeze([0,1/3,2/3,1]),Pt=Object.freeze({rest:.02,breath:.026,leanAdd:.01,hover:.09,hoverNeighbourPush:.012,dive:.3,unfold:.42,recallStart:.3}),Nt=Object.freeze({radius:1.25,apertureD:.09,ringEngraveW:.004,hollowR:.3,sign:Object.freeze({depth:.004,heightFrac:.7,strokeFrac:.12,face:0}),friezeH:.018,ticksPerFace:12,tickLen:.025,backFace:6,hoverSlide:.06,diveSlide:.25,diveTurnAwayDeg:20,contract:.03,nucleusAnticipation:1.6,lattice:Object.freeze({faceShift:.75,segmentsPerGenerator:8,generators:2016,segments:16128,solidBelowCamDist:2.4}),r1:Object.freeze({spLo:3,spHi:6}),unfold:Object.freeze({camFrom:7.2,camTo:Object.freeze([0,.04,.95]),ringScale:2.4,ringR:1.3,ringArcDeg:300,ringCap:.06,coreRingCap:.12,platesR:.16,plateSize:.05,platesPeriodS:24,orbitYawDeg:35}),pitchFlipDeg:110,pitchResist:.35,pitchResistMaxDeg:30,yawMaxDeg:180,yawReturnMs:2e3}),zn=Object.freeze({r:.035,detail:1,glowR:.0528,breathRingR:.09,apertureAlignDeg:Object.freeze([35,10]),gapOpen:Object.freeze([.03,.09]),minVisibility:.25,hotGain:.4,intensity:Object.freeze([.8,1]),birthdayPulse:1.3}),ki=Object.freeze({half:1.2,extend:3.2,widthPx:2,alphaInside:.35,shootMs:240}),lI=Object.freeze({driftYawDeg:14,driftPeriodS:40,swayDeg:1.5,swayPeriodsS:Object.freeze([11,13,17,19,23,29,31]),faceViewerDeg:16,reindexMs:Object.freeze([23e3,41e3]),reindexBackMs:1600,reindexTurnMs:620,noticeMaxDeg:7,noticeBootDeg:6,tauBaseMs:40,tauStepMs:40,hotDelayMs:220,hotDelayLateMs:90,hotTrackMs:3e3,hotRampMs:1e3,leanSpeedPx:300,leanRadius:1.2,leanDz:.08,flinchSpeedPx:2500,flinchRadius:1.5,flinchInMs:120,flinchRelaxMs:700,flinchScatter:.05,repelR:.35,repelCap:.06,repelBackMs:900}),Zo=Object.freeze({T3:24576,T2:16384,T1:8192,annulus:Object.freeze([1.15,1.9]),kepler:.06,jitter:.002,sizePx:Object.freeze([1.2,2]),chunk:4096}),lo=Object.freeze({faces:Object.freeze([11,0,1]),stratum:3,apertureSkip:.06,dotPx:1.5,emitterM:1.2}),cI=Object.freeze({max:7,size:.1,r:1.05,tiltDeg:12,periodS:90}),uI=Object.freeze({size:.24,r:1.6,periodS:60,bpm:71,arriveDay:10,flyMs:2400});var wx=Object.freeze({SIGNAL:1090,ARCHIVE:810,MEMBERS:460,CORE:0,VOYAGES:-460,INSIGNIA:-810,NADIR:-1090,ZENITH:1260,WORKSHOP:484}),Ax=Object.freeze({SIGNAL:[980,1200],ARCHIVE:[660,960],MEMBERS:[280,640],CORE:[-260,260],VOYAGES:[-640,-280],INSIGNIA:[-960,-660],NADIR:[-1200,-980],ZENITH:[1200,1400],WORKSHOP:[482,487]}),gn=Object.freeze({wallsNear:300,wallsFar:620,wallVis:Object.freeze([.08,.14]),strutSpacing:Object.freeze([13,60]),ringStep:20,irisR:18,irisBlades:7,irisBladeDeg:51.4,irisPassR:12,deckR:60,deckRingStep:4,beadR:1.8,beadStep:25,beadCount:97,coreRimR:300,coreIrisY:260,liftOffset:Object.freeze([12,0,6]),drawCalls:40,triangles:12e4,labels:24,labelsLow:16}),Je=Object.freeze({fov:35,fovWide:40,core:Object.freeze({pos:[0,.75,7.2],target:[0,0,0],fov:35,phoneOffsetY:-.06}),boot:Object.freeze({start:[0,.4,16],dolly:9.5,rest:7.2,driftM:.08,driftHz:[.13,.11],tiltDeg:3}),phoneStart:Object.freeze({dist:5.2,keyFrac:.78,centreFrac:.47}),members:Object.freeze({pos:[0,10,48],target:[0,12.5,0],fov:35,phonePos:[0,11,40]}),voyages:Object.freeze({pos:[0,70,44],target:[0,0,-6],fov:35,altRange:[60,140],phonePos:[0,96,30],phonePitchDeg:-70}),archive:Object.freeze({tubeR:9,eyeBelowBand:.4}),signal:Object.freeze({pos:[0,2,26],target:[0,30,0],fov:40,phonePos:[0,2,30],phonePitchDeg:40,apexH:110,apexR:12}),insignia:Object.freeze({pos:[0,1.7,0],fov:40,sphereR:30}),nadir:Object.freeze({depth:110}),zenith:Object.freeze({aboveApex:60,pitchDeg:-62,phonePitchDeg:-70}),workshop:Object.freeze({chamber:4.4,grid:2.4,nodeStep:.4})}),dt=Object.freeze({phoneMaxShort:600,landMaxH:500,desktop:Object.freeze({cols:12,margin:48,gutter:24,chrome:24,edgeInset:14,statusBottom:40,datumFrac:.62}),phone:Object.freeze({cols:4,margin:16,gutter:12,chrome:16,edgeInset:10,statusAboveBand:12,datumPx:120,titleTopPx:72}),measureCh:36,statusMeasureCh:44,hit:44,hitRow:56,crossPx:7,leader:Object.freeze({widthPx:.5,alpha:.7,elbowMin:24,elbowMax:64,runMax:120,maxAnchors:24,maxAnchorsLow:16}),dims:Object.freeze({widthPx:.5,arrowPx:6,extPx:4,gapPx:4,offsetPx:24}),scrim:Object.freeze({scale:1.4,featherPx:40}),nav:Object.freeze({w:56,h:300,hoverW:260,right:24,widthScale:.36,needlePx:12,slotPx:3,zenithDotPx:2,zenithDotAbove:10,twinPx:40,magnetPx:12,wheelPxPerDetent:120,rubber:.35,rubberMax:48,overpullPx:140,letterPx:11}),band:Object.freeze({h:88,sideW:72,letterPx:13,minCell:44}),sheet:Object.freeze({maxFrac:.62,peek:120,handle:24,sideFrac:.44}),elevator:Object.freeze({pxPerHall:360,resistance:.22,tickPx:60}),edge:Object.freeze({pluckPxMs:.4,bendPx:8,twitchPx:2}),sound:Object.freeze({w:32,h:12,bars:8,fps:30}),cursorPx:6,rippleMaxPx:48,beamHeadPx:3,statusDotPx:6}),en=Object.freeze({r1:Object.freeze({lo:3,hi:6,bayer:8}),r2:Object.freeze({fresnelPow:3,fresnelGain:.55,spec:Object.freeze([[24,.35],[160,.6]])}),r3:Object.freeze({widthPx:1,primaryPx:1.5,axisPx:2,alpha:.55,glintPow:24,glintGain:.9,farFadeStart:.55,primaryEdges:12}),r4:Object.freeze({atlas:1024,atlasLow:512,rakeLo:.55,rakeHi:.9,inlay:.45,heightTaps:4}),r5:Object.freeze({radiusFactor:2.2,elevationDeg:12,idleMs:3e3,sweepMs:9e3,blendMs:600}),r6:Object.freeze({threshold:.82,levels:4,spritePx:64}),r7:Object.freeze({grain:.02,grainBoot:.025,grainBootUntilMs:1800,grainFps:24,clearInPx:120,clearOutPx:180,vignette:.18,vignetteFrom:.35}),r8:Object.freeze({fogVis:Object.freeze([.08,.14])}),dprCap:Object.freeze({T3:2,T2:1.5,T1:1.25}),dprStep:.25,governor:Object.freeze({windowFrames:90,lowFps:52,dropAfterMs:3e3,highFps:58,upgradeAfterMs:1e4}),budget:Object.freeze({drawCalls:40,triangles:12e4,textureMB:12})}),Ex=30;var ve={kind:"desktop",isPhone:!1,w:0,h:0,dpr:1,safe:{t:0,r:0,b:0,l:0}},Ko=null;function GS(){if(typeof document>"u"||!document.body)return;Ko||(Ko=document.createElement("div"),Ko.setAttribute("aria-hidden","true"),Ko.style.cssText="position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)",document.body.appendChild(Ko));let t=getComputedStyle(Ko);ve.safe.t=parseFloat(t.paddingTop)||0,ve.safe.r=parseFloat(t.paddingRight)||0,ve.safe.b=parseFloat(t.paddingBottom)||0,ve.safe.l=parseFloat(t.paddingLeft)||0}var Tp=null;function HS(){try{return Tp||(Tp=matchMedia("(pointer: coarse)")),Tp.matches}catch{return!1}}function Vu(){if(typeof window>"u")return!1;let t=Math.max(1,Math.round(window.innerWidth||document.documentElement.clientWidth||1)),e=Math.max(1,Math.round(window.innerHeight||document.documentElement.clientHeight||1)),n=HS()&&Math.min(t,e)<=dt.phoneMaxShort,i=n?e<dt.landMaxH?"phone-land":"phone":"desktop",r=window.devicePixelRatio||1,s=ve.safe.t,o=ve.safe.r,a=ve.safe.b,l=ve.safe.l;GS();let c=t!==ve.w||e!==ve.h||i!==ve.kind||r!==ve.dpr||s!==ve.safe.t||o!==ve.safe.r||a!==ve.safe.b||l!==ve.safe.l;return ve.w=t,ve.h=e,ve.kind=i,ve.isPhone=n,ve.dpr=r,c}var Rp=0;function Cp(){if(Rp)return;let t=()=>{Rp=0,Vu()&&Ee.emit("layout:change",{kind:ve.kind,w:ve.w,h:ve.h})};Rp=typeof requestAnimationFrame=="function"?requestAnimationFrame(t):setTimeout(t,16)}if(typeof window<"u"){Vu(),window.addEventListener("resize",Cp),window.addEventListener("orientationchange",Cp);try{matchMedia("(pointer: coarse)").addEventListener("change",Cp)}catch{}}var te={phase:"boot",room:"CORE",route:{room:"CORE",sub:null,hash:"#/core"},u:0,tier:"T2",soundOn:!0,night:!1,drowsy:!1,birthday:!1,owner:!1,inverted:!1,unfolded:!1,pullNest:0,resonancePct:0,status:"",columns:[],satellites:0,companion:!1,booting:!0,hintTarget:null};function zi(t){let e=te.phase;t!==e&&(te.phase=t,Ee.emit("phase:change",{phase:t,prev:e}))}var Jo={operator:{id:"sam",name:"Сэм",aliases:["сэм","sam","сэмми","семён","semyon"],callsign:"ВЕДУЩИЙ",birthday:"2018-04-12"},clan:{name:"SAM.VIN",motto:"Своих не бросаем. Даже в лаве.",founded:"2025-03-14",frequency:14.03,sigil:[[3,21],[21,45],[45,27],[27,3],[21,27],[3,45]]},members:[{id:"sam",name:"Сэм",callsign:"ВЕДУЩИЙ",role:"основатель",status:"на связи",level:12,missions:21,seed:7,note:"D4",glyph:null,trait:"Придумал клан на перемене. Всегда идёт первым.",joke:"Говорит «я рядом», когда он на другом конце карты.",achievements:["start","bridge","onehp"]},{id:"lev",name:"Лёва",callsign:"ЯКОРЬ",role:"защита",status:"на связи",level:11,missions:17,seed:23,note:"G3",glyph:[[3,38],[9,11],[38,29],[38,33]],trait:"Если Лёва держит точку — точка держится.",joke:"Знает все карты наизусть. Даже те, которых нет.",achievements:["start","bridge"]},{id:"tim",name:"Тимур",callsign:"ЭХО",role:"разведка",status:"в пути",level:9,missions:14,seed:41,note:"A3",glyph:[[21,9],[9,39],[39,27]],trait:"Слышит соперника раньше, чем тот появится.",joke:"Всегда приходит последним — и спасает всех.",achievements:["three"]},{id:"kira",name:"Кира",callsign:"ЛИСА",role:"наблюдение",status:"на связи",level:10,missions:15,seed:5,note:"B3",glyph:[[8,38],[38,12],[12,8],[8,2],[12,4]],trait:"Видит то, что пропустили все.",joke:"Однажды спряталась так, что её не нашли до конца матча.",achievements:["silent","three"]},{id:"danya",name:"Даня",callsign:"ГРОМ",role:"прорыв",status:"отдыхает",level:8,missions:11,seed:17,note:"E4",glyph:[[4,23],[23,25],[25,44]],trait:"Громкий только в голосовом чате.",joke:"Прыгнул с крыши. Долетел. До сих пор этим гордится.",achievements:["roof"]},{id:"misha",name:"Миша",callsign:"КОМЕТА",role:"связь",status:"в пути",level:7,missions:9,seed:31,note:"G4",glyph:[[36,12],[36,26],[36,18]],trait:"Самый быстрый. Иногда слишком.",joke:"Первым добежал до финиша. В другую сторону.",achievements:["pizza"]},{id:"ars",name:"Арсений",callsign:"ТИШИНА",role:"новичок",status:"на связи",level:3,missions:2,seed:13,note:"A4",glyph:[[21,27],[24,17]],trait:"Новичок. Уже удивил всех.",joke:"Спросил, где кнопка «победить». Мы ищем до сих пор.",achievements:[]}],missions:[{code:"001",title:"Первая высадка",status:"done",brief:"Первый матч клана в полном составе.",conditions:["4 игрока","одна попытка"],crew:["sam","lev","tim","kira"],result:"Проиграли 0:12. Но вместе.",reward:"start",log:"Зонд нашёл на месте высадки старый флаг клана. Он всё ещё там."},{code:"002",title:"Мост над пропастью",status:"done",brief:"Перебраться всем отрядом. Никто не должен упасть.",conditions:["весь отряд","без возрождений"],crew:["sam","lev","danya","misha"],result:"Упали двое. Вернулись.",reward:"bridge",log:"Зонд проверил мост. Мост держится. Лёва, видимо, тоже."},{code:"003",title:"Тихая гавань",status:"done",brief:"Удержать маяк до заката и ни разу не потерять связь.",conditions:["отряд из 3","без потерь","до заката"],crew:["sam","kira","tim"],result:"Маяк наш. Связь — сто процентов.",reward:"silent",log:"Зонд вернулся. На маяке кто-то оставил пиццу."},{code:"004",title:"Северная башня",status:"active",brief:"Добраться до вершины втроём.",conditions:["3 игрока","без возрождений"],crew:["sam","lev","ars"],result:"",reward:"tower",log:"Зонд долетел до середины башни. Вершина видна. Она высокая."},{code:"005",title:"Ночная смена",status:"new",brief:"Продержаться до рассвета. Говорить только шёпотом.",conditions:["4 игрока","шёпотом","до рассвета"],crew:[],result:"",reward:"night",log:"Зонд слушал всю ночь. Кто-то храпел. Не будем говорить кто."},{code:"006",title:"Тёмная вода",status:"locked",decodeDays:5,brief:"Найти, откуда идёт сигнал под водой.",conditions:["5 игроков","с фонарями"],crew:[],result:"",reward:null,log:"Зонд нырнул. Сигнал идёт снизу. Там что-то светится."},{code:"007",title:"Город без карты",status:"locked",unlockAtDays:7,brief:"Пройти город, где никто не был, и нарисовать его карту.",conditions:["весь клан","без подсказок"],crew:[],result:"",reward:null,log:"Зонд нарисовал карту. Город похож на ключ. Совпадение?"},{code:"008",title:"Сто ступеней",status:"locked",unlockAtDays:14,brief:"Подняться по самой длинной лестнице, не упав ни разу.",conditions:["2 игрока","ни одного падения"],crew:[],result:"",reward:null,log:"Зонд насчитал 101 ступень. Одна была лишняя."},{code:"000",title:"Исток",status:"sealed",brief:"Вернуться туда, где всё началось, и оставить там свой знак.",conditions:["весь клан","знак лидера"],crew:[],result:"",reward:"origin",log:"Зонд вернулся с фото первого матча. Все улыбаются. Даже проигравшие."}],achievements:[{id:"start",title:"Начало",shape:"nested",rarity:"обычная",earned:!0,date:"2025-03-15",who:["sam","lev","tim","kira"],text:"Мы сыграли первый матч вместе."},{id:"roof",title:"Прыжок с крыши",shape:"knot",rarity:"легендарная",earned:!0,date:"2025-05-30",who:["danya"],text:"Никто не верил. Гром прыгнул. Гром долетел."},{id:"bridge",title:"Мост выстоял",shape:"twisted",rarity:"редкая",earned:!0,date:"2025-06-02",who:["sam","lev","danya","misha"],text:"Трое против пяти. Мост остался наш."},{id:"three",title:"Трое против всех",shape:"stellated",rarity:"легендарная",earned:!0,date:"2025-08-19",who:["tim","kira","sam"],text:"Нас было трое. Их — все остальные. Победили мы."},{id:"silent",title:"Тишина в эфире",shape:"bipyramid",rarity:"редкая",earned:!0,date:"2025-09-27",who:["kira","tim","sam"],text:"Целый раунд без единого слова. И победили."},{id:"onehp",title:"Победа с 1 HP",shape:"stellated",rarity:"редкая",earned:!0,date:"2025-12-20",who:["sam"],text:"Одна жизнь. Одна попытка. Этого хватило."},{id:"pizza",title:"Пицца-протокол",shape:"nested",rarity:"обычная",earned:!0,date:"2026-01-04",who:["misha","danya"],text:"Перерыв на пиццу посреди решающего матча. Всё равно выиграли."},{id:"tower",title:"Северная башня",shape:"bipyramid",rarity:"редкая",earned:!1,text:"Подняться на вершину втроём."},{id:"night",title:"Ночная смена",shape:"knot",rarity:"обычная",earned:!1,text:"Продержаться до рассвета шёпотом."},{id:"hundred",title:"Сотня",shape:"twisted",rarity:"легендарная",earned:!1,text:"Сыграть сто матчей вместе."},{id:"origin",title:"Исток",shape:"stellated",rarity:"легендарная",earned:!1,text:"Пройти вылазку 000."}],legends:[{id:"found",date:"2025-03-14",kind:"эпичное",title:"Основание",text:"Три человека, один ноутбук, ноль побед. Так всё началось."},{id:"jump",date:"2025-05-30",kind:"победа",title:"Прыжок с крыши",text:"Никто не верил. Гром прыгнул. Гром долетел."},{id:"nights",date:"2025-11-14",kind:"эпичное",title:"Ночь трёх возрождений",text:"Остался один. Поднял всех. Никто до сих пор не понимает как."},{id:"wifi",date:"2026-03-12",kind:"смешное",title:"Великое падение Wi-Fi",text:"Мы почти выиграли. Почти. Роутер помнит всё."}],moments:[{id:"hide",date:"2025-04-20",title:"Лучшее укрытие",who:["kira"],text:"Кира спряталась так хорошо, что её не нашли до конца матча. Даже свои."},{id:"bug",date:"2025-07-08",title:"Великий баг на мосту",who:["danya"],text:"Мост исчез у всех, кроме Дани. Даня стоял в воздухе и не понимал, почему все кричат."},{id:"room",date:"2025-10-02",title:"Секретная комната",who:["lev"],text:"Лёва нашёл секретную комнату и двадцать минут не мог из неё выйти."},{id:"wrong",date:"2026-02-15",title:"Не туда",who:["misha"],text:"Миша первым добежал до финиша. В другую сторону."},{id:"button",date:"2026-06-01",title:"Кнопка «победить»",who:["ars"],text:"Арсений спросил, где кнопка «победить». Мы ищем до сих пор."},{id:"mic",date:"2026-08-23",title:"Тихий план",who:["tim"],text:"Тимур полчаса рассказывал план. Микрофон был выключен. План сработал всё равно."}],jokes:[{id:"key",date:"2025-03-20",hidden:!1,trigger:"ключ",text:"Кто взял ключ? — Никто не брал ключ."},{id:"cover",date:"2025-06-10",hidden:!1,trigger:"прикрывал",text:"Я не отстал. Я прикрывал."},{id:"maps",date:"2025-09-01",hidden:!0,trigger:"карты",text:"Правило №1: не спорить с Лёвой про карты."},{id:"micro",date:"2025-10-15",hidden:!0,trigger:"микрофон",text:"Кто опять забыл включить микрофон?"},{id:"pizza",date:"2026-01-04",hidden:!0,trigger:"пицца",text:"ПИЦЦА-ПРОТОКОЛ АКТИВИРОВАН."},{id:"tactic",date:"2026-04-01",hidden:!0,trigger:"манёвр",text:"Это был тактический манёвр."}],transmissions:[{from:"ШТАБ",text:"Добро пожаловать в VIN. Здесь всё ваше."},{from:"ШТАБ",text:"Новая вылазка откроется в субботу. Готовьтесь."},{from:"ПАПА",text:"Горжусь вашим кланом. Конец связи."},{from:"ШТАБ",text:"Напоминание: вода — тоже снаряжение."},{from:"ШТАБ",text:"На маяке нашли пиццу. Расследование продолжается."},{from:"МАМА",text:"Уроки — это тоже миссия. Секретная."},{from:"ШТАБ",text:"Сегодня отличный день, чтобы найти что-нибудь новое."},{from:"ШТАБ",text:"Если увидишь кита — передай привет."},{from:"ПАПА",text:"Тот, кто читает эту передачу, — молодец. Да, ты."},{from:"ШТАБ",text:"Ключ светится ярче, когда вы вместе."}],signal:{secret:"Частота 14.03 — день, когда всё началось. Ты её нашёл. Об этом знают только свои."},capsule:{openAfterDays:7,text:"Если ты это читаешь — ты вернулся. Настоящий исследователь всегда возвращается. — Папа"},zenith:{message:"Отсюда видно всё, что вы построили. Это только начало."},nadir:{origin:"Всё началось 14 марта 2025 года. Сэм придумал название на перемене: SAM.VIN. Первый матч мы проиграли 0:12. Никто не ушёл. С тех пор ключ светится."},night:{from:21,to:7,drowsyFrom:20,story:"Ночью в VIN тихо. Узлы светятся вполсилы, как окна в доме, где все уже спят."},companion:{name:"Искра"}};function Pp(t){let e=Math.max(0,Math.min(48,t|0));return{x:e%7/6,y:Math.floor(e/7)/6}}function Tx(t){if(typeof t=="number")return Number.isFinite(t)?Math.round(t):NaN;if(typeof t=="string"&&t.trim()!==""){let e=Number(t.trim());return Number.isFinite(e)?Math.round(e):NaN}return NaN}function co(t){let e=[];if(!Array.isArray(t))return e;let n=new Set;for(let i=0;i<t.length&&e.length<24;i++){let r=t[i];if(!Array.isArray(r)||r.length!==2)continue;let s=Tx(r[0]),o=Tx(r[1]);if(!(s>=0&&s<=48&&o>=0&&o<=48)||s===o)continue;let a=Math.min(s,o),l=Math.max(s,o),c=a*64+l;n.has(c)||(n.add(c),e.push([a,l]))}return e}function wl(t){let e=t>>>0;return function(){e=e+1831565813>>>0;let i=e;return i=Math.imul(i^i>>>15,i|1),i^=i+Math.imul(i^i>>>7,i|61),((i^i>>>14)>>>0)/4294967296}}function Al(t){let e=2166136261,n=String(t);for(let i=0;i<n.length;i++)e^=n.charCodeAt(i),e=Math.imul(e,16777619);return e>>>0}var yI=.5*(Math.sqrt(3)-1),_I=(3-Math.sqrt(3))/6,MI=new Float32Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,0,1,0,-1]);function Gu(t,e,n,i){let r=Math.floor(Math.abs(Number(t)||0)),s=r%10,o=r%100;return o>=11&&o<=14?i:s===1?e:s>=2&&s<=4?n:i}function WS(t){let e="";for(let n=0;n<t.length;n++)n>0&&(t.length-n)%3===0&&(e+=" "),e+=t[n];return e}function Cx(t,e=2){let n=Number(t)||0,i=Math.abs(n).toFixed(e),r=i.indexOf("."),s=r>=0?i.slice(0,r):i,o=r>=0?i.slice(r):"";return(Number(i)===0?"±":n>0?"+":"−")+WS(s)+o}var Rx=t=>(t<10?"0":"")+t;function Px(t,e="dd.mm.yyyy"){if(t==null)return"";let n=String(t),i,r,s,o=/^(\d{4})-(\d{2})-(\d{2})$/.exec(n);if(o)i=+o[1],r=+o[2],s=+o[3];else{let l=Date.parse(n);if(!Number.isFinite(l))return"";let c=new Date(l);i=c.getFullYear(),r=c.getMonth()+1,s=c.getDate()}let a=`${Rx(s)}.${Rx(r)}`;return e==="dd.mm"?a:`${a}.${i}`}function El(t){return String(t??"").toLocaleUpperCase("ru")}var Ix=Object.freeze({"boot.pointer":{text:"вижу тебя.",p:3},"boot.nopointer":{text:"система проснулась.",p:3},"return.sameDay":{text:"снова ты.",p:3},"return.days":{text:"ты вернулся. тебя не было {N} {N:день|дня|дней}.",p:3},"return.days.owner":{text:"привет, {name}. тебя не было {N} {N:день|дня|дней}.",p:3},"return.node":{text:"пока тебя не было: +1 узел.",p:2},night:{text:"спокойной ночи, {name}.",p:3},drowsy:{text:"скоро ночь.",p:3},"night.flinch":{text:"ещё не сплю.",p:1},"tab.back":{text:"вот ты где.",p:3},"drawing.boot":{text:"помню твой рисунок.",p:3},"drawing.saved":{text:"запомнил.",p:1},"glyph.saved":{text:"запомнил.",p:1},"probe.sent":{text:"зонд {code} в пути. вернётся завтра.",p:1},"probe.back":{text:"зонд {code} вернулся. есть запись.",p:2},"transmission.new":{text:"пришла передача.",p:2},"mission.decoded":{text:"вылазка {code} расшифрована.",p:2},"companion.far":{text:"кто-то летит к нам.",p:2},"companion.near":{text:"он ближе. осталось {n} {n:день|дня|дней}.",p:2},"companion.arrived":{text:"он прилетел. его зовут {name}.",p:1},"capsule.open":{text:"капсула открыта.",p:1},birthday:{text:"с днём рождения, {name}!",p:2},anniversary:{text:"сегодня {title}. {years} {years:год|года|лет} назад.",p:2},found:{text:"найдено.",p:1},shard:{text:"осколок {k} из 5 на месте.",p:1},"nadir.open":{text:"внизу что-то открылось.",p:1},rank:{text:"новый ранг: {rank}.",p:1},dizzy:{text:"всё кружится.",p:1},"dizzy.after":{text:"уже лучше.",p:1},whale:{text:"смотри. кит.",p:1},drone:{text:"дрон принёс шутку.",p:1},pull:{text:"ты всё ещё внутри sam.vin.",p:1},relaunch:{text:"сплю. разбуди меня.",p:1},"member.typed":{text:"{callsign} на связи.",p:1},"hint.done":{text:"пока всё найдено.",p:1},"hint.time":{text:"остальное придёт само. возвращайся.",p:1},sealed:{text:"запечатано. осколков {k} из 5.",p:1},"route.missing":{text:"здесь ничего нет. пока.",p:1},"idle.nodes":{text:"{n} {n:узел|узла|узлов} горит.",p:5},"idle.mission":{text:"вылазка {code} ждёт.",p:5}});var Hu=jo.inhaleMs/jo.periodMs,On={value:0,phase:0,periodMs:jo.periodMs,amp:Qt.reducedMotion?jo.reducedAmp:1,setPeriod(t){t>0&&(On.periodMs=t)},mix(t,e){return t+(e-t)*(.5+(On.value-.5)*On.amp)}};function XS(t){return t<Hu?.5-.5*Math.cos(Math.PI*(t/Hu)):.5+.5*Math.cos(Math.PI*((t-Hu)/(1-Hu)))}var Qo=new Map,$S=1;function ut(t,e){let n=$S++;return Qo.set(n,{at:fe.now+Math.max(0,t||0),fn:e}),n}function Vn(t){Qo.delete(t)}var ea=new Set;function Fn(t,e,n){let i,r=new Promise(o=>{i=o}),s={start:fe.now,ms:Math.max(0,t||0),fn:e,ease:n||null,resolve:i,live:!0};if(s.ms===0){try{e(1)}finally{i()}return{done:r,cancel(){}}}return ea.add(s),{done:r,cancel(){s.live&&(s.live=!1,ea.delete(s),i())}}}var Tl=[],Ip=-1,Lp=0;function YS(t,e){t.at<=Lp&&Tl.push(e)}function qS(t){let e=(Lp-t.start)/t.ms;if(e>=1){t.live=!1,ea.delete(t);try{t.fn(1)}catch(n){xt("clock:tween","tween callback threw",n)}t.resolve()}else{let n=e<=0?0:e;try{t.fn(t.ease?t.ease(n):n)}catch(i){xt("clock:tween","tween callback threw",i),t.live=!1,ea.delete(t),t.resolve()}}}function jS(t,e){Lp=e,On.amp=Qt.reducedMotion?jo.reducedAmp:1;let n=Ip<0?0:Math.max(0,e-Ip);if(Ip=e,On.phase=(On.phase+n/On.periodMs)%1,On.value=XS(On.phase),Qo.size){Tl.length=0,Qo.forEach(YS);for(let i=0;i<Tl.length;i++){let r=Qo.get(Tl[i]);if(r){Qo.delete(Tl[i]);try{r.fn()}catch(s){xt("clock:after","timer callback threw",s)}}}}ea.size&&ea.forEach(qS)}function Lx(){fe.add(jS,It.CLOCK)}try{Lx()}catch{Promise.resolve().then(Lx)}var xr=[],pi=null,bs=null,uo=0,Dp=0,ZS=0,Wu=0;function KS(t,e){return t.replace(/\{(\w+)(?::([^|}]*)\|([^|}]*)\|([^}]*))?\}/g,(n,i,r,s,o)=>{let a=e?e[i]:void 0;return a==null?n:r!=null?Gu(a,r,s,o):String(a)})}function JS(t){Gn.current=t,te.status=t.text,bs&&(bs.textContent=t.text),pi&&(pi.classList.remove("is-in"),pi.textContent=t.text,Wu&&cancelAnimationFrame(Wu),Wu=requestAnimationFrame(()=>{Wu=0,pi.classList.add("is-in")})),uo&&Vn(uo),uo=ut(_e.statusHold,QS),Ee.emit("status:show",{key:t.key,text:t.text,p:t.p})}function Np(){return!Gn.current||fe.now-Gn.current.at>=_e.statusHold}function QS(){uo=0,xr.length&&Xu(xr.shift())}function Xu(t){t.at=fe.now,JS(t)}function e1(t){if(xr.some(n=>n.text===t.text))return;let e=xr.length;for(;e>0&&xr[e-1].p>t.p;)e--;xr.splice(e,0,t),xr.length>4&&xr.pop()}function t1(){for(let t=0;t<2;t++){if(ZS++%2===0)return{key:"idle.nodes",vars:{n:Y.litNodes|0}};let n=_t.missions||[];for(let i=0;i<n.length;i++){let r=null;try{r=$u(n[i])}catch{r=null}if(r&&(r.state==="active"||r.state==="new"))return{key:"idle.mission",vars:{code:r.numberShown||n[i].code}}}}return{key:"idle.nodes",vars:{n:Y.litNodes|0}}}function Dx(){if(Dp=ut(_e.idleRotate,Dx),te.booting||xr.length||!Np())return;let t=Gn.current;if(t&&t.p<5&&fe.now-t.at<_e.idleRotate)return;let e=t1();Gn.say(e.key,e.vars)}var Gn={current:null,init(t){let e=document.getElementById("chrome");return pi=document.getElementById("status"),!pi&&e&&(pi=document.createElement("p"),pi.id="status",pi.className="t-status",pi.setAttribute("aria-hidden","true"),e.appendChild(pi)),bs=document.getElementById("status-live"),bs&&bs.getAttribute("aria-live")!=="polite"&&bs.setAttribute("aria-live","polite"),Dp||(Dp=ut(_e.idleRotate,Dx)),Gn},say(t,e={},n={}){let i=Ix[t];if(!i)return!1;let r={key:t,text:KS(i.text,e),p:i.p,at:0},s=Gn.current;return s&&s.text===r.text&&!Np()?!0:n&&n.force||!s||Np()||r.p===1&&s.p>1?(Xu(r),!0):(e1(r),!0)},clear(){xr.length=0,Gn.current=null,te.status="",uo&&(Vn(uo),uo=0),pi&&(pi.classList.remove("is-in"),pi.textContent=""),bs&&(bs.textContent="")}};var n1={done:"ЗАВЕРШЕНА",active:"В ПУТИ",new:"НОВАЯ",sealed:"ЗАПЕЧАТАНА"};function i1(t){let e=t.decodeDays!=null?t.decodeDays:t.unlockAtDays;return t.status!=="locked"||!e?null:Math.min(100,Math.round(100*Y.distinctDays/e))}function $u(t){let e=t,n=Y.data||{},i=e.status,r=i1(e);i==="sealed"&&n.nadirOpen&&(i="new"),i==="locked"&&r===100&&(i="new");let s=null;if(i==="locked")if(e.decodeDays!=null)s="Расшифровка идёт. Возвращайся завтра — будет больше.";else{let l=Math.max(1,e.unlockAtDays-Y.distinctDays);s=`Откроется через ${l} ${Gu(l,"день","дня","дней")}.`}else i==="sealed"&&(s="Ключ к ней — в самом низу.");let o=Array.isArray(n.decoded)?n.decoded:[],a=Op(e.code);return{code:e.code,title:e.title,state:i,label:i==="locked"?`СИГНАЛ ЗАШИФРОВАН ${r}%`:n1[i],p:e.status==="locked"?r:null,numberShown:i==="locked"?"0??":e.code,lockedText:s,decodeReady:e.status==="locked"&&r===100&&!o.includes(e.code),probe:a,canProbe:(i==="done"||i==="active"||i==="new")&&a==="none",mission:e}}function Op(t){let e=Y.data&&Y.data.probes?Y.data.probes[t]:null;return e?e.back?"back":"out":"none"}var Fp=["operator","clan","members","missions","achievements","legends","moments","jokes","transmissions","signal","capsule","zenith","nadir","night","companion"],Ux={members:12,missions:24,achievements:24,legends:32,moments:64,jokes:64,transmissions:400},r1=["G2","A2","B2","D3","E3","G3","A3","B3","D4","E4","G4","A4","B4","D5","E5","G5","A5","B5","D6","E6","G6","A6","B6","D7"],s1=["D4","G3","A3","B3","E4","G4","A4","B4","D5","E5","G5","A5"],Nx=["stellated","twisted","nested","bipyramid","knot"],ta=t=>t!==null&&typeof t=="object"&&!Array.isArray(t),_n=(t,e)=>t[e]!==void 0&&t[e]!==null,Pl=t=>typeof structuredClone=="function"?structuredClone(t):JSON.parse(JSON.stringify(t)),Si=t=>{try{return JSON.stringify(t).slice(0,40)}catch{return String(t)}};function Bt(t,e,n,i,r){if(typeof t!="string"&&!(typeof t=="number"&&Number.isFinite(t)))return r(`${i}: ${Si(t)} invalid`),{ok:!1};let s=String(t).normalize("NFC").trim().replace(/\s+/g," ");return s===""&&n?(r(`${i}: empty`),{ok:!1}):(s.length>e&&(s=s.slice(0,e-1)+"…",r(`${i}: longer than ${e}, cut`)),{ok:!0,v:s})}function Ss(t,e,n){if(typeof t!="string"&&typeof t!="number")return n(`${e}: ${Si(t)} invalid`),{ok:!1};let i=String(t).trim().toLowerCase().replace(/[^a-z0-9_-]/g,"");return i?(i.length>24&&(i=i.slice(0,24),n(`${e}: longer than 24, cut`)),i!==String(t)&&n(`${e}: ${Si(t)} → "${i}"`),{ok:!0,v:i}):(n(`${e}: ${Si(t)} invalid`),{ok:!1})}function Ox(t,e,n){return typeof t=="number"&&Number.isInteger(t)&&t>=0&&t<=999?{ok:!0,v:String(t).padStart(3,"0")}:typeof t=="string"&&/^\d{3}$/.test(t.trim())?{ok:!0,v:t.trim()}:(n(`${e}: ${Si(t)} invalid`),{ok:!1})}function Fx(t,e,n){if(t<2e3||t>2100||e<1||e>12||n<1)return!1;let i=new Date(Date.UTC(t,e,0)).getUTCDate();return n<=i}function na(t,e,n){if(typeof t=="string"){let i=t.trim(),r=/^(\d{4})-(\d{2})-(\d{2})$/.exec(i);if(r&&Fx(+r[1],+r[2],+r[3]))return{ok:!0,v:i};if(r=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(i),r&&Fx(+r[3],+r[2],+r[1]))return{ok:!0,v:`${r[3]}-${r[2]}-${r[1]}`}}return n(`${e}: ${Si(t)} invalid date`),{ok:!1}}function Bx(t,e){return typeof t=="number"?t:typeof t=="string"&&t.trim()!==""?Number(e?t.trim().replace(",","."):t.trim()):NaN}function Vr(t,e,n,i,r){let s=Bx(t,!1);if(!Number.isFinite(s))return r(`${i}: ${Si(t)} invalid`),{ok:!1};let o=Math.round(s);return(o<e||o>n)&&(o=Math.min(n,Math.max(e,o)),r(`${i}: ${Si(t)} clamped → ${o}`)),{ok:!0,v:o}}function o1(t,e,n,i,r,s){let o=Bx(t,!0);if(!Number.isFinite(o))return s(`${r}: ${Si(t)} invalid`),{ok:!1};let a=Math.pow(10,i),l=Math.round(o*a)/a;return(l<e||l>n)&&(l=Math.min(n,Math.max(e,l)),s(`${r}: ${Si(t)} clamped → ${l}`)),{ok:!0,v:l}}function kx(t,e,n){return t===!0||t===1||t==="true"||t==="да"?{ok:!0,v:!0}:t===!1||t===0||t==="false"||t==="нет"?{ok:!0,v:!1}:(n(`${e}: ${Si(t)} invalid`),{ok:!1})}function Ll(t,e,n,i){if(typeof t=="string"){let r=t.trim().toLowerCase();if(e.includes(r))return{ok:!0,v:r}}return i(`${n}: ${Si(t)} invalid`),{ok:!1}}function zx(t,e,n){if(!Array.isArray(t))return n(`${e}: not a list`),{ok:!1};let i=co(t);return i.length!==t.length&&n(`${e}: ${t.length-i.length} edge(s) dropped`),i.length?{ok:!0,v:i}:{ok:!1}}function ct(t,e,n,i){if(!_n(t,e))return i;let r=n(t[e]);return r.ok?r.v:i}function Vx(t,e,n,i,r,s){if(!_n(t,e))return[];let o=t[e];if(!Array.isArray(o))return s(`${r}: not a list`),[];let a=[];for(let l=0;l<o.length;l++){if(a.length>=n){s(`${r}: more than ${n}, rest dropped`);break}let c=Bt(o[l],i,!0,`${r}[${l}]`,s);c.ok&&a.push(c.v)}return a}function Yu(t,e,n,i,r){if(!_n(t,e))return[];let s=t[e];if(!Array.isArray(s))return r(`${i}: not a list`),[];let o=[];for(let a=0;a<s.length&&o.length<n;a++){let l=Ss(s[a],`${i}[${a}]`,r);l.ok&&o.push(l.v)}return s.length>n&&r(`${i}: more than ${n}, rest dropped`),o}function Nl(t,e){let n=t,i=2;for(;e.has(n);)n=`${t}-${i++}`;return e.add(n),n}function Up(t){return String(t).toLocaleLowerCase("ru").replace(/[^a-zа-яё0-9]/g,"")}function ho(t,e,n,i){let r=[],s=Ux[e];for(let o=0;o<t.length;o++){let a=`${e}[${o}]`;if(r.length>=s){i(`${e}: more than ${s}, rest dropped`);break}if(!ta(t[o])){i(`${a}: not an object, dropped`);continue}let l=n(t[o],o,a);l&&r.push(l)}return r}function a1(t,e){let n=new Set;return ho(t,"achievements",(i,r,s)=>{let o=_n(i,"title")?Bt(i.title,40,!0,`${s}.title`,e):{ok:!1};if(!o.ok)return e(`${s}: no title, dropped`),null;let a=_n(i,"id")?Ss(i.id,`${s}.id`,e):{ok:!1},l=Nl(a.ok?a.v:`a${r+1}`,n),c=ct(i,"earned",u=>kx(u,`${s}.earned`,e),!1);return{id:l,title:o.v,shape:ct(i,"shape",u=>Ll(u,Nx,`${s}.shape`,e),Nx[r%5]),rarity:ct(i,"rarity",u=>Ll(u,["обычная","редкая","легендарная"],`${s}.rarity`,e),"обычная"),earned:c,date:c?ct(i,"date",u=>na(u,`${s}.date`,e),null):null,who:Yu(i,"who",12,`${s}.who`,e),text:ct(i,"text",u=>Bt(u,200,!1,`${s}.text`,e),"")}},e)}function l1(t,e){let n=new Set(["workshop"]);return ho(t,"members",(i,r,s)=>{let o=_n(i,"name")?Bt(i.name,24,!0,`${s}.name`,e):{ok:!1};if(!o.ok)return e(`${s}: no name, dropped`),null;let a=_n(i,"id")?Ss(i.id,`${s}.id`,e):{ok:!1},l=Nl(a.ok?a.v:`m${r+1}`,n),c=s1[r%12];if(_n(i,"note")){let u=typeof i.note=="string"?i.note.trim().toUpperCase():"";r1.includes(u)?c=u:e(`${s}.note: ${Si(i.note)} invalid → "${c}"`)}return{id:l,name:o.v,callsign:ct(i,"callsign",u=>Bt(u,16,!1,`${s}.callsign`,e),""),role:ct(i,"role",u=>Bt(u,32,!1,`${s}.role`,e),""),status:ct(i,"status",u=>Ll(u,["на связи","в пути","отдыхает"],`${s}.status`,e),"на связи"),level:ct(i,"level",u=>Vr(u,0,99,`${s}.level`,e),1),missions:ct(i,"missions",u=>Vr(u,0,999,`${s}.missions`,e),0),seed:ct(i,"seed",u=>Vr(u,0,9999,`${s}.seed`,e),Al(l)%100),note:c,glyph:ct(i,"glyph",u=>zx(u,`${s}.glyph`,e),null),trait:ct(i,"trait",u=>Bt(u,120,!1,`${s}.trait`,e),""),joke:ct(i,"joke",u=>Bt(u,160,!1,`${s}.joke`,e),""),achievements:Yu(i,"achievements",16,`${s}.achievements`,e)}},e)}function c1(t,e){let n=new Set;for(let r of t)if(ta(r)&&_n(r,"code")){let s=Ox(r.code,"",()=>{});s.ok&&n.add(s.v)}let i=new Set;return ho(t,"missions",(r,s,o)=>{let a=null;if(_n(r,"code")){let f=Ox(r.code,`${o}.code`,e);if(f.ok&&(a=f.v,i.has(a)))return e(`${o}: duplicate code ${a}, dropped`),null}if(a===null&&(a=String(s+1).padStart(3,"0"),i.has(a)||n.has(a)))return e(`${o}: no code (${a} taken), dropped`),null;i.add(a);let l=ct(r,"status",f=>Ll(f,["done","active","new","locked","sealed"],`${o}.status`,e),"new"),c=ct(r,"decodeDays",f=>Vr(f,1,365,`${o}.decodeDays`,e),null),u=ct(r,"unlockAtDays",f=>Vr(f,1,365,`${o}.unlockAtDays`,e),null);return l!=="locked"?(c=null,u=null):c!=null&&u!=null?(u=null,e(`${o}: locked with both day fields → decodeDays kept`)):c==null&&u==null&&(c=7,e(`${o}: locked without days → decodeDays 7`)),{code:a,title:ct(r,"title",f=>Bt(f,48,!0,`${o}.title`,e),`Вылазка ${a}`),status:l,brief:ct(r,"brief",f=>Bt(f,240,!1,`${o}.brief`,e),""),conditions:Vx(r,"conditions",6,40,`${o}.conditions`,e),crew:Yu(r,"crew",12,`${o}.crew`,e),result:ct(r,"result",f=>Bt(f,160,!1,`${o}.result`,e),""),reward:ct(r,"reward",f=>Ss(f,`${o}.reward`,e),null),log:ct(r,"log",f=>Bt(f,200,!1,`${o}.log`,e),""),decodeDays:c,unlockAtDays:u}},e)}function u1(t,e){let n=new Set;return ho(t,"legends",(i,r,s)=>{let o=_n(i,"date")?na(i.date,`${s}.date`,e):{ok:!1},a=_n(i,"title")?Bt(i.title,48,!0,`${s}.title`,e):{ok:!1};if(!o.ok||!a.ok)return e(`${s}: needs date and title, dropped`),null;let l=_n(i,"id")?Ss(i.id,`${s}.id`,e):{ok:!1};return{id:Nl(l.ok?l.v:`l${r+1}`,n),date:o.v,kind:ct(i,"kind",c=>Ll(c,["победа","смешное","эпичное"],`${s}.kind`,e),"эпичное"),title:a.v,text:ct(i,"text",c=>Bt(c,300,!1,`${s}.text`,e),"")}},e)}function h1(t,e){let n=new Set;return ho(t,"moments",(i,r,s)=>{let o=_n(i,"date")?na(i.date,`${s}.date`,e):{ok:!1},a=_n(i,"title")?Bt(i.title,48,!0,`${s}.title`,e):{ok:!1};if(!o.ok||!a.ok)return e(`${s}: needs date and title, dropped`),null;let l=_n(i,"id")?Ss(i.id,`${s}.id`,e):{ok:!1};return{id:Nl(l.ok?l.v:`mo${r+1}`,n),date:o.v,title:a.v,who:Yu(i,"who",12,`${s}.who`,e),text:ct(i,"text",c=>Bt(c,300,!0,`${s}.text`,e),a.v)}},e)}function f1(t,e){let n=new Set;return ho(t,"jokes",(i,r,s)=>{let o=_n(i,"text")?Bt(i.text,160,!0,`${s}.text`,e):{ok:!1};if(!o.ok)return e(`${s}: no text, dropped`),null;let a=_n(i,"id")?Ss(i.id,`${s}.id`,e):{ok:!1},l=ct(i,"trigger",c=>Bt(c,24,!1,`${s}.trigger`,e),"");return{id:Nl(a.ok?a.v:`j${r+1}`,n),date:ct(i,"date",c=>na(c,`${s}.date`,e),null),hidden:ct(i,"hidden",c=>kx(c,`${s}.hidden`,e),!1),trigger:Up(l),text:o.v}},e)}function d1(t,e){return ho(t,"transmissions",(n,i,r)=>{let s=_n(n,"text")?Bt(n.text,240,!0,`${r}.text`,e):{ok:!1};return s.ok?{from:ct(n,"from",o=>Bt(o,16,!0,`${r}.from`,e),"ШТАБ"),text:s.v}:(e(`${r}: no text, dropped`),null)},e)}function p1(t,e){let n=Jo.clan;return{name:ct(t,"name",i=>Bt(i,24,!0,"clan.name",e),n.name),motto:ct(t,"motto",i=>Bt(i,80,!0,"clan.motto",e),n.motto),founded:ct(t,"founded",i=>na(i,"clan.founded",e),n.founded),frequency:ct(t,"frequency",i=>o1(i,0,99.99,2,"clan.frequency",e),n.frequency),sigil:ct(t,"sigil",i=>zx(i,"clan.sigil",e),co(n.sigil))}}function m1(t,e,n){let i=Jo.operator,r=_n(t,"name")?Bt(t.name,24,!0,"operator.name",n):{ok:!1},s,o=_n(t,"id")?Ss(t.id,"operator.id",n):{ok:!1};if(o.ok)s=o.v,e.some(c=>c.id===s)||n(`operator.id: "${s}" matches no member (kept)`);else{let c=r.ok?e.find(u=>u.name.toLocaleLowerCase("ru")===r.v.toLocaleLowerCase("ru")):null;s=c?c.id:e.length?e[0].id:"sam"}let a=e.find(c=>c.id===s)||null,l=r.ok?r.v:a?a.name:i.name;return{id:s,name:l,aliases:Vx(t,"aliases",8,24,"operator.aliases",n),callsign:ct(t,"callsign",c=>Bt(c,16,!1,"operator.callsign",n),a?a.callsign:""),birthday:ct(t,"birthday",c=>na(c,"operator.birthday",n),null)}}function g1(t,e,n){let i=Jo,r=(s,o)=>{try{t[s]=o(ta(e[s])?e[s]:i[s])}catch{n(`${s}: crashed, default used`),t[s]=Pl(i[s])}};r("signal",s=>({secret:ct(s,"secret",o=>Bt(o,240,!0,"signal.secret",n),i.signal.secret)})),r("capsule",s=>({openAfterDays:ct(s,"openAfterDays",o=>Vr(o,0,365,"capsule.openAfterDays",n),i.capsule.openAfterDays),text:ct(s,"text",o=>Bt(o,300,!0,"capsule.text",n),i.capsule.text)})),r("zenith",s=>({message:ct(s,"message",o=>Bt(o,160,!0,"zenith.message",n),i.zenith.message)})),r("nadir",s=>({origin:ct(s,"origin",o=>Bt(o,400,!0,"nadir.origin",n),i.nadir.origin)})),r("night",s=>({from:ct(s,"from",o=>Vr(o,0,23,"night.from",n),i.night.from),to:ct(s,"to",o=>Vr(o,0,23,"night.to",n),i.night.to),drowsyFrom:ct(s,"drowsyFrom",o=>Vr(o,0,23,"night.drowsyFrom",n),i.night.drowsyFrom),story:ct(s,"story",o=>Bt(o,240,!0,"night.story",n),i.night.story)})),r("companion",s=>({name:ct(s,"name",o=>Bt(o,16,!0,"companion.name",n),i.companion.name)}))}function x1(t){let e=[],n=u=>{e.push(u)},i=Jo,r=t;ta(r)||(r={});let s={},o=[];try{o=Object.keys(r)}catch{o=[]}for(let u of o)Fp.includes(u)||n(`unknown key ${u}`);let a={};for(let u of Fp){let f;try{f=r[u]}catch{f=void 0}let d=u in Ux?Array.isArray(f):ta(f);!d&&f!==void 0&&n(`${u}: default used`),a[u]=d?f:Pl(i[u])}let l=[["achievements",a1],["members",l1],["missions",c1],["legends",u1],["moments",h1],["jokes",f1],["transmissions",d1]];for(let[u,f]of l)try{s[u]=f(a[u],n)}catch{n(`${u}: crashed, default used`);try{s[u]=f(Pl(i[u]),()=>{})}catch{s[u]=[]}}try{s.clan=p1(a.clan,n)}catch{n("clan: crashed, default used"),s.clan=Pl(i.clan)}try{s.operator=m1(a.operator,s.members,n)}catch{n("operator: crashed, default used"),s.operator={...Pl(i.operator),aliases:[]}}g1(s,a,n);try{let u=new Set(s.members.map(d=>d.id)),f=new Set(s.achievements.map(d=>d.id)),h=(d,g,_)=>{let m=[];for(let p of d){if(!g.has(p)){n(`${_}: unknown "${p}" removed`);continue}m.includes(p)||m.push(p)}return m};s.members.forEach((d,g)=>{d.achievements=h(d.achievements,f,`members[${g}].achievements`)}),s.missions.forEach((d,g)=>{d.crew=h(d.crew,u,`missions[${g}].crew`),d.reward!=null&&!f.has(d.reward)&&(n(`missions[${g}].reward: unknown "${d.reward}" removed`),d.reward=null)}),s.achievements.forEach((d,g)=>{d.who=h(d.who,u,`achievements[${g}].who`)}),s.moments.forEach((d,g)=>{d.who=h(d.who,u,`moments[${g}].who`)})}catch{n("refs: crashed")}for(let u of s.jokes)u.date==null&&(u.date=s.clan.founded);try{let u=[];for(let h of s.operator.aliases){let d=Up(h);d.length>=2&&d.length<=24&&!u.includes(d)&&u.push(d)}let f=Up(s.operator.name);f.length>=2&&!u.includes(f)&&u.push(f),s.operator.aliases=u}catch{s.operator.aliases=[]}let c={};for(let u of Fp)c[u]=s[u];return{world:c,issues:e}}function Gx(t){if(t&&typeof t=="object"&&!Object.isFrozen(t)){Object.freeze(t);for(let e of Object.keys(t))Gx(t[e])}return t}var Dl,Hx="file";try{Dl=typeof window<"u"?window.SAMVIN_WORLD:void 0}catch{Dl=void 0}ta(Dl)||(Hx="default",Dl=Jo,xt("world","world.js missing or broken — using built-in defaults"));var Il=x1(Dl);Il.issues.length&&xt("world-issues",`world.js: ${Il.issues.length} issue(s)`,Il.issues);var Wx=Hx,Xx=Object.freeze(Il.issues.slice()),_t=Gx(Il.world);var t3=Object.freeze({members:"Здесь пока никого нет.",missions:"Вылазок пока нет.",achievements:"Трофеев пока нет.",transmissions:"Передач пока нет.",probeLog:"Зонд вернулся. Записи нет."}),v1=/^S(0[1-9]|1[0-4])$/;function $x(){let t=Y.data||{},e=t.transmissions||{delivered:0,read:[]},n=Math.max(0,Math.min(e.delivered|0,_t.transmissions.length)),i=Array.isArray(e.read)?e.read:[],r=0;for(let u=0;u<n;u++)i.includes(u)||r++;let s=new Set(_t.jokes.map(u=>u.id)),o=new Set((Array.isArray(t.jokesFound)?t.jokesFound:[]).filter(u=>s.has(u))).size,a=0,l=0;for(let u of _t.missions)$u(u).state==="done"&&a++,Op(u.code)==="out"&&l++;let c=t.found&&typeof t.found=="object"?Object.keys(t.found).filter(u=>v1.test(u)).length:0;return{delivered:n,unread:r,legends:_t.legends.length,moments:_t.moments.length,jokesFound:o,members:_t.members.length,online:_t.members.filter(u=>u.status==="на связи").length,founded:Px(_t.clan.founded,"dd.mm.yyyy"),daysSinceFounded:Math.max(0,Rl(_t.clan.founded,Y.today||_t.clan.founded)),missions:_t.missions.length,done:a,probesOut:l,earned:_t.achievements.filter(u=>u.earned).length,achievements:_t.achievements.length,secrets:c,shards:t.shards|0,nadirOpen:!!t.nadirOpen}}var y1=864e5,Yx=t=>(t<10?"0":"")+t,qu=t=>t instanceof Date?t:new Date(t??Gr());function Gr(){return Date.now()}function ju(t){let e=qu(t);return`${e.getFullYear()}-${Yx(e.getMonth()+1)}-${Yx(e.getDate())}`}function qx(t){let e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(t||""));return e?Math.round(Date.UTC(+e[1],+e[2]-1,+e[3])/y1):NaN}function Rl(t,e){let n=qx(t),i=qx(e);return Number.isFinite(n)&&Number.isFinite(i)?i-n:0}function jx(t,e,n){return e>n?t>=e||t<n:e<n?t>=e&&t<n:!1}function Bp(t){let e=_t.night;return jx(qu(t).getHours(),e.from,e.to)}function Zx(t){let e=_t.night;return Bp(t)||e.drowsyFrom===e.from?!1:jx(qu(t).getHours(),e.drowsyFrom,e.from)}function _1(t){let e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(t||""));return e?{y:+e[1],m:+e[2],d:+e[3]}:null}function kp(t){let e=_1(_t.operator.birthday);if(!e)return!1;let n=qu(t),i=n.getFullYear(),r=n.getMonth()+1,s=n.getDate();return e.m===2&&e.d===29&&!(i%4===0&&i%100!==0||i%400===0)?r===2&&s===28:r===e.m&&s===e.d}var Ev=0,xm=1,Tv=2;var cc=1,Rv=2,Ea=3,wr=0,li=1,Ar=2,gi=0,ar=1,Mo=2,vm=3,ym=4,of=5;var ts=100,Cv=101,Pv=102,Iv=103,Lv=104,Dv=200,uc=201,Nv=202,Ov=203,_m=204,Ta=205,Fv=206,Uv=207,Bv=208,kv=209,zv=210,Vv=211,Gv=212,Hv=213,Wv=214,bh=0,Sh=1,wh=2,va=3,Ah=4,Eh=5,Th=6,Rh=7,Mm=0,Xv=1,$v=2,Ri=0,bm=1,Sm=2,wm=3,Am=4,Em=5,Tm=6,Rm=7;var Cm=300,Fs=301,bo=302,af=303,lf=304,hc=306,Ch=1e3,Zn=1001,Ph=1002,Bn=1003,Yv=1004;var fc=1005;var Et=1006,cf=1007;var Us=1008;var Ci=1009,Pm=1010,Im=1011,Ra=1012,uf=1013,lr=1014,Hi=1015,Kn=1016,hf=1017,ff=1018,Ca=1020,Lm=35902,Dm=35899,Nm=1021,Om=1022,Hn=1023,_r=1026,Bs=1027,df=1028,pf=1029,ks=1030,mf=1031;var gf=1033,dc=33776,pc=33777,mc=33778,gc=33779,xf=35840,vf=35841,yf=35842,_f=35843,Mf=36196,bf=37492,Sf=37496,wf=37488,Af=37489,xc=37490,Ef=37491,Tf=37808,Rf=37809,Cf=37810,Pf=37811,If=37812,Lf=37813,Df=37814,Nf=37815,Of=37816,Ff=37817,Uf=37818,Bf=37819,kf=37820,zf=37821,Vf=36492,Gf=36494,Hf=36495,Wf=36283,Xf=36284,vc=36285,$f=36286;var Gl=2300,Ih=2301,_h=2302,cm=2303,um=2400,hm=2401,fm=2402;var qv=3200;var Fm=0,jv=1,ns="",Ei="srgb",vo="srgb-linear",Hl="linear",kt="srgb";var Mh=7680;var Zv=519,Kv=512,Jv=513,Qv=514,Yf=515,ey=516,ty=517,qf=518,ny=519,Um=35044;var Bm="300 es",or=2e3,Wl=2001;function b1(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function S1(t){return ArrayBuffer.isView(t)&&!(t instanceof DataView)}function Xl(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function iy(){let t=Xl("canvas");return t.style.display="block",t}var Kx={},ya=null;function $l(...t){let e="THREE."+t.shift();ya?ya("log",e,...t):console.log(e,...t)}function ry(t){let e=t[0];if(typeof e=="string"&&e.startsWith("TSL:")){let n=t[1];n&&n.isStackTrace?t[0]+=" "+n.getLocation():t[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return t}function it(...t){t=ry(t);let e="THREE."+t.shift();if(ya)ya("warn",e,...t);else{let n=t[0];n&&n.isStackTrace?console.warn(n.getError(e)):console.warn(e,...t)}}function rt(...t){t=ry(t);let e="THREE."+t.shift();if(ya)ya("error",e,...t);else{let n=t[0];n&&n.isStackTrace?console.error(n.getError(e)):console.error(e,...t)}}function xo(...t){let e=t.join(" ");e in Kx||(Kx[e]=!0,it(...t))}function sy(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}var oy={[bh]:Sh,[wh]:Th,[Ah]:Rh,[va]:Eh,[Sh]:bh,[Th]:wh,[Rh]:Ah,[Eh]:va},Mr=class{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){let i=this._listeners;if(i===void 0)return;let r=i[e];if(r!==void 0){let s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){let n=this._listeners;if(n===void 0)return;let i=n[e.type];if(i!==void 0){e.target=this;let r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}},Yn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var zp=Math.PI/180,Lh=180/Math.PI;function Ps(){let t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Yn[t&255]+Yn[t>>8&255]+Yn[t>>16&255]+Yn[t>>24&255]+"-"+Yn[e&255]+Yn[e>>8&255]+"-"+Yn[e>>16&15|64]+Yn[e>>24&255]+"-"+Yn[n&63|128]+Yn[n>>8&255]+"-"+Yn[n>>16&255]+Yn[n>>24&255]+Yn[i&255]+Yn[i>>8&255]+Yn[i>>16&255]+Yn[i>>24&255]).toLowerCase()}function wt(t,e,n){return Math.max(e,Math.min(n,t))}function w1(t,e){return(t%e+e)%e}function Vp(t,e,n){return(1-n)*t+n*e}function yr(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:case Uint8ClampedArray:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function qt(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Hm=class Hm{constructor(e=0,n=0){this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=wt(this.x,e.x,n.x),this.y=wt(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=wt(this.x,e,n),this.y=wt(this.y,e,n),this}clampLength(e,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(wt(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(e)/n;return Math.acos(wt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){let i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Hm.prototype.isVector2=!0;var ot=Hm,Gi=class{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],f=i[r+3],h=s[o+0],d=s[o+1],g=s[o+2],_=s[o+3];if(f!==_||l!==h||c!==d||u!==g){let m=l*h+c*d+u*g+f*_;m<0&&(h=-h,d=-d,g=-g,_=-_,m=-m);let p=1-a;if(m<.9995){let M=Math.acos(m),T=Math.sin(M);p=Math.sin(p*M)/T,a=Math.sin(a*M)/T,l=l*p+h*a,c=c*p+d*a,u=u*p+g*a,f=f*p+_*a}else{l=l*p+h*a,c=c*p+d*a,u=u*p+g*a,f=f*p+_*a;let M=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=M,c*=M,u*=M,f*=M}}e[n]=l,e[n+1]=c,e[n+2]=u,e[n+3]=f}static multiplyQuaternionsFlat(e,n,i,r,s,o){let a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],f=s[o],h=s[o+1],d=s[o+2],g=s[o+3];return e[n]=a*g+u*f+l*d-c*h,e[n+1]=l*g+u*h+c*f-a*d,e[n+2]=c*g+u*d+a*h-l*f,e[n+3]=u*g-a*f-l*h-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){let i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),f=a(s/2),h=l(i/2),d=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=h*u*f+c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f-h*d*g;break;case"YXZ":this._x=h*u*f+c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f+h*d*g;break;case"ZXY":this._x=h*u*f-c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f-h*d*g;break;case"ZYX":this._x=h*u*f-c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f+h*d*g;break;case"YZX":this._x=h*u*f+c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f-h*d*g;break;case"XZY":this._x=h*u*f-c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f+h*d*g;break;default:it("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){let i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],a=n[5],l=n[9],c=n[2],u=n[6],f=n[10],h=i+a+f;if(h>0){let d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(u-l)*d,this._y=(s-c)*d,this._z=(o-r)*d}else if(i>a&&i>f){let d=2*Math.sqrt(1+i-a-f);this._w=(u-l)/d,this._x=.25*d,this._y=(r+o)/d,this._z=(s+c)/d}else if(a>f){let d=2*Math.sqrt(1+a-i-f);this._w=(s-c)/d,this._x=(r+o)/d,this._y=.25*d,this._z=(l+u)/d}else{let d=2*Math.sqrt(1+f-i-a);this._w=(o-r)/d,this._x=(s+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(wt(this.dot(e),-1,1)))}rotateTowards(e,n){let i=this.angleTo(e);if(i===0)return this;let r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){let i=e._x,r=e._y,s=e._z,o=e._w,a=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){let i=e._x,r=e._y,s=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,r=-r,s=-s,o=-o,a=-a);let l=1-n;if(a<.9995){let c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,n=Math.sin(n*c)/u,this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+o*n,this._onChangeCallback()}else this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+o*n,this.normalize();return this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){let e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Wm=class Wm{constructor(e=0,n=0,i=0){this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(Jx.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(Jx.setFromAxisAngle(e,n))}applyMatrix3(e){let n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){let n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*n-s*r),f=2*(s*i-o*n);return this.x=n+l*c+o*f-a*u,this.y=i+l*u+a*c-s*f,this.z=r+l*f+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=wt(this.x,e.x,n.x),this.y=wt(this.y,e.y,n.y),this.z=wt(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=wt(this.x,e,n),this.y=wt(this.y,e,n),this.z=wt(this.z,e,n),this}clampLength(e,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(wt(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){let i=e.x,r=e.y,s=e.z,o=n.x,a=n.y,l=n.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){let n=e.lengthSq();if(n===0)return this.set(0,0,0);let i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Gp.copy(this).projectOnVector(e),this.sub(Gp)}reflect(e){return this.sub(Gp.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(e)/n;return Math.acos(wt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){let r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){let n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){let n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Wm.prototype.isVector3=!0;var P=Wm,Gp=new P,Jx=new Gi,Xm=class Xm{constructor(e,n,i,r,s,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c)}set(e,n,i,r,s,o,a,l,c){let u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=n,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){let i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],f=i[7],h=i[2],d=i[5],g=i[8],_=r[0],m=r[3],p=r[6],M=r[1],T=r[4],x=r[7],S=r[2],E=r[5],C=r[8];return s[0]=o*_+a*M+l*S,s[3]=o*m+a*T+l*E,s[6]=o*p+a*x+l*C,s[1]=c*_+u*M+f*S,s[4]=c*m+u*T+f*E,s[7]=c*p+u*x+f*C,s[2]=h*_+d*M+g*S,s[5]=h*m+d*T+g*E,s[8]=h*p+d*x+g*C,this}multiplyScalar(e){let n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){let e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return n*o*u-n*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){let e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=u*o-a*c,h=a*l-u*s,d=c*s-o*l,g=n*f+i*h+r*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=f*_,e[1]=(r*c-u*i)*_,e[2]=(a*i-r*o)*_,e[3]=h*_,e[4]=(u*n-r*l)*_,e[5]=(r*s-a*n)*_,e[6]=d*_,e[7]=(i*l-c*n)*_,e[8]=(o*n-i*s)*_,this}transpose(){let e,n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,a){let l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+n,0,0,1),this}scale(e,n){return xo("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Hp.makeScale(e,n)),this}rotate(e){return xo("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Hp.makeRotation(-e)),this}translate(e,n){return xo("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Hp.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){let n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){let n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){let i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Xm.prototype.isMatrix3=!0;var ht=Xm,Hp=new ht,Qx=new ht().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ev=new ht().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function A1(){let t={enabled:!0,workingColorSpace:vo,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===kt&&(r.r=qr(r.r),r.g=qr(r.g),r.b=qr(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===kt&&(r.r=xa(r.r),r.g=xa(r.g),r.b=xa(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===ns?Hl:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return xo("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),t.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return xo("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),t.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[vo]:{primaries:e,whitePoint:i,transfer:Hl,toXYZ:Qx,fromXYZ:ev,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Ei},outputColorSpaceConfig:{drawingBufferColorSpace:Ei}},[Ei]:{primaries:e,whitePoint:i,transfer:kt,toXYZ:Qx,fromXYZ:ev,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Ei}}}),t}var Mt=A1();function qr(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function xa(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}var ia,Dh=class{static getDataURL(e,n="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{ia===void 0&&(ia=Xl("canvas")),ia.width=e.width,ia.height=e.height;let r=ia.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=ia}return i.toDataURL(n)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let n=Xl("canvas");n.width=e.width,n.height=e.height;let i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=qr(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){let n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(qr(n[i]/255)*255):n[i]=qr(n[i]);return{data:n,width:e.width,height:e.height}}else return it("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},E1=0,_a=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:E1++}),this.uuid=Ps(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?e.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?e.set(n.displayWidth,n.displayHeight,0):n!==null?e.set(n.width,n.height,n.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(Wp(r[o].image)):s.push(Wp(r[o]))}else s=Wp(r);i.url=s}return n||(e.images[this.uuid]=i),i}};function Wp(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?Dh.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(it("Texture: Unable to serialize Texture."),{})}var T1=0,Xp=new P,oi=class t extends Mr{constructor(e=t.DEFAULT_IMAGE,n=t.DEFAULT_MAPPING,i=Zn,r=Zn,s=Et,o=Us,a=Hn,l=Ci,c=t.DEFAULT_ANISOTROPY,u=ns){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:T1++}),this.uuid=Ps(),this.name="",this.source=new _a(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ht,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Xp).x}get height(){return this.source.getSize(Xp).y}get depth(){return this.source.getSize(Xp).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let n in e){let i=e[n];if(i===void 0){it(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}let r=this[n];if(r===void 0){it(`Texture.setValues(): property '${n}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[n]=i}}toJSON(e){let n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Cm)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ch:e.x=e.x-Math.floor(e.x);break;case Zn:e.x=e.x<0?0:1;break;case Ph:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ch:e.y=e.y-Math.floor(e.y);break;case Zn:e.y=e.y<0?0:1;break;case Ph:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};oi.DEFAULT_IMAGE=null;oi.DEFAULT_MAPPING=Cm;oi.DEFAULT_ANISOTROPY=1;var $m=class $m{constructor(e=0,n=0,i=0,r=1){this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s,l=e.elements,c=l[0],u=l[4],f=l[8],h=l[1],d=l[5],g=l[9],_=l[2],m=l[6],p=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+d+p-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;let T=(c+1)/2,x=(d+1)/2,S=(p+1)/2,E=(u+h)/4,C=(f+_)/4,y=(g+m)/4;return T>x&&T>S?T<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(T),r=E/i,s=C/i):x>S?x<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(x),i=E/r,s=y/r):S<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(S),i=C/s,r=y/s),this.set(i,r,s,n),this}let M=Math.sqrt((m-g)*(m-g)+(f-_)*(f-_)+(h-u)*(h-u));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(f-_)/M,this.z=(h-u)/M,this.w=Math.acos((c+d+p-1)/2),this}setFromMatrixPosition(e){let n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=wt(this.x,e.x,n.x),this.y=wt(this.y,e.y,n.y),this.z=wt(this.z,e.z,n.z),this.w=wt(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=wt(this.x,e,n),this.y=wt(this.y,e,n),this.z=wt(this.z,e,n),this.w=wt(this.w,e,n),this}clampLength(e,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(wt(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};$m.prototype.isVector4=!0;var tn=$m,Nh=class extends Mr{constructor(e=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Et,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=i.depth,this.scissor=new tn(0,0,e,n),this.scissorTest=!1,this.viewport=new tn(0,0,e,n),this.textures=[];let r={width:e,height:n,depth:i.depth},s=new oi(r),o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){let n={minFilter:Et,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(n.mapping=e.mapping),e.wrapS!==void 0&&(n.wrapS=e.wrapS),e.wrapT!==void 0&&(n.wrapT=e.wrapT),e.wrapR!==void 0&&(n.wrapR=e.wrapR),e.magFilter!==void 0&&(n.magFilter=e.magFilter),e.minFilter!==void 0&&(n.minFilter=e.minFilter),e.format!==void 0&&(n.format=e.format),e.type!==void 0&&(n.type=e.type),e.anisotropy!==void 0&&(n.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(n.colorSpace=e.colorSpace),e.flipY!==void 0&&(n.flipY=e.flipY),e.generateMipmaps!==void 0&&(n.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(n.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;let r=Object.assign({},e.textures[n].image);this.textures[n].source=new _a(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let n=e.depthTexture.clone();n.renderTarget=null,this.depthTexture=n}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Tn=class extends Nh{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}},Yl=class extends oi{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Bn,this.minFilter=Bn,this.wrapR=Zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Oh=class extends oi{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Bn,this.minFilter=Bn,this.wrapR=Zn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var sf=class sf{constructor(e,n,i,r,s,o,a,l,c,u,f,h,d,g,_,m){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c,u,f,h,d,g,_,m)}set(e,n,i,r,s,o,a,l,c,u,f,h,d,g,_,m){let p=this.elements;return p[0]=e,p[4]=n,p[8]=i,p[12]=r,p[1]=s,p[5]=o,p[9]=a,p[13]=l,p[2]=c,p[6]=u,p[10]=f,p[14]=h,p[3]=d,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new sf().fromArray(this.elements)}copy(e){let n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){let n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){let n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return this.determinantAffine()===0?(e.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let n=this.elements,i=e.elements,r=1/ra.setFromMatrixColumn(e,0).length(),s=1/ra.setFromMatrixColumn(e,1).length(),o=1/ra.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){let n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){let h=o*u,d=o*f,g=a*u,_=a*f;n[0]=l*u,n[4]=-l*f,n[8]=c,n[1]=d+g*c,n[5]=h-_*c,n[9]=-a*l,n[2]=_-h*c,n[6]=g+d*c,n[10]=o*l}else if(e.order==="YXZ"){let h=l*u,d=l*f,g=c*u,_=c*f;n[0]=h+_*a,n[4]=g*a-d,n[8]=o*c,n[1]=o*f,n[5]=o*u,n[9]=-a,n[2]=d*a-g,n[6]=_+h*a,n[10]=o*l}else if(e.order==="ZXY"){let h=l*u,d=l*f,g=c*u,_=c*f;n[0]=h-_*a,n[4]=-o*f,n[8]=g+d*a,n[1]=d+g*a,n[5]=o*u,n[9]=_-h*a,n[2]=-o*c,n[6]=a,n[10]=o*l}else if(e.order==="ZYX"){let h=o*u,d=o*f,g=a*u,_=a*f;n[0]=l*u,n[4]=g*c-d,n[8]=h*c+_,n[1]=l*f,n[5]=_*c+h,n[9]=d*c-g,n[2]=-c,n[6]=a*l,n[10]=o*l}else if(e.order==="YZX"){let h=o*l,d=o*c,g=a*l,_=a*c;n[0]=l*u,n[4]=_-h*f,n[8]=g*f+d,n[1]=f,n[5]=o*u,n[9]=-a*u,n[2]=-c*u,n[6]=d*f+g,n[10]=h-_*f}else if(e.order==="XZY"){let h=o*l,d=o*c,g=a*l,_=a*c;n[0]=l*u,n[4]=-f,n[8]=c*u,n[1]=h*f+_,n[5]=o*u,n[9]=d*f-g,n[2]=g*f-d,n[6]=a*u,n[10]=_*f+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(R1,e,C1)}lookAt(e,n,i){let r=this.elements;return wi.subVectors(e,n),wi.lengthSq()===0&&(wi.z=1),wi.normalize(),ws.crossVectors(i,wi),ws.lengthSq()===0&&(Math.abs(i.z)===1?wi.x+=1e-4:wi.z+=1e-4,wi.normalize(),ws.crossVectors(i,wi)),ws.normalize(),Zu.crossVectors(wi,ws),r[0]=ws.x,r[4]=Zu.x,r[8]=wi.x,r[1]=ws.y,r[5]=Zu.y,r[9]=wi.y,r[2]=ws.z,r[6]=Zu.z,r[10]=wi.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){let i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],f=i[5],h=i[9],d=i[13],g=i[2],_=i[6],m=i[10],p=i[14],M=i[3],T=i[7],x=i[11],S=i[15],E=r[0],C=r[4],y=r[8],A=r[12],R=r[1],D=r[5],U=r[9],G=r[13],N=r[2],H=r[6],O=r[10],k=r[14],q=r[3],j=r[7],J=r[11],ne=r[15];return s[0]=o*E+a*R+l*N+c*q,s[4]=o*C+a*D+l*H+c*j,s[8]=o*y+a*U+l*O+c*J,s[12]=o*A+a*G+l*k+c*ne,s[1]=u*E+f*R+h*N+d*q,s[5]=u*C+f*D+h*H+d*j,s[9]=u*y+f*U+h*O+d*J,s[13]=u*A+f*G+h*k+d*ne,s[2]=g*E+_*R+m*N+p*q,s[6]=g*C+_*D+m*H+p*j,s[10]=g*y+_*U+m*O+p*J,s[14]=g*A+_*G+m*k+p*ne,s[3]=M*E+T*R+x*N+S*q,s[7]=M*C+T*D+x*H+S*j,s[11]=M*y+T*U+x*O+S*J,s[15]=M*A+T*G+x*k+S*ne,this}multiplyScalar(e){let n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){let e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],f=e[6],h=e[10],d=e[14],g=e[3],_=e[7],m=e[11],p=e[15],M=l*d-c*h,T=a*d-c*f,x=a*h-l*f,S=o*d-c*u,E=o*h-l*u,C=o*f-a*u;return n*(_*M-m*T+p*x)-i*(g*M-m*S+p*E)+r*(g*T-_*S+p*C)-s*(g*x-_*E+m*C)}determinantAffine(){let e=this.elements,n=e[0],i=e[4],r=e[8],s=e[1],o=e[5],a=e[9],l=e[2],c=e[6],u=e[10];return n*(o*u-a*c)-i*(s*u-a*l)+r*(s*c-o*l)}transpose(){let e=this.elements,n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){let e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=e[9],h=e[10],d=e[11],g=e[12],_=e[13],m=e[14],p=e[15],M=n*a-i*o,T=n*l-r*o,x=n*c-s*o,S=i*l-r*a,E=i*c-s*a,C=r*c-s*l,y=u*_-f*g,A=u*m-h*g,R=u*p-d*g,D=f*m-h*_,U=f*p-d*_,G=h*p-d*m,N=M*G-T*U+x*D+S*R-E*A+C*y;if(N===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let H=1/N;return e[0]=(a*G-l*U+c*D)*H,e[1]=(r*U-i*G-s*D)*H,e[2]=(_*C-m*E+p*S)*H,e[3]=(h*E-f*C-d*S)*H,e[4]=(l*R-o*G-c*A)*H,e[5]=(n*G-r*R+s*A)*H,e[6]=(m*x-g*C-p*T)*H,e[7]=(u*C-h*x+d*T)*H,e[8]=(o*U-a*R+c*y)*H,e[9]=(i*R-n*U-s*y)*H,e[10]=(g*E-_*x+p*M)*H,e[11]=(f*x-u*E-d*M)*H,e[12]=(a*A-o*D-l*y)*H,e[13]=(n*D-i*A+r*y)*H,e[14]=(_*T-g*S-m*M)*H,e[15]=(u*S-f*T+h*M)*H,this}scale(e){let n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){let n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){let n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){let n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){let i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){let r=this.elements,s=n._x,o=n._y,a=n._z,l=n._w,c=s+s,u=o+o,f=a+a,h=s*c,d=s*u,g=s*f,_=o*u,m=o*f,p=a*f,M=l*c,T=l*u,x=l*f,S=i.x,E=i.y,C=i.z;return r[0]=(1-(_+p))*S,r[1]=(d+x)*S,r[2]=(g-T)*S,r[3]=0,r[4]=(d-x)*E,r[5]=(1-(h+p))*E,r[6]=(m+M)*E,r[7]=0,r[8]=(g+T)*C,r[9]=(m-M)*C,r[10]=(1-(h+_))*C,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let s=this.determinantAffine();if(s===0)return i.set(1,1,1),n.identity(),this;let o=ra.set(r[0],r[1],r[2]).length(),a=ra.set(r[4],r[5],r[6]).length(),l=ra.set(r[8],r[9],r[10]).length();s<0&&(o=-o),nr.copy(this);let c=1/o,u=1/a,f=1/l;return nr.elements[0]*=c,nr.elements[1]*=c,nr.elements[2]*=c,nr.elements[4]*=u,nr.elements[5]*=u,nr.elements[6]*=u,nr.elements[8]*=f,nr.elements[9]*=f,nr.elements[10]*=f,n.setFromRotationMatrix(nr),i.x=o,i.y=a,i.z=l,this}makePerspective(e,n,i,r,s,o,a=or,l=!1){let c=this.elements,u=2*s/(n-e),f=2*s/(i-r),h=(n+e)/(n-e),d=(i+r)/(i-r),g,_;if(l)g=s/(o-s),_=o*s/(o-s);else if(a===or)g=-(o+s)/(o-s),_=-2*o*s/(o-s);else if(a===Wl)g=-o/(o-s),_=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,n,i,r,s,o,a=or,l=!1){let c=this.elements,u=2/(n-e),f=2/(i-r),h=-(n+e)/(n-e),d=-(i+r)/(i-r),g,_;if(l)g=1/(o-s),_=o/(o-s);else if(a===or)g=-2/(o-s),_=-(o+s)/(o-s);else if(a===Wl)g=-1/(o-s),_=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){let i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}};sf.prototype.isMatrix4=!0;var At=sf,ra=new P,nr=new At,R1=new P(0,0,0),C1=new P(1,1,1),ws=new P,Zu=new P,wi=new P,tv=new At,nv=new Gi,Is=class t{constructor(e=0,n=0,i=0,r=t.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){let r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],f=r[2],h=r[6],d=r[10];switch(n){case"XYZ":this._y=Math.asin(wt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-wt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(wt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-wt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(wt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-wt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,d),this._y=0);break;default:it("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return tv.makeRotationFromQuaternion(e),this.setFromRotationMatrix(tv,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return nv.setFromEuler(this),this.setFromQuaternion(nv,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Is.DEFAULT_ORDER="XYZ";var Ma=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},P1=0,iv=new P,sa=new Gi,Hr=new At,Ku=new P,Ol=new P,I1=new P,L1=new Gi,rv=new P(1,0,0),sv=new P(0,1,0),ov=new P(0,0,1),av={type:"added"},D1={type:"removed"},oa={type:"childadded",child:null},$p={type:"childremoved",child:null},mi=class t extends Mr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:P1++}),this.uuid=Ps(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=t.DEFAULT_UP.clone();let e=new P,n=new Is,i=new Gi,r=new P(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new At},normalMatrix:{value:new ht}}),this.matrix=new At,this.matrixWorld=new At,this.matrixAutoUpdate=t.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ma,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return sa.setFromAxisAngle(e,n),this.quaternion.multiply(sa),this}rotateOnWorldAxis(e,n){return sa.setFromAxisAngle(e,n),this.quaternion.premultiply(sa),this}rotateX(e){return this.rotateOnAxis(rv,e)}rotateY(e){return this.rotateOnAxis(sv,e)}rotateZ(e){return this.rotateOnAxis(ov,e)}translateOnAxis(e,n){return iv.copy(e).applyQuaternion(this.quaternion),this.position.add(iv.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(rv,e)}translateY(e){return this.translateOnAxis(sv,e)}translateZ(e){return this.translateOnAxis(ov,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Hr.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Ku.copy(e):Ku.set(e,n,i);let r=this.parent;this.updateWorldMatrix(!0,!1),Ol.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Hr.lookAt(Ol,Ku,this.up):Hr.lookAt(Ku,Ol,this.up),this.quaternion.setFromRotationMatrix(Hr),r&&(Hr.extractRotation(r.matrixWorld),sa.setFromRotationMatrix(Hr),this.quaternion.premultiply(sa.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(rt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(av),oa.child=e,this.dispatchEvent(oa),oa.child=null):rt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(D1),$p.child=e,this.dispatchEvent($p),$p.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Hr.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Hr.multiply(e.parent.matrixWorld)),e.applyMatrix4(Hr),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(av),oa.child=e,this.dispatchEvent(oa),oa.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){let o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ol,e,I1),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ol,L1,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){let n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let n=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=n-s[0]*n-s[4]*i-s[8]*r,s[13]+=i-s[1]*n-s[5]*i-s[9]*r,s[14]+=r-s[2]*n-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n,i=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),n===!0){let s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].updateWorldMatrix(!1,!0,i)}}toJSON(e){let n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];r.animations.push(s(e.animations,l))}}if(n){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),f=o(e.shapes),h=o(e.skeletons),d=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),d.length>0&&(i.animations=d),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){let r=e.children[i];this.add(r.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};mi.DEFAULT_UP=new P(0,1,0);mi.DEFAULT_MATRIX_AUTO_UPDATE=!0;mi.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var jt=class extends mi{constructor(){super(),this.isGroup=!0,this.type="Group"}},N1={type:"move"},ba=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new jt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new jt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new jt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let n=this._hand;if(n)for(let i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let _ of e.hand.values()){let m=n.getJointPose(_,i),p=this._getHandJoint(c,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),d=.02,g=.005;c.inputState.pinching&&h>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(N1)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){let i=new jt;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}},ay={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},As={h:0,s:0,l:0},Ju={h:0,s:0,l:0};function Yp(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}var St=class{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Ei){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Mt.colorSpaceToWorking(this,n),this}setRGB(e,n,i,r=Mt.workingColorSpace){return this.r=e,this.g=n,this.b=i,Mt.colorSpaceToWorking(this,r),this}setHSL(e,n,i,r=Mt.workingColorSpace){if(e=w1(e,1),n=wt(n,0,1),i=wt(i,0,1),n===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=Yp(o,s,e+1/3),this.g=Yp(o,s,e),this.b=Yp(o,s,e-1/3)}return Mt.colorSpaceToWorking(this,r),this}setStyle(e,n=Ei){function i(s){s!==void 0&&parseFloat(s)<1&&it("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:it("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);it("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Ei){let i=ay[e.toLowerCase()];return i!==void 0?this.setHex(i,n):it("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=qr(e.r),this.g=qr(e.g),this.b=qr(e.b),this}copyLinearToSRGB(e){return this.r=xa(e.r),this.g=xa(e.g),this.b=xa(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ei){return Mt.workingToColorSpace(qn.copy(this),e),Math.round(wt(qn.r*255,0,255))*65536+Math.round(wt(qn.g*255,0,255))*256+Math.round(wt(qn.b*255,0,255))}getHexString(e=Ei){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Mt.workingColorSpace){Mt.workingToColorSpace(qn.copy(this),n);let i=qn.r,r=qn.g,s=qn.b,o=Math.max(i,r,s),a=Math.min(i,r,s),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let f=o-a;switch(c=u<=.5?f/(o+a):f/(2-o-a),o){case i:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-i)/f+2;break;case s:l=(i-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,n=Mt.workingColorSpace){return Mt.workingToColorSpace(qn.copy(this),n),e.r=qn.r,e.g=qn.g,e.b=qn.b,e}getStyle(e=Ei){Mt.workingToColorSpace(qn.copy(this),e);let n=qn.r,i=qn.g,r=qn.b;return e!==Ei?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(As),this.setHSL(As.h+e,As.s+n,As.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(As),e.getHSL(Ju);let i=Vp(As.h,Ju.h,n),r=Vp(As.s,Ju.s,n),s=Vp(As.l,Ju.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},qn=new St;St.NAMES=ay;var jr=class extends mi{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Is,this.environmentIntensity=1,this.environmentRotation=new Is,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),n.object.backgroundBlurriness=this.backgroundBlurriness,n.object.backgroundIntensity=this.backgroundIntensity,n.object.backgroundRotation=this.backgroundRotation.toArray(),n.object.environmentIntensity=this.environmentIntensity,n.object.environmentRotation=this.environmentRotation.toArray(),n}},ir=new P,Wr=new P,qp=new P,Xr=new P,aa=new P,la=new P,lv=new P,jp=new P,Zp=new P,Kp=new P,Jp=new tn,Qp=new tn,em=new tn,Cs=class t{constructor(e=new P,n=new P,i=new P){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),ir.subVectors(e,n),r.cross(ir);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){ir.subVectors(r,n),Wr.subVectors(i,n),qp.subVectors(e,n);let o=ir.dot(ir),a=ir.dot(Wr),l=ir.dot(qp),c=Wr.dot(Wr),u=Wr.dot(qp),f=o*c-a*a;if(f===0)return s.set(0,0,0),null;let h=1/f,d=(c*l-a*u)*h,g=(o*u-a*l)*h;return s.set(1-d-g,g,d)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,Xr)===null?!1:Xr.x>=0&&Xr.y>=0&&Xr.x+Xr.y<=1}static getInterpolation(e,n,i,r,s,o,a,l){return this.getBarycoord(e,n,i,r,Xr)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Xr.x),l.addScaledVector(o,Xr.y),l.addScaledVector(a,Xr.z),l)}static getInterpolatedAttribute(e,n,i,r,s,o){return Jp.setScalar(0),Qp.setScalar(0),em.setScalar(0),Jp.fromBufferAttribute(e,n),Qp.fromBufferAttribute(e,i),em.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(Jp,s.x),o.addScaledVector(Qp,s.y),o.addScaledVector(em,s.z),o}static isFrontFacing(e,n,i,r){return ir.subVectors(i,n),Wr.subVectors(e,n),ir.cross(Wr).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ir.subVectors(this.c,this.b),Wr.subVectors(this.a,this.b),ir.cross(Wr).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return t.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return t.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return t.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return t.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return t.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){let i=this.a,r=this.b,s=this.c,o,a;aa.subVectors(r,i),la.subVectors(s,i),jp.subVectors(e,i);let l=aa.dot(jp),c=la.dot(jp);if(l<=0&&c<=0)return n.copy(i);Zp.subVectors(e,r);let u=aa.dot(Zp),f=la.dot(Zp);if(u>=0&&f<=u)return n.copy(r);let h=l*f-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),n.copy(i).addScaledVector(aa,o);Kp.subVectors(e,s);let d=aa.dot(Kp),g=la.dot(Kp);if(g>=0&&d<=g)return n.copy(s);let _=d*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),n.copy(i).addScaledVector(la,a);let m=u*g-d*f;if(m<=0&&f-u>=0&&d-g>=0)return lv.subVectors(s,r),a=(f-u)/(f-u+(d-g)),n.copy(r).addScaledVector(lv,a);let p=1/(m+_+h);return o=_*p,a=h*p,n.copy(i).addScaledVector(aa,o).addScaledVector(la,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},br=class{constructor(e=new P(1/0,1/0,1/0),n=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(rr.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(rr.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){let i=rr.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,rr):rr.fromBufferAttribute(s,o),rr.applyMatrix4(e.matrixWorld),this.expandByPoint(rr);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Qu.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Qu.copy(i.boundingBox)),Qu.applyMatrix4(e.matrixWorld),this.union(Qu)}let r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,rr),rr.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Fl),eh.subVectors(this.max,Fl),ca.subVectors(e.a,Fl),ua.subVectors(e.b,Fl),ha.subVectors(e.c,Fl),Es.subVectors(ua,ca),Ts.subVectors(ha,ua),fo.subVectors(ca,ha);let n=[0,-Es.z,Es.y,0,-Ts.z,Ts.y,0,-fo.z,fo.y,Es.z,0,-Es.x,Ts.z,0,-Ts.x,fo.z,0,-fo.x,-Es.y,Es.x,0,-Ts.y,Ts.x,0,-fo.y,fo.x,0];return!tm(n,ca,ua,ha,eh)||(n=[1,0,0,0,1,0,0,0,1],!tm(n,ca,ua,ha,eh))?!1:(th.crossVectors(Es,Ts),n=[th.x,th.y,th.z],tm(n,ca,ua,ha,eh))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,rr).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(rr).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:($r[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),$r[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),$r[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),$r[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),$r[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),$r[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),$r[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),$r[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints($r),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},$r=[new P,new P,new P,new P,new P,new P,new P,new P],rr=new P,Qu=new br,ca=new P,ua=new P,ha=new P,Es=new P,Ts=new P,fo=new P,Fl=new P,eh=new P,th=new P,po=new P;function tm(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){po.fromArray(t,s);let a=r.x*Math.abs(po.x)+r.y*Math.abs(po.y)+r.z*Math.abs(po.z),l=e.dot(po),c=n.dot(po),u=i.dot(po);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var En=new P,nh=new ot,O1=0,Zt=class extends Mr{constructor(e,n,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:O1++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=Um,this.updateRanges=[],this.gpuType=Hi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)nh.fromBufferAttribute(this,n),nh.applyMatrix3(e),this.setXY(n,nh.x,nh.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)En.fromBufferAttribute(this,n),En.applyMatrix3(e),this.setXYZ(n,En.x,En.y,En.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)En.fromBufferAttribute(this,n),En.applyMatrix4(e),this.setXYZ(n,En.x,En.y,En.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)En.fromBufferAttribute(this,n),En.applyNormalMatrix(e),this.setXYZ(n,En.x,En.y,En.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)En.fromBufferAttribute(this,n),En.transformDirection(e),this.setXYZ(n,En.x,En.y,En.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=yr(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=qt(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=yr(n,this.array)),n}setX(e,n){return this.normalized&&(n=qt(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=yr(n,this.array)),n}setY(e,n){return this.normalized&&(n=qt(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=yr(n,this.array)),n}setZ(e,n){return this.normalized&&(n=qt(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=yr(n,this.array)),n}setW(e,n){return this.normalized&&(n=qt(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=qt(n,this.array),i=qt(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=qt(n,this.array),i=qt(i,this.array),r=qt(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=qt(n,this.array),i=qt(i,this.array),r=qt(r,this.array),s=qt(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var ql=class extends Zt{constructor(e,n,i){super(new Uint16Array(e),n,i)}};var jl=class extends Zt{constructor(e,n,i){super(new Uint32Array(e),n,i)}};var Xt=class extends Zt{constructor(e,n,i){super(new Float32Array(e),n,i)}},F1=new br,Ul=new P,nm=new P,Sr=class{constructor(e=new P,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){let i=this.center;n!==void 0?i.copy(n):F1.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){let i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Ul.subVectors(e,this.center);let n=Ul.lengthSq();if(n>this.radius*this.radius){let i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(Ul,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(nm.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Ul.copy(e.center).add(nm)),this.expandByPoint(Ul.copy(e.center).sub(nm))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},U1=0,Vi=new At,im=new mi,fa=new P,Ai=new br,Bl=new br,Un=new P,Mn=class t extends Mr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:U1++}),this.uuid=Ps(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(b1(e)?jl:ql)(e,1):this.index=e,this}setIndirect(e,n=0){return this.indirect=e,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){let n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new ht().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Vi.makeRotationFromQuaternion(e),this.applyMatrix4(Vi),this}rotateX(e){return Vi.makeRotationX(e),this.applyMatrix4(Vi),this}rotateY(e){return Vi.makeRotationY(e),this.applyMatrix4(Vi),this}rotateZ(e){return Vi.makeRotationZ(e),this.applyMatrix4(Vi),this}translate(e,n,i){return Vi.makeTranslation(e,n,i),this.applyMatrix4(Vi),this}scale(e,n,i){return Vi.makeScale(e,n,i),this.applyMatrix4(Vi),this}lookAt(e){return im.lookAt(e),im.updateMatrix(),this.applyMatrix4(im.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(fa).negate(),this.translate(fa.x,fa.y,fa.z),this}setFromPoints(e){let n=this.getAttribute("position");if(n===void 0){let i=[];for(let r=0,s=e.length;r<s;r++){let o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Xt(i,3))}else{let i=Math.min(e.length,n.count);for(let r=0;r<i;r++){let s=e[r];n.setXYZ(r,s.x,s.y,s.z||0)}e.length>n.count&&it("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new br);let e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){rt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){let s=n[i];Ai.setFromBufferAttribute(s),this.morphTargetsRelative?(Un.addVectors(this.boundingBox.min,Ai.min),this.boundingBox.expandByPoint(Un),Un.addVectors(this.boundingBox.max,Ai.max),this.boundingBox.expandByPoint(Un)):(this.boundingBox.expandByPoint(Ai.min),this.boundingBox.expandByPoint(Ai.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&rt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Sr);let e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){rt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){let i=this.boundingSphere.center;if(Ai.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){let a=n[s];Bl.setFromBufferAttribute(a),this.morphTargetsRelative?(Un.addVectors(Ai.min,Bl.min),Ai.expandByPoint(Un),Un.addVectors(Ai.max,Bl.max),Ai.expandByPoint(Un)):(Ai.expandByPoint(Bl.min),Ai.expandByPoint(Bl.max))}Ai.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Un.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Un));if(n)for(let s=0,o=n.length;s<o;s++){let a=n[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Un.fromBufferAttribute(a,c),l&&(fa.fromBufferAttribute(e,c),Un.add(fa)),r=Math.max(r,i.distanceToSquared(Un))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&rt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){rt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=n.position,r=n.normal,s=n.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new Zt(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let y=0;y<i.count;y++)a[y]=new P,l[y]=new P;let c=new P,u=new P,f=new P,h=new ot,d=new ot,g=new ot,_=new P,m=new P;function p(y,A,R){c.fromBufferAttribute(i,y),u.fromBufferAttribute(i,A),f.fromBufferAttribute(i,R),h.fromBufferAttribute(s,y),d.fromBufferAttribute(s,A),g.fromBufferAttribute(s,R),u.sub(c),f.sub(c),d.sub(h),g.sub(h);let D=1/(d.x*g.y-g.x*d.y);isFinite(D)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(f,-d.y).multiplyScalar(D),m.copy(f).multiplyScalar(d.x).addScaledVector(u,-g.x).multiplyScalar(D),a[y].add(_),a[A].add(_),a[R].add(_),l[y].add(m),l[A].add(m),l[R].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let y=0,A=M.length;y<A;++y){let R=M[y],D=R.start,U=R.count;for(let G=D,N=D+U;G<N;G+=3)p(e.getX(G+0),e.getX(G+1),e.getX(G+2))}let T=new P,x=new P,S=new P,E=new P;function C(y){S.fromBufferAttribute(r,y),E.copy(S);let A=a[y];T.copy(A),T.sub(S.multiplyScalar(S.dot(A))).normalize(),x.crossVectors(E,A);let D=x.dot(l[y])<0?-1:1;o.setXYZW(y,T.x,T.y,T.z,D)}for(let y=0,A=M.length;y<A;++y){let R=M[y],D=R.start,U=R.count;for(let G=D,N=D+U;G<N;G+=3)C(e.getX(G+0)),C(e.getX(G+1)),C(e.getX(G+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==n.count)i=new Zt(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,d=i.count;h<d;h++)i.setXYZ(h,0,0,0);let r=new P,s=new P,o=new P,a=new P,l=new P,c=new P,u=new P,f=new P;if(e)for(let h=0,d=e.count;h<d;h+=3){let g=e.getX(h+0),_=e.getX(h+1),m=e.getX(h+2);r.fromBufferAttribute(n,g),s.fromBufferAttribute(n,_),o.fromBufferAttribute(n,m),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,_),c.fromBufferAttribute(i,m),a.add(u),l.add(u),c.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(_,l.x,l.y,l.z),i.setXYZ(m,c.x,c.y,c.z)}else for(let h=0,d=n.count;h<d;h+=3)r.fromBufferAttribute(n,h+0),s.fromBufferAttribute(n,h+1),o.fromBufferAttribute(n,h+2),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Un.fromBufferAttribute(e,n),Un.normalize(),e.setXYZ(n,Un.x,Un.y,Un.z)}toNonIndexed(){function e(a,l){let c=a.array,u=a.itemSize,f=a.normalized,h=new c.constructor(l.length*u),d=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?d=l[_]*a.data.stride+a.offset:d=l[_]*u;for(let p=0;p<u;p++)h[g++]=c[d++]}return new Zt(h,u,f)}if(this.index===null)return it("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let n=new t,i=this.index.array,r=this.attributes;for(let a in r){let l=r[a],c=e(l,i);n.setAttribute(a,c)}let s=this.morphAttributes;for(let a in s){let l=[],c=s[a];for(let u=0,f=c.length;u<f;u++){let h=c[u],d=e(h,i);l.push(d)}n.morphAttributes[a]=l}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let r={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){let d=c[f];u.push(d.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let n={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let r=e.attributes;for(let c in r){let u=r[c];this.setAttribute(c,u.clone(n))}let s=e.morphAttributes;for(let c in s){let u=[],f=s[c];for(let h=0,d=f.length;h<d;h++)u.push(f[h].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,u=o.length;c<u;c++){let f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Fh=class{constructor(e,n){this.isInterleavedBuffer=!0,this.array=e,this.stride=n,this.count=e!==void 0?e.length/n:0,this.usage=Um,this.updateRanges=[],this.version=0,this.uuid=Ps()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,n,i){e*=this.stride,i*=n.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=n.array[i+r];return this}set(e,n=0){return this.array.set(e,n),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ps()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let n=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(n,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ps()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let n={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}},si=new P,Sa=class t{constructor(e,n,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=n,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let n=0,i=this.data.count;n<i;n++)si.fromBufferAttribute(this,n),si.applyMatrix4(e),this.setXYZ(n,si.x,si.y,si.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)si.fromBufferAttribute(this,n),si.applyNormalMatrix(e),this.setXYZ(n,si.x,si.y,si.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)si.fromBufferAttribute(this,n),si.transformDirection(e),this.setXYZ(n,si.x,si.y,si.z);return this}getComponent(e,n){let i=this.array[e*this.data.stride+this.offset+n];return this.normalized&&(i=yr(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=qt(i,this.array)),this.data.array[e*this.data.stride+this.offset+n]=i,this}setX(e,n){return this.normalized&&(n=qt(n,this.array)),this.data.array[e*this.data.stride+this.offset]=n,this}setY(e,n){return this.normalized&&(n=qt(n,this.array)),this.data.array[e*this.data.stride+this.offset+1]=n,this}setZ(e,n){return this.normalized&&(n=qt(n,this.array)),this.data.array[e*this.data.stride+this.offset+2]=n,this}setW(e,n){return this.normalized&&(n=qt(n,this.array)),this.data.array[e*this.data.stride+this.offset+3]=n,this}getX(e){let n=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(n=yr(n,this.array)),n}getY(e){let n=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(n=yr(n,this.array)),n}getZ(e){let n=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(n=yr(n,this.array)),n}getW(e){let n=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(n=yr(n,this.array)),n}setXY(e,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(n=qt(n,this.array),i=qt(i,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this}setXYZ(e,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(n=qt(n,this.array),i=qt(i,this.array),r=qt(r,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(n=qt(n,this.array),i=qt(i,this.array),r=qt(r,this.array),s=qt(s,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){$l("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let n=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return new Zt(new this.array.constructor(n),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new t(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){$l("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let n=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:n,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},rm=new P,B1=new P,k1=new ht,sr=class{constructor(e=new P(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){let r=rm.subVectors(i,n).cross(B1.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n,i=!0){let r=e.delta(rm),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(o<0||o>1)?null:n.copy(e.start).addScaledVector(r,o)}intersectsLine(e){let n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){let i=n||k1.getNormalMatrix(e),r=this.coplanarPoint(rm).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},z1=0,Zr=class extends Mr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:z1++}),this.uuid=Ps(),this.name="",this.type="Material",this.blending=ar,this.side=wr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=_m,this.blendDst=Ta,this.blendEquation=ts,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new St(0,0,0),this.blendAlpha=0,this.depthFunc=va,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zv,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Mh,this.stencilZFail=Mh,this.stencilZPass=Mh,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let n in e){let i=e[n];if(i===void 0){it(`Material: parameter '${n}' has value of undefined.`);continue}let r=this[n];if(r===void 0){it(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){let n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){let o=[];for(let a in s){let l=s[a];delete l.metadata,o.push(l)}return o}if(n){let s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}fromJSON(e,n){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new St().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new sr().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=n[e.map]||null),e.matcap!==void 0&&(this.matcap=n[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=n[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=n[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=n[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new ot().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=n[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=n[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=n[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=n[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=n[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=n[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=n[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=n[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=n[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=n[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=n[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=n[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=n[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=n[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ot().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=n[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=n[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=n[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=n[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=n[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=n[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=n[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let n=e.clippingPlanes,i=null;if(n!==null){let r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var Yr=new P,sm=new P,ih=new P,rh=new P,Kr=class{constructor(e=new P,n=new P(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Yr)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);let i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let n=Yr.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Yr.copy(this.origin).addScaledVector(this.direction,n),Yr.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){sm.copy(e).add(n).multiplyScalar(.5),ih.copy(n).sub(e).normalize(),rh.copy(this.origin).sub(sm);let s=e.distanceTo(n)*.5,o=-this.direction.dot(ih),a=rh.dot(this.direction),l=-rh.dot(ih),c=rh.lengthSq(),u=Math.abs(1-o*o),f,h,d,g;if(u>0)if(f=o*l-a,h=o*a-l,g=s*u,f>=0)if(h>=-g)if(h<=g){let _=1/u;f*=_,h*=_,d=f*(f+o*h+2*a)+h*(o*f+h+2*l)+c}else h=s,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*l)+c;else h=-s,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*l)+c;else h<=-g?(f=Math.max(0,-(-o*s+a)),h=f>0?-s:Math.min(Math.max(-s,-l),s),d=-f*f+h*(h+2*l)+c):h<=g?(f=0,h=Math.min(Math.max(-s,-l),s),d=h*(h+2*l)+c):(f=Math.max(0,-(o*s+a)),h=f>0?s:Math.min(Math.max(-s,-l),s),d=-f*f+h*(h+2*l)+c);else h=o>0?-s:s,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(sm).addScaledVector(ih,h),d}intersectSphere(e,n){if(e.radius<0)return null;Yr.subVectors(e.center,this.origin);let i=Yr.dot(this.direction),r=Yr.dot(Yr)-i*i,s=e.radius*e.radius;if(r>s)return null;let o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,n):this.at(a,n)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){let i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){let n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,a,l,c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),u>=0?(s=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(s=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),f>=0?(a=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(a=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,Yr)!==null}intersectTriangle(e,n,i,r,s){let o=this.origin,a=this.direction,l=a.x,c=a.y,u=a.z,f=e.x-o.x,h=e.y-o.y,d=e.z-o.z,g=n.x-o.x,_=n.y-o.y,m=n.z-o.z,p=i.x-o.x,M=i.y-o.y,T=i.z-o.z,x=Math.abs(l),S=Math.abs(c),E=Math.abs(u),C,y,A,R,D,U,G,N,H,O,k,q;if(x>=S&&x>=E?(A=l,U=f,H=g,q=p,l>=0?(C=c,y=u,R=h,D=d,G=_,N=m,O=M,k=T):(C=u,y=c,R=d,D=h,G=m,N=_,O=T,k=M)):S>=E?(A=c,U=h,H=_,q=M,c>=0?(C=u,y=l,R=d,D=f,G=m,N=g,O=T,k=p):(C=l,y=u,R=f,D=d,G=g,N=m,O=p,k=T)):(A=u,U=d,H=m,q=T,u>=0?(C=l,y=c,R=f,D=h,G=g,N=_,O=p,k=M):(C=c,y=l,R=h,D=f,G=_,N=g,O=M,k=p)),A===0)return null;let j=C/A,J=y/A,ne=1/A,Ue=R-j*U,Pe=D-J*U,lt=G-j*H,Ve=N-J*H,et=O-j*q,$=k-J*q,ee=et*Ve-$*lt,Me=Ue*$-Pe*et,Ze=lt*Pe-Ve*Ue;if(r){if(ee<0||Me<0||Ze<0)return null}else if((ee<0||Me<0||Ze<0)&&(ee>0||Me>0||Ze>0))return null;let be=ee+Me+Ze;if(be===0)return null;let re=ne*(ee*U+Me*H+Ze*q);return(be>0?re<0:re>0)?null:this.at(re/be,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Zl=class extends Zr{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new St(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Is,this.combine=Mm,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},cv=new At,mo=new Kr,sh=new Sr,uv=new P,oh=new P,ah=new P,lh=new P,om=new P,ch=new P,hv=new P,uh=new P,zt=class extends mi{constructor(e=new Mn,n=new Zl){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,n){let i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);let a=this.morphTargetInfluences;if(s&&a){ch.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let u=a[l],f=s[l];u!==0&&(om.fromBufferAttribute(f,e),o?ch.addScaledVector(om,u):ch.addScaledVector(om.sub(n),u))}n.add(ch)}return n}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){let i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),sh.copy(i.boundingSphere),sh.applyMatrix4(s),mo.copy(e.ray).recast(e.near),!(sh.containsPoint(mo.origin)===!1&&(mo.intersectSphere(sh,uv)===null||mo.origin.distanceToSquared(uv)>(e.far-e.near)**2))&&(cv.copy(s).invert(),mo.copy(e.ray).applyMatrix4(cv),!(i.boundingBox!==null&&mo.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,mo)))}_computeIntersections(e,n,i){let r,s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,h=s.groups,d=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){let m=h[g],p=o[m.materialIndex],M=Math.max(m.start,d.start),T=Math.min(a.count,Math.min(m.start+m.count,d.start+d.count));for(let x=M,S=T;x<S;x+=3){let E=a.getX(x),C=a.getX(x+1),y=a.getX(x+2);r=hh(this,p,e,i,c,u,f,E,C,y),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{let g=Math.max(0,d.start),_=Math.min(a.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){let M=a.getX(m),T=a.getX(m+1),x=a.getX(m+2);r=hh(this,o,e,i,c,u,f,M,T,x),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){let m=h[g],p=o[m.materialIndex],M=Math.max(m.start,d.start),T=Math.min(l.count,Math.min(m.start+m.count,d.start+d.count));for(let x=M,S=T;x<S;x+=3){let E=x,C=x+1,y=x+2;r=hh(this,p,e,i,c,u,f,E,C,y),r&&(r.faceIndex=Math.floor(x/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{let g=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let m=g,p=_;m<p;m+=3){let M=m,T=m+1,x=m+2;r=hh(this,o,e,i,c,u,f,M,T,x),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}};function V1(t,e,n,i,r,s,o,a){let l;if(e.side===li?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===wr,a),l===null)return null;uh.copy(a),uh.applyMatrix4(t.matrixWorld);let c=n.ray.origin.distanceTo(uh);return c<n.near||c>n.far?null:{distance:c,point:uh.clone(),object:t}}function hh(t,e,n,i,r,s,o,a,l,c){t.getVertexPosition(a,oh),t.getVertexPosition(l,ah),t.getVertexPosition(c,lh);let u=V1(t,e,n,i,oh,ah,lh,hv);if(u){let f=new P;Cs.getBarycoord(hv,oh,ah,lh,f),r&&(u.uv=Cs.getInterpolatedAttribute(r,a,l,c,f,new ot)),s&&(u.uv1=Cs.getInterpolatedAttribute(s,a,l,c,f,new ot)),o&&(u.normal=Cs.getInterpolatedAttribute(o,a,l,c,f,new P),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let h={a,b:l,c,normal:new P,materialIndex:0};Cs.getNormal(oh,ah,lh,h.normal),u.face=h,u.barycoord=f}return u}var Kl=class extends oi{constructor(e=null,n=1,i=1,r,s,o,a,l,c=Bn,u=Bn,f,h){super(null,o,a,l,c,u,r,s,f,h),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ai=class extends Zt{constructor(e,n,i,r=1){super(e,n,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},da=new At,fv=new At,fh=[],dv=new br,G1=new At,kl=new zt,zl=new Sr,Jl=class extends zt{constructor(e,n,i){super(e,n),this.isInstancedMesh=!0,this.instanceMatrix=new ai(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,G1)}computeBoundingBox(){let e=this.geometry,n=this.count;this.boundingBox===null&&(this.boundingBox=new br),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,da),dv.copy(e.boundingBox).applyMatrix4(da),this.boundingBox.union(dv)}computeBoundingSphere(){let e=this.geometry,n=this.count;this.boundingSphere===null&&(this.boundingSphere=new Sr),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,da),zl.copy(e.boundingSphere).applyMatrix4(da),this.boundingSphere.union(zl)}copy(e,n){return super.copy(e,n),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,n){return this.instanceColor===null?n.setRGB(1,1,1):n.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,n){return n.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,n){let i=n.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,o=e*s+1;for(let a=0;a<i.length;a++)i[a]=r[o+a]}raycast(e,n){let i=this.matrixWorld,r=this.count;if(kl.geometry=this.geometry,kl.material=this.material,kl.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),zl.copy(this.boundingSphere),zl.applyMatrix4(i),e.ray.intersectsSphere(zl)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,da),fv.multiplyMatrices(i,da),kl.matrixWorld=fv,kl.raycast(e,fh);for(let o=0,a=fh.length;o<a;o++){let l=fh[o];l.instanceId=s,l.object=this,n.push(l)}fh.length=0}}setColorAt(e,n){return this.instanceColor===null&&(this.instanceColor=new ai(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),n.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,n){return n.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,n){let i=n.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new Kl(new Float32Array(r*this.count),r,this.count,df,Hi));let s=this.morphTexture.source.data.data,o=0;for(let c=0;c<i.length;c++)o+=i[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=r*e;return s[l]=a,s.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},go=new Sr,H1=new ot(.5,.5),dh=new P,Ql=class{constructor(e=new sr,n=new sr,i=new sr,r=new sr,s=new sr,o=new sr){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){let a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){let n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=or,i=!1){let r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],f=s[5],h=s[6],d=s[7],g=s[8],_=s[9],m=s[10],p=s[11],M=s[12],T=s[13],x=s[14],S=s[15];if(r[0].setComponents(c-o,d-u,p-g,S-M).normalize(),r[1].setComponents(c+o,d+u,p+g,S+M).normalize(),r[2].setComponents(c+a,d+f,p+_,S+T).normalize(),r[3].setComponents(c-a,d-f,p-_,S-T).normalize(),i)r[4].setComponents(l,h,m,x).normalize(),r[5].setComponents(c-l,d-h,p-m,S-x).normalize();else if(r[4].setComponents(c-l,d-h,p-m,S-x).normalize(),n===or)r[5].setComponents(c+l,d+h,p+m,S+x).normalize();else if(n===Wl)r[5].setComponents(l,h,m,x).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),go.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),go.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(go)}intersectsSprite(e){go.center.set(0,0,0);let n=H1.distanceTo(e.center);return go.radius=.7071067811865476+n,go.applyMatrix4(e.matrixWorld),this.intersectsSphere(go)}intersectsSphere(e){let n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){let n=this.planes;for(let i=0;i<6;i++){let r=n[i];if(dh.x=r.normal.x>0?e.max.x:e.min.x,dh.y=r.normal.y>0?e.max.y:e.min.y,dh.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(dh)<0)return!1}return!0}containsPoint(e){let n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Uh=class extends Zr{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new St(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Bh=new P,kh=new P,pv=new At,Vl=new Kr,ph=new Sr,am=new P,mv=new P,zh=class extends mi{constructor(e=new Mn,n=new Uh){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)Bh.fromBufferAttribute(n,r-1),kh.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=Bh.distanceTo(kh);e.setAttribute("lineDistance",new Xt(i,1))}else it("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){let i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),ph.copy(i.boundingSphere),ph.applyMatrix4(r),ph.radius+=s,e.ray.intersectsSphere(ph)===!1)return;pv.copy(r).invert(),Vl.copy(e.ray).applyMatrix4(pv);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,h=i.attributes.position;if(u!==null){let d=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=d,m=g-1;_<m;_+=c){let p=u.getX(_),M=u.getX(_+1),T=mh(this,e,Vl,l,p,M,_);T&&n.push(T)}if(this.isLineLoop){let _=u.getX(g-1),m=u.getX(d),p=mh(this,e,Vl,l,_,m,g-1);p&&n.push(p)}}else{let d=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=d,m=g-1;_<m;_+=c){let p=mh(this,e,Vl,l,_,_+1,_);p&&n.push(p)}if(this.isLineLoop){let _=mh(this,e,Vl,l,g-1,d,g-1);_&&n.push(_)}}}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function mh(t,e,n,i,r,s,o){let a=t.geometry.attributes.position;if(Bh.fromBufferAttribute(a,r),kh.fromBufferAttribute(a,s),n.distanceSqToSegment(Bh,kh,am,mv)>i)return;am.applyMatrix4(t.matrixWorld);let c=e.ray.origin.distanceTo(am);if(!(c<e.near||c>e.far))return{distance:c,point:mv.clone().applyMatrix4(t.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:t}}var gv=new P,xv=new P,ec=class extends zh{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)gv.fromBufferAttribute(n,r),xv.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+gv.distanceTo(xv);e.setAttribute("lineDistance",new Xt(i,1))}else it("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var Vh=class extends Zr{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new St(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},vv=new At,dm=new Kr,gh=new Sr,xh=new P,tc=class extends mi{constructor(e=new Mn,n=new Vh){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){let i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),gh.copy(i.boundingSphere),gh.applyMatrix4(r),gh.radius+=s,e.ray.intersectsSphere(gh)===!1)return;vv.copy(r).invert(),dm.copy(e.ray).applyMatrix4(vv);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,f=i.attributes.position;if(c!==null){let h=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let g=h,_=d;g<_;g++){let m=c.getX(g);xh.fromBufferAttribute(f,m),yv(xh,m,l,r,e,n,this)}}else{let h=Math.max(0,o.start),d=Math.min(f.count,o.start+o.count);for(let g=h,_=d;g<_;g++)xh.fromBufferAttribute(f,g),yv(xh,g,l,r,e,n,this)}}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function yv(t,e,n,i,r,s,o){let a=dm.distanceSqToPoint(t);if(a<n){let l=new P;dm.closestPointToPoint(t,l),l.applyMatrix4(i);let c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var nc=class extends oi{constructor(e=[],n=Fs,i,r,s,o,a,l,c,u){super(e,n,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Jr=class extends oi{constructor(e,n,i,r,s,o,a,l,c){super(e,n,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Ls=class extends oi{constructor(e,n,i=lr,r,s,o,a=Bn,l=Bn,c,u=_r,f=1){if(u!==_r&&u!==Bs)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:n,depth:f};super(h,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new _a(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let n=super.toJSON(e);return n.compareFunction=this.compareFunction,n}},Gh=class extends Ls{constructor(e,n=lr,i=Fs,r,s,o=Bn,a=Bn,l,c=_r){let u={width:e,height:e,depth:1},f=[u,u,u,u,u,u];super(e,e,n,i,r,s,o,a,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},ic=class extends oi{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},wa=class t extends Mn{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};let a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);let l=[],c=[],u=[],f=[],h=0,d=0;g("z","y","x",-1,-1,i,n,e,o,s,0),g("z","y","x",1,-1,i,n,-e,o,s,1),g("x","z","y",1,1,e,i,n,r,o,2),g("x","z","y",1,-1,e,i,-n,r,o,3),g("x","y","z",1,-1,e,n,i,r,s,4),g("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Xt(c,3)),this.setAttribute("normal",new Xt(u,3)),this.setAttribute("uv",new Xt(f,2));function g(_,m,p,M,T,x,S,E,C,y,A){let R=x/C,D=S/y,U=x/2,G=S/2,N=E/2,H=C+1,O=y+1,k=0,q=0,j=new P;for(let J=0;J<O;J++){let ne=J*D-G;for(let Ue=0;Ue<H;Ue++){let Pe=Ue*R-U;j[_]=Pe*M,j[m]=ne*T,j[p]=N,c.push(j.x,j.y,j.z),j[_]=0,j[m]=0,j[p]=E>0?1:-1,u.push(j.x,j.y,j.z),f.push(Ue/C),f.push(1-J/y),k+=1}}for(let J=0;J<y;J++)for(let ne=0;ne<C;ne++){let Ue=h+ne+H*J,Pe=h+ne+H*(J+1),lt=h+(ne+1)+H*(J+1),Ve=h+(ne+1)+H*J;l.push(Ue,Pe,Ve),l.push(Pe,lt,Ve),q+=6}a.addGroup(d,q,A),d+=q,h+=k}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new t(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var rc=class t extends Mn{constructor(e=[],n=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:n,radius:i,detail:r};let s=[],o=[];a(r),c(i),u(),this.setAttribute("position",new Xt(s,3)),this.setAttribute("normal",new Xt(s.slice(),3)),this.setAttribute("uv",new Xt(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(M){let T=new P,x=new P,S=new P;for(let E=0;E<n.length;E+=3)d(n[E+0],T),d(n[E+1],x),d(n[E+2],S),l(T,x,S,M)}function l(M,T,x,S){let E=S+1,C=[];for(let y=0;y<=E;y++){C[y]=[];let A=M.clone().lerp(x,y/E),R=T.clone().lerp(x,y/E),D=E-y;for(let U=0;U<=D;U++)U===0&&y===E?C[y][U]=A:C[y][U]=A.clone().lerp(R,U/D)}for(let y=0;y<E;y++)for(let A=0;A<2*(E-y)-1;A++){let R=Math.floor(A/2);A%2===0?(h(C[y][R+1]),h(C[y+1][R]),h(C[y][R])):(h(C[y][R+1]),h(C[y+1][R+1]),h(C[y+1][R]))}}function c(M){let T=new P;for(let x=0;x<s.length;x+=3)T.x=s[x+0],T.y=s[x+1],T.z=s[x+2],T.normalize().multiplyScalar(M),s[x+0]=T.x,s[x+1]=T.y,s[x+2]=T.z}function u(){let M=new P;for(let T=0;T<s.length;T+=3){M.x=s[T+0],M.y=s[T+1],M.z=s[T+2];let x=m(M)/2/Math.PI+.5,S=p(M)/Math.PI+.5;o.push(x,1-S)}g(),f()}function f(){for(let M=0;M<o.length;M+=6){let T=o[M+0],x=o[M+2],S=o[M+4],E=Math.max(T,x,S),C=Math.min(T,x,S);E>.9&&C<.1&&(T<.2&&(o[M+0]+=1),x<.2&&(o[M+2]+=1),S<.2&&(o[M+4]+=1))}}function h(M){s.push(M.x,M.y,M.z)}function d(M,T){let x=M*3;T.x=e[x+0],T.y=e[x+1],T.z=e[x+2]}function g(){let M=new P,T=new P,x=new P,S=new P,E=new ot,C=new ot,y=new ot;for(let A=0,R=0;A<s.length;A+=9,R+=6){M.set(s[A+0],s[A+1],s[A+2]),T.set(s[A+3],s[A+4],s[A+5]),x.set(s[A+6],s[A+7],s[A+8]),E.set(o[R+0],o[R+1]),C.set(o[R+2],o[R+3]),y.set(o[R+4],o[R+5]),S.copy(M).add(T).add(x).divideScalar(3);let D=m(S);_(E,R+0,M,D),_(C,R+2,T,D),_(y,R+4,x,D)}}function _(M,T,x,S){S<0&&M.x===1&&(o[T]=M.x-1),x.x===0&&x.z===0&&(o[T]=S/2/Math.PI+.5)}function m(M){return Math.atan2(M.z,-M.x)}function p(M){return Math.atan2(-M.y,Math.sqrt(M.x*M.x+M.z*M.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new t(e.vertices,e.indices,e.radius,e.detail)}};var yo=class t extends rc{constructor(e=1,n=0){let i=(1+Math.sqrt(5))/2,r=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,n),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new t(e.radius,e.detail)}};var sc=class t extends rc{constructor(e=1,n=0){let i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,r,e,n),this.type="OctahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new t(e.radius,e.detail)}},Qr=class t extends Mn{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};let s=e/2,o=n/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,f=e/a,h=n/l,d=[],g=[],_=[],m=[];for(let p=0;p<u;p++){let M=p*h-o;for(let T=0;T<c;T++){let x=T*f-s;g.push(x,-M,0),_.push(0,0,1),m.push(T/a),m.push(1-p/l)}}for(let p=0;p<l;p++)for(let M=0;M<a;M++){let T=M+c*p,x=M+c*(p+1),S=M+1+c*(p+1),E=M+1+c*p;d.push(T,x,E),d.push(x,S,E)}this.setIndex(d),this.setAttribute("position",new Xt(g,3)),this.setAttribute("normal",new Xt(_,3)),this.setAttribute("uv",new Xt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new t(e.width,e.height,e.widthSegments,e.heightSegments)}};function So(t){let e={};for(let n in t){e[n]={};for(let i in t[n]){let r=t[n][i];if(_v(r))r.isRenderTargetTexture?(it("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone();else if(Array.isArray(r))if(_v(r[0])){let s=[];for(let o=0,a=r.length;o<a;o++)s[o]=r[o].clone();e[n][i]=s}else e[n][i]=r.slice();else e[n][i]=r}}return e}function Jn(t){let e={};for(let n=0;n<t.length;n++){let i=So(t[n]);for(let r in i)e[r]=i[r]}return e}function _v(t){return t&&(t.isColor||t.isMatrix3||t.isMatrix4||t.isVector2||t.isVector3||t.isVector4||t.isTexture||t.isQuaternion)}function W1(t){let e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function km(t){let e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Mt.workingColorSpace}var ly={clone:So,merge:Jn},X1=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,$1=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Lt=class extends Zr{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=X1,this.fragmentShader=$1,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=So(e.uniforms),this.uniformsGroups=W1(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(let r in this.uniforms){let o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;let i={};for(let r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}fromJSON(e,n){if(super.fromJSON(e,n),e.uniforms!==void 0)for(let i in e.uniforms){let r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=n[r.value]||null;break;case"c":this.uniforms[i].value=new St().setHex(r.value);break;case"v2":this.uniforms[i].value=new ot().fromArray(r.value);break;case"v3":this.uniforms[i].value=new P().fromArray(r.value);break;case"v4":this.uniforms[i].value=new tn().fromArray(r.value);break;case"m3":this.uniforms[i].value=new ht().fromArray(r.value);break;case"m4":this.uniforms[i].value=new At().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},Hh=class extends Lt{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var Wh=class extends Zr{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=qv,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},Xh=class extends Zr{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function pa(t,e){return!t||t.constructor===e?t:typeof e.BYTES_PER_ELEMENT=="number"?new e(t):Array.prototype.slice.call(t)}function lm(t){return t!==void 0&&t.inTangents!==void 0&&t.outTangents!==void 0}var Ds=class{constructor(e,n,i,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new n.constructor(i),this.sampleValues=n,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let n=this.parameterPositions,i=this._cachedIndex,r=n[i],s=n[i-1];n:{e:{let o;t:{i:if(!(e<r)){for(let a=i+2;;){if(r===void 0){if(e<s)break i;return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(s=r,r=n[++i],e<r)break e}o=n.length;break t}if(!(e>=s)){let a=n[1];e<a&&(i=2,s=a);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(r=s,s=n[--i-1],e>=s)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<n[a]?o=a:i=a+1}if(r=n[i],s=n[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,r)}return this.interpolate_(i,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let n=this.resultBuffer,i=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)n[o]=i[s+o];return n}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},$h=class extends Ds{constructor(e,n,i,r){super(e,n,i,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:um,endingEnd:um}}intervalChanged_(e,n,i){let r=this.parameterPositions,s=e-2,o=e+1,a=r[s],l=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case hm:s=e,a=2*n-i;break;case fm:s=r.length-2,a=n+r[s]-r[s+1];break;default:s=e,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case hm:o=e,l=2*i-n;break;case fm:o=1,l=i+r[1]-r[0];break;default:o=e-1,l=n}let c=(i-n)*.5,u=this.valueSize;this._weightPrev=c/(n-a),this._weightNext=c/(l-i),this._offsetPrev=s*u,this._offsetNext=o*u}interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,f=this._offsetNext,h=this._weightPrev,d=this._weightNext,g=(i-n)/(r-n),_=g*g,m=_*g,p=-h*m+2*h*_-h*g,M=(1+h)*m+(-1.5-2*h)*_+(-.5+h)*g+1,T=(-1-d)*m+(1.5+d)*_+.5*g,x=d*m-d*_;for(let S=0;S!==a;++S)s[S]=p*o[u+S]+M*o[c+S]+T*o[l+S]+x*o[f+S];return s}},Yh=class extends Ds{constructor(e,n,i,r){super(e,n,i,r)}interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(i-n)/(r-n),f=1-u;for(let h=0;h!==a;++h)s[h]=o[c+h]*f+o[l+h]*u;return s}},qh=class extends Ds{constructor(e,n,i,r){super(e,n,i,r)}interpolate_(e){return this.copySampleValue_(e-1)}},jh=class extends Ds{interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this.inTangents,f=this.outTangents;if(!u||!f){let g=(i-n)/(r-n),_=1-g;for(let m=0;m!==a;++m)s[m]=o[c+m]*_+o[l+m]*g;return s}let h=a*2,d=e-1;for(let g=0;g!==a;++g){let _=o[c+g],m=o[l+g],p=d*h+g*2,M=f[p],T=f[p+1],x=e*h+g*2,S=u[x],E=u[x+1],C=q1(i,n,M,S,r);s[g]=cy(C,_,T,E,m)}return s}};function cy(t,e,n,i,r){let s=1-t;return s*s*s*e+3*s*s*t*n+3*s*t*t*i+t*t*t*r}function Y1(t,e,n,i,r){let s=1-t;return 3*s*s*(n-e)+6*s*t*(i-n)+3*t*t*(r-i)}function q1(t,e,n,i,r){let s=(t-e)/(r-e);for(let o=0;o<8;o++){let a=cy(s,e,n,i,r)-t;if(Math.abs(a)<1e-10)break;let l=Y1(s,e,n,i,r);if(Math.abs(l)<1e-10)break;s=Math.max(0,Math.min(1,s-a/l))}return s}var Ti=class{constructor(e,n,i,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(n===void 0||n.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=pa(n,this.TimeBufferType),this.values=pa(i,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let n=e.constructor,i;if(n.toJSON!==this.toJSON)i=n.toJSON(e);else{i={name:e.name,times:pa(e.times,Array),values:pa(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(i.interpolation=r),lm(e.settings)&&(i.settings={inTangents:pa(e.settings.inTangents,Array),outTangents:pa(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new qh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Yh(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new $h(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let n=new jh(this.times,this.values,this.getValueSize(),e);return this.settings&&(n.inTangents=this.settings.inTangents,n.outTangents=this.settings.outTangents),n}setInterpolation(e){let n;switch(e){case Gl:n=this.InterpolantFactoryMethodDiscrete;break;case Ih:n=this.InterpolantFactoryMethodLinear;break;case _h:n=this.InterpolantFactoryMethodSmooth;break;case cm:n=this.InterpolantFactoryMethodBezier;break}if(n===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return it("KeyframeTrack:",i),this}return this.createInterpolant=n,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Gl;case this.InterpolantFactoryMethodLinear:return Ih;case this.InterpolantFactoryMethodSmooth:return _h;case this.InterpolantFactoryMethodBezier:return cm}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let n=this.times;for(let i=0,r=n.length;i!==r;++i)n[i]+=e}return this}scale(e){if(e!==1){let n=this.times;for(let i=0,r=n.length;i!==r;++i)n[i]*=e;lm(this.settings)&&(Mv(this.settings.inTangents,e),Mv(this.settings.outTangents,e))}return this}trim(e,n){let i=this.times,r=i.length,s=0,o=r-1;for(;s!==r&&i[s]<e;)++s;for(;o!==-1&&i[o]>n;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=i.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0,n=this.getValueSize();n-Math.floor(n)!==0&&(rt("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,r=this.values,s=i.length;s===0&&(rt("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){rt("KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){rt("KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(r!==void 0&&S1(r))for(let a=0,l=r.length;a!==l;++a){let c=r[a];if(isNaN(c)){rt("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),n=this.values.slice(),i=this.getValueSize(),r=this.getInterpolation()===_h,s=e.length-1,o=1;for(let a=1;a<s;++a){let l=!1,c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(r)l=!0;else{let f=a*i,h=f-i,d=f+i;for(let g=0;g!==i;++g){let _=n[f+g];if(_!==n[h+g]||_!==n[d+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let f=a*i,h=o*i;for(let d=0;d!==i;++d)n[h+d]=n[f+d]}++o}}if(s>0){e[o]=e[s];for(let a=s*i,l=o*i,c=0;c!==i;++c)n[l+c]=n[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=n.slice(0,o*i)):(this.times=e,this.values=n),this}clone(){let e=this.times.slice(),n=this.values.slice(),i=this.constructor,r=new i(this.name,e,n);return r.createInterpolant=this.createInterpolant,lm(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function Mv(t,e){for(let n=0,i=t.length;n!==i;n+=2)t[n]*=e}Ti.prototype.ValueTypeName="";Ti.prototype.TimeBufferType=Float32Array;Ti.prototype.ValueBufferType=Float32Array;Ti.prototype.DefaultInterpolation=Ih;var Ns=class extends Ti{constructor(e,n,i){super(e,n,i)}};Ns.prototype.ValueTypeName="bool";Ns.prototype.ValueBufferType=Array;Ns.prototype.DefaultInterpolation=Gl;Ns.prototype.InterpolantFactoryMethodLinear=void 0;Ns.prototype.InterpolantFactoryMethodSmooth=void 0;var Zh=class extends Ti{constructor(e,n,i,r){super(e,n,i,r)}};Zh.prototype.ValueTypeName="color";var Kh=class extends Ti{constructor(e,n,i,r){super(e,n,i,r)}};Kh.prototype.ValueTypeName="number";var Jh=class extends Ds{constructor(e,n,i,r){super(e,n,i,r)}interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-n)/(r-n),c=e*a;for(let u=c+a;c!==u;c+=4)Gi.slerpFlat(s,0,o,c-a,o,c,l);return s}},oc=class extends Ti{constructor(e,n,i,r){super(e,n,i,r)}InterpolantFactoryMethodLinear(e){return new Jh(this.times,this.values,this.getValueSize(),e)}};oc.prototype.ValueTypeName="quaternion";oc.prototype.InterpolantFactoryMethodSmooth=void 0;var Os=class extends Ti{constructor(e,n,i){super(e,n,i)}};Os.prototype.ValueTypeName="string";Os.prototype.ValueBufferType=Array;Os.prototype.DefaultInterpolation=Gl;Os.prototype.InterpolantFactoryMethodLinear=void 0;Os.prototype.InterpolantFactoryMethodSmooth=void 0;var Qh=class extends Ti{constructor(e,n,i,r){super(e,n,i,r)}};Qh.prototype.ValueTypeName="vector";var ef=class{constructor(e,n,i){let r=this,s=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=n,this.onError=i,this._abortController=null,this.itemStart=function(u){a++,s===!1&&r.onStart!==void 0&&r.onStart(u,o,a),s=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,f){return c.push(u,f),this},this.removeHandler=function(u){let f=c.indexOf(u);return f!==-1&&c.splice(f,2),this},this.getHandler=function(u){for(let f=0,h=c.length;f<h;f+=2){let d=c[f],g=c[f+1];if(d.global&&(d.lastIndex=0),d.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},uy=new ef,tf=class{constructor(e){this.manager=e!==void 0?e:uy,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,n){let i=this;return new Promise(function(r,s){i.load(e,r,n,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};tf.DEFAULT_MATERIAL_NAME="__DEFAULT";var vh=new P,yh=new Gi,vr=new P,ac=class extends mi{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new At,this.projectionMatrix=new At,this.projectionMatrixInverse=new At,this.coordinateSystem=or,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(vh,yh,vr),vr.x===1&&vr.y===1&&vr.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(vh,yh,vr.set(1,1,1)).invert()}updateWorldMatrix(e,n,i=!1){super.updateWorldMatrix(e,n,i),this.matrixWorld.decompose(vh,yh,vr),vr.x===1&&vr.y===1&&vr.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(vh,yh,vr.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},Rs=new P,bv=new ot,Sv=new ot,jn=class extends ac{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let n=.5*this.getFilmHeight()/e;this.fov=Lh*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(zp*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Lh*2*Math.atan(Math.tan(zp*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){Rs.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Rs.x,Rs.y).multiplyScalar(-e/Rs.z),Rs.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(Rs.x,Rs.y).multiplyScalar(-e/Rs.z)}getViewSize(e,n){return this.getViewBounds(e,bv,Sv),n.subVectors(Sv,bv)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,n=e*Math.tan(zp*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,n-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}};var es=class extends ac{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=i-e,o=i+e,a=r+n,l=r-n;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}};var _o=class extends Mn{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}};var ma=-90,ga=1,nf=class extends mi{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new jn(ma,ga,e,n);r.layers=this.layers,this.add(r);let s=new jn(ma,ga,e,n);s.layers=this.layers,this.add(s);let o=new jn(ma,ga,e,n);o.layers=this.layers,this.add(o);let a=new jn(ma,ga,e,n);a.layers=this.layers,this.add(a);let l=new jn(ma,ga,e,n);l.layers=this.layers,this.add(l);let c=new jn(ma,ga,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,a,l]=n;for(let c of n)this.remove(c);if(e===or)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Wl)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,l,c,u]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let m=!1;e.isWebGLRenderer===!0?m=e.state.buffers.depth.getReversed():m=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,s),e.setRenderTarget(i,1,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,o),e.setRenderTarget(i,2,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,a),e.setRenderTarget(i,3,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,l),e.setRenderTarget(i,4,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,c),i.texture.generateMipmaps=_,e.setRenderTarget(i,5,r),m&&e.autoClear===!1&&e.clearDepth(),e.render(n,u),e.setRenderTarget(f,h,d),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},rf=class extends jn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var zm="\\[\\]\\.:\\/",j1=new RegExp("["+zm+"]","g"),Vm="[^"+zm+"]",Z1="[^"+zm.replace("\\.","")+"]",K1=/((?:WC+[\/:])*)/.source.replace("WC",Vm),J1=/(WCOD+)?/.source.replace("WCOD",Z1),Q1=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Vm),ew=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Vm),tw=new RegExp("^"+K1+J1+Q1+ew+"$"),nw=["material","materials","bones","map"],pm=class{constructor(e,n,i){let r=i||ln.parseTrackName(n);this._targetGroup=e,this._bindings=e.subscribe_(n,r)}getValue(e,n){this.bind();let i=this._targetGroup.nCachedObjects_,r=this._bindings[i];r!==void 0&&r.getValue(e,n)}setValue(e,n){let i=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=i.length;r!==s;++r)i[r].setValue(e,n)}bind(){let e=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=e.length;n!==i;++n)e[n].bind()}unbind(){let e=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=e.length;n!==i;++n)e[n].unbind()}},ln=class t{constructor(e,n,i){this.path=n,this.parsedPath=i||t.parseTrackName(n),this.node=t.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,n,i){return e&&e.isAnimationObjectGroup?new t.Composite(e,n,i):new t(e,n,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(j1,"")}static parseTrackName(e){let n=tw.exec(e);if(n===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:n[2],objectName:n[3],objectIndex:n[4],propertyName:n[5],propertyIndex:n[6]},r=i.nodeName&&i.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=i.nodeName.substring(r+1);nw.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,r),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,n){if(n===void 0||n===""||n==="."||n===-1||n===e.name||n===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(n);if(i!==void 0)return i}if(e.children){let i=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===n||a.uuid===n)return a;let l=i(a.children);if(l)return l}return null},r=i(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,n){e[n]=this.targetObject[this.propertyName]}_getValue_array(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)e[n++]=i[r]}_getValue_arrayElement(e,n){e[n]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,n){this.resolvedProperty.toArray(e,n)}_setValue_direct(e,n){this.targetObject[this.propertyName]=e[n]}_setValue_direct_setNeedsUpdate(e,n){this.targetObject[this.propertyName]=e[n],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,n){this.targetObject[this.propertyName]=e[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[n++]}_setValue_array_setNeedsUpdate(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[n++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[n++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,n){this.resolvedProperty[this.propertyIndex]=e[n]}_setValue_arrayElement_setNeedsUpdate(e,n){this.resolvedProperty[this.propertyIndex]=e[n],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,n){this.resolvedProperty[this.propertyIndex]=e[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,n){this.resolvedProperty.fromArray(e,n)}_setValue_fromArray_setNeedsUpdate(e,n){this.resolvedProperty.fromArray(e,n),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,n){this.resolvedProperty.fromArray(e,n),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,n){this.bind(),this.getValue(e,n)}_setValue_unbound(e,n){this.bind(),this.setValue(e,n)}bind(){let e=this.node,n=this.parsedPath,i=n.objectName,r=n.propertyName,s=n.propertyIndex;if(e||(e=t.findNode(this.rootNode,n.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){it("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=n.objectIndex;switch(i){case"materials":if(!e.material){rt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){rt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){rt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){rt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){rt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){rt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){rt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[r];if(o===void 0){let c=n.nodeName;rt("PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){rt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){rt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ln.Composite=pm;ln.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ln.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ln.prototype.GetterByBindingType=[ln.prototype._getValue_direct,ln.prototype._getValue_array,ln.prototype._getValue_arrayElement,ln.prototype._getValue_toArray];ln.prototype.SetterByBindingTypeAndVersioning=[[ln.prototype._setValue_direct,ln.prototype._setValue_direct_setNeedsUpdate,ln.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ln.prototype._setValue_array,ln.prototype._setValue_array_setNeedsUpdate,ln.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ln.prototype._setValue_arrayElement,ln.prototype._setValue_arrayElement_setNeedsUpdate,ln.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ln.prototype._setValue_fromArray,ln.prototype._setValue_fromArray_setNeedsUpdate,ln.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var r3=new Float32Array(1);var Aa=class extends Fh{constructor(e,n,i=1){super(e,n),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){let n=super.clone(e);return n.meshPerAttribute=this.meshPerAttribute,n}toJSON(e){let n=super.toJSON(e);return n.isInstancedInterleavedBuffer=!0,n.meshPerAttribute=this.meshPerAttribute,n}};var wv=new At,lc=class{constructor(e,n,i=0,r=1/0){this.ray=new Kr(e,n),this.near=i,this.far=r,this.camera=null,this.layers=new Ma,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,n){this.ray.set(e,n)}setFromCamera(e,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,n.projectionMatrix.elements[14]).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):rt("Raycaster: Unsupported camera type: "+n.type)}setFromXRController(e){return wv.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(wv),this}intersectObject(e,n=!0,i=[]){return mm(e,this,i,n),i.sort(Av),i}intersectObjects(e,n=!0,i=[]){for(let r=0,s=e.length;r<s;r++)mm(e[r],this,i,n);return i.sort(Av),i}};function Av(t,e){return t.distance-e.distance}function mm(t,e,n,i){let r=!0;if(t.layers.test(e.layers)&&t.raycast(e,n)===!1&&(r=!1),r===!0&&i===!0){let s=t.children;for(let o=0,a=s.length;o<a;o++)mm(s[o],e,n,!0)}}var Ym=class Ym{constructor(e,n,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,n,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,n=0){for(let i=0;i<4;i++)this.elements[i]=e[i+n];return this}set(e,n,i,r){let s=this.elements;return s[0]=e,s[2]=n,s[1]=i,s[3]=r,this}};Ym.prototype.isMatrix2=!0;var gm=Ym;function Gm(t,e,n,i){let r=iw(i);switch(n){case Nm:return t*e;case df:return t*e/r.components*r.byteLength;case pf:return t*e/r.components*r.byteLength;case ks:return t*e*2/r.components*r.byteLength;case mf:return t*e*2/r.components*r.byteLength;case Om:return t*e*3/r.components*r.byteLength;case Hn:return t*e*4/r.components*r.byteLength;case gf:return t*e*4/r.components*r.byteLength;case dc:case pc:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case mc:case gc:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case vf:case _f:return Math.max(t,16)*Math.max(e,8)/4;case xf:case yf:return Math.max(t,8)*Math.max(e,8)/2;case Mf:case bf:case wf:case Af:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Sf:case xc:case Ef:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Tf:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Rf:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Cf:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Pf:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case If:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Lf:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Df:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Nf:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Of:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Ff:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Uf:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Bf:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case kf:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case zf:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case Vf:case Gf:case Hf:return Math.ceil(t/4)*Math.ceil(e/4)*16;case Wf:case Xf:return Math.ceil(t/4)*Math.ceil(e/4)*8;case vc:case $f:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function iw(t){switch(t){case Ci:case Pm:return{byteLength:1,components:1};case Ra:case Im:case Kn:return{byteLength:2,components:1};case hf:case ff:return{byteLength:2,components:4};case lr:case uf:case Hi:return{byteLength:4,components:1};case Lm:case Dm:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?it("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function Ly(){let t=null,e=!1,n=null,i=null;function r(s,o){i=t.requestAnimationFrame(r),n(s,o)}return{start:function(){e!==!0&&n!==null&&t!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t!==null&&t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function sw(t){let e=new WeakMap;function n(a,l){let c=a.array,u=a.usage,f=c.byteLength,h=t.createBuffer();t.bindBuffer(l,h),t.bufferData(l,c,u),a.onUploadCallback();let d;if(c instanceof Float32Array)d=t.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=t.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=t.HALF_FLOAT:d=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=t.SHORT;else if(c instanceof Uint32Array)d=t.UNSIGNED_INT;else if(c instanceof Int32Array)d=t.INT;else if(c instanceof Int8Array)d=t.BYTE;else if(c instanceof Uint8Array)d=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:f}}function i(a,l,c){let u=l.array,f=l.updateRanges;if(t.bindBuffer(c,a),f.length===0)t.bufferSubData(c,0,u);else{f.sort((d,g)=>d.start-g.start);let h=0;for(let d=1;d<f.length;d++){let g=f[h],_=f[d];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++h,f[h]=_)}f.length=h+1;for(let d=0,g=f.length;d<g;d++){let _=f[d];t.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(t.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,n(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var ow=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,aw=`#ifdef USE_ALPHAHASH
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
#endif`,lw=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,cw=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,uw=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,hw=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,fw=`#ifdef USE_AOMAP
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
#endif`,dw=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,pw=`#ifdef USE_BATCHING
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
#endif`,mw=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,gw=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,xw=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,vw=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,yw=`#ifdef USE_IRIDESCENCE
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
#endif`,_w=`#ifdef USE_BUMPMAP
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
#endif`,Mw=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,bw=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Sw=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ww=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Aw=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Ew=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Tw=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Rw=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Cw=`#define PI 3.141592653589793
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
} // validated`,Pw=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Iw=`vec3 transformedNormal = objectNormal;
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
#endif`,Lw=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Dw=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Nw=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ow=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Fw="gl_FragColor = linearToOutputTexel( gl_FragColor );",Uw=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Bw=`#ifdef USE_ENVMAP
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
#endif`,kw=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,zw=`#ifdef USE_ENVMAP
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
#endif`,Vw=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Gw=`#ifdef USE_ENVMAP
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
#endif`,Hw=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Ww=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Xw=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$w=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Yw=`#ifdef USE_GRADIENTMAP
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
}`,qw=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,jw=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Zw=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Kw=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Jw=`#ifdef USE_ENVMAP
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
#endif`,Qw=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,eA=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,tA=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,nA=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,iA=`PhysicalMaterial material;
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
#endif`,rA=`uniform sampler2D dfgLUT;
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
}`,sA=`
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
#endif`,oA=`#if defined( RE_IndirectDiffuse )
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
#endif`,aA=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,lA=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,cA=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,uA=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,hA=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fA=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,dA=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,pA=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,mA=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,gA=`#if defined( USE_POINTS_UV )
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
#endif`,xA=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,vA=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,yA=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,_A=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,MA=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bA=`#ifdef USE_MORPHTARGETS
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
#endif`,SA=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,wA=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,AA=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,EA=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,TA=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,RA=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,CA=`#ifdef USE_NORMALMAP
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
#endif`,PA=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,IA=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,LA=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,DA=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,NA=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,OA=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,FA=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,UA=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,BA=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,kA=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,zA=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,VA=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,GA=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,HA=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,WA=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,XA=`float getShadowMask() {
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
}`,$A=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,YA=`#ifdef USE_SKINNING
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
#endif`,qA=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,jA=`#ifdef USE_SKINNING
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
#endif`,ZA=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,KA=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,JA=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,QA=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,eE=`#ifdef USE_TRANSMISSION
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
#endif`,tE=`#ifdef USE_TRANSMISSION
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
#endif`,nE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,iE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,rE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,oE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,aE=`uniform sampler2D t2D;
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
}`,lE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cE=`#ifdef ENVMAP_TYPE_CUBE
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
}`,uE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hE=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fE=`#include <common>
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
}`,dE=`#if DEPTH_PACKING == 3200
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
}`,pE=`#define DISTANCE
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
}`,mE=`#define DISTANCE
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
}`,gE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,xE=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vE=`uniform float scale;
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
}`,yE=`uniform vec3 diffuse;
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
}`,_E=`#include <common>
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
}`,ME=`uniform vec3 diffuse;
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
}`,bE=`#define LAMBERT
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
}`,SE=`#define LAMBERT
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
}`,wE=`#define MATCAP
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
}`,AE=`#define MATCAP
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
}`,EE=`#define NORMAL
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
}`,TE=`#define NORMAL
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
}`,RE=`#define PHONG
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
}`,CE=`#define PHONG
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
}`,PE=`#define STANDARD
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
}`,IE=`#define STANDARD
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
}`,LE=`#define TOON
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
}`,DE=`#define TOON
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
}`,NE=`uniform float size;
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
}`,OE=`uniform vec3 diffuse;
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
}`,FE=`#include <common>
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
}`,UE=`uniform vec3 color;
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
}`,BE=`uniform float rotation;
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
}`,kE=`uniform vec3 diffuse;
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
}`,vt={alphahash_fragment:ow,alphahash_pars_fragment:aw,alphamap_fragment:lw,alphamap_pars_fragment:cw,alphatest_fragment:uw,alphatest_pars_fragment:hw,aomap_fragment:fw,aomap_pars_fragment:dw,batching_pars_vertex:pw,batching_vertex:mw,begin_vertex:gw,beginnormal_vertex:xw,bsdfs:vw,iridescence_fragment:yw,bumpmap_pars_fragment:_w,clipping_planes_fragment:Mw,clipping_planes_pars_fragment:bw,clipping_planes_pars_vertex:Sw,clipping_planes_vertex:ww,color_fragment:Aw,color_pars_fragment:Ew,color_pars_vertex:Tw,color_vertex:Rw,common:Cw,cube_uv_reflection_fragment:Pw,defaultnormal_vertex:Iw,displacementmap_pars_vertex:Lw,displacementmap_vertex:Dw,emissivemap_fragment:Nw,emissivemap_pars_fragment:Ow,colorspace_fragment:Fw,colorspace_pars_fragment:Uw,envmap_fragment:Bw,envmap_common_pars_fragment:kw,envmap_pars_fragment:zw,envmap_pars_vertex:Vw,envmap_physical_pars_fragment:Jw,envmap_vertex:Gw,fog_vertex:Hw,fog_pars_vertex:Ww,fog_fragment:Xw,fog_pars_fragment:$w,gradientmap_pars_fragment:Yw,lightmap_pars_fragment:qw,lights_lambert_fragment:jw,lights_lambert_pars_fragment:Zw,lights_pars_begin:Kw,lights_toon_fragment:Qw,lights_toon_pars_fragment:eA,lights_phong_fragment:tA,lights_phong_pars_fragment:nA,lights_physical_fragment:iA,lights_physical_pars_fragment:rA,lights_fragment_begin:sA,lights_fragment_maps:oA,lights_fragment_end:aA,lightprobes_pars_fragment:lA,logdepthbuf_fragment:cA,logdepthbuf_pars_fragment:uA,logdepthbuf_pars_vertex:hA,logdepthbuf_vertex:fA,map_fragment:dA,map_pars_fragment:pA,map_particle_fragment:mA,map_particle_pars_fragment:gA,metalnessmap_fragment:xA,metalnessmap_pars_fragment:vA,morphinstance_vertex:yA,morphcolor_vertex:_A,morphnormal_vertex:MA,morphtarget_pars_vertex:bA,morphtarget_vertex:SA,normal_fragment_begin:wA,normal_fragment_maps:AA,normal_pars_fragment:EA,normal_pars_vertex:TA,normal_vertex:RA,normalmap_pars_fragment:CA,clearcoat_normal_fragment_begin:PA,clearcoat_normal_fragment_maps:IA,clearcoat_pars_fragment:LA,iridescence_pars_fragment:DA,opaque_fragment:NA,packing:OA,premultiplied_alpha_fragment:FA,project_vertex:UA,dithering_fragment:BA,dithering_pars_fragment:kA,roughnessmap_fragment:zA,roughnessmap_pars_fragment:VA,shadowmap_pars_fragment:GA,shadowmap_pars_vertex:HA,shadowmap_vertex:WA,shadowmask_pars_fragment:XA,skinbase_vertex:$A,skinning_pars_vertex:YA,skinning_vertex:qA,skinnormal_vertex:jA,specularmap_fragment:ZA,specularmap_pars_fragment:KA,tonemapping_fragment:JA,tonemapping_pars_fragment:QA,transmission_fragment:eE,transmission_pars_fragment:tE,uv_pars_fragment:nE,uv_pars_vertex:iE,uv_vertex:rE,worldpos_vertex:sE,background_vert:oE,background_frag:aE,backgroundCube_vert:lE,backgroundCube_frag:cE,cube_vert:uE,cube_frag:hE,depth_vert:fE,depth_frag:dE,distance_vert:pE,distance_frag:mE,equirect_vert:gE,equirect_frag:xE,linedashed_vert:vE,linedashed_frag:yE,meshbasic_vert:_E,meshbasic_frag:ME,meshlambert_vert:bE,meshlambert_frag:SE,meshmatcap_vert:wE,meshmatcap_frag:AE,meshnormal_vert:EE,meshnormal_frag:TE,meshphong_vert:RE,meshphong_frag:CE,meshphysical_vert:PE,meshphysical_frag:IE,meshtoon_vert:LE,meshtoon_frag:DE,points_vert:NE,points_frag:OE,shadow_vert:FE,shadow_frag:UE,sprite_vert:BE,sprite_frag:kE},De={common:{diffuse:{value:new St(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ht},alphaMap:{value:null},alphaMapTransform:{value:new ht},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ht}},envmap:{envMap:{value:null},envMapRotation:{value:new ht},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ht}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ht}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ht},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ht},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ht},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ht}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ht}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ht}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new St(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new P},probesMax:{value:new P},probesResolution:{value:new P}},points:{diffuse:{value:new St(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ht},alphaTest:{value:0},uvTransform:{value:new ht}},sprite:{diffuse:{value:new St(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ht},alphaMap:{value:null},alphaMapTransform:{value:new ht},alphaTest:{value:0}}},Tr={basic:{uniforms:Jn([De.common,De.specularmap,De.envmap,De.aomap,De.lightmap,De.fog]),vertexShader:vt.meshbasic_vert,fragmentShader:vt.meshbasic_frag},lambert:{uniforms:Jn([De.common,De.specularmap,De.envmap,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.fog,De.lights,{emissive:{value:new St(0)},envMapIntensity:{value:1}}]),vertexShader:vt.meshlambert_vert,fragmentShader:vt.meshlambert_frag},phong:{uniforms:Jn([De.common,De.specularmap,De.envmap,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.fog,De.lights,{emissive:{value:new St(0)},specular:{value:new St(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:vt.meshphong_vert,fragmentShader:vt.meshphong_frag},standard:{uniforms:Jn([De.common,De.envmap,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.roughnessmap,De.metalnessmap,De.fog,De.lights,{emissive:{value:new St(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:vt.meshphysical_vert,fragmentShader:vt.meshphysical_frag},toon:{uniforms:Jn([De.common,De.aomap,De.lightmap,De.emissivemap,De.bumpmap,De.normalmap,De.displacementmap,De.gradientmap,De.fog,De.lights,{emissive:{value:new St(0)}}]),vertexShader:vt.meshtoon_vert,fragmentShader:vt.meshtoon_frag},matcap:{uniforms:Jn([De.common,De.bumpmap,De.normalmap,De.displacementmap,De.fog,{matcap:{value:null}}]),vertexShader:vt.meshmatcap_vert,fragmentShader:vt.meshmatcap_frag},points:{uniforms:Jn([De.points,De.fog]),vertexShader:vt.points_vert,fragmentShader:vt.points_frag},dashed:{uniforms:Jn([De.common,De.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:vt.linedashed_vert,fragmentShader:vt.linedashed_frag},depth:{uniforms:Jn([De.common,De.displacementmap]),vertexShader:vt.depth_vert,fragmentShader:vt.depth_frag},normal:{uniforms:Jn([De.common,De.bumpmap,De.normalmap,De.displacementmap,{opacity:{value:1}}]),vertexShader:vt.meshnormal_vert,fragmentShader:vt.meshnormal_frag},sprite:{uniforms:Jn([De.sprite,De.fog]),vertexShader:vt.sprite_vert,fragmentShader:vt.sprite_frag},background:{uniforms:{uvTransform:{value:new ht},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:vt.background_vert,fragmentShader:vt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ht}},vertexShader:vt.backgroundCube_vert,fragmentShader:vt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:vt.cube_vert,fragmentShader:vt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:vt.equirect_vert,fragmentShader:vt.equirect_frag},distance:{uniforms:Jn([De.common,De.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:vt.distance_vert,fragmentShader:vt.distance_frag},shadow:{uniforms:Jn([De.lights,De.fog,{color:{value:new St(0)},opacity:{value:1}}]),vertexShader:vt.shadow_vert,fragmentShader:vt.shadow_frag}};Tr.physical={uniforms:Jn([Tr.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ht},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ht},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ht},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ht},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ht},sheen:{value:0},sheenColor:{value:new St(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ht},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ht},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ht},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ht},attenuationDistance:{value:0},attenuationColor:{value:new St(0)},specularColor:{value:new St(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ht},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ht},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ht}}]),vertexShader:vt.meshphysical_vert,fragmentShader:vt.meshphysical_frag};var jf={r:0,b:0,g:0},zE=new At,Dy=new ht;Dy.set(-1,0,0,0,1,0,0,0,1);function VE(t,e,n,i,r,s){let o=new St(0),a=r===!0?0:1,l,c,u=null,f=0,h=null;function d(M){let T=M.isScene===!0?M.background:null;if(T&&T.isTexture){let x=M.backgroundBlurriness>0;T=e.get(T,x)}return T}function g(M){let T=!1,x=d(M);x===null?m(o,a):x&&x.isColor&&(m(x,1),T=!0);let S=t.xr.getEnvironmentBlendMode();S==="additive"?n.buffers.color.setClear(0,0,0,1,s):S==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(t.autoClear||T)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function _(M,T){let x=d(T);x&&(x.isCubeTexture||x.mapping===hc)?(c===void 0&&(c=new zt(new wa(1,1,1),new Lt({name:"BackgroundCubeMaterial",uniforms:So(Tr.backgroundCube.uniforms),vertexShader:Tr.backgroundCube.vertexShader,fragmentShader:Tr.backgroundCube.fragmentShader,side:li,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(S,E,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=x,c.material.uniforms.backgroundBlurriness.value=T.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(zE.makeRotationFromEuler(T.backgroundRotation)).transpose(),x.isCubeTexture&&x.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Dy),c.material.toneMapped=Mt.getTransfer(x.colorSpace)!==kt,(u!==x||f!==x.version||h!==t.toneMapping)&&(c.material.needsUpdate=!0,u=x,f=x.version,h=t.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):x&&x.isTexture&&(l===void 0&&(l=new zt(new Qr(2,2),new Lt({name:"BackgroundMaterial",uniforms:So(Tr.background.uniforms),vertexShader:Tr.background.vertexShader,fragmentShader:Tr.background.fragmentShader,side:wr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=x,l.material.uniforms.backgroundIntensity.value=T.backgroundIntensity,l.material.toneMapped=Mt.getTransfer(x.colorSpace)!==kt,x.matrixAutoUpdate===!0&&x.updateMatrix(),l.material.uniforms.uvTransform.value.copy(x.matrix),(u!==x||f!==x.version||h!==t.toneMapping)&&(l.material.needsUpdate=!0,u=x,f=x.version,h=t.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function m(M,T){M.getRGB(jf,km(t)),n.buffers.color.setClear(jf.r,jf.g,jf.b,T,s)}function p(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(M,T=1){o.set(M),a=T,m(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(M){a=M,m(o,a)},render:g,addToRenderList:_,dispose:p}}function GE(t,e){let n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=h(null),s=r,o=!1;function a(D,U,G,N,H){let O=!1,k=f(D,N,G,U);s!==k&&(s=k,c(s.object)),O=d(D,N,G,H),O&&g(D,N,G,H),H!==null&&e.update(H,t.ELEMENT_ARRAY_BUFFER),(O||o)&&(o=!1,x(D,U,G,N),H!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(H).buffer))}function l(){return t.createVertexArray()}function c(D){return t.bindVertexArray(D)}function u(D){return t.deleteVertexArray(D)}function f(D,U,G,N){let H=N.wireframe===!0,O=i[U.id];O===void 0&&(O={},i[U.id]=O);let k=D.isInstancedMesh===!0?D.id:0,q=O[k];q===void 0&&(q={},O[k]=q);let j=q[G.id];j===void 0&&(j={},q[G.id]=j);let J=j[H];return J===void 0&&(J=h(l()),j[H]=J),J}function h(D){let U=[],G=[],N=[];for(let H=0;H<n;H++)U[H]=0,G[H]=0,N[H]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:G,attributeDivisors:N,object:D,attributes:{},index:null}}function d(D,U,G,N){let H=s.attributes,O=U.attributes,k=0,q=G.getAttributes();for(let j in q)if(q[j].location>=0){let ne=H[j],Ue=O[j];if(Ue===void 0&&(j==="instanceMatrix"&&D.instanceMatrix&&(Ue=D.instanceMatrix),j==="instanceColor"&&D.instanceColor&&(Ue=D.instanceColor)),ne===void 0||ne.attribute!==Ue||Ue&&ne.data!==Ue.data)return!0;k++}return s.attributesNum!==k||s.index!==N}function g(D,U,G,N){let H={},O=U.attributes,k=0,q=G.getAttributes();for(let j in q)if(q[j].location>=0){let ne=O[j];ne===void 0&&(j==="instanceMatrix"&&D.instanceMatrix&&(ne=D.instanceMatrix),j==="instanceColor"&&D.instanceColor&&(ne=D.instanceColor));let Ue={};Ue.attribute=ne,ne&&ne.data&&(Ue.data=ne.data),H[j]=Ue,k++}s.attributes=H,s.attributesNum=k,s.index=N}function _(){let D=s.newAttributes;for(let U=0,G=D.length;U<G;U++)D[U]=0}function m(D){p(D,0)}function p(D,U){let G=s.newAttributes,N=s.enabledAttributes,H=s.attributeDivisors;G[D]=1,N[D]===0&&(t.enableVertexAttribArray(D),N[D]=1),H[D]!==U&&(t.vertexAttribDivisor(D,U),H[D]=U)}function M(){let D=s.newAttributes,U=s.enabledAttributes;for(let G=0,N=U.length;G<N;G++)U[G]!==D[G]&&(t.disableVertexAttribArray(G),U[G]=0)}function T(D,U,G,N,H,O,k){k===!0?t.vertexAttribIPointer(D,U,G,H,O):t.vertexAttribPointer(D,U,G,N,H,O)}function x(D,U,G,N){_();let H=N.attributes,O=G.getAttributes(),k=U.defaultAttributeValues;for(let q in O){let j=O[q];if(j.location>=0){let J=H[q];if(J===void 0&&(q==="instanceMatrix"&&D.instanceMatrix&&(J=D.instanceMatrix),q==="instanceColor"&&D.instanceColor&&(J=D.instanceColor)),J!==void 0){let ne=J.normalized,Ue=J.itemSize,Pe=e.get(J);if(Pe===void 0)continue;let lt=Pe.buffer,Ve=Pe.type,et=Pe.bytesPerElement,$=Ve===t.INT||Ve===t.UNSIGNED_INT||J.gpuType===uf;if(J.isInterleavedBufferAttribute){let ee=J.data,Me=ee.stride,Ze=J.offset;if(ee.isInstancedInterleavedBuffer){for(let be=0;be<j.locationSize;be++)p(j.location+be,ee.meshPerAttribute);D.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=ee.meshPerAttribute*ee.count)}else for(let be=0;be<j.locationSize;be++)m(j.location+be);t.bindBuffer(t.ARRAY_BUFFER,lt);for(let be=0;be<j.locationSize;be++)T(j.location+be,Ue/j.locationSize,Ve,ne,Me*et,(Ze+Ue/j.locationSize*be)*et,$)}else{if(J.isInstancedBufferAttribute){for(let ee=0;ee<j.locationSize;ee++)p(j.location+ee,J.meshPerAttribute);D.isInstancedMesh!==!0&&N._maxInstanceCount===void 0&&(N._maxInstanceCount=J.meshPerAttribute*J.count)}else for(let ee=0;ee<j.locationSize;ee++)m(j.location+ee);t.bindBuffer(t.ARRAY_BUFFER,lt);for(let ee=0;ee<j.locationSize;ee++)T(j.location+ee,Ue/j.locationSize,Ve,ne,Ue*et,Ue/j.locationSize*ee*et,$)}}else if(k!==void 0){let ne=k[q];if(ne!==void 0)switch(ne.length){case 2:t.vertexAttrib2fv(j.location,ne);break;case 3:t.vertexAttrib3fv(j.location,ne);break;case 4:t.vertexAttrib4fv(j.location,ne);break;default:t.vertexAttrib1fv(j.location,ne)}}}}M()}function S(){A();for(let D in i){let U=i[D];for(let G in U){let N=U[G];for(let H in N){let O=N[H];for(let k in O)u(O[k].object),delete O[k];delete N[H]}}delete i[D]}}function E(D){if(i[D.id]===void 0)return;let U=i[D.id];for(let G in U){let N=U[G];for(let H in N){let O=N[H];for(let k in O)u(O[k].object),delete O[k];delete N[H]}}delete i[D.id]}function C(D){for(let U in i){let G=i[U];for(let N in G){let H=G[N];if(H[D.id]===void 0)continue;let O=H[D.id];for(let k in O)u(O[k].object),delete O[k];delete H[D.id]}}}function y(D){for(let U in i){let G=i[U],N=D.isInstancedMesh===!0?D.id:0,H=G[N];if(H!==void 0){for(let O in H){let k=H[O];for(let q in k)u(k[q].object),delete k[q];delete H[O]}delete G[N],Object.keys(G).length===0&&delete i[U]}}}function A(){R(),o=!0,s!==r&&(s=r,c(s.object))}function R(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:A,resetDefaultState:R,dispose:S,releaseStatesOfGeometry:E,releaseStatesOfObject:y,releaseStatesOfProgram:C,initAttributes:_,enableAttribute:m,disableUnusedAttributes:M}}function HE(t,e,n){let i;function r(l){i=l}function s(l,c){t.drawArrays(i,l,c),n.update(c,i,1)}function o(l,c,u){u!==0&&(t.drawArraysInstanced(i,l,c,u),n.update(c,i,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let h=0;for(let d=0;d<u;d++)h+=c[d];n.update(h,i,1)}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a}function WE(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let C=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(C){return!(C!==Hn&&i.convert(C)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(C){let y=C===Kn&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Ci&&C!==Hi&&!y&&i.convert(C)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE))}function l(C){if(C==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp",u=l(c);u!==c&&(it("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let f=n.logarithmicDepthBuffer===!0,h=n.reversedDepthBuffer===!0&&e.has("EXT_clip_control");n.reversedDepthBuffer===!0&&h===!1&&it("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let d=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),g=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),p=t.getParameter(t.MAX_VERTEX_ATTRIBS),M=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),T=t.getParameter(t.MAX_VARYING_VECTORS),x=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),S=t.getParameter(t.MAX_SAMPLES),E=t.getParameter(t.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:M,maxVaryings:T,maxFragmentUniforms:x,maxSamples:S,samples:E}}function XE(t){let e=this,n=null,i=0,r=!1,s=!1,o=new sr,a=new ht,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){let d=f.length!==0||h||i!==0||r;return r=h,i=f.length,d},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,h){n=u(f,h,0)},this.setState=function(f,h,d){let g=f.clippingPlanes,_=f.clipIntersection,m=f.clipShadows,p=t.get(f);if(!r||g===null||g.length===0||s&&!m)s?u(null):c();else{let M=s?0:i,T=M*4,x=p.clippingState||null;l.value=x,x=u(g,h,T,d);for(let S=0;S!==T;++S)x[S]=n[S];p.clippingState=x,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,h,d,g){let _=f!==null?f.length:0,m=null;if(_!==0){if(m=l.value,g!==!0||m===null){let p=d+_*4,M=h.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<p)&&(m=new Float32Array(p));for(let T=0,x=d;T!==_;++T,x+=4)o.copy(f[T]).applyMatrix4(M,a),o.normal.toArray(m,x),m[x+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}var Ia=4,$E=6,YE=20,qE=256,yc=new es,hy=new St,qm=null,jm=0,Zm=0,Km=!1,jE=new P,wo=new P,Kf=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,n=0,i=.1,r=100,s={}){let{size:o=256,position:a=jE}=s;qm=this._renderer.getRenderTarget(),jm=this._renderer.getActiveCubeFace(),Zm=this._renderer.getActiveMipmapLevel(),Km=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,a),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=py(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=dy(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(qm,jm,Zm),this._renderer.xr.enabled=Km,e.scissorTest=!1,Pa(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Fs||e.mapping===bo?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),qm=this._renderer.getRenderTarget(),jm=this._renderer.getActiveCubeFace(),Zm=this._renderer.getActiveMipmapLevel(),Km=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Et,minFilter:Et,generateMipmaps:!1,type:Kn,format:Hn,colorSpace:vo,depthBuffer:!1},r=fy(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=fy(e,n,i);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=ZE(s)),this._blurMaterial=JE(s,e,n),this._ggxMaterial=KE(s,e,n)}return r}_compileMaterial(e){let n=new zt(new Mn,e);this._renderer.compile(n,yc)}_sceneToCubeUV(e,n,i,r,s){let l=new jn(90,1,n,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,d=f.toneMapping;f.getClearColor(hy),f.toneMapping=Ri,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(r),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new zt(new wa,new Zl({name:"PMREM.Background",side:li,depthWrite:!1,depthTest:!1})));let _=this._backgroundBox,m=_.material,p=!1,M=e.background;M?M.isColor&&(m.color.copy(M),e.background=null,p=!0):(m.color.copy(hy),p=!0);for(let T=0;T<6;T++){let x=T%3;x===0?(l.up.set(0,c[T],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[T],s.y,s.z)):x===1?(l.up.set(0,0,c[T]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[T],s.z)):(l.up.set(0,c[T],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[T]));let S=this._cubeSize;Pa(r,x*S,T>2?S:0,S,S),f.setRenderTarget(r),p&&f.render(_,l),f.render(e,l)}f.toneMapping=d,f.autoClear=h,e.background=M}_textureToCubeUV(e,n){let i=this._renderer,r=e.mapping===Fs||e.mapping===bo;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=py()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=dy());let s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;let a=s.uniforms;a.envMap.value=e;let l=this._cubeSize;Pa(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(o,yc)}_applyPMREM(e){let n=this._renderer,i=n.autoClear;n.autoClear=!1;let r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);n.autoClear=i}_applyGGXFilter(e,n,i){let r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;let l=o.uniforms,c=i/(this._lodMeshes.length-1),u=n/(this._lodMeshes.length-1),f=Math.sqrt(c*c-u*u),h=c*1.25,d=f*h,{_lodMax:g}=this,_=this._sizeLods[i],m=3*_*(i>g-Ia?i-g+Ia:0),p=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=d,l.mipInt.value=g-n,Pa(s,m,p,3*_,2*_),r.setRenderTarget(s),r.render(a,yc),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=g-i,Pa(e,m,p,3*_,2*_),r.setRenderTarget(e),r.render(a,yc)}_blur(e,n,i,r){let s=this._pingPongRenderTarget,o=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,s,n,i,o),this._blurPass(s,e,i,i,o)}_blurPass(e,n,i,r,s){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[r];l.material=a;let c=a.uniforms;c.envMap.value=e.texture,c.sigma.value=s,c.mipInt.value=this._lodMax-i;let u=this._sizeLods[r],f=3*u*(r>this._lodMax-Ia?r-this._lodMax+Ia:0),h=4*(this._cubeSize-u);Pa(n,f,h,3*u,2*u),o.setRenderTarget(n),o.render(l,yc)}};function ZE(t){let e=[],n=[],i=t,r=t-Ia+1+$E;for(let s=0;s<r;s++){let o=Math.pow(2,i);e.push(o);let a=1/(o-2),l=-a,c=1+a,u=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,h=6,d=3,g=new Float32Array(d*h*f),_=new Float32Array(d*h*f);for(let p=0;p<f;p++){let M=p%3*2/3-1,T=p>2?0:-1,x=[M,T,0,M+2/3,T,0,M+2/3,T+1,0,M,T,0,M+2/3,T+1,0,M,T+1,0];g.set(x,d*h*p);for(let S=0;S<h;S++){let E=u[S*2]*2-1,C=u[S*2+1]*2-1;p===0?wo.set(1,C,E):p===1?wo.set(-E,1,-C):p===2?wo.set(-E,C,1):p===3?wo.set(-1,C,-E):p===4?wo.set(-E,-1,C):wo.set(E,C,-1),wo.toArray(_,(p*h+S)*d)}}let m=new Mn;m.setAttribute("position",new Zt(g,d)),m.setAttribute("outputDirection",new Zt(_,d)),n.push(new zt(m,null)),i>Ia&&i--}return{lodMeshes:n,sizeLods:e}}function fy(t,e,n){let i=new Tn(t,e,n);return i.texture.mapping=hc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Pa(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function KE(t,e,n){return new Lt({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:qE,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ed(),fragmentShader:`

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
		`,blending:gi,depthTest:!1,depthWrite:!1})}function JE(t,e,n){return new Lt({name:"SphericalGaussianBlur",defines:{SAMPLES:YE,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:ed(),fragmentShader:`

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
		`,blending:gi,depthTest:!1,depthWrite:!1})}function dy(){return new Lt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ed(),fragmentShader:`

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
		`,blending:gi,depthTest:!1,depthWrite:!1})}function py(){return new Lt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ed(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:gi,depthTest:!1,depthWrite:!1})}function ed(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var Jf=class extends Tn{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new nc(r),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new wa(5,5,5),s=new Lt({name:"CubemapFromEquirect",uniforms:So(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:li,blending:gi});s.uniforms.tEquirect.value=n;let o=new zt(r,s),a=n.minFilter;return n.minFilter===Us&&(n.minFilter=Et),new nf(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n=!0,i=!0,r=!0){let s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}};function QE(t){let e=new WeakMap,n=new WeakMap,i=null;function r(h,d=!1){return h==null?null:d?o(h):s(h)}function s(h){if(h&&h.isTexture){let d=h.mapping;if(d===af||d===lf)if(e.has(h)){let g=e.get(h).texture;return a(g,h.mapping)}else{let g=h.image;if(g&&g.height>0){let _=new Jf(g.height);return _.fromEquirectangularTexture(t,h),e.set(h,_),h.addEventListener("dispose",c),a(_.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture){let d=h.mapping,g=d===af||d===lf,_=d===Fs||d===bo;if(g||_){let m=n.get(h),p=m!==void 0?m.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==p)return i===null&&(i=new Kf(t)),m=g?i.fromEquirectangular(h,m):i.fromCubemap(h,m),m.texture.pmremVersion=h.pmremVersion,n.set(h,m),m.texture;if(m!==void 0)return m.texture;{let M=h.image;return g&&M&&M.height>0||_&&M&&l(M)?(i===null&&(i=new Kf(t)),m=g?i.fromEquirectangular(h):i.fromCubemap(h),m.texture.pmremVersion=h.pmremVersion,n.set(h,m),h.addEventListener("dispose",u),m.texture):null}}}return h}function a(h,d){return d===af?h.mapping=Fs:d===lf&&(h.mapping=bo),h}function l(h){let d=0,g=6;for(let _=0;_<g;_++)h[_]!==void 0&&d++;return d===g}function c(h){let d=h.target;d.removeEventListener("dispose",c);let g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function u(h){let d=h.target;d.removeEventListener("dispose",u);let g=n.get(d);g!==void 0&&(n.delete(d),g.dispose())}function f(){e=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:f}}function eT(t){let e={};function n(i){if(e[i]!==void 0)return e[i];let r=t.getExtension(i);return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){let r=n(i);return r===null&&xo("WebGLRenderer: "+i+" extension not supported."),r}}}function tT(t,e,n,i){let r={},s=new WeakMap;function o(f){let h=f.target;h.index!==null&&e.remove(h.index);for(let g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",o),delete r[h.id];let d=s.get(h);d&&(e.remove(d),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function a(f,h){return r[h.id]===!0||(h.addEventListener("dispose",o),r[h.id]=!0,n.memory.geometries++),h}function l(f){let h=f.attributes;for(let d in h)e.update(h[d],t.ARRAY_BUFFER)}function c(f){let h=[],d=f.index,g=f.attributes.position,_=0;if(g===void 0)return;if(d!==null){let M=d.array;_=d.version;for(let T=0,x=M.length;T<x;T+=3){let S=M[T+0],E=M[T+1],C=M[T+2];h.push(S,E,E,C,C,S)}}else{let M=g.array;_=g.version;for(let T=0,x=M.length/3-1;T<x;T+=3){let S=T+0,E=T+1,C=T+2;h.push(S,E,E,C,C,S)}}let m=new(g.count>=65535?jl:ql)(h,1);m.version=_;let p=s.get(f);p&&e.remove(p),s.set(f,m)}function u(f){let h=s.get(f);if(h){let d=f.index;d!==null&&h.version<d.version&&c(f)}else c(f);return s.get(f)}return{get:a,update:l,getWireframeAttribute:u}}function nT(t,e,n){let i;function r(f){i=f}let s,o;function a(f){s=f.type,o=f.bytesPerElement}function l(f,h){t.drawElements(i,h,s,f*o),n.update(h,i,1)}function c(f,h,d){d!==0&&(t.drawElementsInstanced(i,h,s,f*o,d),n.update(h,i,d))}function u(f,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,s,f,0,d);let _=0;for(let m=0;m<d;m++)_+=h[m];n.update(_,i,1)}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function iT(t){let e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(s/3);break;case t.LINES:n.lines+=a*(s/2);break;case t.LINE_STRIP:n.lines+=a*(s-1);break;case t.LINE_LOOP:n.lines+=a*s;break;case t.POINTS:n.points+=a*s;break;default:rt("WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function rT(t,e,n){let i=new WeakMap,r=new tn;function s(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=u!==void 0?u.length:0,h=i.get(a);if(h===void 0||h.count!==f){let A=function(){C.dispose(),i.delete(a),a.removeEventListener("dispose",A)};h!==void 0&&h.texture.dispose();let d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,_=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],p=a.morphAttributes.normal||[],M=a.morphAttributes.color||[],T=0;d===!0&&(T=1),g===!0&&(T=2),_===!0&&(T=3);let x=a.attributes.position.count*T,S=1;x>e.maxTextureSize&&(S=Math.ceil(x/e.maxTextureSize),x=e.maxTextureSize);let E=new Float32Array(x*S*4*f),C=new Yl(E,x,S,f);C.type=Hi,C.needsUpdate=!0;let y=T*4;for(let R=0;R<f;R++){let D=m[R],U=p[R],G=M[R],N=x*S*4*R;for(let H=0;H<D.count;H++){let O=H*y;d===!0&&(r.fromBufferAttribute(D,H),E[N+O+0]=r.x,E[N+O+1]=r.y,E[N+O+2]=r.z,E[N+O+3]=0),g===!0&&(r.fromBufferAttribute(U,H),E[N+O+4]=r.x,E[N+O+5]=r.y,E[N+O+6]=r.z,E[N+O+7]=0),_===!0&&(r.fromBufferAttribute(G,H),E[N+O+8]=r.x,E[N+O+9]=r.y,E[N+O+10]=r.z,E[N+O+11]=G.itemSize===4?r.w:1)}}h={count:f,texture:C,size:new ot(x,S)},i.set(a,h),a.addEventListener("dispose",A)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let d=0;for(let _=0;_<c.length;_++)d+=c[_];let g=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(t,"morphTargetBaseInfluence",g),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",h.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",h.size)}return{update:s}}function sT(t,e,n,i,r){let s=new WeakMap;function o(c){let u=r.render.frame,f=c.geometry,h=e.get(c,f);if(s.get(h)!==u&&(e.update(h),s.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(n.update(c.instanceMatrix,t.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,t.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==u&&(d.update(),s.set(d,u))}return h}function a(){s=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),n.remove(u.instanceMatrix),u.instanceColor!==null&&n.remove(u.instanceColor)}return{update:o,dispose:a}}var oT={[bm]:"LINEAR_TONE_MAPPING",[Sm]:"REINHARD_TONE_MAPPING",[wm]:"CINEON_TONE_MAPPING",[Am]:"ACES_FILMIC_TONE_MAPPING",[Tm]:"AGX_TONE_MAPPING",[Rm]:"NEUTRAL_TONE_MAPPING",[Em]:"CUSTOM_TONE_MAPPING"};function aT(t,e,n,i,r,s){let o=new Tn(e,n,{type:t,depthBuffer:r,stencilBuffer:s,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new Mn;c.setAttribute("position",new Xt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new Xt([0,2,0,0,2,0],2));let u=new Hh({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new zt(c,u),h=new es(-1,1,1,-1,0,1),d=null,g=null,_=!1,m,p=null,M=[],T=!1;this.setSize=function(x,S){o.setSize(x,S),a!==null&&a.setSize(x,S),l!==null&&l.setSize(x,S);for(let E=0;E<M.length;E++){let C=M[E];C.setSize&&C.setSize(x,S)}},this.setEffects=function(x){M=x,T=M.length>0&&M[0].isRenderPass===!0;let S=o.width,E=o.height;M.length>0&&a===null&&(a=new Tn(S,E,{type:Kn,depthBuffer:!1,stencilBuffer:!1}),l=new Tn(S,E,{type:Kn,depthBuffer:!1,stencilBuffer:!1}));for(let C=0;C<M.length;C++){let y=M[C];y.setSize&&y.setSize(S,E)}},this.begin=function(x,S){if(_||x.toneMapping===Ri&&M.length===0)return!1;if(p=S,S!==null){let E=S.width,C=S.height;(o.width!==E||o.height!==C)&&this.setSize(E,C)}return T===!1&&x.setRenderTarget(o),m=x.toneMapping,x.toneMapping=Ri,!0},this.hasRenderPass=function(){return T},this.end=function(x,S){x.toneMapping=m,_=!0;let E=o,C=a;for(let y=0;y<M.length;y++){let A=M[y];A.enabled!==!1&&(A.render(x,C,E,S),A.needsSwap!==!1&&(E=C,C=C===a?l:a))}if(d!==x.outputColorSpace||g!==x.toneMapping){d=x.outputColorSpace,g=x.toneMapping,u.defines={},Mt.getTransfer(d)===kt&&(u.defines.SRGB_TRANSFER="");let y=oT[g];y&&(u.defines[y]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=E.texture,x.setRenderTarget(p),x.render(f,h),p=null,_=!1},this.isCompositing=function(){return _},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var Ny=new oi,e0=new Ls(1,1),Oy=new Yl,Fy=new Oh,Uy=new nc,my=[],gy=[],xy=new Float32Array(16),vy=new Float32Array(9),yy=new Float32Array(4);function Da(t,e,n){let i=t[0];if(i<=0||i>0)return t;let r=e*n,s=my[r];if(s===void 0&&(s=new Float32Array(r),my[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(s,a)}return s}function Ln(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Dn(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function td(t,e){let n=gy[e];n===void 0&&(n=new Int32Array(e),gy[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function lT(t,e){let n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function cT(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ln(n,e))return;t.uniform2fv(this.addr,e),Dn(n,e)}}function uT(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Ln(n,e))return;t.uniform3fv(this.addr,e),Dn(n,e)}}function hT(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ln(n,e))return;t.uniform4fv(this.addr,e),Dn(n,e)}}function fT(t,e){let n=this.cache,i=e.elements;if(i===void 0){if(Ln(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Dn(n,e)}else{if(Ln(n,i))return;yy.set(i),t.uniformMatrix2fv(this.addr,!1,yy),Dn(n,i)}}function dT(t,e){let n=this.cache,i=e.elements;if(i===void 0){if(Ln(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Dn(n,e)}else{if(Ln(n,i))return;vy.set(i),t.uniformMatrix3fv(this.addr,!1,vy),Dn(n,i)}}function pT(t,e){let n=this.cache,i=e.elements;if(i===void 0){if(Ln(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Dn(n,e)}else{if(Ln(n,i))return;xy.set(i),t.uniformMatrix4fv(this.addr,!1,xy),Dn(n,i)}}function mT(t,e){let n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function gT(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ln(n,e))return;t.uniform2iv(this.addr,e),Dn(n,e)}}function xT(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Ln(n,e))return;t.uniform3iv(this.addr,e),Dn(n,e)}}function vT(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ln(n,e))return;t.uniform4iv(this.addr,e),Dn(n,e)}}function yT(t,e){let n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function _T(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ln(n,e))return;t.uniform2uiv(this.addr,e),Dn(n,e)}}function MT(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Ln(n,e))return;t.uniform3uiv(this.addr,e),Dn(n,e)}}function bT(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ln(n,e))return;t.uniform4uiv(this.addr,e),Dn(n,e)}}function ST(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(e0.compareFunction=n.isReversedDepthBuffer()?qf:Yf,s=e0):s=Ny,n.setTexture2D(e||s,r)}function wT(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||Fy,r)}function AT(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||Uy,r)}function ET(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||Oy,r)}function TT(t){switch(t){case 5126:return lT;case 35664:return cT;case 35665:return uT;case 35666:return hT;case 35674:return fT;case 35675:return dT;case 35676:return pT;case 5124:case 35670:return mT;case 35667:case 35671:return gT;case 35668:case 35672:return xT;case 35669:case 35673:return vT;case 5125:return yT;case 36294:return _T;case 36295:return MT;case 36296:return bT;case 35678:case 36198:case 36298:case 36306:case 35682:return ST;case 35679:case 36299:case 36307:return wT;case 35680:case 36300:case 36308:case 36293:return AT;case 36289:case 36303:case 36311:case 36292:return ET}}function RT(t,e){t.uniform1fv(this.addr,e)}function CT(t,e){let n=Da(e,this.size,2);t.uniform2fv(this.addr,n)}function PT(t,e){let n=Da(e,this.size,3);t.uniform3fv(this.addr,n)}function IT(t,e){let n=Da(e,this.size,4);t.uniform4fv(this.addr,n)}function LT(t,e){let n=Da(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function DT(t,e){let n=Da(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function NT(t,e){let n=Da(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function OT(t,e){t.uniform1iv(this.addr,e)}function FT(t,e){t.uniform2iv(this.addr,e)}function UT(t,e){t.uniform3iv(this.addr,e)}function BT(t,e){t.uniform4iv(this.addr,e)}function kT(t,e){t.uniform1uiv(this.addr,e)}function zT(t,e){t.uniform2uiv(this.addr,e)}function VT(t,e){t.uniform3uiv(this.addr,e)}function GT(t,e){t.uniform4uiv(this.addr,e)}function HT(t,e,n){let i=this.cache,r=e.length,s=td(n,r);Ln(i,s)||(t.uniform1iv(this.addr,s),Dn(i,s));let o;this.type===t.SAMPLER_2D_SHADOW?o=e0:o=Ny;for(let a=0;a!==r;++a)n.setTexture2D(e[a]||o,s[a])}function WT(t,e,n){let i=this.cache,r=e.length,s=td(n,r);Ln(i,s)||(t.uniform1iv(this.addr,s),Dn(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||Fy,s[o])}function XT(t,e,n){let i=this.cache,r=e.length,s=td(n,r);Ln(i,s)||(t.uniform1iv(this.addr,s),Dn(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||Uy,s[o])}function $T(t,e,n){let i=this.cache,r=e.length,s=td(n,r);Ln(i,s)||(t.uniform1iv(this.addr,s),Dn(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||Oy,s[o])}function YT(t){switch(t){case 5126:return RT;case 35664:return CT;case 35665:return PT;case 35666:return IT;case 35674:return LT;case 35675:return DT;case 35676:return NT;case 5124:case 35670:return OT;case 35667:case 35671:return FT;case 35668:case 35672:return UT;case 35669:case 35673:return BT;case 5125:return kT;case 36294:return zT;case 36295:return VT;case 36296:return GT;case 35678:case 36198:case 36298:case 36306:case 35682:return HT;case 35679:case 36299:case 36307:return WT;case 35680:case 36300:case 36308:case 36293:return XT;case 36289:case 36303:case 36311:case 36292:return $T}}var t0=class{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=TT(n.type)}},n0=class{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=YT(n.type)}},i0=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){let r=this.seq;for(let s=0,o=r.length;s!==o;++s){let a=r[s];a.setValue(e,n[a.id],i)}}},Jm=/(\w+)(\])?(\[|\.)?/g;function _y(t,e){t.seq.push(e),t.map[e.id]=e}function qT(t,e,n){let i=t.name,r=i.length;for(Jm.lastIndex=0;;){let s=Jm.exec(i),o=Jm.lastIndex,a=s[1],l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){_y(n,c===void 0?new t0(a,t,e):new n0(a,t,e));break}else{let f=n.map[a];f===void 0&&(f=new i0(a),_y(n,f)),n=f}}}var La=class{constructor(e,n){this.seq=[],this.map={};let i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=e.getActiveUniform(n,o),l=e.getUniformLocation(n,a.name);qT(a,l,this)}let r=[],s=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(e,n,i,r){let s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){let r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){let a=n[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,n){let i=[];for(let r=0,s=e.length;r!==s;++r){let o=e[r];o.id in n&&i.push(o)}return i}};function My(t,e,n){let i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}var jT=37297,ZT=0;function KT(t,e){let n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}var by=new ht;function JT(t){Mt._getMatrix(by,Mt.workingColorSpace,t);let e=`mat3( ${by.elements.map(n=>n.toFixed(4))} )`;switch(Mt.getTransfer(t)){case Hl:return[e,"LinearTransferOETF"];case kt:return[e,"sRGBTransferOETF"];default:return it("WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function Sy(t,e,n){let i=t.getShaderParameter(e,t.COMPILE_STATUS),s=(t.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";let o=/ERROR: 0:(\d+)/.exec(s);if(o){let a=parseInt(o[1]);return n.toUpperCase()+`

`+s+`

`+KT(t.getShaderSource(e),a)}else return s}function QT(t,e){let n=JT(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}var eR={[bm]:"Linear",[Sm]:"Reinhard",[wm]:"Cineon",[Am]:"ACESFilmic",[Tm]:"AgX",[Rm]:"Neutral",[Em]:"Custom"};function tR(t,e){let n=eR[e];return n===void 0?(it("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+t+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}var Zf=new P;function nR(){Mt.getLuminanceCoefficients(Zf);let t=Zf.x.toFixed(4),e=Zf.y.toFixed(4),n=Zf.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function iR(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Mc).join(`
`)}function rR(t){let e=[];for(let n in t){let i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function sR(t,e){let n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){let s=t.getActiveAttrib(e,r),o=s.name,a=1;s.type===t.FLOAT_MAT2&&(a=2),s.type===t.FLOAT_MAT3&&(a=3),s.type===t.FLOAT_MAT4&&(a=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function Mc(t){return t!==""}function wy(t,e){let n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Ay(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var oR=/^[ \t]*#include +<([\w\d./]+)>/gm;function r0(t){return t.replace(oR,lR)}var aR=new Map;function lR(t,e){let n=vt[e];if(n===void 0){let i=aR.get(e);if(i!==void 0)n=vt[i],it('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return r0(n)}var cR=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Ey(t){return t.replace(cR,uR)}function uR(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Ty(t){let e=`precision ${t.precision} float;
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
#define LOW_PRECISION`),e}var hR={[cc]:"SHADOWMAP_TYPE_PCF",[Ea]:"SHADOWMAP_TYPE_VSM"};function fR(t){return hR[t.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var dR={[Fs]:"ENVMAP_TYPE_CUBE",[bo]:"ENVMAP_TYPE_CUBE",[hc]:"ENVMAP_TYPE_CUBE_UV"};function pR(t){return t.envMap===!1?"ENVMAP_TYPE_CUBE":dR[t.envMapMode]||"ENVMAP_TYPE_CUBE"}var mR={[bo]:"ENVMAP_MODE_REFRACTION"};function gR(t){return t.envMap===!1?"ENVMAP_MODE_REFLECTION":mR[t.envMapMode]||"ENVMAP_MODE_REFLECTION"}var xR={[Mm]:"ENVMAP_BLENDING_MULTIPLY",[Xv]:"ENVMAP_BLENDING_MIX",[$v]:"ENVMAP_BLENDING_ADD"};function vR(t){return t.envMap===!1?"ENVMAP_BLENDING_NONE":xR[t.combine]||"ENVMAP_BLENDING_NONE"}function yR(t){let e=t.envMapCubeUVHeight;if(e===null)return null;let n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function _R(t,e,n,i){let r=t.getContext(),s=n.defines,o=n.vertexShader,a=n.fragmentShader,l=fR(n),c=pR(n),u=gR(n),f=vR(n),h=yR(n),d=iR(n),g=rR(s),_=r.createProgram(),m,p,M=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(Mc).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(Mc).join(`
`),p.length>0&&(p+=`
`)):(m=[Ty(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Mc).join(`
`),p=[Ty(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.retroreflection?"#define USE_RETROREFLECTION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Ri?"#define TONE_MAPPING":"",n.toneMapping!==Ri?vt.tonemapping_pars_fragment:"",n.toneMapping!==Ri?tR("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",vt.colorspace_pars_fragment,QT("linearToOutputTexel",n.outputColorSpace),nR(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Mc).join(`
`)),o=r0(o),o=wy(o,n),o=Ay(o,n),a=r0(a),a=wy(a,n),a=Ay(a,n),o=Ey(o),a=Ey(a),n.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",n.glslVersion===Bm?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Bm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let T=M+m+o,x=M+p+a,S=My(r,r.VERTEX_SHADER,T),E=My(r,r.FRAGMENT_SHADER,x);r.attachShader(_,S),r.attachShader(_,E),n.index0AttributeName!==void 0?r.bindAttribLocation(_,0,n.index0AttributeName):n.hasPositionAttribute===!0&&r.bindAttribLocation(_,0,"position"),r.linkProgram(_);function C(D){if(t.debug.checkShaderErrors){let U=r.getProgramInfoLog(_)||"",G=r.getShaderInfoLog(S)||"",N=r.getShaderInfoLog(E)||"",H=U.trim(),O=G.trim(),k=N.trim(),q=!0,j=!0;if(r.getProgramParameter(_,r.LINK_STATUS)===!1)if(q=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,_,S,E);else{let J=Sy(r,S,"vertex"),ne=Sy(r,E,"fragment");rt("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(_,r.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+H+`
`+J+`
`+ne)}else H!==""?it("WebGLProgram: Program Info Log:",H):(O===""||k==="")&&(j=!1);j&&(D.diagnostics={runnable:q,programLog:H,vertexShader:{log:O,prefix:m},fragmentShader:{log:k,prefix:p}})}r.deleteShader(S),r.deleteShader(E),y=new La(r,_),A=sR(r,_)}let y;this.getUniforms=function(){return y===void 0&&C(this),y};let A;this.getAttributes=function(){return A===void 0&&C(this),A};let R=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return R===!1&&(R=r.getProgramParameter(_,jT)),R},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(_),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=ZT++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=S,this.fragmentShader=E,this}var MR=0,s0=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,n,i){let r=this._getShaderCacheForMaterial(e);return r.has(n)===!1&&(r.add(n),n.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){let n=this.materialCache.get(e);for(let i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let n=this.materialCache,i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){let n=this.shaderCache,i=n.get(e);return i===void 0&&(i=new o0(e),n.set(e,i)),i}},o0=class{constructor(e){this.id=MR++,this.code=e,this.usedTimes=0}};function bR(t){return t===ks||t===xc||t===vc}function SR(t,e,n,i,r,s){let o=new Ma,a=new s0,l=new Set,c=[],u=new Map,f=i.logarithmicDepthBuffer,h=i.precision,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(y){return l.add(y),y===0?"uv":`uv${y}`}function _(y,A,R,D,U,G){let N=D.fog,H=U.geometry,O=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?D.environment:null,k=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,q=e.get(y.envMap||O,k),j=q&&q.mapping===hc?q.image.height:null,J=d[y.type];y.precision!==null&&(h=i.getMaxPrecision(y.precision),h!==y.precision&&it("WebGLProgram.getParameters:",y.precision,"not supported, using",h,"instead."));let ne=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Ue=ne!==void 0?ne.length:0,Pe=0;H.morphAttributes.position!==void 0&&(Pe=1),H.morphAttributes.normal!==void 0&&(Pe=2),H.morphAttributes.color!==void 0&&(Pe=3);let lt,Ve,et,$;if(J){let rn=Tr[J];lt=rn.vertexShader,Ve=rn.fragmentShader}else{lt=y.vertexShader,Ve=y.fragmentShader;let rn=a.getVertexShaderStage(y),Ft=a.getFragmentShaderStage(y);a.update(y,rn,Ft),et=rn.id,$=Ft.id}let ee=t.getRenderTarget(),Me=t.state.buffers.depth.getReversed(),Ze=U.isInstancedMesh===!0,be=U.isBatchedMesh===!0,re=!!y.map,ue=!!y.matcap,Te=!!q,Ge=!!y.aoMap,mt=!!y.lightMap,Se=!!y.bumpMap&&y.wireframe===!1,we=!!y.normalMap,tt=!!y.displacementMap,$t=!!y.emissiveMap,Ht=!!y.metalnessMap,Wt=!!y.roughnessMap,F=y.anisotropy>0,wn=y.clearcoat>0,yt=y.dispersion>0,I=y.retroreflectivity>0,v=y.iridescence>0,w=y.sheen>0,L=y.transmission>0,V=F&&!!y.anisotropyMap,oe=wn&&!!y.clearcoatMap,ge=wn&&!!y.clearcoatNormalMap,Z=wn&&!!y.clearcoatRoughnessMap,Q=v&&!!y.iridescenceMap,ye=v&&!!y.iridescenceThicknessMap,Be=w&&!!y.sheenColorMap,se=w&&!!y.sheenRoughnessMap,me=!!y.specularMap,Ae=!!y.specularColorMap,We=!!y.specularIntensityMap,ft=L&&!!y.transmissionMap,z=L&&!!y.thicknessMap,Re=!!y.gradientMap,ie=!!y.alphaMap,Ie=y.alphaTest>0,Oe=!!y.alphaHash,ce=!!y.extensions,qe=Ri;y.toneMapped&&(ee===null||ee.isXRRenderTarget===!0)&&(qe=t.toneMapping);let He={shaderID:J,shaderType:y.type,shaderName:y.name,vertexShader:lt,fragmentShader:Ve,defines:y.defines,customVertexShaderID:et,customFragmentShaderID:$,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:h,batching:be,batchingColor:be&&U._colorsTexture!==null,instancing:Ze,instancingColor:Ze&&U.instanceColor!==null,instancingMorph:Ze&&U.morphTexture!==null,outputColorSpace:ee===null?t.outputColorSpace:ee.isXRRenderTarget===!0?ee.texture.colorSpace:Mt.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:re,matcap:ue,envMap:Te,envMapMode:Te&&q.mapping,envMapCubeUVHeight:j,aoMap:Ge,lightMap:mt,bumpMap:Se,normalMap:we,displacementMap:tt,emissiveMap:$t,normalMapObjectSpace:we&&y.normalMapType===jv,normalMapTangentSpace:we&&y.normalMapType===Fm,packedNormalMap:we&&y.normalMapType===Fm&&bR(y.normalMap.format),metalnessMap:Ht,roughnessMap:Wt,anisotropy:F,anisotropyMap:V,clearcoat:wn,clearcoatMap:oe,clearcoatNormalMap:ge,clearcoatRoughnessMap:Z,dispersion:yt,retroreflection:I,iridescence:v,iridescenceMap:Q,iridescenceThicknessMap:ye,sheen:w,sheenColorMap:Be,sheenRoughnessMap:se,specularMap:me,specularColorMap:Ae,specularIntensityMap:We,transmission:L,transmissionMap:ft,thicknessMap:z,gradientMap:Re,opaque:y.transparent===!1&&y.blending===ar&&y.alphaToCoverage===!1,alphaMap:ie,alphaTest:Ie,alphaHash:Oe,combine:y.combine,mapUv:re&&g(y.map.channel),aoMapUv:Ge&&g(y.aoMap.channel),lightMapUv:mt&&g(y.lightMap.channel),bumpMapUv:Se&&g(y.bumpMap.channel),normalMapUv:we&&g(y.normalMap.channel),displacementMapUv:tt&&g(y.displacementMap.channel),emissiveMapUv:$t&&g(y.emissiveMap.channel),metalnessMapUv:Ht&&g(y.metalnessMap.channel),roughnessMapUv:Wt&&g(y.roughnessMap.channel),anisotropyMapUv:V&&g(y.anisotropyMap.channel),clearcoatMapUv:oe&&g(y.clearcoatMap.channel),clearcoatNormalMapUv:ge&&g(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Z&&g(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Q&&g(y.iridescenceMap.channel),iridescenceThicknessMapUv:ye&&g(y.iridescenceThicknessMap.channel),sheenColorMapUv:Be&&g(y.sheenColorMap.channel),sheenRoughnessMapUv:se&&g(y.sheenRoughnessMap.channel),specularMapUv:me&&g(y.specularMap.channel),specularColorMapUv:Ae&&g(y.specularColorMap.channel),specularIntensityMapUv:We&&g(y.specularIntensityMap.channel),transmissionMapUv:ft&&g(y.transmissionMap.channel),thicknessMapUv:z&&g(y.thicknessMap.channel),alphaMapUv:ie&&g(y.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(we||F),vertexNormals:!!H.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!H.attributes.uv&&(re||ie),fog:!!N,useFog:y.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||H.attributes.normal===void 0&&we===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Me,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:H.attributes.position!==void 0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:Ue,morphTextureStride:Pe,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:G.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:y.dithering,shadowMapEnabled:t.shadowMap.enabled&&R.length>0,shadowMapType:t.shadowMap.type,toneMapping:qe,decodeVideoTexture:re&&y.map.isVideoTexture===!0&&Mt.getTransfer(y.map.colorSpace)===kt,decodeVideoTextureEmissive:$t&&y.emissiveMap.isVideoTexture===!0&&Mt.getTransfer(y.emissiveMap.colorSpace)===kt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===Ar,flipSided:y.side===li,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:ce&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ce&&y.extensions.multiDraw===!0||be)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return He.vertexUv1s=l.has(1),He.vertexUv2s=l.has(2),He.vertexUv3s=l.has(3),l.clear(),He}function m(y){let A=[];if(y.shaderID?A.push(y.shaderID):(A.push(y.customVertexShaderID),A.push(y.customFragmentShaderID)),y.defines!==void 0)for(let R in y.defines)A.push(R),A.push(y.defines[R]);return y.isRawShaderMaterial===!1&&(p(A,y),M(A,y),A.push(t.outputColorSpace)),A.push(y.customProgramCacheKey),A.join()}function p(y,A){y.push(A.precision),y.push(A.outputColorSpace),y.push(A.envMapMode),y.push(A.envMapCubeUVHeight),y.push(A.mapUv),y.push(A.alphaMapUv),y.push(A.lightMapUv),y.push(A.aoMapUv),y.push(A.bumpMapUv),y.push(A.normalMapUv),y.push(A.displacementMapUv),y.push(A.emissiveMapUv),y.push(A.metalnessMapUv),y.push(A.roughnessMapUv),y.push(A.anisotropyMapUv),y.push(A.clearcoatMapUv),y.push(A.clearcoatNormalMapUv),y.push(A.clearcoatRoughnessMapUv),y.push(A.iridescenceMapUv),y.push(A.iridescenceThicknessMapUv),y.push(A.sheenColorMapUv),y.push(A.sheenRoughnessMapUv),y.push(A.specularMapUv),y.push(A.specularColorMapUv),y.push(A.specularIntensityMapUv),y.push(A.transmissionMapUv),y.push(A.thicknessMapUv),y.push(A.combine),y.push(A.fogExp2),y.push(A.sizeAttenuation),y.push(A.morphTargetsCount),y.push(A.morphAttributeCount),y.push(A.numSunLights),y.push(A.numDirLights),y.push(A.numPointLights),y.push(A.numSpotLights),y.push(A.numSpotLightMaps),y.push(A.numHemiLights),y.push(A.numRectAreaLights),y.push(A.numSunLightShadows),y.push(A.numDirLightShadows),y.push(A.numPointLightShadows),y.push(A.numSpotLightShadows),y.push(A.numSpotLightShadowsWithMaps),y.push(A.numLightProbes),y.push(A.shadowMapType),y.push(A.toneMapping),y.push(A.numClippingPlanes),y.push(A.numClipIntersection),y.push(A.depthPacking)}function M(y,A){o.disableAll(),A.instancing&&o.enable(0),A.instancingColor&&o.enable(1),A.instancingMorph&&o.enable(2),A.matcap&&o.enable(3),A.envMap&&o.enable(4),A.normalMapObjectSpace&&o.enable(5),A.normalMapTangentSpace&&o.enable(6),A.clearcoat&&o.enable(7),A.iridescence&&o.enable(8),A.alphaTest&&o.enable(9),A.vertexColors&&o.enable(10),A.vertexAlphas&&o.enable(11),A.vertexUv1s&&o.enable(12),A.vertexUv2s&&o.enable(13),A.vertexUv3s&&o.enable(14),A.vertexTangents&&o.enable(15),A.anisotropy&&o.enable(16),A.alphaHash&&o.enable(17),A.batching&&o.enable(18),A.dispersion&&o.enable(19),A.retroreflection&&o.enable(24),A.batchingColor&&o.enable(20),A.gradientMap&&o.enable(21),A.packedNormalMap&&o.enable(22),A.vertexNormals&&o.enable(23),y.push(o.mask),o.disableAll(),A.fog&&o.enable(0),A.useFog&&o.enable(1),A.flatShading&&o.enable(2),A.logarithmicDepthBuffer&&o.enable(3),A.reversedDepthBuffer&&o.enable(4),A.skinning&&o.enable(5),A.morphTargets&&o.enable(6),A.morphNormals&&o.enable(7),A.morphColors&&o.enable(8),A.premultipliedAlpha&&o.enable(9),A.shadowMapEnabled&&o.enable(10),A.doubleSided&&o.enable(11),A.flipSided&&o.enable(12),A.useDepthPacking&&o.enable(13),A.dithering&&o.enable(14),A.transmission&&o.enable(15),A.sheen&&o.enable(16),A.opaque&&o.enable(17),A.pointsUvs&&o.enable(18),A.decodeVideoTexture&&o.enable(19),A.decodeVideoTextureEmissive&&o.enable(20),A.alphaToCoverage&&o.enable(21),A.numLightProbeGrids>0&&o.enable(22),A.hasPositionAttribute&&o.enable(23),y.push(o.mask)}function T(y){let A=d[y.type],R;if(A){let D=Tr[A];R=ly.clone(D.uniforms)}else R=y.uniforms;return R}function x(y,A){let R=u.get(A);return R!==void 0?++R.usedTimes:(R=new _R(t,A,y,r),c.push(R),u.set(A,R)),R}function S(y){if(--y.usedTimes===0){let A=c.indexOf(y);c[A]=c[c.length-1],c.pop(),u.delete(y.cacheKey),y.destroy()}}function E(y){a.remove(y)}function C(){a.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:T,acquireProgram:x,releaseProgram:S,releaseShaderCache:E,programs:c,dispose:C}}function wR(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let a=t.get(o);return a===void 0&&(a={},t.set(o,a)),a}function i(o){t.delete(o)}function r(o,a,l){t.get(o)[a]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function AR(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.materialVariant!==e.materialVariant?t.materialVariant-e.materialVariant:t.z!==e.z?t.z-e.z:t.id-e.id}function Ry(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function Cy(){let t=[],e=0,n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(h){let d=0;return h.isInstancedMesh&&(d+=2),h.isSkinnedMesh&&(d+=1),d}function a(h,d,g,_,m,p){let M=t[e];return M===void 0?(M={id:h.id,object:h,geometry:d,material:g,materialVariant:o(h),groupOrder:_,renderOrder:h.renderOrder,z:m,group:p},t[e]=M):(M.id=h.id,M.object=h,M.geometry=d,M.material=g,M.materialVariant=o(h),M.groupOrder=_,M.renderOrder=h.renderOrder,M.z=m,M.group=p),e++,M}function l(h,d,g,_,m,p,M){M.reversedDepth===!0&&(m=-m);let T=a(h,d,g,_,m,p);g.transmission>0?i.push(T):g.transparent===!0?r.push(T):n.push(T)}function c(h,d,g,_,m,p){let M=a(h,d,g,_,m,p);g.transmission>0?i.unshift(M):g.transparent===!0?r.unshift(M):n.unshift(M)}function u(h,d){n.length>1&&n.sort(h||AR),i.length>1&&i.sort(d||Ry),r.length>1&&r.sort(d||Ry)}function f(){for(let h=e,d=t.length;h<d;h++){let g=t[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:l,unshift:c,finish:f,sort:u}}function ER(){let t=new WeakMap;function e(i,r){let s=t.get(i),o;return s===void 0?(o=new Cy,t.set(i,[o])):r>=s.length?(o=new Cy,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function TR(){let t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"SunLight":case"DirectionalLight":n={direction:new P,color:new St};break;case"SpotLight":n={position:new P,direction:new P,color:new St,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new P,color:new St,distance:0,decay:0};break;case"HemisphereLight":n={direction:new P,skyColor:new St,groundColor:new St};break;case"RectAreaLight":n={color:new St,position:new P,halfWidth:new P,halfHeight:new P};break}return t[e.id]=n,n}}}function RR(){let t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"SunLight":case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}var CR=0;function PR(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function IR(t){let e=new TR,n=RR(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new P);let r=new P,s=new At,o=new At;function a(c){let u=0,f=0,h=0;for(let U=0;U<9;U++)i.probe[U].set(0,0,0);let d=0,g=0,_=0,m=0,p=0,M=0,T=0,x=0,S=0,E=0,C=0,y=0,A=0,R=0;c.sort(PR);for(let U=0,G=c.length;U<G;U++){let N=c[U],H=N.color,O=N.intensity,k=N.distance,q=null;if(N.shadow&&N.shadow.map&&(N.shadow.map.texture.format===ks?q=N.shadow.map.texture:q=N.shadow.map.depthTexture||N.shadow.map.texture),N.isAmbientLight)u+=H.r*O,f+=H.g*O,h+=H.b*O;else if(N.isLightProbe){for(let j=0;j<9;j++)i.probe[j].addScaledVector(N.sh.coefficients[j],O);R++}else if(N.isSunLight){let j=e.get(N);if(j.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let J=N.shadow,ne=n.get(N);ne.shadowIntensity=J.intensity,ne.shadowBias=J.bias,ne.shadowNormalBias=J.normalBias,ne.shadowRadius=J.radius,ne.shadowMapSize.copy(J.mapSize).multiply(J.getFrameExtents()),i.sunShadow[g]=ne,i.sunShadowMap[g]=q;let Ue=J.getViewportCount();for(let Pe=0;Pe<Ue;Pe++)i.sunShadowMatrix[_+Pe]=J.getMatrix(Pe),i.sunShadowCascade[_+Pe]=J._cascadeData[Pe];_+=Ue,g++}i.sun[d]=j,d++}else if(N.isDirectionalLight){let j=e.get(N);if(j.color.copy(N.color).multiplyScalar(N.intensity),N.castShadow){let J=N.shadow,ne=n.get(N);ne.shadowIntensity=J.intensity,ne.shadowBias=J.bias,ne.shadowNormalBias=J.normalBias,ne.shadowRadius=J.radius,ne.shadowMapSize=J.mapSize,i.directionalShadow[m]=ne,i.directionalShadowMap[m]=q,i.directionalShadowMatrix[m]=N.shadow.matrix,S++}i.directional[m]=j,m++}else if(N.isSpotLight){let j=e.get(N);j.position.setFromMatrixPosition(N.matrixWorld),j.color.copy(H).multiplyScalar(O),j.distance=k,j.coneCos=Math.cos(N.angle),j.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),j.decay=N.decay,i.spot[M]=j;let J=N.shadow;if(N.map&&(i.spotLightMap[y]=N.map,y++,J.updateMatrices(N),N.castShadow&&A++),i.spotLightMatrix[M]=J.matrix,N.castShadow){let ne=n.get(N);ne.shadowIntensity=J.intensity,ne.shadowBias=J.bias,ne.shadowNormalBias=J.normalBias,ne.shadowRadius=J.radius,ne.shadowMapSize=J.mapSize,i.spotShadow[M]=ne,i.spotShadowMap[M]=q,C++}M++}else if(N.isRectAreaLight){let j=e.get(N);j.color.copy(H).multiplyScalar(O),j.halfWidth.set(N.width*.5,0,0),j.halfHeight.set(0,N.height*.5,0),i.rectArea[T]=j,T++}else if(N.isPointLight){let j=e.get(N);if(j.color.copy(N.color).multiplyScalar(N.intensity),j.distance=N.distance,j.decay=N.decay,N.castShadow){let J=N.shadow,ne=n.get(N);ne.shadowIntensity=J.intensity,ne.shadowBias=J.bias,ne.shadowNormalBias=J.normalBias,ne.shadowRadius=J.radius,ne.shadowMapSize=J.mapSize,ne.shadowCameraNear=J.camera.near,ne.shadowCameraFar=J.camera.far,i.pointShadow[p]=ne,i.pointShadowMap[p]=q,i.pointShadowMatrix[p]=N.shadow.matrix,E++}i.point[p]=j,p++}else if(N.isHemisphereLight){let j=e.get(N);j.skyColor.copy(N.color).multiplyScalar(O),j.groundColor.copy(N.groundColor).multiplyScalar(O),i.hemi[x]=j,x++}}T>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=De.LTC_FLOAT_1,i.rectAreaLTC2=De.LTC_FLOAT_2):(i.rectAreaLTC1=De.LTC_HALF_1,i.rectAreaLTC2=De.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=h;let D=i.hash;(D.sunLength!==d||D.directionalLength!==m||D.pointLength!==p||D.spotLength!==M||D.rectAreaLength!==T||D.hemiLength!==x||D.numSunShadows!==g||D.numDirectionalShadows!==S||D.numPointShadows!==E||D.numSpotShadows!==C||D.numSpotMaps!==y||D.numLightProbes!==R)&&(i.sun.length=d,i.directional.length=m,i.spot.length=M,i.rectArea.length=T,i.point.length=p,i.hemi.length=x,i.sunShadow.length=g,i.sunShadowMap.length=g,i.sunShadowMatrix.length=_,i.sunShadowCascade.length=_,i.directionalShadow.length=S,i.directionalShadowMap.length=S,i.directionalShadowMatrix.length=S,i.pointShadow.length=E,i.pointShadowMap.length=E,i.pointShadowMatrix.length=E,i.spotShadow.length=C,i.spotShadowMap.length=C,i.spotLightMatrix.length=C+y-A,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=R,D.sunLength=d,D.directionalLength=m,D.pointLength=p,D.spotLength=M,D.rectAreaLength=T,D.hemiLength=x,D.numSunShadows=g,D.numDirectionalShadows=S,D.numPointShadows=E,D.numSpotShadows=C,D.numSpotMaps=y,D.numLightProbes=R,i.version=CR++)}function l(c,u){let f=0,h=0,d=0,g=0,_=0,m=0,p=u.matrixWorldInverse;for(let M=0,T=c.length;M<T;M++){let x=c[M];if(x.isSunLight){let S=i.sun[f];S.direction.setFromMatrixPosition(x.matrixWorld),S.direction.transformDirection(p),f++}else if(x.isDirectionalLight){let S=i.directional[h];S.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(p),h++}else if(x.isSpotLight){let S=i.spot[g];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(x.matrixWorld),r.setFromMatrixPosition(x.target.matrixWorld),S.direction.sub(r),S.direction.transformDirection(p),g++}else if(x.isRectAreaLight){let S=i.rectArea[_];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(p),o.identity(),s.copy(x.matrixWorld),s.premultiply(p),o.extractRotation(s),S.halfWidth.set(x.width*.5,0,0),S.halfHeight.set(0,x.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),_++}else if(x.isPointLight){let S=i.point[d];S.position.setFromMatrixPosition(x.matrixWorld),S.position.applyMatrix4(p),d++}else if(x.isHemisphereLight){let S=i.hemi[m];S.direction.setFromMatrixPosition(x.matrixWorld),S.direction.transformDirection(p),m++}}}return{setup:a,setupView:l,state:i}}function Py(t){let e=new IR(t),n=[],i=[],r=[];function s(h){f.camera=h,n.length=0,i.length=0,r.length=0}function o(h){n.push(h)}function a(h){i.push(h)}function l(h){r.push(h)}function c(){e.setup(n)}function u(h){e.setupView(n,h)}let f={lightsArray:n,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:f,setupLights:c,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function LR(t){let e=new WeakMap;function n(r,s=0){let o=e.get(r),a;return o===void 0?(a=new Py(t),e.set(r,[a])):s>=o.length?(a=new Py(t),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:n,dispose:i}}var DR=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,NR=`uniform sampler2D shadow_pass;
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
}`,OR=[new P(1,0,0),new P(-1,0,0),new P(0,1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1)],FR=[new P(0,-1,0),new P(0,-1,0),new P(0,0,1),new P(0,0,-1),new P(0,-1,0),new P(0,-1,0)],Iy=new At,_c=new P,Qm=new P;function UR(t,e,n){let i=new Ql,r=new ot,s=new ot,o=new tn,a=new Wh,l=new Xh,c={},u=n.maxTextureSize,f={[wr]:li,[li]:wr,[Ar]:Ar},h=new Lt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:DR,fragmentShader:NR}),d=h.clone();d.defines.HORIZONTAL_PASS=1;let g=new Mn;g.setAttribute("position",new Zt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new zt(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=cc;let p=this.type;this.render=function(E,C,y){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||E.length===0)return;this.type===Rv&&(it("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=cc);let A=t.getRenderTarget(),R=t.getActiveCubeFace(),D=t.getActiveMipmapLevel(),U=t.state;U.setBlending(gi),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);let G=p!==this.type;G&&C.traverse(function(N){N.material&&(Array.isArray(N.material)?N.material.forEach(H=>H.needsUpdate=!0):N.material.needsUpdate=!0)});for(let N=0,H=E.length;N<H;N++){let O=E[N],k=O.shadow;if(k===void 0){it("WebGLShadowMap:",O,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;r.copy(k.mapSize);let q=k.getFrameExtents();r.multiply(q),s.copy(k.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/q.x),r.x=s.x*q.x,k.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/q.y),r.y=s.y*q.y,k.mapSize.y=s.y));let j=t.state.buffers.depth.getReversed();if(k.camera._reversedDepth=j,k.map===null||G===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===Ea){if(O.isPointLight){it("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new Tn(r.x,r.y,{format:ks,type:Kn,minFilter:Et,magFilter:Et,generateMipmaps:!1}),k.map.texture.name=O.name+".shadowMap",k.map.depthTexture=new Ls(r.x,r.y,Hi),k.map.depthTexture.name=O.name+".shadowMapDepth",k.map.depthTexture.format=_r,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Bn,k.map.depthTexture.magFilter=Bn}else O.isPointLight?(k.map=new Jf(r.x),k.map.depthTexture=new Gh(r.x,lr)):(k.map=new Tn(r.x,r.y),k.map.depthTexture=new Ls(r.x,r.y,lr)),k.map.depthTexture.name=O.name+".shadowMap",k.map.depthTexture.format=_r,this.type===cc?(k.map.depthTexture.compareFunction=j?qf:Yf,k.map.depthTexture.minFilter=Et,k.map.depthTexture.magFilter=Et):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Bn,k.map.depthTexture.magFilter=Bn);k.camera.updateProjectionMatrix()}k.map.isWebGLCubeRenderTarget!==!0&&(k.map.width!==r.x||k.map.height!==r.y)&&k.map.setSize(r.x,r.y);let J=k.map.isWebGLCubeRenderTarget?6:k.getViewportCount();O.isPointLight!==!0&&k.updateMatrices(O,y);for(let ne=0;ne<J;ne++){let Ue=k.getCamera(ne);if(O.isPointLight){let Pe=k.camera,lt=k.matrix,Ve=O.distance||Pe.far;Ve!==Pe.far&&(Pe.far=Ve,Pe.updateProjectionMatrix()),_c.setFromMatrixPosition(O.matrixWorld),Pe.position.copy(_c),Qm.copy(Pe.position),Qm.add(OR[ne]),Pe.up.copy(FR[ne]),Pe.lookAt(Qm),Pe.updateMatrixWorld(),lt.makeTranslation(-_c.x,-_c.y,-_c.z),Iy.multiplyMatrices(Pe.projectionMatrix,Pe.matrixWorldInverse),k._frustum.setFromProjectionMatrix(Iy,Pe.coordinateSystem,Pe.reversedDepth)}if(k.map.isWebGLCubeRenderTarget)t.setRenderTarget(k.map,ne),t.clear();else{ne===0&&(t.setRenderTarget(k.map),t.clear());let Pe=k.getViewport(ne);o.set(s.x*Pe.x,s.y*Pe.y,s.x*Pe.z,s.y*Pe.w),U.viewport(o)}i=k.getFrustum(ne),x(C,y,Ue,O,this.type)}k.isPointLightShadow!==!0&&this.type===Ea&&M(k,y),k.needsUpdate=!1}p=this.type,m.needsUpdate=!1,t.setRenderTarget(A,R,D)};function M(E,C){let y=e.update(_);h.defines.VSM_SAMPLES!==E.blurSamples&&(h.defines.VSM_SAMPLES=E.blurSamples,d.defines.VSM_SAMPLES=E.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),E.mapPass===null?E.mapPass=new Tn(r.x,r.y,{format:ks,type:Kn}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),h.uniforms.shadow_pass.value=E.map.depthTexture,h.uniforms.resolution.value.set(E.map.width,E.map.height),h.uniforms.radius.value=E.radius,t.setRenderTarget(E.mapPass),t.clear(),t.renderBufferDirect(C,null,y,h,_,null),d.uniforms.shadow_pass.value=E.mapPass.texture,d.uniforms.resolution.value.set(E.map.width,E.map.height),d.uniforms.radius.value=E.radius,t.setRenderTarget(E.map),t.clear(),t.renderBufferDirect(C,null,y,d,_,null)}function T(E,C,y,A){let R=null,D=y.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(D!==void 0)R=D;else if(R=y.isPointLight===!0?l:a,t.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0||C.alphaToCoverage===!0){let U=R.uuid,G=C.uuid,N=c[U];N===void 0&&(N={},c[U]=N);let H=N[G];H===void 0&&(H=R.clone(),N[G]=H,C.addEventListener("dispose",S)),R=H}if(R.visible=C.visible,R.wireframe=C.wireframe,A===Ea?R.side=C.shadowSide!==null?C.shadowSide:C.side:R.side=C.shadowSide!==null?C.shadowSide:f[C.side],R.alphaMap=C.alphaMap,R.alphaTest=C.alphaToCoverage===!0?.5:C.alphaTest,R.map=C.map,R.clipShadows=C.clipShadows,R.clippingPlanes=C.clippingPlanes,R.clipIntersection=C.clipIntersection,R.displacementMap=C.displacementMap,R.displacementScale=C.displacementScale,R.displacementBias=C.displacementBias,R.wireframeLinewidth=C.wireframeLinewidth,R.linewidth=C.linewidth,y.isPointLight===!0&&R.isMeshDistanceMaterial===!0){let U=t.properties.get(R);U.light=y}return R}function x(E,C,y,A,R){if(E.visible===!1)return;if(E.layers.test(C.layers)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&R===Ea)&&(!E.frustumCulled||E.intersectsFrustum(i))){E.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,E.matrixWorld);let G=e.update(E),N=E.material;if(Array.isArray(N)){let H=G.groups;for(let O=0,k=H.length;O<k;O++){let q=H[O],j=N[q.materialIndex];if(j&&j.visible){let J=T(E,j,A,R);E.onBeforeShadow(t,E,C,y,G,J,q),t.renderBufferDirect(y,null,G,J,E,q),E.onAfterShadow(t,E,C,y,G,J,q)}}}else if(N.visible){let H=T(E,N,A,R);E.onBeforeShadow(t,E,C,y,G,H,null),t.renderBufferDirect(y,null,G,H,E,null),E.onAfterShadow(t,E,C,y,G,H,null)}}let U=E.children;for(let G=0,N=U.length;G<N;G++)x(U[G],C,y,A,R)}function S(E){E.target.removeEventListener("dispose",S);for(let y in c){let A=c[y],R=E.target.uuid;R in A&&(A[R].dispose(),delete A[R])}}}function BR(t,e){function n(){let z=!1,Re=new tn,ie=null,Ie=new tn(0,0,0,0);return{setMask:function(Oe){ie!==Oe&&!z&&(t.colorMask(Oe,Oe,Oe,Oe),ie=Oe)},setLocked:function(Oe){z=Oe},setClear:function(Oe,ce,qe,He,rn){rn===!0&&(Oe*=He,ce*=He,qe*=He),Re.set(Oe,ce,qe,He),Ie.equals(Re)===!1&&(t.clearColor(Oe,ce,qe,He),Ie.copy(Re))},reset:function(){z=!1,ie=null,Ie.set(-1,0,0,0)}}}function i(){let z=!1,Re=!1,ie=null,Ie=null,Oe=null;return{setReversed:function(ce){if(Re!==ce){let qe=e.get("EXT_clip_control");ce?qe.clipControlEXT(qe.LOWER_LEFT_EXT,qe.ZERO_TO_ONE_EXT):qe.clipControlEXT(qe.LOWER_LEFT_EXT,qe.NEGATIVE_ONE_TO_ONE_EXT),Re=ce;let He=Oe;Oe=null,this.setClear(He)}},getReversed:function(){return Re},setTest:function(ce){ce?ee(t.DEPTH_TEST):Me(t.DEPTH_TEST)},setMask:function(ce){ie!==ce&&!z&&(t.depthMask(ce),ie=ce)},setFunc:function(ce){if(Re&&(ce=oy[ce]),Ie!==ce){switch(ce){case bh:t.depthFunc(t.NEVER);break;case Sh:t.depthFunc(t.ALWAYS);break;case wh:t.depthFunc(t.LESS);break;case va:t.depthFunc(t.LEQUAL);break;case Ah:t.depthFunc(t.EQUAL);break;case Eh:t.depthFunc(t.GEQUAL);break;case Th:t.depthFunc(t.GREATER);break;case Rh:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}Ie=ce}},setLocked:function(ce){z=ce},setClear:function(ce){Oe!==ce&&(Oe=ce,Re&&(ce=1-ce),t.clearDepth(ce))},reset:function(){z=!1,ie=null,Ie=null,Oe=null,Re=!1}}}function r(){let z=!1,Re=null,ie=null,Ie=null,Oe=null,ce=null,qe=null,He=null,rn=null;return{setTest:function(Ft){z||(Ft?ee(t.STENCIL_TEST):Me(t.STENCIL_TEST))},setMask:function(Ft){Re!==Ft&&!z&&(t.stencilMask(Ft),Re=Ft)},setFunc:function(Ft,er,mr){(ie!==Ft||Ie!==er||Oe!==mr)&&(t.stencilFunc(Ft,er,mr),ie=Ft,Ie=er,Oe=mr)},setOp:function(Ft,er,mr){(ce!==Ft||qe!==er||He!==mr)&&(t.stencilOp(Ft,er,mr),ce=Ft,qe=er,He=mr)},setLocked:function(Ft){z=Ft},setClear:function(Ft){rn!==Ft&&(t.clearStencil(Ft),rn=Ft)},reset:function(){z=!1,Re=null,ie=null,Ie=null,Oe=null,ce=null,qe=null,He=null,rn=null}}}let s=new n,o=new i,a=new r,l=new WeakMap,c=new WeakMap,u={},f={},h={},d=new WeakMap,g=[],_=null,m=!1,p=null,M=null,T=null,x=null,S=null,E=null,C=null,y=new St(0,0,0),A=0,R=!1,D=null,U=null,G=null,N=null,H=null,O=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS),k=!1,q=0,j=t.getParameter(t.VERSION);j.indexOf("WebGL")!==-1?(q=parseFloat(/^WebGL (\d)/.exec(j)[1]),k=q>=1):j.indexOf("OpenGL ES")!==-1&&(q=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),k=q>=2);let J=null,ne={},Ue=t.getParameter(t.SCISSOR_BOX),Pe=t.getParameter(t.VIEWPORT),lt=new tn().fromArray(Ue),Ve=new tn().fromArray(Pe);function et(z,Re,ie,Ie){let Oe=new Uint8Array(4),ce=t.createTexture();t.bindTexture(z,ce),t.texParameteri(z,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(z,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let qe=0;qe<ie;qe++)z===t.TEXTURE_3D||z===t.TEXTURE_2D_ARRAY?t.texImage3D(Re,0,t.RGBA,1,1,Ie,0,t.RGBA,t.UNSIGNED_BYTE,Oe):t.texImage2D(Re+qe,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,Oe);return ce}let $={};$[t.TEXTURE_2D]=et(t.TEXTURE_2D,t.TEXTURE_2D,1),$[t.TEXTURE_CUBE_MAP]=et(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),$[t.TEXTURE_2D_ARRAY]=et(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),$[t.TEXTURE_3D]=et(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ee(t.DEPTH_TEST),o.setFunc(va),Se(!1),we(xm),ee(t.CULL_FACE),Ge(gi);function ee(z){u[z]!==!0&&(t.enable(z),u[z]=!0)}function Me(z){u[z]!==!1&&(t.disable(z),u[z]=!1)}function Ze(z,Re){return h[z]!==Re?(t.bindFramebuffer(z,Re),h[z]=Re,z===t.DRAW_FRAMEBUFFER&&(h[t.FRAMEBUFFER]=Re),z===t.FRAMEBUFFER&&(h[t.DRAW_FRAMEBUFFER]=Re),!0):!1}function be(z,Re){let ie=g,Ie=!1;if(z){ie=d.get(Re),ie===void 0&&(ie=[],d.set(Re,ie));let Oe=z.textures;if(ie.length!==Oe.length||ie[0]!==t.COLOR_ATTACHMENT0){for(let ce=0,qe=Oe.length;ce<qe;ce++)ie[ce]=t.COLOR_ATTACHMENT0+ce;ie.length=Oe.length,Ie=!0}}else ie[0]!==t.BACK&&(ie[0]=t.BACK,Ie=!0);Ie&&t.drawBuffers(ie)}function re(z){return _!==z?(t.useProgram(z),_=z,!0):!1}let ue={[ts]:t.FUNC_ADD,[Cv]:t.FUNC_SUBTRACT,[Pv]:t.FUNC_REVERSE_SUBTRACT};ue[Iv]=t.MIN,ue[Lv]=t.MAX;let Te={[Dv]:t.ZERO,[uc]:t.ONE,[Nv]:t.SRC_COLOR,[_m]:t.SRC_ALPHA,[zv]:t.SRC_ALPHA_SATURATE,[Bv]:t.DST_COLOR,[Fv]:t.DST_ALPHA,[Ov]:t.ONE_MINUS_SRC_COLOR,[Ta]:t.ONE_MINUS_SRC_ALPHA,[kv]:t.ONE_MINUS_DST_COLOR,[Uv]:t.ONE_MINUS_DST_ALPHA,[Vv]:t.CONSTANT_COLOR,[Gv]:t.ONE_MINUS_CONSTANT_COLOR,[Hv]:t.CONSTANT_ALPHA,[Wv]:t.ONE_MINUS_CONSTANT_ALPHA};function Ge(z,Re,ie,Ie,Oe,ce,qe,He,rn,Ft){if(z===gi){m===!0&&(Me(t.BLEND),m=!1);return}if(m===!1&&(ee(t.BLEND),m=!0),z!==of){if(z!==p||Ft!==R){if((M!==ts||S!==ts)&&(t.blendEquation(t.FUNC_ADD),M=ts,S=ts),Ft)switch(z){case ar:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Mo:t.blendFunc(t.ONE,t.ONE);break;case vm:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case ym:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:rt("WebGLState: Invalid blending: ",z);break}else switch(z){case ar:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Mo:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case vm:rt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ym:rt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:rt("WebGLState: Invalid blending: ",z);break}T=null,x=null,E=null,C=null,y.set(0,0,0),A=0,p=z,R=Ft}return}Oe=Oe||Re,ce=ce||ie,qe=qe||Ie,(Re!==M||Oe!==S)&&(t.blendEquationSeparate(ue[Re],ue[Oe]),M=Re,S=Oe),(ie!==T||Ie!==x||ce!==E||qe!==C)&&(t.blendFuncSeparate(Te[ie],Te[Ie],Te[ce],Te[qe]),T=ie,x=Ie,E=ce,C=qe),(He.equals(y)===!1||rn!==A)&&(t.blendColor(He.r,He.g,He.b,rn),y.copy(He),A=rn),p=z,R=!1}function mt(z,Re){z.side===Ar?Me(t.CULL_FACE):ee(t.CULL_FACE);let ie=z.side===li;Re&&(ie=!ie),Se(ie),z.blending===ar&&z.transparent===!1?Ge(gi):Ge(z.blending,z.blendEquation,z.blendSrc,z.blendDst,z.blendEquationAlpha,z.blendSrcAlpha,z.blendDstAlpha,z.blendColor,z.blendAlpha,z.premultipliedAlpha),o.setFunc(z.depthFunc),o.setTest(z.depthTest),o.setMask(z.depthWrite),s.setMask(z.colorWrite);let Ie=z.stencilWrite;a.setTest(Ie),Ie&&(a.setMask(z.stencilWriteMask),a.setFunc(z.stencilFunc,z.stencilRef,z.stencilFuncMask),a.setOp(z.stencilFail,z.stencilZFail,z.stencilZPass)),$t(z.polygonOffset,z.polygonOffsetFactor,z.polygonOffsetUnits),z.alphaToCoverage===!0?ee(t.SAMPLE_ALPHA_TO_COVERAGE):Me(t.SAMPLE_ALPHA_TO_COVERAGE)}function Se(z){D!==z&&(z?t.frontFace(t.CW):t.frontFace(t.CCW),D=z)}function we(z){z!==Ev?(ee(t.CULL_FACE),z!==U&&(z===xm?t.cullFace(t.BACK):z===Tv?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Me(t.CULL_FACE),U=z}function tt(z){z!==G&&(k&&t.lineWidth(z),G=z)}function $t(z,Re,ie){z?(ee(t.POLYGON_OFFSET_FILL),(N!==Re||H!==ie)&&(N=Re,H=ie,o.getReversed()&&(Re=-Re),t.polygonOffset(Re,ie))):Me(t.POLYGON_OFFSET_FILL)}function Ht(z){z?ee(t.SCISSOR_TEST):Me(t.SCISSOR_TEST)}function Wt(z){z===void 0&&(z=t.TEXTURE0+O-1),J!==z&&(t.activeTexture(z),J=z)}function F(z,Re,ie){ie===void 0&&(J===null?ie=t.TEXTURE0+O-1:ie=J);let Ie=ne[ie];Ie===void 0&&(Ie={type:void 0,texture:void 0},ne[ie]=Ie),(Ie.type!==z||Ie.texture!==Re)&&(J!==ie&&(t.activeTexture(ie),J=ie),t.bindTexture(z,Re||$[z]),Ie.type=z,Ie.texture=Re)}function wn(){let z=ne[J];z!==void 0&&z.type!==void 0&&(t.bindTexture(z.type,null),z.type=void 0,z.texture=void 0)}function yt(){try{t.compressedTexImage2D(...arguments)}catch(z){rt("WebGLState:",z)}}function I(){try{t.compressedTexImage3D(...arguments)}catch(z){rt("WebGLState:",z)}}function v(){try{t.texSubImage2D(...arguments)}catch(z){rt("WebGLState:",z)}}function w(){try{t.texSubImage3D(...arguments)}catch(z){rt("WebGLState:",z)}}function L(){try{t.compressedTexSubImage2D(...arguments)}catch(z){rt("WebGLState:",z)}}function V(){try{t.compressedTexSubImage3D(...arguments)}catch(z){rt("WebGLState:",z)}}function oe(){try{t.texStorage2D(...arguments)}catch(z){rt("WebGLState:",z)}}function ge(){try{t.texStorage3D(...arguments)}catch(z){rt("WebGLState:",z)}}function Z(){try{t.texImage2D(...arguments)}catch(z){rt("WebGLState:",z)}}function Q(){try{t.texImage3D(...arguments)}catch(z){rt("WebGLState:",z)}}function ye(z){return f[z]!==void 0?f[z]:t.getParameter(z)}function Be(z,Re){f[z]!==Re&&(t.pixelStorei(z,Re),f[z]=Re)}function se(z){lt.equals(z)===!1&&(t.scissor(z.x,z.y,z.z,z.w),lt.copy(z))}function me(z){Ve.equals(z)===!1&&(t.viewport(z.x,z.y,z.z,z.w),Ve.copy(z))}function Ae(z,Re){let ie=c.get(Re);ie===void 0&&(ie=new WeakMap,c.set(Re,ie));let Ie=ie.get(z);Ie===void 0&&(Ie=t.getUniformBlockIndex(Re,z.name),ie.set(z,Ie))}function We(z,Re){let Ie=c.get(Re).get(z);l.get(Re)!==Ie&&(t.uniformBlockBinding(Re,Ie,z.__bindingPointIndex),l.set(Re,Ie))}function ft(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),o.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),t.pixelStorei(t.PACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.BROWSER_DEFAULT_WEBGL),t.pixelStorei(t.PACK_ROW_LENGTH,0),t.pixelStorei(t.PACK_SKIP_PIXELS,0),t.pixelStorei(t.PACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_ROW_LENGTH,0),t.pixelStorei(t.UNPACK_IMAGE_HEIGHT,0),t.pixelStorei(t.UNPACK_SKIP_PIXELS,0),t.pixelStorei(t.UNPACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_SKIP_IMAGES,0),u={},f={},J=null,ne={},h={},d=new WeakMap,g=[],_=null,m=!1,p=null,M=null,T=null,x=null,S=null,E=null,C=null,y=new St(0,0,0),A=0,R=!1,D=null,U=null,G=null,N=null,H=null,lt.set(0,0,t.canvas.width,t.canvas.height),Ve.set(0,0,t.canvas.width,t.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:ee,disable:Me,bindFramebuffer:Ze,drawBuffers:be,useProgram:re,setBlending:Ge,setMaterial:mt,setFlipSided:Se,setCullFace:we,setLineWidth:tt,setPolygonOffset:$t,setScissorTest:Ht,activeTexture:Wt,bindTexture:F,unbindTexture:wn,compressedTexImage2D:yt,compressedTexImage3D:I,texImage2D:Z,texImage3D:Q,pixelStorei:Be,getParameter:ye,updateUBOMapping:Ae,uniformBlockBinding:We,texStorage2D:oe,texStorage3D:ge,texSubImage2D:v,texSubImage3D:w,compressedTexSubImage2D:L,compressedTexSubImage3D:V,scissor:se,viewport:me,reset:ft}}function kR(t,e,n,i,r,s,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ot,u=new WeakMap,f=new Set,h,d=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(I,v){return g?new OffscreenCanvas(I,v):Xl("canvas")}function m(I,v,w){let L=1,V=yt(I);if((V.width>w||V.height>w)&&(L=w/Math.max(V.width,V.height)),L<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){let oe=Math.floor(L*V.width),ge=Math.floor(L*V.height);h===void 0&&(h=_(oe,ge));let Z=v?_(oe,ge):h;return Z.width=oe,Z.height=ge,Z.getContext("2d").drawImage(I,0,0,oe,ge),it("WebGLRenderer: Texture has been resized from ("+V.width+"x"+V.height+") to ("+oe+"x"+ge+")."),Z}else return"data"in I&&it("WebGLRenderer: Image in DataTexture is too big ("+V.width+"x"+V.height+")."),I;return I}function p(I){return I.generateMipmaps}function M(I){t.generateMipmap(I)}function T(I){return I.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:I.isWebGL3DRenderTarget?t.TEXTURE_3D:I.isWebGLArrayRenderTarget||I.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function x(I,v,w,L,V,oe=!1){if(I!==null){if(t[I]!==void 0)return t[I];it("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let ge;L&&(ge=e.get("EXT_texture_norm16"),ge||it("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=v;if(v===t.RED&&(w===t.FLOAT&&(Z=t.R32F),w===t.HALF_FLOAT&&(Z=t.R16F),w===t.UNSIGNED_BYTE&&(Z=t.R8),w===t.UNSIGNED_SHORT&&ge&&(Z=ge.R16_EXT),w===t.SHORT&&ge&&(Z=ge.R16_SNORM_EXT)),v===t.RED_INTEGER&&(w===t.UNSIGNED_BYTE&&(Z=t.R8UI),w===t.UNSIGNED_SHORT&&(Z=t.R16UI),w===t.UNSIGNED_INT&&(Z=t.R32UI),w===t.BYTE&&(Z=t.R8I),w===t.SHORT&&(Z=t.R16I),w===t.INT&&(Z=t.R32I)),v===t.RG&&(w===t.FLOAT&&(Z=t.RG32F),w===t.HALF_FLOAT&&(Z=t.RG16F),w===t.UNSIGNED_BYTE&&(Z=t.RG8),w===t.UNSIGNED_SHORT&&ge&&(Z=ge.RG16_EXT),w===t.SHORT&&ge&&(Z=ge.RG16_SNORM_EXT)),v===t.RG_INTEGER&&(w===t.UNSIGNED_BYTE&&(Z=t.RG8UI),w===t.UNSIGNED_SHORT&&(Z=t.RG16UI),w===t.UNSIGNED_INT&&(Z=t.RG32UI),w===t.BYTE&&(Z=t.RG8I),w===t.SHORT&&(Z=t.RG16I),w===t.INT&&(Z=t.RG32I)),v===t.RGB_INTEGER&&(w===t.UNSIGNED_BYTE&&(Z=t.RGB8UI),w===t.UNSIGNED_SHORT&&(Z=t.RGB16UI),w===t.UNSIGNED_INT&&(Z=t.RGB32UI),w===t.BYTE&&(Z=t.RGB8I),w===t.SHORT&&(Z=t.RGB16I),w===t.INT&&(Z=t.RGB32I)),v===t.RGBA_INTEGER&&(w===t.UNSIGNED_BYTE&&(Z=t.RGBA8UI),w===t.UNSIGNED_SHORT&&(Z=t.RGBA16UI),w===t.UNSIGNED_INT&&(Z=t.RGBA32UI),w===t.BYTE&&(Z=t.RGBA8I),w===t.SHORT&&(Z=t.RGBA16I),w===t.INT&&(Z=t.RGBA32I)),v===t.RGB&&(w===t.UNSIGNED_SHORT&&ge&&(Z=ge.RGB16_EXT),w===t.SHORT&&ge&&(Z=ge.RGB16_SNORM_EXT),w===t.UNSIGNED_INT_5_9_9_9_REV&&(Z=t.RGB9_E5),w===t.UNSIGNED_INT_10F_11F_11F_REV&&(Z=t.R11F_G11F_B10F)),v===t.RGBA){let Q=oe?Hl:Mt.getTransfer(V);w===t.FLOAT&&(Z=t.RGBA32F),w===t.HALF_FLOAT&&(Z=t.RGBA16F),w===t.UNSIGNED_BYTE&&(Z=Q===kt?t.SRGB8_ALPHA8:t.RGBA8),w===t.UNSIGNED_SHORT&&ge&&(Z=ge.RGBA16_EXT),w===t.SHORT&&ge&&(Z=ge.RGBA16_SNORM_EXT),w===t.UNSIGNED_SHORT_4_4_4_4&&(Z=t.RGBA4),w===t.UNSIGNED_SHORT_5_5_5_1&&(Z=t.RGB5_A1)}return(Z===t.R16F||Z===t.R32F||Z===t.RG16F||Z===t.RG32F||Z===t.RGBA16F||Z===t.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function S(I,v){let w;return I?v===null||v===lr||v===Ca?w=t.DEPTH24_STENCIL8:v===Hi?w=t.DEPTH32F_STENCIL8:v===Ra&&(w=t.DEPTH24_STENCIL8,it("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===lr||v===Ca?w=t.DEPTH_COMPONENT24:v===Hi?w=t.DEPTH_COMPONENT32F:v===Ra&&(w=t.DEPTH_COMPONENT16),w}function E(I,v){return p(I)===!0||I.isFramebufferTexture&&I.minFilter!==Bn&&I.minFilter!==Et?Math.log2(Math.max(v.width,v.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?v.mipmaps.length:1}function C(I){let v=I.target;v.removeEventListener("dispose",C),A(v),v.isVideoTexture&&u.delete(v),v.isHTMLTexture&&f.delete(v)}function y(I){let v=I.target;v.removeEventListener("dispose",y),D(v)}function A(I){let v=i.get(I);if(v.__webglInit===void 0)return;let w=I.source,L=d.get(w);if(L){let V=L[v.__cacheKey];V.usedTimes--,V.usedTimes===0&&R(I),Object.keys(L).length===0&&d.delete(w)}i.remove(I)}function R(I){let v=i.get(I);t.deleteTexture(v.__webglTexture);let w=I.source,L=d.get(w);delete L[v.__cacheKey],o.memory.textures--}function D(I){let v=i.get(I);if(I.depthTexture&&(I.depthTexture.dispose(),i.remove(I.depthTexture)),I.isWebGLCubeRenderTarget)for(let L=0;L<6;L++){if(Array.isArray(v.__webglFramebuffer[L]))for(let V=0;V<v.__webglFramebuffer[L].length;V++)t.deleteFramebuffer(v.__webglFramebuffer[L][V]);else t.deleteFramebuffer(v.__webglFramebuffer[L]);v.__webglDepthbuffer&&t.deleteRenderbuffer(v.__webglDepthbuffer[L])}else{if(Array.isArray(v.__webglFramebuffer))for(let L=0;L<v.__webglFramebuffer.length;L++)t.deleteFramebuffer(v.__webglFramebuffer[L]);else t.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&t.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&t.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let L=0;L<v.__webglColorRenderbuffer.length;L++)v.__webglColorRenderbuffer[L]&&t.deleteRenderbuffer(v.__webglColorRenderbuffer[L]);v.__webglDepthRenderbuffer&&t.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let w=I.textures;for(let L=0,V=w.length;L<V;L++){let oe=i.get(w[L]);oe.__webglTexture&&(t.deleteTexture(oe.__webglTexture),o.memory.textures--),i.remove(w[L])}i.remove(I)}let U=0;function G(){U=0}function N(){return U}function H(I){U=I}function O(){let I=U;return I>=r.maxTextures&&it("WebGLTextures: Trying to use "+(I+1)+" texture units while this GPU supports only "+r.maxTextures),U+=1,I}function k(I){let v=[];return v.push(I.wrapS),v.push(I.wrapT),v.push(I.wrapR||0),v.push(I.magFilter),v.push(I.minFilter),v.push(I.anisotropy),v.push(I.internalFormat),v.push(I.format),v.push(I.type),v.push(I.generateMipmaps),v.push(I.premultiplyAlpha),v.push(I.flipY),v.push(I.unpackAlignment),v.push(I.colorSpace),v.join()}function q(I,v){let w=i.get(I);if(I.isVideoTexture&&F(I),I.isRenderTargetTexture===!1&&I.isExternalTexture!==!0&&I.version>0&&w.__version!==I.version){let L=I.image;if(L===null)it("WebGLRenderer: Texture marked for update but no image data found.");else if(L.complete===!1)it("WebGLRenderer: Texture marked for update but image is incomplete");else{Me(w,I,v);return}}else I.isExternalTexture&&(w.__webglTexture=I.sourceTexture?I.sourceTexture:null);n.bindTexture(t.TEXTURE_2D,w.__webglTexture,t.TEXTURE0+v)}function j(I,v){let w=i.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&w.__version!==I.version){Me(w,I,v);return}else I.isExternalTexture&&(w.__webglTexture=I.sourceTexture?I.sourceTexture:null);n.bindTexture(t.TEXTURE_2D_ARRAY,w.__webglTexture,t.TEXTURE0+v)}function J(I,v){let w=i.get(I);if(I.isRenderTargetTexture===!1&&I.version>0&&w.__version!==I.version){Me(w,I,v);return}n.bindTexture(t.TEXTURE_3D,w.__webglTexture,t.TEXTURE0+v)}function ne(I,v){let w=i.get(I);if(I.isCubeDepthTexture!==!0&&I.version>0&&w.__version!==I.version){Ze(w,I,v);return}n.bindTexture(t.TEXTURE_CUBE_MAP,w.__webglTexture,t.TEXTURE0+v)}let Ue={[Ch]:t.REPEAT,[Zn]:t.CLAMP_TO_EDGE,[Ph]:t.MIRRORED_REPEAT},Pe={[Bn]:t.NEAREST,[Yv]:t.NEAREST_MIPMAP_NEAREST,[fc]:t.NEAREST_MIPMAP_LINEAR,[Et]:t.LINEAR,[cf]:t.LINEAR_MIPMAP_NEAREST,[Us]:t.LINEAR_MIPMAP_LINEAR},lt={[Kv]:t.NEVER,[ny]:t.ALWAYS,[Jv]:t.LESS,[Yf]:t.LEQUAL,[Qv]:t.EQUAL,[qf]:t.GEQUAL,[ey]:t.GREATER,[ty]:t.NOTEQUAL};function Ve(I,v){if(v.type===Hi&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===Et||v.magFilter===cf||v.magFilter===fc||v.magFilter===Us||v.minFilter===Et||v.minFilter===cf||v.minFilter===fc||v.minFilter===Us)&&it("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(I,t.TEXTURE_WRAP_S,Ue[v.wrapS]),t.texParameteri(I,t.TEXTURE_WRAP_T,Ue[v.wrapT]),(I===t.TEXTURE_3D||I===t.TEXTURE_2D_ARRAY)&&t.texParameteri(I,t.TEXTURE_WRAP_R,Ue[v.wrapR]),t.texParameteri(I,t.TEXTURE_MAG_FILTER,Pe[v.magFilter]),t.texParameteri(I,t.TEXTURE_MIN_FILTER,Pe[v.minFilter]),v.compareFunction&&(t.texParameteri(I,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(I,t.TEXTURE_COMPARE_FUNC,lt[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Bn||v.minFilter!==fc&&v.minFilter!==Us||v.type===Hi&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||i.get(v).__currentAnisotropy){let w=e.get("EXT_texture_filter_anisotropic");t.texParameterf(I,w.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,r.getMaxAnisotropy())),i.get(v).__currentAnisotropy=v.anisotropy}}}function et(I,v){let w=!1;I.__webglInit===void 0&&(I.__webglInit=!0,v.addEventListener("dispose",C));let L=v.source,V=d.get(L);V===void 0&&(V={},d.set(L,V));let oe=k(v);if(oe!==I.__cacheKey){V[oe]===void 0&&(V[oe]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,w=!0),V[oe].usedTimes++;let ge=V[I.__cacheKey];ge!==void 0&&(V[I.__cacheKey].usedTimes--,ge.usedTimes===0&&R(v)),I.__cacheKey=oe,I.__webglTexture=V[oe].texture}return w}function $(I,v,w){return Math.floor(Math.floor(I/w)/v)}function ee(I,v,w,L){let oe=I.updateRanges;if(oe.length===0)n.texSubImage2D(t.TEXTURE_2D,0,0,0,v.width,v.height,w,L,v.data);else{oe.sort((Be,se)=>Be.start-se.start);let ge=0;for(let Be=1;Be<oe.length;Be++){let se=oe[ge],me=oe[Be],Ae=se.start+se.count,We=$(me.start,v.width,4),ft=$(se.start,v.width,4);me.start<=Ae+1&&We===ft&&$(me.start+me.count-1,v.width,4)===We?se.count=Math.max(se.count,me.start+me.count-se.start):(++ge,oe[ge]=me)}oe.length=ge+1;let Z=n.getParameter(t.UNPACK_ROW_LENGTH),Q=n.getParameter(t.UNPACK_SKIP_PIXELS),ye=n.getParameter(t.UNPACK_SKIP_ROWS);n.pixelStorei(t.UNPACK_ROW_LENGTH,v.width);for(let Be=0,se=oe.length;Be<se;Be++){let me=oe[Be],Ae=Math.floor(me.start/4),We=Math.ceil(me.count/4),ft=Ae%v.width,z=Math.floor(Ae/v.width),Re=We,ie=1;n.pixelStorei(t.UNPACK_SKIP_PIXELS,ft),n.pixelStorei(t.UNPACK_SKIP_ROWS,z),n.texSubImage2D(t.TEXTURE_2D,0,ft,z,Re,ie,w,L,v.data)}I.clearUpdateRanges(),n.pixelStorei(t.UNPACK_ROW_LENGTH,Z),n.pixelStorei(t.UNPACK_SKIP_PIXELS,Q),n.pixelStorei(t.UNPACK_SKIP_ROWS,ye)}}function Me(I,v,w){let L=t.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(L=t.TEXTURE_2D_ARRAY),v.isData3DTexture&&(L=t.TEXTURE_3D);let V=et(I,v),oe=v.source;n.bindTexture(L,I.__webglTexture,t.TEXTURE0+w);let ge=i.get(oe);if(oe.version!==ge.__version||V===!0){if(n.activeTexture(t.TEXTURE0+w),(typeof ImageBitmap<"u"&&v.image instanceof ImageBitmap)===!1){let ie=Mt.getPrimaries(Mt.workingColorSpace),Ie=v.colorSpace===ns?null:Mt.getPrimaries(v.colorSpace),Oe=v.colorSpace===ns||ie===Ie?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Oe)}n.pixelStorei(t.UNPACK_ALIGNMENT,v.unpackAlignment);let Q=m(v.image,!1,r.maxTextureSize);Q=wn(v,Q);let ye=s.convert(v.format,v.colorSpace),Be=s.convert(v.type),se=x(v.internalFormat,ye,Be,v.normalized,v.colorSpace,v.isVideoTexture);Ve(L,v);let me,Ae=v.mipmaps,We=v.isVideoTexture!==!0,ft=ge.__version===void 0||V===!0,z=oe.dataReady,Re=E(v,Q);if(v.isDepthTexture)se=S(v.format===Bs,v.type),ft&&(We?n.texStorage2D(t.TEXTURE_2D,1,se,Q.width,Q.height):n.texImage2D(t.TEXTURE_2D,0,se,Q.width,Q.height,0,ye,Be,null));else if(v.isDataTexture)if(Ae.length>0){We&&ft&&n.texStorage2D(t.TEXTURE_2D,Re,se,Ae[0].width,Ae[0].height);for(let ie=0,Ie=Ae.length;ie<Ie;ie++)me=Ae[ie],We?z&&n.texSubImage2D(t.TEXTURE_2D,ie,0,0,me.width,me.height,ye,Be,me.data):n.texImage2D(t.TEXTURE_2D,ie,se,me.width,me.height,0,ye,Be,me.data);v.generateMipmaps=!1}else We?(ft&&n.texStorage2D(t.TEXTURE_2D,Re,se,Q.width,Q.height),z&&ee(v,Q,ye,Be)):n.texImage2D(t.TEXTURE_2D,0,se,Q.width,Q.height,0,ye,Be,Q.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){We&&ft&&n.texStorage3D(t.TEXTURE_2D_ARRAY,Re,se,Ae[0].width,Ae[0].height,Q.depth);for(let ie=0,Ie=Ae.length;ie<Ie;ie++)if(me=Ae[ie],v.format!==Hn)if(ye!==null)if(We){if(z)if(v.layerUpdates.size>0){let Oe=Gm(me.width,me.height,v.format,v.type);for(let ce of v.layerUpdates){let qe=me.data.subarray(ce*Oe/me.data.BYTES_PER_ELEMENT,(ce+1)*Oe/me.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ie,0,0,ce,me.width,me.height,1,ye,qe)}}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ie,0,0,0,me.width,me.height,Q.depth,ye,me.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,ie,se,me.width,me.height,Q.depth,0,me.data,0,0);else it("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else We?z&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,ie,0,0,0,me.width,me.height,Q.depth,ye,Be,me.data):n.texImage3D(t.TEXTURE_2D_ARRAY,ie,se,me.width,me.height,Q.depth,0,ye,Be,me.data);v.layerUpdates.size>0&&v.clearLayerUpdates()}else{We&&ft&&n.texStorage2D(t.TEXTURE_2D,Re,se,Ae[0].width,Ae[0].height);for(let ie=0,Ie=Ae.length;ie<Ie;ie++)me=Ae[ie],v.format!==Hn?ye!==null?We?z&&n.compressedTexSubImage2D(t.TEXTURE_2D,ie,0,0,me.width,me.height,ye,me.data):n.compressedTexImage2D(t.TEXTURE_2D,ie,se,me.width,me.height,0,me.data):it("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):We?z&&n.texSubImage2D(t.TEXTURE_2D,ie,0,0,me.width,me.height,ye,Be,me.data):n.texImage2D(t.TEXTURE_2D,ie,se,me.width,me.height,0,ye,Be,me.data)}else if(v.isDataArrayTexture)if(We){if(ft&&n.texStorage3D(t.TEXTURE_2D_ARRAY,Re,se,Q.width,Q.height,Q.depth),z)if(v.layerUpdates.size>0){let ie=Gm(Q.width,Q.height,v.format,v.type);for(let Ie of v.layerUpdates){let Oe=Q.data.subarray(Ie*ie/Q.data.BYTES_PER_ELEMENT,(Ie+1)*ie/Q.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,Ie,Q.width,Q.height,1,ye,Be,Oe)}v.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,ye,Be,Q.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,se,Q.width,Q.height,Q.depth,0,ye,Be,Q.data);else if(v.isData3DTexture)We?(ft&&n.texStorage3D(t.TEXTURE_3D,Re,se,Q.width,Q.height,Q.depth),z&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,ye,Be,Q.data)):n.texImage3D(t.TEXTURE_3D,0,se,Q.width,Q.height,Q.depth,0,ye,Be,Q.data);else if(v.isFramebufferTexture){if(ft)if(We)n.texStorage2D(t.TEXTURE_2D,Re,se,Q.width,Q.height);else{let ie=Q.width,Ie=Q.height;for(let Oe=0;Oe<Re;Oe++)n.texImage2D(t.TEXTURE_2D,Oe,se,ie,Ie,0,ye,Be,null),ie>>=1,Ie>>=1}}else if(v.isHTMLTexture){if("texElementImage2D"in t){let ie=t.canvas;if(ie.hasAttribute("layoutsubtree")||ie.setAttribute("layoutsubtree","true"),Q.parentNode!==ie){ie.appendChild(Q),f.add(v),ie.onpaint=Ie=>{let Oe=Ie.changedElements;for(let ce of f)Oe.includes(ce.image)&&(ce.needsUpdate=!0)},ie.requestPaint();return}if(t.texElementImage2D.length===3)t.texElementImage2D(t.TEXTURE_2D,t.RGBA8,Q);else{let Oe=t.RGBA,ce=t.RGBA,qe=t.UNSIGNED_BYTE;t.texElementImage2D(t.TEXTURE_2D,0,Oe,ce,qe,Q)}t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}}else if(Ae.length>0){if(We&&ft){let ie=yt(Ae[0]);n.texStorage2D(t.TEXTURE_2D,Re,se,ie.width,ie.height)}for(let ie=0,Ie=Ae.length;ie<Ie;ie++)me=Ae[ie],We?z&&n.texSubImage2D(t.TEXTURE_2D,ie,0,0,ye,Be,me):n.texImage2D(t.TEXTURE_2D,ie,se,ye,Be,me);v.generateMipmaps=!1}else if(We){if(ft){let ie=yt(Q);n.texStorage2D(t.TEXTURE_2D,Re,se,ie.width,ie.height)}z&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,ye,Be,Q)}else n.texImage2D(t.TEXTURE_2D,0,se,ye,Be,Q);p(v)&&M(L),ge.__version=oe.version,v.onUpdate&&v.onUpdate(v)}I.__version=v.version}function Ze(I,v,w){if(v.image.length!==6)return;let L=et(I,v),V=v.source;n.bindTexture(t.TEXTURE_CUBE_MAP,I.__webglTexture,t.TEXTURE0+w);let oe=i.get(V);if(V.version!==oe.__version||L===!0){n.activeTexture(t.TEXTURE0+w);let ge=Mt.getPrimaries(Mt.workingColorSpace),Z=v.colorSpace===ns?null:Mt.getPrimaries(v.colorSpace),Q=v.colorSpace===ns||ge===Z?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,v.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),n.pixelStorei(t.UNPACK_ALIGNMENT,v.unpackAlignment),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Q);let ye=v.isCompressedTexture||v.image[0].isCompressedTexture,Be=v.image[0]&&v.image[0].isDataTexture,se=[];for(let ce=0;ce<6;ce++)!ye&&!Be?se[ce]=m(v.image[ce],!0,r.maxCubemapSize):se[ce]=Be?v.image[ce].image:v.image[ce],se[ce]=wn(v,se[ce]);let me=se[0],Ae=s.convert(v.format,v.colorSpace),We=s.convert(v.type),ft=x(v.internalFormat,Ae,We,v.normalized,v.colorSpace),z=v.isVideoTexture!==!0,Re=oe.__version===void 0||L===!0,ie=V.dataReady,Ie=E(v,me);Ve(t.TEXTURE_CUBE_MAP,v);let Oe;if(ye){z&&Re&&n.texStorage2D(t.TEXTURE_CUBE_MAP,Ie,ft,me.width,me.height);for(let ce=0;ce<6;ce++){Oe=se[ce].mipmaps;for(let qe=0;qe<Oe.length;qe++){let He=Oe[qe];v.format!==Hn?Ae!==null?z?ie&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,qe,0,0,He.width,He.height,Ae,He.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,qe,ft,He.width,He.height,0,He.data):it("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):z?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,qe,0,0,He.width,He.height,Ae,We,He.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,qe,ft,He.width,He.height,0,Ae,We,He.data)}}}else{if(Oe=v.mipmaps,z&&Re){Oe.length>0&&Ie++;let ce=yt(se[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,Ie,ft,ce.width,ce.height)}for(let ce=0;ce<6;ce++)if(Be){z?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,0,0,se[ce].width,se[ce].height,Ae,We,se[ce].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,ft,se[ce].width,se[ce].height,0,Ae,We,se[ce].data);for(let qe=0;qe<Oe.length;qe++){let rn=Oe[qe].image[ce].image;z?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,qe+1,0,0,rn.width,rn.height,Ae,We,rn.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,qe+1,ft,rn.width,rn.height,0,Ae,We,rn.data)}}else{z?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,0,0,Ae,We,se[ce]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0,ft,Ae,We,se[ce]);for(let qe=0;qe<Oe.length;qe++){let He=Oe[qe];z?ie&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,qe+1,0,0,Ae,We,He.image[ce]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ce,qe+1,ft,Ae,We,He.image[ce])}}}p(v)&&M(t.TEXTURE_CUBE_MAP),oe.__version=V.version,v.onUpdate&&v.onUpdate(v)}I.__version=v.version}function be(I,v,w,L,V,oe){let ge=s.convert(w.format,w.colorSpace),Z=s.convert(w.type),Q=x(w.internalFormat,ge,Z,w.normalized,w.colorSpace),ye=i.get(v),Be=i.get(w);if(Be.__renderTarget=v,!ye.__hasExternalTextures){let se=Math.max(1,v.width>>oe),me=Math.max(1,v.height>>oe);V===t.TEXTURE_3D||V===t.TEXTURE_2D_ARRAY?n.texImage3D(V,oe,Q,se,me,v.depth,0,ge,Z,null):n.texImage2D(V,oe,Q,se,me,0,ge,Z,null)}n.bindFramebuffer(t.FRAMEBUFFER,I),Wt(v)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,L,V,Be.__webglTexture,0,Ht(v)):(V===t.TEXTURE_2D||V>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&V<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,L,V,Be.__webglTexture,oe),n.bindFramebuffer(t.FRAMEBUFFER,null)}function re(I,v,w){if(t.bindRenderbuffer(t.RENDERBUFFER,I),v.depthBuffer){let L=v.depthTexture,V=L&&L.isDepthTexture?L.type:null,oe=S(v.stencilBuffer,V),ge=v.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;Wt(v)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ht(v),oe,v.width,v.height):w?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ht(v),oe,v.width,v.height):t.renderbufferStorage(t.RENDERBUFFER,oe,v.width,v.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,ge,t.RENDERBUFFER,I)}else{let L=v.textures;for(let V=0;V<L.length;V++){let oe=L[V],ge=s.convert(oe.format,oe.colorSpace),Z=s.convert(oe.type),Q=x(oe.internalFormat,ge,Z,oe.normalized,oe.colorSpace);Wt(v)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ht(v),Q,v.width,v.height):w?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ht(v),Q,v.width,v.height):t.renderbufferStorage(t.RENDERBUFFER,Q,v.width,v.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function ue(I,v,w){let L=v.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(t.FRAMEBUFFER,I),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let V=i.get(v.depthTexture);if(V.__renderTarget=v,(!V.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),L){if(V.__webglInit===void 0&&(V.__webglInit=!0,v.depthTexture.addEventListener("dispose",C)),V.__webglTexture===void 0){V.__webglTexture=t.createTexture(),n.bindTexture(t.TEXTURE_CUBE_MAP,V.__webglTexture),Ve(t.TEXTURE_CUBE_MAP,v.depthTexture);let ye=s.convert(v.depthTexture.format),Be=s.convert(v.depthTexture.type),se;v.depthTexture.format===_r?se=t.DEPTH_COMPONENT24:v.depthTexture.format===Bs&&(se=t.DEPTH24_STENCIL8);for(let me=0;me<6;me++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+me,0,se,v.width,v.height,0,ye,Be,null)}}else q(v.depthTexture,0);let oe=V.__webglTexture,ge=Ht(v),Z=L?t.TEXTURE_CUBE_MAP_POSITIVE_X+w:t.TEXTURE_2D,Q=v.depthTexture.format===Bs?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(v.depthTexture.format===_r)Wt(v)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Q,Z,oe,0,ge):t.framebufferTexture2D(t.FRAMEBUFFER,Q,Z,oe,0);else if(v.depthTexture.format===Bs)Wt(v)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Q,Z,oe,0,ge):t.framebufferTexture2D(t.FRAMEBUFFER,Q,Z,oe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Te(I){let v=i.get(I),w=I.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==I.depthTexture){let L=I.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),L){let V=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,L.removeEventListener("dispose",V)};L.addEventListener("dispose",V),v.__depthDisposeCallback=V}v.__boundDepthTexture=L}if(I.depthTexture&&!v.__autoAllocateDepthBuffer)if(w)for(let L=0;L<6;L++)ue(v.__webglFramebuffer[L],I,L);else{let L=I.texture.mipmaps;L&&L.length>0?ue(v.__webglFramebuffer[0],I,0):ue(v.__webglFramebuffer,I,0)}else if(w){v.__webglDepthbuffer=[];for(let L=0;L<6;L++)if(n.bindFramebuffer(t.FRAMEBUFFER,v.__webglFramebuffer[L]),v.__webglDepthbuffer[L]===void 0)v.__webglDepthbuffer[L]=t.createRenderbuffer(),re(v.__webglDepthbuffer[L],I,!1);else{let V=I.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,oe=v.__webglDepthbuffer[L];t.bindRenderbuffer(t.RENDERBUFFER,oe),t.framebufferRenderbuffer(t.FRAMEBUFFER,V,t.RENDERBUFFER,oe)}}else{let L=I.texture.mipmaps;if(L&&L.length>0?n.bindFramebuffer(t.FRAMEBUFFER,v.__webglFramebuffer[0]):n.bindFramebuffer(t.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=t.createRenderbuffer(),re(v.__webglDepthbuffer,I,!1);else{let V=I.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,oe=v.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,oe),t.framebufferRenderbuffer(t.FRAMEBUFFER,V,t.RENDERBUFFER,oe)}}n.bindFramebuffer(t.FRAMEBUFFER,null)}function Ge(I,v,w){let L=i.get(I);v!==void 0&&be(L.__webglFramebuffer,I,I.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),w!==void 0&&Te(I)}function mt(I){let v=I.texture,w=i.get(I),L=i.get(v);I.addEventListener("dispose",y);let V=I.textures,oe=I.isWebGLCubeRenderTarget===!0,ge=V.length>1;if(ge||(L.__webglTexture===void 0&&(L.__webglTexture=t.createTexture()),L.__version=v.version,o.memory.textures++),oe){w.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(v.mipmaps&&v.mipmaps.length>0){w.__webglFramebuffer[Z]=[];for(let Q=0;Q<v.mipmaps.length;Q++)w.__webglFramebuffer[Z][Q]=t.createFramebuffer()}else w.__webglFramebuffer[Z]=t.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){w.__webglFramebuffer=[];for(let Z=0;Z<v.mipmaps.length;Z++)w.__webglFramebuffer[Z]=t.createFramebuffer()}else w.__webglFramebuffer=t.createFramebuffer();if(ge)for(let Z=0,Q=V.length;Z<Q;Z++){let ye=i.get(V[Z]);ye.__webglTexture===void 0&&(ye.__webglTexture=t.createTexture(),o.memory.textures++)}if(I.samples>0&&Wt(I)===!1){w.__webglMultisampledFramebuffer=t.createFramebuffer(),w.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,w.__webglMultisampledFramebuffer);for(let Z=0;Z<V.length;Z++){let Q=V[Z];w.__webglColorRenderbuffer[Z]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,w.__webglColorRenderbuffer[Z]);let ye=s.convert(Q.format,Q.colorSpace),Be=s.convert(Q.type),se=x(Q.internalFormat,ye,Be,Q.normalized,Q.colorSpace,I.isXRRenderTarget===!0),me=Ht(I);t.renderbufferStorageMultisample(t.RENDERBUFFER,me,se,I.width,I.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Z,t.RENDERBUFFER,w.__webglColorRenderbuffer[Z])}t.bindRenderbuffer(t.RENDERBUFFER,null),I.depthBuffer&&(w.__webglDepthRenderbuffer=t.createRenderbuffer(),re(w.__webglDepthRenderbuffer,I,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(oe){n.bindTexture(t.TEXTURE_CUBE_MAP,L.__webglTexture),Ve(t.TEXTURE_CUBE_MAP,v);for(let Z=0;Z<6;Z++)if(v.mipmaps&&v.mipmaps.length>0)for(let Q=0;Q<v.mipmaps.length;Q++)be(w.__webglFramebuffer[Z][Q],I,v,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,Q);else be(w.__webglFramebuffer[Z],I,v,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);p(v)&&M(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(ge){for(let Z=0,Q=V.length;Z<Q;Z++){let ye=V[Z],Be=i.get(ye),se=t.TEXTURE_2D;(I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(se=I.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(se,Be.__webglTexture),Ve(se,ye),be(w.__webglFramebuffer,I,ye,t.COLOR_ATTACHMENT0+Z,se,0),p(ye)&&M(se)}n.unbindTexture()}else{let Z=t.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(Z=I.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(Z,L.__webglTexture),Ve(Z,v),v.mipmaps&&v.mipmaps.length>0)for(let Q=0;Q<v.mipmaps.length;Q++)be(w.__webglFramebuffer[Q],I,v,t.COLOR_ATTACHMENT0,Z,Q);else be(w.__webglFramebuffer,I,v,t.COLOR_ATTACHMENT0,Z,0);p(v)&&M(Z),n.unbindTexture()}I.depthBuffer&&Te(I)}function Se(I){let v=I.textures;for(let w=0,L=v.length;w<L;w++){let V=v[w];if(p(V)){let oe=T(I),ge=i.get(V).__webglTexture;n.bindTexture(oe,ge),M(oe),n.unbindTexture()}}}let we=[],tt=[];function $t(I){if(I.samples>0){if(Wt(I)===!1){let v=I.textures,w=I.width,L=I.height,V=t.COLOR_BUFFER_BIT,oe=I.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ge=i.get(I),Z=v.length>1;if(Z)for(let ye=0;ye<v.length;ye++)n.bindFramebuffer(t.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ye,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,ge.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ye,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,ge.__webglMultisampledFramebuffer);let Q=I.texture.mipmaps;Q&&Q.length>0?n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ge.__webglFramebuffer[0]):n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ge.__webglFramebuffer);for(let ye=0;ye<v.length;ye++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(V|=t.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(V|=t.STENCIL_BUFFER_BIT)),Z){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,ge.__webglColorRenderbuffer[ye]);let Be=i.get(v[ye]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Be,0)}t.blitFramebuffer(0,0,w,L,0,0,w,L,V,t.NEAREST),l===!0&&(we.length=0,tt.length=0,we.push(t.COLOR_ATTACHMENT0+ye),I.depthBuffer&&I.storeMultisampledDepthBuffer===!1&&(we.push(oe),tt.push(oe),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,tt)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,we))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),Z)for(let ye=0;ye<v.length;ye++){n.bindFramebuffer(t.FRAMEBUFFER,ge.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ye,t.RENDERBUFFER,ge.__webglColorRenderbuffer[ye]);let Be=i.get(v[ye]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,ge.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ye,t.TEXTURE_2D,Be,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ge.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.storeMultisampledDepthBuffer===!1&&l){let v=I.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[v])}}}function Ht(I){return Math.min(r.maxSamples,I.samples)}function Wt(I){let v=i.get(I);return I.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function F(I){let v=o.render.frame;u.get(I)!==v&&(u.set(I,v),I.update())}function wn(I,v){let w=I.colorSpace,L=I.format,V=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||w!==vo&&w!==ns&&(Mt.getTransfer(w)===kt?(L!==Hn||V!==Ci)&&it("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):rt("WebGLTextures: Unsupported texture color space:",w)),v}function yt(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(c.width=I.naturalWidth||I.width,c.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(c.width=I.displayWidth,c.height=I.displayHeight):(c.width=I.width,c.height=I.height),c}this.allocateTextureUnit=O,this.resetTextureUnits=G,this.getTextureUnits=N,this.setTextureUnits=H,this.setTexture2D=q,this.setTexture2DArray=j,this.setTexture3D=J,this.setTextureCube=ne,this.rebindTextures=Ge,this.setupRenderTarget=mt,this.updateRenderTargetMipmap=Se,this.updateMultisampleRenderTarget=$t,this.setupDepthRenderbuffer=Te,this.setupFrameBufferTexture=be,this.useMultisampledRTT=Wt,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function zR(t,e){function n(i,r=ns){let s,o=Mt.getTransfer(r);if(i===Ci)return t.UNSIGNED_BYTE;if(i===hf)return t.UNSIGNED_SHORT_4_4_4_4;if(i===ff)return t.UNSIGNED_SHORT_5_5_5_1;if(i===Lm)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===Dm)return t.UNSIGNED_INT_10F_11F_11F_REV;if(i===Pm)return t.BYTE;if(i===Im)return t.SHORT;if(i===Ra)return t.UNSIGNED_SHORT;if(i===uf)return t.INT;if(i===lr)return t.UNSIGNED_INT;if(i===Hi)return t.FLOAT;if(i===Kn)return t.HALF_FLOAT;if(i===Nm)return t.ALPHA;if(i===Om)return t.RGB;if(i===Hn)return t.RGBA;if(i===_r)return t.DEPTH_COMPONENT;if(i===Bs)return t.DEPTH_STENCIL;if(i===df)return t.RED;if(i===pf)return t.RED_INTEGER;if(i===ks)return t.RG;if(i===mf)return t.RG_INTEGER;if(i===gf)return t.RGBA_INTEGER;if(i===dc||i===pc||i===mc||i===gc)if(o===kt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===dc)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===pc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===mc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===gc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===dc)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===pc)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===mc)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===gc)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===xf||i===vf||i===yf||i===_f)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===xf)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===vf)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===yf)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===_f)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Mf||i===bf||i===Sf||i===wf||i===Af||i===xc||i===Ef)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Mf||i===bf)return o===kt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Sf)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===wf)return s.COMPRESSED_R11_EAC;if(i===Af)return s.COMPRESSED_SIGNED_R11_EAC;if(i===xc)return s.COMPRESSED_RG11_EAC;if(i===Ef)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===Tf||i===Rf||i===Cf||i===Pf||i===If||i===Lf||i===Df||i===Nf||i===Of||i===Ff||i===Uf||i===Bf||i===kf||i===zf)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Tf)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Rf)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Cf)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Pf)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===If)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Lf)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Df)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Nf)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Of)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Ff)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Uf)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Bf)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===kf)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===zf)return o===kt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Vf||i===Gf||i===Hf)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Vf)return o===kt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Gf)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Hf)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Wf||i===Xf||i===vc||i===$f)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Wf)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Xf)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===vc)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===$f)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Ca?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}var VR=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,GR=`
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

}`,a0=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n){if(this.texture===null){let i=new ic(e.texture);(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let n=e.cameras[0].viewport,i=new Lt({vertexShader:VR,fragmentShader:GR,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new zt(new Qr(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},l0=class extends Mr{constructor(e,n){super();let i=this,r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,f=null,h=null,d=null,g=null,_=typeof XRWebGLBinding<"u",m=new a0,p={},M=n.getContextAttributes(),T=null,x=null,S=[],E=[],C=new ot,y=null,A=null,R=new jn;R.viewport=new tn;let D=new jn;D.viewport=new tn;let U=[R,D],G=new rf,N=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let ee=S[$];return ee===void 0&&(ee=new ba,S[$]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function($){let ee=S[$];return ee===void 0&&(ee=new ba,S[$]=ee),ee.getGripSpace()},this.getHand=function($){let ee=S[$];return ee===void 0&&(ee=new ba,S[$]=ee),ee.getHandSpace()};function O($){let ee=E.indexOf($.inputSource);if(ee===-1)return;let Me=S[ee];Me!==void 0&&(Me.update($.inputSource,$.frame,c||o),Me.dispatchEvent({type:$.type,data:$.inputSource}))}function k(){r.removeEventListener("select",O),r.removeEventListener("selectstart",O),r.removeEventListener("selectend",O),r.removeEventListener("squeeze",O),r.removeEventListener("squeezestart",O),r.removeEventListener("squeezeend",O),r.removeEventListener("end",k),r.removeEventListener("inputsourceschange",q);for(let $=0;$<S.length;$++){let ee=E[$];ee!==null&&(E[$]=null,S[$].disconnect(ee))}N=null,H=null,m.reset();for(let $ in p)delete p[$];if(e.setRenderTarget(T),d=null,h=null,f=null,r=null,x=null,et.stop(),i.isPresenting=!1,e.setPixelRatio(y),e.setSize(C.width,C.height,!1),A!==null){let $=A.camera;$.fov=A.fov,$.zoom=A.zoom,$.updateProjectionMatrix(),A=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){s=$,i.isPresenting===!0&&it("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){a=$,i.isPresenting===!0&&it("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function($){c=$},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return f===null&&_&&(f=new XRWebGLBinding(r,n)),f},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function($){if(r=$,r!==null){if(T=e.getRenderTarget(),r.addEventListener("select",O),r.addEventListener("selectstart",O),r.addEventListener("selectend",O),r.addEventListener("squeeze",O),r.addEventListener("squeezestart",O),r.addEventListener("squeezeend",O),r.addEventListener("end",k),r.addEventListener("inputsourceschange",q),M.xrCompatible!==!0&&await n.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(C),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let Me=null,Ze=null,be=null;M.depth&&(be=M.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Me=M.stencil?Bs:_r,Ze=M.stencil?Ca:lr);let re={colorFormat:n.RGBA8,depthFormat:be,scaleFactor:s};f=this.getBinding(),h=f.createProjectionLayer(re),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),x=new Tn(h.textureWidth,h.textureHeight,{format:Hn,type:Ci,depthTexture:new Ls(h.textureWidth,h.textureHeight,Ze,void 0,void 0,void 0,void 0,void 0,void 0,Me),stencilBuffer:M.stencil,colorSpace:e.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let Me={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(r,n,Me),r.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new Tn(d.framebufferWidth,d.framebufferHeight,{format:Hn,type:Ci,colorSpace:e.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),et.setContext(r),et.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function q($){for(let ee=0;ee<$.removed.length;ee++){let Me=$.removed[ee],Ze=E.indexOf(Me);Ze>=0&&(E[Ze]=null,S[Ze].disconnect(Me))}for(let ee=0;ee<$.added.length;ee++){let Me=$.added[ee],Ze=E.indexOf(Me);if(Ze===-1){for(let re=0;re<S.length;re++)if(re>=E.length){E.push(Me),Ze=re;break}else if(E[re]===null){E[re]=Me,Ze=re;break}if(Ze===-1)break}let be=S[Ze];be&&be.connect(Me)}}let j=new P,J=new P;function ne($,ee,Me){j.setFromMatrixPosition(ee.matrixWorld),J.setFromMatrixPosition(Me.matrixWorld);let Ze=j.distanceTo(J),be=ee.projectionMatrix.elements,re=Me.projectionMatrix.elements,ue=be[14]/(be[10]-1),Te=be[14]/(be[10]+1),Ge=(be[9]+1)/be[5],mt=(be[9]-1)/be[5],Se=(be[8]-1)/be[0],we=(re[8]+1)/re[0],tt=ue*Se,$t=ue*we,Ht=Ze/(-Se+we),Wt=Ht*-Se;if(ee.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(Wt),$.translateZ(Ht),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),be[10]===-1)$.projectionMatrix.copy(ee.projectionMatrix),$.projectionMatrixInverse.copy(ee.projectionMatrixInverse);else{let F=ue+Ht,wn=Te+Ht,yt=tt-Wt,I=$t+(Ze-Wt),v=Ge*Te/wn*F,w=mt*Te/wn*F;$.projectionMatrix.makePerspective(yt,I,v,w,F,wn),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function Ue($,ee){ee===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(ee.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(r===null)return;let ee=$.near,Me=$.far;m.texture!==null&&(m.depthNear>0&&(ee=m.depthNear),m.depthFar>0&&(Me=m.depthFar)),G.near=D.near=R.near=ee,G.far=D.far=R.far=Me,(N!==G.near||H!==G.far)&&(r.updateRenderState({depthNear:G.near,depthFar:G.far}),N=G.near,H=G.far),G.layers.mask=$.layers.mask|6,R.layers.mask=G.layers.mask&-5,D.layers.mask=G.layers.mask&-3;let Ze=$.parent,be=G.cameras;Ue(G,Ze);for(let re=0;re<be.length;re++)Ue(be[re],Ze);be.length===2?ne(G,R,D):G.projectionMatrix.copy(R.projectionMatrix),A===null&&$.isPerspectiveCamera&&(A={camera:$,fov:$.fov,zoom:$.zoom}),Pe($,G,Ze)};function Pe($,ee,Me){Me===null?$.matrix.copy(ee.matrixWorld):($.matrix.copy(Me.matrixWorld),$.matrix.invert(),$.matrix.multiply(ee.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(ee.projectionMatrix),$.projectionMatrixInverse.copy(ee.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=Lh*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return G},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function($){l=$,h!==null&&(h.fixedFoveation=$),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=$)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(G)},this.getCameraTexture=function($){return p[$]};let lt=null;function Ve($,ee){if(u=ee.getViewerPose(c||o),g=ee,u!==null){let Me=u.views;d!==null&&(e.setRenderTargetFramebuffer(x,d.framebuffer),e.setRenderTarget(x));let Ze=!1;Me.length!==G.cameras.length&&(G.cameras.length=0,Ze=!0);for(let Te=0;Te<Me.length;Te++){let Ge=Me[Te],mt=null;if(d!==null)mt=d.getViewport(Ge);else{let we=f.getViewSubImage(h,Ge);mt=we.viewport,Te===0&&(e.setRenderTargetTextures(x,we.colorTexture,we.depthStencilTexture),e.setRenderTarget(x))}let Se=U[Te];Se===void 0&&(Se=new jn,Se.layers.enable(Te),Se.viewport=new tn,U[Te]=Se),Se.matrix.fromArray(Ge.transform.matrix),Se.matrix.decompose(Se.position,Se.quaternion,Se.scale),Se.projectionMatrix.fromArray(Ge.projectionMatrix),Se.projectionMatrixInverse.copy(Se.projectionMatrix).invert(),Se.viewport.set(mt.x,mt.y,mt.width,mt.height),Te===0&&(G.matrix.copy(Se.matrix),G.matrix.decompose(G.position,G.quaternion,G.scale)),Ze===!0&&G.cameras.push(Se)}let be=r.enabledFeatures;if(be&&be.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&_){f=i.getBinding();let Te=f.getDepthInformation(Me[0]);Te&&Te.isValid&&Te.texture&&m.init(Te,r.renderState)}if(be&&be.includes("camera-access")&&_){e.state.unbindTexture(),f=i.getBinding();for(let Te=0;Te<Me.length;Te++){let Ge=Me[Te].camera;if(Ge){let mt=p[Ge];mt||(mt=new ic,p[Ge]=mt);let Se=f.getCameraImage(Ge);mt.sourceTexture=Se}}}}for(let Me=0;Me<S.length;Me++){let Ze=E[Me],be=S[Me];Ze!==null&&be!==void 0&&be.update(Ze,ee,c||o)}lt&&lt($,ee),ee.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ee}),g=null}let et=new Ly;et.setAnimationLoop(Ve),this.setAnimationLoop=function($){lt=$},this.dispose=function(){}}},HR=new At,By=new ht;By.set(-1,0,0,0,1,0,0,0,1);function WR(t,e){function n(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function i(m,p){p.color.getRGB(m.fogColor.value,km(t)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function r(m,p,M,T,x){p.isNodeMaterial?p.uniformsNeedUpdate=!1:p.isMeshBasicMaterial?s(m,p):p.isMeshLambertMaterial?(s(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshToonMaterial?(s(m,p),f(m,p)):p.isMeshPhongMaterial?(s(m,p),u(m,p),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)):p.isMeshStandardMaterial?(s(m,p),h(m,p),p.isMeshPhysicalMaterial&&d(m,p,x)):p.isMeshMatcapMaterial?(s(m,p),g(m,p)):p.isMeshDepthMaterial?s(m,p):p.isMeshDistanceMaterial?(s(m,p),_(m,p)):p.isMeshNormalMaterial?s(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&a(m,p)):p.isPointsMaterial?l(m,p,M,T):p.isSpriteMaterial?c(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function s(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,n(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,n(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===li&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,n(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===li&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,n(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,n(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,n(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let M=e.get(p),T=M.envMap,x=M.envMapRotation;T&&(m.envMap.value=T,m.envMapRotation.value.setFromMatrix4(HR.makeRotationFromEuler(x)).transpose(),T.isCubeTexture&&T.isRenderTargetTexture===!1&&m.envMapRotation.value.premultiply(By),m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,n(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,n(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,n(p.map,m.mapTransform))}function a(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function l(m,p,M,T){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*M,m.scale.value=T*.5,p.map&&(m.map.value=p.map,n(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function c(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,n(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,n(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function u(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function f(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,n(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,n(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function d(m,p,M){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,n(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,n(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,n(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,n(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,n(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===li&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.retroreflectivity>0&&(m.retroreflectivity.value=p.retroreflectivity),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,n(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,n(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,n(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,n(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,n(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,n(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,n(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){let M=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function XR(t,e,n,i){let r={},s={},o=[],a=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,S){let E=S.program;i.uniformBlockBinding(x,E)}function c(x,S){let E=r[x.id];E===void 0&&(m(x),E=u(x),r[x.id]=E,x.addEventListener("dispose",M));let C=S.program;i.updateUBOMapping(x,C);let y=e.render.frame;s[x.id]!==y&&(h(x),s[x.id]=y)}function u(x){let S=f();x.__bindingPointIndex=S;let E=t.createBuffer(),C=x.__size,y=x.usage;return t.bindBuffer(t.UNIFORM_BUFFER,E),t.bufferData(t.UNIFORM_BUFFER,C,y),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,S,E),E}function f(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return rt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(x){let S=r[x.id],E=x.uniforms,C=x.__cache;t.bindBuffer(t.UNIFORM_BUFFER,S);for(let y=0,A=E.length;y<A;y++){let R=E[y];if(Array.isArray(R))for(let D=0,U=R.length;D<U;D++)d(R[D],y,D,C);else d(R,y,0,C)}t.bindBuffer(t.UNIFORM_BUFFER,null)}function d(x,S,E,C){if(_(x,S,E,C)===!0){let y=x.__offset,A=x.value;if(Array.isArray(A)){let R=0;for(let D=0;D<A.length;D++){let U=A[D],G=p(U);g(U,x.__data,R),typeof U!="number"&&typeof U!="boolean"&&!U.isMatrix3&&!ArrayBuffer.isView(U)&&(R+=G.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(A,x.__data,0);t.bufferSubData(t.UNIFORM_BUFFER,y,x.__data)}}function g(x,S,E){typeof x=="number"||typeof x=="boolean"?S[0]=x:x.isMatrix3?(S[0]=x.elements[0],S[1]=x.elements[1],S[2]=x.elements[2],S[3]=0,S[4]=x.elements[3],S[5]=x.elements[4],S[6]=x.elements[5],S[7]=0,S[8]=x.elements[6],S[9]=x.elements[7],S[10]=x.elements[8],S[11]=0):ArrayBuffer.isView(x)?S.set(new x.constructor(x.buffer,x.byteOffset,S.length)):x.toArray(S,E)}function _(x,S,E,C){let y=x.value,A=S+"_"+E;if(C[A]===void 0)return typeof y=="number"||typeof y=="boolean"?C[A]=y:ArrayBuffer.isView(y)?C[A]=y.slice():C[A]=y.clone(),!0;{let R=C[A];if(typeof y=="number"||typeof y=="boolean"){if(R!==y)return C[A]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(R.equals(y)===!1)return R.copy(y),!0}}return!1}function m(x){let S=x.uniforms,E=0,C=16;for(let A=0,R=S.length;A<R;A++){let D=Array.isArray(S[A])?S[A]:[S[A]];for(let U=0,G=D.length;U<G;U++){let N=D[U],H=Array.isArray(N.value)?N.value:[N.value];for(let O=0,k=H.length;O<k;O++){let q=H[O],j=p(q),J=E%C,ne=J%j.boundary,Ue=J+ne;E+=ne,Ue!==0&&C-Ue<j.storage&&(E+=C-Ue),N.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=E,E+=j.storage}}}let y=E%C;return y>0&&(E+=C-y),x.__size=E,x.__cache={},this}function p(x){let S={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(S.boundary=4,S.storage=4):x.isVector2?(S.boundary=8,S.storage=8):x.isVector3||x.isColor?(S.boundary=16,S.storage=12):x.isVector4?(S.boundary=16,S.storage=16):x.isMatrix3?(S.boundary=48,S.storage=48):x.isMatrix4?(S.boundary=64,S.storage=64):x.isTexture?it("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(S.boundary=16,S.storage=x.byteLength):it("WebGLRenderer: Unsupported uniform value type.",x),S}function M(x){let S=x.target;S.removeEventListener("dispose",M);let E=o.indexOf(S.__bindingPointIndex);o.splice(E,1),t.deleteBuffer(r[S.id]),delete r[S.id],delete s[S.id]}function T(){for(let x in r)t.deleteBuffer(r[x]);o=[],r={},s={}}return{bind:l,update:c,dispose:T}}var $R=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Er=null;function YR(){return Er===null&&(Er=new Kl($R,16,16,ks,Kn),Er.name="DFG_LUT",Er.minFilter=Et,Er.magFilter=Et,Er.wrapS=Zn,Er.wrapT=Zn,Er.generateMipmaps=!1,Er.needsUpdate=!0),Er}var Qf=class{constructor(e={}){let{canvas:n=iy(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:h=!1,outputBufferType:d=Ci}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=o;let _=d,m=new Set([gf,mf,pf]),p=new Set([Ci,lr,Ra,Ca,hf,ff]),M=new Uint32Array(4),T=new Int32Array(4),x=new P,S=null,E=null,C=[],y=[],A=null;this.domElement=n,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ri,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let R=this,D=!1,U=null,G=null,N=null,H=null;this._outputColorSpace=Ei;let O=0,k=0,q=null,j=-1,J=null,ne=new tn,Ue=new tn,Pe=null,lt=new St(0),Ve=0,et=n.width,$=n.height,ee=1,Me=null,Ze=null,be=new tn(0,0,et,$),re=new tn(0,0,et,$),ue=!1,Te=new Ql,Ge=!1,mt=!1,Se=new At,we=new P,tt=new tn,$t={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},Ht=!1;function Wt(){return q===null?ee:1}let F=i;function wn(b,B){return n.getContext(b,B)}let yt,I,v,w,L,V,oe,ge,Z,Q,ye,Be,se,me,Ae,We,ft,z,Re,ie,Ie,Oe,ce;try{let b={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${"186"}`),n.addEventListener("webglcontextlost",rn,!1),n.addEventListener("webglcontextrestored",Ft,!1),n.addEventListener("webglcontextcreationerror",er,!1),F===null){let B="webgl2";if(F=wn(B,b),F===null)throw wn(B)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}qe()}catch(b){throw n.removeEventListener("webglcontextlost",rn,!1),n.removeEventListener("webglcontextrestored",Ft,!1),n.removeEventListener("webglcontextcreationerror",er,!1),rt("WebGLRenderer: "+b.message),b}function qe(){yt=new eT(F),yt.init(),Ie=new zR(F,yt),I=new WE(F,yt,e,Ie),v=new BR(F,yt),I.reversedDepthBuffer&&h&&v.buffers.depth.setReversed(!0),G=F.createFramebuffer(),N=F.createFramebuffer(),H=F.createFramebuffer(),w=new iT(F),L=new wR,V=new kR(F,yt,v,L,I,Ie,w),oe=new QE(R),ge=new sw(F),Oe=new GE(F,ge),Z=new tT(F,ge,w,Oe),Q=new sT(F,Z,ge,Oe,w),z=new rT(F,I,V),Ae=new XE(L),ye=new SR(R,oe,yt,I,Oe,Ae),Be=new WR(R,L),se=new ER,me=new LR(yt),ft=new VE(R,oe,v,Q,g,l),We=new UR(R,Q,I),ce=new XR(F,w,I,v),Re=new HE(F,yt,w),ie=new nT(F,yt,w),w.programs=ye.programs,R.capabilities=I,R.extensions=yt,R.properties=L,R.renderLists=se,R.shadowMap=We,R.state=v,R.info=w}_!==Ci&&(A=new aT(_,n.width,n.height,a,r,s));let He=new l0(R,F);this.xr=He,this.getContext=function(){return F},this.getContextAttributes=function(){return F.getContextAttributes()},this.forceContextLoss=function(){let b=yt.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){let b=yt.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return ee},this.setPixelRatio=function(b){b!==void 0&&(ee=b,this.setSize(et,$,!1))},this.getSize=function(b){return b.set(et,$)},this.setSize=function(b,B,K=!0){if(He.isPresenting){it("WebGLRenderer: Can't change size while VR device is presenting.");return}et=b,$=B,n.width=Math.floor(b*ee),n.height=Math.floor(B*ee),K===!0&&(n.style.width=b+"px",n.style.height=B+"px"),A!==null&&A.setSize(n.width,n.height),this.setViewport(0,0,b,B)},this.getDrawingBufferSize=function(b){return b.set(et*ee,$*ee).floor()},this.setDrawingBufferSize=function(b,B,K){et=b,$=B,ee=K,n.width=Math.floor(b*K),n.height=Math.floor(B*K),this.setViewport(0,0,b,B)},this.setEffects=function(b){if(_===Ci){rt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let B=0;B<b.length;B++)if(b[B].isOutputPass===!0){it("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(ne)},this.getViewport=function(b){return b.copy(be)},this.setViewport=function(b,B,K,W){b.isVector4?be.set(b.x,b.y,b.z,b.w):be.set(b,B,K,W),v.viewport(ne.copy(be).multiplyScalar(ee).round())},this.getScissor=function(b){return b.copy(re)},this.setScissor=function(b,B,K,W){b.isVector4?re.set(b.x,b.y,b.z,b.w):re.set(b,B,K,W),v.scissor(Ue.copy(re).multiplyScalar(ee).round())},this.getScissorTest=function(){return ue},this.setScissorTest=function(b){v.setScissorTest(ue=b)},this.setOpaqueSort=function(b){Me=b},this.setTransparentSort=function(b){Ze=b},this.getClearColor=function(b){return b.copy(ft.getClearColor())},this.setClearColor=function(){ft.setClearColor(...arguments)},this.getClearAlpha=function(){return ft.getClearAlpha()},this.setClearAlpha=function(){ft.setClearAlpha(...arguments)},this.clear=function(b=!0,B=!0,K=!0){let W=0;if(b){let X=!1;if(q!==null){let Fe=q.texture.format;X=m.has(Fe)}if(X){let Fe=q.texture.type,ze=p.has(Fe),Ne=ft.getClearColor(),Xe=ft.getClearAlpha(),je=Ne.r,gt=Ne.g,bt=Ne.b;ze?(M[0]=je,M[1]=gt,M[2]=bt,M[3]=Xe,F.clearBufferuiv(F.COLOR,0,M)):(T[0]=je,T[1]=gt,T[2]=bt,T[3]=Xe,F.clearBufferiv(F.COLOR,0,T))}else W|=F.COLOR_BUFFER_BIT}B&&(W|=F.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),K&&(W|=F.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&F.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),U=b},this.dispose=function(){n.removeEventListener("webglcontextlost",rn,!1),n.removeEventListener("webglcontextrestored",Ft,!1),n.removeEventListener("webglcontextcreationerror",er,!1),ft.dispose(),se.dispose(),me.dispose(),L.dispose(),oe.dispose(),Q.dispose(),Oe.dispose(),ce.dispose(),ye.dispose(),He.dispose(),He.removeEventListener("sessionstart",nx),He.removeEventListener("sessionend",ix),oo.stop()};function rn(b){b.preventDefault(),$l("WebGLRenderer: Context Lost."),D=!0}function Ft(){$l("WebGLRenderer: Context Restored."),D=!1;let b=w.autoReset,B=We.enabled,K=We.autoUpdate,W=We.needsUpdate,X=We.type;qe(),w.autoReset=b,We.enabled=B,We.autoUpdate=K,We.needsUpdate=W,We.type=X}function er(b){rt("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function mr(b){let B=b.target;B.removeEventListener("dispose",mr),DS(B)}function DS(b){NS(b),L.remove(b)}function NS(b){let B=L.get(b).programs;B!==void 0&&(B.forEach(function(K){ye.releaseProgram(K)}),b.isShaderMaterial&&ye.releaseShaderCache(b))}this.renderBufferDirect=function(b,B,K,W,X,Fe){B===null&&(B=$t);let ze=X.isMesh&&X.matrixWorld.determinantAffine()<0,Ne=US(b,B,K,W,X);v.setMaterial(W,ze);let Xe=K.index,je=1;if(W.wireframe===!0){if(Xe=Z.getWireframeAttribute(K),Xe===void 0)return;je=2}let gt=K.drawRange,bt=K.attributes.position,$e=gt.start*je,Ut=(gt.start+gt.count)*je;Fe!==null&&($e=Math.max($e,Fe.start*je),Ut=Math.min(Ut,(Fe.start+Fe.count)*je)),Xe!==null?($e=Math.max($e,0),Ut=Math.min(Ut,Xe.count)):bt!=null&&($e=Math.max($e,0),Ut=Math.min(Ut,bt.count));let An=Ut-$e;if(An<0||An===1/0)return;Oe.setup(X,W,Ne,K,Xe);let on,Jt=Re;if(Xe!==null&&(on=ge.get(Xe),Jt=ie,Jt.setIndex(on)),X.isMesh)W.wireframe===!0?(v.setLineWidth(W.wireframeLinewidth*Wt()),Jt.setMode(F.LINES)):Jt.setMode(F.TRIANGLES);else if(X.isLine){let $n=W.linewidth;$n===void 0&&($n=1),v.setLineWidth($n*Wt()),X.isLineSegments?Jt.setMode(F.LINES):X.isLineLoop?Jt.setMode(F.LINE_LOOP):Jt.setMode(F.LINE_STRIP)}else X.isPoints?Jt.setMode(F.POINTS):X.isSprite&&Jt.setMode(F.TRIANGLES);if(X.isBatchedMesh)if(yt.get("WEBGL_multi_draw"))Jt.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{let $n=X._multiDrawStarts,ke=X._multiDrawCounts,ri=X._multiDrawCount,Rt=Xe?ge.get(Xe).bytesPerElement:1,Bi=L.get(W).currentProgram.getUniforms();for(let gr=0;gr<ri;gr++)Bi.setValue(F,"_gl_DrawID",gr),Jt.render($n[gr]/Rt,ke[gr])}else if(X.isInstancedMesh)Jt.renderInstances($e,An,X.count);else if(K.isInstancedBufferGeometry){let $n=K._maxInstanceCount!==void 0?K._maxInstanceCount:1/0,ke=Math.min(K.instanceCount,$n);Jt.renderInstances($e,An,ke)}else Jt.render($e,An)};function tx(b,B,K,W){U!==null&&b.isNodeMaterial&&U.setObject(W,b),Ge===!0&&Ae.setState(b,K,!1),b.transparent===!0&&b.side===Ar&&b.forceSinglePass===!1?(b.side=li,b.needsUpdate=!0,Nu(b,B,W),b.side=wr,b.needsUpdate=!0,Nu(b,B,W),b.side=Ar):Nu(b,B,W)}this.compile=function(b,B,K=null){K===null&&(K=b),U!==null&&U.renderStart(b,B,K),E=me.get(K),E.init(B),y.push(E),K.traverseVisible(function(X){X.isLight&&X.layers.test(B.layers)&&(E.pushLight(X),X.castShadow&&E.pushShadow(X))}),b!==K&&b.traverseVisible(function(X){X.isLight&&X.layers.test(B.layers)&&(E.pushLight(X),X.castShadow&&E.pushShadow(X))}),E.setupLights(),U!==null&&U.updateLights(E.state.lightsArray),mt=this.localClippingEnabled,Ge=Ae.init(this.clippingPlanes,mt),Ge===!0&&Ae.setGlobalState(this.clippingPlanes,B),U!==null&&We.render(E.state.shadowsArray,K,B);let W=new Set;return b.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;let Fe=X.material;if(Fe)if(Array.isArray(Fe))for(let ze=0;ze<Fe.length;ze++){let Ne=Fe[ze];tx(Ne,K,B,X),W.add(Ne)}else tx(Fe,K,B,X),W.add(Fe)}),E=y.pop(),U!==null&&U.renderEnd(),W},this.compileAsync=function(b,B,K=null){let W=this.compile(b,B,K);return new Promise(X=>{function Fe(){if(W.forEach(function(ze){let Xe=L.get(ze).currentProgram;(Xe===void 0||Xe.isReady())&&W.delete(ze)}),W.size===0){X(b);return}setTimeout(Fe,10)}yt.get("KHR_parallel_shader_compile")!==null?Fe():setTimeout(Fe,10)})};let yp=null;function OS(b){yp&&yp(b)}function nx(){oo.stop()}function ix(){oo.start()}let oo=new Ly;oo.setAnimationLoop(OS),typeof self<"u"&&oo.setContext(self),this.setAnimationLoop=function(b){yp=b,He.setAnimationLoop(b),b===null?oo.stop():oo.start()},He.addEventListener("sessionstart",nx),He.addEventListener("sessionend",ix),this.render=function(b,B){if(B!==void 0&&B.isCamera!==!0){rt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;U!==null&&U.renderStart(b,B);let K=He.enabled===!0&&He.isPresenting===!0,W=A!==null&&(q===null||K)&&A.begin(R,q);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),B.parent===null&&B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),He.enabled===!0&&He.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(He.cameraAutoUpdate===!0&&He.updateCamera(B),B=He.getCamera()),b.isScene===!0&&b.onBeforeRender(R,b,B,q),E=me.get(b,y.length),E.init(B),E.state.textureUnits=V.getTextureUnits(),y.push(E),Se.multiplyMatrices(B.projectionMatrix,B.matrixWorldInverse),Te.setFromProjectionMatrix(Se,or,B.reversedDepth),mt=this.localClippingEnabled,Ge=Ae.init(this.clippingPlanes,mt),S=se.get(b,C.length),S.init(),C.push(S),He.enabled===!0&&He.isPresenting===!0){let ze=R.xr.getDepthSensingMesh();ze!==null&&_p(ze,B,-1/0,R.sortObjects)}_p(b,B,0,R.sortObjects),S.finish(),U!==null&&U.updateLights(E.state.lightsArray),R.sortObjects===!0&&S.sort(Me,Ze),Ht=He.enabled===!1||He.isPresenting===!1||He.hasDepthSensing()===!1,Ht&&ft.addToRenderList(S,b),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Ge===!0&&Ae.beginShadows();let X=E.state.shadowsArray;if(We.render(X,b,B),Ge===!0&&Ae.endShadows(),(W&&A.hasRenderPass())===!1){let ze=S.opaque,Ne=S.transmissive;if(E.setupLights(),B.isArrayCamera){let Xe=B.cameras;if(Ne.length>0)for(let je=0,gt=Xe.length;je<gt;je++){let bt=Xe[je];sx(ze,Ne,b,bt)}Ht&&ft.render(b);for(let je=0,gt=Xe.length;je<gt;je++){let bt=Xe[je];rx(S,b,bt,bt.viewport)}}else Ne.length>0&&sx(ze,Ne,b,B),Ht&&ft.render(b),rx(S,b,B)}q!==null&&k===0&&(V.updateMultisampleRenderTarget(q),V.updateRenderTargetMipmap(q)),W&&A.end(R),b.isScene===!0&&b.onAfterRender(R,b,B),Oe.resetDefaultState(),j=-1,J=null,y.pop(),y.length>0?(E=y[y.length-1],V.setTextureUnits(E.state.textureUnits),Ge===!0&&Ae.setGlobalState(R.clippingPlanes,E.state.camera)):E=null,C.pop(),C.length>0?S=C[C.length-1]:S=null,U!==null&&U.renderEnd()};function _p(b,B,K,W){if(b.visible===!1)return;if(b.layers.test(B.layers)){if(b.isGroup)K=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(B);else if(b.isLightProbeGrid)E.pushLightProbeGrid(b);else if(b.isLight)E.pushLight(b),b.castShadow&&E.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||b.intersectsFrustum(Te)){W&&tt.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Se);let ze=Q.update(b),Ne=b.material;Ne.visible&&S.push(b,ze,Ne,K,tt.z,null,B)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||b.intersectsFrustum(Te))){let ze=Q.update(b),Ne=b.material;if(W&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),tt.copy(b.boundingSphere.center)):(ze.boundingSphere===null&&ze.computeBoundingSphere(),tt.copy(ze.boundingSphere.center)),tt.applyMatrix4(b.matrixWorld).applyMatrix4(Se)),Array.isArray(Ne)){let Xe=ze.groups;for(let je=0,gt=Xe.length;je<gt;je++){let bt=Xe[je],$e=Ne[bt.materialIndex];$e&&$e.visible&&S.push(b,ze,$e,K,tt.z,bt,B)}}else Ne.visible&&S.push(b,ze,Ne,K,tt.z,null,B)}}let Fe=b.children;for(let ze=0,Ne=Fe.length;ze<Ne;ze++)_p(Fe[ze],B,K,W)}function rx(b,B,K,W){let{opaque:X,transmissive:Fe,transparent:ze}=b;E.setupLightsView(K),Ge===!0&&Ae.setGlobalState(R.clippingPlanes,K),W&&v.viewport(ne.copy(W)),X.length>0&&Du(X,B,K),Fe.length>0&&Du(Fe,B,K),ze.length>0&&Du(ze,B,K),v.buffers.depth.setTest(!0),v.buffers.depth.setMask(!0),v.buffers.color.setMask(!0),v.setPolygonOffset(!1)}function sx(b,B,K,W){if((K.isScene===!0?K.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[W.id]===void 0){let $e=yt.has("EXT_color_buffer_half_float")||yt.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[W.id]=new Tn(1,1,{generateMipmaps:!0,type:$e?Kn:Ci,minFilter:Us,samples:Math.max(4,I.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Mt.workingColorSpace})}let Fe=E.state.transmissionRenderTarget[W.id],ze=W.viewport||ne;Fe.setSize(ze.z*R.transmissionResolutionScale,ze.w*R.transmissionResolutionScale);let Ne=R.getRenderTarget(),Xe=R.getActiveCubeFace(),je=R.getActiveMipmapLevel();R.setRenderTarget(Fe),R.getClearColor(lt),Ve=R.getClearAlpha(),Ve<1&&R.setClearColor(16777215,.5),R.clear(),Ht&&ft.render(K);let gt=R.toneMapping;R.toneMapping=Ri;let bt=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),E.setupLightsView(W),Ge===!0&&Ae.setGlobalState(R.clippingPlanes,W),Du(b,K,W),V.updateMultisampleRenderTarget(Fe),V.updateRenderTargetMipmap(Fe),yt.has("WEBGL_multisampled_render_to_texture")===!1){let $e=!1;for(let Ut=0,An=B.length;Ut<An;Ut++){let on=B[Ut],{object:Jt,geometry:$n,material:ke,group:ri}=on;if(ke.side===Ar&&Jt.layers.test(W.layers)){let Rt=ke.side;ke.side=li,ke.needsUpdate=!0,ox(Jt,K,W,$n,ke,ri),ke.side=Rt,ke.needsUpdate=!0,$e=!0}}$e===!0&&(V.updateMultisampleRenderTarget(Fe),V.updateRenderTargetMipmap(Fe))}R.setRenderTarget(Ne,Xe,je),R.setClearColor(lt,Ve),bt!==void 0&&(W.viewport=bt),R.toneMapping=gt}function Du(b,B,K){let W=B.isScene===!0?B.overrideMaterial:null;for(let X=0,Fe=b.length;X<Fe;X++){let ze=b[X],{object:Ne,geometry:Xe,group:je}=ze,gt=ze.material;gt.allowOverride===!0&&W!==null&&(gt=W),Ne.layers.test(K.layers)&&ox(Ne,B,K,Xe,gt,je)}}function ox(b,B,K,W,X,Fe){U!==null&&X.isNodeMaterial&&U.setObject(b,X),b.onBeforeRender(R,B,K,W,X,Fe),b.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),X.onBeforeRender(R,B,K,W,b,Fe),X.transparent===!0&&X.side===Ar&&X.forceSinglePass===!1?(X.side=li,X.needsUpdate=!0,R.renderBufferDirect(K,B,W,X,b,Fe),X.side=wr,X.needsUpdate=!0,R.renderBufferDirect(K,B,W,X,b,Fe),X.side=Ar):R.renderBufferDirect(K,B,W,X,b,Fe),b.onAfterRender(R,B,K,W,X,Fe)}function Nu(b,B,K){B.isScene!==!0&&(B=$t);let W=L.get(b),X=E.state.lights,Fe=E.state.shadowsArray,ze=X.state.version,Ne=ye.getParameters(b,X.state,Fe,B,K,E.state.lightProbeGridArray),Xe=ye.getProgramCacheKey(Ne),je=W.programs;W.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?B.environment:null,W.fog=B.fog;let gt=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;W.envMap=oe.get(b.envMap||W.environment,gt),W.envMapRotation=W.environment!==null&&b.envMap===null?B.environmentRotation:b.envMapRotation,je===void 0&&(b.addEventListener("dispose",mr),je=new Map,W.programs=je);let bt=je.get(Xe);if(bt!==void 0){if(W.currentProgram===bt&&W.lightsStateVersion===ze)return lx(b,Ne),bt}else Ne.uniforms=ye.getUniforms(b),U!==null&&b.isNodeMaterial&&U.build(b,K,Ne),b.onBeforeCompile(Ne,R),bt=ye.acquireProgram(Ne,Xe),je.set(Xe,bt),W.uniforms=Ne.uniforms;let $e=W.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&($e.clippingPlanes=Ae.uniform),lx(b,Ne),W.needsLights=kS(b),W.lightsStateVersion=ze,W.needsLights&&($e.ambientLightColor.value=X.state.ambient,$e.lightProbe.value=X.state.probe,$e.sunLights.value=X.state.sun,$e.sunLightShadows.value=X.state.sunShadow,$e.directionalLights.value=X.state.directional,$e.directionalLightShadows.value=X.state.directionalShadow,$e.spotLights.value=X.state.spot,$e.spotLightShadows.value=X.state.spotShadow,$e.rectAreaLights.value=X.state.rectArea,$e.ltc_1.value=X.state.rectAreaLTC1,$e.ltc_2.value=X.state.rectAreaLTC2,$e.pointLights.value=X.state.point,$e.pointLightShadows.value=X.state.pointShadow,$e.hemisphereLights.value=X.state.hemi,$e.sunShadowMatrix.value=X.state.sunShadowMatrix,$e.sunShadowCascade.value=X.state.sunShadowCascade,$e.directionalShadowMatrix.value=X.state.directionalShadowMatrix,$e.spotLightMatrix.value=X.state.spotLightMatrix,$e.spotLightMap.value=X.state.spotLightMap,$e.pointShadowMatrix.value=X.state.pointShadowMatrix),W.lightProbeGrid=E.state.lightProbeGridArray.length>0,W.currentProgram=bt,W.uniformsList=null,bt}function ax(b){if(b.uniformsList===null){let B=b.currentProgram.getUniforms();b.uniformsList=La.seqWithValue(B.seq,b.uniforms)}return b.uniformsList}function lx(b,B){let K=L.get(b);K.outputColorSpace=B.outputColorSpace,K.batching=B.batching,K.batchingColor=B.batchingColor,K.instancing=B.instancing,K.instancingColor=B.instancingColor,K.instancingMorph=B.instancingMorph,K.skinning=B.skinning,K.morphTargets=B.morphTargets,K.morphNormals=B.morphNormals,K.morphColors=B.morphColors,K.morphTargetsCount=B.morphTargetsCount,K.numClippingPlanes=B.numClippingPlanes,K.numIntersection=B.numClipIntersection,K.vertexAlphas=B.vertexAlphas,K.vertexTangents=B.vertexTangents,K.toneMapping=B.toneMapping}function FS(b,B){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;x.setFromMatrixPosition(B.matrixWorld);for(let K=0,W=b.length;K<W;K++){let X=b[K];if(X.texture!==null&&X.boundingBox.containsPoint(x))return X}return null}function US(b,B,K,W,X){B.isScene!==!0&&(B=$t),V.resetTextureUnits();let Fe=B.fog,ze=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?B.environment:null,Ne=q===null?R.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:Mt.workingColorSpace,Xe=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,je=oe.get(W.envMap||ze,Xe),gt=W.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,bt=!!K.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),$e=!!K.morphAttributes.position,Ut=!!K.morphAttributes.normal,An=!!K.morphAttributes.color,on=Ri;W.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(on=R.toneMapping);let Jt=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,$n=Jt!==void 0?Jt.length:0,ke=L.get(W),ri=E.state.lights;if(Ge===!0&&(mt===!0||b!==J)){let sn=b===J&&W.id===j;Ae.setState(W,b,sn)}let Rt=!1;W.version===ke.__version?(ke.needsLights&&ke.lightsStateVersion!==ri.state.version||ke.outputColorSpace!==Ne||X.isBatchedMesh&&ke.batching===!1||!X.isBatchedMesh&&ke.batching===!0||X.isBatchedMesh&&ke.batchingColor===!0&&X._colorsTexture===null||X.isBatchedMesh&&ke.batchingColor===!1&&X._colorsTexture!==null||X.isInstancedMesh&&ke.instancing===!1||!X.isInstancedMesh&&ke.instancing===!0||X.isSkinnedMesh&&ke.skinning===!1||!X.isSkinnedMesh&&ke.skinning===!0||X.isInstancedMesh&&ke.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&ke.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&ke.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&ke.instancingMorph===!1&&X.morphTexture!==null||ke.envMap!==je||W.fog===!0&&ke.fog!==Fe||ke.numClippingPlanes!==void 0&&(ke.numClippingPlanes!==Ae.numPlanes||ke.numIntersection!==Ae.numIntersection)||ke.vertexAlphas!==gt||ke.vertexTangents!==bt||ke.morphTargets!==$e||ke.morphNormals!==Ut||ke.morphColors!==An||ke.toneMapping!==on||ke.morphTargetsCount!==$n||!!ke.lightProbeGrid!=E.state.lightProbeGridArray.length>0)&&(Rt=!0):(Rt=!0,ke.__version=W.version);let Bi=ke.currentProgram;Rt===!0&&(Bi=Nu(W,B,X),U&&W.isNodeMaterial&&U.onUpdateProgram(W,Bi,ke));let gr=!1,ys=!1,$o=!1,Yt=Bi.getUniforms(),yn=ke.uniforms;if(v.useProgram(Bi.program)&&(gr=!0,ys=!0,$o=!0),W.id!==j&&(j=W.id,ys=!0),ke.needsLights){let sn=FS(E.state.lightProbeGridArray,X);ke.lightProbeGrid!==sn&&(ke.lightProbeGrid=sn,ys=!0)}if(gr||J!==b){v.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),Yt.setValue(F,"projectionMatrix",b.projectionMatrix),Yt.setValue(F,"viewMatrix",b.matrixWorldInverse);let Ms=Yt.map.cameraPosition;Ms!==void 0&&Ms.setValue(F,we.setFromMatrixPosition(b.matrixWorld)),I.logarithmicDepthBuffer&&Yt.setValue(F,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&Yt.setValue(F,"isOrthographic",b.isOrthographicCamera===!0),J!==b&&(J=b,ys=!0,$o=!0)}if(ke.needsLights&&(ri.state.sunShadowMap.length>0&&Yt.setValue(F,"sunShadowMap",ri.state.sunShadowMap,V),ri.state.directionalShadowMap.length>0&&Yt.setValue(F,"directionalShadowMap",ri.state.directionalShadowMap,V),ri.state.spotShadowMap.length>0&&Yt.setValue(F,"spotShadowMap",ri.state.spotShadowMap,V),ri.state.pointShadowMap.length>0&&Yt.setValue(F,"pointShadowMap",ri.state.pointShadowMap,V)),X.isSkinnedMesh){Yt.setOptional(F,X,"bindMatrix"),Yt.setOptional(F,X,"bindMatrixInverse");let sn=X.skeleton;sn&&(sn.boneTexture===null&&sn.computeBoneTexture(),Yt.setValue(F,"boneTexture",sn.boneTexture,V))}X.isBatchedMesh&&(Yt.setOptional(F,X,"batchingTexture"),Yt.setValue(F,"batchingTexture",X._matricesTexture,V),Yt.setOptional(F,X,"batchingIdTexture"),Yt.setValue(F,"batchingIdTexture",X._indirectTexture,V),Yt.setOptional(F,X,"batchingColorTexture"),X._colorsTexture!==null&&Yt.setValue(F,"batchingColorTexture",X._colorsTexture,V));let _s=K.morphAttributes;if((_s.position!==void 0||_s.normal!==void 0||_s.color!==void 0)&&z.update(X,K,Bi),(ys||ke.receiveShadow!==X.receiveShadow)&&(ke.receiveShadow=X.receiveShadow,Yt.setValue(F,"receiveShadow",X.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&B.environment!==null&&(yn.envMapIntensity.value=B.environmentIntensity),yn.dfgLUT!==void 0&&(yn.dfgLUT.value=YR()),ys){if(Yt.setValue(F,"toneMappingExposure",R.toneMappingExposure),ke.needsLights&&BS(yn,$o),Fe&&W.fog===!0&&Be.refreshFogUniforms(yn,Fe),Be.refreshMaterialUniforms(yn,W,ee,$,E.state.transmissionRenderTarget[b.id]),ke.needsLights&&ke.lightProbeGrid){let sn=ke.lightProbeGrid;yn.probesSH.value=sn.texture,yn.probesMin.value.copy(sn.boundingBox.min),yn.probesMax.value.copy(sn.boundingBox.max),yn.probesResolution.value.copy(sn.resolution)}La.upload(F,ax(ke),yn,V)}if(W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(La.upload(F,ax(ke),yn,V),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&Yt.setValue(F,"center",X.center),Yt.setValue(F,"modelViewMatrix",X.modelViewMatrix),Yt.setValue(F,"normalMatrix",X.normalMatrix),Yt.setValue(F,"modelMatrix",X.matrixWorld),W.uniformsGroups!==void 0){let sn=W.uniformsGroups;for(let Ms=0,Yo=sn.length;Ms<Yo;Ms++){let ux=sn[Ms];ce.update(ux,Bi),ce.bind(ux,Bi)}}return Bi}function BS(b,B){b.ambientLightColor.needsUpdate=B,b.lightProbe.needsUpdate=B,b.sunLights.needsUpdate=B,b.sunLightShadows.needsUpdate=B,b.directionalLights.needsUpdate=B,b.directionalLightShadows.needsUpdate=B,b.pointLights.needsUpdate=B,b.pointLightShadows.needsUpdate=B,b.spotLights.needsUpdate=B,b.spotLightShadows.needsUpdate=B,b.rectAreaLights.needsUpdate=B,b.hemisphereLights.needsUpdate=B}function kS(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return O},this.getActiveMipmapLevel=function(){return k},this.getRenderTarget=function(){return q},this.setRenderTargetTextures=function(b,B,K){let W=L.get(b);W.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),L.get(b.texture).__webglTexture=B,L.get(b.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:K,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,B){let K=L.get(b);K.__webglFramebuffer=B,K.__useDefaultFramebuffer=B===void 0},this.setRenderTarget=function(b,B=0,K=0){q=b,O=B,k=K;let W=null,X=!1,Fe=!1;if(b){let Ne=L.get(b);if(Ne.__useDefaultFramebuffer!==void 0){v.bindFramebuffer(F.FRAMEBUFFER,Ne.__webglFramebuffer),ne.copy(b.viewport),Ue.copy(b.scissor),Pe=b.scissorTest,v.viewport(ne),v.scissor(Ue),v.setScissorTest(Pe),j=-1;return}else if(Ne.__webglFramebuffer===void 0)V.setupRenderTarget(b);else if(Ne.__hasExternalTextures)V.rebindTextures(b,L.get(b.texture).__webglTexture,L.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){let gt=b.depthTexture;if(Ne.__boundDepthTexture!==gt){if(gt!==null&&L.has(gt)&&(b.width!==gt.image.width||b.height!==gt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");V.setupDepthRenderbuffer(b)}}let Xe=b.texture;(Xe.isData3DTexture||Xe.isDataArrayTexture||Xe.isCompressedArrayTexture)&&(Fe=!0);let je=L.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(je[B])?W=je[B][K]:W=je[B],X=!0):b.samples>0&&V.useMultisampledRTT(b)===!1?W=L.get(b).__webglMultisampledFramebuffer:Array.isArray(je)?W=je[K]:W=je,ne.copy(b.viewport),Ue.copy(b.scissor),Pe=b.scissorTest}else ne.copy(be).multiplyScalar(ee).floor(),Ue.copy(re).multiplyScalar(ee).floor(),Pe=ue;if(K!==0&&(W=G),v.bindFramebuffer(F.FRAMEBUFFER,W)&&v.drawBuffers(b,W),v.viewport(ne),v.scissor(Ue),v.setScissorTest(Pe),X){let Ne=L.get(b.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_CUBE_MAP_POSITIVE_X+B,Ne.__webglTexture,K)}else if(Fe){let Ne=B;for(let Xe=0;Xe<b.textures.length;Xe++){let je=L.get(b.textures[Xe]);F.framebufferTextureLayer(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0+Xe,je.__webglTexture,K,Ne)}}else if(b!==null&&K!==0){let Ne=L.get(b.texture);F.framebufferTexture2D(F.FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,Ne.__webglTexture,K)}j=-1};function cx(b){let B=L.get(b);return(B.__readFormat!==b.format||B.__readType!==b.type)&&(B.__readFormat=b.format,B.__readType=b.type,B.__formatReadable=I.textureFormatReadable(b.format),B.__typeReadable=I.textureTypeReadable(b.type)),B}this.readRenderTargetPixels=function(b,B,K,W,X,Fe,ze,Ne=0){if(!(b&&b.isWebGLRenderTarget)){rt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Xe=L.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ze!==void 0&&(Xe=Xe[ze]),Xe){v.bindFramebuffer(F.FRAMEBUFFER,Xe);try{let je=b.textures[Ne],gt=je.format,bt=je.type;b.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Ne);let $e=cx(je);if($e.__formatReadable===!1){rt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if($e.__typeReadable===!1){rt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}B>=0&&B<=b.width-W&&K>=0&&K<=b.height-X&&F.readPixels(B,K,W,X,Ie.convert(gt),Ie.convert(bt),Fe)}finally{let je=q!==null?L.get(q).__webglFramebuffer:null;v.bindFramebuffer(F.FRAMEBUFFER,je)}}},this.readRenderTargetPixelsAsync=async function(b,B,K,W,X,Fe,ze,Ne=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Xe=L.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ze!==void 0&&(Xe=Xe[ze]),Xe)if(B>=0&&B<=b.width-W&&K>=0&&K<=b.height-X){v.bindFramebuffer(F.FRAMEBUFFER,Xe);let je=b.textures[Ne],gt=je.format,bt=je.type;b.textures.length>1&&F.readBuffer(F.COLOR_ATTACHMENT0+Ne);let $e=cx(je);if($e.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if($e.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ut=F.createBuffer();F.bindBuffer(F.PIXEL_PACK_BUFFER,Ut),F.bufferData(F.PIXEL_PACK_BUFFER,Fe.byteLength,F.STREAM_READ),F.readPixels(B,K,W,X,Ie.convert(gt),Ie.convert(bt),0),F.bindBuffer(F.PIXEL_PACK_BUFFER,null);let An=q!==null?L.get(q).__webglFramebuffer:null;v.bindFramebuffer(F.FRAMEBUFFER,An);let on=F.fenceSync(F.SYNC_GPU_COMMANDS_COMPLETE,0);return F.flush(),await sy(F,on,4),F.bindBuffer(F.PIXEL_PACK_BUFFER,Ut),F.getBufferSubData(F.PIXEL_PACK_BUFFER,0,Fe),F.bindBuffer(F.PIXEL_PACK_BUFFER,null),F.deleteBuffer(Ut),F.deleteSync(on),Fe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,B=null,K=0){let W=Math.pow(2,-K),X=Math.floor(b.image.width*W),Fe=Math.floor(b.image.height*W),ze=B!==null?B.x:0,Ne=B!==null?B.y:0;V.setTexture2D(b,0),F.copyTexSubImage2D(F.TEXTURE_2D,K,0,0,ze,Ne,X,Fe),v.unbindTexture()},this.copyTextureToTexture=function(b,B,K=null,W=null,X=0,Fe=0){let ze,Ne,Xe,je,gt,bt,$e,Ut,An,on=b.isCompressedTexture?b.mipmaps[Fe]:b.image;if(K!==null)ze=K.max.x-K.min.x,Ne=K.max.y-K.min.y,Xe=K.isBox3?K.max.z-K.min.z:1,je=K.min.x,gt=K.min.y,bt=K.isBox3?K.min.z:0;else{let yn=Math.pow(2,-X);ze=Math.floor(on.width*yn),Ne=Math.floor(on.height*yn),b.isDataArrayTexture?Xe=on.depth:b.isData3DTexture?Xe=Math.floor(on.depth*yn):Xe=1,je=0,gt=0,bt=0}W!==null?($e=W.x,Ut=W.y,An=W.z):($e=0,Ut=0,An=0);let Jt=Ie.convert(B.format),$n=Ie.convert(B.type),ke;B.isData3DTexture?(V.setTexture3D(B,0),ke=F.TEXTURE_3D):B.isDataArrayTexture||B.isCompressedArrayTexture?(V.setTexture2DArray(B,0),ke=F.TEXTURE_2D_ARRAY):(V.setTexture2D(B,0),ke=F.TEXTURE_2D),v.activeTexture(F.TEXTURE0),v.pixelStorei(F.UNPACK_FLIP_Y_WEBGL,B.flipY),v.pixelStorei(F.UNPACK_PREMULTIPLY_ALPHA_WEBGL,B.premultiplyAlpha),v.pixelStorei(F.UNPACK_ALIGNMENT,B.unpackAlignment);let ri=v.getParameter(F.UNPACK_ROW_LENGTH),Rt=v.getParameter(F.UNPACK_IMAGE_HEIGHT),Bi=v.getParameter(F.UNPACK_SKIP_PIXELS),gr=v.getParameter(F.UNPACK_SKIP_ROWS),ys=v.getParameter(F.UNPACK_SKIP_IMAGES);v.pixelStorei(F.UNPACK_ROW_LENGTH,on.width),v.pixelStorei(F.UNPACK_IMAGE_HEIGHT,on.height),v.pixelStorei(F.UNPACK_SKIP_PIXELS,je),v.pixelStorei(F.UNPACK_SKIP_ROWS,gt),v.pixelStorei(F.UNPACK_SKIP_IMAGES,bt);let $o=b.isDataArrayTexture||b.isData3DTexture,Yt=B.isDataArrayTexture||B.isData3DTexture;if(b.isDepthTexture){let yn=L.get(b),_s=L.get(B),sn=L.get(yn.__renderTarget),Ms=L.get(_s.__renderTarget);v.bindFramebuffer(F.READ_FRAMEBUFFER,sn.__webglFramebuffer),v.bindFramebuffer(F.DRAW_FRAMEBUFFER,Ms.__webglFramebuffer);for(let Yo=0;Yo<Xe;Yo++)$o&&(F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,L.get(b).__webglTexture,X,bt+Yo),F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,L.get(B).__webglTexture,Fe,An+Yo)),F.blitFramebuffer(je,gt,ze,Ne,$e,Ut,ze,Ne,F.DEPTH_BUFFER_BIT,F.NEAREST);v.bindFramebuffer(F.READ_FRAMEBUFFER,null),v.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else if(X!==0||b.isRenderTargetTexture||L.has(b)){let yn=L.get(b),_s=L.get(B);v.bindFramebuffer(F.READ_FRAMEBUFFER,N),v.bindFramebuffer(F.DRAW_FRAMEBUFFER,H);for(let sn=0;sn<Xe;sn++)$o?F.framebufferTextureLayer(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,yn.__webglTexture,X,bt+sn):F.framebufferTexture2D(F.READ_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,yn.__webglTexture,X),Yt?F.framebufferTextureLayer(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,_s.__webglTexture,Fe,An+sn):F.framebufferTexture2D(F.DRAW_FRAMEBUFFER,F.COLOR_ATTACHMENT0,F.TEXTURE_2D,_s.__webglTexture,Fe),X!==0?F.blitFramebuffer(je,gt,ze,Ne,$e,Ut,ze,Ne,F.COLOR_BUFFER_BIT,F.NEAREST):Yt?F.copyTexSubImage3D(ke,Fe,$e,Ut,An+sn,je,gt,ze,Ne):F.copyTexSubImage2D(ke,Fe,$e,Ut,je,gt,ze,Ne);v.bindFramebuffer(F.READ_FRAMEBUFFER,null),v.bindFramebuffer(F.DRAW_FRAMEBUFFER,null)}else Yt?b.isDataTexture||b.isData3DTexture?F.texSubImage3D(ke,Fe,$e,Ut,An,ze,Ne,Xe,Jt,$n,on.data):B.isCompressedArrayTexture?F.compressedTexSubImage3D(ke,Fe,$e,Ut,An,ze,Ne,Xe,Jt,on.data):F.texSubImage3D(ke,Fe,$e,Ut,An,ze,Ne,Xe,Jt,$n,on):b.isDataTexture?F.texSubImage2D(F.TEXTURE_2D,Fe,$e,Ut,ze,Ne,Jt,$n,on.data):b.isCompressedTexture?F.compressedTexSubImage2D(F.TEXTURE_2D,Fe,$e,Ut,on.width,on.height,Jt,on.data):F.texSubImage2D(F.TEXTURE_2D,Fe,$e,Ut,ze,Ne,Jt,$n,on);v.pixelStorei(F.UNPACK_ROW_LENGTH,ri),v.pixelStorei(F.UNPACK_IMAGE_HEIGHT,Rt),v.pixelStorei(F.UNPACK_SKIP_PIXELS,Bi),v.pixelStorei(F.UNPACK_SKIP_ROWS,gr),v.pixelStorei(F.UNPACK_SKIP_IMAGES,ys),Fe===0&&B.generateMipmaps&&F.generateMipmap(ke),v.unbindTexture()},this.initRenderTarget=function(b){L.get(b).__webglFramebuffer===void 0&&V.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?V.setTextureCube(b,0):b.isData3DTexture?V.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?V.setTexture2DArray(b,0):V.setTexture2D(b,0),v.unbindTexture()},this.resetState=function(){O=0,k=0,q=null,v.reset(),Oe.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return or}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let n=this.getContext();n.drawingBufferColorSpace=Mt._getDrawingBufferColorSpace(e),n.unpackColorSpace=Mt._getUnpackColorSpace()}};var Qn=Object.freeze({DEFAULT:0,EMISSIVE:1,NOFOG:2}),xi=()=>({value:new St(0,0,0)}),xe={uTime:{value:0},uBreath:{value:.5},uLamp:{value:new P(0,0,3)},uLampOn:{value:1},uCamPos:{value:new P},uResolution:{value:new ot(1,1)},uPixelRatio:{value:1},uPxPerUnit:{value:1},uWorldScale:{value:1},uFogDensity:{value:.00485},uInvert:{value:0},uNight:{value:0},uEmissivePass:{value:0},cVoid:xi(),cAbyss:xi(),cDeep:xi(),cSteel:xi(),cSlate:xi(),cPewter:xi(),cSilver:xi(),cWhite:xi(),cObsidian:xi(),cEmber:xi(),cEmberDeep:xi(),cElectrum:xi(),cPaper:xi(),cInk:xi()};function nd(t){return"c"+t.charAt(0).toUpperCase()+t.slice(1)}function ei(t){return xe[nd(t)]||xe.cSilver}function Ao(){let t=new Array(7);for(let e=0;e<7;e++)t[e]=new At;return{value:t}}function Eo(){return{value:[1,1,1,1,1,1,1]}}var c0=new Map;function Wi(t,e){t&&c0.set(t,Math.max(0,e||0))}function bc(t){c0.delete(t)}function ky(){let t=0;for(let e of c0.values())t+=e;return t/1048576}var cn=Object.freeze({..._x});function Tt(t){return t<=0?0:t>=1?1:t}function Ot(t,e,n){return t+(e-t)*n}function To(t,e,n){if(t===e)return n<t?0:1;let i=Tt((n-t)/(e-t));return i*i*(3-2*i)}var Pi=`
uniform float uFogDensity; uniform vec3 cAbyss;
float fogVis(float dist) { float f = uFogDensity * dist; return exp(-f * f); }
vec3 applyFog(vec3 col, float dist) { return mix(cAbyss, col, fogVis(dist)); }`,is=null,Rr={density:xe.uFogDensity.value,set(t){is&&(is.cancel(),is=null),Rr.density=t,xe.uFogDensity.value=t},to(t,e,n=cn.camera){is&&(is.cancel(),is=null);let i=Rr.density,r=Fn(e,s=>{Rr.density=i+(t-i)*s,xe.uFogDensity.value=Rr.density},n);return is=r,r.done.then(()=>{is===r&&(is=null)})}};var ti=Object.freeze({T3:Object.freeze({dprCap:2,msaa:!0,grains:24576,stars:Object.freeze({signal:2e3,zenith:3e3}),bloom:"kawase",lattice:1,atlas:1024,contours:12,ringTex:Object.freeze([2048,128]),labels:24,sandText:!0}),T2:Object.freeze({dprCap:1.5,msaa:!0,grains:16384,stars:Object.freeze({signal:2e3,zenith:3e3}),bloom:"sprites",lattice:1,atlas:1024,contours:12,ringTex:Object.freeze([2048,128]),labels:24,sandText:!0}),T1:Object.freeze({dprCap:1.25,msaa:!1,grains:8192,stars:Object.freeze({signal:800,zenith:1200}),bloom:"sprites",lattice:.5,atlas:512,contours:8,ringTex:Object.freeze([1024,64]),labels:16,sandText:!1})}),Ec=["T1","T2","T3"],qR=/SwiftShader|llvmpipe|Software|Mali-4|Adreno \(TM\) 3/i,rs=en.governor;function Wy(){try{return matchMedia("(pointer: coarse)").matches&&Math.min(window.innerWidth,window.innerHeight)<=600}catch{return!1}}function u0(t){let e=ti[t];return e?Wy()?Object.freeze({...e,msaa:t==="T2"?!1:e.msaa,labels:16}):e:null}function zy(t){return null}var Sc=null,ad=!1,Xy=!0,h0=-1e9,id=null,ld=0,Vy=!1,Gy=new Float32Array(rs.windowFrames),Na=0,Oa=0,wc=0,Ac=-1,Fa=-1,rd=-1;function f0(){Na=0,Oa=0,wc=0,Ac=-1,Fa=-1}var $y=30,Hy=new Float32Array($y),sd=0,Ua="off",Yy=0,od=null;function jR(t,e){let n=Array.prototype.slice.call(t,0,e).sort((i,r)=>i-r);return e?e%2?n[(e-1)/2]:(n[e/2-1]+n[e/2])/2:0}function qy(t){let e=Ec.indexOf(t);return e>0?Ec[e-1]:t}function ZR(t){let e=Ec.indexOf(t);return e>=0&&e<Ec.length-1?Ec[e+1]:t}function KR(){let t=fe.now,e=rd<0?0:t-rd;if(rd=t,!(at.tier==="T0"||e<=0)){if(id&&t-h0>=300){let n=id;id=null,at.setTier(n,"deferred")}if(Ua==="wait"&&t>=Yy&&(Ua="run"),Ua==="run"){if(Hy[sd++]=e,sd>=$y){Ua="done";let n=jR(Hy,sd),i=at.tier;n>20?i="T1":n>=12&&(i=qy(i)),i!==at.tier&&at.setTier(i,`benchmark ${n.toFixed(1)} ms`),od&&(od(at.tier),od=null),f0(),ld=t}return}if(!ad&&t-ld>rs.upgradeAfterMs&&Y.data&&Y.data.tier!==at.tier)try{Y.set("tier",at.tier)}catch{}ad||!Xy||at.governor.update(e/1e3)}}var at={tier:"T2",params:ti.T2,detect(){let t="T0",e=null;try{let i=document.createElement("canvas").getContext("webgl2");if(!i)throw new Error("no WebGL2");let r="";try{let g=i.getExtension("WEBGL_debug_renderer_info");r=String(g?i.getParameter(g.UNMASKED_RENDERER_WEBGL):i.getParameter(i.RENDERER)||"")}catch{r=""}try{let g=i.getExtension("WEBGL_lose_context");g&&g.loseContext()}catch{}let s=qR.test(r),o=navigator.hardwareConcurrency||4,a=navigator.deviceMemory,l=(()=>{try{return matchMedia("(pointer: fine)").matches}catch{return!1}})(),c=Wy(),u=Y.data&&Y.data.tier;u?t=u:s||o<=4||a!=null&&a<=3?t="T1":l&&o>=8?t="T3":(!c||a!=null&&a>=6,t="T2"),s&&(t="T1");let f=zy("tier");if(f&&/^T[0-3]$/.test(f)&&(t=f,ad=!0),zy("gov")==="0"&&(Xy=!1),t==="T0")throw new Error("forced T0");let h=u0(t),d=document.getElementById("gl");if(e=d&&d.getContext("webgl2",{antialias:h.msaa,alpha:!0,premultipliedAlpha:!0,depth:!0,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1}),!e)throw new Error("context creation failed")}catch{t="T0",e=null}return at.tier=t,at.params=u0(t),te.tier=t,{tier:t,gl:e}},benchmark(){return ad||at.tier==="T0"||Ua!=="off"?Promise.resolve(at.tier):(Ua="wait",sd=0,Yy=fe.now+600,new Promise(t=>{od=t}))},setTier(t,e=""){if(!ti[t]||t===at.tier||at.tier==="T0")return;if(te.phase==="transition"&&fe.now-h0<300){id=t;return}let n=at.tier;at.tier=t,at.params=u0(t),te.tier=t,at.governor.dropSteps=0,ld=fe.now,f0();let i=Sc&&Sc.renderer;if(i)try{i.setTier(t),i.setDprDrop(0)}catch(r){xt("quality:renderer",r)}Ee.emit("tier:change",{tier:t,prev:n})},governor:{fps:60,dropSteps:0,update(t){let e=t*1e3;if(!(e>0)||(Na===rs.windowFrames?wc-=Gy[Oa]:Na++,Gy[Oa]=e,wc+=e,Oa=(Oa+1)%rs.windowFrames,Na<rs.windowFrames))return;let n=1e3/(wc/Na);at.governor.fps=n;let i=fe.now;if(n<rs.lowFps){Fa=-1,Ac<0&&(Ac=i);let r=Sc&&Sc.renderer,s=Math.min(typeof devicePixelRatio=="number"?devicePixelRatio:1,ti[at.tier].dprCap);if(i-Ac>rs.dropAfterMs&&at.tier!=="T1"){at.setTier(qy(at.tier),`governor ${n.toFixed(0)} fps`);return}if(r&&s-en.dprStep*(at.governor.dropSteps+1)>=1-1e-6){at.governor.dropSteps++;try{r.setDprDrop(at.governor.dropSteps)}catch(o){xt("quality:dpr",o)}Na=0,Oa=0,wc=0}}else Ac=-1,n>rs.highFps&&!Vy?(Fa<0&&(Fa=i),i-Fa>rs.upgradeAfterMs&&at.tier!=="T3"&&(Vy=!0,at.setTier(ZR(at.tier),`governor ${n.toFixed(0)} fps`))):Fa=-1}},init(t){Sc=t,ld=fe.now,fe.add(KR,It.UI)}};Ee.on("travel:start",()=>{h0=fe.now});Ee.on("visibility",()=>{f0(),rd=-1});var Cr=null;function JR(){if(Cr)return Cr;let t=document.createElement("canvas");t.width=t.height=64;let e=t.getContext("2d"),n=e.createImageData(64,64);for(let i=0;i<64;i++)for(let r=0;r<64;r++){let s=(r+.5)/32-1,o=(i+.5)/32-1,a=Math.min(1,Math.sqrt(s*s+o*o)),l=(.72*Math.exp(-a*a*18)+.28*Math.exp(-a*a*4.2))*(1-a*a)*(1-a),c=(i*64+r)*4;n.data[c]=n.data[c+1]=n.data[c+2]=255,n.data[c+3]=Math.round(255*Math.min(1,l))}return e.putImageData(n,0,0),Cr=new Jr(t),Cr.minFilter=Et,Cr.magFilter=Et,Cr.generateMipmaps=!1,Cr.wrapS=Cr.wrapT=Zn,Wi(Cr,4096*4),Cr}var QR=`
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
}`,eC=`
${Pi}
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
}`,Tc=new Set,d0=null;function jy(){return d0||(d0=new Qr(1,1)),d0}function Zy(t,e){let n={};e&&(n.USE_BATCH=""),t.fog!==!1&&(n.USE_FOG="");let i={uTex:{value:JR()},uColor:ei(t.color||"ember"),uRadius:{value:t.radius!=null?t.radius:.05},uIntensity:{value:t.intensity!=null?t.intensity:1},uNightMix:{value:t.night?1:0},uNightI:{value:t.nightIntensity!=null?t.nightIntensity:.55},uFlash:{value:0},uNight:xe.uNight,cElectrum:xe.cElectrum,cWhite:xe.cWhite,cAbyss:xe.cAbyss,uFogDensity:xe.uFogDensity};return new Lt({uniforms:i,defines:n,vertexShader:QR,fragmentShader:eC,transparent:!0,depthWrite:!1,depthTest:t.depthTest!==!1,blending:Mo,premultipliedAlpha:!0})}function p0(t,e){let n=e==="T3";t.core?(n?t.core.layers.enable(Qn.EMISSIVE):t.core.layers.disable(Qn.EMISSIVE),t._tierHidden=n):(n?t.sprite.layers.enable(Qn.EMISSIVE):t.sprite.layers.disable(Qn.EMISSIVE),t._tierHidden=!1),t._sync()}Ee.on("tier:change",({tier:t})=>{for(let e of Tc)p0(e,t)});function cd(t={}){let e=new jt,n=Zy(t,!1),i=new zt(jy(),n);i.frustumCulled=!1,i.renderOrder=t.renderOrder!=null?t.renderOrder:5,e.add(i),t.core&&e.add(t.core);let r={object:e,sprite:i,core:t.core||null,uniforms:n.uniforms,_tierHidden:!1,_sync(){i.visible=!r._tierHidden&&n.uniforms.uIntensity.value>0},setIntensity(s){n.uniforms.uIntensity.value=s,r._sync()},setColor(s){n.uniforms.uColor=ei(s)},setRadius(s){n.uniforms.uRadius.value=s},setFlash(s){n.uniforms.uFlash.value=s},dispose(){Tc.delete(r),n.dispose(),e.parent&&e.parent.remove(e)}};return Tc.add(r),p0(r,at.tier),r}function ud(t={}){let e=t.positions||new Float32Array(3),n=Math.max(1,Math.floor(e.length/3)),i=jy(),r=new _o;r.setIndex(i.index.clone()),r.setAttribute("position",i.getAttribute("position").clone()),r.setAttribute("uv",i.getAttribute("uv").clone());let s=new ai(new Float32Array(n*3),3);s.array.set(e.subarray(0,n*3)),r.setAttribute("aOffset",s);let o=t.count!=null?Math.min(n,t.count):n;r.instanceCount=o;let a=Zy(t,!0),l=new zt(r,a);l.frustumCulled=!1,l.renderOrder=t.renderOrder!=null?t.renderOrder:5;let c={object:l,sprite:l,core:null,uniforms:a.uniforms,_tierHidden:!1,_sync(){l.visible=o>0&&a.uniforms.uIntensity.value>0},get count(){return o},setCount(u){o=Math.max(0,Math.min(n,u|0)),r.instanceCount=o,c._sync()},setIntensity(u){a.uniforms.uIntensity.value=u,c._sync()},setColor(u){a.uniforms.uColor=ei(u)},setRadius(u){a.uniforms.uRadius.value=u},setPositions(u,f){let h=Math.min(n,f??Math.floor(u.length/3));s.array.set(u.subarray(0,h*3)),s.needsUpdate=!0,c.setCount(h)},dispose(){Tc.delete(c),r.dispose(),a.dispose(),l.parent&&l.parent.remove(l)}};return Tc.add(c),p0(c,at.tier),c}var Ba=" ",ka="−";function ss(t,e,n,i,r,s,o,a,l,c,u,f,h,d,g,_,m,p,M,T,x){let S=wx[t],[E,C]=Ax[t];return Object.freeze({id:t,slug:e,sign:n,stratum:i,num:r,code:s,title:o,titleOpen:a,name:l,nameOpen:c,line:u,alt:S,level:f,giant:h,floor:E,ceil:C,n:d,fog:g,far:_,wet:m,root:p,note:M,hidden:T,parent:x,anchor:Object.freeze(new P(0,S,0))})}var ae=Object.freeze({SIGNAL:ss("SIGNAL","signal","S",0,"01","SIGNAL","СВЯЗЬ",null,"Связь",null,"передачи и сигналы",`+1${Ba}090.00`,`+1${Ba}090`,3,.014,400,.22,220,392,!1,null),ARCHIVE:ss("ARCHIVE","archive","A",1,"02","ARCHIVE","ЛЕТОПИСЬ",null,"Летопись",null,"легенды, моменты, шутки","+810.00","+810",5,.006,500,.22,196,440,!1,null),MEMBERS:ss("MEMBERS","members","M",2,"03","MEMBERS","КЛАН",null,"Клан",null,"кто с нами","+460.00","+460",7,.0034,800,.22,164.81,493.88,!1,null),CORE:ss("CORE","core","•",3,"04","CORE","ЯДРО",null,"Ядро",null,"имя, девиз, всё о нас","±0.00","±0",12,.00485,700,.22,146.83,587.33,!1,null),VOYAGES:ss("VOYAGES","voyages","V",4,"05","VOYAGES","ВЫЛАЗКИ",null,"Вылазки",null,"экспедиции и зонды",`${ka}460.00`,`${ka}460`,7,.0034,800,.3,123.47,659.25,!1,null),INSIGNIA:ss("INSIGNIA","insignia","I",5,"06","INSIGNIA","ХРАНИЛИЩЕ",null,"Хранилище",null,"трофеи и находки",`${ka}810.00`,`${ka}810`,5,.006,500,0,110,783.99,!1,null),NADIR:ss("NADIR","nadir","N",6,"07","NADIR","ЗАПЕЧАТАНО","ИСТОК","Запечатано","Исток","осколков {k} из 5",`${ka}1${Ba}090.00`,`${ka}1${Ba}090`,3,.014,400,.22,98,880,!1,null),ZENITH:ss("ZENITH","zenith",null,-1,"00","ZENITH","НАД ВСЕМ",null,"Над всем",null,"—",`+1${Ba}260.00`,`+1${Ba}260`,3,35e-5,4e3,.35,220,392,!0,"SIGNAL"),WORKSHOP:ss("WORKSHOP","workshop",null,2,"03","WORKSHOP","МАСТЕРСКАЯ",null,"Мастерская",null,"—","+484.00","+484",7,.06,30,.22,164.81,493.88,!0,"MEMBERS")});var bn=Object.freeze(["SIGNAL","ARCHIVE","MEMBERS","CORE","VOYAGES","INSIGNIA","NADIR"]);var iO=new Map(bn.map(t=>[ae[t].sign,ae[t]])),tC=new Map(Object.values(ae).map(t=>[t.slug,t]));function Ky(t){return tC.get(String(t||"").toLowerCase())||null}function hd(t){let e=bn[t];return e?ae[e]:null}var fd=[-1,0,1,2],zs=new Map,Ro=new Map,nC=new Map,m0=[],g0=new Map,Wn=new Map([[-1,0],[0,1],[1,1],[2,0]]),Pr={grow:[],shrink:[]},iC=new P,Rc=null,Jy=-1;function dd(t){let e=Wn.get(t),n=Ro.get(t);n&&n.setFade(t===-1&&Cc?1:e);let i=zs.get(t);i&&t!==0&&(i.visible=e>0||t===-1&&Cc),t===0&&Rc&&Rc.key&&Rc.key.group&&(Rc.key.group.visible=e>0)}var Cc=!1,xn={init(t){Rc=t;let e=Ye.root;for(let r of fd){let s=new jt;s.name=`nest:${r}`,s.scale.setScalar(Math.pow(1e3,r)),e.add(s),zs.set(r,s)}let n=(at.params||ti.T2).lattice;for(let r of[1,2]){let s=Pc({perStratum:!1,latticeDensity:r===1?n:.5,hallLod:r===1,far:ae.CORE.far});zs.get(r).add(s.group),Ro.set(r,s);let o=pd({scale:Math.pow(1e3,r)});o.setCount(Y.litNodes),zs.get(r).add(o.object),g0.set(r,o)}let i=Pc({perStratum:!1,lattice:!1,far:1});zs.get(-1).add(i.group),Ro.set(-1,i);for(let r of[-1,1,2]){let s=cd({color:"ember",radius:zn.glowR,intensity:1,depthTest:!1,night:!0,fog:!1});zs.get(r).add(s.object),nC.set(r,s),m0.push({j:r,e:s,g:zs.get(r),h:ao.H*Math.pow(1e3,r)})}for(let r of fd)dd(r);return fe.add(xn.update,It.WORLD),Ee.on("room:arrive",({room:r})=>{let s=(ae[r]||ae.CORE).far;for(let o of[1,2])Ro.get(o).setFar(s)}),Ee.on("tier:change",({tier:r})=>{let s=ti[r];s&&Ro.get(1).setLatticeDensity(s.lattice)}),Ee.on("night:change",({night:r})=>{for(let s of g0.values())s.setNight(r)}),xn},level(t){return zs.get(t)||null},structure(t){return Ro.get(t)||null},litNodes(t){return g0.get(t)||null},fade(t){return Wn.has(t)?Wn.get(t):0},setFade(t,e){if(!Wn.has(t))return;let n=Math.max(0,Math.min(1,e));n!==Wn.get(t)&&(Wn.set(t,n),dd(t))},setHallLod(t){let e=t?ae[t]:null;Jy=e&&e.stratum>=0?e.stratum:-1;let n=Ro.get(1);n&&n.setHideCaps(Jy)},shift(t){let e=fd.map(n=>Wn.get(n));if(t==="grow"){Pr.grow.push(e[3]);let n=Pr.shrink.length?Pr.shrink.pop():0;Wn.set(2,e[2]),Wn.set(1,e[1]),Wn.set(0,e[0]),Wn.set(-1,n)}else{Pr.shrink.push(e[0]);let n=Pr.grow.length?Pr.grow.pop():0;Wn.set(-1,e[1]),Wn.set(0,e[2]),Wn.set(1,e[3]),Wn.set(2,n)}Pr.grow.length>8&&Pr.grow.shift(),Pr.shrink.length>8&&Pr.shrink.shift();for(let n of fd)dd(n)},update(){let t=Ce.camera;if(!t)return;let e=Ye.s,n=iC.copy(t.position).sub(Ye.Q).length()/e,i=n<Sx.miniKeyBelow;i!==Cc&&(Cc=i,dd(-1));for(let r=0;r<m0.length;r++){let{j:s,e:o,g:a,h:l}=m0[r],c=(s===-1?Cc||Wn.get(-1)>0:Wn.get(s)>0)&&n>l*bx;o.object.visible=c&&a.visible!==!1}}};var rC=new P,x0=null;function Ic(){let t=Ye.root;t&&(t.scale.setScalar(Ye.s),t.position.copy(Ye.Q),t.updateMatrix()),xe.uWorldScale.value=Ye.s}function Qy(t){let e=Ce.camera;e&&t(e.position),Ce.pose&&(t(Ce.pose.pos),t(Ce.pose.target)),Ce.remapHistory(t),Ye.focus&&t(Ye.focus)}var Ye={root:null,s:1,Q:new P,n:0,focus:new P,init(t,e){return e&&(x0=e),Ye.root||(Ye.root=new jt,Ye.root.name="scaleRoot",Ye.root.matrixAutoUpdate=!1),t&&Ye.root.parent!==t&&t.add(Ye.root),Ic(),Ye},set(t,e){Ye.s=t,e&&Ye.Q.copy(e),Ic()},scaleAbout(t,e){let n=Ye.s;t!==n&&(Ye.Q.x+=e.x*(n-t),Ye.Q.y+=e.y*(n-t),Ye.Q.z+=e.z*(n-t),Ye.s=t,Ic())},fixedPoint(t){let e=1-Ye.s;return Math.abs(e)<1e-9?t.set(0,0,0):t.copy(Ye.Q).multiplyScalar(1/e)},logLerp(t,e,n){return Math.exp(Math.log(t)+(Math.log(e)-Math.log(t))*n)},toRender(t,e){return e.copy(t).multiplyScalar(Ye.s).add(Ye.Q)},toCanonical(t,e){return e.copy(t).sub(Ye.Q).multiplyScalar(1/Ye.s)},rebase(t){let n={kind:t,k:(t==="grow"?1e3:.001)/Ye.s,T:Ye.Q.clone(),s:Ye.s,Q:Ye.Q.clone()};Qy(r=>Ye.mapPoint(r,n,r)),Ye.s=1,Ye.Q.set(0,0,0),Ic(),xn.shift(t);let i=x0&&x0.key;return i&&typeof i.onRebase=="function"&&i.onRebase(t),Ee.emit("scale:rebase",{kind:t,k:n.k,T:n.T}),n},unrebase(t){Qy(e=>e.multiplyScalar(1/t.k).add(t.T)),Ye.s=t.s,Ye.Q.copy(t.Q),Ic(),xn.shift(t.kind==="grow"?"shrink":"grow")},mapPoint(t,e,n){return n.copy(t).sub(e.T).multiplyScalar(e.k)},fitClip(t){let e=Math.max(1e-5,rC.copy(t.position).sub(Ye.focus).length());t.near=Ep.near*e,t.far=Ep.far*e}};var sC=Math.PI/180,oC=.08,md=new P,gd=new P,cr=new P,v0=new P,e_=new P,y0=new ot,xd=!1,t_=new Map,_0=[],Ir={until:0,ms:0,amp:0,off:new P},Ce={camera:null,pose:{pos:new P(0,.75,7.2),target:new P(0,0,0),fov:Je.fov,offsetY:0,roll:0},velocity:new P,init(t){return Ce.camera=t,xd=!1,Ce},setPose(t){t&&(t.pos&&Ce.pose.pos.copy(t.pos),t.target&&Ce.pose.target.copy(t.target),Ce.pose.fov=t.fov!=null?t.fov:Je.fov,Ce.pose.offsetY=t.offsetY||0,Ce.pose.roll=t.roll||0)},setOffset(t,e,n=0){let i=t_.get(t);if(!e&&!n){i&&(i.on=!1);return}i||(i={pos:new P,fov:0,on:!0},t_.set(t,i),_0.push(i)),e?i.pos.copy(e):i.pos.set(0,0,0),i.fov=n,i.on=!0},tremble(t=1,e=120){Qt.reducedMotion||(Ir.amp=t,Ir.ms=e,Ir.until=fe.now+e)},apply(t=1/60){let e=Ce.camera;if(!e)return;let n=Ce.pose;md.set(0,0,0);let i=n.fov;for(let l=0;l<_0.length;l++){let c=_0[l];c.on&&(md.add(c.pos),i+=c.fov)}let r=Math.max(1e-6,gd.copy(n.target).sub(n.pos).length());if(Ir.until>fe.now&&Ir.ms>0){let l=(Ir.until-fe.now)/Ir.ms,c=Ir.amp*l*r/Math.max(1e-6,xe.uPxPerUnit.value);Ir.off.set((Math.random()*2-1)*c,(Math.random()*2-1)*c,0).applyQuaternion(e.quaternion),md.add(Ir.off)}e.position.copy(n.pos).add(md),gd.copy(n.target).sub(e.position);let s=gd.length();s>1e-9&&Math.abs(gd.y/s)>.999?e.up.set(0,0,-1):e.up.set(0,1,0),e.lookAt(n.target),n.roll&&e.rotateZ(n.roll),e.fov=i;let o=Math.max(1,ve.w),a=Math.max(1,ve.h);e.aspect=o/a,n.offsetY?e.setViewOffset(o,a,0,-n.offsetY*a,o,a):e.view&&e.view.enabled&&e.clearViewOffset(),Ye.focus.copy(n.target),Ye.fitClip(e),e.updateProjectionMatrix(),e.updateMatrixWorld(),xe.uCamPos.value.copy(e.position),xe.uPxPerUnit.value=a/(2*Math.tan(i*sC/2)),xd&&t>0&&(e_.copy(e.position).sub(v0).multiplyScalar(1/t),Ce.velocity.lerp(e_,1-Math.exp(-t/oC))),v0.copy(e.position),xd=!0},project(t,e){let n=Ce.camera;return n?(cr.copy(t).applyMatrix4(n.matrixWorldInverse),e.depth=-cr.z,cr.applyMatrix4(n.projectionMatrix),e.x=(cr.x+1)*.5*ve.w,e.y=(1-cr.y)*.5*ve.h,e.visible=e.depth>0&&cr.x>=-1&&cr.x<=1&&cr.y>=-1&&cr.y<=1,e):(e.x=-9999,e.y=-9999,e.depth=0,e.visible=!1,e)},unproject(t,e,n,i){let r=Ce.camera;if(!r)return i.set(0,0,0);Ce.ray(t,e,vd),cr.set(0,0,-1).transformDirection(r.matrixWorld);let s=Math.max(1e-6,vd.direction.dot(cr));return i.copy(vd.origin).addScaledVector(vd.direction,n/s)},ray(t,e,n){let i=Ce.camera;return y0.set(t/Math.max(1,ve.w)*2-1,-(e/Math.max(1,ve.h))*2+1),n.origin.setFromMatrixPosition(i.matrixWorld),n.direction.set(y0.x,y0.y,.5).unproject(i).sub(n.origin).normalize(),n},remapHistory(t){xd&&t(v0)}},vd=new Kr;var Lc=`
uniform float uPxPerUnit;
float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }
// strut: strut spacing in LOCAL units (aStrut); modelScale: length(modelMatrix[0].xyz); depth: view-space depth (render units)
float r1Lattice(float strut, float modelScale, float depth) {
  float sp = strut * modelScale * uPxPerUnit / max(depth, 1e-6);
  return smoothstep(3.0, 6.0, sp);
}`,Co=`
uniform mat4 uStrataM[7];
uniform float uStrataA[7];
int strataIndex(float face) { return int(clamp(floor(face / 16.0 + 0.001), 0.0, 6.0)); }
mat4 strataMatrix(float face) { return uStrataM[strataIndex(face)]; }
float strataAlpha(float face) { return uStrataA[strataIndex(face)]; }`;var os={};for(let t=0;t<7;t++)os[`sign:${t}`]=[128*t,0,128,128];os["glyph:back"]=[896,0,128,128];os.frieze=[0,128,1024,32];os.ticks=[0,160,1024,32];for(let t=0;t<16;t++)os[`capital:${t}`]=[128*(t%8),192+128*Math.floor(t/8),128,128];os.deck=[0,448,256,256];for(let t=0;t<7;t++)os[`free:${t}`]=t<3?[256*(t+1),448,256,256]:[256*(t-3),704,256,256];var Dc=null,Nc=null,Po=null,yd=null;function aC(t,e){let n=()=>{let s=document.createElement("canvas");return s.width=t,s.height=e,s};(!Po||Po.width<t||Po.height<e)&&(Po=n(),yd=n());let i=Po.getContext("2d",{willReadFrequently:!0}),r=yd.getContext("2d",{willReadFrequently:!0});return i.setTransform(1,0,0,1,0,0),r.setTransform(1,0,0,1,0,0),i.clearRect(0,0,Po.width,Po.height),r.clearRect(0,0,yd.width,yd.height),[i,r]}function lC(t,e,n,i){for(let r=0;r<n;r++)for(let s=0;s<e;s++){let o=0,a=0;for(let l=-1;l<=1;l++){let c=r+l;if(!(c<0||c>=n))for(let u=-1;u<=1;u++){let f=s+u;f<0||f>=e||(o+=t[(c*e+f)*4+3],a++)}}i[r*e+s]=o/a}}var Kt={texture:null,size:1024,REGIONS:os,init(t){if(Kt.texture)return Kt;Kt.size=t==="T1"?512:1024,Dc=document.createElement("canvas"),Dc.width=Dc.height=Kt.size,Nc=Dc.getContext("2d",{willReadFrequently:!0}),Nc.fillStyle="rgb(255,0,0)",Nc.fillRect(0,0,Kt.size,Kt.size);let e=new Jr(Dc);return e.flipY=!1,e.generateMipmaps=!1,e.minFilter=Et,e.magFilter=Et,e.wrapS=e.wrapT=Zn,e.premultiplyAlpha=!1,Kt.texture=e,Wi(e,Kt.size*Kt.size*4),Kt},region(t){let e=os[t];if(!e)return null;let n=Kt.size/1024,i=e[0]*n,r=e[1]*n,s=e[2]*n,o=e[3]*n;return{x:i,y:r,w:s,h:o,rect:new tn(e[0]/1024,e[1]/1024,(e[0]+e[2])/1024,(e[1]+e[3])/1024)}},draw(t,e={}){if(!Kt.texture)return!1;let n=Kt.region(t);if(!n)return!1;let i=Math.round(n.w),r=Math.round(n.h),[s,o]=aC(i,r);try{e.height&&e.height(s,i,r)}catch{}try{e.inlay&&e.inlay(o,i,r)}catch{}let a=s.getImageData(0,0,i,r).data,l=o.getImageData(0,0,i,r).data,c=new Float32Array(i*r);lC(a,i,r,c);let u=Nc.createImageData(i,r),f=u.data;for(let h=0,d=0;d<i*r;d++,h+=4)f[h]=255-Math.round(c[d]),f[h+1]=l[h+3],f[h+2]=0,f[h+3]=255;return Nc.putImageData(u,Math.round(n.x),Math.round(n.y)),Kt.texture.needsUpdate=!0,!0}};var cC=`
${Lc}
${Co}
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
}`,uC=`
${Pi}
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
}`;function M0(t={}){let e={},n=t.engrave!=null?t.engrave:null;n==="key"?e.USE_KEYGEO="":typeof n=="string"&&(e.USE_REGION=""),t.r1!==!1&&(e.USE_R1=""),t.strut==null&&(n==="key"||t.aStrut)&&(e.USE_ASTRUT=""),t.strata?e.USE_STRATA="":t.strataAlpha&&(e.USE_STRATA_A=""),t.fog!==!1&&(e.USE_FOG=""),Kt.texture||Kt.init(at.tier);let i=typeof n=="string"&&n!=="key"?Kt.region(n):null,r=Kt.size||1024;return new Lt({uniforms:{uBase:ei(t.tint||"obsidian"),uAlpha:{value:1},uFlash:{value:0},uEdgeEmber:{value:0},uRim:{value:t.rim!=null?t.rim:en.r2.fresnelGain},uStrut:{value:t.strut!=null?t.strut:.05},uHideCapsOf:{value:-1},uAtlas:{value:Kt.texture},uTexel:{value:1/r},uRegion:{value:i?i.rect:new tn(0,0,0,0)},uFriezeH:{value:Nt.friezeH},uTickL:{value:Nt.tickLen},uApertureR:{value:Nt.apertureD/2},uStrataM:t.strata||Ao(),uStrataA:t.strataAlpha||Eo(),cSilver:xe.cSilver,cWhite:xe.cWhite,cPaper:xe.cPaper,cInk:xe.cInk,cAbyss:xe.cAbyss,uLamp:xe.uLamp,uLampOn:xe.uLampOn,uInvert:xe.uInvert,uPixelRatio:xe.uPixelRatio,uPxPerUnit:xe.uPxPerUnit,uFogDensity:xe.uFogDensity},defines:e,vertexShader:cC,fragmentShader:uC,side:t.side!=null?t.side:wr,transparent:!1,depthWrite:!0})}var n_=()=>(ae[te.room]||ae.CORE).far,i_=`
float lampReach(vec3 p) { float r = 2.0 * max(length(uCamPos - uLamp), 1e-4); float d = length(p - uLamp) / r; return 1.0 / (1.0 + d * d); }`,hC=new Float32Array([0,-1,0,1,-1,0,0,1,0,1,1,0]),fC=[0,1,2,2,1,3],dC=`
${Lc}
attribute vec3 aA; attribute vec3 aB; attribute float aW; attribute float aAl;
#ifdef USE_COL_ATTR
attribute vec3 aCol;
#endif
#ifdef USE_STRATA
attribute float aFace;
${Co}
#endif
uniform vec3 uColor; uniform vec3 cWhite;
uniform float uWidth, uAlpha, uFar, uGlint, uFlatten, uFlattenY, uDrawA, uDrawB, uCount, uFlash, uStrut;
uniform vec2 uResolution; uniform float uPixelRatio; uniform vec3 uLamp; uniform float uWorldScale; uniform vec3 uCamPos;
${i_}
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
}`,pC=`
${Pi}
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
}`;function _d(t,e){let n=new Float32Array(t);return n.fill(e),n}function Ii(t={}){let e=t.segments||new Float32Array(6),n=t.count!=null?t.count:Math.floor(e.length/6),i=Math.max(1,Math.floor(e.length/6)),r=new _o;r.setAttribute("position",new Zt(hC,3)),r.setIndex(fC);let s=new Aa(e,6),o=()=>{r.setAttribute("aA",new Sa(s,3,0)),r.setAttribute("aB",new Sa(s,3,3))};o();let a=t.width instanceof Float32Array?t.width:_d(i,1),l=t.alpha instanceof Float32Array?t.alpha:_d(i,1);r.setAttribute("aW",new ai(a,1)),r.setAttribute("aAl",new ai(l,1));let c={},u=t.color instanceof Float32Array;u&&(r.setAttribute("aCol",new ai(t.color,3)),c.USE_COL_ATTR=""),t.faces&&t.strata&&(r.setAttribute("aFace",new ai(t.faces,1)),c.USE_STRATA=""),t.dash&&(c.USE_DASH=""),t.strut!=null&&(c.USE_STRUT=""),t.flatten&&(c.USE_FLATTEN=""),t.fog!==!1&&(c.USE_FOG=""),r.instanceCount=n;let f={uColor:ei(u?"silver":t.color||"silver"),uWidth:{value:typeof t.width=="number"?t.width:1},uAlpha:{value:typeof t.alpha=="number"?t.alpha:t.alpha instanceof Float32Array?1:en.r3.alpha},uFar:{value:t.far!=null?t.far:n_()},uGlint:{value:t.glint!=null?t.glint:en.r3.glintGain},uFlatten:{value:0},uFlattenY:{value:0},uDrawA:{value:0},uDrawB:{value:1},uCount:{value:n},uFlash:{value:0},uStrut:{value:t.strut!=null?t.strut:0},uDash:{value:new ot(t.dash?t.dash[0]:1,t.dash?t.dash[1]:0)},uStrataM:t.strata||Ao(),uStrataA:t.strataAlpha||Eo(),cWhite:xe.cWhite,cAbyss:xe.cAbyss,uFogDensity:xe.uFogDensity,uLamp:xe.uLamp,uCamPos:xe.uCamPos,uResolution:xe.uResolution,uPixelRatio:xe.uPixelRatio,uPxPerUnit:xe.uPxPerUnit,uWorldScale:xe.uWorldScale},h=new Lt({uniforms:f,defines:c,vertexShader:dC,fragmentShader:pC,transparent:!0,depthWrite:!1,depthTest:t.depthTest!==!1,blending:t.additive?Mo:ar}),d=new zt(r,h);return d.frustumCulled=!1,t.layer!=null&&d.layers.set(t.layer),t.renderOrder!=null&&(d.renderOrder=t.renderOrder),{mesh:d,uniforms:f,get count(){return n},setSegments(_,m){let p=m??Math.floor(_.length/6);p<=i&&_!==s.array?(s.array.set(_.subarray(0,p*6)),s.needsUpdate=!0):_!==s.array?(i=Math.max(p,Math.floor(_.length/6)),s=new Aa(_,6),o(),a.length<i&&!(t.width instanceof Float32Array)&&r.setAttribute("aW",new ai(_d(i,1),1)),l.length<i&&!(t.alpha instanceof Float32Array)&&r.setAttribute("aAl",new ai(_d(i,1),1))):s.needsUpdate=!0,n=p,r.instanceCount=p,f.uCount.value=p},setColor(_){_ instanceof Float32Array?(r.setAttribute("aCol",new ai(_,3)),h.defines.USE_COL_ATTR===void 0&&(h.defines.USE_COL_ATTR="",h.needsUpdate=!0)):(f.uColor=ei(_||"silver"),h.defines.USE_COL_ATTR!==void 0&&(delete h.defines.USE_COL_ATTR,h.needsUpdate=!0))},setAlpha(_){f.uAlpha.value=_,d.visible=_>0},setWidth(_){f.uWidth.value=_},setDrawRange01(_,m){f.uDrawA.value=_,f.uDrawB.value=m},setFlatten(_,m){f.uFlatten.value=_,f.uFlattenY.value=m},dispose(){r.dispose(),h.dispose(),d.parent&&d.parent.remove(d)}}}var mC=`
${Lc}
#ifdef USE_STRATA
attribute float aFace;
${Co}
#endif
#ifdef USE_ASTRUT
attribute float aStrut;
#endif
#ifdef USE_DIR
attribute vec3 aDir;
#endif
uniform float uStrut, uAlpha, uFar, uGlint, uWorldScale, uFade; uniform vec3 uLamp; uniform vec3 uColor; uniform vec3 uCamPos;
${i_}
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
}`,gC=`
${Pi}
varying vec3 vCol; varying float vAlpha; varying float vDist;
void main() {
  if (vAlpha <= 0.002) discard;
  vec3 col = vCol;
#ifdef USE_FOG
  col = applyFog(col, vDist);
#endif
  gl_FragColor = vec4(col, vAlpha);
}`;function r_(t={}){let e={};return t.strut==null&&(e.USE_ASTRUT=""),t.strata&&(e.USE_STRATA=""),t.dir!==!1&&(e.USE_DIR=""),t.fog!==!1&&(e.USE_FOG=""),new Lt({uniforms:{uStrut:{value:t.strut!=null?t.strut:0},uAlpha:{value:t.alpha!=null?t.alpha:en.r3.alpha},uFade:{value:1},uFar:{value:t.far!=null?t.far:n_()},uGlint:{value:t.glint!=null?t.glint:en.r3.glintGain},uColor:ei(t.color||"silver"),uStrataM:t.strata||Ao(),uStrataA:t.strataAlpha||Eo(),uLamp:xe.uLamp,uCamPos:xe.uCamPos,uWorldScale:xe.uWorldScale,uPxPerUnit:xe.uPxPerUnit,cAbyss:xe.cAbyss,uFogDensity:xe.uFogDensity},defines:e,vertexShader:mC,fragmentShader:gC,transparent:!0,depthWrite:!1,blending:ar})}var xC=`
attribute float aSize; attribute float aAlpha;
#ifdef USE_STRATA
attribute float aFace;
${Co}
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
}`,vC=`
${Pi}
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
}`;function Md(t,e){let n=new Float32Array(Math.max(1,t));return n.fill(e),n}function Vs(t={}){let e=t.positions||new Float32Array(3),n=Math.floor(e.length/3),i=t.count!=null?Math.min(t.count,n):n,r=new Mn;r.setAttribute("position",new Zt(e,3)),r.setAttribute("aSize",new Zt(t.sizes||Md(n,1),1)),r.setAttribute("aAlpha",new Zt(t.alphas||Md(n,1),1));let s={};t.faces&&t.strata&&(r.setAttribute("aFace",new Zt(t.faces,1)),s.USE_STRATA=""),t.fog!==!1&&(s.USE_FOG=""),r.setDrawRange(0,i);let o={uColor:ei(t.color||"white"),uAlpha:{value:t.alpha!=null?t.alpha:.4},uSize:{value:t.sizePx!=null?t.sizePx:2},uStrataM:t.strata||Ao(),uStrataA:t.strataAlpha||Eo(),uPixelRatio:xe.uPixelRatio,cAbyss:xe.cAbyss,uFogDensity:xe.uFogDensity},a=new Lt({uniforms:o,defines:s,vertexShader:xC,fragmentShader:vC,transparent:!0,depthWrite:!1,depthTest:t.depthTest!==!1,blending:ar}),l=new tc(r,a);return l.frustumCulled=t.frustumCulled===!0,l.layers.set(t.layer!=null?t.layer:Qn.DEFAULT),t.renderOrder!=null&&(l.renderOrder=t.renderOrder),{object:l,uniforms:o,get count(){return i},setCount(c){i=Math.max(0,Math.min(n,c|0)),r.setDrawRange(0,i)},setAlpha(c){o.uAlpha.value=c,l.visible=c>0},setSize(c){o.uSize.value=c},setColor(c){o.uColor=ei(c),a.uniforms.uColor=o.uColor},setPositions(c,u){let f=u??Math.floor(c.length/3);f<=n&&c!==e?e.set(c.subarray(0,f*3)):c!==e&&(e=c,n=Math.floor(c.length/3),r.setAttribute("position",new Zt(e,3)),r.setAttribute("aSize",new Zt(Md(n,1),1)),r.setAttribute("aAlpha",new Zt(Md(n,1),1))),r.attributes.position.needsUpdate=!0,i=Math.min(f,n),r.setDrawRange(0,i)},dispose(){r.dispose(),a.dispose(),l.parent&&l.parent.remove(l)}}}var b0=Math.PI*2,za=99,yC=Nt.sign.heightFrac;function Xi(t,e,n,i,r,s){let o=Math.floor(i),a=i-o,l=b0*o/t-Math.PI/t,c=l+b0/t,u=Math.sin(l)*e,f=Math.cos(l)*e,h=Math.sin(c)*e,d=Math.cos(c)*e;r[s]=u+(h-u)*a,r[s+1]=n,r[s+2]=f+(d-f)*a}function bd(t,e,n,i,r=t.k){return n*t.n/r+(e<0?.5*t.n/r:0)+e*Nt.lattice.faceShift*i}var S0=2,Sd=(t,e,n)=>Math.max(1e-4,2*Ct(n)*Math.sin(Math.PI/t)*t/(e*S0)),wd=class{constructor(){this.p=[],this.n=[],this.uv=[],this.eng=[],this.face=[],this.kind=[],this.strut=[]}tri(e,n,i,r,s,o){let a=n[0]-e[0],l=n[1]-e[1],c=n[2]-e[2],u=i[0]-e[0],f=i[1]-e[1],h=i[2]-e[2],d=l*h-c*f,g=c*u-a*h,_=a*f-l*u,m=Math.hypot(d,g,_);if(m<1e-12)return;d/=m,g/=m,_/=m;let p=e,M=n,T=i;d*o[0]+g*o[1]+_*o[2]<0&&(M=i,T=n,d=-d,g=-g,_=-_);for(let x of[p,M,T])this.p.push(x[0],x[1],x[2]),this.n.push(d,g,_),this.uv.push(x[3],x[4]),this.eng.push(x[5],x[6],x[7],x[8]),this.face.push(r),this.kind.push(s),this.strut.push(x[9])}geometry(){let e=new Mn;return e.setAttribute("position",new Xt(this.p,3)),e.setAttribute("normal",new Xt(this.n,3)),e.setAttribute("aFaceUV",new Xt(this.uv,2)),e.setAttribute("aEng",new Xt(this.eng,4)),e.setAttribute("aFace",new Xt(this.face,1)),e.setAttribute("aKind",new Xt(this.kind,1)),e.setAttribute("aStrut",new Xt(this.strut,1)),e.computeBoundingSphere(),e}},kn=new Float32Array(3);function s_(t,e){let{i:n,n:i,k:r,top:s,bot:o,hollow:a}=e,l=s-o,c=(s+o)/2,u=yC*l,f=zu.map(d=>s+(o-s)*d),h=f.map(d=>Ct(d));for(let d=0;d<i;d++){let g=b0*d/i,_=Math.cos(g),m=-Math.sin(g),p=[Math.sin(g),0,Math.cos(g)],M=n*16+d,T=(x,S)=>{Xi(i,h[x],f[x],d+S,kn,0);let E=kn[0]*_+kn[2]*m;return[kn[0],kn[1],kn[2],S,(s-f[x])/l,E/u+.5,.5-(f[x]-c)/u,s-f[x],f[x]-o,Sd(i,r,f[x])]};for(let x=0;x<3;x++){let S=T(x,0),E=T(x,1),C=T(x+1,0),y=T(x+1,1);t.tri(S,C,y,M,0,p),t.tri(S,y,E,M,0,p)}for(let[x,S,E,C]of[[s,h[0],1,1],[o,h[3],2,-1]]){if(S<=1e-6)continue;let y=Sd(i,r,x),A=(R,D)=>(Xi(i,R,x,D,kn,0),[kn[0],kn[1],kn[2],.5,E===1?0:1,-1,-1,za,za,y]);if(a>0){let R=A(S,d),D=A(S,d+1),U=A(a,d),G=A(a,d+1);t.tri(R,D,G,M,E,[0,C,0]),t.tri(R,G,U,M,E,[0,C,0])}else t.tri([0,x,0,.5,E===1?0:1,-1,-1,za,za,y],A(S,d),A(S,d+1),M,E,[0,C,0])}if(a>0){let x=2*a*Math.sin(Math.PI/i)*i/(r*S0),S=(D,U)=>(Xi(i,a,D,U,kn,0),[kn[0],kn[1],kn[2],U-d,(s-D)/l,-1,-1,za,za,x]),E=S(s,d),C=S(s,d+1),y=S(o,d),A=S(o,d+1),R=[-Math.sin(g),0,-Math.cos(g)];t.tri(E,y,A,M,3,R),t.tri(E,A,C,M,3,R)}}}function o_(t){let e=[],n=[],i=[],r=[],s=new Float32Array(3),o=new Float32Array(3),a=(u,f,h,d,g,_)=>{let m=d[0]-h[0],p=d[1]-h[1],M=d[2]-h[2],T=Math.hypot(m,p,M)||1,x=u.i*16+(Math.floor(f)%u.n+u.n)%u.n;e.push(h[0],h[1],h[2],d[0],d[1],d[2]),n.push(x,x),i.push(g,_),r.push(m/T,p/T,M/T,m/T,p/T,M/T)},l=Nt.lattice.segmentsPerGenerator;for(let u of an){let f=Math.max(1,Math.round(u.k*t)),h=u.hollow>0?[!1,!0]:[!1];for(let d of h)for(let g of[1,-1])for(let _=0;_<f;_++)for(let m=0;m<l;m++){let p=m/l,M=(m+1)/l,T=u.top+(u.bot-u.top)*p,x=u.top+(u.bot-u.top)*M,S=d?u.hollow:Ct(T),E=d?u.hollow:Ct(x),C=bd(u,g,_,p,f),y=bd(u,g,_,M,f),A=U=>(U%u.n+u.n)%u.n;Xi(u.n,S,T,A(C),s,0),Xi(u.n,E,x,A(y),o,0);let R=d?2*u.hollow*Math.sin(Math.PI/u.n)*u.n/(u.k*S0):Sd(u.n,u.k,T),D=d?R:Sd(u.n,u.k,x);a(u,A((C+y)/2),s,o,R,D)}}let c=new Mn;return c.setAttribute("position",new Xt(e,3)),c.setAttribute("aFace",new Xt(n,1)),c.setAttribute("aStrut",new Xt(i,1)),c.setAttribute("aDir",new Xt(r,3)),c.computeBoundingSphere(),c}function _C(){let t=[],e=[],n=[],i=new Float32Array(3),r=new Float32Array(3),s=(o,a,l)=>{t.push(i[0],i[1],i[2],r[0],r[1],r[2]),e.push(l),n.push(o*16+a)};for(let o of an){let{i:a,n:l,top:c,bot:u,hollow:f}=o,h=zu.map(m=>c+(u-c)*m),d=[...Array(l).keys()].sort((m,p)=>Math.min(m,l-m)-Math.min(p,l-p)),g=0,_=new Set;for(let m of d)for(let p of[0,3])g<en.r3.primaryEdges&&Ct(h[p])>1e-6&&(_.add(`${p}:${m}`),g++);for(let m=0;m<l;m++){for(let p=0;p<3;p++)Xi(l,Ct(h[p]),h[p],m,i,0),Xi(l,Ct(h[p+1]),h[p+1],m,r,0),s(a,m,en.r3.widthPx);for(let p of[0,3]){let M=Ct(h[p]);M<=1e-6||(Xi(l,M,h[p],m,i,0),Xi(l,M,h[p],m+.999999,r,0),s(a,m,_.has(`${p}:${m}`)?en.r3.primaryPx:en.r3.widthPx))}if(f>0)for(let p of[c,u])Xi(l,f,p,m,i,0),Xi(l,f,p,m+.999999,r,0),s(a,m,en.r3.widthPx)}}return{seg:new Float32Array(t),width:new Float32Array(e),face:new Float32Array(n)}}function MC(){let t=[],e=[];for(let n of an)for(let i of zu){let r=n.top+(n.bot-n.top)*i,s=Ct(r);for(let o=0;o<n.n&&(Xi(n.n,s,r,o,kn,0),t.push(kn[0],kn[1],kn[2]),e.push(n.i*16+o),!(s<=1e-6));o++);}return{pos:new Float32Array(t),face:new Float32Array(e)}}var Oc=[],a_=-1,Va=new At,l_=new At,c_=new P,u_=new P,bC=new P;function SC(){let t=Ce.camera;if(t)for(let e=0;e<Oc.length;e++)Oc[e](t)}function wC(t){Oc.push(t),a_<0&&(a_=fe.add(SC,It.CAMERA+5))}function AC(t){let e=Oc.indexOf(t);e>=0&&Oc.splice(e,1)}function EC(t){let e=0,n=t.array;for(let i=0;i<n.length;i+=3){let r=n[i]*n[i]+n[i+1]*n[i+1]+n[i+2]*n[i+2];r>e&&(e=r)}return Math.sqrt(e)}function h_(t){let e=0;for(let n=0;n<t.length;n++)t[n]>e&&(e=t[n]);return e}function Pc(t={}){let e=!!t.perStratum,n=new jt;n.name=e?"structure:key":"structure";let i=t.scale!=null?t.scale:1;n.scale.setScalar(i);let r=t.far!=null?t.far:700,s={value:Array.from({length:7},()=>new At)},o={value:[1,1,1,1,1,1,1]},a=[];if(e)for(let O=0;O<7;O++){let k=new jt;k.name=`stratum:${O}`,n.add(k),a.push(k)}else a.push(n);let l=()=>{if(e)for(let O=0;O<7;O++)s.value[O].copy(a[O].matrix)},c=[],u=null;if(t.solid!==!1)if(e){u=M0({engrave:"key",strataAlpha:o});for(let O of an){let k=new wd;s_(k,O);let q=new zt(k.geometry(),u);q.name=`solid:${O.i}`,q.userData.stratum=O.i,a[O.i].add(q),c.push(q)}}else{u=M0({engrave:"key",strata:s,strataAlpha:o});let O=new wd;for(let q of an)s_(O,q);let k=new zt(O.geometry(),u);k.name="solid",k.frustumCulled=!1,n.add(k),c.push(k)}let f=null,h=null,d=t.latticeDensity!=null?t.latticeDensity:1;t.lattice!==!1&&(h=r_({strata:s,strataAlpha:o,far:r,dir:!0}),f=new ec(o_(d),h),f.name="lattice",f.frustumCulled=!1,f.onBeforeRender=l,n.add(f));let g=[],_=en.r3.alpha;if(t.edges!==!1){let O=_C(),k=Ii({segments:O.seg,width:O.width,faces:O.face,strata:s,strataAlpha:o,far:r,alpha:_});k.mesh.name="edges",k.mesh.onBeforeRender=l,n.add(k.mesh),g.push(k)}let m=null,p=null,M=.4;if(t.vertices){let O=MC();p=Vs({positions:O.pos,faces:O.face,strata:s,strataAlpha:o,sizePx:2,color:"white",alpha:M}),m=p.object,m.name="vertices",m.onBeforeRender=l,n.add(m)}let T=1,x={solid:1,lattice:1,edges:1,vertices:1},S=!0,E=!1,C=!0,y=null,A=()=>{n.visible=T>0,u&&(u.uniforms.uAlpha.value=T*x.solid),C=T*x.solid>0;for(let O=0;O<c.length;O++)c[O].visible=C&&!(y&&y[O]&&y[O].empty);h&&(h.uniforms.uFade.value=T*x.lattice,S=T*x.lattice>0,f.visible=S&&!E);for(let O of g)O.setAlpha(_*T*x.edges);p&&p.setAlpha(M*T*x.vertices)},R=f?EC(f.geometry.attributes.position):0,D=f?h_(f.geometry.attributes.aStrut.array):0,U=O=>{if(!f||!S)return;n.updateWorldMatrix(!0,!1);let k=n.matrixWorld.elements,q=Math.hypot(k[0],k[1],k[2]),j=0,J=1;for(let lt=0;lt<7;lt++){let Ve=e?a[lt].matrix.elements:s.value[lt].elements,et=Math.hypot(Ve[12],Ve[13],Ve[14]);et>j&&(j=et);let $=Math.hypot(Ve[0],Ve[1],Ve[2]);$>J&&(J=$)}let ne=(R*J+j)*q;c_.set(k[12],k[13],k[14]),O.getWorldDirection(u_);let Ue=bC.copy(c_).sub(O.position).dot(u_)-ne,Pe=Ue>0&&D*J*q*xe.uPxPerUnit.value/Ue<=3;Pe!==E&&(E=Pe,f.visible=S&&!E)};y=c.map(O=>{let k=O.geometry,q=k.attributes.position.array,j=k.attributes.aStrut.array,J=k.attributes.aFace.array,ne=q.length/3,Ue=ne/3,Pe=new Zt(ne>65535?new Uint32Array(ne):new Uint16Array(ne),1);for(let ee=0;ee<ne;ee++)Pe.array[ee]=ee;k.setIndex(Pe);let lt=new Uint8Array(Ue).fill(1),Ve=new Float32Array(28),et=new Float32Array(7),$={mesh:O,empty:!1};return $.run=ee=>{if(e){O.updateWorldMatrix(!0,!1),Va.multiplyMatrices(ee.matrixWorldInverse,O.matrixWorld);let re=Va.elements,ue=O.matrixWorld.elements;Ve[0]=re[2],Ve[1]=re[6],Ve[2]=re[10],Ve[3]=re[14],et[0]=Math.hypot(ue[0],ue[1],ue[2])}else{n.updateWorldMatrix(!0,!1),l_.multiplyMatrices(ee.matrixWorldInverse,n.matrixWorld);for(let re=0;re<7;re++){Va.multiplyMatrices(l_,s.value[re]);let ue=Va.elements;Ve[re*4]=ue[2],Ve[re*4+1]=ue[6],Ve[re*4+2]=ue[10],Ve[re*4+3]=ue[14],Va.multiplyMatrices(n.matrixWorld,s.value[re]);let Te=Va.elements;et[re]=Math.hypot(Te[0],Te[1],Te[2])}}let Me=xe.uPxPerUnit.value,Ze=!1;for(let re=0;re<Ue;re++){let ue=0;for(let Te=0;Te<3&&!ue;Te++){let Ge=re*3+Te,mt=Ge*3,Se=e?0:Math.min(6,Math.max(0,Math.floor(J[Ge]/16+.001))),we=Se*4,tt=-(Ve[we]*q[mt]+Ve[we+1]*q[mt+1]+Ve[we+2]*q[mt+2]+Ve[we+3]);j[Ge]*et[Se]*Me/Math.max(tt,1e-6)<6.001&&(ue=1)}lt[re]!==ue&&(lt[re]=ue,Ze=!0)}if(!Ze)return;let be=0;for(let re=0;re<Ue;re++)lt[re]&&(Pe.array[be++]=re*3,Pe.array[be++]=re*3+1,Pe.array[be++]=re*3+2);Pe.clearUpdateRanges(),Pe.addUpdateRange(0,Math.max(1,be)),Pe.needsUpdate=!0,k.setDrawRange(0,be),$.empty=be===0,O.visible=C&&!$.empty},$});let G=y.length?O=>{if(!(!C||!n.visible))for(let k=0;k<y.length;k++)y[k].run(O)}:null,N=O=>{U(O),G&&G(O)};wC(N);let H={group:n,strata:a,solids:c,lattice:f,edges:g,vertices:m,strataMatrices:s,strataAlpha:o,solidMaterial:u,latticeMaterial:h,perStratum:e,setGap(O){for(let k=0;k<7;k++){let q=(3-k)*(O-Pt.rest);e?a[k].position.y=q:s.value[k].makeTranslation(0,q,0)}},setFade(O){T=Math.max(0,Math.min(1,O)),A()},get fade(){return T},setStratumFade(O,k){O>=0&&O<7&&(o.value[O]=Math.max(0,Math.min(1,k)))},setParts(O){for(let k in O)k in x&&(x[k]=O[k]);A()},setFar(O){h&&(h.uniforms.uFar.value=O);for(let k of g)k.uniforms.uFar.value=O},setHideCaps(O){u&&(u.uniforms.uHideCapsOf.value=O)},setLatticeDensity(O){if(!f||O===d)return;d=O;let k=f.geometry;f.geometry=o_(O),D=h_(f.geometry.attributes.aStrut.array),k.dispose()},dispose(){AC(N);for(let O of c)O.geometry.dispose();u&&u.dispose(),f&&(f.geometry.dispose(),h.dispose());for(let O of g)O.dispose();p&&p.dispose(),n.parent&&n.parent.remove(n)}};return H.setGap(Pt.rest),t.hallLod&&H.setHideCaps(-1),H}var Io=an[lo.stratum],Fc=Io.n/Io.k,TC=Math.floor(1.5/Fc-.5)+1,f_=.003;function RC(t,e){let n=Math.round(e*1.5/Fc-.5);n=Math.max(0,Math.min(TC-1,n));let i=(n+.5)*Fc/1.5,r=bd(Io,1,0,i),s=Math.round((t-r)/Fc);return{s:r+s*Fc,t:i,key:`${n}:${s}`}}function CC(t,e,n){let i=Io.top+(Io.bot-Io.top)*e,r=Ct(i),s=Io.n,o=(t%s+s)%s,a=Math.floor(o),l=o-a,c=Math.PI*2*a/s-Math.PI/s,u=c+Math.PI*2/s;return n.set(Math.sin(c)*r+(Math.sin(u)-Math.sin(c))*r*l,i,Math.cos(c)*r+(Math.cos(u)-Math.cos(c))*r*l)}function Uc(t){let e=co(t||[]),n=[],i=new Set,r=o=>-1+3*(.1+.8*o),s=o=>.1+.8*o;for(let[o,a]of e){let l=Pp(o),c=Pp(a),u=Math.hypot((c.x-l.x)*6,(c.y-l.y)*6),f=Math.max(1,Math.round(u));for(let h=0;h<=f;h++){let d=h/f,g=RC(r(l.x+(c.x-l.x)*d),s(l.y+(c.y-l.y)*d));if(i.has(g.key))continue;i.add(g.key);let _=CC(g.s,g.t,new P);Math.hypot(_.x,_.y)<lo.apertureSkip||n.push(_)}}return n}function pd(t={}){let e=t.scale||1,n=t.nodes||Uc(_t.clan.sigil),i=new Float32Array(Math.max(1,n.length)*3);n.forEach((l,c)=>{let u=Math.hypot(l.x,l.z)||1;i[c*3]=l.x+l.x/u*f_,i[c*3+1]=l.y,i[c*3+2]=l.z+l.z/u*f_});let r=0,s=!1,o=zr&&zr.litAlpha!=null?zr.litAlpha:.7;if(e<1e3){let l=Vs({positions:i,count:0,sizePx:t.dotPx||lo.dotPx,color:"ember",alpha:1});return l.object.name="litNodes",l.object.renderOrder=3,{object:l.object,nodes:n,get count(){return r},setCount(c){r=Math.max(0,Math.min(n.length,c|0)),l.setCount(r),l.object.visible=r>0},setNight(c){s=!!c,l.setAlpha(s?o:1)},dispose(){l.dispose()}}}let a=ud({positions:i,count:0,color:"ember",radius:(t.emitterM||lo.emitterM)/e,intensity:1,night:!1});return a.object.name="litNodes",{object:a.object,nodes:n,get count(){return r},setCount(l){r=Math.max(0,Math.min(n.length,l|0)),a.setCount(r)},setNight(l){s=!!l,a.setIntensity(s?o:1)},dispose(){a.dispose()}}}var p_="samvin.v1",d_="samvin.session",PC=400,m_=/^S(0[1-9]|1[0-4])$/,Ga=t=>t!==null&&typeof t=="object"&&!Array.isArray(t),w0=t=>Array.isArray(t)&&t.every(e=>typeof e=="string");function IC(){return{v:1,firstVisit:null,lastVisit:null,days:[],found:{},shards:0,nadirOpen:!1,owner:!1,glyph:null,drawings:[],jokesFound:[],drones:{day:null,count:0,arrivals:0},resonanceNext:0,maxNest:0,transmissions:{delivered:0,read:[],lastDay:null},probes:{},decoded:[],capsuleOpened:!1,companionArrived:!1,whaleSeen:!1,inverted:!1,sound:"on",tier:null,lastRoom:"#/core",firstDive:!1,firstUnfold:!1,whaleDay:null,birthdayLeadDay:null,foundVars:{}}}var LC={v:t=>t===1,firstVisit:t=>t===null||typeof t=="string"&&Number.isFinite(Date.parse(t)),lastVisit:t=>t===null||typeof t=="string"&&Number.isFinite(Date.parse(t)),days:t=>w0(t),found:t=>Ga(t),shards:t=>Number.isInteger(t)&&t>=0&&t<=5,nadirOpen:t=>typeof t=="boolean",owner:t=>typeof t=="boolean",glyph:t=>t===null||Array.isArray(t),drawings:t=>Array.isArray(t),jokesFound:t=>w0(t),drones:t=>Ga(t),resonanceNext:t=>Number.isInteger(t)&&t>=0,maxNest:t=>typeof t=="number"&&Number.isFinite(t),transmissions:t=>Ga(t),probes:t=>Ga(t),decoded:t=>w0(t),capsuleOpened:t=>typeof t=="boolean",companionArrived:t=>typeof t=="boolean",whaleSeen:t=>typeof t=="boolean",inverted:t=>typeof t=="boolean",sound:t=>t==="on"||t==="off",tier:t=>t===null||t==="T1"||t==="T2"||t==="T3",lastRoom:t=>typeof t=="string"&&t.startsWith("#"),firstDive:t=>typeof t=="boolean",firstUnfold:t=>typeof t=="boolean",whaleDay:t=>t===null||typeof t=="string",birthdayLeadDay:t=>t===null||typeof t=="string",foundVars:t=>Ga(t)};function DC(t){let e=Ga(t)?t:{},n=IC();for(let s of Object.keys(n))(!(s in e)||!LC[s](e[s]))&&(e[s]=n[s]);let i=e.drones;i.day===null||typeof i.day=="string"||(i.day=null),Number.isInteger(i.count)||(i.count=0),Number.isInteger(i.arrivals)||(i.arrivals=0);let r=e.transmissions;(!Number.isInteger(r.delivered)||r.delivered<0)&&(r.delivered=0),Array.isArray(r.read)||(r.read=[]),r.read=r.read.filter(s=>Number.isInteger(s)&&s>=0),r.lastDay===null||typeof r.lastDay=="string"||(r.lastDay=null);for(let s of Object.keys(e.found))(!m_.test(s)||typeof e.found[s]!="string")&&delete e.found[s];return e.days=[...new Set(e.days.filter(s=>/^\d{4}-\d{2}-\d{2}$/.test(s)))].sort(),e}function NC(){try{let t=localStorage.getItem(p_);if(t==null)return{};try{return JSON.parse(t)}catch{return{}}}catch{return Y.storageOk=!1,{}}}var Bc=0,Ed=!1;function Ha(){if(Bc&&(clearTimeout(Bc),Bc=0),!(!Ed||!Y.data)&&(Ed=!1,!!Y.storageOk))try{localStorage.setItem(p_,JSON.stringify(Y.data))}catch{Y.storageOk=!1}}function Cl(){if(Ed=!0,!Bc)try{Bc=setTimeout(Ha,500)}catch{Ha()}}var Ad=-1,Y={data:null,storageOk:!0,today:"",distinctDays:1,isNewDay:!1,returning:!1,sameDaySession:!1,daysAway:0,bond:0,shrp:28,get litNodes(){if(Ad<0)try{Ad=Uc(_t.clan.sigil).length}catch(t){Ad=0,xt("state:lit",t)}return Math.min(Y.distinctDays,Ad)},set(t,e){Y.data[t]=e,Cl()},patch(t){t(Y.data),Cl()},deliverTransmissions(){let t=Y.data.transmissions;if(t.lastDay===Y.today)return 0;let e=_t.transmissions.length,n=Math.min(e,Math.max(t.delivered,Y.distinctDays)),i=Math.max(0,n-t.delivered);return t.delivered=Math.max(t.delivered,n),t.lastDay=Y.today,Cl(),i},markRead(t){let e=Y.data.transmissions;!Number.isInteger(t)||t<0||e.read.includes(t)||(e.read.push(t),Cl())},rank(){let t=Object.keys(Y.data.found).filter(n=>m_.test(n)).length,e=Y.distinctDays;return t>=12&&e>=14?{name:"АРХИТЕКТОР",index:3}:t>=7&&e>=5?{name:"СМОТРИТЕЛЬ",index:2}:t>=3||e>=3?{name:"ИССЛЕДОВАТЕЛЬ",index:1}:{name:"НАБЛЮДАТЕЛЬ",index:0}}};function g_(t){let e=Number.isFinite(t)?t:Date.now(),n=DC(NC());Y.data=n,Y.today=ju(e);let i=!0;try{i=sessionStorage.getItem(d_)==null,sessionStorage.setItem(d_,"1")}catch{i=!0}let r=n.firstVisit,s=n.lastVisit?ju(Date.parse(n.lastVisit)):null;if(Y.returning=r!=null&&i,Y.sameDaySession=Y.returning&&s===Y.today,Y.daysAway=s?Math.max(0,Rl(s,Y.today)):0,Y.isNewDay=!n.days.includes(Y.today),Y.isNewDay)for(n.days.push(Y.today),n.days.sort();n.days.length>PC;)n.days.shift();Y.distinctDays=Math.max(1,n.days.length);let o=new Date(e).toISOString();n.firstVisit==null&&(n.firstVisit=o),n.lastVisit=o;let a=Object.keys(n.found).length;return Y.bond=Ap(Y.distinctDays,a),Y.shrp=vx(Y.distinctDays,a),Ed=!0,Ha(),Y}typeof window<"u"&&window.addEventListener("pagehide",Ha);var x_=Object.freeze({clan:"members",crew:"members",missions:"voyages",vault:"insignia",legends:"archive"}),y_=new Set(["MEMBERS","VOYAGES","ARCHIVE","INSIGNIA"]);function OC(t){try{return decodeURIComponent(t)}catch{return t}}function Gs(t,e){let n={hash:"",room:t,sub:e==null||e===""?null:e};return n.hash=FC(n),n}function Lr(t){if(t&&typeof t=="object"&&t.room)return Gs(ae[t.room]?t.room:"CORE",t.sub||null);let n=String(t??"").trim().replace(/^#?\/?/,"").split(/[/?]/).filter(Boolean),i=(n[0]||"core").toLowerCase();x_[i]&&(i=x_[i]);let r=Ky(i);if(!r||r.id==="WORKSHOP")return Gs("CORE",null);let s=n[1]?OC(n[1]):null;return r.id==="MEMBERS"&&s&&s.toLowerCase()==="workshop"?Gs("WORKSHOP",null):r.id==="CORE"?Gs("CORE",s&&s.toLowerCase()==="open"?"open":null):Gs(r.id,y_.has(r.id)?s:null)}function FC(t){let e=t&&ae[t.room]?t.room:"CORE";if(e==="WORKSHOP")return"#/members/workshop";let n=t.sub,i=n!=null&&n!==""&&(y_.has(e)||e==="CORE"&&n==="open");return`#/${ae[e].slug}${i?"/"+encodeURIComponent(String(n)):""}`}var v_=t=>!!(Y.data&&Y.data.found&&Y.data.found[t]);function A0(t,e){let n=t&&t.room?t:Lr(t),i=Y.data||{};return n.room==="NADIR"&&!i.nadirOpen?{route:Gs("CORE",null),status:"sealed",vars:{k:i.shards|0},shudder:"N"}:n.room==="ZENITH"&&!v_("S13")&&e!=="overpull"?{route:Gs("CORE",null),status:"route.missing",vars:{}}:n.room==="WORKSHOP"&&!v_("S06")&&e!=="hall"?{route:Gs("MEMBERS",_t.operator.id||null)}:{route:n}}function kc(t){let e=_t.clan.name,n=t&&ae[t.room]?t.room:"CORE";if(n==="CORE")return te.owner?`${e} · ${El(_t.operator.name)}`:e;let i=ae[n],r=n==="NADIR"&&Y.data&&Y.data.nadirOpen&&i.nameOpen?i.nameOpen:i.name;return`${e} · ${r}`}var It=Object.freeze({INPUT:0,CLOCK:10,DIRECTOR:20,WORLD:30,FX:40,LAMP:50,CAMERA:60,OVERLAY:70,RENDER:80,UI:90}),BC=.05,E0=250,Lo=[],kC=1,Wa=0,Xa=-1;function zC(t){let e=Lo.slice(),n=e.length;for(;n>0&&e[n-1].order>t.order;)n--;e.splice(n,0,t),Lo=e}function b_(t){if(Wa=0,!fe.running)return;Wa=requestAnimationFrame(b_);let e=Xa<0?16.7:t-Xa;Xa=t,e>0||(e=0),e>E0&&(e=E0),fe.now+=e,fe.frame++;let n=Math.min(BC,e/1e3),i=fe.now,r=Lo;for(let s=0;s<r.length;s++){let o=r[s];if(!o.dead)try{o.fn(n,i)}catch(a){xt(`loop:${o.id}`,"frame callback threw and was removed",a),fe.remove(o.id)}}}var fe={running:!1,frame:0,now:0,at(){if(!fe.running||Xa<0||typeof performance>"u")return fe.now;let t=performance.now()-Xa;return fe.now+(t>0?Math.min(t,E0):0)},add(t,e=It.UI){let n=kC++;return zC({id:n,fn:t,order:e,dead:!1}),n},remove(t){let e=Lo.findIndex(i=>i.id===t);if(e<0)return;Lo[e].dead=!0;let n=Lo.slice();n.splice(e,1),Lo=n},start(){fe.running||(fe.running=!0,Xa=-1,typeof requestAnimationFrame=="function"&&(Wa=requestAnimationFrame(b_)))},stop(){fe.running=!1,Wa&&typeof cancelAnimationFrame=="function"&&cancelAnimationFrame(Wa),Wa=0}},__=!1,M_=!1;function VC(){let t=document.visibilityState==="hidden"||document.hidden===!0;if(t!==M_)if(M_=t,t){__=fe.running,fe.stop();try{document.title=te.night?"…сплю":"…ты где?"}catch{}try{Ha()}catch(e){xt("loop:flush",e)}Ee.emit("visibility",{hidden:!0})}else{try{document.title=kc(te.route)}catch{document.title="SAM.VIN"}__&&fe.start();try{Gn.say("tab.back",{},{force:!0})}catch(e){xt("loop:status",e)}Ee.emit("visibility",{hidden:!1})}}typeof document<"u"&&document.addEventListener("visibilitychange",VC);var S_=yx,GC=1/120,$i=class t{constructor(e,n=1,i=0){this.omega=e,this.zeta=n,this.x=i,this.v=0,this.target=i}step(e){if(!(e>0))return this.x;let n=Math.min(16,Math.ceil(e/GC)),i=e/n,r=this.omega,s=r*r,o=2*this.zeta*r;for(let a=0;a<n;a++)this.v+=(s*(this.target-this.x)-o*this.v)*i,this.x+=this.v*i;return this.x}snap(e){this.x=e,this.target=e,this.v=0}settled(e=.001){return Math.abs(this.target-this.x)<e&&Math.abs(this.v)<e*10}static from(e,n=0){return new t(e.omega,e.zeta==null?1:e.zeta,n)}};var HC=typeof window<"u"&&typeof window.DeviceOrientationEvent<"u",Do=[],Td=!1,zc={alpha:0,beta:0,gamma:0,t:0};function w_(t){zc.alpha=t.alpha||0,zc.beta=t.beta||0,zc.gamma=t.gamma||0,zc.t=typeof performance<"u"?performance.now():Date.now();for(let e=0;e<Do.length;e++)try{Do[e](zc)}catch{}}var WC={available:HC&&typeof window.DeviceOrientationEvent.requestPermission!="function",on(t){!WC.available||Do.includes(t)||(Do.push(t),Td||(window.addEventListener("deviceorientation",w_),Td=!0))},off(t){let e=Do.indexOf(t);e>=0&&Do.splice(e,1),Td&&Do.length===0&&(window.removeEventListener("deviceorientation",w_),Td=!1)}};var Rd=null;function $a(){return Rd||(Rd=new Promise(t=>{let e=!1,n=()=>{e||(e=!0,t())};setTimeout(n,2500);try{let i=typeof document<"u"?document.fonts:null;if(!i||typeof i.load!="function"){n();return}Promise.allSettled([i.load("700 64px Geologica","SAMVINСЭМ"),i.load("500 32px Martian","SAMVIN 0123")]).then(n,n)}catch{n()}}),Rd)}function Cd(t){return Math.pow(10,t/20)}function Vc(t,e=440,n="sine"){let i=t.createOscillator();return i.type=n,i.frequency.value=e,i}function XC(t,{a:e=.005,d:n=.2,peak:i=1,t0:r=t.currentTime}={}){let s=t.createGain();return s.gain.setValueAtTime(0,r),s.gain.linearRampToValueAtTime(i,r+e),s.gain.exponentialRampToValueAtTime(Math.max(1e-5,i*1e-4),r+e+n),s}var A_=t=>Al(t)%600+300;function pt(t,e){let n=t.ctx,i=n.currentTime,r=Vc(n,A_(e)*Math.pow(2,(t.transpose||0)/12)),s=XC(n,{a:.004,d:.036,peak:Cd(-30),t0:i});r.connect(s).connect(t.bus.ui),r.start(i),r.stop(i+.06);let o={alive:!0,stop(){if(o.alive){o.alive=!1;try{r.stop()}catch{}}}};return r.onended=()=>{o.alive=!1},t.track(o,.06)}function vi(t,e,n){let i=t.ctx,r=A_(e),s=Vc(i,r),o=i.createGain();o.gain.value=0,s.connect(o).connect(t.bus.fx),s.start();let a={alive:!0,set(l){if(!a.alive||!l)return;let c=l.speed01!=null?l.speed01:l.amount!=null?l.amount:l.k!=null?l.k/5:l.d!=null?Math.min(1,l.d/12):1,u=Math.max(0,Math.min(1,c)),f=i.currentTime;o.gain.setTargetAtTime(Cd(-40)*(.25+.75*u),f,.03),s.frequency.setTargetAtTime(r*(1+.5*u),f,.03)},stop(l=200){if(!a.alive)return;a.alive=!1;let c=i.currentTime,u=Math.max(.008,l/1e3);o.gain.cancelScheduledValues(c),o.gain.setValueAtTime(o.gain.value,c),o.gain.linearRampToValueAtTime(0,c+u);try{s.stop(c+u+.02)}catch{}}};return a.set(n||{speed01:0}),t.track(a,3600)}var E_=t=>pt(t,"signature"),T_=t=>pt(t,"ratchet"),R_=t=>pt(t,"owner");var C_=t=>pt(t,"hoverTick"),P_=t=>pt(t,"select"),I_=t=>pt(t,"tick"),L_=t=>pt(t,"stringPluck"),D_=t=>pt(t,"lockedThud"),N_=t=>pt(t,"chisel"),O_=t=>pt(t,"stratumNote"),F_=t=>pt(t,"memberNote"),U_=t=>pt(t,"workshopNode"),B_=t=>pt(t,"wordBell"),k_=t=>pt(t,"arrivalLock"),z_=t=>pt(t,"flinch");var V_=(t,e)=>vi(t,"whoosh",e),G_=t=>pt(t,"subDrop"),H_=t=>pt(t,"strutTick"),W_=t=>pt(t,"recallThud"),X_=(t,e)=>vi(t,"liftRumble",e),$_=t=>pt(t,"irisWhoosh"),Y_=t=>pt(t,"bootSwell"),q_=t=>pt(t,"snapAir");var j_=t=>pt(t,"shard"),Z_=(t,e)=>vi(t,"resRise",e),K_=(t,e)=>vi(t,"resSub",e),J_=t=>pt(t,"chunk"),Q_=t=>pt(t,"resChord"),eM=t=>pt(t,"hiss"),tM=(t,e)=>vi(t,"shepard",e),nM=t=>pt(t,"whale"),iM=t=>pt(t,"dizzy"),rM=t=>pt(t,"chord"),sM=t=>pt(t,"capsule"),oM=t=>pt(t,"companion"),aM=(t,e)=>vi(t,"zenithPad",e),lM=t=>pt(t,"invertRoll"),cM=t=>pt(t,"droneDodge");var uM=(t,e)=>vi(t,"probeHold",e),hM=t=>pt(t,"probeFlight"),fM=t=>pt(t,"probeReturn"),dM=(t,e)=>vi(t,"skyVoice",e),pM=(t,e)=>vi(t,"dialStatic",e),mM=(t,e)=>vi(t,"dialCarrier",e),gM=t=>pt(t,"beatLock"),xM=t=>pt(t,"vaultNote"),vM=(t,e)=>vi(t,"wind",e);var T0=Object.freeze({signature:E_,ratchet:T_,owner:R_,hoverTick:C_,select:P_,tick:I_,stringPluck:L_,lockedThud:D_,chisel:N_,stratumNote:O_,memberNote:F_,workshopNode:U_,wordBell:B_,arrivalLock:k_,flinch:z_,whoosh:V_,subDrop:G_,strutTick:H_,recallThud:W_,liftRumble:X_,irisWhoosh:$_,bootSwell:Y_,snapAir:q_,shard:j_,resRise:Z_,resSub:K_,chunk:J_,resChord:Q_,hiss:eM,shepard:tM,whale:nM,dizzy:iM,chord:rM,capsule:sM,companion:oM,zenithPad:aM,invertRoll:lM,droneDodge:cM,probeHold:uM,probeFlight:hM,probeReturn:fM,skyVoice:dM,dialStatic:pM,dialCarrier:mM,beatLock:gM,vaultNote:xM,wind:vM}),yM=new Set(["whoosh","liftRumble","resRise","resSub","shepard","zenithPad","probeHold","skyVoice","dialStatic","dialCarrier","wind"]);function _M(t){let e=null,n=null,i={room:"CORE",root:146.83,night:!1,rank:0,duckDb:0,narrowU:0,start(){if(e)return;let r=t.ctx;n=r.createGain(),n.gain.value=0,n.gain.setTargetAtTime(Cd(-34),r.currentTime,.4),n.connect(t.bus.bed),e=[Vc(r,49),Vc(r,49.3)];for(let s of e)s.connect(n),s.start()},stop(){if(!e)return;let r=t.ctx,s=r.currentTime;n.gain.setTargetAtTime(0,s,.1);for(let o of e)try{o.stop(s+.6)}catch{}e=null},setRoom(r){i.room=r},setRootGlide(r,s,o){i.root=r*Math.pow(s/r,Math.max(0,Math.min(1,o)))},setNight(r){i.night=!!r},setRank(r){i.rank=r|0},duck(r,s){i.duckDb=r},narrow(r){i.narrowU=r},update(r){}};return i}var KC=Object.freeze({G2:98,A2:110,B2:123.47,D3:146.83,E3:164.81,G3:196,A3:220,B3:246.94,D4:293.66,E4:329.63,G4:392,A4:440,B4:493.88,D5:587.33,E5:659.25,G5:783.99,A5:880,B5:987.77,D6:1174.66,E6:1318.51,G6:1567.98,A6:1760,B6:1975.53,D7:2349.32}),eU=Object.freeze([392,440,493.88,587.33,659.25,783.99,880]),tU=Object.freeze(Object.fromEntries(Object.keys(ae).map(t=>[t,ae[t].root]))),nU=Object.freeze({S01:"G4",S02:"A4",S03:"B4",S04:"D5",S05:"E5",S06:"G5",S07:"A5",S08:"B5",S09:"D6",S10:"E6",S11:"G6",S12:"A6",S13:"B6",S14:"D7"});function MM(t){let e=KC[t];return e??440}var JC=Math.pow(10,-6/20),R0=Object.freeze({set(){},stop(){},alive:!1}),No=[],C0=new Uint8Array(32),P0=null,Dt=null,Hc=null,Ya=null,as=null,Gc=null,Wc=null,Hs=!1,Xc=0,ls={ctx:null,bus:{ui:null,fx:null,room:null,bed:null},transpose:0,night:!1,hz:MM,get irLong(){return!P0&&Dt&&(P0=SM(6)),P0},send(t){let e=Dt.createGain();return e.gain.value=t,e.connect(Gc),e},track(t,e){if(!t)return t;let n=Dt?Dt.currentTime:0;for(let i=No.length-1;i>=0;i--)(!No[i].v.alive||No[i].end<n)&&No.splice(i,1);for(No.push({v:t,end:n+(e||1)});No.length>24;){let i=No.shift();try{i.v.stop(8)}catch{}}return t}};function SM(t){let e=Dt.sampleRate,n=Math.floor(e*t),i=Dt.createBuffer(2,n,e),r=Math.exp(-2*Math.PI*120/e),s=Math.exp(-6.9/(t*e));for(let o=0;o<2;o++){let a=i.getChannelData(o),l=0,c=0,u=1;for(let f=0;f<n;f++){let h=(Math.random()*2-1)*u;u*=s,c=r*(c+h-l),l=h,a[f]=c}}return i}function Pd(t,e,n){let i=Dt.currentTime;t.cancelScheduledValues(i),t.setValueAtTime(t.value,i),t.linearRampToValueAtTime(e,i+n/1e3)}function bM(){Dt&&(Pd(Hc.gain,0,400),clearTimeout(Xc),Xc=setTimeout(()=>{Xc=0,Dt&&(Hs||!Ke.on)&&Dt.suspend().catch(()=>{})},420))}function I0(){!Dt||!Ke.on||Hs||(clearTimeout(Xc),Xc=0,Dt.resume().catch(()=>{}),Pd(Hc.gain,JC,400))}function QC(){as=Dt.createDynamicsCompressor(),as.threshold.value=-18,as.ratio.value=3,as.attack.value=.003,as.release.value=.25,Hc=Dt.createGain(),Hc.gain.value=0,Ya=Dt.createAnalyser(),Ya.fftSize=64,Ya.smoothingTimeConstant=.6,as.connect(Hc).connect(Ya).connect(Dt.destination),Gc=Dt.createConvolver(),Gc.buffer=SM(3.4),Gc.connect(as),Wc={};for(let t of["ui","fx","room"]){let e=Dt.createGain();e.connect(as);let n=Dt.createGain();n.gain.value=t==="ui"?.11:.22,e.connect(n).connect(Gc),ls.bus[t]=e,Wc[t]=n}ls.bus.bed=Dt.createGain(),ls.bus.bed.connect(as),ls.ctx=Dt}var Ke={ctx:null,unlocked:!1,on:!0,bed:null,init(t){return Ke.on=!(Y.data&&Y.data.sound==="off"),te.soundOn=Ke.on,Ee.on("visibility",e=>{Hs=!!e.hidden,Hs?bM():I0()}),Ee.on("room:arrive",e=>Ke.setRoom(e.room)),Ke},unlock(){if(Ke.unlocked)return;let t=window.AudioContext||window.webkitAudioContext;if(t)try{Dt=new t;try{navigator.audioSession&&(navigator.audioSession.type="playback")}catch{}QC(),Ke.ctx=Dt,Ke.unlocked=!0;try{Ke.bed=_M(ls)}catch(e){xt("audio:bed",e)}Ke.setRoom(te.room||"CORE"),Ke.setNight(te.night),Ke.on?(Ke.bed&&Ke.bed.start(),I0()):Dt.suspend().catch(()=>{}),fe.add(e=>{Ke.bed&&Ke.on&&Ke.bed.update(e)},It.FX),Ee.emit("audio:unlocked",{})}catch(e){xt("audio:unlock","audio unavailable",e)}},resume(){Dt&&Ke.on&&!Hs&&Dt.state!=="running"&&Dt.resume().catch(()=>{})},isOn(){return Ke.on},setOn(t){let e=!!t;e!==Ke.on&&(Ke.on=e,te.soundOn=e,Y.set("sound",e?"on":"off"),Dt&&(e?(Ke.bed&&Ke.bed.start(),I0()):(bM(),Ke.bed&&setTimeout(()=>{!Ke.on&&Ke.bed&&Ke.bed.stop()},400))),Ee.emit("sound:change",{on:e}))},toggle(){Ke.setOn(!Ke.on)},play(t,e={}){if(!Dt||!Ke.on||Hs)return null;let n=T0[t];if(!n)return null;try{return n(ls,e||{})||null}catch(i){return xt(`audio:${t}`,"recipe failed",t,i),null}},start(t,e={}){if(!Dt||!Ke.on||Hs||!yM.has(t))return R0;try{return T0[t](ls,e||{})||R0}catch(n){return xt(`audio:${t}`,"recipe failed",t,n),R0}},setRoom(t){let e=ae[t];!e||!Dt||(Wc&&(Pd(Wc.room.gain,e.wet,300),Pd(Wc.fx.gain,e.wet,300)),Ke.bed&&(Ke.bed.setRoom(t),Ke.bed.duck(t==="INSIGNIA"?-60:0,960)))},setRootU(t,e,n){if(!Ke.bed)return;let i=ae[t],r=ae[e];i&&r&&Ke.bed.setRootGlide(i.root,r.root,n)},setNight(t){ls.night=!!t,Ke.bed&&Ke.bed.setNight(!!t)},setRank(t){Ke.bed&&Ke.bed.setRank(t|0)},setInverted(t){ls.transpose=t?-5:0},levels(t){if(t){if(!Ya||!Ke.on||Hs){t.fill(0);return}Ya.getByteFrequencyData(C0);for(let e=0;e<8;e++){let n=C0[e*2]+C0[e*2+1];t[e]=Math.min(1,n/510*1.6)}}},now(){return Dt?Dt.currentTime:0}};var Dr=Object.freeze({tap:8,tick:6,stratum:7,lock:14,step:20,activation:[8,40,8,40,14,90,30],shard:[8,40,8,40,60],locked:[10,30,10]}),e2=6,L0=0;function wM(t,e){let n=document.getElementById("fx");if(!n||L0>=e2)return;let i=document.createElement("div");i.className="ripple",i.style.transform=`translate3d(${t}px, ${e}px, 0)`,Qt.reducedMotion&&i.classList.add("ripple--still"),L0++;let r=()=>{L0--,i.remove()};i.addEventListener("animationend",r,{once:!0}),setTimeout(()=>{i.isConnected&&r()},600),n.appendChild(i)}function Nr(t){try{if(typeof navigator>"u"||typeof navigator.vibrate!="function")return;let e=navigator.userActivation;if(e&&!e.hasBeenActive)return;navigator.vibrate(t)}catch{}}var yi=Object.freeze({TAP_MS:350,HOLD_MS:350,LONG_MS:800,SLOP_PX:8,SWIPE_PX:40,SWIPE_V:.3}),t2=60,ur=[],Oo=null,ja=[],$c=[],Za=null,he={type:"down",x:0,y:0,dx:0,dy:0,tx:0,ty:0,vx:0,vy:0,speed:0,t:0,id:0,pointerType:"mouse",button:0,scale:1,dScale:1,deltaY:0,dir:null,afterHold:!1,shift:!1,alt:!1},cs={x:0,y:0,vx:0,vy:0,speed:0,type:"mouse",buttons:0,t:0},Le={active:!1,id:-1,type:"mouse",x0:0,y0:0,t0:0,lastX:0,lastY:0,lastT:0,dragging:!1,holdFired:!1,longFired:!1,pinch:!1,moved:0,button:0},Yc=0,qc=0,Yi=new Map,RM=0,D0=0,jc=()=>typeof performance<"u"?performance.now():Date.now(),CM=t=>{let e=t&&t.timeStamp,n=jc();return e>0&&e<=n+1&&e>n-5e3?e:n},qa=null;function Sn(t,e){if(he.type=t,e&&(he.shift=!!e.shiftKey,he.alt=!!e.altKey),t!=="swipe"&&(he.dir=null),Oo){try{Oo.onGesture(he)}catch(i){xt(`input:${Oo.name}`,"captured consumer threw",i)}return}let n=t!=="down"&&t!=="hover"&&t!=="leave"&&t!=="wheel";if(t==="down")qa=null;else if(n&&qa){if(ur.indexOf(qa)<0)return;try{qa.onGesture(he)}catch(i){xt(`input:${qa.name}`,"consumer threw",i)}return}for(let i=ur.length-1;i>=0;i--){let r=ur[i],s=!1;try{s=!!r.onGesture(he)}catch(o){xt(`input:${r.name}`,"consumer threw",o)}if(s){t==="down"&&(qa=r);return}}}function us(t,e,n){he.x=e,he.y=n,he.id=t.pointerId,he.pointerType=t.pointerType||"mouse",he.button=t.button|0,he.scale=1,he.dScale=1,he.deltaY=0}function Nd(){Yc&&(clearTimeout(Yc),Yc=0),qc&&(clearTimeout(qc),qc=0)}function n2(t){let e=fn.pointer,n=CM(t),i=Math.max(1,n-(e._t||n-16)),r=(t.clientX-e.x)/i,s=(t.clientY-e.y)/i,o=1-Math.exp(-i/t2);e.x>-9e3&&(e.vx+=(r-e.vx)*o,e.vy+=(s-e.vy)*o),e._t=n,e.x=t.clientX,e.y=t.clientY,e.speed=Math.hypot(e.vx,e.vy)*1e3,e.type=t.pointerType||"mouse",e.lastMove=fe.now,e.inside=!0}function i2(t){if(!ja.length)return;let e=fn.pointer;cs.x=e.x,cs.y=e.y,cs.vx=e.vx,cs.vy=e.vy,cs.speed=e.speed,cs.type=e.type,cs.buttons=t.buttons|0,cs.t=fe.now;for(let n=0;n<ja.length;n++)try{ja[n](cs)}catch(i){xt("input:observer","observer threw",i)}}function r2(t){if(t.pointerType==="touch"){if(Yi.set(t.pointerId,{x:t.clientX,y:t.clientY}),wM(t.clientX,t.clientY),Nr(Dr.tap),Yi.size===2&&Le.active){s2(t);return}if(Yi.size>2)return}if(Le.active)return;try{t.currentTarget.setPointerCapture(t.pointerId)}catch{}let e=CM(t),n=fn.pointer;n.x=t.clientX,n.y=t.clientY,n.vx=0,n.vy=0,n.speed=0,n._t=e,n.type=t.pointerType||"mouse",n.lastMove=fe.now,n.inside=!0,Le.active=!0,Le.id=t.pointerId,Le.type=t.pointerType||"mouse",Le.x0=Le.lastX=t.clientX,Le.y0=Le.lastY=t.clientY,Le.t0=Le.lastT=e,Le.dragging=!1,Le.holdFired=!1,Le.longFired=!1,Le.pinch=!1,Le.moved=0,Le.button=t.button|0,fn.pointer.down=!0,us(t,t.clientX,t.clientY),he.dx=0,he.dy=0,he.tx=0,he.ty=0,he.vx=0,he.vy=0,he.speed=0,he.t=0,he.afterHold=!1,Sn("down",t),Nd(),Yc=setTimeout(()=>{Yc=0,!(!Le.active||Le.dragging||Le.pinch)&&(Le.holdFired=!0,AM(),Sn("hold",null),qc=setTimeout(()=>{qc=0,!(!Le.active||Le.dragging||Le.pinch)&&(Le.longFired=!0,AM(),Sn("longpress",null))},yi.LONG_MS-yi.HOLD_MS))},yi.HOLD_MS)}function AM(){he.x=Le.lastX,he.y=Le.lastY,he.dx=0,he.dy=0,he.tx=Le.lastX-Le.x0,he.ty=Le.lastY-Le.y0,he.vx=0,he.vy=0,he.speed=0,he.t=jc()-Le.t0,he.id=Le.id,he.pointerType=Le.type,he.button=Le.button,he.scale=1,he.dScale=1,he.deltaY=0,he.afterHold=!0}function s2(t){Nd(),Le.dragging&&(he.t=jc()-Le.t0,Sn("dragend",t)),Le.pinch=!0,Le.dragging=!1,PM(),RM=D0=Math.max(1,Math.hypot(hn.ax-hn.bx,hn.ay-hn.by)),us(t,(hn.ax+hn.bx)/2,(hn.ay+hn.by)/2),he.scale=1,he.dScale=1,Sn("pinchstart",t)}var hn={ax:0,ay:0,bx:0,by:0,i:0};function o2(t){hn.i===0?(hn.ax=t.x,hn.ay=t.y):hn.i===1&&(hn.bx=t.x,hn.by=t.y),hn.i++}function PM(){hn.i=0,Yi.forEach(o2)}var N0=null,Dd=null,Id=!1;function a2(t){return!!t&&(t===N0||Dd!==null&&Dd.contains(t))}function l2(t){if(n2(t),i2(t),t.pointerType==="touch"&&Yi.has(t.pointerId)){let n=Yi.get(t.pointerId);n.x=t.clientX,n.y=t.clientY}if(Le.pinch){if(Yi.size<2)return;PM();let n=Math.max(1,Math.hypot(hn.ax-hn.bx,hn.ay-hn.by));us(t,(hn.ax+hn.bx)/2,(hn.ay+hn.by)/2),he.scale=n/RM,he.dScale=n/D0,D0=n,Sn("pinch",t);return}if(!Le.active||t.pointerId!==Le.id){if(!Le.active&&(t.pointerType||"mouse")==="mouse"&&(t.buttons|0)===0){if(!a2(t.target)){Id&&(Id=!1,us(t,t.clientX,t.clientY),Sn("leave",t));return}Id=!0,us(t,t.clientX,t.clientY),he.dx=t.movementX||0,he.dy=t.movementY||0,he.tx=0,he.ty=0,he.vx=fn.pointer.vx,he.vy=fn.pointer.vy,he.speed=fn.pointer.speed,he.t=0,he.afterHold=!1,Sn("hover",t)}return}let e=jc();us(t,t.clientX,t.clientY),he.dx=t.clientX-Le.lastX,he.dy=t.clientY-Le.lastY,he.tx=t.clientX-Le.x0,he.ty=t.clientY-Le.y0,he.vx=fn.pointer.vx,he.vy=fn.pointer.vy,he.speed=fn.pointer.speed,he.t=e-Le.t0,he.afterHold=Le.holdFired,Le.lastX=t.clientX,Le.lastY=t.clientY,Le.lastT=e,Le.moved=Math.max(Le.moved,Math.hypot(he.tx,he.ty)),Le.dragging?Sn("drag",t):Le.moved>=yi.SLOP_PX?(Le.dragging=!0,Nd(),Sn("dragstart",t),Sn("drag",t)):Sn("move",t)}function O0(t,e){let n=jc();Nd(),fn.pointer.down=!1;try{t.currentTarget&&t.currentTarget.hasPointerCapture&&t.currentTarget.hasPointerCapture(t.pointerId)&&t.currentTarget.releasePointerCapture(t.pointerId)}catch{}us(t,t.clientX,t.clientY),he.dx=t.clientX-Le.lastX,he.dy=t.clientY-Le.lastY,he.tx=t.clientX-Le.x0,he.ty=t.clientY-Le.y0,he.vx=fn.pointer.vx,he.vy=fn.pointer.vy,he.speed=fn.pointer.speed,he.t=n-Le.t0,he.afterHold=Le.holdFired;let i=Le.dragging,r=Le.pinch;if(Le.active=!1,Le.dragging=!1,Le.pinch=!1,e){Sn("cancel",t),Ld();return}if(r){Sn("pinchend",t),Ld();return}if(Sn("up",t),i){Sn("dragend",t);let s=Math.hypot(he.tx,he.ty),o=Math.hypot(he.vx,he.vy);s>=yi.SWIPE_PX&&o>=yi.SWIPE_V&&(he.dir=Math.abs(he.tx)>=Math.abs(he.ty)?he.tx>0?"right":"left":he.ty>0?"down":"up",Sn("swipe",t))}else!Le.holdFired&&he.t<yi.TAP_MS&&Le.moved<yi.SLOP_PX&&Sn("tap",t);Ld()}function Ld(){Oo=null}function c2(t){if(t.pointerType==="touch"){Yi.delete(t.pointerId);try{Ke.resume()}catch{}if(Le.pinch){Yi.size<2&&Le.active&&(Yi.size===0||t.pointerId===Le.id?O0(t,!1):(us(t,t.clientX,t.clientY),Sn("pinchend",t),Le.pinch=!1,Le.active=!1,fn.pointer.down=!1,Ld()));return}}!Le.active||t.pointerId!==Le.id||O0(t,!1)}function u2(t){t.pointerType==="touch"&&Yi.delete(t.pointerId),Le.active&&(t.pointerId!==Le.id&&!Le.pinch||(Yi.clear(),O0(t,!0)))}function h2(t){t.preventDefault();let e=t.deltaY;t.deltaMode===1?e*=16:t.deltaMode===2&&(e*=ve.h||800),he.x=t.clientX,he.y=t.clientY,he.dx=0,he.dy=0,he.tx=0,he.ty=0,he.vx=0,he.vy=0,he.speed=0,he.t=0,he.id=0,he.pointerType="mouse",he.button=0,he.scale=1,he.dScale=1,he.deltaY=e,he.afterHold=!1,Sn("wheel",t)}function f2(t){t.relatedTarget||(fn.pointer.inside=!1,Id=!1,us(t,t.clientX,t.clientY),Sn("leave",t))}function EM(t){!t||t.__samvinInput||(t.__samvinInput=!0,t.addEventListener("pointerdown",r2),t.addEventListener("pointerup",c2),t.addEventListener("pointercancel",u2),t.addEventListener("wheel",h2,{passive:!1}),t.addEventListener("contextmenu",e=>e.preventDefault()))}var TM={name:"hall",onGesture(t){let e=Za&&Za.halls;if(!e||typeof e.current!="function")return!1;let n=e.current();return n?!!e.call(n.id,"onGesture",t):!1}},d2={name:"director",onGesture(t){let e=Za&&Za.director;if(!e||typeof e.busy!="function"||!e.busy())return!1;let n=e.state,i=Za.halls;return n&&n.u>=.7&&n.to&&i&&typeof i.call=="function"&&i.call(n.to.room,"onGesture",t)||t.type==="tap"&&typeof e.speedUp=="function"&&e.speedUp(),!0}},fn={pointer:{x:-9999,y:-9999,vx:0,vy:0,speed:0,type:"mouse",down:!1,lastMove:0,inside:!1},init(t){Za=t,N0=document.getElementById("gl"),Dd=document.getElementById("t0"),EM(N0),EM(Dd),window.addEventListener("pointermove",l2,{passive:!0}),document.addEventListener("pointerout",f2);let e=()=>{try{Ke.unlock()}catch(n){xt("input:unlock",n)}};window.addEventListener("pointerdown",e,{capture:!0,passive:!0}),window.addEventListener("touchend",()=>{try{Ke.resume()}catch{}},{passive:!0}),window.addEventListener("keydown",n=>{e();let i=n.target;if(!(i&&(i.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(i.tagName||""))))for(let r=0;r<$c.length;r++)try{$c[r](n)}catch(s){xt("input:keyobserver","key observer threw",s)}},{capture:!0}),ur.includes(TM)||(ur.unshift(d2),ur.unshift(TM))},push(t){return ur.push(t),()=>{let e=ur.indexOf(t);e>=0&&ur.splice(e,1)}},offerKey(t){for(let e=ur.length-1;e>=0;e--){let n=ur[e];if(typeof n.onKey=="function")try{if(n.onKey(t))return!0}catch(i){xt(`input:${n.name}:key`,"key consumer threw",i)}}return!1},capture(t){Oo=t},release(t){(!t||Oo===t)&&(Oo=null)},observe(t){return ja.push(t),()=>{let e=ja.indexOf(t);e>=0&&ja.splice(e,1)}},observeKeys(t){return $c.push(t),()=>{let e=$c.indexOf(t);e>=0&&$c.splice(e,1)}}};function IM(t,e,n){Mt.enabled=!1;let i=ti[n]||ti.T2,r=new Qf({canvas:t,context:e||void 0,antialias:!!i.msaa,alpha:!0,premultipliedAlpha:!0,depth:!0,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1});r.outputColorSpace=vo,r.toneMapping=Ri,r.setClearColor(0,0),r.info.autoReset=!1,r.autoClear=!0,r.debug.checkShaderErrors=!1;let s=new jr;s.background=null,s.matrixWorldAutoUpdate=!0;let o=new jn(Je.fov,Math.max(1,ve.w)/Math.max(1,ve.h),.01,1e3);o.position.set(0,.75,7.2);let a=i.dprCap,l=0,c=new WeakSet,u=0,f={three:r,scene:s,camera:o,tier:n,dpr:1,stats:{calls:0,triangles:0,points:0,geometries:0,textures:0,frameMs:0,fps:0},setDprDrop(d){u=Math.max(0,d|0),f.resize()},setTier(d){f.tier=d,a=(ti[d]||i).dprCap,f.resize()},resize(){let d=typeof devicePixelRatio=="number"&&devicePixelRatio>0?devicePixelRatio:1;f.dpr=Math.max(1,Math.min(d,a)-en.dprStep*u);let g=Math.max(1,ve.w),_=Math.max(1,ve.h);r.setPixelRatio(f.dpr),r.setSize(g,_,!1),o.aspect=g/_,o.updateProjectionMatrix(),xe.uPixelRatio.value=f.dpr,xe.uResolution.value.set(Math.round(g*f.dpr),Math.round(_*f.dpr));for(let m of h)m(f)},pinPrograms(){let d=r.info.programs;if(!(!d||d.length===l)){for(let g=l;g<d.length;g++)d[g].usedTimes++;l=d.length}},warm(d,g,_){r.compile(d,g,_||d),d.traverse(S=>{let E=S.material?Array.isArray(S.material)?S.material:[S.material]:null;if(E)for(let C of E){let y=r.properties.get(C).currentProgram;y&&!c.has(y)&&(c.add(y),y.getUniforms(),y.getAttributes())}}),f.pinPrograms();let m=r.getContext(),p=r.getRenderTarget(),M=r.autoClear,T=g.layers.mask,x=d.parent;try{r.setRenderTarget(f.sceneTarget||null),r.autoClear=!1,r.setScissorTest(!0),r.setScissor(0,0,1,1),g.layers.enableAll(),r.render(d,g)}finally{r.setScissorTest(!1),r.autoClear=M,r.setRenderTarget(p),g.layers.mask=T,x&&d!==_&&d.updateWorldMatrix(!0,!0)}m.finish()},sceneTarget:null,onResize(d){return h.add(d),()=>h.delete(d)},lost:!1},h=new Set;return t.addEventListener("webglcontextlost",d=>{d.preventDefault(),f.lost=!0,fe.stop(),Ee.emit("gl:lost",{})},!1),t.addEventListener("webglcontextrestored",()=>{f.lost=!1,f.resize(),Ee.emit("gl:restored",{}),fe.start()},!1),Ee.on("layout:change",()=>f.resize()),f.resize(),f}var p2=`
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,LM=`
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
}`,DM=`
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
}`;function F0(){let t=new Mn;return t.setAttribute("position",new Zt(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),t}function NM(t,e=en.r6.levels){let n=t.three||t,i=F0(),r=new jr,s=new es(-1,1,1,-1,0,1),o=(S,E,C)=>new Lt({uniforms:{tSrc:{value:null},uHalf:{value:new ot},uThreshold:{value:en.r6.threshold},tAdd:{value:null},uAddGain:{value:1}},defines:Object.assign(E?{USE_THRESHOLD:""}:{},C?{USE_ADD:""}:{}),vertexShader:p2,fragmentShader:S,depthTest:!1,depthWrite:!1,blending:gi}),a=o(LM,!0),l=o(LM,!1),c=o(DM,!1,!0),u=o(DM,!1,!1),f=new zt(i,l);f.frustumCulled=!1,r.add(f);let h={type:Kn,format:Hn,minFilter:Et,magFilter:Et,depthBuffer:!1},d=[],g=[],_=0,m=0,p=S=>S.width*S.height*8;function M(S,E){T(),_=S,m=E;let C=S,y=E;for(let A=0;A<e;A++){C=Math.max(1,C>>1),y=Math.max(1,y>>1);let R=new Tn(C,y,h);Wi(R.texture,p(R)),d.push(R)}for(let A=0;A<e;A++){let R=A===0?{width:S,height:E}:d[A-1],D=new Tn(R.width,R.height,h);Wi(D.texture,p(D)),g.push(D)}}function T(){for(let S of d.concat(g))bc(S.texture),S.dispose();d.length=0,g.length=0}function x(S,E,C,y,A){f.material=S,S.uniforms.tSrc.value=E,S.uniforms.uHalf.value.set(.5/C,.5/y),n.setRenderTarget(A),n.render(r,s)}return{render(S){if(!d.length)return null;let E=S,C=_,y=m;for(let A=0;A<e;A++)x(A===0?a:l,E,C,y,d[A]),E=d[A].texture,C=d[A].width,y=d[A].height;for(let A=e-1;A>=0;A--){let R=A>0?c:u;A>0&&(R.uniforms.tAdd.value=d[A-1].texture),x(R,E,C,y,g[A]),E=g[A].texture,C=g[A].width,y=g[A].height}return g[0].texture},resize(S,E){(S!==_||E!==m)&&M(Math.max(2,S|0),Math.max(2,E|0))},dispose(){T(),i.dispose(),a.dispose(),l.dispose(),c.dispose(),u.dispose()}}}var Ka=en.r7,OM="void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",FM=`
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
  g *= smoothstep(${Ka.clearInPx.toFixed(1)}, ${Ka.clearOutPx.toFixed(1)}, distance(css, uPointer));
  float aspect = uRes.x / uRes.y;
  vec2 c = (uv * 2.0 - 1.0) * vec2(aspect, 1.0);
  float v = uVig * smoothstep(${Ka.vignetteFrom.toFixed(2)}, 1.0, length(c) / length(vec2(aspect, 1.0)));
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
}`,Od=120;function UM(t){let e=t.three,n=t.scene,i=t.camera,r=new jr,s=new es(-1,1,1,-1,0,1),o={uRes:{value:new ot(1,1)},uPR:{value:1},uGrain:{value:Ka.grainBoot},uSeed:{value:0},uVig:{value:Ka.vignette},uPointer:{value:new ot(-9999,-9999)},tScene:{value:null},tBloom:{value:null},uBloom:{value:1}},a=new Lt({uniforms:o,vertexShader:OM,fragmentShader:FM,depthTest:!1,depthWrite:!1,transparent:!0,blending:of,blendEquation:ts,blendSrc:uc,blendDst:Ta,blendSrcAlpha:uc,blendDstAlpha:Ta}),l=new Lt({uniforms:o,defines:{USE_SCENE:""},vertexShader:OM,fragmentShader:FM,depthTest:!1,depthWrite:!1,blending:gi}),c=new zt(F0(),a);c.frustumCulled=!1,r.add(c);let u=t.tier,f=null,h=null,d=null,g=[],_=!0;function m(){t.sceneTarget=null,f&&(bc(f.texture),f.dispose(),f=null),h&&(bc(h.texture),h.dispose(),h=null),d&&(d.dispose(),d=null)}function p(){if(u!=="T3"){m();return}let D=o.uRes.value.x,U=o.uRes.value.y;f?(f.setSize(D,U),h.setSize(Math.max(2,D>>1),Math.max(2,U>>1))):(f=new Tn(D,U,{type:Kn,format:Hn,samples:4,depthBuffer:!0,minFilter:Et,magFilter:Et}),h=new Tn(Math.max(2,D>>1),Math.max(2,U>>1),{type:Kn,format:Hn,depthBuffer:!0,minFilter:Et,magFilter:Et}),d=NM(t,en.r6.levels)),t.sceneTarget=f,Wi(f.texture,D*U*8*5),Wi(h.texture,h.width*h.height*8),d.resize(h.width,h.height)}function M(){let D=e.getDrawingBufferSize(new ot);o.uRes.value.copy(D),o.uPR.value=t.dpr,p()}t.onResize(M),M();let T=new Float32Array(Od),x=new Float32Array(Od),S=0,E=0,C=-1,y=1<<Qn.DEFAULT|1<<Qn.NOFOG,A=1<<Qn.EMISSIVE,R={render(D){if(t.lost)return;o.uSeed.value=Qt.reducedMotion?7:Math.floor(fe.now/(1e3/Ka.grainFps))%997;let U=fn.pointer,G=U.x<-9e3||U.inside===!1||U.type==="touch"&&!U.down;o.uPointer.value.set(G?-9999:U.x,G?-9999:U.y),e.info.reset(),e.autoClear=!1,u==="T3"&&f?(i.layers.mask=y,e.setRenderTarget(f),e.setClearColor(0,0),e.clear(!0,!0,!1),e.render(n,i),t.stats.points=e.info.render.points,i.layers.mask=A,e.setRenderTarget(h),e.clear(!0,!0,!1),xe.uEmissivePass.value=1,e.render(n,i),xe.uEmissivePass.value=0,i.layers.mask=y,o.tBloom.value=d.render(h.texture),o.tScene.value=f.texture,c.material=l,e.setRenderTarget(null),e.render(r,s)):(i.layers.mask=y,e.setRenderTarget(null),e.setClearColor(0,0),e.clear(!0,!0,!1),e.render(n,i),t.stats.points=e.info.render.points,c.material=a,e.render(r,s)),t.pinPrograms();let N=t.stats,H=e.info;N.calls=H.render.calls,N.triangles=H.render.triangles,N.geometries=H.memory.geometries,N.textures=H.memory.textures;let O=fe.now;if(C>=0&&(T[E]=O-C,E=(E+1)%Od,S<Od&&S++,(fe.frame&15)===0&&S>0)){for(let q=0;q<S;q++)x[q]=T[q];let k=x.subarray(0,S);k.sort(),N.frameMs=k[S>>1],N.fps=N.frameMs>0?1e3/N.frameMs:0}if(C=O,_){_=!1;let k=document.getElementById("ff-grain");k&&k.parentNode&&k.parentNode.removeChild(k);for(let q of g)try{q()}catch{}g.length=0}},setGrain(D){o.uGrain.value=Math.max(0,+D||0)},setTier(D){u=D,p()},onFirstFrame(D){if(_)g.push(D);else try{D()}catch{}},get tier(){return u},uniforms:o};return Ee.on("tier:change",({tier:D})=>R.setTier(D)),R}var Or=[0,0,0],Ja=null;function U0(t){for(let e=0;e<_l.length;e++){let n=_l[e];ku(n,t,Or),xe[nd(n)].value.setRGB(Or[0],Or[1],Or[2])}}function BM(t){let e="#";for(let n=0;n<3;n++)e+=Math.round(t[n]*255).toString(16).padStart(2,"0").toUpperCase();return e}function m2(t){if(typeof document>"u")return;let e=document.documentElement.style;for(let n=0;n<_l.length;n++){let i=_l[n];if(t<=0){e.removeProperty(Ml[i]),e.removeProperty(Ml[i]+"-rgb");continue}ku(i,t,Or),e.setProperty(Ml[i],BM(Or)),e.setProperty(Ml[i]+"-rgb",`${Math.round(Or[0]*255)},${Math.round(Or[1]*255)},${Math.round(Or[2]*255)}`)}}var Ws={mode:{night:!1,inverted:0},init(){U0(Ws.mode.inverted)},setNight(t){let e=!!t;if(typeof document<"u"&&(e?document.documentElement.setAttribute("data-night",""):document.documentElement.removeAttribute("data-night")),e===Ws.mode.night&&!Ja){xe.uNight.value=e?1:0;return}Ws.mode.night=e,Ja&&Ja.cancel();let n=xe.uNight.value,i=e?1:0;Ja=Fn(zr.mixMs,r=>{xe.uNight.value=n+(i-n)*r}),Ja.done.then(()=>{Ja=null})},setInverted(t){let e=Math.max(0,Math.min(1,+t||0));Ws.mode.inverted=e,xe.uInvert.value=e,U0(e),m2(e),typeof document<"u"&&(e>=.5?document.documentElement.setAttribute("data-inverted",""):document.documentElement.removeAttribute("data-inverted"))},color(t){return(xe[nd(t)]||xe.cSilver).value},hex(t){return qo[t]?BM(ku(t,Ws.mode.inverted,Or)):qo.silver}};U0(0);var Jc=en.r5,HM=Jc.elevationDeg*Math.PI/180,g2=Math.cos(HM),x2=Math.sin(HM),B0=Math.PI*2,Fd=new P(0,0,0),k0=Nt.radius,kM=new P,Zc=!1,Qa=Math.PI*.75,z0=-.7,V0=.7,G0=0,H0=0,Ud=new P,Bd=new P,Fo=1,W0="",zM=new P,VM=new P,Kc=new P,GM=new P,Li={position:xe.uLamp.value,mode:"sweep",ctx:null,init(t){return Li.ctx=t,Li.setFocus(Fd.set(0,0,0),Nt.radius),Li},setFocus(t,e){Fd.copy(t),k0=e??k0},hold(t){t?(kM.copy(t),Zc||(Ud.copy(Li.position),Fo=0),Zc=!0):Zc&&(Zc=!1,Ud.copy(Li.position),Fo=0)},sweepOnce(t){H0=Math.max(200,t||1200),G0=fe.now+H0},update(t){let e=Ce.camera;if(!e)return;let n=fn.pointer,i=n.type==="touch"||ve.isPhone,r;fe.now<G0?r="sweep":i?r=n.down?"finger":"sweep":r=n.inside!==!1&&n.x>-9e3&&fe.now-n.lastMove<Jc.idleMs?"pointer":"sweep",r!==W0&&(W0&&(Ud.copy(Li.position),Fo=0),r==="sweep"&&(Qa=Math.atan2(V0,z0)),W0=r),Li.mode=r,zM.setFromMatrixColumn(e.matrixWorld,0),VM.setFromMatrixColumn(e.matrixWorld,1),Kc.copy(e.position).sub(Fd),Kc.lengthSq()<1e-12?Kc.setFromMatrixColumn(e.matrixWorld,2):Kc.normalize();let s,o;if(r==="sweep"){let l=fe.now<G0?H0:Jc.sweepMs;Qa+=B0*t*1e3/l,Qa>B0&&(Qa-=B0),s=Math.cos(Qa),o=Math.sin(Qa)}else{let l=n.x/Math.max(1,ve.w)*2-1,c=-(n.y/Math.max(1,ve.h))*2+1,u=Math.hypot(l,c);u>1e-4&&(z0=l/u,V0=c/u),s=z0,o=V0}GM.copy(zM).multiplyScalar(s).addScaledVector(VM,o).normalize();let a=Jc.radiusFactor*k0;Bd.copy(Fd).addScaledVector(GM,a*g2).addScaledVector(Kc,a*x2),Zc&&Bd.copy(kM),Fo<1?(Fo=Math.min(1,Fo+t*1e3/Jc.blendMs),Li.position.copy(Ud).lerp(Bd,cn.reveal(Fo))):Li.position.copy(Bd)}};var el=Math.PI*2,v2=gn.irisBladeDeg*Math.PI/180;function WM(t,e,n,i){for(let r=0;r<e;r++){let s=el*r/e-Math.PI/e,o=s+el/e;t.push(Math.sin(s)*n,i,Math.cos(s)*n,Math.sin(o)*n,i,Math.cos(o)*n)}}var y2=t=>Ct(t/1e3)*1e3;function XM(t,e){let n=gn.irisBlades*2+28,i=new Float32Array(n*6),r=Ii({segments:i,color:"silver",alpha:.42,far:e}),s=gn.irisR,o=0;function a(l){let c=0,u=(f,h,d,g)=>{i[c++]=f,i[c++]=t,i[c++]=h,i[c++]=d,i[c++]=t,i[c++]=g};for(let f=0;f<gn.irisBlades;f++){let h=el*f/gn.irisBlades,d=el*(f+1)/gn.irisBlades,g=s*(.06+.94*l),_=h+Math.PI/gn.irisBlades+v2*(1-l),m=Math.sin(_)*g,p=Math.cos(_)*g;u(Math.sin(h)*s,Math.cos(h)*s,m,p),u(m,p,Math.sin(d)*s,Math.cos(d)*s)}for(let f=0;f<28;f++){let h=el*f/28,d=el*(f+1)/28;u(Math.sin(h)*s,Math.cos(h)*s,Math.sin(d)*s,Math.cos(d)*s)}r.setSegments(i)}return a(0),{object:r.mesh,lines:r,get open(){return o},set(l){let c=Math.max(0,Math.min(1,l));c!==o&&(o=c,a(c))}}}function $M(t){let e=ae[t]||ae.CORE,n=e.n,i=new jt;i.name=`shell:${e.id}`;let r=e.floor-e.alt,s=e.ceil-e.alt,o=e.id==="CORE",a=e.far,l=[];for(let[p,M]of[[r,e.floor],[s,e.ceil]]){let T=o?300:y2(M);for(let x=gn.ringStep;x<T-1;x+=gn.ringStep)WM(l,n,x,p)}let c=Ii({segments:new Float32Array(l.length?l:[0,0,0,0,0,0]),color:"steel",alpha:l.length?1:0,far:a,flatten:!0});c.mesh.name="rings",i.add(c.mesh);let u=null;if(!o){let p=[],M=[];for(let T=gn.deckRingStep;T<=gn.deckR+1e-6;T+=gn.deckRingStep){WM(p,n,T,0);for(let x=0;x<n;x++)M.push(1-.75*(T/gn.deckR))}u=Ii({segments:new Float32Array(p),alpha:new Float32Array(M),color:"steel",far:a,flatten:!0}),u.mesh.name="deck",i.add(u.mesh)}let f=XM(s,a),h=XM(r,a);i.add(f.object,h.object);let d=1,g=!0,_={rings:l.length?1:0,deck:1,iris:.42};return{group:i,rings:c,deck:u,irisTop:f,irisBottom:h,setDeckVisible(p){g=!!p,u&&(u.mesh.visible=g&&d>0)},setIris(p,M){(p==="top"?f:h).set(M)},setFlatten(p,M){c.setFlatten(p,M),u&&u.setFlatten(p,M)},setAlpha(p){d=Math.max(0,Math.min(1,p)),c.setAlpha(_.rings*d),u&&(u.setAlpha(_.deck*d),u.mesh.visible=g&&d>0),f.lines.setAlpha(_.iris*d),h.lines.setAlpha(_.iris*d)},dispose(){c.dispose(),u&&u.dispose(),f.lines.dispose(),h.lines.dispose(),i.parent&&i.parent.remove(i)}}}var _2=`
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
}`,M2=`
${Pi}
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
}`;function YM(){let t=new jt;t.name="axisPillar";let e=12,n=[],i=1200,r=50;for(let d=-i;d<i;d+=r){let g=d,_=Math.min(i,d+r);_<=-e||g>=e?n.push(0,g,0,0,_,0):(g<-e&&n.push(0,g,0,0,-e,0),_>e&&n.push(0,e,0,0,_,0))}let s=Ii({segments:new Float32Array(n),color:"ember",width:2,alpha:.5,glint:.4,far:4e3});s.mesh.name="pillarRibbon",t.add(s.mesh);let o=new sc(gn.beadR,0),a=new Lt({uniforms:{uColor:ei("silver"),uBase:ei("obsidian"),cWhite:xe.cWhite,uLamp:xe.uLamp,uAlpha:{value:1},uFlash:{value:0},cAbyss:xe.cAbyss,uFogDensity:xe.uFogDensity},vertexShader:_2,fragmentShader:M2}),l=new Jl(o,a,gn.beadCount);l.name="pillarBeads";let c=new At,u=new Gi,f=new P,h=new P;for(let d=0;d<gn.beadCount;d++){let g=-i+gn.beadStep*d;f.set(0,g,0),h.setScalar(Math.abs(g)<e?0:1),l.setMatrixAt(d,c.compose(f,u,h))}return l.instanceMatrix.needsUpdate=!0,l.frustumCulled=!1,t.add(l),t.userData.ribbon=s,t.userData.beads=l,t.userData.uniforms={ribbon:s.uniforms,beads:a.uniforms},t}var Qc=new lc,eu=[];var dB=new P;function qM(t,e,n,i){if(!Ce.camera||!n||!n.length)return null;Ce.ray(t,e,Qc.ray),Qc.near=Ce.camera.near,Qc.far=Ce.camera.far,Qc.layers.mask=4294967295,eu.length=0,Qc.intersectObjects(n,!0,eu);let r=null;for(let s=0;s<eu.length;s++){let o=eu[s];if(b2(o.object)){r=o;break}}return eu.length=0,r?i?(Object.assign(i,r),i):r:null}function b2(t){for(let e=t;e;e=e.parent)if(!e.visible)return!1;return!0}var Uo=Math.PI/180,ci=Math.PI*2,S2=137.508*Uo;function w2(t){let e=an[t],n=Nt.sign.heightFrac*e.height;Kt.draw(`sign:${t}`,{height:(i,r,s)=>jM(i,r,s,t,n,!1),inlay:(i,r,s)=>jM(i,r,s,t,n,!0)})}function jM(t,e,n,i,r,s){t.fillStyle="#fff",t.strokeStyle="#fff";let o=e/r;if(Sl[i]==="•"){let g=(Nt.apertureD/2+.0045)*o,_=Nt.ringEngraveW*o;t.beginPath(),s?(t.lineWidth=1,t.arc(e/2,n/2,g-_/2,0,ci),t.stroke(),t.beginPath(),t.arc(e/2,n/2,g+_/2,0,ci),t.stroke()):(t.lineWidth=Math.max(1.5,_),t.arc(e/2,n/2,g,0,ci),t.stroke());return}let l=(i===0||i===6?.5:.9)*n,c=n/2+(i===0?.17*n:i===6?.02*n:0);t.font=bl.sign.replace("{px}",String(Math.round(l*1.38))),t.textAlign="center",t.textBaseline="alphabetic";let u=t.measureText(Sl[i]),f=u.actualBoundingBoxAscent||l,h=u.actualBoundingBoxDescent||0,d=c+(f-h)/2;s?(t.lineWidth=1,t.strokeText(Sl[i],e/2,d)):t.fillText(Sl[i],e/2,d)}function A2(){Kt.draw("ticks",{height:(t,e,n)=>{t.fillStyle="#fff";for(let i=0;i<Nt.ticksPerFace;i++)t.fillRect((i+.5)/Nt.ticksPerFace*e-1,0,2,n*.9)},inlay:(t,e,n)=>{t.fillStyle="#fff";for(let i=0;i<Nt.ticksPerFace;i++)t.fillRect(Math.round((i+.5)/Nt.ticksPerFace*e),0,1,n*.9)}})}function ZM(){Kt.texture||Kt.init(at.tier);for(let t=0;t<7;t++)w2(t);A2()}var E2="void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",T2=`
uniform vec3 uColor; uniform vec3 cElectrum; uniform vec3 cWhite; uniform float uNight, uI, uFlash, uEmissivePass, uGlowVis;
void main() {
  vec3 c = mix(uColor, cElectrum, uNight);
  float k = uI * mix(1.0, ${zr.nucleusIntensity.toFixed(2)}, uNight);
  k *= mix(1.0, uGlowVis, uEmissivePass);      // T3 bloom source obeys the SPEC visibility rule like the T1/T2 sprite
  gl_FragColor = vec4(mix(c * k, cWhite, uFlash), 1.0);
}`;function KM(t,e){let n=an[t],i=n.top+(n.bot-n.top)/3,r=n.top+(n.bot-n.top)*2/3,s=(Ct(i)+Ct(r))/2;return e.set(0,n.mid,s*Math.cos(Math.PI/n.n))}var JM=()=>({dy:0,slide:0,yaw:0,pitch:0,scaleR:1,scaleY:1,alpha:1,edgeFlash:0});function QM(t){ZM(),$a().then(ZM);let e=new jt;e.name="key";let n=Pc({perStratum:!0,vertices:!0,far:700});e.add(n.group);let i=n.strata,r=new Lt({uniforms:{uColor:{value:xe.cEmber.value},cElectrum:xe.cElectrum,cWhite:xe.cWhite,uNight:xe.uNight,uI:{value:1},uFlash:{value:0},uEmissivePass:xe.uEmissivePass,uGlowVis:{value:1}},vertexShader:E2,fragmentShader:T2}),s=new zt(new yo(zn.r,zn.detail),r);s.name="nucleus",s.userData.stratum=3;let o=cd({color:"ember",radius:zn.glowR,intensity:1,core:s,depthTest:!1,night:!0,nightIntensity:zr.nucleusIntensity,fog:!1,renderOrder:6});e.add(o.object);let a=Ii({segments:new Float32Array([0,-ki.half,0,0,ki.half,0]),color:"ember",width:ki.widthPx,alpha:ki.alphaInside,glint:.3}),l=8,c=new Float32Array(l*2*6),u=new Float32Array(l*2),f=Ii({segments:c,alpha:u,color:"ember",width:ki.widthPx,glint:.3});for(let w of[a,f])w.mesh.layers.enable(Qn.EMISSIVE),w.mesh.renderOrder=4,e.add(w.mesh);let h=-1;function d(w){if(w!==h){h=w;for(let L=0;L<2;L++){let V=L?-1:1;for(let oe=0;oe<l;oe++){let ge=ki.half+w*oe/l,Z=ki.half+w*(oe+1)/l,Q=(L*l+oe)*6;c[Q]=0,c[Q+1]=V*ge,c[Q+2]=0,c[Q+3]=0,c[Q+4]=V*Z,c[Q+5]=0,u[L*l+oe]=ki.alphaInside*(1-(oe+.5)/l)}}f.setSegments(c),f.mesh.geometry.attributes.aAl.needsUpdate=!0,f.mesh.visible=w>0}}d(ki.extend);let g=48,_=new Float32Array(g*6),m=KM(3,new P).z+.002;for(let w=0;w<g;w++){let L=w/g*ci,V=(w+1)/g*ci,oe=w*6;_.set([Math.cos(L)*zn.breathRingR,Math.sin(L)*zn.breathRingR,m,Math.cos(V)*zn.breathRingR,Math.sin(V)*zn.breathRingR,m],oe)}let p=Ii({segments:_,color:"ember",width:1,alpha:.8,glint:0});p.mesh.visible=!1,i[3].add(p.mesh);let M=pd({scale:1});M.setCount(Y.litNodes),i[3].add(M.object);let T=ti.T3.grains,x=new Float32Array(T*3),S=new Float32Array(T),E=[0];for(let w=1;w<7;w++)E.push((an[w-1].bot+an[w].top)/2);let C=2654435769,y=()=>{C=C+1831565813|0;let w=C;return w=Math.imul(w^w>>>15,w|1),w^=w+Math.imul(w^w>>>7,w|61),((w^w>>>14)>>>0)/4294967296};for(let w=0;w<T;w++){let L=E[w%7],oe=Math.max(.12,Ct(L))*Ot(Zo.annulus[0],Zo.annulus[1],Math.sqrt(y())),ge=y()*ci;x[w*3]=Math.sin(ge)*oe,x[w*3+1]=L+(y()-.5)*2*Zo.jitter,x[w*3+2]=Math.cos(ge)*oe,S[w]=Ot(Zo.sizePx[0],Zo.sizePx[1],y())}let A=Vs({positions:x,sizes:S,sizePx:1,color:"silver",alpha:.35,count:(at.params||ti.T2).grains});A.object.name="grains",e.add(A.object);let R={count:(at.params||ti.T2).grains,mode:"rings",setMode(w){R.mode=w},setPlate(){},writeTargets(){},commitTargets(){},flyToTargets(){},shiver(){},scatter(){}};Ee.on("tier:change",({tier:w})=>{let L=ti[w];L&&(R.count=Math.min(T,L.grains),A.setCount(R.count))});let D=()=>{te.satellites=Math.min(7,Y.data&&Y.data.drawings?Y.data.drawings.length:0)};D(),Ee.on("drawing:saved",D);let U=w=>w<=0?1:-Math.log(w)/Math.sqrt(Math.PI*Math.PI+Math.log(w)**2),G=[];for(let w=0;w<7;w++)G.push(new $i(22,U(.04),0));let N=new Float32Array(7),H=new Int32Array(7),O=[],k=[];for(let w=0;w<7;w++)O.push(null),k.push(JM());let q=null,j=1,J={scale:1,nucleus:1,gap:-1},ne=new $i(6,1,Pt.rest),Ue=new $i(6,1,0),Pe=new $i(6,.8,0),lt=!1,Ve=!0,et=1,$={on:!0,base:1,pulse:1,flashUntil:0,flashToken:null,oneFrameFlash:0},ee={t0:-1,amp:0},Me={t0:-1,amp:0,hz:0,decay:1,ms:0},Ze={t0:-1},be=0,re=xe.cEmber.value,ue=new P,Te=new P,Ge=new P,mt=new P,Se={x:0,y:0,depth:0,visible:!1},we={x:0,y:0,depth:0,visible:!1},tt=new P,$t=n.solids.concat([s]),Ht=Math.cos(zn.apertureAlignDeg[0]*Uo),Wt=Math.cos(zn.apertureAlignDeg[1]*Uo);function F(){for(let w=0;w<7;w++)Object.assign(k[w],JM());J.scale=1,J.nucleus=1,J.gap=-1}function wn(w,L){be=L;for(let se=0;se<7;se++){let me=G[se];if(N[se]!==0){me.x+=N[se]*w,me.v=0,me.target=me.x,N[se]*=Math.pow(di.spinDecay,w*1e3/di.frameMs);let Ae=ci/an[se].n,We=Math.floor(me.x/Ae);We!==H[se]&&(H[se]=We,Ke.play("tick",{})),Math.abs(N[se])<.35&&(N[se]=0,me.omega=6,me.zeta=1,me.target=Math.round(me.x/ci)*ci)}me.step(w)}ne.step(w),Ue.step(w),Pe.step(w);let V=ne.x;lt&&(V+=On.mix(Pt.rest,Pt.breath)-Pt.rest),J.gap>=0&&(V=J.gap),q&&q.gap!=null&&(V=Ot(V,q.gap,j)),yt=V;let oe=0;for(let se=0;se<7;se++){let me=k[se],Ae=O[se],We=Ae?j:0,ft=(3-se)*(V-Pt.rest)+me.dy+(Ae&&Ae.dy?Ae.dy*We:0),z=me.slide+(Ae&&Ae.slide?Ae.slide*We:0),Re=G[se].x+me.yaw+(Ae&&Ae.yaw?Ae.yaw*We:0);if(Me.t0>=0){let He=L-Me.t0;He>Me.ms?Me.t0=-1:Re+=Me.amp*Math.sin(ci*Me.hz*He/1e3+se*.9)*Math.exp(-He/Me.decay)}let ie=me.pitch+(Ae&&Ae.pitch?Ae.pitch*We:0),Ie=me.scaleR*(Ae&&Ae.scaleR!=null?Ot(1,Ae.scaleR,We):1),Oe=me.scaleY*(Ae&&Ae.scaleY!=null?Ot(1,Ae.scaleY,We):1),ce=me.alpha*(Ae&&Ae.alpha!=null?Ot(1,Ae.alpha,We):1);oe=Math.max(oe,me.edgeFlash+(Ae&&Ae.edgeFlash?Ae.edgeFlash*We:0));let qe=i[se];qe.position.set(Math.sin(Re)*z,ft,Math.cos(Re)*z),qe.rotation.set(ie,Re,0,"YXZ"),qe.scale.set(Ie,Oe,Ie),n.setStratumFade(se,ce)}for(let se=0;se<n.edges.length;se++)n.edges[se].uniforms.uFlash.value=Math.min(1,oe*.6);let ge=J.scale*(q&&q.scale!=null?Ot(1,q.scale,j):1);e.scale.setScalar(ge);let Z=Pe.x+(q&&q.pitch?q.pitch*j:0);if(Ze.t0>=0){let se=L-Ze.t0;se>600?Ze.t0=-1:Z+=8*Uo*Math.sin(Math.PI*se/600)}e.rotation.set(Z,Ue.x+(q&&q.yaw?q.yaw*j:0),q&&q.roll?q.roll*j:0,"YXZ");let Q=0;if(ee.t0>=0){let se=L-ee.t0;se>_e.shudder?ee.t0=-1:Q=Math.sin(ci*3*se/_e.shudder)*ee.amp*(1-se/_e.shudder)}e.position.set(Q,0,q&&q.dz?q.dz*j:0),e.updateWorldMatrix(!0,!0),tt.setFromMatrixPosition(e.matrixWorld);let ye=$.on?(lt?On.mix(zn.intensity[0],zn.intensity[1]):1)*$.pulse*J.nucleus:0;$.flashUntil&&L>$.flashUntil&&($.flashUntil=0,re=xe.cEmber.value,o.setColor("ember")),r.uniforms.uColor.value=re,r.uniforms.uI.value=ye,r.uniforms.uFlash.value=$.oneFrameFlash>0?1:0,o.setFlash(r.uniforms.uFlash.value),$.oneFrameFlash>0&&$.oneFrameFlash--;let Be=zn.minVisibility;if(Ce.camera&&(Ge.set(0,0,1).transformDirection(i[3].matrixWorld),ue.copy(Ce.camera.position).sub(tt).normalize(),Be=Math.max(Be,To(Ht,Wt,ue.dot(Ge)),To(zn.gapOpen[0],zn.gapOpen[1],V))),o.setIntensity(ye*Be*et),r.uniforms.uGlowVis.value=Be*et,p.mesh.visible){let se=On.mix(0,1);p.mesh.scale.setScalar(1+.04*se),p.setAlpha(.55+.35*se)}}let yt=Pt.rest,I={group:e,structure:n,radius:Nt.radius,nucleusWorld:tt,grains:R,nucleus:s,glow:o,litNodes:M,faceFrame(w,L){return KM(w,mt),L.F.copy(mt).applyMatrix4(i[w].matrixWorld),L.n.set(0,0,1).transformDirection(i[w].matrixWorld),L},stratumMatrix(w,L){return L.copy(i[w].matrixWorld)},pick(w,L){let V=qM(w,L,$t);return V&&V.object&&V.object.userData.stratum!=null?V.object.userData.stratum:-1},screenInfo(w){let L=Ce.camera;if(Ce.project(tt,Se),w.x=Se.x,w.y=Se.y,!L)return w.r=w.rx=w.ry=0,w;let V=e.scale.x;return ue.setFromMatrixColumn(L.matrixWorld,0),Te.copy(tt).addScaledVector(ue,Nt.radius*V),Ce.project(Te,we),w.r=Math.abs(we.x-Se.x),Te.copy(tt).addScaledVector(ue,.62*V),Ce.project(Te,we),w.rx=Math.abs(we.x-Se.x),ue.setFromMatrixColumn(L.matrixWorld,1),Te.copy(tt).addScaledVector(ue,1.2*V),Ce.project(Te,we),w.ry=Math.abs(we.y-Se.y),w},stratumScreenY(w){return ue.set(0,an[w].mid,0).applyMatrix4(i[w].matrixWorld),Ce.project(ue,Se).y},update:wn,onGesture(w){if(!Ve||!w||w.type!=="tap")return!1;let L=I.pick(w.x,w.y);return L<0?!1:(Ee.emit("key:click",{index:L,x:w.x,y:w.y}),!0)},setInteractive(w){Ve=!!w},setIdle(w){lt=!!w},setReveal(w){if(!w)return;et=w.fill!=null?Tt(w.fill):1,n.setParts({vertices:w.points!=null?Tt(w.points):1,solid:et,edges:1,lattice:et}),n.setFade(w.alpha!=null?Tt(w.alpha):1);for(let V=0;V<n.edges.length;V++)n.edges[V].uniforms.uFlash.value=w.scanY!=null?.35:0;let L=w.alpha==null||w.alpha>0;a.mesh.visible=L,f.mesh.visible=L&&h>0,p.mesh.visible=L&&v,M.object.visible=(w.alpha==null||w.alpha>0)&&M.count>0,A.setAlpha(.35*(w.alpha!=null?Tt(w.alpha):1))},setScramble(w){for(let L=0;L<7;L++){let V=0;w==="golden"?V=L*S2:w==="random"?V=(y()-.5)*ci:Array.isArray(w)&&(V=+w[L]||0),V=Math.atan2(Math.sin(V),Math.cos(V)),N[L]=0,G[L].snap(V)}},lockSequence(w={}){let L=w.order==="up"?[6,5,4,3,2,1,0]:[0,1,2,3,4,5,6],V=w.stepMs!=null?w.stepMs:_e.lockStep;if(w.spin)for(let oe of L)Math.abs(G[oe].x)>.01&&(N[oe]=3);return new Promise(oe=>{L.forEach((ge,Z)=>ut(Z*V,()=>{if(I.alignStratum(ge,{spring:"light",overshoot:w.snap!=null?w.snap:di.snapOvershoot}),Ke.play("ratchet",{i:ge}),w.onLock)try{w.onLock(ge)}catch{}Z===L.length-1&&ut(320,oe)}))})},alignStratum(w,L={}){let V=G[w];N[w]=0,V.omega=L.spring==="heavy"?6:22,V.zeta=U(L.overshoot!=null?L.overshoot:0),V.target=Math.round(V.x/ci)*ci},spinStratum(w,L){N[w]=L,H[w]=Math.floor(G[w].x/(ci/an[w].n))},ignite(w={}){$.on=!0,$.oneFrameFlash=w.flash===!1?0:1,re=w.color==="electrum"?xe.cElectrum.value:xe.cEmber.value,o.setColor(w.color==="electrum"?"electrum":"ember")},douse(){$.on=!1},shootAxis(w=ki.extend,L=ki.shootMs){return Fn(L,oe=>d(w*oe),cn.reveal).done},setBreathingRing(w){v=!!w,p.mesh.visible=v},setMorph(w,L,V,oe){if(F(),w==="dive"){let ge=oe>1600?1.375:1,Z=V/ge,Q=Tt(Z/120),ye=cn.camera(Tt((Z-120)/360));J.scale=Z<120?1-Nt.contract*cn.camera(Q):1-Nt.contract*(1-To(120,480,Z)),J.nucleus=1+(Nt.nucleusAnticipation-1)*(Z<120?Q:1-To(120,480,Z)),J.gap=Ot(Pt.rest,Pt.dive,ye);for(let Be=0;Be<7;Be++){let se=k[Be];Be===L?(se.slide=Nt.diveSlide*ye,se.yaw=-G[Be].x*ye,se.edgeFlash=Z<120?Q:1-To(480,900,Z)):(se.yaw=(Be<L?-1:1)*Nt.diveTurnAwayDeg*Uo*ye,se.alpha=1-To(480*ge,1e3*ge,V))}}else if(w==="recall"){let ge=_e.recallSwapAt*oe/_e.recall,Z=V-ge;if(Z<0){J.gap=Pt.recallStart;return}let Q=Tt(Z/(oe-ge||200));J.gap=Pt.rest+(Pt.recallStart-Pt.rest)*(1-cn.camera(Q))-(Pt.recallStart-Pt.rest)*di.settleOvershoot*Math.sin(Math.PI*Q);for(let ye=0;ye<7;ye++)Z<_e.recallRatchetMs*(ye+1)&&(k[ye].yaw=(ye%2?-1:1)*6*Uo)}else J.gap<0&&yt!==ne.x&&(ne.snap(yt),ne.target=Pt.rest)},override(w,L){w>=0&&w<7&&(O[w]=L||null)},overrideGroup(w){q=w||null},setOverrideWeight(w){j=Tt(w)},onRebase(w){F();for(let L=0;L<7;L++)N[L]=0,G[L].snap(0);ne.snap(w==="shrink"?Pt.recallStart:Pt.rest),ne.omega=4,ne.target=Pt.rest},shudder(w=6){Qt.reducedMotion&&(w=Math.min(w,2));let L=Ce.camera?Ce.camera.position.distanceTo(tt):7.2;ee.amp=w*L/Math.max(1,xe.uPxPerUnit.value),ee.t0=be},addYaw(w){Ue.x+=w},wobble(w,L,V,oe){Qt.reducedMotion||Object.assign(Me,{t0:be,amp:w,hz:L,decay:Math.max(1,V),ms:oe})},bow(){return Ze.t0=be,Ue.target=0,new Promise(w=>ut(600,w))},nudgePitch(w){Pe.x+=w*Uo},flashNucleus(w,L){re=w==="white"?xe.cWhite.value:xe.cElectrum.value,o.setColor(w==="white"?"white":"electrum"),$.flashUntil=be+Math.max(16,L||0)},setNucleusPulse(w){$.pulse=w>0?w:1}},v=!1;return I.setReveal({points:0,scanY:null,fill:0,alpha:0}),I.douse(),d(0),Ee.on("night:change",({night:w})=>M.setNight(w)),te.night&&M.setNight(!0),I}var R2=38,eb=-100,Bo=1024,Xs=256,C2=`
varying vec2 vUv; varying float vDist;
void main() { vUv = uv; vec4 v = modelViewMatrix * vec4(position, 1.0); vDist = length(v.xyz); gl_Position = projectionMatrix * v; }`,P2=`
${Pi}
uniform sampler2D uTex; uniform vec3 cSilver; uniform float uAlpha;
varying vec2 vUv; varying float vDist;
void main() {
  float a = texture2D(uTex, vUv).a * uAlpha;
  if (a <= 0.003) discard;
  gl_FragColor = vec4(applyFog(cSilver, vDist), a);
}`;function tb(t){let e=new jt;e.name="rim";let n=El(_t.operator.name||""),i=-gn.coreRimR*Math.cos(Math.PI/12)+.5,r=document.createElement("canvas");r.width=Bo,r.height=Xs;let s=new Jr(r);s.minFilter=Et,s.magFilter=Et,s.generateMipmaps=!1,s.wrapS=s.wrapT=Zn,Wi(s,Bo*Xs*4);let o=.5;function a(){let T=r.getContext("2d");T.clearRect(0,0,Bo,Xs),T.fillStyle="#fff",T.font=bl.burn.replace("{px}",String(Math.round(Xs*.78))),T.textAlign="center",T.textBaseline="middle",T.fillText(n,Bo/2,Xs/2+Xs*.04),o=Math.min(1,T.measureText(n).width/Bo),s.needsUpdate=!0,_()}let l=new Lt({uniforms:{uTex:{value:s},cSilver:xe.cSilver,uAlpha:{value:1},cAbyss:xe.cAbyss,uFogDensity:xe.uFogDensity},vertexShader:C2,fragmentShader:P2,transparent:!0,depthWrite:!1}),c=R2/.6,u=new zt(new Qr(c*(Bo/Xs),c),l);u.position.set(0,eb,i),u.visible=!1,u.name="rimName",e.add(u);let f=Math.max(1,Uc(_t.clan.sigil).length),h=new Float32Array(f*3),d=ud({positions:h,count:0,color:"ember",radius:lo.emitterM,intensity:1});e.add(d.object);let g=0;function _(){let T=c*(Bo/Xs)*o/2+12;for(let x=0;x<f;x++){let S=Math.floor(x/3),E=x%3;h[x*3]=T+S*6,h[x*3+1]=eb+(1-E)*7,h[x*3+2]=i+.5}d.setPositions(h,f),d.setCount(g)}a(),$a().then(a);let m=null;try{m=document.createElement("span"),m.className="sr-only",m.textContent=n,(document.getElementById("overlay")||document.body).appendChild(m)}catch{m=null}let p=1,M={group:e,burn(T){return M.showName(),Promise.resolve()},showName(){u.visible=p>0},setLitNodes(T){g=Math.max(0,Math.min(f,T|0)),d.setCount(g)},setAlpha(T){p=Math.max(0,Math.min(1,T)),l.uniforms.uAlpha.value=p,e.visible=p>0,d.setIntensity(p)}};return M.setLitNodes(Y.litNodes),M}function nb(t){let e=t.app,n=tr.rest,i=!1,r=null,s=!1,o=Je.core,a=new P(...o.pos),l=new P(...o.target),c={pos:new P,target:new P,fov:o.fov,offsetY:0,roll:0};function u(){return c.pos.copy(a),c.target.copy(l),c.fov=o.fov,c.offsetY=t.layout.kind==="desktop"?0:o.phoneOffsetY,c.roll=0,c}function f({index:g}){if(!i||t.director.busy()||e.phase!=="idle"&&e.phase!=="unfolded")return;if(g===3){t.director.go(s?"#/core":"#/core/open",{source:"key"});return}let _=hd(g);_&&t.director.go(`#/${_.slug}`,{source:"key"})}function h(g){s=g,e.unfolded=g,t.key&&(t.key.overrideGroup(g?{gap:Pt.unfold}:null),t.key.setOverrideWeight(1))}return{id:"CORE",build(){r=t.bus.on("key:click",f)},pose(){return u()},livePose(g){return Math.abs(n-tr.rest)<1e-4?!1:(g.target.copy(l),g.pos.copy(a).sub(l).multiplyScalar(n/tr.rest).add(l),g.fov=o.fov,g.offsetY=t.layout.kind==="desktop"?0:o.phoneOffsetY,g.roll=0,!0)},enter(){},exit(){},arrive(){i=!0,n=tr.rest},depart(){i=!1,s&&h(!1)},setSub(g){return g==="open"?(s||(h(!0),e.phase==="idle"&&zi("unfolded")),0):g==null?(s&&(h(!1),e.phase==="unfolded"&&zi("idle")),0):!1},update(){},onGesture(g){return t.key&&t.key.onGesture(g)?!0:g.type==="wheel"?(n=Math.max(tr.min,Math.min(tr.max,n*Math.pow(tr.wheelFactor,g.deltaY/tr.wheelStepPx))),!0):g.type==="pinch"?(n=Math.max(tr.min,Math.min(tr.max,n/Math.max(.2,g.dScale||1))),!0):!1},onKey(g){return g.key==="Escape"&&s?(t.director.go("#/core",{source:"kbd"}),!0):!1},resize(){},dispose(){r&&(r(),r=null),s&&h(!1),i=!1}}}function $s(t,e){if(t==="ZENITH")return e>0?"SIGNAL":null;let n=t==="WORKSHOP"?"MEMBERS":t,i=bn.indexOf(n);if(i<0)return null;let r=i+(e>0?1:-1);return r>=0&&r<bn.length?bn[r]:null}function ib(t){let e=dt.elevator,n=0,i=-1e9,r=0;function s(o){let a=$s(t.id,o);return n=0,r=0,a?(t.director.go(`#/${ae[a].slug}`,{source:"hall"}),!0):!1}return{onWheel(o){let a=t.loop.now;a-i>600&&(n=0,r=0),i=a;let l=o.deltaY||0;if(!l||(n!==0&&Math.sign(l)!==Math.sign(n)&&(n=0,r=0),!$s(t.id,Math.sign(l))))return!0;let c=Math.abs(n)<e.resistance*e.pxPerHall?.5:1;n+=l*c;let u=Math.floor(Math.abs(n)/e.tickPx);return u>r&&(r=u,t.audio&&t.audio.play("tick",{})),Math.abs(n)>=e.pxPerHall&&s(Math.sign(n)),!0},onSwipe(o){if(o.dir!=="up"&&o.dir!=="down")return!1;let a=o.dir==="up"?1:-1;return $s(t.id,a)?(Nr(Dr.lock),s(a)):!1},reset(){n=0,r=0,i=-1e9}}}var zd=Math.PI/180,Ys=Math.PI*2,I2=new Set(["SIGNAL","MEMBERS","INSIGNIA","NADIR","ZENITH","ARCHIVE"]),L2="Зал строится.",kd=[0,0,0];function Fr(t,e,n,i,r,s=Je.fov,o=0){return t.pos.set(e[0],e[1],e[2]),t.target.set(n,i,r),t.fov=s,t.offsetY=o,t.roll=0,t}function rb(t,e,n,i,r){return Fr(t,e,e[0],i,e[2]+(i-e[1])/Math.tan(n*zd),r)}function tu(t,e,n){return kd[0]=t,kd[1]=e,kd[2]=n,kd}function D2(t,e,n,i){let r=e==="phone",s;switch(t){case"MEMBERS":return s=Je.members.target,Fr(i,r?Je.members.phonePos:Je.members.pos,s[0],s[1],s[2]);case"VOYAGES":return r?rb(i,Je.voyages.phonePos,-Je.voyages.phonePitchDeg,0):Fr(i,tu(0,n,n*(44/70)),0,0,-6*(n/70));case"ARCHIVE":return Fr(i,tu(0,1.6,0),0,1.6,Je.archive.tubeR);case"SIGNAL":return r?Fr(i,Je.signal.phonePos,0,2+30*Math.tan(Je.signal.phonePitchDeg*zd),0,Je.fovWide):(s=Je.signal.target,Fr(i,Je.signal.pos,s[0],s[1],s[2],Je.signal.fov));case"INSIGNIA":return Fr(i,Je.insignia.pos,0,1.7,-10,Je.insignia.fov);case"NADIR":return Fr(i,tu(0,20,40),0,0,0);case"ZENITH":return rb(i,tu(0,50,30),r?Je.zenith.phonePitchDeg:Je.zenith.pitchDeg,-110);case"WORKSHOP":return Fr(i,tu(0,0,3.2),0,0,0);default:return s=Je.core.target,Fr(i,Je.core.pos,s[0],s[1],s[2],Je.core.fov,e==="desktop"?0:Je.core.phoneOffsetY)}}function ko(t,e,n,i=48,r=0,s=0){for(let o=0;o<i;o++){let a=Ys*o/i,l=Ys*(o+1)/i;t.push(r+Math.sin(a)*e,n,s+Math.cos(a)*e,r+Math.sin(l)*e,n,s+Math.cos(l)*e)}}function N2(t,e,n){let o=.75*Math.PI;for(let a of[1,-1])for(let l=0;l<10;l++){let c=Ys*l/10;t.push(e+Math.sin(c)*1.2,0,n+Math.cos(c)*1.2,e+Math.sin(c+a*o)*1.2,24,n+Math.cos(c+a*o)*1.2)}ko(t,1.2,0,14,e,n),ko(t,1.2,24,14,e,n),ko(t,1.2*1.6,24,14,e,n)}function sb(t,e,n,i){let r=wl(e),s=new Float32Array(t*3);for(let o=0;o<t;o++){let a=r()*Ys,l=Math.asin(.15+.85*r());s[3*o]=Math.cos(l)*Math.sin(a)*i,s[3*o+1]=n+Math.sin(l)*i,s[3*o+2]=Math.cos(l)*Math.cos(a)*i}return s}function O2(t,e){let n=[],i=null,r=[];switch(t){case"columns":{let s=e.world.members,o=s.length,a=s.filter(c=>c.id!==e.world.operator.id),l=s.find(c=>c.id===e.world.operator.id);l&&a.splice(Math.floor(a.length/2),0,l),a.forEach((c,u)=>{let f=o>1?(-25+50*u/(o-1))*zd:0,h=48*Math.sin(f),d=48-48*Math.cos(f);N2(n,h,d),r.push({id:c.id,label:c.name,pos:new P(h,24,d)})});break}case"hatches":for(let s=0;s<9;s++){let o=14*Math.sqrt(s),a=s*137.508*zd;ko(n,2.25,.05,24,Math.sin(a)*o,Math.cos(a)*o)}break;case"bands":for(let s=0;s<12;s++)ko(n,Je.archive.tubeR,2-1.6*s,56);break;case"sky":{let s=Je.signal.apexH,o=Je.signal.apexR;ko(n,o,s,36);for(let a=1;a<6;a++)ko(n,60+(o-60)*(a/6),s*a/6,48);for(let a of[1,-1])for(let l=0;l<24;l++){let c=Ys*l/24,u=c+a*(Ys/6);n.push(Math.sin(c)*60,0,Math.cos(c)*60,Math.sin(u)*o,s,Math.cos(u)*o)}i=sb(300,20833,Je.signal.apexH,900);break}case"dome":{let s=new yo(Je.insignia.sphereR,1),o=s.attributes.position.array,a=new Set,l=c=>`${o[c].toFixed(3)},${o[c+1].toFixed(3)},${o[c+2].toFixed(3)}`;for(let c=0;c<o.length;c+=9)for(let[u,f]of[[0,3],[3,6],[6,0]]){let h=l(c+u),d=l(c+f),g=h<d?h+"|"+d:d+"|"+h;a.has(g)||(a.add(g),n.push(o[c+u],o[c+u+1]+1.7,o[c+u+2],o[c+f],o[c+f+1]+1.7,o[c+f+2]))}s.dispose();break}case"chamber":{let s=Je.nadir.depth,o=40;for(let a=0;a<3;a++){let l=Ys*a/3,c=Ys*(a+1)/3;n.push(Math.sin(l)*o,0,Math.cos(l)*o,Math.sin(c)*o,0,Math.cos(c)*o),n.push(Math.sin(l)*o,0,Math.cos(l)*o,0,-s,0)}break}case"zenith":i=sb(400,11799,-40,1200);break;default:{i=new Float32Array(147);for(let s=0;s<49;s++)i[3*s]=(s%7-3)*.4,i[3*s+1]=(3-Math.floor(s/7))*.4,i[3*s+2]=0;break}}return{seg:n,pts:i,anchors:r}}function Nn(t,e={}){let n=t.id,i=t.meta,r=e.props||"grid",s=null,o=null,a=null,l=null,c=[],u=0,f=0,h=null,d=!1,g=Je.voyages.pos[1],_=new P,m={pos:new P,target:new P,fov:Je.fov,offsetY:0,roll:0};function p(){let x=Tt(u)*(1-Tt(f));s&&s.setAlpha(.55*x),o&&o.setAlpha((r==="grid"?.9:.4)*x),a&&(a.style.opacity=String(Tt(u)*(1-Tt(f*2))));let S=u>=.7&&f===0;for(let E of c)E.setVisible(S)}function M(){let x=document.createElement("div");x.className="ph-block scrim";let S=document.createElement("p");return S.className="t-body",S.textContent=L2,x.appendChild(S),x}return{id:n,build(){let{seg:x,pts:S,anchors:E}=O2(r,t);if(t.group&&(x.length&&(s=Ii({segments:new Float32Array(x),color:"silver",alpha:.55,width:1,far:Math.max(i.far,200)}),s.mesh.name=`ph:${r}`,t.group.add(s.mesh)),S)){let C=r==="sky"||r==="zenith";o=Vs({positions:S,sizePx:C?2:4,color:C?"white":"silver",alpha:.4,fog:!C,layer:C?Qn.NOFOG:Qn.DEFAULT}),t.group.add(o.object)}if(t.overlay&&E.length&&t.scale)for(let C of E){let y=C.pos.clone();c.push(t.overlay.add({owner:"placeholder",id:C.id,get:A=>{t.toCanonical(y,_),t.scale.toRender(_,A)},leader:{side:"right",len:40,rise:-24},button:{label:C.label,onActivate:()=>t.director.go(`#/members/${C.id}`,{source:"hall"})}}))}t.layout.isPhone||(a=M(),t.section.appendChild(a)),I2.has(n)&&(l=ib(t)),p()},pose(x){return D2(n,t.layout.kind,g,m)},livePose(x){return n!=="VOYAGES"||g===Je.voyages.pos[1]||t.layout.kind==="phone"?!1:(x.pos.set(0,g,g*(44/70)),x.target.set(0,0,-6*(g/70)),x.fov=Je.fov,x.offsetY=0,x.roll=0,!0)},enter(x){u=x,x>0&&(f=0),p()},exit(x){f=x,p()},arrive(){d=!0,u=1,f=0,p(),t.layout.isPhone&&t.sheet&&t.sheet.set(M(),{peek:null,state:"peek"})},depart(){d=!1,l&&l.reset(),t.layout.isPhone&&t.sheet&&t.sheet.set(null)},setSub(x){return h=x==null?null:String(x),0},update(){},onGesture(x){if(!d)return!1;if(n==="VOYAGES"&&x.type==="wheel"){let S=Je.voyages.altRange;return g=Math.max(S[0],Math.min(S[1],g+x.deltaY*.08)),!0}return l?x.type==="wheel"?l.onWheel(x):x.type==="swipe"?l.onSwipe(x):!1:!1},onKey(){return!1},resize(){!d||!t.sheet||t.layout.isPhone&&!a&&t.sheet.set(M(),{peek:null,state:"peek"})},dispose(){s&&(s.dispose(),s.mesh.parent&&s.mesh.parent.remove(s.mesh),s=null),o&&(o.dispose&&o.dispose(),o.object.parent&&o.object.parent.remove(o.object),o=null);for(let x of c)x.remove();c.length=0,a&&a.parentNode&&a.parentNode.removeChild(a),a=null,d&&t.layout.isPhone&&t.sheet&&t.sheet.set(null),d=!1},get sub(){return h}}}function ob(t){return Nn(t,{props:"columns"})}function ab(t){return Nn(t,{props:"grid"})}function lb(t){return Nn(t,{props:"hatches"})}function cb(t){return Nn(t,{props:"bands"})}function ub(t){return Nn(t,{props:"sky"})}function hb(t){return Nn(t,{props:"dome"})}function fb(t){return Nn(t,{props:"chamber"})}function db(t){return Nn(t,{props:"zenith"})}var pb=Object.freeze({CORE:nb,MEMBERS:ob,WORKSHOP:ab,VOYAGES:lb,ARCHIVE:cb,SIGNAL:ub,INSIGNIA:hb,NADIR:fb,ZENITH:db});var Di=new Map,Ur=[],hs=null,F2=null,qs=()=>{};function U2(t){let e={pos:new P(0,.75,7.2),target:new P,fov:Je.fov,offsetY:0,roll:0};return{id:t,build:qs,pose:()=>e,enter:qs,exit:qs,arrive:qs,depart:qs,setSub:()=>0,update:qs,onGesture:()=>!1,onKey:()=>!1,resize:qs,dispose:qs,stub:!0}}function B2(t){let e=document.createElement("section");e.className="hall",e.dataset.room=t,e.hidden=!0;let n=document.getElementById("halls");return n&&n.appendChild(e),e}function k2(t,e,n,i){let r=ae[t],s=Object.create(hs);return s.id=t,s.meta=r,s.group=i,s.section=e,s.shell=n,s.toCanonical=(o,a)=>a.copy(o).add(r.anchor),s}function mb(t,e){let n=B2(t),i=null,r=null;te.tier!=="T0"&&st.root&&(i=new jt,i.name=`hall:${t}`,i.position.copy(ae[t].anchor),i.visible=!1,st.root.add(i),r=$M(t),i.add(r.group));let s=k2(t,n,r,i),o={id:t,hall:null,hctx:s,section:n,shell:r,group:i,shown:!1,dead:!1,throwArmed:F2===t};Di.set(t,o),Ur.push(o);try{o.hall=te.tier==="T0"?U2(t):e(s);let a=o.hall.build();a&&typeof a.then=="function"&&a.then(null,l=>X0(t,l))}catch(a){return X0(t,a),Di.get(t)||null}return i&&(i.visible=!0),o}function gb(t){t.dead=!0;try{t.hall&&t.hall.dispose()}catch(n){xt(`hall:${t.id}`,`hall ${t.id} dispose failed`,n)}t.shell&&t.shell.dispose(),t.group&&t.group.parent&&t.group.parent.remove(t.group),t.section&&t.section.parentNode&&t.section.parentNode.removeChild(t.section),Di.delete(t.id);let e=Ur.indexOf(t);e>=0&&Ur.splice(e,1)}function X0(t,e){xt(`hall:${t}`,`hall ${t} failed — recalled to CORE`,e);let n=Di.get(t);n&&gb(n);let i=hs&&hs.director;if(t==="CORE"){mb("CORE",s=>Nn(s,{props:"grid"}));let r=Di.get("CORE");r&&te.room==="CORE"&&(st.show("CORE",!0),r.hall&&nu(r,"enter",1));return}i&&Promise.resolve().then(()=>i.go("#/core",{source:"error"}))}function nu(t,e,n,i,r){if(!(!t||t.dead||!t.hall||typeof t.hall[e]!="function"))try{return t.hall[e](n,i,r)}catch(s){X0(t.id,s);return}}function z2(t,e){for(let n=0;n<Ur.length;n++){let i=Ur[n];i.dead||!i.hall||nu(i,"update",t,e)}}var st={root:null,init(t){return hs=t,t.scale&&t.scale.root&&!st.root&&(st.root=new jt,st.root.name="halls",t.scale.root.add(st.root)),fe.add(z2,It.WORLD),t.bus.on("layout:change",()=>{for(let e=0;e<Ur.length;e++)nu(Ur[e],"resize")}),st},ensure(t){ae[t]||(t="CORE");let e=Di.get(t)||mb(t,pb[t]||(n=>Nn(n,{props:"grid"})));return e&&e.hall?e.hall:null},get(t){let e=Di.get(t);return e&&!e.dead?e.hall:null},current(){return st.get(te.room)},release(t){let e=Di.get(t);if(!e||t===te.room&&te.phase!=="transition")return;let n=hs&&hs.director;n&&n.busy()&&n.state.to&&(n.state.to.room===t||n.logicalSource()===t)||gb(e)},call(t,e,n,i,r){return nu(Di.get(t),e,n,i,r)},shell(t){let e=Di.get(t);return e?e.shell:null},group(t){let e=Di.get(t);return e?e.group:null},residents(){return Ur.map(t=>t.id)},restPose(t,e,n){let i=ae[t]||ae.CORE,r=Di.get(i.id),s=r?nu(r,"pose",e||null):void 0;return s&&s.pos&&s.target?(n.pos.copy(s.pos).add(i.anchor),n.target.copy(s.target).add(i.anchor),n.fov=s.fov||Je.fov,n.offsetY=s.offsetY||0,n.roll=s.roll||0):i.id==="CORE"?(n.pos.fromArray(Je.core.pos),n.target.fromArray(Je.core.target),n.fov=Je.core.fov,n.offsetY=hs&&hs.layout&&hs.layout.kind!=="desktop"?Je.core.phoneOffsetY:0,n.roll=0):(n.pos.set(0,i.alt+10,48),n.target.set(0,i.alt+12.5,0),n.fov=Je.fov,n.offsetY=0,n.roll=0),n},show(t,e=!1){for(let n=0;n<Ur.length;n++){let i=Ur[n];i.id===t?(i.shown=!0,i.section.hidden=!1):e&&(i.shown=!1,i.section.hidden=!0)}},hide(t){let e=Di.get(t);e&&(e.shown=!1,e.section.hidden=!0)}};function tl(){return{cam:{pos:new P,target:new P,fov:35,offsetY:0,roll:0},s:1,pivot:new P,Q:new P,fog:.00485,fade:{mini:0,key:1,vin:1,parent:0},alt:0,exitU:0,enterU:0,speed01:0,pan:0,counter:0,flashCode:null,morph:{kind:"none",i:3,tMs:0,D:1},vinStrata:new Float32Array([1,1,1,1,1,1,1]),vinGap:.02,rim:1,pillar:1,shellFrom:1,shellTo:1,iris:{fromTop:0,fromBottom:0,toTop:0,toBottom:0},vel:new P}}function js(t,e){return e.cam.pos.copy(t.cam.pos),e.cam.target.copy(t.cam.target),e.cam.fov=t.cam.fov,e.cam.offsetY=t.cam.offsetY,e.cam.roll=t.cam.roll,e.s=t.s,e.pivot.copy(t.pivot),e.Q.copy(t.Q),e.fog=t.fog,e.fade.mini=t.fade.mini,e.fade.key=t.fade.key,e.fade.vin=t.fade.vin,e.fade.parent=t.fade.parent,e.alt=t.alt,e.exitU=t.exitU,e.enterU=t.enterU,e.speed01=t.speed01,e.pan=t.pan,e.counter=t.counter,e.flashCode=t.flashCode,e.morph.kind=t.morph.kind,e.morph.i=t.morph.i,e.morph.tMs=t.morph.tMs,e.morph.D=t.morph.D,e.vinStrata.set(t.vinStrata),e.vinGap=t.vinGap,e.rim=t.rim,e.pillar=t.pillar,e.shellFrom=t.shellFrom,e.shellTo=t.shellTo,e.iris.fromTop=t.iris.fromTop,e.iris.fromBottom=t.iris.fromBottom,e.iris.toTop=t.iris.toTop,e.iris.toBottom=t.iris.toBottom,e.vel.copy(t.vel),e}function ru(t,e){t.fade.mini=0,t.fade.key=1,t.fade.vin=1,t.fade.parent=0,t.morph.kind="none",t.vinStrata.fill(1),t.vinGap=.02,t.rim=e?1:0,t.pillar=1,t.shellFrom=1,t.shellTo=1,t.iris.fromTop=0,t.iris.fromBottom=0,t.iris.toTop=0,t.iris.toBottom=0,t.speed01=0,t.pan=0,t.counter=0,t.flashCode=null}var iu=1024,Vd=new Float32Array(iu+1);for(let t=0;t<=iu;t++)Vd[t]=cn.camera(t/iu);function V2(t){if(t<=0)return 0;if(t>=1)return 1;let e=0,n=iu;for(;n-e>1;){let s=e+n>>1;Vd[s]<t?e=s:n=s}let i=Vd[e],r=Vd[n];return(e+(r>i?(t-i)/(r-i):0))/iu}var Zs=(t,e)=>V2(t)*e,hr=(t,e)=>cn.camera(Tt(t/e));function ui(t,e,n,i){let r=hr(e,i),s=hr(n,i);return s<=r?t>=s?1:0:Tt((t-r)/(s-r))}var zo=(t,e,n)=>Math.exp(Math.log(t)+(Math.log(e)-Math.log(t))*n),Ks=t=>{let e=Tt(t);return e*e*(3-2*e)};function $0(t,e=7){let n=Tt(t)*e,i=Math.floor(n);return i>=e?1:(i+Ks((n-i)*3))/e}function G2(t){let e=new P,n=new P,i=new Float64Array(12),r=(o,a,l,c,u,f,h,d)=>{let g=(l-a)/f-(c-a)/(f+h)+(c-l)/h,_=(c-l)/h-(u-l)/(h+d)+(u-c)/d;g*=h,_*=h,i[o]=l,i[o+1]=g,i[o+2]=-3*l+3*c-2*g-_,i[o+3]=2*l-2*c+g+_},s=(o,a)=>i[o]+i[o+1]*a+i[o+2]*a*a+i[o+3]*a*a*a;return{points:t,getPoint(o,a=new P){let l=t.length,c=(l-1)*o,u=Math.floor(c),f=c-u;f===0&&u===l-1&&(u=l-2,f=1);let h=u>0?t[u-1]:n.subVectors(t[0],t[1]).add(t[0]),d=t[u%l],g=t[(u+1)%l],_=u+2<l?t[u+2]:e.subVectors(t[l-1],t[l-2]).add(t[l-1]),m=Math.pow(h.distanceToSquared(d),.25),p=Math.pow(d.distanceToSquared(g),.25),M=Math.pow(g.distanceToSquared(_),.25);return p<1e-4&&(p=1),m<1e-4&&(m=p),M<1e-4&&(M=p),r(0,h.x,d.x,g.x,_.x,m,p,M),r(4,h.y,d.y,g.y,_.y,m,p,M),r(8,h.z,d.z,g.z,_.z,m,p,M),a.set(s(0,f),s(4,f),s(8,f))}}}function Gd(t,e){let n=[],i=[];for(let o=0;o<t.length;o++){if(n.length&&n[n.length-1].distanceToSquared(t[o])<1e-12){i[i.length-1]=e[o];continue}n.push(t[o].clone()),i.push(e[o])}n.length===1&&(n.push(n[0].clone()),i.push(i[0]+1e-6));let r=G2(n),s=n.length-1;return{curve:r,points:n,knots:i,sample(o,a){if(o<=i[0])return a.copy(n[0]);if(o>=i[s])return a.copy(n[s]);let l=0;for(;l<s-1&&o>i[l+1];)l++;let c=i[l+1]-i[l],u=c>0?(o-i[l])/c:1;return r.getPoint((l+u)/s,a)}}}function su(t,e,n,i,r,s){return s.set(i.x+r.x*(n-e)+e*t.x,i.y+r.y*(n-e)+e*t.y,i.z+r.z*(n-e)+e*t.z)}function Y0(t,e,n){let i=1-t;return Math.abs(i)<1e-9?n.set(0,0,0):n.copy(e).multiplyScalar(1/i)}var ou={restPose:null,faceFrame:null};function yb(t){Object.assign(ou,t||{})}function Hd(t,e){let n={pos:new P,target:new P,fov:Je.fov,offsetY:0,roll:0};if(ou.restPose)ou.restPose(t,e||null,n);else{let i=ae[t]||ae.CORE;i.id==="CORE"?(n.pos.fromArray(Je.core.pos),n.target.fromArray(Je.core.target)):(n.pos.set(0,i.alt+10,48),n.target.set(0,i.alt+12.5,0))}return n}var q0=t=>t==="WORKSHOP"?"MEMBERS":t==="ZENITH"?"SIGNAL":t;function j0(t,e){let n=q0(t),i=q0(e);return n==="CORE"&&i!=="CORE"?"DIVE":i==="CORE"&&n!=="CORE"?"RECALL":"LIFT"}function _b(t,e){let n=ae[t]||ae.CORE,i=ae[e]||ae.CORE;return Math.abs(n.stratum-i.stratum)}function Mb(t,e){let n=_b(t,e);return n<=1?_e.liftBase:Math.min(_e.liftMax,_e.liftBase+_e.liftPerBoundary*(n-1))}function H2(t,e,n){return t==="DIVE"?_e.dive:t==="RECALL"?_e.recall:t==="SLICE"?_e.slice:Mb(e,n)}function bb(t,e,n,i,r=900,s=-1){i.set(0,0,0);let o=n.x-e.x,a=n.y-e.y,l=n.z-e.z,c=Math.sqrt(o*o+a*a+l*l),u=s>0?s:c;if(c<1e-9||c<di.anticipationMinDisp*u)return i;let f=Tt(t)*r,h=di.anticipationMs,d=f<h?cn.reveal(f/h):f<3*h?1-Ks((f-h)/(2*h)):0,g=-(di.anticipationFrac*u*d)/c;return i.set(o*g,a*g,l*g)}function Z0(t,e,n,i){t.exitU=Tt(e/_e.depart),t.enterU=i>=0?e<i?0:Tt((e-i)/Math.max(1,n-i)):Tt((e-(n-_e.arrive))/_e.arrive)}var K0=t=>Math.sin(Math.PI*Tt(t));function xb(t,e,n,i){let r=Tt(t/120),s=cn.camera(Tt((t-120)/360)),o=t<120?1-Nt.contract*cn.camera(r):1-Nt.contract*(1-W2(120,480,t)),a=Ot(Pt.rest,Pt.dive,s);return i.copy(n).multiplyScalar(Nt.diveSlide*s),i.y+=(3-e)*(a-Pt.rest),o}function W2(t,e,n){let i=Tt((n-t)/(e-t));return i*i*(3-2*i)}function X2(t,e){let n=an[t],i=n.top+(n.bot-n.top)/3,r=n.top+(n.bot-n.top)*2/3,s=(Ct(i)+Ct(r))/2;return e.F.set(0,n.mid,s*Math.cos(Math.PI/n.n)),e.n.set(0,0,1),e}function J0(t,e,n={}){let i=Math.max(0,Math.min(6,e|0)),r=n.to||hd(i).id,s=!!n.first&&!n.D,o=Math.max(0,Math.min(1100,n.tb0||0)),a=n.D||(s?_e.diveFirst:_e.dive-o),l=_e.diveFirstScale,c=_e.diveFirstHold,u=1e3*l,f=s?Se=>Se<u?Se/l:Se<u+c?1e3:(Se-c)/l:Se=>o+Se*(_e.dive-o)/a,h=s?Se=>Se<1e3?Se*l:Se*l+c:Se=>(Se-o)*a/(_e.dive-o),d=h(_e.diveSwapAt),g=hr(d,a),_=t.s,m=t.Q.clone(),p={F:new P,n:new P};ou.faceFrame&&Math.abs(_-1)<1e-6&&m.lengthSq()<1e-12&&!n.D?ou.faceFrame(i,p):X2(i,p);let M=p.F,T=p.n.normalize(),x=Math.hypot(M.x,M.z),S=Math.min(.3,.5*x),E=new P,C=xb(o,i,T,E),y=T.clone().multiplyScalar(Nt.diveSlide).add(M);y.y+=(3-i)*(Pt.dive-Pt.rest);let A=Hd(r,n.sub),R=(ae[r]||ae.CORE).fog,D=t.cam.pos.clone().sub(m).multiplyScalar(1/(_*C)).sub(E),U=t.cam.target.clone().sub(m).multiplyScalar(1/(_*C)).sub(E),G=[D],N=[0],H=[U],O=[0];D.distanceTo(M)>2.2&&o<480&&(G.push(M.clone().addScaledVector(T,2)),N.push(hr(h(480),a))),o<700&&(G.push(M.clone().addScaledVector(T,.4)),N.push(hr(h(700),a))),G.push(M.clone().addScaledVector(T,-S)),N.push(g),G.push(A.pos.clone().multiplyScalar(1/1e3)),N.push(1),o<480&&(H.push(M.clone()),O.push(hr(h(480),a))),H.push(M.clone().addScaledVector(T,-S-.6)),O.push(g),H.push(A.target.clone().multiplyScalar(1/1e3)),O.push(1);let q=Gd(G,N),j=Gd(H,O),J=Math.max(0,h(Math.max(480,o))),ne=t.cam.fov,Ue=t.cam.offsetY,Pe=t.cam.roll,lt=t.fog,Ve=t.alt,et=t.rim,$=t.pillar,ee=t.fade.vin,Me=t.cam.pos.distanceTo(t.cam.target),Ze=G[1].clone(),be=o<480?hr(h(480),a):-1,re=[];for(let Se=Math.max(o,860);Se<=1120;Se+=1e3/Ex)re.push(hr(h(Se),a));let ue=new P,Te=new P,Ge=new P,mt=new P;return{kind:"DIVE",from:"CORE",to:r,duration:a,swapAt:g,swapKind:"grow",stratum:i,first:s,pose(Se,we){let tt=Zs(Se,a),$t=f(tt);if(ru(we,!1),Se<g){let Wt=xb($t,i,T,mt),F=zo(_,1e3,ui(Se,J,d,a));we.s=F,we.pivot.copy(y),we.Q.copy(m).addScaledVector(y,_-F),q.sample(Se,ue).add(mt).multiplyScalar(Wt),su(ue,F,_,m,y,we.cam.pos),o===0&&tt<3*di.anticipationMs&&(bb(tt/a,Te.copy(D),Ze,Ge,a,Me),we.cam.pos.addScaledVector(Ge,F)),j.sample(Se,ue).add(mt).multiplyScalar(Wt),su(ue,F,_,m,y,we.cam.target);let wn=Math.log(F/_)/Math.log(1e3/_);we.fog=zo(lt,R,Tt(wn));let yt=1-ui(Se,J,d,a);we.fade.vin=ee*yt,we.rim=et*yt,we.pillar=$*yt,we.shellFrom=yt,we.shellTo=0,we.morph.kind="dive",we.morph.i=i,we.morph.tMs=s?$t*l:$t,we.morph.D=s?_e.diveFirst:_e.dive}else{we.s=1,we.pivot.set(0,0,0),we.Q.set(0,0,0),q.sample(Se,we.cam.pos).multiplyScalar(1e3),j.sample(Se,we.cam.target).multiplyScalar(1e3),we.fog=R;let Wt=ui(Se,d,Math.min(a,d+_e.depart),a);for(let F=0;F<7;F++)we.vinStrata[F]=F===i?1:Wt;we.rim=0,we.pillar=Wt,we.shellFrom=0,we.shellTo=Wt}let Ht=ui(Se,d,a,a);return we.cam.fov=Ot(ne,A.fov,Ht),we.cam.offsetY=Ot(Ue,A.offsetY,Ht),we.cam.roll=Ot(Pe,A.roll,Ht),we.alt=Ot(Ve,(ae[r]||ae.CORE).alt,Se),Z0(we,tt,a,d),we.speed01=K0(ui(Se,J*.5,d,a)),we},cues(Se,we,tt){if(!(Se<=we||!tt||!tt.audio)){be>=0&&we<be&&Se>=be&&tt.audio.play("subDrop",{});for(let $t=0;$t<re.length;$t++)if(we<re[$t]&&Se>=re[$t]){tt.audio.play("strutTick",{});break}}}}}function Q0(t,e,n={}){let i=n.D||_e.recall,r=i/_e.recall,s=_e.recallSwapAt*r,o=_e.depart*r,a=hr(s,i),l=Hd("CORE",null),c=t.s,u=t.Q.clone(),f=t.cam.pos.clone(),h=t.cam.target.clone(),d=1/1e3,g=f.clone().sub(l.pos).sub(u).multiplyScalar(1/(c-d)),_=l.target.clone(),m=t.cam.fov,p=t.cam.offsetY,M=t.cam.roll,T=t.fog,x=t.alt,S=t.rim,E=t.pillar,C=ae.CORE.fog,y=new P;return{kind:"RECALL",from:e,to:"CORE",duration:i,swapAt:a,swapKind:"shrink",pose(A,R){let D=Zs(A,i);if(ru(R,!1),A<a){let U=ui(A,o,s,i),G=zo(c,d,U);R.s=G,R.pivot.copy(g),R.Q.copy(u).addScaledVector(g,c-G),R.cam.pos.copy(f),y.copy(_).multiplyScalar(G).add(R.Q),R.cam.target.copy(h).lerp(y,Ks(ui(A,o,s*.92,i))),R.cam.fov=Ot(m,l.fov,U),R.cam.offsetY=Ot(p,l.offsetY,U),R.cam.roll=Ot(M,0,U),R.fog=zo(T,C,Tt(Math.log(G/c)/Math.log(d/c))),R.fade.parent=ui(A,s*.55,s,i),R.vinGap=Ot(Pt.rest,Pt.recallStart,U),R.rim=S*(1-ui(A,0,o,i)),R.pillar=E,R.shellFrom=1,R.shellTo=0}else{R.s=1,R.pivot.set(0,0,0),R.Q.set(0,0,0),R.cam.pos.copy(l.pos),R.cam.target.copy(l.target),R.cam.fov=l.fov,R.cam.offsetY=l.offsetY,R.cam.roll=0,R.fog=C;let U=ui(A,s,i,i);R.rim=U,R.pillar=U,R.shellFrom=0,R.shellTo=U,R.morph.kind="recall",R.morph.i=3,R.morph.tMs=D/r,R.morph.D=_e.recall}return R.alt=Ot(x,0,A),Z0(R,D,i,-1),R.speed01=K0(ui(A,o,s,i)),R},cues(A,R,D){A<=R||!D||!D.audio||R<a&&A>=a&&D.audio.play("recallThud",{})}}}var vb=t=>t==="WORKSHOP"?"MEMBERS":t,Vo=["ZENITH","SIGNAL","ARCHIVE","MEMBERS","CORE","VOYAGES","INSIGNIA","NADIR"];function eg(t,e,n,i={}){let r=i.D||Mb(e,n),s=t.s,o=t.Q.clone(),a=Y0(s,o,new P),l=t.cam.pos.clone().sub(o).multiplyScalar(1/s),c=t.cam.target.clone().sub(o).multiplyScalar(1/s),u=Hd(n,i.sub),f=_b(e,n),h=u.pos.y>l.y,d=h?1:-1,[g,,_]=gn.liftOffset,m=[l];i.vel&&i.vel.length()/s>1&&m.push(l.clone().addScaledVector(i.vel,.12/s));let p=-1,M=-1;if(f>=1){let re=ae[vb(e)],ue=ae[vb(n)],Te=h?re.ceil:re.floor,Ge=h?ue.floor:ue.ceil;!(Math.abs(l.x-g)<4&&Math.abs(l.z-_)<4)&&(Te-l.y)*d>-5&&(m.push(new P(g,Te,_)),p=m.length-1),p<0||Math.abs(Ge-Te)>2?(m.push(new P(g,Ge,_)),M=m.length-1):M=p,p<0&&(p=M)}m.push(u.pos.clone());let T=[0],x=0;for(let re=1;re<m.length;re++)x+=m[re].distanceTo(m[re-1]),T.push(x);for(let re=0;re<T.length;re++)T[re]=x>0?T[re]/x:re/(T.length-1);let S=Gd(m,T),E=p>=0?T[p]:.3,C=M>=0?T[M]:.7,y=t.cam.fov,A=t.cam.offsetY,R=t.cam.roll,D=t.fog,U={...t.fade},G=Float32Array.from(t.vinStrata),N=t.vinGap,H=t.rim,O=i.shellFrom0!=null?i.shellFrom0:1,k=t.morph.kind==="dive"?{i:t.morph.i,tMs:t.morph.tMs,D:t.morph.D}:null,q=(ae[n]||ae.CORE).fog,j=t.cam.pos.distanceTo(t.cam.target),J=m[1].clone(),ne=Math.min(Vo.indexOf(e==="WORKSHOP"?"MEMBERS":e),Vo.indexOf(n==="WORKSHOP"?"MEMBERS":n)),Ue=Math.max(Vo.indexOf(e==="WORKSHOP"?"MEMBERS":e),Vo.indexOf(n==="WORKSHOP"?"MEMBERS":n)),Pe=[],lt=[],Ve=new P,et=new P,$=re=>{S.sample(0,Ve);for(let ue=1;ue<=240;ue++){let Te=ue/240;if(S.sample(Te,et),(Ve.y-re)*(et.y-re)<=0&&Ve.y!==et.y)return Te-1/240*((et.y-re)/(et.y-Ve.y));Ve.copy(et)}return-1};for(let re=ne+1;re<Ue;re++){let ue=ae[Vo[re]],Te=$(ue.alt);Te>=0&&Pe.push({room:ue.id,t0:Zs(Te,r)})}for(let re=ne;re<Ue;re++){let ue=ae[Vo[re]],Te=ae[Vo[re+1]],Ge=$((ue.floor+Te.ceil)/2);Ge>=0&&lt.push(Ge)}let ee=f>=1?[E,C]:[],Me=new P,Ze=new P,be=new P;return{kind:"LIFT",from:e,to:n,duration:r,swapAt:-1,swapKind:null,boundaries:f,pose(re,ue){let Te=Zs(re,r);ru(ue,!1);let Ge=zo(s,1,ui(re,0,r*.5,r));ue.s=Ge,ue.pivot.copy(a),ue.Q.copy(o).addScaledVector(a,s-Ge),S.sample(re,Me);let mt=Me.y;Te<3*di.anticipationMs&&(bb(Te/r,l,J,Ze,r,j),Me.add(Ze)),su(Me,Ge,s,o,a,ue.cam.pos),f>=1?(be.set(0,mt+d*30,0),Me.copy(c).lerp(be,Ks(E>0?re/E:1)),Me.lerp(u.target,Ks(C<1?(re-C)/(1-C):0))):Me.copy(c).lerp(u.target,Ks(re)),su(Me,Ge,s,o,a,ue.cam.target);let Se=Ks(re);ue.cam.fov=Ot(y,u.fov,Se),ue.cam.offsetY=Ot(A,u.offsetY,Se),ue.cam.roll=Ot(R,u.roll,Se),ue.fog=zo(D,q,Se);let we=ui(re,0,_e.depart,r);ue.fade.mini=Ot(U.mini,0,we),ue.fade.key=Ot(U.key,1,we),ue.fade.vin=Ot(U.vin,1,we),ue.fade.parent=Ot(U.parent,0,we);for(let tt=0;tt<7;tt++)ue.vinStrata[tt]=Ot(G[tt],1,we);if(ue.vinGap=Ot(N,Pt.rest,we),ue.rim=H*(1-we),ue.shellFrom=Ot(O,1,we),ue.shellTo=1,k&&(ue.morph.kind="dive",ue.morph.i=k.i,ue.morph.D=k.D,ue.morph.tMs=k.tMs*(1-ui(re,0,r*.6,r))),f>=1){let tt=$0(Te/_e.depart),$t=Te<r-300?1:1-$0((Te-(r-300))/300);h?(ue.iris.fromTop=tt,ue.iris.toBottom=$t):(ue.iris.fromBottom=tt,ue.iris.toTop=$t),ue.counter=Te>120&&Te<r-240?.12:0}ue.alt=(ue.cam.pos.y-ue.Q.y)/Ge,ue.flashCode=null;for(let tt=0;tt<Pe.length;tt++)Te>=Pe[tt].t0&&Te<Pe[tt].t0+180&&(ue.flashCode=Pe[tt].room);return Z0(ue,Te,r,-1),ue.speed01=K0(re),ue.pan=0,ue},cues(re,ue,Te){if(!(re<=ue||!Te||!Te.audio)){for(let Ge=0;Ge<ee.length;Ge++)ue<ee[Ge]&&re>=ee[Ge]&&Te.audio.play("irisWhoosh",{});for(let Ge=0;Ge<lt.length;Ge++)ue<lt[Ge]&&re>=lt[Ge]&&Te.audio.play("tick",{})}}}}function Sb(t,e){let n=_e.slice,i=_e.sliceSwap,r=e.room,s=js(t,tl()),o=Hd(r,e.sub),a=Y0(t.s,t.Q,new P),l=(ae[r]||ae.CORE).fog,c=hr(i,n);return{kind:"SLICE",from:null,to:r,duration:n,swapAt:-1,swapKind:null,cutAt:c,pose(u,f){return Zs(u,n)<i?(js(s,f),f.exitU=0,f.enterU=0,f.counter=0,f.flashCode=null,f):(ru(f,r==="CORE"),f.s=1,f.pivot.copy(a),f.Q.set(0,0,0),f.cam.pos.copy(o.pos),f.cam.target.copy(o.target),f.cam.fov=o.fov,f.cam.offsetY=o.offsetY,f.cam.roll=o.roll,f.fog=l,f.alt=(ae[r]||ae.CORE).alt,f.shellFrom=0,f.shellTo=1,f.exitU=1,f.enterU=1,f)},cues(u,f,h){f<c&&u>=c&&h&&h.t0&&h.app&&h.app.tier==="T0"&&h.t0.show(e)}}}function wb(t,e,n,i={}){let r=n.room,s=j0(e,r),o=Math.max(_e.retargetMin,_e.retargetFactor*H2(s,e,r)),a;if(s==="DIVE"){let l=ae[q0(r)].stratum;a=J0(t,l,{to:r,sub:n.sub,D:o,tb0:t.s>1.0001?480:0})}else s==="RECALL"?a=Q0(t,e,{D:o}):a=eg(t,e,r,{sub:n.sub,D:o,vel:t.vel,shellFrom0:i.shellFrom0});return a.retarget=!0,a.from=e,a}var Xn=tl(),dn=tl(),Go=tl(),lg={pos:new P,target:new P,fov:35,offsetY:0,roll:0},Wd={pos:new P,target:new P,fov:35,offsetY:0,roll:0},_i={strata:new Float32Array([1,1,1,1,1,1,1]),gap:.02,rim:1,pillar:1,morph:"none"},Qe=null,fs=null,au={},nl=null,ng=0,cu=0,cg=0,ds="forward",Xd=0,uu=0,ig=!1,rg=!1,qi=null,il=null,hu=-1,fu=null,pu="",du=0,sg=new Set,pe={phase:"idle",path:null,from:null,to:null,u:0,t:0,speed:1,scrubbing:!1,swapped:!1},Cb=(t,e)=>t&&typeof t[e]=="function",pn=(t,e,n,i,r)=>Cb(t,e)?t[e](n,i,r):void 0;function $2(t){let e=Qe.pillar;if(!e||_i.pillar===t)return;_i.pillar=t;let n=e.userData;if(n.ribbon&&n.ribbon.setAlpha(t),n.beads){n.beads.visible=t>.001;let i=n.beads.material;i.uniforms.uAlpha.value=t,i.transparent=t<.999}e.visible=t>.001}function Y2(t){Qe.rim&&_i.rim!==t&&(_i.rim=t,Qe.rim.setAlpha(t))}function ug(t){if(!Qe.renderer)return;Ye.scaleAbout(t.s,t.pivot),Ce.setPose(t.cam),t.fog>=0&&Rr.set(t.fog),xn.setFade(-1,t.fade.mini),xn.setFade(0,t.fade.key),xn.setFade(1,t.fade.vin),xn.setFade(2,t.fade.parent);let e=xn.structure(1);if(e){for(let r=0;r<7;r++)_i.strata[r]!==t.vinStrata[r]&&(_i.strata[r]=t.vinStrata[r],e.setStratumFade(r,t.vinStrata[r]));_i.gap!==t.vinGap&&(_i.gap=t.vinGap,e.setGap(t.vinGap))}Qe.key&&(t.morph.kind!=="none"?Qe.key.setMorph(t.morph.kind,t.morph.i,t.morph.tMs,t.morph.D):_i.morph!=="none"&&Qe.key.setMorph("none",3,0,1),_i.morph=t.morph.kind),Y2(t.rim),$2(t.pillar);let n=pe.to?st.shell(pe.to.room):null,i=qi?st.shell(qi):null;i&&i!==n&&(i.setAlpha(t.shellFrom),i.setIris("top",t.iris.fromTop),i.setIris("bottom",t.iris.fromBottom)),n&&(n.setAlpha(t.shellTo),n.setIris("top",t.iris.toTop),n.setIris("bottom",t.iris.toBottom))}function q2(){j2(dn),Qe.renderer&&(dn.cam.pos.copy(Ce.pose.pos),dn.cam.target.copy(Ce.pose.target),dn.cam.fov=Ce.pose.fov,dn.cam.offsetY=Ce.pose.offsetY,dn.cam.roll=Ce.pose.roll,dn.s=Ye.s,dn.Q.copy(Ye.Q),Ye.fixedPoint(dn.pivot),dn.fog=Rr.density,dn.fade.mini=xn.fade(-1),dn.fade.key=xn.fade(0),dn.fade.vin=xn.fade(1),dn.fade.parent=xn.fade(2),dn.vel.copy(Ce.velocity)),dn.alt=Rn.altitude()}function j2(t){t.vinStrata.set(_i.strata),t.vinGap=_i.gap,t.rim=_i.rim,t.pillar=_i.pillar,t.morph.kind="none",t.exitU=0,t.enterU=0,t.counter=0,t.flashCode=null,t.shellFrom=1,t.shellTo=0,t.iris.fromTop=t.iris.fromBottom=t.iris.toTop=t.iris.toBottom=0}function rl(){let t=Rn.current||{room:"CORE",sub:null};st.restPose(t.room,t.sub,lg)}function Z2(t){hg();let e=t==="LIFT"?"liftRumble":t==="DIVE"||t==="RECALL"?"whoosh":null;e&&Qe.audio&&(il=Qe.audio.start(e,{speed01:0}))}function hg(){if(il){try{il.stop()}catch{}il=null}}function K2(){let t=document.getElementById("fx");if(!t)return;let e=document.createElement("i");e.className="slice",t.appendChild(e),ut(_e.slice+40,()=>{e.parentNode&&e.parentNode.removeChild(e)})}function Pb(t,e,n,i){if(Qt.reducedMotion||te.tier==="T0")return Sb(t,n);if(i)return wb(t,i,n,{shellFrom0:t.shellTo});let s=st.get(n.room);if(Cb(s,"entryPath")){let a=st.call(n.room,"entryPath",e.room,t);if(a)return a}let o=j0(e.room,n.room);if(o==="DIVE"){let a=n.room==="WORKSHOP"?"MEMBERS":n.room==="ZENITH"?"SIGNAL":n.room;return J0(t,ae[a].stratum,{first:!(Y.data&&Y.data.firstDive),fromUnfold:!!te.unfolded,sub:n.sub,to:n.room})}return o==="RECALL"?Q0(t,e.room):eg(t,e.room,n.room,{sub:n.sub})}function Ib(t,e,n,i){pe.path=t,pe.from=e,pe.to=n,pe.t=0,pe.u=0,pe.speed=1,pe.swapped=!1,pe.phase="transition",pe.scrubbing=!!i.scrub,uu=0,ds="forward",ng=0,cu=fe.at(),cg=cu,ig=!1,nl=null,rg=!0,Yd++,pe.scrubbing||Ob(cu,!0),au=i,te.u=0,t.kind==="SLICE"&&K2(),Z2(t.kind),Ee.emit("travel:start",{from:e,to:n,kind:t.kind,duration:t.duration})}var Ab=new WeakSet;function Lb(t){let e=st.group(t);if(!(!e||!Qe.renderer||!Ce.camera||Ab.has(e))){Ab.add(e);try{Qe.renderer.warm(e,Ce.camera,Qe.scene)}catch{}}}function Eb(t,e){let n=Rn.current;q2(),st.ensure(t.room),Lb(t.room),qi=n.room;let i=Pb(dn,n,t,null);return zi("transition"),st.call(n.room,"depart"),pn(Qe.datum,"depart"),Qe.renderer&&xn.setHallLod(null),Ee.emit("room:depart",{room:n.room,to:t}),Ib(i,n,t,e),new Promise(r=>{fs=r})}function Db(){let t=pe.path;if(!t)return te.room;let e=qi||pe.from&&pe.from.room||te.room,n=pe.to.room;if(t.swapAt>=0)return pe.swapped?n:e;if(t.kind==="SLICE")return pe.u>=(t.cutAt||.5)?n:e;if(t.kind!=="LIFT")return pe.u<.5?e:n;let i=dn.alt;for(let o of[e,n]){let a=ae[o];if(a&&i>=a.floor&&i<=a.ceil)return o}let r=e,s=1/0;for(let o of bn.concat(["ZENITH"])){let a=ae[o],l=i<a.floor?a.floor-i:i>a.ceil?i-a.ceil:0;l<s&&(s=l,r=o)}return r}function J2(t,e){let n=Db(),i=pe.to.room,r=qi;if(fs){let a=fs;fs=null,a(!1)}Ee.emit("travel:end",{from:pe.from,to:pe.to,kind:pe.path.kind,completed:!1}),n===i&&i!==t.room&&(st.call(i,"depart"),st.call(i,"exit",1)),qi=n,st.ensure(t.room),Lb(t.room);for(let a of st.residents())a!==t.room&&a!==n&&a!==r&&st.release(a);r&&r!==n&&r!==t.room&&(st.call(r,"exit",1),fg(r)),js(dn,Go),Qe.renderer&&(Go.vel.copy(Ce.velocity),Go.Q.copy(Ye.Q),Go.s=Ye.s);let s={room:n,sub:null,hash:`#/${ae[n].slug}`},o=Pb(Go,s,t,n);return nl=null,Ib(o,s,t,e),new Promise(a=>{fs=a})}function fg(t){ut(_e.releaseSourceMs,()=>{t===te.room&&pe.phase!=="transition"||pe.phase==="transition"&&(pe.to.room===t||qi===t)||st.release(t)})}function dg(t,e,n){let i=t.hash;try{let r=location.hash;e==="history"?r!==i&&!(r===""&&i==="#/core")&&window.history.replaceState(null,"",i):n||e==="hash"||e==="go"||e==="deeplink"||r===i?window.history.replaceState(null,"",i):window.history.pushState(null,"",i)}catch{}pu=location.hash}function Nb(){let t=pe.path,e=pe.from,n=pe.to;t.pose(1,Xn),ug(Xn),js(Xn,dn),hg();let i=!sg.has(n.room);sg.add(n.room),du+=1,te.room=n.room,te.route=n,te.u=0,Rn.current=n,pe.phase="idle",pe.scrubbing=!1,pe.u=0;let r=t.kind;Qe.renderer&&xn.setHallLod(n.room),st.show(n.room,!0),st.call(n.room,"enter",1),zi("idle"),st.call(n.room,"arrive",{first:i,sub:n.sub,kind:r,arrivals:du});let s=n;n.sub&&st.call(n.room,"setSub",n.sub,{instant:!0})===!1&&(s=Lr(`#/${ae[n.room].slug}`),Rn.current=s,te.route=s,au={...au,replace:!0}),pn(Qe.datum,"counter",ae[n.room].alt,0),pn(Qe.datum,"flashCode",null),pn(Qe.datum,"arrive",n.room),pn(Qe.chrome,"setRoom",n.room),pn(Qe.keyNav,"setNeedle",ae[n.room].alt),pn(Qe.keyNav,"setCurrent",n.room),pn(Qe.keyNav,"lockTwin"),Qe.audio&&Qe.audio.play("arrivalLock",{root:ae[n.room].root}),pn(Qe.edges,"twitch"),ve.isPhone&&Nr(Dr.lock),document.title=kc(s),dg(s,au.source,!!au.replace),Y.set("lastRoom",s.hash),r==="DIVE"&&Y.data&&!Y.data.firstDive&&Y.set("firstDive",!0),rl(),Rn.lastTravel={kind:r,from:e.hash,to:s.hash,plannedMs:t.duration,ms:fe.at()-cg,completed:!0},pe.path=null,Ee.emit("room:arrive",{room:n.room,sub:s.sub,first:i,kind:r,arrivals:du}),Ee.emit("route:change",{route:s,prev:e}),Ee.emit("travel:end",{from:e,to:s,kind:r,completed:!0}),te.tier==="T0"&&Qe.t0&&pn(Qe.t0,"show",s);for(let a of st.residents())a!==n.room&&fg(a);let o=fs;fs=null,o&&o(!0)}function Q2(){let t=pe.path,e=pe.from,n=pe.to;t.pose(0,Xn),ug(Xn),js(Xn,dn),hg(),pe.phase="idle",pe.scrubbing=!1,pe.u=0,te.u=0;let i=qi||e.room;Qe.renderer&&xn.setHallLod(i),st.call(i,"exit",0),st.show(i,!0),zi("idle"),st.call(i,"arrive",{first:!1,sub:Rn.current.sub,kind:"REVERT",arrivals:du}),pn(Qe.datum,"counter",ae[i].alt,0),pn(Qe.datum,"arrive",i),pn(Qe.keyNav,"setNeedle",ae[i].alt),pn(Qe.keyNav,"setCurrent",i),Rn.lastTravel={kind:t.kind,from:e.hash,to:n.hash,plannedMs:t.duration,ms:fe.now-cg,completed:!1},pe.path=null,Ee.emit("travel:end",{from:e,to:n,kind:t.kind,completed:!1}),n.room!==i&&fg(n.room),rl();let r=fs;fs=null,r&&r(!1)}var tg={speed01:0,pan:0};function og(t){let e=pe.path;e.swapAt>=0&&(!pe.swapped&&t>=e.swapAt?(Qe.renderer&&(e.pose(Math.max(0,e.swapAt-1e-6),Go),Ye.scaleAbout(e.swapKind==="grow"?1e3:.001,Go.pivot),nl=Ye.rebase(e.swapKind)),pe.swapped=!0):pe.swapped&&t<e.swapAt&&(nl&&Qe.renderer&&Ye.unrebase(nl),nl=null,pe.swapped=!1)),e.pose(t,Xn),ug(Xn),qi&&qi!==pe.to.room&&st.call(qi,"exit",Xn.exitU),st.call(pe.to.room,"enter",Xn.enterU),pn(Qe.keyNav,"setNeedle",Xn.alt),Qe.audio&&Qe.audio.setRootU(pe.from.room,pe.to.room,t),pn(Qe.datum,"counter",Xn.alt,Xn.counter),pn(Qe.datum,"flashCode",Xn.flashCode),il&&(tg.speed01=Xn.speed01,tg.pan=Xn.pan,il.set(tg)),e.cues&&e.cues(t,ng,Qe),!ig&&t>=_e.interactiveU&&(ig=!0,st.show(pe.to.room),Ee.emit("travel:interactive",{to:pe.to})),te.u=t,pe.u=t,ng=t,js(Xn,dn)}function eP(t){if(!Qe.renderer||te.phase==="boot"||te.phase==="start")return;let e=te.room,n=st.get(e);if(n&&typeof n.livePose=="function"&&st.call(e,"livePose",Wd,t)===!0){let i=ae[e].anchor;Wd.pos.add(i),Wd.target.add(i),Ce.setPose(Wd);return}Ce.setPose(lg)}function tP(t){let e=fe.now,n=e-cu;if(cu=e,rg&&(rg=!1,n<0&&(n=0)),pe.phase!=="transition"){eP(t);return}let i=pe.path.duration,r;if(pe.scrubbing)r=uu;else if(ds==="inertia")r=Tt(pe.u+Xd*n/1e3),Xd*=Math.pow(di.inertiaDecay,n/di.frameMs),(Math.abs(Xd)<.05||r<=0||r>=1)&&(ds=r<.5?"reverse":"forward",pe.t=Zs(r,i));else if(ds==="reverse"){if(pe.t=Math.max(0,pe.t-n*pe.speed),r=cn.camera(pe.t/i),pe.t<=0){og(0),Q2();return}}else pe.t=Math.min(i,pe.t+n*pe.speed),r=cn.camera(pe.t/i);og(r),!pe.scrubbing&&ds==="forward"&&(pe.t>=i?Nb():Ob(e))}var lu=0,ag=0,Yd=0,Tb=0;function nP(){lu=0,!(ag!==Yd||pe.phase!=="transition"||pe.scrubbing||ds!=="forward"||!pe.path||!fe.running)&&(pe.t=pe.path.duration,og(1),Nb())}function Ob(t,e){let n=(pe.path.duration-pe.t)/Math.max(1e-6,pe.speed)-(fe.at()-t);if(n>400&&!e)return;let i=performance.now()+Math.max(0,n);lu&&ag===Yd&&!e&&i>=Tb||(lu&&clearTimeout(lu),ag=Yd,Tb=i,lu=setTimeout(nP,Math.max(0,n)))}function $d(){if(hu>=0&&(Vn(hu),hu=-1),fu){let t=fu;fu=null,t(!1)}}function Rb(t,e,n){Rn.current=t,te.route=t,dg(t,n.source,!!n.replace),document.title=kc(t),Y.set("lastRoom",t.hash),rl(),Ee.emit("route:change",{route:t,prev:e}),te.tier==="T0"&&Qe.t0&&pn(Qe.t0,"show",t)}function iP(t,e){$d();let n=Rn.current,i=st.call(t.room,"setSub",t.sub,{instant:Qt.reducedMotion});if(i===!1||i===void 0){let r=Lr(`#/${ae[t.room].slug}`);return n.sub&&st.call(t.room,"setSub",null,{instant:!0}),Rb(r,n,{...e,replace:!0}),Promise.resolve(!0)}return new Promise(r=>{fu=r,hu=ut(Math.max(0,+i||0),()=>{hu=-1,fu=null,Rb(t,n,e),r(!0)})})}function rP(){pu=location.hash,Rn.go(location.hash,{source:"history"})}function sP(){location.hash!==pu&&(pu=location.hash,Rn.go(location.hash,{source:"hash"}))}var Rn={state:pe,current:null,lastTravel:null,init(t){return Qe=t,t.director=Rn,t.halls=st,yb({restPose:(e,n,i)=>st.restPose(e,n,i),faceFrame:t.key?(e,n)=>t.key.faceFrame(e,n):null}),Rn.current=Lr("#/core"),te.room="CORE",te.route=Rn.current,sg.add("CORE"),pu=location.hash,fe.add(tP,It.DIRECTOR),window.addEventListener("popstate",rP),window.addEventListener("hashchange",sP),Ee.on("layout:change",rl),st.ensure("CORE"),st.show("CORE",!0),rl(),t.renderer&&te.phase!=="boot"&&te.phase!=="start"&&Ce.setPose(lg),Rn},settle(){pe.phase==="transition"||te.room!=="CORE"||(rl(),st.call("CORE","enter",1),st.call("CORE","arrive",{first:!0,sub:null,kind:"BOOT",arrivals:du}),pn(Qe.chrome,"setRoom","CORE"),pn(Qe.keyNav,"setCurrent","CORE"),pn(Qe.keyNav,"setNeedle",0))},go(t,e={}){try{let n=e.source||"go",i={...e,source:n},r=A0(Lr(t),n);r.status&&pn(Qe.status,"say",r.status,r.vars||{}),r.shudder&&(pn(Qe.keyNav,"shudder",r.shudder),te.room==="CORE"&&pe.phase!=="transition"&&Qe.key&&Qe.key.shudder(6));let s=r.route;if(pe.phase==="transition")return s.hash===pe.to.hash?new Promise(a=>{Ee.once("travel:end",l=>a(!!l.completed))}):($d(),J2(s,i));let o=Rn.current;return s.hash===o.hash?($d(),location.hash&&location.hash!==s.hash&&dg(s,"history",!0),Promise.resolve(!0)):s.room===o.room?iP(s,i):($d(),Eb(s,i))}catch{return Promise.resolve(!1)}},speedUp(){pe.phase==="transition"&&!pe.scrubbing&&ds==="forward"&&(pe.speed=_e.skipSpeed)},scrub:{begin(t){if(Qt.reducedMotion||te.tier==="T0"||!Qe.renderer)return!1;if(pe.phase==="transition")return pe.scrubbing=!0,uu=pe.u,ds="forward",!0;let e=A0(Lr(t),"nav").route;return e.room===Rn.current.room?!1:(Eb(e,{source:"nav",scrub:!0}),!0)},set(t){pe.phase==="transition"&&pe.scrubbing&&(uu=Tt(t))},end(t=0){pe.phase!=="transition"||!pe.scrubbing||(pe.scrubbing=!1,pe.u=uu,pe.speed=1,Xd=t||0,ds="inertia")}},altitude(){return pe.phase==="transition"?dn.alt:(ae[te.room]||ae.CORE).alt},busy(){return pe.phase==="transition"},logicalSource(){return pe.phase==="transition"?qi:null},logicalRoom(){return pe.phase==="transition"?Db():te.room}};var pg=0;function oP(t,e){let n=e==null?t.textContent:String(e);t.textContent="";let i=[];for(let r of n){let s=document.createElement("span");s.className="lock-letter",s.textContent=r,t.appendChild(s),i.push(s)}return i}function mg(t,e){return t.style.opacity="0",Fn(e,n=>{t.style.opacity=String(n)},cn.reveal).done.then(()=>{t.style.opacity=""})}function Fb(t,e={}){if(!t)return Promise.resolve();let n=e.weight||220,i=e.ms||_e.lockIn;if(Qt.reducedMotion)return mg(t,_e.lockInReduced);if(pg>=2)return Promise.resolve();pg+=1;let r=t.textContent,s=oP(t,r),o=Y.shrp||28,a=-1,l=c=>{let u=cn.reveal(c),f=Math.round(u*5)/5,h=f!==a?`"SHRP" ${(o*f).toFixed(1)}, "wght" ${Math.round(120+(n-120)*f)}, "CRSV" 0, "slnt" 0`:null;a=f;let d=fe.now/1e3;for(let g=0;g<s.length;g++){let _=s[g].style;h&&(_.fontVariationSettings=h),_.transform=u<1?`translateX(${(Math.sin(17*d+g)*(1-u)*4).toFixed(2)}px)`:""}};return l(0),Fn(i,l).done.then(()=>{pg-=1,t.textContent===r&&(t.textContent=r)})}function Ub(t,e={}){if(!t)return Promise.resolve();let n=e.msPerChar||_e.revealMsPerChar,i=e.maxMs||_e.revealMax;if(Qt.reducedMotion)return mg(t,_e.lockInReduced);let r=Math.min(i,Math.max(1,t.textContent.length*n));t.classList.add("reveal-mask");let s=o=>{t.style.setProperty("--reveal",`${(o*108).toFixed(1)}%`),t.style.opacity=String(Math.min(1,o*2))};return s(0),Fn(r,s).done.then(()=>{t.classList.remove("reveal-mask"),t.style.removeProperty("--reveal"),t.style.opacity=""})}function Bb(t,e,n={}){if(!t)return Promise.resolve();let i=n.cps||_e.beamCps;if(Qt.reducedMotion)return t.textContent=String(e),mg(t,_e.lockInReduced);t.textContent="";let r=[];for(let c of String(e)){let u=document.createElement("span");u.className="beam-letter",u.textContent=c,t.appendChild(u),r.push(u)}let s=document.getElementById("fx"),o=document.createElement("i");o.className="beam-head",s&&s.appendChild(o);let a=r.map(c=>c.getBoundingClientRect()),l=1e3/i;return new Promise(c=>{let u=0,f=()=>{if(u>=r.length){ut(160,()=>{o.parentNode&&o.parentNode.removeChild(o)}),c();return}let h=a[u];o.style.transform=`translate3d(${(h.right-1.5).toFixed(1)}px, ${(h.bottom-h.height*.2).toFixed(1)}px, 0)`,r[u].classList.add("is-lit"),u+=1,ut(l,f)};f()})}var nt={datum:null,line:null,label:null,title:null,level:null,flash:null,giant:null},yg=null,gg=!1,mu="CORE",gu=!1,kb=null,qd="",_g=0,zb=new P,Vb=new P,Gb=new P,Mg=!1;function sl(t,e,n,i){let r=document.createElement(t);return r.id=e,n&&(r.className=n),i.appendChild(r),r}function xg(){return yg??(ae[mu]||ae.CORE).giant}function vg(t){nt.giant&&nt.giant.textContent!==t&&(nt.giant.textContent=t)}function aP(){if(!nt.giant||!Ce.camera||gu)return;Mg||(zb.copy(Ce.camera.position),Mg=!0),Vb.setFromMatrixColumn(Ce.camera.matrixWorld,0);let t=Math.max(.001,Gb.copy(Ce.pose.target).sub(Ce.camera.position).length()),e=Gb.copy(Ce.camera.position).sub(zb).dot(Vb)*Ce.camera.zoom*(ve.h/(2*Math.tan(Ce.camera.fov*Math.PI/360)))/t,n=Math.max(-200,Math.min(200,-.25*e));Math.abs(n-_g)<.25||(_g=n,nt.giant.style.transform=`translate3d(${n.toFixed(1)}px,-50%,0)`)}var xu={init(t){let e=document.getElementById("frame");return nt.giant=document.getElementById("giant"),e&&(nt.datum=document.getElementById("datum")||sl("div","datum","",e),nt.datum.classList.add("is-out"),nt.line=sl("i","datum-line","",nt.datum),nt.label=sl("p","datum-label","t-label",nt.datum),nt.title=sl("h1","datum-title","t-display",nt.datum),nt.level=sl("p","datum-level","t-micro",nt.datum),nt.flash=sl("p","datum-flash","t-label",e),nt.flash.setAttribute("aria-hidden","true"),fe.add(aP,It.UI)),xu},arrive(t,e={}){mu=ae[t]?t:"CORE";let n=ae[mu];if(!nt.datum)return;let i=mu==="NADIR"&&Y.data&&Y.data.nadirOpen;nt.title.textContent=i&&n.titleOpen?n.titleOpen:n.title,nt.title.dataset.room=mu,nt.label.textContent=`${n.num} · ${n.code}`,nt.level.textContent=`▽ ${n.level}`,nt.datum.classList.remove("is-out"),nt.datum.classList.remove("is-drawn");let r=()=>{nt.datum.classList.add("is-drawn")};e.instant?r():requestAnimationFrame(r),e.instant||Fb(nt.title,{weight:220,ms:480}),gu=!1,qd="",Mg=!1,_g=0,nt.giant&&(nt.giant.classList.remove("is-counter"),nt.giant.style.transform="",vg(xg()),nt.giant.classList.add("is-in"),gg?nt.giant.dataset.electrum="":delete nt.giant.dataset.electrum)},depart(){nt.datum&&nt.datum.classList.add("is-out"),nt.giant&&nt.giant.classList.remove("is-in")},setGiant(t,e={}){yg=t==null?null:String(t),gg=!!e.electrum,!(!nt.giant||gu)&&(vg(xg()),gg?nt.giant.dataset.electrum="":delete nt.giant.dataset.electrum)},counter(t,e){if(!nt.giant)return;let n=e>0;if(n!==gu&&(gu=n,nt.giant.classList.toggle("is-counter",n),n?nt.giant.style.transform="":(qd="",vg(xg()))),!n)return;let i=Cx(Math.round(t),0);i!==qd&&(qd=i,nt.giant.textContent=i)},flashCode(t){if(!(!nt.flash||t===kb))if(kb=t,t&&ae[t]){let e=ae[t];nt.flash.textContent=`${e.num} · ${e.code}`,nt.flash.classList.add("is-on")}else nt.flash.classList.remove("is-on")},yPx(){return ve.kind==="desktop"?ve.h*dt.desktop.datumFrac:dt.phone.datumPx+ve.safe.t},setVisible(t){nt.datum&&(nt.datum.hidden=!t),nt.giant&&(nt.giant.hidden=!t)}};var Yb="http://www.w3.org/2000/svg",ni=[],Ho=null,jd=null,bg=new P,Sg=new P,ol={x:0,y:0,depth:0,visible:!1},Hb=0,Zd=new Float64Array(64);function Wb(t,e,n){let i=document.createElementNS(Yb,t);return i.setAttribute("class",e),i.dataset.owner=n,i}var Xb=t=>`${t<0?"−":t>0?"+":""}${Math.abs(t).toFixed(2)}`;function lP(t){let e=t.leader||(t.focused?{side:"right",len:40,rise:-24}:null);if(!e||!t.path)return;let n=e.side==="left"?-1:1,i=e.rise||0,r=t.sx+n*Math.abs(i),s=t.sy+i,o=r+n*Math.max(dt.leader.elbowMin,Math.min(dt.leader.runMax,e.len||40));t.path.setAttribute("d",`M${t.sx.toFixed(1)} ${t.sy.toFixed(1)}L${r.toFixed(1)} ${s.toFixed(1)}L${o.toFixed(1)} ${s.toFixed(1)}`),t.endX=o+n*6,t.endY=s}function vu(t,e){if(t.shown===e)return;t.shown=e;let n=e&&(t.el||t.focused);t.el&&t.el.classList.toggle("is-hidden",!e),t.button&&t.button.classList.toggle("is-hidden",!e),t.path&&t.path.classList.toggle("is-hidden",!(n&&(t.leader||t.focused))),t.cross&&t.cross.classList.toggle("is-hidden",!(n&&(t.crossOn||t.focused))),t.coordEl&&t.coordEl.classList.toggle("is-hidden",!(e&&t.coordOn))}function $b(t){let e=t.shown;t.shown=!e,vu(t,e)}function cP(t){if(!Ce.camera)return;let e=1-Math.exp(-(t*1e3)/120),n=fe.now-Hb>=1e3/_e.coordHz;n&&(Hb=fe.now);let i=0;for(let s=0;s<ni.length;s++){let o=ni[s];o.get(bg),Ce.project(bg,ol);let a=ol.depth>0||!o.hideBehind;if(o.want=o.visible&&a,!!o.want){if(i++,!o.init||o.lowpass<=0)o.sx=ol.x,o.sy=ol.y,o.init=!0;else{let l=o.lowpass===120?e:1-Math.exp(-(t*1e3)/o.lowpass);o.sx+=(ol.x-o.sx)*l,o.sy+=(ol.y-o.sy)*l}o.screen.x=o.sx,o.screen.y=o.sy,n&&o.coordEl&&(Ye.toCanonical(bg,Sg),o.coordEl.textContent=`x ${Xb(Sg.x)} · y ${Xb(Sg.y)}`)}}let r=-1/0;if(i>fr.max){Zd.length<ni.length&&(Zd=new Float64Array(ni.length*2));let s=0;for(let a=0;a<ni.length;a++)ni[a].want&&(Zd[s++]=ni[a].priority);r=Zd.subarray(0,s).sort()[s-fr.max]}fr.visibleCount=0;for(let s=0;s<ni.length;s++){let o=ni[s],a=o.want&&(o.priority>=r||o.focused);if(o.screen.visible=a,vu(o,a),!a||(fr.visibleCount++,Math.abs(o.sx-o.wx)<.1&&Math.abs(o.sy-o.wy)<.1))continue;o.wx=o.sx,o.wy=o.sy;let l=o.sx.toFixed(1),c=o.sy.toFixed(1);if(o.button&&(o.button.style.transform=`translate3d(${l}px,${c}px,0)`),o.cross&&o.cross.setAttribute("transform",`translate(${l} ${c})`),o.coordEl&&(o.coordEl.style.transform=`translate3d(${(o.sx+8).toFixed(1)}px,${(o.sy+6).toFixed(1)}px,0)`),lP(o),o.el){let u=o.path&&(o.leader||o.focused)?o.endX:o.sx,f=o.path&&(o.leader||o.focused)?o.endY:o.sy,h=o.leader&&o.leader.side==="left";o.el.style.transform=`translate3d(${u.toFixed(1)}px,${f.toFixed(1)}px,0) translate(${h?"-100%":"0"},-50%)`}}}var fr={max:24,visibleCount:0,init(t){Ho=document.getElementById("overlay"),jd=document.getElementById("leaders");let e=()=>t.app.tier==="T1"||ve.isPhone?dt.leader.maxAnchorsLow:dt.leader.maxAnchors;return fr.max=e(),t.bus.on("tier:change",()=>{fr.max=e()}),t.bus.on("layout:change",()=>{fr.max=e();for(let n of ni)n.wx=NaN}),fe.add(cP,It.OVERLAY),fr},add(t){let e=String(t.owner||"anon"),n={owner:e,id:t.id!=null?String(t.id):null,get:t.get,leader:t.leader||null,crossOn:t.cross!=null?!!t.cross:!!t.leader,coordOn:!!t.coord,priority:t.priority||0,lowpass:t.lowpass!=null?t.lowpass:_e.labelLowpass,hideBehind:t.hideBehind!==!1,visible:!0,want:!1,shown:!0,focused:!1,init:!1,sx:0,sy:0,wx:NaN,wy:NaN,endX:0,endY:0,screen:{x:0,y:0,visible:!1},el:t.el||null,button:null,path:null,cross:null,coordEl:null};if(n.el&&(n.el.classList.add("anchor"),t.scrim!==!1&&n.el.classList.add("scrim"),n.el.dataset.owner=e,n.id&&(n.el.dataset.id=n.id),Ho&&Ho.appendChild(n.el)),jd){n.path=Wb("path","leader",e),n.path.setAttribute("pathLength","1"),n.cross=Wb("g","cross",e);for(let[s,o,a,l]of[[-3.5,0,3.5,0],[0,-3.5,0,3.5]]){let c=document.createElementNS(Yb,"line");c.setAttribute("x1",s),c.setAttribute("y1",o),c.setAttribute("x2",a),c.setAttribute("y2",l),n.cross.appendChild(c)}jd.appendChild(n.path),jd.appendChild(n.cross)}n.coordOn&&Ho&&(n.coordEl=document.createElement("span"),n.coordEl.className="t-micro coord",Ho.appendChild(n.coordEl));let i=s=>{n.focused=s,n.cross&&n.cross.classList.toggle("focus",s),n.path&&n.path.classList.toggle("focus",s),n.wx=NaN,$b(n)};if(t.button&&Ho){let s=document.createElement("button");s.type="button",s.className="proxy",s.dataset.owner=e,n.id&&(s.dataset.id=n.id),s.setAttribute("aria-label",t.button.label||""),t.button.size&&t.button.size>44&&(s.style.width=`${t.button.size}px`,s.style.height=`${t.button.size}px`,s.style.margin=`${-t.button.size/2}px 0 0 ${-t.button.size/2}px`);let o=t.button;s.addEventListener("click",()=>{typeof n.onActivate=="function"&&n.onActivate()}),s.addEventListener("focus",()=>{i(!0),n.onFocus&&n.onFocus()}),s.addEventListener("blur",()=>{i(!1),n.onBlur&&n.onBlur()}),n.onActivate=o.onActivate,n.onFocus=o.onFocus||null,n.onBlur=o.onBlur||null,Ho.appendChild(s),n.button=s}n.shown=!1,vu(n,!1),vu(n,!0),ni.push(n);let r={el:n.el,button:n.button,screen:n.screen,setVisible(s){n.visible=!!s,s||vu(n,!1)},setAlpha(s){let o=String(Math.max(0,Math.min(1,s)));n.el&&(n.el.style.opacity=o),n.path&&(n.path.style.opacity=o)},drawIn(s=_e.leaderDraw){return n.el&&n.el.classList.add("is-pending"),n.path&&(n.path.classList.remove("is-drawing"),n.path.style.strokeDasharray="1",n.path.style.strokeDashoffset="1"),new Promise(o=>{requestAnimationFrame(()=>{n.path&&(n.path.classList.add("is-drawing"),n.path.style.transitionDuration=`${s}ms`,n.path.style.strokeDashoffset="0"),ut(s,()=>{n.el&&n.el.classList.remove("is-pending"),o()})})})},update(s){"leader"in s&&(n.leader=s.leader||null),"cross"in s&&(n.crossOn=!!s.cross),"coord"in s&&(n.coordOn=!!s.coord),s.button&&n.button&&(s.button.label!=null&&n.button.setAttribute("aria-label",s.button.label),s.button.onActivate&&(n.onActivate=s.button.onActivate)),"priority"in s&&(n.priority=s.priority||0),n.wx=NaN,$b(n)},remove(){let s=ni.indexOf(n);s>=0&&ni.splice(s,1);for(let o of[n.el,n.button,n.path,n.cross,n.coordEl])o&&o.parentNode&&o.parentNode.removeChild(o)}};return n.api=r,r},clear(t){for(let e=ni.length-1;e>=0;e--)ni[e].owner===t&&ni[e].api.remove()}};var Ag=new Set,Cn=null,wg=null,al=null,Br=null,un={id:-1,y0:0,t0:0,y:0,t:0,h:0,base:0,moved:!1};function ll(t){if(ji.state!==t){ji.state=t,Cn&&(Cn.dataset.state=t);for(let e of Ag)try{e(t)}catch{}}}function uP(t,e){return t==="full"?0:t==="peek"?Math.max(0,e-120):e}function hP(t){if(ji.state==="closed"||un.id>=0||ve.kind==="phone-land"||ji.state==="full"&&Br&&Br.contains(t.target)&&Br.scrollTop>0)return;let e=Cn.getBoundingClientRect();un.id=t.pointerId,un.y0=un.y=t.clientY,un.t0=un.t=t.timeStamp,un.h=e.height,un.base=uP(ji.state,e.height),un.moved=!1}function fP(t){if(t.pointerId!==un.id)return;let e=t.clientY-un.y0;if(!un.moved&&Math.abs(e)<yi.SLOP_PX)return;if(!un.moved){un.moved=!0,Cn.classList.add("is-dragging");try{Cn.setPointerCapture(t.pointerId)}catch{}}un.y=t.clientY,un.t=t.timeStamp;let n=Math.max(0,Math.min(un.h,un.base+e));Cn.style.transform=`translateY(${n.toFixed(1)}px)`}function qb(t){if(t.pointerId!==un.id||(un.id=-1,!un.moved))return;Cn.classList.remove("is-dragging"),Cn.style.transform="";let e=un.y-un.y0,n=e/Math.max(1,un.t-un.t0);(Math.abs(e)>=40||Math.abs(n)>=yi.SWIPE_V)&&(e>0?ll(ji.state==="full"?"peek":"closed"):ji.state==="peek"&&ll("full"))}var ji={state:"closed",init(t){let e=document.getElementById("sheets");return e&&(Cn=document.createElement("section"),Cn.id="sheet",Cn.className="sheet",Cn.dataset.state="closed",wg=document.createElement("div"),wg.className="sheet-handle",al=document.createElement("div"),al.className="sheet-peek",Br=document.createElement("div"),Br.className="sheet-body",Cn.append(wg,al,Br),e.appendChild(Cn),Cn.addEventListener("pointerdown",hP),Cn.addEventListener("pointermove",fP),Cn.addEventListener("pointerup",qb),Cn.addEventListener("pointercancel",qb)),ji},set(t,e={}){if(Cn){if(al.textContent="",Br.textContent="",Br.scrollTop=0,e.peek&&al.appendChild(e.peek),t&&Br.appendChild(t),!t&&!e.peek){ll("closed");return}ll(e.state==="full"?"full":e.state==="closed"?"closed":"peek")}},open(t="peek"){Cn&&(al.firstChild||Br.firstChild)&&ll(t==="full"?"full":"peek")},close(){ll("closed")},onChange(t){return Ag.add(t),()=>Ag.delete(t)}};var Eg="http://www.w3.org/2000/svg",Tg=new Float32Array(8),Ig=new Float32Array(8),ul=null,yu=[],Kd=0,jb=-1e9,Rg=!1,Kb=!0,Jd=0,Qd=null,Cg=null,tp=null;function cl(t,e,n,i,r){let s=document.createElement(t);return e&&(s.className=e),r&&(s.id=r),n!=null&&(s.textContent=n),i&&i.appendChild(s),s}var Pg=t=>String(t).padStart(2,"0");function ep(t){let e=document.getElementById(t);return e?(e.classList.remove("ff-c"),e.classList.add("corner","corner--dim"),e.textContent="",e):null}function Zb(t){Kb=t,vn.el.sound&&vn.el.sound.setAttribute("aria-pressed",t?"true":"false"),tp&&(tp.textContent=t?"ЗВУК":"ТИХО")}function dP(){Kd&&Vn(Kd);let t=new Date(Gr());Kd=ut((60-t.getSeconds())*1e3-t.getMilliseconds()+20,()=>{Kd=0,vn.refresh()})}function pP(){if(!yu.length||fe.now-jb<1e3/dt.sound.fps)return;jb=fe.now;let t=ul&&ul.audio;t&&Kb?t.levels(Tg):Tg.fill(0);let e=dt.sound.h;for(let n=0;n<8;n++){let i=Math.max(1,Math.round(Tg[n]*e*2)/2);i!==Ig[n]&&(Ig[n]=i,yu[n].setAttribute("y",String(e-i)),yu[n].setAttribute("height",String(i)))}}var vn={el:{tl:null,tlName:null,tlMicro:null,tr:null,sound:null,bl:null,br:null},init(t){ul=t;let e=vn.el;if(e.tl=ep("c-tl"),e.tl&&(e.tlName=cl("span","t-label","SAM.VIN",e.tl,"c-tl-name"),e.tlMicro=cl("span","t-micro","",e.tl,"c-tl-micro")),e.tr=ep("c-tr"),e.tr){let n=cl("button","",null,e.tr,"sound");n.type="button",n.setAttribute("aria-label","Звук"),tp=cl("span","t-label","ЗВУК",n,"sound-label");let i=document.createElementNS(Eg,"svg");i.setAttribute("class","sound-wave"),i.setAttribute("viewBox",`0 0 ${dt.sound.w} ${dt.sound.h}`),i.setAttribute("aria-hidden","true"),yu=[];for(let s=0;s<8;s++){let o=document.createElementNS(Eg,"rect");o.setAttribute("class","bar"),o.setAttribute("x",String(s*4+.5)),o.setAttribute("width","2"),o.setAttribute("y",String(dt.sound.h-1)),o.setAttribute("height","1"),Ig[s]=1,i.appendChild(o),yu.push(o)}let r=document.createElementNS(Eg,"line");r.setAttribute("class","flat"),r.setAttribute("x1","0"),r.setAttribute("x2",String(dt.sound.w)),r.setAttribute("y1",String(dt.sound.h-.5)),r.setAttribute("y2",String(dt.sound.h-.5)),i.appendChild(r),n.appendChild(i),n.addEventListener("click",()=>{t.audio&&t.audio.toggle()}),e.sound=n}return e.bl=ep("c-bl"),e.bl&&e.bl.classList.add("t-micro"),e.br=ep("c-br"),e.br&&(e.br.classList.add("t-micro"),Qd=cl("span","found-count","",e.br),Cg=cl("span","rank","",e.br)),Zb(!(Y.data&&Y.data.sound==="off")),Ee.on("sound:change",n=>Zb(!!n.on)),Ee.on("rank:change",()=>vn.refresh()),Ee.on("visibility",n=>{n.hidden||vn.refresh()}),vn.setRoom("CORE"),vn.refresh(),fe.add(pP,It.UI),vn},setRoom(t){let e=ae[t]||ae.CORE;vn.el.tlMicro&&(vn.el.tlMicro.textContent=`${e.code} · ▽ ${e.level}`)},refresh(){let t=vn.el;if(t.bl){if(Rg)t.bl.textContent="РЕЖИМ ЧЕРТЕЖА";else{let e=new Date(Gr());t.bl.textContent=`ДЕНЬ ${Y.distinctDays|0} · УЗЛОВ ${Y.litNodes|0} · ${Pg(e.getHours())}:${Pg(e.getMinutes())}`}dP()}if(Qd){let e=ul&&ul.secrets?ul.secrets.count():Object.keys(Y.data&&Y.data.found||{}).length;Qd.textContent=`НАЙДЕНО ${Pg(Math.min(99,e))} / ??`,Cg.textContent=Y.data?Y.rank().name:""}},typeIn(t=_e.typeMsPerChar){let e=vn.el,n=[e.tlName,e.tlMicro,tp,e.bl&&!Rg?e.bl:null,Qd,Cg].filter(Boolean),i=n.map(s=>s.textContent),r=Math.max(1,...i.map(s=>s.length));for(let s of n)s.textContent="";return Fn(r*t,s=>{let o=Math.round(s*r);for(let a=0;a<n.length;a++){let l=i[a].slice(0,o);n[a].textContent!==l&&(n[a].textContent=l)}}).done.then(()=>{for(let s=0;s<n.length;s++)n[s].textContent=i[s]})},assemble(t=_e.assemble){let e=vn.el;for(let n of[e.tl,e.tr,e.bl,e.br])n&&(n.style.transitionDuration=`${t}ms`,n.classList.remove("corner--dim"));return new Promise(n=>ut(t,n))},relockFound(){vn.refresh();let t=vn.el.br;t&&(t.classList.add("is-relock"),Jd&&Vn(Jd),Jd=ut(_e.statusIn,()=>{Jd=0,t.classList.remove("is-relock")}))},setT0Marker(t){Rg=!!t,vn.refresh()}};var Ni=null,Wo=null,hl=null,ps=0,Lg=0,fl=null;function Dg(){ps=0,Ni&&Ni.classList.remove("is-in");let t=fl;fl=null,t&&ut(240,t)}var _u={init(t){let e=document.getElementById("frame");return Ni=document.getElementById("lead"),!Ni&&e&&(Ni=document.createElement("div"),Ni.id="lead",Ni.className="scrim",e.appendChild(Ni)),Ni&&(Wo=document.getElementById("lead-text")||Ni.appendChild(document.createElement("p")),Wo.id="lead-text",Wo.className="t-lead",hl=document.getElementById("lead-micro")||Ni.appendChild(document.createElement("p")),hl.id="lead-micro",hl.className="t-micro",hl.hidden=!0),_u},show(t,e={}){if(!Ni)return Promise.resolve();let n=e.ms!=null?e.ms:_e.leadDefault;if(ps&&(Vn(ps),ps=0),fl){let s=fl;fl=null,s()}let i=++Lg;Wo.className=e.cls||"t-lead",hl.textContent=e.micro?String(e.micro):"",hl.hidden=!e.micro,Ni.classList.add("is-in");let r=new Promise(s=>{fl=s});return e.beam?Bb(Wo,String(t),{}).then(()=>{i===Lg&&(ps=ut(n,Dg))}):(Wo.textContent=String(t),Ub(Wo),ps=ut(n,Dg)),r},hide(){ps&&(Vn(ps),ps=0),Lg++,Dg()}};var Jb="http://www.w3.org/2000/svg",eo=[],Ng=null,Og=null,Qb=new P,eS=new P,Js={x:0,y:0,depth:0,visible:!1},Qs={x:0,y:0,depth:0,visible:!1},np=dt.dims,Vt=t=>t.toFixed(1);function mP(t){if(t.a(Qb),t.b(eS),Ce.project(Qb,Js),Ce.project(eS,Qs),Js.depth<=0||Qs.depth<=0)return!1;let e=Qs.x-Js.x,n=Qs.y-Js.y,i=Math.hypot(e,n);if(i<8)return!1;e/=i,n/=i;let r=-n,s=e,o=t.side;(o==="left"&&r>0||o==="right"&&r<0||o==="above"&&s>0||o==="below"&&s<0)&&(r=-r,s=-s);let a=t.offset,l=Js.x+r*a,c=Js.y+s*a,u=Qs.x+r*a,f=Qs.y+s*a,h=(l+u)/2,d=(c+f)/2,g=Math.min(i/2-2,t.gapHalf),_=np.arrowPx,m=np.extPx,p=`M${Vt(Js.x+r*4)} ${Vt(Js.y+s*4)}L${Vt(l+r*m)} ${Vt(c+s*m)}M${Vt(Qs.x+r*4)} ${Vt(Qs.y+s*4)}L${Vt(u+r*m)} ${Vt(f+s*m)}M${Vt(l)} ${Vt(c)}L${Vt(h-e*g)} ${Vt(d-n*g)}M${Vt(h+e*g)} ${Vt(d+n*g)}L${Vt(u)} ${Vt(f)}M${Vt(l+(e*.866-n*.5)*_)} ${Vt(c+(n*.866+e*.5)*_)}L${Vt(l)} ${Vt(c)}L${Vt(l+(e*.866+n*.5)*_)} ${Vt(c+(n*.866-e*.5)*_)}M${Vt(u-(e*.866-n*.5)*_)} ${Vt(f-(n*.866+e*.5)*_)}L${Vt(u)} ${Vt(f)}L${Vt(u-(e*.866+n*.5)*_)} ${Vt(f-(n*.866-e*.5)*_)}`;return p!==t.lastD&&(t.lastD=p,t.path.setAttribute("d",p)),t.label.style.transform=`translate3d(${Vt(h)}px,${Vt(d)}px,0) translate(-50%,-50%)`,!0}function gP(){if(Ce.camera)for(let t=0;t<eo.length;t++){let e=eo[t],n=e.visible&&mP(e);n!==e.shown&&(e.shown=n,e.g.classList.toggle("is-hidden",!n),e.label.classList.toggle("is-hidden",!n))}}var ip={init(t){return Ng=document.getElementById("leaders"),Og=document.getElementById("overlay"),fe.add(gP,It.OVERLAY),ip},add(t){let e=String(t.owner||"anon"),n=document.createElementNS(Jb,"g");n.setAttribute("class","dim is-hidden"),n.dataset.owner=e;let i=document.createElementNS(Jb,"path");i.setAttribute("pathLength","1"),n.appendChild(i);let r=document.createElement("span");r.className="t-micro dim-label is-hidden",r.dataset.owner=e,Ng&&Ng.appendChild(n),Og&&Og.appendChild(r);let s={owner:e,a:t.a,b:t.b,side:t.side||"right",offset:t.offset!=null?t.offset:np.offsetPx,g:n,path:i,label:r,visible:!0,shown:!1,lastD:"",gapHalf:0},o=l=>{r.textContent=String(l||""),s.gapHalf=(r.textContent.length*6.2+2*np.gapPx)/2};o(t.label),eo.push(s);let a={setVisible(l){s.visible=!!l},drawIn(l=_e.dimsDraw){return i.classList.remove("is-drawing"),i.style.strokeDasharray="1",i.style.strokeDashoffset="1",r.style.opacity="0",new Promise(c=>{requestAnimationFrame(()=>{i.classList.add("is-drawing"),i.style.transitionDuration=`${l}ms`,i.style.strokeDashoffset="0",ut(l,()=>{r.style.opacity="",c()})})})},setLabel:o,remove(){let l=eo.indexOf(s);l>=0&&eo.splice(l,1),n.parentNode&&n.parentNode.removeChild(n),r.parentNode&&r.parentNode.removeChild(r)}};return s.api=a,a},clear(t){for(let e=eo.length-1;e>=0;e--)eo[e].owner===t&&eo[e].api.remove()}};var Fg="http://www.w3.org/2000/svg",Oi=[0,1,2,3].map(t=>({i:t,el:null,svg:null,sp:$i.from(S_.struck,0),at:0,flash:0,lastD:""})),ms=null,Ug=null,sp=14,dl=NaN,Mu=NaN,bu=!0,to=t=>t.toFixed(1);function nS(){return sp+12}function xP(t,e){let n=ve.w,i=ve.h,r=sp,s=nS(),o=2*(t.sp.x+e);switch(t.i){case 0:return`M${r} ${r}Q${to(t.at)} ${to(r+o)} ${n-r} ${r}`;case 2:return`M${r} ${s-r}Q${to(t.at)} ${to(s-r-o)} ${n-r} ${s-r}`;case 1:return`M${s-r} ${r}Q${to(s-r-o)} ${to(t.at)} ${s-r} ${i-r}`;default:return`M${r} ${r}Q${to(r+o)} ${to(t.at)} ${r} ${i-r}`}}function vP(){let t=ve.w,e=ve.h,n=nS();for(let i of Oi){if(!i.svg)continue;let r=i.i%2===0,s=r?t:n,o=r?n:e;i.svg.setAttribute("viewBox",`0 0 ${s} ${o}`),i.svg.setAttribute("width",String(s)),i.svg.setAttribute("height",String(o)),i.svg.style.transform=`translate3d(${i.i===1?t-n:0}px,${i.i===2?e-n:0}px,0)`}}function rp(t,e,n,i){t.flash&&Vn(t.flash),t.at=e,t.sp.x=n*Math.min(dt.edge.bendPx,3+i*4),t.sp.v=0,t.sp.target=0,t.el.classList.add("is-flash"),t.flash=ut(_e.stringFlash,()=>{t.flash=0,t.el.classList.remove("is-flash")});let r=Ug&&Ug.audio;r&&r.play("stringPluck",{root:(ae[te.room]||ae.CORE).root})}function yP(t){let e=t.x,n=t.y;if(Number.isFinite(dl)&&bu){let i=Math.hypot(t.vx,t.vy);if(i>dt.edge.pluckPxMs){let r=ve.w,s=ve.h,o=sp,a=ve.isPhone;(Mu-o)*(n-o)<0&&rp(Oi[0],e,n>Mu?1:-1,i),(Mu-(s-o))*(n-(s-o))<0&&rp(Oi[2],e,n<Mu?1:-1,i),!a&&(dl-(r-o))*(e-(r-o))<0&&rp(Oi[1],n,e<dl?1:-1,i),!a&&(dl-o)*(e-o)<0&&rp(Oi[3],n,e>dl?1:-1,i)}}dl=e,Mu=n}function _P(t){if(!ms||!bu)return;let e=.2*(On.value-.5)*2*On.amp;for(let n=0;n<4;n++){let i=Oi[n];(i.sp.x!==0||i.sp.v!==0)&&(i.sp.step(t),Math.abs(i.sp.x)<.01&&Math.abs(i.sp.v)<.05&&i.sp.snap(0));let r=xP(i,e);r!==i.lastD&&(i.lastD=r,i.el.setAttribute("d",r))}}function tS(){sp=ve.isPhone?dt.phone.edgeInset:dt.desktop.edgeInset;for(let t of Oi)t.at=(t.i%2===0?ve.w:ve.h)/2,t.lastD="";vP()}var Su={init(t){Ug=t;let e=document.getElementById("frame");if(!e)return Su;ms=document.createElementNS(Fg,"svg"),ms.id="edges",ms.setAttribute("aria-hidden","true");for(let n of Oi)n.svg=document.createElementNS(Fg,"svg"),n.svg.setAttribute("class","edge-strip"),n.el=document.createElementNS(Fg,"path"),n.el.setAttribute("class","edge"),n.el.setAttribute("pathLength","1"),n.svg.appendChild(n.el),ms.appendChild(n.svg);return e.insertBefore(ms,e.firstChild),tS(),t.bus.on("layout:change",tS),t.input.observe(yP),fe.add(_P,It.UI),Su},drawIn(t=_e.drawIn){if(!ms)return Promise.resolve();for(let e of Oi)e.el.style.transition="none",e.el.style.strokeDasharray="1",e.el.style.strokeDashoffset="1";return new Promise(e=>{requestAnimationFrame(()=>{for(let n of Oi)n.el.style.transition=`stroke-dashoffset ${t}ms cubic-bezier(.16,1,.3,1)`,n.el.style.strokeDashoffset="0";ut(t,()=>{for(let n of Oi)n.el.style.transition="",n.el.style.strokeDasharray="",n.el.style.strokeDashoffset="";e()})})})},twitch(t=dt.edge.twitchPx){for(let e of Oi)e.sp.x=t,e.sp.v=0,e.sp.target=0},setVisible(t){bu=!!t,ms&&ms.classList.toggle("is-off",!bu);for(let e of Oi)e.el&&e.el.classList.toggle("is-off",!bu)}};var no=null,ap=!1,iS=!1,rS=!0,Bg=null;function op(){let t=rS&&ap&&!ve.isPhone;t===iS||!no||(iS=t,no.classList.toggle("is-on",t))}var wu={init(t){let e=document.getElementById("fx"),n=document.getElementById("gl");return e&&(no=document.createElement("i"),no.id="cursor",e.appendChild(no),n&&(n.addEventListener("pointerover",i=>{(i.pointerType==="mouse"||i.pointerType==="pen")&&(ap=!0,op())}),n.addEventListener("pointerout",()=>{ap=!1,op()}),n.addEventListener("pointerdown",i=>{i.pointerType==="touch"&&(ap=!1,op())})),t.input.observe(i=>{i.type!=="touch"&&(no.style.transform=`translate3d(${i.x}px,${i.y}px,0)`)})),wu},setVisible(t){rS=!!t,op()},setColor(t){Bg=t&&t!=="ember"?t:null,no&&(no.style.boxShadow=Bg?`inset 0 0 0 1px var(--${Bg})`:"")}};var MP="http://www.w3.org/2000/svg",ro=["S","A","M","•","V","I","N"],nn=new Float64Array(7),Zi=bn.map(t=>ae[t].alt),In=null,mn="desktop",Qi=56,Pn=300,Gt=null,gl=null,Mi=null,uS=null,cp=null,vs=null,hS=null,xs=null,Eu=null,vl=null,Fi=null,zg=null,Ji=[],xl=[],Au="CORE",Tu=0,Vg=NaN,lp=-1,sS=!1,pl=0,oS=-1e9,io=new $i(8,.25,0),hp=!1,fS=0,dr=new $i(12,1,0),Gg=0;function bP(){if(mn=ve.kind==="desktop"?"desktop":ve.kind==="phone"?"phone":"land",mn==="desktop"){Qi=dt.nav.w,Pn=dt.nav.h;for(let t=0;t<7;t++)nn[t]=Pn/2-Zi[t]/1e3*(Pn/2.4)}else if(mn==="phone"){Qi=Math.max(100,ve.w-32),Pn=dt.band.h;for(let t=0;t<7;t++)nn[t]=16+(t+.5)*Qi/7}else{Qi=dt.band.sideW,Pn=Math.max(100,ve.h-32);for(let t=0;t<7;t++)nn[t]=16+(t+.5)*Pn/7}}function dp(t){if(t>=Zi[0])return nn[0]+(t-Zi[0])*(nn[1]-nn[0])/(Zi[1]-Zi[0]);for(let e=1;e<7;e++)if(t>=Zi[e])return nn[e]+(t-Zi[e])*(nn[e-1]-nn[e])/(Zi[e-1]-Zi[e]);return nn[6]+(t-Zi[6])*(nn[6]-nn[5])/(Zi[6]-Zi[5])}var Ru=t=>t==="WORKSHOP"?2:bn.indexOf(t);function Cu(t){let e=0;for(let n=1;n<7;n++)Math.abs(t-nn[n])<Math.abs(t-nn[e])&&(e=n);return e}function SP(t){let e=[];for(let i=0;i<2;i++)for(let r=0;r<=4;r++){let s=i===0?r/4:1-r/4,o=t.top+(t.bot-t.top)*s,a=t.top>0&&t.bot<0&&r===4/2?.62:Ct(o),l,c;if(mn==="desktop")l=Pn/2-o*(Pn/2.4),c=a*(Pn/2.4)*dt.nav.widthScale;else{let h=(mn==="phone"?Qi:Pn)/7;l=t.i*h+h*s,c=a/.62*((mn==="phone"?Pn:Qi)*.36)}let u=i===0?1:-1,f=mn==="phone"?Pn/2:Qi/2;e.push(mn==="phone"?`${l.toFixed(1)} ${(f-u*c).toFixed(1)}`:`${(f+u*c).toFixed(1)} ${l.toFixed(1)}`)}return`M${e.join("L")}Z`}function wP(){let t=an[6],e=wl(7),n=[];for(let i=0;i<5;i++){let r=.1+.2*i,s="";for(let o=0;o<=4;o++){let a=t.top+(t.bot-t.top)*(o/4),l=Ct(a),c=(r-.5+(e()-.5)*.15)*2*l,u,f;if(mn==="desktop")f=Pn/2-a*(Pn/2.4),u=Qi/2+c*(Pn/2.4)*dt.nav.widthScale;else if(mn==="phone"){let h=Qi/7;u=6*h+h*(o/4),f=Pn/2+c/.62*Pn*.36}else{let h=Pn/7;f=6*h+h*(o/4),u=Qi/2+c/.62*Qi*.36}s+=`${o?"L":"M"}${u.toFixed(1)} ${f.toFixed(1)}`}n.push(s)}return n.join("")}function aS(){bP(),gl.setAttribute("viewBox",`0 0 ${Qi.toFixed(1)} ${Pn.toFixed(1)}`);for(let e=0;e<7;e++)xl[e].setAttribute("d",SP(an[e]));Mi.setAttribute("d",wP());let t=mn==="desktop";for(let e=0;e<7;e++)Ji[e].style.top=t?`${nn[e].toFixed(1)}px`:"";xs.style.top=t?`${(nn[6]+12).toFixed(1)}px`:"",vl.style.top=t?`${nn[3].toFixed(1)}px`:"",Vg=NaN}function dS(){let t=hp?io.x:dp(Tu);return t+=dr.x+Gg,t}function lS(t,e){t.style.transform=mn==="phone"?`translate3d(${(e-.5).toFixed(1)}px,0,0)`:`translate3d(0,${(e-.5).toFixed(1)}px,0)`}function AP(t){if(!Gt)return;hp&&(io.step(t),fe.now>fS&&(io.target=dp(Tu),Math.abs(io.x-io.target)<.3&&Math.abs(io.v)<2&&(hp=!1))),(dr.x!==0||dr.v!==0)&&(dr.step(t),dr.target===0&&Math.abs(dr.x)<.05&&Math.abs(dr.v)<.5&&dr.snap(0));let e=dS();Math.abs(e-Vg)<.05||(Vg=e,lS(uS,e),vs&&lS(vs,e))}function ml(t,e,n){let i=Ji[t];i&&(i["_"+e]&&Vn(i["_"+e]),i.setAttribute(e,e==="data-glint"?"electrum":""),i["_"+e]=ut(n,()=>{i["_"+e]=0,i.removeAttribute(e)}))}function kg(){let t=!!(Y.data&&Y.data.nadirOpen),e=Ji[6],n=ae.NADIR;e.setAttribute("aria-label",t?n.nameOpen:n.name),e.querySelector(".kn-name").textContent=t?n.nameOpen:n.name;let i=Y.data?Y.data.shards|0:0;e.querySelector(".kn-level").textContent=t?`▽ ${n.giant}`:"●".repeat(i)+"○".repeat(5-i)}function Wg(t){if(t!==lp){if(lp>=0&&Ji[lp].classList.remove("is-hot"),lp=t,t<0){cp.classList.remove("is-on");return}Ji[t].classList.add("is-hot"),cp.style.transform=`translate3d(0,${(nn[t]-.5).toFixed(1)}px,0)`,cp.classList.add("is-on"),In.audio&&In.audio.play("hoverTick",{x:ve.w-52})}}function fp(t){mn!=="desktop"&&(t=!1),t!==sS&&(sS=t,t?Gt.setAttribute("data-expanded",""):(Gt.removeAttribute("data-expanded"),Wg(-1)))}var Xg=t=>`#/${ae[t].slug}`;function Hg(t,e="nav"){In.director&&In.director.go(Xg(bn[t]),{source:e})}function EP(){let t=In.director;return t&&t.busy()&&t.state.to?t.state.to.room:te.room}function TP(t){if(t.preventDefault(),mn!=="desktop")return;let e=t.deltaY;if(t.deltaMode===1?e*=16:t.deltaMode===2&&(e*=ve.h),(fe.now-oS>600||Math.sign(e)!==Math.sign(pl))&&(pl=0),oS=fe.now,pl+=e,Math.abs(pl)<dt.nav.wheelPxPerDetent)return;let n=Math.sign(pl);pl=0;let i=$s(EP(),n);i&&(In.audio&&In.audio.play("tick",{}),In.director.go(Xg(i),{source:"nav"}))}var le={id:-1,row:-1,x0:0,y0:0,p0:0,left:0,top:0,moved:!1,mode:null,done:!1,timers:[],v:0,lastP:0,lastT:0,target:-1,from:0,u0:0,pull:0,pullTimer:0,mapDy:0};function $g(t){return mn==="phone"?t.clientX-le.left:t.clientY-le.top}var up=(t,e)=>setTimeout(e,t);function Yg(){for(let t of le.timers)clearTimeout(t);le.timers.length=0,le.pullTimer&&(clearTimeout(le.pullTimer),le.pullTimer=0)}function pp(){vl.classList.remove("is-on"),Fi.style.transition="none",Fi.style.strokeDashoffset="1"}function RP(t){if(le.id>=0||t.pointerType==="mouse"&&t.button!==0)return;let e=Gt.getBoundingClientRect();le.id=t.pointerId,le.left=e.left,le.top=e.top,le.x0=t.clientX,le.y0=t.clientY,le.moved=!1,le.mode=null,le.done=!1,le.v=0,le.target=-1,le.p0=le.lastP=$g(t),le.lastT=t.timeStamp,le.row=Cu(le.p0),Math.abs(le.p0-nn[le.row])>30&&(le.row=-1);try{Gt.setPointerCapture(t.pointerId)}catch{}le.row===3?(le.timers.push(up(_e.relaunchRingDelay,()=>{vl.classList.add("is-on"),Fi.style.transition="none",Fi.style.strokeDashoffset="1",requestAnimationFrame(()=>{Fi.style.transition=`stroke-dashoffset ${_e.relaunch-_e.relaunchRingDelay}ms linear`,Fi.style.strokeDashoffset="0"})})),le.timers.push(up(_e.relaunch,()=>{le.done=!0,pp(),Nr(Dr.lock),te.room!=="CORE"&&In.director&&In.director.go("#/core",{source:"nav"}),Ee.emit("relaunch",{})}))):le.row>=0&&le.timers.push(up(_e.longPress,()=>{le.done=!0,In.hint&&In.hint.swing()}))}function CP(t,e,n){Yg(),pp();let i=mn==="phone"?e:n,r=mn==="phone"?n:e;if(le.row===0&&i<0&&Math.abs(i)>=Math.abs(r)*.5){le.mode="pull";return}if(mn==="phone"&&n<0&&Math.abs(n)>Math.abs(e)){le.mode="map";return}let s=In.director;if(!s){le.mode="none";return}let o=$g(t);if(s.busy()){if(!s.scrub.begin(s.state.to.hash)){le.mode="detent";return}le.target=Ru(s.state.to.room),le.from=o,le.u0=s.state.u,le.mode="scrub";return}let a=dp(ae[te.room].alt),l=Math.sign(o-a)||Math.sign(i)||1,c=Cu(o);if((c===Ru(te.room)||Math.abs(o-a)<12)&&(c=Ru(te.room)+l),c<0||c>6){le.mode="none";return}if(le.target=c,le.from=a,le.u0=0,!s.scrub.begin(Xg(bn[c]))){le.mode="detent";return}le.mode="scrub"}function PP(t){let e=nn[le.target]-le.from;return Math.abs(e)<1?1:Math.max(0,Math.min(1,le.u0+(t-le.from)/e*(1-le.u0)))}function IP(t){if(t.pointerId!==le.id){mn==="desktop"&&t.pointerType==="mouse"&&le.id<0&&LP(t);return}let e=t.clientX-le.x0,n=t.clientY-le.y0;if(!le.moved){let s=Math.hypot(e,n);if(s>=yi.SLOP_PX/2&&le.timers.length&&!le.done&&(Yg(),pp()),s<yi.SLOP_PX)return;if(le.moved=!0,le.done){le.mode="none";return}CP(t,e,n)}let i=$g(t),r=Math.max(1,t.timeStamp-le.lastT);if(le.v+=((i-le.lastP)/r-le.v)*Math.min(1,r/60),le.lastP=i,le.lastT=t.timeStamp,le.mode==="scrub")In.director.scrub.set(PP(i));else if(le.mode==="pull"){let s=nn[0]-i;mn==="phone"?s+=Math.max(0,le.top-t.clientY):mn==="land"&&(s+=Math.max(0,le.left-t.clientX)),le.pull=Math.max(0,s),dr.snap(-Math.min(dt.nav.rubberMax,le.pull*dt.nav.rubber)),le.pull>=dt.nav.overpullPx&&!le.pullTimer?le.pullTimer=up(_e.overpullHold,()=>{le.pullTimer=0,le.done=!0,le.mode="none",dr.target=0,In.director&&In.director.go("#/zenith",{source:"overpull"})}):le.pull<dt.nav.overpullPx&&le.pullTimer&&(clearTimeout(le.pullTimer),le.pullTimer=0)}else le.mode==="map"&&(le.mapDy=t.clientY-le.y0);mn==="desktop"&&(le.mode==="scrub"||le.mode==="detent")&&Wg(Cu(i))}function cS(t,e){if(t.pointerId!==le.id)return;le.id=-1,Yg(),pp();let n=In.director,i=le.lastP;if(le.mode==="scrub"&&n)if(e)n.scrub.end(-4);else{let r=le.v*1e3/(nn[le.target]-le.from||1),s=dt.nav.magnetPx;Math.abs(i-nn[le.target])<=s?r=Math.max(r,2):Math.abs(i-le.from)<=s&&(r=Math.min(r,-2)),n.scrub.end(r)}else if(le.mode==="pull")dr.target=0;else if(le.mode==="detent"&&!e){let r=Cu(i);r!==Ru(te.room)&&Hg(r)}else le.mode==="map"&&!e?le.mapDy<=-40&&In.navMap&&In.navMap.open():!le.moved&&!le.done&&!e&&le.row>=0&&Hg(le.row);le.mode=null}function LP(t){fp(!0);let e=ve.h/2-Pn/2,n=t.clientY-e,i=Cu(n);Wg(Math.abs(n-nn[i])<=22?i:-1)}function hi(t,e,n,i){let r=document.createElement(t);return e&&(r.className=e),i&&(r.id=i),n.appendChild(r),r}function gs(t,e,n){let i=document.createElementNS(MP,t);return e&&i.setAttribute("class",e),n.appendChild(i),i}function DP(){Gt=document.createElement("nav"),Gt.id="keynav",Gt.setAttribute("aria-label","КЛЮЧ"),gl=gs("svg","kn-draw",Gt),gl.setAttribute("aria-hidden","true"),gl.setAttribute("preserveAspectRatio","none");for(let n=0;n<7;n++){let i=gs("path","kn-stratum",gl);i.setAttribute("data-stratum",ro[n]),i.setAttribute("pathLength","1"),xl.push(i)}Mi=gs("path","kn-crack",gl),Mi.setAttribute("pathLength","1"),Mi.style.strokeDasharray="1",Mi.style.strokeDashoffset="1";for(let n=0;n<7;n++){let i=bn[n],r=ae[i],s=hi("button","kn-row",Gt);s.type="button",s.dataset.sign=ro[n],s.dataset.room=i,s.style.setProperty("--i",String(n)),s.setAttribute("aria-label",r.name);let o=hi("span","kn-letter t-label",s);o.textContent=ro[n];let a=hi("span","kn-text",s),l=hi("span","kn-head",a);hi("span","kn-code t-label",l).textContent=`${ro[n]} · ${r.code}`,hi("span","kn-name t-body t-body--15 t-body--em",l).textContent=r.name,hi("span","kn-level t-micro",a).textContent=`▽ ${r.giant}`,s.addEventListener("click",c=>{c.detail===0&&Hg(n)}),Ji.push(s)}cp=hi("i","kn-tick",Gt),uS=hi("i","",Gt,"keynav-needle"),vs=gs("svg","kn-twin",Gt),vs.setAttribute("viewBox","0 0 40 12"),hS=[gs("path","",vs),gs("path","",vs)],xs=hi("div","",Gt,"keynav-slots");for(let n=0;n<5;n++)hi("i","slot",xs);Eu=hi("i","",Gt,"keynav-zenith"),vl=hi("div","",Gt,"keynav-ring");let t=gs("svg","",vl);t.setAttribute("viewBox","0 0 44 44");let e=gs("circle","track",t);e.setAttribute("cx","22"),e.setAttribute("cy","22"),e.setAttribute("r","18"),Fi=gs("circle","fill",t),Fi.setAttribute("cx","22"),Fi.setAttribute("cy","22"),Fi.setAttribute("r","18"),Fi.setAttribute("pathLength","1"),Fi.style.strokeDasharray="1",Fi.style.strokeDashoffset="1",hi("span","t-label",vl).textContent="ПЕРЕЗАПУСК",zg=hi("p","t-body t-body--15 t-body--em",Gt,"keynav-name"),Gt.addEventListener("pointerdown",RP),Gt.addEventListener("pointermove",IP),Gt.addEventListener("pointerup",n=>cS(n,!1)),Gt.addEventListener("pointercancel",n=>cS(n,!0)),Gt.addEventListener("pointerleave",n=>{le.id<0&&n.pointerType==="mouse"&&fp(!1)}),Gt.addEventListener("wheel",TP,{passive:!1}),Gt.addEventListener("contextmenu",n=>n.preventDefault())}var Ki={el:null,init(t){In=t;let e=document.getElementById("chrome");return e&&(DP(),e.appendChild(Gt),Ki.el=Gt,aS(),kg(),Ki.refreshSlots(),Y.data&&Y.data.nadirOpen&&(Mi.style.strokeDashoffset="0",Mi.classList.add("is-cool")),Ki.showZenith(!!(Y.data&&Y.data.found&&Y.data.found.S13)),Ki.setCurrent(te.room||"CORE"),Ee.on("layout:change",()=>{aS(),fp(!1)}),Ee.on("secret:found",n=>{n.id==="S13"&&Ki.showZenith(!0)}),Ee.on("room:arrive",()=>{try{$x().unread>0&&Ki.blink("S")}catch{}}),fe.add(AP,It.UI)),Ki},show(t={}){if(!Gt)return Promise.resolve();let e=t.ms!=null?t.ms:_e.drawIn;Gt.classList.add("is-shown");for(let n of xl)n.style.transition="none",n.style.strokeDasharray="1",n.style.strokeDashoffset="1";return requestAnimationFrame(()=>{for(let n of xl)n.style.transition=`stroke-dashoffset ${e}ms cubic-bezier(.16,1,.3,1),stroke .24s`,n.style.strokeDashoffset="0"}),new Promise(n=>ut(e,()=>{for(let i of xl)i.style.strokeDasharray="",i.style.strokeDashoffset="",i.style.transition="";n()}))},hide(){Gt&&(Gt.classList.remove("is-shown"),fp(!1))},setCurrent(t){Au=ae[t]?t:"CORE";let e=Ru(Au);for(let i=0;i<7;i++)i===e?Ji[i].setAttribute("aria-current","true"):Ji[i].removeAttribute("aria-current"),xl[i].classList.toggle("is-current",i===e);let n=ae[Au];zg&&(zg.textContent=Au==="NADIR"&&Y.data&&Y.data.nadirOpen?n.nameOpen:n.name),Tu=n.alt},setNeedle(t){Tu=Number.isFinite(t)?t:0},lockTwin(){if(!vs||mn!=="desktop")return;vs.classList.add("is-on");let[t,e]=hS;Fn(_e.navTwin,n=>{let i=5*(1-n),r=3,s=3+2*(1-n),o="M0 6",a="M0 6";for(let l=2;l<=40;l+=2)o+=`L${l} ${(6+i*Math.sin(l/40*r*6.283)).toFixed(2)}`,a+=`L${l} ${(6+i*Math.sin(l/40*s*6.283+1)).toFixed(2)}`;t.setAttribute("d",o),e.setAttribute("d",a)}).done.then(()=>ut(120,()=>vs.classList.remove("is-on")))},flashLetter(t,e,n){let i=ro.indexOf(t);i>=0&&ml(i,e==="electrum"?"data-glint":"data-flash",n||_e.hintGlint)},flashAll(t){for(let e=0;e<7;e++)ml(e,"data-flash",t||4200)},blink(t){let e=ro.indexOf(t);e>=0&&ml(e,"data-blink",480)},shudder(t){let e=ro.indexOf(t);if(e<0)return;let n=Ji[e];n.hasAttribute("data-shudder")?(n.removeAttribute("data-shudder"),requestAnimationFrame(()=>ml(e,"data-shudder",1e3))):ml(e,"data-shudder",1e3),t==="N"&&(xs.classList.add("is-flash"),ut(_e.shudder,()=>xs.classList.remove("is-flash")))},refreshSlots(){let t=Y.data?Math.min(5,Y.data.shards|0):0;if(xs)for(let e=0;e<5;e++)xs.children[e].classList.toggle("filled",e<t);Ji.length&&kg()},slotPoint(t){let e=xs&&xs.children[Math.max(0,Math.min(4,t|0))];if(!e)return{x:ve.w/2,y:ve.h/2};let n=e.getBoundingClientRect();return{x:n.left+n.width/2,y:n.top+n.height/2}},letterPoint(t){let e=Math.max(0,ro.indexOf(t)),n=Ji[e]&&Ji[e].firstChild;if(!n)return{x:ve.w/2,y:ve.h/2};let i=n.getBoundingClientRect();return{x:i.left+i.width/2,y:i.top+i.height/2}},crack(){return Mi?(Mi.classList.remove("is-cool"),Mi.style.transition="none",Mi.style.strokeDashoffset="1",requestAnimationFrame(()=>{Mi.style.transition="stroke-dashoffset 2.8s cubic-bezier(.2,0,0,1),stroke .6s",Mi.style.strokeDashoffset="0"}),ut(1400,()=>{kg(),Ki.setCurrent(Au)}),new Promise(t=>ut(2800,()=>{Mi.classList.add("is-cool"),t()}))):Promise.resolve()},showZenith(t){Eu&&Eu.classList.toggle("is-on",!!t)},pullAboveS(t=20,e=600){let n=dp(Tu),i=nn[0]-t-n;Fn(e,r=>{Gg=i*Math.sin(Math.PI*r)}).done.then(()=>{Gg=0})},swingTo(t,e=_e.hintGlint){io.snap(dS()),io.target=t<0?nn[0]-dt.nav.zenithDotAbove*2:nn[t],hp=!0,fS=fe.now+900+e,t<0?(Eu.classList.add("is-ghost"),ut(900+e,()=>Eu.classList.remove("is-ghost"))):ut(450,()=>ml(t,"data-glint",e))}};var pS="http://www.w3.org/2000/svg",qg=null,ii=null,mS=[],gS=[],mp=0,Pu={id:-1,y0:0};function jg(){let t=!!(Y.data&&Y.data.nadirOpen),e=te.room==="WORKSHOP"?"MEMBERS":te.room;for(let n=0;n<7;n++){let i=bn[n],r=ae[i],s=mS[n],o=i==="NADIR"&&!t;s.querySelector(".t-body").textContent=i==="NADIR"&&t?r.nameOpen:r.name,o?s.setAttribute("data-sealed",""):s.removeAttribute("data-sealed"),i===e?s.setAttribute("aria-current","true"):s.removeAttribute("aria-current"),gS[n].classList.toggle("is-current",i===e)}}function NP(t){let e=[];for(let n=0;n<2;n++)for(let i=0;i<=4;i++){let r=n===0?i/4:1-i/4,s=t.top+(t.bot-t.top)*r,o=t.top>0&&t.bot<0&&i===2?.62:Ct(s),a=36+(n===0?1:-1)*o*125*.45;e.push(`${a.toFixed(1)} ${(150-s*125).toFixed(1)}`)}return`M${e.join("L")}Z`}var Ui={isOpen:!1,init(t){qg=t;let e=document.getElementById("sheets");if(!e)return Ui;ii=document.createElement("div"),ii.id="map",ii.hidden=!0,ii.setAttribute("role","dialog"),ii.setAttribute("aria-label","КАРТА");let n=document.createElement("div");n.className="map-head";let i=document.createElement("p");i.className="t-label",i.textContent="КАРТА · VIN";let r=document.createElement("button");r.type="button",r.className="verb",r.textContent="ЗАКРЫТЬ",r.addEventListener("click",()=>Ui.close()),n.append(i,r);let s=document.createElement("div");s.className="map-body";let o=document.createElementNS(pS,"svg");o.setAttribute("class","map-draw"),o.setAttribute("viewBox","0 0 72 300"),o.setAttribute("preserveAspectRatio","xMidYMin meet"),o.setAttribute("aria-hidden","true");for(let l of an){let c=document.createElementNS(pS,"path");c.setAttribute("d",NP(l)),o.appendChild(c),gS.push(c)}let a=document.createElement("div");return a.className="map-rows",mS=bn.map(l=>{let c=ae[l],u=document.createElement("button");u.type="button",u.className="map-row",u.dataset.room=l;let f=document.createElement("span");f.className="t-micro",f.textContent=`▽ ${c.level}`;let h=document.createElement("span");h.className="t-label",h.textContent=`${c.num} · ${c.code}`;let d=document.createElement("span");return d.className="t-body",d.textContent=c.name,u.append(f,h,d),u.addEventListener("click",()=>{Ui.close(),qg.director&&qg.director.go(`#/${c.slug}`,{source:"nav"})}),a.appendChild(u),u}),s.append(o,a),ii.append(n,s),ii.addEventListener("pointerdown",l=>{Pu.id=l.pointerId,Pu.y0=l.clientY}),ii.addEventListener("pointerup",l=>{l.pointerId===Pu.id&&l.clientY-Pu.y0>60&&Ui.close(),Pu.id=-1}),e.appendChild(ii),Ee.on("room:arrive",jg),Ee.on("nadir:open",jg),Ui},open(){!ii||Ui.isOpen||(mp&&(mp=0),jg(),Ui.isOpen=!0,ii.hidden=!1,ii.classList.add("is-closing"),requestAnimationFrame(()=>requestAnimationFrame(()=>ii.classList.remove("is-closing"))))},close(){if(!ii||!Ui.isOpen)return;Ui.isOpen=!1,ii.classList.add("is-closing");let t=++mp;ut(480,()=>{t===mp&&!Ui.isOpen&&(ii.hidden=!0)})}};var bi=(t,e,n,i,r,s,o=!1)=>Object.freeze({id:t,name:e,where:n,note:i,line:r,hintRoom:s,timeGated:o}),Zg=Object.freeze([bi("S01","РЕЗОНАНС","CORE","G4","Песок написал имя.","CORE"),bi("S02","БЕСКОНЕЧНОСТЬ","CORE","A4","Ты всё ещё внутри SAM.VIN.","CORE"),bi("S03","ГОЛОВОКРУЖЕНИЕ","CORE","B4","Ключ закружился на {p}%.","CORE"),bi("S04","АККОРД","MEMBERS","D5","Весь клан прозвучал вместе.","MEMBERS"),bi("S05","ПОЗЫВНОЙ","anywhere","E5","Система узнала тебя.","CORE"),bi("S06","МАСТЕРСКАЯ","MEMBERS","G5","Твой знак вырезан.","MEMBERS"),bi("S07","КИТ","any hall","A5","Ты видел кита.",null,!0),bi("S08","ИЗНАНКА","CORE","B5","Ты видел изнанку.","CORE"),bi("S09","ДРОН","any hall","D6","Ты поймал дрона.","CURRENT"),bi("S10","НОЧЬ","any","E6","Ты видел, как VIN спит.",null,!0),bi("S11","ЧАСТОТА","SIGNAL","G6","Тайная частота: {freq}.","SIGNAL"),bi("S12","КАПСУЛА","INSIGNIA","A6","Капсула открылась.",null,!0),bi("S13","ЗЕНИТ","navigator","B6","Ты был над всем.","ZENITH"),bi("S14","СПУТНИК","CORE","D7","{name} прилетела и осталась.",null,!0)]),xS=Object.freeze(["S01","S03","S04","S02","S06","S09","S08","S11","S13","S05"]),vS=Object.freeze(["S07","S10","S12","S14"]),OP=new Map(Zg.map(t=>[t.id,t]));function gp(t){return OP.get(t)||null}var Xo=null,yl=null,yS=t=>!!(Y.data&&Y.data.found&&Y.data.found[t]);function _S(t){let e=yl;if(!e||fe.now-e.at>_e.hintArriveWindow){yl=null;return}e.room===t&&(yl=null,Ee.emit("hint:arrive",{secret:e.secret,room:t}))}var Iu={init(t){return Xo=t,t.hint=Iu,Ee.on("room:arrive",e=>_S(e.room)),Iu},target(){for(let t of xS){if(yS(t))continue;let n=gp(t).hintRoom;return n==="CURRENT"&&(n=te.room),{secret:t,room:n,kind:"secret"}}return vS.some(t=>!yS(t))?{secret:null,room:null,kind:"time"}:{secret:null,room:null,kind:"done"}},swing(){let t=Iu.target(),e=Xo&&Xo.keyNav,n=3;return t.kind==="secret"&&(n=t.room==="ZENITH"?-1:Math.max(0,bn.indexOf(t.room==="WORKSHOP"?"MEMBERS":t.room))),e&&e.swingTo&&e.swingTo(n),t.kind!=="secret"&&Xo.status&&Xo.status.say(t.kind==="time"?"hint.time":"hint.done"),te.hintTarget={secret:t.secret,room:t.room,at:fe.now},Ee.emit("hint:swing",{secret:t.secret,room:t.room}),yl=t.kind==="secret"&&ae[t.room]?{secret:t.secret,room:t.room,at:fe.now}:null,yl&&yl.room===te.room&&!(Xo.director&&Xo.director.busy())&&setTimeout(()=>_S(te.room),0),t}};var FP=new Set(["ArrowUp","ArrowDown","PageUp","PageDown","Home","Escape"]),UP=t=>!!t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName||"")),bS=t=>{let e=/^(?:Digit|Numpad)([1-7])$/.exec(t);return e?Number(e[1])-1:-1};function MS(t,e){let n=bS(t.code);if(n>=0)return`#/${ae[bn[n]].slug}`;switch(t.key){case"ArrowUp":case"PageUp":{let i=$s(e,-1);return i?`#/${ae[i].slug}`:""}case"ArrowDown":case"PageDown":{let i=$s(e,1);return i?`#/${ae[i].slug}`:""}case"Home":case"Escape":return"#/core";default:return null}}function SS(t){window.addEventListener("keydown",e=>{if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey)return;let n=e.key==="Escape";if(UP(e.target)){n&&t.sheet&&t.sheet.state!=="closed"&&t.sheet.close();return}if(n&&t.navMap&&t.navMap.isOpen){t.navMap.close(),e.preventDefault();return}if(te.booting&&t.input.offerKey&&t.input.offerKey(e)){e.preventDefault();return}let i=t.director;if(i&&i.busy()){let r=i.state.to?i.state.to.room:te.room,s=MS(e,r);if(s!=null){s&&i.go(s,{source:"kbd"}),e.preventDefault();return}e.key!=="Tab"&&e.key!=="Shift"&&e.key.length&&i.speedUp();return}if(t.halls&&t.halls.call(te.room,"onKey",e)===!0){e.preventDefault();return}if(e.code==="KeyM"){t.audio&&t.audio.toggle();return}if(i&&(FP.has(e.key)||bS(e.code)>=0)){let r=MS(e,te.room);r&&i.go(r,{source:"kbd"}),e.preventDefault()}})}var wS=!1,Jg=!1;function Kg(t){Jg||(Jg=!0,t.status&&t.status.say(t.input.pointer.lastMove?"boot.pointer":"boot.nopointer"))}function AS(t,e){wS||(wS=!0,t.bus.on("relaunch",()=>BP(t)));let n=t.key,i=Qt.reducedMotion,r=[],s=[],o=!1,a,l=new Promise(m=>{a=m}),c=(m,p)=>r.push(ut(m,p)),u=(m,p,M)=>{let T=Fn(m,p,M);return s.push(T),T};te.booting=!0,Jg=!1,te.phase!=="boot"&&zi("boot");let f=()=>{n&&(n.ignite({color:te.night?"electrum":"ember",flash:!0}),t.bus.emit("boot:ignite",{returning:Y.returning}))},h=m=>{t.chrome&&(m?Promise.resolve():t.chrome.typeIn()).then(()=>t.chrome.assemble(m?0:void 0)),t.keyNav&&t.keyNav.show(m?{ms:0}:{}),t.edges&&t.edges.drawIn(m?0:void 0)},d=m=>{if(!o){o=!0;for(let p of r)Vn(p);for(let p of s)p.cancel();_(),m&&(n&&(n.setScramble([0,0,0,0,0,0,0]),n.setReveal({points:1,scanY:null,fill:1,alpha:1}),f(),n.shootAxis(3.2,0)),t.nest&&t.nest.setFade(1,1),h(!0)),t.composite&&t.composite.setGrain(.02),t.datum&&t.datum.arrive("CORE",{instant:!!m}),t.rim&&t.rim.showName(),n&&(n.setBreathingRing(!0),n.setIdle(!0),n.setInteractive(!0)),Kg(t),zi("idle"),te.booting=!1,t.bus.emit("boot:done",{returning:Y.returning,sameDay:Y.sameDaySession,phone:ve.isPhone}),a()}},g={name:"boot",onGesture(m){return(m.type==="down"||m.type==="tap"||m.type==="wheel"||m.type==="dragstart")&&d(!0),!0},onKey(){return d(!0),!0}},_=t.input.push(g);if(!n){let m=t.t0&&t.t0.boot?t.t0.boot({phone:ve.isPhone,returning:Y.returning,sameDay:Y.sameDaySession,reduced:i}):Promise.resolve();return h(!1),m.then(()=>d(!1),()=>d(!1)),l}return t.nest&&t.nest.setFade(1,0),t.audio&&t.audio.play("bootSwell",{}),i?(c(200,()=>{t.nest&&u(400,m=>t.nest.setFade(1,m))}),c(300,()=>u(400,m=>n.setReveal({points:m,scanY:null,fill:m,alpha:m}))),c(700,()=>{f(),Kg(t),n.shootAxis(3.2,0),h(!1)}),c(1e3,()=>d(!1)),l):(n.setScramble("golden"),c(600,()=>{t.nest&&u(1e3,m=>t.nest.setFade(1,m),cn.reveal),h(!1)}),c(900,()=>u(400,m=>n.setReveal({points:m,scanY:null,fill:m,alpha:m}),cn.reveal)),c(1e3,()=>{n.lockSequence({order:"down",stepMs:220,spin:!1,snap:.04}).then(()=>{o||(f(),Kg(t),n.shootAxis(3.2,240).then(()=>{o||d(!1)}))})}),l)}function BP(t){let e=t.key;if(t.status&&t.status.say("relaunch"),!e)return;e.setScramble("golden"),e.douse();let n=null;n=t.input.push({name:"relaunch",onGesture(i){return i.type!=="tap"||te.room!=="CORE"||e.pick(i.x,i.y)<0?!1:(n(),e.lockSequence({order:"down",stepMs:220,spin:!1,snap:.04}).then(()=>{e.ignite({color:te.night?"electrum":"ember",flash:!0}),t.bus.emit("boot:ignite",{returning:!0}),t.audio&&t.audio.play("signature",{found:t.secrets?t.secrets.found():[]})}),!0)}})}var kP="http://www.w3.org/2000/svg",ES=.56;function xp(t,e,n){let i=document.createElementNS(kP,t);for(let r in e)i.setAttribute(r,e[r]);return n&&n.appendChild(i),i}function zP(){let t=xp("svg",{viewBox:"-0.8 -1.3 1.6 2.6","aria-hidden":"true"});Object.assign(t.style,{position:"absolute",left:"50%",top:"50%",height:`${ES*100}vh`,transform:"translate(-50%,-50%)",overflow:"visible"});for(let e of an){let n=[],i=e.top>0&&e.bot<0?[e.top,0,e.bot]:[e.top,e.bot];for(let r of i)n.push(`${Ct(r).toFixed(3)},${(-r).toFixed(3)}`);for(let r=i.length-1;r>=0;r--)n.push(`${(-Ct(i[r])).toFixed(3)},${(-i[r]).toFixed(3)}`);if(xp("polygon",{points:n.join(" "),fill:"none",stroke:"var(--silver)","stroke-width":"1","vector-effect":"non-scaling-stroke"},t),e.sign!=="•"){let r=xp("text",{x:"0",y:(-e.mid).toFixed(3),"text-anchor":"middle","dominant-baseline":"central",fill:"var(--pewter)"},t);r.style.font='500 0.07px "Martian", ui-monospace, monospace',r.style.letterSpacing="0.008px",r.textContent=e.sign}}return xp("circle",{cx:"0",cy:"0",r:"0.022",fill:"var(--ember)"},t),t}function vp(t){let e=document.getElementById("t0"),n={},i=!1,r="CORE",s=zP();if(e){e.textContent="",Object.assign(e.style,{background:"var(--void)"}),e.appendChild(s);for(let a of Object.keys(ae)){let l=document.createElement("section");l.dataset.room=a,l.hidden=a!=="CORE",Object.assign(l.style,{position:"absolute",left:"var(--title-x)",top:"calc(var(--datum-y) + 36px)"});let c=document.createElement("p");c.className="t-micro",c.textContent=`${ae[a].num} · ${ae[a].code} · ▽ ${ae[a].level}`,l.appendChild(c),e.appendChild(l),n[a]=l}e.hidden=t.app.tier!=="T0"}let o={root:e,boot(a){return new Promise(l=>ut(600,l))},show(a){let l=a&&ae[a.room]?a.room:"CORE";r=l;for(let c in n)n[c].hidden=c!==l;s.style.display=l==="CORE"?"":"none"},keyScreen(){return{x:ve.w/2,y:ve.h/2,r:ve.h*ES/2}},showLost(){let a=r;i=!0,e&&(e.hidden=!1),o.show({room:"CORE"}),r=a},hideLost(){i&&(i=!1,e&&t.app.tier!=="T0"&&(e.hidden=!0),o.show({room:r}))}};return o}var VP=["S01","S02","S03","S04","S05","S06","S07","S08","S09","S10","S11","S12","S13","S14"];function TS(t){let e=()=>{if(t.secrets&&typeof t.secrets.found=="function")return t.secrets.found();let i=Y.data&&Y.data.found||{};return VP.filter(r=>!!i[r])},n=Object.freeze({version:1,state(){let i=t.renderer,r=Y.data||{},s=i?i.stats:null;return{route:te.route.hash,room:te.room,phase:te.phase,tier:te.tier,u:te.u,soundOn:te.soundOn,night:te.night,owner:te.owner,inverted:te.inverted,secrets:e(),shards:r.shards|0,nadirOpen:!!r.nadirOpen,pullNest:te.pullNest,resonancePct:te.resonancePct,status:te.status,columns:te.columns.slice(),satellites:te.satellites,companion:te.companion,whaleSeen:!!r.whaleSeen,_stats:s?{calls:s.calls,triangles:s.triangles,dpr:i.dpr,texMB:ky(),geometries:s.geometries,points:s.points,frameMs:s.frameMs,fps:s.fps,tier:te.tier,labels:t.overlay?t.overlay.visibleCount|0:0}:null,_travel:t.director&&t.director.lastTravel?{...t.director.lastTravel}:null,_world:{source:Wx,issues:Xx.length}}},go(i){let r=String(i);location.hash===r?t.director&&t.director.go(r,{source:"go"}):location.hash=r}});try{Object.defineProperty(window,"__SAMVIN__",{value:n,writable:!1,configurable:!1,enumerable:!1})}catch{}return n}function RS(t,e,n){return new Promise(i=>{requestAnimationFrame(()=>i())})}var pr=null,Qg={x:0,y:0,depth:0,visible:!1},so=(t,e)=>t&&typeof t[e]=="function";function GP(t){return t&&t.isVector3&&Ce.camera?(Ce.project(t,Qg),{x:Qg.x,y:Qg.y}):t&&Number.isFinite(t.x)&&Number.isFinite(t.y)?{x:t.x,y:t.y}:{x:ve.w/2,y:ve.h/2}}function Lu(t,e){let n=pr&&pr.status;so(n,"say")&&n.say(t,e||{})}async function HP(t,e){let n=Y.data,i=pr&&pr.keyNav,r=n.shards<5&&!n.nadirOpen,s=r&&so(i,"slotPoint")?i.slotPoint(n.shards):so(i,"letterPoint")?i.letterPoint("I"):{x:ve.w/2,y:ve.h/2},o=Y.rank().index;try{await RS(t,e,s)}catch{}r&&Y.patch(l=>{l.shards=Math.min(5,(l.shards|0)+1)}),so(i,"refreshSlots")&&i.refreshSlots(),Ke.play("shard",{}),Nr(Dr.shard),pr&&so(pr.chrome,"relockFound")&&pr.chrome.relockFound(),Lu("found"),r&&n.shards<5&&Lu("shard",{k:n.shards}),Ee.emit("shard:landed",{id:t,k:n.shards,count:kr.count()});let a=Y.rank();a.index>o&&(Ee.emit("rank:change",{rank:a.name,index:a.index}),Lu("rank",{rank:a.name.toLocaleLowerCase("ru")}),so(Ke,"setRank")&&Ke.setRank(a.index)),r&&n.shards>=5&&!n.nadirOpen&&(Y.set("nadirOpen",!0),Lu("shard",{k:5}),Lu("nadir.open"),pr&&so(pr.lead,"show")&&pr.lead.show("Внизу что-то открылось.",{ms:3e3}),so(i,"crack")&&i.crack(),Ee.emit("nadir:open",{}))}var kr={init(t){return pr=t,t.secrets=kr,kr},discover(t,e={}){if(!gp(t)||!Y.data||kr.isFound(t))return!1;let n=e&&e.vars?{...e.vars}:{};Y.patch(r=>{r.found[t]=new Date(Date.now()).toISOString(),(!r.foundVars||typeof r.foundVars!="object")&&(r.foundVars={}),r.foundVars[t]=n});let i=GP(e&&e.anchor);return Ee.emit("secret:found",{id:t,anchor:i}),HP(t,i),!0},isFound(t){return!!(Y.data&&Y.data.found&&Y.data.found[t])},found(){return Zg.filter(t=>kr.isFound(t.id)).map(t=>t.id)},count(){return kr.found().length},rank(){return Y.rank()},get shards(){return Y.data?Y.data.shards|0:0}};var qV=Object.freeze([[1,2],[2,3],[1,4],[3,5],[2,7],[4,7]].map(t=>Object.freeze(t)));var aG=48;var hG=Object.freeze({legend:3,achievement:1.6,moment:1.2,joke:.8,before:3});var MG=Object.freeze(["stellated","twisted","nested","bipyramid","knot"]);var de={world:_t,state:Y,app:te,bus:Ee,loop:fe,quality:at,layout:ve,input:fn,audio:Ke,secrets:null,status:null,sheet:null,edges:null,hint:null,fog:null,palette:null,atlas:null,lead:null,overlay:null,dims:null,datum:null,chrome:null,keyNav:null,director:null,halls:null,renderer:null,scene:null,camera:null,rig:null,scale:null,nest:null,key:null,rim:null,lamp:null,U:null,worldFx:null,t0:null,composite:null,navMap:null,cursor:null,pillar:null};function fi(t,e){try{return e(),!0}catch(n){return xt(`main:${t}`,`boot step "${t}" failed`,n),!1}}function CS(){fi("env",()=>{Qt.reducedMotion,Vu()}),fi("state",()=>{g_(Gr());let a=Gr();te.night=Bp(a),te.drowsy=Zx(a),te.birthday=kp(a),te.owner=!!Y.data.owner,te.inverted=!!Y.data.inverted,document.documentElement.style.setProperty("--shrp",String(Y.shrp)),Y.deliverTransmissions()}),fi("fonts",()=>{$a()});let t=null;fi("quality",()=>{t=at.detect().gl}),te.tier!=="T0"&&(fi("webgl",()=>{de.composite=WP(t)})||LS()),te.tier==="T0"&&!de.t0&&fi("t0",()=>{de.t0=vp(de),te.tier="T0"});let e=fi("dom",()=>{de.chrome=vn,vn.init(de),de.status=Gn,Gn.init(de),de.lead=_u,_u.init(de),de.overlay=fr,fr.init(de),de.dims=ip,ip.init(de),de.datum=xu,xu.init(de),de.edges=Su,Su.init(de),de.sheet=ji,ji.init(de),de.navMap=Ui,Ui.init(de),de.keyNav=Ki,Ki.init(de),de.cursor=wu,wu.init(de),te.tier==="T0"&&vn.setT0Marker(!0)}),n=fi("audio",()=>{Ke.init(de)}),i=fi("input",()=>{fn.init(de),SS(de)}),r=Lr("#/core"),s=fi("navigation",()=>{r=Lr(location.hash),st.init(de),Rn.init(de)}),o=fi("secrets",()=>{kr.init(de),Iu.init(de)});fi("hook",()=>{TS(de)}),te.tier!=="T0"&&!(e&&n&&i&&s&&o)&&(LS(),fi("t0",()=>{de.t0=vp(de),de.chrome&&vn.setT0Marker(!0)})),fi("loop",()=>{at.init(de);let a=te.tier!=="T0"?de.composite:null;a?(XP(),fe.add(a.render,It.RENDER),a.onFirstFrame(()=>document.body.classList.remove("is-ff"))):document.body.classList.remove("is-ff"),fe.start(),te.tier!=="T0"&&at.benchmark(),Ee.emit("app:ready",{})}),fi("boot",()=>{let a=()=>AS(de,r).then(()=>IS(r),l=>{xt("main:boot",l),IS(r)});de.composite&&te.tier!=="T0"?de.composite.onFirstFrame(a):a()})}function PS(){let t=Je.core;return{pos:new P(...t.pos),target:new P(...t.target),fov:t.fov,offsetY:ve.kind==="desktop"?0:t.phoneOffsetY,roll:0}}function WP(t){let e=IM(document.getElementById("gl"),t,te.tier);return de.renderer=e,de.scene=e.scene,de.camera=e.camera,de.palette=Ws,de.U=xe,de.fog=Rr,Ws.init(),Kt.init(te.tier),de.atlas=Kt,Rr.set(ae.CORE.fog),Ye.init(e.scene,de),de.scale=Ye,de.worldFx=new jt,de.worldFx.name="worldFx",Ye.root.add(de.worldFx),xn.init(de),de.nest=xn,de.pillar=YM(),Ye.root.add(de.pillar),de.key=QM(de),xn.level(0).add(de.key.group),fe.add(de.key.update,It.WORLD),de.rim=tb(de),Ye.root.add(de.rim.group),Li.init(de),de.lamp=Li,Ce.init(e.camera),de.rig=Ce,Ce.setPose(PS()),Ee.on("layout:change",()=>{de.director||Ce.setPose(PS())}),fe.add((n,i)=>{xe.uTime.value=i/1e3,xe.uBreath.value=On.mix(0,1)},It.CLOCK),fe.add(n=>Li.update(n),It.LAMP),fe.add(n=>Ce.apply(n),It.CAMERA),Ee.on("gl:lost",()=>{try{de.t0||(de.t0=vp(de)),de.t0.showLost()}catch(n){xt("main:t0",n)}}),Ee.on("gl:restored",()=>{de.t0&&de.t0.hideLost&&de.t0.hideLost()}),UM(e)}function XP(){if(!(de.renderer&&de.renderer.three)||!de.scene||!de.camera)return;let e=[];de.scene.traverse(n=>{n.visible||(e.push(n),n.visible=!0)});try{de.renderer.warm(de.scene,de.camera,de.scene)}catch(n){xt("main:warm",n)}for(let n of e)n.visible=!1}function IS(t){(te.phase==="boot"||te.phase==="start")&&zi("idle"),te.booting=!1,de.director&&(de.director.settle(),t&&(t.room!=="CORE"||t.sub)&&de.director.go(t.hash,{source:"deeplink"}))}function LS(){de.renderer=de.scene=de.camera=de.key=de.rim=de.rig=de.scale=de.nest=de.lamp=null,de.composite=null,at.tier="T0",te.tier="T0";let t=document.getElementById("gl");t&&(t.hidden=!0)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",CS,{once:!0}):CS();})();
