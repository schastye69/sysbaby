(()=>{var Ay=t=>{try{return typeof matchMedia=="function"?matchMedia(t):null}catch{return null}},r0=Ay("(prefers-reduced-motion: reduce)"),s0=Ay("(pointer: coarse)"),i0=typeof navigator<"u"&&navigator.userAgent||"",by=typeof navigator<"u"&&navigator.maxTouchPoints||0,Et={reducedMotion:!!(r0&&r0.matches),coarse:!!(s0&&s0.matches),touch:by>0,ios:/iPad|iPhone|iPod/.test(i0)||/Macintosh/.test(i0)&&by>1,android:/Android/i.test(i0)},Sy=[];function Ty(t,e){t&&(t.addEventListener?t.addEventListener("change",e):t.addListener&&t.addListener(e))}Ty(r0,t=>{Et.reducedMotion=!!t.matches;for(let e=0;e<Sy.length;e++)try{Sy[e](Et.reducedMotion)}catch(n){ft("env:rm","reduced-motion listener failed",n)}});Ty(s0,t=>{Et.coarse=!!t.matches});var wy=new Set;function ft(t,...e){if(!wy.has(t)){wy.add(t);try{console.warn(`[sam.vin] ${t}:`,...e)}catch{}}}var jf=new Map,ge={on(t,e){let n=jf.get(t);return n||(n=[],jf.set(t,n)),n.push(e),()=>ge.off(t,e)},off(t,e){let n=jf.get(t);if(!n)return;let i=n.indexOf(e);i<0&&(i=n.findIndex(r=>r.orig===e)),i>=0&&n.splice(i,1)},once(t,e){let n=i=>{ge.off(t,n),e(i)};return n.orig=e,ge.on(t,n),()=>ge.off(t,n)},emit(t,e){let n=jf.get(t);if(!n||n.length===0)return;let i=n.slice();for(let r=0;r<i.length;r++)try{i[r](e)}catch(s){ft(`bus:${t}`,`listener for '${t}' threw`,s)}}};var Dc=Object.freeze(["void","abyss","deep","steel","slate","pewter","silver","white","obsidian","ember","emberDeep","electrum","paper","ink"]),Nc=Object.freeze({void:"--void",abyss:"--abyss",deep:"--deep",steel:"--steel",slate:"--slate",pewter:"--pewter",silver:"--silver",white:"--white",obsidian:"--obsidian",ember:"--ember",emberDeep:"--ember-deep",electrum:"--electrum",paper:"--paper",ink:"--ink"}),Qa=Object.freeze({void:"#04060A",abyss:"#070B12",deep:"#0C1420",steel:"#13202F",slate:"#233446",pewter:"#5E6E80",silver:"#B8C4D0",white:"#EEF2F6",obsidian:"#0B1119",ember:"#FF6A2B",emberDeep:"#B23A12",electrum:"#E8C872",paper:"#E6EAEE",ink:"#0C1420"}),Ey=Object.freeze({void:"#E6EAEE",abyss:"#E6EAEE",deep:"#E6EAEE",steel:"#9AA6B4",slate:"#9AA6B4",silver:"#0C1420",white:"#0C1420",obsidian:"#D3D9DF"});function o0(t){return parseInt(t.slice(1),16)}function Ry(t,e=[0,0,0]){let n=o0(t);return e[0]=(n>>16&255)/255,e[1]=(n>>8&255)/255,e[2]=(n&255)/255,e}function Jf(t,e){let n={};for(let i of Object.keys(t))n[i]=e(t[i]);return Object.freeze(n)}var lN=Jf(Qa,o0),aT=Jf(Qa,t=>Object.freeze(Ry(t))),cN=Jf(Ey,o0),lT=Jf(Ey,t=>Object.freeze(Ry(t)));function Qf(t,e,n=[0,0,0]){let i=aT[t],r=lT[t]||i;return n[0]=i[0]+(r[0]-i[0])*e,n[1]=i[1]+(r[1]-i[1])*e,n[2]=i[2]+(r[2]-i[2])*e,n}var uN=Object.freeze({giant:.07,counter:.12,status:.85,scrim:.6,scrimBreath:[.58,.62],leader:.7,line:.55,vertex:.4,inlay:.45,fresnel:.55,grains:.35,grainsBreath:[.32,.38],axisInside:.35,marginalia:.8,legendBand:.4,column:.7,dimmed:.4,hoverOthers:.55,dome:.45,contours:.4,doneLight:.12,ghost:.6,ghostStroke:.3,whale:.3,spark:.3,rimBoot:[.06,.12],bandHover:1.25}),fN=Object.freeze({maxFrac:.03,peakFrac:.06,peakMs:1500,maxLinePx:2,maxDotPx:6,maxTextPx:11,burnCoolMs:1200}),hN=Object.freeze({maxMs:2500,coolMs:600,nightNucleus:.55}),es=Object.freeze({nucleusIntensity:.55,litAlpha:.7,breathMs:7e3,drowsyBreathMs:5600,mixMs:1200,yawnMs:1200}),dN=Object.freeze({sans:'"Geologica", system-ui, sans-serif',mono:'"Martian", ui-monospace, monospace'}),pN=Object.freeze({giant:{family:"sans",wght:100,tracking:-.04,lh:.8,desktop:"38vw",phone:"62vmin",alpha:.07},display:{family:"sans",wght:220,tracking:-.035,lh:.9,desktop:"clamp(56px, 8.4vw, 148px)",phone:"13vmin"},heading:{family:"sans",wght:560,desktop:[28,34],phone:[26,31]},lead:{family:"sans",wght:300,desktop:[22,30],phone:[19,26]},brief:{family:"sans",wght:380,desktop:[19,28],phone:[17,25]},body:{family:"sans",wght:380,desktop:[17,25],phone:[16,24],measureCh:36},status:{family:"sans",wght:400,desktop:[16,22],phone:[16,22],maxChars:34,measureCh:44},label:{family:"mono",wght:500,wdth:87.5,tracking:.08,upper:!0,desktop:[11,14],phone:[11,14]},data:{family:"mono",wght:250,wdth:100,tabular:!0,desktop:[72,72],phone:[48,48]},micro:{family:"mono",wght:450,wdth:75,tracking:.1,upper:!0,desktop:[9.5,12],phone:[10,13]}}),po=Object.freeze({sign:'700 {px}px "Geologica"',burn:'700 {px}px "Geologica"',sand:'700 {px}px "Geologica"',ring:'500 {px}px "Martian"'});var Kf=Object.freeze({base:20,range:80,perDay:.08,perSecret:.06});function a0(t,e){return Math.min(1,Kf.perDay*t+Kf.perSecret*e)}function Cy(t,e){return Math.round(Kf.base+Kf.range*a0(t,e))}var mN=Object.freeze([120,240,480,960,1920]),gN=Object.freeze({o1:120,o2:240,o3:480,o4:960,o5:1920}),Py=Object.freeze({heavy:Object.freeze({omega:6,zeta:1}),medium:Object.freeze({omega:12,zeta:1}),light:Object.freeze({omega:22,zeta:1}),struck:Object.freeze({omega:18,zeta:.18}),notice:Object.freeze({omega:6.3,zeta:.95}),reindex:Object.freeze({omega:9,zeta:1}),hot:Object.freeze({omega:14,zeta:1}),hint:Object.freeze({omega:8,zeta:.25})}),xn=Object.freeze({inertiaDecay:.92,frameMs:16.7,spinDecay:.96,overshootMax:.04,snapOvershoot:.04,settleOvershoot:.02,anticipationFrac:.03,anticipationMs:120,anticipationMinDisp:.1,responseMs:80,pressScale:.96,pressMs:90,rippleMs:260,ripplePx:48}),el=Object.freeze({periodMs:4200,inhaleMs:1800,exhaleMs:2400,drowsyMs:5600,nightMs:7e3,reducedAmp:.25,nucleus:[.8,1],gap:[.02,.026],grainAlpha:[.32,.38],scrim:[.58,.62],edgeSwayPx:.2,droneDb:2});function Zf(t,e,n,i){let r=3*t,s=3*(n-t)-r,o=1-r-s,a=3*e,l=3*(i-e)-a,c=1-a-l,u=d=>((o*d+s)*d+r)*d,f=d=>((c*d+l)*d+a)*d,h=d=>(3*o*d+2*s)*d+r;return function(g){if(g<=0)return 0;if(g>=1)return 1;let x=g;for(let _=0;_<8;_++){let w=u(x)-g;if(Math.abs(w)<1e-6)return f(x);let v=h(x);if(Math.abs(v)<1e-6)break;x-=w/v}let p=0,m=1;x=g;for(let _=0;_<24;_++){let w=u(x);if(Math.abs(w-g)<1e-6)break;w<g?p=x:m=x,x=(p+m)/2}return f(x)}}var xN=Object.freeze({camera:Object.freeze([.7,0,.15,1]),reveal:Object.freeze([.16,1,.3,1]),phosphor:Object.freeze([.2,0,0,1])}),Iy=Object.freeze({camera:Zf(.7,0,.15,1),reveal:Zf(.16,1,.3,1),phosphor:Zf(.2,0,0,1),linear:t=>t<=0?0:t>=1?1:t,sine:t=>.5-.5*Math.cos(Math.PI*(t<=0?0:t>=1?1:t))}),Ae=Object.freeze({dive:1600,diveFirst:2400,diveFirstScale:1.375,diveFirstHold:200,diveSwapAt:1200,diveSwapAtFirst:1850,recall:1200,recallSwapAt:1e3,recallRatchetMs:40,liftBase:900,liftPerBoundary:280,liftMax:1800,slice:280,sliceSwap:140,depart:240,arrive:600,readableOut:120,retargetMin:600,retargetFactor:.8,skipSpeed:3,interactiveU:.7,releaseSourceMs:300,tierFreezeMs:300,unfold:1600,unfoldFirst:2200,refold:900,memberFocus:900,memberBack:600,shluz:1400,shluzBack:900,extract:600,workshop:1200,zenith:2400,nadirFirst:2800,focusReduced:160,bootDesktop:7200,bootReturning:3500,bootSameDay:2e3,bootReduced:2e3,lockStep:220,lockStepSameDay:110,firstLock:3400,ignite:4940,ignitionReturning:2640,typeMsPerChar:28,scanMs:800,burnMsPerLetter:70,burnCoolMs:1200,assemble:480,drawIn:600,phoneActivateWindow:1500,phonePartialHold:2500,phonePartialDrift:900,phoneHintDelay:2200,phoneHintReturning:4e3,lockIn:480,lockInReduced:160,revealMsPerChar:12,revealMax:240,beamCps:22,phosphor:900,statusIn:240,statusHold:4e3,idleRotate:2e4,leadDefault:4e3,leaderDraw:240,leaderStagger:40,labelLowpass:120,coordHz:10,keyHoverTrigger:120,keyHoverIn:480,keyHoverOut:520,dimsDraw:240,navHover:240,navTwin:240,longPress:800,relaunch:2e3,relaunchRingDelay:300,hintGlint:1200,overpullHold:600,stringRing:900,stringFlash:120,shudder:240,hintArriveWindow:3e4,idleLampMs:3e3,lampSweepMs:9e3,lampBlendMs:600,shardFlight:900,electrum:2500,electrumCool:600});var Ly=Math.log(1e3),vN=Object.freeze([-1,0,1,2]),Dy=1.5,l0=Object.freeze({near:.002,far:400}),Ir=Object.freeze({min:3.2,max:12,rest:7.2,wheelFactor:1.1,wheelStepPx:100}),yN=Object.freeze({d0:12,k:Ly,wheelDiv:2400,pinchGain:1.5,pauseMs:400,decay:.92,elevationDeg:8,settleIdleMs:600,settleMs:1600,settleTo:7.2,leadMs:4e3,strutTickMax:30,stages:Object.freeze([["КЛЮЧ",60],["ЗАЛ ЯДРА",600],["VIN",3600],["VIN ЦЕЛИКОМ",12e3]]),passLatticeD:[300,620]}),Ny=Object.freeze({d0:.06,k:Ly,miniKeyBelow:.05}),_N=Object.freeze({height:2400,diameter:1240,radius:620}),ea=Object.freeze({H:2.4,R:.62,k:1.35,halfH:1.2});function Ft(t){let e=Math.min(1,Math.abs(t)/ea.halfH);return ea.R*(1-Math.pow(e,ea.k))}var Dt=Object.freeze([{i:0,sign:"S",code:"SIGNAL",top:1.2,bot:.98,n:3,hollow:0,k:72},{i:1,sign:"A",code:"ARCHIVE",top:.96,bot:.66,n:5,hollow:0,k:120},{i:2,sign:"M",code:"MEMBERS",top:.64,bot:.28,n:7,hollow:0,k:168},{i:3,sign:"•",code:"CORE",top:.26,bot:-.26,n:12,hollow:.3,k:288},{i:4,sign:"V",code:"VOYAGES",top:-.28,bot:-.64,n:7,hollow:0,k:168},{i:5,sign:"I",code:"INSIGNIA",top:-.66,bot:-.96,n:5,hollow:0,k:120},{i:6,sign:"N",code:"NADIR",top:-.98,bot:-1.2,n:3,hollow:0,k:72}].map(t=>Object.freeze({...t,height:Math.round((t.top-t.bot)*1e3)/1e3,mid:(t.top+t.bot)/2,rTop:Ft(t.top),rBot:Ft(t.bot),rMax:t.top>0&&t.bot<0?ea.R:Math.max(Ft(t.top),Ft(t.bot))}))),Fc=Object.freeze(["S","A","M","•","V","I","N"]),Rs=Object.freeze([0,1/3,2/3,1]),Ot=Object.freeze({rest:.02,breath:.026,leanAdd:.01,hover:.09,hoverNeighbourPush:.012,dive:.3,unfold:.42,recallStart:.3}),It=Object.freeze({radius:1.25,apertureD:.09,ringEngraveW:.004,hollowR:.3,sign:Object.freeze({depth:.004,heightFrac:.7,strokeFrac:.12,face:0}),friezeH:.018,ticksPerFace:12,tickLen:.025,backFace:6,hoverSlide:.06,diveSlide:.25,diveTurnAwayDeg:20,contract:.03,nucleusAnticipation:1.6,lattice:Object.freeze({faceShift:.75,segmentsPerGenerator:8,generators:2016,segments:16128,solidBelowCamDist:2.4}),r1:Object.freeze({spLo:3,spHi:6}),unfold:Object.freeze({camFrom:7.2,camTo:Object.freeze([0,.04,.95]),ringScale:2.4,ringR:1.3,ringArcDeg:300,ringCap:.06,coreRingCap:.12,platesR:.16,plateSize:.05,platesPeriodS:24,orbitYawDeg:35}),pitchFlipDeg:110,pitchResist:.35,pitchResistMaxDeg:30,yawMaxDeg:180,yawReturnMs:2e3}),oi=Object.freeze({r:.035,detail:1,glowR:.0528,breathRingR:.09,apertureAlignDeg:Object.freeze([35,10]),gapOpen:Object.freeze([.03,.09]),minVisibility:.25,hotGain:.4,intensity:Object.freeze([.8,1]),birthdayPulse:1.3}),Lr=Object.freeze({half:1.2,extend:3.2,widthPx:2,alphaInside:.35,shootMs:240}),Vt=Object.freeze({driftYawDeg:14,driftPeriodS:40,swayDeg:1.5,swayPeriodsS:Object.freeze([11,13,17,19,23,29,31]),faceViewerDeg:16,reindexMs:Object.freeze([23e3,41e3]),reindexBackMs:1600,reindexTurnMs:620,noticeMaxDeg:7,noticeBootDeg:6,tauBaseMs:40,tauStepMs:40,hotDelayMs:220,hotDelayLateMs:90,hotTrackMs:3e3,hotRampMs:1e3,leanSpeedPx:300,leanRadius:1.2,leanDz:.08,flinchSpeedPx:2500,flinchRadius:1.5,flinchInMs:120,flinchRelaxMs:700,flinchScatter:.05,repelR:.35,repelCap:.06,repelBackMs:900}),mo=Object.freeze({T3:24576,T2:16384,T1:8192,annulus:Object.freeze([1.15,1.9]),kepler:.06,jitter:.002,sizePx:Object.freeze([1.2,2]),chunk:4096}),ta=Object.freeze({faces:Object.freeze([11,0,1]),stratum:3,apertureSkip:.06,dotPx:1.5,emitterM:1.2}),Cs=Object.freeze({max:7,size:.1,r:1.05,tiltDeg:12,periodS:90}),MN=Object.freeze({size:.24,r:1.6,periodS:60,bpm:71,arriveDay:10,flyMs:2400});var Fy=Object.freeze({SIGNAL:1090,ARCHIVE:810,MEMBERS:460,CORE:0,VOYAGES:-460,INSIGNIA:-810,NADIR:-1090,ZENITH:1260,WORKSHOP:484}),Oy=Object.freeze({SIGNAL:[980,1200],ARCHIVE:[660,960],MEMBERS:[280,640],CORE:[-260,260],VOYAGES:[-640,-280],INSIGNIA:[-960,-660],NADIR:[-1200,-980],ZENITH:[1200,1400],WORKSHOP:[482,487]}),kn=Object.freeze({wallsNear:300,wallsFar:620,wallVis:Object.freeze([.08,.14]),strutSpacing:Object.freeze([13,60]),ringStep:20,irisR:18,irisBlades:7,irisBladeDeg:51.4,irisPassR:12,deckR:60,deckRingStep:4,beadR:1.8,beadStep:25,beadCount:97,coreRimR:300,coreIrisY:260,liftOffset:Object.freeze([12,0,6]),drawCalls:40,triangles:12e4,labels:24,labelsLow:16}),ct=Object.freeze({fov:35,fovWide:40,core:Object.freeze({pos:[0,.75,7.2],target:[0,0,0],fov:35,phoneOffsetY:-.06}),boot:Object.freeze({start:[0,.4,16],dolly:9.5,rest:7.2,driftM:.08,driftHz:[.13,.11],tiltDeg:3}),phoneStart:Object.freeze({dist:5.2,keyFrac:.78,centreFrac:.47}),members:Object.freeze({pos:[0,10,48],target:[0,12.5,0],fov:35,phonePos:[0,11,40]}),voyages:Object.freeze({pos:[0,70,44],target:[0,0,-6],fov:35,altRange:[60,140],phonePos:[0,96,30],phonePitchDeg:-70}),archive:Object.freeze({tubeR:9,eyeBelowBand:.4}),signal:Object.freeze({pos:[0,2,26],target:[0,30,0],fov:40,phonePos:[0,2,30],phonePitchDeg:40,apexH:110,apexR:12}),insignia:Object.freeze({pos:[0,1.7,0],fov:40,sphereR:30}),nadir:Object.freeze({depth:110}),zenith:Object.freeze({aboveApex:60,pitchDeg:-62,phonePitchDeg:-70}),workshop:Object.freeze({chamber:4.4,grid:2.4,nodeStep:.4})}),Tt=Object.freeze({phoneMaxShort:600,landMaxH:500,desktop:Object.freeze({cols:12,margin:48,gutter:24,chrome:24,edgeInset:14,statusBottom:40,datumFrac:.62}),phone:Object.freeze({cols:4,margin:16,gutter:12,chrome:16,edgeInset:10,statusAboveBand:12,datumPx:120,titleTopPx:72}),measureCh:36,statusMeasureCh:44,hit:44,hitRow:56,crossPx:7,leader:Object.freeze({widthPx:.5,alpha:.7,elbowMin:24,elbowMax:64,runMax:120,maxAnchors:24,maxAnchorsLow:16}),dims:Object.freeze({widthPx:.5,arrowPx:6,extPx:4,gapPx:4,offsetPx:24}),scrim:Object.freeze({scale:1.4,featherPx:40}),nav:Object.freeze({w:56,h:300,hoverW:260,right:24,widthScale:.36,needlePx:12,slotPx:3,zenithDotPx:2,zenithDotAbove:10,twinPx:40,magnetPx:12,wheelPxPerDetent:120,rubber:.35,rubberMax:48,overpullPx:140,letterPx:11}),band:Object.freeze({h:88,sideW:72,letterPx:13,minCell:44}),sheet:Object.freeze({maxFrac:.62,peek:120,handle:24,sideFrac:.44}),elevator:Object.freeze({pxPerHall:360,resistance:.22,tickPx:60}),edge:Object.freeze({pluckPxMs:.4,bendPx:8,twitchPx:2}),sound:Object.freeze({w:32,h:12,bars:8,fps:30}),cursorPx:6,rippleMaxPx:48,beamHeadPx:3,statusDotPx:6}),on=Object.freeze({r1:Object.freeze({lo:3,hi:6,bayer:8}),r2:Object.freeze({fresnelPow:3,fresnelGain:.55,spec:Object.freeze([[24,.35],[160,.6]])}),r3:Object.freeze({widthPx:1,primaryPx:1.5,axisPx:2,alpha:.55,glintPow:24,glintGain:.9,farFadeStart:.55,primaryEdges:12}),r4:Object.freeze({atlas:1024,atlasLow:512,rakeLo:.55,rakeHi:.9,inlay:.45,heightTaps:4}),r5:Object.freeze({radiusFactor:2.2,elevationDeg:12,idleMs:3e3,sweepMs:9e3,blendMs:600}),r6:Object.freeze({threshold:.82,levels:4,spritePx:64}),r7:Object.freeze({grain:.02,grainBoot:.025,grainBootUntilMs:1800,grainFps:24,clearInPx:120,clearOutPx:180,vignette:.18,vignetteFrom:.35}),r8:Object.freeze({fogVis:Object.freeze([.08,.14])}),dprCap:Object.freeze({T3:2,T2:1.5,T1:1.25}),dprStep:.25,governor:Object.freeze({windowFrames:90,lowFps:52,dropAfterMs:3e3,highFps:58,upgradeAfterMs:1e4}),budget:Object.freeze({drawCalls:40,triangles:12e4,textureMB:12})}),Uy=30;var be={kind:"desktop",isPhone:!1,w:0,h:0,dpr:1,safe:{t:0,r:0,b:0,l:0}},tl=null;function cT(){if(typeof document>"u"||!document.body)return;tl||(tl=document.createElement("div"),tl.setAttribute("aria-hidden","true"),tl.style.cssText="position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)",document.body.appendChild(tl));let t=getComputedStyle(tl);be.safe.t=parseFloat(t.paddingTop)||0,be.safe.r=parseFloat(t.paddingRight)||0,be.safe.b=parseFloat(t.paddingBottom)||0,be.safe.l=parseFloat(t.paddingLeft)||0}var c0=null;function uT(){try{return c0||(c0=matchMedia("(pointer: coarse)")),c0.matches}catch{return!1}}function eh(){if(typeof window>"u")return!1;let t=Math.max(1,Math.round(window.innerWidth||document.documentElement.clientWidth||1)),e=Math.max(1,Math.round(window.innerHeight||document.documentElement.clientHeight||1)),n=uT()&&Math.min(t,e)<=Tt.phoneMaxShort,i=n?e<Tt.landMaxH?"phone-land":"phone":"desktop",r=window.devicePixelRatio||1,s=be.safe.t,o=be.safe.r,a=be.safe.b,l=be.safe.l;cT();let c=t!==be.w||e!==be.h||i!==be.kind||r!==be.dpr||s!==be.safe.t||o!==be.safe.r||a!==be.safe.b||l!==be.safe.l;return be.w=t,be.h=e,be.kind=i,be.isPhone=n,be.dpr=r,c}var u0=0;function f0(){if(u0)return;let t=()=>{u0=0,eh()&&ge.emit("layout:change",{kind:be.kind,w:be.w,h:be.h})};u0=typeof requestAnimationFrame=="function"?requestAnimationFrame(t):setTimeout(t,16)}if(typeof window<"u"){eh(),window.addEventListener("resize",f0),window.addEventListener("orientationchange",f0);try{matchMedia("(pointer: coarse)").addEventListener("change",f0)}catch{}}var Q={phase:"boot",room:"CORE",route:{room:"CORE",sub:null,hash:"#/core"},u:0,tier:"T2",soundOn:!0,night:!1,drowsy:!1,birthday:!1,owner:!1,inverted:!1,unfolded:!1,pullNest:0,resonancePct:0,status:"",columns:[],satellites:0,companion:!1,booting:!0,hintTarget:null,show:{active:!1,scene:-1},guests:0,fx:{stage:null}};function Vi(t){let e=Q.phase;t!==e&&(Q.phase=t,ge.emit("phase:change",{phase:t,prev:e}))}var na={operator:{id:"sam",name:"Сэм",aliases:["сэм","sam","сэмми","семён","semyon"],callsign:"ВЕДУЩИЙ",birthday:"2018-04-12",heightM:1.3,papaHeightM:null},clan:{name:"SAM.VIN",motto:"Ни один — не один.",about:"Играем всерьёз. Тех, кто слабее, защищаем ещё серьёзнее — в игре и в жизни.",founded:"2025-03-14",frequency:14.03,sigil:[[3,21],[21,45],[45,27],[27,3],[21,27],[3,45]],code:["Ждать — тоже сила.","Дал слово — держи.","Команда важнее меня.","Новенький — уже свой.","Всё по-честному.","Слово сильнее кулака.","Не проходим мимо."]},members:[{id:"sam",name:"Сэм",callsign:"ВЕДУЩИЙ",role:"основатель",status:"на связи",level:12,missions:21,seed:7,note:"D4",glyph:null,trait:"Придумал клан на перемене. Зовёт всех и ждёт каждого.",joke:"Говорит «я рядом», когда он на другом конце карты.",achievements:["start","bridge","onehp","newbie","peace"]},{id:"lev",name:"Лёва",callsign:"ЯКОРЬ",role:"защита",status:"на связи",level:11,missions:17,seed:23,note:"G3",glyph:[[3,38],[9,11],[38,29],[38,33]],trait:"Если Лёва держит точку — точка держится.",joke:"Знает все карты наизусть. Даже те, которых нет.",achievements:["start","bridge","newbie"]},{id:"tim",name:"Тимур",callsign:"ЭХО",role:"поиск",status:"в пути",level:9,missions:14,seed:41,note:"A3",glyph:[[21,9],[9,39],[39,27]],trait:"Слышит соперника раньше, чем тот появится.",joke:"Всегда приходит последним — и спасает всех.",achievements:["three"]},{id:"kira",name:"Кира",callsign:"ЛИСА",role:"наблюдение",status:"на связи",level:10,missions:15,seed:5,note:"B3",glyph:[[8,38],[38,12],[12,8],[8,2],[12,4]],trait:"Видит то, что пропустили все.",joke:"Однажды спряталась так, что её не нашли до конца матча.",achievements:["silent","three","peace"]},{id:"danya",name:"Даня",callsign:"ГРОМ",role:"заводила",status:"отдыхает",level:8,missions:11,seed:17,note:"E4",glyph:[[4,23],[23,25],[25,44]],trait:"Громкий только в голосовом чате.",joke:"Прыгнул через пропасть. Долетел. До сих пор этим гордится.",achievements:["roof"]},{id:"misha",name:"Миша",callsign:"КОМЕТА",role:"связь",status:"в пути",level:7,missions:9,seed:31,note:"G4",glyph:[[36,12],[36,26],[36,18]],trait:"Быстрый. Иногда слишком.",joke:"Первым добежал до финиша. В другую сторону.",achievements:["pizza"]},{id:"ars",name:"Арсений",callsign:"ТИШИНА",role:"идеи",status:"на связи",level:3,missions:2,seed:13,note:"A4",glyph:[[21,27],[24,17]],trait:"Пришёл новеньким. Уже удивил всех.",joke:"Спросил, где кнопка «победить». Мы ищем до сих пор.",achievements:["newbie"]}],missions:[{code:"001",title:"Первая высадка",status:"done",where:"игра",brief:"Первый матч клана в полном составе.",conditions:["4 игрока","одна попытка"],crew:["sam","lev","tim","kira"],result:"Проиграли 0:12. Но вместе.",reward:"start",log:"Зонд нашёл на месте высадки старый флаг клана. Он всё ещё там."},{code:"002",title:"Мост над пропастью",status:"done",where:"игра",brief:"Перебраться всей командой. Никто не должен упасть.",conditions:["вся команда","без возрождений"],crew:["sam","lev","danya","misha"],result:"Упали двое. Вернулись.",reward:"bridge",log:"Зонд проверил мост. Мост держится. Лёва, видимо, тоже."},{code:"003",title:"Тихая гавань",status:"done",where:"игра",brief:"Удержать маяк до заката и ни разу не потерять связь.",conditions:["втроём","никого не бросить","до заката"],crew:["sam","kira","tim"],result:"Маяк горит. Связь — сто процентов.",reward:"silent",log:"Зонд вернулся. На маяке кто-то оставил пиццу."},{code:"004",title:"Северная башня",status:"active",where:"игра",brief:"Добраться до вершины втроём.",conditions:["3 игрока","без возрождений"],crew:["sam","lev","ars"],result:"",reward:"tower",log:"Зонд долетел до середины башни. Вершина видна. Она высокая."},{code:"005",title:"Ночная смена",status:"new",where:"игра",brief:"Продержаться до рассвета. Говорить только шёпотом.",conditions:["4 игрока","шёпотом","до рассвета"],crew:[],result:"",reward:"night",log:"Зонд слушал всю ночь. Кто-то храпел. Не будем говорить кто."},{code:"006",title:"Тёмная вода",status:"locked",decodeDays:5,where:"игра",brief:"Найти, откуда идёт сигнал под водой.",conditions:["5 игроков","с фонарями"],crew:[],result:"",reward:null,log:"Зонд нырнул. Сигнал идёт снизу. Там что-то светится."},{code:"007",title:"Город без карты",status:"locked",unlockAtDays:7,where:"игра",brief:"Пройти город, где никто не был, и нарисовать его карту.",conditions:["весь клан","без подсказок"],crew:[],result:"",reward:null,log:"Зонд нарисовал карту. Город похож на ключ. Совпадение?"},{code:"008",title:"Сто ступеней",status:"locked",unlockAtDays:14,where:"игра",brief:"Подняться по самой длинной лестнице, не упав ни разу.",conditions:["2 игрока","ни одного падения"],crew:[],result:"",reward:null,log:"Зонд насчитал 101 ступень. Одна была лишняя."},{code:"000",title:"Исток",status:"sealed",where:"игра",brief:"Вернуться туда, где всё началось, и оставить там свой знак.",conditions:["весь клан","знак лидера"],crew:[],result:"",reward:"origin",log:"Зонд вернулся с фото первого матча. Все улыбаются. Даже проигравшие."},{code:"009",title:"Новенький — в игру",status:"done",where:"жизнь",brief:"В классе новенький. Позвать его в игру и познакомить со всеми.",conditions:["вся команда","по-доброму","в первый же день"],crew:["sam","lev","ars"],result:"Арсений теперь в клане. И уже зовёт других.",reward:"newbie",log:"Зонд облетел школьный двор. Новенький там больше не один."},{code:"010",title:"Мир на перемене",status:"done",where:"жизнь",brief:"Двое друзей поссорились. Помочь им договориться — без крика и не выбирая, кто прав.",conditions:["словами","выслушать обоих","без крика"],crew:["sam","kira"],result:"Договорились. Теперь играют в одной команде.",reward:"peace",log:"Зонд прислушался. На перемене снова смеются вдвоём."},{code:"011",title:"Заступиться словом",status:"active",where:"жизнь",brief:"Если кого-то обижают — встать рядом и спокойно сказать: «Так нельзя». Если нужно — позвать взрослого.",conditions:["словами","вместе","спокойно"],crew:["sam","lev","kira"],result:"",reward:"shield",log:"Зонд облетел школу. Если кого-то обидят, клан будет рядом."},{code:"012",title:"Игра для всех",status:"new",where:"жизнь",brief:"Придумать игру на перемене, в которую возьмут каждого, кто захочет. Даже тех, кто стоит в стороне.",conditions:["весь клан","берём каждого","честные правила"],crew:[],result:"",reward:"allgame",log:"Зонд облетел площадку. Места хватит всем. Осталось придумать игру."},{code:"013",title:"Не пройти мимо",status:"new",where:"жизнь",brief:"Кому-то во дворе нужна помощь. Заметить, позвать своих и помочь — вместе.",conditions:["вся команда","не проходить мимо"],crew:[],result:"",reward:null,log:"Зонд видел во дворе малыша с большим мешком. Вчетвером такой мешок нести легко."}],achievements:[{id:"start",title:"Начало",shape:"nested",rarity:"обычная",earned:!0,date:"2025-03-15",where:"игра",who:["sam","lev","tim","kira"],text:"Мы сыграли первый матч вместе."},{id:"roof",title:"Прыжок через пропасть",shape:"knot",rarity:"легендарная",earned:!0,date:"2025-05-30",where:"игра",who:["danya"],text:"Никто не верил. Гром прыгнул. Гром долетел."},{id:"bridge",title:"Мост выстоял",shape:"twisted",rarity:"редкая",earned:!0,date:"2025-06-02",where:"игра",who:["sam","lev","danya","misha"],text:"Мост качался. Мы держали его, пока не перешли все."},{id:"three",title:"Трое за всех",shape:"stellated",rarity:"легендарная",earned:!0,date:"2025-08-19",where:"игра",who:["tim","kira","sam"],text:"Нас было трое. Мы вернулись за каждым, кто отстал, и дошли вместе."},{id:"silent",title:"Тишина в эфире",shape:"bipyramid",rarity:"редкая",earned:!0,date:"2025-09-27",where:"игра",who:["kira","tim","sam"],text:"Целый раунд без единого слова. И победили."},{id:"onehp",title:"Победа с 1 HP",shape:"stellated",rarity:"редкая",earned:!0,date:"2025-12-20",where:"игра",who:["sam"],text:"Одна жизнь. Одна попытка. Этого хватило."},{id:"pizza",title:"Пицца-протокол",shape:"nested",rarity:"обычная",earned:!0,date:"2026-01-04",where:"игра",who:["misha","danya"],text:"Перерыв на пиццу посреди решающего матча. Всё равно выиграли."},{id:"tower",title:"Северная башня",shape:"bipyramid",rarity:"редкая",earned:!1,where:"игра",text:"Подняться на вершину втроём."},{id:"night",title:"Ночная смена",shape:"knot",rarity:"обычная",earned:!1,where:"игра",text:"Продержаться до рассвета шёпотом."},{id:"hundred",title:"Сотня",shape:"twisted",rarity:"легендарная",earned:!1,where:"игра",text:"Сыграть сто матчей вместе."},{id:"origin",title:"Исток",shape:"stellated",rarity:"легендарная",earned:!1,where:"игра",text:"Пройти вылазку 000."},{id:"newbie",title:"Новенький — свой",shape:"nested",rarity:"обычная",earned:!0,date:"2026-04-15",where:"жизнь",who:["sam","lev","ars"],text:"Арсений пришёл новеньким. В тот же день он был в команде."},{id:"peace",title:"Договорились",shape:"twisted",rarity:"редкая",earned:!0,date:"2026-05-20",where:"жизнь",who:["sam","kira"],text:"Двое друзей поссорились. Мы выслушали обоих. Они помирились."},{id:"shield",title:"Заступиться словом",shape:"bipyramid",rarity:"легендарная",earned:!1,where:"жизнь",text:"Заступиться за того, кого обижают. Словами и вместе."},{id:"allgame",title:"Игра для всех",shape:"stellated",rarity:"редкая",earned:!1,where:"жизнь",text:"Придумать игру, в которую берут каждого."}],legends:[{id:"found",date:"2025-03-14",kind:"эпичное",title:"Основание",where:"игра",text:"Три человека, один ноутбук, ноль побед. Так всё началось."},{id:"jump",date:"2025-05-30",kind:"победа",title:"Прыжок через пропасть",where:"игра",text:"Никто не верил. Гром прыгнул. Гром долетел."},{id:"nights",date:"2025-11-14",kind:"эпичное",title:"Ночь трёх возрождений",where:"игра",text:"Остался один. Поднял всех. Никто до сих пор не понимает как."},{id:"wifi",date:"2026-03-12",kind:"смешное",title:"Великое падение Wi-Fi",where:"игра",text:"Мы почти выиграли. Почти. Роутер помнит всё."},{id:"seventh",date:"2026-04-15",kind:"эпичное",title:"Седьмой",where:"жизнь",text:"Новенький стоял один у стены. Сэм позвал его в игру. Так в клане стало семеро."},{id:"recess",date:"2026-05-20",kind:"эпичное",title:"Мир на перемене",where:"жизнь",text:"Двое не разговаривали неделю. Клан позвал обоих в одну игру. Теперь они в одной команде."}],moments:[{id:"hide",date:"2025-04-20",title:"Лучшее укрытие",who:["kira"],where:"игра",text:"Кира спряталась так хорошо, что её не нашли до конца матча. Даже свои."},{id:"bug",date:"2025-07-08",title:"Великий баг на мосту",who:["danya"],where:"игра",text:"Мост исчез у всех, кроме Дани. Даня стоял в воздухе и не понимал, почему все кричат."},{id:"room",date:"2025-10-02",title:"Секретная комната",who:["lev"],where:"игра",text:"Лёва нашёл секретную комнату и двадцать минут не мог из неё выйти."},{id:"wrong",date:"2026-02-15",title:"Не туда",who:["misha"],where:"игра",text:"Миша первым добежал до финиша. В другую сторону."},{id:"button",date:"2026-06-01",title:"Кнопка «победить»",who:["ars"],where:"игра",text:"Арсений спросил, где кнопка «победить». Мы ищем до сих пор."},{id:"mic",date:"2026-08-23",title:"Тихий план",who:["tim"],where:"игра",text:"Тимур полчаса рассказывал план. Микрофон был выключен. План сработал всё равно."},{id:"umbrella",date:"2026-04-28",title:"Зонт на троих",who:["lev","kira"],where:"жизнь",text:"Лёва и Кира поделили зонт с первоклассником, которого даже не знали. Теперь знают."},{id:"slide",date:"2026-09-18",title:"Горка для всех",who:["sam"],where:"жизнь",text:"Старшие не пускали малышей на горку. Сэм не стал толкаться — он договорился. Теперь горка общая."},{id:"yard",date:"2026-09-25",title:"Давайте вместе?",who:["sam","misha","danya","tim"],where:"жизнь",text:"После праздника двор был весь в фантиках. Сэм сказал: «Давайте вместе?» Через десять минут было чисто."}],jokes:[{id:"key",date:"2025-03-20",hidden:!1,trigger:"ключ",text:"Кто взял ключ? — Никто не брал ключ."},{id:"cover",date:"2025-06-10",hidden:!1,trigger:"прикрывал",text:"Я не отстал. Я прикрывал."},{id:"maps",date:"2025-09-01",hidden:!0,trigger:"карты",text:"Правило №1: не спорить с Лёвой про карты."},{id:"micro",date:"2025-10-15",hidden:!0,trigger:"микрофон",text:"Кто опять забыл включить микрофон?"},{id:"pizza",date:"2026-01-04",hidden:!0,trigger:"пицца",text:"ПИЦЦА-ПРОТОКОЛ АКТИВИРОВАН."},{id:"tactic",date:"2026-04-01",hidden:!0,trigger:"манёвр",text:"Это был тактический манёвр."},{id:"lava",date:"2025-03-20",hidden:!1,trigger:"лава",text:"Своих не бросаем. Даже в лаве."}],transmissions:[{from:"VIN",text:"Добро пожаловать в VIN. Здесь всё ваше."},{from:"VIN",text:"Новая вылазка откроется в субботу. Готовьтесь."},{from:"ПАПА",text:"Горжусь вашим кланом. Конец связи."},{from:"VIN",text:"Напоминание: вода — тоже снаряжение."},{from:"VIN",text:"На маяке нашли пиццу. Расследование продолжается."},{from:"МАМА",text:"Уроки — это тоже миссия. Секретная."},{from:"VIN",text:"Сегодня отличный день, чтобы найти что-нибудь новое."},{from:"VIN",text:"Если увидишь кита — передай привет."},{from:"ПАПА",text:"Тот, кто читает эту передачу, — молодец. Да, ты."},{from:"VIN",text:"Ключ светится ярче, когда вы вместе."},{from:"ПАПА",text:"Видел, как вы позвали новенького. Вот это клан."},{from:"VIN",text:"Клан играет в игры. А защищает — везде."}],signal:{secret:"Частота 14.03 — день, когда всё началось. Ты её нашёл. Об этом знают только свои."},capsule:{openAfterDays:7,text:"Если ты это читаешь — ты вернулся. Настоящий исследователь всегда возвращается. — Папа"},zenith:{message:"Отсюда видно всё, что вы построили. Это только начало."},nadir:{origin:"Всё началось 14 марта 2025 года. Сэм придумал название на перемене: SAM.VIN. Первый матч мы проиграли 0:12. Никто не ушёл. Потом мы поняли: команда нужна не только в игре. С тех пор ключ светится."},night:{from:21,to:7,drowsyFrom:20,story:"Ночью в VIN тихо. Узлы светятся вполсилы, как окна в доме, где все уже спят."},companion:{name:"Искра"}};function h0(t){let e=Math.max(0,Math.min(48,t|0));return{x:e%7/6,y:Math.floor(e/7)/6}}function ky(t){if(typeof t=="number")return Number.isFinite(t)?Math.round(t):NaN;if(typeof t=="string"&&t.trim()!==""){let e=Number(t.trim());return Number.isFinite(e)?Math.round(e):NaN}return NaN}function Ps(t){let e=[];if(!Array.isArray(t))return e;let n=new Set;for(let i=0;i<t.length&&e.length<24;i++){let r=t[i];if(!Array.isArray(r)||r.length!==2)continue;let s=ky(r[0]),o=ky(r[1]);if(!(s>=0&&s<=48&&o>=0&&o<=48)||s===o)continue;let a=Math.min(s,o),l=Math.max(s,o),c=a*64+l;n.has(c)||(n.add(c),e.push([a,l]))}return e}function Is(t){let e=t>>>0;return function(){e=e+1831565813>>>0;let i=e;return i=Math.imul(i^i>>>15,i|1),i^=i+Math.imul(i^i>>>7,i|61),((i^i>>>14)>>>0)/4294967296}}function d0(t){let e=2166136261,n=String(t);for(let i=0;i<n.length;i++)e^=n.charCodeAt(i),e=Math.imul(e,16777619);return e>>>0}var PN=.5*(Math.sqrt(3)-1),IN=(3-Math.sqrt(3))/6,LN=new Float32Array([1,1,-1,1,1,-1,-1,-1,1,0,-1,0,0,1,0,-1]);function th(t,e,n,i){let r=Math.floor(Math.abs(Number(t)||0)),s=r%10,o=r%100;return o>=11&&o<=14?i:s===1?e:s>=2&&s<=4?n:i}function fT(t){let e="";for(let n=0;n<t.length;n++)n>0&&(t.length-n)%3===0&&(e+=" "),e+=t[n];return e}function zy(t,e=2){let n=Number(t)||0,i=Math.abs(n).toFixed(e),r=i.indexOf("."),s=r>=0?i.slice(0,r):i,o=r>=0?i.slice(r):"";return(Number(i)===0?"±":n>0?"+":"−")+fT(s)+o}var By=t=>(t<10?"0":"")+t;function go(t,e="dd.mm.yyyy"){if(t==null)return"";let n=String(t),i,r,s,o=/^(\d{4})-(\d{2})-(\d{2})$/.exec(n);if(o)i=+o[1],r=+o[2],s=+o[3];else{let l=Date.parse(n);if(!Number.isFinite(l))return"";let c=new Date(l);i=c.getFullYear(),r=c.getMonth()+1,s=c.getDate()}let a=`${By(s)}.${By(r)}`;return e==="dd.mm"?a:`${a}.${i}`}function Dr(t){return String(t??"").toLocaleUpperCase("ru")}var Vy=Object.freeze({"boot.pointer":{text:"вижу тебя.",p:3},"boot.nopointer":{text:"система проснулась.",p:3},"return.sameDay":{text:"снова ты.",p:3},"return.days":{text:"ты вернулся. тебя не было {N} {N:день|дня|дней}.",p:3},"return.days.owner":{text:"привет, {name}. тебя не было {N} {N:день|дня|дней}.",p:3},"return.node":{text:"пока тебя не было: +1 узел.",p:2},night:{text:"спокойной ночи, {name}.",p:3},drowsy:{text:"скоро ночь.",p:3},"night.flinch":{text:"ещё не сплю.",p:1},"tab.back":{text:"вот ты где.",p:3},"drawing.boot":{text:"помню твой рисунок.",p:3},"drawing.saved":{text:"запомнил.",p:1},"glyph.saved":{text:"запомнил.",p:1},"probe.sent":{text:"зонд {code} в пути. вернётся завтра.",p:1},"probe.back":{text:"зонд {code} вернулся. есть запись.",p:2},"transmission.new":{text:"пришла передача.",p:2},"mission.decoded":{text:"вылазка {code} расшифрована.",p:2},"companion.far":{text:"кто-то летит к нам.",p:2},"companion.near":{text:"он ближе. осталось {n} {n:день|дня|дней}.",p:2},"companion.arrived":{text:"он прилетел. его зовут {name}.",p:1},"capsule.open":{text:"капсула открыта.",p:1},birthday:{text:"с днём рождения, {name}!",p:2},anniversary:{text:"сегодня {title}. {years} {years:год|года|лет} назад.",p:2},found:{text:"найдено.",p:1},shard:{text:"осколок {k} из 5 на месте.",p:1},"nadir.open":{text:"внизу что-то открылось.",p:1},rank:{text:"новый ранг: {rank}.",p:1},dizzy:{text:"всё кружится.",p:1},"dizzy.after":{text:"уже лучше.",p:1},whale:{text:"смотри. кит.",p:1},drone:{text:"дрон принёс шутку.",p:1},pull:{text:"ты всё ещё внутри sam.vin.",p:1},relaunch:{text:"сплю. разбуди меня.",p:1},"member.typed":{text:"{callsign} на связи.",p:1},"hint.done":{text:"пока всё найдено.",p:1},"hint.time":{text:"остальное придёт само. возвращайся.",p:1},sealed:{text:"запечатано. осколков {k} из 5.",p:1},"route.missing":{text:"здесь ничего нет. пока.",p:1},"idle.nodes":{text:"{n} {n:узел горит|узла горят|узлов горят}.",p:5},"idle.mission":{text:"вылазка {code} ждёт.",p:5},echo:{text:"эхо от стены: {m} м.",p:4},"guests.in":{text:"гости приняты.",p:1},"guests.none":{text:"покажу сам.",p:4},"sbor.done":{text:"клан откликнулся.",p:1},"code.new":{text:"новое правило клана.",p:1},"lost.here":{text:"кто-то маленький потерялся.",p:4},"lost.saved":{text:"ты не прошёл мимо.",p:1},"lost.gentle":{text:"ты был бережным.",p:1},"pair.here":{text:"двое не слышат друг друга.",p:4},"pair.done":{text:"договорились.",p:1},"pair.fact":{text:"ты помог им услышать друг друга.",p:1},"proposal.saved":{text:"записано. покажи папе.",p:1},"proposal.real":{text:"твоя вылазка {code} стала настоящей.",p:2},"reply.saved":{text:"ответ сохранён. покажи папе.",p:1},"show.dark":{text:"разбуди меня.",p:1}});var nh=el.inhaleMs/el.periodMs,Sn={value:0,phase:0,periodMs:el.periodMs,amp:Et.reducedMotion?el.reducedAmp:1,setPeriod(t){t>0&&(Sn.periodMs=t)},held:!1,hold(t){Sn.held=!!t},mix(t,e){return t+(e-t)*(.5+(Sn.value-.5)*Sn.amp)}};function hT(t){return t<nh?.5-.5*Math.cos(Math.PI*(t/nh)):.5+.5*Math.cos(Math.PI*((t-nh)/(1-nh)))}var nl=new Map,dT=1;function Qe(t,e){let n=dT++;return nl.set(n,{at:fe.now+Math.max(0,t||0),fn:e}),n}function $n(t){nl.delete(t)}var il=new Set;function ti(t,e,n){let i,r=new Promise(o=>{i=o}),s={start:fe.now,ms:Math.max(0,t||0),fn:e,ease:n||null,resolve:i,live:!0};if(s.ms===0){try{e(1)}finally{i()}return{done:r,cancel(){}}}return il.add(s),{done:r,cancel(){s.live&&(s.live=!1,il.delete(s),i())}}}var Oc=[],p0=-1,m0=0;function pT(t,e){t.at<=m0&&Oc.push(e)}function mT(t){let e=(m0-t.start)/t.ms;if(e>=1){t.live=!1,il.delete(t);try{t.fn(1)}catch(n){ft("clock:tween","tween callback threw",n)}t.resolve()}else{let n=e<=0?0:e;try{t.fn(t.ease?t.ease(n):n)}catch(i){ft("clock:tween","tween callback threw",i),t.live=!1,il.delete(t),t.resolve()}}}function gT(t,e){m0=e,Sn.amp=Et.reducedMotion?el.reducedAmp:1;let n=p0<0?0:Math.max(0,e-p0);p0=e;let i=Math.min(1,Math.max(0,+fe.timeScale||0));if(Sn.phase=(Sn.phase+n*i*(Sn.held?0:1)/Sn.periodMs)%1,Sn.value=hT(Sn.phase),nl.size){Oc.length=0,nl.forEach(pT);for(let r=0;r<Oc.length;r++){let s=nl.get(Oc[r]);if(s){nl.delete(Oc[r]);try{s.fn()}catch(o){ft("clock:after","timer callback threw",o)}}}}il.size&&il.forEach(mT)}function Gy(){fe.add(gT,jt.CLOCK)}try{Gy()}catch{Promise.resolve().then(Gy)}var ts=[],Gi=null,xo=null,ia=0,g0=0,xT=0,ih=0;function vT(t,e){return t.replace(/\{(\w+)(?::([^|}]*)\|([^|}]*)\|([^}]*))?\}/g,(n,i,r,s,o)=>{let a=e?e[i]:void 0;return a==null?n:r!=null?th(a,r,s,o):String(a)})}function yT(t){ai.current=t,Q.status=t.text,xo&&(xo.textContent=t.text),Gi&&(Gi.classList.remove("is-in"),Gi.textContent=t.text,ih&&cancelAnimationFrame(ih),ih=requestAnimationFrame(()=>{ih=0,Gi.classList.add("is-in")})),ia&&$n(ia),ia=Qe(Ae.statusHold,_T),ge.emit("status:show",{key:t.key,text:t.text,p:t.p})}function x0(){return!ai.current||fe.now-ai.current.at>=Ae.statusHold}function _T(){ia=0,ts.length&&rh(ts.shift())}function rh(t){t.at=fe.now,yT(t)}function MT(t){if(ts.some(n=>n.text===t.text))return;let e=ts.length;for(;e>0&&ts[e-1].p>t.p;)e--;ts.splice(e,0,t),ts.length>4&&ts.pop()}function bT(){for(let t=0;t<2;t++){if(xT++%2===0)return{key:"idle.nodes",vars:{n:Y.litNodes|0}};let n=Mt.missions||[];for(let i=0;i<n.length;i++){let r=null;try{r=sh(n[i])}catch{r=null}if(r&&(r.state==="active"||r.state==="new"))return{key:"idle.mission",vars:{code:r.numberShown||n[i].code}}}}return{key:"idle.nodes",vars:{n:Y.litNodes|0}}}function Hy(){if(g0=Qe(Ae.idleRotate,Hy),Q.booting||ts.length||!x0())return;let t=ai.current;if(t&&t.p<5&&fe.now-t.at<Ae.idleRotate)return;let e=bT();ai.say(e.key,e.vars)}var ai={current:null,init(t){let e=document.getElementById("chrome");return Gi=document.getElementById("status"),!Gi&&e&&(Gi=document.createElement("p"),Gi.id="status",Gi.className="t-status",Gi.setAttribute("aria-hidden","true"),e.appendChild(Gi)),xo=document.getElementById("status-live"),xo&&xo.getAttribute("aria-live")!=="polite"&&xo.setAttribute("aria-live","polite"),g0||(g0=Qe(Ae.idleRotate,Hy)),ai},say(t,e={},n={}){let i=Vy[t];if(!i)return!1;let r={key:t,text:vT(i.text,e),p:i.p,at:0},s=ai.current;return s&&s.text===r.text&&!x0()?!0:n&&n.force||!s||x0()||r.p===1&&s.p>1?(rh(r),!0):(MT(r),!0)},clear(){ts.length=0,ai.current=null,Q.status="",ia&&($n(ia),ia=0),Gi&&(Gi.classList.remove("is-in"),Gi.textContent=""),xo&&(xo.textContent="")}};var ST={done:"ЗАВЕРШЕНА",active:"В ПУТИ",new:"НОВАЯ",sealed:"ЗАПЕЧАТАНА"};function wT(t){let e=t.decodeDays!=null?t.decodeDays:t.unlockAtDays;return t.status!=="locked"||!e?null:Math.min(100,Math.round(100*Y.distinctDays/e))}function sh(t){let e=t,n=Y.data||{},i=e.status,r=wT(e);i==="sealed"&&n.nadirOpen&&(i="new"),i==="locked"&&r===100&&(i="new");let s=null;if(i==="locked")if(e.decodeDays!=null)s="Расшифровка идёт. Возвращайся завтра — будет больше.";else{let l=Math.max(1,e.unlockAtDays-Y.distinctDays);s=`Откроется через ${l} ${th(l,"день","дня","дней")}.`}else i==="sealed"&&(s="Ключ к ней — в самом низу.");let o=Array.isArray(n.decoded)?n.decoded:[],a=v0(e.code);return{code:e.code,title:e.title,state:i,label:i==="locked"?`СИГНАЛ ЗАШИФРОВАН ${r}%`:ST[i],p:e.status==="locked"?r:null,numberShown:i==="locked"?"0??":e.code,lockedText:s,decodeReady:e.status==="locked"&&r===100&&!o.includes(e.code),probe:a,canProbe:(i==="done"||i==="active"||i==="new")&&a==="none",mission:e}}function v0(t){let e=Y.data&&Y.data.probes?Y.data.probes[t]:null;return e?e.back?"back":"out":"none"}var y0=["operator","clan","members","missions","achievements","legends","moments","jokes","transmissions","signal","capsule","zenith","nadir","night","companion"],qy={members:12,missions:24,achievements:24,legends:32,moments:64,jokes:64,transmissions:400},AT=["G2","A2","B2","D3","E3","G3","A3","B3","D4","E4","G4","A4","B4","D5","E5","G5","A5","B5","D6","E6","G6","A6","B6","D7"],TT=["D4","G3","A3","B3","E4","G4","A4","B4","D5","E5","G5","A5"],Wy=["stellated","twisted","nested","bipyramid","knot"],rl=t=>t!==null&&typeof t=="object"&&!Array.isArray(t),Bn=(t,e)=>t[e]!==void 0&&t[e]!==null,kc=t=>typeof structuredClone=="function"?structuredClone(t):JSON.parse(JSON.stringify(t)),gi=t=>{try{return JSON.stringify(t).slice(0,40)}catch{return String(t)}};function en(t,e,n,i,r){if(typeof t!="string"&&!(typeof t=="number"&&Number.isFinite(t)))return r(`${i}: ${gi(t)} invalid`),{ok:!1};let s=String(t).normalize("NFC").trim().replace(/\s+/g," ");return s===""&&n?(r(`${i}: empty`),{ok:!1}):(s.length>e&&(s=s.slice(0,e-1)+"…",r(`${i}: longer than ${e}, cut`)),{ok:!0,v:s})}function Ds(t,e,n){if(typeof t!="string"&&typeof t!="number")return n(`${e}: ${gi(t)} invalid`),{ok:!1};let i=String(t).trim().toLowerCase().replace(/[^a-z0-9_-]/g,"");return i?(i.length>24&&(i=i.slice(0,24),n(`${e}: longer than 24, cut`)),i!==String(t)&&n(`${e}: ${gi(t)} → "${i}"`),{ok:!0,v:i}):(n(`${e}: ${gi(t)} invalid`),{ok:!1})}function $y(t,e,n){return typeof t=="number"&&Number.isInteger(t)&&t>=0&&t<=999?{ok:!0,v:String(t).padStart(3,"0")}:typeof t=="string"&&/^\d{3}$/.test(t.trim())?{ok:!0,v:t.trim()}:(n(`${e}: ${gi(t)} invalid`),{ok:!1})}function Xy(t,e,n){if(t<2e3||t>2100||e<1||e>12||n<1)return!1;let i=new Date(Date.UTC(t,e,0)).getUTCDate();return n<=i}function ol(t,e,n){if(typeof t=="string"){let i=t.trim(),r=/^(\d{4})-(\d{2})-(\d{2})$/.exec(i);if(r&&Xy(+r[1],+r[2],+r[3]))return{ok:!0,v:i};if(r=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(i),r&&Xy(+r[3],+r[2],+r[1]))return{ok:!0,v:`${r[3]}-${r[2]}-${r[1]}`}}return n(`${e}: ${gi(t)} invalid date`),{ok:!1}}function M0(t,e){return typeof t=="number"?t:typeof t=="string"&&t.trim()!==""?Number(e?t.trim().replace(",","."):t.trim()):NaN}function Ls(t,e,n,i,r){let s=M0(t,!1);if(!Number.isFinite(s))return r(`${i}: ${gi(t)} invalid`),{ok:!1};let o=Math.round(s);return(o<e||o>n)&&(o=Math.min(n,Math.max(e,o)),r(`${i}: ${gi(t)} clamped → ${o}`)),{ok:!0,v:o}}function ET(t,e,n,i,r,s){let o=M0(t,!0);if(!Number.isFinite(o))return s(`${r}: ${gi(t)} invalid`),{ok:!1};let a=Math.pow(10,i),l=Math.round(o*a)/a;return(l<e||l>n)&&(l=Math.min(n,Math.max(e,l)),s(`${r}: ${gi(t)} clamped → ${l}`)),{ok:!0,v:l}}function jy(t,e,n){return t===!0||t===1||t==="true"||t==="да"?{ok:!0,v:!0}:t===!1||t===0||t==="false"||t==="нет"?{ok:!0,v:!1}:(n(`${e}: ${gi(t)} invalid`),{ok:!1})}function sl(t,e,n,i){if(typeof t=="string"){let r=t.trim().toLowerCase();if(e.includes(r))return{ok:!0,v:r}}return i(`${n}: ${gi(t)} invalid`),{ok:!1}}function Zy(t,e,n){if(!Array.isArray(t))return n(`${e}: not a list`),{ok:!1};let i=Ps(t);return i.length!==t.length&&n(`${e}: ${t.length-i.length} edge(s) dropped`),i.length?{ok:!0,v:i}:{ok:!1}}function Yy(t,e,n,i,r,s){let o=M0(t,!0);if(!Number.isFinite(o))return s(`${r}: ${gi(t)} invalid`),{ok:!1};let a=Math.pow(10,i),l=Math.round(o*a)/a;return l<e||l>n?(s(`${r}: ${gi(t)} out of range`),{ok:!1}):{ok:!0,v:l}}var RT=["игра","жизнь"],oh=(t,e,n)=>mt(t,"where",i=>sl(i,RT,`${e}.where`,n),null);function mt(t,e,n,i){if(!Bn(t,e))return i;let r=n(t[e]);return r.ok?r.v:i}function Ky(t,e,n,i,r,s){if(!Bn(t,e))return[];let o=t[e];if(!Array.isArray(o))return s(`${r}: not a list`),[];let a=[];for(let l=0;l<o.length;l++){if(a.length>=n){s(`${r}: more than ${n}, rest dropped`);break}let c=en(o[l],i,!0,`${r}[${l}]`,s);c.ok&&a.push(c.v)}return a}function ah(t,e,n,i,r){if(!Bn(t,e))return[];let s=t[e];if(!Array.isArray(s))return r(`${i}: not a list`),[];let o=[];for(let a=0;a<s.length&&o.length<n;a++){let l=Ds(s[a],`${i}[${a}]`,r);l.ok&&o.push(l.v)}return s.length>n&&r(`${i}: more than ${n}, rest dropped`),o}function Vc(t,e){let n=t,i=2;for(;e.has(n);)n=`${t}-${i++}`;return e.add(n),n}function _0(t){return String(t).toLocaleLowerCase("ru").replace(/[^a-zа-яё0-9]/g,"")}function sa(t,e,n,i){let r=[],s=qy[e];for(let o=0;o<t.length;o++){let a=`${e}[${o}]`;if(r.length>=s){i(`${e}: more than ${s}, rest dropped`);break}if(!rl(t[o])){i(`${a}: not an object, dropped`);continue}let l=n(t[o],o,a);l&&r.push(l)}return r}function CT(t,e){let n=new Set;return sa(t,"achievements",(i,r,s)=>{let o=Bn(i,"title")?en(i.title,40,!0,`${s}.title`,e):{ok:!1};if(!o.ok)return e(`${s}: no title, dropped`),null;let a=Bn(i,"id")?Ds(i.id,`${s}.id`,e):{ok:!1},l=Vc(a.ok?a.v:`a${r+1}`,n),c=mt(i,"earned",u=>jy(u,`${s}.earned`,e),!1);return{id:l,title:o.v,shape:mt(i,"shape",u=>sl(u,Wy,`${s}.shape`,e),Wy[r%5]),rarity:mt(i,"rarity",u=>sl(u,["обычная","редкая","легендарная"],`${s}.rarity`,e),"обычная"),earned:c,date:c?mt(i,"date",u=>ol(u,`${s}.date`,e),null):null,who:ah(i,"who",12,`${s}.who`,e),text:mt(i,"text",u=>en(u,200,!1,`${s}.text`,e),""),where:oh(i,s,e)}},e)}function PT(t,e){let n=new Set(["workshop"]);return sa(t,"members",(i,r,s)=>{let o=Bn(i,"name")?en(i.name,24,!0,`${s}.name`,e):{ok:!1};if(!o.ok)return e(`${s}: no name, dropped`),null;let a=Bn(i,"id")?Ds(i.id,`${s}.id`,e):{ok:!1},l=Vc(a.ok?a.v:`m${r+1}`,n),c=TT[r%12];if(Bn(i,"note")){let u=typeof i.note=="string"?i.note.trim().toUpperCase():"";AT.includes(u)?c=u:e(`${s}.note: ${gi(i.note)} invalid → "${c}"`)}return{id:l,name:o.v,callsign:mt(i,"callsign",u=>en(u,16,!1,`${s}.callsign`,e),""),role:mt(i,"role",u=>en(u,32,!1,`${s}.role`,e),""),status:mt(i,"status",u=>sl(u,["на связи","в пути","отдыхает"],`${s}.status`,e),"на связи"),level:mt(i,"level",u=>Ls(u,0,99,`${s}.level`,e),1),missions:mt(i,"missions",u=>Ls(u,0,999,`${s}.missions`,e),0),seed:mt(i,"seed",u=>Ls(u,0,9999,`${s}.seed`,e),d0(l)%100),note:c,glyph:mt(i,"glyph",u=>Zy(u,`${s}.glyph`,e),null),trait:mt(i,"trait",u=>en(u,120,!1,`${s}.trait`,e),""),joke:mt(i,"joke",u=>en(u,160,!1,`${s}.joke`,e),""),achievements:ah(i,"achievements",16,`${s}.achievements`,e)}},e)}function IT(t,e){let n=new Set;for(let r of t)if(rl(r)&&Bn(r,"code")){let s=$y(r.code,"",()=>{});s.ok&&n.add(s.v)}let i=new Set;return sa(t,"missions",(r,s,o)=>{let a=null;if(Bn(r,"code")){let f=$y(r.code,`${o}.code`,e);if(f.ok&&(a=f.v,i.has(a)))return e(`${o}: duplicate code ${a}, dropped`),null}if(a===null&&(a=String(s+1).padStart(3,"0"),i.has(a)||n.has(a)))return e(`${o}: no code (${a} taken), dropped`),null;i.add(a);let l=mt(r,"status",f=>sl(f,["done","active","new","locked","sealed"],`${o}.status`,e),"new"),c=mt(r,"decodeDays",f=>Ls(f,1,365,`${o}.decodeDays`,e),null),u=mt(r,"unlockAtDays",f=>Ls(f,1,365,`${o}.unlockAtDays`,e),null);return l!=="locked"?(c=null,u=null):c!=null&&u!=null?(u=null,e(`${o}: locked with both day fields → decodeDays kept`)):c==null&&u==null&&(c=7,e(`${o}: locked without days → decodeDays 7`)),{code:a,title:mt(r,"title",f=>en(f,48,!0,`${o}.title`,e),`Вылазка ${a}`),status:l,brief:mt(r,"brief",f=>en(f,240,!1,`${o}.brief`,e),""),conditions:Ky(r,"conditions",6,40,`${o}.conditions`,e),crew:ah(r,"crew",12,`${o}.crew`,e),result:mt(r,"result",f=>en(f,160,!1,`${o}.result`,e),""),reward:mt(r,"reward",f=>Ds(f,`${o}.reward`,e),null),log:mt(r,"log",f=>en(f,200,!1,`${o}.log`,e),""),decodeDays:c,unlockAtDays:u,proposedBy:mt(r,"proposedBy",f=>Ds(f,`${o}.proposedBy`,e),null),where:oh(r,o,e)}},e)}function LT(t,e){let n=new Set;return sa(t,"legends",(i,r,s)=>{let o=Bn(i,"date")?ol(i.date,`${s}.date`,e):{ok:!1},a=Bn(i,"title")?en(i.title,48,!0,`${s}.title`,e):{ok:!1};if(!o.ok||!a.ok)return e(`${s}: needs date and title, dropped`),null;let l=Bn(i,"id")?Ds(i.id,`${s}.id`,e):{ok:!1};return{id:Vc(l.ok?l.v:`l${r+1}`,n),date:o.v,kind:mt(i,"kind",c=>sl(c,["победа","смешное","эпичное"],`${s}.kind`,e),"эпичное"),title:a.v,text:mt(i,"text",c=>en(c,300,!1,`${s}.text`,e),""),where:oh(i,s,e)}},e)}function DT(t,e){let n=new Set;return sa(t,"moments",(i,r,s)=>{let o=Bn(i,"date")?ol(i.date,`${s}.date`,e):{ok:!1},a=Bn(i,"title")?en(i.title,48,!0,`${s}.title`,e):{ok:!1};if(!o.ok||!a.ok)return e(`${s}: needs date and title, dropped`),null;let l=Bn(i,"id")?Ds(i.id,`${s}.id`,e):{ok:!1};return{id:Vc(l.ok?l.v:`mo${r+1}`,n),date:o.v,title:a.v,who:ah(i,"who",12,`${s}.who`,e),text:mt(i,"text",c=>en(c,300,!0,`${s}.text`,e),a.v),where:oh(i,s,e)}},e)}function NT(t,e){let n=new Set;return sa(t,"jokes",(i,r,s)=>{let o=Bn(i,"text")?en(i.text,160,!0,`${s}.text`,e):{ok:!1};if(!o.ok)return e(`${s}: no text, dropped`),null;let a=Bn(i,"id")?Ds(i.id,`${s}.id`,e):{ok:!1},l=mt(i,"trigger",c=>en(c,24,!1,`${s}.trigger`,e),"");return{id:Vc(a.ok?a.v:`j${r+1}`,n),date:mt(i,"date",c=>ol(c,`${s}.date`,e),null),hidden:mt(i,"hidden",c=>jy(c,`${s}.hidden`,e),!1),trigger:_0(l),text:o.v}},e)}function FT(t,e){return sa(t,"transmissions",(n,i,r)=>{let s=Bn(n,"text")?en(n.text,240,!0,`${r}.text`,e):{ok:!1};return s.ok?{from:mt(n,"from",o=>en(o,16,!0,`${r}.from`,e),"VIN"),text:s.v}:(e(`${r}: no text, dropped`),null)},e)}function OT(t,e){let n=na.clan;return{name:mt(t,"name",i=>en(i,24,!0,"clan.name",e),n.name),motto:mt(t,"motto",i=>en(i,80,!0,"clan.motto",e),n.motto),about:mt(t,"about",i=>en(i,120,!1,"clan.about",e),n.about),founded:mt(t,"founded",i=>ol(i,"clan.founded",e),n.founded),frequency:mt(t,"frequency",i=>ET(i,0,99.99,2,"clan.frequency",e),n.frequency),sigil:mt(t,"sigil",i=>Zy(i,"clan.sigil",e),Ps(n.sigil)),code:UT(t,e)}}function UT(t,e){let n=na.clan.code;if(!Bn(t,"code"))return n.slice();let i=t.code;if(!Array.isArray(i))return e("clan.code: not a list, default used"),n.slice();i.length>7&&e("clan.code: more than 7, rest dropped");let r=[];for(let s=0;s<7;s++){if(s>=i.length){r.push(n[s]);continue}let o=i[s];if(typeof o!="string"){e(`clan.code[${s}]: ${gi(o)} invalid → ""`),r.push("");continue}let a=en(o,40,!1,`clan.code[${s}]`,e);r.push(a.ok?a.v:"")}return r}function kT(t,e,n){let i=na.operator,r=Bn(t,"name")?en(t.name,24,!0,"operator.name",n):{ok:!1},s,o=Bn(t,"id")?Ds(t.id,"operator.id",n):{ok:!1};if(o.ok)s=o.v,e.some(c=>c.id===s)||n(`operator.id: "${s}" matches no member (kept)`);else{let c=r.ok?e.find(u=>u.name.toLocaleLowerCase("ru")===r.v.toLocaleLowerCase("ru")):null;s=c?c.id:e.length?e[0].id:"sam"}let a=e.find(c=>c.id===s)||null,l=r.ok?r.v:a?a.name:i.name;return{id:s,name:l,aliases:Ky(t,"aliases",8,24,"operator.aliases",n),callsign:mt(t,"callsign",c=>en(c,16,!1,"operator.callsign",n),a?a.callsign:""),birthday:mt(t,"birthday",c=>ol(c,"operator.birthday",n),null),heightM:mt(t,"heightM",c=>Yy(c,.8,2.2,2,"operator.heightM",n),i.heightM!=null?i.heightM:1.3),papaHeightM:mt(t,"papaHeightM",c=>Yy(c,1.4,2.3,2,"operator.papaHeightM",n),null)}}function BT(t,e,n){let i=na,r=(s,o)=>{try{t[s]=o(rl(e[s])?e[s]:i[s])}catch{n(`${s}: crashed, default used`),t[s]=kc(i[s])}};r("signal",s=>({secret:mt(s,"secret",o=>en(o,240,!0,"signal.secret",n),i.signal.secret)})),r("capsule",s=>({openAfterDays:mt(s,"openAfterDays",o=>Ls(o,0,365,"capsule.openAfterDays",n),i.capsule.openAfterDays),text:mt(s,"text",o=>en(o,300,!0,"capsule.text",n),i.capsule.text)})),r("zenith",s=>({message:mt(s,"message",o=>en(o,160,!0,"zenith.message",n),i.zenith.message)})),r("nadir",s=>({origin:mt(s,"origin",o=>en(o,400,!0,"nadir.origin",n),i.nadir.origin)})),r("night",s=>({from:mt(s,"from",o=>Ls(o,0,23,"night.from",n),i.night.from),to:mt(s,"to",o=>Ls(o,0,23,"night.to",n),i.night.to),drowsyFrom:mt(s,"drowsyFrom",o=>Ls(o,0,23,"night.drowsyFrom",n),i.night.drowsyFrom),story:mt(s,"story",o=>en(o,240,!0,"night.story",n),i.night.story)})),r("companion",s=>({name:mt(s,"name",o=>en(o,16,!0,"companion.name",n),i.companion.name)}))}function zT(t){let e=[],n=u=>{e.push(u)},i=na,r=t;rl(r)||(r={});let s={},o=[];try{o=Object.keys(r)}catch{o=[]}for(let u of o)y0.includes(u)||n(`unknown key ${u}`);let a={};for(let u of y0){let f;try{f=r[u]}catch{f=void 0}let d=u in qy?Array.isArray(f):rl(f);!d&&f!==void 0&&n(`${u}: default used`),a[u]=d?f:kc(i[u])}let l=[["achievements",CT],["members",PT],["missions",IT],["legends",LT],["moments",DT],["jokes",NT],["transmissions",FT]];for(let[u,f]of l)try{s[u]=f(a[u],n)}catch{n(`${u}: crashed, default used`);try{s[u]=f(kc(i[u]),()=>{})}catch{s[u]=[]}}try{s.clan=OT(a.clan,n)}catch{n("clan: crashed, default used"),s.clan=kc(i.clan)}try{s.operator=kT(a.operator,s.members,n)}catch{n("operator: crashed, default used"),s.operator={...kc(i.operator),aliases:[]}}BT(s,a,n);try{let u=new Set(s.members.map(d=>d.id)),f=new Set(s.achievements.map(d=>d.id)),h=(d,g,x)=>{let p=[];for(let m of d){if(!g.has(m)){n(`${x}: unknown "${m}" removed`);continue}p.includes(m)||p.push(m)}return p};s.members.forEach((d,g)=>{d.achievements=h(d.achievements,f,`members[${g}].achievements`)}),s.missions.forEach((d,g)=>{d.crew=h(d.crew,u,`missions[${g}].crew`),d.reward!=null&&!f.has(d.reward)&&(n(`missions[${g}].reward: unknown "${d.reward}" removed`),d.reward=null),d.proposedBy!=null&&!u.has(d.proposedBy)&&(n(`missions[${g}].proposedBy: unknown "${d.proposedBy}" removed`),d.proposedBy=null)}),s.achievements.forEach((d,g)=>{d.who=h(d.who,u,`achievements[${g}].who`)}),s.moments.forEach((d,g)=>{d.who=h(d.who,u,`moments[${g}].who`)})}catch{n("refs: crashed")}for(let u of s.jokes)u.date==null&&(u.date=s.clan.founded);try{let u=[];for(let h of s.operator.aliases){let d=_0(h);d.length>=2&&d.length<=24&&!u.includes(d)&&u.push(d)}let f=_0(s.operator.name);f.length>=2&&!u.includes(f)&&u.push(f),s.operator.aliases=u}catch{s.operator.aliases=[]}let c={};for(let u of y0)c[u]=s[u];return{world:c,issues:e}}function Jy(t){if(t&&typeof t=="object"&&!Object.isFrozen(t)){Object.freeze(t);for(let e of Object.keys(t))Jy(t[e])}return t}var zc,Qy="file";try{zc=typeof window<"u"?window.SAMVIN_WORLD:void 0}catch{zc=void 0}rl(zc)||(Qy="default",zc=na,ft("world","world.js missing or broken — using built-in defaults"));var Bc=zT(zc);Bc.issues.length&&ft("world-issues",`world.js: ${Bc.issues.length} issue(s)`,Bc.issues);var e_=Qy,t_=Object.freeze(Bc.issues.slice()),Mt=Jy(Bc.world);var hF=Object.freeze({members:"Здесь пока никого нет.",missions:"Вылазок пока нет.",achievements:"Трофеев пока нет.",transmissions:"Передач пока нет.",probeLog:"Зонд вернулся. Записи нет."}),VT=/^S(0[1-9]|1[0-4])$/;function n_(){let t=Y.data||{},e=t.transmissions||{delivered:0,read:[]},n=Math.max(0,Math.min(e.delivered|0,Mt.transmissions.length)),i=Array.isArray(e.read)?e.read:[],r=0;for(let u=0;u<n;u++)i.includes(u)||r++;let s=new Set(Mt.jokes.map(u=>u.id)),o=new Set((Array.isArray(t.jokesFound)?t.jokesFound:[]).filter(u=>s.has(u))).size,a=0,l=0;for(let u of Mt.missions)sh(u).state==="done"&&a++,v0(u.code)==="out"&&l++;let c=t.found&&typeof t.found=="object"?Object.keys(t.found).filter(u=>VT.test(u)).length:0;return{delivered:n,unread:r,legends:Mt.legends.length,moments:Mt.moments.length,jokesFound:o,members:Mt.members.length,online:Mt.members.filter(u=>u.status==="на связи").length,founded:go(Mt.clan.founded,"dd.mm.yyyy"),daysSinceFounded:Math.max(0,ra(Mt.clan.founded,Y.today||Mt.clan.founded)),missions:Mt.missions.length,done:a,probesOut:l,earned:Mt.achievements.filter(u=>u.earned).length,achievements:Mt.achievements.length,secrets:c,shards:t.shards|0,nadirOpen:!!t.nadirOpen,life:Mt.missions.filter(u=>u.where==="жизнь").length}}var GT=864e5,i_=t=>(t<10?"0":"")+t,lh=t=>t instanceof Date?t:new Date(t??Ns());function Ns(){return Date.now()}function ch(t){let e=lh(t);return`${e.getFullYear()}-${i_(e.getMonth()+1)}-${i_(e.getDate())}`}function r_(t){let e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(t||""));return e?Math.round(Date.UTC(+e[1],+e[2]-1,+e[3])/GT):NaN}function ra(t,e){let n=r_(t),i=r_(e);return Number.isFinite(n)&&Number.isFinite(i)?i-n:0}function s_(t,e,n){return e>n?t>=e||t<n:e<n?t>=e&&t<n:!1}function b0(t){let e=Mt.night;return s_(lh(t).getHours(),e.from,e.to)}function o_(t){let e=Mt.night;return b0(t)||e.drowsyFrom===e.from?!1:s_(lh(t).getHours(),e.drowsyFrom,e.from)}function HT(t){let e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(String(t||""));return e?{y:+e[1],m:+e[2],d:+e[3]}:null}function S0(t){let e=HT(Mt.operator.birthday);if(!e)return!1;let n=lh(t),i=n.getFullYear(),r=n.getMonth()+1,s=n.getDate();return e.m===2&&e.d===29&&!(i%4===0&&i%100!==0||i%400===0)?r===2&&s===28:r===e.m&&s===e.d}var O_=0,tg=1,U_=2;var mu=1,k_=2,Pl=3,us=0,Fi=1,fs=2,Wi=0,or=1,ma=2,ng=3,ig=4,yd=5;var $s=100,B_=101,z_=102,V_=103,G_=104,H_=200,gu=201,W_=202,$_=203,rg=204,Il=205,X_=206,Y_=207,q_=208,j_=209,Z_=210,K_=211,J_=212,Q_=213,eM=214,Oh=0,Uh=1,kh=2,bl=3,Bh=4,zh=5,Vh=6,Gh=7,sg=0,tM=1,nM=2,ar=0,og=1,ag=2,lg=3,cg=4,ug=5,fg=6,hg=7;var dg=300,Po=301,ga=302,_d=303,Md=304,xu=306,Hh=1e3,_i=1001,Wh=1002,ii=1003,iM=1004;var vu=1005;var Wt=1006,bd=1007;var Io=1008;var lr=1009,pg=1010,mg=1011,Ll=1012,Sd=1013,Br=1014,_r=1015,Mi=1016,wd=1017,Ad=1018,Dl=1020,gg=35902,xg=35899,vg=1021,yg=1022,li=1023,rs=1026,Lo=1027,Td=1028,Ed=1029,Do=1030,Rd=1031;var Cd=1033,yu=33776,_u=33777,Mu=33778,bu=33779,Pd=35840,Id=35841,Ld=35842,Dd=35843,Nd=36196,Fd=37492,Od=37496,Ud=37488,kd=37489,Su=37490,Bd=37491,zd=37808,Vd=37809,Gd=37810,Hd=37811,Wd=37812,$d=37813,Xd=37814,Yd=37815,qd=37816,jd=37817,Zd=37818,Kd=37819,Jd=37820,Qd=37821,ep=36492,tp=36494,np=36495,ip=36283,rp=36284,wu=36285,sp=36286;var jc=2300,$h=2301,Nh=2302,Y0=2303,q0=2400,j0=2401,Z0=2402;var rM=3200;var _g=0,sM=1,Xs="",rr="srgb",fa="srgb-linear",Zc="linear",an="srgb";var Fh=7680;var oM=519,aM=512,lM=513,cM=514,op=515,uM=516,fM=517,ap=518,hM=519,Mg=35044;var bg="300 es",kr=2e3,Kc=2001;function $T(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function XT(t){return ArrayBuffer.isView(t)&&!(t instanceof DataView)}function Jc(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function dM(){let t=Jc("canvas");return t.style.display="block",t}var a_={},Sl=null;function Qc(...t){let e="THREE."+t.shift();Sl?Sl("log",e,...t):console.log(e,...t)}function pM(t){let e=t[0];if(typeof e=="string"&&e.startsWith("TSL:")){let n=t[1];n&&n.isStackTrace?t[0]+=" "+n.getLocation():t[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return t}function gt(...t){t=pM(t);let e="THREE."+t.shift();if(Sl)Sl("warn",e,...t);else{let n=t[0];n&&n.isStackTrace?console.warn(n.getError(e)):console.warn(e,...t)}}function _t(...t){t=pM(t);let e="THREE."+t.shift();if(Sl)Sl("error",e,...t);else{let n=t[0];n&&n.isStackTrace?console.error(n.getError(e)):console.error(e,...t)}}function ua(...t){let e=t.join(" ");e in a_||(a_[e]=!0,gt(...t))}function mM(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}var gM={[Oh]:Uh,[kh]:Vh,[Bh]:Gh,[bl]:zh,[Uh]:Oh,[Vh]:kh,[Gh]:Bh,[zh]:bl},ss=class{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});let i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){let i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){let i=this._listeners;if(i===void 0)return;let r=i[e];if(r!==void 0){let s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){let n=this._listeners;if(n===void 0)return;let i=n[e.type];if(i!==void 0){e.target=this;let r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}},xi=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var w0=Math.PI/180,Xh=180/Math.PI;function wo(){let t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(xi[t&255]+xi[t>>8&255]+xi[t>>16&255]+xi[t>>24&255]+"-"+xi[e&255]+xi[e>>8&255]+"-"+xi[e>>16&15|64]+xi[e>>24&255]+"-"+xi[n&63|128]+xi[n>>8&255]+"-"+xi[n>>16&255]+xi[n>>24&255]+xi[i&255]+xi[i>>8&255]+xi[i>>16&255]+xi[i>>24&255]).toLowerCase()}function Xt(t,e,n){return Math.max(e,Math.min(n,t))}function YT(t,e){return(t%e+e)%e}function A0(t,e,n){return(1-n)*t+n*e}function is(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:case Uint8ClampedArray:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function pn(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}var Eg=class Eg{constructor(e=0,n=0){this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Xt(this.x,e.x,n.x),this.y=Xt(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=Xt(this.x,e,n),this.y=Xt(this.y,e,n),this}clampLength(e,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Xt(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(e)/n;return Math.acos(Xt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){let i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Eg.prototype.isVector2=!0;var xt=Eg,Li=class{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],f=i[r+3],h=s[o+0],d=s[o+1],g=s[o+2],x=s[o+3];if(f!==x||l!==h||c!==d||u!==g){let p=l*h+c*d+u*g+f*x;p<0&&(h=-h,d=-d,g=-g,x=-x,p=-p);let m=1-a;if(p<.9995){let _=Math.acos(p),w=Math.sin(_);m=Math.sin(m*_)/w,a=Math.sin(a*_)/w,l=l*m+h*a,c=c*m+d*a,u=u*m+g*a,f=f*m+x*a}else{l=l*m+h*a,c=c*m+d*a,u=u*m+g*a,f=f*m+x*a;let _=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=_,c*=_,u*=_,f*=_}}e[n]=l,e[n+1]=c,e[n+2]=u,e[n+3]=f}static multiplyQuaternionsFlat(e,n,i,r,s,o){let a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],f=s[o],h=s[o+1],d=s[o+2],g=s[o+3];return e[n]=a*g+u*f+l*d-c*h,e[n+1]=l*g+u*h+c*f-a*d,e[n+2]=c*g+u*d+a*h-l*f,e[n+3]=u*g-a*f-l*h-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){let i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),f=a(s/2),h=l(i/2),d=l(r/2),g=l(s/2);switch(o){case"XYZ":this._x=h*u*f+c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f-h*d*g;break;case"YXZ":this._x=h*u*f+c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f+h*d*g;break;case"ZXY":this._x=h*u*f-c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f-h*d*g;break;case"ZYX":this._x=h*u*f-c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f+h*d*g;break;case"YZX":this._x=h*u*f+c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f-h*d*g;break;case"XZY":this._x=h*u*f-c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f+h*d*g;break;default:gt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){let i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){let n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],a=n[5],l=n[9],c=n[2],u=n[6],f=n[10],h=i+a+f;if(h>0){let d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(u-l)*d,this._y=(s-c)*d,this._z=(o-r)*d}else if(i>a&&i>f){let d=2*Math.sqrt(1+i-a-f);this._w=(u-l)/d,this._x=.25*d,this._y=(r+o)/d,this._z=(s+c)/d}else if(a>f){let d=2*Math.sqrt(1+a-i-f);this._w=(s-c)/d,this._x=(r+o)/d,this._y=.25*d,this._z=(l+u)/d}else{let d=2*Math.sqrt(1+f-i-a);this._w=(o-r)/d,this._x=(s+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Xt(this.dot(e),-1,1)))}rotateTowards(e,n){let i=this.angleTo(e);if(i===0)return this;let r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){let i=e._x,r=e._y,s=e._z,o=e._w,a=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){let i=e._x,r=e._y,s=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,r=-r,s=-s,o=-o,a=-a);let l=1-n;if(a<.9995){let c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,n=Math.sin(n*c)/u,this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+o*n,this._onChangeCallback()}else this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+o*n,this.normalize();return this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){let e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},Rg=class Rg{constructor(e=0,n=0,i=0){this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(l_.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(l_.setFromAxisAngle(e,n))}applyMatrix3(e){let n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){let n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*n-s*r),f=2*(s*i-o*n);return this.x=n+l*c+o*f-a*u,this.y=i+l*u+a*c-s*f,this.z=r+l*f+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Xt(this.x,e.x,n.x),this.y=Xt(this.y,e.y,n.y),this.z=Xt(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=Xt(this.x,e,n),this.y=Xt(this.y,e,n),this.z=Xt(this.z,e,n),this}clampLength(e,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Xt(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){let i=e.x,r=e.y,s=e.z,o=n.x,a=n.y,l=n.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){let n=e.lengthSq();if(n===0)return this.set(0,0,0);let i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return T0.copy(this).projectOnVector(e),this.sub(T0)}reflect(e){return this.sub(T0.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;let i=this.dot(e)/n;return Math.acos(Xt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){let r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){let n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){let n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Rg.prototype.isVector3=!0;var C=Rg,T0=new C,l_=new Li,Cg=class Cg{constructor(e,n,i,r,s,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c)}set(e,n,i,r,s,o,a,l,c){let u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=n,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){let i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],f=i[7],h=i[2],d=i[5],g=i[8],x=r[0],p=r[3],m=r[6],_=r[1],w=r[4],v=r[7],M=r[2],S=r[5],E=r[8];return s[0]=o*x+a*_+l*M,s[3]=o*p+a*w+l*S,s[6]=o*m+a*v+l*E,s[1]=c*x+u*_+f*M,s[4]=c*p+u*w+f*S,s[7]=c*m+u*v+f*E,s[2]=h*x+d*_+g*M,s[5]=h*p+d*w+g*S,s[8]=h*m+d*v+g*E,this}multiplyScalar(e){let n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){let e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return n*o*u-n*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){let e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=u*o-a*c,h=a*l-u*s,d=c*s-o*l,g=n*f+i*h+r*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/g;return e[0]=f*x,e[1]=(r*c-u*i)*x,e[2]=(a*i-r*o)*x,e[3]=h*x,e[4]=(u*n-r*l)*x,e[5]=(r*s-a*n)*x,e[6]=d*x,e[7]=(i*l-c*n)*x,e[8]=(o*n-i*s)*x,this}transpose(){let e,n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,a){let l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+n,0,0,1),this}scale(e,n){return ua("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(E0.makeScale(e,n)),this}rotate(e){return ua("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(E0.makeRotation(-e)),this}translate(e,n){return ua("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(E0.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){let n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){let n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){let i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Cg.prototype.isMatrix3=!0;var Pt=Cg,E0=new Pt,c_=new Pt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),u_=new Pt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function qT(){let t={enabled:!0,workingColorSpace:fa,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===an&&(r.r=zs(r.r),r.g=zs(r.g),r.b=zs(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===an&&(r.r=Ml(r.r),r.g=Ml(r.g),r.b=Ml(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Xs?Zc:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return ua("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),t.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return ua("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),t.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[fa]:{primaries:e,whitePoint:i,transfer:Zc,toXYZ:c_,fromXYZ:u_,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:rr},outputColorSpaceConfig:{drawingBufferColorSpace:rr}},[rr]:{primaries:e,whitePoint:i,transfer:an,toXYZ:c_,fromXYZ:u_,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:rr}}}),t}var kt=qT();function zs(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Ml(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}var al,Yh=class{static getDataURL(e,n="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{al===void 0&&(al=Jc("canvas")),al.width=e.width,al.height=e.height;let r=al.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=al}return i.toDataURL(n)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let n=Jc("canvas");n.width=e.width,n.height=e.height;let i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);let r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=zs(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){let n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(zs(n[i]/255)*255):n[i]=zs(n[i]);return{data:n,width:e.width,height:e.height}}else return gt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},jT=0,wl=class{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:jT++}),this.uuid=wo(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?e.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?e.set(n.displayWidth,n.displayHeight,0):n!==null?e.set(n.width,n.height,n.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(R0(r[o].image)):s.push(R0(r[o]))}else s=R0(r);i.url=s}return n||(e.images[this.uuid]=i),i}};function R0(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?Yh.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(gt("Texture: Unable to serialize Texture."),{})}var ZT=0,C0=new C,Di=class t extends ss{constructor(e=t.DEFAULT_IMAGE,n=t.DEFAULT_MAPPING,i=_i,r=_i,s=Wt,o=Io,a=li,l=lr,c=t.DEFAULT_ANISOTROPY,u=Xs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ZT++}),this.uuid=wo(),this.name="",this.source=new wl(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new xt(0,0),this.repeat=new xt(1,1),this.center=new xt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Pt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(C0).x}get height(){return this.source.getSize(C0).y}get depth(){return this.source.getSize(C0).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let n in e){let i=e[n];if(i===void 0){gt(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}let r=this[n];if(r===void 0){gt(`Texture.setValues(): property '${n}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[n]=i}}toJSON(e){let n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==dg)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Hh:e.x=e.x-Math.floor(e.x);break;case _i:e.x=e.x<0?0:1;break;case Wh:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Hh:e.y=e.y-Math.floor(e.y);break;case _i:e.y=e.y<0?0:1;break;case Wh:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}};Di.DEFAULT_IMAGE=null;Di.DEFAULT_MAPPING=dg;Di.DEFAULT_ANISOTROPY=1;var Pg=class Pg{constructor(e=0,n=0,i=0,r=1){this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s,l=e.elements,c=l[0],u=l[4],f=l[8],h=l[1],d=l[5],g=l[9],x=l[2],p=l[6],m=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-x)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+x)<.1&&Math.abs(g+p)<.1&&Math.abs(c+d+m-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;let w=(c+1)/2,v=(d+1)/2,M=(m+1)/2,S=(u+h)/4,E=(f+x)/4,y=(g+p)/4;return w>v&&w>M?w<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(w),r=S/i,s=E/i):v>M?v<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(v),i=S/r,s=y/r):M<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(M),i=E/s,r=y/s),this.set(i,r,s,n),this}let _=Math.sqrt((p-g)*(p-g)+(f-x)*(f-x)+(h-u)*(h-u));return Math.abs(_)<.001&&(_=1),this.x=(p-g)/_,this.y=(f-x)/_,this.z=(h-u)/_,this.w=Math.acos((c+d+m-1)/2),this}setFromMatrixPosition(e){let n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Xt(this.x,e.x,n.x),this.y=Xt(this.y,e.y,n.y),this.z=Xt(this.z,e.z,n.z),this.w=Xt(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=Xt(this.x,e,n),this.y=Xt(this.y,e,n),this.z=Xt(this.z,e,n),this.w=Xt(this.w,e,n),this}clampLength(e,n){let i=this.length();return this.divideScalar(i||1).multiplyScalar(Xt(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Pg.prototype.isVector4=!0;var Yt=Pg,qh=class extends ss{constructor(e=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Wt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},i),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=i.depth,this.scissor=new Yt(0,0,e,n),this.scissorTest=!1,this.viewport=new Yt(0,0,e,n),this.textures=[];let r={width:e,height:n,depth:i.depth},s=new Di(r),o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveColorBuffer=i.resolveColorBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.storeMultisampledColorBuffer=i.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=i.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=i.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview,this.useArrayDepthTexture=i.useArrayDepthTexture}_setTextureOptions(e={}){let n={minFilter:Wt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(n.mapping=e.mapping),e.wrapS!==void 0&&(n.wrapS=e.wrapS),e.wrapT!==void 0&&(n.wrapT=e.wrapT),e.wrapR!==void 0&&(n.wrapR=e.wrapR),e.magFilter!==void 0&&(n.magFilter=e.magFilter),e.minFilter!==void 0&&(n.minFilter=e.minFilter),e.format!==void 0&&(n.format=e.format),e.type!==void 0&&(n.type=e.type),e.anisotropy!==void 0&&(n.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(n.colorSpace=e.colorSpace),e.flipY!==void 0&&(n.flipY=e.flipY),e.generateMipmaps!==void 0&&(n.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(n.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;let r=Object.assign({},e.textures[n].image);this.textures[n].source=new wl(r)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let n=e.depthTexture.clone();n.renderTarget=null,this.depthTexture=n}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},Yn=class extends qh{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}},eu=class extends Di{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=ii,this.minFilter=ii,this.wrapR=_i,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var jh=class extends Di{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=ii,this.minFilter=ii,this.wrapR=_i,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}};var vd=class vd{constructor(e,n,i,r,s,o,a,l,c,u,f,h,d,g,x,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c,u,f,h,d,g,x,p)}set(e,n,i,r,s,o,a,l,c,u,f,h,d,g,x,p){let m=this.elements;return m[0]=e,m[4]=n,m[8]=i,m[12]=r,m[1]=s,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=u,m[10]=f,m[14]=h,m[3]=d,m[7]=g,m[11]=x,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new vd().fromArray(this.elements)}copy(e){let n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){let n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){let n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return this.determinantAffine()===0?(e.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let n=this.elements,i=e.elements,r=1/ll.setFromMatrixColumn(e,0).length(),s=1/ll.setFromMatrixColumn(e,1).length(),o=1/ll.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){let n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){let h=o*u,d=o*f,g=a*u,x=a*f;n[0]=l*u,n[4]=-l*f,n[8]=c,n[1]=d+g*c,n[5]=h-x*c,n[9]=-a*l,n[2]=x-h*c,n[6]=g+d*c,n[10]=o*l}else if(e.order==="YXZ"){let h=l*u,d=l*f,g=c*u,x=c*f;n[0]=h+x*a,n[4]=g*a-d,n[8]=o*c,n[1]=o*f,n[5]=o*u,n[9]=-a,n[2]=d*a-g,n[6]=x+h*a,n[10]=o*l}else if(e.order==="ZXY"){let h=l*u,d=l*f,g=c*u,x=c*f;n[0]=h-x*a,n[4]=-o*f,n[8]=g+d*a,n[1]=d+g*a,n[5]=o*u,n[9]=x-h*a,n[2]=-o*c,n[6]=a,n[10]=o*l}else if(e.order==="ZYX"){let h=o*u,d=o*f,g=a*u,x=a*f;n[0]=l*u,n[4]=g*c-d,n[8]=h*c+x,n[1]=l*f,n[5]=x*c+h,n[9]=d*c-g,n[2]=-c,n[6]=a*l,n[10]=o*l}else if(e.order==="YZX"){let h=o*l,d=o*c,g=a*l,x=a*c;n[0]=l*u,n[4]=x-h*f,n[8]=g*f+d,n[1]=f,n[5]=o*u,n[9]=-a*u,n[2]=-c*u,n[6]=d*f+g,n[10]=h-x*f}else if(e.order==="XZY"){let h=o*l,d=o*c,g=a*l,x=a*c;n[0]=l*u,n[4]=-f,n[8]=c*u,n[1]=h*f+x,n[5]=o*u,n[9]=d*f-g,n[2]=g*f-d,n[6]=a*u,n[10]=x*f+h}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(KT,e,JT)}lookAt(e,n,i){let r=this.elements;return nr.subVectors(e,n),nr.lengthSq()===0&&(nr.z=1),nr.normalize(),vo.crossVectors(i,nr),vo.lengthSq()===0&&(Math.abs(i.z)===1?nr.x+=1e-4:nr.z+=1e-4,nr.normalize(),vo.crossVectors(i,nr)),vo.normalize(),uh.crossVectors(nr,vo),r[0]=vo.x,r[4]=uh.x,r[8]=nr.x,r[1]=vo.y,r[5]=uh.y,r[9]=nr.y,r[2]=vo.z,r[6]=uh.z,r[10]=nr.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){let i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],f=i[5],h=i[9],d=i[13],g=i[2],x=i[6],p=i[10],m=i[14],_=i[3],w=i[7],v=i[11],M=i[15],S=r[0],E=r[4],y=r[8],A=r[12],T=r[1],I=r[5],F=r[9],z=r[13],L=r[2],V=r[6],G=r[10],P=r[14],O=r[3],k=r[7],$=r[11],j=r[15];return s[0]=o*S+a*T+l*L+c*O,s[4]=o*E+a*I+l*V+c*k,s[8]=o*y+a*F+l*G+c*$,s[12]=o*A+a*z+l*P+c*j,s[1]=u*S+f*T+h*L+d*O,s[5]=u*E+f*I+h*V+d*k,s[9]=u*y+f*F+h*G+d*$,s[13]=u*A+f*z+h*P+d*j,s[2]=g*S+x*T+p*L+m*O,s[6]=g*E+x*I+p*V+m*k,s[10]=g*y+x*F+p*G+m*$,s[14]=g*A+x*z+p*P+m*j,s[3]=_*S+w*T+v*L+M*O,s[7]=_*E+w*I+v*V+M*k,s[11]=_*y+w*F+v*G+M*$,s[15]=_*A+w*z+v*P+M*j,this}multiplyScalar(e){let n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){let e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],f=e[6],h=e[10],d=e[14],g=e[3],x=e[7],p=e[11],m=e[15],_=l*d-c*h,w=a*d-c*f,v=a*h-l*f,M=o*d-c*u,S=o*h-l*u,E=o*f-a*u;return n*(x*_-p*w+m*v)-i*(g*_-p*M+m*S)+r*(g*w-x*M+m*E)-s*(g*v-x*S+p*E)}determinantAffine(){let e=this.elements,n=e[0],i=e[4],r=e[8],s=e[1],o=e[5],a=e[9],l=e[2],c=e[6],u=e[10];return n*(o*u-a*c)-i*(s*u-a*l)+r*(s*c-o*l)}transpose(){let e=this.elements,n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){let r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){let e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=e[9],h=e[10],d=e[11],g=e[12],x=e[13],p=e[14],m=e[15],_=n*a-i*o,w=n*l-r*o,v=n*c-s*o,M=i*l-r*a,S=i*c-s*a,E=r*c-s*l,y=u*x-f*g,A=u*p-h*g,T=u*m-d*g,I=f*p-h*x,F=f*m-d*x,z=h*m-d*p,L=_*z-w*F+v*I+M*T-S*A+E*y;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let V=1/L;return e[0]=(a*z-l*F+c*I)*V,e[1]=(r*F-i*z-s*I)*V,e[2]=(x*E-p*S+m*M)*V,e[3]=(h*S-f*E-d*M)*V,e[4]=(l*T-o*z-c*A)*V,e[5]=(n*z-r*T+s*A)*V,e[6]=(p*v-g*E-m*w)*V,e[7]=(u*E-h*v+d*w)*V,e[8]=(o*F-a*T+c*y)*V,e[9]=(i*T-n*F-s*y)*V,e[10]=(g*S-x*v+m*_)*V,e[11]=(f*v-u*S-d*_)*V,e[12]=(a*A-o*I-l*y)*V,e[13]=(n*I-i*A+r*y)*V,e[14]=(x*w-g*M-p*_)*V,e[15]=(u*M-f*w+h*_)*V,this}scale(e){let n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){let n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){let n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){let n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){let i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){let r=this.elements,s=n._x,o=n._y,a=n._z,l=n._w,c=s+s,u=o+o,f=a+a,h=s*c,d=s*u,g=s*f,x=o*u,p=o*f,m=a*f,_=l*c,w=l*u,v=l*f,M=i.x,S=i.y,E=i.z;return r[0]=(1-(x+m))*M,r[1]=(d+v)*M,r[2]=(g-w)*M,r[3]=0,r[4]=(d-v)*S,r[5]=(1-(h+m))*S,r[6]=(p+_)*S,r[7]=0,r[8]=(g+w)*E,r[9]=(p-_)*E,r[10]=(1-(h+x))*E,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){let r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];let s=this.determinantAffine();if(s===0)return i.set(1,1,1),n.identity(),this;let o=ll.set(r[0],r[1],r[2]).length(),a=ll.set(r[4],r[5],r[6]).length(),l=ll.set(r[8],r[9],r[10]).length();s<0&&(o=-o),Nr.copy(this);let c=1/o,u=1/a,f=1/l;return Nr.elements[0]*=c,Nr.elements[1]*=c,Nr.elements[2]*=c,Nr.elements[4]*=u,Nr.elements[5]*=u,Nr.elements[6]*=u,Nr.elements[8]*=f,Nr.elements[9]*=f,Nr.elements[10]*=f,n.setFromRotationMatrix(Nr),i.x=o,i.y=a,i.z=l,this}makePerspective(e,n,i,r,s,o,a=kr,l=!1){let c=this.elements,u=2*s/(n-e),f=2*s/(i-r),h=(n+e)/(n-e),d=(i+r)/(i-r),g,x;if(l)g=s/(o-s),x=o*s/(o-s);else if(a===kr)g=-(o+s)/(o-s),x=-2*o*s/(o-s);else if(a===Kc)g=-o/(o-s),x=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,n,i,r,s,o,a=kr,l=!1){let c=this.elements,u=2/(n-e),f=2/(i-r),h=-(n+e)/(n-e),d=-(i+r)/(i-r),g,x;if(l)g=1/(o-s),x=o/(o-s);else if(a===kr)g=-2/(o-s),x=-(o+s)/(o-s);else if(a===Kc)g=-1/(o-s),x=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){let n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){let i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}};vd.prototype.isMatrix4=!0;var Ct=vd,ll=new C,Nr=new Ct,KT=new C(0,0,0),JT=new C(1,1,1),vo=new C,uh=new C,nr=new C,f_=new Ct,h_=new Li,Ao=class t{constructor(e=0,n=0,i=0,r=t.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){let r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],f=r[2],h=r[6],d=r[10];switch(n){case"XYZ":this._y=Math.asin(Xt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Xt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(Xt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-Xt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Xt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(a,d));break;case"XZY":this._z=Math.asin(-Xt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,d),this._y=0);break;default:gt("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return f_.makeRotationFromQuaternion(e),this.setFromRotationMatrix(f_,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return h_.setFromEuler(this),this.setFromQuaternion(h_,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Ao.DEFAULT_ORDER="XYZ";var Al=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},QT=0,d_=new C,cl=new Li,Fs=new Ct,fh=new C,Gc=new C,eE=new C,tE=new Li,p_=new C(1,0,0),m_=new C(0,1,0),g_=new C(0,0,1),x_={type:"added"},nE={type:"removed"},ul={type:"childadded",child:null},P0={type:"childremoved",child:null},Hi=class t extends ss{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:QT++}),this.uuid=wo(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=t.DEFAULT_UP.clone();let e=new C,n=new Ao,i=new Li,r=new C(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Ct},normalMatrix:{value:new Pt}}),this.matrix=new Ct,this.matrixWorld=new Ct,this.matrixAutoUpdate=t.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Al,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return cl.setFromAxisAngle(e,n),this.quaternion.multiply(cl),this}rotateOnWorldAxis(e,n){return cl.setFromAxisAngle(e,n),this.quaternion.premultiply(cl),this}rotateX(e){return this.rotateOnAxis(p_,e)}rotateY(e){return this.rotateOnAxis(m_,e)}rotateZ(e){return this.rotateOnAxis(g_,e)}translateOnAxis(e,n){return d_.copy(e).applyQuaternion(this.quaternion),this.position.add(d_.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(p_,e)}translateY(e){return this.translateOnAxis(m_,e)}translateZ(e){return this.translateOnAxis(g_,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Fs.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?fh.copy(e):fh.set(e,n,i);let r=this.parent;this.updateWorldMatrix(!0,!1),Gc.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Fs.lookAt(Gc,fh,this.up):Fs.lookAt(fh,Gc,this.up),this.quaternion.setFromRotationMatrix(Fs),r&&(Fs.extractRotation(r.matrixWorld),cl.setFromRotationMatrix(Fs),this.quaternion.premultiply(cl.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(_t("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(x_),ul.child=e,this.dispatchEvent(ul),ul.child=null):_t("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(nE),P0.child=e,this.dispatchEvent(P0),P0.child=null),this}removeFromParent(){let e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Fs.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Fs.multiply(e.parent.matrixWorld)),e.applyMatrix4(Fs),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(x_),ul.child=e,this.dispatchEvent(ul),ul.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){let o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);let r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gc,e,eE),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Gc,tE,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);let n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){let n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let n=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=n-s[0]*n-s[4]*i-s[8]*r,s[13]+=i-s[1]*n-s[5]*i-s[9]*r,s[14]+=r-s[2]*n-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);let n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n,i=!1){let r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||i)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,i=!0),n===!0){let s=this.children;for(let o=0,a=s.length;o<a;o++)s[o].updateWorldMatrix(!1,!0,i)}}toJSON(e){let n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,r.name=this.name,r.castShadow=this.castShadow,r.receiveShadow=this.receiveShadow,r.visible=this.visible,r.frustumCulled=this.frustumCulled,r.renderOrder=this.renderOrder,r.static=this.static,r.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){let f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){let l=this.animations[a];r.animations.push(s(e.animations,l))}}if(n){let a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),f=o(e.shapes),h=o(e.skeletons),d=o(e.animations),g=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),h.length>0&&(i.skeletons=h),d.length>0&&(i.animations=d),g.length>0&&(i.nodes=g)}return i.object=r,i;function o(a){let l=[];for(let c in a){let u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){let r=e.children[i];this.add(r.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Hi.DEFAULT_UP=new C(0,1,0);Hi.DEFAULT_MATRIX_AUTO_UPDATE=!0;Hi.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var mn=class extends Hi{constructor(){super(),this.isGroup=!0,this.type="Group"}},iE={type:"move"},Tl=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new mn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new mn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new mn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let n=this._hand;if(n)for(let i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null,a=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(let x of e.hand.values()){let p=n.getJointPose(x,i),m=this._getHandJoint(c,x);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}let u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),d=.02,g=.005;c.inputState.pinching&&h>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&h<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(iE)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){let i=new mn;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}},xM={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},yo={h:0,s:0,l:0},hh={h:0,s:0,l:0};function I0(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}var Gt=class{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){let r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=rr){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,kt.colorSpaceToWorking(this,n),this}setRGB(e,n,i,r=kt.workingColorSpace){return this.r=e,this.g=n,this.b=i,kt.colorSpaceToWorking(this,r),this}setHSL(e,n,i,r=kt.workingColorSpace){if(e=YT(e,1),n=Xt(n,0,1),i=Xt(i,0,1),n===0)this.r=this.g=this.b=i;else{let s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=I0(o,s,e+1/3),this.g=I0(o,s,e),this.b=I0(o,s,e-1/3)}return kt.colorSpaceToWorking(this,r),this}setStyle(e,n=rr){function i(s){s!==void 0&&parseFloat(s)<1&&gt("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:gt("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);gt("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=rr){let i=xM[e.toLowerCase()];return i!==void 0?this.setHex(i,n):gt("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=zs(e.r),this.g=zs(e.g),this.b=zs(e.b),this}copyLinearToSRGB(e){return this.r=Ml(e.r),this.g=Ml(e.g),this.b=Ml(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=rr){return kt.workingToColorSpace(vi.copy(this),e),Math.round(Xt(vi.r*255,0,255))*65536+Math.round(Xt(vi.g*255,0,255))*256+Math.round(Xt(vi.b*255,0,255))}getHexString(e=rr){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=kt.workingColorSpace){kt.workingToColorSpace(vi.copy(this),n);let i=vi.r,r=vi.g,s=vi.b,o=Math.max(i,r,s),a=Math.min(i,r,s),l,c,u=(a+o)/2;if(a===o)l=0,c=0;else{let f=o-a;switch(c=u<=.5?f/(o+a):f/(2-o-a),o){case i:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-i)/f+2;break;case s:l=(i-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,n=kt.workingColorSpace){return kt.workingToColorSpace(vi.copy(this),n),e.r=vi.r,e.g=vi.g,e.b=vi.b,e}getStyle(e=rr){kt.workingToColorSpace(vi.copy(this),e);let n=vi.r,i=vi.g,r=vi.b;return e!==rr?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(yo),this.setHSL(yo.h+e,yo.s+n,yo.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(yo),e.getHSL(hh);let i=A0(yo.h,hh.h,n),r=A0(yo.s,hh.s,n),s=A0(yo.l,hh.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},vi=new Gt;Gt.NAMES=xM;var Vs=class extends Hi{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ao,this.environmentIntensity=1,this.environmentRotation=new Ao,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),n.object.backgroundBlurriness=this.backgroundBlurriness,n.object.backgroundIntensity=this.backgroundIntensity,n.object.backgroundRotation=this.backgroundRotation.toArray(),n.object.environmentIntensity=this.environmentIntensity,n.object.environmentRotation=this.environmentRotation.toArray(),n}},Fr=new C,Os=new C,L0=new C,Us=new C,fl=new C,hl=new C,v_=new C,D0=new C,N0=new C,F0=new C,O0=new Yt,U0=new Yt,k0=new Yt,So=class t{constructor(e=new C,n=new C,i=new C){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),Fr.subVectors(e,n),r.cross(Fr);let s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){Fr.subVectors(r,n),Os.subVectors(i,n),L0.subVectors(e,n);let o=Fr.dot(Fr),a=Fr.dot(Os),l=Fr.dot(L0),c=Os.dot(Os),u=Os.dot(L0),f=o*c-a*a;if(f===0)return s.set(0,0,0),null;let h=1/f,d=(c*l-a*u)*h,g=(o*u-a*l)*h;return s.set(1-d-g,g,d)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,Us)===null?!1:Us.x>=0&&Us.y>=0&&Us.x+Us.y<=1}static getInterpolation(e,n,i,r,s,o,a,l){return this.getBarycoord(e,n,i,r,Us)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Us.x),l.addScaledVector(o,Us.y),l.addScaledVector(a,Us.z),l)}static getInterpolatedAttribute(e,n,i,r,s,o){return O0.setScalar(0),U0.setScalar(0),k0.setScalar(0),O0.fromBufferAttribute(e,n),U0.fromBufferAttribute(e,i),k0.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(O0,s.x),o.addScaledVector(U0,s.y),o.addScaledVector(k0,s.z),o}static isFrontFacing(e,n,i,r){return Fr.subVectors(i,n),Os.subVectors(e,n),Fr.cross(Os).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Fr.subVectors(this.c,this.b),Os.subVectors(this.a,this.b),Fr.cross(Os).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return t.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return t.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return t.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return t.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return t.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){let i=this.a,r=this.b,s=this.c,o,a;fl.subVectors(r,i),hl.subVectors(s,i),D0.subVectors(e,i);let l=fl.dot(D0),c=hl.dot(D0);if(l<=0&&c<=0)return n.copy(i);N0.subVectors(e,r);let u=fl.dot(N0),f=hl.dot(N0);if(u>=0&&f<=u)return n.copy(r);let h=l*f-u*c;if(h<=0&&l>=0&&u<=0)return o=l/(l-u),n.copy(i).addScaledVector(fl,o);F0.subVectors(e,s);let d=fl.dot(F0),g=hl.dot(F0);if(g>=0&&d<=g)return n.copy(s);let x=d*c-l*g;if(x<=0&&c>=0&&g<=0)return a=c/(c-g),n.copy(i).addScaledVector(hl,a);let p=u*g-d*f;if(p<=0&&f-u>=0&&d-g>=0)return v_.subVectors(s,r),a=(f-u)/(f-u+(d-g)),n.copy(r).addScaledVector(v_,a);let m=1/(p+x+h);return o=x*m,a=h*m,n.copy(i).addScaledVector(fl,o).addScaledVector(hl,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},os=class{constructor(e=new C(1/0,1/0,1/0),n=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(Or.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(Or.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){let i=Or.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);let i=e.geometry;if(i!==void 0){let s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Or):Or.fromBufferAttribute(s,o),Or.applyMatrix4(e.matrixWorld),this.expandByPoint(Or);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),dh.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),dh.copy(i.boundingBox)),dh.applyMatrix4(e.matrixWorld),this.union(dh)}let r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Or),Or.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Hc),ph.subVectors(this.max,Hc),dl.subVectors(e.a,Hc),pl.subVectors(e.b,Hc),ml.subVectors(e.c,Hc),_o.subVectors(pl,dl),Mo.subVectors(ml,pl),oa.subVectors(dl,ml);let n=[0,-_o.z,_o.y,0,-Mo.z,Mo.y,0,-oa.z,oa.y,_o.z,0,-_o.x,Mo.z,0,-Mo.x,oa.z,0,-oa.x,-_o.y,_o.x,0,-Mo.y,Mo.x,0,-oa.y,oa.x,0];return!B0(n,dl,pl,ml,ph)||(n=[1,0,0,0,1,0,0,0,1],!B0(n,dl,pl,ml,ph))?!1:(mh.crossVectors(_o,Mo),n=[mh.x,mh.y,mh.z],B0(n,dl,pl,ml,ph))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Or).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Or).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ks[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ks[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ks[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ks[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ks[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ks[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ks[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ks[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ks),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},ks=[new C,new C,new C,new C,new C,new C,new C,new C],Or=new C,dh=new os,dl=new C,pl=new C,ml=new C,_o=new C,Mo=new C,oa=new C,Hc=new C,ph=new C,mh=new C,aa=new C;function B0(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){aa.fromArray(t,s);let a=r.x*Math.abs(aa.x)+r.y*Math.abs(aa.y)+r.z*Math.abs(aa.z),l=e.dot(aa),c=n.dot(aa),u=i.dot(aa);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}var Xn=new C,gh=new xt,rE=0,Zt=class extends ss{constructor(e,n,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:rE++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=Mg,this.updateRanges=[],this.gpuType=_r,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)gh.fromBufferAttribute(this,n),gh.applyMatrix3(e),this.setXY(n,gh.x,gh.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Xn.fromBufferAttribute(this,n),Xn.applyMatrix3(e),this.setXYZ(n,Xn.x,Xn.y,Xn.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Xn.fromBufferAttribute(this,n),Xn.applyMatrix4(e),this.setXYZ(n,Xn.x,Xn.y,Xn.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Xn.fromBufferAttribute(this,n),Xn.applyNormalMatrix(e),this.setXYZ(n,Xn.x,Xn.y,Xn.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Xn.fromBufferAttribute(this,n),Xn.transformDirection(e),this.setXYZ(n,Xn.x,Xn.y,Xn.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=is(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=pn(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=is(n,this.array)),n}setX(e,n){return this.normalized&&(n=pn(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=is(n,this.array)),n}setY(e,n){return this.normalized&&(n=pn(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=is(n,this.array)),n}setZ(e,n){return this.normalized&&(n=pn(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=is(n,this.array)),n}setW(e,n){return this.normalized&&(n=pn(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=pn(n,this.array),i=pn(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=pn(n,this.array),i=pn(i,this.array),r=pn(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=pn(n,this.array),i=pn(i,this.array),r=pn(r,this.array),s=pn(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}};var tu=class extends Zt{constructor(e,n,i){super(new Uint16Array(e),n,i)}};var nu=class extends Zt{constructor(e,n,i){super(new Uint32Array(e),n,i)}};var fn=class extends Zt{constructor(e,n,i){super(new Float32Array(e),n,i)}},sE=new os,Wc=new C,z0=new C,as=class{constructor(e=new C,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){let i=this.center;n!==void 0?i.copy(n):sE.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){let i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Wc.subVectors(e,this.center);let n=Wc.lengthSq();if(n>this.radius*this.radius){let i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(Wc,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(z0.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Wc.copy(e.center).add(z0)),this.expandByPoint(Wc.copy(e.center).sub(z0))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},oE=0,yr=new Ct,V0=new Hi,gl=new C,ir=new os,$c=new os,ni=new C,Dn=class t extends ss{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:oE++}),this.uuid=wo(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new($T(e)?nu:tu)(e,1):this.index=e,this}setIndirect(e,n=0){return this.indirect=e,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){let n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);let i=this.attributes.normal;if(i!==void 0){let s=new Pt().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}let r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return yr.makeRotationFromQuaternion(e),this.applyMatrix4(yr),this}rotateX(e){return yr.makeRotationX(e),this.applyMatrix4(yr),this}rotateY(e){return yr.makeRotationY(e),this.applyMatrix4(yr),this}rotateZ(e){return yr.makeRotationZ(e),this.applyMatrix4(yr),this}translate(e,n,i){return yr.makeTranslation(e,n,i),this.applyMatrix4(yr),this}scale(e,n,i){return yr.makeScale(e,n,i),this.applyMatrix4(yr),this}lookAt(e){return V0.lookAt(e),V0.updateMatrix(),this.applyMatrix4(V0.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(gl).negate(),this.translate(gl.x,gl.y,gl.z),this}setFromPoints(e){let n=this.getAttribute("position");if(n===void 0){let i=[];for(let r=0,s=e.length;r<s;r++){let o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new fn(i,3))}else{let i=Math.min(e.length,n.count);for(let r=0;r<i;r++){let s=e[r];n.setXYZ(r,s.x,s.y,s.z||0)}e.length>n.count&&gt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new os);let e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){_t("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){let s=n[i];ir.setFromBufferAttribute(s),this.morphTargetsRelative?(ni.addVectors(this.boundingBox.min,ir.min),this.boundingBox.expandByPoint(ni),ni.addVectors(this.boundingBox.max,ir.max),this.boundingBox.expandByPoint(ni)):(this.boundingBox.expandByPoint(ir.min),this.boundingBox.expandByPoint(ir.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&_t('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new as);let e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){_t("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(e){let i=this.boundingSphere.center;if(ir.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){let a=n[s];$c.setFromBufferAttribute(a),this.morphTargetsRelative?(ni.addVectors(ir.min,$c.min),ir.expandByPoint(ni),ni.addVectors(ir.max,$c.max),ir.expandByPoint(ni)):(ir.expandByPoint($c.min),ir.expandByPoint($c.max))}ir.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)ni.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(ni));if(n)for(let s=0,o=n.length;s<o;s++){let a=n[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)ni.fromBufferAttribute(a,c),l&&(gl.fromBufferAttribute(e,c),ni.add(gl)),r=Math.max(r,i.distanceToSquared(ni))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&_t('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){_t("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let i=n.position,r=n.normal,s=n.uv,o=this.getAttribute("tangent");(o===void 0||o.count!==i.count)&&(o=new Zt(new Float32Array(4*i.count),4),this.setAttribute("tangent",o));let a=[],l=[];for(let y=0;y<i.count;y++)a[y]=new C,l[y]=new C;let c=new C,u=new C,f=new C,h=new xt,d=new xt,g=new xt,x=new C,p=new C;function m(y,A,T){c.fromBufferAttribute(i,y),u.fromBufferAttribute(i,A),f.fromBufferAttribute(i,T),h.fromBufferAttribute(s,y),d.fromBufferAttribute(s,A),g.fromBufferAttribute(s,T),u.sub(c),f.sub(c),d.sub(h),g.sub(h);let I=1/(d.x*g.y-g.x*d.y);isFinite(I)&&(x.copy(u).multiplyScalar(g.y).addScaledVector(f,-d.y).multiplyScalar(I),p.copy(f).multiplyScalar(d.x).addScaledVector(u,-g.x).multiplyScalar(I),a[y].add(x),a[A].add(x),a[T].add(x),l[y].add(p),l[A].add(p),l[T].add(p))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let y=0,A=_.length;y<A;++y){let T=_[y],I=T.start,F=T.count;for(let z=I,L=I+F;z<L;z+=3)m(e.getX(z+0),e.getX(z+1),e.getX(z+2))}let w=new C,v=new C,M=new C,S=new C;function E(y){M.fromBufferAttribute(r,y),S.copy(M);let A=a[y];w.copy(A),w.sub(M.multiplyScalar(M.dot(A))).normalize(),v.crossVectors(S,A);let I=v.dot(l[y])<0?-1:1;o.setXYZW(y,w.x,w.y,w.z,I)}for(let y=0,A=_.length;y<A;++y){let T=_[y],I=T.start,F=T.count;for(let z=I,L=I+F;z<L;z+=3)E(e.getX(z+0)),E(e.getX(z+1)),E(e.getX(z+2))}this._transformed=!0}computeVertexNormals(){let e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0||i.count!==n.count)i=new Zt(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let h=0,d=i.count;h<d;h++)i.setXYZ(h,0,0,0);let r=new C,s=new C,o=new C,a=new C,l=new C,c=new C,u=new C,f=new C;if(e)for(let h=0,d=e.count;h<d;h+=3){let g=e.getX(h+0),x=e.getX(h+1),p=e.getX(h+2);r.fromBufferAttribute(n,g),s.fromBufferAttribute(n,x),o.fromBufferAttribute(n,p),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),a.fromBufferAttribute(i,g),l.fromBufferAttribute(i,x),c.fromBufferAttribute(i,p),a.add(u),l.add(u),c.add(u),i.setXYZ(g,a.x,a.y,a.z),i.setXYZ(x,l.x,l.y,l.z),i.setXYZ(p,c.x,c.y,c.z)}else for(let h=0,d=n.count;h<d;h+=3)r.fromBufferAttribute(n,h+0),s.fromBufferAttribute(n,h+1),o.fromBufferAttribute(n,h+2),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),i.setXYZ(h+0,u.x,u.y,u.z),i.setXYZ(h+1,u.x,u.y,u.z),i.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)ni.fromBufferAttribute(e,n),ni.normalize(),e.setXYZ(n,ni.x,ni.y,ni.z)}toNonIndexed(){function e(a,l){let c=a.array,u=a.itemSize,f=a.normalized,h=new c.constructor(l.length*u),d=0,g=0;for(let x=0,p=l.length;x<p;x++){a.isInterleavedBufferAttribute?d=l[x]*a.data.stride+a.offset:d=l[x]*u;for(let m=0;m<u;m++)h[g++]=c[d++]}return new Zt(h,u,f)}if(this.index===null)return gt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let n=new t,i=this.index.array,r=this.attributes;for(let a in r){let l=r[a],c=e(l,i);n.setAttribute(a,c)}let s=this.morphAttributes;for(let a in s){let l=[],c=s[a];for(let u=0,f=c.length;u<f;u++){let h=c[u],d=e(h,i);l.push(d)}n.morphAttributes[a]=l}n.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let a=0,l=o.length;a<l;a++){let c=o[a];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};let n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});let i=this.attributes;for(let l in i){let c=i[l];e.data.attributes[l]=c.toJSON(e.data)}let r={},s=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){let d=c[f];u.push(d.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let n={};this.name=e.name;let i=e.index;i!==null&&this.setIndex(i.clone());let r=e.attributes;for(let c in r){let u=r[c];this.setAttribute(c,u.clone(n))}let s=e.morphAttributes;for(let c in s){let u=[],f=s[c];for(let h=0,d=f.length;h<d;h++)u.push(f[h].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let c=0,u=o.length;c<u;c++){let f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}let a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());let l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}},Zh=class{constructor(e,n){this.isInterleavedBuffer=!0,this.array=e,this.stride=n,this.count=e!==void 0?e.length/n:0,this.usage=Mg,this.updateRanges=[],this.version=0,this.uuid=wo()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,n,i){e*=this.stride,i*=n.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=n.array[i+r];return this}set(e,n=0){return this.array.set(e,n),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=wo()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let n=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(n,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=wo()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));let n={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return n.usage=this.usage,n}},Ii=new C,El=class t{constructor(e,n,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=n,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let n=0,i=this.data.count;n<i;n++)Ii.fromBufferAttribute(this,n),Ii.applyMatrix4(e),this.setXYZ(n,Ii.x,Ii.y,Ii.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Ii.fromBufferAttribute(this,n),Ii.applyNormalMatrix(e),this.setXYZ(n,Ii.x,Ii.y,Ii.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Ii.fromBufferAttribute(this,n),Ii.transformDirection(e),this.setXYZ(n,Ii.x,Ii.y,Ii.z);return this}getComponent(e,n){let i=this.array[e*this.data.stride+this.offset+n];return this.normalized&&(i=is(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=pn(i,this.array)),this.data.array[e*this.data.stride+this.offset+n]=i,this}setX(e,n){return this.normalized&&(n=pn(n,this.array)),this.data.array[e*this.data.stride+this.offset]=n,this}setY(e,n){return this.normalized&&(n=pn(n,this.array)),this.data.array[e*this.data.stride+this.offset+1]=n,this}setZ(e,n){return this.normalized&&(n=pn(n,this.array)),this.data.array[e*this.data.stride+this.offset+2]=n,this}setW(e,n){return this.normalized&&(n=pn(n,this.array)),this.data.array[e*this.data.stride+this.offset+3]=n,this}getX(e){let n=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(n=is(n,this.array)),n}getY(e){let n=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(n=is(n,this.array)),n}getZ(e){let n=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(n=is(n,this.array)),n}getW(e){let n=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(n=is(n,this.array)),n}setXY(e,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(n=pn(n,this.array),i=pn(i,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this}setXYZ(e,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(n=pn(n,this.array),i=pn(i,this.array),r=pn(r,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(n=pn(n,this.array),i=pn(i,this.array),r=pn(r,this.array),s=pn(s,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Qc("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let n=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return new Zt(new this.array.constructor(n),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new t(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Qc("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let n=[];for(let i=0;i<this.count;i++){let r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:n,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},G0=new C,aE=new C,lE=new Pt,Ur=class{constructor(e=new C(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){let r=G0.subVectors(i,n).cross(aE.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n,i=!0){let r=e.delta(G0),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;let o=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(o<0||o>1)?null:n.copy(e.start).addScaledVector(r,o)}intersectsLine(e){let n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){let i=n||lE.getNormalMatrix(e),r=this.coplanarPoint(G0).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}},cE=0,Gs=class extends ss{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:cE++}),this.uuid=wo(),this.name="",this.type="Material",this.blending=or,this.side=us,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=rg,this.blendDst=Il,this.blendEquation=$s,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Gt(0,0,0),this.blendAlpha=0,this.depthFunc=bl,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=oM,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Fh,this.stencilZFail=Fh,this.stencilZPass=Fh,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let n in e){let i=e[n];if(i===void 0){gt(`Material: parameter '${n}' has value of undefined.`);continue}let r=this[n];if(r===void 0){gt(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector2&&i&&i.isVector2||r&&r.isEuler&&i&&i.isEuler||r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){let n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});let i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,i.blending=this.blending,i.side=this.side,i.shadowSide=this.shadowSide,i.vertexColors=this.vertexColors,i.opacity=this.opacity,i.transparent=this.transparent,i.blendSrc=this.blendSrc,i.blendDst=this.blendDst,i.blendEquation=this.blendEquation,i.blendSrcAlpha=this.blendSrcAlpha,i.blendDstAlpha=this.blendDstAlpha,i.blendEquationAlpha=this.blendEquationAlpha,i.blendColor=this.blendColor.getHex(),i.blendAlpha=this.blendAlpha,i.depthFunc=this.depthFunc,i.depthTest=this.depthTest,i.depthWrite=this.depthWrite,i.colorWrite=this.colorWrite,i.clipIntersection=this.clipIntersection,i.clipShadows=this.clipShadows,i.stencilWriteMask=this.stencilWriteMask,i.stencilFunc=this.stencilFunc,i.stencilRef=this.stencilRef,i.stencilFuncMask=this.stencilFuncMask,i.stencilFail=this.stencilFail,i.stencilZFail=this.stencilZFail,i.stencilZPass=this.stencilZPass,i.stencilWrite=this.stencilWrite,i.polygonOffset=this.polygonOffset,i.polygonOffsetFactor=this.polygonOffsetFactor,i.polygonOffsetUnits=this.polygonOffsetUnits,i.dithering=this.dithering,i.alphaTest=this.alphaTest,i.alphaHash=this.alphaHash,i.alphaToCoverage=this.alphaToCoverage,i.premultipliedAlpha=this.premultipliedAlpha,i.forceSinglePass=this.forceSinglePass,i.allowOverride=this.allowOverride,i.visible=this.visible,i.toneMapped=this.toneMapped,i.name=this.name,this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(i.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(i.clippingPlanes=this.clippingPlanes.map(s=>s.toJSON())),this.rotation!==void 0&&(i.rotation=this.rotation),this.depthPacking!==void 0&&(i.depthPacking=this.depthPacking),this.linewidth!==void 0&&(i.linewidth=this.linewidth),this.linecap!==void 0&&(i.linecap=this.linecap),this.linejoin!==void 0&&(i.linejoin=this.linejoin),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.wireframe!==void 0&&(i.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(i.flatShading=this.flatShading),this.fog!==void 0&&(i.fog=this.fog),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){let o=[];for(let a in s){let l=s[a];delete l.metadata,o.push(l)}return o}if(n){let s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}fromJSON(e,n){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Gt().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(i=>new Ur().fromJSON(i))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=n[e.map]||null),e.matcap!==void 0&&(this.matcap=n[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=n[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=n[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=n[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let i=e.normalScale;Array.isArray(i)===!1&&(i=[i,i]),this.normalScale=new xt().fromArray(i)}return e.displacementMap!==void 0&&(this.displacementMap=n[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=n[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=n[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=n[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=n[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=n[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=n[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=n[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=n[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=n[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=n[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=n[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=n[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=n[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new xt().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=n[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=n[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=n[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=n[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=n[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=n[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=n[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let n=e.clippingPlanes,i=null;if(n!==null){let r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}};var Bs=new C,H0=new C,xh=new C,vh=new C,Hs=class{constructor(e=new C,n=new C(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Bs)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);let i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let n=Bs.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Bs.copy(this.origin).addScaledVector(this.direction,n),Bs.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){H0.copy(e).add(n).multiplyScalar(.5),xh.copy(n).sub(e).normalize(),vh.copy(this.origin).sub(H0);let s=e.distanceTo(n)*.5,o=-this.direction.dot(xh),a=vh.dot(this.direction),l=-vh.dot(xh),c=vh.lengthSq(),u=Math.abs(1-o*o),f,h,d,g;if(u>0)if(f=o*l-a,h=o*a-l,g=s*u,f>=0)if(h>=-g)if(h<=g){let x=1/u;f*=x,h*=x,d=f*(f+o*h+2*a)+h*(o*f+h+2*l)+c}else h=s,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*l)+c;else h=-s,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*l)+c;else h<=-g?(f=Math.max(0,-(-o*s+a)),h=f>0?-s:Math.min(Math.max(-s,-l),s),d=-f*f+h*(h+2*l)+c):h<=g?(f=0,h=Math.min(Math.max(-s,-l),s),d=h*(h+2*l)+c):(f=Math.max(0,-(o*s+a)),h=f>0?s:Math.min(Math.max(-s,-l),s),d=-f*f+h*(h+2*l)+c);else h=o>0?-s:s,f=Math.max(0,-(o*h+a)),d=-f*f+h*(h+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(H0).addScaledVector(xh,h),d}intersectSphere(e,n){if(e.radius<0)return null;Bs.subVectors(e.center,this.origin);let i=Bs.dot(this.direction),r=Bs.dot(Bs)-i*i,s=e.radius*e.radius;if(r>s)return null;let o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,n):this.at(a,n)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;let i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){let i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){let n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,a,l,c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(i=(e.min.x-h.x)*c,r=(e.max.x-h.x)*c):(i=(e.max.x-h.x)*c,r=(e.min.x-h.x)*c),u>=0?(s=(e.min.y-h.y)*u,o=(e.max.y-h.y)*u):(s=(e.max.y-h.y)*u,o=(e.min.y-h.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),f>=0?(a=(e.min.z-h.z)*f,l=(e.max.z-h.z)*f):(a=(e.max.z-h.z)*f,l=(e.min.z-h.z)*f),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,Bs)!==null}intersectTriangle(e,n,i,r,s){let o=this.origin,a=this.direction,l=a.x,c=a.y,u=a.z,f=e.x-o.x,h=e.y-o.y,d=e.z-o.z,g=n.x-o.x,x=n.y-o.y,p=n.z-o.z,m=i.x-o.x,_=i.y-o.y,w=i.z-o.z,v=Math.abs(l),M=Math.abs(c),S=Math.abs(u),E,y,A,T,I,F,z,L,V,G,P,O;if(v>=M&&v>=S?(A=l,F=f,V=g,O=m,l>=0?(E=c,y=u,T=h,I=d,z=x,L=p,G=_,P=w):(E=u,y=c,T=d,I=h,z=p,L=x,G=w,P=_)):M>=S?(A=c,F=h,V=x,O=_,c>=0?(E=u,y=l,T=d,I=f,z=p,L=g,G=w,P=m):(E=l,y=u,T=f,I=d,z=g,L=p,G=m,P=w)):(A=u,F=d,V=p,O=w,u>=0?(E=l,y=c,T=f,I=h,z=g,L=x,G=m,P=_):(E=c,y=l,T=h,I=f,z=x,L=g,G=_,P=m)),A===0)return null;let k=E/A,$=y/A,j=1/A,Me=T-k*F,ve=I-$*F,Fe=z-k*V,We=L-$*V,ke=G-k*O,ee=P-$*O,ie=ke*We-ee*Fe,Te=Me*ee-ve*ke,$e=Fe*ve-We*Me;if(r){if(ie<0||Te<0||$e<0)return null}else if((ie<0||Te<0||$e<0)&&(ie>0||Te>0||$e>0))return null;let re=ie+Te+$e;if(re===0)return null;let se=j*(ie*F+Te*V+$e*O);return(re>0?se<0:se>0)?null:this.at(se/re,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},iu=class extends Gs{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Gt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ao,this.combine=sg,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}},y_=new Ct,la=new Hs,yh=new as,__=new C,_h=new C,Mh=new C,bh=new C,W0=new C,Sh=new C,M_=new C,wh=new C,nn=class extends Hi{constructor(e=new Dn,n=new iu){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,n){let i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);let a=this.morphTargetInfluences;if(s&&a){Sh.set(0,0,0);for(let l=0,c=s.length;l<c;l++){let u=a[l],f=s[l];u!==0&&(W0.fromBufferAttribute(f,e),o?Sh.addScaledVector(W0,u):Sh.addScaledVector(W0.sub(n),u))}n.add(Sh)}return n}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){let i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),yh.copy(i.boundingSphere),yh.applyMatrix4(s),la.copy(e.ray).recast(e.near),!(yh.containsPoint(la.origin)===!1&&(la.intersectSphere(yh,__)===null||la.origin.distanceToSquared(__)>(e.far-e.near)**2))&&(y_.copy(s).invert(),la.copy(e.ray).applyMatrix4(y_),!(i.boundingBox!==null&&la.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,la)))}_computeIntersections(e,n,i){let r,s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,h=s.groups,d=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,x=h.length;g<x;g++){let p=h[g],m=o[p.materialIndex],_=Math.max(p.start,d.start),w=Math.min(a.count,Math.min(p.start+p.count,d.start+d.count));for(let v=_,M=w;v<M;v+=3){let S=a.getX(v),E=a.getX(v+1),y=a.getX(v+2);r=Ah(this,m,e,i,c,u,f,S,E,y),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=p.materialIndex,n.push(r))}}else{let g=Math.max(0,d.start),x=Math.min(a.count,d.start+d.count);for(let p=g,m=x;p<m;p+=3){let _=a.getX(p),w=a.getX(p+1),v=a.getX(p+2);r=Ah(this,o,e,i,c,u,f,_,w,v),r&&(r.faceIndex=Math.floor(p/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,x=h.length;g<x;g++){let p=h[g],m=o[p.materialIndex],_=Math.max(p.start,d.start),w=Math.min(l.count,Math.min(p.start+p.count,d.start+d.count));for(let v=_,M=w;v<M;v+=3){let S=v,E=v+1,y=v+2;r=Ah(this,m,e,i,c,u,f,S,E,y),r&&(r.faceIndex=Math.floor(v/3),r.face.materialIndex=p.materialIndex,n.push(r))}}else{let g=Math.max(0,d.start),x=Math.min(l.count,d.start+d.count);for(let p=g,m=x;p<m;p+=3){let _=p,w=p+1,v=p+2;r=Ah(this,o,e,i,c,u,f,_,w,v),r&&(r.faceIndex=Math.floor(p/3),n.push(r))}}}};function uE(t,e,n,i,r,s,o,a){let l;if(e.side===Fi?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===us,a),l===null)return null;wh.copy(a),wh.applyMatrix4(t.matrixWorld);let c=n.ray.origin.distanceTo(wh);return c<n.near||c>n.far?null:{distance:c,point:wh.clone(),object:t}}function Ah(t,e,n,i,r,s,o,a,l,c){t.getVertexPosition(a,_h),t.getVertexPosition(l,Mh),t.getVertexPosition(c,bh);let u=uE(t,e,n,i,_h,Mh,bh,M_);if(u){let f=new C;So.getBarycoord(M_,_h,Mh,bh,f),r&&(u.uv=So.getInterpolatedAttribute(r,a,l,c,f,new xt)),s&&(u.uv1=So.getInterpolatedAttribute(s,a,l,c,f,new xt)),o&&(u.normal=So.getInterpolatedAttribute(o,a,l,c,f,new C),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));let h={a,b:l,c,normal:new C,materialIndex:0};So.getNormal(_h,Mh,bh,h.normal),u.face=h,u.barycoord=f}return u}var ru=class extends Di{constructor(e=null,n=1,i=1,r,s,o,a,l,c=ii,u=ii,f,h){super(null,o,a,l,c,u,r,s,f,h),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Ni=class extends Zt{constructor(e,n,i,r=1){super(e,n,i),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},xl=new Ct,b_=new Ct,Th=[],S_=new os,fE=new Ct,Xc=new nn,Yc=new as,su=class extends nn{constructor(e,n,i){super(e,n),this.isInstancedMesh=!0,this.instanceMatrix=new Ni(new Float32Array(i*16),16),this.instanceColor=null,this.morphTexture=null,this.count=i,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<i;r++)this.setMatrixAt(r,fE)}computeBoundingBox(){let e=this.geometry,n=this.count;this.boundingBox===null&&(this.boundingBox=new os),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,xl),S_.copy(e.boundingBox).applyMatrix4(xl),this.boundingBox.union(S_)}computeBoundingSphere(){let e=this.geometry,n=this.count;this.boundingSphere===null&&(this.boundingSphere=new as),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let i=0;i<n;i++)this.getMatrixAt(i,xl),Yc.copy(e.boundingSphere).applyMatrix4(xl),this.boundingSphere.union(Yc)}copy(e,n){return super.copy(e,n),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,n){return this.instanceColor===null?n.setRGB(1,1,1):n.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,n){return n.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,n){let i=n.morphTargetInfluences,r=this.morphTexture.source.data.data,s=i.length+1,o=e*s+1;for(let a=0;a<i.length;a++)i[a]=r[o+a]}raycast(e,n){let i=this.matrixWorld,r=this.count;if(Xc.geometry=this.geometry,Xc.material=this.material,Xc.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Yc.copy(this.boundingSphere),Yc.applyMatrix4(i),e.ray.intersectsSphere(Yc)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,xl),b_.multiplyMatrices(i,xl),Xc.matrixWorld=b_,Xc.raycast(e,Th);for(let o=0,a=Th.length;o<a;o++){let l=Th[o];l.instanceId=s,l.object=this,n.push(l)}Th.length=0}}setColorAt(e,n){return this.instanceColor===null&&(this.instanceColor=new Ni(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),n.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,n){return n.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,n){let i=n.morphTargetInfluences,r=i.length+1;this.morphTexture===null&&(this.morphTexture=new ru(new Float32Array(r*this.count),r,this.count,Td,_r));let s=this.morphTexture.source.data.data,o=0;for(let c=0;c<i.length;c++)o+=i[c];let a=this.geometry.morphTargetsRelative?1:1-o,l=r*e;return s[l]=a,s.set(i,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},ca=new as,hE=new xt(.5,.5),Eh=new C,ou=class{constructor(e=new Ur,n=new Ur,i=new Ur,r=new Ur,s=new Ur,o=new Ur){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){let a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){let n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=kr,i=!1){let r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],f=s[5],h=s[6],d=s[7],g=s[8],x=s[9],p=s[10],m=s[11],_=s[12],w=s[13],v=s[14],M=s[15];if(r[0].setComponents(c-o,d-u,m-g,M-_).normalize(),r[1].setComponents(c+o,d+u,m+g,M+_).normalize(),r[2].setComponents(c+a,d+f,m+x,M+w).normalize(),r[3].setComponents(c-a,d-f,m-x,M-w).normalize(),i)r[4].setComponents(l,h,p,v).normalize(),r[5].setComponents(c-l,d-h,m-p,M-v).normalize();else if(r[4].setComponents(c-l,d-h,m-p,M-v).normalize(),n===kr)r[5].setComponents(c+l,d+h,m+p,M+v).normalize();else if(n===Kc)r[5].setComponents(l,h,p,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ca.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),ca.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ca)}intersectsSprite(e){ca.center.set(0,0,0);let n=hE.distanceTo(e.center);return ca.radius=.7071067811865476+n,ca.applyMatrix4(e.matrixWorld),this.intersectsSphere(ca)}intersectsSphere(e){let n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){let n=this.planes;for(let i=0;i<6;i++){let r=n[i];if(Eh.x=r.normal.x>0?e.max.x:e.min.x,Eh.y=r.normal.y>0?e.max.y:e.min.y,Eh.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(Eh)<0)return!1}return!0}containsPoint(e){let n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Kh=class extends Gs{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Gt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},Jh=new C,Qh=new C,w_=new Ct,qc=new Hs,Rh=new as,$0=new C,A_=new C,ed=class extends Hi{constructor(e=new Dn,n=new Kh){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)Jh.fromBufferAttribute(n,r-1),Qh.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=Jh.distanceTo(Qh);e.setAttribute("lineDistance",new fn(i,1))}else gt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){let i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Rh.copy(i.boundingSphere),Rh.applyMatrix4(r),Rh.radius+=s,e.ray.intersectsSphere(Rh)===!1)return;w_.copy(r).invert(),qc.copy(e.ray).applyMatrix4(w_);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=i.index,h=i.attributes.position;if(u!==null){let d=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let x=d,p=g-1;x<p;x+=c){let m=u.getX(x),_=u.getX(x+1),w=Ch(this,e,qc,l,m,_,x);w&&n.push(w)}if(this.isLineLoop){let x=u.getX(g-1),p=u.getX(d),m=Ch(this,e,qc,l,x,p,g-1);m&&n.push(m)}}else{let d=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let x=d,p=g-1;x<p;x+=c){let m=Ch(this,e,qc,l,x,x+1,x);m&&n.push(m)}if(this.isLineLoop){let x=Ch(this,e,qc,l,g-1,d,g-1);x&&n.push(x)}}}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function Ch(t,e,n,i,r,s,o){let a=t.geometry.attributes.position;if(Jh.fromBufferAttribute(a,r),Qh.fromBufferAttribute(a,s),n.distanceSqToSegment(Jh,Qh,$0,A_)>i)return;$0.applyMatrix4(t.matrixWorld);let c=e.ray.origin.distanceTo($0);if(!(c<e.near||c>e.far))return{distance:c,point:A_.clone().applyMatrix4(t.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:t}}var T_=new C,E_=new C,au=class extends ed{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)T_.fromBufferAttribute(n,r),E_.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+T_.distanceTo(E_);e.setAttribute("lineDistance",new fn(i,1))}else gt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var td=class extends Gs{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Gt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},R_=new Ct,K0=new Hs,Ph=new as,Ih=new C,ha=class extends Hi{constructor(e=new Dn,n=new td){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,n){let i=this.geometry,r=this.matrixWorld,s=e.params.Points.threshold,o=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Ph.copy(i.boundingSphere),Ph.applyMatrix4(r),Ph.radius+=s,e.ray.intersectsSphere(Ph)===!1)return;R_.copy(r).invert(),K0.copy(e.ray).applyMatrix4(R_);let a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=i.index,f=i.attributes.position;if(c!==null){let h=Math.max(0,o.start),d=Math.min(c.count,o.start+o.count);for(let g=h,x=d;g<x;g++){let p=c.getX(g);Ih.fromBufferAttribute(f,p),C_(Ih,p,l,r,e,n,this)}}else{let h=Math.max(0,o.start),d=Math.min(f.count,o.start+o.count);for(let g=h,x=d;g<x;g++)Ih.fromBufferAttribute(f,g),C_(Ih,g,l,r,e,n,this)}}updateMorphTargets(){let n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){let r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){let a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}};function C_(t,e,n,i,r,s,o){let a=K0.distanceSqToPoint(t);if(a<n){let l=new C;K0.closestPointToPoint(t,l),l.applyMatrix4(i);let c=r.ray.origin.distanceTo(l);if(c<r.near||c>r.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var lu=class extends Di{constructor(e=[],n=Po,i,r,s,o,a,l,c,u){super(e,n,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},ls=class extends Di{constructor(e,n,i,r,s,o,a,l,c){super(e,n,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var To=class extends Di{constructor(e,n,i=Br,r,s,o,a=ii,l=ii,c,u=rs,f=1){if(u!==rs&&u!==Lo)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:n,depth:f};super(h,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new wl(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let n=super.toJSON(e);return n.compareFunction=this.compareFunction,n}},nd=class extends To{constructor(e,n=Br,i=Po,r,s,o=ii,a=ii,l,c=rs){let u={width:e,height:e,depth:1},f=[u,u,u,u,u,u];super(e,e,n,i,r,s,o,a,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}},cu=class extends Di{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}},Rl=class t extends Dn{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};let a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);let l=[],c=[],u=[],f=[],h=0,d=0;g("z","y","x",-1,-1,i,n,e,o,s,0),g("z","y","x",1,-1,i,n,-e,o,s,1),g("x","z","y",1,1,e,i,n,r,o,2),g("x","z","y",1,-1,e,i,-n,r,o,3),g("x","y","z",1,-1,e,n,i,r,s,4),g("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new fn(c,3)),this.setAttribute("normal",new fn(u,3)),this.setAttribute("uv",new fn(f,2));function g(x,p,m,_,w,v,M,S,E,y,A){let T=v/E,I=M/y,F=v/2,z=M/2,L=S/2,V=E+1,G=y+1,P=0,O=0,k=new C;for(let $=0;$<G;$++){let j=$*I-z;for(let Me=0;Me<V;Me++){let ve=Me*T-F;k[x]=ve*_,k[p]=j*w,k[m]=L,c.push(k.x,k.y,k.z),k[x]=0,k[p]=0,k[m]=S>0?1:-1,u.push(k.x,k.y,k.z),f.push(Me/E),f.push(1-$/y),P+=1}}for(let $=0;$<y;$++)for(let j=0;j<E;j++){let Me=h+j+V*$,ve=h+j+V*($+1),Fe=h+(j+1)+V*($+1),We=h+(j+1)+V*$;l.push(Me,ve,We),l.push(ve,Fe,We),O+=6}a.addGroup(d,O,A),d+=O,h+=P}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new t(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};var uu=class t extends Dn{constructor(e=[],n=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:n,radius:i,detail:r};let s=[],o=[];a(r),c(i),u(),this.setAttribute("position",new fn(s,3)),this.setAttribute("normal",new fn(s.slice(),3)),this.setAttribute("uv",new fn(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(_){let w=new C,v=new C,M=new C;for(let S=0;S<n.length;S+=3)d(n[S+0],w),d(n[S+1],v),d(n[S+2],M),l(w,v,M,_)}function l(_,w,v,M){let S=M+1,E=[];for(let y=0;y<=S;y++){E[y]=[];let A=_.clone().lerp(v,y/S),T=w.clone().lerp(v,y/S),I=S-y;for(let F=0;F<=I;F++)F===0&&y===S?E[y][F]=A:E[y][F]=A.clone().lerp(T,F/I)}for(let y=0;y<S;y++)for(let A=0;A<2*(S-y)-1;A++){let T=Math.floor(A/2);A%2===0?(h(E[y][T+1]),h(E[y+1][T]),h(E[y][T])):(h(E[y][T+1]),h(E[y+1][T+1]),h(E[y+1][T]))}}function c(_){let w=new C;for(let v=0;v<s.length;v+=3)w.x=s[v+0],w.y=s[v+1],w.z=s[v+2],w.normalize().multiplyScalar(_),s[v+0]=w.x,s[v+1]=w.y,s[v+2]=w.z}function u(){let _=new C;for(let w=0;w<s.length;w+=3){_.x=s[w+0],_.y=s[w+1],_.z=s[w+2];let v=p(_)/2/Math.PI+.5,M=m(_)/Math.PI+.5;o.push(v,1-M)}g(),f()}function f(){for(let _=0;_<o.length;_+=6){let w=o[_+0],v=o[_+2],M=o[_+4],S=Math.max(w,v,M),E=Math.min(w,v,M);S>.9&&E<.1&&(w<.2&&(o[_+0]+=1),v<.2&&(o[_+2]+=1),M<.2&&(o[_+4]+=1))}}function h(_){s.push(_.x,_.y,_.z)}function d(_,w){let v=_*3;w.x=e[v+0],w.y=e[v+1],w.z=e[v+2]}function g(){let _=new C,w=new C,v=new C,M=new C,S=new xt,E=new xt,y=new xt;for(let A=0,T=0;A<s.length;A+=9,T+=6){_.set(s[A+0],s[A+1],s[A+2]),w.set(s[A+3],s[A+4],s[A+5]),v.set(s[A+6],s[A+7],s[A+8]),S.set(o[T+0],o[T+1]),E.set(o[T+2],o[T+3]),y.set(o[T+4],o[T+5]),M.copy(_).add(w).add(v).divideScalar(3);let I=p(M);x(S,T+0,_,I),x(E,T+2,w,I),x(y,T+4,v,I)}}function x(_,w,v,M){M<0&&_.x===1&&(o[w]=_.x-1),v.x===0&&v.z===0&&(o[w]=M/2/Math.PI+.5)}function p(_){return Math.atan2(_.z,-_.x)}function m(_){return Math.atan2(-_.y,Math.sqrt(_.x*_.x+_.z*_.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new t(e.vertices,e.indices,e.radius,e.detail)}};var da=class t extends uu{constructor(e=1,n=0){let i=(1+Math.sqrt(5))/2,r=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,n),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new t(e.radius,e.detail)}};var fu=class t extends uu{constructor(e=1,n=0){let i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,r,e,n),this.type="OctahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new t(e.radius,e.detail)}},cs=class t extends Dn{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};let s=e/2,o=n/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,f=e/a,h=n/l,d=[],g=[],x=[],p=[];for(let m=0;m<u;m++){let _=m*h-o;for(let w=0;w<c;w++){let v=w*f-s;g.push(v,-_,0),x.push(0,0,1),p.push(w/a),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let _=0;_<a;_++){let w=_+c*m,v=_+c*(m+1),M=_+1+c*(m+1),S=_+1+c*m;d.push(w,v,S),d.push(v,M,S)}this.setIndex(d),this.setAttribute("position",new fn(g,3)),this.setAttribute("normal",new fn(x,3)),this.setAttribute("uv",new fn(p,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new t(e.width,e.height,e.widthSegments,e.heightSegments)}};function xa(t){let e={};for(let n in t){e[n]={};for(let i in t[n]){let r=t[n][i];if(P_(r))r.isRenderTargetTexture?(gt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone();else if(Array.isArray(r))if(P_(r[0])){let s=[];for(let o=0,a=r.length;o<a;o++)s[o]=r[o].clone();e[n][i]=s}else e[n][i]=r.slice();else e[n][i]=r}}return e}function bi(t){let e={};for(let n=0;n<t.length;n++){let i=xa(t[n]);for(let r in i)e[r]=i[r]}return e}function P_(t){return t&&(t.isColor||t.isMatrix3||t.isMatrix4||t.isVector2||t.isVector3||t.isVector4||t.isTexture||t.isQuaternion)}function dE(t){let e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function Sg(t){let e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:kt.workingColorSpace}var vM={clone:xa,merge:bi},pE=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,mE=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,$t=class extends Gs{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=pE,this.fragmentShader=mE,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=xa(e.uniforms),this.uniformsGroups=dE(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(let r in this.uniforms){let o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;let i={};for(let r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}fromJSON(e,n){if(super.fromJSON(e,n),e.uniforms!==void 0)for(let i in e.uniforms){let r=e.uniforms[i];switch(this.uniforms[i]={},r.type){case"t":this.uniforms[i].value=n[r.value]||null;break;case"c":this.uniforms[i].value=new Gt().setHex(r.value);break;case"v2":this.uniforms[i].value=new xt().fromArray(r.value);break;case"v3":this.uniforms[i].value=new C().fromArray(r.value);break;case"v4":this.uniforms[i].value=new Yt().fromArray(r.value);break;case"m3":this.uniforms[i].value=new Pt().fromArray(r.value);break;case"m4":this.uniforms[i].value=new Ct().fromArray(r.value);break;default:this.uniforms[i].value=r.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(let i in e.extensions)this.extensions[i]=e.extensions[i];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}},id=class extends $t{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}};var rd=class extends Gs{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=rM,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},sd=class extends Gs{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function vl(t,e){return!t||t.constructor===e?t:typeof e.BYTES_PER_ELEMENT=="number"?new e(t):Array.prototype.slice.call(t)}function X0(t){return t!==void 0&&t.inTangents!==void 0&&t.outTangents!==void 0}var Eo=class{constructor(e,n,i,r){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=r!==void 0?r:new n.constructor(i),this.sampleValues=n,this.valueSize=i,this.settings=null,this.DefaultSettings_={}}evaluate(e){let n=this.parameterPositions,i=this._cachedIndex,r=n[i],s=n[i-1];n:{e:{let o;t:{i:if(!(e<r)){for(let a=i+2;;){if(r===void 0){if(e<s)break i;return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}if(i===a)break;if(s=r,r=n[++i],e<r)break e}o=n.length;break t}if(!(e>=s)){let a=n[1];e<a&&(i=2,s=a);for(let l=i-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===l)break;if(r=s,s=n[--i-1],e>=s)break e}o=i,i=0;break t}break n}for(;i<o;){let a=i+o>>>1;e<n[a]?o=a:i=a+1}if(r=n[i],s=n[i-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(r===void 0)return i=n.length,this._cachedIndex=i,this.copySampleValue_(i-1)}this._cachedIndex=i,this.intervalChanged_(i,s,r)}return this.interpolate_(i,s,e,r)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let n=this.resultBuffer,i=this.sampleValues,r=this.valueSize,s=e*r;for(let o=0;o!==r;++o)n[o]=i[s+o];return n}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},od=class extends Eo{constructor(e,n,i,r){super(e,n,i,r),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:q0,endingEnd:q0}}intervalChanged_(e,n,i){let r=this.parameterPositions,s=e-2,o=e+1,a=r[s],l=r[o];if(a===void 0)switch(this.getSettings_().endingStart){case j0:s=e,a=2*n-i;break;case Z0:s=r.length-2,a=n+r[s]-r[s+1];break;default:s=e,a=i}if(l===void 0)switch(this.getSettings_().endingEnd){case j0:o=e,l=2*i-n;break;case Z0:o=1,l=i+r[1]-r[0];break;default:o=e-1,l=n}let c=(i-n)*.5,u=this.valueSize;this._weightPrev=c/(n-a),this._weightNext=c/(l-i),this._offsetPrev=s*u,this._offsetNext=o*u}interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this._offsetPrev,f=this._offsetNext,h=this._weightPrev,d=this._weightNext,g=(i-n)/(r-n),x=g*g,p=x*g,m=-h*p+2*h*x-h*g,_=(1+h)*p+(-1.5-2*h)*x+(-.5+h)*g+1,w=(-1-d)*p+(1.5+d)*x+.5*g,v=d*p-d*x;for(let M=0;M!==a;++M)s[M]=m*o[u+M]+_*o[c+M]+w*o[l+M]+v*o[f+M];return s}},ad=class extends Eo{constructor(e,n,i,r){super(e,n,i,r)}interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=(i-n)/(r-n),f=1-u;for(let h=0;h!==a;++h)s[h]=o[c+h]*f+o[l+h]*u;return s}},ld=class extends Eo{constructor(e,n,i,r){super(e,n,i,r)}interpolate_(e){return this.copySampleValue_(e-1)}},cd=class extends Eo{interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=e*a,c=l-a,u=this.inTangents,f=this.outTangents;if(!u||!f){let g=(i-n)/(r-n),x=1-g;for(let p=0;p!==a;++p)s[p]=o[c+p]*x+o[l+p]*g;return s}let h=a*2,d=e-1;for(let g=0;g!==a;++g){let x=o[c+g],p=o[l+g],m=d*h+g*2,_=f[m],w=f[m+1],v=e*h+g*2,M=u[v],S=u[v+1],E=xE(i,n,_,M,r);s[g]=yM(E,x,w,S,p)}return s}};function yM(t,e,n,i,r){let s=1-t;return s*s*s*e+3*s*s*t*n+3*s*t*t*i+t*t*t*r}function gE(t,e,n,i,r){let s=1-t;return 3*s*s*(n-e)+6*s*t*(i-n)+3*t*t*(r-i)}function xE(t,e,n,i,r){let s=(t-e)/(r-e);for(let o=0;o<8;o++){let a=yM(s,e,n,i,r)-t;if(Math.abs(a)<1e-10)break;let l=gE(s,e,n,i,r);if(Math.abs(l)<1e-10)break;s=Math.max(0,Math.min(1,s-a/l))}return s}var sr=class{constructor(e,n,i,r){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(n===void 0||n.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=vl(n,this.TimeBufferType),this.values=vl(i,this.ValueBufferType),this.setInterpolation(r||this.DefaultInterpolation)}static toJSON(e){let n=e.constructor,i;if(n.toJSON!==this.toJSON)i=n.toJSON(e);else{i={name:e.name,times:vl(e.times,Array),values:vl(e.values,Array)};let r=e.getInterpolation();r!==e.DefaultInterpolation&&(i.interpolation=r),X0(e.settings)&&(i.settings={inTangents:vl(e.settings.inTangents,Array),outTangents:vl(e.settings.outTangents,Array)})}return i.type=e.ValueTypeName,i}InterpolantFactoryMethodDiscrete(e){return new ld(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new ad(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new od(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let n=new cd(this.times,this.values,this.getValueSize(),e);return this.settings&&(n.inTangents=this.settings.inTangents,n.outTangents=this.settings.outTangents),n}setInterpolation(e){let n;switch(e){case jc:n=this.InterpolantFactoryMethodDiscrete;break;case $h:n=this.InterpolantFactoryMethodLinear;break;case Nh:n=this.InterpolantFactoryMethodSmooth;break;case Y0:n=this.InterpolantFactoryMethodBezier;break}if(n===void 0){let i="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(i);return gt("KeyframeTrack:",i),this}return this.createInterpolant=n,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return jc;case this.InterpolantFactoryMethodLinear:return $h;case this.InterpolantFactoryMethodSmooth:return Nh;case this.InterpolantFactoryMethodBezier:return Y0}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let n=this.times;for(let i=0,r=n.length;i!==r;++i)n[i]+=e}return this}scale(e){if(e!==1){let n=this.times;for(let i=0,r=n.length;i!==r;++i)n[i]*=e;X0(this.settings)&&(I_(this.settings.inTangents,e),I_(this.settings.outTangents,e))}return this}trim(e,n){let i=this.times,r=i.length,s=0,o=r-1;for(;s!==r&&i[s]<e;)++s;for(;o!==-1&&i[o]>n;)--o;if(++o,s!==0||o!==r){s>=o&&(o=Math.max(o,1),s=o-1);let a=this.getValueSize();this.times=i.slice(s,o),this.values=this.values.slice(s*a,o*a)}return this}validate(){let e=!0,n=this.getValueSize();n-Math.floor(n)!==0&&(_t("KeyframeTrack: Invalid value size in track.",this),e=!1);let i=this.times,r=this.values,s=i.length;s===0&&(_t("KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let a=0;a!==s;a++){let l=i[a];if(typeof l=="number"&&isNaN(l)){_t("KeyframeTrack: Time is not a valid number.",this,a,l),e=!1;break}if(o!==null&&o>l){_t("KeyframeTrack: Out of order keys.",this,a,l,o),e=!1;break}o=l}if(r!==void 0&&XT(r))for(let a=0,l=r.length;a!==l;++a){let c=r[a];if(isNaN(c)){_t("KeyframeTrack: Value is not a valid number.",this,a,c),e=!1;break}}return e}optimize(){let e=this.times.slice(),n=this.values.slice(),i=this.getValueSize(),r=this.getInterpolation()===Nh,s=e.length-1,o=1;for(let a=1;a<s;++a){let l=!1,c=e[a],u=e[a+1];if(c!==u&&(a!==1||c!==e[0]))if(r)l=!0;else{let f=a*i,h=f-i,d=f+i;for(let g=0;g!==i;++g){let x=n[f+g];if(x!==n[h+g]||x!==n[d+g]){l=!0;break}}}if(l){if(a!==o){e[o]=e[a];let f=a*i,h=o*i;for(let d=0;d!==i;++d)n[h+d]=n[f+d]}++o}}if(s>0){e[o]=e[s];for(let a=s*i,l=o*i,c=0;c!==i;++c)n[l+c]=n[a+c];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=n.slice(0,o*i)):(this.times=e,this.values=n),this}clone(){let e=this.times.slice(),n=this.values.slice(),i=this.constructor,r=new i(this.name,e,n);return r.createInterpolant=this.createInterpolant,X0(this.settings)&&(r.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),r}};function I_(t,e){for(let n=0,i=t.length;n!==i;n+=2)t[n]*=e}sr.prototype.ValueTypeName="";sr.prototype.TimeBufferType=Float32Array;sr.prototype.ValueBufferType=Float32Array;sr.prototype.DefaultInterpolation=$h;var Ro=class extends sr{constructor(e,n,i){super(e,n,i)}};Ro.prototype.ValueTypeName="bool";Ro.prototype.ValueBufferType=Array;Ro.prototype.DefaultInterpolation=jc;Ro.prototype.InterpolantFactoryMethodLinear=void 0;Ro.prototype.InterpolantFactoryMethodSmooth=void 0;var ud=class extends sr{constructor(e,n,i,r){super(e,n,i,r)}};ud.prototype.ValueTypeName="color";var fd=class extends sr{constructor(e,n,i,r){super(e,n,i,r)}};fd.prototype.ValueTypeName="number";var hd=class extends Eo{constructor(e,n,i,r){super(e,n,i,r)}interpolate_(e,n,i,r){let s=this.resultBuffer,o=this.sampleValues,a=this.valueSize,l=(i-n)/(r-n),c=e*a;for(let u=c+a;c!==u;c+=4)Li.slerpFlat(s,0,o,c-a,o,c,l);return s}},hu=class extends sr{constructor(e,n,i,r){super(e,n,i,r)}InterpolantFactoryMethodLinear(e){return new hd(this.times,this.values,this.getValueSize(),e)}};hu.prototype.ValueTypeName="quaternion";hu.prototype.InterpolantFactoryMethodSmooth=void 0;var Co=class extends sr{constructor(e,n,i){super(e,n,i)}};Co.prototype.ValueTypeName="string";Co.prototype.ValueBufferType=Array;Co.prototype.DefaultInterpolation=jc;Co.prototype.InterpolantFactoryMethodLinear=void 0;Co.prototype.InterpolantFactoryMethodSmooth=void 0;var dd=class extends sr{constructor(e,n,i,r){super(e,n,i,r)}};dd.prototype.ValueTypeName="vector";var pd=class{constructor(e,n,i){let r=this,s=!1,o=0,a=0,l,c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=n,this.onError=i,this._abortController=null,this.itemStart=function(u){a++,s===!1&&r.onStart!==void 0&&r.onStart(u,o,a),s=!0},this.itemEnd=function(u){o++,r.onProgress!==void 0&&r.onProgress(u,o,a),o===a&&(s=!1,r.onLoad!==void 0&&r.onLoad())},this.itemError=function(u){r.onError!==void 0&&r.onError(u)},this.resolveURL=function(u){return u=u.normalize("NFC"),l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,f){return c.push(u,f),this},this.removeHandler=function(u){let f=c.indexOf(u);return f!==-1&&c.splice(f,2),this},this.getHandler=function(u){for(let f=0,h=c.length;f<h;f+=2){let d=c[f],g=c[f+1];if(d.global&&(d.lastIndex=0),d.test(u))return g}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},_M=new pd,md=class{constructor(e){this.manager=e!==void 0?e:_M,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,n){let i=this;return new Promise(function(r,s){i.load(e,r,n,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}};md.DEFAULT_MATERIAL_NAME="__DEFAULT";var Lh=new C,Dh=new Li,ns=new C,du=class extends Hi{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Ct,this.projectionMatrix=new Ct,this.projectionMatrixInverse=new Ct,this.coordinateSystem=kr,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Lh,Dh,ns),ns.x===1&&ns.y===1&&ns.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Lh,Dh,ns.set(1,1,1)).invert()}updateWorldMatrix(e,n,i=!1){super.updateWorldMatrix(e,n,i),this.matrixWorld.decompose(Lh,Dh,ns),ns.x===1&&ns.y===1&&ns.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Lh,Dh,ns.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},bo=new C,L_=new xt,D_=new xt,yi=class extends du{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let n=.5*this.getFilmHeight()/e;this.fov=Xh*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(w0*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Xh*2*Math.atan(Math.tan(w0*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){bo.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(bo.x,bo.y).multiplyScalar(-e/bo.z),bo.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(bo.x,bo.y).multiplyScalar(-e/bo.z)}getViewSize(e,n){return this.getViewBounds(e,L_,D_),n.subVectors(D_,L_)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,n=e*Math.tan(w0*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r,o=this.view;if(this.view!==null&&this.view.enabled){let l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,n-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}let a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}};var Ws=class extends du{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2,s=i-e,o=i+e,a=r+n,l=r-n;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}};var pa=class extends Dn{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){let e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}};var yl=-90,_l=1,gd=class extends Hi{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;let r=new yi(yl,_l,e,n);r.layers=this.layers,this.add(r);let s=new yi(yl,_l,e,n);s.layers=this.layers,this.add(s);let o=new yi(yl,_l,e,n);o.layers=this.layers,this.add(o);let a=new yi(yl,_l,e,n);a.layers=this.layers,this.add(a);let l=new yi(yl,_l,e,n);l.layers=this.layers,this.add(l);let c=new yi(yl,_l,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,a,l]=n;for(let c of n)this.remove(c);if(e===kr)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Kc)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();let{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[s,o,a,l,c,u]=this.children,f=e.getRenderTarget(),h=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let p=!1;e.isWebGLRenderer===!0?p=e.state.buffers.depth.getReversed():p=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(n,s),e.setRenderTarget(i,1,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(n,o),e.setRenderTarget(i,2,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(n,a),e.setRenderTarget(i,3,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(n,l),e.setRenderTarget(i,4,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(n,c),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,r),p&&e.autoClear===!1&&e.clearDepth(),e.render(n,u),e.setRenderTarget(f,h,d),e.xr.enabled=g,i.texture.needsPMREMUpdate=!0}},xd=class extends yi{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}};var wg="\\[\\]\\.:\\/",vE=new RegExp("["+wg+"]","g"),Ag="[^"+wg+"]",yE="[^"+wg.replace("\\.","")+"]",_E=/((?:WC+[\/:])*)/.source.replace("WC",Ag),ME=/(WCOD+)?/.source.replace("WCOD",yE),bE=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ag),SE=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ag),wE=new RegExp("^"+_E+ME+bE+SE+"$"),AE=["material","materials","bones","map"],J0=class{constructor(e,n,i){let r=i||wn.parseTrackName(n);this._targetGroup=e,this._bindings=e.subscribe_(n,r)}getValue(e,n){this.bind();let i=this._targetGroup.nCachedObjects_,r=this._bindings[i];r!==void 0&&r.getValue(e,n)}setValue(e,n){let i=this._bindings;for(let r=this._targetGroup.nCachedObjects_,s=i.length;r!==s;++r)i[r].setValue(e,n)}bind(){let e=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=e.length;n!==i;++n)e[n].bind()}unbind(){let e=this._bindings;for(let n=this._targetGroup.nCachedObjects_,i=e.length;n!==i;++n)e[n].unbind()}},wn=class t{constructor(e,n,i){this.path=n,this.parsedPath=i||t.parseTrackName(n),this.node=t.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,n,i){return e&&e.isAnimationObjectGroup?new t.Composite(e,n,i):new t(e,n,i)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(vE,"")}static parseTrackName(e){let n=wE.exec(e);if(n===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let i={nodeName:n[2],objectName:n[3],objectIndex:n[4],propertyName:n[5],propertyIndex:n[6]},r=i.nodeName&&i.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let s=i.nodeName.substring(r+1);AE.indexOf(s)!==-1&&(i.nodeName=i.nodeName.substring(0,r),i.objectName=s)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return i}static findNode(e,n){if(n===void 0||n===""||n==="."||n===-1||n===e.name||n===e.uuid)return e;if(e.skeleton){let i=e.skeleton.getBoneByName(n);if(i!==void 0)return i}if(e.children){let i=function(s){for(let o=0;o<s.length;o++){let a=s[o];if(a.name===n||a.uuid===n)return a;let l=i(a.children);if(l)return l}return null},r=i(e.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,n){e[n]=this.targetObject[this.propertyName]}_getValue_array(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)e[n++]=i[r]}_getValue_arrayElement(e,n){e[n]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,n){this.resolvedProperty.toArray(e,n)}_setValue_direct(e,n){this.targetObject[this.propertyName]=e[n]}_setValue_direct_setNeedsUpdate(e,n){this.targetObject[this.propertyName]=e[n],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,n){this.targetObject[this.propertyName]=e[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[n++]}_setValue_array_setNeedsUpdate(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[n++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,n){let i=this.resolvedProperty;for(let r=0,s=i.length;r!==s;++r)i[r]=e[n++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,n){this.resolvedProperty[this.propertyIndex]=e[n]}_setValue_arrayElement_setNeedsUpdate(e,n){this.resolvedProperty[this.propertyIndex]=e[n],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,n){this.resolvedProperty[this.propertyIndex]=e[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,n){this.resolvedProperty.fromArray(e,n)}_setValue_fromArray_setNeedsUpdate(e,n){this.resolvedProperty.fromArray(e,n),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,n){this.resolvedProperty.fromArray(e,n),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,n){this.bind(),this.getValue(e,n)}_setValue_unbound(e,n){this.bind(),this.setValue(e,n)}bind(){let e=this.node,n=this.parsedPath,i=n.objectName,r=n.propertyName,s=n.propertyIndex;if(e||(e=t.findNode(this.rootNode,n.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){gt("PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let c=n.objectIndex;switch(i){case"materials":if(!e.material){_t("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){_t("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){_t("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===c){c=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){_t("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){_t("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[i]===void 0){_t("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[i]}if(c!==void 0){if(e[c]===void 0){_t("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}let o=e[r];if(o===void 0){let c=n.nodeName;_t("PropertyBinding: Trying to update property for track: "+c+"."+r+" but it wasn't found.",e);return}let a=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?a=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(a=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(s!==void 0){if(r==="morphTargetInfluences"){if(!e.geometry){_t("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){_t("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[s]!==void 0&&(s=e.morphTargetDictionary[s])}l=this.BindingType.ArrayElement,this.resolvedProperty=o,this.propertyIndex=s}else o.fromArray!==void 0&&o.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=o):Array.isArray(o)?(l=this.BindingType.EntireArray,this.resolvedProperty=o):this.propertyName=r;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};wn.Composite=J0;wn.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};wn.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};wn.prototype.GetterByBindingType=[wn.prototype._getValue_direct,wn.prototype._getValue_array,wn.prototype._getValue_arrayElement,wn.prototype._getValue_toArray];wn.prototype.SetterByBindingTypeAndVersioning=[[wn.prototype._setValue_direct,wn.prototype._setValue_direct_setNeedsUpdate,wn.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[wn.prototype._setValue_array,wn.prototype._setValue_array_setNeedsUpdate,wn.prototype._setValue_array_setMatrixWorldNeedsUpdate],[wn.prototype._setValue_arrayElement,wn.prototype._setValue_arrayElement_setNeedsUpdate,wn.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[wn.prototype._setValue_fromArray,wn.prototype._setValue_fromArray_setNeedsUpdate,wn.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var mF=new Float32Array(1);var Cl=class extends Zh{constructor(e,n,i=1){super(e,n),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){let n=super.clone(e);return n.meshPerAttribute=this.meshPerAttribute,n}toJSON(e){let n=super.toJSON(e);return n.isInstancedInterleavedBuffer=!0,n.meshPerAttribute=this.meshPerAttribute,n}};var N_=new Ct,pu=class{constructor(e,n,i=0,r=1/0){this.ray=new Hs(e,n),this.near=i,this.far=r,this.camera=null,this.layers=new Al,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,n){this.ray.set(e,n)}setFromCamera(e,n){n.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(n.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(n).sub(this.ray.origin).normalize(),this.camera=n):n.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,n.projectionMatrix.elements[14]).unproject(n),this.ray.direction.set(0,0,-1).transformDirection(n.matrixWorld),this.camera=n):_t("Raycaster: Unsupported camera type: "+n.type)}setFromXRController(e){return N_.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(N_),this}intersectObject(e,n=!0,i=[]){return Q0(e,this,i,n),i.sort(F_),i}intersectObjects(e,n=!0,i=[]){for(let r=0,s=e.length;r<s;r++)Q0(e[r],this,i,n);return i.sort(F_),i}};function F_(t,e){return t.distance-e.distance}function Q0(t,e,n,i){let r=!0;if(t.layers.test(e.layers)&&t.raycast(e,n)===!1&&(r=!1),r===!0&&i===!0){let s=t.children;for(let o=0,a=s.length;o<a;o++)Q0(s[o],e,n,!0)}}var Ig=class Ig{constructor(e,n,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,n,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,n=0){for(let i=0;i<4;i++)this.elements[i]=e[i+n];return this}set(e,n,i,r){let s=this.elements;return s[0]=e,s[2]=n,s[1]=i,s[3]=r,this}};Ig.prototype.isMatrix2=!0;var eg=Ig;function Tg(t,e,n,i){let r=TE(i);switch(n){case vg:return t*e;case Td:return t*e/r.components*r.byteLength;case Ed:return t*e/r.components*r.byteLength;case Do:return t*e*2/r.components*r.byteLength;case Rd:return t*e*2/r.components*r.byteLength;case yg:return t*e*3/r.components*r.byteLength;case li:return t*e*4/r.components*r.byteLength;case Cd:return t*e*4/r.components*r.byteLength;case yu:case _u:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Mu:case bu:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Id:case Dd:return Math.max(t,16)*Math.max(e,8)/4;case Pd:case Ld:return Math.max(t,8)*Math.max(e,8)/2;case Nd:case Fd:case Ud:case kd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Od:case Su:case Bd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case zd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Vd:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Gd:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Hd:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Wd:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case $d:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Xd:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Yd:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case qd:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case jd:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Zd:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Kd:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Jd:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case Qd:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case ep:case tp:case np:return Math.ceil(t/4)*Math.ceil(e/4)*16;case ip:case rp:return Math.ceil(t/4)*Math.ceil(e/4)*8;case wu:case sp:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function TE(t){switch(t){case lr:case pg:return{byteLength:1,components:1};case Ll:case mg:case Mi:return{byteLength:2,components:1};case wd:case Ad:return{byteLength:2,components:4};case Br:case Sd:case _r:return{byteLength:4,components:1};case gg:case xg:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"186"}}));typeof window<"u"&&(window.__THREE__?gt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="186");function GM(){let t=null,e=!1,n=null,i=null;function r(s,o){i=t.requestAnimationFrame(r),n(s,o)}return{start:function(){e!==!0&&n!==null&&t!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t!==null&&t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function RE(t){let e=new WeakMap;function n(a,l){let c=a.array,u=a.usage,f=c.byteLength,h=t.createBuffer();t.bindBuffer(l,h),t.bufferData(l,c,u),a.onUploadCallback();let d;if(c instanceof Float32Array)d=t.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=t.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?d=t.HALF_FLOAT:d=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=t.SHORT;else if(c instanceof Uint32Array)d=t.UNSIGNED_INT;else if(c instanceof Int32Array)d=t.INT;else if(c instanceof Int8Array)d=t.BYTE;else if(c instanceof Uint8Array)d=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:f}}function i(a,l,c){let u=l.array,f=l.updateRanges;if(t.bindBuffer(c,a),f.length===0)t.bufferSubData(c,0,u);else{f.sort((d,g)=>d.start-g.start);let h=0;for(let d=1;d<f.length;d++){let g=f[h],x=f[d];x.start<=g.start+g.count+1?g.count=Math.max(g.count,x.start+x.count-g.start):(++h,f[h]=x)}f.length=h+1;for(let d=0,g=f.length;d<g;d++){let x=f[d];t.bufferSubData(c,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);let l=e.get(a);l&&(t.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){let u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}let c=e.get(a);if(c===void 0)e.set(a,n(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var CE=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,PE=`#ifdef USE_ALPHAHASH
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
#endif`,IE=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,LE=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,DE=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,NE=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,FE=`#ifdef USE_AOMAP
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
#endif`,OE=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,UE=`#ifdef USE_BATCHING
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
#endif`,kE=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,BE=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,zE=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,VE=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,GE=`#ifdef USE_IRIDESCENCE
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
#endif`,HE=`#ifdef USE_BUMPMAP
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
#endif`,WE=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,$E=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,XE=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,YE=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,qE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,jE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,ZE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,KE=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,JE=`#define PI 3.141592653589793
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
} // validated`,QE=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,e2=`vec3 transformedNormal = objectNormal;
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
#endif`,t2=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,n2=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,i2=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,r2=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,s2="gl_FragColor = linearToOutputTexel( gl_FragColor );",o2=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,a2=`#ifdef USE_ENVMAP
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
#endif`,l2=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,c2=`#ifdef USE_ENVMAP
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
#endif`,u2=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,f2=`#ifdef USE_ENVMAP
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
#endif`,h2=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,d2=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,p2=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,m2=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,g2=`#ifdef USE_GRADIENTMAP
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
}`,x2=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,v2=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,y2=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,_2=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,M2=`#ifdef USE_ENVMAP
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
#endif`,b2=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,S2=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,w2=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,A2=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,T2=`PhysicalMaterial material;
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
#endif`,E2=`uniform sampler2D dfgLUT;
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
}`,R2=`
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
#endif`,C2=`#if defined( RE_IndirectDiffuse )
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
#endif`,P2=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,I2=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,L2=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,D2=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,N2=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,F2=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,O2=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,U2=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,k2=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,B2=`#if defined( USE_POINTS_UV )
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
#endif`,z2=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,V2=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,G2=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,H2=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,W2=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,$2=`#ifdef USE_MORPHTARGETS
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
#endif`,X2=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Y2=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,q2=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,j2=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Z2=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,K2=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,J2=`#ifdef USE_NORMALMAP
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
#endif`,Q2=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,eR=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,tR=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,nR=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,iR=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,rR=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,sR=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,oR=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,aR=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,lR=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,cR=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,uR=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,fR=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,hR=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,dR=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,pR=`float getShadowMask() {
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
}`,mR=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,gR=`#ifdef USE_SKINNING
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
#endif`,xR=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,vR=`#ifdef USE_SKINNING
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
#endif`,yR=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,_R=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,MR=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,bR=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,SR=`#ifdef USE_TRANSMISSION
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
#endif`,wR=`#ifdef USE_TRANSMISSION
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
#endif`,AR=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,TR=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ER=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,RR=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,CR=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,PR=`uniform sampler2D t2D;
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
}`,IR=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,LR=`#ifdef ENVMAP_TYPE_CUBE
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
}`,DR=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,NR=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,FR=`#include <common>
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
}`,OR=`#if DEPTH_PACKING == 3200
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
}`,UR=`#define DISTANCE
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
}`,kR=`#define DISTANCE
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
}`,BR=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,zR=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,VR=`uniform float scale;
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
}`,GR=`uniform vec3 diffuse;
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
}`,HR=`#include <common>
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
}`,WR=`uniform vec3 diffuse;
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
}`,$R=`#define LAMBERT
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
}`,XR=`#define LAMBERT
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
}`,YR=`#define MATCAP
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
}`,qR=`#define MATCAP
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
}`,jR=`#define NORMAL
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
}`,ZR=`#define NORMAL
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
}`,KR=`#define PHONG
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
}`,JR=`#define PHONG
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
}`,QR=`#define STANDARD
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
}`,eC=`#define STANDARD
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
}`,tC=`#define TOON
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
}`,nC=`#define TOON
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
}`,iC=`uniform float size;
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
}`,rC=`uniform vec3 diffuse;
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
}`,sC=`#include <common>
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
}`,oC=`uniform vec3 color;
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
}`,aC=`uniform float rotation;
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
}`,lC=`uniform vec3 diffuse;
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
}`,Ut={alphahash_fragment:CE,alphahash_pars_fragment:PE,alphamap_fragment:IE,alphamap_pars_fragment:LE,alphatest_fragment:DE,alphatest_pars_fragment:NE,aomap_fragment:FE,aomap_pars_fragment:OE,batching_pars_vertex:UE,batching_vertex:kE,begin_vertex:BE,beginnormal_vertex:zE,bsdfs:VE,iridescence_fragment:GE,bumpmap_pars_fragment:HE,clipping_planes_fragment:WE,clipping_planes_pars_fragment:$E,clipping_planes_pars_vertex:XE,clipping_planes_vertex:YE,color_fragment:qE,color_pars_fragment:jE,color_pars_vertex:ZE,color_vertex:KE,common:JE,cube_uv_reflection_fragment:QE,defaultnormal_vertex:e2,displacementmap_pars_vertex:t2,displacementmap_vertex:n2,emissivemap_fragment:i2,emissivemap_pars_fragment:r2,colorspace_fragment:s2,colorspace_pars_fragment:o2,envmap_fragment:a2,envmap_common_pars_fragment:l2,envmap_pars_fragment:c2,envmap_pars_vertex:u2,envmap_physical_pars_fragment:M2,envmap_vertex:f2,fog_vertex:h2,fog_pars_vertex:d2,fog_fragment:p2,fog_pars_fragment:m2,gradientmap_pars_fragment:g2,lightmap_pars_fragment:x2,lights_lambert_fragment:v2,lights_lambert_pars_fragment:y2,lights_pars_begin:_2,lights_toon_fragment:b2,lights_toon_pars_fragment:S2,lights_phong_fragment:w2,lights_phong_pars_fragment:A2,lights_physical_fragment:T2,lights_physical_pars_fragment:E2,lights_fragment_begin:R2,lights_fragment_maps:C2,lights_fragment_end:P2,lightprobes_pars_fragment:I2,logdepthbuf_fragment:L2,logdepthbuf_pars_fragment:D2,logdepthbuf_pars_vertex:N2,logdepthbuf_vertex:F2,map_fragment:O2,map_pars_fragment:U2,map_particle_fragment:k2,map_particle_pars_fragment:B2,metalnessmap_fragment:z2,metalnessmap_pars_fragment:V2,morphinstance_vertex:G2,morphcolor_vertex:H2,morphnormal_vertex:W2,morphtarget_pars_vertex:$2,morphtarget_vertex:X2,normal_fragment_begin:Y2,normal_fragment_maps:q2,normal_pars_fragment:j2,normal_pars_vertex:Z2,normal_vertex:K2,normalmap_pars_fragment:J2,clearcoat_normal_fragment_begin:Q2,clearcoat_normal_fragment_maps:eR,clearcoat_pars_fragment:tR,iridescence_pars_fragment:nR,opaque_fragment:iR,packing:rR,premultiplied_alpha_fragment:sR,project_vertex:oR,dithering_fragment:aR,dithering_pars_fragment:lR,roughnessmap_fragment:cR,roughnessmap_pars_fragment:uR,shadowmap_pars_fragment:fR,shadowmap_pars_vertex:hR,shadowmap_vertex:dR,shadowmask_pars_fragment:pR,skinbase_vertex:mR,skinning_pars_vertex:gR,skinning_vertex:xR,skinnormal_vertex:vR,specularmap_fragment:yR,specularmap_pars_fragment:_R,tonemapping_fragment:MR,tonemapping_pars_fragment:bR,transmission_fragment:SR,transmission_pars_fragment:wR,uv_pars_fragment:AR,uv_pars_vertex:TR,uv_vertex:ER,worldpos_vertex:RR,background_vert:CR,background_frag:PR,backgroundCube_vert:IR,backgroundCube_frag:LR,cube_vert:DR,cube_frag:NR,depth_vert:FR,depth_frag:OR,distance_vert:UR,distance_frag:kR,equirect_vert:BR,equirect_frag:zR,linedashed_vert:VR,linedashed_frag:GR,meshbasic_vert:HR,meshbasic_frag:WR,meshlambert_vert:$R,meshlambert_frag:XR,meshmatcap_vert:YR,meshmatcap_frag:qR,meshnormal_vert:jR,meshnormal_frag:ZR,meshphong_vert:KR,meshphong_frag:JR,meshphysical_vert:QR,meshphysical_frag:eC,meshtoon_vert:tC,meshtoon_frag:nC,points_vert:iC,points_frag:rC,shadow_vert:sC,shadow_frag:oC,sprite_vert:aC,sprite_frag:lC},Ve={common:{diffuse:{value:new Gt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Pt},alphaMap:{value:null},alphaMapTransform:{value:new Pt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Pt}},envmap:{envMap:{value:null},envMapRotation:{value:new Pt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Pt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Pt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Pt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Pt},normalScale:{value:new xt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Pt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Pt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Pt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Pt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Gt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new C},probesMax:{value:new C},probesResolution:{value:new C}},points:{diffuse:{value:new Gt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Pt},alphaTest:{value:0},uvTransform:{value:new Pt}},sprite:{diffuse:{value:new Gt(16777215)},opacity:{value:1},center:{value:new xt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Pt},alphaMap:{value:null},alphaMapTransform:{value:new Pt},alphaTest:{value:0}}},ds={basic:{uniforms:bi([Ve.common,Ve.specularmap,Ve.envmap,Ve.aomap,Ve.lightmap,Ve.fog]),vertexShader:Ut.meshbasic_vert,fragmentShader:Ut.meshbasic_frag},lambert:{uniforms:bi([Ve.common,Ve.specularmap,Ve.envmap,Ve.aomap,Ve.lightmap,Ve.emissivemap,Ve.bumpmap,Ve.normalmap,Ve.displacementmap,Ve.fog,Ve.lights,{emissive:{value:new Gt(0)},envMapIntensity:{value:1}}]),vertexShader:Ut.meshlambert_vert,fragmentShader:Ut.meshlambert_frag},phong:{uniforms:bi([Ve.common,Ve.specularmap,Ve.envmap,Ve.aomap,Ve.lightmap,Ve.emissivemap,Ve.bumpmap,Ve.normalmap,Ve.displacementmap,Ve.fog,Ve.lights,{emissive:{value:new Gt(0)},specular:{value:new Gt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ut.meshphong_vert,fragmentShader:Ut.meshphong_frag},standard:{uniforms:bi([Ve.common,Ve.envmap,Ve.aomap,Ve.lightmap,Ve.emissivemap,Ve.bumpmap,Ve.normalmap,Ve.displacementmap,Ve.roughnessmap,Ve.metalnessmap,Ve.fog,Ve.lights,{emissive:{value:new Gt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ut.meshphysical_vert,fragmentShader:Ut.meshphysical_frag},toon:{uniforms:bi([Ve.common,Ve.aomap,Ve.lightmap,Ve.emissivemap,Ve.bumpmap,Ve.normalmap,Ve.displacementmap,Ve.gradientmap,Ve.fog,Ve.lights,{emissive:{value:new Gt(0)}}]),vertexShader:Ut.meshtoon_vert,fragmentShader:Ut.meshtoon_frag},matcap:{uniforms:bi([Ve.common,Ve.bumpmap,Ve.normalmap,Ve.displacementmap,Ve.fog,{matcap:{value:null}}]),vertexShader:Ut.meshmatcap_vert,fragmentShader:Ut.meshmatcap_frag},points:{uniforms:bi([Ve.points,Ve.fog]),vertexShader:Ut.points_vert,fragmentShader:Ut.points_frag},dashed:{uniforms:bi([Ve.common,Ve.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ut.linedashed_vert,fragmentShader:Ut.linedashed_frag},depth:{uniforms:bi([Ve.common,Ve.displacementmap]),vertexShader:Ut.depth_vert,fragmentShader:Ut.depth_frag},normal:{uniforms:bi([Ve.common,Ve.bumpmap,Ve.normalmap,Ve.displacementmap,{opacity:{value:1}}]),vertexShader:Ut.meshnormal_vert,fragmentShader:Ut.meshnormal_frag},sprite:{uniforms:bi([Ve.sprite,Ve.fog]),vertexShader:Ut.sprite_vert,fragmentShader:Ut.sprite_frag},background:{uniforms:{uvTransform:{value:new Pt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ut.background_vert,fragmentShader:Ut.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Pt}},vertexShader:Ut.backgroundCube_vert,fragmentShader:Ut.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ut.cube_vert,fragmentShader:Ut.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ut.equirect_vert,fragmentShader:Ut.equirect_frag},distance:{uniforms:bi([Ve.common,Ve.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ut.distance_vert,fragmentShader:Ut.distance_frag},shadow:{uniforms:bi([Ve.lights,Ve.fog,{color:{value:new Gt(0)},opacity:{value:1}}]),vertexShader:Ut.shadow_vert,fragmentShader:Ut.shadow_frag}};ds.physical={uniforms:bi([ds.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Pt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Pt},clearcoatNormalScale:{value:new xt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Pt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Pt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Pt},sheen:{value:0},sheenColor:{value:new Gt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Pt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Pt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Pt},transmissionSamplerSize:{value:new xt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Pt},attenuationDistance:{value:0},attenuationColor:{value:new Gt(0)},specularColor:{value:new Gt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Pt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Pt},anisotropyVector:{value:new xt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Pt}}]),vertexShader:Ut.meshphysical_vert,fragmentShader:Ut.meshphysical_frag};var lp={r:0,b:0,g:0},cC=new Ct,HM=new Pt;HM.set(-1,0,0,0,1,0,0,0,1);function uC(t,e,n,i,r,s){let o=new Gt(0),a=r===!0?0:1,l,c,u=null,f=0,h=null;function d(_){let w=_.isScene===!0?_.background:null;if(w&&w.isTexture){let v=_.backgroundBlurriness>0;w=e.get(w,v)}return w}function g(_){let w=!1,v=d(_);v===null?p(o,a):v&&v.isColor&&(p(v,1),w=!0);let M=t.xr.getEnvironmentBlendMode();M==="additive"?n.buffers.color.setClear(0,0,0,1,s):M==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(t.autoClear||w)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function x(_,w){let v=d(w);v&&(v.isCubeTexture||v.mapping===xu)?(c===void 0&&(c=new nn(new Rl(1,1,1),new $t({name:"BackgroundCubeMaterial",uniforms:xa(ds.backgroundCube.uniforms),vertexShader:ds.backgroundCube.vertexShader,fragmentShader:ds.backgroundCube.fragmentShader,side:Fi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(M,S,E){this.matrixWorld.copyPosition(E.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=v,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(cC.makeRotationFromEuler(w.backgroundRotation)).transpose(),v.isCubeTexture&&v.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(HM),c.material.toneMapped=kt.getTransfer(v.colorSpace)!==an,(u!==v||f!==v.version||h!==t.toneMapping)&&(c.material.needsUpdate=!0,u=v,f=v.version,h=t.toneMapping),c.layers.enableAll(),_.unshift(c,c.geometry,c.material,0,0,null)):v&&v.isTexture&&(l===void 0&&(l=new nn(new cs(2,2),new $t({name:"BackgroundMaterial",uniforms:xa(ds.background.uniforms),vertexShader:ds.background.vertexShader,fragmentShader:ds.background.fragmentShader,side:us,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=v,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=kt.getTransfer(v.colorSpace)!==an,v.matrixAutoUpdate===!0&&v.updateMatrix(),l.material.uniforms.uvTransform.value.copy(v.matrix),(u!==v||f!==v.version||h!==t.toneMapping)&&(l.material.needsUpdate=!0,u=v,f=v.version,h=t.toneMapping),l.layers.enableAll(),_.unshift(l,l.geometry,l.material,0,0,null))}function p(_,w){_.getRGB(lp,Sg(t)),n.buffers.color.setClear(lp.r,lp.g,lp.b,w,s)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(_,w=1){o.set(_),a=w,p(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(_){a=_,p(o,a)},render:g,addToRenderList:x,dispose:m}}function fC(t,e){let n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=h(null),s=r,o=!1;function a(I,F,z,L,V){let G=!1,P=f(I,L,z,F);s!==P&&(s=P,c(s.object)),G=d(I,L,z,V),G&&g(I,L,z,V),V!==null&&e.update(V,t.ELEMENT_ARRAY_BUFFER),(G||o)&&(o=!1,v(I,F,z,L),V!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(V).buffer))}function l(){return t.createVertexArray()}function c(I){return t.bindVertexArray(I)}function u(I){return t.deleteVertexArray(I)}function f(I,F,z,L){let V=L.wireframe===!0,G=i[F.id];G===void 0&&(G={},i[F.id]=G);let P=I.isInstancedMesh===!0?I.id:0,O=G[P];O===void 0&&(O={},G[P]=O);let k=O[z.id];k===void 0&&(k={},O[z.id]=k);let $=k[V];return $===void 0&&($=h(l()),k[V]=$),$}function h(I){let F=[],z=[],L=[];for(let V=0;V<n;V++)F[V]=0,z[V]=0,L[V]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:F,enabledAttributes:z,attributeDivisors:L,object:I,attributes:{},index:null}}function d(I,F,z,L){let V=s.attributes,G=F.attributes,P=0,O=z.getAttributes();for(let k in O)if(O[k].location>=0){let j=V[k],Me=G[k];if(Me===void 0&&(k==="instanceMatrix"&&I.instanceMatrix&&(Me=I.instanceMatrix),k==="instanceColor"&&I.instanceColor&&(Me=I.instanceColor)),j===void 0||j.attribute!==Me||Me&&j.data!==Me.data)return!0;P++}return s.attributesNum!==P||s.index!==L}function g(I,F,z,L){let V={},G=F.attributes,P=0,O=z.getAttributes();for(let k in O)if(O[k].location>=0){let j=G[k];j===void 0&&(k==="instanceMatrix"&&I.instanceMatrix&&(j=I.instanceMatrix),k==="instanceColor"&&I.instanceColor&&(j=I.instanceColor));let Me={};Me.attribute=j,j&&j.data&&(Me.data=j.data),V[k]=Me,P++}s.attributes=V,s.attributesNum=P,s.index=L}function x(){let I=s.newAttributes;for(let F=0,z=I.length;F<z;F++)I[F]=0}function p(I){m(I,0)}function m(I,F){let z=s.newAttributes,L=s.enabledAttributes,V=s.attributeDivisors;z[I]=1,L[I]===0&&(t.enableVertexAttribArray(I),L[I]=1),V[I]!==F&&(t.vertexAttribDivisor(I,F),V[I]=F)}function _(){let I=s.newAttributes,F=s.enabledAttributes;for(let z=0,L=F.length;z<L;z++)F[z]!==I[z]&&(t.disableVertexAttribArray(z),F[z]=0)}function w(I,F,z,L,V,G,P){P===!0?t.vertexAttribIPointer(I,F,z,V,G):t.vertexAttribPointer(I,F,z,L,V,G)}function v(I,F,z,L){x();let V=L.attributes,G=z.getAttributes(),P=F.defaultAttributeValues;for(let O in G){let k=G[O];if(k.location>=0){let $=V[O];if($===void 0&&(O==="instanceMatrix"&&I.instanceMatrix&&($=I.instanceMatrix),O==="instanceColor"&&I.instanceColor&&($=I.instanceColor)),$!==void 0){let j=$.normalized,Me=$.itemSize,ve=e.get($);if(ve===void 0)continue;let Fe=ve.buffer,We=ve.type,ke=ve.bytesPerElement,ee=We===t.INT||We===t.UNSIGNED_INT||$.gpuType===Sd;if($.isInterleavedBufferAttribute){let ie=$.data,Te=ie.stride,$e=$.offset;if(ie.isInstancedInterleavedBuffer){for(let re=0;re<k.locationSize;re++)m(k.location+re,ie.meshPerAttribute);I.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let re=0;re<k.locationSize;re++)p(k.location+re);t.bindBuffer(t.ARRAY_BUFFER,Fe);for(let re=0;re<k.locationSize;re++)w(k.location+re,Me/k.locationSize,We,j,Te*ke,($e+Me/k.locationSize*re)*ke,ee)}else{if($.isInstancedBufferAttribute){for(let ie=0;ie<k.locationSize;ie++)m(k.location+ie,$.meshPerAttribute);I.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let ie=0;ie<k.locationSize;ie++)p(k.location+ie);t.bindBuffer(t.ARRAY_BUFFER,Fe);for(let ie=0;ie<k.locationSize;ie++)w(k.location+ie,Me/k.locationSize,We,j,Me*ke,Me/k.locationSize*ie*ke,ee)}}else if(P!==void 0){let j=P[O];if(j!==void 0)switch(j.length){case 2:t.vertexAttrib2fv(k.location,j);break;case 3:t.vertexAttrib3fv(k.location,j);break;case 4:t.vertexAttrib4fv(k.location,j);break;default:t.vertexAttrib1fv(k.location,j)}}}}_()}function M(){A();for(let I in i){let F=i[I];for(let z in F){let L=F[z];for(let V in L){let G=L[V];for(let P in G)u(G[P].object),delete G[P];delete L[V]}}delete i[I]}}function S(I){if(i[I.id]===void 0)return;let F=i[I.id];for(let z in F){let L=F[z];for(let V in L){let G=L[V];for(let P in G)u(G[P].object),delete G[P];delete L[V]}}delete i[I.id]}function E(I){for(let F in i){let z=i[F];for(let L in z){let V=z[L];if(V[I.id]===void 0)continue;let G=V[I.id];for(let P in G)u(G[P].object),delete G[P];delete V[I.id]}}}function y(I){for(let F in i){let z=i[F],L=I.isInstancedMesh===!0?I.id:0,V=z[L];if(V!==void 0){for(let G in V){let P=V[G];for(let O in P)u(P[O].object),delete P[O];delete V[G]}delete z[L],Object.keys(z).length===0&&delete i[F]}}}function A(){T(),o=!0,s!==r&&(s=r,c(s.object))}function T(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:A,resetDefaultState:T,dispose:M,releaseStatesOfGeometry:S,releaseStatesOfObject:y,releaseStatesOfProgram:E,initAttributes:x,enableAttribute:p,disableUnusedAttributes:_}}function hC(t,e,n){let i;function r(l){i=l}function s(l,c){t.drawArrays(i,l,c),n.update(c,i,1)}function o(l,c,u){u!==0&&(t.drawArraysInstanced(i,l,c,u),n.update(c,i,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let h=0;for(let d=0;d<u;d++)h+=c[d];n.update(h,i,1)}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a}function dC(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){let E=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(E.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(E){return!(E!==li&&i.convert(E)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(E){let y=E===Mi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(E!==lr&&E!==_r&&!y&&i.convert(E)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE))}function l(E){if(E==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";E="mediump"}return E==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp",u=l(c);u!==c&&(gt("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);let f=n.logarithmicDepthBuffer===!0,h=n.reversedDepthBuffer===!0&&e.has("EXT_clip_control");n.reversedDepthBuffer===!0&&h===!1&&gt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");let d=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),g=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=t.getParameter(t.MAX_TEXTURE_SIZE),p=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),m=t.getParameter(t.MAX_VERTEX_ATTRIBS),_=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),w=t.getParameter(t.MAX_VARYING_VECTORS),v=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),M=t.getParameter(t.MAX_SAMPLES),S=t.getParameter(t.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:h,maxTextures:d,maxVertexTextures:g,maxTextureSize:x,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:_,maxVaryings:w,maxFragmentUniforms:v,maxSamples:M,samples:S}}function pC(t){let e=this,n=null,i=0,r=!1,s=!1,o=new Ur,a=new Pt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){let d=f.length!==0||h||i!==0||r;return r=h,i=f.length,d},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,h){n=u(f,h,0)},this.setState=function(f,h,d){let g=f.clippingPlanes,x=f.clipIntersection,p=f.clipShadows,m=t.get(f);if(!r||g===null||g.length===0||s&&!p)s?u(null):c();else{let _=s?0:i,w=_*4,v=m.clippingState||null;l.value=v,v=u(g,h,w,d);for(let M=0;M!==w;++M)v[M]=n[M];m.clippingState=v,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=_}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,h,d,g){let x=f!==null?f.length:0,p=null;if(x!==0){if(p=l.value,g!==!0||p===null){let m=d+x*4,_=h.matrixWorldInverse;a.getNormalMatrix(_),(p===null||p.length<m)&&(p=new Float32Array(m));for(let w=0,v=d;w!==x;++w,v+=4)o.copy(f[w]).applyMatrix4(_,a),o.normal.toArray(p,v),p[v+3]=o.constant}l.value=p,l.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,p}}var Fl=4,mC=6,gC=20,xC=256,Au=new Ws,MM=new Gt,Lg=null,Dg=0,Ng=0,Fg=!1,vC=new C,va=new C,up=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,n=0,i=.1,r=100,s={}){let{size:o=256,position:a=vC}=s;Lg=this._renderer.getRenderTarget(),Dg=this._renderer.getActiveCubeFace(),Ng=this._renderer.getActiveMipmapLevel(),Fg=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,a),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wM(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=SM(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Lg,Dg,Ng),this._renderer.xr.enabled=Fg,e.scissorTest=!1,Nl(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Po||e.mapping===ga?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Lg=this._renderer.getRenderTarget(),Dg=this._renderer.getActiveCubeFace(),Ng=this._renderer.getActiveMipmapLevel(),Fg=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Wt,minFilter:Wt,generateMipmaps:!1,type:Mi,format:li,colorSpace:fa,depthBuffer:!1},r=bM(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=bM(e,n,i);let{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=yC(s)),this._blurMaterial=MC(s,e,n),this._ggxMaterial=_C(s,e,n)}return r}_compileMaterial(e){let n=new nn(new Dn,e);this._renderer.compile(n,Au)}_sceneToCubeUV(e,n,i,r,s){let l=new yi(90,1,n,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,h=f.autoClear,d=f.toneMapping;f.getClearColor(MM),f.toneMapping=ar,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(r),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new nn(new Rl,new iu({name:"PMREM.Background",side:Fi,depthWrite:!1,depthTest:!1})));let x=this._backgroundBox,p=x.material,m=!1,_=e.background;_?_.isColor&&(p.color.copy(_),e.background=null,m=!0):(p.color.copy(MM),m=!0);for(let w=0;w<6;w++){let v=w%3;v===0?(l.up.set(0,c[w],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[w],s.y,s.z)):v===1?(l.up.set(0,0,c[w]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[w],s.z)):(l.up.set(0,c[w],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[w]));let M=this._cubeSize;Nl(r,v*M,w>2?M:0,M,M),f.setRenderTarget(r),m&&f.render(x,l),f.render(e,l)}f.toneMapping=d,f.autoClear=h,e.background=_}_textureToCubeUV(e,n){let i=this._renderer,r=e.mapping===Po||e.mapping===ga;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=wM()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=SM());let s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;let a=s.uniforms;a.envMap.value=e;let l=this._cubeSize;Nl(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(o,Au)}_applyPMREM(e){let n=this._renderer,i=n.autoClear;n.autoClear=!1;let r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);n.autoClear=i}_applyGGXFilter(e,n,i){let r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;let l=o.uniforms,c=i/(this._lodMeshes.length-1),u=n/(this._lodMeshes.length-1),f=Math.sqrt(c*c-u*u),h=c*1.25,d=f*h,{_lodMax:g}=this,x=this._sizeLods[i],p=3*x*(i>g-Fl?i-g+Fl:0),m=4*(this._cubeSize-x);l.envMap.value=e.texture,l.roughness.value=d,l.mipInt.value=g-n,Nl(s,p,m,3*x,2*x),r.setRenderTarget(s),r.render(a,Au),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=g-i,Nl(e,p,m,3*x,2*x),r.setRenderTarget(e),r.render(a,Au)}_blur(e,n,i,r){let s=this._pingPongRenderTarget,o=Math.min(r,Math.PI)/Math.SQRT2;this._blurPass(e,s,n,i,o),this._blurPass(s,e,i,i,o)}_blurPass(e,n,i,r,s){let o=this._renderer,a=this._blurMaterial,l=this._lodMeshes[r];l.material=a;let c=a.uniforms;c.envMap.value=e.texture,c.sigma.value=s,c.mipInt.value=this._lodMax-i;let u=this._sizeLods[r],f=3*u*(r>this._lodMax-Fl?r-this._lodMax+Fl:0),h=4*(this._cubeSize-u);Nl(n,f,h,3*u,2*u),o.setRenderTarget(n),o.render(l,Au)}};function yC(t){let e=[],n=[],i=t,r=t-Fl+1+mC;for(let s=0;s<r;s++){let o=Math.pow(2,i);e.push(o);let a=1/(o-2),l=-a,c=1+a,u=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,h=6,d=3,g=new Float32Array(d*h*f),x=new Float32Array(d*h*f);for(let m=0;m<f;m++){let _=m%3*2/3-1,w=m>2?0:-1,v=[_,w,0,_+2/3,w,0,_+2/3,w+1,0,_,w,0,_+2/3,w+1,0,_,w+1,0];g.set(v,d*h*m);for(let M=0;M<h;M++){let S=u[M*2]*2-1,E=u[M*2+1]*2-1;m===0?va.set(1,E,S):m===1?va.set(-S,1,-E):m===2?va.set(-S,E,1):m===3?va.set(-1,E,-S):m===4?va.set(-S,-1,E):va.set(S,E,-1),va.toArray(x,(m*h+M)*d)}}let p=new Dn;p.setAttribute("position",new Zt(g,d)),p.setAttribute("outputDirection",new Zt(x,d)),n.push(new nn(p,null)),i>Fl&&i--}return{lodMeshes:n,sizeLods:e}}function bM(t,e,n){let i=new Yn(t,e,n);return i.texture.mapping=xu,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Nl(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function _C(t,e,n){return new $t({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:xC,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:dp(),fragmentShader:`

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
		`,blending:Wi,depthTest:!1,depthWrite:!1})}function MC(t,e,n){return new $t({name:"SphericalGaussianBlur",defines:{SAMPLES:gC,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:dp(),fragmentShader:`

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
		`,blending:Wi,depthTest:!1,depthWrite:!1})}function SM(){return new $t({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:dp(),fragmentShader:`

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
		`,blending:Wi,depthTest:!1,depthWrite:!1})}function wM(){return new $t({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:dp(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Wi,depthTest:!1,depthWrite:!1})}function dp(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}var fp=class extends Yn{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;let i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new lu(r),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;let i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Rl(5,5,5),s=new $t({name:"CubemapFromEquirect",uniforms:xa(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:Fi,blending:Wi});s.uniforms.tEquirect.value=n;let o=new nn(r,s),a=n.minFilter;return n.minFilter===Io&&(n.minFilter=Wt),new gd(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n=!0,i=!0,r=!0){let s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}};function bC(t){let e=new WeakMap,n=new WeakMap,i=null;function r(h,d=!1){return h==null?null:d?o(h):s(h)}function s(h){if(h&&h.isTexture){let d=h.mapping;if(d===_d||d===Md)if(e.has(h)){let g=e.get(h).texture;return a(g,h.mapping)}else{let g=h.image;if(g&&g.height>0){let x=new fp(g.height);return x.fromEquirectangularTexture(t,h),e.set(h,x),h.addEventListener("dispose",c),a(x.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture){let d=h.mapping,g=d===_d||d===Md,x=d===Po||d===ga;if(g||x){let p=n.get(h),m=p!==void 0?p.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==m)return i===null&&(i=new up(t)),p=g?i.fromEquirectangular(h,p):i.fromCubemap(h,p),p.texture.pmremVersion=h.pmremVersion,n.set(h,p),p.texture;if(p!==void 0)return p.texture;{let _=h.image;return g&&_&&_.height>0||x&&_&&l(_)?(i===null&&(i=new up(t)),p=g?i.fromEquirectangular(h):i.fromCubemap(h),p.texture.pmremVersion=h.pmremVersion,n.set(h,p),h.addEventListener("dispose",u),p.texture):null}}}return h}function a(h,d){return d===_d?h.mapping=Po:d===Md&&(h.mapping=ga),h}function l(h){let d=0,g=6;for(let x=0;x<g;x++)h[x]!==void 0&&d++;return d===g}function c(h){let d=h.target;d.removeEventListener("dispose",c);let g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function u(h){let d=h.target;d.removeEventListener("dispose",u);let g=n.get(d);g!==void 0&&(n.delete(d),g.dispose())}function f(){e=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:f}}function SC(t){let e={};function n(i){if(e[i]!==void 0)return e[i];let r=t.getExtension(i);return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){let r=n(i);return r===null&&ua("WebGLRenderer: "+i+" extension not supported."),r}}}function wC(t,e,n,i){let r={},s=new WeakMap;function o(f){let h=f.target;h.index!==null&&e.remove(h.index);for(let g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",o),delete r[h.id];let d=s.get(h);d&&(e.remove(d),s.delete(h)),i.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,n.memory.geometries--}function a(f,h){return r[h.id]===!0||(h.addEventListener("dispose",o),r[h.id]=!0,n.memory.geometries++),h}function l(f){let h=f.attributes;for(let d in h)e.update(h[d],t.ARRAY_BUFFER)}function c(f){let h=[],d=f.index,g=f.attributes.position,x=0;if(g===void 0)return;if(d!==null){let _=d.array;x=d.version;for(let w=0,v=_.length;w<v;w+=3){let M=_[w+0],S=_[w+1],E=_[w+2];h.push(M,S,S,E,E,M)}}else{let _=g.array;x=g.version;for(let w=0,v=_.length/3-1;w<v;w+=3){let M=w+0,S=w+1,E=w+2;h.push(M,S,S,E,E,M)}}let p=new(g.count>=65535?nu:tu)(h,1);p.version=x;let m=s.get(f);m&&e.remove(m),s.set(f,p)}function u(f){let h=s.get(f);if(h){let d=f.index;d!==null&&h.version<d.version&&c(f)}else c(f);return s.get(f)}return{get:a,update:l,getWireframeAttribute:u}}function AC(t,e,n){let i;function r(f){i=f}let s,o;function a(f){s=f.type,o=f.bytesPerElement}function l(f,h){t.drawElements(i,h,s,f*o),n.update(h,i,1)}function c(f,h,d){d!==0&&(t.drawElementsInstanced(i,h,s,f*o,d),n.update(h,i,d))}function u(f,h,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,h,0,s,f,0,d);let x=0;for(let p=0;p<d;p++)x+=h[p];n.update(x,i,1)}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function TC(t){let e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(s/3);break;case t.LINES:n.lines+=a*(s/2);break;case t.LINE_STRIP:n.lines+=a*(s-1);break;case t.LINE_LOOP:n.lines+=a*s;break;case t.POINTS:n.points+=a*s;break;default:_t("WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function EC(t,e,n){let i=new WeakMap,r=new Yt;function s(o,a,l){let c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=u!==void 0?u.length:0,h=i.get(a);if(h===void 0||h.count!==f){let A=function(){E.dispose(),i.delete(a),a.removeEventListener("dispose",A)};h!==void 0&&h.texture.dispose();let d=a.morphAttributes.position!==void 0,g=a.morphAttributes.normal!==void 0,x=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],_=a.morphAttributes.color||[],w=0;d===!0&&(w=1),g===!0&&(w=2),x===!0&&(w=3);let v=a.attributes.position.count*w,M=1;v>e.maxTextureSize&&(M=Math.ceil(v/e.maxTextureSize),v=e.maxTextureSize);let S=new Float32Array(v*M*4*f),E=new eu(S,v,M,f);E.type=_r,E.needsUpdate=!0;let y=w*4;for(let T=0;T<f;T++){let I=p[T],F=m[T],z=_[T],L=v*M*4*T;for(let V=0;V<I.count;V++){let G=V*y;d===!0&&(r.fromBufferAttribute(I,V),S[L+G+0]=r.x,S[L+G+1]=r.y,S[L+G+2]=r.z,S[L+G+3]=0),g===!0&&(r.fromBufferAttribute(F,V),S[L+G+4]=r.x,S[L+G+5]=r.y,S[L+G+6]=r.z,S[L+G+7]=0),x===!0&&(r.fromBufferAttribute(z,V),S[L+G+8]=r.x,S[L+G+9]=r.y,S[L+G+10]=r.z,S[L+G+11]=z.itemSize===4?r.w:1)}}h={count:f,texture:E,size:new xt(v,M)},i.set(a,h),a.addEventListener("dispose",A)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let d=0;for(let x=0;x<c.length;x++)d+=c[x];let g=a.morphTargetsRelative?1:1-d;l.getUniforms().setValue(t,"morphTargetBaseInfluence",g),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",h.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",h.size)}return{update:s}}function RC(t,e,n,i,r){let s=new WeakMap;function o(c){let u=r.render.frame,f=c.geometry,h=e.get(c,f);if(s.get(h)!==u&&(e.update(h),s.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(n.update(c.instanceMatrix,t.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,t.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){let d=c.skeleton;s.get(d)!==u&&(d.update(),s.set(d,u))}return h}function a(){s=new WeakMap}function l(c){let u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),n.remove(u.instanceMatrix),u.instanceColor!==null&&n.remove(u.instanceColor)}return{update:o,dispose:a}}var CC={[og]:"LINEAR_TONE_MAPPING",[ag]:"REINHARD_TONE_MAPPING",[lg]:"CINEON_TONE_MAPPING",[cg]:"ACES_FILMIC_TONE_MAPPING",[fg]:"AGX_TONE_MAPPING",[hg]:"NEUTRAL_TONE_MAPPING",[ug]:"CUSTOM_TONE_MAPPING"};function PC(t,e,n,i,r,s){let o=new Yn(e,n,{type:t,depthBuffer:r,stencilBuffer:s,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),a=null,l=null,c=new Dn;c.setAttribute("position",new fn([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new fn([0,2,0,0,2,0],2));let u=new id({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),f=new nn(c,u),h=new Ws(-1,1,1,-1,0,1),d=null,g=null,x=!1,p,m=null,_=[],w=!1;this.setSize=function(v,M){o.setSize(v,M),a!==null&&a.setSize(v,M),l!==null&&l.setSize(v,M);for(let S=0;S<_.length;S++){let E=_[S];E.setSize&&E.setSize(v,M)}},this.setEffects=function(v){_=v,w=_.length>0&&_[0].isRenderPass===!0;let M=o.width,S=o.height;_.length>0&&a===null&&(a=new Yn(M,S,{type:Mi,depthBuffer:!1,stencilBuffer:!1}),l=new Yn(M,S,{type:Mi,depthBuffer:!1,stencilBuffer:!1}));for(let E=0;E<_.length;E++){let y=_[E];y.setSize&&y.setSize(M,S)}},this.begin=function(v,M){if(x||v.toneMapping===ar&&_.length===0)return!1;if(m=M,M!==null){let S=M.width,E=M.height;(o.width!==S||o.height!==E)&&this.setSize(S,E)}return w===!1&&v.setRenderTarget(o),p=v.toneMapping,v.toneMapping=ar,!0},this.hasRenderPass=function(){return w},this.end=function(v,M){v.toneMapping=p,x=!0;let S=o,E=a;for(let y=0;y<_.length;y++){let A=_[y];A.enabled!==!1&&(A.render(v,E,S,M),A.needsSwap!==!1&&(S=E,E=E===a?l:a))}if(d!==v.outputColorSpace||g!==v.toneMapping){d=v.outputColorSpace,g=v.toneMapping,u.defines={},kt.getTransfer(d)===an&&(u.defines.SRGB_TRANSFER="");let y=CC[g];y&&(u.defines[y]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=S.texture,v.setRenderTarget(m),v.render(f,h),m=null,x=!1},this.isCompositing=function(){return x},this.dispose=function(){o.dispose(),a!==null&&a.dispose(),l!==null&&l.dispose(),c.dispose(),u.dispose()}}var WM=new Di,kg=new To(1,1),$M=new eu,XM=new jh,YM=new lu,AM=[],TM=[],EM=new Float32Array(16),RM=new Float32Array(9),CM=new Float32Array(4);function Ul(t,e,n){let i=t[0];if(i<=0||i>0)return t;let r=e*n,s=AM[r];if(s===void 0&&(s=new Float32Array(r),AM[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(s,a)}return s}function Jn(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Qn(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function pp(t,e){let n=TM[e];n===void 0&&(n=new Int32Array(e),TM[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function IC(t,e){let n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function LC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Jn(n,e))return;t.uniform2fv(this.addr,e),Qn(n,e)}}function DC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Jn(n,e))return;t.uniform3fv(this.addr,e),Qn(n,e)}}function NC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Jn(n,e))return;t.uniform4fv(this.addr,e),Qn(n,e)}}function FC(t,e){let n=this.cache,i=e.elements;if(i===void 0){if(Jn(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Qn(n,e)}else{if(Jn(n,i))return;CM.set(i),t.uniformMatrix2fv(this.addr,!1,CM),Qn(n,i)}}function OC(t,e){let n=this.cache,i=e.elements;if(i===void 0){if(Jn(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Qn(n,e)}else{if(Jn(n,i))return;RM.set(i),t.uniformMatrix3fv(this.addr,!1,RM),Qn(n,i)}}function UC(t,e){let n=this.cache,i=e.elements;if(i===void 0){if(Jn(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Qn(n,e)}else{if(Jn(n,i))return;EM.set(i),t.uniformMatrix4fv(this.addr,!1,EM),Qn(n,i)}}function kC(t,e){let n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function BC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Jn(n,e))return;t.uniform2iv(this.addr,e),Qn(n,e)}}function zC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Jn(n,e))return;t.uniform3iv(this.addr,e),Qn(n,e)}}function VC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Jn(n,e))return;t.uniform4iv(this.addr,e),Qn(n,e)}}function GC(t,e){let n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function HC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Jn(n,e))return;t.uniform2uiv(this.addr,e),Qn(n,e)}}function WC(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Jn(n,e))return;t.uniform3uiv(this.addr,e),Qn(n,e)}}function $C(t,e){let n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Jn(n,e))return;t.uniform4uiv(this.addr,e),Qn(n,e)}}function XC(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(kg.compareFunction=n.isReversedDepthBuffer()?ap:op,s=kg):s=WM,n.setTexture2D(e||s,r)}function YC(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||XM,r)}function qC(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||YM,r)}function jC(t,e,n){let i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||$M,r)}function ZC(t){switch(t){case 5126:return IC;case 35664:return LC;case 35665:return DC;case 35666:return NC;case 35674:return FC;case 35675:return OC;case 35676:return UC;case 5124:case 35670:return kC;case 35667:case 35671:return BC;case 35668:case 35672:return zC;case 35669:case 35673:return VC;case 5125:return GC;case 36294:return HC;case 36295:return WC;case 36296:return $C;case 35678:case 36198:case 36298:case 36306:case 35682:return XC;case 35679:case 36299:case 36307:return YC;case 35680:case 36300:case 36308:case 36293:return qC;case 36289:case 36303:case 36311:case 36292:return jC}}function KC(t,e){t.uniform1fv(this.addr,e)}function JC(t,e){let n=Ul(e,this.size,2);t.uniform2fv(this.addr,n)}function QC(t,e){let n=Ul(e,this.size,3);t.uniform3fv(this.addr,n)}function e3(t,e){let n=Ul(e,this.size,4);t.uniform4fv(this.addr,n)}function t3(t,e){let n=Ul(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function n3(t,e){let n=Ul(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function i3(t,e){let n=Ul(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function r3(t,e){t.uniform1iv(this.addr,e)}function s3(t,e){t.uniform2iv(this.addr,e)}function o3(t,e){t.uniform3iv(this.addr,e)}function a3(t,e){t.uniform4iv(this.addr,e)}function l3(t,e){t.uniform1uiv(this.addr,e)}function c3(t,e){t.uniform2uiv(this.addr,e)}function u3(t,e){t.uniform3uiv(this.addr,e)}function f3(t,e){t.uniform4uiv(this.addr,e)}function h3(t,e,n){let i=this.cache,r=e.length,s=pp(n,r);Jn(i,s)||(t.uniform1iv(this.addr,s),Qn(i,s));let o;this.type===t.SAMPLER_2D_SHADOW?o=kg:o=WM;for(let a=0;a!==r;++a)n.setTexture2D(e[a]||o,s[a])}function d3(t,e,n){let i=this.cache,r=e.length,s=pp(n,r);Jn(i,s)||(t.uniform1iv(this.addr,s),Qn(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||XM,s[o])}function p3(t,e,n){let i=this.cache,r=e.length,s=pp(n,r);Jn(i,s)||(t.uniform1iv(this.addr,s),Qn(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||YM,s[o])}function m3(t,e,n){let i=this.cache,r=e.length,s=pp(n,r);Jn(i,s)||(t.uniform1iv(this.addr,s),Qn(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||$M,s[o])}function g3(t){switch(t){case 5126:return KC;case 35664:return JC;case 35665:return QC;case 35666:return e3;case 35674:return t3;case 35675:return n3;case 35676:return i3;case 5124:case 35670:return r3;case 35667:case 35671:return s3;case 35668:case 35672:return o3;case 35669:case 35673:return a3;case 5125:return l3;case 36294:return c3;case 36295:return u3;case 36296:return f3;case 35678:case 36198:case 36298:case 36306:case 35682:return h3;case 35679:case 36299:case 36307:return d3;case 35680:case 36300:case 36308:case 36293:return p3;case 36289:case 36303:case 36311:case 36292:return m3}}var Bg=class{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=ZC(n.type)}},zg=class{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=g3(n.type)}},Vg=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){let r=this.seq;for(let s=0,o=r.length;s!==o;++s){let a=r[s];a.setValue(e,n[a.id],i)}}},Og=/(\w+)(\])?(\[|\.)?/g;function PM(t,e){t.seq.push(e),t.map[e.id]=e}function x3(t,e,n){let i=t.name,r=i.length;for(Og.lastIndex=0;;){let s=Og.exec(i),o=Og.lastIndex,a=s[1],l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){PM(n,c===void 0?new Bg(a,t,e):new zg(a,t,e));break}else{let f=n.map[a];f===void 0&&(f=new Vg(a),PM(n,f)),n=f}}}var Ol=class{constructor(e,n){this.seq=[],this.map={};let i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){let a=e.getActiveUniform(n,o),l=e.getUniformLocation(n,a.name);x3(a,l,this)}let r=[],s=[];for(let o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(e,n,i,r){let s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){let r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){let a=n[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,n){let i=[];for(let r=0,s=e.length;r!==s;++r){let o=e[r];o.id in n&&i.push(o)}return i}};function IM(t,e,n){let i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}var v3=37297,y3=0;function _3(t,e){let n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){let a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}var LM=new Pt;function M3(t){kt._getMatrix(LM,kt.workingColorSpace,t);let e=`mat3( ${LM.elements.map(n=>n.toFixed(4))} )`;switch(kt.getTransfer(t)){case Zc:return[e,"LinearTransferOETF"];case an:return[e,"sRGBTransferOETF"];default:return gt("WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function DM(t,e,n){let i=t.getShaderParameter(e,t.COMPILE_STATUS),s=(t.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";let o=/ERROR: 0:(\d+)/.exec(s);if(o){let a=parseInt(o[1]);return n.toUpperCase()+`

`+s+`

`+_3(t.getShaderSource(e),a)}else return s}function b3(t,e){let n=M3(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}var S3={[og]:"Linear",[ag]:"Reinhard",[lg]:"Cineon",[cg]:"ACESFilmic",[fg]:"AgX",[hg]:"Neutral",[ug]:"Custom"};function w3(t,e){let n=S3[e];return n===void 0?(gt("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+t+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}var cp=new C;function A3(){kt.getLuminanceCoefficients(cp);let t=cp.x.toFixed(4),e=cp.y.toFixed(4),n=cp.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function T3(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Eu).join(`
`)}function E3(t){let e=[];for(let n in t){let i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function R3(t,e){let n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){let s=t.getActiveAttrib(e,r),o=s.name,a=1;s.type===t.FLOAT_MAT2&&(a=2),s.type===t.FLOAT_MAT3&&(a=3),s.type===t.FLOAT_MAT4&&(a=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function Eu(t){return t!==""}function NM(t,e){let n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function FM(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var C3=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gg(t){return t.replace(C3,I3)}var P3=new Map;function I3(t,e){let n=Ut[e];if(n===void 0){let i=P3.get(e);if(i!==void 0)n=Ut[i],gt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return Gg(n)}var L3=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function OM(t){return t.replace(L3,D3)}function D3(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function UM(t){let e=`precision ${t.precision} float;
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
#define LOW_PRECISION`),e}var N3={[mu]:"SHADOWMAP_TYPE_PCF",[Pl]:"SHADOWMAP_TYPE_VSM"};function F3(t){return N3[t.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var O3={[Po]:"ENVMAP_TYPE_CUBE",[ga]:"ENVMAP_TYPE_CUBE",[xu]:"ENVMAP_TYPE_CUBE_UV"};function U3(t){return t.envMap===!1?"ENVMAP_TYPE_CUBE":O3[t.envMapMode]||"ENVMAP_TYPE_CUBE"}var k3={[ga]:"ENVMAP_MODE_REFRACTION"};function B3(t){return t.envMap===!1?"ENVMAP_MODE_REFLECTION":k3[t.envMapMode]||"ENVMAP_MODE_REFLECTION"}var z3={[sg]:"ENVMAP_BLENDING_MULTIPLY",[tM]:"ENVMAP_BLENDING_MIX",[nM]:"ENVMAP_BLENDING_ADD"};function V3(t){return t.envMap===!1?"ENVMAP_BLENDING_NONE":z3[t.combine]||"ENVMAP_BLENDING_NONE"}function G3(t){let e=t.envMapCubeUVHeight;if(e===null)return null;let n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),112)),texelHeight:i,maxMip:n}}function H3(t,e,n,i){let r=t.getContext(),s=n.defines,o=n.vertexShader,a=n.fragmentShader,l=F3(n),c=U3(n),u=B3(n),f=V3(n),h=G3(n),d=T3(n),g=E3(s),x=r.createProgram(),p,m,_=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(Eu).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g].filter(Eu).join(`
`),m.length>0&&(m+=`
`)):(p=[UM(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Eu).join(`
`),m=[UM(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,g,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.retroreflection?"#define USE_RETROREFLECTION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==ar?"#define TONE_MAPPING":"",n.toneMapping!==ar?Ut.tonemapping_pars_fragment:"",n.toneMapping!==ar?w3("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Ut.colorspace_pars_fragment,b3("linearToOutputTexel",n.outputColorSpace),A3(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(Eu).join(`
`)),o=Gg(o),o=NM(o,n),o=FM(o,n),a=Gg(a),a=NM(a,n),a=FM(a,n),o=OM(o),a=OM(a),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,p=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",n.glslVersion===bg?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===bg?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);let w=_+p+o,v=_+m+a,M=IM(r,r.VERTEX_SHADER,w),S=IM(r,r.FRAGMENT_SHADER,v);r.attachShader(x,M),r.attachShader(x,S),n.index0AttributeName!==void 0?r.bindAttribLocation(x,0,n.index0AttributeName):n.hasPositionAttribute===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function E(I){if(t.debug.checkShaderErrors){let F=r.getProgramInfoLog(x)||"",z=r.getShaderInfoLog(M)||"",L=r.getShaderInfoLog(S)||"",V=F.trim(),G=z.trim(),P=L.trim(),O=!0,k=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(O=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,x,M,S);else{let $=DM(r,M,"vertex"),j=DM(r,S,"fragment");_t("WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+V+`
`+$+`
`+j)}else V!==""?gt("WebGLProgram: Program Info Log:",V):(G===""||P==="")&&(k=!1);k&&(I.diagnostics={runnable:O,programLog:V,vertexShader:{log:G,prefix:p},fragmentShader:{log:P,prefix:m}})}r.deleteShader(M),r.deleteShader(S),y=new Ol(r,x),A=R3(r,x)}let y;this.getUniforms=function(){return y===void 0&&E(this),y};let A;this.getAttributes=function(){return A===void 0&&E(this),A};let T=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return T===!1&&(T=r.getProgramParameter(x,v3)),T},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=y3++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=M,this.fragmentShader=S,this}var W3=0,Hg=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,n,i){let r=this._getShaderCacheForMaterial(e);return r.has(n)===!1&&(r.add(n),n.usedTimes++),r.has(i)===!1&&(r.add(i),i.usedTimes++),this}remove(e){let n=this.materialCache.get(e);for(let i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let n=this.materialCache,i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){let n=this.shaderCache,i=n.get(e);return i===void 0&&(i=new Wg(e),n.set(e,i)),i}},Wg=class{constructor(e){this.id=W3++,this.code=e,this.usedTimes=0}};function $3(t){return t===Do||t===Su||t===wu}function X3(t,e,n,i,r,s){let o=new Al,a=new Hg,l=new Set,c=[],u=new Map,f=i.logarithmicDepthBuffer,h=i.precision,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(y){return l.add(y),y===0?"uv":`uv${y}`}function x(y,A,T,I,F,z){let L=I.fog,V=F.geometry,G=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?I.environment:null,P=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,O=e.get(y.envMap||G,P),k=O&&O.mapping===xu?O.image.height:null,$=d[y.type];y.precision!==null&&(h=i.getMaxPrecision(y.precision),h!==y.precision&&gt("WebGLProgram.getParameters:",y.precision,"not supported, using",h,"instead."));let j=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,Me=j!==void 0?j.length:0,ve=0;V.morphAttributes.position!==void 0&&(ve=1),V.morphAttributes.normal!==void 0&&(ve=2),V.morphAttributes.color!==void 0&&(ve=3);let Fe,We,ke,ee;if($){let At=ds[$];Fe=At.vertexShader,We=At.fragmentShader}else{Fe=y.vertexShader,We=y.fragmentShader;let At=a.getVertexShaderStage(y),ot=a.getFragmentShaderStage(y);a.update(y,At,ot),ke=At.id,ee=ot.id}let ie=t.getRenderTarget(),Te=t.state.buffers.depth.getReversed(),$e=F.isInstancedMesh===!0,re=F.isBatchedMesh===!0,se=!!y.map,te=!!y.matcap,me=!!O,Se=!!y.aoMap,nt=!!y.lightMap,he=!!y.bumpMap&&y.wireframe===!1,Ie=!!y.normalMap,qe=!!y.displacementMap,Ne=!!y.emissiveMap,ut=!!y.metalnessMap,St=!!y.roughnessMap,U=y.anisotropy>0,Qt=y.clearcoat>0,wt=y.dispersion>0,N=y.retroreflectivity>0,b=y.iridescence>0,q=y.sheen>0,J=y.transmission>0,oe=U&&!!y.anisotropyMap,Re=Qt&&!!y.clearcoatMap,D=Qt&&!!y.clearcoatNormalMap,B=Qt&&!!y.clearcoatRoughnessMap,X=b&&!!y.iridescenceMap,xe=b&&!!y.iridescenceThicknessMap,De=q&&!!y.sheenColorMap,Ee=q&&!!y.sheenRoughnessMap,Ce=!!y.specularMap,ze=!!y.specularColorMap,rt=!!y.specularIntensityMap,yt=J&&!!y.transmissionMap,W=J&&!!y.thicknessMap,Be=!!y.gradientMap,le=!!y.alphaMap,Oe=y.alphaTest>0,Ge=!!y.alphaHash,_e=!!y.extensions,st=ar;y.toneMapped&&(ie===null||ie.isXRRenderTarget===!0)&&(st=t.toneMapping);let ue={shaderID:$,shaderType:y.type,shaderName:y.name,vertexShader:Fe,fragmentShader:We,defines:y.defines,customVertexShaderID:ke,customFragmentShaderID:ee,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:h,batching:re,batchingColor:re&&F._colorsTexture!==null,instancing:$e,instancingColor:$e&&F.instanceColor!==null,instancingMorph:$e&&F.morphTexture!==null,outputColorSpace:ie===null?t.outputColorSpace:ie.isXRRenderTarget===!0?ie.texture.colorSpace:kt.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:se,matcap:te,envMap:me,envMapMode:me&&O.mapping,envMapCubeUVHeight:k,aoMap:Se,lightMap:nt,bumpMap:he,normalMap:Ie,displacementMap:qe,emissiveMap:Ne,normalMapObjectSpace:Ie&&y.normalMapType===sM,normalMapTangentSpace:Ie&&y.normalMapType===_g,packedNormalMap:Ie&&y.normalMapType===_g&&$3(y.normalMap.format),metalnessMap:ut,roughnessMap:St,anisotropy:U,anisotropyMap:oe,clearcoat:Qt,clearcoatMap:Re,clearcoatNormalMap:D,clearcoatRoughnessMap:B,dispersion:wt,retroreflection:N,iridescence:b,iridescenceMap:X,iridescenceThicknessMap:xe,sheen:q,sheenColorMap:De,sheenRoughnessMap:Ee,specularMap:Ce,specularColorMap:ze,specularIntensityMap:rt,transmission:J,transmissionMap:yt,thicknessMap:W,gradientMap:Be,opaque:y.transparent===!1&&y.blending===or&&y.alphaToCoverage===!1,alphaMap:le,alphaTest:Oe,alphaHash:Ge,combine:y.combine,mapUv:se&&g(y.map.channel),aoMapUv:Se&&g(y.aoMap.channel),lightMapUv:nt&&g(y.lightMap.channel),bumpMapUv:he&&g(y.bumpMap.channel),normalMapUv:Ie&&g(y.normalMap.channel),displacementMapUv:qe&&g(y.displacementMap.channel),emissiveMapUv:Ne&&g(y.emissiveMap.channel),metalnessMapUv:ut&&g(y.metalnessMap.channel),roughnessMapUv:St&&g(y.roughnessMap.channel),anisotropyMapUv:oe&&g(y.anisotropyMap.channel),clearcoatMapUv:Re&&g(y.clearcoatMap.channel),clearcoatNormalMapUv:D&&g(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:B&&g(y.clearcoatRoughnessMap.channel),iridescenceMapUv:X&&g(y.iridescenceMap.channel),iridescenceThicknessMapUv:xe&&g(y.iridescenceThicknessMap.channel),sheenColorMapUv:De&&g(y.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&g(y.sheenRoughnessMap.channel),specularMapUv:Ce&&g(y.specularMap.channel),specularColorMapUv:ze&&g(y.specularColorMap.channel),specularIntensityMapUv:rt&&g(y.specularIntensityMap.channel),transmissionMapUv:yt&&g(y.transmissionMap.channel),thicknessMapUv:W&&g(y.thicknessMap.channel),alphaMapUv:le&&g(y.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(Ie||U),vertexNormals:!!V.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!V.attributes.uv&&(se||le),fog:!!L,useFog:y.fog===!0,fogExp2:!!L&&L.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||V.attributes.normal===void 0&&Ie===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Te,skinning:F.isSkinnedMesh===!0,hasPositionAttribute:V.attributes.position!==void 0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:Me,morphTextureStride:ve,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:z.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:y.dithering,shadowMapEnabled:t.shadowMap.enabled&&T.length>0,shadowMapType:t.shadowMap.type,toneMapping:st,decodeVideoTexture:se&&y.map.isVideoTexture===!0&&kt.getTransfer(y.map.colorSpace)===an,decodeVideoTextureEmissive:Ne&&y.emissiveMap.isVideoTexture===!0&&kt.getTransfer(y.emissiveMap.colorSpace)===an,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===fs,flipSided:y.side===Fi,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:_e&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(_e&&y.extensions.multiDraw===!0||re)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return ue.vertexUv1s=l.has(1),ue.vertexUv2s=l.has(2),ue.vertexUv3s=l.has(3),l.clear(),ue}function p(y){let A=[];if(y.shaderID?A.push(y.shaderID):(A.push(y.customVertexShaderID),A.push(y.customFragmentShaderID)),y.defines!==void 0)for(let T in y.defines)A.push(T),A.push(y.defines[T]);return y.isRawShaderMaterial===!1&&(m(A,y),_(A,y),A.push(t.outputColorSpace)),A.push(y.customProgramCacheKey),A.join()}function m(y,A){y.push(A.precision),y.push(A.outputColorSpace),y.push(A.envMapMode),y.push(A.envMapCubeUVHeight),y.push(A.mapUv),y.push(A.alphaMapUv),y.push(A.lightMapUv),y.push(A.aoMapUv),y.push(A.bumpMapUv),y.push(A.normalMapUv),y.push(A.displacementMapUv),y.push(A.emissiveMapUv),y.push(A.metalnessMapUv),y.push(A.roughnessMapUv),y.push(A.anisotropyMapUv),y.push(A.clearcoatMapUv),y.push(A.clearcoatNormalMapUv),y.push(A.clearcoatRoughnessMapUv),y.push(A.iridescenceMapUv),y.push(A.iridescenceThicknessMapUv),y.push(A.sheenColorMapUv),y.push(A.sheenRoughnessMapUv),y.push(A.specularMapUv),y.push(A.specularColorMapUv),y.push(A.specularIntensityMapUv),y.push(A.transmissionMapUv),y.push(A.thicknessMapUv),y.push(A.combine),y.push(A.fogExp2),y.push(A.sizeAttenuation),y.push(A.morphTargetsCount),y.push(A.morphAttributeCount),y.push(A.numSunLights),y.push(A.numDirLights),y.push(A.numPointLights),y.push(A.numSpotLights),y.push(A.numSpotLightMaps),y.push(A.numHemiLights),y.push(A.numRectAreaLights),y.push(A.numSunLightShadows),y.push(A.numDirLightShadows),y.push(A.numPointLightShadows),y.push(A.numSpotLightShadows),y.push(A.numSpotLightShadowsWithMaps),y.push(A.numLightProbes),y.push(A.shadowMapType),y.push(A.toneMapping),y.push(A.numClippingPlanes),y.push(A.numClipIntersection),y.push(A.depthPacking)}function _(y,A){o.disableAll(),A.instancing&&o.enable(0),A.instancingColor&&o.enable(1),A.instancingMorph&&o.enable(2),A.matcap&&o.enable(3),A.envMap&&o.enable(4),A.normalMapObjectSpace&&o.enable(5),A.normalMapTangentSpace&&o.enable(6),A.clearcoat&&o.enable(7),A.iridescence&&o.enable(8),A.alphaTest&&o.enable(9),A.vertexColors&&o.enable(10),A.vertexAlphas&&o.enable(11),A.vertexUv1s&&o.enable(12),A.vertexUv2s&&o.enable(13),A.vertexUv3s&&o.enable(14),A.vertexTangents&&o.enable(15),A.anisotropy&&o.enable(16),A.alphaHash&&o.enable(17),A.batching&&o.enable(18),A.dispersion&&o.enable(19),A.retroreflection&&o.enable(24),A.batchingColor&&o.enable(20),A.gradientMap&&o.enable(21),A.packedNormalMap&&o.enable(22),A.vertexNormals&&o.enable(23),y.push(o.mask),o.disableAll(),A.fog&&o.enable(0),A.useFog&&o.enable(1),A.flatShading&&o.enable(2),A.logarithmicDepthBuffer&&o.enable(3),A.reversedDepthBuffer&&o.enable(4),A.skinning&&o.enable(5),A.morphTargets&&o.enable(6),A.morphNormals&&o.enable(7),A.morphColors&&o.enable(8),A.premultipliedAlpha&&o.enable(9),A.shadowMapEnabled&&o.enable(10),A.doubleSided&&o.enable(11),A.flipSided&&o.enable(12),A.useDepthPacking&&o.enable(13),A.dithering&&o.enable(14),A.transmission&&o.enable(15),A.sheen&&o.enable(16),A.opaque&&o.enable(17),A.pointsUvs&&o.enable(18),A.decodeVideoTexture&&o.enable(19),A.decodeVideoTextureEmissive&&o.enable(20),A.alphaToCoverage&&o.enable(21),A.numLightProbeGrids>0&&o.enable(22),A.hasPositionAttribute&&o.enable(23),y.push(o.mask)}function w(y){let A=d[y.type],T;if(A){let I=ds[A];T=vM.clone(I.uniforms)}else T=y.uniforms;return T}function v(y,A){let T=u.get(A);return T!==void 0?++T.usedTimes:(T=new H3(t,A,y,r),c.push(T),u.set(A,T)),T}function M(y){if(--y.usedTimes===0){let A=c.indexOf(y);c[A]=c[c.length-1],c.pop(),u.delete(y.cacheKey),y.destroy()}}function S(y){a.remove(y)}function E(){a.dispose()}return{getParameters:x,getProgramCacheKey:p,getUniforms:w,acquireProgram:v,releaseProgram:M,releaseShaderCache:S,programs:c,dispose:E}}function Y3(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let a=t.get(o);return a===void 0&&(a={},t.set(o,a)),a}function i(o){t.delete(o)}function r(o,a,l){t.get(o)[a]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function q3(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.materialVariant!==e.materialVariant?t.materialVariant-e.materialVariant:t.z!==e.z?t.z-e.z:t.id-e.id}function kM(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function BM(){let t=[],e=0,n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(h){let d=0;return h.isInstancedMesh&&(d+=2),h.isSkinnedMesh&&(d+=1),d}function a(h,d,g,x,p,m){let _=t[e];return _===void 0?(_={id:h.id,object:h,geometry:d,material:g,materialVariant:o(h),groupOrder:x,renderOrder:h.renderOrder,z:p,group:m},t[e]=_):(_.id=h.id,_.object=h,_.geometry=d,_.material=g,_.materialVariant=o(h),_.groupOrder=x,_.renderOrder=h.renderOrder,_.z=p,_.group=m),e++,_}function l(h,d,g,x,p,m,_){_.reversedDepth===!0&&(p=-p);let w=a(h,d,g,x,p,m);g.transmission>0?i.push(w):g.transparent===!0?r.push(w):n.push(w)}function c(h,d,g,x,p,m){let _=a(h,d,g,x,p,m);g.transmission>0?i.unshift(_):g.transparent===!0?r.unshift(_):n.unshift(_)}function u(h,d){n.length>1&&n.sort(h||q3),i.length>1&&i.sort(d||kM),r.length>1&&r.sort(d||kM)}function f(){for(let h=e,d=t.length;h<d;h++){let g=t[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:l,unshift:c,finish:f,sort:u}}function j3(){let t=new WeakMap;function e(i,r){let s=t.get(i),o;return s===void 0?(o=new BM,t.set(i,[o])):r>=s.length?(o=new BM,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function Z3(){let t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"SunLight":case"DirectionalLight":n={direction:new C,color:new Gt};break;case"SpotLight":n={position:new C,direction:new C,color:new Gt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new C,color:new Gt,distance:0,decay:0};break;case"HemisphereLight":n={direction:new C,skyColor:new Gt,groundColor:new Gt};break;case"RectAreaLight":n={color:new Gt,position:new C,halfWidth:new C,halfHeight:new C};break}return t[e.id]=n,n}}}function K3(){let t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"SunLight":case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new xt,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}var J3=0;function Q3(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function eP(t){let e=new Z3,n=K3(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new C);let r=new C,s=new Ct,o=new Ct;function a(c){let u=0,f=0,h=0;for(let F=0;F<9;F++)i.probe[F].set(0,0,0);let d=0,g=0,x=0,p=0,m=0,_=0,w=0,v=0,M=0,S=0,E=0,y=0,A=0,T=0;c.sort(Q3);for(let F=0,z=c.length;F<z;F++){let L=c[F],V=L.color,G=L.intensity,P=L.distance,O=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===Do?O=L.shadow.map.texture:O=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)u+=V.r*G,f+=V.g*G,h+=V.b*G;else if(L.isLightProbe){for(let k=0;k<9;k++)i.probe[k].addScaledVector(L.sh.coefficients[k],G);T++}else if(L.isSunLight){let k=e.get(L);if(k.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let $=L.shadow,j=n.get(L);j.shadowIntensity=$.intensity,j.shadowBias=$.bias,j.shadowNormalBias=$.normalBias,j.shadowRadius=$.radius,j.shadowMapSize.copy($.mapSize).multiply($.getFrameExtents()),i.sunShadow[g]=j,i.sunShadowMap[g]=O;let Me=$.getViewportCount();for(let ve=0;ve<Me;ve++)i.sunShadowMatrix[x+ve]=$.getMatrix(ve),i.sunShadowCascade[x+ve]=$._cascadeData[ve];x+=Me,g++}i.sun[d]=k,d++}else if(L.isDirectionalLight){let k=e.get(L);if(k.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let $=L.shadow,j=n.get(L);j.shadowIntensity=$.intensity,j.shadowBias=$.bias,j.shadowNormalBias=$.normalBias,j.shadowRadius=$.radius,j.shadowMapSize=$.mapSize,i.directionalShadow[p]=j,i.directionalShadowMap[p]=O,i.directionalShadowMatrix[p]=L.shadow.matrix,M++}i.directional[p]=k,p++}else if(L.isSpotLight){let k=e.get(L);k.position.setFromMatrixPosition(L.matrixWorld),k.color.copy(V).multiplyScalar(G),k.distance=P,k.coneCos=Math.cos(L.angle),k.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),k.decay=L.decay,i.spot[_]=k;let $=L.shadow;if(L.map&&(i.spotLightMap[y]=L.map,y++,$.updateMatrices(L),L.castShadow&&A++),i.spotLightMatrix[_]=$.matrix,L.castShadow){let j=n.get(L);j.shadowIntensity=$.intensity,j.shadowBias=$.bias,j.shadowNormalBias=$.normalBias,j.shadowRadius=$.radius,j.shadowMapSize=$.mapSize,i.spotShadow[_]=j,i.spotShadowMap[_]=O,E++}_++}else if(L.isRectAreaLight){let k=e.get(L);k.color.copy(V).multiplyScalar(G),k.halfWidth.set(L.width*.5,0,0),k.halfHeight.set(0,L.height*.5,0),i.rectArea[w]=k,w++}else if(L.isPointLight){let k=e.get(L);if(k.color.copy(L.color).multiplyScalar(L.intensity),k.distance=L.distance,k.decay=L.decay,L.castShadow){let $=L.shadow,j=n.get(L);j.shadowIntensity=$.intensity,j.shadowBias=$.bias,j.shadowNormalBias=$.normalBias,j.shadowRadius=$.radius,j.shadowMapSize=$.mapSize,j.shadowCameraNear=$.camera.near,j.shadowCameraFar=$.camera.far,i.pointShadow[m]=j,i.pointShadowMap[m]=O,i.pointShadowMatrix[m]=L.shadow.matrix,S++}i.point[m]=k,m++}else if(L.isHemisphereLight){let k=e.get(L);k.skyColor.copy(L.color).multiplyScalar(G),k.groundColor.copy(L.groundColor).multiplyScalar(G),i.hemi[v]=k,v++}}w>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=Ve.LTC_FLOAT_1,i.rectAreaLTC2=Ve.LTC_FLOAT_2):(i.rectAreaLTC1=Ve.LTC_HALF_1,i.rectAreaLTC2=Ve.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=h;let I=i.hash;(I.sunLength!==d||I.directionalLength!==p||I.pointLength!==m||I.spotLength!==_||I.rectAreaLength!==w||I.hemiLength!==v||I.numSunShadows!==g||I.numDirectionalShadows!==M||I.numPointShadows!==S||I.numSpotShadows!==E||I.numSpotMaps!==y||I.numLightProbes!==T)&&(i.sun.length=d,i.directional.length=p,i.spot.length=_,i.rectArea.length=w,i.point.length=m,i.hemi.length=v,i.sunShadow.length=g,i.sunShadowMap.length=g,i.sunShadowMatrix.length=x,i.sunShadowCascade.length=x,i.directionalShadow.length=M,i.directionalShadowMap.length=M,i.directionalShadowMatrix.length=M,i.pointShadow.length=S,i.pointShadowMap.length=S,i.pointShadowMatrix.length=S,i.spotShadow.length=E,i.spotShadowMap.length=E,i.spotLightMatrix.length=E+y-A,i.spotLightMap.length=y,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=T,I.sunLength=d,I.directionalLength=p,I.pointLength=m,I.spotLength=_,I.rectAreaLength=w,I.hemiLength=v,I.numSunShadows=g,I.numDirectionalShadows=M,I.numPointShadows=S,I.numSpotShadows=E,I.numSpotMaps=y,I.numLightProbes=T,i.version=J3++)}function l(c,u){let f=0,h=0,d=0,g=0,x=0,p=0,m=u.matrixWorldInverse;for(let _=0,w=c.length;_<w;_++){let v=c[_];if(v.isSunLight){let M=i.sun[f];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(m),f++}else if(v.isDirectionalLight){let M=i.directional[h];M.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(m),h++}else if(v.isSpotLight){let M=i.spot[g];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(m),g++}else if(v.isRectAreaLight){let M=i.rectArea[x];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),o.identity(),s.copy(v.matrixWorld),s.premultiply(m),o.extractRotation(s),M.halfWidth.set(v.width*.5,0,0),M.halfHeight.set(0,v.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),x++}else if(v.isPointLight){let M=i.point[d];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),d++}else if(v.isHemisphereLight){let M=i.hemi[p];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(m),p++}}}return{setup:a,setupView:l,state:i}}function zM(t){let e=new eP(t),n=[],i=[],r=[];function s(h){f.camera=h,n.length=0,i.length=0,r.length=0}function o(h){n.push(h)}function a(h){i.push(h)}function l(h){r.push(h)}function c(){e.setup(n)}function u(h){e.setupView(n,h)}let f={lightsArray:n,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:f,setupLights:c,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function tP(t){let e=new WeakMap;function n(r,s=0){let o=e.get(r),a;return o===void 0?(a=new zM(t),e.set(r,[a])):s>=o.length?(a=new zM(t),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:n,dispose:i}}var nP=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,iP=`uniform sampler2D shadow_pass;
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
}`,rP=[new C(1,0,0),new C(-1,0,0),new C(0,1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1)],sP=[new C(0,-1,0),new C(0,-1,0),new C(0,0,1),new C(0,0,-1),new C(0,-1,0),new C(0,-1,0)],VM=new Ct,Tu=new C,Ug=new C;function oP(t,e,n){let i=new ou,r=new xt,s=new xt,o=new Yt,a=new rd,l=new sd,c={},u=n.maxTextureSize,f={[us]:Fi,[Fi]:us,[fs]:fs},h=new $t({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new xt},radius:{value:4}},vertexShader:nP,fragmentShader:iP}),d=h.clone();d.defines.HORIZONTAL_PASS=1;let g=new Dn;g.setAttribute("position",new Zt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new nn(g,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=mu;let m=this.type;this.render=function(S,E,y){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||S.length===0)return;this.type===k_&&(gt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=mu);let A=t.getRenderTarget(),T=t.getActiveCubeFace(),I=t.getActiveMipmapLevel(),F=t.state;F.setBlending(Wi),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);let z=m!==this.type;z&&E.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(V=>V.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,V=S.length;L<V;L++){let G=S[L],P=G.shadow;if(P===void 0){gt("WebGLShadowMap:",G,"has no shadow.");continue}if(P.autoUpdate===!1&&P.needsUpdate===!1)continue;r.copy(P.mapSize);let O=P.getFrameExtents();r.multiply(O),s.copy(P.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/O.x),r.x=s.x*O.x,P.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/O.y),r.y=s.y*O.y,P.mapSize.y=s.y));let k=t.state.buffers.depth.getReversed();if(P.camera._reversedDepth=k,P.map===null||z===!0){if(P.map!==null&&(P.map.depthTexture!==null&&(P.map.depthTexture.dispose(),P.map.depthTexture=null),P.map.dispose()),this.type===Pl){if(G.isPointLight){gt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}P.map=new Yn(r.x,r.y,{format:Do,type:Mi,minFilter:Wt,magFilter:Wt,generateMipmaps:!1}),P.map.texture.name=G.name+".shadowMap",P.map.depthTexture=new To(r.x,r.y,_r),P.map.depthTexture.name=G.name+".shadowMapDepth",P.map.depthTexture.format=rs,P.map.depthTexture.compareFunction=null,P.map.depthTexture.minFilter=ii,P.map.depthTexture.magFilter=ii}else G.isPointLight?(P.map=new fp(r.x),P.map.depthTexture=new nd(r.x,Br)):(P.map=new Yn(r.x,r.y),P.map.depthTexture=new To(r.x,r.y,Br)),P.map.depthTexture.name=G.name+".shadowMap",P.map.depthTexture.format=rs,this.type===mu?(P.map.depthTexture.compareFunction=k?ap:op,P.map.depthTexture.minFilter=Wt,P.map.depthTexture.magFilter=Wt):(P.map.depthTexture.compareFunction=null,P.map.depthTexture.minFilter=ii,P.map.depthTexture.magFilter=ii);P.camera.updateProjectionMatrix()}P.map.isWebGLCubeRenderTarget!==!0&&(P.map.width!==r.x||P.map.height!==r.y)&&P.map.setSize(r.x,r.y);let $=P.map.isWebGLCubeRenderTarget?6:P.getViewportCount();G.isPointLight!==!0&&P.updateMatrices(G,y);for(let j=0;j<$;j++){let Me=P.getCamera(j);if(G.isPointLight){let ve=P.camera,Fe=P.matrix,We=G.distance||ve.far;We!==ve.far&&(ve.far=We,ve.updateProjectionMatrix()),Tu.setFromMatrixPosition(G.matrixWorld),ve.position.copy(Tu),Ug.copy(ve.position),Ug.add(rP[j]),ve.up.copy(sP[j]),ve.lookAt(Ug),ve.updateMatrixWorld(),Fe.makeTranslation(-Tu.x,-Tu.y,-Tu.z),VM.multiplyMatrices(ve.projectionMatrix,ve.matrixWorldInverse),P._frustum.setFromProjectionMatrix(VM,ve.coordinateSystem,ve.reversedDepth)}if(P.map.isWebGLCubeRenderTarget)t.setRenderTarget(P.map,j),t.clear();else{j===0&&(t.setRenderTarget(P.map),t.clear());let ve=P.getViewport(j);o.set(s.x*ve.x,s.y*ve.y,s.x*ve.z,s.y*ve.w),F.viewport(o)}i=P.getFrustum(j),v(E,y,Me,G,this.type)}P.isPointLightShadow!==!0&&this.type===Pl&&_(P,y),P.needsUpdate=!1}m=this.type,p.needsUpdate=!1,t.setRenderTarget(A,T,I)};function _(S,E){let y=e.update(x);h.defines.VSM_SAMPLES!==S.blurSamples&&(h.defines.VSM_SAMPLES=S.blurSamples,d.defines.VSM_SAMPLES=S.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),S.mapPass===null?S.mapPass=new Yn(r.x,r.y,{format:Do,type:Mi}):(S.mapPass.width!==S.map.width||S.mapPass.height!==S.map.height)&&S.mapPass.setSize(S.map.width,S.map.height),h.uniforms.shadow_pass.value=S.map.depthTexture,h.uniforms.resolution.value.set(S.map.width,S.map.height),h.uniforms.radius.value=S.radius,t.setRenderTarget(S.mapPass),t.clear(),t.renderBufferDirect(E,null,y,h,x,null),d.uniforms.shadow_pass.value=S.mapPass.texture,d.uniforms.resolution.value.set(S.map.width,S.map.height),d.uniforms.radius.value=S.radius,t.setRenderTarget(S.map),t.clear(),t.renderBufferDirect(E,null,y,d,x,null)}function w(S,E,y,A){let T=null,I=y.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(I!==void 0)T=I;else if(T=y.isPointLight===!0?l:a,t.localClippingEnabled&&E.clipShadows===!0&&Array.isArray(E.clippingPlanes)&&E.clippingPlanes.length!==0||E.displacementMap&&E.displacementScale!==0||E.alphaMap&&E.alphaTest>0||E.map&&E.alphaTest>0||E.alphaToCoverage===!0){let F=T.uuid,z=E.uuid,L=c[F];L===void 0&&(L={},c[F]=L);let V=L[z];V===void 0&&(V=T.clone(),L[z]=V,E.addEventListener("dispose",M)),T=V}if(T.visible=E.visible,T.wireframe=E.wireframe,A===Pl?T.side=E.shadowSide!==null?E.shadowSide:E.side:T.side=E.shadowSide!==null?E.shadowSide:f[E.side],T.alphaMap=E.alphaMap,T.alphaTest=E.alphaToCoverage===!0?.5:E.alphaTest,T.map=E.map,T.clipShadows=E.clipShadows,T.clippingPlanes=E.clippingPlanes,T.clipIntersection=E.clipIntersection,T.displacementMap=E.displacementMap,T.displacementScale=E.displacementScale,T.displacementBias=E.displacementBias,T.wireframeLinewidth=E.wireframeLinewidth,T.linewidth=E.linewidth,y.isPointLight===!0&&T.isMeshDistanceMaterial===!0){let F=t.properties.get(T);F.light=y}return T}function v(S,E,y,A,T){if(S.visible===!1)return;if(S.layers.test(E.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&T===Pl)&&(!S.frustumCulled||S.intersectsFrustum(i))){S.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,S.matrixWorld);let z=e.update(S),L=S.material;if(Array.isArray(L)){let V=z.groups;for(let G=0,P=V.length;G<P;G++){let O=V[G],k=L[O.materialIndex];if(k&&k.visible){let $=w(S,k,A,T);S.onBeforeShadow(t,S,E,y,z,$,O),t.renderBufferDirect(y,null,z,$,S,O),S.onAfterShadow(t,S,E,y,z,$,O)}}}else if(L.visible){let V=w(S,L,A,T);S.onBeforeShadow(t,S,E,y,z,V,null),t.renderBufferDirect(y,null,z,V,S,null),S.onAfterShadow(t,S,E,y,z,V,null)}}let F=S.children;for(let z=0,L=F.length;z<L;z++)v(F[z],E,y,A,T)}function M(S){S.target.removeEventListener("dispose",M);for(let y in c){let A=c[y],T=S.target.uuid;T in A&&(A[T].dispose(),delete A[T])}}}function aP(t,e){function n(){let W=!1,Be=new Yt,le=null,Oe=new Yt(0,0,0,0);return{setMask:function(Ge){le!==Ge&&!W&&(t.colorMask(Ge,Ge,Ge,Ge),le=Ge)},setLocked:function(Ge){W=Ge},setClear:function(Ge,_e,st,ue,At){At===!0&&(Ge*=ue,_e*=ue,st*=ue),Be.set(Ge,_e,st,ue),Oe.equals(Be)===!1&&(t.clearColor(Ge,_e,st,ue),Oe.copy(Be))},reset:function(){W=!1,le=null,Oe.set(-1,0,0,0)}}}function i(){let W=!1,Be=!1,le=null,Oe=null,Ge=null;return{setReversed:function(_e){if(Be!==_e){let st=e.get("EXT_clip_control");_e?st.clipControlEXT(st.LOWER_LEFT_EXT,st.ZERO_TO_ONE_EXT):st.clipControlEXT(st.LOWER_LEFT_EXT,st.NEGATIVE_ONE_TO_ONE_EXT),Be=_e;let ue=Ge;Ge=null,this.setClear(ue)}},getReversed:function(){return Be},setTest:function(_e){_e?ie(t.DEPTH_TEST):Te(t.DEPTH_TEST)},setMask:function(_e){le!==_e&&!W&&(t.depthMask(_e),le=_e)},setFunc:function(_e){if(Be&&(_e=gM[_e]),Oe!==_e){switch(_e){case Oh:t.depthFunc(t.NEVER);break;case Uh:t.depthFunc(t.ALWAYS);break;case kh:t.depthFunc(t.LESS);break;case bl:t.depthFunc(t.LEQUAL);break;case Bh:t.depthFunc(t.EQUAL);break;case zh:t.depthFunc(t.GEQUAL);break;case Vh:t.depthFunc(t.GREATER);break;case Gh:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}Oe=_e}},setLocked:function(_e){W=_e},setClear:function(_e){Ge!==_e&&(Ge=_e,Be&&(_e=1-_e),t.clearDepth(_e))},reset:function(){W=!1,le=null,Oe=null,Ge=null,Be=!1}}}function r(){let W=!1,Be=null,le=null,Oe=null,Ge=null,_e=null,st=null,ue=null,At=null;return{setTest:function(ot){W||(ot?ie(t.STENCIL_TEST):Te(t.STENCIL_TEST))},setMask:function(ot){Be!==ot&&!W&&(t.stencilMask(ot),Be=ot)},setFunc:function(ot,Hn,zi){(le!==ot||Oe!==Hn||Ge!==zi)&&(t.stencilFunc(ot,Hn,zi),le=ot,Oe=Hn,Ge=zi)},setOp:function(ot,Hn,zi){(_e!==ot||st!==Hn||ue!==zi)&&(t.stencilOp(ot,Hn,zi),_e=ot,st=Hn,ue=zi)},setLocked:function(ot){W=ot},setClear:function(ot){At!==ot&&(t.clearStencil(ot),At=ot)},reset:function(){W=!1,Be=null,le=null,Oe=null,Ge=null,_e=null,st=null,ue=null,At=null}}}let s=new n,o=new i,a=new r,l=new WeakMap,c=new WeakMap,u={},f={},h={},d=new WeakMap,g=[],x=null,p=!1,m=null,_=null,w=null,v=null,M=null,S=null,E=null,y=new Gt(0,0,0),A=0,T=!1,I=null,F=null,z=null,L=null,V=null,G=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS),P=!1,O=0,k=t.getParameter(t.VERSION);k.indexOf("WebGL")!==-1?(O=parseFloat(/^WebGL (\d)/.exec(k)[1]),P=O>=1):k.indexOf("OpenGL ES")!==-1&&(O=parseFloat(/^OpenGL ES (\d)/.exec(k)[1]),P=O>=2);let $=null,j={},Me=t.getParameter(t.SCISSOR_BOX),ve=t.getParameter(t.VIEWPORT),Fe=new Yt().fromArray(Me),We=new Yt().fromArray(ve);function ke(W,Be,le,Oe){let Ge=new Uint8Array(4),_e=t.createTexture();t.bindTexture(W,_e),t.texParameteri(W,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(W,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let st=0;st<le;st++)W===t.TEXTURE_3D||W===t.TEXTURE_2D_ARRAY?t.texImage3D(Be,0,t.RGBA,1,1,Oe,0,t.RGBA,t.UNSIGNED_BYTE,Ge):t.texImage2D(Be+st,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,Ge);return _e}let ee={};ee[t.TEXTURE_2D]=ke(t.TEXTURE_2D,t.TEXTURE_2D,1),ee[t.TEXTURE_CUBE_MAP]=ke(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[t.TEXTURE_2D_ARRAY]=ke(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),ee[t.TEXTURE_3D]=ke(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ie(t.DEPTH_TEST),o.setFunc(bl),he(!1),Ie(tg),ie(t.CULL_FACE),Se(Wi);function ie(W){u[W]!==!0&&(t.enable(W),u[W]=!0)}function Te(W){u[W]!==!1&&(t.disable(W),u[W]=!1)}function $e(W,Be){return h[W]!==Be?(t.bindFramebuffer(W,Be),h[W]=Be,W===t.DRAW_FRAMEBUFFER&&(h[t.FRAMEBUFFER]=Be),W===t.FRAMEBUFFER&&(h[t.DRAW_FRAMEBUFFER]=Be),!0):!1}function re(W,Be){let le=g,Oe=!1;if(W){le=d.get(Be),le===void 0&&(le=[],d.set(Be,le));let Ge=W.textures;if(le.length!==Ge.length||le[0]!==t.COLOR_ATTACHMENT0){for(let _e=0,st=Ge.length;_e<st;_e++)le[_e]=t.COLOR_ATTACHMENT0+_e;le.length=Ge.length,Oe=!0}}else le[0]!==t.BACK&&(le[0]=t.BACK,Oe=!0);Oe&&t.drawBuffers(le)}function se(W){return x!==W?(t.useProgram(W),x=W,!0):!1}let te={[$s]:t.FUNC_ADD,[B_]:t.FUNC_SUBTRACT,[z_]:t.FUNC_REVERSE_SUBTRACT};te[V_]=t.MIN,te[G_]=t.MAX;let me={[H_]:t.ZERO,[gu]:t.ONE,[W_]:t.SRC_COLOR,[rg]:t.SRC_ALPHA,[Z_]:t.SRC_ALPHA_SATURATE,[q_]:t.DST_COLOR,[X_]:t.DST_ALPHA,[$_]:t.ONE_MINUS_SRC_COLOR,[Il]:t.ONE_MINUS_SRC_ALPHA,[j_]:t.ONE_MINUS_DST_COLOR,[Y_]:t.ONE_MINUS_DST_ALPHA,[K_]:t.CONSTANT_COLOR,[J_]:t.ONE_MINUS_CONSTANT_COLOR,[Q_]:t.CONSTANT_ALPHA,[eM]:t.ONE_MINUS_CONSTANT_ALPHA};function Se(W,Be,le,Oe,Ge,_e,st,ue,At,ot){if(W===Wi){p===!0&&(Te(t.BLEND),p=!1);return}if(p===!1&&(ie(t.BLEND),p=!0),W!==yd){if(W!==m||ot!==T){if((_!==$s||M!==$s)&&(t.blendEquation(t.FUNC_ADD),_=$s,M=$s),ot)switch(W){case or:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case ma:t.blendFunc(t.ONE,t.ONE);break;case ng:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case ig:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:_t("WebGLState: Invalid blending: ",W);break}else switch(W){case or:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case ma:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case ng:_t("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case ig:_t("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:_t("WebGLState: Invalid blending: ",W);break}w=null,v=null,S=null,E=null,y.set(0,0,0),A=0,m=W,T=ot}return}Ge=Ge||Be,_e=_e||le,st=st||Oe,(Be!==_||Ge!==M)&&(t.blendEquationSeparate(te[Be],te[Ge]),_=Be,M=Ge),(le!==w||Oe!==v||_e!==S||st!==E)&&(t.blendFuncSeparate(me[le],me[Oe],me[_e],me[st]),w=le,v=Oe,S=_e,E=st),(ue.equals(y)===!1||At!==A)&&(t.blendColor(ue.r,ue.g,ue.b,At),y.copy(ue),A=At),m=W,T=!1}function nt(W,Be){W.side===fs?Te(t.CULL_FACE):ie(t.CULL_FACE);let le=W.side===Fi;Be&&(le=!le),he(le),W.blending===or&&W.transparent===!1?Se(Wi):Se(W.blending,W.blendEquation,W.blendSrc,W.blendDst,W.blendEquationAlpha,W.blendSrcAlpha,W.blendDstAlpha,W.blendColor,W.blendAlpha,W.premultipliedAlpha),o.setFunc(W.depthFunc),o.setTest(W.depthTest),o.setMask(W.depthWrite),s.setMask(W.colorWrite);let Oe=W.stencilWrite;a.setTest(Oe),Oe&&(a.setMask(W.stencilWriteMask),a.setFunc(W.stencilFunc,W.stencilRef,W.stencilFuncMask),a.setOp(W.stencilFail,W.stencilZFail,W.stencilZPass)),Ne(W.polygonOffset,W.polygonOffsetFactor,W.polygonOffsetUnits),W.alphaToCoverage===!0?ie(t.SAMPLE_ALPHA_TO_COVERAGE):Te(t.SAMPLE_ALPHA_TO_COVERAGE)}function he(W){I!==W&&(W?t.frontFace(t.CW):t.frontFace(t.CCW),I=W)}function Ie(W){W!==O_?(ie(t.CULL_FACE),W!==F&&(W===tg?t.cullFace(t.BACK):W===U_?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Te(t.CULL_FACE),F=W}function qe(W){W!==z&&(P&&t.lineWidth(W),z=W)}function Ne(W,Be,le){W?(ie(t.POLYGON_OFFSET_FILL),(L!==Be||V!==le)&&(L=Be,V=le,o.getReversed()&&(Be=-Be),t.polygonOffset(Be,le))):Te(t.POLYGON_OFFSET_FILL)}function ut(W){W?ie(t.SCISSOR_TEST):Te(t.SCISSOR_TEST)}function St(W){W===void 0&&(W=t.TEXTURE0+G-1),$!==W&&(t.activeTexture(W),$=W)}function U(W,Be,le){le===void 0&&($===null?le=t.TEXTURE0+G-1:le=$);let Oe=j[le];Oe===void 0&&(Oe={type:void 0,texture:void 0},j[le]=Oe),(Oe.type!==W||Oe.texture!==Be)&&($!==le&&(t.activeTexture(le),$=le),t.bindTexture(W,Be||ee[W]),Oe.type=W,Oe.texture=Be)}function Qt(){let W=j[$];W!==void 0&&W.type!==void 0&&(t.bindTexture(W.type,null),W.type=void 0,W.texture=void 0)}function wt(){try{t.compressedTexImage2D(...arguments)}catch(W){_t("WebGLState:",W)}}function N(){try{t.compressedTexImage3D(...arguments)}catch(W){_t("WebGLState:",W)}}function b(){try{t.texSubImage2D(...arguments)}catch(W){_t("WebGLState:",W)}}function q(){try{t.texSubImage3D(...arguments)}catch(W){_t("WebGLState:",W)}}function J(){try{t.compressedTexSubImage2D(...arguments)}catch(W){_t("WebGLState:",W)}}function oe(){try{t.compressedTexSubImage3D(...arguments)}catch(W){_t("WebGLState:",W)}}function Re(){try{t.texStorage2D(...arguments)}catch(W){_t("WebGLState:",W)}}function D(){try{t.texStorage3D(...arguments)}catch(W){_t("WebGLState:",W)}}function B(){try{t.texImage2D(...arguments)}catch(W){_t("WebGLState:",W)}}function X(){try{t.texImage3D(...arguments)}catch(W){_t("WebGLState:",W)}}function xe(W){return f[W]!==void 0?f[W]:t.getParameter(W)}function De(W,Be){f[W]!==Be&&(t.pixelStorei(W,Be),f[W]=Be)}function Ee(W){Fe.equals(W)===!1&&(t.scissor(W.x,W.y,W.z,W.w),Fe.copy(W))}function Ce(W){We.equals(W)===!1&&(t.viewport(W.x,W.y,W.z,W.w),We.copy(W))}function ze(W,Be){let le=c.get(Be);le===void 0&&(le=new WeakMap,c.set(Be,le));let Oe=le.get(W);Oe===void 0&&(Oe=t.getUniformBlockIndex(Be,W.name),le.set(W,Oe))}function rt(W,Be){let Oe=c.get(Be).get(W);l.get(Be)!==Oe&&(t.uniformBlockBinding(Be,Oe,W.__bindingPointIndex),l.set(Be,Oe))}function yt(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),o.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),t.pixelStorei(t.PACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.BROWSER_DEFAULT_WEBGL),t.pixelStorei(t.PACK_ROW_LENGTH,0),t.pixelStorei(t.PACK_SKIP_PIXELS,0),t.pixelStorei(t.PACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_ROW_LENGTH,0),t.pixelStorei(t.UNPACK_IMAGE_HEIGHT,0),t.pixelStorei(t.UNPACK_SKIP_PIXELS,0),t.pixelStorei(t.UNPACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_SKIP_IMAGES,0),u={},f={},$=null,j={},h={},d=new WeakMap,g=[],x=null,p=!1,m=null,_=null,w=null,v=null,M=null,S=null,E=null,y=new Gt(0,0,0),A=0,T=!1,I=null,F=null,z=null,L=null,V=null,Fe.set(0,0,t.canvas.width,t.canvas.height),We.set(0,0,t.canvas.width,t.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:ie,disable:Te,bindFramebuffer:$e,drawBuffers:re,useProgram:se,setBlending:Se,setMaterial:nt,setFlipSided:he,setCullFace:Ie,setLineWidth:qe,setPolygonOffset:Ne,setScissorTest:ut,activeTexture:St,bindTexture:U,unbindTexture:Qt,compressedTexImage2D:wt,compressedTexImage3D:N,texImage2D:B,texImage3D:X,pixelStorei:De,getParameter:xe,updateUBOMapping:ze,uniformBlockBinding:rt,texStorage2D:Re,texStorage3D:D,texSubImage2D:b,texSubImage3D:q,compressedTexSubImage2D:J,compressedTexSubImage3D:oe,scissor:Ee,viewport:Ce,reset:yt}}function lP(t,e,n,i,r,s,o){let a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new xt,u=new WeakMap,f=new Set,h,d=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(N,b){return g?new OffscreenCanvas(N,b):Jc("canvas")}function p(N,b,q){let J=1,oe=wt(N);if((oe.width>q||oe.height>q)&&(J=q/Math.max(oe.width,oe.height)),J<1)if(typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&N instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&N instanceof ImageBitmap||typeof VideoFrame<"u"&&N instanceof VideoFrame){let Re=Math.floor(J*oe.width),D=Math.floor(J*oe.height);h===void 0&&(h=x(Re,D));let B=b?x(Re,D):h;return B.width=Re,B.height=D,B.getContext("2d").drawImage(N,0,0,Re,D),gt("WebGLRenderer: Texture has been resized from ("+oe.width+"x"+oe.height+") to ("+Re+"x"+D+")."),B}else return"data"in N&&gt("WebGLRenderer: Image in DataTexture is too big ("+oe.width+"x"+oe.height+")."),N;return N}function m(N){return N.generateMipmaps}function _(N){t.generateMipmap(N)}function w(N){return N.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:N.isWebGL3DRenderTarget?t.TEXTURE_3D:N.isWebGLArrayRenderTarget||N.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function v(N,b,q,J,oe,Re=!1){if(N!==null){if(t[N]!==void 0)return t[N];gt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+N+"'")}let D;J&&(D=e.get("EXT_texture_norm16"),D||gt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let B=b;if(b===t.RED&&(q===t.FLOAT&&(B=t.R32F),q===t.HALF_FLOAT&&(B=t.R16F),q===t.UNSIGNED_BYTE&&(B=t.R8),q===t.UNSIGNED_SHORT&&D&&(B=D.R16_EXT),q===t.SHORT&&D&&(B=D.R16_SNORM_EXT)),b===t.RED_INTEGER&&(q===t.UNSIGNED_BYTE&&(B=t.R8UI),q===t.UNSIGNED_SHORT&&(B=t.R16UI),q===t.UNSIGNED_INT&&(B=t.R32UI),q===t.BYTE&&(B=t.R8I),q===t.SHORT&&(B=t.R16I),q===t.INT&&(B=t.R32I)),b===t.RG&&(q===t.FLOAT&&(B=t.RG32F),q===t.HALF_FLOAT&&(B=t.RG16F),q===t.UNSIGNED_BYTE&&(B=t.RG8),q===t.UNSIGNED_SHORT&&D&&(B=D.RG16_EXT),q===t.SHORT&&D&&(B=D.RG16_SNORM_EXT)),b===t.RG_INTEGER&&(q===t.UNSIGNED_BYTE&&(B=t.RG8UI),q===t.UNSIGNED_SHORT&&(B=t.RG16UI),q===t.UNSIGNED_INT&&(B=t.RG32UI),q===t.BYTE&&(B=t.RG8I),q===t.SHORT&&(B=t.RG16I),q===t.INT&&(B=t.RG32I)),b===t.RGB_INTEGER&&(q===t.UNSIGNED_BYTE&&(B=t.RGB8UI),q===t.UNSIGNED_SHORT&&(B=t.RGB16UI),q===t.UNSIGNED_INT&&(B=t.RGB32UI),q===t.BYTE&&(B=t.RGB8I),q===t.SHORT&&(B=t.RGB16I),q===t.INT&&(B=t.RGB32I)),b===t.RGBA_INTEGER&&(q===t.UNSIGNED_BYTE&&(B=t.RGBA8UI),q===t.UNSIGNED_SHORT&&(B=t.RGBA16UI),q===t.UNSIGNED_INT&&(B=t.RGBA32UI),q===t.BYTE&&(B=t.RGBA8I),q===t.SHORT&&(B=t.RGBA16I),q===t.INT&&(B=t.RGBA32I)),b===t.RGB&&(q===t.UNSIGNED_SHORT&&D&&(B=D.RGB16_EXT),q===t.SHORT&&D&&(B=D.RGB16_SNORM_EXT),q===t.UNSIGNED_INT_5_9_9_9_REV&&(B=t.RGB9_E5),q===t.UNSIGNED_INT_10F_11F_11F_REV&&(B=t.R11F_G11F_B10F)),b===t.RGBA){let X=Re?Zc:kt.getTransfer(oe);q===t.FLOAT&&(B=t.RGBA32F),q===t.HALF_FLOAT&&(B=t.RGBA16F),q===t.UNSIGNED_BYTE&&(B=X===an?t.SRGB8_ALPHA8:t.RGBA8),q===t.UNSIGNED_SHORT&&D&&(B=D.RGBA16_EXT),q===t.SHORT&&D&&(B=D.RGBA16_SNORM_EXT),q===t.UNSIGNED_SHORT_4_4_4_4&&(B=t.RGBA4),q===t.UNSIGNED_SHORT_5_5_5_1&&(B=t.RGB5_A1)}return(B===t.R16F||B===t.R32F||B===t.RG16F||B===t.RG32F||B===t.RGBA16F||B===t.RGBA32F)&&e.get("EXT_color_buffer_float"),B}function M(N,b){let q;return N?b===null||b===Br||b===Dl?q=t.DEPTH24_STENCIL8:b===_r?q=t.DEPTH32F_STENCIL8:b===Ll&&(q=t.DEPTH24_STENCIL8,gt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Br||b===Dl?q=t.DEPTH_COMPONENT24:b===_r?q=t.DEPTH_COMPONENT32F:b===Ll&&(q=t.DEPTH_COMPONENT16),q}function S(N,b){return m(N)===!0||N.isFramebufferTexture&&N.minFilter!==ii&&N.minFilter!==Wt?Math.log2(Math.max(b.width,b.height))+1:N.mipmaps!==void 0&&N.mipmaps.length>0?N.mipmaps.length:N.isCompressedTexture&&Array.isArray(N.image)?b.mipmaps.length:1}function E(N){let b=N.target;b.removeEventListener("dispose",E),A(b),b.isVideoTexture&&u.delete(b),b.isHTMLTexture&&f.delete(b)}function y(N){let b=N.target;b.removeEventListener("dispose",y),I(b)}function A(N){let b=i.get(N);if(b.__webglInit===void 0)return;let q=N.source,J=d.get(q);if(J){let oe=J[b.__cacheKey];oe.usedTimes--,oe.usedTimes===0&&T(N),Object.keys(J).length===0&&d.delete(q)}i.remove(N)}function T(N){let b=i.get(N);t.deleteTexture(b.__webglTexture);let q=N.source,J=d.get(q);delete J[b.__cacheKey],o.memory.textures--}function I(N){let b=i.get(N);if(N.depthTexture&&(N.depthTexture.dispose(),i.remove(N.depthTexture)),N.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(b.__webglFramebuffer[J]))for(let oe=0;oe<b.__webglFramebuffer[J].length;oe++)t.deleteFramebuffer(b.__webglFramebuffer[J][oe]);else t.deleteFramebuffer(b.__webglFramebuffer[J]);b.__webglDepthbuffer&&t.deleteRenderbuffer(b.__webglDepthbuffer[J])}else{if(Array.isArray(b.__webglFramebuffer))for(let J=0;J<b.__webglFramebuffer.length;J++)t.deleteFramebuffer(b.__webglFramebuffer[J]);else t.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&t.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&t.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let J=0;J<b.__webglColorRenderbuffer.length;J++)b.__webglColorRenderbuffer[J]&&t.deleteRenderbuffer(b.__webglColorRenderbuffer[J]);b.__webglDepthRenderbuffer&&t.deleteRenderbuffer(b.__webglDepthRenderbuffer)}let q=N.textures;for(let J=0,oe=q.length;J<oe;J++){let Re=i.get(q[J]);Re.__webglTexture&&(t.deleteTexture(Re.__webglTexture),o.memory.textures--),i.remove(q[J])}i.remove(N)}let F=0;function z(){F=0}function L(){return F}function V(N){F=N}function G(){let N=F;return N>=r.maxTextures&&gt("WebGLTextures: Trying to use "+(N+1)+" texture units while this GPU supports only "+r.maxTextures),F+=1,N}function P(N){let b=[];return b.push(N.wrapS),b.push(N.wrapT),b.push(N.wrapR||0),b.push(N.magFilter),b.push(N.minFilter),b.push(N.anisotropy),b.push(N.internalFormat),b.push(N.format),b.push(N.type),b.push(N.generateMipmaps),b.push(N.premultiplyAlpha),b.push(N.flipY),b.push(N.unpackAlignment),b.push(N.colorSpace),b.join()}function O(N,b){let q=i.get(N);if(N.isVideoTexture&&U(N),N.isRenderTargetTexture===!1&&N.isExternalTexture!==!0&&N.version>0&&q.__version!==N.version){let J=N.image;if(J===null)gt("WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)gt("WebGLRenderer: Texture marked for update but image is incomplete");else{Te(q,N,b);return}}else N.isExternalTexture&&(q.__webglTexture=N.sourceTexture?N.sourceTexture:null);n.bindTexture(t.TEXTURE_2D,q.__webglTexture,t.TEXTURE0+b)}function k(N,b){let q=i.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&q.__version!==N.version){Te(q,N,b);return}else N.isExternalTexture&&(q.__webglTexture=N.sourceTexture?N.sourceTexture:null);n.bindTexture(t.TEXTURE_2D_ARRAY,q.__webglTexture,t.TEXTURE0+b)}function $(N,b){let q=i.get(N);if(N.isRenderTargetTexture===!1&&N.version>0&&q.__version!==N.version){Te(q,N,b);return}n.bindTexture(t.TEXTURE_3D,q.__webglTexture,t.TEXTURE0+b)}function j(N,b){let q=i.get(N);if(N.isCubeDepthTexture!==!0&&N.version>0&&q.__version!==N.version){$e(q,N,b);return}n.bindTexture(t.TEXTURE_CUBE_MAP,q.__webglTexture,t.TEXTURE0+b)}let Me={[Hh]:t.REPEAT,[_i]:t.CLAMP_TO_EDGE,[Wh]:t.MIRRORED_REPEAT},ve={[ii]:t.NEAREST,[iM]:t.NEAREST_MIPMAP_NEAREST,[vu]:t.NEAREST_MIPMAP_LINEAR,[Wt]:t.LINEAR,[bd]:t.LINEAR_MIPMAP_NEAREST,[Io]:t.LINEAR_MIPMAP_LINEAR},Fe={[aM]:t.NEVER,[hM]:t.ALWAYS,[lM]:t.LESS,[op]:t.LEQUAL,[cM]:t.EQUAL,[ap]:t.GEQUAL,[uM]:t.GREATER,[fM]:t.NOTEQUAL};function We(N,b){if(b.type===_r&&e.has("OES_texture_float_linear")===!1&&(b.magFilter===Wt||b.magFilter===bd||b.magFilter===vu||b.magFilter===Io||b.minFilter===Wt||b.minFilter===bd||b.minFilter===vu||b.minFilter===Io)&&gt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(N,t.TEXTURE_WRAP_S,Me[b.wrapS]),t.texParameteri(N,t.TEXTURE_WRAP_T,Me[b.wrapT]),(N===t.TEXTURE_3D||N===t.TEXTURE_2D_ARRAY)&&t.texParameteri(N,t.TEXTURE_WRAP_R,Me[b.wrapR]),t.texParameteri(N,t.TEXTURE_MAG_FILTER,ve[b.magFilter]),t.texParameteri(N,t.TEXTURE_MIN_FILTER,ve[b.minFilter]),b.compareFunction&&(t.texParameteri(N,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(N,t.TEXTURE_COMPARE_FUNC,Fe[b.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===ii||b.minFilter!==vu&&b.minFilter!==Io||b.type===_r&&e.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||i.get(b).__currentAnisotropy){let q=e.get("EXT_texture_filter_anisotropic");t.texParameterf(N,q.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,r.getMaxAnisotropy())),i.get(b).__currentAnisotropy=b.anisotropy}}}function ke(N,b){let q=!1;N.__webglInit===void 0&&(N.__webglInit=!0,b.addEventListener("dispose",E));let J=b.source,oe=d.get(J);oe===void 0&&(oe={},d.set(J,oe));let Re=P(b);if(Re!==N.__cacheKey){oe[Re]===void 0&&(oe[Re]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,q=!0),oe[Re].usedTimes++;let D=oe[N.__cacheKey];D!==void 0&&(oe[N.__cacheKey].usedTimes--,D.usedTimes===0&&T(b)),N.__cacheKey=Re,N.__webglTexture=oe[Re].texture}return q}function ee(N,b,q){return Math.floor(Math.floor(N/q)/b)}function ie(N,b,q,J){let Re=N.updateRanges;if(Re.length===0)n.texSubImage2D(t.TEXTURE_2D,0,0,0,b.width,b.height,q,J,b.data);else{Re.sort((De,Ee)=>De.start-Ee.start);let D=0;for(let De=1;De<Re.length;De++){let Ee=Re[D],Ce=Re[De],ze=Ee.start+Ee.count,rt=ee(Ce.start,b.width,4),yt=ee(Ee.start,b.width,4);Ce.start<=ze+1&&rt===yt&&ee(Ce.start+Ce.count-1,b.width,4)===rt?Ee.count=Math.max(Ee.count,Ce.start+Ce.count-Ee.start):(++D,Re[D]=Ce)}Re.length=D+1;let B=n.getParameter(t.UNPACK_ROW_LENGTH),X=n.getParameter(t.UNPACK_SKIP_PIXELS),xe=n.getParameter(t.UNPACK_SKIP_ROWS);n.pixelStorei(t.UNPACK_ROW_LENGTH,b.width);for(let De=0,Ee=Re.length;De<Ee;De++){let Ce=Re[De],ze=Math.floor(Ce.start/4),rt=Math.ceil(Ce.count/4),yt=ze%b.width,W=Math.floor(ze/b.width),Be=rt,le=1;n.pixelStorei(t.UNPACK_SKIP_PIXELS,yt),n.pixelStorei(t.UNPACK_SKIP_ROWS,W),n.texSubImage2D(t.TEXTURE_2D,0,yt,W,Be,le,q,J,b.data)}N.clearUpdateRanges(),n.pixelStorei(t.UNPACK_ROW_LENGTH,B),n.pixelStorei(t.UNPACK_SKIP_PIXELS,X),n.pixelStorei(t.UNPACK_SKIP_ROWS,xe)}}function Te(N,b,q){let J=t.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&(J=t.TEXTURE_2D_ARRAY),b.isData3DTexture&&(J=t.TEXTURE_3D);let oe=ke(N,b),Re=b.source;n.bindTexture(J,N.__webglTexture,t.TEXTURE0+q);let D=i.get(Re);if(Re.version!==D.__version||oe===!0){if(n.activeTexture(t.TEXTURE0+q),(typeof ImageBitmap<"u"&&b.image instanceof ImageBitmap)===!1){let le=kt.getPrimaries(kt.workingColorSpace),Oe=b.colorSpace===Xs?null:kt.getPrimaries(b.colorSpace),Ge=b.colorSpace===Xs||le===Oe?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,b.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ge)}n.pixelStorei(t.UNPACK_ALIGNMENT,b.unpackAlignment);let X=p(b.image,!1,r.maxTextureSize);X=Qt(b,X);let xe=s.convert(b.format,b.colorSpace),De=s.convert(b.type),Ee=v(b.internalFormat,xe,De,b.normalized,b.colorSpace,b.isVideoTexture);We(J,b);let Ce,ze=b.mipmaps,rt=b.isVideoTexture!==!0,yt=D.__version===void 0||oe===!0,W=Re.dataReady,Be=S(b,X);if(b.isDepthTexture)Ee=M(b.format===Lo,b.type),yt&&(rt?n.texStorage2D(t.TEXTURE_2D,1,Ee,X.width,X.height):n.texImage2D(t.TEXTURE_2D,0,Ee,X.width,X.height,0,xe,De,null));else if(b.isDataTexture)if(ze.length>0){rt&&yt&&n.texStorage2D(t.TEXTURE_2D,Be,Ee,ze[0].width,ze[0].height);for(let le=0,Oe=ze.length;le<Oe;le++)Ce=ze[le],rt?W&&n.texSubImage2D(t.TEXTURE_2D,le,0,0,Ce.width,Ce.height,xe,De,Ce.data):n.texImage2D(t.TEXTURE_2D,le,Ee,Ce.width,Ce.height,0,xe,De,Ce.data);b.generateMipmaps=!1}else rt?(yt&&n.texStorage2D(t.TEXTURE_2D,Be,Ee,X.width,X.height),W&&ie(b,X,xe,De)):n.texImage2D(t.TEXTURE_2D,0,Ee,X.width,X.height,0,xe,De,X.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){rt&&yt&&n.texStorage3D(t.TEXTURE_2D_ARRAY,Be,Ee,ze[0].width,ze[0].height,X.depth);for(let le=0,Oe=ze.length;le<Oe;le++)if(Ce=ze[le],b.format!==li)if(xe!==null)if(rt){if(W)if(b.layerUpdates.size>0){let Ge=Tg(Ce.width,Ce.height,b.format,b.type);for(let _e of b.layerUpdates){let st=Ce.data.subarray(_e*Ge/Ce.data.BYTES_PER_ELEMENT,(_e+1)*Ge/Ce.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,le,0,0,_e,Ce.width,Ce.height,1,xe,st)}}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,le,0,0,0,Ce.width,Ce.height,X.depth,xe,Ce.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,le,Ee,Ce.width,Ce.height,X.depth,0,Ce.data,0,0);else gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else rt?W&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,le,0,0,0,Ce.width,Ce.height,X.depth,xe,De,Ce.data):n.texImage3D(t.TEXTURE_2D_ARRAY,le,Ee,Ce.width,Ce.height,X.depth,0,xe,De,Ce.data);b.layerUpdates.size>0&&b.clearLayerUpdates()}else{rt&&yt&&n.texStorage2D(t.TEXTURE_2D,Be,Ee,ze[0].width,ze[0].height);for(let le=0,Oe=ze.length;le<Oe;le++)Ce=ze[le],b.format!==li?xe!==null?rt?W&&n.compressedTexSubImage2D(t.TEXTURE_2D,le,0,0,Ce.width,Ce.height,xe,Ce.data):n.compressedTexImage2D(t.TEXTURE_2D,le,Ee,Ce.width,Ce.height,0,Ce.data):gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):rt?W&&n.texSubImage2D(t.TEXTURE_2D,le,0,0,Ce.width,Ce.height,xe,De,Ce.data):n.texImage2D(t.TEXTURE_2D,le,Ee,Ce.width,Ce.height,0,xe,De,Ce.data)}else if(b.isDataArrayTexture)if(rt){if(yt&&n.texStorage3D(t.TEXTURE_2D_ARRAY,Be,Ee,X.width,X.height,X.depth),W)if(b.layerUpdates.size>0){let le=Tg(X.width,X.height,b.format,b.type);for(let Oe of b.layerUpdates){let Ge=X.data.subarray(Oe*le/X.data.BYTES_PER_ELEMENT,(Oe+1)*le/X.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,Oe,X.width,X.height,1,xe,De,Ge)}b.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,X.width,X.height,X.depth,xe,De,X.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,Ee,X.width,X.height,X.depth,0,xe,De,X.data);else if(b.isData3DTexture)rt?(yt&&n.texStorage3D(t.TEXTURE_3D,Be,Ee,X.width,X.height,X.depth),W&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,X.width,X.height,X.depth,xe,De,X.data)):n.texImage3D(t.TEXTURE_3D,0,Ee,X.width,X.height,X.depth,0,xe,De,X.data);else if(b.isFramebufferTexture){if(yt)if(rt)n.texStorage2D(t.TEXTURE_2D,Be,Ee,X.width,X.height);else{let le=X.width,Oe=X.height;for(let Ge=0;Ge<Be;Ge++)n.texImage2D(t.TEXTURE_2D,Ge,Ee,le,Oe,0,xe,De,null),le>>=1,Oe>>=1}}else if(b.isHTMLTexture){if("texElementImage2D"in t){let le=t.canvas;if(le.hasAttribute("layoutsubtree")||le.setAttribute("layoutsubtree","true"),X.parentNode!==le){le.appendChild(X),f.add(b),le.onpaint=Oe=>{let Ge=Oe.changedElements;for(let _e of f)Ge.includes(_e.image)&&(_e.needsUpdate=!0)},le.requestPaint();return}if(t.texElementImage2D.length===3)t.texElementImage2D(t.TEXTURE_2D,t.RGBA8,X);else{let Ge=t.RGBA,_e=t.RGBA,st=t.UNSIGNED_BYTE;t.texElementImage2D(t.TEXTURE_2D,0,Ge,_e,st,X)}t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}}else if(ze.length>0){if(rt&&yt){let le=wt(ze[0]);n.texStorage2D(t.TEXTURE_2D,Be,Ee,le.width,le.height)}for(let le=0,Oe=ze.length;le<Oe;le++)Ce=ze[le],rt?W&&n.texSubImage2D(t.TEXTURE_2D,le,0,0,xe,De,Ce):n.texImage2D(t.TEXTURE_2D,le,Ee,xe,De,Ce);b.generateMipmaps=!1}else if(rt){if(yt){let le=wt(X);n.texStorage2D(t.TEXTURE_2D,Be,Ee,le.width,le.height)}W&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,xe,De,X)}else n.texImage2D(t.TEXTURE_2D,0,Ee,xe,De,X);m(b)&&_(J),D.__version=Re.version,b.onUpdate&&b.onUpdate(b)}N.__version=b.version}function $e(N,b,q){if(b.image.length!==6)return;let J=ke(N,b),oe=b.source;n.bindTexture(t.TEXTURE_CUBE_MAP,N.__webglTexture,t.TEXTURE0+q);let Re=i.get(oe);if(oe.version!==Re.__version||J===!0){n.activeTexture(t.TEXTURE0+q);let D=kt.getPrimaries(kt.workingColorSpace),B=b.colorSpace===Xs?null:kt.getPrimaries(b.colorSpace),X=b.colorSpace===Xs||D===B?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,b.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),n.pixelStorei(t.UNPACK_ALIGNMENT,b.unpackAlignment),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,X);let xe=b.isCompressedTexture||b.image[0].isCompressedTexture,De=b.image[0]&&b.image[0].isDataTexture,Ee=[];for(let _e=0;_e<6;_e++)!xe&&!De?Ee[_e]=p(b.image[_e],!0,r.maxCubemapSize):Ee[_e]=De?b.image[_e].image:b.image[_e],Ee[_e]=Qt(b,Ee[_e]);let Ce=Ee[0],ze=s.convert(b.format,b.colorSpace),rt=s.convert(b.type),yt=v(b.internalFormat,ze,rt,b.normalized,b.colorSpace),W=b.isVideoTexture!==!0,Be=Re.__version===void 0||J===!0,le=oe.dataReady,Oe=S(b,Ce);We(t.TEXTURE_CUBE_MAP,b);let Ge;if(xe){W&&Be&&n.texStorage2D(t.TEXTURE_CUBE_MAP,Oe,yt,Ce.width,Ce.height);for(let _e=0;_e<6;_e++){Ge=Ee[_e].mipmaps;for(let st=0;st<Ge.length;st++){let ue=Ge[st];b.format!==li?ze!==null?W?le&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,st,0,0,ue.width,ue.height,ze,ue.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,st,yt,ue.width,ue.height,0,ue.data):gt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):W?le&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,st,0,0,ue.width,ue.height,ze,rt,ue.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,st,yt,ue.width,ue.height,0,ze,rt,ue.data)}}}else{if(Ge=b.mipmaps,W&&Be){Ge.length>0&&Oe++;let _e=wt(Ee[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,Oe,yt,_e.width,_e.height)}for(let _e=0;_e<6;_e++)if(De){W?le&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,Ee[_e].width,Ee[_e].height,ze,rt,Ee[_e].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,yt,Ee[_e].width,Ee[_e].height,0,ze,rt,Ee[_e].data);for(let st=0;st<Ge.length;st++){let At=Ge[st].image[_e].image;W?le&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,st+1,0,0,At.width,At.height,ze,rt,At.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,st+1,yt,At.width,At.height,0,ze,rt,At.data)}}else{W?le&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,0,0,ze,rt,Ee[_e]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,0,yt,ze,rt,Ee[_e]);for(let st=0;st<Ge.length;st++){let ue=Ge[st];W?le&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,st+1,0,0,ze,rt,ue.image[_e]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+_e,st+1,yt,ze,rt,ue.image[_e])}}}m(b)&&_(t.TEXTURE_CUBE_MAP),Re.__version=oe.version,b.onUpdate&&b.onUpdate(b)}N.__version=b.version}function re(N,b,q,J,oe,Re){let D=s.convert(q.format,q.colorSpace),B=s.convert(q.type),X=v(q.internalFormat,D,B,q.normalized,q.colorSpace),xe=i.get(b),De=i.get(q);if(De.__renderTarget=b,!xe.__hasExternalTextures){let Ee=Math.max(1,b.width>>Re),Ce=Math.max(1,b.height>>Re);oe===t.TEXTURE_3D||oe===t.TEXTURE_2D_ARRAY?n.texImage3D(oe,Re,X,Ee,Ce,b.depth,0,D,B,null):n.texImage2D(oe,Re,X,Ee,Ce,0,D,B,null)}n.bindFramebuffer(t.FRAMEBUFFER,N),St(b)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,J,oe,De.__webglTexture,0,ut(b)):(oe===t.TEXTURE_2D||oe>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&oe<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,J,oe,De.__webglTexture,Re),n.bindFramebuffer(t.FRAMEBUFFER,null)}function se(N,b,q){if(t.bindRenderbuffer(t.RENDERBUFFER,N),b.depthBuffer){let J=b.depthTexture,oe=J&&J.isDepthTexture?J.type:null,Re=M(b.stencilBuffer,oe),D=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;St(b)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,ut(b),Re,b.width,b.height):q?t.renderbufferStorageMultisample(t.RENDERBUFFER,ut(b),Re,b.width,b.height):t.renderbufferStorage(t.RENDERBUFFER,Re,b.width,b.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,D,t.RENDERBUFFER,N)}else{let J=b.textures;for(let oe=0;oe<J.length;oe++){let Re=J[oe],D=s.convert(Re.format,Re.colorSpace),B=s.convert(Re.type),X=v(Re.internalFormat,D,B,Re.normalized,Re.colorSpace);St(b)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,ut(b),X,b.width,b.height):q?t.renderbufferStorageMultisample(t.RENDERBUFFER,ut(b),X,b.width,b.height):t.renderbufferStorage(t.RENDERBUFFER,X,b.width,b.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function te(N,b,q){let J=b.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(t.FRAMEBUFFER,N),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let oe=i.get(b.depthTexture);if(oe.__renderTarget=b,(!oe.__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),J){if(oe.__webglInit===void 0&&(oe.__webglInit=!0,b.depthTexture.addEventListener("dispose",E)),oe.__webglTexture===void 0){oe.__webglTexture=t.createTexture(),n.bindTexture(t.TEXTURE_CUBE_MAP,oe.__webglTexture),We(t.TEXTURE_CUBE_MAP,b.depthTexture);let xe=s.convert(b.depthTexture.format),De=s.convert(b.depthTexture.type),Ee;b.depthTexture.format===rs?Ee=t.DEPTH_COMPONENT24:b.depthTexture.format===Lo&&(Ee=t.DEPTH24_STENCIL8);for(let Ce=0;Ce<6;Ce++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+Ce,0,Ee,b.width,b.height,0,xe,De,null)}}else O(b.depthTexture,0);let Re=oe.__webglTexture,D=ut(b),B=J?t.TEXTURE_CUBE_MAP_POSITIVE_X+q:t.TEXTURE_2D,X=b.depthTexture.format===Lo?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(b.depthTexture.format===rs)St(b)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,X,B,Re,0,D):t.framebufferTexture2D(t.FRAMEBUFFER,X,B,Re,0);else if(b.depthTexture.format===Lo)St(b)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,X,B,Re,0,D):t.framebufferTexture2D(t.FRAMEBUFFER,X,B,Re,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function me(N){let b=i.get(N),q=N.isWebGLCubeRenderTarget===!0;if(b.__boundDepthTexture!==N.depthTexture){let J=N.depthTexture;if(b.__depthDisposeCallback&&b.__depthDisposeCallback(),J){let oe=()=>{delete b.__boundDepthTexture,delete b.__depthDisposeCallback,J.removeEventListener("dispose",oe)};J.addEventListener("dispose",oe),b.__depthDisposeCallback=oe}b.__boundDepthTexture=J}if(N.depthTexture&&!b.__autoAllocateDepthBuffer)if(q)for(let J=0;J<6;J++)te(b.__webglFramebuffer[J],N,J);else{let J=N.texture.mipmaps;J&&J.length>0?te(b.__webglFramebuffer[0],N,0):te(b.__webglFramebuffer,N,0)}else if(q){b.__webglDepthbuffer=[];for(let J=0;J<6;J++)if(n.bindFramebuffer(t.FRAMEBUFFER,b.__webglFramebuffer[J]),b.__webglDepthbuffer[J]===void 0)b.__webglDepthbuffer[J]=t.createRenderbuffer(),se(b.__webglDepthbuffer[J],N,!1);else{let oe=N.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Re=b.__webglDepthbuffer[J];t.bindRenderbuffer(t.RENDERBUFFER,Re),t.framebufferRenderbuffer(t.FRAMEBUFFER,oe,t.RENDERBUFFER,Re)}}else{let J=N.texture.mipmaps;if(J&&J.length>0?n.bindFramebuffer(t.FRAMEBUFFER,b.__webglFramebuffer[0]):n.bindFramebuffer(t.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer===void 0)b.__webglDepthbuffer=t.createRenderbuffer(),se(b.__webglDepthbuffer,N,!1);else{let oe=N.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Re=b.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,Re),t.framebufferRenderbuffer(t.FRAMEBUFFER,oe,t.RENDERBUFFER,Re)}}n.bindFramebuffer(t.FRAMEBUFFER,null)}function Se(N,b,q){let J=i.get(N);b!==void 0&&re(J.__webglFramebuffer,N,N.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),q!==void 0&&me(N)}function nt(N){let b=N.texture,q=i.get(N),J=i.get(b);N.addEventListener("dispose",y);let oe=N.textures,Re=N.isWebGLCubeRenderTarget===!0,D=oe.length>1;if(D||(J.__webglTexture===void 0&&(J.__webglTexture=t.createTexture()),J.__version=b.version,o.memory.textures++),Re){q.__webglFramebuffer=[];for(let B=0;B<6;B++)if(b.mipmaps&&b.mipmaps.length>0){q.__webglFramebuffer[B]=[];for(let X=0;X<b.mipmaps.length;X++)q.__webglFramebuffer[B][X]=t.createFramebuffer()}else q.__webglFramebuffer[B]=t.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){q.__webglFramebuffer=[];for(let B=0;B<b.mipmaps.length;B++)q.__webglFramebuffer[B]=t.createFramebuffer()}else q.__webglFramebuffer=t.createFramebuffer();if(D)for(let B=0,X=oe.length;B<X;B++){let xe=i.get(oe[B]);xe.__webglTexture===void 0&&(xe.__webglTexture=t.createTexture(),o.memory.textures++)}if(N.samples>0&&St(N)===!1){q.__webglMultisampledFramebuffer=t.createFramebuffer(),q.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,q.__webglMultisampledFramebuffer);for(let B=0;B<oe.length;B++){let X=oe[B];q.__webglColorRenderbuffer[B]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,q.__webglColorRenderbuffer[B]);let xe=s.convert(X.format,X.colorSpace),De=s.convert(X.type),Ee=v(X.internalFormat,xe,De,X.normalized,X.colorSpace,N.isXRRenderTarget===!0),Ce=ut(N);t.renderbufferStorageMultisample(t.RENDERBUFFER,Ce,Ee,N.width,N.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+B,t.RENDERBUFFER,q.__webglColorRenderbuffer[B])}t.bindRenderbuffer(t.RENDERBUFFER,null),N.depthBuffer&&(q.__webglDepthRenderbuffer=t.createRenderbuffer(),se(q.__webglDepthRenderbuffer,N,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(Re){n.bindTexture(t.TEXTURE_CUBE_MAP,J.__webglTexture),We(t.TEXTURE_CUBE_MAP,b);for(let B=0;B<6;B++)if(b.mipmaps&&b.mipmaps.length>0)for(let X=0;X<b.mipmaps.length;X++)re(q.__webglFramebuffer[B][X],N,b,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+B,X);else re(q.__webglFramebuffer[B],N,b,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+B,0);m(b)&&_(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(D){for(let B=0,X=oe.length;B<X;B++){let xe=oe[B],De=i.get(xe),Ee=t.TEXTURE_2D;(N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(Ee=N.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(Ee,De.__webglTexture),We(Ee,xe),re(q.__webglFramebuffer,N,xe,t.COLOR_ATTACHMENT0+B,Ee,0),m(xe)&&_(Ee)}n.unbindTexture()}else{let B=t.TEXTURE_2D;if((N.isWebGL3DRenderTarget||N.isWebGLArrayRenderTarget)&&(B=N.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(B,J.__webglTexture),We(B,b),b.mipmaps&&b.mipmaps.length>0)for(let X=0;X<b.mipmaps.length;X++)re(q.__webglFramebuffer[X],N,b,t.COLOR_ATTACHMENT0,B,X);else re(q.__webglFramebuffer,N,b,t.COLOR_ATTACHMENT0,B,0);m(b)&&_(B),n.unbindTexture()}N.depthBuffer&&me(N)}function he(N){let b=N.textures;for(let q=0,J=b.length;q<J;q++){let oe=b[q];if(m(oe)){let Re=w(N),D=i.get(oe).__webglTexture;n.bindTexture(Re,D),_(Re),n.unbindTexture()}}}let Ie=[],qe=[];function Ne(N){if(N.samples>0){if(St(N)===!1){let b=N.textures,q=N.width,J=N.height,oe=t.COLOR_BUFFER_BIT,Re=N.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,D=i.get(N),B=b.length>1;if(B)for(let xe=0;xe<b.length;xe++)n.bindFramebuffer(t.FRAMEBUFFER,D.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+xe,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,D.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+xe,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,D.__webglMultisampledFramebuffer);let X=N.texture.mipmaps;X&&X.length>0?n.bindFramebuffer(t.DRAW_FRAMEBUFFER,D.__webglFramebuffer[0]):n.bindFramebuffer(t.DRAW_FRAMEBUFFER,D.__webglFramebuffer);for(let xe=0;xe<b.length;xe++){if(N.resolveDepthBuffer&&(N.depthBuffer&&(oe|=t.DEPTH_BUFFER_BIT),N.stencilBuffer&&N.resolveStencilBuffer&&(oe|=t.STENCIL_BUFFER_BIT)),B){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,D.__webglColorRenderbuffer[xe]);let De=i.get(b[xe]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,De,0)}t.blitFramebuffer(0,0,q,J,0,0,q,J,oe,t.NEAREST),l===!0&&(Ie.length=0,qe.length=0,Ie.push(t.COLOR_ATTACHMENT0+xe),N.depthBuffer&&N.storeMultisampledDepthBuffer===!1&&(Ie.push(Re),qe.push(Re),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,qe)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Ie))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),B)for(let xe=0;xe<b.length;xe++){n.bindFramebuffer(t.FRAMEBUFFER,D.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+xe,t.RENDERBUFFER,D.__webglColorRenderbuffer[xe]);let De=i.get(b[xe]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,D.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+xe,t.TEXTURE_2D,De,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,D.__webglMultisampledFramebuffer)}else if(N.depthBuffer&&N.storeMultisampledDepthBuffer===!1&&l){let b=N.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[b])}}}function ut(N){return Math.min(r.maxSamples,N.samples)}function St(N){let b=i.get(N);return N.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function U(N){let b=o.render.frame;u.get(N)!==b&&(u.set(N,b),N.update())}function Qt(N,b){let q=N.colorSpace,J=N.format,oe=N.type;return N.isCompressedTexture===!0||N.isVideoTexture===!0||q!==fa&&q!==Xs&&(kt.getTransfer(q)===an?(J!==li||oe!==lr)&&gt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):_t("WebGLTextures: Unsupported texture color space:",q)),b}function wt(N){return typeof HTMLImageElement<"u"&&N instanceof HTMLImageElement?(c.width=N.naturalWidth||N.width,c.height=N.naturalHeight||N.height):typeof VideoFrame<"u"&&N instanceof VideoFrame?(c.width=N.displayWidth,c.height=N.displayHeight):(c.width=N.width,c.height=N.height),c}this.allocateTextureUnit=G,this.resetTextureUnits=z,this.getTextureUnits=L,this.setTextureUnits=V,this.setTexture2D=O,this.setTexture2DArray=k,this.setTexture3D=$,this.setTextureCube=j,this.rebindTextures=Se,this.setupRenderTarget=nt,this.updateRenderTargetMipmap=he,this.updateMultisampleRenderTarget=Ne,this.setupDepthRenderbuffer=me,this.setupFrameBufferTexture=re,this.useMultisampledRTT=St,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function cP(t,e){function n(i,r=Xs){let s,o=kt.getTransfer(r);if(i===lr)return t.UNSIGNED_BYTE;if(i===wd)return t.UNSIGNED_SHORT_4_4_4_4;if(i===Ad)return t.UNSIGNED_SHORT_5_5_5_1;if(i===gg)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===xg)return t.UNSIGNED_INT_10F_11F_11F_REV;if(i===pg)return t.BYTE;if(i===mg)return t.SHORT;if(i===Ll)return t.UNSIGNED_SHORT;if(i===Sd)return t.INT;if(i===Br)return t.UNSIGNED_INT;if(i===_r)return t.FLOAT;if(i===Mi)return t.HALF_FLOAT;if(i===vg)return t.ALPHA;if(i===yg)return t.RGB;if(i===li)return t.RGBA;if(i===rs)return t.DEPTH_COMPONENT;if(i===Lo)return t.DEPTH_STENCIL;if(i===Td)return t.RED;if(i===Ed)return t.RED_INTEGER;if(i===Do)return t.RG;if(i===Rd)return t.RG_INTEGER;if(i===Cd)return t.RGBA_INTEGER;if(i===yu||i===_u||i===Mu||i===bu)if(o===an)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===yu)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===_u)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Mu)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===bu)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===yu)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===_u)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Mu)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===bu)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Pd||i===Id||i===Ld||i===Dd)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Pd)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Id)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ld)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Dd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Nd||i===Fd||i===Od||i===Ud||i===kd||i===Su||i===Bd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Nd||i===Fd)return o===an?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Od)return o===an?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===Ud)return s.COMPRESSED_R11_EAC;if(i===kd)return s.COMPRESSED_SIGNED_R11_EAC;if(i===Su)return s.COMPRESSED_RG11_EAC;if(i===Bd)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===zd||i===Vd||i===Gd||i===Hd||i===Wd||i===$d||i===Xd||i===Yd||i===qd||i===jd||i===Zd||i===Kd||i===Jd||i===Qd)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===zd)return o===an?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Vd)return o===an?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Gd)return o===an?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Hd)return o===an?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Wd)return o===an?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===$d)return o===an?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Xd)return o===an?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Yd)return o===an?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===qd)return o===an?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===jd)return o===an?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Zd)return o===an?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Kd)return o===an?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Jd)return o===an?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Qd)return o===an?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ep||i===tp||i===np)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===ep)return o===an?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===tp)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===np)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===ip||i===rp||i===wu||i===sp)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===ip)return s.COMPRESSED_RED_RGTC1_EXT;if(i===rp)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===wu)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===sp)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Dl?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}var uP=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,fP=`
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

}`,$g=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n){if(this.texture===null){let i=new cu(e.texture);(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){let n=e.cameras[0].viewport,i=new $t({vertexShader:uP,fragmentShader:fP,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new nn(new cs(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Xg=class extends ss{constructor(e,n){super();let i=this,r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,f=null,h=null,d=null,g=null,x=typeof XRWebGLBinding<"u",p=new $g,m={},_=n.getContextAttributes(),w=null,v=null,M=[],S=[],E=new xt,y=null,A=null,T=new yi;T.viewport=new Yt;let I=new yi;I.viewport=new Yt;let F=[T,I],z=new xd,L=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ee){let ie=M[ee];return ie===void 0&&(ie=new Tl,M[ee]=ie),ie.getTargetRaySpace()},this.getControllerGrip=function(ee){let ie=M[ee];return ie===void 0&&(ie=new Tl,M[ee]=ie),ie.getGripSpace()},this.getHand=function(ee){let ie=M[ee];return ie===void 0&&(ie=new Tl,M[ee]=ie),ie.getHandSpace()};function G(ee){let ie=S.indexOf(ee.inputSource);if(ie===-1)return;let Te=M[ie];Te!==void 0&&(Te.update(ee.inputSource,ee.frame,c||o),Te.dispatchEvent({type:ee.type,data:ee.inputSource}))}function P(){r.removeEventListener("select",G),r.removeEventListener("selectstart",G),r.removeEventListener("selectend",G),r.removeEventListener("squeeze",G),r.removeEventListener("squeezestart",G),r.removeEventListener("squeezeend",G),r.removeEventListener("end",P),r.removeEventListener("inputsourceschange",O);for(let ee=0;ee<M.length;ee++){let ie=S[ee];ie!==null&&(S[ee]=null,M[ee].disconnect(ie))}L=null,V=null,p.reset();for(let ee in m)delete m[ee];if(e.setRenderTarget(w),d=null,h=null,f=null,r=null,v=null,ke.stop(),i.isPresenting=!1,e.setPixelRatio(y),e.setSize(E.width,E.height,!1),A!==null){let ee=A.camera;ee.fov=A.fov,ee.zoom=A.zoom,ee.updateProjectionMatrix(),A=null}i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ee){s=ee,i.isPresenting===!0&&gt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ee){a=ee,i.isPresenting===!0&&gt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(ee){c=ee},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return f===null&&x&&(f=new XRWebGLBinding(r,n)),f},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(ee){if(r=ee,r!==null){if(w=e.getRenderTarget(),r.addEventListener("select",G),r.addEventListener("selectstart",G),r.addEventListener("selectend",G),r.addEventListener("squeeze",G),r.addEventListener("squeezestart",G),r.addEventListener("squeezeend",G),r.addEventListener("end",P),r.addEventListener("inputsourceschange",O),_.xrCompatible!==!0&&await n.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(E),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let Te=null,$e=null,re=null;_.depth&&(re=_.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,Te=_.stencil?Lo:rs,$e=_.stencil?Dl:Br);let se={colorFormat:n.RGBA8,depthFormat:re,scaleFactor:s};f=this.getBinding(),h=f.createProjectionLayer(se),r.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),v=new Yn(h.textureWidth,h.textureHeight,{format:li,type:lr,depthTexture:new To(h.textureWidth,h.textureHeight,$e,void 0,void 0,void 0,void 0,void 0,void 0,Te),stencilBuffer:_.stencil,colorSpace:e.outputColorSpace,samples:_.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{let Te={antialias:_.antialias,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:s};d=new XRWebGLLayer(r,n,Te),r.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),v=new Yn(d.framebufferWidth,d.framebufferHeight,{format:li,type:lr,colorSpace:e.outputColorSpace,stencilBuffer:_.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}v.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),ke.setContext(r),ke.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function O(ee){for(let ie=0;ie<ee.removed.length;ie++){let Te=ee.removed[ie],$e=S.indexOf(Te);$e>=0&&(S[$e]=null,M[$e].disconnect(Te))}for(let ie=0;ie<ee.added.length;ie++){let Te=ee.added[ie],$e=S.indexOf(Te);if($e===-1){for(let se=0;se<M.length;se++)if(se>=S.length){S.push(Te),$e=se;break}else if(S[se]===null){S[se]=Te,$e=se;break}if($e===-1)break}let re=M[$e];re&&re.connect(Te)}}let k=new C,$=new C;function j(ee,ie,Te){k.setFromMatrixPosition(ie.matrixWorld),$.setFromMatrixPosition(Te.matrixWorld);let $e=k.distanceTo($),re=ie.projectionMatrix.elements,se=Te.projectionMatrix.elements,te=re[14]/(re[10]-1),me=re[14]/(re[10]+1),Se=(re[9]+1)/re[5],nt=(re[9]-1)/re[5],he=(re[8]-1)/re[0],Ie=(se[8]+1)/se[0],qe=te*he,Ne=te*Ie,ut=$e/(-he+Ie),St=ut*-he;if(ie.matrixWorld.decompose(ee.position,ee.quaternion,ee.scale),ee.translateX(St),ee.translateZ(ut),ee.matrixWorld.compose(ee.position,ee.quaternion,ee.scale),ee.matrixWorldInverse.copy(ee.matrixWorld).invert(),re[10]===-1)ee.projectionMatrix.copy(ie.projectionMatrix),ee.projectionMatrixInverse.copy(ie.projectionMatrixInverse);else{let U=te+ut,Qt=me+ut,wt=qe-St,N=Ne+($e-St),b=Se*me/Qt*U,q=nt*me/Qt*U;ee.projectionMatrix.makePerspective(wt,N,b,q,U,Qt),ee.projectionMatrixInverse.copy(ee.projectionMatrix).invert()}}function Me(ee,ie){ie===null?ee.matrixWorld.copy(ee.matrix):ee.matrixWorld.multiplyMatrices(ie.matrixWorld,ee.matrix),ee.matrixWorldInverse.copy(ee.matrixWorld).invert()}this.updateCamera=function(ee){if(r===null)return;let ie=ee.near,Te=ee.far;p.texture!==null&&(p.depthNear>0&&(ie=p.depthNear),p.depthFar>0&&(Te=p.depthFar)),z.near=I.near=T.near=ie,z.far=I.far=T.far=Te,(L!==z.near||V!==z.far)&&(r.updateRenderState({depthNear:z.near,depthFar:z.far}),L=z.near,V=z.far),z.layers.mask=ee.layers.mask|6,T.layers.mask=z.layers.mask&-5,I.layers.mask=z.layers.mask&-3;let $e=ee.parent,re=z.cameras;Me(z,$e);for(let se=0;se<re.length;se++)Me(re[se],$e);re.length===2?j(z,T,I):z.projectionMatrix.copy(T.projectionMatrix),A===null&&ee.isPerspectiveCamera&&(A={camera:ee,fov:ee.fov,zoom:ee.zoom}),ve(ee,z,$e)};function ve(ee,ie,Te){Te===null?ee.matrix.copy(ie.matrixWorld):(ee.matrix.copy(Te.matrixWorld),ee.matrix.invert(),ee.matrix.multiply(ie.matrixWorld)),ee.matrix.decompose(ee.position,ee.quaternion,ee.scale),ee.updateMatrixWorld(!0),ee.projectionMatrix.copy(ie.projectionMatrix),ee.projectionMatrixInverse.copy(ie.projectionMatrixInverse),ee.isPerspectiveCamera&&(ee.fov=Xh*2*Math.atan(1/ee.projectionMatrix.elements[5]),ee.zoom=1)}this.getCamera=function(){return z},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function(ee){l=ee,h!==null&&(h.fixedFoveation=ee),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=ee)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(z)},this.getCameraTexture=function(ee){return m[ee]};let Fe=null;function We(ee,ie){if(u=ie.getViewerPose(c||o),g=ie,u!==null){let Te=u.views;d!==null&&(e.setRenderTargetFramebuffer(v,d.framebuffer),e.setRenderTarget(v));let $e=!1;Te.length!==z.cameras.length&&(z.cameras.length=0,$e=!0);for(let me=0;me<Te.length;me++){let Se=Te[me],nt=null;if(d!==null)nt=d.getViewport(Se);else{let Ie=f.getViewSubImage(h,Se);nt=Ie.viewport,me===0&&(e.setRenderTargetTextures(v,Ie.colorTexture,Ie.depthStencilTexture),e.setRenderTarget(v))}let he=F[me];he===void 0&&(he=new yi,he.layers.enable(me),he.viewport=new Yt,F[me]=he),he.matrix.fromArray(Se.transform.matrix),he.matrix.decompose(he.position,he.quaternion,he.scale),he.projectionMatrix.fromArray(Se.projectionMatrix),he.projectionMatrixInverse.copy(he.projectionMatrix).invert(),he.viewport.set(nt.x,nt.y,nt.width,nt.height),me===0&&(z.matrix.copy(he.matrix),z.matrix.decompose(z.position,z.quaternion,z.scale)),$e===!0&&z.cameras.push(he)}let re=r.enabledFeatures;if(re&&re.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&x){f=i.getBinding();let me=f.getDepthInformation(Te[0]);me&&me.isValid&&me.texture&&p.init(me,r.renderState)}if(re&&re.includes("camera-access")&&x){e.state.unbindTexture(),f=i.getBinding();for(let me=0;me<Te.length;me++){let Se=Te[me].camera;if(Se){let nt=m[Se];nt||(nt=new cu,m[Se]=nt);let he=f.getCameraImage(Se);nt.sourceTexture=he}}}}for(let Te=0;Te<M.length;Te++){let $e=S[Te],re=M[Te];$e!==null&&re!==void 0&&re.update($e,ie,c||o)}Fe&&Fe(ee,ie),ie.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:ie}),g=null}let ke=new GM;ke.setAnimationLoop(We),this.setAnimationLoop=function(ee){Fe=ee},this.dispose=function(){}}},hP=new Ct,qM=new Pt;qM.set(-1,0,0,0,1,0,0,0,1);function dP(t,e){function n(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function i(p,m){m.color.getRGB(p.fogColor.value,Sg(t)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function r(p,m,_,w,v){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?s(p,m):m.isMeshLambertMaterial?(s(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(s(p,m),f(p,m)):m.isMeshPhongMaterial?(s(p,m),u(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(s(p,m),h(p,m),m.isMeshPhysicalMaterial&&d(p,m,v)):m.isMeshMatcapMaterial?(s(p,m),g(p,m)):m.isMeshDepthMaterial?s(p,m):m.isMeshDistanceMaterial?(s(p,m),x(p,m)):m.isMeshNormalMaterial?s(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?l(p,m,_,w):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function s(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,n(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,n(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,n(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Fi&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,n(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Fi&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,n(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,n(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,n(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);let _=e.get(m),w=_.envMap,v=_.envMapRotation;w&&(p.envMap.value=w,p.envMapRotation.value.setFromMatrix4(hP.makeRotationFromEuler(v)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(qM),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,n(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,n(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,n(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,_,w){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*_,p.scale.value=w*.5,m.map&&(p.map.value=m.map,n(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,n(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,n(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,n(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function u(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function f(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function h(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,n(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,n(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function d(p,m,_){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,n(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,n(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,n(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,n(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,n(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Fi&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.retroreflectivity>0&&(p.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,n(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,n(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=_.texture,p.transmissionSamplerSize.value.set(_.width,_.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,n(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,n(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,n(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,n(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,n(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function x(p,m){let _=e.get(m).light;p.referencePosition.value.setFromMatrixPosition(_.matrixWorld),p.nearDistance.value=_.shadow.camera.near,p.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function pP(t,e,n,i){let r={},s={},o=[],a=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(v,M){let S=M.program;i.uniformBlockBinding(v,S)}function c(v,M){let S=r[v.id];S===void 0&&(p(v),S=u(v),r[v.id]=S,v.addEventListener("dispose",_));let E=M.program;i.updateUBOMapping(v,E);let y=e.render.frame;s[v.id]!==y&&(h(v),s[v.id]=y)}function u(v){let M=f();v.__bindingPointIndex=M;let S=t.createBuffer(),E=v.__size,y=v.usage;return t.bindBuffer(t.UNIFORM_BUFFER,S),t.bufferData(t.UNIFORM_BUFFER,E,y),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,M,S),S}function f(){for(let v=0;v<a;v++)if(o.indexOf(v)===-1)return o.push(v),v;return _t("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(v){let M=r[v.id],S=v.uniforms,E=v.__cache;t.bindBuffer(t.UNIFORM_BUFFER,M);for(let y=0,A=S.length;y<A;y++){let T=S[y];if(Array.isArray(T))for(let I=0,F=T.length;I<F;I++)d(T[I],y,I,E);else d(T,y,0,E)}t.bindBuffer(t.UNIFORM_BUFFER,null)}function d(v,M,S,E){if(x(v,M,S,E)===!0){let y=v.__offset,A=v.value;if(Array.isArray(A)){let T=0;for(let I=0;I<A.length;I++){let F=A[I],z=m(F);g(F,v.__data,T),typeof F!="number"&&typeof F!="boolean"&&!F.isMatrix3&&!ArrayBuffer.isView(F)&&(T+=z.storage/Float32Array.BYTES_PER_ELEMENT)}}else g(A,v.__data,0);t.bufferSubData(t.UNIFORM_BUFFER,y,v.__data)}}function g(v,M,S){typeof v=="number"||typeof v=="boolean"?M[0]=v:v.isMatrix3?(M[0]=v.elements[0],M[1]=v.elements[1],M[2]=v.elements[2],M[3]=0,M[4]=v.elements[3],M[5]=v.elements[4],M[6]=v.elements[5],M[7]=0,M[8]=v.elements[6],M[9]=v.elements[7],M[10]=v.elements[8],M[11]=0):ArrayBuffer.isView(v)?M.set(new v.constructor(v.buffer,v.byteOffset,M.length)):v.toArray(M,S)}function x(v,M,S,E){let y=v.value,A=M+"_"+S;if(E[A]===void 0)return typeof y=="number"||typeof y=="boolean"?E[A]=y:ArrayBuffer.isView(y)?E[A]=y.slice():E[A]=y.clone(),!0;{let T=E[A];if(typeof y=="number"||typeof y=="boolean"){if(T!==y)return E[A]=y,!0}else{if(ArrayBuffer.isView(y))return!0;if(T.equals(y)===!1)return T.copy(y),!0}}return!1}function p(v){let M=v.uniforms,S=0,E=16;for(let A=0,T=M.length;A<T;A++){let I=Array.isArray(M[A])?M[A]:[M[A]];for(let F=0,z=I.length;F<z;F++){let L=I[F],V=Array.isArray(L.value)?L.value:[L.value];for(let G=0,P=V.length;G<P;G++){let O=V[G],k=m(O),$=S%E,j=$%k.boundary,Me=$+j;S+=j,Me!==0&&E-Me<k.storage&&(S+=E-Me),L.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),L.__offset=S,S+=k.storage}}}let y=S%E;return y>0&&(S+=E-y),v.__size=S,v.__cache={},this}function m(v){let M={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(M.boundary=4,M.storage=4):v.isVector2?(M.boundary=8,M.storage=8):v.isVector3||v.isColor?(M.boundary=16,M.storage=12):v.isVector4?(M.boundary=16,M.storage=16):v.isMatrix3?(M.boundary=48,M.storage=48):v.isMatrix4?(M.boundary=64,M.storage=64):v.isTexture?gt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(M.boundary=16,M.storage=v.byteLength):gt("WebGLRenderer: Unsupported uniform value type.",v),M}function _(v){let M=v.target;M.removeEventListener("dispose",_);let S=o.indexOf(M.__bindingPointIndex);o.splice(S,1),t.deleteBuffer(r[M.id]),delete r[M.id],delete s[M.id]}function w(){for(let v in r)t.deleteBuffer(r[v]);o=[],r={},s={}}return{bind:l,update:c,dispose:w}}var mP=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),hs=null;function gP(){return hs===null&&(hs=new ru(mP,16,16,Do,Mi),hs.name="DFG_LUT",hs.minFilter=Wt,hs.magFilter=Wt,hs.wrapS=_i,hs.wrapT=_i,hs.generateMipmaps=!1,hs.needsUpdate=!0),hs}var hp=class{constructor(e={}){let{canvas:n=dM(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:h=!1,outputBufferType:d=lr}=e;this.isWebGLRenderer=!0;let g;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=i.getContextAttributes().alpha}else g=o;let x=d,p=new Set([Cd,Rd,Ed]),m=new Set([lr,Br,Ll,Dl,wd,Ad]),_=new Uint32Array(4),w=new Int32Array(4),v=new C,M=null,S=null,E=[],y=[],A=null;this.domElement=n,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ar,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let T=this,I=!1,F=null,z=null,L=null,V=null;this._outputColorSpace=rr;let G=0,P=0,O=null,k=-1,$=null,j=new Yt,Me=new Yt,ve=null,Fe=new Gt(0),We=0,ke=n.width,ee=n.height,ie=1,Te=null,$e=null,re=new Yt(0,0,ke,ee),se=new Yt(0,0,ke,ee),te=!1,me=new ou,Se=!1,nt=!1,he=new Ct,Ie=new C,qe=new Yt,Ne={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ut=!1;function St(){return O===null?ie:1}let U=i;function Qt(R,H){return n.getContext(R,H)}let wt,N,b,q,J,oe,Re,D,B,X,xe,De,Ee,Ce,ze,rt,yt,W,Be,le,Oe,Ge,_e;try{let R={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${"186"}`),n.addEventListener("webglcontextlost",At,!1),n.addEventListener("webglcontextrestored",ot,!1),n.addEventListener("webglcontextcreationerror",Hn,!1),U===null){let H="webgl2";if(U=Qt(H,R),U===null)throw Qt(H)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}st()}catch(R){throw n.removeEventListener("webglcontextlost",At,!1),n.removeEventListener("webglcontextrestored",ot,!1),n.removeEventListener("webglcontextcreationerror",Hn,!1),_t("WebGLRenderer: "+R.message),R}function st(){wt=new SC(U),wt.init(),Oe=new cP(U,wt),N=new dC(U,wt,e,Oe),b=new aP(U,wt),N.reversedDepthBuffer&&h&&b.buffers.depth.setReversed(!0),z=U.createFramebuffer(),L=U.createFramebuffer(),V=U.createFramebuffer(),q=new TC(U),J=new Y3,oe=new lP(U,wt,b,J,N,Oe,q),Re=new bC(T),D=new RE(U),Ge=new fC(U,D),B=new wC(U,D,q,Ge),X=new RC(U,B,D,Ge,q),W=new EC(U,N,oe),ze=new pC(J),xe=new X3(T,Re,wt,N,Ge,ze),De=new dP(T,J),Ee=new j3,Ce=new tP(wt),yt=new uC(T,Re,b,X,g,l),rt=new oP(T,X,N),_e=new pP(U,q,N,b),Be=new hC(U,wt,q),le=new AC(U,wt,q),q.programs=xe.programs,T.capabilities=N,T.extensions=wt,T.properties=J,T.renderLists=Ee,T.shadowMap=rt,T.state=b,T.info=q}x!==lr&&(A=new PC(x,n.width,n.height,a,r,s));let ue=new Xg(T,U);this.xr=ue,this.getContext=function(){return U},this.getContextAttributes=function(){return U.getContextAttributes()},this.forceContextLoss=function(){let R=wt.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){let R=wt.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return ie},this.setPixelRatio=function(R){R!==void 0&&(ie=R,this.setSize(ke,ee,!1))},this.getSize=function(R){return R.set(ke,ee)},this.setSize=function(R,H,ne=!0){if(ue.isPresenting){gt("WebGLRenderer: Can't change size while VR device is presenting.");return}ke=R,ee=H,n.width=Math.floor(R*ie),n.height=Math.floor(H*ie),ne===!0&&(n.style.width=R+"px",n.style.height=H+"px"),A!==null&&A.setSize(n.width,n.height),this.setViewport(0,0,R,H)},this.getDrawingBufferSize=function(R){return R.set(ke*ie,ee*ie).floor()},this.setDrawingBufferSize=function(R,H,ne){ke=R,ee=H,ie=ne,n.width=Math.floor(R*ne),n.height=Math.floor(H*ne),this.setViewport(0,0,R,H)},this.setEffects=function(R){if(x===lr){_t("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(R){for(let H=0;H<R.length;H++)if(R[H].isOutputPass===!0){gt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(R||[])},this.getCurrentViewport=function(R){return R.copy(j)},this.getViewport=function(R){return R.copy(re)},this.setViewport=function(R,H,ne,Z){R.isVector4?re.set(R.x,R.y,R.z,R.w):re.set(R,H,ne,Z),b.viewport(j.copy(re).multiplyScalar(ie).round())},this.getScissor=function(R){return R.copy(se)},this.setScissor=function(R,H,ne,Z){R.isVector4?se.set(R.x,R.y,R.z,R.w):se.set(R,H,ne,Z),b.scissor(Me.copy(se).multiplyScalar(ie).round())},this.getScissorTest=function(){return te},this.setScissorTest=function(R){b.setScissorTest(te=R)},this.setOpaqueSort=function(R){Te=R},this.setTransparentSort=function(R){$e=R},this.getClearColor=function(R){return R.copy(yt.getClearColor())},this.setClearColor=function(){yt.setClearColor(...arguments)},this.getClearAlpha=function(){return yt.getClearAlpha()},this.setClearAlpha=function(){yt.setClearAlpha(...arguments)},this.clear=function(R=!0,H=!0,ne=!0){let Z=0;if(R){let K=!1;if(O!==null){let Xe=O.texture.format;K=p.has(Xe)}if(K){let Xe=O.texture.type,Ke=m.has(Xe),He=yt.getClearColor(),et=yt.getClearAlpha(),at=He.r,Nt=He.g,zt=He.b;Ke?(_[0]=at,_[1]=Nt,_[2]=zt,_[3]=et,U.clearBufferuiv(U.COLOR,0,_)):(w[0]=at,w[1]=Nt,w[2]=zt,w[3]=et,U.clearBufferiv(U.COLOR,0,w))}else Z|=U.COLOR_BUFFER_BIT}H&&(Z|=U.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),ne&&(Z|=U.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Z!==0&&U.clear(Z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(R){R.setRenderer(this),F=R},this.dispose=function(){n.removeEventListener("webglcontextlost",At,!1),n.removeEventListener("webglcontextrestored",ot,!1),n.removeEventListener("webglcontextcreationerror",Hn,!1),yt.dispose(),Ee.dispose(),Ce.dispose(),J.dispose(),Re.dispose(),X.dispose(),Ge.dispose(),_e.dispose(),xe.dispose(),ue.dispose(),ue.removeEventListener("sessionstart",Ic),ue.removeEventListener("sessionend",Lc),Jr.stop()};function At(R){R.preventDefault(),Qc("WebGLRenderer: Context Lost."),I=!0}function ot(){Qc("WebGLRenderer: Context Restored."),I=!1;let R=q.autoReset,H=rt.enabled,ne=rt.autoUpdate,Z=rt.needsUpdate,K=rt.type;st(),q.autoReset=R,rt.enabled=H,rt.autoUpdate=ne,rt.needsUpdate=Z,rt.type=K}function Hn(R){_t("WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function zi(R){let H=R.target;H.removeEventListener("dispose",zi),$f(H)}function $f(R){qa(R),J.remove(R)}function qa(R){let H=J.get(R).programs;H!==void 0&&(H.forEach(function(ne){xe.releaseProgram(ne)}),R.isShaderMaterial&&xe.releaseShaderCache(R))}this.renderBufferDirect=function(R,H,ne,Z,K,Xe){H===null&&(H=Ne);let Ke=K.isMesh&&K.matrixWorld.determinantAffine()<0,He=rT(R,H,ne,Z,K);b.setMaterial(Z,Ke);let et=ne.index,at=1;if(Z.wireframe===!0){if(et=B.getWireframeAttribute(ne),et===void 0)return;at=2}let Nt=ne.drawRange,zt=ne.attributes.position,tt=Nt.start*at,sn=(Nt.start+Nt.count)*at;Xe!==null&&(tt=Math.max(tt,Xe.start*at),sn=Math.min(sn,(Xe.start+Xe.count)*at)),et!==null?(tt=Math.max(tt,0),sn=Math.min(sn,et.count)):zt!=null&&(tt=Math.max(tt,0),sn=Math.min(sn,zt.count));let Wn=sn-tt;if(Wn<0||Wn===1/0)return;Ge.setup(K,Z,He,ne,et);let bn,gn=Be;if(et!==null&&(bn=D.get(et),gn=le,gn.setIndex(bn)),K.isMesh)Z.wireframe===!0?(b.setLineWidth(Z.wireframeLinewidth*St()),gn.setMode(U.LINES)):gn.setMode(U.TRIANGLES);else if(K.isLine){let mi=Z.linewidth;mi===void 0&&(mi=1),b.setLineWidth(mi*St()),K.isLineSegments?gn.setMode(U.LINES):K.isLineLoop?gn.setMode(U.LINE_LOOP):gn.setMode(U.LINE_STRIP)}else K.isPoints?gn.setMode(U.POINTS):K.isSprite&&gn.setMode(U.TRIANGLES);if(K.isBatchedMesh)if(wt.get("WEBGL_multi_draw"))gn.renderMultiDraw(K._multiDrawStarts,K._multiDrawCounts,K._multiDrawCount);else{let mi=K._multiDrawStarts,Ze=K._multiDrawCounts,Pi=K._multiDrawCount,qt=et?D.get(et).bytesPerElement:1,vr=J.get(Z).currentProgram.getUniforms();for(let Qr=0;Qr<Pi;Qr++)vr.setValue(U,"_gl_DrawID",Qr),gn.render(mi[Qr]/qt,Ze[Qr])}else if(K.isInstancedMesh)gn.renderInstances(tt,Wn,K.count);else if(ne.isInstancedBufferGeometry){let mi=ne._maxInstanceCount!==void 0?ne._maxInstanceCount:1/0,Ze=Math.min(ne.instanceCount,mi);gn.renderInstances(tt,Wn,Ze)}else gn.render(tt,Wn)};function Xf(R,H,ne,Z){F!==null&&R.isNodeMaterial&&F.setObject(Z,R),Se===!0&&ze.setState(R,ne,!1),R.transparent===!0&&R.side===fs&&R.forceSinglePass===!1?(R.side=Fi,R.needsUpdate=!0,qf(R,H,Z),R.side=us,R.needsUpdate=!0,qf(R,H,Z),R.side=fs):qf(R,H,Z)}this.compile=function(R,H,ne=null){ne===null&&(ne=R),F!==null&&F.renderStart(R,H,ne),S=Ce.get(ne),S.init(H),y.push(S),ne.traverseVisible(function(K){K.isLight&&K.layers.test(H.layers)&&(S.pushLight(K),K.castShadow&&S.pushShadow(K))}),R!==ne&&R.traverseVisible(function(K){K.isLight&&K.layers.test(H.layers)&&(S.pushLight(K),K.castShadow&&S.pushShadow(K))}),S.setupLights(),F!==null&&F.updateLights(S.state.lightsArray),nt=this.localClippingEnabled,Se=ze.init(this.clippingPlanes,nt),Se===!0&&ze.setGlobalState(this.clippingPlanes,H),F!==null&&rt.render(S.state.shadowsArray,ne,H);let Z=new Set;return R.traverse(function(K){if(!(K.isMesh||K.isPoints||K.isLine||K.isSprite))return;let Xe=K.material;if(Xe)if(Array.isArray(Xe))for(let Ke=0;Ke<Xe.length;Ke++){let He=Xe[Ke];Xf(He,ne,H,K),Z.add(He)}else Xf(Xe,ne,H,K),Z.add(Xe)}),S=y.pop(),F!==null&&F.renderEnd(),Z},this.compileAsync=function(R,H,ne=null){let Z=this.compile(R,H,ne);return new Promise(K=>{function Xe(){if(Z.forEach(function(Ke){let et=J.get(Ke).currentProgram;(et===void 0||et.isReady())&&Z.delete(Ke)}),Z.size===0){K(R);return}setTimeout(Xe,10)}wt.get("KHR_parallel_shader_compile")!==null?Xe():setTimeout(Xe,10)})};let ja=null;function n0(R){ja&&ja(R)}function Ic(){Jr.stop()}function Lc(){Jr.start()}let Jr=new GM;Jr.setAnimationLoop(n0),typeof self<"u"&&Jr.setContext(self),this.setAnimationLoop=function(R){ja=R,ue.setAnimationLoop(R),R===null?Jr.stop():Jr.start()},ue.addEventListener("sessionstart",Ic),ue.addEventListener("sessionend",Lc),this.render=function(R,H){if(H!==void 0&&H.isCamera!==!0){_t("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(I===!0)return;F!==null&&F.renderStart(R,H);let ne=ue.enabled===!0&&ue.isPresenting===!0,Z=A!==null&&(O===null||ne)&&A.begin(T,O);if(R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),H.parent===null&&H.matrixWorldAutoUpdate===!0&&H.updateMatrixWorld(),ue.enabled===!0&&ue.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(ue.cameraAutoUpdate===!0&&ue.updateCamera(H),H=ue.getCamera()),R.isScene===!0&&R.onBeforeRender(T,R,H,O),S=Ce.get(R,y.length),S.init(H),S.state.textureUnits=oe.getTextureUnits(),y.push(S),he.multiplyMatrices(H.projectionMatrix,H.matrixWorldInverse),me.setFromProjectionMatrix(he,kr,H.reversedDepth),nt=this.localClippingEnabled,Se=ze.init(this.clippingPlanes,nt),M=Ee.get(R,E.length),M.init(),E.push(M),ue.enabled===!0&&ue.isPresenting===!0){let Ke=T.xr.getDepthSensingMesh();Ke!==null&&Es(Ke,H,-1/0,T.sortObjects)}Es(R,H,0,T.sortObjects),M.finish(),F!==null&&F.updateLights(S.state.lightsArray),T.sortObjects===!0&&M.sort(Te,$e),ut=ue.enabled===!1||ue.isPresenting===!1||ue.hasDepthSensing()===!1,ut&&yt.addToRenderList(M,R),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),Se===!0&&ze.beginShadows();let K=S.state.shadowsArray;if(rt.render(K,R,H),Se===!0&&ze.endShadows(),(Z&&A.hasRenderPass())===!1){let Ke=M.opaque,He=M.transmissive;if(S.setupLights(),H.isArrayCamera){let et=H.cameras;if(He.length>0)for(let at=0,Nt=et.length;at<Nt;at++){let zt=et[at];gy(Ke,He,R,zt)}ut&&yt.render(R);for(let at=0,Nt=et.length;at<Nt;at++){let zt=et[at];Za(M,R,zt,zt.viewport)}}else He.length>0&&gy(Ke,He,R,H),ut&&yt.render(R),Za(M,R,H)}O!==null&&P===0&&(oe.updateMultisampleRenderTarget(O),oe.updateRenderTargetMipmap(O)),Z&&A.end(T),R.isScene===!0&&R.onAfterRender(T,R,H),Ge.resetDefaultState(),k=-1,$=null,y.pop(),y.length>0?(S=y[y.length-1],oe.setTextureUnits(S.state.textureUnits),Se===!0&&ze.setGlobalState(T.clippingPlanes,S.state.camera)):S=null,E.pop(),E.length>0?M=E[E.length-1]:M=null,F!==null&&F.renderEnd()};function Es(R,H,ne,Z){if(R.visible===!1)return;if(R.layers.test(H.layers)){if(R.isGroup)ne=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(H);else if(R.isLightProbeGrid)S.pushLightProbeGrid(R);else if(R.isLight)S.pushLight(R),R.castShadow&&S.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||R.intersectsFrustum(me)){Z&&qe.setFromMatrixPosition(R.matrixWorld).applyMatrix4(he);let Ke=X.update(R),He=R.material;He.visible&&M.push(R,Ke,He,ne,qe.z,null,H)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||R.intersectsFrustum(me))){let Ke=X.update(R),He=R.material;if(Z&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),qe.copy(R.boundingSphere.center)):(Ke.boundingSphere===null&&Ke.computeBoundingSphere(),qe.copy(Ke.boundingSphere.center)),qe.applyMatrix4(R.matrixWorld).applyMatrix4(he)),Array.isArray(He)){let et=Ke.groups;for(let at=0,Nt=et.length;at<Nt;at++){let zt=et[at],tt=He[zt.materialIndex];tt&&tt.visible&&M.push(R,Ke,tt,ne,qe.z,zt,H)}}else He.visible&&M.push(R,Ke,He,ne,qe.z,null,H)}}let Xe=R.children;for(let Ke=0,He=Xe.length;Ke<He;Ke++)Es(Xe[Ke],H,ne,Z)}function Za(R,H,ne,Z){let{opaque:K,transmissive:Xe,transparent:Ke}=R;S.setupLightsView(ne),Se===!0&&ze.setGlobalState(T.clippingPlanes,ne),Z&&b.viewport(j.copy(Z)),K.length>0&&Yf(K,H,ne),Xe.length>0&&Yf(Xe,H,ne),Ke.length>0&&Yf(Ke,H,ne),b.buffers.depth.setTest(!0),b.buffers.depth.setMask(!0),b.buffers.color.setMask(!0),b.setPolygonOffset(!1)}function gy(R,H,ne,Z){if((ne.isScene===!0?ne.overrideMaterial:null)!==null)return;if(S.state.transmissionRenderTarget[Z.id]===void 0){let tt=wt.has("EXT_color_buffer_half_float")||wt.has("EXT_color_buffer_float");S.state.transmissionRenderTarget[Z.id]=new Yn(1,1,{generateMipmaps:!0,type:tt?Mi:lr,minFilter:Io,samples:Math.max(4,N.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:kt.workingColorSpace})}let Xe=S.state.transmissionRenderTarget[Z.id],Ke=Z.viewport||j;Xe.setSize(Ke.z*T.transmissionResolutionScale,Ke.w*T.transmissionResolutionScale);let He=T.getRenderTarget(),et=T.getActiveCubeFace(),at=T.getActiveMipmapLevel();T.setRenderTarget(Xe),T.getClearColor(Fe),We=T.getClearAlpha(),We<1&&T.setClearColor(16777215,.5),T.clear(),ut&&yt.render(ne);let Nt=T.toneMapping;T.toneMapping=ar;let zt=Z.viewport;if(Z.viewport!==void 0&&(Z.viewport=void 0),S.setupLightsView(Z),Se===!0&&ze.setGlobalState(T.clippingPlanes,Z),Yf(R,ne,Z),oe.updateMultisampleRenderTarget(Xe),oe.updateRenderTargetMipmap(Xe),wt.has("WEBGL_multisampled_render_to_texture")===!1){let tt=!1;for(let sn=0,Wn=H.length;sn<Wn;sn++){let bn=H[sn],{object:gn,geometry:mi,material:Ze,group:Pi}=bn;if(Ze.side===fs&&gn.layers.test(Z.layers)){let qt=Ze.side;Ze.side=Fi,Ze.needsUpdate=!0,xy(gn,ne,Z,mi,Ze,Pi),Ze.side=qt,Ze.needsUpdate=!0,tt=!0}}tt===!0&&(oe.updateMultisampleRenderTarget(Xe),oe.updateRenderTargetMipmap(Xe))}T.setRenderTarget(He,et,at),T.setClearColor(Fe,We),zt!==void 0&&(Z.viewport=zt),T.toneMapping=Nt}function Yf(R,H,ne){let Z=H.isScene===!0?H.overrideMaterial:null;for(let K=0,Xe=R.length;K<Xe;K++){let Ke=R[K],{object:He,geometry:et,group:at}=Ke,Nt=Ke.material;Nt.allowOverride===!0&&Z!==null&&(Nt=Z),He.layers.test(ne.layers)&&xy(He,H,ne,et,Nt,at)}}function xy(R,H,ne,Z,K,Xe){F!==null&&K.isNodeMaterial&&F.setObject(R,K),R.onBeforeRender(T,H,ne,Z,K,Xe),R.modelViewMatrix.multiplyMatrices(ne.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),K.onBeforeRender(T,H,ne,Z,R,Xe),K.transparent===!0&&K.side===fs&&K.forceSinglePass===!1?(K.side=Fi,K.needsUpdate=!0,T.renderBufferDirect(ne,H,Z,K,R,Xe),K.side=us,K.needsUpdate=!0,T.renderBufferDirect(ne,H,Z,K,R,Xe),K.side=fs):T.renderBufferDirect(ne,H,Z,K,R,Xe),R.onAfterRender(T,H,ne,Z,K,Xe)}function qf(R,H,ne){H.isScene!==!0&&(H=Ne);let Z=J.get(R),K=S.state.lights,Xe=S.state.shadowsArray,Ke=K.state.version,He=xe.getParameters(R,K.state,Xe,H,ne,S.state.lightProbeGridArray),et=xe.getProgramCacheKey(He),at=Z.programs;Z.environment=R.isMeshStandardMaterial||R.isMeshLambertMaterial||R.isMeshPhongMaterial?H.environment:null,Z.fog=H.fog;let Nt=R.isMeshStandardMaterial||R.isMeshLambertMaterial&&!R.envMap||R.isMeshPhongMaterial&&!R.envMap;Z.envMap=Re.get(R.envMap||Z.environment,Nt),Z.envMapRotation=Z.environment!==null&&R.envMap===null?H.environmentRotation:R.envMapRotation,at===void 0&&(R.addEventListener("dispose",zi),at=new Map,Z.programs=at);let zt=at.get(et);if(zt!==void 0){if(Z.currentProgram===zt&&Z.lightsStateVersion===Ke)return yy(R,He),zt}else He.uniforms=xe.getUniforms(R),F!==null&&R.isNodeMaterial&&F.build(R,ne,He),R.onBeforeCompile(He,T),zt=xe.acquireProgram(He,et),at.set(et,zt),Z.uniforms=He.uniforms;let tt=Z.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(tt.clippingPlanes=ze.uniform),yy(R,He),Z.needsLights=oT(R),Z.lightsStateVersion=Ke,Z.needsLights&&(tt.ambientLightColor.value=K.state.ambient,tt.lightProbe.value=K.state.probe,tt.sunLights.value=K.state.sun,tt.sunLightShadows.value=K.state.sunShadow,tt.directionalLights.value=K.state.directional,tt.directionalLightShadows.value=K.state.directionalShadow,tt.spotLights.value=K.state.spot,tt.spotLightShadows.value=K.state.spotShadow,tt.rectAreaLights.value=K.state.rectArea,tt.ltc_1.value=K.state.rectAreaLTC1,tt.ltc_2.value=K.state.rectAreaLTC2,tt.pointLights.value=K.state.point,tt.pointLightShadows.value=K.state.pointShadow,tt.hemisphereLights.value=K.state.hemi,tt.sunShadowMatrix.value=K.state.sunShadowMatrix,tt.sunShadowCascade.value=K.state.sunShadowCascade,tt.directionalShadowMatrix.value=K.state.directionalShadowMatrix,tt.spotLightMatrix.value=K.state.spotLightMatrix,tt.spotLightMap.value=K.state.spotLightMap,tt.pointShadowMatrix.value=K.state.pointShadowMatrix),Z.lightProbeGrid=S.state.lightProbeGridArray.length>0,Z.currentProgram=zt,Z.uniformsList=null,zt}function vy(R){if(R.uniformsList===null){let H=R.currentProgram.getUniforms();R.uniformsList=Ol.seqWithValue(H.seq,R.uniforms)}return R.uniformsList}function yy(R,H){let ne=J.get(R);ne.outputColorSpace=H.outputColorSpace,ne.batching=H.batching,ne.batchingColor=H.batchingColor,ne.instancing=H.instancing,ne.instancingColor=H.instancingColor,ne.instancingMorph=H.instancingMorph,ne.skinning=H.skinning,ne.morphTargets=H.morphTargets,ne.morphNormals=H.morphNormals,ne.morphColors=H.morphColors,ne.morphTargetsCount=H.morphTargetsCount,ne.numClippingPlanes=H.numClippingPlanes,ne.numIntersection=H.numClipIntersection,ne.vertexAlphas=H.vertexAlphas,ne.vertexTangents=H.vertexTangents,ne.toneMapping=H.toneMapping}function iT(R,H){if(R.length===0)return null;if(R.length===1)return R[0].texture!==null?R[0]:null;v.setFromMatrixPosition(H.matrixWorld);for(let ne=0,Z=R.length;ne<Z;ne++){let K=R[ne];if(K.texture!==null&&K.boundingBox.containsPoint(v))return K}return null}function rT(R,H,ne,Z,K){H.isScene!==!0&&(H=Ne),oe.resetTextureUnits();let Xe=H.fog,Ke=Z.isMeshStandardMaterial||Z.isMeshLambertMaterial||Z.isMeshPhongMaterial?H.environment:null,He=O===null?T.outputColorSpace:O.isXRRenderTarget===!0?O.texture.colorSpace:kt.workingColorSpace,et=Z.isMeshStandardMaterial||Z.isMeshLambertMaterial&&!Z.envMap||Z.isMeshPhongMaterial&&!Z.envMap,at=Re.get(Z.envMap||Ke,et),Nt=Z.vertexColors===!0&&!!ne.attributes.color&&ne.attributes.color.itemSize===4,zt=!!ne.attributes.tangent&&(!!Z.normalMap||Z.anisotropy>0),tt=!!ne.morphAttributes.position,sn=!!ne.morphAttributes.normal,Wn=!!ne.morphAttributes.color,bn=ar;Z.toneMapped&&(O===null||O.isXRRenderTarget===!0)&&(bn=T.toneMapping);let gn=ne.morphAttributes.position||ne.morphAttributes.normal||ne.morphAttributes.color,mi=gn!==void 0?gn.length:0,Ze=J.get(Z),Pi=S.state.lights;if(Se===!0&&(nt===!0||R!==$)){let _n=R===$&&Z.id===k;ze.setState(Z,R,_n)}let qt=!1;Z.version===Ze.__version?(Ze.needsLights&&Ze.lightsStateVersion!==Pi.state.version||Ze.outputColorSpace!==He||K.isBatchedMesh&&Ze.batching===!1||!K.isBatchedMesh&&Ze.batching===!0||K.isBatchedMesh&&Ze.batchingColor===!0&&K._colorsTexture===null||K.isBatchedMesh&&Ze.batchingColor===!1&&K._colorsTexture!==null||K.isInstancedMesh&&Ze.instancing===!1||!K.isInstancedMesh&&Ze.instancing===!0||K.isSkinnedMesh&&Ze.skinning===!1||!K.isSkinnedMesh&&Ze.skinning===!0||K.isInstancedMesh&&Ze.instancingColor===!0&&K.instanceColor===null||K.isInstancedMesh&&Ze.instancingColor===!1&&K.instanceColor!==null||K.isInstancedMesh&&Ze.instancingMorph===!0&&K.morphTexture===null||K.isInstancedMesh&&Ze.instancingMorph===!1&&K.morphTexture!==null||Ze.envMap!==at||Z.fog===!0&&Ze.fog!==Xe||Ze.numClippingPlanes!==void 0&&(Ze.numClippingPlanes!==ze.numPlanes||Ze.numIntersection!==ze.numIntersection)||Ze.vertexAlphas!==Nt||Ze.vertexTangents!==zt||Ze.morphTargets!==tt||Ze.morphNormals!==sn||Ze.morphColors!==Wn||Ze.toneMapping!==bn||Ze.morphTargetsCount!==mi||!!Ze.lightProbeGrid!=S.state.lightProbeGridArray.length>0)&&(qt=!0):(qt=!0,Ze.__version=Z.version);let vr=Ze.currentProgram;qt===!0&&(vr=qf(Z,H,K),F&&Z.isNodeMaterial&&F.onUpdateProgram(Z,vr,Ze));let Qr=!1,uo=!1,Ka=!1,dn=vr.getUniforms(),Vn=Ze.uniforms;if(b.useProgram(vr.program)&&(Qr=!0,uo=!0,Ka=!0),Z.id!==k&&(k=Z.id,uo=!0),Ze.needsLights){let _n=iT(S.state.lightProbeGridArray,K);Ze.lightProbeGrid!==_n&&(Ze.lightProbeGrid=_n,uo=!0)}if(Qr||$!==R){b.buffers.depth.getReversed()&&R.reversedDepth!==!0&&(R._reversedDepth=!0,R.updateProjectionMatrix()),dn.setValue(U,"projectionMatrix",R.projectionMatrix),dn.setValue(U,"viewMatrix",R.matrixWorldInverse);let ho=dn.map.cameraPosition;ho!==void 0&&ho.setValue(U,Ie.setFromMatrixPosition(R.matrixWorld)),N.logarithmicDepthBuffer&&dn.setValue(U,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(Z.isMeshPhongMaterial||Z.isMeshToonMaterial||Z.isMeshLambertMaterial||Z.isMeshBasicMaterial||Z.isMeshStandardMaterial||Z.isShaderMaterial)&&dn.setValue(U,"isOrthographic",R.isOrthographicCamera===!0),$!==R&&($=R,uo=!0,Ka=!0)}if(Ze.needsLights&&(Pi.state.sunShadowMap.length>0&&dn.setValue(U,"sunShadowMap",Pi.state.sunShadowMap,oe),Pi.state.directionalShadowMap.length>0&&dn.setValue(U,"directionalShadowMap",Pi.state.directionalShadowMap,oe),Pi.state.spotShadowMap.length>0&&dn.setValue(U,"spotShadowMap",Pi.state.spotShadowMap,oe),Pi.state.pointShadowMap.length>0&&dn.setValue(U,"pointShadowMap",Pi.state.pointShadowMap,oe)),K.isSkinnedMesh){dn.setOptional(U,K,"bindMatrix"),dn.setOptional(U,K,"bindMatrixInverse");let _n=K.skeleton;_n&&(_n.boneTexture===null&&_n.computeBoneTexture(),dn.setValue(U,"boneTexture",_n.boneTexture,oe))}K.isBatchedMesh&&(dn.setOptional(U,K,"batchingTexture"),dn.setValue(U,"batchingTexture",K._matricesTexture,oe),dn.setOptional(U,K,"batchingIdTexture"),dn.setValue(U,"batchingIdTexture",K._indirectTexture,oe),dn.setOptional(U,K,"batchingColorTexture"),K._colorsTexture!==null&&dn.setValue(U,"batchingColorTexture",K._colorsTexture,oe));let fo=ne.morphAttributes;if((fo.position!==void 0||fo.normal!==void 0||fo.color!==void 0)&&W.update(K,ne,vr),(uo||Ze.receiveShadow!==K.receiveShadow)&&(Ze.receiveShadow=K.receiveShadow,dn.setValue(U,"receiveShadow",K.receiveShadow)),(Z.isMeshStandardMaterial||Z.isMeshLambertMaterial||Z.isMeshPhongMaterial)&&Z.envMap===null&&H.environment!==null&&(Vn.envMapIntensity.value=H.environmentIntensity),Vn.dfgLUT!==void 0&&(Vn.dfgLUT.value=gP()),uo){if(dn.setValue(U,"toneMappingExposure",T.toneMappingExposure),Ze.needsLights&&sT(Vn,Ka),Xe&&Z.fog===!0&&De.refreshFogUniforms(Vn,Xe),De.refreshMaterialUniforms(Vn,Z,ie,ee,S.state.transmissionRenderTarget[R.id]),Ze.needsLights&&Ze.lightProbeGrid){let _n=Ze.lightProbeGrid;Vn.probesSH.value=_n.texture,Vn.probesMin.value.copy(_n.boundingBox.min),Vn.probesMax.value.copy(_n.boundingBox.max),Vn.probesResolution.value.copy(_n.resolution)}Ol.upload(U,vy(Ze),Vn,oe)}if(Z.isShaderMaterial&&Z.uniformsNeedUpdate===!0&&(Ol.upload(U,vy(Ze),Vn,oe),Z.uniformsNeedUpdate=!1),Z.isSpriteMaterial&&dn.setValue(U,"center",K.center),dn.setValue(U,"modelViewMatrix",K.modelViewMatrix),dn.setValue(U,"normalMatrix",K.normalMatrix),dn.setValue(U,"modelMatrix",K.matrixWorld),Z.uniformsGroups!==void 0){let _n=Z.uniformsGroups;for(let ho=0,Ja=_n.length;ho<Ja;ho++){let My=_n[ho];_e.update(My,vr),_e.bind(My,vr)}}return vr}function sT(R,H){R.ambientLightColor.needsUpdate=H,R.lightProbe.needsUpdate=H,R.sunLights.needsUpdate=H,R.sunLightShadows.needsUpdate=H,R.directionalLights.needsUpdate=H,R.directionalLightShadows.needsUpdate=H,R.pointLights.needsUpdate=H,R.pointLightShadows.needsUpdate=H,R.spotLights.needsUpdate=H,R.spotLightShadows.needsUpdate=H,R.rectAreaLights.needsUpdate=H,R.hemisphereLights.needsUpdate=H}function oT(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return G},this.getActiveMipmapLevel=function(){return P},this.getRenderTarget=function(){return O},this.setRenderTargetTextures=function(R,H,ne){let Z=J.get(R);Z.__autoAllocateDepthBuffer=R.resolveDepthBuffer===!1,Z.__autoAllocateDepthBuffer===!1&&(Z.__useRenderToTexture=!1),J.get(R.texture).__webglTexture=H,J.get(R.depthTexture).__webglTexture=Z.__autoAllocateDepthBuffer?void 0:ne,Z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(R,H){let ne=J.get(R);ne.__webglFramebuffer=H,ne.__useDefaultFramebuffer=H===void 0},this.setRenderTarget=function(R,H=0,ne=0){O=R,G=H,P=ne;let Z=null,K=!1,Xe=!1;if(R){let He=J.get(R);if(He.__useDefaultFramebuffer!==void 0){b.bindFramebuffer(U.FRAMEBUFFER,He.__webglFramebuffer),j.copy(R.viewport),Me.copy(R.scissor),ve=R.scissorTest,b.viewport(j),b.scissor(Me),b.setScissorTest(ve),k=-1;return}else if(He.__webglFramebuffer===void 0)oe.setupRenderTarget(R);else if(He.__hasExternalTextures)oe.rebindTextures(R,J.get(R.texture).__webglTexture,J.get(R.depthTexture).__webglTexture);else if(R.depthBuffer){let Nt=R.depthTexture;if(He.__boundDepthTexture!==Nt){if(Nt!==null&&J.has(Nt)&&(R.width!==Nt.image.width||R.height!==Nt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");oe.setupDepthRenderbuffer(R)}}let et=R.texture;(et.isData3DTexture||et.isDataArrayTexture||et.isCompressedArrayTexture)&&(Xe=!0);let at=J.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(at[H])?Z=at[H][ne]:Z=at[H],K=!0):R.samples>0&&oe.useMultisampledRTT(R)===!1?Z=J.get(R).__webglMultisampledFramebuffer:Array.isArray(at)?Z=at[ne]:Z=at,j.copy(R.viewport),Me.copy(R.scissor),ve=R.scissorTest}else j.copy(re).multiplyScalar(ie).floor(),Me.copy(se).multiplyScalar(ie).floor(),ve=te;if(ne!==0&&(Z=z),b.bindFramebuffer(U.FRAMEBUFFER,Z)&&b.drawBuffers(R,Z),b.viewport(j),b.scissor(Me),b.setScissorTest(ve),K){let He=J.get(R.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_CUBE_MAP_POSITIVE_X+H,He.__webglTexture,ne)}else if(Xe){let He=H;for(let et=0;et<R.textures.length;et++){let at=J.get(R.textures[et]);U.framebufferTextureLayer(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0+et,at.__webglTexture,ne,He)}}else if(R!==null&&ne!==0){let He=J.get(R.texture);U.framebufferTexture2D(U.FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,He.__webglTexture,ne)}k=-1};function _y(R){let H=J.get(R);return(H.__readFormat!==R.format||H.__readType!==R.type)&&(H.__readFormat=R.format,H.__readType=R.type,H.__formatReadable=N.textureFormatReadable(R.format),H.__typeReadable=N.textureTypeReadable(R.type)),H}this.readRenderTargetPixels=function(R,H,ne,Z,K,Xe,Ke,He=0){if(!(R&&R.isWebGLRenderTarget)){_t("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let et=J.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Ke!==void 0&&(et=et[Ke]),et){b.bindFramebuffer(U.FRAMEBUFFER,et);try{let at=R.textures[He],Nt=at.format,zt=at.type;R.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+He);let tt=_y(at);if(tt.__formatReadable===!1){_t("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(tt.__typeReadable===!1){_t("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}H>=0&&H<=R.width-Z&&ne>=0&&ne<=R.height-K&&U.readPixels(H,ne,Z,K,Oe.convert(Nt),Oe.convert(zt),Xe)}finally{let at=O!==null?J.get(O).__webglFramebuffer:null;b.bindFramebuffer(U.FRAMEBUFFER,at)}}},this.readRenderTargetPixelsAsync=async function(R,H,ne,Z,K,Xe,Ke,He=0){if(!(R&&R.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let et=J.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&Ke!==void 0&&(et=et[Ke]),et)if(H>=0&&H<=R.width-Z&&ne>=0&&ne<=R.height-K){b.bindFramebuffer(U.FRAMEBUFFER,et);let at=R.textures[He],Nt=at.format,zt=at.type;R.textures.length>1&&U.readBuffer(U.COLOR_ATTACHMENT0+He);let tt=_y(at);if(tt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(tt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let sn=U.createBuffer();U.bindBuffer(U.PIXEL_PACK_BUFFER,sn),U.bufferData(U.PIXEL_PACK_BUFFER,Xe.byteLength,U.STREAM_READ),U.readPixels(H,ne,Z,K,Oe.convert(Nt),Oe.convert(zt),0),U.bindBuffer(U.PIXEL_PACK_BUFFER,null);let Wn=O!==null?J.get(O).__webglFramebuffer:null;b.bindFramebuffer(U.FRAMEBUFFER,Wn);let bn=U.fenceSync(U.SYNC_GPU_COMMANDS_COMPLETE,0);return U.flush(),await mM(U,bn,4),U.bindBuffer(U.PIXEL_PACK_BUFFER,sn),U.getBufferSubData(U.PIXEL_PACK_BUFFER,0,Xe),U.bindBuffer(U.PIXEL_PACK_BUFFER,null),U.deleteBuffer(sn),U.deleteSync(bn),Xe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(R,H=null,ne=0){let Z=Math.pow(2,-ne),K=Math.floor(R.image.width*Z),Xe=Math.floor(R.image.height*Z),Ke=H!==null?H.x:0,He=H!==null?H.y:0;oe.setTexture2D(R,0),U.copyTexSubImage2D(U.TEXTURE_2D,ne,0,0,Ke,He,K,Xe),b.unbindTexture()},this.copyTextureToTexture=function(R,H,ne=null,Z=null,K=0,Xe=0){let Ke,He,et,at,Nt,zt,tt,sn,Wn,bn=R.isCompressedTexture?R.mipmaps[Xe]:R.image;if(ne!==null)Ke=ne.max.x-ne.min.x,He=ne.max.y-ne.min.y,et=ne.isBox3?ne.max.z-ne.min.z:1,at=ne.min.x,Nt=ne.min.y,zt=ne.isBox3?ne.min.z:0;else{let Vn=Math.pow(2,-K);Ke=Math.floor(bn.width*Vn),He=Math.floor(bn.height*Vn),R.isDataArrayTexture?et=bn.depth:R.isData3DTexture?et=Math.floor(bn.depth*Vn):et=1,at=0,Nt=0,zt=0}Z!==null?(tt=Z.x,sn=Z.y,Wn=Z.z):(tt=0,sn=0,Wn=0);let gn=Oe.convert(H.format),mi=Oe.convert(H.type),Ze;H.isData3DTexture?(oe.setTexture3D(H,0),Ze=U.TEXTURE_3D):H.isDataArrayTexture||H.isCompressedArrayTexture?(oe.setTexture2DArray(H,0),Ze=U.TEXTURE_2D_ARRAY):(oe.setTexture2D(H,0),Ze=U.TEXTURE_2D),b.activeTexture(U.TEXTURE0),b.pixelStorei(U.UNPACK_FLIP_Y_WEBGL,H.flipY),b.pixelStorei(U.UNPACK_PREMULTIPLY_ALPHA_WEBGL,H.premultiplyAlpha),b.pixelStorei(U.UNPACK_ALIGNMENT,H.unpackAlignment);let Pi=b.getParameter(U.UNPACK_ROW_LENGTH),qt=b.getParameter(U.UNPACK_IMAGE_HEIGHT),vr=b.getParameter(U.UNPACK_SKIP_PIXELS),Qr=b.getParameter(U.UNPACK_SKIP_ROWS),uo=b.getParameter(U.UNPACK_SKIP_IMAGES);b.pixelStorei(U.UNPACK_ROW_LENGTH,bn.width),b.pixelStorei(U.UNPACK_IMAGE_HEIGHT,bn.height),b.pixelStorei(U.UNPACK_SKIP_PIXELS,at),b.pixelStorei(U.UNPACK_SKIP_ROWS,Nt),b.pixelStorei(U.UNPACK_SKIP_IMAGES,zt);let Ka=R.isDataArrayTexture||R.isData3DTexture,dn=H.isDataArrayTexture||H.isData3DTexture;if(R.isDepthTexture){let Vn=J.get(R),fo=J.get(H),_n=J.get(Vn.__renderTarget),ho=J.get(fo.__renderTarget);b.bindFramebuffer(U.READ_FRAMEBUFFER,_n.__webglFramebuffer),b.bindFramebuffer(U.DRAW_FRAMEBUFFER,ho.__webglFramebuffer);for(let Ja=0;Ja<et;Ja++)Ka&&(U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,J.get(R).__webglTexture,K,zt+Ja),U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,J.get(H).__webglTexture,Xe,Wn+Ja)),U.blitFramebuffer(at,Nt,Ke,He,tt,sn,Ke,He,U.DEPTH_BUFFER_BIT,U.NEAREST);b.bindFramebuffer(U.READ_FRAMEBUFFER,null),b.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else if(K!==0||R.isRenderTargetTexture||J.has(R)){let Vn=J.get(R),fo=J.get(H);b.bindFramebuffer(U.READ_FRAMEBUFFER,L),b.bindFramebuffer(U.DRAW_FRAMEBUFFER,V);for(let _n=0;_n<et;_n++)Ka?U.framebufferTextureLayer(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,Vn.__webglTexture,K,zt+_n):U.framebufferTexture2D(U.READ_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,Vn.__webglTexture,K),dn?U.framebufferTextureLayer(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,fo.__webglTexture,Xe,Wn+_n):U.framebufferTexture2D(U.DRAW_FRAMEBUFFER,U.COLOR_ATTACHMENT0,U.TEXTURE_2D,fo.__webglTexture,Xe),K!==0?U.blitFramebuffer(at,Nt,Ke,He,tt,sn,Ke,He,U.COLOR_BUFFER_BIT,U.NEAREST):dn?U.copyTexSubImage3D(Ze,Xe,tt,sn,Wn+_n,at,Nt,Ke,He):U.copyTexSubImage2D(Ze,Xe,tt,sn,at,Nt,Ke,He);b.bindFramebuffer(U.READ_FRAMEBUFFER,null),b.bindFramebuffer(U.DRAW_FRAMEBUFFER,null)}else dn?R.isDataTexture||R.isData3DTexture?U.texSubImage3D(Ze,Xe,tt,sn,Wn,Ke,He,et,gn,mi,bn.data):H.isCompressedArrayTexture?U.compressedTexSubImage3D(Ze,Xe,tt,sn,Wn,Ke,He,et,gn,bn.data):U.texSubImage3D(Ze,Xe,tt,sn,Wn,Ke,He,et,gn,mi,bn):R.isDataTexture?U.texSubImage2D(U.TEXTURE_2D,Xe,tt,sn,Ke,He,gn,mi,bn.data):R.isCompressedTexture?U.compressedTexSubImage2D(U.TEXTURE_2D,Xe,tt,sn,bn.width,bn.height,gn,bn.data):U.texSubImage2D(U.TEXTURE_2D,Xe,tt,sn,Ke,He,gn,mi,bn);b.pixelStorei(U.UNPACK_ROW_LENGTH,Pi),b.pixelStorei(U.UNPACK_IMAGE_HEIGHT,qt),b.pixelStorei(U.UNPACK_SKIP_PIXELS,vr),b.pixelStorei(U.UNPACK_SKIP_ROWS,Qr),b.pixelStorei(U.UNPACK_SKIP_IMAGES,uo),Xe===0&&H.generateMipmaps&&U.generateMipmap(Ze),b.unbindTexture()},this.initRenderTarget=function(R){J.get(R).__webglFramebuffer===void 0&&oe.setupRenderTarget(R)},this.initTexture=function(R){R.isCubeTexture?oe.setTextureCube(R,0):R.isData3DTexture?oe.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?oe.setTexture2DArray(R,0):oe.setTexture2D(R,0),b.unbindTexture()},this.resetState=function(){G=0,P=0,O=null,b.reset(),Ge.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return kr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let n=this.getContext();n.drawingBufferColorSpace=kt._getDrawingBufferColorSpace(e),n.unpackColorSpace=kt._getUnpackColorSpace()}};var Si=Object.freeze({DEFAULT:0,EMISSIVE:1,NOFOG:2}),$i=()=>({value:new Gt(0,0,0)}),ae={uTime:{value:0},uBreath:{value:.5},uLamp:{value:new C(0,0,3)},uLampOn:{value:1},uCamPos:{value:new C},uResolution:{value:new xt(1,1)},uPixelRatio:{value:1},uPxPerUnit:{value:1},uWorldScale:{value:1},uFogDensity:{value:.00485},uInvert:{value:0},uNight:{value:0},uEmissivePass:{value:0},uWorldTime:{value:0},uWave0a:{value:new Yt},uWave0b:{value:new Yt},uWave1a:{value:new Yt},uWave1b:{value:new Yt},uImpact:{value:0},uImpactWarm:{value:0},uPulse:{value:0},uFocus:{value:new C},uFxCaps:{value:new xt},uFxLineA:{value:1},uGap:{value:.02},uCut:{value:[0,0,0,0,0,0,0]},cVoid:$i(),cAbyss:$i(),cDeep:$i(),cSteel:$i(),cSlate:$i(),cPewter:$i(),cSilver:$i(),cWhite:$i(),cObsidian:$i(),cEmber:$i(),cEmberDeep:$i(),cElectrum:$i(),cPaper:$i(),cInk:$i()};function mp(t){return"c"+t.charAt(0).toUpperCase()+t.slice(1)}function wi(t){return ae[mp(t)]||ae.cSilver}function Ys(){let t=new Array(7);for(let e=0;e<7;e++)t[e]=new Ct;return{value:t}}function zr(){return{value:[1,1,1,1,1,1,1]}}var jM=new Map;function ya(t,e){t&&jM.set(t,Math.max(0,e||0))}function ZM(){let t=0;for(let e of jM.values())t+=e;return t/1048576}var An=Object.freeze({...Iy});function Ht(t){return t<=0?0:t>=1?1:t}function ln(t,e,n){return t+(e-t)*n}function Mr(t,e,n){if(t===e)return n<t?0:1;let i=Ht((n-t)/(e-t));return i*i*(3-2*i)}var Oi=`
uniform float uFogDensity; uniform vec3 cAbyss;
float fogVis(float dist) { float f = uFogDensity * dist; return exp(-f * f); }
vec3 applyFog(vec3 col, float dist) { return mix(cAbyss, col, fogVis(dist)); }`,qs=null,Yg=new Map,gp=1,qg=()=>{ae.uFogDensity.value=br.density*gp},br={density:ae.uFogDensity.value,set(t){qs&&(qs.cancel(),qs=null),br.density=t,qg()},to(t,e,n=An.camera){qs&&(qs.cancel(),qs=null);let i=br.density,r=ti(e,s=>{br.density=i+(t-i)*s,qg()},n);return qs=r,r.done.then(()=>{qs===r&&(qs=null)})},factor(t,e){let n=+e;n===1||!(n>0)?Yg.delete(t):Yg.set(t,n),gp=1,Yg.forEach(i=>{gp*=i}),qg()},factors(){return gp}};var xp={T3:Object.freeze({dustPool:65536,dustAmbient:49152,stir:!0,heptagon:!0,deposition:!0,prosvetWidth:1.5,threadDust:2e3,swarf:900,shed:300,puff:200,widthDof:!0}),T2:Object.freeze({dustPool:32768,dustAmbient:24576,stir:!0,heptagon:!0,deposition:!0,prosvetWidth:1.5,threadDust:600,swarf:900,shed:300,puff:200,widthDof:!0}),T1:Object.freeze({dustPool:6144,dustAmbient:4096,stir:!1,heptagon:!1,deposition:!1,prosvetWidth:1,threadDust:0,swarf:300,shed:0,puff:0,widthDof:!1})},jg=t=>Object.freeze({dustLoops:t==="T1"?1:2,shadowDb:Et.coarse?-12:-26}),Xi=Object.freeze({T3:Object.freeze({dprCap:2,msaa:!0,grains:24576,stars:Object.freeze({signal:2e3,zenith:3e3}),bloom:"kawase",lattice:1,atlas:1024,contours:12,ringTex:Object.freeze([2048,128]),labels:24,sandText:!0,fx:xp.T3,audio:jg("T3")}),T2:Object.freeze({dprCap:1.5,msaa:!0,grains:16384,stars:Object.freeze({signal:2e3,zenith:3e3}),bloom:"sprites",lattice:1,atlas:1024,contours:12,ringTex:Object.freeze([2048,128]),labels:24,sandText:!0,fx:xp.T2,audio:jg("T2")}),T1:Object.freeze({dprCap:1.25,msaa:!1,grains:8192,stars:Object.freeze({signal:800,zenith:1200}),bloom:"sprites",lattice:.5,atlas:512,contours:8,ringTex:Object.freeze([1024,64]),labels:16,sandText:!1,fx:xp.T1,audio:jg("T1")})}),xP=Object.freeze({...xp.T2,dustPool:16384,dustAmbient:12288,heptagon:!1,deposition:!1,prosvetWidth:1,threadDust:300,swarf:400,widthDof:!1}),Iu=["T1","T2","T3"],vP=/SwiftShader|llvmpipe|Software|Mali-4|Adreno \(TM\) 3/i,js=on.governor;function tb(){try{return matchMedia("(pointer: coarse)").matches&&Math.min(window.innerWidth,window.innerHeight)<=600}catch{return!1}}function Zg(t){let e=Xi[t];return e?tb()?Object.freeze({...e,msaa:t==="T2"?!1:e.msaa,labels:16,fx:t==="T2"?xP:e.fx}):e:null}function KM(t){return null}var Ru=null,bp=!1,nb=!0,Kg=-1e9,vp=null,Sp=0,JM=!1,QM=new Float32Array(js.windowFrames),kl=0,Bl=0,Cu=0,Pu=-1,zl=-1,yp=-1;function Jg(){kl=0,Bl=0,Cu=0,Pu=-1,zl=-1}var ib=30,eb=new Float32Array(ib),_p=0,Vl="off",rb=0,Mp=null;function yP(t,e){let n=Array.prototype.slice.call(t,0,e).sort((i,r)=>i-r);return e?e%2?n[(e-1)/2]:(n[e/2-1]+n[e/2])/2:0}function sb(t){let e=Iu.indexOf(t);return e>0?Iu[e-1]:t}function _P(t){let e=Iu.indexOf(t);return e>=0&&e<Iu.length-1?Iu[e+1]:t}function MP(){let t=fe.now,e=yp<0?0:t-yp;if(yp=t,!(Rt.tier==="T0"||e<=0)){if(vp&&t-Kg>=300){let n=vp;vp=null,Rt.setTier(n,"deferred")}if(Vl==="wait"&&t>=rb&&(Vl="run"),Vl==="run"){if(eb[_p++]=e,_p>=ib){Vl="done";let n=yP(eb,_p),i=Rt.tier;n>20?i="T1":n>=12&&(i=sb(i)),i!==Rt.tier&&Rt.setTier(i,`benchmark ${n.toFixed(1)} ms`),Mp&&(Mp(Rt.tier),Mp=null),Jg(),Sp=t}return}if(!bp&&t-Sp>js.upgradeAfterMs&&Y.data&&Y.data.tier!==Rt.tier)try{Y.set("tier",Rt.tier)}catch{}bp||!nb||Rt.governor.update(e/1e3)}}var Rt={tier:"T2",params:Xi.T2,detect(){let t="T0",e=null;try{let i=document.createElement("canvas").getContext("webgl2");if(!i)throw new Error("no WebGL2");let r="";try{let g=i.getExtension("WEBGL_debug_renderer_info");r=String(g?i.getParameter(g.UNMASKED_RENDERER_WEBGL):i.getParameter(i.RENDERER)||"")}catch{r=""}try{let g=i.getExtension("WEBGL_lose_context");g&&g.loseContext()}catch{}let s=vP.test(r),o=navigator.hardwareConcurrency||4,a=navigator.deviceMemory,l=(()=>{try{return matchMedia("(pointer: fine)").matches}catch{return!1}})(),c=tb(),u=Y.data&&Y.data.tier;u?t=u:s||o<=4||a!=null&&a<=3?t="T1":l&&o>=8?t="T3":(!c||a!=null&&a>=6,t="T2"),s&&(t="T1");let f=KM("tier");if(f&&/^T[0-3]$/.test(f)&&(t=f,bp=!0),KM("gov")==="0"&&(nb=!1),t==="T0")throw new Error("forced T0");let h=Zg(t),d=document.getElementById("gl");if(e=d&&d.getContext("webgl2",{antialias:h.msaa,alpha:!0,premultipliedAlpha:!0,depth:!0,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1}),!e)throw new Error("context creation failed")}catch{t="T0",e=null}return Rt.tier=t,Rt.params=Zg(t),Q.tier=t,{tier:t,gl:e}},benchmark(){return bp||Rt.tier==="T0"||Vl!=="off"?Promise.resolve(Rt.tier):(Vl="wait",_p=0,rb=fe.now+600,new Promise(t=>{Mp=t}))},setTier(t,e=""){if(!Xi[t]||t===Rt.tier||Rt.tier==="T0")return;if(Q.phase==="transition"&&fe.now-Kg<300){vp=t;return}let n=Rt.tier;Rt.tier=t,Rt.params=Zg(t),Q.tier=t,Rt.governor.dropSteps=0,Sp=fe.now,Jg();let i=Ru&&Ru.renderer;if(i)try{i.setTier(t),i.setDprDrop(0)}catch(r){ft("quality:renderer",r)}ge.emit("tier:change",{tier:t,prev:n})},governor:{fps:60,dropSteps:0,update(t){let e=t*1e3;if(!(e>0)||(kl===js.windowFrames?Cu-=QM[Bl]:kl++,QM[Bl]=e,Cu+=e,Bl=(Bl+1)%js.windowFrames,kl<js.windowFrames))return;let n=1e3/(Cu/kl);Rt.governor.fps=n;let i=fe.now;if(n<js.lowFps){zl=-1,Pu<0&&(Pu=i);let r=Ru&&Ru.renderer,s=Math.min(typeof devicePixelRatio=="number"?devicePixelRatio:1,Xi[Rt.tier].dprCap);if(i-Pu>js.dropAfterMs&&Rt.tier!=="T1"){Rt.setTier(sb(Rt.tier),`governor ${n.toFixed(0)} fps`);return}if(r&&s-on.dprStep*(Rt.governor.dropSteps+1)>=1-1e-6){Rt.governor.dropSteps++;try{r.setDprDrop(Rt.governor.dropSteps)}catch(o){ft("quality:dpr",o)}kl=0,Bl=0,Cu=0}}else Pu=-1,n>js.highFps&&!JM?(zl<0&&(zl=i),i-zl>js.upgradeAfterMs&&Rt.tier!=="T3"&&(JM=!0,Rt.setTier(_P(Rt.tier),`governor ${n.toFixed(0)} fps`))):zl=-1}},init(t){Ru=t,Sp=fe.now,fe.add(MP,jt.UI)}};ge.on("travel:start",()=>{Kg=fe.now});ge.on("visibility",()=>{Jg(),yp=-1});var ps=null;function bP(){if(ps)return ps;let t=document.createElement("canvas");t.width=t.height=64;let e=t.getContext("2d"),n=e.createImageData(64,64);for(let i=0;i<64;i++)for(let r=0;r<64;r++){let s=(r+.5)/32-1,o=(i+.5)/32-1,a=Math.min(1,Math.sqrt(s*s+o*o)),l=(.72*Math.exp(-a*a*18)+.28*Math.exp(-a*a*4.2))*(1-a*a)*(1-a),c=(i*64+r)*4;n.data[c]=n.data[c+1]=n.data[c+2]=255,n.data[c+3]=Math.round(255*Math.min(1,l))}return e.putImageData(n,0,0),ps=new ls(t),ps.minFilter=Wt,ps.magFilter=Wt,ps.generateMipmaps=!1,ps.wrapS=ps.wrapT=_i,ya(ps,4096*4),ps}var SP=`
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
}`,wP=`
${Oi}
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
}`,Lu=new Set,Qg=null;function ob(){return Qg||(Qg=new cs(1,1)),Qg}function ab(t,e){let n={};e&&(n.USE_BATCH=""),t.fog!==!1&&(n.USE_FOG="");let i={uTex:{value:bP()},uColor:wi(t.color||"ember"),uRadius:{value:t.radius!=null?t.radius:.05},uIntensity:{value:t.intensity!=null?t.intensity:1},uNightMix:{value:t.night?1:0},uNightI:{value:t.nightIntensity!=null?t.nightIntensity:.55},uFlash:{value:0},uNight:ae.uNight,cElectrum:ae.cElectrum,cWhite:ae.cWhite,cAbyss:ae.cAbyss,uFogDensity:ae.uFogDensity};return new $t({uniforms:i,defines:n,vertexShader:SP,fragmentShader:wP,transparent:!0,depthWrite:!1,depthTest:t.depthTest!==!1,blending:ma,premultipliedAlpha:!0})}function ex(t,e){let n=e==="T3";t.core?(n?t.core.layers.enable(Si.EMISSIVE):t.core.layers.disable(Si.EMISSIVE),t._tierHidden=n):(n?t.sprite.layers.enable(Si.EMISSIVE):t.sprite.layers.disable(Si.EMISSIVE),t._tierHidden=!1),t._sync()}ge.on("tier:change",({tier:t})=>{for(let e of Lu)ex(e,t)});function wp(t={}){let e=new mn,n=ab(t,!1),i=new nn(ob(),n);i.frustumCulled=!1,i.renderOrder=t.renderOrder!=null?t.renderOrder:5,e.add(i),t.core&&e.add(t.core);let r={object:e,sprite:i,core:t.core||null,uniforms:n.uniforms,_tierHidden:!1,_sync(){i.visible=!r._tierHidden&&n.uniforms.uIntensity.value>0},setIntensity(s){n.uniforms.uIntensity.value=s,r._sync()},setColor(s){n.uniforms.uColor=wi(s)},setRadius(s){n.uniforms.uRadius.value=s},setFlash(s){n.uniforms.uFlash.value=s},dispose(){Lu.delete(r),n.dispose(),e.parent&&e.parent.remove(e)}};return Lu.add(r),ex(r,Rt.tier),r}function Ap(t={}){let e=t.positions||new Float32Array(3),n=Math.max(1,Math.floor(e.length/3)),i=ob(),r=new pa;r.setIndex(i.index.clone()),r.setAttribute("position",i.getAttribute("position").clone()),r.setAttribute("uv",i.getAttribute("uv").clone());let s=new Ni(new Float32Array(n*3),3);s.array.set(e.subarray(0,n*3)),r.setAttribute("aOffset",s);let o=t.count!=null?Math.min(n,t.count):n;r.instanceCount=o;let a=ab(t,!0),l=new nn(r,a);l.frustumCulled=!1,l.renderOrder=t.renderOrder!=null?t.renderOrder:5;let c={object:l,sprite:l,core:null,uniforms:a.uniforms,_tierHidden:!1,_sync(){l.visible=o>0&&a.uniforms.uIntensity.value>0},get count(){return o},setCount(u){o=Math.max(0,Math.min(n,u|0)),r.instanceCount=o,c._sync()},setIntensity(u){a.uniforms.uIntensity.value=u,c._sync()},setColor(u){a.uniforms.uColor=wi(u)},setRadius(u){a.uniforms.uRadius.value=u},setPositions(u,f){let h=Math.min(n,f??Math.floor(u.length/3));s.array.set(u.subarray(0,h*3)),s.needsUpdate=!0,c.setCount(h)},dispose(){Lu.delete(c),r.dispose(),a.dispose(),l.parent&&l.parent.remove(l)}};return Lu.add(c),ex(c,Rt.tier),c}var Gl=" ",Hl="−";function Zs(t,e,n,i,r,s,o,a,l,c,u,f,h,d,g,x,p,m,_,w,v){let M=Fy[t],[S,E]=Oy[t];return Object.freeze({id:t,slug:e,sign:n,stratum:i,num:r,code:s,title:o,titleOpen:a,name:l,nameOpen:c,line:u,alt:M,level:f,giant:h,floor:S,ceil:E,n:d,fog:g,far:x,wet:p,root:m,note:_,hidden:w,parent:v,anchor:Object.freeze(new C(0,M,0))})}var ce=Object.freeze({SIGNAL:Zs("SIGNAL","signal","S",0,"01","SIGNAL","СВЯЗЬ",null,"Связь",null,"передачи и сигналы",`+1${Gl}090.00`,`+1${Gl}090`,3,.014,400,.22,220,392,!1,null),ARCHIVE:Zs("ARCHIVE","archive","A",1,"02","ARCHIVE","ЛЕТОПИСЬ",null,"Летопись",null,"легенды, моменты, шутки","+810.00","+810",5,.006,500,.22,196,440,!1,null),MEMBERS:Zs("MEMBERS","members","M",2,"03","MEMBERS","КЛАН",null,"Клан",null,"кто с нами","+460.00","+460",7,.0034,800,.22,164.81,493.88,!1,null),CORE:Zs("CORE","core","•",3,"04","CORE","ЯДРО",null,"Ядро",null,"имя, девиз, всё о нас","±0.00","±0",12,.00485,700,.22,146.83,587.33,!1,null),VOYAGES:Zs("VOYAGES","voyages","V",4,"05","VOYAGES","ВЫЛАЗКИ",null,"Вылазки",null,"экспедиции и зонды",`${Hl}460.00`,`${Hl}460`,7,.0034,800,.3,123.47,659.25,!1,null),INSIGNIA:Zs("INSIGNIA","insignia","I",5,"06","INSIGNIA","ХРАНИЛИЩЕ",null,"Хранилище",null,"трофеи и находки",`${Hl}810.00`,`${Hl}810`,5,.006,500,0,110,783.99,!1,null),NADIR:Zs("NADIR","nadir","N",6,"07","NADIR","ЗАПЕЧАТАНО","ИСТОК","Запечатано","Исток","осколков {k} из 5",`${Hl}1${Gl}090.00`,`${Hl}1${Gl}090`,3,.014,400,.22,98,880,!1,null),ZENITH:Zs("ZENITH","zenith",null,-1,"00","ZENITH","НАД ВСЕМ",null,"Над всем",null,"—",`+1${Gl}260.00`,`+1${Gl}260`,3,35e-5,4e3,.35,220,392,!0,"SIGNAL"),WORKSHOP:Zs("WORKSHOP","workshop",null,2,"03","WORKSHOP","МАСТЕРСКАЯ",null,"Мастерская",null,"—","+484.00","+484",7,.06,30,.22,164.81,493.88,!0,"MEMBERS")}),lb="откуда всё началось",Nn=Object.freeze(["SIGNAL","ARCHIVE","MEMBERS","CORE","VOYAGES","INSIGNIA","NADIR"]);var pB=new Map(Nn.map(t=>[ce[t].sign,ce[t]])),AP=new Map(Object.values(ce).map(t=>[t.slug,t]));function cb(t){return AP.get(String(t||"").toLowerCase())||null}function Tp(t){let e=Nn[t];return e?ce[e]:null}var Ep=[-1,0,1,2],No=new Map,_a=new Map,TP=new Map,tx=[],nx=new Map,ci=new Map([[-1,0],[0,1],[1,1],[2,0]]),ms={grow:[],shrink:[]},EP=new C,Du=null,ub=-1;function Rp(t){let e=ci.get(t),n=_a.get(t);n&&n.setFade(t===-1&&Nu?1:e);let i=No.get(t);i&&t!==0&&(i.visible=e>0||t===-1&&Nu),t===0&&Du&&Du.key&&Du.key.group&&(Du.key.group.visible=e>0)}var Nu=!1,Fn={init(t){Du=t;let e=it.root;for(let r of Ep){let s=new mn;s.name=`nest:${r}`,s.scale.setScalar(Math.pow(1e3,r)),e.add(s),No.set(r,s)}let n=(Rt.params||Xi.T2).lattice;for(let r of[1,2]){let s=Fu({perStratum:!1,latticeDensity:r===1?n:.5,hallLod:r===1,far:ce.CORE.far});No.get(r).add(s.group),_a.set(r,s);let o=Cp({scale:Math.pow(1e3,r)});o.setCount(Y.litNodes),No.get(r).add(o.object),nx.set(r,o)}let i=Fu({perStratum:!1,lattice:!1,far:1});No.get(-1).add(i.group),_a.set(-1,i);for(let r of[-1,1,2]){let s=wp({color:"ember",radius:oi.glowR,intensity:1,depthTest:!1,night:!0,fog:!1});No.get(r).add(s.object),TP.set(r,s),tx.push({j:r,e:s,g:No.get(r),h:ea.H*Math.pow(1e3,r)})}for(let r of Ep)Rp(r);return fe.add(Fn.update,jt.WORLD),ge.on("room:arrive",({room:r})=>{let s=(ce[r]||ce.CORE).far;for(let o of[1,2])_a.get(o).setFar(s)}),ge.on("tier:change",({tier:r})=>{let s=Xi[r];s&&_a.get(1).setLatticeDensity(s.lattice)}),ge.on("night:change",({night:r})=>{for(let s of nx.values())s.setNight(r)}),Fn},level(t){return No.get(t)||null},structure(t){return _a.get(t)||null},litNodes(t){return nx.get(t)||null},fade(t){return ci.has(t)?ci.get(t):0},setFade(t,e){if(!ci.has(t))return;let n=Math.max(0,Math.min(1,e));n!==ci.get(t)&&(ci.set(t,n),Rp(t))},setHallLod(t){let e=t?ce[t]:null;ub=e&&e.stratum>=0?e.stratum:-1;let n=_a.get(1);n&&n.setHideCaps(ub)},shift(t){let e=Ep.map(n=>ci.get(n));if(t==="grow"){ms.grow.push(e[3]);let n=ms.shrink.length?ms.shrink.pop():0;ci.set(2,e[2]),ci.set(1,e[1]),ci.set(0,e[0]),ci.set(-1,n)}else{ms.shrink.push(e[0]);let n=ms.grow.length?ms.grow.pop():0;ci.set(-1,e[1]),ci.set(0,e[2]),ci.set(1,e[3]),ci.set(2,n)}ms.grow.length>8&&ms.grow.shift(),ms.shrink.length>8&&ms.shrink.shift();for(let n of Ep)Rp(n)},update(){let t=Pe.camera;if(!t)return;let e=it.s,n=EP.copy(t.position).sub(it.Q).length()/e,i=n<Ny.miniKeyBelow;i!==Nu&&(Nu=i,Rp(-1));for(let r=0;r<tx.length;r++){let{j:s,e:o,g:a,h:l}=tx[r],c=(s===-1?Nu||ci.get(-1)>0:ci.get(s)>0)&&n>l*Dy;o.object.visible=c&&a.visible!==!1}}};var RP=new C,ix=null;function Ou(){let t=it.root;t&&(t.scale.setScalar(it.s),t.position.copy(it.Q),t.updateMatrix()),ae.uWorldScale.value=it.s}function fb(t){let e=Pe.camera;e&&t(e.position),Pe.pose&&(t(Pe.pose.pos),t(Pe.pose.target)),Pe.remapHistory(t),it.focus&&t(it.focus)}var it={root:null,s:1,Q:new C,n:0,focus:new C,init(t,e){return e&&(ix=e),it.root||(it.root=new mn,it.root.name="scaleRoot",it.root.matrixAutoUpdate=!1),t&&it.root.parent!==t&&t.add(it.root),Ou(),it},set(t,e){it.s=t,e&&it.Q.copy(e),Ou()},scaleAbout(t,e){let n=it.s;t!==n&&(it.Q.x+=e.x*(n-t),it.Q.y+=e.y*(n-t),it.Q.z+=e.z*(n-t),it.s=t,Ou())},fixedPoint(t){let e=1-it.s;return Math.abs(e)<1e-9?t.set(0,0,0):t.copy(it.Q).multiplyScalar(1/e)},logLerp(t,e,n){return Math.exp(Math.log(t)+(Math.log(e)-Math.log(t))*n)},toRender(t,e){return e.copy(t).multiplyScalar(it.s).add(it.Q)},toCanonical(t,e){return e.copy(t).sub(it.Q).multiplyScalar(1/it.s)},rebase(t){let n={kind:t,k:(t==="grow"?1e3:.001)/it.s,T:it.Q.clone(),s:it.s,Q:it.Q.clone()};fb(r=>it.mapPoint(r,n,r)),it.s=1,it.Q.set(0,0,0),Ou(),Fn.shift(t);let i=ix&&ix.key;return i&&typeof i.onRebase=="function"&&i.onRebase(t),ge.emit("scale:rebase",{kind:t,k:n.k,T:n.T}),n},unrebase(t){fb(e=>e.multiplyScalar(1/t.k).add(t.T)),it.s=t.s,it.Q.copy(t.Q),Ou(),Fn.shift(t.kind==="grow"?"shrink":"grow")},mapPoint(t,e,n){return n.copy(t).sub(e.T).multiplyScalar(e.k)},fitClip(t){let e=Math.max(1e-5,RP.copy(t.position).sub(it.focus).length());t.near=l0.near*e,t.far=l0.far*e}};var CP=Math.PI/180,PP=.08,Pp=new C,Ip=new C,Vr=new C,rx=new C,hb=new C,sx=new xt,Lp=!1,db=new Map,ox=[],gs={until:0,ms:0,amp:0,off:new C},Pe={camera:null,pose:{pos:new C(0,.75,7.2),target:new C(0,0,0),fov:ct.fov,offsetY:0,roll:0},velocity:new C,init(t){return Pe.camera=t,Lp=!1,Pe},setPose(t){t&&(t.pos&&Pe.pose.pos.copy(t.pos),t.target&&Pe.pose.target.copy(t.target),Pe.pose.fov=t.fov!=null?t.fov:ct.fov,Pe.pose.offsetY=t.offsetY||0,Pe.pose.roll=t.roll||0)},setOffset(t,e,n=0){let i=db.get(t);if(!e&&!n){i&&(i.on=!1);return}i||(i={pos:new C,fov:0,on:!0},db.set(t,i),ox.push(i)),e?i.pos.copy(e):i.pos.set(0,0,0),i.fov=n,i.on=!0},tremble(t=1,e=120){Et.reducedMotion||(gs.amp=t,gs.ms=e,gs.until=fe.now+e)},apply(t=1/60){let e=Pe.camera;if(!e)return;let n=Pe.pose;Pp.set(0,0,0);let i=n.fov;for(let l=0;l<ox.length;l++){let c=ox[l];c.on&&(Pp.add(c.pos),i+=c.fov)}let r=Math.max(1e-6,Ip.copy(n.target).sub(n.pos).length());if(gs.until>fe.now&&gs.ms>0){let l=(gs.until-fe.now)/gs.ms,c=gs.amp*l*r/Math.max(1e-6,ae.uPxPerUnit.value);gs.off.set((Math.random()*2-1)*c,(Math.random()*2-1)*c,0).applyQuaternion(e.quaternion),Pp.add(gs.off)}e.position.copy(n.pos).add(Pp),Ip.copy(n.target).sub(e.position);let s=Ip.length();s>1e-9&&Math.abs(Ip.y/s)>.999?e.up.set(0,0,-1):e.up.set(0,1,0),e.lookAt(n.target),n.roll&&e.rotateZ(n.roll),e.fov=i;let o=Math.max(1,be.w),a=Math.max(1,be.h);e.aspect=o/a,n.offsetY?e.setViewOffset(o,a,0,-n.offsetY*a,o,a):e.view&&e.view.enabled&&e.clearViewOffset(),it.focus.copy(n.target),it.fitClip(e),e.updateProjectionMatrix(),e.updateMatrixWorld(),ae.uCamPos.value.copy(e.position),ae.uPxPerUnit.value=a/(2*Math.tan(i*CP/2)),Lp&&t>0&&(hb.copy(e.position).sub(rx).multiplyScalar(1/t),Pe.velocity.lerp(hb,1-Math.exp(-t/PP))),rx.copy(e.position),Lp=!0},project(t,e){let n=Pe.camera;return n?(Vr.copy(t).applyMatrix4(n.matrixWorldInverse),e.depth=-Vr.z,Vr.applyMatrix4(n.projectionMatrix),e.x=(Vr.x+1)*.5*be.w,e.y=(1-Vr.y)*.5*be.h,e.visible=e.depth>0&&Vr.x>=-1&&Vr.x<=1&&Vr.y>=-1&&Vr.y<=1,e):(e.x=-9999,e.y=-9999,e.depth=0,e.visible=!1,e)},unproject(t,e,n,i){let r=Pe.camera;if(!r)return i.set(0,0,0);Pe.ray(t,e,Dp),Vr.set(0,0,-1).transformDirection(r.matrixWorld);let s=Math.max(1e-6,Dp.direction.dot(Vr));return i.copy(Dp.origin).addScaledVector(Dp.direction,n/s)},ray(t,e,n){let i=Pe.camera;return sx.set(t/Math.max(1,be.w)*2-1,-(e/Math.max(1,be.h))*2+1),n.origin.setFromMatrixPosition(i.matrixWorld),n.direction.set(sx.x,sx.y,.5).unproject(i).sub(n.origin).normalize(),n},remapHistory(t){Lp&&t(rx)}},Dp=new Hs;var Uu=`
uniform float uPxPerUnit;
float bayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }
float bayer4(vec2 a) { return bayer2(0.5 * a) * 0.25 + bayer2(a); }
float bayer8(vec2 a) { return bayer4(0.5 * a) * 0.25 + bayer2(a); }
// strut: strut spacing in LOCAL units (aStrut); modelScale: length(modelMatrix[0].xyz); depth: view-space depth (render units)
float r1Lattice(float strut, float modelScale, float depth) {
  float sp = strut * modelScale * uPxPerUnit / max(depth, 1e-6);
  return smoothstep(3.0, 6.0, sp);
}`,Ma=`
uniform mat4 uStrataM[7];
uniform float uStrataA[7];
int strataIndex(float face) { return int(clamp(floor(face / 16.0 + 0.001), 0.0, 6.0)); }
mat4 strataMatrix(float face) { return uStrataM[strataIndex(face)]; }
float strataAlpha(float face) { return uStrataA[strataIndex(face)]; }`;var Ai={};for(let t=0;t<7;t++)Ai[`sign:${t}`]=[128*t,0,128,128];Ai["glyph:back"]=[896,0,128,128];Ai.frieze=[0,128,1024,32];Ai.ticks=[0,160,1024,32];for(let t=0;t<16;t++)Ai[`capital:${t}`]=[128*(t%8),192+128*Math.floor(t/8),128,128];Ai.deck=[0,448,256,256];for(let t=0;t<7;t++)Ai[`free:${t}`]=t<3?[256*(t+1),448,256,256]:[256*(t-3),704,256,256];Ai["code:0"]=[0,960,512,64];Ai["code:1"]=[512,960,512,64];Ai["code:2"]=[512,320,512,64];Ai["code:3"]=[512,384,512,64];Ai["code:4"]=[0,704,512,64];Ai["code:5"]=[0,768,512,64];Ai["code:6"]=[0,832,512,64];var ku=null,Bu=null,ba=null,Np=null;function IP(t,e){let n=()=>{let s=document.createElement("canvas");return s.width=t,s.height=e,s};(!ba||ba.width<t||ba.height<e)&&(ba=n(),Np=n());let i=ba.getContext("2d",{willReadFrequently:!0}),r=Np.getContext("2d",{willReadFrequently:!0});return i.setTransform(1,0,0,1,0,0),r.setTransform(1,0,0,1,0,0),i.clearRect(0,0,ba.width,ba.height),r.clearRect(0,0,Np.width,Np.height),[i,r]}function LP(t,e,n,i){for(let r=0;r<n;r++)for(let s=0;s<e;s++){let o=0,a=0;for(let l=-1;l<=1;l++){let c=r+l;if(!(c<0||c>=n))for(let u=-1;u<=1;u++){let f=s+u;f<0||f>=e||(o+=t[(c*e+f)*4+3],a++)}}i[r*e+s]=o/a}}var Kt={texture:null,size:1024,REGIONS:Ai,init(t){if(Kt.texture)return Kt;Kt.size=t==="T1"?512:1024,ku=document.createElement("canvas"),ku.width=ku.height=Kt.size,Bu=ku.getContext("2d",{willReadFrequently:!0}),Bu.fillStyle="rgb(255,0,0)",Bu.fillRect(0,0,Kt.size,Kt.size);let e=new ls(ku);return e.flipY=!1,e.generateMipmaps=!1,e.minFilter=Wt,e.magFilter=Wt,e.wrapS=e.wrapT=_i,e.premultiplyAlpha=!1,Kt.texture=e,ya(e,Kt.size*Kt.size*4),Kt},region(t){let e=Ai[t];if(!e)return null;let n=Kt.size/1024,i=e[0]*n,r=e[1]*n,s=e[2]*n,o=e[3]*n;return{x:i,y:r,w:s,h:o,rect:new Yt(e[0]/1024,e[1]/1024,(e[0]+e[2])/1024,(e[1]+e[3])/1024)}},draw(t,e={}){if(!Kt.texture)return!1;let n=Kt.region(t);if(!n)return!1;let i=Math.round(n.w),r=Math.round(n.h),[s,o]=IP(i,r);try{e.height&&e.height(s,i,r)}catch{}try{e.inlay&&e.inlay(o,i,r)}catch{}let a=s.getImageData(0,0,i,r).data,l=o.getImageData(0,0,i,r).data,c=new Float32Array(i*r);LP(a,i,r,c);let u=Bu.createImageData(i,r),f=u.data;for(let h=0,d=0;d<i*r;d++,h+=4)f[h]=255-Math.round(c[d]),f[h+1]=l[h+3],f[h+2]=0,f[h+3]=255;return Bu.putImageData(u,Math.round(n.x),Math.round(n.y)),Kt.texture.needsUpdate=!0,!0}};var Gr=`
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
}`;var Fp=`
float fxHeptagon(vec2 pc) {                             // 7-blade aperture SDF, one flat side down; pc in [-1,1]
  float a = atan(pc.x, -pc.y); float k = 6.2831853 / 7.0;
  float r = cos(floor(0.5 + a / k) * k - a) * length(pc); return r;  // < cos(π/7) inside
}`;function Hr(){return{uWave0a:ae.uWave0a,uWave0b:ae.uWave0b,uWave1a:ae.uWave1a,uWave1b:ae.uWave1b,uImpact:ae.uImpact,uImpactWarm:ae.uImpactWarm,uPulse:ae.uPulse,uFxLineA:ae.uFxLineA,uFocus:ae.uFocus,uFxCaps:ae.uFxCaps,uWorldScale:ae.uWorldScale}}var DP=`
${Uu}
${Ma}
${Gr}
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
}`,NP=`
${Oi}
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
  int ii = int(si + 0.5);                                       // H7: the КОДЕКС law on back face jb(i) = floor(n_i / 2), tested
                                                                //   before the ticks: N's band (vc 1/6) reaches into the tick zone
  bool codeFace = abs(fj - floor(uN[ii] / 2.0)) < 0.5;
  if (codeFace) {
    vec2 cb = uCodeBand[ii];
    float u = (vFaceUV.x - uCodeU.x) / (uCodeU.y - uCodeU.x);
    if (abs(vFaceUV.y - cb.x) < cb.y && u >= 0.0 && u <= 1.0 && u < uCut[ii]) {
      vec4 r = uCodeRect[ii];
      return r.xy + vec2(u, (vFaceUV.y - (cb.x - cb.y)) / (2.0 * cb.y)) * r.zw;
    }
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
}`,ax=null;function lx(t={}){let e={},n=t.engrave!=null?t.engrave:null;n==="key"?e.USE_KEYGEO="":typeof n=="string"&&(e.USE_REGION=""),t.r1!==!1&&(e.USE_R1=""),t.strut==null&&(n==="key"||t.aStrut)&&(e.USE_ASTRUT=""),t.strata?e.USE_STRATA="":t.strataAlpha&&(e.USE_STRATA_A=""),t.fog!==!1&&(e.USE_FOG=""),Kt.texture||Kt.init(Rt.tier);let i=typeof n=="string"&&n!=="key"?Kt.region(n):null,r=Kt.size||1024;return ax||(ax={uN:{value:Dt.map(o=>o.n)},uCodeBand:{value:Op.map(o=>new xt(o.vc,o.vh))},uCodeRect:{value:Dt.map((o,a)=>{let l=Kt.region(`code:${a}`).rect;return new Yt(l.x,l.y,l.z-l.x,l.w-l.y)})},uCodeU:{value:new xt(Op[0].u0,Op[0].u1)}}),new $t({uniforms:{uBase:wi(t.tint||"obsidian"),uAlpha:{value:1},uFlash:{value:0},uEdgeEmber:{value:0},uRim:{value:t.rim!=null?t.rim:on.r2.fresnelGain},uStrut:{value:t.strut!=null?t.strut:.05},uHideCapsOf:{value:-1},uAtlas:{value:Kt.texture},uTexel:{value:1/r},uRegion:{value:i?i.rect:new Yt(0,0,0,0)},uFriezeH:{value:It.friezeH},uTickL:{value:It.tickLen},uApertureR:{value:It.apertureD/2},uStrataM:t.strata||Ys(),uStrataA:t.strataAlpha||zr(),cSilver:ae.cSilver,cWhite:ae.cWhite,cPaper:ae.cPaper,cInk:ae.cInk,cAbyss:ae.cAbyss,uLamp:ae.uLamp,uLampOn:ae.uLampOn,uInvert:ae.uInvert,uPixelRatio:ae.uPixelRatio,uPxPerUnit:ae.uPxPerUnit,uFogDensity:ae.uFogDensity,uCut:ae.uCut,...ax,...Hr()},defines:e,vertexShader:DP,fragmentShader:NP,side:t.side!=null?t.side:us,transparent:!1,depthWrite:!0})}var pb=()=>(ce[Q.room]||ce.CORE).far,mb=`
float lampReach(vec3 p) { float r = 2.0 * max(length(uCamPos - uLamp), 1e-4); float d = length(p - uLamp) / r; return 1.0 / (1.0 + d * d); }`,FP=new Float32Array([0,-1,0,1,-1,0,0,1,0,1,1,0]),OP=[0,1,2,2,1,3],UP=`
${Uu}
${Gr}
attribute vec3 aA; attribute vec3 aB; attribute float aW; attribute float aAl;
#ifdef USE_COL_ATTR
attribute vec3 aCol;
#endif
#ifdef USE_STRATA
attribute float aFace;
${Ma}
#endif
uniform vec3 uColor; uniform vec3 cWhite;
uniform float uWidth, uAlpha, uFar, uGlint, uFlatten, uFlattenY, uDrawA, uDrawB, uCount, uFlash, uStrut;
uniform vec2 uResolution; uniform float uPixelRatio; uniform vec3 uLamp; uniform vec3 uCamPos;   // uWorldScale: FX_GLSL
${mb}
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
}`,kP=`
${Oi}
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
}`;function Up(t,e){let n=new Float32Array(t);return n.fill(e),n}function ui(t={}){let e=t.segments||new Float32Array(6),n=t.count!=null?t.count:Math.floor(e.length/6),i=Math.max(1,Math.floor(e.length/6)),r=new pa;r.setAttribute("position",new Zt(FP,3)),r.setIndex(OP);let s=new Cl(e,6),o=()=>{r.setAttribute("aA",new El(s,3,0)),r.setAttribute("aB",new El(s,3,3))};o();let a=t.width instanceof Float32Array?t.width:Up(i,1),l=t.alpha instanceof Float32Array?t.alpha:Up(i,1);r.setAttribute("aW",new Ni(a,1)),r.setAttribute("aAl",new Ni(l,1));let c={},u=t.color instanceof Float32Array;u&&(r.setAttribute("aCol",new Ni(t.color,3)),c.USE_COL_ATTR=""),t.faces&&t.strata&&(r.setAttribute("aFace",new Ni(t.faces,1)),c.USE_STRATA=""),t.dash&&(c.USE_DASH=""),t.strut!=null&&(c.USE_STRUT=""),t.flatten&&(c.USE_FLATTEN=""),t.fog!==!1&&(c.USE_FOG=""),r.instanceCount=n;let f={uColor:wi(u?"silver":t.color||"silver"),uWidth:{value:typeof t.width=="number"?t.width:1},uAlpha:{value:typeof t.alpha=="number"?t.alpha:t.alpha instanceof Float32Array?1:on.r3.alpha},uFar:{value:t.far!=null?t.far:pb()},uGlint:{value:t.glint!=null?t.glint:on.r3.glintGain},uFlatten:{value:0},uFlattenY:{value:0},uDrawA:{value:0},uDrawB:{value:1},uCount:{value:n},uFlash:{value:0},uStrut:{value:t.strut!=null?t.strut:0},uDash:{value:new xt(t.dash?t.dash[0]:1,t.dash?t.dash[1]:0)},uStrataM:t.strata||Ys(),uStrataA:t.strataAlpha||zr(),cWhite:ae.cWhite,cAbyss:ae.cAbyss,uFogDensity:ae.uFogDensity,uLamp:ae.uLamp,uCamPos:ae.uCamPos,uResolution:ae.uResolution,uPixelRatio:ae.uPixelRatio,uPxPerUnit:ae.uPxPerUnit,uWorldScale:ae.uWorldScale,...Hr()},h=new $t({uniforms:f,defines:c,vertexShader:UP,fragmentShader:kP,transparent:!0,depthWrite:!1,depthTest:t.depthTest!==!1,blending:t.additive?ma:or}),d=new nn(r,h);return d.frustumCulled=!1,t.layer!=null&&d.layers.set(t.layer),t.renderOrder!=null&&(d.renderOrder=t.renderOrder),{mesh:d,uniforms:f,get count(){return n},setSegments(x,p){let m=p??Math.floor(x.length/6);m<=i&&x!==s.array?(s.array.set(x.subarray(0,m*6)),s.needsUpdate=!0):x!==s.array?(i=Math.max(m,Math.floor(x.length/6)),s=new Cl(x,6),o(),a.length<i&&!(t.width instanceof Float32Array)&&r.setAttribute("aW",new Ni(Up(i,1),1)),l.length<i&&!(t.alpha instanceof Float32Array)&&r.setAttribute("aAl",new Ni(Up(i,1),1))):s.needsUpdate=!0,n=m,r.instanceCount=m,f.uCount.value=m},setColor(x){x instanceof Float32Array?(r.setAttribute("aCol",new Ni(x,3)),h.defines.USE_COL_ATTR===void 0&&(h.defines.USE_COL_ATTR="",h.needsUpdate=!0)):(f.uColor=wi(x||"silver"),h.defines.USE_COL_ATTR!==void 0&&(delete h.defines.USE_COL_ATTR,h.needsUpdate=!0))},setAlpha(x){f.uAlpha.value=x,d.visible=x>0},setWidth(x){f.uWidth.value=x},setDrawRange01(x,p){f.uDrawA.value=x,f.uDrawB.value=p},setFlatten(x,p){f.uFlatten.value=x,f.uFlattenY.value=p},dispose(){r.dispose(),h.dispose(),d.parent&&d.parent.remove(d)}}}var BP=`
${Uu}
${Gr}
#ifdef USE_STRATA
attribute float aFace;
${Ma}
#endif
#ifdef USE_ASTRUT
attribute float aStrut;
#endif
#ifdef USE_DIR
attribute vec3 aDir;
#endif
uniform float uStrut, uAlpha, uFar, uGlint, uFade; uniform vec3 uLamp; uniform vec3 uColor; uniform vec3 uCamPos; uniform vec3 cWhite;
${mb}
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
}`,zP=`
${Oi}
varying vec3 vCol; varying float vAlpha; varying float vDist;
void main() {
  if (vAlpha <= 0.002) discard;
  vec3 col = vCol;
#ifdef USE_FOG
  col = applyFog(col, vDist);
#endif
  gl_FragColor = vec4(col, vAlpha);
}`;function gb(t={}){let e={};return t.strut==null&&(e.USE_ASTRUT=""),t.strata&&(e.USE_STRATA=""),t.dir!==!1&&(e.USE_DIR=""),t.fog!==!1&&(e.USE_FOG=""),new $t({uniforms:{uStrut:{value:t.strut!=null?t.strut:0},uAlpha:{value:t.alpha!=null?t.alpha:on.r3.alpha},uFade:{value:1},uFar:{value:t.far!=null?t.far:pb()},uGlint:{value:t.glint!=null?t.glint:on.r3.glintGain},uColor:wi(t.color||"silver"),uStrataM:t.strata||Ys(),uStrataA:t.strataAlpha||zr(),uLamp:ae.uLamp,uCamPos:ae.uCamPos,uWorldScale:ae.uWorldScale,uPxPerUnit:ae.uPxPerUnit,cAbyss:ae.cAbyss,uFogDensity:ae.uFogDensity,cWhite:ae.cWhite,...Hr()},defines:e,vertexShader:BP,fragmentShader:zP,transparent:!0,depthWrite:!1,blending:or})}var VP=`
${Gr}
attribute float aSize; attribute float aAlpha;
#ifdef USE_STRATA
attribute float aFace;
${Ma}
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
}`,GP=`
${Oi}
${Fp}
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
}`;function kp(t,e){let n=new Float32Array(Math.max(1,t));return n.fill(e),n}function Wl(t={}){let e=t.positions||new Float32Array(3),n=Math.floor(e.length/3),i=t.count!=null?Math.min(t.count,n):n,r=new Dn;r.setAttribute("position",new Zt(e,3)),r.setAttribute("aSize",new Zt(t.sizes||kp(n,1),1)),r.setAttribute("aAlpha",new Zt(t.alphas||kp(n,1),1));let s={};t.faces&&t.strata&&(r.setAttribute("aFace",new Zt(t.faces,1)),s.USE_STRATA=""),t.fog!==!1&&(s.USE_FOG=""),r.setDrawRange(0,i);let o={uColor:wi(t.color||"white"),uAlpha:{value:t.alpha!=null?t.alpha:.4},uSize:{value:t.sizePx!=null?t.sizePx:2},uStrataM:t.strata||Ys(),uStrataA:t.strataAlpha||zr(),uPixelRatio:ae.uPixelRatio,cAbyss:ae.cAbyss,uFogDensity:ae.uFogDensity,...Hr()},a=new $t({uniforms:o,defines:s,vertexShader:VP,fragmentShader:GP,transparent:!0,depthWrite:!1,depthTest:t.depthTest!==!1,blending:or}),l=new ha(r,a);return l.frustumCulled=t.frustumCulled===!0,l.layers.set(t.layer!=null?t.layer:Si.DEFAULT),t.renderOrder!=null&&(l.renderOrder=t.renderOrder),{object:l,uniforms:o,get count(){return i},setCount(c){i=Math.max(0,Math.min(n,c|0)),r.setDrawRange(0,i)},setAlpha(c){o.uAlpha.value=c,l.visible=c>0},setSize(c){o.uSize.value=c},setColor(c){o.uColor=wi(c),a.uniforms.uColor=o.uColor},setPositions(c,u){let f=u??Math.floor(c.length/3);f<=n&&c!==e?e.set(c.subarray(0,f*3)):c!==e&&(e=c,n=Math.floor(c.length/3),r.setAttribute("position",new Zt(e,3)),r.setAttribute("aSize",new Zt(kp(n,1),1)),r.setAttribute("aAlpha",new Zt(kp(n,1),1))),r.attributes.position.needsUpdate=!0,i=Math.min(f,n),r.setDrawRange(0,i)},dispose(){r.dispose(),a.dispose(),l.parent&&l.parent.remove(l)}}}var cx=Math.PI*2,$l=99,HP=It.sign.heightFrac;function Sr(t,e,n,i,r,s){let o=Math.floor(i),a=i-o,l=cx*o/t-Math.PI/t,c=l+cx/t,u=Math.sin(l)*e,f=Math.cos(l)*e,h=Math.sin(c)*e,d=Math.cos(c)*e;r[s]=u+(h-u)*a,r[s+1]=n,r[s+2]=f+(d-f)*a}function Bp(t,e,n,i,r=t.k){return n*t.n/r+(e<0?.5*t.n/r:0)+e*It.lattice.faceShift*i}var ux=2,zp=(t,e,n)=>Math.max(1e-4,2*Ft(n)*Math.sin(Math.PI/t)*t/(e*ux)),WP=(t,e)=>2*Ft(e)*Math.sin(Math.PI/t.n);function $P(t){let e=Math.cos(Math.PI/t.n),n=0;for(let i=0;i<Rs.length-1;i++){let r=t.top+(t.bot-t.top)*Rs[i],s=t.top+(t.bot-t.top)*Rs[i+1];n+=Math.hypot(r-s,(Ft(r)-Ft(s))*e)}return n}var Op=Object.freeze(Dt.map(t=>{let e=t.i===0?.8333333333333334:t.i===6?.16666666666666666:.5,n=WP(t,t.top+(t.bot-t.top)*e),i=Math.min(.14,.5*(.8*n/8)/$P(t));return Object.freeze({vc:e,vh:i,u0:.1,u1:.9})})),fx=new Float32Array(7).fill(1);var Vp=class{constructor(){this.p=[],this.n=[],this.uv=[],this.eng=[],this.face=[],this.kind=[],this.strut=[]}tri(e,n,i,r,s,o){let a=n[0]-e[0],l=n[1]-e[1],c=n[2]-e[2],u=i[0]-e[0],f=i[1]-e[1],h=i[2]-e[2],d=l*h-c*f,g=c*u-a*h,x=a*f-l*u,p=Math.hypot(d,g,x);if(p<1e-12)return;d/=p,g/=p,x/=p;let m=e,_=n,w=i;d*o[0]+g*o[1]+x*o[2]<0&&(_=i,w=n,d=-d,g=-g,x=-x);for(let v of[m,_,w])this.p.push(v[0],v[1],v[2]),this.n.push(d,g,x),this.uv.push(v[3],v[4]),this.eng.push(v[5],v[6],v[7],v[8]),this.face.push(r),this.kind.push(s),this.strut.push(v[9])}geometry(){let e=new Dn;return e.setAttribute("position",new fn(this.p,3)),e.setAttribute("normal",new fn(this.n,3)),e.setAttribute("aFaceUV",new fn(this.uv,2)),e.setAttribute("aEng",new fn(this.eng,4)),e.setAttribute("aFace",new fn(this.face,1)),e.setAttribute("aKind",new fn(this.kind,1)),e.setAttribute("aStrut",new fn(this.strut,1)),e.computeBoundingSphere(),e}},ri=new Float32Array(3);function xb(t,e){let{i:n,n:i,k:r,top:s,bot:o,hollow:a}=e,l=s-o,c=(s+o)/2,u=HP*l,f=Rs.map(d=>s+(o-s)*d),h=f.map(d=>Ft(d));for(let d=0;d<i;d++){let g=cx*d/i,x=Math.cos(g),p=-Math.sin(g),m=[Math.sin(g),0,Math.cos(g)],_=n*16+d,w=(v,M)=>{Sr(i,h[v],f[v],d+M,ri,0);let S=ri[0]*x+ri[2]*p;return[ri[0],ri[1],ri[2],M,(s-f[v])/l,S/u+.5,.5-(f[v]-c)/u,s-f[v],f[v]-o,zp(i,r,f[v])]};for(let v=0;v<3;v++){let M=w(v,0),S=w(v,1),E=w(v+1,0),y=w(v+1,1);t.tri(M,E,y,_,0,m),t.tri(M,y,S,_,0,m)}for(let[v,M,S,E]of[[s,h[0],1,1],[o,h[3],2,-1]]){if(M<=1e-6)continue;let y=zp(i,r,v),A=(T,I)=>(Sr(i,T,v,I,ri,0),[ri[0],ri[1],ri[2],.5,S===1?0:1,-1,-1,$l,$l,y]);if(a>0){let T=A(M,d),I=A(M,d+1),F=A(a,d),z=A(a,d+1);t.tri(T,I,z,_,S,[0,E,0]),t.tri(T,z,F,_,S,[0,E,0])}else t.tri([0,v,0,.5,S===1?0:1,-1,-1,$l,$l,y],A(M,d),A(M,d+1),_,S,[0,E,0])}if(a>0){let v=2*a*Math.sin(Math.PI/i)*i/(r*ux),M=(I,F)=>(Sr(i,a,I,F,ri,0),[ri[0],ri[1],ri[2],F-d,(s-I)/l,-1,-1,$l,$l,v]),S=M(s,d),E=M(s,d+1),y=M(o,d),A=M(o,d+1),T=[-Math.sin(g),0,-Math.cos(g)];t.tri(S,y,A,_,3,T),t.tri(S,A,E,_,3,T)}}}function vb(t){let e=[],n=[],i=[],r=[],s=new Float32Array(3),o=new Float32Array(3),a=(u,f,h,d,g,x)=>{let p=d[0]-h[0],m=d[1]-h[1],_=d[2]-h[2],w=Math.hypot(p,m,_)||1,v=u.i*16+(Math.floor(f)%u.n+u.n)%u.n;e.push(h[0],h[1],h[2],d[0],d[1],d[2]),n.push(v,v),i.push(g,x),r.push(p/w,m/w,_/w,p/w,m/w,_/w)},l=It.lattice.segmentsPerGenerator;for(let u of Dt){let f=Math.max(1,Math.round(u.k*t)),h=u.hollow>0?[!1,!0]:[!1];for(let d of h)for(let g of[1,-1])for(let x=0;x<f;x++)for(let p=0;p<l;p++){let m=p/l,_=(p+1)/l,w=u.top+(u.bot-u.top)*m,v=u.top+(u.bot-u.top)*_,M=d?u.hollow:Ft(w),S=d?u.hollow:Ft(v),E=Bp(u,g,x,m,f),y=Bp(u,g,x,_,f),A=F=>(F%u.n+u.n)%u.n;Sr(u.n,M,w,A(E),s,0),Sr(u.n,S,v,A(y),o,0);let T=d?2*u.hollow*Math.sin(Math.PI/u.n)*u.n/(u.k*ux):zp(u.n,u.k,w),I=d?T:zp(u.n,u.k,v);a(u,A((E+y)/2),s,o,T,I)}}let c=new Dn;return c.setAttribute("position",new fn(e,3)),c.setAttribute("aFace",new fn(n,1)),c.setAttribute("aStrut",new fn(i,1)),c.setAttribute("aDir",new fn(r,3)),c.computeBoundingSphere(),c}function XP(){let t=[],e=[],n=[],i=new Float32Array(3),r=new Float32Array(3),s=(o,a,l)=>{t.push(i[0],i[1],i[2],r[0],r[1],r[2]),e.push(l),n.push(o*16+a)};for(let o of Dt){let{i:a,n:l,top:c,bot:u,hollow:f}=o,h=Rs.map(p=>c+(u-c)*p),d=[...Array(l).keys()].sort((p,m)=>Math.min(p,l-p)-Math.min(m,l-m)),g=0,x=new Set;for(let p of d)for(let m of[0,3])g<on.r3.primaryEdges&&Ft(h[m])>1e-6&&(x.add(`${m}:${p}`),g++);for(let p=0;p<l;p++){for(let m=0;m<3;m++)Sr(l,Ft(h[m]),h[m],p,i,0),Sr(l,Ft(h[m+1]),h[m+1],p,r,0),s(a,p,on.r3.widthPx);for(let m of[0,3]){let _=Ft(h[m]);_<=1e-6||(Sr(l,_,h[m],p,i,0),Sr(l,_,h[m],p+.999999,r,0),s(a,p,x.has(`${m}:${p}`)?on.r3.primaryPx:on.r3.widthPx))}if(f>0)for(let m of[c,u])Sr(l,f,m,p,i,0),Sr(l,f,m,p+.999999,r,0),s(a,p,on.r3.widthPx)}}return{seg:new Float32Array(t),width:new Float32Array(e),face:new Float32Array(n)}}function YP(){let t=[],e=[];for(let n of Dt)for(let i of Rs){let r=n.top+(n.bot-n.top)*i,s=Ft(r);for(let o=0;o<n.n&&(Sr(n.n,s,r,o,ri,0),t.push(ri[0],ri[1],ri[2]),e.push(n.i*16+o),!(s<=1e-6));o++);}return{pos:new Float32Array(t),face:new Float32Array(e)}}var zu=[],yb=-1,Xl=new Ct,_b=new Ct,Mb=new C,bb=new C,qP=new C;function jP(){let t=Pe.camera;if(t)for(let e=0;e<zu.length;e++)zu[e](t)}function ZP(t){zu.push(t),yb<0&&(yb=fe.add(jP,jt.CAMERA+5))}function KP(t){let e=zu.indexOf(t);e>=0&&zu.splice(e,1)}function JP(t){let e=0,n=t.array;for(let i=0;i<n.length;i+=3){let r=n[i]*n[i]+n[i+1]*n[i+1]+n[i+2]*n[i+2];r>e&&(e=r)}return Math.sqrt(e)}function Sb(t){let e=0;for(let n=0;n<t.length;n++)t[n]>e&&(e=t[n]);return e}function Fu(t={}){let e=!!t.perStratum,n=new mn;n.name=e?"structure:key":"structure";let i=t.scale!=null?t.scale:1;n.scale.setScalar(i);let r=t.far!=null?t.far:700,s={value:Array.from({length:7},()=>new Ct)},o={value:[1,1,1,1,1,1,1]},a=[];if(e)for(let P=0;P<7;P++){let O=new mn;O.name=`stratum:${P}`,n.add(O),a.push(O)}else a.push(n);let l=()=>{if(e)for(let P=0;P<7;P++)s.value[P].copy(a[P].matrix)},c=[],u=null;if(t.solid!==!1)if(e){u=lx({engrave:"key",strataAlpha:o});for(let P of Dt){let O=new Vp;xb(O,P);let k=new nn(O.geometry(),u);k.name=`solid:${P.i}`,k.userData.stratum=P.i,a[P.i].add(k),c.push(k)}}else{u=lx({engrave:"key",strata:s,strataAlpha:o});let P=new Vp;for(let k of Dt)xb(P,k);let O=new nn(P.geometry(),u);O.name="solid",O.frustumCulled=!1,n.add(O),c.push(O)}let f=null,h=null,d=t.latticeDensity!=null?t.latticeDensity:1;t.lattice!==!1&&(h=gb({strata:s,strataAlpha:o,far:r,dir:!0}),f=new au(vb(d),h),f.name="lattice",f.frustumCulled=!1,f.onBeforeRender=l,n.add(f));let g=[],x=on.r3.alpha;if(t.edges!==!1){let P=XP(),O=ui({segments:P.seg,width:P.width,faces:P.face,strata:s,strataAlpha:o,far:r,alpha:x});O.mesh.name="edges",O.mesh.onBeforeRender=l,n.add(O.mesh),g.push(O)}let p=null,m=null,_=null,w=.4;if(t.vertices){let P=YP(),O=t.extraVertices,k=P.pos.length/3,$=O?O.pos.length/3:0,j=P.pos,Me=P.face,ve,Fe;if($&&(j=new Float32Array((k+$)*3),j.set(P.pos),j.set(O.pos,k*3),Me=new Float32Array(k+$),Me.set(P.face),Me.set(O.face,k),ve=new Float32Array(k+$).fill(1),Fe=new Float32Array(k+$).fill(1)),m=Wl({positions:j,faces:Me,sizes:ve,alphas:Fe,strata:s,strataAlpha:o,sizePx:2,color:"white",alpha:w}),$){let We=m.object.geometry;_={base:k,count:$,sizes:ve,alphas:Fe,touch(){We.attributes.aSize.needsUpdate=!0,We.attributes.aAlpha.needsUpdate=!0}}}p=m.object,p.name="vertices",p.onBeforeRender=l,n.add(p)}let v=1,M={solid:1,lattice:1,edges:1,vertices:1},S=!0,E=!1,y=!0,A=null,T=()=>{n.visible=v>0,u&&(u.uniforms.uAlpha.value=v*M.solid),y=v*M.solid>0;for(let P=0;P<c.length;P++)c[P].visible=y&&!(A&&A[P]&&A[P].empty);h&&(h.uniforms.uFade.value=v*M.lattice,S=v*M.lattice>0,f.visible=S&&!E);for(let P of g)P.setAlpha(x*v*M.edges);m&&m.setAlpha(w*v*M.vertices)},I=f?JP(f.geometry.attributes.position):0,F=f?Sb(f.geometry.attributes.aStrut.array):0,z=P=>{if(!f||!S)return;n.updateWorldMatrix(!0,!1);let O=n.matrixWorld.elements,k=Math.hypot(O[0],O[1],O[2]),$=0,j=1;for(let We=0;We<7;We++){let ke=e?a[We].matrix.elements:s.value[We].elements,ee=Math.hypot(ke[12],ke[13],ke[14]);ee>$&&($=ee);let ie=Math.hypot(ke[0],ke[1],ke[2]);ie>j&&(j=ie)}let Me=(I*j+$)*k;Mb.set(O[12],O[13],O[14]),P.getWorldDirection(bb);let ve=qP.copy(Mb).sub(P.position).dot(bb)-Me,Fe=ve>0&&F*j*k*ae.uPxPerUnit.value/ve<=3;Fe!==E&&(E=Fe,f.visible=S&&!E)};A=c.map(P=>{let O=P.geometry,k=O.attributes.position.array,$=O.attributes.aStrut.array,j=O.attributes.aFace.array,Me=k.length/3,ve=Me/3,Fe=new Zt(Me>65535?new Uint32Array(Me):new Uint16Array(Me),1);for(let Te=0;Te<Me;Te++)Fe.array[Te]=Te;O.setIndex(Fe);let We=new Uint8Array(ve).fill(1),ke=new Float32Array(28),ee=new Float32Array(7),ie={mesh:P,empty:!1};return ie.run=Te=>{if(e){P.updateWorldMatrix(!0,!1),Xl.multiplyMatrices(Te.matrixWorldInverse,P.matrixWorld);let te=Xl.elements,me=P.matrixWorld.elements;ke[0]=te[2],ke[1]=te[6],ke[2]=te[10],ke[3]=te[14],ee[0]=Math.hypot(me[0],me[1],me[2])}else{n.updateWorldMatrix(!0,!1),_b.multiplyMatrices(Te.matrixWorldInverse,n.matrixWorld);for(let te=0;te<7;te++){Xl.multiplyMatrices(_b,s.value[te]);let me=Xl.elements;ke[te*4]=me[2],ke[te*4+1]=me[6],ke[te*4+2]=me[10],ke[te*4+3]=me[14],Xl.multiplyMatrices(n.matrixWorld,s.value[te]);let Se=Xl.elements;ee[te]=Math.hypot(Se[0],Se[1],Se[2])}}let $e=ae.uPxPerUnit.value,re=!1;for(let te=0;te<ve;te++){let me=0;for(let Se=0;Se<3&&!me;Se++){let nt=te*3+Se,he=nt*3,Ie=e?0:Math.min(6,Math.max(0,Math.floor(j[nt]/16+.001))),qe=Ie*4,Ne=-(ke[qe]*k[he]+ke[qe+1]*k[he+1]+ke[qe+2]*k[he+2]+ke[qe+3]);$[nt]*ee[Ie]*$e/Math.max(Ne,1e-6)<6.001&&(me=1)}We[te]!==me&&(We[te]=me,re=!0)}if(!re)return;let se=0;for(let te=0;te<ve;te++)We[te]&&(Fe.array[se++]=te*3,Fe.array[se++]=te*3+1,Fe.array[se++]=te*3+2);Fe.clearUpdateRanges(),Fe.addUpdateRange(0,Math.max(1,se)),Fe.needsUpdate=!0,O.setDrawRange(0,se),ie.empty=se===0,P.visible=y&&!ie.empty},ie});let L=A.length?P=>{if(!(!y||!n.visible))for(let O=0;O<A.length;O++)A[O].run(P)}:null,V=P=>{z(P),L&&L(P)};ZP(V);let G={group:n,strata:a,solids:c,lattice:f,edges:g,vertices:p,vertexExtra:_,strataMatrices:s,strataAlpha:o,solidMaterial:u,latticeMaterial:h,perStratum:e,setGap(P){for(let O=0;O<7;O++){let k=(3-O)*(P-Ot.rest);e?a[O].position.y=k:s.value[O].makeTranslation(0,k,0)}},setFade(P){v=Math.max(0,Math.min(1,P)),T()},get fade(){return v},setStratumFade(P,O){P>=0&&P<7&&(o.value[P]=Math.max(0,Math.min(1,O)))},setParts(P){for(let O in P)O in M&&(M[O]=P[O]);T()},setFar(P){h&&(h.uniforms.uFar.value=P);for(let O of g)O.uniforms.uFar.value=P},setHideCaps(P){u&&(u.uniforms.uHideCapsOf.value=P)},setLatticeDensity(P){if(!f||P===d)return;d=P;let O=f.geometry;f.geometry=vb(P),F=Sb(f.geometry.attributes.aStrut.array),O.dispose()},dispose(){KP(V);for(let P of c)P.geometry.dispose();u&&u.dispose(),f&&(f.geometry.dispose(),h.dispose());for(let P of g)P.dispose();m&&m.dispose(),n.parent&&n.parent.remove(n)}};return G.setGap(Ot.rest),t.hallLod&&G.setHideCaps(-1),G}var Sa=Dt[ta.stratum],Vu=Sa.n/Sa.k,QP=Math.floor(1.5/Vu-.5)+1,wb=.003;function eI(t,e){let n=Math.round(e*1.5/Vu-.5);n=Math.max(0,Math.min(QP-1,n));let i=(n+.5)*Vu/1.5,r=Bp(Sa,1,0,i),s=Math.round((t-r)/Vu);return{s:r+s*Vu,t:i,key:`${n}:${s}`}}function tI(t,e,n){let i=Sa.top+(Sa.bot-Sa.top)*e,r=Ft(i),s=Sa.n,o=(t%s+s)%s,a=Math.floor(o),l=o-a,c=Math.PI*2*a/s-Math.PI/s,u=c+Math.PI*2/s;return n.set(Math.sin(c)*r+(Math.sin(u)-Math.sin(c))*r*l,i,Math.cos(c)*r+(Math.cos(u)-Math.cos(c))*r*l)}function Gu(t){let e=Ps(t||[]),n=[],i=new Set,r=o=>-1+3*(.1+.8*o),s=o=>.1+.8*o;for(let[o,a]of e){let l=h0(o),c=h0(a),u=Math.hypot((c.x-l.x)*6,(c.y-l.y)*6),f=Math.max(1,Math.round(u));for(let h=0;h<=f;h++){let d=h/f,g=eI(r(l.x+(c.x-l.x)*d),s(l.y+(c.y-l.y)*d));if(i.has(g.key))continue;i.add(g.key);let x=tI(g.s,g.t,new C);Math.hypot(x.x,x.y)<ta.apertureSkip||n.push(x)}}return n}function Cp(t={}){let e=t.scale||1,n=t.nodes||Gu(Mt.clan.sigil),i=new Float32Array(Math.max(1,n.length)*3);n.forEach((l,c)=>{let u=Math.hypot(l.x,l.z)||1;i[c*3]=l.x+l.x/u*wb,i[c*3+1]=l.y,i[c*3+2]=l.z+l.z/u*wb});let r=0,s=!1,o=es&&es.litAlpha!=null?es.litAlpha:.7;if(e<1e3){let l=Wl({positions:i,count:0,sizePx:t.dotPx||ta.dotPx,color:"ember",alpha:1});return l.object.name="litNodes",l.object.renderOrder=3,{object:l.object,nodes:n,get count(){return r},setCount(c){r=Math.max(0,Math.min(n.length,c|0)),l.setCount(r),l.object.visible=r>0},setNight(c){s=!!c,l.setAlpha(s?o:1)},dispose(){l.dispose()}}}let a=Ap({positions:i,count:0,color:"ember",radius:(t.emitterM||ta.emitterM)/e,intensity:1,night:!1});return a.object.name="litNodes",{object:a.object,nodes:n,get count(){return r},setCount(l){r=Math.max(0,Math.min(n.length,l|0)),a.setCount(r)},setNight(l){s=!!l,a.setIntensity(s?o:1)},dispose(){a.dispose()}}}var Rb="samvin.v1",Ab="samvin.session",nI=400,Cb=/^S(0[1-9]|1[0-4])$/,Ui=t=>t!==null&&typeof t=="object"&&!Array.isArray(t),hx=t=>Array.isArray(t)&&t.every(e=>typeof e=="string");function iI(){return{v:1,firstVisit:null,lastVisit:null,days:[],found:{},shards:0,nadirOpen:!1,owner:!1,glyph:null,drawings:[],jokesFound:[],drones:{day:null,count:0,arrivals:0},resonanceNext:0,maxNest:0,transmissions:{delivered:0,read:[],lastDay:null},probes:{},decoded:[],capsuleOpened:!1,companionArrived:!1,whaleSeen:!1,inverted:!1,sound:"on",tier:null,lastRoom:"#/core",firstDive:!1,firstUnfold:!1,whaleDay:null,birthdayLeadDay:null,foundVars:{},deeds:{},code:{},codeShown:[],sbor:{count:0,last:null,here:[]},lost:{saved:0,pairs:0,kind:null,day:null,rescued:!1,hid:!1},replies:{},proposals:[],shows:{count:0,lastDay:null}}}var rI=["wait","finish","call","host","rope","gentle","notice","word"],Tb=["S","A","M","•","V","I","N"],Eb=t=>typeof t=="string"&&Number.isFinite(Date.parse(t)),Gp=t=>Number.isInteger(t)&&t>=0,dx=t=>t===null||typeof t=="string",sI={v:t=>t===1,firstVisit:t=>t===null||typeof t=="string"&&Number.isFinite(Date.parse(t)),lastVisit:t=>t===null||typeof t=="string"&&Number.isFinite(Date.parse(t)),days:t=>hx(t),found:t=>Ui(t),shards:t=>Number.isInteger(t)&&t>=0&&t<=5,nadirOpen:t=>typeof t=="boolean",owner:t=>typeof t=="boolean",glyph:t=>t===null||Array.isArray(t),drawings:t=>Array.isArray(t),jokesFound:t=>hx(t),drones:t=>Ui(t),resonanceNext:t=>Number.isInteger(t)&&t>=0,maxNest:t=>typeof t=="number"&&Number.isFinite(t),transmissions:t=>Ui(t),probes:t=>Ui(t),decoded:t=>hx(t),capsuleOpened:t=>typeof t=="boolean",companionArrived:t=>typeof t=="boolean",whaleSeen:t=>typeof t=="boolean",inverted:t=>typeof t=="boolean",sound:t=>t==="on"||t==="off",tier:t=>t===null||t==="T1"||t==="T2"||t==="T3",lastRoom:t=>typeof t=="string"&&t.startsWith("#"),firstDive:t=>typeof t=="boolean",firstUnfold:t=>typeof t=="boolean",whaleDay:t=>t===null||typeof t=="string",birthdayLeadDay:t=>t===null||typeof t=="string",foundVars:t=>Ui(t),deeds:t=>Ui(t),code:t=>Ui(t),codeShown:t=>Array.isArray(t),sbor:t=>Ui(t),lost:t=>Ui(t),replies:t=>Ui(t),proposals:t=>Array.isArray(t),shows:t=>Ui(t)};function oI(t){for(let r of Object.keys(t.deeds))(!rI.includes(r)||!Eb(t.deeds[r]))&&delete t.deeds[r];for(let r of Object.keys(t.code))(!Tb.includes(r)||!Eb(t.code[r]))&&delete t.code[r];t.codeShown=[...new Set(t.codeShown.filter(r=>Tb.includes(r)))];let e=t.sbor;Gp(e.count)||(e.count=0),dx(e.last)||(e.last=null),Array.isArray(e.here)||(e.here=[]),e.here=e.here.filter(r=>Ui(r)&&typeof r.day=="string"&&Array.isArray(r.ids)).map(r=>({...r,ids:r.ids.filter(s=>typeof s=="string")})).slice(-30);let n=t.lost;Gp(n.saved)||(n.saved=0),Gp(n.pairs)||(n.pairs=0),n.kind===null||n.kind==="one"||n.kind==="pair"||(n.kind=null),dx(n.day)||(n.day=null),typeof n.rescued!="boolean"&&(n.rescued=!1),typeof n.hid!="boolean"&&(n.hid=!1);for(let r of Object.keys(t.replies)){let s=t.replies[r];if(!/^\d+$/.test(r)||!Array.isArray(s)){delete t.replies[r];continue}t.replies[r]=s.filter(o=>Array.isArray(o)&&o.length===2&&o.every(a=>typeof a=="number"&&a>=-1&&a<=1)).slice(0,64)}t.proposals=t.proposals.filter(r=>Ui(r)&&typeof r.id=="string"&&typeof r.title=="string").slice(0,3).map(r=>({...r,title:r.title.slice(0,32),text:typeof r.text=="string"?r.text.slice(0,80):"",where:r.where==="игра"||r.where==="жизнь"?r.where:"игра"}));let i=t.shows;Gp(i.count)||(i.count=0),dx(i.lastDay)||(i.lastDay=null);for(let r of Object.keys(t.probes)){let s=t.probes[r];Ui(s)&&"read"in s&&typeof s.read!="boolean"&&delete s.read}}function aI(t){let e=Ui(t)?t:{},n=iI();for(let s of Object.keys(n))(!(s in e)||!sI[s](e[s]))&&(e[s]=n[s]);let i=e.drones;i.day===null||typeof i.day=="string"||(i.day=null),Number.isInteger(i.count)||(i.count=0),Number.isInteger(i.arrivals)||(i.arrivals=0);let r=e.transmissions;(!Number.isInteger(r.delivered)||r.delivered<0)&&(r.delivered=0),Array.isArray(r.read)||(r.read=[]),r.read=r.read.filter(s=>Number.isInteger(s)&&s>=0),r.lastDay===null||typeof r.lastDay=="string"||(r.lastDay=null);for(let s of Object.keys(e.found))(!Cb.test(s)||typeof e.found[s]!="string")&&delete e.found[s];e.days=[...new Set(e.days.filter(s=>/^\d{4}-\d{2}-\d{2}$/.test(s)))].sort();try{oI(e)}catch(s){ft("state:migrate",s)}return e}function lI(){try{let t=localStorage.getItem(Rb);if(t==null)return{};try{return JSON.parse(t)}catch{return{}}}catch{return Y.storageOk=!1,{}}}var Hu=0,Wp=!1;function Yl(){if(Hu&&(clearTimeout(Hu),Hu=0),!(!Wp||!Y.data)&&(Wp=!1,!!Y.storageOk))try{localStorage.setItem(Rb,JSON.stringify(Y.data))}catch{Y.storageOk=!1}}function Uc(){if(Wp=!0,!Hu)try{Hu=setTimeout(Yl,500)}catch{Yl()}}var Hp=-1,Y={data:null,storageOk:!0,today:"",distinctDays:1,isNewDay:!1,returning:!1,sameDaySession:!1,daysAway:0,bond:0,shrp:28,get litNodes(){if(Hp<0)try{Hp=Gu(Mt.clan.sigil).length}catch(t){Hp=0,ft("state:lit",t)}return Math.min(Y.distinctDays,Hp)},set(t,e){Y.data[t]=e,Uc()},patch(t){t(Y.data),Uc()},deliverTransmissions(){let t=Y.data.transmissions;if(t.lastDay===Y.today)return 0;let e=Mt.transmissions.length,n=Math.min(e,Math.max(t.delivered,Y.distinctDays)),i=Math.max(0,n-t.delivered);return t.delivered=Math.max(t.delivered,n),t.lastDay=Y.today,Uc(),i},markRead(t){let e=Y.data.transmissions;!Number.isInteger(t)||t<0||e.read.includes(t)||(e.read.push(t),Uc())},rank(){let t=Object.keys(Y.data.found).filter(n=>Cb.test(n)).length,e=Y.distinctDays;return t>=12&&e>=14?{name:"АРХИТЕКТОР",index:3}:t>=7&&e>=5?{name:"СМОТРИТЕЛЬ",index:2}:t>=3||e>=3?{name:"ИССЛЕДОВАТЕЛЬ",index:1}:{name:"НАБЛЮДАТЕЛЬ",index:0}}};function Pb(t){let e=Number.isFinite(t)?t:Date.now(),n=aI(lI());Y.data=n,Y.today=ch(e);let i=!0;try{i=sessionStorage.getItem(Ab)==null,sessionStorage.setItem(Ab,"1")}catch{i=!0}let r=n.firstVisit,s=n.lastVisit?ch(Date.parse(n.lastVisit)):null;if(Y.returning=r!=null&&i,Y.sameDaySession=Y.returning&&s===Y.today,Y.daysAway=s?Math.max(0,ra(s,Y.today)):0,Y.isNewDay=!n.days.includes(Y.today),Y.isNewDay)for(n.days.push(Y.today),n.days.sort();n.days.length>nI;)n.days.shift();Y.distinctDays=Math.max(1,n.days.length);let o=new Date(e).toISOString();n.firstVisit==null&&(n.firstVisit=o),n.lastVisit=o;let a=Object.keys(n.found).length;return Y.bond=a0(Y.distinctDays,a),Y.shrp=Cy(Y.distinctDays,a),Wp=!0,Yl(),Y}typeof window<"u"&&window.addEventListener("pagehide",Yl);var Ib=Object.freeze({clan:"members",crew:"members",missions:"voyages",vault:"insignia",legends:"archive"}),Db=new Set(["MEMBERS","VOYAGES","ARCHIVE","INSIGNIA"]);function cI(t){try{return decodeURIComponent(t)}catch{return t}}function Fo(t,e){let n={hash:"",room:t,sub:e==null||e===""?null:e};return n.hash=uI(n),n}function xs(t){if(t&&typeof t=="object"&&t.room)return Fo(ce[t.room]?t.room:"CORE",t.sub||null);let n=String(t??"").trim().replace(/^#?\/?/,"").split(/[/?]/).filter(Boolean),i=(n[0]||"core").toLowerCase();Ib[i]&&(i=Ib[i]);let r=cb(i);if(!r||r.id==="WORKSHOP")return Fo("CORE",null);let s=n[1]?cI(n[1]):null;return r.id==="MEMBERS"&&s&&s.toLowerCase()==="workshop"?Fo("WORKSHOP",null):r.id==="CORE"?Fo("CORE",s&&s.toLowerCase()==="open"?"open":null):Fo(r.id,Db.has(r.id)?s:null)}function uI(t){let e=t&&ce[t.room]?t.room:"CORE";if(e==="WORKSHOP")return"#/members/workshop";let n=t.sub,i=n!=null&&n!==""&&(Db.has(e)||e==="CORE"&&n==="open");return`#/${ce[e].slug}${i?"/"+encodeURIComponent(String(n)):""}`}var Lb=t=>!!(Y.data&&Y.data.found&&Y.data.found[t]);function px(t,e){let n=t&&t.room?t:xs(t),i=Y.data||{};return n.room==="NADIR"&&!i.nadirOpen?{route:Fo("CORE",null),status:"sealed",vars:{k:i.shards|0},shudder:"N"}:n.room==="ZENITH"&&!Lb("S13")&&e!=="overpull"?{route:Fo("CORE",null),status:"route.missing",vars:{}}:n.room==="WORKSHOP"&&!Lb("S06")&&e!=="hall"?{route:Fo("MEMBERS",Mt.operator.id||null)}:{route:n}}function Wu(t){let e=Mt.clan.name,n=t&&ce[t.room]?t.room:"CORE";if(n==="CORE")return Q.owner?`${e} · ${Dr(Mt.operator.name)}`:e;let i=ce[n],r=n==="NADIR"&&Y.data&&Y.data.nadirOpen&&i.nameOpen?i.nameOpen:i.name;return`${e} · ${r}`}var jt=Object.freeze({INPUT:0,CLOCK:10,DIRECTOR:20,WORLD:30,FX:40,LAMP:50,CAMERA:60,OVERLAY:70,RENDER:80,UI:90}),hI=.05,mx=250,wa=[],dI=1,ql=0,jl=-1;function pI(t){let e=wa.slice(),n=e.length;for(;n>0&&e[n-1].order>t.order;)n--;e.splice(n,0,t),wa=e}function Ob(t){if(ql=0,!fe.running)return;ql=requestAnimationFrame(Ob);let e=jl<0?16.7:t-jl;jl=t,e>0||(e=0),e>mx&&(e=mx),fe.now+=e,fe.frame++;let n=Math.min(1,Math.max(0,+fe.timeScale||0));fe.worldNow+=e*n;let i=Math.min(hI,e/1e3),r=i*n,s=fe.now,o=wa;for(let a=0;a<o.length;a++){let l=o[a];if(!l.dead)try{l.fn(l.order>=30&&l.order<50?r:i,s)}catch(c){ft(`loop:${l.id}`,"frame callback threw and was removed",c),fe.remove(l.id)}}}var fe={running:!1,frame:0,now:0,timeScale:1,worldNow:0,at(){if(!fe.running||jl<0||typeof performance>"u")return fe.now;let t=performance.now()-jl;return fe.now+(t>0?Math.min(t,mx):0)},add(t,e=jt.UI){let n=dI++;return pI({id:n,fn:t,order:e,dead:!1}),n},remove(t){let e=wa.findIndex(i=>i.id===t);if(e<0)return;wa[e].dead=!0;let n=wa.slice();n.splice(e,1),wa=n},start(){fe.running||(fe.running=!0,jl=-1,typeof requestAnimationFrame=="function"&&(ql=requestAnimationFrame(Ob)))},stop(){fe.running=!1,ql&&typeof cancelAnimationFrame=="function"&&cancelAnimationFrame(ql),ql=0}},Nb=!1,Fb=!1;function mI(){let t=document.visibilityState==="hidden"||document.hidden===!0;if(t!==Fb)if(Fb=t,t){Nb=fe.running,fe.stop();try{document.title=Q.night?"…сплю":"…ты где?"}catch{}try{Yl()}catch(e){ft("loop:flush",e)}ge.emit("visibility",{hidden:!0})}else{try{document.title=Wu(Q.route)}catch{document.title="SAM.VIN"}Nb&&fe.start();try{ai.say("tab.back",{},{force:!0})}catch(e){ft("loop:status",e)}ge.emit("visibility",{hidden:!1})}}typeof document<"u"&&document.addEventListener("visibilitychange",mI);var fi=Py,Ub=1/120,On=class t{constructor(e,n=1,i=0){this.omega=e,this.zeta=n,this.x=i,this.v=0,this.target=i}step(e){if(!(e>0))return this.x;let n=Math.min(16,Math.ceil(e/Ub)),i=e/n,r=this.omega,s=r*r,o=2*this.zeta*r;for(let a=0;a<n;a++)this.v+=(s*(this.target-this.x)-o*this.v)*i,this.x+=this.v*i;return this.x}snap(e){this.x=e,this.target=e,this.v=0}settled(e=.001){return Math.abs(this.target-this.x)<e&&Math.abs(this.v)<e*10}static from(e,n=0){return new t(e.omega,e.zeta==null?1:e.zeta,n)}},$p=class{constructor(e,n=1){this.omega=e,this.zeta=n,this.x=new C,this.v=new C,this.target=new C}step(e){if(!(e>0))return this.x;let n=Math.min(16,Math.ceil(e/Ub)),i=e/n,r=this.omega,s=r*r,o=2*this.zeta*r,a=this.x,l=this.v,c=this.target;for(let u=0;u<n;u++)l.x+=(s*(c.x-a.x)-o*l.x)*i,l.y+=(s*(c.y-a.y)-o*l.y)*i,l.z+=(s*(c.z-a.z)-o*l.z)*i,a.x+=l.x*i,a.y+=l.y*i,a.z+=l.z*i;return a}snap(e){this.x.copy(e),this.target.copy(e),this.v.set(0,0,0)}settled(e=.001){return this.x.distanceTo(this.target)<e&&this.v.length()<e*10}};var gI=typeof window<"u"&&typeof window.DeviceOrientationEvent<"u",Aa=[],Xp=!1,$u={alpha:0,beta:0,gamma:0,t:0};function kb(t){$u.alpha=t.alpha||0,$u.beta=t.beta||0,$u.gamma=t.gamma||0,$u.t=typeof performance<"u"?performance.now():Date.now();for(let e=0;e<Aa.length;e++)try{Aa[e]($u)}catch{}}var xI={available:gI&&typeof window.DeviceOrientationEvent.requestPermission!="function",on(t){!xI.available||Aa.includes(t)||(Aa.push(t),Xp||(window.addEventListener("deviceorientation",kb),Xp=!0))},off(t){let e=Aa.indexOf(t);e>=0&&Aa.splice(e,1),Xp&&Aa.length===0&&(window.removeEventListener("deviceorientation",kb),Xp=!1)}};var Yp=null;function Zl(){return Yp||(Yp=new Promise(t=>{let e=!1,n=()=>{e||(e=!0,t())};setTimeout(n,2500);try{let i=typeof document<"u"?document.fonts:null;if(!i||typeof i.load!="function"){n();return}Promise.allSettled([i.load("700 64px Geologica","SAMVINСЭМ"),i.load("500 32px Martian","SAMVIN 0123")]).then(n,n)}catch{n()}}),Yp)}var vI=Object.freeze({G2:98,A2:110,B2:123.47,D3:146.83,E3:164.81,G3:196,A3:220,B3:246.94,D4:293.66,E4:329.63,G4:392,A4:440,B4:493.88,D5:587.33,E5:659.25,G5:783.99,A5:880,B5:987.77,D6:1174.66,E6:1318.51,G6:1567.98,A6:1760,B6:1975.53,D7:2349.32}),qp=Object.freeze([392,440,493.88,587.33,659.25,783.99,880]),uz=Object.freeze(Object.fromEntries(Object.keys(ce).map(t=>[t,ce[t].root]))),gx=Object.freeze({S01:"G4",S02:"A4",S03:"B4",S04:"D5",S05:"E5",S06:"G5",S07:"A5",S08:"B5",S09:"D6",S10:"E6",S11:"G6",S12:"A6",S13:"B6",S14:"D7"});function jp(t){let e=vI[t];return e??440}function je(t){return Math.pow(10,t/20)}function Le(t,e=1){let n=t.createGain();return n.gain.value=e,n}function bt(t,e=440,n="sine"){let i=t.createOscillator();return i.type=n,i.frequency.value=e,i}var Bb=new WeakMap;function si(t,e="white"){let n=Bb.get(t);if(n||Bb.set(t,n={}),!n[e]){let r=t.sampleRate*2,s=t.createBuffer(1,r,t.sampleRate),o=s.getChannelData(0),a=0,l=0,c=0,u=0,f=0;for(let d=0;d<r;d++){let g=Math.random()*2-1;e==="pink"?(a=.997*a+.029591*g,l=.985*l+.032534*g,c=.95*c+.048056*g,o[d]=a+l+c+g*.1848):e==="brown"?(u=(u+.02*g)/1.02,o[d]=u):o[d]=g,f+=o[d]*o[d]}let h=.577/Math.sqrt(f/r);for(let d=0;d<r;d++)o[d]*=h;n[e]=s}let i=t.createBufferSource();return i.buffer=n[e],i.loop=!0,i}function vs(t,e,n,i,r){return t.setValueAtTime(0,e),t.linearRampToValueAtTime(n,e+i),t.setTargetAtTime(0,e+i,r),t}function Rn(t,e,n,i,r,s){return t.setValueAtTime(0,e),t.linearRampToValueAtTime(n,e+i),t.setValueAtTime(n,r),t.linearRampToValueAtTime(0,s),t}function hn(t,e,n,i,r){return t.setValueAtTime(e,i),t.exponentialRampToValueAtTime(n,i+r),t}function Cn(t,e,n,i,r){return t.setValueAtTime(e,i),t.linearRampToValueAtTime(n,i+r),t}function zn(t,e,n,i,r,s,o,a,l){let c=bt(t,e,l),u=Le(t);return vs(u.gain,n,r,s,o),c.connect(u).connect(i),c.start(n),a&&c.stop(n+a),c}function Oo(t,e,n,i,r){let s=vt(t,e,n);return Ei(t.ctx,s.t,i,s),ht(t,s,s.t+r)}function cr(t,e,n,i,r=t.out,s){let o=bt(e,n,s),a=Le(e);return o.connect(a).connect(r),o.start(i),t.srcs.push(o),[o,a]}function Kl(t,e,n=1){let i=si(t,"pink"),r=bt(t,.07),s=Le(t,.7*n);return r.connect(Le(t,.3*n)).connect(s.gain),i.connect(Bt(t,"bandpass",600,.5)).connect(s).connect(e),i.start(),r.start(),[i,r]}function Xu(t,e,n,i,r,s,o,a,l){let c=vt(t,e,n),u=c.t,[f,h]=cr(c,t.ctx,i,u);return hn(f.frequency,i,r,u,s),Rn(h.gain,u,1,o,u+a,u+l),ht(t,c,u+l+.005)}function Jl(t,e,n,i,r,s,o,a,l,c,u,f){let h=Le(e);h.connect(a),cr(t,e,n,o,h),hn(cr(t,e,i+r,o,h)[0].frequency,i+r,i,o,s),Rn(h.gain,o,l,c,o+u,o+f)}function Wr(t,e,n,i,r=1,s=6,o){for(let a=1;a<=s;a++){let l=i*(1-(a-1)/Math.max(1,s-1)*.8333333333333334);zn(t,e*a,n,o,r/a,.002,l/6.91,l+.05)}return n+i+.05}function Ql(t,e,n,i,r,s=.003){return r.map(([o,a,l])=>zn(t,e*o,n,i,l,s,a/6.91,a+.05))}function Bt(t,e="lowpass",n=1e3,i=.707){let r=t.createBiquadFilter();return r.type=e,r.frequency.value=n,r.Q.value=i,r}function ec(t,e=0){if(!t.createStereoPanner)return Le(t);let n=t.createStereoPanner();return n.pan.value=Math.max(-1,Math.min(1,+e||0)),n}function Ti(t,e,n=1.4,i=2,r=t.currentTime,s=1.2,o=s,a=.003){let l=bt(t,e),c=bt(t,e*n),u=Le(t),f=Le(t);Cn(u.gain,e*n*i,0,r,o),c.connect(u).connect(l.frequency),vs(f.gain,r,1,a,s/6.91),l.connect(f);let h=r+a+s+.05;return l.start(r),c.start(r),l.stop(h),c.stop(h),{out:f,end:h,stop(d=t.currentTime){try{l.stop(d),c.stop(d)}catch{}}}}function xx(t,e){let n=t.ctx.currentTime;return e&&e.when!=null&&e.when>n?+e.when:n}function Yi(t){return Math.pow(2,(t.transpose||0)/12)}function Gb(t,e,n,i,r,s=.01){if(!t.alive)return;t.alive=!1;let o=e.currentTime,a=Math.max(.008,r/1e3);n.gain.cancelScheduledValues(o),n.gain.setValueAtTime(n.gain.value,o),n.gain.linearRampToValueAtTime(0,o+a);for(let l of t.srcs)try{l.stop(o+a+s)}catch{}setTimeout(()=>{try{i.disconnect()}catch{}},(a+.2)*1e3)}function vt(t,e,{bus:n="ui",db:i=0,pan:r=0,wet:s=0,panNode:o=!1}={}){let a=t.ctx,l=Le(a),c=l;(r||o)&&l.connect(c=ec(a,r)),l.gain.value=je(i)*(c===l?1:Math.SQRT2),c.connect(t.bus[n]||t.bus.ui),s>0&&t.send&&c.connect(t.send(s));let u={alive:!0,t:xx(t,e),out:l,head:c,srcs:[],end:0,stop(f=30){Gb(u,a,l,c,f)}};return u}function Lt(t,...e){for(let n of e)t.srcs.push(n.src||n);return t}function ht(t,e,n){let i=t.ctx;e.end=n;let r=null;for(let o of e.srcs){try{o.stop(n)}catch{}"onended"in o&&(r=o)}let s=()=>{if(e.alive){e.alive=!1;try{e.head.disconnect()}catch{}}};return r?r.onended=s:setTimeout(s,(n-i.currentTime+.1)*1e3),t.track?t.track(e,Math.max(.05,n-i.currentTime)):e}var zb=new WeakMap;function Yu(t,e=1){let n=zb.get(t);if(n||zb.set(t,n={}),!n[e]){let r=t.createBuffer(1,2,t.sampleRate);r.getChannelData(0)[0]=e,n[e]=r}let i=t.createBufferSource();return i.buffer=n[e],i}function Ei(t,e,{type:n="bandpass",f:i=3200,Q:r=1,a:s=5e-4,d:o=.002,peak:a=1,color:l="white"}={},c,u=c&&c.out){let f=si(t,l),h=Le(t);return c&&(h.connect(u),c.srcs.push(f)),Rn(h.gain,e,a,s,e+s,e+s+o),f.connect(Bt(t,n,i,r)).connect(h),f.start(e,Math.random()*1.5),f.stop(e+s+o+.02),{src:f,out:h,end:e+s+o+.02}}function vx(t,e,{decaySec:n=e,tau:i=0,hp:r=120,lp:s=0}={}){let o=t.sampleRate,a=Math.floor(o*e),l=t.createBuffer(2,a,o),c=Math.exp(i?-1/(i*o):-6.91/(n*o)),u=Math.exp(-2*Math.PI*r/o),f=s?Math.exp(-2*Math.PI*s/o):0;for(let h=0;h<2;h++){let d=l.getChannelData(h),g=0,x=0,p=1;for(let m=0;m<a;m++){let _=(Math.random()*2-1)*p;p*=c,x=s?(1-f)*_+f*x:u*(x+_-g),g=_,d[m]=x}}return l}var Vb=new WeakMap;function yx(t){let e=Vb.get(t);if(e==null){let n=0;for(let i of t.getChannelData(0))n+=i*i;Vb.set(t,e=n>0?1/Math.sqrt(n):1)}return e}function qu(t,e){let n=t.createConvolver();return n.normalize=!1,n.buffer=e,{input:n,output:n.connect(Le(t,yx(e)))}}function _x(t){return typeof OfflineAudioContext<"u"&&t instanceof OfflineAudioContext}function qi(t,e="fx",n=!1,i=200){let r=t.ctx,s=Le(r,0),o=n?ec(r,0):null,a=o?(s.connect(o),o):s;a.connect(t.bus[e]||t.bus.fx);let l={alive:!0,srcs:[],out:s,pn:o,k:o?Math.SQRT2:1,set(){},stop(c=i){Gb(l,r,s,a,c,.02)}};return l}function ji(t,e){return t.track?t.track(e,3600):e}var vn=(t,e)=>t==null||!isFinite(+t)?e:+t,Mx=t=>Math.max(-1,Math.min(1,vn(t,0)));function Hb(t,e={}){let n=t.ctx,i=e.gen===2?2:1,r=Math.pow(1.03,vn(e.n,0)),s=vt(t,e,{bus:"ui",db:i===1?-22:-20,pan:vn(e.pan,0),panNode:!0,wet:i===2?.12:0}),o=s.t;if(i===1){let h=Bt(n,"highpass",1500,.707),d=Yu(n,.9),g=bt(n,4200*r),x=Le(n);return x.gain.setValueAtTime(.75,o),x.gain.setTargetAtTime(0,o,.0012),d.connect(h),g.connect(x).connect(h),h.connect(s.out),d.start(o),g.start(o),Lt(s,d,g),ht(t,s,o+.012)}let a=Le(n),l=bt(n,1180*r),c=bt(n,2950*r),u=Le(n),f=Le(n);if(u.gain.setValueAtTime(.62,o),u.gain.setTargetAtTime(0,o,.006),u.gain.setValueAtTime(0,o+.022),f.gain.setValueAtTime(.62*je(-9),o),f.gain.setTargetAtTime(0,o,.003),l.connect(u).connect(a),c.connect(f).connect(a),Ei(n,o,{type:"lowpass",f:3e3,Q:.707,d:.002,peak:.3},s,a),l.start(o),c.start(o),Lt(s,l,c),a.connect(s.out),t.buf&&t.buf.irTight){let h=qu(n,t.buf.irTight),d=Le(n,.45);a.connect(h.input),h.output.connect(d).connect(s.out)}return ht(t,s,o+.4)}function bx(t,e={}){let n=t.ctx,i=t.buf&&t.buf["rev."+e.src];if(!i||e.endAt==null||!isFinite(+e.endAt))return null;let r=Math.max(.25,vn(e.rate,1)),s=Math.max(.01,vn(e.ms,300)/1e3),o=n.currentTime,a=Math.min(i.duration,s*r),l=+e.endAt-a/r,c=i.duration-a,u=l,f=c,h=a;if(u<o){let S=(o-u)*r;f+=S,h-=S,u=o}if(h<=.003)return null;let d=i.sampleRate,g=Math.floor(c*d),x=a*d,p=1e-9;for(let S=0;S<i.numberOfChannels;S++){let E=i.getChannelData(S);for(let y=g;y<E.length;y++){let A=(y-g)/x,T=Math.abs(E[y])*A*A;T>p&&(p=T)}}let m=vt(t,{when:u},{bus:"fx",db:vn(e.gainDb,-22)-20*Math.log10(p),pan:vn(e.pan,0)}),_=n.createBufferSource(),w=Le(n),v=new Float32Array(16),M=h/r;for(let S=0;S<16;S++){let E=(u-l+S/15*M)/(a/r);v[S]=E*E}return w.gain.setValueCurveAtTime(v,u,M),_.buffer=i,_.playbackRate.value=r,_.connect(w).connect(m.out),_.start(u,f,h),Lt(m,_),ht(t,m,u+M+.005)}function Zp(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"fx",db:0}),r=i.t,s=Yu(n,1),o=Bt(n,"lowpass",1e3,.707),a=Le(n,je(-32)*n.sampleRate/(.456*2*Math.PI*1e3));s.connect(o).connect(a).connect(i.out);let l=bt(n,80),c=Le(n);return Rn(c.gain,r,je(-30),.003,r+.022,r+.03),l.connect(c).connect(i.out),s.start(r),l.start(r),Lt(i,s,l),ht(t,i,r+.04)}function Wb(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"fx",db:0}),r=i.t,s=si(n,"white"),o=Le(n);return Cn(o.gain,je(-50)*1.03,je(-28)*1.03,r,.4),Cn(o.gain,je(-28)*1.03,0,r+1.3,.03),s.connect(Bt(n,"lowpass",2500,.5)).connect(o).connect(i.out),s.start(r),Lt(i,s),ht(t,i,r+1.34)}function $b(t,e={}){let n=t.ctx,i=t.buf&&t.buf.digiTail;if(!i)return null;let r=Array.isArray(e.pans)&&e.pans.length?e.pans:[0,-.2,.4,-.6,.8,0],s=vt(t,e,{bus:"fx",db:-23,panNode:!0}),o=s.t,a=n.createBufferSource();if(s.head.pan)for(let l=0;l<6;l++)s.head.pan.setValueAtTime(l===5?0:Mx(r[l]),o+.04*l);return a.buffer=i,a.connect(s.out),a.start(o),Lt(s,a),ht(t,s,o+i.duration+.005)}function Xb(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"fx",db:-14}),r=i.t,s=bt(n,30),o=Le(n);return hn(s.frequency,30,120,r+.24,.76),Rn(o.gain,r+.24,1,.06,r+1,r+1.12),s.connect(o).connect(i.out),s.start(r+.24),Lt(i,s),ht(t,i,r+1.13)}function Sx(t,e,n,i=1){let r=zn(t,96,e,n,i,.004,.13024602026049203,1);return hn(r.frequency,96,48,e,.12),r}function wx(t,e,n,i,r=0){let s=t.ctx;r&&e.connect(Le(s,r)).connect(n);let o=t.irLong;if(!o)return;let a=qu(s,o),l=Le(s,i);e.connect(a.input),a.output.connect(l).connect(n)}function Yb(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"fx",db:vn(e.gainDb,-22)+9}),r=i.t,s=Bt(n,"lowpass",300,.707);return Lt(i,Sx(n,r,s,1)),wx(t,s,i.out,1,0),ht(t,i,r+6.2)}function qb(t,e={}){let n=t.ctx,i=Math.max(1,vn(e.dist,300)),r=vt(t,e,{bus:"fx",db:-18+10*Math.log10(300/i)}),s=r.t,o=Le(n),a=zn(n,60,s,o,.75,.006,.4/4.6,0);return hn(a.frequency,60,32,s,.4),Ei(n,s,{type:"lowpass",f:vn(e.lpHz,180),Q:.707,a:.004,d:.196,peak:.6},r,o),Lt(r,a),wx(t,o,r.out,.6,1),ht(t,r,s+6.2)}function jb(t,e={}){let n=t.ctx,i=Math.max(1,Math.min(12,vn(e.n,5)|0)),r=vt(t,e,{bus:"fx",db:-23.5}),s=r.t,o=Bt(n,"lowpass",400,.707);for(let a=0;a<i;a++){let l=s+a*.06,c=zn(n,90,l,o,.7,.003,.08/4.6,.1);Ei(n,l,{type:"lowpass",f:2e3,d:.003,peak:.5},r,o),Lt(r,c)}return wx(t,o,r.out,.4,1),ht(t,r,s+i*.06+6.1)}function Zb(t,e={}){let n=t.ctx,i=Math.max(.05,vn(e.ms,480)/1e3),r=vt(t,e,{bus:"ui",db:-30,pan:vn(e.panFrom,0),panNode:!0}),s=r.t,o=bt(n,1320),a=Le(n);return hn(o.frequency,1320,880,s,i),Rn(a.gain,s,1,.012,s+i-.04,s+i),r.head.pan&&Cn(r.head.pan,Mx(e.panFrom),Mx(e.panTo),s,i),o.connect(a).connect(r.out),o.start(s),Lt(r,o),ht(t,r,s+i+.01)}function Kb(t,e={}){let n=t.ctx,i=vn(e.hz,392),r=vt(t,e,{bus:"room",db:-17.5,pan:vn(e.pan,0),panNode:!0,wet:.3}),s=r.t,o=Ti(n,i,1.4,3,s,1.6,.8),a=Ti(n,i*1.5,1.4,3,s+.18,1.6,.8);return o.out.connect(r.out),a.out.connect(r.out),Lt(r,o,a),ht(t,r,a.end)}function Jb(t,e={}){let n=t.ctx,i=vn(e.hz,392),r=e.kind==="way"||e.kind==="rest"?e.kind:"on",s=vt(t,e,{bus:"room",db:0,pan:vn(e.pan,0),panNode:!0,wet:.2}),o=s.t,a=Le(n);a.connect(s.out);let l;if(r==="rest"){let c=bt(n,1800),u=Le(n);Rn(u.gain,o,je(-32),.001,o+.005,o+.006),c.connect(u).connect(s.out),c.start(o),Lt(s,c),a.gain.value=je(-30)/1.75,l=Wr(n,i/2,o+.02,2,1,6,a)}else r==="way"?(Cn(a.gain,0,je(-20)/1.75,o,.4),l=Wr(n,i,o,2.4,1,6,a)):(a.gain.value=je(-18)/1.75,l=Wr(n,i,o,2,1,6,a));return ht(t,s,l)}function Qb(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"room",db:-16,pan:vn(e.pan,0),panNode:!0,wet:.25}),r=i.t,s=Ti(n,vn(e.hz,392),1.4,2,r,2,.9);return s.out.connect(i.out),Lt(i,s),ht(t,i,s.end)}function e1(t,e={}){let n=t.ctx,i=e.night?.75:1,r=vt(t,e,{bus:"ui",db:-30,pan:vn(e.pan,0),panNode:!0}),s=r.t;return[1567.98,1975.53].forEach((o,a)=>{let l=s+a*.07,c=bt(n,o*i),u=Le(n);Rn(u.gain,l,1,.004,l+.032,l+.04),c.connect(u).connect(r.out),c.start(l),c.stop(l+.045),Lt(r,c)}),ht(t,r,s+.12)}function t1(t,e={}){return Oo(t,e,{bus:"ui",db:-30,pan:vn(e.pan,0),panNode:!0},{type:"lowpass",f:400,Q:.707,a:.02,d:.1,peak:3.5},.14)}function n1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"room",db:0,wet:.18}),r=i.t,s=Le(n,je(-24.5));s.connect(i.out);let o=e.pair?n.createPeriodicWave(new Float32Array([0,1]),new Float32Array([0,0]),{disableNormalization:!0}):null;for(let u=0;u<7;u++){let f=r+.06*u,h=qp[u],d=Le(n);if(u<6?Cn(d.gain,1,.08,f+.04,.02):Cn(d.gain,1,.16,r+.4,.02),d.connect(s),Ql(n,h,f,d,[[1,.4,1],[2,.24,.1],[3,.12,.03]],.002),o){let g=n.createOscillator(),x=Le(n);g.setPeriodicWave(o),g.frequency.value=h*1.5,vs(x.gain,f,je(-3),.002,.4/6.91),g.connect(x).connect(d),g.start(f),g.stop(f+.45)}}let a=r+.48,l=Le(n,je(-20)*.9),c=Ti(n,1174.66,1.4,2,a,1.6,.9);return c.out.connect(l).connect(i.out),Lt(i,c),bx(t,{src:"vin",endAt:a,ms:120,rate:2,gainDb:-24}),ht(t,i,c.end)}var yI=["A","B"];function Ax(t,e={},n=!0,i=t.bus.bed){let r=t.ctx,s=Le(r),o=Bt(r,"highpass",3e3,.5),a=ec(r,vn(e.pan,0)),l=bt(r,Math.max(.001,vn(e.drift,.03))),c=Le(r,.6);l.connect(c),a.pan&&c.connect(a.pan),l.start(),o.connect(a).connect(s).connect(i);let u=d=>je(-58+18*Math.max(0,Math.min(1,d))+6),f={A:null,B:null},h={alive:!0,level01:vn(e.level01,1/9),drift:vn(e.drift,.03),poll(){if(!(!h.alive||!t.buf))for(let d of yI){let g=t.buf["dust"+d];if(f[d]||!g||d==="B"&&t.tier==="T1")continue;let x=r.createBufferSource(),p=Le(r,.71);x.buffer=g,x.loop=!0,x.connect(p).connect(o),x.start(r.currentTime+.01,Math.random()*g.duration),f[d]=x}},set(d){if(!h.alive||!d)return;let g=r.currentTime;d.level01!=null&&(h.level01=+d.level01,s.gain.setTargetAtTime(u(h.level01),g,.08)),d.drift!=null&&(h.drift=+d.drift,l.frequency.setTargetAtTime(Math.max(.001,Math.min(.12,h.drift)),g,.3)),d.pan!=null&&a.pan&&a.pan.setTargetAtTime(Math.max(-1,Math.min(1,+d.pan)),g,.05),h.poll()},stop(d=200){if(!h.alive)return;h.alive=!1;let g=r.currentTime,x=Math.max(.008,d/1e3);s.gain.cancelScheduledValues(g),Cn(s.gain,s.gain.value,0,g,x);for(let p of[f.A,f.B,l])if(p)try{p.stop(g+x+.02)}catch{}}};return s.gain.value=u(h.level01),h.poll(),n&&t.track?t.track(h,3600):h}function i1(t,e){return Ax(t,e,!0)}function r1(t,e={}){let n=t.ctx,i=Le(n);i.connect(t.bus.fx);let r=Math.max(.1,vn(e.periodMs,900)/1e3),s=Array.isArray(e.steps)?e.steps.map(g=>+g/1e3):null,o=e.t0Perf!=null&&isFinite(+e.t0Perf)&&!_x(n)?Ye.fx.ctxTimeFor(+e.t0Perf):xx(t,e),a=g=>je(-52+24*Math.max(0,Math.min(1,g)));i.gain.value=a(vn(e.level01,.5));let l=0,c=0,u=g=>{if(t.chain&&t.chain.closed&&t.chain.closed(g,.03))return;let x=zn(n,49,g,i,.88,.006,.11,.8),p=zn(n,98,g,i,.88*je(-8),.006,.11,.8);Ei(n,g,{type:"lowpass",f:600,d:.002,peak:.7*je(-30)*4}).out.connect(i),t.track&&t.track({alive:!0,stop(m=8){try{let _=n.currentTime+m/1e3;x.stop(_),p.stop(_)}catch{}}},g+.8-n.currentTime)},f=()=>s?l<s.length?o+s[l]:1/0:o+l*r,h=g=>{for(let x=f();x<=g;x=f())x>=n.currentTime-.005&&u(Math.max(x,n.currentTime)),l++;f()===1/0&&clearInterval(c)},d={alive:!0,set(g){d.alive&&g&&g.level01!=null&&i.gain.setTargetAtTime(a(+g.level01),n.currentTime,.05)},stop(g=60){if(!d.alive)return;d.alive=!1,clearInterval(c);let x=n.currentTime;i.gain.cancelScheduledValues(x),Cn(i.gain,i.gain.value,0,x,Math.max(.006,g/1e3))}};return _x(n)?h(o+(s?30:8)):(h(n.currentTime+.1),c=setInterval(()=>{d.alive&&h(n.currentTime+.1)},25)),d}var s1=-5;function o1(t,e,n,i){let r=t.ctx,s=(e.gainDb===-3?-3:0)+n,o=vt(t,e,{bus:"fx",db:s}),a=o.t;Lt(o,Sx(r,a,o.out,je(-6))),Ei(r,a,{type:"bandpass",f:3200,Q:1.2,a:3e-4,d:.0027,peak:je(-18)*2.2},o);let l=Le(r);l.gain.setValueAtTime(je(s1-10),a),l.gain.setTargetAtTime(je(s1),a+.004,.12),l.connect(o.out);let c=t.send?t.send(.3):null,u=(w,v,M,S)=>{let E=Ti(r,w,1.4,3,v,M,1.2,.008),y=Le(r,je(-10)),A=zn(r,w*3,v,l,je(-24),.008,M/3/6.91,M/3+.05);E.out.connect(y).connect(l),S&&c&&y.connect(c),Lt(o,E,A)};u(392,a+.06,2.4,!1),u(587.33,a+.34,2.8,!0),Jl(o,r,196,293.66,14,.6,a+.34,l,je(-16)/2,.03,.9,1.7);let f=a+.42,h=Bt(r,"lowpass",180,4),d=Le(r);hn(h.frequency,180,1800,f,1.6),vs(d.gain,f,je(-16)/3.2,.6,2/6.91);for(let w of[98,146.83,220])for(let v of[-6,6]){let M=bt(r,w,"sawtooth");M.detune.value=v,M.connect(h),M.start(f),Lt(o,M)}h.connect(d).connect(l);let g=si(r,"white"),x=Bt(r,"bandpass",300,1.4),p=Le(r),m=ec(r,-1);if(hn(x.frequency,300,6e3,f,2.38),Rn(p.gain,f,je(-26)*2.4,.9,f+.9,a+2.8),m.pan&&Cn(m.pan,-1,1,f,2.38),g.connect(x).connect(p).connect(m).connect(l),g.start(f),Lt(o,g),(Array.isArray(e.found)?e.found:[]).forEach((w,v)=>{let M=jp(gx[w]||""),S=a+.34+.06*(v+1);if(!gx[w])return;let E=Le(r),y=zn(r,M,S,E,je(-30),.005,1.2/6.91,1.3),A=zn(r,M*2.76,S,l,je(-42),.004,.3/6.91,.4);E.connect(l),c&&E.connect(c),Lt(o,y,A)}),i){let w=a+.62,v=Ti(r,493.88,1.4,2.4,w,2.6,1,.008),M=Le(r,je(-12));v.out.connect(M).connect(l),c&&M.connect(c),Lt(o,v)}return ht(t,o,a+3.3)}function a1(t,e={}){return o1(t,e,0,!1)}function l1(t,e={}){return Oo(t,e,{bus:"ui",db:-24},{type:"bandpass",f:3200*Math.pow(1.04,Math.max(0,Math.min(12,+e.i||0))),Q:8,a:2e-4,d:.0018,peak:20},.03)}function c1(t,e={}){let n=Y.data&&Y.data.found?Object.keys(Y.data.found):[];return o1(t,{when:e.when,found:Array.isArray(e.found)?e.found:n},-6,!0)}var Tx=1.75;function Jp(t,e,n,i,r,s=1){Rn(cr(e,t,n,i)[1].gain,i,s,5e-4,i+Math.max(.001,r*.4),i+r)}function f1(t,e={}){let n=typeof window<"u"&&window.innerWidth||1440,i=e.x!=null&&isFinite(+e.x)?+e.x:n/2,r=vt(t,e,{bus:"ui",db:-30,pan:Math.max(-.6,Math.min(.6,(i/n*2-1)*.6)),panNode:!0});return Jp(t.ctx,r,1800*Yi(t),r.t,.006),ht(t,r,r.t+.012)}function h1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"ui",db:-24}),r=i.t;return Ei(n,r,{type:"highpass",f:4e3,Q:.707,a:2e-4,d:.0018,peak:.55},i),Jp(n,i,900*Yi(t),r,.02,.55),ht(t,i,r+.03)}var Kp=0,u1=-1;function d1(t,e={}){let n=t.ctx,i=n.currentTime;e.n!=null&&isFinite(+e.n)?Kp=Math.max(0,+e.n|0):Kp=i-u1<.25?Math.min(12,Kp+1):0,u1=i;let r=vt(t,e,{bus:"ui",db:-28});return Jp(n,r,2200*Math.pow(1.02,Kp)*Yi(t),r.t,.003),ht(t,r,r.t+.008)}function p1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"ui",db:-24}),r=Le(n,1/Tx);return r.connect(i.out),ht(t,i,Wr(n,(+e.root||146.83)*4*Yi(t),i.t,.9,1,6,r))}function m1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"ui",db:-18}),r=i.t,s=Bt(n,"lowpass",600);return s.connect(i.out),vs(cr(i,n,120*Yi(t),r,s)[1].gain,r,1,.004,.14/5),ht(t,i,r+.16)}function g1(t,e={}){return Oo(t,e,{bus:"ui",db:-26},{type:"bandpass",f:5e3*(.92+Math.random()*.16)*Yi(t),Q:4,a:5e-4,d:.0055,peak:2.8},.012)}function x1(t,e={}){let n=t.ctx,i=Math.max(0,Math.min(6,+e.i|0)),r=vt(t,e,{bus:"ui",db:e.quiet?-30:-18}),s=Le(n,1/Tx);return s.connect(r.out),ht(t,r,Wr(n,qp[i]*Yi(t),r.t,1.2,1,6,s))}function v1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"room",db:-16,wet:.08}),r=Le(n,1/Tx);return r.connect(i.out),ht(t,i,Wr(n,(+e.hz||392)*Yi(t),i.t,2,1,6,r))}function y1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"ui",db:-22}),r=Le(n,1/1.3);return r.connect(i.out),ht(t,i,Wr(n,(+e.hz||392)*Yi(t),i.t,.4,1,3,r))}function _1(t,e={}){let n=t.ctx,i=(+e.root||146.83)*4*Yi(t),r=vt(t,e,{bus:"ui",db:-23,wet:.15}),s=r.t,o=Ti(n,i,1.4,2,s,1.6,.8),a=Ti(n,i*1.5,1.4,2,s+.012,1.6,.8);return o.out.connect(r.out),a.out.connect(r.out),Lt(r,o,a),ht(t,r,a.end)}function M1(t,e={}){let n=t.ctx,i=Yi(t),r=(+e.root||146.83)*i,s=vt(t,e,{bus:"ui",db:0,wet:.1}),o=s.t;return Jl(s,n,r*2,r*3,5,.24,o,s.out,je(-22)/2,.008,.36,.48),Lt(s,zn(n,48,o,s.out,je(-14),.004,.16/5,0)),ht(t,s,o+.49)}function b1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"ui",db:-26}),r=i.t;return Jp(n,i,2400*Yi(t),r,.004,1),Ei(n,r+.004,{type:"lowpass",f:400*Yi(t),Q:.707,a:.025,d:.095,peak:2.6},i),ht(t,i,r+.13)}var S1=t=>Math.max(0,Math.min(1,+t||0));function w1(t,e={}){let n=t.ctx,i=qi(t,"fx",!0),{out:r,pn:s}=i,o=si(n,"pink"),a=Bt(n,"bandpass",300,1);o.connect(a).connect(r),o.start(n.currentTime,Math.random()*1.5),i.srcs.push(o);let l=0,c=!1,u=!!e.reverse;return i.set=f=>{if(!i.alive||!f)return;let h=S1(f.speed01),d=n.currentTime;h>l?l=h:h<l*.85&&(c=!0);let g=u&&!c?1:h;a.frequency.setTargetAtTime(300+2100*g,d,.025),r.gain.setTargetAtTime(je(-18)*1.9*i.k*h,d,.025),s&&s.pan&&f.pan!=null&&s.pan.setTargetAtTime(Math.max(-1,Math.min(1,+f.pan||0)),d,.04)},i.set(e),ji(t,i)}function A1(t,e={}){let n=Math.max(.1,(+e.ms||1300)/1e3);return Xu(t,e,{bus:"fx",db:e.gainDb!=null?+e.gainDb:-10},+e.from||120,+e.to||30,n,.03,n*.7,n)}function T1(t,e={}){return Oo(t,e,{bus:"fx",db:-32},{type:"highpass",f:3e3,Q:.707,a:1e-4,d:9e-4,peak:1.1},.006)}function E1(t,e={}){let n=vt(t,e,{bus:"fx",db:-8}),i=n.t;return Lt(n,zn(t.ctx,42,i,n.out,1,.004,.3/6.91,0)),ht(t,n,i+.31)}function R1(t,e={}){let n=t.ctx,i=qi(t,"fx",!1),{out:r}=i,s=si(n,"brown"),o=Bt(n,"lowpass",120,.707),a=bt(n,36),l=Le(n,.45);return s.connect(o).connect(r),a.connect(l).connect(r),s.start(n.currentTime,Math.random()*1.5),a.start(),i.srcs.push(s,a),i.set=c=>{i.alive&&c&&r.gain.setTargetAtTime(je(-20)*.45*S1(c.speed01),n.currentTime,.04)},i.set(e),ji(t,i)}function C1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"fx",db:-24}),r=i.t,s=si(n,"white"),o=Bt(n,"bandpass",800,2.2),a=Le(n);return hn(o.frequency,800,200,r,.4),Cn(a.gain,0,5,r,.12),a.gain.linearRampToValueAtTime(0,r+.4),s.connect(o).connect(a).connect(i.out),s.start(r,Math.random()*1.5),Lt(i,s),ht(t,i,r+.41)}function P1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"fx",db:-13.6}),r=i.t,s=r+2.34,o=bt(n,36),a=bt(n,36.3),l=Le(n),c=si(n,"brown"),u=Bt(n,"lowpass",120,1.2),f=Le(n);return hn(o.frequency,36,49,r,2.34),hn(a.frequency,36.3,49.3,r,2.34),hn(l.gain,1e-4,.42,r,.8),l.gain.linearRampToValueAtTime(.5,s-.06),l.gain.linearRampToValueAtTime(0,s),hn(u.frequency,120,900,r,2.34),hn(f.gain,1e-4,.35,r,.8),f.gain.linearRampToValueAtTime(.5,s-.06),f.gain.linearRampToValueAtTime(0,s),o.connect(l),a.connect(l),l.connect(i.out),c.connect(u).connect(f).connect(i.out),o.start(r),a.start(r),c.start(r,Math.random()*1.5),Lt(i,o,a,c),ht(t,i,s+.01)}function I1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"fx",db:-16,wet:.2}),r=i.t,s=Yu(n,1),o=Bt(n,"bandpass",2200,1.5),a=Le(n,2.2);s.connect(o).connect(a).connect(i.out),Ei(n,r,{type:"bandpass",f:2e3,Q:1.2,a:3e-4,d:.003,peak:1.2},i);let l=si(n,"pink"),c=Bt(n,"bandpass",500,2),u=Le(n),f=bt(n,660),h=Le(n),d=r+.02;return hn(c.frequency,500,3200,d,.58),Rn(u.gain,d,1.6,.43,d+.43,r+.62),hn(f.frequency,660,1320,d,.58),Rn(h.gain,d,.12,.43,d+.43,r+.62),l.connect(c).connect(u).connect(i.out),f.connect(h).connect(i.out),s.start(r),l.start(r,Math.random()*1.5),f.start(r),Lt(i,s,l,f),ht(t,i,r+.63)}var wI=(t,e,n)=>Math.max(e,Math.min(n,t));function L1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"fx",db:-16,wet:.25}),r=i.t;return Lt(i,...Ql(n,1567.98,r,i.out,[[1,4,1/1.7],[2.76,1.6,.5/1.7],[5.4,.6,.28/1.7]])),ht(t,i,r+4.06)}function D1(t,e={}){let n=t.ctx,i=qi(t),r=o=>110*Math.pow(2,wI(+o,0,6)/2),s=bt(n,e.k!=null?r(e.k):110);return s.connect(i.out),s.start(),i.srcs.push(s),i.out.gain.setTargetAtTime(je(-18),n.currentTime,.08),i.set=o=>{if(!i.alive||!o||o.k==null)return;let a=n.currentTime;s.frequency.cancelScheduledValues(a),hn(s.frequency,s.frequency.value,r(o.k),a,.2)},ji(t,i)}function N1(t,e={}){let n=t.ctx,i=qi(t),r=bt(n,55),s=n.currentTime;return r.connect(i.out),r.start(),i.srcs.push(r),Cn(i.out.gain,0,je(-16),s,6),i.set=()=>{},ji(t,i)}function F1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"fx",db:-12}),r=i.t,[,s]=cr(i,n,70,r);return Ei(n,r,{type:"lowpass",f:900,Q:.707,a:.002,d:.028,peak:.9},i),Rn(s.gain,r,.62,.003,r+.04,r+.06),ht(t,i,r+.07)}function O1(t,e,n,i){let r=t.ctx,s=(Array.isArray(e.hz)?e.hz:[]).map(Number).filter(u=>u>20&&u<8e3);s.length||s.push(392);let o=vt(t,e,{bus:"room",db:n,wet:.2}),a=o.t,l=Le(r,1/Math.pow(s.length,.75)/(i?1:1.75));l.connect(o.out);let c=a;return s.forEach((u,f)=>{let h=a+f*.004;if(i){let d=Ti(r,u,1.4,2.4,h,2.6,1,.006);d.out.connect(l),Lt(o,d),c=Math.max(c,d.end)}else c=Math.max(c,Wr(r,u,h,2.4,1,6,l))}),ht(t,o,c)}function U1(t,e={}){return O1(t,e,-15.5,!0)}function k1(t,e={}){return O1(t,e,-12,!1)}function B1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"fx",db:-24}),r=i.t,s=si(n,"white"),o=Le(n);return vs(o.gain,r,.68,.01,.9/6.91),s.connect(Bt(n,"highpass",2e3,.707)).connect(o).connect(i.out),s.start(r,Math.random()),Lt(i,s),ht(t,i,r+.92)}function z1(t,e={}){let n=t.ctx,i=qi(t,"fx",!1,800),r=[],s=[],o=Math.log2(440);for(let u=0;u<8;u++){let f=bt(n,440),h=Le(n);h.gain.value=0,f.connect(h).connect(i.out),f.start(),r.push(f),s.push(h),i.srcs.push(f)}let a=new Float32Array(8).fill(-1),l=0,c=null;return i.set=u=>{if(!i.alive||!u||u.d==null)return;let f=-3*Math.log10(Math.max(1e-6,+u.d)/12),h=n.currentTime;c!==null&&(l+=Math.round(f-l-c)),c=f-l;for(let d=0;d<8;d++){let g=((d+c)%8+8)%8,x=Math.log2(27.5)+g,p=Math.pow(2,x),m=Math.exp(-((x-o)*(x-o))/(2*1.21));a[d]<0||Math.abs(g-a[d])>4?(r[d].frequency.setValueAtTime(p,h),s[d].gain.setValueAtTime(m*.59,h)):(r[d].frequency.setTargetAtTime(p,h,.012),s[d].gain.setTargetAtTime(m*.59,h,.012)),a[d]=g}},i.set({d:e.d!=null?e.d:12}),i.out.gain.setTargetAtTime(je(-20),n.currentTime,.12),ji(t,i)}function V1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"fx",db:-20.5}),r=i.t,s=r+5,o=Le(n),a=bt(n,.2),l=Le(n,60);a.connect(l);let c=[Bt(n,"bandpass",400,6),Bt(n,"bandpass",800,6)];for(let f of c)l.connect(f.frequency),f.connect(o);let u=Le(n);Rn(u.gain,r,1,.9,r+3.6,s),o.connect(u);for(let f of[0,.7]){let h=bt(n,90+f),d=bt(n,90+f,"sawtooth"),g=Le(n,.18),x=Le(n);for(let p of[h,d])Cn(p.frequency,90+f,140+f,r,2),p.frequency.linearRampToValueAtTime(70+f,s);x.gain.value=.9,h.connect(g).connect(o),d.connect(x);for(let p of c)x.connect(p);h.start(r),d.start(r),Lt(i,h,d)}if(a.start(r),Lt(i,a),u.connect(i.out),t.irLong){let f=qu(n,t.irLong),h=Le(n);h.gain.value=.6,u.connect(f.input),f.output.connect(h).connect(i.out)}return ht(t,i,s+6.1)}function G1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"fx",db:-24}),r=i.t,[s,o]=cr(i,n,880,r);return cr(i,n,6,r,s.detune)[1].gain.value=40,hn(s.frequency,880,440,r,1.2),Rn(o.gain,r,1,.02,r+1,r+1.2),ht(t,i,r+1.21)}function H1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"fx",db:-14,wet:.25}),r=i.t;for(let l=0;l<5;l++)Ei(n,r+.16*l,{type:"bandpass",f:6e3,Q:1.5,a:2e-4,d:.0018,peak:2},i);let s=r+.8,o=Le(n,.26);o.connect(i.out);let a=s;return[392,493.88,587.33].forEach((l,c)=>{let u=Ti(n,l,1.4,2.4,s+c*.012,3,1,.006);u.out.connect(o),Lt(i,u),a=u.end}),ht(t,i,a)}function W1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"fx",db:-16,wet:.2}),r=i.t,s=bt(n,392),o=bt(n,392*1.4),a=Le(n),l=Le(n);hn(s.frequency,392,784,r,2.4),hn(o.frequency,392*1.4,784*1.4,r,2.4),Cn(a.gain,392*1.4*1.6,784*1.4*.3,r,2.4),o.connect(a).connect(s.frequency),Cn(l.gain,0,.8,r,.01),l.gain.linearRampToValueAtTime(.55,r+2.3),l.gain.linearRampToValueAtTime(0,r+2.42),s.connect(l).connect(i.out);let c=r+2.4,u=zn(n,2400,c,i.out,.45,.004,.012,0);return hn(u.frequency,2400,3e3,c,.05),s.start(r),o.start(r),Lt(i,s,o,u),ht(t,i,c+.12)}function $1(t,e={}){let n=t.ctx,i=qi(t,"room",!1,300),r=bt(n,.07),s=Le(n,.3),o=Le(n,.7);r.connect(s).connect(o.gain);for(let a of[196,246.94,293.66,440]){let l=bt(n,a),c=Le(n);c.gain.value=.25,l.connect(c).connect(o),l.start(),i.srcs.push(l)}return o.connect(i.out),r.start(),i.srcs.push(r,...Kl(n,i.out)),i.out.gain.setTargetAtTime(je(-40)*.66,n.currentTime,.6),i.set=()=>{},ji(t,i)}function X1(t,e={}){return Xu(t,e,{bus:"fx",db:-14},60,30,1.4,.08,1.1,1.4)}function Y1(t,e={}){return Xu(t,e,{bus:"ui",db:-30},2400,3200,.04,.003,.03,.04)}var ju=(t,e,n)=>Math.max(e,Math.min(n,t));function q1(t,e={}){let n=t.ctx,i=qi(t,"ui",!1),r=bt(n,220),s=n.currentTime;return Cn(r.frequency,220,440,s,1.2),r.connect(i.out),r.start(s),i.srcs.push(r),Cn(i.out.gain,0,je(-22),s,.02),i.set=()=>{},ji(t,i)}function j1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"room",db:-28,wet:.15}),r=i.t,[s,o]=cr(i,n,660,r);return hn(s.frequency,660,440,r,2.5),Rn(o.gain,r,.65,.05,r+2.2,r+2.5),cr(i,n,9,r,o.gain)[1].gain.value=.35,ht(t,i,r+2.51)}function Z1(t,e={}){let n=t.ctx,i=vt(t,e,{bus:"room",db:-24,wet:.2}),r=i.t;for(let s=0;s<3;s++)Lt(i,zn(n,1318.51,r+.09*s,i.out,1,.002,.012,.09));return ht(t,i,r+.27)}function K1(t,e={}){let n=t.ctx,i=qi(t,"room",!0),r=bt(n,440),s=bt(n,880),o=Le(n,.16),a=bt(n,5.2),l=Le(n,6);a.connect(l),l.connect(r.detune),l.connect(s.detune),r.connect(i.out),s.connect(o).connect(i.out),r.start(),s.start(),a.start(),i.srcs.push(r,s,a);let c=!0;return i.set=u=>{if(!i.alive||!u)return;let f=ju(+u.hz||440,40,4e3),h=n.currentTime;c?(r.frequency.setValueAtTime(f,h),s.frequency.setValueAtTime(2*f,h),c=!1):(r.frequency.setTargetAtTime(f,h,.02),s.frequency.setTargetAtTime(2*f,h,.02)),i.pn&&i.pn.pan&&u.pan!=null&&i.pn.pan.setTargetAtTime(ju(+u.pan||0,-1,1),h,.03)},i.set(e),i.out.gain.setTargetAtTime(je(-24)/1.16*i.k,n.currentTime,.012),ji(t,i)}function J1(t,e={}){let n=t.ctx,i=qi(t,"room",!1),r=si(n,"white"),s=Bt(n,"bandpass",3200,.6),o=Le(n,1.05);return r.connect(s).connect(o).connect(i.out),r.start(),i.srcs.push(r),i.set=a=>{i.alive&&a&&a.amount!=null&&i.out.gain.setTargetAtTime(je(-30)*ju(+a.amount,0,1),n.currentTime,.04)},i.set({amount:e.amount!=null?e.amount:0}),ji(t,i)}function Q1(t,e={}){let n=t.ctx,i=qi(t,"room",!1),r=bt(n,1403);return r.connect(i.out),r.start(),i.srcs.push(r),i.set=s=>{if(!i.alive||!s||s.amount==null)return;let o=ju(+s.amount,0,1),a=n.currentTime;i.out.gain.setTargetAtTime(je(-30)*o,a,.06),r.frequency.setTargetAtTime(1403*(.985+.015*o),a,.06)},i.set({amount:e.amount!=null?e.amount:0}),ji(t,i)}function eS(t,e={}){let n=vt(t,e,{bus:"room",db:-16,wet:.2}),i=n.t;return Jl(n,t.ctx,+e.lo||196,+e.hi||293.66,14,.6,i,n.out,.5,.03,.9,1.7),ht(t,n,i+1.71)}function tS(t,e={}){let n=t.ctx,i=+e.hz||440,r=vt(t,e,{bus:"room",db:-18}),s=r.t;return Lt(r,...Ql(n,i,s,r.out,[[1,1.4,1/1.3],[2.76,.5,.3/1.3],[5.4,.2,.12/1.3]])),ht(t,r,s+1.46)}function nS(t,e={}){let n=t.ctx,i=qi(t,"room",!1);return i.srcs.push(...Kl(n,i.out)),i.set=r=>{i.alive&&r&&r.amount!=null&&i.out.gain.setTargetAtTime(je(-40)*ju(+r.amount,0,1),n.currentTime,.3)},i.set({amount:e.amount!=null?e.amount:1}),ji(t,i)}var Ex=Object.freeze({signature:a1,ratchet:l1,owner:c1,hoverTick:f1,select:h1,tick:d1,stringPluck:p1,lockedThud:m1,chisel:g1,stratumNote:x1,memberNote:v1,workshopNode:y1,wordBell:_1,arrivalLock:M1,flinch:b1,whoosh:w1,subDrop:A1,strutTick:T1,recallThud:E1,liftRumble:R1,irisWhoosh:C1,bootSwell:P1,snapAir:I1,shard:L1,resRise:D1,resSub:N1,chunk:F1,resChord:U1,hiss:B1,shepard:z1,whale:V1,dizzy:G1,chord:k1,capsule:H1,companion:W1,zenithPad:$1,invertRoll:X1,droneDodge:Y1,probeHold:q1,probeFlight:j1,probeReturn:Z1,skyVoice:K1,dialStatic:J1,dialCarrier:Q1,beatLock:eS,vaultNote:tS,wind:nS,latch:Hb,reverseTail:bx,popClick:Zp,foldNoise:Wb,digiTail:$b,subRise:Xb,farEcho:Yb,farBoom:qb,debrisKnock:jb,bondThread:Zb,sborCall:Kb,sborAnswer:Jb,guestBurn:Qb,lostChirp:e1,lostHide:t1,rescue:n1,dust:i1,subPulse:r1}),iS=new Set(["whoosh","liftRumble","resRise","resSub","shepard","zenithPad","probeHold","skyVoice","dialStatic","dialCarrier","wind","dust","subPulse"]);var rS=t=>140*Math.pow(900/140,(t+1090)/2180),sS=[98,147,196],oS={drift:.03};function Rx(t){let e=t.ctx,n=null,i=0,r=0,s=0,o=-1,a=.03,l=-1,c=null,u=0;Jt.observe&&Jt.observe(_=>{_.speed>200&&(s=e.currentTime+.6)});let f=()=>e.currentTime,h=(_,w,v)=>_.setTargetAtTime(w,e.currentTime,v);function d(){let _=A=>Le(e,A),w={out:_(0),duck:_(je(m.duckDb)),narrow:_(1-m.narrowU),srcs:[]};w.duck.connect(w.out),w.narrow.connect(w.duck),w.out.connect(t.bus.bed),w.beat=[bt(e,49),bt(e,49.3)];let v=_(je(-34));for(let A of w.beat)A.connect(v);v.connect(w.narrow);let M=si(e,"brown");w.lp=Bt(e,"lowpass",m.lpHz,.707),M.connect(w.lp).connect(_(je(-42))).connect(w.narrow),w.wind=_(m.room==="SIGNAL"?1:0),w.wind.connect(w.narrow);let S=Kl(e,w.wind,je(-40));w.root=bt(e,m.root),w.fifth=bt(e,m.root*1.5);let E=Bt(e,"lowpass",400);w.drone=_(1),w.root.connect(_(je(-38))).connect(E),w.fifth.connect(_(je(-44))).connect(E),E.connect(w.drone).connect(w.narrow),w.rank=sS.map((A,T)=>{let I=bt(e,A),F=_(m.rank>=T+1?je(-42):0);return I.connect(F).connect(w.narrow),w.srcs.push(I),F}),w.rankOsc=w.srcs.slice(),w.tone=bt(e,220),w.toneG=_(m.narrowU*je(-38)),w.tone.connect(w.toneG).connect(w.duck),w.dustLp=Bt(e,"lowpass",m.night?7e3:2e4,.707),w.dustG=_(1-m.narrowU),w.dustLp.connect(w.dustG).connect(w.out),w.dust=Ax(t,{level01:x(),drift:m.night?.02:.03},!1,w.dustLp),w.srcs.push(...w.beat,M,w.root,w.fifth,w.tone);let y=f();for(let A of w.srcs)A.loop?A.start(y,Math.random()*1.5):A.start(y);return w.srcs.push(...S),w}let g=()=>m.night?.75:1,x=()=>m.room==="INSIGNIA"?0:1/9;function p(_=.03){if(!n)return;let w=g();h(n.beat[0].frequency,49*w,_),h(n.beat[1].frequency,49.3*w,_),h(n.root.frequency,m.root*w,_),h(n.fifth.frequency,m.root*1.5*w,_);for(let v=0;v<3;v++)h(n.rankOsc[v].frequency,sS[v]*w,_)}let m={room:"CORE",root:146.83,night:!1,rank:0,duckDb:0,narrowU:0,lpHz:rS(0),on:!1,start(){n||(n=d(),m.on=!0,p(.001),h(n.out.gain,je(m.night?-3:0),.5))},stop(){if(!n)return;let _=n,w=f();n=null,m.on=!1,_.out.gain.cancelScheduledValues(w),h(_.out.gain,0,.08);for(let v of _.srcs)try{v.stop(w+.6)}catch{}try{_.dust.stop(400)}catch{}setTimeout(()=>{try{_.out.disconnect()}catch{}},800)},setRoom(_){let w=ce[_];w&&(m.room=_,m.root=w.root,m.lpHz=rS(w.alt),n&&(h(n.lp.frequency,m.lpHz,.3),h(n.wind.gain,_==="SIGNAL"?1:0,.5),(!c||c.level01==null)&&n.dust.set({level01:x()}),p(.25)))},setRootGlide(_,w,v){let M=+_||m.root,S=+w||M,E=Math.max(0,Math.min(1,+v||0));if(m.root=M*Math.pow(S/M,E),n){let y=g();h(n.root.frequency,m.root*y,.02),h(n.fifth.frequency,m.root*1.5*y,.02)}},setNight(_){m.night=!!_,n&&(p(.6),h(n.out.gain,je(m.night?-3:0),.4),h(n.dustLp.frequency,m.night?7e3:2e4,.4))},setRank(_){if(m.rank=Math.max(0,Math.min(3,_|0)),n)for(let w=0;w<3;w++)h(n.rank[w].gain,m.rank>=w+1?je(-42):0,.5)},duck(_,w){if(m.duckDb=Math.min(0,+_||0),!n)return;let v=n.duck.gain,M=f(),S=Math.max(0,+w||0)/1e3,E=je(m.duckDb);typeof v.cancelAndHoldAtTime=="function"?v.cancelAndHoldAtTime(M):(v.cancelScheduledValues(M),v.setValueAtTime(v.value,M)),S>0?v.exponentialRampToValueAtTime(Math.max(1e-6,E),M+S):v.setValueAtTime(E,M)},narrow(_){if(m.narrowU=Math.max(0,Math.min(1,+_||0)),!n)return;let w=f();h(n.narrow.gain,1-m.narrowU,.03),h(n.dustG.gain,1-m.narrowU,.03),h(n.toneG.gain,m.narrowU*je(-38),.03)},dust(_){c=_||null,u=_&&_.ms>0?f()+_.ms/1e3:1/0,l=-1,n&&n.dust.set({level01:_&&_.level01!=null?_.level01:x(),drift:_&&_.drift!=null?_.drift:a})},update(_){if(!n||(c&&f()>=u&&m.dust(null),i+=_,r+=_,i<1/30))return;i=0;let w=f();h(n.drone.gain,je(2*(2*Sn.value-1)),.06),h(n.dustG.gain,(1-m.narrowU)*(w<s?je(-3):1),.05);let v=m.night?.02:.03,M=o>=0?w-o:-1;a=M>=2.8&&M<=6.8?v+.03*Math.sin(Math.PI*(M-2.8)/4):v,(!c||c.drift==null)&&Math.abs(a-l)>.0015&&(l=oS.drift=a,n.dust.set(oS)),r>.5&&!(t.chain&&t.chain.closed&&t.chain.closed())&&(r=0,n.dust.poll())}};return ge.on("boot:ignite",()=>{o=f()}),m}var Ta=["dustA","bellSam","bellVin","rev.sam","rev.vin","rev.lock","rev.thud","digiTail","irTight","dustB"];function cS(t,e,n,i){let r=new OfflineAudioContext(e,Math.ceil(n*t),t);return i(r),r.startRendering()}function Px(t,e){let n=0;for(let r=0;r<t.numberOfChannels;r++){let s=t.getChannelData(r);for(let o=0;o<s.length;o++){let a=Math.abs(s[o]);a>n&&(n=a)}}let i=n>0?Math.pow(10,e/20)/n:1;for(let r=0;r<t.numberOfChannels;r++){let s=t.getChannelData(r);for(let o=0;o<s.length;o++)s[o]*=i}return t}function aS(t,e){let n=t.sampleRate,i=Math.ceil(e*n),r=t.createBuffer(2,i,n),s=r.getChannelData(0),o=r.getChannelData(1),a=-Math.log(1-Math.random())/140;for(;a<e-.004;){let l=Math.max(4,Math.floor((4e-4+Math.random()*.001)*n)),c=Math.floor(a*n),u=2*Math.PI*(4500+Math.random()*6500)/n,f=Math.sin(u)/4,h=1+f,d=f/h,g=-2*Math.cos(u)/h,x=(1-f)/h,p=Math.pow(10,-24*Math.random()/20),m=((Math.random()*2-1)*.9+1)/2,_=p*Math.cos(m*Math.PI/2),w=p*Math.sin(m*Math.PI/2),v=0,M=0,S=0,E=0;for(let y=0,A=l+Math.floor(.004*n);y<A&&c+y<i;y++){let T=y<l?(Math.random()*2-1)*(.5-.5*Math.cos(2*Math.PI*y/(l-1))):0,I=d*T-d*M-g*S-x*E;M=v,v=T,E=S,S=I,s[c+y]+=I*_,o[c+y]+=I*w}a+=-Math.log(1-Math.random())/140}return Px(r,-6)}var Cx=(t,e)=>Ti(t,e,1.4,3,0,2.4,1.2,.008).out;function lS(t,e){return cS(t,1,1.6,n=>Cx(n,e).connect(n.destination)).then(n=>Px(n,-6))}var EI={sam:t=>Cx(t,392),vin:t=>Cx(t,587.33),lock:t=>{let e=Le(t);Rn(e.gain,0,.5,.006,.36,.48);for(let n of[293.66,440.49]){let i=bt(t,n);n>300&&hn(i.frequency,n+5,n,0,.24),i.connect(e),i.start(0),i.stop(.5)}return e},thud:t=>{let e=Le(t);return zn(t,42,0,e,1,.004,.3/6.91,.32),e}};function RI(t,e,n){return cS(e,2,.7,i=>{let r=i.createConvolver();r.normalize=!1;let s=t.wet&&t.wet.convA&&t.wet.convA.buffer&&t.wet.convA.buffer.sampleRate===e?t.wet.convA.buffer:null;r.buffer=s||vx(i,3.4);let o=Le(i,yx(r.buffer));EI[n](i).connect(r).connect(o).connect(i.destination)}).then(i=>{let r=i.length,s=Math.floor(r*.4);for(let o=0;o<i.numberOfChannels;o++){let a=i.getChannelData(o);a.reverse();for(let l=0;l<s;l++){let c=l/s;a[l]*=c*c}}return Px(i,-12)})}function CI(t){let e=t.sampleRate,n=Math.round(.04*e),i=n*6,r=t.createBuffer(1,i,e),s=r.getChannelData(0),o=[1,2,4,8,16,32],a=[4096,64,16,8,4,3],l=Math.round(.002*e);for(let c=0;c<6;c++){let u=o[c],f=a[c]/2,h=0;for(let d=0;d<n;d++){let g=c*n+d;if(d%u===0){let x=g/e,p=Math.min(1,d/l,(n-1-d)/l);h=.45*(Math.sin(2*Math.PI*196*x)+Math.sin(2*Math.PI*293.66*x))*Math.max(0,p)}s[g]=Math.round(h*f)/f}}return r}function PI(t){return vx(t,.35,{tau:.07,lp:5e3})}function II(t,e){let n=t.ctx,i=n.sampleRate;return e==="dustA"?aS(n,1.73):e==="dustB"?aS(n,2.31):e==="bellSam"?lS(i,392):e==="bellVin"?lS(i,587.33):e==="digiTail"?CI(n):e==="irTight"?PI(n):RI(t,i,e.slice(4))}function Qp(t,e){if(!t||!t.ctx)return Promise.resolve();t.buf||(t.buf={});let n=t._fl||(t._fl={});e+""=="dustA"&&ge.on("boot:done",()=>{let s=()=>Qp(t,Ta);typeof requestIdleCallback=="function"?requestIdleCallback(s,{timeout:300}):setTimeout(s,200)});let i=s=>Ta.indexOf(s)>=0&&!t.buf[s]&&(t.tier!=="T1"||s==="dustA"),r=(Array.isArray(e)?e:[]).filter(i);return r.some(s=>s!=="dustA")&&(r=Ta.filter(s=>(s!=="dustA"||r.indexOf(s)>=0)&&i(s))),Promise.all(r.map(s=>n[s]||(n[s]=Promise.resolve().then(()=>t.buf[s]?null:II(t,s)).then(o=>{o&&(t.buf[s]=o)}).catch(()=>{})))).then(()=>{})}var LI=Math.log(2e4/260),uS=7.5;function fS(t,e,n){let i=t.ctx,r=P=>Le(i,P),s=()=>i.currentTime,o={w:1,gateAt:-1,hitAt:-1,shadowDb:t.coarse?-12:-26,muffle:2e4},a=Bt(i,"lowpass",120,.707),l=Bt(i,"lowpass",120,.707),c=i.createWaveShaper(),u=new Float32Array(4097);for(let P=0;P<u.length;P++)u[P]=Math.abs(P/2048-1);c.curve=u,c.oversample="2x";let f=Bt(i,"highpass",90,.707),h=Bt(i,"bandpass",200,.9),d=r(je(o.shadowDb+uS));e.connect(a).connect(l).connect(c).connect(f).connect(h).connect(d);let g=Bt(i,"lowshelf",110),x=Bt(i,"lowpass",2e4,.707),p=r(1);e.connect(g),d.connect(g),g.connect(x).connect(p);let m=i.createDelay(2);m.delayTime.value=0,m.channelCount=2,m.channelCountMode="explicit",m.channelInterpretation="speakers",p.connect(m);let _=i.createChannelSplitter(2),w=i.createChannelMerger(2),v=r(1),M=r(0),S=r(0),E=r(1),y=i.createDelay(.05);m.connect(_),_.connect(v,0),_.connect(M,1),_.connect(S,0),_.connect(E,1),v.connect(w,0,0),M.connect(w,0,0),S.connect(y),E.connect(y),y.connect(w,0,1);let A=r(1);w.connect(A).connect(n);let T=[a,l,c,f,h,d,g,x,p,m,_,v,M,S,E,y,w,A];function I(P,O,k){typeof P.cancelAndHoldAtTime=="function"?P.cancelAndHoldAtTime(O):(P.cancelScheduledValues(O),P.setValueAtTime(k,O))}let F=P=>Math.max(s(),P&&isFinite(P.at)&&P.at!==null?+P.at:0),z=(P,O,k)=>{for(let[$,j]of P)I($,O,$.value),k>0?$.linearRampToValueAtTime(j,O+k):$.setValueAtTime(j,O)};function L(P,O=0,k={}){let $=F(k),j=Math.max(0,+O||0)/1e3,Me=Math.max(40,Math.min(2e4,+P||2e4)),ve=Math.max(0,Math.min(1,Math.log(2e4/Me)/LI)),Fe=k&&k.shelfDb!=null?k.shelfDb:7,We=.707+(1.1-.707)*ve,ke=Fe*ve,ee=je(-3*ve);I(x.frequency,$,o.muffle),j>0?x.frequency.exponentialRampToValueAtTime(Me,$+j):x.frequency.setValueAtTime(Me,$),z([[x.Q,We],[g.gain,ke],[p.gain,ee]],$,j),o.muffle=Me}function V(P,O=0,k={}){let $=F(k),j=Math.max(0,+O||0)/1e3,Me=Math.max(0,Math.min(2,+P)),ve=(1+Me)/2,Fe=(1-Me)/2,We=t.coarse?0:Math.max(0,Math.min(14,+(k&&k.haasMs)||0))/1e3;z([[v.gain,ve],[E.gain,ve],[S.gain,Fe],[M.gain,Fe],[y.delayTime,We]],$,j),o.w=Me}return{fx:{gate(P=400,O={}){let k=F(O),$=k+Math.max(.004,(+P||400)/1e3),j=A.gain,Me=Math.max(s(),k-.006);j.cancelScheduledValues(Me),Cn(j,1,0,Me,k-Me),j.setValueAtTime(0,$-.002),j.linearRampToValueAtTime(1,$);let ve=t.wet;if(ve&&ve.inA){let Fe=ve.live==="B"?"B":"A",We=Fe==="A"?"B":"A",ke=ve["in"+Fe].gain,ee=ve["ret"+Fe].gain,ie=ve["in"+We].gain,Te=ve["ret"+We].gain;for(let $e of[ke,ee])I($e,Me,1),$e.linearRampToValueAtTime(0,k);for(let $e of[ie,Te])$e.cancelScheduledValues(Math.max(s(),k-.007)),$e.setValueAtTime(0,Math.max(s(),k-.007)),$e.setValueAtTime(1,k);ve.live=We}return o.gateAt=k,o.hitAt=$,{hitAt:$}},advanceHit(P){let O=s();if(!(o.hitAt>O))return null;let k=Math.min(o.hitAt,Math.max(+P||0,O+.03,o.gateAt+.004)),$=A.gain,j=Math.max(O,o.gateAt);return $.cancelScheduledValues(j+1e-4),O>=o.gateAt&&$.setValueAtTime(0,O),$.setValueAtTime(0,Math.max(j,k-.002)),$.linearRampToValueAtTime(1,k),o.hitAt=k,k},muffle:L,pop(P=700,O={}){let k=F(O),$=k+Math.max(0,+P||0)/1e3;L(2e4,P,{at:k});try{Zp(t,{when:$})}catch{}return $},width:V,tape(P=900,O={}){let k=F(O),$=Math.max(.05,(+P||900)/1e3),j=new Float32Array(128);for(let Me=0;Me<128;Me++){let ve=Me*$/127;j[Me]=ve*ve/(2*$)}m.delayTime.cancelScheduledValues(k),m.delayTime.setValueCurveAtTime(j,k,$)},tapeReset(P={}){let O=F(P);m.delayTime.cancelScheduledValues(O),m.delayTime.setValueAtTime(0,O)},shadow(P){o.shadowDb=+P,d.gain.setTargetAtTime(je(o.shadowDb+uS),s(),.02)},snapshot(){let P=t.tier==="T1"?["dustA"]:Ta,O=!!t.buf;if(O){for(let k of P)if(!t.buf[k]){O=!1;break}}return{muffleHz:Math.round(x.frequency.value),width:o.w,buffersReady:O}}},postGate:A,closed(P=s(),O=0){return P>=o.gateAt-.006-O&&P<=o.hitAt},dispose(){try{e.disconnect(a),e.disconnect(g)}catch{}for(let P of T)try{P.disconnect()}catch{}}}}var DI=Math.pow(10,-6/20),Ix=Object.freeze({set(){},stop(){},alive:!1}),Ea=[],Lx=null,lt=null,Ca=null,Ia=null,$r=null,tc=null,Zu=null,Ks=!1,Ku=0,mS=!1,hS=!1,Pa=new Float32Array(512),Ra=[],Pn={ctx:null,bus:{ui:null,fx:null,room:null,bed:null},transpose:0,night:!1,hz:jp,get irLong(){return!Lx&&lt&&(Lx=gS(6)),Lx},send(t){let e=lt.createGain();return e.gain.value=t,e.connect(tc),e},wet:null,buf:{},chain:null,coarse:!1,tier:"T2",track(t,e){if(!t)return t;let n=lt?lt.currentTime:0;for(let i=Ea.length-1;i>=0;i--)(!Ea[i].v.alive||Ea[i].end<n)&&Ea.splice(i,1);for(Ea.push({v:t,end:n+(e||1)});Ea.length>24;){let i=Ea.shift();try{i.v.stop(8)}catch{}}return t}};function gS(t){let e=lt.sampleRate,n=Math.floor(e*t),i=lt.createBuffer(2,n,e),r=Math.exp(-2*Math.PI*120/e),s=Math.exp(-6.9/(t*e));for(let o=0;o<2;o++){let a=i.getChannelData(o),l=0,c=0,u=1;for(let f=0;f<n;f++){let h=(Math.random()*2-1)*u;u*=s,c=r*(c+h-l),l=h,a[f]=c}}return i}function tm(t,e,n){let i=lt.currentTime;t.cancelScheduledValues(i),t.setValueAtTime(t.value,i),t.linearRampToValueAtTime(e,i+n/1e3)}function dS(){lt&&(tm(Ca.gain,0,400),clearTimeout(Ku),Ku=setTimeout(()=>{Ku=0,lt&&(Ks||!Ye.on)&&lt.suspend().catch(()=>{})},420))}function Dx(){!lt||!Ye.on||Ks||(clearTimeout(Ku),Ku=0,lt.resume().catch(()=>{}),tm(Ca.gain,DI,400))}function NI(){Pn.ctx=lt,$r=lt.createDynamicsCompressor(),$r.threshold.value=-18,$r.ratio.value=3,$r.attack.value=.003,$r.release.value=.25,Ca=lt.createGain(),Ca.gain.value=0,Ia=lt.createAnalyser(),Ia.fftSize=512,Ca.connect(Ia).connect(lt.destination),tc=lt.createGain();let t=gS(3.4),e=lt.createGain(),n=lt.createConvolver(),i=lt.createGain(),r=lt.createGain(),s=lt.createConvolver(),o=lt.createGain();e.gain.value=1,i.gain.value=1,r.gain.value=0,o.gain.value=0,n.buffer=t,s.buffer=t,tc.connect(e).connect(n).connect(i).connect($r),tc.connect(r).connect(s).connect(o).connect($r),Pn.wet={bus:tc,inA:e,retA:i,convA:n,inB:r,retB:o,convB:s,live:"A"},Pn.buf={},Pn.coarse=!!Et.coarse,Pn.tier=Q.tier,Zu={};for(let a of["ui","fx","room"]){let l=lt.createGain();l.connect($r);let c=lt.createGain();c.gain.value=a==="ui"?.11:.22,l.connect(c).connect(tc),Pn.bus[a]=l,Zu[a]=c}try{Pn.chain=fS(Pn,$r,Ca)}catch(a){ft("audio:chain",a),$r.connect(Ca),Pn.chain=null}Pn.bus.bed=lt.createGain(),Pn.bus.bed.connect($r)}var Ye={ctx:null,unlocked:!1,on:!0,bed:null,init(t){return Ye.on=!(Y.data&&Y.data.sound==="off"),Q.soundOn=Ye.on,ge.on("visibility",e=>{Ks=!!e.hidden,Ks?dS():Dx()}),ge.on("room:arrive",e=>Ye.setRoom(e.room)),ge.on("boot:done",()=>{mS=!0,pS()}),Ye},unlock(){if(Ye.unlocked)return;let t=window.AudioContext||window.webkitAudioContext;if(t)try{lt=new t;try{navigator.audioSession&&(navigator.audioSession.type="playback")}catch{}NI(),Ye.ctx=lt,Ye.unlocked=!0;try{Ye.bed=Rx(Pn)}catch(e){ft("audio:bed",e)}Ye.setRoom(Q.room||"CORE"),Ye.setNight(Q.night),Ye.on?(Ye.bed&&Ye.bed.start(),Dx()):lt.suspend().catch(()=>{}),fe.add(e=>{Ye.bed&&Ye.on&&Ye.bed.update(e)},jt.FX);try{Qp(Pn,["dustA"]).catch(e=>ft("audio:prerender",e))}catch(e){ft("audio:prerender",e)}pS(),ge.emit("audio:unlocked",{})}catch(e){ft("audio:unlock","audio unavailable",e)}},resume(){lt&&Ye.on&&!Ks&&lt.state!=="running"&&lt.resume().catch(()=>{})},isOn(){return Ye.on},setOn(t){let e=!!t;e!==Ye.on&&(Ye.on=e,Q.soundOn=e,Y.set("sound",e?"on":"off"),lt&&(e?(Ye.bed&&Ye.bed.start(),Dx()):(dS(),Ye.bed&&setTimeout(()=>{!Ye.on&&Ye.bed&&Ye.bed.stop()},400))),ge.emit("sound:change",{on:e}))},toggle(){Ye.setOn(!Ye.on)},play(t,e={}){if(!lt||!Ye.on||Ks)return null;let n=Ex[t];if(!n)return null;e&&e.when!=null&&(e.when=Math.max(e.when,lt.currentTime));try{return n(Pn,e||{})||null}catch(i){return ft(`audio:${t}`,"recipe failed",t,i),null}},start(t,e={}){if(!lt||!Ye.on||Ks||!iS.has(t))return Ix;e&&e.when!=null&&(e.when=Math.max(e.when,lt.currentTime));try{return Ex[t](Pn,e||{})||Ix}catch(n){return ft(`audio:${t}`,"recipe failed",t,n),Ix}},setRoom(t){let e=ce[t];!e||!lt||(Zu&&(tm(Zu.room.gain,e.wet,300),tm(Zu.fx.gain,e.wet,300)),Ye.bed&&(Ye.bed.setRoom(t),Ye.bed.duck(t==="INSIGNIA"?-60:0,960)))},setRootU(t,e,n){if(!Ye.bed)return;let i=ce[t],r=ce[e];i&&r&&Ye.bed.setRootGlide(i.root,r.root,n)},setNight(t){Pn.night=!!t,Ye.bed&&Ye.bed.setNight(!!t)},setRank(t){Ye.bed&&Ye.bed.setRank(t|0)},setInverted(t){Pn.transpose=t?-5:0},levels(t){if(t){if(!Ia||!Ye.on||Ks){t.fill(0);return}Ia.getFloatTimeDomainData(Pa);for(let e=0,n=0;e<8;e++){let i=0;for(let r=n+64;n<r;n++){let s=Math.abs(Pa[n]);s>i&&(i=s)}t[e]=i>1e-6?Math.max(0,Math.min(1,(20*Math.log10(i)+66)/60)):0}}},now(){return lt?lt.currentTime:0}};function pS(){if(!mS||!lt||hS)return;hS=!0;let t=Ta.slice(1),e=i=>typeof requestIdleCallback=="function"?requestIdleCallback(i,{timeout:300}):setTimeout(i,200),n=()=>{let i=t.shift();if(i)try{Qp(Pn,[i]).catch(r=>ft("audio:prerender",r)).then(()=>e(n))}catch(r){ft("audio:prerender",r),e(n)}};e(n)}var xS=()=>!!(lt&&Ye.unlocked&&Ye.on&&!Ks),vS=t=>Pn.chain&&Pn.chain.fx&&typeof Pn.chain.fx[t]=="function"?Pn.chain.fx[t]:null;function Nx(){if(!lt)return 0;let t=lt.outputLatency!=null?lt.outputLatency:lt.baseLatency!=null?lt.baseLatency:0;return Math.min(.25,Math.max(0,+t||0))}function yS(){try{let t=lt.getOutputTimestamp?lt.getOutputTimestamp():null;return t&&t.performanceTime>0?t:null}catch{return null}}function em(t){if(!lt)return NaN;let e=yS();return e?e.performanceTime+(t-e.contextTime)*1e3:performance.now()+(t-lt.currentTime)*1e3+1e3*Nx()}function FI(t){if(!lt)return NaN;let e=yS();return e?e.contextTime+(t-e.performanceTime)/1e3:lt.currentTime+(t-performance.now())/1e3-Nx()}function OI(){if(!Ia)return-120;try{Ia.getFloatTimeDomainData(Pa);let t=0;for(let n=0;n<Pa.length;n++)t+=Pa[n]*Pa[n];let e=Math.sqrt(t/Pa.length);return e>1e-6?Math.max(-120,20*Math.log10(e)):-120}catch{return-120}}function Uo(t,e,n){if(!xS())return n;let i=vS(t);if(!i)return n;try{let r=i.apply(Pn.chain.fx,e);return r===void 0?n:r}catch(r){return ft(`audio:fx:${t}`,r),n}}Ye.fx={latency:Nx,toPerf:em,ctxTimeFor:FI,ready:xS,gate(t=400,e={}){let n=e&&e.at!=null?e.at:lt?lt.currentTime:0,i=Uo("gate",[t,{...e||{},at:n}],null);return!i||i.hitAt==null?{hitAt:null}:(Ra.push({at:em(n),hitAt:em(i.hitAt)}),Ra.length>16&&Ra.shift(),i)},advanceHit(t){let e=Uo("advanceHit",[t],null);return e!=null&&Ra.length&&(Ra[Ra.length-1].hitAt=em(e)),e??null},muffle(t,e=0,n={}){Uo("muffle",[t,e,n||{}],void 0)},pop(t=700,e={}){let n=Uo("pop",[t,e||{}],null);return n??null},width(t,e,n={}){Uo("width",[t,e,n||{}],void 0)},tape(t=900,e={}){Uo("tape",[t,e||{}],void 0)},tapeReset(t={}){Uo("tapeReset",[t||{}],void 0)},shadow(t){Uo("shadow",[t],void 0)},snapshot(){let t=null,e=vS("snapshot");if(e)try{t=e.call(Pn.chain.fx)}catch(n){ft("audio:fx:snapshot",n)}return t=t||{},{gateLog:Ra.map(n=>({at:n.at,hitAt:n.hitAt})),muffleHz:t.muffleHz!=null?t.muffleHz:2e4,width:t.width!=null?t.width:1,buffersReady:!!t.buffersReady,rmsDb:OI()}}};var Xr=Object.freeze({tap:8,tick:6,stratum:7,lock:14,step:20,activation:[8,40,8,40,14,90,30],shard:[8,40,8,40,60],locked:[10,30,10]}),UI=6,Fx=0;function _S(t,e){let n=document.getElementById("fx");if(!n||Fx>=UI)return;let i=document.createElement("div");i.className="ripple",i.style.transform=`translate3d(${t}px, ${e}px, 0)`,Et.reducedMotion&&i.classList.add("ripple--still"),Fx++;let r=()=>{Fx--,i.remove()};i.addEventListener("animationend",r,{once:!0}),setTimeout(()=>{i.isConnected&&r()},600),n.appendChild(i)}function Yr(t){try{if(typeof navigator>"u"||typeof navigator.vibrate!="function")return;let e=navigator.userActivation;if(e&&!e.hasBeenActive)return;navigator.vibrate(t)}catch{}}var Zi=Object.freeze({TAP_MS:350,HOLD_MS:350,LONG_MS:800,SLOP_PX:8,SWIPE_PX:40,SWIPE_V:.3}),kI=60,qr=[],La=null,ic=[],Ju=[],rc=null,we={type:"down",x:0,y:0,dx:0,dy:0,tx:0,ty:0,vx:0,vy:0,speed:0,t:0,id:0,pointerType:"mouse",button:0,scale:1,dScale:1,deltaY:0,dir:null,afterHold:!1,shift:!1,alt:!1},Js={x:0,y:0,vx:0,vy:0,speed:0,type:"mouse",buttons:0,t:0},Ue={active:!1,id:-1,type:"mouse",x0:0,y0:0,t0:0,lastX:0,lastY:0,lastT:0,dragging:!1,holdFired:!1,longFired:!1,pinch:!1,moved:0,button:0},Qu=0,ef=0,wr=new Map,AS=0,Ox=0,nf=()=>typeof performance<"u"?performance.now():Date.now(),TS=t=>{let e=t&&t.timeStamp,n=nf();return e>0&&e<=n+1&&e>n-5e3?e:n},nc=null;function Gn(t,e){if(we.type=t,e&&(we.shift=!!e.shiftKey,we.alt=!!e.altKey),t!=="swipe"&&(we.dir=null),La){try{La.onGesture(we)}catch(i){ft(`input:${La.name}`,"captured consumer threw",i)}return}let n=t!=="down"&&t!=="hover"&&t!=="leave"&&t!=="wheel";if(t==="down")nc=null;else if(n&&nc){if(qr.indexOf(nc)<0)return;try{nc.onGesture(we)}catch(i){ft(`input:${nc.name}`,"consumer threw",i)}return}for(let i=qr.length-1;i>=0;i--){let r=qr[i],s=!1;try{s=!!r.onGesture(we)}catch(o){ft(`input:${r.name}`,"consumer threw",o)}if(s){t==="down"&&(nc=r);return}}}function Qs(t,e,n){we.x=e,we.y=n,we.id=t.pointerId,we.pointerType=t.pointerType||"mouse",we.button=t.button|0,we.scale=1,we.dScale=1,we.deltaY=0}function sm(){Qu&&(clearTimeout(Qu),Qu=0),ef&&(clearTimeout(ef),ef=0)}function BI(t){let e=Jt.pointer,n=TS(t),i=Math.max(1,n-(e._t||n-16)),r=(t.clientX-e.x)/i,s=(t.clientY-e.y)/i,o=1-Math.exp(-i/kI);e.x>-9e3&&(e.vx+=(r-e.vx)*o,e.vy+=(s-e.vy)*o),e._t=n,e.x=t.clientX,e.y=t.clientY,e.speed=Math.hypot(e.vx,e.vy)*1e3,e.type=t.pointerType||"mouse",e.lastMove=fe.now,e.inside=!0}function zI(t){if(!ic.length)return;let e=Jt.pointer;Js.x=e.x,Js.y=e.y,Js.vx=e.vx,Js.vy=e.vy,Js.speed=e.speed,Js.type=e.type,Js.buttons=t.buttons|0,Js.t=fe.now;for(let n=0;n<ic.length;n++)try{ic[n](Js)}catch(i){ft("input:observer","observer threw",i)}}function VI(t){if(t.pointerType==="touch"){if(wr.set(t.pointerId,{x:t.clientX,y:t.clientY}),_S(t.clientX,t.clientY),Yr(Xr.tap),wr.size===2&&Ue.active){GI(t);return}if(wr.size>2)return}if(Ue.active)return;try{t.currentTarget.setPointerCapture(t.pointerId)}catch{}let e=TS(t),n=Jt.pointer;n.x=t.clientX,n.y=t.clientY,n.vx=0,n.vy=0,n.speed=0,n._t=e,n.type=t.pointerType||"mouse",n.lastMove=fe.now,n.inside=!0,Ue.active=!0,Ue.id=t.pointerId,Ue.type=t.pointerType||"mouse",Ue.x0=Ue.lastX=t.clientX,Ue.y0=Ue.lastY=t.clientY,Ue.t0=Ue.lastT=e,Ue.dragging=!1,Ue.holdFired=!1,Ue.longFired=!1,Ue.pinch=!1,Ue.moved=0,Ue.button=t.button|0,Jt.pointer.down=!0,Qs(t,t.clientX,t.clientY),we.dx=0,we.dy=0,we.tx=0,we.ty=0,we.vx=0,we.vy=0,we.speed=0,we.t=0,we.afterHold=!1,Gn("down",t),sm(),Qu=setTimeout(()=>{Qu=0,!(!Ue.active||Ue.dragging||Ue.pinch)&&(Ue.holdFired=!0,MS(),Gn("hold",null),ef=setTimeout(()=>{ef=0,!(!Ue.active||Ue.dragging||Ue.pinch)&&(Ue.longFired=!0,MS(),Gn("longpress",null))},Zi.LONG_MS-Zi.HOLD_MS))},Zi.HOLD_MS)}function MS(){we.x=Ue.lastX,we.y=Ue.lastY,we.dx=0,we.dy=0,we.tx=Ue.lastX-Ue.x0,we.ty=Ue.lastY-Ue.y0,we.vx=0,we.vy=0,we.speed=0,we.t=nf()-Ue.t0,we.id=Ue.id,we.pointerType=Ue.type,we.button=Ue.button,we.scale=1,we.dScale=1,we.deltaY=0,we.afterHold=!0}function GI(t){sm(),Ue.dragging&&(we.t=nf()-Ue.t0,Gn("dragend",t)),Ue.pinch=!0,Ue.dragging=!1,ES(),AS=Ox=Math.max(1,Math.hypot(In.ax-In.bx,In.ay-In.by)),Qs(t,(In.ax+In.bx)/2,(In.ay+In.by)/2),we.scale=1,we.dScale=1,Gn("pinchstart",t)}var In={ax:0,ay:0,bx:0,by:0,i:0};function HI(t){In.i===0?(In.ax=t.x,In.ay=t.y):In.i===1&&(In.bx=t.x,In.by=t.y),In.i++}function ES(){In.i=0,wr.forEach(HI)}var Ux=null,rm=null,nm=!1;function WI(t){return!!t&&(t===Ux||rm!==null&&rm.contains(t))}function $I(t){if(BI(t),zI(t),t.pointerType==="touch"&&wr.has(t.pointerId)){let n=wr.get(t.pointerId);n.x=t.clientX,n.y=t.clientY}if(Ue.pinch){if(wr.size<2)return;ES();let n=Math.max(1,Math.hypot(In.ax-In.bx,In.ay-In.by));Qs(t,(In.ax+In.bx)/2,(In.ay+In.by)/2),we.scale=n/AS,we.dScale=n/Ox,Ox=n,Gn("pinch",t);return}if(!Ue.active||t.pointerId!==Ue.id){if(!Ue.active&&(t.pointerType||"mouse")==="mouse"&&(t.buttons|0)===0){if(!WI(t.target)){nm&&(nm=!1,Qs(t,t.clientX,t.clientY),Gn("leave",t));return}nm=!0,Qs(t,t.clientX,t.clientY),we.dx=t.movementX||0,we.dy=t.movementY||0,we.tx=0,we.ty=0,we.vx=Jt.pointer.vx,we.vy=Jt.pointer.vy,we.speed=Jt.pointer.speed,we.t=0,we.afterHold=!1,Gn("hover",t)}return}let e=nf();Qs(t,t.clientX,t.clientY),we.dx=t.clientX-Ue.lastX,we.dy=t.clientY-Ue.lastY,we.tx=t.clientX-Ue.x0,we.ty=t.clientY-Ue.y0,we.vx=Jt.pointer.vx,we.vy=Jt.pointer.vy,we.speed=Jt.pointer.speed,we.t=e-Ue.t0,we.afterHold=Ue.holdFired,Ue.lastX=t.clientX,Ue.lastY=t.clientY,Ue.lastT=e,Ue.moved=Math.max(Ue.moved,Math.hypot(we.tx,we.ty)),Ue.dragging?Gn("drag",t):Ue.moved>=Zi.SLOP_PX?(Ue.dragging=!0,sm(),Gn("dragstart",t),Gn("drag",t)):Gn("move",t)}function kx(t,e){let n=nf();sm(),Jt.pointer.down=!1;try{t.currentTarget&&t.currentTarget.hasPointerCapture&&t.currentTarget.hasPointerCapture(t.pointerId)&&t.currentTarget.releasePointerCapture(t.pointerId)}catch{}Qs(t,t.clientX,t.clientY),we.dx=t.clientX-Ue.lastX,we.dy=t.clientY-Ue.lastY,we.tx=t.clientX-Ue.x0,we.ty=t.clientY-Ue.y0,we.vx=Jt.pointer.vx,we.vy=Jt.pointer.vy,we.speed=Jt.pointer.speed,we.t=n-Ue.t0,we.afterHold=Ue.holdFired;let i=Ue.dragging,r=Ue.pinch;if(Ue.active=!1,Ue.dragging=!1,Ue.pinch=!1,e){Gn("cancel",t),im();return}if(r){Gn("pinchend",t),im();return}if(Gn("up",t),i){Gn("dragend",t);let s=Math.hypot(we.tx,we.ty),o=Math.hypot(we.vx,we.vy);s>=Zi.SWIPE_PX&&o>=Zi.SWIPE_V&&(we.dir=Math.abs(we.tx)>=Math.abs(we.ty)?we.tx>0?"right":"left":we.ty>0?"down":"up",Gn("swipe",t))}else!Ue.holdFired&&we.t<Zi.TAP_MS&&Ue.moved<Zi.SLOP_PX&&Gn("tap",t);im()}function im(){La=null}function XI(t){if(t.pointerType==="touch"){wr.delete(t.pointerId);try{Ye.resume()}catch{}if(Ue.pinch){wr.size<2&&Ue.active&&(wr.size===0||t.pointerId===Ue.id?kx(t,!1):(Qs(t,t.clientX,t.clientY),Gn("pinchend",t),Ue.pinch=!1,Ue.active=!1,Jt.pointer.down=!1,im()));return}}!Ue.active||t.pointerId!==Ue.id||kx(t,!1)}function YI(t){t.pointerType==="touch"&&wr.delete(t.pointerId),Ue.active&&(t.pointerId!==Ue.id&&!Ue.pinch||(wr.clear(),kx(t,!0)))}function qI(t){t.preventDefault();let e=t.deltaY;t.deltaMode===1?e*=16:t.deltaMode===2&&(e*=be.h||800),we.x=t.clientX,we.y=t.clientY,we.dx=0,we.dy=0,we.tx=0,we.ty=0,we.vx=0,we.vy=0,we.speed=0,we.t=0,we.id=0,we.pointerType="mouse",we.button=0,we.scale=1,we.dScale=1,we.deltaY=e,we.afterHold=!1,Gn("wheel",t)}function jI(t){t.relatedTarget||(Jt.pointer.inside=!1,nm=!1,Qs(t,t.clientX,t.clientY),Gn("leave",t))}function bS(t){!t||t.__samvinInput||(t.__samvinInput=!0,t.addEventListener("pointerdown",VI),t.addEventListener("pointerup",XI),t.addEventListener("pointercancel",YI),t.addEventListener("wheel",qI,{passive:!1}),t.addEventListener("contextmenu",e=>e.preventDefault()))}var SS={name:"hall",onGesture(t){let e=rc&&rc.halls;if(!e||typeof e.current!="function")return!1;let n=e.current();return n?!!e.call(n.id,"onGesture",t):!1}},ZI={name:"director",onGesture(t){let e=rc&&rc.director;if(!e||typeof e.busy!="function"||!e.busy())return!1;let n=e.state,i=rc.halls;return n&&n.u>=.7&&n.to&&i&&typeof i.call=="function"&&i.call(n.to.room,"onGesture",t)||t.type==="tap"&&typeof e.speedUp=="function"&&e.speedUp(),!0}},tf=[];function wS(t,e,n,i){if(!tf.length)return;let r={x:t,y:e,type:n,target:i||null,t:performance.now()},s=tf.slice();for(let o=0;o<s.length;o++)try{s[o](r)}catch(a){ft("input:downobserver","down observer threw",a)}}var Jt={pointer:{x:-9999,y:-9999,vx:0,vy:0,speed:0,type:"mouse",down:!1,lastMove:0,inside:!1},init(t){rc=t,Ux=document.getElementById("gl"),rm=document.getElementById("t0"),bS(Ux),bS(rm),window.addEventListener("pointermove",$I,{passive:!0}),document.addEventListener("pointerout",jI);let e=()=>{try{Ye.unlock()}catch(n){ft("input:unlock",n)}};window.addEventListener("pointerdown",e,{capture:!0,passive:!0}),window.addEventListener("touchend",()=>{try{Ye.resume()}catch{}},{passive:!0}),document.addEventListener("pointerdown",n=>{wS(n.clientX,n.clientY,n.pointerType==="touch"||n.pointerType==="pen"?n.pointerType:"mouse",n.target instanceof Element?n.target:null)},{capture:!0,passive:!0}),window.addEventListener("keydown",n=>{e();let i=n.target;if(!(i&&(i.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(i.tagName||"")))){wS(Jt.pointer.x,Jt.pointer.y,"key",i instanceof Element?i:null);for(let r=0;r<Ju.length;r++)try{Ju[r](n)}catch(s){ft("input:keyobserver","key observer threw",s)}}},{capture:!0}),qr.includes(SS)||(qr.unshift(ZI),qr.unshift(SS))},push(t){return qr.push(t),()=>{let e=qr.indexOf(t);e>=0&&qr.splice(e,1)}},offerKey(t){for(let e=qr.length-1;e>=0;e--){let n=qr[e];if(typeof n.onKey=="function")try{if(n.onKey(t))return!0}catch(i){ft(`input:${n.name}:key`,"key consumer threw",i)}}return!1},capture(t){La=t},release(t){(!t||La===t)&&(La=null)},observe(t){return ic.push(t),()=>{let e=ic.indexOf(t);e>=0&&ic.splice(e,1)}},observeDown(t){return typeof t!="function"?()=>{}:(tf.push(t),()=>{let e=tf.indexOf(t);e>=0&&tf.splice(e,1)})},observeKeys(t){return Ju.push(t),()=>{let e=Ju.indexOf(t);e>=0&&Ju.splice(e,1)}}};function RS(t,e,n){kt.enabled=!1;let i=Xi[n]||Xi.T2,r=new hp({canvas:t,context:e||void 0,antialias:!!i.msaa,alpha:!0,premultipliedAlpha:!0,depth:!0,stencil:!1,powerPreference:"high-performance",preserveDrawingBuffer:!1});r.outputColorSpace=fa,r.toneMapping=ar,r.setClearColor(0,0),r.info.autoReset=!1,r.autoClear=!0,r.debug.checkShaderErrors=!1;let s=new Vs;s.background=null,s.matrixWorldAutoUpdate=!0;let o=new yi(ct.fov,Math.max(1,be.w)/Math.max(1,be.h),.01,1e3);o.position.set(0,.75,7.2);let a=i.dprCap,l=0,c=new WeakSet,u=0,f={three:r,scene:s,camera:o,tier:n,dpr:1,stats:{calls:0,triangles:0,points:0,geometries:0,textures:0,frameMs:0,fps:0},setDprDrop(d){u=Math.max(0,d|0),f.resize()},setTier(d){f.tier=d,a=(Xi[d]||i).dprCap,f.resize()},resize(){let d=typeof devicePixelRatio=="number"&&devicePixelRatio>0?devicePixelRatio:1;f.dpr=Math.max(1,Math.min(d,a)-on.dprStep*u);let g=Math.max(1,be.w),x=Math.max(1,be.h);r.setPixelRatio(f.dpr),r.setSize(g,x,!1),o.aspect=g/x,o.updateProjectionMatrix(),ae.uPixelRatio.value=f.dpr,ae.uResolution.value.set(Math.round(g*f.dpr),Math.round(x*f.dpr));for(let p of h)p(f)},pinPrograms(){let d=r.info.programs;if(!(!d||d.length===l)){for(let g=l;g<d.length;g++)d[g].usedTimes++;l=d.length}},warm(d,g,x){r.compile(d,g,x||d),d.traverse(M=>{let S=M.material?Array.isArray(M.material)?M.material:[M.material]:null;if(S)for(let E of S){let y=r.properties.get(E).currentProgram;y&&!c.has(y)&&(c.add(y),y.getUniforms(),y.getAttributes())}}),f.pinPrograms();let p=r.getContext(),m=r.getRenderTarget(),_=r.autoClear,w=g.layers.mask,v=d.parent;try{r.setRenderTarget(f.sceneTarget||null),r.autoClear=!1,r.setScissorTest(!0),r.setScissor(0,0,1,1),g.layers.enableAll(),r.render(d,g)}finally{r.setScissorTest(!1),r.autoClear=_,r.setRenderTarget(m),g.layers.mask=w,v&&d!==x&&d.updateWorldMatrix(!0,!0)}p.finish()},sceneTarget:null,onResize(d){return h.add(d),()=>h.delete(d)},lost:!1},h=new Set;return t.addEventListener("webglcontextlost",d=>{d.preventDefault(),f.lost=!0,fe.stop(),ge.emit("gl:lost",{})},!1),t.addEventListener("webglcontextrestored",()=>{f.lost=!1,f.resize(),ge.emit("gl:restored",{}),fe.start()},!1),ge.on("layout:change",()=>f.resize()),f.resize(),f}var KI=`
varying vec2 vUv;
void main() { vUv = position.xy * 0.5 + 0.5; gl_Position = vec4(position.xy, 0.0, 1.0); }`,CS=`
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
}`,PS=`
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
}`;function Bx(){let t=new Dn;return t.setAttribute("position",new Zt(new Float32Array([-1,-1,0,3,-1,0,-1,3,0]),3)),t}function IS(t,e=on.r6.levels){let n=t.three||t,i=Bx(),r=new Vs,s=new Ws(-1,1,1,-1,0,1),o=(v,M,S)=>new $t({uniforms:{tSrc:{value:null},uHalf:{value:new xt},uThreshold:{value:on.r6.threshold},tAdd:{value:null},uAddGain:{value:1}},defines:Object.assign(M?{USE_THRESHOLD:""}:{},S?{USE_ADD:""}:{}),vertexShader:KI,fragmentShader:v,depthTest:!1,depthWrite:!1,blending:Wi}),a=o(CS,!0),l=o(CS,!1),c=o(PS,!1,!0),u=o(PS,!1,!1),f=new nn(i,l);f.frustumCulled=!1,r.add(f);let h={type:Mi,format:li,minFilter:Wt,magFilter:Wt,depthBuffer:!1},d=[],g=[],x=0,p=0;function m(v,M){_(),x=v,p=M;let S=v,E=M;for(let y=0;y<e;y++){S=Math.max(1,S>>1),E=Math.max(1,E>>1);let A=new Yn(S,E,h);d.push(A)}for(let y=0;y<e;y++){let A=y===0?{width:v,height:M}:d[y-1],T=new Yn(A.width,A.height,h);g.push(T)}}function _(){for(let v of d.concat(g))v.dispose();d.length=0,g.length=0}function w(v,M,S,E,y){f.material=v,v.uniforms.tSrc.value=M,v.uniforms.uHalf.value.set(.5/S,.5/E),n.setRenderTarget(y),n.render(r,s)}return{render(v){if(!d.length)return null;let M=v,S=x,E=p;for(let y=0;y<e;y++)w(y===0?a:l,M,S,E,d[y]),M=d[y].texture,S=d[y].width,E=d[y].height;for(let y=e-1;y>=0;y--){let A=y>0?c:u;y>0&&(A.uniforms.tAdd.value=d[y-1].texture),w(A,M,S,E,g[y]),M=g[y].texture,S=g[y].width,E=g[y].height}return g[0].texture},resize(v,M){(v!==x||M!==p)&&m(Math.max(2,v|0),Math.max(2,M|0))},dispose(){_(),i.dispose(),a.dispose(),l.dispose(),c.dispose(),u.dispose()}}}var sc=on.r7,LS="void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }",DS=`
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
  g *= smoothstep(${sc.clearInPx.toFixed(1)}, ${sc.clearOutPx.toFixed(1)}, distance(css, uPointer));
  float aspect = uRes.x / uRes.y;
  vec2 c = (uv * 2.0 - 1.0) * vec2(aspect, 1.0);
  float v = uVig * smoothstep(${sc.vignetteFrom.toFixed(2)}, 1.0, length(c) / length(vec2(aspect, 1.0)));
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
}`,om=120;function NS(t){let e=t.three,n=t.scene,i=t.camera,r=new Vs,s=new Ws(-1,1,1,-1,0,1),o={uRes:{value:new xt(1,1)},uPR:{value:1},uGrain:{value:sc.grainBoot},uSeed:{value:0},uVig:{value:sc.vignette},uPointer:{value:new xt(-9999,-9999)},tScene:{value:null},tBloom:{value:null},uBloom:{value:1}},a=new $t({uniforms:o,vertexShader:LS,fragmentShader:DS,depthTest:!1,depthWrite:!1,transparent:!0,blending:yd,blendEquation:$s,blendSrc:gu,blendDst:Il,blendSrcAlpha:gu,blendDstAlpha:Il}),l=new $t({uniforms:o,defines:{USE_SCENE:""},vertexShader:LS,fragmentShader:DS,depthTest:!1,depthWrite:!1,blending:Wi}),c=new nn(Bx(),a);c.frustumCulled=!1,r.add(c);let u=t.tier,f=null,h=null,d=null,g=[],x=!0;function p(){t.sceneTarget=null,f&&(f.dispose(),f=null),h&&(h.dispose(),h=null),d&&(d.dispose(),d=null)}function m(){if(u!=="T3"){p();return}let F=o.uRes.value.x,z=o.uRes.value.y;f?(f.setSize(F,z),h.setSize(Math.max(2,F>>1),Math.max(2,z>>1))):(f=new Yn(F,z,{type:Mi,format:li,samples:4,depthBuffer:!0,minFilter:Wt,magFilter:Wt}),h=new Yn(Math.max(2,F>>1),Math.max(2,z>>1),{type:Mi,format:li,depthBuffer:!0,minFilter:Wt,magFilter:Wt}),d=IS(t,on.r6.levels)),t.sceneTarget=f,d.resize(h.width,h.height)}function _(){let F=e.getDrawingBufferSize(new xt);o.uRes.value.copy(F),o.uPR.value=t.dpr,m()}t.onResize(_),_();let w=new Float32Array(om),v=new Float32Array(om),M=0,S=0,E=-1,y=1<<Si.DEFAULT|1<<Si.NOFOG,A=1<<Si.EMISSIVE,T=!1,I={render(F){if(t.lost)return;T||(o.uSeed.value=Et.reducedMotion?7:Math.floor(fe.now/(1e3/sc.grainFps))%997);let z=Jt.pointer,L=z.x<-9e3||z.inside===!1||z.type==="touch"&&!z.down;o.uPointer.value.set(L?-9999:z.x,L?-9999:z.y),e.info.reset(),e.autoClear=!1,u==="T3"&&f?(i.layers.mask=y,e.setRenderTarget(f),e.setClearColor(0,0),e.clear(!0,!0,!1),e.render(n,i),t.stats.points=e.info.render.points,i.layers.mask=A,e.setRenderTarget(h),e.clear(!0,!0,!1),ae.uEmissivePass.value=1,e.render(n,i),ae.uEmissivePass.value=0,i.layers.mask=y,o.tBloom.value=d.render(h.texture),o.tScene.value=f.texture,c.material=l,e.setRenderTarget(null),e.render(r,s)):(i.layers.mask=y,e.setRenderTarget(null),e.setClearColor(0,0),e.clear(!0,!0,!1),e.render(n,i),t.stats.points=e.info.render.points,c.material=a,e.render(r,s)),t.pinPrograms();let V=t.stats,G=e.info;V.calls=G.render.calls,V.triangles=G.render.triangles,V.geometries=G.memory.geometries,V.textures=G.memory.textures;let P=fe.now;if(E>=0&&(w[S]=P-E,S=(S+1)%om,M<om&&M++,(fe.frame&15)===0&&M>0)){for(let k=0;k<M;k++)v[k]=w[k];let O=v.subarray(0,M);O.sort(),V.frameMs=O[M>>1],V.fps=V.frameMs>0?1e3/V.frameMs:0}if(E=P,x){x=!1;let O=document.getElementById("ff-grain");O&&O.parentNode&&O.parentNode.removeChild(O);for(let k of g)try{k()}catch{}g.length=0}},setGrain(F){o.uGrain.value=Math.max(0,+F||0)},freezeGrain(F){T=!!F},setTier(F){u=F,m()},onFirstFrame(F){if(x)g.push(F);else try{F()}catch{}},get tier(){return u},uniforms:o};return ge.on("tier:change",({tier:F})=>I.setTier(F)),I}var ys=[0,0,0],oc=null;function zx(t){for(let e=0;e<Dc.length;e++){let n=Dc[e];Qf(n,t,ys),ae[mp(n)].value.setRGB(ys[0],ys[1],ys[2])}}function FS(t){let e="#";for(let n=0;n<3;n++)e+=Math.round(t[n]*255).toString(16).padStart(2,"0").toUpperCase();return e}function JI(t){if(typeof document>"u")return;let e=document.documentElement.style;for(let n=0;n<Dc.length;n++){let i=Dc[n];if(t<=0){e.removeProperty(Nc[i]),e.removeProperty(Nc[i]+"-rgb");continue}Qf(i,t,ys),e.setProperty(Nc[i],FS(ys)),e.setProperty(Nc[i]+"-rgb",`${Math.round(ys[0]*255)},${Math.round(ys[1]*255)},${Math.round(ys[2]*255)}`)}}var ko={mode:{night:!1,inverted:0},init(){zx(ko.mode.inverted)},setNight(t){let e=!!t;if(typeof document<"u"&&(e?document.documentElement.setAttribute("data-night",""):document.documentElement.removeAttribute("data-night")),e===ko.mode.night&&!oc){ae.uNight.value=e?1:0;return}ko.mode.night=e,oc&&oc.cancel();let n=ae.uNight.value,i=e?1:0;oc=ti(es.mixMs,r=>{ae.uNight.value=n+(i-n)*r}),oc.done.then(()=>{oc=null})},setInverted(t){let e=Math.max(0,Math.min(1,+t||0));ko.mode.inverted=e,ae.uInvert.value=e,zx(e),JI(e),typeof document<"u"&&(e>=.5?document.documentElement.setAttribute("data-inverted",""):document.documentElement.removeAttribute("data-inverted"))},color(t){return(ae[mp(t)]||ae.cSilver).value},hex(t){return Qa[t]?FS(Qf(t,ko.mode.inverted,ys)):Qa.silver}};zx(0);var of=on.r5,zS=of.elevationDeg*Math.PI/180,QI=Math.cos(zS),eL=Math.sin(zS),Vx=Math.PI*2,am=new C(0,0,0),Gx=It.radius,OS=new C,rf=!1,ac=Math.PI*.75,Hx=-.7,Wx=.7,$x=0,Xx=0,lm=new C,cm=new C,Da=1,Yx="",US=new C,kS=new C,sf=new C,BS=new C,ur={position:ae.uLamp.value,mode:"sweep",ctx:null,init(t){return ur.ctx=t,ur.setFocus(am.set(0,0,0),It.radius),ur},setFocus(t,e){am.copy(t),Gx=e??Gx},hold(t){t?(OS.copy(t),rf||(lm.copy(ur.position),Da=0),rf=!0):rf&&(rf=!1,lm.copy(ur.position),Da=0)},sweepOnce(t){Xx=Math.max(200,t||1200),$x=fe.now+Xx},update(t){let e=Pe.camera;if(!e)return;let n=Jt.pointer,i=n.type==="touch"||be.isPhone,r;fe.now<$x?r="sweep":i?r=n.down?"finger":"sweep":r=n.inside!==!1&&n.x>-9e3&&fe.now-n.lastMove<of.idleMs?"pointer":"sweep",r!==Yx&&(Yx&&(lm.copy(ur.position),Da=0),r==="sweep"&&(ac=Math.atan2(Wx,Hx)),Yx=r),ur.mode=r,US.setFromMatrixColumn(e.matrixWorld,0),kS.setFromMatrixColumn(e.matrixWorld,1),sf.copy(e.position).sub(am),sf.lengthSq()<1e-12?sf.setFromMatrixColumn(e.matrixWorld,2):sf.normalize();let s,o;if(r==="sweep"){let l=fe.now<$x?Xx:of.sweepMs;ac+=Vx*t*1e3/l,ac>Vx&&(ac-=Vx),s=Math.cos(ac),o=Math.sin(ac)}else{let l=n.x/Math.max(1,be.w)*2-1,c=-(n.y/Math.max(1,be.h))*2+1,u=Math.hypot(l,c);u>1e-4&&(Hx=l/u,Wx=c/u),s=Hx,o=Wx}BS.copy(US).multiplyScalar(s).addScaledVector(kS,o).normalize();let a=of.radiusFactor*Gx;cm.copy(am).addScaledVector(BS,a*QI).addScaledVector(sf,a*eL),rf&&cm.copy(OS),Da<1?(Da=Math.min(1,Da+t*1e3/of.blendMs),ur.position.copy(lm).lerp(cm,An.reveal(Da))):ur.position.copy(cm)}};var lc=Math.PI*2,tL=kn.irisBladeDeg*Math.PI/180;function VS(t,e,n,i){for(let r=0;r<e;r++){let s=lc*r/e-Math.PI/e,o=s+lc/e;t.push(Math.sin(s)*n,i,Math.cos(s)*n,Math.sin(o)*n,i,Math.cos(o)*n)}}var nL=t=>Ft(t/1e3)*1e3;function GS(t,e){let n=kn.irisBlades*2+28,i=new Float32Array(n*6),r=ui({segments:i,color:"silver",alpha:.42,far:e}),s=kn.irisR,o=0;function a(l){let c=0,u=(f,h,d,g)=>{i[c++]=f,i[c++]=t,i[c++]=h,i[c++]=d,i[c++]=t,i[c++]=g};for(let f=0;f<kn.irisBlades;f++){let h=lc*f/kn.irisBlades,d=lc*(f+1)/kn.irisBlades,g=s*(.06+.94*l),x=h+Math.PI/kn.irisBlades+tL*(1-l),p=Math.sin(x)*g,m=Math.cos(x)*g;u(Math.sin(h)*s,Math.cos(h)*s,p,m),u(p,m,Math.sin(d)*s,Math.cos(d)*s)}for(let f=0;f<28;f++){let h=lc*f/28,d=lc*(f+1)/28;u(Math.sin(h)*s,Math.cos(h)*s,Math.sin(d)*s,Math.cos(d)*s)}r.setSegments(i)}return a(0),{object:r.mesh,lines:r,get open(){return o},set(l){let c=Math.max(0,Math.min(1,l));c!==o&&(o=c,a(c))}}}function HS(t){let e=ce[t]||ce.CORE,n=e.n,i=new mn;i.name=`shell:${e.id}`;let r=e.floor-e.alt,s=e.ceil-e.alt,o=e.id==="CORE",a=e.far,l=[];for(let[m,_]of[[r,e.floor],[s,e.ceil]]){let w=o?300:nL(_);for(let v=kn.ringStep;v<w-1;v+=kn.ringStep)VS(l,n,v,m)}let c=ui({segments:new Float32Array(l.length?l:[0,0,0,0,0,0]),color:"steel",alpha:l.length?1:0,far:a,flatten:!0});c.mesh.name="rings",i.add(c.mesh);let u=null;if(!o){let m=[],_=[];for(let w=kn.deckRingStep;w<=kn.deckR+1e-6;w+=kn.deckRingStep){VS(m,n,w,0);for(let v=0;v<n;v++)_.push(1-.75*(w/kn.deckR))}u=ui({segments:new Float32Array(m),alpha:new Float32Array(_),color:"steel",far:a,flatten:!0}),u.mesh.name="deck",i.add(u.mesh)}let f=GS(s,a),h=GS(r,a);i.add(f.object,h.object);let d=1,g=!0,x={rings:l.length?1:0,deck:1,iris:.42};return{group:i,rings:c,deck:u,irisTop:f,irisBottom:h,setDeckVisible(m){g=!!m,u&&(u.mesh.visible=g&&d>0)},setIris(m,_){(m==="top"?f:h).set(_)},setFlatten(m,_){c.setFlatten(m,_),u&&u.setFlatten(m,_)},setAlpha(m){d=Math.max(0,Math.min(1,m)),c.setAlpha(x.rings*d),u&&(u.setAlpha(x.deck*d),u.mesh.visible=g&&d>0),f.lines.setAlpha(x.iris*d),h.lines.setAlpha(x.iris*d)},dispose(){c.dispose(),u&&u.dispose(),f.lines.dispose(),h.lines.dispose(),i.parent&&i.parent.remove(i)}}}var iL=`
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
}`,rL=`
${Oi}
${Gr}
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
}`;function WS(){let t=new mn;t.name="axisPillar";let e=12,n=[],i=1200,r=50;for(let d=-i;d<i;d+=r){let g=d,x=Math.min(i,d+r);x<=-e||g>=e?n.push(0,g,0,0,x,0):(g<-e&&n.push(0,g,0,0,-e,0),x>e&&n.push(0,e,0,0,x,0))}let s=ui({segments:new Float32Array(n),color:"ember",width:2,alpha:.5,glint:.4,far:4e3});s.mesh.name="pillarRibbon",t.add(s.mesh);let o=new fu(kn.beadR,0),a=new $t({uniforms:{uColor:wi("silver"),uBase:wi("obsidian"),cWhite:ae.cWhite,uLamp:ae.uLamp,uAlpha:{value:1},uFlash:{value:0},cAbyss:ae.cAbyss,uFogDensity:ae.uFogDensity,...Hr()},vertexShader:iL,fragmentShader:rL}),l=new su(o,a,kn.beadCount);l.name="pillarBeads";let c=new Ct,u=new Li,f=new C,h=new C;for(let d=0;d<kn.beadCount;d++){let g=-i+kn.beadStep*d;f.set(0,g,0),h.setScalar(Math.abs(g)<e?0:1),l.setMatrixAt(d,c.compose(f,u,h))}return l.instanceMatrix.needsUpdate=!0,l.frustumCulled=!1,t.add(l),t.userData.ribbon=s,t.userData.beads=l,t.userData.uniforms={ribbon:s.uniforms,beads:a.uniforms},t}var af=new pu,lf=[];var iV=new C;function $S(t,e,n,i){if(!Pe.camera||!n||!n.length)return null;Pe.ray(t,e,af.ray),af.near=Pe.camera.near,af.far=Pe.camera.far,af.layers.mask=4294967295,lf.length=0,af.intersectObjects(n,!0,lf);let r=null;for(let s=0;s<lf.length;s++){let o=lf[s];if(sL(o.object)){r=o;break}}return lf.length=0,r?i?(Object.assign(i,r),i):r:null}function sL(t){for(let e=t;e;e=e.parent)if(!e.visible)return!1;return!0}var um=Math.PI*2,qx=t=>po.sign.replace("{px}",String(Math.max(4,Math.round(t)))),oL=[.6,.9,.9,0,.9,.9,.6],aL=[.7,.5,.5,.5,.5,.5,.44];function lL(t,e,n,i,r){if(t.fillStyle=t.strokeStyle="#fff",Fc[i]==="•"){let l=It.sign.heightFrac*Dt[3].height,c=e/l,u=(It.apertureD/2+.0045)*c,f=It.ringEngraveW*c;t.lineWidth=r?1:Math.max(1.5,f);for(let h of r?[u-f/2,u+f/2]:[u])t.beginPath(),t.arc(e/2,n/2,h,0,um),t.stroke();return}let s=oL[i]*n;t.font=qx(s*1.38),t.textAlign="center",t.textBaseline="alphabetic";let o=t.measureText(Fc[i]),a=aL[i]*n+((o.actualBoundingBoxAscent||s)-(o.actualBoundingBoxDescent||0))/2;r?(t.lineWidth=1,t.strokeText(Fc[i],e/2,a)):t.fillText(Fc[i],e/2,a)}var jx=[];for(let t=1;t<=7;t++)jx.push([0,t]),jx.push([t,t%7+1]);function cL(t,e,n,i,r,s){let o=Is(r*7919+17),a=3+Math.floor(o()*3),l=jx.slice(),c=e+n/2,u=i/2,f=n*.34,h=i*.36,d=g=>g===0?[c,u]:[c+Math.sin(um*(g-1)/7+Math.PI/7)*f,u-Math.cos(um*(g-1)/7+Math.PI/7)*h];t.beginPath();for(let g=0;g<a;g++){let[x,p]=l.splice(Math.floor(o()*l.length),1)[0],m=d(x),_=d(p);t.moveTo(m[0],m[1]),t.lineTo(_[0],_[1])}t.lineWidth=s?.75:Math.max(1,i*.07),t.lineCap="round",t.stroke()}function uL(t,e,n,i){t.strokeStyle="#fff";let r=e/64;for(let s=0;s<64;s++)cL(t,s*r,r,n,s,i)}function fL(t,e,n,i){t.fillStyle="#fff";let r=It.ticksPerFace;for(let s=0;s<r;s++){let o=(s+.5)/r*e,a=(s%3===1?.95:.7)*n;i?t.fillRect(Math.round(o),0,1,a):t.fillRect(o-1,0,2,a)}}function hL(t,e,n,i,r){let s=Ps(i);if(!s.length)return;let o=e*.62,a=(e-o)/2,l=(n-o)/2,c=o/6;t.strokeStyle=t.fillStyle="#fff",t.lineCap=t.lineJoin="round",t.lineWidth=r?1:Math.max(1.5,e*.026),t.beginPath();for(let[f,h]of s)t.moveTo(a+f%7*c,l+Math.floor(f/7)*c),t.lineTo(a+h%7*c,l+Math.floor(h/7)*c);if(t.stroke(),r)return;let u=new Set;for(let f of s)u.add(f[0]),u.add(f[1]);for(let f of u)t.beginPath(),t.arc(a+f%7*c,l+Math.floor(f/7)*c,t.lineWidth*.85,0,um),t.fill()}function dL(t,e,n,i,r,s){t.fillStyle=t.strokeStyle="#fff";let o=n*.75*1.38,a=1;t.font=qx(o);let l=t.measureText(i).width;l>e*.98&&(a=e*.98/l,o*=a,t.font=qx(o)),fx[s]=a,t.textAlign="center",t.textBaseline="alphabetic";let c=t.measureText(i),u=n/2+((c.actualBoundingBoxAscent||o*.72)-(c.actualBoundingBoxDescent||0))/2;r?(t.lineWidth=1,t.strokeText(i,e/2,u)):t.fillText(i,e/2,u)}var cf=t=>({height:(e,n,i)=>t(e,n,i,!1),inlay:(e,n,i)=>t(e,n,i,!0)}),eo={paintStatic(){for(let t=0;t<7;t++)Kt.draw(`sign:${t}`,cf((e,n,i,r)=>lL(e,n,i,t,r)));Kt.draw("frieze",cf(uL)),Kt.draw("ticks",cf(fL))},paintGlyph(t){Kt.draw("glyph:back",cf((e,n,i,r)=>hL(e,n,i,t,r)))},paintLaw(t,e){let n=performance.now();return fx[t]=1,Kt.draw(`code:${t}`,cf((r,s,o,a)=>{e&&dL(r,s,o,e,a,t)})),performance.now()-n}};var pL=`
varying vec3 vN;
void main() { vN = normal; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,mL=`
uniform vec3 uColor, cElectrum, cWhite, uHot; uniform float uNight, uNightMix, uI, uFlash, uEmissivePass, uGlowVis;
varying vec3 vN;
void main() {
  vec3 c = mix(uColor, cElectrum, uNight * uNightMix);
  float k = uI * mix(1.0, ${es.nucleusIntensity.toFixed(2)}, uNight * uNightMix);
  k *= 1.0 + ${oi.hotGain.toFixed(2)} * smoothstep(-0.15, 0.55, dot(normalize(vN), uHot));   // the hot side
  k *= mix(1.0, uGlowVis, uEmissivePass);   // the T3 bloom source obeys the visibility rule like the sprite
  gl_FragColor = vec4(mix(c * k, cWhite, uFlash), 1.0);
}`,gL=Math.cos(oi.apertureAlignDeg[0]*Math.PI/180),xL=Math.cos(oi.apertureAlignDeg[1]*Math.PI/180),Zx=new C,XS=new C,uf=new C,cc=new C,YS=new Ct;function qS(t,e,n){let i={uColor:{value:ae.cEmber.value},cElectrum:ae.cElectrum,cWhite:ae.cWhite,uNight:ae.uNight,uNightMix:{value:1},uI:{value:1},uFlash:{value:0},uEmissivePass:ae.uEmissivePass,uGlowVis:{value:1},uHot:{value:new C(0,0,1)}},r=new nn(new da(oi.r,oi.detail),new $t({uniforms:i,vertexShader:pL,fragmentShader:mL}));r.name="nucleus",r.userData.stratum=3;let s=wp({color:"ember",radius:oi.glowR,intensity:1,core:r,depthTest:!1,night:!0,nightIntensity:es.nucleusIntensity,fog:!1,renderOrder:6});t.add(s.object);let o=48,a=new Float32Array(o*6),l=oi.breathRingR;for(let f=0;f<o;f++){let h=f/o*Math.PI*2,d=(f+1)/o*Math.PI*2;a.set([Math.cos(h)*l,Math.sin(h)*l,n,Math.cos(d)*l,Math.sin(d)*l,n],f*6)}let c=ui({segments:a,color:"ember",width:1,alpha:.8,glint:0});c.mesh.visible=!1,e.add(c.mesh);let u={mesh:r,glow:s,ring:c,on:!0,ringOn:!1,pulse:1,morph:1,level:null,reveal:1,flashFrames:0,tokenUntil:0,yawnUntil:0,setToken(f){i.uColor.value=f==="white"?ae.cWhite.value:f==="electrum"?ae.cElectrum.value:ae.cEmber.value,s.setColor(f==="white"?"white":f==="electrum"?"electrum":"ember")},ignite(f,h){u.on=!0,u.flashFrames=h===!1?0:1,u.tokenUntil=0,u.setToken(f==="electrum"?"electrum":"ember")},flash(f,h,d){u.setToken(f==="white"?"white":"electrum"),u.tokenUntil=d+Math.max(16,h||0)},yawn(f){u.yawnUntil=f+es.yawnMs},update(f,h,d,g,x){u.tokenUntil&&h>u.tokenUntil&&(u.tokenUntil=0,u.setToken("ember"));let p=h<u.yawnUntil;i.uNightMix.value=p?0:1,s.uniforms.uNightMix.value=p?0:1;let m=u.on?(f?Sn.mix(oi.intensity[0],oi.intensity[1]):1)*u.pulse*u.morph:0;u.level!=null&&(m=u.level),i.uI.value=m,i.uFlash.value=u.flashFrames>0?1:0,s.setFlash(i.uFlash.value),u.flashFrames>0&&u.flashFrames--;let _=oi.minVisibility,w=7.2,v=0,M=0,S=Pe.camera;if(S){XS.set(0,0,1).transformDirection(x),Zx.copy(S.position).sub(g);let A=x.elements;w=Zx.length()/Math.max(1e-9,Math.hypot(A[0],A[1],A[2])),v=Mr(gL,xL,Zx.normalize().dot(XS)),M=Mr(oi.gapOpen[0],oi.gapOpen[1],d),_=Math.max(_,v,M)}let E=0;if(S&&v>0&&(YS.copy(x).invert(),uf.copy(S.position).applyMatrix4(YS),uf.z>n+.05)){let A=n/(uf.z-n);cc.set(-uf.x*A,-uf.y*A,0),E=v*(1-M)*Mr(1.6,3.2,w)*(1-Mr(.07,.15,cc.length()));let T=cc.length(),I=oi.r*.75;T>I&&cc.multiplyScalar(I/T),E>0&&cc.multiplyScalar(E).applyMatrix4(x)}E>0?t.worldToLocal(s.sprite.position.copy(cc)):s.sprite.position.set(0,0,0);let y=ae.uPxPerUnit.value>1?ae.uPxPerUnit.value:1427;if(s.setRadius(Math.min(oi.glowR,26*w/y)),s.setIntensity(m*_*u.reveal*(1-.45*E)),i.uGlowVis.value=_*u.reveal,c.mesh.visible){let A=Sn.mix(0,1);c.mesh.scale.setScalar(1+.04*A),c.setAlpha((.55+.35*A)*u.reveal)}},setHot(f,h,d){i.uHot.value.set(f,h,d)},setRing(f){u.ringOn=!!f,c.mesh.visible=u.ringOn&&u.reveal>0}};return u}var vL=`
${Gr}
attribute vec4 aG; attribute vec4 aM; attribute vec4 aPT;
uniform float uPlaneY[7]; uniform vec3 uRo[4]; uniform vec3 uRd[4]; uniform float uRw[4];
uniform float uKep, uT, uSpiral, uScatter, uShiver, uShell, uPlate, uFromRing, uStepT, uDelayMax, uTravel, uArc, uStagger,
  uWarm, uCool, uHalf, uFall, uReform, uMarks, uPairs, uGap, uPixelRatio, uA, uRev;
uniform vec4 uNM; uniform mat4 uPlateM;
uniform vec3 cSilver, cWhite, cEmber, cEmberDeep;
varying vec3 vCol; varying float vA; varying float vPx; varying float vDist; varying float vCoc; varying float vSaved;
float field(vec2 q, vec2 nm) {
  q = clamp(q, -1.0, 1.0) * 3.14159265;
  return cos(nm.x * q.x) * cos(nm.y * q.y) - cos(nm.y * q.x) * cos(nm.x * q.y);
}
void main() {
  float r = aG.y, th = aG.z, s = aG.w, k = aM.x, a = 1.0, px = aM.w, sv = 0.0;
  vec3 col = cSilver;
  if (k >= 0.0) {                                           // saved grains (A5.1) and couples (A11.4)
    float singles = min(uMarks, 64.0), total = min(64.0, singles + 2.0 * uPairs);
    if (k < total) {
      if (k >= singles && mod(k - singles, 2.0) > 0.5) { r = aM.y; th = aM.z + 0.0349066; }
      col = cWhite; sv = 1.0; px = 2.6;
    }
  }
  float rr = r * (1.0 - uSpiral) * (1.0 + 0.25 * (1.0 - uReform));
  float ang = th + 0.06 * pow(max(r, 0.05), -1.5) * uKep;
  vec3 ring = vec3(sin(ang) * rr, uPlaneY[int(aG.x + 0.5)], cos(ang) * rr);
  ring += 0.002 * vec3(sin(uT * 1.3 + s * 91.0), sin(uT * 1.7 + s * 37.0), sin(uT * 1.1 + s * 53.0));
  ring.xz += normalize(ring.xz + 1e-6) * uScatter;
  vec3 push = vec3(0.0);
  for (int q = 0; q < 4; q++) {                             // pointer repulsion: inverse-square, capped 0.06 m, 0.35 m reach
    vec3 w = ring - uRo[q]; vec3 pp = w - dot(w, uRd[q]) * uRd[q]; float d = max(length(pp), 0.02);
    push += pp / d * (uRw[q] * clamp(0.0015 * (1.0 / (d * d) - 8.163), 0.0, 0.06));
  }
  float pl = length(push); ring += pl > 0.06 ? push * (0.06 / pl) : push;
  float c = cos(acos(1.0 - 2.0 * fract(s * 7.31))), sn = sqrt(max(0.0, 1.0 - c * c));
  vec3 shell = vec3(sn * sin(ang), c * 0.8, sn * cos(ang)) * (1.25 + 0.55 * fract(s * 13.7));
  vec3 pos = mix(ring, shell, smoothstep(0.0, 1.0, clamp(uShell * 1.35 - fract(s * 3.7) * 0.35, 0.0, 1.0)));
  if (uPlate > 0.0) {
    vec3 nrm = normalize(uPlateM[2].xyz), up = normalize(uPlateM[1].xyz);
    vec3 tgt = (uPlateM * vec4(aPT.zw, 0.0, 1.0)).xyz;
    vec3 prv = uFromRing > 0.5 ? pos : (uPlateM * vec4(aPT.xy, 0.0, 1.0)).xyz;
    float dl = uStagger > 0.5 ? length(aPT.zw) / (uHalf * 1.4142) * uDelayMax : fract(s * 17.3) * uDelayMax;
    float x = uTravel > 0.0 ? clamp((uStepT - dl) / uTravel, 0.0, 1.0) : step(dl, uStepT);
    float e = x * x * (3.0 - 2.0 * x);
    float h = uArc * 0.07 * abs(field(aPT.xy / uHalf, uNM.xy)) * 0.5 * sin(3.14159265 * x);
    float kick = uPulse * 0.012 * abs(field(aPT.zw / uHalf, uNM.zw)) * 0.5;
    vec3 pp = mix(prv, tgt, e) + nrm * (h + kick);
    if (uWarm > 0.5) col = mix(col, mix(cEmber, cWhite, clamp((uStepT - dl - uTravel) / uCool, 0.0, 1.0)), smoothstep(0.75, 1.0, x));
    if (uFall >= 0.0) { float tf = min(uFall, 700.0) * 0.001; pp -= up * 4.9 * tf * tf; a *= 1.0 - clamp(uFall / 700.0, 0.0, 1.0); }
    pos = mix(pos, pp, uPlate);
  }
  pos += uShiver * vec3(sin(uT * 97.0 + s * 300.0), sin(uT * 89.0 + s * 211.0), sin(uT * 101.0 + s * 157.0));
  if (aG.x > 0.5) col = mix(col, cEmberDeep, 0.40 * smoothstep(0.03, 0.09, uGap) * pow(0.12 / max(length(pos.xz), 0.12), 2.0));  // СВЕТ ИЗ ЩЕЛЕЙ
  vec4 wp = modelMatrix * vec4(pos, 1.0);
  wp.xyz = fxDisplace(wp.xyz);
  vec4 v = viewMatrix * wp;
  gl_Position = projectionMatrix * v;
  float coc = fxCoc(-v.z);
  float s0 = max(px, 1.0);
  vPx = max(px * uPixelRatio, 1.0) + coc * uPixelRatio;
  gl_PointSize = vPx + 1.0;
  // Saved grains: --white at 85 % (not breathing), only following the reveal.
  vA = (sv > 0.5 ? 0.85 * uRev : uA) * a * uReform * pow(s0 / (s0 + coc), 2.0);
  vSaved = sv;
  vCoc = coc;
  vCol = col * (1.0 + fxWaveBright(wp.xyz));
  vDist = length(v.xyz);
}`,yL=`
${Oi}
${Fp}
uniform vec2 uFxCaps;
varying vec3 vCol; varying float vA; varying float vPx; varying float vDist; varying float vCoc; varying float vSaved;
void main() {
  float r = length(gl_PointCoord - 0.5) * (vPx + 1.0);
  float cov = clamp(0.5 * vPx + 0.5 - r, 0.0, 1.0);
  // A saved grain is a struck point of light: its 85 % disc carries an opaque core (≈ 1 px wherever the point lands).
  if (vSaved > 0.5) cov = max(cov, clamp(2.0 - 1.5 * r, 0.0, 1.0) / max(vA, 0.01));
  if (uFxCaps.y > 0.5 && vCoc >= 2.0) cov = clamp((0.9009689 - fxHeptagon((gl_PointCoord - 0.5) * 2.0)) * (vPx + 1.0) * 0.5, 0.0, 1.0);
  float a = min(1.0, cov * vA);
  if (a <= 0.003) discard;
  gl_FragColor = vec4(applyFog(vCol, vDist), a);
}`,_L=Math.PI*2,uc=64,fm=[0];for(let t=1;t<7;t++)fm.push((Dt[t-1].bot+Dt[t].top)/2);function jS(t){let e=mo.T3,n=new Float32Array(e*4),i=new Float32Array(e*4),r=new Float32Array(e*4),s=new Float32Array(e*2),o=Is(23057);for(let T=0;T<e;T++){let I=T<uc?0:T%7,z=Math.max(.12,Ft(fm[I]))*(mo.annulus[0]+(mo.annulus[1]-mo.annulus[0])*Math.sqrt(o())),L=T<8?(T%2?1:-1)*(.62+.38*(T>>1)):T<uc?T*2.39996:o()*_L;n.set([I,z,L,o()],T*4),i.set([T<uc?T:-1,0,0,mo.sizePx[0]+(mo.sizePx[1]-mo.sizePx[0])*o()],T*4),T>0&&T<uc&&(i[T*4+1]=n[(T-1)*4+1],i[T*4+2]=n[(T-1)*4+2])}let a=new Dn;a.setAttribute("position",new Zt(new Float32Array(e*3),3)),a.setAttribute("aG",new Zt(n,4)),a.setAttribute("aM",new Zt(i,4));let l=new Zt(r,4);a.setAttribute("aPT",l),a.boundingSphere=null;let c=()=>[new C,new C,new C,new C],u={uPlaneY:{value:fm.slice()},uRo:{value:c()},uRd:{value:c()},uRw:{value:[0,0,0,0]},uKep:{value:0},uT:{value:0},uSpiral:{value:0},uScatter:{value:0},uShiver:{value:0},uShell:{value:0},uPlate:{value:0},uFromRing:{value:1},uStepT:{value:0},uDelayMax:{value:120},uTravel:{value:260},uArc:{value:1},uStagger:{value:0},uWarm:{value:0},uCool:{value:1500},uHalf:{value:.6},uFall:{value:-1},uReform:{value:1},uMarks:{value:0},uPairs:{value:0},uA:{value:.35},uRev:{value:1},uNM:{value:new Yt(1,2,1,2)},uPlateM:{value:new Ct},uGap:ae.uGap,uPulse:ae.uPulse,uPixelRatio:ae.uPixelRatio,uFogDensity:ae.uFogDensity,cAbyss:ae.cAbyss,cSilver:ae.cSilver,cWhite:ae.cWhite,cEmber:ae.cEmber,cEmberDeep:ae.cEmberDeep,...Hr()},f=new $t({uniforms:u,vertexShader:vL,fragmentShader:yL,transparent:!0,depthWrite:!1,blending:or}),h=new ha(a,f);h.name="grains",h.frustumCulled=!1;let d=Math.min(e,t),g="rings",x=1,p={stepAt:-1,fallAt:-1,reformAt:-1,shell:0,shellTarget:0,scatterAt:-1e9,scatterM:0,kep:1},m=[new C,new C(0,0,-1)],_=[new C,new C,new C,new C,new C,new C],w=[-1e9,-1e9,-1e9],v=-1e9,M=!1,S=-1e9,E=0;a.setDrawRange(0,d);function y(T,I){let F=T||{},z=d;for(let V=0;V<z;V++){let G=V*4;r[G]=r[G+2],r[G+1]=r[G+3],r[G+2]=s[V*2],r[G+3]=s[V*2+1]}l.needsUpdate=!0;let L=!!F.cut||Et.reducedMotion;if(u.uFromRing.value=u.uPlate.value>0&&g==="plate"&&p.stepAt>=0?0:1,u.uPlate.value=1,u.uWarm.value=I?1:0,I){let V=F.ms!=null?F.ms:900;u.uDelayMax.value=L?0:V*.35,u.uTravel.value=L?0:V*.65,u.uStagger.value=1,u.uArc.value=0,u.uCool.value=F.coolMs!=null?F.coolMs:1500}else u.uDelayMax.value=L?0:F.delayMaxMs!=null?F.delayMaxMs:120,u.uTravel.value=L?0:F.travelMs!=null?F.travelMs:260,u.uStagger.value=0,u.uArc.value=F.arc===!1||L?0:1;p.stepAt=E,p.fallAt=-1,u.uFall.value=-1}return{object:h,get count(){return d},get mode(){return g},get marked(){return Math.min(uc,u.uMarks.value+2*u.uPairs.value)},setMode(T){let I=g;g=T,T==="shell"?p.shellTarget=1:T==="rings"?(p.shellTarget=0,u.uPlate.value=0,p.stepAt=-1,p.fallAt=-1,u.uFall.value=-1):T==="plate"?(p.shellTarget=0,I!=="plate"&&(p.stepAt=-1,u.uPlate.value=0)):T==="fall"&&(u.uPlate.value>0?p.fallAt=E:g="rings")},setPlate(T,I){T&&u.uPlateM.value.copy(T),u.uHalf.value=(I||1.2)/2},writeTargets(T,I,F){let z=Math.max(0,T|0),L=Math.min(F|0,e-z);for(let V=0;V<L*2;V++)s[z*2+V]=I[V]},commitTargets(T){let I=T&&T.nm,F=u.uNM.value;F.x=F.z,F.y=F.w,I&&(F.z=I[0],F.w=I[1]),y(T,!1)},flyToTargets(T){y(T,!0)},shiver(T){u.uShiver.value=Et.reducedMotion?0:Math.max(0,Math.min(.01,+T||0))},scatter(T){Et.reducedMotion||(p.scatterAt=E,p.scatterM=T??.05)},markSaved(T,I=0){u.uMarks.value=Math.max(0,Math.min(uc,T|0)),u.uPairs.value=Math.max(0,I|0)},spiral(T,I){u.uSpiral.value=Math.max(0,Math.min(1,+T||0)),p.kep=I>0?I:1},setTierCount(T){d=Math.max(0,Math.min(e,T|0)),a.setDrawRange(0,d)},setReveal(T){x=T,h.visible=T>0},setRay(T,I,F){if(M&&!F&&(S=E),M=!!F,!!F&&(m[0].copy(T),m[1].copy(I),!(E-v<225))){v=E;for(let z=2;z>0;z--)w[z]=w[z-1],_[z*2].copy(_[z*2-2]),_[z*2+1].copy(_[z*2-1]);w[0]=E,_[0].copy(T),_[1].copy(I)}},update(T,I,F,z){E=I,Et.reducedMotion||(u.uKep.value+=T*p.kep,u.uT.value=F);for(let O=0;O<7;O++)u.uPlaneY.value[O]=fm[O]+z[O];p.shell+=(p.shellTarget-p.shell)*(1-Math.exp(-T/.16)),u.uShell.value=p.shell,u.uStepT.value=p.stepAt>=0?I-p.stepAt:0;let L=I-p.scatterAt;if(u.uScatter.value=L<0?0:L<120?p.scatterM*(L/120):L<820?p.scatterM*(1-(L-120)/700):0,p.fallAt>=0){let O=I-p.fallAt;u.uFall.value=O,O>=700&&(p.fallAt=-1,u.uFall.value=-1,u.uPlate.value=0,p.stepAt=-1,g="rings",p.reformAt=I)}u.uReform.value=p.reformAt<0?1:Math.min(1,(I-p.reformAt)/900),u.uReform.value>=1&&(p.reformAt=-1);let V=u.uRo.value,G=u.uRd.value,P=u.uRw.value;V[0].copy(m[0]),G[0].copy(m[1]),P[0]=M?1:Math.max(0,1-(I-S)/900);for(let O=1;O<4;O++)V[O].copy(_[(O-1)*2]),G[O].copy(_[(O-1)*2+1]),P[O]=Math.max(0,1-(I-w[O-1])/900)*.8;u.uA.value=Sn.mix(.32,.38)*x,u.uRev.value=x}}}var hm=Math.PI/180,ZS=15.8*hm,fc=64,ML={},KS={speed:0};function JS(t){let e={yaw:0,pitch:0,sway:new Float32Array(7),lagYaw:new Float32Array(7),lagPitch:new Float32Array(7),lean:0,flinch:0,hot:new C(0,0,1)},n=On.from(fi.notice),i=On.from(fi.notice),r=On.from(fi.heavy),s=[];for(let G=0;G<7;G++)s.push(On.from(fi.reindex));let o=new $p(fi.hot.omega,1);o.snap(e.hot);let a=new Float32Array(7),l=new Float32Array(7),c=new Float64Array(fc),u=new Float32Array(fc*3),f=0,h=0,d=-1,g=0,x=0,p=-1,m=-1e9,_=!1,w=new C,v=new C,M=new C,S=new C,E=new C,y=new Ct,A={at:-1e9,px:-9999,py:-9999,cx:0,cy:0,R:0};Jt.observe(G=>{let P=A.px,O=A.py;if(A.px=G.x,A.py=G.y,G.type==="touch"||G.speed<=Vt.flinchSpeedPx||P<-9e3||A.R<=0)return;let k=G.x-P,$=G.y-O,j=k*k+$*$,Me=j>0?Math.max(0,Math.min(1,((A.cx-P)*k+(A.cy-O)*$)/j)):0;Math.hypot(P+k*Me-A.cx,O+$*Me-A.cy)<Vt.flinchRadius*A.R&&(A.at=fe.at())});function T(G){p=G+Vt.reindexMs[0]+Math.random()*(Vt.reindexMs[1]-Vt.reindexMs[0])}let I=[],F=[],z=[];for(let G=0;G<7;G++)I.push({i:G,soft:!0}),F.push(()=>Ye.play("tick",I[G])),z.push(()=>{s[G].target=0});function L(){let G=3;for(;G===3;)G=Math.floor(Math.random()*7);let P=Dt[G].n;s[G].target=Math.PI*2/P;for(let O=0;O<P;O++)Qe(Vt.reindexTurnMs*(O+.5)/P,F[G]);Qe(Vt.reindexBackMs,z[G])}function V(G,P){let O=Pe.camera;return O?(w.setFromMatrixPosition(O.matrixWorld),v.set(G/Math.max(1,be.w)*2-1,-(P/Math.max(1,be.h))*2+1,.5).unproject(O).sub(w),y.copy(t.group.matrixWorld).invert(),w.applyMatrix4(y),v.transformDirection(y),!0):!1}return e.update=function(P,O,k){let $=t.idle&&!Et.reducedMotion,j=t.idle&&t.attentive();t.idle&&!_&&(T(O),x=0),_=t.idle,x=$?Math.min(1,x+P/2):Math.max(0,x-P/.6);let Me=fe.worldNow/1e3,ve=x*Vt.driftYawDeg*hm*Math.sin(Math.PI*2*Me/Vt.driftPeriodS)*(1-t.hoverAmt);for(let he=0;he<7;he++)e.sway[he]=x*Vt.swayDeg*hm*Math.sin(Math.PI*2*Me/Vt.swayPeriodsS[he]+he*1.7);$&&j&&p>0&&O>=p&&(L(),T(O));for(let he=0;he<7;he++)s[he].step(P),e.sway[he]+=s[he].x;let Fe=Jt.pointer,We=Fe.lastMove>0&&Fe.x>-9e3,ke=We?Fe.x:be.w/3,ee=We?Fe.y:be.h/2,ie=Math.hypot(ke-k.x,ee-k.y),Te=Math.max(8,k.r),$e=We&&Fe.inside&&(Fe.type!=="touch"||Fe.down),re=V(ke,ee),se=(Q.booting?Vt.noticeBootDeg:Vt.noticeMaxDeg)*hm,te=k.r/1.25;if(j&&t.idle&&re&&!Et.reducedMotion){let he=Math.max(1,w.length());n.target=se*Math.tanh(Math.atan2((ke-k.x)/te,he)/se),i.target=se*Math.tanh(Math.atan2((ee-k.y)/te,he)/se)}else n.target=0,i.target=0;n.step(P),i.step(P);let me=ve+n.x;me=ZS*Math.tanh(me/ZS),e.yaw=me,e.pitch=i.x;for(let he=0;he<7;he++){let Ie=1-Math.exp(-(P*1e3)/(Vt.tauBaseMs+Vt.tauStepMs*Math.abs(he-3)));a[he]+=(n.x-a[he])*Ie,l[he]+=(i.x-l[he])*Ie,e.lagYaw[he]=a[he]-n.x,e.lagPitch[he]=l[he]-i.x}if(re&&j){M.copy(t.nucleusLocal),S.copy(M).sub(w);let he=S.dot(v);S.copy(w).addScaledVector(v,he).sub(M).multiplyScalar(1/.6),E.copy(w).sub(M).normalize(),S.add(E).normalize(),c[h]=O,u[h*3]=S.x,u[h*3+1]=S.y,u[h*3+2]=S.z,h=(h+1)%fc,f=Math.min(fc,f+1),O-Fe.lastMove<400?d<0&&(d=O):d=-1;let Ie=d<0?0:Math.min(1,Math.max(0,(O-d-Vt.hotTrackMs)/Vt.hotRampMs)),qe=Vt.hotDelayMs+(Vt.hotDelayLateMs-Vt.hotDelayMs)*Ie;for(let Ne=1;Ne<=f;Ne++){let ut=(h-Ne+fc)%fc;if(O-c[ut]>=qe||Ne===f){o.target.set(u[ut*3],u[ut*3+1],u[ut*3+2]);break}}}o.step(P),e.hot.copy(o.x),e.hot.lengthSq()<1e-6?e.hot.set(0,0,1):e.hot.normalize(),r.target=j&&$e&&!Et.reducedMotion&&Fe.speed<Vt.leanSpeedPx&&ie<Vt.leanRadius*Te?1:0,r.step(P),e.lean=r.x,A.cx=k.x,A.cy=k.y,A.R=Te;let Se=O-A.at<260||We&&Fe.speed>Vt.flinchSpeedPx&&ie<Vt.flinchRadius*Te;j&&Se&&O-m>Vt.flinchInMs+Vt.flinchRelaxMs&&(A.at=-1e9,m=O,KS.speed=Math.round(Math.max(Fe.speed,Vt.flinchSpeedPx)),ge.emit("key:flinch",KS),Q.night?t.yawn(O):(Ye.play("flinch",ML),Et.reducedMotion||t.grains.scatter(Vt.flinchScatter)));let nt=O-m;g=Q.night||Et.reducedMotion?0:nt<Vt.flinchInMs?nt/Vt.flinchInMs:nt<Vt.flinchInMs+Vt.flinchRelaxMs?1-(nt-Vt.flinchInMs)/Vt.flinchRelaxMs:0,e.flinch=g,t.grains.setRay(w,v,re&&j&&$e)},e}var bL=Math.PI/180,SL=t=>-Math.log(t)/Math.sqrt(Math.PI*Math.PI+Math.log(t)**2),wL=SL(xn.settleOvershoot),dm=78,QS=17,AL=40,TL=122,ew=5,EL={},tw={index:-1},RL=[0,1,2,3,4,5,6].map(t=>({i:t,quiet:!0})),CL=Dt.map(t=>Ft(t.mid));function hc(t,e,n){let i=document.createElement(t);return e&&(i.className=e),n!=null&&(i.textContent=n),i}function nw(t,e){let n={amt:0,idx:-1,slide:new Float32Array(7),turn:new Float32Array(7),push:new Float32Array(7),gap:Ot.rest},i=new On(fi.heavy.omega,1,0),r=[],s=[];for(let re=0;re<7;re++)r.push(On.from(fi.heavy)),s.push(On.from(fi.heavy));let o=-1,a=!1,l=!1,c=-1,u=-1e9,f=-2,h=!1,d=0,g=0,x=!1,p=0,m=new Float32Array(7),_=new C,w=new C,v=new C,M={x:0,y:0,depth:0,visible:!1},S=[],E=[],y=[],A=[],T=[],I=[],F=new Float64Array(7),z=new Float64Array(7),L=new Float64Array(7),V=new Float64Array(7),G=new Float32Array(7),P=new Float32Array(7),O=new Float32Array(7),k=new Float32Array(7),$=new Float32Array(7),j=re=>se=>{if(se.set(0,Dt[re].mid,0).applyMatrix4(t.strata[re].matrixWorld),Pe.camera){w.setFromMatrixColumn(Pe.camera.matrixWorld,0);let te=t.strata[re].matrixWorld.elements;se.addScaledVector(w,CL[re]*Math.hypot(te[0],te[1],te[2]))}return se},Me=[0,1,2,3,4,5,6].map(j);function ve(){let re=!!Y.data.nadirOpen;A[6].textContent=re?ce.NADIR.nameOpen:ce.NADIR.name,T[6].textContent=re?lb:ce.NADIR.line.replace("{k}",String(Y.data.shards|0)),E[6].setAttribute("aria-label",`${A[6].textContent} — ${T[6].textContent}`)}function Fe(){if(!(S.length||!e.overlay)){for(let re=0;re<7;re++){let se=ce[Nn[re]],te=hc("div","key-lbl"),me=hc("button","proxy key-lbl__b");me.type="button",me.dataset.owner="key",me.dataset.id=se.sign,me.append(hc("span","t-label",`${se.num} · ${se.code}`),A[re]=hc("span","t-body t-body--em key-lbl__t",se.name),T[re]=hc("span","t-body t-body--15 key-lbl__l",se.line),hc("span","t-micro",`▽ ${se.level}`)),me.setAttribute("aria-label",`${se.name} — ${se.line}`),me.addEventListener("click",()=>{t.interactive&&ge.emit("key:click",{index:re,x:n.sx(re),y:n.sy(re)})}),me.addEventListener("pointerenter",()=>{a=!0,n.focusIdx=re}),me.addEventListener("pointerleave",()=>{a=!1}),me.addEventListener("focus",()=>{n.focusIdx=re,n.kbd=!0}),me.addEventListener("blur",()=>{n.kbd=!1}),te.append(me);let Se={side:"right",len:40,rise:-QS},nt=e.overlay.add({owner:"key",id:se.sign,el:te,get:Me[re],leader:Se,cross:!0,coord:!0,priority:5});nt.setVisible(!1),S.push(nt),E.push(me),y.push(Se),I.push(te)}ve()}}n.sx=re=>S[re]?S[re].screen.x:0,n.sy=re=>S[re]?S[re].screen.y:0,n.focusIdx=-1,n.kbd=!1,ge.on("shard:landed",()=>{S.length&&ve()}),ge.on("nadir:open",()=>{S.length&&ve()});function We(re){if(re===l)return;l=re,x=!1,Fe();for(let te=0;te<S.length;te++)if(I[te].style.transitionDelay=re?`${te*Ae.leaderStagger}ms`:"0ms",S[te].setVisible(re),re){let me=S[te],Se=I[te];Qe(te*Ae.leaderStagger,()=>{l&&(me.drawIn(Ae.leaderDraw),Se.classList.remove("is-pending"))})}re&&ve();let se=e.fx&&e.fx.scaleFigure;try{se&&(re?se.show("hover"):se.hide())}catch{}if(re&&h)for(let te of ke)te.drawIn(Ae.dimsDraw)}let ke=[],ee=0,ie=(re,se)=>te=>te.set(re,se,0).applyMatrix4(t.group.parent?t.group.parent.matrixWorld:t.group.matrixWorld);function Te(re){for(let te of ke)te.remove();if(ke.length=0,!e.dims)return;ee=re.rx;let se=1.9*.62*re.r/It.radius;ke.push(e.dims.add({owner:"key",a:ie(0,1.2),b:ie(0,-1.2),side:"left",label:"↕ 2.40 М",offset:Math.max(re.rx+26,Math.min(se+46,re.x-40))})),ke.push(e.dims.add({owner:"key",a:ie(-.62,0),b:ie(.62,0),side:"below",label:"Ø 1.24 М",offset:re.ry+26}))}function $e(re,se){if(re&&(!ke.length||Math.abs(se.rx-ee)>ee*.08)&&(Te(se),h=!1),re!==h){h=re;for(let te of ke)te.setVisible(re),re&&te.drawIn(Ae.dimsDraw)}}return n.update=function(se,te,me,Se){(te-g>250||!Se)&&(g=te,$e(Se&&d>=0,me));let nt=Jt.pointer,he=Se&&!t.dragging&&be.kind==="desktop"&&nt.type==="mouse"&&nt.x>-9e3&&!nt.down,Ie=!1;if(he&&(nt.inside||a)){let U=(nt.x-me.x)/Math.max(8,me.rx*1.06),Qt=(nt.y-me.y)/Math.max(8,me.ry*(1+.18*n.amt));Ie=U*U+Qt*Qt<=1||a}he&&n.kbd&&n.focusIdx>=0&&(Ie=!0),Ie?o<0&&(o=te):o=-1;let qe=o>=0&&te-o>=Ae.keyHoverTrigger;if(qe){if(n.kbd||a)c=n.focusIdx;else if(te-u>33){u=te;let U=t.pick(nt.x,nt.y);U>=0?c=U:c<0&&(c=3)}}n.idx=qe?c:-1,n.idx!==f&&(f=n.idx,tw.index=n.idx,ge.emit("key:hover",tw),n.idx>=0&&Ye.play("stratumNote",RL[n.idx])),We(qe),i.target=qe?1:0,i.zeta=qe?1:wL,i.omega=qe?9:7.6,i.step(se),n.amt=Math.max(0,i.x),n.gap=Ot.rest+(Ot.hover-Ot.rest)*n.amt,v.copy(ae.uLamp.value),t.group.worldToLocal(v);let Ne=Math.atan2(v.x,v.z),ut=Math.sin(Ne),St=Math.cos(Ne);for(let U=0;U<7;U++){let Qt=qe&&U===n.idx;r[U].target=Qt?It.hoverSlide:0;let wt=(U===3?8:14)*bL;s[U].target=Qt?Math.max(-wt,Math.min(wt,Ne)):0,r[U].step(se),s[U].step(se),n.slide[U]=r[U].x,n.turn[U]=s[U].x,n.push[U]=n.idx<0?0:(U<n.idx?1:U>n.idx?-1:0)*Ot.hoverNeighbourPush*n.amt}n.lx=ut,n.lz=St},n.layout=function(se,te){if(!l)return;let me=te.x+te.rx*1.04+64;for(let Ne=0;Ne<7;Ne++){Me[Ne](_),Pe.project(_,M),G[Ne]=M.y,O[Ne]=M.x;let ut=me-O[Ne],St=ut<TL,U=Math.max(St?AL:QS,ut-Tt.leader.runMax);F[Ne]=G[Ne]+(Ne<=3||St?-U:U)-Ne*dm}let Se=0;for(let Ne=0;Ne<7;Ne++)for(z[Se]=F[Ne],L[Se]=1,V[Se]=1,Se++;Se>1&&z[Se-2]>z[Se-1];){let ut=L[Se-2]+L[Se-1];z[Se-2]=(z[Se-2]*L[Se-2]+z[Se-1]*L[Se-1])/ut,L[Se-2]=ut,V[Se-2]+=V[Se-1],Se--}for(let Ne=0,ut=0;Ne<Se;Ne++)for(let St=0;St<V[Ne];St++,ut++)P[ut]=z[Ne]+ut*dm;let nt=64+dm/2-P[0],he=be.h-64-dm/2-P[6],Ie=nt>0?nt:he<0?he:0;(!x||Math.abs(me-p)>ew)&&(p=Math.round(me));let qe=1-Math.exp(-(se*1e3)/Ae.labelLowpass);for(let Ne=0;Ne<7;Ne++){let ut=P[Ne]+Ie;(!x||Math.abs(ut-m[Ne])>ew)&&(m[Ne]=Math.round(ut));let St=S[Ne].screen,U=St.x===0&&St.y===0,Qt=U?O[Ne]:St.x+(O[Ne]-St.x)*qe,wt=U?G[Ne]:St.y+(G[Ne]-St.y)*qe,N=Math.max(0,p-Qt-Tt.leader.elbowMin),b=Math.max(-N,Math.min(N,m[Ne]-wt)),q=p-(Qt+Math.abs(b)),J=y[Ne],oe=Math.abs(St.x-k[Ne])<.1&&Math.abs(St.y-$[Ne])<.1;k[Ne]=St.x,$[Ne]=St.y,(J.rise!==b||J.len!==q)&&(J.rise=b,J.len=q,oe&&S[Ne].update(EL));let Re=Ne===n.idx||n.idx<0?"1":"0.55";E[Ne].style.opacity!==Re&&(E[Ne].style.opacity=Re)}x=!0},n.setDimsAllowed=re=>{d=re?0:-1},n}var Bo=Math.PI/180,Na=Math.PI,Kx=t=>-Math.log(t)/Math.sqrt(Na*Na+Math.log(t)**2),PL=110/330*Bo,iw=(t,e,n,i)=>e+(t-e)*(1+n*i)*Math.exp(-n*i);function rw(t){let e={yaw:0,pitch:0,press:1},n=On.from(fi.heavy),i=On.from(fi.heavy),r={from:0,t0:-1},s={from:0,to:0,w:6,t0:-1};e.prog=0;let o=new On(9,Kx(xn.settleOvershoot),0),a=-1,l=0,c=0,u=0,f=-1,h=!1,d=-1e9,g=0,x=-1e9,p=-1,m=0,_={x:0,y:0};function w(v){return Math.max(-It.yawMaxDeg*Bo,Math.min(It.yawMaxDeg*Bo,v))}return e.onGesture=function(M,S){switch(M.type){case"down":return a=t.canTouch()?t.pick(M.x,M.y):-1,a<0?!1:(_.x=M.x,_.y=M.y,M.pointerType==="touch"&&(d=g,t.flashEdges(a,"white",1)),!0);case"tap":{let E=a>=0?a:t.canTouch()?t.pick(M.x,M.y):-1;return a=-1,E<0||!t.interactive?!1:(ge.emit("key:click",{index:E,x:M.x,y:M.y}),!0)}case"dragstart":return a<0&&!M.afterHold&&t.canTouch()&&(a=t.pick(M.x-M.tx,M.y-M.ty)),a<0||M.afterHold||!t.interactive?(a=-1,!1):(l=Math.abs(M.tx)>=Math.abs(M.ty)?1:2,t.dragging=!0,h=!1,c=n.x,u=0,f=-1,r.t0=-1,!0);case"drag":{if(!t.dragging)return!1;if(l===1){let E=n.x;n.snap(w(c+M.tx/Math.max(40,S))),u=n.x-E}else if(!h){let E=M.ty*PL;if(Math.abs(E)>=It.pitchFlipDeg*Bo)h=!0,ge.emit("key:flip",{dir:E>0?"over":"back"}),m=E>0?2*Na:-2*Na,o.omega=fi.heavy.omega,o.zeta=1,o.target=m;else{let y=It.pitchResistMaxDeg*Bo;o.snap(y*Math.tanh(It.pitchResist*E/y))}}return!0}case"dragend":case"cancel":return a=-1,t.dragging?(t.dragging=!1,l===1?(f=g,u=M.type==="cancel"?0:M.vx*16.7/Math.max(40,S)):h||(o.omega=9,o.zeta=Kx(xn.settleOvershoot),o.target=0),!0):!1;case"up":return t.dragging||(a=a>=0&&M.t<350?a:-1),!1;default:return!1}},e.update=function(M,S){if(g=S,!t.dragging){if(f>=0&&(S-f<It.yawReturnMs?Math.abs(u)>1e-5&&(n.snap(w(n.x+u*(M*1e3/xn.frameMs))),u*=Math.pow(xn.inertiaDecay,M*1e3/xn.frameMs)):(f=-1,r.from=n.x,r.t0=S)),r.t0>=0){let T=iw(r.from,0,fi.heavy.omega,(S-r.t0)/1e3);n.snap(T),Math.abs(T)<1e-4&&(n.snap(0),r.t0=-1)}else n.step(M);o.step(M),h&&Math.abs(o.x-m)<.01&&(o.snap(0),h=!1)}s.t0>=0&&(e.prog=iw(s.from,s.to,s.w,(S-s.t0)/1e3),(S-s.t0)/1e3*s.w>12&&(e.prog=s.to,s.t0=-1)),S-x>It.yawReturnMs&&(i.target=Math.round(i.x/(2*Na))*2*Na),i.step(M);let E=S-d,y=E<0||E>xn.pressMs+120?0:E<24?E/24:E<=xn.pressMs?1:1-(E-xn.pressMs)/120;e.press=1-(1-xn.pressScale)*y,e.yaw=n.x+e.prog+i.x,e.pitch=o.x;let A=Math.atan2(Math.sin(e.yaw+t.idleYaw()),Math.cos(e.yaw+t.idleYaw()));Math.abs(Math.abs(A)-Na)<=35*Bo?p<0&&(p=S):p=-1},e.isShowingBack=()=>p>=0&&g-p>=240,e.yawTo=(v,M)=>(s.from=e.prog,s.to=(+v||0)*Bo,s.w=Math.min(30,7.2*1e3/Math.max(1,+M||0)),s.t0=g,(Et.reducedMotion||!(M>0))&&(e.prog=s.to,s.t0=-1),new Promise(S=>Qe(M>0?M:0,S))),e.addYaw=v=>{i.x+=+v||0,i.target=i.x,x=g},e.nudgePitch=v=>{t.dragging||(o.omega=9,o.zeta=Kx(xn.settleOvershoot),o.x+=(+v||0)*Bo,o.target=0)},e.resetYaw=()=>{t.dragging||(f=-1,u=0,r.t0=-1,n.snap(0))},e}var sw=64,ow=Cs.tiltDeg*Math.PI/180;function aw(t){let e=Cp({scale:1});t.strata[3].add(e.object),ge.on("night:change",({night:v})=>e.setNight(v)),Q.night&&e.setNight(!0);let n=()=>eo.paintGlyph(Y.data.glyph||[]);ge.on("glyph:saved",({edges:v})=>eo.paintGlyph(v||Y.data.glyph||[]));let i=Cs.max*(sw-1),r=new Float32Array(i*6),s=new Float32Array(i),o=Ys(),a=zr(),l=ui({segments:r,faces:s,strata:o,strataAlpha:a,color:"silver",width:1,alpha:.7,count:0});l.mesh.name="satellites",l.mesh.visible=!1,t.group.add(l.mesh);let c=0;function u(){let v=(Y.data.drawings||[]).slice(-Cs.max),M=0;v.forEach((S,E)=>{if(!Array.isArray(S))return;let y=Cs.size/2;for(let A=0;A+1<Math.min(sw,S.length);A++){let T=S[A],I=S[A+1];!Array.isArray(T)||!Array.isArray(I)||(r.set([T[0]*y,-T[1]*y,0,I[0]*y,-I[1]*y,0],M*6),s[M]=E*16,M++)}}),c=v.length,Q.satellites=c,l.setSegments(r,M),l.mesh.geometry.attributes.aFace.needsUpdate=!0,l.mesh.visible=M>0}ge.on("drawing:saved",u);let f=t.structure.vertexExtra,h=()=>{if(!f)return;let v=Math.min(5,Y.data.nadirOpen?5:Y.data.shards|0);for(let M=0;M<5;M++)f.alphas[f.base+M]=M<v?2.5:.7,f.sizes[f.base+M]=1.5;f.touch()};ge.on("shard:landed",h),ge.on("nadir:open",h);let d=!1,g=new Li,x=new Li,p=new C,m=new C(1,1,1),_=new Ct;return{lit:e,init(){n(),u(),e.setCount(Y.litNodes),h()},flashSlots(){if(!(d||!f)){d=!0;for(let v=0;v<5;v++)f.alphas[f.base+v]=2.5,f.sizes[f.base+v]=2;f.touch(),Qe(Ae.shudder,()=>{d=!1,h()})}},update(v){if(l.setAlpha(.7*v),!c||!Pe.camera||!l.mesh.visible)return;t.group.getWorldQuaternion(x).invert(),g.copy(Pe.camera.quaternion).premultiply(x),_.makeRotationFromQuaternion(x);let M=fe.worldNow/1e3*Math.PI*2/Cs.periodS;for(let S=0;S<c;S++){let E=M+Math.PI*2*S/c;p.set(Math.sin(E)*Cs.r,-Math.cos(E)*Cs.r*Math.sin(ow),Math.cos(E)*Cs.r*Math.cos(ow)),p.applyMatrix4(_),o.value[S].compose(p,g,m)}},setLitCount(v){e.setCount(v)}}}var pm=Math.PI/180,Ki=Math.PI*2,IL=137.508*pm,dc=24,LL={},lw=()=>({dy:0,slide:0,yaw:0,pitch:0,scaleR:1,scaleY:1,alpha:1,edgeFlash:0}),cw=t=>t<=0?1:-Math.log(t)/Math.sqrt(Math.PI*Math.PI+Math.log(t)**2);function Jx(t,e,n=0){let i=Dt[t],r=(Ft(i.top+(i.bot-i.top)/3)+Ft(i.top+(i.bot-i.top)*2/3))/2*Math.cos(Math.PI/i.n),s=Ki*n/i.n;return e.set(Math.sin(s)*r,i.mid,Math.cos(s)*r)}function DL(){let t=[],e=[];for(let n of Dt){let i=Rs.map(o=>n.top+(n.bot-n.top)*o),r=[...Array(n.n).keys()].sort((o,a)=>Math.min(o,n.n-o)-Math.min(a,n.n-a)),s=0;for(let o of r)for(let a of[0,3]){let l=Ft(i[a]);if(s>=on.r3.primaryEdges||l<=1e-6)continue;let c=Ki*o/n.n-Math.PI/n.n,u=c+Ki/n.n;t.push(Math.sin(c)*l,i[a],Math.cos(c)*l,Math.sin(u)*l,i[a],Math.cos(u)*l),e.push(n.i*16+o),s++}}return{seg:new Float32Array(t),face:new Float32Array(e)}}function uw(t){Kt.texture||Kt.init(Rt.tier);let e=["","","","","","",""],n=new Uint8Array(7),i=()=>{eo.paintStatic();for(let D=0;D<7;D++)e[D]&&eo.paintLaw(D,e[D])};i(),Zl().then(()=>{i(),eo.paintGlyph(Y.data.glyph||[])});let r=new mn;r.name="key";let s=new Float32Array(15),o=new Float32Array(5).fill(96);for(let D=0;D<5;D++)s[D*3]=(D-2)*.04,s[D*3+1]=Dt[6].bot-.06,s[D*3+2]=.01;let a=Fu({perStratum:!0,vertices:!0,far:700,extraVertices:{pos:s,face:o}});r.add(a.group);let l=a.strata,c=DL(),u=zr(),f=ui({segments:c.seg,faces:c.face,strata:a.strataMatrices,strataAlpha:u,color:"white",width:on.r3.primaryPx,alpha:1,glint:.3,renderOrder:3});f.mesh.name="edgeFlash",f.mesh.onBeforeRender=()=>{for(let D=0;D<7;D++)a.strataMatrices.value[D].copy(l[D].matrix)},a.group.add(f.mesh);let h={frames:new Int32Array(7),until:new Float64Array(7),token:"white"},d={group:r,strata:l,structure:a,idle:!1,interactive:!0,dragging:!1,hoverAmt:0,nucleusLocal:new C,pick:(D,B)=>Re.pick(D,B),flashEdges:(D,B,X)=>Re.flashEdges(D,B,X),yawn:D=>{x.yawn(D),t.status&&t.status.say("night.flinch")},attentive:()=>d.interactive&&!d.dragging&&Q.room==="CORE"&&Q.phase==="idle",canTouch:()=>d.interactive&&Q.room==="CORE"&&(Q.phase==="idle"||Q.phase==="unfolded"),idleYaw:()=>y.yaw},g=Jx(3,new C).z+.002,x=qS(r,l[3],g),p=ui({segments:new Float32Array([0,-Lr.half,0,0,Lr.half,0]),color:"ember",width:Lr.widthPx,alpha:Lr.alphaInside,glint:.3}),m=8,_=new Float32Array(m*12),w=new Float32Array(m*2),v=ui({segments:_,alpha:w,color:"ember",width:Lr.widthPx,glint:.3});for(let D of[p,v])D.mesh.layers.enable(Si.EMISSIVE),D.mesh.renderOrder=4,r.add(D.mesh);let M=-1;function S(D){if(D!==M){M=D;for(let B=0;B<2;B++)for(let X=0;X<m;X++){let xe=B?-1:1,De=Lr.half+D*X/m,Ee=Lr.half+D*(X+1)/m,Ce=(B*m+X)*6;_[Ce]=0,_[Ce+1]=xe*De,_[Ce+2]=0,_[Ce+3]=0,_[Ce+4]=xe*Ee,_[Ce+5]=0,w[B*m+X]=Lr.alphaInside*(1-(X+.5)/m)}v.setSegments(_),v.mesh.geometry.attributes.aAl.needsUpdate=!0,v.mesh.visible=D>0&&ve>0}}let E=jS((Rt.params||Xi.T2).grains);r.add(E.object),d.grains=E,ge.on("tier:change",({tier:D})=>{let B=Xi[D];B&&E.setTierCount(B.grains)});let y=JS(d),A=nw(d,t),T=rw(d),I=aw(d),F=[];for(let D=0;D<7;D++)F.push(new On(22,cw(.04),0));let z=new Float32Array(7),L=new Int32Array(7),V=[],G=[];for(let D=0;D<7;D++)V.push(null),G.push(lw());let P=null,O=1,k={scale:1,nucleus:1,gap:-1},$=new On(6,1,Ot.rest),j=0,Me=1,ve=1,Fe=0,We=Ot.rest,ke=-1e9,ee=!1,ie={t0:-1,amp:0},Te={t0:-1,amp:0,hz:0,decay:1,ms:0},$e={t0:-1,ms:600,deg:8},re={t0:-1,amp:0},se={step:0,lag:0},te=new Float64Array(dc),me=new Float32Array(dc*7),Se=0,nt=new Float32Array(7),he=new Float32Array(7),Ie={x:0,y:0,r:0,rx:0,ry:0},qe=new C,Ne=new C,ut=new C,St=new Ct,U={x:0,y:0,depth:0,visible:!1},Qt={x:0,y:0,depth:0,visible:!1},wt=new C,N=a.solids.concat([x.mesh]),b=()=>{try{return!!(t.fx&&t.fx.impact&&t.fx.impact.inPause())}catch{return!1}};function q(){for(let D=0;D<7;D++)Object.assign(G[D],lw());k.scale=1,k.nucleus=1,k.gap=-1}function J(D){let B=F[D].x;if(se.lag>0)for(let X=1;X<dc;X++){let xe=(Se-X+dc)%dc;if(Fe-te[xe]>=se.lag){B=me[xe*7+D];break}}if(se.step>0){let X=se.step*Ki/Dt[D].n;B=Math.round(B/X)*X}return B}function oe(D,B){Fe=B,Re.screenInfo(Ie);for(let ue=0;ue<7;ue++){let At=F[ue];if(z[ue]!==0){At.x+=z[ue]*D,At.v=0,At.target=At.x,z[ue]*=Math.pow(xn.spinDecay,D*1e3/xn.frameMs);let ot=Math.floor(At.x/(Ki/Dt[ue].n));ot!==L[ue]&&(L[ue]=ot,Ye.play("tick",LL)),Math.abs(z[ue])<.35&&(z[ue]=0,At.omega=6,At.zeta=1,At.target=Math.round(At.x/Ki)*Ki)}At.step(D),me[Se*7+ue]=At.x}te[Se]=B,Se=(Se+1)%dc,$.step(D),y.update(D,B,Ie);let X=d.interactive&&Q.room==="CORE"&&Q.phase==="idle"&&k.gap<0;A.update(D,B,Ie,X),T.update(D,B),d.hoverAmt=A.amt;let xe=Ht((B-ke)/1600)*(1-A.amt),De=$.x;if(d.idle&&(De+=Sn.mix(Ot.rest,Ot.breath)-Ot.rest+Ot.leanAdd*y.lean*xe),De=ln(De,A.gap,A.amt),k.gap>=0&&(De=k.gap),P&&P.gap!=null&&(De=ln(De,P.gap,O)),We=De,ae.uGap.value=De,ee&&!b()){ee=!1;for(let ue=0;ue<7;ue++)n[ue]&&(n[ue]=0,eo.paintLaw(ue,e[ue]))}let Ee=re.t0>=0?B-re.t0:-1;Ee>1600&&(re.t0=-1);let Ce=0;for(let ue=0;ue<7;ue++){let At=G[ue],ot=V[ue],Hn=ot?O:0,zi=0;Ee>=0&&(zi=re.amp*Math.exp(-.18*18*Ee/1e3)*Math.sin(17.7*Ee/1e3-ue*.35)*(ue%2?-1:1));let $f=(3-ue)*(De-Ot.rest)+A.push[ue]+At.dy+(ot&&ot.dy?ot.dy*Hn:0)+zi*.5;nt[ue]=$f;let qa=J(ue)+xe*(y.sway[ue]+y.lagYaw[ue])+A.turn[ue]+At.yaw+(ot&&ot.yaw?ot.yaw*Hn:0);if(Te.t0>=0){let Za=B-Te.t0;Za>Te.ms?Te.t0=-1:qa+=Te.amp*Math.sin(Ki*Te.hz*Za/1e3+ue*.9)*Math.exp(-Za/Te.decay)}let Xf=xe*y.lagPitch[ue]+At.pitch+(ot&&ot.pitch?ot.pitch*Hn:0),ja=At.scaleR*(ot&&ot.scaleR!=null?ln(1,ot.scaleR,Hn):1)*(1-It.contract*y.flinch)*(1+zi/Dt[ue].rMax),n0=At.scaleY*(ot&&ot.scaleY!=null?ln(1,ot.scaleY,Hn):1),Ic=At.alpha*(ot&&ot.alpha!=null?ln(1,ot.alpha,Hn):1),Lc=At.slide+(ot&&ot.slide?ot.slide*Hn:0),Jr=A.slide[ue];l[ue].position.set(Math.sin(qa)*Lc+A.lx*Jr,$f,Math.cos(qa)*Lc+A.lz*Jr),l[ue].rotation.set(Xf,qa,0,"YXZ"),l[ue].scale.set(ja,n0,ja),a.setStratumFade(ue,Ic);let Es=Math.max(At.edgeFlash,ot&&ot.edgeFlash?ot.edgeFlash*Hn:0);h.frames[ue]>0?(h.frames[ue]--,Es=1):h.until[ue]>B?Es=1:h.until[ue]>0&&B-h.until[ue]<Ae.electrumCool&&(Es=Math.max(Es,1-(B-h.until[ue])/Ae.electrumCool)),u.value[ue]=Math.min(1,Es)*Ic,Ce=Math.max(Ce,u.value[ue])}f.mesh.visible=Ce>.002&&ve>0;for(let ue=1;ue<7;ue++)he[ue]=(nt[ue-1]+nt[ue])/2;let ze=$e.t0>=0?Ht((B-$e.t0)/$e.ms):-1;ze>=1&&($e.t0=-1);let rt=ze>=0?Mr(0,.3,ze)*(1-Mr(.75,1,ze)):0,yt=k.scale*(P&&P.scale!=null?ln(1,P.scale,O):1)*T.press;r.scale.setScalar(yt);let W=xe*y.pitch+T.pitch+(P&&P.pitch?P.pitch*O:0);ze>=0&&(W+=$e.deg*pm*Math.sin(Math.PI*ze));let Be=(xe*y.yaw+T.yaw)*(1-rt)+(P&&P.yaw?P.yaw*O:0);r.rotation.set(W,Be,P&&P.roll?P.roll*O:0,"YXZ");let le=0;if(ie.t0>=0){let ue=B-ie.t0;ue>Ae.shudder?ie.t0=-1:le=Math.sin(Ki*3*ue/Ae.shudder)*ie.amp*(1-ue/Ae.shudder)}let Oe=0,Ge=0,_e=0,st=y.lean*xe*Vt.leanDz;st>1e-5&&Pe.camera&&r.parent&&(qe.setFromMatrixPosition(Pe.camera.matrixWorld),r.parent.worldToLocal(qe).normalize().multiplyScalar(st),Oe=qe.x,Ge=qe.y,_e=qe.z),le!==0&&(l[6].position.x+=le),r.position.set(Oe,Ge,_e+(P&&P.dz?P.dz*O:0)),r.updateWorldMatrix(!0,!0),wt.setFromMatrixPosition(r.matrixWorld),E.update(D,B,fe.worldNow/1e3,he),x.setHot(y.hot.x,y.hot.y,y.hot.z),x.morph=k.nucleus,x.update(d.idle,B,De,wt,l[3].matrixWorld),A.layout(D,Ie),I.update(ve),B-j>2e3&&(j=B,I.setLitCount(Y.litNodes))}let Re={group:r,structure:a,radius:It.radius,nucleusWorld:wt,grains:E,nucleus:x.mesh,glow:x.glow,litNodes:I.lit,faceFrame(D,B){return Jx(D,ut),B.F.copy(ut).applyMatrix4(l[D].matrixWorld),B.n.set(0,0,1).transformDirection(l[D].matrixWorld),B},backFaceFrame(D,B){let X=Dt[D];if(!X)return B;let xe=Math.floor(X.n/2),De=Ki*xe/X.n;return Jx(D,ut,xe),B.F.copy(ut).applyMatrix4(l[D].matrixWorld),B.n.set(Math.sin(De),0,Math.cos(De)).transformDirection(l[D].matrixWorld),B},stratumMatrix(D,B){return B.copy(l[D].matrixWorld)},pick(D,B){let X=$S(D,B,N);return X&&X.object&&X.object.userData.stratum!=null?X.object.userData.stratum:-1},screenInfo(D){let B=Pe.camera;if(Pe.project(wt,U),D.x=U.x,D.y=U.y,!B)return D.r=D.rx=D.ry=0,D;let X=r.matrixWorld.elements,xe=Math.hypot(X[0],X[1],X[2]);return qe.setFromMatrixColumn(B.matrixWorld,0),Ne.copy(wt).addScaledVector(qe,It.radius*xe),Pe.project(Ne,Qt),D.r=Math.abs(Qt.x-U.x),D.rx=D.r*.62/It.radius,qe.setFromMatrixColumn(B.matrixWorld,1),Ne.copy(wt).addScaledVector(qe,1.2*xe),Pe.project(Ne,Qt),D.ry=Math.abs(Qt.y-U.y),D},stratumScreenY(D){return qe.set(0,Dt[D].mid,0).applyMatrix4(l[D].matrixWorld),Pe.project(qe,U).y},update:oe,onGesture(D){return!D||D.type==="hover"||D.type==="leave"||D.type==="wheel"||D.type==="hold"||D.type==="longpress"?!1:T.onGesture(D,Ie.r*.62/It.radius)},setInteractive(D){d.interactive=!!D,!D&&d.dragging&&(d.dragging=!1)},setIdle(D){d.idle=!!D},setReveal(D){if(!D)return;Me=D.fill!=null?Ht(D.fill):1,ve=D.alpha!=null?Ht(D.alpha):1,a.setParts({vertices:D.points!=null?Ht(D.points):1,solid:Me,edges:1,lattice:Me}),a.setFade(ve);for(let X=0;X<a.edges.length;X++)a.edges[X].uniforms.uFlash.value=D.scanY!=null?.35:0;let B=ve>0;p.mesh.visible=B,v.mesh.visible=B&&M>0,x.reveal=Me,x.setRing(x.ringOn),I.lit.object.visible=B&&I.lit.count>0,E.setReveal(ve)},setScramble(D){for(let B=0;B<7;B++){let X=0;D==="golden"?X=B*IL:D==="random"?X=(Math.random()-.5)*Ki:Array.isArray(D)&&(X=+D[B]||0),z[B]=0,F[B].snap(Math.atan2(Math.sin(X),Math.cos(X)))}},lockSequence(D={}){let B=D.order==="up"?[6,5,4,3,2,1,0]:[0,1,2,3,4,5,6],X=D.stepMs!=null?D.stepMs:Ae.lockStep;if(D.spin)for(let xe of B)Math.abs(F[xe].x)>.01&&(z[xe]=3);return new Promise(xe=>{B.forEach((De,Ee)=>Qe(Ee*X,()=>{if(Re.alignStratum(De,{spring:"light",overshoot:D.snap!=null?D.snap:xn.snapOvershoot}),Ye.play("ratchet",{i:De}),D.onLock)try{D.onLock(De)}catch{}Ee===B.length-1&&Qe(320,xe)}))})},alignStratum(D,B={}){let X=F[D];z[D]=0,X.omega=B.spring==="heavy"?6:22,X.zeta=cw(B.overshoot!=null?B.overshoot:0),X.target=Math.round(X.x/Ki)*Ki},spinStratum(D,B){z[D]=B,L[D]=Math.floor(F[D].x/(Ki/Dt[D].n))},ignite(D={}){x.ignite(D.color,D.flash)},douse(){x.on=!1},shootAxis(D=Lr.extend,B=Lr.shootMs){return ti(B,X=>S(D*X),An.reveal).done},setBreathingRing(D){x.setRing(D)},setMorph(D,B,X,xe){if(q(),D==="dive"){let De=xe>1600?1.375:1,Ee=X/De,Ce=Ht(Ee/120),ze=An.camera(Ht((Ee-120)/360));k.scale=Ee<120?1-It.contract*An.camera(Ce):1-It.contract*(1-Mr(120,480,Ee)),k.nucleus=1+(It.nucleusAnticipation-1)*(Ee<120?Ce:1-Mr(120,480,Ee)),k.gap=ln(Ot.rest,Ot.dive,ze);for(let rt=0;rt<7;rt++){let yt=G[rt];rt===B?(yt.slide=It.diveSlide*ze,yt.yaw=-F[rt].x*ze,yt.edgeFlash=Ee<120?Ce:1-Mr(480,900,Ee)):(yt.yaw=(rt<B?-1:1)*It.diveTurnAwayDeg*pm*ze,yt.alpha=1-Mr(480*De,1e3*De,X))}}else if(D==="recall"){let De=Ae.recallSwapAt*xe/Ae.recall,Ee=X-De;if(Ee<0){k.gap=Ot.recallStart;return}let Ce=Ht(Ee/(xe-De||200));k.gap=Ot.rest+(Ot.recallStart-Ot.rest)*(1-An.camera(Ce))-(Ot.recallStart-Ot.rest)*xn.settleOvershoot*Math.sin(Math.PI*Ce);for(let ze=0;ze<7;ze++)Ee<Ae.recallRatchetMs*(ze+1)&&(G[ze].yaw=(ze%2?-1:1)*6*pm)}else We!==$.x&&($.snap(We),$.target=Ot.rest)},override(D,B){D>=0&&D<7&&(V[D]=B||null)},overrideGroup(D){P=D||null},setOverrideWeight(D){O=Ht(D)},onRebase(D){q();for(let B=0;B<7;B++)z[B]=0,F[B].snap(0);T.resetYaw(),$.snap(D==="shrink"?Ot.recallStart:Ot.rest),$.omega=4,$.target=Ot.rest,ke=Fe},shudder(D=6){Et.reducedMotion&&(D=Math.min(D,2));let B=Pe.camera?Pe.camera.position.distanceTo(wt):7.2;ie.amp=D*B/Math.max(1,ae.uPxPerUnit.value),ie.t0=Fe,I.flashSlots()},addYaw(D){T.addYaw(D)},wobble(D,B,X,xe){Et.reducedMotion||Object.assign(Te,{t0:Fe,amp:D,hz:B,decay:Math.max(1,X),ms:xe})},bow(){return Re.bowTo(8,600)},bowTo(D,B){return $e.t0=Fe,$e.deg=+D||8,$e.ms=Math.max(120,+B||600),new Promise(X=>Qe($e.ms,X))},nudgePitch(D){T.nudgePitch(D)},flashNucleus(D,B){x.flash(D,B,Fe)},setNucleusPulse(D){x.pulse=D>0?D:1},flashEdges(D,B="white",X){D>=0&&D<7&&(B!==h.token&&(h.token=B,f.setColor(B==="electrum"?"electrum":"white")),B==="electrum"&&X==null?h.until[D]=Fe+Ae.electrum:h.frames[D]=Math.max(h.frames[D],Math.max(1,X|0)))},setLaw(D,B,X){if(!(D>=0&&D<7))return;let xe=String(B??"");xe!==e[D]&&(e[D]=xe,b()?(n[D]=1,ee=!0):eo.paintLaw(D,xe)),ae.uCut.value[D]=Ht(+X||0)},yawTo(D,B){return T.yawTo(D,B)},isShowingBack(){return T.isShowingBack()},setScrambleQuant(D,B){se.step=Math.max(0,+D||0),se.lag=Math.max(0,+B||0)},setNucleus(D){x.level=D==null?null:Ht(+D||0)},strike(D){Et.reducedMotion||(re.amp=Math.max(0,+D||0),re.t0=Fe)}};return I.init(),Re.setReveal({points:0,scanY:null,fill:0,alpha:0}),Re.douse(),S(0),Re}var NL=["S01","S02","S03","S04","S05","S06","S07","S08","S09","S10","S11","S12","S13","S14"],fw=new Map;function tn(t,e){typeof t=="string"&&t&&typeof e=="function"&&fw.set(t,e)}tn("fx",()=>({stage:null,queue:[],impacts:[],prosvet:[],waveArrivalMs:null,timeScale:fe.timeScale,dust:{pool:0,live:0}}));tn("scaleBar",()=>null);tn("figure",()=>null);tn("deeds",()=>[]);tn("code",()=>[]);tn("show",()=>null);tn("guests",()=>0);tn("sbor",()=>null);tn("proposals",()=>0);tn("lost",()=>null);tn("rim",()=>[]);tn("boot",()=>null);tn("resonance",()=>null);function hw(t){tn("audio",()=>{let i=[];try{i=t.fx&&t.fx.cue&&typeof t.fx.cue.log=="function"?t.fx.cue.log():[]}catch{i=[]}return{...Ye.fx.snapshot(),cueLog:i}});let e=()=>{if(t.secrets&&typeof t.secrets.found=="function")return t.secrets.found();let i=Y.data&&Y.data.found||{};return NL.filter(r=>!!i[r])},n=Object.freeze({version:1,state(){let i=t.renderer,r=Y.data||{},s=i?i.stats:null,o={route:Q.route.hash,room:Q.room,phase:Q.phase,tier:Q.tier,u:Q.u,soundOn:Q.soundOn,night:Q.night,owner:Q.owner,inverted:Q.inverted,secrets:e(),shards:r.shards|0,nadirOpen:!!r.nadirOpen,pullNest:Q.pullNest,resonancePct:Q.resonancePct,status:Q.status,columns:Q.columns.slice(),satellites:Q.satellites,companion:Q.companion,whaleSeen:!!r.whaleSeen,_stats:s?{calls:s.calls,triangles:s.triangles,dpr:i.dpr,texMB:ZM(),geometries:s.geometries,points:s.points,frameMs:s.frameMs,fps:s.fps,tier:Q.tier,labels:t.overlay?t.overlay.visibleCount|0:0}:null,_travel:t.director&&t.director.lastTravel?{...t.director.lastTravel}:null,_world:{source:e_,issues:t_.length}};return fw.forEach((a,l)=>{try{o[l]=a()}catch(c){o[l]=null,ft(`hook:${l}`,"test-hook field threw",c)}}),o},go(i){let r=String(i);location.hash===r?t.director&&t.director.go(r,{source:"go"}):location.hash=r}});try{Object.defineProperty(window,"__SAMVIN__",{value:n,writable:!1,configurable:!1,enumerable:!1})}catch{}return n}var mm=38,Qx=-100,hi=1024,fr=256,dw=`
varying vec2 vUv; varying float vDist;
void main() { vUv = uv; vec4 v = modelViewMatrix * vec4(position, 1.0); vDist = length(v.xyz); gl_Position = projectionMatrix * v; }`,pw=`
${Oi}
uniform sampler2D uTex; uniform vec3 cSilver; uniform float uAlpha;
varying vec2 vUv; varying float vDist;
void main() {
  float a = texture2D(uTex, vUv).a * uAlpha;
  if (a <= 0.003) discard;
  gl_FragColor = vec4(applyFog(cSilver, vDist), a);
}`;function mw(t){let e=new mn;e.name="rim";let n=Dr(Mt.operator.name||""),i=-kn.coreRimR*Math.cos(Math.PI/12)+.5,r=document.createElement("canvas");r.width=hi,r.height=fr;let s=new ls(r);s.minFilter=Wt,s.magFilter=Wt,s.generateMipmaps=!1,s.wrapS=s.wrapT=_i,ya(s,hi*fr*4);let o=.5,a=[],l=1,c=[.5],u="   ";function f(){let L=r.getContext("2d");if(L.clearRect(0,0,hi,fr),L.fillStyle="#fff",L.textAlign="center",L.textBaseline="middle",!a.length)l=1,L.font=po.burn.replace("{px}",String(Math.round(fr*.78))),L.fillText(n,hi/2,fr/2+fr*.04),o=Math.min(1,L.measureText(n).width/hi),c.length=1,c[0]=.5;else{let V=[n].concat(a),G=V.join(u);L.font=po.burn.replace("{px}",String(Math.round(fr*.78)));let P=L.measureText(G).width;l=Math.min(1,hi*.98/Math.max(1,P)),L.font=po.burn.replace("{px}",String(Math.max(8,Math.round(fr*.78*l))));let O=L.measureText(G).width,k=L.measureText(u).width,$=hi/2-O/2;L.textAlign="left",c.length=0;for(let j of V){let Me=L.measureText(j).width;L.fillText(j,$,fr/2+fr*.04),c.push(($+Me/2)/hi),$+=Me+k}o=Math.min(1,O/hi)}s.needsUpdate=!0,w()}let h=new $t({uniforms:{uTex:{value:s},cSilver:ae.cSilver,uAlpha:{value:1},cAbyss:ae.cAbyss,uFogDensity:ae.uFogDensity},vertexShader:dw,fragmentShader:pw,transparent:!0,depthWrite:!1}),d=mm/.6,g=new nn(new cs(d*(hi/fr),d),h);g.position.set(0,Qx,i),g.visible=!1,g.name="rimName",e.add(g);let x=Math.max(1,Gu(Mt.clan.sigil).length),p=new Float32Array(x*3),m=Ap({positions:p,count:0,color:"ember",radius:ta.emitterM,intensity:1});e.add(m.object);let _=0;function w(){let L=d*(hi/fr)*o/2+12;for(let V=0;V<x;V++){let G=Math.floor(V/3),P=V%3;p[V*3]=L+G*6,p[V*3+1]=Qx+(1-P)*7,p[V*3+2]=i+.5}m.setPositions(p,x),m.setCount(_)}f(),Zl().then(f);let v=null;try{v=document.createElement("span"),v.className="sr-only",v.textContent=n,(document.getElementById("overlay")||document.body).appendChild(v)}catch{v=null}let M=null,S=null,E=null,y=null;function A(){if(!E){E=document.createElement("canvas"),E.width=hi,E.height=64,y=new ls(E),y.minFilter=Wt,y.magFilter=Wt,y.generateMipmaps=!1,ya(y,hi*64*4);let V=new $t({uniforms:{uTex:{value:y},cSilver:ae.cSilver,uAlpha:{value:.7*F},cAbyss:ae.cAbyss,uFogDensity:ae.uFogDensity},vertexShader:dw,fragmentShader:pw,transparent:!0,depthWrite:!1}),G=mm*.22/.6;S=new nn(new cs(G*(hi/64),G),V),S.position.set(0,Qx-d*.5-G*.2,i),S.name="rimRole",e.add(S)}let L=E.getContext("2d");L.clearRect(0,0,hi,64),L.fillStyle="#fff",L.font=po.burn.replace("{px}",String(Math.round(64*.78))),L.textAlign="center",L.textBaseline="middle",M&&L.fillText(M,hi/2,34),y.needsUpdate=!0,S.visible=!!M&&g.visible}let T=new C,I={x:0,y:0,depth:0,visible:!1},F=1,z={group:e,burn(L){let V=L&&Number.isFinite(L.at)?L.at:null,G=V!=null?Math.max(0,V-performance.now()):0;return G<=0?(z.showName(),Promise.resolve()):new Promise(P=>Qe(G,()=>{z.showName(),P()}))},showName(){g.visible=F>0,S&&(S.visible=!!M&&g.visible)},burnGuests(L,V){return a=(Array.isArray(L)?L:[]).map(G=>Dr(String(G||""))).filter(Boolean),f(),z.showName(),Promise.resolve()},clearGuests(){a.length&&(a=[],f())},rows(){let L=mm*l;return[n].concat(a).map(V=>({text:V,heightM:L,row:0}))},setRole(L){M=L?Dr(String(L)):null,(M||S)&&A()},namePoint(L,V){let G=V||{x:0,y:0},P=c[Math.max(0,Math.min(c.length-1,L|0))]!=null?c[Math.max(0,Math.min(c.length-1,L|0))]:.5;return T.set((P-.5)*d*(hi/fr),0,0),g.updateWorldMatrix(!0,!1),g.localToWorld(T),Pe.camera?(Pe.project(T,I),G.x=I.x,G.y=I.y):(G.x=0,G.y=0),G},letterHeightM(){return mm},setLitNodes(L){_=Math.max(0,Math.min(x,L|0)),m.setCount(_)},setAlpha(L){F=Math.max(0,Math.min(1,L)),h.uniforms.uAlpha.value=F,S&&(S.material.uniforms.uAlpha.value=.7*F),e.visible=F>0,m.setIntensity(F)}};return z.setLitNodes(Y.litNodes),tn("rim",()=>z.rows()),z}function gw(t){let e=t.app,n=Ir.rest,i=!1,r=null,s=!1,o=ct.core,a=new C(...o.pos),l=new C(...o.target),c={pos:new C,target:new C,fov:o.fov,offsetY:0,roll:0};function u(){return c.pos.copy(a),c.target.copy(l),c.fov=o.fov,c.offsetY=t.layout.kind==="desktop"?0:o.phoneOffsetY,c.roll=0,c}function f({index:g}){if(!i||t.director.busy()||e.phase!=="idle"&&e.phase!=="unfolded")return;if(g===3){t.director.go(s?"#/core":"#/core/open",{source:"key"});return}let x=Tp(g);x&&t.director.go(`#/${x.slug}`,{source:"key"})}function h(g){s=g,e.unfolded=g,t.key&&(t.key.overrideGroup(g?{gap:Ot.unfold}:null),t.key.setOverrideWeight(1))}return{id:"CORE",build(){r=t.bus.on("key:click",f)},pose(){return u()},livePose(g){return Math.abs(n-Ir.rest)<1e-4?!1:(g.target.copy(l),g.pos.copy(a).sub(l).multiplyScalar(n/Ir.rest).add(l),g.fov=o.fov,g.offsetY=t.layout.kind==="desktop"?0:o.phoneOffsetY,g.roll=0,!0)},enter(){},exit(){},arrive(){i=!0,n=Ir.rest},depart(){i=!1,s&&h(!1)},setSub(g){return g==="open"?(s||(h(!0),e.phase==="idle"&&Vi("unfolded")),0):g==null?(s&&(h(!1),e.phase==="unfolded"&&Vi("idle")),0):!1},update(){},onGesture(g){return t.key&&t.key.onGesture(g)?!0:g.type==="wheel"?(n=Math.max(Ir.min,Math.min(Ir.max,n*Math.pow(Ir.wheelFactor,g.deltaY/Ir.wheelStepPx))),!0):g.type==="pinch"?(n=Math.max(Ir.min,Math.min(Ir.max,n/Math.max(.2,g.dScale||1))),!0):!1},onKey(g){return g.key==="Escape"&&s?(t.director.go("#/core",{source:"kbd"}),!0):!1},resize(){},dispose(){r&&(r(),r=null),s&&h(!1),i=!1}}}function zo(t,e){if(t==="ZENITH")return e>0?"SIGNAL":null;let n=t==="WORKSHOP"?"MEMBERS":t,i=Nn.indexOf(n);if(i<0)return null;let r=i+(e>0?1:-1);return r>=0&&r<Nn.length?Nn[r]:null}function xw(t){let e=Tt.elevator,n=0,i=-1e9,r=0;function s(o){let a=zo(t.id,o);return n=0,r=0,a?(t.director.go(`#/${ce[a].slug}`,{source:"hall"}),!0):!1}return{onWheel(o){let a=t.loop.now;a-i>600&&(n=0,r=0),i=a;let l=o.deltaY||0;if(!l||(n!==0&&Math.sign(l)!==Math.sign(n)&&(n=0,r=0),!zo(t.id,Math.sign(l))))return!0;let c=Math.abs(n)<e.resistance*e.pxPerHall?.5:1;n+=l*c;let u=Math.floor(Math.abs(n)/e.tickPx);return u>r&&(r=u,t.audio&&t.audio.play("tick",{})),Math.abs(n)>=e.pxPerHall&&s(Math.sign(n)),!0},onSwipe(o){if(o.dir!=="up"&&o.dir!=="down")return!1;let a=o.dir==="up"?1:-1;return zo(t.id,a)?(Yr(Xr.lock),s(a)):!1},reset(){n=0,r=0,i=-1e9}}}var xm=Math.PI/180,to=Math.PI*2,FL=new Set(["SIGNAL","MEMBERS","INSIGNIA","NADIR","ZENITH","ARCHIVE"]),OL="Зал строится.",gm=[0,0,0];function _s(t,e,n,i,r,s=ct.fov,o=0){return t.pos.set(e[0],e[1],e[2]),t.target.set(n,i,r),t.fov=s,t.offsetY=o,t.roll=0,t}function vw(t,e,n,i,r){return _s(t,e,e[0],i,e[2]+(i-e[1])/Math.tan(n*xm),r)}function ff(t,e,n){return gm[0]=t,gm[1]=e,gm[2]=n,gm}function yw(t,e,n,i){let r=e==="phone",s;switch(t){case"MEMBERS":return s=ct.members.target,_s(i,r?ct.members.phonePos:ct.members.pos,s[0],s[1],s[2]);case"VOYAGES":return r?vw(i,ct.voyages.phonePos,-ct.voyages.phonePitchDeg,0):_s(i,ff(0,n,n*(44/70)),0,0,-6*(n/70));case"ARCHIVE":return _s(i,ff(0,1.6,0),0,1.6,ct.archive.tubeR);case"SIGNAL":return r?_s(i,ct.signal.phonePos,0,2+30*Math.tan(ct.signal.phonePitchDeg*xm),0,ct.fovWide):(s=ct.signal.target,_s(i,ct.signal.pos,s[0],s[1],s[2],ct.signal.fov));case"INSIGNIA":return _s(i,ct.insignia.pos,0,1.7,-10,ct.insignia.fov);case"NADIR":return _s(i,ff(0,20,40),0,0,0);case"ZENITH":return vw(i,ff(0,50,30),r?ct.zenith.phonePitchDeg:ct.zenith.pitchDeg,-110);case"WORKSHOP":return _s(i,ff(0,0,3.2),0,0,0);default:return s=ct.core.target,_s(i,ct.core.pos,s[0],s[1],s[2],ct.core.fov,e==="desktop"?0:ct.core.phoneOffsetY)}}function Fa(t,e,n,i=48,r=0,s=0){for(let o=0;o<i;o++){let a=to*o/i,l=to*(o+1)/i;t.push(r+Math.sin(a)*e,n,s+Math.cos(a)*e,r+Math.sin(l)*e,n,s+Math.cos(l)*e)}}function UL(t,e,n){let o=.75*Math.PI;for(let a of[1,-1])for(let l=0;l<10;l++){let c=to*l/10;t.push(e+Math.sin(c)*1.2,0,n+Math.cos(c)*1.2,e+Math.sin(c+a*o)*1.2,24,n+Math.cos(c+a*o)*1.2)}Fa(t,1.2,0,14,e,n),Fa(t,1.2,24,14,e,n),Fa(t,1.2*1.6,24,14,e,n)}function _w(t,e,n,i){let r=Is(e),s=new Float32Array(t*3);for(let o=0;o<t;o++){let a=r()*to,l=Math.asin(.15+.85*r());s[3*o]=Math.cos(l)*Math.sin(a)*i,s[3*o+1]=n+Math.sin(l)*i,s[3*o+2]=Math.cos(l)*Math.cos(a)*i}return s}function kL(t,e){let n=[],i=null,r=[];switch(t){case"columns":{let s=e.world.members,o=s.length,a=s.filter(c=>c.id!==e.world.operator.id),l=s.find(c=>c.id===e.world.operator.id);l&&a.splice(Math.floor(a.length/2),0,l),a.forEach((c,u)=>{let f=o>1?(-25+50*u/(o-1))*xm:0,h=48*Math.sin(f),d=48-48*Math.cos(f);UL(n,h,d),r.push({id:c.id,label:c.name,pos:new C(h,24,d)})});break}case"hatches":for(let s=0;s<9;s++){let o=14*Math.sqrt(s),a=s*137.508*xm;Fa(n,2.25,.05,24,Math.sin(a)*o,Math.cos(a)*o)}break;case"bands":for(let s=0;s<12;s++)Fa(n,ct.archive.tubeR,2-1.6*s,56);break;case"sky":{let s=ct.signal.apexH,o=ct.signal.apexR;Fa(n,o,s,36);for(let a=1;a<6;a++)Fa(n,60+(o-60)*(a/6),s*a/6,48);for(let a of[1,-1])for(let l=0;l<24;l++){let c=to*l/24,u=c+a*(to/6);n.push(Math.sin(c)*60,0,Math.cos(c)*60,Math.sin(u)*o,s,Math.cos(u)*o)}i=_w(300,20833,ct.signal.apexH,900);break}case"dome":{let s=new da(ct.insignia.sphereR,1),o=s.attributes.position.array,a=new Set,l=c=>`${o[c].toFixed(3)},${o[c+1].toFixed(3)},${o[c+2].toFixed(3)}`;for(let c=0;c<o.length;c+=9)for(let[u,f]of[[0,3],[3,6],[6,0]]){let h=l(c+u),d=l(c+f),g=h<d?h+"|"+d:d+"|"+h;a.has(g)||(a.add(g),n.push(o[c+u],o[c+u+1]+1.7,o[c+u+2],o[c+f],o[c+f+1]+1.7,o[c+f+2]))}s.dispose();break}case"chamber":{let s=ct.nadir.depth,o=40;for(let a=0;a<3;a++){let l=to*a/3,c=to*(a+1)/3;n.push(Math.sin(l)*o,0,Math.cos(l)*o,Math.sin(c)*o,0,Math.cos(c)*o),n.push(Math.sin(l)*o,0,Math.cos(l)*o,0,-s,0)}break}case"zenith":i=_w(400,11799,-40,1200);break;default:{i=new Float32Array(147);for(let s=0;s<49;s++)i[3*s]=(s%7-3)*.4,i[3*s+1]=(3-Math.floor(s/7))*.4,i[3*s+2]=0;break}}return{seg:n,pts:i,anchors:r}}function ei(t,e={}){let n=t.id,i=t.meta,r=e.props||"grid",s=null,o=null,a=null,l=null,c=[],u=0,f=0,h=null,d=!1,g=ct.voyages.pos[1],x=new C,p={pos:new C,target:new C,fov:ct.fov,offsetY:0,roll:0};function m(){let v=Ht(u)*(1-Ht(f));s&&s.setAlpha(.55*v),o&&o.setAlpha((r==="grid"?.9:.4)*v),a&&(a.style.opacity=String(Ht(u)*(1-Ht(f*2))));let M=u>=.7&&f===0;for(let S of c)S.setVisible(M)}function _(){let v=document.createElement("div");v.className="ph-block scrim";let M=document.createElement("p");return M.className="t-body",M.textContent=OL,v.appendChild(M),v}return{id:n,build(){let{seg:v,pts:M,anchors:S}=kL(r,t);if(t.group&&(v.length&&(s=ui({segments:new Float32Array(v),color:"silver",alpha:.55,width:1,far:Math.max(i.far,200)}),s.mesh.name=`ph:${r}`,t.group.add(s.mesh)),M)){let E=r==="sky"||r==="zenith";o=Wl({positions:M,sizePx:E?2:4,color:E?"white":"silver",alpha:.4,fog:!E,layer:E?Si.NOFOG:Si.DEFAULT}),t.group.add(o.object)}if(t.overlay&&S.length&&t.scale)for(let E of S){let y=E.pos.clone();c.push(t.overlay.add({owner:"placeholder",id:E.id,get:A=>{t.toCanonical(y,x),t.scale.toRender(x,A)},leader:{side:"right",len:40,rise:-24},button:{label:E.label,onActivate:()=>t.director.go(`#/members/${E.id}`,{source:"hall"})}}))}t.layout.isPhone||(a=_(),t.section.appendChild(a)),FL.has(n)&&(l=xw(t)),m()},pose(v){return yw(n,t.layout.kind,g,p)},lostSpots(){let v=yw(n,t.layout.kind,g,{pos:new C,target:new C,fov:0,offsetY:0,roll:0}),M=[];for(let S=0;S<6;S++){let E=to*S/6;M.push(new C(v.target.x+Math.sin(E)*11,0,v.target.z+Math.cos(E)*11))}return M},livePose(v){return n!=="VOYAGES"||g===ct.voyages.pos[1]||t.layout.kind==="phone"?!1:(v.pos.set(0,g,g*(44/70)),v.target.set(0,0,-6*(g/70)),v.fov=ct.fov,v.offsetY=0,v.roll=0,!0)},enter(v){u=v,v>0&&(f=0),m()},exit(v){f=v,m()},arrive(){d=!0,u=1,f=0,m(),t.layout.isPhone&&t.sheet&&t.sheet.set(_(),{peek:null,state:"peek"})},depart(){d=!1,l&&l.reset(),t.layout.isPhone&&t.sheet&&t.sheet.set(null)},setSub(v){return h=v==null?null:String(v),0},update(){},onGesture(v){if(!d)return!1;if(n==="VOYAGES"&&v.type==="wheel"){let M=ct.voyages.altRange;return g=Math.max(M[0],Math.min(M[1],g+v.deltaY*.08)),!0}return l?v.type==="wheel"?l.onWheel(v):v.type==="swipe"?l.onSwipe(v):!1:!1},onKey(){return!1},resize(){!d||!t.sheet||t.layout.isPhone&&!a&&t.sheet.set(_(),{peek:null,state:"peek"})},dispose(){s&&(s.dispose(),s.mesh.parent&&s.mesh.parent.remove(s.mesh),s=null),o&&(o.dispose&&o.dispose(),o.object.parent&&o.object.parent.remove(o.object),o=null);for(let v of c)v.remove();c.length=0,a&&a.parentNode&&a.parentNode.removeChild(a),a=null,d&&t.layout.isPhone&&t.sheet&&t.sheet.set(null),d=!1},get sub(){return h}}}function Mw(t){return ei(t,{props:"columns"})}function bw(t){return ei(t,{props:"grid"})}function Sw(t){return ei(t,{props:"hatches"})}function ww(t){return ei(t,{props:"bands"})}function Aw(t){return ei(t,{props:"sky"})}function Tw(t){return ei(t,{props:"dome"})}function Ew(t){return ei(t,{props:"chamber"})}function Rw(t){return ei(t,{props:"zenith"})}var Cw=Object.freeze({CORE:gw,MEMBERS:Mw,WORKSHOP:bw,VOYAGES:Sw,ARCHIVE:ww,SIGNAL:Aw,INSIGNIA:Tw,NADIR:Ew,ZENITH:Rw});var hr=new Map,Ms=[],io=null,BL=null,no=()=>{},Vo=[];function Pw(t,e,n){if(!Vo.length||!t||t.dead)return;let i=Vo;for(let r=0;r<i.length;r++){let s=i[r],o=s[e];if(typeof o=="function")try{o.call(s,t.hctx,n)}catch(a){ft(`ext:${s.name}`,`hall extension ${s.name} failed — removed`,a),Vo=Vo.filter(l=>l!==s)}}}function zL(t){let e={pos:new C(0,.75,7.2),target:new C,fov:ct.fov,offsetY:0,roll:0};return{id:t,build:no,pose:()=>e,enter:no,exit:no,arrive:no,depart:no,setSub:()=>0,update:no,onGesture:()=>!1,onKey:()=>!1,resize:no,dispose:no,stub:!0}}function VL(t){let e=document.createElement("section");e.className="hall",e.dataset.room=t,e.hidden=!0;let n=document.getElementById("halls");return n&&n.appendChild(e),e}function GL(t,e,n,i){let r=ce[t],s=Object.create(io);return s.id=t,s.meta=r,s.group=i,s.section=e,s.shell=n,s.toCanonical=(o,a)=>a.copy(o).add(r.anchor),s}function Iw(t,e){let n=VL(t),i=null,r=null;Q.tier!=="T0"&&dt.root&&(i=new mn,i.name=`hall:${t}`,i.position.copy(ce[t].anchor),i.visible=!1,dt.root.add(i),r=HS(t),i.add(r.group));let s=GL(t,n,r,i),o={id:t,hall:null,hctx:s,section:n,shell:r,group:i,shown:!1,dead:!1,throwArmed:BL===t};hr.set(t,o),Ms.push(o);try{o.hall=Q.tier==="T0"?zL(t):e(s);let a=o.hall.build();a&&typeof a.then=="function"&&a.then(null,l=>ev(t,l))}catch(a){return ev(t,a),hr.get(t)||null}return i&&(i.visible=!0),o}function Lw(t){Pw(t,"dispose"),t.dead=!0;try{t.hall&&t.hall.dispose()}catch(n){ft(`hall:${t.id}`,`hall ${t.id} dispose failed`,n)}t.shell&&t.shell.dispose(),t.group&&t.group.parent&&t.group.parent.remove(t.group),t.section&&t.section.parentNode&&t.section.parentNode.removeChild(t.section),hr.delete(t.id);let e=Ms.indexOf(t);e>=0&&Ms.splice(e,1)}function ev(t,e){ft(`hall:${t}`,`hall ${t} failed — recalled to CORE`,e);let n=hr.get(t);n&&Lw(n);let i=io&&io.director;if(t==="CORE"){Iw("CORE",s=>ei(s,{props:"grid"}));let r=hr.get("CORE");r&&Q.room==="CORE"&&(dt.show("CORE",!0),r.hall&&hf(r,"enter",1));return}i&&Promise.resolve().then(()=>i.go("#/core",{source:"error"}))}function hf(t,e,n,i,r){if(!t||t.dead||!t.hall||typeof t.hall[e]!="function")return;let s;try{s=t.hall[e](n,i,r)}catch(o){ev(t.id,o);return}return(e==="arrive"||e==="depart"||e==="update")&&Pw(t,e,n),s}function HL(t,e){for(let n=0;n<Ms.length;n++){let i=Ms[n];i.dead||!i.hall||hf(i,"update",t,e)}}var dt={root:null,init(t){return io=t,t.scale&&t.scale.root&&!dt.root&&(dt.root=new mn,dt.root.name="halls",t.scale.root.add(dt.root)),fe.add(HL,jt.WORLD),t.bus.on("layout:change",()=>{for(let e=0;e<Ms.length;e++)hf(Ms[e],"resize")}),dt},ensure(t){ce[t]||(t="CORE");let e=hr.get(t)||Iw(t,Cw[t]||(n=>ei(n,{props:"grid"})));return e&&e.hall?e.hall:null},get(t){let e=hr.get(t);return e&&!e.dead?e.hall:null},current(){return dt.get(Q.room)},release(t){let e=hr.get(t);if(!e||t===Q.room&&Q.phase!=="transition")return;let n=io&&io.director;n&&n.busy()&&n.state.to&&(n.state.to.room===t||n.logicalSource()===t)||Lw(e)},call(t,e,n,i,r){let s=hf(hr.get(t),e,n,i,r);return e==="lostSpots"?Array.isArray(s)?s:[]:s},addExtension(t){return!t||typeof t!="object"?no:(Vo=Vo.concat([t]),()=>{Vo=Vo.filter(e=>e!==t)})},shell(t){let e=hr.get(t);return e?e.shell:null},group(t){let e=hr.get(t);return e?e.group:null},residents(){return Ms.map(t=>t.id)},restPose(t,e,n){let i=ce[t]||ce.CORE,r=hr.get(i.id),s=r?hf(r,"pose",e||null):void 0;return s&&s.pos&&s.target?(n.pos.copy(s.pos).add(i.anchor),n.target.copy(s.target).add(i.anchor),n.fov=s.fov||ct.fov,n.offsetY=s.offsetY||0,n.roll=s.roll||0):i.id==="CORE"?(n.pos.fromArray(ct.core.pos),n.target.fromArray(ct.core.target),n.fov=ct.core.fov,n.offsetY=io&&io.layout&&io.layout.kind!=="desktop"?ct.core.phoneOffsetY:0,n.roll=0):(n.pos.set(0,i.alt+10,48),n.target.set(0,i.alt+12.5,0),n.fov=ct.fov,n.offsetY=0,n.roll=0),n},show(t,e=!1){for(let n=0;n<Ms.length;n++){let i=Ms[n];i.id===t?(i.shown=!0,i.section.hidden=!1):e&&(i.shown=!1,i.section.hidden=!0)}},hide(t){let e=hr.get(t);e&&(e.shown=!1,e.section.hidden=!0)}};function pc(){return{cam:{pos:new C,target:new C,fov:35,offsetY:0,roll:0},s:1,pivot:new C,Q:new C,fog:.00485,fade:{mini:0,key:1,vin:1,parent:0},alt:0,exitU:0,enterU:0,speed01:0,pan:0,counter:0,flashCode:null,morph:{kind:"none",i:3,tMs:0,D:1},vinStrata:new Float32Array([1,1,1,1,1,1,1]),vinGap:.02,rim:1,pillar:1,shellFrom:1,shellTo:1,iris:{fromTop:0,fromBottom:0,toTop:0,toBottom:0},vel:new C}}function Go(t,e){return e.cam.pos.copy(t.cam.pos),e.cam.target.copy(t.cam.target),e.cam.fov=t.cam.fov,e.cam.offsetY=t.cam.offsetY,e.cam.roll=t.cam.roll,e.s=t.s,e.pivot.copy(t.pivot),e.Q.copy(t.Q),e.fog=t.fog,e.fade.mini=t.fade.mini,e.fade.key=t.fade.key,e.fade.vin=t.fade.vin,e.fade.parent=t.fade.parent,e.alt=t.alt,e.exitU=t.exitU,e.enterU=t.enterU,e.speed01=t.speed01,e.pan=t.pan,e.counter=t.counter,e.flashCode=t.flashCode,e.morph.kind=t.morph.kind,e.morph.i=t.morph.i,e.morph.tMs=t.morph.tMs,e.morph.D=t.morph.D,e.vinStrata.set(t.vinStrata),e.vinGap=t.vinGap,e.rim=t.rim,e.pillar=t.pillar,e.shellFrom=t.shellFrom,e.shellTo=t.shellTo,e.iris.fromTop=t.iris.fromTop,e.iris.fromBottom=t.iris.fromBottom,e.iris.toTop=t.iris.toTop,e.iris.toBottom=t.iris.toBottom,e.vel.copy(t.vel),e}function pf(t,e){t.fade.mini=0,t.fade.key=1,t.fade.vin=1,t.fade.parent=0,t.morph.kind="none",t.vinStrata.fill(1),t.vinGap=.02,t.rim=e?1:0,t.pillar=1,t.shellFrom=1,t.shellTo=1,t.iris.fromTop=0,t.iris.fromBottom=0,t.iris.toTop=0,t.iris.toBottom=0,t.speed01=0,t.pan=0,t.counter=0,t.flashCode=null}var df=1024,vm=new Float32Array(df+1);for(let t=0;t<=df;t++)vm[t]=An.camera(t/df);function WL(t){if(t<=0)return 0;if(t>=1)return 1;let e=0,n=df;for(;n-e>1;){let s=e+n>>1;vm[s]<t?e=s:n=s}let i=vm[e],r=vm[n];return(e+(r>i?(t-i)/(r-i):0))/df}var Ho=(t,e)=>WL(t)*e,jr=(t,e)=>An.camera(Ht(t/e));function ki(t,e,n,i){let r=jr(e,i),s=jr(n,i);return s<=r?t>=s?1:0:Ht((t-r)/(s-r))}var Oa=(t,e,n)=>Math.exp(Math.log(t)+(Math.log(e)-Math.log(t))*n),Wo=t=>{let e=Ht(t);return e*e*(3-2*e)};function tv(t,e=7){let n=Ht(t)*e,i=Math.floor(n);return i>=e?1:(i+Wo((n-i)*3))/e}function $L(t){let e=new C,n=new C,i=new Float64Array(12),r=(o,a,l,c,u,f,h,d)=>{let g=(l-a)/f-(c-a)/(f+h)+(c-l)/h,x=(c-l)/h-(u-l)/(h+d)+(u-c)/d;g*=h,x*=h,i[o]=l,i[o+1]=g,i[o+2]=-3*l+3*c-2*g-x,i[o+3]=2*l-2*c+g+x},s=(o,a)=>i[o]+i[o+1]*a+i[o+2]*a*a+i[o+3]*a*a*a;return{points:t,getPoint(o,a=new C){let l=t.length,c=(l-1)*o,u=Math.floor(c),f=c-u;f===0&&u===l-1&&(u=l-2,f=1);let h=u>0?t[u-1]:n.subVectors(t[0],t[1]).add(t[0]),d=t[u%l],g=t[(u+1)%l],x=u+2<l?t[u+2]:e.subVectors(t[l-1],t[l-2]).add(t[l-1]),p=Math.pow(h.distanceToSquared(d),.25),m=Math.pow(d.distanceToSquared(g),.25),_=Math.pow(g.distanceToSquared(x),.25);return m<1e-4&&(m=1),p<1e-4&&(p=m),_<1e-4&&(_=m),r(0,h.x,d.x,g.x,x.x,p,m,_),r(4,h.y,d.y,g.y,x.y,p,m,_),r(8,h.z,d.z,g.z,x.z,p,m,_),a.set(s(0,f),s(4,f),s(8,f))}}}function ym(t,e){let n=[],i=[];for(let o=0;o<t.length;o++){if(n.length&&n[n.length-1].distanceToSquared(t[o])<1e-12){i[i.length-1]=e[o];continue}n.push(t[o].clone()),i.push(e[o])}n.length===1&&(n.push(n[0].clone()),i.push(i[0]+1e-6));let r=$L(n),s=n.length-1;return{curve:r,points:n,knots:i,sample(o,a){if(o<=i[0])return a.copy(n[0]);if(o>=i[s])return a.copy(n[s]);let l=0;for(;l<s-1&&o>i[l+1];)l++;let c=i[l+1]-i[l],u=c>0?(o-i[l])/c:1;return r.getPoint((l+u)/s,a)}}}function mf(t,e,n,i,r,s){return s.set(i.x+r.x*(n-e)+e*t.x,i.y+r.y*(n-e)+e*t.y,i.z+r.z*(n-e)+e*t.z)}function nv(t,e,n){let i=1-t;return Math.abs(i)<1e-9?n.set(0,0,0):n.copy(e).multiplyScalar(1/i)}var gf={restPose:null,faceFrame:null};function Fw(t){Object.assign(gf,t||{})}function _m(t,e){let n={pos:new C,target:new C,fov:ct.fov,offsetY:0,roll:0};if(gf.restPose)gf.restPose(t,e||null,n);else{let i=ce[t]||ce.CORE;i.id==="CORE"?(n.pos.fromArray(ct.core.pos),n.target.fromArray(ct.core.target)):(n.pos.set(0,i.alt+10,48),n.target.set(0,i.alt+12.5,0))}return n}var iv=t=>t==="WORKSHOP"?"MEMBERS":t==="ZENITH"?"SIGNAL":t;function rv(t,e){let n=iv(t),i=iv(e);return n==="CORE"&&i!=="CORE"?"DIVE":i==="CORE"&&n!=="CORE"?"RECALL":"LIFT"}function Ow(t,e){let n=ce[t]||ce.CORE,i=ce[e]||ce.CORE;return Math.abs(n.stratum-i.stratum)}function Uw(t,e){let n=Ow(t,e);return n<=1?Ae.liftBase:Math.min(Ae.liftMax,Ae.liftBase+Ae.liftPerBoundary*(n-1))}function XL(t,e,n){return t==="DIVE"?Ae.dive:t==="RECALL"?Ae.recall:t==="SLICE"?Ae.slice:Uw(e,n)}function kw(t,e,n,i,r=900,s=-1){i.set(0,0,0);let o=n.x-e.x,a=n.y-e.y,l=n.z-e.z,c=Math.sqrt(o*o+a*a+l*l),u=s>0?s:c;if(c<1e-9||c<xn.anticipationMinDisp*u)return i;let f=Ht(t)*r,h=xn.anticipationMs,d=f<h?An.reveal(f/h):f<3*h?1-Wo((f-h)/(2*h)):0,g=-(xn.anticipationFrac*u*d)/c;return i.set(o*g,a*g,l*g)}function sv(t,e,n,i){t.exitU=Ht(e/Ae.depart),t.enterU=i>=0?e<i?0:Ht((e-i)/Math.max(1,n-i)):Ht((e-(n-Ae.arrive))/Ae.arrive)}var ov=t=>Math.sin(Math.PI*Ht(t));function Dw(t,e,n,i){let r=Ht(t/120),s=An.camera(Ht((t-120)/360)),o=t<120?1-It.contract*An.camera(r):1-It.contract*(1-YL(120,480,t)),a=ln(Ot.rest,Ot.dive,s);return i.copy(n).multiplyScalar(It.diveSlide*s),i.y+=(3-e)*(a-Ot.rest),o}function YL(t,e,n){let i=Ht((n-t)/(e-t));return i*i*(3-2*i)}function qL(t,e){let n=Dt[t],i=n.top+(n.bot-n.top)/3,r=n.top+(n.bot-n.top)*2/3,s=(Ft(i)+Ft(r))/2;return e.F.set(0,n.mid,s*Math.cos(Math.PI/n.n)),e.n.set(0,0,1),e}function av(t,e,n={}){let i=Math.max(0,Math.min(6,e|0)),r=n.to||Tp(i).id,s=!!n.first&&!n.D,o=Math.max(0,Math.min(1100,n.tb0||0)),a=n.D||(s?Ae.diveFirst:Ae.dive-o),l=Ae.diveFirstScale,c=Ae.diveFirstHold,u=1e3*l,f=s?he=>he<u?he/l:he<u+c?1e3:(he-c)/l:he=>o+he*(Ae.dive-o)/a,h=s?he=>he<1e3?he*l:he*l+c:he=>(he-o)*a/(Ae.dive-o),d=h(Ae.diveSwapAt),g=jr(d,a),x=t.s,p=t.Q.clone(),m={F:new C,n:new C};gf.faceFrame&&Math.abs(x-1)<1e-6&&p.lengthSq()<1e-12&&!n.D?gf.faceFrame(i,m):qL(i,m);let _=m.F,w=m.n.normalize(),v=Math.hypot(_.x,_.z),M=Math.min(.3,.5*v),S=new C,E=Dw(o,i,w,S),y=w.clone().multiplyScalar(It.diveSlide).add(_);y.y+=(3-i)*(Ot.dive-Ot.rest);let A=_m(r,n.sub),T=(ce[r]||ce.CORE).fog,I=t.cam.pos.clone().sub(p).multiplyScalar(1/(x*E)).sub(S),F=t.cam.target.clone().sub(p).multiplyScalar(1/(x*E)).sub(S),z=[I],L=[0],V=[F],G=[0];I.distanceTo(_)>2.2&&o<480&&(z.push(_.clone().addScaledVector(w,2)),L.push(jr(h(480),a))),o<700&&(z.push(_.clone().addScaledVector(w,.4)),L.push(jr(h(700),a))),z.push(_.clone().addScaledVector(w,-M)),L.push(g),z.push(A.pos.clone().multiplyScalar(1/1e3)),L.push(1),o<480&&(V.push(_.clone()),G.push(jr(h(480),a))),V.push(_.clone().addScaledVector(w,-M-.6)),G.push(g),V.push(A.target.clone().multiplyScalar(1/1e3)),G.push(1);let O=ym(z,L),k=ym(V,G),$=Math.max(0,h(Math.max(480,o))),j=t.cam.fov,Me=t.cam.offsetY,ve=t.cam.roll,Fe=t.fog,We=t.alt,ke=t.rim,ee=t.pillar,ie=t.fade.vin,Te=t.cam.pos.distanceTo(t.cam.target),$e=z[1].clone(),re=o<480?jr(h(480),a):-1,se=[];for(let he=Math.max(o,860);he<=1120;he+=1e3/Uy)se.push(jr(h(he),a));let te=new C,me=new C,Se=new C,nt=new C;return{kind:"DIVE",from:"CORE",to:r,duration:a,swapAt:g,swapKind:"grow",stratum:i,first:s,pose(he,Ie){let qe=Ho(he,a),Ne=f(qe);if(pf(Ie,!1),he<g){let St=Dw(Ne,i,w,nt),U=Oa(x,1e3,ki(he,$,d,a));Ie.s=U,Ie.pivot.copy(y),Ie.Q.copy(p).addScaledVector(y,x-U),O.sample(he,te).add(nt).multiplyScalar(St),mf(te,U,x,p,y,Ie.cam.pos),o===0&&qe<3*xn.anticipationMs&&(kw(qe/a,me.copy(I),$e,Se,a,Te),Ie.cam.pos.addScaledVector(Se,U)),k.sample(he,te).add(nt).multiplyScalar(St),mf(te,U,x,p,y,Ie.cam.target);let Qt=Math.log(U/x)/Math.log(1e3/x);Ie.fog=Oa(Fe,T,Ht(Qt));let wt=1-ki(he,$,d,a);Ie.fade.vin=ie*wt,Ie.rim=ke*wt,Ie.pillar=ee*wt,Ie.shellFrom=wt,Ie.shellTo=0,Ie.morph.kind="dive",Ie.morph.i=i,Ie.morph.tMs=s?Ne*l:Ne,Ie.morph.D=s?Ae.diveFirst:Ae.dive}else{Ie.s=1,Ie.pivot.set(0,0,0),Ie.Q.set(0,0,0),O.sample(he,Ie.cam.pos).multiplyScalar(1e3),k.sample(he,Ie.cam.target).multiplyScalar(1e3),Ie.fog=T;let St=ki(he,d,Math.min(a,d+Ae.depart),a);for(let U=0;U<7;U++)Ie.vinStrata[U]=U===i?1:St;Ie.rim=0,Ie.pillar=St,Ie.shellFrom=0,Ie.shellTo=St}let ut=ki(he,d,a,a);return Ie.cam.fov=ln(j,A.fov,ut),Ie.cam.offsetY=ln(Me,A.offsetY,ut),Ie.cam.roll=ln(ve,A.roll,ut),Ie.alt=ln(We,(ce[r]||ce.CORE).alt,he),sv(Ie,qe,a,d),Ie.speed01=ov(ki(he,$*.5,d,a)),Ie},cues(he,Ie,qe){if(!(he<=Ie||!qe||!qe.audio)){re>=0&&Ie<re&&he>=re&&qe.audio.play("subDrop",{});for(let Ne=0;Ne<se.length;Ne++)if(Ie<se[Ne]&&he>=se[Ne]){qe.audio.play("strutTick",{});break}}}}}function lv(t,e,n={}){let i=n.D||Ae.recall,r=i/Ae.recall,s=Ae.recallSwapAt*r,o=Ae.depart*r,a=jr(s,i),l=_m("CORE",null),c=t.s,u=t.Q.clone(),f=t.cam.pos.clone(),h=t.cam.target.clone(),d=1/1e3,g=f.clone().sub(l.pos).sub(u).multiplyScalar(1/(c-d)),x=l.target.clone(),p=t.cam.fov,m=t.cam.offsetY,_=t.cam.roll,w=t.fog,v=t.alt,M=t.rim,S=t.pillar,E=ce.CORE.fog,y=new C;return{kind:"RECALL",from:e,to:"CORE",duration:i,swapAt:a,swapKind:"shrink",pose(A,T){let I=Ho(A,i);if(pf(T,!1),A<a){let F=ki(A,o,s,i),z=Oa(c,d,F);T.s=z,T.pivot.copy(g),T.Q.copy(u).addScaledVector(g,c-z),T.cam.pos.copy(f),y.copy(x).multiplyScalar(z).add(T.Q),T.cam.target.copy(h).lerp(y,Wo(ki(A,o,s*.92,i))),T.cam.fov=ln(p,l.fov,F),T.cam.offsetY=ln(m,l.offsetY,F),T.cam.roll=ln(_,0,F),T.fog=Oa(w,E,Ht(Math.log(z/c)/Math.log(d/c))),T.fade.parent=ki(A,s*.55,s,i),T.vinGap=ln(Ot.rest,Ot.recallStart,F),T.rim=M*(1-ki(A,0,o,i)),T.pillar=S,T.shellFrom=1,T.shellTo=0}else{T.s=1,T.pivot.set(0,0,0),T.Q.set(0,0,0),T.cam.pos.copy(l.pos),T.cam.target.copy(l.target),T.cam.fov=l.fov,T.cam.offsetY=l.offsetY,T.cam.roll=0,T.fog=E;let F=ki(A,s,i,i);T.rim=F,T.pillar=F,T.shellFrom=0,T.shellTo=F,T.morph.kind="recall",T.morph.i=3,T.morph.tMs=I/r,T.morph.D=Ae.recall}return T.alt=ln(v,0,A),sv(T,I,i,-1),T.speed01=ov(ki(A,o,s,i)),T},cues(A,T,I){A<=T||!I||!I.audio||T<a&&A>=a&&I.audio.play("recallThud",{})}}}var Nw=t=>t==="WORKSHOP"?"MEMBERS":t,Ua=["ZENITH","SIGNAL","ARCHIVE","MEMBERS","CORE","VOYAGES","INSIGNIA","NADIR"];function cv(t,e,n,i={}){let r=i.D||Uw(e,n),s=t.s,o=t.Q.clone(),a=nv(s,o,new C),l=t.cam.pos.clone().sub(o).multiplyScalar(1/s),c=t.cam.target.clone().sub(o).multiplyScalar(1/s),u=_m(n,i.sub),f=Ow(e,n),h=u.pos.y>l.y,d=h?1:-1,[g,,x]=kn.liftOffset,p=[l];i.vel&&i.vel.length()/s>1&&p.push(l.clone().addScaledVector(i.vel,.12/s));let m=-1,_=-1;if(f>=1){let se=ce[Nw(e)],te=ce[Nw(n)],me=h?se.ceil:se.floor,Se=h?te.floor:te.ceil;!(Math.abs(l.x-g)<4&&Math.abs(l.z-x)<4)&&(me-l.y)*d>-5&&(p.push(new C(g,me,x)),m=p.length-1),m<0||Math.abs(Se-me)>2?(p.push(new C(g,Se,x)),_=p.length-1):_=m,m<0&&(m=_)}p.push(u.pos.clone());let w=[0],v=0;for(let se=1;se<p.length;se++)v+=p[se].distanceTo(p[se-1]),w.push(v);for(let se=0;se<w.length;se++)w[se]=v>0?w[se]/v:se/(w.length-1);let M=ym(p,w),S=m>=0?w[m]:.3,E=_>=0?w[_]:.7,y=t.cam.fov,A=t.cam.offsetY,T=t.cam.roll,I=t.fog,F={...t.fade},z=Float32Array.from(t.vinStrata),L=t.vinGap,V=t.rim,G=i.shellFrom0!=null?i.shellFrom0:1,P=t.morph.kind==="dive"?{i:t.morph.i,tMs:t.morph.tMs,D:t.morph.D}:null,O=(ce[n]||ce.CORE).fog,k=t.cam.pos.distanceTo(t.cam.target),$=p[1].clone(),j=Math.min(Ua.indexOf(e==="WORKSHOP"?"MEMBERS":e),Ua.indexOf(n==="WORKSHOP"?"MEMBERS":n)),Me=Math.max(Ua.indexOf(e==="WORKSHOP"?"MEMBERS":e),Ua.indexOf(n==="WORKSHOP"?"MEMBERS":n)),ve=[],Fe=[],We=new C,ke=new C,ee=se=>{M.sample(0,We);for(let te=1;te<=240;te++){let me=te/240;if(M.sample(me,ke),(We.y-se)*(ke.y-se)<=0&&We.y!==ke.y)return me-1/240*((ke.y-se)/(ke.y-We.y));We.copy(ke)}return-1};for(let se=j+1;se<Me;se++){let te=ce[Ua[se]],me=ee(te.alt);me>=0&&ve.push({room:te.id,t0:Ho(me,r)})}for(let se=j;se<Me;se++){let te=ce[Ua[se]],me=ce[Ua[se+1]],Se=ee((te.floor+me.ceil)/2);Se>=0&&Fe.push(Se)}let ie=f>=1?[S,E]:[],Te=new C,$e=new C,re=new C;return{kind:"LIFT",from:e,to:n,duration:r,swapAt:-1,swapKind:null,boundaries:f,pose(se,te){let me=Ho(se,r);pf(te,!1);let Se=Oa(s,1,ki(se,0,r*.5,r));te.s=Se,te.pivot.copy(a),te.Q.copy(o).addScaledVector(a,s-Se),M.sample(se,Te);let nt=Te.y;me<3*xn.anticipationMs&&(kw(me/r,l,$,$e,r,k),Te.add($e)),mf(Te,Se,s,o,a,te.cam.pos),f>=1?(re.set(0,nt+d*30,0),Te.copy(c).lerp(re,Wo(S>0?se/S:1)),Te.lerp(u.target,Wo(E<1?(se-E)/(1-E):0))):Te.copy(c).lerp(u.target,Wo(se)),mf(Te,Se,s,o,a,te.cam.target);let he=Wo(se);te.cam.fov=ln(y,u.fov,he),te.cam.offsetY=ln(A,u.offsetY,he),te.cam.roll=ln(T,u.roll,he),te.fog=Oa(I,O,he);let Ie=ki(se,0,Ae.depart,r);te.fade.mini=ln(F.mini,0,Ie),te.fade.key=ln(F.key,1,Ie),te.fade.vin=ln(F.vin,1,Ie),te.fade.parent=ln(F.parent,0,Ie);for(let qe=0;qe<7;qe++)te.vinStrata[qe]=ln(z[qe],1,Ie);if(te.vinGap=ln(L,Ot.rest,Ie),te.rim=V*(1-Ie),te.shellFrom=ln(G,1,Ie),te.shellTo=1,P&&(te.morph.kind="dive",te.morph.i=P.i,te.morph.D=P.D,te.morph.tMs=P.tMs*(1-ki(se,0,r*.6,r))),f>=1){let qe=tv(me/Ae.depart),Ne=me<r-300?1:1-tv((me-(r-300))/300);h?(te.iris.fromTop=qe,te.iris.toBottom=Ne):(te.iris.fromBottom=qe,te.iris.toTop=Ne),te.counter=me>120&&me<r-240?.12:0}te.alt=(te.cam.pos.y-te.Q.y)/Se,te.flashCode=null;for(let qe=0;qe<ve.length;qe++)me>=ve[qe].t0&&me<ve[qe].t0+180&&(te.flashCode=ve[qe].room);return sv(te,me,r,-1),te.speed01=ov(se),te.pan=0,te},cues(se,te,me){if(!(se<=te||!me||!me.audio)){for(let Se=0;Se<ie.length;Se++)te<ie[Se]&&se>=ie[Se]&&me.audio.play("irisWhoosh",{});for(let Se=0;Se<Fe.length;Se++)te<Fe[Se]&&se>=Fe[Se]&&me.audio.play("tick",{})}}}}function Bw(t,e){let n=Ae.slice,i=Ae.sliceSwap,r=e.room,s=Go(t,pc()),o=_m(r,e.sub),a=nv(t.s,t.Q,new C),l=(ce[r]||ce.CORE).fog,c=jr(i,n);return{kind:"SLICE",from:null,to:r,duration:n,swapAt:-1,swapKind:null,cutAt:c,pose(u,f){return Ho(u,n)<i?(Go(s,f),f.exitU=0,f.enterU=0,f.counter=0,f.flashCode=null,f):(pf(f,r==="CORE"),f.s=1,f.pivot.copy(a),f.Q.set(0,0,0),f.cam.pos.copy(o.pos),f.cam.target.copy(o.target),f.cam.fov=o.fov,f.cam.offsetY=o.offsetY,f.cam.roll=o.roll,f.fog=l,f.alt=(ce[r]||ce.CORE).alt,f.shellFrom=0,f.shellTo=1,f.exitU=1,f.enterU=1,f)},cues(u,f,h){f<c&&u>=c&&h&&h.t0&&h.app&&h.app.tier==="T0"&&h.t0.show(e)}}}function zw(t,e,n,i={}){let r=n.room,s=rv(e,r),o=Math.max(Ae.retargetMin,Ae.retargetFactor*XL(s,e,r)),a;if(s==="DIVE"){let l=ce[iv(r)].stratum;a=av(t,l,{to:r,sub:n.sub,D:o,tb0:t.s>1.0001?480:0})}else s==="RECALL"?a=lv(t,e,{D:o}):a=cv(t,e,r,{sub:n.sub,D:o,vel:t.vel,shellFrom0:i.shellFrom0});return a.retarget=!0,a.from=e,a}var jL=[];function Vw(){return jL}var di=pc(),Ln=pc(),ka=pc(),vv={pos:new C,target:new C,fov:35,offsetY:0,roll:0},Mm={pos:new C,target:new C,fov:35,offsetY:0,roll:0},Ji={strata:new Float32Array([1,1,1,1,1,1,1]),gap:.02,rim:1,pillar:1,morph:"none"},Je=null,Ar=null,xf={},mc=null,fv=0,_f=0,Am=0,bs="forward",bm=0,Mf=0,hv=!1,dv=!1,dr=null,gc=null,bf=-1,Sf=null,wf="",$o=0,Sm=new Set,de={phase:"idle",path:null,from:null,to:null,u:0,t:0,speed:1,scrubbing:!1,swapped:!1},Ba={active:!1,kind:null},Gw=new WeakSet,Xo=!1,pv=600,mv=null;function ZL(t,e,n,i){if(!t||Gw.has(t))return;Gw.add(t);let r=Vw();if(!r.length)return;let s={kind:t.kind,from:e?e.room:Q.room,to:n?n.room:Q.room,first:t.kind==="DIVE"?!(Y.data&&Y.data.firstDive):!Sm.has(n?n.room:Q.room),reduced:!!(Et.reducedMotion||Q.tier==="T0"),retarget:!!i};for(let o=0;o<r.length;o++)try{r[o](t,s)}catch{}}var yv=t=>!!(de.path&&de.path.planned&&typeof de.path.planned.has=="function"&&de.path.planned.has(t)),Yw=(t,e)=>t&&typeof t[e]=="function",rn=(t,e,n,i,r)=>Yw(t,e)?t[e](n,i,r):void 0;function KL(t){let e=Je.pillar;if(!e||Ji.pillar===t)return;Ji.pillar=t;let n=e.userData;if(n.ribbon&&n.ribbon.setAlpha(t),n.beads){n.beads.visible=t>.001;let i=n.beads.material;i.uniforms.uAlpha.value=t,i.transparent=t<.999}e.visible=t>.001}function JL(t){Je.rim&&Ji.rim!==t&&(Ji.rim=t,Je.rim.setAlpha(t))}function _v(t){if(!Je.renderer)return;it.scaleAbout(t.s,t.pivot),Pe.setPose(t.cam),t.fog>=0&&br.set(t.fog),Fn.setFade(-1,t.fade.mini),Fn.setFade(0,t.fade.key),Fn.setFade(1,t.fade.vin),Fn.setFade(2,t.fade.parent);let e=Fn.structure(1);if(e){for(let r=0;r<7;r++)Ji.strata[r]!==t.vinStrata[r]&&(Ji.strata[r]=t.vinStrata[r],e.setStratumFade(r,t.vinStrata[r]));Ji.gap!==t.vinGap&&(Ji.gap=t.vinGap,e.setGap(t.vinGap))}Je.key&&(t.morph.kind!=="none"?Je.key.setMorph(t.morph.kind,t.morph.i,t.morph.tMs,t.morph.D):Ji.morph!=="none"&&Je.key.setMorph("none",3,0,1),Ji.morph=t.morph.kind),JL(t.rim),KL(t.pillar);let n=de.to?dt.shell(de.to.room):null,i=dr?dt.shell(dr):null;i&&i!==n&&(i.setAlpha(t.shellFrom),i.setIris("top",t.iris.fromTop),i.setIris("bottom",t.iris.fromBottom)),n&&(n.setAlpha(t.shellTo),n.setIris("top",t.iris.toTop),n.setIris("bottom",t.iris.toBottom))}function qw(){QL(Ln),Je.renderer&&(Ln.cam.pos.copy(Pe.pose.pos),Ln.cam.target.copy(Pe.pose.target),Ln.cam.fov=Pe.pose.fov,Ln.cam.offsetY=Pe.pose.offsetY,Ln.cam.roll=Pe.pose.roll,Ln.s=it.s,Ln.Q.copy(it.Q),it.fixedPoint(Ln.pivot),Ln.fog=br.density,Ln.fade.mini=Fn.fade(-1),Ln.fade.key=Fn.fade(0),Ln.fade.vin=Fn.fade(1),Ln.fade.parent=Fn.fade(2),Ln.vel.copy(Pe.velocity)),Ln.alt=Mn.altitude()}function QL(t){t.vinStrata.set(Ji.strata),t.vinGap=Ji.gap,t.rim=Ji.rim,t.pillar=Ji.pillar,t.morph.kind="none",t.exitU=0,t.enterU=0,t.counter=0,t.flashCode=null,t.shellFrom=1,t.shellTo=0,t.iris.fromTop=t.iris.fromBottom=t.iris.toTop=t.iris.toBottom=0}function za(){let t=Mn.current||{room:"CORE",sub:null};dt.restPose(t.room,t.sub,vv)}function eD(t){Mv();let e=t==="LIFT"?"liftRumble":t==="DIVE"||t==="RECALL"?"whoosh":null;e&&Je.audio&&(gc=Je.audio.start(e,{speed01:0}))}function Mv(){if(gc){try{gc.stop()}catch{}gc=null}}function tD(){let t=document.getElementById("fx");if(!t)return;let e=document.createElement("i");e.className="slice",t.appendChild(e),Qe(Ae.slice+40,()=>{e.parentNode&&e.parentNode.removeChild(e)})}function jw(t,e,n,i){if(Et.reducedMotion||Q.tier==="T0")return Bw(t,n);if(i)return zw(t,i,n,{shellFrom0:t.shellTo});let s=dt.get(n.room);if(Yw(s,"entryPath")){let a=dt.call(n.room,"entryPath",e.room,t);if(a)return a}let o=rv(e.room,n.room);if(o==="DIVE"){let a=n.room==="WORKSHOP"?"MEMBERS":n.room==="ZENITH"?"SIGNAL":n.room;return av(t,ce[a].stratum,{first:!(Y.data&&Y.data.firstDive),fromUnfold:!!Q.unfolded,sub:n.sub,to:n.room})}return o==="RECALL"?lv(t,e.room):cv(t,e.room,n.room,{sub:n.sub})}function bv(t,e,n,i){ZL(t,e,n,!!i.retargeted),Xo=!!i.play,Xo&&(pv=i.skipMs!=null?i.skipMs:600),de.path=t,de.from=e,de.to=n,de.t=0,de.u=0,de.speed=1,de.swapped=!1,de.phase="transition",de.scrubbing=!!i.scrub,Mf=0,bs="forward",fv=0,_f=fe.at(),Am=_f,hv=!1,mc=null,dv=!0,wm++,de.scrubbing||Av(_f,!0),xf=i,Q.u=0,t.kind==="SLICE"&&tD(),eD(t.kind),ge.emit("travel:start",{from:e,to:n,kind:t.kind,duration:t.duration})}var Hw=new WeakSet;function Zw(t){let e=dt.group(t);if(!(!e||!Je.renderer||!Pe.camera||Hw.has(e))){Hw.add(e);try{Je.renderer.warm(e,Pe.camera,Je.scene)}catch{}}}function Ww(t,e){let n=Mn.current;qw(),dt.ensure(t.room),Zw(t.room),dr=n.room;let i=jw(Ln,n,t,null);return Vi("transition"),dt.call(n.room,"depart"),rn(Je.datum,"depart"),Je.renderer&&Fn.setHallLod(null),ge.emit("room:depart",{room:n.room,to:t}),bv(i,n,t,e),new Promise(r=>{Ar=r})}function Kw(){let t=de.path;if(!t)return Q.room;let e=dr||de.from&&de.from.room||Q.room,n=de.to.room;if(t.swapAt>=0)return de.swapped?n:e;if(t.kind==="SLICE")return de.u>=(t.cutAt||.5)?n:e;if(t.kind!=="LIFT")return de.u<.5?e:n;let i=Ln.alt;for(let o of[e,n]){let a=ce[o];if(a&&i>=a.floor&&i<=a.ceil)return o}let r=e,s=1/0;for(let o of Nn.concat(["ZENITH"])){let a=ce[o],l=i<a.floor?a.floor-i:i>a.ceil?i-a.ceil:0;l<s&&(s=l,r=o)}return r}function nD(t,e){let n=Kw(),i=de.to.room,r=dr;if(Ar){let a=Ar;Ar=null,a(!1)}ge.emit("travel:end",{from:de.from,to:de.to,kind:de.path.kind,completed:!1}),n===i&&i!==t.room&&(dt.call(i,"depart"),dt.call(i,"exit",1)),dr=n,dt.ensure(t.room),Zw(t.room);for(let a of dt.residents())a!==t.room&&a!==n&&a!==r&&dt.release(a);r&&r!==n&&r!==t.room&&(dt.call(r,"exit",1),Sv(r)),Go(Ln,ka),Je.renderer&&(ka.vel.copy(Pe.velocity),ka.Q.copy(it.Q),ka.s=it.s);let s={room:n,sub:null,hash:`#/${ce[n].slug}`},o=jw(ka,s,t,n);return mc=null,bv(o,s,t,{...e,retargeted:!0,play:!1}),new Promise(a=>{Ar=a})}function Sv(t){Qe(Ae.releaseSourceMs,()=>{t===Q.room&&de.phase!=="transition"||de.phase==="transition"&&(de.to.room===t||dr===t)||dt.release(t)})}function wv(t,e,n){let i=t.hash;try{let r=location.hash;e==="history"?r!==i&&!(r===""&&i==="#/core")&&window.history.replaceState(null,"",i):n||e==="hash"||e==="go"||e==="deeplink"||r===i?window.history.replaceState(null,"",i):window.history.pushState(null,"",i)}catch{}wf=location.hash}function Jw(){let t=de.path,e=de.from,n=de.to;if(t.pose(1,di),_v(di),Go(di,Ln),Mv(),Ba.active=!1,Xo){iD(t,e,n);return}let i=!Sm.has(n.room);Sm.add(n.room),$o+=1,Q.room=n.room,Q.route=n,Q.u=0,Mn.current=n,de.phase="idle",de.scrubbing=!1,de.u=0;let r=t.kind;Je.renderer&&Fn.setHallLod(n.room),dt.show(n.room,!0),dt.call(n.room,"enter",1),Vi("idle"),dt.call(n.room,"arrive",{first:i,sub:n.sub,kind:r,arrivals:$o});let s=n;n.sub&&dt.call(n.room,"setSub",n.sub,{instant:!0})===!1&&(s=xs(`#/${ce[n.room].slug}`),Mn.current=s,Q.route=s,xf={...xf,replace:!0}),rn(Je.datum,"counter",ce[n.room].alt,0),rn(Je.datum,"flashCode",null),rn(Je.datum,"arrive",n.room),rn(Je.chrome,"setRoom",n.room),rn(Je.keyNav,"setNeedle",ce[n.room].alt),rn(Je.keyNav,"setCurrent",n.room),rn(Je.keyNav,"lockTwin"),Je.audio&&!yv("arrivalLock")&&Je.audio.play("arrivalLock",{root:ce[n.room].root}),rn(Je.edges,"twitch"),be.isPhone&&Yr(Xr.lock),document.title=Wu(s),wv(s,xf.source,!!xf.replace),Y.set("lastRoom",s.hash),r==="DIVE"&&Y.data&&!Y.data.firstDive&&Y.set("firstDive",!0),za(),Mn.lastTravel={kind:r,from:e.hash,to:s.hash,plannedMs:t.duration,ms:fe.at()-Am,completed:!0},de.path=null,ge.emit("room:arrive",{room:n.room,sub:s.sub,first:i,kind:r,arrivals:$o}),ge.emit("route:change",{route:s,prev:e}),ge.emit("travel:end",{from:e,to:s,kind:r,completed:!0}),Q.tier==="T0"&&Je.t0&&rn(Je.t0,"show",s);for(let a of dt.residents())a!==n.room&&Sv(a);let o=Ar;Ar=null,o&&o(!0)}function iD(t,e,n){Xo=!1;let i=n.room;Q.u=0,de.phase="idle",de.scrubbing=!1,de.u=0,Je.renderer&&Fn.setHallLod(i),dt.show(i,!0),dt.call(i,"enter",1),Vi("idle"),$o+=1,dt.call(i,"arrive",{first:!1,sub:Mn.current.sub,kind:t.kind,arrivals:$o}),rn(Je.datum,"counter",ce[i].alt,0),rn(Je.datum,"flashCode",null),rn(Je.datum,"arrive",i),rn(Je.keyNav,"setNeedle",ce[i].alt),rn(Je.keyNav,"setCurrent",i),rn(Je.keyNav,"lockTwin"),Je.audio&&!yv("arrivalLock")&&Je.audio.play("arrivalLock",{root:ce[i].root}),rn(Je.edges,"twitch"),be.isPhone&&Yr(Xr.lock),za(),Mn.lastTravel={kind:t.kind,from:e.hash,to:Mn.current.hash,plannedMs:t.duration,ms:fe.at()-Am,completed:!0},de.path=null,ge.emit("room:arrive",{room:i,sub:Mn.current.sub,first:!1,kind:t.kind,arrivals:$o}),ge.emit("travel:end",{from:e,to:Mn.current,kind:t.kind,completed:!0});let r=Ar;Ar=null,r&&r(!0)}function rD(){let t=de.path,e=de.from,n=de.to;t.pose(0,di),_v(di),Go(di,Ln),Mv(),Ba.active=!1,Xo=!1,de.phase="idle",de.scrubbing=!1,de.u=0,Q.u=0;let i=dr||e.room;Je.renderer&&Fn.setHallLod(i),dt.call(i,"exit",0),dt.show(i,!0),Vi("idle"),dt.call(i,"arrive",{first:!1,sub:Mn.current.sub,kind:"REVERT",arrivals:$o}),rn(Je.datum,"counter",ce[i].alt,0),rn(Je.datum,"arrive",i),rn(Je.keyNav,"setNeedle",ce[i].alt),rn(Je.keyNav,"setCurrent",i),Mn.lastTravel={kind:t.kind,from:e.hash,to:n.hash,plannedMs:t.duration,ms:fe.now-Am,completed:!1},de.path=null,ge.emit("travel:end",{from:e,to:n,kind:t.kind,completed:!1}),n.room!==i&&Sv(n.room),za();let r=Ar;Ar=null,r&&r(!1)}var uv={speed01:0,pan:0};function gv(t){let e=de.path;if(e.swapAt>=0&&(!de.swapped&&t>=e.swapAt?(Je.renderer&&(e.pose(Math.max(0,e.swapAt-1e-6),ka),it.scaleAbout(e.swapKind==="grow"?1e3:.001,ka.pivot),mc=it.rebase(e.swapKind)),de.swapped=!0):de.swapped&&t<e.swapAt&&(mc&&Je.renderer&&it.unrebase(mc),mc=null,de.swapped=!1)),e.pose(t,di),Ba.active=!0,Ba.kind=e.kind,e.fx)try{e.fx(t,Ba)}catch{}_v(di),Xo||(dr&&dr!==de.to.room&&dt.call(dr,"exit",di.exitU),dt.call(de.to.room,"enter",di.enterU)),rn(Je.keyNav,"setNeedle",di.alt),Je.audio&&Je.audio.setRootU(de.from.room,de.to.room,t),rn(Je.datum,"counter",di.alt,di.counter),rn(Je.datum,"flashCode",di.flashCode),gc&&(uv.speed01=di.speed01,uv.pan=di.pan,gc.set(uv)),e.cues&&e.cues(t,fv,mv||Je),!hv&&t>=Ae.interactiveU&&(hv=!0,dt.show(de.to.room),ge.emit("travel:interactive",{to:de.to})),Q.u=t,de.u=t,fv=t,Go(di,Ln)}function sD(t){if(!Je.renderer||Q.phase==="boot"||Q.phase==="start")return;let e=Q.room,n=dt.get(e);if(n&&typeof n.livePose=="function"&&dt.call(e,"livePose",Mm,t)===!0){let i=ce[e].anchor;Mm.pos.add(i),Mm.target.add(i),Pe.setPose(Mm);return}Pe.setPose(vv)}function oD(t){let e=fe.now,n=e-_f;if(_f=e,dv&&(dv=!1,n<0&&(n=0)),de.phase!=="transition"){Ba.active=!1,sD(t);return}let i=de.path.duration,r;if(de.scrubbing)r=Mf;else if(bs==="inertia")r=Ht(de.u+bm*n/1e3),bm*=Math.pow(xn.inertiaDecay,n/xn.frameMs),(Math.abs(bm)<.05||r<=0||r>=1)&&(bs=r<.5?"reverse":"forward",de.t=Ho(r,i));else if(bs==="reverse"){if(de.t=Math.max(0,de.t-n*de.speed),r=An.camera(de.t/i),de.t<=0){gv(0),rD();return}}else de.t=Math.min(i,de.t+n*de.speed),r=An.camera(de.t/i);gv(r),!de.scrubbing&&bs==="forward"&&(de.t>=i?Jw():Av(e))}var vf=0,xv=0,wm=0,$w=0;function aD(){vf=0,!(xv!==wm||de.phase!=="transition"||de.scrubbing||bs!=="forward"||!de.path||!fe.running)&&(de.t=de.path.duration,gv(1),Jw())}function Av(t,e){let n=(de.path.duration-de.t)/Math.max(1e-6,de.speed)-(fe.at()-t);if(n>400&&!e)return;let i=performance.now()+Math.max(0,n);vf&&xv===wm&&!e&&i>=$w||(vf&&clearTimeout(vf),xv=wm,$w=i,vf=setTimeout(aD,Math.max(0,n)))}function yf(){if(bf>=0&&($n(bf),bf=-1),Sf){let t=Sf;Sf=null,t(!1)}}function Xw(t,e,n){Mn.current=t,Q.route=t,wv(t,n.source,!!n.replace),document.title=Wu(t),Y.set("lastRoom",t.hash),za(),ge.emit("route:change",{route:t,prev:e}),Q.tier==="T0"&&Je.t0&&rn(Je.t0,"show",t)}function lD(t,e){yf();let n=Mn.current,i=dt.call(t.room,"setSub",t.sub,{instant:Et.reducedMotion});if(i===!1||i===void 0){let r=xs(`#/${ce[t.room].slug}`);return n.sub&&dt.call(t.room,"setSub",null,{instant:!0}),Xw(r,n,{...e,replace:!0}),Promise.resolve(!0)}return new Promise(r=>{Sf=r,bf=Qe(Math.max(0,+i||0),()=>{bf=-1,Sf=null,Xw(t,n,e),r(!0)})})}function cD(){wf=location.hash,Mn.go(location.hash,{source:"history"})}function uD(){location.hash!==wf&&(wf=location.hash,Mn.go(location.hash,{source:"hash"}))}var Mn={state:de,current:null,lastTravel:null,init(t){if(Je=t,t.director=Mn,t.halls=dt,t.audio){let e=Object.create(t.audio);e.play=(n,i)=>yv(n)?null:t.audio.play(n,i),mv=Object.create(t),mv.audio=e}return Fw({restPose:(e,n,i)=>dt.restPose(e,n,i),faceFrame:t.key?(e,n)=>t.key.faceFrame(e,n):null}),Mn.current=xs("#/core"),Q.room="CORE",Q.route=Mn.current,Sm.add("CORE"),wf=location.hash,fe.add(oD,jt.DIRECTOR),window.addEventListener("popstate",cD),window.addEventListener("hashchange",uD),ge.on("layout:change",za),dt.ensure("CORE"),dt.show("CORE",!0),za(),t.renderer&&Q.phase!=="boot"&&Q.phase!=="start"&&Pe.setPose(vv),Mn},settle(){de.phase==="transition"||Q.room!=="CORE"||(za(),dt.call("CORE","enter",1),dt.call("CORE","arrive",{first:!0,sub:null,kind:"BOOT",arrivals:$o}),rn(Je.chrome,"setRoom","CORE"),rn(Je.keyNav,"setCurrent","CORE"),rn(Je.keyNav,"setNeedle",0))},go(t,e={}){try{let n=e.source||"go",i={...e,source:n},r=px(xs(t),n);r.status&&rn(Je.status,"say",r.status,r.vars||{}),r.shudder&&(rn(Je.keyNav,"shudder",r.shudder),Q.room==="CORE"&&de.phase!=="transition"&&Je.key&&Je.key.shudder(6));let s=r.route;if(de.phase==="transition")return s.hash===de.to.hash?new Promise(a=>{ge.once("travel:end",l=>a(!!l.completed))}):(yf(),nD(s,i));let o=Mn.current;return s.hash===o.hash?(yf(),location.hash&&location.hash!==s.hash&&wv(s,"history",!0),Promise.resolve(!0)):s.room===o.room?lD(s,i):(yf(),Ww(s,i))}catch{return Promise.resolve(!1)}},speedUp(){if(!(de.phase!=="transition"||de.scrubbing||bs!=="forward")){if(Xo){let t=de.path.duration-de.t;t>pv&&(de.speed=Math.max(de.speed,t/Math.max(1,pv))),Av(fe.now,!0);return}de.speed=Ae.skipSpeed}},get playing(){return Xo},fxOut(){return Ba},pose(){return Ln},predict(t){return de.phase!=="transition"||de.scrubbing||bs!=="forward"||!(t>=de.t)?null:performance.now()+(t-de.t)/Math.max(1e-6,de.speed)},play(t,e={source:"show",skipMs:600}){try{if(!t||typeof t.pose!="function"||de.phase==="transition")return Promise.resolve(!1);yf();let n=Mn.current;t.from||(t.from=n.room),t.to||(t.to=n.room),qw(),dr=n.room,Vi("transition"),dt.call(n.room,"depart"),rn(Je.datum,"depart"),ge.emit("room:depart",{room:n.room,to:n});let i={source:"show",skipMs:600,...e||{},play:!0};return bv(t,n,n,i),new Promise(r=>{Ar=r})}catch{return Promise.resolve(!1)}},scrub:{begin(t){if(Et.reducedMotion||Q.tier==="T0"||!Je.renderer)return!1;if(de.phase==="transition")return de.scrubbing=!0,Mf=de.u,bs="forward",!0;let e=px(xs(t),"nav").route;return e.room===Mn.current.room?!1:(Ww(e,{source:"nav",scrub:!0}),!0)},set(t){de.phase==="transition"&&de.scrubbing&&(Mf=Ht(t))},end(t=0){de.phase!=="transition"||!de.scrubbing||(de.scrubbing=!1,de.u=Mf,de.speed=1,bm=t||0,bs="inertia")}},altitude(){return de.phase==="transition"?Ln.alt:(ce[Q.room]||ce.CORE).alt},busy(){return de.phase==="transition"},logicalSource(){return de.phase==="transition"?dr:null},logicalRoom(){return de.phase==="transition"?Kw():Q.room}};var Tv=0;function fD(t,e){let n=e==null?t.textContent:String(e);t.textContent="";let i=[];for(let r of n){let s=document.createElement("span");s.className="lock-letter",s.textContent=r,t.appendChild(s),i.push(s)}return i}function Ev(t,e){return t.style.opacity="0",ti(e,n=>{t.style.opacity=String(n)},An.reveal).done.then(()=>{t.style.opacity=""})}function Qw(t,e={}){if(!t)return Promise.resolve();let n=e.weight||220,i=e.ms||Ae.lockIn;if(Et.reducedMotion)return Ev(t,Ae.lockInReduced);if(Tv>=2)return Promise.resolve();Tv+=1;let r=t.textContent,s=fD(t,r),o=Y.shrp||28,a=-1,l=c=>{let u=An.reveal(c),f=Math.round(u*5)/5,h=f!==a?`"SHRP" ${(o*f).toFixed(1)}, "wght" ${Math.round(120+(n-120)*f)}, "CRSV" 0, "slnt" 0`:null;a=f;let d=fe.now/1e3;for(let g=0;g<s.length;g++){let x=s[g].style;h&&(x.fontVariationSettings=h),x.transform=u<1?`translateX(${(Math.sin(17*d+g)*(1-u)*4).toFixed(2)}px)`:""}};return l(0),ti(i,l).done.then(()=>{Tv-=1,t.textContent===r&&(t.textContent=r)})}function eA(t,e={}){if(!t)return Promise.resolve();let n=e.msPerChar||Ae.revealMsPerChar,i=e.maxMs||Ae.revealMax;if(Et.reducedMotion)return Ev(t,Ae.lockInReduced);let r=Math.min(i,Math.max(1,t.textContent.length*n));t.classList.add("reveal-mask");let s=o=>{t.style.setProperty("--reveal",`${(o*108).toFixed(1)}%`),t.style.opacity=String(Math.min(1,o*2))};return s(0),ti(r,s).done.then(()=>{t.classList.remove("reveal-mask"),t.style.removeProperty("--reveal"),t.style.opacity=""})}function tA(t,e,n={}){if(!t)return Promise.resolve();let i=n.cps||Ae.beamCps;if(Et.reducedMotion)return t.textContent=String(e),Ev(t,Ae.lockInReduced);t.textContent="";let r=[];for(let c of String(e)){let u=document.createElement("span");u.className="beam-letter",u.textContent=c,t.appendChild(u),r.push(u)}let s=document.getElementById("fx"),o=document.createElement("i");o.className="beam-head",s&&s.appendChild(o);let a=r.map(c=>c.getBoundingClientRect()),l=1e3/i;return new Promise(c=>{let u=0,f=()=>{if(u>=r.length){Qe(160,()=>{o.parentNode&&o.parentNode.removeChild(o)}),c();return}let h=a[u];o.style.transform=`translate3d(${(h.right-1.5).toFixed(1)}px, ${(h.bottom-h.height*.2).toFixed(1)}px, 0)`,r[u].classList.add("is-lit"),u+=1,Qe(l,f)};f()})}var pt={datum:null,line:null,label:null,title:null,level:null,flash:null,giant:null},Iv=null,Rv=!1,Af="CORE",Tf=!1,nA=null,Tm="",Lv=0,iA=new C,rA=new C,sA=new C,Dv=!1;function xc(t,e,n,i){let r=document.createElement(t);return r.id=e,n&&(r.className=n),i.appendChild(r),r}function Cv(){return Iv??(ce[Af]||ce.CORE).giant}function Pv(t){pt.giant&&pt.giant.textContent!==t&&(pt.giant.textContent=t)}function hD(){if(!pt.giant||!Pe.camera||Tf)return;Dv||(iA.copy(Pe.camera.position),Dv=!0),rA.setFromMatrixColumn(Pe.camera.matrixWorld,0);let t=Math.max(.001,sA.copy(Pe.pose.target).sub(Pe.camera.position).length()),e=sA.copy(Pe.camera.position).sub(iA).dot(rA)*Pe.camera.zoom*(be.h/(2*Math.tan(Pe.camera.fov*Math.PI/360)))/t,n=Math.max(-200,Math.min(200,-.25*e));Math.abs(n-Lv)<.25||(Lv=n,pt.giant.style.transform=`translate3d(${n.toFixed(1)}px,-50%,0)`)}var Ef={init(t){let e=document.getElementById("frame");return pt.giant=document.getElementById("giant"),e&&(pt.datum=document.getElementById("datum")||xc("div","datum","",e),pt.datum.classList.add("is-out"),pt.line=xc("i","datum-line","",pt.datum),pt.label=xc("p","datum-label","t-label",pt.datum),pt.title=xc("h1","datum-title","t-display",pt.datum),pt.level=xc("p","datum-level","t-micro",pt.datum),pt.flash=xc("p","datum-flash","t-label",e),pt.flash.setAttribute("aria-hidden","true"),fe.add(hD,jt.UI)),Ef},arrive(t,e={}){Af=ce[t]?t:"CORE";let n=ce[Af];if(!pt.datum)return;let i=Af==="NADIR"&&Y.data&&Y.data.nadirOpen;pt.title.textContent=i&&n.titleOpen?n.titleOpen:n.title,pt.title.dataset.room=Af,pt.label.textContent=`${n.num} · ${n.code}`,pt.level.textContent=`▽ ${n.level}`,pt.datum.classList.remove("is-out"),pt.datum.classList.remove("is-drawn");let r=()=>{pt.datum.classList.add("is-drawn")};e.instant?r():requestAnimationFrame(r),e.instant||Qw(pt.title,{weight:220,ms:480}),Tf=!1,Tm="",Dv=!1,Lv=0,pt.giant&&(pt.giant.classList.remove("is-counter"),pt.giant.style.transform="",Pv(Cv()),pt.giant.classList.add("is-in"),Rv?pt.giant.dataset.electrum="":delete pt.giant.dataset.electrum)},depart(){pt.datum&&pt.datum.classList.add("is-out"),pt.giant&&pt.giant.classList.remove("is-in")},setGiant(t,e={}){Iv=t==null?null:String(t),Rv=!!e.electrum,!(!pt.giant||Tf)&&(Pv(Cv()),Rv?pt.giant.dataset.electrum="":delete pt.giant.dataset.electrum)},counter(t,e){if(!pt.giant)return;let n=e>0;if(n!==Tf&&(Tf=n,pt.giant.classList.toggle("is-counter",n),n?pt.giant.style.transform="":(Tm="",Pv(Cv()))),!n)return;let i=zy(Math.round(t),0);i!==Tm&&(Tm=i,pt.giant.textContent=i)},flashCode(t){if(!(!pt.flash||t===nA))if(nA=t,t&&ce[t]){let e=ce[t];pt.flash.textContent=`${e.num} · ${e.code}`,pt.flash.classList.add("is-on")}else pt.flash.classList.remove("is-on")},yPx(){return be.kind==="desktop"?be.h*Tt.desktop.datumFrac:Tt.phone.datumPx+be.safe.t},setVisible(t){pt.datum&&(pt.datum.hidden=!t),pt.giant&&(pt.giant.hidden=!t)}};var uA="http://www.w3.org/2000/svg",Ri=[],Va=null,Em=null,Rf=new C,Nv=new C,Ss={x:0,y:0,depth:0,visible:!1},oA=0,Rm=new Float64Array(64);function aA(t,e,n){let i=document.createElementNS(uA,t);return i.setAttribute("class",e),i.dataset.owner=n,i}var lA=t=>`${t<0?"−":t>0?"+":""}${Math.abs(t).toFixed(2)}`;function dD(t){let e=t.leader||(t.focused?{side:"right",len:40,rise:-24}:null);if(!e||!t.path)return;let n=e.side==="left"?-1:1,i=e.rise||0,r=t.sx+n*Math.abs(i),s=t.sy+i,o=r+n*Math.max(Tt.leader.elbowMin,Math.min(Tt.leader.runMax,e.len||40));t.path.setAttribute("d",`M${t.sx.toFixed(1)} ${t.sy.toFixed(1)}L${r.toFixed(1)} ${s.toFixed(1)}L${o.toFixed(1)} ${s.toFixed(1)}`),t.endX=o+n*6,t.endY=s}function vc(t,e){if(t.shown===e)return;t.shown=e;let n=e&&(t.el||t.focused);t.el&&t.el.classList.toggle("is-hidden",!e),t.button&&t.button.classList.toggle("is-hidden",!e),t.path&&t.path.classList.toggle("is-hidden",!(n&&(t.leader||t.focused))),t.cross&&t.cross.classList.toggle("is-hidden",!(n&&(t.crossOn||t.focused))),t.coordEl&&t.coordEl.classList.toggle("is-hidden",!(e&&t.coordOn))}function cA(t){let e=t.shown;t.shown=!e,vc(t,e)}function pD(t){if(!Pe.camera)return;let e=1-Math.exp(-(t*1e3)/120),n=fe.now-oA>=1e3/Ae.coordHz;n&&(oA=fe.now);let i=0;for(let s=0;s<Ri.length;s++){let o=Ri[s];o.get(Rf),Pe.project(Rf,Ss);let a=Ss.depth>0||!o.hideBehind;if(o.want=o.visible&&a,!!o.want){if(i++,!o.init||o.lowpass<=0)o.sx=Ss.x,o.sy=Ss.y,o.init=!0;else{let l=o.lowpass===120?e:1-Math.exp(-(t*1e3)/o.lowpass);o.sx+=(Ss.x-o.sx)*l,o.sy+=(Ss.y-o.sy)*l}o.screen.x=o.sx,o.screen.y=o.sy,n&&o.coordEl&&(it.toCanonical(Rf,Nv),o.coordEl.textContent=`x ${lA(Nv.x)} · y ${lA(Nv.y)}`)}}let r=-1/0;if(i>Zr.max){Rm.length<Ri.length&&(Rm=new Float64Array(Ri.length*2));let s=0;for(let a=0;a<Ri.length;a++)Ri[a].want&&(Rm[s++]=Ri[a].priority);r=Rm.subarray(0,s).sort()[s-Zr.max]}Zr.visibleCount=0;for(let s=0;s<Ri.length;s++){let o=Ri[s],a=o.want&&(o.priority>=r||o.focused);if(o.screen.visible=a,vc(o,a),!a||(Zr.visibleCount++,Math.abs(o.sx-o.wx)<.1&&Math.abs(o.sy-o.wy)<.1))continue;o.wx=o.sx,o.wy=o.sy;let l=o.sx.toFixed(1),c=o.sy.toFixed(1);if(o.button&&(o.button.style.transform=`translate3d(${l}px,${c}px,0)`),o.cross&&o.cross.setAttribute("transform",`translate(${l} ${c})`),o.coordEl&&(o.coordEl.style.transform=`translate3d(${(o.sx+8).toFixed(1)}px,${(o.sy+6).toFixed(1)}px,0)`),dD(o),o.el){let u=o.path&&(o.leader||o.focused)?o.endX:o.sx,f=o.path&&(o.leader||o.focused)?o.endY:o.sy,h=o.leader&&o.leader.side==="left";o.el.style.transform=`translate3d(${u.toFixed(1)}px,${f.toFixed(1)}px,0) translate(${h?"-100%":"0"},-50%)`}}}var Zr={max:24,visibleCount:0,init(t){Va=document.getElementById("overlay"),Em=document.getElementById("leaders");let e=()=>t.app.tier==="T1"||be.isPhone?Tt.leader.maxAnchorsLow:Tt.leader.maxAnchors;return Zr.max=e(),t.bus.on("tier:change",()=>{Zr.max=e()}),t.bus.on("layout:change",()=>{Zr.max=e();for(let n of Ri)n.wx=NaN}),fe.add(pD,jt.OVERLAY),Zr},add(t){let e=String(t.owner||"anon"),n={owner:e,id:t.id!=null?String(t.id):null,get:t.get,leader:t.leader||null,crossOn:t.cross!=null?!!t.cross:!!t.leader,coordOn:!!t.coord,priority:t.priority||0,lowpass:t.lowpass!=null?t.lowpass:Ae.labelLowpass,hideBehind:t.hideBehind!==!1,visible:!0,want:!1,shown:!0,focused:!1,init:!1,sx:0,sy:0,wx:NaN,wy:NaN,endX:0,endY:0,screen:{x:0,y:0,visible:!1},el:t.el||null,button:null,path:null,cross:null,coordEl:null};if(n.el&&(n.el.classList.add("anchor"),t.scrim!==!1&&n.el.classList.add("scrim"),n.el.dataset.owner=e,n.id&&(n.el.dataset.id=n.id),Va&&Va.appendChild(n.el)),Em){n.path=aA("path","leader",e),n.path.setAttribute("pathLength","1"),n.cross=aA("g","cross",e);for(let[s,o,a,l]of[[-3.5,0,3.5,0],[0,-3.5,0,3.5]]){let c=document.createElementNS(uA,"line");c.setAttribute("x1",s),c.setAttribute("y1",o),c.setAttribute("x2",a),c.setAttribute("y2",l),n.cross.appendChild(c)}Em.appendChild(n.path),Em.appendChild(n.cross)}n.coordOn&&Va&&(n.coordEl=document.createElement("span"),n.coordEl.className="t-micro coord",Va.appendChild(n.coordEl));let i=s=>{n.focused=s,n.cross&&n.cross.classList.toggle("focus",s),n.path&&n.path.classList.toggle("focus",s),n.wx=NaN,cA(n)};if(t.button&&Va){let s=document.createElement("button");s.type="button",s.className="proxy",s.dataset.owner=e,n.id&&(s.dataset.id=n.id),s.setAttribute("aria-label",t.button.label||""),t.button.size&&t.button.size>44&&(s.style.width=`${t.button.size}px`,s.style.height=`${t.button.size}px`,s.style.margin=`${-t.button.size/2}px 0 0 ${-t.button.size/2}px`);let o=t.button;s.addEventListener("click",()=>{typeof n.onActivate=="function"&&n.onActivate()}),s.addEventListener("focus",()=>{i(!0),n.onFocus&&n.onFocus()}),s.addEventListener("blur",()=>{i(!1),n.onBlur&&n.onBlur()}),n.onActivate=o.onActivate,n.onFocus=o.onFocus||null,n.onBlur=o.onBlur||null,Va.appendChild(s),n.button=s}n.shown=!1,vc(n,!1),vc(n,!0),Ri.push(n);let r={el:n.el,button:n.button,screen:n.screen,setVisible(s){if(n.visible=!!s,!s){vc(n,!1);return}n.shown||!Pe.camera||(n.get(Rf),Pe.project(Rf,Ss),(Ss.depth>0||!n.hideBehind)&&(n.init||(n.sx=Ss.x,n.sy=Ss.y,n.init=!0),n.wx=NaN,vc(n,!0),n.button&&(n.button.style.transform=`translate3d(${n.sx.toFixed(1)}px,${n.sy.toFixed(1)}px,0)`)))},setAlpha(s){let o=String(Math.max(0,Math.min(1,s)));n.el&&(n.el.style.opacity=o),n.path&&(n.path.style.opacity=o)},drawIn(s=Ae.leaderDraw){return n.el&&n.el.classList.add("is-pending"),n.path&&(n.path.classList.remove("is-drawing"),n.path.style.strokeDasharray="1",n.path.style.strokeDashoffset="1"),new Promise(o=>{requestAnimationFrame(()=>{n.path&&(n.path.classList.add("is-drawing"),n.path.style.transitionDuration=`${s}ms`,n.path.style.strokeDashoffset="0"),Qe(s,()=>{n.el&&n.el.classList.remove("is-pending"),o()})})})},update(s){"leader"in s&&(n.leader=s.leader||null),"cross"in s&&(n.crossOn=!!s.cross),"coord"in s&&(n.coordOn=!!s.coord),s.button&&n.button&&(s.button.label!=null&&n.button.setAttribute("aria-label",s.button.label),s.button.onActivate&&(n.onActivate=s.button.onActivate)),"priority"in s&&(n.priority=s.priority||0),n.wx=NaN,cA(n)},remove(){let s=Ri.indexOf(n);s>=0&&Ri.splice(s,1);for(let o of[n.el,n.button,n.path,n.cross,n.coordEl])o&&o.parentNode&&o.parentNode.removeChild(o)}};return n.api=r,r},clear(t){for(let e=Ri.length-1;e>=0;e--)Ri[e].owner===t&&Ri[e].api.remove()}};var Ov=new Set,qn=null,Fv=null,yc=null,ws=null,Tn={id:-1,y0:0,t0:0,y:0,t:0,h:0,base:0,moved:!1};function _c(t){if(Tr.state!==t){Tr.state=t,qn&&(qn.dataset.state=t);for(let e of Ov)try{e(t)}catch{}}}function mD(t,e){return t==="full"?0:t==="peek"?Math.max(0,e-120):e}function gD(t){if(Tr.state==="closed"||Tn.id>=0||be.kind==="phone-land"||Tr.state==="full"&&ws&&ws.contains(t.target)&&ws.scrollTop>0)return;let e=qn.getBoundingClientRect();Tn.id=t.pointerId,Tn.y0=Tn.y=t.clientY,Tn.t0=Tn.t=t.timeStamp,Tn.h=e.height,Tn.base=mD(Tr.state,e.height),Tn.moved=!1}function xD(t){if(t.pointerId!==Tn.id)return;let e=t.clientY-Tn.y0;if(!Tn.moved&&Math.abs(e)<Zi.SLOP_PX)return;if(!Tn.moved){Tn.moved=!0,qn.classList.add("is-dragging");try{qn.setPointerCapture(t.pointerId)}catch{}}Tn.y=t.clientY,Tn.t=t.timeStamp;let n=Math.max(0,Math.min(Tn.h,Tn.base+e));qn.style.transform=`translateY(${n.toFixed(1)}px)`}function fA(t){if(t.pointerId!==Tn.id||(Tn.id=-1,!Tn.moved))return;qn.classList.remove("is-dragging"),qn.style.transform="";let e=Tn.y-Tn.y0,n=e/Math.max(1,Tn.t-Tn.t0);(Math.abs(e)>=40||Math.abs(n)>=Zi.SWIPE_V)&&(e>0?_c(Tr.state==="full"?"peek":"closed"):Tr.state==="peek"&&_c("full"))}var Tr={state:"closed",init(t){let e=document.getElementById("sheets");return e&&(qn=document.createElement("section"),qn.id="sheet",qn.className="sheet",qn.dataset.state="closed",Fv=document.createElement("div"),Fv.className="sheet-handle",yc=document.createElement("div"),yc.className="sheet-peek",ws=document.createElement("div"),ws.className="sheet-body",qn.append(Fv,yc,ws),e.appendChild(qn),qn.addEventListener("pointerdown",gD),qn.addEventListener("pointermove",xD),qn.addEventListener("pointerup",fA),qn.addEventListener("pointercancel",fA)),Tr},set(t,e={}){if(qn){if(yc.textContent="",ws.textContent="",ws.scrollTop=0,e.peek&&yc.appendChild(e.peek),t&&ws.appendChild(t),!t&&!e.peek){_c("closed");return}_c(e.state==="full"?"full":e.state==="closed"?"closed":"peek")}},open(t="peek"){qn&&(yc.firstChild||ws.firstChild)&&_c(t==="full"?"full":"peek")},close(){_c("closed")},onChange(t){return Ov.add(t),()=>Ov.delete(t)}};var Uv="http://www.w3.org/2000/svg",kv=new Float32Array(8),Hv=new Float32Array(8),bc=null,Pf=[],Cm=0,hA=-1e9,Bv=!1,pA=!0,Pm=0,Im=null,zv=null,Nm=null,pi=null,Mc=null,Cf=0,Lm=null,Vv="";function Ga(t,e,n,i,r){let s=document.createElement(t);return e&&(s.className=e),r&&(s.id=r),n!=null&&(s.textContent=n),i&&i.appendChild(s),s}var Gv=t=>String(t).padStart(2,"0");function Dm(t){let e=document.getElementById(t);return e?(e.classList.remove("ff-c"),e.classList.add("corner","corner--dim"),e.textContent="",e):null}function dA(t){pA=t,En.el.sound&&En.el.sound.setAttribute("aria-pressed",t?"true":"false"),Nm&&(Nm.textContent=t?"ЗВУК":"ТИХО")}function vD(){Cm&&$n(Cm);let t=new Date(Ns());Cm=Qe((60-t.getSeconds())*1e3-t.getMilliseconds()+20,()=>{Cm=0,En.refresh()})}function yD(){if(!Pf.length||fe.now-hA<1e3/Tt.sound.fps)return;hA=fe.now;let t=bc&&bc.audio;t&&pA?t.levels(kv):kv.fill(0);let e=Tt.sound.h;for(let n=0;n<8;n++){let i=Math.max(1,Math.round(kv[n]*e*2)/2);i!==Hv[n]&&(Hv[n]=i,Pf[n].setAttribute("y",String(e-i)),Pf[n].setAttribute("height",String(i)))}}var En={el:{tl:null,tlName:null,tlMicro:null,tr:null,sound:null,bl:null,br:null},init(t){bc=t;let e=En.el;if(e.tl=Dm("c-tl"),e.tl&&(e.tlName=Ga("span","t-label","SAM.VIN",e.tl,"c-tl-name"),e.tlMicro=Ga("span","t-micro","",e.tl,"c-tl-micro")),e.tr=Dm("c-tr"),e.tr){let n=Ga("button","",null,e.tr,"sound");n.type="button",n.setAttribute("aria-label","Звук"),Nm=Ga("span","t-label","ЗВУК",n,"sound-label");let i=document.createElementNS(Uv,"svg");i.setAttribute("class","sound-wave"),i.setAttribute("viewBox",`0 0 ${Tt.sound.w} ${Tt.sound.h}`),i.setAttribute("aria-hidden","true"),Pf=[];for(let s=0;s<8;s++){let o=document.createElementNS(Uv,"rect");o.setAttribute("class","bar"),o.setAttribute("x",String(s*4+.5)),o.setAttribute("width","2"),o.setAttribute("y",String(Tt.sound.h-1)),o.setAttribute("height","1"),Hv[s]=1,i.appendChild(o),Pf.push(o)}let r=document.createElementNS(Uv,"line");r.setAttribute("class","flat"),r.setAttribute("x1","0"),r.setAttribute("x2",String(Tt.sound.w)),r.setAttribute("y1",String(Tt.sound.h-.5)),r.setAttribute("y2",String(Tt.sound.h-.5)),i.appendChild(r),n.appendChild(i),n.addEventListener("click",()=>{t.audio&&t.audio.toggle()}),e.sound=n}return e.bl=Dm("c-bl"),e.bl&&e.bl.classList.add("t-micro"),e.br=Dm("c-br"),e.br&&(e.br.classList.add("t-micro"),Im=Ga("span","found-count","",e.br),zv=Ga("span","rank","",e.br)),dA(!(Y.data&&Y.data.sound==="off")),ge.on("sound:change",n=>dA(!!n.on)),ge.on("rank:change",()=>En.refresh()),ge.on("visibility",n=>{n.hidden||En.refresh()}),En.setRoom("CORE"),En.refresh(),fe.add(yD,jt.UI),En},setRoom(t){let e=ce[t]||ce.CORE;Vv=`${e.code} · ▽ ${e.level}`,En.el.tlMicro&&Lm==null&&(En.el.tlMicro.textContent=Vv)},setTLVerb(t,e={fadeMs:240}){let n=En.el.tl;if(!n)return;let i=e&&e.fadeMs!=null?e.fadeMs:240;if(Cf&&($n(Cf),Cf=0),t&&typeof t=="object")Mc=t,pi||(pi=Ga("button","verb t-label",null,n,"c-tl-verb"),pi.type="button",pi.style.pointerEvents="auto",pi.addEventListener("click",()=>{Mc&&typeof Mc.onActivate=="function"&&Mc.onActivate()}),pi.style.opacity="0"),pi.textContent=String(t.label||""),t.qa?pi.setAttribute("data-qa",String(t.qa)):pi.removeAttribute("data-qa"),pi.hidden=!1,pi.style.transition=`opacity ${i}ms linear`,pi.offsetWidth,pi.style.opacity="1";else if(pi){Mc=null,pi.style.transition=`opacity ${i}ms linear`,pi.style.opacity="0";let r=pi;Cf=Qe(i,()=>{Cf=0,Mc||(r.hidden=!0)})}},setTLMicro(t){Lm=t==null?null:String(t),En.el.tlMicro&&(En.el.tlMicro.textContent=Lm??Vv)},refresh(){let t=En.el;if(t.bl){if(Bv)t.bl.textContent="РЕЖИМ ЧЕРТЕЖА";else{let e=new Date(Ns());t.bl.textContent=`ДЕНЬ ${Y.distinctDays|0} · УЗЛОВ ${Y.litNodes|0} · ${Gv(e.getHours())}:${Gv(e.getMinutes())}`}vD()}if(Im){let e=bc&&bc.secrets?bc.secrets.count():Object.keys(Y.data&&Y.data.found||{}).length;Im.textContent=`НАЙДЕНО ${Gv(Math.min(99,e))} / ??`,zv.textContent=Y.data?Y.rank().name:""}},typeIn(t=Ae.typeMsPerChar){let e=En.el,n=[e.tlName,e.tlMicro,Nm,e.bl&&!Bv?e.bl:null,Im,zv].filter(Boolean),i=n.map(s=>s.textContent),r=Math.max(1,...i.map(s=>s.length));for(let s of n)s.textContent="";return ti(r*t,s=>{let o=Math.round(s*r);for(let a=0;a<n.length;a++){let l=i[a].slice(0,o);n[a].textContent!==l&&(n[a].textContent=l)}}).done.then(()=>{for(let s=0;s<n.length;s++)n[s].textContent=i[s]})},assemble(t=Ae.assemble){let e=En.el;for(let n of[e.tl,e.tr,e.bl,e.br])n&&(n.style.transitionDuration=`${t}ms`,n.classList.remove("corner--dim"));return new Promise(n=>Qe(t,n))},relockFound(){En.refresh();let t=En.el.br;t&&(t.classList.add("is-relock"),Pm&&$n(Pm),Pm=Qe(Ae.statusIn,()=>{Pm=0,t.classList.remove("is-relock")}))},setT0Marker(t){Bv=!!t,En.refresh()}};var pr=null,Ha=null,Sc=null,ro=0,Wv=0,wc=null;function $v(){ro=0,pr&&pr.classList.remove("is-in");let t=wc;wc=null,t&&Qe(240,t)}var If={init(t){let e=document.getElementById("frame");return pr=document.getElementById("lead"),!pr&&e&&(pr=document.createElement("div"),pr.id="lead",pr.className="scrim",e.appendChild(pr)),pr&&(Ha=document.getElementById("lead-text")||pr.appendChild(document.createElement("p")),Ha.id="lead-text",Ha.className="t-lead",Sc=document.getElementById("lead-micro")||pr.appendChild(document.createElement("p")),Sc.id="lead-micro",Sc.className="t-micro",Sc.hidden=!0),If},show(t,e={}){if(!pr)return Promise.resolve();let n=e.ms!=null?e.ms:Ae.leadDefault;if(ro&&($n(ro),ro=0),wc){let s=wc;wc=null,s()}let i=++Wv;Ha.className=e.cls||"t-lead",Sc.textContent=e.micro?String(e.micro):"",Sc.hidden=!e.micro,pr.classList.add("is-in");let r=new Promise(s=>{wc=s});return e.beam?tA(Ha,String(t),{}).then(()=>{i===Wv&&(ro=Qe(n,$v))}):(Ha.textContent=String(t),eA(Ha),ro=Qe(n,$v)),r},hide(){ro&&($n(ro),ro=0),Wv++,$v()}};var mA="http://www.w3.org/2000/svg",jo=[],Xv=null,Yv=null,gA=new C,xA=new C,Yo={x:0,y:0,depth:0,visible:!1},qo={x:0,y:0,depth:0,visible:!1},Fm=Tt.dims,cn=t=>t.toFixed(1);function _D(t){if(t.a(gA),t.b(xA),Pe.project(gA,Yo),Pe.project(xA,qo),Yo.depth<=0||qo.depth<=0)return!1;let e=qo.x-Yo.x,n=qo.y-Yo.y,i=Math.hypot(e,n);if(i<8)return!1;e/=i,n/=i;let r=-n,s=e,o=t.side;(o==="left"&&r>0||o==="right"&&r<0||o==="above"&&s>0||o==="below"&&s<0)&&(r=-r,s=-s);let a=t.offset,l=Yo.x+r*a,c=Yo.y+s*a,u=qo.x+r*a,f=qo.y+s*a,h=(l+u)/2,d=(c+f)/2,g=Math.min(i/2-2,t.gapHalf),x=Fm.arrowPx,p=Fm.extPx,m=`M${cn(Yo.x+r*4)} ${cn(Yo.y+s*4)}L${cn(l+r*p)} ${cn(c+s*p)}M${cn(qo.x+r*4)} ${cn(qo.y+s*4)}L${cn(u+r*p)} ${cn(f+s*p)}M${cn(l)} ${cn(c)}L${cn(h-e*g)} ${cn(d-n*g)}M${cn(h+e*g)} ${cn(d+n*g)}L${cn(u)} ${cn(f)}M${cn(l+(e*.866-n*.5)*x)} ${cn(c+(n*.866+e*.5)*x)}L${cn(l)} ${cn(c)}L${cn(l+(e*.866+n*.5)*x)} ${cn(c+(n*.866-e*.5)*x)}M${cn(u-(e*.866-n*.5)*x)} ${cn(f-(n*.866+e*.5)*x)}L${cn(u)} ${cn(f)}L${cn(u-(e*.866+n*.5)*x)} ${cn(f-(n*.866-e*.5)*x)}`;return m!==t.lastD&&(t.lastD=m,t.path.setAttribute("d",m)),t.label.style.transform=`translate3d(${cn(h)}px,${cn(d)}px,0) translate(-50%,-50%)`,!0}function MD(){if(Pe.camera)for(let t=0;t<jo.length;t++){let e=jo[t],n=e.visible&&_D(e);n!==e.shown&&(e.shown=n,e.g.classList.toggle("is-hidden",!n),e.label.classList.toggle("is-hidden",!n))}}var Om={init(t){return Xv=document.getElementById("leaders"),Yv=document.getElementById("overlay"),fe.add(MD,jt.OVERLAY),Om},add(t){let e=String(t.owner||"anon"),n=document.createElementNS(mA,"g");n.setAttribute("class","dim is-hidden"),n.dataset.owner=e;let i=document.createElementNS(mA,"path");i.setAttribute("pathLength","1"),n.appendChild(i);let r=document.createElement("span");r.className="t-micro dim-label is-hidden",r.dataset.owner=e,Xv&&Xv.appendChild(n),Yv&&Yv.appendChild(r);let s={owner:e,a:t.a,b:t.b,side:t.side||"right",offset:t.offset!=null?t.offset:Fm.offsetPx,g:n,path:i,label:r,visible:!0,shown:!1,lastD:"",gapHalf:0},o=l=>{r.textContent=String(l||""),s.gapHalf=(r.textContent.length*6.2+2*Fm.gapPx)/2};o(t.label),jo.push(s);let a={setVisible(l){s.visible=!!l},drawIn(l=Ae.dimsDraw){return i.classList.remove("is-drawing"),i.style.strokeDasharray="1",i.style.strokeDashoffset="1",r.style.opacity="0",new Promise(c=>{requestAnimationFrame(()=>{i.classList.add("is-drawing"),i.style.transitionDuration=`${l}ms`,i.style.strokeDashoffset="0",Qe(l,()=>{r.style.opacity="",c()})})})},setLabel:o,remove(){let l=jo.indexOf(s);l>=0&&jo.splice(l,1),n.parentNode&&n.parentNode.removeChild(n),r.parentNode&&r.parentNode.removeChild(r)}};return s.api=a,a},clear(t){for(let e=jo.length-1;e>=0;e--)jo[e].owner===t&&jo[e].api.remove()}};var qv="http://www.w3.org/2000/svg",mr=[0,1,2,3].map(t=>({i:t,el:null,svg:null,sp:On.from(fi.struck,0),at:0,flash:0,lastD:""})),so=null,jv=null,km=14,Ac=NaN,Lf=NaN,Df=!0,Zo=t=>t.toFixed(1);function yA(){return km+12}function bD(t,e){let n=be.w,i=be.h,r=km,s=yA(),o=2*(t.sp.x+e);switch(t.i){case 0:return`M${r} ${r}Q${Zo(t.at)} ${Zo(r+o)} ${n-r} ${r}`;case 2:return`M${r} ${s-r}Q${Zo(t.at)} ${Zo(s-r-o)} ${n-r} ${s-r}`;case 1:return`M${s-r} ${r}Q${Zo(s-r-o)} ${Zo(t.at)} ${s-r} ${i-r}`;default:return`M${r} ${r}Q${Zo(r+o)} ${Zo(t.at)} ${r} ${i-r}`}}function SD(){let t=be.w,e=be.h,n=yA();for(let i of mr){if(!i.svg)continue;let r=i.i%2===0,s=r?t:n,o=r?n:e;i.svg.setAttribute("viewBox",`0 0 ${s} ${o}`),i.svg.setAttribute("width",String(s)),i.svg.setAttribute("height",String(o)),i.svg.style.transform=`translate3d(${i.i===1?t-n:0}px,${i.i===2?e-n:0}px,0)`}}function Um(t,e,n,i){t.flash&&$n(t.flash),t.at=e,t.sp.x=n*Math.min(Tt.edge.bendPx,3+i*4),t.sp.v=0,t.sp.target=0,t.el.classList.add("is-flash"),t.flash=Qe(Ae.stringFlash,()=>{t.flash=0,t.el.classList.remove("is-flash")});let r=jv&&jv.audio;r&&r.play("stringPluck",{root:(ce[Q.room]||ce.CORE).root})}function wD(t){let e=t.x,n=t.y;if(Number.isFinite(Ac)&&Df){let i=Math.hypot(t.vx,t.vy);if(i>Tt.edge.pluckPxMs){let r=be.w,s=be.h,o=km,a=be.isPhone;(Lf-o)*(n-o)<0&&Um(mr[0],e,n>Lf?1:-1,i),(Lf-(s-o))*(n-(s-o))<0&&Um(mr[2],e,n<Lf?1:-1,i),!a&&(Ac-(r-o))*(e-(r-o))<0&&Um(mr[1],n,e<Ac?1:-1,i),!a&&(Ac-o)*(e-o)<0&&Um(mr[3],n,e>Ac?1:-1,i)}}Ac=e,Lf=n}function AD(t){if(!so||!Df)return;let e=.2*(Sn.value-.5)*2*Sn.amp;for(let n=0;n<4;n++){let i=mr[n];(i.sp.x!==0||i.sp.v!==0)&&(i.sp.step(t),Math.abs(i.sp.x)<.01&&Math.abs(i.sp.v)<.05&&i.sp.snap(0));let r=bD(i,e);r!==i.lastD&&(i.lastD=r,i.el.setAttribute("d",r))}}function vA(){km=be.isPhone?Tt.phone.edgeInset:Tt.desktop.edgeInset;for(let t of mr)t.at=(t.i%2===0?be.w:be.h)/2,t.lastD="";SD()}var Nf={init(t){jv=t;let e=document.getElementById("frame");if(!e)return Nf;so=document.createElementNS(qv,"svg"),so.id="edges",so.setAttribute("aria-hidden","true");for(let n of mr)n.svg=document.createElementNS(qv,"svg"),n.svg.setAttribute("class","edge-strip"),n.el=document.createElementNS(qv,"path"),n.el.setAttribute("class","edge"),n.el.setAttribute("pathLength","1"),n.svg.appendChild(n.el),so.appendChild(n.svg);return e.insertBefore(so,e.firstChild),vA(),t.bus.on("layout:change",vA),t.input.observe(wD),fe.add(AD,jt.UI),Nf},drawIn(t=Ae.drawIn){if(!so)return Promise.resolve();for(let e of mr)e.el.style.transition="none",e.el.style.strokeDasharray="1",e.el.style.strokeDashoffset="1";return new Promise(e=>{requestAnimationFrame(()=>{for(let n of mr)n.el.style.transition=`stroke-dashoffset ${t}ms cubic-bezier(.16,1,.3,1)`,n.el.style.strokeDashoffset="0";Qe(t,()=>{for(let n of mr)n.el.style.transition="",n.el.style.strokeDasharray="",n.el.style.strokeDashoffset="";e()})})})},twitch(t=Tt.edge.twitchPx){for(let e of mr)e.sp.x=t,e.sp.v=0,e.sp.target=0},setVisible(t){Df=!!t,so&&so.classList.toggle("is-off",!Df);for(let e of mr)e.el&&e.el.classList.toggle("is-off",!Df)}};var Ko=null,zm=!1,_A=!1,MA=!0,Zv=null;function Bm(){let t=MA&&zm&&!be.isPhone;t===_A||!Ko||(_A=t,Ko.classList.toggle("is-on",t))}var Ff={init(t){let e=document.getElementById("fx"),n=document.getElementById("gl");return e&&(Ko=document.createElement("i"),Ko.id="cursor",e.appendChild(Ko),n&&(n.addEventListener("pointerover",i=>{(i.pointerType==="mouse"||i.pointerType==="pen")&&(zm=!0,Bm())}),n.addEventListener("pointerout",()=>{zm=!1,Bm()}),n.addEventListener("pointerdown",i=>{i.pointerType==="touch"&&(zm=!1,Bm())})),t.input.observe(i=>{i.type!=="touch"&&(Ko.style.transform=`translate3d(${i.x}px,${i.y}px,0)`)})),Ff},setVisible(t){MA=!!t,Bm()},setColor(t){Zv=t&&t!=="ember"?t:null,Ko&&(Ko.style.boxShadow=Zv?`inset 0 0 0 1px var(--${Zv})`:"")}};var TD="http://www.w3.org/2000/svg",Qo=["S","A","M","•","V","I","N"],yn=new Float64Array(7),Er=Nn.map(t=>ce[t].alt),Zn=null,Un="desktop",Pr=56,jn=300,un=null,Ec=null,Qi=null,EA=null,Gm=null,lo=null,RA=null,ao=null,Uf=null,Cc=null,gr=null,Jv=null,Cr=[],Rc=[],Of="CORE",kf=0,Qv=NaN,Vm=-1,bA=!1,Tc=0,SA=-1e9,Jo=new On(8,.25,0),Wm=!1,CA=0,Kr=new On(12,1,0),ey=0;function ED(){if(Un=be.kind==="desktop"?"desktop":be.kind==="phone"?"phone":"land",Un==="desktop"){Pr=Tt.nav.w,jn=Tt.nav.h;for(let t=0;t<7;t++)yn[t]=jn/2-Er[t]/1e3*(jn/2.4)}else if(Un==="phone"){Pr=Math.max(100,be.w-32),jn=Tt.band.h;for(let t=0;t<7;t++)yn[t]=16+(t+.5)*Pr/7}else{Pr=Tt.band.sideW,jn=Math.max(100,be.h-32);for(let t=0;t<7;t++)yn[t]=16+(t+.5)*jn/7}}function Xm(t){if(t>=Er[0])return yn[0]+(t-Er[0])*(yn[1]-yn[0])/(Er[1]-Er[0]);for(let e=1;e<7;e++)if(t>=Er[e])return yn[e]+(t-Er[e])*(yn[e-1]-yn[e])/(Er[e-1]-Er[e]);return yn[6]+(t-Er[6])*(yn[6]-yn[5])/(Er[6]-Er[5])}var Bf=t=>t==="WORKSHOP"?2:Nn.indexOf(t);function zf(t){let e=0;for(let n=1;n<7;n++)Math.abs(t-yn[n])<Math.abs(t-yn[e])&&(e=n);return e}function RD(t){let e=[];for(let i=0;i<2;i++)for(let r=0;r<=4;r++){let s=i===0?r/4:1-r/4,o=t.top+(t.bot-t.top)*s,a=t.top>0&&t.bot<0&&r===4/2?.62:Ft(o),l,c;if(Un==="desktop")l=jn/2-o*(jn/2.4),c=a*(jn/2.4)*Tt.nav.widthScale;else{let h=(Un==="phone"?Pr:jn)/7;l=t.i*h+h*s,c=a/.62*((Un==="phone"?jn:Pr)*.36)}let u=i===0?1:-1,f=Un==="phone"?jn/2:Pr/2;e.push(Un==="phone"?`${l.toFixed(1)} ${(f-u*c).toFixed(1)}`:`${(f+u*c).toFixed(1)} ${l.toFixed(1)}`)}return`M${e.join("L")}Z`}function CD(){let t=Dt[6],e=Is(7),n=[];for(let i=0;i<5;i++){let r=.1+.2*i,s="";for(let o=0;o<=4;o++){let a=t.top+(t.bot-t.top)*(o/4),l=Ft(a),c=(r-.5+(e()-.5)*.15)*2*l,u,f;if(Un==="desktop")f=jn/2-a*(jn/2.4),u=Pr/2+c*(jn/2.4)*Tt.nav.widthScale;else if(Un==="phone"){let h=Pr/7;u=6*h+h*(o/4),f=jn/2+c/.62*jn*.36}else{let h=jn/7;f=6*h+h*(o/4),u=Pr/2+c/.62*Pr*.36}s+=`${o?"L":"M"}${u.toFixed(1)} ${f.toFixed(1)}`}n.push(s)}return n.join("")}function wA(){ED(),Ec.setAttribute("viewBox",`0 0 ${Pr.toFixed(1)} ${jn.toFixed(1)}`);for(let e=0;e<7;e++)Rc[e].setAttribute("d",RD(Dt[e]));Qi.setAttribute("d",CD());let t=Un==="desktop";for(let e=0;e<7;e++)Cr[e].style.top=t?`${yn[e].toFixed(1)}px`:"";ao.style.top=t?`${(yn[6]+12).toFixed(1)}px`:"",Cc.style.top=t?`${yn[3].toFixed(1)}px`:"",Qv=NaN}function PA(){let t=Wm?Jo.x:Xm(kf);return t+=Kr.x+ey,t}function AA(t,e){t.style.transform=Un==="phone"?`translate3d(${(e-.5).toFixed(1)}px,0,0)`:`translate3d(0,${(e-.5).toFixed(1)}px,0)`}function PD(t){if(!un)return;Wm&&(Jo.step(t),fe.now>CA&&(Jo.target=Xm(kf),Math.abs(Jo.x-Jo.target)<.3&&Math.abs(Jo.v)<2&&(Wm=!1))),(Kr.x!==0||Kr.v!==0)&&(Kr.step(t),Kr.target===0&&Math.abs(Kr.x)<.05&&Math.abs(Kr.v)<.5&&Kr.snap(0));let e=PA();Math.abs(e-Qv)<.05||(Qv=e,AA(EA,e),lo&&AA(lo,e))}function Wa(t,e,n,i){let r=Cr[t];r&&(r["_"+e]&&$n(r["_"+e]),r.setAttribute(e,e==="data-glint"?i||"electrum":""),r["_"+e]=Qe(n,()=>{r["_"+e]=0,r.removeAttribute(e)}))}function Kv(){let t=!!(Y.data&&Y.data.nadirOpen),e=Cr[6],n=ce.NADIR;e.setAttribute("aria-label",t?n.nameOpen:n.name),e.querySelector(".kn-name").textContent=t?n.nameOpen:n.name;let i=Y.data?Y.data.shards|0:0;e.querySelector(".kn-level").textContent=t?`▽ ${n.giant}`:"●".repeat(i)+"○".repeat(5-i)}function ny(t){if(t!==Vm){if(Vm>=0&&Cr[Vm].classList.remove("is-hot"),Vm=t,t<0){Gm.classList.remove("is-on");return}Cr[t].classList.add("is-hot"),Gm.style.transform=`translate3d(0,${(yn[t]-.5).toFixed(1)}px,0)`,Gm.classList.add("is-on"),Zn.audio&&Zn.audio.play("hoverTick",{x:be.w-52})}}function $m(t){Un!=="desktop"&&(t=!1),t!==bA&&(bA=t,t?un.setAttribute("data-expanded",""):(un.removeAttribute("data-expanded"),ny(-1)))}var iy=t=>`#/${ce[t].slug}`;function ty(t,e="nav"){Zn.director&&Zn.director.go(iy(Nn[t]),{source:e})}function ID(){let t=Zn.director;return t&&t.busy()&&t.state.to?t.state.to.room:Q.room}function LD(t){if(t.preventDefault(),Un!=="desktop")return;let e=t.deltaY;if(t.deltaMode===1?e*=16:t.deltaMode===2&&(e*=be.h),(fe.now-SA>600||Math.sign(e)!==Math.sign(Tc))&&(Tc=0),SA=fe.now,Tc+=e,Math.abs(Tc)<Tt.nav.wheelPxPerDetent)return;let n=Math.sign(Tc);Tc=0;let i=zo(ID(),n);i&&(Zn.audio&&Zn.audio.play("tick",{}),Zn.director.go(iy(i),{source:"nav"}))}var ye={id:-1,row:-1,x0:0,y0:0,p0:0,left:0,top:0,moved:!1,mode:null,done:!1,timers:[],v:0,lastP:0,lastT:0,target:-1,from:0,u0:0,pull:0,pullTimer:0,mapDy:0};function ry(t){return Un==="phone"?t.clientX-ye.left:t.clientY-ye.top}var Hm=(t,e)=>setTimeout(e,t);function sy(){for(let t of ye.timers)clearTimeout(t);ye.timers.length=0,ye.pullTimer&&(clearTimeout(ye.pullTimer),ye.pullTimer=0)}function Ym(){Cc.classList.remove("is-on"),gr.style.transition="none",gr.style.strokeDashoffset="1"}function DD(t){if(ye.id>=0||t.pointerType==="mouse"&&t.button!==0)return;let e=un.getBoundingClientRect();ye.id=t.pointerId,ye.left=e.left,ye.top=e.top,ye.x0=t.clientX,ye.y0=t.clientY,ye.moved=!1,ye.mode=null,ye.done=!1,ye.v=0,ye.target=-1,ye.p0=ye.lastP=ry(t),ye.lastT=t.timeStamp,ye.row=zf(ye.p0),Math.abs(ye.p0-yn[ye.row])>30&&(ye.row=-1);try{un.setPointerCapture(t.pointerId)}catch{}ye.row===3?(ye.timers.push(Hm(Ae.relaunchRingDelay,()=>{Cc.classList.add("is-on"),gr.style.transition="none",gr.style.strokeDashoffset="1",requestAnimationFrame(()=>{gr.style.transition=`stroke-dashoffset ${Ae.relaunch-Ae.relaunchRingDelay}ms linear`,gr.style.strokeDashoffset="0"})})),ye.timers.push(Hm(Ae.relaunch,()=>{ye.done=!0,Ym(),Yr(Xr.lock),Q.room!=="CORE"&&Zn.director&&Zn.director.go("#/core",{source:"nav"}),ge.emit("relaunch",{})}))):ye.row>=0&&ye.timers.push(Hm(Ae.longPress,()=>{ye.done=!0,Zn.hint&&Zn.hint.swing()}))}function ND(t,e,n){sy(),Ym();let i=Un==="phone"?e:n,r=Un==="phone"?n:e;if(ye.row===0&&i<0&&Math.abs(i)>=Math.abs(r)*.5){ye.mode="pull";return}if(Un==="phone"&&n<0&&Math.abs(n)>Math.abs(e)){ye.mode="map";return}let s=Zn.director;if(!s){ye.mode="none";return}let o=ry(t);if(s.busy()){if(!s.scrub.begin(s.state.to.hash)){ye.mode="detent";return}ye.target=Bf(s.state.to.room),ye.from=o,ye.u0=s.state.u,ye.mode="scrub";return}let a=Xm(ce[Q.room].alt),l=Math.sign(o-a)||Math.sign(i)||1,c=zf(o);if((c===Bf(Q.room)||Math.abs(o-a)<12)&&(c=Bf(Q.room)+l),c<0||c>6){ye.mode="none";return}if(ye.target=c,ye.from=a,ye.u0=0,!s.scrub.begin(iy(Nn[c]))){ye.mode="detent";return}ye.mode="scrub"}function FD(t){let e=yn[ye.target]-ye.from;return Math.abs(e)<1?1:Math.max(0,Math.min(1,ye.u0+(t-ye.from)/e*(1-ye.u0)))}function OD(t){if(t.pointerId!==ye.id){Un==="desktop"&&t.pointerType==="mouse"&&ye.id<0&&UD(t);return}let e=t.clientX-ye.x0,n=t.clientY-ye.y0;if(!ye.moved){let s=Math.hypot(e,n);if(s>=Zi.SLOP_PX/2&&ye.timers.length&&!ye.done&&(sy(),Ym()),s<Zi.SLOP_PX)return;if(ye.moved=!0,ye.done){ye.mode="none";return}ND(t,e,n)}let i=ry(t),r=Math.max(1,t.timeStamp-ye.lastT);if(ye.v+=((i-ye.lastP)/r-ye.v)*Math.min(1,r/60),ye.lastP=i,ye.lastT=t.timeStamp,ye.mode==="scrub")Zn.director.scrub.set(FD(i));else if(ye.mode==="pull"){let s=yn[0]-i;Un==="phone"?s+=Math.max(0,ye.top-t.clientY):Un==="land"&&(s+=Math.max(0,ye.left-t.clientX)),ye.pull=Math.max(0,s),Kr.snap(-Math.min(Tt.nav.rubberMax,ye.pull*Tt.nav.rubber)),ye.pull>=Tt.nav.overpullPx&&!ye.pullTimer?ye.pullTimer=Hm(Ae.overpullHold,()=>{ye.pullTimer=0,ye.done=!0,ye.mode="none",Kr.target=0,Zn.director&&Zn.director.go("#/zenith",{source:"overpull"})}):ye.pull<Tt.nav.overpullPx&&ye.pullTimer&&(clearTimeout(ye.pullTimer),ye.pullTimer=0)}else ye.mode==="map"&&(ye.mapDy=t.clientY-ye.y0);Un==="desktop"&&(ye.mode==="scrub"||ye.mode==="detent")&&ny(zf(i))}function TA(t,e){if(t.pointerId!==ye.id)return;ye.id=-1,sy(),Ym();let n=Zn.director,i=ye.lastP;if(ye.mode==="scrub"&&n)if(e)n.scrub.end(-4);else{let r=ye.v*1e3/(yn[ye.target]-ye.from||1),s=Tt.nav.magnetPx;Math.abs(i-yn[ye.target])<=s?r=Math.max(r,2):Math.abs(i-ye.from)<=s&&(r=Math.min(r,-2)),n.scrub.end(r)}else if(ye.mode==="pull")Kr.target=0;else if(ye.mode==="detent"&&!e){let r=zf(i);r!==Bf(Q.room)&&ty(r)}else ye.mode==="map"&&!e?ye.mapDy<=-40&&Zn.navMap&&Zn.navMap.open():!ye.moved&&!ye.done&&!e&&ye.row>=0&&ty(ye.row);ye.mode=null}function UD(t){$m(!0);let e=be.h/2-jn/2,n=t.clientY-e,i=zf(n);ny(Math.abs(n-yn[i])<=22?i:-1)}function Bi(t,e,n,i){let r=document.createElement(t);return e&&(r.className=e),i&&(r.id=i),n.appendChild(r),r}function oo(t,e,n){let i=document.createElementNS(TD,t);return e&&i.setAttribute("class",e),n.appendChild(i),i}function kD(){un=document.createElement("nav"),un.id="keynav",un.setAttribute("aria-label","КЛЮЧ"),Ec=oo("svg","kn-draw",un),Ec.setAttribute("aria-hidden","true"),Ec.setAttribute("preserveAspectRatio","none");for(let n=0;n<7;n++){let i=oo("path","kn-stratum",Ec);i.setAttribute("data-stratum",Qo[n]),i.setAttribute("pathLength","1"),Rc.push(i)}Qi=oo("path","kn-crack",Ec),Qi.setAttribute("pathLength","1"),Qi.style.strokeDasharray="1",Qi.style.strokeDashoffset="1";for(let n=0;n<7;n++){let i=Nn[n],r=ce[i],s=Bi("button","kn-row",un);s.type="button",s.dataset.sign=Qo[n],s.dataset.room=i,s.style.setProperty("--i",String(n)),s.setAttribute("aria-label",r.name);let o=Bi("span","kn-letter t-label",s);o.textContent=Qo[n];let a=Bi("span","kn-text",s),l=Bi("span","kn-head",a);Bi("span","kn-code t-label",l).textContent=`${Qo[n]} · ${r.code}`,Bi("span","kn-name t-body t-body--15 t-body--em",l).textContent=r.name,Bi("span","kn-level t-micro",a).textContent=`▽ ${r.giant}`,s.addEventListener("click",c=>{c.detail===0&&ty(n)}),Cr.push(s)}Gm=Bi("i","kn-tick",un),EA=Bi("i","",un,"keynav-needle"),lo=oo("svg","kn-twin",un),lo.setAttribute("viewBox","0 0 40 12"),RA=[oo("path","",lo),oo("path","",lo)],ao=Bi("div","",un,"keynav-slots");for(let n=0;n<5;n++)Bi("i","slot",ao);Uf=Bi("i","",un,"keynav-zenith"),Cc=Bi("div","",un,"keynav-ring");let t=oo("svg","",Cc);t.setAttribute("viewBox","0 0 44 44");let e=oo("circle","track",t);e.setAttribute("cx","22"),e.setAttribute("cy","22"),e.setAttribute("r","18"),gr=oo("circle","fill",t),gr.setAttribute("cx","22"),gr.setAttribute("cy","22"),gr.setAttribute("r","18"),gr.setAttribute("pathLength","1"),gr.style.strokeDasharray="1",gr.style.strokeDashoffset="1",Bi("span","t-label",Cc).textContent="ПЕРЕЗАПУСК",Jv=Bi("p","t-body t-body--15 t-body--em",un,"keynav-name"),un.addEventListener("pointerdown",DD),un.addEventListener("pointermove",OD),un.addEventListener("pointerup",n=>TA(n,!1)),un.addEventListener("pointercancel",n=>TA(n,!0)),un.addEventListener("pointerleave",n=>{ye.id<0&&n.pointerType==="mouse"&&$m(!1)}),un.addEventListener("wheel",LD,{passive:!1}),un.addEventListener("contextmenu",n=>n.preventDefault())}var Rr={el:null,init(t){Zn=t;let e=document.getElementById("chrome");return e&&(kD(),e.appendChild(un),Rr.el=un,wA(),Kv(),Rr.refreshSlots(),Y.data&&Y.data.nadirOpen&&(Qi.style.strokeDashoffset="0",Qi.classList.add("is-cool")),Rr.showZenith(!!(Y.data&&Y.data.found&&Y.data.found.S13)),Rr.setCurrent(Q.room||"CORE"),ge.on("layout:change",()=>{wA(),$m(!1)}),ge.on("secret:found",n=>{n.id==="S13"&&Rr.showZenith(!0)}),ge.on("room:arrive",()=>{try{n_().unread>0&&Rr.blink("S")}catch{}}),fe.add(PD,jt.UI)),Rr},show(t={}){if(!un)return Promise.resolve();let e=t.ms!=null?t.ms:Ae.drawIn;un.classList.add("is-shown");for(let n of Rc)n.style.transition="none",n.style.strokeDasharray="1",n.style.strokeDashoffset="1";return requestAnimationFrame(()=>{for(let n of Rc)n.style.transition=`stroke-dashoffset ${e}ms cubic-bezier(.16,1,.3,1),stroke .24s`,n.style.strokeDashoffset="0"}),new Promise(n=>Qe(e,()=>{for(let i of Rc)i.style.strokeDasharray="",i.style.strokeDashoffset="",i.style.transition="";n()}))},hide(){un&&(un.classList.remove("is-shown"),$m(!1))},setCurrent(t){Of=ce[t]?t:"CORE";let e=Bf(Of);for(let i=0;i<7;i++)i===e?Cr[i].setAttribute("aria-current","true"):Cr[i].removeAttribute("aria-current"),Rc[i].classList.toggle("is-current",i===e);let n=ce[Of];Jv&&(Jv.textContent=Of==="NADIR"&&Y.data&&Y.data.nadirOpen?n.nameOpen:n.name),kf=n.alt},setNeedle(t){kf=Number.isFinite(t)?t:0},lockTwin(){if(!lo||Un!=="desktop")return;lo.classList.add("is-on");let[t,e]=RA;ti(Ae.navTwin,n=>{let i=5*(1-n),r=3,s=3+2*(1-n),o="M0 6",a="M0 6";for(let l=2;l<=40;l+=2)o+=`L${l} ${(6+i*Math.sin(l/40*r*6.283)).toFixed(2)}`,a+=`L${l} ${(6+i*Math.sin(l/40*s*6.283+1)).toFixed(2)}`;t.setAttribute("d",o),e.setAttribute("d",a)}).done.then(()=>Qe(120,()=>lo.classList.remove("is-on")))},flashLetter(t,e,n){let i=Qo.indexOf(t);i>=0&&Wa(i,e==="electrum"||e==="white"?"data-glint":"data-flash",n||Ae.hintGlint,e)},flashAll(t,e="ember"){for(let n=0;n<7;n++)e==="electrum"||e==="white"?Wa(n,"data-glint",t||4200,e):Wa(n,"data-flash",t||4200)},blink(t){let e=Qo.indexOf(t);e>=0&&Wa(e,"data-blink",480)},shudder(t){let e=Qo.indexOf(t);if(e<0)return;let n=Cr[e];n.hasAttribute("data-shudder")?(n.removeAttribute("data-shudder"),requestAnimationFrame(()=>Wa(e,"data-shudder",1e3))):Wa(e,"data-shudder",1e3),t==="N"&&(ao.classList.add("is-flash"),Qe(Ae.shudder,()=>ao.classList.remove("is-flash")))},refreshSlots(){let t=Y.data?Math.min(5,Y.data.shards|0):0;if(ao)for(let e=0;e<5;e++)ao.children[e].classList.toggle("filled",e<t);Cr.length&&Kv()},slotPoint(t){let e=ao&&ao.children[Math.max(0,Math.min(4,t|0))];if(!e)return{x:be.w/2,y:be.h/2};let n=e.getBoundingClientRect();return{x:n.left+n.width/2,y:n.top+n.height/2}},letterPoint(t){let e=Math.max(0,Qo.indexOf(t)),n=Cr[e]&&Cr[e].firstChild;if(!n)return{x:be.w/2,y:be.h/2};let i=n.getBoundingClientRect();return{x:i.left+i.width/2,y:i.top+i.height/2}},crack(){return Qi?(Qi.classList.remove("is-cool"),Qi.style.transition="none",Qi.style.strokeDashoffset="1",requestAnimationFrame(()=>{Qi.style.transition="stroke-dashoffset 2.8s cubic-bezier(.2,0,0,1),stroke .6s",Qi.style.strokeDashoffset="0"}),Qe(1400,()=>{Kv(),Rr.setCurrent(Of)}),new Promise(t=>Qe(2800,()=>{Qi.classList.add("is-cool"),t()}))):Promise.resolve()},showZenith(t){Uf&&Uf.classList.toggle("is-on",!!t)},pullAboveS(t=20,e=600){let n=Xm(kf),i=yn[0]-t-n;ti(e,r=>{ey=i*Math.sin(Math.PI*r)}).done.then(()=>{ey=0})},swingTo(t,e=Ae.hintGlint){Jo.snap(PA()),Jo.target=t<0?yn[0]-Tt.nav.zenithDotAbove*2:yn[t],Wm=!0,CA=fe.now+900+e,t<0?(Uf.classList.add("is-ghost"),Qe(900+e,()=>Uf.classList.remove("is-ghost"))):Qe(450,()=>Wa(t,"data-glint",e))}};var IA="http://www.w3.org/2000/svg",oy=null,Ci=null,LA=[],DA=[],qm=0,Vf={id:-1,y0:0};function ay(){let t=!!(Y.data&&Y.data.nadirOpen),e=Q.room==="WORKSHOP"?"MEMBERS":Q.room;for(let n=0;n<7;n++){let i=Nn[n],r=ce[i],s=LA[n],o=i==="NADIR"&&!t;s.querySelector(".t-body").textContent=i==="NADIR"&&t?r.nameOpen:r.name,o?s.setAttribute("data-sealed",""):s.removeAttribute("data-sealed"),i===e?s.setAttribute("aria-current","true"):s.removeAttribute("aria-current"),DA[n].classList.toggle("is-current",i===e)}}function BD(t){let e=[];for(let n=0;n<2;n++)for(let i=0;i<=4;i++){let r=n===0?i/4:1-i/4,s=t.top+(t.bot-t.top)*r,o=t.top>0&&t.bot<0&&i===2?.62:Ft(s),a=36+(n===0?1:-1)*o*125*.45;e.push(`${a.toFixed(1)} ${(150-s*125).toFixed(1)}`)}return`M${e.join("L")}Z`}var xr={isOpen:!1,init(t){oy=t;let e=document.getElementById("sheets");if(!e)return xr;Ci=document.createElement("div"),Ci.id="map",Ci.hidden=!0,Ci.setAttribute("role","dialog"),Ci.setAttribute("aria-label","КАРТА");let n=document.createElement("div");n.className="map-head";let i=document.createElement("p");i.className="t-label",i.textContent="КАРТА · VIN";let r=document.createElement("button");r.type="button",r.className="verb",r.textContent="ЗАКРЫТЬ",r.addEventListener("click",()=>xr.close()),n.append(i,r);let s=document.createElement("div");s.className="map-body";let o=document.createElementNS(IA,"svg");o.setAttribute("class","map-draw"),o.setAttribute("viewBox","0 0 72 300"),o.setAttribute("preserveAspectRatio","xMidYMin meet"),o.setAttribute("aria-hidden","true");for(let l of Dt){let c=document.createElementNS(IA,"path");c.setAttribute("d",BD(l)),o.appendChild(c),DA.push(c)}let a=document.createElement("div");return a.className="map-rows",LA=Nn.map(l=>{let c=ce[l],u=document.createElement("button");u.type="button",u.className="map-row",u.dataset.room=l;let f=document.createElement("span");f.className="t-micro",f.textContent=`▽ ${c.level}`;let h=document.createElement("span");h.className="t-label",h.textContent=`${c.num} · ${c.code}`;let d=document.createElement("span");return d.className="t-body",d.textContent=c.name,u.append(f,h,d),u.addEventListener("click",()=>{xr.close(),oy.director&&oy.director.go(`#/${c.slug}`,{source:"nav"})}),a.appendChild(u),u}),s.append(o,a),Ci.append(n,s),Ci.addEventListener("pointerdown",l=>{Vf.id=l.pointerId,Vf.y0=l.clientY}),Ci.addEventListener("pointerup",l=>{l.pointerId===Vf.id&&l.clientY-Vf.y0>60&&xr.close(),Vf.id=-1}),e.appendChild(Ci),ge.on("room:arrive",ay),ge.on("nadir:open",ay),xr},open(){!Ci||xr.isOpen||(qm&&(qm=0),ay(),xr.isOpen=!0,Ci.hidden=!1,Ci.classList.add("is-closing"),requestAnimationFrame(()=>requestAnimationFrame(()=>Ci.classList.remove("is-closing"))))},close(){if(!Ci||!xr.isOpen)return;xr.isOpen=!1,Ci.classList.add("is-closing");let t=++qm;Qe(480,()=>{t===qm&&!xr.isOpen&&(Ci.hidden=!0)})}};var er=(t,e,n,i,r,s,o=!1)=>Object.freeze({id:t,name:e,where:n,note:i,line:r,hintRoom:s,timeGated:o}),ly=Object.freeze([er("S01","РЕЗОНАНС","CORE","G4","Песок написал имя.","CORE"),er("S02","БЕСКОНЕЧНОСТЬ","CORE","A4","Ты всё ещё внутри SAM.VIN.","CORE"),er("S03","ГОЛОВОКРУЖЕНИЕ","CORE","B4","Ключ закружился на {p}%.","CORE"),er("S04","ВСЕ ВМЕСТЕ","MEMBERS","D5","Весь клан откликнулся вместе.","MEMBERS"),er("S05","ПОЗЫВНОЙ","anywhere","E5","Система узнала тебя.","CORE"),er("S06","МАСТЕРСКАЯ","MEMBERS","G5","Твой знак вырезан.","MEMBERS"),er("S07","КИТ","any hall","A5","Ты видел кита.",null,!0),er("S08","ИЗНАНКА","CORE","B5","Ты видел изнанку.","CORE"),er("S09","ДРОН","any hall","D6","Ты поймал дрона.","CURRENT"),er("S10","НОЧЬ","any","E6","Ты видел, как VIN спит.",null,!0),er("S11","ЧАСТОТА","SIGNAL","G6","Тайная частота: {freq}.","SIGNAL"),er("S12","КАПСУЛА","INSIGNIA","A6","Капсула открылась.",null,!0),er("S13","ЗЕНИТ","navigator","B6","Ты был над всем.","ZENITH"),er("S14","СПУТНИК","CORE","D7","{name} прилетела и осталась.",null,!0)]),NA=Object.freeze(["S01","S03","S04","S02","S06","S09","S08","S11","S13","S05"]),FA=Object.freeze(["S07","S10","S12","S14"]),zD=new Map(ly.map(t=>[t.id,t]));function jm(t){return zD.get(t)||null}var $a=null,Pc=null,OA=t=>!!(Y.data&&Y.data.found&&Y.data.found[t]);function UA(t){let e=Pc;if(!e||fe.now-e.at>Ae.hintArriveWindow){Pc=null;return}e.room===t&&(Pc=null,ge.emit("hint:arrive",{secret:e.secret,room:t,source:"hint"}))}var Gf={playMotion(t,e={source:"show"}){ge.emit("hint:arrive",{secret:t,room:Q.room,source:e&&e.source||"show"})},init(t){return $a=t,t.hint=Gf,ge.on("room:arrive",e=>UA(e.room)),Gf},target(){for(let t of NA){if(OA(t))continue;let n=jm(t).hintRoom;return n==="CURRENT"&&(n=Q.room),{secret:t,room:n,kind:"secret"}}return FA.some(t=>!OA(t))?{secret:null,room:null,kind:"time"}:{secret:null,room:null,kind:"done"}},swing(){let t=Gf.target(),e=$a&&$a.keyNav,n=3;return t.kind==="secret"&&(n=t.room==="ZENITH"?-1:Math.max(0,Nn.indexOf(t.room==="WORKSHOP"?"MEMBERS":t.room))),e&&e.swingTo&&e.swingTo(n),t.kind!=="secret"&&$a.status&&$a.status.say(t.kind==="time"?"hint.time":"hint.done"),Q.hintTarget={secret:t.secret,room:t.room,at:fe.now},ge.emit("hint:swing",{secret:t.secret,room:t.room}),Pc=t.kind==="secret"&&ce[t.room]?{secret:t.secret,room:t.room,at:fe.now}:null,Pc&&Pc.room===Q.room&&!($a.director&&$a.director.busy())&&setTimeout(()=>UA(Q.room),0),t}};var VD=new Set(["ArrowUp","ArrowDown","PageUp","PageDown","Home","Escape"]),GD=t=>!!t&&(t.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName||"")),BA=t=>{let e=/^(?:Digit|Numpad)([1-7])$/.exec(t);return e?Number(e[1])-1:-1};function kA(t,e){let n=BA(t.code);if(n>=0)return`#/${ce[Nn[n]].slug}`;switch(t.key){case"ArrowUp":case"PageUp":{let i=zo(e,-1);return i?`#/${ce[i].slug}`:""}case"ArrowDown":case"PageDown":{let i=zo(e,1);return i?`#/${ce[i].slug}`:""}case"Home":case"Escape":return"#/core";default:return null}}var zA=[];function HD(t){let e=zA;for(let n=e.length-1;n>=0;n--)try{if(e[n].fn(t)===!0)return!0}catch{}return!1}function VA(t){window.addEventListener("keydown",e=>{if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.altKey)return;let n=e.key==="Escape";if(GD(e.target)){n&&t.sheet&&t.sheet.state!=="closed"&&t.sheet.close();return}if(n&&t.navMap&&t.navMap.isOpen){t.navMap.close(),e.preventDefault();return}if(zA.length&&HD(e)){e.preventDefault();return}if(Q.booting&&t.input.offerKey&&t.input.offerKey(e)){e.preventDefault();return}let i=t.director;if(i&&i.busy()){if(n&&i.playing){i.speedUp(),e.preventDefault();return}let r=i.state.to?i.state.to.room:Q.room,s=kA(e,r);if(s!=null){s&&i.go(s,{source:"kbd"}),e.preventDefault();return}e.key!=="Tab"&&e.key!=="Shift"&&e.key.length&&i.speedUp();return}if(t.halls&&t.halls.call(Q.room,"onKey",e)===!0){e.preventDefault();return}if(e.code==="KeyM"){t.audio&&t.audio.toggle();return}if(i&&(VD.has(e.key)||BA(e.code)>=0)){let r=kA(e,Q.room);r&&i.go(r,{source:"kbd"}),e.preventDefault()}})}var As={t0:null,nLockAt:null,ignitionAt:null,idleAt:null};tn("boot",()=>({...As}));var Zm=()=>typeof performance<"u"?performance.now():Date.now(),GA=!1,uy=!1;function cy(t){uy||(uy=!0,t.status&&t.status.say(t.input.pointer.lastMove?"boot.pointer":"boot.nopointer"))}function HA(t,e){t.wake=p=>WA(t,p),As.t0=Zm(),As.nLockAt=null,As.ignitionAt=null,As.idleAt=null,GA||(GA=!0,t.bus.on("relaunch",()=>WD(t)));let n=t.key,i=Et.reducedMotion,r=[],s=[],o=!1,a,l=new Promise(p=>{a=p}),c=(p,m)=>r.push(Qe(p,m)),u=(p,m,_)=>{let w=ti(p,m,_);return s.push(w),w};Q.booting=!0,uy=!1,Q.phase!=="boot"&&Vi("boot");let f=()=>{As.ignitionAt==null&&(As.ignitionAt=Zm()),n&&(n.ignite({color:Q.night?"electrum":"ember",flash:!0}),t.bus.emit("boot:ignite",{returning:Y.returning}))},h=p=>{t.chrome&&(p?Promise.resolve():t.chrome.typeIn()).then(()=>t.chrome.assemble(p?0:void 0)),t.keyNav&&t.keyNav.show(p?{ms:0}:{}),t.edges&&t.edges.drawIn(p?0:void 0)},d=p=>{if(!o){o=!0;for(let m of r)$n(m);for(let m of s)m.cancel();x(),p&&(n&&(n.setScramble([0,0,0,0,0,0,0]),n.setReveal({points:1,scanY:null,fill:1,alpha:1}),f(),n.shootAxis(3.2,0)),t.nest&&t.nest.setFade(1,1),h(!0)),t.composite&&t.composite.setGrain(.02),t.datum&&t.datum.arrive("CORE",{instant:!!p}),t.rim&&t.rim.showName(),n&&(n.setBreathingRing(!0),n.setIdle(!0),n.setInteractive(!0)),cy(t),Vi("idle"),Q.booting=!1,As.idleAt=Zm(),t.bus.emit("boot:done",{returning:Y.returning,sameDay:Y.sameDaySession,phone:be.isPhone}),a()}},g={name:"boot",onGesture(p){return(p.type==="down"||p.type==="tap"||p.type==="wheel"||p.type==="dragstart")&&d(!0),!0},onKey(){return d(!0),!0}},x=t.input.push(g);if(!n){let p=t.t0&&t.t0.boot?t.t0.boot({phone:be.isPhone,returning:Y.returning,sameDay:Y.sameDaySession,reduced:i}):Promise.resolve();return h(!1),p.then(()=>d(!1),()=>d(!1)),l}return t.nest&&t.nest.setFade(1,0),t.audio&&t.audio.play("bootSwell",{}),i?(c(200,()=>{t.nest&&u(400,p=>t.nest.setFade(1,p))}),c(300,()=>u(400,p=>n.setReveal({points:p,scanY:null,fill:p,alpha:p}))),c(700,()=>{f(),cy(t),n.shootAxis(3.2,0),h(!1)}),c(1e3,()=>d(!1)),l):(n.setScramble("golden"),c(600,()=>{t.nest&&u(1e3,p=>t.nest.setFade(1,p),An.reveal)}),c(1300,()=>h(!1)),c(900,()=>u(400,p=>n.setReveal({points:p,scanY:null,fill:p,alpha:p}),An.reveal)),c(1e3,()=>{n.lockSequence({order:"down",stepMs:220,spin:!1,snap:.04}).then(()=>{o||(As.nLockAt==null&&(As.nLockAt=Zm()),f(),cy(t),n.shootAxis(3.2,240).then(()=>{o||d(!1)}))})}),l)}function WA(t,e={show:!1}){let n=t.key;if(t.fx&&t.fx.pieces&&typeof t.fx.pieces.wakeReset=="function")try{t.fx.pieces.wakeReset()}catch{}return n?n.lockSequence({order:"down",stepMs:220,spin:!1,snap:.04}).then(()=>{n.ignite({color:Q.night?"electrum":"ember",flash:!0}),t.bus.emit("boot:ignite",{returning:!0,wake:!0}),t.audio&&t.audio.play("signature",{found:t.secrets?t.secrets.found():[]})}):Promise.resolve()}async function WD(t){let e=t.key,n=t.fx&&t.fx.pieces;if(n&&typeof n.fold=="function")try{await n.fold({context:"relaunch"})}catch{}if(t.status&&t.status.say("relaunch"),!e)return;e.setScramble("golden"),e.douse();let i=null;i=t.input.push({name:"relaunch",onGesture(r){return r.type!=="tap"&&r.type!=="down"||Q.room!=="CORE"||e.pick(r.x,r.y)<0?!1:(r.type==="down"||(i(),WA(t,{show:!1})),!0)}})}function $D(t,e){let n=Dr(Mt.operator.name||""),i=38,r=[],s=null,o=1,a=!1,l=0,c=document.createElement("div");Object.assign(c.style,{position:"absolute",left:"50%",top:`calc(50% + ${(fy*50).toFixed(1)}vh + 24px)`,transform:"translateX(-50%)",textAlign:"center",whiteSpace:"nowrap",color:"var(--silver)"}),c.hidden=!0;let u=document.createElement("p");u.className="t-label",u.setAttribute("aria-hidden","true"),u.style.margin="0";let f=document.createElement("p");f.className="t-micro",f.setAttribute("aria-hidden","true"),f.style.margin="4px 0 0",f.style.opacity="0.7",c.appendChild(u),c.appendChild(f);let h=document.createElement("span");h.className="sr-only",h.textContent=n,t&&(t.appendChild(c),t.appendChild(h));let d=[];function g(){u.textContent="",d.length=0,[n].concat(r).forEach((p,m)=>{m&&u.appendChild(document.createTextNode("   "));let _=document.createElement("span");_.textContent=p,u.appendChild(_),d.push(_)}),f.textContent=s||"",f.hidden=!s,c.style.opacity=String(o)}g();let x={group:null,burn(p){let m=p&&Number.isFinite(p.at)?p.at:null,_=m!=null?Math.max(0,m-performance.now()):0;return _<=0?(x.showName(),Promise.resolve()):new Promise(w=>Qe(_,()=>{x.showName(),w()}))},showName(){a=!0,c.hidden=!(o>0)},burnGuests(p){return r=(Array.isArray(p)?p:[]).map(m=>Dr(String(m||""))).filter(Boolean),g(),x.showName(),Promise.resolve()},clearGuests(){r=[],g()},rows(){return[n].concat(r).map(p=>({text:p,heightM:i,row:0}))},setRole(p){s=p?Dr(String(p)):null,g()},namePoint(p,m){let _=m||{x:0,y:0},w=d[Math.max(0,Math.min(d.length-1,p|0))],v=w&&!c.hidden?w.getBoundingClientRect():null;return v&&v.width?(_.x=v.left+v.width/2,_.y=v.top+v.height/2):(_.x=be.w/2,_.y=be.h*.85),_},letterHeightM(){return i},setLitNodes(p){l=Math.max(0,p|0)},setAlpha(p){o=Math.max(0,Math.min(1,+p||0)),c.style.opacity=String(o),c.hidden=!a||!(o>0)}};return e&&tn("rim",()=>x.rows()),x}var XD="http://www.w3.org/2000/svg",fy=.56;function Km(t,e,n){let i=document.createElementNS(XD,t);for(let r in e)i.setAttribute(r,e[r]);return n&&n.appendChild(i),i}function YD(){let t=Km("svg",{viewBox:"-0.8 -1.3 1.6 2.6","aria-hidden":"true"});Object.assign(t.style,{position:"absolute",left:"50%",top:"50%",height:`${fy*100}vh`,transform:"translate(-50%,-50%)",overflow:"visible"});for(let e of Dt){let n=[],i=e.top>0&&e.bot<0?[e.top,0,e.bot]:[e.top,e.bot];for(let r of i)n.push(`${Ft(r).toFixed(3)},${(-r).toFixed(3)}`);for(let r=i.length-1;r>=0;r--)n.push(`${(-Ft(i[r])).toFixed(3)},${(-i[r]).toFixed(3)}`);if(Km("polygon",{points:n.join(" "),fill:"none",stroke:"var(--silver)","stroke-width":"1","vector-effect":"non-scaling-stroke"},t),e.sign!=="•"){let r=Km("text",{x:"0",y:(-e.mid).toFixed(3),"text-anchor":"middle","dominant-baseline":"central",fill:"var(--pewter)"},t);r.style.font='500 0.07px "Martian", ui-monospace, monospace',r.style.letterSpacing="0.008px",r.textContent=e.sign}}return Km("circle",{cx:"0",cy:"0",r:"0.022",fill:"var(--ember)"},t),t}function Jm(t){let e=document.getElementById("t0"),n={},i=!1,r="CORE",s=YD();if(e){e.textContent="",Object.assign(e.style,{background:"var(--void)"}),e.appendChild(s);for(let l of Object.keys(ce)){let c=document.createElement("section");c.dataset.room=l,c.hidden=l!=="CORE",Object.assign(c.style,{position:"absolute",left:"var(--title-x)",top:"calc(var(--datum-y) + 36px)"});let u=document.createElement("p");u.className="t-micro",u.textContent=`${ce[l].num} · ${ce[l].code} · ▽ ${ce[l].level}`,c.appendChild(u),e.appendChild(c),n[l]=c}e.hidden=t.app.tier!=="T0"}let o=$D(e,t.app.tier==="T0"),a={root:e,rim:o,twin(l,c){},boot(l){return new Promise(c=>Qe(600,c))},show(l){let c=l&&ce[l.room]?l.room:"CORE";r=c;for(let u in n)n[u].hidden=u!==c;s.style.display=c==="CORE"?"":"none"},keyScreen(){return{x:be.w/2,y:be.h/2,r:be.h*fy/2}},showLost(){let l=r;i=!0,e&&(e.hidden=!1),a.show({room:"CORE"}),r=l},hideLost(){i&&(i=!1,e&&t.app.tier!=="T0"&&(e.hidden=!0),a.show({room:r}))}};return a}function $A(t,e,n){return new Promise(i=>{requestAnimationFrame(()=>i())})}var tr=null,hy={x:0,y:0,depth:0,visible:!1},co=(t,e)=>t&&typeof t[e]=="function";function qD(t){return t&&t.isVector3&&Pe.camera?(Pe.project(t,hy),{x:hy.x,y:hy.y}):t&&Number.isFinite(t.x)&&Number.isFinite(t.y)?{x:t.x,y:t.y}:{x:be.w/2,y:be.h/2}}function Hf(t,e){let n=tr&&tr.status;co(n,"say")&&n.say(t,e||{})}async function jD(t,e){let n=Y.data,i=tr&&tr.keyNav,r=n.shards<5&&!n.nadirOpen,s=r&&co(i,"slotPoint")?i.slotPoint(n.shards):co(i,"letterPoint")?i.letterPoint("I"):{x:be.w/2,y:be.h/2},o=Y.rank().index;try{await $A(t,e,s)}catch{}r&&Y.patch(l=>{l.shards=Math.min(5,(l.shards|0)+1)}),co(i,"refreshSlots")&&i.refreshSlots(),Ye.play("shard",{}),Yr(Xr.shard),tr&&co(tr.chrome,"relockFound")&&tr.chrome.relockFound(),Hf("found"),r&&n.shards<5&&Hf("shard",{k:n.shards}),ge.emit("shard:landed",{id:t,k:n.shards,count:Ts.count()});let a=Y.rank();if(a.index>o&&(ge.emit("rank:change",{rank:a.name,index:a.index}),Hf("rank",{rank:a.name.toLocaleLowerCase("ru")}),co(Ye,"setRank")&&Ye.setRank(a.index)),r&&n.shards>=5&&!n.nadirOpen){Hf("shard",{k:5});let l=tr&&tr.fx&&tr.fx.pieces;if(co(l,"nadirUnseal"))try{await l.nadirUnseal()}catch{}if(Y.data.nadirOpen)return;Y.set("nadirOpen",!0),tr&&co(tr.lead,"show")&&tr.lead.show("Внизу что-то открылось.",{ms:3e3}),co(i,"crack")&&i.crack(),Hf("nadir.open"),ge.emit("nadir:open",{})}}var Ts={init(t){return tr=t,t.secrets=Ts,Ts},discover(t,e={}){if(!jm(t)||!Y.data||Ts.isFound(t))return!1;let n=e&&e.vars?{...e.vars}:{};Y.patch(r=>{r.found[t]=new Date(Date.now()).toISOString(),(!r.foundVars||typeof r.foundVars!="object")&&(r.foundVars={}),r.foundVars[t]=n});let i=qD(e&&e.anchor);return ge.emit("secret:found",{id:t,anchor:i}),jD(t,i),!0},isFound(t){return!!(Y.data&&Y.data.found&&Y.data.found[t])},found(){return ly.filter(t=>Ts.isFound(t.id)).map(t=>t.id)},count(){return Ts.found().length},rank(){return Y.rank()},get shards(){return Y.data?Y.data.shards|0:0}};var x9=Object.freeze([[1,2],[2,3],[1,4],[3,5],[2,7],[4,7]].map(t=>Object.freeze(t)));var P9=48;var N9=Object.freeze({legend:3,achievement:1.6,moment:1.2,joke:.8,before:3});var W9=Object.freeze(["stellated","twisted","nested","bipyramid","knot"]);var ZD=343,Xa=()=>performance.now(),KD=()=>({set(){},release(){},alive:!1});function XA(t,e){let n=Promise.resolve(),i={current:null,queue:[],run(x,p,m={maxWaitMs:1200}){let _=n.then(async()=>{i.current=x,Q.fx.stage=x;try{await(typeof p=="function"?p({reduced:!1,signal:{aborted:!1}}):null)}catch{}return i.current=null,Q.fx.stage=null,"ran"});return n=_.catch(()=>"ran"),_},busy(){return i.current!=null},deferToIdleCore(x,p){return i.run(x,p)}},r={at(x,p){let m=p||{},_=Qe(Math.max(0,x-Xa()),()=>{try{m.visual&&m.visual()}catch{}try{m.audio&&Ye.fx.ready()&&m.audio(Ye.fx.ctxTimeFor(x))}catch{}});return{cancel(){$n(_)}}},now(x){let p=x||{};try{p.visual&&p.visual()}catch{}try{p.audio&&Ye.fx.ready()&&p.audio()}catch{}},cancelAfter(x){},presentAt(x){return x+16.7},log(){return[]},nowPerf(){return Xa()}},s={lastPauseAt:-1/0,lastProsvetAt:-1/0,pause(x={}){let p=x&&Number.isFinite(x.at)?x.at:Xa();return s.lastPauseAt=p,new Promise(m=>Qe(Math.max(0,p+400-Xa()),()=>{let _=p+400;try{x&&x.onHit&&x.onHit(_)}catch{}m({hitAt:_,advanced:!1,skipped:!1})}))},inPause(){return!1},prosvet(x){return!1}},o={fire(x){let p=Xa();return{startAt:p,arrival:m=>p+1e3*(+m||0)/ZD,stop(){}}}},a={rack(x){return Promise.resolve()},set(){},clear(){}},l={run(x){return{stop(){}}},stopAll(){}},c={show(){},hide(){},set(){},rmLabel(){}},u={show(){},hide(){},state:()=>({visible:!1,heightPx:0})},f={enabled:!1,emitter(){return KD()},splat(){},impulse(){},sheet(){},stats:()=>({pool:0,live:0})},h=(x,p)=>{try{t.t0&&typeof t.t0.twin=="function"&&t.t0.twin(x,p)}catch{}},g={stage:i,cue:r,impact:s,wave:o,focus:a,pulse:l,scalebar:c,scaleFigure:u,dust:f,pieces:{titleFx(x){return{stop(){}}},swarf(){},fold(x){let p=t.key;return p?(p.setScramble("golden"),p.douse()):e&&h("close",{phase:"asleep",t01:1}),new Promise(m=>Qe(600,m))},wakeReset(){},owner(x){return Promise.resolve({hitAt:Xa(),rimAt:null,echoAt:null})},nadirUnseal(){return Promise.resolve({hitAt:Xa()})}},setLineAlpha(x,p){ae.uFxLineA.value=Math.max(0,+x||0)},fogFactor(x,p,m){br.factor(x,p)},ears:{tabReturn(){},descent(){},popAt(){}},provalFor(x){return new Promise(p=>Qe(Math.max(0,x||0),p))},setTier(x){},snapshot(){return{stage:i.current,queue:i.queue.slice(),impacts:[],prosvet:[],waveArrivalMs:null,timeScale:fe.timeScale,dust:f.stats()}}};return tn("fx",()=>g.snapshot()),tn("scaleBar",()=>null),tn("figure",()=>null),g}function YA(t){return XA(t,!1)}function Qm(t){return XA(t,!0)}var qA=["wait","finish","call","host","rope","gentle","notice","word"],t0={wait:0,finish:1,call:2,host:3,rope:4,word:5,notice:6},JD={wait:"КАПСУЛА",finish:"ЗОНД",call:"СБОР",host:"ГОСТИ",rope:"ВСЕ ВМЕСТЕ",word:"ДОГОВОРИЛИСЬ",notice:"ПОТЕРЯШКА"},Wf=["S","A","M","•","V","I","N"],QD=1,eN={SIGNAL:"Связь",ARCHIVE:"Летопись",MEMBERS:"Клан",VOYAGES:"Вылазки",INSIGNIA:"Хранилище",NADIR:"Исток"},e0=()=>Y.data||{},tN=t=>{for(let e of Object.keys(t0))if(t0[e]===t)return e;return null};function my(t){let e=Wf[t];if(!e)return null;let n=Mt.clan&&Mt.clan.code||[],i=typeof n[t]=="string"?n[t]:"",r=e0().code&&typeof e0().code[e]=="string"?e0().code[e]:null;if(!r||!i)return null;let s=tN(t);return{text:i,at:r,deedId:s,deedName:s?JD[s]:""}}function jA(){let t=[];for(let e=0;e<7;e++)my(e)&&t.push(e);return t}function nN(t){let e=/^(\d{4})-(\d{2})-(\d{2})/.exec(String(t||""));if(!e)return"";let n=new Date(Date.UTC(+e[1],+e[2]-1,+e[3])),i=n.getUTCDay()||7;n.setUTCDate(n.getUTCDate()+4-i);let r=new Date(Date.UTC(n.getUTCFullYear(),0,1)),s=Math.ceil(((n-r)/864e5+1)/7);return`${n.getUTCFullYear()}-W${String(s).padStart(2,"0")}`}var Ya=t=>typeof t=="string"?t.slice(0,10):null,py=t=>{let e=Mt.members.find(n=>n.id===t);return e?e.name:null};function ZA(){let t=e0(),e=[],n=(p,m,_,w,v,M,S,E)=>{let y={kind:p,id:m,date:_,label:w,title:v,text:M,who:S||[],height:QD};E&&Object.assign(y,E),e.push(y)},i=t.sbor||{},r=i.count|0,s=Ya(i.last);r>=1&&s&&n("sbor","sbor-all",s,`СБОРЫ · ${r}`,"Сборы клана",`Сборов: ${r}. Последний — ${go(s,"dd.mm.yyyy")}.`,[]);let o=new Map;for(let p of Array.isArray(i.here)?i.here:[]){let m=Ya(p&&p.day);!m||!Array.isArray(p.ids)||!p.ids.length||o.set(nN(m),{day:m,ids:p.ids.slice()})}let a=[...o.values()].sort((p,m)=>p.day<m.day?-1:p.day>m.day?1:0).slice(-30);for(let p of a){let m=p.ids.filter(_=>py(_));n("sbor",`sbor-${p.day}`,p.day,`СБОР · ${go(p.day,"dd.mm.yyyy")}`,"Сбор клана",`Здесь были: ${m.map(py).join(", ")}.`,m)}let l=t.lost||{},c=Array.isArray(l.log)?l.log.filter(p=>p&&Ya(p.day)&&(p.kind==="one"||p.kind==="pair")):[];c.sort((p,m)=>p.day<m.day?-1:p.day>m.day?1:0);let u=0,f=0,h=0;for(let p of c){h+=1;let m=p.kind==="pair"?++f:++u;if(m!==1&&m%10!==0)continue;let _=eN[p.room]||"Ядро",w=Ya(p.day);p.kind==="pair"?n("deed",`deed-${h}`,w,`ДЕЛО · ${go(w,"dd.mm.yyyy")}`,"Договорились",`Двое не слышали друг друга. Зал: ${_}. Ты помог им договориться.`,[],{sub:"pair"}):n("deed",`deed-${h}`,w,`ДЕЛО · ${go(w,"dd.mm.yyyy")}`,"Не прошёл мимо",`Маленький ключ потерялся. Зал: ${_}. Ты привёл его домой.`,[],{sub:"one"})}let d=t.shows||{},g=new Map;if(Array.isArray(d.log))for(let p of d.log){let m=Ya(p&&p.day);m&&g.set(m,p)}else Ya(d.lastDay)&&(d.count|0)>0&&g.set(Ya(d.lastDay),{day:d.lastDay,guests:0,who:[]});let x=Mt.operator.name;for(let[p,m]of g){let _=Array.isArray(m.who)?m.who.filter(v=>py(v)):[],w=Math.max(m.guests|0,_.length);n("show",`show-${p}`,p,`ПОКАЗ · ${go(p,"dd.mm.yyyy")}`,"Показ для гостей",`Гостей: ${w}. Вёл ${x}.`,_)}return e.sort((p,m)=>p.date<m.date?1:p.date>m.date?-1:0),e}function KA(t){let e={done(n,i={}){if(!qA.includes(n)||!Y.data)return!1;let r=Y.data;if((!r.deeds||typeof r.deeds!="object")&&(r.deeds={}),typeof r.deeds[n]=="string")return!1;let s=i&&typeof i.at=="string"?i.at:new Date().toISOString();Y.patch(c=>{c.deeds[n]=s}),ge.emit("deed:done",{id:n});let o=t0[n];if(o==null||!(Mt.clan.code||[])[o])return!0;let l=Wf[o];return(!r.code||typeof r.code!="object")&&(r.code={}),typeof r.code[l]!="string"&&(Y.patch(c=>{c.code[l]=s}),ge.emit("code:earned",{stratum:o})),!0},derive(){let n=Y.data;if(!n)return;n.found&&typeof n.found.S04=="string"&&e.done("rope"),n.capsuleOpened===!0&&e.done("wait");let i=n.probes||{};for(let r of Object.keys(i)){let s=i[r];if(s&&s.back&&s.read===!0){e.done("finish");break}}},law:n=>my(n),earned:()=>jA(),bands:()=>ZA(),setView(n){}};return ge.on("secret:found",n=>{n&&n.id==="S04"&&e.done("rope")}),ge.on("capsule:open",()=>e.done("wait")),ge.on("probe:read",n=>{let i=n&&Y.data&&Y.data.probes?Y.data.probes[n.code]:null;i&&i.back&&typeof i.sent=="string"&&ra(i.sent,Y.today)>0&&e.done("finish")}),e}function JA(t){t.deeds=KA(t),t.host={guests:{active:!1,list:()=>[],isHere:()=>!1,open(){},clear(){},letterHeightM:()=>38},show:{active:!1,scene:-1,start(){},next(){},prev(){},exit(){}},sbor:{attach(){},holdProgress(){},holdCancel(){},holdComplete:()=>Promise.resolve(),toggleHere(){},info:()=>({count:0,last:null,hint:!0})},lost:{today:()=>null,blocksDrone:()=>!1,snapshot:()=>null,setView(){}},proposals:{list:()=>[],openSheet(){},add:(n,i,r)=>null,remove(){},promoteFromWorld(){},proposedByName:()=>null}};try{t.deeds.derive()}catch{}t.host.proposals.promoteFromWorld();let e=()=>Y.data||{};tn("deeds",()=>Object.keys(e().deeds||{}).filter(n=>typeof e().deeds[n]=="string")),tn("code",()=>Wf.filter(n=>e().code&&typeof e().code[n]=="string")),tn("show",()=>({active:!!Q.show.active,scene:Q.show.scene})),tn("guests",()=>Q.guests|0),tn("sbor",()=>({count:(e().sbor&&e().sbor.count)|0})),tn("proposals",()=>Array.isArray(e().proposals)?e().proposals.length:0),tn("lost",()=>t.host.lost.snapshot())}var pe={world:Mt,state:Y,app:Q,bus:ge,loop:fe,quality:Rt,layout:be,input:Jt,audio:Ye,secrets:null,status:null,sheet:null,edges:null,hint:null,fog:null,palette:null,atlas:null,lead:null,overlay:null,dims:null,datum:null,chrome:null,keyNav:null,director:null,halls:null,renderer:null,scene:null,camera:null,rig:null,scale:null,nest:null,key:null,rim:null,lamp:null,U:null,worldFx:null,t0:null,composite:null,navMap:null,cursor:null,pillar:null,fx:null,host:null,deeds:null,wake:null};function Kn(t,e){try{return e(),!0}catch(n){return ft(`main:${t}`,`boot step "${t}" failed`,n),!1}}function QA(){Kn("env",()=>{Et.reducedMotion,eh()}),Kn("state",()=>{Pb(Ns());let a=Ns();Q.night=b0(a),Q.drowsy=o_(a),Q.birthday=S0(a),Q.owner=!!Y.data.owner,Q.inverted=!!Y.data.inverted,document.documentElement.style.setProperty("--shrp",String(Y.shrp)),Y.deliverTransmissions()}),Kn("fonts",()=>{Zl()});let t=null;Kn("quality",()=>{t=Rt.detect().gl}),Q.tier!=="T0"&&(Kn("webgl",()=>{pe.composite=iN(t)})||nT()),Q.tier==="T0"&&!pe.t0&&Kn("t0",()=>{pe.t0=Jm(pe),Q.tier="T0"}),Q.tier==="T0"&&(pe.rim=pe.t0&&pe.t0.rim?pe.t0.rim:pe.rim);let e=Kn("dom",()=>{pe.chrome=En,En.init(pe),pe.status=ai,ai.init(pe),pe.lead=If,If.init(pe),pe.overlay=Zr,Zr.init(pe),pe.dims=Om,Om.init(pe),pe.datum=Ef,Ef.init(pe),pe.edges=Nf,Nf.init(pe),pe.sheet=Tr,Tr.init(pe),pe.navMap=xr,xr.init(pe),pe.keyNav=Rr,Rr.init(pe),pe.cursor=Ff,Ff.init(pe),Q.tier==="T0"&&En.setT0Marker(!0)}),n=Kn("audio",()=>{Ye.init(pe)});Kn("fx",()=>{pe.fx=Q.tier==="T0"?Qm(pe):YA(pe)})||Kn("fx:t0",()=>{pe.fx=Qm(pe)});let i=Kn("input",()=>{Jt.init(pe),VA(pe)}),r=xs("#/core"),s=Kn("navigation",()=>{r=xs(location.hash),dt.init(pe),Mn.init(pe)}),o=Kn("secrets",()=>{Ts.init(pe)});Kn("host",()=>JA(pe)),o=Kn("hint",()=>{Gf.init(pe)})&&o,Kn("hook",()=>{hw(pe)}),Q.tier!=="T0"&&!(e&&n&&i&&s&&o)&&(nT(),Kn("t0",()=>{pe.t0=Jm(pe),pe.chrome&&En.setT0Marker(!0)}),pe.t0&&pe.t0.rim&&(pe.rim=pe.t0.rim),Kn("fx:t0",()=>{pe.fx=Qm(pe)})),Kn("loop",()=>{Rt.init(pe);let a=Q.tier!=="T0"?pe.composite:null;a?(rN(),fe.add(a.render,jt.RENDER),a.onFirstFrame(()=>document.body.classList.remove("is-ff"))):document.body.classList.remove("is-ff"),fe.start(),Q.tier!=="T0"&&Rt.benchmark(),ge.emit("app:ready",{})}),Kn("boot",()=>{let a=()=>HA(pe,r).then(()=>tT(r),l=>{ft("main:boot",l),tT(r)});pe.composite&&Q.tier!=="T0"?pe.composite.onFirstFrame(a):a()})}function eT(){let t=ct.core;return{pos:new C(...t.pos),target:new C(...t.target),fov:t.fov,offsetY:be.kind==="desktop"?0:t.phoneOffsetY,roll:0}}function iN(t){let e=RS(document.getElementById("gl"),t,Q.tier);return pe.renderer=e,pe.scene=e.scene,pe.camera=e.camera,pe.palette=ko,pe.U=ae,pe.fog=br,ko.init(),Kt.init(Q.tier),pe.atlas=Kt,br.set(ce.CORE.fog),it.init(e.scene,pe),pe.scale=it,pe.worldFx=new mn,pe.worldFx.name="worldFx",it.root.add(pe.worldFx),Fn.init(pe),pe.nest=Fn,pe.pillar=WS(),it.root.add(pe.pillar),pe.key=uw(pe),Fn.level(0).add(pe.key.group),fe.add(pe.key.update,jt.WORLD),pe.rim=mw(pe),it.root.add(pe.rim.group),ur.init(pe),pe.lamp=ur,Pe.init(e.camera),pe.rig=Pe,Pe.setPose(eT()),ge.on("layout:change",()=>{pe.director||Pe.setPose(eT())}),fe.add((n,i)=>{ae.uTime.value=i/1e3,ae.uWorldTime.value=fe.worldNow/1e3,ae.uBreath.value=Sn.mix(0,1)},jt.CLOCK),fe.add(n=>ur.update(n),jt.LAMP),fe.add(n=>Pe.apply(n),jt.CAMERA),ge.on("gl:lost",()=>{try{pe.t0||(pe.t0=Jm(pe)),pe.t0.showLost()}catch(n){ft("main:t0",n)}}),ge.on("gl:restored",()=>{pe.t0&&pe.t0.hideLost&&pe.t0.hideLost()}),NS(e)}function rN(){if(!(pe.renderer&&pe.renderer.three)||!pe.scene||!pe.camera)return;let e=[];pe.scene.traverse(n=>{n.visible||(e.push(n),n.visible=!0)});try{pe.renderer.warm(pe.scene,pe.camera,pe.scene)}catch(n){ft("main:warm",n)}for(let n of e)n.visible=!1}function tT(t){(Q.phase==="boot"||Q.phase==="start")&&Vi("idle"),Q.booting=!1,pe.director&&(pe.director.settle(),t&&(t.room!=="CORE"||t.sub)&&pe.director.go(t.hash,{source:"deeplink"}))}function nT(){pe.renderer=pe.scene=pe.camera=pe.key=pe.rim=pe.rig=pe.scale=pe.nest=pe.lamp=null,pe.composite=null,Rt.tier="T0",Q.tier="T0";let t=document.getElementById("gl");t&&(t.hidden=!0)}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",QA,{once:!0}):QA();})();
